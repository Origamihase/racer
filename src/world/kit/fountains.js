// Stadt-Baukasten, Teil Brunnen (#BrunnenTV): Kein Ort ohne Brunnen. Acht Arten vom Dorftrog bis zum
// Prachtbrunnen, dazu zwei besondere: der Ursprung (Augsburg, 04.05.2017) und der Endgegner (Nürnberg).
// Ursprung jedes Brunnens: Mitte seiner Grundfläche, die Schauseite blickt nach +z; der Wandbrunnen lehnt mit dem
// Rücken (z = 0) an einer Wand. Stein und Figuren liegen im Eimer F, alles Wasser im Eimer W: Den bewegt allein der
// Shader (Strahlen pulsieren, Tropfen fliegen ihre Wurfparabel, Ringe laufen über die Fläche, im Regen tüpfeln
// Tropfen). Ein Brunnen kostet so zwei Draw Calls (Stein, Wasser), im verschmolzenen Ort gar keinen eigenen.
// Jede info trägt cam = { pos, look }: die Nahaufnahme aus 2–4 m in 1,2 m Höhe (Mini Adams Selfie-Kamera).
import { PAL, CITY, mix, rng, makeKit, compose, Bau, textPanel, fitFont, FONT } from './citycore.js';
import { tub, moss, pigeon, duck, blossom, bench, flowerBed, BLOOM } from './parts.js';
import { STILL_LOW } from './layout.js';
import { placeFigure, shieldPts } from './brunnenfiguren.js';
import { STONES } from './brunnenpass.js';

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
  // das Pflaster gehört zum Platz, nicht zum Stein des Brunnens (Ortsbrunnen färben nur den Brunnen um)
  const rc = b.recol;
  b.recol = null;
  pavingRings(b, r, o);
  b.recol = rc;
}
function pavingRings(b, r, o) {
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
 * der Randoberkante o.depth. o.oct: achteckig mit einer Seite nach vorn, o.n: n-eckig ebenso. Gibt den Radius der Wasserfläche
 * zurück.
 */
function basin(b, x, y, z, r, h, o = {}) {
  const t = o.t ?? 0.3;
  const lip = o.lip ?? 0.07;
  const depth = o.depth ?? 0.42;
  const col = o.col ?? STONE;
  const n = o.oct ? 8 : o.n;
  const shape = n ? { seg: n, facet: true, a0: Math.PI / n, a1: Math.PI / n + TAU } : { seg: o.seg ?? segs(r, b.lod > 0) };
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
    topFig(b, -1.3, y0 + 1.7, 0, 0.66, () => F.ball(-1.3, y0 + 1.84, 0, 0.16, STONE, { ws: near ? 12 : 8, hs: near ? 7 : 5 }));
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
  const ns = o.spouts ?? 4;
  for (let i = 0; i < ns; i++) spout(b, (i / ns) * TAU + Math.PI / ns, 0.42, by + 1.78, wy, { len: 0.42, v: 1.55, col: o.spoutCol });
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
    const m = marketFountain(b, DECO?.form ?? {});
    topFig(b, 0, m.ch, 0, 1.2, () => bear(b, 0, m.ch, 0, 0.95, CITY.gold));
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
    const bud = () => F.lathe(0, 3.05, 0, [[0.12, 0], [0.1, 0.3], [0.17, 0.42], [0.12, 0.6], [0.05, 0.66]], stone, { seg: near ? 14 : 8, ks: [0.8, 1, 1, 1.05, 1] });
    W.pool(0, wy, 0, rw, SURF, { r0: 0.55, hit: 1.78, rings: 1, seg: segs(R, !near) });
    W.pool(0, w1, 0, r1, SURF, { r0: 0.2, hit: 0.98, rings: 1, seg: segs(1.5, !near) });
    W.pool(0, w2, 0, r2, SURF, { r0: 0.1, hit: 0.2, rings: 1, seg: segs(0.85, !near) });
    topFig(b, 0, 3.05, 0, 0.95, () => {
      bud();
      fountainJet(b, 0, 3.68, 0, 0.42, w2, rnd, { r: 0.045, drops: 8, spread: 0.3 });
    }, { ped: 0.3, pr: 0.15, col: stone });
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
    const finial = () => F.lathe(0, 3.6, 0, [[0.26, 0], [0.16, 0.25], [0.2, 0.5], [0.1, 0.62]], CITY.gold, { seg: near ? 14 : 8, ks: [0.85, 1, 1, 1] });
    W.pool(0, wy, 0, rw, SURF, { r0: 2.7, hit: 3.45, rings: 1, seg: segs(R, !near) });
    W.pool(0, w2, 0, r2, SURF, { r0: 0.65, hit: 1.75, rings: 1, seg: segs(2.8, !near) });
    W.pool(0, w3, 0, r3, SURF, { r0: 0.2, hit: 0.7, rings: 1, seg: segs(1.45, !near) });
    // hohe Mittelfontäne
    topFig(b, 0, 3.6, 0, 1.6, () => {
      finial();
      fountainJet(b, 0, 4.2, 0, 3.0, w3, rnd, { r: 0.08, drops: 34, spread: 0.42, size: 0.045 });
    }, { ped: 0.35, pr: 0.24, col: SAND });
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

// --- Die zweite Familie (Städte-Schritt, 20.11.): klein genug für jede Insel, jede mit eigener Form und eigenem Stein --
const LIME = 0xddd3be; // heller Kalkstein
const RED = mix(CITY.redStone, 0xffffff, 0.22); // roter Sandstein, aufgehellt
const FIELD = mix(PAL.stone, 0x9c8c76, 0.45); // Feldstein
const BASALT = 0x66717d; // dunkler Granit
const PATINA = 0x78ab8f; // Bronze mit Grünspan
const MANE = 0xd59d44; // Löwenmähne (Messing)

// --- 11. Ziehbrunnen: runder Schacht aus Feldsteinen, Holzdach auf zwei Pfosten, Kurbel, Seil und tropfender Eimer -
defs.fountainWell = {
  kind: 'fountain', far: true, fade: 1.4, low: 0.84,
  make(b) {
    const { F, W } = b;
    const near = b.lod === 0;
    const rnd = rng(113);
    paving(b, 2.3, { col: mix(PAL.cobble, 0x9a8a78, 0.2) });
    const y0 = 0.08;
    const R = 0.98;
    const hw = 0.84;
    const seg = segs(R * 1.6, !near);
    // Mauer: Fuß, Wand, Abdeckplatte mit runder Kante, innen hinab bis zum dunklen Wasser
    F.lathe(0, y0, 0, [[R + 0.05, 0], [R + 0.05, 0.08], [R, 0.12], [R, hw - 0.1], [R + 0.06, hw - 0.06], [R + 0.06, hw], [R - 0.26, hw], [R - 0.26, hw - 0.03], [R - 0.21, hw - 0.08], [R - 0.21, 0.3]],
      [FIELD, FIELD, FIELD, LIME, LIME, LIME, LIME, FIELD, FIELD, FLOOR], { seg, ks: [0.78, 0.84, 0.88, 1, 1.02, 1.06, 1.04, 0.86, 0.8, 0.55] });
    const wy = y0 + 0.5;
    W.pool(0, wy, 0, R - 0.22, mix(SURF, FLOOR, 0.45), { seg, hit: 0.3, rings: 1 });
    if (near) {
      // Feldsteine, die aus der Mauer schauen: zwei versetzte Reihen
      for (let row = 0; row < 2; row++) {
        for (let i = 0; i < 14; i++) {
          const a = ((i + row * 0.5) / 14) * TAU;
          const k = 0.92 + 0.12 * ((i * 7 + row * 3) % 5) / 4;
          b.at(Math.sin(a) * R, y0 + 0.24 + row * 0.27, Math.cos(a) * R, a, () => F.rbox(0, 0, 0, 0.32, 0.17, 0.07, 0.035, mix(FIELD, 0xffffff, 0.08 * (i % 3)), { seg: 2, k }));
        }
      }
    }
    // Pfosten, Dach aus zwei Schindelflächen mit Firstbalken
    const wood = CITY.woodDark;
    for (const x of [-1.12, 1.12]) F.rbox(x, y0 - 0.02, 0, 0.15, 2.4, 0.15, 0.035, wood, { seg: 2, ks: [0.85, 1.02] });
    const roof = PAL.roof[1];
    for (const k of [-1, 1]) {
      b.xf([k * 0.675, 2.675, 0], [0, 0, -k * 0.507], 1, () => {
        F.rbox(0, -0.04, 0, 1.6, 0.08, 1.7, 0.035, roof, { seg: 2, ks: [0.86, 1.04] });
        if (near) for (let i = 0; i < 4; i++) F.box(-0.6 + i * 0.4, 0.035, 0, 0.03, 0.025, 1.66, mix(roof, CITY.ink, 0.2), { skip: 'b' });
      });
    }
    F.rod([0, 3.06, -0.9], [0, 3.06, 0.9], 0.06, wood, { seg: 8, caps: true });
    topFig(b, 0, 3.1, 0, 0.55, null);
    // Welle mit Seiltrommel und Kurbel, das Seil hinab zum Eimer
    F.rod([-1.08, 1.86, 0], [1.3, 1.86, 0], 0.055, CITY.wood, { seg: 10, caps: true });
    F.rod([-0.32, 1.86, 0], [0.32, 1.86, 0], 0.1, 0xd9c49a, { seg: 12, caps: true });
    F.rod([1.3, 1.86, 0], [1.3, 1.6, 0.05], 0.03, IRON, { seg: 6, caps: true });
    F.rod([1.3, 1.6, 0.05], [1.48, 1.6, 0.05], 0.035, CITY.woodDark, { seg: 6, caps: true });
    F.rod([0, 1.78, 0.05], [0, 1.36, 0.05], 0.014, 0xd9c49a, { seg: 5 });
    // Holzeimer mit zwei Eisenbändern und Henkel; daraus tropft es in den Schacht
    const bc = mix(CITY.wood, 0xffffff, 0.1);
    F.lathe(0, 1.02, 0.05, [[0.13, 0], [0.135, 0.06], [0.15, 0.08], [0.155, 0.16], [0.17, 0.19], [0.175, 0.27], [0.16, 0.27], [0.15, 0.06]], [bc, IRON, bc, IRON, bc, bc, mix(bc, CITY.ink, 0.3)], { seg: near ? 14 : 8, ks: [0.8, 0.9, 0.95, 1, 1, 1.05, 0.8] });
    b.xf([0, 1.29, 0.05], [Math.PI / 2, 0, 0], 1, () => F.torus(0, 0, 0, 0.17, 0.011, IRON, { seg: 10, tube: 4, a0: -Math.PI / 2, a1: Math.PI / 2 }));
    W.drops([0.06, 1.02, 0.08], [0, 0.15, 0], wy, 4, JET, rnd, { spread: 0.05, size: 0.016 });
    W.splash(0.06, wy + 0.012, 0.08, 0.04, 0.4, mix(SURF, FLOOR, 0.45), { T: 1.4 });
    if (near) {
      tub(b, -1.62, y0, 0.95, 0.3, [PAL.red, 0xf4a6c0]);
      tub(b, 1.55, y0, -1.0, 0.26, [PAL.signYellow, PAL.orange]);
      moss(b, -0.75, y0, -0.95, 0.2);
      pigeon(b, 0.25, 3.12, 0.3, 1.2, 0xb8bec6);
      pigeon(b, -0.62, y0 + hw, 0.62, 2.6);
    }
    return { w: 4.6, d: 4.6, h: 3.45, r: 2.4, title: 'Ziehbrunnen', size: 'dorf', water: wy, cam: { pos: [1.1, 1.2, 3.2], look: [0, 1.35, 0] } };
  },
};

// --- 12. Froschbrunnen: ein dicker, freundlicher Frosch mit Krönchen auf einer Steinkugel spuckt einen Bogen ins Becken,
// vier kleine Frösche am Rand spucken mit, Seerosenblätter treiben ---------------------------------------------------
defs.fountainFrog = {
  kind: 'fountain', far: true, fade: 1.4, low: 0.84,
  make(b) {
    const { F, W } = b;
    const near = b.lod === 0;
    const rnd = rng(127);
    paving(b, 2.65);
    const R = 2.0;
    const by = 0.08;
    const rw = basin(b, 0, by, 0, R, 0.62, { col: LIME, t: 0.3 });
    const wy = by + 0.62 - 0.12;
    W.pool(0, wy, 0, rw, SURF, { r0: 0.5, hit: 1.3, rings: 1, seg: segs(R, !near) });
    // Sockel und Steinkugel
    F.lathe(0, by, 0, [[0.5, 0], [0.5, 0.42], [0.4, 0.5], [0.32, 0.72], [0.44, 0.8], [0.44, 0.86], [0.3, 0.9]], LIME, { seg: near ? 20 : 10, ks: [0.7, 0.85, 0.9, 0.95, 1, 1.04, 1] });
    F.ball(0, by + 1.18, 0, 0.36, mix(LIME, PAL.stone, 0.4), { ws: near ? 16 : 8, hs: near ? 10 : 5 });
    // der Frosch: Bauch nach vorn (+z), Kopf mit großen Augen, Krönchen, Beinchen
    const green = 0x67b85a;
    const fy = by + 1.5;
    b.at(0, fy, 0, 0, () => {
      F.ball(0, 0.16, -0.04, 0.32, green, { ws: near ? 14 : 8, hs: near ? 8 : 5, sy: 0.72, sz: 1.08 });
      F.ball(0, 0.4, 0.1, 0.25, green, { ws: near ? 14 : 8, hs: near ? 8 : 5, sy: 0.8 });
      F.ball(0, 0.14, 0.2, 0.19, mix(green, 0xffffff, 0.5), { ws: near ? 10 : 6, hs: 5, sy: 0.8, sz: 0.5 });
      for (const k of [-1, 1]) {
        F.ball(k * 0.11, 0.56, 0.13, 0.095, PAL.frame, { ws: near ? 10 : 6, hs: near ? 6 : 4 });
        if (near) F.ball(k * 0.11, 0.575, 0.21, 0.042, CITY.ink, { ws: 6, hs: 4 });
        F.ball(k * 0.2, 0.06, 0.2, 0.08, green, { ws: 8, hs: 4, sy: 0.6, sz: 1.3 });
        F.ball(k * 0.27, 0.08, -0.12, 0.15, mix(green, 0x2f5f43, 0.2), { ws: near ? 10 : 6, hs: 4, sy: 0.6, sz: 1.3 });
        if (near) F.ball(k * 0.16, 0.42, 0.29, 0.035, 0xf4a6a0, { ws: 6, hs: 3, sz: 0.4 });
      }
      // Krönchen: Reif mit fünf Zacken und Kugeln
      F.lathe(0, 0.6, 0.06, [[0.1, 0], [0.11, 0.05], [0.1, 0.06]], CITY.gold, { seg: 12, top: false });
      if (near) for (let i = 0; i < 5; i++) {
        const a = (i / 5) * TAU;
        F.cyl(Math.sin(a) * 0.1, 0.65, 0.06 + Math.cos(a) * 0.1, 0.022, 0.006, 0.07, CITY.gold, { seg: 5 });
        F.ball(Math.sin(a) * 0.1, 0.725, 0.06 + Math.cos(a) * 0.1, 0.014, PAL.red, { ws: 5, hs: 3 });
      }
    });
    // er spuckt einen Bogen nach vorn ins Becken
    const hit = W.jet([0, fy + 0.34, 0.33], [0, 1.4, 1.35], wy, 0.034, JET, { n: near ? 10 : 4, seg: near ? 6 : 3, r1: 0.045 });
    W.splash(hit[0], wy + 0.012, hit[2], 0.06, 0.5, SURF, { T: 1.3 });
    W.splash(hit[0], wy + 0.012, hit[2], 0.06, 0.5, SURF, { T: 1.3, ph: 0.5 });
    W.drops([hit[0], wy + 0.02, hit[2]], [0, 1.0, 0], wy, 5, JET, rnd, { spread: 0.3, size: 0.02 });
    for (let i = 0; i < 4; i++) frog(b, (i / 4) * TAU + Math.PI / 4, R - 0.2, by + 0.62, wy);
    if (near) {
      for (const [x, z, r, f] of [[-1.05, 0.55, 0.2, 1], [-0.8, 0.95, 0.15, 0], [1.1, -0.35, 0.18, 1], [0.55, -1.15, 0.16, 0]]) {
        F.disc(x, wy + 0.015, z, r, 0x4f9a52, { up: true, seg: 12 });
        if (f) blossom(b, x + 0.04, wy + 0.06, z, 0.07, 0xf4a6c0);
      }
      tub(b, -2.3, by, -0.9, 0.3, [PAL.signYellow, PAL.red]);
      pigeon(b, Math.sin(2.6) * (R + 0.35), by, Math.cos(2.6) * (R + 0.35), 2.4, 0xb8bec6);
    }
    return { w: 5.3, d: 5.3, h: 2.35, r: 2.7, title: 'Froschbrunnen', size: 'dorf', water: wy, cam: { pos: [1.1, 1.2, 3.7], look: [0, 1.45, 0] } };
  },
};

// --- 13. Gänselieselbrunnen: achteckiges Becken, Säule mit Schale, obenauf ein Mädchen mit einer Gans unter dem Arm –
// die Gans spuckt in die Schale, aus der Schale rinnt es ins Becken ---------------------------------------------------
defs.fountainGoose = {
  kind: 'fountain', far: true, fade: 1.4, low: 0.84,
  make(b) {
    const { F, W } = b;
    const near = b.lod === 0;
    const rnd = rng(131);
    paving(b, 2.75);
    const R = 2.05;
    const by = 0.08;
    const oct = { seg: 8, a0: Math.PI / 8, a1: Math.PI / 8 + TAU };
    const rw = basin(b, 0, by, 0, R, 0.66, { col: RED, t: 0.3, oct: true });
    const wy = by + 0.66 - 0.13;
    W.pool(0, wy, 0, rw, SURF, { r0: 0.5, hit: 1.25, rings: 1, ...oct });
    // Säule mit Schale
    F.lathe(0, by, 0, [[0.46, 0], [0.46, 0.5], [0.36, 0.6], [0.27, 0.76], [0.25, 1.4], [0.34, 1.48], [0.44, 1.56], [0.44, 1.68], [0.3, 1.72]], RED, { seg: near ? 18 : 10, ks: [0.7, 0.86, 0.92, 0.95, 1, 1, 1.02, 1.05, 1] });
    const [w2, r2] = bowl(b, 0, by + 0.9, 0, 0.66, { col: mix(RED, 0xffffff, 0.15) });
    W.pool(0, w2, 0, r2, SURF, { r0: 0.26, hit: 0.48, rings: 1, seg: near ? 20 : 10 });
    for (let i = 0; i < (near ? 8 : 4); i++) {
      const a = (i / (near ? 8 : 4)) * TAU + 0.3;
      const hit = W.jet([Math.sin(a) * 0.65, w2 + 0.02, Math.cos(a) * 0.65], [Math.sin(a) * 0.4, 0.05, Math.cos(a) * 0.4], wy, 0.026, JET, { n: near ? 6 : 2, seg: near ? 5 : 3, r1: 0.036, ph: i * 1.3 });
      if (i % 2 === 0) W.splash(hit[0], wy + 0.012, hit[2], 0.04, 0.32, SURF, { T: 1.1, ph: i * 0.29 });
    }
    // das Mädchen (Bronze mit Grünspan): Glockenrock, Mieder, Kopf mit Dutt und Zöpfen, Korb am rechten Arm
    const top = by + 1.72;
    const pat = PATINA;
    const dark = mix(PATINA, 0x2f4f46, 0.35);
    b.at(0, top, 0, 0, () => {
      F.lathe(0, 0, 0, [[0.24, 0], [0.24, 0.04], [0.2, 0.2], [0.14, 0.42], [0.11, 0.5]], pat, { seg: near ? 16 : 8, ks: [0.8, 0.85, 0.95, 1, 1] });
      F.ball(0, 0.62, 0, 0.12, pat, { ws: near ? 12 : 8, hs: 6, sy: 1.25, sz: 0.85 });
      F.ball(0, 0.88, 0.01, 0.13, mix(pat, 0xffffff, 0.12), { ws: near ? 14 : 8, hs: near ? 8 : 5 });
      F.ball(0, 0.95, -0.08, 0.075, dark, { ws: 8, hs: 5 });
      if (near) {
        for (const k of [-1, 1]) {
          F.rod([k * 0.09, 0.9, -0.06], [k * 0.12, 0.66, -0.07], 0.03, dark, { seg: 6, caps: true });
          F.ball(k * 0.045, 0.9, 0.12, 0.016, CITY.ink, { ws: 5, hs: 3 });
          F.ball(k * 0.075, 0.855, 0.11, 0.02, mix(pat, 0xf4a6a0, 0.4), { ws: 5, hs: 3, sz: 0.4 });
        }
        F.ball(0, 0.03, 0.2, 0.04, dark, { ws: 6, hs: 3, sy: 0.6 });
      }
      // rechter Arm mit Korb, linker Arm um die Gans
      F.rod([0.11, 0.7, 0], [0.18, 0.5, 0.06], 0.035, pat, { seg: 6, caps: true });
      F.lathe(0.21, 0.36, 0.08, [[0.05, 0], [0.09, 0.08], [0.095, 0.11]], dark, { seg: near ? 10 : 6, top: false });
      if (near) b.xf([0.21, 0.47, 0.08], [0, 0, Math.PI / 2], 1, () => F.torus(0, 0, 0, 0.09, 0.009, dark, { seg: 8, tube: 4, a0: 0, a1: Math.PI }));
      F.rod([-0.11, 0.7, 0], [-0.17, 0.56, 0.12], 0.035, pat, { seg: 6, caps: true });
      // die Gans unter dem linken Arm: Leib, Hals, Kopf, goldener Schnabel
      F.ball(-0.2, 0.55, 0.06, 0.12, mix(pat, 0xffffff, 0.25), { ws: near ? 12 : 8, hs: 6, sz: 1.35 });
      F.rod([-0.2, 0.6, 0.18], [-0.22, 0.74, 0.22], 0.038, mix(pat, 0xffffff, 0.25), { seg: 6 });
      F.ball(-0.22, 0.77, 0.24, 0.052, mix(pat, 0xffffff, 0.25), { ws: 8, hs: 5 });
      F.rod([-0.22, 0.765, 0.28], [-0.22, 0.75, 0.33], 0.02, CITY.gold, { seg: 6, r1: 0.008, caps: true });
      if (near) for (const k of [-1, 1]) F.ball(-0.22 + k * 0.03, 0.79, 0.27, 0.01, CITY.ink, { ws: 4, hs: 3 });
      // eine zweite Gans zu ihren Füßen
      F.ball(0.26, 0.11, 0.06, 0.1, mix(pat, 0xffffff, 0.2), { ws: near ? 10 : 6, hs: 5, sz: 1.3 });
      F.rod([0.26, 0.15, 0.16], [0.28, 0.3, 0.2], 0.032, mix(pat, 0xffffff, 0.2), { seg: 6 });
      F.ball(0.28, 0.32, 0.21, 0.045, mix(pat, 0xffffff, 0.2), { ws: 8, hs: 5 });
      F.rod([0.28, 0.315, 0.245], [0.28, 0.3, 0.29], 0.017, CITY.gold, { seg: 6, r1: 0.007, caps: true });
    });
    // die Gans spuckt in die Schale
    const hit = W.jet([-0.22, top + 0.745, 0.335], [0, 0.15, 0.16], w2, 0.018, JET, { n: near ? 8 : 3, seg: near ? 5 : 3, r1: 0.026 });
    W.splash(hit[0], w2 + 0.012, hit[2], 0.03, 0.22, SURF, { T: 1.0 });
    W.drops([hit[0], w2 + 0.02, hit[2]], [0, 0.6, 0], w2, 3, JET, rnd, { spread: 0.12, size: 0.012 });
    if (near) {
      for (let i = 0; i < 2; i++) {
        const a = 2.0 + i * 2.3;
        tub(b, Math.sin(a) * 2.42, by, Math.cos(a) * 2.42, 0.28, [BLOOM[i * 2], BLOOM[i * 2 + 1]]);
      }
      moss(b, Math.sin(-0.4) * (R + 0.1), by, Math.cos(-0.4) * (R + 0.1), 0.2);
      pigeon(b, Math.sin(1.0) * (R - 0.14), by + 0.66, Math.cos(1.0) * (R - 0.14), 2.6);
    }
    return { w: 5.5, d: 5.5, h: 2.85, r: 2.8, title: 'Gänselieselbrunnen', size: 'klein', water: wy, cam: { pos: [1.0, 1.3, 3.6], look: [0, 1.9, 0] } };
  },
};

// --- 14. Fischbrunnen: ein dicker Koi springt aus einem bemoosten Felsen und spuckt in die Höhe, vier kleine Fischköpfe am
// Rand spucken zur Mitte ---------------------------------------------------------------------------------------------
defs.fountainFish = {
  kind: 'fountain', far: true, fade: 1.4, low: 0.84,
  make(b) {
    const { F, W } = b;
    const near = b.lod === 0;
    const rnd = rng(137);
    paving(b, 2.75, { col: mix(PAL.cobble, 0x8a9aa8, 0.25) });
    const R = 2.1;
    const by = 0.08;
    const rw = basin(b, 0, by, 0, R, 0.6, { col: mix(GRANITE, 0xffffff, 0.15), t: 0.3 });
    const wy = by + 0.6 - 0.12;
    W.pool(0, wy, 0, rw, SURF, { r0: 0.75, hit: 1.25, rings: 1, seg: segs(R, !near) });
    // Felsen mit Moos
    const rock = mix(PAL.stone, CITY.slate, 0.35);
    F.ball(0, by + 0.4, 0, 0.66, rock, { ws: near ? 14 : 8, hs: near ? 8 : 5, sy: 0.72 });
    F.ball(0.36, by + 0.55, -0.22, 0.42, mix(rock, 0xffffff, 0.08), { ws: near ? 12 : 7, hs: near ? 7 : 4, sy: 0.8 });
    F.ball(-0.32, by + 0.5, 0.14, 0.38, mix(rock, CITY.ink, 0.06), { ws: near ? 12 : 7, hs: near ? 7 : 4, sy: 0.7 });
    if (near) {
      moss(b, 0.2, by + 0.86, -0.3, 0.2);
      moss(b, -0.42, by + 0.74, 0.2, 0.16);
    }
    // der Koi: Spindel (Rotationskörper) schräg nach vorn oben, Rücken nach hinten; Flossen, Augen, weiße Flecken
    const koi = 0xf2913a;
    const pale = 0xfdf1e4;
    b.xf([0, by + 1.0, -0.05], [0.72, 0, 0], 1, () => {
      F.lathe(0, 0, 0, [[0.02, 0], [0.09, 0.06], [0.17, 0.22], [0.22, 0.46], [0.21, 0.66], [0.16, 0.84], [0.1, 0.95], [0.05, 1.0]], koi, { seg: near ? 16 : 8, ks: [0.8, 0.86, 0.94, 1, 1.04, 1.06, 1.04, 1] });
      // Schwanzflosse: zwei flache Lappen
      for (const k of [-1, 1]) b.xf([k * 0.07, -0.06, 0], [0, 0, k * 0.5], 1, () => F.ball(0, -0.1, 0, 0.13, mix(koi, 0xffffff, 0.2), { ws: near ? 10 : 6, hs: 5, sx: 0.25, sy: 1.3 }));
      // Rückenflosse (hinten, −z) und zwei Brustflossen
      F.ball(0, 0.5, -0.2, 0.15, mix(koi, 0xb5442a, 0.25), { ws: near ? 10 : 6, hs: 5, sx: 0.22, sy: 1.4 });
      for (const k of [-1, 1]) b.xf([k * 0.2, 0.7, 0.04], [0, 0, -k * 0.7], 1, () => F.ball(0, 0, 0, 0.08, mix(koi, 0xffffff, 0.2), { ws: 8, hs: 4, sx: 0.3, sy: 1.4 }));
      for (const k of [-1, 1]) {
        F.ball(k * 0.135, 0.8, 0.07, 0.05, PAL.frame, { ws: 8, hs: 5 });
        if (near) F.ball(k * 0.16, 0.81, 0.09, 0.024, CITY.ink, { ws: 6, hs: 4 });
      }
      if (near) for (const [x, y, z, r] of [[0.14, 0.4, 0.13, 0.08], [-0.12, 0.3, 0.15, 0.07], [0.0, 0.6, 0.2, 0.06], [-0.16, 0.55, -0.1, 0.07]]) F.ball(x, y, z, r, pale, { ws: 8, hs: 4, sz: 0.45 });
      // offenes Maul
      F.lathe(0, 0.97, 0, [[0.05, 0], [0.065, 0.04], [0.045, 0.06]], mix(koi, 0xb5442a, 0.4), { seg: 10, top: false });
    });
    // Maul vorn oben: der Strahl steigt und fällt ins Becken
    const mouth = [0, by + 1.0 + Math.cos(0.72) * 1.02, -0.05 + Math.sin(0.72) * 1.02];
    W.jet(mouth, [0, 3.0, 0.55], wy, 0.042, JET, { apex: true, n: near ? 8 : 3, seg: near ? 6 : 3, r1: 0.03 });
    const hit = W.jet(mouth, [0, 3.0, 0.55], wy, 0.042, JET, { n: near ? 12 : 4, seg: near ? 6 : 3, r1: 0.05, ph: 0.4 });
    W.drops([0, mouth[1] + 0.4, mouth[2] + 0.07], [0, 2.0, 0.4], wy, 10, JET, rnd, { spread: 0.25, size: 0.028 });
    W.splash(hit[0], wy + 0.012, hit[2], 0.07, 0.55, SURF, { T: 1.4 });
    W.splash(hit[0], wy + 0.012, hit[2], 0.07, 0.55, SURF, { T: 1.4, ph: 0.5 });
    // kleine Fischköpfe am Rand, spucken zur Mitte
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * TAU + Math.PI / 4;
      const rr = R - 0.14;
      b.at(Math.sin(a) * rr, by + 0.6, Math.cos(a) * rr, a + Math.PI, () => {
        F.ball(0, 0.1, 0, 0.12, koi, { ws: near ? 10 : 6, hs: 5, sz: 1.3 });
        if (near) for (const k of [-1, 1]) F.ball(k * 0.07, 0.15, 0.08, 0.025, CITY.ink, { ws: 5, hs: 3 });
        F.ball(0, 0.03, -0.12, 0.08, mix(koi, 0xffffff, 0.2), { ws: 6, hs: 3, sx: 0.3, sy: 1.2 });
      });
      const s = Math.sin(a + Math.PI);
      const c = Math.cos(a + Math.PI);
      const p0 = [Math.sin(a) * rr + s * 0.15, by + 0.7, Math.cos(a) * rr + c * 0.15];
      const h2 = W.jet(p0, [s * 1.1, 0.9, c * 1.1], wy, 0.024, JET, { n: near ? 7 : 3, seg: near ? 5 : 3, r1: 0.032, ph: i * 1.7 });
      W.splash(h2[0], wy + 0.012, h2[2], 0.04, 0.32, SURF, { T: 1.1, ph: i * 0.3 });
    }
    if (near) {
      tub(b, Math.sin(2.3) * 2.45, by, Math.cos(2.3) * 2.45, 0.28, [0xb07cc6, PAL.blossom[1]]);
      tub(b, Math.sin(-2.1) * 2.45, by, Math.cos(-2.1) * 2.45, 0.28, [PAL.red, PAL.signYellow]);
      pigeon(b, Math.sin(-0.7) * (R + 0.3), by, Math.cos(-0.7) * (R + 0.3), 0.4);
    }
    return { w: 5.5, d: 5.5, h: 2.9, r: 2.8, title: 'Fischbrunnen', size: 'klein', water: wy, cam: { pos: [1.2, 1.2, 3.7], look: [0, 1.35, 0] } };
  },
};

// --- 15. Löwenbrunnen: freistehende Brunnenwand mit Giebel, drei Löwenköpfe aus Messing spucken in einen langen Trog -
defs.fountainLion = {
  kind: 'fountain', far: true, fade: 1.4, low: 0.84,
  make(b) {
    const { F, W } = b;
    const near = b.lod === 0;
    const rnd = rng(139);
    paving(b, 2.75);
    const y0 = 0.08;
    const wall = mix(SAND, CITY.sandDark, 0.35);
    const wz = -0.85;
    // Wand: Sockel, Wand, Gesims, Giebel mit Kugel; hinten schlicht und geschlossen
    F.rbox(0, y0 - 0.02, wz, 3.45, 0.24, 0.66, 0.05, mix(wall, CITY.ink, 0.12), { seg: 2 });
    F.rbox(0, y0 + 0.2, wz, 3.3, 1.62, 0.5, 0.05, wall, { seg: 2, ks: [0.86, 1.04] });
    F.rbox(0, y0 + 1.8, wz, 3.5, 0.15, 0.64, 0.06, mix(wall, 0xffffff, 0.25), { seg: 2, prof: [[0.04, 0], [0, 0.07], [0, 0.15]] });
    F.extrude([[-0.85, y0 + 1.95], [0.85, y0 + 1.95], [0, y0 + 2.42]], wz - 0.2, wz + 0.2, wall, { g: [0.95, 1.05] });
    F.ball(0, y0 + 2.48, wz, 0.1, CITY.gold, { ws: 10, hs: 6 });
    for (const x of [-1.66, 1.66]) F.ball(x, y0 + 2.02, wz, 0.08, mix(wall, 0xffffff, 0.25), { ws: 8, hs: 5 });
    // drei Nischen hinter den Köpfen
    const front = wz + 0.25;
    const nseg = near ? 10 : 6;
    for (const x of [-1.05, 0, 1.05]) {
      const pts = [[x - 0.4, y0 + 0.62], [x + 0.4, y0 + 0.62]];
      for (let i = 0; i <= nseg; i++) pts.push([x + Math.cos((i / nseg) * Math.PI) * 0.4, y0 + 1.36 + Math.sin((i / nseg) * Math.PI) * 0.4]);
      F.extrude(pts, front, front + 0.012, mix(wall, CITY.sandDark, 0.7), { caps: 'f', sides: false });
    }
    // Trog vor der Wand
    const th = 0.7;
    const tz = -0.2;
    F.rbox(0, y0, tz, 3.0, th, 0.86, 0.12, [wall, wall, wall, wall, wall, FLOOR], { prof: [[0.03, 0], [0, 0.08], [0, th - 0.05], [0.02, th], [0.15, th], [0.15, th - 0.32]], ks: [0.8, 0.9, 1, 1.04, 0.95, 0.85], seg: near ? 4 : 2 });
    const wy = y0 + th - 0.1;
    W.poolRect(0, wy, tz, 2.68, 0.54, SURF, { c: [0, 0.05], rings: 0.9 });
    // Löwenköpfe: Mähne, Gesicht, Schnauze, Nase, Augen, Ohren; aus dem Maul ein Rohr und der Strahl
    const face = 0xe9bf62;
    const lh = y0 + 1.12;
    for (const x of [-1.05, 0, 1.05]) {
      F.ball(x, lh, front + 0.02, 0.3, MANE, { ws: near ? 16 : 8, hs: near ? 8 : 5, sz: 0.42 });
      if (near) for (let i = 0; i < 12; i++) {
        const a = (i / 12) * TAU;
        F.ball(x + Math.sin(a) * 0.29, lh + Math.cos(a) * 0.29, front + 0.04, 0.075, mix(MANE, CITY.woodDark, 0.12 * (i % 2)), { ws: 7, hs: 4, sz: 0.6 });
      }
      F.ball(x, lh - 0.02, front + 0.13, 0.17, face, { ws: near ? 14 : 8, hs: near ? 8 : 5, sz: 0.7 });
      for (const k of [-1, 1]) {
        F.ball(x + k * 0.15, lh + 0.15, front + 0.08, 0.06, face, { ws: 7, hs: 4, sz: 0.6 });
        F.ball(x + k * 0.055, lh - 0.08, front + 0.22, 0.07, mix(face, 0xffffff, 0.3), { ws: 8, hs: 5, sz: 0.8 });
        if (near) F.ball(x + k * 0.065, lh + 0.05, front + 0.235, 0.025, CITY.ink, { ws: 5, hs: 3 });
      }
      F.ball(x, lh - 0.02, front + 0.27, 0.035, 0x7a4a2c, { ws: 6, hs: 4 });
      F.rod([x, lh - 0.15, front + 0.18], [x, lh - 0.17, front + 0.36], 0.026, mix(IRON, CITY.gold, 0.3), { seg: 8, caps: true });
      const hit = W.jet([x, lh - 0.175, front + 0.37], [0, 0.1, 0.62], wy, 0.026, JET, { n: near ? 8 : 3, seg: near ? 6 : 3, r1: 0.036, ph: x * 2 });
      W.splash(hit[0], wy + 0.012, hit[2], 0.04, 0.3, SURF, { T: 1.1, ph: x });
      W.drops([hit[0], wy + 0.02, hit[2]], [0, 0.8, 0], wy, 3, JET, rnd, { spread: 0.15, size: 0.014 });
    }
    if (near) {
      // Efeu an den oberen Ecken, Blumen vor dem Trog, eine Taube auf dem Gesims
      for (const [x, y, r] of [[-1.5, 1.95, 0.18], [-1.34, 2.04, 0.14], [-1.62, 1.72, 0.13], [1.52, 1.9, 0.16], [1.6, 1.68, 0.12]]) F.ball(x, y0 + y, wz + 0.22, r, CITY.leafDark, { ws: 8, hs: 5, sz: 0.5 });
      tub(b, -1.95, y0, 0.75, 0.3, [PAL.red, 0xf4a6c0]);
      tub(b, 1.95, y0, 0.75, 0.3, [PAL.signYellow, PAL.blossom[1]]);
      pigeon(b, 0.7, y0 + 1.95, wz + 0.05, 0.3);
      moss(b, -1.4, y0, 0.32, 0.18);
    }
    return { w: 5.5, d: 5.5, h: 2.7, r: 2.8, title: 'Löwenbrunnen', size: 'klein', water: wy, cam: { pos: [0.9, 1.2, 3.1], look: [0, 1.0, -0.5] } };
  },
};

// --- 16. Wassertisch: ein Tisch aus dunklem Granit, über dessen Kanten ein Wasserfilm in eine Rinne läuft; drei kleine
// Sprudel auf der Platte, Sitzwürfel daneben ------------------------------------------------------------------------
defs.fountainCube = {
  kind: 'fountain', far: true, fade: 1.0, low: 0.88,
  make(b) {
    const { F, W } = b;
    const near = b.lod === 0;
    const rnd = rng(149);
    paving(b, 2.75, { col: mix(PAL.stone, 0xffffff, 0.3), h: 0.07 });
    // Rinne: dunkle Grundplatte, darin Wasser, außen ein flacher Rand
    F.rbox(0, 0.0, 0, 2.86, 0.075, 2.86, 0.08, mix(BASALT, CITY.ink, 0.25), { seg: 2 });
    for (const k of [-1, 1]) {
      F.rbox(0, 0.0, k * 1.38, 2.86, 0.12, 0.1, 0.03, BASALT, { seg: 1 });
      F.rbox(k * 1.38, 0.0, 0, 0.1, 0.12, 2.66, 0.03, BASALT, { seg: 1 });
    }
    W.poolRect(0, 0.098, 0, 2.66, 2.66, mix(SURF, BASALT, 0.35), { rings: 0.6 });
    // Tisch und Wasserfilm darauf
    const ty = 0.075;
    const th = 0.68;
    F.rbox(0, ty, 0, 2.2, th, 2.2, 0.05, BASALT, { seg: 2, prof: [[0, 0], [0, th - 0.05], [0.02, th]], ks: [0.78, 1, 1.1] });
    const top = ty + th + 0.007;
    W.poolRect(0, top, 0, 2.14, 2.14, SURF, { c: [0.1, -0.1], rings: 1 });
    // der Film an den vier Seiten (senkrechte Wasserflächen knapp vor dem Stein), darüber rinnt es in Fäden hinab
    for (let side = 0; side < 4; side++) {
      const a = (side / 4) * TAU;
      b.at(Math.sin(a) * 1.112, ty + th / 2 + 0.005, Math.cos(a) * 1.112, a, () => b.xf([0, 0, 0], [Math.PI / 2, 0, 0], 1, () => W.poolRect(0, 0, 0, 2.17, th - 0.01, mix(SURF, BASALT, 0.18), { c: [0.3 * side - 0.4, -0.6], rings: 0.9 })));
    }
    const n = near ? 7 : 3;
    for (let side = 0; side < 4; side++) {
      const a = (side / 4) * TAU;
      const s = Math.sin(a);
      const c = Math.cos(a);
      for (let i = 0; i < n; i++) {
        const t = ((i + 0.5) / n - 0.5) * 1.9;
        const x = s * 1.105 + c * t;
        const z = c * 1.105 - s * t;
        const hit = W.jet([x, top, z], [s * 0.22, 0, c * 0.22], 0.098, 0.016, JET, { n: near ? 5 : 2, seg: near ? 4 : 3, r1: 0.024, ph: i * 1.1 + side });
        if (near && i % 2 === 0) W.splash(hit[0], 0.11, hit[2], 0.03, 0.12, SURF, { T: 0.9, ph: i * 0.37 });
      }
    }
    // drei Sprudel auf der Platte
    for (const [x, z, h] of [[-0.5, -0.4, 0.34], [0.45, 0.15, 0.26], [-0.05, 0.6, 0.2]]) {
      F.cyl(x, top - 0.008, z, 0.06, 0.05, 0.02, PAL.steel, { seg: 10 });
      fountainJet(b, x, top + 0.01, z, h, top, rnd, { r: 0.03, drops: 5, spread: 0.1, size: 0.016 });
      W.splash(x, top + 0.012, z, 0.05, 0.3, SURF, { T: 1.0, ph: x });
    }
    // Sitzwürfel mit Holzauflage, eine Taube auf der Platte
    for (const [x, z, ry] of [[-2.05, 1.25, 0.5], [2.1, 1.1, -0.4]]) {
      b.at(x, 0.05, z, ry, () => {
        F.rbox(0, 0, 0, 0.62, 0.42, 0.62, 0.06, mix(PAL.stone, 0xffffff, 0.15), { seg: 2, ks: [0.84, 1] });
        if (near) F.rbox(0, 0.42, 0, 0.54, 0.045, 0.54, 0.05, CITY.wood, { seg: 2 });
      });
    }
    if (near) {
      pigeon(b, 0.85, top - 0.007, -0.75, 2.2, 0xb8bec6);
      tub(b, -1.9, 0.05, -1.5, 0.3, [0xb07cc6, PAL.signYellow]);
    }
    return { w: 5.5, d: 5.5, h: 1.25, r: 2.8, title: 'Wassertisch', size: 'stadt', water: top, cam: { pos: [1.3, 1.2, 3.3], look: [0, 0.6, 0] } };
  },
};

// --- 17. Rundbecken mit Strahlen: zwölf Bögen springen vom Rand zur Mitte, dort sprudelt es aus einem Stein ----------
defs.fountainRing = {
  kind: 'fountain', far: true, fade: 1.2, low: 0.86,
  make(b) {
    const { F, W } = b;
    const near = b.lod === 0;
    const rnd = rng(151);
    paving(b, 4.05);
    const R = 3.3;
    const by = 0.08;
    const rw = basin(b, 0, by, 0, R, 0.5, { col: LIME, t: 0.32, depth: 0.32 });
    const wy = by + 0.5 - 0.12;
    W.pool(0, wy, 0, rw, SURF, { r0: 0.55, hit: 1.3, rings: 1, seg: segs(R, !near) });
    // Sprudelstein in der Mitte
    F.lathe(0, by, 0, [[0.55, 0], [0.55, 0.36], [0.46, 0.52], [0.26, 0.66], [0.06, 0.7]], mix(LIME, PAL.stone, 0.35), { seg: near ? 20 : 10, ks: [0.75, 0.9, 1, 1.05, 1.08] });
    fountainJet(b, 0, by + 0.7, 0, 0.6, wy, rnd, { r: 0.05, drops: 10, spread: 0.3 });
    W.splash(0, wy + 0.012, 0, 0.56, 1.0, SURF, { T: 1.6, w: 0.035, seg: 16 });
    // zwölf Düsen auf dem Rand, Bögen zur Mitte
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * TAU;
      const s = Math.sin(a);
      const c = Math.cos(a);
      const rr = R - 0.16;
      F.cyl(s * rr, by + 0.5, c * rr, 0.06, 0.045, 0.1, mix(CITY.gold, IRON, 0.3), { seg: 8 });
      const hit = W.jet([s * rr, by + 0.62, c * rr], [-s * 2.55, 3.3, -c * 2.55], wy, 0.032, JET, { n: near ? 10 : 4, seg: near ? 5 : 3, r1: 0.042, ph: i * 0.9 });
      W.splash(hit[0], wy + 0.012, hit[2], 0.05, 0.42, SURF, { T: 1.2, ph: i * 0.23 });
    }
    if (near) {
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * TAU + Math.PI / 4;
        tub(b, Math.sin(a) * 3.72, by, Math.cos(a) * 3.72, 0.3, [BLOOM[i % 6], BLOOM[(i + 2) % 6]]);
      }
      bench(b, Math.sin(Math.PI - 0.55) * 3.75, by, Math.cos(Math.PI - 0.55) * 3.75, -0.55, { w: 1.5 });
      bench(b, Math.sin(Math.PI + 0.55) * 3.75, by, Math.cos(Math.PI + 0.55) * 3.75, 0.55, { w: 1.5 });
      pigeon(b, Math.sin(1.9) * (R - 0.1), by + 0.5, Math.cos(1.9) * (R - 0.1), 3);
      pigeon(b, Math.sin(-1.2) * (R + 0.4), by, Math.cos(-1.2) * (R + 0.4), 1.1, 0xb8bec6);
    }
    return { w: 8.2, d: 8.2, h: 1.45, r: 4.1, title: 'Rundbecken', size: 'stadt', water: wy, cam: { pos: [1.4, 1.2, 5.5], look: [0, 0.8, 0] } };
  },
};

