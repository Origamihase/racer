// Kurvenschilder: Gefahrzeichen (Kurve links/rechts, Doppelkurve) 150 bis 250 m vor engen Autobahnkurven, darunter
// „100“ oder „80“ für die engsten, rot-weiße Richtungstafeln außen an engen Kurven (auch auf der Landstraße). Im Stil
// der Miniaturwelt: weich gerundete Tafeln mit dickem, sanft gewölbtem Rand auf runden Pfosten.
//
// Alles steht in der geraden Welt der Simulation am Straßenrand und blickt dem Fahrer entgegen; der Shader biegt es
// mit der Straße (src/curve.js), so stehen die Tafeln auch in der Kurve quer zur Fahrbahn. Wenige Instanzen-Netze
// (Tafeln, Ränder, Pfosten) statt vieler Einzelteile: sechs Zeichenaufrufe für alle Schilder.
import * as THREE from 'three';
import { W } from '../../curve.js';
import { ROAD } from '../../textures.js';
import { MEDIAN_X } from '../road.js';
import { SIGN_R, ADVISE_R } from '../../game/course.js';
import { PAL } from './palette.js';

const CREAM = '#fdfbf5';
const RED = '#df4636';
const INK = '#353a42';

/** Klassische Autobahn: rechts hinter der Leitplanke, links im Mittelstreifen (wie die Tempo-Schilder in scenery.js). */
const AUTOBAHN = { right: ROAD.right + 1.3, left: MEDIAN_X };

// --- Bildatlas: 512 × 768, vier Zellen 256 × 256 für Dreiecke und Scheiben, darunter die Richtungstafel 512 × 256 ---
const AW = 512;
const AH = 768;
const TRI = { side: 236, r: 26, cell: 256 }; // Dreieck in Pixeln
const TRI_M = 1.4; // Seitenlänge in Metern
const DISC = { r: 116 };
const DISC_M = 0.86; // Durchmesser
const CHEV = { w: 496, h: 248, r: 30 };
const CHEV_M = 1.3; // Breite

/** Ecken eines Polygons gerundet (quadratische Bögen): gleich für Canvas und THREE.Shape. */
function roundedPath(p, pts, r) {
  const n = pts.length;
  const at = (i) => pts[(i + n) % n];
  const toward = (a, b, d) => {
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    return [a[0] + ((b[0] - a[0]) * d) / l, a[1] + ((b[1] - a[1]) * d) / l];
  };
  const s = toward(at(0), at(-1), r);
  p.moveTo(s[0], s[1]);
  for (let i = 0; i < n; i++) {
    const c = at(i);
    const e = toward(c, at(i + 1), r);
    p.quadraticCurveTo(c[0], c[1], e[0], e[1]);
    const nx = toward(at(i + 1), c, r);
    p.lineTo(nx[0], nx[1]);
  }
}

/** Ecken des Dreiecks (Spitze oben) in Pixeln der Zelle, Mitte der Zelle = Mitte des Umrisses. */
function triPoints(scale = 1) {
  const a = TRI.side * scale;
  const h = (a * Math.sqrt(3)) / 2;
  const c = TRI.cell / 2;
  return [
    [c, c - h / 2],
    [c + a / 2, c + h / 2],
    [c - a / 2, c + h / 2],
  ];
}

function rectPoints(w, h, cx, cy) {
  return [
    [cx - w / 2, cy - h / 2],
    [cx + w / 2, cy - h / 2],
    [cx + w / 2, cy + h / 2],
    [cx - w / 2, cy + h / 2],
  ];
}

