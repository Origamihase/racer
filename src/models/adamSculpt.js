// Mini Adams Formen: jedes Stoffteil ist ein prall gestopftes Kissen, beschrieben als Abstandsfunktion
// (weich verschmolzene Ellipsoide, Kapseln, Ringe) und einmal beim Laden abgetastet (softMesh.js): rundliche Teile
// mit Strahlen von innen, Bart, Brauen, Lippe und Schnurrbart als Schläuche, die auf der Haut liegen.
// Teile, die sich bewegen (Lider, Brauen, Schnurrbart-Hälften, Unterkiefer, Arme, Beine), bleiben eigene Netze;
// alles, was fest am Kopf bzw. am Körper sitzt, wird je Gruppe zu einem Netz mit einem Material.
// Farben, Flausch, Florrichtung, Nähte und Aufdrucke stehen je Ecke in der Geometrie (plushMaterial.js).
// Gebaut wird nur einmal je Seite: alle Mini Adams (Auto, Facecam) teilen sich die Geometrie.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { ell, sell, cone, smin, smax, rayMesh, rayBall, spacing, gridMesh, tubeMesh, toGeometry, addMorphs } from './softMesh.js';

const TAU = Math.PI * 2;

/** Stofffarben (sRGB) – auch für die Plüschhände im Cockpit (siehe COLORS in miniAdam.js) */
export const FABRIC = {
  skin: 0xd8a679,
  skinDeep: 0xc98d63,
  blush: 0xe39783,
  nose: 0xd2916b,
  lip: 0xcd8a6e,
  hair: 0x3b2a1f,
  beard: 0x2e2018,
  brow: 0x45301f,
  cap: 0x1d1d22,
  shirt: 0x1c1c21,
  pants: 0x44464f,
  shoe: 0x2b2b31,
  sole: 0x707077,
  mouth: 0x3c1616,
  tongue: 0xb85a55,
  lidRim: 0x4a2c1c,
  vest: 0xd2f02e,
  vestEdge: 0xb5cf26,
  vestStripe: 0xc9ccd2,
  micFoam: 0xe2232f,
  micBody: 0x222226,
  tag: 0xf3efe6,
  heart: 0xe2232f,
};

// --- Maße (Körperkoordinaten: Füße auf y = 0, Blick nach +z) ------------------------------------------
/** Drehpunkt des Kopfes (Hals) und Lage der Kopfmitte relativ dazu */
export const NECK = [0, 0.6, -0.006];
export const HEAD_C = [0, 0.125, 0.012];
/** Augen (Kopfmitte-Koordinaten): Mitte und Halbachsen des Augapfels */
export const EYE_C = [0.053, 0.026, 0.118];
export const EYE_R = [0.04, 0.045, 0.035];
/** Brauen (Kopfmitte-Koordinaten): Mitte der rechten Braue (+x), die linke gespiegelt */
export const BROW_C = [0.056, 0.083, 0.13];
/**
 * Schnurrbart: Drehpunkt der Hälften (unter der Nase) und Drehwinkel der beiden Morph-Ziele „Lächeln“ und
 * „Schmollmund“; Ursprung des Unterkiefers, der beim Sprechen nach unten gleitet (Kopfmitte-Koordinaten)
 */
export const STACHE_C = [0, -0.066, 0.165];
export const STACHE_SMILE = 0.3;
export const STACHE_POUT = 0.16;
export const JAW_C = [0, -0.12, 0.12];
export const SHOULDER = [0.172, 0.5, 0.0];
export const UPPER_ARM = 0.14;
export const FORE_ARM = 0.135;
export const HIP = [0.085, 0.255, 0.0];

// --- Kleine Helfer ----------------------------------------------------------------------------------------
const sph = (x, y, z, cx, cy, cz, r) => Math.hypot(x - cx, y - cy, z - cz) - r;
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const sstep = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const sgn = (v) => (v < 0 ? -1 : 1);

/** Ring (Torus mit ovalem Querschnitt) um die y-Achse durch (cx, cy, cz): Radius R, Querschnitt a (radial) × b (hoch) */
function ringY(x, y, z, cx, cy, cz, R, a, b, sx = 1, sz = 1) {
  const q = Math.hypot((x - cx) / sx, (z - cz) / sz) - R;
  return ell(q, y, 0, 0, cy, 0, a, b, 1);
}

const GR = [0, 0, 0];
/** Richtung der Steigung (Flächennormale) von sdf bei (x, y, z) */
function grad(sdf, x, y, z, e = 0.0004) {
  GR[0] = sdf(x + e, y, z) - sdf(x - e, y, z);
  GR[1] = sdf(x, y + e, z) - sdf(x, y - e, z);
  GR[2] = sdf(x, y, z + e) - sdf(x, y, z - e);
  const l = Math.hypot(GR[0], GR[1], GR[2]) || 1;
  GR[0] /= l;
  GR[1] /= l;
  GR[2] /= l;
  return GR;
}

/** Zieht p ([x, y, z]) auf die Fläche sdf = 0 und schreibt die Flächennormale nach n. */
function snap(sdf, p, n) {
  for (let i = 0; i < 10; i++) {
    const d = sdf(p[0], p[1], p[2]);
    const g = grad(sdf, p[0], p[1], p[2]);
    p[0] -= g[0] * d;
    p[1] -= g[1] * d;
    p[2] -= g[2] * d;
    if (Math.abs(d) < 1e-6) break;
  }
  const g = grad(sdf, p[0], p[1], p[2]);
  n[0] = g[0];
  n[1] = g[1];
  n[2] = g[2];
}

/**
 * Schlauch, der auf einer Fläche liegt (Bart, Brauen, Lippe, Schnurrbart): pts = Stützpunkte nahe der Fläche
 * (werden daraufgezogen), off(u) = Abstand der Mittellinie von der Fläche, sec(u) = [quer, hoch] (hoch = entlang der
 * Flächennormale, so liegt ein flacher Querschnitt auf). Rückgabe: Netz und eine Abstandsfunktion (Kapselkette) für
 * die Umgebungsverdeckung der Nachbarn.
 */
function surfaceTube(sdf, pts, off, sec, opts = {}) {
  const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(p[0], p[1], p[2])), !!opts.closed, 'centripetal');
  const v = new THREE.Vector3();
  const P = [0, 0, 0];
  const N = [0, 0, 0];
  let lastU = NaN;
  const at = (u) => {
    // Bahn und Normale fragen je Ring nacheinander dasselbe u ab: nur einmal rechnen
    if (u === lastU) return;
    lastU = u;
    curve.getPoint(Math.min(1, Math.max(0, u)), v);
    P[0] = v.x;
    P[1] = v.y;
    P[2] = v.z;
    snap(sdf, P, N);
  };
  const part = tubeMesh(
    (u, o) => {
      at(u);
      const k = off(u);
      o[0] = P[0] + N[0] * k;
      o[1] = P[1] + N[1] * k;
      o[2] = P[2] + N[2] * k;
    },
    sec,
    {
      ...opts,
      up: (u, o) => {
        at(u);
        o[0] = N[0];
        o[1] = N[1];
        o[2] = N[2];
      },
    },
  );
  // Kapselkette entlang der Mittellinie (Radius = mittlere Halbachse)
  const caps = [];
  for (let i = 0; i <= 12; i++) {
    const u = i / 12;
    at(u);
    const k = off(u);
    const [a, b] = sec(u);
    caps.push([P[0] + N[0] * k, P[1] + N[1] * k, P[2] + N[2] * k, (a + b) / 2]);
  }
  const dist = (x, y, z) => {
    let d = Infinity;
    for (let i = 0; i < caps.length - 1; i++) {
      const p = caps[i];
      const q = caps[i + 1];
      d = Math.min(d, cone(x, y, z, p[0], p[1], p[2], q[0], q[1], q[2], p[3], q[3]));
    }
    return d;
  };
  return { part, dist };
}

