// Gezeichnete Karte einer BrunnenTV-Folge, wo kein Standbild gespeichert ist (Album, Abspann): Himmel, eine Häuserzeile
// in den Farben des Orts, Pflaster und der Brunnen der Folge von vorn – in der Gestalt und den Steinfarben seiner Art
// (world/kit/layout.js, gebaut in world/kit/fountains.js) –, unten der Ort, oben rechts die Nummer der Folge. Zwei
// Karten sehen nur gleich aus, wenn Art, Ort und Nummer gleich sind.

export const CARD = { w: 288, h: 162 };

const WATER = '#7cc8ec';
const JET = 'rgba(238, 249, 255, 0.95)';
const GOLD = '#f0c04a';
const WOOD = '#8a5a3c';
const GREEN = '#5fb84a';
const PATINA = '#78ab8f';
const INK = '#0e3a63';
const FONT = '"Trebuchet MS", "Segoe UI", "DejaVu Sans", Arial, sans-serif';
// Häuser hinter dem Platz: Putz, Dach
const WALLS = ['#f3d9a4', '#efc2b4', '#d9e6c4', '#c9dcef', '#f2e6c9', '#e8c8d8', '#f6cf9a', '#d3d8e6'];
const ROOFS = ['#b5443a', '#8795a6', '#a5553f', '#66727f'];

// Stein und Gestalt je Art (wie die Bausteine: Sandstein, roter Sandstein, Kalkstein, Feldstein, Granit, Basalt)
const LOOK = {
  fountainTrough: { stone: '#e8cfa0', shape: 'trough' },
  fountainWell: { stone: '#aea18f', shape: 'well' },
  fountainFrog: { stone: '#ddd3be', shape: 'frog' },
  fountainGoose: { stone: '#d5a48e', shape: 'goose' },
  fountainFish: { stone: '#b0b2b2', shape: 'fish' },
  fountainLion: { stone: '#ddc192', shape: 'lion' },
  fountainMarket: { stone: '#e8cfa0', shape: 'market' },
  fountainCube: { stone: '#66717d', shape: 'cube' },
  fountainBowls: { stone: '#c98a6e', shape: 'bowls' },
  fountainRing: { stone: '#ddd3be', shape: 'ring' },
  fountainJets: { stone: '#d3cbbd', shape: 'jets' },
  fountainPond: { stone: '#bdb3a2', shape: 'pond' },
  fountainGrand: { stone: '#efddbc', shape: 'grand' },
  fountainOrigin: { stone: '#e8cfa0', shape: 'origin' },
  fountainBoss: { stone: '#eed9b8', shape: 'boss' },
  fountainWall: { stone: '#e8cfa0', shape: 'lion' },
  fountainDrink: { stone: '#bdb3a2', shape: 'cube' },
};

/** Gestalt einer Brunnenart auf der Karte (unbekannte Arten: die Schalen). */
export const cardShape = (kind) => (LOOK[kind] ?? LOOK.fountainBowls).shape;

/** Farbe hex heller (k > 1) oder dunkler (k < 1). */
function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v) => Math.max(0, Math.min(255, Math.round(k > 1 ? v + (255 - v) * (k - 1) : v * k)));
  return `rgb(${ch((n >> 16) & 255)}, ${ch((n >> 8) & 255)}, ${ch(n & 255)})`;
}

