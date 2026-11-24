// Kern des Stadt-Baukastens (Häuser, Straßenmöbel, Menschen, Wahrzeichen).
// Ein kleiner Modellbau-Werkzeugkasten: Der „Bau“ sammelt Dreiecke in drei Eimern und liefert daraus die
// Geometrien eines Bausteins:
//   T (tint)  – Flächen, die mit der Instanzfarbe multipliziert werden (Wände, Kleidung); fast weiß,
//   F (fixed) – alles Übrige in matter Farbe (Dächer, Schornsteine, Pfosten …),
//   G (gloss) – Scheiben, Rahmen, Türen, Schilder: leicht glänzend, mit dem Schilder-Atlas als Textur und mit
//               Polygon-Offset, damit flache Aufsätze auch in 800 m Entfernung nicht gegen die Wand flimmern,
//   W (water) – Wasser der Brunnen: Flächen, Strahlen, Tropfen und Ringe, die der Shader bewegt,
//   L (light) – was selbst leuchtet (Ampellicht, Lichterketten, Warnlampen): unbeleuchtetes Material.
// Alle Farben stecken in den Eckpunkten, samt weicher „Umgebungsschatten“ (unten und unter Traufen dunkler).
// Text von Läden und Schildern kommt aus einem einzigen Atlas, deshalb kostet Schrift keinen eigenen Draw Call.
import * as THREE from 'three';
import { PAL } from './palette.js';

export { PAL };

/** Ergänzende Farben nur für die Stadt (die gemeinsame Palette bleibt, wie sie ist). sRGB-Hex. */
export const CITY = {
  sand: 0xe8cfa0,
  sandDark: 0xc9a877,
  redStone: 0xc98a6e,
  brickDark: 0xa5553f,
  brickYellow: 0xdcb878,
  falu: 0xb5443a,
  slate: 0x8795a6,
  slateDark: 0x66727f,
  copper: 0x7fc4ae,
  gold: 0xf0c04a,
  ivory: 0xfaf7f0,
  ink: 0x3a3f47,
  wood: 0xb98a5a,
  woodDark: 0x8a5a3c,
  leaf: 0x6fb352,
  leafDark: 0x4a8f4a,
  skin: [0xf2c9a0, 0xe0ac7e, 0xc98b62, 0x9a6a48],
  hair: [0x4a3324, 0x2f2a28, 0xc9a24e, 0xb5b0a8, 0x8a4a2a],
  cloth: [0xe5483a, 0x3f8fd0, 0x4fae6a, 0xf2b632, 0xb07cc6, 0xf08a2c, 0x5fbfb0, 0xf4a6c0, 0x6b7fa8, 0xfaf7f0],
};

const TAU = Math.PI * 2;
const _c = new THREE.Color();
const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _e = new THREE.Euler();
const linCache = new Map();

/** sRGB-Hex → lineare Komponenten [r, g, b] (Eckpunktfarben sind linear). */
export function lin(hex) {
  if (typeof hex !== 'number') return hex;
  let v = linCache.get(hex);
  if (!v) {
    _c.setHex(hex);
    v = [_c.r, _c.g, _c.b];
    linCache.set(hex, v);
  }
  return v;
}

/** Mischt zwei sRGB-Farben (t = 0 … 1) und gibt wieder Hex zurück. */
export function mix(a, b, t) {
  const ar = (a >> 16) & 255;
  const ag = (a >> 8) & 255;
  const ab = a & 255;
  const r = Math.round(ar + (((b >> 16) & 255) - ar) * t);
  const g = Math.round(ag + (((b >> 8) & 255) - ag) * t);
  const bl = Math.round(ab + ((b & 255) - ab) * t);
  return (r << 16) | (g << 8) | bl;
}

/** Zufallszahlen mit festem Startwert (Bausteine sehen bei jedem Laden gleich aus). */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// Schilder-Atlas: alle festen Schriftzüge und Zeichen auf einer 1024er-Textur
const ATLAS = 1024;
const FONT = '"Trebuchet MS", "Segoe UI", "DejaVu Sans", Arial, sans-serif';

/** Kleine Zeichnungen für Ladenschilder (einfarbig, im Quadrat s um die Mitte cx, cy). */
const ICONS = {
  bell(ctx, cx, cy, s) {
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.36, cy + s * 0.2);
    ctx.quadraticCurveTo(cx - s * 0.3, cy - s * 0.42, cx, cy - s * 0.42);
    ctx.quadraticCurveTo(cx + s * 0.3, cy - s * 0.42, cx + s * 0.36, cy + s * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy + s * 0.3, s * 0.1, 0, TAU);
    ctx.fill();
  },
  cone(ctx, cx, cy, s) {
    ctx.beginPath();
    ctx.arc(cx, cy - s * 0.16, s * 0.24, 0, TAU);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.2, cy + s * 0.02);
    ctx.lineTo(cx + s * 0.2, cy + s * 0.02);
    ctx.lineTo(cx, cy + s * 0.44);
    ctx.closePath();
    ctx.fill();
  },
  heart(ctx, cx, cy, s) {
    ctx.beginPath();
    ctx.moveTo(cx, cy + s * 0.36);
    ctx.bezierCurveTo(cx - s * 0.6, cy - s * 0.05, cx - s * 0.3, cy - s * 0.5, cx, cy - s * 0.18);
    ctx.bezierCurveTo(cx + s * 0.3, cy - s * 0.5, cx + s * 0.6, cy - s * 0.05, cx, cy + s * 0.36);
    ctx.fill();
  },
  cross(ctx, cx, cy, s) {
    ctx.fillRect(cx - s * 0.12, cy - s * 0.38, s * 0.24, s * 0.76);
    ctx.fillRect(cx - s * 0.38, cy - s * 0.12, s * 0.76, s * 0.24);
  },
  book(ctx, cx, cy, s) {
    ctx.beginPath();
    ctx.moveTo(cx, cy - s * 0.26);
    ctx.quadraticCurveTo(cx - s * 0.2, cy - s * 0.4, cx - s * 0.42, cy - s * 0.3);
    ctx.lineTo(cx - s * 0.42, cy + s * 0.28);
    ctx.quadraticCurveTo(cx - s * 0.2, cy + s * 0.18, cx, cy + s * 0.32);
    ctx.quadraticCurveTo(cx + s * 0.2, cy + s * 0.18, cx + s * 0.42, cy + s * 0.28);
    ctx.lineTo(cx + s * 0.42, cy - s * 0.3);
    ctx.quadraticCurveTo(cx + s * 0.2, cy - s * 0.4, cx, cy - s * 0.26);
    ctx.fill();
  },
  pig(ctx, cx, cy, s) {
    ctx.beginPath();
    ctx.ellipse(cx, cy + s * 0.02, s * 0.4, s * 0.3, 0, 0, TAU);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.3, cy - s * 0.18);
    ctx.lineTo(cx - s * 0.2, cy - s * 0.42);
    ctx.lineTo(cx - s * 0.06, cy - s * 0.24);
    ctx.fill();
    ctx.fillRect(cx - s * 0.26, cy + s * 0.22, s * 0.12, s * 0.2);
    ctx.fillRect(cx + s * 0.12, cy + s * 0.22, s * 0.12, s * 0.2);
    ctx.fillRect(cx + s * 0.32, cy - s * 0.08, s * 0.16, s * 0.18);
  },
  flower(ctx, cx, cy, s) {
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * TAU - Math.PI / 2;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * s * 0.24, cy + Math.sin(a) * s * 0.24, s * 0.17, 0, TAU);
      ctx.fill();
    }
  },
  cup(ctx, cx, cy, s) {
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.34, cy - s * 0.2);
    ctx.lineTo(cx + s * 0.2, cy - s * 0.2);
    ctx.quadraticCurveTo(cx + s * 0.2, cy + s * 0.34, cx - s * 0.07, cy + s * 0.34);
    ctx.quadraticCurveTo(cx - s * 0.34, cy + s * 0.34, cx - s * 0.34, cy - s * 0.2);
    ctx.fill();
    ctx.lineWidth = s * 0.08;
    ctx.beginPath();
    ctx.arc(cx + s * 0.24, cy + s * 0.02, s * 0.14, -1.3, 1.5);
    ctx.stroke();
  },
  cloud(ctx, cx, cy, s) {
    for (const [dx, dy, r] of [[-0.24, 0.08, 0.2], [0, -0.08, 0.28], [0.26, 0.08, 0.2], [0, 0.12, 0.2]]) {
      ctx.beginPath();
      ctx.arc(cx + dx * s, cy + dy * s, r * s, 0, TAU);
      ctx.fill();
    }
  },
  star(ctx, cx, cy, s) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * TAU - Math.PI / 2;
      const r = s * (i % 2 ? 0.2 : 0.44);
      ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
  },
  phone(ctx, cx, cy, s) {
    // Hörer: zwei runde Muscheln, dazwischen ein gebogener Griff
    ctx.lineCap = 'round';
    ctx.lineWidth = s * 0.16;
    ctx.beginPath();
    ctx.arc(cx, cy + s * 0.34, s * 0.42, Math.PI * 1.18, Math.PI * 1.82);
    ctx.stroke();
    for (const d of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(cx + d * s * 0.33, cy + s * 0.02, s * 0.15, s * 0.1, d * 0.5, 0, TAU);
      ctx.fill();
    }
    ctx.fillRect(cx - s * 0.3, cy + s * 0.2, s * 0.6, s * 0.2);
  },
  plug(ctx, cx, cy, s) {
    ctx.fillRect(cx - s * 0.14, cy - s * 0.44, s * 0.08, s * 0.22);
    ctx.fillRect(cx + s * 0.06, cy - s * 0.44, s * 0.08, s * 0.22);
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.26, cy - s * 0.24);
    ctx.lineTo(cx + s * 0.26, cy - s * 0.24);
    ctx.lineTo(cx + s * 0.26, cy);
    ctx.quadraticCurveTo(cx + s * 0.26, cy + s * 0.24, cx + s * 0.05, cy + s * 0.26);
    ctx.lineTo(cx + s * 0.05, cy + s * 0.46);
    ctx.lineTo(cx - s * 0.05, cy + s * 0.46);
    ctx.lineTo(cx - s * 0.05, cy + s * 0.26);
    ctx.quadraticCurveTo(cx - s * 0.26, cy + s * 0.24, cx - s * 0.26, cy);
    ctx.closePath();
    ctx.fill();
  },
};

function fitFont(ctx, text, size, maxW, weight = 'bold') {
  let s = size;
  ctx.font = `${weight} ${s}px ${FONT}`;
  while (ctx.measureText(text).width > maxW && s > 10) {
    s -= 1;
    ctx.font = `${weight} ${s}px ${FONT}`;
  }
  return s;
}

/** Ladenschild: farbige Tafel mit feinem Rand, optional kleiner Zeichnung links. */
function drawSign(ctx, x, y, w, h, { text, bg, fg, icon = null, line = fg }) {
  ctx.fillStyle = bg;
  ctx.fillRect(x - 4, y - 4, w + 8, h + 8);
  ctx.strokeStyle = line;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x + 5, y + 5, w - 10, h - 10);
  ctx.globalAlpha = 1;
  ctx.fillStyle = fg;
  ctx.strokeStyle = fg;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  const iw = icon ? h * 0.72 : 0;
  fitFont(ctx, text, h * 0.56, w - 34 - iw - (icon ? 10 : 0));
  const tw = ctx.measureText(text).width;
  const x0 = x + (w - tw - iw - (icon ? 10 : 0)) / 2;
  if (icon) ICONS[icon](ctx, x0 + iw / 2, y + h / 2, iw);
  ctx.textAlign = 'left';
  ctx.fillText(text, x0 + iw + (icon ? 10 : 0), y + h / 2 + 2);
}

