// Der Weg auf der Landkarte: Aus den Abschnitten der Fahrt (src/game/trip.js) wird ein durchgehender Linienzug in
// Kartenkoordinaten, auf dem das Auto fährt. Autobahn und Landstraße folgen den Kanten der Karte; was im Spiel am
// Knoten geschieht (Rampe, Zubringer, Ortsdurchfahrt, Auffahrt, Terminal), bekommt eine kleine, weiche Kurve in
// Kilometergröße, damit das Navi aus der Nähe wie eine echte Ausfahrt aussieht. Jeder Abschnitt wird einmal gebaut
// und bleibt dann fest (sonst spränge das Auto, wenn alte Abschnitte wegfallen).
//
// NavModel hält dazu, was Navi, große Karte und HUD-Zeile brauchen: Lage und Kurs des Autos (über eine Sehne
// geglättet, damit der Kurs an Knicken nicht zuckt), die geplante Route bis zum Ziel, den gefahrenen Weg, die Orte
// entlang der Route, Überfahrten (Fähre, Autozug, Flug) als Hüpfer und die Ansage für das Navi. Läuft auch unter Node.
import { nodes, places, deKind, deTo, deRoad, deTowards, stateOfNode, nodeTitle } from './graph.js';
import { project, edgeLine, kmPerUnit, polyLength, PLACE_BY_INDEX, townKm } from './mapview.js';
import { PARKS, parkBoard, postName } from './parks.js';
import { goalName } from '../world/kit/layout.js';
import { riverOfSec, riverSpan } from './rivers.js';
import { sectionWater, zubLine, townEdgeDir, townRiverOnMap, lineWater } from './crossings.js';
export { waterAlong } from './crossings.js';
import { WATER_CLASS } from './water.js';
/**
 * Steht der Name des Wassers r (NavModel.rivers) beim Maßstab scale (Bildpunkte je Karteneinheit) auf der Karte? Erst,
 * wenn sein Fluss deutlich gezeichnet ist (mapview.js: ab WATER_CLASS[cls].from), und nie weiter weg als 0,5 px/km.
 */
export function waterLabelOk(r, scale) {
  const k = scale / kmPerUnit(r.y);
  return k >= Math.max(0.5, r.cls < 3 ? WATER_CLASS[r.cls].from * 2 : 0);
}

const NODE_XY = nodes.map((n) => project(n.lat, n.lon));
/** Kilometer → Karteneinheiten in der Kartenhöhe y. */
const ku = (km, y) => km / kmPerUnit(y);
/**
 * Gefahrener Weg (NavModel.trail): ein Punkt je km Kilometer, höchstens max Zahlen (x und y je Punkt); darüber wird er
 * vor den letzten tail Zahlen (gut 60 km, dicht für die Nahansicht des Navis) gleichmäßig ausgedünnt, bis höchstens
 * keep davon übrig sind.
 */
export const TRAIL = { km: 0.04, max: 12000, keep: 0.6, tail: 3000 };
const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
function unit(x, y) {
  const l = Math.hypot(x, y);
  return l > 1e-12 ? [x / l, y / l] : [0, -1];
}

const revCache = new Map();
/** Gerichtete Kante als Linienzug (Kartenkoordinaten, vom Start- zum Zielknoten). */
export function dePts(de) {
  const L = edgeLine(de >> 1);
  if (!(de & 1)) return L;
  let c = revCache.get(de);
  if (!c || c.src !== L) {
    const n = L.length / 2;
    const R = new Float64Array(L.length);
    for (let i = 0; i < n; i++) {
      R[i * 2] = L[(n - 1 - i) * 2];
      R[i * 2 + 1] = L[(n - 1 - i) * 2 + 1];
    }
    c = { src: L, pts: R };
    if (revCache.size > 64) revCache.delete(revCache.keys().next().value);
    revCache.set(de, c);
  }
  return c.pts;
}

/** Punkt und Richtung im Abstand a (Karteneinheiten) vom Anfang eines Linienzugs. */
function pointAlong(P, a) {
  let rest = Math.max(a, 0);
  for (let i = 2; i < P.length; i += 2) {
    const d = Math.hypot(P[i] - P[i - 2], P[i + 1] - P[i - 1]);
    if (rest <= d || i === P.length - 2) {
      const t = d > 0 ? Math.min(rest / d, 1) : 0;
      const [dx, dy] = unit(P[i] - P[i - 2], P[i + 1] - P[i - 1]);
      return { x: P[i - 2] + (P[i] - P[i - 2]) * t, y: P[i - 1] + (P[i + 1] - P[i - 1]) * t, dx, dy, i: i / 2 - 1 };
    }
    rest -= d;
  }
  return { x: P[0], y: P[1], dx: 0, dy: -1, i: 0 };
}
/** Nächster Punkt auf dem Linienzug in dessen ersten maxA Einheiten: Segment i, Punkt, Abstand. */
function nearestOn(P, x, y, maxA) {
  let best = { i: 0, x: P[0], y: P[1], d: Math.hypot(P[0] - x, P[1] - y) };
  let a = 0;
  for (let i = 2; i < P.length && a <= maxA; i += 2) {
    const ax = P[i - 2];
    const ay = P[i - 1];
    const vx = P[i] - ax;
    const vy = P[i + 1] - ay;
    const L2 = vx * vx + vy * vy;
    const tMax = L2 > 0 ? Math.min(1, (maxA - a) / Math.sqrt(L2)) : 0;
    const t = L2 > 0 ? clamp(((x - ax) * vx + (y - ay) * vy) / L2, 0, tMax) : 0;
    const qx = ax + vx * t;
    const qy = ay + vy * t;
    const d = Math.hypot(qx - x, qy - y);
    if (d < best.d) best = { i: i / 2 - 1, x: qx, y: qy, d };
    a += Math.sqrt(L2);
  }
  return best;
}

/** Bogenlänge bis zum Punkt j (von nearestOn) auf dem Linienzug. */
function arcAt(P, j) {
  let a = 0;
  for (let i = 0; i < j.i; i++) a += Math.hypot(P[i * 2 + 2] - P[i * 2], P[i * 2 + 3] - P[i * 2 + 1]);
  return a + Math.hypot(j.x - P[j.i * 2], j.y - P[j.i * 2 + 1]);
}
/**
 * Wo der Weg vom Stift auf die Straße E (Linienzug ab ihrem Knoten) kommt: minA hinter dem Knoten oder, wenn der
 * Stift schon dicht neben E in deren Richtung fährt, 0,3 km vor ihm. Das ist der Fall, wenn der Knoten mitten im Ort
 * liegt und der Weg schon aus dem Ort heraus führt; zurück zum Knoten ginge es nur mit einer Wende.
 */
function joinPoint(E, pen, minA, y, cap = Infinity) {
  const j = nearestOn(E, pen.x, pen.y, Math.min(polyLength(E) * 0.9, cap));
  let a = minA;
  if (j.d < ku(0.8, y)) {
    const [ex, ey] = unit(E[j.i * 2 + 2] - E[j.i * 2], E[j.i * 2 + 3] - E[j.i * 2 + 1]);
    if (pen.dx * ex + pen.dy * ey > 0.3) a = Math.max(minA, arcAt(E, j) + ku(0.3, y));
  }
  return pointAlong(E, Math.min(a, cap));
}
const wetCache = new Map();
/**
 * So weit (Karteneinheiten ab ihrem Knoten) darf der Weg auf die Straße de kommen: bis kurz vor ihr erstes Wasser –
 * sonst überspränge er dessen Brücke (crossings.js sectionWater). Infinity ohne Wasser.
 */
function dryCap(de) {
  let c = wetCache.get(de);
  if (c === undefined) {
    const P = dePts(de);
    const w = lineWater(P);
    c = w.length ? Math.max(w[0].a - (w[0].span || 0) / 2 - ku(0.15, P[1]), 0) : Infinity;
    wetCache.set(de, c);
  }
  return c;
}
/** Führt der Linienzug über kein Wasser der Karte? */
const dry = (pts) => lineWater(pts).length === 0;
/** Den ersten trockenen Weg der Versuche tries ((P) => …, P beginnt am Stift) an out hängen, sonst den letzten. */
function firstDry(out, pen, tries) {
  for (let t = 0; t < tries.length; t++) {
    const P = [pen.x, pen.y];
    tries[t](P);
    if (dry(P) || t === tries.length - 1) {
      for (let i = 2; i < P.length; i++) out.push(P[i]);
      return;
    }
  }
}

/**
 * Wie bez, aber über kein Wasser der Karte (im Ort baut die Welt keine Brücke): erst die Kurve, dann eine flachere,
 * dann über den Punkt via (die Ortsmitte: die Strahlen von ihr zum Rand sind trocken, crossings.js townEdgeDir), zuletzt
 * geradewegs.
 */
function dryBez(out, x0, y0, ax, ay, x1, y1, bx, by, k = 0.4, n = 14, via = null) {
  const tries = [
    (o) => bez(o, x0, y0, ax, ay, x1, y1, bx, by, k, n),
    (o) => bez(o, x0, y0, ax, ay, x1, y1, bx, by, k * 0.35, n),
  ];
  if (via && Math.hypot(via.x - x0, via.y - y0) > 1e-9 && Math.hypot(via.x - x1, via.y - y1) > 1e-9) {
    tries.push((o) => {
      const [vx, vy] = unit(x1 - via.x, y1 - via.y);
      const d = Math.min(Math.hypot(x1 - via.x, y1 - via.y) * 0.15, Math.hypot(x0 - via.x, y0 - via.y));
      o.push(via.x + vx * d, via.y + vy * d, x1, y1);
    });
  }
  tries.push((o) => o.push(x1, y1));
  for (let t = 0; t < tries.length; t++) {
    const P = [x0, y0];
    tries[t](P);
    if (t === tries.length - 1 || lineWater(P).length === 0) {
      for (let i = 2; i < P.length; i++) out.push(P[i]);
      return;
    }
  }
}
/** Kubische Kurve vom Stift (Richtung a) zum Punkt (x1, y1) mit Richtung b (ohne Anfangspunkt). */
function bez(out, x0, y0, ax, ay, x1, y1, bx, by, k = 0.4, n = 14) {
  const d = Math.hypot(x1 - x0, y1 - y0);
  const c1x = x0 + ax * d * k;
  const c1y = y0 + ay * d * k;
  const c2x = x1 - bx * d * k;
  const c2y = y1 - by * d * k;
  for (let i = 1; i <= n; i++) {
    const t = i / n;
    const s = 1 - t;
    out.push(s * s * s * x0 + 3 * s * s * t * c1x + 3 * s * t * t * c2x + t * t * t * x1, s * s * s * y0 + 3 * s * s * t * c1y + 3 * s * t * t * c2y + t * t * t * y1);
  }
}
/** Bogen ab dem Stift: Länge len (Einheiten), Winkel ang (Bogenmaß, positiv = rechts herum). */
function arc(out, x, y, dx, dy, len, ang, n = 10) {
  if (Math.abs(ang) < 1e-4) {
    out.push(x + dx * len, y + dy * len);
    return;
  }
  const r = len / Math.abs(ang);
  const sg = Math.sign(ang);
  const cx = x - dy * r * sg;
  const cy = y + dx * r * sg;
  for (let i = 1; i <= n; i++) {
    const p = (ang * i) / n;
    const c = Math.cos(p);
    const s = Math.sin(p);
    out.push(cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c);
  }
}
/**
 * Wenden im Kreisverkehr ab dem Stift (Richtung h, Halbmesser r): rechts hinein, links herum, rechts hinaus; die
 * Insel liegt r·√3 voraus. Liefert die Richtung danach (entgegen h).
 */
