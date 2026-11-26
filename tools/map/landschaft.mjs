// Landschaft der Karte: Landbedeckung (Wald, Äcker, Siedlungen, Fels und Eis) aus ESA WorldCover 2021 und Höhen aus
// den Terrain Tiles, beides auf Raster in Kartenkoordinaten (project() aus src/map/graph.js: x = Länge, y = −Mercator
// in Grad) gemittelt und als src/map/landscape-data.js geschrieben. Die große Karte und das Navi malen daraus Relief,
// Wald und Siedlungsflächen (src/map/landscape.js), die Welt stellt Wald, Felder und Dörfer dorthin, wo die Karte sie
// zeigt, und baut den Horizont aus den echten Bergen der Gegend.
//
//   node tools/map/landschaft.mjs --arbeit <Ordner für Zwischenspeicher>
//
// Zwei Stufen: fein über Mitteleuropa (Deutschland und Nachbarn, wo fast alle Fahrten liegen), grob über ganz Europa.
// Die Rohdaten bleiben im Arbeitsordner (WorldCover: nur die Übersichtsstufen der Cloud-optimierten GeoTIFFs, gelesen
// per HTTP-Range; Höhen: Terrarium-PNG). Wiederholbar: gleiche Kacheln, byte-gleiche Ausgabe.
//
// Lizenzen: ESA WorldCover 2021 (CC BY 4.0, © ESA WorldCover project 2021 / Contains modified Copernicus Sentinel data
// (2021) processed by ESA WorldCover consortium), Terrain Tiles (Mapzen, AWS Open Data; Hinweise in credits.js).
import { fromUrl, fromFile } from 'geotiff';
import { PNG } from 'pngjs';
import { deflateRawSync } from 'node:zlib';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (k, d) => {
  const i = process.argv.indexOf(k);
  return i > 0 ? process.argv[i + 1] : d;
};
const WORK = arg('--arbeit', '/tmp/landschaft');
mkdirSync(join(WORK, 'wc'), { recursive: true });
mkdirSync(join(WORK, 'dem'), { recursive: true });

const RAD = Math.PI / 180;
const mercY = (lat) => -Math.log(Math.tan(Math.PI / 4 + (lat * RAD) / 2)) / RAD;
const latOf = (y) => (2 * Math.atan(Math.exp(-y * RAD))) / RAD - 90;

/**
 * Die Raster. Bedeckung: je Zelle ein Byte (Bits 0–1 Wald 0..3, 2–3 Siedlung 0..3, 4 überwiegend Acker, 5 Fels/Eis).
 * Höhe: je Zelle ein Byte, h = (v / 255)² · HMAX Meter (fein in der Ebene, grob im Hochgebirge), Meer 0.
 */
export const HMAX = 4800;
const STUFEN = [
  // fein: Mitteleuropa
  { name: 'A', lon: [2, 20], lat: [44.5, 56], cover: 1 / 40, dem: 1 / 24, wcLevel: 1125, demZ: 6 },
  // grob: ganz Europa
  { name: 'B', lon: [-11, 31], lat: [35, 70], cover: 1 / 12, dem: 1 / 8, wcLevel: 562, demZ: 5 },
];

const WC_URL = (n) => `https://esa-worldcover.s3.eu-central-1.amazonaws.com/v200/2021/map/ESA_WorldCover_10m_2021_v200_${n}_Map.tif`;
const DEM_URL = (z, x, y) => `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${z}/${x}/${y}.png`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function tileName(lat, lon) {
  const ns = lat >= 0 ? 'N' : 'S';
  const ew = lon >= 0 ? 'E' : 'W';
  return `${ns}${String(Math.abs(lat)).padStart(2, '0')}${ew}${String(Math.abs(lon)).padStart(3, '0')}`;
}

/** Übersichtsstufe mit Breite w einer WorldCover-Kachel (3° × 3°), zwischengespeichert als rohe Bytes. */
async function wcTile(name, w) {
  const file = join(WORK, 'wc', `${name}_${w}.bin`);
  const miss = join(WORK, 'wc', `${name}.fehlt`);
  if (existsSync(miss)) return null;
  if (existsSync(file)) return new Uint8Array(readFileSync(file));
  for (let tries = 0; tries < 4; tries++) {
    try {
      const head = await fetch(WC_URL(name), { method: 'HEAD' });
      if (head.status === 404 || head.status === 403) {
        writeFileSync(miss, '');
        return null;
      }
      const tif = await fromUrl(WC_URL(name));
      const n = await tif.getImageCount();
      let img = null;
      for (let i = 0; i < n; i++) {
        const im = await tif.getImage(i);
        if (im.getWidth() === w) img = im;
      }
      if (!img) throw new Error('keine Stufe ' + w + ' in ' + name);
      const r = await img.readRasters({ interleave: true });
      const out = new Uint8Array(r);
      writeFileSync(file, out);
      await sleep(150);
      return out;
    } catch (e) {
      console.warn('  WorldCover', name, 'Versuch', tries + 1, e.message);
      await sleep(2000 * (tries + 1));
    }
  }
  throw new Error('WorldCover-Kachel nicht ladbar: ' + name);
}

