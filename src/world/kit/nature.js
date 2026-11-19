// Natur-Baukasten der Miniaturwelt: Bäume, Büsche, Blumen, Felder, Hof und Tiere – rund, weich, wie Spielzeug.
// createNatureKit(F) liefert (siehe ARTSTYLE): geo(name) → { tint, fixed, info } für Instanzen, build(name) für
// Einzelstücke (mit beweglichen Teilen wie dem Rotor des Windrads als eigene Knoten), list(kind) und die fünf
// Instanz-Klötze der Autobahn-Landschaft (dropInGeo, für scenery.js).
// Maße in Metern. Ursprung am Boden: bei Gebäuden in der Mitte der Vorderkante (Front schaut nach +z, der Körper
// reicht nach −z), sonst in der Mitte der Grundfläche; Tiere schauen nach +x. Stämme, Sockel und Pfosten reichen
// FOOT unter den Ursprung: auf ebenem Boden bei y = 0 schwebt nichts, und unter der heutigen, leicht erhöhten
// Wiese verschwindet nur der Fuß.
// info über den Vertrag hinaus: front (true bei Gebäuden mit Ursprung an der Vorderkante), tris (Dreiecke).
import * as THREE from 'three';
import { PAL } from './palette.js';
import { ball, rod, cone, disc, box, lathe, tube, face, prism, puffs, move, fuse, tone, blend, paint, tris } from './shapes.js';
import { mulberry32 } from '../../util.js';

const WHITE = 0xffffff;
const FOOT = 0.3;
const TAU = Math.PI * 2;

// ---------------------------------------------------------------------------
// Bausteine: name → { kind, make() → { tint: [Teile], fixed: [Teile], nodes: { name: { at, parts } }, info } }
const DEFS = {};
const def = (name, kind, make) => {
  DEFS[name] = { kind, make };
};
// fertige Geometrien: für alle Baukasten-Instanzen gemeinsam (sie hängen nicht vom Material ab)
const GEO = new Map();

/** Kugelhaufen leicht unregelmäßig machen, damit Kronen und Büsche nicht wie gestempelt wirken. */
function jitter(list, seed, k = 0.08) {
  const rnd = mulberry32(seed);
  return list.map(([x, y, z, r, ...rest]) => [x + (rnd() - 0.5) * r * k, y + (rnd() - 0.5) * r * k, z + (rnd() - 0.5) * r * k, r, ...rest]);
}

/** Kleine Blüte auf einer Oberfläche: flacher, sechseckiger Knopf bei c, schaut entlang n. */
function bloom(c, n, size, col) {
  const N = new THREE.Vector3(...n).normalize();
  const t1 = new THREE.Vector3(N.z, 0, -N.x);
  if (t1.lengthSq() < 1e-4) t1.set(1, 0, 0);
  t1.normalize().multiplyScalar(size);
  const t2 = new THREE.Vector3().crossVectors(N, t1);
  const P = (a, b, k) => [c[0] + t1.x * a + t2.x * b + N.x * k, c[1] + t1.y * a + t2.y * b + N.y * k, c[2] + t1.z * a + t2.z * b + N.z * k];
  const tip = P(0, 0, size * 0.42);
  const ring = [];
  for (let i = 0; i < 6; i++) ring.push(P(Math.cos(i * 1.0472), Math.sin(i * 1.0472), -size * 0.08));
  // alle sechs Flächen bekommen die Blickrichtung als Normale: so leuchtet der Knopf als ein Farbtupfer, statt wie
  // ein geschliffener Stein in Facetten zu glitzern
  return ring.map((p, i) => {
    const f = face([p, ring[(i + 1) % 6], tip], n, { col, ao: 0 });
    const nr = f.attributes.normal;
    for (let k = 0; k < nr.count; k++) nr.setXYZ(k, N.x, N.y, N.z);
    return f;
  });
}

/**
 * Blüten auf einem Kugelhaufen verteilen (oben und an den Seiten, nie unten) – nur dort, wo die Stelle nicht in
 * einer Nachbarkugel steckt, mit Abstand zueinander (gap × size) und abwechselnd groß und klein: zwei gleiche
 * Tupfer nebeneinander wirken sonst wie ein Augenpaar.
 */
function blooms(list, n, size, cols, seed, gap = 3.5) {
  const rnd = mulberry32(seed);
  const covered = (p, self) => list.some(([x, y, z, r, sy = 1], j) => j !== self && ((p[0] - x) / r) ** 2 + ((p[1] - y) / (r * sy)) ** 2 + ((p[2] - z) / r) ** 2 < 1.05);
  const spots = [];
  const out = [];
  for (let i = 0; i < n; i++) {
    const self = i % list.length;
    const [bx, by, bz, r, sy = 1] = list[self];
    for (let tries = 0; tries < 12; tries++) {
      const a = rnd() * TAU;
      const e = 0.3 + rnd() * 0.95;
      const d = [Math.cos(a) * Math.cos(e), Math.sin(e), Math.sin(a) * Math.cos(e)];
      const c = [bx + d[0] * r * 0.98, by + d[1] * r * sy * 0.98, bz + d[2] * r * 0.98];
      if (covered(c, self) || spots.some((q) => Math.hypot(q[0] - c[0], q[1] - c[1], q[2] - c[2]) < size * gap)) continue;
      spots.push(c);
      out.push(bloom(c, d, size * (i % 2 ? 0.8 : 1.1), cols[i % cols.length]));
      break;
    }
  }
  return out;
}

// Laub zum Einfärben über die Instanzfarbe: fast weiß, unten eine Spur dunkler; jeder Ballen bekommt eine sonnige
// Kuppe (cap), so lesen sich die Kronen als Laubbüschel
const LEAF = [tone(WHITE, 0.87), WHITE];
const leaves = (list, seed, o = {}) => puffs(jitter(list, seed), { col: LEAF, ao: 0.14, under: 0.1, soft: 0.45, crease: 0.25, cap: 0.35, ...o });
/** Stamm oder Pfosten, der FOOT unter den Boden reicht. */
const stem = (r0, r1, h, col = PAL.trunk, o = {}) => rod(r0, r1, h + FOOT, { at: [0, -FOOT, 0], seg: 7, col: [tone(col, 0.86), tone(col, 1.1)], ao: 0.1, ...o });
const post = (x, z, h, r = 0.06, col = PAL.timber) => rod(r, r, h + FOOT, { at: [x, -FOOT, z], seg: 6, top: true, col: [tone(col, 0.9), tone(col, 1.15)], ao: 0.1 });

// --- Bäume ---------------------------------------------------------------------------------------
// Laubbaum: kurzer, kräftiger Stamm, große weiche Krone (Kronenradius ≤ 3,35 m, Höhe 8 m wie der alte Klotz)
const DECID = [[0, 5.0, 0, 2.5, 0.96, 2], [1.36, 4.3, 0.6, 1.88], [-1.26, 4.45, -0.55, 1.98], [0.15, 6.3, 0.2, 1.62]];
const decidTrunk = () => stem(0.42, 0.26, 3.4);
def('laubbaum', 'tree', () => ({
  tint: [leaves(DECID, 7)],
  fixed: [decidTrunk()],
  info: { w: 6.7, d: 6.7, h: 8, r: 3.35, tints: PAL.crown, weight: 10 },
}));

// Fichte: drei pummelige Röcke mit runder Unterkante (Radius 2,5 m, Höhe 9,3 m wie der alte Klotz)
const coniferTrunk = () => stem(0.34, 0.2, 2.6, PAL.trunk, { seg: 6 });
function coniferSkirts(col) {
  return [[2.5, 3.9, 1.5], [2.0, 3.5, 3.7], [1.45, 3.4, 5.9]].map(([r, h, y], i) => {
    const lip = h * 0.12;
    return lathe([[0, y + lip * 0.7], [r * 0.88, y], [r, y + lip], [0, y + h]], { seg: 8 - i, rot: [0, i * 0.5, 0], col, ao: 0.14, under: 0.22 });
  });
}
def('fichte', 'tree', () => ({
  tint: coniferSkirts([tone(WHITE, 0.82), WHITE]),
  fixed: [coniferTrunk()],
  info: { w: 5, d: 5, h: 9.3, r: 2.5, tints: PAL.conifer, weight: 8 },
}));

// Pappel: hohe, schlanke Säule aus fünf aufeinandergetürmten Laubballen, nach oben schmaler und spitz – steht gern
// in Reihen an Feldwegen und Auffahrten
const POPLAR = [[0, 4.6, 0, 1.3, 1.45], [0.12, 6.45, 0.1, 1.32, 1.5], [-0.1, 8.35, -0.08, 1.16, 1.55], [0.08, 10.2, 0.06, 0.95, 1.6], [0, 11.95, 0, 0.68, 1.75]];
def('pappel', 'tree', () => ({
  tint: [leaves(POPLAR, 11, { ao: 0.2, crease: 0.14 })],
  fixed: [stem(0.3, 0.2, 3.4)],
  info: { w: 2.9, d: 2.9, h: 13.2, r: 1.45, tints: [0x5f9e4a, 0x6aa64f, 0x57954c], weight: 5 },
}));

// Birke: weißer Stamm mit dunklen Ringen, lichte gelbgrüne Krone
def('birke', 'tree', () => {
  const rings = [1.2, 2.6, 4.0].map((y, i) => rod(0.185 - y * 0.012, 0.18 - y * 0.012, 0.13, { at: [0, y, 0], seg: 6, rot: [0, i, 0], col: 0x55524e, ao: 0 }));
  return {
    tint: [leaves([[0, 6.6, 0, 1.55, 1.2, 2], [0.95, 5.5, 0.35, 1.12, 1.1], [-0.9, 5.7, -0.3, 1.18, 1.1], [0.15, 8.0, 0.1, 1.0, 1.25]], 13)],
    fixed: [stem(0.19, 0.11, 6.2, PAL.birch), rings],
    info: { w: 4.4, d: 4.4, h: 9.2, r: 2.2, tints: [0x9acb5a, 0x8cc45a, 0xa8d466], weight: 5 },
  };
});

// Obstbaum in Blüte: kleine runde Krone in Rosa und Weiß, übersät mit Blüten
const FRUIT = [[0, 3.05, 0, 1.6, 0.9, 2], [1.0, 2.75, 0.3, 1.0], [-0.95, 2.85, -0.2, 1.05], [0.1, 3.85, 0.1, 0.95]];
def('obstbaum', 'tree', () => ({
  tint: [leaves(FRUIT, 17, { ao: 0.1, under: 0.06 })],
  fixed: [stem(0.2, 0.14, 1.9), blooms(jitter(FRUIT, 17), 16, 0.2, [0xf06a9b, 0xe9578c, 0xffffff, 0xf48fb1], 5, 2.6)],
  info: { w: 5, d: 5, h: 4.8, r: 2.5, tints: [0xfbd3df, 0xfff4f7, 0xf9c2d3, 0xffe9c2], weight: 4 },
}));

// Alte Eiche: dicker Stamm mit zwei starken Ästen, breite, schwere Krone
def('eiche', 'tree', () => ({
  tint: [leaves([[0, 8.1, 0, 3.5, 0.82], [3.0, 6.8, 0.6, 2.4, 0.85], [-3.1, 6.9, -0.5, 2.5, 0.85], [0.6, 7.0, 2.6, 2.2, 0.85], [-0.5, 7.1, -2.7, 2.2, 0.85], [0.3, 10.0, 0, 2.3, 0.8]], 19, { ao: 0.2 })],
  fixed: [
    stem(0.78, 0.5, 4.4, tone(PAL.trunk, 0.92), { seg: 8 }),
    tube([[0.1, 3.6, 0], [1.3, 5.0, 0.3], [2.5, 6.0, 0.5]], 0.24, { seg: 4, steps: 2, col: tone(PAL.trunk, 0.95), ao: 0 }),
    tube([[-0.1, 3.4, 0], [-1.4, 4.9, -0.3], [-2.6, 6.1, -0.4]], 0.26, { seg: 4, steps: 2, col: tone(PAL.trunk, 0.95), ao: 0 }),
  ],
  info: { w: 11.4, d: 10, h: 11.9, r: 5.7, tints: [0x4f9440, 0x5a9c46, 0x488a3e], weight: 2 },
}));

// Kiefer: hoher rötlicher Stamm, flache Schirmkrone weit oben
def('kiefer', 'tree', () => ({
  tint: [leaves([[0, 9.3, 0, 2.5, 0.5, 2], [1.5, 8.5, 0.6, 1.7, 0.52], [-1.4, 8.6, -0.6, 1.8, 0.52], [0.3, 10.3, 0.1, 1.6, 0.55]], 23, { ao: 0.2 })],
  fixed: [
    stem(0.3, 0.19, 8.4, 0xb4703f),
    tube([[0, 5.6, 0], [0.7, 6.3, 0.2], [1.2, 6.5, 0.3]], 0.09, { seg: 5, steps: 3, col: 0xa9683a, ao: 0 }),
  ],
  info: { w: 6.4, d: 6.4, h: 11.2, r: 3.2, tints: [0x3f7d55, 0x356f4c, 0x4a8a58], weight: 4 },
}));

// Jungbaum am Straßenrand: dünnes Stämmchen, kleine Krone, Stützpfahl mit Band
def('jungbaum', 'tree', () => ({
  tint: [leaves([[0, 2.55, 0, 0.78, 1.12], [0.3, 2.15, 0.2, 0.5]], 29)],
  fixed: [
    stem(0.075, 0.05, 2.1, PAL.trunk, { seg: 6 }),
    post(0.3, 0, 1.6, 0.05, 0xc9a26b),
    box(0.34, 0.07, 0.07, { at: [0.14, 1.25, 0], col: 0xe9dfc8, ao: 0 }),
  ],
  info: { w: 1.6, d: 1.6, h: 3.45, r: 0.8, tints: PAL.crown, weight: 6 },
}));

// Allee-Stück: vier Laubbäume in einer Reihe längs x (9 m Abstand, 36 m je Stück)
def('allee', 'tree', () => {
  const tint = [];
  const fixed = [];
  [[-13.5, 0.95, 0.4], [-4.5, 1.08, 2.1], [4.5, 0.9, 3.9], [13.5, 1.02, 5.3]].forEach(([x, s, rot], i) => {
    const place = { at: [x, 0, 0], rot: [0, rot, 0], s };
    tint.push(move(leaves(DECID, 31 + i), place));
    fixed.push(move(decidTrunk(), place));
  });
  return { tint, fixed, info: { w: 36, d: 7.2, h: 8.7, r: 3.6, tints: PAL.crown, weight: 2 } };
});

