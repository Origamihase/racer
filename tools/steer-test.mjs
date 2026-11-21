// Prüfstand der Lenkung (npm test): Sprungantworten und jede Zeile der Zieltabelle aus dem Auftrag bei 30, 60 und
// 144 Bildern pro Sekunde, trocken und nass, bei 60, 130 und 230 km/h; dazu Kurven (Drift nach Formel, Haftgrenze,
// Kurvenhilfe), Spurwechsel per Tipp, Spurhalteassistent, Tempomat, Steigung, Leitplanken, Tastenlogik, Touch-Kennlinie
// und das Schadensmodell. Alles reines Node, ohne Browser.
//
//   node tools/steer-test.mjs [--verbose]
import { Player, KMH, BRAKES } from '../src/game/player.js';
import { STEER, TIP, CURVE_ASSIST, LANE_ASSIST, softclip, steerParams } from '../src/game/steering.js';
import { SteerKeys, stickCurve } from '../src/input.js';
import { dragToAnalog, swipeDir, TOUCH_DEAD } from '../src/ui/touch-model.js';
import { Damage, ZONES, damageLine } from '../src/game/damage.js';
import { Chassis, CHASSIS } from '../src/game/chassis.js';
import { ROAD } from '../src/textures.js';
import { SHOP } from '../src/data.js';

