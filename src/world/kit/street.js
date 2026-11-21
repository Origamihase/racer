// Stadt-Baukasten, Teil Straße: Laternen, Ampeln, Haltestellen, Bänke, Kübel, Bäume, Marktstände, Weihnachtsmarkt,
// Rummel, Ladesäulen, Bahnübergang, Baustelle, Wertstoffinsel, Blitzer, Ortstafeln, Wegweiser, Banner, Wimpel, Ziel-Tor
// und geparkte Spielzeugautos. Ursprung jedes Teils: Mitte seines Fußes auf dem Boden, die Schauseite blickt nach +z
// (zur Fahrbahn). Teile mit freiem Text (Ortstafel, Wegweiser, Banner, Ziel) baut kit.build(name, { text … }) mit
// einer Texttafel je Text (Leinwand einmal gemalt, im Cache); alles andere ist Instanz-Geometrie.
import * as THREE from 'three';
import { PAL, CITY, mix, makeKit, textMaterial, textPanel, fitFont, FONT, compose, Bau, atlasUV } from './citycore.js';
import { bench, tub, ballTree, puffs, spruce, lantern, blossom, flowerBed, bike } from './parts.js';

const TAU = Math.PI * 2;
const IRON = PAL.darkMetal;
const POLE = mix(PAL.steel, 0xffffff, 0.15);
const GREEN_IRON = 0x2f5f4a;
const LIT = { red: 0xff4a3a, amber: 0xffb21a, green: 0x5cff8a, warm: 0xffe7a0 };
const DARK = { red: 0x5a2420, amber: 0x5e4416, green: 0x23503a };

// --- kleine Helfer ------------------------------------------------------------------------------------------------
/** Pfosten mit Fußring und runder Kappe. */
function post(b, x, z, h, r, col = POLE, o = {}) {
  const { F } = b;
  const seg = b.lod > 0 ? 6 : o.seg ?? 10;
  F.lathe(x, 0, z, [[r * 1.6, 0], [r * 1.6, 0.06], [r * 1.15, 0.12], [r, 0.2], [r, h]], col, { seg, top: false, ks: [0.75, 0.85, 0.9, 0.92, 1.04] });
  F.ball(x, h, z, r * 1.05, col, { ws: seg, hs: 3, lat: [0, Math.PI / 2] });
}
/** Gestreifte Röhre (Schranke, Bake): von p0 nach p1, Streifen der Länge seg in den Farben cols. */
function stripes(b, p0, p1, r, cols, len = 0.5) {
  const d = Math.hypot(p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]);
  const n = Math.max(1, Math.round(d / len));
  for (let i = 0; i < n; i++) {
    const a = i / n;
    const e = (i + 1) / n;
    b.F.rod([p0[0] + (p1[0] - p0[0]) * a, p0[1] + (p1[1] - p0[1]) * a, p0[2] + (p1[2] - p0[2]) * a], [p0[0] + (p1[0] - p0[0]) * e, p0[1] + (p1[1] - p0[1]) * e, p0[2] + (p1[2] - p0[2]) * e], r, cols[i % cols.length], { seg: b.lod > 0 ? 5 : 8, caps: i === 0 || i === n - 1 });
  }
}
// --- Textschilder ------------------------------------------------------------------------------------------------
/** Teilt einen langen Namen an der Lücke, die der Mitte am nächsten liegt, in zwei Zeilen. */
function split2(t) {
  const sp = [...t.matchAll(/[ -]/g)].map((m) => m.index);
  if (!sp.length) return [t];
  let best = sp[0];
  for (const i of sp) if (Math.abs(i - t.length / 2) < Math.abs(best - t.length / 2)) best = i;
  return [t.slice(0, best + (t[best] === '-' ? 1 : 0)).trim(), t.slice(best + 1).trim()];
}
/** Schreibt text zentriert in die Box (cx, cy, w, h): eine Zeile, wenn sie groß genug bleibt, sonst zwei. */
function fitText(ctx, text, cx, cy, w, h, color, weight = 'bold') {
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const one = fitFont(ctx, text, Math.round(h * 0.8), w, weight);
  if (one >= h * 0.5 || !/[ -]/.test(text)) {
    ctx.font = `${weight} ${one}px ${FONT}`;
    ctx.fillText(text, cx, cy + one * 0.05);
    return;
  }
  const L = split2(text);
  const s = Math.min(fitFont(ctx, L[0], Math.round(h * 0.42), w, weight), fitFont(ctx, L[1], Math.round(h * 0.42), w, weight));
  ctx.font = `${weight} ${s}px ${FONT}`;
  ctx.fillText(L[0], cx, cy - s * 0.55);
  ctx.fillText(L[1], cx, cy + s * 0.6);
}
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
/** Pfeil (Wegweiser) in der Box, Spitze nach dir ('left', 'right', 'up'). */
function arrow(ctx, cx, cy, s, dir, color) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(dir === 'left' ? Math.PI : dir === 'up' ? -Math.PI / 2 : 0);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-s * 0.45, -s * 0.12);
  ctx.lineTo(s * 0.05, -s * 0.12);
  ctx.lineTo(s * 0.05, -s * 0.34);
  ctx.lineTo(s * 0.48, 0);
  ctx.lineTo(s * 0.05, s * 0.34);
  ctx.lineTo(s * 0.05, s * 0.12);
  ctx.lineTo(-s * 0.45, s * 0.12);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Ortstafel (Zeichen 310) und Ortsende (Zeichen 311): gelb, schwarzer Rand, schwarze Schrift; Ende mit rotem Balken. */
function drawTownSign(ctx, W, H, { name, sub, next, exit }) {
  ctx.fillStyle = '#ffd23f';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#2d2d2b';
  ctx.lineWidth = H * 0.035;
  roundRect(ctx, H * 0.05, H * 0.05, W - H * 0.1, H * 0.9, H * 0.06);
  ctx.stroke();
  const pad = H * 0.13;
  let top = pad;
  if (exit && next) {
    // oben der nächste Ort, darunter ein feiner Strich
    fitText(ctx, next, W / 2, H * 0.21, W - 2 * pad, H * 0.2, '#2d2d2b');
    ctx.fillStyle = '#2d2d2b';
    ctx.fillRect(pad, H * 0.35, W - 2 * pad, H * 0.012);
    top = H * 0.38;
  }
  const bottom = sub ? H * 0.74 : H - pad;
  fitText(ctx, name, W / 2, (top + bottom) / 2, W - 2 * pad, bottom - top, '#2d2d2b');
  if (sub) fitText(ctx, sub, W / 2, H * 0.82, W - 2 * pad, H * 0.12, '#2d2d2b', 'normal');
  if (exit) {
    ctx.strokeStyle = '#d23a2c';
    ctx.lineWidth = H * 0.085;
    ctx.lineCap = 'butt';
    ctx.beginPath();
    ctx.moveTo(pad * 0.8, H - pad * 0.7);
    ctx.lineTo(W - pad * 0.8, top + pad * 0.1);
    ctx.stroke();
  }
}

/** Wegweiser: blau (Autobahn) oder gelb (Landstraße); Zeilen mit Zielen, Pfeil links oder rechts. */
function drawDirSign(ctx, W, H, { lines, dir, blue }) {
  const bg = blue ? '#1f5fae' : '#ffd23f';
  const fg = blue ? '#fdfbf5' : '#2d2d2b';
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = fg;
  ctx.lineWidth = H * 0.03;
  roundRect(ctx, H * 0.05, H * 0.05, W - H * 0.1, H * 0.9, H * 0.07);
  ctx.stroke();
  const aw = dir === 'up' ? 0 : H * 0.62;
  const ax = dir === 'left' ? H * 0.1 + aw / 2 : W - H * 0.1 - aw / 2;
  if (aw) arrow(ctx, ax, H / 2, aw, dir, fg);
  const x0 = dir === 'left' ? H * 0.1 + aw : H * 0.14;
  const x1 = dir === 'left' ? W - H * 0.14 : W - H * 0.1 - aw;
  const n = lines.length;
  const lh = (H * 0.78) / n;
  lines.forEach((t, i) => fitText(ctx, t, (x0 + x1) / 2, H * 0.11 + lh * (i + 0.5), x1 - x0, lh * 0.95, fg));
}

/** Stoffbanner: helles Tuch, Rand in Farbe, Schrift in Dunkel, Herzen an den Enden. */
function drawBanner(ctx, W, H, { text, col = '#e5483a' }) {
  ctx.fillStyle = '#fff6e0';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = col;
  ctx.fillRect(0, 0, W, H * 0.1);
  ctx.fillRect(0, H * 0.9, W, H * 0.1);
  for (const x of [H * 0.55, W - H * 0.55]) {
    ctx.beginPath();
    const s = H * 0.5;
    ctx.moveTo(x, H * 0.5 + s * 0.36);
    ctx.bezierCurveTo(x - s * 0.6, H * 0.5 - s * 0.05, x - s * 0.3, H * 0.5 - s * 0.5, x, H * 0.5 - s * 0.18);
    ctx.bezierCurveTo(x + s * 0.3, H * 0.5 - s * 0.5, x + s * 0.6, H * 0.5 - s * 0.05, x, H * 0.5 + s * 0.36);
    ctx.fill();
  }
  fitText(ctx, text, W / 2, H / 2, W - H * 2.2, H * 0.72, '#3a3f47');
}

/** Ziel-Tor: oben „ZIEL“, darunter der Name des Ziels. */
function drawGoal(ctx, W, H, { name }) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#ffe07a');
  g.addColorStop(1, '#ffc23a');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  // Zielflagge als Karomuster an den Enden
  const q = H / 4;
  for (const x0 of [0, W - 2 * q]) {
    for (let i = 0; i < 2; i++) for (let k = 0; k < 4; k++) {
      ctx.fillStyle = (i + k) % 2 ? '#3a3f47' : '#fdfbf5';
      ctx.fillRect(x0 + i * q, k * q, q, q);
    }
  }
  if (!name) {
    fitText(ctx, 'ZIEL', W / 2, H * 0.53, W - 5 * q, H * 0.86, '#d23a2c');
    return;
  }
  fitText(ctx, 'ZIEL', W / 2, H * 0.32, W - 5 * q, H * 0.56, '#d23a2c');
  fitText(ctx, name, W / 2, H * 0.76, W - 5 * q, H * 0.34, '#3a3f47');
}

/** Tafel mit Leinwand-Text als Mesh in einer Gruppe: Mitte (x, y, z), Drehung ry, Größe w × h. */
function panel(kit, g, key, w, h, px, draw, x, y, z, ry = 0) {
  const m = textPanel(kit.core, key, w, h, px, draw);
  m.position.set(x, y, z);
  m.rotation.y = ry;
  g.add(m);
  return m;
}
const shapeGeos = new Map();
/** Pfeilförmiger Wegweiser (gelb): Tafel w × h, Spitze nach rechts (dir 1) oder links (−1); UV über die Hülle. */
function arrowPanel(kit, g, key, w, h, dir, draw, x, y, z) {
  const gk = w + 'x' + h + ':' + dir;
  let geo = shapeGeos.get(gk);
  if (!geo) {
    const tip = h * 0.42;
    const pts = [[-w / 2, -h / 2], [w / 2 - tip, -h / 2], [w / 2, 0], [w / 2 - tip, h / 2], [-w / 2, h / 2]].map(([px, py]) => new THREE.Vector2(px * dir, py));
    if (dir < 0) pts.reverse();
    geo = new THREE.ShapeGeometry(new THREE.Shape(pts));
    const uv = geo.attributes.uv;
    const pos = geo.attributes.position;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5);
    shapeGeos.set(gk, geo);
  }
  const m = new THREE.Mesh(geo, textMaterial(kit.core, key, 512, Math.round((512 * h) / w), draw));
  m.position.set(x, y, z);
  m.receiveShadow = true;
  g.add(m);
  return m;
}

// --- Tabelle der Teile -------------------------------------------------------------------------------------------
const defs = {};
// o.shift: die Teile sind mit der Vorderseite (Theke, Schild) bei z = 0 gebaut; um o.shift nach +z verschoben liegt die
// Mitte der Grundfläche im Ursprung, wie bei allen Requisiten
const prop = (name, kind, make, o = {}) => {
  const m = o.shift ? (b, lod) => {
    let info;
    b.at(0, 0, o.shift, 0, () => {
      info = make(b, lod);
    });
    return info;
  } : make;
  defs[name] = { kind, far: o.far ?? true, fade: o.fade ?? 1.2, low: o.low ?? 0.82, tints: o.tints, make: m };
};

