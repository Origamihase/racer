// Stadt-Baukasten, Teil Brunnen (#BrunnenTV): Kein Ort ohne Brunnen. Acht Arten vom Dorftrog bis zum
// Prachtbrunnen, dazu zwei besondere: der Ursprung (Augsburg, 04.05.2017) und der Endgegner (Nürnberg).
// Ursprung jedes Brunnens: Mitte seiner Grundfläche, die Schauseite blickt nach +z; der Wandbrunnen lehnt mit dem
// Rücken (z = 0) an einer Wand. Stein und Figuren liegen im Eimer F, alles Wasser im Eimer W: Den bewegt allein der
// Shader (Strahlen pulsieren, Tropfen fliegen ihre Wurfparabel, Ringe laufen über die Fläche, im Regen tüpfeln
// Tropfen). Ein Brunnen kostet so zwei Draw Calls (Stein, Wasser), im verschmolzenen Ort gar keinen eigenen.
// Jede info trägt cam = { pos, look }: die Nahaufnahme aus 2–4 m in 1,2 m Höhe (Mini Adams Selfie-Kamera).
import { PAL, CITY, mix, rng, makeKit, textPanel, fitFont, FONT } from './citycore.js';
import { tub, moss, pigeon, duck, blossom, bench, BLOOM } from './parts.js';

const TAU = Math.PI * 2;
const SURF = 0x7cc8ec; // Wasserfläche
const JET = 0xe2f3ff; // Strahlen und Tropfen
const SAND = CITY.sand;
const STONE = PAL.stone;
const GRANITE = mix(PAL.stone, CITY.slate, 0.5);
const IRON = PAL.darkMetal;
const FLOOR = mix(PAL.stone, 0x3f6f8f, 0.5); // Beckenboden unter dem Wasser

/** Teilung runder Formen nach Radius: in der Nahaufnahme darf keine Kante zu sehen sein. */
const segs = (r, lo) => (lo ? Math.max(12, Math.round(r * 5)) : Math.min(64, Math.max(28, Math.round(r * 10))));

/**
 * Runder Pflasterkreis, auf dem der Brunnen steht: Randstein mit runder Kante, innen Ringe in zwei Steintönen.
 * o.sx / o.sz: elliptisch, o.h: Höhe, o.col: Pflasterfarbe.
 */
function paving(b, r, o = {}) {
  const h = o.h ?? 0.1;
  const lo = b.lod > 0;
  const seg = o.seg ?? segs(r * Math.max(o.sx ?? 1, o.sz ?? 1), lo);
  const a = o.col ?? PAL.cobble;
  const c = mix(a, 0xffffff, 0.2);
  const kerb = o.kerb ?? mix(PAL.stone, 0xffffff, 0.12);
  const geo = { seg, sx: o.sx, sz: o.sz };
  b.F.lathe(0, 0, 0, [[r, 0], [r, h - 0.035], [r - 0.035, h], [r - 0.26, h], [r - 0.29, h - 0.012]], kerb, { ...geo, top: false, ks: [0.8, 0.95, 1, 1, 0.9] });
  const y = h - 0.012;
  const rings = lo ? [r - 0.29, 0] : [r - 0.29, r * 0.78, r * 0.74, r * 0.5, r * 0.46, 0];
  const cols = lo ? [a] : [a, c, a, c, a];
  b.F.lathe(0, 0, 0, rings.map((rr) => [rr, y]), cols, { ...geo, top: false, ks: rings.map((_, i) => 0.97 + (i % 2) * 0.03) });
}

/**
 * Rundes Becken (Sockel, Wand, Lippe, innen Wand und Boden): Außenradius r, Höhe h, Randbreite o.t, Bodentiefe unter
 * der Randoberkante o.depth. o.oct: achteckig mit einer Seite nach vorn. Gibt den Radius der Wasserfläche zurück.
 */
function basin(b, x, y, z, r, h, o = {}) {
  const t = o.t ?? 0.3;
  const lip = o.lip ?? 0.07;
  const depth = o.depth ?? 0.42;
  const col = o.col ?? STONE;
  const shape = o.oct ? { seg: 8, facet: true, a0: Math.PI / 8, a1: Math.PI / 8 + TAU } : { seg: o.seg ?? segs(r, b.lod > 0) };
  const prof = [[r + 0.07, 0], [r + 0.07, h * 0.18], [r, h * 0.25], [r, h - 0.15], [r + lip, h - 0.1], [r + lip, h], [r - t, h], [r - t, h - depth]];
  const cols = [col, col, col, col, col, col, col, FLOOR];
  b.F.lathe(x, y, z, prof, cols, { ...shape, sx: o.sx, sz: o.sz, ks: [0.8, 0.88, 0.94, 1, 1, 1.05, 0.92, 0.9] });
  return r - t - 0.01;
}

/** Schale auf einem Schaft: flach, mit Lippe und Boden; Ursprung an der Unterseite. Gibt [Wasserhöhe, Wasserradius] zurück. */
function bowl(b, x, y, z, r, o = {}) {
  const h = r * 0.36;
  const col = o.col ?? SAND;
  const prof = [[r * 0.2, 0], [r * 0.62, h * 0.22], [r * 0.92, h * 0.62], [r, h * 0.94], [r * 0.98, h], [r * 0.9, h], [r * 0.84, h * 0.66]];
  b.F.lathe(x, y, z, prof, [col, col, col, col, col, col, FLOOR], { seg: o.seg ?? segs(r * 1.4, b.lod > 0), ks: [0.74, 0.84, 0.95, 1.02, 1.05, 0.95, 0.9] });
  return [y + h * 0.86, r * 0.87];
}

/** Rohr aus der Säule mit Strahl ins Becken: Richtung a (rad), Start-Radius r0, Höhe y; landet auf wy. */
function spout(b, a, r0, y, wy, o = {}) {
  const { F, W } = b;
  const s = Math.sin(a);
  const c = Math.cos(a);
  const len = o.len ?? 0.45;
  const r1 = r0 + len;
  F.rod([s * (r0 - 0.08), y, c * (r0 - 0.08)], [s * r1, y - 0.03, c * r1], o.pipe ?? 0.045, o.col ?? IRON, { seg: 8, caps: true });
  if (b.lod === 0 && o.tip !== false) F.ball(s * r1, y - 0.03, c * r1, (o.pipe ?? 0.045) * 1.35, o.col ?? IRON, { ws: 8, hs: 4 });
  const v = o.v ?? 1.5;
  const hit = b.W.jet([s * (r1 + 0.03), y - 0.035, c * (r1 + 0.03)], [s * v, o.vy ?? 0.15, c * v], wy, o.r ?? 0.034, JET, { n: b.lod ? 4 : o.n ?? 9, seg: b.lod ? 3 : o.seg ?? 6, ph: a * 3 });
  W.splash(hit[0], wy + 0.012, hit[2], 0.05, 0.42, SURF, { T: 1.3, ph: a });
  if (o.tip !== false) W.splash(hit[0], wy + 0.012, hit[2], 0.05, 0.42, SURF, { T: 1.3, ph: a + 0.5 });
  return hit;
}

