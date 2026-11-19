// Stadt-Baukasten, Teil Menschen: Plüschfiguren wie aus Mini Adams Welt – großer runder Kopf, Knopfaugen mit
// Glanzpunkt, rosige Wangen, weicher Bohnen-Körper, Fäustlinge, kurze Beine. Klar Spielzeug, klar freundlich.
// Jede Figur gibt es in mehreren Haltungen (stehen, gehen, winken, jubeln, sitzen …) als Instanz-Geometrie:
// Name = Art_Haltung, z. B. 'oma_sit'. Die Kleidung oben liegt im Eimer T (Instanzfarbe), Haut, Haare, Hose und
// Zubehör in F, Augen, Wangen und Schilder in G. Ursprung: Boden zwischen den Füßen (sitzend: Boden unter der
// Hüfte, die Sitzfläche liegt in 0,475 m Höhe wie bei der Bank), Blick nach +z.
// Dazu die belebte „Fangruppe“ (kit.build('fanGroup')): Körper verschmolzen, nur die Arme winken.
import * as THREE from 'three';
import { PAL, CITY, mix, rng, makeKit, compose, Bau } from './citycore.js';
import { bike } from './parts.js';

const TAU = Math.PI * 2;
const INK = 0x3b3537;
const CHEEK = 0xf29a9a;
const SHOE = [0x5a4a42, 0x3a3f47, 0xf2f0ea, 0x8a5a3c];
const PANTS = [0x4f6f9a, 0x5a5f69, 0x7a6a5a, 0x3f5f8a, 0x8a7f6f];
const SKIN = CITY.skin;
const HAIR = CITY.hair;

const _m = new THREE.Matrix4();
const _x = new THREE.Vector3();
const _y = new THREE.Vector3();
const _z = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);

/** fn in einem Rahmen ausführen, dessen +z entlang dir zeigt und der bei p liegt (für Augen, Wangen, Mund). */
function facing(b, p, dir, fn) {
  _z.set(dir[0], dir[1], dir[2]).normalize();
  _x.crossVectors(UP, _z).normalize();
  _y.crossVectors(_z, _x);
  _m.makeBasis(_x, _y, _z).setPosition(p[0], p[1], p[2]);
  b.push(_m.clone());
  fn();
  b.pop();
}
const norm = (v) => {
  const l = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / l, v[1] / l, v[2] / l];
};
const add = (a, v, s = 1) => [a[0] + v[0] * s, a[1] + v[1] * s, a[2] + v[2] * s];

// Haltungen: Richtung der Arme (rechts, links; Figur schaut nach +z, rechts = −x aus ihrer Sicht, hier +x für die
// rechte Bildseite der Figur von vorn gesehen), Lage der Knöchel, Hüfthöhe, Sitzen.
// Knöchelhöhe: der Schuh (abgeschnittene Kugel 5 cm unter und 5 cm vor dem Knöchel) steht damit mit der Sohle auf y = 0
const ANK = 0.064;
const POSES = {
  stand: { ar: [0.26, -0.96, 0.06], al: [-0.26, -0.96, 0.06], fr: [0.1, ANK, 0.01], fl: [-0.1, ANK, 0.01] },
  walk: { ar: [0.18, -0.9, -0.36], al: [-0.18, -0.88, 0.4], fr: [0.1, ANK, 0.2], fl: [-0.1, ANK + 0.012, -0.2], dip: 0.03 },
  wave: { ar: [0.52, 0.82, 0.22], al: [-0.26, -0.96, 0.06], fr: [0.1, ANK, 0.01], fl: [-0.1, ANK, 0.01], tilt: 0.08 },
  cheer: { ar: [0.46, 0.86, 0.14], al: [-0.46, 0.86, 0.14], fr: [0.13, ANK, 0.0], fl: [-0.13, ANK, 0.0] },
  sit: { ar: [0.14, -0.62, 0.77], al: [-0.14, -0.62, 0.77], sit: true },
  // Schild hoch über dem Kopf, mit beiden Händen
  sign: { ar: [0.2, 0.86, 0.46], al: [-0.2, 0.86, 0.46], fr: [0.12, ANK, 0.0], fl: [-0.12, ANK, 0.0], busy: true },
  // Handy vor dem Gesicht: filmt das Auto
  film: { ar: [-0.4, 0.3, 0.87], al: [0.4, 0.3, 0.87], fr: [0.11, ANK, 0.0], fl: [-0.11, ANK, 0.0], busy: true },
  // Gitarre spielen: rechte Hand am Steg, linke am Hals
  play: { ar: [0.2, -0.55, 0.81], al: [-0.66, -0.2, 0.72], fr: [0.12, ANK, 0.0], fl: [-0.12, ANK, 0.0] },
};

/**
 * Eine Figur. p: s (Größe, 1 = Erwachsener), skin, hair: { style, col }, pants, shoe, dress (Rock statt Hose),
 * hat, pose, arms (false: ohne Arme, für die Fangruppe), extra(b, P) für Zubehör (P: Gelenkpunkte).
 */