async function demTile(z, x, y) {
  const file = join(WORK, 'dem', `${z}_${x}_${y}.png`);
  if (!existsSync(file)) {
    for (let tries = 0; ; tries++) {
      const r = await fetch(DEM_URL(z, x, y), { headers: { 'User-Agent': 'MiniAdamRacerResearch/1.0' } });
      if (r.ok) {
        writeFileSync(file, Buffer.from(await r.arrayBuffer()));
        await sleep(250);
        break;
      }
      if (tries > 3) throw new Error('Höhenkachel ' + [z, x, y] + ': ' + r.status);
      await sleep(2000 * (tries + 1));
    }
  }
  return PNG.sync.read(readFileSync(file));
}

/** Höhe (m) bei lat/lon aus den Terrarium-Kacheln der Zoomstufe z, bilinear. */
function demSampler(z) {
  const cache = new Map();
  const n = 2 ** z;
  const px = (tx, ty, ix, iy) => {
    // über die Kachelkante hinaus in die Nachbarkachel
    tx += Math.floor(ix / 256);
    ty += Math.floor(iy / 256);
    ix = ((ix % 256) + 256) % 256;
    iy = ((iy % 256) + 256) % 256;
    ty = Math.max(0, Math.min(n - 1, ty));
    tx = ((tx % n) + n) % n;
    const p = cache.get(tx + ',' + ty);
    const o = (iy * 256 + ix) * 4;
    return p.data[o] * 256 + p.data[o + 1] + p.data[o + 2] / 256 - 32768;
  };
  return {
    async need(lat0, lat1, lon0, lon1) {
      const tx0 = Math.floor(((lon0 + 180) / 360) * n) - 1;
      const tx1 = Math.floor(((lon1 + 180) / 360) * n) + 1;
      const ty = (lat) => Math.floor(((1 - Math.log(Math.tan(lat * RAD) + 1 / Math.cos(lat * RAD)) / Math.PI) / 2) * n);
      for (let x = tx0; x <= tx1; x++) {
        for (let y = ty(lat1) - 1; y <= ty(lat0) + 1; y++) {
          const k = (((x % n) + n) % n) + ',' + y;
          if (!cache.has(k)) cache.set(k, await demTile(z, ((x % n) + n) % n, y));
        }
      }
    },
    at(lat, lon) {
      const fx = ((lon + 180) / 360) * n * 256 - 0.5;
      const fy = ((1 - Math.log(Math.tan(lat * RAD) + 1 / Math.cos(lat * RAD)) / Math.PI) / 2) * n * 256 - 0.5;
      const ix = Math.floor(fx);
      const iy = Math.floor(fy);
      const tx = Math.floor(ix / 256);
      const ty = Math.floor(iy / 256);
      const lx = ix - tx * 256;
      const ly = iy - ty * 256;
      const u = fx - ix;
      const v = fy - iy;
      const a = px(tx, ty, lx, ly);
      const b = px(tx, ty, lx + 1, ly);
      const c = px(tx, ty, lx, ly + 1);
      const d = px(tx, ty, lx + 1, ly + 1);
      return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
    },
  };
}

// Klassen von WorldCover → Zählkanal: 0 Wald, 1 Siedlung, 2 Acker, 3 Fels/Eis, 4 Wasser, 5 sonst (Gras, Busch, Moor)
const CH = new Int8Array(256).fill(-1);
CH[10] = 0;
CH[50] = 1;
CH[40] = 2;
CH[60] = 3;
CH[70] = 3;
CH[80] = 4;
for (const c of [20, 30, 90, 95, 100]) CH[c] = 5;
const NCH = 6;