/** Senkrechte Fontäne: Röhre bis zum Scheitel (Höhe top über der Düse), darum Tropfen, die wieder herabfallen. */
function fountainJet(b, x, y, z, top, wy, rnd, o = {}) {
  const { W } = b;
  const v = Math.sqrt(2 * 9.81 * top);
  const r = o.r ?? 0.045;
  W.jet([x, y, z], [0, v, 0], wy, r, JET, { apex: true, n: b.lod ? 3 : 8, seg: b.lod ? 4 : 7, r1: r * 0.55, ph: x * 5 + z * 3, pulse: 0.35 });
  W.drops([x, y + top * 0.25, z], [0, v * 0.87, 0], wy, o.drops ?? Math.round(6 + top * 4), JET, rnd, { spread: o.spread ?? 0.14 + top * 0.07, size: o.size ?? 0.028 + top * 0.004, spreadY: 0.12 });
}

/** Kleiner sitzender Bär (Brunnenfigur), Blick nach +z, Höhe etwa 0,9 · s. */
function bear(b, x, y, z, s, col) {
  const { F } = b;
  const lo = b.lod > 0;
  const ws = lo ? 6 : 12;
  const hs = lo ? 4 : 8;
  F.ball(x, y + 0.3 * s, z, 0.3 * s, col, { ws, hs, sy: 1.05 });
  F.ball(x, y + 0.72 * s, z + 0.02 * s, 0.22 * s, col, { ws, hs });
  if (lo) return;
  for (const k of [-1, 1]) {
    F.ball(x + k * 0.16 * s, y + 0.92 * s, z, 0.08 * s, col, { ws: 8, hs: 5 });
    F.ball(x + k * 0.16 * s, y + 0.925 * s, z + 0.04 * s, 0.045 * s, mix(col, 0x8a5a1c, 0.35), { ws: 6, hs: 4 });
    F.ball(x + k * 0.25 * s, y + 0.4 * s, z + 0.14 * s, 0.1 * s, col, { ws: 8, hs: 5 });
    F.ball(x + k * 0.17 * s, y + 0.1 * s, z + 0.26 * s, 0.11 * s, col, { ws: 8, hs: 5 });
  }
  F.ball(x, y + 0.68 * s, z + 0.19 * s, 0.09 * s, mix(col, 0xffffff, 0.45), { ws: 8, hs: 5 });
  F.ball(x, y + 0.71 * s, z + 0.27 * s, 0.03 * s, CITY.ink, { ws: 6, hs: 4 });
  for (const k of [-1, 1]) F.ball(x + k * 0.09 * s, y + 0.79 * s, z + 0.18 * s, 0.025 * s, CITY.ink, { ws: 6, hs: 4 });
}

/** Wasserspeier-Frosch auf dem Beckenrand, schaut zur Beckenmitte (−r-Richtung des Winkels a) und spuckt hinein. */
function frog(b, a, r, y, wy) {
  const { F, W } = b;
  const lo = b.lod > 0;
  b.at(Math.sin(a) * r, y, Math.cos(a) * r, a + Math.PI, () => {
    const green = 0x6fbf5a;
    F.ball(0, 0.15, -0.05, 0.22, green, { ws: lo ? 6 : 9, hs: lo ? 4 : 5, sy: 0.7, sz: 1.2 });
    F.ball(0, 0.27, 0.13, 0.17, green, { ws: lo ? 6 : 9, hs: lo ? 4 : 5, sy: 0.72 });
    if (!lo) {
      for (const k of [-1, 1]) {
        F.ball(k * 0.1, 0.39, 0.13, 0.065, PAL.frame, { ws: 6, hs: 4 });
        F.ball(k * 0.1, 0.4, 0.185, 0.03, CITY.ink, { ws: 5, hs: 3 });
        F.ball(k * 0.2, 0.08, -0.04, 0.12, mix(green, 0x2f5f43, 0.25), { ws: 6, hs: 3, sy: 0.6, sz: 1.3 });
        F.ball(k * 0.13, 0.04, 0.2, 0.06, green, { ws: 5, hs: 3, sy: 0.5 });
      }
      F.ball(0, 0.2, 0.22, 0.09, mix(green, 0xffffff, 0.5), { ws: 6, hs: 3, sy: 0.6 });
    }
    const hit = W.jet([0, 0.27, 0.29], [0, 1.5, 1.9], wy - y, 0.03, JET, { n: lo ? 4 : 8, seg: lo ? 3 : 6, ph: a * 2 });
    W.splash(hit[0], wy - y + 0.012, hit[2], 0.05, 0.4, SURF, { T: 1.2, ph: a });
  });
}

/** Kleines Emailleschild (Text als Tafel, siehe plaque), hier nur der Rahmen: w × h, Unterkante y, Wandebene z. */
function plaqueRim(b, x, y, z, w, h) {
  b.F.rbox(x, y - 0.03, z + 0.0125, w + 0.06, h + 0.06, 0.025, 0.01, IRON, { seg: 2, ks: [0.9, 1], prof: [[0, 0], [0, h + 0.06]] });
}
/** Text des Emailleschilds als eigenes Mesh: blau, weißer Rand, zwei Zeilen; Mitte bei (x, y + h/2, z). */
function plaque(kit, key, lines, x, y, z, w, h) {
  const m = textPanel(kit.core, 'plaque:' + key, w, h, 512, (ctx, cw, ch) => {
    ctx.fillStyle = '#fdfbf5';
    ctx.fillRect(0, 0, cw, ch);
    ctx.fillStyle = '#1f4f96';
    ctx.fillRect(7, 7, cw - 14, ch - 14);
    ctx.strokeStyle = '#fdfbf5';
    ctx.lineWidth = 4;
    ctx.strokeRect(18, 18, cw - 36, ch - 36);
    ctx.fillStyle = '#fdfbf5';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    fitFont(ctx, lines[0], Math.round(ch * 0.3), cw - 64);
    ctx.fillText(lines[0], cw / 2, ch * 0.37);
    ctx.font = `bold ${Math.round(ch * 0.24)}px ${FONT}`;
    fitFont(ctx, lines[1], Math.round(ch * 0.24), cw - 64);
    ctx.fillText(lines[1], cw / 2, ch * 0.69);
  });
  m.position.set(x, y + h / 2, z + 0.029);
  return m;
}

const defs = {};