function drawSymbol(ctx, x, y, w, h, kind) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const fill = (c) => {
    ctx.fillStyle = c;
    ctx.fillRect(x - 3, y - 3, w + 6, h + 6);
  };
  const letter = (t, c, size = h * 0.66) => {
    ctx.fillStyle = c;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    fitFont(ctx, t, size, w - 12);
    ctx.fillText(t, cx, cy + 2);
  };
  switch (kind) {
    case 'white':
      fill('#ffffff');
      break;
    case 'bus': // Haltestelle: gelbe Scheibe, grüner Rand, grünes H
      fill('#fdfbf5');
      ctx.fillStyle = '#ffd23f';
      ctx.beginPath();
      ctx.arc(cx, cy, h * 0.46, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = '#2f8f4e';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(cx, cy, h * 0.4, 0, TAU);
      ctx.stroke();
      letter('H', '#2f8f4e', h * 0.58);
      break;
    case 'park':
      fill('#1f5fae');
      letter('P', '#fdfbf5', h * 0.78);
      break;
    case 'charge':
      fill('#2f8f4e');
      ctx.fillStyle = '#fdfbf5';
      ctx.strokeStyle = '#fdfbf5';
      ICONS.plug(ctx, cx, cy, h * 0.8);
      break;
    case 'mail':
      fill('#ffd23f');
      ctx.strokeStyle = '#3a3f47';
      ctx.lineWidth = 4;
      ctx.strokeRect(cx - 20, cy - 13, 40, 26);
      ctx.beginPath();
      ctx.moveTo(cx - 20, cy - 13);
      ctx.lineTo(cx, cy + 4);
      ctx.lineTo(cx + 20, cy - 13);
      ctx.stroke();
      break;
    case 'info':
      fill('#1f5fae');
      letter('i', '#fdfbf5', h * 0.8);
      break;
    case 'live': // das Logo des Streams als kleines Schild
      fill('#33363c');
      ctx.strokeStyle = '#fdfbf5';
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 6, y + 16, w - 12, h - 32);
      letter('LIVE', '#fdfbf5', h * 0.34);
      break;
    case 'heart':
      fill('#fdfbf5');
      ctx.fillStyle = '#e5483a';
      ICONS.heart(ctx, cx, cy, h * 0.9);
      break;
    case 'euro':
      fill('#e5483a');
      letter('€', '#fdfbf5', h * 0.74);
      break;
    case 'tram':
      fill('#fdfbf5');
      letter('Tram', '#1f5fae', h * 0.4);
      break;
    case 'taxi':
      fill('#ffd23f');
      letter('TAXI', '#3a3f47', h * 0.36);
      break;
    case 'glass':
      fill('#4fae6a');
      letter('Glas', '#fdfbf5', h * 0.4);
      break;
    case 'paper':
      fill('#3f8fd0');
      letter('Papier', '#fdfbf5', h * 0.32);
      break;
    case 'ticket':
      fill('#f08a2c');
      letter('Karten', '#fdfbf5', h * 0.32);
      break;
    case 'phone': // Telefonzelle: dunkler Hörer auf Gelb
      fill('#ffd23f');
      ctx.fillStyle = '#3a3f47';
      ctx.strokeStyle = '#3a3f47';
      ICONS.phone(ctx, cx, cy, h * 0.78);
      break;
    case 'phoneRed': // rote Zelle: weißer Hörer auf dunklem Leuchtband
      fill('#3a3f47');
      ctx.fillStyle = '#fdfbf5';
      ctx.strokeStyle = '#fdfbf5';
      ICONS.phone(ctx, cx, cy, h * 0.78);
      break;
    case 'open':
      fill('#4fae6a');
      letter('offen', '#fdfbf5', h * 0.36);
      break;
    default: { // Tempo-Schilder: '30', '50'
      fill('#fdfbf5');
      ctx.strokeStyle = '#e5483a';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(cx, cy, h * 0.4, 0, TAU);
      ctx.stroke();
      letter(kind, '#3a3f47', h * 0.44);
    }
  }
}

/** Plakate für Litfaßsäule und Wartehäuschen. */
function drawPoster(ctx, x, y, w, h, kind) {
  const cx = x + w / 2;
  const P = {
    fest: ['#ffd98a', '#e5483a', 'Stadtfest', 'am Brunnen'],
    floh: ['#d8ecf5', '#3f6fa8', 'Flohmarkt', 'jeden Sonntag'],
    live: ['#3a3f47', '#fdfbf5', 'Mini Adam', 'heute LIVE!'],
  }[kind];
  ctx.fillStyle = P[0];
  ctx.fillRect(x - 3, y - 3, w + 6, h + 6);
  ctx.fillStyle = P[1];
  ctx.strokeStyle = P[1];
  if (kind === 'fest') {
    // Wimpelkette
    const cols = ['#e5483a', '#3f8fd0', '#4fae6a', '#f2b632'];
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = cols[i % 4];
      ctx.beginPath();
      ctx.moveTo(x + 8 + i * 19, y + 16);
      ctx.lineTo(x + 26 + i * 19, y + 16);
      ctx.lineTo(x + 17 + i * 19, y + 40);
      ctx.fill();
    }
    ctx.fillStyle = '#3f8fd0';
    ICONS.star(ctx, cx, y + 86, 56);
  } else if (kind === 'floh') {
    ICONS.cup(ctx, cx - 26, y + 62, 46);
    ICONS.book(ctx, cx + 26, y + 62, 46);
  } else {
    ICONS.heart(ctx, cx, y + 62, 70);
  }
  ctx.fillStyle = P[1];
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  fitFont(ctx, P[2], 26, w - 14);
  ctx.fillText(P[2], cx, y + h - 62);
  fitFont(ctx, P[3], 17, w - 14, 'normal');
  ctx.fillText(P[3], cx, y + h - 32);
}

/** Pappschilder der Fans. */
function drawFan(ctx, x, y, w, h, [a, b, bg, fg]) {
  ctx.fillStyle = bg;
  ctx.fillRect(x - 3, y - 3, w + 6, h + 6);
  ctx.fillStyle = fg;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  fitFont(ctx, a, 34, w - 16);
  ctx.fillText(a, x + w / 2, y + h * (b ? 0.34 : 0.5));
  if (b === '♥') {
    ctx.fillStyle = '#e5483a';
    ICONS.heart(ctx, x + w / 2, y + h * 0.72, h * 0.4);
  } else if (b) {
    fitFont(ctx, b, 30, w - 16);
    ctx.fillText(b, x + w / 2, y + h * 0.7);
  }
}

const S = (text, bg, fg, icon) => (ctx, x, y, w, h) => drawSign(ctx, x, y, w, h, { text, bg, fg, icon });
// [Schlüssel, Breite, Höhe, Zeichenfunktion]; die Reihenfolge bestimmt die Lage im Atlas (Regalverfahren).
const ATLAS_ITEMS = [
  // lange Ladenschilder
  ['inn', 512, 64, S('Gasthof Zum Goldenen Mikro', '#2f5f43', '#f0c04a')],
  ['books', 512, 64, S('Buchhandlung Lesezeichen', '#2d5d6b', '#fff3d6', 'book')],
  ['travel', 512, 64, S('Reisebüro Immer Woanders', '#3f8fd0', '#fdfbf5', 'cloud')],
  ['hotel', 512, 64, S('Hotel Goldener Brunnen', '#34466b', '#f0c04a')],
  ['toys', 512, 64, S('Spielwaren Plüsch & Co.', '#f08a2c', '#fdfbf5', 'heart')],
  ['doner', 512, 64, S('Döner · Imbiss · Pommes', '#e5483a', '#ffd98a')],
  ['market', 512, 64, S('Frischemarkt Wolke 7', '#3f8fd0', '#fdfbf5', 'cloud')],
  ['driving', 512, 64, S('Fahrschule Linke Spur', '#fdfbf5', '#1f5fae')],
  // mittlere Ladenschilder (je zwei) und daneben ein kurzes
  ['bakery', 384, 64, S('Bäckerei Bimmel', '#8a5a3c', '#fff3d6', 'bell')],
  ['ice', 384, 64, S('Eiscafé Elsa', '#f4a6c0', '#fdfbf5', 'cone')],
  ['s:hotel', 256, 64, S('HOTEL', '#34466b', '#f0c04a')],
  ['kiosk', 384, 64, S('Kiosk Ehrenmensch', '#2f8f4e', '#fdfbf5', 'heart')],
  ['pharmacy', 384, 64, S('Apotheke am Brunnen', '#fdfbf5', '#2f8f4e', 'cross')],
  ['s:kino', 256, 64, S('KINO', '#b5523b', '#ffd98a', 'star')],
  ['bank', 384, 64, S('Sparschwein-Kasse', '#e5483a', '#fdfbf5', 'pig')],
  ['flowers', 384, 64, S('Blumen Efeu', '#e6f2d5', '#2f8f4e', 'flower')],
  ['s:rathaus', 256, 64, S('RATHAUS', '#fff3d6', '#6b4a36')],
  ['veg', 384, 64, S('Obst & Gemüse Dachs', '#ffe1a8', '#2f8f4e')],
  ['cafe', 384, 64, S('Café Bananensaft', '#ffd23f', '#6b4a36', 'cup')],
  ['s:bahnhof', 256, 64, S('BAHNHOF', '#fdfbf5', '#34466b')],
  ['hair', 384, 64, S('Friseur Haarmonie', '#b07cc6', '#fdfbf5')],
  ['cinema', 384, 64, S('Skyline-Lichtspiele', '#b5523b', '#ffd98a', 'star')],
  ['s:schule', 256, 64, S('SCHULE', '#fff3d6', '#3f6fa8')],
  ['electro', 384, 64, S('Elektro Funkloch', '#3f6fa8', '#fdfbf5', 'plug')],
  ['pizza', 384, 64, S('Pizzeria Bella Navi', '#fff3d6', '#e5483a')],
  ['s:feuerwehr', 256, 64, S('FEUERWEHR', '#e5483a', '#fdfbf5')],
  // kurze Schriftzüge für große Häuser
  ['s:kaufhaus', 256, 64, S('KAUFHAUS', '#fdfbf5', '#e5483a')],
  ['s:parkhaus', 256, 64, S('PARKHAUS', '#1f5fae', '#fdfbf5')],
  ['s:messe', 256, 64, S('MESSE', '#fdfbf5', '#3f6fa8')],
  ['s:ladepark', 256, 64, S('LADEPARK', '#2f8f4e', '#fdfbf5', 'plug')],
  ['s:diner', 256, 64, S('DINER', '#e5483a', '#fdfbf5', 'star')],
  ['s:pub', 256, 64, S('THE PUB', '#2f5f43', '#f0c04a')],
  ['s:ramen', 256, 64, S('RAMEN', '#fdfbf5', '#e5483a')],
  ['s:cafe', 256, 64, S('CAFÉ', '#fff3d6', '#8a5a3c', 'cup')],
];
// Unterer Teil des Atlas (ab y = 768) von Hand gesetzt: drei Plakate, vier Fan-Schilder, dazwischen die Zeichen.
const SYMBOLS = ['white', 'bus', 'park', 'charge', 'mail', 'info', 'live', 'heart', 'euro', 'tram', 'taxi', 'glass', 'paper', 'ticket', 'open', '30', '50', 'phone', 'phoneRed'];
const ATLAS_FIXED = [
  ['p:fest', 0, 768, 128, 192, (c, x, y, w, h) => drawPoster(c, x, y, w, h, 'fest')],
  ['p:floh', 128, 768, 128, 192, (c, x, y, w, h) => drawPoster(c, x, y, w, h, 'floh')],
  ['p:live', 256, 768, 128, 192, (c, x, y, w, h) => drawPoster(c, x, y, w, h, 'live')],
  ['f:hallo', 384, 768, 160, 96, (c, x, y, w, h) => drawFan(c, x, y, w, h, ['Hallo', 'Mini Adam!', '#fff3d6', '#3a3f47'])],
  ['f:danke', 544, 768, 160, 96, (c, x, y, w, h) => drawFan(c, x, y, w, h, ['Danke Adam', '♥', '#fdfbf5', '#3a3f47'])],
  ['f:ehre', 384, 864, 160, 96, (c, x, y, w, h) => drawFan(c, x, y, w, h, ['Ehrenmensch!', '', '#ffd23f', '#3a3f47'])],
  ['f:live', 544, 864, 160, 96, (c, x, y, w, h) => drawFan(c, x, y, w, h, ['LIVE', '♥', '#3a3f47', '#fdfbf5'])],
  ['s:markthalle', 0, 960, 256, 64, S('MARKTHALLE', '#fff3d6', '#b5523b')],
  ['s:zoo', 256, 960, 128, 64, S('ZOO', '#4fae6a', '#fdfbf5')],
  ['s:hafen', 384, 960, 256, 64, S('HAFEN', '#34466b', '#fdfbf5')],
  // Zeichen: 5 × 4 rechts
  ...SYMBOLS.map((k, i) => ['y:' + k, 704 + (i % 5) * 64, 768 + Math.floor(i / 5) * 64, 64, 64, (c, x, y, w, h) => drawSymbol(c, x, y, w, h, k)]),
];

