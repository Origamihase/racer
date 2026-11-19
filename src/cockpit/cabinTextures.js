// Leinwand-Texturen für den Innenraum: feine Narbung, Stoff und Leder (als Relief), Holz, Lochgitter
// und ein Etiketten-Atlas für die kleinen Dinge (Flasche, Dose, Stream-Technik, Schalter).
import * as THREE from 'three';
import { mulberry32 } from '../util.js';

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function finish(c, { repeat = 0, srgb = true } = {}) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat, repeat);
  }
  t.anisotropy = 8;
  return t;
}

/** Kachelbares, weiches Rauschen (S × S, Werte 0 … 1) mit `cells` Zellen je Kante. */
function tileNoise(S, cells, rnd) {
  const g = new Float32Array(cells * cells);
  for (let i = 0; i < g.length; i++) g[i] = rnd();
  const out = new Float32Array(S * S);
  const sm = (t) => t * t * (3 - 2 * t);
  for (let y = 0; y < S; y++) {
    const fy = (y / S) * cells;
    const y0 = Math.floor(fy);
    const ty = sm(fy - y0);
    for (let x = 0; x < S; x++) {
      const fx = (x / S) * cells;
      const x0 = Math.floor(fx);
      const tx = sm(fx - x0);
      const a = g[(y0 % cells) * cells + (x0 % cells)];
      const b = g[(y0 % cells) * cells + ((x0 + 1) % cells)];
      const c = g[((y0 + 1) % cells) * cells + (x0 % cells)];
      const d = g[((y0 + 1) % cells) * cells + ((x0 + 1) % cells)];
      out[y * S + x] = a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty;
    }
  }
  return out;
}

function grayTexture(S, height, repeat) {
  const c = canvas(S, S);
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(S, S);
  for (let i = 0; i < S * S; i++) {
    const v = Math.round(Math.min(1, Math.max(0, height(i % S, Math.floor(i / S), i))) * 255);
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return finish(c, { repeat, srgb: false });
}

/** Feine Narbung für weiche Kunststoffe (Relief): Körnung in drei Größen, damit sie nah und fern trägt. */
export function grainTexture() {
  const S = 256;
  const rnd = mulberry32(21);
  const a = tileNoise(S, 128, rnd);
  const b = tileNoise(S, 44, rnd);
  const c = tileNoise(S, 12, rnd);
  return grayTexture(S, (x, y, i) => 0.5 + (a[i] - 0.5) * 0.5 + (b[i] - 0.5) * 0.45 + (c[i] - 0.5) * 0.2, 9);
}

/** Gewebter Stoff (Relief): Kett- und Schussfäden im Wechsel, leicht unregelmäßig. */
export function weaveTexture() {
  const S = 128;
  const rnd = mulberry32(8);
  const n = tileNoise(S, 32, rnd);
  const T = 8; // Fadenbreite in Bildpunkten
  return grayTexture(S, (x, y, i) => {
    const cx = Math.floor(x / T);
    const cy = Math.floor(y / T);
    const fx = (x % T) / T;
    const fy = (y % T) / T;
    const over = (cx + cy) % 2 === 0;
    const h = over ? Math.sin(Math.PI * fx) * (0.6 + 0.4 * Math.sin(Math.PI * fy)) : Math.sin(Math.PI * fy) * (0.6 + 0.4 * Math.sin(Math.PI * fx));
    return 0.25 + 0.6 * h + (n[i] - 0.5) * 0.25;
  }, 34);
}

/** Genarbtes Leder (Relief): kleine Kissen mit feinen Furchen dazwischen. */
export function leatherTexture() {
  const S = 256;
  const G = 22;
  const rnd = mulberry32(3);
  const px = new Float32Array(G * G);
  const py = new Float32Array(G * G);
  for (let i = 0; i < G * G; i++) {
    px[i] = rnd();
    py[i] = rnd();
  }
  const fine = tileNoise(S, 96, rnd);
  return grayTexture(S, (x, y, i) => {
    const gx = (x / S) * G;
    const gy = (y / S) * G;
    const cx = Math.floor(gx);
    const cy = Math.floor(gy);
    let f1 = 9;
    let f2 = 9;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const k = ((cy + dy + G) % G) * G + ((cx + dx + G) % G);
        const d = Math.hypot(cx + dx + px[k] - gx, cy + dy + py[k] - gy);
        if (d < f1) {
          f2 = f1;
          f1 = d;
        } else if (d < f2) f2 = d;
      }
    }
    return 0.25 + 0.6 * Math.min(1, (f2 - f1) * 2.6) ** 0.6 + (fine[i] - 0.5) * 0.15;
  }, 11);
}

