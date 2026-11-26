// Brücken: wo der Weg auf der Karte über Wasser führt (Flüsse und Seen aus water.js), baut die Welt eine Brücke –
// was die Karte als Brücke zeigt, ist in der Welt eine, und umgekehrt (COMMON.md §9). Rein rechnerisch, läuft auch
// unter Node; die eine Wahrheit für alle, die Brücken kennen müssen: der Kurs legt sie gerade und eben
// (game/course.js), die Welt baut Wasser, Ufer und Brücke (world/xxl/bridges.js), das Navi zeichnet den Weg so, dass das
// Auto genau dann über den Fluss der Karte fährt, wenn der Wagen in der Welt mitten auf der Brücke ist
// (map/navroute.js), und die Nahansicht zeigt dasselbe Wasser (map/roadahead.js).
//
// Die Stellen hängen nur an fester Geometrie, nie am Weg der Fahrt: Autobahn und Landstraße an ihrer Kante (die Linie,
// die die Karte zeichnet), Zubringer an der geraden Linie vom Knoten zum Ortsrand (towns: townEdge). Den Rest des
// Wegs – Rampen, Verbindungsfahrbahnen, Ortsdurchfahrten – hält der Abgleich des Wassers (tools/map/wasser-netz.mjs)
// trocken: um jeden Knoten und Ortspunkt liegt ein Kreis ohne Wasser. Die drei Flussorte (rivers.js) sind die
// Ausnahme: dort liegt die Brücke in der Ortsdurchfahrt, mit ihren Wahrzeichen (townRiverOnMap).
//
// Die Welt ist auf der offenen Strecke gerafft (rund 19 Kartenmeter je Meter Straße, graph.js K): Ein Fluss ist dort
// so breit wie in Wahrheit, sein Wasser auf der Karte aber nur ein Strich. Die Brücke steht deshalb an der Stelle des
// Abschnitts, die seinem Anteil des Kartenwegs entspricht, und das Navi teilt seinen Weg dort, damit das Auto der Karte
// über den Strich fährt, wenn der Wagen über die Mitte der Brücke fährt. Wo die Welt keinen Platz hat (Knotenpunkte,
// Szenenwechsel im Wald, eine zweite Brücke dicht daneben), rückt die Brücke ein Stück; das Navi rückt mit.
import { edges, nodes, places, deEdge, townLen } from './graph.js';
import { edgeLine, PLACE_BY_INDEX, townKm, kmPerUnit, project } from './mapview.js';
import { waterData } from './water.js';
import { riverOf } from './rivers.js';

/**
 * Maße (Meter der Welt). half: halbe Breite des Wassers je Klasse (Strom, Fluss, kleiner Fluss) · lake: so breit
 * höchstens ein See unter einer Brücke (halb) · drop: Wasserspiegel unter der Straße je Klasse · bank: Böschung je
 * Ufer (waagerecht) · slack: so weit über die Böschung hinaus bleibt die Straße gerade und eben (der Fluss läuft schräg
 * bis in den Dunst, dazu der Übergang) · gap: mindestens so viel Land zwischen den Ruhezonen zweier Brücken · deg:
 * Winkel gegen die Senkrechte zur Straße (höchstens) · reach: so weit nach beiden Seiten reicht das Wasser (Dunst ab
 * 1550 m dicht) · win: so weit vom Anfang und Ende eines Abschnitts bleibt die Mitte jeder Ruhezone weg (Knotenpunkte,
 * Szenenwechsel im Wald, Ortstafel).
 */
export const BRIDGE = {
  half: [95, 42, 20],
  lake: 240,
  drop: [6.4, 5.2, 3.8],
  bank: 9,
  slack: 110,
  gap: 30,
  deg: 4,
  reach: 1500,
  win: { ab: [420, 420], land: [220, 220], zub: [420, 90], back: [640, 140] },
};
/** Halbe Länge der geraden, ebenen Ruhezone um eine Brücke mit halber Wasserbreite half. */
export const zoneHalf = (half) => half + BRIDGE.bank + BRIDGE.slack;