// --- Die dritte Familie (27.11.2026, der Besitzer: „Das Spiel braucht noch mehr Arten von Brunnen“): Brunnen, wie sie
// zur Bauweise und Gegend eines Orts gehören (layout.js STYLE_KINDS) – gotisch in der Fachwerkstadt, gusseiserne Pumpe
// im Backsteinnorden, Holztrog in den Alpen, Pilzbrunnen vor der Platte, Brunnentempel im Kurort, Wassertreppe im
// Barock, Wallace-Brunnen in Paris, Delfine in Italien, Kacheln in Spanien, Bambus in Japan. Jeder hat seinen eigenen
// Umriss, damit man ihn schon vom Fahrersitz erkennt.
const TRAV = 0xebe0c8; // Travertin
const CAST = 0x3f6b4f; // Gusseisen, grün gestrichen
const BAMBOO = 0xb8c46a;
const TERRA = 0xd28a5c; // Terrakotta
const AZUL = 0x2f6fb8; // Azulejo-Blau
const ROBES = [0x3f6fb8, 0xd8453a, 0x4f9a5a, 0xf2c230, 0xb07cc6, 0x5fbfb0];

/** Senkrechter Wasserfilm w × h, Mitte (x, y, z), um a gedreht; schaut nach außen (+z im gedrehten Rahmen). */
function sheet(b, x, y, z, a, w, h, col, o = {}) {
  b.at(x, y, z, a, () => b.xf([0, 0, 0], [Math.PI / 2, 0, 0], 1, () => b.W.poolRect(0, 0, 0, w, h, col, { c: o.c ?? [0, -h], rings: o.rings ?? 0.9 })));
}

