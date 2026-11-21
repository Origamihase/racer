// Tafeln der XXL-Welt (siehe signplan.js für das Was und Wo): Vorwegweiser 1000 und 500 m vor jeder Gabelung, die
// „Ausfahrt“-Tafel an der Inselspitze, Entfernungstafeln nach jeder Anschlussstelle, der Wegweiser zur Autobahn am
// Beginn der Auffahrt, gelbe Ortstafeln. Alle Texte kommen aus dem Plan (trip.signs, Navi-Kilometer, places), nichts
// ist Zufall. Gebaut wird im Sichtbereich [s − XXL_BEHIND, s + AHEAD], jede Tafel einmal (stabiler Schlüssel), in der
// Spur ihres Rahmens. Baken und die Tafeln an Ende und Anfang einer Autobahn baut junction.js, den Brunnen am Ziel
// world.js; ins Schilder-Log (list) kommen sie trotzdem, ebenso die Entfernungstafeln auf den Schilderbrücken der
// Szenerie (gantryEntries).
import * as THREE from 'three';
import { W } from '../../curve.js';
import { roundRect } from '../../textures.js';
import { sectionSigns } from './signplan.js';
import { CHARGE } from './charge.js';
import { drawTurnIcon } from '../../map/symbols.js';

const FONT = '"DIN Alternate", "Arial Narrow", Arial, sans-serif';
const BLUE = '#1452a8';
const WHITE = '#ffffff';
const YELLOW = '#f6c51b';
const INK = '#151515';
const PX = 150; // Pixel je Meter Tafel

/** Text auf höchstens maxW Pixel Breite: erst schmaler (bis 72 %), dann kleiner. Nie abgeschnitten. */
function fitText(ctx, text, x, y, maxW, align = 'left') {
  let size = parseFloat(/(\d+(?:\.\d+)?)px/.exec(ctx.font)[1]);
  let w = ctx.measureText(text).width;
  while (w * 0.72 > maxW && size > 10) {
    size -= 2;
    ctx.font = ctx.font.replace(/\d+(\.\d+)?px/, size + 'px');
    w = ctx.measureText(text).width;
  }
  const sx = Math.min(1, maxW / Math.max(1, w));
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(sx, 1);
  ctx.textAlign = align;
  ctx.fillText(text, 0, 0);
  ctx.restore();
  return w * sx;
}

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}
function toTexture(c) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}
/** Tafelgrund: ganz gefüllt (sonst würden durchsichtige Ecken schwarz), weißer, runder Rand. */
function plate(ctx, w, h, bg, fg, line = 7) {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = fg;
  ctx.lineWidth = line;
  roundRect(ctx, 9, 9, w - 18, h - 18, 16);
  ctx.stroke();
}

/** Straßennummer als Schild: Autobahn weiß umrandet auf Blau, sonst gelb mit schwarzer Schrift. Liefert die Breite. */
function shield(ctx, label, kind, x, y, hgt) {
  ctx.font = `bold ${Math.round(hgt * 0.72)}px ${FONT}`;
  const tw = ctx.measureText(label).width;
  const w = Math.max(hgt * 1.5, tw + hgt * 0.55);
  const ab = kind === 'ab';
  roundRect(ctx, x, y - hgt / 2, w, hgt, hgt * 0.22);
  ctx.fillStyle = ab ? BLUE : YELLOW;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = ab ? WHITE : INK;
  ctx.stroke();
  ctx.fillStyle = ab ? WHITE : INK;
  ctx.textAlign = 'center';
  ctx.fillText(label, x + w / 2, y + hgt * 0.04);
  return w;
}

