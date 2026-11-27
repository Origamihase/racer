// Baut aus tools/map/netz.json die kompakten Kartendaten des Spiels: src/map/data.js (Orte, Knoten, Straßen,
// Kanten mit groben Zwischenpunkten) und src/map/shapes.js (die echten Verläufe mit Höhen, je Kante kodiert).
// Aufruf: npm run map
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const netz = JSON.parse(readFileSync(join(here, 'netz.json'), 'utf8'));
const KINDS = ['ab', 'land', 'faehre', 'zug', 'flug'];
const NODE_KINDS = ['ort', 'as', 'kreuz', 'via', 'rast'];

// Vereinfachung der Verläufe für shapes.js (Budget 300 kB roh, 120 kB gzip): jeder Punkt des Verlaufs aus netz.json
// liegt höchstens TOL_KM neben dem vereinfachten Verlauf (dazu bis 7 m Raster) und TOL_M über oder unter ihm. Das
// Spiel glättet die Richtung ohnehin über Kilometer (Kurven-Paket); eine Kurve mit 1 km Radius hat auf 1 km Sehne
// 125 m Pfeilhöhe.
const TOL_KM = 0.05;
const TOL_M = 10;
// So viele Punkte schaut die Vereinfachung über einen Fehlschlag hinaus (siehe vereinfachen)
const VORAUS = 5;
// Raster der Zwischenpunkte (km) längs und quer zur Fahrtrichtung: verschiebt einen Punkt um höchstens 7 m
const RASTER_KM = 0.01;
// Richtungspunkte: so weit (km) vom Knoten bleibt immer ein Punkt, damit die Richtung am Knoten erhalten bleibt.
// Biegt der Verlauf schon früher ab (kurze Kante), steht er am Ende des geraden Stücks, aber nicht näher als
// RICHTUNG_MIN_KM: noch näher kippte das Raster (bis 5 m quer) die Richtung um mehr als 3°.
const RICHTUNG_KM = 0.3;
const RICHTUNG_MIN_KM = 0.1;
// Grobe Zwischenpunkte für data.js (Routing, Schilder, Kartenzeichnung), auf 1e-3° gerundet; die beiden
// Richtungspunkte bleiben auch hier und stehen auf 1e-4° (1e-3° kippte die Richtung auf 0,3 km um bis zu 18°): so
// sehen graph.js (straight) und trip.js (turnAngle) an jedem Knoten dieselbe Richtung wie der Verlauf.
const GROB_KM = 1.5;
// Uferstraßen (netz.json "ufer", quelle/ufer.py) laufen 0,4 km neben einem Fluss: grob auf 1,5 km schnitte ihre Linie
// die Bögen des Flusses (Brücken, die es nicht gibt); sie bleiben so fein
const GROB_UFER_KM = 0.08;
const rund = (x, stellen) => Math.round(x * 10 ** stellen) / 10 ** stellen;
// Höchste Steigung je Straßenart (eine Quelle mit der Höhenaufbereitung: quelle/regeln.json); die gerasterte Lage
// darf sie nicht verschärfen.
const STEIGUNG = JSON.parse(readFileSync(join(here, 'quelle', 'regeln.json'), 'utf8')).steigung;

// --- netz.json: Polylinien wie Google Encoded Polyline mit mehreren Spalten ----------------------------------
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

// --- Geometrie ----------------------------------------------------------------------------------------------
const RAD = Math.PI / 180;
const KY = 110.574;
function distKm(a, b) {
  const h = Math.sin(((b[0] - a[0]) * RAD) / 2) ** 2 + Math.cos(a[0] * RAD) * Math.cos(b[0] * RAD) * Math.sin(((b[1] - a[1]) * RAD) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(h)));
}
/** Abstand des Punktes p von der Strecke a–b (eben, km). */
function abstand(p, a, b) {
  const bx = b[0] - a[0];
  const by = b[1] - a[1];
  const px = p[0] - a[0];
  const py = p[1] - a[1];
  const l2 = bx * bx + by * by;
  const t = l2 > 0 ? Math.max(0, Math.min(1, (px * bx + py * by) / l2)) : 0;
  return Math.hypot(px - t * bx, py - t * by);
}
/**
 * Vereinfacht einen Verlauf gierig: von jedem behaltenen Punkt geht es zum fernsten, bis zu dem die Sehne alle Punkte
 * dazwischen auf tolKm (Lage) und tolM (Höhe, linear über die Strecke) trifft; die Suche schaut VORAUS Punkte über
 * einen Fehlschlag hinaus. Bei gleicher Genauigkeit bleiben so gut 15 % weniger Punkte als mit Douglas-Peucker.
 * xy: ebene Lage in km, h: Höhen in m (null: nur die Lage zählt), fixed: Indizes, die immer bleiben.
 * Gibt die Indizes der bleibenden Punkte zurück.
 */
