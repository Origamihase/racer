// Baut aus den Natural-Earth-Umrissen (world-atlas, TopoJSON) die Küsten und Landesgrenzen der Spielkarte:
// src/map/land.js. Aufruf: node tools/map/land.mjs <Ordner mit countries-10m.json> [--stats]
//
// Die Datei wird nur als Daten gelesen (eigener kleiner TopoJSON-Decoder, kein Code aus dem Paket).
// Natural Earth ist gemeinfrei; Nachweis im Spiel: „Kartenumrisse: Natural Earth (gemeinfrei)“.
//
// Ablauf:
// 1. Bögen dekodieren (quantisiert, deltakodiert) und in die Kartenprojektion umrechnen (Mercator wie graph.js).
// 2. Land = Objekt `land` (verschmolzene Umrisse), Grenzen = Bögen, die zwei Länder teilen. Beide benutzen dieselben
//    Bögen, Grenzen enden also genau an der Küste. Außenringe laufen alle im Uhrzeigersinn (Bild: y nach unten),
//    Löcher (Kaspisches Meer …) andersherum: gefüllt wird mit „nonzero“, Überlappungen schaden dann nicht.
// 3. Jeder Punkt bekommt eine Klasse nach seiner Entfernung zum Straßennetz des Spiels: 3 = am Ort (fast wie die
//    Quelle), 2 = nahe an Straßen (fein), 1 = im Umkreis der Orte und überall in Europa (mittel), 0 = sonst (grob).
//    Bögen werden an Klassenwechseln geteilt und jedes Stück mit eigener Toleranz vereinfacht (Douglas-Peucker,
//    Endpunkte fest: Küsten und Grenzen passen weiter aneinander). Das ergibt die feine Stufe (LOD 1).
// 4. Die grobe Stufe (LOD 0, Weltansicht) ist eine Auswahl davon: je Bogen eine Maske der Punkte, die bleiben,
//    dazu je Ring und Grenzbogen ein Bit, ob er in LOD 0 vorkommt (kleine Inseln fallen weg). Landesgrenzen gibt es
//    nur, wo die Karte spielt (Klasse 1 und feiner), nicht quer durch Afrika und Asien.
// 5. Küstenorte, die in den Natural-Earth-Umrissen knapp im Wasser liegen (deren Küste ist auf rund 1 km genau),
//    bekommen einen kleinen runden Landvorsprung (PATCHES), damit ihr Punkt an Land steht.
// 6. Packen als Bitstrom (6 Bit je Zeichen, base64url-Alphabet): Zahlen als Exp-Golomb-Code mit je Bogen gewählter
//    Ordnung, Koordinaten in 1/Q Karteneinheiten als Differenzen (grobe Klassen innen auf gröberem Raster).
// 7. Länder des Spiels (alle mit mindestens einem Ort) als eigene Ringe aus denselben Bögen, je eins von fünf
//    Pastelltönen (Nachbarn verschieden, auch über schmale Meerengen), Namenspunkt am Pol der Unzugänglichkeit; dazu
//    Meeresnamen. Strittige Grenzlinien (Liste DISPUTED) bleiben ungezeichnet, die Karte bleibt neutral.
//
// Bögen über die Datumsgrenze (Tschukotka) springen von +180 nach −180 Grad; der Leser in src/map/mapview.js teilt
// solche Ringe an den Sprüngen (splitJumps, hier dieselbe Regel).
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { places, nodes, edges } from '../../src/map/graph.js';

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const dir = args.find((a) => !a.startsWith('--'));
if (!dir) {
  console.error('Aufruf: node tools/map/land.mjs <Ordner mit countries-10m.json> [--stats]');
  process.exit(1);
}
const STATS = args.includes('--stats');

// --- Einstellungen ------------------------------------------------------------------------
const Q = 300; // Schritte je Karteneinheit (1 Einheit = 1 Grad Länge); die Quelle ist auf 0,0036 Grad gerastert
const KM_PER_UNIT = 111.32; // am Äquator; im Mercator gilt überall km = Einheiten · 111,32 · cos(Breite)
const TOWN_KM = 5; // Klasse 3: so nah an einem Ort (dort stimmt die Küste fast wie in der Quelle)
const NEAR_KM = 15; // Klasse 2: so nah an Straßen, Fähren, Knoten und Orten
const ZONE_KM = 420; // Klasse 1: so nah an einem Ort
const EUROPE = [-26, 33.5, 46, 72]; // Klasse 1 auch überall in diesem Rechteck (Länge, Breite): die Europakarte im Menü
const COAST_KM = 3; // Orte so nah vor der Küste bekommen einen Landvorsprung …
const PATCH_KM = 0.7; // … der so weit über ihren Punkt hinausreicht
const TOL = [{ u: 0.6 }, { km: 5 }, { km: 0.9 }, { km: 0.25 }]; // Toleranz der feinen Stufe je Klasse (Einheiten oder km)
const BORDER_TOL = [1.6, 1.6, 1.6, 1]; // Landesgrenzen dürfen gröber sein (außer direkt am Ort)
const COARSE_SHIFT = 2; // Klassen 0 und 1: innere Punkte auf einem 4-mal gröberen Raster (≈ 1 km, Toleranz ≥ 5 km)
const TOL0 = 0.06; // grobe Stufe: Toleranz in Einheiten für die Klassen 1 bis 3 (Klasse 0 ist schon grob)
// kleinere Inseln (km²) fallen weg, außer ein Ort liegt darauf; je Klasse des Rings (feinster Punkt)
const MIN_AREA = { lod1: [2500, 80, 4, 0.5], lod0: [2500, 900, 900, 900] };
const LAT_MIN = -58; // Antarktis und Südpolarmeer braucht die Karte nicht

