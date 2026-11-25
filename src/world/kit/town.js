// Stadt-Baukasten, Teil Häuser: Dorf, Kleinstadt, Großstadt und regionale Spielarten.
// Jeder Baustein steht mit der Mitte seiner Vorderkante im Ursprung, schaut nach +z und reicht nach −z (Tiefe d).
// Die Straßenseite ist ausgearbeitet, die Rückseite geschlossen und schlicht. Wände liegen im Eimer T
// (fast weiß, die Instanzfarbe färbt sie), Dächer und Aufbauten in F, Fenster, Türen und Schilder in G.
import { PAL, CITY, mix, makeKit, atlasAspect } from './citycore.js';

const WHITE = 0xffffff;
const R = 0.14; // Eckradius der Hauswände
const MANSARD = 1.15; // so weit springt ein Mansarddach oben zurück
const DOORS = PAL.door;

// Fernfassung: alles, was aus 150 m nur noch flimmern würde (Blumen, Stufen, Sprossen), fällt weg (b.lod > 0)

/** Hängendes Ladenzeichen am schmiedeeisernen Ausleger: kleine Figur statt Schrift, liest sich beim Entlangfahren. */
function hangIcon(b, x, y, kind, side = 1) {
  if (b.lod > 0) return;
  const { F } = b;
  const L = 0.95;
  F.rod([x, y, 0], [x, y, L], 0.03, PAL.darkMetal);
  F.rod([x, y - 0.42, 0], [x, y - 0.03, L * 0.62], 0.022, PAL.darkMetal);
  F.ball(x, y, L, 0.05, PAL.darkMetal, { ws: 6, hs: 4 });
  const z = L * 0.66;
  const top = y - 0.12;
  F.rod([x, y, z], [x, top, z], 0.015, PAL.darkMetal);
  b.at(x, top, z, (side * Math.PI) / 2, () => icon3d(b, kind));
}

/** Kleine Figuren (rund 0,6 m), hängen an ihrem Ursprung nach unten und zeigen ihre Breitseite nach ±z. */
function icon3d(b, kind) {
  const { F, G } = b;
  switch (kind) {
    case 'bell':
      F.lathe(0, -0.5, 0, [[0.27, 0], [0.25, 0.06], [0.16, 0.2], [0.13, 0.36], [0.07, 0.46], [0, 0.5]], CITY.gold, { seg: 10, bottom: true });
      F.ball(0, -0.53, 0, 0.07, CITY.woodDark, { ws: 6, hs: 4 });
      break;
    case 'cone':
      F.cyl(0, -0.62, 0, 0.01, 0.15, 0.34, CITY.sandDark, { seg: 8 });
      F.ball(0, -0.2, 0, 0.17, 0xf4a6c0, { ws: 8, hs: 5 });
      F.ball(0, -0.02, 0, 0.13, PAL.wall[0], { ws: 8, hs: 5 });
      break;
    case 'cross':
      G.box(0, -0.6, 0, 0.2, 0.6, 0.1, PAL.signGreen);
      G.box(0, -0.4, 0, 0.6, 0.2, 0.1, PAL.signGreen);
      break;
    case 'book':
      G.box(0, -0.58, 0, 0.5, 0.56, 0.12, PAL.door[2]);
      G.box(0.03, -0.55, 0, 0.46, 0.5, 0.13, PAL.frame);
      break;
    case 'pig':
      F.ball(0, -0.34, 0, 0.24, 0xf4a6c0, { ws: 9, hs: 6, sz: 0.8 });
      F.cyl(0, -0.4, 0, 0.09, 0.09, 0.01, 0xf4a6c0, { seg: 6 });
      b.xf([0.22, -0.36, 0], [0, 0, -Math.PI / 2], 1, () => F.cyl(0, 0, 0, 0.09, 0.08, 0.08, mix(0xf4a6c0, 0xe5483a, 0.3), { seg: 7 }));
      for (const s of [-1, 1]) {
        F.cyl(-0.1, -0.62, s * 0.1, 0.04, 0.05, 0.12, 0xf4a6c0, { seg: 5, bottom: true });
        F.cyl(0.1, -0.62, s * 0.1, 0.04, 0.05, 0.12, 0xf4a6c0, { seg: 5, bottom: true });
        F.cyl(0.1, -0.16, s * 0.1, 0.06, 0.01, 0.1, 0xf4a6c0, { seg: 4 });
      }
      break;
    case 'cup':
      F.lathe(0, -0.56, 0, [[0.12, 0], [0.2, 0.08], [0.24, 0.4], [0.2, 0.4], [0.16, 0.12]], PAL.frame, { seg: 10, bottom: true, top: false });
      F.cyl(0, -0.3, 0, 0.19, 0.19, 0.01, CITY.woodDark, { seg: 10 });
      b.xf([0.26, -0.34, 0], [Math.PI / 2, 0, 0], 1, () => F.torus(0, 0, 0, 0.1, 0.03, PAL.frame, { seg: 8, tube: 5 }));
      break;
    case 'mic':
      F.cyl(0, -0.66, 0, 0.045, 0.06, 0.36, CITY.ink, { seg: 7, bottom: true });
      F.ball(0, -0.18, 0, 0.14, CITY.gold, { ws: 9, hs: 6 });
      F.cyl(0, -0.31, 0, 0.07, 0.07, 0.04, CITY.gold, { seg: 7 });
      break;
    case 'spit':
      F.lathe(0, -0.6, 0, [[0.08, 0], [0.2, 0.12], [0.16, 0.42], [0.06, 0.5]], 0xb8703c, { seg: 8, bottom: true });
      F.cyl(0, -0.66, 0, 0.02, 0.02, 0.64, PAL.steel, { seg: 5 });
      break;
    case 'pole': {
      const cols = [PAL.red, PAL.frame, PAL.signBlue, PAL.frame, PAL.red];
      F.lathe(0, -0.62, 0, [[0.09, 0], [0.09, 0.12], [0.09, 0.24], [0.09, 0.36], [0.09, 0.48], [0.09, 0.6]], cols, { seg: 8, bottom: true });
      break;
    }
    case 'flower':
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        F.ball(Math.sin(a) * 0.17, -0.34 + Math.cos(a) * 0.17, 0, 0.12, 0xf4a6c0, { ws: 7, hs: 4, sz: 0.5 });
      }
      F.ball(0, -0.34, 0, 0.1, PAL.signYellow, { ws: 7, hs: 4, sz: 0.7 });
      break;
    case 'heart': {
      const pts = [];
      for (let i = 0; i < 20; i++) {
        const t = (i / 20) * Math.PI * 2;
        pts.push([0.019 * 16 * Math.sin(t) ** 3, -0.33 + 0.019 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))]);
      }
      G.extrude(pts, -0.05, 0.05, PAL.red, { crease: 0.3 });
      break;
    }
    case 'cloud':
      for (const [x, y, r] of [[-0.2, -0.36, 0.14], [0, -0.3, 0.19], [0.2, -0.36, 0.14]]) F.ball(x, y, 0, r, PAL.frame, { ws: 8, hs: 5, sz: 0.7 });
      break;
    case 'star': {
      const pts = [];
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        const r = i % 2 ? 0.14 : 0.32;
        pts.push([Math.sin(a) * r, -0.36 + Math.cos(a) * r]);
      }
      G.extrude(pts, -0.05, 0.05, CITY.gold, { crease: 2 });
      break;
    }
    case 'plug':
      G.box(0, -0.6, 0, 0.36, 0.36, 0.14, PAL.signBlue);
      for (const s of [-1, 1]) F.cyl(s * 0.09, -0.24, 0, 0.03, 0.03, 0.16, PAL.steel, { seg: 5 });
      break;
    case 'globe':
      F.ball(0, -0.36, 0, 0.24, PAL.awning[1], { ws: 10, hs: 6 });
      F.torus(0, -0.36, 0, 0.27, 0.025, CITY.gold, { seg: 14, tube: 4 });
      break;
    case 'pizza':
      b.xf([0, -0.36, 0], [Math.PI / 2, 0, 0], 1, () => {
        F.cyl(0, -0.03, 0, 0.3, 0.3, 0.06, CITY.sand, { seg: 12, bottom: true });
        F.cyl(0, -0.035, 0, 0.25, 0.25, 0.07, PAL.red, { seg: 12, bottom: true });
      });
      break;
    case 'bear':
      F.ball(0, -0.36, 0, 0.22, CITY.wood, { ws: 9, hs: 6, sz: 0.8 });
      for (const s of [-1, 1]) F.ball(s * 0.19, -0.16, 0, 0.09, CITY.wood, { ws: 6, hs: 4, sz: 0.7 });
      F.ball(0, -0.4, 0.14, 0.09, CITY.sand, { ws: 6, hs: 4 });
      break;
    case 'carrot':
      F.cyl(0, -0.66, 0, 0.01, 0.11, 0.46, PAL.orange, { seg: 7 });
      F.ball(0, -0.14, 0, 0.1, CITY.leaf, { ws: 6, hs: 4, sy: 1.3 });
      break;
    default: // 'cone2': Leitkegel der Fahrschule
      F.cyl(0, -0.6, 0, 0.17, 0.04, 0.5, PAL.orange, { seg: 8 });
      F.cyl(0, -0.42, 0, 0.125, 0.09, 0.12, PAL.frame, { seg: 8, top: false });
      F.box(0, -0.64, 0, 0.4, 0.04, 0.4, PAL.orange);
  }
}

// Läden: Schild im Atlas, Farbe der Markise, Zeichen am Ausleger
const SHOPS = {
  bakery: { awn: 0, icon: 'bell' },
  ice: { awn: 3, icon: 'cone' },
  kiosk: { awn: 2, icon: 'heart' },
  doner: { awn: 0, icon: 'spit' },
  pharmacy: { awn: 2, icon: 'cross' },
  books: { awn: 1, icon: 'book' },
  bank: { awn: -1, icon: 'pig' },
  flowers: { awn: 2, icon: 'flower' },
  veg: { awn: 2, icon: 'carrot' },
  cafe: { awn: 3, icon: 'cup' },
  hair: { awn: -1, icon: 'pole' },
  toys: { awn: 3, icon: 'bear' },
  electro: { awn: -1, icon: 'plug' },
  driving: { awn: -1, icon: 'cone2' },
  pizza: { awn: 0, icon: 'pizza' },
  travel: { awn: 1, icon: 'globe' },
};

/**
 * Ladenfront über die ganze Hausbreite w (Wandebene z = 0): Sockel, Schaufenster, verglaste Tür, Schild, Markise.
 * y0 = Oberkante des Haussockels. Gibt zurück, wie weit die Front nach vorn übersteht.
 */
function shopFront(b, w, key, y0, o = {}) {
  const { G } = b;
  const shop = SHOPS[key] || {};
  const doorW = 1.0;
  const m = 0.32;
  const left = o.doorLeft;
  const dx = (left ? -1 : 1) * (w / 2 - m - doorW / 2);
  const wx0 = left ? dx + doorW / 2 + 0.3 : -w / 2 + m;
  const wx1 = left ? w / 2 - m : dx - doorW / 2 - 0.3;
  const wc = (wx0 + wx1) / 2;
  const ww = wx1 - wx0;
  const frame = o.frame ?? PAL.frame;
  // Schaufenster mit Brüstung
  G.box(wc, y0, 0.04, ww + 0.2, 0.42, 0.08, o.plinth ?? mix(PAL.stone, PAL.darkMetal, 0.25), { skip: 'kb' });
  b.win(wc, y0 + 0.5, ww, 1.7, { cross: 0, frame, sill: false });
  if (b.lod === 0 && ww > 2.4) G.rect(wc, y0 + 0.5, 0.04, 0.06, 1.7, frame);
  b.door(dx, doorW, 2.2, o.door ?? DOORS[0], { y: y0, glass: true, frame, steps: y0 > 0.2 });
  // Schild über der Front
  const sw = Math.min(w - 0.5, 0.52 * atlasAspect(key));
  const sy = y0 + 2.62;
  b.board(0, sy, sw, key);
  let over = 0.1;
  if (shop.awn >= 0 && o.awning !== false) {
    b.awning(wc, y0 + 2.5, ww + 0.3, 1.05, 0.42, PAL.awning[shop.awn]);
    over = 1.1;
  }
  if (shop.icon && o.icon !== false) {
    hangIcon(b, left ? w / 2 - 0.25 : -w / 2 + 0.25, y0 + 4.1, shop.icon, left ? -1 : 1);
    over = Math.max(over, 1);
  }
  return over;
}

/** Fachwerk auf einer Wand der Breite w zwischen y0 und y1: Schwellen, Ständer, Riegel und Streben (flach, im Eimer G). */
function timber(b, w, y0, y1, cols, o = {}) {
  const { G } = b;
  const c = o.col ?? PAL.timber;
  const t = 0.16;
  const z = 0.012;
  const x0 = -w / 2 + R * 0.4;
  const x1 = w / 2 - R * 0.4;
  const bar = (ax, ay, bx, by) => {
    const dx = bx - ax;
    const dy = by - ay;
    const l = Math.hypot(dx, dy);
    const nx = (-dy / l) * (t / 2);
    const ny = (dx / l) * (t / 2);
    G.quad([ax - nx, ay - ny, z], [bx - nx, by - ny, z], [bx + nx, by + ny, z], [ax + nx, ay + ny, z], c);
  };
  bar(x0, y0 + t / 2, x1, y0 + t / 2);
  bar(x0, y1 - t / 2, x1, y1 - t / 2);
  const n = cols * 2;
  for (let i = 0; i <= n; i++) {
    const x = x0 + t / 2 + ((x1 - x0 - t) * i) / n;
    if (i % 2 === 0 || b.lod === 0) bar(x, y0, x, y1);
  }
  if (b.lod === 0) {
    const mid = y0 + (y1 - y0) * 0.36;
    const cw = (x1 - x0 - t) / n;
    for (let i = 0; i < n; i++) {
      const xa = x0 + t / 2 + cw * i;
      const window = o.wins ? o.wins(i) : i % 2 === 0;
      if (!window) bar(xa, mid, xa + cw, mid);
      // Streben in den äußeren Feldern
      if (i === 0) bar(xa, y0 + t, xa + cw, y1 - t);
      if (i === n - 1) bar(xa + cw, y0 + t, xa, y1 - t);
    }
  }
}

/** Fachwerk im Giebeldreieck (Fuß bei y0, Breite w, Höhe rh). */
function timberGable(b, w, y0, rh, o = {}) {
  const { G } = b;
  const c = o.col ?? PAL.timber;
  const t = 0.16;
  const z = 0.012;
  const hw = w / 2 - R * 0.4;
  const bar = (ax, ay, bx, by) => {
    const dx = bx - ax;
    const dy = by - ay;
    const l = Math.hypot(dx, dy);
    const nx = (-dy / l) * (t / 2);
    const ny = (dx / l) * (t / 2);
    G.quad([ax - nx, ay - ny, z], [bx - nx, by - ny, z], [bx + nx, by + ny, z], [ax + nx, ay + ny, z], c);
  };
  const sl = rh / (w / 2);
  bar(-hw, y0 + t / 2, hw, y0 + t / 2);
  // Sparren parallel zur Dachkante, so weit darunter, dass sie ganz unter der Dachplatte liegen
  const dy = 0.36 * Math.hypot(1, sl);
  const xs = hw - (t * 0.5 + dy) / sl;
  bar(-xs, y0 + t * 0.5, 0, y0 + rh - dy);
  bar(xs, y0 + t * 0.5, 0, y0 + rh - dy);
  const yk = y0 + rh * 0.5;
  const xk = Math.max(0.2, (rh - dy - rh * 0.5) / sl);
  bar(-xk, yk, xk, yk);
  if (b.lod === 0) {
    bar(0, yk, 0, y0 + rh - dy - t * 0.4);
    for (const s of [-1, 1]) bar(s * hw * 0.52, y0, s * hw * 0.52, yk);
  }
}

// --- Regionale Zutaten der Häuser -----------------------------------------------------------------------------

/**
 * Umriss eines Schaugiebels über der Traufe H (Breite w, Dach rh hoch), als Vieleck in der Wandebene. L ist die linke
 * Hälfte von außen unten nach innen oben. Jeder Punkt liegt über der Dachfläche dahinter, so verdeckt der Giebel das
 * Dach von vorn ganz. 'step' Treppengiebel (vier, fünf Stufen, oben ein Pfeiler), 'neck' Halsgiebel mit Schultern und
 * Dreieck, 'bell' Glockengiebel mit runder Haube.
 */
function gableOutline(kind, w, H, rh) {
  const hw = w / 2;
  const L = [];
  let mid = [];
  if (kind === 'step') {
    const n = w >= 7 ? 5 : 4;
    const pw = Math.max(0.9, w * 0.15);
    const s = (hw - pw / 2) / n;
    // erste Stufe so hoch, dass ihre innere Ecke über dem Dach liegt; danach steigt jede Stufe steiler als das Dach
    const e0 = 0.32 + (rh * s) / hw;
    const sy = (rh + 0.6 - e0) / n;
    L.push([-hw, H], [-hw, H + e0]);
    for (let k = 1; k <= n; k++) L.push([-hw + k * s, H + e0 + (k - 1) * sy], [-hw + k * s, H + e0 + k * sy]);
  } else {
    const q = w * 0.21;
    const h1 = 0.62 * rh + 0.7;
    const yn = Math.max(H + h1 + 0.9, H + rh + 0.4);
    L.push([-hw, H], [-hw, H + 0.35]);
    for (let i = 1; i <= 6; i++) {
      const t = i / 6;
      if (kind === 'neck') L.push([-q - (hw - q) * Math.cos((t * Math.PI) / 2), H + 0.35 + (h1 - 0.35) * Math.sin((t * Math.PI) / 2)]);
      else L.push([-hw + ((hw - q) * (1 - Math.cos(t * Math.PI))) / 2, H + 0.35 + (h1 - 0.35) * t]);
    }
    L.push([-q, yn]);
    if (kind === 'neck') {
      L.push([-q - 0.16, yn], [-q - 0.16, yn + 0.16]);
      mid = [[0, yn + 0.16 + q * 0.7]];
    } else {
      for (let i = 1; i < 6; i++) {
        const a = Math.PI - (i / 6) * Math.PI;
        mid.push([Math.cos(a) * q, yn + Math.sin(a) * q * 0.85]);
      }
    }
  }
  return { L, pts: [...L, ...mid, ...L.map(([x, y]) => [-x, y]).reverse()] };
}

/** Halbe Breite des Giebels in der Höhe y (L: linke Randlinie, von unten nach oben). */
function gableHalf(L, y) {
  let x = -Infinity;
  for (let i = 0; i + 1 < L.length; i++) {
    const [x0, y0] = L[i];
    const [x1, y1] = L[i + 1];
    if (y < Math.min(y0, y1) || y > Math.max(y0, y1)) continue;
    x = Math.max(x, y1 === y0 ? Math.max(x0, x1) : x0 + ((x1 - x0) * (y - y0)) / (y1 - y0));
  }
  return x === -Infinity ? 0 : -x;
}

/** Schaugiebel als Mauerscheibe (Tönung), mit Fensterreihen, Abdeckungen und Lastbalken. Gibt die Oberkante zurück. */
function showGable(b, kind, w, H, rh, jet, gz, o) {
  const { T, F } = b;
  const near = b.lod === 0;
  const { L, pts } = gableOutline(kind, w, H, rh);
  T.extrude(pts, jet - gz, jet, o.wall ?? WHITE, { g: [0.94, 1.03], crease: 2 });
  const top = Math.max(...pts.map((q) => q[1]));
  // Fensterreihen im Giebel, nach oben weniger
  const wh = 0.95;
  for (let y = H + 0.45; y + wh < top - 0.55; y += wh + 0.5) {
    const half = Math.min(gableHalf(L, y), gableHalf(L, y + wh / 2), gableHalf(L, y + wh)) - 0.32;
    const n = Math.min(3, Math.floor((2 * half + 0.6) / 1.35));
    if (n < 1) break;
    b.at(0, 0, jet, 0, () => {
      for (let i = 0; i < n; i++) b.win((i - (n - 1) / 2) * 1.35, y, 0.6, wh, { frame: o.frame, cross: 1, sill: false, fw: 0.07 });
    });
  }
  const zc = jet - gz / 2;
  if (kind === 'step') {
    // helle Abdeckungen auf den Stufen und ein Spitzchen auf dem Pfeiler
    if (near) {
      for (let k = 1; k + 1 < L.length; k += 2) {
        const [xa, y] = L[k];
        const xb = L[k + 1][0];
        for (const sgn of [-1, 1]) F.box(sgn * (xa + xb) / 2, y, zc, Math.abs(xb - xa) + 0.12, 0.1, gz + 0.12, o.cream);
      }
    }
    const pw = Math.abs(L[L.length - 1][0]) * 2;
    F.box(0, top, zc, pw + 0.14, 0.12, gz + 0.14, o.cream);
    F.cyl(0, top + 0.12, zc, Math.min(0.45, pw * 0.4), 0.04, 0.6, o.cream, { seg: 4 });
  } else if (near) {
    // Gesims am Fuß der Haube
    const yn = L[L.length - (kind === 'neck' ? 3 : 1)][1];
    const q = Math.abs(L[L.length - (kind === 'neck' ? 3 : 1)][0]);
    F.box(0, yn - 0.14, zc + 0.05, 2 * q + 0.3, 0.16, gz + 0.12, o.cream);
  }
  if (o.hoist && near) F.box(0, top - 0.95, jet + 0.5, 0.16, 0.16, 1.1, CITY.woodDark);
  return top;
}

/** Französischer Balkon vor einem Fenster: Platte, Handlauf, Stäbe (yF = Fußboden des Geschosses). */
function ironBalcony(b, x, yF, ww) {
  const { F, G } = b;
  const bw = ww + 0.5;
  F.box(x, yF - 0.1, 0.27, bw, 0.12, 0.54, PAL.stone, { g: [0.85, 1] });
  F.box(x, yF + 0.86, 0.51, bw, 0.05, 0.05, PAL.darkMetal);
  if (b.lod > 0) return;
  for (let i = 0; i <= 5; i++) G.rect(x - bw / 2 + 0.05 + (i * (bw - 0.1)) / 5, yF + 0.02, 0.53, 0.035, 0.84, PAL.darkMetal);
  for (const sgn of [-1, 1]) F.box(x + sgn * (bw / 2 - 0.02), yF + 0.02, 0.27, 0.04, 0.84, 0.5, PAL.darkMetal);
}

