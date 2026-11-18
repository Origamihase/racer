// Feinmotorik-Test (Nachtrag vom 17.11.2026, 11:23): Ein Mensch mit Reaktionszeit hält den Wagen 20 s lang nur mit
// kurzen Tipps nah an einer Ziellinie (Band ±0,2 m) – alte Lenkung (bis Paket H) gegen neue. Gezählt werden die Tipps,
// der mittlere und der größte Fehler und die Zeit im Band. Gerade Autobahn, 130 km/h, kein Verkehr, Voreinstellungen
// (Spurhalteassistent und Kurvenhilfe „sanft“).
//
//   welle – die Linie pendelt langsam ±0,35 m um die Spurmitte (eine Schwingung in 10 s)
//   lkw   – an einem Lkw vorbei: die Linie rückt in 2 s um 0,6 m von der Spurmitte weg und bleibt dort
//
// Der Mensch (wie im Fahrer-Bot): sieht mit 220–280 ms Verzögerung, schätzt, wo der Wagen ausrollt, und tippt, wenn das
// mehr als 6 cm neben der Linie (0,3 s voraus) liegt. Wie lange er drückt, hat er gelernt (Weg je Druckdauer, an der
// Lenkung selbst gemessen), aber nie kürzer als ein natürlicher Tipp (40–60 ms) und nie länger als 150 ms; dazu ±12 %
// Streuung. Nach jedem Tipp wartet er, bis er die Wirkung sieht.
//
//   node tools/fine-test.mjs [--fahrer=20] [--verbose]
import { Player, KMH } from '../src/game/player.js';
import { STEER, LANE_ASSIST } from '../src/game/steering.js';
import { ROAD } from '../src/textures.js';
import { LegacyPlayer, mulberry } from './steer-bot.mjs';
import { fileURLToPath } from 'url';

const FPS = 60;
export const DT = 1 / FPS;
const DUR = 20;
export const BAND = 0.2;
const TOL = 0.06; // so viel Abweichung nimmt er hin, ohne zu tippen (m)
const LEAD = 0.3; // so weit schaut er auf der Linie voraus (s)
export const C = ROAD.laneCenter(2);

const smooth = (a, b, v) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export const TASKS = {
  welle: { name: 'Welle ±0,35 m', line: (t) => C + 0.35 * Math.sin((2 * Math.PI * t) / 10), from: 0.5 },
  lkw: { name: 'Lkw: 0,6 m daneben', line: (t) => C + 0.6 * smooth(0.5, 2.5, t), from: 0.5 },
};

/**
 * Die neue Lenkung, wie sie vor dem Nachtrag abgestimmt war: jeder Tipp ≥ 0,11 s, Halten sofort voll, Totzone des
 * sanften Spurhalteassistenten 0,45 m.
 */
const BEFORE = { tapMin: 0.11, ease: 1, vLat: 4.3 };

export const VARIANTS = [
  { name: 'Alt (bis Paket H)', old: true },
  { name: 'Neu vor dem Nachtrag', steer: BEFORE, sanft: { dead: 0.45 } },
  { name: 'Neu', steer: null },
  { name: 'Neu, Spurhalteassistent aus', steer: null, laneAssist: 'aus' },
];

function makePlayer(v, laneAssist = v.laneAssist ?? 'sanft') {
  if (v.old) {
    const P = new LegacyPlayer();
    P.reset({});
    P.x = C;
    P.speed = 130 * KMH;
    return P;
  }
  const P = new Player();
  P.configure({ tip: false, laneAssist, curveAssist: 'sanft', cruise: true, sens: 1 });
  P.reset({});
  P.x = C;
  P.speed = 130 * KMH;
  P.cruiseSet = P.speed;
  return P;
}

/** Ein Bild fahren; edges: Tastenkanten [[Zeit, Richtung]] im Bild [t, t + DT). */
function frame(P, v, st, t, edges) {
  let ctl;
  if (v.old) {
    // alte Eingabe: nur der Tastenstand zum Bild zählt
    for (const [, d] of edges) st.key = d;
    ctl = { steer: st.key, throttle: 0, brake: 0 };
  } else {
    if (edges.length) st.key = edges[edges.length - 1][1];
    ctl = { steer: st.key, steerKey: st.key, steerLog: edges.map(([te, d]) => [Math.min(1, Math.max(0, (te - t) / DT)), d]), analog: 0, throttle: 0, brake: 0 };
  }
  P.battery = 100;
  P.update(DT, ctl, { wet: 0, kappa: 0, grade: 0 });
}

