// Stadt-Baukasten, Teil Fluss: der Fluss eines Orts (map/rivers.js) als ein Stück – Wasser bis in den Dunst, Kaimauern
// aus Stein mit breiter Uferkante, gepflasterte Uferwege links und rechts der Straße und die Straßenbrücke. Die Straße
// selbst bleibt, wie der Straßenbau sie baut (Fahrbahn, Bordstein, Gehweg laufen eben durch): die Brücke ist alles
// darunter und daneben – Platte, Randbalken mit Geländer, Endpfeiler und Strompfeiler. So gibt es an ihren Enden
// keine Fuge, keinen Sprung und keine zwei Flächen in derselben Ebene.
// Der Boden der Welt bekommt über dem Wasser ein Loch (xxl/ground.js setHoles); seine Kante liegt unter der Uferkante.
// Alles Feste ist ein verschmolzenes Mesh im matten Material des Baukastens, das Wasser ein zweites mit eigenem
// Material (ruhige, wandernde Wellen; die Zeit kommt aus core.uWater, kostet also nichts je Bild).
import * as THREE from 'three';
import { Bau, compose, mix } from './citycore.js';
import { STREET } from './layout.js';

// Farben: Kaimauer und Uferkante aus hellem Stein, Uferweg aus Platten mit einem Band aus Kopfsteinpflaster
const STONE = 0xc7b9a6;
const COPING = 0xded3c2;
const PAVE = 0xcfc8ba;
const COBBLE = 0xb3aa9c;
const DECK = 0x8f8a84;
const PIER = 0xb6a996;
export const RIVER_WATER = 0x5fa6cc;
/**
 * Maße des Flussbaus (Meter). yTop: Oberkante der Kaimauer (unter Straße und Uferkante) · cope: Uferkante [innen vor
 * der Mauer, außen hinter der Wasserkante, Höhe] · pave: Höhe des Uferwegs über dem Boden · promenade: so weit links
 * und rechts der Straße ist das Ufer gepflastert · hole: so weit hinter der Wasserkante endet das Loch im Boden (unter
 * der Uferkante) · beam: Randbalken der Brücke [Breite, Oberkante, Unterkante] · slab: Unterkante der Brückenplatte ·
 * rail: Geländer [Höhe über dem Balken, Pfostenabstand] · pier: Strompfeiler [Dicke, Abstand etwa].
 */
export const RIVER_KIT = {
  yTop: -0.06, cope: [0.35, 0.75, 0.4], pave: 0.03, promenade: 230, hole: 0.2,
  beam: [0.48, 0.2, -1.05], slab: -0.9, over: 1.0, rail: [0.92, 2.4], pier: [2.4, 50],
};

const RIVER_FRAG = /* glsl */ `#include <color_fragment>
{
  // vRiver: Meter längs (x) und quer (y) zum Fluss. Zwei weite Wellenzüge wandern flussab, feines Kräuseln nur in der
  // Nähe: in der Ferne ist ein Bildpunkt länger als jede Welle, dort bliebe nur Flimmern
  float ckD = length(vViewPosition);
  float ckT = uWater.x;
  float ckWide = sin(vRiver.x * 0.19 + ckT * 0.5 + sin(vRiver.y * 0.11 + ckT * 0.17) * 1.7) + sin(vRiver.y * 0.31 - vRiver.x * 0.07 + ckT * 0.36);
  float ckFine = sin(vRiver.x * 1.7 + ckT * 1.2 + sin(vRiver.y * 0.83 + ckT * 0.4) * 1.4) * sin(vRiver.y * 2.1 - ckT * 0.9 + sin(vRiver.x * 0.61 - ckT * 0.3) * 1.2);
  diffuseColor.rgb += vec3(0.05, 0.06, 0.06) * ckWide * (1.0 - smoothstep(90.0, 380.0, ckD)) + vec3(0.07) * ckFine * (1.0 - smoothstep(25.0, 110.0, ckD));
}
`;

