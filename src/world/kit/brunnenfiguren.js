// Brunnenfiguren: was obenauf oder am Rand eines Ortsbrunnens steht (der Besitzer am 27.11.2026: „Ist es möglich jeder
// Stadt ihren eigenen Brunnen zu geben? Jede Stadt sollte individuell und einzigartig werden.“). Bergmann in der
// Zechenstadt, Winzer im Weinort, Kogge in der Hansestadt, Marienfigur, Wappentiere … Welche Figur ein Ort bekommt,
// steht in brunnenpass.js; hier wird sie gebaut.
//
// Jede Figur: Ursprung auf ihrem Standfläche (Mitte, y = 0), Blick nach +z, Höhe etwa h bei Maßstab 1. Gebaut wird sie
// in ihren eigenen Farben; als Standbild färbt der Brunnen sie danach ein (fountains.js: Bronze, Gold, Stein oder
// bemalt), darum zählen hier vor allem die Helligkeiten. Stil wie die ganze Miniaturwelt: rund, weich, freundlich.
import { PAL, CITY, mix } from './citycore.js';
import { plushFigure, helmet, strawHat, flatCap, facing } from './people.js';

const TAU = Math.PI * 2;
const INK = CITY.ink;
const WHITE = 0xffffff; // Kleidung der Plüschfigur (Eimer T): wird beim Bemalen zur Gewandfarbe
const SKIN = CITY.skin[0];
const HAIR = CITY.hair[0];
const GOLD = CITY.gold;
const IRON = PAL.darkMetal;
const WOOD = CITY.wood;

const add = (a, v, s = 1) => [a[0] + v[0] * s, a[1] + v[1] * s, a[2] + v[2] * s];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const nrm = (v) => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};

// --- Zubehör ----------------------------------------------------------------------------------------------------------
/** Krone: Reif mit Zacken und Kugeln, um (x, y, z) mit Radius r. */
function crown(b, x, y, z, r, col = GOLD, n = 7) {
  const { F } = b;
  const near = b.lod === 0;
  F.lathe(x, y, z, [[r, 0], [r * 1.04, r * 0.45]], col, { seg: near ? 14 : 8, top: false, ks: [0.9, 1.05] });
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU;
    const px = x + Math.sin(a) * r * 1.02;
    const pz = z + Math.cos(a) * r * 1.02;
    F.cyl(px, y + r * 0.4, pz, r * 0.16, r * 0.04, r * 0.5, col, { seg: 4 });
    if (near) F.ball(px, y + r * 0.95, pz, r * 0.1, col, { ws: 6, hs: 3 });
  }
}

/** Vollbart unter dem Kinn (Kopf hc, Radius hr). */
function beard(b, hc, hr, col) {
  b.F.ball(hc[0], hc[1] - hr * 0.55, hc[2] + hr * 0.5, hr * 0.62, col, { ws: b.lod === 0 ? 10 : 6, hs: 5, sy: 1.15, sz: 0.75, lat: [-Math.PI / 2, 0.35] });
}

/** Mantel/Umhang am Rücken: halber Kegel von den Schultern bis fast zum Boden. */
function cape(b, P, col, len = 1) {
  const s = P.s;
  const near = b.lod === 0;
  b.F.lathe(0, P.neckY - 0.98 * s * len, -0.02 * s, [[0.34 * s, 0], [0.3 * s, 0.4 * s * len], [0.24 * s, 0.98 * s * len - 0.04 * s]], col, { seg: near ? 10 : 6, a0: Math.PI / 2 + 0.25, a1: Math.PI * 1.5 - 0.25, top: false, bottom: false, ks: [0.85, 0.95, 1] });
}

/** Etwas, das eine Hand hält: fn im Rahmen der Hand (Ursprung in der Hand). */
const inHand = (b, P, i, fn) => b.at(P.hands[i][0], P.hands[i][1], P.hands[i][2], 0, fn);

/** Weintraube: Beeren in einem hängenden Kegel. */
function grapes(b, x, y, z, s, col = 0x7b4fa0) {
  const near = b.lod === 0;
  const rows = near ? [4, 3, 3, 2, 1] : [3, 2, 1];
  let yy = y;
  rows.forEach((n, j) => {
    const r = (0.06 + 0.012 * n) * s;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + j;
      b.F.ball(x + Math.sin(a) * r * (n > 1 ? 1 : 0), yy, z + Math.cos(a) * r * (n > 1 ? 1 : 0), 0.055 * s, col, { ws: 6, hs: 4 });
    }
    yy -= 0.075 * s;
  });
  b.F.ball(x + 0.06 * s, y + 0.07 * s, z, 0.07 * s, CITY.leaf, { ws: 6, hs: 3, sy: 0.4 });
}

/** Wappenschild (Halbrundform) in der xy-Ebene, Vorderseite +z, Breite w, Mitte oben bei (0, 0). */
export function shieldPts(w, h = w * 1.2) {
  const k = h - w / 2;
  const pts = [[-w / 2, 0], [-w / 2, -k]];
  const n = 8;
  for (let i = 1; i < n; i++) {
    const a = Math.PI + (i / n) * Math.PI;
    pts.push([Math.cos(a) * w / 2, -k + Math.sin(a) * w / 2]);
  }
  pts.push([w / 2, -k], [w / 2, 0]);
  return pts;
}

// --- Menschen (Plüschfigur aus people.js als Standbild) -------------------------------------------------------------
function person(b, p, more) {
  return plushFigure(b, { skin: SKIN, hair: { style: 'short', col: HAIR }, lean: true, ...p, extra: (bb, P) => more && more(bb, P) });
}

const FIG = {};

FIG.bergmann = {
  name: 'Bergmann', h: 1.62,
  draw(b) {
    person(b, { pose: 'wave', hair: null, hat: helmet(0xf0f0e8), hatH: 0.14, pants: 0x3a3f47 }, (bb, P) => {
      const s = P.s;
      // Grubenlampe in der erhobenen Hand, Schlägel in der anderen; Arschleder hinten
      inHand(bb, P, 0, () => {
        bb.F.rod([0, 0, 0], [0, 0.12 * s, 0], 0.012 * s, IRON, { seg: 4 });
        bb.F.lathe(0, 0.02 * s, 0, [[0.05 * s, -0.17 * s], [0.07 * s, -0.12 * s], [0.06 * s, -0.03 * s], [0.03 * s, 0]], IRON, { seg: 8, bottom: true });
        bb.L.ball(0, -0.09 * s, 0, 0.045 * s, 0xffe08a, { ws: 6, hs: 4 });
      });
      inHand(bb, P, 1, () => {
        bb.F.rod([0, 0.08 * s, 0.02 * s], [0, -0.3 * s, 0.1 * s], 0.018 * s, WOOD, { seg: 5 });
        bb.F.rbox(0, -0.34 * s, 0.1 * s, 0.16 * s, 0.08 * s, 0.08 * s, 0.02 * s, IRON, { seg: 1 });
      });
      bb.G.disc(0, P.head[1] + P.hr * 0.5, P.head[2] + P.hr * 1.13, 0.05 * s, GOLD, { seg: 8 });
      bb.F.lathe(0, P.neckY - 0.66 * s, -0.04 * s, [[0.24 * s, 0], [0.24 * s, 0.26 * s]], 0x2f2a28, { seg: 8, a0: Math.PI / 2 + 0.4, a1: Math.PI * 1.5 - 0.4, top: false });
    });
  },
};

