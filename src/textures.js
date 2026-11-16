// Prozedurale Texturen (Canvas) – keine externen Bilddateien nötig.
import * as THREE from 'three';
import { mulberry32 } from './util.js';

let maxAniso = 8;
export function setMaxAnisotropy(v) {
  maxAniso = v;
}

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function tex(c, { repeat = false, srgb = true, aniso = true } = {}) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  if (aniso) t.anisotropy = maxAniso;
  t.needsUpdate = true;
  return t;
}

function noiseFill(ctx, w, h, base, amount, seed = 1, size = 1) {
  const rnd = mulberry32(seed);
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let y = 0; y < h; y += size) {
    for (let x = 0; x < w; x += size) {
      const n = (rnd() - 0.5) * amount;
      for (let yy = 0; yy < size && y + yy < h; yy++) {
        for (let xx = 0; xx < size && x + xx < w; xx++) {
          const i = ((y + yy) * w + (x + xx)) * 4;
          d[i] = base[0] + n;
          d[i + 1] = base[1] + n;
          d[i + 2] = base[2] + n;
          d[i + 3] = 255;
        }
      }
    }
  }
  ctx.putImageData(img, 0, 0);
}

// ---------------------------------------------------------------------------
// Autobahn: 4 Fahrstreifen + Standstreifen, deutsche Markierungen (6 m Strich, 12 m Lücke)
// Die Textur deckt x = -8.25 … +10.5 m (18.75 m) und 36 m Länge ab.
export const ROAD = {
  laneWidth: 3.75,
  lanes: 4,
  left: -8.25,
  right: 10.5,
  width: 18.75,
  texLength: 36,
  laneCenter: (i) => -5.625 + i * 3.75,
};

export function roadTexture() {
  const W = 512;
  const H = 1024;
  const c = canvas(W, H);
  const ctx = c.getContext('2d');
  noiseFill(ctx, W, H, [88, 89, 92], 26, 7, 1);
  const px = (x) => ((x - ROAD.left) / ROAD.width) * W;
  const py = (m) => (m / ROAD.texLength) * H;

  // Leichte Flicken & Längsrisse
  const rnd = mulberry32(42);
  for (let i = 0; i < 18; i++) {
    const g = rnd() < 0.5 ? 64 : 112;
    ctx.fillStyle = `rgba(${g},${g},${g + 4},${0.1 + rnd() * 0.1})`;
    const x = rnd() * W;
    const y = rnd() * H;
    ctx.fillRect(x, y, 20 + rnd() * 90, 30 + rnd() * 160);
  }
  // Spurrillen (dunkler, wo die Reifen rollen)
  for (let l = 0; l < 4; l++) {
    const cx = ROAD.laneCenter(l);
    for (const off of [-0.85, 0.85]) {
      const g = ctx.createLinearGradient(px(cx + off - 0.4), 0, px(cx + off + 0.4), 0);
      g.addColorStop(0, 'rgba(40,40,44,0)');
      g.addColorStop(0.5, 'rgba(40,40,44,0.32)');
      g.addColorStop(1, 'rgba(40,40,44,0)');
      ctx.fillStyle = g;
      ctx.fillRect(px(cx + off - 0.4), 0, px(cx + off + 0.4) - px(cx + off - 0.4), H);
    }
  }
  // Standstreifen etwas heller/grober
  ctx.fillStyle = 'rgba(140,140,140,0.08)';
  ctx.fillRect(px(7.5), 0, px(ROAD.right) - px(7.5), H);

  const white = '#eceae2';
  ctx.fillStyle = white;
  // Leitlinien zwischen den Fahrstreifen: 6 m Strich, 12 m Lücke, 15 cm breit
  for (let l = 1; l < 4; l++) {
    const x = -7.5 + l * 3.75;
    for (let m = 0; m < ROAD.texLength; m += 18) {
      ctx.fillRect(px(x - 0.075), py(m), px(x + 0.075) - px(x - 0.075), py(6));
    }
  }
  // Fahrbahnbegrenzung links (30 cm) und rechts zum Standstreifen (Breitstrich 30 cm)
  ctx.fillRect(px(-7.5 - 0.3), 0, px(-7.5) - px(-7.8), H);
  ctx.fillRect(px(7.5), 0, px(7.8) - px(7.5), H);
  // äußerer Rand
  ctx.fillRect(px(ROAD.right - 0.35), 0, px(ROAD.right - 0.15) - px(ROAD.right - 0.35), H);

  // Abnutzung auf den Markierungen
  ctx.globalAlpha = 0.25;
  noiseSpeckle(ctx, W, H, 3000, 'rgba(70,70,74,1)', 13);
  ctx.globalAlpha = 1;

  const t = tex(c, { repeat: true });
  t.repeat.set(1, 1);
  return t;
}

