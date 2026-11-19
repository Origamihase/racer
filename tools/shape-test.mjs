// Prüft die Straßenverläufe (src/map/shapes.js) gegen die Karte: node tools/shape-test.mjs
// Enden genau auf den Knoten, keine NaN, keine Kehren, plausible Länge, Höhen und Steigungen, glatte Übergänge an
// den Knoten einer Straße, Dekodierzeit, Größe und ein wiederholbarer Export.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';
import { gzipSync } from 'node:zlib';
import { PLACES, NODES, ROADS, EDGES } from '../src/map/data.js';
import { edgeShape, shapeCount } from '../src/map/shapes.js';

const KINDS = ['ab', 'land', 'faehre', 'zug', 'flug'];
// höchste Steigung je Straßenart, eine Quelle mit Pipeline und Export
const STEIGUNG = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'map', 'quelle', 'regeln.json'), 'utf8')).steigung;
const MAX_KNICK = 120; // Grad zwischen zwei Abschnitten
// Mindestradius: Richtungswechsel zwischen den Sehnen 0,3 km vor und nach jedem Punkt (ohne die letzten 0,3 km an
// den Knoten, dort gilt MAX_UEBERGANG); eine 100°-Ecke fährt niemand mit Autobahntempo
const ECKE_SEHNE_KM = 0.3;
// Die groben Zwischenpunkte in data.js (graph.js straight, trip.js turnAngle, Kartenzeichnung) beginnen und enden
// mit dem Richtungspunkt des Verlaufs: erster und letzter grober Abschnitt zeigen wie der Verlauf am Knoten
const MAX_GROB_RICHTUNG = 8; // Grad; der Richtungspunkt steht 0,1–0,3 km vom Knoten, auf 1e-4° gerundet
const MAX_ECKE = { ab: 60, land: 100 };
// Bekannte Ausnahmen (Straße:Knoten a:Knoten b → Grund); der Test meldet auch, wenn eine nicht mehr nötig ist
const ECKE_AUSNAHMEN = new Map([
  ['A12:Frankfurt (Oder):Slubice', 'Etappe von 1 km über die Oder zwischen zwei Ortsknoten; die Übergänge an beiden Enden geben die Richtung vor'],
  ['A66:Eichenzell:Dreieck Fulda', 'Etappe von 2,5 km zwischen zwei Übergängen mit 60° Richtungsunterschied'],
]);
const MAX_UEBERGANG = 8; // Grad Richtungsunterschied an einem gemeinsamen Knoten einer Straße
// Schleife: eine Autobahn kehrt nach so viel km Verlauf nicht bis auf so viel km Luftlinie zu sich zurück (ein
// falsch gelegter Knoten zwang die A24 einmal 21 km die A14 hinauf und wieder herunter); Pässe mit Kehren sind
// Landstraßen und ausgenommen
const SCHLEIFE_KM = { bogen: 12, luft: 3 };
// Lange Tunnel: die Straße fährt hindurch, nicht über den Berg. Höchste Höhe der Straße im Rechteck um den Tunnel
// (Breite von/bis, Länge von/bis): die A9 bleibt unter dem Pyhrnpass (945 m; Täler an den Portalen 650–750 m), die
// A2 unter dem Scheitel des Gotthard-Straßentunnels (1.175 m; Portale 1.080 / 1.145 m)
const TUNNEL_HOEHE = [
  ['A9AT', 'Bosrucktunnel', [47.59, 47.67, 14.3, 14.4], 850],
  ['A2CH', 'Gotthard-Straßentunnel', [46.52, 46.67, 8.57, 8.63], 1200],
];
const DEKODIEREN_MS = 60;
const ROH_BYTES = 300000; // Budget von shapes.js
const GZIP_BYTES = 120000;
const ORT_KM = 1.5; // graph.js/trip.js: ein Ort mit Zubringer unter so viel km liegt am Knoten
// Zubringer eines Orts abseits des Knotens: ein kurzer, glaubhafter Weg zwischen Luftlinie und Luftlinie × 1,2 + 1 km
// (knoten.zubringer_roh); Orte am Knoten enden am Ortsrand, für sie gilt nur ORT_KM
const ZUBRINGER = [1.2, 1.0];