// --- Boden: Gehweg- und Platzkacheln (8 m), lückenlos aneinanderzulegen ------------------------------------------
// Oberkante 0,12 m über der Fahrbahn. Fugen als zwei sanft verschiedene Steintöne, damit es nach Pflaster aussieht,
// ohne eine Textur zu strecken.
const KERB = mix(PAL.stone, 0xffffff, 0.3);
const SLAB = [0xdcd5c9, 0xd0c8bb];
const COBBLE = [PAL.cobble, mix(PAL.cobble, 0x8f7f72, 0.3)];
const PLAZA = [mix(CITY.sand, 0xffffff, 0.25), mix(CITY.sand, PAL.stone, 0.55)];
const GROUND_Y = 0.12;
const STRIP = 2.2;
/** Farben des Gehwegs für den Straßenbau, der Bordstein und Gehweg der Orte selbst zieht (xxl/roadkit.js). */
export const PAVEMENT = { kerb: KERB, slab: SLAB, cobble: COBBLE };

/** Waagerechtes Rechteck x0..x1 × z0..z1 in Höhe y, schaut nach oben (ohne Bodenabdunklung). */
function flat(B, x0, z0, x1, z1, y, col) {
  B.poly([[x0, y, z0], [x0, y, z1], [x1, y, z1], [x1, y, z0]], col, { flat: true });
}

/**
 * Gehweg: L m lang (x −L/2 … L/2), Vorderkante = Bordsteinkante bei z = 0, reicht 5 m nach hinten bis zur Häuserflucht.
 * Bordstein mit runder Kante, 2,2 m Pflasterstreifen (Bäume, Laternen, Parkplätze), 2,8 m Plattenweg. 'pavement' ist
 * 8 m lang, 'pavement4' (4 m) schließt den Gehweg genau am Ortsende ab.
 */
function pavement(L) {
  return {
    kind: 'ground', far: true, fade: 0.2, low: 1,
    make(b) {
      const { F } = b;
      const near = b.lod === 0;
      const y = GROUND_Y;
      const h = L / 2;
      // Bordstein: Profil quer zur Straße, entlang x ausgezogen
      b.xf([0, 0, 0], [0, Math.PI / 2, 0], 1, () => F.extrude([[0, -0.06], [0, y - 0.035], [0.035, y], [0.26, y], [0.26, -0.06]], -h, h, KERB, { crease: 0.5 }));
      const rows = (near ? 2 : 0.5) * L;
      for (let i = 0; i < rows; i++) flat(F, -h + (L * i) / rows, -STRIP, -h + (L * (i + 1)) / rows, -0.26, y, COBBLE[i % 2]);
      const slabs = (near ? 1 : 0.25) * L;
      for (let i = 0; i < slabs; i++) {
        for (let j = 0; j < (near ? 3 : 1); j++) {
          const z0 = -STRIP - (2.8 * j) / (near ? 3 : 1);
          flat(F, -h + i * (L / slabs), z0 - 2.8 / (near ? 3 : 1), -h + (i + 1) * (L / slabs), z0, y, SLAB[(i + j) % 2]);
        }
      }
      // Rückseite (unter der Hauswand; von hinten sichtbar in Lücken zwischen Häusern)
      b.at(0, 0, -5, Math.PI, () => F.rect(0, -0.06, 0, L, y + 0.06, mix(PAL.stone, CITY.ink, 0.15), { flat: true }));
      return { w: L, d: 5, h: y };
    },
  };
}
defs.pavement = pavement(8);
defs.pavement4 = pavement(4);

/** Platzpflaster 8 × 8 m (Ursprung in der Mitte): helle Platten im Wechsel, ein Band aus Kleinpflaster am Rand. */
defs.plaza = {
  kind: 'ground', far: true, fade: 0.2, low: 1,
  make(b) {
    const { F } = b;
    const near = b.lod === 0;
    const n = near ? 4 : 1;
    const q = 8 / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) flat(F, -4 + i * q, -4 + j * q, -4 + (i + 1) * q, -4 + (j + 1) * q, GROUND_Y, PLAZA[(i + j) % 2]);
    return { w: 8, d: 8, h: GROUND_Y, r: 4 };
  },
};

/** Rasenstück 8 × 8 m (Ursprung in der Mitte), zwei Grüntöne im Wechsel: für Grünstreifen und kleine Parks. */
const LAWN = [mix(PAL.grass[0], PAL.grass[1], 0.35), mix(PAL.grass[1], PAL.grass[2], 0.2)];
defs.lawn = {
  kind: 'ground', far: true, fade: 0.2, low: 1,
  make(b) {
    const n = b.lod === 0 ? 2 : 1;
    const q = 8 / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) flat(b.F, -4 + i * q, -4 + j * q, -4 + (i + 1) * q, -4 + (j + 1) * q, GROUND_Y, LAWN[(i + j) % 2]);
    return { w: 8, d: 8, h: GROUND_Y, r: 4 };
  },
};

// --- Laternen ----------------------------------------------------------------------------------------------------
prop('lampOld', 'lamp', (b) => {
  const { F } = b;
  const near = b.lod === 0;
  // Sockel mit Kehle, schlanker Schaft, Zierring, Laternenkopf
  F.lathe(0, 0, 0, [[0.22, 0], [0.22, 0.08], [0.16, 0.14], [0.13, 0.45], [0.09, 0.62], [0.065, 0.7]], GREEN_IRON, { seg: near ? 12 : 6, ks: [0.75, 0.82, 0.86, 0.9, 0.95, 1] });
  F.cyl(0, 0.7, 0, 0.06, 0.05, 2.75, GREEN_IRON, { seg: near ? 10 : 6, top: false });
  if (near) F.torus(0, 2.2, 0, 0.065, 0.025, GREEN_IRON, { seg: 10, tube: 4 });
  F.lathe(0, 3.4, 0, [[0.05, 0], [0.1, 0.06], [0.07, 0.1]], GREEN_IRON, { seg: 8 });
  lantern(b, 0, 3.48, 0, 1.15);
  return { w: 0.5, d: 0.5, h: 4.3 };
});
prop('lampModern', 'lamp', (b) => {
  const { F, G } = b;
  const near = b.lod === 0;
  F.lathe(0, 0, 0, [[0.16, 0], [0.16, 0.05], [0.1, 0.12], [0.085, 0.4]], POLE, { seg: near ? 10 : 6, top: false, ks: [0.75, 0.85, 0.9, 1] });
  // Mast mit weichem Bogen über die Fahrbahn (+z)
  const pts = [];
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    const a = Math.max(0, (t - 0.55) / 0.45) * (Math.PI / 2);
    pts.push([0, 0.4 + Math.min(t, 0.55) / 0.55 * 5.6 + Math.sin(a) * 0.9, (1 - Math.cos(a)) * 0.9 + Math.max(0, (t - 1)) * 0]);
  }
  pts.push([0, 6.9, 1.6]);
  for (let i = 0; i < pts.length - 1; i++) F.rod(pts[i], pts[i + 1], 0.075 - i * 0.003, POLE, { seg: near ? 8 : 5, caps: i === pts.length - 2 });
  // flacher, runder Leuchtenkopf mit heller Unterseite
  F.lathe(0, 6.72, 1.75, [[0.05, 0], [0.34, 0.06], [0.36, 0.14], [0.2, 0.24], [0.04, 0.26]], POLE, { seg: near ? 14 : 8, ks: [0.9, 1, 1.04, 1, 1] });
  G.disc(0, 6.715, 1.75, 0.3, LIT.warm, { up: true, seg: near ? 14 : 8, flat: true });
  return { w: 0.5, d: 2.2, h: 7.0, over: 2.1 };
});

// --- Ampel -------------------------------------------------------------------------------------------------------
function trafficLight(b, state) {
  const { F, G, L } = b;
  const near = b.lod === 0;
  post(b, 0, 0, 3.0, 0.07, PAL.darkMetal);
  // Gehäuse mit Blenden, drei Lichter
  F.rbox(0, 2.05, 0.12, 0.38, 1.05, 0.26, 0.08, mix(PAL.darkMetal, 0x000000, 0.2), { seg: 3, ks: [0.9, 1], prof: [[0, 0], [0, 1.05]] });
  F.box(0, 2.05 - 0.02, 0, 0.12, 0.08, 0.08, PAL.darkMetal);
  const lamps = [['red', 2.88], ['amber', 2.58], ['green', 2.28]];
  for (const [k, y] of lamps) {
    const on = state === k;
    (on ? L : G).disc(0, y, 0.255, 0.105, on ? LIT[k] : DARK[k], { seg: near ? 16 : 8, flat: on });
    if (near) b.xf([0, y + 0.02, 0.25], [Math.PI / 2, 0, 0], 1, () => F.lathe(0, 0, 0, [[0.13, 0], [0.13, 0.12], [0.12, 0.12], [0.12, 0]], CITY.ink, { seg: 12, a0: -Math.PI / 2, a1: Math.PI / 2, top: false }));
  }
  // weißer Rand ums Gehäuse (Kontrasttafel)
  G.rect(0, 1.98, 0.247, 0.54, 1.19, PAL.frame);
  G.rect(0, 2.04, 0.249, 0.38, 1.07, mix(PAL.darkMetal, 0x000000, 0.2));
  return { w: 0.6, d: 0.5, h: 3.1 };
}
prop('trafficLight', 'signal', (b) => trafficLight(b, 'red'));
prop('trafficLightRed', 'signal', (b) => trafficLight(b, 'red'));
prop('trafficLightAmber', 'signal', (b) => trafficLight(b, 'amber'));
prop('trafficLightGreen', 'signal', (b) => trafficLight(b, 'green'));

// --- Haltestelle, Litfaßsäule ------------------------------------------------------------------------------------
prop('busStop', 'stop', (b) => {
  const { F, G } = b;
  post(b, 0, 0, 2.95, 0.05, POLE);
  // Schild beidseitig, Fahrplankasten
  for (const s of [0, Math.PI]) b.at(0, 0, 0, s, () => G.sign(0, 2.3, 0.035, 0.6, 'y:bus'));
  F.rbox(0, 2.28, 0, 0.66, 0.64, 0.06, 0.06, PAL.frame, { seg: 3, prof: [[0, 0], [0, 0.64]] });
  F.rbox(0, 1.15, 0.06, 0.42, 0.56, 0.06, 0.03, PAL.signYellow, { seg: 2, prof: [[0, 0], [0, 0.56]] });
  G.rect(0, 1.2, 0.092, 0.34, 0.46, PAL.frame);
  if (b.lod === 0) for (let i = 0; i < 5; i++) G.rect(0, 1.28 + i * 0.08, 0.094, 0.26, 0.025, CITY.ink, { k: 0.9 });
  return { w: 0.7, d: 0.3, h: 3.0 };
});
/**
 * Straßenbahnhalt der Großstadt (5,6 × 1,7 m): Wartehäuschen mit gerundetem Dach, Rückwand und Seiten aus Glas, Bank,
 * Anzeige unter der Dachkante (orange Leuchtpunkte statt Schrift), am Ende der Haltestellenmast mit grünem „H“-Schild
 * und Straßenbahn-Zeichen, am anderen Ende ein Fahrkartenautomat. Die offene Seite schaut nach +z (zur Fahrbahn).
 */
