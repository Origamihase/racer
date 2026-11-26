// Brücken der XXL-Welt: wo die Karte den Weg über einen Fluss oder See führt (map/crossings.js sectionWater), fährt
// der Wagen über eine Brücke – Fluss, Ufer und Brücke stehen an der Stelle, die bridgeplan.js festlegt. Die Straße
// selbst bleibt, wie Road (Autobahn) und roadkit (alles andere) sie bauen; die Brücke ist alles darunter und daneben:
// Kappen aus Beton mit Geländer statt der Bankette, die Ansichtsfläche des Überbaus, seine Untersicht, Widerlager mit
// Flügelwänden, Pfeiler im Wasser. Dazu das Wasser und die Böschungen bis in den Dunst und ein Loch im Boden der
// Welt darüber (ground.js setHoles).
//
// Jede Brücke hängt in der Spur ihres Rahmens (frames.js) bei z = −sc und hat nur kleine Koordinaten. Ihr Wasser
// reicht quer weit über die Straße hinaus (BRIDGE.reach); liegt dort eine andere Straße der Welt (ein Abzweig, die
// verlassene Autobahn, der weitere Weg), endet es je Seite vorher (update: an den Stützstellen der Wasserflächen,
// dort schließt eine Stirnwand aus Erde den Graben). Über Wasser liegt so nur, was in der Karte eine Brücke hat.
import * as THREE from 'three';
import { W } from '../../curve.js';
import { ROAD } from '../../textures.js';
import { hashString } from '../../util.js';
import { BRIDGE } from '../../map/crossings.js';
import { Bau, compose, mix, textPanel, fitFont } from '../kit/citycore.js';
import { riverWater } from '../kit/river.js';
import { ONCOMING } from '../road.js';
import { meadowTexture, GROUND_Y, HOLES } from './ground.js';
import { VIS } from './roadkit.js';
import { bridgesOf, DECK, terrainAt } from './bridgeplan.js';

export { bridgesOf, bridgeCuts, inWater, DECK } from './bridgeplan.js';

const CONCRETE = 0xc4c0b7;
const CAP_TOP = 0xd3d0c9;
const UNDER = 0x9c988f;
const PIER = 0xb3ada2;
const STEEL = [0x4e7a5f, 0x56708a, 0x7b8086, 0x6f6a5f];
const MUD = [0.5, 0.45, 0.36];
// Stützstellen des Wassers längs des Flusses je Seite (Meter von der Straße): an ihnen endet es, wenn es muss
const STATIONS = [0, 34, 70, 110, 160, 230, 320, 440, 600, 800, 1050, 1300, BRIDGE.reach];
// so viel Abstand hält das Wasser von einer fremden Straße (ihr halber Querschnitt und Luft)
const CLEAR = 46;
// so viele Löcher im Boden bekommen Brücken (eines bleibt für den Fluss eines Orts); weitere bleiben zu (reachOf: null)
export const MAX_HOLES = HOLES - 1;

/** Querschnitt der Straße an der Brücke b (Abschnittsart kind, Profil profile): Asphaltränder, Kappen, Mittelstreifen. */
function crossOf(b, profile) {
  if (b.kind === 'ab') {
    const eR = ROAD.right;
    const eL = ONCOMING(ROAD.right);
    return { eL, eR, xL: eL - DECK.capAb, xR: eR + DECK.capAb, median: [ONCOMING(ROAD.left), ROAD.left], ab: true };
  }
  const V = VIS[profile] || VIS.land;
  return { eL: V.aL, eR: V.aR, xL: V.aL - DECK.cap, xR: V.aR + DECK.cap, median: null, ab: false };
}

/** Viereck mit Vorderseite nach n (der Umlauf wird danach gerichtet). */
function quadTo(F, p0, p1, p2, p3, n, col, o) {
  const ux = p1[0] - p0[0];
  const uy = p1[1] - p0[1];
  const uz = p1[2] - p0[2];
  const vx = p3[0] - p0[0];
  const vy = p3[1] - p0[1];
  const vz = p3[2] - p0[2];
  const dot = (uy * vz - uz * vy) * n[0] + (uz * vx - ux * vz) * n[1] + (ux * vy - uy * vx) * n[2];
  if (dot < 0) F.quad(p0, p3, p2, p1, col, o);
  else F.quad(p0, p1, p2, p3, col, o);
}