let fails = 0;
const ok = (cond, msg) => {
  if (!cond) {
    fails++;
    if (fails < 40) console.log('FEHLER:', msg);
  }
};
const RAD = Math.PI / 180;
function distKm(la1, lo1, la2, lo2) {
  const h = Math.sin(((la2 - la1) * RAD) / 2) ** 2 + Math.cos(la1 * RAD) * Math.cos(la2 * RAD) * Math.sin(((lo2 - lo1) * RAD) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(h)));
}
/** Punkt bei Bogenlänge x (km) eines Verlaufs mit kumulierten Längen cum. */
function punktBei(sh, cum, x) {
  let k = 1;
  while (k < sh.n - 1 && cum[k] < x) k++;
  const t = (x - cum[k - 1]) / Math.max(1e-12, cum[k] - cum[k - 1]);
  return [sh.lat[k - 1] + t * (sh.lat[k] - sh.lat[k - 1]), sh.lon[k - 1] + t * (sh.lon[k] - sh.lon[k - 1])];
}
function kurs(la1, lo1, la2, lo2) {
  const y = Math.sin((lo2 - lo1) * RAD) * Math.cos(la2 * RAD);
  const x = Math.cos(la1 * RAD) * Math.sin(la2 * RAD) - Math.sin(la1 * RAD) * Math.cos(la2 * RAD) * Math.cos((lo2 - lo1) * RAD);
  return Math.atan2(y, x) / RAD;
}
const winkel = (a, b) => Math.abs(((b - a + 540) % 360) - 180);

// --- Dekodieren (erster Abruf jedes Verlaufs) --------------------------------------------------------------
// Geprüft wird die Rechenzeit dieses Prozesses (process.cpuUsage), nicht die Wanduhr: auf einer geteilten,
// ausgelasteten Maschine wartet der Prozess sonst auf einen freien Kern, und der Test fiele zufällig durch.
const cpu0 = process.cpuUsage();
const t0 = performance.now();
const shapes = [];
for (let i = 0; i < shapeCount; i++) shapes.push(edgeShape(i));
const wandMs = performance.now() - t0;
const cpu = process.cpuUsage(cpu0);
const ms = (cpu.user + cpu.system) / 1000;
ok(ms < DEKODIEREN_MS, `Dekodieren aller Verläufe braucht ${ms.toFixed(1)} ms Rechenzeit (erlaubt ${DEKODIEREN_MS})`);
ok(shapeCount === EDGES.length, `${shapeCount} Verläufe für ${EDGES.length} Kanten`);
ok(edgeShape(0) === shapes[0], 'zweiter Abruf kommt aus dem Zwischenspeicher');
for (const falsch of [-1, shapeCount, 1.5, NaN]) {
  let fehler = null;
  try {
    edgeShape(falsch);
  } catch (e) {
    fehler = e;
  }
  ok(fehler instanceof RangeError, `edgeShape(${falsch}) wirft keinen RangeError`);
}

