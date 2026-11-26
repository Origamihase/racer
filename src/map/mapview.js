// Die Landkarte von „Navi ferngesteuert XXL“: ein Zeichner für jede 2D-Leinwand (Navi im Mittelbildschirm und die
// große Karte im Menü). Projektion, Detailstufen, Sichtbarkeit der Orte, Beschriftung und Trefferprüfung sind rein und
// laufen auch unter Node (tools/map-test.mjs). Gezeichnet wird in Ebenen: Meer, Land, Länderfarben, Grenzen, Straßen
// und Ortspunkte liegen in zwischengespeicherten Leinwänden (ein Ausschnitt oder Kacheln), die nur neu entstehen, wenn
// die Ansicht den gespeicherten Bereich verlässt oder die Maßstabsstufe wechselt. Die große Karte brennt auch Namen,
// Schilder und Bildzeichen in ihre Kacheln ein (je Maßstabsstufe einmal für die ganze Welt gesetzt, menuLayout); im
// gedrehten Navi kommen Namen, Schilder, Route, Auto und Ziel jedes Bild neu und stehen immer aufrecht.
//
// Kartenkoordinaten: project() aus graph.js (Mercator, x = Länge, y nach Süden, Einheit = Grad Länge am Äquator).
import { places, nodes, edges, roads, project, distKm } from './graph.js';
import { Q, LAND, PATCHES, REGIONS, COUNTRIES, SEAS } from './land.js';
import { FONT, drawShield, drawTransitBadge, drawHeart } from './symbols.js';
import { Warp } from './warp.js';
import { waterData, WATER_CLASS } from './water.js';

export { project, REGIONS, COUNTRIES, SEAS };
/** Deutscher Name eines Lands des Spiels nach Kürzel ('DE' → 'Deutschland'). */
export const countryName = (cc) => (COUNTRIES.find((c) => c[0] === cc) || [cc, cc])[1];
const RAD = Math.PI / 180;
export const KM_PER_UNIT = 111.32;
/** Umkehrung von project(): ebene Kartenkoordinaten → Breite/Länge. */
export function unproject(x, y) {
  return { lat: (2 * Math.atan(Math.exp(-y * RAD))) / RAD - 90, lon: x };
}
/** Kilometer je Karteneinheit bei der Kartenhöhe y (Mercator: in beiden Richtungen gleich). */
export function kmPerUnit(y) {
  return KM_PER_UNIT * Math.cos(unproject(0, y).lat * RAD);
}
const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

// --- Land und Grenzen (src/map/land.js, erzeugt von tools/map/land.mjs) ----------------------------
const COARSE_SHIFT = 2; // wie in tools/map/land.mjs: innere Punkte grober Bögen liegen auf einem 4-mal gröberen Raster

/**
 * Ring an Sprüngen über die Datumsgrenze teilen (Tschukotka springt von +180 nach −180 Grad): Liste geschlossener
 * Stücke. Ohne Sprung bleibt der Ring, wie er ist.
 */
export function splitJumps(pts) {
  const n = pts.length / 2;
  let first = -1;
  for (let i = 0; i < n && first < 0; i++) if (Math.abs(pts[((i + 1) % n) * 2] - pts[i * 2]) > 180) first = i;
  if (first < 0) return [pts];
  const pieces = [];
  let cur = [];
  for (let k = 1; k <= n; k++) {
    const i = (first + k) % n;
    cur.push(pts[i * 2], pts[i * 2 + 1]);
    if (Math.abs(pts[((i + 1) % n) * 2] - pts[i * 2]) > 180) {
      if (cur.length >= 6) pieces.push(Float64Array.from(cur));
      cur = [];
    }
  }
  return pieces;
}

function boxOf(pts) {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (let i = 0; i < pts.length; i += 2) {
    x0 = Math.min(x0, pts[i]);
    x1 = Math.max(x1, pts[i]);
    y0 = Math.min(y0, pts[i + 1]);
    y1 = Math.max(y1, pts[i + 1]);
  }
  return [x0, y0, x1, y1];
}

let LANDDATA = null;
/**
 * Küsten und Grenzen in zwei Detailstufen: lod[0] für Welt- und Europaansicht, lod[1] für nahe Ansichten.
 * Je Stufe: rings (Float64Array [x, y, …], geschlossen; Außenringe im Uhrzeigersinn, Löcher andersherum, Füllregel
 * „nonzero“), boxes (je Ring [x0, y0, x1, y1]), borders (Linienzüge der Landesgrenzen) und countries (je Land des
 * Spiels in der Reihenfolge von COUNTRIES: {col: Farbnummer, rings}).
 */
export function landData() {
  if (LANDDATA) return LANDDATA;
  const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const val = new Uint8Array(128);
  for (let i = 0; i < 64; i++) val[ALPHA.charCodeAt(i)] = i;
  let pos = 0;
  const bit = () => (val[LAND.charCodeAt((pos / 6) | 0)] >> (5 - (pos++ % 6))) & 1;
  const bits = (n) => {
    let v = 0;
    for (let i = 0; i < n; i++) v = v * 2 + bit();
    return v;
  };
  // Exp-Golomb-Code der Ordnung k (siehe tools/map/land.mjs), sg mit Vorzeichen (Zickzack)
  const eg = (k) => {
    let z = 0;
    while (!bit()) z++;
    return 2 ** (z + k) + bits(z + k) - 2 ** k;
  };
  const sg = (k) => {
    const u = eg(k);
    return u % 2 ? -(u + 1) / 2 : u / 2;
  };
  const nArcs = bits(16);
  const arcs = [];
  const masks = [];
  let x = 0;
  let y = 0;
  for (let a = 0; a < nArcs; a++) {
    const n = eg(2) + 2;
    x += sg(4);
    y += sg(4);
    const k = bits(4);
    const sh = bit() ? COARSE_SHIFT : 0;
    const pts = new Float64Array(n * 2);
    pts[0] = x / Q;
    pts[1] = y / Q;
    for (let i = 1; i < n; i++) {
      const last = i === n - 1;
      x += last ? sg(k + sh) : sg(k) * 2 ** sh;
      y += last ? sg(k + sh) : sg(k) * 2 ** sh;
      pts[i * 2] = x / Q;
      pts[i * 2 + 1] = y / Q;
    }
    let mask = null;
    if (bit()) {
      mask = new Uint8Array(n).fill(1);
      for (let i = 1; i < n - 1; i++) mask[i] = bit();
    }
    arcs.push(pts);
    masks.push(mask);
  }
  let prev = -1;
  const ref = () => {
    const rev = bit();
    const a = prev + 1 + sg(1);
    prev = a;
    return rev ? ~a : a;
  };
  const rings = [];
  for (let i = 0, n = eg(4); i < n; i++) {
    const m = eg(1) + 1;
    const lod0 = bit();
    const refs = [];
    for (let j = 0; j < m; j++) refs.push(ref());
    rings.push({ refs, lod0 });
  }
  const borders = [];
  for (let i = 0, n = eg(4); i < n; i++) {
    const lod0 = bit();
    borders.push({ ref: ref(), lod0 });
  }
  // Länder des Spiels (Reihenfolge wie COUNTRIES): Farbe und Ringe
  const countries = COUNTRIES.map(() => {
    const col = bits(3);
    const crings = [];
    for (let i = 0, n = eg(1) + 1; i < n; i++) {
      const lod0 = bit();
      const refs = [];
      for (let j = 0, m = eg(1) + 1; j < m; j++) refs.push(ref());
      crings.push({ refs, lod0 });
    }
    return { col, rings: crings };
  });
  /** Punkte einer Folge von Bogenverweisen (in LOD 0 nur die Punkte der Maske). */
  const line = (refs, lod) => {
    const out = [];
    for (const r of refs) {
      const a = r < 0 ? ~r : r;
      const P = arcs[a];
      const M = lod ? null : masks[a];
      const n = P.length / 2;
      for (let k = 0; k < n; k++) {
        const i = r < 0 ? n - 1 - k : k;
        if ((k === 0 && out.length) || (M && !M[i])) continue;
        out.push(P[i * 2], P[i * 2 + 1]);
      }
    }
    return Float64Array.from(out);
  };
  const endOf = (r, first) => {
    const a = r < 0 ? ~r : r;
    const P = arcs[a];
    const n = P.length / 2;
    const i = (r < 0) === first ? n - 1 : 0;
    return P[i * 2] + ',' + P[i * 2 + 1];
  };
  // Landvorsprünge der Küstenorte als Kreise (im Uhrzeigersinn wie alle Außenringe)
  const patches = [];
  for (let i = 0; i < PATCHES.length; i += 3) {
    const cx = PATCHES[i] / Q;
    const cy = PATCHES[i + 1] / Q;
    const r = PATCHES[i + 2] / Q;
    const P = new Float64Array(48);
    for (let k = 0; k < 24; k++) {
      P[k * 2] = cx + r * Math.cos((k / 24) * 2 * Math.PI);
      P[k * 2 + 1] = cy + r * Math.sin((k / 24) * 2 * Math.PI);
    }
    patches.push(P);
  }
  const lod = [0, 1].map((l) => {
    const rs = rings.filter((r) => l === 1 || r.lod0).flatMap((r) => splitJumps(line(r.refs, l)));
    if (l === 1) rs.push(...patches);
    // Grenzbögen, die aneinanderstoßen, werden zu einem Linienzug (die Strichelung läuft dann durch)
    const chains = [];
    let cur = null;
    for (const b of borders) {
      if (l === 0 && !b.lod0) continue;
      if (cur && endOf(cur[cur.length - 1], false) === endOf(b.ref, true)) cur.push(b.ref);
      else chains.push((cur = [b.ref]));
    }
    const cs = countries.map((c) => c.rings.filter((r) => l === 1 || r.lod0).flatMap((r) => splitJumps(line(r.refs, l))));
    return { rings: rs, boxes: rs.map(boxOf), borders: chains.map((c) => line(c, l)), countries: cs.map((r, i) => ({ col: countries[i].col, rings: r })) };
  });
  LANDDATA = { lod, regions: REGIONS };
  return LANDDATA;
}

/** Liegt der Punkt (Kartenkoordinaten) an Land? Umlaufzahl wie beim Füllen („nonzero“). */
export function onLand(x, y, lodIdx = 1) {
  const L = landData().lod[lodIdx];
  let w = 0;
  for (let r = 0; r < L.rings.length; r++) {
    const b = L.boxes[r];
    if (x < b[0] || x > b[2] || y < b[1] || y > b[3]) continue;
    const P = L.rings[r];
    const n = P.length / 2;
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const xj = P[j * 2];
      const yj = P[j * 2 + 1];
      const side = (P[i * 2] - xj) * (y - yj) - (x - xj) * (P[i * 2 + 1] - yj);
      if (yj <= y && P[i * 2 + 1] > y && side > 0) w++;
      else if (yj > y && P[i * 2 + 1] <= y && side < 0) w--;
    }
  }
  return w !== 0;
}