// --- TopoJSON lesen -----------------------------------------------------------------------
const topo = JSON.parse(readFileSync(join(dir, 'countries-10m.json'), 'utf8'));
if (topo.type !== 'Topology' || !topo.transform) throw new Error('countries-10m.json ist keine quantisierte TopoJSON-Topologie');
const [sx, sy] = topo.transform.scale;
const [tx, ty] = topo.transform.translate;
const RAD = Math.PI / 180;
const mercY = (lat) => -Math.log(Math.tan(Math.PI / 4 + (Math.max(-85, Math.min(85, lat)) * RAD) / 2)) / RAD;
const latOf = (y) => (2 * Math.atan(Math.exp(-y * RAD))) / RAD - 90;

/** Bögen: je Bogen [x0, y0, x1, y1, …] in Karteneinheiten (x = Länge, y = −Mercator) und die Breiten. */
const arcs = topo.arcs.map((arc) => {
  let qx = 0;
  let qy = 0;
  const xy = new Float64Array(arc.length * 2);
  const lat = new Float64Array(arc.length);
  arc.forEach(([dx, dy], i) => {
    qx += dx;
    qy += dy;
    const la = qy * sy + ty;
    xy[i * 2] = qx * sx + tx;
    xy[i * 2 + 1] = mercY(la);
    lat[i] = la;
  });
  return { xy, lat, n: arc.length };
});
const refArc = (r) => (r < 0 ? ~r : r);
const polysOf = (g) => (g.type === 'Polygon' ? [g.arcs] : g.type === 'MultiPolygon' ? g.arcs : []);

const landRings = []; // {ring: Bogenverweise, hole: Loch eines Polygons}
for (const g of topo.objects.land.geometries) for (const poly of polysOf(g)) poly.forEach((ring, k) => landRings.push({ ring, hole: k > 0 }));
// Grenzen: Bögen, die von zwei verschiedenen Ländern benutzt werden
const users = new Map();
topo.objects.countries.geometries.forEach((g, gi) => {
  for (const poly of polysOf(g)) {
    for (const ring of poly) {
      for (const r of ring) {
        const a = refArc(r);
        if (!users.has(a)) users.set(a, new Set());
        users.get(a).add(gi);
      }
    }
  }
});
// Umstrittene Linien zeichnet die Karte nicht (sie nimmt zu Grenzfragen keine Stellung): Paare von Natural-Earth-Namen,
// optional nur in einem Rechteck [Länge West, Breite Süd, Länge Ost, Breite Nord]
const DISPUTED = [
  ['Russia', 'Ukraine', [32, 44, 37, 46.6]], ['Serbia', 'Kosovo'], ['Israel', 'Palestine'], ['Cyprus', 'N. Cyprus'],
  ['Cyprus U.N. Buffer Zone'], ['Akrotiri'], ['Dhekelia'], ['Morocco', 'W. Sahara'], ['Somalia', 'Somaliland'],
  ['Siachen Glacier'], ['India', 'Pakistan'], ['India', 'China'], ['Baikonur'],
];
const geoName = (gi) => topo.objects.countries.geometries[gi].properties.name;
function disputed(a, set) {
  const names = [...set].map(geoName);
  const arc = arcs[a];
  return DISPUTED.some(([n1, n2, box]) => {
    if (!names.includes(n1) || (n2 && !names.includes(n2))) return false;
    if (!box) return true;
    for (let i = 0; i < arc.n; i++) {
      const lon = arc.xy[i * 2];
      if (lon < box[0] || lon > box[2] || arc.lat[i] < box[1] || arc.lat[i] > box[3]) return false;
    }
    return true;
  });
}
const borderArcs = [...users].filter(([a, s]) => s.size >= 2 && Math.max(...arcs[a].lat) > LAT_MIN && !disputed(a, s)).map(([a]) => a);
const isBorder = new Set(borderArcs);

