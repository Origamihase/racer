// Mini Adams Plüscharme aus der Ich-Perspektive (und für freie Kameras): Fäustlinge, die wirklich um den
// Lenkradkranz greifen (Handballen zum Fahrer, vier Finger als ein weicher Fäustling außen herum, Daumen innen um
// den Kranz), Unter- und Oberarm aus Plüsch mit weichem Ellbogen und der kurze T-Shirt-Ärmel. Genäht wie ein
// Plüschmann: Steppnähte ziehen Rillen zwischen die Finger, helle Stiche an den Seiten der Fäustlinge, ums
// Handgelenk und längs der Unterarme.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { sweep, ring, warp, prep, stitches, v3 } from './parts.js';
import { COLORS } from '../models/miniAdam.js';
import { clamp, smoothstep } from '../util.js';

const DEG = Math.PI / 180;
// Struktur des Plüschs: Kacheln je Meter, passend zur Körnung der Figur
const PLUSH_UV = 3.3;

/**
 * Heller Faden auf dem Plüsch ohne eigenes Material: als Vertexfarbe der Faktor, der die Plüschfarbe zur Fadenfarbe
 * macht (je Kanal, linear; Vertexfarben dürfen über 1 liegen).
 */
const THREAD = (() => {
  const t = new THREE.Color(0xf2ebdf);
  const p = new THREE.Color(COLORS.skin);
  return new THREE.Color(t.r / p.r, t.g / p.g, t.b / p.b);
})();
// Stiche: Länge, Lücke, Breite, Abstand über dem Plüsch
const STITCH = { len: 0.0042, gap: 0.003, w: 0.0012, h: 0.0004, color: THREAD };
// Saumstiche am T-Shirt: wie an der Figur dunkelgrauer Faden auf dem schwarzen Stoff (Faktor zur Shirtfarbe)
const SHIRT_THREAD = (() => {
  const p = new THREE.Color(COLORS.shirt);
  return new THREE.Color((p.r * 1.9 + 0.05) / p.r, (p.g * 1.9 + 0.05) / p.g, (p.b * 1.9 + 0.05) / p.b);
})();

/** Punkt auf dem Kreis um den Kranz (Hand-Koordinaten: y radial nach außen, z zum Fahrer). */
const around = (th, rho, x = 0) => v3(x, Math.sin(th) * rho, Math.cos(th) * rho);

/**
 * Fäustling für die Hand auf Seite `side` (−1 links, +1 rechts) in Hand-Koordinaten: Ursprung in der Mitte
 * des Kranzrohrs, x entlang des Kranzes, y radial nach außen, z zum Fahrer. rt = Rohrradius, R = Kranzradius.
 */