const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
function unit(x, y) {
  const l = Math.hypot(x, y);
  return l > 1e-15 ? [x / l, y / l] : [0, -1];
}
function segCross(ax, ay, bx, by, cx, cy, dx, dy) {
  const rx = bx - ax;
  const ry = by - ay;
  const sx = dx - cx;
  const sy = dy - cy;
  const den = rx * sy - ry * sx;
  if (Math.abs(den) < 1e-20) return null;
  const qx = cx - ax;
  const qy = cy - ay;
  const t = (qx * sy - qy * sx) / den;
  const u = (qx * ry - qy * rx) / den;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1 ? [t, u] : null;
}
function boxOf(P) {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (let i = 0; i < P.length; i += 2) {
    x0 = Math.min(x0, P[i]);
    x1 = Math.max(x1, P[i]);
    y0 = Math.min(y0, P[i + 1]);
    y1 = Math.max(y1, P[i + 1]);
  }
  return [x0, y0, x1, y1];
}
const hit = (a, b) => a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1];

/**
 * Wasser unter dem Linienzug P = [x, y, …] (Kartenkoordinaten), nach Bogenlänge geordnet: [{a (Bogenlänge, Einheiten),
 * x, y (die Stelle), name, cls (Klasse, 3 = See), span (Länge über dem Wasser eines Sees, Einheiten; 0 bei Flüssen),
 * sin (Winkel des Wassers gegen die Senkrechte zum Weg, mit Vorzeichen: + = sein rechtes Ende liegt voraus); bei
 * Flüssen dazu ri, j, t (Fluss in water.js, seine Strecke und die Stelle darauf, für waterAlong)}].
 */
export function lineWater(P) {
  const W = waterData();
  const box = boxOf(P);
  const A = [0];
  for (let k = 2; k < P.length; k += 2) A.push(A[A.length - 1] + Math.hypot(P[k] - P[k - 2], P[k + 1] - P[k - 1]));
  const out = [];
  const onSeg = (k, u) => A[k] + (A[k + 1] - A[k]) * u;
  for (let ri = 0; ri < W.rivers.length; ri++) {
    const r = W.rivers[ri];
    if (!hit(box, r.box)) continue;
    const R = r.pts;
    for (let j = 0; j + 3 < R.length; j += 2) {
      for (let k = 0; k + 3 < P.length; k += 2) {
        const q = segCross(P[k], P[k + 1], P[k + 2], P[k + 3], R[j], R[j + 1], R[j + 2], R[j + 3]);
        if (!q) continue;
        const [dx, dy] = unit(P[k + 2] - P[k], P[k + 3] - P[k + 1]);
        let [rx, ry] = unit(R[j + 2] - R[j], R[j + 3] - R[j + 1]);
        // Richtung des Flusses: zur rechten Seite des Wegs (y zählt nach Süden: rechts ist (−dy, dx))
        if (rx * -dy + ry * dx < 0) [rx, ry] = [-rx, -ry];
        out.push({ a: onSeg(k / 2, q[0]), x: P[k] + (P[k + 2] - P[k]) * q[0], y: P[k + 1] + (P[k + 3] - P[k + 1]) * q[0], name: r.name, cls: r.cls, span: 0, sin: rx * dx + ry * dy, ri, j, t: q[1] });
      }
    }
  }
  for (const l of W.lakes) {
    if (!hit(box, l.box)) continue;
    const R = l.pts;
    const n = R.length / 2;
    const xs = [];
    for (let j = 0; j < n; j++) {
      const j2 = (j + 1) % n;
      for (let k = 0; k + 3 < P.length; k += 2) {
        const q = segCross(P[k], P[k + 1], P[k + 2], P[k + 3], R[j * 2], R[j * 2 + 1], R[j2 * 2], R[j2 * 2 + 1]);
        if (q) xs.push(onSeg(k / 2, q[0]));
      }
    }
    xs.sort((p, q) => p - q);
    // drinnen ist, wo zwischen zwei Kreuzungen die Mitte im See liegt
    for (let i = 0; i + 1 < xs.length; i++) {
      const am = (xs[i] + xs[i + 1]) / 2;
      const m = pointAt(P, A, am);
      if (!inRing(R, m[0], m[1])) continue;
      out.push({ a: am, x: m[0], y: m[1], name: l.name, cls: 3, span: xs[i + 1] - xs[i], sin: 0 });
    }
  }
  out.sort((p, q) => p.a - q.a);
  return out;
}
/**
 * Punkt auf dem Wasser der Stelle w (lineWater), dist Karteneinheiten den Fluss entlang (Vorzeichen: Richtung); dazu
 * die Richtung des Flusses dort: {x, y, dx, dy}. null bei Seen und wenn der Fluss vorher endet.
 */