// --- Klassen nach Entfernung zum Straßennetz ------------------------------------------------
const project = (lat, lon) => [lon, mercY(lat)];
function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const l2 = dx * dx + dy * dy;
  const t = l2 > 0 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l2)) : 0;
  return Math.hypot(ax + dx * t - px, ay + dy * t - py);
}
/** Raster aus Strecken für schnelle Abstandsfragen (Karteneinheiten). */
class SegGrid {
  constructor(cell) {
    this.cell = cell;
    this.map = new Map();
  }
  add(ax, ay, bx, by, pad) {
    const c = this.cell;
    for (let i = Math.floor((Math.min(ax, bx) - pad) / c); i <= Math.floor((Math.max(ax, bx) + pad) / c); i++) {
      for (let j = Math.floor((Math.min(ay, by) - pad) / c); j <= Math.floor((Math.max(ay, by) + pad) / c); j++) {
        const k = i * 100003 + j;
        if (!this.map.has(k)) this.map.set(k, []);
        this.map.get(k).push(ax, ay, bx, by);
      }
    }
  }
  dist(x, y) {
    const L = this.map.get(Math.floor(x / this.cell) * 100003 + Math.floor(y / this.cell));
    let best = Infinity;
    if (L) for (let k = 0; k < L.length; k += 4) best = Math.min(best, segDist(x, y, L[k], L[k + 1], L[k + 2], L[k + 3]));
    return best;
  }
}
const unitsAt = (km, lat) => km / (KM_PER_UNIT * Math.max(0.2, Math.cos(lat * RAD)));
const town = new SegGrid(0.25);
const near = new SegGrid(0.5);
const zone = new SegGrid(3);
for (const e of edges) {
  if (e.kind === 'flug') continue;
  const pts = [[nodes[e.a].lat, nodes[e.a].lon], ...e.pts, [nodes[e.b].lat, nodes[e.b].lon]];
  for (let i = 0; i + 1 < pts.length; i++) {
    const [ax, ay] = project(...pts[i]);
    const [bx, by] = project(...pts[i + 1]);
    near.add(ax, ay, bx, by, unitsAt(NEAR_KM, Math.max(Math.abs(pts[i][0]), Math.abs(pts[i + 1][0]))));
  }
}
for (const p of places) {
  const [x, y] = project(p.lat, p.lon);
  town.add(x, y, x, y, unitsAt(TOWN_KM, Math.abs(p.lat) + 0.2));
  near.add(x, y, x, y, unitsAt(NEAR_KM, Math.abs(p.lat) + 0.5));
  zone.add(x, y, x, y, unitsAt(ZONE_KM, Math.abs(p.lat) + 3));
}
function classOf(x, y, lat) {
  if (town.dist(x, y) <= unitsAt(TOWN_KM, lat)) return 3;
  if (near.dist(x, y) <= unitsAt(NEAR_KM, lat)) return 2;
  if (zone.dist(x, y) <= unitsAt(ZONE_KM, lat)) return 1;
  if (x >= EUROPE[0] && x <= EUROPE[2] && lat >= EUROPE[1] && lat <= EUROPE[3]) return 1;
  return 0;
}

// --- Vereinfachen ---------------------------------------------------------------------------
/** Douglas-Peucker auf den Punkten idx (Indizes in xy); tolOf(i) = Toleranz am Punkt i. Liefert eine Auswahl von idx. */
function simplify(xy, idx, tolOf) {
  const n = idx.length;
  if (n <= 2) return idx.slice();
  const keep = new Uint8Array(n);
  keep[0] = keep[n - 1] = 1;
  const P = (k) => idx[k] * 2;
  const stack = [];
  // geschlossener Bogen (ganze Insel): am weitesten entfernten Punkt teilen, sonst fiele er in sich zusammen
  if (xy[P(0)] === xy[P(n - 1)] && xy[P(0) + 1] === xy[P(n - 1) + 1]) {
    let far = 1;
    let fd = -1;
    for (let k = 1; k < n - 1; k++) {
      const d = Math.hypot(xy[P(k)] - xy[P(0)], xy[P(k) + 1] - xy[P(0) + 1]);
      if (d > fd) {
        fd = d;
        far = k;
      }
    }
    keep[far] = 1;
    stack.push([0, far], [far, n - 1]);
  } else stack.push([0, n - 1]);
  while (stack.length) {
    const [a, b] = stack.pop();
    let best = -1;
    let bd = 0;
    for (let k = a + 1; k < b; k++) {
      const d = segDist(xy[P(k)], xy[P(k) + 1], xy[P(a)], xy[P(a) + 1], xy[P(b)], xy[P(b) + 1]);
      if (d > tolOf(idx[k]) && d > bd) {
        bd = d;
        best = k;
      }
    }
    if (best >= 0) {
      keep[best] = 1;
      stack.push([a, best], [best, b]);
    }
  }
  return idx.filter((_, k) => keep[k]);
}
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, k) => a + k);

// Teilstücke je Bogen: an Klassenwechseln geteilt; jedes Stück wird ein eigener Ausgabe-Bogen
const outArcs = []; // {pts: Int32Array [x, y, …] quantisiert, mask0: Uint8Array | null, cls}
const pieceOf = []; // je Quellbogen: Liste der Ausgabe-Bögen
const qz = (v) => Math.round(v * Q);
arcs.forEach((arc, ai) => {
  const cls = new Uint8Array(arc.n);
  for (let i = 0; i < arc.n; i++) cls[i] = classOf(arc.xy[i * 2], arc.xy[i * 2 + 1], arc.lat[i]);
  const parts = [];
  let s = 0;
  for (let i = 1; i < arc.n; i++) {
    if (cls[i] === cls[s]) continue;
    parts.push({ i0: s, i1: i, cls: Math.max(cls[s], cls[i]) });
    s = i;
  }
  if (s < arc.n - 1 || !parts.length) parts.push({ i0: s, i1: arc.n - 1, cls: cls[s] });
  // sehr kurze Stücke dem Nachbarn zuschlagen (die feinere Klasse gewinnt), sonst entstehen lauter Mini-Bögen
  const merged = [];
  for (const p of parts) {
    const last = merged[merged.length - 1];
    if (last && (p.i1 - p.i0 < 4 || last.i1 - last.i0 < 4)) {
      last.i1 = p.i1;
      last.cls = Math.max(last.cls, p.cls);
    } else merged.push({ ...p });
  }
  const f = isBorder.has(ai) ? BORDER_TOL : [1, 1, 1, 1];
  pieceOf[ai] = merged.map((p) => {
    const t = TOL[p.cls];
    const fine = simplify(arc.xy, range(p.i0, p.i1), (i) => f[p.cls] * (t.u !== undefined ? t.u : unitsAt(t.km, arc.lat[i])));
    const pts = new Int32Array(fine.length * 2);
    fine.forEach((i, k) => {
      pts[k * 2] = qz(arc.xy[i * 2]);
      pts[k * 2 + 1] = qz(arc.xy[i * 2 + 1]);
    });
    let mask0 = null;
    if (p.cls > 0) {
      const coarse = new Set(simplify(arc.xy, fine, () => TOL0));
      mask0 = Uint8Array.from(fine, (i) => (coarse.has(i) ? 1 : 0));
    }
    outArcs.push({ pts, mask0, cls: p.cls });
    return outArcs.length - 1;
  });
});
/** Bogenverweis (TopoJSON) → Verweise auf Ausgabe-Bögen (~i = rückwärts). */
const expand = (r) => (r < 0 ? pieceOf[~r].map((o) => ~o).reverse() : pieceOf[r].slice());