prop('tramStop', 'stop', (b) => {
  const { F, G, L } = b;
  const near = b.lod === 0;
  const w = 4.2;
  const z0 = -0.55;
  const glass = mix(PAL.glass, 0xffffff, 0.25);
  // Dach: flache, rund gekantete Platte mit leichtem Gefälle, Rinne vorn
  F.rbox(0, 2.5, -0.05, w + 0.5, 0.14, 1.75, 0.3, POLE, { seg: near ? 3 : 1, bottom: true, prof: [[0, 0], [0, 0.1], [0.05, 0.14]], ks: [0.9, 1, 1.05] });
  F.rbox(0, 2.42, 0.62, w + 0.3, 0.1, 0.2, 0.05, mix(POLE, CITY.ink, 0.2), { seg: 1 });
  // vier Pfosten, Rückwand und Seiten aus Glas mit hellen Rahmen
  for (const x of [-w / 2, w / 2]) for (const z of [z0 - 0.15, 0.55]) F.cyl(x, 0, z, 0.06, 0.06, 2.5, POLE, { seg: near ? 8 : 5 });
  b.at(0, 0, z0 - 0.16, 0, () => {
    G.rect(0, 0.18, 0.01, w - 0.12, 2.18, glass, { g: [1.08, 0.92] });
    if (near) for (const y of [0.18, 1.1, 2.33]) G.rect(0, y, 0.015, w - 0.1, 0.06, POLE);
  });
  for (const s of [-1, 1]) b.at(s * (w / 2), 0, (z0 + 0.4) / 2, s * Math.PI / 2, () => G.rect(0, 0.18, 0.01, 0.75, 2.18, glass, { g: [1.08, 0.92] }));
  // Werbefeld rechts in der Rückwand (Plakat aus dem Atlas), Bank in der Mitte
  b.at(w / 2 - 0.75, 0, z0 - 0.14, 0, () => G.rect(0, 0.4, 0.03, 1.1, 1.65, 0xffffff, { uv: atlasUV('p:live') }));
  bench(b, -0.5, 0, z0 + 0.32, 0, { w: 1.8 });
  // Anzeige unter dem Dach: dunkler Kasten, orange Punkte als Zeilen
  F.rbox(-0.6, 2.06, 0.5, 1.5, 0.34, 0.14, 0.05, IRON, { seg: 1 });
  F.cyl(-1.2, 2.4, 0.5, 0.025, 0.025, 0.1, IRON, { seg: 4 });
  F.cyl(0.0, 2.4, 0.5, 0.025, 0.025, 0.1, IRON, { seg: 4 });
  if (near) {
    G.rect(-0.6, 2.1, 0.575, 1.38, 0.26, mix(CITY.ink, 0x000000, 0.3));
    for (let r = 0; r < 2; r++) for (let i = 0; i < 9; i++) if ((i * 7 + r * 3) % 5 !== 0) L.box(-1.2 + i * 0.13, 2.15 + r * 0.1, 0.578, 0.08, 0.05, 0.004, 0xffa53a);
  }
  // Haltestellenmast mit „H“ und dem Wort „Tram“ darunter (beidseitig), Fahrplan
  post(b, -w / 2 - 0.55, 0.45, 3.05, 0.05, POLE);
  F.rbox(-w / 2 - 0.55, 2.36, 0.45, 0.66, 0.64, 0.06, 0.06, PAL.frame, { seg: 2, prof: [[0, 0], [0, 0.64]] });
  F.rbox(-w / 2 - 0.55, 1.86, 0.45, 0.5, 0.46, 0.06, 0.05, PAL.frame, { seg: 2, prof: [[0, 0], [0, 0.46]] });
  for (const s of [0, Math.PI]) b.at(-w / 2 - 0.55, 0, 0.45, s, () => {
    G.sign(0, 2.41, 0.035, 0.55, 'y:bus');
    G.sign(0, 1.9, 0.035, 0.4, 'y:tram');
  });
  F.rbox(-w / 2 - 0.55, 1.15, 0.51, 0.4, 0.55, 0.06, 0.03, 0x2f8f4e, { seg: 2, prof: [[0, 0], [0, 0.55]] });
  G.rect(-w / 2 - 0.55, 1.2, 0.545, 0.32, 0.44, PAL.frame);
  // Fahrkartenautomat am rechten Ende
  F.rbox(w / 2 + 0.55, 0, 0.3, 0.55, 1.6, 0.4, 0.06, mix(PAL.steel, 0xffffff, 0.35), { seg: near ? 2 : 1 });
  F.rbox(w / 2 + 0.55, 1.6, 0.3, 0.6, 0.12, 0.45, 0.06, 0x2f8f4e, { seg: near ? 2 : 1 });
  if (near) {
    G.rect(w / 2 + 0.55, 1.05, 0.505, 0.36, 0.3, CITY.ink, { g: [1.15, 0.85] });
    G.rect(w / 2 + 0.55, 0.6, 0.505, 0.24, 0.1, PAL.signYellow);
  }
  return { w: 5.6, d: 1.7, h: 3.1 };
});
prop('adColumn', 'stop', (b) => {
  const { F, G } = b;
  const near = b.lod === 0;
  const r = 0.62;
  const seg = near ? 24 : 10;
  F.lathe(0, 0, 0, [[r + 0.12, 0], [r + 0.12, 0.2], [r + 0.04, 0.3], [r, 0.34]], GREEN_IRON, { seg, top: false, ks: [0.75, 0.85, 0.9, 1] });
  F.cyl(0, 0.34, 0, r, r, 2.66, PAL.frame, { seg, top: false, k: 0.96 });
  // Plakate rundum: drei Felder aus dem Atlas, jedes über ein Drittel des Umfangs
  const keys = ['p:fest', 'p:live', 'p:floh'];
  const y0 = 0.62;
  const y1 = 2.82;
  for (let k = 0; k < 3; k++) {
    const [u0, v0, u1, v1] = atlasUV(keys[k]);
    const n = near ? 8 : 3;
    const P = [];
    const N = [];
    const UV = [];
    const idx = [];
    const a0 = (k / 3) * TAU + 0.12;
    const a1 = ((k + 1) / 3) * TAU - 0.12;
    for (let i = 0; i <= n; i++) {
      const a = a0 + ((a1 - a0) * i) / n;
      const s = Math.sin(a);
      const c = Math.cos(a);
      P.push(s * (r + 0.012), y0, c * (r + 0.012), s * (r + 0.012), y1, c * (r + 0.012));
      N.push(s, 0, c, s, 0, c);
      const u = u0 + ((u1 - u0) * i) / n;
      UV.push(u, v0, u, v1);
      if (i < n) idx.push(i * 2, i * 2 + 2, i * 2 + 3, i * 2, i * 2 + 3, i * 2 + 1);
    }
    G.mesh(P, N, idx, 0xffffff, null, UV);
  }
  // Kranz und Haube mit Knauf
  F.lathe(0, 3.0, 0, [[r, 0], [r + 0.14, 0.08], [r + 0.16, 0.22], [r + 0.04, 0.3], [r * 0.7, 0.62], [r * 0.3, 0.8], [0, 0.86]], GREEN_IRON, { seg, ks: [0.8, 0.95, 1, 0.95, 1, 1.05, 1.05] });
  F.ball(0, 3.92, 0, 0.09, CITY.gold, { ws: 8, hs: 5 });
  return { w: 1.5, d: 1.5, h: 4.0, r: 0.75 };
});
// --- Sitzen, Müll, Post, Hydrant, Poller -------------------------------------------------------------------------
prop('bench', 'seat', (b) => {
  bench(b, 0, 0, 0, 0);
  return { w: 2.0, d: 0.7, h: 0.95 };
});
prop('benchPark', 'seat', (b) => {
  const { F } = b;
  const w = 1.8;
  for (const s of [-1, 1]) {
    // geschwungene Gusseisen-Wangen
    F.rod([s * (w / 2 - 0.15), 0, 0.22], [s * (w / 2 - 0.15), 0.42, 0.12], 0.035, GREEN_IRON, { seg: 6 });
    F.rod([s * (w / 2 - 0.15), 0, -0.22], [s * (w / 2 - 0.15), 0.42, -0.14], 0.035, GREEN_IRON, { seg: 6 });
    F.rod([s * (w / 2 - 0.15), 0.42, 0.18], [s * (w / 2 - 0.15), 0.42, -0.22], 0.03, GREEN_IRON, { seg: 6 });
    F.rod([s * (w / 2 - 0.15), 0.42, -0.2], [s * (w / 2 - 0.15), 0.86, -0.32], 0.03, GREEN_IRON, { seg: 6 });
    F.rod([s * (w / 2 - 0.15), 0.62, 0.18], [s * (w / 2 - 0.15), 0.62, 0.02], 0.025, GREEN_IRON, { seg: 6 });
    F.ball(s * (w / 2 - 0.15), 0.64, 0.18, 0.04, GREEN_IRON, { ws: 6, hs: 4 });
  }
  for (let i = 0; i < 4; i++) F.rbox(0, 0.42, 0.14 - i * 0.1, w, 0.04, 0.085, 0.02, CITY.wood, { seg: 2, k: 1 - (i % 2) * 0.05 });
  for (let i = 0; i < 3; i++) b.xf([0, 0.52 + i * 0.12, -0.24 - i * 0.03], [-0.26, 0, 0], 1, () => F.rbox(0, 0, 0, w, 0.085, 0.035, 0.015, CITY.wood, { seg: 2 }));
  return { w: 2.0, d: 0.7, h: 0.92 };
});
prop('bin', 'small', (b) => {
  const { F } = b;
  const near = b.lod === 0;
  post(b, 0, -0.18, 1.05, 0.04, POLE);
  F.lathe(0, 0.45, 0.06, [[0.2, 0], [0.24, 0.05], [0.25, 0.5], [0.27, 0.53], [0.27, 0.58], [0.2, 0.6], [0.08, 0.62]], 0x3f7d55, { seg: near ? 14 : 8, bottom: true, ks: [0.75, 0.85, 1, 1, 1.05, 1, 0.9] });
  if (near) F.lathe(0, 0.97, 0.06, [[0.1, 0], [0.1, 0.03]], CITY.ink, { seg: 10, top: true });
  return { w: 0.6, d: 0.6, h: 1.1 };
});
prop('postBox', 'small', (b) => {
  const { F, G } = b;
  post(b, 0, -0.1, 1.0, 0.05, PAL.signYellow);
  F.rbox(0, 0.62, 0.05, 0.56, 0.62, 0.36, 0.1, PAL.signYellow, { seg: 3, prof: [[0, 0], [0, 0.5], [0.06, 0.62]], ks: [0.86, 1, 1.05] });
  F.box(0, 1.08, 0.05, 0.62, 0.05, 0.42, mix(PAL.signYellow, 0x8a5a1c, 0.3));
  G.rect(0, 1.0, 0.232, 0.36, 0.035, CITY.ink);
  G.sign(0, 0.72, 0.232, 0.26, 'y:mail');
  return { w: 0.6, d: 0.45, h: 1.15 };
});
prop('hydrant', 'small', (b) => {
  const { F } = b;
  const near = b.lod === 0;
  const red = 0xd8473a;
  F.lathe(0, 0, 0, [[0.2, 0], [0.2, 0.06], [0.14, 0.1], [0.13, 0.62], [0.16, 0.66], [0.16, 0.72], [0.1, 0.8], [0.05, 0.86]], red, { seg: near ? 12 : 6, ks: [0.75, 0.82, 0.86, 1, 1, 1.05, 1.05, 1] });
  F.ball(0, 0.86, 0, 0.05, PAL.signYellow, { ws: 8, hs: 4 });
  for (const s of [-1, 1]) b.xf([s * 0.13, 0.48, 0], [0, 0, s * -Math.PI / 2], 1, () => F.cyl(0, 0, 0, 0.065, 0.065, 0.1, PAL.signYellow, { seg: 8 }));
  if (near) b.xf([0, 0.42, 0.13], [Math.PI / 2, 0, 0], 1, () => F.cyl(0, 0, 0, 0.08, 0.08, 0.08, red, { seg: 8 }));
  return { w: 0.45, d: 0.4, h: 0.9 };
});
prop('bollard', 'small', (b) => {
  const { F, G } = b;
  F.lathe(0, 0, 0, [[0.11, 0], [0.11, 0.78], [0.09, 0.86], [0.04, 0.9], [0, 0.91]], POLE, { seg: b.lod > 0 ? 6 : 12, ks: [0.75, 1, 1.04, 1.04, 1] });
  G.lathe(0, 0.66, 0, [[0.113, 0], [0.113, 0.07]], PAL.red, { seg: b.lod > 0 ? 6 : 12, top: false });
  return { w: 0.25, d: 0.25, h: 0.92 };
});
prop('bollards3', 'small', (b) => {
  const { F, G } = b;
  for (const x of [-1.2, 0, 1.2]) {
    F.lathe(x, 0, 0, [[0.11, 0], [0.11, 0.78], [0.09, 0.86], [0.04, 0.9], [0, 0.91]], POLE, { seg: b.lod > 0 ? 6 : 12, ks: [0.75, 1, 1.04, 1.04, 1] });
    G.lathe(x, 0.66, 0, [[0.113, 0], [0.113, 0.07]], PAL.red, { seg: b.lod > 0 ? 6 : 12, top: false });
  }
  return { w: 2.7, d: 0.25, h: 0.92 };
});

