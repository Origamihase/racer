// Baut aus Natural Earth (gemeinfrei) die Flüsse und Seen der Spielkarte: src/map/water.js.
// Aufruf: node tools/map/wasser.mjs <Ordner mit den Natural-Earth-GeoJSON-Dateien> [--stats]
//
// Gelesen werden (nur als Daten): ne_10m_rivers_lake_centerlines, ne_10m_rivers_europe (Ergänzung mit den kleineren
// Flüssen Europas: Neckar, Saale, Spree, Fulda …), ne_10m_lakes und ne_10m_lakes_europe, jeweils .geojson aus
// github.com/nvkelso/natural-earth-vector (Ordner geojson/).
//
// Ablauf:
// 1. Flusslinien lesen; „Lake Centerline“ fällt weg (dort liegt der See selbst). Deutscher Name, wo es einen gibt.
//    Stücke der Ergänzung, die nur eine Linie des Hauptdatensatzes doppeln (unter 0,8 km daneben), fallen weg.
// 2. Klasse je Linie nach Natural-Earth-Rang: 0 = Strom (Rang ≤ 5: Rhein, Donau, Elbe, Oder …), 1 = Fluss (6 – 9:
//    Main, Mosel, Weser, Inn …), 2 = kleiner Fluss (Ergänzung: Neckar, Saale, Spree …). Die Klasse bestimmt Breite und
//    Sichtbarkeit auf der Karte und die Breite des Wassers unter den Brücken der Welt (src/map/water.js WATER_CLASS).
// 3. Behalten wird, was die Karte zeigt: Ströme und Flüsse überall in Europa, kleine Flüsse nur bis 60 km um das
//    Straßennetz des Spiels, außerhalb Europas alles nur bis 25 km. Linien werden dort geteilt, wo sie diesen Bereich verlassen.
// 4. Vereinfachen (Douglas-Peucker): 0,12 km bis 20 km ums Netz (dort kreuzen Straßen, die Brücke muss sitzen),
//    sonst 0,6 km. Seen ebenso; Seen: in ganz Europa ab 100 km², bis 60 km ums Netz ab
//    10 km², bis 5 km ums Netz ab 1 km² (fein vereinfacht nur dort, wo Straßen sie berühren können).
// 5. Packen: Koordinaten in 1/Q Karteneinheiten (Mercator wie project() in graph.js), Differenzen im Zickzack als
//    Ziffernfolge (5 Bit je Zeichen, das sechste Bit sagt „es geht weiter“), base64url-Alphabet.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { places, nodes, edges, distKm } from '../../src/map/graph.js';
import { edgeShape } from '../../src/map/shapes.js';
import { abgleich, clearNet, countCrossings, latOfY, pairsLeft } from './wasser-netz.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const dir = args.find((a) => !a.startsWith('--'));
if (!dir) {
  console.error('Aufruf: node tools/map/wasser.mjs <Ordner mit ne_10m_rivers_*.geojson und ne_10m_lakes*.geojson> [--stats]');
  process.exit(1);
}
const STATS = args.includes('--stats');

const Q = 5000; // Schritte je Karteneinheit (1 Einheit = 1 Grad Länge; in Deutschland ≈ 70 m, ein Schritt also 14 m)
const KM_PER_UNIT = 111.32;
const EUROPE = [-26, 33.5, 46, 72]; // Länge, Breite: Ströme und Flüsse überall darin
const NET_KM = 60; // kleine Flüsse und alles außerhalb Europas nur so nah am Netz
const FINE_KM = 20; // so nah am Netz wird fein vereinfacht
const TOL = { fine: 0.12, coarse: 1.2 }; // km
const DUP_KM = 0.8;
const LAKE_MIN = { far: 100, mid: 10, near: 1 }; // km²: überall in Europa, bis NET_KM, bis LAKE_NEAR_KM ums Netz
const LAKE_NEAR_KM = 5;
const FAR_NET_KM = 25; // außerhalb Europas: alles nur so nah am Netz