// --- 1. Dorfbrunnen: Steintrog mit Brunnenstock, Auslauf und Schwengel -----------------------------------------
defs.fountainTrough = {
  kind: 'fountain', far: true, fade: 1.4, low: 0.84,
  make(b) {
    const { F, W } = b;
    const near = b.lod === 0;
    const rnd = rng(11);
    paving(b, 2.5, { sx: 1.12, sz: 0.74 });
    const th = 0.74;
    const y0 = 0.1;
    // Trog: Wand, Lippe, innen Wand und Boden
    F.rbox(0.38, y0, 0, 2.5, th, 1.04, 0.16, [STONE, STONE, STONE, STONE, STONE, FLOOR], { prof: [[0.03, 0], [0, 0.08], [0, th - 0.05], [0.02, th], [0.16, th], [0.16, th - 0.3]], ks: [0.8, 0.9, 1, 1.04, 0.95, 0.85], seg: near ? 4 : 2 });
    const wy = y0 + th - 0.1;
    W.poolRect(0.38, wy, 0, 2.2, 0.74, SURF, { c: [-0.68, 0], rings: 0.9 });
    // Brunnenstock mit Kappe und Kugel
    F.rbox(-1.3, y0, 0, 0.46, 1.5, 0.46, 0.08, STONE, { prof: [[0.02, 0], [0, 0.1], [0, 1.38], [-0.05, 1.42], [-0.05, 1.5]], ks: [0.8, 0.9, 1, 1, 1.03] });
    F.frust(-1.3, y0 + 1.5, 0, 0.5, 0.5, 0.2, 0.2, 0.2, STONE, { skip: 'b' });
    F.ball(-1.3, y0 + 1.84, 0, 0.16, STONE, { ws: near ? 12 : 8, hs: near ? 7 : 5 });
    // Auslauf
    F.rod([-1.1, 1.2, 0], [-0.6, 1.2, 0], 0.042, IRON, { seg: 8 });
    F.rod([-0.62, 1.215, 0], [-0.5, 1.07, 0], 0.046, IRON, { seg: 8, caps: true });
    const hit = W.jet([-0.51, 1.07, 0], [0.5, -0.75, 0], wy, 0.032, JET, { n: near ? 7 : 3, seg: near ? 6 : 3, r1: 0.044 });
    W.splash(hit[0], wy + 0.012, 0, 0.05, 0.36, SURF, { T: 1.1 });
    W.splash(hit[0], wy + 0.012, 0, 0.05, 0.36, SURF, { T: 1.1, ph: 0.5 });
    W.drops([hit[0], wy + 0.02, 0], [0, 1.0, 0], wy, 5, JET, rnd, { spread: 0.3, size: 0.018 });
    // Schwengel
    F.rod([-1.3, 1.36, -0.23], [-1.3, 1.5, -0.42], 0.03, IRON, { seg: 6 });
    F.rod([-1.3, 1.5, -0.42], [-1.3, 1.02, -0.74], 0.028, IRON, { seg: 6 });
    F.ball(-1.3, 1.0, -0.76, 0.06, IRON, { ws: 8, hs: 4 });
    if (near) {
      // Geranien im Kasten, Eimer, Moos, eine Taube auf dem Rand
      F.rbox(0.7, y0 + th - 0.36, 0.6, 1.3, 0.22, 0.22, 0.04, CITY.woodDark, { seg: 2 });
      for (let i = 0; i < 6; i++) blossom(b, 0.16 + i * 0.22, y0 + th - 0.08 + (i % 2) * 0.04, 0.6, 0.11, i % 3 === 1 ? CITY.leaf : [PAL.red, 0xf4a6c0][i % 2]);
      F.lathe(1.95, y0, 0.55, [[0.13, 0], [0.17, 0.3], [0.16, 0.3], [0.12, 0.02]], PAL.steel, { seg: 12, ks: [0.8, 1, 0.9, 0.7] });
      b.xf([1.95, y0 + 0.28, 0.55], [-Math.PI / 2 + 0.95, 0.6, 0], 1, () => F.torus(0, 0, 0, 0.17, 0.012, IRON, { seg: 10, tube: 4, a0: -1.45, a1: 1.45 }));
      moss(b, -1.55, y0, 0.32, 0.24);
      moss(b, 1.6, y0, -0.6, 0.2);
      pigeon(b, 1.35, y0 + th, 0.42, 2.3);
    }
    return { w: 5.6, d: 3.7, h: 2.1, r: 2.8, title: 'Dorfbrunnen', size: 'dorf', water: wy, cam: { pos: [1.3, 1.2, 3.4], look: [-0.2, 0.95, 0] } };
  },
};

// --- 2. Marktbrunnen: rundes Becken, Säule mit vier Röhren, obenauf eine kleine goldene Figur ---------------------
function marketFountain(b, o = {}) {
  const { F } = b;
  const near = b.lod === 0;
  const stone = o.stone ?? SAND;
  const R = o.R ?? 2.5;
  paving(b, R + 1.7);
  const by = 0.24;
  const bh = 0.82;
  F.lathe(0, 0.088, 0, [[R + 0.36, 0], [R + 0.36, 0.1], [R + 0.3, by - 0.088]], mix(stone, STONE, 0.5), o.oct ? { seg: 8, facet: true, a0: Math.PI / 8, a1: Math.PI / 8 + TAU } : { seg: segs(R, !near), ks: [0.82, 0.95, 1] });
  const rw = basin(b, 0, by, 0, R, bh, { col: stone, t: 0.34, oct: o.oct });
  const wy = by + bh - 0.13;
  // Säule: Sockel mit Gesims, Schaft, Kapitell
  const ch = o.ch ?? 3.3;
  const cs = o.oct ? { seg: 8, facet: true, a0: Math.PI / 8, a1: Math.PI / 8 + TAU } : { seg: near ? 20 : 10 };
  F.lathe(0, by, 0, [[0.66, 0], [0.66, 0.95], [0.72, 1.0], [0.72, 1.1], [0.5, 1.16], [0.36, 1.34], [0.3, ch - 0.34], [0.4, ch - 0.2], [0.54, ch - 0.12], [0.54, ch], [0.3, ch + 0.05]], stone, { ...cs, ks: [0.72, 0.9, 0.95, 1, 0.96, 0.94, 1, 1, 1, 1.04, 1] });
  b.W.pool(0, wy, 0, rw, SURF, { r0: 0.6, hit: 1.56, rings: 1, seg: o.oct ? 8 : segs(R, !near), a0: o.oct ? Math.PI / 8 : 0, a1: o.oct ? Math.PI / 8 + TAU : TAU });
  for (let i = 0; i < 4; i++) spout(b, (i / 4) * TAU + Math.PI / 4, 0.42, by + 1.78, wy, { len: 0.42, v: 1.55, col: o.spoutCol });
  if (near) {
    // Blumenschmuck auf dem Sockelgesims, Moos am Fuß, Tauben
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU + 0.2;
      blossom(b, Math.sin(a) * 0.6, by + 1.18 + (i % 2) * 0.04, Math.cos(a) * 0.6, i % 2 ? 0.12 : 0.15, i % 2 ? CITY.leaf : [PAL.red, PAL.signYellow, 0xf4a6c0][(i / 2) % 3]);
    }
    moss(b, R * 0.8, 0.1, R * 0.72, 0.26);
    moss(b, -R - 0.2, 0.1, 0.5, 0.22);
    pigeon(b, Math.sin(2.2) * (R - 0.12), by + bh, Math.cos(2.2) * (R - 0.12), 0.6);
    pigeon(b, Math.sin(-0.9) * (R + 1.0), 0.1, Math.cos(-0.9) * (R + 1.0), 2.4, 0xb8bec6);
  }
  return { R, by, bh, wy, ch: by + ch + 0.05 };
}
defs.fountainMarket = {
  kind: 'fountain', far: true, fade: 1.4, low: 0.84,
  make(b) {
    const m = marketFountain(b);
    bear(b, 0, m.ch, 0, 0.95, CITY.gold);
    return { w: 8.4, d: 8.4, h: m.ch + 0.95, r: 4.2, title: 'Marktbrunnen', size: 'klein', water: m.wy, cam: { pos: [1.2, 1.2, 5.3], look: [0, 2.3, 0] } };
  },
};