// --- Straßennetz in Kartenkoordinaten ---------------------------------------------------------------
/** Flüge ohne Zwischenpunkte als sanfter Bogen nach Norden (wie eine Flugroute auf dem Globus). */
function flightArc(ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy);
  let nx = dy / len;
  let ny = -dx / len;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  const cx = (ax + bx) / 2 + nx * len * 0.18;
  const cy = (ay + by) / 2 + ny * len * 0.18;
  const N = 40;
  const pts = new Float64Array((N + 1) * 2);
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const u = 1 - t;
    pts[i * 2] = u * u * ax + 2 * u * t * cx + t * t * bx;
    pts[i * 2 + 1] = u * u * ay + 2 * u * t * cy + t * t * by;
  }
  return pts;
}

/** Linienzug in Kartenkoordinaten: Länge (Einheiten) und Punkt nach dem Anteil f der Länge. */
export function polyLength(P) {
  let len = 0;
  for (let i = 2; i < P.length; i += 2) len += Math.hypot(P[i] - P[i - 2], P[i + 1] - P[i - 1]);
  return len;
}
export function polyAt(P, f, out = [0, 0]) {
  let rest = clamp(f, 0, 1) * polyLength(P);
  for (let i = 2; i < P.length; i += 2) {
    const d = Math.hypot(P[i] - P[i - 2], P[i + 1] - P[i - 1]);
    if (rest <= d || i === P.length - 2) {
      const t = d > 0 ? clamp(rest / d, 0, 1) : 0;
      out[0] = P[i - 2] + (P[i] - P[i - 2]) * t;
      out[1] = P[i - 1] + (P[i + 1] - P[i - 1]) * t;
      return out;
    }
    rest -= d;
  }
  out[0] = P[0];
  out[1] = P[1];
  return out;
}

let NET = null;
/**
 * Je Kante der Linienzug in Kartenkoordinaten (aus den Zwischenpunkten in data.js, Flüge als Bogen), dazu die
 * Zubringer von den Knoten zu ihren Orten und die Mitten der Straßen für Schilder und Bildzeichen.
 */
export function netData() {
  if (NET) return NET;
  const lines = edges.map((e) => {
    const a = nodes[e.a];
    const b = nodes[e.b];
    const pa = project(a.lat, a.lon);
    const pb = project(b.lat, b.lon);
    let pts;
    if (e.kind === 'flug' && !e.pts.length) pts = flightArc(pa.x, pa.y, pb.x, pb.y);
    else {
      const ll = [[a.lat, a.lon], ...e.pts, [b.lat, b.lon]];
      pts = new Float64Array(ll.length * 2);
      ll.forEach(([la, lo], i) => {
        const p = project(la, lo);
        pts[i * 2] = p.x;
        pts[i * 2 + 1] = p.y;
      });
    }
    return { i: e.i, kind: e.kind, road: roads[e.road], pts, box: boxOf(pts), len: polyLength(pts) };
  });
  // Zubringer: vom Knoten (Anschlussstelle) zum Ort, wenn er sichtbar abseits liegt. Entscheidend ist die Lage, nicht
  // zubKm: die Fahrt baut zu jedem Ort einen Zubringer, und ein paar Orte liegen trotz kurzem zubKm Kilometer neben
  // ihrem Knoten (Bad Sassendorf 4 km neben Soest)
  const feeders = [];
  for (const p of places) {
    if (p.node < 0 || distKm(nodes[p.node].lat, nodes[p.node].lon, p.lat, p.lon) < 0.3) continue;
    const a = project(nodes[p.node].lat, nodes[p.node].lon);
    const b = project(p.lat, p.lon);
    feeders.push({ pts: Float64Array.of(a.x, a.y, b.x, b.y), place: p.i });
  }
  // Schilder und Bildzeichen: in der Mitte jeder Etappe (Straßen) bzw. jeder Überfahrt
  const marks = [];
  for (const l of lines) {
    const m = polyAt(l.pts, 0.5);
    marks.push({ edge: l.i, x: m[0], y: m[1], kind: l.kind, text: l.road.label, cc: l.road.cc, len: l.len });
  }
  marks.sort((a, b) => b.len - a.len);
  NET = { lines, feeders, marks };
  return NET;
}

/** Feinere Straßenverläufe (Paket K1, src/map/shapes.js) für die Navi-Nahansicht; ohne sie gilt data.js. */
let edgeShape = null;
const fineCache = new Map();
/**
 * Schaltet die genauen Verläufe ein: useEdgeShapes(edgeShape) mit edgeShape(i) → {n, lat, lon}. Das ist der eine
 * Anschluss für Paket K1; ohne Aufruf (oder mit null) bleiben es die Zwischenpunkte aus data.js.
 */
export function useEdgeShapes(fn) {
  edgeShape = fn || null;
  fineCache.clear();
}
/** Verlauf der Kante i (Knoten a → b) in Kartenkoordinaten für die Nahansicht: genau, wenn vorhanden. */
export function edgeLine(i) {
  if (!edgeShape) return netData().lines[i].pts;
  let pts = fineCache.get(i);
  if (!pts) {
    const sh = edgeShape(i);
    if (sh && sh.n >= 2) {
      pts = new Float64Array(sh.n * 2);
      for (let k = 0; k < sh.n; k++) {
        const p = project(sh.lat[k], sh.lon[k]);
        pts[k * 2] = p.x;
        pts[k * 2 + 1] = p.y;
      }
    } else pts = netData().lines[i].pts;
    if (fineCache.size > 48) fineCache.delete(fineCache.keys().next().value);
    fineCache.set(i, pts);
  }
  return pts;
}

// --- Orte ---------------------------------------------------------------------------------------
/** Wichtigkeit eines Orts: Einwohner (logarithmisch) und die Zahl der Streams laut Wiki. */
export function importance(p) {
  return Math.log10(Math.max(p.pop, 300)) + 0.55 * Math.log2(1 + p.n);
}
/** Orte in Kartenkoordinaten, nach Wichtigkeit absteigend sortiert (Index in places bleibt in .i). */
export const PLACES = places
  .map((p) => {
    const q = project(p.lat, p.lon);
    return { i: p.i, x: q.x, y: q.y, imp: importance(p), name: p.name, cc: p.cc, pop: p.pop };
  })
  .sort((a, b) => b.imp - a.imp || a.i - b.i);
export const PLACE_BY_INDEX = [];
for (const p of PLACES) PLACE_BY_INDEX[p.i] = p;

/** Maßstab (Bildpunkte je Karteneinheit) → Stufe in halben Oktaven und deren Maßstab. */
export const bucketOf = (scale) => Math.round(Math.log2(scale) * 2);
export const bucketScale = (b) => 2 ** (b / 2);
/** Kleinster Maßstab, der noch zur Stufe b gehört (dort liegen die Punkte am dichtesten beisammen). */
export const bucketMin = (b) => 2 ** ((b - 0.5) / 2);
/** Mindestwichtigkeit eines Orts, damit sein Punkt bei diesem Maßstab erscheint (Weltansicht wenige, nah alle). */
const MIN_IMP = [
  [3, 8.2],
  [10, 7.2],
  [30, 6.3],
  [90, 5.0],
  [220, 3.6],
  [400, 0],
];
export function minImportance(scale) {
  if (scale <= MIN_IMP[0][0]) return MIN_IMP[0][1];
  for (let i = 1; i < MIN_IMP.length; i++) {
    const [s1, v1] = MIN_IMP[i];
    if (scale <= s1) {
      const [s0, v0] = MIN_IMP[i - 1];
      const t = Math.log(scale / s0) / Math.log(s1 / s0);
      return v0 + (v1 - v0) * t;
    }
  }
  return 0;
}
/** Halbmesser eines Ortspunkts in Bildpunkten. */
export function dotRadius(p, scale) {
  const big = clamp((p.imp - 4) / 4.5, 0, 1);
  return 2.6 + 3.2 * big + clamp(Math.log2(scale / 60) * 0.35, 0, 1.2);
}
/** Stadt (großer dunkler Punkt) oder Ort (heller Punkt)? */
export const isCity = (p) => p.imp >= 7;
const DOT_GAP = 12; // Mindestabstand zweier Punkte in Bildpunkten
const visCache = new Map();
/**
 * Welche Orte zeigen ihren Punkt in dieser Maßstabsstufe? Wichtige zuerst; ein Punkt entfällt, wenn er einem schon
 * gesetzten näher als DOT_GAP Bildpunkte käme (gemessen am kleinsten Maßstab der Stufe). Liefert ein Set von Ortsindizes.
 */
export function visiblePlaces(bucket) {
  let set = visCache.get(bucket);
  if (set) return set;
  const s = bucketMin(bucket);
  const minImp = minImportance(bucketScale(bucket));
  set = new Set();
  const grid = new Map();
  for (const p of PLACES) {
    if (p.imp < minImp) break;
    const gx = Math.floor((p.x * s) / DOT_GAP);
    const gy = Math.floor((p.y * s) / DOT_GAP);
    let free = true;
    for (let i = gx - 1; i <= gx + 1 && free; i++) {
      for (let j = gy - 1; j <= gy + 1 && free; j++) {
        const L = grid.get(i * 1e6 + j);
        if (L) for (const q of L) if (Math.hypot((q.x - p.x) * s, (q.y - p.y) * s) < DOT_GAP) free = false;
      }
    }
    if (!free) continue;
    set.add(p.i);
    const k = gx * 1e6 + gy;
    if (!grid.has(k)) grid.set(k, []);
    grid.get(k).push(p);
  }
  visCache.set(bucket, set);
  return set;
}

// --- Ansicht: Mittelpunkt, Maßstab, Drehung ----------------------------------------------------------
/**
 * Eine Kartenansicht. (x, y) = Kartenpunkt, der bei (ox, oy) auf dem Bild liegt; scale = Bildpunkte je Karteneinheit;
 * rot = Drehung im Uhrzeigersinn (Bogenmaß, −Kurs für „Fahrtrichtung oben“); w, h = Bildgröße.
 */