FIG.winzer = {
  name: 'Winzer', h: 1.66,
  draw(b) {
    person(b, { pose: 'wave', hat: strawHat, hatH: 0.24, pants: 0x5a5f69 }, (bb, P) => {
      const s = P.s;
      inHand(bb, P, 0, () => grapes(bb, 0, 0.02 * s, 0.02 * s, s * 1.2));
      // Kiepe (Rückentrage) mit Trauben
      bb.F.lathe(0, P.neckY - 0.55 * s, -0.3 * s, [[0.13 * s, 0], [0.2 * s, 0.42 * s], [0.18 * s, 0.44 * s]], WOOD, { seg: 8, top: false, bottom: true, ks: [0.85, 1, 0.9] });
      for (let i = 0; i < 4; i++) bb.F.ball(Math.sin(i * 1.7) * 0.08 * s, P.neckY - 0.08 * s, -0.3 * s + Math.cos(i * 1.7) * 0.08 * s, 0.07 * s, 0x7b4fa0, { ws: 6, hs: 4 });
      bb.F.lathe(0, P.neckY - 0.58 * s, 0, [[0.205 * s, -0.12 * s], [0.238 * s, 0.3 * s]], 0x4f7f4a, { seg: 8, a0: -0.95, a1: 0.95, top: false });
    });
  },
};

FIG.marktfrau = {
  name: 'Marktfrau', h: 1.6,
  draw(b) {
    person(b, { pose: 'stand', dress: true, hair: { style: 'bun', col: HAIR }, shoe: 0x5a4a42 }, (bb, P) => {
      const s = P.s;
      // Kopftuch, Korb mit Äpfeln am Arm, Schürze
      bb.F.ball(P.head[0], P.head[1] + 0.02 * s, P.head[2] - 0.02 * s, P.hr * 1.1, PAL.red, { ws: 10, hs: 3, lat: [0.15, Math.PI / 2] });
      inHand(bb, P, 1, () => {
        bb.F.lathe(0, -0.2 * s, 0.06 * s, [[0.13 * s, 0], [0.18 * s, 0.16 * s]], WOOD, { seg: 10, top: false, bottom: true });
        for (let i = 0; i < 5; i++) bb.F.ball(Math.sin(i * 1.3) * 0.08 * s, -0.03 * s, 0.06 * s + Math.cos(i * 1.3) * 0.08 * s, 0.055 * s, i % 2 ? PAL.red : 0x8cc04a, { ws: 6, hs: 4 });
        bb.F.torus(0, 0.02 * s, 0.06 * s, 0.16 * s, 0.012 * s, WOOD, { seg: 8, tube: 3, a0: -1.4, a1: 1.4 });
      });
      bb.F.lathe(0, P.neckY - 0.78 * s, 0, [[0.27 * s, 0], [0.235 * s, 0.4 * s]], WHITE, { seg: 8, a0: -0.8, a1: 0.8, top: false });
    });
  },
};

FIG.moench = {
  name: 'Mönch', h: 1.56,
  draw(b) {
    person(b, { pose: 'stand', dress: true, hair: { style: 'bald', col: HAIR }, shoe: 0x5a4a42 }, (bb, P) => {
      const s = P.s;
      // Kutte bis zum Boden, Kapuze im Nacken, Strick, Buch in der Hand
      bb.T.lathe(0, 0.03 * s, 0, [[0.27 * s, 0], [0.27 * s, 0.3 * s]], WHITE, { seg: 10, top: false });
      bb.T.ball(P.head[0], P.head[1] - 0.05 * s, P.head[2] - 0.08 * s, P.hr * 1.08, WHITE, { ws: 10, hs: 5, lat: [-0.6, 1.1], sz: 0.9 });
      bb.F.lathe(0, P.neckY - 0.6 * s, 0, [[0.235 * s, 0], [0.24 * s, 0.035 * s]], 0xe9cf8a, { seg: 10, top: false });
      inHand(bb, P, 0, () => bb.F.rbox(0, -0.02 * s, 0.07 * s, 0.17 * s, 0.22 * s, 0.06 * s, 0.015 * s, PAL.red, { seg: 1 }));
    });
  },
};

FIG.kaiser = {
  name: 'Kaiser', h: 1.72,
  draw(b) {
    person(b, { pose: 'wave', dress: true, hair: { style: 'short', col: 0xb5b0a8 }, shoe: 0x5a4a42 }, (bb, P) => {
      const s = P.s;
      crown(bb, P.head[0], P.head[1] + P.hr * 0.62, P.head[2], P.hr * 0.72);
      beard(bb, P.head, P.hr, 0xb5b0a8);
      cape(bb, P, PAL.red, 1.05);
      // Zepter in der erhobenen Hand, Reichsapfel in der anderen
      inHand(bb, P, 0, () => {
        bb.F.rod([0, -0.18 * s, 0], [0, 0.42 * s, 0], 0.02 * s, GOLD, { seg: 6 });
        bb.F.ball(0, 0.46 * s, 0, 0.05 * s, GOLD, { ws: 8, hs: 4 });
      });
      inHand(bb, P, 1, () => {
        bb.F.ball(0, 0.08 * s, 0.05 * s, 0.085 * s, GOLD, { ws: 10, hs: 6 });
        bb.F.box(0, 0.16 * s, 0.05 * s, 0.025 * s, 0.1 * s, 0.025 * s, GOLD);
        bb.F.box(0, 0.19 * s, 0.05 * s, 0.07 * s, 0.025 * s, 0.025 * s, GOLD);
      });
    });
  },
};

FIG.justitia = {
  name: 'Justitia', h: 1.7,
  draw(b) {
    person(b, { pose: 'wave', dress: true, hair: { style: 'bun', col: HAIR }, shoe: 0x5a4a42 }, (bb, P) => {
      const s = P.s;
      // Augenbinde, Waage hoch erhoben, Schwert gesenkt
      bb.F.lathe(P.head[0], P.head[1] + 0.02 * s, P.head[2], [[P.hr * 1.02, 0], [P.hr * 1.02, 0.07 * s]], WHITE, { seg: 12, top: false });
      inHand(bb, P, 0, () => {
        bb.F.rod([0, 0, 0], [0, 0.16 * s, 0], 0.012 * s, GOLD, { seg: 4 });
        bb.F.rod([-0.22 * s, 0.16 * s, 0], [0.22 * s, 0.16 * s, 0], 0.012 * s, GOLD, { seg: 4 });
        for (const k of [-1, 1]) {
          bb.F.rod([k * 0.22 * s, 0.16 * s, 0], [k * 0.22 * s, 0.02 * s, 0], 0.006 * s, GOLD, { seg: 3 });
          bb.F.lathe(k * 0.22 * s, -0.02 * s, 0, [[0.02 * s, 0], [0.09 * s, 0.04 * s]], GOLD, { seg: 10, top: false, bottom: true });
        }
      });
      inHand(bb, P, 1, () => {
        bb.F.box(0, -0.48 * s, 0.05 * s, 0.035 * s, 0.5 * s, 0.012 * s, 0xd8dde2);
        bb.F.box(0, -0.2 * s, 0.05 * s, 0.16 * s, 0.03 * s, 0.03 * s, GOLD);
        bb.F.rod([0, -0.19 * s, 0.05 * s], [0, 0.02 * s, 0.05 * s], 0.018 * s, GOLD, { seg: 5 });
      });
    });
  },
};