// --- Ringe ------------------------------------------------------------------------------------
function ringPoints(refs, lod) {
  const pts = [];
  for (const r of refs) {
    const a = outArcs[refArc(r)];
    const n = a.pts.length / 2;
    for (let k = 0; k < n; k++) {
      const i = r < 0 ? n - 1 - k : k;
      if (k === 0 && pts.length) continue;
      if (lod === 0 && a.mask0 && !a.mask0[i]) continue;
      pts.push(a.pts[i * 2] / Q, a.pts[i * 2 + 1] / Q);
    }
  }
  return pts;
}
function ringArea(pts) {
  // Fläche in km²: Mercator-Fläche · (111,32 · cos φ)² bei mittlerer Breite
  let a = 0;
  let y = 0;
  const n = pts.length / 2;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    a += pts[i * 2] * pts[j * 2 + 1] - pts[j * 2] * pts[i * 2 + 1];
    y += pts[i * 2 + 1];
  }
  return Math.abs(a / 2) * (KM_PER_UNIT * Math.cos(latOf(y / n) * RAD)) ** 2;
}
function pointInRing(x, y, pts) {
  let inside = false;
  const n = pts.length / 2;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const yi = pts[i * 2 + 1];
    const yj = pts[j * 2 + 1];
    if (yi > y !== yj > y && x < ((pts[j * 2] - pts[i * 2]) * (y - yi)) / (yj - yi) + pts[i * 2]) inside = !inside;
  }
  return inside;
}
/** Ring an Sprüngen über die Datumsgrenze teilen (wie splitJumps in src/map/mapview.js): Liste geschlossener Stücke. */
function splitJumps(pts) {
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
      if (cur.length >= 6) pieces.push(cur);
      cur = [];
    }
  }
  return pieces;
}
/** Doppelte Fläche mit Vorzeichen (Kartenkoordinaten, y nach unten: positiv = im Uhrzeigersinn). */
function area2(pts) {
  let a = 0;
  const n = pts.length / 2;
  for (let i = 0, j = n - 1; i < n; j = i++) a += pts[j * 2] * pts[i * 2 + 1] - pts[i * 2] * pts[j * 2 + 1];
  return a;
}
/** Umlaufzahl des Punkts bezüglich der Ringe (Regel „nonzero“: ungleich 0 = an Land). */
function winding(x, y, ringList) {
  let w = 0;
  for (const P of ringList) {
    const n = P.length / 2;
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const xj = P[j * 2];
      const yj = P[j * 2 + 1];
      const xi = P[i * 2];
      const yi = P[i * 2 + 1];
      const side = (xi - xj) * (y - yj) - (x - xj) * (yi - yj);
      if (yj <= y && yi > y && side > 0) w++;
      else if (yj > y && yi <= y && side < 0) w--;
    }
  }
  return w;
}
const placeXY = places.map((p) => project(p.lat, p.lon));
const rings = []; // {refs, lod0}
let droppedIslands = 0;
for (const { ring, hole } of landRings) {
  let refs = ring.flatMap(expand);
  const pts1 = ringPoints(refs, 1);
  let yMin = Infinity;
  for (let i = 1; i < pts1.length; i += 2) yMin = Math.min(yMin, pts1[i]);
  if (latOf(yMin) < LAT_MIN) continue; // liegt ganz südlich der Grenze (y wächst nach Süden: yMin = nördlichster Punkt)
  const cls = Math.max(...refs.map((r) => outArcs[refArc(r)].cls));
  const hasPlace = pts1.length >= 6 && placeXY.some(([x, y]) => pointInRing(x, y, pts1));
  if (!hasPlace && (pts1.length < 8 || ringArea(pts1) < MIN_AREA.lod1[cls])) {
    droppedIslands++;
    continue;
  }
  const pts0 = ringPoints(refs, 0);
  const lod0 = pts0.length >= 8 && (ringArea(pts0) >= MIN_AREA.lod0[cls] || hasPlace);
  // Umlaufsinn: Außenring im Uhrzeigersinn, Loch andersherum (am größten Stück gemessen, falls der Ring springt)
  const main = splitJumps(pts1).reduce((a, b) => (Math.abs(area2(b)) > Math.abs(area2(a)) ? b : a));
  if (area2(main) > 0 === hole) refs = refs.slice().reverse().map((r) => ~r);
  rings.push({ refs, lod0 });
}
// Grenzen: alle in LOD 1, in LOD 0 nur genügend lange (Grenzen auf winzigen Inseln fallen weg)
const borders = [];
for (const a of borderArcs) {
  let len = 0;
  const arc = arcs[a];
  for (let i = 1; i < arc.n; i++) len += Math.hypot(arc.xy[i * 2] - arc.xy[i * 2 - 2], arc.xy[i * 2 + 1] - arc.xy[i * 2 - 1]);
  for (const r of expand(a)) if (outArcs[refArc(r)].cls >= 1) borders.push({ ref: r, lod0: len > 0.3 });
}