export function mittenGeometry(side, rt, R) {
  const parts = [];
  const ends = (u, e = 0.14) => Math.sqrt(Math.max(0, 1 - (1 - Math.min(1, u / e, (1 - u) / e)) ** 2));
  // Handballen → Handrücken → Finger: von der Fahrerseite außen herum bis hinter den Kranz
  const th0 = -38 * DEG;
  const th1 = 214 * DEG;
  const th = (u) => th0 + (th1 - th0) * u;
  const thick = (u) => (0.0212 - 0.0055 * u) * (0.35 + 0.65 * ends(u));
  const width = (u) => (0.0355 + 0.004 * Math.sin(Math.PI * Math.min(1, u * 1.4)) - 0.004 * u) * (0.45 + 0.55 * ends(u, 0.1));
  // Mitte des Querschnitts (Abstand von der Rohrmitte); innen liegt der Fäustling dicht am Kranz an
  const mid = (u) => rt - 0.003 + thick(u);
  // Querschnitt: weiches Oval, Winkel t = 0 zeigt vom Kranz weg. Außen fein unterteilt: ab den Knöcheln ziehen
  // drei Steppnähte (bei t = 0 und ±30°) die Rillen zwischen den vier runden Fingern, innen liegt er am Kranz.
  const fingers = (u) => smoothstep(0.3, 0.46, u);
  const lobe = (t) => {
    const s = Math.abs(t) / (30 * DEG);
    return Math.sqrt(Math.max(0, Math.sin(s < 1 ? Math.PI * s : (Math.PI / 2) * Math.min(1, s - 1))));
  };
  const ts = [];
  for (let k = -12; k < 12; k++) ts.push(k * 7.5 * DEG);
  for (let k = 0; k < 8; k++) ts.push((90 + k * 22.5) * DEG);
  const section = (u) => ts.map((t) => {
    const c = Math.cos(t);
    const s = Math.sin(t);
    const pull = c > 0 ? 1 - 0.22 * fingers(u) * (1 - lobe(t)) : 1;
    return [thick(u) * Math.sign(c) * Math.abs(c) ** 0.8 * pull, width(u) * Math.sign(s) * Math.abs(s) ** 0.8];
  });
  const body = [];
  const N = 30;
  for (let i = 0; i <= N; i++) body.push(around(th(i / N), mid(i / N)));
  parts.push(prep(sweep(body, section, { up: v3(1, 0, 0) }), 0xffffff, {
    // zum Kranz hin im Schatten (dort liegt die Hand auf), außen hell, in den Fingerrillen dunkler
    shade: (p) => {
      let a = Math.atan2(p.y, p.z);
      if (a < th0 - 0.01) a += 2 * Math.PI;
      const u = clamp((a - th0) / (th1 - th0), 0, 1);
      const r = Math.hypot(p.y, p.z);
      const t = Math.asin(Math.min(1, (Math.abs(p.x) / width(u)) ** 1.25));
      const crease = r > mid(u) ? fingers(u) * (1 - lobe(t)) : 0;
      return (0.74 + 0.26 * clamp((r - rt) / 0.024, 0, 1)) * (1 - 0.34 * crease);
    },
    uv: PLUSH_UV,
  }));
  // an beiden Seiten sind Handrücken und Handfläche zusammengenäht
  for (const s of [-1, 1]) {
    const pts = [];
    const nrm = [];
    for (let i = 0; i <= 40; i++) {
      const u = 0.12 + (0.76 * i) / 40;
      pts.push(around(th(u), mid(u), s * width(u)));
      nrm.push(v3(s, 0, 0));
    }
    parts.push(...stitches(pts, nrm, STITCH));
  }
  // Daumen: kommt aus dem Handballen und legt sich innen um den Kranz (zeigt nach 12 Uhr versetzt)
  const thumb = [];
  const tx = -side * 0.024;
  for (let i = 0; i <= 14; i++) {
    const u = i / 14;
    thumb.push(around((8 - 128 * u) * DEG, rt - 0.002 + 0.0122, tx - side * 0.004 * u));
  }
  const tr = (u) => 0.4 + 0.6 * ends(u, 0.22);
  parts.push(prep(sweep(thumb, (u) => ring(0.0122 * tr(u), 0.0134 * tr(u), 12, 2.2), { up: v3(1, 0, 0) }), 0xffffff, {
    shade: (p) => 0.8 + 0.2 * Math.min(1, Math.max(0, (Math.hypot(p.y, p.z) - rt) / 0.02)),
    uv: PLUSH_UV,
  }));
  const g = mergeGeometries(parts);
  // der Fäustling folgt der Krümmung des Kranzes
  return warp(g, (p) => {
    const a = p.x / R;
    const rr = R + p.y;
    p.x = rr * Math.sin(a);
    p.y = rr * Math.cos(a) - R;
  });
}

/**
 * Offene Hand zum Winken (der Eigentümer, 21.11.: „Finger beim Winken ausstrecken“, 22.11.: „streckt seine Finger
 * dabei auch nicht aus“), in denselben Hand-Koordinaten wie der Fäustling: der Handteller vom Handballen (beim
 * Handgelenk) nach außen (+y), vier weit gefächerte runde Plüschfinger mit Luft dazwischen und der Daumen weit zur
 * Innenseite (x = −side, wie beim Fäustling). Beim Winken zeigen die Finger nach oben, der Handrücken zum Fahrer.
 */