const RAD = Math.PI / 180;
const mercY = (lat) => -Math.log(Math.tan(Math.PI / 4 + (Math.max(-85, Math.min(85, lat)) * RAD) / 2)) / RAD;
const proj = (lon, lat) => [lon, mercY(lat)];
const kmScale = (lat) => KM_PER_UNIT * Math.max(0.2, Math.cos(lat * RAD));

const read = (f) => JSON.parse(readFileSync(join(dir, f + '.geojson'), 'utf8')).features;

// --- Netz als Gitter von Strecken (Kartenkoordinaten), für Abstände ----------------------------------
class SegGrid {
  constructor(cell) {
    this.cell = cell;
    this.map = new Map();
  }
  add(ax, ay, bx, by) {
    const c = this.cell;
    const i0 = Math.floor(Math.min(ax, bx) / c);
    const i1 = Math.floor(Math.max(ax, bx) / c);
    const j0 = Math.floor(Math.min(ay, by) / c);
    const j1 = Math.floor(Math.max(ay, by) / c);
    for (let i = i0; i <= i1; i++)
      for (let j = j0; j <= j1; j++) {
        const k = i * 100003 + j;
        let L = this.map.get(k);
        if (!L) this.map.set(k, (L = []));
        L.push(ax, ay, bx, by);
      }
  }
  /** Kleinster Abstand (Karteneinheiten) zu einer Strecke im Umkreis von r Zellen, sonst Infinity. */
  dist(x, y, r = 1) {
    const c = this.cell;
    const ci = Math.floor(x / c);
    const cj = Math.floor(y / c);
    let best = Infinity;
    for (let i = ci - r; i <= ci + r; i++)
      for (let j = cj - r; j <= cj + r; j++) {
        const L = this.map.get(i * 100003 + j);
        if (!L) continue;
        for (let k = 0; k < L.length; k += 4) best = Math.min(best, segDist(x, y, L[k], L[k + 1], L[k + 2], L[k + 3]));
      }
    return best;
  }
}
function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const l2 = dx * dx + dy * dy;
  const t = l2 > 0 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l2)) : 0;
  return Math.hypot(px - ax - t * dx, py - ay - t * dy);
}

const net = new SegGrid(1);
for (const e of edges) {
  if (e.kind !== 'ab' && e.kind !== 'land') continue;
  const sh = edgeShape(e.i);
  for (let k = 0; k + 1 < sh.n; k++) {
    const a = proj(sh.lon[k], sh.lat[k]);
    const b = proj(sh.lon[k + 1], sh.lat[k + 1]);
    net.add(a[0], a[1], b[0], b[1]);
  }
}
for (const p of places) {
  const a = proj(p.lon, p.lat);
  const n = p.node >= 0 ? nodes[p.node] : p;
  const b = proj(n.lon, n.lat);
  net.add(a[0], a[1], b[0], b[1]);
}
/** Abstand zum Netz in km (bis gut 100 km genau, darüber Infinity). */
const netKm = (x, y, lat) => net.dist(x, y, 1) * kmScale(lat);
const inEurope = (lon, lat) => lon >= EUROPE[0] && lon <= EUROPE[2] && lat >= EUROPE[1] && lat <= EUROPE[3];

// --- Douglas-Peucker in km (Punkte [x, y, lat]) ------------------------------------------------------
function simplify(P, tolKm) {
  const n = P.length;
  if (n <= 2) return P.slice();
  const keep = new Uint8Array(n);
  keep[0] = keep[n - 1] = 1;
  const st = [[0, n - 1]];
  while (st.length) {
    const [a, b] = st.pop();
    let best = -1;
    let bi = -1;
    for (let i = a + 1; i < b; i++) {
      const d = segDist(P[i][0], P[i][1], P[a][0], P[a][1], P[b][0], P[b][1]) * kmScale(P[i][2]);
      if (d > best) {
        best = d;
        bi = i;
      }
    }
    const tol = typeof tolKm === 'function' ? Math.min(tolKm(P[a]), tolKm(P[b]), bi >= 0 ? tolKm(P[bi]) : Infinity) : tolKm;
    if (best > tol) {
      keep[bi] = 1;
      st.push([a, bi], [bi, b]);
    }
  }
  return P.filter((_, i) => keep[i]);
}
const tolAt = (p) => (p[3] <= FINE_KM ? TOL.fine : TOL.coarse);