// Lage aller Felder; 4 px Rand um jedes Feld (gegen Ausbluten in den Mip-Stufen)
const PAD = 4;
const cells = new Map();
const drawers = new Map();
{
  // Ladenschilder: Regale von links nach rechts, 64 px hoch
  let x = 0;
  let y = 0;
  for (const [key, w, h, draw] of ATLAS_ITEMS) {
    if (x + w > ATLAS) {
      x = 0;
      y += h;
    }
    cells.set(key, { x: x + PAD, y: y + PAD, w: w - 2 * PAD, h: h - 2 * PAD });
    drawers.set(key, draw);
    x += w;
  }
  for (const [key, cx, cy, w, h, draw] of ATLAS_FIXED) {
    cells.set(key, { x: cx + PAD, y: cy + PAD, w: w - 2 * PAD, h: h - 2 * PAD });
    drawers.set(key, draw);
  }
}

/** UV-Rechteck [u0, v0, u1, v1] eines Atlas-Felds (v0 = Unterkante). */
export function atlasUV(key) {
  const c = cells.get(key);
  if (!c) throw new Error('Atlas-Feld fehlt: ' + key);
  return [c.x / ATLAS, 1 - (c.y + c.h) / ATLAS, (c.x + c.w) / ATLAS, 1 - c.y / ATLAS];
}
/** Seitenverhältnis (Breite : Höhe) eines Atlas-Felds. */
export function atlasAspect(key) {
  const c = cells.get(key);
  return c.w / c.h;
}
const WHITE = cells.get('y:white');
const WHITE_U = (WHITE.x + WHITE.w / 2) / ATLAS;
const WHITE_V = 1 - (WHITE.y + WHITE.h / 2) / ATLAS;

let atlasTex = null;
function atlasTexture() {
  if (atlasTex) return atlasTex;
  const cv = document.createElement('canvas');
  cv.width = cv.height = ATLAS;
  const ctx = cv.getContext('2d');
  ctx.fillStyle = '#fdfbf5';
  ctx.fillRect(0, 0, ATLAS, ATLAS);
  for (const [key, c] of cells) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(c.x - PAD, c.y - PAD, c.w + 2 * PAD, c.h + 2 * PAD);
    ctx.clip();
    drawers.get(key)(ctx, c.x, c.y, c.w, c.h);
    ctx.restore();
  }
  atlasTex = new THREE.CanvasTexture(cv);
  atlasTex.colorSpace = THREE.SRGBColorSpace;
  atlasTex.anisotropy = 8;
  return atlasTex;
}

// Flächen vor einer Wand: um ein paar Tiefenstufen nach vorne gezogen, damit sie auch in 800 m Entfernung nicht
// gegen die Wand flimmern. Bewusst ohne den Steigungsanteil (Factor) wie bei FRONT in scenery.js: Der zieht fast
// von der Kante gesehene Flächen (Oberseiten von Rahmenleisten) so weit vor, dass sie durch die Dachkante davor
// stechen. Alle Aufsätze haben hier echten Abstand zur Wand, dafür genügt der feste Anteil.
const FRONT = { polygonOffset: true, polygonOffsetFactor: 0, polygonOffsetUnits: -6 };

/** Hängt einen weiteren Shader-Eingriff an ein Material der Fabrik (deren eigener Eingriff, die Weltkrümmung, bleibt). */
function patch(mat, key, fn) {
  const before = mat.onBeforeCompile;
  const cacheKey = mat.customProgramCacheKey;
  mat.onBeforeCompile = (shader, renderer) => {
    before.call(mat, shader, renderer);
    fn(shader);
  };
  mat.customProgramCacheKey = () => cacheKey.call(mat) + '|' + key;
  return mat;
}

// Weiches Gegenlicht: Die Sonne steht rechts hinter dem Fahrer, also läge jede Fassade der rechten Straßenseite im
// Schatten und liefe mit dem bloßen Himmelslicht grau zu. In einer echten Straße werfen Pflaster und Nachbarhäuser
// Sonnenlicht zurück: Dieses Licht kommt hier aus der Gegenrichtung der Sonne, flach von unten, und hängt an der
// Stärke der Sonne (im Regen verschwindet es von selbst). Dazu kommt das Licht, das der sonnige Boden senkrecht nach
// oben wirft: Unterseiten von Balkonen, Markisen und Traufen bekämen sonst nur das olivgrüne Bodenlicht des Himmels.
const SOFT_GLSL = /* glsl */ `#include <lights_fragment_end>
#if NUM_DIR_LIGHTS > 0
{
  vec3 ckUp = normalize((viewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz);
  vec3 ckSun = directionalLights[0].direction;
  vec3 ckFill = normalize(ckUp * (dot(ckSun, ckUp) + 0.3) - ckSun);
  float ckDown = max(-dot(normal, ckUp), 0.0);
  reflectedLight.indirectDiffuse += directionalLights[0].color * (0.27 * max(dot(normal, ckFill), 0.0) + 0.13 * ckDown) * BRDF_Lambert(material.diffuseColor);
}
#endif
`;
function soften(mat) {
  return patch(mat, 'soft', (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace('#include <lights_fragment_end>', SOFT_GLSL);
  });
}

// Wasser: ein Material für alle Brunnen. aKind je Eckpunkt: 0 stehende Fläche (uv = Meter ab Beckenmitte; aFlow.x =
// Radius, an dem Strahlen auftreffen, aFlow.y = Stärke der Ringe), 1 Strahl (uv.y = Meter entlang, aFlow = Tempo,
// Pulsieren, Phase), 2 Tropfen auf der Wurfparabel (aFlow = Startgeschwindigkeit und Phase, uv.x = Flugdauer),
// 3 Ring, der sich auf der Fläche ausbreitet (aFlow = Wachstum und Phase, uv.x = Dauer).
// uWater = (Zeit in s, Regen 0 … 1). Steht die Zeit, steht das Wasser – es bleibt aber als Wasser lesbar.
const WATER_PARS = /* glsl */ `uniform vec2 uWater;
varying float vKind;
varying vec2 vWuv;
varying vec4 vFlow;
varying float vLife;
`;
const WATER_VERT = /* glsl */ `#include <begin_vertex>
vKind = aKind;
vWuv = uv;
vFlow = aFlow;
vLife = 0.0;
if (aKind > 1.5) {
  float ckT = max(uv.x, 0.05);
  float ckTau = fract(uWater.x / ckT + aFlow.w);
  vLife = ckTau;
  if (aKind < 2.5) {
    float ckS = ckTau * ckT;
    transformed += aFlow.xyz * ckS;
    transformed.y -= 4.905 * ckS * ckS;
  } else {
    transformed += aFlow.xyz * ckTau;
  }
} else if (aKind > 0.5) {
  // Wülste laufen mit dem Wasser den Strahl entlang
  transformed += normal * (sin(uv.y * 7.0 - uWater.x * aFlow.x * 7.0 + aFlow.z) * aFlow.y);
}
`;
const WATER_FRAG = /* glsl */ `#include <color_fragment>
{
  float ckT = uWater.x;
  if (vKind < 0.5) {
    vec2 p = vWuv;
    // wandernde Wellenkämme
    float ckA = sin(p.x * 5.3 + ckT * 1.7) + sin(p.y * 4.7 - ckT * 1.3) + sin((p.x + p.y) * 3.9 + ckT * 2.1);
    float ckCrest = smoothstep(1.2, 2.7, ckA);
    // Ringe, die von der Auftreffstelle der Strahlen nach innen und außen laufen
    float ckD = abs(length(p) - vFlow.x);
    float ckRing = smoothstep(0.55, 1.0, sin(ckD * 11.0 - ckT * 4.2)) * exp(-ckD * 1.6) * vFlow.y;
    diffuseColor.rgb += vec3(0.42, 0.44, 0.4) * (ckCrest * 0.4 + ckRing * 0.75);
    if (uWater.y > 0.02) {
      // Regen: in jedem Feld eines Gitters springt ab und zu ein Ring auf
      vec2 ckG = p * 2.6;
      vec2 ckC = floor(ckG);
      float ckH = fract(sin(dot(ckC, vec2(127.1, 311.7))) * 43758.5453);
      float ckL = fract(ckT * (0.8 + ckH * 0.7) + ckH * 9.0);
      vec2 ckO = fract(ckG) - 0.5 - (vec2(ckH, fract(ckH * 17.0)) - 0.5) * 0.36;
      float ckDrop = smoothstep(0.07, 0.0, abs(length(ckO) - ckL * 0.4)) * (1.0 - ckL) * step(ckH, 0.35 + uWater.y * 0.6);
      diffuseColor.rgb += vec3(0.5) * ckDrop * uWater.y;
    }
    diffuseColor.a = 0.9;
  } else if (vKind < 1.5) {
    float ckS = sin(vWuv.y * 9.0 - ckT * vFlow.x * 9.0 + sin(vWuv.x * 6.2832) * 1.4 + vFlow.z);
    diffuseColor.rgb += vec3(0.2) * smoothstep(0.0, 0.9, ckS);
  } else if (vKind > 2.5) {
    diffuseColor.rgb = mix(vec3(1.0), diffuseColor.rgb, smoothstep(0.1, 1.0, vLife));
    diffuseColor.a = 0.92 - 0.5 * vLife;
  }
}
`;
// Strahlen und Tropfen: in der Mitte durchscheinend, zu den Rändern hin dichter und heller (wie ein echter Wasserstrahl)
const WATER_GLINT = /* glsl */ `#include <emissivemap_fragment>
if (vKind > 0.5 && vKind < 2.5) {
  float ckF = 1.0 - abs(dot(normal, normalize(vViewPosition)));
  diffuseColor.a = mix(0.5, 0.95, ckF * ckF);
  totalEmissiveRadiance += vec3(0.22, 0.27, 0.32) * (0.35 + 0.65 * ckF * ckF);
}
#if NUM_DIR_LIGHTS > 0
if (vKind < 0.5) {
  // Glitzern in der Sonne: wenige helle Punkte, die aufblitzen und wandern
  vec2 q = vWuv;
  float ckG = sin(q.x * 23.0 + uWater.x * 2.3) * sin(q.y * 27.0 - uWater.x * 1.9) * sin((q.x - q.y) * 11.0 + uWater.x * 3.1);
  totalEmissiveRadiance += directionalLights[0].color * (0.16 * smoothstep(0.62, 0.95, ckG));
}
#endif
`;
// Durchscheinend, aber mit Tiefenschreiben: Becken und Boden liegen darunter, also stimmt die Reihenfolge innerhalb
// eines Brunnens (erst die Fläche, dann Strahlen und Tropfen darüber).
function waterMaterial(F, uWater) {
  const mat = F.std({ vertexColors: true, roughness: 0.16, metalness: 0, envMapIntensity: 1.1, transparent: true });
  return patch(mat, 'water', (shader) => {
    shader.uniforms.uWater = uWater;
    shader.vertexShader = 'attribute vec4 aFlow;\nattribute float aKind;\n' + WATER_PARS + shader.vertexShader.replace('#include <begin_vertex>', WATER_VERT);
    shader.fragmentShader = WATER_PARS + shader.fragmentShader.replace('#include <color_fragment>', WATER_FRAG).replace('#include <emissivemap_fragment>', WATER_GLINT);
  });
}

const cores = new WeakMap();
/** Gemeinsame Materialien aller Stadt-Bausteine einer Material-Fabrik (ein Satz für alle Baukästen). */
export function cityCore(F) {
  let c = cores.get(F);
  if (!c) {
    const uWater = { value: new THREE.Vector2(0, 0) };
    c = {
      F,
      // Schatten von den Vorderseiten: mit dem großen Bias der Sonne (≈ 0,2 m) bliebe sonst unter jedem Dachüberstand
      // ein heller Streifen stehen (die Rückseite der dünnen Dachplatte liegt zu nah an der Wand darunter)
      matte: soften(Object.assign(F.lambert({ vertexColors: true }), { shadowSide: THREE.FrontSide })),
      glossy: soften(F.std({ vertexColors: true, map: atlasTexture(), roughness: 0.42, metalness: 0, envMapIntensity: 0.8, ...FRONT })),
      water: waterMaterial(F, uWater),
      // Leuchtendes (Ampel, Lichterketten): ohne Licht und Schatten, damit es auch im Schatten leuchtet
      glow: F.basic({ vertexColors: true }),
      uWater,
      textMats: new Map(),
      // je Seite (vorn / beidseitig) das zuletzt freigegebene Textmaterial, ohne Leinwand (siehe release)
      textKeep: new Map(),
      /** Wasser bewegen: t = Zeit in Sekunden (steht sie, steht das Wasser), rain = Regenstärke 0 … 1. */
      setWater(t, rain = 0) {
        uWater.value.set(t % 3600, rain);
      },
    };
    cores.set(F, c);
  }
  return c;
}

