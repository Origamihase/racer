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

/** Weiche, kachelbare Flecken (hell oder dunkel) gegen sterile Flächen: jeder Fleck wird am Rand umgebrochen. */
function blotches(ctx, W, H, n, rMin, rMax, colors, seed) {
  const rnd = mulberry32(seed);
  for (let i = 0; i < n; i++) {
    const x = rnd() * W;
    const y = rnd() * H;
    const r = rMin + rnd() * (rMax - rMin);
    const col = colors[i % colors.length];
    for (const ox of [-W, 0, W]) {
      for (const oy of [-H, 0, H]) {
        if (x + ox + r < 0 || x + ox - r > W || y + oy + r < 0 || y + oy - r > H) continue;
        const g = ctx.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, r);
        g.addColorStop(0, col);
        g.addColorStop(1, col.replace(/[\d.]+\)$/, '0)'));
        ctx.fillStyle = g;
        ctx.fillRect(x + ox - r, y + oy - r, 2 * r, 2 * r);
      }
    }
  }
}

export function roadTexture() {
  const W = 1024;
  const H = 1024;
  const c = canvas(W, H);
  const ctx = c.getContext('2d');
  // weiches, neutrales Grau mit feinem Korn
  noiseFill(ctx, W, H, [116, 113, 106], 9, 7, 1);
  blotches(ctx, W, H, 46, 50, 150, ['rgba(255,255,255,0.03)', 'rgba(40,42,48,0.035)'], 42);
  // Zuschlagkörner: einzelne helle und dunkle Pünktchen
  noiseSpeckle(ctx, W, H, 2600, 'rgba(176,176,172,0.22)', 13);
  noiseSpeckle(ctx, W, H, 2200, 'rgba(70,72,78,0.2)', 14);

  // ab hier in Metern zeichnen (x quer, y längs)
  ctx.setTransform(W / ROAD.width, 0, 0, H / ROAD.texLength, (-ROAD.left * W) / ROAD.width, 0);
  const L = ROAD.texLength;
  // Standstreifen eine Spur heller
  ctx.fillStyle = 'rgba(255,255,255,0.045)';
  ctx.fillRect(7.8, 0, ROAD.right - 7.8, L);
  // sanfte Spurrillen, wo die Reifen rollen
  for (let l = 0; l < 4; l++) {
    const cx = ROAD.laneCenter(l);
    for (const off of [-0.88, 0.88]) {
      const g = ctx.createLinearGradient(cx + off - 0.5, 0, cx + off + 0.5, 0);
      g.addColorStop(0, 'rgba(52,54,60,0)');
      g.addColorStop(0.5, 'rgba(52,54,60,0.11)');
      g.addColorStop(1, 'rgba(52,54,60,0)');
      ctx.fillStyle = g;
      ctx.fillRect(cx + off - 0.5, 0, 1, L);
    }
  }
  // Markierungen: klares, leicht warmes Weiß mit runden Enden und hauchdünnem dunklem Saum
  const mark = (x, y, w, h) => {
    const r = Math.min(w / 2, 0.075);
    ctx.beginPath();
    if (h >= L) ctx.rect(x, -1, w, L + 2);
    else ctx.roundRect(x, y, w, h, r);
    ctx.fillStyle = 'rgba(58,60,66,0.4)';
    ctx.save();
    ctx.translate(0.012, 0.03);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = '#f6f4ec';
    ctx.fill();
  };
  // Leitlinien zwischen den Fahrstreifen: 6 m Strich, 12 m Lücke, 15 cm breit
  for (let l = 1; l < 4; l++) {
    const x = -7.5 + l * 3.75;
    for (let m = 0; m < L; m += 18) mark(x - 0.075, m + 0.1, 0.15, 6);
  }
  // Fahrbahnbegrenzung links und rechts zum Standstreifen (Breitstrich 30 cm), dazu der äußere Rand
  mark(-7.8, 0, 0.3, L);
  mark(7.5, 0, 0.3, L);
  mark(ROAD.right - 0.35, 0, 0.2, L);
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  const t = tex(c, { repeat: true });
  t.repeat.set(1, 1);
  return t;
}

function noiseSpeckle(ctx, W, H, n, color, seed) {
  const rnd = mulberry32(seed);
  ctx.fillStyle = color;
  for (let i = 0; i < n; i++) ctx.fillRect(rnd() * W, rnd() * H, 1 + rnd() * 2, 1 + rnd() * 2);
}