// --- Jeder Verlauf für sich --------------------------------------------------------------------------------
let punkte = 0;
let maxKnick = 0;
let maxGrob = 0;
const maxEcke = { ab: 0, land: 0 };
let maxVerh = 0;
let maxSchleife = 0; // längster Bogen einer Autobahn, der auf weniger als SCHLEIFE_KM.luft zurückkehrt
const status = [0, 0, 0];
EDGES.forEach(([a, b, r, km, grob], i) => {
  const s = shapes[i];
  const kind = KINDS[ROADS[r][2]];
  const name = `Kante ${i} ${ROADS[r][0]} ${NODES[a][0]} → ${NODES[b][0]}`;
  punkte += s.n;
  status[s.matched]++;
  ok(s.n >= 2 && s.lat.length === s.n && s.lon.length === s.n && s.elev.length === s.n, `${name}: Punktzahl`);
  ok([0, 1, 2].includes(s.matched), `${name}: Abgleich ${s.matched}`);
  ok(s.lat[0] === NODES[a][2] && s.lon[0] === NODES[a][3], `${name}: beginnt nicht genau am Knoten`);
  ok(s.lat[s.n - 1] === NODES[b][2] && s.lon[s.n - 1] === NODES[b][3], `${name}: endet nicht genau am Knoten`);
  let L = 0;
  let prevKurs = null;
  for (let k = 0; k < s.n; k++) {
    ok(Number.isFinite(s.lat[k]) && Number.isFinite(s.lon[k]) && Number.isFinite(s.elev[k]), `${name}: NaN bei Punkt ${k}`);
    ok(s.elev[k] >= -50 && s.elev[k] <= 3500, `${name}: Höhe ${s.elev[k]} m`);
    if (k === 0) continue;
    const d = distKm(s.lat[k - 1], s.lon[k - 1], s.lat[k], s.lon[k]);
    L += d;
    ok(d > 0, `${name}: doppelter Punkt ${k}`);
    if (d <= 0) continue;
    const c = kurs(s.lat[k - 1], s.lon[k - 1], s.lat[k], s.lon[k]);
    if (prevKurs !== null) {
      const w = winkel(prevKurs, c);
      maxKnick = Math.max(maxKnick, w);
      ok(w <= MAX_KNICK, `${name}: Knick ${w.toFixed(0)}° bei Punkt ${k}`);
    }
    prevKurs = c;
    // Steigung auf jedem Abschnitt: der Export rundet die Höhen so, dass jeder Höhenschritt in ganzen Metern
    // höchstens Grenze × Länge beträgt (nur ein Hauch Spielraum für die Gleitkommarechnung)
    if (STEIGUNG[kind]) {
      const g = Math.abs(s.elev[k] - s.elev[k - 1]);
      ok(g <= STEIGUNG[kind] * d * 1000 * (1 + 1e-9), `${name}: Steigung ${((g / (d * 1000)) * 100).toFixed(1)} % bei Punkt ${k}`);
    }
  }
  if (MAX_ECKE[kind] && s.n > 2) {
    const g = [[NODES[a][2], NODES[a][3]], ...grob, [NODES[b][2], NODES[b][3]]];
    const m = g.length;
    const wa = winkel(kurs(g[0][0], g[0][1], g[1][0], g[1][1]), kurs(s.lat[0], s.lon[0], s.lat[1], s.lon[1]));
    const wb = winkel(kurs(g[m - 2][0], g[m - 2][1], g[m - 1][0], g[m - 1][1]), kurs(s.lat[s.n - 2], s.lon[s.n - 2], s.lat[s.n - 1], s.lon[s.n - 1]));
    maxGrob = Math.max(maxGrob, wa, wb);
    ok(Math.max(wa, wb) <= MAX_GROB_RICHTUNG, `${name}: grober Verlauf weicht am Knoten um ${Math.max(wa, wb).toFixed(1)}° ab`);
  }
  if (MAX_ECKE[kind]) {
    const cum = [0];
    for (let k = 1; k < s.n; k++) cum.push(cum[k - 1] + distKm(s.lat[k - 1], s.lon[k - 1], s.lat[k], s.lon[k]));
    let ecke = 0;
    let wo = 0;
    for (let k = 1; k < s.n - 1; k++) {
      if (cum[k] < ECKE_SEHNE_KM || cum[k] > L - ECKE_SEHNE_KM) continue;
      const p = punktBei(s, cum, cum[k] - ECKE_SEHNE_KM);
      const q = punktBei(s, cum, cum[k] + ECKE_SEHNE_KM);
      const w = winkel(kurs(p[0], p[1], s.lat[k], s.lon[k]), kurs(s.lat[k], s.lon[k], q[0], q[1]));
      if (w > ecke) [ecke, wo] = [w, cum[k]];
    }
    if (kind === 'ab') {
      let bogen = 0;
      for (let p = 0, q = 0; p < s.n; p++) {
        while (q < s.n && cum[q] - cum[p] < SCHLEIFE_KM.bogen) q++;
        for (let k = q; k < s.n; k++) {
          if (distKm(s.lat[p], s.lon[p], s.lat[k], s.lon[k]) < SCHLEIFE_KM.luft) bogen = Math.max(bogen, cum[k] - cum[p]);
        }
      }
      maxSchleife = Math.max(maxSchleife, bogen);
      ok(bogen === 0, `${name}: ${bogen.toFixed(1)} km Verlauf kehren auf weniger als ${SCHLEIFE_KM.luft} km zurück (Schleife)`);
    }
    const schluessel = `${ROADS[r][0]}:${NODES[a][0]}:${NODES[b][0]}`;
    if (ECKE_AUSNAHMEN.has(schluessel)) ok(ecke > MAX_ECKE[kind], `${name}: Ausnahme für die Ecke ist nicht mehr nötig (${ecke.toFixed(0)}°)`);
    else {
      maxEcke[kind] = Math.max(maxEcke[kind], ecke);
      ok(ecke <= MAX_ECKE[kind], `${name}: Ecke ${ecke.toFixed(0)}° bei km ${wo.toFixed(1)} (erlaubt ${MAX_ECKE[kind]}°)`);
    }
  }
  const luft = distKm(s.lat[0], s.lon[0], s.lat[s.n - 1], s.lon[s.n - 1]);
  if (luft > 0.5) {
    const v = L / luft;
    maxVerh = Math.max(maxVerh, v);
    ok(v >= 0.999 && v <= 1.8, `${name}: ${L.toFixed(1)} km auf ${luft.toFixed(1)} km Luftlinie (${v.toFixed(2)})`);
  }
  if (kind === 'ab' || kind === 'land' || kind === 'faehre') {
    ok(Math.abs(km - L) <= Math.max(0.3, 0.01 * km), `${name}: km ${km} passt nicht zum Verlauf (${L.toFixed(1)} km)`);
  }
});

