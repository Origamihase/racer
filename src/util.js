// Kleine Helfer, die überall gebraucht werden.

export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const smoothstep = (a, b, v) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
export const rand = (a = 0, b = 1) => a + Math.random() * (b - a);
export const randInt = (a, b) => Math.floor(rand(a, b + 1));
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const chance = (p) => Math.random() < p;
export const damp = (cur, target, lambda, dt) => lerp(cur, target, 1 - Math.exp(-lambda * dt));
export const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export function weightedPick(items, weightFn) {
  let total = 0;
  for (const it of items) total += weightFn(it);
  let r = Math.random() * total;
  for (const it of items) {
    r -= weightFn(it);
    if (r <= 0) return it;
  }
  return items[items.length - 1];
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const nfCache = new Map();
function nf(min, max) {
  const key = min + ':' + max;
  if (!nfCache.has(key)) {
    nfCache.set(key, new Intl.NumberFormat('de-DE', { minimumFractionDigits: min, maximumFractionDigits: max }));
  }
  return nfCache.get(key);
}

export const fmtNum = (v, digits = 0) => nf(digits, digits).format(v);
// geschütztes Leerzeichen: Betrag und € werden nie auf zwei Zeilen getrennt
export const fmtEuro = (v, digits = 0) => nf(digits, digits).format(v) + '\u00a0€';
export const fmtCent = (v) => nf(2, 2).format(v) + '\u00a0€';
/**
 * Ein Kontostand (Guthaben, Stream-Kasse): im Minus mit echtem Minuszeichen („−500,00 €“, nicht „-500,00 €“), nie
 * „−0,00 €“ für einen Rest unter einem halben Cent; kontoMinus: ob er so im Minus steht (dann in der Farbe der Abzüge).
 */
export const kontoMinus = (v) => v <= -0.005;
export const fmtKonto = (v) => (kontoMinus(v) ? '−' : '') + fmtCent(Math.abs(v) < 0.005 ? 0 : Math.abs(v));
/** Geladene Energie: „71,3 kWh“ (eine Nachkommastelle, geschütztes Leerzeichen). */
export const fmtKwh = (v) => nf(1, 1).format(v) + '\u00a0kWh';

// Tacho: ganze km/h – die eine Rundung für den Mittelbildschirm und das HUD (das zeigt die Zahl des Bildschirms)
export const tachoKmh = (kmh) => Math.round(kmh);

export function fmtClock(minutesOfDay) {
  const m = Math.floor(minutesOfDay) % (24 * 60);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return String(h).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
}

/** Eine Spanne der Uhr (Sekunden) wie „47 min“ oder „2 h 05 min“ (Sendezeit der XXL-Welt). */
export function fmtSpan(seconds) {
  const m = Math.max(0, Math.floor(seconds / 60));
  return m < 60 ? m + ' min' : Math.floor(m / 60) + ' h ' + String(m % 60).padStart(2, '0') + ' min';
}

// Deterministischer Pseudo-Zufall (für reproduzierbare Szenerie-Muster)
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Glatte 1D-Rauschfunktion (für Kurven, Wald-Dichte usw.)
export function noise1(x, seed = 0) {
  const i = Math.floor(x);
  const f = x - i;
  const h = (n) => {
    const s = Math.sin((n + seed * 101.3) * 127.1) * 43758.5453;
    return s - Math.floor(s);
  };
  const u = f * f * (3 - 2 * f);
  return lerp(h(i), h(i + 1), u) * 2 - 1;
}

export function fbm1(x, seed = 0) {
  return noise1(x, seed) * 0.6 + noise1(x * 2.13, seed + 7) * 0.3 + noise1(x * 4.7, seed + 13) * 0.1;
}