function hash(s) {
  let h = 2166136261;
  for (const c of String(s)) h = Math.imul(h ^ c.codePointAt(0), 16777619);
  return h >>> 0;
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function rect(ctx, x, y, w, h, fill, r = 0) {
  ctx.beginPath();
  if (r > 0 && ctx.roundRect) ctx.roundRect(x, y, w, h, r);
  else ctx.rect(x, y, w, h);
  ctx.fillStyle = fill;
  ctx.fill();
}

/** Stein mit Rundung: dunkler an den Rändern. */
function stoneFill(ctx, x, w, stone) {
  const g = ctx.createLinearGradient(x, 0, x + w, 0);
  g.addColorStop(0, shade(stone, 0.78));
  g.addColorStop(0.35, shade(stone, 1.06));
  g.addColorStop(0.7, stone);
  g.addColorStop(1, shade(stone, 0.8));
  return g;
}

/** Rundes (oder achteckiges) Becken von vorn: Wand, Rand und Wasser; gy = Boden, Rückgabe: Höhe der Wasserfläche. */
function basin(ctx, cx, gy, w, h, stone, o = {}) {
  const ry = w * 0.085;
  rect(ctx, cx - w / 2, gy - h, w, h, stoneFill(ctx, cx - w / 2, w, stone), Math.min(6, h / 3));
  if (o.oct) {
    ctx.strokeStyle = shade(stone, 0.72);
    ctx.lineWidth = 1.2;
    for (const k of [-0.3, 0.3]) {
      ctx.beginPath();
      ctx.moveTo(cx + k * w, gy - h + 2);
      ctx.lineTo(cx + k * w, gy - 1);
      ctx.stroke();
    }
  }
  // Sockelband und Rand
  rect(ctx, cx - w / 2 - 2, gy - 4, w + 4, 4, shade(stone, 0.7), 2);
  ellipse(ctx, cx, gy - h, w / 2 + 2, ry + 2, shade(stone, 1.12));
  ellipse(ctx, cx, gy - h, w / 2 - 4, ry - 1, o.water ?? WATER);
  ellipse(ctx, cx - w * 0.12, gy - h - ry * 0.25, w * 0.14, ry * 0.3, 'rgba(255, 255, 255, 0.45)');
  return gy - h;
}

/** Säule mit Fuß und Kapitell von yb (unten) bis yt (oben). */
function column(ctx, cx, yb, yt, w, stone) {
  rect(ctx, cx - w / 2, yt, w, yb - yt, stoneFill(ctx, cx - w / 2, w, stone));
  rect(ctx, cx - w * 0.8, yb - 4, w * 1.6, 4, shade(stone, 0.85), 1.5);
  rect(ctx, cx - w * 0.85, yt - 3, w * 1.7, 4, shade(stone, 1.1), 1.5);
}

/** Wasserbogen von (x0, y0) nach (x1, y1), lift: so hoch über dem höheren Ende. */
function arc(ctx, x0, y0, x1, y1, lift, wd = 2.2) {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.quadraticCurveTo((x0 + x1) / 2, Math.min(y0, y1) - lift, x1, y1);
  ctx.strokeStyle = JET;
  ctx.lineWidth = wd;
  ctx.lineCap = 'round';
  ctx.stroke();
  ellipse(ctx, x1, y1, 3.2, 1.2, 'rgba(255, 255, 255, 0.85)');
}

/** Strahl senkrecht nach oben mit Sprühkrone. */
function jetUp(ctx, x, y, h, wd = 2) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - h);
  ctx.strokeStyle = JET;
  ctx.lineWidth = wd;
  ctx.lineCap = 'round';
  ctx.stroke();
  for (const [dx, dy] of [[-3, 2], [3, 1], [-1.5, -1.5], [1.6, -2.2]]) ellipse(ctx, x + dx, y - h + dy, 1.2, 1.2, JET);
}

function bear(ctx, x, y, s) {
  ellipse(ctx, x, y - 6 * s, 5 * s, 6.5 * s, GOLD);
  ellipse(ctx, x, y - 15 * s, 4.2 * s, 3.8 * s, GOLD);
  ellipse(ctx, x - 3.4 * s, y - 18 * s, 1.6 * s, 1.6 * s, GOLD);
  ellipse(ctx, x + 3.4 * s, y - 18 * s, 1.6 * s, 1.6 * s, GOLD);
  ellipse(ctx, x, y - 14 * s, 1.8 * s, 1.3 * s, shade(GOLD, 1.25));
  ellipse(ctx, x - 1.5 * s, y - 16 * s, 0.6 * s, 0.6 * s, '#5a3e14');
  ellipse(ctx, x + 1.5 * s, y - 16 * s, 0.6 * s, 0.6 * s, '#5a3e14');
}