function roundabout(out, hx, hy, r) {
  for (const ang of [Math.PI / 3, (-5 * Math.PI) / 3, Math.PI / 3]) {
    const n = out.length;
    arc(out, out[n - 2], out[n - 1], hx, hy, r * Math.abs(ang), ang, Math.ceil(Math.abs(ang) * 6));
    [hx, hy] = [hx * Math.cos(ang) - hy * Math.sin(ang), hx * Math.sin(ang) + hy * Math.cos(ang)];
  }
  return [hx, hy];
}
/**
 * Kürzester Weg aus Bogen, Gerade, Bogen (Dubins) vom Stift (Richtung d0) zum Punkt (x1, y1) mit Richtung d1 bei
 * Wendekreis r: gleichmäßige Kurven wie auf einer echten Rampe, ohne Spitzen. Hängt die Punkte ohne den Anfang an.
 */
function dubins(out, x0, y0, d0x, d0y, x1, y1, d1x, d1y, r) {
  const TAU = Math.PI * 2;
  const mod = (a) => {
    const m = ((a % TAU) + TAU) % TAU;
    return m > TAU - 1e-7 ? 0 : m;
  };
  const th0 = Math.atan2(d0y, d0x);
  const th1 = Math.atan2(d1y, d1x);
  let best = null;
  for (const s1 of [1, -1]) {
    for (const s2 of [1, -1]) {
      // Mittelpunkte der Wendekreise (s = +1: Winkel wächst, auf der Karte rechts herum)
      const c1x = x0 - s1 * r * d0y;
      const c1y = y0 + s1 * r * d0x;
      const c2x = x1 - s2 * r * d1y;
      const c2y = y1 + s2 * r * d1x;
      const Dx = c2x - c1x;
      const Dy = c2y - c1y;
      const D = Math.hypot(Dx, Dy);
      let tv;
      if (s1 === s2) {
        if (D < 1e-12) continue;
        tv = Math.atan2(Dy, Dx);
      } else {
        if (D < 2 * r) continue;
        tv = Math.atan2(Dy, Dx) - Math.asin(((s2 - s1) * r) / D);
      }
      const vx = Math.cos(tv);
      const vy = Math.sin(tv);
      const t1x = c1x + s1 * r * vy;
      const t1y = c1y - s1 * r * vx;
      const t2x = c2x + s2 * r * vy;
      const t2y = c2y - s2 * r * vx;
      const a1 = s1 > 0 ? mod(tv - th0) : mod(th0 - tv);
      const a2 = s2 > 0 ? mod(th1 - tv) : mod(tv - th1);
      const L = r * (a1 + a2) + Math.hypot(t2x - t1x, t2y - t1y);
      if (!best || L < best.L) best = { L, s1, s2, a1, a2, c1x, c1y, c2x, c2y, t2x, t2y };
    }
  }
  if (!best) {
    bez(out, x0, y0, d0x, d0y, x1, y1, d1x, d1y, 0.4, 12);
    return;
  }
  const { s1, s2, a1, a2, c1x, c1y, c2x, c2y, t2x, t2y } = best;
  const step = 0.2;
  const p0 = Math.atan2(y0 - c1y, x0 - c1x);
  for (let i = 1, n = Math.ceil(a1 / step); i <= n; i++) {
    const p = p0 + (s1 * a1 * i) / n;
    out.push(c1x + r * Math.cos(p), c1y + r * Math.sin(p));
  }
  out.push(t2x, t2y);
  const q0 = Math.atan2(t2y - c2y, t2x - c2x);
  for (let i = 1, n = Math.ceil(a2 / step); i <= n; i++) {
    const p = q0 + (s2 * a2 * i) / n;
    out.push(c2x + r * Math.cos(p), c2y + r * Math.sin(p));
  }
}
function penOf(out) {
  const n = out.length / 2;
  let k = n - 2;
  while (k > 0 && Math.hypot(out[n * 2 - 2] - out[k * 2], out[n * 2 - 1] - out[k * 2 + 1]) < 1e-9) k--;
  const [dx, dy] = unit(out[n * 2 - 2] - out[k * 2], out[n * 2 - 1] - out[k * 2 + 1]);
  return { x: out[n * 2 - 2], y: out[n * 2 - 1], dx, dy };
}
/**
 * Stellen, an denen der Weg eines Abschnitts mit Brücken (crossings.js sectionWater) geteilt wird: jede Stelle der
 * Karte, an der er über Wasser führt, mit dem s, bei dem der Wagen in der Welt über die Mitte der Brücke fährt
 * (zwei Gewässer unter einer Brücke: verteilt über ihre halbe Breite). sec.orig: der ursprüngliche Abschnitt, wenn sec
 * nur sein Rest ab dem Auto ist (recut).
 */
function waterCuts(sec) {
  const base = sec.orig || sec;
  const cuts = [];
  for (const b of sectionWater(base)) {
    const m = b.map.length;
    b.map.forEach((q, j) => cuts.push({ x: q.x, y: q.y, s: base.s0 + b.s + (m > 1 ? (j / (m - 1) - 0.5) * b.half : 0) }));
  }
  return cuts;
}
/**
 * Den Linienzug pts (s0 … s1) an den Stellen cuts (nach s geordnet, auf pts gelegen) in Stücke teilen: Zwischen zwei
 * Stellen rückt das Auto der Karte gleichmäßig vor, an jeder Stelle steht es genau dann, wenn der Wagen dort ist.
 */
function splitPieces(piece, s0, s1, pts, cuts) {
  const out = [];
  let from = [pts[0], pts[1]];
  let k = 0;
  let sPrev = s0;
  for (const c of cuts) {
    if (c.s <= sPrev + 1e-6 || c.s >= s1 - 1e-6) continue;
    let bj = -1;
    let bd = Infinity;
    let bt = 0;
    for (let j = k; j + 3 < pts.length; j += 2) {
      const vx = pts[j + 2] - pts[j];
      const vy = pts[j + 3] - pts[j + 1];
      const L2 = vx * vx + vy * vy;
      const t = L2 > 0 ? clamp(((c.x - pts[j]) * vx + (c.y - pts[j + 1]) * vy) / L2, 0, 1) : 0;
      const d = Math.hypot(pts[j] + vx * t - c.x, pts[j + 1] + vy * t - c.y);
      if (d < bd) {
        bd = d;
        bj = j;
        bt = t;
      }
    }
    if (bj < 0) break;
    const P = from.slice();
    for (let j = k + 2; j <= bj; j += 2) P.push(pts[j], pts[j + 1]);
    const cx = pts[bj] + (pts[bj + 2] - pts[bj]) * bt;
    const cy = pts[bj + 1] + (pts[bj + 3] - pts[bj + 1]) * bt;
    P.push(cx, cy);
    out.push(piece(sPrev, c.s, P));
    from = [cx, cy];
    k = bj;
    sPrev = c.s;
  }
  const P = from.slice();
  for (let j = k + 2; j < pts.length; j += 2) P.push(pts[j], pts[j + 1]);
  if (P.length < 4) P.push(from[0], from[1]);
  out.push(piece(sPrev, s1, P));
  return out;
}
/**
 * Wo die Ortsdurchfahrt sec den Ort verlässt, wenn der folgende Zubringer eine feste Linie hat (crossings.js zubLine:
 * zurück zum Knoten oder weiter zum nächsten Ort): an ihrem Anfang, auf dem Ufer des Ortspunkts. {x, y, tx, ty (in den
 * Ort hinein)} oder null.
 */
function waterExit(sec, next) {
  if (!next || next.kind !== 'zub' || !(sec.place >= 0)) return null;
  if (next.back ? next.place !== sec.place : next.from !== sec.place) return null;
  const z = zubLine(next);
  if (!z) return null;
  const C = PLACE_BY_INDEX[sec.place];
  const [x, y] = [z.P[0], z.P[1]];
  const [tx, ty] = Math.hypot(C.x - x, C.y - y) > z.len * 1e-3 ? unit(C.x - x, C.y - y) : unit(z.P[0] - z.P[2], z.P[1] - z.P[3]);
  return { x, y, tx, ty };
}
/** Trockener Rand des Orts place in Richtung (ox, oy), höchstens R weit (crossings.js townEdgeDir); ohne Ort C + o·R. */
/** So weit führt die Ortsdurchfahrt hinaus zum Ausgang A: bis an den Rand R, höchstens bis A (liegt der Knoten im Ort, ist A ein Punkt auf der nächsten Straße, exitTo). */
const reachTo = (A, C, R) => {
  const d = Math.hypot(A.x - C.x, A.y - C.y);
  return d > 1e-9 ? Math.min(R, d) : R;
};
const dryEdge = (place, C, ox, oy, R) => (place >= 0 ? townEdgeDir(place, ox, oy, R) : { x: C.x + ox * R, y: C.y + oy * R });
const placeXY = (p) => PLACE_BY_INDEX[p];
/** Alles, was sectionPieces vom Nachfolger braucht (gleicher Schlüssel → gleiche Stücke). */
const nextKey = (n) => (n ? [n.kind, n.de, n.node, n.place, n.back ? 1 : 0, n.transitTo ?? -1].join('|') : '');
/** Wendekreis von Rampen und Zubringern auf der Karte (Einheiten). */
const RAMP_R = (y) => ku(0.14, y);
/**
 * Wendekreis zum Punkt P (mit Richtung dx, dy): wie auf Rampen; liegt P aber hinter dem Stift oder führt die neue
 * Straße zurück, eine weite Schleife statt einer Haarnadel.
 */
const turnR = (pen, P, y) =>
  (P.x - pen.x) * pen.dx + (P.y - pen.y) * pen.dy < 0 || (P.dx !== undefined && P.dx * pen.dx + P.dy * pen.dy < -0.5) ? ku(0.3, y) : RAMP_R(y);
/** Halbmesser der Ortsfläche in Karteneinheiten. */
const townR = (p) => ku(townKm(places[p].pop), placeXY(p).y);

/**
 * Kartenstücke eines Abschnitts: [{s0, s1, pts, kind}] (pts beginnt beim Stift). pen = Ende des vorigen Abschnitts
 * {x, y, dx, dy} oder null (erster Abschnitt), next = folgender Abschnitt desselben Wegs (oder undefined), way = die
 * Straße (gerichtete Kante), auf der es danach weitergeht, oder -1: Liegt der Knoten mitten im Ort, verlässt der Weg
 * den Ort in ihre Richtung. inDir = Richtung der Autobahn oder Landstraße, auf der das Auto zuletzt ankam.
 */