function vereinfachen(xy, h, tolKm, tolM, fixed = []) {
  const n = xy.length;
  const s = [0];
  for (let k = 1; k < n; k++) s.push(s[k - 1] + Math.hypot(xy[k][0] - xy[k - 1][0], xy[k][1] - xy[k - 1][1]));
  const passt = (i, j) => {
    for (let k = i + 1; k < j; k++) {
      if (abstand(xy[k], xy[i], xy[j]) > tolKm) return false;
      if (h && Math.abs(h[k] - (h[i] + ((h[j] - h[i]) * (s[k] - s[i])) / (s[j] - s[i] || 1))) > tolM) return false;
    }
    return true;
  };
  const halte = [...new Set(fixed)].filter((k) => k > 0 && k < n - 1).sort((a, b) => a - b);
  const keep = [0];
  for (const halt of [...halte, n - 1]) {
    let i = keep[keep.length - 1];
    while (i < halt) {
      let best = i + 1;
      for (let j = i + 2, fehl = 0; j <= halt && fehl <= VORAUS; j++) {
        if (passt(i, j)) {
          best = j;
          fehl = 0;
        } else fehl++;
      }
      keep.push(best);
      i = best;
    }
  }
  return keep;
}
/** Punkt (mit Höhe) bei der Bogenlänge sk: wird eingefügt, wenn dort keiner liegt. Gibt den Index zurück. */
function pointAt(pts, sk) {
  let s = 0;
  for (let k = 1; k < pts.length; k++) {
    const d = distKm(pts[k - 1], pts[k]);
    if (s + d >= sk) {
      const t = d > 0 ? (sk - s) / d : 0;
      if (t < 1e-3) return k - 1;
      if (t > 1 - 1e-3) return k;
      const a = pts[k - 1];
      const b = pts[k];
      pts.splice(k, 0, [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]);
      return k;
    }
    s += d;
  }
  return pts.length - 1;
}
/**
 * Begrenzt die Steigung zwischen Nachbarpunkten auf g (Höhen in ganzen Metern, d: Abstände in km, Endhöhen fest).
 * Die Höhenaufbereitung hat die Grenze auf dem dichten Verlauf eingehalten; die kürzeren Sehnen und das Raster
 * können sie um Bruchteile eines Meters verschärfen. Gibt die größte Änderung in Metern zurück.
 */
function steigungBegrenzen(hs, d, g) {
  const vorher = hs.slice();
  const erlaubt = d.map((km) => Math.floor(g * km * 1000));
  const n = hs.length;
  for (let runde = 0; runde < 50; runde++) {
    let geaendert = false;
    const klemmen = (k, nb, m) => {
      const v = Math.min(Math.max(hs[k], hs[nb] - m), hs[nb] + m);
      if (v !== hs[k]) {
        hs[k] = v;
        geaendert = true;
      }
    };
    for (let k = 1; k < n - 1; k++) klemmen(k, k - 1, erlaubt[k]);
    for (let k = n - 2; k > 0; k--) klemmen(k, k + 1, erlaubt[k + 1]);
    if (!geaendert) break;
  }
  for (let k = 1; k < n; k++) if (Math.abs(hs[k] - hs[k - 1]) > erlaubt[k]) throw new Error('Steigung nicht einzuhalten');
  return Math.max(0, ...hs.map((v, k) => Math.abs(v - vorher[k])));
}