/** Das Wasser der Flüsse: ein Material für alle (am Baukasten hängend), deckend, glatt, mit wandernden Wellen. */
export function riverWater(core) {
  if (core.riverWater) return core.riverWater;
  const mat = core.F.std({ color: RIVER_WATER, roughness: 0.24, metalness: 0, envMapIntensity: 1 });
  const curved = mat.onBeforeCompile;
  const key = mat.customProgramCacheKey;
  mat.onBeforeCompile = (shader, renderer) => {
    curved.call(mat, shader, renderer);
    shader.uniforms.uWater = core.uWater;
    shader.vertexShader = 'varying vec2 vRiver;\n' + shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvRiver = uv;');
    shader.fragmentShader = 'uniform vec2 uWater;\nvarying vec2 vRiver;\n' + shader.fragmentShader.replace('#include <color_fragment>', RIVER_FRAG);
  };
  mat.customProgramCacheKey = () => key.call(mat) + '|fluss';
  core.riverWater = mat;
  return mat;
}

/** Stützstellen längs des Flusses von −reach bis reach: nah an der Straße alle 60 m, nach außen je Stück um die Hälfte länger. */
function stations(reach) {
  const xs = [0];
  for (let x = 0, w = 60; x < reach;) {
    x = Math.min(reach, x + w);
    xs.push(x);
    if (x >= 240) w *= 1.5;
  }
  return [...xs.slice(1).reverse().map((x) => -x), ...xs];
}

/**
 * Strompfeiler der Straßenbrücke: Lagen quer zum Fluss (D), gleichmäßig verteilt mit etwa RIVER_KIT.pier[1] Metern
 * Abstand (Main zwei, Rhein und Elbe drei).
 */
export function pierSpots(rv) {
  const n = Math.max(1, Math.round((2 * rv.half) / RIVER_KIT.pier[1]) - 1);
  return Array.from({ length: n }, (_, i) => ((i + 1) / (n + 1) - 0.5) * 2 * rv.half);
}

/**
 * Baut den Fluss rv (map/rivers.js riverOf) als Group in Ortskoordinaten (x seitlich wie die Straße, z = −u).
 * aprons: zusätzlich gepflasterte Flächen hinter dem Uferweg [{ lx, X, D0, D1 }] – vom Gehweg der Straße (lx: seine
 * Außenkante seitlich der Straßenmitte, links −) bis zur Lage X längs des Flusses, quer von D0 bis D1 (Kai unter den
 * Containerbrücken, Hof vor dem Hafen); open: [{ side (+1 jenseits, −1 diesseits), X0, X1 }] – dort bringt ein
 * Wahrzeichen sein eigenes Ufer mit (der Kai des Hafens): Uferkante und Uferweg bleiben weg, die Mauer bekommt einen
 * Absatz bis an seinen Fuß. Die Geometrien tragen userData.merged: release() des Baukastens räumt sie mit dem Ort ab.
 */