/** Treppe zur erhöhten Haustür (Hochparterre) mit zwei Wangen. Gibt zurück, wie weit sie vor die Wand reicht. */
function stoop(b, x, dw, base) {
  const F = b.F;
  const n = Math.max(2, Math.round(base / 0.19));
  const run = 0.3;
  for (let k = 0; k < n; k++) F.box(x, 0, (n - 1 - k + 0.5) * run, dw + 0.5, ((k + 1) * base) / n, run, PAL.stone, { skip: 'b' });
  for (const sgn of [-1, 1]) F.box(x + sgn * (dw / 2 + 0.38), 0, (n * run) / 2, 0.22, base + 0.35, n * run, PAL.stone, { skip: 'b' });
  return n * run + 0.1;
}

/** Holzbalkon über die ganze Front (Alpen): Boden, Brüstung mit Brettfugen, Konsolen, Blumenkasten. */
function balcony(b, w, y, jet, o) {
  const { F, G } = b;
  const near = b.lod === 0;
  const col = o.col ?? CITY.woodDark;
  const bw = w - 0.5;
  const bd = 1.1;
  F.box(0, y - 0.16, jet + bd / 2, bw, 0.16, bd, col, { g: [0.8, 1] });
  F.box(0, y, jet + bd - 0.05, bw, 0.95, 0.1, col, { g: [0.86, 1.04] });
  for (const sgn of [-1, 1]) F.box(sgn * (bw / 2 - 0.05), y, jet + bd / 2, 0.1, 0.95, bd - 0.1, col);
  if (near) {
    const k = mix(col, CITY.ink, 0.3);
    for (let x = -bw / 2 + 0.3; x < bw / 2 - 0.2; x += 0.3) G.rect(x, y + 0.08, jet + bd + 0.004, 0.07, 0.78, k);
    const nk = Math.max(2, Math.round(bw / 2.4) + 1);
    for (let i = 0; i < nk; i++) F.box(-bw / 2 + 0.5 + (i * (bw - 1)) / (nk - 1), y - 0.75, jet + 0.35, 0.14, 0.6, 0.7, col);
  }
  if (o.flowers) {
    F.box(0, y + 0.95, jet + bd - 0.12, bw - 0.3, 0.2, 0.26, col);
    const n = Math.max(2, Math.round((bw - 0.4) / (near ? 0.5 : 0.9)));
    for (let i = 0; i < n; i++) F.ball(-bw / 2 + 0.35 + (i * (bw - 0.7)) / (n - 1), y + 1.18, jet + bd - 0.1, near ? 0.24 : 0.28, o.flowers[i % o.flowers.length], { ws: 5, hs: 3 });
  }
  return bd + 0.15;
}

/**
 * Das Haus. p: w, d, floors, gh/fh (Geschosshöhen), base (Sockel), roof ('side' First längs der Straße, 'front'
 * Giebel zur Straße, 'hip', 'flat'), rh (Firsthöhe), roofCol, style ('plaster', 'timber', 'brick', 'siding'),
 * ground ('door', 'shop', 'garage'), shop (Schlüssel), cols (Fensterachsen), shutter, flowers, dormers, chimney,
 * terrace (Reihenhaus: Seiten glatt), jetty (Obergeschoss kragt vor). Regionale Zutaten: gable (Schaugiebel 'step',
 * 'neck', 'bell' vor einem Giebeldach zur Straße), lowerCol (Erdgeschoss in fester Farbe, darüber die Tönung),
 * balcony ({ col, flowers }: Holzbalkon vor dem ersten Stock), bay (Erker neben der Tür, bayFloors hoch), parapet
 * (Attika über dem Flachdach, cornice), balc ('iron': Balkönchen vor den Fenstern der Obergeschosse), eave (Vordach
 * über dem Erdgeschoss), hoist (Lastbalken im Giebel), horse (gekreuzte Giebelbretter), stoop (Treppe zum Hochparterre).
 * Gibt die Maße zurück.
 */
function house(b, p) {
  const { T, F, G } = b;
  const near = b.lod === 0;
  const { w, d } = p;
  const floors = p.floors ?? 2;
  const base = p.base ?? 0.3;
  const shop = p.ground === 'shop';
  const gh = p.gh ?? (shop ? 3.4 : 2.75);
  const fh = p.fh ?? 2.6;
  const H = base + gh + (floors - 1) * fh;
  const roof = p.roof ?? 'side';
  const jet = floors > 1 ? p.jetty ?? 0 : 0;
  const dd = d + jet;
  const zc = (jet - d) / 2;
  const span = roof === 'front' ? w : dd;
  const rh = roof === 'flat' ? 0 : p.rh ?? (roof === 'mansard' ? 2.5 : span * (roof === 'hip' ? 0.38 : 0.52));
  const roofCol = p.roofCol ?? PAL.roof[0];
  // roofTint: die Dachflächen kommen weiß in b.R und bekommen ihre Farbe beim Verschmelzen (Dachfarbe des Orts, sonst
  // roofCol, das als info.roofCol mitgeht); rc/rp sind Farbe und Teil für die Dachflächen
  const RT = !!p.roofTint;
  const rc = RT ? 0xffffff : roofCol;
  const rp = RT ? { part: b.R } : {};
  const sideOver = p.terrace ? 0.03 : undefined;
  const style = p.style ?? 'plaster';
  const ww = p.winW ?? 1.0;
  const wh = p.winH ?? 1.3;
  const cols = p.cols ?? Math.max(2, Math.round(w / 2.4));
  const colX = (i, n = cols, width = w) => -width / 2 + (width / n) * (i + 0.5);
  const frame = p.frame ?? PAL.frame;
  const WHITE = p.wall ?? 0xffffff;
  const par = roof === 'flat' ? p.parapet ?? 0 : 0; // Attika: die Wand steigt über die oberste Fensterreihe
  let over = 0.1;
  let top = 0; // höchster Punkt eines Schaugiebels

  // Sockel und Wandkörper
  F.rbox(0, 0, -d / 2, w + 0.1, base, d + 0.1, R, p.baseCol ?? PAL.stone);
  const wallKs = [0.9, 1, 1, 0.88];
  const body = (y0, y1, depth, z) => T.rbox(0, y0, z, w, y1 - y0, depth, R, WHITE, {
    prof: [[0, 0], [0, 0.5], [0, y1 - y0 - 0.5], [0, y1 - y0]], ks: wallKs, top: false,
  });
  if (jet > 0) {
    body(base, base + gh, d, -d / 2);
    T.rbox(0, base + gh, zc, w, H - base - gh, dd, R, WHITE, { prof: [[0, 0], [0, H - base - gh - 0.5], [0, H - base - gh]], ks: [0.94, 1, 0.88], top: false, bottom: true });
    if (near) for (let i = 0; i <= cols; i++) F.box(-w / 2 + 0.2 + ((w - 0.4) * i) / cols, base + gh - 0.3, jet / 2, 0.16, 0.3, jet, PAL.timber, { skip: 'k' });
  } else if (p.lowerCol !== undefined && floors > 1) {
    // Erdgeschoss fest gefärbt (Putz, dunkles Holz), darüber die Tönung (Holz, Putz)
    F.rbox(0, base, -d / 2, w, gh, d, R, p.lowerCol, { prof: [[0, 0], [0, gh]], ks: [0.9, 1], top: false });
    T.rbox(0, base + gh, -d / 2, w + 0.04, H + par - base - gh, d + 0.04, R, WHITE, { prof: [[0, 0], [0, H + par - base - gh - 0.5], [0, H + par - base - gh]], ks: [0.94, 1, 0.88], top: false });
  } else body(base, H + par, d, -d / 2);

  // Giebeldreiecke und Dach
  if (roof === 'side') {
    b.at(0, 0, zc, Math.PI / 2, () => T.extrude([[-dd / 2, H], [dd / 2, H], [0, H + rh]], -w / 2 + 0.01, w / 2 - 0.01, WHITE, { sides: false, g: [0.94, 1] }));
    b.gable(0, H, zc, w, dd, rh, rc, { axis: 'x', og: sideOver, oe: p.oe, t: p.roofT, ...rp });
  } else if (roof === 'front' && p.gable) {
    // Schaugiebel: Mauerscheibe 0,45 m stark vor dem Dach, ragt über die Dachfläche; das Dach beginnt dahinter
    const gz = 0.45;
    T.extrude([[-w / 2, H], [w / 2, H], [0, H + rh]], -d + 0.01, jet - gz, WHITE, { sides: false, g: [0.94, 1] });
    const back = -d - (p.og ?? 0.3);
    b.gable(0, H, (back + jet - gz) / 2, w, jet - gz - back, rh, rc, { axis: 'z', oe: sideOver ?? p.oe, og: 0, t: p.roofT, ...rp });
    top = showGable(b, p.gable, w, H, rh, jet, gz, { wall: WHITE, frame, cream: p.band ?? CITY.sand, hoist: p.hoist });
  } else if (roof === 'front') {
    T.extrude([[-w / 2, H], [w / 2, H], [0, H + rh]], -d + 0.01, jet - 0.01, WHITE, { sides: false, g: [0.94, 1] });
    b.gable(0, H, zc, w, dd, rh, rc, { axis: 'z', oe: sideOver ?? p.oe, og: p.og, t: p.roofT, ...rp });
    if (p.horse && near) {
      // gekreuzte Giebelbretter (Pferdeköpfe) über dem First
      const og = p.og ?? 0.3;
      for (const sgn of [-1, 1]) b.xf([0, H + rh - 0.25, jet + og + 0.05], [0, 0, sgn * 0.5], 1, () => F.box(0, 0, 0, 0.16, 1.5, 0.12, CITY.woodDark ?? PAL.timber));
    }
  } else if (roof === 'hip') {
    b.hip(0, H, zc, w, dd, rh, rc, { oe: p.oe, ...rp });
  } else if (roof === 'mansard') {
    // Mansarddach: steile Schürze zur Straße und nach hinten, oben flach
    const so = sideOver ?? 0.25;
    const RF = RT ? b.R : F;
    b.at(0, 0, zc, Math.PI / 2, () => RF.extrude([[-dd / 2 - 0.3, H], [dd / 2 + 0.3, H], [dd / 2 - MANSARD, H + rh], [-dd / 2 + MANSARD, H + rh]], -w / 2 - so, w / 2 + so, rc, { g: [0.84, 1.04], crease: 2 }));
    F.box(0, H - 0.16, zc, w + 2 * so, 0.2, dd + 0.76, p.cornice ?? PAL.frame);
    RF.box(0, H + rh, zc, w + 2 * so, 0.1, dd - 2 * MANSARD + 0.3, mix(rc, CITY.ink, 0.3));
  } else {
    // Flachdach: dicke, leicht überstehende Platte mit runden Ecken; mit Attika ein Gesims an der Straßenseite
    F.rbox(0, H + par, zc, w + 0.24, 0.26, dd + 0.24, R + 0.1, p.roofCol ?? PAL.concrete, { prof: [[0, 0], [0, 0.2], [0.06, 0.26]], ks: [0.8, 0.95, 1] });
    if (par > 0) F.box(0, H + par - 0.34, jet + 0.14, w + 0.3, 0.34, 0.28, p.cornice ?? PAL.frame, { g: [0.86, 1.04] });
  }

  // Fachwerk
  if (style === 'timber') {
    for (let f = p.timberFrom === 0 ? 0 : 1; f < floors; f++) {
      const ya = f === 0 ? base : base + gh + (f - 1) * fh;
      const yb = f === 0 ? base + gh : ya + fh;
      b.sides(w, d, (len, side) => {
        const n = side === 'f' ? cols : Math.max(2, Math.round(len / 2.6));
        b.at(0, 0, side === 'f' ? jet : 0, 0, () => timber(b, len, ya, yb, n, { wins: side === 'f' || side === 'k' ? undefined : (i) => i % 2 === 0 && !p.terrace }));
      }, p.terrace ? 'f' : near ? 'frkl' : 'frl');
    }
    if (roof === 'front') b.at(0, 0, jet, 0, () => timberGable(b, w, H, rh));
    else if (roof === 'side' && !p.terrace) {
      b.sides(w, d, (len) => timberGable(b, len + jet, H, rh), 'rl');
    }
  }
  // Holzverschalung: feine Schattenfugen und helle Eckbretter
  if (style === 'siding' && near) {
    for (let y = (p.lowerCol !== undefined ? base + gh : base) + 0.35; y < H - 0.1; y += 0.34) {
      b.sides(w, d, (len) => T.rect(0, y, 0.008, len - 2 * R, 0.035, WHITE, { k: 0.84 }), p.terrace ? 'f' : 'frl');
    }
  }
  if ((style === 'siding' || p.corners) && p.corners !== false) {
    const cc = p.corners ?? frame;
    b.sides(w, d, (len) => {
      for (const s of [-1, 1]) G.rect(s * (len / 2 - 0.09 - R * 0.3), base, 0.012, 0.18, H - base, cc);
    }, p.terrace ? 'f' : 'frl');
  }
  // Plattenbau: Fugen der Großtafeln, waagerecht in Höhe der Geschossdecken, senkrecht zwischen den Achsen
  if (style === 'panel') {
    for (let f = 1; f <= floors; f++) {
      const y = f === floors ? H - 0.05 : base + gh + (f - 1) * fh - 0.03;
      b.sides(w, d, (len) => T.rect(0, y, 0.008, len - 2 * R, 0.06, WHITE, { k: 0.78 }), p.terrace ? 'f' : 'frl');
    }
    if (near) {
      b.at(0, 0, jet, 0, () => {
        for (let i = 1; i < cols; i++) T.rect(-w / 2 + (w / cols) * i, base, 0.008, 0.05, H - base, WHITE, { k: 0.8 });
      });
    }
  }
  // Loggien (Plattenbau, Nachkriegsbau): eingelassene Balkone mit farbiger Brüstung an jeder zweiten Achse
  if (p.loggia && floors > 1) {
    for (let f = 1; f < floors; f++) {
      const y = base + gh + (f - 1) * fh;
      for (let i = p.loggiaFrom ?? 1; i < cols; i += 2) {
        const x = colX(i);
        const lw = Math.min(w / cols - 0.2, 2.4);
        F.box(x, y - 0.06, jet + 0.42, lw, 0.12, 0.84, PAL.concrete, { skip: 'k' });
        F.box(x, y + 0.06, jet + 0.8, lw, 0.9, 0.08, p.loggia[(i + f) % p.loggia.length], { skip: 'bk' });
        if (near) for (const sgn of [-1, 1]) F.box(x + sgn * (lw / 2 - 0.04), y + 0.06, jet + 0.42, 0.08, 0.9, 0.76, PAL.concrete, { skip: 'b' });
      }
    }
  }
  // Backstein: helle Bänder in Höhe der Geschossdecken
  if (style === 'brick') {
    for (let f = 1; f < floors; f++) {
      const y = base + gh + (f - 1) * fh - 0.12;
      b.sides(w, d, (len) => G.rect(0, y, 0.012, len - R, 0.14, p.band ?? CITY.sand), p.terrace ? 'f' : 'frl');
    }
  }

  // Straßenseite: Obergeschosse
  const winOpt = (f, i) => ({
    frame,
    cross: p.cross ?? 2,
    shutter: p.shutter,
    flowers: p.flowers && near && (p.flowersAll || (i + f) % 2 === 0) ? p.flowers[(i + f) % p.flowers.length] : 0,
    sillCol: p.sillCol,
    // große Häuser: bündige Fenster (flacher Rahmen), sonst sprengen 50 Fenster das Dreiecksbudget
    flat: !!p.flatWin,
  });
  const dcol = p.doorCol ?? (cols > 2 ? 1 : 0);
  const bay = p.bay === undefined || shop ? -1 : p.bay === true ? (dcol + 1) % cols : p.bay;
  const bayF = p.bayFloors ?? 1;
  for (let f = 1; f < floors; f++) {
    const y = base + gh + (f - 1) * fh + 0.82;
    b.at(0, 0, jet, 0, () => {
      for (let i = 0; i < cols; i++) {
        if (i === bay && f < bayF) continue;
        b.win(colX(i), y, ww, wh, winOpt(f, i));
        if (p.balc === 'iron') ironBalcony(b, colX(i), y - 0.82, ww);
      }
    });
  }
  // Erdgeschoss
  if (shop) {
    over = Math.max(over, shopFront(b, w, p.shop, base, { doorLeft: p.doorLeft, door: p.door, frame, awning: p.awning, icon: p.icon }));
  } else if (p.ground === 'garage') {
    const gw = Math.min(2.6, w * 0.4);
    const gx = w / 2 - 0.5 - gw / 2;
    G.box(gx, base * 0.3, 0.03, gw + 0.2, 2.25, 0.06, frame, { skip: 'kb' });
    for (let i = 0; i < 4; i++) G.rect(gx, base * 0.3 + 0.06 + i * 0.53, 0.065, gw, 0.49, p.door ?? DOORS[3], { g: [0.92, 1.03] });
    b.door(-w / 2 + 1.1, 1.0, 2.1, p.door ?? DOORS[3], { y: base, steps: true, frame });
    if (w > 8) b.win(-w / 2 + 3.0, base + 0.9, ww, wh, winOpt(0, 1));
    over = 0.45;
  } else {
    const dc = dcol;
    for (let i = 0; i < cols; i++) {
      if (i === dc) b.door(colX(i), p.doorW ?? 1.05, 2.1, p.door ?? DOORS[0], { y: base, steps: !p.stoop, light: p.light, frame, glass: p.doorGlass });
      else if (i !== bay) b.win(colX(i), base + 0.9, ww, wh, winOpt(0, i));
    }
    if (p.stoop && base > 0.4) over = Math.max(over, stoop(b, colX(dc), p.doorW ?? 1.05, base));
    over = 0.45;
    if (near && p.lamp !== false) {
      // Laterne neben der Tür
      const lx = colX(dc) + (p.doorW ?? 1.05) / 2 + 0.3;
      F.box(lx, base + 1.95, 0.06, 0.07, 0.07, 0.12, PAL.darkMetal);
      G.lathe(lx, base + 1.78, 0.13, [[0.05, 0], [0.09, 0.04], [0.09, 0.2], [0.02, 0.27]], [PAL.darkMetal, 0xffe9a8, PAL.darkMetal], { seg: 6, bottom: true });
    }
  }
  // Laubengang vor dem Erdgeschoss (Bern, Thun, Innsbruck, Turin): Pfeiler zwischen den Achsen, Bögen darüber,
  // dunkle Decke; der Gang liegt vor der Fassade, auf dem Vorplatz des zurückgesetzten Hauses (setback = Tiefe)
  if (p.arcade && floors > 1) {
    const ad = p.setback ?? 2.1;
    const aw = w / cols;
    const ah = gh - 0.15;
    T.box(0, base + ah, ad / 2, w, gh - ah + 0.35, ad, WHITE, { skip: 'k', g: [0.9, 1] });
    F.box(0, base + ah - 0.02, ad / 2, w - 0.1, 0.03, ad - 0.1, 0x6a645c, { skip: 't' });
    for (let i = 0; i <= cols; i++) {
      const x = -w / 2 + aw * i + (i === 0 ? 0.25 : i === cols ? -0.25 : 0);
      T.box(x, 0, ad - 0.3, 0.5, base + ah, 0.6, WHITE, { skip: 'k', g: [0.86, 1] });
      if (near && i < cols) {
        // Bogen: zwei Zwickel unter dem Sturz
        const xm = -w / 2 + aw * (i + 0.5);
        for (const sgn of [-1, 1]) T.box(xm + sgn * (aw / 2 - 0.55), base + ah - 0.45, ad - 0.05, 0.7, 0.45, 0.1, WHITE, { skip: 'k' });
      }
    }
    over = Math.max(over, ad + 0.05);
  }
  // Giebelfenster
  if (roof === 'front' && rh > 2.6 && p.gableWin !== false && !p.gable) {
    b.at(0, 0, jet, 0, () => {
      if (p.gableWin === 'round') {
        G.disc(0, H + rh * 0.36, 0.015, 0.42, mix(PAL.glass, PAL.glassDark, 0.3), { seg: near ? 14 : 8 });
        if (near) b.xf([0, H + rh * 0.36, 0.03], [Math.PI / 2, 0, 0], 1, () => G.torus(0, 0, 0, 0.45, 0.05, frame, { seg: 14, tube: 4 }));
      } else b.win(0, H + rh * 0.24, 0.8, 0.95, { frame, cross: 1, shutter: p.shutter, flowers: p.flowers && near ? p.flowers[0] : 0 });
    });
  }
  // Seitenwände (freistehend): je Geschoss ein, zwei Fenster
  if (!p.terrace && p.sideWin !== false) {
    b.sides(w, d, (len, side) => {
      const n = Math.max(1, Math.round(len / 4.2));
      for (let f = 0; f < floors; f++) {
        const y = (f === 0 ? base + 0.9 : base + gh + (f - 1) * fh + 0.82);
        for (let i = 0; i < n; i++) {
          if (f === 0 && shop && side === 'r' && i === 0) continue;
          b.win(colX(i, n, len) + (side === 'r' ? -jet : jet) * 0, y, ww, wh, { frame, cross: p.cross ?? 2, shutter: p.shutter, flat: !near || !!p.flatWin });
        }
      }
      if (roof === 'side' && rh > 2.6) b.win(0, H + rh * 0.22, 0.8, 0.95, { frame, cross: 1 });
    }, 'rl');
  }
  // Gauben auf der Straßenseite (bei First längs der Straße und auf der Mansarde)
  if ((roof === 'side' || roof === 'mansard') && p.dormers) {
    const n = p.dormers;
    const dw = 1.25;
    const dh = 1.15;
    const y0 = H + (roof === 'side' ? rh * 0.16 : 0.3);
    const slope = roof === 'side' ? dd / 2 / rh : (MANSARD + 0.3) / rh;
    const zf = zc + dd / 2 + (roof === 'side' ? 0 : 0.3) - (y0 - H) * slope - 0.12;
    const run = (dh + 0.55) * slope + (roof === 'side' ? 0 : 0.3);
    for (let i = 0; i < n; i++) {
      const x = colX(i, n) * (n === 1 ? 0 : 0.92);
      T.box(x, y0, zf - run / 2, dw, dh, run, WHITE, { skip: 'kb', k: 0.97 });
      b.gable(x, y0 + dh, zf - run / 2, dw, run, 0.5, rc, { axis: 'z', oe: 0.14, og: 0.14, t: 0.12, ridge: false, ...rp });
      T.extrude([[x - dw / 2, y0 + dh], [x + dw / 2, y0 + dh], [x, y0 + dh + 0.5]], zf - 0.02, zf, WHITE, { sides: false, caps: 'f' });
      b.at(x, 0, zf, 0, () => b.win(0, y0 + 0.22, 0.75, 0.8, { frame, cross: 1, sill: false, fw: 0.07 }));
    }
  }
  // Erker neben der Tür (über bayFloors Geschosse), mit kleinem Walmdach
  if (bay >= 0) {
    const bx = colX(bay);
    const bw = Math.min(w / cols + 0.7, 2.7);
    const bh = gh + (bayF - 1) * fh - 0.15;
    T.box(bx, base, jet + 0.35, bw, bh, 0.7, WHITE, { skip: 'b', g: [0.92, 1] });
    for (let f = 0; f < bayF; f++) {
      const y = f === 0 ? base + 0.75 : base + gh + (f - 1) * fh + 0.82;
      b.at(bx, 0, jet + 0.7, 0, () => b.win(0, y, bw - 0.75, wh + 0.2, winOpt(f, bay)));
      if (near) for (const sgn of [-1, 1]) b.at(bx + sgn * bw / 2, 0, jet + 0.35, sgn * Math.PI / 2, () => G.rect(0, y + 0.1, 0.01, 0.34, wh, PAL.glass));
    }
    b.hip(bx, base + bh, jet + 0.42, bw, 0.84, 0.45, p.bayRoof ?? rc, { oe: 0.1, ...(p.bayRoof ? {} : rp) });
    over = Math.max(over, 0.85);
  }
  // Holzbalkon vor dem ersten Stock (Alpen): Boden, Brüstung mit Brettern, Blumenkästen, Konsolen
  if (p.balcony && floors > 1) over = Math.max(over, balcony(b, w, base + gh, jet, p.balcony));
  // Vordach über dem Erdgeschoss (Japan)
  if (p.eave) {
    const y = base + gh + 0.05;
    b.at(0, 0, jet, Math.PI / 2, () => F.extrude([[0, y], [0, y + 0.14], [-0.95, y - 0.24], [-0.95, y - 0.38]], -w / 2 - 0.12, w / 2 + 0.12, p.eave, { g: [0.86, 1.02], crease: 2 }));
    over = Math.max(over, 1.0);
  }
  // Schornstein
  if (p.chimney !== false && roof !== 'flat') {
    const cx = (p.chimneyX ?? 0.24) * w;
    if (roof === 'mansard') b.chimney(cx, H + rh, zc - 0.6, 1.3, p.chimneyCol);
    else if (roof === 'side') b.chimney(cx, H + rh * 0.45, zc - dd * 0.16, rh * 0.55 + 0.75, p.chimneyCol);
    else if (roof === 'front') b.chimney(w * 0.2, H + rh * 0.4, -d * 0.62, rh * 0.6 + 0.7, p.chimneyCol);
    else b.chimney(cx * 0.6, H + rh * 0.5, zc - dd * 0.1, rh * 0.5 + 0.8, p.chimneyCol);
  }
  if (p.loggia && floors > 1) over = Math.max(over, 0.95);
  return { w, d, h: Math.max(H + par + rh + (roof === 'flat' ? 0.26 : 0.9), top + 0.1), eaves: H, over, rh, ...(RT && roof !== 'flat' ? { roofCol } : {}) };
}