// --- Kodierung für shapes.js --------------------------------------------------------------------------------
// Jeder Zwischenpunkt ist ein Schritt im mitgedrehten Rahmen: a Rasterschritte längs der Richtung des letzten
// Abschnitts und c quer dazu (nach links). Straßen laufen meist fast geradeaus weiter, so bleiben die Zahlen klein:
// gut 3 Bit weniger je Punkt als Differenzen von Breite und Länge. Rückwärts (a < 0) geht es nur hinter einer Kehre;
// a steht deshalb ohne Vorzeichen als a + 1, eine 0 kündigt einen Schritt rückwärts an. Der Kodierer rechnet jeden
// Schritt so nach, wie ihn der Dekodierer rechnet; Rasterfehler laufen deshalb nicht auf. rahmen, schritt,
// symbolLesen und lesen stehen wörtlich auch in shapes.js (samt ihrer Beschreibung aus DOKU), der Export dekodiert
// jede Kante damit zur Probe.
const DOKU = {
  rahmen:
    'Ebener Rahmen einer Kante: [x, y, ux, uy, kx] – Lage in km (x = Länge · kx nach Osten, y = Breite · KY nach ' +
    'Norden), Richtung des letzten Abschnitts als Einheitsvektor (ux, uy), zu Beginn die Sehne a → b, und kx = km je ' +
    'Grad Länge auf der Breite von Knoten a.',
  schritt: 'Ein Schritt im Rahmen z: a Raster längs der letzten Richtung, c quer dazu (nach links); dreht den Rahmen mit.',
  symbolLesen:
    'Zahl ohne Vorzeichen aus Zeichen k von s: das Zeichen trägt die Oktave und ihre zwei obersten Bits, die übrigen ' +
    'Bits kommen aus dem Bitstrom b ({ s, p, acc, n }).',
  lesen: 'Dekodiert eine Kante aus ihren Zeichenketten (längs, quer, Höhe, Zusatzbits) und der Lage ihrer Knoten.',
};
/** Quelltext einer Dekodierfunktion für shapes.js, mit ihrer Beschreibung davor. */
const mitDoku = (f) => `/** ${DOKU[f.name]} */\n${f}`;

function rahmen(la0, lo0, la1, lo1) {
  const kx = 111.32 * Math.cos(la0 * RAD);
  const x = lo0 * kx;
  const y = la0 * KY;
  const dx = lo1 * kx - x;
  const dy = la1 * KY - y;
  const l = Math.sqrt(dx * dx + dy * dy);
  return l > 0 ? [x, y, dx / l, dy / l, kx] : [x, y, 0, 1, kx];
}
function schritt(z, a, c) {
  const sx = RASTER_KM * (a * z[2] - c * z[3]);
  const sy = RASTER_KM * (a * z[3] + c * z[2]);
  const l = Math.sqrt(sx * sx + sy * sy);
  z[0] += sx;
  z[1] += sy;
  z[2] = sx / l;
  z[3] = sy / l;
}
function symbolLesen(s, k, b) {
  let c = s.charCodeAt(k) - 35;
  if (c > 57) c--;
  if (c >= 4) {
    const m = (c >> 2) - 1;
    while (b.n < m) {
      let d = b.s.charCodeAt(b.p++) - 35;
      if (d > 57) d--;
      b.acc |= d << b.n;
      b.n += 6;
    }
    c = ((4 | (c & 3)) << m) | (b.acc & ((1 << m) - 1));
    b.acc >>>= m;
    b.n -= m;
  }
  return c;
}
function lesen(al, ql, hl, xl, la0, lo0, la1, lo1, matched) {
  const n = ql.length + 2;
  const lat = new Float64Array(n);
  const lon = new Float64Array(n);
  const elev = new Float32Array(n);
  const b = { s: xl, p: 0, acc: 0, n: 0 };
  const z = rahmen(la0, lo0, la1, lo1);
  lat[0] = la0;
  lon[0] = lo0;
  let pa = 0;
  for (let p = 1; p < n - 1; p++) {
    let a = symbolLesen(al, pa++, b) - 1;
    if (a < 0) a = -symbolLesen(al, pa++, b);
    const c = symbolLesen(ql, p - 1, b);
    schritt(z, a, (c >>> 1) ^ -(c & 1));
    lat[p] = z[1] / KY;
    lon[p] = z[0] / z[4];
  }
  lat[n - 1] = la1;
  lon[n - 1] = lo1;
  let h = 0;
  for (let p = 0; p < n; p++) {
    const v = symbolLesen(hl, p, b);
    h += (v >>> 1) ^ -(v & 1);
    elev[p] = h;
  }
  return { n, lat, lon, elev, matched };
}