function figure(b, p) {
  const { F, G, T } = b;
  const near = b.lod === 0;
  const pose = POSES[p.pose ?? 'stand'];
  const s = p.s ?? 1;
  const skin = p.skin ?? SKIN[0];
  const pants = p.pants ?? PANTS[0];
  const hipY = 0.56 * s - (pose.dip ?? 0) * s;
  const P = {};
  b.at(0, 0, 0, 0, () => {
    // Beine und Schuhe
    const hips = [[0.1 * s, hipY, 0], [-0.1 * s, hipY, 0]];
    const legR = 0.085 * s;
    const feet = [];
    if (pose.sit) {
      // Im Rock liegt der Stoff über den Oberschenkeln (Instanzfarbe), darunter Strümpfe in Hautfarbe
      const B = p.dress ? T : F;
      const thigh = p.dress ? 0xffffff : pants;
      for (const h of hips) {
        const knee = [h[0], hipY, 0.4 * s];
        const ankle = [h[0] * 1.05, ANK * s, 0.44 * s];
        B.rod(h, knee, legR * (p.dress ? 1.12 : 1), thigh, { seg: near ? 6 : 4 });
        B.ball(knee[0], knee[1], knee[2], legR * (p.dress ? 1.12 : 1), thigh, { ws: 4, hs: 2, lat: [-0.3, Math.PI / 2] });
        if (p.dress) F.rod(knee, ankle, legR * 0.62, skin, { seg: near ? 6 : 4 });
        else F.rod(knee, ankle, legR * 0.95, pants, { seg: near ? 6 : 4 });
        feet.push(ankle);
      }
    } else {
      for (const [i, h] of hips.entries()) {
        const f = i === 0 ? pose.fr : pose.fl;
        const ankle = [f[0] * s, f[1] * s, f[2] * s];
        if (!p.dress) F.rod([h[0], h[1], h[2]], ankle, legR, pants, { seg: near ? 6 : 4 });
        else F.rod([h[0] * 0.8, h[1] - 0.12 * s, h[2]], ankle, legR * 0.62, skin, { seg: near ? 6 : 4 });
        feet.push(ankle);
      }
    }
    for (const f of feet) F.ball(f[0], f[1] - 0.05 * s, f[2] + 0.05 * s, 0.09 * s, p.shoe ?? SHOE[0], { ws: near ? 6 : 4, hs: 2, sz: 1.45, sy: 0.62, lat: [-0.25, Math.PI / 2] });
    // Hüfte (Hose oder Rock) und Oberkörper (Instanzfarbe)
    const y0 = hipY - 0.07 * s;
    if (p.dress && pose.sit) {
      T.lathe(0, y0, 0, [[0.2 * s, 0], [0.214 * s, 0.17 * s]], 0xffffff, { seg: near ? 10 : 6, top: false, ks: [0.86, 1] });
    } else if (p.dress) {
      T.lathe(0, y0 - 0.2 * s, 0, [[0.27 * s, 0], [0.25 * s, 0.1 * s], [0.21 * s, 0.32 * s]], 0xffffff, { seg: near ? 10 : 6, top: false, ks: [0.86, 0.93, 1] });
    } else {
      F.lathe(0, y0, 0, [[0.18 * s, 0], [0.212 * s, 0.17 * s]], pants, { seg: near ? 10 : 6, top: false, ks: [0.86, 1] });
    }
    T.lathe(0, y0 + 0.12 * s, 0, near ? [[0.212 * s, 0], [0.226 * s, 0.18 * s], [0.18 * s, 0.39 * s], [0.07 * s, 0.47 * s]] : [[0.212 * s, 0], [0.222 * s, 0.22 * s], [0.07 * s, 0.47 * s]], 0xffffff, { seg: near ? 10 : 6, top: false, ks: near ? [0.92, 1.02, 1.06, 1] : [0.92, 1.03, 1] });
    const neckY = y0 + 0.58 * s;
    // Kopf
    const hr = 0.26 * s;
    const hc = [0, neckY + hr * 0.92, pose.tilt ? 0.01 * s : 0];
    P.head = hc;
    P.hr = hr;
    // Schlichterer Kopf, wo Zubehör, Hände oder Sitzen das Dreiecksbudget brauchen
    const lean = p.lean || pose.sit || pose.busy;
    F.ball(hc[0], hc[1], hc[2], hr, skin, { ws: near ? (lean ? 10 : 12) : 6, hs: near ? (lean ? 5 : 6) : 4, sy: 0.96 });
    if (near) {
      // Gesicht: Knopfaugen mit Glanzpunkt, Wangen, Näschen, kleines Lächeln
      for (const sx of [-1, 1]) {
        const de = norm([sx * 0.34, 0.08, 0.94]);
        facing(b, add(hc, de, hr * 0.985), de, () => {
          G.disc(0, 0, 0.004, 0.05 * s, INK, { seg: 10 });
          G.disc(-0.015 * s, 0.017 * s, 0.009, 0.016 * s, PAL.frame, { seg: lean ? 4 : 6, flat: true });
        });
        const dc = norm([sx * 0.56, -0.17, 0.81]);
        facing(b, add(hc, dc, hr * 0.99), dc, () => G.disc(0, 0, 0.002, 0.048 * s, mix(skin, CHEEK, 0.55), { seg: 8, flat: true }));
      }
      F.ball(hc[0], hc[1] - 0.03 * s, hc[2] + hr * 0.97, 0.036 * s, mix(skin, 0xb5523b, 0.18), { ws: 5, hs: 2, lat: [-0.6, Math.PI / 2] });
      const dm = norm([0, -0.33, 0.94]);
      facing(b, add(hc, dm, hr * 0.985), dm, () => {
        const pts = [];
        for (let i = 0; i <= 6; i++) {
          const a = Math.PI + (i / 6) * Math.PI;
          pts.push([Math.cos(a) * 0.045 * s, Math.sin(a) * 0.03 * s + 0.008 * s, 0.003]);
        }
        G.poly(pts, mix(INK, 0xb5523b, 0.35), { flat: true });
      });
    }
    if (p.hair) hair(b, p.hair, hc, hr, s, lean);
    if (p.hat) p.hat(b, hc, hr, s);
    // Arme: Ärmel in der Instanzfarbe, Fäustlinge in Hautfarbe
    const sh = [[0.215 * s, neckY - 0.1 * s, 0], [-0.215 * s, neckY - 0.1 * s, 0]];
    P.shoulders = sh;
    P.hands = [];
    for (const [i, q] of sh.entries()) {
      const d = norm(i === 0 ? pose.ar : pose.al);
      const hand = add(q, d, 0.4 * s);
      P.hands.push(hand);
      if (p.arms === false) continue;
      // Das offene Ende des Ärmels steckt im Fäustling
      T.rod(q, add(q, d, 0.34 * s), 0.068 * s, 0xffffff, { seg: near ? 6 : 4 });
      F.ball(hand[0], hand[1], hand[2], 0.08 * s, skin, { ws: near ? 6 : 4, hs: near ? 3 : 2 });
    }
    P.neckY = neckY;
    P.s = s;
    if (p.extra) p.extra(b, P);
  });
  const top = P.head[1] + P.hr + (p.hatH ?? 0.06) * s;
  return { w: 0.62 * s, d: (pose.sit ? 0.75 : 0.5) * s, h: Math.max(top, P.hands[0][1] + 0.1, P.hands[1][1] + 0.1), P };
}