// --- 3. Schalenbrunnen: drei Stufen, das Wasser fällt in Fäden von Schale zu Schale ------------------------------
defs.fountainBowls = {
  kind: 'fountain', far: true, fade: 1.4, low: 0.84,
  make(b) {
    const { F, W } = b;
    const near = b.lod === 0;
    const rnd = rng(23);
    const stone = CITY.redStone;
    const pale = mix(CITY.redStone, 0xffffff, 0.35);
    paving(b, 4.3);
    const R = 2.7;
    const rw = basin(b, 0, 0.1, 0, R, 0.7, { col: pale, t: 0.32 });
    const wy = 0.1 + 0.7 - 0.12;
    F.lathe(0, 0.1, 0, [[0.6, 0], [0.6, 0.62], [0.5, 0.72], [0.3, 0.9], [0.22, 1.5], [0.3, 1.68]], stone, { seg: near ? 18 : 10, top: false, ks: [0.7, 0.9, 0.95, 0.95, 1, 0.9] });
    const [w1, r1] = bowl(b, 0, 1.7, 0, 1.5, { col: pale });
    F.lathe(0, 1.95, 0, [[0.3, 0], [0.2, 0.2], [0.16, 0.9], [0.22, 1.04]], stone, { seg: near ? 16 : 8, top: false, ks: [0.8, 0.95, 1, 0.9] });
    const [w2, r2] = bowl(b, 0, 2.95, 0, 0.85, { col: pale });
    // Knospe als Spitze, daraus sprudelt es
    F.lathe(0, 3.05, 0, [[0.12, 0], [0.1, 0.3], [0.17, 0.42], [0.12, 0.6], [0.05, 0.66]], stone, { seg: near ? 14 : 8, ks: [0.8, 1, 1, 1.05, 1] });
    W.pool(0, wy, 0, rw, SURF, { r0: 0.55, hit: 1.78, rings: 1, seg: segs(R, !near) });
    W.pool(0, w1, 0, r1, SURF, { r0: 0.2, hit: 0.98, rings: 1, seg: segs(1.5, !near) });
    W.pool(0, w2, 0, r2, SURF, { r0: 0.1, hit: 0.2, rings: 1, seg: segs(0.85, !near) });
    fountainJet(b, 0, 3.68, 0, 0.42, w2, rnd, { r: 0.045, drops: 8, spread: 0.3 });
    // Wasserfäden von Schale zu Schale
    const strands = (n, r, y, yEnd, v, a0) => {
      for (let i = 0; i < n; i++) {
        const a = a0 + (i / n) * TAU;
        const s = Math.sin(a);
        const c = Math.cos(a);
        const hit = W.jet([s * r, y, c * r], [s * v, 0.1, c * v], yEnd, 0.028, JET, { n: near ? 6 : 2, seg: near ? 5 : 3, r1: 0.04, ph: i * 1.7 });
        if (i % 2 === 0) W.splash(hit[0], yEnd + 0.012, hit[2], 0.04, 0.34, SURF, { T: 1.1, ph: i * 0.31 });
      }
    };
    strands(near ? 8 : 6, 0.84, 3.25, w1, 0.3, 0.2);
    strands(near ? 14 : 8, 1.49, 2.22, wy, 0.5, 0);
    if (near) {
      moss(b, 2.1, 0.1, -2.0, 0.26);
      moss(b, -2.6, 0.1, 1.2, 0.22);
      pigeon(b, Math.sin(4) * (R - 0.1), 0.8, Math.cos(4) * (R - 0.1), 2.5, 0xe8e2d8);
      tub(b, 3.55, 0.1, 1.2, 0.36, [PAL.red, 0xf4a6c0]);
      tub(b, -3.5, 0.1, -1.4, 0.36, [PAL.signYellow, PAL.orange]);
    }
    return { w: 8.6, d: 8.6, h: 3.9, r: 4.3, title: 'Schalenbrunnen', size: 'klein', water: wy, cam: { pos: [1.1, 1.2, 5.6], look: [0, 1.9, 0] } };
  },
};

// --- 4. Wasserspiel: Fontänen steigen direkt aus dem Pflaster ----------------------------------------------------
defs.fountainJets = {
  kind: 'fountain', far: true, fade: 1.2, low: 0.88,
  make(b) {
    const { F, W } = b;
    const near = b.lod === 0;
    const rnd = rng(41);
    // Granitplatte mit hellem Randstreifen; in der Mitte steht ein dünner Wasserfilm
    paving(b, 4.6, { col: mix(PAL.stone, 0xffffff, 0.1), h: 0.07 });
    F.lathe(0, 0, 0, [[4.1, 0.058], [4.1, 0.075], [0, 0.075]], GRANITE, { seg: segs(4.1, !near), top: false, ks: [0.9, 0.96, 0.96] });
    const wy = 0.085;
    const film = mix(SURF, GRANITE, 0.4);
    W.pool(0, wy, 0, 3.3, film, { hit: 1.9, rings: 1, seg: segs(3.3, !near) });
    const ring = [1.3, 2.6, 1.9, 0.9, 2.2, 1.5, 2.8, 1.1];
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU;
      const x = Math.sin(a) * 1.9;
      const z = Math.cos(a) * 1.9;
      F.cyl(x, 0.075, z, 0.1, 0.09, 0.03, PAL.steel, { seg: 10 });
      fountainJet(b, x, 0.09, z, ring[i], wy, rnd, { r: 0.045 });
      W.splash(x, wy + 0.012, z, 0.08, 0.5, film, { T: 1.2, ph: i * 0.37 });
    }
    F.cyl(0, 0.075, 0, 0.12, 0.11, 0.03, PAL.steel, { seg: 10 });
    fountainJet(b, 0, 0.09, 0, 3.4, wy, rnd, { r: 0.06, drops: 22 });
    // Sitzwürfel mit Holzauflage am Rand, dazu Lichtpunkte im Pflaster
    for (let i = 0; i < 3; i++) {
      const a = 2.2 + i * 0.75;
      b.at(Math.sin(a) * 4.0, 0.07, Math.cos(a) * 4.0, a, () => {
        F.rbox(0, 0, 0, 0.9, 0.42, 0.9, 0.1, STONE, { seg: 2, ks: [0.84, 1], prof: [[0, 0], [0, 0.42]] });
        if (near) F.rbox(0, 0.42, 0, 0.8, 0.05, 0.8, 0.08, CITY.wood, { seg: 2 });
      });
    }
    if (near) for (let i = 0; i < 16; i++) F.ball(Math.sin((i / 16) * TAU) * 3.75, 0.072, Math.cos((i / 16) * TAU) * 3.75, 0.07, 0xfff1c8, { ws: 8, hs: 2, sy: 0.35, lat: [0, Math.PI / 2], flat: true, k: 1.15 });
    return { w: 9.2, d: 9.2, h: 3.6, r: 4.6, title: 'Wasserspiel', size: 'stadt', water: wy, flat: true, cam: { pos: [1.4, 1.2, 4.6], look: [0, 1.3, 0] } };
  },
};