/**
 * Material mit frei gewähltem Text (Ortsschild, Wegweiser, Banner …): draw(ctx, w, h) malt einmal, danach liegt
 * das Material unter key im Cache. Jeder Aufruf zählt einen Nutzer; gibt release() den letzten frei, gehen Material,
 * Textur und Leinwand (die Schilder jedes Orts, an dem der Stream vorbeikommt, blieben sonst bis zum Ende im Speicher).
 */
export function textMaterial(core, key, w, h, draw, { side = THREE.FrontSide } = {}) {
  let m = core.textMats.get(key);
  if (!m) {
    const cv = document.createElement('canvas');
    cv.width = w;
    cv.height = h;
    draw(cv.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    m = soften(core.F.lambert({ map: t, side, ...FRONT }));
    Object.assign(m.userData, { textKey: key, textMats: core.textMats, textKeep: core.textKeep, users: 0 });
    core.textMats.set(key, m);
  }
  m.userData.users++;
  return m;
}
const panelGeos = new Map();
/**
 * Tafel mit freiem Text als eigenes Mesh: w × h Meter, Mitte im Ursprung, schaut nach +z. draw(ctx, W, H) malt sie
 * einmal je key auf eine Leinwand mit px Bildpunkten Breite.
 */
export function textPanel(core, key, w, h, px, draw, o) {
  const gk = w + 'x' + h;
  let geo = panelGeos.get(gk);
  if (!geo) {
    geo = new THREE.PlaneGeometry(w, h);
    panelGeos.set(gk, geo);
  }
  const mesh = new THREE.Mesh(geo, textMaterial(core, key, px, Math.max(16, Math.round((px * h) / w)), draw, o));
  mesh.receiveShadow = true;
  return mesh;
}
export { fitFont, FONT };

// ---------------------------------------------------------------------------
// Profil (Radius, Höhe) → Bänder mit Normalen in der Profilebene. Knicke über etwa 44° bleiben scharf,
// flachere Übergänge werden weich gerechnet.
function profBands(prof, crease) {
  const n = prof.length - 1;
  const sn = [];
  for (let j = 0; j < n; j++) {
    const dr = prof[j + 1][0] - prof[j][0];
    const dy = prof[j + 1][1] - prof[j][1];
    const l = Math.hypot(dr, dy) || 1;
    sn.push([dy / l, -dr / l]);
  }
  const avg = (p, q) => {
    const x = p[0] + q[0];
    const y = p[1] + q[1];
    const l = Math.hypot(x, y) || 1;
    return [x / l, y / l];
  };
  const out = [];
  for (let j = 0; j < n; j++) {
    let a = sn[j];
    let b = sn[j];
    if (j > 0 && sn[j - 1][0] * sn[j][0] + sn[j - 1][1] * sn[j][1] > crease) a = avg(sn[j - 1], sn[j]);
    if (j < n - 1 && sn[j + 1][0] * sn[j][0] + sn[j + 1][1] * sn[j][1] > crease) b = avg(sn[j + 1], sn[j]);
    out.push({ j, a, b });
  }
  return out;
}

/** Umriss eines Rechtecks mit runden Ecken: [x, z, nx, nz] je Punkt, vorne links beginnend im Uhrzeigersinn von oben. */
function roundRing(w, d, r, seg) {
  const out = [];
  const hx = Math.max(w / 2 - r, 0);
  const hz = Math.max(d / 2 - r, 0);
  const C = [[-hx, hz, -Math.PI / 2], [hx, hz, 0], [hx, -hz, Math.PI / 2], [-hx, -hz, Math.PI]];
  for (const [cx, cz, a0] of C) {
    for (let i = 0; i <= seg; i++) {
      const a = a0 + (i / seg) * (Math.PI / 2);
      const s = Math.sin(a);
      const c = Math.cos(a);
      out.push([cx + r * s, cz + r * c, s, c]);
    }
  }
  return out;
}

/** Ein Eimer: sammelt Dreiecke (Ort, Normale, Farbe, bei G auch Atlas-Koordinaten, bei W die Angaben zur Bewegung). */
class Part {
  constructor(bau, withUv, withFlow = false) {
    this.bau = bau;
    this.p = [];
    this.n = [];
    this.c = [];
    this.uv = withUv ? [] : null;
    this.fl = withFlow ? [] : null;
    this.kd = withFlow ? [] : null;
  }

  /**
   * Dreiecke ablegen. P: Orte, N: Normalen oder null (dann flach je Dreieck), idx: Dreiecksliste, K: Helligkeit je
   * Eckpunkt oder null, UV: Atlas-Koordinaten je Eckpunkt oder null. o.k: Helligkeit, o.g: [unten, oben] als Verlauf.
   * Nur Wasser: o.kind (Art der Bewegung), o.flow ([x, y, z, w] für alle Eckpunkte) oder FL (je Eckpunkt vier Werte).
   */
  _tris(P, N, idx, col, o, K, UV, FL) {
    const rgb = lin(col);
    const B = this.bau;
    const e = B.m.elements;
    const q = B.nm.elements;
    const k0 = o && o.k !== undefined ? o.k : 1;
    let g0 = 1;
    let g1 = 1;
    let ya = 0;
    let yd = 0;
    if (o && o.g) {
      [g0, g1] = o.g;
      let lo = Infinity;
      let hi = -Infinity;
      if (o.gy) [lo, hi] = o.gy;
      else {
        for (let i = 1; i < P.length; i += 3) {
          if (P[i] < lo) lo = P[i];
          if (P[i] > hi) hi = P[i];
        }
      }
      ya = lo;
      yd = hi > lo ? 1 / (hi - lo) : 0;
    }
    const flip = B.flip;
    const kind = (o && o.kind) || 0;
    const flow = o && o.flow;
    const noShade = !!(o && o.flat);
    for (let t = 0; t < idx.length; t += 3) {
      const ia = idx[t] * 3;
      let ib = idx[t + 1] * 3;
      let ic = idx[t + 2] * 3;
      const ux = P[ib] - P[ia];
      const uy = P[ib + 1] - P[ia + 1];
      const uz = P[ib + 2] - P[ia + 2];
      const vx = P[ic] - P[ia];
      const vy = P[ic + 1] - P[ia + 1];
      const vz = P[ic + 2] - P[ia + 2];
      let fx = uy * vz - uz * vy;
      let fy = uz * vx - ux * vz;
      let fz = ux * vy - uy * vx;
      const fl = Math.hypot(fx, fy, fz);
      if (fl < 1e-10) continue; // entartet (z. B. Spitze eines Kegels)
      fx /= fl;
      fy /= fl;
      fz /= fl;
      if (N && fx * N[ia] + fy * N[ia + 1] + fz * N[ia + 2] < 0) {
        // Umlaufsinn nach den mitgegebenen Normalen richten (Röhren, Ringe)
        const sw = ib;
        ib = ic;
        ic = sw;
      }
      for (let s = 0; s < 3; s++) {
        const i = s === 0 ? ia : (s === 1) !== flip ? ib : ic;
        const x = P[i];
        const y = P[i + 1];
        const z = P[i + 2];
        const nx = N ? N[i] : fx;
        const ny = N ? N[i + 1] : fy;
        const nz = N ? N[i + 2] : fz;
        const Y = e[1] * x + e[5] * y + e[9] * z + e[13];
        let NX = q[0] * nx + q[3] * ny + q[6] * nz;
        let NY = q[1] * nx + q[4] * ny + q[7] * nz;
        let NZ = q[2] * nx + q[5] * ny + q[8] * nz;
        const nl = Math.hypot(NX, NY, NZ) || 1;
        let k = noShade ? k0 : k0 * B.shade(Y);
        // Flächen, die nach unten schauen, bekommen nur Bodenlicht (olivgrünes Himmelslicht von unten und das Licht vom
        // sonnigen Pflaster, siehe SOFT_GLSL): etwas aufhellen, damit Balkone, Markisen und Traufen nicht absaufen
        if (NY < -0.5 * nl && !noShade) k *= 1 + 1.1 * (-NY / nl - 0.5);
        if (K) k *= K[i / 3];
        if (yd) k *= g0 + (g1 - g0) * Math.min(1, Math.max(0, (y - ya) * yd));
        this.p.push(e[0] * x + e[4] * y + e[8] * z + e[12], Y, e[2] * x + e[6] * y + e[10] * z + e[14]);
        this.n.push(NX / nl, NY / nl, NZ / nl);
        this.c.push(rgb[0] * k, rgb[1] * k, rgb[2] * k);
        if (this.uv) {
          if (UV) this.uv.push(UV[(i / 3) * 2], UV[(i / 3) * 2 + 1]);
          else this.uv.push(WHITE_U, WHITE_V);
        }
        if (this.fl) {
          const f = FL || flow;
          const fo = FL ? (i / 3) * 4 : 0;
          if (!f) this.fl.push(0, 0, 0, 0);
          else if (kind >= 2) {
            // Geschwindigkeiten drehen sich mit dem Bauteil
            this.fl.push(e[0] * f[fo] + e[4] * f[fo + 1] + e[8] * f[fo + 2], e[1] * f[fo] + e[5] * f[fo + 1] + e[9] * f[fo + 2], e[2] * f[fo] + e[6] * f[fo + 1] + e[10] * f[fo + 2], f[fo + 3]);
          } else this.fl.push(f[fo], f[fo + 1], f[fo + 2], f[fo + 3]);
          this.kd.push(kind);
        }
      }
    }
    return this;
  }

  tri(a, b, c, col, o) {
    return this._tris([...a, ...b, ...c], null, [0, 1, 2], col, o);
  }

  /**
   * Freie Dreiecke: P Orte, N Normalen (oder null), idx Dreiecksliste, UV Atlas-Koordinaten je Eckpunkt (oder null),
   * K Helligkeit je Eckpunkt (oder null).
   */
  mesh(P, N, idx, col, o, UV = null, K = null) {
    return this._tris(P, N, idx, col, o, K, UV);
  }

  /** Viereck a → b → c → d (gegen den Uhrzeigersinn von vorne gesehen). */
  quad(a, b, c, d, col, o) {
    return this._tris([...a, ...b, ...c, ...d], null, [0, 1, 2, 0, 2, 3], col, o);
  }

  /** Ebenes, konvexes Vieleck als Fächer. */
  poly(pts, col, o) {
    const P = [];
    const idx = [];
    for (const p of pts) P.push(p[0], p[1], p[2]);
    for (let i = 1; i < pts.length - 1; i++) idx.push(0, i, i + 1);
    return this._tris(P, null, idx, col, o);
  }

  /** Rechteck in der Ebene z, schaut nach +z: x = Mitte, y = Unterkante. o.uv = Atlas-Feld [u0, v0, u1, v1]. */
  rect(x, y, z, w, h, col, o) {
    const P = [x - w / 2, y, z, x + w / 2, y, z, x + w / 2, y + h, z, x - w / 2, y + h, z];
    let UV = null;
    if (o && o.uv) {
      const [u0, v0, u1, v1] = o.uv;
      UV = [u0, v0, u1, v0, u1, v1, u0, v1];
    }
    return this._tris(P, null, [0, 1, 2, 0, 2, 3], col, o, null, UV);
  }

  /** Scheibe um (x, y, z), schaut nach +z (o.up: nach oben). */
  disc(x, y, z, r, col, o = {}) {
    const seg = o.seg ?? 16;
    const P = [x, y, z];
    const idx = [];
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * TAU;
      if (o.up) P.push(x + Math.sin(a) * r, y, z + Math.cos(a) * r);
      else P.push(x + Math.cos(a) * r, y + Math.sin(a) * r, z);
      if (i < seg) idx.push(0, i + 1, i + 2);
    }
    return this._tris(P, null, idx, col, o);
  }

  /**
   * Pyramidenstumpf: unten w0 × d0, oben w1 × d1, Mitte (x, z), Fuß bei y. o.skip: Seiten weglassen
   * (f vorne +z, k hinten −z, l links −x, r rechts +x, t oben, b unten).
   */
  frust(x, y, z, w0, d0, w1, d1, h, col, o) {
    const a = w0 / 2;
    const b = d0 / 2;
    const c = w1 / 2;
    const e = d1 / 2;
    const Y = y + h;
    const P = [
      x - a, y, z - b, x + a, y, z - b, x + a, y, z + b, x - a, y, z + b,
      x - c, Y, z - e, x + c, Y, z - e, x + c, Y, z + e, x - c, Y, z + e,
    ];
    const skip = (o && o.skip) || '';
    const idx = [];
    const face = (ch, i, j, k, l) => {
      if (!skip.includes(ch)) idx.push(i, j, k, i, k, l);
    };
    face('f', 3, 2, 6, 7);
    face('r', 2, 1, 5, 6);
    face('k', 1, 0, 4, 5);
    face('l', 0, 3, 7, 4);
    face('t', 7, 6, 5, 4);
    face('b', 0, 1, 2, 3);
    return this._tris(P, null, idx, col, o);
  }

  /** Quader: Mitte (x, z), Fuß bei y. */
  box(x, y, z, w, h, d, col, o) {
    return this.frust(x, y, z, w, d, w, d, h, col, o);
  }

  /**
   * Rotationskörper um die Senkrechte durch (x, z): prof = [[Radius, Höhe], …] von unten nach oben.
   * o.seg Teilung, o.sx / o.sz elliptisch, o.a0 / o.a1 Teilbogen (0 = vorne, wächst nach rechts), o.ks Helligkeit
   * je Profilpunkt, o.top / o.bottom Deckel (oben standardmäßig zu, unten offen). col darf je Band eine Farbe sein.
   * o.facet: ebene Flächen statt runder Schattierung (Achtecke).
   */
  lathe(x, y, z, prof, col, o = {}) {
    const seg = o.seg ?? 10;
    const a0 = o.a0 ?? 0;
    const a1 = o.a1 ?? TAU;
    const sx = o.sx ?? 1;
    const sz = o.sz ?? 1;
    const sn = [];
    const cs = [];
    const hx = [];
    const hz = [];
    for (let i = 0; i <= seg; i++) {
      const a = a0 + ((a1 - a0) * i) / seg;
      const s = Math.sin(a);
      const c = Math.cos(a);
      sn.push(s * sx);
      cs.push(c * sz);
      const l = Math.hypot(s / sx, c / sz);
      hx.push(s / sx / l);
      hz.push(c / sz / l);
    }
    const oo = { ...o, gy: o.g ? [y + prof[0][1], y + prof[prof.length - 1][1]] : undefined };
    for (const b of profBands(prof, o.crease ?? 0.72)) {
      const [r0, y0] = prof[b.j];
      const [r1, y1] = prof[b.j + 1];
      const P = [];
      const N = [];
      const K = o.ks ? [] : null;
      const idx = [];
      for (let i = 0; i <= seg; i++) {
        P.push(x + r0 * sn[i], y + y0, z + r0 * cs[i], x + r1 * sn[i], y + y1, z + r1 * cs[i]);
        N.push(hx[i] * b.a[0], b.a[1], hz[i] * b.a[0], hx[i] * b.b[0], b.b[1], hz[i] * b.b[0]);
        if (K) K.push(o.ks[b.j], o.ks[b.j + 1]);
        if (i < seg) {
          const p = i * 2;
          idx.push(p, p + 2, p + 3, p, p + 3, p + 1);
        }
      }
      this._tris(P, o.facet ? null : N, idx, Array.isArray(col) ? col[b.j] : col, oo, K);
    }
    const cap = (j, up) => {
      const [r, yy] = prof[j];
      if (r < 1e-6) return;
      const P = [x, y + yy, z];
      const idx = [];
      for (let i = 0; i <= seg; i++) {
        P.push(x + r * sn[i], y + yy, z + r * cs[i]);
        if (i < seg) {
          if (up) idx.push(0, i + 1, i + 2);
          else idx.push(0, i + 2, i + 1);
        }
      }
      const c = Array.isArray(col) ? col[Math.min(j, col.length - 1)] : col;
      this._tris(P, null, idx, c, { ...oo, k: (o.k ?? 1) * (o.ks ? o.ks[j] : 1) });
    };
    if (o.top !== false) cap(prof.length - 1, true);
    if (o.bottom) cap(0, false);
    return this;
  }

  /** Zylinder oder Kegelstumpf: Fuß bei y, unten r0, oben r1. */
  cyl(x, y, z, r0, r1, h, col, o) {
    return this.lathe(x, y, z, [[r0, 0], [r1, h]], col, o);
  }

  /** Kugel um (x, y, z); o.sy staucht, o.lat = [von, bis] (Breitengrade in rad) schneidet Kuppeln aus. */
  ball(x, y, z, r, col, o = {}) {
    const hs = o.hs ?? 6;
    const [l0, l1] = o.lat ?? [-Math.PI / 2, Math.PI / 2];
    const sy = o.sy ?? 1;
    const prof = [];
    for (let i = 0; i <= hs; i++) {
      const a = l0 + ((l1 - l0) * i) / hs;
      prof.push([Math.max(0, r * Math.cos(a)), r * Math.sin(a) * sy]);
    }
    return this.lathe(x, y, z, prof, col, { seg: o.ws ?? 10, crease: -1, top: l1 < Math.PI / 2 - 1e-3, ...o });
  }

  /** Stab von p0 nach p1 mit Radius r (o.r1: Radius am Ende, o.caps: Enden schließen, 'end': nur bei p1). */
  rod(p0, p1, r, col, o = {}) {
    _v1.set(p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]);
    const len = _v1.length();
    if (len < 1e-6) return this;
    _q.setFromUnitVectors(_v2.set(0, 1, 0), _v1.divideScalar(len));
    _m.compose(_v2.set(p0[0], p0[1], p0[2]), _q, _v1.set(1, 1, 1));
    this.bau.push(_m);
    this.lathe(0, 0, 0, [[r, 0], [o.r1 ?? r, len]], col, { seg: 6, ...o, top: !!o.caps, bottom: o.caps === true });
    this.bau.pop();
    return this;
  }

  /**
   * Körper mit runden senkrechten Kanten: Grundriss w × d um (x, z), Eckradius r, Höhe h ab y.
   * o.prof = [[Einzug, Höhe], …] für Fasen und Absätze, o.ks Helligkeit je Profilpunkt, o.seg Teilung der Ecken.
   */
  rbox(x, y, z, w, h, d, r0, col, o = {}) {
    const seg = o.seg ?? 3;
    // Eckradius höchstens halb so groß wie die schmale Seite, sonst würde der Körper dicker als d
    const r = Math.min(r0, w / 2, d / 2);
    const prof = o.prof ?? [[0, 0], [0, h]];
    const rings = prof.map(([ins]) => roundRing(w - 2 * ins, d - 2 * ins, Math.max(r - ins, 0), seg));
    const n = rings[0].length;
    const oo = { ...o, gy: o.g ? [y + prof[0][1], y + prof[prof.length - 1][1]] : undefined };
    for (const b of profBands(prof.map(([ins, yy]) => [-ins, yy]), o.crease ?? 0.72)) {
      const A = rings[b.j];
      const B = rings[b.j + 1];
      const y0 = y + prof[b.j][1];
      const y1 = y + prof[b.j + 1][1];
      const P = [];
      const N = [];
      const K = o.ks ? [] : null;
      const idx = [];
      for (let i = 0; i <= n; i++) {
        const p = A[i % n];
        const t = B[i % n];
        P.push(x + p[0], y0, z + p[1], x + t[0], y1, z + t[1]);
        N.push(p[2] * b.a[0], b.a[1], p[3] * b.a[0], t[2] * b.b[0], b.b[1], t[3] * b.b[0]);
        if (K) K.push(o.ks[b.j], o.ks[b.j + 1]);
        if (i < n) {
          const q = i * 2;
          idx.push(q, q + 2, q + 3, q, q + 3, q + 1);
        }
      }
      this._tris(P, N, idx, Array.isArray(col) ? col[b.j] : col, oo, K);
    }
    const cap = (j, up) => {
      const R = rings[j];
      const yy = y + prof[j][1];
      const P = [x, yy, z];
      const idx = [];
      for (let i = 0; i <= n; i++) {
        P.push(x + R[i % n][0], yy, z + R[i % n][1]);
        if (i < n) {
          if (up) idx.push(0, i + 1, i + 2);
          else idx.push(0, i + 2, i + 1);
        }
      }
      const c = Array.isArray(col) ? col[Math.min(j, col.length - 1)] : col;
      this._tris(P, null, idx, c, { ...oo, k: (o.k ?? 1) * (o.ks ? o.ks[j] : 1) });
    };
    if (o.top !== false) cap(prof.length - 1, true);
    if (o.bottom) cap(0, false);
    return this;
  }

  /**
   * Vieleck pts = [[x, y], …] in der xy-Ebene, von z0 bis z1 gezogen (z1 > z0; Deckel bei z1 schaut nach +z).
   * o.holes: Löcher, o.caps: 'fb' (vorne/hinten), o.sides: false lässt die Mantelfläche weg, o.down: Farbe der Flächen, die nach
   * unten schauen.
   */
  extrude(pts, z0, z1, col, o = {}) {
    const area = (p) => {
      let a = 0;
      for (let i = 0; i < p.length; i++) {
        const q = p[(i + 1) % p.length];
        a += p[i][0] * q[1] - q[0] * p[i][1];
      }
      return a;
    };
    const outer = area(pts) < 0 ? [...pts].reverse() : pts;
    const holes = (o.holes || []).map((h) => (area(h) > 0 ? [...h].reverse() : h));
    const caps = o.caps ?? 'fb';
    if (caps) {
      const all = [outer, ...holes].flat();
      const v2 = (p) => new THREE.Vector2(p[0], p[1]);
      const faces = THREE.ShapeUtils.triangulateShape(outer.map(v2), holes.map((h) => h.map(v2)));
      for (const front of [true, false]) {
        if (!caps.includes(front ? 'f' : 'b')) continue;
        const z = front ? z1 : z0;
        const P = [];
        for (const p of all) P.push(p[0], p[1], z);
        const idx = [];
        for (const [a, b, c] of faces) {
          const ccw = (all[b][0] - all[a][0]) * (all[c][1] - all[a][1]) - (all[c][0] - all[a][0]) * (all[b][1] - all[a][1]) > 0;
          if (ccw === front) idx.push(a, b, c);
          else idx.push(a, c, b);
        }
        this._tris(P, null, idx, col, o);
      }
    }
    if (o.sides !== false) {
      const crease = o.crease ?? 0.8;
      for (const loop of [outer, ...holes]) {
        const n = loop.length;
        const en = [];
        for (let i = 0; i < n; i++) {
          const q = loop[(i + 1) % n];
          const dx = q[0] - loop[i][0];
          const dy = q[1] - loop[i][1];
          const l = Math.hypot(dx, dy) || 1;
          en.push([dy / l, -dx / l]);
        }
        const P = [];
        const N = [];
        const idx = [];
        const D = [];
        const dIdx = [];
        for (let i = 0; i < n; i++) {
          const p = loop[i];
          const q = loop[(i + 1) % n];
          if (o.down !== undefined && en[i][1] < -0.5) {
            // Untersicht (z. B. unter dem Dachüberstand) in eigener, heller Farbe
            const base = D.length / 3;
            D.push(p[0], p[1], z0, q[0], q[1], z0, q[0], q[1], z1, p[0], p[1], z1);
            dIdx.push(base, base + 1, base + 2, base, base + 2, base + 3);
            continue;
          }
          const prev = en[(i + n - 1) % n];
          const next = en[(i + 1) % n];
          let a = en[i];
          let b = en[i];
          if (prev[0] * a[0] + prev[1] * a[1] > crease) a = [prev[0] + a[0], prev[1] + a[1]];
          if (next[0] * en[i][0] + next[1] * en[i][1] > crease) b = [next[0] + en[i][0], next[1] + en[i][1]];
          const base = P.length / 3;
          P.push(p[0], p[1], z0, q[0], q[1], z0, q[0], q[1], z1, p[0], p[1], z1);
          N.push(a[0], a[1], 0, b[0], b[1], 0, b[0], b[1], 0, a[0], a[1], 0);
          idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
        }
        this._tris(P, N, idx, o.sideCol ?? col, o);
        if (D.length) this._tris(D, null, dIdx, o.down, { k: o.k });
      }
    }
    return this;
  }

  /** Ring (Torus) um die Senkrechte durch (x, y, z): großer Radius R, Rohrradius r. o.a0 / o.a1 Teilbogen. */
  torus(x, y, z, R, r, col, o = {}) {
    const seg = o.seg ?? 20;
    const tube = o.tube ?? 6;
    const a0 = o.a0 ?? 0;
    const a1 = o.a1 ?? TAU;
    const P = [];
    const N = [];
    const idx = [];
    for (let i = 0; i <= seg; i++) {
      const u = a0 + ((a1 - a0) * i) / seg;
      const su = Math.sin(u);
      const cu = Math.cos(u);
      for (let j = 0; j <= tube; j++) {
        const v = (j / tube) * TAU;
        const cv = Math.cos(v);
        const sv = Math.sin(v);
        P.push(x + (R + r * cv) * su, y + r * sv, z + (R + r * cv) * cu);
        N.push(cv * su, sv, cv * cu);
        if (i < seg && j < tube) {
          const p = i * (tube + 1) + j;
          const q = p + tube + 1;
          idx.push(p, q, q + 1, p, q + 1, p + 1);
        }
      }
    }
    return this._tris(P, N, idx, col, o);
  }

  /** Tafel mit Atlas-Schrift: Mitte x, Unterkante y, schaut nach +z; die Höhe folgt aus dem Feld. */
  sign(x, y, z, w, key, o) {
    const h = w / atlasAspect(key);
    this.rect(x, y, z, w, h, 0xffffff, { ...o, uv: atlasUV(key) });
    return h;
  }

  // --- Wasser (nur im Eimer W) --------------------------------------------------------------------------------

  /**
   * Stehende Wasserfläche: Scheibe oder Ring (o.r0 … r) um (x, z) in Höhe y. o.hit = Radius, an dem Strahlen
   * auftreffen (von dort laufen Ringe), o.rings = Stärke der Ringe (0 … 1).
   */
  pool(x, y, z, r, col, o = {}) {
    const seg = o.seg ?? 20;
    const r0 = o.r0 ?? 0;
    const sx = o.sx ?? 1;
    const sz = o.sz ?? 1;
    const a0 = o.a0 ?? 0;
    const a1 = o.a1 ?? TAU;
    const P = [];
    const UV = [];
    const K = [];
    const idx = [];
    for (let i = 0; i <= seg; i++) {
      const a = a0 + ((a1 - a0) * i) / seg;
      const s = Math.sin(a);
      const c = Math.cos(a);
      P.push(x + s * r0 * sx, y, z + c * r0 * sz, x + s * r * sx, y, z + c * r * sz);
      UV.push(s * r0 * sx, c * r0 * sz, s * r * sx, c * r * sz);
      K.push(0.9, 1.08);
      if (i < seg) {
        const q = i * 2;
        idx.push(q, q + 1, q + 3, q, q + 3, q + 2);
      }
    }
    return this._tris(P, null, idx, col, { flat: true, kind: 0, flow: [o.hit ?? 0, o.rings ?? 0.6, 0, 0] }, K, UV);
  }

  /** Rechteckige Wasserfläche w × d um (x, z) in Höhe y (Tröge, Kanäle); o.c = [x, z]: Mitte der Wellenringe. */
  poolRect(x, y, z, w, d, col, o = {}) {
    const [cx, cz] = o.c ?? [0, 0];
    const P = [x - w / 2, y, z + d / 2, x + w / 2, y, z + d / 2, x + w / 2, y, z - d / 2, x - w / 2, y, z - d / 2];
    const UV = [-w / 2 - cx, d / 2 - cz, w / 2 - cx, d / 2 - cz, w / 2 - cx, -d / 2 - cz, -w / 2 - cx, -d / 2 - cz];
    return this._tris(P, null, [0, 1, 2, 0, 2, 3], col, { flat: true, kind: 0, flow: [o.hit ?? 0, o.rings ?? 0.5, 0, 0] }, null, UV);
  }

  /**
   * Wasserstrahl: Röhre entlang der Wurfparabel ab p0 mit der Anfangsgeschwindigkeit v0 (m/s), bis sie auf die Höhe
   * yEnd gefallen ist (o.apex: nur bis zum Scheitel). r = Radius am Anfang, o.r1 am Ende. Gibt Auftreffpunkt und
   * Flugdauer zurück: [x, y, z, T].
   */
  jet(p0, v0, yEnd, r, col, o = {}) {
    const g = 9.81;
    const T = o.apex ? v0[1] / g : (v0[1] + Math.sqrt(Math.max(0, v0[1] * v0[1] + 2 * g * (p0[1] - yEnd)))) / g;
    const n = o.n ?? 8;
    const seg = o.seg ?? 5;
    const r1 = o.r1 ?? r * 1.5;
    const hs = Math.hypot(v0[0], v0[2]);
    // feste Querachse (waagrecht, quer zur Flugebene)
    const sxv = hs > 1e-4 ? -v0[2] / hs : 1;
    const szv = hs > 1e-4 ? v0[0] / hs : 0;
    const P = [];
    const N = [];
    const UV = [];
    const idx = [];
    let len = 0;
    let px = p0[0];
    let py = p0[1];
    let pz = p0[2];
    for (let i = 0; i <= n; i++) {
      const t = (T * i) / n;
      const cx = p0[0] + v0[0] * t;
      const cy = p0[1] + v0[1] * t - 0.5 * g * t * t;
      const cz = p0[2] + v0[2] * t;
      len += Math.hypot(cx - px, cy - py, cz - pz);
      px = cx;
      py = cy;
      pz = cz;
      let tx = v0[0];
      let ty = v0[1] - g * t;
      let tz = v0[2];
      const tl = Math.hypot(tx, ty, tz) || 1;
      tx /= tl;
      ty /= tl;
      tz /= tl;
      // zweite Querachse in der Flugebene: s × t
      const ux = -szv * ty;
      const uy = szv * tx - sxv * tz;
      const uz = sxv * ty;
      const rr = r + ((r1 - r) * i) / n;
      for (let j = 0; j <= seg; j++) {
        const a = (j / seg) * TAU;
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        const nx = sxv * ca + ux * sa;
        const ny = uy * sa;
        const nz = szv * ca + uz * sa;
        P.push(cx + nx * rr, cy + ny * rr, cz + nz * rr);
        N.push(nx, ny, nz);
        UV.push(j / seg, len);
        if (i < n && j < seg) {
          const q = i * (seg + 1) + j;
          idx.push(q, q + seg + 1, q + seg + 2, q, q + seg + 2, q + 1);
        }
      }
    }
    this._tris(P, N, idx, col, { flat: true, kind: 1, k: o.k, flow: [o.speed ?? Math.max(0.6, Math.hypot(v0[0], v0[1], v0[2]) * 0.5), r * (o.pulse ?? 0.28), o.ph ?? 0, 0] }, null, UV);
    return [px, py, pz, T];
  }

  /**
   * n Tropfen ab p0: Anfangsgeschwindigkeit v0, gestreut um o.spread (m/s), fliegen bis zur Höhe yEnd und beginnen
   * dann von vorn. o.size = Radius eines Tropfens, rnd = Zufallsquelle.
   */
  drops(p0, v0, yEnd, n, col, rnd, o = {}) {
    if (this.bau.lod > 0) return this;
    const g = 9.81;
    const sp = o.spread ?? 0.3;
    const size = o.size ?? 0.035;
    const V = [[1, 0, 0], [-1, 0, 0], [0, 1.5, 0], [0, -1.5, 0], [0, 0, 1], [0, 0, -1]];
    const idx = [0, 2, 4, 4, 2, 1, 1, 2, 5, 5, 2, 0, 4, 3, 0, 1, 3, 4, 5, 3, 1, 0, 3, 5];
    for (let k = 0; k < n; k++) {
      const vx = v0[0] + (rnd() - 0.5) * 2 * sp;
      const vy = v0[1] * (1 - rnd() * (o.spreadY ?? 0.18));
      const vz = v0[2] + (rnd() - 0.5) * 2 * sp;
      const T = (vy + Math.sqrt(Math.max(0, vy * vy + 2 * g * (p0[1] - yEnd)))) / g;
      const s = size * (0.7 + rnd() * 0.6);
      const P = [];
      const N = [];
      const UV = [];
      for (const v of V) {
        P.push(p0[0] + v[0] * s, p0[1] + v[1] * s, p0[2] + v[2] * s);
        N.push(v[0], v[1] / 1.5, v[2]);
        UV.push(T, 0);
      }
      this._tris(P, N, idx, col, { flat: true, kind: 2, flow: [vx, vy, vz, rnd()] }, null, UV);
    }
    return this;
  }

  /** Ring, der sich auf der Wasserfläche von r0 auf r1 ausbreitet und dabei zur Wasserfarbe verblasst (col). */
  splash(x, y, z, r0, r1, col, o = {}) {
    if (this.bau.lod > 0) return this;
    const seg = o.seg ?? 10;
    const wd = o.w ?? 0.03;
    const T = o.T ?? 1.5;
    const ph = o.ph ?? 0;
    const P = [];
    const UV = [];
    const FL = [];
    const idx = [];
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * TAU;
      const s = Math.sin(a);
      const c = Math.cos(a);
      P.push(x + s * (r0 - wd), y, z + c * (r0 - wd), x + s * (r0 + wd), y, z + c * (r0 + wd));
      UV.push(T, 0, T, 0);
      FL.push(s * (r1 - r0), 0, c * (r1 - r0), ph, s * (r1 - r0), 0, c * (r1 - r0), ph);
      if (i < seg) {
        const q = i * 2;
        idx.push(q, q + 1, q + 3, q, q + 3, q + 2);
      }
    }
    return this._tris(P, null, idx, col, { flat: true, kind: 3 }, null, UV, FL);
  }

  geometry() {
    if (!this.p.length) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.n, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.c, 3));
    if (this.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    if (this.fl) {
      g.setAttribute('aFlow', new THREE.Float32BufferAttribute(this.fl, 4));
      g.setAttribute('aKind', new THREE.Float32BufferAttribute(this.kd, 1));
    }
    g.computeBoundingBox();
    g.computeBoundingSphere();
    return g;
  }
}