export function withSteer(v, fn) {
  const keep = { ...STEER };
  const keepA = { ...LANE_ASSIST.sanft };
  if (v.steer) Object.assign(STEER, v.steer);
  if (v.sanft) Object.assign(LANE_ASSIST.sanft, v.sanft);
  try {
    return fn();
  } finally {
    Object.assign(STEER, keep);
    Object.assign(LANE_ASSIST.sanft, keepA);
  }
}

/**
 * Was der Mensch gelernt hat: wie weit ein Druck von T Sekunden den Wagen versetzt (neu: wo er stehen bleibt; alt: wie
 * weit er kommt, bevor der Spurhalter ihn zurückholt).
 */
export function learnTable(v) {
  const rows = [];
  for (let T = 0.02; T <= 0.3001; T += 0.005) {
    const P = makePlayer(v, 'aus');
    const st = { key: 0 };
    const x0 = P.x;
    let peak = 0;
    const t0 = 0.2 + 0.37 * DT;
    for (let f = 0; f < 1.6 * FPS; f++) {
      const t = f * DT;
      const edges = [];
      if (t0 >= t && t0 < t + DT) edges.push([t0, 1]);
      if (t0 + T >= t && t0 + T < t + DT) edges.push([t0 + T, 0]);
      frame(P, v, st, t, edges);
      peak = Math.max(peak, P.x - x0);
    }
    rows.push([T, v.old ? peak : P.x - x0]);
  }
  return (e) => {
    if (e <= rows[0][1]) return rows[0][0];
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][1] >= e) {
        const [ta, ea] = rows[i - 1];
        const [tb, eb] = rows[i];
        return ta + ((tb - ta) * (e - ea)) / Math.max(1e-9, eb - ea);
      }
    }
    return rows[rows.length - 1][0];
  };
}

export class Tapper {
  constructor(rnd, learn, tStop, tapMin) {
    this.rnd = rnd;
    this.learn = learn;
    this.tStop = tStop;
    this.tapMin = tapMin;
    this.buf = [];
    this.key = 0;
    this.pressT = 0;
    this.releaseAt = 0;
    this.nextAllowed = 0;
    this.delay = 0.25;
    this.taps = 0;
  }

  gauss() {
    return (this.rnd() + this.rnd() + this.rnd() - 1.5) * 1.41;
  }

  observe(t, P) {
    this.buf.push({ t, x: P.x, vx: P.vx });
    while (this.buf.length > 40) this.buf.shift();
  }

  /** Tastenkanten für das Bild [t, t + DT). */
  act(t, line, edges) {
    if (this.key !== 0) {
      if (t + DT > this.releaseAt) {
        const tr = Math.max(t, this.releaseAt);
        edges.push([tr, 0]);
        this.key = 0;
        // erst die Wirkung abwarten (ein Tipp der neuen Lenkung wirkt mindestens tapMin), dann wieder schauen
        this.nextAllowed = Math.max(tr, this.pressT + this.tapMin) + this.delay + 0.15 + this.rnd() * 0.1;
      }
      return;
    }
    if (t < this.nextAllowed) return;
    let b = this.buf[0];
    for (const q of this.buf) if (q.t <= t - this.delay + 1e-9) b = q;
    const x = b.x + b.vx * (t - b.t) * 0.9;
    const e = line(t + LEAD) - (x + b.vx * this.tStop);
    if (Math.abs(e) <= TOL) return;
    const at = t + this.rnd() * DT;
    const natural = 0.04 + this.rnd() * 0.02;
    const T = Math.min(0.15, Math.max(natural, this.learn(Math.abs(e)) * (1 + this.gauss() * 0.12)));
    this.key = Math.sign(e);
    this.pressT = at;
    this.releaseAt = at + T;
    edges.push([at, this.key]);
    this.taps++;
  }
}