// --- 5. Prachtbrunnen: zwei Becken, Schale, hohe Mittelfontäne, Bogenstrahlen und vier Frösche -------------------
function grandBase(b, R, stone, rim, o = {}) {
  const { F } = b;
  paving(b, R + 1.9);
  const shape = o.oct ? { seg: 8, facet: true, a0: Math.PI / 8, a1: Math.PI / 8 + TAU } : { seg: segs(R + 1, b.lod > 0) };
  F.lathe(0, 0.088, 0, [[R + 0.5, 0], [R + 0.5, 0.12], [R + 0.44, 0.162]], mix(stone, STONE, 0.5), { ...shape, ks: [0.82, 0.95, 1] });
  return basin(b, 0, 0.25, 0, R, 0.66, { col: rim, t: 0.46, lip: 0.09, oct: o.oct });
}
defs.fountainGrand = {
  kind: 'fountain', far: true, fade: 1.6, low: 0.84,
  make(b) {
    const { F, W } = b;
    const near = b.lod === 0;
    const rnd = rng(57);
    const stone = mix(SAND, 0xffffff, 0.3);
    const R = 5.6;
    const rw = grandBase(b, R, SAND, stone);
    const wy = 0.25 + 0.66 - 0.13;
    // inneres Becken auf einem runden Sockel
    F.lathe(0, 0.25, 0, [[2.75, 0], [2.75, 0.9], [2.85, 0.96]], SAND, { seg: segs(2.8, !near), top: false, ks: [0.7, 0.95, 1] });
    const r2 = basin(b, 0, 1.2, 0, 2.8, 0.5, { col: stone, t: 0.3, depth: 0.3 });
    const w2 = 1.2 + 0.5 - 0.11;
    // Schaft mit Schale
    F.lathe(0, 1.2, 0, [[0.7, 0], [0.7, 0.5], [0.5, 0.62], [0.34, 0.9], [0.3, 1.9], [0.42, 2.1]], SAND, { seg: near ? 20 : 10, top: false, ks: [0.75, 0.95, 0.95, 1, 1, 0.9] });
    const [w3, r3] = bowl(b, 0, 3.3, 0, 1.45, { col: stone });
    F.lathe(0, 3.6, 0, [[0.26, 0], [0.16, 0.25], [0.2, 0.5], [0.1, 0.62]], CITY.gold, { seg: near ? 14 : 8, ks: [0.85, 1, 1, 1] });
    W.pool(0, wy, 0, rw, SURF, { r0: 2.7, hit: 3.45, rings: 1, seg: segs(R, !near) });
    W.pool(0, w2, 0, r2, SURF, { r0: 0.65, hit: 1.75, rings: 1, seg: segs(2.8, !near) });
    W.pool(0, w3, 0, r3, SURF, { r0: 0.2, hit: 0.7, rings: 1, seg: segs(1.45, !near) });
    // hohe Mittelfontäne
    fountainJet(b, 0, 4.2, 0, 3.0, w3, rnd, { r: 0.08, drops: 34, spread: 0.42, size: 0.045 });
    // Fäden aus der Schale ins innere Becken, Überlauf ins große Becken
    const n1 = near ? 12 : 6;
    for (let i = 0; i < n1; i++) {
      const a = (i / n1) * TAU;
      W.jet([Math.sin(a) * 1.44, 3.8, Math.cos(a) * 1.44], [Math.sin(a) * 0.5, 0.1, Math.cos(a) * 0.5], w2, 0.03, JET, { n: near ? 6 : 2, seg: near ? 5 : 3, r1: 0.042, ph: i * 1.3 });
    }
    const n2 = near ? 16 : 8;
    for (let i = 0; i < n2; i++) {
      const a = ((i + 0.5) / n2) * TAU;
      const hit = W.jet([Math.sin(a) * 2.86, 1.7, Math.cos(a) * 2.86], [Math.sin(a) * 0.65, 0.1, Math.cos(a) * 0.65], wy, 0.032, JET, { n: near ? 6 : 2, seg: near ? 5 : 3, r1: 0.046, ph: i * 2.1 });
      if (i % 2) W.splash(hit[0], wy + 0.012, hit[2], 0.05, 0.4, SURF, { T: 1.2, ph: i * 0.23 });
    }
    // acht Bogenstrahlen vom Rand zur Mitte
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU;
      const s = Math.sin(a);
      const c = Math.cos(a);
      F.cyl(s * 5.0, 0.6, c * 5.0, 0.07, 0.05, 0.36, CITY.gold, { seg: 8 });
      const hit = W.jet([s * 5.0, 0.95, c * 5.0], [-s * 1.5, 4.4, -c * 1.5], wy, 0.042, JET, { n: near ? 10 : 4, seg: near ? 6 : 3, r1: 0.052, ph: i });
      W.splash(hit[0], wy + 0.012, hit[2], 0.06, 0.55, SURF, { T: 1.3, ph: i * 0.41 });
      W.drops([s * 4.75, 1.55, c * 4.75], [-s * 1.5, 2.6, -c * 1.5], wy, 3, JET, rnd, { spread: 0.25, size: 0.028 });
    }
    for (let i = 0; i < 4; i++) frog(b, (i / 4) * TAU + Math.PI / 8, R - 0.2, 0.25 + 0.66, wy);
    if (near) {
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * TAU + Math.PI / 4;
        tub(b, Math.sin(a) * (R + 1.2), 0.1, Math.cos(a) * (R + 1.2), 0.42, [BLOOM[i % 3], BLOOM[(i + 1) % 3]], { n: 5 });
      }
      pigeon(b, Math.sin(1.1) * (R - 0.1), 0.91, Math.cos(1.1) * (R - 0.1), 4);
      pigeon(b, Math.sin(-0.5) * (R + 0.9), 0.1, Math.cos(-0.5) * (R + 0.9), 1.2, 0xb8bec6);
    }
    return { w: 15, d: 15, h: 7.6, r: 7.5, title: 'Prachtbrunnen', size: 'gross', water: wy, cam: { pos: [1.8, 1.2, 9.6], look: [0, 2.6, 0] } };
  },
};