export class View {
  constructor() {
    this.set(10, -60, 20, 0, 100, 100);
  }
  set(x, y, scale, rot, w, h, ox = w / 2, oy = h / 2) {
    this.x = x;
    this.y = y;
    this.scale = scale;
    this.rot = rot;
    this.w = w;
    this.h = h;
    this.ox = ox;
    this.oy = oy;
    this.c = Math.cos(rot);
    this.s = Math.sin(rot);
    return this;
  }
  /** Kartenpunkt → Bildpunkt (in out[0], out[1]). */
  toScreen(wx, wy, out) {
    const dx = (wx - this.x) * this.scale;
    const dy = (wy - this.y) * this.scale;
    out[0] = this.ox + dx * this.c - dy * this.s;
    out[1] = this.oy + dx * this.s + dy * this.c;
    return out;
  }
  /** Bildpunkt → Kartenpunkt. */
  toWorld(sx, sy, out) {
    const dx = sx - this.ox;
    const dy = sy - this.oy;
    out[0] = this.x + (dx * this.c + dy * this.s) / this.scale;
    out[1] = this.y + (-dx * this.s + dy * this.c) / this.scale;
    return out;
  }
  /** Rechteck in Kartenkoordinaten, das das ganze Bild (plus Rand in Bildpunkten) abdeckt: [x0, y0, x1, y1]. */
  bounds(pad = 0) {
    const o = [0, 0];
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    for (const [sx, sy] of [[-pad, -pad], [this.w + pad, -pad], [-pad, this.h + pad], [this.w + pad, this.h + pad]]) {
      this.toWorld(sx, sy, o);
      x0 = Math.min(x0, o[0]);
      y0 = Math.min(y0, o[1]);
      x1 = Math.max(x1, o[0]);
      y1 = Math.max(y1, o[1]);
    }
    return [x0, y0, x1, y1];
  }
}

// --- Beschriftung -----------------------------------------------------------------------------------
/** Raster für Rechtecke (schnelle Überdeckungsprüfung). */
class RectGrid {
  constructor(cell = 64) {
    this.cell = cell;
    this.map = new Map();
  }
  hits(x0, y0, x1, y1) {
    const c = this.cell;
    for (let i = Math.floor(x0 / c); i <= Math.floor(x1 / c); i++) {
      for (let j = Math.floor(y0 / c); j <= Math.floor(y1 / c); j++) {
        const L = this.map.get(i * 65536 + j);
        if (!L) continue;
        for (let k = 0; k < L.length; k += 4) if (x0 < L[k + 2] && x1 > L[k] && y0 < L[k + 3] && y1 > L[k + 1]) return true;
      }
    }
    return false;
  }
  add(x0, y0, x1, y1) {
    const c = this.cell;
    for (let i = Math.floor(x0 / c); i <= Math.floor(x1 / c); i++) {
      for (let j = Math.floor(y0 / c); j <= Math.floor(y1 / c); j++) {
        const k = i * 65536 + j;
        if (!this.map.has(k)) this.map.set(k, []);
        this.map.get(k).push(x0, y0, x1, y1);
      }
    }
  }
}
// Lagen eines Namens zum Punkt: rechts, links, oben, unten, dann schräg
const SPOTS = [
  [1, 0],
  [-1, 0],
  [0, -1],
  [0, 1],
  [1, -1],
  [-1, -1],
  [1, 1],
  [-1, 1],
];
/** Linke obere Ecke des Kastens (w × h) in der Lage spot neben einem Punkt mit Halbmesser r bei (sx, sy). */
export function spotBox(sx, sy, r, gap, w, h, spot) {
  const [dx, dy] = SPOTS[spot];
  const off = r + gap;
  const x0 = dx > 0 ? sx + off * (dy ? 0.7 : 1) : dx < 0 ? sx - off * (dy ? 0.7 : 1) - w : sx - w / 2;
  const y0 = dy > 0 ? sy + off * (dx ? 0.7 : 1) : dy < 0 ? sy - off * (dx ? 0.7 : 1) - h : sy - h / 2;
  return [x0, y0];
}
/**
 * Namen und Schilder setzen, ohne dass sich etwas überdeckt. cands: nach Vorrang sortiert, je Eintrag
 * {x, y (Karte), w, h (Kasten in Bildpunkten), r (Halbmesser des eigenen Punkts, 0 = Schild mittig), key}.
 * dots: [{x, y, r}] Ortspunkte (Karte), die frei bleiben; avoid: [[x0, y0, x1, y1]] Bildbereiche, die frei bleiben;
 * pad: Abstand zum Bildrand; prev: Map key → Lage vom letzten Mal (wird zuerst versucht, damit nichts springt).
 * Liefert [{c, x, y, w, h, spot}] mit der linken oberen Ecke des Kastens in Bildpunkten.
 */
export function placeLabels(view, cands, { dots = [], avoid = [], pad = 4, gap = 3, prev = null } = {}) {
  const grid = new RectGrid();
  const p = [0, 0];
  for (const d of dots) {
    view.toScreen(d.x, d.y, p);
    grid.add(p[0] - d.r - 1, p[1] - d.r - 1, p[0] + d.r + 1, p[1] + d.r + 1);
  }
  for (const a of avoid) grid.add(a[0], a[1], a[2], a[3]);
  const out = [];
  const W = view.w - pad;
  const H = view.h - pad;
  const order = [0, 1, 2, 3, 4, 5, 6, 7];
  for (const c of cands) {
    view.toScreen(c.x, c.y, p);
    const [sx, sy] = p;
    if (sx < -200 || sy < -200 || sx > view.w + 200 || sy > view.h + 200) continue;
    const last = prev ? prev.get(c.key) : undefined;
    const n = c.r > 0 ? 8 : 1;
    for (let k = last !== undefined && c.r > 0 ? -1 : 0; k < n; k++) {
      const spot = k < 0 ? last : order[k];
      if (k >= 0 && spot === last) continue;
      const [x0, y0] = c.r > 0 ? spotBox(sx, sy, c.r, gap, c.w, c.h, spot) : [sx - c.w / 2, sy - c.h / 2];
      const x1 = x0 + c.w;
      const y1 = y0 + c.h;
      if (x0 < pad || y0 < pad || x1 > W || y1 > H) continue;
      if (grid.hits(x0, y0, x1, y1)) continue;
      grid.add(x0 - 2, y0 - 1, x1 + 2, y1 + 1);
      out.push({ c, x: x0, y: y0, w: c.w, h: c.h, spot });
      break;
    }
  }
  return out;
}

/** Schrift eines Ortsnamens nach Wichtigkeit: [Größe in Bildpunkten, Stärke]. */
export function placeFont(p) {
  return p.imp >= 8 ? [14, 700] : p.imp >= 7 ? [13, 700] : p.imp >= 5.5 ? [12, 600] : [11, 500];
}
/** Name eines Orts als Kasten für die Beschriftung (Maßstab bs der Stufe, measure wie bei menuLayout); r: Punkt. */
function placeCand(p, bs, measure) {
  const [size, weight] = placeFont(p);
  const font = `${weight} ${size}px ${FONT}`;
  return { kind: 'place', i: p.i, text: p.name, font, x: p.x, y: p.y, w: measure(p.name, font) + 2, h: size + 3, r: dotRadius(p, bs) };
}
/**
 * Ortsname wie in menuLayout.labels für einen Ort, den die Stufe nicht beschriftet (die Route des Tages zeigt die Orte,
 * durch die der Wagen fuhr): rechts neben dem Punkt, ausweichen muss, wer ihn setzt. measure: Standard Browser.
 */
export function placeLabel(i, bucket, measure = measureText) {
  const p = PLACE_BY_INDEX[i];
  const c = placeCand(p, bucketScale(bucket), measure);
  const [x0, y0] = spotBox(0, 0, c.r, 3, c.w, c.h, 0);
  return { kind: 'place', text: c.text, font: c.font, x: c.x, y: c.y, dx: x0, dy: y0, w: c.w, h: c.h, i: c.i };
}
const SHIELD_H = 16; // Höhe der Autobahnschilder in der großen Karte
const BADGE_R = 10; // Halbmesser der Bildzeichen an Fähren, Autozügen und Flügen
const layoutCache = new Map();
/**
 * Beschriftung der großen Karte für eine Maßstabsstufe: Ortsnamen, Länder, Meere, Autobahnschilder und die Bildzeichen
 * der Überfahrten, einmal für die ganze Welt gesetzt, damit beim Verschieben nichts springt und die Kacheln alles
 * einbrennen können. Gesetzt wird beim kleinsten Maßstab der Stufe: größer gezoomt rücken die Anker nur auseinander,
 * es bleibt also überdeckungsfrei. Ein Ort ist Punkt und Name zusammen: Wichtige Orte (nach Einwohnern und Streams)
 * kommen zuerst und dürfen den Punkt eines unwichtigeren Orts verdrängen, ein Ort ohne Platz für seinen Namen bleibt
 * ganz weg (näher heran erscheint er). Vorrang: wichtige Orte, Länder, Meere, Überfahrten, Schilder, die übrigen Orte.
 * measure(text, font, spacing) → Breite in Bildpunkten (unter Node genügt eine Schätzung).
 * Liefert {labels, shown}: shown = Set der Orte mit Punkt; labels = [{kind, text, font, x, y, dx, dy, w, h, i}] mit kind
 * 'place' | 'country' | 'sea' | 'shield' | 'faehre' | 'zug' | 'flug', (x, y) Anker in Kartenkoordinaten, (dx, dy) linke
 * obere Ecke des Kastens zum Anker in Bildpunkten, i = Ortsindex (Orte).
 */