export function sectionPieces(sec, pen, next, way = -1, inDir = null) {
  const K = sec.kind;
  // Ohne Vorgänger an einem Fluss (der Weg entsteht neu, während der Wagen schon dort fährt): Der Abschnitt beginnt,
  // wo er es mit Vorgänger täte – sonst läge die Brücke der Karte woanders als die der Welt
  if (!pen) pen = riverPen(sec, next);
  const piece = (s0, s1, pts, kind = K) => ({ s0, s1, pts, kind, sec: sec.id });
  const y0 = pen ? pen.y : NODE_XY[sec.node] ? NODE_XY[sec.node].y : -60;
  /** Wohin der Weg aus dem Ort mit Mitte C und Halbmesser R führt, wenn der Knoten A darin liegt: zur Straße way. */
  // (auf ihr nur bis vor ihr erstes Wasser, dryCap: dort läge ihre Brücke)
  const exitTo = (A, C, R) =>
    way >= 0 && Math.hypot(A.x - C.x, A.y - C.y) < R * 0.5 ? pointAlong(dePts(way), Math.max(Math.min(R * 1.3, dryCap(way) - ku(0.35, C.y)), ku(0.05, C.y))) : A;
  if (K === 'ab' || K === 'land') {
    const P = dePts(sec.de);
    const out = [];
    let i0 = 0;
    if (pen) {
      // an die Kante anschließen (meist steht der Stift schon am Knoten oder am Ende der Auffahrt)
      const cap = dryCap(sec.de);
      let j = nearestOn(P, pen.x, pen.y, Math.min(Math.max(polyLength(P) * 0.5, ku(6, pen.y)), cap));
      out.push(pen.x, pen.y);
      let [dx, dy] = unit(P[j.i * 2 + 2] - P[j.i * 2], P[j.i * 2 + 3] - P[j.i * 2 + 1]);
      // liegt der Anschluss hinter dem Stift (der Ort oder die Verbindung endet jenseits der Straße), wäre der kurze
      // Bogen dorthin eine Haarnadel auf der Stelle
      const behind = j.d > ku(0.03, pen.y) && (j.x - pen.x) * pen.dx + (j.y - pen.y) * pen.dy < 0;
      if (pen.dx * dx + pen.dy * dy < -0.7 || behind) {
        // die Fahrt kehrt am Knoten um (dieselbe Straße zurück): in einer weiten Schleife statt auf der Stelle – führte
        // sie über Wasser (dort baut die Welt keine Brücke), enger oder zur Not geradewegs
        const q = pointAlong(P, Math.min(arcAt(P, j) + ku(0.6, pen.y), cap));
        const tries = [
          (o) => dubins(o, pen.x, pen.y, pen.dx, pen.dy, q.x, q.y, q.dx, q.dy, ku(0.3, pen.y)),
          (o) => dubins(o, pen.x, pen.y, pen.dx, pen.dy, q.x, q.y, q.dx, q.dy, ku(0.08, pen.y)),
          (o) => o.push(q.x, q.y),
        ];
        for (let t = 0; t < tries.length; t++) {
          const Q = [pen.x, pen.y];
          tries[t](Q);
          if (dry(Q) || t === tries.length - 1) {
            for (let i = 2; i < Q.length; i++) out.push(Q[i]);
            break;
          }
        }
        j = { i: q.i, x: q.x, y: q.y };
      } else if (j.d > ku(0.03, pen.y)) {
        const Q = [pen.x, pen.y];
        dubins(Q, pen.x, pen.y, pen.dx, pen.dy, j.x, j.y, dx, dy, ku(0.12, pen.y));
        if (!dry(Q)) Q.length = 2;
        for (let i = 2; i < Q.length; i++) out.push(Q[i]);
        out.push(j.x, j.y);
      } else out.push(j.x, j.y);
      i0 = j.i + 1;
    } else out.push(P[0], P[1]);
    for (let i = Math.max(i0, 1); i < P.length / 2; i++) out.push(P[i * 2], P[i * 2 + 1]);
    return splitPieces(piece, sec.s0, sec.s1, out, waterCuts(sec));
  }
  if (!pen) {
    // erster Abschnitt ohne Vorgänger (Start im Ort): Richtung zum Knoten
    const C = sec.place >= 0 ? placeXY(sec.place) : NODE_XY[sec.node];
    const R = sec.place >= 0 ? townR(sec.place) : ku(0.4, C.y);
    const N = exitTo(NODE_XY[sec.node], C, R);
    const [dx, dy] = Math.hypot(N.x - C.x, N.y - C.y) > 1e-6 ? unit(N.x - C.x, N.y - C.y) : [0, -1];
    const f = sec.spotS !== undefined ? clamp((sec.spotS - sec.s0) / sec.len, 0.05, 0.95) : 0.5;
    // beide Enden auf dem Ufer des Ortspunkts, hinaus am Anfang der Linie des Zubringers, wenn er eine hat
    const A0 = dryEdge(sec.place, C, -dx, -dy, R * 0.7);
    const WX = waterExit(sec, next);
    const X = WX || dryEdge(sec.place, C, dx, dy, reachTo(N, C, R));
    const out1 = [A0.x, A0.y];
    dryBez(out1, A0.x, A0.y, dx, dy, C.x, C.y, dx, dy, 0.3, 6);
    const out2 = [C.x, C.y];
    const [ex, ey] = WX ? [-WX.tx, -WX.ty] : [dx, dy];
    dryBez(out2, C.x, C.y, dx, dy, X.x, X.y, ex, ey, 0.3, 6);
    const sm = sec.s0 + sec.len * f;
    return [piece(sec.s0, sm, out1), piece(sm, sec.s1, out2)];
  }
  const out = [pen.x, pen.y];
  if (K === 'ramp') {
    // die Abfahrt im Bogen hinaus – kürzer und flacher, wenn er sonst über Wasser führte (dort baut die Welt keine Brücke)
    // (mit Platz dahinter: 0,15 km geradeaus trocken, sonst stünde der Zubringer am Ufer); zur Not stärker abbiegend
    const T = [
      [0.32, 0.6],
      [0.2, 0.45],
      [0.2, 1.0],
      [0.15, 1.4],
      [0.12, 0.3],
      [0.06, 0.15],
    ];
    for (let t = 0, done = false; t < T.length * 2 && !done; t++) {
      const [l, a] = T[t % T.length];
      const P = [pen.x, pen.y];
      arc(P, pen.x, pen.y, pen.dx, pen.dy, ku(l, y0), a, 8);
      const n = P.length;
      const h = pen.dx * Math.cos(a) - pen.dy * Math.sin(a);
      const k = pen.dx * Math.sin(a) + pen.dy * Math.cos(a);
      // im ersten Durchgang mit Platz dahinter, im zweiten ohne
      if ((t < T.length ? dry([...P, P[n - 2] + h * ku(0.15, y0), P[n - 1] + k * ku(0.15, y0)]) : dry(P)) || t === T.length * 2 - 1) {
        for (let i = 2; i < n; i++) out.push(P[i]);
        done = true;
      }
    }
    return [piece(sec.s0, sec.s1, out)];
  }
  if (K === 'auf' || (K === 'conn' && next && next.kind === 'auf')) {
    // Verbindungsfahrbahn und Auffahrt: im Bogen auf die neue Autobahn (bei Linksabbiegern als Schleife wie im
    // Kleeblatt); die Auffahrt fädelt danach auf ihr ein
    const de = K === 'auf' ? sec.de : next.de;
    const E = dePts(de);
    const q = K === 'auf' ? joinPoint(E, pen, ku(0.9, y0), y0, dryCap(de)) : pointAlong(E, Math.min(ku(0.6, y0), dryCap(de)));
    // enger, wenn der Bogen sonst über Wasser führte (dort baut die Welt keine Brücke)
    const r0 = turnR(pen, q, y0);
    for (const r of [r0, Math.min(r0, RAMP_R(y0)), RAMP_R(y0) * 0.6]) {
      const P = [pen.x, pen.y];
      dubins(P, pen.x, pen.y, pen.dx, pen.dy, q.x, q.y, q.dx, q.dy, r);
      if (dry(P) || r === RAMP_R(y0) * 0.6) {
        for (let i = 2; i < P.length; i++) out.push(P[i]);
        break;
      }
    }
    return [piece(sec.s0, sec.s1, out)];
  }
  if (K === 'conn') {
    // Verbindung zu einem Ort, einem Terminal oder einer Landstraße: im Bogen dorthin (höchstens halb so weit wie
    // das Ziel, höchstens 0,6 km), den Rest übernimmt der nächste Abschnitt
    let T = NODE_XY[sec.node];
    if (next && next.kind === 'zub' && next.place >= 0 && !next.transitTo) T = placeXY(next.place);
    const d = Math.hypot(T.x - pen.x, T.y - pen.y);
    // liegt das Ziel hinter uns (Knoten mitten im Ort), geradeaus weiter: die Schleife zurück fährt der Zubringer
    if (d > ku(0.1, y0) && (T.x - pen.x) * pen.dx + (T.y - pen.y) * pen.dy > 0) {
      const [tx, ty] = unit(T.x - pen.x, T.y - pen.y);
      // kürzer, wenn der Bogen sonst über Wasser führte (dort baut die Welt keine Brücke)
      for (const f of [1, 0.5, 0.25]) {
        const L = Math.min(d * 0.5, ku(0.6, y0)) * f;
        const P = [pen.x, pen.y];
        dubins(P, pen.x, pen.y, pen.dx, pen.dy, pen.x + tx * L, pen.y + ty * L, tx, ty, RAMP_R(y0) * Math.max(f, 0.5));
        if (dry(P) || f === 0.25) {
          for (let i = 2; i < P.length; i++) out.push(P[i]);
          break;
        }
      }
    } else arc(out, pen.x, pen.y, pen.dx, pen.dy, ku(0.3, y0), 0, 1);
    return [piece(sec.s0, sec.s1, out)];
  }
  if (K === 'zub') {
    const zw = zubLine(sec.orig || sec);
    const wet = !!(zw && zw.list.length);
    const first = wet ? zw.list[0].a - (zw.list[0].span || 0) / 2 : Infinity;
    if (zw && !sec.back) {
      // hin auf der festen Linie (crossings.js zubLine: vom Knoten oder vom Ort davor zum Ortsrand), über ihre Brücken
      // bis an den Rand. Ohne Wasser darauf bleibt es bei den Schleifen unten, wenn der Knoten im Ort liegt.
      const C = placeXY(sec.place);
      const R = townR(sec.place);
      const d = Math.hypot(pen.x - C.x, pen.y - C.y);
      const loop = (inDir && d < R + ku(0.8, y0) && (C.x - pen.x) * pen.dx + (C.y - pen.y) * pen.dy < 0) || d < R * 0.6;
      if (wet || !loop) {
        const Z = zw.P;
        const [lx, ly] = unit(Z[2] - Z[0], Z[3] - Z[1]);
        const along = (pen.x - Z[0]) * lx + (pen.y - Z[1]) * ly;
        // möglichst weit voraus auf die Linie (ein weiter Bogen, keine Haarnadel), aber vor ihrem ersten Wasser
        const ja = clamp(Math.max(along, 0) + ku(1.0, y0), 0, Math.min(first - ku(0.12, y0), zw.len * 0.6));
        if (ja > along + ku(0.002, y0) || Math.hypot(pen.x - (Z[0] + lx * along), pen.y - (Z[1] + ly * along)) > ku(0.005, y0)) {
          dubins(out, pen.x, pen.y, pen.dx, pen.dy, Z[0] + lx * Math.max(ja, along), Z[1] + ly * Math.max(ja, along), lx, ly, RAMP_R(y0));
        }
        out.push(Z[2], Z[3]);
        return wet ? splitPieces(piece, sec.s0, sec.s1, out, waterCuts(sec)) : [piece(sec.s0, sec.s1, out)];
      }
    }
    if (wet && sec.back) {
      // zurück über Wasser auf der festen Linie: vom Ortsrand über ihre Brücken, ein Stück hinter dem letzten Wasser
      // weiter wie jeder Zubringer zurück (das Stück davor wird unten mit angehängt)
      const Z = zw.P;
      const [lx, ly] = unit(Z[2] - Z[0], Z[3] - Z[1]);
      const along = (pen.x - Z[0]) * lx + (pen.y - Z[1]) * ly;
      const last = zw.list[zw.list.length - 1];
      const end = Math.min(last.a + (last.span || 0) / 2 + ku(0.25, y0), zw.len);
      if (along < end) {
        const ja = Math.min(Math.max(along, 0) + ku(0.05, y0), first - ku(0.05, y0), end);
        if (Math.hypot(pen.x - (Z[0] + lx * ja), pen.y - (Z[1] + ly * ja)) > ku(0.005, y0)) dubins(out, pen.x, pen.y, pen.dx, pen.dy, Z[0] + lx * ja, Z[1] + ly * ja, lx, ly, RAMP_R(y0));
        out.push(Z[0] + lx * end, Z[1] + ly * end);
        pen = { x: Z[0] + lx * end, y: Z[1] + ly * end, dx: lx, dy: ly };
      }
    }
    const fin = (pts) => (wet ? splitPieces(piece, sec.s0, sec.s1, pts, waterCuts(sec)) : [piece(sec.s0, sec.s1, pts)]);
    if (!sec.back && sec.place >= 0 && !sec.transitTo) {
      // hin zu einem Ort mit Fluss: zum Tor am diesseitigen Ufer, um das Ende des Wassers herum – über den Fluss führt
      // nur die Brücke der Ortsdurchfahrt
      if (next && next.place === sec.place && riverOfSec(next, places) && riverOnMap(sec.place)) {
        toGate(out, pen, riverOnMap(sec.place), y0);
        return [piece(sec.s0, sec.s1, out)];
      }
      // hin zum Ort: bis an den Ortsrand, in Richtung Ortsmitte
      const C = placeXY(sec.place);
      const R = townR(sec.place);
      const d = Math.hypot(pen.x - C.x, pen.y - C.y);
      if (inDir && d < R + ku(0.8, y0) && (C.x - pen.x) * pen.dx + (C.y - pen.y) * pen.dy < 0) {
        // Der Knoten liegt im Ort (meist genau in der Mitte), die Rampe verlässt die Autobahn also erst hinter der
        // Mitte: in einer weiten Schleife zurück bis neben die Mitte und von dort quer hinein, statt am Ende der Rampe
        // zu wenden. Die Schleife liegt auf der Seite der Rampe, ...
        const [hx, hy] = inDir;
        let sg = (pen.x - C.x) * -hy + (pen.y - C.y) * hx >= 0 ? 1 : -1;
        // ... außer der Weg führt danach zu dieser Seite hinaus (sonst wendete das Auto in der Mitte)
        const X = exitTo(NODE_XY[sec.node], C, R);
        const [ux, uy] = unit(X.x - C.x, X.y - C.y);
        if (Math.hypot(X.x - C.x, X.y - C.y) > R * 0.3 && (ux * -hy + uy * hx) * sg > 0.5) sg = -sg;
        const dd = clamp(R * 0.3, ku(0.35, y0), ku(0.75, y0));
        // führte die Schleife über Wasser: enger, sonst kurz geradeaus oder zur Seite des Orts (den Bogen hinein fährt
        // die Ortsdurchfahrt)
        const side = (C.x - pen.x) * -pen.dy + (C.y - pen.y) * pen.dx > 0 ? 1 : -1; // zum Ort hin (arc: positiv zur Seite (−dy, dx))
        firstDry(out, pen, [
          (P) => dubins(P, pen.x, pen.y, pen.dx, pen.dy, C.x - hy * sg * dd, C.y + hx * sg * dd, hy * sg, -hx * sg, clamp(R * 0.15, ku(0.2, y0), ku(0.3, y0))),
          (P) => dubins(P, pen.x, pen.y, pen.dx, pen.dy, C.x - hy * sg * dd, C.y + hx * sg * dd, hy * sg, -hx * sg, ku(0.08, y0)),
          (P) => arc(P, pen.x, pen.y, pen.dx, pen.dy, ku(0.1, y0), 0, 1),
          (P) => arc(P, pen.x, pen.y, pen.dx, pen.dy, ku(0.12, y0), side * 1.2, 6),
          (P) => arc(P, pen.x, pen.y, pen.dx, pen.dy, ku(0.03, y0), 0, 1),
        ]);
        return [piece(sec.s0, sec.s1, out)];
      }
      if (d < R * 0.6) {
        // schon nah an der Mitte: kurz geradeaus, den Bogen hinein fährt die Ortsdurchfahrt (sonst führe der Zubringer
        // erst an der Mitte vorbei und kehrte dann um)
        firstDry(out, pen, [(P) => arc(P, pen.x, pen.y, pen.dx, pen.dy, ku(0.1, y0), 0, 1), (P) => arc(P, pen.x, pen.y, pen.dx, pen.dy, ku(0.03, y0), 0, 1)]);
        return [piece(sec.s0, sec.s1, out)];
      }
      let ex;
      let ey;
      if (d > R * 1.2) {
        const [ux, uy] = unit(pen.x - C.x, pen.y - C.y);
        ({ x: ex, y: ey } = dryEdge(sec.place, C, ux, uy, R * 0.85));
      } else {
        ex = pen.x + pen.dx * R * 0.3;
        ey = pen.y + pen.dy * R * 0.3;
      }
      const [tx, ty] = unit(C.x - ex, C.y - ey);
      dubins(out, pen.x, pen.y, pen.dx, pen.dy, ex, ey, tx, ty, RAMP_R(y0));
      return [piece(sec.s0, sec.s1, out)];
    }
    // zurück zum Knoten (oder zum Terminal): Richtung am Ende zur Auffahrt, wenn sie folgt
    const N = NODE_XY[sec.node];
    const road = next && (next.kind === 'auf' || next.kind === 'land') && next.de >= 0 ? dePts(next.de) : null;
    if (road && (N.x - pen.x) * pen.dx + (N.y - pen.y) * pen.dy < ku(0.1, y0)) {
      // der Knoten liegt schon hinter uns (mitten im Ort): gleich hinüber auf die neue Straße statt zurück und wenden
      const q = joinPoint(road, pen, ku(0.3, y0), y0, dryCap(next.de));
      dubins(out, pen.x, pen.y, pen.dx, pen.dy, q.x, q.y, q.dx, q.dy, turnR(pen, q, y0));
      return fin(out);
    }
    let [tx, ty] = unit(N.x - pen.x, N.y - pen.y);
    if (next && next.kind === 'auf') {
      const q = pointAlong(dePts(next.de), ku(0.3, y0));
      [tx, ty] = unit(q.x - N.x, q.y - N.y);
    }
    if (Math.hypot(N.x - pen.x, N.y - pen.y) < ku(0.05, y0)) arc(out, pen.x, pen.y, pen.dx, pen.dy, ku(0.1, y0), 0, 1);
    else dubins(out, pen.x, pen.y, pen.dx, pen.dy, N.x, N.y, tx, ty, turnR(pen, N, y0));
    return fin(out);
  }
  if (K === 'stadt') {
    const C = sec.place >= 0 ? placeXY(sec.place) : NODE_XY[sec.node];
    const R = sec.place >= 0 ? townR(sec.place) : ku(0.4, y0);
    const f = sec.spotS !== undefined ? clamp((sec.spotS - sec.s0) / sec.len, 0.05, 0.95) : 0.5;
    // wohin es danach geht: zum Knoten oder zum nächsten Ort
    const A = next && next.kind === 'zub' && !next.back && next.place >= 0 ? placeXY(next.place) : exitTo(NODE_XY[next ? next.node : sec.node], C, R);
    const r = Math.min(R * 0.14, ku(0.15, y0)); // Kreisverkehr
    // führt der Zubringer danach über Wasser (oder ist es ein Flussort), endet die Durchfahrt am Rand vor dem Wasser,
    // wo seine feste Linie beginnt (crossings.js townEdge)
    const WX = waterExit(sec, next);
    if (sec.exitOnly) {
      // nach der Ankunft neu gebaut (das nächste Ziel liegt woanders): vom Auto aus zum neuen Ausgang, wenn er hinter
      // uns liegt über einen Kreisverkehr gleich voraus
      const [ox, oy] = WX ? [-WX.tx, -WX.ty] : Math.hypot(A.x - C.x, A.y - C.y) < R * 0.3 ? [pen.dx, pen.dy] : unit(A.x - C.x, A.y - C.y);
      const X = WX ? { x: WX.x, y: WX.y } : dryEdge(sec.place, C, ox, oy, reachTo(A, C, R));
      let [hx, hy] = [pen.dx, pen.dy];
      const [vx, vy] = unit(X.x - pen.x, X.y - pen.y);
      if (vx * hx + vy * hy < -0.7) {
        arc(out, pen.x, pen.y, hx, hy, ku(0.05, y0), 0, 1);
        [hx, hy] = roundabout(out, hx, hy, r);
      }
      const n = out.length;
      const P = [out[n - 2], out[n - 1]];
      dubins(P, out[n - 2], out[n - 1], hx, hy, X.x, X.y, ox, oy, ku(0.2, y0));
      if (dry(P)) for (let i = 2; i < P.length; i++) out.push(P[i]);
      else dryBez(out, out[n - 2], out[n - 1], hx, hy, X.x, X.y, ox, oy, 0.4, 12, C);
      return [piece(sec.s0, sec.s1, out)];
    }
    if (riverOfSec(sec, places) && riverOnMap(sec.place)) {
      // Ort mit Fluss: Auf der Karte liegt die Durchfahrt, wie die Welt sie baut – vom Tor über die Brücke zum Brunnen
      // am Ortspunkt. Das Stück über das Wasser der Karte trägt genau die Meter, die die Straße in der Welt über Wasser
      // fährt (rm.u0 … rm.u1); der Weg hinaus bleibt auf dem Ufer des Brunnens
      const rm = riverOnMap(sec.place);
      const [ox, oy] = WX ? [-WX.tx, -WX.ty] : Math.hypot(A.x - C.x, A.y - C.y) < R * 0.3 ? [rm.tx, rm.ty] : unit(A.x - C.x, A.y - C.y);
      const in1 = [pen.x, pen.y];
      toGate(in1, pen, rm, y0);
      in1.push(rm.near[0], rm.near[1]);
      const out2 = [C.x, C.y];
      const X = WX || dryEdge(sec.place, C, ox, oy, reachTo(A, C, R));
      // hinaus wieder zurück zum Knoten: in einem Bogen um die Mitte, nicht auf der Brücke zurück
      let [hx, hy] = [rm.tx, rm.ty];
      if (ox * hx + oy * hy < -0.94) [hx, hy] = roundabout(out2, hx, hy, r);
      const n2 = out2.length;
      dryBez(out2, out2[n2 - 2], out2[n2 - 1], hx, hy, X.x, X.y, ox, oy, 0.4, 12, C);
      const sm = sec.s0 + sec.len * f;
      return [
        piece(sec.s0, sec.s0 + rm.u0, in1),
        piece(sec.s0 + rm.u0, sec.s0 + rm.u1, [rm.near[0], rm.near[1], rm.far[0], rm.far[1]]),
        piece(sec.s0 + rm.u1, sm, [rm.far[0], rm.far[1], C.x, C.y]),
        piece(sm, sec.s1, out2),
      ];
    }
    // Steht das Auto schon in der Mitte (die Landstraße endet dort), liegt die Mitte der Durchfahrt ein Stück voraus
    const atC = Math.hypot(C.x - pen.x, C.y - pen.y) < Math.min(R * 0.2, ku(0.25, y0));
    let [ix, iy] = atC ? [pen.dx, pen.dy] : unit(C.x - pen.x, C.y - pen.y);
    let [ox, oy] = unit(A.x - C.x, A.y - C.y);
    if (Math.hypot(A.x - C.x, A.y - C.y) < R * 0.3) [ox, oy] = [ix, iy];
    if (WX) [ox, oy] = [-WX.tx, -WX.ty];
    const out1 = [pen.x, pen.y];
    const out2 = [C.x, C.y];
    if (ix * ox + iy * oy > -0.94) {
      // durch die Mitte und weiter zum Ausgang (auch schräg zurück, in einem Bogen um die Mitte)
      const [mx, my] = unit(ix + ox, iy + oy);
      const M = atC ? { x: C.x + mx * R * 0.25, y: C.y + my * R * 0.25 } : C;
      dryBez(out1, pen.x, pen.y, pen.dx, pen.dy, M.x, M.y, mx, my, 0.4, 12);
      out2[0] = M.x;
      out2[1] = M.y;
      if (WX) dryBez(out2, M.x, M.y, mx, my, WX.x, WX.y, ox, oy, 0.4, 12, C);
      else {
        const X = dryEdge(sec.place, C, ox, oy, reachTo(A, C, R));
        dryBez(out2, M.x, M.y, mx, my, X.x, X.y, ox, oy, 0.4, 12, C);
      }
    } else {
      // Sackgasse: bis zum Kreisverkehr in der Ortsmitte (oder, steht das Auto schon dort, gleich voraus), einmal
      // herum und auf derselben Straße zurück
      const I = atC ? { x: pen.x + ix * (r * Math.sqrt(3) + R * 0.05), y: pen.y + iy * (r * Math.sqrt(3) + R * 0.05) } : C;
      const ex = I.x - ix * r * Math.sqrt(3);
      const ey = I.y - iy * r * Math.sqrt(3);
      dryBez(out1, pen.x, pen.y, pen.dx, pen.dy, ex, ey, ix, iy, 0.4, 12);
      out2[0] = ex;
      out2[1] = ey;
      roundabout(out2, ix, iy, r);
    }
    const sm = sec.s0 + sec.len * f;
    return [piece(sec.s0, sm, out1), piece(sm, sec.s1, out2)];
  }
  if (K === 'term' && !sec.arrival) {
    // zum Terminal am Knoten, am Ende in Richtung der Überfahrt
    const N = NODE_XY[sec.node];
    const T = dePts(sec.de);
    const t0 = pointAlong(T, 0);
    if (Math.hypot(N.x - pen.x, N.y - pen.y) < ku(0.05, y0)) arc(out, pen.x, pen.y, pen.dx, pen.dy, ku(0.15, y0), 0, 1);
    else dubins(out, pen.x, pen.y, pen.dx, pen.dy, N.x, N.y, t0.dx, t0.dy, turnR(pen, N, y0));
    return [piece(sec.s0, sec.s1, out)];
  }
  if (K === 'term' && sec.arrival) {
    // die Überfahrt selbst (ohne Länge auf dem Band: das Navi lässt das Auto hinüberhüpfen), dann vom Terminal weg
    const T = dePts(sec.de);
    const hop = [pen.x, pen.y];
    for (let i = 0; i < T.length; i++) hop.push(T[i]);
    const e = penOf(T);
    const out2 = [e.x, e.y];
    arc(out2, e.x, e.y, e.dx, e.dy, ku(0.2, e.y), 0, 1);
    return [piece(sec.s0, sec.s0, hop, 'transit'), piece(sec.s0, sec.s1, out2)];
  }
  // sonst geradeaus weiter, so lang wie der Abschnitt auf der Karte ist
  arc(out, pen.x, pen.y, pen.dx, pen.dy, ku(Math.max(sec.len * (sec.kmPerM || 0.001), 0.05), y0), 0, 1);
  return [piece(sec.s0, sec.s1, out)];
}