/** Wasserfläche als ebenes, sternförmiges Vieleck um (x0, z0): pts = [[x, z], …] (vom Mittelpunkt aus sichtbar). */
function poolPoly(b, x0, y, z0, pts, col, o = {}) {
  const P = [x0, y, z0];
  const UV = [0, 0];
  const K = [0.9];
  const idx = [];
  pts.forEach(([x, z], i) => {
    P.push(x0 + x, y, z0 + z);
    UV.push(x, z);
    K.push(1.08);
    idx.push(0, i + 1, ((i + 1) % pts.length) + 1);
  });
  // gegen den Uhrzeigersinn von oben: gegebenenfalls umdrehen
  let area = 0;
  for (let i = 0; i < pts.length; i++) {
    const q = pts[(i + 1) % pts.length];
    area += pts[i][0] * q[1] - q[0] * pts[i][1];
  }
  if (area > 0) for (let i = 0; i < idx.length; i += 3) [idx[i + 1], idx[i + 2]] = [idx[i + 2], idx[i + 1]];
  b.W._tris(P, null, idx, col, { flat: true, kind: 0, flow: [o.hit ?? 0, o.rings ?? 0.6, 0, 0] }, K, UV);
}

/** Wasserfäden über den Rand einer runden Schale (Radius r, Höhe y) hinab auf yEnd, n Stück, nach außen v m/s. */
function curtain(b, cx, cz, r, y, yEnd, n, v, o = {}) {
  const near = b.lod === 0;
  const m = near ? n : Math.max(4, Math.round(n / 2));
  for (let i = 0; i < m; i++) {
    const a = (o.a0 ?? 0) + (i / m) * TAU;
    const s = Math.sin(a);
    const c = Math.cos(a);
    const hit = b.W.jet([cx + s * r, y, cz + c * r], [s * v, 0.05, c * v], yEnd, o.r ?? 0.026, JET, { n: near ? 6 : 2, seg: near ? 5 : 3, r1: (o.r ?? 0.026) * 1.5, ph: i * 1.7 + cx });
    if (i % 2 === 0) b.W.splash(hit[0], yEnd + 0.012, hit[2], 0.04, 0.32, o.surf ?? SURF, { T: 1.1, ph: i * 0.29 });
  }
}

/** Kleiner, spitzer Ziertürmchen (Fiale) auf (x, y, z): achteckiger Schaft, Spitze, goldener Knauf. */
function pinnacle(b, x, y, z, s, col, near) {
  b.F.lathe(x, y, z, [[0.07 * s, 0], [0.07 * s, 0.22 * s], [0.085 * s, 0.25 * s], [0, 0.62 * s]], col, { seg: near ? 8 : 4, facet: true, ks: [0.85, 1, 1.05, 1.1] });
  if (near) b.F.ball(x, y + 0.64 * s, z, 0.035 * s, CITY.gold, { ws: 6, hs: 4 });
}

/** Kleine Standfigur (Heilige, Ritter, Bürger) in bunter Fassung: Gewand, Kopf, Krönchen; Höhe etwa 0,5 · s. */
function statuette(b, x, y, z, ry, s, robe) {
  const { F } = b;
  b.at(x, y, z, ry, () => {
    F.lathe(0, 0, 0, [[0.09 * s, 0], [0.075 * s, 0.2 * s], [0.055 * s, 0.34 * s], [0.06 * s, 0.38 * s], [0.03 * s, 0.4 * s]], robe, { seg: 8, ks: [0.8, 0.95, 1, 1, 1] });
    F.ball(0, 0.45 * s, 0, 0.05 * s, CITY.skin[0], { ws: 8, hs: 5 });
    F.cyl(0, 0.49 * s, 0, 0.04 * s, 0.045 * s, 0.035 * s, CITY.gold, { seg: 6 });
  });
}

/** Gusseisen-Ziermuster: Ring aus kleinen Kugeln (Perlstab) um die Senkrechte. */
function beads(b, x, y, z, r, n, rr, col) {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU;
    b.F.ball(x + Math.sin(a) * r, y, z + Math.cos(a) * r, rr, col, { ws: 6, hs: 4 });
  }
}

/** Löwen- oder Faunsmaske (Mascaron) auf einer Wand, schaut nach +z; s = Maßstab. */
function mask(b, x, y, z, s, col) {
  const { F } = b;
  const near = b.lod === 0;
  F.ball(x, y, z, 0.17 * s, col, { ws: near ? 12 : 8, hs: near ? 7 : 5, sz: 0.45 });
  if (!near) return;
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * TAU;
    F.ball(x + Math.sin(a) * 0.16 * s, y + Math.cos(a) * 0.16 * s, z + 0.01, 0.055 * s, mix(col, CITY.woodDark, 0.12 * (i % 2)), { ws: 6, hs: 4, sz: 0.6 });
  }
  F.ball(x, y - 0.01 * s, z + 0.06 * s, 0.1 * s, mix(col, 0xffffff, 0.25), { ws: 10, hs: 6, sz: 0.7 });
  for (const k of [-1, 1]) F.ball(x + k * 0.04 * s, y + 0.04 * s, z + 0.12 * s, 0.017 * s, CITY.ink, { ws: 5, hs: 3 });
  F.ball(x, y - 0.03 * s, z + 0.15 * s, 0.025 * s, mix(col, CITY.ink, 0.4), { ws: 6, hs: 4 });
}

