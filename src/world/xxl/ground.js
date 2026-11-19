// Der eine Boden der XXL-Welt: eine weiche Wiese im Kameraraum, knapp unter allen Straßen (y = −0,02), so weit und
// breit wie die Sicht und an den Rändern sanft abfallend (so verschwindet das Ende der Welt wie beim klassischen
// Boden im Dunst). Er wird nie geschert und läuft nur mit s mit, darf also kein Muster haben, dessen Gleiten man
// neben einem gescherten Rahmen bemerken würde: nur feines, richtungsloses Gras. Felder, Wege und Teiche sind
// aufgenähte Flicken der Rahmen (siehe roadkit/forest), nie Teil dieses Bodens.
import * as THREE from 'three';
import { W } from '../../curve.js';
import { mulberry32 } from '../../util.js';
import { stripGeometry } from '../road.js';

export const GROUND_Y = -0.02;
const TILE = 7; // Meter je Texturkachel
// Schichten (Polygon-Offset): Boden ganz unten, darüber Bankette, Flicken, Asphalt, Markierungen (siehe roadkit.js)
export const LAYER = {
  ground: { polygonOffset: true, polygonOffsetFactor: 4, polygonOffsetUnits: 8 },
  verge: { polygonOffset: true, polygonOffsetFactor: 2, polygonOffsetUnits: 4 },
  patch: { polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 2 },
  under: { polygonOffset: true, polygonOffsetFactor: 0.5, polygonOffsetUnits: 1 },
  mark: { polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -2 },
  mark2: { polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 },
};

/** Feine, weiche Wiese ohne Richtung (kachelbar). */
export function meadowTexture(base = [104, 146, 66], seed = 31) {
  const S = 256;
  const c = document.createElement('canvas');
  c.width = S;
  c.height = S;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(S, S);
  const rnd = mulberry32(seed);
  // weiches Rauschen: grobe Zellen kachelbar interpoliert, dazu feine Halme
  const N = 16;
  const cells = Array.from({ length: N * N }, () => rnd() - 0.5);
  const cell = (i, j) => cells[((j + N) % N) * N + ((i + N) % N)];
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const u = (x / S) * N;
      const v = (y / S) * N;
      const i = Math.floor(u);
      const j = Math.floor(v);
      const fu = u - i;
      const fv = v - j;
      const su = fu * fu * (3 - 2 * fu);
      const sv = fv * fv * (3 - 2 * fv);
      const soft = (cell(i, j) * (1 - su) + cell(i + 1, j) * su) * (1 - sv) + (cell(i, j + 1) * (1 - su) + cell(i + 1, j + 1) * su) * sv;
      const n = soft * 16 + (rnd() - 0.5) * 22;
      const k = (y * S + x) * 4;
      img.data[k] = base[0] + n * 0.8;
      img.data[k + 1] = base[1] + n;
      img.data[k + 2] = base[2] + n * 0.6;
      img.data[k + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
}

/** z-Reihen des Bodens: hinter dem Auto reicht er weiter als die Autobahn (Rückspiegel), vorne bis in den Dunst. */
function groundRows() {
  const rows = [];
  let z = 460;
  while (z > -1820) {
    rows.push(z);
    z -= 2 + Math.abs(z) * 0.02;
  }
  rows.push(-1820);
  return rows;
}

const FLAT = 1100; // so weit nach beiden Seiten ist der Boden eben …
const EDGE = [2700, -8]; // … und fällt dann bis hierher ab (x, y)

/**
 * Spalten des Bodens (x ≥ 0, links gespiegelt). Der Boden biegt und neigt sich mit dem Verlauf der Straße
 * (curveWorld): in einer Kurve mit Steigung ist die wahre Fläche verwunden, jedes Dreieck dazwischen aber eben. Eine
 * schmale Spalte weicht deshalb um bis zu Steigung · Reihenabstand · Spaltenbreite / (4 · Halbmesser) von ihr ab,
 * eine Bahn von Rand zu Rand um die halbe Höhe zwischen zwei Reihen – der Boden läge dann in Balken quer über den
 * Straßen, die nur 2 cm über ihm liegen. Deshalb 4 m schmale Spalten, wo Straßen nah am Spieler liegen (engste
 * Landstraßenkurve, R 110 bei 10 %: unter 4 mm bis 100 m voraus, 1 cm in 400 m), nach außen je Spalte 12 % breiter:
 * neben dem eigenen Weg stehen fremde Straßen nur an Knotenpunkten, wo der Verlauf gerade ist, oder in der Ferne.
 */
function groundCols() {
  const xs = [0];
  for (let x = 0; ;) {
    const w = Math.max(4, x * 0.12);
    // die letzte Spalte schließt bündig an die Böschung an, statt einen schmalen Rest zu lassen
    if (x + w * 1.5 >= FLAT) break;
    x += w;
    xs.push(x);
  }
  xs.push(FLAT);
  return xs;
}

export class Ground {
  constructor(parent) {
    this.tex = meadowTexture();
    this.mat = W.lambert({ map: this.tex, ...LAYER.ground });
    const uv = (x, y, z) => [x / TILE, -z / TILE];
    const xs = groundCols();
    const strips = [{ a: [-EDGE[0], EDGE[1]], b: [-FLAT, GROUND_Y], uv }];
    for (let i = xs.length - 1; i > 0; i--) strips.push({ a: [-xs[i], GROUND_Y], b: [-xs[i - 1], GROUND_Y], uv });
    for (let i = 1; i < xs.length; i++) strips.push({ a: [xs[i - 1], GROUND_Y], b: [xs[i], GROUND_Y], uv });
    strips.push({ a: [FLAT, GROUND_Y], b: [EDGE[0], EDGE[1]], uv });
    const geo = stripGeometry(strips, groundRows());
    this.mesh = new THREE.Mesh(geo, this.mat);
    this.mesh.name = 'XXL-Boden';
    this.mesh.frustumCulled = false;
    this.mesh.receiveShadow = true;
    this.mesh.renderOrder = -2;
    parent.add(this.mesh);
  }

  update(s, wet) {
    this.tex.offset.y = (s / TILE) % 1;
    this.mat.color.setScalar(1 - wet * 0.27);
  }
}
