// Die Route des Tages im Abspann der Reise: die Karte des Spiels (derselbe Zeichner wie die große Karte, mapview.js:
// Land, Straßen, Orte und Namen), darauf der Weg, den der Wagen in diesem Stream wirklich gefahren ist (der gefahrene
// Weg des Navis), der Start in Erlensee, jede BrunnenTV-Folge mit ihrer Nummer, jeder Ladestopp mit dem Stecker wie im
// Navi und das Auto am Ende. Der Ausschnitt passt sich der Route an, in einer Maßstabsstufe der großen Karte (gleiche
// Punkte, gleiche Namen wie dort).
import { MapPainter, THEMES, bucketScale, project } from '../map/mapview.js';
import { drawCar, drawTurnIcon, FONT } from '../map/symbols.js';

const PAD = 30; // Rand um die Route (CSS-Bildpunkte): Platz für Marken und Auto
const MIN_B = 4; // gröbste Stufe (ganz Europa auf einer Handbreit)
const MAX_B = 19; // feinste Stufe: auch eine kurze Route zeigt noch die Gegend
const START = project(50.2276, 8.9576); // Erlensee, falls der Weg leer ist
// Farben der Marken: Brunnenblau wie „BrunnenTV XXL“ im Titel, Grün wie der Ladestopp im Navi
const TV_BLUE = '#1f8fd8';
const PARK_GREEN = '#2f8f4e';

let painter = null;

/** Rahmen der Route in Karteneinheiten: [x0, y0, x1, y1] über Weg und Marken (null, wenn nichts da ist). */
function bounds(route) {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  const add = (x, y) => {
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    x0 = Math.min(x0, x);
    y0 = Math.min(y0, y);
    x1 = Math.max(x1, x);
    y1 = Math.max(y1, y);
  };
  const L = route.line || [];
  for (let i = 0; i < L.length; i += 2) add(L[i], L[i + 1]);
  for (const m of route.marks || []) add(m.x, m.y);
  return x0 <= x1 ? [x0, y0, x1, y1] : null;
}

/** Erster und letzter Punkt des Wegs, dazu die Richtung am Ende (für das Auto). */
function ends(L) {
  let first = null;
  let last = null;
  let prev = null;
  for (let i = 0; i < L.length; i += 2) {
    if (!Number.isFinite(L[i])) continue;
    const p = [L[i], L[i + 1]];
    if (!first) first = p;
    if (last && (last[0] !== p[0] || last[1] !== p[1])) prev = last;
    last = p;
  }
  return { first, last, prev };
}

/**
 * Die Route auf die Leinwand zeichnen: w × h CSS-Bildpunkte, ps Bildpunkte der Leinwand je CSS-Bildpunkt. route =
 * { line: [x, y, …] Karteneinheiten (NaN: Sprung übers Wasser), marks: [{ type: 'brunnen' | 'laden', n, x, y }] }.
 * Ergebnis: Lage der Marken im Bild (CSS-Bildpunkte) für Prüfungen: [{ type, n, x, y, moved (zur Seite gerückt) }].
 */
