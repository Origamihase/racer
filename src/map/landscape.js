// Die Landschaft der Karte (Daten: landscape-data.js, gebaut von tools/map/landschaft.mjs): Landbedeckung aus ESA
// WorldCover (Wald, Siedlung, Acker, Fels und Eis) und Höhen aus den Terrain Tiles, je auf einem feinen Raster über
// Mitteleuropa und einem groben über ganz Europa, in Kartenkoordinaten (project() aus graph.js).
//
// Eine Wahrheit für alles, was Landschaft zeigt: die große Karte und das Navi (Relief, Wald, Siedlungsflächen in
// mapview.js), die Welt (Wald, Felder und Dörfer neben der Straße, landcover.js; der Horizont mit den Bergen der
// Gegend, sky.js) – COMMON.md §9: das Navi zeigt nur, was die Welt hat, und umgekehrt.
//
// Die Daten sind gepackt (deflate) und werden einmal beim Start ausgepackt: loadLandscape() (asynchron, Browser und
// Node haben DecompressionStream). Bis dahin liefern die Abfragen „nichts“ (kein Wald, Höhe 0), nie einen Fehler.
import { GRIDS, PACKED, RAW_BYTES, HMAX } from './landscape-data.js';

let ready = false;
let loading = null;
const G = {}; // Name → {x0, y0, cell, w, h, a (Uint8Array)}
let version = 0;

function b64bytes(s) {
  if (typeof atob === 'function') {
    const bin = atob(s);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  return new Uint8Array(Buffer.from(s, 'base64'));
}

/** Packt die Daten aus (einmal; weitere Aufrufe liefern dasselbe Versprechen). */
export function loadLandscape() {
  if (loading) return loading;
  loading = (async () => {
    const ds = new DecompressionStream('deflate-raw');
    const stream = new Blob([b64bytes(PACKED)]).stream().pipeThrough(ds);
    const all = new Uint8Array(await new Response(stream).arrayBuffer());
    if (all.length !== RAW_BYTES) throw new Error('Landschaft: falsche Länge ' + all.length);
    for (const m of GRIDS) {
      const a = all.slice(m.off, m.off + m.w * m.h);
      if (m.delta) {
        for (let y = 0; y < m.h; y++) {
          let prev = 0;
          for (let x = 0; x < m.w; x++) {
            const i = y * m.w + x;
            prev = (prev + a[i]) & 255;
            a[i] = prev;
          }
        }
      }
      G[m.name] = { x0: m.x0, y0: m.y0, cell: m.cell, w: m.w, h: m.h, a };
    }
    ready = true;
    version++;
    for (const f of listeners) f();
  })();
  return loading;
}
const listeners = [];
/** f() wird gerufen, sobald die Daten da sind (sofort, wenn sie es schon sind). */
export function onLandscape(f) {
  if (ready) f();
  else listeners.push(f);
}
export const landscapeReady = () => ready;
export const landscapeVersion = () => version;
export { HMAX };

/** Raster für (x, y): das feine, wo es reicht (mit einer Zelle Rand für die Interpolation), sonst das grobe. */
function gridAt(kind, x, y) {
  const A = G[kind + 'A'];
  if (A) {
    const fx = (x - A.x0) / A.cell;
    const fy = (y - A.y0) / A.cell;
    if (fx >= 1 && fy >= 1 && fx < A.w - 1 && fy < A.h - 1) return A;
  }
  const B = G[kind + 'B'];
  if (B) {
    const fx = (x - B.x0) / B.cell;
    const fy = (y - B.y0) / B.cell;
    if (fx >= 0 && fy >= 0 && fx < B.w && fy < B.h) return B;
  }
  return null;
}

/** Rohbyte einer Zelle (am Rand festgehalten). */
function cellByte(g, ix, iy) {
  ix = ix < 0 ? 0 : ix >= g.w ? g.w - 1 : ix;
  iy = iy < 0 ? 0 : iy >= g.h ? g.h - 1 : iy;
  return g.a[iy * g.w + ix];
}

const hOf = (v) => (v / 255) * (v / 255) * HMAX;

/** Geländehöhe in Metern (bilinear; Meer und außerhalb der Raster 0). */
export function heightAt(x, y) {
  const g = ready ? gridAt('dem', x, y) : null;
  if (!g) return 0;
  const fx = (x - g.x0) / g.cell - 0.5;
  const fy = (y - g.y0) / g.cell - 0.5;
  const ix = Math.floor(fx);
  const iy = Math.floor(fy);
  const u = fx - ix;
  const v = fy - iy;
  const a = hOf(cellByte(g, ix, iy));
  const b = hOf(cellByte(g, ix + 1, iy));
  const c = hOf(cellByte(g, ix, iy + 1));
  const d = hOf(cellByte(g, ix + 1, iy + 1));
  return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
}

/** Zellgröße des Höhenrasters bei (x, y) in Karteneinheiten (0 ohne Daten). */
export function heightCell(x, y) {
  const g = ready ? gridAt('dem', x, y) : null;
  return g ? g.cell : 0;
}

// ein Byte je Zelle (tools/map/landschaft.mjs): Bits 0–1 Wald 0..3, 2–3 Siedlung 0..3, 4 überwiegend Acker, 5 Fels/Eis
const F = (b) => (b & 3) / 3;
const U = (b) => ((b >> 2) & 3) / 3;
const C = (b) => (b >> 4) & 1;
const R = (b) => (b >> 5) & 1;

/**
 * Landbedeckung bei (x, y), bilinear zwischen den Zellmitten: out.forest, out.urban, out.crop, out.rock (je 0..1,
 * Anteil der Fläche). Ohne Daten alles 0.
 */
export function coverAt(x, y, out = { forest: 0, urban: 0, crop: 0, rock: 0 }) {
  const g = ready ? gridAt('cover', x, y) : null;
  if (!g) {
    out.forest = out.urban = out.crop = out.rock = 0;
    return out;
  }
  const fx = (x - g.x0) / g.cell - 0.5;
  const fy = (y - g.y0) / g.cell - 0.5;
  const ix = Math.floor(fx);
  const iy = Math.floor(fy);
  const u = fx - ix;
  const v = fy - iy;
  const a = cellByte(g, ix, iy);
  const b = cellByte(g, ix + 1, iy);
  const c = cellByte(g, ix, iy + 1);
  const d = cellByte(g, ix + 1, iy + 1);
  const mix = (f) => (f(a) * (1 - u) + f(b) * u) * (1 - v) + (f(c) * (1 - u) + f(d) * u) * v;
  out.forest = mix(F);
  out.urban = mix(U);
  out.crop = mix(C);
  out.rock = mix(R);
  return out;
}

/** Zellgröße des Bedeckungsrasters bei (x, y) in Karteneinheiten (0 ohne Daten). */
export function coverCell(x, y) {
  const g = ready ? gridAt('cover', x, y) : null;
  return g ? g.cell : 0;
}