const VERBOSE = process.argv.includes('--verbose');
let checks = 0;
let fails = 0;
function check(name, ok, detail = '') {
  checks++;
  if (!ok) fails++;
  if (!ok || VERBOSE) console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ' – ' + detail : ''}`);
}
const section = (t) => console.log('\n' + t);
const f3 = (v) => (Number.isFinite(v) ? v.toFixed(3) : String(v));
const LANE = (i) => ROAD.laneCenter(i);
const WIDE = { left: -60, right: 60, lanes: [-3.75, 0, 3.75, 7.5, 11.25].map((x) => x) };

/**
 * Eine Fahrt mit einem Tastenskript. edges: [[Zeit (s), Richtung −1/0/1]] in absoluten Zeiten. Das Tempo hält der
 * Tempomat exakt (ohne Gas und Bremse bleibt aAuto 0), damit nur die Querdynamik zählt.
 */
function drive(o = {}) {
  const { fps = 60, kmh = 130, wet = 0, kappa = 0, edges = [], dur = 2, opts = {}, x0 = 0, grade = 0, limits = WIDE, analog = null, lane = null } = o;
  const p = new Player();
  p.configure({ cruise: true, laneAssist: 'aus', curveAssist: 'aus', tip: false, sens: 1, ...opts });
  p.reset(kmh > 195 ? { vmax: 3 } : {});
  p.setLimits(limits);
  p.x = x0;
  p.speed = kmh * KMH;
  p.cruiseSet = p.speed;
  const dt = 1 / fps;
  const out = [];
  let t = 0;
  let ei = 0;
  let key = 0;
  const n = Math.round(dur * fps);
  for (let f = 0; f < n; f++) {
    const log = [];
    while (ei < edges.length && edges[ei][0] <= t + dt + 1e-12) {
      log.push([Math.min(1, Math.max(0, (edges[ei][0] - t) / dt)), edges[ei][1]]);
      key = edges[ei][1];
      ei++;
    }
    const k = typeof kappa === 'function' ? kappa(p.s, t) : kappa;
    const an = analog ? analog(t) : 0;
    const ctl = { steer: key || an, steerKey: key, steerLog: log, analog: an, throttle: 0, brake: 0, lane: lane ? lane(t, dt) : 0 };
    p.update(dt, ctl, { wet, kappa: k, grade });
    t += dt;
    out.push({ t, x: p.x, vx: p.vx, vs: p.vs, vc: p.vc, u: p.u, a: p.latAcc, wheel: p.wheel, psi: p.psi, under: p.understeer, v: p.speed, lc: p.laneChanging, ev: p.events.map((e) => e.type) });
  }
  return { r: out, p };
}

/** Bahn zu einer Zeit (lineare Interpolation zwischen Bildern; Bildzeiten verschiedener Raten treffen sich bei k/6 s). */
function xAt(r, t) {
  if (t <= r[0].t) return r[0].x;
  for (let i = 1; i < r.length; i++) {
    if (r[i].t >= t - 1e-9) {
      const a = r[i - 1];
      const b = r[i];
      return a.x + ((b.x - a.x) * (t - a.t)) / (b.t - a.t);
    }
  }
  return r[r.length - 1].x;
}

// --- Kennzahlen eines Tipps, Haltens, Loslassens -----------------------------------------------------------------
const T0 = 0.1037; // bewusst nicht auf einem Bildrand
const TAPS = [40, 50, 60, 90]; // Tipp-Dauern (ms) der Zieltabelle
function tapStats(ms, o = {}) {
  const { r } = drive({ ...o, edges: [[T0, 1], [T0 + ms / 1000, 0]], dur: 1.6 });
  const xf = r[r.length - 1].x;
  const settled = r.find((q) => q.t > T0 && Math.abs(q.x - xf) < 0.01 && Math.abs(q.vx) < 0.05 && r.every((z) => z.t < q.t || Math.abs(z.x - xf) < 0.01));
  let mono = true;
  for (let i = 1; i < r.length; i++) if (r[i].x < r[i - 1].x - 1e-6) mono = false;
  const max = Math.max(...r.map((q) => q.x));
  return { shift: xf, settle: settled ? settled.t - T0 : Infinity, over: max - xf, mono };
}
function holdStats(o = {}) {
  const { r } = drive({ ...o, edges: [[T0, 1]], dur: 1.4 });
  const vmax = r[r.length - 1].vx;
  const q95 = r.find((q) => q.vx >= 0.95 * vmax);
  const q25 = r.find((q) => q.vx >= 0.25 * vmax);
  // sanft: Beschleunigung beginnt bei null (kein Sprung im ersten Bild)
  const peak = Math.max(...r.map((q) => q.a));
  const first = r.find((q) => q.t > T0);
  // fortschreitend: Anteil der vollen Querfahrt 0,1 und 0,2 s nach dem Drücken; die Querfahrt wächst stetig (nie zurück)
  const at = (dt) => xAt(r.map((q) => ({ t: q.t, x: q.vx })), T0 + dt) / vmax;
  let mono = true;
  for (let i = 1; i < r.length; i++) if (r[i].vx < r[i - 1].vx - 1e-9) mono = false;
  // ein einziger Buckel in der Querbeschleunigung: nach dem Gipfel steigt sie bis 95 % nicht wieder an (keine Kerbe,
  // also kein „Ruck, Pause, Ruck“)
  const ip = r.findIndex((q) => q.a === peak);
  let low = Infinity;
  let notch = 0;
  for (let i = ip; i < r.length && r[i].vx < 0.95 * vmax; i++) {
    low = Math.min(low, r[i].a);
    notch = Math.max(notch, r[i].a - low);
  }
  return { vmax, t95: q95.t - T0, t25: q25.t - T0, at1: at(0.1), at2: at(0.2), mono, peak, firstA: first.a, notch };
}
/** Kurz loslassen und wieder drücken mitten im Halten (Taste prellt, oder der Spieler setzt nach): Einbruch der Querfahrt. */
function repressStats(gap, o = {}) {
  const tr = T0 + 0.7;
  const { r } = drive({ ...o, edges: [[T0, 1], [tr, 0], [tr + gap, 1]], dur: 2 });
  const v0 = r.find((q) => q.t >= tr - 1e-9).vx;
  const after = r.filter((q) => q.t > tr);
  const vmin = Math.min(...after.map((q) => q.vx));
  const iMin = after.findIndex((q) => q.vx === vmin);
  const back = after.find((q, i) => i > iMin && q.vx >= 0.95 * v0);
  return { dip: vmin / v0, back: back ? back.t - tr : Infinity };
}
function laneStats(o = {}) {
  // Haltezeit, nach der der Wagen genau eine Spur (3,75 m) weiter steht
  let lo = 0.3;
  let hi = 2.5;
  for (let i = 0; i < 40; i++) {
    const m = (lo + hi) / 2;
    const { r } = drive({ ...o, edges: [[T0, 1], [T0 + m, 0]], dur: 3.5 });
    if (r[r.length - 1].x < 3.75) lo = m;
    else hi = m;
  }
  const { r } = drive({ ...o, edges: [[T0, 1], [T0 + lo, 0]], dur: 3.5 });
  const q95 = r.find((q) => q.x >= 0.95 * 3.75);
  const max = Math.max(...r.map((q) => q.x));
  return { hold: lo, t95: q95.t - T0, over: max - r[r.length - 1].x };
}
function releaseStats(o = {}) {
  const tr = T0 + 1.0;
  const { r } = drive({ ...o, edges: [[T0, 1], [tr, 0]], dur: 2.6 });
  const v0 = r.find((q) => q.t >= tr - 1e-9).vx;
  const stop = r.find((q) => q.t > tr && Math.abs(q.vx) < 0.05 * v0);
  const xr = xAt(r, tr);
  const xf = r[r.length - 1].x;
  const max = Math.max(...r.map((q) => q.x));
  return { stop: stop.t - tr, slide: xf - xr, over: (max - xf) / Math.max(1e-9, xf - xr) };
}
function reversalStats(o = {}) {
  const tr = T0 + 0.9;
  // links halten, dann rechts drücken, während links noch gehalten wird (zuletzt gedrückte gewinnt: Richtung +1)
  const { r } = drive({ ...o, edges: [[T0, -1], [tr, 1]], dur: 1.6 });
  const q = r.find((z) => z.t > tr && z.vx > 0);
  return { t: q ? q.t - tr : Infinity };
}

// --- 1. Zieltabelle bei allen Bildraten, trocken und nass, drei Tempi --------------------------------------------
section('Zieltabelle (3.1) bei 30/60/144 Bildern pro Sekunde, trocken/nass, 60/130/230 km/h');
const table = {};
for (const fps of [30, 60, 144]) {
  for (const wet of [0, 1]) {
    for (const kmh of [60, 130, 230]) {
      const o = { fps, wet, kmh };
      const tag = `${fps} fps, ${wet ? 'nass' : 'trocken'}, ${kmh} km/h`;
      // Taste geht runter: Bewegung im selben Bild (der Druck liegt mitten im Bild)
      {
        const tp = T0 + 0.43 / fps;
        const { r } = drive({ ...o, edges: [[tp, 1]], dur: 0.3 });
        const fr = r.find((q) => q.t > tp);
        check(`${tag}: Taste wirkt im selben Bild`, fr.x > 0 && fr.u > 0 && fr.vx > 0, `x ${(fr.x * 1e6).toFixed(1)} µm, Lenkbefehl ${f3(fr.u)} am Ende des Bildes`);
      }
      const taps = TAPS.map((ms) => tapStats(ms, o));
      const hold = holdStats(o);
      const lane = laneStats(o);
      const rel = releaseStats(o);
      const rev = reversalStats(o);
      table[tag] = { taps, hold, lane, rel, rev };
      const wetK = wet ? 1.35 : 1;
      // Nachtrag 11:23: der kürzeste natürliche Tipp (40–60 ms) versetzt nur 0,15–0,3 m, ein etwas längerer etwas mehr
      for (const [i, ms] of TAPS.entries()) {
        const T = taps[i];
        if (ms <= 60) {
          const lo = wet ? 0.12 : 0.15;
          check(`${tag}: Tipp ${ms} ms versetzt ${lo.toFixed(2).replace('.', ',')}–0,3 m`, T.shift >= lo && T.shift <= 0.3, `${f3(T.shift)} m`);
        }
        check(`${tag}: Tipp ${ms} ms steht nach ≤ ${f3(0.35 * wetK)} s, ohne Überschwingen`, T.settle <= 0.35 * wetK && T.over < 0.001 && T.mono, `${f3(T.settle)} s, über ${(T.over * 1000).toFixed(2)} mm`);
      }
      check(`${tag}: Tipp 90 ms versetzt etwas mehr als 60 ms (≥ 3 cm)`, taps[3].shift >= taps[2].shift + 0.03, `${f3(taps[2].shift)} → ${f3(taps[3].shift)} m`);
      // Halten fortschreitend (Nachtrag 11:23): sofort spürbar, aber sanft (kurzes Halten = kleine Korrektur), dann stetig
      // auf die volle Querfahrt – ohne Ruck beim Drücken und mit einem einzigen Buckel in der Querbeschleunigung
      check(`${tag}: Halten – nach 0,1 s ${(30 / wetK).toFixed(0)}–45 %, nach 0,2 s ≤ 80 % der vollen Querfahrt`, hold.at1 >= 0.3 / wetK && hold.at1 <= 0.45 && hold.at2 <= 0.8, `${(hold.at1 * 100).toFixed(0)} % / ${(hold.at2 * 100).toFixed(0)} %`);
      check(`${tag}: Halten – 95 % nach 0,28–${f3(0.45 * wetK)} s, stetig, ohne Ruck beim Drücken, ohne Kerbe`, hold.t95 >= 0.28 && hold.t95 <= 0.45 * wetK && hold.mono && hold.firstA < 0.35 * hold.peak && hold.notch < 0.02 * hold.peak, `${f3(hold.t95)} s, ${f3(hold.vmax)} m/s, erstes Bild ${f3(hold.firstA)} von ${f3(hold.peak)} m/s², Kerbe ${f3(hold.notch)} m/s²`);
      // kurz losgelassen und wieder gedrückt: weiter, wo das Lenkrad steht (der sanfte Anfang beginnt nicht von vorn)
      const rp = repressStats(0.02, o);
      check(`${tag}: 20 ms loslassen und wieder drücken – Querfahrt bricht höchstens auf 70 % ein, nach ≤ ${f3(0.3 * wetK)} s wieder 95 %`, rp.dip >= 0.7 && rp.back <= 0.3 * wetK, `tiefster Wert ${(rp.dip * 100).toFixed(0)} %, wieder 95 % nach ${f3(rp.back)} s`);
      check(`${tag}: eine Spur (3,75 m) in 0,75–0,95 s`, lane.hold >= 0.75 && lane.hold <= 0.95 * wetK && lane.t95 <= 1.0 * wetK, `Halten ${f3(lane.hold)} s, 95 % nach ${f3(lane.t95)} s`);
      check(`${tag}: Loslassen – steht nach ≤ ${f3(0.2 * wetK)} s, Überschwingen < 3 %`, rel.stop <= 0.2 * wetK && rel.over < 0.03, `${f3(rel.stop)} s, Nachlauf ${f3(rel.slide)} m, über ${(rel.over * 100).toFixed(2)} %`);
      check(`${tag}: Gegenlenken – nach ≤ ${f3(0.18 * wetK)} s in der Gegenrichtung`, rev.t <= 0.18 * wetK, `${f3(rev.t)} s`);
    }
  }
}
// Vergleiche zwischen den Zeilen
for (const fps of [30, 60, 144]) {
  const d = table[`${fps} fps, trocken, 130 km/h`];
  const hi = table[`${fps} fps, trocken, 230 km/h`];
  const w = table[`${fps} fps, nass, 130 km/h`];
  check(`${fps} fps: 230 km/h – gleiche Spurwechselzeit wie 130 km/h`, Math.abs(hi.lane.hold - d.lane.hold) < 0.01, `${f3(hi.lane.hold)} gegen ${f3(d.lane.hold)} s`);
  check(`${fps} fps: 230 km/h – nie zappeliger (Spitzen-Querbeschleunigung nicht höher)`, hi.hold.peak <= d.hold.peak * 1.001, `${f3(hi.hold.peak)} gegen ${f3(d.hold.peak)} m/s²`);
  const resp = w.hold.t95 / d.hold.t95;
  check(`${fps} fps: nass höchstens 35 % langsamer, aber spürbar weicher`, resp <= 1.35 && resp >= 1.1 && w.lane.hold / d.lane.hold <= 1.35, `Aufbau ×${resp.toFixed(2)}, Spurwechsel ×${(w.lane.hold / d.lane.hold).toFixed(2)}`);
}
{
  const slow = holdStats({ kmh: 30 });
  const d = holdStats({ kmh: 130 });
  check('unter 40 km/h proportional sanfter (30 km/h: 75 % der Querfahrt)', Math.abs(slow.vmax / d.vmax - 0.75) < 0.01, `${f3(slow.vmax)} gegen ${f3(d.vmax)} m/s`);
  const t = table['60 fps, trocken, 130 km/h'];
  console.log(`  130 km/h trocken, 60 fps: Tipp ${TAPS.join('/')} ms → ${t.taps.map((q) => f3(q.shift)).join(' / ')} m, steht nach ${t.taps.map((q) => f3(q.settle)).join(' / ')} s; Halten ${(t.hold.at1 * 100).toFixed(0)} % nach 0,1 s, ${(t.hold.at2 * 100).toFixed(0)} % nach 0,2 s, 95 % nach ${f3(t.hold.t95)} s (${f3(t.hold.vmax)} m/s); Spur: ${f3(t.lane.hold)} s halten, 95 % nach ${f3(t.lane.t95)} s; Loslassen ${f3(t.rel.stop)} s (Nachlauf ${f3(t.rel.slide)} m); Gegenlenken ${f3(t.rev.t)} s`);
}

// --- 2. Bildraten-Unabhängigkeit -------------------------------------------------------------------------------
section('Gleiches Tastenskript, gleiche Bahn (30/60/144 fps, höchstens 2 cm)');
const SCRIPT = [[0.21, 1], [0.283, 0], [0.9, -1], [1.62, 0], [1.7, 1], [1.76, 0], [2.3, -1], [2.36, 1], [2.9, 0], [3.1, -1], [3.17, 0], [3.4, 1], [4.3, 0]];
function fpsDiff(o) {
  const rs = [30, 60, 144].map((fps) => drive({ ...o, fps, edges: SCRIPT, dur: 5.5 }).r);
  let md = 0;
  for (let k = 1; k <= 32; k++) {
    const xs = rs.map((r) => xAt(r, k / 6));
    md = Math.max(md, Math.max(...xs) - Math.min(...xs));
  }
  return md;
}
for (const wet of [0, 1]) {
  for (const kmh of [60, 130, 230]) {
    const md = fpsDiff({ wet, kmh });
    check(`${wet ? 'nass' : 'trocken'}, ${kmh} km/h: Bahnabweichung ≤ 2 cm`, md <= 0.02, `${(md * 1000).toFixed(2)} mm`);
  }
}
{
  // mit Spurhalteassistent und Spurwechsel per Tipp
  const md1 = fpsDiff({ opts: { laneAssist: 'sanft' }, limits: {}, x0: LANE(2) });
  check('mit Spurhalteassistent: Bahnabweichung ≤ 2 cm', md1 <= 0.02, `${(md1 * 1000).toFixed(2)} mm`);
  const md2 = fpsDiff({ opts: { tip: true, laneAssist: 'sanft' }, limits: {}, x0: LANE(1) });
  check('mit Spurwechsel per Tipp: Bahnabweichung ≤ 2 cm', md2 <= 0.02, `${(md2 * 1000).toFixed(2)} mm`);
}
{
  // Wiederholbarkeit: kein Zufall in der Antwort
  const a = drive({ edges: SCRIPT, dur: 5, wet: 1 }).r;
  const b = drive({ edges: SCRIPT, dur: 5, wet: 1 }).r;
  check('nass: dasselbe Skript zweimal, dieselbe Bahn (kein Zufall)', a.every((q, i) => q.x === b[i].x));
}

// --- 3. Spurhalteassistent -------------------------------------------------------------------------------------
section('Spurhalteassistent');
for (const lvl of ['sanft', 'an']) {
  const A = LANE_ASSIST[lvl];
  const x0 = LANE(2);
  // ein kurzes Lenken neben die Spur (gemächlich zurück) und ein halber Spurwechsel (zügig in die nächste Spur)
  for (const [what, hold] of [['neben der Spur', 0.28], ['zwischen zwei Spuren', 0.42]]) {
    const ed = [[T0, 1], [T0 + hold, 0]];
    const off = drive({ x0, edges: ed, dur: 4.5, limits: {}, opts: { laneAssist: 'aus' } }).r;
    const on = drive({ x0, edges: ed, dur: 4.5, limits: {}, opts: { laneAssist: lvl } }).r;
    const rel = T0 + hold;
    const stop = off[off.length - 1].x;
    const lane = Math.abs(stop - LANE(2)) < Math.abs(stop - LANE(3)) ? LANE(2) : LANE(3);
    const farMode = Math.abs(stop - lane) > A.far;
    const pause = farMode ? A.farPause : A.pause;
    const same = on.filter((q) => q.t <= rel + pause + 1e-9).every((q, i) => Math.abs(q.x - off[i].x) < 1e-9);
    check(`${lvl}, ${what} (${f3(stop - lane)} m): ${f3(pause)} s nach dem Loslassen noch genau wie ohne Assistent`, same);
    const end = on[on.length - 1].x;
    check(`${lvl}, ${what}: führt danach in die Mitte der Spur, in der er zum Stehen käme (± 3 cm)`, Math.abs(end - lane) < 0.03, `${f3(stop - lane)} m → ${f3(end - lane)} m`);
    // was der Assistent zur Querbeschleunigung beiträgt (das Ausrollen nach dem Loslassen gehört nicht dazu)
    const amax = Math.max(...on.map((q, i) => (q.t > rel + pause ? Math.abs(q.a - off[i].a) : 0)));
    const lim = farMode ? A.farAcc : A.acc;
    check(`${lvl}, ${what}: fährt weich an (zusätzlich höchstens ${lim} m/s² quer)`, amax <= lim * 1.02, `${f3(amax)} m/s²`);
    const done = on.find((q) => q.t > rel && Math.abs(q.x - lane) < 0.05);
    if (VERBOSE) console.log(`  ${lvl}, ${what}: in der Spurmitte (± 5 cm) ${f3(done ? done.t - rel : Infinity)} s nach dem Loslassen`);
  }
  // nie gegen den Spieler: hält er die Taste, gilt nur die Taste
  const hold = drive({ x0: x0 + 0.8, edges: [[T0, 1], [T0 + 1.2, 0]], dur: 1.5, limits: {}, opts: { laneAssist: lvl } }).r;
  const hold0 = drive({ x0: x0 + 0.8, edges: [[T0, 1], [T0 + 1.2, 0]], dur: 1.5, limits: {}, opts: { laneAssist: 'aus' } }).r;
  check(`${lvl}: zieht nie gegen die gehaltene Taste`, hold.filter((q) => q.t <= T0 + 1.2).every((q, i) => q.x === hold0[i].x));
  // innerhalb der Totzone bleibt der Wagen, wo der Spieler ihn hingestellt hat
  const small = drive({ x0, edges: [[T0, 1], [T0 + 0.07, 0]], dur: 4, limits: {}, opts: { laneAssist: lvl } }).r;
  const kept = small[small.length - 1].x - x0;
  if (lvl === 'sanft') check('sanft: ein einzelner Tipp neben die Mitte bleibt stehen (Feinpositionierung)', kept > 0.15, `${f3(kept)} m`);
  if (lvl === 'sanft') {
    // an einem Lkw vorbei: 0,6 m neben der Mitte bleibt der Wagen stehen (die Totzone reicht bis kurz vor die Linie)
    const lkw = drive({ x0, edges: [[T0, 1], [T0 + 0.2, 0]], dur: 4, limits: {}, opts: { laneAssist: lvl } }).r;
    const off = lkw[lkw.length - 1].x - x0;
    check('sanft: 0,6 m neben der Spurmitte (an einem Lkw vorbei) bleibt der Wagen stehen', off > 0.55 && off < A.dead, `${f3(off)} m`);
  }
}
{
  // Stick oder Touch: der Assistent schweigt, solange gelenkt wird
  const x0 = LANE(2) + 0.9;
  const a = drive({ x0, analog: (t) => (t < 1 ? 0.3 : 0), dur: 1, limits: {}, opts: { laneAssist: 'an' } }).r;
  const b = drive({ x0, analog: (t) => (t < 1 ? 0.3 : 0), dur: 1, limits: {}, opts: { laneAssist: 'aus' } }).r;
  check('Stick/Touch: kein Assistent während des Lenkens', a.every((q, i) => q.x === b[i].x));
}

// --- 4. Spurwechsel per Tipp -----------------------------------------------------------------------------------
section('Spurwechsel per Tipp');
{
  const x0 = LANE(1);
  const { r, p } = drive({ x0, edges: [[T0, 1], [T0 + 0.075, 0]], dur: 2.5, limits: {}, opts: { tip: true, laneAssist: 'sanft' } });
  const end = r[r.length - 1].x;
  check('ein Tipp: genau eine Spur weiter (± 2 cm)', Math.abs(end - LANE(2)) < 0.02, `${f3(end - x0)} m`);
  const q95 = r.find((q) => q.x >= x0 + 0.95 * 3.75);
  const max = Math.max(...r.map((q) => q.x));
  check('… als weiche S-Kurve in etwa 0,7–0,9 s, ohne Überschwingen', q95 && q95.t - T0 >= 0.6 && q95.t - T0 <= 0.95 && max - end < 0.03 * 3.75, `95 % nach ${f3(q95 && q95.t - T0)} s, über ${(max - end).toFixed(3)} m`);
  check('… und meldet sich fertig', !p.laneChanging && p.ctrl.lcDone === 1);
  // Abbruch: Tipp in die Gegenrichtung
  const c = drive({ x0, edges: [[T0, 1], [T0 + 0.07, 0], [T0 + 0.35, -1], [T0 + 0.42, 0]], dur: 3, limits: {}, opts: { tip: true } }).r;
  check('Tipp zurück bricht ab: wieder auf der alten Spur (± 2 cm)', Math.abs(c[c.length - 1].x - x0) < 0.02, `${f3(c[c.length - 1].x - x0)} m`);
  // zwei Tipps: zwei Spuren
  const two = drive({ x0, edges: [[T0, 1], [T0 + 0.07, 0], [T0 + 0.3, 1], [T0 + 0.37, 0]], dur: 3.5, limits: {}, opts: { tip: true } }).r;
  check('zwei Tipps nacheinander: zwei Spuren', Math.abs(two[two.length - 1].x - LANE(3)) < 0.02, `${f3(two[two.length - 1].x - x0)} m`);
  // Halten lenkt frei (wie ohne Tipp-Modus)
  const h1 = drive({ x0, edges: [[T0, 1], [T0 + 0.5, 0]], dur: 2, limits: {}, opts: { tip: true } }).r;
  const h2 = drive({ x0, edges: [[T0, 1], [T0 + 0.5, 0]], dur: 2, limits: {}, opts: { tip: false } }).r;
  check('Halten lenkt frei wie ohne Tipp-Modus', h1.every((q, i) => Math.abs(q.x - h2[i].x) < 1e-9));
  // Grenzen der Welt: rechts außen gibt es keine Spur mehr (Standstreifen zählt nicht)
  const edge = drive({ x0: LANE(3), edges: [[T0, 1], [T0 + 0.07, 0]], dur: 2, limits: {}, opts: { tip: true } }).r;
  check('rechts außen: kein Wechsel auf den Standstreifen', edge[edge.length - 1].x < LANE(3) + 0.6, `${f3(edge[edge.length - 1].x - LANE(3))} m`);
  // Landstraße (Profil mit Gegenspur): kein Wechsel in den Gegenverkehr
  const land = { left: 4.65, right: 10.1, lanes: [{ x: 9.0, dir: 1 }, { x: 5.5, dir: -1 }] };
  const lr = drive({ x0: 9.0, edges: [[T0, -1], [T0 + 0.07, 0]], dur: 2, limits: land, opts: { tip: true } }).r;
  check('Landstraße: kein Tipp-Wechsel auf die Gegenspur', lr[lr.length - 1].x > 8.4, `${f3(lr[lr.length - 1].x)} m`);
  // Wischen (Touch): eine Spur
  const sw = drive({ x0, lane: (t, dt) => (t <= T0 && t + dt > T0 ? 1 : 0), dur: 2.5, limits: {} }).r;
  check('Wischen: eine Spur weiter', Math.abs(sw[sw.length - 1].x - LANE(2)) < 0.02, `${f3(sw[sw.length - 1].x - x0)} m`);
}
for (const lvl of ['aus', 'sanft', 'stark']) {
  // Spurwechsel per Tipp in der Kurve (R 800, 130 km/h) endet mittig in der neuen Spur
  const x0 = LANE(1);
  const { r, p } = drive({ x0, kappa: 1 / 800, edges: [[1.2, 1], [1.27, 0]], dur: 3.2, limits: {}, opts: { tip: true, curveAssist: lvl } });
  let doneAt = null;
  for (let i = 1; i < r.length; i++) if (r[i - 1].lc && !r[i].lc) doneAt = r[i];
  check(`Kurve R 800, Kurvenhilfe ${lvl}: Tipp-Spurwechsel endet mittig in der neuen Spur (± 5 cm)`, doneAt && Math.abs(doneAt.x - LANE(2)) < 0.05, doneAt ? `${f3(doneAt.x - LANE(2))} m bei ${f3(doneAt.t)} s` : 'nicht fertig');
  void p;
}

// --- 5. Kurven ----------------------------------------------------------------------------------------------------
section('Kurven (8.3)');
for (const [R, kmh] of [[800, 130], [300, 100], [150, 80]]) {
  for (const lvl of ['aus', 'sanft', 'stark']) {
    const v = kmh * KMH;
    const vk = (v * v) / R;
    const h = CURVE_ASSIST[lvl];
    const mu = STEER.mu;
    const { r } = drive({ kmh, kappa: 1 / R, dur: 4, opts: { curveAssist: lvl } });
    let md = 0;
    for (const q of r) {
      const want = ((1 - h) * vk) / mu * (q.t - (1 - Math.exp(-mu * q.t)) / mu);
      md = Math.max(md, Math.abs(q.x - want));
    }
    check(`freihändig R ${R} @ ${kmh} km/h, Kurvenhilfe ${lvl}: Drift nach Formel (± 1 cm)`, md < 0.01, `Abweichung ${(md * 1000).toFixed(2)} mm, Drift nach 4 s ${f3(r[r.length - 1].x)} m`);
  }
}
{
  // Bildraten-Unabhängigkeit in wechselnden Kurven, mit Tasten
  const kap = (s) => (Math.sin(s / 140) * 1) / 600;
  for (const lvl of ['aus', 'sanft']) {
    const rs = [30, 60, 144].map((fps) => drive({ fps, kappa: kap, edges: SCRIPT, dur: 5.5, opts: { curveAssist: lvl } }).r);
    let md = 0;
    for (let k = 1; k <= 32; k++) {
      const xs = rs.map((r) => xAt(r, k / 6));
      md = Math.max(md, Math.max(...xs) - Math.min(...xs));
    }
    check(`S-Kurven, Kurvenhilfe ${lvl}: gleiche Bahn bei 30/60/144 fps (≤ 2 cm)`, md <= 0.02, `${(md * 1000).toFixed(2)} mm`);
  }
}
{
  // Haftgrenze: unterhalb kein Untersteuern, darüber schiebt der Wagen – bei jeder Kurvenhilfe gleich
  const R = 250;
  for (const wet of [0, 1]) {
    const grip = wet ? STEER.gripWet + (STEER.grip - STEER.gripWet) * 0 : STEER.grip;
    for (const lvl of ['aus', 'sanft', 'stark']) {
      const res = [0.9, 0.97, 1.05, 1.15].map((fr) => {
        const v = Math.sqrt(fr * grip * R);
        const { r } = drive({ kmh: v / KMH, kappa: 1 / R, wet, dur: 6, opts: { curveAssist: lvl } });
        return { fr, under: r.some((q) => q.under >= 1), drift: r[r.length - 1].x };
      });
      const ok = !res[0].under && !res[1].under && res[2].under && res[3].under;
      check(`${wet ? 'nass' : 'trocken'}, Kurvenhilfe ${lvl}: Untersteuern genau ab der Haftgrenze (${grip} m/s²)`, ok, res.map((q) => `${Math.round(q.fr * 100)} %: ${q.under ? 'schiebt' : 'hält'}`).join(', '));
    }
  }
  // stetig: keine Sprünge in der Reifenkraft beim langsamen Hineinfahren in die Grenze
  let jump = 0;
  let prev = null;
  for (let a = 0; a <= 12; a += 0.01) {
    const c = softclip(a, 8);
    if (prev !== null) jump = Math.max(jump, Math.abs(c - prev));
    prev = c;
  }
  check('Reifenkraft stetig an der Haftgrenze (kein Abriss)', jump <= 0.0101, `größter Schritt ${f3(jump)} bei 0,01 m/s² Schrittweite`);
  // an der Haftgrenze lässt sich nicht weiter einlenken
  const v = Math.sqrt(1.1 * STEER.grip * R);
  const inner = drive({ kmh: v / KMH, kappa: 1 / R, edges: [[1.5, -1]], dur: 4, opts: { curveAssist: 'sanft' } }).r;
  const free = drive({ kmh: 100, kappa: 1 / R, edges: [[1.5, -1]], dur: 4, opts: { curveAssist: 'sanft' } }).r;
  const gainIn = xAt(inner, 1.5) - xAt(inner, 2.5);
  const gainFree = xAt(free, 1.5) - xAt(free, 2.5);
  check('über der Haftgrenze bringt Einlenken kaum etwas (Untersteuern bleibt sichtbar)', gainIn < 0.5 * gainFree, `nach innen in 1 s: ${f3(gainIn)} m gegen ${f3(gainFree)} m bei 100 km/h`);
}
for (const lvl of ['aus', 'sanft', 'stark']) {
  // Kurvenhilfe nie gegen die Eingabe: gehaltene Taste → der Wagen fährt in Tastenrichtung, und der Spieleranteil der
  // Querfahrt ist genau derselbe wie auf der Geraden
  for (const dir of [-1, 1]) {
    const c = drive({ kappa: 1 / 800, edges: [[0.5, dir]], dur: 2, opts: { curveAssist: lvl } }).r;
    const g = drive({ kappa: 0, edges: [[0.5, dir]], dur: 2, opts: { curveAssist: lvl } }).r;
    const last = c[c.length - 1];
    const same = c.every((q, i) => Math.abs(q.vs - g[i].vs) < 1e-9);
    check(`Kurvenhilfe ${lvl}, Taste ${dir < 0 ? 'nach innen' : 'nach außen'}: fährt in Tastenrichtung, Spieleranteil wie auf der Geraden`, Math.sign(last.vx) === dir && same, `vx ${f3(last.vx)} m/s`);
  }
}
{
  // Lenkrad zeigt den Kurvenanteil (ruhiger Einschlag im langen Bogen)
  const { r } = drive({ kappa: 1 / 800, dur: 6, opts: { curveAssist: 'sanft' } });
  const w = r[r.length - 1].wheel;
  check('langer Bogen: Lenkrad steht ruhig eingeschlagen zur Kurveninnenseite', w < -0.1 && Math.abs(w - r[r.length - 30].wheel) < 0.01, `Einschlag ${f3(w)}`);
}

// --- 6. Tempomat, Steigung, Obergrenzen ----------------------------------------------------------------------------
section('Tempomat und Steigung');
function longRun({ kmh = 130, cruise = true, grade = 0, dur = 8, cap = 0, throttle = () => 0, brake = () => 0 }) {
  const p = new Player();
  p.configure({ cruise });
  p.reset({});
  p.speed = kmh * KMH;
  if (cruise) p.cruiseSet = p.speed;
  const dt = 1 / 60;
  const out = [];
  for (let t = 0; t < dur; t += dt) {
    if (cap) p.setLimits({ vmax: (typeof cap === 'function' ? cap(t) : cap) * KMH });
    p.update(dt, { steer: 0, steerLog: [], throttle: throttle(t), brake: brake(t) }, { grade });
    out.push({ t, v: p.kmh });
  }
  return { out, p };
}
for (const g of [0.06, -0.06]) {
  const { p } = longRun({ grade: g, dur: 10 });
  check(`Tempomat hält 130 km/h bei ${g > 0 ? '+' : ''}${g * 100} % Steigung (± 0,5 km/h)`, Math.abs(p.kmh - 130) < 0.5, `${p.kmh.toFixed(2)} km/h`);
}
{
  const { out } = longRun({ kmh: 160, cap: (t) => (t > 1 ? 100 : 0), dur: 20 });
  let jerk = 0;
  let minV = Infinity;
  for (let i = 2; i < out.length; i++) {
    const a1 = (out[i].v - out[i - 1].v) / 3.6 * 60;
    const a0 = (out[i - 1].v - out[i - 2].v) / 3.6 * 60;
    jerk = Math.max(jerk, Math.abs(a1 - a0) * 60);
    if (out[i].t > 5) minV = Math.min(minV, out[i].v);
  }
  check('Tempomat übernimmt eine Obergrenze der Welt ruckfrei (≤ 6 m/s³) und ohne Durchsacken', jerk <= 6 && minV > 99, `Ruck ${jerk.toFixed(2)} m/s³, tiefster Wert ${minV.toFixed(1)} km/h`);
  const up = longRun({ throttle: (t) => (t < 2 ? 1 : 0), dur: 6 }).p;
  check('Tempomat: Strom hebt das gehaltene Tempo', up.cruiseSet > 135 * KMH && Math.abs(up.kmh - up.cruiseSet / KMH) < 0.5, `${(up.cruiseSet / KMH).toFixed(1)} km/h`);
  const br = longRun({ throttle: () => 1, brake: (t) => (t < 1.5 ? 1 : 0), dur: 1.5 }).p;
  check('Bremse gewinnt immer (auch mit Strom)', br.kmh < 100, `${br.kmh.toFixed(1)} km/h nach 1,5 s`);
}
{
  const flat = longRun({ cruise: false, grade: 0, dur: 6, kmh: 100 }).p.kmh;
  const upH = longRun({ cruise: false, grade: 0.06, dur: 6, kmh: 100 }).p.kmh;
  const down = longRun({ cruise: false, grade: -0.06, dur: 6, kmh: 100 }).p.kmh;
  check('Steigung: bergauf rollt er langsamer aus, bergab rollt er schneller', upH < flat - 3 && down > 100, `flach ${flat.toFixed(1)}, +6 % ${upH.toFixed(1)}, −6 % ${down.toFixed(1)} km/h`);
  const p = new Player();
  p.reset({});
  const top = (g) => {
    p.speed = 199 * KMH;
    p.cruiseSet = null;
    for (let i = 0; i < 60 * 40; i++) p.update(1 / 60, { steer: 0, steerLog: [], throttle: 1, brake: 0 }, { grade: g });
    return p.kmh;
  };
  const t0 = top(0);
  const t3 = top(0.03);
  const t8 = top(0.08);
  check('Steigung: Höchsttempo erst ab etwa 6 % etwas niedriger', t3 > t0 - 2 && t8 < t0 * 0.97 && t8 > t0 * 0.88, `0 % ${t0.toFixed(1)}, 3 % ${t3.toFixed(1)}, 8 % ${t8.toFixed(1)} km/h`);
}

// --- 7. Leitplanken und Zusammenstöße -------------------------------------------------------------------------------
section('Leitplanken und Zusammenstöße');
{
  const { r, p } = drive({ x0: 8.5, edges: [[0.1, 1]], dur: 3, limits: {} });
  const rails = r.flatMap((q) => q.ev).filter((e) => e === 'rail').length;
  check('Leitplanke: Wagen bleibt an der Planke, schrammt mit Pausen (nicht in jedem Bild)', p.x <= 10.0 + 1e-9 && rails >= 2 && rails <= 6, `${rails} Schrammen in 3 s, x ${f3(p.x)}`);
  const hits = [];
  const mk = (o) => ({ car: { s: 0, len: 4.5, speed: 30, x: 0 }, lonOverlap: 0.5, latOverlap: 1.5, ds: 3, dx: 0, ...o });
  const pl = new Player();
  pl.reset({});
  pl.speed = 36;
  const e1 = mk({ ds: 3 });
  pl.collide(e1);
  hits.push(e1.zone);
  pl.cooldown = 0;
  const e2 = mk({ ds: -3 });
  pl.collide(e2);
  hits.push(e2.zone);
  pl.cooldown = 0;
  const e3 = mk({ lonOverlap: 3, latOverlap: 0.3, ds: 0.5, dx: 1.2 });
  pl.collide(e3);
  hits.push(e3.zone);
  pl.cooldown = 0;
  const e4 = mk({ lonOverlap: 3, latOverlap: 0.3, ds: 0.5, dx: -1.2 });
  pl.collide(e4);
  hits.push(e4.zone);
  check('Zonen: Auffahren vorn, von hinten hinten, seitlich die getroffene Seite', hits.join() === 'front,rear,right,left', hits.join(', '));
  check('Zusammenstöße zählen in den Schaden', pl.damage.hits === 4 && pl.hits === 4 && pl.damage.zones.front === 1 && pl.damage.zones.right === 1);
}

// --- 8. Tastenlogik, Stick und Touch ----------------------------------------------------------------------------------
section('Tasten, Stick, Touch');
{
  const k = new SteerKeys();
  k.press('ArrowLeft', -1, 10);
  k.press('ArrowRight', 1, 20);
  const a = k.dir;
  k.release('ArrowRight', 30);
  const b = k.dir;
  k.press('ArrowLeft', -1, 35); // Wiederholung
  k.press('KeyA', -1, 40);
  k.release('ArrowLeft', 50);
  const c = k.dir;
  k.releaseAll(60);
  check('beide Richtungen: die zuletzt gedrückte gewinnt, Loslassen gibt die andere zurück', a === 1 && b === -1 && c === -1 && k.dir === 0);
  const log = k.take(0, 100);
  check('Kanten mit Zeitanteil, Wiederholungen ohne Wirkung', JSON.stringify(log) === JSON.stringify([[0.1, -1], [0.2, 1], [0.3, -1], [0.6, 0]]), JSON.stringify(log));
  const late = new SteerKeys();
  late.press('KeyD', 1, 5);
  check('verspätet zugestellte Kante liegt am Bildanfang', late.take(10, 20)[0][0] === 0);
  check('Stick: Totzone und sanfte Kennlinie', stickCurve(0.1) === 0 && stickCurve(1) === 1 && stickCurve(-1) === -1 && stickCurve(0.5) < 0.5 && stickCurve(0.5) > 0.2);
  let mono = true;
  for (let x = -1; x < 1; x += 0.01) if (stickCurve(x + 0.01) < stickCurve(x)) mono = false;
  check('Stick: monoton', mono);
  check('Touch: Totzone, voller Einschlag am Rand', dragToAnalog(2, 70) === 0 && dragToAnalog(70, 70) === 1 && dragToAnalog(-140, 70) === -1 && dragToAnalog(35, 70) > 0.3 && TOUCH_DEAD < 0.1);
  check('Touch: Wischen erkannt, Ziehen nicht', swipeDir(60, 8, 150) === 1 && swipeDir(-50, 5, 200) === -1 && swipeDir(60, 8, 600) === 0 && swipeDir(20, 0, 100) === 0 && swipeDir(40, 50, 120) === 0);
}

// --- 9. Schadensmodell ----------------------------------------------------------------------------------------------------
section('Schadensmodell');
{
  const d = new Damage(3);
  d.hit('front');
  d.hit('front');
  d.hit('left');
  d.scrape('right');
  check('Zonen steigen je Treffer, Schrammen kosten nichts', d.zones.front === 2 && d.zones.left === 1 && d.scratches.right === 1 && d.hits === 3 && d.left === 0);
  check('Wort für den Mittelbildschirm', d.word('front') === 'Stoßfänger vorn: verbeult', d.word('front'));
  const json = JSON.stringify(d);
  const e = Damage.from(JSON.parse(json));
  check('serialisierbar', JSON.stringify(e) === json);
  const n = e.repair(2);
  check('Reparatur: älteste zuerst, mit Pflaster', n === 2 && e.zones.front === 0 && e.zones.left === 1 && e.patches.length === 2 && e.patches[0].zone === 'front' && e.left === 2);
  check('Reparatur ohne Schaden tut nichts', new Damage(3).repair(1) === 0);
  for (let i = 0; i < 6; i++) d.hit('rear');
  check('Stufen bleiben bei 3', d.zones.rear === 3);
  check('Sprüche ohne Platzhalter', ZONES.every((z) => !/[{}]/.test(damageLine('more', z, () => 0.5)) && !/[{}]/.test(damageLine('first', z, () => 0.4))));
  check('alter Spielstand ohne Schaden lädt', Damage.from(undefined).hits === 0 && Damage.from({ zones: { front: 9 } }).zones.front === 3);
  {
    // Anzeigen bauen nur bei neuer Versionsnummer neu: nach dem Zurücksetzen darf keine alte Nummer wiederkommen
    const v = new Damage(3);
    v.hit('left');
    const seen = new Set([v.version]);
    v.reset(3);
    seen.add(v.version);
    v.hit('left');
    check('Versionsnummer wiederholt sich nach dem Zurücksetzen nicht', !seen.has(v.version) && v.version > Math.max(...seen), [...seen].join(', ') + ' → ' + v.version);
    const w = new Damage(3);
    const heil = w.pristine;
    w.scrape('right');
    const kratzer = w.pristine;
    w.reset(3);
    check('pristine: nur ganz heil (auch ohne Kratzer und Pflaster)', heil && !kratzer && w.pristine);
  }
}

// --- 9a. Einstellungen aus alten Spielständen ------------------------------------------------------------------------
section('Fahr-Einstellungen (alte Spielstände)');
{
  const { driveSettings, driveDefaults, playerOptions } = await import('../src/ui/drive-settings.js');
  // ein Spielstand von vor Paket H kennt nur die alten Schlüssel: alles Neue kommt aus der Voreinstellung des Geräts
  const old = { sound: true, speech: false, chat: true, volume: 0.8, quality: 'hoch' };
  check('alter Spielstand → Voreinstellungen (Tastatur)', JSON.stringify(driveSettings(old, false)) === JSON.stringify(driveDefaults(false)));
  check('alter Spielstand → Voreinstellungen (Handy: Tempomat an)', driveSettings(old, true).cruise === true && driveSettings(old, false).cruise === false);
  const broken = { laneAssist: 'kaputt', curveAssist: 3, steerSens: 7, tipLane: 'ja', cruise: null, touchMode: 'x', vibration: 1 };
  check('kaputte Werte → Voreinstellung', JSON.stringify(driveSettings(broken, false)) === JSON.stringify(driveDefaults(false)));
  const mine = { laneAssist: 'an', curveAssist: 'stark', steerSens: 0.4, tipLane: true, cruise: true, touchMode: 'tasten', vibration: false };
  const ds = driveSettings({ ...old, ...mine }, false);
  check('eigene Werte bleiben erhalten', Object.keys(mine).every((k) => ds[k] === mine[k]));
  const po = playerOptions(ds);
  check('… und erreichen die Fahrphysik', po.laneAssist === 'an' && po.curveAssist === 'stark' && po.sens === 0.4 && po.tip === true && po.cruise === true);
}

// --- 9b. Feinmotorik (Nachtrag 11:23): nur Tipps, ±0,2 m um eine Ziellinie, alt gegen neu ------------------------
section('Feinmotorik (tools/fine-test.mjs, 10 Fahrer)');
{
  const { fineStats, TASKS, VARIANTS } = await import('./fine-test.mjs');
  const [old, , neu] = VARIANTS;
  for (const key of Object.keys(TASKS)) {
    const a = fineStats(old, TASKS[key], 10);
    const b = fineStats(neu, TASKS[key], 10);
    check(`${TASKS[key].name}: neu ≥ 95 % der Zeit im Band, jeder Fahrer ≥ 90 %`, b.inBand >= 0.95 && b.worstBand >= 0.9, `${(b.inBand * 100).toFixed(0)} % (schlechtester ${(b.worstBand * 100).toFixed(0)} %), ${b.taps.toFixed(1)} Tipps`);
    check(`${TASKS[key].name}: neu genauer als alt, mit höchstens so vielen Tipps`, b.rms < a.rms && b.taps <= a.taps, `Fehler ${f3(b.rms)} gegen ${f3(a.rms)} m, Tipps ${b.taps.toFixed(1)} gegen ${a.taps.toFixed(1)}`);
  }
}

// --- Fahrwerk (Testlauf 20.11.: „Der Wagen schwimmt!“) ------------------------------------------------------------------
section('Fahrwerk: straff, ohne Schaukeln (src/game/chassis.js)');
{
  // Spurwechsel bei 100 km/h mit den Standard-Fahrhilfen: Taste halten, bis der Wagen 3 m weiter ist, loslassen; das
  // Fahrwerk sieht die rohe Querbeschleunigung (Spitzen über 40 m/s²) wie im Spiel
  const lane = (level, fps = 60) => {
    const p = new Player();
    p.configure({ cruise: true, laneAssist: 'sanft', curveAssist: 'sanft', tip: false, sens: 1 });
    p.reset(level ? { fahrwerk: level } : {});
    p.setLimits({ left: -7.8, right: 10, lanes: [LANE(0), LANE(1), LANE(2), LANE(3)] });
    p.x = LANE(1);
    p.speed = 100 * KMH;
    p.cruiseSet = p.speed;
    const ch = new Chassis();
    const dt = 1 / fps;
    let key = 1;
    let first = true;
    let tRel = null;
    const out = [];
    for (let t = 0; t < 3; t += dt) {
      const log = first ? [[0, 1]] : [];
      first = false;
      if (key && p.x - LANE(1) >= 3) {
        log.push([0, 0]);
        key = 0;
        tRel = t;
      }
      p.update(dt, { steer: key, steerKey: key, steerLog: log, analog: 0, throttle: 0, brake: 0 }, {});
      ch.update(dt, p.latAcc, p.firm);
      out.push({ t: t + dt, a: ch.a, roll: ch.roll, head: ch.head, tilt: ch.tilt });
    }
    let quiet = 0;
    for (let i = out.length - 1; i >= 0; i--) {
      if (Math.abs(out[i].roll) > 0.0017 || Math.abs(out[i].head) > 0.002) {
        quiet = out[i].t - tRel;
        break;
      }
    }
    const peak = (k) => Math.max(...out.map((q) => Math.abs(q[k])));
    return { quiet, roll: peak('roll'), head: peak('head'), tilt: peak('tilt'), a: peak('a'), out, tRel };
  };
  const L0 = lane(0);
  const L1 = lane(1);
  const L2 = lane(2);
  check('Serie: gefühlte Querbeschleunigung bleibt unter der Haftgrenze (≤ 7 m/s²), obwohl die Lenkung 40 m/s² meldet', L0.a <= CHASSIS.feel + 1e-9, `${f3(L0.a)} m/s²`);
  check('Serie: Wanken ≤ 1°, Kopf ≤ 2,5 cm, Kameraneigung ≤ 0,5°', L0.roll <= 0.0175 && L0.head <= 0.025 && L0.tilt <= 0.0088, `${f3((L0.roll * 180) / Math.PI)}°, ${f3(L0.head * 100)} cm, ${f3((L0.tilt * 180) / Math.PI)}°`);
  check('Serie: 0,55 s nach dem Loslassen ist das Bild ruhig (Wanken < 0,1°, Kopf < 2 mm; vorher 1,27 s)', L0.quiet <= 0.55, `${f3(L0.quiet)} s`);
  check('Sportfahrwerk: jede Stufe ruhiger und schneller ruhig', L1.quiet < L0.quiet && L2.quiet < L1.quiet && L1.roll < L0.roll && L2.roll < L1.roll, `${f3(L0.quiet)} / ${f3(L1.quiet)} / ${f3(L2.quiet)} s, Wanken ${f3(L0.roll)} / ${f3(L1.roll)} / ${f3(L2.roll)} rad`);
  // kritisch gedämpft: Auf einen Sprung der Querbeschleunigung antwortet die Feder ohne Überschwingen
  const ch = new Chassis();
  let over = 0;
  for (let i = 0; i < 120; i++) over = Math.max(over, ch.update(1 / 60, 5, 0).a - 5);
  let back = 0;
  for (let i = 0; i < 120; i++) back = Math.min(back, ch.update(1 / 60, 0, 0).a);
  check('Feder ohne Überschwingen (Sprung hin und zurück)', over <= 1e-9 && back >= -1e-9, `${f3(over)} / ${f3(back)} m/s²`);
  // dieselbe Antwort bei 30, 60 und 144 Bildern pro Sekunde (genau gelöst für ein im Bild festes Ziel)
  const at = (fps) => {
    const c = new Chassis();
    for (let i = 0; i < Math.round(0.5 * fps); i++) c.update(1 / fps, 6, 0);
    return c.a;
  };
  check('Fahrwerk bildratenfest (30/60/144 fps nach 0,5 s gleich)', Math.abs(at(30) - at(144)) < 1e-6 && Math.abs(at(60) - at(144)) < 1e-6, `${f3(at(30))} / ${f3(at(60))} / ${f3(at(144))}`);
  // Sportreifen: Haftgrenze +12 % je Stufe; Sportfahrwerk: weniger Kurvendrift
  const P = {};
  const grip = (lvl) => {
    const p = new Player();
    p.reset({ reifen: lvl });
    return steerParams(P, { v: 36, wet: 0, latMul: p.latMul, sens: 1, wetGrip: p.wetGrip, grip: p.gripMul, firm: p.firm }).grip;
  };
  check('Sportreifen: Haftgrenze 8 → 8,96 → 9,92 m/s²', Math.abs(grip(0) - 8) < 1e-9 && Math.abs(grip(1) - 8.96) < 1e-9 && Math.abs(grip(2) - 9.92) < 1e-9, `${f3(grip(0))} / ${f3(grip(1))} / ${f3(grip(2))}`);
  // Kurve R 800 m bei 130 km/h freihändig (Kurvenhilfe sanft): Drift nach außen nach 6 s, Serie gegen Sportfahrwerk 2
  const drift = (lvl) => {
    const p = new Player();
    p.configure({ cruise: true, laneAssist: 'aus', curveAssist: 'sanft' });
    p.reset({ fahrwerk: lvl });
    p.setLimits(WIDE);
    p.speed = 130 * KMH;
    p.cruiseSet = p.speed;
    for (let i = 0; i < 360; i++) p.update(1 / 60, { steer: 0, steerKey: 0, steerLog: [], analog: 0, throttle: 0, brake: 0 }, { kappa: 1 / 800 });
    return p.vx;
  };
  const d0 = drift(0);
  const vk = (130 * KMH) ** 2 / 800;
  check('Kurvendrift freihändig = (1 − Hilfe)·v²κ/μ (Serie μ 2,6/s: 0,31 m/s statt 0,43 m/s)', Math.abs(d0 - (0.5 * vk) / STEER.mu) < 0.01, `${f3(d0)} m/s`);
  check('Sportfahrwerk 2: Kurvendrift −29 %', Math.abs(drift(2) / d0 - 1 / 1.4) < 0.01, `${f3(drift(2))} gegen ${f3(d0)} m/s`);
}

// --- Bremsen (Testlauf 20.11.: Sportbremsen im Shop) ------------------------------------------------------------------
section('Bremsen: Bremsweg aus 130 km/h, Serie und Sportbremsen (src/game/player.js BRAKES)');
{
  // Vollbremsung aus 130 km/h bis zum Stand (Tempomat an, wie meist im Spiel), gemessen ab dem Tritt aufs Pedal
  const stop = (level, wet, fps = 60) => {
    const p = new Player();
    p.configure({ cruise: true, laneAssist: 'aus', curveAssist: 'aus' });
    p.reset(level ? { bremse: level } : {});
    p.setLimits(WIDE);
    p.speed = 130 * KMH;
    p.cruiseSet = p.speed;
    const s0 = p.s;
    let t = 0;
    while (p.speed > 0 && t < 20) {
      p.update(1 / fps, { steer: 0, steerKey: 0, steerLog: [], analog: 0, throttle: 0, brake: 1 }, { wet });
      t += 1 / fps;
    }
    return { d: p.s - s0, t };
  };
  const v = 130 * KMH;
  const dry = [0, 1, 2].map((l) => stop(l, 0));
  const wet = [0, 1, 2].map((l) => stop(l, 1));
  const m = (r) => r.map((q) => q.d.toFixed(1).replace('.', ',')).join(' / ');
  check('Serie trocken: Bremsweg = v²/2a mit a 9,5 m/s² (68,6 m)', Math.abs(dry[0].d / ((v * v) / (2 * BRAKES.a)) - 1) < 0.01, `${f3(dry[0].d)} m in ${f3(dry[0].t)} s`);
  check('Sportbremsen: jede Stufe kürzer, trocken und nass', dry[1].d < dry[0].d && dry[2].d < dry[1].d && wet[1].d < wet[0].d && wet[2].d < wet[1].d, `trocken ${m(dry)} m, nass ${m(wet)} m`);
  check('Nässe kostet mit Sportbremsen weniger (Mehrweg nass 22 → 16 → 10 %)', wet[0].d / dry[0].d > wet[1].d / dry[1].d && wet[1].d / dry[1].d > wet[2].d / dry[2].d, [0, 1, 2].map((l) => `${((wet[l].d / dry[l].d - 1) * 100).toFixed(0)} %`).join(' / '));
  // der Shop verspricht, was die Physik hält: Prozente im Text = gemessene Verkürzung
  const art = SHOP.find((a) => a.id === 'bremse');
  for (const l of [1, 2]) {
    const want = `Bremsweg −${Math.round((1 - dry[l].d / dry[0].d) * 100)}\u00a0%, bei Nässe −${Math.round((1 - wet[l].d / wet[0].d) * 100)}\u00a0%`;
    check(`Shop „Sportbremsen“ Stufe ${l}: Text = Messung`, art.effect(l) === want, `${art.effect(l)} | gemessen: ${want}`);
  }
  const at = (fps) => stop(0, 0, fps).d;
  check('Bremsweg bildratenfest (30/60/144 fps auf 1 % gleich)', Math.abs(at(30) / at(144) - 1) < 0.01 && Math.abs(at(60) / at(144) - 1) < 0.01, `${f3(at(30))} / ${f3(at(60))} / ${f3(at(144))} m`);
}

// --- 10. Rechenzeit -----------------------------------------------------------------------------------------------------
section('Rechenzeit');
{
  const p = new Player();
  p.reset({});
  p.speed = 130 * KMH;
  const N = 4000;
  const ctl = { steer: 0, steerKey: 0, steerLog: [], analog: 0, throttle: 0.5, brake: 0 };
  // fünf Blöcke, der schnellste zählt: auf einem ausgelasteten Rechner misst ein einzelner Lauf vor allem die anderen
  let us = Infinity;
  for (let b = 0; b < 5; b++) {
    const t0 = performance.now();
    for (let i = 0; i < N; i++) {
      ctl.steerLog = i % 40 === 0 ? [[0.3, 1]] : i % 40 === 10 ? [[0.5, 0]] : [];
      ctl.steer = ctl.steerKey = i % 40 < 10 ? 1 : 0;
      p.update(1 / 60, ctl, { wet: 0.3, kappa: 1 / 900, grade: 0.01 });
      if (p.x > 9) p.x = 0;
    }
    us = Math.min(us, ((performance.now() - t0) / N) * 1000);
  }
  check('Fahrphysik kostet nichts Messbares (< 40 µs pro Bild)', us < 40, `${us.toFixed(1)} µs pro Bild bei 60 fps`);
}

console.log(`\n${checks - fails} von ${checks} Prüfungen bestanden.`);
if (fails) process.exit(1);