export function menuLayout(bucket, measure) {
  let out = layoutCache.get(bucket);
  if (out) return out;
  const s = bucketMin(bucket);
  const bs = bucketScale(bucket);
  const vis = visiblePlaces(bucket);
  const dots = new RectGrid(96); // Punkte, die noch kommen
  const taken = new RectGrid(96); // gesetzte Punkte und Kästen
  const dotBox = (p) => {
    const r = dotRadius(p, bs) + 1;
    return [p.x * s - r, p.y * s - r, p.x * s + r, p.y * s + r];
  };
  for (const i of vis) dots.add(...dotBox(PLACE_BY_INDEX[i]));
  const labels = [];
  const shown = new Set();
  // Kasten in der ersten freien Lage setzen; strict: auch keinen noch kommenden Punkt verdecken
  const put = (c, strict) => {
    const sx = c.x * s;
    const sy = c.y * s;
    for (let k = 0; k < (c.r > 0 ? 8 : 1); k++) {
      const [x0, y0] = c.r > 0 ? spotBox(sx, sy, c.r, 3, c.w, c.h, k) : [sx - c.w / 2, sy - c.h / 2];
      const x1 = x0 + c.w;
      const y1 = y0 + c.h;
      if (taken.hits(x0, y0, x1, y1) || (strict && dots.hits(x0, y0, x1, y1))) continue;
      taken.add(x0 - 2, y0 - 1, x1 + 2, y1 + 1);
      labels.push({ kind: c.kind, text: c.text, font: c.font, x: c.x, y: c.y, dx: x0 - sx, dy: y0 - sy, w: c.w, h: c.h, i: c.i });
      return true;
    }
    return false;
  };
  const place = (p) => {
    const box = dotBox(p);
    if (taken.hits(...box)) return; // ein wichtigerer Name liegt schon hier
    const c = placeCand(p, bs, measure);
    if (put(c, true) || put(c, false)) {
      taken.add(...box);
      shown.add(p.i);
    }
  };
  const minor = [];
  for (const i of vis) {
    const p = PLACE_BY_INDEX[i];
    if (p.imp >= 5.5) place(p);
    else minor.push(p);
  }
  // Länder: in Großbuchstaben, gesperrt, nur wenn der Name gut in das Land passt
  if (bs < 260) {
    const size = bs < 24 ? 10 : 12;
    const font = `600 ${size}px ${FONT}`;
    for (const [, name, x, y, d] of COUNTRIES) {
      const text = name.toUpperCase();
      const w = measure(text, font, 2);
      if (d * s * 2.2 >= w) put({ kind: 'country', text, font, x, y, w, h: size + 2, r: 0 }, true);
    }
  }
  // Meere: Ozeane in der Weltansicht, Nebenmeere und Buchten näher heran
  const SEA_RANGE = [[0, 12], [5, 90], [24, 420]];
  for (const [name, x, y, rank] of SEAS) {
    if (bs < SEA_RANGE[rank][0] || bs >= SEA_RANGE[rank][1]) continue;
    const font = `italic 500 ${rank ? 12 : 13}px ${FONT}`;
    put({ kind: 'sea', text: name, font, x, y, w: measure(name, font, 1), h: 16, r: 0 }, true);
  }
  // Überfahrten und Schilder in der Mitte ihrer Etappe, wenn die Etappe lang genug auf dem Bild ist
  const marks = netData().marks;
  for (const m of marks) {
    const px = m.len * s;
    if (m.kind === 'flug' ? bs < 14 && px > 140 : (m.kind === 'faehre' || m.kind === 'zug') && px > 56) {
      put({ kind: m.kind, text: '', font: '', x: m.x, y: m.y, w: BADGE_R * 2 + 2, h: BADGE_R * 2 + 2, r: 0 }, true);
    }
  }
  if (bs >= 26) {
    const seen = new Map();
    const font = `700 ${Math.round(SHIELD_H * 0.62)}px ${FONT}`;
    for (const m of marks) {
      if (m.kind !== 'ab' || !m.text || m.len * s < 150) continue;
      const near = (seen.get(m.text) || []).some(([x, y]) => Math.hypot(x - m.x, y - m.y) * s < 260);
      if (near) continue;
      const w = Math.max(SHIELD_H * 1.25, measure(m.text, font) + SHIELD_H * 0.55);
      if (put({ kind: 'shield', text: m.text, font, x: m.x, y: m.y, w, h: SHIELD_H, r: 0 }, true)) {
        if (!seen.has(m.text)) seen.set(m.text, []);
        seen.get(m.text).push([m.x, m.y]);
      }
    }
  }
  for (const p of minor) place(p);
  out = { labels, shown };
  layoutCache.set(bucket, out);
  return out;
}

/** menuLayout mit der Schriftmessung des Browsers (große Karte). */
export const menuLayoutOf = (bucket) => menuLayout(bucket, measureText);

/** Ort unter dem Bildpunkt (sx, sy): der nächste sichtbare innerhalb von radius Bildpunkten, sonst −1. */
export function pickPlace(view, sx, sy, radius = 22, vis = visiblePlaces(bucketOf(view.scale))) {
  const p = [0, 0];
  let best = -1;
  let bd = radius;
  for (const i of vis) {
    const q = PLACE_BY_INDEX[i];
    view.toScreen(q.x, q.y, p);
    const d = Math.hypot(p[0] - sx, p[1] - sy);
    if (d <= bd) {
      bd = d;
      best = i;
    }
  }
  return best;
}

// --- Sammelabzeichen an Orten ---------------------------------------------------------------------------
const BADGES = new Map();
/**
 * Eine Sammlung kleiner Abzeichen an Orten anmelden (Brunnen, Zeitungsberichte, …): kind = Kennung,
 * def = {icon: '⛲', title: 'BrunnenTV-Folgen', count(placeIdx) → Zahl (0 = keins), text(n, placeIdx) → Zeile für die
 * Ortskarte, total() → Zeile für die Zähler (optional)}. Die Karte zeigt das Bildzeichen am Ort und die Zeile in der
 * Ortskarte. Nochmal mit derselben Kennung ersetzt die Sammlung, mit def = null wird sie entfernt.
 */
export function addBadges(kind, def) {
  if (def) BADGES.set(kind, def);
  else BADGES.delete(kind);
  badgeVersion++;
}
let badgeVersion = 0;
/** Zählt hoch, wenn sich Sammlungen ändern (die Karte zeichnet ihre Abzeichen dann neu). */
export const badgesVersion = () => badgeVersion;
/** Abzeichen eines Orts: [{kind, icon, n, text}]. */
export function badgesAt(placeIdx) {
  const out = [];
  for (const [kind, d] of BADGES) {
    const n = d.count(placeIdx) || 0;
    if (n > 0) out.push({ kind, icon: d.icon, n, text: d.text ? d.text(n, placeIdx) : d.title });
  }
  return out;
}
/** Zeilen für die Zähler aller Sammlungen: [{kind, icon, text}]. */
export function badgeTotals() {
  const out = [];
  for (const [kind, d] of BADGES) if (d.total) out.push({ kind, icon: d.icon, text: d.total() });
  return out;
}

// --- Farben (Familie der Paletten des Mittelbildschirms in src/cockpit/screen.js) -------------------------
// tints: Pastelltöne der Länder des Spiels (Farbnummer aus land.js, Nachbarn verschieden); alle anderen Länder in land.
export const THEMES = {
  light: {
    sea: '#a9d3ec', shallow: '#b9dcf0', shallow2: '#c9e5f4', land: '#ebe8e1', coast: '#bdb3a2', town: '#efdccd',
    townEdge: '#e0c2ae', border: '#9a86a6', borderUnder: 'rgba(154,134,166,0.2)',
    tints: ['#f6e4c8', '#dfebcf', '#f2dbe0', '#e3def0', '#f2ecc6'],
    road: '#ffffff', roadCase: '#cdc5b8', hwy: '#ffd36a', hwyCase: '#d9a640', ferry: '#4d86c6', rail: '#6d7078',
    flight: '#7b74c9', route: '#2f6fe4', routeCase: '#1e4fb0', routeGlow: 'rgba(47,111,228,0.18)', driven: '#9aaccb',
    drivenCase: '#7d8fae', text: '#1d1f22', sub: '#4b5058', halo: 'rgba(250,248,244,0.92)', dot: '#ffffff',
    dotRing: '#5f646c', city: '#3a3e45', cityRing: '#ffffff', seaText: '#4f7fa6', countryText: '#86778f',
    badge: '#ffffff', heart: '#e5486a', check: '#2e9d5b',
  },
  dark: {
    sea: '#1d3550', shallow: '#21405f', shallow2: '#254869', land: '#26282c', coast: '#41464e', town: '#3a3533',
    townEdge: '#4a423d', border: '#8a7896', borderUnder: 'rgba(138,120,150,0.22)',
    tints: ['#34302a', '#2b322b', '#342d31', '#2e2c36', '#33322a'],
    road: '#4a4e55', roadCase: '#2c2e33', hwy: '#9c7b30', hwyCase: '#664f1f', ferry: '#5d8cc4', rail: '#8a8e96',
    flight: '#8f88dd', route: '#4c8dff', routeCase: '#2a5fc0', routeGlow: 'rgba(76,141,255,0.22)', driven: '#56657e',
    drivenCase: '#3e4a5d', text: '#f2f3f5', sub: '#b7bcc4', halo: 'rgba(30,32,36,0.92)', dot: '#d9dce1',
    dotRing: '#1b1c1f', city: '#f2f3f5', cityRing: '#1b1c1f', seaText: '#7fa6c8', countryText: '#a796b3',
    badge: '#2b2d32', heart: '#ff6f8e', check: '#55c985',
  },
};

/**
 * Farbe des Landes cc, wie die Karte es malt (im Navi liegt die Länderfarbe zu 65 % über dem Land): Grund der
 * Nahansicht, damit der Wechsel zwischen Karte und Nahansicht nicht die Farbe springen lässt.
 */
export function countryColor(cc, theme, navi = true) {
  const T = THEMES[theme];
  const i = COUNTRIES.findIndex((c) => c[0] === cc);
  if (i < 0) return T.land;
  const col = landData().lod[0].countries[i].col;
  const a = parseInt(T.land.slice(1), 16);
  const b = parseInt(T.tints[col % T.tints.length].slice(1), 16);
  const t = navi ? 0.65 : 1;
  const ch = (sh) => Math.round(((a >> sh) & 255) * (1 - t) + ((b >> sh) & 255) * t);
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
}

// --- Zeichner: statische Ebenen ---------------------------------------------------------------------
const LOD1_FROM = 40; // ab diesem Maßstab (CSS-Bildpunkte je Einheit) die feine Stufe
const FLAT_TOL = [0.3 / LOD1_FROM, 0.3 / 4000]; // erlaubte Abweichung der geglätteten Küste (Einheiten) je Stufe
const CHUNK = 48; // Punkte je Stück beim Zuschneiden auf einen Ausschnitt
const MARGIN = 40; // Rand um einen Ausschnitt in CSS-Bildpunkten: Striche an den Schnittkanten bleiben draußen
/** Stückgröße (Bildpunkte) der Ausschnitte der schrägen Sicht: so viel entsteht höchstens am Stück. */
const TILT_TILE = 512;

/** Bildpunkte je Kilometer bei Maßstab s (Bildpunkte je Einheit) in der Kartenhöhe y. */
export const pxPerKm = (s, y) => s / kmPerUnit(y);
/** Linienbreite einer Straßenart in Bildpunkten bei k Bildpunkten je Kilometer (look 'navi' etwas kräftiger). */
/** Breite (Bildpunkte) einer Straße, die MapPainter.keep zeichnet, wo ihre Stufe sie weglässt. */
const KEEP_W = 1;
/**
 * Welche Straßen renderStatic zeichnet, bei k Bildpunkten je km und den Orten mit Punkt (vis): Breiten wa, wl, wz
 * (Autobahn, Landstraße, Zubringer) und je ein Filter für Landstraßen (land(l), l.edge = Kante) und Zubringer (zub(l),
 * l.place = Ort), null: keine. Autobahnen immer. Zubringer nur zu Orten, deren Punkt oder Fläche zu sehen ist; was keep
 * verlangt (MapPainter.keep), auch wo die Stufe es weglässt, dann mindestens KEEP_W breit.
 */
