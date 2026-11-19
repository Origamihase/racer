// Kleinteile, die mehrere Baukästen brauchen: Bank, Blumenkübel, Vögel, Bäumchen, Laternenkopf.
// Jede Funktion baut in den übergebenen Bau b; Maße in Metern, Ursprung am Fuß.
import { PAL, CITY, mix } from './citycore.js';

export const BLOOM = [PAL.red, PAL.signYellow, 0xf4a6c0, PAL.blossom[1], PAL.orange, 0xb07cc6];
export const MOSS = mix(CITY.leafDark, PAL.stone, 0.25);
const STEEL = mix(PAL.steel, 0xffffff, 0.15);
const TAU = Math.PI * 2;

/** Sitzbank: Holzlatten auf Steinwangen, Sitzrichtung +z. */
export function bench(b, x, y, z, ry = 0, o = {}) {
  const { F } = b;
  const w = o.w ?? 1.9;
  const wood = o.col ?? CITY.wood;
  b.at(x, y, z, ry, () => {
    for (const s of [-1, 1]) {
      F.rbox(s * (w / 2 - 0.22), 0, 0, 0.14, 0.42, 0.5, 0.05, o.leg ?? PAL.stone, { seg: 2 });
      b.xf([s * (w / 2 - 0.22), 0.4, -0.22], [-0.2, 0, 0], 1, () => F.box(0, 0, 0, 0.07, 0.52, 0.06, PAL.darkMetal, { skip: 'b' }));
    }
    for (let i = 0; i < 3; i++) F.box(0, 0.42, -0.16 + i * 0.17, w, 0.055, 0.14, wood, { skip: 'b', k: 1 - i * 0.03 });
    for (let i = 0; i < 2; i++) b.xf([0, 0.6 + i * 0.18, -0.26 - i * 0.036], [-0.2, 0, 0], 1, () => F.box(0, 0, 0, w, 0.14, 0.045, wood));
  });
}

/** Runde Blüte (gestauchte Kugel): nah fein geteilt, damit sie auch in der Nahaufnahme rund bleibt. */
export function blossom(b, x, y, z, r, col) {
  const lo = b.lod > 0;
  b.F.ball(x, y, z, r, col, { ws: lo ? 5 : 8, hs: lo ? 3 : 4, sy: 0.82 });
}

/** Runder Blumenkübel mit Blüten in den Farben cols. */
export function tub(b, x, y, z, r = 0.45, cols = BLOOM, o = {}) {
  const { F } = b;
  const h = o.h ?? r * 1.1;
  const seg = b.lod > 0 ? 10 : 16;
  F.lathe(x, y, z, [[r * 0.78, 0], [r, h * 0.82], [r * 1.07, h * 0.86], [r * 1.07, h], [r * 0.9, h]], o.pot ?? PAL.stone, { seg, ks: [0.84, 1, 1, 1, 0.8], top: false });
  F.disc(x, y + h - 0.03, z, r * 0.92, CITY.leafDark, { up: true, seg });
  if (b.lod > 0) {
    F.ball(x, y + h, z, r * 0.8, cols[0], { ws: 6, hs: 3, sy: 0.6 });
    return;
  }
  const n = o.n ?? 7;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + r * 7;
    const d = i === 0 ? 0 : r * 0.56;
    const leaf = i % 3 === 2;
    blossom(b, x + Math.sin(a) * d, y + h + r * 0.12 + (i % 2) * r * 0.1, z + Math.cos(a) * d, r * (leaf ? 0.3 : 0.33), leaf ? CITY.leaf : cols[i % cols.length]);
  }
}

/** Polster aus Moos oder niedrigem Grün: zwei, drei flache Kissen. */
export function moss(b, x, y, z, r, col = MOSS) {
  const { F } = b;
  const lo = b.lod > 0;
  const o = { ws: lo ? 6 : 9, hs: lo ? 3 : 4, sy: 0.36, lat: [0.15, Math.PI / 2] };
  F.ball(x, y - r * 0.06, z, r, col, o);
  if (lo) return;
  F.ball(x + r * 0.62, y - r * 0.05, z + r * 0.3, r * 0.62, mix(col, 0xffffff, 0.08), o);
  F.ball(x - r * 0.5, y - r * 0.05, z - r * 0.42, r * 0.55, mix(col, CITY.leafDark, 0.3), o);
}