export function waterAlong(w, dist) {
  if (!(w.ri >= 0)) return null;
  const R = waterData().rivers[w.ri].pts;
  const n = R.length / 2;
  const sg = dist >= 0 ? 1 : -1;
  let left = Math.abs(dist);
  let x = R[w.j * 2] + (R[w.j * 2 + 2] - R[w.j * 2]) * w.t;
  let y = R[w.j * 2 + 1] + (R[w.j * 2 + 3] - R[w.j * 2 + 1]) * w.t;
  for (let k = sg > 0 ? w.j + 1 : w.j; k >= 0 && k < n; k += sg) {
    const L = Math.hypot(R[k * 2] - x, R[k * 2 + 1] - y);
    if (L >= left) {
      const [dx, dy] = unit(R[k * 2] - x, R[k * 2 + 1] - y);
      return { x: x + dx * left, y: y + dy * left, dx: dx * sg, dy: dy * sg };
    }
    left -= L;
    x = R[k * 2];
    y = R[k * 2 + 1];
  }
  return null;
}
function inRing(R, x, y) {
  let c = false;
  const n = R.length / 2;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = R[i * 2];
    const yi = R[i * 2 + 1];
    const xj = R[j * 2];
    const yj = R[j * 2 + 1];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}
function pointAt(P, A, a) {
  let k = 0;
  while (k + 2 < A.length && A[k + 1] < a) k++;
  const t = clamp((a - A[k]) / (A[k + 1] - A[k] || 1), 0, 1);
  return [P[k * 2] + (P[k * 2 + 2] - P[k * 2]) * t, P[k * 2 + 1] + (P[k * 2 + 3] - P[k * 2 + 1]) * t];
}

const edgeCache = new Map();
/** Wasser unter der Kante i (Linie der Karte, vom Knoten a zum Knoten b) mit ihrer Länge len (Einheiten). */
export function edgeWater(i) {
  let w = edgeCache.get(i);
  if (!w) {
    const P = edgeLine(i);
    let len = 0;
    for (let k = 2; k < P.length; k += 2) len += Math.hypot(P[k] - P[k - 2], P[k + 1] - P[k - 1]);
    w = { len, list: edges[i].kind === 'ab' || edges[i].kind === 'land' ? lineWater(P) : [] };
    edgeCache.set(i, w);
  }
  return w;
}

// --- Orte ---------------------------------------------------------------------------------------------------------
const townCache = new Map();
/** So weit bleibt der Weg der Karte im Ort vor dem Wasser (km), mindestens so weit reicht er hinaus. */
const DRY = { margin: 0.12, min: 0.05 };
/**
 * Trockener Punkt des Orts place in Richtung (ux, uy) (Einheitsvektor vom Ortspunkt weg), höchstens d Einheiten weit:
 * Liegt davor Wasser, endet er DRY.margin davor (der Ortspunkt selbst liegt trocken, tools/map/wasser-netz.mjs).
 * {x, y, tx, ty (zum Ortspunkt), d}.
 */
export function townEdgeDir(place, ux, uy, d) {
  const C = PLACE_BY_INDEX[place];
  const k = kmPerUnit(C.y);
  const w = lineWater([C.x, C.y, C.x + ux * d * 1.0001, C.y + uy * d * 1.0001]);
  if (w.length) d = Math.max(Math.min(d, w[0].a - (w[0].span || 0) / 2 - DRY.margin / k), Math.min(d, DRY.min / k));
  return { x: C.x + ux * d, y: C.y + uy * d, tx: -ux, ty: -uy, d };
}
/**
 * Rand des Orts place zum Knoten node hin, wie die Karte ihn fährt: dort endet der Zubringer und beginnt die
 * Ortsdurchfahrt, dort verlässt sie den Ort wieder (0,85 Halbmesser weit, höchstens bis zum Knoten). Liegt zwischen
 * Ortspunkt und Rand Wasser, rückt der Rand vor das Wasser (townEdgeDir; der Zubringer führt dann über die Brücke, die
 * Ortsdurchfahrt bleibt am Ufer des Ortspunkts) – auch in einem Flussort (rivers.js): Hinein führt dort die Brücke der
 * Ortsdurchfahrt (townRiverOnMap), hinaus der Zubringer zurück über eine eigene. {x, y, tx, ty (vom Knoten zum
 * Ortspunkt), d (Abstand zum Ortspunkt)}.
 */