/**
 * Frisuren: eine Kappe aus einer Teilkugel, die genau auf dem Kopf sitzt (gleicher Mittelpunkt, etwas größer) und
 * nach hinten gekippt ist: vorn bleibt die Stirn frei, hinten reicht sie tief in den Nacken. So entsteht kein
 * Schnitt zweier Kugeln mit zackiger Haarlinie.
 */
function hair(b, { style, col }, c, r, s, lean = false) {
  const { F } = b;
  const near = b.lod === 0;
  const ws = near ? (lean ? 10 : 12) : 6;
  // lat0: Rand an den Seiten (rad über dem Äquator), tilt: wie weit der Rand vorn steigt und hinten fällt
  const cap = (lat0, tilt, grow = 1.06) => b.xf(c, [-tilt, 0, 0], 1, () => F.ball(0, 0, 0, r * grow, col, { ws, hs: near ? 3 : 2, lat: [lat0, Math.PI / 2] }));
  // Pony: flache Locke am vorderen Rand, leicht zur Seite gescheitelt
  const fringe = (side, lat = 0.62) => {
    const d = [side * 0.32 * Math.cos(lat), Math.sin(lat), 0.95 * Math.cos(lat)];
    const l = Math.hypot(d[0], d[1], d[2]);
    facing(b, add(c, d, (r * 1.02) / l), [d[0] / l, d[1] / l, d[2] / l], () => F.ball(0, 0, 0, r * 0.36, col, { ws: 7, hs: 2, sy: 0.8, sz: 0.34 }));
  };
  switch (style) {
    case 'bald':
      // Haarkranz unter dem Hut (nur mit Hut): Band um den Hinterkopf, endet hinter den Ohren
      F.ball(c[0], c[1], c[2], r * 1.04, col, { ws: near ? 6 : 4, hs: 2, lat: [-0.32, 0.4], top: false, a0: 1.9, a1: TAU - 1.9 });
      break;
    case 'bob': {
      cap(0.02, 0.32, 1.07);
      // Vorhang bis zum Kinn an Seiten und Hinterkopf, vorn für das Gesicht offen
      const prof = [[r * 0.94, -r * 0.7], [r * 1.1, -r * 0.52], [r * 1.12, -r * 0.1], [r * 1.04, r * 0.3]];
      F.lathe(c[0], c[1], c[2], prof, col, { seg: near ? 9 : 5, a0: 0.95, a1: TAU - 0.95, top: false, ks: [0.8, 0.9, 1, 1] });
      break;
    }
    case 'pony':
      cap(0.06, 0.42);
      if (near) fringe(-1);
      b.xf([c[0], c[1] + r * 0.2, c[2] - r * 1.0], [0.5, 0, 0], 1, () => F.lathe(0, -0.42 * s, 0, [[0, 0], [0.075 * s, 0.14 * s], [0.05 * s, 0.42 * s]], col, { seg: near ? 5 : 4, top: false }));
      F.ball(c[0], c[1] + r * 0.24, c[2] - r * 1.0, 0.05 * s, PAL.red, { ws: 5, hs: 2 });
      break;
    case 'bun':
      cap(0.06, 0.36);
      F.ball(c[0], c[1] + r * 0.84, c[2] - r * 0.44, r * 0.36, col, { ws: near ? 6 : 4, hs: 3, lat: [-0.6, Math.PI / 2] });
      break;
    case 'curly':
      cap(0.02, 0.3, 1.05);
      if (near) for (let i = 0; i < 3; i++) {
        const a = (i / 3) * TAU + 0.6;
        F.ball(c[0] + Math.sin(a) * r * 0.58, c[1] + r * 0.72, c[2] - 0.05 * s + Math.cos(a) * r * 0.54, r * 0.32, col, { ws: 6, hs: 2, lat: [-0.5, Math.PI / 2] });
      }
      break;
    default: // 'short'
      cap(0.08, 0.42);
      if (near) fringe(1);
  }
}