export function drawRouteMap(canvas, route, w, h, ps) {
  painter = painter || new MapPainter({ theme: 'light', look: 'menu' });
  const T = THEMES.light;
  canvas.width = Math.max(1, Math.round(w * ps));
  canvas.height = Math.max(1, Math.round(h * ps));
  const ctx = canvas.getContext('2d');
  const L = route.line || [];
  const box = bounds(route) || [START.x, START.y, START.x, START.y];
  const bw = Math.max(box[2] - box[0], 1e-4);
  const bh = Math.max(box[3] - box[1], 1e-4);
  // die feinste Stufe der großen Karte, in der die Route samt Rand ins Bild passt
  const fit = Math.min((w - 2 * PAD) / bw, (h - 2 * PAD) / bh);
  const b = Math.min(MAX_B, Math.max(MIN_B, Math.floor(Math.log2(Math.max(fit, 1)) * 2)));
  const s = bucketScale(b);
  const cx = (box[0] + box[2]) / 2;
  const cy = (box[1] + box[3]) / 2;
  const wx = cx - w / 2 / s;
  const wy = cy - h / 2 / s;
  painter.renderStatic(ctx, wx, wy, s * ps, canvas.width, canvas.height, ps, b);
  const X = (x) => (x - wx) * s;
  const Y = (y) => (y - wy) * s;
  ctx.setTransform(ps, 0, 0, ps, 0, 0);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  // der gefahrene Weg in den Farben der Route des Navis
  if (L.length >= 4) {
    const p = new Path2D();
    let pen = false;
    for (let i = 0; i < L.length; i += 2) {
      if (!Number.isFinite(L[i])) {
        pen = false;
        continue;
      }
      if (pen) p.lineTo(X(L[i]), Y(L[i + 1]));
      else p.moveTo(X(L[i]), Y(L[i + 1]));
      pen = true;
    }
    for (const [col, lw] of [[T.routeGlow, 12], [T.routeCase, 7], [T.route, 4.5]]) {
      ctx.strokeStyle = col;
      ctx.lineWidth = lw;
      ctx.stroke(p);
    }
  }
  // Marken: erst der Start, dann die Ladestopps, darüber die Folgen. Was sich deckt (auch mit dem Auto am Ende), rückt
  // ein Stück zur Seite und zeigt mit einem dünnen Strich auf seine Stelle.
  const { first, last, prev } = ends(L);
  const car = last ? [X(last[0]), Y(last[1])] : null;
  const placed = car ? [car] : [];
  const items = [];
  const put = (type, mx, my, data = {}) => {
    const x = X(mx);
    const y = Y(my);
    let px = x;
    let py = y;
    for (let k = 0; k < 12 && placed.some((q) => Math.hypot(q[0] - px, q[1] - py) < 22); k++) {
      const a = -Math.PI / 4 + k * 1.1;
      px = x + Math.cos(a) * 21 * (1 + k * 0.15);
      py = y + Math.sin(a) * 21 * (1 + k * 0.15);
    }
    placed.push([px, py]);
    items.push({ type, ...data, x0: x, y0: y, x: px, y: py });
  };
  const st = first || [START.x, START.y];
  put('start', st[0], st[1]);
  const marks = (route.marks || []).filter((m) => Number.isFinite(m.x) && Number.isFinite(m.y));
  for (const m of marks) if (m.type === 'laden') put('laden', m.x, m.y);
  for (const m of marks) if (m.type === 'brunnen') put('brunnen', m.x, m.y, { n: m.n });
  // Striche von verschobenen Marken zu ihrer Stelle, mit einem Punkt dort (unter allen Marken)
  for (const it of items) {
    if (it.x === it.x0 && it.y === it.y0) continue;
    ctx.beginPath();
    ctx.moveTo(it.x0, it.y0);
    ctx.lineTo(it.x, it.y);
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#1d1f22';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(it.x0, it.y0, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = '#1d1f22';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
  }
  const disc = (x, y, r, fill) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
  };
  const out = [];
  for (const it of items) {
    const { x, y } = it;
    if (it.type === 'start') {
      // Start: Erlensee, ein weißer Punkt mit dunklem Rand und dem roten LIVE-Punkt
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#1d1f22';
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#e8212e';
      ctx.fill();
    } else if (it.type === 'laden') {
      // Ladestopp: grüne Marke mit dem Stecker wie im Navi
      disc(x, y, 11, PARK_GREEN);
      drawTurnIcon(ctx, 'stop', x, y, 15, '#ffffff');
    } else {
      // BrunnenTV-Folge: blaue Marke mit der Nummer der Folge
      const label = String(it.n);
      disc(x, y, label.length > 2 ? 13 : 11, TV_BLUE);
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 ${label.length > 3 ? 9 : label.length > 2 ? 10 : 12}px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x, y + 0.5);
    }
    out.push({ type: it.type, ...(it.n !== undefined ? { n: it.n } : {}), x: Math.round(x), y: Math.round(y), moved: it.x !== it.x0 || it.y !== it.y0 });
  }
  // das Auto am Ende des Wegs, in Fahrtrichtung (über allem; die Marken sind ihm ausgewichen)
  if (car) {
    const a = prev ? Math.atan2(last[0] - prev[0], -(last[1] - prev[1])) : 0;
    drawCar(ctx, car[0], car[1], a, 20, null);
    out.push({ type: 'auto', x: Math.round(car[0]), y: Math.round(car[1]) });
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  return out;
}

/**
 * Den gefahrenen Weg für den Abspann ausdünnen: höchstens max Punkte, Sprünge (NaN) bleiben, Anfang und Ende bleiben.
 * L: [x, y, …] (der gefahrene Weg des Navis, ein Punkt je gut 40 m).
 */
export function thinLine(L, max = 3000) {
  const n = L.length / 2;
  if (n <= max) return L.slice();
  const step = Math.ceil(n / max);
  const out = [];
  for (let i = 0; i < n; i++) {
    const x = L[2 * i];
    const jump = !Number.isFinite(x);
    const edge = i === n - 1 || (i + 1 < n && !Number.isFinite(L[2 * i + 2])) || (i > 0 && !Number.isFinite(L[2 * i - 2]));
    if (jump || edge || i % step === 0) out.push(x, L[2 * i + 1]);
  }
  return out;
}