const WALLS = PAL.wall;
const defs = {};
const HOUSES = {}; // Parameter jeder Haus-Variante, für die regionalen Spielarten
/** Haus-Variante in die Tabelle eintragen. */
function addHouse(name, kind, tints, p, extra) {
  HOUSES[name] = { kind, p, extra };
  defs[name] = {
    kind,
    tints,
    far: true,
    make: (b) => {
      const info = house(b, { ...p, roofTint: true });
      if (extra) extra(b, info);
      return info;
    },
  };
}

// --- Dorf ---------------------------------------------------------------------------------------------------
addHouse('cottage1', 'village', [WALLS[0], WALLS[1], WALLS[6], WALLS[4]], { w: 9, d: 8, floors: 1, roof: 'side', rh: 3.6, dormers: 2, shutter: PAL.door[0], flowers: [PAL.red, PAL.blossom[0]] });
addHouse('cottage2', 'village', [WALLS[6], WALLS[3], WALLS[5], WALLS[1]], { w: 8, d: 9, floors: 2, roof: 'front', roofCol: PAL.roof[1], shutter: PAL.door[1], flowers: [PAL.signYellow, PAL.red], door: DOORS[1] });
addHouse('cottage3', 'village', [WALLS[2], WALLS[0], WALLS[4]], { w: 10.5, d: 8, floors: 1, roof: 'hip', rh: 3.2, roofCol: PAL.roof[4], ground: 'garage', door: DOORS[2] });
addHouse('timberHouse1', 'village', [WALLS[6], WALLS[0], WALLS[1]], { w: 8, d: 9.5, floors: 2, roof: 'front', style: 'timber', jetty: 0.22, roofCol: PAL.roof[1], flowers: [PAL.red], flowersAll: true, door: DOORS[3], gableWin: 'win' });
addHouse('timberHouse2', 'village', [WALLS[0], WALLS[6], WALLS[5]], { w: 10, d: 8, floors: 2, roof: 'side', style: 'timber', timberFrom: 0, roofCol: PAL.roof[0], flowers: [PAL.red, PAL.signYellow], door: DOORS[0], dormers: 1 });


// --- Bauteile für besondere Häuser ---------------------------------------------------------------------------
/** Umriss einer Bogenöffnung um x: Breite w, Fuß y0, Scheitelhöhe h; pointed = Spitzbogen. */
function arch(x, w, y0, h, n = 8, pointed = false) {
  const r = w / 2;
  const pts = [[x - r, y0], [x + r, y0]];
  if (pointed) {
    const yc = y0 + h - r * 1.6;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const a = t < 0.5 ? t * 2 : (1 - t) * 2; // 0 … 1 … 0 entlang der Bogenhälften
      const ang = a * 0.93;
      const px = (2 * r * Math.cos(ang) - r) * (t < 0.5 ? 1 : -1);
      pts.push([x + px, yc + 2 * r * Math.sin(ang)]);
    }
  } else {
    const yc = y0 + h - r;
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * Math.PI;
      pts.push([x + Math.cos(a) * r, yc + Math.sin(a) * r]);
    }
  }
  return pts;
}

/** Bogenfenster in der Wandebene: Scheibe und Rahmenband (G). */
function archWin(b, x, y, w, h, o = {}) {
  const { G } = b;
  const fw = o.fw ?? 0.12;
  const n = b.lod ? 6 : 10;
  const inner = arch(x, w, y, h, n, o.pointed);
  const outer = arch(x, w + 2 * fw, y - fw, h + 2 * fw, n, o.pointed);
  G.extrude(inner, 0.014, 0.015, o.pane ?? mix(PAL.glass, PAL.glassDark, 0.45), { caps: 'f', sides: false, g: [1.15, 0.75] });
  G.extrude(outer, 0, b.lod ? 0.02 : 0.07, o.frame ?? PAL.stone, { caps: 'f', holes: [inner], sides: !b.lod });
  if (!b.lod && o.cross !== 0) {
    G.rect(x, y, 0.03, 0.07, h - 0.05, o.frame ?? PAL.stone);
    if (h > 2.2) G.rect(x, y + h * 0.45, 0.03, w, 0.07, o.frame ?? PAL.stone);
  }
}

/** Turmuhr (Durchmesser 2r) in der Wandebene: helles Zifferblatt, goldener Ring, Zeiger auf zehn nach zehn. */
function clock(b, x, y, r) {
  const { G } = b;
  G.disc(x, y, 0.03, r, CITY.ivory, { seg: b.lod ? 10 : 20 });
  if (b.lod) return;
  b.xf([x, y, 0.03], [Math.PI / 2, 0, 0], 1, () => G.torus(0, 0, 0, r, r * 0.09, CITY.gold, { seg: 20, tube: 5 }));
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const l = i % 3 === 0 ? 0.2 : 0.1;
    const s = Math.sin(a);
    const c = Math.cos(a);
    const t = r * 0.035;
    const r0 = r * (0.86 - l);
    const r1 = r * 0.86;
    G.quad([x + s * r0 - c * t, y + c * r0 + s * t, 0.04], [x + s * r0 + c * t, y + c * r0 - s * t, 0.04], [x + s * r1 + c * t, y + c * r1 - s * t, 0.04], [x + s * r1 - c * t, y + c * r1 + s * t, 0.04], CITY.ink);
  }
  const hand = (a, len, t) => {
    const s = Math.sin(a);
    const c = Math.cos(a);
    G.quad([x - c * t, y + s * t, 0.05], [x + c * t, y - s * t, 0.05], [x + s * len + c * t * 0.5, y + c * len - s * t * 0.5, 0.05], [x + s * len - c * t * 0.5, y + c * len + s * t * 0.5, 0.05], CITY.ink);
  };
  hand(-Math.PI / 3, r * 0.5, r * 0.06);
  hand(Math.PI / 3, r * 0.72, r * 0.045);
  G.disc(x, y, 0.055, r * 0.08, CITY.gold, { seg: 8 });
}

/** Fahnenmast mit wehender Fahne (Streifen cols von oben nach unten). */
// Fahnen nur in Pastell mit Weiß: festlich, ohne an Landesflaggen zu erinnern
const FLAG = { pink: [0xf4a6c0, PAL.frame], mint: [0x8fd3c2, PAL.frame], apricot: [0xf6c56b, PAL.frame], lilac: [0xc3a6e6, PAL.frame] };
function flag(b, x, y, z, h, cols, fw = 1.5) {
  const { F } = b;
  F.cyl(x, y, z, 0.05, 0.035, h, PAL.steel, { seg: 6 });
  F.ball(x, y + h + 0.04, z, 0.07, CITY.gold, { ws: 6, hs: 4 });
  if (b.lod > 1) return;
  const fh = fw * 0.62;
  const n = cols.length;
  const seg = b.lod ? 2 : 4;
  for (let j = 0; j < n; j++) {
    const y1 = y + h - 0.1 - (fh * j) / n;
    const y0 = y1 - fh / n;
    for (let i = 0; i < seg; i++) {
      const wave = (u) => Math.sin(u * 5.2) * 0.1 * u;
      const u0 = i / seg;
      const u1 = (i + 1) / seg;
      const A = [x + 0.04 + u0 * fw, y0 - u0 * 0.08, z + wave(u0)];
      const B = [x + 0.04 + u1 * fw, y0 - u1 * 0.08, z + wave(u1)];
      const C = [x + 0.04 + u1 * fw, y1 - u1 * 0.08, z + wave(u1)];
      const D = [x + 0.04 + u0 * fw, y1 - u0 * 0.08, z + wave(u0)];
      F.quad(A, B, C, D, cols[j]);
      F.quad(B, A, D, C, cols[j], { k: 0.85 });
    }
  }
}

/** Wetterhahn auf einer Kugel (Spitze von Kirchtürmen): steht im Ursprung auf der Höhe y. */
function weathercock(b, x, y, z) {
  const { F, G } = b;
  F.ball(x, y + 0.22, z, 0.22, CITY.gold, { ws: 8, hs: 5 });
  F.cyl(x, y + 0.4, z, 0.03, 0.03, 0.75, CITY.ink, { seg: 5 });
  if (b.lod) return;
  const body = [[-0.42, 0.1], [-0.3, -0.06], [0.12, -0.1], [0.3, 0.06], [0.34, 0.3], [0.44, 0.3], [0.36, 0.42], [0.22, 0.4], [0.16, 0.2], [-0.1, 0.16], [-0.36, 0.42], [-0.46, 0.34]];
  b.at(x, y + 1.2, z, 0, () => G.extrude(body, -0.02, 0.02, CITY.gold, { crease: 2 }));
}

/** Zwiebelhaube als Profil (Radius r, Höhe h). */
const onion = (r, h) => [[r * 0.9, 0], [r * 1.22, h * 0.14], [r * 1.3, h * 0.3], [r * 1.12, h * 0.46], [r * 0.7, h * 0.62], [r * 0.3, h * 0.76], [r * 0.1, h * 0.9], [0, h]];
/** Kuppel als Profil. */
const dome = (r, h, n = 6) => Array.from({ length: n + 1 }, (_, i) => [Math.max(0, r * Math.cos((i / n) * Math.PI / 2)), h * Math.sin((i / n) * Math.PI / 2)]);

/** Platz- oder Hofboden: flache Platte mit runder Kante (liegt 8 cm über dem Gelände, damit nichts flimmert). */
function slab(b, x, z, w, d, col, h = 0.08) {
  b.F.rbox(x, 0, z, w, h, d, 0.3, col, { prof: [[0.04, 0], [0, 0.04], [0, h]], ks: [0.85, 0.9, 1], seg: 2 });
}

// --- Dorf: besondere Häuser ----------------------------------------------------------------------------------
defs.farm = {
  kind: 'village', tints: [WALLS[6], WALLS[0], WALLS[1]], far: true,
  make(b) {
    const { F, G } = b;
    const near = b.lod === 0;
    // Wohnhaus links, Hoftor in der Mauer, Scheune rechts
    let hi = null;
    b.at(-8.4, 0, 0, 0, () => {
      hi = house(b, { w: 9.2, d: 9, floors: 2, roof: 'front', style: 'timber', roofCol: PAL.roof[1], flowers: [PAL.red], flowersAll: true, door: DOORS[0], sideWin: false });
    });
    // Mauer mit Torbogen und Ziegelabdeckung
    const gate = arch(0, 3.6, 0, 3.5, near ? 10 : 6);
    b.at(-1.3, 0, -0.5, 0, () => {
      F.extrude([[-2.5, 0], [2.5, 0], [2.5, 4.3], [-2.5, 4.3]], -0.25, 0.25, PAL.stone, { holes: [gate], g: [0.86, 1.02] });
      b.gable(0, 4.3, 0, 5, 0.5, 0.3, PAL.roof[1], { axis: 'x', oe: 0.18, og: 0.02, t: 0.12, ridge: false });
      // offene Torflügel
      for (const s of [-1, 1]) b.at(s * 1.8, 0, -0.25, s * 1.25, () => G.box(s * -0.85, 0.15, 0, 1.7, 2.6, 0.1, DOORS[0]));
    });
    // Scheune: Bretterwände, großes Tor, Heuluke
    const bw = 11;
    const bd = 10;
    const bh = 4.6;
    const rh = 4.2;
    b.at(7.1, 0, 0, 0, () => {
      F.rbox(0, 0, -bd / 2, bw + 0.1, 0.5, bd + 0.1, R, PAL.stone);
      F.rbox(0, 0.5, -bd / 2, bw, bh - 0.5, bd, R, CITY.wood, { top: false, ks: [0.86, 1], prof: [[0, 0], [0, bh - 0.5]] });
      b.at(0, 0, -bd / 2, Math.PI / 2, () => F.extrude([[-bd / 2, bh], [bd / 2, bh], [0, bh + rh]], -bw / 2 + 0.01, bw / 2 - 0.01, CITY.wood, { sides: false }));
      b.gable(0, bh, -bd / 2, bw, bd, rh, PAL.roof[4], { axis: 'x' });
      if (near) for (let x = -bw / 2 + 0.6; x < bw / 2 - 0.3; x += 0.6) G.rect(x, 0.5, 0.008, 0.035, bh - 0.5, CITY.woodDark);
      // Scheunentor mit Kreuzstreben
      G.box(0, 0.2, 0.04, 3.9, 3.5, 0.08, PAL.frame, { skip: 'kb' });
      for (const s of [-1, 1]) {
        G.rect(s * 0.92, 0.3, 0.085, 1.78, 3.3, DOORS[0], { g: [0.92, 1.03] });
        if (near) {
          const x0 = s * 0.92 - 0.8;
          const x1 = s * 0.92 + 0.8;
          const t = 0.08;
          G.quad([x0, 0.4, 0.095], [x0 + t * 2, 0.4, 0.095], [x1, 3.5, 0.095], [x1 - t * 2, 3.5, 0.095], PAL.frame);
          G.quad([x1 - t * 2, 0.4, 0.095], [x1, 0.4, 0.095], [x0 + t * 2, 3.5, 0.095], [x0, 3.5, 0.095], PAL.frame);
        }
      }
      // Wetterhahn und Heuballen
      if (near) {
        weathercock(b, 0, bh + rh + 0.05, -bd / 2);
        b.xf([-4.2, 0.55, 0.9], [0, 0, Math.PI / 2], 1, () => F.cyl(0, -0.6, 0, 0.55, 0.55, 1.2, PAL.hay, { seg: 10, bottom: true }));
      }
    });
    // höher ist das Wohnhaus (First), nicht die Scheune mit Wetterhahn
    return { w: 26, d: 10, h: Math.max(bh + rh + 1.6, hi && hi.h ? hi.h : 0), over: 1.6 };
  },
};

/** Dorfkirche: Turm vorne an der Straße, Schiff dahinter. spire: 'point' Spitzhelm, 'onion' Zwiebelhaube. */
function church(b, p) {
  const { T, F, G } = b;
  const near = b.lod === 0;
  const tw = p.tw ?? 4.6;
  const th = p.th ?? 13;
  const nw = p.nw ?? 9;
  const nl = p.nl ?? 14;
  const nh = p.nh ?? 6.4;
  const rh = nw * 0.62;
  const roofCol = p.roofCol ?? CITY.slate;
  // Schiff mit Apsis
  const z0 = -tw + 0.4;
  F.rbox(0, 0, z0 - nl / 2, nw + 0.16, 0.5, nl + 0.16, R, PAL.stone);
  T.rbox(0, 0.5, z0 - nl / 2, nw, nh - 0.5, nl, R, WHITE, { top: false, prof: [[0, 0], [0, 0.6], [0, nh - 1.1], [0, nh - 0.5]], ks: [0.9, 1, 1, 0.88] });
  T.extrude([[-nw / 2, nh], [nw / 2, nh], [0, nh + rh]], z0 - nl + 0.01, z0 - 0.01, WHITE, { sides: false });
  b.gable(0, nh, z0 - nl / 2, nw, nl, rh, roofCol, { axis: 'z', oe: 0.35, og: 0.25 });
  const ar = nw * 0.36;
  T.lathe(0, 0, z0 - nl, [[ar, 0], [ar, nh - 0.6]], WHITE, { seg: 8, a0: Math.PI / 2, a1: Math.PI * 1.5, top: false, ks: [0.88, 1] });
  F.lathe(0, nh - 0.6, z0 - nl, [[ar + 0.3, 0], [ar * 0.6, rh * 0.42], [0, rh * 0.62]], roofCol, { seg: 8, a0: Math.PI / 2, a1: Math.PI * 1.5, g: [0.86, 1.04] });
  // Bogenfenster an den Längsseiten
  const nWin = p.wins ?? 3;
  for (const s of [-1, 1]) {
    b.at((s * nw) / 2, 0, z0 - nl / 2, (s * Math.PI) / 2, () => {
      for (let i = 0; i < nWin; i++) archWin(b, (-nl / 2 + (nl / nWin) * (i + 0.5)) * 1, 2.0, 1.1, 3.2, { pointed: p.pointed });
    });
  }
  // Turm
  F.rbox(0, 0, -tw / 2, tw + 0.2, 0.6, tw + 0.2, R, PAL.stone);
  T.rbox(0, 0.6, -tw / 2, tw, th - 0.6, tw, R, WHITE, { top: false, prof: [[0, 0], [0, 1], [0, th - 1.2], [0, th - 0.6]], ks: [0.9, 1, 1, 0.9] });
  F.rbox(0, th, -tw / 2, tw + 0.36, 0.3, tw + 0.36, R, PAL.stone);
  // Portal, Schallöffnungen, Uhr
  G.extrude(arch(0, 1.7, 0.2, 2.9, near ? 10 : 6, p.pointed), 0.01, 0.06, DOORS[3], { caps: 'f', sides: false, g: [0.9, 1.05] });
  G.extrude(arch(0, 2.1, 0.2, 3.1, near ? 10 : 6, p.pointed), 0, near ? 0.1 : 0.02, PAL.stone, { caps: 'f', holes: [arch(0, 1.7, 0.2, 2.9, near ? 10 : 6, p.pointed)], sides: near });
  if (near) {
    G.rect(0, 0.2, 0.065, 0.06, 2.3, mix(DOORS[3], 0x000000, 0.25));
    F.box(0, 0, 0.3, 2.6, 0.2, 0.6, PAL.stone, { skip: 'kb' });
  }
  b.sides(tw, tw, (len, side) => {
    if (side === 'k') return;
    const louvre = arch(0, 1.1, th - 3.6, 2.2, near ? 8 : 5, p.pointed);
    G.extrude(louvre, 0.01, 0.02, mix(CITY.ink, PAL.timber, 0.5), { caps: 'f', sides: false });
    G.extrude(arch(0, 1.4, th - 3.75, 2.5, near ? 8 : 5, p.pointed), 0, 0.05, PAL.stone, { caps: 'f', holes: [louvre], sides: near });
    if (near) for (let i = 0; i < 4; i++) G.rect(0, th - 3.45 + i * 0.36, 0.03, 1.0, 0.1, PAL.stone, { k: 0.8 });
    if (side === 'f' || near) clock(b, 0, th - 5.3, 0.85);
  });
  archWin(b, 0, 5.4, 0.7, 1.7, { pointed: p.pointed, cross: 0 });
  // Helm
  let top = th + 0.3;
  if (p.spire === 'onion') {
    F.lathe(0, top, -tw / 2, [[tw * 0.44, 0], [tw * 0.44, 1.2]], WHITE, { seg: 8, top: false });
    F.lathe(0, top + 1.2, -tw / 2, onion(tw * 0.46, 4.6), p.spireCol ?? CITY.copper, { seg: 10, g: [0.86, 1.05] });
    top += 5.8;
  } else {
    const sh = p.sh ?? 8.5;
    F.frust(0, top, -tw / 2, tw + 0.5, tw + 0.5, 0.12, 0.12, sh, p.spireCol ?? roofCol, { skip: 'b', g: [0.84, 1.06] });
    top += sh - 0.1;
  }
  weathercock(b, 0, top - 0.1, -tw / 2);
  return { w: Math.max(nw, tw) + 0.2, d: tw - 0.4 + nl + ar, h: top + 1.5, over: 0.6 };
}
defs.villageChurch1 = { kind: 'village', tints: [WALLS[6], WALLS[0]], far: true, make: (b) => church(b, {}) };
defs.villageChurch2 = { kind: 'village', tints: [WALLS[6], WALLS[1], WALLS[5]], far: true, make: (b) => church(b, { spire: 'onion', roofCol: PAL.roof[1], th: 12 }) };