const PANE = mix(PAL.glass, PAL.glassDark, 0.3);
const SOFFIT = 0xf3ead8; // Untersichten von Dächern und Vordächern: hell, damit sie im Schatten nicht zulaufen

/**
 * Der Bau: drei Eimer, ein Stapel von Verschiebungen/Drehungen und die Bauteile, die fast jedes Haus braucht
 * (Fenster, Türen, Dächer). lod 0 = nah (volle Details), 1 = fern (nur was die Silhouette und die Farbflächen trägt).
 * fade/low: bis zur Höhe fade wird alles zum Boden hin auf low abgedunkelt (weicher Bodenschatten in den Farben).
 */
export class Bau {
  constructor({ lod = 0, fade = 2.4, low = 0.8 } = {}) {
    this.lod = lod;
    this.fade = fade;
    this.low = low;
    this.m = new THREE.Matrix4();
    this.nm = new THREE.Matrix3();
    this.flip = false;
    this.stack = [];
    this.T = new Part(this, false);
    this.F = new Part(this, false);
    this.G = new Part(this, true);
    this.W = new Part(this, true, true);
    this.L = new Part(this, false);
  }

  shade(y) {
    const t = Math.min(1, Math.max(0, y / this.fade));
    return this.low + (1 - this.low) * t * (2 - t);
  }