// Ziffern: die Zeichen 35 … 126 ohne den Backslash (er bräuchte in JSON zwei Zeichen)
const ziffer = (k) => String.fromCharCode(k + (k < 57 ? 35 : 36));
/** Schreibt ganze Zahlen wie Exp-Golomb: ein Zeichen für Oktave und zwei Bits, die übrigen Bits in einen Bitstrom. */
class Schreiber {
  constructor() {
    this.bits = [];
    this.acc = 0;
    this.nb = 0;
  }
  /** Zahl mit Vorzeichen, im Zickzack */
  zahl(d, out) {
    this.symbolSchreiben(d < 0 ? -2 * d - 1 : 2 * d, out);
  }
  symbolSchreiben(v, out) {
    if (v < 4) {
      out.push(ziffer(v));
      return;
    }
    const b = 31 - Math.clz32(v);
    if (b > 22) throw new Error('Zahl zu groß für die Kodierung: ' + v);
    const m = b - 2;
    out.push(ziffer(4 * (b - 1) + ((v >> m) & 3)));
    this.acc |= (v & ((1 << m) - 1)) << this.nb;
    this.nb += m;
    while (this.nb >= 6) {
      this.bits.push(ziffer(this.acc & 63));
      this.acc >>>= 6;
      this.nb -= 6;
    }
  }
  ende() {
    if (this.nb > 0) this.bits.push(ziffer(this.acc));
    return this.bits.join('');
  }
}

// --- Orte ---------------------------------------------------------------------------------------------------
const placeKeys = Object.keys(netz.places);
const placeIdx = new Map(placeKeys.map((k, i) => [k, i]));
const PLACES = placeKeys.map((k) => {
  const p = netz.places[k];
  return [k, p.name, p.lat, p.lon, p.cc, p.n, p.pop];
});

// --- Knoten -------------------------------------------------------------------------------------------------
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
  // Die Verläufe enden genau auf den Knoten: deren Lage muss auf 1e-4° stehen (Raster der Verläufe)
  for (const v of [n.lat, n.lon]) if (Math.round(v * 1e4) / 1e4 !== v) throw new Error('Knoten nicht auf 1e-4°: ' + k);
  return [k, n.name, n.lat, n.lon, NODE_KINDS.indexOf(n.kind), n.cc, n.pop, pl];
});
for (const k of placeKeys) if (!seen.has(k)) throw new Error('Ort hängt an keinem Knoten: ' + k);

// --- Straßen ------------------------------------------------------------------------------------------------
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

// --- Fernziele für die Schilder: der nächste große Ort in Fahrtrichtung -------------------------------------
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