// --- Hüte und Zubehör ---------------------------------------------------------------------------------------------
const flatCap = (col) => (b, c, r, s) => {
  b.F.ball(c[0], c[1] + r * 0.18, c[2] - 0.01 * s, r * 1.08, col, { ws: 9, hs: 2, lat: [0.25, Math.PI / 2], sy: 0.85 });
  b.xf([c[0], c[1] + r * 0.42, c[2] + r * 0.82], [0.25, 0, 0], 1, () => b.F.cyl(0, 0, 0, r * 0.55, r * 0.6, 0.03 * s, col, { seg: 6, a0: -1.2, a1: 1.2, bottom: true }));
};
const policeCap = (b, c, r, s) => {
  const blue = 0x2f4f86;
  b.F.lathe(c[0], c[1] + r * 0.45, c[2] - 0.02 * s, [[r * 0.98, 0], [r * 1.12, 0.2 * s], [0, 0.25 * s]], blue, { seg: 10, bottom: true });
  b.F.lathe(c[0], c[1] + r * 0.42, c[2] - 0.02 * s, [[r * 1.0, 0], [r * 1.0, 0.07 * s]], PAL.frame, { seg: 10, top: false });
  b.xf([c[0], c[1] + r * 0.46, c[2] + r * 0.8], [0.35, 0, 0], 1, () => b.F.cyl(0, 0, 0, r * 0.5, r * 0.55, 0.025 * s, CITY.ink, { seg: 4, a0: -1.1, a1: 1.1, bottom: true }));
  b.G.disc(c[0], c[1] + r * 0.62, c[2] + r * 1.06, 0.045 * s, CITY.gold, { seg: 6 });
};
const helmet = (col) => (b, c, r, s) => {
  b.F.ball(c[0], c[1] + r * 0.12, c[2] - 0.02 * s, r * 1.14, col, { ws: 10, hs: 3, lat: [0.2, Math.PI / 2] });
  for (let i = -1; i <= 1; i++) b.G.box(c[0] + i * 0.08 * s, c[1] + r * 1.1, c[2] - 0.05 * s, 0.04 * s, 0.02 * s, 0.3 * s, PAL.frame);
};
const beanie = (col) => (b, c, r, s) => {
  // Mütze und Umschlag sitzen über den Augen (Augenoberkante bei etwa 0,28 r)
  b.F.ball(c[0], c[1], c[2], r * 1.08, col, { ws: 9, hs: 3, lat: [0.3, Math.PI / 2], sy: 1.08 });
  b.F.lathe(c[0], c[1] + r * 0.3, c[2], [[r * 1.08, 0], [r * 1.08, 0.07 * s]], mix(col, 0xffffff, 0.3), { seg: 8, top: false });
  b.F.ball(c[0], c[1] + r * 1.2, c[2], 0.07 * s, PAL.frame, { ws: 5, hs: 3 });
};
const strawHat = (b, c, r, s) => {
  const straw = 0xe9cf8a;
  b.F.lathe(c[0], c[1] + r * 0.5, c[2] - 0.02 * s, [[r * 1.7, 0], [r * 0.95, 0.05 * s], [r * 0.9, 0.2 * s], [0, 0.23 * s]], straw, { seg: 10, bottom: true, ks: [0.85, 0.95, 1, 1.05] });
  b.F.lathe(c[0], c[1] + r * 0.5 + 0.05 * s, c[2] - 0.02 * s, [[r * 0.935, 0], [r * 0.93, 0.05 * s]], PAL.red, { seg: 10, top: false });
};

/** Hund an der Leine (Plüsch, sitzt bei p, schaut nach +z). */
function dog(b, col = 0xc9a477) {
  const { F, G } = b;
  b.at(0, 0, 0, 0.4, () => {
    F.ball(0, 0.26, 0, 0.17, col, { ws: 9, hs: 5, sz: 1.35, sy: 0.85 });
    F.ball(0, 0.42, 0.2, 0.13, col, { ws: 9, hs: 5 });
    F.ball(0, 0.38, 0.32, 0.06, mix(col, 0xffffff, 0.35), { ws: 6, hs: 3, sz: 1.2 });
    F.ball(0, 0.4, 0.38, 0.025, INK, { ws: 5, hs: 3 });
    for (const sx of [-1, 1]) {
      b.xf([sx * 0.1, 0.48, 0.17], [0, 0, sx * 0.5], 1, () => F.ball(0, -0.05, 0, 0.055, mix(col, 0x5a3a2a, 0.45), { ws: 6, hs: 3, sy: 1.6, sz: 0.5 }));
      G.disc(sx * 0.055, 0.46, 0.305, 0.022, INK, { seg: 6 });
      for (const z of [0.12, -0.12]) F.cyl(sx * 0.08, 0, z, 0.045, 0.05, 0.2, col, { seg: 5 });
    }
    b.xf([0, 0.32, -0.2], [-0.8, 0, 0], 1, () => F.cyl(0, 0, 0, 0.035, 0.02, 0.2, col, { seg: 5 }));
    F.lathe(0, 0.3, 0.17, [[0.1, 0], [0.1, 0.04]], PAL.red, { seg: 8, top: false });
  });
}

// Wo der Hund neben seinem Menschen sitzt und wo das Fahrrad lehnt (Ursprung der Figur)
const DOG_AT = [0.62, 0, 0.42];
const BIKE_AT = [0.62, 0, 0.1];

/** Luftballon an der Schnur ab der Hand: Herzform aus zwei Kugeln und einer Spitze. */
function balloon(b, hand, col = PAL.red) {
  const { F, T } = b;
  const top = [hand[0] + 0.15, hand[1] + 0.95, hand[2] + 0.05];
  F.rod(hand, top, 0.012, CITY.ink, { seg: 4 });
  b.at(top[0], top[1] + 0.02, top[2], 0, () => {
    T.ball(-0.09, 0.22, 0, 0.13, col, { ws: 9, hs: 6, sz: 0.75, k: 1.08 });
    T.ball(0.09, 0.22, 0, 0.13, col, { ws: 9, hs: 6, sz: 0.75, k: 1.08 });
    T.lathe(0, 0.0, 0, [[0.0, 0], [0.12, 0.13], [0.16, 0.22]], col, { seg: 9, sz: 0.62, top: false, k: 1.04 });
    T.ball(0, 0.0, 0, 0.025, col, { ws: 5, hs: 3 });
  });
}

