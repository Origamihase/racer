// Die Karte von „Navi ferngesteuert XXL“ als Graph: Orte aus dem SkylineTV-LIVE-Wiki, verbunden durch echte
// Autobahnen und Landstraßen, dazu Fähren, Autozüge und Luftfracht. Knoten sind Ausfahrten, Kreuze und Endpunkte.
// Diese Datei kennt nur die Karte (keine Grafik, kein Spielzustand) und läuft auch unter Node.
import { PLACES, NODES, ROADS, EDGES } from './data.js';

export const KINDS = ['ab', 'land', 'faehre', 'zug', 'flug'];
export const NODE_KINDS = ['ort', 'as', 'kreuz', 'via'];

/** Maßstab: 1 Spielmeter entspricht 19 Kartenmetern (wie beim Euro Truck Simulator 2). */
export const K = 19;

export const places = PLACES.map(([key, name, lat, lon, cc, n, pop], i) => ({ i, key, name, lat, lon, cc, n, pop, node: -1, zubKm: 0 }));
export const nodes = NODES.map(([id, name, lat, lon, kind, cc, pop, pl], i) => ({
  i,
  id,
  name,
  lat,
  lon,
  kind: NODE_KINDS[kind],
  cc,
  pop,
  places: pl.map(([place, zubKm]) => ({ place, zubKm })),
  edges: [], // gerichtete Kanten, die hier losfahren
}));
export const roads = ROADS.map(([id, label, kind, cc, ns], i) => ({ i, id, label, kind: KINDS[kind], cc, nodes: ns }));
export const edges = EDGES.map(([a, b, road, km, pts, tA, tB], i) => ({
  i,
  a,
  b,
  road,
  kind: roads[road].kind,
  km,
  pts, // Zwischenpunkte [Breite, Länge] von a nach b
  towards: [tB, tA], // Fernziel (Knoten) je Fahrtrichtung: [a→b, b→a]
}));
for (const n of nodes) for (const p of n.places) Object.assign(places[p.place], { node: n.i, zubKm: p.zubKm });

// --- Gerichtete Kanten: de = 2·Kante + Richtung (0: a→b, 1: b→a) ---------------------------
export const deEdge = (de) => edges[de >> 1];
export const deFrom = (de) => (de & 1 ? edges[de >> 1].b : edges[de >> 1].a);
export const deTo = (de) => (de & 1 ? edges[de >> 1].a : edges[de >> 1].b);
export const deRev = (de) => de ^ 1;
export const deKind = (de) => edges[de >> 1].kind;
export const deRoad = (de) => roads[edges[de >> 1].road];
/** Fernziel in Fahrtrichtung (für blaue Schilder). */
export const deTowards = (de) => nodes[edges[de >> 1].towards[de & 1]];
for (const e of edges) {
  nodes[e.a].edges.push(e.i * 2);
  nodes[e.b].edges.push(e.i * 2 + 1);
}

const RAD = Math.PI / 180;
/** Luftlinie in km. */
export function distKm(lat1, lon1, lat2, lon2) {
  const h = Math.sin(((lat2 - lat1) * RAD) / 2) ** 2 + Math.cos(lat1 * RAD) * Math.cos(lat2 * RAD) * Math.sin(((lon2 - lon1) * RAD) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}
/** Kurswinkel (Grad, 0 = Norden, im Uhrzeigersinn) von Punkt 1 nach Punkt 2. */
export function bearing(lat1, lon1, lat2, lon2) {
  const y = Math.sin((lon2 - lon1) * RAD) * Math.cos(lat2 * RAD);
  const x = Math.cos(lat1 * RAD) * Math.sin(lat2 * RAD) - Math.sin(lat1 * RAD) * Math.cos(lat2 * RAD) * Math.cos((lon2 - lon1) * RAD);
  return (Math.atan2(y, x) / RAD + 360) % 360;
}
/** Alle Punkte einer gerichteten Kante von Anfang bis Ende: [[Breite, Länge], …]. */
export function dePoints(de) {
  const e = edges[de >> 1];
  const a = nodes[e.a];
  const b = nodes[e.b];
  const pts = [[a.lat, a.lon], ...e.pts, [b.lat, b.lon]];
  return de & 1 ? pts.reverse() : pts;
}
/** Position (Breite, Länge) und Kurs nach dem Anteil t (0…1) einer gerichteten Kante. */
export function dePos(de, t) {
  const pts = dePoints(de);
  const seg = [];
  let total = 0;
  for (let i = 0; i + 1 < pts.length; i++) {
    const d = distKm(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]);
    seg.push(d);
    total += d;
  }
  let rest = Math.min(Math.max(t, 0), 1) * total;
  for (let i = 0; i < seg.length; i++) {
    if (rest <= seg[i] || i === seg.length - 1) {
      const f = seg[i] > 0 ? Math.min(rest / seg[i], 1) : 0;
      const [la1, lo1] = pts[i];
      const [la2, lo2] = pts[i + 1];
      return { lat: la1 + (la2 - la1) * f, lon: lo1 + (lo2 - lo1) * f, heading: bearing(la1, lo1, la2, lo2) };
    }
    rest -= seg[i];
  }
  return { lat: pts[0][0], lon: pts[0][1], heading: 0 };
}
const headOut = (de) => {
  const p = dePoints(de);
  return bearing(p[0][0], p[0][1], p[1][0], p[1][1]);
};
const headIn = (de) => {
  const p = dePoints(de);
  const n = p.length;
  return bearing(p[n - 2][0], p[n - 2][1], p[n - 1][0], p[n - 1][1]);
};
/** Abbiegewinkel von einer ankommenden auf eine abgehende Kante: −180…180 Grad, positiv = nach rechts. */
export function turnAngle(deIn, deOut) {
  return ((headOut(deOut) - headIn(deIn) + 540) % 360) - 180;
}

