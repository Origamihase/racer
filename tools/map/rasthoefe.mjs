// Rasthöfe auf langen Etappen: Wo zwischen zwei Knoten einer Autobahn oder Landstraße mehr Spielstrecke liegt, als
// ein Ladepark-Abstand erlaubt (RAST.split Meter Straße, siehe graph.js edgeLen), teilt dieses Skript die Etappe in
// netz.json an echten Punkten ihres Verlaufs. Jeder Teilungspunkt wird ein Knoten der Art 'rast' (ein Rasthof mit
// Ladepark, src/map/parks.js), benannt nach dem nächsten Ort aus dem Ortsverzeichnis von GeoNames (CC BY 4.0, wie
// die übrigen Orte der Karte). So bekommen Strecken wie Madrid–Lissabon oder Oslo–Bergen Ladeparks, die Karte, Navi
// und Welt aus derselben Quelle kennen (COMMON.md §9).
//
// Die Spiellänge bleibt dabei, wie sie war: Eine sehr lange Etappe ist gestaucht (graph.js gameKm), und jedes Stück
// trägt seinen Anteil an der gestauchten Länge (spielKm); die Kartenkilometer (km) sind die echten des Stücks.
//
// Aufruf (nach verlauf.py und ufer.py, vor npm run map; wiederholbar: geteilte Etappen sind kürzer als RAST.split):
//
//     node tools/map/rasthoefe.mjs <cities500.json>
//     npm run map
//     node tools/map/ladeparks.mjs && npm run map
//     node tools/map/rasthoefe.mjs <cities500.json> --luecken
//     npm run map
//     node tools/map/ladeparks.mjs && npm run map
//
// <cities500.json>: das Ortsverzeichnis von GeoNames (Orte ab 500 Einwohnern), wie es das Python-Paket
// geonamescache mitbringt (geonamescache/data/cities500.json, dieselbe Quelle wie build_net.py); es gehört nicht ins
// Repository.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { K, gameKm, project } from '../../src/map/graph.js';
import { waterData } from '../../src/map/water.js';
import { COUNTRIES } from '../../src/map/land.js';

/**
 * Meter Straße: Etappen ab split werden geteilt, in Stücke um aim (je mindestens piece lang, damit vor der Ausfahrt
 * die Tafel des Ladeparks Platz hat, parks.js PARK_BOARD_ROOM); mit --luecken auch kürzere, auf denen das Netz noch zu
 * große Lücken hat, in zwei Stücke ab gapPiece (dort steht dann keine eigene Tafel vor der Ausfahrt). Der
 * Teilungspunkt liegt höchstens window (Anteil eines Stücks) neben seinem Wunschort, auf einem geraden Stück des
 * Verlaufs (höchstens bend Grad Richtungswechsel auf bendNear km davor und dahinter, sonst knickt der Kurs am Knoten),
 * mindestens water km neben Flüssen und Seen (wasser.mjs schiebt dort sonst Wasser beiseite; wo es keinen solchen
 * Punkt gibt, im Tal, waterMin) und mindestens node km neben anderen Knoten. far: so weit (km) darf der Ort weg sein,
 * nach dem der Rasthof heißt (in Lappland liegt der nächste weit weg); näher als near km gewinnt ein Ort mit
 * mindestens pop Einwohnern.
 */
export const RAST = { bend: 2, bendNear: 0.5, gapPiece: 2000, split: 5200, aim: 4000, piece: 2600, window: 0.3, water: 2.5, waterMin: 0.8, node: 6, far: 100, near: 12, pop: 2000 };

const here = dirname(fileURLToPath(import.meta.url));
const GAME_CC = new Set(COUNTRIES.map((c) => c[0]));
const NETZ = join(here, 'netz.json');