  push(mat) {
    this.stack.push(this.m.clone());
    this.m.multiply(mat);
    this.nm.getNormalMatrix(this.m);
    this.flip = this.m.determinant() < 0;
  }

  pop() {
    this.m.copy(this.stack.pop());
    this.nm.getNormalMatrix(this.m);
    this.flip = this.m.determinant() < 0;
  }

  /** fn mit verschobenem und um die Senkrechte gedrehtem Ursprung ausführen. */
  at(x, y, z, ry, fn) {
    this.push(new THREE.Matrix4().makeRotationY(ry || 0).setPosition(x, y, z));
    fn();
    this.pop();
    return this;
  }

  /** Beliebige Lage: Ort, Drehung (Euler XYZ) und Maßstab (Zahl oder [x, y, z]). */
  xf(pos, rot, scale, fn) {
    const s = typeof scale === 'number' ? [scale, scale, scale] : scale;
    _q.setFromEuler(_e.set(rot[0], rot[1], rot[2]));
    this.push(new THREE.Matrix4().compose(new THREE.Vector3(...pos), _q, new THREE.Vector3(...s)));
    fn();
    this.pop();
    return this;
  }

  /** fn(1) und gespiegelt an der Ebene x = 0 noch einmal fn(−1) – für alles Paarige. */
  mirror(fn) {
    fn(1);
    this.push(new THREE.Matrix4().makeScale(-1, 1, 1));
    fn(-1);
    this.pop();
    return this;
  }

  /** Die vier Wandseiten eines Körpers w × d (Ursprung vorne Mitte): fn(Wandbreite, Name) mit z = 0 als Wandebene. */
  sides(w, d, fn, which = 'frkl') {
    if (which.includes('f')) this.at(0, 0, 0, 0, () => fn(w, 'f'));
    if (which.includes('r')) this.at(w / 2, 0, -d / 2, Math.PI / 2, () => fn(d, 'r'));
    if (which.includes('k')) this.at(0, 0, -d, Math.PI, () => fn(w, 'k'));
    if (which.includes('l')) this.at(-w / 2, 0, -d / 2, -Math.PI / 2, () => fn(d, 'l'));
    return this;
  }