FIG.neptun = {
  name: 'Neptun', h: 1.75,
  draw(b) {
    person(b, { pose: 'wave', hair: { style: 'curly', col: 0xb5b0a8 }, pants: 0x4f7f8a }, (bb, P) => {
      const s = P.s;
      crown(bb, P.head[0], P.head[1] + P.hr * 0.7, P.head[2], P.hr * 0.7, GOLD, 5);
      beard(bb, P.head, P.hr, 0xb5b0a8);
      // Dreizack, lang und senkrecht
      inHand(bb, P, 0, () => {
        bb.F.rod([0, -1.2 * s, 0], [0, 0.5 * s, 0], 0.02 * s, GOLD, { seg: 6 });
        bb.F.rod([-0.1 * s, 0.5 * s, 0], [0.1 * s, 0.5 * s, 0], 0.016 * s, GOLD, { seg: 4 });
        for (const k of [-1, 0, 1]) bb.F.cyl(k * 0.1 * s, 0.5 * s, 0, 0.022 * s, 0.002 * s, 0.18 * s, GOLD, { seg: 4 });
      });
      // ein Fisch zu seinen Füßen
      bb.F.ball(-0.24 * s, 0.1 * s, 0.18 * s, 0.1 * s, 0x5fbfb0, { ws: 8, hs: 5, sz: 1.8 });
    });
  },
};

FIG.ritter = {
  name: 'Ritter', h: 1.74,
  draw(b) {
    person(b, { pose: 'wave', hair: null, pants: 0x9aa3ad, shoe: 0x7a8088 }, (bb, P) => {
      const s = P.s;
      const steel = 0xc8cdd2;
      // Helm mit Sehschlitz und Federbusch, Schwert erhoben, Schild am Arm
      bb.F.ball(P.head[0], P.head[1] + 0.02 * s, P.head[2], P.hr * 1.08, steel, { ws: 12, hs: 6, lat: [-0.1, Math.PI / 2] });
      bb.F.box(P.head[0], P.head[1] + 0.04 * s, P.head[2] + P.hr * 1.0, P.hr * 1.2, 0.03 * s, 0.03 * s, INK);
      bb.F.ball(P.head[0], P.head[1] + P.hr * 1.15, P.head[2] - 0.04 * s, 0.09 * s, PAL.red, { ws: 8, hs: 5, sy: 1.6, sz: 1.4 });
      inHand(bb, P, 0, () => {
        bb.F.box(0, 0.36 * s, 0, 0.04 * s, 0.6 * s, 0.014 * s, 0xd8dde2);
        bb.F.box(0, 0.05 * s, 0, 0.2 * s, 0.03 * s, 0.035 * s, GOLD);
        bb.F.rod([0, -0.08 * s, 0], [0, 0.05 * s, 0], 0.02 * s, WOOD, { seg: 5 });
      });
      const h = P.hands[1];
      bb.at(h[0] - 0.04 * s, h[1] + 0.22 * s, h[2] + 0.12 * s, -0.25, () => bb.F.extrude(shieldPts(0.34 * s, 0.42 * s), 0, 0.03 * s, PAL.red));
    });
  },
};

FIG.fischer = {
  name: 'Fischer', h: 1.62,
  draw(b) {
    person(b, { pose: 'wave', hair: null, pants: 0x4f6f9a, hat: (bb, c, r, s) => {
      bb.F.ball(c[0], c[1] + r * 0.12, c[2] - 0.02 * s, r * 1.12, 0xf2c230, { ws: 10, hs: 3, lat: [0.15, Math.PI / 2] });
      bb.F.lathe(c[0], c[1] + r * 0.18, c[2] - 0.04 * s, [[r * 1.12, 0], [r * 1.55, -0.07 * s]], 0xf2c230, { seg: 12, top: false, bottom: false, sz: 1.15 });
    }, hatH: 0.1 }, (bb, P) => {
      const s = P.s;
      beard(bb, P.head, P.hr, HAIR);
      // ein großer Fisch am Schwanz hochgehalten
      inHand(bb, P, 0, () => {
        bb.F.ball(0, -0.2 * s, 0.04 * s, 0.09 * s, 0x8fb3c4, { ws: 10, hs: 6, sy: 2.6, sz: 0.6 });
        bb.F.cyl(0, -0.02 * s, 0.04 * s, 0.01 * s, 0.07 * s, 0.07 * s, 0x8fb3c4, { seg: 4 });
      });
      // Netz über der Schulter
      bb.F.ball(-0.22 * s, P.neckY - 0.15 * s, -0.12 * s, 0.16 * s, 0xd9c79a, { ws: 8, hs: 4, sy: 1.3, sz: 0.7 });
    });
  },
};

FIG.bauer = {
  name: 'Bauer', h: 1.66,
  draw(b) {
    person(b, { pose: 'stand', hat: strawHat, hatH: 0.24, pants: 0x4f6f9a }, (bb, P) => {
      const s = P.s;
      // Garbe im Arm, Sense geschultert
      const h = P.hands[1];
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * TAU;
        bb.F.rod([h[0] + Math.sin(a) * 0.03 * s, h[1] - 0.25 * s, h[2] + 0.06 * s + Math.cos(a) * 0.03 * s], [h[0] + Math.sin(a) * 0.08 * s, h[1] + 0.3 * s, h[2] + 0.06 * s + Math.cos(a) * 0.08 * s], 0.012 * s, 0xe9c060, { seg: 3 });
      }
      bb.F.ball(h[0], h[1] + 0.32 * s, h[2] + 0.06 * s, 0.1 * s, 0xe9c060, { ws: 8, hs: 4, sy: 1.3 });
      inHand(bb, P, 0, () => {
        bb.F.rod([0, -0.4 * s, 0], [0, 0.75 * s, -0.05 * s], 0.016 * s, WOOD, { seg: 5 });
        bb.F.extrude([[0, 0], [0.4 * s, -0.05 * s], [0.42 * s, -0.08 * s], [0, -0.06 * s]], -0.005 * s, 0.005 * s, 0xd8dde2, {});
      });
    });
  },
};

FIG.nymphe = {
  name: 'Nymphe', h: 1.86,
  draw(b) {
    person(b, { pose: 'cheer', dress: true, hair: { style: 'pony', col: HAIR }, shoe: SKIN }, (bb, P) => {
      const s = P.s;
      // Schale hoch über dem Kopf (aus ihr fließt das Wasser), langer Zopf
      const m = [(P.hands[0][0] + P.hands[1][0]) / 2, Math.max(P.hands[0][1], P.hands[1][1]) + 0.04 * s, (P.hands[0][2] + P.hands[1][2]) / 2];
      bb.F.lathe(m[0], m[1], m[2], [[0.05 * s, 0], [0.26 * s, 0.1 * s], [0.27 * s, 0.13 * s], [0.22 * s, 0.11 * s]], 0xe8e2d6, { seg: 14, top: false, bottom: true, ks: [0.85, 1, 1.05, 0.9] });
      bb.F.rod([0, P.head[1], P.head[2] - P.hr], [0, P.head[1] - 0.45 * s, P.head[2] - P.hr * 0.9], 0.05 * s, HAIR, { seg: 6, r1: 0.025 * s, caps: true });
      bb.T.lathe(0, 0.03 * s, 0, [[0.27 * s, 0], [0.27 * s, 0.3 * s]], WHITE, { seg: 10, top: false });
    });
  },
};