/** Gitarre quer vor dem Bauch (rechte Hand am Schallloch, linke am Hals): ausgestochene Achter-Silhouette. */
function guitar(b, P) {
  const { F, G } = b;
  const s = P.s;
  const [hr, hl] = P.hands;
  const body = [hr[0] - 0.02, hr[1] - 0.02, hr[2] + 0.02];
  const dir = norm([hl[0] - body[0], hl[1] - body[1], hl[2] - body[2]]);
  const pts = [];
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * TAU;
    // zwei Bäuche: unten groß, oben klein, dazwischen die Taille
    const r = (Math.cos(a) > 0 ? 0.17 : 0.13) * s * (1 - 0.18 * Math.sin(a) ** 2);
    pts.push([Math.cos(a) * r + (Math.cos(a) > 0 ? 0.06 : -0.06) * s, Math.sin(a) * r * 0.95]);
  }
  facing(b, body, [0.12, 0.05, 1], () => {
    b.xf([0, 0, 0], [0, 0, Math.atan2(dir[1], dir[0]) + Math.PI], 1, () => {
      // Rückseite liegt am Bauch an und bleibt offen
      F.extrude(pts, -0.06 * s, 0.0, 0xd08a4a, { crease: 0.5, caps: 'f' });
      G.disc(-0.01 * s, 0, 0.002, 0.05 * s, CITY.ink, { seg: 8 });
    });
  });
  F.rod(add(body, dir, 0.08), add(hl, dir, 0.12), 0.025 * s, CITY.wood, { seg: 5, caps: 'end' });
}

/** Offener Gitarrenkoffer mit ein paar Münzen auf dem Boden vor der Figur. */
function guitarCase(b) {
  const { F, G } = b;
  b.at(0, 0, 0, 0.3, () => {
    F.rbox(0, 0, 0, 0.42, 0.1, 0.95, 0.12, CITY.ink, { seg: 3 });
    F.rbox(0, 0.08, 0, 0.34, 0.03, 0.86, 0.1, 0xb5523b, { seg: 3 });
    for (let i = 0; i < 5; i++) G.disc(-0.08 + (i % 3) * 0.08, 0.115, -0.2 + i * 0.09, 0.025, CITY.gold, { up: true, seg: 6 });
  });
}

/** Pappschild an einer Latte, mit beiden Händen hochgehalten; key = Atlas-Feld der Fanschilder. */
function fanSign(key) {
  return (b, P) => {
    const { F, G } = b;
    const [hr, hl] = P.hands;
    const mid = [(hr[0] + hl[0]) / 2, (hr[1] + hl[1]) / 2, (hr[2] + hl[2]) / 2 + 0.03];
    // Latte hinter dem Karton, ihr oberes Ende verschwindet dahinter
    F.rod([mid[0], mid[1] - 0.15, mid[2] - 0.045], [mid[0], mid[1] + 0.5, mid[2] - 0.045], 0.022, CITY.wood, { seg: 5 });
    b.at(mid[0], mid[1] + 0.32, mid[2], 0, () => {
      F.box(0, 0, -0.012, 0.86, 0.54, 0.02, 0xc9a477, { skip: 'b' });
      b.at(0, 0, 0.0, 0, () => G.sign(0, 0.02, 0.002, 0.8, key));
    });
  };
}
/** Handy in beiden Händen vor dem Gesicht, Bildschirm zur Figur, Rückseite mit Kamera nach vorn. */
function phone(b, P) {
  const { F, G } = b;
  const [hr, hl] = P.hands;
  const mid = [(hr[0] + hl[0]) / 2, (hr[1] + hl[1]) / 2 + 0.08, (hr[2] + hl[2]) / 2 + 0.03];
  F.box(mid[0], mid[1] - 0.09, mid[2], 0.1, 0.18, 0.02, CITY.ink, { skip: 'b' });
  G.disc(mid[0] - 0.025, mid[1] + 0.05, mid[2] + 0.011, 0.012, mix(PAL.glassDark, 0xffffff, 0.3), { seg: 6 });
  G.disc(mid[0] + 0.02, mid[1] + 0.055, mid[2] + 0.011, 0.007, PAL.red, { seg: 5, flat: true });
}