// --- Länder des Spiels ------------------------------------------------------------------------
// Länder mit Orten des Spiels bekommen in der großen Karte eine Pastellfarbe und ihren Namen; alle anderen bleiben in der
// ruhigen Landfarbe. Ringe wie beim Land (gleiche Bögen, gleiche Regeln für kleine Inseln), Löcher (San Marino und der
// Vatikan in Italien, Lesotho in Südafrika) andersherum.
const placeXYc = places.map((p) => project(p.lat, p.lon));
const GAME = {
  DE: ['Germany', 'Deutschland'], AT: ['Austria', 'Österreich'], CH: ['Switzerland', 'Schweiz'], FR: ['France', 'Frankreich'],
  NL: ['Netherlands', 'Niederlande'], BE: ['Belgium', 'Belgien'], LU: ['Luxembourg', 'Luxemburg'], DK: ['Denmark', 'Dänemark'],
  PL: ['Poland', 'Polen'], CZ: ['Czechia', 'Tschechien'], IT: ['Italy', 'Italien'], ES: ['Spain', 'Spanien'],
  PT: ['Portugal', 'Portugal'], GB: ['United Kingdom', 'Großbritannien'], IE: ['Ireland', 'Irland'], NO: ['Norway', 'Norwegen'],
  SE: ['Sweden', 'Schweden'], FI: ['Finland', 'Finnland'], LT: ['Lithuania', 'Litauen'], HR: ['Croatia', 'Kroatien'],
  MT: ['Malta', 'Malta'], MC: ['Monaco', 'Monaco'], LI: ['Liechtenstein', 'Liechtenstein'], VA: ['Vatican', 'Vatikanstadt'],
  US: ['United States of America', 'USA'], CA: ['Canada', 'Kanada'], MX: ['Mexico', 'Mexiko'], DO: ['Dominican Rep.', 'Dominikanische Republik'],
  CV: ['Cabo Verde', 'Kap Verde'], JP: ['Japan', 'Japan'], JO: ['Jordan', 'Jordanien'], AM: ['Armenia', 'Armenien'],
  ZA: ['South Africa', 'Südafrika'],
};
const PALETTE_N = 5; // Pastellfarben: Nachbarn bekommen verschiedene (mapview.js THEMES.tints)
const geos = topo.objects.countries.geometries;
const countries = [];
for (const cc of [...new Set(places.map((p) => p.cc))]) {
  if (!GAME[cc]) throw new Error('Land ohne Eintrag in GAME: ' + cc);
  const gi = geos.findIndex((g) => g.properties.name === GAME[cc][0]);
  if (gi < 0) throw new Error('Land fehlt in den Daten: ' + GAME[cc][0]);
  const crings = [];
  for (const poly of polysOf(geos[gi])) {
    poly.forEach((ring, k) => {
      let refs = ring.flatMap(expand);
      const pts1 = ringPoints(refs, 1);
      let yMin = Infinity;
      for (let i = 1; i < pts1.length; i += 2) yMin = Math.min(yMin, pts1[i]);
      if (latOf(yMin) < LAT_MIN || pts1.length < 6) return;
      // Inseln (nur Küste) wie beim Land; Ringe mit Landesgrenze bleiben immer
      const island = !ring.some((r) => users.get(refArc(r)).size >= 2);
      const cls = Math.max(...refs.map((r) => outArcs[refArc(r)].cls));
      const hasPlace = placeXYc.some(([x, y]) => pointInRing(x, y, pts1));
      if (island && !hasPlace && (pts1.length < 8 || ringArea(pts1) < MIN_AREA.lod1[cls])) return;
      const pts0 = ringPoints(refs, 0);
      const lod0 = pts0.length >= 8 && (!island || hasPlace || ringArea(pts0) >= MIN_AREA.lod0[cls]);
      const main = splitJumps(pts1).reduce((a, b) => (Math.abs(area2(b)) > Math.abs(area2(a)) ? b : a));
      if (area2(main) > 0 === k > 0) refs = refs.slice().reverse().map((r) => ~r);
      crings.push({ refs, lod0, pts: pts1, hole: k > 0 });
    });
  }
  countries.push({ cc, gi, name: GAME[cc][1], rings: crings, col: -1 });
}
// Farben: Nachbarn (gemeinsamer Bogen) verschieden; Deutschland zuerst, dann nach Zahl der Nachbarn
const neigh = countries.map(() => new Set());
for (const [, set] of users) {
  const cs = countries.filter((c) => set.has(c.gi));
  for (const a of cs) for (const b of cs) if (a !== b) neigh[countries.indexOf(a)].add(countries.indexOf(b));
}
// … und Länder, die sich über eine schmale Meerenge fast berühren (Dänemark und Schweden, Italien und Malta)
const NEAR_UNITS = 0.35;
const boxes = countries.map((c) => c.rings.map((r) => [r.pts, boxOf(r.pts)]));
for (let i = 0; i < countries.length; i++) {
  for (let j = i + 1; j < countries.length; j++) {
    let near = false;
    for (const [P, a] of boxes[i]) {
      for (const [R, b] of boxes[j]) {
        if (near || a[0] > b[2] + NEAR_UNITS || b[0] > a[2] + NEAR_UNITS || a[1] > b[3] + NEAR_UNITS || b[1] > a[3] + NEAR_UNITS) continue;
        for (let p = 0; p < P.length && !near; p += 4) for (let q = 0; q < R.length && !near; q += 4) near = Math.hypot(P[p] - R[q], P[p + 1] - R[q + 1]) < NEAR_UNITS;
      }
    }
    if (near) {
      neigh[i].add(j);
      neigh[j].add(i);
    }
  }
}
const byDegree = countries.map((c, i) => i).sort((a, b) => (countries[a].cc === 'DE' ? -1 : countries[b].cc === 'DE' ? 1 : neigh[b].size - neigh[a].size));
// Unter den erlaubten Farben die bisher seltenste (die Karte wird bunt gemischt, nicht überall dieselbe Farbe)
const usage = new Array(PALETTE_N).fill(0);
for (const i of byDegree) {
  const used = new Set([...neigh[i]].map((j) => countries[j].col));
  let c = -1;
  for (let k = 0; k < PALETTE_N; k++) if (!used.has(k) && (c < 0 || usage[k] < usage[c])) c = k;
  if (c < 0) throw new Error('zu wenige Farben für ' + countries[i].name);
  countries[i].col = c;
  usage[c]++;
}
function boxOf(P) {
  const b = [Infinity, Infinity, -Infinity, -Infinity];
  for (let i = 0; i < P.length; i += 2) {
    b[0] = Math.min(b[0], P[i]);
    b[1] = Math.min(b[1], P[i + 1]);
    b[2] = Math.max(b[2], P[i]);
    b[3] = Math.max(b[3], P[i + 1]);
  }
  return b;
}
/** Namenspunkt: der Punkt im größten Ring, der am weitesten von dessen Rand entfernt ist (grobe Suche, dann feiner). */
function labelPoint(P) {
  const edgeDist = (x, y) => {
    let d = Infinity;
    const n = P.length / 2;
    for (let i = 0, j = n - 1; i < n; j = i++) d = Math.min(d, segDist(x, y, P[j * 2], P[j * 2 + 1], P[i * 2], P[i * 2 + 1]));
    return pointInRing(x, y, P) ? d : -d;
  };
  let [x0, y0, x1, y1] = [Infinity, Infinity, -Infinity, -Infinity];
  for (let i = 0; i < P.length; i += 2) {
    x0 = Math.min(x0, P[i]);
    x1 = Math.max(x1, P[i]);
    y0 = Math.min(y0, P[i + 1]);
    y1 = Math.max(y1, P[i + 1]);
  }
  let best = [(x0 + x1) / 2, (y0 + y1) / 2, -Infinity];
  let cx = best[0];
  let cy = best[1];
  let span = Math.max(x1 - x0, y1 - y0);
  for (let pass = 0; pass < 4; pass++) {
    for (let i = 0; i <= 24; i++) {
      for (let j = 0; j <= 24; j++) {
        const x = cx + (i / 24 - 0.5) * span;
        const y = cy + (j / 24 - 0.5) * span;
        const d = edgeDist(x, y);
        if (d > best[2]) best = [x, y, d];
      }
    }
    [cx, cy] = best;
    span /= 5;
  }
  return best;
}
const countryLabels = countries.map((c) => {
  const big = c.rings.filter((r) => !r.hole).reduce((a, b) => (ringArea(b.pts) > ringArea(a.pts) ? b : a));
  const [x, y, d] = labelPoint(big.pts);
  return [c.cc, c.name, Math.round(x * 100) / 100, Math.round(y * 100) / 100, Math.round(d * 100) / 100];
});
// Meere und Ozeane für die große Karte: [Name, Breite, Länge, Rang (0 Ozean, 1 Meer, 2 kleines Meer)]
const SEAS = [
  ['Atlantischer Ozean', 32, -40, 0], ['Atlantischer Ozean', 47, -17, 1], ['Pazifischer Ozean', 22, -142, 0],
  ['Pazifischer Ozean', 25, 158, 0], ['Indischer Ozean', -22, 78, 0], ['Nordpolarmeer', 79, 15, 0],
  ['Nordsee', 56.3, 3.2, 1], ['Ostsee', 55.6, 17.6, 1], ['Mittelmeer', 35.4, 18.5, 1], ['Schwarzes Meer', 43.2, 34.6, 1],
  ['Europäisches Nordmeer', 68.5, 2, 1], ['Golf von Biskaya', 45.4, -4.6, 2], ['Adria', 42.9, 15.6, 2],
  ['Tyrrhenisches Meer', 39.8, 11.8, 2], ['Ärmelkanal', 50.1, -1.9, 2], ['Bottnischer Meerbusen', 62.2, 20.2, 2],
  ['Ägäis', 38.6, 25.1, 2], ['Golf von Mexiko', 25.2, -90.4, 1], ['Karibisches Meer', 15.2, -74.5, 1],
  ['Japanisches Meer', 40.5, 135, 1], ['Rotes Meer', 21, 38.5, 2],
];
const seaLabels = SEAS.map(([name, lat, lon, rank]) => [name, Math.round(lon * 100) / 100, Math.round(mercY(lat) * 100) / 100, rank]);