async function coverGrid(S) {
  const cell = S.cover;
  const x0 = S.lon[0];
  const y0 = mercY(S.lat[1]);
  const w = Math.round((S.lon[1] - S.lon[0]) / cell);
  const h = Math.round((mercY(S.lat[0]) - y0) / cell);
  const cnt = new Uint32Array(w * h * NCH);
  const lat0 = Math.floor(S.lat[0] / 3) * 3;
  const lon0 = Math.floor(S.lon[0] / 3) * 3;
  let done = 0;
  for (let la = lat0; la < S.lat[1]; la += 3) {
    for (let lo = lon0; lo < S.lon[1]; lo += 3) {
      const name = tileName(la, lo);
      const R = await wcTile(name, S.wcLevel);
      done++;
      if (!R) continue;
      const W = S.wcLevel;
      const step = 3 / W;
      for (let iy = 0; iy < W; iy++) {
        const lat = la + 3 - (iy + 0.5) * step;
        if (lat < S.lat[0] || lat > S.lat[1]) continue;
        const gy = Math.floor((mercY(lat) - y0) / cell);
        if (gy < 0 || gy >= h) continue;
        for (let ix = 0; ix < W; ix++) {
          const lon = lo + (ix + 0.5) * step;
          const gx = Math.floor((lon - x0) / cell);
          if (gx < 0 || gx >= w) continue;
          const c = CH[R[iy * W + ix]];
          if (c >= 0) cnt[(gy * w + gx) * NCH + c]++;
        }
      }
      if (done % 10 === 0) console.log(`  ${S.name}: ${done} Kacheln`);
    }
  }
  const out = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    let tot = 0;
    for (let c = 0; c < NCH; c++) tot += cnt[i * NCH + c];
    if (!tot) continue;
    const f = (c) => cnt[i * NCH + c] / tot;
    const forest = Math.min(3, Math.round(f(0) * 3));
    const urban = Math.min(3, Math.round(f(1) * 3 * 1.4));
    const crop = f(2) >= 0.4 ? 1 : 0;
    const rock = f(3) > 0.4 ? 1 : 0;
    out[i] = forest | (urban << 2) | (crop << 4) | (rock << 5);
  }
  return { x0, y0, cell, w, h, bytes: out };
}

async function demGrid(S) {
  const cell = S.dem;
  const x0 = S.lon[0];
  const y0 = mercY(S.lat[1]);
  const w = Math.round((S.lon[1] - S.lon[0]) / cell);
  const h = Math.round((mercY(S.lat[0]) - y0) / cell);
  const D = demSampler(S.demZ);
  await D.need(S.lat[0], S.lat[1], S.lon[0], S.lon[1]);
  const out = new Uint8Array(w * h);
  const N = 3;
  for (let gy = 0; gy < h; gy++) {
    for (let gx = 0; gx < w; gx++) {
      let sum = 0;
      for (let j = 0; j < N; j++) {
        for (let i = 0; i < N; i++) {
          const lat = latOf(y0 + (gy + (j + 0.5) / N) * cell);
          const lon = x0 + (gx + (i + 0.5) / N) * cell;
          sum += Math.max(0, D.at(lat, lon));
        }
      }
      const m = sum / (N * N);
      out[gy * w + gx] = Math.min(255, Math.round(Math.sqrt(Math.min(m, HMAX) / HMAX) * 255));
    }
  }
  return { x0, y0, cell, w, h, bytes: out };
}

/** Zeilenweise Differenzen (mod 256): glatte Höhen packen so viel besser. */
function deltaRows(g) {
  const o = new Uint8Array(g.bytes.length);
  for (let y = 0; y < g.h; y++) {
    let prev = 0;
    for (let x = 0; x < g.w; x++) {
      const v = g.bytes[y * g.w + x];
      o[y * g.w + x] = (v - prev) & 255;
      prev = v;
    }
  }
  return o;
}

const grids = [];
for (const S of STUFEN) {
  console.log('Bedeckung', S.name);
  grids.push({ name: 'cover' + S.name, ...(await coverGrid(S)), delta: false });
  console.log('Höhen', S.name);
  grids.push({ name: 'dem' + S.name, ...(await demGrid(S)), delta: true });
}
const parts = [];
let off = 0;
const meta = grids.map((g) => {
  const raw = g.delta ? deltaRows(g) : g.bytes;
  parts.push(raw);
  const m = { name: g.name, x0: g.x0, y0: +g.y0.toFixed(6), cell: g.cell, w: g.w, h: g.h, off, delta: g.delta };
  off += raw.length;
  return m;
});
const all = new Uint8Array(off);
let o = 0;
for (const p of parts) {
  all.set(p, o);
  o += p.length;
}
const packed = deflateRawSync(all, { level: 9 });
const b64 = packed.toString('base64');
const js = `// ERZEUGT von tools/map/landschaft.mjs – nicht von Hand ändern. Landbedeckung aus ESA WorldCover 2021 (CC BY 4.0,
// © ESA WorldCover project 2021 / Contains modified Copernicus Sentinel data (2021) processed by ESA WorldCover
// consortium) und Höhen aus den Terrain Tiles (Mapzen, AWS Open Data), gemittelt auf Raster in Kartenkoordinaten.
// Aufbau: tools/map/landschaft.mjs, gelesen von src/map/landscape.js.
/* eslint-disable */
export const HMAX = ${HMAX};
export const GRIDS = ${JSON.stringify(meta)};
export const RAW_BYTES = ${off};
export const PACKED = '${b64}';
`;
writeFileSync(join(HERE, '..', '..', 'src', 'map', 'landscape-data.js'), js);
console.log(`geschrieben: ${off} Bytes roh, ${packed.length} gepackt, ${b64.length} als Text`);
for (const m of meta) console.log(' ', m.name, m.w + '×' + m.h);