export function buildRiver(core, rv, { aprons = [], open = [] } = {}) {
  const K = RIVER_KIT;
  const b = new Bau({ fade: 1, low: 1 });
  const F = b.F;
  const c = rv.cos;
  const s = rv.sin;
  const yW = -rv.drop;
  const half = rv.half;
  // Flusskoordinaten (X längs, D quer, y hoch) → Rahmen des Stücks (Ursprung: Achse × Straßenmitte, Achsen wie der Ort)
  const P = (X, D, y) => [X * c - D * s, y, -(X * s + D * c)];
  // Viereck, dessen Vorderseite nach n zeigt (der Umlauf wird danach gerichtet)
  const quad = (p0, p1, p2, p3, n, col, o) => {
    const ux = p1[0] - p0[0];
    const uy = p1[1] - p0[1];
    const uz = p1[2] - p0[2];
    const vx = p3[0] - p0[0];
    const vy = p3[1] - p0[1];
    const vz = p3[2] - p0[2];
    const dot = (uy * vz - uz * vy) * n[0] + (uz * vx - ux * vz) * n[1] + (ux * vy - uy * vx) * n[2];
    if (dot < 0) F.quad(p0, p3, p2, p1, col, o);
    else F.quad(p0, p1, p2, p3, col, o);
  };
  const UP = [0, 1, 0];
  // quer zum Fluss, vom Wasser weg (sg = +1 jenseits, −1 diesseits) bzw. längs
  const across = (sg) => [-s * sg, 0, -c * sg];
  const along = (sg) => [c * sg, 0, -s * sg];
  // halbe Breite der Brücke: Gehwegkante der Ortsdurchfahrt, daneben der Randbalken
  const hw = (STREET.curbR + STREET.pave - (STREET.curbL - STREET.pave)) / 2;
  const hb = hw + 0.02 + K.beam[0];
  // X der Linie „seitlich lx neben der Straßenmitte“ an der Lage D quer zum Fluss
  const XofLx = (lx, D) => (lx + D * s) / c;
  const xs = stations(rv.reach);
  const isOpen = (sg, X0, X1) => open.some((q) => q.side === sg && X1 > q.X0 && X0 < q.X1);

  for (const sg of [-1, 1]) {
    // Kaimauer: vom Grund bis unter die Uferkante, zum Wasser hin; unten dunkler (nass)
    const Dw = sg * (half - rv.wall);
    const toWater = across(-sg);
    for (let i = 0; i + 1 < xs.length; i++) {
      quad(P(xs[i], Dw, yW - 0.8), P(xs[i + 1], Dw, yW - 0.8), P(xs[i + 1], Dw, K.yTop), P(xs[i], Dw, K.yTop), toWater, STONE, { g: [0.7, 1], gy: [yW - 0.2, yW + 1.6] });
    }
    // Uferkante und Uferweg: zwei Läufe, links und rechts der Brücke (unter ihr läuft nur die Mauer durch); wo ein
    // Wahrzeichen sein eigenes Ufer mitbringt (open), setzen sie aus
    const Di = sg * (half - K.cope[0]);
    const Do = sg * (half + K.cope[1]);
    const Dc = sg * (half + K.cope[1] + 1.6);
    const Dp = sg * (half + rv.bank);
    for (const dir of [-1, 1]) {
      const runs = [];
      // Stützstellen dieses Laufs von der Brücke nach außen
      // an der Brücke schräg entlang der Straße geschnitten: die Uferkante am Randbalken, der Uferweg am Gehweg
      const cut = (D, lx = hb) => XofLx(dir * lx, D);
      // (die Enden offener Uferstücke sind eigene Stützstellen: Kante und Weg reichen genau bis dorthin)
      const ends = open.filter((q) => q.side === sg).flatMap((q) => [q.X0, q.X1]);
      const outer = [...new Set([...xs, ...ends])].sort((a, b) => a - b).filter((x) => dir * x > dir * cut(Di) + 8 && dir * x > dir * cut(Dp) + 8);
      if (dir < 0) outer.reverse();
      let prev = null;
      for (const X of [null, ...outer]) {
        const at = (D, lx) => (X === null ? cut(D, lx) : X);
        const cur = { i: at(Di), o: at(Do), po: at(Do, hw), c: at(Dc, hw), p: at(Dp, hw), X: X === null ? cut(0) : X };
        if (prev && !isOpen(sg, Math.min(prev.X, cur.X), Math.max(prev.X, cur.X))) runs.push([prev, cur]);
        prev = cur;
      }
      for (const [A, B] of runs) {
        const yc = K.cope[2];
        // Uferkante: Stirn zum Wasser, Oberseite, Rückseite zum Uferweg
        quad(P(A.i, Di, K.yTop - 0.3), P(B.i, Di, K.yTop - 0.3), P(B.i, Di, yc), P(A.i, Di, yc), toWater, COPING, { g: [0.86, 1] });
        quad(P(A.i, Di, yc), P(B.i, Di, yc), P(B.o, Do, yc), P(A.o, Do, yc), UP, COPING);
        quad(P(A.o, Do, yc), P(B.o, Do, yc), P(B.o, Do, -0.1), P(A.o, Do, -0.1), across(sg), COPING, { k: 0.9 });
        // Uferweg nur nahe der Straße: ein Band Kopfsteinpflaster an der Kante, dahinter Platten bis zur Häuserflucht
        if (Math.abs(A.X) < K.promenade) {
          quad(P(A.po, Do, K.pave), P(B.po, Do, K.pave), P(B.c, Dc, K.pave), P(A.c, Dc, K.pave), UP, COBBLE);
          quad(P(A.c, Dc, K.pave), P(B.c, Dc, K.pave), P(B.p, Dp, K.pave), P(A.p, Dp, K.pave), UP, PAVE);
        }
      }
      // Stirn der Uferkante an der Brücke (dort endet sie am Endpfeiler; die schließt sie ab)
      const A = runs.length ? runs[0][0] : null;
      if (A) quad(P(A.i, Di, K.yTop - 0.3), P(A.o, Do, K.yTop - 0.3), P(A.o, Do, K.cope[2]), P(A.i, Di, K.cope[2]), along(-dir), COPING, { k: 0.9 });
    }
    // offenes Uferstück: Absatz von der Mauer bis an den Fuß des Kais, an beiden Enden die Stirn der Uferkante
    for (const q of open) {
      if (q.side !== sg) continue;
      quad(P(q.X0, Dw, K.yTop), P(q.X1, Dw, K.yTop), P(q.X1, sg * (half + 0.1), K.yTop), P(q.X0, sg * (half + 0.1), K.yTop), UP, STONE);
      for (const [X, dir] of [[q.X0, 1], [q.X1, -1]]) quad(P(X, Di, K.yTop - 0.3), P(X, Do, K.yTop - 0.3), P(X, Do, K.cope[2]), P(X, Di, K.cope[2]), along(dir), COPING, { k: 0.9 });
    }
  }
  // Kai und Hof: Platten auf der Höhe des Uferwegs, bündig an ihn und an den Gehweg der Straße gesetzt
  for (const a of aprons) {
    const Y = K.pave;
    quad(P(XofLx(a.lx, a.D0), a.D0, Y), P(a.X, a.D0, Y), P(a.X, a.D1, Y), P(XofLx(a.lx, a.D1), a.D1, Y), UP, mix(PAVE, 0x8f9499, 0.35));
  }

  // --- Straßenbrücke: Platte unter Fahrbahn und Gehwegen, je Seite ein Randbalken mit Geländer und Endpfeilern -----
  const Dend = half + K.over; // so weit reicht sie über die Wasserkante auf das Ufer
  // im Rahmen des Stücks läuft die Straße längs z: u-Lage (relativ zur Achse) der Linie lx an der Lage D
  const zOf = (lx, D) => -(XofLx(lx, D) * s + D * c);
  const prismX = (x0, x1, y0, y1, col, o, faces = 'tbio') => {
    // Körper zwischen den Linien lx = x0 und x1 (x0 < x1), schräg mit den Ufern abgeschnitten
    const p = (lx, sg, y) => [lx, y, zOf(lx, sg * Dend)];
    if (faces.includes('t')) quad(p(x0, -1, y1), p(x1, -1, y1), p(x1, 1, y1), p(x0, 1, y1), UP, col, o);
    if (faces.includes('b')) quad(p(x0, -1, y0), p(x1, -1, y0), p(x1, 1, y0), p(x0, 1, y0), [0, -1, 0], col, o);
    if (faces.includes('i')) quad(p(x0, -1, y0), p(x0, 1, y0), p(x0, 1, y1), p(x0, -1, y1), [-1, 0, 0], col, o);
    if (faces.includes('o')) quad(p(x1, -1, y0), p(x1, 1, y0), p(x1, 1, y1), p(x1, -1, y1), [1, 0, 0], col, o);
  };
  // Platte: nur ihre Unterseite ist je zu sehen (oben liegt die Straße, an den Seiten die Balken)
  prismX(-hw - 0.02, hw + 0.02, K.slab, -0.03, DECK, { k: 0.8 }, 'b');
  for (const side of [-1, 1]) {
    const x0 = side < 0 ? -hb : hw + 0.02;
    const x1 = side < 0 ? -hw - 0.02 : hb;
    prismX(x0, x1, K.beam[2], K.beam[1], mix(STONE, 0xffffff, 0.12), { g: [0.8, 1] });
    // Stirnseiten der Balken an beiden Ufern
    for (const sg of [-1, 1]) {
      quad([x0, K.beam[2], zOf(x0, sg * Dend)], [x1, K.beam[2], zOf(x1, sg * Dend)], [x1, K.beam[1], zOf(x1, sg * Dend)], [x0, K.beam[1], zOf(x0, sg * Dend)], [0, 0, -sg], STONE, { k: 0.9 });
    }
    // Geländer in der Mitte des Balkens: Pfosten, Handlauf und zwei Stäbe; an den Enden gemauerte Pfeiler mit Kappe
    const xm = (x0 + x1) / 2;
    const zA = zOf(xm, -Dend) - 0.6; // diesseits (größeres z)
    const zB = zOf(xm, Dend) + 0.6;
    const len = zA - zB;
    const y0 = K.beam[1];
    const h = K.rail[0];
    const n = Math.max(2, Math.round(len / K.rail[1]));
    for (let i = 1; i < n; i++) F.box(xm, y0, zA - (len * i) / n, 0.09, h, 0.09, rv.rail);
    F.box(xm, y0 + h, (zA + zB) / 2, 0.13, 0.08, len, mix(rv.rail, 0xffffff, 0.18));
    for (const yy of [0.3, 0.61]) F.box(xm, y0 + yy, (zA + zB) / 2, 0.05, 0.05, len, rv.rail);
    for (const z of [zA + 0.3, zB - 0.3]) {
      // so schmal wie der Balken: zum Gehweg hin steht nichts über
      F.box(xm, K.beam[2], z, K.beam[0] - 0.02, h + 0.22 - K.beam[2] + y0, 0.6, STONE, { g: [0.82, 1] });
      F.box(xm, y0 + h + 0.22, z, K.beam[0] + 0.12, 0.14, 0.76, COPING);
    }
  }
  // Strompfeiler: längs des Flusses unter der ganzen Brückenbreite, oben eine breitere Kappe
  for (const D of pierSpots(rv)) {
    const L = (2 * hb) / c + 2.4;
    b.at(...P((D * s) / c, D, 0), rv.ang, () => {
      F.box(0, yW - 0.8, 0, L, K.beam[2] - 0.45 - (yW - 0.8), K.pier[0], PIER, { g: [0.7, 1], gy: [yW - 0.2, yW + 1.4] });
      F.box(0, K.beam[2] - 0.45, 0, L + 0.5, 0.45 + (K.slab - K.beam[2]), K.pier[0] + 0.5, mix(PIER, 0xffffff, 0.15));
    });
  }

  const group = compose(core, [{ g: b.done({}), x: 0, y: 0, z: 0, ry: 0 }]);
  group.name = 'Fluss ' + rv.name;
  group.position.set(rv.x, 0, -rv.u);
  // das Wasser: ein Band in Stücken, uv = Meter längs und quer (für die Wellen)
  const pos = [];
  const uv = [];
  const idx = [];
  const Dw = half - rv.wall + 0.02;
  for (let i = 0; i < xs.length; i++) {
    for (const D of [-Dw, Dw]) {
      pos.push(...P(xs[i], D, yW));
      uv.push(xs[i], D);
    }
    // gegen den Uhrzeigersinn von oben gesehen: die Vorderseite schaut nach oben
    if (i > 0) idx.push(2 * i - 2, 2 * i + 1, 2 * i - 1, 2 * i - 2, 2 * i, 2 * i + 1);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  geo.userData.merged = true;
  const water = new THREE.Mesh(geo, riverWater(core));
  water.name = 'Wasser ' + rv.name;
  water.receiveShadow = true;
  group.add(water);
  for (const m of group.children) m.frustumCulled = false;
  return group;
}