// --- Arten ----------------------------------------------------------------------------------------------------------
// tints: Farben der Oberbekleidung (die erste ist die Vorgabe), poses: erlaubte Haltungen, p: Merkmale der Figur.
const CLOTH = CITY.cloth;
const KINDS = {
  mann: { tints: [CLOTH[1], CLOTH[3], CLOTH[2], CLOTH[0], CLOTH[8]], poses: ['stand', 'walk', 'wave', 'cheer', 'sit'], p: { skin: SKIN[1], hair: { style: 'short', col: HAIR[0] }, pants: PANTS[0] } },
  frau: { tints: [CLOTH[0], CLOTH[7], CLOTH[6], CLOTH[4], CLOTH[3]], poses: ['stand', 'walk', 'wave', 'cheer', 'sit'], p: { skin: SKIN[0], hair: { style: 'pony', col: HAIR[2] }, pants: PANTS[1], shoe: SHOE[1] } },
  frau2: { tints: [CLOTH[5], CLOTH[6], CLOTH[1], CLOTH[7]], poses: ['stand', 'walk', 'wave'], p: { skin: SKIN[3], hair: { style: 'curly', col: HAIR[1] }, dress: true, shoe: SHOE[3], lean: true } },
  opa: { tints: [0xb5523b, 0x6b7fa8, 0x7a8f5a], poses: ['stand', 'walk', 'sit'], p: { skin: SKIN[0], hair: { style: 'bald', col: HAIR[3] }, pants: PANTS[2], hat: flatCap(0x8a7f6f), hatH: 0.08, stick: true, lean: true } },
  oma: { tints: [0xb07cc6, 0xf4a6c0, 0x5fbfb0], poses: ['stand', 'walk', 'wave', 'sit'], p: { skin: SKIN[1], hair: { style: 'bun', col: HAIR[3] }, dress: true, shoe: SHOE[0], bag: true, lean: true } },
  kind: { tints: [CLOTH[3], CLOTH[0], CLOTH[1], CLOTH[2], CLOTH[7]], poses: ['stand', 'walk', 'wave', 'cheer'], p: { s: 0.66, skin: SKIN[2], hair: { style: 'curly', col: HAIR[4] }, pants: PANTS[3], shoe: SHOE[2], balloon: true, lean: true } },
  radler: { tints: [CLOTH[2], CLOTH[5], CLOTH[1]], poses: ['stand'], p: { skin: SKIN[1], hair: null, pants: PANTS[1], hat: helmet(0x3f8fd0), hatH: 0.14, bike: true } },
  gassi: { tints: [CLOTH[6], CLOTH[8], CLOTH[0]], poses: ['stand', 'walk'], p: { skin: SKIN[2], hair: { style: 'bob', col: HAIR[0] }, pants: PANTS[4], dog: true, lean: true } },
  markt: { tints: [CLOTH[2], CLOTH[0], CLOTH[1]], poses: ['stand', 'wave'], p: { skin: SKIN[1], hair: { style: 'bald', col: HAIR[4] }, pants: PANTS[2], hat: strawHat, hatH: 0.24, apron: true, lean: true } },
  musik: { tints: [CLOTH[4], CLOTH[8], CLOTH[0]], poses: ['play'], p: { skin: SKIN[3], hair: null, hat: beanie(0xe5483a), hatH: 0.12, pants: PANTS[1], guitar: true, lean: true } },
  polizei: { tints: [0x3f5f9a], poses: ['stand', 'wave'], p: { skin: SKIN[0], hair: { style: 'bald', col: HAIR[0] }, pants: 0x2f4f86, shoe: SHOE[1], hat: policeCap, hatH: 0.26, vest: true, lean: true } },
  fan: { tints: [CLOTH[0], CLOTH[3], CLOTH[1], CLOTH[2], CLOTH[7]], poses: ['cheer', 'wave', 'film', 'signHallo', 'signDanke', 'signEhre', 'signLive'], p: { skin: SKIN[0], hair: { style: 'short', col: HAIR[0] }, pants: PANTS[3] } },
  fan2: { tints: [CLOTH[7], CLOTH[6], CLOTH[4], CLOTH[0]], poses: ['cheer', 'wave', 'film', 'signHallo', 'signDanke'], p: { skin: SKIN[2], hair: { style: 'pony', col: HAIR[0] }, pants: PANTS[1] } },
};
const SIGNS = { signHallo: 'f:hallo', signDanke: 'f:danke', signEhre: 'f:ehre', signLive: 'f:live' };

function makePerson(b, kind, poseName, o = {}) {
  const K = KINDS[kind];
  const sign = SIGNS[poseName];
  const pose = sign ? 'sign' : poseName;
  const p = { ...K.p, pose, arms: o.arms };
  const extras = [];
  if (sign) extras.push(fanSign(sign));
  if (poseName === 'film') extras.push(phone);
  if (K.p.guitar) extras.push(guitar);
  if (K.p.stick && pose !== 'sit') {
    extras.push((bb, P) => bb.F.rod(P.hands[0], [P.hands[0][0] + 0.05, 0, P.hands[0][2] + 0.12], 0.022, CITY.woodDark, { seg: 5, caps: true }));
  }
  if (K.p.bag && pose !== 'sit') {
    extras.push((bb, P) => {
      const h = P.hands[1];
      bb.F.rod([h[0], h[1] - 0.02, h[2]], [h[0], h[1] - 0.08, h[2] + 0.06], 0.014, CITY.woodDark, { seg: 4 });
      bb.F.rod([h[0], h[1] - 0.02, h[2]], [h[0], h[1] - 0.08, h[2] - 0.06], 0.014, CITY.woodDark, { seg: 4 });
      bb.F.rbox(h[0], h[1] - 0.28, h[2], 0.12, 0.22, 0.26, 0.05, 0xb5523b, { seg: 1 });
    });
  }
  if (K.p.apron) {
    extras.push((bb, P) => {
      const s = P.s;
      const y0 = P.neckY - 0.58 * s;
      const prof = [[0.205 * s, -0.12 * s], [0.226 * s, 0.1 * s], [0.238 * s, 0.3 * s], [0.212 * s, 0.42 * s]];
      bb.F.lathe(0, y0, 0, prof, PAL.frame, { seg: 6, a0: -0.95, a1: 0.95, top: false, ks: [0.9, 1, 1.02, 1] });
    });
  }
  if (K.p.vest) {
    extras.push((bb, P) => {
      const s = P.s;
      const near = bb.lod === 0;
      const y0 = P.neckY - 0.58 * s;
      // Gürtel auf der Naht von Hose und Jacke (gleiche Teilung wie der Rumpf, damit die Kanten parallel laufen)
      bb.F.lathe(0, y0 + 0.1 * s, 0, [[0.218 * s, 0], [0.222 * s, 0.06 * s]], CITY.ink, { seg: near ? 10 : 6, top: false });
      if (!near) return;
      bb.F.box(0, y0 + 0.108 * s, 0.214 * s, 0.07 * s, 0.045 * s, 0.022 * s, CITY.gold, { skip: 'kb' });
      // Stern mitten auf einer Fläche der Jacke (Rumpf mit zehn Seiten: Flächenmitte bei −18°), in ihre Neigung gedreht
      const a = -Math.PI / 10;
      const d = 0.951 * 0.2194 * s + 0.002;
      const t = Math.atan((0.951 * 0.046) / 0.21);
      facing(bb, [Math.sin(a) * d, y0 + 0.33 * s, Math.cos(a) * d], [Math.sin(a) * Math.cos(t), Math.sin(t), Math.cos(a) * Math.cos(t)], () => {
        // Fächer um die Mitte, gegen den Uhrzeigersinn, Spitze oben
        const pts = [[0, 0, 0]];
        for (let i = 0; i <= 10; i++) {
          const u = Math.PI / 2 + (i / 10) * TAU;
          const rr = (i % 2 ? 0.017 : 0.038) * s;
          pts.push([Math.cos(u) * rr, Math.sin(u) * rr, 0]);
        }
        bb.G.poly(pts, CITY.gold, { flat: true });
      });
    });
  }
  const info = figure(b, { ...p, extra: (bb, P) => extras.forEach((fn) => fn(bb, P)) });
  // Leine bis zum Halsband des Hundes, der als eigener Baustein daneben sitzt (dogFor)
  if (K.p.dog && b.lod === 0) {
    const h = info.P.hands[0];
    const end = [DOG_AT[0] - 0.04, 0.31, DOG_AT[2] + 0.17];
    const mid = [(h[0] + end[0]) / 2, Math.min(h[1], end[1]) - 0.08, (h[2] + end[2]) / 2];
    b.F.rod(h, mid, 0.012, PAL.red, { seg: 3 });
    b.F.rod(mid, end, 0.012, PAL.red, { seg: 3 });
  }
  const balloonPose = K.p.balloon && (pose === 'stand' || pose === 'walk');
  // Schilder ragen über den Kopf: die Höhe zählt bis zur Oberkante des Schilds (Sichtprüfung, Schattenhülle)
  const h = sign ? Math.max(info.h, 2.2) : info.h;
  return { w: info.w, d: info.d, h, pose: poseName, person: kind, sit: pose === 'sit', with: K.p.dog ? 'dog' : K.p.bike ? 'bikeLean' : K.p.guitar ? 'guitarCase' : balloonPose ? 'balloon_' + pose : undefined };
}