// --- Verläufe -----------------------------------------------------------------------------------------------
const spalten = { A: [], Q: [], H: [], X: [] };
let matched = '';
let punkte = 0;
let abweichung = 0;
let hoehenKorrektur = 0;
const coarse = [];
for (const e of netz.edges) {
  const a = netz.nodes[e.a];
  const b = netz.nodes[e.b];
  const kind = netz.roads[roadIdx.get(e.road)].kind;
  // netz.json: Breite/Länge in 1e-5°, Höhe in Metern
  const pts = decode(e.form, 3).map(([la, lo, h]) => [la / 1e5, lo / 1e5, h]);
  if (pts.length < 2) throw new Error('Verlauf zu kurz: ' + e.a + ' → ' + e.b);
  pts[0] = [a.lat, a.lon, pts[0][2]];
  pts[pts.length - 1] = [b.lat, b.lon, pts[pts.length - 1][2]];
  let L = 0;
  for (let k = 1; k < pts.length; k++) L += distKm(pts[k - 1], pts[k]);
  // Richtungspunkte (siehe RICHTUNG_KM); das gerade Stück ist der erste und der letzte Abschnitt aus netz.json
  const richtung = (gerade) => Math.min(RICHTUNG_KM, L / 3, Math.max(RICHTUNG_MIN_KM, gerade));
  const d1 = richtung(distKm(pts[0], pts[1]));
  const d2 = richtung(distKm(pts[pts.length - 2], pts[pts.length - 1]));
  const k1 = pointAt(pts, d1);
  const k2 = pointAt(pts, L - d2);
  const z = rahmen(a.lat, a.lon, b.lat, b.lon);
  const xy = pts.map(([la, lo]) => [lo * z[4], la * KY]);
  const keep = vereinfachen(xy, pts.map((p) => p[2]), TOL_KM, TOL_M, [k1, k2]);
  // Zwischenpunkte als Schritte im Raster, genau wie der Dekodierer sie nachrechnet
  const w = new Schreiber();
  const A = [];
  const Q = [];
  const lat = [a.lat];
  const lon = [a.lon];
  const hs = [Math.round(pts[0][2])];
  const quelle = [0]; // Index in pts je kodiertem Punkt
  for (const k of keep.slice(1, -1)) {
    const px = xy[k][0] - z[0];
    const py = xy[k][1] - z[1];
    const al = Math.round((px * z[2] + py * z[3]) / RASTER_KM);
    const qu = Math.round((py * z[2] - px * z[3]) / RASTER_KM);
    if (al === 0 && qu === 0) continue; // fällt im Raster auf den Punkt davor
    if (al < 0) {
      w.symbolSchreiben(0, A);
      w.symbolSchreiben(-al, A);
    } else w.symbolSchreiben(al + 1, A);
    w.zahl(qu, Q);
    schritt(z, al, qu);
    lat.push(z[1] / KY);
    lon.push(z[0] / z[4]);
    hs.push(Math.round(pts[k][2]));
    quelle.push(k);
  }
  lat.push(b.lat);
  lon.push(b.lon);
  hs.push(Math.round(pts[pts.length - 1][2]));
  quelle.push(pts.length - 1);
  const n = lat.length;
  if (STEIGUNG[kind]) {
    const dist = [0];
    for (let k = 1; k < n; k++) dist.push(distKm([lat[k - 1], lon[k - 1]], [lat[k], lon[k]]));
    hoehenKorrektur = Math.max(hoehenKorrektur, steigungBegrenzen(hs, dist, STEIGUNG[kind]));
  }
  const H = [];
  hs.forEach((h, k) => w.zahl(k ? h - hs[k - 1] : h, H));
  const kette = { A: A.join(''), Q: Q.join(''), H: H.join(''), X: w.ende() };
  for (const s of Object.keys(spalten)) spalten[s].push(kette[s]);
  matched += String(e.status);
  punkte += n;

  // Probe: der Dekodierer aus shapes.js muss genau diese Punkte liefern
  const probe = lesen(kette.A, kette.Q, kette.H, kette.X, a.lat, a.lon, b.lat, b.lon, e.status);
  for (let k = 0; k < n; k++) {
    if (probe.lat[k] !== lat[k] || probe.lon[k] !== lon[k] || probe.elev[k] !== hs[k]) throw new Error(`Probe misslungen: ${e.road} ${e.a} → ${e.b}`);
    if (k && probe.lat[k] === probe.lat[k - 1] && probe.lon[k] === probe.lon[k - 1]) throw new Error(`Doppelter Punkt: ${e.road} ${e.a} → ${e.b}`);
  }
  // Größte Abweichung des Verlaufs aus netz.json vom kodierten (eben, km)
  const ebene = lat.map((la, k) => [lon[k] * z[4], la * KY]);
  for (let j = 0; j + 1 < n; j++) {
    for (let k = quelle[j]; k <= quelle[j + 1]; k++) abweichung = Math.max(abweichung, abstand(xy[k], ebene[j], ebene[j + 1]));
  }
  // Grobe Zwischenpunkte aus dem kodierten Verlauf, mit den Richtungspunkten
  const richtungen = [keep.indexOf(k1), keep.indexOf(k2)].filter((j) => j > 0 && j < n - 1);
  const inner = vereinfachen(ebene, null, e.ufer ? GROB_UFER_KM : GROB_KM, 0, richtungen).slice(1, -1);
  coarse.push(inner.map((k) => (richtungen.includes(k) ? [rund(lat[k], 4), rund(lon[k], 4)] : [rund(lat[k], 3), rund(lon[k], 3)])));
}