/** Sinnbild im weißen Feld: 'ausfahrt' (Fahrbahn mit Abzweig rechts), 'kreuz' (zwei Fahrbahnen), 'ende'. */
function pictogram(ctx, kind, x, y, s) {
  ctx.fillStyle = WHITE;
  roundRect(ctx, x, y, s, s, s * 0.16);
  ctx.fill();
  ctx.strokeStyle = BLUE;
  ctx.lineCap = 'round';
  ctx.lineWidth = s * 0.11;
  const cx = x + s / 2;
  const ln = (x0, y0, x1, y1) => {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  };
  if (kind === 'kreuz') {
    for (const d of [-0.12, 0.12]) {
      ln(cx + d * s, y + s * 0.16, cx + d * s, y + s * 0.84);
      ln(x + s * 0.16, y + s / 2 + d * s, x + s * 0.84, y + s / 2 + d * s);
    }
    return;
  }
  ln(cx - s * 0.16, y + s * 0.84, cx - s * 0.16, y + s * 0.16);
  ln(cx + s * 0.04, y + s * 0.84, cx + s * 0.04, y + s * 0.16);
  if (kind === 'ausfahrt') {
    ctx.beginPath();
    ctx.moveTo(cx + s * 0.04, y + s * 0.62);
    ctx.quadraticCurveTo(cx + s * 0.08, y + s * 0.34, cx + s * 0.32, y + s * 0.2);
    ctx.stroke();
  } else {
    ctx.strokeStyle = '#d8342c';
    ln(x + s * 0.2, y + s * 0.2, x + s * 0.8, y + s * 0.8);
  }
}

/** Stecker im weißen Feld (Zeile eines Ladeparks, Tafel „Ladepark …“); s: Kantenlänge, (x, y) linke obere Ecke. */
function plugBox(ctx, x, y, s) {
  ctx.fillStyle = WHITE;
  roundRect(ctx, x, y, s, s, s * 0.16);
  ctx.fill();
  drawTurnIcon(ctx, 'stop', x + s / 2, y + s * 0.47, s * 0.86, BLUE);
}

/**
 * Vorwegweiser (Inhalt aus signplan.boardOf): Kopf mit Sinnbild und der Nummer der Anschlussstelle im weißen Kästchen,
 * Zeilen mit Straßenschild, Entfernung unten rechts. k: Maßstab der Tafel (BOARD_K) – die Leinwand wächst mit, die
 * Aufteilung bleibt.
 */
function boardTexture(b, wM, hM, k = 1) {
  const w = Math.round(wM * PX);
  const h = Math.round(hM * PX);
  const c = makeCanvas(Math.round(w * k), Math.round(h * k));
  const ctx = c.getContext('2d');
  ctx.scale(k, k);
  plate(ctx, w, h, BLUE, WHITE);
  ctx.textBaseline = 'middle';
  const pad = 34;
  const headH = 0.6 * PX;
  const rowH = 0.46 * PX;
  const ps = headH * 0.78;
  const py = pad - 6 + (headH - ps) / 2;
  pictogram(ctx, b.pict, pad, py, ps);
  let hx = pad + ps + 22;
  if (b.no) {
    // Nummer der Anschlussstelle: weiß umrandet neben dem Sinnbild, wie auf den echten Tafeln
    ctx.font = `bold ${Math.round(ps * 0.7)}px ${FONT}`;
    const nw = Math.max(ps * 0.9, ctx.measureText(String(b.no)).width + 26);
    const nx = pad + ps + 12;
    ctx.strokeStyle = WHITE;
    ctx.lineWidth = 5;
    roundRect(ctx, nx, py + 2, nw, ps - 4, 9);
    ctx.stroke();
    ctx.fillStyle = WHITE;
    ctx.textAlign = 'center';
    ctx.fillText(String(b.no), nx + nw / 2, py + ps / 2 + 2);
    ctx.textAlign = 'left';
    hx = nx + nw + 20;
  }
  ctx.fillStyle = WHITE;
  ctx.font = `bold ${Math.round(headH * 0.62)}px ${FONT}`;
  fitText(ctx, b.head, hx, pad - 6 + headH / 2, w - pad - hx);
  let y = pad + headH + rowH / 2;
  for (const r of b.rows) {
    let x = pad + 4;
    if (r.road) x += shield(ctx, r.road, r.kind, x, y, rowH * 0.74) + 18;
    else if (r.kind === 'park') {
      plugBox(ctx, x, y - rowH * 0.37, rowH * 0.74);
      x += rowH * 0.74 + 18;
    }
    ctx.fillStyle = WHITE;
    ctx.font = `bold ${Math.round(rowH * 0.66)}px ${FONT}`;
    fitText(ctx, r.text, x, y + 2, w - pad - x);
    y += rowH;
  }
  ctx.font = `bold ${Math.round(rowH * 0.66)}px ${FONT}`;
  ctx.fillStyle = WHITE;
  fitText(ctx, b.dist, w - pad, h - pad - rowH * 0.36, w * 0.4, 'right');
  return toTexture(c);
}