// --- 18. Gotischer Brunnen: achteckiges Becken, aus dem ein bunter Turm mit zwei Geschossen voller Figürchen, Fialen
// und einer goldenen Spitze wächst; vier Röhren aus Messing ---------------------------------------------------------
defs.fountainGothic = {
  kind: 'fountain', far: true, fade: 1.6, low: 0.84,
  make(b) {
    const { F } = b;
    const near = b.lod === 0;
    const stone = mix(SAND, 0xffffff, 0.18);
    const dark = mix(SAND, CITY.sandDark, 0.55);
    const OCT = { seg: 8, facet: true, a0: Math.PI / 8, a1: Math.PI / 8 + TAU };
    paving(b, 4.1);
    const R = 3.0;
    const by = 0.22;
    const bh = 0.86;
    F.lathe(0, 0.088, 0, [[R + 0.36, 0], [R + 0.36, 0.1], [R + 0.3, by - 0.088]], mix(stone, STONE, 0.5), { ...OCT, ks: [0.82, 0.95, 1] });
    const rw = basin(b, 0, by, 0, R, bh, { col: stone, t: 0.32, oct: true });
    const wy = by + bh - 0.13;
    b.W.pool(0, wy, 0, rw, SURF, { r0: 0.6, hit: 1.5, rings: 1, ...OCT });
    // Pfeiler mit Gesims, darauf zwei Geschosse: Kern, Säulchen, Gesims, Fialen
    const y1 = by + 1.28;
    F.lathe(0, by, 0, [[0.62, 0], [0.62, 1.08], [0.72, 1.14], [0.72, 1.24], [0.5, 1.28]], [stone, stone, stone, dark, dark], { ...OCT, ks: [0.75, 1, 1, 1.05, 1] });
    const tiers = [
      { y: y1, h: 1.32, core: 0.34, col: 0.53, rim: 0.66, pin: 0.6, s: 1 },
      { y: y1 + 1.46, h: 1.0, core: 0.24, col: 0.37, rim: 0.47, pin: 0.42, s: 0.8 },
    ];
    tiers.forEach((t, k) => {
      F.lathe(0, t.y, 0, [[t.core, 0], [t.core, t.h]], stone, { ...OCT, top: false, ks: [0.85, 1] });
      for (let i = 0; i < 8; i++) {
        const a = Math.PI / 8 + (i / 8) * TAU;
        const x = Math.sin(a) * t.col;
        const z = Math.cos(a) * t.col;
        F.cyl(x, t.y, z, 0.05 * t.s, 0.04 * t.s, t.h, mix(CITY.gold, stone, 0.45), { seg: near ? 6 : 4 });
        // spitze Bögen zwischen den Säulchen
        if (near) {
          const a2 = a + Math.PI / 8;
          const r2 = t.col * Math.cos(Math.PI / 8);
          b.at(Math.sin(a2) * r2, t.y + t.h - 0.3 * t.s, Math.cos(a2) * r2, a2, () => F.extrude([[-0.19 * t.s, 0], [0.19 * t.s, 0], [0.19 * t.s, 0.05], [0, 0.3 * t.s], [-0.19 * t.s, 0.05]], -0.03, 0.03, dark));
          if (k === 0) statuette(b, Math.sin(a2) * (t.core + 0.08), t.y + 0.05, Math.cos(a2) * (t.core + 0.08), a2, 1.45, ROBES[i % ROBES.length]);
        }
      }
      F.lathe(0, t.y + t.h, 0, [[t.rim - 0.06, 0], [t.rim, 0.05], [t.rim, 0.12], [t.core * 0.9, 0.14]], [dark, stone, stone], { ...OCT, ks: [0.85, 1, 1.05, 1] });
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * TAU;
        pinnacle(b, Math.sin(a) * t.pin, t.y + t.h + 0.12, Math.cos(a) * t.pin, t.s, stone, near);
      }
      // Wappenschilde in Rot, Blau und Gold auf dem Gesims
      if (near && k === 0) for (let i = 0; i < 8; i++) {
        const a = Math.PI / 8 + (i / 8) * TAU;
        const r2 = t.rim * Math.cos(Math.PI / 8) + 0.005;
        b.at(Math.sin(a) * r2, t.y + t.h + 0.02, Math.cos(a) * r2, a, () => F.extrude([[-0.06, 0.1], [0.06, 0.1], [0.06, 0.04], [0, -0.0], [-0.06, 0.04]], 0, 0.02, [PAL.red, AZUL, CITY.gold][i % 3]));
      }
    });
    // Helm: achteckige Spitze mit Krabben, goldener Knauf und Fähnchen
    const ys = y1 + 1.46 + 1.0 + 0.12;
    F.lathe(0, ys, 0, [[0.3, 0], [0.3, 0.12], [0, 1.55]], [dark, stone], { ...OCT, ks: [0.9, 1, 1.12] });
    if (near) for (let i = 0; i < 8; i++) {
      const a = Math.PI / 8 + (i / 8) * TAU;
      for (const q of [0.35, 0.62]) {
        const rr = 0.3 * (1 - q) * Math.cos(Math.PI / 8) + 0.03;
        F.ball(Math.sin(a) * rr, ys + 0.12 + q * 1.43, Math.cos(a) * rr, 0.035, CITY.gold, { ws: 6, hs: 4 });
      }
    }
    F.ball(0, ys + 1.62, 0, 0.09, CITY.gold, { ws: near ? 12 : 8, hs: near ? 7 : 5 });
    topFig(b, 0, ys + 1.69, 0, 0.6, () => {
      F.rod([0, ys + 1.6, 0], [0, ys + 1.98, 0], 0.012, IRON, { seg: 5 });
      if (near) b.at(0.012, ys + 1.96, 0, 0, () => F.extrude([[0, 0], [0.24, -0.05], [0, -0.13]], -0.006, 0.006, PAL.red));
    });
    // vier Röhren aus Messing
    for (let i = 0; i < 4; i++) spout(b, (i / 4) * TAU, 0.6, by + 0.94, wy, { len: 0.48, v: 1.55, col: mix(CITY.gold, IRON, 0.35) });
    if (near) {
      moss(b, R * 0.82, 0.1, R * 0.7, 0.26);
      moss(b, -R - 0.15, 0.1, -0.6, 0.2);
      pigeon(b, Math.sin(2.4) * (R - 0.12), by + bh, Math.cos(2.4) * (R - 0.12), 0.7);
      pigeon(b, Math.sin(-0.8) * (R + 0.85), 0.1, Math.cos(-0.8) * (R + 0.85), 2.2, 0xb8bec6);
    }
    return { w: 8.4, d: 8.4, h: ys + 2.0, r: 4.2, title: 'Gotischer Brunnen', size: 'klein', water: wy, cam: { pos: [1.3, 1.2, 5.4], look: [0, 2.6, 0] } };
  },
};

// --- 19. Schwengelpumpe: grüne gusseiserne Straßenpumpe mit Zierkapitell und Eichel, langer Schwengel, darunter ein
// kleiner Granittrog (wie die Plumpen in Berlin, die Stadtpumpen in Holland) -----------------------------------------
defs.fountainPump = {
  kind: 'fountain', far: true, fade: 1.2, low: 0.86,
  make(b) {
    const { F, W } = b;
    const near = b.lod === 0;
    const rnd = rng(167);
    paving(b, 1.85, { col: mix(PAL.cobble, 0x8f8a82, 0.4) });
    const y0 = 0.1;
    // Granittrog vorn
    const tz = 0.48;
    const th = 0.46;
    F.rbox(0, y0, tz, 1.3, th, 0.66, 0.1, [GRANITE, GRANITE, GRANITE, GRANITE, GRANITE, FLOOR], { prof: [[0.02, 0], [0, 0.06], [0, th - 0.04], [0.015, th], [0.11, th], [0.11, th - 0.24]], ks: [0.8, 0.9, 1, 1.04, 0.95, 0.85], seg: near ? 4 : 2 });
    const wy = y0 + th - 0.07;
    W.poolRect(0, wy, tz, 1.08, 0.44, SURF, { c: [0, 0.05], rings: 0.9 });
    // Säule: Fuß, kannelierter Schaft mit Ringen, Kapitell, Haube und goldene Eichel
    const pz = -0.32;
    const hi = mix(CAST, 0xffffff, 0.12);
    F.lathe(0, y0, pz, [[0.3, 0], [0.3, 0.09], [0.23, 0.15], [0.21, 0.32], [0.15, 0.4], [0.13, 0.52], [0.13, 1.56], [0.18, 1.62], [0.18, 1.7], [0.13, 1.74], [0.15, 1.92], [0.23, 2.0], [0.23, 2.07], [0.1, 2.12]], CAST, { seg: near ? 16 : 8, ks: [0.75, 0.82, 0.9, 0.95, 0.95, 1, 1, 1.05, 1.05, 1, 1, 1.08, 1.08, 1] });
    for (const y of [0.62, 0.98, 1.34]) F.torus(0, y0 + y, pz, 0.135, 0.022, hi, { seg: near ? 16 : 8, tube: 4 });
    if (near) beads(b, 0, y0 + 1.66, pz, 0.19, 14, 0.022, hi);
    topFig(b, 0, y0 + 2.1, pz, 0.55, () => F.lathe(0, y0 + 2.1, pz, [[0.05, 0], [0.09, 0.06], [0.08, 0.16], [0.03, 0.24], [0, 0.26]], CITY.gold, { seg: near ? 10 : 6, ks: [0.9, 1, 1.05, 1.1, 1.1] }));
    // Auslauf: Rohr mit Tierkopf nach vorn, darunter der Strahl
    F.rod([0, y0 + 0.92, pz + 0.12], [0, y0 + 0.92, pz + 0.5], 0.04, CAST, { seg: 8 });
    F.ball(0, y0 + 0.9, pz + 0.55, 0.07, CAST, { ws: near ? 10 : 6, hs: 5, sz: 1.3 });
    if (near) for (const k of [-1, 1]) F.ball(k * 0.035, y0 + 0.94, pz + 0.6, 0.012, CITY.gold, { ws: 5, hs: 3 });
    const hit = W.jet([0, y0 + 0.86, pz + 0.61], [0, -0.1, 0.32], wy, 0.026, JET, { n: near ? 7 : 3, seg: near ? 6 : 3, r1: 0.036 });
    W.splash(hit[0], wy + 0.012, hit[2], 0.04, 0.3, SURF, { T: 1.1 });
    W.splash(hit[0], wy + 0.012, hit[2], 0.04, 0.3, SURF, { T: 1.1, ph: 0.5 });
    W.drops([hit[0], wy + 0.02, hit[2]], [0, 0.8, 0], wy, 4, JET, rnd, { spread: 0.2, size: 0.015 });
    // Schwengel: Lager an der Säule, Arm schräg hinab zur Seite, Griffkugel
    F.ball(0.17, y0 + 1.46, pz, 0.06, hi, { ws: 8, hs: 5 });
    F.rod([0.12, y0 + 1.46, pz], [0.98, y0 + 1.02, pz + 0.12], 0.028, CAST, { seg: 6, caps: true });
    F.ball(1.0, y0 + 1.01, pz + 0.12, 0.055, CAST, { ws: 8, hs: 5 });
    F.rod([0.1, y0 + 1.46, pz], [-0.05, y0 + 1.6, pz], 0.025, CAST, { seg: 6, caps: true });
    if (near) {
      // Eimer am Trog, Taube auf dem Rand, Blumenkübel, Moos
      F.lathe(-0.9, y0, tz + 0.2, [[0.12, 0], [0.16, 0.28], [0.15, 0.28], [0.11, 0.02]], PAL.steel, { seg: 12, ks: [0.8, 1, 0.9, 0.7] });
      pigeon(b, -0.58, y0 + th, tz + 0.05, 1.4, 0xb8bec6);
      tub(b, 1.15, y0, -0.55, 0.26, [PAL.red, PAL.signYellow]);
      moss(b, -0.5, y0, tz + 0.38, 0.14);
    }
    return { w: 3.8, d: 3.8, h: 2.5, r: 1.9, title: 'Schwengelpumpe', size: 'dorf', water: wy, cam: { pos: [0.9, 1.2, 2.5], look: [0, 1.05, -0.1] } };
  },
};

// --- 20. Kugelbrunnen: eine große, polierte Granitkugel liegt in einer Schale und dreht sich auf dem Wasser, das über
// den Rand in ein flaches dunkles Becken rinnt -------------------------------------------------------------------------
defs.fountainSphere = {
  kind: 'fountain', far: true, fade: 1.0, low: 0.88,
  make(b) {
    const { F, W } = b;
    const near = b.lod === 0;
    paving(b, 2.55, { col: mix(PAL.stone, 0xffffff, 0.3), h: 0.07 });
    const dark = mix(BASALT, CITY.ink, 0.2);
    const rw = basin(b, 0, 0.07, 0, 1.95, 0.42, { col: BASALT, t: 0.2, depth: 0.3, lip: 0.04 });
    const wy = 0.07 + 0.42 - 0.1;
    W.pool(0, wy, 0, rw, mix(SURF, BASALT, 0.25), { r0: 0.52, hit: 0.75, rings: 1, seg: segs(2, !near) });
    // Sockel mit Schale, darin das Wasserkissen und die Kugel
    const cy = 0.07 + 0.82;
    F.lathe(0, 0.07, 0, [[0.5, 0], [0.5, 0.32], [0.4, 0.42], [0.34, 0.56], [0.5, 0.7], [0.58, 0.78], [0.58, 0.82], [0.5, 0.82], [0.44, 0.76]], [dark, dark, dark, dark, dark, BASALT, BASALT, FLOOR], { seg: near ? 28 : 12, ks: [0.75, 0.85, 0.9, 0.95, 1, 1.05, 1.1, 1, 0.8] });
    W.pool(0, cy - 0.03, 0, 0.5, SURF, { r0: 0.3, hit: 0.5, rings: 1, seg: near ? 28 : 12 });
    const RS = 0.66;
    const sy = cy + RS - 0.2;
    const red = 0xc48e80;
    F.ball(0, sy, 0, RS, red, { ws: near ? 32 : 14, hs: near ? 20 : 9 });
    if (near) {
      // helle Sprenkel im Granit
      const r2 = rng(171);
      for (let i = 0; i < 70; i++) {
        const u = r2() * TAU;
        const v = Math.asin(r2() * 1.6 - 0.6);
        F.ball(Math.cos(v) * Math.sin(u) * RS, sy + Math.sin(v) * RS, Math.cos(v) * Math.cos(u) * RS, 0.02, i % 3 ? 0xf6ece2 : 0x6a4a44, { ws: 4, hs: 2, sy: 0.4 });
      }
    }
    // der Film läuft über den Rand der Schale ins Becken
    curtain(b, 0, 0, 0.57, cy - 0.02, wy, 16, 0.22, { r: 0.022, surf: mix(SURF, BASALT, 0.25) });
    // Sitzwürfel und Lichtpunkte
    for (const [x, z, ry] of [[-2.05, 1.05, 0.5], [2.05, 0.9, -0.4]]) {
      b.at(x, 0.05, z, ry, () => {
        F.rbox(0, 0, 0, 0.58, 0.42, 0.58, 0.06, mix(PAL.stone, 0xffffff, 0.15), { seg: 2, ks: [0.84, 1] });
        if (near) F.rbox(0, 0.42, 0, 0.5, 0.045, 0.5, 0.05, CITY.wood, { seg: 2 });
      });
    }
    if (near) {
      for (let i = 0; i < 10; i++) F.ball(Math.sin((i / 10) * TAU) * 2.3, 0.072, Math.cos((i / 10) * TAU) * 2.3, 0.06, 0xfff1c8, { ws: 8, hs: 2, sy: 0.35, lat: [0, Math.PI / 2], flat: true, k: 1.15 });
      pigeon(b, Math.sin(2.5) * 1.9, 0.07 + 0.42, Math.cos(2.5) * 1.9, 0.8, 0xb8bec6);
    }
    return { w: 5.2, d: 5.2, h: sy + RS, r: 2.6, title: 'Kugelbrunnen', size: 'klein', water: wy, cam: { pos: [1.0, 1.2, 3.2], look: [0, 1.15, 0] } };
  },
};