  // --- Fassadenteile (Wandebene z = 0, schauen nach +z) -------------------------------------------------------

  /**
   * Fenster: x = Mitte, y = Unterkante der Scheibe. o: frame (Farbe), cross (0 keine, 1 senkrechte, 2 Kreuz-Sprosse),
   * sill (Fensterbank), shutter (Farbe der Läden), flowers (Farbe der Blüten im Kasten), arch (Rundbogen),
   * flat (nur flacher Rahmen), pane (Scheibenfarbe).
   */
  win(x, y, w, h, o = {}) {
    const G = this.G;
    const fc = o.frame ?? PAL.frame;
    const pc = o.pane ?? PANE;
    const fw = o.fw ?? 0.09;
    const out = 0.06;
    const far = this.lod > 0 || o.flat;
    if (o.arch) {
      // Rundbogen: Scheibe als Vieleck, Rahmen als flaches Band (nah mit Tiefe)
      const n = far ? 6 : 10;
      const r = w / 2;
      const yc = y + h - r;
      const inner = [[-r, y], [r, y]];
      const outer = [[-r - fw, y - fw], [r + fw, y - fw]];
      for (let i = 0; i <= n; i++) {
        const a = (i / n) * Math.PI;
        inner.push([Math.cos(a) * r, yc + Math.sin(a) * r]);
        outer.push([Math.cos(a) * (r + fw), yc + Math.sin(a) * (r + fw)]);
      }
      this.at(x, 0, 0, 0, () => {
        G.extrude(inner, 0.014, 0.015, pc, { caps: 'f', sides: false, g: [1.12, 0.7] });
        G.extrude(outer, 0, far ? 0.03 : out, fc, { caps: 'f', holes: [inner], sides: !far });
        if (!far && o.cross) G.rect(0, y, 0.035, 0.05, h, fc);
      });
      return this;
    }
    G.rect(x, y, 0.015, w, h, pc, { g: [1.12, 0.7] });
    if (far) {
      // flacher Rahmen aus vier Streifen (überlappt die Scheibe nicht, also flimmert nichts)
      G.rect(x, y + h, 0.015, w + 2 * fw, fw, fc);
      G.rect(x, y - fw, 0.015, w + 2 * fw, fw, fc);
      G.rect(x - w / 2 - fw / 2, y, 0.015, fw, h, fc);
      G.rect(x + w / 2 + fw / 2, y, 0.015, fw, h, fc);
      if (o.shutter) {
        const sw = w / 2;
        for (const s of [-1, 1]) G.rect(x + s * (w / 2 + fw + sw / 2 + 0.03), y - fw, 0.015, sw, h + 2 * fw, o.shutter);
      }
      return this;
    }
    // vier Leisten; die winzigen Stirnflächen oben und unten fallen weg
    G.box(x, y + h, out / 2, w + 2 * fw, fw, out, fc, { skip: 'klr' });
    G.box(x, y - fw, out / 2, w + 2 * fw, fw, out, fc, { skip: 'klr' });
    G.box(x - w / 2 - fw / 2, y - fw, out / 2, fw, h + 2 * fw, out, fc, { skip: 'ktb' });
    G.box(x + w / 2 + fw / 2, y - fw, out / 2, fw, h + 2 * fw, out, fc, { skip: 'ktb' });
    const cross = o.cross ?? 2;
    if (cross >= 1) G.rect(x, y, 0.04, 0.055, h, fc);
    if (cross >= 2) G.rect(x, y + h * 0.58, 0.04, w, 0.055, fc);
    if (o.sill !== false) G.box(x, y - fw - 0.06, 0.075, w + 2 * fw + 0.14, 0.06, 0.15, o.sillCol ?? PAL.stone, { skip: 'klr' });
    if (o.shutter) {
      const sw = w / 2;
      for (const s of [-1, 1]) {
        const sx = x + s * (w / 2 + fw + sw / 2 + 0.03);
        G.box(sx, y - fw, 0.025, sw, h + 2 * fw, 0.05, o.shutter, { skip: s > 0 ? 'ktbl' : 'ktbr' });
        G.rect(sx, y - fw + 0.1, 0.056, sw - 0.14, h + 2 * fw - 0.2, o.shutter, { k: 0.86 });
      }
    }
    if (o.flowers) this.flowerBox(x, y - fw - 0.06, w + 0.1, o.flowers);
    return this;
  }

  /** Blumenkasten vor der Wand: Oberkante bei y, Blüten in der Farbe col. */
  flowerBox(x, y, w, col = PAL.red, seed = 7) {
    const F = this.G;
    const rnd = rng(Math.round((x + 31) * 97 + y * 13 + seed));
    F.frust(x, y - 0.2, 0.2, w - 0.06, 0.16, w, 0.22, 0.2, CITY.woodDark, { skip: 'kt' });
    F.box(x, y - 0.02, 0.2, w - 0.04, 0.09, 0.2, CITY.leafDark, { skip: 'bk' });
    const n = Math.max(3, Math.round(w / 0.26));
    for (let i = 0; i < n; i++) {
      const fx = x - w / 2 + ((i + 0.5) / n) * w;
      F.ball(fx, y + 0.11 + rnd() * 0.05, 0.2 + (rnd() - 0.5) * 0.08, 0.09, i % 3 === 1 ? CITY.leaf : col, { ws: 5, hs: 2 });
    }
    return this;
  }

  /**
   * Tür: x = Mitte, Schwelle bei o.y (0). o: frame, light (Oberlicht), glass (verglast), steps (Stufe davor),
   * panels (Kassetten, Standard 2), knob.
   */
  door(x, w, h, col, o = {}) {
    const G = this.G;
    const y = o.y ?? 0;
    const fc = o.frame ?? PAL.frame;
    const fw = o.fw ?? 0.1;
    const out = 0.07;
    const far = this.lod > 0;
    const top = h + (o.light ? 0.42 : 0);
    if (far) {
      G.rect(x, y, 0.015, w, h, col, { g: [0.9, 1.04] });
      if (o.light) G.rect(x, y + h + 0.05, 0.015, w, 0.37, PANE);
      return this;
    }
    G.box(x, y + top, out / 2, w + 2 * fw, fw, out, fc, { skip: 'k' });
    G.box(x - w / 2 - fw / 2, y, out / 2, fw, top, out, fc, { skip: 'ktb' });
    G.box(x + w / 2 + fw / 2, y, out / 2, fw, top, out, fc, { skip: 'ktb' });
    if (o.glass) {
      G.rect(x, y + 0.28, 0.015, w - 0.16, h - 0.36, PANE, { g: [1.12, 0.74] });
      G.rect(x, y, 0.015, w, 0.28, col);
      G.rect(x, y + h - 0.08, 0.015, w, 0.08, col);
      G.rect(x - w / 2 + 0.04, y + 0.28, 0.015, 0.08, h - 0.36, col);
      G.rect(x + w / 2 - 0.04, y + 0.28, 0.015, 0.08, h - 0.36, col);
    } else {
      G.rect(x, y, 0.015, w, h, col, { g: [0.9, 1.04] });
      const n = o.panels ?? 2;
      const ph = (h - 0.3) / n;
      for (let i = 0; i < n; i++) G.rect(x, y + 0.14 + i * (ph + 0.02), 0.03, w - 0.28, ph - 0.1, col, { k: 0.84 });
    }
    if (o.light) {
      G.rect(x, y + h + 0.06, 0.015, w, 0.36, PANE, { g: [1.1, 0.8] });
      G.rect(x, y + h, 0.02, w, 0.06, fc);
    }
    if (o.knob !== false) G.ball(x + w / 2 - 0.16, y + h * 0.48, 0.07, 0.045, CITY.gold, { ws: 6, hs: 4 });
    if (o.steps) this.F.box(x, 0, 0.2, w + 0.5, y > 0.05 ? y : 0.14, 0.4, PAL.stone, { skip: 'kb' });
    return this;
  }

  /** Gestreifte Markise: Oberkante an der Wand bei y, ragt depth vor und fällt um drop; Unterseite ist geschlossen. */
  awning(x, y, w, depth, drop, colA, colB = PAL.frame) {
    const F = this.F;
    const n = this.lod > 0 ? 1 : Math.max(3, Math.round(w / 0.42) | 1);
    const sw = w / n;
    const val = 0.22;
    for (let i = 0; i < n; i++) {
      const x0 = x - w / 2 + i * sw;
      const x1 = x0 + sw;
      const c = i % 2 ? colB : colA;
      F.quad([x0, y - drop, depth], [x1, y - drop, depth], [x1, y, 0.02], [x0, y, 0.02], c);
      F.quad([x0, y - drop - val, depth], [x1, y - drop - val, depth], [x1, y - drop, depth], [x0, y - drop, depth], c, { k: 0.92 });
    }
    // Unterseite und Wangen
    F.quad([x - w / 2, y, 0.02], [x + w / 2, y, 0.02], [x + w / 2, y - drop, depth], [x - w / 2, y - drop, depth], mix(colA, colB, 0.5), { k: 0.62 });
    F.quad([x - w / 2, y - drop - val, depth], [x - w / 2, y - drop, depth], [x + w / 2, y - drop, depth], [x + w / 2, y - drop - val, depth], colA, { k: 0.6 });
    for (const s of [-1, 1]) {
      const xx = x + (s * w) / 2;
      const a = [xx, y, 0.02];
      const b = [xx, y - drop, depth];
      const c = [xx, y - drop - val, depth];
      const d = [xx, y - drop - val, 0.02];
      if (s > 0) F.tri(a, c, b, colA, { k: 0.8 });
      else F.tri(a, b, c, colA, { k: 0.8 });
      if (this.lod === 0) F.rod(d, c, 0.02, PAL.darkMetal);
    }
    return this;
  }

  /** Ladenschild aus dem Atlas auf einer vorstehenden Tafel; gibt die Höhe zurück. */
  board(x, y, w, key, o = {}) {
    const h = w / atlasAspect(key);
    const out = o.out ?? 0.09;
    const rim = o.rim ?? PAL.darkMetal;
    if (this.lod === 0) {
      this.G.box(x, y - 0.03, out / 2, w + 0.06, h + 0.06, out, rim, { skip: 'kf' });
    }
    this.G.rect(x, y - 0.03, out, w + 0.06, h + 0.06, rim);
    this.G.sign(x, y, out + 0.005, w, key);
    return h;
  }

  // --- Dächer -----------------------------------------------------------------------------------------------

  /**
   * Satteldach über dem Rechteck w × d um (x, z), Traufe bei y, Firsthöhe rh. o.axis: 'x' First parallel zur
   * Straße, 'z' Giebel zur Straße. o.oe / o.og Überstand an Traufe / Giebel, o.t Dicke.
   */
  gable(x, y, z, w, d, rh, col, o = {}) {
    const alongX = (o.axis ?? 'x') === 'x';
    const span = (alongX ? d : w) / 2;
    const len = (alongX ? w : d) / 2;
    const oe = o.oe ?? 0.4;
    const og = o.og ?? 0.3;
    const t = o.t ?? 0.24;
    const sl = rh / span;
    const lift = 0.07;
    const ye = y - oe * sl + lift;
    const yr = y + rh + lift;
    const prof = [[-span - oe, ye], [0, yr], [span + oe, ye], [span + oe, ye - t], [0, yr - t * 1.1], [-span - oe, ye - t]];
    this.at(x, 0, z, alongX ? Math.PI / 2 : 0, () => {
      this.F.extrude(prof, -len - og, len + og, col, { g: [0.84, 1.05], crease: 2, down: o.soffit ?? SOFFIT });
      if (this.lod === 0 && o.ridge !== false) this.F.rod([0, yr - 0.02, -len - og - 0.03], [0, yr - 0.02, len + og + 0.03], 0.09, col, { seg: 6, caps: true, k: 0.86 });
    });
    return this;
  }