defs.inn = {
  kind: 'village', tints: [WALLS[6], WALLS[0], WALLS[1]], far: true,
  make(b) {
    const info = house(b, { w: 13, d: 11, floors: 2, gh: 3.1, roof: 'side', style: 'timber', rh: 5.2, dormers: 3, cols: 5, doorCol: 2, doorW: 1.5, light: true, door: DOORS[3], flowers: [PAL.red, PAL.signYellow], flowersAll: true, roofCol: PAL.roof[1] });
    // Schild über dem Eingang und das goldene Mikrofon am Ausleger
    b.board(0, 0.3 + 2.62, 4.4, 'inn');
    hangIcon(b, -6.1, 5.2, 'mic', 1);
    if (b.lod === 0) {
      // Bank vor dem Haus
      b.F.box(3.9, 0.4, 0.38, 1.9, 0.07, 0.42, CITY.wood);
      for (const s of [-1, 1]) b.F.box(3.9 + s * 0.8, 0, 0.38, 0.09, 0.4, 0.36, CITY.woodDark);
      b.F.box(3.9, 0.47, 0.2, 1.9, 0.42, 0.06, CITY.wood);
    }
    return { ...info, over: 1.05 };
  },
};

defs.fireStation = {
  kind: 'village', tints: [WALLS[6], WALLS[3], WALLS[0]], far: true,
  make(b) {
    const { T, F, G } = b;
    const near = b.lod === 0;
    const w = 11;
    const d = 10;
    const h = 5.2;
    // Fahrzeughalle mit zwei roten Toren
    b.at(-1.8, 0, 0, 0, () => {
      F.rbox(0, 0, -d / 2, w + 0.1, 0.3, d + 0.1, R, PAL.stone);
      T.rbox(0, 0.3, -d / 2, w, h - 0.3, d, R, WHITE, { top: false, prof: [[0, 0], [0, 0.5], [0, h - 0.8], [0, h - 0.3]], ks: [0.9, 1, 1, 0.88] });
      b.at(0, 0, -d / 2, Math.PI / 2, () => T.extrude([[-d / 2, h], [d / 2, h], [0, h + 2.2]], -w / 2 + 0.01, w / 2 - 0.01, WHITE, { sides: false }));
      b.gable(0, h, -d / 2, w, d, 2.2, PAL.roof[3], { axis: 'x' });
      for (const s of [-1, 1]) {
        const x = s * 2.55;
        G.box(x, 0.1, 0.04, 4.1, 3.75, 0.08, PAL.frame, { skip: 'kb' });
        for (let i = 0; i < 5; i++) {
          const glass = i === 3;
          G.rect(x, 0.2 + i * 0.71, 0.085, 3.8, 0.67, glass ? mix(PAL.glass, PAL.glassDark, 0.3) : PAL.red, { g: [0.94, 1.04] });
          if (glass && near) for (let k = 1; k < 4; k++) G.rect(x - 1.9 + k * 0.95, 0.2 + i * 0.71, 0.09, 0.06, 0.67, PAL.red);
        }
      }
      b.board(0, 4.05, 3.4, 's:feuerwehr');
    });
    // Schlauchturm mit Sirene
    const tx = 5.4;
    const tw = 3.2;
    const th = 11;
    F.rbox(tx, 0, -tw / 2 - 0.6, tw + 0.1, 0.3, tw + 0.1, R, PAL.stone);
    T.rbox(tx, 0.3, -tw / 2 - 0.6, tw, th - 0.3, tw, R, WHITE, { top: false, prof: [[0, 0], [0, 0.5], [0, th - 0.8], [0, th - 0.3]], ks: [0.9, 1, 1, 0.9] });
    b.hip(tx, th, -tw / 2 - 0.6, tw, tw, 1.9, PAL.roof[3], { oe: 0.35 });
    b.at(tx, 0, -0.6, 0, () => {
      b.door(0, 1.0, 2.1, PAL.red, { y: 0.3, steps: true });
      for (let i = 0; i < 3; i++) b.win(0, 4.0 + i * 2.3, 0.7, 1.2, { cross: 1 });
    });
    if (near) {
      F.cyl(tx, th + 1.85, -tw / 2 - 0.6, 0.06, 0.06, 0.9, PAL.steel, { seg: 5 });
      F.lathe(tx, th + 2.7, -tw / 2 - 0.6, [[0.12, 0], [0.42, 0.08], [0.4, 0.2], [0.1, 0.34]], PAL.red, { seg: 10, bottom: true });
    }
    return { w: 14.6, d: 10, h: th + 3.2, over: 0.45 };
  },
};

defs.busShelter = {
  kind: 'village', far: true, fade: 1.6,
  make(b) {
    const { F, G } = b;
    const near = b.lod === 0;
    const w = 4.2;
    const d = 1.7;
    const h = 2.35;
    slab(b, 0, -d / 2 - 0.1, w + 1.4, d + 0.6, PAL.sidewalk);
    // Pfosten und Scheiben (hinten und an den Seiten), Dach leicht gewölbt
    for (const x of [-w / 2, w / 2]) {
      F.cyl(x, 0.08, -d, 0.06, 0.06, h, PAL.signGreen, { seg: 6 });
      F.cyl(x, 0.08, -0.25, 0.06, 0.06, h, PAL.signGreen, { seg: 6 });
    }
    const pane = mix(PAL.glass, 0xffffff, 0.35);
    G.box(0, 0.5, -d, w - 0.12, 1.65, 0.05, pane);
    for (const s of [-1, 1]) G.box((s * w) / 2, 0.5, -d / 2 - 0.12, 0.05, 1.65, d - 0.25, pane);
    const roof = [];
    for (let i = 0; i <= 6; i++) roof.push([-d / 2 - 0.3 + ((d + 0.6) * i) / 6 - 0, h + 0.1 + Math.sin((i / 6) * Math.PI) * 0.22]);
    const prof = [...roof, ...roof.map(([x, y]) => [x, y - 0.1]).reverse()];
    b.at(0, 0, -d / 2 - 0.1, Math.PI / 2, () => F.extrude(prof, -w / 2 - 0.25, w / 2 + 0.25, PAL.signGreen, { crease: 0.3, down: 0xf3ead8 }));
    // Bank, Fahrplan, Plakat
    F.box(0, 0.5, -d + 0.35, w - 1.2, 0.07, 0.4, CITY.wood);
    for (const s of [-1, 1]) F.box(s * (w / 2 - 1.0), 0.08, -d + 0.35, 0.07, 0.42, 0.34, PAL.darkMetal);
    if (near) {
      b.at(-w / 2 + 0.03, 0, -d / 2 - 0.12, Math.PI / 2, () => G.sign(0, 0.72, 0, 0.8, 'p:fest'));
      b.at(w / 2 - 0.03, 0, -d / 2 - 0.12, -Math.PI / 2, () => G.sign(0, 0.72, 0, 0.8, 'p:live'));
      G.box(1.2, 1.1, -d + 0.04, 0.6, 0.8, 0.03, PAL.frame);
    }
    // Haltestellenschild
    const sx = w / 2 + 0.75;
    F.cyl(sx, 0.08, -0.3, 0.045, 0.045, 2.9, PAL.steel, { seg: 6 });
    for (const s of [0, Math.PI]) b.at(sx, 0, -0.3, s, () => G.sign(0, 2.35, 0.03, 0.62, 'y:bus'));
    G.box(sx, 2.33, -0.3, 0.66, 0.66, 0.05, PAL.frame, { skip: 'fk' });
    return { w: w + 1.4, d: d + 0.6, h: 3.1 };
  },
};

defs.maypole = {
  kind: 'village', far: true, fade: 3,
  make(b) {
    const { F, G } = b;
    const near = b.lod === 0;
    const h = 15;
    F.cyl(0, 0, 0, 0.5, 0.42, 0.5, PAL.stone, { seg: 8 });
    // weiß-blau geringelter Stamm
    const n = 30;
    const prof = [];
    const cols = [];
    for (let i = 0; i <= n; i++) {
      prof.push([0.19 - 0.09 * (i / n), 0.5 + ((h - 0.5) * i) / n]);
      if (i < n) cols.push(i % 2 ? PAL.signBlue : PAL.frame);
    }
    F.lathe(0, 0, 0, prof, cols, { seg: 7 });
    // Kranz mit Bändern, darüber ein Bäumchen
    F.torus(0, h - 3.2, 0, 1.0, 0.16, CITY.leafDark, { seg: 14, tube: 5 });
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + 0.4;
      F.rod([Math.sin(a), h - 3.2, Math.cos(a)], [Math.sin(a) * 0.12, h - 1.8, Math.cos(a) * 0.12], 0.02, PAL.darkMetal, { seg: 4 });
      if (near) F.quad([Math.sin(a) * 1.0, h - 3.3, Math.cos(a) * 1.0], [Math.sin(a + 0.2) * 1.0, h - 3.3, Math.cos(a + 0.2) * 1.0], [Math.sin(a + 0.2) * 1.05, h - 4.5, Math.cos(a + 0.2) * 1.05], [Math.sin(a) * 1.05, h - 4.5, Math.cos(a) * 1.05], [PAL.red, PAL.signYellow, PAL.signBlue, PAL.frame][i]);
    }
    F.cyl(0, h, 0, 0.9, 0.02, 2.2, PAL.conifer[0], { seg: 8, bottom: true, g: [0.85, 1.1] });
    // Zunftzeichen an Querarmen
    const icons = ['bell', 'heart', 'cup', 'star', 'cone', 'mic'];
    for (let i = 0; i < 3; i++) {
      const y = 4.6 + i * 2.3;
      const l = 1.9 - i * 0.3;
      F.box(0, y, 0, l * 2, 0.09, 0.09, CITY.woodDark);
      if (near) for (const s of [-1, 1]) b.at(s * (l - 0.35), y, 0, 0, () => icon3d(b, icons[i * 2 + (s > 0 ? 1 : 0)]));
    }
    return { w: 4, d: 4, h: h + 2.2, centre: true };
  },
};


// --- Kleinstadt: Reihenhäuser mit Läden ----------------------------------------------------------------------
const TOWN = [0xffe9b8, 0xf7c9b0, 0xd8ecf5, 0xe6f2d5, 0xf4d6e0, 0xfaf7f0, 0xf2d9a0, 0xe8b89a, 0xcfe3c0];
const tints = (...i) => i.map((k) => TOWN[k]);
const ROOF = PAL.roof;
const T3 = { d: 11, terrace: true, ground: 'shop', flowers: [PAL.red, PAL.signYellow, PAL.blossom[0]] };
const shopHouse = (name, t, p, extra) => {
  addHouse(name, 'shop', t, { ...T3, ...p }, extra);
  defs[name].shop = p.shop;
};
shopHouse('shopBakery', tints(0, 6, 5), { shop: 'bakery', w: 7.5, floors: 3, roof: 'side', dormers: 2, roofCol: ROOF[0], door: DOORS[3] });
shopHouse('shopIce', tints(4, 1, 5), { shop: 'ice', w: 7, floors: 3, roof: 'front', roofCol: ROOF[1], door: DOORS[1], gableWin: 'round', doorLeft: true });
shopHouse('shopKiosk', tints(3, 8, 0), { shop: 'kiosk', w: 6, floors: 2, roof: 'flat', door: DOORS[0], flowers: null });
shopHouse('shopDoner', tints(1, 7, 0), { shop: 'doner', w: 7, floors: 3, roof: 'mansard', dormers: 2, roofCol: ROOF[3], door: DOORS[1], doorLeft: true });
shopHouse('shopPharmacy', tints(5, 3, 2), { shop: 'pharmacy', w: 8, floors: 3, roof: 'side', dormers: 1, roofCol: ROOF[2], door: DOORS[0], shutter: PAL.door[0] });
shopHouse('shopBooks', tints(5, 0, 6), { shop: 'books', w: 7, floors: 3, roof: 'front', style: 'timber', jetty: 0.2, roofCol: ROOF[1], door: DOORS[2], doorLeft: true });
shopHouse('shopBank', tints(5, 2, 0), { shop: 'bank', w: 10, floors: 3, roof: 'mansard', dormers: 3, roofCol: ROOF[3], door: DOORS[2], flowers: null, corners: PAL.stone }, (b) => {
  // Geldautomat neben dem Schaufenster
  if (b.lod === 0) {
    b.G.box(-4.3, 1.0, 0.05, 0.7, 1.1, 0.1, PAL.steel, { skip: 'k' });
    b.G.sign(-4.3, 1.45, 0.105, 0.5, 'y:euro');
  }
});
shopHouse('shopFlowers', tints(3, 4, 0), { shop: 'flowers', w: 6.5, floors: 2, roof: 'front', roofCol: ROOF[0], door: DOORS[0], doorLeft: true, flowersAll: true }, (b) => {
  // Blumenkübel vor dem Laden
  if (b.lod === 0) {
    const cols = [PAL.red, PAL.signYellow, 0xf4a6c0, PAL.blossom[1], PAL.orange];
    for (let i = 0; i < 4; i++) {
      const x = 0.4 + i * 0.62;
      b.F.cyl(x, 0, 0.75, 0.2, 0.26, 0.42, i % 2 ? CITY.woodDark : PAL.darkMetal, { seg: 7 });
      for (let k = 0; k < 4; k++) b.F.ball(x + Math.sin(k * 1.6) * 0.14, 0.52 + (k % 2) * 0.1, 0.75 + Math.cos(k * 1.6) * 0.14, 0.13, k === 3 ? CITY.leaf : cols[(i + k) % 5], { ws: 6, hs: 3 });
    }
  }
});
shopHouse('shopVeg', tints(6, 3, 5), { shop: 'veg', w: 7, floors: 3, roof: 'side', dormers: 2, roofCol: ROOF[4], door: DOORS[0] }, (b) => {
  // Obstkisten unter der Markise
  if (b.lod === 0) {
    const cols = [PAL.red, PAL.orange, PAL.signYellow, CITY.leaf];
    for (let i = 0; i < 4; i++) {
      const x = -2.6 + i * 1.02;
      b.F.frust(x, 0, 0.62, 0.86, 0.5, 0.92, 0.6, 0.62, CITY.wood, { skip: 'b' });
      for (let k = 0; k < 6; k++) b.F.ball(x - 0.3 + (k % 3) * 0.3, 0.66, 0.5 + Math.floor(k / 3) * 0.26, 0.13, cols[i], { ws: 6, hs: 3 });
    }
  }
});
shopHouse('shopCafe', tints(0, 4, 2), { shop: 'cafe', w: 8, floors: 3, roof: 'mansard', dormers: 2, roofCol: ROOF[2], door: DOORS[3], doorLeft: true });
shopHouse('shopHair', tints(4, 2, 5), { shop: 'hair', w: 6.5, floors: 3, roof: 'side', dormers: 1, roofCol: ROOF[1], door: DOORS[2] });
shopHouse('shopToys', tints(0, 3, 4), { shop: 'toys', w: 7.5, floors: 2, roof: 'front', style: 'timber', timberFrom: 1, jetty: 0.2, roofCol: ROOF[0], door: DOORS[1] });
shopHouse('shopElectro', tints(2, 5, 8), { shop: 'electro', w: 8, floors: 4, roof: 'flat', door: DOORS[2], flowers: null, cross: 1 });
shopHouse('shopDriving', tints(5, 6, 1), { shop: 'driving', w: 6.5, floors: 3, roof: 'side', dormers: 2, roofCol: ROOF[0], door: DOORS[2], doorLeft: true });
shopHouse('shopPizza', tints(1, 0, 3), { shop: 'pizza', w: 7, floors: 3, roof: 'side', dormers: 1, roofCol: ROOF[1], door: DOORS[0], shutter: PAL.signGreen });
shopHouse('shopTravel', tints(2, 4, 5), { shop: 'travel', w: 7, floors: 4, roof: 'mansard', dormers: 2, roofCol: ROOF[3], door: DOORS[2], doorLeft: true });

// Reihenhäuser ohne Laden
const TH = { d: 11, terrace: true, flowers: [PAL.red, PAL.blossom[0]] };
addHouse('townHouse1', 'town', tints(0, 2, 4, 7), { ...TH, w: 7, floors: 3, roof: 'side', dormers: 2, roofCol: ROOF[0], light: true, door: DOORS[0] });
addHouse('townHouse2', 'town', tints(5, 1, 3, 6), { ...TH, w: 8, floors: 4, roof: 'mansard', dormers: 2, roofCol: ROOF[3], light: true, door: DOORS[1], shutter: PAL.door[2] });
addHouse('townHouse3', 'town', tints(3, 0, 8, 5), { ...TH, w: 6.5, floors: 3, roof: 'front', roofCol: ROOF[1], door: DOORS[2], gableWin: 'round' });
addHouse('townHouse4', 'town', tints(6, 4, 2, 0), { ...TH, w: 7.5, floors: 2, roof: 'side', dormers: 2, roofCol: ROOF[4], door: DOORS[3], shutter: PAL.door[1], flowersAll: true });

// Altstadt: schmale Giebelhäuser, einzeln und als fertige Zeile
const OLD = [
  { w: 5.6, floors: 3, style: 'timber', timberFrom: 1, jetty: 0.2, roofCol: ROOF[1], door: DOORS[3], wall: 0xffffff },
  { w: 6.4, floors: 4, roofCol: ROOF[0], door: DOORS[1], gableWin: 'round', wall: 0xffe8c8, shutter: PAL.door[1] },
  { w: 5.2, floors: 3, style: 'timber', timberFrom: 0, roofCol: ROOF[4], door: DOORS[0], wall: 0xfff6e0 },
  { w: 6.6, floors: 3, roofCol: ROOF[1], door: DOORS[2], ground: 'shop', shop: 'cafe', wall: 0xe4f0ff, awning: false },
  { w: 5.8, floors: 4, style: 'timber', timberFrom: 1, jetty: 0.2, roofCol: ROOF[0], door: DOORS[3], wall: 0xffeedd },
];
OLD.forEach((p, k) => addHouse('oldTown' + (k + 1), 'town', tints(5, 0, 6, 4), { d: 10, terrace: true, roof: 'front', flowers: [PAL.red, PAL.signYellow], fh: 2.5, ...p, wall: 0xffffff }));
defs.oldTownRow = {
  kind: 'town', tints: tints(5, 0, 6), far: true,
  make(b) {
    let x = -OLD.reduce((a, p) => a + p.w, 0) / 2;
    let h = 0;
    for (const p of OLD) {
      b.at(x + p.w / 2, 0, 0, 0, () => {
        h = Math.max(h, house(b, { d: 10, terrace: true, roof: 'front', flowers: [PAL.red, PAL.signYellow], fh: 2.5, ...p }).h);
      });
      x += p.w;
    }
    return { w: 2 * x, d: 10, h, over: 1 };
  },
};

// --- Kleinstadt: besondere Häuser ----------------------------------------------------------------------------
defs.townHall = {
  kind: 'town', tints: tints(5, 0, 1, 6), far: true,
  make(b) {
    const { T, F, G } = b;
    const near = b.lod === 0;
    const w = 16;
    const d = 12;
    const gh = 4.2;
    const H = 0.3 + gh + 2 * 3.1;
    const rh = 4.6;
    F.rbox(0, 0, -d / 2, w + 0.1, 0.3, d + 0.1, R, PAL.stone);
    // Laubengang: Bogenwand vorne, das Erdgeschoss dahinter springt zurück
    const n = near ? 10 : 6;
    const holes = [-5, 0, 5].map((x) => arch(x, 3.4, 0.3, 3.6, n));
    T.extrude([[-w / 2, 0.3], [w / 2, 0.3], [w / 2, 0.3 + gh], [-w / 2, 0.3 + gh]], -0.5, 0, 0xffffff, { holes, g: [0.9, 1] });
    T.rbox(0, 0.3, -d / 2 - 1.3, w, gh, d - 2.6, R, 0xffffff, { top: false, ks: [0.72, 0.8], prof: [[0, 0], [0, gh]] });
    for (const s of [-1, 1]) T.box(s * (w / 2 - 0.25), 0.3, -1.3, 0.5, gh, 2.6, 0xffffff, { skip: 'tb' });
    b.at(0, 0, -2.6, 0, () => {
      b.door(0, 1.8, 2.6, DOORS[3], { y: 0.3, light: true });
      for (const x of [-5, 5]) b.win(x, 1.3, 1.6, 1.8, { flat: !near });
    });
    // Obergeschosse
    T.rbox(0, 0.3 + gh, -d / 2, w, H - 0.3 - gh, d, R, 0xffffff, { top: false, bottom: true, prof: [[0, 0], [0, 0.4], [0, H - gh - 0.9], [0, H - 0.3 - gh]], ks: [0.9, 1, 1, 0.88] });
    G.rect(0, 0.3 + gh - 0.1, 0.012, w - 0.3, 0.24, PAL.stone);
    for (let f = 0; f < 2; f++) {
      for (let i = 0; i < 5; i++) {
        const x = -6 + i * 3;
        b.win(x, 0.3 + gh + 0.8 + f * 3.1, 1.3, 1.8, { flowers: f === 0 && i !== 2 ? PAL.red : 0, cross: 2 });
      }
    }
    b.sides(w, d, (len) => {
      for (let f = 0; f < 2; f++) for (let i = 0; i < 3; i++) b.win(-3.6 + i * 3.6, 0.3 + gh + 0.8 + f * 3.1, 1.3, 1.8, { flat: !near });
    }, 'rl');
    b.board(0, 0.3 + gh + 0.02, 3.0, 's:rathaus');
    // Balkon mit Fahnen über dem mittleren Bogen
    F.box(0, 0.3 + gh + 0.5, 0.45, 3.6, 0.16, 0.9, PAL.stone);
    for (let i = 0; i <= 6; i++) F.cyl(-1.7 + (i * 3.4) / 6, 0.3 + gh + 0.66, 0.82, 0.05, 0.05, 0.8, PAL.frame, { seg: 5 });
    F.box(0, 0.3 + gh + 1.46, 0.82, 3.6, 0.08, 0.12, PAL.frame);
    // Walmdach, Zwerchgiebel mit Uhr, Dachreiter
    b.hip(0, H, -d / 2, w, d, rh, ROOF[1], { oe: 0.5 });
    T.extrude([[-2.6, H - 0.1], [2.6, H - 0.1], [2.6, H + 1.2], [0, H + 4.2], [-2.6, H + 1.2]], -3, 0.02, 0xffffff, { sides: false });
    b.gable(0, H + 1.2, -1.5, 5.2, 3.1, 3.0, ROOF[1], { axis: 'z', oe: 0.3, og: 0.25 });
    clock(b, 0, H + 1.5, 0.95);
    const ty = H + rh - 0.4;
    F.rbox(0, ty, -d / 2, 1.9, 2.4, 1.9, 0.2, PAL.wall[6], { ks: [0.9, 1], prof: [[0, 0], [0, 2.4]] });
    if (near) b.sides(1.9, 1.9, () => archWin(b, 0, ty + 0.7, 0.7, 1.4, { cross: 0, fw: 0.08 }), 'frl');
    F.lathe(0, ty + 2.4, -d / 2, onion(1.05, 2.6), CITY.copper, { seg: 8, g: [0.86, 1.05] });
    weathercock(b, 0, ty + 4.9, -d / 2);
    if (near) for (const s of [-1, 1]) b.xf([s * 1.5, 0.3 + gh + 0.7, 0.85], [0.5, 0, 0], 1, () => flag(b, 0, 0, 0, 2.6, s > 0 ? FLAG.pink : FLAG.mint, 1.2));
    return { w, d, h: ty + 6.6, over: 1 };
  },
};