// --- 21. Wassertreppe: drei Becken steigen nach hinten an, das Wasser fällt in breiten Schleiern von Stufe zu Stufe;
// oben spuckt eine Maske aus einer barocken Rückwand mit Muschelnische, links und rechts Vasen voller Blumen ------------
defs.fountainCascade = {
  kind: 'fountain', far: true, fade: 1.6, low: 0.84,
  make(b) {
    const { F, W } = b;
    const near = b.lod === 0;
    const rnd = rng(173);
    const stone = mix(SAND, 0xffffff, 0.32);
    const trim = mix(SAND, CITY.sandDark, 0.25);
    paving(b, 4.1);
    const y0 = 0.1;
    // ein Trog: Wand außen, Lippe, innen hinab bis zum Boden
    const trough = (z, w, d, top, depth, seg) => {
      F.rbox(0, y0, z, w, top - y0, d, 0.22, [stone, stone, stone, trim, trim, FLOOR], { prof: [[0.04, 0], [0, 0.1], [0, top - y0 - 0.08], [0.0, top - y0 - 0.02], [0.03, top - y0], [0.2, top - y0], [0.2, top - y0 - depth]].slice(0, 7), ks: [0.8, 0.9, 1, 1.04, 1.06, 0.95, 0.85], seg });
    };
    const sg = near ? 4 : 2;
    const L = { z: 1.42, w: 5.4, d: 2.0, top: 0.7 };
    const M = { z: 0.12, w: 4.0, d: 1.6, top: 1.28 };
    const T = { z: -0.9, w: 2.7, d: 1.3, top: 1.86 };
    trough(L.z, L.w, L.d, L.top, 0.42, sg);
    trough(M.z, M.w, M.d, M.top, 0.4, sg);
    trough(T.z, T.w, T.d, T.top, 0.38, sg);
    const wl = L.top - 0.09;
    const wm = M.top - 0.09;
    const wt = T.top - 0.09;
    W.poolRect(0, wl, L.z, L.w - 0.42, L.d - 0.42, SURF, { c: [0, -0.7], rings: 1 });
    W.poolRect(0, wm, M.z, M.w - 0.42, M.d - 0.42, SURF, { c: [0, -0.5], rings: 1 });
    W.poolRect(0, wt, T.z, T.w - 0.42, T.d - 0.42, SURF, { c: [0, -0.4], rings: 1 });
    // Schleier über die Vorderkanten der oberen Becken, dazu Fäden
    const veil = (B, yTop, yBot, w) => {
      const zf = B.z + B.d / 2 + 0.012;
      sheet(b, 0, (yTop + yBot) / 2, zf, 0, w, yTop - yBot + 0.02, mix(SURF, 0xffffff, 0.15), { rings: 0.25 });
      const n = near ? 9 : 4;
      for (let i = 0; i < n; i++) {
        const x = ((i + 0.5) / n - 0.5) * w;
        const hit = W.jet([x, yTop + 0.01, zf], [0, 0.02, 0.32], yBot, 0.022, JET, { n: near ? 5 : 2, seg: near ? 4 : 3, r1: 0.03, ph: i * 1.3 + yTop });
        if (i % 2 === 0) W.splash(hit[0], yBot + 0.012, hit[2], 0.04, 0.36, SURF, { T: 1.1, ph: i * 0.37 });
      }
    };
    veil(M, M.top + 0.005, wl, M.w - 0.6);
    veil(T, T.top + 0.005, wm, T.w - 0.6);
    // barocke Rückwand mit geschwungenem Giebel, Muschelnische und Maske
    const wz = T.z - T.d / 2 - 0.22;
    const pts = [[-1.55, 0], [1.55, 0], [1.55, 2.25]];
    const n = near ? 14 : 7;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const x = 1.55 - 3.1 * t;
      pts.push([x, 2.25 + 0.75 * Math.sin(t * Math.PI) ** 0.8 - 0.25 * Math.sin(t * TAU) ** 2]);
    }
    b.at(0, y0, wz, 0, () => F.extrude(pts, -0.22, 0.22, trim, { g: [0.86, 1.04], crease: 0.5 }));
    // Voluten an den Ecken, Kugel obenauf
    for (const k of [-1, 1]) F.ball(k * 1.5, y0 + 2.3, wz, 0.18, stone, { ws: near ? 12 : 8, hs: 6, sz: 1.4 });
    topFig(b, 0, y0 + 2.96, wz, 0.8, () => F.ball(0, y0 + 3.1, wz, 0.16, CITY.gold, { ws: near ? 12 : 8, hs: near ? 7 : 5 }));
    // Muschelnische: Halbkreis aus Rippen
    const nz = wz + 0.23;
    b.at(0, y0 + 1.95, nz, 0, () => {
      const m = near ? 9 : 5;
      for (let i = 0; i < m; i++) {
        const a0 = (i / m) * Math.PI;
        const a1 = ((i + 1) / m) * Math.PI;
        F.extrude([[0, 0], [Math.cos(a0) * 0.72, Math.sin(a0) * 0.72], [Math.cos((a0 + a1) / 2) * 0.78, Math.sin((a0 + a1) / 2) * 0.78], [Math.cos(a1) * 0.72, Math.sin(a1) * 0.72]], 0, 0.04, i % 2 ? stone : mix(stone, 0xffffff, 0.3));
      }
    });
    mask(b, 0, y0 + 1.72, nz + 0.05, 1.2, CITY.gold);
    // Rückseite (von der Drohne und von gegenüber zu sehen): gerahmtes Feld mit goldenem Wappenschild
    const bz = wz - 0.22;
    b.at(0, y0, bz, Math.PI, () => {
      F.extrude([[-1.2, 0.3], [1.2, 0.3], [1.2, 2.0], [-1.2, 2.0]], 0, 0.03, trim);
      F.extrude([[-1.05, 0.45], [1.05, 0.45], [1.05, 1.85], [-1.05, 1.85]], 0, 0.06, stone);
    });
    F.ball(0, y0 + 1.15, bz - 0.06, 0.34, CITY.gold, { ws: near ? 16 : 10, hs: near ? 8 : 6, sz: 0.22 });
    F.ball(0, y0 + 1.15, bz - 0.1, 0.2, mix(SAND, 0xffffff, 0.5), { ws: near ? 14 : 8, hs: 6, sz: 0.2 });
    const hit = W.jet([0, y0 + 1.66, nz + 0.25], [0, 0.25, 0.55], wt, 0.03, JET, { n: near ? 8 : 3, seg: near ? 6 : 3, r1: 0.04 });
    W.splash(hit[0], wt + 0.012, hit[2], 0.05, 0.4, SURF, { T: 1.2 });
    W.drops([hit[0], wt + 0.02, hit[2]], [0, 0.9, 0], wt, 5, JET, rnd, { spread: 0.25, size: 0.018 });
    // Pfosten mit Blumenvasen neben der Treppe
    for (const k of [-1, 1]) {
      const x = k * 2.35;
      const z = -0.55;
      F.rbox(x, y0, z, 0.5, 1.2, 0.5, 0.05, stone, { prof: [[0, 0], [0, 1.08], [-0.04, 1.12], [-0.04, 1.2]], ks: [0.8, 1, 1.05, 1.05] });
      F.lathe(x, y0 + 1.2, z, [[0.12, 0], [0.1, 0.08], [0.16, 0.14], [0.26, 0.34], [0.28, 0.44], [0.22, 0.46]], trim, { seg: near ? 14 : 8, ks: [0.85, 0.9, 0.95, 1, 1.05, 1] });
      if (near) for (let i = 0; i < 7; i++) {
        const a = (i / 7) * TAU;
        blossom(b, x + Math.sin(a) * 0.15, y0 + 1.68 + (i % 2) * 0.05, z + Math.cos(a) * 0.15, 0.1, i % 3 === 2 ? CITY.leaf : BLOOM[(i + (k > 0 ? 2 : 0)) % 6]);
      }
    }
    // Kugeln auf den vorderen Ecken
    for (const k of [-1, 1]) F.ball(k * (L.w / 2 - 0.15), L.top + 0.12, L.z + L.d / 2 - 0.15, 0.12, stone, { ws: 10, hs: 6 });
    if (near) {
      pigeon(b, -1.6, L.top, L.z + 0.85, 0.4);
      pigeon(b, 2.9, 0.1, 2.6, 2.4, 0xb8bec6);
      moss(b, 2.6, y0, 2.25, 0.2);
    }
    return { w: 8.4, d: 8.4, h: 3.3, r: 4.2, title: 'Wassertreppe', size: 'stadt', water: wl, cam: { pos: [1.4, 1.2, 5.0], look: [0, 1.3, -0.4] } };
  },
};

// --- 22. Obeliskbrunnen: rundes Travertinbecken, im Wasser ein Sockel mit vier Masken, die in alle Richtungen spucken,
// darauf eine rosa Granitnadel mit goldener Spitze und Stern -------------------------------------------------------------
defs.fountainObelisk = {
  kind: 'fountain', far: true, fade: 1.6, low: 0.84,
  make(b) {
    const { F, W } = b;
    const near = b.lod === 0;
    const rnd = rng(179);
    paving(b, 4.1, { col: mix(PAL.cobble, 0xd9c8a8, 0.35) });
    const R = 3.0;
    const by = 0.22;
    const bh = 0.72;
    F.lathe(0, 0.088, 0, [[R + 0.36, 0], [R + 0.36, 0.1], [R + 0.3, by - 0.088]], mix(TRAV, STONE, 0.4), { seg: segs(R, !near), ks: [0.82, 0.95, 1] });
    const rw = basin(b, 0, by, 0, R, bh, { col: TRAV, t: 0.34, lip: 0.09 });
    const wy = by + bh - 0.13;
    W.pool(0, wy, 0, rw, SURF, { r0: 0.82, hit: 1.6, rings: 1, seg: segs(R, !near) });
    // Sockel: Platte, Würfel mit Gesims, vier Masken
    F.rbox(0, by, 0, 1.7, 0.5, 1.7, 0.06, mix(TRAV, STONE, 0.25), { seg: 2, ks: [0.8, 1] });
    for (const [x, z] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) F.ball(x * 0.7, by + 0.62, z * 0.7, 0.13, TRAV, { ws: 10, hs: 6 });
    const py = by + 0.5;
    F.rbox(0, py, 0, 1.2, 1.2, 1.2, 0.04, TRAV, { prof: [[-0.06, 0], [-0.06, 0.1], [0, 0.16], [0, 1.02], [-0.08, 1.08], [-0.08, 1.2]], ks: [0.8, 0.85, 0.9, 1, 1.05, 1.08] });
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * TAU;
      b.at(0, 0, 0, a, () => mask(b, 0, py + 0.66, 0.6, 1.1, CITY.gold));
      spout(b, a, 0.66, py + 0.58, wy, { len: 0.14, v: 1.35, col: CITY.gold, tip: false });
    }
    // die Nadel: rosa Granit, Bänder in Gold, Pyramidenspitze, Stern
    const oy = py + 1.2;
    const pink = 0xd9a493;
    F.frust(0, oy, 0, 0.64, 0.64, 0.4, 0.4, 3.5, pink);
    F.frust(0, oy + 3.5, 0, 0.4, 0.4, 0.02, 0.02, 0.42, CITY.gold);
    if (near) {
      for (const t of [0.12, 0.85]) {
        const w = 0.64 - 0.24 * t;
        F.frust(0, oy + 3.5 * t, 0, w + 0.02, w + 0.02, w + 0.017, w + 0.017, 0.06, CITY.gold);
      }
      // eingemeißelte Zeichen (kleine Kerben) auf der Vorderseite
      for (let i = 0; i < 6; i++) {
        const t = 0.25 + i * 0.09;
        const w = 0.64 - 0.24 * t;
        F.box(-0.08 + (i % 2) * 0.16, oy + 3.5 * t, w / 2 + 0.002, 0.08, 0.1, 0.01, mix(pink, CITY.ink, 0.35));
      }
    }
    const ty = oy + 3.92;
    F.ball(0, ty + 0.1, 0, 0.1, CITY.gold, { ws: near ? 12 : 8, hs: near ? 7 : 5 });
    if (near) for (let i = 0; i < 6; i++) b.xf([0, ty + 0.32, 0], [0, 0, (i / 6) * Math.PI], 1, () => F.rod([0, -0.14, 0], [0, 0.14, 0], 0.025, CITY.gold, { seg: 5, r1: 0.006 }));
    F.rod([0, ty + 0.15, 0], [0, ty + 0.25, 0], 0.02, CITY.gold, { seg: 5 });
    W.drops([0, wy + 0.02, 0.9], [0, 1.0, 0], wy, 4, JET, rnd, { spread: 0.4, size: 0.02 });
    if (near) {
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * TAU + Math.PI / 4;
        tub(b, Math.sin(a) * (R + 0.85), 0.1, Math.cos(a) * (R + 0.85), 0.36, [BLOOM[(i + 1) % 6], BLOOM[(i + 4) % 6]]);
      }
      pigeon(b, Math.sin(2.1) * (R - 0.12), by + bh, Math.cos(2.1) * (R - 0.12), 0.6);
      pigeon(b, 0.62, by + 0.5, 0.62, 0.8, 0xb8bec6);
    }
    return { w: 8.4, d: 8.4, h: ty + 0.48, r: 4.2, title: 'Obeliskbrunnen', size: 'stadt', water: wy, cam: { pos: [1.3, 1.2, 5.2], look: [0, 2.5, 0] } };
  },
};

// --- 23. Pilzbrunnen: ein sechseckiges Betonbecken mit Mosaikband, darin fünf Betonpilze verschieden hoch, über deren
// Hutränder das Wasser als Vorhang fällt (wie die Brunnen der Sechziger und Siebziger in Ost und West) -------------------
defs.fountainPilz = {
  kind: 'fountain', far: true, fade: 1.4, low: 0.86,
  make(b) {
    const { F, W } = b;
    const near = b.lod === 0;
    const rnd = rng(181);
    const conc = PAL.concrete;
    const washed = mix(conc, 0x9a8a78, 0.35);
    paving(b, 4.1, { col: mix(PAL.stone, 0xffffff, 0.22) });
    const R = 3.3;
    const by = 0.08;
    const rw = basin(b, 0, by, 0, R, 0.52, { col: washed, t: 0.3, depth: 0.36, n: 6 });
    const wy = by + 0.52 - 0.12;
    W.pool(0, wy, 0, rw, SURF, { hit: 1.4, rings: 1, seg: 6, a0: Math.PI / 6, a1: Math.PI / 6 + TAU });
    // Mosaikband: kleine bunte Fliesen auf jeder Seite
    if (near) {
      const tiles = [0x2fa8b8, 0xf08a2c, 0xf2c230, 0x2f6fb8, 0xffffff];
      for (let side = 0; side < 6; side++) {
        const a = (side / 6) * TAU;
        const ap = R * Math.cos(Math.PI / 6) + 0.005;
        b.at(Math.sin(a) * ap, by + 0.2, Math.cos(a) * ap, a, () => {
          for (let i = 0; i < 12; i++) {
            const x = (i - 5.5) * 0.24;
            F.box(x, (i % 2) * 0.1, 0, 0.19, 0.09, 0.02, tiles[(i + side * 2) % tiles.length]);
          }
        });
      }
    }
    // Pilze: Stiel, flacher Hut mit Mulde, Wasser oben, Vorhang am Rand
    const shrooms = [[0, 0, 2.25, 1.0], [1.62, 0.72, 1.25, 0.66], [-1.55, 0.88, 1.55, 0.7], [0.92, -1.5, 1.8, 0.6], [-1.05, -1.38, 1.0, 0.56]];
    shrooms.forEach(([x, z, h, r], i) => {
      const y = wy - 0.3;
      F.lathe(x, y, z, [[0.17, 0], [0.13, h * 0.5], [0.12, h - 0.25], [0.22, h - 0.1]], conc, { seg: near ? 14 : 8, top: false, ks: [0.75, 0.9, 0.95, 1] });
      F.lathe(x, y + h - 0.1, z, [[0.22, 0], [r * 0.7, 0.07], [r, 0.12], [r, 0.18], [r - 0.06, 0.2], [r - 0.1, 0.14]], [conc, conc, mix(conc, 0xffffff, 0.2), conc, FLOOR], { seg: segs(r, !near), ks: [0.7, 0.82, 0.95, 1.05, 1, 0.85] });
      const top = y + h + 0.08;
      W.pool(x, top, z, r - 0.1, SURF, { hit: 0.1, rings: 0.8, seg: segs(r, !near) });
      curtain(b, x, z, r + 0.005, top + 0.02, wy, Math.round(r * 16), 0.2, { r: 0.02, a0: i });
      if (i === 0) {
        F.cyl(0, top - 0.02, 0, 0.07, 0.06, 0.05, PAL.steel, { seg: 10 });
        fountainJet(b, 0, top + 0.03, 0, 0.55, top, rnd, { r: 0.04, drops: 8, spread: 0.2 });
      }
    });
    if (near) {
      for (const [x, z, ry] of [[-3.35, 1.95, 0.5], [3.4, 1.7, -0.5]]) bench(b, x, 0.08, z, ry + Math.PI, { w: 1.5 });
      pigeon(b, Math.sin(2.0) * (R - 0.15), by + 0.52, Math.cos(2.0) * (R - 0.15), 0.4);
      pigeon(b, Math.sin(-2.2) * (R + 0.5), 0.08, Math.cos(-2.2) * (R + 0.5), 1.4, 0xb8bec6);
    }
    return { w: 8.4, d: 8.4, h: wy + 2.15, r: 4.2, title: 'Pilzbrunnen', size: 'stadt', water: wy, cam: { pos: [1.2, 1.2, 5.2], look: [0, 1.4, 0] } };
  },
};