/**
 * Ein Linienzug aus Stücken mit Bogenlänge je Punkt und der Zuordnung Band-Meter s → Bogenlänge.
 * pts/A: Punkte und Bogenlängen; map: [{s0, s1, a0, a1, kind}] je Stück (Überfahrten: s0 = s1).
 */
export class Line {
  constructor() {
    this.pts = [];
    this.A = [];
    this.map = [];
    this.len = 0;
  }
  /** Punkte anhängen (der erste wird übersprungen, wenn er auf dem letzten liegt). */
  push(P, s0 = NaN, s1 = NaN, kind = '') {
    const a0 = this.len;
    for (let i = 0; i < P.length; i += 2) {
      const n = this.pts.length;
      if (n) {
        const d = Math.hypot(P[i] - this.pts[n - 2], P[i + 1] - this.pts[n - 1]);
        if (d < 1e-9) continue;
        this.len += d;
      }
      this.pts.push(P[i], P[i + 1]);
      this.A.push(this.len);
    }
    if (!Number.isNaN(s0)) this.map.push({ s0, s1, a0, a1: this.len, kind });
  }
  /** Bogenlänge zur Stelle s auf dem Band (außerhalb: −1). */
  aOf(s) {
    const M = this.map;
    if (!M.length || s < M[0].s0) return -1;
    let lo = 0;
    let hi = M.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (M[mid].s0 <= s) lo = mid;
      else hi = mid - 1;
    }
    // bei gleichen Anfängen (Überfahrt ohne Länge) gilt das letzte Stück
    const m = M[lo];
    if (s > m.s1 && lo === M.length - 1) return -1;
    return m.s1 > m.s0 ? m.a0 + ((Math.min(s, m.s1) - m.s0) / (m.s1 - m.s0)) * (m.a1 - m.a0) : m.a1;
  }
  /** Punkt bei Bogenlänge a (in out[0], out[1]); liefert den Segmentindex. */
  at(a, out) {
    const A = this.A;
    const n = A.length;
    if (!n) return -1;
    if (a <= 0 || n === 1) {
      out[0] = this.pts[0];
      out[1] = this.pts[1];
      return 0;
    }
    if (a >= this.len) {
      out[0] = this.pts[n * 2 - 2];
      out[1] = this.pts[n * 2 - 1];
      return n - 2;
    }
    let lo = 0;
    let hi = n - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (A[mid] <= a) lo = mid;
      else hi = mid;
    }
    const t = (a - A[lo]) / (A[hi] - A[lo] || 1);
    out[0] = this.pts[lo * 2] + (this.pts[hi * 2] - this.pts[lo * 2]) * t;
    out[1] = this.pts[lo * 2 + 1] + (this.pts[hi * 2 + 1] - this.pts[lo * 2 + 1]) * t;
    return lo;
  }
  /** Geglättete Richtung bei a: Sehne von a − d bis a + d (zuckt nicht an Knicken). */
  dirAt(a, d, out) {
    const p = [0, 0];
    const q = [0, 0];
    this.at(a - d, p);
    this.at(a + d, q);
    const [dx, dy] = unit(q[0] - p[0], q[1] - p[1]);
    out[0] = dx;
    out[1] = dy;
    return out;
  }
  /** Teil zwischen den Bogenlängen a0 und a1 als flaches Feld (für das Zeichnen). */
  slice(a0, a1) {
    const out = [];
    const p = [0, 0];
    if (a1 <= a0) return out;
    const i0 = this.at(a0, p);
    out.push(p[0], p[1]);
    for (let i = i0 + 1; i < this.A.length && this.A[i] < a1; i++) out.push(this.pts[i * 2], this.pts[i * 2 + 1]);
    this.at(a1, p);
    out.push(p[0], p[1]);
    return out;
  }
}

