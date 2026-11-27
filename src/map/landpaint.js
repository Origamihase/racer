// Landschaft auf der 2D-Karte (große Karte und Navi): Relief als Schummerung, Wald, Siedlungsflächen sowie Fels und Eis
// im Hochgebirge, gemalt aus landscape.js (ESA WorldCover und Terrain Tiles) in jedes Rechteck, das mapview.js
// renderStatic zeichnet. Dieselben Daten stellen in der Welt den Wald und die Dörfer neben die Straße
// (world/xxl/landcover.js): COMMON.md §9.
//
// Gerechnet wird auf einem gröberen Gitter (STEP Bildpunkte der Leinwand je Probe, mit einer Probe Rand rundherum)
// und weich hochgezogen: so bleibt ein Rechteck von 512 × 512 Bildpunkten bei wenigen Millisekunden, und benachbarte
// Kacheln stoßen ohne Naht aneinander (alles hängt nur an Kartenkoordinaten).
import { coverAt, heightAt, heightCell, landscapeReady } from './landscape.js';

const RAD = Math.PI / 180;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const smooth = (a, b, v) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

/** Probenabstand (Bildpunkte der Leinwand) siehe paintLandscape. Farben je Thema: Wald, Siedlung, Fels und Eis (RGB 0..255) und Stärke der Schummerung. */
export const LAND_COLORS = {
  light: { forest: [184, 212, 166], forestDeep: [164, 200, 150], urban: [229, 207, 198], rock: [222, 220, 214], snow: [248, 249, 251], relief: 1, high: [244, 240, 232] },
  dark: { forest: [34, 52, 40], forestDeep: [28, 46, 34], urban: [58, 53, 51], rock: [64, 66, 70], snow: [92, 96, 104], relief: 0.8, high: [52, 52, 54] },
};

// Wertrauschen auf Kartenkoordinaten: Waldränder franzen aus, statt als weiche Kleckse der Rasterzellen zu enden
function hash2(ix, iy) {
  let h = (ix * 374761393 + iy * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function vnoise(x, y) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const u = x - ix;
  const v = y - iy;
  const su = u * u * (3 - 2 * u);
  const sv = v * v * (3 - 2 * v);
  const a = hash2(ix, iy);
  const b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1);
  const d = hash2(ix + 1, iy + 1);
  return (a * (1 - su) + b * su) * (1 - sv) + (c * (1 - su) + d * su) * sv;
}
/** Drei Oktaven (−0,5 … 0,5), Wellenlängen um 1,2 km, 0,4 km und 0,13 km. */
function edgeNoise(x, y) {
  return vnoise(x * 95, y * 95) * 0.5 + vnoise(x * 290 + 17.3, y * 290 + 9.1) * 0.32 + vnoise(x * 900 + 3.7, y * 900 + 1.3) * 0.18 - 0.5;
}

/**
 * Schummerung bei (x, y): Licht aus Nordwesten unter 40°, Überhöhung ex. Liefert die Aufhellung (−1 … 1, 0 = eben).
 * e: Abstand der Nachbarproben (Karteneinheiten), kpu: km je Einheit.
 */
function shadeAt(x, y, e, kpu, ex) {
  const hx = heightAt(x + e, y) - heightAt(x - e, y);
  const hy = heightAt(x, y + e) - heightAt(x, y - e);
  const d = 2 * e * kpu * 1000;
  const gx = (hx / d) * ex;
  const gy = (hy / d) * ex;
  // Normale (−gx, −gy, 1), Licht zum Nordwesten hin: (−1, −1) in Karten-x/y, Höhe 40°
  const lx = -0.5417;
  const ly = -0.5417;
  const lz = 0.6428;
  const n = Math.sqrt(gx * gx + gy * gy + 1);
  return ((-gx * lx - gy * ly + lz) / n - lz) / (1 - lz);
}

const COV0 = { forest: 0, urban: 0, crop: 0, rock: 0 };
// Schwellen für Wald und Siedlung (Anteil samt Fransen): so gewählt, dass die gemalte Waldfläche über Deutschland dem
// Waldanteil von WorldCover entspricht (rund ein Drittel; tools/landschaft-test.mjs prüft das)
export const FOREST_T = 0.5;
export const URBAN_T = 0.41;
/**
 * Was die Karte in voller Nähe an (x, y) zeigt (dieselben Schwellen und Fransen wie paintLandscape ganz nah): out.forest,
 * out.urban (je 0..1, praktisch 0 oder 1), out.crop (0..1: Acker statt Wiese), out.data (false ohne Daten). Die Welt
 * stellt danach Wald, Dörfer und Felder neben die Straße (world/xxl/landcover.js).
 */
export function coverMask(x, y, out = { forest: 0, urban: 0, crop: 0, data: false }) {
  out.data = landscapeReady() && heightCell(x, y) > 0;
  if (!out.data) {
    out.forest = out.urban = out.crop = 0;
    return out;
  }
  coverAt(x, y, COV0);
  const n = edgeNoise(x, y);
  out.forest = smooth(FOREST_T - 0.01, FOREST_T + 0.01, COV0.forest + n * 0.42);
  out.urban = smooth(URBAN_T - 0.01, URBAN_T + 0.01, COV0.urban + n * 0.35);
  out.crop = COV0.crop;
  return out;
}

let work = null;
function canvasOf(w, h) {
  if (!work) {
    const mk = (W, H) => (typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(W, H) : Object.assign(document.createElement('canvas'), { width: W, height: H }));
    work = { cover: mk(w, h), relief: mk(w, h) };
  }
  for (const c of [work.cover, work.relief]) {
    if (c.width < w) c.width = w;
    if (c.height < h) c.height = h;
  }
  return work;
}

