// Textur der Äcker (fieldplan.js) für die Landstraßen (roadkit.js) und die Autobahn (scenery.js): eine Kachel ist eine
// Reihe breit (u) und FIELD_V Meter lang (v); die Farbe der Feldfrucht kommt aus der Eckenfarbe.
import * as THREE from 'three';
import { mulberry32 } from '../../util.js';

export const FIELD_V = 24;
let shared = null;
/**
 * Ackerboden (fieldplan.js): Reihen quer über die Kachel (u), mit weichem Rauschen; die Farbe der Feldfrucht kommt aus
 * der Eckenfarbe. Eine Kachel ist eine Reihe breit (u) und FIELD_V Meter lang (v).
 */
export function fieldTexture() {
  if (shared) return shared;
  const S = 64;
  const c = document.createElement('canvas');
  c.width = S;
  c.height = S;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(S, S);
  const rnd = mulberry32(5);
  const N = 8;
  const cells = Array.from({ length: N * N }, () => rnd() - 0.5);
  const cell = (i, j) => cells[((j + N) % N) * N + ((i + N) % N)];
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const fx = (x / S) * N;
      const fy = (y / S) * N;
      const ix = Math.floor(fx);
      const iy = Math.floor(fy);
      const u = fx - ix;
      const v = fy - iy;
      const n = (cell(ix, iy) * (1 - u) + cell(ix + 1, iy) * u) * (1 - v) + (cell(ix, iy + 1) * (1 - u) + cell(ix + 1, iy + 1) * u) * v;
      // Reihe: hell in der Mitte, dunkle Furche am Rand
      const row = 0.5 + 0.5 * Math.cos(((x + 0.5) / S) * Math.PI * 2);
      const val = 255 * (0.86 + 0.14 * row + n * 0.1 + (rnd() - 0.5) * 0.04);
      const o = (y * S + x) * 4;
      img.data[o] = img.data[o + 1] = img.data[o + 2] = Math.max(0, Math.min(255, val));
      img.data[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  shared = t;
  return t;
}