// --- Flüsse -----------------------------------------------------------------------------------------
// Namen auf Deutsch: die Ergänzungsdateien führen name_de, die Hauptdatei nur Landesnamen oder Englisch, teils mit
// verlorenen Umlauten (Natural Earth 5.1). Erst die Liste unten (bekannte deutsche Namen und die kaputten), dann, was
// die Ergänzung zum selben englischen Namen weiß, sonst der Name, wie er ist.
const DE_NAMES = {
  Rhine: 'Rhein', Rhin: 'Rhein', Danube: 'Donau', 'Soroksari Duna': 'Soroksárer Donau', Dnipro: 'Dnepr', Dnepre: 'Dnepr',
  Vistula: 'Weichsel', Thames: 'Themse', Tevere: 'Tiber', Tisa: 'Theiß', 'Severnaya Dvina': 'Nördliche Dwina', Neman: 'Memel',
  Dniester: 'Dnister', 'Southern Bug': 'Südlicher Bug', Volga: 'Wolga', Euphrates: 'Euphrat', Firat: 'Euphrat', 'Al Furat': 'Euphrat',
  Dicle: 'Tigris', Strymnas: 'Struma', Haliacmon: 'Haliakmon', Evros: 'Maritza', Warta: 'Warthe', Prut: 'Pruth', Mures: 'Mieresch',
  Olt: 'Alt', Ialomita: 'Ialomița', Vltava: 'Moldau', Pripyat: 'Prypjat', Neva: 'Newa', Svir: 'Swir', Volkhov: 'Wolchow',
  Sheksna: 'Scheksna', Sukhona: 'Suchona', Velikaya: 'Welikaja', Desna: 'Desna', Donets: 'Donez', Kuban: 'Kuban', Mezen: 'Mesen',
  Unzha: 'Unscha', Tsna: 'Zna', Seym: 'Seim', Khopr: 'Choper', Daugava: 'Düna', Neris: 'Neris', Drau: 'Drau', Sava: 'Save',
  Bojana: 'Bojana', Moulouya: 'Muluya', 'Oued Sebou': 'Sebou', Tajo: 'Tajo', Tejo: 'Tajo', Duero: 'Duero', Minho: 'Minho',
  'Gta lv': 'Göta älv', 'Göta älv': 'Göta älv', ngermanlven: 'Ångermanälven', 'Stora Lule lv': 'Stora Luleälv', 'Lule lv': 'Luleälven',
  Klarlven: 'Klarälven', Skelleftelven: 'Skellefteälven', Tornelven: 'Torneälven', 'Motala strm': 'Motala ström', 'Kiz?lirmak': 'Kızılırmak',
  'Byk Menderes': 'Büyük Menderes', Zncara: 'Záncara', Talkeh: 'Talkheh', Lngelmenjärvi: 'Längelmänjärvi',
  'Uljua syvnne': 'Uljuan tekojärvi', Sane: 'Saône', Mane: 'Måna', Hossanj: 'Hossanjoki', 'Balta Bistre?': 'Balta Bistreț',
};
const enDe = { river: new Map(), lake: new Map() };
/**
 * Linien, die Natural Earth über eine Mündung hinweg unter einem Namen führt: bis zur Stelle at (Länge, Breite) heißt
 * der Fluss head, danach tail (die Lahn trägt dort von der Quelle der Ohm bis Lahnstein den Namen Ohm, die Nahe von
 * der Quelle des Glans bis Bingen den Namen Glan, die Leine und die Oker bis zu ihrer Mündung den Namen Aller). from:
 * nur die Linie, die dort (Länge, Breite) beginnt.
 */
