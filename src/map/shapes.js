// STUB – replaced by the generated file of package K1 (Straßenverläufe)
//
// Gleiche Schnittstelle wie die erzeugte Datei: je Kante eine Linie von Knoten a nach Knoten b (beide Endpunkte
// genau enthalten) mit Höhe in Metern. Hier entsteht sie nur aus den groben Zwischenpunkten in data.js, ohne Höhe;
// matched = 0 heißt „kein echter Verlauf“ (der Kurs entwirft dann einen glaubwürdigen, siehe src/game/course.js).
import { NODES, EDGES } from './data.js';

export const shapeCount = EDGES.length;

const cache = new Map();

/** Verlauf der Kante i: { n, lat: Float64Array, lon: Float64Array, elev: Float32Array, matched: 0 | 1 | 2 }. */
export function edgeShape(i) {
  let sh = cache.get(i);
  if (sh) return sh;
  const [a, b, , , pts] = EDGES[i];
  const n = pts.length + 2;
  const lat = new Float64Array(n);
  const lon = new Float64Array(n);
  lat[0] = NODES[a][2];
  lon[0] = NODES[a][3];
  for (let k = 0; k < pts.length; k++) {
    lat[k + 1] = pts[k][0];
    lon[k + 1] = pts[k][1];
  }
  lat[n - 1] = NODES[b][2];
  lon[n - 1] = NODES[b][3];
  sh = { n, lat, lon, elev: new Float32Array(n), matched: 0 };
  cache.set(i, sh);
  return sh;
}