defs.marketHall = {
  kind: 'town', tints: [PAL.brick, CITY.brickYellow, 0xd98a6a], far: true,
  make(b) {
    const { T, F, G } = b;
    const near = b.lod === 0;
    const w = 26;
    const d = 14;
    const h = 6.2;
    const rh = 3.6;
    F.rbox(0, 0, -d / 2, w + 0.1, 0.4, d + 0.1, R, PAL.stone);
    T.rbox(0, 0.4, -d / 2, w, h - 0.4, d, R, 0xffffff, { top: false, prof: [[0, 0], [0, 0.6], [0, h - 1], [0, h - 0.4]], ks: [0.9, 1, 1, 0.88] });
    b.at(0, 0, -d / 2, Math.PI / 2, () => T.extrude([[-d / 2, h], [d / 2, h], [0, h + rh]], -w / 2 + 0.01, w / 2 - 0.01, 0xffffff, { sides: false }));
    b.gable(0, h, -d / 2, w, d, rh, CITY.slate, { axis: 'x' });
    // Glaslaterne auf dem First
    G.box(0, h + rh - 0.5, -d / 2, w * 0.7, 1.3, 2.4, mix(PAL.glass, 0xffffff, 0.2), { skip: 'b', g: [0.9, 1.1] });
    b.gable(0, h + rh + 0.8, -d / 2, w * 0.7, 2.4, 0.7, CITY.slate, { axis: 'x', oe: 0.25, og: 0.25, t: 0.14 });
    // Mittelbau mit Portal, links und rechts je zwei große Bogenfenster
    T.extrude([[-3.4, 0.4], [3.4, 0.4], [3.4, h + 0.4], [0, h + 3.2], [-3.4, h + 0.4]], -1, 0.35, 0xffffff, { g: [0.92, 1] });
    b.gable(0, h + 0.4, -0.3, 6.8, 1.6, 2.8, CITY.slate, { axis: 'z', oe: 0.3, og: 0.25 });
    b.at(0, 0, 0.35, 0, () => {
      const door = arch(0, 3.2, 0.4, 4.4, near ? 12 : 6);
      G.extrude(door, 0.01, 0.02, mix(PAL.glass, PAL.glassDark, 0.5), { caps: 'f', sides: false, g: [1.1, 0.8] });
      G.extrude(arch(0, 3.8, 0.4, 4.7, near ? 12 : 6), 0, 0.1, CITY.sand, { caps: 'f', holes: [door], sides: near });
      G.rect(0, 0.4, 0.03, 2.2, 2.5, DOORS[0], { g: [0.92, 1.04] });
      if (near) G.rect(0, 0.4, 0.04, 0.07, 2.5, PAL.frame);
      b.board(0, 5.25, 3.3, 's:markthalle');
    });
    for (const x of [-10, -6.2, 6.2, 10]) archWin(b, x, 1.4, 2.5, 3.9, { frame: CITY.sand });
    b.sides(w, d, (len) => {
      for (const x of [-3.6, 0, 3.6]) archWin(b, x, 1.4, 2.3, 3.7, { frame: CITY.sand });
    }, 'rl');
    for (const y of [0.4 + 0.75, h - 0.5]) b.sides(w, d, (len) => G.rect(0, y, 0.012, len - R, 0.16, CITY.sand), 'frl');
    return { w, d, h: h + rh + 2, over: 0.5 };
  },
};

defs.station = {
  kind: 'town', tints: tints(0, 6, 5, 1), far: true,
  make(b) {
    const { T, F, G } = b;
    const near = b.lod === 0;
    const cw = 12;
    const d = 11;
    const ch = 8.6;
    const ww = 8.5;
    const wh = 5;
    // Seitenflügel
    for (const s of [-1, 1]) {
      const x = s * (cw / 2 + ww / 2);
      F.rbox(x, 0, -d / 2, ww + 0.1, 0.4, d - 0.9, R, PAL.stone);
      T.rbox(x, 0.4, -d / 2, ww, wh - 0.4, d - 1, R, 0xffffff, { top: false, prof: [[0, 0], [0, 0.6], [0, wh - 0.9], [0, wh - 0.4]], ks: [0.9, 1, 1, 0.88] });
      b.hip(x, wh, -d / 2, ww, d - 1, 2.6, ROOF[1], { oe: 0.45 });
      b.at(x, 0, -0.5, 0, () => {
        for (const k of [-1, 0, 1]) archWin(b, k * 2.6, 1.3, 1.4, 2.7, { frame: PAL.stone });
      });
      b.at(x + (s * ww) / 2, 0, -d / 2, (s * Math.PI) / 2, () => {
        for (const k of [-1, 1]) archWin(b, k * 2.2, 1.3, 1.4, 2.7, { frame: PAL.stone });
      });
    }
    // Mittelbau mit Uhrengiebel und drei Bogentüren
    F.rbox(0, 0, -d / 2, cw + 0.1, 0.4, d + 0.1, R, PAL.stone);
    T.rbox(0, 0.4, -d / 2, cw, ch - 0.4, d, R, 0xffffff, { top: false, prof: [[0, 0], [0, 0.6], [0, ch - 0.9], [0, ch - 0.4]], ks: [0.9, 1, 1, 0.88] });
    b.hip(0, ch, -d / 2, cw, d, 3.4, ROOF[1], { oe: 0.5 });
    T.extrude([[-2.8, ch - 0.1], [2.8, ch - 0.1], [2.8, ch + 1], [0, ch + 3.4], [-2.8, ch + 1]], -2.5, 0.02, 0xffffff, { sides: false });
    b.gable(0, ch + 1, -1.2, 5.6, 2.6, 2.4, ROOF[1], { axis: 'z', oe: 0.3, og: 0.25 });
    clock(b, 0, ch + 0.9, 1.0);
    for (const k of [-1, 0, 1]) {
      const door = arch(k * 3.5, 2.2, 0.4, 3.6, near ? 10 : 6);
      G.extrude(door, 0.01, 0.02, mix(PAL.glass, PAL.glassDark, 0.45), { caps: 'f', sides: false, g: [1.1, 0.78] });
      G.extrude(arch(k * 3.5, 2.7, 0.4, 3.85, near ? 10 : 6), 0, 0.09, PAL.stone, { caps: 'f', holes: [door], sides: near });
      if (near) {
        G.rect(k * 3.5, 0.4, 0.03, 0.07, 2.4, PAL.frame);
        G.rect(k * 3.5, 2.7, 0.03, 2.1, 0.07, PAL.frame);
      }
      b.win(k * 3.5, 5.6, 1.4, 1.9, { cross: 2 });
    }
    b.board(0, 4.45, 3.4, 's:bahnhof');
    // Vordach auf schlanken Stützen
    F.box(0, 3.95, 1.3, cw - 0.6, 0.16, 2.6, PAL.signGreen, { g: [1, 1] });
    for (const x of [-5.2, -1.75, 1.75, 5.2]) F.cyl(x, 0, 2.4, 0.07, 0.07, 3.95, PAL.signGreen, { seg: 6 });
    if (near) {
      F.box(0, 0, 0.9, cw - 1, 0.14, 1.8, PAL.stone, { skip: 'b' });
      flag(b, cw / 2 + ww + 1.2, 0, -1, 7, FLAG.apricot, 1.6);
    }
    return { w: cw + 2 * ww + 3, d, h: ch + 4.4, over: 2.7 };
  },
};

defs.school = {
  kind: 'town', tints: tints(0, 1, 5, 2), far: true,
  make(b) {
    const { T, F, G } = b;
    const near = b.lod === 0;
    const w = 22;
    const d = 12;
    const H = 0.5 + 3 * 3.3;
    F.rbox(0, 0, -d / 2, w + 0.1, 0.5, d + 0.1, R, PAL.stone);
    T.rbox(0, 0.5, -d / 2, w, H - 0.5, d, R, 0xffffff, { top: false, prof: [[0, 0], [0, 0.6], [0, H - 1], [0, H - 0.5]], ks: [0.9, 1, 1, 0.88] });
    b.hip(0, H, -d / 2, w, d, 3.6, ROOF[0], { oe: 0.5 });
    // Mittelrisalit mit Eingang, Schild und Uhr
    T.extrude([[-3, 0.5], [3, 0.5], [3, H + 0.3], [0, H + 2.6], [-3, H + 0.3]], -1.4, 0.4, 0xffffff, { g: [0.92, 1] });
    b.gable(0, H + 0.3, -0.5, 6, 1.9, 2.3, ROOF[0], { axis: 'z', oe: 0.3, og: 0.25 });
    b.at(0, 0, 0.4, 0, () => {
      b.door(0, 2.0, 2.6, DOORS[2], { y: 0.5, light: true, steps: true, glass: true });
      b.board(0, 3.75, 2.6, 's:schule');
      b.win(0, 4.9, 1.6, 1.8, {});
      clock(b, 0, H - 0.6, 0.85);
    });
    for (let f = 0; f < 3; f++) {
      for (const s of [-1, 1]) for (let i = 0; i < 3; i++) b.win(s * (4.6 + i * 2.6), 1.5 + f * 3.3, 1.9, 1.9, { cross: 2, fw: 0.1 });
    }
    b.sides(w, d, (len) => {
      for (let f = 0; f < 3; f++) for (const x of [-2.8, 2.8]) b.win(x, 1.5 + f * 3.3, 1.9, 1.9, { flat: !near });
    }, 'rl');
    if (near) flag(b, -w / 2 - 1.2, 0, -1, 8, FLAG.lilac, 1.6);
    return { w: w + 2.6, d, h: H + 4.6, over: 0.9 };
  },
};

defs.cinema = {
  kind: 'town', tints: tints(1, 4, 0, 2), far: true,
  make(b) {
    const { T, F, G } = b;
    const near = b.lod === 0;
    const w = 12;
    const d = 18;
    const h = 8.5;
    F.rbox(0, 0, -d / 2, w + 0.1, 0.3, d + 0.1, R, PAL.stone);
    T.rbox(0, 0.3, -d / 2, w, h - 0.3, d, R, 0xffffff, { top: false, prof: [[0, 0], [0, 0.6], [0, h - 0.3]], ks: [0.9, 1, 1] });
    F.rbox(0, h, -d / 2, w + 0.2, 0.25, d + 0.2, R + 0.1, PAL.concrete);
    // getreppter Giebel mit Stern
    T.extrude([[-6, h], [6, h], [6, h + 0.8], [3.4, h + 0.8], [3.4, h + 1.8], [1.6, h + 1.8], [1.6, h + 2.7], [-1.6, h + 2.7], [-1.6, h + 1.8], [-3.4, h + 1.8], [-3.4, h + 0.8], [-6, h + 0.8]], -0.7, 0, 0xffffff, { g: [0.95, 1.03] });
    b.at(0, h + 2.25, 0.02, 0, () => icon3d(b, 'star'));
    // senkrechte Lichtbänder
    for (const x of [-4.4, -2.6, 2.6, 4.4]) G.rect(x, 4.9, 0.014, 0.5, h - 4.2, CITY.gold, { g: [1.05, 0.9] });
    b.board(0, 5.6, 4.4, 's:kino');
    // Vordach mit Lichterkette und Schriftzug
    F.rbox(0, 3.5, 1.0, w - 1.2, 0.7, 2.6, 0.5, PAL.red, { bottom: true, seg: 3 });
    b.at(0, 0, 2.3, 0, () => b.G.sign(0, 3.6, 0.01, 5.2, 'cinema'));
    if (near) for (let i = 0; i < 14; i++) G.ball(-4.9 + i * 0.754, 3.48, 2.2, 0.07, 0xffe9a8, { ws: 5, hs: 3 });
    // Glastüren und Plakatkästen
    b.door(-0.95, 1.7, 2.5, DOORS[1], { y: 0.3, glass: true });
    b.door(0.95, 1.7, 2.5, DOORS[1], { y: 0.3, glass: true });
    for (const [x, k] of [[-4.2, 'p:live'], [4.2, 'p:fest']]) {
      G.box(x, 0.95, 0.04, 1.3, 1.9, 0.08, CITY.ink, { skip: 'k' });
      G.sign(x, 1.02, 0.085, 1.18, k);
    }
    if (near) F.box(0, 0, 1.2, 5, 0.12, 2.4, PAL.red, { skip: 'b', k: 0.9 });
    return { w, d, h: h + 2.8, over: 2.4 };
  },
};

defs.hotel = {
  kind: 'town', tints: tints(5, 0, 4, 2), far: true,
  make(b) {
    const { F, G } = b;
    const near = b.lod === 0;
    const info = house(b, { w: 14, d: 13, floors: 5, gh: 3.6, roof: 'mansard', dormers: 4, cols: 5, roofCol: ROOF[3], doorCol: 2, doorW: 2.0, doorGlass: true, light: true, lamp: false, door: DOORS[2], flowers: [PAL.red], corners: PAL.stone, sideWin: true, chimney: false });
    const H = info.eaves;
    // Vordach über dem Eingang, Schild, Kübelbäumchen
    F.rbox(0, 3.25, 1.0, 4.4, 0.3, 2.2, 0.35, PAL.red, { bottom: true });
    for (const s of [-1, 1]) {
      F.cyl(s * 1.9, 0, 1.9, 0.05, 0.05, 3.25, CITY.gold, { seg: 6 });
      if (near) {
        F.cyl(s * 2.9, 0, 0.75, 0.3, 0.36, 0.55, PAL.darkMetal, { seg: 8 });
        F.cyl(s * 2.9, 0.55, 0.75, 0.05, 0.05, 0.8, PAL.trunk, { seg: 5 });
        F.ball(s * 2.9, 1.7, 0.75, 0.5, CITY.leaf, { ws: 8, hs: 5 });
      }
    }
    b.board(0, 3.75, 5.2, 'hotel');
    // Balkone in der Mittelachse
    for (let f = 1; f < 4; f++) {
      const y = 0.3 + 3.6 + f * 2.6 - 0.1;
      F.box(0, y, 0.4, 2.6, 0.12, 0.8, PAL.stone);
      G.box(0, y + 0.12, 0.76, 2.6, 0.85, 0.06, PAL.darkMetal, { skip: 'b' });
      for (const s of [-1, 1]) G.box(s * 1.27, y + 0.12, 0.4, 0.06, 0.85, 0.72, PAL.darkMetal, { skip: 'b' });
    }
    // Dachschrift und Fahnen
    b.at(0, 0, -0.9, 0, () => {
      for (const s of [-1, 1]) F.cyl(s * 2.2, H + 2.5, 0, 0.05, 0.05, 1.0, PAL.darkMetal, { seg: 5 });
      G.box(0, H + 3.45, 0, 5.4, 1.4, 0.12, CITY.ink, { skip: 'f' });
      G.sign(0, H + 3.5, 0.065, 5.2, 's:hotel');
    });
    if (near) for (const s of [-1, 1]) b.xf([s * 5, 3.9, 0.1], [0.6, 0, 0], 1, () => flag(b, 0, 0, 0, 2.4, s > 0 ? FLAG.pink : FLAG.mint, 1.1));
    return { ...info, h: H + 5, over: 2.2 };
  },
};

defs.supermarket = {
  kind: 'town', tints: tints(5, 0, 2), far: true,
  make(b) {
    const { T, F, G } = b;
    const near = b.lod === 0;
    const w = 34;
    const pd = 18; // Parkplatz vor der Halle
    const hd = 20;
    const h = 6;
    // Parkplatz: Asphaltplatte, Buchten, Laternen
    slab(b, 0, -pd / 2, w, pd, PAL.asphaltTown);
    const line = (x0, z0, x1, z1) => G.quad([x0, 0.085, z1], [x1, 0.085, z1], [x1, 0.085, z0], [x0, 0.085, z0], PAL.marking);
    for (const z of [-1.2, -11.8]) {
      for (let i = 0; i <= 10; i++) line(-13.56 + i * 2.7, z - 5, -13.44 + i * 2.7, z);
    }
    for (const x of [-9, 9]) {
      F.cyl(x, 0.08, -9, 0.09, 0.07, 6, PAL.steel, { seg: 6 });
      F.box(x, 6.05, -9, 1.7, 0.1, 0.34, PAL.darkMetal);
      if (near) for (const s of [-1, 1]) G.box(x + s * 0.6, 6.0, -9, 0.42, 0.05, 0.26, 0xffe9a8);
    }
    // Einkaufswagen-Unterstand
    b.at(15, 0, -9.4, 0, () => {
      for (const [x, z] of [[-1.1, -2.2], [1.1, -2.2], [-1.1, 2.2], [1.1, 2.2]]) F.cyl(x, 0.08, z, 0.05, 0.05, 2.1, PAL.steel, { seg: 5 });
      F.rbox(0, 2.15, 0, 2.6, 0.12, 5, 0.3, PAL.awning[1], { bottom: true });
      if (near) for (let i = 0; i < 5; i++) {
        F.box(0, 0.5, -1.6 + i * 0.5, 0.6, 0.5, 0.42, PAL.steel, { g: [0.9, 1.05] });
        G.box(0, 0.98, -1.4 + i * 0.5, 0.62, 0.06, 0.06, PAL.red);
      }
    });
    // Halle mit Farbband, Glaseingang und Schild
    b.at(0, 0, -pd, 0, () => {
      F.rbox(0, 0, -hd / 2, w + 0.1, 0.3, hd + 0.1, R, PAL.stone);
      T.rbox(0, 0.3, -hd / 2, w, h - 0.3, hd, R, 0xffffff, { top: false, prof: [[0, 0], [0, 0.6], [0, h - 0.3]], ks: [0.9, 1, 1] });
      F.rbox(0, h, -hd / 2, w + 0.3, 0.3, hd + 0.3, R + 0.1, PAL.concrete);
      b.sides(w, hd, (len) => G.rect(0, h - 1.5, 0.012, len - R, 1.0, PAL.awning[1]), 'frl');
      // Eingang
      F.rbox(0, 3.3, 1.3, 9, 0.3, 2.9, 0.4, PAL.awning[1], { bottom: true });
      for (const s of [-1, 1]) F.cyl(s * 4.1, 0.08, 2.5, 0.08, 0.08, 3.25, PAL.steel, { seg: 6 });
      b.win(0, 0.4, 7.6, 2.7, { cross: 0, fw: 0.12, sill: false });
      if (near) for (const x of [-1.9, 0, 1.9]) G.rect(x, 0.4, 0.04, 0.1, 2.7, PAL.frame);
      b.board(0, 3.9, 9, 'market');
      for (const x of [-12.5, -9, 9, 12.5]) b.win(x, 1.6, 2.4, 1.3, { cross: 1 });
    });
    return { w, d: pd + hd, h: h + 0.4 };
  },
};

defs.chargePark = {
  kind: 'town', far: true, tints: tints(5),
  make(b) {
    const { T, F, G } = b;
    const near = b.lod === 0;
    const w = 22;
    const d = 16;
    slab(b, 0, -d / 2, w, d, PAL.asphaltTown);
    // das alte Tankstellendach, frisch gestrichen
    const ch = 4.7;
    F.rbox(0, ch, -6, 15, 0.7, 8.6, 0.5, PAL.frame, { bottom: true });
    G.rect(0, ch + 0.08, -6 + 4.32, 14.4, 0.54, PAL.signGreen);
    b.at(0, 0, -6 + 4.33, 0, () => G.sign(0, ch + 0.1, 0, 3.4, 's:ladepark'));
    for (const x of [-5, 5]) F.rbox(x, 0.08, -6, 0.55, ch, 0.55, 0.16, PAL.frame, { top: false });
    // Ladesäulen auf zwei Inseln
    for (const x of [-5, 5]) {
      F.rbox(x, 0.08, -6, 1.1, 0.16, 6.4, 0.3, PAL.curb);
      for (const z of [-8, -4]) {
        b.at(x, 0.24, z, x < 0 ? Math.PI / 2 : -Math.PI / 2, () => {
          F.rbox(0, 0, 0, 0.5, 1.75, 0.34, 0.1, PAL.frame, { ks: [0.9, 1], prof: [[0, 0], [0, 1.75]] });
          G.rect(0, 1.0, 0.176, 0.34, 0.5, CITY.ink);
          G.sign(0, 1.08, 0.18, 0.3, 'y:charge');
          G.rect(0, 0.3, 0.176, 0.5, 0.14, PAL.signGreen);
          if (near) {
            F.rod([0.26, 1.2, 0], [0.42, 0.75, 0.1], 0.025, CITY.ink, { seg: 5 });
            F.rod([0.42, 0.75, 0.1], [0.3, 0.42, 0.05], 0.025, CITY.ink, { seg: 5 });
          }
        });
      }
    }
    // Shop dahinter
    b.at(0, 0, -11.2, 0, () => {
      T.rbox(0, 0.08, -2.2, 12, 3.4, 4.4, R, 0xffffff, { top: false, prof: [[0, 0], [0, 3.4]], ks: [0.9, 1] });
      F.rbox(0, 3.48, -2.2, 12.4, 0.3, 4.8, R + 0.1, PAL.signGreen);
      b.win(-2.6, 0.5, 5.2, 2.2, { cross: 0, sill: false });
      b.door(3.4, 1.4, 2.3, PAL.signGreen, { y: 0.08, glass: true });
      b.board(-2.6, 2.86, 3.0, 's:cafe');
    });
    // Preismast: heute zeigt er Stecker statt Zahlen
    F.rbox(-9.4, 0.08, -1.4, 1.5, 5.4, 0.4, 0.15, PAL.frame, { ks: [0.9, 1], prof: [[0, 0], [0, 5.4]] });
    for (const s of [0, Math.PI]) {
      b.at(-9.4, 0, -1.4, s, () => {
        G.sign(0, 4.1, 0.205, 1.1, 'y:charge');
        G.rect(0, 2.9, 0.205, 1.1, 0.9, PAL.signGreen);
        G.sign(0, 1.7, 0.205, 1.0, 'y:live');
      });
    }
    return { w, d, h: ch + 0.8 };
  },
};