/**
 * Polster, das sich der Fläche anschmiegt (Seitenbart): jeder Punkt des Querschnitts wird erst auf die Fläche gezogen
 * und dann entlang seiner eigenen Normale angehoben – oben rund, die Unterseite knapp unter der Haut. Ein starrer
 * ovaler Querschnitt (surfaceTube) stünde auf stark gewölbter Haut mit den Rändern ab (von der Seite eine Finne mit
 * Spalt darunter). sec(u) = [halbe Breite, Dicke, halbe Breite nach hinten (−N × T; fehlt: wie vorn)].
 * Rückgabe wie surfaceTube.
 */
function surfaceBand(sdf, pts, sec, { nu = 20, nv = 56 } = {}) {
  const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(p[0], p[1], p[2])), false, 'centripetal');
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const rows = [];
  for (let j = 0; j <= nv; j++) {
    const u = 0.5 - 0.5 * Math.cos((Math.PI * j) / nv);
    curve.getPoint(u, a);
    const P = [a.x, a.y, a.z];
    const N = [0, 0, 0];
    snap(sdf, P, N);
    curve.getPoint(Math.min(1, u + 0.003), a);
    curve.getPoint(Math.max(0, u - 0.003), b);
    a.sub(b);
    // quer zur Bahn in der Fläche: N × T (so zeigen die Dreiecke nach außen)
    b.set(N[0], N[1], N[2]).cross(a).normalize();
    rows.push({ u, P, N, B: [b.x, b.y, b.z] });
  }
  const Q = [0, 0, 0];
  const NQ = [0, 0, 0];
  const part = gridMesh(
    nu,
    nv,
    (s, t, o) => {
      const r = rows[Math.round(t * nv)];
      const [w, h, wb = w] = sec(r.u);
      const ph = s * Math.PI * 2;
      const c = Math.cos(ph);
      const q = (c > 0 ? w : wb) * c;
      Q[0] = r.P[0] + r.B[0] * q;
      Q[1] = r.P[1] + r.B[1] * q;
      Q[2] = r.P[2] + r.B[2] * q;
      snap(sdf, Q, NQ);
      const sn = Math.sin(ph);
      const lift = sn > 0 ? h * Math.pow(sn, 0.6) - 0.0006 : 0.003 * sn;
      o[0] = Q[0] + NQ[0] * lift;
      o[1] = Q[1] + NQ[1] * lift;
      o[2] = Q[2] + NQ[2] * lift;
    },
    { closedU: true },
  );
  // Kapselkette auf halber Höhe (Radius = mittlere Halbachse) für die Umgebungsverdeckung der Nachbarn
  const caps = [];
  for (let i = 0; i <= 12; i++) {
    const r = rows[Math.round((i / 12) * nv)];
    const [w, h] = sec(r.u);
    caps.push([r.P[0] + r.N[0] * h * 0.5, r.P[1] + r.N[1] * h * 0.5, r.P[2] + r.N[2] * h * 0.5, (w + h) / 2]);
  }
  const dist = (x, y, z) => {
    let d = Infinity;
    for (let i = 0; i < caps.length - 1; i++) {
      const p = caps[i];
      const q = caps[i + 1];
      d = Math.min(d, cone(x, y, z, p[0], p[1], p[2], q[0], q[1], q[2], p[3], q[3]));
    }
    return d;
  };
  return { part, dist };
}

/** Punkte auf der Schnittkurve zweier Flächen a = 0 und b = 0: die Startpunkte abwechselnd auf beide gezogen */
function onBoth(a, b, seeds) {
  const n = [0, 0, 0];
  return seeds.map((s) => {
    const p = s.slice();
    for (let i = 0; i < 14; i++) {
      snap(a, p, n);
      snap(b, p, n);
    }
    return p;
  });
}

/** Querschnitt mit runden Enden: Grundmaß base(u) × Halbkreis-Rundung über die ersten/letzten end-Anteile */
const roundEnds = (u, end = 0.12) => Math.sqrt(clamp01(Math.min(u, 1 - u) / end) * (2 - clamp01(Math.min(u, 1 - u) / end)));

/** Strich (Florrichtung) entlang n, nach unten gekämmt: o = normalize(n·k + (0, −1, 0)) × Florlänge */
function combDown(k, pile) {
  return (x, y, z, o, nx, ny, nz) => {
    o[0] = nx * k;
    o[1] = -1;
    o[2] = nz * k;
    const l = Math.hypot(o[0], o[1], o[2]);
    o[0] *= pile / l;
    o[1] *= pile / l;
    o[2] *= pile / l;
  };
}

/** Matrix für Teile in Kopfmitte-Koordinaten → Kopfgruppe (Ursprung Hals) */
const HC_TO_HEAD = new THREE.Matrix4().makeTranslation(HEAD_C[0], HEAD_C[1], HEAD_C[2]);

// =====================================================================================================
// Kopf (alles in Kopfmitte-Koordinaten)
// =====================================================================================================
// Gesicht: Schädel, runde Pausbacken, eine volle Mundpartie; dort eine flache Mulde (die Mundhöhle), die nur zu
// sehen ist, wenn der Unterkiefer aufgeht – davor liegen Unterlippe und Schnurrbart.
const MOUTH = (x, y, z) => ell(x, y, z, 0, -0.103, 0.158, 0.047, 0.024, 0.02);
function faceBase(x, y, z) {
  const ax = Math.abs(x);
  let d = ell(x, y, z, 0, 0.01, -0.004, 0.158, 0.185, 0.152);
  d = smin(d, ell(ax, y, z, 0.07, -0.05, 0.066, 0.071, 0.064, 0.074), 0.05);
  d = smin(d, ell(x, y, z, 0, -0.088, 0.066, 0.09, 0.066, 0.092), 0.05);
  return d;
}
export const faceSdf = (x, y, z) => smax(faceBase(x, y, z), -MOUTH(x, y, z), 0.01);

// Nase: dicke Knolle mit Nasenrücken zwischen den Augen und weichen Nasenflügeln
function noseSdf(x, y, z) {
  let d = ell(x, y, z, 0, -0.026, 0.17, 0.046, 0.042, 0.042);
  d = smin(d, cone(x, y, z, 0, 0.024, 0.136, 0, -0.01, 0.163, 0.015, 0.027), 0.02);
  d = smin(d, ell(Math.abs(x), y, z, 0.029, -0.045, 0.155, 0.024, 0.02, 0.022), 0.018);
  return d;
}

// Augäpfel (für die Umgebungsverdeckung und den dunklen Rand um die Augen)
const eyeSdf = (x, y, z) => ell(Math.abs(x), y, z, EYE_C[0], EYE_C[1], EYE_C[2], EYE_R[0], EYE_R[1], EYE_R[2]);

// Cap: wie getragen nach hinten gekippt – vorn sitzt das Band hoch über der Stirn, hinten tief am Hinterkopf, so dass
// die Krone den Kopf bis zum Hinterkopf umfasst wie beim Plüsch (gerade aufgesetzt säße sie als kleine Kuppel auf den
// Haaren). Im Grundriss oval (cz, Rz: Mitte und Halbachse nach vorn/hinten), unten ein weicher Rand (Schweißband),
// oben ein Knopf; Schirm extra
const CAP = { tilt: -0.24, y: 0.07, z: -0.01, R: 0.168, Rz: 0.1605, cz: -0.0025, H: 0.142, button: 0.019 };
const capFrame = new THREE.Matrix4().makeRotationX(CAP.tilt).setPosition(0, CAP.y, CAP.z);
const capInv = capFrame.clone().invert();
const capPt = new THREE.Vector3();
function capLocal(x, y, z) {
  return capPt.set(x, y, z).applyMatrix4(capInv);
}
/** Krone in Cap-Koordinaten (Unterkante y = 0) */
function crownLocal(px, py, pz) {
  let d = sell(px, py, pz, 0, -0.012, CAP.cz, CAP.R, CAP.H + 0.012, CAP.Rz, 2.3);
  // Schweißband: die untersten 1,4 cm etwas dicker – eine weiche Wulst, die der ovalen Krone folgt
  d = smin(d, smax(d - 0.0028, py - 0.014, 0.006), 0.004);
  d = smax(d, -py, 0.006);
  // Knopf oben (ein Filzknopf, knapp abgesetzt, damit er in der Falte am Rand einen Schatten bekommt)
  d = smin(d, ell(px, py, pz, 0, CAP.H - 0.001, CAP.cz, CAP.button, 0.011, CAP.button), 0.0018);
  return d;
}
function capSdf(x, y, z) {
  const p = capLocal(x, y, z);
  return crownLocal(p.x, p.y, p.z);
}