// --- Fahrräder, Parkuhr, Telefon ---------------------------------------------------------------------------------
prop('bikeStand', 'small', (b) => {
  const { F } = b;
  const near = b.lod === 0;
  // Anlehnbügel: umgedrehtes U aus Rohr (zwei Pfosten, oben ein Halbkreis), längs zur Straße
  for (const x of [-0.9, 0, 0.9]) {
    for (const z of [-0.3, 0.3]) F.cyl(x, 0, z, 0.032, 0.032, 0.52, POLE, { seg: near ? 8 : 5, top: false });
    b.xf([x, 0.52, 0], [0, 0, Math.PI / 2], 1, () => F.torus(0, 0, 0, 0.3, 0.032, POLE, { seg: near ? 10 : 6, tube: near ? 6 : 4, a0: 0, a1: Math.PI }));
  }
  if (near) {
    bike(b, -0.55, 0, 0x3f8fd0);
    bike(b, 0.45, 0, 0xe5483a);
  }
  return { w: 2.4, d: 1.4, h: 1.1 };
});
prop('parkingMeter', 'small', (b) => {
  const { F, G } = b;
  post(b, 0, 0, 1.0, 0.045, POLE);
  F.rbox(0, 0.95, 0.03, 0.34, 0.62, 0.24, 0.06, PAL.steel, { seg: 3, prof: [[0, 0], [0, 0.55], [0.04, 0.62]], ks: [0.86, 1, 1.05] });
  G.rect(0, 1.3, 0.152, 0.22, 0.14, mix(PAL.glass, PAL.glassDark, 0.5));
  G.sign(0, 1.04, 0.152, 0.16, 'y:park');
  return { w: 0.4, d: 0.3, h: 1.6 };
});
/** Telefonzelle, Mitte im Ursprung: Pfosten, Kern und Dach in der Instanzfarbe, Scheiben ringsum, Hörer-Zeichen oben. */
function phoneBooth(b, red) {
  const { F, G, T } = b;
  const w = 1.0;
  const h = red ? 2.4 : 2.25;
  const e = w / 2 - 0.05; // Ebene der Scheiben (Mitte der Eckpfosten)
  F.rbox(0, 0, 0, w + 0.16, 0.1, w + 0.16, 0.06, PAL.stone, { seg: 2 });
  T.box(0, 0.1, 0, 2 * e - 0.02, h - 0.3, 2 * e - 0.02, 0xffffff, { skip: 'bt' });
  for (const [x, z] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) T.rbox(x * e, 0.1, z * e, 0.13, h - 0.25, 0.13, 0.045, 0xffffff, { seg: 2, top: false, ks: [0.9, 1.04] });
  const pane = mix(PAL.glass, 0xffffff, 0.3);
  b.at(0, 0, e, 0, () => b.sides(2 * e, 2 * e, (len, side) => {
    if (red) {
      // viele kleine Scheiben in Sprossen (die Sprossen sind der rote Kern)
      for (let i = 0; i < 6; i++) for (let k = 0; k < 3; k++) G.rect(-0.25 + k * 0.25, 0.52 + i * 0.26, 0, 0.2, 0.21, pane, { g: [1.08, 0.9] });
    } else {
      G.rect(0, 0.42, 0, len - 0.16, h - 1.0, pane, { g: [1.1, 0.85] });
      G.rect(0, 0.42 + (h - 1.0) * 0.55, 0.004, len - 0.16, 0.05, PAL.frame, { k: 0.95 });
    }
    if (side === 'f') G.box(len / 2 - 0.16, 1.05, 0.03, 0.04, 0.32, 0.05, PAL.frame);
  }, 'frkl'));
  if (red) {
    // dunkles Leuchtband mit Hörer, darüber das Gewölbe
    T.rbox(0, h - 0.2, 0, w + 0.06, 0.34, w + 0.06, 0.06, 0xffffff, { seg: 2 });
    b.at(0, 0, w / 2 + 0.031, 0, () => b.sides(w + 0.06, w + 0.06, () => G.sign(0, h - 0.17, 0.002, 0.28, 'y:phoneRed'), 'frkl'));
    T.lathe(0, h + 0.14, 0, [[0.6, 0], [0.56, 0.08], [0.38, 0.2], [0.1, 0.28], [0, 0.29]], 0xffffff, { seg: 4, a0: Math.PI / 4, a1: Math.PI / 4 + TAU, facet: true });
    F.ball(0, h + 0.44, 0, 0.07, CITY.gold, { ws: 8, hs: 4 });
    return { w: w + 0.16, d: w + 0.16, h: h + 0.52 };
  }
  // flaches Dach, darauf ein Leuchtkasten mit dem Hörer-Zeichen
  T.rbox(0, h - 0.15, 0, w + 0.1, 0.18, w + 0.1, 0.06, 0xffffff, { seg: 2 });
  F.rbox(0, h + 0.03, 0, 0.42, 0.36, 0.42, 0.05, PAL.frame, { seg: 2 });
  b.at(0, 0, 0.211, 0, () => b.sides(0.422, 0.422, () => G.sign(0, h + 0.07, 0.002, 0.28, 'y:phone'), 'frkl'));
  return { w: w + 0.16, d: w + 0.16, h: h + 0.4 };
}
prop('phoneBox', 'small', (b) => phoneBooth(b, false), { tints: [PAL.signYellow] });
prop('phoneBoxRed', 'small', (b) => phoneBooth(b, true), { tints: [0xd23a2c] });

// --- Grün ---------------------------------------------------------------------------------------------------------
prop('flowerTub', 'green', (b) => {
  tub(b, 0, 0, 0, 0.5);
  return { w: 1.1, d: 1.1, h: 1.0 };
});
prop('flowerTubSquare', 'green', (b) => {
  const { F } = b;
  F.rbox(0, 0, 0, 1.0, 0.55, 1.0, 0.1, CITY.wood, { seg: 2, prof: [[0, 0], [0, 0.5], [-0.03, 0.55]], ks: [0.8, 1, 1.05] });
  F.box(0, 0.5, 0, 0.9, 0.04, 0.9, CITY.leafDark);
  if (b.lod === 0) for (let i = 0; i < 9; i++) blossom(b, -0.3 + (i % 3) * 0.3, 0.64 + (i % 2) * 0.05, -0.3 + Math.floor(i / 3) * 0.3, 0.15, i % 4 === 3 ? CITY.leaf : [PAL.red, PAL.signYellow, 0xf4a6c0][i % 3]);
  else F.ball(0, 0.56, 0, 0.45, PAL.red, { ws: 6, hs: 3, sy: 0.5 });
  return { w: 1.0, d: 1.0, h: 0.85 };
});
prop('flowerBed', 'green', (b) => {
  flowerBed(b, 0, 0, 0, 1.4);
  return { w: 2.8, d: 2.8, h: 0.45, r: 1.4 };
});
/** Straßenbaum mit Baumscheibe (Gitter) und Schutzbügeln; die Krone aus weichen Ballen (parts.js puffs). */
function streetTree(b, crown, tall) {
  const { F, G } = b;
  const near = b.lod === 0;
  F.box(0, 0, 0, 1.6, 0.06, 1.6, IRON, { skip: 'b' });
  // Gitterstäbe neben der Baumscheibe (nicht durch den Stamm), Schutzbügel 7 cm dick
  if (near) for (const x of [-0.6, 0.6]) G.box(x, 0.06, 0, 0.05, 0.004, 1.4, mix(IRON, 0x000000, 0.3), { skip: 'b' });
  F.disc(0, 0.062, 0, 0.3, PAL.earth, { up: true, seg: 8 });
  if (near) for (const s of [-1, 1]) b.xf([0, 0, s * 0.62], [Math.PI / 2, 0, Math.PI / 2], 1, () => F.torus(0, 0, 0, 0.45, 0.035, POLE, { seg: 6, tube: 4, a0: 0, a1: Math.PI }));
  if (tall) {
    // Säulenbaum: schlanke, hohe Krone aus drei übereinander liegenden Ballen
    F.lathe(0, 0, 0, [[0.16, 0], [0.12, 0.3], [0.1, 2.4]], PAL.trunk, { seg: 6, top: false });
    puffs(b, near ? [[0, 3.6, 0, 1.0, 1.25], [0.05, 4.95, 0.04, 0.92, 1.2], [-0.03, 6.1, -0.02, 0.7, 1.15]] : [[0, 4.6, 0, 1.0, 2.35]], [crown, mix(crown, 0xffffff, 0.08), mix(crown, 0xffffff, 0.14)], { soft: 0.6, g: [0.8, 1.1] });
    return { w: 2.2, d: 2.2, h: 7.0, r: 1.1 };
  }
  ballTree(b, 0, 0, 0, 1.9, 6.2, crown);
  return { w: 4.0, d: 4.0, h: 6.6, r: 2.0 };
}
prop('streetTree', 'tree', (b) => streetTree(b, PAL.crown[1], false), { tints: [0xffffff] });
prop('streetTree2', 'tree', (b) => streetTree(b, PAL.crown[0], false));
prop('streetTreeTall', 'tree', (b) => streetTree(b, PAL.conifer[0], true));
// Bäume auf Rasen (Rastanlage, Parks): ohne Gitter, mit kräftigerer Krone; Fichte für Baumgürtel
prop('parkTree', 'tree', (b) => {
  ballTree(b, 0, 0, 0, 2.3, 6.8, PAL.crown[1]);
  return { w: 4.8, d: 4.8, h: 7.3, r: 2.4 };
});
prop('parkTree2', 'tree', (b) => {
  ballTree(b, 0, 0, 0, 2.0, 5.9, PAL.crown[3]);
  return { w: 4.2, d: 4.2, h: 6.3, r: 2.1 };
});
prop('spruce', 'tree', (b) => {
  spruce(b, 0, 0, 0, 2.3, 8.5, PAL.conifer[0]);
  return { w: 4.6, d: 4.6, h: 8.5, r: 2.3 };
});