/** Taube (Blick nach +z), sitzt auf y. */
export function pigeon(b, x, y, z, ry = 0, col = 0x9aa3ad) {
  if (b.lod > 0) return;
  const { F } = b;
  b.at(x, y, z, ry, () => {
    F.ball(0, 0.13, 0, 0.11, col, { ws: 7, hs: 4, sz: 1.5 });
    F.ball(0, 0.27, 0.12, 0.07, mix(col, 0x4f8a8b, 0.35), { ws: 6, hs: 4 });
    F.cyl(0, 0.26, 0.19, 0.022, 0.004, 0.06, PAL.orange, { seg: 4 });
    b.xf([0, 0.13, -0.13], [-1.2, 0, 0], 1, () => F.frust(0, 0, 0, 0.1, 0.03, 0.14, 0.02, 0.17, mix(col, 0x33363c, 0.4)));
    for (const s of [-1, 1]) F.cyl(s * 0.04, 0, 0, 0.012, 0.012, 0.06, PAL.orange, { seg: 4 });
  });
}

/** Ente (Blick nach +z): schwimmend (swim, Ursprung auf dem Wasserspiegel) oder sitzend. */
export function duck(b, x, y, z, ry = 0, o = {}) {
  if (b.lod > 0) return;
  const { F } = b;
  const body = o.col ?? PAL.frame;
  b.at(x, y, z, ry, () => {
    F.ball(0, 0.1, 0, 0.17, body, { ws: 8, hs: 4, sz: 1.45, sy: 0.75 });
    b.xf([0, 0.16, -0.22], [-0.9, 0, 0], 1, () => F.frust(0, 0, 0, 0.16, 0.05, 0.03, 0.02, 0.14, body));
    F.cyl(0, 0.14, 0.16, 0.055, 0.05, 0.13, body, { seg: 6 });
    F.ball(0, 0.32, 0.18, 0.085, o.head ?? 0x3f7d55, { ws: 7, hs: 4 });
    b.xf([0, 0.3, 0.25], [Math.PI / 2, 0, 0], 1, () => F.frust(0, 0, 0, 0.07, 0.03, 0.05, 0.015, 0.09, PAL.orange));
  });
}

/**
 * Weiche Laubkrone aus Ballen list = [[x, y, z, r, sy?], …]: jede Kugel fein geteilt, ihre Normalen zur Mitte des
 * ganzen Haufens geneigt (o.soft), damit die Ballen als eine weiche, plüschige Masse lesen statt als geschliffene
 * Steine; unten dunkler, oben eine sonnige Kuppe (o.g = [unten, oben]), in den Fugen zwischen zwei Ballen ein Hauch
 * Schatten (o.ao). Dreiecke, die ganz in einem Nachbarballen stecken, fallen weg. Eimer o.part (Standard F).
 */
