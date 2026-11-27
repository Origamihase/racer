// Flüsse und Seen der ganzen Spielkarte (Natural Earth, gemeinfrei; erzeugt von tools/map/wasser.mjs nach
// water-data.js). Rein rechnerisch, ohne Grafik, läuft auch unter Node: die große Karte und das Navi zeichnen das
// Wasser daraus (mapview.js), und dieselben Linien sagen der Fahrt, wo eine Straße über einen Fluss führt (COMMON.md
// §9: was die Karte als Brücke zeigt, ist in der Welt eine).
//
// Kartenkoordinaten wie project() in graph.js (Mercator, x = Länge, y nach Süden, Einheit = Grad Länge am Äquator).
import { WQ, WNAMES, WRIVERS, WLAKES } from './water-data.js';

/**
 * Klassen der Flüsse: 0 = Strom (Rhein, Donau, Elbe, Oder …), 1 = Fluss (Main, Mosel, Weser, Inn …), 2 = kleiner
 * Fluss (Neckar, Saale, Spree, Fulda …). px: Breite auf der Karte in CSS-Bildpunkten [weit, nah] und ab welchem
 * Maßstab (Bildpunkte je km) er erscheint; km: echte Breite (so breit wird er ganz nah gezeichnet).
 */
export const WATER_CLASS = [
  { px: [1.8, 3.4], from: 0, km: 0.3 },
  { px: [1.3, 2.6], from: 0.35, km: 0.12 },
  { px: [1.0, 1.9], from: 1.2, km: 0.06 },
];

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const DIGIT = new Int8Array(128).fill(-1);
for (let i = 0; i < ALPHA.length; i++) DIGIT[ALPHA.charCodeAt(i)] = i;

/** Linienzug aus water-data.js → Float64Array [x, y, …] in Karteneinheiten. */
export function decodeLine(s) {
  const nums = [];
  let v = 0;
  let m = 1;
  for (let i = 0; i < s.length; i++) {
    const d = DIGIT[s.charCodeAt(i)];
    if (d < 0) throw new RangeError('water-data: ungültiges Zeichen');
    v += (d & 31) * m;
    m *= 32;
    if (!(d & 32)) {
      nums.push(v & 1 ? -(v + 1) / 2 : v / 2);
      v = 0;
      m = 1;
    }
  }
  const out = new Float64Array(nums.length);
  let x = 0;
  let y = 0;
  for (let i = 0; i + 1 < nums.length; i += 2) {
    x += nums[i];
    y += nums[i + 1];
    out[i] = x / WQ;
    out[i + 1] = y / WQ;
  }
  return out;
}

function boxOf(P) {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (let i = 0; i < P.length; i += 2) {
    if (P[i] < x0) x0 = P[i];
    if (P[i] > x1) x1 = P[i];
    if (P[i + 1] < y0) y0 = P[i + 1];
    if (P[i + 1] > y1) y1 = P[i + 1];
  }
  return [x0, y0, x1, y1];
}

let DATA = null;
/** Alle Flüsse und Seen (einmal dekodiert): { rivers: [{i, name, cls, pts, box}], lakes: [{i, name, pts, box}] }. */
export function waterData() {
  if (DATA) return DATA;
  const rivers = WRIVERS.map(([n, cls, s], i) => {
    const pts = decodeLine(s);
    return { i, name: WNAMES[n], cls, pts, box: boxOf(pts) };
  });
  const lakes = WLAKES.map(([n, s], i) => {
    const pts = decodeLine(s);
    return { i, name: WNAMES[n], pts, box: boxOf(pts) };
  });
  DATA = { rivers, lakes };
  return DATA;
}