/** Gefahrzeichen in eine Zelle: roter Rand, cremeweißes Feld, dicker runder Pfeil (rechts bzw. erst rechts). */
function drawWarning(ctx, x0, y0, double) {
  ctx.save();
  ctx.translate(x0, y0);
  ctx.beginPath();
  roundedPath(ctx, triPoints(), TRI.r);
  ctx.fillStyle = RED;
  ctx.fill();
  ctx.beginPath();
  roundedPath(ctx, triPoints(0.7), TRI.r * 0.6);
  ctx.fillStyle = CREAM;
  ctx.fill();
  // Pfeil: von unten hoch, dann nach rechts (Doppelkurve: rechts, dann links), runde Enden
  ctx.strokeStyle = INK;
  ctx.fillStyle = INK;
  ctx.lineWidth = 15;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const c = TRI.cell / 2;
  ctx.beginPath();
  let tip;
  let dir;
  if (double) {
    ctx.moveTo(c - 8, 196);
    ctx.bezierCurveTo(c - 8, 168, c + 20, 168, c + 20, 146);
    ctx.bezierCurveTo(c + 20, 126, c - 14, 124, c - 14, 104);
    tip = [c - 14, 86];
    dir = [0, -1];
  } else {
    ctx.moveTo(c - 18, 196);
    ctx.bezierCurveTo(c - 18, 150, c - 12, 120, c + 16, 110);
    tip = [c + 30, 104];
    dir = [0.92, -0.38];
  }
  ctx.stroke();
  // Pfeilspitze: weiches Dreieck in Richtung dir
  const [tx, ty] = tip;
  const [dx, dy] = dir;
  const px = -dy;
  const py = dx;
  ctx.beginPath();
  roundedPath(
    ctx,
    [
      [tx + dx * 14, ty + dy * 14],
      [tx - dx * 12 + px * 17, ty - dy * 12 + py * 17],
      [tx - dx * 12 - px * 17, ty - dy * 12 - py * 17],
    ],
    5,
  );
  ctx.fill();
  ctx.restore();
}

/** Tempo-Empfehlung als rundes Schild: roter Ring, Zahl in weicher, fetter Schrift. */
function drawAdvice(ctx, x0, y0, v) {
  const c = TRI.cell / 2;
  ctx.save();
  ctx.translate(x0, y0);
  ctx.beginPath();
  ctx.arc(c, c, DISC.r, 0, Math.PI * 2);
  ctx.fillStyle = RED;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(c, c, DISC.r * 0.76, 0, Math.PI * 2);
  ctx.fillStyle = CREAM;
  ctx.fill();
  ctx.fillStyle = INK;
  ctx.font = 'bold 96px "Arial Rounded MT Bold", "Trebuchet MS", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(v), c, c + 6, DISC.r * 1.3);
  ctx.restore();
}

/** Richtungstafel: rot mit drei cremeweißen Winkeln nach rechts, runde Ecken. */
function drawChevron(ctx, x0, y0) {
  ctx.save();
  ctx.translate(x0, y0);
  const cx = AW / 2;
  const cy = 128;
  ctx.beginPath();
  roundedPath(ctx, rectPoints(CHEV.w, CHEV.h, cx, cy), CHEV.r);
  ctx.fillStyle = RED;
  ctx.fill();
  ctx.strokeStyle = CREAM;
  ctx.lineWidth = 30;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const x of [cx - 120, cx, cx + 120]) {
    ctx.beginPath();
    ctx.moveTo(x - 34, cy - 74);
    ctx.lineTo(x + 34, cy);
    ctx.lineTo(x - 34, cy + 74);
    ctx.stroke();
  }
  ctx.restore();
}