function noiseSpeckle(ctx, W, H, n, color, seed) {
  const rnd = mulberry32(seed);
  ctx.fillStyle = color;
  for (let i = 0; i < n; i++) ctx.fillRect(rnd() * W, rnd() * H, 1 + rnd() * 2, 1 + rnd() * 2);
}

// Gras / Felder (Patchwork) – kachelbar
export function fieldTexture() {
  const S = 1024;
  const c = canvas(S, S);
  const ctx = c.getContext('2d');
  const rnd = mulberry32(99);
  ctx.fillStyle = '#5f8a3a';
  ctx.fillRect(0, 0, S, S);
  const palette = ['#6a9a3c', '#7fae45', '#5a8434', '#c9b24a', '#e1cf3a', '#8a9a4a', '#6f8f3c', '#a08a52', '#b6a35a', '#4f7a30'];
  // Feldstreifen
  let y = 0;
  while (y < S) {
    const h = 60 + rnd() * 180;
    let x = 0;
    while (x < S) {
      const w = 80 + rnd() * 260;
      ctx.fillStyle = palette[Math.floor(rnd() * palette.length)];
      ctx.fillRect(x, y, w, h);
      // Furchen
      ctx.strokeStyle = 'rgba(0,0,0,0.06)';
      ctx.lineWidth = 2;
      const vertical = rnd() < 0.5;
      for (let k = 0; k < (vertical ? w : h); k += 7) {
        ctx.beginPath();
        if (vertical) {
          ctx.moveTo(x + k, y);
          ctx.lineTo(x + k, y + h);
        } else {
          ctx.moveTo(x, y + k);
          ctx.lineTo(x + w, y + k);
        }
        ctx.stroke();
      }
      x += w;
    }
    y += h;
  }
  // Feldwege
  ctx.strokeStyle = 'rgba(190,175,140,0.6)';
  ctx.lineWidth = 5;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(rnd() * S, 0);
    ctx.lineTo(rnd() * S, S);
    ctx.stroke();
  }
  // Körnung
  ctx.globalAlpha = 0.18;
  noiseSpeckle(ctx, S, S, 20000, 'rgba(30,50,20,1)', 5);
  ctx.globalAlpha = 1;
  return tex(c, { repeat: true });
}

export function grassTexture() {
  const S = 256;
  const c = canvas(S, S);
  const ctx = c.getContext('2d');
  noiseFill(ctx, S, S, [92, 128, 58], 34, 3, 2);
  return tex(c, { repeat: true });
}

// Schutzplanke (Stahl, W-Profil)
export function guardrailTexture() {
  const c = canvas(64, 64);
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 64);
  g.addColorStop(0, '#c9ccd0');
  g.addColorStop(0.18, '#8d9296');
  g.addColorStop(0.35, '#dfe2e5');
  g.addColorStop(0.5, '#9aa0a5');
  g.addColorStop(0.65, '#e2e4e6');
  g.addColorStop(0.82, '#8b9094');
  g.addColorStop(1, '#bfc3c7');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  ctx.fillStyle = 'rgba(60,60,60,0.5)';
  ctx.fillRect(30, 26, 4, 12);
  return tex(c, { repeat: true });
}

// Kennzeichen (EU-Streifen, schwarze Schrift)
const plateCache = new Map();
export function plateTexture(text) {
  if (plateCache.has(text)) return plateCache.get(text);
  const c = canvas(256, 56);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#f5f5f0';
  ctx.fillRect(0, 0, 256, 56);
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 2, 252, 52);
  ctx.fillStyle = '#1d3f9a';
  ctx.fillRect(3, 3, 26, 50);
  ctx.fillStyle = '#ffd400';
  ctx.beginPath();
  ctx.arc(16, 18, 7, 0, Math.PI * 2);
  ctx.setLineDash([2, 2]);
  ctx.strokeStyle = '#ffd400';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 15px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('D', 16, 47);
  ctx.fillStyle = '#111';
  ctx.font = 'bold 38px "DIN Alternate", "Arial Narrow", Arial, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 142, 30);
  const t = tex(c);
  plateCache.set(text, t);
  return t;
}