// Küstenorte, deren Punkt im Wasser läge: ein Kreis zwischen Ort und nächstem Küstenpunkt, der beide überdeckt
const land1 = rings.flatMap((r) => splitJumps(ringPoints(r.refs, 1)));
const patches = [];
for (const p of places) {
  const [x, y] = project(p.lat, p.lon);
  if (winding(x, y, land1) !== 0) continue;
  let best = Infinity;
  let qx = x;
  let qy = y;
  for (const P of land1) {
    const n = P.length / 2;
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const ax = P[j * 2];
      const ay = P[j * 2 + 1];
      const dx = P[i * 2] - ax;
      const dy = P[i * 2 + 1] - ay;
      const l2 = dx * dx + dy * dy;
      const t = l2 > 0 ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / l2)) : 0;
      const d = Math.hypot(ax + dx * t - x, ay + dy * t - y);
      if (d < best) {
        best = d;
        qx = ax + dx * t;
        qy = ay + dy * t;
      }
    }
  }
  const km = best * KM_PER_UNIT * Math.cos(p.lat * RAD);
  if (km > COAST_KM) {
    console.warn(`Ort liegt ${km.toFixed(1)} km vor der Küste, kein Landvorsprung: ${p.name}`);
    continue;
  }
  patches.push(qz((x + qx) / 2), qz((y + qy) / 2), Math.ceil((best / 2 + unitsAt(PATCH_KM, p.lat)) * Q));
}