FIG.narr = {
  name: 'Narr', h: 1.82,
  draw(b) {
    person(b, { pose: 'wave', hair: null, pants: 0x3f8fd0, hat: (bb, c, r, s) => {
      // Narrenkappe: zwei Zipfel mit Schellen
      bb.F.ball(c[0], c[1] + r * 0.1, c[2], r * 1.1, PAL.red, { ws: 10, hs: 3, lat: [0.1, Math.PI / 2] });
      for (const k of [-1, 1]) {
        const tip = [c[0] + k * r * 1.4, c[1] + r * 1.25, c[2] - 0.02 * s];
        bb.F.rod([c[0] + k * r * 0.4, c[1] + r * 0.9, c[2]], tip, 0.1 * s, k < 0 ? PAL.red : 0xf2c230, { seg: 6, r1: 0.025 * s });
        bb.F.ball(tip[0], tip[1] - 0.04 * s, tip[2], 0.045 * s, GOLD, { ws: 6, hs: 4 });
      }
    }, hatH: 0.3 }, (bb, P) => {
      const s = P.s;
      // Spiegel hoch erhoben, Eule auf der Schulter
      inHand(bb, P, 0, () => {
        bb.F.rod([0, 0, 0], [0, 0.12 * s, 0], 0.015 * s, WOOD, { seg: 4 });
        bb.F.cyl(0, 0.12 * s, 0, 0.1 * s, 0.1 * s, 0.02 * s, GOLD, { seg: 12 });
        facing(bb, [0, 0.22 * s, 0.012 * s], [0, 0, 1], () => bb.G.disc(0, 0, 0, 0.085 * s, 0xc8e4f0, { seg: 12 }));
      });
      const sh = P.shoulders[1];
      owl(bb, sh[0] - 0.02 * s, sh[1] + 0.05 * s, sh[2] - 0.02 * s, 0.55 * s);
    });
  },
};

FIG.rotkaeppchen = {
  name: 'Rotkäppchen', h: 1.36,
  draw(b) {
    person(b, { s: 0.82, pose: 'stand', dress: true, hair: { style: 'pony', col: 0xc9a24e }, shoe: 0x5a4a42 }, (bb, P) => {
      const s = P.s;
      // rote Kapuze mit Umhang, Korb mit Kuchen und Wein
      bb.F.ball(P.head[0], P.head[1] + 0.01 * s, P.head[2] - 0.03 * s, P.hr * 1.12, PAL.red, { ws: 12, hs: 5, lat: [-0.5, Math.PI / 2], sz: 0.95 });
      cape(bb, P, PAL.red, 0.75);
      inHand(bb, P, 1, () => {
        bb.F.lathe(0, -0.18 * s, 0.07 * s, [[0.11 * s, 0], [0.15 * s, 0.14 * s]], WOOD, { seg: 10, top: false, bottom: true });
        bb.F.box(0, -0.04 * s, 0.07 * s, 0.22 * s, 0.03 * s, 0.2 * s, WHITE);
        bb.F.rod([0.04 * s, -0.04 * s, 0.07 * s], [0.06 * s, 0.1 * s, 0.07 * s], 0.025 * s, 0x4f7f4a, { seg: 5, caps: true });
        bb.F.torus(0, 0.02 * s, 0.07 * s, 0.14 * s, 0.01 * s, WOOD, { seg: 8, tube: 3, a0: -1.4, a1: 1.4 });
      });
    });
  },
};

FIG.herkules = {
  name: 'Herkules', h: 1.9,
  draw(b) {
    person(b, { s: 1.12, pose: 'stand', hair: { style: 'curly', col: HAIR }, pants: 0x9a6a44 }, (bb, P) => {
      const s = P.s;
      beard(bb, P.head, P.hr, HAIR);
      // Löwenfell über den Schultern, Keule aufgestützt
      bb.F.ball(0, P.neckY - 0.06 * s, -0.03 * s, 0.26 * s, 0xc9a24e, { ws: 10, hs: 5, sy: 0.6, lat: [-0.2, Math.PI / 2] });
      inHand(bb, P, 0, () => bb.F.rod([0, 0.02 * s, 0.02 * s], [0.04 * s, -0.5 * s, 0.1 * s], 0.035 * s, WOOD, { seg: 7, r1: 0.075 * s, caps: true }));
    });
  },
};

FIG.heinzel = {
  name: 'Heinzelmännchen', h: 1.22,
  draw(b) {
    person(b, { s: 0.7, pose: 'wave', hair: null, pants: 0x4f7f4a, hat: (bb, c, r, s) => {
      bb.F.lathe(c[0], c[1] + r * 0.25, c[2] - 0.02 * s, [[r * 1.08, 0], [r * 0.7, r * 0.9], [0.01 * s, r * 2.0]], PAL.red, { seg: 10, ks: [0.9, 1, 1.05] });
    }, hatH: 0.55 }, (bb, P) => {
      const s = P.s;
      beard(bb, P.head, P.hr * 1.3, 0xf2f0ea);
      inHand(bb, P, 0, () => {
        bb.F.rod([0, -0.05 * s, 0], [0, 0.28 * s, 0], 0.02 * s, WOOD, { seg: 5 });
        bb.F.rbox(0, 0.3 * s, 0, 0.2 * s, 0.08 * s, 0.08 * s, 0.02 * s, IRON, { seg: 1 });
      });
    });
  },
};

FIG.engel = {
  name: 'Engel', h: 1.18,
  draw(b) {
    person(b, { s: 0.68, pose: 'cheer', hair: { style: 'curly', col: 0xc9a24e }, dress: true, shoe: SKIN }, (bb, P) => {
      const s = P.s;
      // Flügel und Heiligenschein; in den Händen ein Fisch, der Wasser spuckt
      for (const k of [-1, 1]) {
        bb.xf([k * 0.12 * s, P.neckY - 0.12 * s, -0.16 * s], [0.3, k * 0.5, k * 0.35], 1, () => bb.F.ball(0, 0.12 * s, 0, 0.22 * s, 0xfaf7f0, { ws: 8, hs: 5, sx: 0.55, sz: 0.18 }));
      }
      bb.F.torus(P.head[0], P.head[1] + P.hr * 1.25, P.head[2] - 0.02 * s, P.hr * 0.6, 0.02 * s, GOLD, { seg: 12, tube: 4 });
      const m = [(P.hands[0][0] + P.hands[1][0]) / 2, (P.hands[0][1] + P.hands[1][1]) / 2, (P.hands[0][2] + P.hands[1][2]) / 2];
      bb.F.ball(m[0], m[1] + 0.05 * s, m[2], 0.08 * s, 0x5fbfb0, { ws: 8, hs: 5, sy: 2.2 });
    });
  },
};

FIG.madonna = {
  name: 'Maria', h: 1.72,
  draw(b) {
    person(b, { pose: 'stand', dress: true, hair: { style: 'bob', col: HAIR }, shoe: SKIN }, (bb, P) => {
      const s = P.s;
      // Schleier und Mantel in Blau, Sternenkranz, langes Gewand
      bb.F.ball(P.head[0], P.head[1] + 0.02 * s, P.head[2] - 0.03 * s, P.hr * 1.12, 0x3f6fb8, { ws: 12, hs: 5, lat: [-0.7, Math.PI / 2], sz: 0.95 });
      cape(bb, P, 0x3f6fb8, 1.05);
      bb.T.lathe(0, 0.03 * s, 0, [[0.27 * s, 0], [0.27 * s, 0.3 * s]], WHITE, { seg: 10, top: false });
      const n = b.lod === 0 ? 8 : 0;
      for (let i = 0; i < n; i++) {
        const a = (i / (n - 1)) * Math.PI * 1.2 - Math.PI * 0.6;
        bb.F.ball(P.head[0] + Math.sin(a) * P.hr * 1.45, P.head[1] + Math.cos(a) * P.hr * 1.45, P.head[2] - 0.04 * s, 0.035 * s, GOLD, { ws: 5, hs: 3 });
      }
      // Hände wie zum Gebet vor der Brust
      bb.F.ball(0, P.neckY - 0.28 * s, 0.24 * s, 0.075 * s, SKIN, { ws: 8, hs: 4, sy: 1.4 });
    });
  },
};