// --- Markt ---------------------------------------------------------------------------------------------------------
/** Marktstand 3 × 2 m: Tisch, vier Stangen, gestreiftes Dach (Streifen in der Instanzfarbe), Ware nach goods. */
function stall(b, goods) {
  const { F, T } = b;
  const near = b.lod === 0;
  const w = 3.0;
  const d = 2.0;
  for (const [x, z] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) F.cyl((x * w) / 2 - x * 0.08, 0, (z * d) / 2 - z * 0.08, 0.04, 0.04, 2.35, CITY.woodDark, { seg: 6 });
  F.rbox(0, 0.78, 0.2, w - 0.1, 0.08, d * 0.62, 0.04, CITY.wood, { seg: 2 });
  F.rbox(0, 0, 0.2, w - 0.2, 0.78, d * 0.6, 0.04, mix(CITY.wood, 0xffffff, 0.15), { seg: 2, prof: [[0, 0], [0, 0.78]], top: false, ks: [0.8, 1] });
  // Satteldach aus Stoff, Streifen quer, Volant vorn
  const n = near ? 7 : 3;
  for (let i = 0; i < n; i++) {
    const x0 = -w / 2 - 0.15 + ((w + 0.3) * i) / n;
    const x1 = -w / 2 - 0.15 + ((w + 0.3) * (i + 1)) / n;
    const part = i % 2 ? b.F : T;
    const c = i % 2 ? PAL.frame : 0xffffff;
    part.quad([x0, 2.35, d / 2 + 0.2], [x1, 2.35, d / 2 + 0.2], [x1, 2.75, 0], [x0, 2.75, 0], c);
    part.quad([x0, 2.75, 0], [x1, 2.75, 0], [x1, 2.35, -d / 2 - 0.2], [x0, 2.35, -d / 2 - 0.2], c, { k: 0.9 });
    part.quad([x0, 2.12, d / 2 + 0.2], [x1, 2.12, d / 2 + 0.2], [x1, 2.35, d / 2 + 0.2], [x0, 2.35, d / 2 + 0.2], c, { k: 0.95 });
  }
  // Untersicht und Giebel
  F.quad([-w / 2 - 0.15, 2.35, -d / 2 - 0.2], [w / 2 + 0.15, 2.35, -d / 2 - 0.2], [w / 2 + 0.15, 2.74, 0], [-w / 2 - 0.15, 2.74, 0], 0xf3ead8, { k: 0.8 });
  F.quad([-w / 2 - 0.15, 2.74, 0], [w / 2 + 0.15, 2.74, 0], [w / 2 + 0.15, 2.35, d / 2 + 0.2], [-w / 2 - 0.15, 2.35, d / 2 + 0.2], 0xf3ead8, { k: 0.8 });
  for (const s of [-1, 1]) {
    const x = (s * (w + 0.3)) / 2;
    const tri = [[x, 2.35, d / 2 + 0.2], [x, 2.75, 0], [x, 2.35, -d / 2 - 0.2]];
    if (s > 0) T.tri(tri[0], tri[2], tri[1], 0xffffff, { k: 0.85 });
    else T.tri(tri[0], tri[1], tri[2], 0xffffff, { k: 0.85 });
  }
  if (!near) return;
  goods(b);
}
const crates = (cols) => (b) => {
  for (let i = 0; i < 4; i++) {
    const x = -1.05 + i * 0.7;
    b.F.frust(x, 0.86, 0.32, 0.56, 0.42, 0.62, 0.48, 0.16, CITY.wood, { skip: 'b' });
    for (let k = 0; k < 6; k++) blossom(b, x - 0.18 + (k % 3) * 0.18, 1.04, 0.22 + Math.floor(k / 3) * 0.2, 0.1, cols[i % cols.length]);
  }
};
prop('stallFruit', 'market', (b) => {
  stall(b, crates([PAL.red, PAL.orange, PAL.signYellow, CITY.leaf]));
  return { w: 3.4, d: 2.5, h: 2.8 };
}, { tints: [PAL.awning[0], PAL.awning[1], PAL.awning[2], PAL.awning[3]] });
prop('stallFlowers', 'market', (b) => {
  stall(b, (bb) => {
    for (let i = 0; i < 5; i++) {
      const x = -1.15 + i * 0.58;
      bb.F.cyl(x, 0.86, 0.3, 0.16, 0.2, 0.3, [PAL.darkMetal, CITY.woodDark][i % 2], { seg: 8 });
      for (let k = 0; k < 4; k++) blossom(bb, x + Math.sin(k * 1.7) * 0.1, 1.26 + (k % 2) * 0.08, 0.3 + Math.cos(k * 1.7) * 0.1, 0.11, [PAL.red, 0xf4a6c0, PAL.signYellow, 0xb07cc6, PAL.frame][(i + k) % 5]);
    }
  });
  return { w: 3.4, d: 2.5, h: 2.8 };
}, { tints: [PAL.awning[2], PAL.awning[3], 0xf4a6c0] });
prop('stallBakery', 'market', (b) => {
  stall(b, (bb) => {
    for (let i = 0; i < 6; i++) {
      const x = -1.1 + i * 0.44;
      bb.F.ball(x, 0.92, 0.25, 0.15, CITY.sandDark, { ws: 8, hs: 4, sy: 0.6 });
      bb.F.ball(x + 0.1, 0.92, 0.55, 0.1, mix(CITY.sandDark, 0x8a5a3c, 0.4), { ws: 7, hs: 4, sy: 0.7 });
    }
    // Brezel als Zeichen über dem Tisch
    bb.xf([0, 2.0, 1.05], [Math.PI / 2, 0, 0], 1, () => bb.F.torus(0, 0, 0, 0.2, 0.05, 0xb8703c, { seg: 14, tube: 5 }));
  });
  return { w: 3.4, d: 2.5, h: 2.8 };
}, { tints: [PAL.awning[3], PAL.awning[0]] });
prop('cafeSet', 'market', (b) => {
  const { F, T } = b;
  const near = b.lod === 0;
  // Sonnenschirm (Instanzfarbe), runder Tisch, zwei Stühle
  F.cyl(0, 0, 0, 0.22, 0.22, 0.06, IRON, { seg: 10 });
  F.cyl(0, 0.06, 0, 0.03, 0.03, 2.25, PAL.frame, { seg: 6 });
  const n = near ? 8 : 6;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU;
    const e = ((i + 1) / n) * TAU;
    const R1 = 1.4;
    const part = i % 2 ? F : T;
    const c = i % 2 ? PAL.frame : 0xffffff;
    part.tri([0, 2.5, 0], [Math.sin(a) * R1, 2.12, Math.cos(a) * R1], [Math.sin(e) * R1, 2.12, Math.cos(e) * R1], c);
    part.tri([0, 2.49, 0], [Math.sin(e) * R1, 2.11, Math.cos(e) * R1], [Math.sin(a) * R1, 2.11, Math.cos(a) * R1], c, { k: 0.75 });
    part.quad([Math.sin(a) * R1, 2.12, Math.cos(a) * R1], [Math.sin(e) * R1, 2.12, Math.cos(e) * R1], [Math.sin(e) * R1, 1.98, Math.cos(e) * R1], [Math.sin(a) * R1, 1.98, Math.cos(a) * R1], c, { k: 0.9 });
    part.quad([Math.sin(e) * R1, 2.12, Math.cos(e) * R1], [Math.sin(a) * R1, 2.12, Math.cos(a) * R1], [Math.sin(a) * R1, 1.98, Math.cos(a) * R1], [Math.sin(e) * R1, 1.98, Math.cos(e) * R1], c, { k: 0.7 });
  }
  F.ball(0, 2.5, 0, 0.05, PAL.frame, { ws: 6, hs: 3 });
  F.lathe(0.0, 0, 0.0, [[0.25, 0], [0.04, 0.05], [0.04, 0.72], [0.38, 0.74], [0.38, 0.77], [0, 0.78]], POLE, { seg: near ? 14 : 8 });
  for (const s of [-1, 1]) {
    b.at(s * 0.68, 0, 0, s > 0 ? -Math.PI / 2 : Math.PI / 2, () => {
      for (const [x, z] of [[-0.18, 0.18], [0.18, 0.18], [-0.18, -0.18], [0.18, -0.18]]) F.cyl(x, 0, z, 0.02, 0.02, 0.45, IRON, { seg: 4 });
      F.rbox(0, 0.45, 0, 0.44, 0.05, 0.42, 0.04, CITY.wood, { seg: 2 });
      F.rbox(0, 0.5, -0.19, 0.44, 0.42, 0.04, 0.02, CITY.wood, { seg: 2 });
    });
  }
  if (near) {
    F.lathe(0.1, 0.78, 0.05, [[0.04, 0], [0.05, 0.08], [0.04, 0.09]], PAL.frame, { seg: 8 });
    F.lathe(-0.12, 0.78, -0.06, [[0.035, 0], [0.04, 0.12], [0.01, 0.13]], 0xfff3d6, { seg: 8 });
  }
  return { w: 2.9, d: 2.9, h: 2.55, r: 1.45 };
}, { tints: [PAL.awning[0], PAL.awning[1], PAL.awning[2], PAL.awning[3]] });

// --- Weihnachtsmarkt -----------------------------------------------------------------------------------------------
prop('xmasHut', 'market', (b) => {
  const { F, G, L } = b;
  const near = b.lod === 0;
  const w = 3.2;
  const d = 2.4;
  const h = 2.3;
  F.rbox(0, 0, -d / 2, w, h, d, 0.08, CITY.wood, { seg: 2, prof: [[0, 0], [0, h]], top: false, ks: [0.86, 1] });
  if (near) for (let y = 0.3; y < h; y += 0.3) G.rect(0, y, 0.004, w - 0.16, 0.025, CITY.woodDark, { k: 0.9 });
  // Satteldach mit „Schnee“ und Lichterkette
  b.at(0, 0, -d / 2, Math.PI / 2, () => F.extrude([[-d / 2, h], [d / 2, h], [0, h + 1.0]], -w / 2 + 0.01, w / 2 - 0.01, CITY.wood, { sides: false }));
  b.gable(0, h, -d / 2, w, d, 1.0, CITY.woodDark, { axis: 'x', oe: 0.5, og: 0.25, t: 0.14 });
  b.gable(0, h + 0.1, -d / 2, w, d, 1.0, PAL.frame, { axis: 'x', oe: 0.42, og: 0.27, t: 0.06, ridge: false });
  // offene Verkaufsklappe, Tresen, Ware
  F.rbox(0, 0.95, 0.12, w - 0.5, 0.08, 0.36, 0.04, CITY.woodDark, { seg: 2 });
  G.rect(0, 1.0, 0.004, w - 0.6, 1.0, mix(CITY.ink, 0x8a5a3c, 0.35));
  b.xf([0, 2.05, 0.05], [-1.0, 0, 0], 1, () => F.box(0, 0, 0, w - 0.5, 0.05, 1.1, CITY.wood));
  if (near) {
    for (let i = 0; i < 9; i++) L.ball(-1.5 + i * 0.375, h + 0.32 - Math.sin((i / 8) * Math.PI) * 0.12, 0.62, 0.045, [LIT.warm, LIT.red, LIT.warm][i % 3], { ws: 5, hs: 3, flat: true });
    for (let i = 0; i < 5; i++) F.lathe(-1.0 + i * 0.5, 1.03, 0.15, [[0.08, 0], [0.09, 0.14], [0.06, 0.15]], [PAL.red, PAL.frame, 0x3f7d55][i % 3], { seg: 8 });
    // Herz aus Lebkuchen
    b.at(0, 1.55, 0.03, 0, () => {
      const pts = [];
      for (let i = 0; i < 20; i++) {
        const t = (i / 20) * TAU;
        pts.push([0.018 * 16 * Math.sin(t) ** 3, 0.018 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))]);
      }
      G.extrude(pts, 0, 0.04, 0xb8703c, { crease: 0.3 });
    });
    for (const s of [-1, 1]) F.ball(s * 1.3, h + 1.0, -d / 2 + s * 0.6, 0.18, CITY.leafDark, { ws: 7, hs: 4, sy: 0.6 });
  }
  return { w: w + 0.6, d: 3.6, h: h + 1.2 };
}, { shift: 1.2 });
prop('xmasTree', 'tree', (b) => {
  const { F, L } = b;
  const near = b.lod === 0;
  F.rbox(0, 0, 0, 1.4, 0.5, 1.4, 0.12, CITY.woodDark, { seg: 2, prof: [[0, 0], [0, 0.5]] });
  F.cyl(0, 0.5, 0, 0.18, 0.14, 1.0, PAL.trunk, { seg: 6 });
  const tiers = [[2.6, 1.3, 3.2], [2.1, 3.2, 2.9], [1.55, 5.0, 2.6], [1.0, 6.6, 2.3]];
  for (const [r, y, h] of tiers) F.lathe(0, y, 0, [[r, 0], [r * 0.82, h * 0.12], [0.02, h]], PAL.conifer[0], { seg: near ? 14 : 8, bottom: true, ks: [0.8, 0.9, 1.1], g: [0.8, 1.1] });
  // Stern
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * TAU;
    const r = i % 2 ? 0.18 : 0.42;
    pts.push([Math.sin(a) * r, 9.2 + Math.cos(a) * r]);
  }
  F.extrude(pts, -0.06, 0.06, CITY.gold, { crease: 2 });
  if (near) {
    // Kugeln und Lichter in Spiralen
    for (let i = 0; i < 36; i++) {
      const t = i / 36;
      const y = 1.6 + t * 7.0;
      const r = 2.5 * (1 - t) + 0.25;
      const a = t * 18 + i * 0.4;
      if (i % 3 === 0) F.ball(Math.sin(a) * r, y - 0.1, Math.cos(a) * r, 0.16, [PAL.red, CITY.gold, 0x3f8fd0, 0xf4a6c0][i % 4], { ws: 8, hs: 5 });
      else L.ball(Math.sin(a) * r * 0.98, y, Math.cos(a) * r * 0.98, 0.06, LIT.warm, { ws: 5, hs: 3, flat: true });
    }
  }
  return { w: 5.4, d: 5.4, h: 9.7, r: 2.7 };
});

// --- Rummel --------------------------------------------------------------------------------------------------------
prop('snackBooth', 'fair', (b) => {
  const { F, G, T, L } = b;
  const near = b.lod === 0;
  const w = 4.2;
  const d = 2.6;
  T.rbox(0, 0, -d / 2, w, 2.4, d, 0.25, 0xffffff, { seg: 3, prof: [[0, 0], [0, 2.4]], top: false, ks: [0.86, 1] });
  F.rbox(0, 2.4, -d / 2, w + 0.3, 0.25, d + 0.3, 0.3, PAL.frame, { seg: 3 });
  // Klappe, Theke, Schild mit Zuckerwatte-Wolke
  G.rect(0, 1.0, 0.004, w - 0.8, 1.15, mix(CITY.ink, PAL.glassDark, 0.3));
  F.rbox(0, 0.95, 0.15, w - 0.6, 0.08, 0.4, 0.04, PAL.frame, { seg: 2 });
  b.xf([0, 2.3, 0.1], [-0.9, 0, 0], 1, () => T.box(0, 0, 0, w - 0.6, 0.05, 1.0, 0xffffff, { k: 0.95 }));
  F.rbox(0, 2.65, -0.2, 2.8, 0.9, 0.18, 0.2, PAL.signYellow, { seg: 3, prof: [[0, 0], [0, 0.9]] });
  G.sign(0, 2.72, -0.1, 2.5, 'cafe');
  if (near) {
    for (let i = 0; i < 10; i++) L.ball(-1.9 + i * 0.42, 2.38, d / 2 - 1.2 + 0.18 + 0.08, 0.05, [LIT.warm, LIT.red][i % 2], { ws: 5, hs: 3, flat: true });
    for (let i = 0; i < 3; i++) {
      F.cyl(-1.0 + i * 0.6, 1.03, 0.2, 0.012, 0.012, 0.3, PAL.frame, { seg: 4 });
      F.ball(-1.0 + i * 0.6, 1.4, 0.2, 0.13, 0xf4a6c0, { ws: 8, hs: 5 });
    }
  }
  return { w: w + 0.3, d: 3.4, h: 3.6 };
}, { tints: [0xf4a6c0, 0xd8ecf5, 0xffe1a8], shift: 1.3 });