// --- Lange Tunnel ------------------------------------------------------------------------------------------
const tunnelText = TUNNEL_HOEHE.map(([strasse, tunnel, [la0, la1, lo0, lo1], grenze]) => {
  let hoch = -Infinity;
  EDGES.forEach(([, , r], i) => {
    if (ROADS[r][0] !== strasse) return;
    const s = shapes[i];
    for (let k = 0; k < s.n; k++) {
      if (s.lat[k] >= la0 && s.lat[k] <= la1 && s.lon[k] >= lo0 && s.lon[k] <= lo1) hoch = Math.max(hoch, s.elev[k]);
    }
  });
  ok(hoch > -Infinity, `${tunnel}: kein Punkt der ${strasse} im Rechteck`);
  ok(hoch <= grenze, `${tunnel}: die ${strasse} steigt auf ${hoch} m (höchstens ${grenze} m)`);
  return `${tunnel} ${hoch} m`;
});

// --- Übergänge an den Knoten einer Straße ----------------------------------------------------------------
const kanteVon = new Map();
EDGES.forEach(([a, b, r], i) => kanteVon.set(`${r}:${a}:${b}`, i));
let maxUeb = 0;
ROADS.forEach(([id, , kind, , ns], r) => {
  if (kind > 1) return;
  for (let k = 1; k + 1 < ns.length; k++) {
    const rein = shapes[kanteVon.get(`${r}:${ns[k - 1]}:${ns[k]}`)];
    const raus = shapes[kanteVon.get(`${r}:${ns[k]}:${ns[k + 1]}`)];
    if (!rein || !raus) {
      ok(false, `${id}: Kante zum Knoten ${NODES[ns[k]][0]} fehlt`);
      continue;
    }
    const n = rein.n;
    const w = winkel(kurs(rein.lat[n - 2], rein.lon[n - 2], rein.lat[n - 1], rein.lon[n - 1]), kurs(raus.lat[0], raus.lon[0], raus.lat[1], raus.lon[1]));
    maxUeb = Math.max(maxUeb, w);
    ok(w <= MAX_UEBERGANG, `${id} am Knoten ${NODES[ns[k]][0]}: Knick ${w.toFixed(1)}°`);
    ok(rein.elev[n - 1] === raus.elev[0], `${id} am Knoten ${NODES[ns[k]][0]}: Höhensprung`);
  }
});