/** Tafel „Ladepark …“ 2000 m vor seiner Ausfahrt: Stecker im weißen Feld, darunter der Name, Entfernung unten rechts. */
function parkTexture(name, dist, wM, hM) {
  const w = Math.round(wM * PX);
  const h = Math.round(hM * PX);
  const c = makeCanvas(w, h);
  const ctx = c.getContext('2d');
  plate(ctx, w, h, BLUE, WHITE);
  ctx.textBaseline = 'middle';
  const pad = 34;
  const ps = 0.62 * PX;
  plugBox(ctx, pad, pad, ps);
  ctx.fillStyle = WHITE;
  ctx.font = `bold ${Math.round(0.36 * PX)}px ${FONT}`;
  fitText(ctx, 'Ladepark', pad + ps + 24, pad + ps / 2 + 2, w - pad * 2 - ps - 24);
  const place = name.replace(/^Ladepark /, '');
  ctx.font = `bold ${Math.round(0.4 * PX)}px ${FONT}`;
  fitText(ctx, place, pad + 4, pad + ps + 0.38 * PX, w - pad * 2 - 8);
  ctx.font = `bold ${Math.round(0.3 * PX)}px ${FONT}`;
  fitText(ctx, dist, w - pad, h - pad - 0.17 * PX, w * 0.4, 'right');
  return toTexture(c);
}

/** Kleine Tafel „Ladesäule“ vor der Säule eines Orts (keine Marke): Stecker im weißen Feld, darunter Text und Meter. */
function postTexture(texts, wM, hM) {
  const w = Math.round(wM * PX);
  const h = Math.round(hM * PX);
  const c = makeCanvas(w, h);
  const ctx = c.getContext('2d');
  plate(ctx, w, h, BLUE, WHITE, 6);
  ctx.textBaseline = 'middle';
  const ps = 0.36 * PX;
  plugBox(ctx, (w - ps) / 2, 22, ps);
  ctx.fillStyle = WHITE;
  ctx.font = `bold ${Math.round(0.19 * PX)}px ${FONT}`;
  fitText(ctx, texts[0], w / 2, 22 + ps + 0.15 * PX, w - 40, 'center');
  ctx.font = `bold ${Math.round(0.17 * PX)}px ${FONT}`;
  fitText(ctx, texts[1], w / 2, h - 22 - 0.1 * PX, w - 40, 'center');
  return toTexture(c);
}

/**
 * Stele vor dem Park der Ladesäule eines Orts (charge.js CHARGE.stele): hoch und blau wie die Stelen echter Ladeparks,
 * oben der Stecker im weißen Feld so breit wie die Tafel, darunter „Ladesäule“ von unten nach oben zu lesen (so groß,
 * wie die Breite es zulässt), unten die Einfahrt mit dem Pfeil nach rechts. Von weitem ein blauer Strich mit weißem
 * Kopf am Straßenrand, näher dran lesbar.
 */