export function townEdge(place, node) {
  const key = place * 100003 + node;
  let e = townCache.get(key);
  if (e) return e;
  const C = PLACE_BY_INDEX[place];
  const N = project(nodes[node].lat, nodes[node].lon);
  const [ux, uy] = unit(N.x - C.x, N.y - C.y);
  const R = townKm(places[place].pop) / kmPerUnit(C.y);
  e = townEdgeDir(place, ux, uy, Math.min(R * 0.85, Math.hypot(N.x - C.x, N.y - C.y)));
  townCache.set(key, e);
  return e;
}
/** Rand des Orts place zum Ort other hin (Zubringer von Ort zu Ort am selben Knoten, crossings.js zubLine). */
export function townEdgeTo(place, other) {
  const C = PLACE_BY_INDEX[place];
  const O = PLACE_BY_INDEX[other];
  const [ux, uy] = unit(O.x - C.x, O.y - C.y);
  const R = townKm(places[place].pop) / kmPerUnit(C.y);
  return townEdgeDir(place, ux, uy, Math.min(R * 0.85, Math.hypot(O.x - C.x, O.y - C.y) * 0.45));
}

const zubCache = new Map();
/**
 * Feste Linie eines Zubringers zu oder von einem Ort: hin vom Knoten zum Ortsrand (townEdge; zu einem Flussort zum Tor,
 * townRiverOnMap), von Ort zu Ort am selben Knoten (from) zwischen den Rändern der beiden, zurück vom Ortsrand zum
 * Knoten. Das Navi fährt sie, die Welt baut eine Brücke, wo sie Wasser kreuzt. null für die anderen (zum Ladepark, zum
 * Terminal, ohne Ort) und wenn sie keine Länge hat. {P: [x0, y0, x1, y1], len, list (lineWater)}.
 */
export function zubLine(sec) {
  if (sec.kind !== 'zub' || sec.transitTo !== undefined || sec.park >= 0 || !(sec.place >= 0) || !(sec.node >= 0)) return null;
  const p = places[sec.place];
  if (!p || p.node !== sec.node) return null;
  const from = !sec.back && sec.from >= 0 && sec.from !== sec.place ? sec.from : -1;
  const key = `${sec.place}|${sec.node}|${sec.back ? 1 : 0}|${from}`;
  let z = zubCache.get(key);
  if (z === undefined) {
    const N = project(nodes[sec.node].lat, nodes[sec.node].lon);
    let P;
    if (sec.back) {
      const E = townEdge(sec.place, sec.node);
      P = [E.x, E.y, N.x, N.y];
    } else if (from >= 0) {
      const A = townEdgeTo(from, sec.place);
      const B = townEdgeTo(sec.place, from);
      P = [A.x, A.y, B.x, B.y];
    } else {
      // hin zu einem Flussort: bis zum Tor seiner Ortsdurchfahrt (über den Fluss führt deren Brücke)
      const tr = townRiverOnMap(sec.place);
      const E = tr ? { x: tr.gate[0], y: tr.gate[1] } : townEdge(sec.place, sec.node);
      P = [N.x, N.y, E.x, E.y];
    }
    const len = Math.hypot(P[2] - P[0], P[3] - P[1]);
    z = len > 1e-9 ? { P, len, list: lineWater(P) } : null;
    zubCache.set(key, z);
  }
  return z;
}