defs.parkingGarage = {
  kind: 'town', tints: tints(5, 2, 3, 0), far: true,
  make(b) {
    const { T, F, G } = b;
    const near = b.lod === 0;
    const w = 28;
    const d = 18;
    const fh = 3.0;
    const n = 4;
    // dunkles Inneres, davor je Deck eine helle Brüstung
    F.box(0, 0, -d / 2, w - 0.8, n * fh, d - 0.8, mix(CITY.ink, PAL.glassDark, 0.4), { skip: 'b' });
    for (let i = 0; i <= n; i++) {
      const y = i * fh + (i === 0 ? 0 : -0.25);
      T.rbox(0, y, -d / 2, w, i === 0 ? 0.5 : 1.25, d, 0.3, 0xffffff, { bottom: true, ks: [0.86, 1], prof: [[0, 0], [0, i === 0 ? 0.5 : 1.25]] });
    }
    for (let i = -3; i <= 3; i++) F.box(i * 4.2, 0, -0.25, 0.5, n * fh, 0.5, PAL.concrete, { skip: 'tb' });
    // Treppenturm mit Glasband und Schild
    const tx = -w / 2 + 2;
    T.rbox(tx, 0, -2, 4, n * fh + 2.2, 4.4, 0.3, 0xffffff, { ks: [0.9, 1], prof: [[0, 0], [0, n * fh + 2.2]] });
    b.at(tx, 0, 0.2, 0, () => {
      G.rect(0, 0.4, 0.014, 1.3, n * fh + 1.2, mix(PAL.glass, PAL.glassDark, 0.3), { g: [1.1, 0.8] });
      if (near) for (let i = 1; i <= n; i++) G.rect(0, i * fh - 0.1, 0.02, 1.3, 0.12, PAL.frame);
    });
    b.at(4, 0, 0.02, 0, () => {
      b.board(0, n * fh - 0.05, 5.6, 's:parkhaus');
    });
    G.box(w / 2 - 3, n * fh + 0.2, -1.5, 2.4, 2.4, 0.2, PAL.signBlue);
    for (const s of [0, Math.PI]) b.at(w / 2 - 3, 0, -1.5, s, () => G.sign(0, n * fh + 0.3, 0.105, 2.2, 'y:park'));
    F.cyl(w / 2 - 3, n * fh, -1.5, 0.08, 0.08, 0.3, PAL.steel, { seg: 5 });
    // Einfahrt mit Schranke
    b.at(8, 0, 0.26, 0, () => {
      G.rect(0, 0, 0, 5.2, 2.5, mix(CITY.ink, PAL.glassDark, 0.5));
      if (near) {
        F.cyl(-2.3, 0, 0.5, 0.1, 0.1, 1.0, PAL.signYellow, { seg: 6 });
        const cols = [PAL.red, PAL.frame, PAL.red, PAL.frame, PAL.red, PAL.frame];
        b.xf([-2.3, 0.95, 0.5], [0, 0, -Math.PI / 2 + 0.06], 1, () => F.lathe(0, 0, 0, cols.map((c, i) => [0.05, i * 0.7]).concat([[0.05, 4.2]]), cols, { seg: 5 }));
      }
    });
    return { w, d, h: n * fh + 2.6 };
  },
};

// --- Großstadt: Wohnblock, Bürohaus, Kaufhaus, Glastürme --------------------------------------------------------
const BALC = [0xf4a6c0, 0x8fd3c2, 0xf6c56b, 0x9ec9f0, 0xc3a6e6];

/** Wohnblock: sieben Geschosse, flaches Dach, offene Balkone mit bunten Brüstungen an jeder zweiten Achse. */
defs.apartment = {
  kind: 'city', tints: tints(5, 0, 2, 3, 4), far: true,
  make(b) {
    const { F } = b;
    const w = 22;
    const cols = 8;
    const info = house(b, { w, d: 12, floors: 7, gh: 3.0, fh: 2.8, roof: 'flat', cols, door: DOORS[2], flowers: null, chimney: false, light: true, flatWin: true });
    const step = w / cols;
    for (let f = 1; f < 7; f++) {
      const y = 0.3 + 3.0 + (f - 1) * 2.8 - 0.05;
      for (let i = 1; i < cols; i += 2) {
        const x = -w / 2 + step * (i + 0.5);
        F.box(x, y, 0.55, 2.3, 0.14, 1.1, PAL.concrete, { skip: 'k' });
        F.box(x, y + 0.14, 1.06, 2.3, 0.86, 0.08, BALC[(i + f) % BALC.length], { skip: 'bk' });
      }
    }
    return { ...info };
  },
};

/** Bürohaus: hohe Fensterbänder, Eingang mit Vordach, Technik auf dem Dach. */
defs.office = {
  kind: 'city', tints: tints(2, 5, 8, 3), far: true,
  make(b) {
    const { F, G } = b;
    const near = b.lod === 0;
    const w = 20;
    const d = 14;
    const info = house(b, { w, d, floors: 6, gh: 4.2, fh: 3.4, roof: 'flat', cols: 6, winW: 2.5, winH: 2.1, door: DOORS[2], doorW: 2.4, doorGlass: true, flowers: null, chimney: false, corners: PAL.stone, flatWin: true });
    const H = info.eaves;
    F.rbox(0, 3.3, 0.9, 6.2, 0.3, 1.8, 0.3, PAL.steel, { bottom: true });
    F.rbox(3, H, -d / 2, 6, 2.2, 5, 0.3, PAL.concrete);
    if (near) for (let i = 0; i < 4; i++) G.rect(1.1 + i * 1.3, H + 0.4, -d / 2 + 2.52, 0.9, 1.3, mix(PAL.steel, CITY.ink, 0.3));
    return { ...info, h: H + 2.2 };
  },
};

/** Kaufhaus: breite Schaufensterfront, vier hohe Geschosse, großer Schriftzug auf dem Dach. */
defs.deptStore = {
  kind: 'city', tints: tints(5, 0, 6), far: true,
  make(b) {
    const { F, G } = b;
    const w = 30;
    const d = 20;
    const info = house(b, { w, d, floors: 4, gh: 4.6, fh: 4.0, roof: 'flat', ground: 'shop', shop: 'toys', cols: 9, winW: 2.0, winH: 2.4, door: DOORS[2], flowers: null, chimney: false, corners: PAL.stone, awning: false, flatWin: true });
    const H = info.eaves;
    b.at(0, 0, -1.2, 0, () => {
      for (const s of [-1, 1]) F.cyl(s * 4.2, H, 0, 0.07, 0.07, 1.4, PAL.darkMetal, { seg: 5 });
      G.box(0, H + 1.3, 0, 10.4, 2.6, 0.16, CITY.ink, { skip: 'f' });
      G.sign(0, H + 1.4, 0.085, 10, 's:kaufhaus');
    });
    return { ...info, h: H + 4 };
  },
};

/**
 * Glasturm für Skylines: Steinsockel, Schaft in der Instanzfarbe mit Glasbändern je Geschoss auf allen vier Seiten
 * (fern: Bänder zu zweit), Krone nach p.crown ('spire' Spitze mit Antenne, 'slant' schräges Dach, 'cap' Laterne).
 */
function tower(b, p) {
  const { T, F, G } = b;
  const near = b.lod === 0;
  const { w, d, n } = p;
  const fh = 3.6;
  const y0 = 7;
  const H = y0 + n * fh;
  const r = Math.min(1.6, w * 0.08);
  F.rbox(0, 0, -d / 2, w + 1.2, y0, d + 1.2, r + 0.6, PAL.stone, { seg: 3, ks: [0.85, 1] });
  // Vorplatz: helle Platten rundum, damit der Turm nicht auf der Wiese steht
  F.box(0, 0, -d / 2, w + 14, 0.08, d + 14, CITY.sand, { skip: 'b' });
  G.rect(0, 0.4, 0.62, w * 0.5, 4.2, mix(PAL.glass, PAL.glassDark, 0.4));
  T.rbox(0, y0, -d / 2, w, H - y0, d, r, 0xffffff, { seg: 3, ks: [0.9, 1.04], g: [0.92, 1.06] });
  const band = mix(PAL.glass, PAL.glassDark, 0.45);
  const every = near ? 1 : 2;
  for (const [x, z, ry, len] of [[0, 0, 0, w], [0, -d, Math.PI, w], [w / 2, -d / 2, Math.PI / 2, d], [-w / 2, -d / 2, -Math.PI / 2, d]]) {
    b.at(x, 0, z, ry, () => {
      for (let i = 0; i < n; i += every) G.rect(0, y0 + i * fh + 0.7, 0.03, len - 2 * r - 0.4, fh * every - 1.2, band, { g: [0.9, 1.15] });
    });
  }
  if (p.crown === 'spire') {
    F.frust(0, H, -d / 2, w * 0.7, d * 0.7, 0.6, 0.6, w * 0.6, PAL.steel, { skip: 'b' });
    F.cyl(0, H + w * 0.6, -d / 2, 0.25, 0.08, 12, PAL.steel, { seg: 6 });
    F.ball(0, H + w * 0.6 + 12, -d / 2, 0.35, PAL.red, { ws: 6, hs: 3 });
  } else if (p.crown === 'slant') {
    // schräges Dach: Keil, vorne niedrig, hinten hoch
    const k = d * 0.45;
    b.xf([0, H, -d / 2], [0, Math.PI / 2, 0], 1, () => F.extrude([[-d / 2, 0], [d / 2, 0], [d / 2, k]], -w / 2, w / 2, PAL.steel, { crease: 0.3 }));
  } else {
    T.rbox(0, H, -d / 2, w * 0.6, 5, d * 0.6, r * 0.6, 0xffffff, { seg: 3, ks: [0.95, 1.05] });
    G.rect(0, H + 1, -d / 2 + d * 0.3 + 0.03, w * 0.6 - 2 * r * 0.6 - 0.3, 3, band);
    F.cyl(0, H + 5, -d / 2, 0.2, 0.05, 6, PAL.steel, { seg: 5 });
  }
  return { w: w + 14, d: d + 14, h: H + (p.crown === 'spire' ? w * 0.6 + 12.4 : p.crown === 'slant' ? d * 0.45 : 11) };
}
const GLASS = [0xd8ecf5, 0xfaf7f0, 0xe6f2d5, 0xf4d6e0, 0xbcd4e6];
// Der Vorplatz (7 m rundum) gehört zum Grundriss: um 7 m zurück, damit seine Vorderkante auf z = 0 liegt
const towerBlock = (p) => (b) => {
  let info;
  b.at(0, 0, -7, 0, () => {
    info = tower(b, p);
  });
  return info;
};
defs.glassTower1 = { kind: 'city', tints: GLASS, far: true, fade: 3, make: towerBlock({ w: 18, d: 18, n: 22, crown: 'spire' }) };
defs.glassTower2 = { kind: 'city', tints: GLASS, far: true, fade: 3, make: towerBlock({ w: 22, d: 16, n: 28, crown: 'slant' }) };
defs.glassTower3 = { kind: 'city', tints: GLASS, far: true, fade: 3, make: towerBlock({ w: 16, d: 16, n: 15, crown: 'cap' }) };

// --- Großstadt: Messehalle -------------------------------------------------------------------------------------
const FLAGS = [0xe5483a, 0xf6c56b, 0x4fae6a, 0x3f8fd0, 0xb07cc6, 0xf4a6c0];
/**
 * Messehalle (44 × 34 m): lange Halle mit silbernem Tonnendach, das sich zur Straße hin als Bogen zeigt, Glasband unter
 * dem Bogen; davor ein gläserner Eingangsbau mit weit auskragendem Vordach, auf dessen Kante der Schriftzug MESSE
 * steht, und je drei Fahnenmasten mit bunten Fahnen links und rechts. Wände in der Instanzfarbe.
 */
defs.messe = {
  kind: 'city', tints: [0xeef2f5, 0xf3ece0, 0xe4efe9, 0xf2e6ea], far: true,
  make(b) {
    const { T, F, G } = b;
    const near = b.lod === 0;
    const w = 44;
    const d = 34;
    const zf = -8; // Vorderwand der Halle
    const hw = 11; // Wandhöhe
    const rise = 5.5;
    // Halle und Tonnendach (Kreissegment über der ganzen Breite, quer zur Straße gezogen)
    T.rbox(0, 0, (zf - d) / 2, w, hw, d + zf, 0.6, 0xffffff, { seg: near ? 3 : 1, top: false, ks: [0.86, 1], g: [0.92, 1.04] });
    const n = near ? 18 : 8;
    const half = w / 2 + 0.4;
    const R0 = (half * half + rise * rise) / (2 * rise);
    const a0 = Math.asin(half / R0);
    const arc = [];
    for (let i = 0; i <= n; i++) {
      const a = -a0 + (2 * a0 * i) / n;
      arc.push([R0 * Math.sin(a), hw + R0 * Math.cos(a) - (R0 - rise)]);
    }
    F.extrude(arc.reverse(), -d - 0.4, zf + 0.4, 0xc9d3dc, { g: [0.9, 1.08], down: 0xb9c2ca });
    // Bogenfeld über der Vorderwand: Glas mit Sprossen
    b.at(0, 0, zf + 0.02, 0, () => {
      G.rect(0, hw - 3.2, 0.01, w - 3, 2.6, mix(PAL.glass, PAL.glassDark, 0.25), { g: [1.1, 0.85] });
      if (near) for (let i = 1; i < 10; i++) G.rect(-w / 2 + 1.5 + (i * (w - 3)) / 10, hw - 3.2, 0.02, 0.14, 2.6, R_FRAME_CITY);
    });
    // Eingangsbau: Glaskasten 18 × 5 × 6,5 m, Pfosten, Vordach 22 × 8 m
    const ew = 18;
    const eh = 6.5;
    b.at(0, 0, -3, 0, () => {
      G.rect(0, 0.1, 0.02, ew, eh - 0.3, mix(PAL.glass, PAL.glassDark, 0.3), { g: [1.12, 0.82] });
      if (near) for (let i = 0; i <= 6; i++) F.box(-ew / 2 + (i * ew) / 6, 0, 0.08, 0.16, eh, 0.16, R_FRAME_CITY);
      // Drehtür in der Mitte
      F.lathe(0, 0, 0.9, [[1.2, 0], [1.2, 2.6]], mix(PAL.glass, 0xffffff, 0.2), { seg: near ? 14 : 8, a0: -Math.PI / 2, a1: Math.PI / 2, top: false });
      F.lathe(0, 2.6, 0.9, [[1.35, 0], [1.35, 0.3], [0, 0.3]], R_FRAME_CITY, { seg: near ? 14 : 8, a0: -Math.PI / 2, a1: Math.PI / 2 });
    });
    for (const s of [-1, 1]) b.at(s * ew / 2, 0, -5.5, s * Math.PI / 2, () => G.rect(0, 0.1, 0.02, 5, eh - 0.3, mix(PAL.glass, PAL.glassDark, 0.3), { g: [1.12, 0.82] }));
    F.rbox(0, eh, -4.2, 22, 0.55, 8.4, 0.5, PAL.concrete, { seg: near ? 3 : 1, bottom: true, prof: [[0, 0], [0, 0.45], [0.08, 0.55]], ks: [0.9, 1, 1.05] });
    // Schriftzug auf der Vordachkante (zum Lesen von der Straße aus)
    F.rbox(0, eh + 0.55, -0.6, 10.6, 2.9, 0.3, 0.12, PAL.frame, { seg: 2 });
    G.sign(0, eh + 0.75, -0.44, 10, 's:messe');
    // Fahnen: je drei Masten links und rechts des Eingangs
    for (const s of [-1, 1]) for (let i = 0; i < 3; i++) {
      const x = s * (13 + i * 2.4);
      F.cyl(x, 0, -1.4, 0.07, 0.05, 9, POLE_CITY, { seg: near ? 6 : 4 });
      F.ball(x, 9, -1.4, 0.1, POLE_CITY, { ws: 5, hs: 3 });
      F.box(x + 0.62, 6.0, -1.4, 1.1, 2.7, 0.05, FLAGS[(i * 2 + (s > 0 ? 1 : 0)) % FLAGS.length]);
      if (near) F.box(x + 0.62, 8.7, -1.4, 1.2, 0.06, 0.06, POLE_CITY);
    }
    return { w, d, h: hw + rise + 0.2 };
  },
};
const R_FRAME_CITY = 0xf3ecdd;
const POLE_CITY = mix(PAL.steel, 0xffffff, 0.2);

// --- Hafen: Speicher aus Backstein -----------------------------------------------------------------------------
const COPPER = 0x6fa58f; // grün angelaufenes Kupfer
const GRANITE = 0x9c968c;
const LOAD = 0x3f6b55; // dunkelgrüne Ladeluken
/**
 * Ladeluken in der Achse x übereinander (je Geschoss eine zweiflügelige Holztür mit hellem Rahmen und Brüstung), im
 * Erdgeschoss ein Tor; H = Traufe, fh/gh/base wie im Haus.
 */
function loadingAxis(b, x, base, gh, fh, floors, near) {
  const { F, G } = b;
  b.at(x, 0, 0, 0, () => {
    G.rect(0, base, 0.02, 2.5, 2.9, R_FRAME_CITY);
    G.rect(0, base + 0.05, 0.03, 2.2, 2.75, LOAD, { g: [0.9, 1.05] });
    if (near) G.rect(0, base + 0.05, 0.035, 0.06, 2.75, mix(LOAD, CITY.ink, 0.35));
    for (let f = 1; f < floors; f++) {
      const y = base + gh + (f - 1) * fh + 0.25;
      G.rect(0, y, 0.02, 1.6, 2.35, R_FRAME_CITY);
      G.rect(0, y + 0.06, 0.03, 1.36, 2.2, LOAD, { g: [0.9, 1.05] });
      if (near) {
        G.rect(0, y + 0.06, 0.035, 0.05, 2.2, mix(LOAD, CITY.ink, 0.35));
        F.box(0, y - 0.02, 0.12, 1.7, 0.08, 0.24, GRANITE);
      }
    }
  });
}
/** Kupfertürmchen: runder Schaft aus Backstein (Instanzfarbe) mit Fensterchen, grüner Kegelhelm mit Knauf. */
function copperTurret(b, x, y, z, r, h, near) {
  const { T, F, G } = b;
  const seg = near ? 12 : 6;
  T.lathe(x, y, z, [[r, 0], [r, h]], 0xffffff, { seg, top: false, ks: [0.9, 1] });
  F.lathe(x, y + h, z, [[r + 0.15, 0], [r + 0.15, 0.2], [0.05, 0.2 + r * 2.6]], COPPER, { seg, bottom: true, g: [0.86, 1.08] });
  F.ball(x, y + h + 0.25 + r * 2.6, z, 0.12, PAL.signYellow, { ws: 6, hs: 4 });
  if (near) for (const a of [0.5, -0.5]) b.at(x + Math.sin(a) * r, 0, z + Math.cos(a) * r, a, () => G.rect(0, y + h * 0.35, 0.01, 0.35, 0.8, mix(PAL.glass, PAL.glassDark, 0.3)));
}
/**
 * Speicher 1 (16 × 14 m): sechs Geschosse Backstein auf einem Granitsockel, Treppengiebel zur Straße mit Lastbalken,
 * Ladeluken in der Mittelachse, ein Kupfertürmchen an der Ecke, Kupferdach. Seitenwände als fensterlose Brandmauern
 * (Speicher stehen in Reihen).
 */
defs.speicher1 = {
  kind: 'city', tints: [0xb4583f, 0xa95640, 0xc0613f], far: true,
  make(b) {
    const near = b.lod === 0;
    const w = 16;
    const p = { w, d: 14, floors: 6, gh: 3.6, fh: 3.1, base: 1.3, baseCol: GRANITE, style: 'brick', band: R_CREAM, roof: 'front', gable: 'step', rh: w * 0.55, roofCol: COPPER, cols: 4, winW: 0.95, winH: 1.7, frame: R_FRAME_CITY, door: LOAD, doorCol: 0, cross: 1, flowers: null, chimney: false, hoist: true, flatWin: true, lamp: false, sideWin: false };
    const info = house(b, p);
    loadingAxis(b, 0, p.base, p.gh, p.fh, p.floors, near);
    copperTurret(b, w / 2 - 0.8, info.eaves - 2.2, -0.8, 0.8, 4.0, near);
    return { ...info, h: Math.max(info.h, info.eaves + 1.8 + 0.45 + 0.8 * 2.6 + 0.15) };
  },
};
/**
 * Speicher 2 (24 × 14 m): fünf Geschosse, Kupferdach längs der Straße mit drei Gauben, zwei Ladeachsen mit Windenerkern
 * unter der Traufe, Türmchen an der linken Ecke.
 */
defs.speicher2 = {
  kind: 'city', tints: [0xa95640, 0xb65c42, 0x9c4f3b], far: true,
  make(b) {
    const { F } = b;
    const near = b.lod === 0;
    const w = 24;
    const p = { w, d: 14, floors: 5, gh: 3.6, fh: 3.1, base: 1.3, baseCol: GRANITE, style: 'brick', band: R_CREAM, roof: 'side', rh: 5.2, roofCol: COPPER, cols: 6, winW: 0.95, winH: 1.7, frame: R_FRAME_CITY, door: LOAD, doorCol: 0, cross: 1, flowers: null, chimney: false, dormers: 3, flatWin: true, lamp: false };
    const info = house(b, p);
    for (const x of [-4, 4]) {
      loadingAxis(b, x, p.base, p.gh, p.fh, p.floors, near);
      // Windenerker: kleines Dach mit Lastbalken über der obersten Luke
      F.box(x, info.eaves - 0.1, 0.55, 1.9, 0.9, 1.1, COPPER, { g: [0.9, 1.05] });
      F.box(x, info.eaves - 0.45, 1.05, 0.16, 0.16, 0.9, CITY.woodDark);
    }
    copperTurret(b, -w / 2 + 0.8, info.eaves - 2.2, -0.8, 0.8, 3.6, near);
    return { ...info, h: Math.max(info.h, info.eaves + 1.4 + 0.45 + 0.8 * 2.6 + 0.15) };
  },
};

defs.townChurch = { kind: 'town', tints: [0xfaf7f0, CITY.sand, 0xf0d9c0], far: true, make: (b) => church(b, { tw: 6.2, th: 23, nw: 12.5, nl: 24, nh: 10, pointed: true, sh: 15, wins: 5, roofCol: CITY.slate }) };