function atlasTexture() {
  const c = document.createElement('canvas');
  c.width = AW;
  c.height = AH;
  const ctx = c.getContext('2d');
  drawWarning(ctx, 0, 0, false);
  drawWarning(ctx, 256, 0, true);
  drawAdvice(ctx, 0, 256, 100);
  drawAdvice(ctx, 256, 256, 80);
  drawChevron(ctx, 0, 512);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

// Bildausschnitte (u0, v0, du, dv) und Tafelgrößen in Metern; die Tafel ist eine Einheitsfläche, skaliert je Instanz
const cellUv = (px, py, w, h) => [px / AW, 1 - (py + h) / AH, w / AW, h / AH];
const FACES = {
  warn: { uv: cellUv(0, 0, 256, 256), w: (TRI.cell / TRI.side) * TRI_M, h: (TRI.cell / TRI.side) * TRI_M },
  warn2: { uv: cellUv(256, 0, 256, 256), w: (TRI.cell / TRI.side) * TRI_M, h: (TRI.cell / TRI.side) * TRI_M },
  100: { uv: cellUv(0, 256, 256, 256), w: (TRI.cell / (2 * DISC.r)) * DISC_M, h: (TRI.cell / (2 * DISC.r)) * DISC_M },
  80: { uv: cellUv(256, 256, 256, 256), w: (TRI.cell / (2 * DISC.r)) * DISC_M, h: (TRI.cell / (2 * DISC.r)) * DISC_M },
  chev: { uv: cellUv(0, 512, 512, 256), w: (AW / CHEV.w) * CHEV_M, h: (256 / CHEV.w) * CHEV_M },
};

// --- Körper: der Umriss als flache, rundum weich gewölbte Platte (Rand rot, Rückseite grau) -------------------
const DEPTH = 0.022;
const BEVEL = 0.02;

/** Umriss in Metern aus Pixeln der Zelle (Mitte der Zelle = Ursprung, y nach oben). */
function shapeFrom(pts, r, mPerPx, cx, cy) {
  const s = new THREE.Shape();
  roundedPath(
    s,
    pts.map(([x, y]) => [(x - cx) * mPerPx, (cy - y) * mPerPx]),
    r * mPerPx,
  );
  return s;
}

/** Platte aus dem Umriss; seg teilt jeden Bogen (ein ganzer Kreis bekommt 2 · seg Ecken). */
function slab(shape, rim, back, seg = 6) {
  const g = new THREE.ExtrudeGeometry(shape, { depth: DEPTH, bevelEnabled: true, bevelThickness: BEVEL, bevelSize: BEVEL, bevelSegments: 3, curveSegments: seg });
  g.translate(0, 0, -(DEPTH + BEVEL)); // Vorderseite bei z = 0
  const nrm = g.attributes.normal;
  const col = new Float32Array(nrm.count * 3);
  const a = new THREE.Color(rim);
  const b = new THREE.Color(back);
  for (let i = 0; i < nrm.count; i++) (nrm.getZ(i) < -0.5 ? b : a).toArray(col, i * 3);
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return g;
}

/** Pfosten mit runden Enden, Fuß bei y = 0. */
function post(h) {
  const r = 0.055;
  const g = new THREE.CapsuleGeometry(r, h - 2 * r, 4, 10);
  g.translate(0, h / 2, 0);
  return g;
}

const CAP = { sign: 48, chev: 96 };
const POST_TALL = 3.25;
const POST_LOW = 1.75;
const TRI_Y = 2.8; // Mitte des Dreiecks
const DISC_Y = 1.62;
const CHEV_Y = 1.32;
const POST_Z = -0.11; // hinter der Tafel
/** So weit hinter und vor dem Spieler stehen Schilder (vorne ganz im Dunst); neu gelegt alle REBUILD Meter. */
const BEHIND = 400;
const AHEAD = 3000;
const REBUILD = 400;
/** So weit hinter dem Fenster wird noch nach dem Gegenbogen einer Doppelkurve gesucht. */
const PAIR = 300;
const MAX = CAP.sign + CAP.chev;
// Die Landschaft der Autobahn stellt ihre Möbel in ein Raster aus 100-m-Stücken (scenery.js, SEG): das
// Kilometerschild an den Anfang, die Notrufsäule 30 m, die Tafeln 40 m und die Schilderbrücke (Füße rechts und im
// Mittelstreifen) 50 m dahinter. Kurvenschilder halten davon GRID.gap Meter Abstand (sie rücken höchstens so weit).
const GRID = { seg: 100, at: [0, 30, 40, 50, 100], gap: 5 };
/** Ein gelegtes Schild rückt einem später bestellten Möbel nur aus dem Weg, solange es so weit voraus steht. */
const MOVE_FAR = 250;
/** Steht an der Stelle s am Rand schon ein Möbel der Autobahn-Landschaft? */
export function gridBusy(s) {
  const o = s - GRID.seg * Math.floor(s / GRID.seg);
  for (const a of GRID.at) if (Math.abs(o - a) < GRID.gap) return true;
  return false;
}
/** Nächste freie Stelle bei s in [lo, hi] (sucht in Metern nach hinten und vorne). */
function freeNear(s, busy, lo, hi) {
  if (!busy(s)) return s;
  for (let k = 1; k <= 4 * GRID.gap; k++) {
    if (s - k >= lo && !busy(s - k)) return s - k;
    if (s + k <= hi && !busy(s + k)) return s + k;
  }
  return s;
}

/**
 * Lage der Schilder je Abschnitt: x rechts (hinter dem Bankett) und links (Mittelstreifen bzw. linker Fahrbahnrand).
 * Kurvenprobe und Endlos-Kurs zeichnen überall die klassische Autobahn; für die XXL-Fahrt passt profileLayout zu
 * den Querschnitten der Engine (Asphalt der zweispurigen Straßen 3,25 … 11,25 m; Rampen und Orte haben keine engen
 * Kurven).
 */
export const autobahnLayout = () => AUTOBAHN;
const TWO_LANES = { right: 12.55, left: 1.95 };
export const profileLayout = (sec) => (sec.profile === 'ab' ? AUTOBAHN : TWO_LANES);

/** Kurvenschilder auf dem Weg vor dem Spieler (course.eachBend), alle REBUILD Meter und bei neuem Kurs neu gelegt. */
export class CurveSigns {
  /**
   * parent: Szene oder Gruppe. layout(sec) → {right, left} (siehe profileLayout). busy(s) → true, wo am Rand schon
   * etwas steht (Vorgabe: das Möbelraster der Autobahn; main.js nimmt auch Blitzer und Tempo-Schilder dazu). edge() →
   * ein Wert, der sich ändert, sobald am Rand etwas dazukommt (dann werden die Schilder neu gelegt).
   */
  constructor(parent, { layout = autobahnLayout, busy = gridBusy, edge = () => 0 } = {}) {
    this.layout = layout;
    this.busy = busy;
    this.edge = edge;
    this.edgeVer = null;
    this.course = null;
    this.group = new THREE.Group();
    this.group.name = 'Kurvenschilder';
    parent.add(this.group);
    this.ver = -1;
    this.base = -Infinity;

    const atlas = atlasTexture();
    const face = W.std({ map: atlas, alphaTest: 0.5, roughness: 0.42, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -4 });
    // je Instanz ein Bildausschnitt (aUvT: Versatz, Größe; negative Breite = gespiegelt)
    const curved = face.onBeforeCompile;
    face.onBeforeCompile = (shader, renderer) => {
      curved(shader, renderer);
      shader.vertexShader = 'attribute vec4 aUvT;\n' + shader.vertexShader.replace('#include <uv_vertex>', '#include <uv_vertex>\nvMapUv = vMapUv * aUvT.zw + aUvT.xy;');
    };
    face.customProgramCacheKey = () => 'curved-world-atlas';
    const body = W.std({ vertexColors: true, roughness: 0.55 });
    const steel = W.std({ color: PAL.steel, metalness: 0.3, roughness: 0.45 });

    const triPx = TRI_M / TRI.side;
    const tri = shapeFrom(triPoints(), TRI.r, triPx, TRI.cell / 2, TRI.cell / 2);
    const disc = new THREE.Shape();
    disc.absarc(0, 0, DISC_M / 2, 0, Math.PI * 2, false);
    const chevPx = CHEV_M / CHEV.w;
    const chev = shapeFrom(rectPoints(CHEV.w, CHEV.h, 0, 0), CHEV.r, chevPx, 0, 0);
    const back = 0x8e979f;

    const plane = new THREE.PlaneGeometry(1, 1);
    this.uvT = new THREE.InstancedBufferAttribute(new Float32Array((CAP.sign * 2 + CAP.chev) * 4), 4);
    plane.setAttribute('aUvT', this.uvT);
    const mk = (geo, mat, cap, shadow) => {
      const mesh = new THREE.InstancedMesh(geo, mat, cap);
      mesh.count = 0;
      mesh.visible = false;
      mesh.frustumCulled = false; // die Instanzen liegen kilometerweit auseinander und werden verbogen
      mesh.castShadow = shadow;
      mesh.receiveShadow = true;
      this.group.add(mesh);
      return mesh;
    };
    this.faces = mk(plane, face, CAP.sign * 2 + CAP.chev, false);
    this.tris = mk(slab(tri, PAL.red, back), body, CAP.sign, true);
    this.discs = mk(slab(disc, PAL.red, back, 16), body, CAP.sign, true); // 32 Ecken: auch ganz nah rund
    this.chevs = mk(slab(chev, PAL.red, back), body, CAP.chev, true);
    this.tall = mk(post(POST_TALL), steel, CAP.sign, true);
    this.low = mk(post(POST_LOW), steel, CAP.chev, true);

    // Bögen im Blickfeld (vorbelegt, ohne Speicher je Bild)
    this.bn = 0;
    this.b0 = new Float64Array(64);
    this.b1 = new Float64Array(64);
    this.bk = new Float64Array(64);
    this.bt = new Float64Array(64);
    this.bkind = new Array(64).fill('');
    this.bsec = new Array(64).fill(null);
    this.bpath = new Array(64).fill(null);
    this.lo = 0;
    this.hi = 0;
    this.visit = (s0, s1, k, t, kind, i, sec, path) => {
      if (s1 < this.lo || s0 > this.hi + PAIR || this.bn >= 64) return;
      const j = this.bn++;
      this.b0[j] = s0;
      this.b1[j] = s1;
      this.bk[j] = k;
      this.bt[j] = t;
      this.bkind[j] = kind;
      this.bsec[j] = sec;
      this.bpath[j] = path;
    };
    // die gelegten Schilder: Art (0 Richtungstafel, 1 Kurve, 2 Doppelkurve), Stelle, Querlage, eigene Drehung,
    // gespiegelt, Tempo-Empfehlung, Abschnitt und Weg (für die Scherung), erste Instanz jedes Teils
    this.n = 0;
    this.type = new Uint8Array(MAX);
    this.sAt = new Float64Array(MAX);
    this.x = new Float64Array(MAX);
    this.yaw = new Float64Array(MAX);
    this.flip = new Uint8Array(MAX);
    this.adv = new Uint8Array(MAX);
    this.sec = new Array(MAX).fill(null);
    this.path = new Array(MAX).fill(null);
    this.ia = new Int16Array(MAX); // erste Bildfläche
    this.ib = new Int16Array(MAX); // Tafel (Dreieck oder Richtungstafel)
    this.ic = new Int16Array(MAX); // Scheibe der Tempo-Empfehlung (−1: keine)
    this.ip = new Int16Array(MAX); // Pfosten
    // Zustand (0 neu, 1 aufgestellt, 2 versteckt) und Scherung, mit der jedes Schild zuletzt aufgestellt wurde
    this.st = new Uint8Array(MAX);
    this.sa = new Float64Array(MAX);
    this.sb = new Float64Array(MAX);
    // schon einmal gelegte Schilder behalten ihre Stelle (kommt später ein Blitzer dazu, springt nichts im Bild)
    this.spots = new Map();
    this.m = new THREE.Matrix4();
    this.part = new THREE.Matrix4();
    this.q = new THREE.Quaternion();
    this.v = new THREE.Vector3();
    this.sc = new THREE.Vector3();
    this.up = new THREE.Vector3(0, 1, 0);
    this.zero = new THREE.Matrix4().makeScale(0, 0, 0);
  }

  /**
   * Jedes Bild: Schilder mitführen; neu legen, wenn der Kurs eine neue Auswahl hat (course.version) oder der
   * Spieler REBUILD Meter weiter ist. shear (XXL-Fahrt): (sec, path) → {a, b} Scherung des Rahmens, in dem der
   * Abschnitt liegt (trip.shears(): x erscheint bei x + a + b · d), oder null, wenn der Abschnitt gerade nicht
   * gezeichnet wird (trip.visible, autobahnView). Ohne shear gibt es nur eine ungescherte Straße.
   */
  update(course, s, shear = null) {
    const ev = this.edge();
    if (course !== this.course || course.version !== this.ver || ev !== this.edgeVer || Math.abs(s - this.base) > REBUILD) this.rebuild(course, s, ev);
    this.group.position.z = s - this.base;
    let moved = false;
    for (let i = 0; i < this.n; i++) {
      // weit hinter dem Auto endet die Tabelle der Biegung (src/curve.js): dort nichts mehr zeigen, auch nicht im Spiegel
      if (this.sAt[i] < s - BEHIND) {
        if (this.st[i] !== 2) {
          this.hide(i);
          moved = true;
        }
        continue;
      }
      let a = 0;
      let b = 0;
      if (shear) {
        const sh = shear(this.sec[i], this.path[i]);
        if (!sh) {
          if (this.st[i] !== 2) {
            this.hide(i);
            moved = true;
          }
          continue;
        }
        a = sh.a;
        b = sh.b;
      }
      // unverändert nur, wenn die Scherung gleich blieb und nicht schräg ist (sonst wandert x mit d)
      if (this.st[i] === 1 && a === this.sa[i] && b === 0 && this.sb[i] === 0) continue;
      this.pose(i, a, b, s);
      moved = true;
    }
    if (moved) this.flush();
  }

  rebuild(course, s, ev) {
    this.course = course;
    this.ver = course.version;
    this.edgeVer = ev;
    this.base = s;
    this.lo = s - BEHIND;
    this.hi = s + AHEAD;
    this.bn = 0;
    course.eachBend(this.visit);
    for (const [key, at] of this.spots) if (at < this.lo) this.spots.delete(key);
    this.n = 0;
    const cnt = { faces: 0, tris: 0, discs: 0, chevs: 0, tall: 0, low: 0 };
    let covered = -1;
    for (let i = 0; i < this.bn; i++) {
      if (this.b0[i] > this.hi) continue; // nur für die Doppelkurve davor besucht
      const k = this.bk[i];
      const R = 1 / Math.abs(k);
      const kind = this.bkind[i];
      const side = this.layout(this.bsec[i]);
      const t = this.bt[i];
      // Richtungstafeln außen an engen Kurven (auch auf der Landstraße)
      const tight = kind === 'ab' ? R < SIGN_R : R < 260;
      if (tight) {
        const x = k > 0 ? side.right : side.left;
        const from = this.b0[i] + 0.5 * t;
        const to = this.b1[i] - 0.5 * t;
        const gap = Math.min(Math.max(R / (kind === 'ab' ? 9 : 5), 20), 80);
        const n = Math.max(2, Math.floor((to - from) / gap) + 1);
        // dem Fahrer zugewandt, der durch die Kurve kommt (er sieht die Tafel aus gut 150 m)
        const yaw = Math.max(-0.25, Math.min(0.25, -k * 75));
        for (let j = 0; j < n && cnt.chevs < CAP.chev && this.n < MAX; j++) {
          // die Tafel bleibt in ihrem Bogen (in Folgen enger Kurven stünde sie sonst schon am nächsten, falsch herum)
          const sAt = this.spot(this.b0[i], 'c' + j, from + ((to - from) * (j + 0.5)) / n, this.b0[i] + 2, this.b1[i] - 2);
          if (sAt < this.lo) continue;
          const id = this.add(0, sAt, x, yaw, k > 0, 0, i);
          this.ia[id] = cnt.faces++;
          this.ib[id] = cnt.chevs++;
          this.ic[id] = -1;
          this.ip[id] = cnt.low++;
        }
      }
      // Gefahrzeichen und Tempo-Empfehlung vor engen Autobahnkurven (beidseitig)
      if (kind !== 'ab' || R >= SIGN_R || i <= covered) continue;
      let double = false;
      let rMin = R;
      if (i + 1 < this.bn && Math.sign(this.bk[i + 1]) !== Math.sign(k) && this.b0[i + 1] - this.b1[i] < 250 && 1 / Math.abs(this.bk[i + 1]) < 1000) {
        double = true;
        rMin = Math.min(R, 1 / Math.abs(this.bk[i + 1]));
        covered = i + 1;
      }
      const ahead = 150 + 100 * Math.max(0, Math.min(1, (SIGN_R - R) / (SIGN_R - 420)));
      const sw = this.spot(this.b0[i], 'w', this.b0[i] - ahead);
      if (sw < this.lo) continue;
      const adv = rMin < ADVISE_R[80] ? 80 : rMin < ADVISE_R[100] ? 100 : 0;
      for (const x of [side.right, side.left]) {
        if (cnt.tris >= CAP.sign || this.n >= MAX) break;
        const id = this.add(double ? 2 : 1, sw, x, 0, k > 0, adv, i);
        this.ia[id] = cnt.faces;
        cnt.faces += adv ? 2 : 1;
        this.ib[id] = cnt.tris++;
        this.ic[id] = adv ? cnt.discs++ : -1;
        this.ip[id] = cnt.tall++;
      }
    }
    for (const key of ['faces', 'tris', 'discs', 'chevs', 'tall', 'low']) {
      const mesh = this[key];
      mesh.count = cnt[key];
      mesh.visible = cnt[key] > 0;
    }
    // Bildausschnitte stehen fest; die Lage setzt update
    for (let i = 0; i < this.n; i++) {
      const f = this.type[i] === 0 ? 'chev' : this.type[i] === 1 ? 'warn' : 'warn2';
      this.uv(this.ia[i], f, this.flip[i]);
      if (this.ic[i] >= 0) this.uv(this.ia[i] + 1, this.adv[i], 0);
      this.st[i] = 0;
    }
    this.uvT.needsUpdate = true;
  }

  /**
   * Stelle eines Schilds: beim ersten Mal frei von anderen Möbeln am Rand, danach dieselbe; steht dort inzwischen
   * etwas und ist das Schild noch weit voraus, rückt es ein Stück (aus der Nähe sähe man es springen).
   */
  spot(s0, role, want, lo = -Infinity, hi = Infinity) {
    const key = Math.round(s0 * 8) + role;
    let at = this.spots.get(key);
    // neu auch, wenn der Bogen inzwischen kürzer ist (neu entworfen) und die alte Stelle nicht mehr in ihm liegt
    if (at === undefined || at < lo || at > hi || (at - this.base > MOVE_FAR && this.busy(at))) {
      at = freeNear(want, this.busy, lo, hi);
      this.spots.set(key, at);
    }
    return at;
  }

  /** Schild anlegen (Lage setzt erst pose). Gibt seine Nummer zurück. */
  add(type, sAt, x, yaw, flip, adv, bend) {
    const i = this.n++;
    this.type[i] = type;
    this.sAt[i] = sAt;
    this.x[i] = x;
    this.yaw[i] = yaw;
    this.flip[i] = flip ? 1 : 0;
    this.adv[i] = adv;
    this.sec[i] = this.bsec[bend];
    this.path[i] = this.bpath[bend];
    return i;
  }

  /** Schild i bei Scherung (a, b) aufstellen: x + a + b · d, dem Fahrer seiner Straße zugewandt. */
  pose(i, a, b, s) {
    this.st[i] = 1;
    this.sa[i] = a;
    this.sb[i] = b;
    const d = this.sAt[i] - s;
    this.q.setFromAxisAngle(this.up, this.yaw[i] - Math.atan(b));
    this.m.compose(this.v.set(this.x[i] + a + b * d, 0, -(this.sAt[i] - this.base)), this.q, this.sc.set(1, 1, 1));
    const chev = this.type[i] === 0;
    this.face(this.ia[i], chev ? 'chev' : 'warn', chev ? CHEV_Y : TRI_Y);
    this.put(chev ? this.chevs : this.tris, this.ib[i], 0, chev ? CHEV_Y : TRI_Y, 0);
    if (this.ic[i] >= 0) {
      this.face(this.ia[i] + 1, this.adv[i], DISC_Y);
      this.put(this.discs, this.ic[i], 0, DISC_Y, 0);
    }
    this.put(chev ? this.low : this.tall, this.ip[i], 0, 0, POST_Z);
  }

  /** Schild i verstecken (sein Abschnitt wird gerade nicht gezeichnet). */
  hide(i) {
    this.st[i] = 2;
    const chev = this.type[i] === 0;
    this.faces.setMatrixAt(this.ia[i], this.zero);
    (chev ? this.chevs : this.tris).setMatrixAt(this.ib[i], this.zero);
    if (this.ic[i] >= 0) {
      this.faces.setMatrixAt(this.ia[i] + 1, this.zero);
      this.discs.setMatrixAt(this.ic[i], this.zero);
    }
    (chev ? this.low : this.tall).setMatrixAt(this.ip[i], this.zero);
  }

  flush() {
    for (const mesh of [this.faces, this.tris, this.discs, this.chevs, this.tall, this.low]) mesh.instanceMatrix.needsUpdate = true;
  }

  /** Teil mit Versatz (x, y, z im Schild) als Instanz j von mesh. */
  put(mesh, j, x, y, z) {
    this.part.makeTranslation(x, y, z).premultiply(this.m);
    mesh.setMatrixAt(j, this.part);
  }

  /** Bildfläche j: Einheitsfläche in Tafelgröße vor der Tafel. */
  face(j, type, y) {
    const f = FACES[type];
    this.part.makeScale(f.w, f.h, 1).setPosition(0, y, 0.004).premultiply(this.m);
    this.faces.setMatrixAt(j, this.part);
  }

  /** Bildausschnitt der Fläche j aus dem Atlas (mirror: nach links gespiegelt). */
  uv(j, type, mirror) {
    const [u, v, du, dv] = FACES[type].uv;
    this.uvT.setXYZW(j, mirror ? u + du : u, v, mirror ? -du : du, dv);
  }
}
