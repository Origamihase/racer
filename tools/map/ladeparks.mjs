// Zusätzliche Ladeparks dort, wo das Netz sonst zu große Lücken hätte (src/map/ladenetz.js: zwischen zwei Ladeplätzen,
// die OMI kennt, verlangt eine Stelle mehr als LADENETZ.aim Prozent Akku). Typisch sind Städteknäuel wie das
// Rhein-Main-Gebiet, Berlin oder die Randstad: Dort wechselt die Route oft die Autobahn, und die Regel je Autobahn
// (src/map/parks.js) setzt ihre Parks nur nach dem Abstand auf der eigenen Straße.
//
// Gierig, Schritt für Schritt: An der schlimmsten Stelle werden die Ausfahrten in der Nähe probiert, an denen ein Park
// liegen darf (geeignet), und der Park, der die Summe der Überschreitungen (quadratisch) am meisten
// senkt, kommt dazu; jeder Versuch rechnet die Parks mit derselben Regel wie das Spiel (placeParks). Schluss ist, wenn
// keine Stelle mehr über LADENETZ.aim liegt oder kein Park mehr hilft. Das Ergebnis steht in netz.json unter
// "ladeparks" (Kennungen der Knoten, in der Reihenfolge der Wahl); npm run map schreibt es nach data.js (LADEPARKS).
//
// Aufruf (nach rasthoefe.mjs und npm run map; wiederholbar):
//
//     node tools/map/ladeparks.mjs
//     npm run map
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { nodes, edges, roads, distKm, deTo } from '../../src/map/graph.js';
import { placeParks, parkCandidate } from '../../src/map/parks.js';
import { ladenetz, onRoad, LADENETZ } from '../../src/map/ladenetz.js';
import { STARTS } from '../../src/game/starts.js';

/** So weit (km Luftlinie) um die schlimmste Stelle werden Ausfahrten probiert; höchstens so viele Parks kommen dazu. */
const SUCHE = { km: 120, max: 80 };

const here = dirname(fileURLToPath(import.meta.url));
const NETZ = join(here, 'netz.json');

/**
 * Darf an dieser Ausfahrt ein zusätzlicher Park liegen? Wie jeder Park (parks.js parkCandidate), dazu nicht an einem
 * Startort (game/starts.js: dort beginnt der Stream im Ort), nicht an einem Terminal (Fähre, Autozug, Luftfracht) und
 * zuerst (streng) nur, wo eine einzige Autobahn durchläuft: Wo zwei sich treffen, wechselt die Route dort oft die
 * Autobahn, und jedes Abfahren ohne Plan führte sonst in den Park statt in den Ort. Erst wo das nicht reicht, auch dort.
 */
function geeignet(nd, streng) {
  if (!parkCandidate(nd) || STARTS.includes(nd.id)) return false;
  const kinds = nd.edges.map((de) => edges[de >> 1]);
  if (kinds.some((e) => e.kind !== 'ab' && e.kind !== 'land')) return false;
  return !streng || new Set(kinds.filter((e) => e.kind === 'ab').map((e) => roads[e.road].label)).size === 1;
}

function bewerte(extra) {
  const parks = placeParks(extra);
  const at = new Set(parks.map((p) => p.node));
  const net = ladenetz(undefined, (n) => at.has(n));
  let excess = 0;
  let worst = -1;
  let max = 0;
  for (let s = 0; s < net.N; s++) {
    const g = net.gap[s];
    if (!onRoad(s)) continue;
    if (g > LADENETZ.aim) excess += (g - LADENETZ.aim) ** 2;
    if (g > max) {
      max = g;
      worst = s;
    }
  }
  return { excess, max, worst, net, count: parks.length };
}

const nodeOf = (net, s) => (s < net.NE ? nodes[deTo(s)] : nodes[s - net.NE]);
const extra = [];
let cur = bewerte(extra);
console.log(`Anfang: ${cur.count} Parks, schlimmste Stelle ${cur.max.toFixed(0)} % (${cur.net.name(cur.worst)}), Überschuss ${cur.excess.toFixed(0)}`);
const tried = new Set();
for (const streng of [true, false]) while (cur.max > LADENETZ.aim && extra.length < SUCHE.max) {
  // die schlimmsten Stellen der Reihe nach, bis eine Ausfahrt in ihrer Nähe hilft
  const order = [];
  for (let s = 0; s < cur.net.N; s++) if (onRoad(s) && cur.net.gap[s] > LADENETZ.aim) order.push(s);
  order.sort((a, b) => cur.net.gap[b] - cur.net.gap[a]);
  let best = null;
  for (const s of order) {
    const c = nodeOf(cur.net, s);
    const key = c.i;
    if (tried.has(key)) continue;
    tried.add(key);
    for (const nd of nodes) {
      if (extra.includes(nd.i) || !geeignet(nd, streng) || distKm(c.lat, c.lon, nd.lat, nd.lon) > SUCHE.km) continue;
      const r = bewerte([...extra, nd.i]);
      if (r.excess < cur.excess - 1 && (!best || r.excess < best.r.excess)) best = { nd, r };
    }
    if (best) break;
  }
  if (!best) {
    tried.clear();
    break;
  }
  extra.push(best.nd.i);
  cur = best.r;
  tried.clear();
  console.log(`+ ${best.nd.name.padEnd(28)} → schlimmste Stelle ${cur.max.toFixed(0)} % (${cur.net.name(cur.worst)}), Überschuss ${cur.excess.toFixed(0)}`);
}
console.log(`Ende: ${extra.length} zusätzliche Parks, ${cur.count} insgesamt, schlimmste Stelle ${cur.max.toFixed(0)} % (${cur.net.name(cur.worst)})`);

// netz.json: Zeile "ladeparks" vor den Etappen (ersetzen oder einfügen), alles andere bleibt Zeichen für Zeichen
const ids = extra.map((i) => nodes[i].id);
const zeile = '"ladeparks": [' + ids.map((k) => JSON.stringify(k)).join(', ') + '],';
const lines = readFileSync(NETZ, 'utf8').split('\n');
const at = lines.findIndex((l) => l.startsWith('"ladeparks": '));
if (at >= 0) lines[at] = zeile;
else lines.splice(lines.indexOf('"edges": ['), 0, zeile);
const text = lines.join('\n');
JSON.parse(text);
writeFileSync(NETZ, text);