/** Karussell: Bodenplatte, Mittelsäule, Dach; die Pferdchen sitzen in einem eigenen Knoten, der sich dreht. */
function carouselParts(b, ring) {
  const { F, T, L } = b;
  const near = b.lod === 0;
  const R = 4.2;
  if (!ring) {
    F.lathe(0, 0, 0, [[R + 0.2, 0], [R + 0.2, 0.3], [R, 0.4], [0, 0.4]], CITY.woodDark, { seg: near ? 32 : 14, ks: [0.75, 0.9, 1, 1] });
    F.cyl(0, 0.4, 0, 0.55, 0.55, 3.4, PAL.frame, { seg: near ? 16 : 8, top: false });
    // Dach: Zeltkegel in zwölf Bahnen, Volant, Spitze mit Fahne
    const n = 12;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU;
      const e = ((i + 1) / n) * TAU;
      const part = i % 2 ? F : T;
      const c = i % 2 ? PAL.frame : 0xffffff;
      part.tri([0, 6.2, 0], [Math.sin(a) * (R + 0.4), 4.0, Math.cos(a) * (R + 0.4)], [Math.sin(e) * (R + 0.4), 4.0, Math.cos(e) * (R + 0.4)], c, { g: [0.9, 1.05], gy: [4, 6.2] });
      part.quad([Math.sin(a) * (R + 0.4), 4.0, Math.cos(a) * (R + 0.4)], [Math.sin(e) * (R + 0.4), 4.0, Math.cos(e) * (R + 0.4)], [Math.sin(e) * (R + 0.4), 3.55, Math.cos(e) * (R + 0.4)], [Math.sin(a) * (R + 0.4), 3.55, Math.cos(a) * (R + 0.4)], c, { k: 0.92 });
    }
    b.xf([0, 3.56, 0], [Math.PI, 0, 0], 1, () => F.disc(0, 0, 0, R + 0.4, 0xf3ead8, { up: true, seg: n, k: 0.8 }));
    F.cyl(0, 6.15, 0, 0.04, 0.03, 0.9, PAL.steel, { seg: 5 });
    F.quad([0.03, 6.75, 0], [0.75, 6.65, 0], [0.75, 6.95, 0], [0.03, 7.0, 0], PAL.red);
    F.quad([0.75, 6.65, 0], [0.03, 6.75, 0], [0.03, 7.0, 0], [0.75, 6.95, 0], PAL.red, { k: 0.85 });
    if (near) for (let i = 0; i < 24; i++) L.ball(Math.sin((i / 24) * TAU) * (R + 0.42), 3.6, Math.cos((i / 24) * TAU) * (R + 0.42), 0.06, [LIT.warm, LIT.red, LIT.warm, LIT.green][i % 4], { ws: 5, hs: 3, flat: true });
    return;
  }
  // Drehender Teil: Stangen und Pferdchen
  const cols = [0xf4a6c0, 0xd8ecf5, 0xffe1a8, 0xe6f2d5, 0xffffff, 0xb07cc6];
  const n = near ? 8 : 6;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU;
    const x = Math.sin(a) * (R - 0.9);
    const z = Math.cos(a) * (R - 0.9);
    F.cyl(x, 0.4, z, 0.035, 0.035, 3.15, CITY.gold, { seg: 6, top: false });
    b.at(x, 1.1 + (i % 2) * 0.35, z, a + Math.PI / 2, () => {
      const c = cols[i % cols.length];
      F.ball(0, 0, 0, 0.36, c, { ws: 9, hs: 6, sz: 1.6, sy: 0.85 });
      F.ball(0, 0.36, 0.5, 0.2, c, { ws: 8, hs: 5, sz: 1.3 });
      F.cyl(0, 0.0, 0.42, 0.1, 0.12, 0.38, c, { seg: 6 });
      for (const [lx, lz] of [[-0.15, 0.35], [0.15, 0.35], [-0.15, -0.35], [0.15, -0.35]]) F.cyl(lx, -0.62, lz, 0.05, 0.06, 0.6, c, { seg: 5 });
      F.ball(0, 0.32, 0.1, 0.14, PAL.red, { ws: 7, hs: 4, sy: 0.4, sz: 1.4 });
      if (near) for (const s of [-1, 1]) F.ball(s * 0.12, 0.44, 0.62, 0.035, CITY.ink, { ws: 5, hs: 3 });
    });
  }
}
prop('carousel', 'fair', (b) => {
  carouselParts(b, false);
  carouselParts(b, true);
  return { w: 9.2, d: 9.2, h: 7.0, r: 4.6 };
}, { tints: [PAL.red, 0x3f8fd0, 0xf4a6c0] });

/** Riesenrad: zwei Stützen-Böcke, Nabe; Speichen und Gondeln drehen sich (Gondeln bleiben senkrecht). */
const WHEEL = { R: 9, y: 11, n: 12 };
function ferrisFrame(b) {
  const { F } = b;
  const near = b.lod === 0;
  F.rbox(0, 0, 0, 7.5, 0.6, 3.6, 0.3, PAL.stone, { seg: 2, prof: [[0, 0], [0, 0.6]] });
  for (const s of [-1, 1]) {
    for (const x of [-3.2, 3.2]) F.rod([x, 0.6, s * 1.4], [0, WHEEL.y, s * 0.7], 0.16, PAL.frame, { seg: near ? 8 : 5 });
  }
  b.xf([0, WHEEL.y, 0], [Math.PI / 2, 0, 0], 1, () => F.cyl(0, -0.9, 0, 0.32, 0.32, 1.8, PAL.steel, { seg: 10, bottom: true }));
  // Kassenhäuschen
  F.rbox(4.8, 0, 0.6, 1.6, 2.2, 1.4, 0.2, PAL.red, { seg: 3, prof: [[0, 0], [0, 2.2]] });
  F.lathe(4.8, 2.2, 0.6, [[1.1, 0], [0.1, 0.8]], PAL.frame, { seg: 4, a0: Math.PI / 4, a1: Math.PI / 4 + TAU, facet: true });
  b.G.sign(4.8, 1.3, 1.31, 1.2, 'y:ticket');
}
function ferrisWheel(b) {
  const { F, L } = b;
  const near = b.lod === 0;
  const { R, n } = WHEEL;
  // Kränze und Speichen (in der Ebene z = ±0,6), Lichter auf dem Außenkranz
  for (const z of [-0.6, 0.6]) {
    b.xf([0, 0, z], [Math.PI / 2, 0, 0], 1, () => {
      F.torus(0, 0, 0, R, 0.09, PAL.frame, { seg: near ? 40 : 20, tube: 5 });
      F.torus(0, 0, 0, R * 0.55, 0.06, PAL.frame, { seg: near ? 28 : 14, tube: 4 });
    });
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU;
      F.rod([0, 0, z], [Math.sin(a) * R, Math.cos(a) * R, z], 0.05, PAL.frame, { seg: 5 });
    }
  }
  if (near) for (let i = 0; i < n * 3; i++) {
    const a = (i / (n * 3)) * TAU;
    L.ball(Math.sin(a) * (R + 0.1), Math.cos(a) * (R + 0.1), 0.7, 0.07, [LIT.warm, LIT.red, LIT.amber][i % 3], { ws: 5, hs: 3, flat: true });
  }
}
/** Eine Gondel, hängt am Ursprung (Aufhängung), Instanzfarbe = Dachfarbe. */
function gondola(b) {
  const { F, T, G } = b;
  F.cyl(0, -0.5, 0, 0.04, 0.04, 0.5, PAL.steel, { seg: 5 });
  T.lathe(0, -0.75, 0, [[0.05, 0], [0.75, 0.15], [0.8, 0.25]], 0xffffff, { seg: 10, bottom: true });
  F.lathe(0, -1.9, 0, [[0.55, 0], [0.7, 0.12], [0.72, 0.55], [0.7, 0.6]], PAL.frame, { seg: 10, bottom: true, top: false, ks: [0.8, 0.95, 1, 1] });
  G.lathe(0, -1.3, 0, [[0.7, 0], [0.72, 0.55]], mix(PAL.glass, 0xffffff, 0.3), { seg: 10, top: false });
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * TAU + Math.PI / 4;
    F.cyl(Math.sin(a) * 0.68, -1.3, Math.cos(a) * 0.68, 0.035, 0.035, 0.6, PAL.frame, { seg: 4 });
  }
}