function frog(ctx, x, y, s) {
  ellipse(ctx, x, y - 7 * s, 10 * s, 7.5 * s, GREEN);
  ellipse(ctx, x, y - 5 * s, 6 * s, 4.5 * s, '#c4e79c');
  for (const k of [-1, 1]) {
    ellipse(ctx, x + k * 5.5 * s, y - 14 * s, 3.4 * s, 3.4 * s, GREEN);
    ellipse(ctx, x + k * 5.5 * s, y - 14.3 * s, 2.2 * s, 2.2 * s, '#ffffff');
    ellipse(ctx, x + k * 5.5 * s, y - 14 * s, 1.1 * s, 1.1 * s, '#1d2a38');
  }
  ctx.beginPath();
  ctx.arc(x, y - 10.5 * s, 4 * s, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.strokeStyle = '#2f6a2a';
  ctx.lineWidth = 1.1 * s;
  ctx.stroke();
}

function gooseGirl(ctx, x, y, s) {
  // Kleid, Kopf mit Haube, Arm um die Gans
  ctx.beginPath();
  ctx.moveTo(x - 6 * s, y);
  ctx.lineTo(x + 6 * s, y);
  ctx.lineTo(x + 2.4 * s, y - 15 * s);
  ctx.lineTo(x - 2.4 * s, y - 15 * s);
  ctx.closePath();
  ctx.fillStyle = PATINA;
  ctx.fill();
  ellipse(ctx, x, y - 18.5 * s, 3.4 * s, 3.6 * s, shade(PATINA, 1.15));
  ellipse(ctx, x, y - 20.5 * s, 3.8 * s, 1.8 * s, shade(PATINA, 0.85));
  // die Gans unter dem Arm, ihr Schnabel spuckt
  ellipse(ctx, x + 5.5 * s, y - 9.5 * s, 4.6 * s, 3 * s, '#f6f6f2');
  ctx.beginPath();
  ctx.moveTo(x + 8.5 * s, y - 10.5 * s);
  ctx.quadraticCurveTo(x + 11 * s, y - 16 * s, x + 9 * s, y - 17 * s);
  ctx.strokeStyle = '#f6f6f2';
  ctx.lineWidth = 2 * s;
  ctx.stroke();
  ellipse(ctx, x + 9 * s, y - 17.3 * s, 1.8 * s, 1.6 * s, '#f6f6f2');
  ellipse(ctx, x + 11 * s, y - 17 * s, 1.3 * s, 0.6 * s, '#f08a2c');
}

function fish(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.55);
  ellipse(ctx, 0, 0, 9 * s, 4.6 * s, '#f08a2c');
  ctx.beginPath();
  ctx.moveTo(-8 * s, 0);
  ctx.lineTo(-14 * s, -4.5 * s);
  ctx.lineTo(-14 * s, 4.5 * s);
  ctx.closePath();
  ctx.fillStyle = '#e0702a';
  ctx.fill();
  ellipse(ctx, 5 * s, -1.2 * s, 1.3 * s, 1.3 * s, '#ffffff');
  ellipse(ctx, 5.3 * s, -1.2 * s, 0.7 * s, 0.7 * s, '#1d2a38');
  ctx.restore();
}

function lionMask(ctx, x, y, s) {
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    ellipse(ctx, x + Math.cos(a) * 4.6 * s, y + Math.sin(a) * 4.6 * s, 2.4 * s, 2.4 * s, '#d59d44');
  }
  ellipse(ctx, x, y, 4.6 * s, 4.6 * s, '#d59d44');
  ellipse(ctx, x, y + 0.4 * s, 3.3 * s, 3.1 * s, '#f0c879');
  ellipse(ctx, x - 1.3 * s, y - 0.8 * s, 0.55 * s, 0.55 * s, '#5a3e14');
  ellipse(ctx, x + 1.3 * s, y - 0.8 * s, 0.55 * s, 0.55 * s, '#5a3e14');
  ellipse(ctx, x, y + 0.9 * s, 0.9 * s, 0.6 * s, '#8a5a2c');
}

function house(ctx, x, w, top, wall, roof) {
  rect(ctx, x, top, w, 112 - top, wall);
  ctx.beginPath();
  ctx.moveTo(x - 2, top);
  ctx.lineTo(x + w / 2, top - w * 0.32);
  ctx.lineTo(x + w + 2, top);
  ctx.closePath();
  ctx.fillStyle = roof;
  ctx.fill();
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 2; c++) {
      const wy = top + 6 + r * 13;
      if (wy > 102) continue;
      rect(ctx, x + w * (0.2 + c * 0.42), wy, w * 0.2, 7, '#a9d6f2', 1);
    }
  }
}