// --- Spiellängen --------------------------------------------------------------------------
const LMIN = { ab: 1400, land: 1000 };
const lenCache = new Map();
/**
 * Länge einer Kante auf der Spielstrecke in Metern. Bis 150 km gilt der Maßstab 1:19, sehr lange Etappen
 * (Interstates, Lappland) werden gestaucht, damit zwischen zwei Ausfahrten höchstens rund acht Minuten liegen.
 * Fähren, Züge und Flüge haben keine Strecke (Überblendung).
 */
export function edgeLen(e) {
  if (e.kind !== 'ab' && e.kind !== 'land') return 0;
  let L = lenCache.get(e.i);
  if (L === undefined) {
    const km = e.km <= 150 ? e.km : 150 + 60 * Math.log(1 + (e.km - 150) / 60);
    L = Math.max(LMIN[e.kind], Math.round((km * 1000) / K / 10) * 10);
    lenCache.set(e.i, L);
  }
  return L;
}

// --- Geradeaus ----------------------------------------------------------------------------
const straightCache = new Int32Array(edges.length * 2).fill(-2);
/**
 * Wohin führt die Fahrbahn, wenn man an einem Knoten nicht abfährt? Dieselbe Straße geht vor; endet sie hier,
 * gilt die Fortsetzung mit dem kleinsten Knick (gleiche Straßenart). −1 = die Straße endet (alle müssen raus).
 */
export function straight(de) {
  let st = straightCache[de];
  if (st !== -2) return st;
  st = -1;
  const e = edges[de >> 1];
  if (e.kind === 'ab' || e.kind === 'land') {
    let bestAngle = 1e9;
    let same = -1;
    for (const out of nodes[deTo(de)].edges) {
      if (out === (de ^ 1)) continue;
      const o = edges[out >> 1];
      if (o.kind !== e.kind) continue;
      if (o.road === e.road) same = out;
      const ang = Math.abs(turnAngle(de, out));
      if (ang < bestAngle) {
        bestAngle = ang;
        st = out;
      }
    }
    if (same >= 0) st = same;
    else if (bestAngle > 100) st = -1; // fast eine Kehrtwende ist kein „geradeaus“
  }
  straightCache[de] = st;
  return st;
}

// --- Routen -------------------------------------------------------------------------------
// Zustände: 0 … 2E−1 = unterwegs auf einer gerichteten Kante (Ankunft an ihrem Endknoten steht bevor),
//           2E + n   = am Knoten n abseits der Autobahn (Ausfahrt genommen, im Ort, am Terminal): freie Wahl.
const NE = edges.length * 2;
export const stateOfNode = (n) => NE + n;
export const isNodeState = (st) => st >= NE;
export const nodeOfState = (st) => st - NE;

/**
 * Die Route rechnet wie ein echtes Navi in Kartenkilometern (Landstraße zählt anderthalbfach, Abfahren und
 * Umsteigen kosten ein paar Kilometer extra), nicht in Spielsekunden: so stimmen die Wege mit der Landkarte überein.
 */