// Das „LIVE“-Logo (stilisiert: kleine Skyline über dem Schriftzug)
export function liveLogoTexture({ w = 512, h = 512, bg = null, color = '#f4f4f4' } = {}) {
  const c = canvas(w, h);
  const ctx = c.getContext('2d');
  if (bg) {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.fillStyle = color;
  // Skyline
  const base = h * 0.5;
  const towers = [
    [0.18, 0.1, 0.12], [0.29, 0.07, 0.2], [0.37, 0.06, 0.28], [0.44, 0.08, 0.36],
    [0.53, 0.06, 0.3], [0.6, 0.07, 0.22], [0.68, 0.06, 0.26], [0.75, 0.08, 0.15],
  ];
  for (const [x, tw, th] of towers) {
    ctx.fillRect(w * x, base - h * th, w * tw, h * th);
  }
  // Antennenspitze
  ctx.fillRect(w * 0.39, base - h * 0.36, w * 0.012, h * 0.08);
  ctx.fillRect(w * 0.15, base, w * 0.7, h * 0.025);
  ctx.font = `900 ${Math.round(h * 0.3)}px "Arial Black", Impact, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('LIVE', w / 2, base + h * 0.05);
  const t = tex(c);
  return t;
}

// Holz-/Zierleiste im Cockpit (dunkel, offenporig)
export function woodTexture() {
  const c = canvas(1024, 64);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#3b2c22';
  ctx.fillRect(0, 0, 1024, 64);
  const rnd = mulberry32(5);
  for (let i = 0; i < 90; i++) {
    ctx.strokeStyle = `rgba(${20 + rnd() * 40},${15 + rnd() * 25},${10 + rnd() * 15},${0.3 + rnd() * 0.4})`;
    ctx.lineWidth = 1 + rnd() * 2;
    ctx.beginPath();
    const y = rnd() * 64;
    ctx.moveTo(0, y);
    for (let x = 0; x <= 1024; x += 64) ctx.lineTo(x, y + Math.sin(x * 0.01 + i) * 3 + (rnd() - 0.5) * 2);
    ctx.stroke();
  }
  return tex(c, { repeat: true });
}

// Feine Stoffstruktur (Plüsch / Shirt)
export function fabricTexture(seed = 1) {
  const S = 128;
  const c = canvas(S, S);
  const ctx = c.getContext('2d');
  noiseFill(ctx, S, S, [200, 200, 200], 70, seed, 1);
  return tex(c, { repeat: true, srgb: false });
}

// Aero-Radkappe des Model 3 (stilisiert)
export function aeroWheelTexture() {
  const S = 256;
  const c = canvas(S, S);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#1b1c1e';
  ctx.fillRect(0, 0, S, S);
  const cx = S / 2;
  const g = ctx.createRadialGradient(cx, cx, 10, cx, cx, cx);
  g.addColorStop(0, '#9da2a7');
  g.addColorStop(0.75, '#7c8186');
  g.addColorStop(1, '#4b4f53');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cx, cx * 0.92, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(30,30,30,0.6)';
  ctx.lineWidth = 6;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 30, cx + Math.sin(a) * 30);
    ctx.quadraticCurveTo(
      cx + Math.cos(a + 0.5) * 80, cx + Math.sin(a + 0.5) * 80,
      cx + Math.cos(a + 0.9) * 112, cx + Math.sin(a + 0.9) * 112,
    );
    ctx.stroke();
  }
  ctx.fillStyle = '#2a2c2e';
  ctx.beginPath();
  ctx.arc(cx, cx, 20, 0, Math.PI * 2);
  ctx.fill();
  return tex(c);
}

export function rimTexture() {
  const S = 128;
  const c = canvas(S, S);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#151515';
  ctx.fillRect(0, 0, S, S);
  ctx.fillStyle = '#8e9398';
  ctx.beginPath();
  ctx.arc(64, 64, 56, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2b2b2b';
  for (let i = 0; i < 5; i++) {
    ctx.save();
    ctx.translate(64, 64);
    ctx.rotate((i / 5) * Math.PI * 2);
    ctx.beginPath();
    ctx.ellipse(0, 32, 9, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = '#555';
  ctx.beginPath();
  ctx.arc(64, 64, 10, 0, Math.PI * 2);
  ctx.fill();
  return tex(c);
}

// Weiche Wolke
export function cloudTexture(seed = 1) {
  const W = 512;
  const H = 256;
  const c = canvas(W, H);
  const ctx = c.getContext('2d');
  const rnd = mulberry32(seed);
  for (let i = 0; i < 26; i++) {
    const x = W * (0.15 + rnd() * 0.7);
    const y = H * (0.35 + rnd() * 0.35);
    const r = 40 + rnd() * 70;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(255,255,255,0.9)');
    g.addColorStop(0.6, 'rgba(255,255,255,0.45)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // Unterseite leicht grau
  const shade = ctx.createLinearGradient(0, H * 0.4, 0, H);
  shade.addColorStop(0, 'rgba(180,190,205,0)');
  shade.addColorStop(1, 'rgba(150,160,175,0.55)');
  ctx.globalCompositeOperation = 'source-atop';
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'source-over';
  return tex(c, { aniso: false });
}

// Weicher runder Partikel (Gischt, Rauch)
export function softDotTexture() {
  const S = 64;
  const c = canvas(S, S);
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.5, 'rgba(255,255,255,0.4)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  return tex(c, { aniso: false });
}

// Weicher Bodenschatten unter Fahrzeugen (abgerundetes Rechteck, nach außen auslaufend)
let contactTex = null;
export function contactShadowTexture() {
  if (contactTex) return contactTex;
  const W = 64;
  const H = 128;
  const c = canvas(W, H);
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(W, H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const u = Math.abs((x + 0.5) / W * 2 - 1);
      const v = Math.abs((y + 0.5) / H * 2 - 1);
      // Superellipse: innen fast rechteckig, am Rand weich
      const d = Math.pow(Math.pow(u, 5) + Math.pow(v, 5), 1 / 5);
      const t = Math.min(1, Math.max(0, (1 - d) / 0.42));
      const a = t * t * (3 - 2 * t);
      img.data[(y * W + x) * 4 + 3] = Math.round(a * 255);
    }
  }
  ctx.putImageData(img, 0, 0);
  contactTex = tex(c, { aniso: false, srgb: false });
  return contactTex;
}

// Blaues Autobahnschild mit Zeilen
export function signTexture(lines, { w = 512, h = 256, bg = '#1452a8', fg = '#ffffff', border = true, arrows = null } = {}) {
  const c = canvas(w, h);
  const ctx = c.getContext('2d');
  // die ganze Fläche: die Tafeln sind undurchsichtig, durchsichtige Ecken würden schwarz (der weiße Rand bleibt rund)
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  if (border) {
    ctx.strokeStyle = fg;
    ctx.lineWidth = 7;
    roundRect(ctx, 10, 10, w - 20, h - 20, 12);
    ctx.stroke();
  }
  ctx.fillStyle = fg;
  ctx.textBaseline = 'middle';
  const n = lines.length;
  const lh = (h - 40) / Math.max(1, n);
  lines.forEach((ln, i) => {
    const y = 20 + lh * (i + 0.5);
    const size = Math.min(lh * 0.62, 64);
    ctx.font = `bold ${size}px "DIN Alternate", "Arial Narrow", Arial, sans-serif`;
    if (typeof ln === 'string') {
      ctx.textAlign = 'left';
      fitText(ctx, ln, 34, y, w - 68);
    } else {
      ctx.textAlign = 'left';
      fitText(ctx, ln.left, 34, y, w * 0.68);
      if (ln.right) {
        ctx.textAlign = 'right';
        ctx.fillText(ln.right, w - 34, y);
      }
    }
  });
  if (arrows) {
    ctx.strokeStyle = fg;
    ctx.lineWidth = 9;
    arrows.forEach((ax) => {
      const x = w * ax;
      ctx.beginPath();
      ctx.moveTo(x, h - 26);
      ctx.lineTo(x, h - 70);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 14, h - 58);
      ctx.lineTo(x, h - 76);
      ctx.lineTo(x + 14, h - 58);
      ctx.stroke();
    });
  }
  return tex(c);
}

function fitText(ctx, text, x, y, maxW) {
  let size = parseFloat(ctx.font.match(/(\d+(\.\d+)?)px/)[1]);
  while (ctx.measureText(text).width > maxW && size > 12) {
    size -= 2;
    ctx.font = ctx.font.replace(/\d+(\.\d+)?px/, size + 'px');
  }
  ctx.fillText(text, x, y);
}

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Braunes Touristik-Schild (Unterrichtungstafel)
export function brownSignTexture(title, sub) {
  const w = 512;
  const h = 320;
  const c = canvas(w, h);
  const ctx = c.getContext('2d');
  // ganz füllen (undurchsichtige Tafel: durchsichtige Ecken würden schwarz)
  ctx.fillStyle = '#6b3d22';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 6;
  roundRect(ctx, 10, 10, w - 20, h - 20, 10);
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 44px Arial, sans-serif';
  fitTextCenter(ctx, title, w / 2, h * 0.42, w - 60);
  ctx.font = '30px Arial, sans-serif';
  fitTextCenter(ctx, sub, w / 2, h * 0.72, w - 60);
  return tex(c);
}

export function fitTextCenter(ctx, text, x, y, maxW) {
  let size = parseFloat(ctx.font.match(/(\d+(\.\d+)?)px/)[1]);
  while (ctx.measureText(text).width > maxW && size > 12) {
    size -= 2;
    ctx.font = ctx.font.replace(/\d+(\.\d+)?px/, size + 'px');
  }
  ctx.fillText(text, x, y);
}

// Tempolimit-Schild (rund, roter Rand)
export function speedSignTexture(limit) {
  const S = 256;
  const c = canvas(S, S);
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, S, S);
  if (limit === 'ende') {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(128, 128, 120, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.save();
    ctx.beginPath();
    ctx.arc(128, 128, 116, 0, Math.PI * 2);
    ctx.clip();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 8;
    for (let i = -5; i <= 5; i++) {
      ctx.beginPath();
      ctx.moveTo(40 + i * 14, 236);
      ctx.lineTo(236 + i * 14, 40);
      ctx.stroke();
    }
    ctx.restore();
  } else {
    ctx.fillStyle = '#d4141b';
    ctx.beginPath();
    ctx.arc(128, 128, 122, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(128, 128, 92, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.font = 'bold 92px "DIN Alternate", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(limit), 128, 134);
  }
  return tex(c);
}

// LKW-Plane mit fiktiver Spedition
export function trailerTexture(company, slogan, color = '#f2f2f2', accent = '#c8102e') {
  const W = 1024;
  const H = 256;
  const c = canvas(W, H);
  const ctx = c.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, W, H);
  // Planenfalten
  for (let x = 0; x < W; x += 64) {
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(x, 0, 6, H);
  }
  ctx.fillStyle = accent;
  ctx.fillRect(0, H - 34, W, 20);
  ctx.fillStyle = accent;
  ctx.font = 'italic 900 92px "Arial Black", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  fitTextCenter(ctx, company, W / 2, H * 0.4, W - 80);
  ctx.fillStyle = '#333';
  ctx.font = 'bold 34px Arial, sans-serif';
  fitTextCenter(ctx, slogan, W / 2, H * 0.72, W - 120);
  return tex(c);
}

export function truckRearTexture(text = 'Abstand halten!') {
  const W = 256;
  const H = 256;
  const c = canvas(W, H);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#e9e9e4';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#c9c9c4';
  ctx.fillRect(W / 2 - 2, 0, 4, H);
  ctx.strokeStyle = '#9a9a96';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, W - 12, H - 12);
  ctx.fillStyle = '#333';
  ctx.font = 'bold 22px Arial, sans-serif';
  ctx.textAlign = 'center';
  fitTextCenter(ctx, text, W / 2, H * 0.3, W - 30);
  // Konturmarkierung rot-weiß unten
  for (let x = 0; x < W; x += 32) {
    ctx.fillStyle = (x / 32) % 2 ? '#d01818' : '#ffffff';
    ctx.fillRect(x, H - 26, 32, 18);
  }
  return tex(c);
}

// Normal-Map-Sprite für einen Regentropfen (R/G = Normale, B = Maske)
export function dropSprite() {
  const S = 64;
  const c = canvas(S, S);
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(S, S);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const dx = (x - S / 2 + 0.5) / (S / 2);
      const dy = (y - S / 2 + 0.5) / (S / 2);
      const r2 = dx * dx + dy * dy;
      const i = (y * S + x) * 4;
      if (r2 < 1) {
        const nz = Math.sqrt(1 - r2);
        img.data[i] = 128 + dx * 127 * (1 - nz * 0.3);
        img.data[i + 1] = 128 + dy * 127 * (1 - nz * 0.3);
        img.data[i + 2] = 255 * Math.min(1, nz * 1.6);
        // weicher Rand
        img.data[i + 3] = 255 * Math.min(1, (1 - r2) * 4);
      } else {
        img.data[i + 3] = 0;
      }
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

export function bananaTexture() {
  const S = 256;
  const c = canvas(S, S);
  const ctx = c.getContext('2d');
  ctx.font = '200px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🍌', 128, 140);
  return tex(c, { aniso: false });
}

export function emojiTexture(emoji, size = 256) {
  const c = canvas(size, size);
  const ctx = c.getContext('2d');
  ctx.font = `${size * 0.8}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, size / 2, size * 0.55);
  return tex(c, { aniso: false });
}