// Nur benutzte Ausgabe-Bögen behalten, nach erster Verwendung nummerieren (Verweise werden so meist „vorige + 1“)
const index = new Map();
const order = [];
const remap = (r) => {
  const a = refArc(r);
  if (!index.has(a)) {
    index.set(a, order.length);
    order.push(a);
  }
  return r < 0 ? ~index.get(a) : index.get(a);
};
for (const ring of rings) ring.refs = ring.refs.map(remap);
for (const b of borders) b.ref = remap(b.ref);
for (const c of countries) for (const r of c.rings) r.refs = r.refs.map(remap);

// --- Packen -----------------------------------------------------------------------------------
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const bitsOut = [];
const put = (v, n) => {
  for (let i = n - 1; i >= 0; i--) bitsOut.push((v >>> i) & 1);
};
/** Exp-Golomb-Code der Ordnung k für v ≥ 0. */
const egLen = (v, k) => 2 * Math.floor(Math.log2(v + (1 << k))) - k + 1;
function eg(v, k) {
  const w = v + (1 << k);
  const nb = Math.floor(Math.log2(w)) + 1;
  put(0, nb - 1 - k);
  put(w, nb);
}
const zz = (v) => (v < 0 ? -2 * v - 1 : 2 * v);
const seg = (v, k) => eg(zz(v), k);

put(order.length, 16);
let lx = 0;
let ly = 0;
let maskBits = 0;
for (const a of order) {
  const { pts, mask0, cls } = outArcs[a];
  const n = pts.length / 2;
  // grobe Klassen: innere Punkte auf einem 2^sh-mal gröberen Raster (bezogen auf den Anfang); die Endpunkte bleiben
  // genau, weil dort andere Bögen anschließen
  const sh = cls <= 1 ? COARSE_SHIFT : 0;
  const P = Int32Array.from(pts);
  for (let i = 1; i < n - 1; i++) {
    for (const c of [0, 1]) P[i * 2 + c] = pts[c] + Math.round((pts[i * 2 + c] - pts[c]) / 2 ** sh) * 2 ** sh;
  }
  const d = (i, c) => P[i * 2 + c] - P[i * 2 - 2 + c]; // Schritt zum Punkt i (i ≥ 1)
  eg(n - 2, 2);
  // Anfang relativ zum Ende des vorigen Bogens (dort fängt der nächste meist an)
  seg(P[0] - lx, 4);
  seg(P[1] - ly, 4);
  // Ordnung des Codes je Bogen: die kürzeste Gesamtlänge gewinnt
  let bestK = 0;
  let bestLen = Infinity;
  for (let k = 0; k < 16; k++) {
    let len = egLen(zz(d(n - 1, 0)), k + sh) + egLen(zz(d(n - 1, 1)), k + sh);
    for (let i = 1; i < n - 1; i++) len += egLen(zz(d(i, 0) / 2 ** sh), k) + egLen(zz(d(i, 1) / 2 ** sh), k);
    if (len < bestLen) {
      bestLen = len;
      bestK = k;
    }
  }
  put(bestK, 4);
  put(sh / COARSE_SHIFT, 1);
  for (let i = 1; i < n - 1; i++) {
    seg(d(i, 0) / 2 ** sh, bestK);
    seg(d(i, 1) / 2 ** sh, bestK);
  }
  seg(d(n - 1, 0), bestK + sh);
  seg(d(n - 1, 1), bestK + sh);
  // Maske der groben Stufe für die inneren Punkte (Endpunkte bleiben immer)
  put(mask0 ? 1 : 0, 1);
  if (mask0) for (let i = 1; i < n - 1; i++) put(mask0[i], 1);
  if (mask0) maskBits += n - 2;
  lx = P[n * 2 - 2];
  ly = P[n * 2 - 1];
}
const bitsArcs = bitsOut.length;
// Verweise: Richtungsbit und Abstand zur Vorhersage (voriger Bogen + 1)
let prevRef = -1;
function ref(r) {
  const a = refArc(r);
  put(r < 0 ? 1 : 0, 1);
  seg(a - (prevRef + 1), 1);
  prevRef = a;
}
eg(rings.length, 4);
for (const ring of rings) {
  eg(ring.refs.length - 1, 1);
  put(ring.lod0 ? 1 : 0, 1);
  for (const r of ring.refs) ref(r);
}
eg(borders.length, 4);
for (const b of borders) {
  put(b.lod0 ? 1 : 0, 1);
  ref(b.ref);
}
// Länder: Farbe, Ringe (Loch-Bit, Stufe-0-Bit, Verweise)
for (const c of countries) {
  put(c.col, 3);
  eg(c.rings.length - 1, 1);
  for (const r of c.rings) {
    put(r.lod0 ? 1 : 0, 1);
    eg(r.refs.length - 1, 1);
    for (const x of r.refs) ref(x);
  }
}
while (bitsOut.length % 6) bitsOut.push(0);
let text = '';
for (let i = 0; i < bitsOut.length; i += 6) {
  let c = 0;
  for (let k = 0; k < 6; k++) c = c * 2 + bitsOut[i + k];
  text += ALPHA[c];
}