defs.cityGate = {
  kind: 'town', tints: [0xfaf7f0, CITY.sand, 0xf0d9c0], far: true,
  make(b) {
    const { T, F, G } = b;
    const near = b.lod === 0;
    const w = 12;
    const d = 7;
    const pw = 7;
    const ph = 5.6;
    const h = 14;
    // Torturm: Bogen quer durch (die Straße läuft entlang z hindurch)
    const hole = arch(0, pw, 0, ph, near ? 12 : 8);
    T.extrude([[-w / 2, 0], [w / 2, 0], [w / 2, h], [-w / 2, h]], -d, 0, 0xffffff, { holes: [hole], g: [0.86, 1.02] });
    b.hip(0, h, -d / 2, w, d, 5.2, ROOF[1], { oe: 0.5 });
    for (const face of [0, Math.PI]) {
      b.at(0, 0, face ? -d : 0, face, () => {
        G.extrude(arch(0, pw + 0.9, 0, ph + 0.45, near ? 12 : 8), 0, 0.12, CITY.sand, { caps: 'f', holes: [hole], sides: near });
        clock(b, 0, 10.6, 1.15);
        for (const x of [-3.4, 3.4]) b.win(x, 8.2, 0.9, 1.5, { cross: 1, shutter: PAL.door[1] });
        // Wappen
        G.extrude([[-0.6, 7.9], [0.6, 7.9], [0.6, 7.2], [0, 6.6], [-0.6, 7.2]], 0, 0.08, PAL.signBlue, { crease: 2 });
        G.rect(0, 6.95, 0.085, 0.24, 0.9, PAL.signYellow);
        G.rect(0, 7.25, 0.085, 0.9, 0.24, PAL.signYellow);
      });
    }
    // runde Ecktürmchen
    for (const sx of [-1, 1]) {
      for (const z of [0, -d]) {
        F.lathe((sx * w) / 2, 9.4, z, [[0.2, 0], [0.95, 1.1], [0.95, 4.9]], PAL.wall[6], { seg: 8, top: false, ks: [0.75, 0.95, 1] });
        F.lathe((sx * w) / 2, 14.3, z, [[1.15, 0], [0, 2.6]], ROOF[1], { seg: 8, bottom: true, g: [0.86, 1.05] });
      }
    }
    weathercock(b, 0, h + 5.1, -d / 2);
    return { w, d, h: h + 6.6, passage: { w: pw, h: ph } };
  },
};

// --- Regionale Spielarten ---------------------------------------------------------------------------------------
// Jede Haus-Variante (addHouse, shopHouse) gibt es auch als name@gegend: gleiche Breite, gleiche Rolle (Dorfhaus,
// Reihenhaus, Laden), aber Wände, Dach, Giebel, Fenster und Zutaten der Gegend. Der Ortsplan nimmt sie nach dem
// Ortsbild des Orts (layout.js lookOf). Norddeutscher Backstein nach research/landmarks/stil-backstein
// (Treppengiebel, Bremer Haus, Reetdach), die anderen nach allgemeinem Wissen, liebevoll vereinfacht. Dazu fünf
// Ortsbilder aus der Mitte Deutschlands (der Besitzer am 24.11.2026: „Gestalte die Orte noch unterschiedlicher, damit
// sie nicht alle gleich aussehen“): Fachwerk, Schiefer (Bergisches Land, Siegerland, Westerwald), Kurort, Gründerzeit
// und roter Sandstein (Main, Neckar, Rhein).
// Dazu (25.11.2026, „Kannst du jede Stadt individualisieren?“, Steckbriefe in steckbrief.js) Barock, Plattenbau,
// Nachkriegsbau, Bäderarchitektur und Schwarzwald.
export const REGIONS = ['brick', 'dutch', 'alpine', 'med', 'nordic', 'british', 'american', 'japanese', 'fachwerk', 'schiefer', 'kurort', 'gruenderzeit', 'sandstein', 'barock', 'platte', 'nachkrieg', 'baeder', 'schwarzwald', 'haussmann', 'laube', 'levante', 'kolonial', 'altstadt'];
const R_FRAME = 0xf3ecdd; // cremeweiße Fensterrahmen (nie reinweiß)
const R_CREAM = 0xeadfcb;
const R_PANTILE = 0xc8694a;
const R_THATCH = 0xb2915e;
const R_COPPER = 0x86ac9e;
const R_SLATE = 0x5f656d;
const R_TILE_DARK = 0x4a5058;
const R_TERRACOTTA = 0xc4673f;
const R_SANDSTONE = 0xead2bc; // helle Gewände um rote Sandsteinfassaden
const R_GERANIUM = [0xd8453a, 0xf06a8a, 0xd8453a];
const R_TINTS = {
  brick: [0xc0613f, 0xb65c42, 0xa95640, 0x9c4f3b, 0x8a4636],
  bremen: [0xf2d98e, 0xb9cba3, 0xb9c9d2, 0xe6cdb5],
  dutch: [0x8a4636, 0x7d4436, 0x9a5240, 0x74402f, 0xa45a44],
  zaan: [0x4f7a5a, 0x5e8a68, 0x46705a],
  wood: [0x9a6a44, 0x8a5c3b, 0xa8774d, 0x7e5536],
  alpTown: [0xf4e7c8, 0xf2d5c4, 0xe3ecd9, 0xf6efe0, 0xe9d7a8],
  med: [0xe8c48a, 0xd9946a, 0xf2e2c4, 0xe9b9a6, 0xf3d98e, 0xf4efe6],
  nordWood: [0xa8443a, 0xd9a441, 0xefe9dc, 0xb9cfe0, 0xa8443a],
  nordTown: [0xd9a441, 0xc8673f, 0xe9c97a, 0xb5503c, 0xefe2c4],
  gbPastel: [0xf4efe6, 0xf0c8c0, 0xcfe3d0, 0xcfe0ea, 0xf2e2a8],
  gbBrick: [0xb5654a, 0xc9a26a, 0x9a5a44, 0xa8603f],
  gbCottage: [0xf4efe4, 0xefe6d2, 0xe8dcc0],
  gbStone: [0xd8c18e, 0xcdb582, 0xe2cfa0],
  usSiding: [0xf4f1ea, 0xc9dbe8, 0xf2e2a8, 0xc7d6b8, 0xdedbd2],
  usBrown: [0x8a5a44, 0x7a4e3c, 0x9a6650, 0x86523f],
  usMain: [0xb5654a, 0xc9a26a, 0xd8cbb0, 0x9a5a44],
  jp: [0xf2efe6, 0xe9e4d8, 0xdcd8cf, 0xe8e0cc],
  // Gefache: weiß, Creme, helles Ocker, Rosé (das Holz ist dunkel)
  fachwerk: [0xf4efe4, 0xefe4cc, 0xf0dcb4, 0xeed8cc, 0xe6e8da],
  // Schieferbehang in Anthrazit und Blaugrau
  schiefer: [0x474c54, 0x51565f, 0x3f444b, 0x5a5f66],
  // Bäderarchitektur in Pastell
  kurort: [0xf6efe0, 0xf3e2b8, 0xeed6d2, 0xdfe8dc, 0xf4f0ea, 0xdde6ee],
  // Stuck und Sandstein der Gründerzeit
  gruenderzeit: [0xe8d8b8, 0xd9c7a6, 0xcfc2b0, 0xe6d2c0, 0xd6cfc4, 0xf0e4cc],
  // roter Buntsandstein
  sandstein: [0xa9574a, 0xb4644f, 0x9d5143, 0xbc6f5a, 0xa65e4e],
  // Barock: Ocker, Schönbrunner Gelb, Rosé, Hellgrau mit weißen Lisenen
  barock: [0xf1d27a, 0xeec27f, 0xf0cdbf, 0xe4ddcf, 0xf3e1a6, 0xe9b98f],
  // Plattenbau: Beton in Beige, Grau und den Pastelltönen der Sanierung
  platte: [0xd9d3c4, 0xc9c6bd, 0xe8dcb8, 0xcfdce0, 0xe6cfc0, 0xd7e0c8],
  // Wiederaufbau der Fünfziger: helles Gelb, Lindgrün, Lachs, Taubenblau
  nachkrieg: [0xf0e2a8, 0xd8e2c0, 0xf0cdb8, 0xcfd9e2, 0xe9e2d2, 0xe8d5a8],
  // Bäderarchitektur: Weiß und Creme
  baeder: [0xfbfaf6, 0xf6f2e8, 0xf4eedf, 0xeef2f4, 0xf8f4ea],
  // Schwarzwald: dunkles Holz über weißem Sockel; im Städtle bunter Putz
  swHolz: [0x8a5a3a, 0x7a4e33, 0x96643f, 0x6e4630],
  swStadt: [0xf3e6c4, 0xf2d0c0, 0xdfe8d2, 0xf6efe0, 0xeed79c, 0xd8e4ea],
  // Paris: heller Haustein, kaum Unterschied von Haus zu Haus
  haussmann: [0xeee3cc, 0xe6d9bd, 0xf2e9d6, 0xddcfb2, 0xe9dcc2],
  // Laubenstädte: Sandstein und Putz in Grau, Ocker, Rosé
  laube: [0xd9cbb0, 0xe8d6a8, 0xe9c9b8, 0xcfd3cc, 0xd8c49a],
  // Levante: Kalkstein in Honig und Sand
  levante: [0xe8cf9a, 0xdfc289, 0xf0dcae, 0xd6b67a, 0xecd8b4],
  // Kolonialstil der Karibik und Lateinamerikas: kräftige Farben
  kolonial: [0x5fbfb4, 0xf2a7b8, 0xf6d06a, 0x8fc3e8, 0xf08a5d, 0xb9de8a],
  // Altstädte Mitteleuropas (Prag, Krakau, Danzig, Vilnius): bunte Bürgerhäuser
  altstadt: [0xf2c46a, 0xe89a7a, 0x9cc4b0, 0xf0e0b0, 0xd6a0b8, 0xa8c4e0],
};
const MATERIAL = new Set([R_TINTS.brick, R_TINTS.dutch, R_TINTS.zaan, R_TINTS.wood, R_TINTS.nordWood, R_TINTS.gbBrick, R_TINTS.gbStone, R_TINTS.usBrown, R_TINTS.usMain, R_TINTS.schiefer, R_TINTS.sandstein, R_TINTS.swHolz]);
const GB_DOORS = [0xb33a3a, 0x2f3f66, 0x2f5d4a, 0xe0b83a, 0x2e3036];
const hashName = (n) => {
  let h = 7;
  for (let i = 0; i < n.length; i++) h = (h * 31 + n.charCodeAt(i)) >>> 0;
  return h;
};
const pickN = (h, arr) => arr[h % arr.length];
// was jede Gegend vom Grundhaus übernimmt: Maße, Laden, Geschosse; Stil, Dach und Zierde setzt sie selbst
const PLAIN = { style: 'plaster', jetty: 0, timberFrom: undefined, dormers: 0, shutter: undefined, gable: undefined, gableWin: undefined, corners: undefined, wall: undefined };

/** Rolle eines Grundhauses: 'cottage' (Dorf, ein Geschoss), 'house' (Dorf, zwei), 'town' (Reihenhaus), 'shop'. */
function roleOf(kind, p) {
  if (kind === 'shop') return 'shop';
  if (kind === 'village') return (p.floors ?? 2) === 1 ? 'cottage' : 'house';
  return 'town';
}