// --- 6. Wandbrunnen: Bogenwand mit goldenem Fischkopf, darunter eine halbe Muschelschale -------------------------
defs.fountainWall = {
  kind: 'fountain', far: true, fade: 1.2, low: 0.86,
  make(b) {
    const { F, W } = b;
    const near = b.lod === 0;
    const rnd = rng(63);
    const n = near ? 16 : 8;
    const pts = [[-0.95, 0], [0.95, 0]];
    for (let i = 0; i <= n; i++) pts.push([Math.cos((i / n) * Math.PI) * 0.95, 1.55 + Math.sin((i / n) * Math.PI) * 0.95]);
    F.extrude(pts, 0, 0.24, SAND, { g: [0.86, 1.03], crease: 0.5 });
    // Nische
    const inner = [[-0.6, 0.9], [0.6, 0.9]];
    for (let i = 0; i <= n; i++) inner.push([Math.cos((i / n) * Math.PI) * 0.6, 1.5 + Math.sin((i / n) * Math.PI) * 0.6]);
    F.extrude(inner, 0.24, 0.25, mix(SAND, CITY.sandDark, 0.6), { caps: 'f', sides: false });
    // Sockel und halbrunde Schale (mit Boden)
    F.lathe(0, 0, 0.24, [[0.42, 0], [0.42, 0.1], [0.3, 0.2], [0.26, 0.5], [0.4, 0.6]], SAND, { seg: near ? 12 : 6, a0: -Math.PI / 2, a1: Math.PI / 2, top: false, ks: [0.8, 0.9, 0.9, 1, 0.9] });
    const pale = mix(SAND, 0xffffff, 0.2);
    F.lathe(0, 0.6, 0.24, [[0.3, 0], [0.62, 0.1], [0.82, 0.24], [0.84, 0.3], [0.76, 0.3], [0.7, 0.14]], [pale, pale, pale, pale, pale, FLOOR], { seg: near ? 16 : 8, a0: -Math.PI / 2, a1: Math.PI / 2, ks: [0.72, 0.86, 1, 1.04, 1, 0.85] });
    const wy = 0.84;
    W.pool(0, wy, 0.24, 0.73, SURF, { a0: -Math.PI / 2, a1: Math.PI / 2, seg: near ? 16 : 8, hit: 0.3, rings: 1 });
    // Fischkopf
    F.ball(0, 1.62, 0.3, 0.17, CITY.gold, { ws: near ? 12 : 8, hs: near ? 7 : 5, sz: 0.8 });
    b.xf([0, 1.6, 0.36], [Math.PI / 2, 0, 0], 1, () => F.cyl(0, 0, 0, 0.06, 0.045, 0.12, CITY.gold, { seg: 10 }));
    if (near) {
      for (const k of [-1, 1]) {
        F.ball(k * 0.09, 1.69, 0.4, 0.035, PAL.frame, { ws: 6, hs: 4 });
        F.ball(k * 0.09, 1.695, 0.425, 0.018, CITY.ink, { ws: 5, hs: 3 });
      }
      // kleine Flossen
      for (const k of [-1, 1]) b.xf([k * 0.18, 1.62, 0.27], [0, k * 0.5, k * 0.6], 1, () => F.ball(0, 0, 0, 0.09, mix(CITY.gold, 0xb07c1c, 0.3), { ws: 6, hs: 3, sy: 0.35 }));
    }
    const hit = W.jet([0, 1.6, 0.48], [0, 0.5, 0.42], wy, 0.03, JET, { n: near ? 8 : 3, seg: near ? 6 : 3, r1: 0.04 });
    W.splash(hit[0], wy + 0.012, hit[2], 0.04, 0.28, SURF, { T: 1.1 });
    W.drops([hit[0], wy + 0.02, hit[2]], [0, 0.9, 0], wy, 4, JET, rnd, { spread: 0.22, size: 0.016 });
    if (near) {
      // Efeu über dem Bogen
      for (const [x, y, r] of [[-0.8, 2.25, 0.2], [-0.62, 2.42, 0.17], [-0.9, 2.0, 0.15], [-0.42, 2.52, 0.13]]) F.ball(x, y, 0.2, r, CITY.leafDark, { ws: 8, hs: 5, sz: 0.5 });
      tub(b, 1.25, 0, 0.4, 0.26, [PAL.red, 0xf4a6c0]);
    }
    return { w: 2.4, d: 1.1, h: 2.55, r: 1.3, title: 'Wandbrunnen', size: 'extra', water: wy, wall: true, cam: { pos: [0.7, 1.2, 2.7], look: [0, 1.25, 0.3] } };
  },
};

// --- 7. Trinkbrunnen: absichtlich winzig – zählt der überhaupt? ----------------------------------------------------
defs.fountainDrink = {
  kind: 'fountain', far: true, fade: 1, low: 0.86,
  make(b) {
    const { F, W } = b;
    const near = b.lod === 0;
    const rnd = rng(77);
    const green = 0x3f7d55;
    paving(b, 0.62, { col: STONE, h: 0.06, seg: near ? 20 : 10 });
    F.disc(0.36, 0.05, 0, 0.12, IRON, { up: true, seg: 10 });
    F.lathe(0, 0.05, 0, [[0.2, 0], [0.2, 0.07], [0.12, 0.16], [0.085, 0.3], [0.085, 0.72], [0.13, 0.8]], green, { seg: near ? 14 : 8, top: false, ks: [0.8, 0.9, 0.95, 1, 1, 0.95] });
    F.lathe(0, 0.85, 0, [[0.12, 0], [0.26, 0.07], [0.29, 0.12], [0.24, 0.12], [0.16, 0.06]], [green, green, green, green, FLOOR], { seg: near ? 16 : 8, ks: [0.8, 0.95, 1.05, 1, 0.8] });
    const wy = 0.95;
    W.pool(0, wy, 0, 0.2, SURF, { seg: near ? 16 : 8, hit: 0.08, rings: 1 });
    // der Hahn zeigt nach oben
    F.rod([-0.17, 0.95, 0], [-0.17, 1.07, 0], 0.022, PAL.steel, { seg: 8, caps: true });
    W.jet([-0.17, 1.07, 0], [0.42, 1.25, 0], wy, 0.014, JET, { n: near ? 7 : 3, seg: 5, r1: 0.018, pulse: 0.2 });
    W.drops([0.03, wy + 0.01, 0], [0, 0.5, 0], wy, 3, JET, rnd, { spread: 0.12, size: 0.01 });
    // blaues Emailleschild mit weißem Tropfen
    b.G.disc(0, 0.5, 0.092, 0.07, PAL.signBlue, { seg: 14 });
    b.G.extrude([[0, 0.545], [0.03, 0.49], [0.02, 0.465], [0, 0.458], [-0.02, 0.465], [-0.03, 0.49]], 0.094, 0.096, PAL.frame, { caps: 'f', sides: false });
    if (near) b.xf([0.2, 0.975, -0.2], [0, 2.3, 0], 0.55, () => pigeon(b, 0, 0, 0, 0, 0xb08a6a));
    return { w: 1.3, d: 1.3, h: 1.15, r: 0.9, title: 'Trinkbrunnen', size: 'extra', water: wy, tiny: true, cam: { pos: [0.5, 1.2, 2.1], look: [0, 0.8, 0] } };
  },
};