export function openHandGeometry(side) {
  const parts = [];
  const ends = (u, e) => Math.sqrt(Math.max(0, 1 - (1 - Math.min(1, u / e, (1 - u) / e)) ** 2));
  const tip = (u) => (u < 0.7 ? 1 : Math.sqrt(Math.max(0.02, 1 - ((u - 0.7) / 0.3) ** 2)));
  const line = (a, d, len, n = 10) => Array.from({ length: n + 1 }, (_, i) => a.clone().addScaledVector(d, (len * i) / n));
  const palm = line(v3(0, -0.006, 0.036), v3(0, 1, 0), 0.07, 12);
  parts.push(prep(sweep(palm, (u) => ring(0.041 * (0.62 + 0.38 * ends(u, 0.3)), 0.015 * (0.55 + 0.45 * ends(u, 0.3)), 16, 2.4), { up: v3(0, 0, 1) }), 0xffffff, { uv: PLUSH_UV }));
  // Zeige-, Mittel-, Ring- und kleiner Finger: [x am Ansatz (Daumenseite +), Spreizung (rad, zur Daumenseite +), Länge, Radius]
  for (const [x, a, len, r] of [[0.03, 0.5, 0.05, 0.0118], [0.0102, 0.17, 0.056, 0.0124], [-0.0102, -0.17, 0.052, 0.0118], [-0.03, -0.5, 0.043, 0.0108]]) {
    const d = v3(-side * Math.sin(a), Math.cos(a), -0.08).normalize();
    const path = line(v3(-side * x, 0.05, 0.036), d, len);
    parts.push(prep(sweep(path, (u) => ring(r * tip(u), r * 0.86 * tip(u), 12, 2), { up: v3(0, 0, 1) }), 0xffffff, { uv: PLUSH_UV }));
  }
  const td = v3(-side * 0.92, 0.3, 0.12).normalize();
  const thumb = line(v3(-side * 0.032, 0.012, 0.038), td, 0.042);
  parts.push(prep(sweep(thumb, (u) => ring(0.0125 * tip(u), 0.011 * tip(u), 12, 2), { up: v3(0, 0, 1) }), 0xffffff, { uv: PLUSH_UV }));
  return mergeGeometries(parts);
}

/** Wo der Unterarm an der Hand ansetzt (Hand-Koordinaten): am Handballen, zum Fahrer hin. */
export const WRIST = v3(0, 0.004, 0.047);

/** Rundes Plüschteil entlang +y aus einem Profil [Radius, Höhe]; die Stoffstruktur wird nicht gestreckt. */
function plushTube(profile, seg = 20) {
  const n = profile.length;
  const g = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), seg);
  const aroundLen = 2 * Math.PI * Math.max(...profile.map(([r]) => r));
  const v = [0];
  for (let j = 1; j < n; j++) v.push(v[j - 1] + Math.hypot(profile[j][0] - profile[j - 1][0], profile[j][1] - profile[j - 1][1]) / aroundLen);
  const uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setY(i, v[i % n]);
  return g;
}

/** Radius eines Profils [Radius, Höhe] auf der Höhe y (linear zwischen den Stützstellen). */
function radiusAt(profile, y) {
  for (let j = 1; j < profile.length; j++) {
    const [r0, y0] = profile[j - 1];
    const [r1, y1] = profile[j];
    if (y <= y1) return r0 + ((r1 - r0) * (y - y0)) / Math.max(1e-9, y1 - y0);
  }
  return profile[profile.length - 1][0];
}

/** Plüsch-Armteil: oben hell, zur Unterseite (−z) im Schatten. */
const armShade = (p, n) => 0.76 + 0.24 * (0.5 + 0.5 * n.z);

/**
 * Unterarm auf Seite `side`: Handgelenk im Ursprung, der Arm läuft nach +y bis zum Ellbogen bei y = len und ist dort
 * rund geschlossen; +z zeigt nach oben. Naht ums Handgelenk und längs der Oberseite zur Körpermitte hin.
 */