/** Der Brunnen einer Gestalt, Mitte cx, Boden gy, Steinfarbe stone. */
function drawFountain(ctx, shape, cx, gy, stone) {
  switch (shape) {
    case 'trough': {
      column(ctx, cx - 30, gy, gy - 48, 8, stone);
      ellipse(ctx, cx - 30, gy - 50, 5, 3.5, shade(stone, 1.1));
      rect(ctx, cx - 26, gy - 34, 9, 2.6, '#4a4f57', 1);
      rect(ctx, cx - 24, gy - 24, 58, 24, stoneFill(ctx, cx - 24, 58, stone), 4);
      rect(ctx, cx - 22, gy - 26, 54, 4, WATER, 2);
      arc(ctx, cx - 17, gy - 33, cx - 8, gy - 24, 2, 2.4);
      for (let i = 0; i < 5; i++) ellipse(ctx, cx + 2 + i * 6, gy - 27 - (i % 2) * 2, 3, 2.6, ['#e5483a', '#ffd23f', '#f4a6c0', '#f08a2c', '#b07cc6'][i]);
      break;
    }
    case 'well': {
      const top = basin(ctx, cx, gy, 44, 26, stone, { water: '#3d6f8f' });
      for (const k of [-1, 1]) rect(ctx, cx + k * 19 - 2.5, gy - 64, 5, 40, WOOD, 1);
      ctx.beginPath();
      ctx.moveTo(cx - 32, gy - 60);
      ctx.lineTo(cx, gy - 80);
      ctx.lineTo(cx + 32, gy - 60);
      ctx.closePath();
      ctx.fillStyle = '#c84a3a';
      ctx.fill();
      rect(ctx, cx - 17, gy - 52, 34, 3, shade(WOOD, 1.2), 1);
      ctx.beginPath();
      ctx.moveTo(cx + 2, gy - 50);
      ctx.lineTo(cx + 2, gy - 38);
      ctx.strokeStyle = '#6b5a44';
      ctx.lineWidth = 1;
      ctx.stroke();
      rect(ctx, cx - 2, gy - 38, 8, 7, '#9a6a3c', 1.5);
      ellipse(ctx, cx, top, 4, 1, 'rgba(255, 255, 255, 0.4)');
      break;
    }
    case 'frog': {
      const wy = basin(ctx, cx, gy, 92, 20, stone);
      ellipse(ctx, cx, wy - 8, 9, 9, shade(stone, 0.95));
      frog(ctx, cx, wy - 15, 1.35);
      arc(ctx, cx + 4, wy - 29, cx + 34, wy - 2, 10);
      frog(ctx, cx - 36, wy + 1, 0.55);
      frog(ctx, cx + 38, wy + 1, 0.55);
      break;
    }
    case 'goose': {
      const wy = basin(ctx, cx, gy, 96, 22, stone, { oct: true });
      column(ctx, cx, wy - 2, wy - 26, 9, stone);
      ellipse(ctx, cx, wy - 24, 14, 3.5, shade(stone, 1.1));
      ellipse(ctx, cx, wy - 24, 11, 2.2, WATER);
      gooseGirl(ctx, cx, wy - 27, 1.25);
      arc(ctx, cx + 14, wy - 48, cx + 30, wy - 23, 4);
      break;
    }
    case 'fish': {
      const wy = basin(ctx, cx, gy, 94, 20, stone);
      for (const [dx, r] of [[-7, 7], [5, 8], [0, 10]]) ellipse(ctx, cx + dx, wy - 4, r, r * 0.8, '#9aa0a6');
      fish(ctx, cx + 2, wy - 20, 1.25);
      jetUp(ctx, cx + 11, wy - 26, 22, 2.4);
      for (const k of [-1, 1]) {
        ellipse(ctx, cx + k * 38, wy - 1, 4, 2.2, '#f08a2c');
        arc(ctx, cx + k * 36, wy - 2, cx + k * 22, wy, 3, 1.6);
      }
      break;
    }
    case 'lion': {
      const w = 92;
      rect(ctx, cx - w / 2, gy - 58, w, 58, stoneFill(ctx, cx - w / 2, w, stone), 3);
      ctx.beginPath();
      ctx.moveTo(cx - w / 2 - 3, gy - 58);
      ctx.lineTo(cx, gy - 74);
      ctx.lineTo(cx + w / 2 + 3, gy - 58);
      ctx.closePath();
      ctx.fillStyle = shade(stone, 1.08);
      ctx.fill();
      ellipse(ctx, cx, gy - 76, 3.4, 3.4, GOLD);
      for (const k of [-1, 0, 1]) {
        rect(ctx, cx + k * 28 - 10, gy - 52, 20, 26, shade(stone, 0.88), 9);
        lionMask(ctx, cx + k * 28, gy - 42, 1.35);
      }
      rect(ctx, cx - w / 2 - 4, gy - 20, w + 8, 20, stoneFill(ctx, cx - w / 2 - 4, w + 8, shade(stone, 1.04)), 3);
      rect(ctx, cx - w / 2, gy - 22, w, 4, WATER, 2);
      for (const k of [-1, 0, 1]) arc(ctx, cx + k * 28, gy - 38, cx + k * 28 + 3, gy - 21, 1, 1.8);
      break;
    }
    case 'market': {
      const wy = basin(ctx, cx, gy, 110, 22, stone);
      column(ctx, cx, wy - 2, wy - 56, 10, stone);
      bear(ctx, cx, wy - 60, 1.15);
      for (const k of [-1, 1]) arc(ctx, cx + k * 6, wy - 30, cx + k * 34, wy - 1, 6);
      break;
    }
    case 'cube': {
      rect(ctx, cx - 54, gy - 6, 108, 6, shade(stone, 0.8), 2);
      rect(ctx, cx - 50, gy - 8, 100, 3, WATER, 1.5);
      rect(ctx, cx - 40, gy - 40, 80, 33, stone, 3);
      const g = ctx.createLinearGradient(0, gy - 40, 0, gy - 8);
      g.addColorStop(0, 'rgba(160, 214, 240, 0.85)');
      g.addColorStop(1, 'rgba(124, 200, 236, 0.55)');
      rect(ctx, cx - 39, gy - 38, 78, 30, g, 2);
      ellipse(ctx, cx, gy - 40, 41, 4, shade(WATER, 1.15));
      for (const dx of [-18, 4, 20]) jetUp(ctx, cx + dx, gy - 41, 10 + ((dx + 30) % 7), 1.6);
      break;
    }
    case 'bowls': {
      const wy = basin(ctx, cx, gy, 104, 22, stone);
      column(ctx, cx, wy - 2, wy - 50, 7, stone);
      for (const [y, w] of [[wy - 26, 50], [wy - 46, 30]]) {
        ctx.beginPath();
        ctx.moveTo(cx - w / 2, y);
        ctx.quadraticCurveTo(cx, y + 12, cx + w / 2, y);
        ctx.closePath();
        ctx.fillStyle = shade(stone, 1.05);
        ctx.fill();
        ellipse(ctx, cx, y, w / 2, 3, WATER);
        for (const k of [-1, 1]) arc(ctx, cx + (k * w) / 2, y, cx + k * (w / 2 + 5), y + (y === wy - 26 ? 24 : 18), 1, 1.8);
      }
      jetUp(ctx, cx, wy - 50, 12);
      break;
    }
    case 'ring': {
      const wy = basin(ctx, cx, gy, 136, 16, stone);
      ellipse(ctx, cx, wy - 1, 7, 3.5, 'rgba(255, 255, 255, 0.9)');
      for (const k of [-1, -0.55, 0.55, 1]) arc(ctx, cx + k * 62, wy - 1, cx + k * 6, wy - 2, 20, 1.8);
      break;
    }
    case 'jets': {
      ellipse(ctx, cx, gy - 4, 74, 9, shade(stone, 0.92));
      ellipse(ctx, cx, gy - 5, 66, 7, 'rgba(124, 200, 236, 0.6)');
      for (let i = 0; i < 9; i++) jetUp(ctx, cx - 56 + i * 14, gy - 6 + (i % 2) * 2, 18 + ((i * 7) % 4) * 9, 1.8);
      break;
    }
    case 'pond': {
      ellipse(ctx, cx, gy - 4, 92, 13, '#7fb36a');
      ellipse(ctx, cx, gy - 5, 82, 9, WATER);
      jetUp(ctx, cx, gy - 6, 64, 3);
      for (const k of [-1, 1]) ellipse(ctx, cx + k * 60, gy - 9, 8, 6, '#4a8f4a');
      break;
    }
    case 'grand': {
      const wy = basin(ctx, cx, gy, 150, 22, stone);
      column(ctx, cx, wy - 2, wy - 40, 14, stone);
      ellipse(ctx, cx, wy - 40, 32, 5, shade(stone, 1.1));
      ellipse(ctx, cx, wy - 40, 28, 3, WATER);
      column(ctx, cx, wy - 42, wy - 62, 8, stone);
      ellipse(ctx, cx, wy - 64, 6, 6, GOLD);
      for (const k of [-1, 1]) {
        bear(ctx, cx + k * 58, wy - 2, 0.75);
        arc(ctx, cx + k * 30, wy - 40, cx + k * 46, wy - 1, 4);
      }
      jetUp(ctx, cx, wy - 70, 14);
      break;
    }
    case 'origin':
    case 'boss': {
      const big = shape === 'boss';
      const wy = basin(ctx, cx, gy, big ? 150 : 112, big ? 26 : 22, stone);
      column(ctx, cx, wy - 2, wy - (big ? 60 : 46), big ? 16 : 11, stone);
      ellipse(ctx, cx, wy - (big ? 64 : 50), big ? 9 : 7, big ? 9 : 7, GOLD);
      if (big) for (const k of [-1, 1]) arc(ctx, cx + k * 8, wy - 52, cx + k * 60, wy - 1, 14, 2.6);
      else arc(ctx, cx + 6, wy - 34, cx + 40, wy - 1, 8);
      break;
    }
    default:
      basin(ctx, cx, gy, 100, 22, stone);
  }
}

