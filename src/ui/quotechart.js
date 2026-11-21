// Die Einschaltquote im Abspann der Reise: die Zuschauerzahl über die ganze Sendezeit (Game.quote, alle dt Sekunden
// ein Wert) – gezeichnet wie die Route des Tages daneben (routemap.js): heller Kartengrund, die Kurve im Blau und mit
// dem Rand der Route, darunter wie Wasser ihre Fläche, jede BrunnenTV-Folge als blaue Marke mit ihrer Nummer, die
// Spitze beschriftet. Während der Fahrt zeigt das HUD nur die Zahl (👁), nie eine Kurve.
import { THEMES } from '../map/mapview.js';
import { FONT } from '../map/symbols.js';
import { fmtNum } from '../util.js';

const T = THEMES.light;
const TV_BLUE = '#1f8fd8'; // wie die Folgen auf der Route des Tages
const PAD = { l: 46, r: 16, t: 28, b: 26 };

/**
 * Sendezeit als Achsenbeschriftung: „0:00“, „12 min“, „1:05 h“ – eine kurze Sendung (exact, unter zehn Minuten, etwa
 * nach früher Werkstatt) sekundengenau, „0:00“ bis „1:23“, sonst stünde an beiden Enden „0:00“.
 */
function clock(s, exact = false) {
  if (exact) {
    const t = Math.round(s);
    return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
  }
  const m = Math.round(s / 60);
  if (m < 60) return m ? m + ' min' : '0:00';
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')} h`;
}

/** Schöne Schrittweite für die Hilfslinien (1, 2, 5 × 10ⁿ), etwa n Linien über max. */
function niceStep(max, n = 4) {
  const raw = max / n;
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const f = raw / p;
  return (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10) * p;
}

/**
 * Zeichnet die Kurve in canvas (CSS-Größe w × h, Pixeldichte dpr). q: { dt, v: Zuschauer je dt Sekunden, tv: [{ t, n }]
 * Folgen mit Spielzeit und Nummer, t: Sendezeit am Ende }. Gibt die Spitze zurück ({ i, v }).
 */
export function drawQuote(canvas, q, w, h, dpr = 1) {
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = T.land;
  ctx.fillRect(0, 0, w, h);
  const v = q.v.length > 1 ? q.v : [q.v[0] || 0, q.v[0] || 0];
  const span = Math.max(q.t || 0, (v.length - 1) * q.dt, 1);
  let peak = 0;
  for (let i = 1; i < v.length; i++) if (v[i] > v[peak]) peak = i;
  const step = niceStep(Math.max(v[peak], 10));
  const top = Math.ceil((v[peak] * 1.08) / step) * step;
  const x0 = PAD.l;
  const x1 = w - PAD.r;
  const y0 = h - PAD.b;
  const y1 = PAD.t;
  const X = (t) => x0 + ((x1 - x0) * t) / span;
  const Y = (n) => y0 - ((y0 - y1) * n) / top;

  // Hilfslinien wie Straßen: weiß mit hellem Rand, links die Zahl
  ctx.font = `600 11px ${FONT}`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'right';
  for (let n = 0; n <= top + 1e-9; n += step) {
    const y = Math.round(Y(n)) + 0.5;
    ctx.strokeStyle = T.roadCase;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x1, y);
    ctx.stroke();
    ctx.strokeStyle = T.road;
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.fillStyle = T.sub;
    ctx.fillText(fmtNum(n), x0 - 8, y);
  }
  // Zeitachse: Anfang, Mitte, Ende
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = T.sub;
  ctx.textAlign = 'left';
  ctx.fillText(clock(0), x0, h - 8);
  ctx.textAlign = 'center';
  if (span >= 600) ctx.fillText(clock(span / 2), (x0 + x1) / 2, h - 8);
  ctx.textAlign = 'right';
  ctx.fillText(clock(span, span < 600), x1, h - 8);

  // die Kurve: Fläche wie Wasser, Linie wie die Route (Schein, Rand, Blau)
  const path = new Path2D();
  v.forEach((n, i) => (i ? path.lineTo(X(Math.min(i * q.dt, span)), Y(n)) : path.moveTo(X(0), Y(n))));
  const area = new Path2D(path);
  area.lineTo(X(Math.min((v.length - 1) * q.dt, span)), y0);
  area.lineTo(X(0), y0);
  area.closePath();
  const grad = ctx.createLinearGradient(0, y1, 0, y0);
  grad.addColorStop(0, 'rgba(169, 211, 236, 0.95)');
  grad.addColorStop(1, 'rgba(201, 229, 244, 0.55)');
  ctx.fillStyle = grad;
  ctx.fill(area);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  for (const [col, lw] of [[T.routeGlow, 10], [T.routeCase, 5.5], [T.route, 3.2]]) {
    ctx.strokeStyle = col;
    ctx.lineWidth = lw;
    ctx.stroke(path);
  }

  // die Folgen: blaue Marken mit Nummer auf der Kurve (wie auf der Route des Tages)
  const at = (t) => v[Math.max(0, Math.min(v.length - 1, Math.round(t / q.dt)))];
  for (const e of q.tv || []) {
    const x = X(Math.min(e.t, span));
    const y = Y(at(e.t));
    const label = String(e.n);
    const r = label.length > 2 ? 10 : 8.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = TV_BLUE;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = `800 ${label.length > 3 ? 8 : label.length > 2 ? 9 : 10}px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y + 0.5);
  }

  // die Spitze: Punkt und Zahl, mit Schein wie die Ortsnamen der Karte
  const px = X(Math.min(peak * q.dt, span));
  const py = Y(v[peak]);
  ctx.beginPath();
  ctx.arc(px, py, 4.5, 0, Math.PI * 2);
  ctx.fillStyle = T.route;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();
  const text = `Spitze ${fmtNum(v[peak])}`;
  ctx.font = `800 12px ${FONT}`;
  ctx.textBaseline = 'bottom';
  const tw = ctx.measureText(text).width;
  const tx = Math.max(x0 + tw / 2, Math.min(x1 - tw / 2, px));
  ctx.textAlign = 'center';
  ctx.lineWidth = 4;
  ctx.strokeStyle = T.halo;
  ctx.strokeText(text, tx, py - 8);
  ctx.fillStyle = T.text;
  ctx.fillText(text, tx, py - 8);
  return { i: peak, v: v[peak] };
}