// --- Laden, Bahnübergang, Baustelle, Wertstoffe, Blitzer -----------------------------------------------------------
prop('chargePillar', 'charge', (b) => {
  const { F, G } = b;
  const near = b.lod === 0;
  F.rbox(0, 0, 0, 0.9, 0.14, 0.6, 0.12, PAL.curb, { seg: 2 });
  F.rbox(0, 0.14, 0, 0.5, 1.7, 0.34, 0.12, PAL.frame, { seg: 3, prof: [[0, 0], [0, 1.6], [0.04, 1.7]], ks: [0.86, 1, 1.05] });
  G.rect(0, 1.1, 0.171, 0.34, 0.42, CITY.ink);
  G.sign(0, 1.16, 0.172, 0.28, 'y:charge');
  G.rect(0, 0.36, 0.171, 0.5, 0.14, PAL.signGreen);
  if (near) {
    F.rod([0.26, 1.25, 0.02], [0.4, 0.8, 0.12], 0.025, CITY.ink, { seg: 5 });
    F.rod([0.4, 0.8, 0.12], [0.3, 0.45, 0.06], 0.025, CITY.ink, { seg: 5 });
    F.rbox(0.27, 1.22, 0.02, 0.08, 0.14, 0.08, 0.02, CITY.ink, { seg: 2 });
  }
  return { w: 0.9, d: 0.6, h: 1.9 };
});
prop('chargeCanopy', 'charge', (b) => {
  const { F, G } = b;
  const near = b.lod === 0;
  const w = 10;
  const d = 6;
  // leicht geneigtes Dach mit Solarfeldern auf vier runden Stützen, darunter vier Säulen
  for (const x of [-3.6, 3.6]) for (const z of [-2.1, 2.1]) F.cyl(x, 0, -d / 2 + z, 0.14, 0.12, 3.6 - z * 0.05, PAL.frame, { seg: near ? 10 : 6 });
  b.xf([0, 3.7, -d / 2], [0.05, 0, 0], 1, () => {
    F.rbox(0, 0, 0, w, 0.3, d, 0.3, PAL.frame, { seg: 3, bottom: true });
    for (let i = 0; i < 5; i++) for (let k = 0; k < 3; k++) G.box(-4 + i * 2, 0.3, -1.9 + k * 1.9, 1.85, 0.04, 1.75, mix(PAL.glassDark, CITY.ink, 0.3));
    F.box(0, -0.06, d / 2 - 0.05, w - 0.6, 0.36, 0.1, PAL.signGreen);
  });
  for (let i = 0; i < 4; i++) {
    const x = -3.75 + i * 2.5;
    b.at(x, 0, -d / 2 - 0.2, 0, () => {
      F.rbox(0, 0, 0, 0.7, 0.14, 0.5, 0.1, PAL.curb, { seg: 2 });
      F.rbox(0, 0.14, 0, 0.42, 1.55, 0.3, 0.1, PAL.frame, { seg: 3, prof: [[0, 0], [0, 1.55]] });
      G.rect(0, 1.0, 0.151, 0.3, 0.36, CITY.ink);
      G.sign(0, 1.05, 0.152, 0.24, 'y:charge');
    });
  }
  return { w, d, h: 4.2 };
}, { shift: 3 });
prop('levelCrossing', 'rail', (b) => {
  const { F, G, L } = b;
  const near = b.lod === 0;
  // Gleisstück quer (6 m), Schwellen, Andreaskreuz mit Warnlicht, Schranke (oben)
  for (let i = 0; i < 10; i++) F.box(-2.7 + i * 0.6, 0, -2.5, 0.26, 0.12, 2.6, CITY.woodDark);
  for (const z of [-3.22, -1.78]) F.box(0, 0.12, z, 6.2, 0.14, 0.09, PAL.steel, { g: [0.8, 1.1] });
  post(b, -0.8, 0, 2.6, 0.06, POLE);
  b.at(-0.8, 0, 0.07, 0, () => {
    for (const s of [-1, 1]) b.xf([0, 2.2, 0], [0, 0, s * 0.62], 1, () => {
      F.rbox(0, -0.55, 0, 0.16, 1.1, 0.04, 0.03, PAL.frame, { seg: 2, prof: [[0, 0], [0, 1.1]] });
      for (let i = 0; i < 3; i++) G.rect(0, -0.5 + i * 0.36, 0.022, 0.14, 0.16, PAL.red);
    });
    F.rbox(0, 1.25, 0, 0.36, 0.36, 0.12, 0.06, CITY.ink, { seg: 2 });
    L.disc(0, 1.43, 0.065, 0.12, LIT.red, { seg: near ? 14 : 8, flat: true });
  });
  // Schrankenbaum, aufgerichtet
  F.rbox(0.6, 0, -0.2, 0.42, 1.1, 0.42, 0.08, PAL.frame, { seg: 2, prof: [[0, 0], [0, 1.1]] });
  stripes(b, [0.6, 1.0, -0.2], [0.75, 6.8, -0.2], 0.07, [PAL.red, PAL.frame], 0.55);
  return { w: 6.2, d: 4.0, h: 6.9 };
}, { shift: 1.9 });
prop('barrier', 'work', (b) => {
  const { F } = b;
  for (const s of [-1, 1]) {
    F.rbox(s * 0.85, 0, 0, 0.3, 0.06, 0.55, 0.05, CITY.ink, { seg: 2 });
    F.cyl(s * 0.85, 0.06, 0, 0.03, 0.03, 0.9, PAL.frame, { seg: 6 });
  }
  b.at(0, 0.62, 0.035, 0, () => {
    F.rbox(0, 0, 0, 1.9, 0.26, 0.04, 0.03, PAL.frame, { seg: 2, prof: [[0, 0], [0, 0.26]] });
    for (let i = 0; i < 5; i++) b.G.quad([-0.88 + i * 0.36, 0.025, 0.022], [-0.7 + i * 0.36, 0.025, 0.022], [-0.52 + i * 0.36, 0.235, 0.022], [-0.7 + i * 0.36, 0.235, 0.022], PAL.red);
  });
  F.ball(-0.85, 0.98, 0, 0.08, PAL.orange, { ws: 8, hs: 5 });
  return { w: 2.0, d: 0.6, h: 1.06 };
});
prop('cone', 'work', (b) => {
  const { F, G } = b;
  F.rbox(0, 0, 0, 0.42, 0.04, 0.42, 0.06, CITY.ink, { seg: 2 });
  F.lathe(0, 0.04, 0, [[0.17, 0], [0.12, 0.25], [0.085, 0.42], [0.03, 0.66], [0.02, 0.68]], PAL.orange, { seg: b.lod > 0 ? 6 : 14, ks: [0.85, 0.95, 1, 1.05, 1] });
  G.lathe(0, 0.32, 0, [[0.112, 0], [0.093, 0.13]], PAL.frame, { seg: b.lod > 0 ? 6 : 14, top: false });
  return { w: 0.42, d: 0.42, h: 0.72 };
});
prop('bake', 'work', (b) => {
  const { F, G } = b;
  F.rbox(0, 0, 0, 0.5, 0.08, 0.5, 0.06, CITY.ink, { seg: 2 });
  F.rbox(0, 0.08, 0, 0.26, 1.1, 0.06, 0.03, PAL.frame, { seg: 2, prof: [[0, 0], [0, 1.1]] });
  for (let i = 0; i < 4; i++) G.quad([-0.12, 0.18 + i * 0.26, 0.031], [0.12, 0.3 + i * 0.26, 0.031], [0.12, 0.42 + i * 0.26, 0.031], [-0.12, 0.3 + i * 0.26, 0.031], PAL.red);
  for (const s of [0, Math.PI]) b.at(0, 0, 0, s, () => b.L.disc(0, 1.12, 0.032, 0.06, LIT.amber, { seg: 10, flat: true }));
  return { w: 0.5, d: 0.5, h: 1.2 };
});
prop('recycling', 'small', (b) => {
  const { F, G } = b;
  const near = b.lod === 0;
  F.rbox(0, 0, -0.7, 5.4, 0.08, 1.8, 0.2, PAL.sidewalk, { seg: 2 });
  const cont = [['y:glass', 0x4fae6a], ['y:glass', 0x4fae6a], ['y:paper', 0x3f8fd0]];
  cont.forEach(([key, col], i) => {
    const x = -1.7 + i * 1.7;
    F.rbox(x, 0.08, -0.7, 1.4, 1.5, 1.4, 0.28, col, { seg: 3, prof: [[0, 0], [0, 1.25], [0.12, 1.45], [0.35, 1.5]], ks: [0.8, 1, 1.04, 1.04] });
    F.cyl(x, 1.58, -0.7, 0.12, 0.1, 0.22, mix(col, 0x000000, 0.25), { seg: 8 });
    F.torus(x, 1.82, -0.7, 0.12, 0.035, POLE, { seg: 10, tube: 4 });
    G.sign(x, 0.7, 0.002, 0.7, key);
    if (near) b.xf([x, 1.25, -0.0], [0, 0, 0], 1, () => F.disc(0, 0, 0.002, 0.11, CITY.ink, { seg: 12 }));
  });
  return { w: 5.4, d: 1.8, h: 1.95 };
}, { shift: 0.7 });
prop('speedCamera', 'signal', (b) => {
  const { F, G } = b;
  F.rbox(0, 0, 0, 0.7, 0.12, 0.7, 0.1, PAL.stone, { seg: 2 });
  F.rbox(0, 0.12, 0, 0.46, 3.1, 0.46, 0.14, mix(PAL.steel, 0xffffff, 0.2), { seg: 3, prof: [[0, 0], [0, 3.0], [0.06, 3.1]], ks: [0.86, 1, 1.04] });
  for (const y of [1.0, 2.1]) {
    F.rbox(0, y, 0.2, 0.32, 0.4, 0.1, 0.06, CITY.ink, { seg: 2, prof: [[0, 0], [0, 0.4]] });
    G.disc(0, y + 0.2, 0.252, 0.1, mix(PAL.glassDark, 0x000000, 0.4), { seg: 12 });
  }
  G.rect(0, 2.75, 0.231, 0.3, 0.2, PAL.signYellow);
  return { w: 0.7, d: 0.7, h: 3.25 };
});

// --- Pfosten für Textschilder (Instanz-Geometrie ohne Text) --------------------------------------------------------
prop('signPosts', 'sign', (b) => {
  for (const x of [-0.75, 0.75]) post(b, x, 0, 2.2, 0.045, POLE);
  return { w: 2.0, d: 0.2, h: 2.25 };
});

// --- Parkende Spielzeugautos (Karosserie in der Instanzfarbe) ------------------------------------------------------
/**
 * Lichter geparkter Autos sind aus (der Eigentümer, 21.11.: „Parkende Autos sollten kein aktives Rücklicht haben“):
 * dunkelrotes Glas hinten, graues vorn. Es leuchtet nur der fahrende Verkehr (models/vehicles.js).
 */
export const LAMP_OFF = { tail: 0x6a2420, head: 0x8f8c82 };

/**
 * Spielzeugauto, Mitte im Ursprung, Front nach +z. Weiche Wanne in der Instanzfarbe, darauf ein „Glashaus“ aus
 * dunklen, glänzenden Scheiben mit Dach in Wagenfarbe; dicke Räder, die ein wenig aus der Flanke schauen.
 * p: L Länge, W Breite, bh Höhe der Wanne, ch Höhe der Kabine, cabL/cab Länge und Lage der Kabine, roof (Farbe des
 * Dachs, sonst Wagenfarbe), wr Radradius.
 */
function toyCar(b, p) {
  const { F, G, T } = b;
  const near = b.lod === 0;
  const { L: len, W: w } = p;
  const wr = p.wr ?? 0.3;
  const clr = 0.13;
  const bh = p.bh ?? 0.66;
  const ch = p.ch ?? 0.56;
  const y1 = clr + bh;
  const cz = p.cab ?? -0.1;
  const cl = p.cabL ?? len * 0.55;
  const r = p.r ?? 0.36;
  const seg = near ? 4 : 2;
  const pane = mix(PAL.glassDark, PAL.glass, 0.3);
  // Wanne: unten eingezogen, oben weich gerundet
  T.rbox(0, clr, 0, w, bh, len, r, 0xffffff, { seg, prof: [[0.1, 0], [0.01, 0.12], [0, 0.2], [0, bh - 0.14], [0.07, bh]], ks: [0.62, 0.86, 0.95, 1.03, 1.08] });
  // Glashaus und Dach
  G.rbox(0, y1 - 0.02, cz, w - 0.2, ch - 0.1, cl, 0.3, pane, { seg, prof: [[0, 0], [0.09, ch - 0.1]], top: false, ks: [0.95, 1.12] });
  const roofCol = p.roof ?? 0xffffff;
  (p.roof ? F : T).rbox(0, y1 + ch - 0.13, cz, w - 0.34, 0.13, cl - 0.16, 0.24, roofCol, { seg, prof: [[0, 0], [0, 0.07], [0.05, 0.13]], ks: [0.9, 1.05, 1.1] });
  // Mittelsäulen in Wagenfarbe
  // Mittelsäulen in Wagenfarbe, nach innen geneigt wie die Scheiben
  const lean = Math.atan2(0.09, ch - 0.1);
  for (const s of [-1, 1]) b.xf([s * ((w - 0.2) / 2 - 0.015), y1 - 0.02, cz + (p.pillar ?? 0)], [0, 0, s * lean], 1, () => T.box(0, 0, 0, 0.07, ch - 0.11, 0.12, 0xffffff, { skip: 'bt', k: 1.02 }));
  // Räder mit dunklem Radkasten dahinter
  const wz = p.wz ?? len * 0.31;
  for (const s of [-1, 1]) {
    for (const z of [wz, -wz]) {
      b.xf([s * (w / 2 - 0.1), wr, z], [0, 0, (s * Math.PI) / 2], 1, () => {
        if (!near) {
          F.cyl(0, -0.11, 0, wr, wr, 0.22, CITY.ink, { seg: 8 });
          return;
        }
        F.lathe(0, -0.11, 0, [[wr * 0.6, 0], [wr * 0.92, 0], [wr, 0.04], [wr, 0.18], [wr * 0.92, 0.22], [wr * 0.6, 0.22]], CITY.ink, { seg: 14, top: false, ks: [0.8, 0.9, 1, 1, 0.9, 0.8] });
        F.lathe(0, 0.11, 0, [[wr * 0.6, 0], [wr * 0.5, 0.02], [wr * 0.18, 0.05], [0, 0.06]], PAL.steel, { seg: 10, ks: [0.9, 1, 1.1, 1.15] });
      });
      if (near) {
        const P = [];
        for (let i = 0; i <= 10; i++) {
          const a = (i / 10) * Math.PI;
          P.push([Math.cos(a) * (wr + 0.07), wr + Math.sin(a) * (wr + 0.07)]);
        }
        b.at(s * (w / 2 + 0.002), 0, z, (s * Math.PI) / 2, () => G.poly(P.map(([u, v]) => [u, v, 0]), mix(CITY.ink, PAL.steel, 0.15), { k: 0.9 }));
      }
    }
  }
  // Lichter, Stoßfänger und Nummernschilder
  const by = clr + 0.08;
  for (const z of [len / 2, -len / 2]) {
    const back = z < 0;
    F.rbox(0, by, z - (back ? -0.06 : 0.06), w - 0.12, 0.16, 0.2, 0.08, mix(PAL.steel, 0xffffff, 0.35), { seg: 2 });
    b.at(0, 0, z + (back ? -0.041 : 0.041), back ? Math.PI : 0, () => {
      G.rect(0, by + 0.025, 0, 0.5, 0.11, PAL.frame);
      G.rect(-0.22, by + 0.025, 0.002, 0.05, 0.11, PAL.signBlue);
    });
    for (const s of [-1, 1]) {
      const x = s * (w / 2 - 0.3);
      const y = clr + bh * 0.62;
      b.xf([x, y, z - (back ? -0.02 : 0.02)], [back ? -Math.PI / 2 : Math.PI / 2, 0, 0], 1, () => {
        const lamp = back ? LAMP_OFF.tail : LAMP_OFF.head;
        if (near) G.lathe(0, 0, 0, [[0.11, 0], [0.11, 0.025], [0.07, 0.055], [0, 0.065]], lamp, { seg: 12, ks: [0.85, 1, 1.15, 1.25] });
        else G.disc(0, 0.04, 0, 0.11, lamp, { up: true, seg: 6, k: 1.15 });
      });
    }
  }
  if (near && p.extra) p.extra(b, len, w, y1 + ch);
  return { w: w + 0.06, d: len + 0.12, h: y1 + ch };
}
const CAR_TINTS = [0xe5483a, 0x3f8fd0, 0xf2b632, 0x4fae6a, 0xf4a6c0, 0xfdfbf5, 0x6b7fa8, 0xb07cc6];
prop('carSmall', 'car', (b) => toyCar(b, { L: 3.2, W: 1.62, r: 0.5, bh: 0.62, ch: 0.6, cabL: 1.75, cab: -0.12, wz: 1.0 }), { tints: CAR_TINTS });
prop('carCompact', 'car', (b) => toyCar(b, { L: 3.9, W: 1.72, cabL: 2.1, cab: -0.3 }), { tints: CAR_TINTS });
prop('carVan', 'car', (b) => toyCar(b, {
  L: 4.5, W: 1.85, bh: 0.78, ch: 0.82, cabL: 3.6, cab: -0.25, r: 0.4, wr: 0.32, roof: PAL.frame, pillar: 0.5,
  extra: (bb, len, w, top) => {
    // Dachträger mit Surfbrett: ein Hauch Urlaub
    for (const z of [-0.9, 0.5]) bb.F.box(0, top - 0.01, z, w - 0.6, 0.05, 0.05, PAL.steel);
    bb.F.rbox(0, top + 0.04, -0.2, 0.5, 0.07, 2.4, 0.24, PAL.signYellow, { seg: 3 });
  },
}), { tints: CAR_TINTS });