FIG.gelehrter = {
  name: 'Gelehrter', h: 1.7,
  draw(b) {
    person(b, { pose: 'stand', dress: true, hair: { style: 'short', col: 0xb5b0a8 }, shoe: 0x3a3f47, hat: (bb, c, r, s) => {
      // Doktorhut: Kappe mit flacher Platte und Quaste
      bb.F.ball(c[0], c[1] + r * 0.2, c[2], r * 1.04, INK, { ws: 10, hs: 3, lat: [0.3, Math.PI / 2] });
      bb.F.box(c[0], c[1] + r * 1.08, c[2], r * 1.9, 0.03 * s, r * 1.9, INK);
      bb.F.rod([c[0] + r * 0.9, c[1] + r * 1.1, c[2] + r * 0.9], [c[0] + r * 0.95, c[1] + r * 0.6, c[2] + r * 0.95], 0.012 * s, GOLD, { seg: 3 });
    }, hatH: 0.12 }, (bb, P) => {
      const s = P.s;
      // Talar und aufgeschlagenes Buch
      bb.T.lathe(0, 0.03 * s, 0, [[0.27 * s, 0], [0.27 * s, 0.3 * s]], WHITE, { seg: 10, top: false });
      const m = [(P.hands[0][0] + P.hands[1][0]) / 2, (P.hands[0][1] + P.hands[1][1]) / 2, P.hands[0][2] + 0.12 * s];
      for (const k of [-1, 1]) bb.xf([m[0] + k * 0.08 * s, m[1] + 0.18 * s, m[2]], [-0.5, k * 0.3, 0], 1, () => bb.F.box(0, 0, 0, 0.15 * s, 0.015 * s, 0.2 * s, 0xf6f2e8));
    });
  },
};

FIG.schmied = {
  name: 'Schmied', h: 1.62,
  draw(b) {
    person(b, { pose: 'wave', hair: { style: 'short', col: HAIR }, pants: 0x5a5f69 }, (bb, P) => {
      const s = P.s;
      beard(bb, P.head, P.hr, HAIR);
      // Lederschürze, Hammer erhoben, Amboss neben ihm
      bb.F.lathe(0, P.neckY - 0.88 * s, 0, [[0.27 * s, 0], [0.235 * s, 0.6 * s], [0.18 * s, 0.82 * s]], 0x8a5a3c, { seg: 8, a0: -0.85, a1: 0.85, top: false });
      inHand(bb, P, 0, () => {
        bb.F.rod([0, -0.06 * s, 0], [0, 0.28 * s, -0.04 * s], 0.02 * s, WOOD, { seg: 5 });
        bb.F.rbox(0, 0.28 * s, -0.04 * s, 0.1 * s, 0.1 * s, 0.22 * s, 0.02 * s, IRON, { seg: 1 });
      });
      bb.F.frust(-0.42 * s, 0, 0.12 * s, 0.18 * s, 0.18 * s, 0.1 * s, 0.1 * s, 0.24 * s, IRON, {});
      bb.F.rbox(-0.42 * s, 0.24 * s, 0.12 * s, 0.38 * s, 0.12 * s, 0.14 * s, 0.03 * s, IRON, { seg: 1 });
    });
  },
};

FIG.waescherin = {
  name: 'Wäscherin', h: 1.66,
  draw(b) {
    person(b, { pose: 'cheer', dress: true, hair: { style: 'bun', col: 0x8a4a2a }, shoe: 0x5a4a42 }, (bb, P) => {
      const s = P.s;
      // Wäschekorb auf dem Kopf, mit beiden Händen gehalten
      const y = P.head[1] + P.hr * 0.95;
      bb.F.lathe(0, y, P.head[2], [[0.17 * s, 0], [0.22 * s, 0.14 * s]], WOOD, { seg: 12, top: false, bottom: true });
      for (let i = 0; i < 4; i++) bb.F.ball(Math.sin(i * 1.6) * 0.09 * s, y + 0.15 * s, P.head[2] + Math.cos(i * 1.6) * 0.09 * s, 0.09 * s, [0xfaf7f0, 0x9ec9e0, 0xf4a6c0, 0xfaf7f0][i], { ws: 6, hs: 3, sy: 0.6 });
      bb.F.lathe(0, P.neckY - 0.78 * s, 0, [[0.27 * s, 0], [0.235 * s, 0.4 * s]], 0xfaf7f0, { seg: 8, a0: -0.8, a1: 0.8, top: false });
    });
  },
};

// --- Tiere ------------------------------------------------------------------------------------------------------------
/** Augen auf einer Kugel (Mitte c, Radius r), in Richtung d (normiert), Abstand sep. */
function eyes(b, c, r, d, sep, er) {
  for (const k of [-1, 1]) {
    const dir = nrm([d[0] + k * sep, d[1] + 0.25, d[2]]);
    facing(b, add(c, dir, r * 0.98), dir, () => {
      b.G.disc(0, 0, 0.003, er, INK, { seg: 8 });
      b.G.disc(-er * 0.3, er * 0.35, 0.006, er * 0.32, PAL.frame, { seg: 4, flat: true });
    });
  }
}

function owl(b, x, y, z, s) {
  const { F } = b;
  const col = 0x9a7a5a;
  F.ball(x, y + 0.14 * s, z, 0.13 * s, col, { ws: 8, hs: 5, sy: 1.25 });
  F.ball(x, y + 0.32 * s, z + 0.01 * s, 0.1 * s, col, { ws: 8, hs: 5 });
  for (const k of [-1, 1]) {
    F.ball(x + k * 0.045 * s, y + 0.34 * s, z + 0.08 * s, 0.04 * s, 0xf2e8d0, { ws: 6, hs: 3 });
    F.ball(x + k * 0.045 * s, y + 0.345 * s, z + 0.11 * s, 0.018 * s, INK, { ws: 5, hs: 3 });
    F.cyl(x + k * 0.06 * s, y + 0.4 * s, z, 0.02 * s, 0.003 * s, 0.05 * s, col, { seg: 3 });
  }
}

FIG.baer = {
  name: 'Bär', h: 0.95,
  draw(b) {
    const { F } = b;
    const col = 0x9a6a44;
    const lo = b.lod > 0;
    const ws = lo ? 6 : 12;
    F.ball(0, 0.3, 0, 0.3, col, { ws, hs: 8, sy: 1.05 });
    F.ball(0, 0.72, 0.02, 0.22, col, { ws, hs: 8 });
    for (const k of [-1, 1]) {
      F.ball(k * 0.16, 0.92, 0, 0.08, col, { ws: 8, hs: 5 });
      F.ball(k * 0.25, 0.4, 0.14, 0.1, col, { ws: 8, hs: 5 });
      F.ball(k * 0.17, 0.1, 0.26, 0.11, col, { ws: 8, hs: 5 });
    }
    F.ball(0, 0.68, 0.19, 0.09, mix(col, 0xffffff, 0.45), { ws: 8, hs: 5 });
    F.ball(0, 0.71, 0.27, 0.03, INK, { ws: 6, hs: 4 });
    if (!lo) eyes(b, [0, 0.72, 0.02], 0.22, [0, 0.15, 1], 0.38, 0.025);
  },
};