/**
 * Der Fluss eines Flussorts (rivers.js) auf der Karte: wo die Linie vom Knoten zum Ortspunkt sein Wasser kreuzt
 * (x, y: dort liegt die Brücke der Ortsdurchfahrt), Richtung tx, ty (zum Ortspunkt), Abstand d zum Ortspunkt, k
 * (Karteneinheiten je Meter der Ortsdurchfahrt: im Ort ist die Karte nicht gerafft), gate (Tor: hier beginnt die
 * Ortsdurchfahrt, rv.u Meter vor der Brücke), rv (der Fluss der Welt), name (wie die Karte ihn nennt) und w (die Stelle,
 * lineWater); null, wenn
 * der Ort keinen hat oder die Linie ihn nicht kreuzt.
 */
export function townRiverOnMap(place) {
  const p = places[place];
  const rv = p && p.node >= 0 ? riverOf(p.key, townLen(p.pop)) : null;
  if (!rv) return null;
  const key = -1 - place;
  let r = townCache.get(key);
  if (r !== undefined) return r;
  const C = PLACE_BY_INDEX[place];
  const N = project(nodes[p.node].lat, nodes[p.node].lon);
  const w = lineWater([C.x, C.y, N.x, N.y]).filter((q) => q.cls < 3);
  const [ux, uy] = unit(N.x - C.x, N.y - C.y);
  const k = 0.001 / kmPerUnit(C.y);
  r = null;
  // das Tor muss diesseits des Knotens liegen (sonst führe der Zubringer zurück)
  if (w.length && w[0].a + rv.u * k < Math.hypot(N.x - C.x, N.y - C.y) * 0.9) {
    const q = w[0];
    r = { x: q.x, y: q.y, tx: -ux, ty: -uy, d: q.a, k, gate: [q.x + ux * rv.u * k, q.y + uy * rv.u * k], rv, name: q.name, w: q };
  }
  townCache.set(key, r);
  return r;
}

// --- Abschnitte der Fahrt -------------------------------------------------------------------------------------------
/** Halbe Breite des Wassers in der Welt für eine Stelle w (lineWater) bei k Weltmetern je Karteneinheit. */
function halfOf(w, k) {
  if (w.cls < 3) return BRIDGE.half[w.cls];
  return clamp((w.span * k) / 2, BRIDGE.half[0], BRIDGE.lake);
}

/**
 * Stellen auf dem Abschnitt: d = gewünschte Lagen (Meter ab Anfang), z = halbe Ruhezonen, Fenster [w0, w1]. Rückt sie
 * ins Fenster und auseinander (mindestens BRIDGE.gap zwischen den Zonen), so wenig wie möglich. Passt nicht alles
 * hinein, rücken die beiden nächsten zu einer Brücke zusammen (ein breiteres Wasser). Liefert [{s, items}].
 */
function spread(list, w0, w1) {
  let G = list.map((q) => ({ d: q.d, z: q.z, items: [q] }));
  for (let guard = 0; guard < 64 && G.length; guard++) {
    const n = G.length;
    const p = G.map((g) => g.d);
    for (let i = 0; i < n; i++) p[i] = Math.max(p[i], w0 + G[i].z, i ? p[i - 1] + G[i - 1].z + BRIDGE.gap + G[i].z : -Infinity);
    for (let i = n - 1; i >= 0; i--) p[i] = Math.min(p[i], w1 - G[i].z, i + 1 < n ? p[i + 1] - G[i + 1].z - BRIDGE.gap - G[i].z : Infinity);
    let ok = true;
    for (let i = 0; i < n; i++) if (p[i] < w0 + G[i].z - 1e-6 || (i && p[i] - p[i - 1] < G[i].z + G[i - 1].z + BRIDGE.gap - 1e-6)) ok = false;
    if (ok || n === 1) {
      // eine allein, die nicht ins Fenster passt: in seine Mitte
      if (n === 1 && !ok) p[0] = (w0 + w1) / 2;
      return G.map((g, i) => ({ s: p[i], z: g.z, items: g.items }));
    }
    // die beiden nächsten zusammen
    let bi = 0;
    for (let i = 1; i + 1 < n; i++) if (G[i + 1].d - G[i].d < G[bi + 1].d - G[bi].d) bi = i;
    const a = G[bi];
    const b = G[bi + 1];
    G.splice(bi, 2, { d: (a.d + b.d) / 2, z: Math.max(a.z, b.z) + Math.min(a.z, b.z) * 0.5, items: [...a.items, ...b.items] });
  }
  return [];
}