const SPLIT = {
  Ohm: [{ at: [8.778, 50.851], head: 'Ohm', tail: 'Lahn' }],
  Glan: [{ at: [7.703, 49.767], head: 'Glan', tail: 'Nahe' }],
  Aller: [
    { at: [9.611, 52.698], head: 'Leine', tail: 'Aller', from: [10.3226, 51.4064] },
    { at: [10.364, 52.528], head: 'Oker', tail: 'Aller', from: [10.5156, 51.8102] },
  ],
};
const nameOf = (pr, kind = 'river') => {
  const n = pr.name_de || DE_NAMES[pr.name] || enDe[kind].get(pr.name_en || pr.name) || pr.name || '';
  return n.replace(/\?/g, '');
};
for (const [f, kind] of [['ne_10m_rivers_europe', 'river'], ['ne_10m_lakes_europe', 'lake'], ['ne_10m_lakes', 'lake']])
  for (const ft of read(f)) {
    const pr = ft.properties;
    const M = enDe[kind];
    if (pr.name_de && (pr.name_en || pr.name) && !M.has(pr.name_en || pr.name)) M.set(pr.name_en || pr.name, pr.name_de);
    if (pr.name_de && pr.name && !M.has(pr.name)) M.set(pr.name, pr.name_de);
  }
const lines = [];
const add = (ft, src) => {
  const pr = ft.properties;
  const g = ft.geometry;
  if (!g || pr.featurecla === 'Lake Centerline') return;
  const L = g.type === 'LineString' ? [g.coordinates] : g.type === 'MultiLineString' ? g.coordinates : [];
  const sr = +pr.scalerank;
  const cls = src === 'main' ? (sr <= 5 ? 0 : 1) : 2;
  for (const l of L) {
    const name = nameOf(pr);
    const sp = (SPLIT[name] || []).find((q) => !q.from || Math.hypot(l[0][0] - q.from[0], l[0][1] - q.from[1]) < 0.01);
    // ein Fluss, den Natural Earth mit seinem Nebenfluss zu einer Linie zusammenlegt: an der Mündung teilen
    let k = -1;
    if (sp) {
      let best = Infinity;
      l.forEach(([lon, lat], i) => {
        const d = Math.hypot((lon - sp.at[0]) * Math.cos((lat * Math.PI) / 180), lat - sp.at[1]);
        if (d < best) [best, k] = [d, i];
      });
      if (best > 0.05) k = -1;
    }
    const pts = (part) => part.map(([lon, lat]) => [...proj(lon, lat), lat, 0]);
    if (k > 0 && k < l.length - 1) {
      lines.push({ name: sp.head, cls, src, pts: pts(l.slice(0, k + 1)) });
      lines.push({ name: sp.tail, cls, src, pts: pts(l.slice(k)) });
    } else lines.push({ name, cls, src, pts: pts(l) });
  }
};
for (const ft of read('ne_10m_rivers_lake_centerlines')) add(ft, 'main');
for (const ft of read('ne_10m_rivers_europe')) add(ft, 'eu');

// Hauptlinien als Gitter, damit die Ergänzung keine doppelt zeichnet
const mainGrid = new SegGrid(0.25);
for (const l of lines)
  if (l.src === 'main') for (let k = 0; k + 1 < l.pts.length; k++) mainGrid.add(l.pts[k][0], l.pts[k][1], l.pts[k + 1][0], l.pts[k + 1][1]);

const runs = [];
let dropped = { dup: 0, far: 0 };
for (const l of lines) {
  // je Punkt: behalten? Abstand zum Netz merken
  const keep = l.pts.map((p) => {
    p[3] = netKm(p[0], p[1], p[2]);
    if (l.src === 'eu' && mainGrid.dist(p[0], p[1], 1) * kmScale(p[2]) < DUP_KM) {
      dropped.dup++;
      return false;
    }
    const lon = p[0];
    const eu = inEurope(lon, p[2]);
    const big = l.cls <= 1 && eu;
    if (!big && !(p[3] <= (eu ? NET_KM : FAR_NET_KM))) {
      dropped.far++;
      return false;
    }
    return true;
  });
  let cur = [];
  const flush = () => {
    if (cur.length >= 2) runs.push({ name: l.name, cls: l.cls, pts: cur });
    cur = [];
  };
  for (let i = 0; i < l.pts.length; i++) {
    if (keep[i]) cur.push(l.pts[i]);
    else {
      // das Stück bis an den Rand behalten (ein Punkt darüber hinaus), damit Linien nicht vor dem Bereich enden
      if (cur.length) cur.push(l.pts[i]);
      flush();
    }
  }
  flush();
}
const rivers = runs.map((r) => ({ ...r, pts: simplify(r.pts, tolAt) })).filter((r) => r.pts.length >= 2);