const TRANSIT_NAME = { faehre: 'Fähre', zug: 'Autozug', flug: 'Luftfracht' };
/**
 * „dann …“ zur Ausfahrt aus guidance().then: dieselben Texte wie auf den Schildern (trip.signs). th.wende: die Route
 * fährt hinter der Ausfahrt dieselbe Straße zurück (über die Rampen, nie über die Autobahn).
 */
function thenText(th) {
  if (!th) return '';
  if (th.type === 'ziel') return 'dann zum Ziel ' + places[th.place].name;
  if (th.type === 'park') return 'dann zum ' + PARKS[th.park].name;
  if (th.type === 'ab' || th.type === 'land') return (th.wende ? 'dann wenden: ' : 'dann ') + th.road + ' Richtung ' + th.towards;
  if (TRANSIT_NAME[th.type]) return 'dann ' + TRANSIT_NAME[th.type] + ' nach ' + nodes[th.to].name;
  return '';
}
// Entfernungen in Worten. Zwei Einheiten, jede mit einer Bedeutung, auf jedem Bildschirm und jeder Tafel: „km“ sind
// Reisekilometer – das Maß der Fahrt (trip.km, trip.reach().km), auf der offenen Strecke gerafft. „m“ sind Meter
// Straße, wie das Auge sie sieht. Eine Zahl in Metern ist nie eine geraffte Entfernung, eine Zahl in Kilometern nie
// eine Straßenlänge auf geraffter Strecke.
/**
 * Der erste Vorwegweiser steht so viele Meter Straße vor jeder Gabelung (signplan.js BOARD_D[0]; tools/journey-test.mjs
 * hält beide gleich). Ab ihm zählt die Ansage die Meter bis zur Gabelung herunter, genau wie Tafeln und Baken.
 */
export const BOARD_M = 1000;
/**
 * Auf den letzten so vielen Metern Straße vor einer Ausfahrt nennt die Ansage (und die nächste Ausfahrt) schon Meter,
 * auch wo die Autobahn gerafft ist: Dann ist der erste Vorwegweiser schon zu sehen, und Tafel und Navi zählen in
 * derselben Einheit – statt „3,4 km“ im Navi neben der Tafel „1000 m“. Vorschau (calm) und Spurpfeile wechseln weiter
 * erst an der Tafel.
 */
export const NEAR_M = 1500;
/** Meter Straße: „1000 m“, „450 m“, „80 m“ – in Schritten von 50 m, auf den letzten 100 m von 10 m. */
export function fmtRoad(m) {
  const step = m < 95 ? 10 : 50;
  return Math.max(0, Math.round(m / step) * step) + ' m';
}
/**
 * Reisekilometer bis zu einer Stelle: „412 km“ (gerundet, wie auf den Entfernungstafeln), unter 10 km mit einer
 * Nachkommastelle und aufgerundet: „0,5 km“ heißt „höchstens noch so weit“. So steigt die Zahl nie, wenn die Anzeige
 * auf echter Straße zu Metern wechselt (aus „1,1 km“ wird „1000 m“, aus „0,7 km“ an der Ortstafel „650 m“).
 */
export function fmtKm(km) {
  if (!isFinite(km)) return '– km';
  const up = Math.ceil(km * 10 - 1e-6) / 10;
  return up < 10 ? up.toFixed(1).replace('.', ',') + ' km' : Math.round(km).toLocaleString('de-DE') + ' km';
}
/** Gefahrene Reisekilometer (Kilometerzähler): abgerundet – „100 km“ steht da, sobald sie voll sind. */
export function fmtOdo(km) {
  const down = Math.floor(km * 10 + 1e-6) / 10;
  return down < 10 ? down.toFixed(1).replace('.', ',') + ' km' : Math.floor(down).toLocaleString('de-DE') + ' km';
}
/**
 * Die eine Entfernungsangabe des Spiels – für das Ziel, die nächste Handlung, jeden Ort: d = {km, m, real} von
 * trip.reach(). Liegt bis zur Stelle nur echte Straße (real) und höchstens BOARD_M davon, nennt sie die Meter, so wie
 * Vorwegweiser und Baken zählen; sonst die Reisekilometer – auch auf echter Straße, wo es noch weiter ist: „1,2 km“
 * liest sich im Fahren leichter als „1150 m“. Am Wechsel ist es dieselbe Strecke in der anderen Einheit, und die Zahl
 * steigt dabei nie: aus „1,1 km“ wird „1000 m“, an der Ortstafel aus „0,5 km“ „500 m“.
 */
export function fmtDistance(d) {
  return d.real && d.m <= BOARD_M ? fmtRoad(d.m) : fmtKm(d.km);
}

/**
 * Fluss eines Flussorts (rivers.js) auf der Karte oder null: Er ist echtes Wasser der Karte (water.js), dort, wo die
 * Linie vom Knoten zum Ortspunkt ihn kreuzt (crossings.js townRiverOnMap), liegt die Brücke der Ortsdurchfahrt. Im Ort
 * ist die Karte nicht gerafft: Das Tor (gate) liegt so weit vor der Brücke, wie die Ortsdurchfahrt der Welt bis zum
 * Fluss fährt, und das Auto ist auf der Karte genau so lange über Wasser wie der Wagen auf der Brücke. {name, place, x,
 * y (Mitte der Brücke), tx, ty (Richtung der Ortsdurchfahrt: zum Ortspunkt), k (Karteneinheiten je Meter), gate, near,
 * far (Punkte der Durchfahrt am diesseitigen und am jenseitigen Ufer), u0, u1 (so viele Meter hinter dem Ortsbeginn
 * fährt sie auf die Brücke und wieder herunter)}. Für denselben Ort immer derselbe.
 */