// --- Polylinien wie export.mjs (Google Encoded Polyline mit drei Spalten: Breite, Länge in 1e-5°, Höhe in m) ----
function decode(str, cols) {
  const out = [];
  const prev = new Array(cols).fill(0);
  let i = 0;
  let c = 0;
  while (i < str.length) {
    let shift = 0;
    let v = 0;
    let b;
    do {
      b = str.charCodeAt(i++) - 63;
      v |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    prev[c] += v & 1 ? ~(v >> 1) : v >> 1;
    if (++c === cols) {
      out.push(prev.slice());
      c = 0;
    }
  }
  return out;
}
function encode(rows) {
  const out = [];
  const prev = new Array(rows[0].length).fill(0);
  for (const r of rows) {
    r.forEach((v, i) => {
      let d = v - prev[i];
      d = d < 0 ? ~(d << 1) : d << 1;
      while (d >= 0x20) {
        out.push(String.fromCharCode((0x20 | (d & 0x1f)) + 63));
        d >>= 5;
      }
      out.push(String.fromCharCode(d + 63));
      prev[i] = v;
    });
  }
  return out.join('');
}

const RAD = Math.PI / 180;
function hav(la1, lo1, la2, lo2) {
  const h = Math.sin(((la2 - la1) * RAD) / 2) ** 2 + Math.cos(la1 * RAD) * Math.cos(la2 * RAD) * Math.sin(((lo2 - lo1) * RAD) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Punkt des Verlaufs ll (Bogenlängen s) bei Bogenlänge x. */
function pointAt(ll, s, x) {
  let k = 1;
  while (k < s.length - 1 && s[k] < x) k++;
  const t = s[k] > s[k - 1] ? Math.max(0, Math.min(1, (x - s[k - 1]) / (s[k] - s[k - 1]))) : 0;
  return [ll[k - 1][0] + (ll[k][0] - ll[k - 1][0]) * t, ll[k - 1][1] + (ll[k][1] - ll[k - 1][1]) * t];
}
function kurs([la1, lo1], [la2, lo2]) {
  const y = Math.sin((lo2 - lo1) * RAD) * Math.cos(la2 * RAD);
  const x = Math.cos(la1 * RAD) * Math.sin(la2 * RAD) - Math.sin(la1 * RAD) * Math.cos(la2 * RAD) * Math.cos((lo2 - lo1) * RAD);
  return Math.atan2(y, x) / RAD;
}
/** Richtungswechsel (Grad) des Verlaufs bei Bogenlänge x: Sehne d km davor gegen Sehne d km dahinter. */
function turn(ll, s, x, d) {
  if (d <= 0) return 0;
  const p = pointAt(ll, s, x);
  const w = Math.abs(kurs(pointAt(ll, s, x - d), p) - kurs(p, pointAt(ll, s, x + d))) % 360;
  return w > 180 ? 360 - w : w;
}

// --- Wasser (dieselben Linien wie die Karte) ---------------------------------------------------------------------
const W = waterData();
const waterLines = [...W.rivers, ...W.lakes];
/** Abstand (km) des Punkts zum nächsten Fluss oder Seeufer, höchstens bis cap. */
function waterKm(lat, lon, cap) {
  const p = project(lat, lon);
  const kpu = 111.32 * Math.cos(lat * RAD); // km je Karteneinheit in dieser Breite (Mercator)
  const r = cap / kpu;
  let best = cap;
  for (const w of waterLines) {
    const b = w.box;
    if (p.x < b[0] - r || p.x > b[2] + r || p.y < b[1] - r || p.y > b[3] + r) continue;
    const P = w.pts;
    for (let k = 2; k < P.length; k += 2) {
      const ax = P[k - 2];
      const ay = P[k - 1];
      const dx = P[k] - ax;
      const dy = P[k + 1] - ay;
      const l2 = dx * dx + dy * dy;
      const t = l2 > 0 ? Math.max(0, Math.min(1, ((p.x - ax) * dx + (p.y - ay) * dy) / l2)) : 0;
      const d = Math.hypot(p.x - ax - t * dx, p.y - ay - t * dy) * kpu;
      if (d < best) best = d;
    }
  }
  return best;
}

// --- Ortsverzeichnis -----------------------------------------------------------------------------------------------
function loadTowns(path) {
  const raw = JSON.parse(readFileSync(path, 'utf8'));
  const cells = new Map();
  for (const c of Object.values(raw)) {
    const t = { name: c.name, lat: c.latitude, lon: c.longitude, cc: c.countrycode, pop: c.population };
    const key = Math.floor(t.lat) + ',' + Math.floor(t.lon);
    if (!cells.has(key)) cells.set(key, []);
    cells.get(key).push(t);
  }
  return cells;
}
function townsNear(cells, lat, lon, km) {
  const out = [];
  const dl = Math.ceil(km / 111) + 1;
  const dn = Math.ceil(km / (111 * Math.max(0.2, Math.cos(lat * RAD)))) + 1;
  for (let a = Math.floor(lat) - dl; a <= Math.floor(lat) + dl; a++) {
    for (let o = Math.floor(lon) - dn; o <= Math.floor(lon) + dn; o++) {
      for (const t of cells.get(a + ',' + o) || []) {
        const d = hav(lat, lon, t.lat, t.lon);
        if (d <= km) out.push({ ...t, d });
      }
    }
  }
  return out.sort((x, y) => x.d - y.d || y.pop - x.pop || (x.name < y.name ? -1 : 1));
}

// --- Schreiben wie verlauf.py (eine Zeile je Eintrag, json.dumps mit ensure_ascii=False); unveränderte Zeilen bleiben
// Zeichen für Zeichen, wie sie waren ------------------------------------------------------------------------------------
const RAW = readFileSync(NETZ, 'utf8');
const LINES = (() => {
  const out = { places: [], nodes: [], roads: [], edges: [] };
  let sec = null;
  for (const line of RAW.split('\n')) {
    const m = /^"(places|nodes|roads|edges)": [{[]$/.exec(line);
    if (m) sec = m[1];
    else if (/^[\]}]/.test(line)) sec = null;
    else if (sec) out[sec].push(line.replace(/,$/, ''));
  }
  return out;
})();
function pyDump(v, key) {
  if (Array.isArray(v)) return '[' + v.map((x) => pyDump(x)).join(', ') + ']';
  if (v && typeof v === 'object') return '{' + Object.entries(v).map(([k, x]) => JSON.stringify(k) + ': ' + pyDump(x, k)).join(', ') + '}';
  if (typeof v === 'number' && (key === 'km' || key === 'spielKm') && Number.isInteger(v)) return v.toFixed(1);
  return JSON.stringify(v);
}
function write(netz, changedRoads) {
  const nodeKeys = Object.keys(netz.nodes);
  const edgeLine = new Map(JSON.parse(RAW).edges.map((e, i) => [e.form + '|' + e.a + '|' + e.b, LINES.edges[i]]));
  const block = (name, open, close, rows) => `"${name}": ${open}\n${rows.join(',\n')}\n${close}`;
  const text =
    '{\n' +
    block('places', '{', '}', LINES.places) + ',\n' +
    block('nodes', '{', '}', nodeKeys.map((k, i) => (i < LINES.nodes.length ? LINES.nodes[i] : JSON.stringify(k) + ': ' + pyDump(netz.nodes[k])))) + ',\n' +
    block('roads', '[', ']', netz.roads.map((r, i) => (changedRoads.has(r) ? pyDump(r) : LINES.roads[i]))) + ',\n' +
    (netz.ladeparks ? '"ladeparks": ' + pyDump(netz.ladeparks) + ',\n' : '') +
    block('edges', '[', ']', netz.edges.map((e) => edgeLine.get(e.form + '|' + e.a + '|' + e.b) ?? pyDump(e))) + '\n}\n';
  JSON.parse(text);
  writeFileSync(NETZ, text);
}

// --- Teilen ----------------------------------------------------------------------------------------------------------
async function main() {
  const townsPath = process.argv[2];
  // --luecken: dazu die Etappen, auf denen das Netz zwischen zwei Ladeplätzen noch mehr verlangt als LADENETZ.max
  // (src/map/ladenetz.js mit der Karte, wie sie gerade exportiert ist), in zwei Stücke ab gapPiece Metern
  const luecken = new Set();
  if (process.argv.includes('--luecken')) {
    const { ladeluecken } = await import('../../src/map/ladenetz.js');
    const G = await import('../../src/map/graph.js');
    for (const l of ladeluecken()) {
      if (l.s >= G.edges.length * 2) continue;
      const e = G.edges[l.s >> 1];
      luecken.add(G.nodes[e.a].id + '|' + G.nodes[e.b].id);
    }
  }
  if (!townsPath) throw new Error('Aufruf: node tools/map/rasthoefe.mjs <cities500.json>');
  const cells = loadTowns(townsPath);
  const netz = JSON.parse(readFileSync(NETZ, 'utf8'));
  const kindOf = new Map(netz.roads.map((r) => [r.id, r.kind]));
  const taken = new Set([...Object.values(netz.nodes).map((n) => n.name), ...Object.values(netz.places).map((p) => p.name), ...Object.keys(netz.places)]);
  const bare = (s) => s.replace(/ \(Rasthof\)$/, '');
  for (const n of Object.values(netz.nodes)) taken.add(bare(n.name));
  const nodePts = Object.values(netz.nodes).map((n) => [n.lat, n.lon]);
  const added = [];
  const skipped = [];
  const edgesOut = [];
  const tail = [];
  const changedRoads = new Set();
  for (const e of netz.edges) {
    const kind = kindOf.get(e.road);
    const basis = e.spielKm ?? gameKm(e.km);
    const band = (basis * 1000) / K;
    const gapEdge = luecken.has(e.a + '|' + e.b) && band >= 2 * RAST.gapPiece;
    if ((kind !== 'ab' && kind !== 'land') || (band < RAST.split && !gapEdge)) {
      edgesOut.push(e);
      continue;
    }
    const n = band < RAST.split ? 2 : Math.max(2, Math.min(Math.round(band / RAST.aim), Math.floor(band / RAST.piece)));
    const pts = decode(e.form, 3);
    const ll = pts.map(([la, lo]) => [la / 1e5, lo / 1e5]);
    const s = [0];
    for (let k = 1; k < ll.length; k++) s.push(s[k - 1] + hav(ll[k - 1][0], ll[k - 1][1], ll[k][0], ll[k][1]));
    const L = s[s.length - 1];
    const cuts = [];
    for (let j = 1; j < n; j++) {
      const want = (L * j) / n;
      const win = (RAST.window * L) / n;
      let best = -1;
      // Die Ausfahrt braucht ein gerades Stück (der Kurs ist um jeden Knoten herum gerade, course.js): der Punkt liegt
      // dort, wo auch die echte Straße geradeaus läuft – nah am Knoten (RAST.bendNear km) höchstens RAST.bend Grad
      // Richtungswechsel (so knickt der Verlauf am neuen Knoten nicht, shape-test), und auf der Ruhezone (400 m Straße
      // je Seite, in Kartenkilometern dieser Etappe) möglichst wenig
      const zone = (0.4 * L) / (band / 1000);
      // in engen Tälern (Brenner, Fjorde) liegt nirgends ein Punkt so weit vom Wasser: dann reicht waterMin
      for (const dry of [RAST.water, RAST.waterMin]) {
        let bestQ = Infinity;
        for (let k = 1; k < ll.length - 1; k++) {
          if (Math.abs(s[k] - want) > win || (cuts.length && k <= cuts[cuts.length - 1])) continue;
          const [la, lo] = ll[k];
          if (nodePts.some(([a, b]) => hav(la, lo, a, b) < RAST.node)) continue;
          if (turn(ll, s, s[k], RAST.bendNear) > RAST.bend) continue;
          if (waterKm(la, lo, dry) < dry) continue;
          const q = turn(ll, s, s[k], Math.min(zone, s[k], L - s[k])) + (20 * Math.abs(s[k] - want)) / win;
          if (q < bestQ) {
            bestQ = q;
            best = k;
          }
        }
        if (best >= 0) break;
      }
      if (best < 0) {
        skipped.push(`${e.road} ${e.a} → ${e.b}: kein trockener, gerader Punkt um ${want.toFixed(0)} km`);
        continue;
      }
      cuts.push(best);
    }
    if (!cuts.length) {
      edgesOut.push(e);
      continue;
    }
    // Knoten an den Teilungspunkten
    const ccA = netz.nodes[e.a].cc;
    const ccB = netz.nodes[e.b].cc;
    const keys = cuts.map((k) => {
      const lat = Math.round(ll[k][0] * 1e4) / 1e4;
      const lon = Math.round(ll[k][1] * 1e4) / 1e4;
      // nur Orte in Ländern, durch die die Straßen der Karte führen (Slowenien: A2 Villach–Zagreb; Belarus nicht, die E67
      // läuft nur nah an der Grenze)
      const near = townsNear(cells, lat, lon, RAST.far).filter((t) => GAME_CC.has(t.cc) || t.cc === 'SI');
      const big = near.find((t) => t.d <= RAST.near && t.pop >= RAST.pop && !taken.has(t.name));
      const town = big || near.find((t) => !taken.has(t.name));
      if (!town) throw new Error(`Kein Ort für einen Rasthof bei ${lat}, ${lon} (${e.road})`);
      taken.add(town.name);
      const key = 'Rasthof ' + town.name;
      // Land des Orts; liegt er in einem Land, das die Karte sonst nicht kennt (Slowenien, Belarus), das des näheren Endes
      const near0 = hav(lat, lon, netz.nodes[e.a].lat, netz.nodes[e.a].lon) <= hav(lat, lon, netz.nodes[e.b].lat, netz.nodes[e.b].lon);
      const cc = GAME_CC.has(town.cc) ? town.cc : near0 ? ccA : ccB;
      netz.nodes[key] = { name: key, lat, lon, kind: 'rast', cc, pop: 0, places: [] };
      nodePts.push([lat, lon]);
      added.push(`${e.road.padEnd(6)} ${key} (${town.d.toFixed(1)} km, ${town.pop} Einw., ${cc}) zwischen ${e.a} und ${e.b}`);
      return key;
    });
    // Stücke: Verlauf, Kartenkilometer (Anteil am echten km der Etappe), Anteil an der gestauchten Länge
    const ends = [0, ...cuts, ll.length - 1];
    const ids = [e.a, ...keys, e.b];
    for (let j = 0; j + 1 < ends.length; j++) {
      const share = (s[ends[j + 1]] - s[ends[j]]) / L;
      const piece = {
        a: ids[j],
        b: ids[j + 1],
        road: e.road,
        km: Math.round(e.km * share * 10) / 10,
        pts: [],
        form: encode(pts.slice(ends[j], ends[j + 1] + 1)),
        status: e.status,
      };
      if (e.ufer) piece.ufer = e.ufer;
      if (basis !== e.km || e.spielKm !== undefined) piece.spielKm = Math.round(basis * share * 100) / 100;
      // das erste Stück behält den Platz der Etappe (Indizes der übrigen Etappen bleiben), die übrigen kommen ans Ende
      (j === 0 ? edgesOut : tail).push(piece);
    }
    // Reihenfolge der Knoten der Straße
    const r = netz.roads.find((q) => q.id === e.road);
    let at = -1;
    for (let k = 0; k + 1 < r.nodes.length; k++) {
      if (r.nodes[k] === e.a && r.nodes[k + 1] === e.b) at = k;
      else if (r.nodes[k] === e.b && r.nodes[k + 1] === e.a) at = -(k + 2);
    }
    if (at === -1) throw new Error(`Etappe ${e.a} → ${e.b} liegt nicht auf ${e.road}`);
    changedRoads.add(r);
    if (at >= 0) r.nodes.splice(at + 1, 0, ...keys);
    else r.nodes.splice(-at - 1, 0, ...keys.slice().reverse());
  }
  netz.edges = [...edgesOut, ...tail];
  write(netz, changedRoads);
  console.log(added.join('\n'));
  if (skipped.length) console.log('Nicht geteilt:\n' + skipped.join('\n'));
  console.log(`Rasthöfe: ${added.length} neue Knoten, ${skipped.length} Teilungen ausgelassen`);
}
main();