/** Eine Fahrt: ein Fahrer (seed) mit einer Variante auf einer Aufgabe. */
export function fineRun(v, task, seed, learn = null) {
  return withSteer(v, () => {
    const rnd = mulberry(seed * 104729 + 7);
    const L = learn || learnTable(v);
    const P = makePlayer(v);
    // Nachlauf nach dem Loslassen: alte Lenkung ein Glied (8,5/s), neue drei Glieder (3/down)
    const tStop = v.old ? 1 / 8.5 : 3 / STEER.down;
    const H = new Tapper(rnd, L, tStop, v.old ? 0 : STEER.tapMin);
    const st = { key: 0 };
    let n = 0;
    let inBand = 0;
    let sum2 = 0;
    let max = 0;
    for (let f = 0; f < DUR * FPS; f++) {
      const t = f * DT;
      H.delay = 0.22 + rnd() * 0.06;
      H.observe(t, P);
      const edges = [];
      H.act(t, task.line, edges);
      frame(P, v, st, t, edges);
      const tt = t + DT;
      if (tt < task.from) continue;
      const err = Math.abs(P.x - task.line(tt));
      n++;
      sum2 += err * err;
      max = Math.max(max, err);
      if (err <= BAND) inBand++;
    }
    return { inBand: inBand / n, rms: Math.sqrt(sum2 / n), max, taps: H.taps };
  });
}

/** Alle Fahrer einer Variante auf einer Aufgabe: Mittelwerte. */
export function fineStats(v, task, drivers) {
  const learn = withSteer(v, () => learnTable(v));
  const acc = { inBand: 0, rms: 0, max: 0, taps: 0, worstBand: 1 };
  for (let s = 1; s <= drivers; s++) {
    const r = fineRun(v, task, s, learn);
    acc.inBand += r.inBand / drivers;
    acc.rms += r.rms / drivers;
    acc.max += r.max / drivers;
    acc.taps += r.taps / drivers;
    acc.worstBand = Math.min(acc.worstBand, r.inBand);
  }
  return acc;
}

/** Weg eines einzelnen Tipps (m) bei 130 km/h für einige Druckdauern – zum Vergleich im Bericht. */
export function tapRow(v, list = [40, 50, 60, 90, 150, 300]) {
  return withSteer(v, () =>
    list.map((ms) => {
      const P = makePlayer(v, 'aus');
      const st = { key: 0 };
      const x0 = P.x;
      let peak = 0;
      const t0 = 0.2 + 0.37 * DT;
      const T = ms / 1000;
      for (let f = 0; f < 2 * FPS; f++) {
        const t = f * DT;
        const edges = [];
        if (t0 >= t && t0 < t + DT) edges.push([t0, 1]);
        if (t0 + T >= t && t0 + T < t + DT) edges.push([t0 + T, 0]);
        frame(P, v, st, t, edges);
        peak = Math.max(peak, P.x - x0);
      }
      return v.old ? peak : P.x - x0;
    }),
  );
}

function main() {
  const args = process.argv.slice(2);
  const drivers = +((args.find((a) => a.startsWith('--fahrer=')) || '').slice(9) || 20);
  const pct = (x) => (x * 100).toFixed(0).padStart(4) + ' %';
  const m = (x) => x.toFixed(2).replace('.', ',') + ' m';
  console.log(`Feinmotorik: ${drivers} Fahrer je Variante, 20 s nur Tipps, Band ±${BAND} m, 130 km/h, Voreinstellungen`);
  console.log('\nWeg eines Tipps (alt: bevor der Spurhalter zurückholt) – 40 / 50 / 60 / 90 / 150 / 300 ms:');
  for (const v of VARIANTS.slice(0, 3)) console.log(`  ${v.name.padEnd(30)} ${tapRow(v).map((x) => x.toFixed(2)).join(' / ')} m`);
  for (const key of Object.keys(TASKS)) {
    const task = TASKS[key];
    console.log(`\n${task.name}:`);
    console.log(`  ${'Variante'.padEnd(30)} im Band  (schlechtester)  mittl. Fehler  größter   Tipps/20 s`);
    for (const v of VARIANTS) {
      const r = fineStats(v, task, drivers);
      console.log(`  ${v.name.padEnd(30)} ${pct(r.inBand)}  (${pct(r.worstBand)})        ${m(r.rms)}       ${m(r.max)}   ${r.taps.toFixed(1)}`);
    }
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