// --- 24. Holzbrunnen: ein ausgehöhlter Baumstamm mit Eisenbändern, ein Brunnenstock mit Schindeldach und rotem Herz,
// ein Kasten Geranien und eine Milchkanne – wie vor jedem Hof in den Alpen und im Schwarzwald ------------------------------
defs.fountainWood = {
  kind: 'fountain', far: true, fade: 1.3, low: 0.84,
  make(b) {
    const { F, W } = b;
    const near = b.lod === 0;
    const rnd = rng(191);
    paving(b, 2.55, { col: mix(PAL.cobble, 0x8f8a82, 0.3) });
    const wood = 0x9a6a44;
    const grain = 0xd9b07a;
    const L = 2.5;
    const Ro = 0.45;
    const Ri = 0.34;
    const yc = 0.84;
    // zwei Steinklötze, darauf der Stamm (Querschnitt: halber Ring, die offene Seite nach oben)
    for (const x of [-0.75, 0.75]) F.rbox(x, 0.08, 0, 0.5, yc - Ro + 0.04, 0.62, 0.06, FIELD, { seg: 2, ks: [0.8, 1] });
    const n = near ? 16 : 8;
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const a = Math.PI + (i / n) * Math.PI;
      pts.push([Math.cos(a) * Ro, Math.sin(a) * Ro]);
    }
    for (let i = n; i >= 0; i--) {
      const a = Math.PI + (i / n) * Math.PI;
      pts.push([Math.cos(a) * Ri, Math.sin(a) * Ri]);
    }
    b.at(0, yc, 0, Math.PI / 2, () => F.extrude(pts, -L / 2, L / 2, grain, { sideCol: wood, crease: 0.6 }));
    if (near) {
      // Jahresringe auf den Stirnseiten
      for (const k of [-1, 1]) for (const rr of [0.39, 0.42]) b.xf([k * (L / 2 + 0.004), yc, 0], [0, 0, Math.PI / 2], 1, () => F.torus(0, 0, 0, rr, 0.006, mix(wood, CITY.ink, 0.2), { seg: 12, tube: 3, a0: Math.PI, a1: TAU }));
    }
    for (const x of [-0.85, 0.85]) b.xf([x, yc, 0], [0, 0, Math.PI / 2], 1, () => F.torus(0, 0, 0, Ro + 0.008, 0.018, IRON, { seg: near ? 14 : 8, tube: 4, a0: Math.PI, a1: TAU }));
    const wy = yc - 0.07;
    W.poolRect(0, wy, 0, L - 0.02, 2 * Math.sqrt(Ri * Ri - 0.07 * 0.07) - 0.01, SURF, { c: [-0.8, 0], rings: 1 });
    // Brunnenstock mit Schindeldach, Herz und Rohr
    const sx = -L / 2 - 0.2;
    F.rbox(sx, 0.08, 0, 0.3, 1.78, 0.3, 0.04, wood, { seg: 2, ks: [0.85, 1.02] });
    const roof = 0x6b5a4c;
    for (const k of [-1, 1]) b.xf([sx, 1.93, k * 0.13], [k * 0.62, 0, 0], 1, () => F.rbox(0, -0.02, 0, 0.46, 0.04, 0.32, 0.02, roof, { seg: 2 }));
    F.ball(sx, 2.06, 0, 0.05, CITY.gold, { ws: 8, hs: 5 });
    const heart = [];
    for (let i = 0; i <= 20; i++) {
      const t = (i / 20) * TAU;
      heart.push([0.008 * 16 * Math.sin(t) ** 3, 0.008 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))]);
    }
    heart.pop();
    b.at(sx, 1.5, 0.15, 0, () => F.extrude(heart, 0, 0.012, PAL.red));
    F.rod([sx + 0.12, 1.25, 0], [sx + 0.62, 1.22, 0], 0.035, IRON, { seg: 8 });
    F.rod([sx + 0.6, 1.23, 0], [sx + 0.7, 1.12, 0], 0.038, IRON, { seg: 8, caps: true });
    const hit = W.jet([sx + 0.71, 1.11, 0], [0.45, -0.6, 0], wy, 0.03, JET, { n: near ? 7 : 3, seg: near ? 6 : 3, r1: 0.042 });
    W.splash(hit[0], wy + 0.012, 0, 0.05, 0.3, SURF, { T: 1.1 });
    W.splash(hit[0], wy + 0.012, 0, 0.05, 0.3, SURF, { T: 1.1, ph: 0.5 });
    W.drops([hit[0], wy + 0.02, 0], [0, 0.9, 0], wy, 4, JET, rnd, { spread: 0.25, size: 0.016 });
    // Geranienkasten an der Vorderseite, Milchkanne, Moos, Taube
    if (near) {
      F.rbox(0.25, yc - 0.28, Ro + 0.12, 1.2, 0.2, 0.2, 0.03, CITY.woodDark, { seg: 2 });
      for (let i = 0; i < 7; i++) blossom(b, -0.27 + i * 0.17, yc - 0.06 + (i % 2) * 0.04, Ro + 0.12, 0.1, i % 3 === 1 ? CITY.leaf : [PAL.red, 0xf4a6c0][i % 2]);
      for (let i = 0; i < 4; i++) F.ball(-0.2 + i * 0.3, yc - 0.18, Ro + 0.23, 0.06, CITY.leafDark, { ws: 6, hs: 4, sy: 1.6 });
      F.lathe(1.55, 0.08, 0.7, [[0.13, 0], [0.14, 0.04], [0.14, 0.34], [0.09, 0.42], [0.06, 0.48], [0.075, 0.52]], PAL.steel, { seg: 14, ks: [0.8, 0.9, 1, 1.05, 1, 1.1] });
      F.torus(1.55, 0.6, 0.7, 0.06, 0.01, PAL.steel, { seg: 10, tube: 3 });
      moss(b, -0.6, 0.08, 0.45, 0.18);
      moss(b, sx + 0.1, 0.08, -0.25, 0.15);
      pigeon(b, 0.9, yc, -Ro + 0.04, 3.0);
    }
    return { w: 5.2, d: 5.2, h: 2.12, r: 2.6, title: 'Holzbrunnen', size: 'dorf', water: wy, cam: { pos: [0.9, 1.2, 2.9], look: [-0.3, 0.9, 0] } };
  },
};

// --- 25. Brunnentempel: ein runder Tempel mit acht Säulen und grüner Kupferkuppel über einer Heilquelle; innen ein
// himmelblauer Sternenhimmel und eine Schale, in der es sprudelt ----------------------------------------------------------
defs.fountainTempel = {
  kind: 'fountain', far: true, fade: 1.6, low: 0.86,
  make(b) {
    const { F, W } = b;
    const near = b.lod === 0;
    const rnd = rng(193);
    const marble = 0xf6f1e6;
    const trim = mix(SAND, 0xffffff, 0.45);
    const copper = CITY.copper;
    paving(b, 3.35);
    const y0 = 0.08;
    // Stufen
    F.lathe(0, y0, 0, [[2.6, 0], [2.6, 0.16], [2.36, 0.16], [2.36, 0.32], [2.15, 0.32]], [trim, trim, marble, marble], { seg: segs(2.6, !near), ks: [0.8, 1, 0.92, 1.02, 1] });
    const yp = y0 + 0.32;
    // acht Säulen
    const RC = 1.86;
    const H = 2.2;
    for (let i = 0; i < 8; i++) {
      const a = Math.PI / 8 + (i / 8) * TAU;
      const x = Math.sin(a) * RC;
      const z = Math.cos(a) * RC;
      F.lathe(x, yp, z, [[0.19, 0], [0.19, 0.06], [0.15, 0.1], [0.13, 0.14]], marble, { seg: near ? 12 : 6, ks: [0.8, 0.9, 0.95, 1] });
      F.cyl(x, yp + 0.14, z, 0.125, 0.105, H, marble, { seg: near ? 12 : 6, ks: [0.85, 1.05] });
      F.lathe(x, yp + 0.14 + H, z, [[0.11, 0], [0.16, 0.08], [0.2, 0.14], [0.2, 0.2]], trim, { seg: near ? 12 : 6, ks: [0.95, 1, 1.05, 1.05] });
    }
    // Gebälk als Ring, innen der Himmel
    const ye = yp + 0.14 + H + 0.2;
    F.lathe(0, ye, 0, [[1.55, 0], [2.14, 0], [2.14, 0.3], [2.22, 0.34], [2.22, 0.42], [1.55, 0.42], [1.55, 0]], [trim, trim, marble, marble, marble, trim], { seg: segs(2.2, !near), top: false, ks: [0.75, 0.95, 1, 1.05, 1.08, 0.9, 0.85] });
    F.lathe(0, ye + 0.02, 0, [[0, 0], [1.56, 0]], 0x9cc8e8, { seg: segs(1.6, !near), top: false });
    if (near) for (let i = 0; i < 12; i++) {
      const a = (i / 12) * TAU + 0.3;
      const rr = 0.45 + (i % 3) * 0.33;
      F.ball(Math.sin(a) * rr, ye + 0.012, Math.cos(a) * rr, 0.035, CITY.gold, { ws: 6, hs: 3, sy: 0.4 });
    }
    // Kuppel mit Rippen und Laterne
    const RD = 2.05;
    const SY = 0.6;
    F.ball(0, ye + 0.42, 0, RD, copper, { lat: [0, Math.PI / 2], sy: SY, ws: near ? 40 : 16, hs: near ? 12 : 6 });
    if (near) for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU;
      b.at(0, ye + 0.42, 0, a, () => {
        const P = [];
        for (let k = 0; k <= 8; k++) {
          const t = (k / 8) * (Math.PI / 2) * 0.93;
          P.push([0, Math.sin(t) * RD * SY + 0.012, Math.cos(t) * RD + 0.012]);
        }
        for (let k = 0; k < 8; k++) F.rod(P[k], P[k + 1], 0.03, mix(copper, 0xffffff, 0.22), { seg: 4 });
      });
    }
    const yl = ye + 0.42 + RD * SY - 0.06;
    F.cyl(0, yl, 0, 0.26, 0.24, 0.36, marble, { seg: near ? 12 : 6 });
    F.ball(0, yl + 0.36, 0, 0.27, copper, { lat: [0, Math.PI / 2], sy: 0.7, ws: near ? 14 : 8, hs: 5 });
    topFig(b, 0, yl + 0.57, 0, 0.8, () => F.ball(0, yl + 0.6, 0, 0.08, CITY.gold, { ws: near ? 10 : 6, hs: 5 }));
    // Quellschale
    const rw = basin(b, 0, yp, 0, 0.92, 0.55, { col: trim, t: 0.13, depth: 0.32, lip: 0.04 });
    const wy = yp + 0.55 - 0.09;
    W.pool(0, wy, 0, rw, SURF, { r0: 0.12, hit: 0.3, rings: 1, seg: near ? 28 : 12 });
    F.lathe(0, yp, 0, [[0.13, 0], [0.1, 0.48], [0.13, 0.52]], CITY.gold, { seg: 10 });
    fountainJet(b, 0, wy + 0.06, 0, 0.42, wy, rnd, { r: 0.04, drops: 10, spread: 0.18 });
    W.splash(0, wy + 0.012, 0, 0.14, 0.6, SURF, { T: 1.4, w: 0.03, seg: 16 });
    if (near) {
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * TAU + Math.PI / 4;
        tub(b, Math.sin(a) * 2.95, 0.08, Math.cos(a) * 2.95, 0.3, [BLOOM[i % 6], BLOOM[(i + 3) % 6]]);
      }
      pigeon(b, Math.sin(0.6) * 2.25, ye + 0.42, Math.cos(0.6) * 2.25, 0.6, 0xb8bec6);
      pigeon(b, -0.8, yp, 1.4, 2.6);
    }
    return { w: 6.8, d: 6.8, h: yl + 0.7, r: 3.4, title: 'Brunnentempel', size: 'klein', water: wy, cam: { pos: [1.0, 1.2, 4.6], look: [0, 1.6, 0] } };
  },
};

// --- 26. Wallace-Brunnen: grüne Gusseisenkuppel, getragen von vier Karyatiden; ein dünner Strahl fällt aus der Mitte
// der Kuppel in eine kleine Schale (in Paris an jeder dritten Ecke) -------------------------------------------------------
defs.fountainWallace = {
  kind: 'fountain', far: true, fade: 1.1, low: 0.86,
  make(b) {
    const { F, W } = b;
    const near = b.lod === 0;
    const rnd = rng(197);
    const green = 0x2f5e45;
    const hi = mix(green, 0xffffff, 0.16);
    paving(b, 1.85, { col: mix(PAL.cobble, CITY.slate, 0.3) });
    const y0 = 0.1;
    // Sockel, achteckig, mit Profil; oben eine kleine Schale
    const O8 = { seg: 8, facet: true, a0: Math.PI / 8, a1: Math.PI / 8 + TAU };
    F.lathe(0, y0, 0, [[0.62, 0], [0.62, 0.1], [0.54, 0.16], [0.46, 0.22], [0.42, 0.5], [0.5, 0.56], [0.52, 0.62], [0.38, 0.64]], green, { ...O8, ks: [0.75, 0.85, 0.9, 0.95, 1, 1.05, 1.08, 1] });
    const top = y0 + 0.64;
    F.lathe(0, top, 0, [[0.3, 0], [0.32, 0.06], [0.28, 0.07], [0.24, 0.02]], [hi, hi, FLOOR], { seg: near ? 16 : 8 });
    const wy = top + 0.05;
    W.pool(0, wy, 0, 0.27, SURF, { hit: 0.05, rings: 1, seg: near ? 16 : 8 });
    // vier Karyatiden, Rücken zur Mitte, Arme hoch zur Kuppel
    for (let i = 0; i < 4; i++) {
      const a = Math.PI / 4 + (i / 4) * TAU;
      b.at(Math.sin(a) * 0.27, top, Math.cos(a) * 0.27, a, () => {
        // Sockelchen, Rock, Taille, Oberkörper, Hals, Kopf mit Haarknoten; die Arme greifen hinauf zur Kuppel
        F.lathe(0, 0, 0, [[0.085, 0], [0.085, 0.06], [0.11, 0.08], [0.1, 0.2], [0.07, 0.42], [0.05, 0.5], [0.062, 0.6], [0.068, 0.68], [0.03, 0.73], [0.026, 0.76]], green, { seg: near ? 12 : 6, ks: [0.75, 0.8, 0.85, 0.9, 0.95, 1, 1.05, 1.08, 1, 1] });
        F.ball(0, 0.81, 0.01, 0.052, hi, { ws: near ? 12 : 6, hs: near ? 8 : 4, sy: 1.12 });
        if (near) {
          F.ball(0, 0.84, -0.035, 0.035, green, { ws: 8, hs: 5 });
          F.ball(0, 0.62, 0.05, 0.028, hi, { ws: 6, hs: 4 });
          F.torus(0, 0.5, 0, 0.052, 0.008, hi, { seg: 10, tube: 3 });
        }
        for (const k of [-1, 1]) {
          F.rod([k * 0.065, 0.68, 0], [k * 0.1, 0.82, 0.02], 0.016, green, { seg: 5, caps: true });
          F.rod([k * 0.1, 0.82, 0.02], [k * 0.06, 0.99, 0.0], 0.015, green, { seg: 5, caps: true });
        }
      });
    }
    // Kuppel mit Schuppen, Fries und Spitze
    const yd = top + 1.0;
    F.lathe(0, yd, 0, [[0, -0.01], [0.5, -0.01]], mix(green, CITY.ink, 0.25), { seg: near ? 16 : 8, top: false });
    F.lathe(0, yd, 0, [[0.5, -0.01], [0.52, 0.06], [0.5, 0.1], [0.44, 0.16], [0.34, 0.3], [0.2, 0.4], [0.1, 0.44], [0.07, 0.5], [0.1, 0.56], [0.05, 0.66], [0, 0.7]], green, { seg: near ? 20 : 10, ks: [0.85, 1, 1, 1.02, 1.05, 1.08, 1.08, 1, 1.05, 1.1, 1.1] });
    if (near) {
      beads(b, 0, yd + 0.02, 0, 0.515, 18, 0.03, hi);
      for (let ring = 0; ring < 2; ring++) {
        const n = 14 - ring * 4;
        for (let i = 0; i < n; i++) {
          const a = ((i + ring * 0.5) / n) * TAU;
          const rr = 0.42 - ring * 0.13;
          F.ball(Math.sin(a) * rr, yd + 0.2 + ring * 0.12, Math.cos(a) * rr, 0.035, hi, { ws: 5, hs: 3, sy: 0.6 });
        }
      }
    }
    topFig(b, 0, yd + 0.66, 0, 0.42, null);
    // der Strahl fällt aus der Mitte der Kuppel
    const hit = W.jet([0, yd - 0.02, 0], [0, -0.05, 0], wy, 0.018, JET, { n: near ? 8 : 3, seg: near ? 6 : 3, r1: 0.024, pulse: 0.2 });
    W.splash(hit[0], wy + 0.012, hit[2], 0.03, 0.24, SURF, { T: 1.0 });
    W.drops([0, wy + 0.02, 0], [0, 0.7, 0], wy, 3, JET, rnd, { spread: 0.12, size: 0.012 });
    if (near) {
      // Rinnstein-Gitter, Taube, Laternenpoller
      F.rbox(0, 0.1, 0.85, 0.5, 0.015, 0.22, 0.02, IRON, { seg: 2 });
      pigeon(b, 0.55, 0.1, 0.55, 2.4, 0xb8bec6);
      tub(b, -1.15, 0.1, -0.7, 0.26, [PAL.red, 0xf4a6c0]);
    }
    return { w: 3.8, d: 3.8, h: yd + 0.72, r: 1.9, title: 'Wallace-Brunnen', size: 'dorf', water: wy, cam: { pos: [0.7, 1.2, 2.3], look: [0, 1.25, 0] } };
  },
};