export function roadsShown(k, vis, keep = null, navi = false) {
  const wa = roadWidth('ab', k, navi);
  let wl = roadWidth('land', k, navi);
  let wz = roadWidth('zub', k, navi);
  const kz = (l) => !!keep && keep.places.has(l.place);
  const zub = wz > 0.7 ? (l) => kz(l) || vis.has(l.place) || townKm(PLACE_BY_INDEX[l.place].pop) * k >= 2.5 : keep ? kz : null;
  const land = wl > 0.5 ? () => true : keep ? (l) => keep.edges.has(l.edge) : null;
  if (keep) {
    wz = Math.max(wz, KEEP_W);
    wl = Math.max(wl, KEEP_W);
  }
  return { wa, wl, wz, zub, land };
}
export function roadWidth(kind, k, navi = false) {
  const z = Math.log2(Math.max(k, 1e-3));
  const f = navi ? 1.35 : 1;
  if (kind === 'ab') return f * clamp(2.2 + z * 0.9, 0.8, 7);
  if (kind === 'land') return f * clamp(1.4 + z * 0.75, 0, 5);
  return f * clamp(0.6 + z * 0.6, 0, 3.4); // Zubringer
}

let MEASURE = null;
/** Breite eines Texts in Bildpunkten (Schrift wie ctx.font, spacing wie ctx.letterSpacing). */
function measureText(text, font, spacing = 0) {
  if (!MEASURE) MEASURE = newCanvas(8, 8).getContext('2d');
  MEASURE.font = font;
  MEASURE.letterSpacing = spacing + 'px';
  return MEASURE.measureText(text).width;
}

/** Höchstens so viele Bytes Kacheln der großen Karte (64 MB: 64 Kacheln zu 512², 256 zu 256²; das Bild geht vor). */
export const TILE_BYTES = 64 * 1024 * 1024;
function newCanvas(w, h) {
  const c = typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(w, h) : document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

/**
 * Weiche Kurve durch die Kantenmitten (quadratisch, die Ecken sind Stützpunkte) als Linienzug mit höchstens tol
 * Abweichung. Geschlossen: Ring; offen: Anfang und Ende bleiben genau.
 */
export function flatten(P, closed, tol) {
  const n = P.length / 2;
  if (n < 3) return Float32Array.from(P);
  const out = [];
  const curve = (ax, ay, cx, cy, bx, by) => {
    const dev = Math.hypot(ax - 2 * cx + bx, ay - 2 * cy + by) / 4;
    const m = clamp(Math.ceil(Math.sqrt(dev / tol)), 1, 10);
    for (let j = 1; j <= m; j++) {
      const t = j / m;
      const u = 1 - t;
      out.push(u * u * ax + 2 * u * t * cx + t * t * bx, u * u * ay + 2 * u * t * cy + t * t * by);
    }
  };
  if (closed) {
    let px = (P[n * 2 - 2] + P[0]) / 2;
    let py = (P[n * 2 - 1] + P[1]) / 2;
    out.push(px, py);
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const mx = (P[i * 2] + P[j * 2]) / 2;
      const my = (P[i * 2 + 1] + P[j * 2 + 1]) / 2;
      curve(px, py, P[i * 2], P[i * 2 + 1], mx, my);
      px = mx;
      py = my;
    }
    out.length -= 2; // der letzte Punkt ist wieder der erste
  } else {
    let px = P[0];
    let py = P[1];
    out.push(px, py);
    for (let i = 1; i < n - 1; i++) {
      const end = i === n - 2;
      const mx = end ? P[i * 2 + 2] : (P[i * 2] + P[i * 2 + 2]) / 2;
      const my = end ? P[i * 2 + 3] : (P[i * 2 + 1] + P[i * 2 + 3]) / 2;
      curve(px, py, P[i * 2], P[i * 2 + 1], mx, my);
      px = mx;
      py = my;
    }
  }
  return Float32Array.from(out);
}

/** Linienzug in Stücke mit Rechteck und Länge bis zum Stückanfang teilen (zum schnellen Zuschneiden). */
export function chunked(pts) {
  const n = pts.length / 2;
  const chunks = [];
  let len = 0;
  for (let i0 = 0; i0 < n - 1; i0 += CHUNK) {
    const i1 = Math.min(i0 + CHUNK, n - 1);
    chunks.push({ i0, i1, box: boxOf(pts.subarray(i0 * 2, i1 * 2 + 2)), len0: len });
    for (let i = i0 + 1; i <= i1; i++) len += Math.hypot(pts[i * 2] - pts[i * 2 - 2], pts[i * 2 + 1] - pts[i * 2 - 1]);
  }
  return { pts, box: boxOf(pts), chunks, len };
}

const isOut = (b, x0, y0, x1, y1) => b[2] < x0 || b[0] > x1 || b[3] < y0 || b[1] > y1;

/** Ein Durchgang von Sutherland–Hodgman: behält die Seite axis ≥ v (keepGreater) bzw. ≤ v. */
function clipHalf(P, axis, v, keepGreater) {
  const out = [];
  const n = P.length / 2;
  if (n < 3) return out;
  let px = P[n * 2 - 2];
  let py = P[n * 2 - 1];
  let pc = axis ? py : px;
  let pin = keepGreater ? pc >= v : pc <= v;
  for (let i = 0; i < n; i++) {
    const x = P[i * 2];
    const y = P[i * 2 + 1];
    const c = axis ? y : x;
    const cin = keepGreater ? c >= v : c <= v;
    if (cin !== pin) {
      const t = (v - pc) / (c - pc);
      out.push(px + (x - px) * t, py + (y - py) * t);
    }
    if (cin) out.push(x, y);
    px = x;
    py = y;
    pc = c;
    pin = cin;
  }
  return out;
}

/**
 * Ring auf das Rechteck zuschneiden. Stücke, die ganz jenseits einer Rechteckseite liegen, schrumpfen vorher auf ihren
 * Anfangspunkt: Die Fläche ändert sich dadurch nur außerhalb des Rechtecks, und große Ringe (Eurasien) bleiben billig.
 */
export function clipRing(R, x0, y0, x1, y1) {
  const P = R.pts;
  let Q = [];
  for (const c of R.chunks) {
    if (isOut(c.box, x0, y0, x1, y1)) Q.push(P[c.i0 * 2], P[c.i0 * 2 + 1]);
    else for (let i = c.i0; i < c.i1; i++) Q.push(P[i * 2], P[i * 2 + 1]);
  }
  Q.push(P[P.length - 2], P[P.length - 1]);
  Q = clipHalf(Q, 0, x0, true);
  Q = clipHalf(Q, 0, x1, false);
  Q = clipHalf(Q, 1, y0, true);
  return clipHalf(Q, 1, y1, false);
}

const GEO = [null, null];
/** Geometrie zum Kacheln je Detailstufe: geglättete Landringe und Grenzen, in Stücken. */
function tileGeo(lod) {
  if (GEO[lod]) return GEO[lod];
  const L = landData().lod[lod];
  const ring = (P) => chunked(flatten(P, true, FLAT_TOL[lod]));
  GEO[lod] = {
    rings: L.rings.map(ring),
    borders: L.borders.map((P) => chunked(flatten(P, false, FLAT_TOL[lod]))),
    countries: L.countries.map((c) => {
      const rings = c.rings.map(ring);
      const box = rings.reduce((b, R) => [Math.min(b[0], R.box[0]), Math.min(b[1], R.box[1]), Math.max(b[2], R.box[2]), Math.max(b[3], R.box[3])], [Infinity, Infinity, -Infinity, -Infinity]);
      return { col: c.col, rings, box };
    }),
  };
  return GEO[lod];
}
let WATERGEO = null;
/** Flüsse (je Klasse) und Seen in Stücken, zum Zuschneiden auf Kacheln. */
function waterGeo() {
  if (WATERGEO) return WATERGEO;
  const W = waterData();
  const rivers = WATER_CLASS.map(() => []);
  for (const r of W.rivers) rivers[r.cls].push(Object.assign(chunked(r.pts), { river: r.i }));
  const lakes = W.lakes.map((l) => {
    const c = chunked(l.pts);
    return { pts: l.pts, box: c.box, chunks: c.chunks };
  });
  WATERGEO = { rivers, lakes };
  return WATERGEO;
}
let NETGEO = null;
/** Straßennetz in Stücken, nach Art (Zubringer mit ihrem Ort). */
function netGeo() {
  if (NETGEO) return NETGEO;
  const N = netData();
  const by = { ab: [], land: [], faehre: [], zug: [], flug: [], zub: [] };
  for (const l of N.lines) by[l.kind].push(Object.assign(chunked(l.pts), { edge: l.i }));
  for (const f of N.feeders) by.zub.push(Object.assign(chunked(f.pts), { place: f.place }));
  NETGEO = by;
  return by;
}

/** Ringe (Land oder ein Land des Spiels) eines Rechtecks als Pfad (Kartenkoordinaten; zugeschnitten, „nonzero“). */
function landPath(rings, x0, y0, x1, y1) {
  const path = new Path2D();
  for (const R of rings) {
    const b = R.box;
    if (isOut(b, x0, y0, x1, y1)) continue;
    const P = b[0] >= x0 && b[2] <= x1 && b[1] >= y0 && b[3] <= y1 ? R.pts : clipRing(R, x0, y0, x1, y1);
    if (P.length < 6) continue;
    path.moveTo(P[0], P[1]);
    for (let i = 2; i < P.length; i += 2) path.lineTo(P[i], P[i + 1]);
    path.closePath();
  }
  return path;
}
/** Sichtbare Teile von Linienzügen: f(pts, i0, i1, len0) je zusammenhängendem Lauf (len0 = Länge bis zum Anfang). */
function eachRun(lines, r, f, keep) {
  for (const l of lines) {
    if (isOut(l.box, r[0], r[1], r[2], r[3]) || (keep && !keep(l))) continue;
    let s = -1;
    let e = -1;
    let len0 = 0;
    for (const c of l.chunks) {
      if (!isOut(c.box, r[0], r[1], r[2], r[3])) {
        if (s < 0) {
          s = c.i0;
          len0 = c.len0;
        }
        e = c.i1;
      } else if (s >= 0) {
        f(l.pts, s, e, len0);
        s = -1;
      }
    }
    if (s >= 0) f(l.pts, s, e, len0);
  }
}
function runPath(path, P, i0, i1) {
  path.moveTo(P[i0 * 2], P[i0 * 2 + 1]);
  for (let i = i0 + 1; i <= i1; i++) path.lineTo(P[i * 2], P[i * 2 + 1]);
}
/** Alle sichtbaren Läufe als ein Pfad (für durchgehende Striche). */
function solidPath(lines, r, keep) {
  const path = new Path2D();
  eachRun(lines, r, (P, i0, i1) => runPath(path, P, i0, i1), keep);
  return path;
}
/** Gestrichelt, jeder Lauf einzeln: Die Strichelung läuft über die Grenzen der Ausschnitte hinweg gleich weiter. */
function strokeDashed(ctx, lines, r) {
  eachRun(lines, r, (P, i0, i1, len0) => {
    const path = new Path2D();
    runPath(path, P, i0, i1);
    ctx.lineDashOffset = len0;
    ctx.stroke(path);
  });
  ctx.lineDashOffset = 0;
}