  /** Walmdach (bei quadratischem Grundriss ein Zeltdach) über w × d um (x, z), Traufe bei y. */
  hip(x, y, z, w, d, rh, col, o = {}) {
    const F = this.F;
    const oe = o.oe ?? 0.4;
    const t = o.t ?? 0.22;
    const a = w / 2 + oe;
    const b = d / 2 + oe;
    const ye = y + 0.05;
    const yr = y + rh;
    const rl = Math.max(0, (Math.max(w, d) - Math.min(w, d)) / 2) * (o.ridge ?? 1);
    const rx = w >= d ? rl : 0;
    const rz = w >= d ? 0 : rl;
    const A = [x - a, ye, z + b];
    const B = [x + a, ye, z + b];
    const C = [x + a, ye, z - b];
    const D = [x - a, ye, z - b];
    const R1 = [x - rx, yr, z + rz];
    const R2 = [x + rx, yr, z + rz];
    const R3 = [x + rx, yr, z - rz];
    const R4 = [x - rx, yr, z - rz];
    const g = { g: [0.84, 1.05] };
    F.quad(A, B, R2, R1, col, g);
    F.quad(B, C, R3, R2, col, g);
    F.quad(C, D, R4, R3, col, g);
    F.quad(D, A, R1, R4, col, g);
    // Traufbrett rundum und Untersicht
    const lo = (p) => [p[0], p[1] - t, p[2]];
    F.quad(lo(A), lo(B), B, A, col, { k: 0.8 });
    F.quad(lo(B), lo(C), C, B, col, { k: 0.8 });
    F.quad(lo(C), lo(D), D, C, col, { k: 0.8 });
    F.quad(lo(D), lo(A), A, D, col, { k: 0.8 });
    F.quad(lo(A), lo(D), lo(C), lo(B), o.soffit ?? SOFFIT);
    return this;
  }

  /** Schornstein mit Kragen. */
  chimney(x, y, z, h, col = PAL.brick) {
    this.F.box(x, y, z, 0.5, h, 0.5, col, { skip: 'b', g: [0.9, 1.05] });
    this.F.box(x, y + h, z, 0.64, 0.12, 0.64, PAL.stone);
    if (this.lod === 0) this.F.cyl(x, y + h + 0.12, z, 0.14, 0.12, 0.26, mix(col, 0x000000, 0.25), { seg: 6 });
    return this;
  }

  /** Geometrien und Maße des fertigen Bausteins. */
  done(info) {
    const tint = this.T.geometry();
    const fixed = this.F.geometry();
    const gloss = this.G.geometry();
    const water = this.W.geometry();
    const light = this.L.geometry();
    const tris = (this.T.p.length + this.F.p.length + this.G.p.length + this.W.p.length + this.L.p.length) / 9;
    return { tint, fixed, gloss, water, light, info: { ...info, tris } };
  }
}

// ---------------------------------------------------------------------------
const ONE = [1, 1, 1];

/**
 * Viele gesetzte Bausteine zu höchstens vier Geometrien verschmelzen: matt, glänzend, Wasser und Leuchtendes.
 * items: [{ g: Ergebnis von kit.geo(), x, y, z, ry, s, tint }] (tint als sRGB-Hex). Fehlt eine Art, ist sie null.
 */
export function composeGeo(items) {
  let nm = 0;
  let ng = 0;
  let nw = 0;
  let nl = 0;
  const count = (g) => (g ? g.attributes.position.count : 0);
  for (const it of items) {
    nm += count(it.g.tint) + count(it.g.fixed);
    ng += count(it.g.gloss);
    nw += count(it.g.water);
    nl += count(it.g.light);
  }
  const buf = (n, uv, flow) => ({
    p: new Float32Array(n * 3), n: new Float32Array(n * 3), c: new Float32Array(n * 3),
    uv: uv ? new Float32Array(n * 2) : null, fl: flow ? new Float32Array(n * 4) : null, kd: flow ? new Float32Array(n) : null, i: 0,
  });
  const M = buf(nm, false, false);
  const G = buf(ng, true, false);
  const Wt = buf(nw, true, true);
  const L = buf(nl, false, false);
  const put = (dst, geo, it, tint) => {
    if (!geo) return;
    const s = it.s ?? 1;
    const cs = Math.cos(it.ry ?? 0);
    const sn = Math.sin(it.ry ?? 0);
    const x = it.x ?? 0;
    const y = it.y ?? 0;
    const z = it.z ?? 0;
    const P = geo.attributes.position.array;
    const N = geo.attributes.normal.array;
    const C = geo.attributes.color.array;
    const n = P.length / 3;
    for (let k = 0; k < n; k++) {
      const a = k * 3;
      const o = (dst.i + k) * 3;
      dst.p[o] = x + (P[a] * cs + P[a + 2] * sn) * s;
      dst.p[o + 1] = y + P[a + 1] * s;
      dst.p[o + 2] = z + (-P[a] * sn + P[a + 2] * cs) * s;
      dst.n[o] = N[a] * cs + N[a + 2] * sn;
      dst.n[o + 1] = N[a + 1];
      dst.n[o + 2] = -N[a] * sn + N[a + 2] * cs;
      dst.c[o] = C[a] * tint[0];
      dst.c[o + 1] = C[a + 1] * tint[1];
      dst.c[o + 2] = C[a + 2] * tint[2];
    }
    if (dst.uv) dst.uv.set(geo.attributes.uv.array, dst.i * 2);
    if (dst.fl) {
      const FL = geo.attributes.aFlow.array;
      const KD = geo.attributes.aKind.array;
      for (let k = 0; k < n; k++) {
        const a = k * 4;
        const o = (dst.i + k) * 4;
        if (KD[k] >= 2) {
          // Geschwindigkeiten mitdrehen und mitskalieren (die Schwerkraft im Shader bleibt, wie sie ist)
          dst.fl[o] = (FL[a] * cs + FL[a + 2] * sn) * s;
          dst.fl[o + 1] = FL[a + 1] * s;
          dst.fl[o + 2] = (-FL[a] * sn + FL[a + 2] * cs) * s;
        } else {
          dst.fl[o] = FL[a];
          dst.fl[o + 1] = FL[a + 1] * s;
          dst.fl[o + 2] = FL[a + 2];
        }
        dst.fl[o + 3] = FL[a + 3];
        dst.kd[dst.i + k] = KD[k];
      }
    }
    dst.i += n;
  };
  for (const it of items) {
    put(M, it.g.tint, it, lin(it.tint ?? (it.g.info.tints ? it.g.info.tints[0] : 0xffffff)));
    put(M, it.g.fixed, it, ONE);
    put(G, it.g.gloss, it, ONE);
    put(Wt, it.g.water, it, ONE);
    put(L, it.g.light, it, ONE);
  }
  const geo = (d) => {
    if (!d.i) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(d.p, 3));
    g.setAttribute('normal', new THREE.BufferAttribute(d.n, 3));
    g.setAttribute('color', new THREE.BufferAttribute(d.c, 3));
    if (d.uv) g.setAttribute('uv', new THREE.BufferAttribute(d.uv, 2));
    if (d.fl) {
      g.setAttribute('aFlow', new THREE.BufferAttribute(d.fl, 4));
      g.setAttribute('aKind', new THREE.BufferAttribute(d.kd, 1));
    }
    g.computeBoundingBox();
    g.computeBoundingSphere();
    // eigens für diesen Aufruf verschmolzen (anders als die geteilten Bausteine): siehe release()
    g.userData.merged = true;
    return g;
  };
  const water = geo(Wt);
  if (water) {
    // Tropfen fliegen über ihren Ruheort hinaus: Hülle für das Aussortieren großzügig fassen
    water.boundingSphere.radius += 6;
  }
  return { matte: geo(M), gloss: geo(G), water, light: geo(L), tris: (nm + ng + nw + nl) / 3 };
}

/**
 * Wie composeGeo, aber gleich als Group mit höchstens vier Meshes: so kostet ein ganzer Straßenzug zwei Draw Calls
 * (einen mehr, wenn ein Brunnen darin steht, und einen für Leuchtendes).
 */
export function compose(core, items, { shadows = true } = {}) {
  const geo = composeGeo(items);
  const group = new THREE.Group();
  const mesh = (g, mat, cast) => {
    if (!g) return;
    const m = new THREE.Mesh(g, mat);
    m.castShadow = cast;
    m.receiveShadow = shadows;
    group.add(m);
  };
  mesh(geo.matte, core.matte, shadows);
  // Scheiben, Rahmen und Schilder stehen nur Zentimeter vor: ihre Schatten wären nur Flimmern auf der Wand.
  // Wasser bewegt sich im Shader, sein Schatten bliebe stehen.
  mesh(geo.gloss, core.glossy, false);
  mesh(geo.water, core.water, false);
  mesh(geo.light, core.glow, false);
  group.userData.tris = geo.tris;
  return group;
}

/**
 * Gibt frei, was compose() für ein Objekt eigens verschmolzen hat. Geteilte Geometrien (Bausteine, Texttafeln),
 * Materialien und Texturen bleiben: sie gehören dem Baukasten – nur ein Textmaterial (textMaterial), das kein
 * anderes Objekt mehr nutzt, geht mit.
 */
export function release(obj) {
  obj.traverse((o) => {
    if (o.geometry && o.geometry.userData.merged) o.geometry.dispose();
    const m = o.material;
    if (!m || !m.userData || !m.userData.textMats || o.userData.textFreed) return;
    o.userData.textFreed = true;
    if (--m.userData.users > 0) return;
    if (m.userData.textMats.get(m.userData.textKey) === m) m.userData.textMats.delete(m.userData.textKey);
    m.map.dispose();
    // Das Programm der Texttafeln (lambert + Bild + Kurve) nutzt sonst keiner: Ginge das letzte Material, warfe
    // three.js es weg und übersetzte es im nächsten Ort mitten in der Fahrt neu. Eins je Seite bleibt deshalb,
    // mit einem leeren Bild statt der Leinwand (dasselbe Programm, kein Speicher).
    const keep = m.userData.textKeep;
    if (keep && !keep.has(m.side)) {
      m.map = KEEP_MAP;
      keep.set(m.side, m);
      return;
    }
    m.dispose();
  });
}
const KEEP_MAP = new THREE.Texture();

/**
 * Baukasten aus einer Tabelle von Bausteinen. defs[name] = { kind, tints, weight, far, fade, make(b, lod) → info,
 * build(kit, opts) → Group (nur für Einzelstücke mit Text oder beweglichen Teilen) }.
 */
export function makeKit(F, defs) {
  const core = cityCore(F);
  const cache = new Map();
  const kit = {
    core,
    matte: core.matte,
    glossy: core.glossy,
    water: core.water,
    glow: core.glow,
    /**
     * Instanz-Geometrien { tint, fixed, gloss, water, light, info } (jede darf null sein); far = true liefert die sparsame
     * Fernfassung, wenn es eine gibt. tint und fixed zeichnet kit.matte, gloss kit.glossy, water kit.water, light kit.glow.
     */
    geo(name, far = false) {
      const def = defs[name];
      if (!def) throw new Error('Baustein fehlt: ' + name);
      if (!def.make) return null;
      const lod = far && def.far ? 1 : 0;
      const key = name + '|' + lod;
      let g = cache.get(key);
      if (!g) {
        const b = new Bau({ lod, fade: def.fade ?? 2.4, low: def.low ?? 0.8 });
        const info = def.make(b, lod) || {};
        g = b.done({ name, kind: def.kind, tints: def.tints ?? [0xffffff], weight: def.weight ?? 1, far: !!def.far, ...info });
        cache.set(key, g);
      }
      return g;
    },
    info(name) {
      const def = defs[name];
      if (!def) throw new Error('Baustein fehlt: ' + name);
      if (!def.make) return { name, kind: def.kind, ...def.info };
      // bekannte Maße (Wahrzeichen, landmark-dims.js): dieselben Angaben wie nach dem Bau, ohne zu bauen
      if (def.dims) return { name, kind: def.kind, tints: def.tints ?? [0xffffff], weight: def.weight ?? 1, far: !!def.far, ...def.dims };
      return kit.geo(name).info;
    },
    /** Ist die Fassung schon gebaut (im Cache)? */
    built(name, far = false) {
      const def = defs[name];
      return cache.has(name + '|' + (far && def && def.far ? 1 : 0));
    },
    /** Namen aller Bausteine einer Art (ohne Angabe: alle). */
    list(kind) {
      return Object.keys(defs).filter((n) => !kind || defs[n].kind === kind);
    },
    /** Einzelstück als Group (ein Mesh je Material, Texttafeln extra); opts.tint färbt die tint-Flächen, opts.far wählt die Fernfassung. */
    build(name, opts = {}) {
      const def = defs[name];
      if (!def) throw new Error('Baustein fehlt: ' + name);
      let group;
      if (def.build) group = def.build(kit, opts);
      else {
        const g = kit.geo(name, !!opts.far);
        group = compose(core, [{ g, tint: opts.tint }]);
        group.userData.info = g.info;
        for (const m of kit.extras(name, opts)) group.add(m);
      }
      group.name = name;
      group.userData.info = { name, kind: def.kind, ...group.userData.info };
      return group;
    },
    /** Zusätzliche Meshes eines Bausteins (Tafeln mit freiem Text), in dessen eigenen Koordinaten. */
    extras(name, opts = {}) {
      const def = defs[name];
      return def && def.extras ? def.extras(kit, opts) : [];
    },
  };
  return kit;
}