// --- 27. Delfinbrunnen: Travertinbecken, auf einem Felsen tragen drei Delfine mit den Schwanzflossen eine große
// Muschel, aus der eine Fontäne steigt; die Delfine spucken ins Becken (italienischer Barock) -------------------------------
defs.fountainDolphin = {
  kind: 'fountain', far: true, fade: 1.5, low: 0.84,
  make(b) {
    const { F, W } = b;
    const near = b.lod === 0;
    const rnd = rng(199);
    paving(b, 3.95, { col: mix(PAL.cobble, 0xd9c8a8, 0.45) });
    const R = 2.9;
    const by = 0.2;
    const bh = 0.7;
    F.lathe(0, 0.088, 0, [[R + 0.34, 0], [R + 0.34, 0.1], [R + 0.28, by - 0.088]], mix(TRAV, STONE, 0.4), { seg: segs(R, !near), ks: [0.82, 0.95, 1] });
    const rw = basin(b, 0, by, 0, R, bh, { col: TRAV, t: 0.32, lip: 0.1 });
    const wy = by + bh - 0.13;
    W.pool(0, wy, 0, rw, SURF, { r0: 0.9, hit: 1.55, rings: 1, seg: segs(R, !near) });
    // Felsen in der Mitte
    const rock = mix(TRAV, FIELD, 0.45);
    for (const [x, y, z, r] of [[0, 0.25, 0, 0.75], [0.48, 0.12, 0.3, 0.42], [-0.42, 0.1, 0.38, 0.4], [0.1, 0.12, -0.55, 0.45], [-0.35, 0.5, -0.2, 0.42]]) F.ball(x, by + y, z, r, mix(rock, 0xffffff, (x + z) * 0.08), { ws: near ? 12 : 7, hs: near ? 7 : 4, sy: 0.75 });
    if (near) for (const [x, z] of [[0.62, 0.58], [-0.7, 0.2], [0.3, -0.75]]) moss(b, x, by + 0.42, z, 0.16);
    // Stamm zur Muschel
    const ys = by + 2.35;
    F.lathe(0, by + 0.6, 0, [[0.24, 0], [0.18, 0.8], [0.16, ys - by - 1.0], [0.22, ys - by - 0.6]], TRAV, { seg: near ? 14 : 8, top: false, ks: [0.8, 0.95, 1, 1] });
    // drei Delfine: Kopf unten außen, Leib im Bogen hinauf, Schwanzflosse unter der Muschel
    const bronze = mix(PATINA, 0x7a8a7a, 0.3);
    const belly = mix(bronze, 0xffffff, 0.3);
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * TAU;
      b.at(0, 0, 0, a, () => {
        const P0 = [1.22, by + 1.0];
        const P1 = [1.5, by + 2.05];
        const P2 = [0.3, ys - 0.1];
        const n = near ? 26 : 8;
        for (let i = 0; i <= n; i++) {
          const t = i / n;
          const z = (1 - t) ** 2 * P0[0] + 2 * (1 - t) * t * P1[0] + t * t * P2[0];
          const y = (1 - t) ** 2 * P0[1] + 2 * (1 - t) * t * P1[1] + t * t * P2[1];
          const r = 0.25 * (1 - 0.75 * t) + 0.07 * Math.sin(Math.PI * Math.min(1, t * 1.6));
          F.ball(0, y, z, r, mix(bronze, belly, Math.max(0, 0.35 - t)), { ws: near ? 14 : 7, hs: near ? 9 : 4 });
        }
        // Kopf: runde Stirn, lange Schnauze nach unten außen, Augen; Rückenflosse, Schwanzflosse
        F.ball(0, by + 0.88, 1.2, 0.27, bronze, { ws: near ? 14 : 8, hs: near ? 9 : 5 });
        b.xf([0, by + 0.66, 1.33], [0.5, 0, 0], 1, () => F.ball(0, 0, 0, 0.11, mix(bronze, belly, 0.3), { ws: near ? 10 : 6, hs: 5, sy: 2.0 }));
        if (near) for (const s of [-1, 1]) {
          F.ball(s * 0.2, by + 0.95, 1.3, 0.06, PAL.frame, { ws: 8, hs: 5 });
          F.ball(s * 0.225, by + 0.96, 1.33, 0.03, CITY.ink, { ws: 6, hs: 4 });
        }
        b.at(0, by + 1.6, 1.51, Math.PI / 2, () => F.extrude([[0, -0.16], [0.02, 0.16], [-0.24, -0.12]], -0.025, 0.025, bronze));
        for (const s of [-1, 1]) b.xf([s * 0.17, ys - 0.06, 0.24], [0, 0, s * 0.45], 1, () => F.ball(0, 0, 0, 0.19, bronze, { ws: 10, hs: 5, sy: 0.3 }));
        const hit = W.jet([0, by + 0.5, 1.4], [0, 0.4, 1.1], wy, 0.032, JET, { n: near ? 8 : 3, seg: near ? 6 : 3, r1: 0.045, ph: k });
        W.splash(hit[0], wy + 0.012, hit[2], 0.05, 0.42, SURF, { T: 1.2, ph: k * 0.3 });
      });
    }
    // Muschel: gerippte Schale mit gewelltem Rand
    const RS = 1.0;
    const [w2, r2] = bowl(b, 0, ys, 0, RS, { col: TRAV, seg: near ? 24 : 12 });
    if (near) for (let i = 0; i < 16; i++) {
      const a = (i / 16) * TAU;
      F.ball(Math.sin(a) * RS * 0.97, ys + RS * 0.34, Math.cos(a) * RS * 0.97, 0.075, mix(TRAV, 0xffffff, 0.25), { ws: 6, hs: 4, sy: 0.7 });
      F.rod([Math.sin(a) * 0.25, ys + 0.02, Math.cos(a) * 0.25], [Math.sin(a) * RS * 0.95, ys + RS * 0.3, Math.cos(a) * RS * 0.95], 0.022, mix(TRAV, CITY.sandDark, 0.25), { seg: 4 });
    }
    W.pool(0, w2, 0, r2, SURF, { r0: 0.12, hit: 0.2, rings: 1, seg: near ? 24 : 12 });
    fountainJet(b, 0, w2 + 0.04, 0, 1.25, w2, rnd, { r: 0.05, drops: 14, spread: 0.32 });
    curtain(b, 0, 0, RS + 0.02, ys + RS * 0.33, wy, 14, 0.4, { r: 0.024, a0: 0.2 });
    if (near) {
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * TAU + Math.PI / 3;
        tub(b, Math.sin(a) * (R + 0.75), 0.1, Math.cos(a) * (R + 0.75), 0.34, [BLOOM[(i + 2) % 6], 0xf6b7c9]);
      }
      pigeon(b, Math.sin(1.9) * (R - 0.12), by + bh, Math.cos(1.9) * (R - 0.12), 0.8);
      pigeon(b, Math.sin(-1.0) * (R + 0.6), 0.1, Math.cos(-1.0) * (R + 0.6), 1.3, 0xb8bec6);
    }
    return { w: 8.0, d: 8.0, h: w2 + 1.4, r: 4.0, title: 'Delfinbrunnen', size: 'stadt', water: wy, cam: { pos: [1.2, 1.2, 5.0], look: [0, 1.9, 0] } };
  },
};

// --- 28. Sternbrunnen: niedriges Becken als achtzackiger Stern mit blau-weißem Kachelband, in der Mitte eine kleine
// Schale auf einem Kachelsockel, hinten zwei Orangenbäumchen in Terrakottatöpfen (Andalusien, Portugal, Levante) ---------
defs.fountainStar = {
  kind: 'fountain', far: true, fade: 1.0, low: 0.88,
  make(b) {
    const { F, W } = b;
    const near = b.lod === 0;
    const rnd = rng(211);
    const lime = 0xf6f0e2;
    paving(b, 2.75, { col: mix(TERRA, 0xffffff, 0.35), kerb: mix(TERRA, 0xffffff, 0.15) });
    const y0 = 0.07;
    const star = (ro, rv) => {
      const out = [];
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * TAU;
        const rr = i % 2 ? rv : ro;
        out.push([Math.sin(a) * rr, Math.cos(a) * rr]);
      }
      return out;
    };
    // in der Ebene: (x, z) → lokal (x, −z), gezogen nach oben (Drehung um x)
    const loc = (pts) => pts.map(([x, z]) => [x, -z]);
    const outer = star(2.15, 1.62);
    const inner = star(1.88, 1.4);
    b.xf([0, y0, 0], [-Math.PI / 2, 0, 0], 1, () => {
      F.extrude(loc(outer), 0, 0.16, TERRA, { holes: [loc(inner)], crease: 0.95 });
      F.extrude(loc(outer), 0.16, 0.42, lime, { holes: [loc(inner)], sideCol: AZUL, crease: 0.95 });
      F.extrude(loc(inner), 0, 0.18, FLOOR, { sides: false, caps: 'f' });
    });
    const wy = y0 + 0.34;
    poolPoly(b, 0, wy, 0, inner, SURF, { hit: 0.85, rings: 1 });
    // weiße Kachelmuster auf dem blauen Band
    if (near) for (let i = 0; i < 16; i++) {
      const p = outer[i];
      const q = outer[(i + 1) % 16];
      const mx = (p[0] + q[0]) / 2;
      const mz = (p[1] + q[1]) / 2;
      const dx = q[0] - p[0];
      const dz = q[1] - p[1];
      const len = Math.hypot(dx, dz);
      // Flächennormale nach außen: senkrecht zur Kante, vom Mittelpunkt weg
      const sgn = dz * mx - dx * mz > 0 ? 1 : -1;
      b.at(mx, y0 + 0.29, mz, Math.atan2(sgn * dz, -sgn * dx), () => {
        for (let k = 0; k < 3; k++) b.xf([((k + 0.5) / 3 - 0.5) * len * 0.8, 0, 0.004], [0, 0, Math.PI / 4], 1, () => F.box(0, -0.035, 0, 0.05, 0.05, 0.008, 0xffffff));
      });
    }
    // Kachelsockel mit Schale
    const O8 = { seg: 8, facet: true, a0: Math.PI / 8, a1: Math.PI / 8 + TAU };
    F.lathe(0, y0 + 0.18, 0, [[0.34, 0], [0.34, 0.5], [0.24, 0.58], [0.15, 0.82]], [AZUL, lime, lime], { ...O8, ks: [0.85, 1, 1, 1.05] });
    if (near) F.lathe(0, y0 + 0.36, 0, [[0.345, 0], [0.345, 0.08]], lime, { ...O8, top: false });
    const [w2, r2] = bowl(b, 0, y0 + 0.98, 0, 0.62, { col: lime, seg: near ? 20 : 10 });
    W.pool(0, w2, 0, r2, SURF, { r0: 0.06, hit: 0.1, rings: 1, seg: near ? 20 : 10 });
    fountainJet(b, 0, w2 + 0.02, 0, 0.32, w2, rnd, { r: 0.035, drops: 6, spread: 0.14 });
    curtain(b, 0, 0, 0.62, y0 + 0.98 + 0.21, wy, 12, 0.22, { r: 0.02 });
    // zwei Orangenbäumchen hinten
    for (const s of [-1, 1]) {
      const a = Math.PI + s * Math.PI / 8;
      const x = Math.sin(a) * 2.4;
      const z = Math.cos(a) * 2.4;
      F.lathe(x, y0, z, [[0.18, 0], [0.26, 0.36], [0.29, 0.4], [0.29, 0.44], [0.24, 0.44]], TERRA, { seg: near ? 14 : 8, ks: [0.8, 0.95, 1, 1.05, 0.7] });
      F.cyl(x, y0 + 0.42, z, 0.04, 0.035, 0.6, PAL.trunk, { seg: 6 });
      F.ball(x, y0 + 1.24, z, 0.44, mix(CITY.leafDark, 0x2f5f34, 0.25), { ws: near ? 14 : 8, hs: near ? 9 : 5 });
      if (near) for (let i = 0; i < 9; i++) {
        const u = i * 2.4 + s;
        const v = 0.5 - (i % 3) * 0.45;
        F.ball(x + Math.cos(v) * Math.sin(u) * 0.43, y0 + 1.24 + Math.sin(v) * 0.43, z + Math.cos(v) * Math.cos(u) * 0.43, 0.06, PAL.orange, { ws: 6, hs: 4 });
      }
    }
    if (near) {
      pigeon(b, Math.sin(0.7) * 2.0, y0 + 0.42, Math.cos(0.7) * 2.0, 0.7, 0xb8bec6);
      for (let i = 0; i < 5; i++) blossom(b, 2.35 + (i % 2) * 0.12, y0 + 0.12, 0.6 + i * 0.12, 0.09, [0xd94a8a, 0xf4a6c0, PAL.red][i % 3]);
    }
    return { w: 5.6, d: 5.6, h: 1.9, r: 2.8, title: 'Sternbrunnen', size: 'klein', water: wy, cam: { pos: [1.0, 1.2, 3.4], look: [0, 0.75, 0] } };
  },
};

// --- 29. Bambusbrunnen: ein Steinbecken auf geharktem Kies, ein Bambusrohr lässt Wasser hineinrinnen, daneben die
// Hirschscheuche (Shishi-odoshi), eine Steinlaterne, ein roter Ahorn und ein niedriger Bambuszaun --------------------------
defs.fountainBamboo = {
  kind: 'fountain', far: true, fade: 1.0, low: 0.88,
  make(b) {
    const { F, W } = b;
    const near = b.lod === 0;
    const rnd = rng(223);
    const gravel = 0xdcd8cc;
    const R = 2.5;
    // Kiesfläche mit geharkten Ringen, Kante aus dunklen Steinen
    paving(b, R, { col: gravel, kerb: mix(BASALT, 0xffffff, 0.2), h: 0.08 });
    if (near) for (let i = 0; i < 7; i++) F.torus(0.35, 0.075, 0.35, 0.62 + i * 0.16, 0.012, mix(gravel, 0x9a9488, 0.35), { seg: 40, tube: 3 });
    const stone = mix(STONE, 0x8a8f86, 0.35);
    // Steinbecken (Tsukubai): rund, oben eine Mulde
    const bx = 0.35;
    const bz = 0.35;
    F.lathe(bx, 0.06, bz, [[0.5, 0], [0.57, 0.12], [0.6, 0.3], [0.55, 0.46], [0.46, 0.53], [0.3, 0.54], [0.28, 0.5], [0.26, 0.3]], [stone, stone, stone, stone, stone, stone, FLOOR], { seg: near ? 20 : 10, ks: [0.7, 0.85, 0.95, 1.05, 1.1, 1.05, 0.9, 0.8] });
    const wy = 0.06 + 0.48;
    W.pool(bx, wy, bz, 0.275, mix(SURF, FLOOR, 0.3), { hit: 0.14, rings: 1, seg: near ? 20 : 10 });
    if (near) moss(b, bx + 0.45, 0.07, bz - 0.25, 0.2);
    // Bambusrohr auf gekreuzten Stützen
    const node = mix(BAMBOO, CITY.woodDark, 0.3);
    const by = 0.95;
    const x0 = -1.1;
    const x1 = bx - 0.18;
    F.rod([x0, 0.06, bz], [x0, by, bz], 0.045, BAMBOO, { seg: 8 });
    F.rod([x0 - 0.02, by, bz], [x1, by - 0.06, bz], 0.04, BAMBOO, { seg: 8, caps: true });
    for (const s of [-1, 1]) F.rod([-0.45, 0.06, bz + s * 0.14], [-0.45, by - 0.02, bz - s * 0.14], 0.026, BAMBOO, { seg: 6, caps: true });
    if (near) {
      for (const t of [0.3, 0.62]) F.torus(x0, 0.06 + (by - 0.06) * t, bz, 0.046, 0.01, node, { seg: 10, tube: 3 });
      for (const t of [0.25, 0.6]) b.xf([x0 + (x1 - x0) * t, by - 0.06 * t, bz], [0, 0, Math.PI / 2], 1, () => F.torus(0, 0, 0, 0.041, 0.01, node, { seg: 10, tube: 3 }));
      F.rod([-0.45, by - 0.1, bz - 0.16], [-0.45, by - 0.1, bz + 0.16], 0.008, 0x6b5a44, { seg: 4 });
    }
    const hit = W.jet([x1 + 0.03, by - 0.065, bz], [0.25, -0.05, 0], wy, 0.014, JET, { n: near ? 7 : 3, seg: 5, r1: 0.02 });
    W.splash(hit[0], wy + 0.012, hit[2], 0.03, 0.22, mix(SURF, FLOOR, 0.3), { T: 1.0 });
    W.drops([hit[0], wy + 0.02, hit[2]], [0, 0.6, 0], wy, 3, JET, rnd, { spread: 0.1, size: 0.01 });
    // Hirschscheuche: schräges Bambusrohr auf zwei Pfosten, davor ein Stein
    const sz = 1.05;
    for (const s of [-1, 1]) F.rod([-0.55, 0.06, sz + s * 0.09], [-0.55, 0.44, sz + s * 0.09], 0.022, BAMBOO, { seg: 6, caps: true });
    F.rod([-1.0, 0.24, sz], [-0.05, 0.6, sz], 0.045, BAMBOO, { seg: 8, caps: true });
    if (near) F.ball(-1.08, 0.12, sz, 0.14, stone, { ws: 8, hs: 5, sy: 0.6 });
    // Steinlaterne
    const lx = -1.4;
    const lz = -0.95;
    F.lathe(lx, 0.06, lz, [[0.28, 0], [0.28, 0.1], [0.14, 0.16], [0.09, 0.2], [0.09, 0.72], [0.14, 0.76]], stone, { seg: near ? 10 : 6, ks: [0.75, 0.85, 0.9, 0.95, 1, 1] });
    F.rbox(lx, 0.82, lz, 0.46, 0.1, 0.46, 0.04, stone, { seg: 2 });
    F.rbox(lx, 0.92, lz, 0.32, 0.32, 0.32, 0.03, stone, { seg: 2 });
    for (const k of [0, 1]) b.at(lx, 0.98, lz, k * Math.PI, () => F.box(0, 0, 0.162, 0.16, 0.18, 0.006, 0xffe2a0));
    F.lathe(lx, 1.24, lz, [[0.42, 0], [0.4, 0.06], [0.16, 0.2], [0.06, 0.26]], mix(stone, CITY.ink, 0.1), { seg: 6, facet: true, ks: [0.8, 0.9, 1.05, 1.1] });
    F.ball(lx, 1.55, lz, 0.07, stone, { ws: 8, hs: 5, sy: 1.3 });
    // roter Ahorn
    const mx = 1.45;
    const mz = -1.25;
    F.rod([mx, 0.06, mz], [mx - 0.1, 1.0, mz + 0.05], 0.05, PAL.trunk, { seg: 6 });
    for (const [x, y, z, r, c] of [[-0.1, 1.15, 0.05, 0.42, 0xd9553a], [0.25, 1.05, -0.1, 0.32, 0xe8743c], [-0.35, 1.0, 0.2, 0.3, 0xc94a34], [0.0, 1.42, -0.05, 0.3, 0xe8743c]]) F.ball(mx + x, y, mz + z, r, c, { ws: near ? 12 : 7, hs: near ? 7 : 4, sy: 0.75 });
    // niedriger Bambuszaun hinten
    const fz = -1.95;
    const n = near ? 19 : 9;
    for (let i = 0; i < n; i++) {
      const x = -1.2 + (2.4 * i) / (n - 1);
      F.cyl(x, 0.06, fz, 0.032, 0.03, 0.78 + (i % 2) * 0.04, BAMBOO, { seg: 5 });
    }
    for (const y of [0.32, 0.64]) F.rod([-1.28, y, fz + 0.04], [1.28, y, fz + 0.04], 0.018, 0x6b5a44, { seg: 4, caps: true });
    if (near) {
      // Trittsteine und Moospolster
      for (const [x, z, r] of [[0.6, 1.5, 0.24], [1.15, 1.2, 0.2], [-0.1, 1.85, 0.22]]) F.ball(x, 0.05, z, r, mix(stone, 0xffffff, 0.15), { ws: 10, hs: 3, sy: 0.25, lat: [0, Math.PI / 2] });
      for (const [x, z, r] of [[-1.8, 0.2, 0.22], [1.8, 0.4, 0.2], [-0.9, -1.55, 0.18]]) F.ball(x, 0.07, z, r, mix(CITY.leafDark, 0x5a7f3a, 0.4), { ws: 8, hs: 4, sy: 0.55, lat: [0, Math.PI / 2] });
    }
    return { w: 5.2, d: 5.2, h: 1.65, r: 2.6, title: 'Bambusbrunnen', size: 'klein', water: wy, cam: { pos: [1.1, 1.2, 2.6], look: [0, 0.6, 0] } };
  },
};