/**
 * Blüte: flaches Fünfeck um c (fünf Dreiecke, die Mitte etwas erhaben), das entlang n schaut; innen das Herz, außen
 * die Blütenfarbe. Die Spitzen schweben ein paar Millimeter über der ebenen Fläche bei c, so schneidet keine in sie
 * hinein. Alle Ecken tragen die Blickrichtung als Normale: ein ruhiger Farbtupfer statt eines geschliffenen Steins –
 * aus der Ferne ein Pünktchen, aus der Nähe ein Blümchen.
 */
function flower(c, n, size, petal, heart, turn = 0) {
  const N = new THREE.Vector3(...n).normalize();
  const t1 = new THREE.Vector3(N.z, 0, -N.x);
  if (t1.lengthSq() < 1e-4) t1.set(1, 0, 0);
  t1.normalize();
  const t2 = new THREE.Vector3().crossVectors(N, t1);
  const P = (a, r, k) => [0, 1, 2].map((i) => c[i] + (t1.getComponent(i) * Math.cos(a) + t2.getComponent(i) * Math.sin(a)) * r + N.getComponent(i) * k);
  const mid = P(0, 0, size * 0.2);
  const [cp, ch] = [new THREE.Color(petal), new THREE.Color(heart)];
  const pos = [];
  const col = [];
  for (let i = 0; i < 5; i++) {
    const a = turn + (i * TAU) / 5;
    pos.push(...mid, ...P(a, size, size * 0.03), ...P(a + TAU / 5, size, size * 0.03));
    col.push(ch.r, ch.g, ch.b, cp.r, cp.g, cp.b, cp.r, cp.g, cp.b);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(new Array(15).fill([N.x, N.y, N.z]).flat(), 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  return g;
}

// --- Büsche, Hecken, Schilf ----------------------------------------------------------------------
// Busch: drei runde Laubkuppen wie die Wolken am Himmel – eine große, zwei kleinere schräg davor und dahinter – mit
// je einer Blüte (3 × 1,8 m, 1,4 m hoch). Er steht zu Hunderten im Instanz-Pool, jedes Dreieck zählt dort tausendfach:
// die Kuppen sind unten offene Kugelkappen, die knapp unter dem Boden enden, und ihre Teile in der Nachbarkuppe fallen
// weg (puffs) – 133 Dreiecke Laub, 15 Blüte. Helle Scheitel, dunkle Kehlen und Normalen zur Gesamtform hin wie bei
// den Baumkronen: ein weicher Laubball, kein Felsbrocken.
// Kugelkappe bis knapp unter den Boden: Winkel vom Scheitel, bei dem die Kuppe (Mitte y, Radius r) y = −0,04 erreicht
const reach = (y, r) => Math.PI / 2 + Math.asin(Math.min(1, (y + 0.04) / r));
const BUSH = [
  [0, 0.5, 0, 0.92, 1, [9, 4, reach(0.5, 0.92)], 1.03],
  [0.84, 0.33, 0.24, 0.68, 1, [8, 3, reach(0.33, 0.68)], 0.97],
  [-0.8, 0.31, -0.26, 0.66, 1, [8, 3, reach(0.31, 0.66)], 1.0],
];
const bushLeaves = (col) => puffs(BUSH, { floor: 0.02, col, ao: 0.14, under: 0.1, soft: 0.45, crease: 0.25, cap: 0.35, y0: 0, y1: 1.5 });
// Mitte und Normale der Facette (Spalte j, Band i) einer Kuppe: die Kugelkappe besteht aus ebenen Trapezen. Eine
// Blüte in deren Mitte liegt flach auf – auf der runden Kugel selbst stünde sie über den Facetten hervor.
function facet([x, y, z, r, , [w, h, len]], j, i) {
  const at = (u, v) => {
    const [phi, theta] = [(u * TAU) / w, (v * len) / h];
    return new THREE.Vector3(x - r * Math.cos(phi) * Math.sin(theta), y + r * Math.cos(theta), z + r * Math.sin(phi) * Math.sin(theta));
  };
  const [a, b, c, d] = [at(j, i), at(j + 1, i), at(j, i + 1), at(j + 1, i + 1)];
  const n = new THREE.Vector3().subVectors(d, a).cross(new THREE.Vector3().subVectors(b, c)).normalize();
  const mid = a.add(b).add(c).add(d).multiplyScalar(0.25);
  if (n.dot(new THREE.Vector3(mid.x - x, mid.y - y, mid.z - z)) < 0) n.negate();
  return { at: mid.toArray(), n: n.toArray() };
}
// Blüten [Kuppe, Spalte, Band, Größe, Blüte, Herz]: vorn oben auf der großen Kuppe, außen auf den beiden kleinen –
// aus jeder Richtung ein oder zwei Tupfer, drei verschiedene Farben (zwei gleiche läsen sich wie ein Augenpaar)
const BUSH_FLOWERS = [[0, 2, 1, 0.13, 0xf7a8c4, 0xfff1c9], [1, 3, 1, 0.11, 0xfdfbf5, 0xffd23f], [2, 7, 1, 0.11, 0xffe06a, 0xf3a33b]];
const bushFlowers = () => BUSH_FLOWERS.map(([k, j, i, size, petal, heart], n) => {
  const f = facet(BUSH[k], j, i);
  return flower(f.at, f.n, size, petal, heart, n * 0.7);
});
def('busch', 'bush', () => ({
  tint: [bushLeaves(LEAF)],
  fixed: bushFlowers(),
  info: { w: 3, d: 1.85, h: 1.45, r: 1.55, tints: PAL.crown, weight: 6 },
}));

// Hecke (frei gewachsen): 4-m-Stück längs x aus drei weichen Buckeln, tief im Boden (die verdeckten Unterseiten
// fallen weg); die Enden greifen ins Nachbarstück
def('hecke', 'bush', () => ({
  tint: [puffs(jitter([[-1.0, 0.3, 0.03, 0.9, 1.45], [0, 0.36, -0.04, 0.94, 1.35], [1.0, 0.3, 0.03, 0.9, 1.45]], 37, 0.05), { floor: 0.02, soft: 0.3, crease: 0.2, cap: 0.3, col: LEAF, ao: 0.22, under: 0.1, y0: 0, y1: 1.7 }).scale(1.42, 1, 0.9)],
  fixed: [],
  info: { w: 4, d: 1.7, h: 1.65, tints: [0x4f9440, 0x5aa046, 0x488a3e], weight: 4 },
}));

// Formhecke (geschnitten): 4-m-Stück mit runden Kanten
def('formhecke', 'bush', () => ({
  tint: [box(4.04, 1.25 + FOOT, 0.9, { round: 0.22, at: [0, -FOOT, 0], col: LEAF, ao: 0.24 })],
  fixed: [],
  info: { w: 4, d: 0.9, h: 1.25, tints: [0x4f9440, 0x5aa046, 0x57954c], weight: 3 },
}));

// Schilf: Büschel aus Halmen mit drei Rohrkolben
def('schilf', 'bush', () => {
  const rnd = mulberry32(41);
  const tint = [];
  const fixed = [];
  for (let i = 0; i < 9; i++) {
    const a = rnd() * TAU;
    const r = 0.1 + rnd() * 0.42;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    const h = 1.3 + rnd() * 0.9;
    const lean = [Math.cos(a) * 0.25 * rnd(), 0, Math.sin(a) * 0.25 * rnd()];
    const side = [Math.cos(a + 1.3) * 0.05, 0, Math.sin(a + 1.3) * 0.05];
    tint.push(face([[x - side[0], -0.05, z - side[2]], [x + side[0], -0.05, z + side[2]], [x + lean[0], h, z + lean[2]]], [Math.cos(a), 0, Math.sin(a)], { both: true, col: [tone(WHITE, 0.8), WHITE], ao: 0 }));
  }
  for (const [x, z, h] of [[0.12, 0.1, 2.0], [-0.2, -0.08, 1.7], [0.05, -0.28, 2.3]]) {
    fixed.push(rod(0.025, 0.02, h, { at: [x, 0, z], seg: 4, col: 0x9cb463, ao: 0 }));
    fixed.push(rod(0.055, 0.055, 0.3, { at: [x, h - 0.34, z], seg: 6, caps: true, col: [0x6b4a36, 0x8a5a3c], ao: 0 }));
  }
  return { tint, fixed, info: { w: 1.3, d: 1.3, h: 2.3, r: 0.65, tints: [0x9cc465, 0x8cbb5a, 0xb1cf73], weight: 3 } };
});

// --- Blumen und Felder ---------------------------------------------------------------------------
/** Blumenfleck: n Blumen auf einem Fleck mit Radius R; head(x, y, z, i) liefert { tint, fixed } je Blüte. */
function patch(n, R, hMin, hMax, seed, head) {
  const rnd = mulberry32(seed);
  const tint = [];
  const fixed = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU + rnd() * 0.8;
    const r = R * Math.sqrt(0.08 + 0.92 * rnd());
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    const h = hMin + rnd() * (hMax - hMin);
    // dreikantige Halme: schon aus ein paar Metern nicht von runden zu unterscheiden
    fixed.push(rod(0.03, 0.024, h + 0.05, { at: [x, -0.05, z], seg: 3, col: [0x5a9a3c, 0x7ab648], ao: 0 }));
    const p = head(x, h, z, i, rnd);
    if (p.tint) tint.push(p.tint);
    if (p.fixed) fixed.push(p.fixed);
  }
  // ein paar Grasbüschel am Boden
  for (let i = 0; i < 4; i++) {
    const a = rnd() * TAU;
    const r = R * 0.7 * rnd();
    fixed.push(cone(0.16, 0.3, { at: [Math.cos(a) * r, -0.03, Math.sin(a) * r], seg: 5, col: [0x5a9a3c, 0x8fc75a], ao: 0 }));
  }
  return { tint, fixed };
}
def('mohn', 'flower', () => ({
  ...patch(7, 0.9, 0.45, 0.7, 43, (x, h, z) => ({ tint: bloom([x, h, z], [0.15, 1, 0.1], 0.15, WHITE), fixed: bloom([x + 0.004, h + 0.035, z + 0.003], [0.15, 1, 0.1], 0.05, 0x3b3340) })),
  info: { w: 2, d: 2, h: 0.75, r: 1, tints: [0xe5483a, 0xf0603a, 0xd93a3a], weight: 3 },
}));
def('margeriten', 'flower', () => ({
  ...patch(7, 0.9, 0.35, 0.6, 47, (x, h, z) => ({ tint: bloom([x, h, z], [0.1, 1, 0.2], 0.15, WHITE), fixed: bloom([x + 0.003, h + 0.04, z + 0.006], [0.1, 1, 0.2], 0.06, 0xffc928) })),
  info: { w: 2, d: 2, h: 0.65, r: 1, tints: [0xffffff, 0xfff6d8], weight: 3 },
}));
def('lupinen', 'flower', () => ({
  ...patch(9, 0.9, 0.35, 0.55, 53, (x, h, z, i, rnd) => ({ tint: cone(0.085, 0.5 + rnd() * 0.2, { at: [x, h - 0.04, z], seg: 5, col: [tone(WHITE, 0.8), WHITE], ao: 0 }) })),
  info: { w: 2, d: 2, h: 1.2, r: 1, tints: [0x8a6fd1, 0xd77fb4, 0x6f8fd9, 0xf2a5c8], weight: 3 },
}));

// Sonnenblumen-Streifen: fünf Pflanzen auf 5 m längs x, die Köpfe schauen zur Sonne (+z)
def('sonnenblumen', 'field', () => {
  const rnd = mulberry32(59);
  const fixed = [];
  for (let i = 0; i < 5; i++) {
    const x = -2 + i + (rnd() - 0.5) * 0.3;
    const z = (rnd() - 0.5) * 0.4;
    const h = 1.7 + rnd() * 0.5;
    fixed.push(rod(0.045, 0.035, h + FOOT, { at: [x, -FOOT, z], seg: 5, col: [0x4f8a3a, 0x6fae48], ao: 0 }));
    for (const [s, y] of [[1, 0.8], [-1, 1.15]]) {
      fixed.push(face([[x, h * y * 0.55, z], [x + s * 0.42, h * y * 0.55 + 0.16, z + 0.12], [x + s * 0.5, h * y * 0.55 - 0.02, z], [x + s * 0.3, h * y * 0.55 - 0.1, z - 0.1]], [0, 1, 0.3], { both: true, col: 0x5fa544, ao: 0 }));
    }
    fixed.push(move([
      ball(0.3, { d: 1, s: [1, 1, 0.22], col: [0xf2b632, 0xffd23f], ao: 0 }),
      ball(0.16, { d: 0, s: [1, 1, 0.5], at: [0, 0, 0.05], col: 0x6b4a36, ao: 0 }),
    ], { at: [x, h, z + 0.05], rot: [-0.25, (rnd() - 0.5) * 0.5, 0] }));
  }
  return { tint: [], fixed, info: { w: 5, d: 1, h: 2.5, weight: 2 } };
});

// Rapsrand: Rand eines Rapsfelds, 8,5 m längs x – ein dichtes, buckliges Polster aus gelben Blütenständen (große,
// flache Ballen, die tief ineinandergreifen) über einer ebenso dichten Reihe Laubballen, hell getupft: von der Seite
// Blüten über Laub, ohne gerade Kante
def('rapsrand', 'field', () => {
  const rnd = mulberry32(61);
  const top = [];
  for (let i = 0; i < 12; i++) top.push([-3.69 + i * 0.67 + (rnd() - 0.5) * 0.12, 0.86 + (rnd() - 0.5) * 0.12, (rnd() - 0.5) * 0.2, 0.6 + rnd() * 0.08, 0.62]);
  // Laub darunter: eine dichte Reihe Kuppeln (ihre offene Unterseite steckt im Boden)
  const leaf = [];
  for (let i = 0; i < 9; i++) leaf.push([-3.76 + i * 0.94 + (rnd() - 0.5) * 0.1, 0.12, i % 2 ? 0.12 : -0.12, 0.6 + rnd() * 0.05, 1, [9, 3, 1.9]]);
  return {
    tint: [],
    fixed: [
      puffs(leaf, { floor: 0, col: [0x4a8434, 0x76b24c], ao: 0.12, crease: 0.25, y0: 0, y1: 0.9 }),
      puffs(top, { col: [0xe2b838, 0xfbe56a], ao: 0, soft: 0.7, crease: 0.12, cap: 0.25 }),
      blooms(top, 28, 0.1, [0xfff1a0, 0xf6d64a], 62),
    ],
    info: { w: 8.8, d: 1.5, h: 1.3, weight: 2 },
  };
});

// Weinreihe: Pfähle mit Draht, knorrige Rebstöcke, darüber die Laubwand aus schmal gedrückten, tief ineinander
// greifenden Büscheln (das Licht läuft weich darüber); darunter hängen Trauben, abwechselnd vorn und hinten (8,3 m längs x)
def('weinreihe', 'field', () => {
  const rnd = mulberry32(67);
  const fixed = [];
  for (let i = 0; i < 5; i++) fixed.push(post(-4 + i * 2, 0, 1.9, 0.06, PAL.wood));
  fixed.push(box(8, 0.035, 0.035, { at: [0, 0.58, 0], col: PAL.steel, ao: 0 }));
  for (const x of [-3, -1, 1, 3]) fixed.push(tube([[x, -FOOT, 0], [x + 0.06, 0.38, 0.03], [x - 0.03, 0.8, 0]], 0.05, { r1: 0.035, seg: 5, steps: 2, col: [tone(PAL.trunk, 0.85), PAL.trunk], ao: 0 }));
  const bush = [];
  for (let i = 0; i < 11; i++) bush.push([-3.6 + i * 0.72 + (rnd() - 0.5) * 0.1, 1.2 + (rnd() - 0.5) * 0.1, 0, 0.5 + rnd() * 0.06, 1.05]);
  const wall = puffs(bush, { col: LEAF, ao: 0.18, under: 0.1, soft: 0.5, crease: 0.15, cap: 0.3 }).scale(1, 1, 0.6);
  const grape = [0x7b4a9c, 0x8d5bb0, 0x6a3f8f];
  for (let i = 0; i < 6; i++) {
    const x = -3.3 + i * 1.3 + (rnd() - 0.5) * 0.2;
    const z = i % 2 ? 0.19 : -0.19;
    const col = [tone(grape[i % 3], 0.85), tone(grape[i % 3], 1.15)];
    for (const [dx, y] of [[-0.055, 0.69], [0.055, 0.69], [0, 0.6]]) fixed.push(ball(0.055, { d: 0, at: [x + dx, y, z], col, ao: 0 }));
  }
  return { tint: [wall], fixed, info: { w: 8.3, d: 0.7, h: 1.9, tints: [0x6aa64f, 0x7ab648, 0x8cbb5a], weight: 2 } };
});

// Heuballen: rund (liegt quer, mit zwei Bindungen) und eckig (kleiner Stapel)
def('heuballen', 'field', () => {
  const side = (z, s) => [
    disc(0.72, { seg: 12, rot: [s * Math.PI / 2, 0, 0], at: [0, 0.74, z], col: [tone(PAL.hay, 0.9), PAL.hay], ao: 0 }),
    disc(0.46, { seg: 10, rot: [s * Math.PI / 2, 0, 0], at: [0, 0.74, z + s * 0.012], col: tone(PAL.hay, 0.86), ao: 0 }),
    disc(0.2, { seg: 8, rot: [s * Math.PI / 2, 0, 0], at: [0, 0.74, z + s * 0.024], col: tone(PAL.hay, 1.08), ao: 0 }),
  ];
  return {
    tint: [],
    fixed: [
      rod(0.74, 0.74, 1.2, { seg: 12, rot: [Math.PI / 2, 0, 0], at: [0, 0.74, -0.6], col: [tone(PAL.hay, 0.84), tone(PAL.hay, 1.06)], ao: 0.18 }),
      side(0.6, 1), side(-0.6, -1),
      [-0.3, 0.3].map((z) => rod(0.752, 0.752, 0.07, { seg: 12, rot: [Math.PI / 2, 0, 0], at: [0, 0.74, z - 0.035], col: 0xd9b45a, ao: 0 })),
    ],
    info: { w: 1.5, d: 1.2, h: 1.5, weight: 3 },
  };
});
def('strohballen', 'field', () => {
  const bale = (x, y, z, rot) => box(1.1, 0.5, 0.55, { round: 0.07, at: [x, y, z], rot: [0, rot, 0], col: [tone(PAL.hay, 0.86), tone(PAL.hay, 1.08)], ao: 0.12 });
  return { tint: [], fixed: [bale(-0.57, 0, 0, 0.04), bale(0.57, 0, 0.02, -0.03), bale(0.05, 0.5, 0, 0.1)], info: { w: 2.3, d: 0.7, h: 1.0, weight: 2 } };
});

// Ente (auch für den Teich): schwimmt oder steht, schaut nach +x
function duck(col = 0xfdfbf5, head = 0x3f8f5a) {
  return [
    ball(0.2, { d: 1, s: [1.25, 0.72, 0.85], at: [0, 0.13, 0], col: [tone(col, 0.86), col], ao: 0.1 }),
    cone(0.09, 0.2, { seg: 5, rot: [0, 0, 1.0], at: [-0.2, 0.17, 0], col, ao: 0 }),
    ball(0.1, { d: 1, at: [0.2, 0.34, 0], col: head, ao: 0 }),
    cone(0.045, 0.13, { seg: 5, rot: [0, 0, -Math.PI / 2], at: [0.27, 0.32, 0], col: PAL.orange, ao: 0 }),
    bloom([0.24, 0.37, 0.085], [0.3, 0.2, 1], 0.022, PAL.ink), bloom([0.24, 0.37, -0.085], [0.3, 0.2, -1], 0.022, PAL.ink),
  ];
}

// Teich: ovales Wasser mit flachem Uferwall, Seerosen, Schilf und drei Enten (6,5 × 4,9 m)
def('teich', 'field', () => {
  // Wasser und Ufer entstehen als Kreis und werden zum Oval gezogen; Enten und Schilf behalten ihre Form
  const OVAL = [0.9, 1, 0.68];
  const at = (x, y, z) => [x * OVAL[0], y, z * OVAL[2]];
  const shore = lathe([[2.75, 0.05], [3.0, 0.16], [3.45, 0.02], [3.6, -0.1]], { seg: 16, col: [0x7ab648, 0x9ad75f], ao: 0 });
  const water = disc(2.9, { seg: 16, at: [0, 0.07, 0], col: PAL.water, ao: 0 });
  // heller Schimmer in der Mitte (liegt 2 cm höher, keine deckungsgleichen Flächen)
  const shine = disc(1.5, { seg: 10, at: [-0.4, 0.09, 0.3], col: blend(PAL.water, WHITE, 0.35), ao: 0 });
  const pads = [[1.2, 1.0, 0.3], [1.65, 0.75, 0.24], [-1.5, -1.2, 0.3]].map(([x, z, r]) => disc(r, { seg: 7, at: [x, 0.1, z], col: 0x5fa651, ao: 0 }));
  const reed = DEFS.schilf.make();
  // die Halme des Schilfs sind zum Einfärben fast weiß: hier fest grün
  const reeds = (x, z, rot, s) => move([reed.tint, reed.fixed], { at: at(x, 0.04, z), rot: [0, rot, 0], s }).map((g) => {
    const c = g.attributes.color;
    for (let i = 0; i < c.count; i++) if (c.getX(i) > 0.5 && c.getY(i) > 0.5 && c.getZ(i) > 0.5) c.setXYZ(i, c.getX(i) * 0.33, c.getY(i) * 0.53, c.getZ(i) * 0.13);
    return g;
  });
  return {
    tint: [],
    fixed: [
      move([shore, water, shine, pads], { s: OVAL }),
      bloom(at(1.2, 0.13, 1.0), [0, 1, 0], 0.1, 0xfdf3f6),
      reeds(-2.6, 0.9, 0.5, 0.95), reeds(-2.2, -1.9, 2.1, 0.8),
      move(duck(), { at: at(0.4, 0.07, -0.5), rot: [0, 0.5, 0] }),
      move(duck(0xb98a5a, 0x8a6a48), { at: at(-0.5, 0.07, 0.6), rot: [0, 2.6, 0] }),
      move(duck(0xfdfbf5, 0xfdfbf5), { at: at(1.5, 0.07, -1.3), rot: [0, -1.2, 0], s: 0.8 }),
    ],
    info: { w: 6.5, d: 4.9, h: 2.1, weight: 1 },
  };
});

// --- Häuser: gemeinsame Bauteile -----------------------------------------------------------------
/**
 * Fenster oder Tür als flacher Pyramidenstumpf auf einer Wand: außen die helle Laibung (Rahmen), vorne die
 * Scheibe – ein Stück ohne deckungsgleiche Flächen, flimmert also auch in der Ferne nicht.
 * c: Mitte auf der Wand, n: Wandnormale, r: „rechts“ auf der Wand (Einheitsachsen in der x-z-Ebene),
 * w × h: Außenmaß, f: Rahmenbreite [quer, hoch], p: so weit steht die Scheibe vor.
 */
function opening(c, n, r, w, h, f, p, pane, frame) {
  const P = (a, b, k) => [c[0] + r[0] * a + n[0] * k, c[1] + b, c[2] + r[2] * a + n[2] * k];
  const o = [P(-w / 2, -h / 2, 0), P(w / 2, -h / 2, 0), P(w / 2, h / 2, 0), P(-w / 2, h / 2, 0)];
  const i = [P(-w / 2 + f[0], -h / 2 + f[1], p), P(w / 2 - f[0], -h / 2 + f[1], p), P(w / 2 - f[0], h / 2 - f[1], p), P(-w / 2 + f[0], h / 2 - f[1], p)];
  const parts = [face(i, n, { col: pane, ao: 0 })];
  const dirs = [[0, -1, 0], r, [0, 1, 0], [-r[0], 0, -r[2]]];
  for (let k = 0; k < 4; k++) {
    const d = dirs[k];
    parts.push(face([o[k], o[(k + 1) % 4], i[(k + 1) % 4], i[k]], [n[0] + d[0], d[1], n[2] + d[2]], { col: frame, ao: 0 }));
  }
  return parts;
}
/**
 * Sparfenster für die Häuser im Instanz-Pool, wo jedes Dreieck ×680 je Durchgang zählt: heller Rahmen als Fläche
 * knapp vor der Wand, davor die etwas kleinere Scheibe – vier statt zehn Dreiecke. Aus Fahrdistanz (ab gut 40 m)
 * sieht man denselben hellen Rand um die Scheibe. Parameter wie bei opening(); die Rahmenfläche steht p/2 vor.
 */
function pane(c, n, r, w, h, f, p, glass, frame) {
  const P = (a, b, k) => [c[0] + r[0] * a + n[0] * k, c[1] + b, c[2] + r[2] * a + n[2] * k];
  const quad = (hw, hh, k) => [P(-hw, -hh, k), P(hw, -hh, k), P(hw, hh, k), P(-hw, hh, k)];
  return [
    face(quad(w / 2, h / 2, p / 2), n, { col: frame, ao: 0 }),
    face(quad(w / 2 - f[0], h / 2 - f[1], p), n, { col: glass, ao: 0 }),
  ];
}
/**
 * Blumenkasten unter einem Fenster: Holzkasten, darüber ein Polster aus Blüten, das vorn über den Rand hängt
 * (cols: [Holz, Blüten]).
 */
function flowerBox(c, n, r, w, h, p, cols) {
  const P = (a, b, k) => [c[0] + r[0] * a + n[0] * k, c[1] + b, c[2] + r[2] * a + n[2] * k];
  const q = (k) => [P(-w / 2, -h / 2, k), P(w / 2, -h / 2, k), P(w / 2, h / 2, k), P(-w / 2, h / 2, k)];
  const [a, b] = [q(0), q(p)];
  const left = [-r[0], 0, -r[2]];
  const e = w * 0.53;
  // Polster im Querschnitt: hinten an der Wand, First über der Kastenmitte, vorn unterhalb der Kastenkante
  const [B0, B1] = [P(-e, h / 2, 0), P(e, h / 2, 0)];
  const [A0, A1] = [P(-e * 0.94, h * 1.55, p * 0.5), P(e * 0.94, h * 1.55, p * 0.5)];
  const [F0, F1] = [P(-e, h * 0.2, p * 1.18), P(e, h * 0.2, p * 1.18)];
  return [
    face(b, n, { col: cols[0], ao: 0 }),
    face([a[0], a[1], b[1], b[0]], [0, -1, 0], { col: tone(cols[0], 0.8), ao: 0 }),
    face([a[1], a[2], b[2], b[1]], r, { col: tone(cols[0], 0.9), ao: 0 }),
    face([a[0], a[3], b[3], b[0]], left, { col: tone(cols[0], 0.9), ao: 0 }),
    face([B0, B1, A1, A0], [-n[0] * 0.4, 1, -n[2] * 0.4], { col: tone(cols[1], 1.12), ao: 0 }),
    face([A0, A1, F1, F0], [n[0], 0.5, n[2]], { col: cols[1], ao: 0 }),
    face([B1, A1, F1], r, { col: tone(cols[1], 0.9), ao: 0 }),
    face([B0, A0, F0], left, { col: tone(cols[1], 0.9), ao: 0 }),
  ];
}
/** Balken auf einer Wand (Fachwerk, Bretter, Türbänder) von a nach b: Breite wd, steht p vor (ohne Rückseite). */
function beam(a, b, wd, n, p, col) {
  const A = new THREE.Vector3(...a);
  const u = new THREE.Vector3(...b).sub(A).normalize();
  const N = new THREE.Vector3(...n);
  const v = new THREE.Vector3().crossVectors(N, u).multiplyScalar(wd / 2);
  const P = (end, s, k) => [end[0] + v.x * s + N.x * k, end[1] + v.y * s + N.y * k, end[2] + v.z * s + N.z * k];
  const lo = [P(a, -1, 0), P(b, -1, 0), P(b, 1, 0), P(a, 1, 0)];
  const hi = [P(a, -1, p), P(b, -1, p), P(b, 1, p), P(a, 1, p)];
  const parts = [face(hi, n, { col, ao: 0 })];
  for (let k = 0; k < 4; k++) {
    const m = [(lo[k][0] + lo[(k + 1) % 4][0]) / 2 - (a[0] + b[0]) / 2, (lo[k][1] + lo[(k + 1) % 4][1]) / 2 - (a[1] + b[1]) / 2, (lo[k][2] + lo[(k + 1) % 4][2]) / 2 - (a[2] + b[2]) / 2];
    parts.push(face([lo[k], lo[(k + 1) % 4], hi[(k + 1) % 4], hi[k]], m, { col: tone(col, 0.85), ao: 0 }));
  }
  return parts;
}
const GLASS = [tone(PAL.glassDark, 1.0), PAL.glass];

/**
 * Hauskörper mit Satteldach: Grundfläche w × d (Front bei z = 0, nach hinten bis −d), Traufe in Höhe eave, der
 * First ridge darüber und längs z (die Giebel schauen nach vorn und hinten). Das Dach sind zwei dicke Platten
 * (Stärke t) mit Überstand o an der Traufe und og am Giebel, obenauf ein Firstbalken.
 */
function hall(w, d, eave, ridge, { o = 0.45, og = 0.4, t = 0.26, wall = PAL.wall[0], roof = PAL.roof[0], sock = 0.45, sockCol = tone(PAL.stone, 0.92) } = {}) {
  const hw = w / 2;
  const parts = [];
  parts.push(prism([[-hw, sock], [hw, sock], [hw, eave], [0, eave + ridge], [-hw, eave]], d, { skip: [0], at: [0, 0, -d / 2], col: [tone(wall, 0.9), wall], ao: 0.1 }));
  // Sockel steht 4 cm vor und reicht unter den Boden
  parts.push(box(w + 0.08, sock + FOOT, d + 0.08, { at: [0, -FOOT, -d / 2], col: [tone(sockCol, 0.85), sockCol], ao: 0 }));
  const slope = ridge / hw;
  const tv = t * Math.sqrt(1 + slope * slope);
  const e = hw + o;
  const ye = eave + tv - slope * o;
  const yr = eave + ridge + tv;
  for (const s of [1, -1]) {
    parts.push(prism([[0, yr], [s * e, ye], [s * e, ye - tv], [0, yr - tv]], d + 2 * og, { skip: [3], at: [0, 0, -d / 2], col: [tone(roof, 0.82), tone(roof, 1.06)], ao: 0, under: 0.25 }));
  }
  parts.push(box(t * 1.3, t * 0.75, d + 2 * og + 0.06, { round: t * 0.22, at: [0, yr - t * 0.27, -d / 2], col: tone(roof, 0.8), ao: 0 }));
  return parts;
}

// --- Hof und Landschaft --------------------------------------------------------------------------
// Scheune: rotes Holz, großes zweiflügeliges Tor mit weißen Bändern, Heuluke im Giebel (10 × 13 m)
def('scheune', 'farm', () => {
  const red = 0xc2553f;
  const parts = [hall(10, 13, 4.6, 3.6, { wall: red, roof: PAL.roof[4], sock: 0.5, o: 0.5 })];
  const n = [0, 0, 1];
  const r = [1, 0, 0];
  parts.push(opening([0, 2.05, 0], n, r, 4.4, 3.3, [0.16, 0.16], 0.07, [tone(PAL.timber, 1.15), tone(PAL.timber, 1.35)], PAL.frame));
  for (const s of [-1, 1]) {
    parts.push(beam([s * 0.25, 0.75, 0.07], [s * 1.9, 3.35, 0.07], 0.16, n, 0.05, PAL.frame));
    parts.push(beam([s * 0.25, 3.35, 0.07], [s * 1.9, 0.75, 0.07], 0.16, n, 0.05, PAL.frame));
  }
  parts.push(beam([0, 0.6, 0.07], [0, 3.5, 0.07], 0.1, n, 0.045, tone(PAL.timber, 0.9)));
  parts.push(opening([0, 6.3, 0], n, r, 1.3, 1.3, [0.12, 0.12], 0.06, [tone(PAL.timber, 0.75), tone(PAL.timber, 0.95)], PAL.frame));
  for (const s of [1, -1]) {
    for (const z of [-3.2, -6.5, -9.8]) parts.push(opening([s * 5, 2.6, z], [s, 0, 0], [0, 0, -s], 1.0, 0.9, [0.1, 0.1], 0.05, GLASS, PAL.frame));
  }
  parts.push(opening([0, 6.3, -13], [0, 0, -1], [-1, 0, 0], 1.3, 1.3, [0.12, 0.12], 0.06, GLASS, PAL.frame));
  return { tint: [], fixed: parts, info: { w: 11, d: 13.8, h: 8.5, front: true, weight: 2 } };
});

// Fachwerk-Bauernhaus: weiße Gefache, dunkle Balken, rotes Dach, Blumenkästen, Bank neben der Tür (9 × 11 m)
def('fachwerkhaus', 'farm', () => {
  const w = 9;
  const d = 11;
  const eave = 5.2;
  const parts = [hall(w, d, eave, 3.5, { wall: PAL.wall[6], roof: PAL.roof[1], sock: 0.55 })];
  const T = PAL.timber;
  const timber = (n, r, half, at, gable) => {
    const P = (a, y) => [at[0] + r[0] * a + n[0] * 0.001, y, at[2] + r[2] * a + n[2] * 0.001];
    const out = [];
    for (const y of [0.55, 2.85, eave]) out.push(beam(P(-half, y + 0.09), P(half, y + 0.09), 0.2, n, 0.05, T));
    const posts = Math.round(half / 1.1);
    for (let i = -posts; i <= posts; i++) {
      const a = (i / posts) * (half - 0.1);
      const top = gable ? eave + 3.5 * (1 - Math.abs(a) / half) - 0.25 : eave;
      out.push(beam(P(a, 0.6), P(a, top), 0.18, n, 0.045, T));
    }
    for (const s of [-1, 1]) {
      out.push(beam(P(s * (half - 0.15), 0.7), P(s * (half - 1.1 * (half / posts) * 0.9), 2.8), 0.16, n, 0.04, T));
      out.push(beam(P(s * (half - 0.15), 3.0), P(s * (half - 1.1 * (half / posts) * 0.9), eave), 0.16, n, 0.04, T));
    }
    if (gable) out.push(beam(P(-half * 0.45, eave + 1.75), P(half * 0.45, eave + 1.75), 0.18, n, 0.045, T));
    return out;
  };
  const front = [0, 0, 1];
  const right = [1, 0, 0];
  parts.push(timber(front, right, w / 2, [0, 0, 0], true), timber([0, 0, -1], [-1, 0, 0], w / 2, [0, 0, -d], true));
  parts.push(timber([1, 0, 0], [0, 0, -1], d / 2, [w / 2, 0, -d / 2], false), timber([-1, 0, 0], [0, 0, 1], d / 2, [-w / 2, 0, -d / 2], false));
  const win = (c, n, r, ww = 0.95, hh = 1.2) => parts.push(opening(c, n, r, ww, hh, [0.1, 0.1], 0.08, GLASS, PAL.frame));
  // Front: Tür, Fenster mit Blumenkästen, im Giebel ein rundes Fensterchen
  parts.push(opening([1.1, 1.6, 0], front, right, 1.15, 2.1, [0.11, 0.11], 0.09, [tone(PAL.door[0], 0.85), PAL.door[0]], PAL.frame));
  for (const x of [-3.3, -1.1, 3.3]) {
    win([x, 1.8, 0], front, right);
    parts.push(flowerBox([x, 1.05, 0.05], front, right, 1.05, 0.22, 0.24, [tone(T, 1.2), PAL.red]));
  }
  for (const x of [-3.3, -1.1, 1.1, 3.3]) win([x, 4.05, 0], front, right);
  win([0, 6.9, 0], front, right, 0.9, 0.9);
  for (const s of [1, -1]) for (const z of [-1.65, -5.5, -9.35]) for (const y of [1.8, 4.05]) win([s * w / 2, y, z], [s, 0, 0], [0, 0, -s]);
  for (const x of [-2.2, 2.2]) for (const y of [1.8, 4.05]) win([x, y, -d], [0, 0, -1], [-1, 0, 0]);
  // Schornstein und Bank
  parts.push(box(0.6, 1.9, 0.6, { at: [1.6, 7.3, -3.2], col: [tone(PAL.brick, 0.85), PAL.brick], ao: 0.1 }), box(0.74, 0.14, 0.74, { at: [1.6, 9.2, -3.2], col: tone(PAL.stone, 0.9), ao: 0 }));
  parts.push(box(1.5, 0.08, 0.42, { at: [-2.2, 0.48, 0.3], col: tone(T, 1.3), ao: 0 }), box(0.08, 0.5, 0.36, { at: [-2.85, 0, 0.3], col: T, ao: 0 }), box(0.08, 0.5, 0.36, { at: [-1.55, 0, 0.3], col: T, ao: 0 }));
  return { tint: [], fixed: parts, info: { w: 9.9, d: 11.8, h: 9.4, front: true, weight: 2 } };
});

// Gartenlaube: winziges Häuschen mit Vordach und Fass
def('laube', 'farm', () => {
  const parts = [hall(3, 2.4, 2.0, 0.9, { wall: PAL.wall[4], roof: PAL.roof[3], sock: 0.2, o: 0.3, og: 0.5, t: 0.14 })];
  parts.push(opening([-0.6, 1.0, 0], [0, 0, 1], [1, 0, 0], 0.75, 1.6, [0.07, 0.07], 0.05, [tone(PAL.door[3], 0.9), tone(PAL.door[3], 1.15)], PAL.frame));
  parts.push(opening([0.75, 1.25, 0], [0, 0, 1], [1, 0, 0], 0.7, 0.7, [0.07, 0.07], 0.05, GLASS, PAL.frame));
  parts.push(flowerBox([0.75, 0.82, 0.03], [0, 0, 1], [1, 0, 0], 0.76, 0.15, 0.17, [tone(PAL.timber, 1.2), PAL.awning[3]]));
  parts.push(opening([1.5, 1.25, -1.2], [1, 0, 0], [0, 0, -1], 0.7, 0.7, [0.07, 0.07], 0.05, GLASS, PAL.frame));
  // Regenfass mit Deckel
  parts.push(lathe([[0.26, 0], [0.31, 0.35], [0.27, 0.72], [0, 0.74]], { seg: 8, at: [1.95, 0, -0.5], col: [0x3f6fa8, 0x5a8fc4], ao: 0.1 }));
  return { tint: [], fixed: parts, info: { w: 3.6, d: 3.4, h: 3.1, front: true, weight: 2 } };
});

// Kapelle: weißes Kirchlein mit Dachreiter und Zwiebelhaube, Rundbogentür
def('kapelle', 'farm', () => {
  const parts = [hall(4.2, 6, 3.4, 2.4, { wall: PAL.wall[6], roof: PAL.roof[1], sock: 0.4, o: 0.35 })];
  const n = [0, 0, 1];
  const r = [1, 0, 0];
  parts.push(opening([0, 1.3, 0], n, r, 1.2, 2.0, [0.1, 0.1], 0.08, [tone(PAL.timber, 1.0), tone(PAL.timber, 1.3)], PAL.frame));
  parts.push(opening([0, 4.1, 0], n, r, 0.6, 0.6, [0.07, 0.07], 0.06, GLASS, PAL.frame));
  for (const s of [1, -1]) for (const z of [-1.8, -4.2]) parts.push(opening([s * 2.1, 2.0, z], [s, 0, 0], [0, 0, -s], 0.6, 1.5, [0.08, 0.08], 0.06, GLASS, PAL.frame));
  // Dachreiter mit Schallfenstern, Zwiebel und Spitze
  parts.push(box(1.15, 1.9, 1.15, { at: [0, 5.2, -1.3], col: [tone(PAL.wall[6], 0.92), PAL.wall[6]], ao: 0 }));
  for (const [nn, rr] of [[[0, 0, 1], [1, 0, 0]], [[0, 0, -1], [-1, 0, 0]], [[1, 0, 0], [0, 0, -1]], [[-1, 0, 0], [0, 0, 1]]]) {
    parts.push(opening([nn[0] * 0.575, 6.4, -1.3 + nn[2] * 0.575], nn, rr, 0.42, 0.62, [0.06, 0.06], 0.04, [0x4a4f57, 0x6f7f8f], PAL.frame));
  }
  parts.push(lathe([[0.82, 7.05], [0.86, 7.2], [0.62, 7.75], [0.28, 8.15], [0.1, 8.7], [0, 9.1]], { seg: 8, at: [0, 0, -1.3], col: [tone(PAL.roof[3], 0.9), tone(PAL.roof[3], 1.15)], ao: 0 }));
  parts.push(ball(0.12, { d: 0, at: [0, 9.15, -1.3], col: PAL.gold, ao: 0 }));
  return { tint: [], fixed: parts, info: { w: 4.9, d: 6.8, h: 9.3, front: true, weight: 1 } };
});

// Silo: heller Turm mit Kuppel, Leiter und Füllrohr
def('silo', 'farm', () => ({
  tint: [],
  fixed: [
    rod(1.5, 1.5, 7.2 + FOOT, { seg: 14, at: [0, -FOOT, 0], col: [0xc9d2d8, 0xeef2f4], ao: 0.12 }),
    [1.8, 3.6, 5.4].map((y) => rod(1.53, 1.53, 0.14, { seg: 14, at: [0, y, 0], col: PAL.steel, ao: 0 })),
    lathe([[1.56, 7.15], [1.5, 7.35], [1.05, 8.0], [0.4, 8.35], [0, 8.4]], { seg: 14, col: [0x6f9fc8, 0x9cc4e4], ao: 0 }),
    box(0.07, 7.6, 0.07, { at: [0.2, 0, 1.56], col: PAL.darkMetal, ao: 0 }), box(0.07, 7.6, 0.07, { at: [-0.2, 0, 1.56], col: PAL.darkMetal, ao: 0 }),
    Array.from({ length: 12 }, (_, i) => box(0.4, 0.05, 0.05, { at: [0, 0.5 + i * 0.6, 1.56], col: PAL.darkMetal, ao: 0 })),
    tube([[1.2, 8.05, 0], [1.9, 8.3, 0], [2.1, 7.4, 0], [2.1, 0.4, 0]], 0.11, { seg: 6, steps: 8, col: 0xdfe5e8, ao: 0 }),
  ],
  info: { w: 4.4, d: 3.3, h: 8.4, r: 1.6, weight: 1 },
}));

// Hochsitz: vier schräge Beine, Kanzel mit Dach und Luke, Leiter
def('hochsitz', 'farm', () => {
  const wood = PAL.wood;
  const parts = [];
  for (const sx of [1, -1]) for (const sz of [1, -1]) parts.push(tube([[sx * 1.05, -FOOT, sz * 1.05], [sx * 0.7, 3.2, sz * 0.7]], 0.08, { seg: 5, steps: 1, col: [tone(wood, 0.85), wood], ao: 0 }));
  for (const [a, b] of [[[1.0, 0.3, 1.0], [-0.78, 2.6, 0.78]], [[-1.0, 0.3, -1.0], [0.78, 2.6, -0.78]], [[1.0, 0.3, -1.0], [0.78, 2.6, 0.78]], [[-1.0, 0.3, 1.0], [-0.78, 2.6, -0.78]]]) {
    parts.push(tube([a, b], 0.05, { seg: 4, steps: 1, col: tone(wood, 0.9), ao: 0 }));
  }
  parts.push(box(1.7, 0.12, 1.7, { at: [0, 3.15, 0], col: tone(wood, 0.9), ao: 0 }));
  parts.push(box(1.5, 1.5, 1.5, { at: [0, 3.27, 0], col: [tone(wood, 0.95), tone(wood, 1.15)], ao: 0.1 }));
  parts.push(opening([0, 4.25, 0.75], [0, 0, 1], [1, 0, 0], 1.0, 0.45, [0.06, 0.06], 0.04, [0x3a3f47, 0x55606a], tone(wood, 1.3)));
  parts.push(opening([0.75, 4.25, 0], [1, 0, 0], [0, 0, -1], 1.0, 0.45, [0.06, 0.06], 0.04, [0x3a3f47, 0x55606a], tone(wood, 1.3)));
  parts.push(prism([[-1.05, 4.75], [1.05, 4.75], [1.05, 4.86], [0, 5.3], [-1.05, 4.86]], 2.0, { col: [tone(PAL.roof[4], 0.9), tone(PAL.roof[4], 1.1)], ao: 0 }));
  // Leiter an der Rückseite
  for (const s of [1, -1]) parts.push(tube([[s * 0.28, -0.1, -1.75], [s * 0.28, 3.25, -0.82]], 0.045, { seg: 4, steps: 1, col: wood, ao: 0 }));
  for (let i = 0; i < 7; i++) parts.push(box(0.6, 0.06, 0.06, { at: [0, 0.35 + i * 0.42, -1.65 + i * 0.118], col: tone(wood, 1.1), ao: 0 }));
  return { tint: [], fixed: parts, info: { w: 2.3, d: 3.0, h: 5.3, weight: 1 } };
});

// Zäune: 4-m-Stücke längs x mit einem Pfosten am linken Ende (das Nachbarstück bringt den nächsten mit)
def('holzzaun', 'farm', () => {
  const wood = 0xc9a26b;
  const parts = [post(-2, 0, 1.15, 0.07, wood), post(0, 0, 1.15, 0.07, wood)];
  for (const y of [0.45, 0.9]) parts.push(box(4, 0.11, 0.05, { at: [0, y, 0.07], col: [tone(wood, 0.95), tone(wood, 1.12)], ao: 0 }));
  return { tint: [], fixed: parts, info: { w: 4, d: 0.2, h: 1.15, weight: 3 } };
});
def('weidezaun', 'farm', () => {
  const parts = [post(-2, 0, 1.2, 0.055, 0xb89a72), post(0, 0, 1.2, 0.055, 0xb89a72)];
  for (const y of [0.45, 0.78, 1.08]) parts.push(box(4, 0.03, 0.03, { at: [0, y, 0], col: 0xf3efe2, ao: 0 }));
  for (const x of [-2, 0]) for (const y of [0.45, 0.78, 1.08]) parts.push(box(0.07, 0.07, 0.14, { at: [x, y - 0.02, 0], col: PAL.gold, ao: 0 }));
  return { tint: [], fixed: parts, info: { w: 4, d: 0.2, h: 1.2, weight: 3 } };
});

// Strommast: vier Beine, die sich nach oben verjüngen, zwei Querträger mit Isolatoren (ohne Leitungen)
def('strommast', 'farm', () => {
  const steel = 0xb4bcc4;
  const parts = [];
  const H = 26;
  const half = (y) => 2.6 - (y / H) * 2.25;
  for (const sx of [1, -1]) for (const sz of [1, -1]) parts.push(tube([[sx * 2.6, -FOOT, sz * 2.6], [sx * half(12), 12, sz * half(12)], [sx * 0.35, H, sz * 0.35]], 0.13, { seg: 4, steps: 2, col: [tone(steel, 0.85), steel], ao: 0 }));
  const levels = [0.4, 4, 8, 12, 16, 20, 24];
  for (let i = 0; i < levels.length - 1; i++) {
    const [y0, y1] = [levels[i], levels[i + 1]];
    const [a, b] = [half(y0), half(y1)];
    for (const [ux, uz] of [[1, 0], [0, 1]]) {
      for (const s of [1, -1]) {
        const flip = i % 2 ? 1 : -1;
        const p = (h, k, y) => (ux ? [k * h * flip, y, s * h] : [s * h, y, k * h * flip]);
        parts.push(tube([p(a, -1, y0), p(b, 1, y1)], 0.07, { seg: 3, steps: 1, col: tone(steel, 0.95), ao: 0 }));
      }
    }
  }
  for (const [y, len] of [[19.5, 7.5], [23.5, 5.2]]) {
    parts.push(box(2 * len, 0.3, 0.3, { at: [0, y, 0], col: steel, ao: 0 }));
    for (const s of [1, -1]) {
      parts.push(tube([[s * len, y + 0.1, 0], [s * 0.6, y + 2.2, 0]], 0.07, { seg: 3, steps: 1, col: tone(steel, 0.95), ao: 0 }));
      parts.push(rod(0.11, 0.11, 0.9, { seg: 5, caps: true, at: [s * (len - 0.3), y - 0.9, 0], col: 0x6f9c8a, ao: 0 }));
      parts.push(rod(0.11, 0.11, 0.9, { seg: 5, caps: true, at: [s * (len * 0.55), y - 0.9, 0], col: 0x6f9c8a, ao: 0 }));
    }
  }
  parts.push(cone(0.4, 1.4, { seg: 4, base: true, at: [0, H, 0], col: steel, ao: 0 }));
  return { tint: [], fixed: parts, info: { w: 15, d: 5.4, h: 27.4, weight: 1 } };
});

// Windmühle: gemauerter Turm, hölzerne Haube, vier Flügel mit Sprossen (drehen sich um z)
def('windmuehle', 'farm', () => {
  const body = [
    lathe([[2.9, -FOOT], [2.85, 0.5], [2.2, 7.6], [2.25, 8.0]], { seg: 10, col: [tone(PAL.wall[6], 0.9), PAL.wall[6]], ao: 0.12 }),
    lathe([[2.4, 7.9], [2.45, 8.2], [1.9, 9.4], [0.9, 10.1], [0, 10.25]], { seg: 10, col: [tone(PAL.roof[4], 0.9), tone(PAL.roof[4], 1.15)], ao: 0 }),
    lathe([[3.3, 2.9], [3.3, 3.05], [2.6, 3.05]], { seg: 10, col: tone(PAL.timber, 1.25), ao: 0 }),
    opening([0, 1.25, 2.84], [0, 0.08, 1], [1, 0, 0], 1.0, 1.9, [0.1, 0.1], 0.1, [tone(PAL.door[1], 0.85), PAL.door[1]], PAL.frame),
    opening([0, 5.4, 2.42], [0, 0.08, 1], [1, 0, 0], 0.6, 0.8, [0.07, 0.07], 0.09, GLASS, PAL.frame),
    opening([2.5, 4.6, 0], [1, 0.08, 0], [0, 0, -1], 0.6, 0.8, [0.07, 0.07], 0.09, GLASS, PAL.frame),
    rod(0.22, 0.22, 1.5, { seg: 6, rot: [Math.PI / 2, 0, 0], at: [0, 8.6, 1.3], col: PAL.timber, ao: 0 }),
  ];
  const sails = [ball(0.36, { d: 1, col: tone(PAL.timber, 1.2), ao: 0 })];
  for (let i = 0; i < 4; i++) {
    sails.push(move([
      box(0.16, 6.2, 0.12, { at: [0, 0.2, 0], col: tone(PAL.timber, 1.1), ao: 0 }),
      box(1.25, 4.5, 0.05, { at: [0.72, 1.5, -0.02], col: [0xf3ead2, 0xfdf7e6], ao: 0 }),
      [2.4, 3.6, 4.8].map((y) => box(1.3, 0.07, 0.09, { at: [0.72, y, 0], col: tone(PAL.timber, 1.2), ao: 0 })),
    ], { rot: [0, 0, (i / 4) * TAU + 0.3] }));
  }
  return { tint: [], fixed: body, nodes: { rotor: { at: [0, 8.6, 2.9], parts: sails } }, info: { w: 13, d: 6.6, h: 15, r: 3.3, weight: 1 } };
});

// Windrad: schlanker Turm, Gondel, Rotor mit drei Blättern (dreht sich um z; Nabenhöhe 64 m, Blattlänge 30 m)
def('windrad', 'farm', () => {
  const white = 0xf4f5f7;
  const body = [
    lathe([[2.3, -FOOT], [2.2, 0.4], [1.2, 62], [1.15, 63]], { seg: 12, col: [0xd9dee3, white], ao: 0.06 }),
    lathe([[2.6, 0], [2.6, 0.5], [2.25, 0.5]], { seg: 12, col: PAL.concrete, ao: 0 }),
    box(2.6, 2.7, 7.0, { round: 0.6, rs: 2, at: [0, 62.6, -0.6], col: [0xdfe4e8, white], ao: 0.1 }),
  ];
  const rotor = [lathe([[0, -1.1], [1.0, -0.9], [1.3, 0], [0.9, 1.3], [0, 2.0]], { seg: 10, rot: [Math.PI / 2, 0, 0], col: white, ao: 0 })];
  for (let i = 0; i < 3; i++) {
    rotor.push(move(prism([[-1.25, 0.6], [1.25, 0.6], [1.5, 6], [0.5, 30], [-0.35, 30], [-1.12, 8]], 0.55, { col: [tone(white, 0.94), white], ao: 0 }), { rot: [0, 0, (i / 3) * TAU] }));
  }
  return { tint: [], fixed: body, nodes: { rotor: { at: [0, 64, 3.6], parts: rotor } }, info: { w: 60, d: 8, h: 94, r: 2.6, weight: 1 } };
});

// Wasserturm: Schaft mit Fensterchen, bauchiger Behälter, spitzes Dach mit Kugel
def('wasserturm', 'farm', () => ({
  tint: [],
  fixed: [
    lathe([[2.6, -FOOT], [2.5, 0.6], [2.0, 14]], { seg: 12, col: [tone(PAL.brick, 0.9), tone(PAL.brick, 1.12)], ao: 0.1 }),
    lathe([[2.0, 13.6], [3.9, 15.4], [4.1, 16.2], [4.1, 20.4], [3.9, 20.9]], { seg: 14, col: [tone(PAL.wall[0], 0.88), PAL.wall[0]], ao: 0 }),
    [16.6, 20.0].map((y) => rod(4.16, 4.16, 0.3, { seg: 14, at: [0, y, 0], col: tone(PAL.brick, 1.05), ao: 0 })),
    lathe([[4.35, 20.7], [4.35, 20.95], [2.4, 23.4], [0.5, 25.2], [0, 25.4]], { seg: 14, col: [tone(PAL.roof[3], 0.9), tone(PAL.roof[3], 1.15)], ao: 0 }),
    ball(0.35, { d: 1, at: [0, 25.6, 0], col: PAL.gold, ao: 0 }),
    opening([0, 1.3, 2.47], [0, 0.04, 1], [1, 0, 0], 1.1, 2.1, [0.12, 0.12], 0.14, [tone(PAL.door[2], 0.85), PAL.door[2]], PAL.frame),
    [5, 9].map((y) => opening([0, y, 2.37 - (y - 1) * 0.036], [0, 0.04, 1], [1, 0, 0], 0.7, 1.2, [0.09, 0.09], 0.12, GLASS, PAL.frame)),
    [0, 1, 2, 3, 4, 5].map((i) => opening([Math.sin(i * 1.047 + 0.3) * 4.1, 18.3, Math.cos(i * 1.047 + 0.3) * 4.1], [Math.sin(i * 1.047 + 0.3), 0, Math.cos(i * 1.047 + 0.3)], [Math.cos(i * 1.047 + 0.3), 0, -Math.sin(i * 1.047 + 0.3)], 0.9, 1.3, [0.1, 0.1], 0.1, GLASS, PAL.frame)),
  ],
  info: { w: 8.7, d: 8.7, h: 26, r: 4.4, weight: 1 },
}));

// Funkmast: rot-weiß geringelter Mast mit zwei Bühnen, Schüsseln und Warnlicht
def('funkmast', 'farm', () => {
  const parts = [lathe([[1.5, -FOOT], [1.5, 0.5], [1.1, 0.5]], { seg: 8, col: PAL.concrete, ao: 0 })];
  const H = 48;
  const N = 8;
  for (let i = 0; i < N; i++) {
    const y0 = (i / N) * H;
    const r0 = 0.62 - (i / N) * 0.36;
    const r1 = 0.62 - ((i + 1) / N) * 0.36;
    parts.push(rod(r0, r1, H / N, { seg: 8, at: [0, y0, 0], col: i % 2 ? 0xf7f5ee : PAL.red, ao: 0 }));
  }
  for (const y of [30, 39]) {
    parts.push(rod(1.5, 1.5, 0.2, { seg: 10, caps: true, at: [0, y, 0], col: PAL.steel, ao: 0 }));
    parts.push(rod(1.5, 1.5, 0.9, { seg: 10, at: [0, y + 0.2, 0], col: tone(PAL.steel, 1.12), ao: 0 }), rod(1.42, 1.42, 0.9, { seg: 10, at: [0, y + 0.2, 0], col: tone(PAL.steel, 0.8), ao: 0 }).scale(-1, 1, 1));
  }
  for (const [y, a, r] of [[32.5, 0.6, 0.9], [34.5, 3.4, 0.7], [41.5, 2.0, 0.8]]) {
    parts.push(move([lathe([[0, 0], [r * 0.6, 0.08], [r, 0.3]], { seg: 10, col: 0xf7f5ee, ao: 0 }), lathe([[r, 0.3], [r * 0.6, 0.02], [0, -0.08]], { seg: 10, col: 0xdfe3e6, ao: 0 }).scale(-1, 1, 1)], { rot: [Math.PI / 2, a, 0], at: [Math.sin(a) * 0.75, y, Math.cos(a) * 0.75] }));
  }
  parts.push(rod(0.07, 0.05, 5, { seg: 5, at: [0, H, 0], col: 0xf7f5ee, ao: 0 }), ball(0.2, { d: 1, at: [0, H + 5.1, 0], col: 0xff5a4a, ao: 0 }));
  return { tint: [], fixed: parts, info: { w: 3.2, d: 3.2, h: 53.3, r: 1.6, weight: 1 } };
});

// Vogelscheuche: Strohmann mit Flickenhemd, Schlapphut und freundlichem Gesicht
def('vogelscheuche', 'farm', () => {
  const straw = 0xe6c768;
  return {
    tint: [],
    fixed: [
      post(0, 0, 1.6, 0.045, PAL.wood),
      rod(0.045, 0.045, 1.9, { seg: 5, caps: true, rot: [0, 0, Math.PI / 2], at: [0.95, 1.38, 0], col: PAL.wood, ao: 0 }),
      lathe([[0.3, 0.72], [0.36, 0.85], [0.3, 1.5], [0.14, 1.58]], { seg: 8, col: [0x3f7fc4, 0x5a9ad9], ao: 0.1 }),
      [1, -1].map((s) => rod(0.13, 0.11, 0.72, { seg: 6, rot: [0, 0, -s * Math.PI / 2], at: [s * 0.22, 1.38, 0], col: 0x4a8fd0, ao: 0 })),
      [1, -1].map((s) => cone(0.13, 0.3, { seg: 6, rot: [0, 0, -s * Math.PI / 2], at: [s * 0.9, 1.38, 0], col: straw, ao: 0 })),
      cone(0.34, 0.3, { seg: 8, rot: [Math.PI, 0, 0], at: [0, 0.76, 0], col: straw, ao: 0 }),
      box(0.16, 0.16, 0.02, { at: [0.1, 1.0, 0.345], col: PAL.red, ao: 0 }),
      ball(0.27, { d: 1, at: [0, 1.82, 0], col: [0xe9d5a5, 0xf5e6bd], ao: 0.08 }),
      bloom([0.1, 1.86, 0.25], [0.3, 0.1, 1], 0.035, PAL.ink), bloom([-0.1, 1.86, 0.25], [-0.3, 0.1, 1], 0.035, PAL.ink),
      cone(0.04, 0.14, { seg: 5, rot: [Math.PI / 2, 0, 0], at: [0, 1.79, 0.26], col: PAL.orange, ao: 0 }),
      lathe([[0.5, 1.98], [0.5, 2.03], [0.24, 2.05], [0.2, 2.3], [0, 2.34]], { seg: 9, col: [0x7a5a44, 0x9a7b5b], ao: 0 }),
      disc(0.5, { seg: 9, rot: [Math.PI, 0, 0], at: [0, 1.98, 0], col: 0x6b4a36, ao: 0 }),
    ],
    info: { w: 2.1, d: 0.9, h: 2.35, weight: 1 },
  };
});

// Traktor: grün mit roten Felgen, große Hinterräder, Kabine mit Dach, Auspuff – schaut nach +x
def('traktor', 'farm', () => {
  const green = 0x4fae6a;
  const wheel = (r, wdt, x, z) => [
    rod(r, r, wdt, { seg: 12, caps: true, rot: [Math.PI / 2, 0, 0], at: [x, r, z - wdt / 2], col: [0x3a3f47, 0x4a4f57], ao: 0 }),
    rod(r * 0.55, r * 0.55, wdt + 0.06, { seg: 10, caps: true, rot: [Math.PI / 2, 0, 0], at: [x, r, z - wdt / 2 - 0.03], col: PAL.red, ao: 0 }),
    rod(r * 0.16, r * 0.16, wdt + 0.12, { seg: 6, caps: true, rot: [Math.PI / 2, 0, 0], at: [x, r, z - wdt / 2 - 0.06], col: PAL.gold, ao: 0 }),
  ];
  return {
    tint: [],
    fixed: [
      box(1.9, 0.75, 0.9, { round: 0.14, at: [0.75, 0.75, 0], col: [tone(green, 0.85), green], ao: 0.12 }),
      box(1.5, 0.6, 1.05, { round: 0.1, at: [-0.65, 0.6, 0], col: [tone(green, 0.8), tone(green, 0.95)], ao: 0.1 }),
      // Kabine: vier Pfosten, Scheiben, rundes Dach
      box(1.2, 1.15, 1.0, { at: [-0.7, 1.2, 0], col: [0x8fc4de, 0xbfe0ee], ao: 0 }),
      [[-1.3, 0.5], [-1.3, -0.5], [-0.1, 0.5], [-0.1, -0.5]].map(([x, z]) => box(0.09, 1.2, 0.09, { at: [x, 1.2, z], col: tone(green, 0.9), ao: 0 })),
      box(1.45, 0.14, 1.2, { round: 0.06, at: [-0.7, 2.33, 0], col: tone(green, 1.05), ao: 0 }),
      rod(0.05, 0.05, 0.9, { seg: 6, top: true, at: [1.2, 1.5, 0.28], col: PAL.darkMetal, ao: 0 }),
      box(0.08, 0.36, 0.7, { at: [1.72, 0.92, 0], col: 0x3a3f47, ao: 0 }),
      [0.3, -0.3].map((z) => ball(0.08, { d: 0, at: [1.72, 1.34, z], col: 0xfff3b0, ao: 0 })),
      wheel(0.78, 0.42, -0.75, 0.82), wheel(0.78, 0.42, -0.75, -0.4),
      wheel(0.45, 0.28, 1.25, 0.72), wheel(0.45, 0.28, 1.25, -0.44),
    ],
    info: { w: 3.7, d: 2.1, h: 2.5, weight: 1 },
  };
});

// --- Tiere (stehen still, schauen nach +x) -------------------------------------------------------
const EYE = PAL.ink;
const ZAX = new THREE.Vector3(0, 0, 1);
/**
 * Knopfauge bei c (Blickrichtung n); glint setzt einen kleinen Glanzpunkt oben-vorn darauf – wie bei den Augen eines
 * Plüschtiers (nur bei den großen Tieren: bei Huhn und Ente wäre er kleiner als ein Pixel und flimmerte).
 */
function eye(c, n, size, glint = false) {
  const out = [bloom(c, n, size, EYE)];
  if (glint) {
    const N = new THREE.Vector3(...n).normalize();
    const G = new THREE.Vector3(0.5, 1, 0).addScaledVector(N, -N.y - 0.5 * N.x).normalize();
    const at = new THREE.Vector3(...c).addScaledVector(G, size * 0.34).addScaledVector(N, size * 0.27);
    out.push(bloom(at.toArray(), n, size * 0.3, 0xfdfbf5));
  }
  return out;
}
/** Zwei Knopfaugen links und rechts am Kopf (Mitte c, halbe Kopfbreite hw). */
const eyes = (c, hw, size, glint = false) => [1, -1].map((s) => eye([c[0], c[1], c[2] + s * hw], [0.35, 0.15, s], size, glint));
/** Beine an den Plätzen [[x, z], …]: leicht konische Stangen vom Huf bis in den Rumpf. */
const legs = (spots, h, r, col) => spots.map(([x, z]) => rod(r * 0.9, r, h, { seg: 6, at: [x, 0.05, z], col, ao: 0 }));
/** Hufe dazu: eine Spur dicker als das Bein, reichen 3 cm unter den Boden. */
const hooves = (spots, r, col) => spots.map(([x, z]) => rod(r * 1.12, r * 1.02, 0.11, { seg: 6, at: [x, -0.03, z], col, ao: 0 }));
const four = (xf, xb, zf, zb = zf) => [[xf, zf], [xf, -zf], [xb, zb], [xb, -zb]];

/** Punkt auf einem Ellipsoid (Mitte c, Halbachsen a), von der Mitte aus in Richtung dir, und die Normale dort. */
function onEgg(c, a, dir) {
  const t = 1 / Math.hypot(dir[0] / a[0], dir[1] / a[1], dir[2] / a[2]);
  const p = [0, 1, 2].map((i) => c[i] + dir[i] * t);
  const n = new THREE.Vector3((p[0] - c[0]) / a[0] ** 2, (p[1] - c[1]) / a[1] ** 2, (p[2] - c[2]) / a[2] ** 2).normalize();
  return { p, n: n.toArray() };
}

/**
 * Fleck im Fell eines Ellipsoid-Körpers (Mitte c, Halbachsen a) bei dir: eine dünne Haut, die der Wölbung folgt,
 * in der Mitte um hi über dem Fell liegt und am Rand um lo darunter verschwindet – wie ein aufgenähter Filzflicken
 * mit sauberem, leicht welligem Umriss (r Radius, e Streckung längs x, seed für die Welle, seg Ecken im Umriss; kleine
 * Flecken kommen mit 8 Ecken und zwei Ringen aus). Ein flacher Klecks läge auf der gewölbten Flanke an den Rändern
 * hohl auf; lo muss tiefer reichen als die Facetten des Körpers.
 */
function fleck(c, a, dir, r, col, { e = 1, seed = 1, lo = -0.012, hi = 0.022, seg = 12 } = {}) {
  const { p, n } = onEgg(c, a, dir);
  const N = new THREE.Vector3(...n);
  const U = new THREE.Vector3(Math.abs(N.x) > 0.9 ? 0 : 1, Math.abs(N.x) > 0.9 ? 1 : 0, 0);
  U.addScaledVector(N, -U.dot(N)).normalize();
  const V = new THREE.Vector3().crossVectors(N, U);
  const rnd = mulberry32(seed);
  const w2 = rnd() * TAU;
  const w3 = rnd() * TAU;
  const RINGS = seg > 8 ? [0, 0.55, 0.85, 1] : [0, 0.7, 1];
  const SEG = seg;
  const pos = [];
  const nrm = [];
  const q = new THREE.Vector3();
  RINGS.forEach((s, ring) => {
    const lift = lo + (hi - lo) * (1 - s ** 4);
    for (let j = 0; j < (ring ? SEG : 1); j++) {
      const f = (j / SEG) * TAU;
      const R = r * s * (1 + 0.12 * Math.sin(2 * f + w2) + 0.08 * Math.sin(3 * f + w3));
      q.fromArray(p).addScaledVector(U, Math.cos(f) * R * e).addScaledVector(V, Math.sin(f) * R);
      // auf die Körperoberfläche ziehen (Strahl aus der Mitte), dort die Normale nehmen und anheben
      const k = 1 / Math.hypot((q.x - c[0]) / a[0], (q.y - c[1]) / a[1], (q.z - c[2]) / a[2]);
      q.set(c[0] + (q.x - c[0]) * k, c[1] + (q.y - c[1]) * k, c[2] + (q.z - c[2]) * k);
      const m = new THREE.Vector3((q.x - c[0]) / a[0] ** 2, (q.y - c[1]) / a[1] ** 2, (q.z - c[2]) / a[2] ** 2).normalize();
      q.addScaledVector(m, lift);
      pos.push(q.x, q.y, q.z);
      nrm.push(m.x, m.y, m.z);
    }
  });
  // Fächer um die Mitte, dann Ring für Ring (Reihenfolge U → V: von außen gesehen gegen den Uhrzeigersinn)
  const idx = [];
  const at = (ring, j) => (ring ? 1 + (ring - 1) * SEG + (j % SEG) : 0);
  for (let ring = 1; ring < RINGS.length; ring++) {
    for (let j = 0; j < SEG; j++) {
      if (ring === 1) idx.push(0, at(1, j), at(1, j + 1));
      else idx.push(at(ring - 1, j), at(ring, j), at(ring, j + 1), at(ring - 1, j), at(ring, j + 1), at(ring - 1, j + 1));
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  g.setIndex(idx);
  return paint(g, [tone(col, 0.86), tone(col, 1.12)], { ao: 0 });
}

// Kuh: tint = Fell, fixed = Flecken (als Filzflicken auf Rumpf), Maul, Hörner, Euter, Schwanzquaste. Der Schwanz
// hängt dicht am Hinterteil. head: eigene Kopffarbe (das Fleckvieh trägt einen weißen Kopf), ears: Ohrenfarbe
// (sonst wie das Fell)
const COW = { c: [0, 1.02, 0], a: [0.875, 0.46, 0.46] };
const COW_HEAD = { c: [1.2, 1.42, 0], a: [0.3024, 0.27, 0.2565] };
function cow({ patch, spots, muzzle, tuft, ears = null, head = null }) {
  const fur = [tone(WHITE, 0.9), WHITE];
  const ear = (s) => ball(0.11, { d: 0, s: [0.45, 0.8, 1.5], at: [1.08, 1.56, s * 0.32], rot: [s * 0.5, 0, 0], col: ears ?? WHITE, ao: 0 });
  const skull = (col) => ball(1, { d: 2, s: COW_HEAD.a, at: COW_HEAD.c, col, ao: 0 });
  return {
    tint: [
      ball(1, { d: 3, s: COW.a, at: COW.c, col: fur, ao: 0.1 }),
      tube([[0.55, 1.1, 0], [0.92, 1.3, 0], [1.12, 1.38, 0]], 0.27, { r1: 0.2, seg: 12, steps: 3, col: WHITE, ao: 0 }),
      head ? [] : skull(WHITE),
      ears ? [] : [1, -1].map(ear),
      legs(four(0.55, -0.55, 0.2, 0.22), 0.85, 0.1, fur),
      tube([[-0.62, 1.22, 0], [-0.86, 1.14, 0.02], [-0.95, 0.88, 0.05], [-0.94, 0.66, 0.06]], 0.042, { r1: 0.032, seg: 5, steps: 6, col: WHITE, ao: 0 }),
    ],
    fixed: [
      spots.map(([dir, r, e, seed]) => fleck(COW.c, COW.a, dir, r, patch, { e, seed })),
      head ? skull([tone(head, 0.92), head]) : [],
      ears ? [1, -1].map(ear) : [],
      ball(0.185, { d: 1, s: [1, 0.82, 1.05], at: [1.43, 1.32, 0], col: muzzle, ao: 0 }),
      [0.07, -0.07].map((z) => bloom([1.6, 1.33, z], [1, 0.1, z], 0.028, 0x8a5a55)),
      eyes([1.3, 1.52, 0], 0.235, 0.05, true),
      [1, -1].map((s) => cone(0.045, 0.2, { seg: 5, rot: [s * 0.5, 0, 0], at: [1.12, 1.62, s * 0.14], col: 0xf3ead2, ao: 0 })),
      ball(0.17, { d: 0, s: [1.2, 0.8, 1], at: [-0.42, 0.6, 0], col: 0xf7b9b4, ao: 0 }),
      ball(0.075, { d: 1, s: [0.85, 1.5, 0.85], at: [-0.94, 0.6, 0.06], col: tuft, ao: 0 }),
      hooves(four(0.55, -0.55, 0.2, 0.22), 0.1, 0x4a4038),
    ],
  };
}
// Holsteiner: weiß mit weichen, schiefergrauen Flecken (kein Schwarz – das säuft im Gegenlicht zum Klecks ab)
const HOLSTEIN = 0x4b4752;
def('kuh', 'animal', () => ({
  ...cow({
    patch: HOLSTEIN,
    spots: [[[0.35, 0.3, 1], 0.3, 1.3, 3], [[-0.45, 0.15, -1], 0.32, 1.2, 4], [[-0.1, 1, 0.12], 0.25, 1.4, 5], [[-0.62, -0.3, 1], 0.2, 1, 6], [[0.62, 0.1, -1], 0.21, 1.1, 7]],
    muzzle: 0xf7c9c0,
    tuft: HOLSTEIN,
    ears: HOLSTEIN,
  }),
  info: { w: 2.6, d: 0.95, h: 1.8, tints: [0xfdfbf5, 0xf6f1e6], weight: 4 },
}));
// Fleckvieh: braun mit cremeweißen Flecken und weißem Kopf
def('kuh_braun', 'animal', () => ({
  ...cow({
    patch: 0xfbf3e4,
    spots: [[[0.42, 0.45, 1], 0.24, 1.2, 8], [[-0.25, 1, -0.2], 0.26, 1.4, 9], [[-0.55, 0.05, -1], 0.21, 1, 10], [[0.2, -0.6, -1], 0.2, 1.3, 11]],
    muzzle: 0xf7d9c0,
    tuft: 0x6b4a36,
    head: 0xfbf3e4,
  }),
  info: { w: 2.6, d: 0.95, h: 1.8, tints: [0xb5713c, 0xa5622e, 0xc9844a], weight: 3 },
}));
// Schaf: Wollknäuel auf vier dunklen Beinen, dunkles Gesicht
def('schaf', 'animal', () => {
  const wool = [[0, 0.72, 0, 0.42, 0.95], [0.34, 0.76, 0.05, 0.34], [-0.36, 0.74, -0.04, 0.36], [0.05, 0.92, 0, 0.3], [0.55, 0.98, 0, 0.2]];
  const dark = 0x4a4038;
  return {
    tint: [puffs(jitter(wool, 73, 0.05), { col: [tone(WHITE, 0.86), WHITE], ao: 0.12, under: 0.12 })],
    fixed: [
      ball(0.17, { d: 1, s: [1.25, 1, 0.9], at: [0.68, 0.86, 0], col: [tone(dark, 0.9), tone(dark, 1.2)], ao: 0 }),
      [1, -1].map((s) => ball(0.07, { d: 0, s: [0.6, 0.5, 1.6], at: [0.6, 0.94, s * 0.2], col: dark, ao: 0 })),
      [1, -1].map((s) => bloom([0.74, 0.91, s * 0.135], [0.4, 0.2, s], 0.035, 0xfdfbf5)),
      [1, -1].map((s) => bloom([0.752, 0.912, s * 0.139], [0.4, 0.2, s], 0.016, EYE)),
      legs(four(0.26, -0.28, 0.15), 0.42, 0.055, dark), hooves(four(0.26, -0.28, 0.15), 0.055, 0x2f2a26),
    ],
    info: { w: 1.6, d: 0.85, h: 1.2, tints: [0xfdfbf5, 0xf3ead2, 0xe9e2d0], weight: 5 },
  };
});

// Pferd (Pony-Maße): runder Rumpf auf kräftigen Beinen, gebogener Hals, großer Kopf mit weichem Maul und Stern.
// Mähne (ein weicher Wulst auf dem Mähnenkamm), Stirnschopf und Schweif sind im dunkleren Ton des Fells gefärbt
// (tint mit grauer Vertex-Farbe): so passen sie zu jeder Fellfarbe
def('pferd', 'animal', () => {
  const fur = [tone(WHITE, 0.88), WHITE];
  const hair = tone(WHITE, 0.5);
  // Hals von tief im Rumpf bis unter den Hinterkopf: unten dick, oben schlank, zum Kopf hin vorgebeugt
  const NECK = [[0.36, 1.04, 0], [0.56, 1.48, 0], [0.72, 1.78, 0], [0.92, 1.95, 0]];
  const [r0, r1] = [0.28, 0.185];
  const line = new THREE.CatmullRomCurve3(NECK.map((p) => new THREE.Vector3(...p)));
  // Mähnenkamm: Mittellinie plus Radius nach oben-hinten, etwas eingesenkt; das obere Ende taucht in den Hinterkopf
  const crest = [0.06, 0.3, 0.55, 0.8, 0.97].map((t) => {
    const p = line.getPointAt(t);
    const d = line.getTangentAt(t);
    const r = (r0 + (r1 - r0) * t) * (t > 0.9 ? 0.55 : 0.9);
    return [p.x - d.y * r, p.y + d.x * r, 0];
  });
  // Kopf im eigenen Rahmen gebaut (x von der Stirn zum Maul, y zur Gesichtsseite), dann geneigt an den Hals gesetzt;
  // Augen und Nüstern kommen danach an die gedrehten Stellen (der Glanzpunkt sitzt immer oben)
  const HEAD = { c: [0, 0, 0], a: [0.3, 0.2, 0.18] };
  const NOSE = { c: [0.21, -0.03, 0], a: [0.16, 0.15, 0.165] };
  const AT = new THREE.Vector3(1.07, 1.8, 0);
  const TILT = -0.87;
  const place = (dir, body = HEAD) => {
    const { p, n } = onEgg(body.c, body.a, dir);
    return [new THREE.Vector3(...p).applyAxisAngle(ZAX, TILT).add(AT).toArray(), new THREE.Vector3(...n).applyAxisAngle(ZAX, TILT).toArray()];
  };
  const head = { at: AT.toArray(), rot: [0, 0, TILT] };
  const spots = four(0.46, -0.48, 0.17);
  return {
    tint: [
      ball(1, { d: 3, s: [0.76, 0.43, 0.39], at: [0, 1.08, 0], col: fur, ao: 0.1 }),
      tube(NECK, r0, { r1, seg: 12, steps: 5, col: WHITE, ao: 0 }),
      ball(0.215, { d: 1, at: [0.92, 1.95, 0], col: WHITE, ao: 0 }),
      move([
        ball(1, { d: 2, s: HEAD.a, col: [tone(WHITE, 0.94), WHITE], ao: 0 }),
        ball(1, { d: 1, s: NOSE.a, at: NOSE.c, col: tone(WHITE, 0.8), ao: 0 }),
      ], head),
      [1, -1].map((s) => cone(0.065, 0.2, { seg: 6, s: [0.7, 1, 1], rot: [s * 0.22, 0, -0.18], at: [0.95, 2.08, s * 0.085], col: WHITE, ao: 0 })),
      legs(spots, 0.92, 0.1, fur),
      tube(crest, 0.07, { r1: 0.1, seg: 7, steps: 10, col: hair, ao: 0 }).scale(1, 1, 0.7),
      ball(0.085, { d: 1, s: [1.25, 0.75, 1], rot: [0, 0, -0.6], at: [1.0, 2.11, 0], col: hair, ao: 0 }),
      tube([[-0.6, 1.24, 0], [-0.82, 1.26, 0.02], [-0.94, 1.04, 0.05], [-0.94, 0.72, 0.06]], 0.06, { r1: 0.1, seg: 6, steps: 5, col: hair, ao: 0 }),
      ball(0.115, { d: 1, s: [1, 1.35, 1], at: [-0.94, 0.7, 0.06], col: hair, ao: 0 }),
    ],
    fixed: [
      move(fleck(HEAD.c, HEAD.a, [-0.05, 1, 0], 0.055, 0xfbf3e4, { e: 1.3, seed: 5, lo: -0.006, hi: 0.008, seg: 8 }), head),
      [1, -1].map((s) => eye(...place([-0.08, 0.42, s]), 0.05, true)),
      [1, -1].map((s) => bloom(...place([0.8, 0.2, s * 0.55], NOSE), 0.026, 0x4a362c)),
      hooves(spots, 0.1, 0x3a302a),
    ],
    info: { w: 2.4, d: 0.8, h: 2.28, tints: [0xb5713c, 0x8a5a3c, 0xd9a066, 0x6b4a36, 0xe9e2d0], weight: 2 },
  };
});

// Reh: zierlich, große Ohren, heller Spiegel und Bauch
def('reh', 'animal', () => {
  const fur = [tone(WHITE, 0.88), WHITE];
  return {
    tint: [
      ball(0.27, { d: 1, s: [1.75, 0.92, 0.8], at: [0, 0.78, 0], col: fur, ao: 0.1 }),
      tube([[0.34, 0.86, 0], [0.5, 1.12, 0], [0.56, 1.3, 0]], 0.1, { seg: 5, steps: 2, col: WHITE, ao: 0 }),
      ball(0.13, { d: 1, s: [1.45, 1, 0.9], at: [0.66, 1.32, 0], rot: [0, 0, -0.25], col: WHITE, ao: 0 }),
      legs(four(0.32, -0.32, 0.09), 0.65, 0.04, fur),
      [1, -1].map((s) => ball(0.08, { d: 0, s: [0.5, 1.5, 0.75], at: [0.55, 1.5, s * 0.1], rot: [s * 0.45, 0, 0.2], col: WHITE, ao: 0 })),
    ],
    fixed: [
      ball(0.13, { d: 0, s: [0.6, 1, 1.1], at: [-0.44, 0.84, 0], col: 0xfdfbf5, ao: 0 }),
      ball(0.045, { d: 0, at: [0.84, 1.28, 0], col: 0x3a302a, ao: 0 }),
      eyes([0.7, 1.37, 0], 0.105, 0.035),
      hooves(four(0.32, -0.32, 0.09), 0.04, 0x3a302a),
    ],
    info: { w: 1.4, d: 0.45, h: 1.6, tints: [0xc9895a, 0xb9794c, 0xd69a68], weight: 2 },
  };
});

// Katze (sitzt): runder Körper, Kopf mit Ohren, geringelter Schwanz, weiße Schnauze
def('katze', 'animal', () => ({
  tint: [
    ball(0.17, { d: 1, s: [1, 1.25, 0.95], at: [0, 0.2, 0], col: [tone(WHITE, 0.88), WHITE], ao: 0.1 }),
    ball(0.13, { d: 1, s: [1, 0.92, 1.05], at: [0.07, 0.5, 0], col: WHITE, ao: 0 }),
    [1, -1].map((s) => cone(0.05, 0.1, { seg: 4, at: [0.05, 0.585, s * 0.075], col: WHITE, ao: 0 })),
    tube([[-0.12, 0.06, 0.05], [-0.26, 0.05, 0.14], [-0.18, 0.05, 0.3], [-0.02, 0.05, 0.3]], 0.035, { seg: 5, steps: 5, col: WHITE, ao: 0 }),
    [1, -1].map((s) => ball(0.05, { d: 0, s: [1.3, 0.8, 1], at: [0.14, 0.04, s * 0.07], col: WHITE, ao: 0 })),
  ],
  fixed: [
    ball(0.055, { d: 0, s: [0.8, 0.7, 1.2], at: [0.175, 0.47, 0], col: 0xfdfbf5, ao: 0 }),
    bloom([0.215, 0.485, 0], [1, 0.2, 0], 0.016, 0xf48fb1),
    [1, -1].map((s) => bloom([0.165, 0.535, s * 0.06], [1, 0.25, s * 0.5], 0.026, 0x8fd06a)),
    [1, -1].map((s) => bloom([0.174, 0.537, s * 0.063], [1, 0.25, s * 0.5], 0.011, EYE)),
  ],
  info: { w: 0.5, d: 0.5, h: 0.68, tints: [0xf08a2c, 0x8a8f96, 0x3a3f47, 0xfdfbf5, 0xd9a066], weight: 2 },
}));

// Storch auf dem Nest: Mast mit Wagenrad-Nest, der Storch steht auf einem Bein
def('storch', 'animal', () => ({
  tint: [],
  fixed: [
    stem(0.16, 0.12, 7.6, PAL.wood, { seg: 7 }),
    lathe([[0.2, 7.5], [0.95, 7.62], [1.05, 7.95], [0.8, 8.0], [0.5, 7.85], [0, 7.84]], { seg: 9, col: [0x7a5a44, 0xa98a62], ao: 0 }),
    rod(0.022, 0.022, 0.7, { seg: 4, at: [0.05, 7.84, 0.04], col: PAL.red, ao: 0 }),
    tube([[-0.05, 8.5, -0.04], [0.02, 8.3, -0.04], [-0.12, 8.2, -0.04]], 0.02, { seg: 4, steps: 2, col: PAL.red, ao: 0 }),
    ball(0.21, { d: 1, s: [1.5, 0.9, 0.82], at: [0, 8.7, 0], rot: [0, 0, 0.35], col: [0xe9e6df, 0xfdfbf5], ao: 0 }),
    ball(0.13, { d: 0, s: [1.5, 0.7, 0.9], at: [-0.25, 8.6, 0], rot: [0, 0, 0.5], col: 0x34343a, ao: 0 }),
    tube([[0.2, 8.82, 0], [0.3, 9.1, 0], [0.33, 9.3, 0]], 0.055, { seg: 5, steps: 2, col: 0xfdfbf5, ao: 0 }),
    ball(0.09, { d: 1, at: [0.35, 9.36, 0], col: 0xfdfbf5, ao: 0 }),
    cone(0.035, 0.36, { seg: 5, rot: [0, 0, -1.75], at: [0.42, 9.36, 0], col: PAL.red, ao: 0 }),
    eyes([0.38, 9.39, 0], 0.075, 0.018),
  ],
  info: { w: 2.1, d: 2.1, h: 9.5, r: 1.05, weight: 1 },
}));

// Hühner: zwei Hennen und ein Hahn, picken und schauen (Gruppe auf 1,6 m)
function hen(body, tail, s = 1) {
  return move([
    ball(0.15, { d: 1, s: [1.2, 1, 0.9], at: [0, 0.24, 0], col: [tone(body, 0.86), body], ao: 0.1 }),
    cone(0.1, 0.22, { seg: 5, rot: [0, 0, 0.9], at: [-0.13, 0.3, 0], col: tail, ao: 0 }),
    ball(0.085, { d: 1, at: [0.15, 0.42, 0], col: body, ao: 0 }),
    cone(0.03, 0.08, { seg: 4, rot: [0, 0, -Math.PI / 2], at: [0.22, 0.41, 0], col: PAL.orange, ao: 0 }),
    ball(0.04, { d: 0, s: [1.2, 1, 0.5], at: [0.14, 0.51, 0], col: PAL.red, ao: 0 }),
    ball(0.025, { d: 0, at: [0.2, 0.36, 0], col: PAL.red, ao: 0 }),
    eyes([0.19, 0.44, 0], 0.07, 0.017),
    [0.05, -0.05].map((z) => rod(0.014, 0.014, 0.13, { seg: 4, at: [0.01, -0.01, z], col: PAL.orange, ao: 0 })),
  ], { s });
}
def('huehner', 'animal', () => ({
  tint: [],
  fixed: [
    move(hen(0xfdfbf5, 0xe9e2d0), { at: [-0.5, 0, 0.25], rot: [0, 0.4, 0] }),
    move(hen(0xb5713c, 0x8a5a3c), { at: [0.35, 0, 0.4], rot: [0, 2.7, 0] }),
    move(hen(0xe5873a, 0x2f5f4a, 1.18), { at: [0.15, 0, -0.4], rot: [0, -0.7, 0] }),
  ],
  info: { w: 1.6, d: 1.3, h: 0.65, weight: 2 },
}));

// Enten an Land (wie die auf dem Teich)
def('enten', 'animal', () => ({
  tint: [],
  fixed: [
    move(duck(), { at: [-0.35, 0.02, 0.1], rot: [0, 0.3, 0] }),
    move(duck(0xb98a5a, 0x8a6a48), { at: [0.3, 0.02, -0.15], rot: [0, 0.7, 0], s: 0.92 }),
  ],
  info: { w: 1.3, d: 0.8, h: 0.5, weight: 1 },
}));

// --- Drop-ins für die Autobahn-Landschaft --------------------------------------------------------
// Dorfhaus als Einheitsklotz (x, z ∈ ±0,5; Wand 0 … 1; First entlang z): scenery.js skaliert jede Instanz auf
// Breite × Höhe × Tiefe und färbt Wände und Dach über die Instanzfarbe.
const RIDGE = 0.62; // Firsthöhe über der Traufe
const OVER = 0.06; // Dachüberstand ringsum (wie der alte Klotz, darauf baut die Dorfplanung)
const SLAB = 0.058; // Dicke der Dachplatte: lieber pummelig als ein Blatt Papier
const roofTop = (x) => 1 + RIDGE - (RIDGE * Math.abs(x)) / (0.5 + OVER);

function houseDrop() {
  const parts = [];
  const yw = roofTop(0.5) - SLAB + 0.015; // Wandkrone: steckt in der Dachplatte
  const yg = roofTop(0) - 0.02; // Giebelspitze: ebenso
  const sock = 0.065;
  const base = -0.05; // der Sockel reicht unter den Boden (0,25–0,4 m)
  const stone = tone(PAL.stone, 0.92);
  const wall = { col: WHITE, ao: 0.16, y0: 0, y1: 1.1 };
  for (const s of [1, -1]) {
    // Traufseiten (x = ±0,5) und Giebelseiten (z = ±0,5), jeweils mit Sockelband
    parts.push(face([[s * 0.5, base, -0.5], [s * 0.5, base, 0.5], [s * 0.5, sock, 0.5], [s * 0.5, sock, -0.5]], [s, 0, 0], { col: stone, ao: 0.25 }));
    parts.push(face([[s * 0.5, sock, -0.5], [s * 0.5, sock, 0.5], [s * 0.5, yw, 0.5], [s * 0.5, yw, -0.5]], [s, 0, 0], wall));
    parts.push(face([[-0.5, base, s * 0.5], [0.5, base, s * 0.5], [0.5, sock, s * 0.5], [-0.5, sock, s * 0.5]], [0, 0, s], { col: stone, ao: 0.25 }));
    parts.push(face([[-0.5, sock, s * 0.5], [0.5, sock, s * 0.5], [0.5, yw, s * 0.5], [0, yg, s * 0.5], [-0.5, yw, s * 0.5]], [0, 0, s], wall));
  }
  const fx = [0.013, 0.02];
  const win = (c, n, r, w = 0.13, h = 0.2) => parts.push(pane(c, n, r, w, h, fx, 0.012, GLASS, PAL.frame));
  // Straßenseite (−x): Tür mit zwei Fenstern, drei Fenster im Obergeschoss, Blumenkästen
  const front = [-1, 0, 0];
  const along = [0, 0, 1];
  parts.push(pane([-0.5, 0.19, 0], front, along, 0.12, 0.38, [0.014, 0.022], 0.012, [tone(PAL.door[0], 0.8), PAL.door[0]], PAL.frame));
  for (const z of [-0.27, 0.27]) {
    win([-0.5, 0.31, z], front, along);
    parts.push(flowerBox([-0.5, 0.182, z], front, along, 0.15, 0.045, 0.03, [tone(PAL.timber, 1.25), z < 0 ? PAL.red : 0xf48fb1]));
  }
  for (const z of [-0.27, 0, 0.27]) win([-0.5, 0.74, z], front, along);
  // Gartenseite (+x)
  for (const z of [-0.22, 0.22]) for (const y of [0.31, 0.74]) win([0.5, y, z], [1, 0, 0], [0, 0, -1]);
  // Giebel: je vier Fenster und ein kleines unterm First
  for (const s of [1, -1]) {
    for (const x of [-0.21, 0.21]) for (const y of [0.31, 0.74]) win([x, y, s * 0.5], [0, 0, s], [s, 0, 0], 0.15, 0.2);
    win([0, 1.22, s * 0.5], [0, 0, s], [s, 0, 0], 0.11, 0.14);
  }
  // Schornstein (ragt durchs Dach) und zwei Gauben (ihre Dächlein gehören zur Dach-Geometrie)
  parts.push(box(0.085, 0.36, 0.07, { at: [0.15, 1.36, 0.2], col: [tone(PAL.brick, 0.85), PAL.brick], ao: 0.1 }));
  for (const s of [1, -1]) parts.push(dormerFront(s));
  return fuse(parts);
}

// Gaube an der Traufseite s: Front bei x = ±0,34 (Scheibe, Brüstung, Giebeldreieck) und zwei Wangen
const DORMER = { x: 0.34, hw: 0.095, eave: 1.395, peak: 1.465 };
function dormerFront(s) {
  const { x, hw, eave, peak } = DORMER;
  const X = s * x;
  const y0 = roofTop(x) - 0.012;
  const sill = y0 + 0.03;
  const back = ((1 + RIDGE - eave) * (0.5 + OVER)) / RIDGE; // dort trifft die Gaubentraufe das Hauptdach
  const out = [s, 0, 0];
  return [
    face([[X, y0, -hw], [X, y0, hw], [X, sill, hw], [X, sill, -hw]], out, { col: WHITE, ao: 0 }),
    face([[X, sill, -hw], [X, sill, hw], [X, eave, hw], [X, eave, -hw]], out, { col: GLASS, ao: 0 }),
    face([[X, eave, -hw], [X, eave, hw], [X, peak, 0]], out, { col: WHITE, ao: 0 }),
    face([[X, y0, hw], [X, eave, hw], [s * (back - 0.02), eave, hw]], [0, 0, 1], { col: tone(WHITE, 0.9), ao: 0 }),
    face([[X, y0, -hw], [X, eave, -hw], [s * (back - 0.02), eave, -hw]], [0, 0, -1], { col: tone(WHITE, 0.9), ao: 0 }),
  ];
}

function roofDrop() {
  const e = 0.5 + OVER;
  const parts = [];
  // Oberseite in drei Ziegelbändern (abwechselnd eine Spur heller), darunter Traufkante, Untersicht, Ortgänge
  const BANDS = 3;
  const top = (t) => [e * t, 1 + RIDGE - RIDGE * t];
  for (const s of [1, -1]) {
    for (let i = 0; i < BANDS; i++) {
      const [x0, y0] = top(i / BANDS);
      const [x1, y1] = top((i + 1) / BANDS);
      const k = (i % 2 ? 0.9 : 1) * (1 - 0.04 * i);
      parts.push(face([[s * x0, y0, -e], [s * x0, y0, e], [s * x1, y1, e], [s * x1, y1, -e]], [s, 1, 0], { col: tone(WHITE, k), ao: 0 }));
    }
    parts.push(face([[s * e, 1, -e], [s * e, 1, e], [s * e, 1 - SLAB, e], [s * e, 1 - SLAB, -e]], [s, 0, 0], { col: tone(WHITE, 0.74), ao: 0 }));
    // die Untersicht bekommt kaum Licht: heller eingefärbt, damit sie nicht schwarz absäuft
    const under = face([[s * e, 1 - SLAB, -e], [s * e, 1 - SLAB, e], [0, 1 + RIDGE - SLAB, e], [0, 1 + RIDGE - SLAB, -e]], [-s, -1, 0], { ao: 0 });
    under.attributes.color.array.fill(1.45);
    parts.push(under);
    // Ortgang: Fächer durch die Ecken der Ziegelbänder, sonst blitzt an den T-Stößen der Himmel durch
    for (const sz of [1, -1]) {
      const edge = [[0, 1 + RIDGE - SLAB, sz * e]];
      for (let i = 0; i <= BANDS; i++) edge.push([s * top(i / BANDS)[0], top(i / BANDS)[1], sz * e]);
      edge.push([s * e, 1 - SLAB, sz * e]);
      parts.push(face(edge, [0, 0, sz], { col: tone(WHITE, 0.82), ao: 0 }));
    }
    // Gaubendach: zwei Flächen, die hinten im Hauptdach verschwinden
    const { x, hw, eave, peak } = DORMER;
    const backEave = ((1 + RIDGE - eave) * e) / RIDGE - 0.02;
    const backPeak = ((1 + RIDGE - peak) * e) / RIDGE - 0.02;
    for (const sz of [1, -1]) {
      parts.push(face([[s * x, eave, sz * hw], [s * x, peak, 0], [s * backPeak, peak, 0], [s * backEave, eave, sz * hw]], [0, 1, sz], { col: tone(WHITE, 0.92), ao: 0 }));
    }
  }
  return fuse(parts);
}

/**
 * Drop-in-Geometrien für scenery.js ('decid', 'conifer', 'bush', 'house', 'roof'): ein Stück je Name, gleicher
 * Ursprung und gleiche Maße wie die alten Klötze. Bei den Pflanzen sind die Farben eingebacken (die Instanzfarbe
 * tönt nur noch), Haus und Dach sind fast weiß und bekommen ihre Farbe von der Instanz.
 */
export function dropInGeo(name) {
  const key = 'drop:' + name;
  if (!GEO.has(key)) {
    let g = null;
    if (name === 'decid') g = fuse(decidTrunk(), leaves(DECID, 7, { col: [tone(PAL.crown[0], 0.92), tone(PAL.crown[3], 1.12)], ao: 0.16 }));
    else if (name === 'conifer') g = fuse(coniferTrunk(), coniferSkirts([tone(PAL.conifer[1], 1.12), tone(PAL.conifer[0], 1.5, 0.95)]));
    else if (name === 'bush') g = fuse(bushLeaves([tone(PAL.crown[2], 0.95), tone(PAL.crown[3], 1.12)]), bushFlowers());
    else if (name === 'house') g = houseDrop();
    else if (name === 'roof') g = roofDrop();
    GEO.set(key, g);
  }
  return GEO.get(key);
}

/** Geometrien eines Bausteins (zwischengespeichert): tint, fixed, bewegliche Knoten, info. */
function geoOf(name) {
  if (!GEO.has(name)) {
    const d = DEFS[name];
    if (!d) return null;
    const { tint = [], fixed = [], nodes = {}, info } = d.make();
    const moving = Object.entries(nodes).map(([key, n]) => ({ key, at: n.at, geo: fuse(n.parts) }));
    // für Instanzen stehen die beweglichen Teile still an ihrem Platz
    const fixedAll = fuse(fixed, moving.map((n) => n.geo.toNonIndexed().translate(...n.at)));
    const t = fuse(tint);
    GEO.set(name, {
      tint: t,
      fixed: fixedAll,
      body: moving.length ? fuse(fixed) : fixedAll,
      moving,
      info: { kind: d.kind, weight: 1, tints: [WHITE], ...info, tris: tris(t) + tris(fixedAll) },
    });
  }
  return GEO.get(name);
}

export function createNatureKit(F) {
  const matte = F.lambert({ vertexColors: true });
  const unit = new THREE.Matrix4();
  return {
    matte,
    /** Instanz-Geometrien { tint, fixed, info } eines Bausteins (dieselben Objekte bei jedem Aufruf). */
    geo: (name) => {
      const g = geoOf(name);
      return g && { tint: g.tint, fixed: g.fixed, info: g.info };
    },
    /**
     * Einzelstück als Gruppe (ein bis drei Draw-Calls). opts.tint: Farbe der einfärbbaren Teile (Vorgabe: die
     * erste aus info.tints). Bewegliche Teile hängen als eigene Knoten daran: group.userData.rotor (Windrad,
     * Windmühle; dreht um seine z-Achse).
     */
    build: (name, { tint } = {}) => {
      const g = geoOf(name);
      if (!g) return null;
      const group = new THREE.Group();
      group.name = name;
      if (g.tint) {
        const m = new THREE.InstancedMesh(g.tint, matte, 1);
        m.setMatrixAt(0, unit);
        m.setColorAt(0, new THREE.Color(tint ?? g.info.tints[0]));
        group.add(m);
      }
      if (g.body) group.add(new THREE.Mesh(g.body, matte));
      for (const n of g.moving) {
        const node = new THREE.Mesh(n.geo, matte);
        node.position.set(...n.at);
        group.add(node);
        group.userData[n.key] = node;
      }
      group.userData.info = g.info;
      return group;
    },
    dropIn: dropInGeo,
    /** Namen aller Bausteine (einer Art: 'tree', 'bush', 'flower', 'field', 'farm', 'animal'). */
    list: (kind) => Object.keys(DEFS).filter((n) => !kind || DEFS[n].kind === kind),
  };
}