// Gebiete mit feinen Küsten (für Prüfungen): Rechtecke in Länge/Breite um alle Orte, überlappende verschmolzen
function regions() {
  const boxes = [];
  for (const p of places) {
    const dLat = NEAR_KM / 111.32;
    const dLon = NEAR_KM / (111.32 * Math.cos(p.lat * RAD));
    let b = [p.lon - dLon, p.lat - dLat, p.lon + dLon, p.lat + dLat];
    for (let again = true; again; ) {
      again = false;
      for (let i = boxes.length - 1; i >= 0; i--) {
        const o = boxes[i];
        if (o[0] <= b[2] && o[2] >= b[0] && o[1] <= b[3] && o[3] >= b[1]) {
          b = [Math.min(b[0], o[0]), Math.min(b[1], o[1]), Math.max(b[2], o[2]), Math.max(b[3], o[3])];
          boxes.splice(i, 1);
          again = true;
        }
      }
    }
    boxes.push(b);
  }
  return boxes.map((b) => [Math.floor(b[0] * 10) / 10, Math.floor(b[1] * 10) / 10, Math.ceil(b[2] * 10) / 10, Math.ceil(b[3] * 10) / 10]);
}

const out =
  '// ERZEUGT von tools/map/land.mjs aus Natural Earth (gemeinfrei, über world-atlas 2.0.2) – nicht von Hand ändern.\n' +
  '// Küsten und Landesgrenzen in Kartenkoordinaten (Mercator wie project() in graph.js) als Bitstrom, Aufbau siehe\n' +
  '// tools/map/land.mjs, gelesen von decodeLand() in src/map/mapview.js.\n' +
  '/* eslint-disable */\n' +
  `export const Q = ${Q};\n` +
  `export const LAND = '${text}';\n` +
  '/** Landvorsprünge für Küstenorte (nur feine Stufe): je Kreis Mitte x, y und Halbmesser in 1/Q Karteneinheiten. */\n' +
  `export const PATCHES = ${JSON.stringify(patches)};\n` +
  '/** Länder des Spiels in der Reihenfolge des Bitstroms: [Kürzel, Name, Namenspunkt x, y, Abstand zum Rand] (Karteneinheiten). */\n' +
  `export const COUNTRIES = ${JSON.stringify(countryLabels)};\n` +
  '/** Meere: [Name, x, y, Rang (0 Ozean, 1 Meer, 2 kleines Meer)]. */\n' +
  `export const SEAS = ${JSON.stringify(seaLabels)};\n` +
  '/** Gebiete mit feinen Küsten nahe am Straßennetz: [Länge West, Breite Süd, Länge Ost, Breite Nord]. */\n' +
  `export const REGIONS = ${JSON.stringify(regions())};\n`;
writeFileSync(join(here, '..', '..', 'src', 'map', 'land.js'), out);

const count = (lod) => {
  const set = new Set();
  for (const r of rings) if (lod === 1 || r.lod0) for (const x of r.refs) set.add(refArc(x));
  for (const b of borders) if (lod === 1 || b.lod0) set.add(refArc(b.ref));
  for (const c of countries) for (const r of c.rings) if (lod === 1 || r.lod0) for (const x of r.refs) set.add(refArc(x));
  let n = 0;
  for (const a of set) {
    const o = outArcs[order[a]];
    n += lod === 0 && o.mask0 ? o.mask0.reduce((s, v) => s + v, 0) : o.pts.length / 2;
  }
  return n;
};
console.log(
  `Land: ${order.length} Bögen, ${rings.length} Ringe (LOD0 ${rings.filter((r) => r.lod0).length}), ${borders.length} Grenzbögen;` +
    ` Punkte LOD0 ${count(0)}, LOD1 ${count(1)}, ${patches.length / 3} Landvorsprünge, ${countries.length} Länder` +
    ` (${countries.reduce((n, c) => n + c.rings.length, 0)} Ringe) → src/map/land.js (${(out.length / 1024).toFixed(1)} kB)`,
);
if (STATS) {
  const cls = [0, 0, 0, 0];
  for (const a of order) cls[outArcs[a].cls] += outArcs[a].pts.length / 2;
  console.log('Punkte je Klasse', cls, 'Bits Bögen', bitsArcs, 'davon Masken', maskBits, 'Bits Verweise', bitsOut.length - bitsArcs, 'Inseln entfallen', droppedIslands);
  console.log('Bits je Punkt (Bögen)', ((bitsArcs - maskBits) / order.reduce((s, a) => s + outArcs[a].pts.length / 2, 0)).toFixed(2));
}
