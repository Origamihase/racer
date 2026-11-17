// Baut aus tools/map/netz.json die kompakten Kartendaten des Spiels (src/map/data.js).
// Aufruf: npm run map
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const netz = JSON.parse(readFileSync(join(here, 'netz.json'), 'utf8'));
const KINDS = ['ab', 'land', 'faehre', 'zug', 'flug'];
const NODE_KINDS = ['ort', 'as', 'kreuz', 'via'];

// --- Orte ---------------------------------------------------------------------------------
const placeKeys = Object.keys(netz.places);
const placeIdx = new Map(placeKeys.map((k, i) => [k, i]));
const PLACES = placeKeys.map((k) => {
  const p = netz.places[k];
  return [k, p.name, p.lat, p.lon, p.cc, p.n, p.pop];
});

// --- Knoten -------------------------------------------------------------------------------
const nodeKeys = Object.keys(netz.nodes);
const nodeIdx = new Map(nodeKeys.map((k, i) => [k, i]));
const seen = new Set();
const NODES = nodeKeys.map((k) => {
  const n = netz.nodes[k];
  const pl = n.places.map(([p, d]) => {
    if (!placeIdx.has(p)) throw new Error('Ort fehlt: ' + p);
    if (seen.has(p)) throw new Error('Ort doppelt angehängt: ' + p);
    seen.add(p);
    return [placeIdx.get(p), d];
  });
  pl.sort((a, b) => a[1] - b[1]);
  return [k, n.name, n.lat, n.lon, NODE_KINDS.indexOf(n.kind), n.cc, n.pop, pl];
});
for (const k of placeKeys) if (!seen.has(k)) throw new Error('Ort hängt an keinem Knoten: ' + k);

// --- Straßen ------------------------------------------------------------------------------
const SPECIAL = {
  FLTP: "Florida's Turnpike", TOMEI: 'Tōmei', BERNINA: 'Berninapass', JO15: 'Route 15', MT1: 'Route 1', MX85: 'MEX 85',
  TF1: 'TF-1', AP7: 'AP-7', AP68: 'AP-68', RV3: 'Rv3', RV40: 'Rv40', VT9: 'Vt9', VT5: 'Vt5', Z_TUNNEL: 'Eurotunnel', Z_SYLT: 'Autozug',
};
function roadLabel(r) {
  if (SPECIAL[r.id]) return SPECIAL[r.id];
  if (r.kind === 'faehre') return 'Fähre';
  if (r.kind === 'flug') return 'Luftfracht';
  let s = r.id;
  if (r.cc !== 'DE' && s.length > 3 && s.endsWith(r.cc)) s = s.slice(0, -2);
  s = s.replace(/^([A-Z]+\d+)[WOSNHE]$/, '$1'); // zweiter Ast derselben Straße (A4W, A44O, I80E …)
  if (r.cc === 'US') s = s.replace(/^I(\d+)$/, 'I-$1').replace(/^US(\d+)$/, 'US-$1');
  if (r.cc === 'ES') s = s.replace(/^A(\d+)$/, 'A-$1');
  return s;
}
const roadIdx = new Map(netz.roads.map((r, i) => [r.id, i]));
const ROADS = netz.roads.map((r) => [r.id, roadLabel(r), KINDS.indexOf(r.kind), r.cc, r.nodes.map((n) => nodeIdx.get(n))]);

// --- Fernziele für die Schilder: der nächste große Ort in Fahrtrichtung -------------------
const popOf = (ni) => NODES[ni][6];
function towards(roadNodes, from, step) {
  // from: Index des Knotens, auf den die Kante zuläuft
  let best = -1;
  for (let i = from; i >= 0 && i < roadNodes.length; i += step) {
    const n = roadNodes[i];
    if (popOf(n) >= 100000) return n;
    if (best < 0 || popOf(n) > popOf(best)) best = n;
  }
  if (best >= 0 && popOf(best) > 0) return best;
  return roadNodes[step > 0 ? roadNodes.length - 1 : 0];
}

// --- Kanten -------------------------------------------------------------------------------
const EDGES = netz.edges.map((e) => {
  const a = nodeIdx.get(e.a);
  const b = nodeIdx.get(e.b);
  const r = roadIdx.get(e.road);
  if (a === undefined || b === undefined || r === undefined) throw new Error('Kante kaputt: ' + JSON.stringify(e));
  const rn = ROADS[r][4];
  let tA = a;
  let tB = b;
  // Lage der Kante auf der Straße suchen (a und b sind dort Nachbarn)
  for (let i = 0; i + 1 < rn.length; i++) {
    if (rn[i] === a && rn[i + 1] === b) {
      tB = towards(rn, i + 1, 1);
      tA = towards(rn, i, -1);
    } else if (rn[i] === b && rn[i + 1] === a) {
      tA = towards(rn, i + 1, 1);
      tB = towards(rn, i, -1);
    }
  }
  return [a, b, r, e.km, e.pts, tA, tB];
});

// --- Schreiben ----------------------------------------------------------------------------
const lines = (name, rows) => `export const ${name} = [\n${rows.map((r) => JSON.stringify(r)).join(',\n')},\n];\n`;
const out =
  '// ERZEUGT von tools/map/export.mjs aus tools/map/netz.json – nicht von Hand ändern.\n' +
  '// Orte: [Wiki-Name, Anzeigename, Breite, Länge, Land, Zahl der Streams, Einwohner]\n' +
  '// Knoten: [Kennung, Name, Breite, Länge, Art (0 Ort, 1 Anschlussstelle, 2 Kreuz, 3 Durchgangsort), Land, Einwohner, [[Ort, Zubringer-km] …]]\n' +
  '// Straßen: [Kennung, Schildname, Art (0 Autobahn, 1 Landstraße, 2 Fähre, 3 Zug, 4 Flug), Land, [Knoten …]]\n' +
  '// Kanten: [Knoten a, Knoten b, Straße, km, [[Breite, Länge] … Zwischenpunkte], Fernziel Richtung a, Fernziel Richtung b]\n' +
  '/* eslint-disable */\n' +
  lines('PLACES', PLACES) +
  lines('NODES', NODES) +
  lines('ROADS', ROADS) +
  lines('EDGES', EDGES);
const target = join(here, '..', '..', 'src', 'map', 'data.js');
writeFileSync(target, out);
console.log(`Karte: ${PLACES.length} Orte, ${NODES.length} Knoten, ${ROADS.length} Straßen, ${EDGES.length} Kanten → src/map/data.js (${(out.length / 1024).toFixed(0)} kB)`);