const riverCache = new Map();
export function riverOnMap(place) {
  if (riverCache.has(place)) return riverCache.get(place);
  const tr = townRiverOnMap(place);
  let rm = null;
  if (tr) {
    const rv = tr.rv;
    const [u0, u1] = riverSpan(rv, rv.x, rv.x);
    const at = (u) => [tr.x + tr.tx * (u - rv.u) * tr.k, tr.y + tr.ty * (u - rv.u) * tr.k];
    rm = { name: rv.name, place, x: tr.x, y: tr.y, tx: tr.tx, ty: tr.ty, k: tr.k, gate: tr.gate, near: at(u0), far: at(u1), u0, u1 };
  }
  riverCache.set(place, rm);
  return rm;
}
/** Stift für einen Abschnitt am Fluss ohne Vorgänger: die Ortsdurchfahrt beginnt am Tor, ihr Zubringer kurz davor; sonst null. */
function riverPen(sec, next) {
  const town = sec.kind === 'stadt' ? sec : sec.kind === 'zub' && !sec.back && !sec.transitTo && next && next.place === sec.place ? next : null;
  if (!town || town.exitOnly || !riverOfSec(town, places)) return null;
  const rm = riverOnMap(town.place);
  if (!rm) return null;
  const d = town === sec ? 0 : ku(0.3, rm.y);
  return { x: rm.gate[0] - rm.tx * d, y: rm.gate[1] - rm.ty * d, dx: rm.tx, dy: rm.ty };
}
/**
 * Weg vom Stift zum Tor des Flussorts, dort in Richtung der Brücke (meist steht der Stift schon dort: der Zubringer
 * endet am Tor, crossings.js zubLine). Hängt die Punkte ohne den Anfang an.
 */
function toGate(out, pen, rm, y0) {
  const [gx, gy] = rm.gate;
  if (Math.hypot(pen.x - gx, pen.y - gy) < ku(0.002, y0)) {
    out.push(gx, gy);
    return;
  }
  const P = [pen.x, pen.y];
  dubins(P, pen.x, pen.y, pen.dx, pen.dy, gx, gy, rm.tx, rm.ty, RAMP_R(y0));
  for (let i = 2; i < P.length; i++) out.push(P[i]);
}

/**
 * Was das Navi gerade wissen muss, aus einer Fahrt (Trip). update() einmal je Bild aufrufen (billig); teuer wird es nur,
 * wenn sich die Wege der Fahrt ändern (trip.version) oder ein neues Ziel kommt.
 */
export class NavModel {
  constructor(trip) {
    this.trip = trip;
    this.cache = new Map(); // Abschnitt → {pieces, next, pen}
    this.curVersion = -1;
    this.target = -2;
    this.cur = new Line(); // eigener Weg (mit s-Zuordnung)
    this.route = null; // geplanter Weg bis zum Ziel: {line, a0 (Auto), stops, dest, kmTotal}
    this.rivers = []; // Wasser unter den Wegen der Fahrt (waterMarks): dort stehen Namen von Fluss und See
    this.riversKey = '';
    this.trail = []; // gefahrener Weg (Kartenpunkte)
    this.trailKm = TRAIL.km; // Mindestabstand seiner älteren Punkte (wächst, wenn das Ausdünnen nicht reicht, thinTrail)
    this.pose = { x: 0, y: 0, dx: 0, dy: -1, a: 0, kind: 'ab' };
    this.heading = null; // geglättete Fahrtrichtung [dx, dy]
    this.hop = null; // laufende Überfahrt {line, a0, a1, t, dur, kind}
    this.reroute = 0; // Sekunden seit dem letzten neuen Ziel
    this.oldRoute = null;
    this.events = [];
    this.lastS = -Infinity;
    this.lastA = 0;
    this.chordKm = 0.3; // halbe Sehne für den Kurs; das Navi setzt sie passend zum Maßstab (etwa 40 Bildpunkte)
  }

  /** Stücke eines Wegs bauen (bekannte Abschnitte bleiben, wie sie sind). pen: Ende des Abschnitts davor. */
  build(path, pen) {
    const L = path.sections;
    const s = this.trip.s;
    let dirty = false;
    const out = [];
    let inDir = pen ? [pen.dx, pen.dy] : null; // Richtung der Straße, auf der das Auto zuletzt ankam
    for (let i = 0; i < L.length; i++) {
      const sec = L[i];
      const next = L[i + 1] || this.guessNext(path, sec);
      // Ortsdurchfahrt und Zubringer in den Ort hängen auch an der Straße danach (Knoten mitten im Ort)
      const way = sec.kind === 'stadt' || (sec.kind === 'zub' && !sec.back && sec.place >= 0) ? this.wayAfter(path, i) : -1;
      const nk = nextKey(next) + '>' + way;
      let c = this.cache.get(sec.id);
      if (c && (dirty || c.nk !== nk)) {
        // ein Abschnitt vor uns wird neu gebaut, wenn sein Nachfolger erst jetzt feststeht (oder sein Vorgänger neu
        // ist); unter dem Auto nur das Stück voraus, damit es nicht springt
        if (sec.s0 > s) c = null;
        else if (!dirty && s < sec.s1 && (sec.kind === 'conn' || sec.kind === 'zub' || (sec.kind === 'stadt' && sec.spotS !== undefined && s >= sec.spotS))) {
          const r = this.recut(c, sec, s, next, way, inDir);
          if (r) {
            c = r;
            this.cache.set(sec.id, c);
            dirty = true;
          }
        }
      }
      if (!c) {
        const pieces = sectionPieces(sec, pen, next, way, inDir);
        c = { pieces, nk, pen: penOf(pieces[pieces.length - 1].pts) };
        this.cache.set(sec.id, c);
        dirty = true;
      }
      out.push(...c.pieces);
      pen = c.pen;
      if (sec.kind === 'ab' || sec.kind === 'land') inDir = [pen.dx, pen.dy];
    }
    return { pieces: out, pen };
  }

  /**
   * Nachfolger, den die Fahrt noch nicht angelegt hat: Verbindungsfahrbahn und Zubringer zurück sind länger als ihr
   * Horizont, die Auffahrt danach kommt erst, wenn das Auto schon darauf ist. Bis dahin gilt die Auffahrt, die die
   * Fahrt dort wählen wird (pickLeave), sonst liefe die Route erst geradeaus weg und dann zurück.
   */
  guessNext(path, sec) {
    const f = path.frontier;
    if (sec.kind !== 'conn' && !(sec.kind === 'zub' && sec.back)) return null;
    if (!f || f.t !== 'node' || f.n !== sec.node || path.sections[path.sections.length - 1] !== sec) return null;
    const pick = this.pickAfter(path, f);
    if (pick && pick.goal) return { kind: 'zub', node: f.n, place: this.trip.policy.place, park: this.trip.policy.park ?? -1, back: false };
    const t = pick && pick.t;
    if (!t || t.type !== 'enter' || !(t.de >= 0)) return null;
    const kind = deKind(t.de);
    if (kind === 'ab') return { kind: 'auf', de: t.de, node: f.n, place: -1, back: false };
    if (kind === 'land') return { kind: 'land', de: t.de, node: deTo(t.de), place: -1, back: false };
    return sec.kind === 'conn' ? { kind: 'zub', node: f.n, place: -1, back: false, transitTo: deTo(t.de) } : null;
  }

  /**
   * Die Straße (gerichtete Kante), auf der es nach dem Abschnitt i weitergeht: aus den nächsten Abschnitten oder, wenn
   * der Weg vorher endet, aus der Wahl, die die Fahrt an seinem Knoten treffen wird; -1, wenn das offen ist.
   */
  wayAfter(path, i) {
    const L = path.sections;
    for (let k = i + 1; k < L.length && k <= i + 3; k++) if (L[k].de >= 0) return L[k].de;
    const f = path.frontier;
    if (L.length > i + 3 || !f || f.t !== 'node' || f.n !== L[i].node) return -1;
    const pick = this.pickAfter(path, f);
    return pick && pick.t && pick.t.de >= 0 ? pick.t.de : -1;
  }

  /**
   * Wie die Fahrt am Ende des Wegs weiterfährt (pickLeave). Besucht der Weg dort gerade das Ziel, weiß das erst das
   * nächste Gebot; bis dahin gilt, was die Fahrt ohne Ziel täte (wie Trip.leave2): meist geradeaus weiter.
   */
  pickAfter(path, f) {
    const trip = this.trip;
    const pick = trip.pickLeave(f.n, f.via);
    const last = path.sections[path.sections.length - 1];
    const saved = trip.policy;
    if (!pick || !pick.goal || !saved || !last) return pick;
    // aus dem Park des Ladestopps heraus gilt der Weg zum Ziel (wie Trip.leave2)
    const park = saved.park >= 0;
    if (park ? last.park !== saved.park : last.place !== saved.place) return pick;
    trip.policy = park ? saved.then : null;
    try {
      return trip.pickLeave(f.n, f.via);
    } finally {
      trip.policy = saved;
    }
  }

  /** Den Abschnitt unter dem Auto ab der Stelle s neu bauen; das Stück dahinter bleibt, wie es war. */
  recut(c, sec, s, next, way, inDir) {
    const out = [];
    for (const p of c.pieces) {
      if (p.s1 <= s) {
        out.push(p);
        continue;
      }
      if (p.s0 > s) break;
      const L = new Line();
      L.push(p.pts);
      if (L.len <= 0) return null;
      const a = p.s1 > p.s0 ? ((s - p.s0) / (p.s1 - p.s0)) * L.len : 0;
      const at = [0, 0];
      L.at(a, at);
      const d = L.dirAt(a, Math.max(L.len * 0.004, 1e-7), [0, 0]);
      const behind = L.slice(0, a);
      if (behind.length >= 4) out.push({ ...p, s1: s, pts: behind });
      // orig: der ganze Abschnitt (seine Brücken hängen an ihm, crossings.js sectionWater)
      const orig = sec.orig || sec;
      const rest = sec.kind === 'stadt' ? { ...sec, s0: s, len: sec.s1 - s, spotS: undefined, exitOnly: true, orig } : { ...sec, s0: s, orig };
      const ahead = sectionPieces(rest, { x: at[0], y: at[1], dx: d[0], dy: d[1] }, next, way, inDir);
      out.push(...ahead);
      return { pieces: out, nk: nextKey(next) + '>' + way, pen: penOf(ahead[ahead.length - 1].pts) };
    }
    return null;
  }

  /** Nach Änderungen der Fahrt: eigener Weg, geplanter Weg, Orte entlang der Route. */
  rebuild() {
    const trip = this.trip;
    this.curVersion = trip.version;
    const { pieces, pen } = this.build(trip.cur, null);
    const cur = new Line();
    for (const p of pieces) cur.push(p.pts, p.s0, p.s1, p.kind);
    this.cur = cur;
    this.curPen = pen;
    // Abschnitte, die es nicht mehr gibt, vergessen
    const alive = new Set();
    for (const { path } of trip.paths()) for (const c of path.sections) alive.add(c.id);
    for (const id of this.cache.keys()) if (!alive.has(id)) this.cache.delete(id);
    this.buildRoute(pieces);
    this.waterMarks();
  }