/** Das Feste der Brücke b (Ortskoordinaten: x seitlich wie die Straße, z = −(s − sc)) als Bau-Geometrie. */
function structure(b, X) {
  const bau = new Bau({ fade: 1, low: 1 });
  const F = bau.F;
  const c = b.cos;
  const sn = b.sin;
  const tan = b.tan;
  const dd = DECK.deck[Math.min(b.cls, 2)];
  const capH = DECK.capH;
  const L = b.sc - b.c0; // halbe Länge der Kappen
  const zOf = (x, D) => -(x * tan + D / c); // z der Linie x an der Lage D
  const DofZ = (x, z) => -z * c - x * sn; // umgekehrt
  const P = (Xr, D, y) => [Xr * c - D * sn, y, -(Xr * sn + D * c)];
  const UP = [0, 1, 0];
  const DOWN = [0, -1, 0];
  const steel = STEEL[hashString(b.key) % STEEL.length];

  // --- Kappen: erhöhte Ränder aus Beton über die ganze Länge, senkrecht zur Straße abgeschnitten --------------------
  const capRun = (x0, x1, h, inner) => {
    quadTo(F, [x0, h, L], [x1, h, L], [x1, h, -L], [x0, h, -L], UP, CAP_TOP);
    for (const x of inner) quadTo(F, [x, 0, L], [x, h, L], [x, h, -L], [x, 0, -L], [x === x0 ? -1 : 1, 0, 0], CONCRETE, { k: 0.92 });
    for (const z of [L, -L]) quadTo(F, [x0, -0.05, z], [x1, -0.05, z], [x1, h, z], [x0, h, z], [0, 0, Math.sign(z)], CONCRETE, { k: 0.88 });
  };
  capRun(X.eR, X.xR, capH, [X.eR]);
  capRun(X.xL, X.eL, capH, [X.eL]);
  if (X.median) capRun(X.median[0], X.median[1], capH * 0.7, [X.median[0], X.median[1]]);

  // --- Ansichtsfläche (außen): über dem Wasser bis zur Untersicht, an den Flügelwänden bis in die Böschung ----------
  const Dab = b.abut;
  const slope = [0, 0.2, 0.4, 0.6, 0.8, 1].map((t) => b.half + t * b.bank);
  for (const [x, side] of [[X.xR, 1], [X.xL, -1]]) {
    const Dfar = DofZ(x, -L);
    const Dnear = DofZ(x, L);
    const Ds = [...new Set([Dnear, Dfar, -Dab, Dab, ...slope.flatMap((d) => [d, -d]), b.wing, -b.wing])].filter((d) => d >= Dnear - 1e-6 && d <= Dfar + 1e-6).sort((p, q) => p - q);
    for (let i = 0; i + 1 < Ds.length; i++) {
      const D0 = Ds[i];
      const D1 = Ds[i + 1];
      const under = Math.abs((D0 + D1) / 2) < Dab;
      const bot = (D) => (under ? -dd : terrainAt(b, D) - 0.45);
      const z0 = zOf(x, D0);
      const z1 = zOf(x, D1);
      quadTo(F, [x, bot(D0), z0], [x, bot(D1), z1], [x, capH + 0.04, z1], [x, capH + 0.04, z0], [side, 0, 0], CONCRETE, { g: [0.78, 1], gy: [-dd, capH] });
    }
    // Gesims: ein Band oben, etwas vorstehend
    quadTo(F, [x + side * 0.08, capH - 0.32, L], [x + side * 0.08, capH - 0.32, -L], [x + side * 0.08, capH + 0.06, -L], [x + side * 0.08, capH + 0.06, L], [side, 0, 0], CAP_TOP);
    quadTo(F, [x, capH + 0.06, L], [x + side * 0.08, capH + 0.06, L], [x + side * 0.08, capH + 0.06, -L], [x, capH + 0.06, -L], UP, CAP_TOP);
    quadTo(F, [x, capH - 0.32, L], [x + side * 0.08, capH - 0.32, L], [x + side * 0.08, capH - 0.32, -L], [x, capH - 0.32, -L], DOWN, CONCRETE, { k: 0.8 });
  }

  // --- Untersicht des Überbaus und Widerlager ------------------------------------------------------------------------
  {
    const a = [X.xL, -dd, zOf(X.xL, -Dab)];
    const bb = [X.xR, -dd, zOf(X.xR, -Dab)];
    const cc = [X.xR, -dd, zOf(X.xR, Dab)];
    const d = [X.xL, -dd, zOf(X.xL, Dab)];
    quadTo(F, a, bb, cc, d, DOWN, UNDER);
    for (const sg of [-1, 1]) {
      const D = sg * Dab;
      const y0 = terrainAt(b, D) - 0.8;
      const xl = X.xL - 0.25;
      const xr = X.xR + 0.25;
      // zum Wasser hin: −sg längs D, und D zeigt im Ort nach (−sin, 0, −cos)
      const toWater = [sg * sn, 0, sg * c];
      quadTo(F, [xl, y0, zOf(xl, D)], [xr, y0, zOf(xr, D)], [xr, -dd, zOf(xr, D)], [xl, -dd, zOf(xl, D)], toWater, CONCRETE, { g: [0.7, 0.95], gy: [y0, -dd] });
      // Auflagerbank: ein schmaler Absatz unter der Platte
      const D2 = D - sg * 0.45;
      quadTo(F, [xl, -dd - 0.35, zOf(xl, D)], [xr, -dd - 0.35, zOf(xr, D)], [xr, -dd - 0.35, zOf(xr, D2)], [xl, -dd - 0.35, zOf(xl, D2)], UP, CONCRETE, { k: 0.85 });
      quadTo(F, [xl, -dd - 0.6, zOf(xl, D2)], [xr, -dd - 0.6, zOf(xr, D2)], [xr, -dd - 0.35, zOf(xr, D2)], [xl, -dd - 0.35, zOf(xl, D2)], toWater, CONCRETE, { k: 0.8 });
    }
  }

  // --- Pfeiler im Wasser: Wandscheiben längs des Flusses mit Kopf ---------------------------------------------------
  {
    const span = DECK.span[Math.min(b.cls, 2)];
    const n = Math.max(0, Math.round((2 * b.half) / span) - 1);
    // längs des Flusses von Kappe zu Kappe
    const Xa = (X.xL + 0.6) / c;
    const Xb = (X.xR - 0.6) / c;
    for (let k = 0; k < n; k++) {
      const D = -b.half + ((k + 1) * 2 * b.half) / (n + 1);
      const Xm = (Xa + Xb) / 2 + (D * sn) / c;
      const len = Xb - Xa;
      const yb = -b.drop - 1.2;
      bau.at(...P(Xm, D, 0), b.w.ang, () => {
        F.box(0, yb, 0, len, -dd - 0.55 - yb, DECK.pier, PIER, { g: [0.62, 1], gy: [-b.drop - 0.3, -b.drop + 1.6] });
        F.box(0, -dd - 0.55, 0, len + 0.6, 0.55, DECK.pier + 0.7, mix(PIER, 0xffffff, 0.12));
        // Vorköpfe gegen die Strömung (spitz zulaufend)
        for (const e of [-1, 1]) F.frust(e * (len / 2 + 0.55), yb, 0, 1.1, DECK.pier * 0.4, 1.1, DECK.pier * 0.4, -b.drop + 0.9 - yb, PIER, { g: [0.62, 0.95] });
      });
    }
  }

  // --- Geländer an den Kappen, Schutzplanke an der Landstraße ---------------------------------------------------
  {
    const h = 1.05;
    const zA = L - 0.4;
    const zB = -L + 0.4;
    const len = zA - zB;
    const n = Math.max(2, Math.round(len / 2.2));
    for (const [x, side] of [[X.xR - 0.32, 1], [X.xL + 0.32, -1]]) {
      for (let i = 0; i <= n; i++) F.box(x, capH, zA - (len * i) / n, 0.07, h, 0.07, steel);
      F.box(x, capH + h, (zA + zB) / 2, 0.1, 0.06, len, mix(steel, 0xffffff, 0.15));
      for (const yy of [0.18, 0.55]) F.box(x, capH + yy, (zA + zB) / 2, 0.04, 0.05, len, steel);
      // Füllstäbe: dichte Stäbe als ein dunkles, durchscheinend wirkendes Band zwischen den Holmen
      for (let i = 0; i < n * 3; i++) F.box(x, capH + 0.23, zA - (len * (i + 0.5)) / (n * 3), 0.025, 0.32, 0.025, mix(steel, 0x000000, 0.2));
      if (!X.ab) {
        // Schutzplanke vor dem Geländer (an der Autobahn hat Road ihre eigenen)
        const xg = (side > 0 ? X.eR : X.eL) + side * 0.6;
        const m = Math.max(2, Math.round(len / 4));
        for (let i = 0; i <= m; i++) F.box(xg + side * 0.12, capH, zA - (len * i) / m, 0.1, 0.62, 0.07, 0x8e9398);
        F.box(xg, capH + 0.42, (zA + zB) / 2, 0.05, 0.3, len, 0xb9bdc0);
      }
    }
  }
  // Pfosten der Gewässerschilder (die Tafeln setzt build): rechts vor der Brücke, für die Gegenrichtung links am Ende
  if (b.name) for (const [x, z] of signSpots(X, L)) F.box(x, capH, z, 0.09, SIGN.y + SIGN.h / 2 - capH, 0.09, 0x9aa0a6);
  return bau.done({});
}