/** Lochgitter für Lautsprecher (Farbe): versetzte dunkle Löcher mit hellem Rand oben, kachelbar. */
export function perfTexture() {
  const S = 64;
  const c = canvas(S, S);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#8f9299';
  ctx.fillRect(0, 0, S, S);
  const step = 16;
  for (let j = -1; j <= S / (step / 2); j++) {
    for (let i = -1; i <= S / step; i++) {
      const x = i * step + (j % 2 ? step / 2 : 0) + step / 4;
      const y = (j * step) / 2 + step / 4;
      ctx.fillStyle = '#c9ccd2';
      ctx.beginPath();
      ctx.arc(x, y + 1.2, 4.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#17181b';
      ctx.beginPath();
      ctx.arc(x, y, 4.1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  return finish(c, { repeat: 1 });
}

/** Offenporiges Nussbaumholz für die Zierleisten: warm, mit feinen Jahreslinien und dunklen Poren. */
export function walnutTexture() {
  const W = 1024;
  const H = 128;
  const c = canvas(W, H);
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#8a6242');
  g.addColorStop(0.5, '#7a5538');
  g.addColorStop(1, '#6b4930');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  const rnd = mulberry32(12);
  // breite, weiche Maserung
  for (let i = 0; i < 26; i++) {
    const y0 = rnd() * H;
    const amp = 2 + rnd() * 5;
    const ph = rnd() * 6;
    ctx.strokeStyle = rnd() < 0.5 ? `rgba(58,36,22,${0.1 + rnd() * 0.16})` : `rgba(176,132,92,${0.08 + rnd() * 0.12})`;
    ctx.lineWidth = 2 + rnd() * 7;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 16) {
      const y = y0 + Math.sin((x / W) * Math.PI * 2 * (1 + (i % 3)) + ph) * amp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  // feine Jahreslinien
  for (let i = 0; i < 70; i++) {
    const y0 = rnd() * H;
    const ph = rnd() * 6;
    ctx.strokeStyle = `rgba(48,30,18,${0.18 + rnd() * 0.3})`;
    ctx.lineWidth = 0.6 + rnd() * 1.1;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 16) {
      const y = y0 + Math.sin((x / W) * Math.PI * 4 + ph) * 2.2;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  // offene Poren: kurze dunkle Striche
  ctx.strokeStyle = 'rgba(38,24,14,0.55)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 900; i++) {
    const x = rnd() * W;
    const y = rnd() * H;
    const l = 4 + rnd() * 16;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + l, y + (rnd() - 0.5) * 1.2);
    ctx.stroke();
  }
  const t = finish(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

function fit(ctx, text, x, y, maxW, size, weight = 900, font = '"Arial Black", Impact, "Helvetica Neue", Arial, sans-serif') {
  let s = size;
  ctx.font = `${weight} ${s}px ${font}`;
  const w = ctx.measureText(text).width;
  if (w > maxW) {
    s = Math.floor((s * maxW) / w);
    ctx.font = `${weight} ${s}px ${font}`;
  }
  ctx.fillText(text, x, y);
}

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function banana(ctx, x, y, s, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  ctx.beginPath();
  ctx.moveTo(-42, -14);
  ctx.quadraticCurveTo(0, 30, 44, -20);
  ctx.quadraticCurveTo(47, -24, 43, -27);
  ctx.quadraticCurveTo(2, 6, -38, -24);
  ctx.quadraticCurveTo(-45, -22, -42, -14);
  ctx.closePath();
  ctx.fillStyle = '#ffd92e';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#8a5a12';
  ctx.stroke();
  ctx.fillStyle = '#6b4310';
  ctx.fillRect(41, -29, 6, 6);
  ctx.restore();
}

function cloud(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x - 16 * s, y + 4 * s, 12 * s, 0, Math.PI * 2);
  ctx.arc(x, y - 6 * s, 16 * s, 0, Math.PI * 2);
  ctx.arc(x + 17 * s, y + 3 * s, 13 * s, 0, Math.PI * 2);
  ctx.rect(x - 16 * s, y + 2 * s, 33 * s, 14 * s);
  ctx.fill();
}

// Kacheln des Atlas in Bildpunkten [x, y, w, h] (1024 × 1024)
const TILE = {
  saft: [0, 0, 640, 224],
  cola: [0, 232, 640, 248],
  box: [0, 488, 384, 160],
  boxFront: [0, 656, 384, 72],
  fenster: [392, 488, 128, 96],
  tuer: [528, 488, 96, 96],
  kamera: [648, 0, 192, 128],
  matte: [648, 136, 368, 368],
  karte: [392, 592, 224, 136],
};

/** uv-Rechteck [u0, v0, u1, v1] einer Atlas-Kachel (mit kleinem Rand gegen Ausbluten). */
export function tileUV(name, pad = 2) {
  const [x, y, w, h] = TILE[name];
  return [(x + pad) / 1024, 1 - (y + h - pad) / 1024, (x + w - pad) / 1024, 1 - (y + pad) / 1024];
}

/** Etiketten-Atlas: Bananensaft, Dampfcola, Stream-Technik, Schalter-Symbole, Kamera-Rückseite, Fußmatte. */
export function labelAtlas() {
  const c = canvas(1024, 1024);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 1024, 1024);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // --- Bananensaft (Rundum-Etikett, Naht hinten bei x = 0) ---
  {
    const [x, y, w, h] = TILE.saft;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#fff6cf';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#2f9e44';
    ctx.fillRect(0, 0, w, 20);
    ctx.fillRect(0, h - 20, w, 20);
    ctx.fillStyle = '#ffd92e';
    ctx.fillRect(0, 20, w, 8);
    ctx.fillRect(0, h - 28, w, 8);
    for (const cx of [w * 0.5]) {
      ctx.fillStyle = '#ffe566';
      ctx.beginPath();
      ctx.ellipse(cx, h / 2, 150, 78, 0, 0, Math.PI * 2);
      ctx.fill();
      banana(ctx, cx, h / 2 - 34, 1.15, -0.12);
      ctx.fillStyle = '#3d2a0c';
      fit(ctx, 'BANANENSAFT', cx, h / 2 + 34, 270, 44);
      ctx.fillStyle = '#2f7d32';
      fit(ctx, 'naturtrüb · 0,5 l', cx, h / 2 + 70, 200, 20, 700, 'Arial, sans-serif');
    }
    // Rückseite: kleine Bananen und „Lieblingssaft“
    for (const cx of [w * 0.1, w * 0.9]) {
      banana(ctx, cx, h / 2 - 22, 0.6, 0.3);
      ctx.fillStyle = '#3d2a0c';
      fit(ctx, 'Lieblingssaft', cx, h / 2 + 30, 110, 18, 700, 'Arial, sans-serif');
    }
    ctx.restore();
  }

  // --- Dampfcola (Dose, Rundum) ---
  {
    const [x, y, w, h] = TILE.cola;
    ctx.save();
    ctx.translate(x, y);
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#2a2f6b');
    g.addColorStop(1, '#1b1f4a');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ff8a3c';
    ctx.fillRect(0, 0, w, 14);
    ctx.fillRect(0, h - 14, w, 14);
    // Dampfwolken steigen auf
    cloud(ctx, w * 0.5 - 92, 62, 1.3, 'rgba(255,255,255,0.92)');
    cloud(ctx, w * 0.5 + 96, 48, 1.0, 'rgba(255,255,255,0.75)');
    cloud(ctx, w * 0.5 + 10, 40, 0.8, 'rgba(255,255,255,0.6)');
    ctx.fillStyle = '#ffffff';
    fit(ctx, 'DAMPF', w * 0.5, h * 0.5 + 6, 250, 64);
    ctx.fillStyle = '#ff8a3c';
    fit(ctx, 'COLA', w * 0.5, h * 0.5 + 62, 190, 54);
    ctx.fillStyle = '#c9d0ff';
    fit(ctx, 'prickelt wie der Chat · 0,33 l', w * 0.5, h - 34, 250, 17, 700, 'Arial, sans-serif');
    for (const cx of [w * 0.09, w * 0.91]) cloud(ctx, cx, h * 0.5, 1.1, 'rgba(255,255,255,0.5)');
    ctx.restore();
  }

  // --- Stream-Technik (Deckel der Bonding-Box) ---
  {
    const [x, y, w, h] = TILE.box;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#2b2d33';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#d8d2c6';
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 7]);
    rr(ctx, 12, 12, w - 24, h - 24, 18);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#f2efe8';
    fit(ctx, 'STREAM-TECHNIK', w / 2, 62, w - 80, 36);
    ctx.fillStyle = '#ff5a4d';
    ctx.beginPath();
    ctx.arc(64, 112, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#b9bcc4';
    ctx.textAlign = 'left';
    fit(ctx, 'LIVE · 3 Netze gebündelt', 84, 113, w - 130, 20, 700, 'Arial, sans-serif');
    ctx.textAlign = 'center';
    ctx.restore();
  }
  {
    const [x, y, w, h] = TILE.boxFront;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#1d1f23';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#9aa0aa';
    for (let i = 0; i < 3; i++) fit(ctx, 'NETZ ' + (i + 1), w * (0.2 + i * 0.3), h * 0.72, 90, 18, 700, 'Arial, sans-serif');
    ctx.restore();
  }

  // --- Fensterheber (zwei Wippen von oben) und Türöffner ---
  {
    const [x, y, w, h] = TILE.fenster;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#16171a';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#d5d8de';
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';
    rr(ctx, 38, 22, 52, 40, 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(50, 78);
    ctx.lineTo(64, 68);
    ctx.lineTo(78, 78);
    ctx.stroke();
    ctx.restore();
  }
  {
    const [x, y, w, h] = TILE.tuer;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#16171a';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#e8eaee';
    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    // offene Tür
    ctx.beginPath();
    ctx.moveTo(30, 24);
    ctx.lineTo(30, 72);
    ctx.lineTo(56, 80);
    ctx.lineTo(56, 16);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(66, 48);
    ctx.lineTo(80, 48);
    ctx.moveTo(74, 41);
    ctx.lineTo(81, 48);
    ctx.lineTo(74, 55);
    ctx.stroke();
    ctx.restore();
  }

  // --- Rückseite der Action-Cam: Rahmen ums Display, zwei Knöpfe ---
  {
    const [x, y, w, h] = TILE.kamera;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#202227';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#9da2ab';
    ctx.textAlign = 'left';
    fit(ctx, 'ROAD-CAM 4K', 12, h - 16, 110, 15, 700, 'Arial, sans-serif');
    ctx.textAlign = 'center';
    ctx.restore();
  }

  // --- Fußmatte: Gummi-Rauten, heller Kedernaht-Rand, Stickerei ---
  {
    const [x, y, w, h] = TILE.matte;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#26282d';
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    rr(ctx, 14, 14, w - 28, h - 28, 30);
    ctx.clip();
    ctx.strokeStyle = '#33363c';
    ctx.lineWidth = 5;
    for (let i = -h; i < w + h; i += 26) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h, h);
      ctx.moveTo(i + h, 0);
      ctx.lineTo(i, h);
      ctx.stroke();
    }
    ctx.restore();
    ctx.strokeStyle = '#cfc8bb';
    ctx.lineWidth = 4;
    ctx.setLineDash([14, 8]);
    rr(ctx, 16, 16, w - 32, h - 32, 28);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#26282d';
    rr(ctx, w / 2 - 110, h - 104, 220, 58, 14);
    ctx.fill();
    ctx.fillStyle = '#e6e1d6';
    fit(ctx, 'MINI ADAM', w / 2, h - 74, 190, 30);
    ctx.restore();
  }

  // --- Schlüsselkarte in der Ablage ---
  {
    const [x, y, w, h] = TILE.karte;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#17181b';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#f2efe8';
    fit(ctx, 'LIVE', w / 2, h / 2 - 8, 120, 46);
    ctx.fillStyle = '#9aa0aa';
    fit(ctx, 'Schlüsselkarte', w / 2, h - 26, 150, 16, 700, 'Arial, sans-serif');
    ctx.restore();
  }
  const t = finish(c);
  return t;
}

// Kacheln des Decal-Atlas (weiße Zeichen auf durchsichtigem Grund, 512 × 512)
const DECAL = {
  live: [0, 0, 256, 256],
};

/** uv-Rechteck einer Decal-Kachel. */
export function decalUV(name, pad = 1) {
  const [x, y, w, h] = DECAL[name];
  return [(x + pad) / 512, 1 - (y + h - pad) / 512, (x + w - pad) / 512, 1 - (y + pad) / 512];
}

/** Decal-Atlas: Aufdrucke, die ohne Rahmen auf gepolsterten Flächen liegen (LIVE-Logo der Prallplatte). */
export function decalAtlas(logoCanvas) {
  const c = canvas(512, 512);
  const ctx = c.getContext('2d');
  {
    // das LIVE-Logo eng beschnitten (im Original nimmt es nur gut zwei Drittel der Fläche ein)
    const [x, y, w, h] = DECAL.live;
    const sw = logoCanvas.width;
    const sh = logoCanvas.height;
    ctx.drawImage(logoCanvas, sw * 0.13, sh * 0.115, sw * 0.74, sh * 0.76, x + 8, y + 8, w - 16, h - 16);
  }
  const t = finish(c);
  t.anisotropy = 8;
  return t;
}