// --- Einzelstücke mit Text ------------------------------------------------------------------------------------------
const unique = (name, kind, info, build) => {
  defs[name] = { kind, info, build };
};
const keyOf = (o) => JSON.stringify(o);

unique('townSign', 'sign', { w: 2.0, d: 0.2, h: 2.25 }, (kit, o = {}) => {
  const g = compose(kit.core, [{ g: kit.geo('signPosts') }]);
  const W = 1.9;
  const H = 1.15;
  const t = { name: o.name ?? 'Erlensee', sub: o.sub ?? '' };
  panel(kit, g, 'ort:' + keyOf(t), W, H, 512, (c, w, h) => drawTownSign(c, w, h, t), 0, 1.6, 0.06);
  backPanel(kit, g, W, H, 0, 1.6, 0.06);
  g.userData.info = { w: 2.0, d: 0.2, h: 2.2, text: t.name };
  return g;
});
unique('townExit', 'sign', { w: 2.0, d: 0.2, h: 2.25 }, (kit, o = {}) => {
  const g = compose(kit.core, [{ g: kit.geo('signPosts') }]);
  const W = 1.9;
  const H = 1.15;
  const t = { name: o.name ?? 'Erlensee', next: o.next ?? '', exit: true };
  panel(kit, g, 'ende:' + keyOf(t), W, H, 512, (c, w, h) => drawTownSign(c, w, h, t), 0, 1.6, 0.06);
  backPanel(kit, g, W, H, 0, 1.6, 0.06);
  g.userData.info = { w: 2.0, d: 0.2, h: 2.2, text: t.name };
  return g;
});
/** Rückseite einer Texttafel: helles Blech mit Kante, damit von hinten nichts offen wirkt. */
function backPanel(kit, g, W, H, x, y, z) {
  const b = new Bau();
  b.F.rbox(x, y - H / 2 - 0.02, z - 0.025, W + 0.04, H + 0.04, 0.04, 0.02, mix(PAL.steel, 0xffffff, 0.3), { seg: 2, prof: [[0, 0], [0, H + 0.04]] });
  const m = compose(kit.core, [{ g: b.done({}) }]);
  for (const c of [...m.children]) g.add(c);
}
unique('signDirBlue', 'sign', { w: 3.0, d: 0.2, h: 3.6 }, (kit, o = {}) => dirSign(kit, o, true));
unique('signDirYellow', 'sign', { w: 2.4, d: 0.2, h: 2.6 }, (kit, o = {}) => dirSign(kit, o, false));
function dirSign(kit, o, blue) {
  const lines = o.lines ?? (blue ? ['Kassel', 'Frankfurt'] : ['Erlensee']);
  const dir = o.dir ?? 'right';
  const W = blue ? 2.8 : 2.0;
  const H = blue ? 0.55 + 0.42 * lines.length : 0.62 + 0.3 * (lines.length - 1);
  const top = blue ? 3.3 : 2.4;
  const b = new Bau();
  for (const x of blue ? [-W / 2 + 0.25, W / 2 - 0.25] : [0]) post(b, x, -0.06, top, blue ? 0.07 : 0.05, POLE);
  const g = compose(kit.core, [{ g: b.done({}) }]);
  const t = { lines, dir, blue };
  if (blue) {
    panel(kit, g, 'weg:' + keyOf(t), W, H, 512, (c, w, h) => drawDirSign(c, w, h, t), 0, top - H / 2, 0.02);
    backPanel(kit, g, W, H, 0, top - H / 2, 0.02);
  } else {
    const s = dir === 'left' ? -1 : 1;
    arrowPanel(kit, g, 'pfeil:' + keyOf(t), W, H, s, (c, w, h) => drawDirSign(c, w, h, { ...t, dir: 'up', arrowShape: true }), s * 0.55, top - H / 2, 0.02);
    const back = new Bau();
    back.F.extrude([[-W / 2, -H / 2], [W / 2 - H * 0.42, -H / 2], [W / 2, 0], [W / 2 - H * 0.42, H / 2], [-W / 2, H / 2]].map(([x, y]) => [s * x + s * 0.55, y + top - H / 2]), -0.04, 0.0, mix(PAL.steel, 0xffffff, 0.3), { caps: 'b' });
    for (const c of compose(kit.core, [{ g: back.done({}) }]).children) g.add(c);
  }
  g.userData.info = { w: blue ? W : W + 1.1, d: 0.2, h: top + 0.1, lines };
  return g;
}
unique('banner', 'deco', { w: 12, d: 0.4, h: 6.6 }, (kit, o = {}) => {
  const width = o.width ?? 12;
  const text = o.text ?? 'Hallo Mini Adam!';
  const b = new Bau();
  for (const s of [-1, 1]) post(b, (s * width) / 2, 0, 6.4, 0.09, POLE);
  // Spannseile oben und unten
  for (const y of [6.1, 4.9]) b.F.rod([-width / 2, y, 0], [width / 2, y, 0], 0.012, CITY.ink, { seg: 4 });
  const g = compose(kit.core, [{ g: b.done({}) }]);
  const bw = Math.min(width - 1.2, 9);
  const t = { text, col: o.col ?? '#e5483a' };
  panel(kit, g, 'banner:' + keyOf(t), bw, 1.1, 1024, (c, w, h) => drawBanner(c, w, h, t), 0, 5.5, 0.02);
  const back = panel(kit, g, 'banner:' + keyOf(t), bw, 1.1, 1024, (c, w, h) => drawBanner(c, w, h, t), 0, 5.5, -0.02);
  back.rotation.y = Math.PI;
  g.userData.info = { w: width + 0.2, d: 0.4, h: 6.5, text };
  return g;
});
const buntingGeos = new Map();
unique('bunting', 'deco', { w: 12, d: 0.2, h: 6 }, (kit, o = {}) => {
  const width = o.width ?? 12;
  const sag = o.sag ?? 0.7;
  const y = o.y ?? 5.6;
  const key = width + ':' + sag + ':' + y;
  let geo = buntingGeos.get(key);
  if (!geo) {
    const b = new Bau();
    const cols = [PAL.red, PAL.signYellow, PAL.awning[1], PAL.awning[2], 0xf4a6c0, PAL.frame];
    const n = Math.max(6, Math.round(width / 0.55));
    const at = (t) => [-width / 2 + width * t, y - sag * 4 * t * (1 - t), 0];
    for (let i = 0; i < n; i++) b.F.rod(at(i / n), at((i + 1) / n), 0.012, CITY.ink, { seg: 4 });
    for (let i = 0; i < n; i++) {
      const p = at((i + 0.5) / n);
      const q = at((i + 0.12) / n);
      const r = at((i + 0.88) / n);
      const tip = [p[0], p[1] - 0.42, 0];
      b.F.tri(q, tip, r, cols[i % cols.length]);
      b.F.tri(q, r, tip, cols[i % cols.length], { k: 0.85 });
    }
    geo = b.done({ w: width, d: 0.1, h: y });
    buntingGeos.set(key, geo);
  }
  const g = compose(kit.core, [{ g: geo }], { shadows: false });
  g.userData.info = { w: width, d: 0.1, h: y, sag };
  return g;
});
unique('finishGate', 'deco', { w: 11, d: 1.6, h: 6.4 }, (kit, o = {}) => {
  const width = o.width ?? 11;
  const name = o.name ?? '';
  const b = new Bau();
  // aufblasbarer Bogen: zwei dicke runde Säulen, oben ein Querbalken mit runden Enden, alles prall und weich
  const cols = [0xf2b632, 0xe5483a];
  for (const s of [-1, 1]) {
    const x = (s * width) / 2;
    b.F.rbox(x, 0, 0, 1.5, 0.4, 1.5, 0.5, PAL.stone, { seg: 4 });
    for (let i = 0; i < 6; i++) b.F.ball(x, 0.7 + i * 0.85, 0, 0.62, cols[i % 2], { ws: 12, hs: 8, sy: 0.75 });
  }
  b.F.rbox(0, 5.0, 0, width + 1.2, 1.4, 1.2, 0.6, cols[1], { seg: 5, prof: [[0.1, 0], [0, 0.25], [0, 1.15], [0.1, 1.4]], ks: [0.85, 1, 1.05, 1.1] });
  const g = compose(kit.core, [{ g: b.done({}) }]);
  const t = { name };
  for (const s of [1, -1]) {
    const m = panel(kit, g, 'ziel:' + keyOf(t), width - 1.5, 1.15, 1024, (c, w, h) => drawGoal(c, w, h, t), 0, 5.7, s * 0.605);
    if (s < 0) m.rotation.y = Math.PI;
  }
  g.userData.info = { w: width + 1.5, d: 1.5, h: 6.4, passage: { w: width - 1.5, h: 4.9 }, name };
  return g;
});
unique('ferrisWheel', 'fair', { w: 20, d: 4, h: 21, animated: true }, (kit, o = {}) => {
  const g = compose(kit.core, [{ g: kit.geo('ferrisFrame', !!o.far) }]);
  const rot = new THREE.Group();
  rot.position.set(0, WHEEL.y, 0);
  for (const c of compose(kit.core, [{ g: kit.geo('ferrisRing', !!o.far) }]).children) rot.add(c);
  g.add(rot);
  // Gondeln: ein Mesh je Material als InstancedMesh, Lage aus dem Drehwinkel
  const gg = kit.geo('ferrisGondola', !!o.far);
  const inst = [];
  for (const [geo, mat] of [[gg.tint, kit.matte], [gg.fixed, kit.matte], [gg.gloss, kit.glossy]]) {
    if (!geo) continue;
    const im = new THREE.InstancedMesh(geo, mat, WHEEL.n);
    im.castShadow = true;
    im.frustumCulled = false;
    if (geo === gg.tint) for (let i = 0; i < WHEEL.n; i++) im.setColorAt(i, new THREE.Color(CAR_TINTS[i % CAR_TINTS.length]));
    g.add(im);
    inst.push(im);
  }
  const m4 = new THREE.Matrix4();
  const set = (angle) => {
    rot.rotation.z = angle;
    for (let i = 0; i < WHEEL.n; i++) {
      const a = angle + (i / WHEEL.n) * TAU;
      m4.makeTranslation(-Math.sin(a) * WHEEL.R, WHEEL.y + Math.cos(a) * WHEEL.R, 0);
      for (const im of inst) im.setMatrixAt(i, m4);
    }
    for (const im of inst) im.instanceMatrix.needsUpdate = true;
  };
  set(0);
  /** Drehen: t = Zeit in Sekunden (eine Runde in 40 s). */
  g.userData.update = (t) => set((t * TAU) / 40);
  g.userData.info = { w: 20, d: 4, h: WHEEL.y + WHEEL.R + 1.2, animated: true };
  return g;
});
defs.ferrisFrame = { kind: 'part', far: true, make: (b) => (ferrisFrame(b), { w: 10, d: 4, h: 12 }) };
defs.ferrisRing = { kind: 'part', far: true, make: (b) => (ferrisWheel(b), { w: 19, d: 1.4, h: 19 }) };
defs.ferrisGondola = { kind: 'part', far: true, tints: CAR_TINTS, make: (b) => (gondola(b), { w: 1.5, d: 1.5, h: 1.9 }) };
unique('carouselTurning', 'fair', { w: 9.2, d: 9.2, h: 7, animated: true }, (kit, o = {}) => {
  const g = compose(kit.core, [{ g: kit.geo('carouselBase', !!o.far), tint: o.tint }]);
  const rot = new THREE.Group();
  for (const c of compose(kit.core, [{ g: kit.geo('carouselRide', !!o.far) }]).children) rot.add(c);
  g.add(rot);
  /** Drehen (eine Runde in 12 s), die Pferdchen wippen nicht, das bleibt ruhig. */
  g.userData.update = (t) => {
    rot.rotation.y = (t * TAU) / 12;
  };
  g.userData.info = { w: 9.2, d: 9.2, h: 7, animated: true };
  return g;
});
defs.carouselBase = { kind: 'part', far: true, tints: [PAL.red, 0x3f8fd0, 0xf4a6c0], make: (b) => (carouselParts(b, false), { w: 9.2, d: 9.2, h: 7 }) };
defs.carouselRide = { kind: 'part', far: true, make: (b) => (carouselParts(b, true), { w: 8, d: 8, h: 4 }) };

/** Straßenmöbel und Plätze. */
export function createStreetKit(F) {
  return makeKit(F, defs);
}