FIG.loewe = {
  name: 'Löwe', h: 1.15,
  draw(b) {
    const { F } = b;
    const col = 0xe0b060;
    const mane = 0xb5703a;
    const ws = b.lod > 0 ? 6 : 12;
    // sitzend, das Wappenschild zwischen den Vorderpranken
    F.ball(0, 0.32, -0.08, 0.3, col, { ws, hs: 7, sy: 1.15 });
    F.ball(0, 0.78, 0.04, 0.26, mane, { ws, hs: 7 });
    F.ball(0, 0.78, 0.13, 0.18, col, { ws, hs: 6 });
    F.ball(0, 0.72, 0.28, 0.09, mix(col, 0xffffff, 0.4), { ws: 8, hs: 5, sx: 1.2 });
    F.ball(0, 0.76, 0.35, 0.035, INK, { ws: 6, hs: 4 });
    for (const k of [-1, 1]) {
      F.ball(k * 0.15, 0.95, 0.06, 0.07, col, { ws: 8, hs: 4 });
      F.rod([k * 0.14, 0.5, 0.12], [k * 0.13, 0.08, 0.24], 0.07, col, { seg: 7, caps: true });
      F.ball(k * 0.13, 0.06, 0.28, 0.085, col, { ws: 8, hs: 4, sz: 1.3 });
      F.ball(k * 0.22, 0.12, -0.12, 0.13, col, { ws: 8, hs: 5, sz: 1.3 });
    }
    if (b.lod === 0) eyes(b, [0, 0.78, 0.13], 0.18, [0, 0.2, 1], 0.4, 0.022);
    F.rod([0.2, 0.1, -0.3], [0.38, 0.05, -0.05], 0.025, col, { seg: 5 });
    F.ball(0.4, 0.06, -0.02, 0.05, mane, { ws: 6, hs: 4 });
    b.at(0, 0.62, 0.36, 0, () => F.extrude(shieldPts(0.3, 0.38), 0, 0.03, PAL.red));
  },
};

FIG.adler = {
  name: 'Adler', h: 1.0,
  draw(b) {
    const { F } = b;
    const col = 0x6a5a4a;
    const ws = b.lod > 0 ? 6 : 12;
    // auf einer Kugel, die Flügel ausgebreitet
    F.ball(0, 0.16, 0, 0.16, GOLD, { ws, hs: 7 });
    F.ball(0, 0.46, 0, 0.17, col, { ws, hs: 7, sy: 1.35 });
    F.ball(0, 0.74, 0.05, 0.11, 0xf6f2e8, { ws, hs: 6 });
    F.cyl(0, 0.72, 0.15, 0.04, 0.012, 0.08, 0xf2c230, { seg: 6 });
    if (b.lod === 0) eyes(b, [0, 0.74, 0.05], 0.11, [0, 0.1, 1], 0.5, 0.016);
    for (const k of [-1, 1]) {
      b.xf([k * 0.14, 0.56, -0.02], [0, 0, k * -0.5], 1, () => {
        F.extrude([[0, -0.08], [k * 0.42, 0.12], [k * 0.5, 0.26], [k * 0.36, 0.2], [k * 0.3, 0.26], [k * 0.18, 0.12], [0, 0.1]].map(([x, y]) => [x, y]), -0.025, 0.025, col, {});
      });
    }
    F.extrude([[-0.08, 0.3], [0.08, 0.3], [0.12, 0.16], [-0.12, 0.16]], -0.14, -0.1, col, {});
  },
};

FIG.pferd = {
  name: 'Pferd', h: 1.2,
  draw(b) {
    const { F } = b;
    const col = 0xc8a07a;
    const dark = 0x6a4a34;
    const ws = b.lod > 0 ? 6 : 12;
    // seitlich stehend (Kopf nach +x), damit man es von vorn als Pferd erkennt; dreht der Brunnen es leicht
    F.ball(0, 0.66, 0, 0.2, col, { ws, hs: 7, sx: 1.9 });
    for (const [x, z] of [[0.24, 0.09], [0.24, -0.09], [-0.26, 0.09], [-0.26, -0.09]]) {
      F.rod([x, 0.62, z], [x, 0.06, z], 0.05, col, { seg: 7, r1: 0.04 });
      F.cyl(x, 0, z, 0.05, 0.05, 0.06, dark, { seg: 7 });
    }
    F.rod([0.3, 0.7, 0], [0.48, 1.0, 0], 0.11, col, { seg: 8, r1: 0.09 });
    F.ball(0.56, 1.02, 0, 0.11, col, { ws, hs: 6, sx: 1.6 });
    F.ball(0.68, 0.99, 0, 0.07, mix(col, 0xffffff, 0.3), { ws: 8, hs: 4 });
    F.rod([0.36, 0.86, 0], [0.5, 1.12, 0], 0.05, dark, { seg: 5, r1: 0.03 });
    for (const k of [-1, 1]) F.cyl(0.52, 1.1, k * 0.05, 0.025, 0.005, 0.08, col, { seg: 4 });
    F.rod([-0.36, 0.72, 0], [-0.46, 0.38, 0], 0.045, dark, { seg: 6, r1: 0.025 });
    if (b.lod === 0) eyes(b, [0.56, 1.02, 0], 0.11, [0.5, 0.2, 0.85], 0, 0.018);
  },
};

FIG.hirsch = {
  name: 'Hirsch', h: 1.5,
  draw(b) {
    const { F } = b;
    const col = 0xa87a52;
    const ant = 0xe8dcc4;
    const ws = b.lod > 0 ? 6 : 12;
    // liegend, Kopf hoch mit großem Geweih
    F.ball(0, 0.28, -0.05, 0.24, col, { ws, hs: 7, sz: 1.6 });
    F.rod([0, 0.36, 0.22], [0, 0.72, 0.3], 0.09, col, { seg: 8, r1: 0.07 });
    F.ball(0, 0.78, 0.33, 0.1, col, { ws, hs: 6, sz: 1.5 });
    F.ball(0, 0.75, 0.47, 0.045, INK, { ws: 6, hs: 4 });
    for (const [x, z] of [[0.14, 0.24], [-0.14, 0.24]]) F.rod([x, 0.12, z], [x, 0.04, z + 0.2], 0.045, col, { seg: 6, caps: true });
    for (const k of [-1, 1]) {
      F.ball(k * 0.1, 0.86, 0.3, 0.05, col, { ws: 6, hs: 3, sx: 1.6, sy: 0.6 });
      const base = [k * 0.05, 0.86, 0.3];
      const t1 = [k * 0.3, 1.3, 0.24];
      F.rod(base, t1, 0.022, ant, { seg: 5, r1: 0.014 });
      for (const [f, d] of [[0.3, [0.06, 0.14, 0.08]], [0.6, [0.12, 0.16, 0.02]], [0.85, [-0.06, 0.2, 0.02]]]) {
        const p = add(base, sub(t1, base), f);
        F.rod(p, add(p, [k * d[0], d[1], d[2]]), 0.013, ant, { seg: 4, r1: 0.006 });
      }
    }
    if (b.lod === 0) eyes(b, [0, 0.78, 0.33], 0.1, [0, 0, 1], 0.6, 0.016);
  },
};