const secCache = new WeakMap();
/**
 * Brücken eines Abschnitts der Fahrt (trip.js), nach Lage geordnet: [{s (Meter ab Abschnittsanfang: Mitte des
 * Wassers), half, drop, ang (Winkel des Flusses gegen die Senkrechte zur Straße, rad, + = rechtes Ende voraus), name,
 * cls, zone (halbe Länge der geraden, ebenen Ruhezone), map: [{x, y}] (die Stellen auf der Karte, über die das Auto
 * fährt, während der Wagen über die Mitte dieser Brücke fährt, mit Name, Klasse und Lage auf dem Fluss wie lineWater), key}]. Ortsdurchfahrten: [] (die Flussorte bauen ihren
 * Fluss selbst, rivers.js).
 */
export function sectionWater(sec) {
  let out = secCache.get(sec);
  if (out) return out;
  out = [];
  const L = sec.len;
  let raw = null;
  let mapLen = 0;
  let win = null;
  let ref = '';
  if ((sec.kind === 'ab' || sec.kind === 'land') && sec.de >= 0) {
    const e = deEdge(sec.de);
    const w = edgeWater(e.i);
    mapLen = w.len;
    raw = sec.de & 1 ? w.list.map((q) => ({ ...q, a: w.len - q.a, sin: -q.sin })).reverse() : w.list;
    win = BRIDGE.win[sec.kind];
    ref = 'K' + e.i;
  } else if (sec.kind === 'zub') {
    const z = zubLine(sec);
    if (z) {
      mapLen = z.len;
      raw = z.list;
      win = sec.back ? BRIDGE.win.back : BRIDGE.win.zub;
      ref = 'Z' + sec.place + (sec.back ? 'z' : 'h');
    }
  }
  if (raw && raw.length && mapLen > 0) {
    const k = L / mapLen; // Weltmeter je Karteneinheit
    const list = raw.map((q) => {
      const half = halfOf(q, k);
      return { d: (q.a / mapLen) * L, z: zoneHalf(half), half, q };
    });
    const w0 = Math.min(win[0], L / 2);
    const w1 = Math.max(L - win[1], L / 2);
    for (const g of spread(list, w0, w1)) {
      const items = g.items;
      const main = items.reduce((m, it) => (it.half > m.half ? it : m), items[0]);
      const half = items.length > 1 ? g.z - BRIDGE.bank - BRIDGE.slack : main.half;
      const cls = Math.min(...items.map((it) => it.q.cls));
      const sgn = main.q.sin >= 0 ? 1 : -1;
      const ang = sgn * Math.min(BRIDGE.deg, 1 + Math.abs(Math.asin(clamp(main.q.sin, -1, 1))) * (180 / Math.PI) * 0.06) * (Math.PI / 180);
      out.push({
        s: g.s,
        half,
        drop: BRIDGE.drop[Math.min(cls, 2)],
        ang,
        name: main.q.name,
        cls,
        zone: g.z,
        map: items.map((it) => ({ x: it.q.x, y: it.q.y, a: it.q.a, name: it.q.name, cls: it.q.cls, ri: it.q.ri, j: it.q.j, t: it.q.t })),
        key: ref + ':' + Math.round(main.q.a * 1e5),
      });
    }
  }
  secCache.set(sec, out);
  return out;
}

/**
 * Wie lang ein Zubringer mindestens sein muss, damit seine Brücken Platz haben (für trip.js): 0 ohne Wasser. back:
 * der Zubringer zurück, from: der Ort davor (von Ort zu Ort).
 */
export function zubWaterLen(place, node, back = false, from = -1) {
  const z = zubLine({ kind: 'zub', place, node, back, park: -1, from });
  if (!z || !z.list.length) return 0;
  const win = back ? BRIDGE.win.back : BRIDGE.win.zub;
  let need = win[0] + win[1];
  for (const q of z.list) need += 2 * zoneHalf(q.cls < 3 ? BRIDGE.half[q.cls] : BRIDGE.lake) + BRIDGE.gap;
  return Math.ceil(need / 10) * 10;
}