function steleTexture(texts, wM, hM) {
  const w = Math.round(wM * PX);
  const h = Math.round(hM * PX);
  const c = makeCanvas(w, h);
  const ctx = c.getContext('2d');
  plate(ctx, w, h, BLUE, WHITE, 6);
  ctx.textBaseline = 'middle';
  const pad = 20;
  const ps = w - 2 * pad - 6;
  plugBox(ctx, (w - ps) / 2, pad + 4, ps);
  // unten: Einfahrt und Pfeil (geradeaus, dann rechts hinein)
  const foot = 0.62 * PX;
  ctx.fillStyle = WHITE;
  ctx.strokeStyle = WHITE;
  ctx.font = `bold ${Math.round(0.15 * PX)}px ${FONT}`;
  fitText(ctx, texts[1], w / 2, h - pad - foot + 0.12 * PX, w - 2 * pad, 'center');
  const ay = h - pad - 0.2 * PX;
  ctx.lineWidth = 0.07 * PX;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(w * 0.3, ay + 0.14 * PX);
  ctx.lineTo(w * 0.3, ay);
  ctx.lineTo(w * 0.62, ay);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w * 0.8, ay);
  ctx.lineTo(w * 0.6, ay - 0.11 * PX);
  ctx.lineTo(w * 0.6, ay + 0.11 * PX);
  ctx.closePath();
  ctx.fill();
  // dazwischen der Name, um 90° gedreht
  const top = pad + 4 + ps + 0.12 * PX;
  const bottom = h - pad - foot - 0.08 * PX;
  ctx.save();
  ctx.translate(w / 2, (top + bottom) / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.font = `bold ${Math.round(0.5 * PX)}px ${FONT}`;
  fitText(ctx, texts[0], 0, 4, bottom - top, 'center');
  ctx.restore();
  return toTexture(c);
}

/** Entfernungstafel: Ort links, Kilometer rechtsbündig. */
function tableTexture(rows, wM, hM) {
  const w = Math.round(wM * PX);
  const h = Math.round(hM * PX);
  const c = makeCanvas(w, h);
  const ctx = c.getContext('2d');
  plate(ctx, w, h, BLUE, WHITE);
  ctx.textBaseline = 'middle';
  ctx.fillStyle = WHITE;
  const pad = 34;
  const rowH = (h - 2 * pad) / rows.length;
  rows.forEach((r, i) => {
    const y = pad + rowH * (i + 0.5) + 2;
    ctx.font = `bold ${Math.round(Math.min(rowH * 0.64, 0.4 * PX))}px ${FONT}`;
    const kw = fitText(ctx, r.km + ' km', w - pad, y, w * 0.3, 'right');
    ctx.font = `bold ${Math.round(Math.min(rowH * 0.64, 0.4 * PX))}px ${FONT}`;
    fitText(ctx, r.name, pad + 6, y, w - 2 * pad - kw - 30);
  });
  return toTexture(c);
}

/** „Ausfahrt“ mit Pfeil nach rechts oben (Zeichen 333, freundlich gerundet). */
function exitTexture(wM, hM) {
  const w = Math.round(wM * PX);
  const h = Math.round(hM * PX);
  const c = makeCanvas(w, h);
  const ctx = c.getContext('2d');
  plate(ctx, w, h, BLUE, WHITE, 6);
  ctx.textBaseline = 'middle';
  ctx.fillStyle = WHITE;
  ctx.font = `bold ${Math.round(h * 0.42)}px ${FONT}`;
  fitText(ctx, 'Ausfahrt', 28, h / 2 + 2, w - 28 - h * 0.95);
  // Pfeil
  const ax = w - h * 0.62;
  const ay = h * 0.6;
  ctx.strokeStyle = WHITE;
  ctx.lineWidth = h * 0.11;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(ax - h * 0.18, ay + h * 0.16);
  ctx.lineTo(ax + h * 0.2, ay - h * 0.22);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(ax - h * 0.02, ay - h * 0.26);
  ctx.lineTo(ax + h * 0.22, ay - h * 0.24);
  ctx.lineTo(ax + h * 0.24, ay);
  ctx.stroke();
  return toTexture(c);
}