/** Kürzt text mit „…“, bis er in w Pixel passt. */
function fitText(ctx, text, w) {
  if (ctx.measureText(text).width <= w) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(t + '…').width > w) t = t.slice(0, -1);
  return t.trimEnd() + '…';
}

/**
 * Zeichnet die Karte einer Folge auf canvas (CARD.w × CARD.h): kind = Brunnenart, place = Name des Orts, n = Nummer
 * der Folge.
 */
export function drawFountainCard(canvas, { kind, place = '', n = 0 }) {
  canvas.width = CARD.w;
  canvas.height = CARD.h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  const look = LOOK[kind] ?? LOOK.fountainBowls;
  const h = hash(place + '|' + kind);
  const sky = ctx.createLinearGradient(0, 0, 0, 112);
  sky.addColorStop(0, '#8fd2ff');
  sky.addColorStop(1, '#d8f1ff');
  rect(ctx, 0, 0, CARD.w, 112, sky);
  // Häuser des Orts (Farben aus seinem Namen)
  let x = -6 - (h % 13);
  for (let i = 0; x < CARD.w; i++) {
    const w = 34 + ((h >> (i % 24)) % 14);
    const top = 48 + ((h >> ((i * 3) % 26)) % 22);
    house(ctx, x, w, top, WALLS[(h + i * 5) % WALLS.length], ROOFS[(h >> 3) % ROOFS.length]);
    x += w + 2;
  }
  const ground = ctx.createLinearGradient(0, 112, 0, CARD.h);
  ground.addColorStop(0, '#d9cdbd');
  ground.addColorStop(1, '#c2b4a2');
  rect(ctx, 0, 110, CARD.w, CARD.h - 110, ground);
  ellipse(ctx, CARD.w / 2, 131, 112, 15, '#cbbca9');
  ellipse(ctx, CARD.w / 2, 131, 104, 12, '#d7cab8');
  drawFountain(ctx, look.shape, CARD.w / 2, 132, look.stone);
  // der Ort unten links, die Nummer oben rechts
  ctx.font = `800 15px ${FONT}`;
  const label = fitText(ctx, place, CARD.w - 24);
  const lw = ctx.measureText(label).width;
  rect(ctx, 6, CARD.h - 27, lw + 14, 21, 'rgba(255, 255, 255, 0.86)', 7);
  ctx.fillStyle = INK;
  ctx.textBaseline = 'middle';
  ctx.fillText(label, 13, CARD.h - 16);
  if (n > 0) {
    ctx.font = `800 14px ${FONT}`;
    const tag = '#' + n;
    const tw = ctx.measureText(tag).width;
    rect(ctx, CARD.w - tw - 18, 6, tw + 12, 20, 'rgba(255, 255, 255, 0.86)', 7);
    ctx.fillStyle = INK;
    ctx.fillText(tag, CARD.w - tw - 12, 16.5);
  }
  return canvas;
}

/** Neue Leinwand mit der Karte (siehe drawFountainCard), Klasse cls. */
export function fountainCard(o, cls = 'ep-card') {
  const canvas = document.createElement('canvas');
  canvas.className = cls;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', `BrunnenTV Folge ${o.n} in ${o.place} (gezeichnet)`);
  return drawFountainCard(canvas, o);
}