export const COST = {
  land: 1.5, // Faktor für Landstraßen-Kilometer
  town: 2, // Ortsdurchfahrt an der Landstraße
  exit: 1, // Ausfahrt nehmen
  enterAb: 4, // Verbindungsrampe, Auffahrt, Einfädeln
  enterLand: 0.5,
  transit: { faehre: (km) => 60 + km * 0.5, zug: (km) => 40 + km, flug: (km) => 400 + km * 0.05 },
};
/** Richtgeschwindigkeiten in m/s für die Schätzung der Fahrzeit auf der Spielstrecke. */
export const PACE = { ab: 38, land: 24, stadt: 13, rampe: 21, transit: 25 };
/** Länge einer Ortsdurchfahrt in Spielmetern nach Einwohnerzahl. */
export function townLen(pop) {
  return pop >= 300000 ? 1200 : pop >= 50000 ? 800 : pop >= 5000 ? 500 : 300;
}
/** Länge des Zubringers in Spielmetern. */
export function zubLen(zubKm) {
  return Math.min(2500, Math.max(450, Math.round((zubKm * 1000) / K / 10) * 10));
}

let TRANS = null; // Übergänge vorwärts: je Zustand [{to, cost, km, type, de}]
let BACK = null; // rückwärts
function buildTransitions() {
  const n = NE + nodes.length;
  TRANS = Array.from({ length: n }, () => []);
  BACK = Array.from({ length: n }, () => []);
  const add = (from, to, cost, km, secs, type, de = -1) => {
    const t = { from, to, cost, km, secs, type, de };
    TRANS[from].push(t);
    BACK[to].push(t);
  };
  for (let de = 0; de < NE; de++) {
    const e = edges[de >> 1];
    if (e.kind !== 'ab' && e.kind !== 'land') continue;
    const h = deTo(de);
    if (e.kind === 'ab') {
      const st = straight(de);
      if (st >= 0) add(de, st, edges[st >> 1].km, edges[st >> 1].km, edgeLen(edges[st >> 1]) / PACE.ab, 'stay', st);
      add(de, NE + h, COST.exit, 0.3, 250 / PACE.rampe, 'exit');
    } else {
      // Landstraße: der Ort am Ende wird durchfahren
      const town = nodes[h].places.find((p) => p.zubKm < 1.5);
      add(de, NE + h, town ? COST.town : 0, 0, town ? townLen(places[town.place].pop) / PACE.stadt : 0, 'node');
    }
  }
  for (const nd of nodes) {
    for (const de of nd.edges) {
      const e = edges[de >> 1];
      if (e.kind === 'ab') add(NE + nd.i, de, COST.enterAb + e.km, e.km + 1, 850 / PACE.rampe + edgeLen(e) / PACE.ab, 'enter', de);
      else if (e.kind === 'land') add(NE + nd.i, de, COST.enterLand + e.km * COST.land, e.km, edgeLen(e) / PACE.land, 'enter', de);
      else add(NE + nd.i, NE + deTo(de), COST.transit[e.kind](e.km), e.km, PACE.transit, e.kind, de);
    }
  }
}

class Heap {
  constructor() {
    this.k = [];
    this.v = [];
  }
  get size() {
    return this.k.length;
  }
  push(key, val) {
    const k = this.k;
    const v = this.v;
    let i = k.length;
    k.push(key);
    v.push(val);
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (k[p] <= key) break;
      k[i] = k[p];
      v[i] = v[p];
      i = p;
    }
    k[i] = key;
    v[i] = val;
  }
  pop() {
    const k = this.k;
    const v = this.v;
    const top = [k[0], v[0]];
    const key = k.pop();
    const val = v.pop();
    const n = k.length;
    if (n > 0) {
      let i = 0;
      for (;;) {
        let c = 2 * i + 1;
        if (c >= n) break;
        if (c + 1 < n && k[c + 1] < k[c]) c++;
        if (k[c] >= key) break;
        k[i] = k[c];
        v[i] = v[c];
        i = c;
      }
      k[i] = key;
      v[i] = val;
    }
    return top;
  }
}

/** Kosten, Kartenkilometer und Fahrzeit für den Abstecher von der Ausfahrt bis ins Ziel. */
export function excursion(placeIdx) {
  const p = places[placeIdx];
  const km = Math.max(p.zubKm, 0.4) + 0.6 * townLen(p.pop) * 0.003;
  return { cost: km * COST.land, km, secs: zubLen(p.zubKm) / PACE.land + (0.6 * townLen(p.pop)) / PACE.stadt };
}