const defs = {};
for (const [kind, K] of Object.entries(KINDS)) {
  for (const pose of K.poses) {
    defs[kind + '_' + pose] = {
      kind: 'person', tints: K.tints, far: true, fade: 0.9, low: 0.84,
      make: (b) => makePerson(b, kind, pose),
    };
  }
}

// Begleiter als eigene kleine Bausteine; ihr Platz neben der Figur steht in info.at (in Figur-Koordinaten)
defs.dog = { kind: 'animal', tints: [0xc9a477, 0x8a5a3c, 0xf2f0ea, 0x3a3f47], far: true, fade: 0.5, low: 0.86, make: (b) => (dog(b, 0xffffff), { w: 0.4, d: 0.7, h: 0.6, at: DOG_AT }) };
/** Taube: rundlicher Körper, Köpfchen mit Schnabel, Schwanzfächer; pickt (o.peck) oder schaut geradeaus. */
function pigeon(b, peck) {
  const { F, G } = b;
  const grey = 0x9aa3b5;
  F.ball(0, 0.1, 0, 0.075, grey, { ws: 8, hs: 4, sz: 1.45, sy: 0.9 });
  F.ball(0, 0.135, 0.05, 0.06, mix(grey, 0x6f8f9f, 0.4), { ws: 7, hs: 3, sz: 1.1 });
  const hy = peck ? 0.1 : 0.2;
  const hz = peck ? 0.16 : 0.1;
  F.ball(0, hy, hz, 0.042, mix(grey, 0x5a6f8a, 0.3), { ws: 7, hs: 4 });
  b.xf([0, hy - 0.005, hz + 0.035], [Math.PI / 2 + (peck ? 0.5 : 0), 0, 0], 1, () => F.cyl(0, 0, 0, 0.012, 0.002, 0.035, 0xe0a46a, { seg: 4, top: false }));
  for (const sx of [-1, 1]) G.disc(sx * 0.03, hy + 0.012, hz + 0.022, 0.009, INK, { seg: 5 });
  b.xf([0, 0.11, -0.1], [0.35, 0, 0], 1, () => F.extrude([[-0.035, 0], [0.035, 0], [0.05, -0.1], [-0.05, -0.1]], -0.006, 0.006, mix(grey, CITY.ink, 0.35), { crease: 0.4 }));
  for (const sx of [-1, 1]) F.rod([sx * 0.025, 0.04, 0.01], [sx * 0.025, 0, 0.02], 0.006, 0xe08a7a, { seg: 3 });
}
defs.pigeon = { kind: 'animal', far: false, fade: 0.2, make: (b) => (pigeon(b, false), { w: 0.16, d: 0.3, h: 0.25 }) };
defs.pigeonPeck = { kind: 'animal', far: false, fade: 0.2, make: (b) => (pigeon(b, true), { w: 0.16, d: 0.3, h: 0.2 }) };
defs.bikeLean = { kind: 'small', far: true, fade: 0.6, make: (b) => (bike(b, 0, 0, 0x4fae6a), { w: 0.6, d: 1.4, h: 1.05, at: BIKE_AT }) };
// Luftballon des Kindes: Ursprung wie die Figur (gleiche Lage), die Schnur beginnt in ihrer Hand
for (const pose of ['stand', 'walk']) {
  defs['balloon_' + pose] = {
    kind: 'small', tints: [PAL.red], far: true, fade: 0.1,
    make: (b) => {
      const P = figure(new Bau(), { ...KINDS.kind.p, pose }).P;
      balloon(b, P.hands[0], 0xffffff);
      return { w: 0.5, d: 0.4, h: P.hands[0][1] + 1.25, at: [0, 0, 0] };
    },
  };
}
defs.guitarCase = { kind: 'small', far: false, fade: 0.2, make: (b) => (guitarCase(b), { w: 0.6, d: 1.0, h: 0.12, at: [0.25, 0, 0.75] }) };