/** Pseudozufall aus einer Zahl (für den Umriss der Ortsflächen: jeder Ort sieht immer gleich aus). */
function hash01(n) {
  let t = (n * 0x9e3779b1) | 0;
  t = Math.imul(t ^ (t >>> 15), 1 | t);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
/** Halbmesser der Ortsfläche in km nach Einwohnern. */
export const townKm = (pop) => 0.32 * Math.pow(Math.max(pop, 500) / 1000, 0.4);

/** Weicher geschlossener Pfad durch die Kantenmitten (für die Ortsflächen). */
function smoothRing(path, P) {
  const n = P.length / 2;
  path.moveTo((P[n * 2 - 2] + P[0]) / 2, (P[n * 2 - 1] + P[1]) / 2);
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    path.quadraticCurveTo(P[i * 2], P[i * 2 + 1], (P[i * 2] + P[j * 2]) / 2, (P[i * 2 + 1] + P[j * 2 + 1]) / 2);
  }
  path.closePath();
}

/**
 * Zeichnet Karten. Ein Zeichner hält seine Zwischenspeicher (Kacheln, Ausschnitt).
 * theme: 'light' | 'dark'; look: 'menu' (große Karte) | 'navi' (Mittelbildschirm: kräftigere Linien und Punkte);
 * labels: false – renderStatic lässt die Namen weg (wer selbst darüber zeichnet, setzt sie danach mit renderLabels).
 */
export class MapPainter {
  constructor({ theme = 'light', look = 'menu', labels = true } = {}) {
    this.theme = theme;
    this.navi = look === 'navi';
    this.labels = labels;
    this.tiles = new Map();
    this.frame = 0;
    this.cache = null; // Ausschnitt für gedrehte Ansichten
    this.lv = [null, null]; // schräge Sicht: Ausschnitte in den WebGL-Texturen (vorn, Reserve) …
    this.jobs = [null, null]; // … und die nächsten im Bau
    this.jobCanvas = [null, null];
    this.stats = { tiles: 0, cache: 0, ms: 0 };
    // Was renderStatic auf jeden Fall zeichnet, auch wo die Stufe es weglässt (die Route des Tages, routemap.js): die
    // Orte, durch die der Wagen fuhr, mit Punkt und Zubringer, und die Landstraßen, auf denen er fuhr
    // ({ places: Set Ortsindex, edges: Set Kante } oder null)
    this.keep = null;
  }
  get T() {
    return THEMES[this.theme];
  }
  setTheme(theme) {
    if (theme === this.theme) return;
    this.theme = theme;
    this.trim(0);
    this.cache = null;
    this.lv = [null, null];
    this.jobs = [null, null];
  }