/** Gewässerschild: Maße und Lage der Tafel (Mitte über der Fahrbahn), siehe signSpots. */
const SIGN = { w: 2.1, h: 0.62, y: 2.15 };
/** Wo die Gewässerschilder stehen: [x, z] rechts am Anfang (Blick nach +z) und links am Ende (Blick nach −z). */
const signSpots = (X, L) => [[X.xR - 0.7, L - 5], [X.xL + 0.7, -(L - 5)]];

/** Die Tafel des Gewässerschilds: blau mit weißem Rand, Wellen und Name (wie an deutschen Brücken). */
function drawWaterSign(ctx, w, h, name) {
  ctx.fillStyle = '#1d5fb0';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = h * 0.06;
  const m = h * 0.07;
  ctx.beginPath();
  ctx.roundRect(m, m, w - 2 * m, h - 2 * m, h * 0.08);
  ctx.stroke();
  // Wellen links
  ctx.lineWidth = h * 0.06;
  ctx.lineCap = 'round';
  const x0 = h * 0.28;
  const ww = h * 0.62;
  for (const dy of [-0.16, 0.02, 0.2]) {
    ctx.beginPath();
    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      const x = x0 + t * ww;
      const y = h * (0.5 + dy) + Math.sin(t * Math.PI * 3) * h * 0.045;
      if (i) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    }
    ctx.stroke();
  }
  ctx.fillStyle = '#ffffff';
  const tx = x0 + ww + h * 0.18;
  const size = fitFont(ctx, name, h * 0.5, w - tx - h * 0.2);
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.font = `bold ${size}px ${'"Trebuchet MS", "DejaVu Sans", Arial, sans-serif'}`;
  ctx.fillText(name, (tx + w - h * 0.2) / 2, h * 0.53);
}