// Haare: eine weiche Lage über dem Schädel, darauf runde Büschel – an den Schläfen und über den Ohren buschig wie
// beim Plüsch, hinten knapp am Kopf (kein Helm); im Nacken stecken sie im Kragen. Was über den Cap-Rand reicht,
// bleibt in der Krone (unsichtbar): so schaut nie ein Büschel durch die Cap.
const SKULL = [0, 0.01, -0.004, 0.158, 0.185, 0.152];
/** Büschel: [Winkel um die Hochachse (0 vorn, π/2 Seite, π hinten), Höhe, Radius, wie weit über den Schädel] */
const HAIR_TUFTS = [
  [1.38, 0.055, 0.038, 0.034], [1.55, 0.012, 0.042, 0.04], [1.7, -0.035, 0.034, 0.028], [1.9, 0.045, 0.038, 0.032],
  [2.02, -0.02, 0.034, 0.026], [2.36, 0.03, 0.032, 0.02], [2.4, -0.05, 0.03, 0.018], [2.8, 0.025, 0.03, 0.016],
  [2.85, -0.06, 0.028, 0.015], [Math.PI, 0.0, 0.03, 0.015], [Math.PI, -0.085, 0.026, 0.014],
];
const HAIR_PUFFS = HAIR_TUFTS.map(([a, y, r, lift]) => {
  const [cx, cy, cz, rx, ry, rz] = SKULL;
  const k = Math.sqrt(1 - ((y - cy) / ry) ** 2);
  const px = rx * k * Math.sin(a);
  const pz = cz + rz * k * Math.cos(a);
  const n = new THREE.Vector3(px / (rx * rx), (y - cy) / (ry * ry), (pz - cz) / (rz * rz)).normalize();
  return [px + n.x * (lift - r), y + n.y * (lift - r), pz + n.z * (lift - r), r];
});
function hairRaw(x, y, z) {
  const ax = Math.abs(x);
  // eine Schicht über dem Schädel (folgt ihm bis in den Nacken), darauf die Büschel
  let d = faceBase(x, y, z) - 0.012;
  for (const [px, py, pz, r] of HAIR_PUFFS) d = smin(d, sph(ax, y, z, px, py, pz, r), 0.022);
  // vorne frei (dort ist das Gesicht): weich gerundete Kante
  d = smax(d, z - 0.06 - 0.12 * Math.max(0, -y - 0.02), 0.03);
  // unten ein runder Saum, steil auf die Haut (sonst schneiden sich Haar und Gesicht flach und zackig): hinten im
  // Kragen, an den Seiten bis zum Bart am Kiefer
  return smax(d, -0.17 + 0.3 * Math.max(0, z + 0.06) - y, 0.02);
}
function hairSdf(x, y, z) {
  const d = hairRaw(x, y, z);
  // weit weg genügt der Abstand zur Haarmasse (höchstens 1,5 mm zu groß), das spart die Krone
  if (d > 0.04) return d;
  const p = capLocal(x, y, z);
  const below = smax(d, p.y - 0.005, 0.006);
  const inside = Math.max(d, crownLocal(p.x, p.y, p.z) + 0.003);
  return Math.min(below, inside);
}

// --- Augen und Lider ----------------------------------------------------------------------------------
/**
 * Beide Augäpfel als ein Netz (Kappen gestauchter Kugeln). eyeDir = Richtung auf der Einheitskugel des
 * Auges (w: −1 linkes, +1 rechtes Auge) – daraus malt der Augen-Shader Iris, Pupille und Glanzlichter.
 */