/** Wegweiser zur Autobahn: Autobahnschild, Richtung, Pfeil geradeaus. */
function aufTexture(road, towards, wM, hM) {
  const w = Math.round(wM * PX);
  const h = Math.round(hM * PX);
  const c = makeCanvas(w, h);
  const ctx = c.getContext('2d');
  plate(ctx, w, h, BLUE, WHITE, 6);
  ctx.textBaseline = 'middle';
  const pad = 28;
  const sh = shield(ctx, road, 'ab', pad, h * 0.32, h * 0.3);
  pictogram(ctx, 'ausfahrt', pad + sh + 14, h * 0.32 - h * 0.15, h * 0.3);
  ctx.fillStyle = WHITE;
  ctx.font = `bold ${Math.round(h * 0.26)}px ${FONT}`;
  fitText(ctx, towards, pad, h * 0.72, w - 2 * pad - h * 0.3);
  // Pfeil geradeaus rechts unten
  const ax = w - pad - h * 0.1;
  ctx.strokeStyle = WHITE;
  ctx.lineWidth = h * 0.07;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(ax, h * 0.88);
  ctx.lineTo(ax, h * 0.56);
  ctx.moveTo(ax - h * 0.09, h * 0.65);
  ctx.lineTo(ax, h * 0.55);
  ctx.lineTo(ax + h * 0.09, h * 0.65);
  ctx.stroke();
  return toTexture(c);
}

/** Gelbe Ortstafel; end: Ortsende mit rotem Schrägbalken. Lange Namen in zwei Zeilen. */
function townTexture(name, end, wM, hM) {
  const w = Math.round(wM * PX);
  const h = Math.round(hM * PX);
  const c = makeCanvas(w, h);
  const ctx = c.getContext('2d');
  plate(ctx, w, h, YELLOW, INK, 7);
  ctx.textBaseline = 'middle';
  ctx.fillStyle = INK;
  const lines = splitName(name);
  const lh = (h - 60) / lines.length;
  const size = Math.round(Math.min(lh * 0.7, h * 0.36));
  lines.forEach((ln, i) => {
    ctx.font = `bold ${size}px ${FONT}`;
    fitText(ctx, ln, w / 2, 30 + lh * (i + 0.5) + 2, w - 56, 'center');
  });
  if (end) {
    ctx.strokeStyle = '#d23a2c';
    ctx.lineWidth = h * 0.09;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(w * 0.12, h * 0.84);
    ctx.lineTo(w * 0.88, h * 0.16);
    ctx.stroke();
  }
  return toTexture(c);
}
/**
 * Name für die Ortstafel: über 14 Zeichen an einem Leerzeichen oder Bindestrich nahe der Mitte umbrechen. Jedes Zeichen
 * bleibt stehen (die Tafel staucht lange Zeilen, sie kürzt nie): die Tafel zeigt denselben Namen wie das Navi.
 */
export function splitName(name) {
  if (name.length <= 14) return [name];
  let best = -1;
  for (let i = 1; i < name.length - 1; i++) {
    if (name[i] !== ' ' && name[i] !== '-') continue;
    if (best < 0 || Math.abs(i - name.length / 2) < Math.abs(best - name.length / 2)) best = i;
  }
  if (best < 0) return [name];
  return name[best] === '-' ? [name.slice(0, best + 1), name.slice(best + 1)] : [name.slice(0, best), name.slice(best + 1)];
}

// --- Bauteile -----------------------------------------------------------------------------------------------------
const boardGeos = new Map();
/**
 * Tafel samt Pfosten als eine Geometrie mit zwei Gruppen: 0 = Stahl (Rand, Rückseite, Pfosten), 1 = Bildseite (+z,
 * UV 0…1). So kostet eine Tafel zwei Zeichenaufrufe statt acht. Je Größe einmal gebaut und geteilt.
 */