// --- 8. Fontäne im Teich: ein hoher Strahl, Seerosen, Schilf und zwei Enten ----------------------------------------
defs.fountainPond = {
  kind: 'fountain', far: true, fade: 1.4, low: 0.86,
  make(b) {
    const { F, W } = b;
    const near = b.lod === 0;
    const rnd = rng(89);
    const sz = 0.66;
    const seg = near ? 48 : 20;
    // Ufer: weiche Rasenböschung, darauf ein Kranz runder Steine; innen der Teichboden
    F.lathe(0, 0, 0, [[5.6, 0], [5.4, 0.1], [5.05, 0.17], [4.7, 0.17], [4.5, 0.1], [4.45, 0.03], [0, 0.03]], [PAL.grass[1], PAL.grass[0], mix(PAL.grass[0], STONE, 0.4), STONE, mix(STONE, FLOOR, 0.5), FLOOR], { seg, sz, top: false, ks: [0.86, 0.98, 1, 0.96, 0.8, 0.8, 0.8] });
    const wy = 0.12;
    W.pool(0, wy, 0, 4.55, SURF, { sz, seg, hit: 0.5, rings: 0.9 });
    if (near) {
      for (let i = 0; i < 26; i++) {
        const a = (i / 26) * TAU + 0.1;
        const rr = 4.72 + (i % 3) * 0.06;
        F.ball(Math.sin(a) * rr, 0.15, Math.cos(a) * rr * sz, 0.17 + (i % 4) * 0.035, mix(STONE, i % 2 ? 0xffffff : CITY.slate, 0.15), { ws: 7, hs: 4, sy: 0.55 });
      }
    }
    // Düse auf einem kleinen Schwimmer
    F.lathe(0, wy - 0.02, 0, [[0.3, 0], [0.3, 0.06], [0.1, 0.12], [0.07, 0.24]], PAL.steel, { seg: near ? 14 : 8, ks: [0.8, 1, 1, 1] });
    fountainJet(b, 0, wy + 0.24, 0, 6.2, wy, rnd, { r: 0.07, drops: 30, spread: 0.55, size: 0.05 });
    for (let i = 0; i < 3; i++) W.splash(0, wy + 0.012, 0, 0.3, 1.7, SURF, { T: 2.1, ph: i / 3, w: 0.04, seg: 18 });
    // Schilf, Seerosen
    const reeds = (x, z, n, seed) => {
      const r = rng(seed);
      for (let i = 0; i < n; i++) {
        const px = x + (r() - 0.5) * 0.7;
        const pz = z + (r() - 0.5) * 0.5;
        const h = 0.9 + r() * 0.7;
        F.cyl(px, wy - 0.05, pz, 0.03, 0.012, h, CITY.leaf, { seg: 5, k: 0.9 + r() * 0.2 });
        if (i % 2 === 0) F.lathe(px, wy + h - 0.1, pz, [[0.02, 0], [0.045, 0.04], [0.045, 0.2], [0.01, 0.26]], PAL.trunk, { seg: 6 });
      }
    };
    reeds(-3.6, -0.9, near ? 9 : 4, 3);
    reeds(3.3, -1.5, near ? 7 : 3, 5);
    if (near) {
      for (const [x, z, r, f] of [[-2.2, 1.2, 0.3, 1], [-1.7, 1.55, 0.24, 0], [-2.7, 1.5, 0.22, 0], [2.4, 1.3, 0.28, 1], [2.9, 0.9, 0.2, 0], [1.6, -1.9, 0.26, 1]]) {
        F.disc(x, wy + 0.015, z, r, 0x4f9a52, { up: true, seg: 12 });
        if (f) blossom(b, x + 0.05, wy + 0.07, z, 0.09, 0xf4a6c0);
      }
      duck(b, 1.5, wy, 0.9, 2.2);
      duck(b, 2.05, wy, 0.55, 2.5, { col: 0xb08a6a, head: 0xb08a6a });
      W.splash(1.5, wy + 0.012, 0.9, 0.2, 0.6, SURF, { T: 2.4, ph: 0.3 });
      W.splash(2.05, wy + 0.012, 0.55, 0.2, 0.6, SURF, { T: 2.4, ph: 0.8 });
      for (let i = 0; i < 5; i++) blossom(b, 4.9 + Math.sin(i * 2) * 0.2, 0.2, -1.4 + i * 0.2, 0.09, BLOOM[i % 4]);
      bench(b, -4.6, 0, 3.0, Math.PI + 0.9);
    }
    return { w: 11.2, d: 7.4, h: 6.7, r: 5.6, title: 'Fontäne im Teich', size: 'stadt', water: wy, flat: true, cam: { pos: [1.6, 1.2, 6.2], look: [0, 2.2, 0] } };
  },
};

// --- 9. Der Ursprung (Augsburg): achteckiger Marktbrunnen mit goldener Zirbelnuss und Emailleschild -----------------
// Das Schild sitzt auf der vorderen Seite des achteckigen Beckens: flach auf flach, nichts schwebt.
const ORIGIN_R = 2.7;
const ORIGIN_PLAQUE = { w: 0.92, h: 0.32, y: 0.27, z: ORIGIN_R * Math.cos(Math.PI / 8) };
defs.fountainOrigin = {
  kind: 'fountain', far: true, fade: 1.4, low: 0.84, special: 'ursprung', place: 'Augsburg',
  make(b) {
    const { F } = b;
    const near = b.lod === 0;
    const m = marketFountain(b, { stone: mix(SAND, CITY.redStone, 0.3), oct: true, R: ORIGIN_R, ch: 3.5, spoutCol: mix(CITY.gold, 0x8a5a1c, 0.2) });
    // Zirbelnuss auf grünem Fuß: geschuppt (kantig), golden
    F.lathe(0, m.ch, 0, [[0.2, 0], [0.26, 0.08], [0.14, 0.2]], 0x3f7d55, { seg: 8, ks: [0.9, 1, 1] });
    F.lathe(0, m.ch + 0.18, 0, [[0.14, 0], [0.34, 0.22], [0.4, 0.46], [0.33, 0.72], [0.2, 0.94], [0.04, 1.08]], CITY.gold, { seg: 8, facet: true, ks: [0.86, 0.95, 1.05, 1.05, 1, 1] });
    if (near) for (let k = 0; k < 3; k++) F.lathe(0, m.ch + 0.38 + k * 0.24, 0, [[0.41 - k * 0.07, 0], [0.37 - k * 0.07, 0.035]], mix(CITY.gold, 0x8a5a1c, 0.35), { seg: 8, facet: true, top: false });
    const P = ORIGIN_PLAQUE;
    plaqueRim(b, 0, m.by + P.y, P.z, P.w, P.h);
    return { w: 9, d: 9, h: m.ch + 1.26, r: 4.5, title: 'Der Ursprung', size: 'besonders', water: m.wy, special: 'ursprung', place: 'Augsburg', cam: { pos: [0.9, 1.2, 5.4], look: [0, 1.6, 0] } };
  },
  extras: (kit) => [plaque(kit, 'ursprung', ['Hier begann BrunnenTV', '04.05.2017'], 0, 0.24 + ORIGIN_PLAQUE.y, ORIGIN_PLAQUE.z, ORIGIN_PLAQUE.w, ORIGIN_PLAQUE.h)],
};