/**
 * Der beste Weg von überall zu einem Ort. Ergebnis je Zustand: Kosten (cost), Kartenkilometer (km),
 * geschätzte Fahrzeit auf der Spielstrecke in Sekunden (secs) und der nächste Schritt (next: Übergang, am Ziel null).
 */
export function routeTo(placeIdx) {
  if (!TRANS) buildTransitions();
  const n = TRANS.length;
  const cost = new Float64Array(n).fill(Infinity);
  const km = new Float64Array(n).fill(Infinity);
  const secs = new Float64Array(n).fill(Infinity);
  const next = new Array(n).fill(null);
  const goal = NE + places[placeIdx].node;
  const ex = excursion(placeIdx);
  cost[goal] = ex.cost;
  km[goal] = ex.km;
  secs[goal] = ex.secs;
  const heap = new Heap();
  heap.push(ex.cost, goal);
  while (heap.size) {
    const [c, st] = heap.pop();
    if (c > cost[st]) continue;
    for (const t of BACK[st]) {
      const nc = c + t.cost;
      if (nc < cost[t.from]) {
        cost[t.from] = nc;
        km[t.from] = km[st] + t.km;
        secs[t.from] = secs[st] + t.secs;
        next[t.from] = t;
        heap.push(nc, t.from);
      }
    }
  }
  return { place: placeIdx, goal, cost, km, secs, next };
}

/** Kosten, Kartenkilometer und Fahrzeit von einem Zustand zu allen Knoten (für die Auswahl neuer Navi-Ziele). */
export function routeFrom(state) {
  if (!TRANS) buildTransitions();
  const n = TRANS.length;
  const cost = new Float64Array(n).fill(Infinity);
  const km = new Float64Array(n).fill(Infinity);
  const secs = new Float64Array(n).fill(Infinity);
  cost[state] = 0;
  km[state] = 0;
  secs[state] = 0;
  const heap = new Heap();
  heap.push(0, state);
  while (heap.size) {
    const [c, st] = heap.pop();
    if (c > cost[st]) continue;
    for (const t of TRANS[st]) {
      const nc = c + t.cost;
      if (nc < cost[t.to]) {
        cost[t.to] = nc;
        km[t.to] = km[st] + t.km;
        secs[t.to] = secs[st] + t.secs;
        heap.push(nc, t.to);
      }
    }
  }
  const toPlace = (pi) => {
    const st = NE + places[pi].node;
    const ex = excursion(pi);
    return { cost: cost[st] + ex.cost, km: km[st] + ex.km, secs: secs[st] + ex.secs };
  };
  return { cost, km, secs, toPlace };
}

/** Übergänge eines Zustands (für die Streckenlogik). */
export function transitions(state) {
  if (!TRANS) buildTransitions();
  return TRANS[state];
}

/** Sucht einen Ort nach Wiki- oder Anzeigenamen. */
const byName = new Map();
for (const p of places) {
  byName.set(p.key.toLowerCase(), p.i);
  byName.set(p.name.toLowerCase(), p.i);
}
export const findPlace = (name) => (byName.has(String(name).toLowerCase()) ? byName.get(String(name).toLowerCase()) : -1);
const nodeById = new Map(nodes.map((n) => [n.id.toLowerCase(), n.i]));
export const findNode = (id) => (nodeById.has(String(id).toLowerCase()) ? nodeById.get(String(id).toLowerCase()) : -1);

/** Schildtext eines Knotens: „Ausfahrt Hanau“, „Kamener Kreuz“, „Kreuz Oberhausen“. */
export function nodeTitle(n) {
  const nd = typeof n === 'number' ? nodes[n] : n;
  if (nd.kind === 'kreuz') return nd.name;
  const roadsHere = new Set(nd.edges.filter((de) => deKind(de) === 'ab').map((de) => edges[de >> 1].road));
  const abEdges = nd.edges.filter((de) => deKind(de) === 'ab').length;
  if (nd.kind === 'via' && !nd.places.length && roadsHere.size > 1 && abEdges >= 3) return 'Kreuz ' + nd.name;
  return 'Ausfahrt ' + nd.name;
}

// --- Kartenprojektion (für Kartenansicht und Navi-Bildschirm) ------------------------------
/** Mercator: Breite/Länge → ebene Koordinaten (x nach Osten, y nach Süden), Einheit: Grad Länge am Äquator. */
export function project(lat, lon) {
  const y = Math.log(Math.tan(Math.PI / 4 + (Math.max(-85, Math.min(85, lat)) * RAD) / 2)) / RAD;
  return { x: lon, y: -y };
}