/**
 * Landschaft in ein Rechteck malen: Leinwand-Bildpunkt (dx, dy) liegt bei Kartenpunkt (wx, wy), s = Leinwand-
 * Bildpunkte je Einheit, cw × ch Bildpunkte, k = CSS-Bildpunkte je km (für die Detailstufe). Der Aufrufer hat schon
 * auf das Land zugeschnitten. Liefert false, wenn nichts zu malen war (keine Daten, zu weit weg).
 */
export function paintLandscape(ctx, wx, wy, s, cw, ch, dx, dy, k, theme = 'light', kpu = 70, coarse = false) {
  if (!landscapeReady() || k < 0.05) return false;
  // Probenabstand in Bildpunkten der Leinwand: nah feiner (scharfe Waldränder), im Navi immer grob (jedes Bild zählt)
  const STEP = !coarse && k > 16 ? 2 : 4;
  const P = LAND_COLORS[theme] || LAND_COLORS.light;
  const nx = Math.ceil(cw / STEP) + 2;
  const ny = Math.ceil(ch / STEP) + 2;
  const W = canvasOf(nx, ny);
  const cctx = W.cover.getContext('2d');
  const rctx = W.relief.getContext('2d');
  const cimg = cctx.createImageData(nx, ny);
  const rimg = rctx.createImageData(nx, ny);
  const C = cimg.data;
  const R = rimg.data;
  const u = STEP / s; // Karteneinheiten je Probe
  // Überhöhung: in der Übersicht kräftig (sonst verschwinden die Mittelgebirge), nah natürlicher
  const ex = clamp(14 - 3 * Math.log2(Math.max(k, 0.05) * 4), 3.5, 16);
  // Detailstufe: Waldränder franzen erst aus, wenn eine Rasterzelle groß genug am Bild ist
  const fray = smooth(1.5, 12, k);
  // in der Übersicht weiche Übergänge (ein lichter Wald ist ein Hauch Grün), nah scharfe Waldränder
  const soft = 1 - smooth(1, 10, k);
  const sharp = smooth(12, 40, k);
  const fw = 0.01 + 0.08 * (1 - sharp) + 0.16 * soft;
  const f0 = FOREST_T - 0.03 * soft - fw;
  const f1 = FOREST_T - 0.03 * soft + fw;
  const uw = 0.01 + 0.04 * (1 - sharp);
  const u0 = URBAN_T - uw;
  const u1 = URBAN_T + uw;
  // in der Weltansicht blendet die Landschaft weich aus
  const fade = smooth(0.05, 0.2, k);
  const cov = { forest: 0, urban: 0, crop: 0, rock: 0 };
  let any = false;
  for (let j = 0; j < ny; j++) {
    const y = wy + (j - 1 + 0.5) * u;
    for (let i = 0; i < nx; i++) {
      const x = wx + (i - 1 + 0.5) * u;
      const o = (j * nx + i) * 4;
      const hc = heightCell(x, y);
      if (!hc) continue;
      any = true;
      coverAt(x, y, cov);
      const h = heightAt(x, y);
      // Relief: Abstand der Nachbarn = halbe Rasterzelle oder eine Probe, was größer ist
      const sh = shadeAt(x, y, Math.max(hc * 0.5, u), kpu, ex);
      const rv = 128 + clamp(sh * 100 * P.relief, -72, 60);
      R[o] = R[o + 1] = R[o + 2] = rv;
      R[o + 3] = 255 * fade;
      // Farbschicht: Höhenstufen (ab 900 m heller), Fels und Eis im Hochgebirge, Wald, Siedlung
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      const put = (col, al) => {
        if (al <= 0) return;
        const t = al + a * (1 - al);
        r = (col[0] * al + r * a * (1 - al)) / t;
        g = (col[1] * al + g * a * (1 - al)) / t;
        b = (col[2] * al + b * a * (1 - al)) / t;
        a = t;
      };
      put(P.high, smooth(700, 1900, h) * 0.55);
      const n = fray > 0 ? edgeNoise(x, y) * fray : 0;
      put(P.rock, smooth(0.25, 0.6, cov.rock + n * 0.4) * smooth(1200, 1800, h) * 0.9);
      put(P.snow, smooth(2500, 3100, h + n * 300) * 0.9);
      const f = cov.forest + n * 0.42;
      const fa = smooth(f0, f1, f);
      put(P.forest, fa * 0.88);
      put(P.forestDeep, smooth(0.78, 0.86, f) * 0.55);
      put(P.urban, smooth(u0, u1, cov.urban + n * 0.35) * 0.9);
      C[o] = r;
      C[o + 1] = g;
      C[o + 2] = b;
      C[o + 3] = a * 255 * fade;
    }
  }
  if (!any) return false;
  cctx.putImageData(cimg, 0, 0);
  rctx.putImageData(rimg, 0, 0);
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  // Probe i liegt bei Bildpunkt (i − 1 + 0,5) · STEP: die Quelle beginnt nach der Randprobe
  const sw = cw / STEP;
  const shh = ch / STEP;
  ctx.drawImage(W.cover, 1, 1, sw, shh, dx, dy, cw, ch);
  ctx.globalCompositeOperation = 'overlay';
  ctx.drawImage(W.relief, 1, 1, sw, shh, dx, dy, cw, ch);
  ctx.restore();
  return true;
}

/** Für Prüfstände: km je Karteneinheit bei der Breite des Punkts y (wie mapview.kmPerUnit). */
export const kmPerUnitAt = (y) => 111.32 * Math.cos((2 * Math.atan(Math.exp(-y * RAD)) - Math.PI / 2));