FIG.hahn = {
  name: 'Hahn', h: 1.05,
  draw(b) {
    const { F } = b;
    const ws = b.lod > 0 ? 6 : 12;
    const col = 0xb5523b;
    F.ball(0, 0.42, -0.04, 0.22, col, { ws, hs: 7, sz: 1.3 });
    F.ball(0, 0.72, 0.1, 0.12, col, { ws, hs: 6 });
    // Kamm, Kehllappen, Schnabel
    for (let i = 0; i < 3; i++) F.ball(0, 0.84 + (i === 1 ? 0.03 : 0), 0.06 + i * 0.05, 0.045, PAL.red, { ws: 6, hs: 4, sx: 0.5 });
    F.ball(0, 0.62, 0.18, 0.04, PAL.red, { ws: 6, hs: 4, sy: 1.5, sx: 0.6 });
    F.cyl(0, 0.71, 0.21, 0.035, 0.005, 0.08, 0xf2c230, { seg: 5 });
    // Schwanzfedern im Bogen
    for (let i = 0; i < 5; i++) {
      const a = -0.6 + i * 0.32;
      F.rod([0, 0.48, -0.26], [Math.sin(a) * 0.08, 0.48 + Math.cos(a) * 0.34, -0.36 - Math.cos(a) * 0.12], 0.035, [0x2f5f4a, 0x3a3f47, 0xb5523b][i % 3], { seg: 5, r1: 0.012 });
    }
    for (const k of [-1, 1]) {
      F.rod([k * 0.08, 0.24, 0], [k * 0.08, 0.02, 0.02], 0.022, 0xf2c230, { seg: 5 });
      F.ball(k * 0.16, 0.44, -0.04, 0.1, mix(col, INK, 0.3), { ws: 8, hs: 4, sz: 1.5, sx: 0.4 });
    }
    if (b.lod === 0) eyes(b, [0, 0.72, 0.1], 0.12, [0, 0.1, 1], 0.7, 0.016);
  },
};

FIG.fisch = {
  name: 'Fisch', h: 1.0,
  draw(b) {
    const { F } = b;
    const col = 0xf08a2c;
    const ws = b.lod > 0 ? 6 : 12;
    // springt senkrecht aus Wellen
    F.ball(0, 0.12, 0, 0.18, 0x7cc8ec, { ws, hs: 4, sy: 0.45 });
    F.ball(0, 0.52, 0.04, 0.17, col, { ws, hs: 8, sy: 2.0, sx: 0.75 });
    F.extrude([[0, 0], [0.18, -0.16], [0.16, 0.02], [0, 0.08], [-0.16, 0.02], [-0.18, -0.16]], -0.025, 0.025, col, {});
    F.ball(0, 0.88, 0.1, 0.07, mix(col, INK, 0.4), { ws: 8, hs: 4, sz: 0.5 });
    for (const k of [-1, 1]) F.ball(k * 0.12, 0.56, 0.04, 0.07, mix(col, 0xffffff, 0.2), { ws: 6, hs: 3, sx: 0.4, sy: 1.6 });
    if (b.lod === 0) eyes(b, [0, 0.76, 0.04], 0.13, [0, 0.1, 1], 0.9, 0.022);
  },
};

FIG.storch = {
  name: 'Storch', h: 1.3,
  draw(b) {
    const { F } = b;
    const ws = b.lod > 0 ? 6 : 12;
    // auf einem Bein im Nest
    F.lathe(0, 0, 0, [[0.18, 0], [0.3, 0.1], [0.26, 0.14]], 0x9a7a5a, { seg: 12, top: false, bottom: true });
    F.rod([0.04, 0.12, 0], [0.04, 0.6, 0], 0.016, PAL.red, { seg: 4 });
    F.rod([-0.04, 0.6, 0], [-0.14, 0.42, 0.04], 0.016, PAL.red, { seg: 4 });
    F.rod([-0.14, 0.42, 0.04], [-0.04, 0.34, 0.04], 0.016, PAL.red, { seg: 4 });
    F.ball(0, 0.74, -0.02, 0.17, 0xfaf7f0, { ws, hs: 7, sz: 1.5 });
    for (const k of [-1, 1]) F.ball(k * 0.11, 0.76, -0.08, 0.1, INK, { ws: 8, hs: 4, sz: 2.0, sx: 0.35 });
    F.rod([0, 0.82, 0.14], [0, 1.12, 0.12], 0.05, 0xfaf7f0, { seg: 6, r1: 0.04 });
    F.ball(0, 1.16, 0.12, 0.07, 0xfaf7f0, { ws: 8, hs: 5 });
    F.cyl(0, 1.12, 0.17, 0.025, 0.003, 0.26, PAL.red, { seg: 5 });
    if (b.lod === 0) eyes(b, [0, 1.16, 0.12], 0.07, [0, 0, 1], 0.8, 0.012);
  },
};

FIG.ochse = {
  name: 'Ochse', h: 0.95,
  draw(b) {
    const { F } = b;
    const col = 0xb07a52;
    const ws = b.lod > 0 ? 6 : 12;
    // liegend, schaut nach vorn, mit Hörnern
    F.ball(0, 0.3, -0.12, 0.3, col, { ws, hs: 7, sz: 1.5 });
    F.ball(0, 0.56, 0.3, 0.17, col, { ws, hs: 6, sy: 1.05 });
    F.ball(0, 0.48, 0.44, 0.1, 0xe8b4a4, { ws: 8, hs: 5, sx: 1.4 });
    for (const k of [-1, 1]) {
      F.rod([k * 0.12, 0.66, 0.3], [k * 0.3, 0.86, 0.28], 0.04, 0xf2efe6, { seg: 6, r1: 0.012 });
      F.ball(k * 0.18, 0.6, 0.26, 0.05, col, { ws: 6, hs: 3, sx: 1.6, sy: 0.5 });
      F.rod([k * 0.18, 0.12, 0.2], [k * 0.18, 0.05, 0.42], 0.06, col, { seg: 6, caps: true });
      F.ball(k * 0.04, 0.47, 0.53, 0.018, INK, { ws: 5, hs: 3 });
    }
    if (b.lod === 0) eyes(b, [0, 0.56, 0.3], 0.17, [0, 0.1, 1], 0.5, 0.02);
  },
};

FIG.gans = {
  name: 'Gans', h: 0.9,
  draw(b) {
    const { F } = b;
    const ws = b.lod > 0 ? 6 : 12;
    F.ball(0, 0.32, -0.06, 0.24, 0xfaf7f0, { ws, hs: 7, sz: 1.45 });
    F.rod([0, 0.44, 0.18], [0, 0.78, 0.22], 0.06, 0xfaf7f0, { seg: 7, r1: 0.05 });
    F.ball(0, 0.82, 0.24, 0.08, 0xfaf7f0, { ws, hs: 6 });
    F.cyl(0, 0.8, 0.31, 0.03, 0.006, 0.12, 0xf08a2c, { seg: 5 });
    for (const k of [-1, 1]) F.rod([k * 0.07, 0.14, 0.02], [k * 0.08, 0.0, 0.06], 0.02, 0xf08a2c, { seg: 4 });
    if (b.lod === 0) eyes(b, [0, 0.82, 0.24], 0.08, [0, 0, 1], 0.9, 0.013);
  },
};

// --- Dinge ------------------------------------------------------------------------------------------------------------
FIG.anker = {
  name: 'Anker', h: 1.1,
  draw(b) {
    const { F } = b;
    const col = 0x5a5f69;
    F.rod([0, 0.1, 0], [0, 0.96, 0], 0.045, col, { seg: 8 });
    F.torus(0, 1.02, 0, 0.07, 0.02, col, { seg: 10, tube: 4 });
    F.rod([-0.22, 0.86, 0], [0.22, 0.86, 0], 0.035, col, { seg: 6, caps: true });
    b.xf([0, 0.36, 0], [Math.PI / 2, 0, 0], 1, () => F.torus(0, 0, 0, 0.3, 0.04, col, { seg: 12, tube: 5, a0: -Math.PI / 2 + 0.25, a1: Math.PI / 2 - 0.25 }));
    for (const k of [-1, 1]) F.cyl(k * 0.29, 0.34, 0, 0.07, 0.01, 0.16, col, { seg: 4 });
    // Tau um den Schaft
    if (b.lod === 0) for (let i = 0; i < 6; i++) F.ball(Math.sin(i) * 0.05, 0.5 + i * 0.07, Math.cos(i) * 0.05, 0.03, 0xd9c79a, { ws: 5, hs: 3 });
  },
};