// --- Kanten -------------------------------------------------------------------------------------------------
const EDGES = netz.edges.map((e, i) => {
  const a = nodeIdx.get(e.a);
  const b = nodeIdx.get(e.b);
  const r = roadIdx.get(e.road);
  if (a === undefined || b === undefined || r === undefined) throw new Error('Kante kaputt: ' + JSON.stringify(e));
  const rn = ROADS[r][4];
  let tA = a;
  let tB = b;
  // Lage der Kante auf der Straße suchen (a und b sind dort Nachbarn)
  for (let k = 0; k + 1 < rn.length; k++) {
    if (rn[k] === a && rn[k + 1] === b) {
      tB = towards(rn, k + 1, 1);
      tA = towards(rn, k, -1);
    } else if (rn[k] === b && rn[k + 1] === a) {
      tA = towards(rn, k + 1, 1);
      tB = towards(rn, k, -1);
    }
  }
  // Stück einer geteilten, gestauchten Etappe (rasthoefe.mjs): sein Anteil an deren Spiellänge
  return e.spielKm !== undefined ? [a, b, r, e.km, coarse[i], tA, tB, e.spielKm] : [a, b, r, e.km, coarse[i], tA, tB];
});

// --- Zusätzliche Ladeparks (tools/map/ladeparks.mjs): Knoten, an denen ohnehin ein Ladepark liegt ---------------------
const LADEPARKS = (netz.ladeparks ?? []).map((k) => {
  if (!nodeIdx.has(k)) throw new Error('Ladepark an unbekanntem Knoten: ' + k);
  return nodeIdx.get(k);
});

// --- Schreiben ----------------------------------------------------------------------------------------------
const lines = (name, rows) => `export const ${name} = [\n${rows.map((r) => JSON.stringify(r)).join(',\n')},\n];\n`;
const data =
  '// ERZEUGT von tools/map/export.mjs aus tools/map/netz.json – nicht von Hand ändern.\n' +
  '// Orte: [Wiki-Name, Anzeigename, Breite, Länge, Land, Zahl der Streams, Einwohner]\n' +
  '// Knoten: [Kennung, Name, Breite, Länge, Art (0 Ort, 1 Anschlussstelle, 2 Kreuz, 3 Durchgangsort, 4 Rasthof), Land, Einwohner, [[Ort, Zubringer-km] …]]\n' +
  '// Straßen: [Kennung, Schildname, Art (0 Autobahn, 1 Landstraße, 2 Fähre, 3 Zug, 4 Flug), Land, [Knoten …]]\n' +
  `// Kanten: [Knoten a, Knoten b, Straße, km, [[Breite, Länge] … Zwischenpunkte], Fernziel Richtung a, Fernziel Richtung b(, Spiel-km eines Stücks)]\n` +
  `// Die Zwischenpunkte sind der echte Verlauf aus shapes.js, auf ${GROB_KM} km vereinfacht; km ist seine Länge.\n` +
  '/* eslint-disable */\n' +
  lines('PLACES', PLACES) +
  lines('NODES', NODES) +
  lines('ROADS', ROADS) +
  lines('EDGES', EDGES) +
  '// Knoten mit zusätzlichem Ladepark (tools/map/ladeparks.mjs, src/map/parks.js placeParks)\n' +
  `export const LADEPARKS = ${JSON.stringify(LADEPARKS)};\n`;