// --- Seen -------------------------------------------------------------------------------------------
function ringAreaKm2(P) {
  let a = 0;
  for (let i = 0, j = P.length - 1; i < P.length; j = i++) a += (P[j][0] - P[i][0]) * (P[j][1] + P[i][1]);
  const lat = P[0][2];
  return (Math.abs(a) / 2) * kmScale(lat) * kmScale(lat);
}
const lakes = [];
const lakeSeen = new Set();
for (const f of ['ne_10m_lakes', 'ne_10m_lakes_europe']) {
  for (const ft of read(f)) {
    const g = ft.geometry;
    if (!g) continue;
    const polys = g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [];
    for (const poly of polys) {
      const outer = poly[0].map(([lon, lat]) => [...proj(lon, lat), lat, 0]);
      let dmin = Infinity;
      for (const p of outer) dmin = Math.min(dmin, (p[3] = netKm(p[0], p[1], p[2])));
      const area = ringAreaKm2(outer);
      const lon = outer[0][0];
      const okFar = inEurope(lon, outer[0][2]) && area >= LAKE_MIN.far;
      const okNear = dmin <= NET_KM && area >= (dmin <= LAKE_NEAR_KM ? LAKE_MIN.near : LAKE_MIN.mid);
      if (!okFar && !okNear) continue;
      // derselbe See in beiden Dateien: nach Mittelpunkt und Größe
      let cx = 0;
      let cy = 0;
      for (const p of outer) {
        cx += p[0];
        cy += p[1];
      }
      const key = `${Math.round((cx / outer.length) * 50)},${Math.round((cy / outer.length) * 50)}`;
      if (lakeSeen.has(key)) continue;
      lakeSeen.add(key);
      const ring = simplify(outer, (p) => (p[3] <= LAKE_NEAR_KM ? TOL.fine : TOL.coarse));
      if (ring.length >= 4) lakes.push({ name: nameOf(ft.properties, 'lake'), pts: ring, area });
    }
  }
}

// --- Abgleich mit dem Straßennetz der Karte (wasser-netz.mjs) ---------------------------------------
// gezeichnet werden die Kanten aus data.js (Knoten und Zwischenpunkte) und die Zubringer zu den Orten (mapview.js netData)
const drawn = [];
for (const e of edges) {
  if (e.kind !== 'ab' && e.kind !== 'land') continue;
  const ll = [[nodes[e.a].lat, nodes[e.a].lon], ...e.pts, [nodes[e.b].lat, nodes[e.b].lon]];
  drawn.push(ll.flatMap(([la, lo]) => proj(lo, la)));
}
for (const p of places) {
  if (p.node < 0 || distKm(nodes[p.node].lat, nodes[p.node].lon, p.lat, p.lon) < 0.3) continue;
  drawn.push([...proj(nodes[p.node].lon, nodes[p.node].lat), ...proj(p.lon, p.lat)]);
}
const before = STATS ? countCrossings(rivers, lakes, drawn) : null;
// Orte auf einer Halbinsel, die Natural Earth im See nicht zeigt (Sirmione im Gardasee): Land bis zu ihrem Knoten
const HALBINSELN = ['Sirmione'];
const fix = abgleich(rivers, lakes, {
  lines: drawn,
  nodes: nodes.map((n) => proj(n.lon, n.lat)),
  pins: places.map((p) => proj(p.lon, p.lat)),
  peninsulas: places.filter((p) => HALBINSELN.includes(p.name) && p.node >= 0).map((p) => [...proj(p.lon, p.lat), ...proj(nodes[p.node].lon, nodes[p.node].lat)]),
});
if (STATS) console.log('Paare nach dem Abgleich', pairsLeft(rivers, drawn).slice(0, 12));
// neue und verlegte Punkte: Breite dazu, dann leicht vereinfachen (die Unterteilung ist nur fürs Verlegen da)
for (const w of [...rivers, ...lakes]) {
  w.pts = simplify(
    w.pts.map((p) => [p[0], p[1], latOfY(p[1]), 0]),
    0.03,
  );
}
const cleared = clearNet([...rivers, ...lakes], drawn);