  /**
   * Die Stellen, an denen die Wege der Fahrt über Wasser führen (crossings.js: jede ist in der Welt eine Brücke), je
   * Fluss und Strecke einmal: [{x, y, name, cls, ri, j, t}] – Navi und große Karte schreiben dort den Namen aufs
   * Wasser. Bleibt dieselbe Liste, solange sich nichts ändert.
   */
  waterMarks() {
    const out = [];
    const seen = new Set();
    const add = (q) => {
      if (!q.name) return;
      const key = q.ri >= 0 ? q.ri + ':' + q.j : 'L' + Math.round(q.x * 1e4) + ':' + Math.round(q.y * 1e4);
      if (seen.has(key)) return;
      seen.add(key);
      out.push(q);
    };
    for (const { path } of this.trip.paths())
      for (const c of path.sections) {
        for (const b of sectionWater(c)) for (const q of b.map) add(q);
        const tr = c.kind === 'stadt' && riverOfSec(c, places) ? townRiverOnMap(c.place) : null;
        if (tr) add(tr.w);
      }
    const key = [...seen].join('|');
    if (key !== this.riversKey) {
      this.riversKey = key;
      this.rivers = out;
    }
  }

  /** Geplanter Weg: eigener Weg bis zur geplanten Ausfahrt, deren Zweig, dann laut Routenplan bis zum Ziel. */
  buildRoute(curPieces) {
    const trip = this.trip;
    let pol = trip.policy;
    if ((trip.target < 0 && trip.stop < 0) || !pol) {
      this.route = null;
      return;
    }
    const line = new Line();
    const stops = [];
    const addStop = (pi, a) => {
      if (pi >= 0 && !stops.some((q) => q.place === pi)) stops.push({ place: pi, a });
    };
    let path = trip.cur;
    let pieces = curPieces;
    let frontier = path.frontier;
    // den eigenen Weg bis zur ersten geplanten Ausfahrt
    let exitFork = null;
    for (const sec of path.sections) {
      if (sec.s1 <= trip.s) continue;
      const f = sec.fork;
      if (f && !f.taken && f.branch && trip.planFor(f) === 'exit') {
        exitFork = f;
        break;
      }
    }
    let reached = false;
    const take = (list, upTo) => {
      for (const p of list) {
        if (p.s0 >= upTo) break;
        line.push(p.pts, p.s0, p.s1, p.kind);
        const sec = this.secById(p.sec);
        // durch den Park des Ladestopps: dahinter gilt der Weg zum Ziel (ohne Ziel endet die Route am Halt)
        if (sec && sec.kind === 'park' && pol && pol.park === sec.park && sec.spotS !== undefined && p.s1 >= sec.spotS) {
          pol = pol.then;
          if (!pol) {
            reached = true;
            return;
          }
        }
        if (sec && sec.kind === 'stadt' && sec.place >= 0) {
          addStop(sec.place, line.len);
          if (sec.place === trip.target && sec.spotS !== undefined && p.s1 >= sec.spotS) {
            reached = true;
            return;
          }
        }
      }
    };
    take(pieces, exitFork ? exitFork.s : Infinity);
    if (exitFork && !reached) {
      const pen = this.cache.get(exitFork.sec.id).pen;
      const b = this.build(exitFork.branch, pen);
      take(b.pieces, Infinity);
      path = exitFork.branch;
      frontier = path.frontier;
    }
    // weiter laut Routenplan (über den Horizont des Spiels hinaus)
    let st = -1;
    if (frontier && frontier.t === 'fork') st = frontier.fork.de;
    else if (frontier && frontier.t === 'node') st = stateOfNode(frontier.n);
    let guard = 0;
    let join = true;
    while (!reached && st >= 0 && guard++ < 400) {
      if (st === pol.goal) {
        // am Knoten des Ladestopps: in den Park und weiter auf dem Weg zum Ziel
        if (!(pol.park >= 0)) break;
        const N = NODE_XY[nodes[PARKS[pol.park].node].i];
        line.push([N.x, N.y]);
        pol = pol.then;
        if (!pol) {
          reached = true;
          break;
        }
        continue;
      }
      const t = pol.next[st];
      if (!t) break;
      const de = t.type === 'stay' ? t.to : t.de;
      if (de >= 0 && t.type !== 'exit' && t.type !== 'node') {
        let P = dePts(de);
        // endet der bekannte Weg schon auf dieser Kante (Verbindungsfahrbahn), dort weiter statt zurück zum Knoten
        const n0 = line.pts.length;
        if (join && n0 >= 2) {
          const j = nearestOn(P, line.pts[n0 - 2], line.pts[n0 - 1], polyLength(P) * 0.5);
          if (j.d < ku(0.05, j.y)) P = [j.x, j.y, ...P.slice((j.i + 1) * 2)];
        }
        join = false;
        line.push(P);
        const n = deTo(de);
        if (nodes[n].places.length) addStop(nodes[n].places[0].place, line.len);
      }
      st = t.to;
    }
    if (!reached && st === pol.goal) {
      const C = placeXY(pol.place);
      line.push([C.x, C.y]);
      addStop(pol.place, line.len);
    }
    this.route = { line, stops, dest: trip.target };
  }
  secById(id) {
    for (const { path } of this.trip.paths()) for (const c of path.sections) if (c.id === id) return c;
    return null;
  }

  /**
   * Die Fahrt hat neu geplant, ohne dass sich das Ziel geändert hat (an der angesagten Ausfahrt vorbei): Die Anzeige
   * zeichnet die Route von vorn, wie nach einem neuen Ziel.
   */
  replanned() {
    this.oldRoute = null;
    this.reroute = 0;
  }

  /**
   * Einmal je Bild: Lage des Autos, gefahrener Weg, Überfahrt, neues Ziel. dt in Sekunden. Liefert Ereignisse
   * ('reroute', 'hop') für die Anzeige.
   */
  update(dt) {
    const trip = this.trip;
    const ev = (this.events = []);
    if (trip.version !== this.curVersion || trip.target !== this.target) {
      const newTarget = trip.target !== this.target && this.target !== -2;
      const old = this.route;
      this.rebuild();
      if (trip.target !== this.target) {
        if (newTarget && trip.target >= 0) {
          this.oldRoute = old;
          this.reroute = 0;
          ev.push({ type: 'reroute' });
        }
        this.target = trip.target;
      }
    }
    this.reroute += dt;
    const line = this.cur;
    let a = line.aOf(trip.s);
    if (a < 0) a = Math.min(this.lastA, line.len);
    // Überfahrt: das Auto springt auf dem Band von Terminal zu Terminal, auf der Karte hüpft es hinüber
    const m = line.map.find((q) => q.kind === 'transit' && q.s0 > this.lastS && q.s0 <= trip.s);
    if (m && !this.hop && this.lastS > -Infinity) {
      this.hop = { a0: m.a0, a1: m.a1, t: 0, dur: clamp(1.6 + Math.log2(1 + (m.a1 - m.a0) * 20) * 0.45, 2, 4), kind: this.secKindAt(m) };
      ev.push({ type: 'hop', kind: this.hop.kind });
    }
    if (this.hop) {
      this.hop.t += dt;
      if (this.hop.t >= this.hop.dur) this.hop = null;
    }
    this.lastS = trip.s;
    this.lastA = a;
    const p = [0, 0];
    line.at(a, p);
    // Kurs über eine Sehne (auf Kurven ruhig, an Knicken ohne Zucken), dazu sanft nachgeführt
    const d = [0, 0];
    line.dirAt(a, ku(Math.max(this.chordKm, 0.15), p[1]), d);
    const hp = this.hopPose();
    if (hp) {
      d[0] = hp.dx;
      d[1] = hp.dy;
    }
    if (!this.heading) this.heading = [d[0], d[1]];
    else {
      // nachführen, aber höchstens 150 Grad je Sekunde (die Karte dreht sich dann ruhig)
      const H = this.heading;
      const diff = Math.atan2(H[0] * d[1] - H[1] * d[0], H[0] * d[0] + H[1] * d[1]);
      const turn = clamp(diff * (1 - Math.exp(-dt * 6)), -2.6 * dt, 2.6 * dt);
      const c = Math.cos(turn);
      const sn = Math.sin(turn);
      const hx = H[0] * c - H[1] * sn;
      H[1] = H[0] * sn + H[1] * c;
      H[0] = hx;
    }
    const P = this.pose;
    P.x = p[0];
    P.y = p[1];
    P.dx = this.heading[0];
    P.dy = this.heading[1];
    P.a = a;
    P.kind = trip.section.kind;
    // gefahrener Weg: ein Punkt je gut 40 m (die Karte zeigt ihn bis in die Weltansicht; nach langer Fahrt seltener)
    if (!this.hop) this.addTrail(p[0], p[1]);
    return ev;
  }
  secKindAt(m) {
    const sec = this.trip.cur.sections.find((c) => c.s0 === m.s0 && c.kind === 'term' && c.arrival);
    return sec ? sec.transit : 'faehre';
  }
  /** Punkt (x, y) des Autos an den gefahrenen Weg hängen, wenn er weit genug vom letzten entfernt ist. */
  addTrail(x, y) {
    const T = this.trail;
    const n = T.length;
    if (n && Math.hypot(T[n - 2] - x, T[n - 1] - y) <= ku(TRAIL.km, y)) return;
    if (n && Math.hypot(T[n - 2] - x, T[n - 1] - y) > ku(5, y)) T.push(NaN, NaN); // Sprung (Überfahrt)
    T.push(x, y);
    if (T.length > TRAIL.max) this.thinTrail();
  }

  /**
   * Den gefahrenen Weg gleichmäßig ausdünnen: Vor den letzten TRAIL.tail Zahlen (dort bleibt er dicht, das Navi zeigt
   * ihn aus der Nähe) verdoppelt sich der Mindestabstand der Punkte, bis höchstens TRAIL.keep der Grenze übrig sind.
   * Gleichmäßig über den ganzen älteren Teil, damit der Anfang einer langen Fahrt nicht bei jedem Mal wieder dran ist
   * (er schrumpfte sonst zu einer Geraden über Hunderte Kilometer). Sprünge (NaN-Paare, Überfahrten) bleiben samt den
   * Punkten an ihren Enden.
   */
  thinTrail() {
    const T = this.trail;
    const cut = Math.max(0, T.length - TRAIL.tail);
    // der kleinste Abstand (der bisherige oder ein Vielfaches davon), mit dem der Weg wieder unter die Grenze passt
    for (;;) {
      const out = [];
      let lx = NaN;
      let ly = NaN;
      for (let j = 0; j < cut; j += 2) {
        const x = T[j];
        const y = T[j + 1];
        const edge = Number.isNaN(x) || j === 0 || j + 2 >= cut || Number.isNaN(T[j - 2]) || Number.isNaN(T[j + 2]);
        if (edge || Number.isNaN(lx) || Math.hypot(x - lx, y - ly) >= ku(this.trailKm, y)) {
          out.push(x, y);
          lx = x;
          ly = y;
        }
      }
      for (let j = cut; j < T.length; j++) out.push(T[j]);
      if (out.length <= TRAIL.max * TRAIL.keep || this.trailKm > 1e4) {
        this.trail = out;
        return;
      }
      this.trailKm *= 2;
    }
  }

  /** Punkt des Autos, während es über das Wasser (oder durch die Luft) hüpft: {x, y, dx, dy, f (0…1)} oder null. */
  hopPose() {
    const h = this.hop;
    if (!h) return null;
    const f = clamp(h.t / h.dur, 0, 1);
    const e = f < 0.5 ? 2 * f * f : 1 - 2 * (1 - f) * (1 - f);
    const a = h.a0 + (h.a1 - h.a0) * e;
    const p = [0, 0];
    this.cur.at(a, p);
    const d = [0, 0];
    this.cur.dirAt(a, Math.max((h.a1 - h.a0) * 0.02, 1e-4), d);
    return { x: p[0], y: p[1], dx: d[0], dy: d[1], f, kind: h.kind, a0: h.a0, a1: h.a1 };
  }