// --- Orte bleiben, wo sie sind -----------------------------------------------------------------------------
// Ziele liegen immer in Orten: ein Ortsknoten bleibt an seiner Handlage, und jeder Knoten, an dem von Hand ein Ort
// lag (Zubringer unter ORT_KM: Hauptort an der Ausfahrt, Ortsdurchfahrt am Ende einer Landstraße), hat ihn noch.
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const netz = JSON.parse(readFileSync(join(root, 'tools', 'map', 'netz.json'), 'utf8'));
const knotenNr = new Map(NODES.map((n, i) => [n[0], i]));
let orteAmKnoten = 0;
let zubringer = 0;
NODES.forEach(([id, , la, lo, , , , pl]) => {
  for (const [p, d] of pl) {
    if (d < ORT_KM) continue;
    zubringer++;
    const luft = distKm(PLACES[p][2], PLACES[p][3], la, lo);
    ok(d >= luft - 0.05 && d <= ZUBRINGER[0] * luft + ZUBRINGER[1] + 0.05, `${PLACES[p][1]} an ${id}: Zubringer ${d} km für ${luft.toFixed(2)} km Luftlinie`);
  }
});
for (const [id, n] of Object.entries(netz.nodes)) {
  const hand = n.grob || n;
  const zeile = NODES[knotenNr.get(id)];
  if (!zeile) continue; // Knoten ohne Straße
  if (n.kind === 'ort') ok(hand.lat === zeile[2] && hand.lon === zeile[3], `Ortsknoten ${id} liegt nicht mehr am Ort`);
  if (hand.places.some(([, d]) => d < ORT_KM)) {
    orteAmKnoten++;
    ok(zeile[7].some(([, d]) => d < ORT_KM), `Knoten ${id}: kein Ort mehr unter ${ORT_KM} km Zubringer`);
  }
}

// --- Größe ------------------------------------------------------------------------------------------------
const datei = readFileSync(join(root, 'src', 'map', 'shapes.js'));
// gzip wie ein Webserver (Stufe 6) und so dicht wie möglich (Stufe 9): beide im Budget
const gz = Math.max(gzipSync(datei, { level: 6 }).length, gzipSync(datei, { level: 9 }).length);
ok(datei.length <= ROH_BYTES, `shapes.js hat ${datei.length} Bytes (erlaubt ${ROH_BYTES})`);
ok(gz <= GZIP_BYTES, `shapes.js hat gzip ${gz} Bytes (erlaubt ${GZIP_BYTES})`);

// --- Export wiederholbar -----------------------------------------------------------------------------------
const tmp = mkdtempSync(join(tmpdir(), 'karte-'));
try {
  const lauf = (n) => {
    const out = join(tmp, String(n));
    execFileSync(process.execPath, [join(root, 'tools', 'map', 'export.mjs'), '--ziel', out], { stdio: 'pipe' });
    return ['data.js', 'shapes.js'].map((f) => readFileSync(join(out, f), 'utf8'));
  };
  const [d1, s1] = lauf(1);
  const [d2, s2] = lauf(2);
  ok(d1 === d2 && s1 === s2, 'zwei Exporte unterscheiden sich');
  ok(d1 === readFileSync(join(root, 'src', 'map', 'data.js'), 'utf8'), 'src/map/data.js ist nicht aus netz.json erzeugt (npm run map)');
  ok(s1 === readFileSync(join(root, 'src', 'map', 'shapes.js'), 'utf8'), 'src/map/shapes.js ist nicht aus netz.json erzeugt (npm run map)');
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

console.log(
  `Verläufe: ${shapeCount} (abgeglichen ${status[2]}, teilweise ${status[1]}, Ersatz ${status[0]}), ${punkte} Punkte, ` +
    `dekodiert in ${ms.toFixed(1)} ms Rechenzeit (Wanduhr ${wandMs.toFixed(1)} ms); größter Knick ${maxKnick.toFixed(0)}°, Umweg bis ${maxVerh.toFixed(2)}, Übergang bis ${maxUeb.toFixed(1)}°; ` +
    `größte Ecke Autobahn ${maxEcke.ab.toFixed(0)}°, Landstraße ${maxEcke.land.toFixed(0)}° (${ECKE_AUSNAHMEN.size} Ausnahmen); grob am Knoten bis ${maxGrob.toFixed(1)}°; Autobahn-Schleifen ${maxSchleife ? `bis ${maxSchleife.toFixed(1)} km` : 'keine'}; höchster Punkt ${tunnelText.join(', ')}; ${orteAmKnoten} Knoten mit Ort, ${zubringer} Zubringer geprüft; ` +
    `shapes.js ${datei.length} Bytes, gzip ${gz} Bytes`,
);
console.log(fails ? `${fails} FEHLER` : 'alles in Ordnung');
process.exit(fails ? 1 : 0);