FIG.kogge = {
  name: 'Kogge', h: 1.3,
  draw(b) {
    const { F } = b;
    const hull = 0x8a5a3c;
    // Rumpf (seitlich, Bug nach +x), Mast, bauchiges Segel mit Streifen, Fähnchen
    F.extrude([[-0.5, 0.3], [0.5, 0.3], [0.42, 0.06], [-0.4, 0.06]], -0.15, 0.15, hull, {});
    F.extrude([[-0.52, 0.3], [-0.4, 0.3], [-0.4, 0.44], [-0.52, 0.44]], -0.15, 0.15, hull, {});
    F.extrude([[0.38, 0.3], [0.52, 0.3], [0.55, 0.42], [0.38, 0.42]], -0.15, 0.15, hull, {});
    F.box(0, 0.06, 0, 0.8, 0.08, 0.2, mix(hull, INK, 0.3));
    F.rod([0, 0.3, 0], [0, 1.24, 0], 0.025, WOOD, { seg: 6 });
    b.xf([0, 0.78, 0.06], [0, 0, 0], [1, 1, 0.35], () => F.ball(0, 0, 0, 0.36, 0xf6f2e8, { ws: 10, hs: 6, lat: [-0.9, 0.9], sy: 1.2, a0: -1.0, a1: 1.0 }));
    if (b.lod === 0) for (const y of [0.66, 0.9]) F.box(0, y, 0.15, 0.62, 0.06, 0.02, PAL.red);
    F.extrude([[0, 1.18], [0.22, 1.14], [0, 1.1]], -0.006, 0.006, PAL.red, {});
  },
};

FIG.krone = {
  name: 'Krone', h: 0.7,
  draw(b) {
    const { F } = b;
    // Kissen mit Quasten, darauf die Krone
    F.rbox(0, 0, 0, 0.5, 0.14, 0.5, 0.06, PAL.red, { seg: 3 });
    if (b.lod === 0) for (const [x, z] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) F.ball(x * 0.25, 0.04, z * 0.25, 0.035, GOLD, { ws: 5, hs: 3 });
    crown(b, 0, 0.14, 0, 0.2, GOLD, 8);
    F.ball(0, 0.14, 0, 0.17, PAL.red, { ws: 10, hs: 5, lat: [0, Math.PI / 2], sy: 1.2 });
    F.ball(0, 0.4, 0, 0.05, GOLD, { ws: 8, hs: 4 });
    F.box(0, 0.48, 0, 0.025, 0.1, 0.025, GOLD);
    F.box(0, 0.5, 0, 0.07, 0.025, 0.025, GOLD);
  },
};

FIG.globus = {
  name: 'Weltkugel', h: 1.0,
  draw(b) {
    const { F } = b;
    const ws = b.lod > 0 ? 8 : 16;
    F.lathe(0, 0, 0, [[0.18, 0], [0.1, 0.08], [0.05, 0.2]], GOLD, { seg: 12 });
    F.ball(0, 0.56, 0, 0.36, 0x5f9fc8, { ws, hs: 10 });
    // Kontinente als flache Kuppen
    for (const [a, l, r] of [[0.3, 0.3, 0.14], [1.6, -0.2, 0.17], [2.8, 0.5, 0.12], [4.2, 0.1, 0.16], [5.4, -0.4, 0.1]]) {
      const d = [Math.cos(l) * Math.sin(a), Math.sin(l), Math.cos(l) * Math.cos(a)];
      facing(b, add([0, 0.56, 0], d, 0.34), d, () => F.ball(0, 0, 0, r, 0x7fb069, { ws: 8, hs: 3, sz: 0.25 }));
    }
    b.xf([0, 0.56, 0], [0, 0, 0.4], 1, () => F.torus(0, 0, 0, 0.42, 0.02, GOLD, { seg: 16, tube: 4, a0: -1.4, a1: 1.4 }));
  },
};

FIG.zahnrad = {
  name: 'Zahnrad', h: 1.05,
  draw(b) {
    const { F } = b;
    const col = 0x7a8088;
    const n = 12;
    const pts = [];
    for (let i = 0; i < n * 2; i++) {
      const a = (i / (n * 2)) * TAU;
      const r = i % 2 ? 0.4 : 0.48;
      pts.push([Math.sin(a) * r, 0.52 + Math.cos(a) * r]);
    }
    F.extrude(pts, -0.06, 0.06, col, {});
    F.cyl(0, 0.0, 0, 0.16, 0.12, 0.1, col, { seg: 8 });
    b.xf([0, 0.52, 0], [Math.PI / 2, 0, 0], 1, () => F.cyl(0, -0.08, 0, 0.12, 0.12, 0.16, GOLD, { seg: 12 }));
  },
};

FIG.zirbel = {
  name: 'Zirbelnuss', h: 0.95,
  draw(b) {
    const { F } = b;
    const col = GOLD;
    // Kapitell und Pinienzapfen (wie auf alten Brunnen und im Augsburger Wappen)
    F.lathe(0, 0, 0, [[0.2, 0], [0.24, 0.06], [0.14, 0.12], [0.12, 0.22]], col, { seg: 12 });
    F.lathe(0, 0.22, 0, [[0.12, 0], [0.22, 0.12], [0.24, 0.3], [0.16, 0.56], [0.02, 0.72]], col, { seg: 14, ks: [0.9, 1, 1.05, 1, 1.1] });
    if (b.lod === 0) {
      for (let r = 0; r < 6; r++) {
        const y = 0.3 + r * 0.09;
        const rad = [0.2, 0.23, 0.23, 0.21, 0.17, 0.11][r];
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * TAU + r * 0.4;
          F.ball(Math.sin(a) * rad, y, Math.cos(a) * rad, 0.04, mix(col, 0x8a5a1c, 0.25), { ws: 5, hs: 3 });
        }
      }
    }
  },
};

FIG.manneken = {
  name: 'Manneken Pis', h: 1.0,
  draw(b) {
    // kleiner Junge (in Brüssel trägt er oft ein Kostüm: hier ein Wams in der Gewandfarbe), der in hohem Bogen ins Becken
    // pinkelt; der Strahl fällt bis knapp unter seine Standfläche
    person(b, { s: 0.6, pose: 'stand', hair: { style: 'curly', col: 0x8a6a3a }, pants: SKIN, shoe: SKIN }, (bb, P) => {
      const s = P.s;
      bb.W.jet([0, 0.5 * s, 0.12 * s], [0, 0.9, 1.4], -0.25, 0.022, 0xe2f3ff, { n: bb.lod ? 4 : 9, seg: bb.lod ? 3 : 5, r1: 0.03 });
    });
  },
};

export const FIGURES = FIG;

/** Figur id auf (x, y, z), gedreht um ry, so hoch wie h Meter (ohne h: Maßstab 1). */
export function placeFigure(b, id, x, y, z, ry = 0, h = null) {
  const f = FIG[id];
  if (!f) throw new Error('Brunnenfigur fehlt: ' + id);
  const s = h ? h / f.h : 1;
  b.xf([x, y, z], [0, ry, 0], s, () => f.draw(b));
  return f.h * s;
}
