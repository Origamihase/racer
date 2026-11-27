// Äcker neben der Straße: wo die Karte Ackerland zeigt (landcover.js, Art 'feld'), liegen in der Welt Felder in den
// Farben der Feldfrüchte (Weizen, Gerste, Raps, Mais, frisch gepflügt …) als flache Flicken auf der Wiese, getrennt
// durch Grasraine und Feldwege. Rein rechnerisch (auch unter Node): roadkit.js baut die Flächen (fieldsInto), der
// Bewuchs (world.js) hält Abstand und setzt Hecken an die Raine – beide aus demselben Plan.
//
// Der Plan eines Laufs hängt nur am Abschnitt und an der Lage des Laufs (fester Zufall), nie am Stück, das gerade
// gebaut wird: so stoßen die Felder zweier Stücke ohne Naht aneinander.
import { hashString, mulberry32 } from '../../util.js';
import { sectionCover } from './landcover.js';
import { bridgesOf } from './bridgeplan.js';
import { bandsOf } from './bandplan.js';

/** Feldfrüchte: Farbe (RGB 0..1), Reihen (Abstand m, Stärke), Gewicht. */
export const CROPS = [
  { name: 'weizen', rgb: [0.95, 0.83, 0.47], row: 0.9, k: 0.1, w: 5 },
  { name: 'gerste', rgb: [0.92, 0.87, 0.58], row: 0.9, k: 0.08, w: 3 },
  { name: 'raps', rgb: [0.98, 0.88, 0.26], row: 0.7, k: 0.06, w: 2 },
  { name: 'mais', rgb: [0.47, 0.68, 0.28], row: 1.6, k: 0.22, w: 3 },
  { name: 'ruebe', rgb: [0.55, 0.76, 0.34], row: 1.4, k: 0.25, w: 2 },
  { name: 'acker', rgb: [0.62, 0.48, 0.33], row: 1.1, k: 0.22, w: 3 },
  { name: 'stoppel', rgb: [0.9, 0.81, 0.57], row: 1.2, k: 0.12, w: 2 },
  { name: 'klee', rgb: [0.62, 0.79, 0.36], row: 0.8, k: 0.08, w: 2 },
];
const CROP_W = CROPS.reduce((s, c) => s + c.w, 0);

/** Maße: near (Abstand vom Rand des Straßenbands bis zum Feld), depth (Tiefe quer), len (Länge längs), rain (Rain). */
export const FIELD = { near: [5, 9], depth: [45, 110], len: [55, 150], rain: [2.2, 4.5], minRun: 50, ends: 220, bridge: 60, band: 30 };
/** Nur an Landstraßen und Zubringern (an Autobahn, Rampen und in Orten liegt anderes am Rand). */
const KINDS = new Set(['land', 'zub']);

function pickCrop(rnd) {
  let r = rnd() * CROP_W;
  for (let i = 0; i < CROPS.length; i++) if ((r -= CROPS[i].w) <= 0) return i;
  return 0;
}

const cache = new WeakMap();
/**
 * Felder eines Abschnitts: [{side, s0, s1 (Meter der Fahrt), d0, d1 (Abstand vom Rand des Straßenbands), crop (Index
 * in CROPS), along (Reihen längs der Straße)}]. Leer ohne Äcker.
 */
export function fieldsOf(sec) {
  const base = sec.orig || sec;
  let out = cache.get(base);
  const c = sectionCover(base);
  if (out && out.c === c) return out.list;
  const list = [];
  if (c && KINDS.has(base.kind)) {
    // frei bleiben: die Enden des Abschnitts (Knoten, Stummel, Ortstafeln), Brücken und Flüsse neben der Straße
    const free = [[-Infinity, base.s0 + FIELD.ends, 0], [base.s1 - FIELD.ends, Infinity, 0]];
    for (const b of bridgesOf(base)) free.push([b.c0 - FIELD.bridge, b.c1 + FIELD.bridge, 0]);
    for (const b of bandsOf(base)) free.push([b.c0 - FIELD.band, b.c1 + FIELD.band, b.sg]);
    const clear = (side, a, b) => free.every(([f0, f1, sg]) => (sg && sg !== side) || b <= f0 || a >= f1);
    for (const [side, runs] of [[-1, c.left], [1, c.right]]) {
      for (const [r0, r1, kind] of runs) {
        if (kind !== 'feld' || r1 - r0 < FIELD.minRun) continue;
        const rnd = mulberry32(hashString(`F${base.kind}${base.de ?? ''}${base.place ?? ''}${Math.round(r0)}${side}`));
        let s = base.s0 + r0 + 4 + rnd() * 6;
        const end = base.s0 + r1 - 3;
        while (s < end - 20) {
          const len = Math.min(end - s, FIELD.len[0] + rnd() * (FIELD.len[1] - FIELD.len[0]));
          if (len < 20) break;
          if (!clear(side, s, s + len)) {
            s += 25;
            continue;
          }
          const d0 = FIELD.near[0] + rnd() * (FIELD.near[1] - FIELD.near[0]);
          // manchmal zwei Felder hintereinander (quer zur Straße), getrennt durch einen Rain
          const deep = FIELD.depth[0] + rnd() * (FIELD.depth[1] - FIELD.depth[0]);
          if (rnd() < 0.35) {
            const cut = d0 + deep * (0.35 + rnd() * 0.3);
            list.push({ side, s0: s, s1: s + len, d0, d1: cut, crop: pickCrop(rnd), along: rnd() < 0.6 });
            list.push({ side, s0: s, s1: s + len, d0: cut + 2.5, d1: d0 + deep, crop: pickCrop(rnd), along: rnd() < 0.6 });
          } else list.push({ side, s0: s, s1: s + len, d0, d1: d0 + deep, crop: pickCrop(rnd), along: rnd() < 0.6 });
          s += len + FIELD.rain[0] + rnd() * (FIELD.rain[1] - FIELD.rain[0]);
        }
      }
    }
  }
  cache.set(base, { c, list });
  return list;
}

/** Liegt (Abstand o vom Rand des Straßenbands auf Seite side, Stelle s) mit Radius r in einem Feld? */
export function inField(list, side, o, s, r = 0) {
  for (let i = 0; i < list.length; i++) {
    const f = list[i];
    if (f.side !== side || s < f.s0 - r || s > f.s1 + r) continue;
    if (o > f.d0 - r && o < f.d1 + r) return true;
  }
  return false;
}