function eyeGeometry() {
  const nu = 36;
  const nv = 18;
  const pos = [];
  const dir = [];
  const nrm = [];
  const idx = [];
  const n = new THREE.Vector3();
  for (const s of [-1, 1]) {
    const base = pos.length / 3;
    for (let j = 0; j <= nv; j++) {
      // vom vorderen Pol (j = 0) bis 100° nach hinten (der Rest steckt im Kopf)
      const th = (j / nv) * 1.75;
      for (let i = 0; i <= nu; i++) {
        const ph = (i / nu) * TAU;
        const dx = Math.sin(th) * Math.cos(ph);
        const dy = Math.sin(th) * Math.sin(ph);
        const dz = Math.cos(th);
        pos.push(s * EYE_C[0] + dx * EYE_R[0], EYE_C[1] + dy * EYE_R[1], EYE_C[2] + dz * EYE_R[2]);
        dir.push(dx, dy, dz, s);
        n.set(dx / EYE_R[0], dy / EYE_R[1], dz / EYE_R[2]).normalize();
        nrm.push(n.x, n.y, n.z);
      }
    }
    for (let j = 0; j < nv; j++) {
      for (let i = 0; i < nu; i++) {
        const a = base + j * (nu + 1) + i;
        const b = a + 1;
        const c = a + nu + 2;
        const d = a + nu + 1;
        idx.push(a, d, c, a, c, b);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  g.setAttribute('eyeDir', new THREE.Float32BufferAttribute(dir, 4));
  g.setIndex(idx);
  g.applyMatrix4(HC_TO_HEAD);
  g.computeBoundingSphere();
  return g;
}

/**
 * Lid als Schale um den Augapfel, im ungestauchten Augenraum (Einheitskugel, Radius LID.upper/lower): bedeckt alles
 * oberhalb der Kante (Elevation 0) und endet dort in einer weichen Wulst. Die Lidgruppe wird im gestauchten
 * Augenraum um die x-Achse gedreht – so bleibt die Schale immer gleich weit vom Augapfel entfernt.
 * lower: Unterlid (bedeckt alles unterhalb der Kante).
 */
export const LID = { upper: 1.1, lower: 1.08, inner: 1.014, roll: 0.13 };
function lidPart(lower) {
  const R = lower ? LID.lower : LID.upper;
  const rc = (R + LID.inner) / 2;
  const rr = (R - LID.inner) / 2;
  const PHI = 1.95;
  const VR = 0.4; // Anteil der Wulst
  return gridMesh(28, 14, (u, v, o) => {
    // u: Winkel um die Hochachse (links → rechts), v: Wulst an der Kante (innen → unten herum → außen), dann Schale
    const ph = -PHI + 2 * PHI * u;
    let r;
    let el;
    if (v < VR) {
      const a = (v / VR) * Math.PI;
      r = rc - rr * Math.cos(a);
      el = -LID.roll * Math.sin(a);
    } else {
      r = R;
      el = ((v - VR) / (1 - VR)) * 1.75;
    }
    // die Kante ist in der Mitte am weitesten unten, an den Seiten (hinter dem Augenrand) läuft sie hoch
    el += 0.12 * (1 - Math.cos(ph));
    const ce = Math.cos(el);
    o[0] = Math.sin(ph) * ce * r;
    o[1] = (lower ? -1 : 1) * Math.sin(el) * r;
    o[2] = Math.cos(ph) * ce * r;
  }, { flip: lower });
}

// --- Cap-Schirm ---------------------------------------------------------------------------------------
/**
 * Schirm in Cap-Koordinaten: ein dünnes, vorgebogenes Kissen. u läuft am Rand entlang von links nach rechts,
 * v um den Querschnitt (oben vom Band nach vorn, um die runde Kante, unten zurück). Die Steppstich-Reihen laufen
 * parallel zur Vorderkante.
 */
const BRIM = { a0: 1.08, r0: 0.128, len: 0.088, t: 0.0068, drop: 0.36, curl: 2.6, bend: 1.1 };
function brimPart(C) {
  const { a0, r0, len, t, drop, curl, bend } = BRIM;
  const nu = 44;
  const nv = 22;
  const VT = 0.42; // Anteil Oberseite (ebenso Unterseite), dazwischen die Kante
  // Bis kurz vor die Kronenwand liegt der Schirm flach im Schweißband; erst dort, wo er aus der Krone tritt, neigt und
  // wölbt er sich – sonst träte er schon geneigt unter der Krone hervor (von oben ein Schlitz, unten eine Kante)
  const exitR = new Map();
  const exitAt = (a) => {
    if (!exitR.has(a)) {
      let lo = r0;
      let hi = r0 + len + 0.03;
      for (let i = 0; i < 30; i++) {
        const m = (lo + hi) / 2;
        if (crownLocal(Math.sin(a) * m, 0.004, Math.cos(a) * m + CAP.cz) < 0) lo = m;
        else hi = m;
      }
      exitR.set(a, lo - 0.006);
    }
    return exitR.get(a);
  };
  const pos = (u, v) => {
    const a = -a0 + 2 * a0 * u;
    const L = len * Math.pow(Math.cos((a / a0) * (Math.PI / 2)), 0.55) + 0.022;
    const sa = Math.sin(a);
    const ca = Math.cos(a);
    // Abstand von der Cap-Achse: von innen (im Band versteckt) bis kurz vor die Kante
    const rEdge = r0 + L;
    let rho;
    let h;
    let edgeDist;
    if (v < VT) {
      rho = r0 + (rEdge - t - r0) * (v / VT);
      h = t;
      edgeDist = rEdge - t - rho;
    } else if (v > 1 - VT) {
      rho = r0 + (rEdge - t - r0) * ((1 - v) / VT);
      h = -t;
      edgeDist = rEdge - t - rho;
    } else {
      const k = ((v - VT) / (1 - 2 * VT)) * Math.PI;
      rho = rEdge - t + t * Math.sin(k);
      h = t * Math.cos(k);
      edgeDist = -1;
    }
    const x = sa * rho;
    const z = ca * rho + CAP.cz;
    // nach vorn geneigt und zur Kante hin stärker gebogen, an den Seiten heruntergezogen
    const k = Math.max(0, rho - exitAt(a));
    const y = 0.004 - drop * k - curl * k * k - (bend * x * x * k) / len + h;
    return [x, y, z, edgeDist, a * (r0 + len * 0.6)];
  };
  const part = gridMesh(nu, nv, (u, v, o) => {
    const p = pos(u, v);
    o[0] = p[0];
    o[1] = p[1];
    o[2] = p[2];
  });
  part.flat(C.cap, 0.4);
  // Steppstiche: vier Reihen parallel zur Kante (periodischer Abstand, nur Ober- und Unterseite)
  const S = 0.0105;
  const seam = part.field('seam');
  for (let j = 0; j <= nv; j++) {
    for (let i = 0; i <= nu; i++) {
      const [, , , ed, run] = pos(i / nu, j / nv);
      const k = (j * (nu + 1) + i) * 4;
      if (ed < 0) {
        seam[k + 1] = -1;
      } else {
        const q = ed - 0.0055;
        seam[k + 1] = q < 3.5 * S ? (S / Math.PI) * Math.sin((Math.PI * q) / S) : -1;
      }
      seam[k + 2] = run;
    }
  }
  part.transform(capFrame);
  return part;
}

// =====================================================================================================
// Körper
// =====================================================================================================
function shirtSdf(x, y, z) {
  const ax = Math.abs(x);
  let d = ell(x, y, z, 0, 0.372, 0.016, 0.188, 0.155, 0.168); // Bauch
  d = smin(d, ell(x, y, z, 0, 0.47, -0.004, 0.166, 0.11, 0.138), 0.06); // Brust
  d = smin(d, ell(ax, y, z, 0.118, 0.51, -0.004, 0.085, 0.05, 0.078), 0.05); // Schulterlinie
  d = smin(d, sph(ax, y, z, SHOULDER[0], SHOULDER[1], SHOULDER[2], 0.06), 0.04); // runde Schulter (Arm-Drehpunkt)
  // Kragen: weicher Rippenring um den Hals
  d = smin(d, ringY(x, y, z, 0, 0.585, 0.004, 0.078, 0.016, 0.014, 1.06, 1), 0.02);
  d = smax(d, -ell(x, y, z, 0, 0.62, 0.004, 0.062, 0.06, 0.06), 0.01); // Halsloch (darin steckt der Kopf)
  // unten gerade (Saum), darunter beginnt die Hose
  d = smax(d, 0.262 - y, 0.012);
  return d;
}

function pantsSdf(x, y, z) {
  const ax = Math.abs(x);
  let d = ell(x, y, z, 0, 0.292, 0.006, 0.176, 0.085, 0.152);
  d = smin(d, ell(ax, y, z, HIP[0], 0.215, 0.004, 0.08, 0.06, 0.08), 0.05);
  d = smax(d, y - 0.34, 0.01);
  return d;
}

/**
 * Warnweste: eine Lage über dem Shirt mit großen Armlöchern, V-Ausschnitt und geradem Saum. In den Öffnungen ist sie
 * nicht ausgeschnitten (harte Schnittkanten zerfasern im Strahlen-Netz), sondern taucht weich unter das Shirt; die
 * Linie, an der sie abtaucht, bekommt eine Einfassung.
 */
const VEST_HEM = 0.29;
// Armloch: ein Zylinder entlang der Arme, so weit, dass er die ganze Schulter umfasst (trifft die Körperseite steil),
// nur außerhalb der Träger (|x| > 0,1): die Kante oben läuft dann quer über die Schulter
const vestArm = (x, y, z) => Math.max(Math.hypot(y - SHOULDER[1] + 0.01, z - SHOULDER[2]) - 0.095, 0.1 - Math.abs(x));
const vestNeck = (x, y, z) => Math.min(ell(x, y, z, 0, 0.6, 0.11, 0.062, 0.11, 0.09), ell(x, y, z, 0, 0.62, 0.004, 0.074, 0.07, 0.085));
// Abstand zur Öffnung, bei dem die Weste die Shirt-Oberfläche kreuzt (dort sitzt die Einfassung)
const VEST_EDGE = 0.0035;
const vestOuter = (x, y, z) => shirtSdf(x, y, z) - 0.012 + 0.022 * sstep(0.012, -0.004, Math.min(vestArm(x, y, z), vestNeck(x, y, z)));
const vestSdf = (x, y, z) => smax(vestOuter(x, y, z), VEST_HEM - y, 0.006);

/** Bein in Bein-Koordinaten (Ursprung Hüftgelenk, Bein nach −y): Hosenbein und weicher Schuh */
function legSdf(x, y, z) {
  return cone(x, y, z, 0, -0.01, 0, 0, -0.17, 0.004, 0.07, 0.064);
}
function shoeSdf(x, y, z) {
  let d = sell(x, y, z, 0, -0.208, 0.034, 0.07, 0.05, 0.102, 2.6);
  d = smin(d, ell(x, y, z, 0, -0.2, 0.08, 0.062, 0.043, 0.06), 0.03);
  d = smax(d, -0.255 - y, 0.006); // flache Sohle
  return d;
}

/** Arm in Arm-Koordinaten (Ursprung Schulter, gestreckt nach −y, Handfläche +z) */
const WRIST = -UPPER_ARM - FORE_ARM;
function armSdf(x, y, z) {
  const e = -UPPER_ARM;
  let d = cone(x, y, z, 0, -0.01, 0, 0, e, 0, 0.049, 0.046);
  d = smin(d, cone(x, y, z, 0, e, 0, 0, WRIST + 0.03, 0.002, 0.046, 0.041), 0.03);
  return d;
}
function mittenSdf(x, y, z, side) {
  // Fäustling: flaches Oval, Daumen schräg nach außen-vorne
  let d = ell(x, y, z, 0, WRIST - 0.004, 0.004, 0.048, 0.058, 0.035);
  d = smin(d, cone(x, y, z, side * 0.026, WRIST + 0.022, 0.012, side * 0.05, WRIST - 0.012, 0.02, 0.017, 0.014), 0.018);
  return d;
}
/**
 * Offene Hand zum Winken (der Eigentümer, 21.11.: „Finger beim Winken ausstrecken“, 22.11.: „streckt seine Finger
 * dabei auch nicht aus“), in Arm-Koordinaten wie der Fäustling: ein breiter Handteller, vier weit gefächerte Finger mit
 * Luft dazwischen und der Daumen weit zur Seite – fünf Finger, die man auch von draußen hinter dem Wagen zählen kann.
 * Plüsch, also dick und rund, und größer als der Fäustling (wie eine Comic-Hand). Je Finger: Ansatz a, Richtung d
 * (Einheitsvektor), Länge len, Radius r; side ist die Daumenseite.
 */
// (OPEN: so viel größer als ihre Grundmaße ist die winkende Hand – die Finger sollen auch hinter dem Wagen zu zählen sein)
const OPEN = 1.15;
const PALM = [0, WRIST - 0.012 * OPEN, 0.004, 0.05 * OPEN, 0.047 * OPEN, 0.023 * OPEN];
function openFingers(side) {
  // Zeige-, Mittel-, Ring- und kleiner Finger: [x am Ansatz (Daumenseite +), Spreizung (rad), Länge, Radius]
  const F = [[0.036, 0.5, 0.054, 0.0132], [0.0125, 0.17, 0.06, 0.0138], [-0.0125, -0.17, 0.056, 0.0132], [-0.036, -0.5, 0.046, 0.012]];
  const out = F.map(([x, a, len, r]) => ({ a: [side * x * OPEN, WRIST - 0.046 * OPEN, 0.004], d: [side * Math.sin(a), -Math.cos(a), 0.07], len: len * OPEN, r: r * OPEN }));
  // Daumen: fast waagrecht zur Seite und etwas zur Handfläche hin
  out.push({ a: [side * 0.04 * OPEN, WRIST - 0.004 * OPEN, 0.008], d: [side * 0.92, -0.3, 0.22], len: 0.045 * OPEN, r: 0.0145 * OPEN });
  for (const f of out) {
    const n = Math.hypot(f.d[0], f.d[1], f.d[2]);
    f.d = f.d.map((v) => v / n);
  }
  return out;
}
const FINGERS = { [-1]: openFingers(-1), 1: openFingers(1) };
function openHandSdf(x, y, z, side) {
  let d = ell(x, y, z, PALM[0], PALM[1], PALM[2], PALM[3], PALM[4], PALM[5]);
  for (const { a, d: v, len, r } of FINGERS[side]) d = smin(d, cone(x, y, z, a[0], a[1], a[2], a[0] + v[0] * len, a[1] + v[1] * len, a[2] + v[2] * len, r, r * 0.9), 0.006);
  return d;
}
function sleeveSdf(x, y, z) {
  let d = cone(x, y, z, 0, 0.02, 0, 0, -0.072, 0, 0.061, 0.064);
  // Saum als kleine Wulst
  d = smin(d, ringY(x, y, z, 0, -0.07, 0, 0.058, 0.009, 0.01), 0.008);
  d = smax(d, -0.082 - y, 0.004);
  return d;
}

/** Hautgewichte der Arme: Knochen 0 Oberarm, 1 Unterarm, 2 Hand; weicher Übergang an Ellbogen und Handgelenk */
function armWeights(x, y, z, nx, ny, nz, o) {
  const e = -UPPER_ARM;
  if (y > e + 0.04) {
    o[0] = 0;
    o[1] = 0;
    o[2] = 0;
  } else if (y > e - 0.04) {
    o[0] = 0;
    o[1] = 1;
    o[2] = sstep(e + 0.04, e - 0.04, y);
  } else if (y > WRIST + 0.065) {
    o[0] = 1;
    o[1] = 1;
    o[2] = 0;
  } else if (y > WRIST + 0.025) {
    o[0] = 1;
    o[1] = 2;
    o[2] = sstep(WRIST + 0.065, WRIST + 0.025, y);
  } else {
    o[0] = 2;
    o[1] = 2;
    o[2] = 0;
  }
}

// =====================================================================================================
// Bauen
// =====================================================================================================
let cache = null;

/**
 * Baut (einmal) alle Geometrien. Rückgabe: { head, eyes, lidUpper, lidLower, browL, browR, stache, jaw,
 * body, vest, legL, legR, armL, armR, micFoam, micBody } – siehe miniAdam.js für die Gelenke.
 */
export function buildAdamGeometry() {
  if (cache) return cache;
  const C = {};
  for (const k of Object.keys(FABRIC)) C[k] = new THREE.Color(FABRIC[k]);

  // ---------------- Kopf (fest) -----------------
  const face = rayBall(faceSdf, [0, -0.01, 0.0], {
    thetas: spacing(0, Math.PI, 60, [[1.5, 0.22, 2.2], [1.86, 0.18, 2.6]]),
    phis: spacing(-Math.PI, Math.PI, 80, [[0, 0.62, 2.2]], true),
    rmax: 0.3,
  });
  face.flat(C.skin, 1);
  // Pausbacken ganz zart rosig
  face.tint(C.blush, (x, y, z) => 0.8 * Math.exp(-(((Math.abs(x) - 0.084) / 0.032) ** 2 + ((y + 0.03) / 0.026) ** 2)) * sstep(0.07, 0.12, z));
  // dunklerer, gestickter Rand um die Augen (wie beim Plüsch)
  face.set('color', (x, y, z, nx, ny, nz, o) => {
    const e = eyeSdf(x, y, z);
    const k = Math.exp(-(((e - 0.004) / 0.0045) ** 2)) * sstep(-0.005, 0.03, y - EYE_C[1]);
    o[0] *= 1 - 0.32 * k;
    o[1] *= 1 - 0.38 * k;
    o[2] *= 1 - 0.42 * k;
  });
  face.tint(C.mouth, (x, y, z) => sstep(0.009, 0.001, MOUTH(x, y, z)));

  const nose = rayBall(noseSdf, [0, -0.02, 0.158], { thetas: spacing(0, Math.PI, 24), phis: spacing(-Math.PI, Math.PI, 34, [], true), rmax: 0.12 });
  // die Nase ist glatter Filz: wenig Flausch, sonst wirkt der Nasenrücken im Streiflicht grau bestäubt
  nose.flat(C.nose, 0.55).tint(C.blush, (x, y, z) => 0.4 * sstep(0.19, 0.212, z));

  const hair = rayBall(hairSdf, [0, 0.0, -0.05], {
    thetas: spacing(0, Math.PI, 40, [[1.4, 0.4, 1.2]]),
    phis: spacing(-Math.PI, Math.PI, 64, [[Math.PI / 2, 0.5, 0.8], [-Math.PI / 2, 0.5, 0.8]], true),
    rmax: 0.32,
  });
  hair.flat(C.hair, 1.35).nap(combDown(0.4, 1));

  // Seitenbart: von den Koteletten an den Wangen hinunter bis unters Kinn (dort sitzt der Kinnbart am Unterkiefer)
  // (als anliegendes Polster, an den Wangen breit bis an die Haare – kein Streifen Haut dazwischen)
  const beardPts = [
    [-0.155, 0.05, 0.006], [-0.153, -0.004, 0.026], [-0.143, -0.06, 0.054], [-0.112, -0.112, 0.085], [-0.06, -0.15, 0.1], [0, -0.16, 0.104],
    [0.06, -0.15, 0.1], [0.112, -0.112, 0.085], [0.143, -0.06, 0.054], [0.153, -0.004, 0.026], [0.155, 0.05, 0.006],
  ];
  const beardW = (u) => {
    const m = Math.abs(u - 0.5) * 2; // 0 Kinn … 1 Koteletten
    return 0.03 + 0.018 * Math.sin(m * Math.PI * 0.8);
  };
  // nach hinten (zu den Haaren und über den Kiefer) deutlich breiter als nach vorn: ein voller Bart wie beim Plüsch,
  // kein Streifen Haut zwischen Bart und Haaren
  const beardBack = (u) => {
    const m = Math.abs(u - 0.5) * 2;
    // an der Wange (m 0,6 … 0,9) weit nach hinten bis unter die Haare, am Kinn kaum (dort ginge es unters Kinn)
    return 0.012 * sstep(0.1, 0.35, m);
  };
  const sideBeard = surfaceBand(faceSdf, beardPts, (u) => {
    const r = roundEnds(u, 0.06);
    return [beardW(u) * r, 0.016 * r, (beardW(u) + beardBack(u)) * r];
  });
  sideBeard.part.flat(C.hair, 1.4).nap(combDown(0.3, 1));

  // Strahlen von der Kronenmitte entlang der Cap-Achse: so liegt das Schweißband rundum auf einer Reihe
  const capC = new THREE.Vector3(0, 0.06, CAP.cz).applyMatrix4(capFrame);
  const capUp = new THREE.Vector3(0, 1, 0).transformDirection(capFrame);
  const cap = rayBall(capSdf, capC.toArray(), {
    // dichter am Schweißband und oben am Knopf (sonst mittelt das Netz ihn weg)
    thetas: spacing(0, Math.PI, 34, [[1.91, 0.22, 2.5], [0, 0.2, 3]]),
    phis: spacing(-Math.PI, Math.PI, 72, [], true),
    up: capUp.toArray(),
    rmax: 0.3,
  });
  cap.flat(C.cap, 0.45);
  // Nähte: sechs Bahnen (die vordere trägt das Logo), Steppstich über dem Schweißband
  cap.seams((x, y, z, o) => {
    const p = capLocal(x, y, z);
    const r = Math.hypot(p.x, p.z - CAP.cz);
    const phi = Math.atan2(p.x, p.z - CAP.cz);
    const m = (r / 3) * Math.sin(3 * (phi - Math.PI / 6));
    // die Bahnen-Nähte enden am Knopf (und unten am Schweißband)
    o[0] = p.y > 0.016 && r > CAP.button + 0.003 ? m : sgn(m);
    o[1] = p.y - 0.018;
    o[2] = phi * CAP.R;
  });
  // LIVE-Logo auf der vorderen Bahn (eben projiziert, außerhalb von 0 … 1 kein Aufdruck)
  cap.set('logo', (x, y, z, nx, ny, nz, o) => {
    const p = capLocal(x, y, z);
    o[0] = (p.x + 0.06) / 0.12;
    o[1] = (p.y + 0.002) / 0.12;
  });
  const brim = brimPart(C);

  // Umgebungsverdeckung: jedes Teil wird dort dunkler, wo ein anderes daraufsitzt
  const headAll = (x, y, z) => Math.min(faceSdf(x, y, z), noseSdf(x, y, z), hairSdf(x, y, z), capSdf(x, y, z), eyeSdf(x, y, z), sideBeard.dist(x, y, z));
  for (const p of [face, hair, cap, sideBeard.part]) p.occlude(headAll, 0.5, [0.006, 0.016, 0.034]);
  // die Nase nur weich zum Gesicht hin (die hellen Glasaugen daneben werfen keinen grauen Schatten auf den Nasenrücken)
  nose.occlude((x, y, z) => Math.min(faceSdf(x, y, z), noseSdf(x, y, z)), 0.36, [0.006, 0.016, 0.034]);
  brim.occlude(headAll, 0.3, [0.006, 0.016]);
  // Gesicht unter Cap und Haaren ist nie zu sehen
  face.trim((x, y, z) => capSdf(x, y, z) > -0.004 && hairSdf(x, y, z) > -0.006);
  hair.trim((x, y, z) => capSdf(x, y, z) > -0.004);
  const headParts = [face, nose, hair, sideBeard.part, cap, brim];
  for (const p of headParts) p.transform(HC_TO_HEAD);
  const head = toGeometry(headParts);

  // ---------------- Augen, Lider -----------------
  const eyes = eyeGeometry();
  // Lider im Hautton (etwas dunkler: sie liegen über dem Augapfel im Schatten der Brauen)
  const lidSkin = C.skin.clone().multiplyScalar(0.93);
  const lidU = lidPart(false).flat(lidSkin, 0.9);
  const lidL = lidPart(true).flat(lidSkin, 0.9);
  // gestickte Wimpernlinie an der Lidkante
  for (const l of [lidU, lidL]) l.tint(C.lidRim, (x, y, z) => sstep(0.2, 0.04, Math.abs(y)) * sstep(-0.2, 0.4, z) * 0.95);

  // ---------------- Brauen (je eine, um ihre Mitte beweglich) -----------------
  const browPart = (s) => {
    const pts = [[-0.03, -0.004, 0], [-0.011, 0.004, 0], [0.011, 0.006, 0], [0.031, 0.0, 0]].map(([dx, dy]) => [s * (BROW_C[0] + dx), BROW_C[1] + dy, BROW_C[2]]);
    const t = surfaceTube(faceSdf, pts, () => 0.003, (u) => {
      const r = roundEnds(u, 0.18);
      return [0.0108 * r * (1 - 0.25 * Math.abs(u - 0.4)), 0.0068 * r];
    }, { nu: 18, nv: 10 });
    t.part.flat(C.brow, 1.2).nap((x, y, z, o) => {
      o[0] = s * 0.9;
      o[1] = -0.3;
      o[2] = 0;
    });
    t.part.occlude(headAll, 0.35, [0.004, 0.01]);
    t.part.transform(new THREE.Matrix4().makeTranslation(-s * BROW_C[0], -BROW_C[1], -BROW_C[2]));
    return toGeometry([t.part]);
  };

  // ---------------- Schnurrbart: ein Schlauch von Spitze zu Spitze, Morph-Ziele „Lächeln“ und „Schmollmund“ -------
  // Die Formen entstehen wie die Ruheform als Schlauch auf der Haut (nur mit gedrehten Stützpunkten): so liegt der
  // Bart auch beim Lächeln auf dem Gesicht, statt wie ein starres Teil abzuheben.
  const STACHE_PTS = [[0, -0.065, 0.17], [0.032, -0.068, 0.161], [0.065, -0.079, 0.151], [0.09, -0.1, 0.134], [0.101, -0.127, 0.114]];
  // liegt auf der Haut unter der Nase (die Nase deckt den Ansatz)
  const stacheSdf = faceBase;
  /** Stützpunkte von der linken zur rechten Spitze, jede Seite um den Punkt unter der Nase gedreht (a > 0: Spitzen hoch) */
  const stacheTube = (a) => {
    const c = Math.cos(a);
    const sn = Math.sin(a);
    const half = (s) => STACHE_PTS.slice(1).map(([x, y, z]) => {
      const dy = y - STACHE_C[1];
      return [s * (x * c - dy * sn), STACHE_C[1] + x * sn + dy * c, z];
    });
    const pts = [...half(-1).reverse(), STACHE_PTS[0], ...half(1)];
    const m = (u) => Math.abs(u - 0.5) * 2; // 0 Mitte … 1 Spitze
    return surfaceTube(stacheSdf, pts, (u) => 0.006 + 0.004 * Math.sin(Math.PI * m(u)), (u) => {
      const r = roundEnds(u, 0.07);
      const w = 0.017 + 0.009 * Math.sin(Math.PI * Math.min(1, m(u) * 1.4));
      return [w * r, (0.0125 - 0.004 * m(u)) * r];
    }, { nu: 52, nv: 14 }).part.transform(HC_TO_HEAD);
  };
  const stacheRest = stacheTube(0);
  // Geometrie ist schon in Kopf-Koordinaten: Strich und Verdeckung dort auswerten; nach außen gekämmt
  stacheRest.flat(C.beard, 1.45).nap((x, y, z, o) => {
    o[0] = Math.sign(x) * 0.7;
    o[1] = -0.7;
    o[2] = 0.1;
  });
  stacheRest.occlude((x, y, z) => headAll(x - HEAD_C[0], y - HEAD_C[1], z - HEAD_C[2]), 0.35, [0.005, 0.012]);
  const stache = addMorphs(toGeometry([stacheRest]), [toGeometry([stacheTube(STACHE_SMILE)]), toGeometry([stacheTube(-STACHE_POUT)])]);

  // ---------------- Unterkiefer: Unterlippe, Zunge und Kinnbart -----------------
  // Er gleitet beim Sprechen nach unten (miniAdam.js), statt zu klappen: so wandert der lange Kinnbart an der Brust
  // hinunter, anstatt hineinzuschwenken. Die Lippe hat dieselben Morph-Ziele wie der Schnurrbart (Mundwinkel hoch bzw.
  // herunter); Zunge und Kinnbart bleiben dabei, wie sie sind.
  // in Ruhe liegt die Lippe direkt unter dem Schnurrbart (Mund zu) und lächelt ein wenig: die Winkel stehen höher
  const LIP_PTS = [[-0.06, -0.082, 0.147], [-0.033, -0.0905, 0.158], [0, -0.0985, 0.162], [0.033, -0.0905, 0.158], [0.06, -0.082, 0.147]];
  const lipTube = (k) => surfaceTube(faceBase, LIP_PTS.map(([x, y, z], i) => {
    const e = Math.abs(i - 2) / 2; // 0 Mitte … 1 Mundwinkel
    return [x * (1 + 0.07 * k * e), y + 0.017 * k * e * e, z];
  }), () => 0.0065, (u) => {
    const r = roundEnds(u, 0.16);
    return [0.0152 * r, 0.0095 * r];
  }, { nu: 26, nv: 14 });
  const lip = lipTube(0);
  lip.part.flat(C.lip, 0.8);
  const goateeSdf = (x, y, z) => {
    let d = ell(x, y, z, 0, -0.152, 0.118, 0.05, 0.045, 0.042);
    d = smin(d, cone(x, y, z, 0, -0.15, 0.116, 0, -0.226, 0.1, 0.04, 0.02), 0.03);
    return smax(d, -lip.dist(x, y, z) - 0.002, 0.004);
  };
  const goatee = rayBall(goateeSdf, [0, -0.17, 0.11], { thetas: spacing(0, Math.PI, 22), phis: spacing(-Math.PI, Math.PI, 30, [], true), rmax: 0.15 });
  goatee.flat(C.beard, 1.45).nap(combDown(0.15, 1));
  const tongue = rayBall((x, y, z) => ell(x, y, z, 0, -0.116, 0.13, 0.03, 0.009, 0.02), [0, -0.116, 0.13], { thetas: spacing(0, Math.PI, 10), phis: spacing(-Math.PI, Math.PI, 18, [], true), rmax: 0.06 });
  tongue.flat(C.tongue, 0.5);
  const jawAll = (x, y, z) => Math.min(headAll(x, y, z), goateeSdf(x, y, z), lip.dist(x, y, z));
  for (const p of [lip.part, goatee]) p.occlude(jawAll, 0.4, [0.005, 0.014]);
  const jawM = new THREE.Matrix4().makeTranslation(-JAW_C[0], -JAW_C[1], -JAW_C[2]);
  for (const p of [tongue, goatee]) p.transform(jawM);
  const jawGeo = (lipPart) => toGeometry([tongue, lipPart.transform(jawM), goatee]);
  const jaw = addMorphs(jawGeo(lip.part), [jawGeo(lipTube(1).part), jawGeo(lipTube(-0.8).part)]);

  // ---------------- Körper -----------------
  const shirt = rayMesh(shirtSdf, [0, 0.25, 0], [0, 0.6, 0], { segs: spacing(-Math.PI, Math.PI, 72, [], true), ts: spacing(0, 1, 34).reverse(), caps: 10, rmax: 0.4 });
  shirt.flat(C.shirt, 0.6);
  shirt.seams((x, y, z, o) => {
    // Seitennähte (nur seitlich, vorne und hinten weit weg), Saum- und Kragen-Steppstich
    o[0] = Math.abs(x) > 0.09 ? z + 0.012 : sgn(z + 0.012);
    const hem = y - 0.276;
    const collar = y - 0.566;
    o[1] = Math.abs(hem) < Math.abs(collar) ? hem : -collar;
    o[2] = Math.atan2(x, z) * 0.17;
  });
  shirt.set('logo', (x, y, z, nx, ny, nz, o) => {
    o[0] = (x + 0.112) / 0.224;
    o[1] = (y - 0.29) / 0.224;
  });
  const pants = rayMesh(pantsSdf, [0, 0.21, 0], [0, 0.33, 0], { segs: 56, ts: [0.75, 0.5, 0.25], caps: 8, rmax: 0.35 });
  pants.flat(C.pants, 0.7);
  pants.seams((x, y, z, o) => {
    o[0] = Math.abs(x) > 0.07 ? z : sgn(z);
  });
  // eingenähtes Etikett an der linken Seitennaht: weißes Stoffstück mit rotem Herz
  const tag = rayBall((x, y, z) => sell(x, y, z, -0.19, 0.3, 0.012, 0.006, 0.022, 0.016, 3), [-0.19, 0.3, 0.012], { thetas: spacing(0, Math.PI, 12), phis: spacing(-Math.PI, Math.PI, 20, [], true), rmax: 0.05 });
  tag.flat(C.tag, 0.3).tint(C.heart, (x, y, z) => {
    // Herz auf der Außenseite (x < −0,19)
    const u = (z - 0.012) / 0.008;
    const v = (y - 0.302) / 0.008;
    const h = (u * u + v * v - 1) ** 3 - u * u * v * v * v;
    return sstep(0.02, -0.08, h) * sstep(-0.194, -0.197, x);
  });
  const bodyAll = (x, y, z) => Math.min(shirtSdf(x, y, z), pantsSdf(x, y, z));
  for (const p of [shirt, pants]) p.occlude(bodyAll, 0.45, [0.008, 0.02, 0.045]);
  const body = toGeometry([shirt, pants, tag]);

  // Warnweste (Shop): gelb mit zwei silbernen Streifen, Ränder eingefasst
  const vestPart = rayMesh(vestSdf, [0, 0.27, 0], [0, 0.62, 0], { segs: spacing(-Math.PI, Math.PI, 64, [], true), ts: spacing(0, 1, 28).reverse(), caps: 8, rmax: 0.4 });
  vestPart.flat(C.vest, 0.5).tint(C.vestStripe, (x, y) => sstep(0.006, 0.002, Math.abs(y - 0.335) - 0.012) + sstep(0.006, 0.002, Math.abs(y - 0.42) - 0.012));
  vestPart.seams((x, y, z, o) => {
    o[1] = Math.min(Math.abs(y - 0.335), Math.abs(y - 0.42)) - 0.0125;
    o[2] = Math.atan2(x, z) * 0.18;
  });
  const ring = (n, f) => Array.from({ length: n }, (_, i) => f((i / n) * TAU));
  const edges = [
    // Ausschnitt (vorn tief, hinten am Kragen) und beide Armlöcher: dort, wo die Weste unter das Shirt taucht
    onBoth(shirtSdf, (x, y, z) => vestNeck(x, y, z) - VEST_EDGE, ring(28, (a) => [0.07 * Math.sin(a), 0.56 - 0.05 * Math.cos(a), 0.004 + 0.1 * Math.cos(a)])),
    ...[-1, 1].map((s) => onBoth(shirtSdf, (x, y, z) => vestArm(x, y, z) - VEST_EDGE, ring(28, (a) => [s * 0.13, SHOULDER[1] - 0.01 + 0.09 * Math.sin(a), SHOULDER[2] + 0.09 * Math.cos(a)]))),
  ].map((pts) => surfaceTube(shirtSdf, pts, () => 0.004, () => [0.0065, 0.0085], { nu: pts.length * 2, nv: 8, closed: true }));
  // Saum: unten auf der Weste
  const hem = onBoth(vestOuter, (x, y) => y - VEST_HEM, ring(36, (a) => [0.19 * Math.sin(a), VEST_HEM, 0.17 * Math.cos(a)]));
  edges.push(surfaceTube(vestOuter, hem, () => -0.004, () => [0.0065, 0.0095], { nu: hem.length * 2, nv: 8, closed: true }));
  const piping = edges.map((t) => t.part.flat(C.vestEdge, 0.5));
  const vestAll = (x, y, z) => Math.min(vestSdf(x, y, z), shirtSdf(x, y, z));
  for (const p of [vestPart, ...piping]) p.occlude(vestAll, 0.3, [0.008, 0.02]);
  const vest = toGeometry([vestPart, ...piping]);

  // ---------------- Beine -----------------
  const leg = rayMesh(legSdf, [0, -0.17, 0], [0, -0.01, 0], { segs: 28, ts: [0.66, 0.33], caps: 6, rmax: 0.15 }).flat(C.pants, 0.7);
  leg.seams((x, y, z, o) => {
    o[0] = z;
    o[1] = y + 0.152;
    o[2] = Math.atan2(x, z) * 0.067;
  });
  const shoe = rayBall(shoeSdf, [0, -0.205, 0.04], { thetas: spacing(0, Math.PI, 18), phis: spacing(-Math.PI, Math.PI, 32, [], true), rmax: 0.2 }).flat(C.shoe, 0.5);
  shoe.tint(C.sole, (x, y) => sstep(-0.243, -0.249, y));
  shoe.seams((x, y, z, o) => {
    o[1] = y + 0.238;
    o[2] = Math.atan2(x, z - 0.034) * 0.08;
  });
  const legAll = (x, y, z) => Math.min(legSdf(x, y, z), shoeSdf(x, y, z));
  for (const p of [leg, shoe]) p.occlude(legAll, 0.45, [0.008, 0.02, 0.04]);
  const legGeo = toGeometry([leg, shoe]);

  // ---------------- Arme -----------------
  // je Seite zwei Netze mit denselben Knochen: mit Fäustling (am Lenkrad, beim Jubeln) und mit offener Hand (Winken)
  const arms = [];
  const armsOpen = [];
  for (const side of [-1, 1]) {
    const arm = rayMesh(armSdf, [0, WRIST + 0.03, 0], [0, -0.01, 0], { segs: 24, ts: spacing(0, 1, 10).reverse(), caps: 6, rmax: 0.15 }).flat(C.skin, 1);
    const mitten = rayBall((x, y, z) => mittenSdf(x, y, z, side), [0, WRIST, 0.005], { thetas: spacing(0, Math.PI, 18), phis: spacing(-Math.PI, Math.PI, 30, [], true), rmax: 0.15 }).flat(C.skin, 1);
    const sleeve = rayMesh(sleeveSdf, [0, -0.082, 0], [0, 0.02, 0], { segs: 28, ts: [0.6, 0.3], caps: 4, rmax: 0.15 }).flat(C.shirt, 0.6);
    const all = (x, y, z) => Math.min(armSdf(x, y, z), mittenSdf(x, y, z, side), sleeveSdf(x, y, z));
    for (const p of [arm, mitten, sleeve]) p.occlude(all, 0.45, [0.006, 0.016, 0.03]).set('skin', armWeights);
    // Naht innen am Arm (zum Körper hin), rund um den Fäustling; Steppstich am Handgelenk
    const seamFn = (x, y, z, o) => {
      const inner = x * side < 0;
      o[0] = y < WRIST + 0.03 || inner ? z - 0.004 : sgn(z - 0.004);
      o[1] = y - (WRIST + 0.036);
      o[2] = Math.atan2(x, z) * 0.04;
    };
    arm.seams(seamFn);
    mitten.seams(seamFn);
    sleeve.seams((x, y, z, o) => {
      o[1] = y + 0.06;
      o[2] = Math.atan2(x, z) * 0.062;
    });
    sleeve.set('skin', (x, y, z, nx, ny, nz, o) => {
      o[0] = 0;
      o[1] = 0;
      o[2] = 0;
    });
    arms.push(toGeometry([sleeve, arm, mitten], { skinned: true }));
    // die offene Hand: Handteller (Strahlen vom Mittelpunkt) und Finger als runde Schläuche mit Kuppe
    const palm = rayBall((x, y, z) => ell(x, y, z, PALM[0], PALM[1], PALM[2], PALM[3], PALM[4], PALM[5]), [PALM[0], PALM[1], PALM[2]], { thetas: spacing(0, Math.PI, 14), phis: spacing(-Math.PI, Math.PI, 24, [], true), rmax: 0.1 }).flat(C.skin, 1);
    const fingers = FINGERS[side].map(({ a, d, len, r }) =>
      tubeMesh(
        (u, o) => {
          o[0] = a[0] + d[0] * len * u;
          o[1] = a[1] + d[1] * len * u;
          o[2] = a[2] + d[2] * len * u;
        },
        (u) => {
          const k = (u < 0.72 ? 1 : Math.sqrt(Math.max(0, 1 - ((u - 0.72) / 0.28) ** 2))) * r * (1 - 0.08 * u);
          return [k, k * 0.86];
        },
        { nu: 10, nv: 10, up: [0, 0, 1] },
      ).flat(C.skin, 1),
    );
    const open = (x, y, z) => Math.min(armSdf(x, y, z), openHandSdf(x, y, z, side), sleeveSdf(x, y, z));
    for (const p of [palm, ...fingers]) p.occlude(open, 0.45, [0.006, 0.016, 0.03]).set('skin', armWeights);
    palm.seams(seamFn);
    armsOpen.push(toGeometry([sleeve, arm, palm, ...fingers], { skinned: true }));
  }

  // ---------------- Mikrofon (in Hand-Koordinaten der Fensterhand) -----------------
  const foam = rayBall((x, y, z) => ell(x, y, z, 0, 0.098, 0, 0.031, 0.034, 0.031), [0, 0.098, 0], { thetas: spacing(0, Math.PI, 16), phis: spacing(-Math.PI, Math.PI, 24, [], true), rmax: 0.08 });
  foam.flat(C.micFoam, 1.1).tint(C.tag, (x, y) => sstep(0.006, 0.003, Math.abs(y - 0.07)));
  const micFoam = toGeometry([foam]);
  const micBody = new THREE.CylinderGeometry(0.0125, 0.0095, 0.14, 16, 1);
  micBody.translate(0, 0.012, 0);
  const micRing = new THREE.CylinderGeometry(0.015, 0.0135, 0.016, 16, 1);
  micRing.translate(0, 0.074, 0);

  cache = {
    head,
    eyes,
    lidUpper: toGeometry([lidU]),
    lidLower: toGeometry([lidL]),
    browL: browPart(-1),
    browR: browPart(1),
    stache,
    jaw,
    body,
    vest,
    legL: legGeo,
    legR: legGeo,
    armL: arms[0],
    armR: arms[1],
    armOpenL: armsOpen[0],
    armOpenR: armsOpen[1],
    micFoam,
    micBody: mergeGeometries([micBody, micRing]),
  };
  return cache;
}