function boardGeo(L) {
  const key = [L.w, L.h, L.y, ...L.posts].map((v) => v.toFixed(3)).join(':');
  let g = boardGeos.get(key);
  if (g) return g;
  const pos = [];
  const nrm = [];
  const uv = [];
  const steel = [];
  const face = [];
  const quad = (list, a, b, c, d, n, uvs) => {
    const i = pos.length / 3;
    for (const p of [a, b, c, d]) pos.push(p[0], p[1], p[2]);
    for (let k = 0; k < 4; k++) nrm.push(n[0], n[1], n[2]);
    for (const t of uvs || [[0, 0], [0, 0], [0, 0], [0, 0]]) uv.push(t[0], t[1]);
    list.push(i, i + 1, i + 2, i, i + 2, i + 3);
  };
  // Kasten: Mitte (cx, cy, cz), halbe Maße; front: Bildseite statt Stahl
  const box = (cx, cy, cz, hx, hy, hz, front, bottom = true) => {
    const x0 = cx - hx, x1 = cx + hx, y0 = cy - hy, y1 = cy + hy, z0 = cz - hz, z1 = cz + hz;
    quad(front ? face : steel, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1], front ? [[0, 0], [1, 0], [1, 1], [0, 1]] : null);
    quad(steel, [x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [0, 0, -1]);
    quad(steel, [x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [1, 0, 0]);
    quad(steel, [x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [-1, 0, 0]);
    quad(steel, [x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0], [0, 1, 0]);
    if (bottom) quad(steel, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0]);
  };
  box(0, L.y + L.h / 2, 0.06, L.w / 2, L.h / 2, 0.03, true);
  const top = L.y + L.h - 0.12;
  for (const px of L.posts) box(px, top / 2, -0.02, 0.05, top / 2, 0.05, false, false);
  g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex([...steel, ...face]);
  g.addGroup(0, steel.length, 0);
  g.addGroup(steel.length, face.length, 1);
  g.computeBoundingSphere();
  boardGeos.set(key, g);
  return g;
}

/**
 * Vorwegweiser 1000 und 500 m vor der Ausfahrt so viel größer als ihre Aufteilung (Besitzer, 21.11.: „Ausfahrten besser
 * ausschildern.“): Aus dem Cockpit sind Nummer und Name bei Tempo lesbar, solange die Tafel rechts im Bild ist. Die
 * Tafel wächst nach rechts (dx), ihre linke Kante bleibt hinter der Planke.
 */
const BOARD_K = 1.6;

/** Größe (Meter), Unterkante und Pfosten einer Tafel je Art; tw, th, k: Maße der Aufteilung und Maßstab, dx: Versatz. */
function layout(e) {
  switch (e.kind) {
    case 'vorweg': {
      const tw = 3.9;
      const th = 0.6 + 0.46 * Math.max(1, e.board.rows.length) + 0.68;
      const k = BOARD_K;
      return { w: tw * k, h: th * k, y: 2.0, posts: [-1.25 * k, 1.25 * k], tw, th, k, dx: ((k - 1) * tw) / 2 };
    }
    case 'tafel':
      return { w: 3.6, h: 0.5 + 0.5 * e.rows.length, y: 1.7, posts: [-1.15, 1.15] };
    case 'ladepark':
      return { w: 3.0, h: 2.0, y: 1.7, posts: [-0.95, 0.95] };
    case 'ausfahrt':
      return { w: 2.4, h: 0.85, y: 1.3, posts: [-0.8, 0.8] };
    case 'auffahrt':
      return { w: 2.0, h: 1.0, y: 1.4, posts: [-0.65, 0.65] };
    case 'ladesaeule':
      return { w: 1.1, h: 1.15, y: 1.0, posts: [0] };
    case 'ladestele':
      return { w: CHARGE.stele.w, h: CHARGE.stele.h, y: CHARGE.stele.y, posts: [0] };
    default: {
      const two = splitName(e.texts[0]).length > 1;
      return { w: 1.55, h: two ? 1.15 : 0.92, y: 1.3, posts: [-0.5, 0.5] };
    }
  }
}

function textureOf(e, L) {
  switch (e.kind) {
    case 'vorweg':
      return boardTexture(e.board, L.tw, L.th, L.k);
    case 'tafel':
      return tableTexture(e.rows, L.w, L.h);
    case 'ladepark':
      return parkTexture(e.name, e.texts[1], L.w, L.h);
    case 'ausfahrt':
      return exitTexture(L.w, L.h);
    case 'auffahrt':
      return aufTexture(e.road, e.towards, L.w, L.h);
    case 'ladesaeule':
      return postTexture(e.texts, L.w, L.h);
    case 'ladestele':
      return steleTexture(e.texts, L.w, L.h);
    default:
      return townTexture(e.texts[0], e.kind === 'ortsende', L.w, L.h);
  }
}

/** Arten, die diese Klasse selbst baut (die übrigen stehen nur im Log). */
const BUILDS = new Set(['vorweg', 'tafel', 'ladepark', 'ausfahrt', 'auffahrt', 'ort', 'ortsende', 'ladesaeule', 'ladestele']);

export class Signs {
  constructor(world) {
    this.world = world;
    this.items = new Map(); // Schlüssel → {entry, frame, group, mat}
    this.entries = []; // alle Einträge des letzten Abgleichs im Sichtbereich (Log)
    this.want = new Set();
  }

  reset() {
    for (const it of this.items.values()) this.drop(it);
    this.items.clear();
    this.entries = [];
  }

  drop(it) {
    if (it.group.parent) it.group.parent.remove(it.group);
    if (it.mat) {
      if (it.mat.map) it.mat.map.dispose();
      it.mat.dispose();
    }
  }

  /** Rahmen, deren Ansicht für Tafeln gebraucht wird. */
  frames() {
    const out = [];
    for (const it of this.items.values()) out.push(it.frame);
    return out;
  }

  /**
   * Plan für [lo, hi] abgleichen: groups = [[Abschnitte des Wegs, die gezeichneten davon]] (die Autobahn der Ansicht
   * und die Wege abseits). Baut fehlende Tafeln bis buildHi (der Plan reicht weiter, damit die Szenerie schon vorher
   * Platz lässt), verwirft alte.
   */
  sync(trip, groups, lo, hi, buildHi = hi) {
    const list = [];
    const opts = { target: trip.target };
    for (const [secs, sel] of groups) {
      for (const sec of sel) {
        const mine = [];
        sectionSigns(trip, secs, sec, mine, opts);
        for (const e of mine) if (e.s >= lo && e.s <= hi) list.push(e);
      }
    }
    list.sort((a, b) => a.s - b.s);
    this.entries = list;
    const want = this.want;
    want.clear();
    for (const e of list) {
      if (!BUILDS.has(e.kind) || e.s > buildHi) continue;
      want.add(e.key);
      const it = this.items.get(e.key);
      if (!it) this.items.set(e.key, this.build(e));
      else it.frame = e.frame; // dieselbe Tafel in einem neu angelegten Zweig
    }
    for (const [key, it] of this.items) {
      if (want.has(key)) continue;
      this.drop(it);
      this.items.delete(key);
    }
  }

  /** Gruppen in die Spur ihrer Rahmenansicht hängen (nach dem Abgleich der Ansichten). */
  attach() {
    for (const it of this.items.values()) {
      const fv = this.world.frames.get(it.frame);
      if (fv && it.group.parent !== fv.track) fv.track.add(it.group);
    }
  }

  /** Eine Tafel auf zwei Pfosten, Vorderseite zum heranfahrenden Wagen (+z), Ursprung am Boden unter der Mitte. */
  build(e) {
    const L = layout(e);
    const g = new THREE.Group();
    g.name = 'XXL-Tafel ' + e.kind;
    g.position.set(e.x + (L.dx || 0), 0, -e.s);
    const steel = this.world.scenery.mats.steel;
    const mat = W.std({ map: textureOf(e, L), roughness: 0.55, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -4 });
    const board = new THREE.Mesh(boardGeo(L), [steel, mat]);
    board.castShadow = true;
    board.receiveShadow = true;
    g.add(board);
    return { entry: e, frame: e.frame, group: g, mat };
  }

  /** Schilder-Log: alles, was gerade im Sichtbereich steht (Einträge wie signplan, dazu built: von hier gebaut). */
  list() {
    return this.entries.map((e) => ({ kind: e.kind, s: e.s, x: e.x, side: e.side, frame: e.frame, texts: e.texts.slice(), no: e.no, built: this.items.has(e.key) }));
  }
}