// --- Die Fangruppe: Körper verschmolzen, Arme als Instanzen, die winken ---------------------------------------------
const ARM_FANS = ['fan', 'fan2', 'mann', 'frau', 'kind'];
let armGeos = null;
/** Ein Arm hängt am Schultergelenk im Ursprung nach unten (−y): Ärmel (weiß, für die Instanzfarbe) und Fäustling. */
function armGeometries() {
  if (armGeos) return armGeos;
  const sleeve = new Bau();
  sleeve.T.rod([0, 0, 0], [0, -0.33, 0], 0.068, 0xffffff, { seg: 7, caps: true });
  const hand = new Bau();
  hand.T.ball(0, -0.4, 0, 0.08, 0xffffff, { ws: 7, hs: 5 });
  armGeos = { sleeve: sleeve.done({}).tint, hand: hand.done({}).tint };
  return armGeos;
}
defs.fanGroup = {
  kind: 'people',
  info: { w: 8, d: 3.5, h: 2.0, animated: true },
  /** o: n (Zahl der Fans, 4 … 16), seed, w/d (Fläche), signs (true: einige halten Schilder) */
  build(kit, o = {}) {
    const n = Math.max(4, Math.min(16, o.n ?? 9));
    const rnd = rng(o.seed ?? 7);
    const W = o.w ?? 8;
    const D = o.d ?? 3.5;
    const items = [];
    const arms = [];
    const signs = ['signHallo', 'signDanke', 'signEhre', 'signLive'];
    // Zwei, drei lockere Reihen; vorne die Kleinen
    for (let i = 0; i < n; i++) {
      const row = i % 3;
      const x = -W / 2 + ((i + 0.5) / n) * W + (rnd() - 0.5) * 0.3;
      const z = -row * (D / 3) - rnd() * 0.25;
      const ry = (rnd() - 0.5) * 0.5;
      let kind = ARM_FANS[Math.floor(rnd() * ARM_FANS.length)];
      if (row === 0 && i % 4 === 1) kind = 'kind';
      const K = KINDS[kind];
      const tint = K.tints[Math.floor(rnd() * K.tints.length)];
      const holdSign = o.signs !== false && (i % 4 === 2) && KINDS[kind].poses.includes('signHallo');
      const film = !holdSign && i % 5 === 3 && KINDS[kind].poses.includes('film');
      if (holdSign || film) {
        const pose = holdSign ? signs[Math.floor(rnd() * 4) % (kind === 'fan' ? 4 : 2)] : 'film';
        items.push({ g: kit.geo(kind + '_' + pose), x, z, ry, tint });
        continue;
      }
      items.push({ g: kit.geo('body:' + kind), x, z, ry, tint });
      const s = K.p.s ?? 1;
      const neckY = 0.56 * s - 0.07 * s + 0.58 * s;
      for (const side of [1, -1]) {
        arms.push({ x, z, ry, s, side, sy: neckY - 0.1 * s, sx: 0.215 * s, tint, skin: K.p.skin ?? SKIN[0], ph: rnd() * TAU, both: i % 2 === 0, speed: 5 + rnd() * 3 });
      }
    }
    const g = compose(kit.core, items);
    const A = armGeometries();
    const sleeves = new THREE.InstancedMesh(A.sleeve, kit.matte, arms.length);
    const hands = new THREE.InstancedMesh(A.hand, kit.matte, arms.length);
    const c = new THREE.Color();
    arms.forEach((a, k) => {
      sleeves.setColorAt(k, c.setHex(a.tint));
      hands.setColorAt(k, c.setHex(a.skin));
    });
    for (const m of [sleeves, hands]) {
      m.castShadow = true;
      m.receiveShadow = true;
      // Die Arme bleiben in der Hülle der Gruppe, die Instanzen selbst haben keine eigene
      m.frustumCulled = false;
      g.add(m);
    }
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const pos = new THREE.Vector3();
    const scl = new THREE.Vector3();
    const set = (t) => {
      arms.forEach((a, k) => {
        // Winken: Arm schräg nach oben, schwingt um die Blickachse; wer nicht mit beiden winkt, lässt links hängen
        const up = a.side > 0 || a.both;
        const sw = Math.sin(t * a.speed + a.ph + (a.side > 0 ? 0 : 1.3));
        const roll = up ? a.side * (2.45 + 0.35 * sw) : a.side * 0.27;
        e.set(up ? 0.15 : 0.06, a.ry, roll, 'YXZ');
        q.setFromEuler(e);
        const cs = Math.cos(a.ry);
        const sn = Math.sin(a.ry);
        pos.set(a.x + a.side * a.sx * cs, a.sy, a.z - a.side * a.sx * sn);
        scl.setScalar(a.s);
        _m.compose(pos, q, scl);
        sleeves.setMatrixAt(k, _m);
        hands.setMatrixAt(k, _m);
      });
      sleeves.instanceMatrix.needsUpdate = true;
      hands.instanceMatrix.needsUpdate = true;
    };
    set(0);
    g.userData.update = set;
    g.userData.info = { w: W + 1, d: D + 0.6, h: 2.0, n, animated: true };
    return g;
  },
};
for (const kind of ARM_FANS) {
  defs['body:' + kind] = { kind: 'part', tints: KINDS[kind].tints, far: true, fade: 0.9, low: 0.84, make: (b) => figure(b, { ...KINDS[kind].p, pose: 'stand', arms: false }) };
}

/** Menschen. kit.pick(rnd, { kinds, poses }) wählt einen passenden Namen. */
export function createPeopleKit(F) {
  const kit = makeKit(F, defs);
  kit.kinds = Object.keys(KINDS);
  kit.posesOf = (kind) => KINDS[kind].poses.slice();
  kit.pick = (rnd, { kinds = null, poses = null } = {}) => {
    const all = kit.list('person').filter((n) => {
      const [k, p] = n.split('_');
      return (!kinds || kinds.includes(k)) && (!poses || poses.includes(p));
    });
    return all[Math.floor(rnd() * all.length)];
  };
  return kit;
}