/** Wasser, Böschungen und Stirnwände einer Seite (sx = +1 rechts, −1 links) als drei Geometrien, je Stützstelle geordnet. */
function sideGeos(b, sx) {
  const c = b.cos;
  const sn = b.sin;
  const P = (Xr, D, y) => [Xr * c - D * sn, y, -(Xr * sn + D * c)];
  const hb = b.half + b.bank;
  // Wasser: ein Band, uv = Meter längs und quer (Wellen wie im Fluss der Orte)
  const wp = [];
  const wuv = [];
  const wi = [];
  // Böschungen: Profil quer von unter dem Wasser bis unter den Boden
  // Beträge von D, vom Boden hinter der Kante bis unter den Wasserspiegel
  const mags = [hb + 0.9, ...[1, 0.9, 0.75, 0.6, 0.45, 0.3, 0.15, 0].map((t) => b.half + t * b.bank), b.half - 0.5];
  const yOf = (D) => (Math.abs(D) < b.half ? -b.drop - 0.3 : Math.abs(D) > hb ? GROUND_Y - 0.12 : terrainAt(b, D));
  const bp = [];
  const bn = [];
  const bc = [];
  const buv = [];
  const bi = [];
  const pp = [];
  const pn = [];
  const pc = [];
  const puv = [];
  const pi = [];
  const ranges = { water: [0], bank: [0], plug: [0] };
  const cols = (D) => {
    const t = Math.min(1, Math.max(0, (Math.abs(D) - b.half) / b.bank));
    const k = t * t;
    return [MUD[0] + (1 - MUD[0]) * k, MUD[1] + (1 - MUD[1]) * k, MUD[2] + (1 - MUD[2]) * k];
  };
  for (let i = 0; i < STATIONS.length; i++) {
    const Xr = sx * STATIONS[i];
    // Wasser
    const w0 = wp.length / 3;
    for (const D of [-b.half - 0.4, b.half + 0.4]) {
      wp.push(...P(Xr, D, -b.drop));
      wuv.push(Xr, D);
    }
    if (i > 0) {
      const a = w0 - 2;
      wi.push(a, a + 1, w0 + 1, a, w0 + 1, w0);
      ranges.water.push(wi.length);
    }
    // Böschungen beider Ufer
    const r0 = bp.length / 3;
    for (const sg of [-1, 1]) {
      for (const m of mags) {
        const D = sg * m;
        const p = P(Xr, D, yOf(D));
        bp.push(...p);
        bn.push(0, 1, 0);
        bc.push(...cols(D));
        buv.push(p[0] / 7, -p[2] / 7);
      }
    }
    if (i > 0) {
      const m = mags.length;
      const prev = r0 - 2 * m;
      for (let s = 0; s < 2; s++) {
        for (let j = 0; j + 1 < m; j++) {
          const a = prev + s * m + j;
          const q = r0 + s * m + j;
          // nach oben gerichtet: prüfen wir am Ende einmal (computeVertexNormals nach dem Richten)
          bi.push(a, q, a + 1, a + 1, q, q + 1);
        }
      }
      ranges.bank.push(bi.length);
    }
    // Stirnwand an dieser Stützstelle (nur gezeichnet, wo das Wasser endet)
    if (i > 0) {
      const p0 = pp.length / 3;
      const inner = mags.filter((m) => m <= hb + 1e-6);
      const Ds = [...inner.map((m) => -m), ...inner.map((m) => m).reverse()];
      for (const D of Ds) {
        for (const y of [yOf(D) - 0.05, GROUND_Y]) {
          pp.push(...P(Xr, D, y));
          pn.push(-sx * c, 0, sx * sn);
          const k = y > -0.5 ? 0.85 : 0.62;
          pc.push(MUD[0] * k + 0.25, MUD[1] * k + 0.2, MUD[2] * k + 0.12);
          puv.push(D / 7, y / 7);
        }
      }
      for (let j = 0; j + 1 < Ds.length; j++) {
        const a = p0 + j * 2;
        pi.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
      }
      ranges.plug.push(pi.length);
    }
  }
  const geo = (pos, idx, extra) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    for (const [k, v, n] of extra) g.setAttribute(k, new THREE.Float32BufferAttribute(v, n));
    g.setIndex(idx);
    return g;
  };
  orient(wp, wi, 1);
  const water = geo(wp, wi, [['uv', wuv, 2]]);
  water.computeVertexNormals();
  // Böschungen: jedes Dreieck nach oben richten
  orient(bp, bi, 1);
  const bank = geo(bp, bi, [['normal', bn, 3], ['color', bc, 3], ['uv', buv, 2]]);
  bank.computeVertexNormals();
  // Stirnwände zur Straße hin richten
  orientTo(pp, pi, [-sx * c, 0, sx * sn]);
  const plug = geo(pp, pi, [['normal', pn, 3], ['color', pc, 3], ['uv', puv, 2]]);
  return { water, bank, plug, ranges };
}