const spalte = (name) => `const ${name} = ${JSON.stringify(spalten[name].join(' '))}.split(' ');\n`;
const shapes =
  '// ERZEUGT von tools/map/export.mjs aus tools/map/netz.json – nicht von Hand ändern.\n' +
  '// Echte Verläufe aller Kanten (Reihenfolge wie EDGES in data.js) mit Höhen, je Kante von Knoten a nach Knoten b;\n' +
  '// Anfangs- und Endpunkt sind genau die Knoten aus data.js. Jeder Punkt dazwischen ist ein Schritt von a · 10 m\n' +
  '// längs der Richtung des letzten Abschnitts und c · 10 m quer dazu (nach links), gerechnet in einer Ebene um\n' +
  '// Knoten a (km); die erste Richtung ist die Sehne a → b. a steht als a + 1 (0: es folgt −a, ein Schritt\n' +
  '// rückwärts hinter einer Kehre). Höhen in ganzen Metern als Differenz zum Punkt davor. c und die Höhen stehen im\n' +
  '// Zickzack (0, −1, 1, −2 … → 0, 1, 2, 3 …). Jede Zahl ist ein Zeichen für ihre Oktave und deren zwei oberste\n' +
  '// Bits; die übrigen Bits stehen in X, 6 je Zeichen. Ziffern sind die Zeichen 35 … 126 ohne Backslash.\n' +
  '// Längs (A), quer (Q), Höhen (H) und Zusatzbits (X) stehen je in einer Zeichenkette für alle Kanten, damit gzip\n' +
  `// für jede die passende Häufigkeitstabelle findet. Vereinfacht auf ${TOL_KM * 1000} m Lage und ${TOL_M} m Höhe.\n` +
  '// Abgleich (M) beschreibt nur die Lage: 2 = Natural Earth, 1 = teilweise, 0 = Ersatzverlauf. Die Höhen kommen bei\n' +
  '// jedem Status aus dem Gelände (auch Ersatzverläufe folgen den Tälern) und gelten immer.\n' +
  '// Quellen: Straßenverläufe Natural Earth (gemeinfrei); Höhen Terrain Tiles (Mapzen/AWS Open Data), siehe\n' +
  '// tools/map/README.md.\n' +
  '/* eslint-disable */\n' +
  "import { NODES, EDGES } from './data.js';\n" +
  '\n' +
  'const RAD = Math.PI / 180;\n' +
  `const KY = ${KY};\n` +
  `const RASTER_KM = ${RASTER_KM};\n` +
  spalte('A') +
  spalte('Q') +
  spalte('H') +
  spalte('X') +
  `const M = ${JSON.stringify(matched)};\n` +
  '\n' +
  '// Dekodierer, wörtlich aus tools/map/export.mjs\n' +
  `${mitDoku(rahmen)}\n` +
  `${mitDoku(schritt)}\n` +
  `${mitDoku(symbolLesen)}\n` +
  `${mitDoku(lesen)}\n` +
  '\n' +
  '/** Anzahl der Verläufe (= Zahl der Kanten). */\n' +
  'export const shapeCount = Q.length;\n' +
  'const cache = new Array(shapeCount);\n' +
  '\n' +
  '/**\n' +
  ' * Verlauf der Kante i: { n, lat: Float64Array, lon: Float64Array, elev: Float32Array, matched: 0 | 1 | 2 }.\n' +
  ' * matched sagt, wie weit die Lage einem echten Verlauf folgt; elev (ganze Meter) gilt bei jedem Wert. Wird beim\n' +
  ' * ersten Abruf dekodiert und zwischengespeichert: jeder Aufruf mit demselben i gibt dasselbe Objekt mit denselben\n' +
  ' * Feldern zurück, sie sind nur zum Lesen da.\n' +
  ' */\n' +
  'export function edgeShape(i) {\n' +
  '  const hit = cache[i];\n' +
  '  if (hit) return hit;\n' +
  "  if (!Number.isInteger(i) || i < 0 || i >= shapeCount) throw new RangeError(`edgeShape: keine Kante ${i} (0 … ${shapeCount - 1})`);\n" +
  '  const [a, b] = EDGES[i];\n' +
  '  const shape = lesen(A[i], Q[i], H[i], X[i], NODES[a][2], NODES[a][3], NODES[b][2], NODES[b][3], M.charCodeAt(i) - 48);\n' +
  '  cache[i] = shape;\n' +
  '  return shape;\n' +
  '}\n';

// --ziel <Ordner> schreibt woandershin (tools/shape-test.mjs prüft so, dass der Export wiederholbar ist)
const arg = process.argv.indexOf('--ziel');
const ziel = arg > 0 ? process.argv[arg + 1] : join(here, '..', '..', 'src', 'map');
mkdirSync(ziel, { recursive: true });
writeFileSync(join(ziel, 'data.js'), data);
writeFileSync(join(ziel, 'shapes.js'), shapes);
console.log(
  `Karte: ${PLACES.length} Orte, ${NODES.length} Knoten, ${ROADS.length} Straßen, ${EDGES.length} Kanten → data.js (${(Buffer.byteLength(data) / 1024).toFixed(0)} kB)`,
);
console.log(
  `Verläufe: ${punkte} Punkte → shapes.js (${(Buffer.byteLength(shapes) / 1024).toFixed(0)} kB); größte Abweichung vom Verlauf ` +
    `${(abweichung * 1000).toFixed(0)} m, Höhen für die Steigung um höchstens ${hoehenKorrektur} m angepasst`,
);