export function forearmGeometry(len, side) {
  // weich wie ein Plüschärmchen: schmales Handgelenk, zum Ellbogen hin rundlich
  const profile = [
    [0, 0], [0.016, 0.003], [0.024, 0.01], [0.0268, 0.022], [0.0274, 0.034], [0.0302, 0.07], [0.0328, Math.min(0.17, len - 0.04)], [0.0345, len],
    [0.0302, len + 0.017], [0.0186, len + 0.029], [0, len + 0.0345],
  ];
  const parts = [prep(plushTube(profile), 0xffffff, { shade: armShade, uv: 'keep' })];
  // Naht ums Handgelenk (dort sitzt der Fäustling am Arm)
  const wrist = [];
  const wn = [];
  for (let i = 0; i <= 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const n = v3(Math.sin(a), 0, Math.cos(a));
    wrist.push(n.clone().multiplyScalar(radiusAt(profile, 0.031)).setY(0.031));
    wn.push(n);
  }
  parts.push(...stitches(wrist, wn, STITCH));
  // Längsnaht oben, zur Körpermitte hin (dort sieht sie der Fahrer)
  const a = side * 45 * DEG;
  const n = v3(Math.sin(a), 0, Math.cos(a));
  const line = [];
  const ln = [];
  for (let y = 0.045; y <= len - 0.02; y += 0.01) {
    line.push(n.clone().multiplyScalar(radiusAt(profile, y)).setY(y));
    ln.push(n);
  }
  parts.push(...stitches(line, ln, STITCH));
  return mergeGeometries(parts);
}

/** Oberarm: Schulter im Ursprung, der Arm läuft nach +y bis zum Ellbogen bei y = len; beide Enden rund. */
export function upperArmGeometry(len) {
  return prep(plushTube([
    [0, -0.036], [0.024, -0.028], [0.0345, -0.012], [0.037, 0.012], [0.0365, len - 0.04], [0.036, len],
    [0.0315, len + 0.018], [0.019, len + 0.03], [0, len + 0.036],
  ]), 0xffffff, { shade: armShade, uv: 'keep' });
}

/**
 * Kurzer T-Shirt-Ärmel ab der Schulter (im Ursprung) nach +y: an der Schulter rund geschlossen (wie das Gelenk
 * eines Plüschmanns), vorn weit offen mit umgeschlagenem Saum und Saumnaht, dazu ein paar weiche Falten.
 * Innen ist er geschlossen und dunkel (durch den Spalt zwischen Saum und Arm sieht man Stoff, nicht ins Leere).
 */
export function sleeveGeometry(len) {
  const g = plushTube([
    [0, -0.042], [0.026, -0.037], [0.042, -0.024], [0.051, -0.004], [0.0545, 0.03], [0.0535, len - 0.034],
    [0.0565, len - 0.02], [0.058, len - 0.008], [0.0565, len - 0.001], [0.0525, len], [0.0485, len - 0.004], [0.0475, len - 0.02],
    [0.0425, len - 0.046], [0, len - 0.052],
  ], 24);
  const sleeve = prep(g, 0xffffff, {
    shade: (p) => {
      const r = Math.hypot(p.x, p.z);
      if (r < 0.05 && p.y > len - 0.05) return 0.32; // im Ärmel ist es dunkel
      const a = Math.atan2(p.z, p.x);
      // Saumnaht als feine dunklere Linie, schräge Knitterfalten zum Saum hin
      const hem = 1 - 0.35 * Math.max(0, 1 - Math.abs(p.y - (len - 0.024)) / 0.0018);
      const fold = 1 - 0.16 * Math.max(0, Math.sin(a * 3 + p.y * 34)) ** 6 * Math.min(1, Math.max(0, (p.y - 0.03) / 0.08));
      return hem * fold;
    },
    uv: 'keep',
  });
  // Steppnaht rund um den umgeschlagenen Saum, auf der Saumlinie
  const ring = [];
  const rn = [];
  for (let k = 0; k <= 64; k++) {
    const a = (k / 64) * Math.PI * 2;
    const n = v3(Math.sin(a), 0, Math.cos(a));
    ring.push(n.clone().multiplyScalar(0.0558).setY(len - 0.024));
    rn.push(n);
  }
  return mergeGeometries([sleeve, ...stitches(ring, rn, { ...STITCH, len: 0.0048, w: 0.0013, h: 0.0006, color: SHIRT_THREAD })]);
}