export function puffs(b, list, col, o = {}) {
  const part = o.part ?? b.F;
  const lo = b.lod > 0;
  const soft = o.soft ?? 0.5;
  const ao = o.ao ?? 0.2;
  const [kLo, kHi] = o.g ?? [0.8, 1.12];
  let cx = 0;
  let cy = 0;
  let cz = 0;
  let wsum = 0;
  let y0 = Infinity;
  let y1 = -Infinity;
  for (const [x, y, z, r, sy = 1] of list) {
    const w = r * r * r;
    cx += x * w;
    cy += y * w;
    cz += z * w;
    wsum += w;
    y0 = Math.min(y0, y - r * sy);
    y1 = Math.max(y1, y + r * sy);
  }
  cx /= wsum;
  cy /= wsum;
  cz /= wsum;
  // Abstand eines Punkts zur Mitte eines Ballens in dessen Radien (1 = auf der Oberfläche)
  const rel = (px, py, pz, [x, y, z, r, sy = 1]) => Math.hypot(px - x, (py - y) / sy, pz - z) / r;
  list.forEach((ball, i) => {
    const [x, y, z, r, sy = 1] = ball;
    const ws = o.ws ?? (lo ? 7 : i === 0 ? 11 : 8);
    const hs = o.hs ?? (lo ? 4 : i === 0 ? 7 : 5);
    const P = [];
    const N = [];
    const K = [];
    const hid = [];
    for (let j = 0; j <= hs; j++) {
      const lat = -Math.PI / 2 + (Math.PI * j) / hs;
      for (let k = 0; k <= ws; k++) {
        // jeder Ballen um ein Stück verdreht: die Nähte liegen nicht übereinander
        const lon = (TAU * k) / ws + i * 0.7;
        const ex = Math.cos(lat) * Math.sin(lon);
        const ey = Math.sin(lat);
        const ez = Math.cos(lat) * Math.cos(lon);
        const px = x + ex * r;
        const py = y + ey * r * sy;
        const pz = z + ez * r;
        let nx = ex;
        let ny = ey / sy;
        let nz = ez;
        let l = Math.hypot(nx, ny, nz);
        let gx = px - cx;
        let gy = py - cy;
        let gz = pz - cz;
        const gl = Math.hypot(gx, gy, gz) || 1;
        nx = (nx / l) * (1 - soft) + (gx / gl) * soft;
        ny = (ny / l) * (1 - soft) + (gy / gl) * soft;
        nz = (nz / l) * (1 - soft) + (gz / gl) * soft;
        l = Math.hypot(nx, ny, nz) || 1;
        let kk = kLo + (kHi - kLo) * Math.min(1, Math.max(0, (py - y0) / (y1 - y0 || 1)));
        let inside = false;
        list.forEach((other, m) => {
          if (m === i) return;
          const d = rel(px, py, pz, other);
          if (d < 0.985) inside = true;
          else if (d < 1.3) kk *= 1 - ao * ((1.3 - d) / 0.3);
        });
        P.push(px, py, pz);
        N.push(nx / l, ny / l, nz / l);
        K.push(kk);
        hid.push(inside);
      }
    }
    const idx = [];
    const row = ws + 1;
    for (let j = 0; j < hs; j++) {
      for (let k = 0; k < ws; k++) {
        const a = j * row + k;
        const bb = a + 1;
        const c = a + row;
        const d = c + 1;
        if (!(hid[a] && hid[bb] && hid[d])) idx.push(a, bb, d);
        if (!(hid[a] && hid[d] && hid[c])) idx.push(a, d, c);
      }
    }
    part.mesh(P, N, idx, Array.isArray(col) ? col[i % col.length] : col, { k: o.k }, null, K);
  });
}

/** Ballen einer runden Laubkrone mit Radius r um (x, cy, z): ein großer Ballen, drei kleinere (nah) oder keiner (fern). */
export function crownBalls(x, cy, z, r, lo) {
  const out = [[x, cy, z, r, 0.92]];
  if (lo) return out;
  out.push([x + r * 0.56, cy - r * 0.12, z + r * 0.3, r * 0.66]);
  out.push([x - r * 0.52, cy - r * 0.06, z - r * 0.34, r * 0.68]);
  out.push([x + r * 0.06, cy + r * 0.5, z - r * 0.1, r * 0.6]);
  return out;
}

/** Kugelbäumchen: kurzer Stamm, weiche runde Krone aus vier Ballen. r = Kronenradius, h = Gesamthöhe. */
export function ballTree(b, x, y, z, r = 1.5, h = 4.6, col = PAL.crown[1], o = {}) {
  const { F } = b;
  const th = h - r * 1.5;
  F.lathe(x, y, z, [[0.2, 0], [0.14, 0.3], [0.12, th], [0.2, th + r * 0.3]], PAL.trunk, { seg: 6, top: false, ks: [0.8, 0.9, 1, 0.9] });
  const cy = y + th + r * 0.75;
  const lo = b.lod > 0 || o.puff === false;
  puffs(b, crownBalls(x, cy, z, r, lo), [col, mix(col, 0xffffff, 0.1), mix(col, 0x2f5f43, 0.12), mix(col, 0xffffff, 0.16)]);
}

/**
 * Fichte aus drei pummeligen Röcken mit runder Unterkante, Spitze oben; r = Radius des untersten Rocks, h = Höhe.
 * Ursprung am Fuß des Stamms.
 */
export function spruce(b, x, y, z, r = 2.2, h = 8, col = PAL.conifer[0]) {
  const { F } = b;
  const lo = b.lod > 0;
  F.lathe(x, y, z, [[0.24, 0], [0.18, 0.25], [0.15, h * 0.2]], PAL.trunk, { seg: 6, top: false, ks: [0.8, 0.9, 1] });
  const skirts = [[r, h * 0.42, h * 0.16], [r * 0.78, h * 0.38, h * 0.38], [r * 0.54, h * 0.4, h * 0.6]];
  skirts.forEach(([rr, hh, yy], i) => {
    const lip = hh * 0.14;
    const k0 = 0.78 + i * 0.06;
    F.lathe(x, y + yy, z, [[rr * 0.55, lip * 0.2], [rr * 0.92, 0], [rr, lip * 0.55], [rr * 0.9, lip * 1.1], [0, hh]], mix(col, 0xffffff, i * 0.05), {
      seg: lo ? 7 : 12 - i * 2, crease: 0.2, bottom: true, ks: [k0 * 0.85, k0 * 0.9, k0, k0 * 1.05, 1.16],
    });
  });
}