  /** Bogenlänge des Autos auf der Route (Route beginnt mit dem eigenen Weg, also gleiche Zählung) oder −1. */
  routeA() {
    if (!this.route) return -1;
    const a = this.route.line.aOf(this.trip.s);
    return a >= 0 ? a : this.pose.a;
  }

  /** Kartenkilometer zwischen dem Auto und der Stelle s weiter vorn auf dem eigenen Weg (oder geschätzt). */
  kmAhead(ds) {
    const s = this.trip.s;
    const L = this.route ? this.route.line : this.cur;
    const a1 = L.aOf(s + ds);
    const a0 = L.aOf(s);
    if (a1 >= 0 && a0 >= 0) return (a1 - a0) * kmPerUnit(this.pose.y);
    return ds * (this.trip.section.kmPerM || 0.001);
  }

  /**
   * Die Ansage für Navi und HUD-Zeile, nur aus trip.guidance() und den Schildtexten (trip.signs): {turn, dist (Meter
   * der Fahrt bis zur genannten Stelle), km (Kartenkilometer bis dorthin auf der Karte, für ihren Maßstab), say (die
   * Entfernung in Worten, '' ohne Stelle), calm, head (Hauptzeile), sub (Nebenzeile), road (Schild), lanes
   * (Spurpfeile), fork (die Gabelung, die die Ansage meint), node, mapKm (Reisekilometer bis zum Ziel), toTarget
   * (dieselben in Worten, wie Kärtchen und HUD-Zeile sie nennen), clock (Restfahrzeit in Sekunden der Uhr), mins,
   * target, next}. Ohne bekannte Stelle (dem Straßenverlauf folgen) ist dist 0 und wird nicht gezeigt.
   * Ohne Ziel nennt die Ansage nur die Straße – und ein Autobahnende, das auf dem eigenen Weg liegt.
   * next: die nächste Ausfahrt auf der eigenen Autobahn (trip.nextExit), auch wenn die Route geradeaus bleibt, mit say
   * in denselben Worten wie die Ansage (auf den letzten NEAR_M Metern Straße Meter, davor Reisekilometer) – oder null.
   *
   * Die Ausfahrt hat zwei Zustände, der Wechsel liegt am ersten Vorwegweiser (BOARD_M): Davor ist sie eine ruhige
   * Vorschau (calm: Name der Ausfahrt, darunter „in 55 km“ in Reisekilometern); ab der Tafel zählt say die Meter
   * Straße bis zur Gabelung herunter, genau wie Tafeln und Baken – und die Spurpfeile erscheinen. Meter nennt say
   * schon auf den letzten NEAR_M davor (die Vorschau heißt dann „in 1450 m“), dann ist die Tafel schon zu sehen.
   */
  instruction() {
    const trip = this.trip;
    let g = trip.guidance();
    const sec = trip.section;
    const out = {
      turn: 'none', dist: 0, km: 0, say: '', calm: false, head: '', no: 0, short: '', sub: '', road: '', lanes: null, node: -1, fork: null,
      mapKm: g.km, toTarget: g.type === 'none' ? '' : fmtDistance(g), clock: g.clock, mins: g.mins, target: trip.target, next: null,
    };
    const nx = trip.nextExit();
    if (nx) {
      nx.say = nx.dist <= Math.max(parkBoard(nx.fork), NEAR_M) ? fmtRoad(nx.dist) : fmtKm(trip.reach(nx.fork.s).km);
      out.next = nx;
    }
    // gerade unterwegs zu einem Terminal? Dann ist die Überfahrt die nächste Handlung (Stelle: das Terminal der Fahrt)
    for (const c of trip.cur.sections) {
      if (c.s1 <= trip.s) continue;
      if (c.fork && !c.fork.taken && trip.planFor(c.fork) === 'exit') break;
      if (c.kind === 'term' && !c.arrival && (c.spotS === undefined || !c.spotDone)) {
        out.turn = c.transit;
        out.dist = (c.spotS ?? c.s0) - trip.s;
        out.head = TRANSIT_NAME[c.transit] + ' nach ' + nodes[c.transitTo].name;
        out.sub = c.transit === 'flug' ? 'Bitte zum Frachtterminal' : c.transit === 'zug' ? 'Bitte auf den Autozug fahren' : 'Bitte auf die Fähre fahren';
        out.km = this.kmAhead(out.dist);
        out.say = fmtDistance(trip.reach(trip.s + out.dist));
        return out;
      }
      if (c.kind === 'stadt' && c.place === trip.target) break;
    }
    if (g.type === 'none') {
      const end = this.endAhead();
      if (!end) {
        out.head = sec.kind === 'stadt' && sec.place >= 0 ? places[sec.place].name : this.roadName(sec);
        out.sub = 'Warte auf das nächste Gebot …';
        return out;
      }
      // Ohne Ziel führt das Navi nirgendwohin. Ein Autobahnende sagt es trotzdem an: dort führen alle Spuren hinaus,
      // Schilder und Baken der Welt zeigen es – also zeigt es auch das Navi, wie eine geplante Ausfahrt
      g = { type: 'exit', dist: end.s - trip.s, toKm: trip.reach(end.s).km, fork: end, node: end.node, then: trip.afterExit(end) };
    }
    if (g.type === 'arrive') {
      out.turn = 'arrive';
      out.dist = g.dist;
      out.km = this.kmAhead(g.dist);
      out.say = out.toTarget;
      // das Ziel ist der Brunnen des Orts („Marktbrunnen, Würzburg“); passt das nicht, steht der Ort allein da (short)
      out.head = goalName(places[trip.target]);
      out.short = places[trip.target].name;
      out.sub = 'Halt am Brunnen in der Ortsmitte';
      return out;
    }
    if (g.type === 'stop') {
      // im Zweig zum geplanten Ladestopp bzw. im Ort seiner Ladesäule: Halt an der freien Säule (Entfernung wie jede
      // andere: Meter auf echter Straße)
      out.turn = 'stop';
      out.dist = g.dist;
      out.km = this.kmAhead(g.dist);
      out.say = fmtDistance(trip.reach(trip.s + g.dist));
      out.head = g.post >= 0 ? postName(g.post) : PARKS[g.park].name;
      out.sub = 'Ladestopp an der freien Säule';
      return out;
    }
    if (g.type === 'exit') {
      out.turn = 'exit';
      out.dist = g.dist;
      out.km = this.kmAhead(g.dist);
      // vor der Ausfahrt eines Ladeparks steht schon 2000 m vorher seine Tafel (parks.js parkBoard): ab dort Meter
      out.calm = g.far || g.dist > (parkBoard(g.fork) || BOARD_M);
      out.say = g.far || g.dist > Math.max(parkBoard(g.fork), NEAR_M) ? fmtKm(g.toKm) : fmtRoad(g.dist);
      out.node = g.node;
      out.fork = g.fork || null;
      // der Name wie auf dem Schild an der Gabelung (hinter dem Horizont, wo es sie noch nicht gibt, der Titel der Ansage)
      out.head = g.fork ? trip.signs(g.fork).title : g.title;
      // und ihre Nummer aus dem Kästchen der Tafeln (Bildschirm und HUD zeigen sie genauso davor)
      out.no = g.fork ? trip.signs(g.fork).no : 0;
      // am Autobahnende, solange hinter der Rampe noch nichts gebaut ist: der Name der Ausfahrt, an der sie endet
      out.sub = thenText(g.then) || (g.fork && g.fork.forced ? nodeTitle(g.node) : '');
      if (g.then && (g.then.type === 'ab' || g.then.type === 'land')) out.road = g.then.road;
      // Spurpfeile ab dem 1000-m-Schild: vier Spuren geradeaus, rechts der Verzögerungsstreifen, der abgeht (am
      // Autobahnende führen alle Spuren hinaus)
      if (!out.calm && sec.kind === 'ab' && g.fork) out.lanes = { n: 5, use: g.fork.forced ? [0, 1, 2, 3, 4] : [4], exit: true };
      return out;
    }
    // dem Straßenverlauf folgen (die nächste Handlung liegt hinter dem Horizont): Straße und Richtung wie auf den
    // Schildern – die nächste Straße auf dem eigenen Weg, sonst die geplante am Ende des Wegs (wie guidance().then)
    const on = sec.kind === 'ab' || sec.kind === 'land';
    const next = trip.cur.sections.find((c) => c.s1 > trip.s && (c.kind === 'ab' || c.kind === 'land'));
    const fr = trip.cur.frontier;
    const then = fr && fr.t === 'node' ? trip.afterExitAt(fr.n) : null;
    let road = '';
    let towards = '';
    let kind = '';
    if (next) {
      road = deRoad(next.de).label;
      towards = deTowards(next.de).name;
      kind = next.kind;
    } else if (then && (then.type === 'ab' || then.type === 'land')) {
      road = then.road;
      towards = then.towards;
      kind = then.type;
    }
    out.turn = on ? 'straight' : 'merge';
    if (road) {
      out.road = road;
      out.head = on ? road + ' folgen' : kind === 'ab' ? 'Auffahrt ' + road : 'Weiter auf der ' + road;
      out.sub = 'Richtung ' + towards;
    } else if (sec.place >= 0) out.head = 'Richtung ' + places[sec.place].name;
    else out.head = 'Der Straße folgen';
    // am Ende des bekannten Wegs: Ziel oder Überfahrt als „dann …“
    if (then && (then.type === 'ziel' || TRANSIT_NAME[then.type])) out.sub = thenText(then);
    return out;
  }
  /** Das Autobahnende auf dem eigenen Weg: die Gabelung, an der alle Spuren hinausführen, oder null. */
  endAhead() {
    const trip = this.trip;
    for (const c of trip.cur.sections) {
      const f = c.fork;
      if (f && !f.taken && f.forced && f.s > trip.s) return f;
    }
    return null;
  }
  /** Knoten in Kartenkoordinaten. */
  nodeXY(n) {
    return NODE_XY[n];
  }
  /** Reisekilometer bis zum Ziel (trip.reach: eine Überfahrt zählt mit, bis das Auto drüben ist). */
  remainingKm(ins) {
    return ins.mapKm;
  }
  /**
   * Wo die Fahrt gerade ist (Ansage ohne Ziel): auf Autobahn und Landstraße Straße und Richtung, auf der Ausfahrt ihr
   * Name. Zubringer, Verbindung und Auffahrt heißen nach dem, worauf sie führen – wer aus dem Ort zur Autobahn
   * fährt, ist auf keiner „Ausfahrt“.
   */
  roadName(sec) {
    if (sec.de >= 0 && (sec.kind === 'ab' || sec.kind === 'land')) return deRoad(sec.de).label + ' Richtung ' + deTowards(sec.de).name;
    if (sec.kind === 'zub' || sec.kind === 'conn' || sec.kind === 'auf') {
      const next = this.trip.cur.sections.find((c) => c.s0 >= sec.s1 && (c.kind === 'ab' || c.kind === 'land' || c.kind === 'stadt' || c.kind === 'park'));
      if (next && next.kind === 'park') return 'Richtung ' + PARKS[next.park].name;
      if (next && next.kind === 'stadt' && next.place >= 0) return 'Richtung ' + places[next.place].name;
      if (next && next.kind !== 'stadt' && next.de >= 0) return (next.kind === 'ab' ? 'Auffahrt ' : 'Weiter auf der ') + deRoad(next.de).label;
      // aus dem Ort hinaus, solange die Fahrt die Straße hinter dem Zubringer noch nicht geplant hat
      if (sec.kind === 'zub' && sec.back) return 'Der Straße folgen';
    }
    if (sec.kind === 'park') return PARKS[sec.park].name;
    if (sec.node >= 0) return nodeTitle(sec.node);
    return '';
  }
}