// --- Ortsbrunnen: jeder Ort seinen eigenen (brunnenpass.js) -----------------------------------------------------------
// Der Brunnen seiner Art, aber im Stein der Gegend, mit der Figur des Orts obenauf oder am Rand und dem Wappenschild in
// seinen Farben. Gebaut wird er wie jede Art (einmal, im Cache des Baukastens), solange der Ort in der Welt steht.

/** Während ein Ortsbrunnen gebaut wird: { fig, statue (Umfärben der Figur), placed, form (Bauform, brunnenpass.js) }. */
let DECO = null;

const hsv = (hex) => {
  const r = ((hex >> 16) & 255) / 255;
  const g = ((hex >> 8) & 255) / 255;
  const b = (hex & 255) / 255;
  const v = Math.max(r, g, b);
  const d = v - Math.min(r, g, b);
  const s = v ? d / v : 0;
  let h = 0;
  if (d) h = v === r ? ((g - b) / d + 6) % 6 : v === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, v];
};
const fromHsv = (h, s, v) => {
  const f = (n) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  const c = (x) => Math.round(Math.min(1, Math.max(0, x)) * 255);
  return (c(f(5)) << 16) | (c(f(3)) << 8) | c(f(1));
};
const lum = (hex) => (0.3 * ((hex >> 16) & 255) + 0.59 * ((hex >> 8) & 255) + 0.11 * (hex & 255)) / 255;

/** Stein-Umfärbung: helle, wenig gesättigte Töne von Grau über Sand bis Rot werden zum Stein des Orts. */
function stoneRecol(target) {
  const [th, ts, tv] = hsv(target);
  const memo = new Map();
  return (hex) => {
    let out = memo.get(hex);
    if (out !== undefined) return out;
    const [h, s, v] = hsv(hex);
    const stone = v >= 0.55 && ((s <= 0.47 && (h <= 62 || h >= 345)) || s <= 0.07);
    out = stone ? fromHsv(th, Math.min(1, ts * Math.min(1.1, Math.max(0.4, 0.45 + (0.4 * s) / 0.3))), Math.min(1, (tv * v) / 0.86 + 0.04)) : hex;
    memo.set(hex, out);
    return out;
  };
}

// Fassungen der Figuren: einfarbig nach der Helligkeit (Bronze, Gold, dunkle Bronze, Stein) oder bunt bemalt
const STATUE = { bronze: 0xb07c46, gold: 0xf0c04a, dunkel: 0x6f8f7e, stein: 0xece6d8 };
function statueRecol(mat, stone, robe) {
  const memo = new Map();
  if (mat === 'bunt') return (hex) => (hex === 0xffffff ? robe : hex);
  const base = mat === 'stein' && stone ? mix(stone, 0xffffff, 0.35) : STATUE[mat] ?? STATUE.bronze;
  const [bh, bs, bv] = hsv(base);
  return (hex) => {
    let out = memo.get(hex);
    if (out === undefined) {
      const l = hex === 0xffffff ? 0.82 : lum(hex);
      out = fromHsv(bh, bs * (mat === 'gold' ? 1 : 0.9), Math.min(1, bv * (0.5 + 0.62 * l)));
      memo.set(hex, out);
    }
    return out;
  };
}

/** Die Figur des Ortsbrunnens auf (x, y, z), so hoch wie h (in ihrer Fassung gefärbt). */
function figureAt(b, x, y, z, ry, h) {
  const rc = b.recol;
  b.recol = DECO.statue;
  placeFigure(b, DECO.fig, x, y, z, ry, h * (FIG_H[DECO.fig] ?? 1));
  b.recol = rc;
  DECO.placed = true;
}
// Figuren, die breit oder flach sind, dürfen niedriger sein als Menschen
const FIG_H = { kogge: 0.85, krone: 0.85, ochse: 0.75, pferd: 0.85, adler: 0.8, gans: 0.8, baer: 0.85, loewe: 0.85, fisch: 0.8, zahnrad: 0.85, globus: 0.8, zirbel: 0.75, anker: 0.85, hahn: 0.8 };

/**
 * Obenauf (Säule, Brunnenstock, Kuppel, Giebel): steht im Ortsbrunnen eine Figur, kommt sie hierher (auf einen kleinen
 * Sockel o.ped, Radius o.pr), sonst zeichnet fallback, was die Art dort sonst trägt.
 */
function topFig(b, x, y, z, h, fallback, o = {}) {
  if (!DECO || !DECO.fig) {
    if (fallback) fallback();
    return;
  }
  let yy = y;
  if (o.ped) {
    const pr = o.pr ?? 0.15;
    b.F.lathe(x, y, z, [[pr * 0.8, 0], [pr * 0.7, o.ped * 0.4], [pr, o.ped * 0.85], [pr * 1.12, o.ped]], o.col ?? STONE, { seg: b.lod ? 8 : 14, ks: [0.85, 0.95, 1, 1.05] });
    yy += o.ped;
  }
  figureAt(b, x, yy, z, o.ry ?? 0, h);
}

// Wo die Figur einer Art steht, die oben keinen Platz hat: [x, y, z, Blick, Sockelhöhe] (auf dem Rand, links vorn)
const rimAt = (r, y, a = -0.8) => [Math.sin(a) * r, y, Math.cos(a) * r, a * 0.6, 0.14];
const RIM = {
  fountainFrog: rimAt(1.85, 0.7),
  fountainGoose: rimAt(1.88, 0.74, -Math.PI / 4),
  fountainFish: rimAt(1.95, 0.68),
  fountainRing: rimAt(3.14, 0.58),
  fountainObelisk: rimAt(2.83, 0.94),
  fountainDolphin: rimAt(2.74, 0.9),
  fountainSphere: rimAt(1.86, 0.49),
  fountainPilz: [-2.35, 0.6, 1.355, -0.6, 0.14],
  fountainStar: [-1.39, 0.49, 0.58, -0.7, 0.12],
  fountainLion: [-1.32, 2.03, -0.85, 0, 0.1],
  fountainWood: [1.75, 0.08, 0.8, 0.3, 0.55],
  fountainCube: [-2.0, 0.07, 1.55, -0.4, 0.55],
  fountainJets: [-2.69, 0.075, 2.61, -0.5, 0.6],
  fountainBamboo: [-1.25, 0.08, 1.3, -0.3, 0.35],
};
// Wappenschild auf der Vorderseite: [x, Mitte y, z, Höhe] (auf dem Becken bzw. am Trog); fehlt die Art, trägt es der Sockel
const CREST = {
  fountainMarket: [0, 0.68, 2.5, 0.4],
  fountainBowls: [0, 0.46, 2.7, 0.33],
  fountainGrand: [0, 0.59, 5.6, 0.31],
  fountainFrog: [0, 0.39, 2.0, 0.27],
  fountainGoose: [0, 0.42, 1.894, 0.3],
  fountainFish: [0, 0.38, 2.1, 0.27],
  fountainRing: [0, 0.32, 3.3, 0.2],
  fountainGothic: [0, 0.68, 2.772, 0.42],
  fountainObelisk: [0, 0.6, 3.0, 0.34],
  fountainDolphin: [0, 0.56, 2.9, 0.33],
  fountainTrough: [-0.45, 0.47, 0.52, 0.4],
  fountainLion: [0, 0.43, 0.23, 0.36],
  fountainCascade: [0, 0.4, 2.42, 0.38],
  fountainPump: [0, 0.33, 0.81, 0.26],
  fountainTempel: [0, 0.24, 3.0, 0.2],
};

/** Wappenschild, gespalten in den beiden Farben, mit goldenem Rand; Mitte (x, y, z), Blick ry, Höhe h. */
function crestAt(b, x, y, z, ry, h, [c0, c1]) {
  const rc = b.recol;
  b.recol = null;
  const w = h / 1.2;
  b.at(x, y + h / 2, z, ry, () => {
    b.F.extrude(shieldPts(w * 1.14, h * 1.1).map(([px, py]) => [px, py + h * 0.05]), 0, 0.02, CITY.gold);
    b.F.extrude(shieldPts(w, h), 0.02, 0.03, c0);
    if (b.lod === 0) {
      const half = shieldPts(w, h).filter(([px]) => px >= -1e-6);
      b.F.extrude([[0, 0], [0, -h], ...half.filter(([px]) => px > 1e-6)], 0.03, 0.034, c1);
    }
  });
  b.recol = rc;
}

/** Der Ortsbrunnen (Def 'Ort:…' im Baukasten): Art des Passes, umgefärbt, mit Figur, Wappen und Besonderheit. */
function makeTownFountain(b, lod, pass) {
  const kind = pass.kind;
  const stone = STONES[pass.stone]?.hex ?? null;
  const robe = mix(pass.crest[0], 0xffffff, 0.15);
  b.recol = stone ? stoneRecol(stone) : null;
  DECO = { fig: pass.fig, statue: statueRecol(pass.mat, stone, robe), placed: false, form: pass.form };
  let info;
  try {
    info = defs[kind].make(b, lod);
    const rim = RIM[kind];
    if (DECO.fig && !DECO.placed && rim) {
      const [x, y, z, ry, ph] = rim;
      b.F.lathe(x, y, z, [[0.17, 0], [0.17, ph - 0.05], [0.21, ph - 0.02], [0.21, ph]], STONE, { seg: b.lod ? 8 : 12, ks: [0.85, 1, 1.05, 1.05] });
      figureAt(b, x, y + ph, z, ry, ph > 0.3 ? 0.9 : pass.real ? 1.15 : 0.82); // ein berühmter Brunnen zeigt seine Figur größer
      if (ph > 0.3 && !CREST[kind]) crestAt(b, x + Math.sin(ry) * 0.215, y + ph * 0.52, z + Math.cos(ry) * 0.215, ry, Math.min(0.3, ph * 0.6), pass.crest);
    }
    const cr = CREST[kind];
    // (am achteckigen Becken liegt die vordere Seite um cos 22,5° näher)
    if (cr) crestAt(b, cr[0], cr[1], cr[2] * (pass.form?.oct ? Math.cos(Math.PI / 8) : 1) + 0.012, 0, cr[3], pass.crest);
    if (pass.extra === 'hochstrahl') {
      // ein Strahl weit über die Dächer (Jet d’eau in Genf, Hochstrahlbrunnen in Wien)
      const rnd = rng(301);
      const wy = info.water ?? 0.5;
      fountainJet(b, 0, wy + 0.05, 0, 24, wy, rnd, { r: 0.14, drops: b.lod ? 20 : 60, spread: 1.2, size: 0.055 });
      b.F.cyl(0, wy - 0.1, 0, 0.22, 0.18, 0.16, PAL.steel, { seg: 12 });
    }
  } finally {
    b.recol = null;
    DECO = null;
  }
  return { ...info, h: Math.max(info.h, pass.extra === 'hochstrahl' ? 25 : info.h), title: pass.name ?? info.title, place: true };
}

// Garten um einen Brunnen, der kleiner ist als seine Insel (die Insel richtet sich nach dem Platz des Orts, layout.js
// slotKind): ab min Metern Rand ein Rasenring mit Steinkante, runde Blumenbeete, Buchskugeln, Tauben und hinten Bänke
// mit Blick auf den Brunnen. Alles bleibt unter Kniehöhe, nur die Bänke stehen hinten: vom Wagen und aus den Kameras
// der Folge sieht man über den Garten auf den Brunnen.
export const GARDEN = { min: 1.1, bench: 1.7 };

/** Garten im Ring von ri (Pflaster des Brunnens) bis ro (Insel), cam: Nahaufnahme des Brunnens (bleibt frei). */
function islandGarden(b, ri, ro, cam, seed) {
  const { F } = b;
  const rnd = rng(seed);
  const a = ri + 0.06;
  const c = ro - 0.04;
  const edge = mix(PAL.stone, 0xffffff, 0.12);
  const lawn = mix(CITY.leaf, CITY.leafDark, 0.35);
  F.lathe(0, 0, 0, [[c, 0], [c, 0.08], [c - 0.1, 0.08], [c - 0.1, 0.06], [a + 0.1, 0.06], [a + 0.1, 0.08], [a, 0.08], [a, 0]], [edge, edge, edge, lawn, edge, edge, edge], { seg: segs(c), top: false, ks: [0.8, 1, 1, 0.92, 0.92, 1, 1, 0.8] });
  const rm = (a + c) / 2;
  const rb = Math.min(0.85, (c - a) / 2 - 0.22);
  const n = Math.max(4, Math.floor((TAU * rm) / (2 * rb + 1.0)));
  // frei bleiben die Stelle der Nahaufnahme (info.cam) und die des tiefen Standbilds einer Folge (layout.js STILL_LOW)
  const low = ri + STILL_LOW.d;
  const spots = [[Math.sin(STILL_LOW.a) * low, Math.cos(STILL_LOW.a) * low]];
  if (cam) spots.push([cam.pos[0], cam.pos[2]]);
  const free = (x, z, r) => spots.every(([sx, sz]) => Math.hypot(x - sx, z - sz) > r + 0.45);
  const seats = c - a >= GARDEN.bench;
  for (let i = 0; i < n; i++) {
    const t = ((i + 0.5) / n) * TAU;
    const x = Math.sin(t) * rm;
    const z = Math.cos(t) * rm;
    const back = Math.cos(t) < -0.35;
    if (seats && back && i % 2 === 0) {
      // Bank am äußeren Rand, Sitz zum Brunnen
      bench(b, Math.sin(t) * (c - 0.42), 0.06, Math.cos(t) * (c - 0.42), t + Math.PI, { w: 1.5 });
      continue;
    }
    if (free(x, z, rb)) flowerBed(b, x, 0.05, z, rb, [BLOOM[i % 6], BLOOM[(i + 3) % 6], BLOOM[(i + 1) % 6]], i + seed);
    // Buchskugel zwischen zwei Beeten
    const t2 = t + Math.PI / n;
    const bx = Math.sin(t2) * rm;
    const bz = Math.cos(t2) * rm;
    if (free(bx, bz, 0.3)) F.ball(bx, 0.06 + 0.22, bz, 0.26 + rnd() * 0.05, mix(CITY.leafDark, 0x2f5f34, 0.3 + rnd() * 0.3), { ws: 12, hs: 8, sy: 0.92 });
  }
  pigeon(b, Math.sin(2.1) * (a + 0.35), 0.06, Math.cos(2.1) * (a + 0.35), 0.8);
  pigeon(b, Math.sin(-2.5) * (c - 0.3), 0.06, Math.cos(-2.5) * (c - 0.3), 2.6, 0xb8bec6);
}

/**
 * Die Brunnen-Familie. Jede info trägt title (deutscher Name), size (dorf, klein, stadt, gross, extra, besonders) und cam.
 * kit.onIsland(kind, r): der Brunnen auf einer Insel vom Radius r, mit Garten, wo er kleiner ist (GARDEN) – in denselben
 * zwei Draw Calls (Stein und Garten verschmolzen).
 */
export function createFountainKit(F) {
  const kit = makeKit(F, defs);
  const gardens = new Map();
  kit.onIsland = (kind, r, def = kind) => {
    const g = kit.geo(def);
    const ri = g.info.r;
    if (!(r - ri >= GARDEN.min) || g.info.special) return kit.build(def);
    // der Garten hängt nur an der Art und den Radien (ein Ortsbrunnen teilt ihn mit seiner Art)
    const key = ri + '|' + r.toFixed(2) + '|' + kind;
    let gg = gardens.get(key);
    if (!gg) {
      const b = new Bau({ lod: 0 });
      islandGarden(b, ri, r, g.info.cam, Math.round(r * 100) + ri * 10);
      gg = b.done({ name: 'garden', kind: 'fountain', tints: [0xffffff], weight: 1, far: false });
      gardens.set(key, gg);
    }
    const group = compose(kit.core, [{ g }, { g: gg }]);
    for (const m of kit.extras(def)) group.add(m);
    group.name = def;
    group.userData.info = { name: kind, kind: 'fountain', ...g.info };
    return group;
  };
  /**
   * Der Hauptbrunnen eines Orts nach seinem Pass (brunnenpass.js) auf einer Insel vom Radius r: eigener Stein, eigene
   * Figur, Wappen. Er bleibt im Cache, solange ein Stück von ihm in der Welt steht (release gibt ihn wieder frei).
   */
  kit.forPlace = (pass, key, r) => {
    const plain = !pass.fig && !pass.extra && !STONES[pass.stone]?.hex && !CREST[pass.kind];
    if (plain) return kit.onIsland(pass.kind, r);
    const def = 'Ort:' + key;
    if (!defs[def]) {
      const base = defs[pass.kind];
      defs[def] = { kind: 'fountain', far: base.far, fade: base.fade, low: base.low, make: (b, lod) => makeTownFountain(b, lod, pass) };
    }
    kit.hold(def);
    const group = kit.onIsland(pass.kind, r, def);
    group.userData.info = { ...group.userData.info, name: pass.kind, def, pass };
    group.userData.unref = () => kit.unref(def);
    return group;
  };
  return kit;
}