/** Dreiecke so drehen, dass ihre Normale nach oben (sgn = 1) zeigt. */
function orient(P, I, sgn) {
  for (let t = 0; t < I.length; t += 3) {
    const a = I[t] * 3;
    const b = I[t + 1] * 3;
    const c = I[t + 2] * 3;
    const ny = (P[c + 0] - P[a + 0]) * (P[b + 2] - P[a + 2]) - (P[b + 0] - P[a + 0]) * (P[c + 2] - P[a + 2]);
    if (ny * sgn < 0) [I[t + 1], I[t + 2]] = [I[t + 2], I[t + 1]];
  }
}
function orientTo(P, I, n) {
  for (let t = 0; t < I.length; t += 3) {
    const a = I[t] * 3;
    const b = I[t + 1] * 3;
    const c = I[t + 2] * 3;
    const ux = P[b] - P[a];
    const uy = P[b + 1] - P[a + 1];
    const uz = P[b + 2] - P[a + 2];
    const vx = P[c] - P[a];
    const vy = P[c + 1] - P[a + 1];
    const vz = P[c + 2] - P[a + 2];
    const d = (uy * vz - uz * vy) * n[0] + (uz * vx - ux * vz) * n[1] + (ux * vy - uy * vx) * n[2];
    if (d < 0) [I[t + 1], I[t + 2]] = [I[t + 2], I[t + 1]];
  }
}