// Felder als Flickenteppich (kachelbar, 160 m): Raps, Weizen, junges Grün, Stroh, Acker und Wiesen, jedes Feld
// mit runden Ecken, feinen Saatreihen und einem grünen Rain zum Nachbarn.
export function fieldTexture() {
  const S = 1024;
  const c = canvas(S, S);
  const ctx = c.getContext('2d');
  const rnd = mulberry32(99);
  ctx.fillStyle = '#74b85a';
  ctx.fillRect(0, 0, S, S);
  blotches(ctx, S, S, 30, 60, 160, ['rgba(150,214,110,0.16)', 'rgba(80,150,70,0.14)'], 5);
  // [Grundton, Reihen-Ton, Gewicht]
  const crops = [
    ['#7fc35c', '#6fb650', 30], // Wiese
    ['#9ad75f', '#86c552', 20], // junges Grün
    ['#f1d667', '#e3c552', 16], // Raps
    ['#e2bf66', '#d3ae57', 14], // Weizen
    ['#f0e39a', '#e2d386', 8], // Stroh
    ['#a58a68', '#94795a', 8], // Acker
    ['#5fa651', '#539846', 4], // Klee
  ];
  const total = crops.reduce((n, k) => n + k[2], 0);
  const pickCrop = () => {
    let r = rnd() * total;
    for (const k of crops) {
      r -= k[2];
      if (r <= 0) return k;
    }
    return crops[0];
  };
  // Reihen und Felder teilen die Kachel restlos auf (so passt auch der Rand zum Nachbarn)
  const split = (len, min, max) => {
    const cuts = [];
    let p = 0;
    while (len - p > max) {
      p += min + rnd() * (max - min);
      if (len - p < min) break;
      cuts.push(p);
    }
    return [0, ...cuts, len];
  };
  const rows = split(S, 130, 250);
  const gap = 5;
  let last = null;
  for (let j = 0; j < rows.length - 1; j++) {
    const y = rows[j];
    const h = rows[j + 1] - y;
    const cols = split(S, 150, 380);
    for (let i = 0; i < cols.length - 1; i++) {
      const x = cols[i];
      const w = cols[i + 1] - x;
      let crop = pickCrop();
      while (crop === last) crop = pickCrop();
      last = crop;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x + gap, y + gap, w - 2 * gap, h - 2 * gap, 14);
      ctx.clip();
      ctx.fillStyle = crop[0];
      ctx.fillRect(x, y, w, h);
      // Saatreihen, längs oder quer
      ctx.strokeStyle = crop[1];
      ctx.lineWidth = 2.5;
      const vertical = rnd() < 0.5;
      const step = 7 + Math.floor(rnd() * 4);
      ctx.beginPath();
      for (let k = step / 2; k < (vertical ? w : h); k += step) {
        if (vertical) {
          ctx.moveTo(x + k, y);
          ctx.lineTo(x + k, y + h);
        } else {
          ctx.moveTo(x, y + k);
          ctx.lineTo(x + w, y + k);
        }
      }
      ctx.stroke();
      ctx.restore();
    }
  }
  // helle Feldwege in zwei Rainen
  ctx.strokeStyle = 'rgba(226,212,170,0.85)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, rows[1]);
  ctx.lineTo(S, rows[1]);
  ctx.moveTo(0, rows[Math.min(3, rows.length - 2)]);
  ctx.lineTo(S, rows[Math.min(3, rows.length - 2)]);
  ctx.stroke();
  return tex(c, { repeat: true });
}