/** Laternenkopf mit warmem Glas: hängt bei (x, y, z), Boden der Laterne. */
export function lantern(b, x, y, z, s = 1) {
  const { F, G } = b;
  F.lathe(x, y, z, [[0.07 * s, 0], [0.16 * s, 0.05 * s]], PAL.darkMetal, { seg: 6, bottom: true });
  G.lathe(x, y + 0.05 * s, z, [[0.15 * s, 0], [0.2 * s, 0.34 * s]], 0xffe9a8, { seg: 6, top: false, k: 1.15 });
  F.lathe(x, y + 0.39 * s, z, [[0.27 * s, 0], [0.12 * s, 0.14 * s], [0.03 * s, 0.2 * s]], PAL.darkMetal, { seg: 6, bottom: true });
  F.ball(x, y + 0.62 * s, z, 0.04 * s, PAL.darkMetal, { ws: 5, hs: 3 });
}

/** Niedriges Blumenbeet (Scheibe mit Blüten), Radius r. */
export function flowerBed(b, x, y, z, r, cols = BLOOM, seed = 3) {
  const { F } = b;
  const seg = Math.min(32, Math.max(14, Math.round(r * 10)));
  F.lathe(x, y, z, [[r, 0], [r, 0.1], [r - 0.08, 0.16]], PAL.stone, { seg, ks: [0.85, 1, 1], top: false });
  F.disc(x, y + 0.15, z, r - 0.07, CITY.leafDark, { up: true, seg });
  if (b.lod > 0) return;
  const n = Math.max(5, Math.round(r * 7));
  for (let i = 0; i < n; i++) {
    const a = i * 2.4 + seed;
    const d = (r - 0.25) * Math.sqrt((i + 0.5) / n);
    blossom(b, x + Math.sin(a) * d, y + 0.2, z + Math.cos(a) * d, 0.13 + (i % 3) * 0.03, i % 4 === 3 ? CITY.leaf : cols[(i + seed) % cols.length]);
  }
}

/** Rad (Fahrrad, Auto): Ring in der Ebene x = konstant, Mitte (x, y, z), Radius r, Dicke t. */
export function wheel(b, x, y, z, r, t, col = CITY.ink, hub = STEEL) {
  const { F } = b;
  const near = b.lod === 0;
  b.xf([x, y, z], [0, 0, Math.PI / 2], 1, () => {
    F.torus(0, 0, 0, r - t, t, col, { seg: near ? 14 : 8, tube: near ? 5 : 3 });
    if (near) F.cyl(0, -0.02, 0, r * 0.22, r * 0.22, 0.04, hub, { seg: 8, bottom: true });
  });
}

/** Fahrrad, steht längs z (Vorderrad bei +z), Rahmenfarbe col. */
export function bike(b, x, z, col, ry = 0) {
  const { F } = b;
  b.at(x, 0, z, ry, () => {
    wheel(b, 0, 0.34, 0.52, 0.34, 0.035);
    wheel(b, 0, 0.34, -0.52, 0.34, 0.035);
    const P = { bb: [0, 0.32, -0.06], seat: [0, 0.82, -0.2], head: [0, 0.82, 0.38], rear: [0, 0.34, -0.52], front: [0, 0.34, 0.52] };
    for (const [p, q] of [[P.bb, P.seat], [P.bb, P.head], [P.seat, P.head], [P.bb, P.rear], [P.seat, P.rear], [P.head, P.front]]) F.rod(p, q, 0.025, col, { seg: 5 });
    F.rod([0, 0.82, -0.2], [0, 0.92, -0.24], 0.018, PAL.darkMetal, { seg: 4 });
    F.rbox(0, 0.92, -0.26, 0.12, 0.05, 0.24, 0.025, CITY.ink, { seg: 2 });
    F.rod([0, 0.82, 0.38], [0, 1.0, 0.33], 0.02, PAL.darkMetal, { seg: 4 });
    F.rod([-0.26, 1.0, 0.33], [0.26, 1.0, 0.33], 0.018, PAL.darkMetal, { seg: 4, caps: true });
    F.box(0, 0.98, 0.48, 0.3, 0.16, 0.22, mix(CITY.wood, 0xffffff, 0.1));
  });
}