export class Bridges {
  /**
   * @param {{ core: object, release: (g: THREE.Object3D) => void }} kit Stadtbaukasten (Materialien, Wasser)
   * @param {THREE.Object3D} root Gruppe der Welt: dort hängt ein unsichtbar kleiner Satz der Materialien, damit der
   * Start ihre Shader übersetzt (renderer.compile sieht nur Sichtbares) und keins mitten in der Fahrt entsteht
   */
  constructor(kit, root) {
    this.kit = kit;
    this.items = new Map(); // Schlüssel → { key, b, sec, frame, group, sides, reach: [links, rechts] }
    this.want = new Set();
    this.bankMat = W.lambert({ map: meadowTexture(undefined, 57), vertexColors: true });
    this.plugMat = W.lambert({ map: this.bankMat.map, vertexColors: true });
    this.holes = [];
    const tiny = () => {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute([0, -50, 0, 0, -50, 0, 0, -50, 0], 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute([0, 1, 0, 0, 1, 0, 0, 1, 0], 3));
      g.setAttribute('color', new THREE.Float32BufferAttribute([1, 1, 1, 1, 1, 1, 1, 1, 1], 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, 0], 2));
      g.setDrawRange(0, 0);
      return g;
    };
    this.warm = new THREE.Group();
    this.warm.name = 'Brücken (Shader)';
    for (const m of [this.bankMat, this.plugMat, riverWater(kit.core), kit.core.matte]) {
      const mesh = new THREE.Mesh(tiny(), m);
      mesh.frustumCulled = false;
      mesh.receiveShadow = true;
      this.warm.add(mesh);
    }
    if (root) root.add(this.warm);
  }

  begin() {
    this.want.clear();
  }

  /** Die Brücken des Abschnitts sec im Rahmen frame behalten bzw. bauen, soweit sie in [lo, hi] liegen. */
  need(sec, lo, hi, frame = sec.frame) {
    for (const b of bridgesOf(sec)) {
      if (b.c1 < lo || b.c0 > hi) continue;
      const key = b.key + '@' + Math.round(b.sc);
      this.want.add(key);
      let it = this.items.get(key);
      if (!it) {
        it = this.build(key, b, sec);
        this.items.set(key, it);
      }
      it.sec = sec;
      it.frame = frame;
    }
  }

  sweep() {
    for (const [key, it] of this.items) {
      if (this.want.has(key)) continue;
      this.drop(it);
      this.items.delete(key);
    }
  }

  reset() {
    for (const it of this.items.values()) this.drop(it);
    this.items.clear();
  }

  frames() {
    return [...this.items.values()].map((it) => it.frame);
  }

  build(key, b, sec) {
    const core = this.kit.core;
    const X = crossOf(b, sec.profile);
    const group = compose(core, [{ g: structure(b, X), x: 0, y: 0, z: 0, ry: 0 }]);
    group.name = 'Brücke ' + (b.name || '') + ' ' + key;
    group.position.z = -b.sc;
    const sides = [];
    for (const sx of [-1, 1]) {
      const G = sideGeos(b, sx);
      const water = new THREE.Mesh(G.water, riverWater(core));
      water.receiveShadow = true;
      const bank = new THREE.Mesh(G.bank, this.bankMat);
      bank.receiveShadow = true;
      const plug = new THREE.Mesh(G.plug, this.plugMat);
      for (const m of [water, bank, plug]) {
        m.frustumCulled = false;
        m.geometry.userData.merged = true;
        group.add(m);
      }
      sides.push({ sx, water, bank, plug, ranges: G.ranges, n: -1 });
    }
    // Gewässerschilder an ihren Pfosten
    if (b.name) {
      const L = b.sc - b.c0;
      signSpots(X, L).forEach(([x, z], i) => {
        const m = textPanel(core, 'gewaesser:' + b.name, SIGN.w, SIGN.h, 512, (ctx, w, h) => drawWaterSign(ctx, w, h, b.name));
        m.position.set(x, SIGN.y, z + (i ? -0.06 : 0.06));
        m.rotation.y = i ? Math.PI : 0;
        group.add(m);
      });
    }
    for (const m of group.children) m.frustumCulled = false;
    const it = { key, b, sec, frame: sec.frame, group, sides, X, reach: [BRIDGE.reach, BRIDGE.reach] };
    this.setReach(it, STATIONS.length - 1, STATIONS.length - 1);
    return it;
  }

  drop(it) {
    if (it.group.parent) it.group.parent.remove(it.group);
    for (const s of it.sides) for (const m of [s.water, s.bank, s.plug]) m.geometry.dispose();
    this.kit.release(it.group);
  }

  /** In die Spuren ihrer Rahmen hängen (nach FramePool.acquire). */
  attach(frames) {
    for (const it of this.items.values()) {
      const fv = frames.get(it.frame);
      if (fv && it.group.parent !== fv.track) fv.track.add(it.group);
    }
  }

  /** Wasser je Seite bis zur Stützstelle nL bzw. nR zeigen (Index in STATIONS), dort die Stirnwand. */
  setReach(it, nL, nR) {
    for (const sd of it.sides) {
      const n = sd.sx < 0 ? nL : nR;
      if (sd.n === n) continue;
      sd.n = n;
      sd.water.geometry.setDrawRange(0, sd.ranges.water[n]);
      sd.bank.geometry.setDrawRange(0, sd.ranges.bank[n]);
      const r = sd.ranges.plug;
      sd.plug.visible = n > 0 && n < STATIONS.length - 1;
      sd.plug.geometry.setDrawRange(r[n - 1] ?? 0, n > 0 ? r[n] - r[n - 1] : 0);
    }
    it.reach = [STATIONS[nL], STATIONS[nR]];
  }

  /**
   * Einmal je Bild: s Ort des Wagens, shear Scherungen der Rahmen, roads: die anderen Straßen der Welt
   * [{ frame, s0, s1 }] (Stücke, Autobahn). Kürzt das Wasser vor fremden Straßen und sammelt die Löcher für den Boden
   * (holes: [{ x, z, tx, tz, half, r0, r1, d }] im Raum vor der Krümmung, nach Nähe).
   */
  update(s, shear, roads) {
    const holes = (this.holes = []);
    for (const it of this.items.values()) {
      const sh = shear.get(it.frame);
      it.group.visible = !!sh;
      if (!sh) continue;
      const b = it.b;
      const dc = b.sc - s;
      // fremde Straßen im Band des Wassers: so nah endet es je Seite
      let lim = [BRIDGE.reach, BRIDGE.reach];
      const H = (b.wing + CLEAR) / b.cos;
      for (const r of roads) {
        if (r.frame === it.frame) continue;
        const o = shear.get(r.frame);
        if (!o) continue;
        // seitliche Lage der fremden Straße relativ zu unserer: xr(d) = da + db·d, über ihre Tiefen [r.s0, r.s1] − s
        const da = o.a - sh.a;
        const db = o.b - sh.b;
        // ihre Tiefen im Band: |(d − dc)·cos − xr(d)·sin| < (wing + CLEAR)·…, für kleine Winkel genügt das Band um dc
        // samt Schräge: d in [dc + xr·tan − H, dc + xr·tan + H]; xr hängt von d ab – zwei Durchgänge reichen
        let d0 = Math.max(r.s0 - s, dc - H - 60);
        let d1 = Math.min(r.s1 - s, dc + H + 60);
        if (d0 > d1) continue;
        for (let k = 0; k < 2; k++) {
          const xa = da + db * d0;
          const xb = da + db * d1;
          const lo = dc + Math.min(xa, xb) * b.tan - H;
          const hi = dc + Math.max(xa, xb) * b.tan + H;
          d0 = Math.max(d0, Math.min(lo, hi));
          d1 = Math.min(d1, Math.max(lo, hi));
          if (d0 > d1) break;
        }
        if (d0 > d1) continue;
        const xa = da + db * d0;
        const xb = da + db * d1;
        if (xa > 0 && xb > 0) lim[1] = Math.min(lim[1], Math.min(xa, xb) / b.cos - CLEAR);
        else if (xa < 0 && xb < 0) lim[0] = Math.min(lim[0], -Math.max(xa, xb) / b.cos - CLEAR);
        else lim = [0, 0];
      }
      // an die letzte Stützstelle davor, mindestens bis unter die Kappen
      const minX = (Math.max(-it.X.xL, it.X.xR) + 2) / b.cos;
      const nMin = Math.max(1, STATIONS.findIndex((v) => v >= minX));
      const nOf = (m) => {
        let n = 1;
        for (let i = 1; i < STATIONS.length; i++) if (STATIONS[i] <= m) n = i;
        return Math.max(n, nMin);
      };
      this.setReach(it, nOf(lim[0]), nOf(lim[1]));
      // Loch im Boden: drei Punkte durch die Scherung (Achse, 100 m flussab, Böschungskante)
      const cam = (Xr, D) => {
        const x = Xr * b.cos - D * b.sin;
        const z = -(Xr * b.sin + D * b.cos) - dc; // Rahmen: z = −d
        return [x + sh.a - sh.b * z, z];
      };
      const [ax, az] = cam(0, 0);
      const [px, pz] = cam(100, 0);
      const [ex, ez] = cam(0, b.half + b.bank);
      const tl = Math.hypot(px - ax, pz - az);
      const tx = (px - ax) / tl;
      const tz = (pz - az) / tl;
      // quer zum Fluss (D) zeigt nach der Scherung nicht mehr senkrecht zur Achse: die Enden des Lochs laufen schräg
      // wie die Stirnwände (Linien gleicher Lage X längs des Flusses), skew = längs je quer
      const ul = (ex - ax) * tx + (ez - az) * tz;
      const uq = (ex - ax) * -tz + (ez - az) * tx;
      const half = Math.abs(uq);
      const k = tl / 100;
      // die Brücken vor dem Auto zuerst, dann die dahinter
      const d = b.c1 < s - 20 ? 1e5 + s - b.c1 : Math.max(b.c0 - s, 0);
      holes.push({ x: ax, z: az, tx, tz, half, skew: ul / uq, r0: -it.reach[0] * k, r1: it.reach[1] * k, d, it });
    }
    holes.sort((p, q) => p.d - q.d);
    for (let i = 0; i < holes.length; i++) holes[i].it.holed = i < MAX_HOLES;
  }

  /** Wie weit das Wasser der Brücke key (b.key + '@' + Math.round(b.sc)) je Seite gerade reicht, null = nicht zu sehen. */
  reachOf(key) {
    const it = this.items.get(key);
    return it && it.group.visible && it.holed ? it.reach : null;
  }

  /**
   * Die Brücken eines Rahmens als Hindernisse für Bewuchs und Szenerie: [{ sc, cos, sin, wing, c0, c1 }] (Meter der
   * Fahrt im Rahmen frame).
   */
  inFrame(frame) {
    const out = [];
    for (const it of this.items.values()) if (it.frame === frame) out.push(it.b);
    return out;
  }
}