// Wiese am Fahrbahnrand (kachelbar, 6 m): zwei frische Grüntöne in Mähstreifen längs der Straße, kurze Halme
// wie Filz und kleine Blümchen (Gänseblümchen, Löwenzahn, Klee).
export function grassTexture() {
  const S = 512;
  const c = canvas(S, S);
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, S, 0);
  const A = '#7cc45c';
  const B = '#6db650';
  // vier Streifen je 1,5 m, weich ineinander
  for (let i = 0; i < 4; i++) {
    const col = i % 2 ? B : A;
    g.addColorStop(i / 4 + 0.03, col);
    g.addColorStop((i + 1) / 4 - 0.03, col);
  }
  g.addColorStop(0, '#75bd56');
  g.addColorStop(1, '#75bd56');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  blotches(ctx, S, S, 40, 24, 70, ['rgba(160,222,112,0.13)', 'rgba(70,140,64,0.12)'], 3);
  // Halme: kurze, leicht schräge Striche in helleren und dunkleren Tönen
  const rnd = mulberry32(8);
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';
  for (let i = 0; i < 2600; i++) {
    const x = rnd() * S;
    const y = rnd() * S;
    const l = 4 + rnd() * 6;
    const a = (rnd() - 0.5) * 0.9;
    ctx.strokeStyle = rnd() < 0.5 ? 'rgba(170,228,120,0.3)' : 'rgba(64,132,58,0.26)';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.sin(a) * l, y - Math.cos(a) * l);
    ctx.stroke();
  }
  // Blümchen auf einem verwackelten Raster (gleichmäßig verteilt, damit die Kachel nicht auffällt)
  const N = 9;
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      if (rnd() < 0.3) continue;
      const x = ((i + 0.15 + rnd() * 0.7) / N) * S;
      const y = ((j + 0.15 + rnd() * 0.7) / N) * S;
      const kind = rnd();
      const r = 2.1 + rnd() * 0.9;
      ctx.fillStyle = kind < 0.55 ? '#ffffff' : kind < 0.88 ? '#ffe04a' : '#f6a9c4';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      if (kind < 0.55) {
        ctx.fillStyle = '#ffd23f';
        ctx.beginPath();
        ctx.arc(x, y, r * 0.42, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  return tex(c, { repeat: true });
}

// Schutzplanke (verzinkter Stahl, W-Profil): helle, weiche Glanzbänder
export function guardrailTexture() {
  const c = canvas(64, 64);
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 64);
  g.addColorStop(0, '#d3d8dd');
  g.addColorStop(0.18, '#a3aab1');
  g.addColorStop(0.35, '#e9edf0');
  g.addColorStop(0.5, '#aeb5bc');
  g.addColorStop(0.65, '#eceff2');
  g.addColorStop(0.82, '#9fa6ad');
  g.addColorStop(1, '#c9ced4');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  ctx.fillStyle = 'rgba(84,90,98,0.5)';
  ctx.beginPath();
  ctx.roundRect(30, 26, 4, 12, 2);
  ctx.fill();
  return tex(c, { repeat: true });
}

/**
 * Mauerwerk aus weichen, kissenrunden Sandsteinquadern (Widerlager der Brücken). Eine Kachel misst 3,6 m: acht
 * Lagen zu 45 cm, jeder Stein 0,8 … 1,2 m lang, Lage für Lage versetzt; die Kachel schließt nach allen Seiten
 * nahtlos an. Die oberste Lage beginnt an der Oberkante der Kachel.
 */
export function masonryTexture() {
  const S = 512;
  const H = 64;
  const c = canvas(S, S);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#9d8f76';
  ctx.fillRect(0, 0, S, S);
  const rnd = mulberry32(31);
  const tones = ['#c9b998', '#bfac8a', '#d0c1a2', '#b9a682', '#c4b08f', '#cbb998', '#b5a385'];
  const stone = (x, y, w, col) => {
    // Kissenform: Grundton, oben ein heller Hauch, unten ein warmer Schatten
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.roundRect(x + 3, y + 3, w - 6, H - 6, 13);
    ctx.fill();
    const g = ctx.createLinearGradient(0, y + 3, 0, y + H - 3);
    g.addColorStop(0, 'rgba(255,250,236,0.34)');
    g.addColorStop(0.3, 'rgba(255,250,236,0)');
    g.addColorStop(0.7, 'rgba(110,84,52,0)');
    g.addColorStop(1, 'rgba(110,84,52,0.26)');
    ctx.fillStyle = g;
    ctx.fill();
  };
  for (let row = 0; row < S / H; row++) {
    // Steinlängen einer Lage auf genau eine Kachelbreite strecken, dann um einen Zufallsversatz verschoben legen
    const widths = [];
    let sum = 0;
    while (sum < S - 90) {
      const w = 112 + rnd() * 64;
      widths.push(w);
      sum += w;
    }
    let x = rnd() * S;
    for (const w0 of widths) {
      const w = (w0 * S) / sum;
      const col = tones[Math.floor(rnd() * tones.length)];
      for (const ox of [0, -S]) stone(x + ox, row * H, w, col);
      x = (x + w) % S;
    }
  }
  // feines Korn im Stein
  noiseSpeckle(ctx, S, S, 1400, 'rgba(255,248,230,0.16)', 32);
  noiseSpeckle(ctx, S, S, 1200, 'rgba(120,96,66,0.12)', 33);
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