  /**
   * Statische Ebenen eines Rechtecks: Bildpunkt (dx, dy) der Leinwand liegt bei Kartenpunkt (wx, wy), s = Bildpunkte
   * je Einheit auf der Leinwand, ps = Bildpunkte der Leinwand je CSS-Bildpunkt, b = Maßstabsstufe (Ortspunkte); es wird
   * nur das Rechteck cw × ch ab (dx, dy) bemalt (Stücke eines großen Ausschnitts).
   */
  renderStatic(ctx, wx, wy, s, cw, ch, ps, b, dx = 0, dy = 0) {
    const t0 = performance.now();
    const T = this.T;
    const css = s / ps; // Maßstab in CSS-Bildpunkten
    const k = pxPerKm(css, wy + ch / s / 2); // CSS-Bildpunkte je Kilometer in der Mitte des Rechtecks
    const u = ps / s; // eine CSS-Bildpunkt-Breite in Karteneinheiten
    const r = [wx - MARGIN * u, wy - MARGIN * u, wx + cw / s + MARGIN * u, wy + ch / s + MARGIN * u];
    const G = tileGeo(css >= LOD1_FROM ? 1 : 0);
    const land = landPath(G.rings, r[0], r[1], r[2], r[3]);
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (dx || dy || cw < ctx.canvas.width || ch < ctx.canvas.height) {
      ctx.beginPath();
      ctx.rect(dx, dy, cw, ch);
      ctx.clip();
    }
    ctx.fillStyle = T.sea;
    ctx.fillRect(dx, dy, cw, ch);
    ctx.setTransform(s, 0, 0, s, dx - wx * s, dy - wy * s);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    // flaches Wasser an der Küste: zwei weiche Bänder, wie in einem Atlas
    const band = clamp(5 + 2.2 * Math.log2(k * 4), 3, 18);
    ctx.strokeStyle = T.shallow2;
    ctx.lineWidth = band * 2 * u;
    ctx.stroke(land);
    ctx.strokeStyle = T.shallow;
    ctx.lineWidth = band * u;
    ctx.stroke(land);
    ctx.fillStyle = T.land;
    ctx.fill(land, 'nonzero');
    // ab hier nur noch an Land: Länderfarben, Ortsflächen und Grenzen reichen nie ins Wasser
    ctx.save();
    ctx.clip(land, 'nonzero');
    ctx.globalAlpha = this.navi ? 0.65 : 1;
    for (const c of G.countries) {
      if (isOut(c.box, r[0], r[1], r[2], r[3])) continue;
      ctx.fillStyle = T.tints[c.col % T.tints.length];
      ctx.fill(landPath(c.rings, r[0], r[1], r[2], r[3]), 'nonzero');
    }
    ctx.globalAlpha = 1;
    if (k >= 1.5) this.renderTowns(ctx, wx, wy, cw / s, ch / s, k, u);
    // Flüsse und Seen der ganzen Karte (water.js): je Klasse ab ihrem Maßstab, nah so breit wie in echt
    const WG = waterGeo();
    ctx.fillStyle = T.sea;
    ctx.fill(landPath(WG.lakes, r[0], r[1], r[2], r[3]), 'nonzero');
    ctx.strokeStyle = T.sea;
    for (let c = WATER_CLASS.length - 1; c >= 0; c--) {
      const C = WATER_CLASS[c];
      if (k < C.from) continue;
      const fade = C.from > 0 ? clamp((k - C.from) / C.from, 0, 1) : 1;
      const px = Math.max(C.px[0] + (C.px[1] - C.px[0]) * clamp(Math.log2(k / Math.max(C.from, 0.1)) / 5, 0, 1), C.km * k);
      ctx.globalAlpha = fade;
      ctx.lineWidth = px * u;
      ctx.stroke(solidPath(WG.rivers[c], r));
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = T.borderUnder;
    ctx.lineWidth = clamp(2 + Math.log2(k * 4), 2, 6) * u;
    ctx.stroke(solidPath(G.borders, r));
    ctx.strokeStyle = T.border;
    ctx.lineWidth = 1.3 * u;
    ctx.setLineDash([5 * u, 3.5 * u]);
    strokeDashed(ctx, G.borders, r);
    ctx.setLineDash([]);
    ctx.restore();
    ctx.strokeStyle = T.coast;
    ctx.lineWidth = clamp(0.6 + 0.25 * Math.log2(k * 8), 0.6, 1.6) * u;
    ctx.stroke(land);
    // Verkehrswege: Fähren, Züge (und in der Weltansicht Flüge) gestrichelt, dann Straßen (erst alle Ränder)
    const NG = netGeo();
    const vis = this.navi ? visiblePlaces(b) : menuLayout(b, measureText).shown;
    const keep = this.keep;
    const R = roadsShown(k, vis, keep, this.navi);
    const { wa, wl, wz } = R;
    ctx.lineWidth = clamp(1 + 0.3 * Math.log2(k * 8), 1, 2.4) * u;
    ctx.setLineDash([5 * u, 4 * u]);
    ctx.strokeStyle = T.ferry;
    strokeDashed(ctx, NG.faehre, r);
    ctx.strokeStyle = T.rail;
    strokeDashed(ctx, NG.zug, r);
    if (k < 0.2 && !this.navi) {
      ctx.globalAlpha = clamp((0.2 - k) / 0.1, 0, 1) * 0.75;
      ctx.lineWidth = 1.2 * u;
      ctx.strokeStyle = T.flight;
      ctx.setLineDash([3 * u, 4 * u]);
      strokeDashed(ctx, NG.flug, r);
      ctx.globalAlpha = 1;
    }
    ctx.setLineDash([]);
    const zub = R.zub ? solidPath(NG.zub, r, R.zub) : null;
    const lan = R.land ? solidPath(NG.land, r, R.land) : null;
    const ab = solidPath(NG.ab, r);
    if (zub) {
      ctx.strokeStyle = T.roadCase;
      ctx.lineWidth = (wz + 1.4) * u;
      ctx.stroke(zub);
    }
    if (lan) {
      ctx.strokeStyle = T.roadCase;
      ctx.lineWidth = (wl + 1.6) * u;
      ctx.stroke(lan);
    }
    ctx.strokeStyle = T.hwyCase;
    ctx.lineWidth = (wa + (wa > 1.6 ? 1.8 : 0)) * u;
    ctx.stroke(ab);
    if (zub) {
      ctx.strokeStyle = T.road;
      ctx.lineWidth = wz * u;
      ctx.stroke(zub);
    }
    if (lan) {
      ctx.strokeStyle = T.road;
      ctx.lineWidth = wl * u;
      ctx.stroke(lan);
    }
    if (wa > 1.6) {
      ctx.strokeStyle = T.hwy;
      ctx.lineWidth = wa * u;
      ctx.stroke(ab);
    }
    // Ortspunkte
    const bs = bucketScale(b);
    const big = this.navi ? 1.3 : 1;
    const dots = keep ? [...vis, ...[...keep.places].filter((i) => !vis.has(i))] : vis;
    for (const i of dots) {
      const p = PLACE_BY_INDEX[i];
      const rr = dotRadius(p, bs) * big * u;
      if (p.x + rr < wx || p.y + rr < wy || p.x - rr > wx + cw / s || p.y - rr > wy + ch / s) continue;
      const city = isCity(p);
      ctx.beginPath();
      ctx.arc(p.x, p.y, rr, 0, Math.PI * 2);
      ctx.fillStyle = city ? T.city : T.dot;
      ctx.fill();
      ctx.lineWidth = (city ? 1.8 : 1.5) * big * u;
      ctx.strokeStyle = city ? T.cityRing : T.dotRing;
      ctx.stroke();
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (!this.navi && this.labels) this.renderLabels(ctx, wx, wy, s, cw, ch, ps, b, dx, dy);
    ctx.restore();
    this.stats.ms = performance.now() - t0;
  }

  /**
   * Eingebrannte Beschriftung der großen Karte (menuLabels), soweit sie in das Rechteck ragt. at(l, x0, y0) → [x0, y0]
   * oder null darf einen Kasten verschieben oder weglassen (linke obere Ecke in Bildpunkten der Leinwand); extra: weitere
   * Namen (placeLabel).
   */
  renderLabels(ctx, wx, wy, s, cw, ch, ps, b, dx = 0, dy = 0, at = null, extra = []) {
    const T = this.T;
    ctx.lineJoin = 'round';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    for (const l of [...menuLayout(b, measureText).labels, ...extra]) {
      let x0 = (l.x - wx) * s + l.dx * ps;
      let y0 = (l.y - wy) * s + l.dy * ps;
      if (x0 > cw || y0 > ch || x0 + l.w * ps < 0 || y0 + l.h * ps < 0) continue;
      if (at) {
        const q = at(l, x0, y0);
        if (!q) continue;
        [x0, y0] = q;
      }
      ctx.setTransform(ps, 0, 0, ps, dx + x0, dy + y0);
      if (l.kind === 'shield') drawShield(ctx, l.text, l.w / 2, l.h / 2, l.h, 'ab');
      else if (l.kind === 'faehre' || l.kind === 'zug' || l.kind === 'flug') drawTransitBadge(ctx, l.kind, l.w / 2, l.h / 2, BADGE_R, T.badge);
      else {
        ctx.font = l.font;
        ctx.letterSpacing = l.kind === 'country' ? '2px' : l.kind === 'sea' ? '1px' : '0px';
        ctx.textAlign = l.kind === 'place' ? 'left' : 'center';
        const x = l.kind === 'place' ? 1 : l.w / 2;
        if (l.kind === 'place') {
          ctx.lineWidth = 3;
          ctx.strokeStyle = T.halo;
          ctx.strokeText(l.text, x, l.h / 2);
        }
        ctx.fillStyle = l.kind === 'country' ? T.countryText : l.kind === 'sea' ? T.seaText : T.text;
        ctx.fillText(l.text, x, l.h / 2);
        ctx.letterSpacing = '0px';
      }
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  /** Ortsflächen (weiche Flecken nach Einwohnern) und, ganz nah, ein Gewirr aus Straßen wie Häuserblöcke. */
  renderTowns(ctx, wx, wy, ww, wh, k, u) {
    const T = this.T;
    for (const p of PLACES) {
      const R = townKm(p.pop) / kmPerUnit(p.y);
      if (p.x + R < wx || p.y + R < wy || p.x - R > wx + ww || p.y - R > wy + wh) continue;
      if (townKm(p.pop) * k < 2.5) continue;
      // leicht unrunder Fleck: zehn Stützpunkte mit festem Zufall je Ort, weich verbunden
      const pts = [];
      for (let j = 0; j < 10; j++) {
        const a = (j / 10) * Math.PI * 2;
        const rr = R * (0.8 + 0.34 * hash01(p.i * 31 + j));
        pts.push(p.x + Math.cos(a) * rr, p.y + Math.sin(a) * rr);
      }
      const blob = new Path2D();
      smoothRing(blob, pts);
      ctx.fillStyle = T.town;
      ctx.fill(blob);
      ctx.strokeStyle = T.townEdge;
      ctx.lineWidth = 1.2 * u;
      ctx.stroke(blob);
    }
  }

  /**
   * Statische Ebenen für eine gedrehte Ansicht aus einem zwischengespeicherten Ausschnitt (Navi im Auto). Der Ausschnitt
   * entsteht neu, wenn die Ansicht ihn verlässt oder die Maßstabsstufe wechselt. ps = Bildpunkte je CSS-Bildpunkt.
   * Liefert true, wenn der Ausschnitt gerade neu gezeichnet wurde.
   */
  drawRotated(ctx, view, ps = 1, alpha = 1) {
    const b = bucketOf(view.scale);
    const bs = bucketScale(b);
    // ein Kreis um den Bezugspunkt, der das ganze (gedrehte) Bild enthält
    const R = Math.hypot(Math.max(view.ox, view.w - view.ox), Math.max(view.oy, view.h - view.oy)) / view.scale;
    let c = this.cache;
    let fresh = false;
    if (!c || c.b !== b || Math.abs(view.x - c.x) + R > c.half || Math.abs(view.y - c.y) + R > c.half) {
      const half = R * 1.45;
      const size = Math.ceil(2 * half * bs * ps);
      if (!c || c.canvas.width < size) c = { canvas: newCanvas(size, size) };
      c.size = size;
      c.b = b;
      c.x = view.x;
      c.y = view.y;
      c.half = half;
      this.renderStatic(c.canvas.getContext('2d'), c.x - half, c.y - half, bs * ps, size, size, ps, b);
      this.cache = c;
      this.stats.cache++;
      fresh = true;
    }
    // Ausschnitt gedreht und passend skaliert auf das Bild legen
    const k = view.scale / bs / ps;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(view.ox, view.oy);
    ctx.rotate(view.rot);
    ctx.scale(k, k);
    ctx.translate((c.x - c.half - view.x) * bs * ps, (c.y - c.half - view.y) * bs * ps);
    ctx.drawImage(c.canvas, 0, 0, c.size, c.size, 0, 0, c.size, c.size);
    ctx.restore();
    return fresh;
  }

  /**
   * Statische Ebenen in der schrägen Sicht des Navis (tv: TiltView aus persp.js): nordausgerichtete Ausschnitte um den
   * sichtbaren Boden ab Bildzeile yTop, mit WebGL genau perspektivisch aufs Bild gelegt (warp.js); darüber die Farbe
   * fog ([r, g, b] 0…1, der Aufrufer legt dort seinen Dunst darüber). Zwei Ausschnitte: vorn im Maßstab der Ansicht
   * und, wenn reserve > 0, eine Reserve im Maßstab reserve (Bildpunkte je Einheit), auf den die Ansicht hinauszoomt –
   * derselbe Boden, um das Auto gestreckt. Zoomt die Ansicht schneller hinaus, als der vordere Ausschnitt nachkommt,
   * deckt die Reserve den Rand (erst unscharf, am Ende genau). Jeder nächste Ausschnitt entsteht stückweise im Voraus,
   * je Bild höchstens budget ms und mindestens ein Stück; in einem Bild ganz nur, wenn sonst nichts den Boden deckt
   * (das erste Bild). Liefert false ohne WebGL (dann zeichnet der Aufrufer flach mit drawRotated). ctx = null: nur
   * vorbereiten (während die Nahansicht die Karte verdeckt), damit alles da ist, wenn sie zurückkommt; front = false:
   * dabei nur die Reserve.
   */
  drawTilted(ctx, tv, { fog = [0, 0, 0], yTop = 0, ps = 1, budget = 3, reserve = 0, front = true } = {}) {
    const view = tv.view;
    const W = Math.round(view.w * ps);
    const H = Math.round(view.h * ps);
    if (this.warp === undefined) this.warp = Warp.create(W, H);
    const wp = this.warp;
    if (!wp || !wp.ready) return false;
    // WebGL verloren und wieder da: Die Texturen sind leer, also alle Ausschnitte neu bauen und hochladen
    if (wp.gen && wp.gen !== this.warpGen) {
      this.warpGen = wp.gen;
      this.lv = [null, null];
      this.jobs = [null, null];
    }
    wp.resize(W, H);
    const box = tv.bounds(16, yTop + 16);
    const side = Math.max(box[2] - box[0], box[3] - box[1]);
    const inside = (c, B, m) => !!c && B[0] >= c.x0 + m && B[1] >= c.y0 + m && B[2] <= c.x1 - m && B[3] <= c.y1 - m;
    // Bewegung des Bodens je Bild (für den Vorlauf des nächsten vorderen Ausschnitts)
    const mx = (box[0] + box[2]) / 2;
    const my = (box[1] + box[3]) / 2;
    const vel = this.tiltVel || (this.tiltVel = { x: mx, y: my, vx: 0, vy: 0 });
    const jump = Math.hypot(mx - vel.x, my - vel.y) > side;
    vel.vx = jump ? 0 : vel.vx * 0.8 + (mx - vel.x) * 0.2;
    vel.vy = jump ? 0 : vel.vy * 0.8 + (my - vel.y) * 0.2;
    vel.x = mx;
    vel.y = my;
    const L = this.lv;
    const J = this.jobs;
    // vorn: Maßstabsstufe der Ansicht mit Rückhalt (die gezeigte bleibt, solange sie höchstens 3/4 Stufe abweicht)
    const bz = Math.log2(view.scale) * 2;
    let b = Math.round(bz);
    if (L[0] && Math.abs(bz - L[0].b) < 0.75) b = L[0].b;
    if (J[0] && (!front || J[0].b !== b || !inside(J[0], box, 0))) J[0] = null;
    if (front && !J[0] && !(L[0] && !L[0].stale && L[0].b === b && inside(L[0], box, side * 0.07))) J[0] = this.tiltJob(0, box, b, ps, vel);
    // Reserve, nur wenn sie deutlich gröber ist als die Ansicht (sonst bleibt die alte, wie sie ist)
    let rbox = null;
    if (reserve > 0 && reserve < view.scale * 0.7) {
      const f = view.scale / reserve;
      rbox = [view.x + (box[0] - view.x) * f, view.y + (box[1] - view.y) * f, view.x + (box[2] - view.x) * f, view.y + (box[3] - view.y) * f];
      const br = Math.round(Math.log2(reserve) * 2);
      if (J[1] && (J[1].b !== br || !inside(J[1], rbox, 0))) J[1] = null;
      if (!J[1] && !(L[1] && !L[1].stale && L[1].b === br && inside(L[1], rbox, side * f * 0.07))) J[1] = this.tiltJob(1, rbox, br, ps, null);
    } else J[1] = null;
    // Arbeit im Zeitbudget: zuerst die Reserve, wenn sie den Boden nach dem Hinauszoomen noch nicht deckt, sonst vorn;
    // alles in einem Bild nur, wenn gar nichts den Boden deckt
    const covers = (l) => inside(l, box, -side * 0.02);
    const must = ctx && !covers(L[0]) && !covers(L[1]);
    const order = J[1] && !inside(L[1], rbox, 0) ? [1, 0] : [0, 1];
    const t0 = performance.now();
    let n = 0;
    for (const i of order) {
      const job = J[i];
      if (!job) continue;
      while (job.next < job.tiles.length && ((must && i === 0) || n === 0 || performance.now() - t0 < budget)) {
        const [tx, ty] = job.tiles[job.next++];
        this.renderStatic(job.ctx, job.x0 + tx / job.kc, job.y0 + ty / job.kc, job.kc, TILT_TILE, TILT_TILE, ps, job.b, tx, ty);
        n++;
      }
      if (job.next < job.tiles.length) continue;
      wp.upload(i, job.canvas);
      L[i] = { b: job.b, kc: job.kc, x0: job.x0, y0: job.y0, x1: job.x1, y1: job.y1 };
      J[i] = null;
      if (i === 1) {
        // die Reserve kommt selten neu: ihre Leinwand nicht aufheben
        job.canvas.width = job.canvas.height = 0;
        this.jobCanvas[1] = null;
      }
      this.stats.cache++;
    }
    if (!ctx) return !!(L[0] || L[1]);
    const cs = Math.cos(view.rot);
    const sn = Math.sin(view.rot);
    const lv = L.map((l) => {
      if (!l) return null;
      const m = l.kc / view.scale;
      return { p0: [(view.x - l.x0) * l.kc, (view.y - l.y0) * l.kc], a: [m * cs, -m * sn], b: [-m * sn, -m * cs] };
    });
    const cv = wp.draw(tv.cam, ps, lv, fog, [yTop - 1, yTop]);
    if (!cv) return false;
    ctx.drawImage(cv, 0, 0, W, H, 0, 0, view.w, view.h);
    return true;
  }

  /** Kann dieser Zeichner schräg zeichnen (WebGL vorhanden)? Legt dafür die Zeichenfläche an. */
  canTilt() {
    if (this.warp === undefined) this.warp = Warp.create(16, 16);
    return !!(this.warp && this.warp.ready);
  }

  /**
   * Auftrag für Ausschnitt i (0 vorn, 1 Reserve): Quadrat um den Boden box, Stücke nach Nähe zur Mitte; vel = Bewegung
   * des Bodens je Bild (Vorlauf) oder null.
   */
  tiltJob(i, box, b, ps, vel) {
    const TS = TILT_TILE;
    let kc = bucketScale(b) * ps;
    // ganze Stücke (so passt die Leinwand meist zur vorigen und das Hochladen nimmt nur, was gebraucht wird), höchstens
    // fünf je Seite (sehr flache Sicht auf große Gebiete: dann etwas gröber)
    const need = Math.max(box[2] - box[0], box[3] - box[1]) * 1.4 * kc;
    const size = Math.min(Math.ceil(need / TS), 5) * TS;
    if (need > size) kc *= size / need;
    const side = size / kc;
    // Vorlauf: so weit, wie der Boden sich bewegt, bis alle Stücke fertig sind (höchstens ein Achtel der Seite)
    let cx = (box[0] + box[2]) / 2;
    let cy = (box[1] + box[3]) / 2;
    if (vel) {
      const n = (size / TS) ** 2;
      const lead = Math.min(1, (side * 0.125) / (Math.hypot(vel.vx, vel.vy) * n * 2 || 1e-9));
      cx += vel.vx * n * 2 * lead;
      cy += vel.vy * n * 2 * lead;
    }
    let canvas = this.jobCanvas[i];
    if (!canvas || canvas.width !== size) canvas = this.jobCanvas[i] = newCanvas(size, size);
    const tiles = [];
    for (let ty = 0; ty < size; ty += TS) for (let tx = 0; tx < size; tx += TS) tiles.push([tx, ty]);
    const mid = (size - TS) / 2;
    tiles.sort((p, q) => Math.hypot(p[0] - mid, p[1] - mid) - Math.hypot(q[0] - mid, q[1] - mid));
    const x0 = cx - side / 2;
    const y0 = cy - side / 2;
    return { b, kc, size, x0, y0, x1: x0 + side, y1: y0 + side, canvas, ctx: canvas.getContext('2d'), tiles, next: 0 };
  }

  /**
   * Statische Ebenen einer nordausgerichteten Ansicht aus Kacheln (große Karte). Fehlende Kacheln werden je Bild nur
   * bis zum Zeitbudget gezeichnet; bis dahin springen gröbere oder feinere Kacheln ein. Liefert true, wenn alles fertig ist.
   */
  drawTiles(ctx, view, ps = 1, budgetMs = 6) {
    const size = ps >= 1.5 ? 512 : 256; // Kachelgröße in Bildpunkten der Leinwand
    const b = bucketOf(view.scale);
    const bs = bucketScale(b) * ps; // Kachel-Bildpunkte je Karteneinheit
    const tw = size / bs; // Kachelbreite in Karteneinheiten
    const [x0, y0, x1, y1] = view.bounds(2);
    const i0 = Math.floor(x0 / tw);
    const i1 = Math.floor(x1 / tw);
    const j0 = Math.floor(y0 / tw);
    const j1 = Math.floor(y1 / tw);
    const t0 = performance.now();
    let done = true;
    const sx = (wx) => Math.round((view.ox + (wx - view.x) * view.scale) * ps);
    const sy = (wy) => Math.round((view.oy + (wy - view.y) * view.scale) * ps);
    this.frame++;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = true;
    const need = [];
    for (let i = i0; i <= i1; i++) {
      for (let j = j0; j <= j1; j++) {
        const key = size + ':' + b + ':' + i + ':' + j;
        let t = this.tiles.get(key);
        if (!t) {
          if (performance.now() - t0 < budgetMs) {
            t = { canvas: newCanvas(size, size), used: 0 };
            this.renderStatic(t.canvas.getContext('2d'), i * tw, j * tw, bs, size, size, ps, b);
            this.tiles.set(key, t);
            this.stats.tiles++;
          } else {
            done = false;
            need.push([i, j]);
            continue;
          }
        }
        t.used = this.frame;
        const X0 = sx(i * tw);
        const Y0 = sy(j * tw);
        ctx.drawImage(t.canvas, X0, Y0, sx((i + 1) * tw) - X0, sy((j + 1) * tw) - Y0);
      }
    }
    // Lücken mit der nächsten vorhandenen Stufe füllen (kurz unscharf, aber ohne Löcher)
    for (const [i, j] of need) this.fillGap(ctx, ps, size, b, i * tw, j * tw, tw, sx, sy);
    ctx.restore();
    // Zeit übrig: eine Kachel des Rings rund um das Bild vorbereiten (Verschieben bleibt dann flüssig)
    if (done && performance.now() - t0 < budgetMs * 0.5) {
      ring: for (let i = i0 - 1; i <= i1 + 1; i++) {
        for (let j = j0 - 1; j <= j1 + 1; j++) {
          const key = size + ':' + b + ':' + i + ':' + j;
          if (this.tiles.has(key)) continue;
          const t = { canvas: newCanvas(size, size), used: this.frame };
          this.renderStatic(t.canvas.getContext('2d'), i * tw, j * tw, bs, size, size, ps, b);
          this.tiles.set(key, t);
          this.stats.tiles++;
          break ring;
        }
      }
    }
    // alte Kacheln verwerfen: gut zwei Bildschirme voll, aber höchstens TILE_BYTES (bei 512er-Kacheln auf einem großen
    // Bildschirm wären das sonst über 200 MB); das Bild samt Ring bleibt immer
    const ring = (i1 - i0 + 3) * (j1 - j0 + 3);
    const keep = Math.max(24, ring, Math.min(Math.ceil(ring * 2.5), Math.floor(TILE_BYTES / (size * size * 4))));
    if (this.tiles.size > keep + 8) this.trim(keep);
    return done;
  }

  /**
   * Kacheln freigeben, bis n übrig sind (die zuletzt gebrauchten bleiben). Die Leinwand einer verworfenen Kachel wird
   * sofort leer: Safari zählt den Speicher jeder Leinwand gegen eine feste Grenze, bis sie aufgeräumt ist.
   */
  trim(n = 0) {
    if (this.tiles.size <= n) return;
    const old = [...this.tiles].sort((a, c) => a[1].used - c[1].used).slice(0, this.tiles.size - n);
    for (const [key, t] of old) {
      this.tiles.delete(key);
      t.canvas.width = t.canvas.height = 0;
    }
  }
  fillGap(ctx, ps, size, b, wx, wy, tw, sx, sy) {
    for (const db of [-1, 1, -2, 2, -3, 3, -4, 4]) {
      const b2 = b + db;
      const tw2 = size / (bucketScale(b2) * ps);
      const i = Math.floor((wx + tw / 2) / tw2);
      const j = Math.floor((wy + tw / 2) / tw2);
      const t = this.tiles.get(size + ':' + b2 + ':' + i + ':' + j);
      if (!t) continue;
      // Ausschnitt der Kachel, der die Lücke deckt
      const f = size / tw2;
      const u0 = clamp((wx - i * tw2) * f, 0, size);
      const v0 = clamp((wy - j * tw2) * f, 0, size);
      const u1 = clamp((wx + tw - i * tw2) * f, 0, size);
      const v1 = clamp((wy + tw - j * tw2) * f, 0, size);
      if (u1 - u0 < 1 || v1 - v0 < 1) continue;
      const X0 = sx(i * tw2 + u0 / f);
      const Y0 = sy(j * tw2 + v0 / f);
      ctx.drawImage(t.canvas, u0, v0, u1 - u0, v1 - v0, X0, Y0, sx(i * tw2 + u1 / f) - X0, sy(j * tw2 + v1 / f) - Y0);
      return;
    }
    // gar nichts da: wenigstens Meer
    ctx.fillStyle = this.T.sea;
    const X0 = sx(wx);
    const Y0 = sy(wy);
    ctx.fillRect(X0, Y0, sx(wx + tw) - X0, sy(wy + tw) - Y0);
  }
}