// --- Packen -----------------------------------------------------------------------------------------
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const zz = (v) => (v < 0 ? -2 * v - 1 : 2 * v);
function packNums(nums) {
  let s = '';
  for (const n of nums) {
    let v = zz(n);
    do {
      const d = v & 31;
      v = Math.floor(v / 32);
      s += ALPHA[d | (v > 0 ? 32 : 0)];
    } while (v > 0);
  }
  return s;
}
function packLine(P, closed) {
  const Pq = P.map((p) => [Math.round(p[0] * Q), Math.round(p[1] * Q)]);
  if (closed && Pq.length > 1 && Pq[0][0] === Pq[Pq.length - 1][0] && Pq[0][1] === Pq[Pq.length - 1][1]) Pq.pop();
  const out = [];
  // gleiche Rasterpunkte hintereinander fallen weg
  const U = Pq.filter((p, i) => i === 0 || p[0] !== Pq[i - 1][0] || p[1] !== Pq[i - 1][1]);
  let lx = 0;
  let ly = 0;
  for (const [x, y] of U) {
    out.push(x - lx, y - ly);
    lx = x;
    ly = y;
  }
  return { s: packNums(out), n: U.length };
}

// Namen einmal, Flüsse verweisen per Nummer
const names = [];
const nameIdx = new Map();
const nid = (n) => {
  if (!nameIdx.has(n)) {
    nameIdx.set(n, names.length);
    names.push(n);
  }
  return nameIdx.get(n);
};
const R = rivers.map((r) => {
  const p = packLine(r.pts, false);
  return p.n >= 2 ? [nid(r.name), r.cls, p.s] : null;
}).filter(Boolean);
const LK = lakes.map((l) => {
  const p = packLine(l.pts, true);
  return p.n >= 3 ? [nid(l.name), p.s] : null;
}).filter(Boolean);

const js =
  `// ERZEUGT von tools/map/wasser.mjs aus Natural Earth (gemeinfrei) – nicht von Hand ändern.\n` +
  `// Flüsse und Seen der Spielkarte, gelesen von src/map/water.js. Koordinaten in 1/${Q} Karteneinheiten (Mercator wie\n` +
  `// project() in graph.js) als Differenzen im Zickzack, je Zahl Zeichen zu 5 Bit (das sechste: es geht weiter).\n` +
  `/* eslint-disable */\n` +
  `export const WQ = ${Q};\n` +
  `export const WNAMES = ${JSON.stringify(names)};\n` +
  `// [Name, Klasse (0 Strom, 1 Fluss, 2 kleiner Fluss), Linie]\n` +
  `export const WRIVERS = [\n${R.map((r) => '  ' + JSON.stringify(r)).join(',\n')},\n];\n` +
  `// [Name, Umriss (geschlossen)]\n` +
  `export const WLAKES = [\n${LK.map((r) => '  ' + JSON.stringify(r)).join(',\n')},\n];\n`;
const target = join(here, '../../src/map/water-data.js');
writeFileSync(target, js);
const pts = rivers.reduce((a, r) => a + r.pts.length, 0);
const lpts = lakes.reduce((a, r) => a + r.pts.length, 0);
console.log(`water-data.js: ${R.length} Flussstücke (${pts} Punkte), ${LK.length} Seen (${lpts} Punkte), ${(js.length / 1024).toFixed(1)} kB`);
if (STATS) {
  console.log('weggefallen', dropped);
  console.log('Abgleich', fix, 'abgerückt', cleared, 'Kreuzungen vorher', before, 'nachher', countCrossings(rivers, lakes, drawn));
  const by = {};
  for (const r of rivers) by[r.cls] = (by[r.cls] || 0) + r.pts.length;
  console.log('Punkte je Klasse', by);
}