/** Regionale Fassung eines Grundhauses: { tints, p } (p ersetzt Teile der Grundparameter). */
const DRESS = {
  brick(role, p, h) {
    const d = p.d ?? 9;
    if (role === 'cottage') {
      // Hallenhaus mit Reetdach: dicker, steiler Strohhut, gekreuzte Giebelbretter
      return { tints: R_TINTS.brick, p: { ...PLAIN, style: 'brick', band: R_CREAM, roof: 'front', rh: p.w * 0.66, roofCol: R_THATCH, roofT: 0.5, oe: 0.55, og: 0.5, horse: true, chimney: false, frame: R_FRAME, ground: 'door', flowers: [PAL.red, 0xf6b7c9] } };
    }
    if (role === 'house') {
      return { tints: R_TINTS.brick, p: { ...PLAIN, style: 'timber', timberFrom: 0, roof: 'front', rh: p.w * 0.6, roofCol: R_PANTILE, frame: R_FRAME, gableWin: 'win', flowers: [PAL.red] } };
    }
    if (role === 'town' && h % 3 === 0) {
      // Bremer Haus: Hochparterre mit Treppe, Erker über zwei Geschosse, Attika mit Gesims, Vorgarten
      return { tints: R_TINTS.bremen, p: { ...PLAIN, roof: 'flat', parapet: 0.7, cornice: R_FRAME, roofCol: PAL.concrete, base: 1.2, stoop: true, bay: true, bayFloors: 2, bayRoof: R_COPPER, floors: Math.min(3, p.floors ?? 3), door: 0x2f5d4a, frame: R_FRAME, winH: 1.6, flowers: undefined, chimney: false, setback: 3, yard: 'garden' } };
    }
    // Giebelhaus mit Treppengiebel (manchmal Halsgiebel): Backstein, helle Gesimse, weiße Rahmen, Pfannendach
    return { tints: R_TINTS.brick, p: { ...PLAIN, style: 'brick', band: R_CREAM, roof: 'front', gable: h % 4 === 1 ? 'neck' : 'step', rh: p.w * 0.6, roofCol: R_PANTILE, og: 0.3, frame: R_FRAME, winW: 1.0, winH: 1.7, flowers: undefined, chimney: false, d } };
  },
  dutch(role, p, h) {
    if (role === 'cottage') {
      // Zaanse Häuschen: grüne Holzverschalung, weiße Kanten und Rahmen, rote Ziegel
      return { tints: R_TINTS.zaan, p: { ...PLAIN, style: 'siding', corners: R_FRAME, roof: 'front', rh: p.w * 0.62, roofCol: 0x9a4b3a, frame: R_FRAME, door: 0x2f4f3f, gableWin: 'win', ground: 'door', flowers: undefined } };
    }
    // Grachtenhaus: dunkler Backstein, hoch und schmal, Hals-, Glocken- oder Treppengiebel, große weiße Fenster, Lastbalken
    const floors = Math.max(p.floors ?? 3, role === 'house' ? 2 : 3) + (role === 'town' ? 1 : 0);
    return { tints: R_TINTS.dutch, p: { ...PLAIN, roof: 'front', gable: pickN(h, ['neck', 'bell', 'step', 'bell', 'neck']), rh: p.w * 0.68, roofCol: 0x5c5650, floors, frame: R_FRAME, winW: 1.1, winH: 1.8, door: pickN(h >> 3, [0x2f4f3f, 0x3a3f5a, 0x5a2f2f]), hoist: true, flowers: undefined, chimney: false, band: R_CREAM } };
  },
  alpine(role, p, h) {
    const d = p.d ?? 9;
    if (role === 'cottage' || role === 'house') {
      // Bauernhaus: weiß verputztes Erdgeschoss, Holz darüber, flaches Dach mit weitem Überstand, Balkon mit Geranien
      return { tints: R_TINTS.wood, p: { ...PLAIN, style: 'siding', corners: false, lowerCol: 0xf2ede2, floors: 2, roof: 'front', rh: p.w * 0.3, roofCol: 0x6b5a4c, oe: 0.9, og: 1.2, balcony: { col: 0x7b5233, flowers: R_GERANIUM }, shutter: 0x55804f, frame: R_FRAME, gableWin: 'win', flowers: R_GERANIUM, flowersAll: true } };
    }
    // Marktgasse: bunter Putz, flaches Satteldach, Läden mit Blumen, manche mit Erker
    return { tints: R_TINTS.alpTown, p: { ...PLAIN, roof: 'side', rh: d * 0.26, roofCol: 0x6e6a66, oe: 0.7, shutter: pickN(h, [0x55804f, 0x8a3b32, 0x55804f]), frame: R_FRAME, flowers: R_GERANIUM, flowersAll: true, chimney: false } };
  },
  med(role, p, h) {
    const d = p.d ?? 9;
    const shutter = pickN(h, [0x5f8a5a, 0x6f8fa8, 0x8a6a4a, 0x5f8a5a]);
    if (role === 'cottage' || role === 'house') {
      return { tints: R_TINTS.med, p: { ...PLAIN, roof: 'hip', rh: Math.min(p.w, d) * 0.22, roofCol: R_TERRACOTTA, oe: 0.35, shutter, frame: R_FRAME, flowers: R_GERANIUM, chimney: false, ground: p.ground } };
    }
    const flat = h % 3 === 0;
    return { tints: R_TINTS.med, p: { ...PLAIN, roof: flat ? 'flat' : 'side', parapet: flat ? 0.8 : 0, cornice: R_FRAME, roofCol: flat ? 0xe8dcc6 : R_TERRACOTTA, rh: d * 0.2, oe: 0.35, shutter, frame: R_FRAME, balc: 'iron', flowers: undefined, chimney: false } };
  },
  nordic(role, p, h) {
    const d = p.d ?? 9;
    if (role === 'cottage' || role === 'house') {
      // Holzhaus: Falunrot, Ocker, Weiß, Hellblau; weiße Kanten und Rahmen; dunkles oder rotes Dach
      return { tints: R_TINTS.nordWood, p: { ...PLAIN, style: 'siding', corners: R_FRAME, roof: p.roof === 'front' ? 'front' : 'side', rh: (p.roof === 'front' ? p.w : d) * 0.58, roofCol: pickN(h, [0x3f4247, 0x9c4a3a, 0x4a4d52]), frame: R_FRAME, dormers: p.roof === 'front' ? 0 : 1, flowers: undefined, ground: p.ground } };
    }
    // Altstadt: Putz in Ocker, Rost, Gelb, steile Dächer
    return { tints: R_TINTS.nordTown, p: { ...PLAIN, roof: 'side', rh: d * 0.55, roofCol: pickN(h, [0x9c4a3a, 0x3f4247]), frame: R_FRAME, dormers: 1, flowers: undefined } };
  },
  british(role, p, h) {
    const d = p.d ?? 9;
    const door = pickN(h, GB_DOORS);
    if (role === 'cottage') {
      return { tints: R_TINTS.gbCottage, p: { ...PLAIN, roof: 'side', rh: d * 0.55, roofCol: R_THATCH, roofT: 0.5, oe: 0.5, frame: R_FRAME, door, ground: 'door', dormers: 1, flowers: [PAL.red, 0xf6b7c9] } };
    }
    if (role === 'house') {
      return { tints: R_TINTS.gbStone, p: { ...PLAIN, roof: 'side', rh: d * 0.48, roofCol: R_SLATE, frame: R_FRAME, door, bay: true, flowers: undefined } };
    }
    if (role === 'town') {
      // Reihenhaus: Stuck in Pastell, Erker, Treppe, kleiner Vorplatz mit Gitter
      return { tints: R_TINTS.gbPastel, p: { ...PLAIN, roof: 'side', rh: d * 0.26, roofCol: R_SLATE, base: 0.9, stoop: true, bay: true, bayFloors: h % 2 ? 2 : 1, bayRoof: R_SLATE, frame: R_FRAME, door, winH: 1.6, chimneyX: 0.42, flowers: undefined, setback: 1.6, yard: 'area' } };
    }
    return { tints: R_TINTS.gbBrick, p: { ...PLAIN, style: 'brick', band: R_CREAM, roof: 'side', rh: d * 0.26, roofCol: R_SLATE, frame: R_FRAME, door, chimneyX: 0.42, flowers: undefined } };
  },
  american(role, p, h) {
    const d = p.d ?? 9;
    if (role === 'cottage' || role === 'house') {
      // Holzhaus mit Veranda, weißem Zaun und Vorgarten
      return { tints: R_TINTS.usSiding, p: { ...PLAIN, style: 'siding', corners: R_FRAME, roof: role === 'cottage' ? 'side' : 'front', rh: (role === 'cottage' ? d : p.w) * 0.42, roofCol: 0x5a5e66, frame: R_FRAME, shutter: pickN(h, [0x2e3a35, 0x3a4660, undefined]), porch: true, dormers: role === 'cottage' ? 2 : 0, ground: 'door', flowers: undefined, setback: 3.4, yard: 'picket' } };
    }
    if (role === 'town') {
      // Brownstone: Hochparterre mit Treppe, Flachdach mit kräftigem Gesims
      return { tints: R_TINTS.usBrown, p: { ...PLAIN, roof: 'flat', parapet: 0.7, cornice: 0x6a5446, roofCol: PAL.concrete, base: 1.5, stoop: true, frame: R_FRAME, cross: 1, winH: 1.7, door: 0x3a2e28, flowers: undefined, chimney: false, setback: 2.4, yard: 'area' } };
    }
    // Main Street: Backstein, Flachdach hinter hoher Blendfassade mit Gesims
    return { tints: R_TINTS.usMain, p: { ...PLAIN, style: 'brick', band: R_CREAM, roof: 'flat', parapet: 1.2, cornice: R_FRAME, roofCol: PAL.concrete, frame: R_FRAME, cross: 1, flowers: undefined, chimney: false } };
  },
  fachwerk(role, p, h) {
    // Fachwerk: dunkles Holz über hellem Gefach, vorkragende Geschosse, steile Giebel zur Straße, rote Ziegel, Geranien;
    // Läden und Reihenhäuser mit verputztem Erdgeschoss
    const low = role === 'cottage' || role === 'house';
    return { tints: R_TINTS.fachwerk, p: { ...PLAIN, style: 'timber', timberFrom: low ? 0 : 1, jetty: 0.25, roof: 'front', rh: p.w * 0.72, roofCol: pickN(h, [0xa8452f, 0x8b3e2c, 0xb5523a, 0x6b5a52]), shutter: pickN(h >> 2, [undefined, 0x55804f, 0x8a3b32, undefined]), frame: R_FRAME, gableWin: 'win', flowers: R_GERANIUM, flowersAll: true } };
  },
  schiefer(role, p, h) {
    // Schieferhaus: dunkler Behang, weiße Rahmen und Eckbretter, grüne Klappläden und Türen, Schieferdach; Läden mit
    // hellem Erdgeschoss
    const d = p.d ?? 9;
    const front = role === 'cottage' || h % 3 === 0;
    return { tints: R_TINTS.schiefer, p: { ...PLAIN, style: 'siding', corners: R_FRAME, lowerCol: role === 'shop' ? 0xf2ede2 : undefined, roof: front ? 'front' : 'side', rh: (front ? p.w : d) * 0.55, roofCol: pickN(h, [0x3c4148, R_SLATE, 0x464b52]), frame: R_FRAME, shutter: 0x2f6b3f, door: 0x2f5d4a, gableWin: front ? 'win' : undefined, flowers: undefined } };
  },
  kurort(role, p, h) {
    // Kurort: Villen mit Walmdach hinter Vorgärten, an der Promenade Pastellfassaden mit Mansarde und Eisenbalkonen
    const d = p.d ?? 9;
    if (role === 'cottage' || role === 'house') {
      return { tints: R_TINTS.kurort, p: { ...PLAIN, roof: 'hip', rh: Math.min(p.w, d) * 0.34, roofCol: R_TILE_DARK, oe: 0.45, frame: R_FRAME, shutter: pickN(h, [0x6f8fa8, undefined, 0x55804f]), flowers: [PAL.red, 0xf6b7c9], setback: 3, yard: 'garden' } };
    }
    return { tints: R_TINTS.kurort, p: { ...PLAIN, roof: 'mansard', rh: 2.8, roofCol: R_TILE_DARK, cornice: R_FRAME, frame: R_FRAME, balc: 'iron', winH: 1.7, flowers: undefined, chimney: false } };
  },
  gruenderzeit(role, p, h) {
    // Gründerzeit: hohe Stuckfassaden in Sandstein und Ocker, Mansarddach aus Schiefer, Gesims, hohe Fenster
    const d = p.d ?? 9;
    if (role === 'cottage' || role === 'house') {
      return { tints: R_TINTS.gruenderzeit, p: { ...PLAIN, roof: 'hip', rh: Math.min(p.w, d) * 0.3, roofCol: R_SLATE, frame: R_FRAME, winH: 1.6, flowers: undefined } };
    }
    return { tints: R_TINTS.gruenderzeit, p: { ...PLAIN, floors: Math.min(4, (p.floors ?? 3) + 1), roof: 'mansard', rh: 3.2, roofCol: pickN(h, [R_SLATE, 0x4f555c]), cornice: 0xf1e7d2, frame: R_FRAME, winW: 1.05, winH: 1.9, base: 0.6, balc: h % 2 ? 'iron' : undefined, flowers: undefined, chimney: false } };
  },
  sandstein(role, p, h) {
    // Sandstein: rote Fassaden mit hellen Gewänden über einem dunkelroten Sockel, steile Ziegeldächer – im Dorf mit dem
    // Giebel zur Straße und Geranien, in der Stadt längs mit Gauben, Läden mit hellem Erdgeschoss
    const d = p.d ?? 9;
    if (role === 'cottage' || role === 'house') {
      return { tints: R_TINTS.sandstein, p: { ...PLAIN, roof: 'front', rh: p.w * 0.66, roofCol: pickN(h, [0x8b3e2c, 0x6b3a32, 0x7a4436]), frame: R_SANDSTONE, base: 0.6, baseCol: 0x7e4034, gableWin: 'win', flowers: R_GERANIUM } };
    }
    return { tints: R_TINTS.sandstein, p: { ...PLAIN, roof: 'side', rh: d * 0.5, roofCol: pickN(h, [0x6b3a32, R_TILE_DARK, 0x7a4436]), frame: R_SANDSTONE, base: 0.9, baseCol: 0x7e4034, lowerCol: role === 'shop' ? R_SANDSTONE : undefined, dormers: 2, winH: 1.7, flowers: undefined, chimney: false } };
  },
  barock(role, p, h) {
    // Barock: Putz in Ocker und Rosé, weiße Lisenen an den Ecken, hohe Fenster, Mansarde mit Gauben bzw. Walmdach
    const d = p.d ?? 9;
    if (role === 'cottage' || role === 'house') {
      return { tints: R_TINTS.barock, p: { ...PLAIN, roof: 'hip', rh: Math.min(p.w, d) * 0.42, roofCol: pickN(h, [R_SLATE, 0xa8452f]), oe: 0.35, corners: R_FRAME, frame: R_FRAME, winH: 1.55, shutter: pickN(h >> 2, [undefined, 0x55804f, undefined]), flowers: undefined, base: 0.5, baseCol: 0xd9cdb5 } };
    }
    return { tints: R_TINTS.barock, p: { ...PLAIN, floors: Math.min(4, Math.max(3, p.floors ?? 3)), roof: 'mansard', rh: 3.0, roofCol: pickN(h, [R_SLATE, 0x4f555c, 0xa8452f]), dormers: Math.max(1, Math.round(p.w / 3.2)), cornice: R_FRAME, corners: R_FRAME, frame: R_FRAME, winW: 1.05, winH: 1.85, base: 0.6, baseCol: 0xd9cdb5, flowers: undefined, chimney: false } };
  },
  platte(role, p, h) {
    // Plattenbau (WBS 70 und Verwandte): Großtafeln mit Fugen, fünf, sechs Geschosse, Flachdach, Loggien mit bunten
    // Brüstungen; im Dorf das Einfamilienhaus mit Zeltdach in grauem Putz
    const d = p.d ?? 9;
    if (role === 'cottage' || role === 'house') {
      return { tints: [0xd6d0c4, 0xcfc8b8, 0xe2dccc, 0xc8c4bc], p: { ...PLAIN, w: p.w, floors: 2, roof: 'hip', rh: Math.min(p.w, d) * 0.3, roofCol: pickN(h, [0x6b4a3c, R_TILE_DARK, 0x8b3e2c]), oe: 0.3, frame: R_FRAME, cross: 1, flowers: undefined, ground: p.ground } };
    }
    const shop = role === 'shop';
    return { tints: R_TINTS.platte, p: { ...PLAIN, style: 'panel', floors: shop ? 5 : 6, gh: shop ? 3.4 : 2.8, fh: 2.8, roof: 'flat', parapet: 0.3, cornice: 0xcfcac0, roofCol: PAL.concrete, frame: R_FRAME, cross: 1, winW: 1.35, winH: 1.35, base: 0.4, baseCol: 0x9c968c, loggia: pickN(h, [[0xd06a4a, 0xe8b84a], [0x5f8fb8, 0xe6e2d6], [0x6fae6a, 0xe6e2d6], [0xc94f6d, 0xf2d27a]]), loggiaFrom: h % 2, flowers: undefined, chimney: false, flatWin: true, lamp: false } };
  },
  nachkrieg(role, p, h) {
    // Wiederaufbau der Fünfziger: schlichte Lochfassaden in Pastell, flach geneigtes Satteldach ohne Gauben, Fenster ohne
    // Sprossen, schmale Balkone; im Dorf das Siedlungshaus mit steilem Dach
    const d = p.d ?? 9;
    if (role === 'cottage' || role === 'house') {
      return { tints: R_TINTS.nachkrieg, p: { ...PLAIN, roof: 'side', rh: d * 0.55, roofCol: pickN(h, [0x8b3e2c, R_TILE_DARK, 0x6b5a52]), oe: 0.25, frame: R_FRAME, cross: 1, dormers: 1, flowers: undefined } };
    }
    return { tints: R_TINTS.nachkrieg, p: { ...PLAIN, floors: Math.min(5, Math.max(3, (p.floors ?? 3) + 1)), roof: 'side', rh: d * 0.2, roofCol: pickN(h, [0x8b3e2c, R_TILE_DARK, 0x6b5a52]), oe: 0.3, frame: R_FRAME, cross: 0, winW: 1.25, winH: 1.3, loggia: h % 3 === 0 ? [0xe6e2d6, 0xd9cfa8] : undefined, loggiaFrom: 1, flowers: undefined, chimney: false } };
  },
  baeder(role, p, h) {
    // Bäderarchitektur an Ost- und Nordsee: weiße Villen mit Holzveranden und Balkonen über die ganze Front,
    // Zierwerk in Weiß, Walm- oder Giebeldach
    const d = p.d ?? 9;
    if (role === 'cottage' || role === 'house') {
      const front = h % 2 === 0;
      return { tints: R_TINTS.baeder, p: { ...PLAIN, floors: 2, roof: front ? 'front' : 'hip', rh: front ? p.w * 0.55 : Math.min(p.w, d) * 0.36, roofCol: pickN(h >> 1, [R_TILE_DARK, 0x8b3e2c, R_SLATE]), oe: 0.45, frame: R_FRAME, gableWin: 'round', balcony: { col: R_FRAME, flowers: undefined }, porch: true, flowers: undefined, setback: 3.4, yard: 'picket' } };
    }
    return { tints: R_TINTS.baeder, p: { ...PLAIN, floors: Math.min(4, Math.max(3, p.floors ?? 3)), roof: 'side', rh: d * 0.42, roofCol: pickN(h, [R_TILE_DARK, R_SLATE, 0x8b3e2c]), dormers: 2, frame: R_FRAME, balcony: { col: R_FRAME, flowers: undefined }, balc: role === 'town' ? 'iron' : undefined, bay: role === 'town' ? true : undefined, bayFloors: 2, bayRoof: R_TILE_DARK, winH: 1.6, flowers: undefined, chimney: false } };
  },
  schwarzwald(role, p, h) {
    // Schwarzwaldhaus: riesiges, tief heruntergezogenes Walmdach, Holz über weißem Sockelgeschoss, Laube mit Geranien,
    // grüne Läden; im Städtle bunter Putz mit steilen Giebeln und Klappläden
    const d = p.d ?? 9;
    if (role === 'cottage' || role === 'house') {
      return { tints: R_TINTS.swHolz, p: { ...PLAIN, style: 'siding', corners: false, lowerCol: 0xf2ede2, floors: 2, roof: 'hip', rh: Math.min(p.w, d) * 0.62, roofCol: pickN(h, [0x6b5a4c, 0x5a4a40, 0x7a5a44]), oe: 1.2, balcony: { col: 0x6e4630, flowers: R_GERANIUM }, shutter: 0x3f7a4a, frame: R_FRAME, flowers: R_GERANIUM, flowersAll: true, chimney: false } };
    }
    return { tints: R_TINTS.swStadt, p: { ...PLAIN, roof: 'front', rh: p.w * 0.78, roofCol: pickN(h, [0xa8452f, 0x8b3e2c, 0x6b5a52]), shutter: pickN(h >> 2, [0x3f7a4a, 0x8a3b32, 0x3f7a4a, 0x2f4f6a]), frame: R_FRAME, gableWin: 'win', flowers: R_GERANIUM, flowersAll: true } };
  },
  haussmann(role, p, h) {
    // Haussmann: sechs Geschosse aus hellem Haustein, durchlaufende Eisenbalkone, Mansarde aus Zink mit Gauben, hohe
    // Fenster; im Vorort das Steinhaus mit Walmdach und grauen Läden
    const d = p.d ?? 9;
    if (role === 'cottage' || role === 'house') {
      return { tints: R_TINTS.haussmann, p: { ...PLAIN, roof: 'hip', rh: Math.min(p.w, d) * 0.4, roofCol: pickN(h, [0x7d858c, 0xb5603e]), oe: 0.3, frame: R_FRAME, shutter: pickN(h >> 2, [0x9aa3a8, 0x6f8fa8, 0xd8d4c8]), winH: 1.6, flowers: undefined } };
    }
    return { tints: R_TINTS.haussmann, p: { ...PLAIN, floors: Math.max(4, Math.min(5, (p.floors ?? 3) + 2)), fh: 2.75, roof: 'mansard', rh: 3.0, roofCol: 0x7d858c, dormers: Math.max(1, Math.round(p.w / 3)), cornice: 0xf4ecdc, frame: R_FRAME, winW: 1.1, winH: 2.0, base: 0.5, baseCol: 0xd6c9ae, balc: 'iron', flowers: undefined, chimney: false } };
  },
  laube(role, p, h) {
    // Laubenstadt: Bögen über dem Gehweg, darüber drei Geschosse Putz oder Sandstein, flaches Ziegeldach längs, Erker
    const d = p.d ?? 9;
    if (role === 'cottage' || role === 'house') {
      return { tints: R_TINTS.laube, p: { ...PLAIN, roof: 'side', rh: d * 0.36, roofCol: pickN(h, [0xb5603e, 0x8b3e2c]), oe: 0.6, shutter: pickN(h, [0x55804f, 0x8a3b32]), frame: R_FRAME, flowers: R_GERANIUM } };
    }
    return { tints: R_TINTS.laube, p: { ...PLAIN, floors: Math.max(3, Math.min(4, (p.floors ?? 3) + 1)), roof: 'side', rh: d * 0.3, roofCol: pickN(h, [0xb5603e, 0x8b3e2c, 0x9a5440]), oe: 0.9, arcade: true, setback: 2.1, yard: 'plain', frame: R_FRAME, winH: 1.6, shutter: pickN(h >> 2, [undefined, 0x55804f, undefined]), flowers: R_GERANIUM, chimney: false } };
  },
  levante(role, p, h) {
    // Levante: würfelige Häuser aus Kalkstein, Flachdach mit niedriger Brüstung, kleine Fenster ohne Läden, Holztüren
    const flat = { ...PLAIN, roof: 'flat', parapet: 0.6, cornice: 0xf0dfba, roofCol: 0xd9c49a, frame: 0xf0dfba, cross: 0, winW: 0.8, winH: 1.05, door: pickN(h, [0x6b4a32, 0x2f6b8a, 0x5a7a4a]), flowers: undefined, chimney: false, base: 0.2, baseCol: 0xc9ae7a };
    if (role === 'cottage' || role === 'house') return { tints: R_TINTS.levante, p: { ...flat, floors: Math.min(2, p.floors ?? 2) } };
    return { tints: R_TINTS.levante, p: { ...flat, floors: Math.min(4, Math.max(2, p.floors ?? 3)), balcony: h % 3 === 0 ? { col: 0x6b4a32, flowers: undefined } : undefined } };
  },
  kolonial(role, p, h) {
    // Kolonialstil: ein, zwei Geschosse in kräftigen Farben, hohe Fenstertüren mit Läden, Holzbalkon, Attika über dem
    // Flachdach mit weißem Gesims
    const shutter = pickN(h, [0x2f6b8a, 0x3f7a4a, 0xf3ecdd, 0x8a3b32]);
    const low = role === 'cottage' || role === 'house';
    return { tints: R_TINTS.kolonial, p: { ...PLAIN, floors: low ? 1 : 2, gh: 3.2, fh: 3.0, roof: 'flat', parapet: 0.9, cornice: R_FRAME, roofCol: 0xe8dcc6, frame: R_FRAME, cross: 0, winW: 1.0, winH: 2.1, shutter, base: 0.3, baseCol: 0xf3ecdd, balcony: !low && h % 2 === 0 ? { col: 0x6b4a32, flowers: R_GERANIUM } : undefined, flowers: undefined, chimney: false } };
  },
  altstadt(role, p, h) {
    // Altstadt Mitteleuropas: schmale, hohe Bürgerhäuser in kräftigem Putz, geschweifter oder Treppengiebel zur Straße,
    // manche mit einer Attika vor dem Dach (Krakau), weiße Gesimse
    const d = p.d ?? 9;
    if (role === 'cottage') {
      return { tints: R_TINTS.altstadt, p: { ...PLAIN, roof: 'side', rh: d * 0.5, roofCol: pickN(h, [0xb5603e, 0x8b3e2c]), frame: R_FRAME, dormers: 1, flowers: undefined } };
    }
    const floors = Math.max(3, Math.min(4, (p.floors ?? 3) + 1));
    if (h % 3 === 0) return { tints: R_TINTS.altstadt, p: { ...PLAIN, floors, roof: 'flat', parapet: 1.5, cornice: R_FRAME, roofCol: 0xb5603e, corners: R_FRAME, frame: R_FRAME, winH: 1.6, flowers: undefined, chimney: false } };
    return { tints: R_TINTS.altstadt, p: { ...PLAIN, floors, roof: 'front', gable: pickN(h >> 1, ['bell', 'step', 'bell', 'neck']), rh: p.w * 0.7, roofCol: pickN(h >> 3, [0xb5603e, 0x8b3e2c, 0x86ac9e]), corners: R_FRAME, band: R_FRAME, frame: R_FRAME, winH: 1.6, flowers: undefined, chimney: false } };
  },
  japanese(role, p, h) {
    const d = p.d ?? 9;
    const street = role === 'town' || role === 'shop';
    return { tints: R_TINTS.jp, p: { ...PLAIN, lowerCol: 0x5e4636, floors: Math.max(2, Math.min(p.floors ?? 2, 3)), roof: street ? 'side' : 'hip', rh: street ? d * 0.24 : Math.min(p.w, d) * 0.3, roofCol: R_TILE_DARK, roofT: 0.3, oe: 0.75, eave: R_TILE_DARK, frame: 0x5e4636, cross: 2, flowers: undefined, chimney: false, ground: p.ground === 'garage' ? 'door' : p.ground } };
  },
};

/** Vorgarten oder Vorplatz vor einem zurückgesetzten Haus (Tiefe sb): Rasen mit Weg und Zaun, oder Pflaster mit Gitter. */
function yard(b, w, sb, kind, doorX) {
  const { F, G } = b;
  const near = b.lod === 0;
  const lawn = kind === 'area' || kind === 'plain' ? PAL.sidewalk : PAL.grass[0];
  F.box(0, 0, -sb / 2, w, 0.12, sb, lawn, { skip: 'b' });
  if (kind === 'plain') return; // Boden unter dem Laubengang
  if (kind !== 'area') F.box(doorX, 0.12, -sb / 2, 1.2, 0.02, sb, PAL.sidewalk);
  if (kind === 'picket') {
    // weißer Lattenzaun mit Lücke am Weg
    for (const sgn of [-1, 1]) {
      const x0 = sgn > 0 ? doorX + 0.8 : -w / 2 + 0.1;
      const x1 = sgn > 0 ? w / 2 - 0.1 : doorX - 0.8;
      if (x1 - x0 < 0.4) continue;
      F.box((x0 + x1) / 2, 0.5, -0.25, x1 - x0, 0.07, 0.05, R_FRAME);
      if (near) for (let x = x0 + 0.06; x <= x1; x += 0.16) G.rect(x, 0.12, -0.22, 0.09, 0.85, R_FRAME);
      else G.rect((x0 + x1) / 2, 0.12, -0.22, x1 - x0, 0.8, R_FRAME, { k: 0.95 });
    }
  } else if (kind === 'garden') {
    // niedrige Hecke mit Lücke am Weg, ein Busch
    for (const sgn of [-1, 1]) {
      const x0 = sgn > 0 ? doorX + 0.75 : -w / 2 + 0.1;
      const x1 = sgn > 0 ? w / 2 - 0.1 : doorX - 0.75;
      if (x1 - x0 < 0.4) continue;
      F.rbox((x0 + x1) / 2, 0.12, -0.45, x1 - x0, 0.75, 0.6, 0.2, PAL.crown[2], { g: [0.8, 1.05] });
    }
    if (near) F.ball(w / 2 - 1.2, 0.7, -sb + 1.0, 0.7, PAL.crown[1], { ws: 7, hs: 5 });
  } else {
    // Vorplatz mit schwarzem Gitter (eine Lücke an der Treppe)
    for (const sgn of [-1, 1]) {
      const x0 = sgn > 0 ? doorX + 0.85 : -w / 2 + 0.05;
      const x1 = sgn > 0 ? w / 2 - 0.05 : doorX - 0.85;
      if (x1 - x0 < 0.3) continue;
      F.box((x0 + x1) / 2, 1.0, -0.12, x1 - x0, 0.05, 0.05, PAL.darkMetal);
      if (near) for (let x = x0 + 0.05; x <= x1; x += 0.14) G.rect(x, 0.12, -0.1, 0.03, 0.9, PAL.darkMetal);
    }
  }
}

/** Veranda vor der Front (Amerika): Boden, weiße Pfosten, Pultdach, Geländer, zwei Stufen. Gibt die Tiefe zurück. */
function porch(b, w, gh, base, roofCol, doorX) {
  const F = b.F;
  const near = b.lod === 0;
  const pd = 2.0;
  const pw = w - 0.6;
  F.box(0, 0, pd / 2, pw, base + 0.02, pd, R_FRAME, { g: [0.8, 1] });
  const y1 = base + gh - 0.1;
  const y2 = y1 - 0.5;
  b.at(0, 0, 0, Math.PI / 2, () => F.extrude([[0, y1], [0, y1 + 0.16], [-(pd + 0.25), y2 + 0.16], [-(pd + 0.25), y2]], -pw / 2 - 0.15, pw / 2 + 0.15, roofCol, { g: [0.86, 1.02], crease: 2 }));
  const n = Math.max(2, Math.round(pw / 2.4)) + 1;
  for (let i = 0; i < n; i++) F.box(-pw / 2 + 0.12 + (i * (pw - 0.24)) / (n - 1), base, pd - 0.14, 0.16, y2 - base, 0.16, R_FRAME);
  if (near) {
    for (const sgn of [-1, 1]) {
      const x0 = sgn > 0 ? doorX + 0.75 : -pw / 2 + 0.12;
      const x1 = sgn > 0 ? pw / 2 - 0.12 : doorX - 0.75;
      if (x1 - x0 > 0.3) F.box((x0 + x1) / 2, base + 0.85, pd - 0.14, x1 - x0, 0.07, 0.07, R_FRAME);
    }
  }
  F.box(doorX, 0, pd + 0.2, 1.3, base * 0.5, 0.4, R_FRAME, { skip: 'b' });
  return pd + 0.45;
}

/** Haus der Gegend: setzt das Grundhaus um setback zurück (Vorgarten, Vorplatz) und baut die Veranda an. */
function regionalHouse(b, p) {
  const sb = p.setback ?? 0;
  let info;
  b.at(0, 0, -sb, 0, () => {
    info = house(b, { ...p, roofTint: true });
    if (p.porch) {
      const cols = p.cols ?? Math.max(2, Math.round(p.w / 2.4));
      const dc = p.doorCol ?? (cols > 2 ? 1 : 0);
      porch(b, p.w, p.gh ?? 2.75, p.base ?? 0.3, p.roofCol ?? PAL.roof[0], -p.w / 2 + (p.w / cols) * (dc + 0.5));
    }
  });
  if (sb > 0) {
    const cols = p.cols ?? Math.max(2, Math.round(p.w / 2.4));
    const dc = p.doorCol ?? (cols > 2 ? 1 : 0);
    yard(b, p.w, sb, p.yard ?? 'garden', -p.w / 2 + (p.w / cols) * (dc + 0.5));
  }
  return { ...info, d: info.d + sb };
}

for (const [name, H0] of Object.entries(HOUSES)) {
  const role = roleOf(H0.kind, H0.p);
  const h = hashName(name);
  for (const region of REGIONS) {
    const r = DRESS[region](role, H0.p, h);
    const p = { ...H0.p, ...r.p };
    defs[name + '@' + region] = {
      kind: H0.kind,
      tints: r.tints,
      far: true,
      shop: defs[name].shop,
      region,
      make: (b) => {
        const info = regionalHouse(b, p);
        if (H0.extra && !p.setback) H0.extra(b, info);
        // Baustoff statt Anstrich (Backstein, Schiefer, Sandstein, Holz): der Ort färbt ihn nicht in seine Palette
        return MATERIAL.has(r.tints) ? { ...info, material: true } : info;
      },
    };
  }
}

export function createTownKit(F) {
  return makeKit(F, defs);
}

// Bauteile, die auch die Wahrzeichen benutzen
export { arch, archWin, clock, weathercock, onion, dome, slab };