// --- 10. Der Endgegner (Nürnberg): der höchste und prächtigste Brunnen des Baukastens ------------------------------
const BOSS_R = 5.4;
const BOSS_PLAQUE = { w: 1.0, h: 0.29, y: 0.2, z: BOSS_R * Math.cos(Math.PI / 8) };
defs.fountainBoss = {
  kind: 'fountain', far: true, fade: 1.6, low: 0.84, special: 'endgegner', place: 'Nürnberg',
  make(b) {
    const { F, W } = b;
    const near = b.lod === 0;
    const rnd = rng(101);
    const stone = mix(SAND, 0xffffff, 0.25);
    const R = BOSS_R;
    const rw = grandBase(b, R, SAND, stone, { oct: true });
    const wy = 0.25 + 0.66 - 0.13;
    W.pool(0, wy, 0, rw, SURF, { r0: 1.9, hit: 3.3, rings: 1, seg: 8, a0: Math.PI / 8, a1: Math.PI / 8 + TAU });
    // Turm aus vier schlanker werdenden Stockwerken, achteckig, mit Spitzbogen-Nischen, Goldbändern und Fialen
    const tiers = [[2.0, 3.1], [1.5, 2.8], [1.05, 2.5], [0.66, 2.2]];
    const accent = [PAL.signBlue, PAL.red, PAL.signBlue, PAL.red];
    let y = 0.25;
    F.lathe(0, y, 0, [[2.45, 0], [2.45, 0.7], [2.2, 0.86]], SAND, { seg: 8, facet: true, ks: [0.72, 0.95, 1] });
    y += 0.86;
    const ledges = [];
    tiers.forEach(([r, h], k) => {
      F.lathe(0, y, 0, [[r, 0], [r, h - 0.3], [r + 0.16, h - 0.22], [r + 0.16, h - 0.06], [r - 0.1, h]], stone, { seg: 8, facet: true, ks: [0.86, 1, 1, 1.04, 1] });
      // Goldband und Nischen auf jeder der acht Seiten
      F.lathe(0, y + h - 0.3, 0, [[r + 0.02, 0], [r + 0.02, 0.07]], CITY.gold, { seg: 8, facet: true, top: false });
      const fw = 2 * r * Math.tan(Math.PI / 8);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * TAU + Math.PI / 8;
        b.at(Math.sin(a) * r * Math.cos(Math.PI / 8), y, Math.cos(a) * r * Math.cos(Math.PI / 8), a, () => {
          const w = fw * 0.5;
          const ah = h * 0.62;
          const pts = [[-w / 2, 0.3], [w / 2, 0.3], [w / 2, 0.3 + ah * 0.6], [0, 0.3 + ah], [-w / 2, 0.3 + ah * 0.6]];
          F.extrude(pts, 0.012, 0.014, mix(accent[k], CITY.ink, 0.25), { caps: 'f', sides: false, g: [0.9, 1.1] });
          if (near && k < 3) F.ball(0, 0.3 + ah * 0.22, 0.02, w * 0.2, CITY.gold, { ws: 8, hs: 4, sz: 0.4 });
        });
        // Fialen auf den Ecken
        const c = (i / 8) * TAU;
        if (near || k < 2) {
          F.cyl(Math.sin(c) * (r + 0.05), y + h - 0.06, Math.cos(c) * (r + 0.05), 0.09, 0.02, 0.62, stone, { seg: 6 });
          if (near) F.ball(Math.sin(c) * (r + 0.05), y + h + 0.58, Math.cos(c) * (r + 0.05), 0.05, CITY.gold, { ws: 5, hs: 3 });
        }
      }
      ledges.push([r, y]);
      y += h;
    });
    // Helm mit goldener Krone
    F.lathe(0, y, 0, [[0.56, 0], [0.2, 1.5], [0.12, 1.9]], accent[0], { seg: 8, facet: true, g: [0.9, 1.1] });
    const cy = y + 1.9;
    F.lathe(0, cy, 0, [[0.14, 0], [0.34, 0.1], [0.36, 0.3]], CITY.gold, { seg: 12, top: false, ks: [0.85, 1, 1.05] });
    for (let i = 0; i < 8; i++) F.cyl(Math.sin((i / 8) * TAU) * 0.35, cy + 0.28, Math.cos((i / 8) * TAU) * 0.35, 0.07, 0.01, 0.24, CITY.gold, { seg: 5 });
    F.ball(0, cy + 0.2, 0, 0.16, PAL.red, { ws: 8, hs: 5 });
    // Wasser: aus jedem Stockwerk Röhren ins Becken, vom Rand acht hohe Bögen zum Turm
    ledges.forEach(([r, yy], k) => {
      if (k > 2) return;
      for (let i = 0; i < 8; i++) {
        if ((!near || k > 0) && i % 2) continue;
        const a = (i / 8) * TAU + Math.PI / 8 + k * 0.1;
        spout(b, a, r * Math.cos(Math.PI / 8), yy + 0.24, wy, { len: 0.3 + k * 0.1, v: 1.1 + k * 0.55, vy: 0.4, r: 0.03, col: CITY.gold, pipe: 0.04, tip: false, n: 7, seg: 5 });
      }
    });
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU;
      const s = Math.sin(a);
      const c = Math.cos(a);
      F.cyl(s * 4.55, 0.6, c * 4.55, 0.08, 0.055, 0.4, CITY.gold, { seg: 8 });
      const hit = W.jet([s * 4.55, 1.0, c * 4.55], [-s * 1.0, 6.6, -c * 1.0], wy, 0.045, JET, { n: near ? 10 : 4, seg: near ? 6 : 3, r1: 0.055, ph: i });
      W.splash(hit[0], wy + 0.012, hit[2], 0.06, 0.6, SURF, { T: 1.3, ph: i * 0.29 });
      W.drops([s * 4.35, 2.1, c * 4.35], [-s * 1.0, 4.6, -c * 1.0], wy, 4, JET, rnd, { spread: 0.25, size: 0.03 });
    }
    fountainJet(b, 0, cy + 0.36, 0, 1.1, wy, rnd, { r: 0.05, drops: 14, spread: 0.7, size: 0.04 });
    for (let i = 0; i < 4; i++) frog(b, (i / 4) * TAU + Math.PI / 4, (R - 0.2) * Math.cos(Math.PI / 8), 0.25 + 0.66, wy);
    if (near) {
      // der goldene Ring im Gitter am Beckenrand (wer ihn dreht, hat Glück)
      const ra = Math.PI / 2;
      const rf = R * Math.cos(Math.PI / 8);
      b.xf([Math.sin(ra) * (rf + 0.03), 0.6, Math.cos(ra) * (rf + 0.03)], [0, ra, 0], 1, () => {
        b.xf([0, 0, 0], [Math.PI / 2, 0, 0], 1, () => F.torus(0, 0, 0, 0.13, 0.026, CITY.gold, { seg: 16, tube: 6 }));
        F.ball(0, 0.13, -0.01, 0.035, IRON, { ws: 6, hs: 4 });
      });
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * TAU + Math.PI / 4;
        tub(b, Math.sin(a) * (R + 1.2), 0.1, Math.cos(a) * (R + 1.2), 0.42, [BLOOM[(i + 1) % 3], BLOOM[i % 3]], { n: 5 });
      }
    }
    const P = BOSS_PLAQUE;
    plaqueRim(b, 0, 0.25 + P.y, P.z, P.w, P.h);
    return { w: 14.6, d: 14.6, h: cy + 1.5, r: 7.3, title: 'Der Endgegner', size: 'besonders', water: wy, special: 'endgegner', place: 'Nürnberg', cam: { pos: [2.2, 1.2, 9.4], look: [0, 4.2, 0] } };
  },
  extras: (kit) => [plaque(kit, 'endgegner', ['Der Brunnen-Endgegner', 'besiegt am 01.02.2018'], 0, 0.25 + BOSS_PLAQUE.y, BOSS_PLAQUE.z, BOSS_PLAQUE.w, BOSS_PLAQUE.h)],
};

/** Die Brunnen-Familie. Jede info trägt title (deutscher Name), size (dorf, klein, stadt, gross, extra, besonders) und cam. */
export function createFountainKit(F) {
  return makeKit(F, defs);
}
