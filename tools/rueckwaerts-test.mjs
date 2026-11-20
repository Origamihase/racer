// Prüft den Rückwärtsgang ohne Grafik: den Wagen allein (Player), das Spiel (Game mit Mitspielern, die mitschreiben;
// die Fahrt steht dabei am Start) und die Reise über die echte Karte (Trip, Arrival, NavModel wie in
// tools/journey-test.mjs).
// node tools/rueckwaerts-test.mjs
// - R gibt es nur aus den eigenen Eingaben des Spielers: Bremse ganz gehalten, im Stand, etwa 0,5 s – nie für den
//   die Haltesteuerung am Fahrtende (Bremse 0,5) oder während die Welt den Wagen anhält.
// - In R: höchstens REVERSE.vmax (≈ 15 km/h), sanft anfahren, kein Tempomat; Strom bremst bis zum Stand und legt D ein
//   (im Stand genügt ein Tipp); ohne Erlaubnis bremst R bis zum Stand und legt D ein.
// - Lenken rückwärts: das Heck geht zur gelenkten Seite, die Nase dreht zur anderen.
// - Die Grenze: höchstens REVERSE.back Meter hinter den weitesten Punkt, nie über limits.back; weich bis zum Stand,
//   eine Meldung.
// - Nichts zählt doppelt oder rückwärts: Reisekilometer, Strecke, saubere Strecke, Regenstrecke, linke Spur, Uhr,
//   Blitzer (Blitz, Lob, Foto), Abschnitte, Orte, Gabelungen und Ankünfte.
// - Wer nie rückwärts fährt, fährt genau wie vorher: derselbe Stream mit und ohne die Erlaubnis stimmt auf den Cent.
import { Player, REVERSE } from '../src/game/player.js';
import { Game } from '../src/game/game.js';
import { Trip } from '../src/game/trip.js';
import { NavModel } from '../src/map/navroute.js';
import { limitsFor, Arrival, AUTO } from '../src/world/xxl/plan.js';
import { J } from '../src/game/trip.js';

const DT = 1 / 30;
let fails = 0;
let checks = 0;
function ok(cond, msg) {
  checks++;
  if (cond) return;
  fails++;
  console.error('FEHLER: ' + msg);
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function mulberry32(a) {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- 1. Der Wagen allein ---------------------------------------------------------------------------------------------
/** Ein stehender Wagen bei s (Grenzen ohne Welt, Weltgrenze back). */
function car({ s = 1000, speed = 0, back = 0, cruise = false } = {}) {
  const p = new Player();
  p.configure({ cruise });
  p.reset({});
  p.setLimits({ back });
  p.s = s;
  p.sFar = s;
  p.speed = speed;
  return p;
}
/** sec Sekunden mit diesen Eingaben fahren; liefert alle Ereignisse und den Verlauf { t, s, v, gear }. */
function drive(p, sec, ctl, env = { reverse: true }) {
  const ev = [];
  const trace = [];
  const n = Math.round(sec / DT);
  for (let i = 0; i < n; i++) {
    p.update(DT, { steer: 0, throttle: 0, brake: 0, ...ctl }, env);
    for (const e of p.events) ev.push({ ...e, t: i * DT });
    trace.push({ t: (i + 1) * DT, s: p.s, v: p.v, speed: p.speed, gear: p.gear, x: p.x, yaw: p.yaw });
  }
  return { ev, trace };
}
const gears = (r) => r.ev.filter((e) => e.type === 'gear').map((e) => e.gear);

{
  // Bremse im Stand gehalten: nach etwa 0,5 s R, vorher nicht
  const p = car();
  const r = drive(p, 2, { brake: 1 });
  const first = r.trace.findIndex((q) => q.gear === 'R');
  ok(first >= 0, 'Bremse im Stand gehalten: kein R');
  const tR = r.trace[first]?.t ?? Infinity;
  ok(tR >= REVERSE.hold - 1e-6 && tR <= REVERSE.hold + 2 * DT, `R kommt nach ${tR.toFixed(2)} s statt nach ${REVERSE.hold} s`);
  ok(same(gears(r), ['R']), `Gangwechsel beim Halten: ${gears(r)}`);
  ok(p.s < 1000 && p.v < 0, 'In R fährt die gehaltene Bremse nicht rückwärts');
  // nicht ganz durchgetreten (Analogtaste halb, Haltesteuerung 0,5): nie R
  for (const brake of [0.5, 0.85]) {
    const q = car();
    ok(!drive(q, 10, { brake }).trace.some((t) => t.gear === 'R'), `Bremse ${brake} legt R ein`);
  }
  // ohne die Erlaubnis des Spielers (Autopilot, Vorführung, Haltesteuerung, Halt am Brunnen): nie R
  for (const env of [{}, { reverse: false }, { wet: 0 }, { reverse: 1 }]) {
    const q = car();
    ok(!drive(q, 10, { brake: 1 }, env).trace.some((t) => t.gear === 'R'), `Ohne Erlaubnis (${JSON.stringify(env)}) gibt es R`);
  }
  // die Welt hält den Wagen an (vmax 0): nie R
  const h = car();
  h.setLimits({ vmax: 0 });
  ok(!drive(h, 5, { brake: 1 }).trace.some((t) => t.gear === 'R'), 'R, obwohl die Welt den Wagen anhält');
  // in Fahrt: erst bremsen, R erst im Stand
  const m = car({ speed: 20 });
  const rm = drive(m, 6, { brake: 1 });
  const iR = rm.trace.findIndex((q) => q.gear === 'R');
  const iStop = rm.trace.findIndex((q) => q.speed < REVERSE.still);
  ok(iR > iStop && iStop >= 0 && rm.trace[iR].t - rm.trace[iStop].t >= REVERSE.hold - 2 * DT, 'R in Fahrt oder ohne die halbe Sekunde im Stand');
  // kurz loslassen setzt die halbe Sekunde zurück
  const k = car();
  drive(k, 0.4, { brake: 1 });
  drive(k, DT, { brake: 0 });
  const rk = drive(k, 0.4, { brake: 1 });
  ok(!rk.trace.some((q) => q.gear === 'R'), 'Zweimal 0,4 s Bremse mit einer Lücke legen R ein');
}

{
  // Tempo in R, sanft anfahren, kein Tempomat
  const p = car({ cruise: true });
  ok(p.cruiseSet !== null, 'Tempomat (Einstellung) ist nicht an');
  const r = drive(p, 12, { brake: 1 });
  const top = Math.max(...r.trace.map((q) => -q.v));
  ok(top <= REVERSE.vmax + 1e-9 && top > REVERSE.vmax - 0.05, `Höchsttempo rückwärts ${(top * 3.6).toFixed(1)} km/h`);
  ok(p.cruiseSet === null, 'Der Tempomat bleibt in R an');
  ok(r.trace.every((q) => q.speed >= 0), 'speed wird negativ');
  let maxAcc = 0;
  for (let i = 1; i < r.trace.length; i++) maxAcc = Math.max(maxAcc, Math.abs(r.trace[i].v - r.trace[i - 1].v) / DT);
  ok(maxAcc <= REVERSE.acc + 0.01, `Rückwärts ruckt es: ${maxAcc.toFixed(2)} m/s²`);
  // Strom bremst bis zum Stand und legt D ein, dann geht es vorwärts
  const w = drive(p, 3, { throttle: 1 });
  ok(same(gears(w), ['D']), `Strom in R: Gänge ${gears(w)}`);
  const iD = w.trace.findIndex((q) => q.gear === 'D');
  ok(iD > 0 && w.trace.slice(0, iD).every((q) => q.v <= 1e-9), 'Strom in R fährt vorwärts, bevor der Wagen steht');
  ok(p.v > 2, 'Nach D fährt der Wagen mit Strom nicht vorwärts');
  ok(p.cruiseSet !== null, 'Mit D hält der Tempomat (Einstellung an) nicht wieder');
  // im Stand in R: ein Tipp auf Strom genügt für D
  const t = car();
  drive(t, 1, { brake: 1 });
  drive(t, 2, {});
  ok(t.gear === 'R' && t.speed === 0, 'R rollt ohne Pedal nicht aus');
  const tip = drive(t, DT, { throttle: 1 });
  ok(t.gear === 'D' && same(gears(tip), ['D']), 'Ein Tipp auf Strom im Stand legt kein D ein');
  // Erlaubnis weg mitten in der Rückwärtsfahrt (Fahrtende, Autopilot): bremst bis zum Stand, dann D
  const a = car();
  drive(a, 4, { brake: 1 });
  const sA = a.s;
  const ra = drive(a, 3, { brake: 0.5 }, {});
  ok(a.gear === 'D' && ra.trace.every((q) => q.v <= 1e-9 || q.gear === 'D') && a.s <= sA, 'Ohne Erlaubnis fährt R weiter oder springt vorwärts');
  ok(ra.trace.findIndex((q) => q.gear === 'D') <= Math.ceil(1 / DT), 'Ohne Erlaubnis steht R nicht binnen einer Sekunde');
}

{
  // Lenken rückwärts: links gelenkt geht das Heck nach links (x fällt), die Nase dreht nach rechts
  const f = car({ speed: 4.2 });
  f.x = 1.875;
  const fw = drive(f, 1.5, { steer: -1, throttle: 0.1 });
  const r = car();
  r.x = 1.875;
  drive(r, 0.5 + 3, { brake: 1 });
  const x0 = r.x;
  const rw = drive(r, 1.5, { steer: -1, brake: 1 });
  ok(r.x < x0 - 0.05, `Links gelenkt geht das Heck nicht nach links (${(r.x - x0).toFixed(2)} m)`);
  const yF = fw.trace[fw.trace.length - 1].yaw;
  const yR = rw.trace[rw.trace.length - 1].yaw;
  ok(Math.sign(yF) === -Math.sign(yR) && yF !== 0, `Rückwärts dreht die Nase wie vorwärts (${yF.toFixed(3)} / ${yR.toFixed(3)})`);
}

{
  // die Grenze: höchstens REVERSE.back hinter den weitesten Punkt, weich, eine Meldung
  const p = car({ s: 5000 });
  const r = drive(p, 90, { brake: 1 });
  const floor = 5000 - REVERSE.back;
  ok(Math.min(...r.trace.map((q) => q.s)) >= floor - 1e-6, `Der Wagen fährt hinter die Grenze (${Math.min(...r.trace.map((q) => q.s)).toFixed(2)})`);
  ok(Math.abs(p.s - floor) < 0.5 && p.speed === 0, `Er steht nicht an der Grenze (${(p.s - floor).toFixed(2)} m davor)`);
  ok(r.ev.filter((e) => e.type === 'reverseEnd').length === 1, 'Die Grenze wird nicht genau einmal gemeldet');
  let brake = 0;
  for (let i = 1; i < r.trace.length; i++) brake = Math.max(brake, (r.trace[i - 1].speed - r.trace[i].speed) / DT);
  ok(brake <= 2.5, `Vor der Grenze bremst er hart (${brake.toFixed(2)} m/s²)`);
  // vorwärts und wieder zurück: die Grenze bleibt hinter dem weitesten Punkt (nicht je Einlegen neu)
  drive(p, 3, { throttle: 0.4 });
  drive(p, 60, { brake: 1 });
  ok(p.s >= floor - 1e-6, 'Zweimal R hintereinander fährt weiter zurück als die Grenze');
  // die Welt setzt die Grenze (Anfang des Abschnitts der Reise bzw. der Strecke)
  const w = car({ s: 800, back: 760 });
  drive(w, 60, { brake: 1 });
  ok(Math.abs(w.s - 760) < 0.5 && w.s >= 760, `limits.back hält nicht (${w.s.toFixed(2)})`);
  const z = car({ s: 120, back: 0 });
  drive(z, 80, { brake: 1 });
  ok(z.s >= 0, 'Der Wagen fährt hinter den Start der Strecke');
}

// --- 2. Das Spiel ----------------------------------------------------------------------------------------------------
// (Die Fahrt steht dabei am Start in Erlensee: Hier geht es um die Regeln des Spiels an der Stelle p.s der Straße; was
// die Fahrt zählt, prüft 3.)
const NONE = [];
const loose = (base = {}) => new Proxy(base, { get: (t, k) => (k in t ? t[k] : () => undefined) });
/** Ein Stream mit Mitspielern, die mitschreiben (Aufrufe an ui und fx landen in log). */
function stream(seed = 11) {
  Math.random = mulberry32(seed);
  const log = [];
  let game = null;
  const rec = (who) => new Proxy({}, { get: (t, k) => (typeof k === 'string' ? (...args) => log.push({ who, call: k, args, s: game ? game.player.s : 0 }) : undefined) });
  let ids = 0;
  const trip = new Trip({ rng: Math.random });
  game = new Game({
    traffic: loose({ cars: NONE, update: () => NONE, nearby: () => NONE, police: () => null, megafon: () => 0 }),
    scenery: loose({ request: () => ++ids, landmarkSpot: (s) => s, placed: () => null }),
    road: loose(),
    sky: loose(),
    rain: loose(),
    windshield: loose({ firmware: 0, manual: () => 'wipe' }),
    cockpit: loose({ nomi: loose() }),
    audio: rec('audio'),
    speech: loose({ say: () => 2.5, busy: false, queue: NONE, current: null }),
    ui: rec('ui'),
    fx: rec('fx'),
    pickups: loose({ update: () => NONE }),
    world: { trip: () => trip, stopping: () => false, release: () => {}, square: () => null, town: () => null },
  });
  game.start({ upgrades: {}, best: {} });
  game.money = 100;
  return { game, log, p: game.player };
}
/** sec Sekunden Spiel mit diesen Eingaben (reverse: die Erlaubnis aus main.js). */
function play(g, sec, input, each) {
  const ctl = { steer: 0, throttle: 0, brake: 0, kappa: 0, grade: 0, horn: false, wiper: false, megafon: false, reverse: true, ...input };
  const n = Math.round(sec / DT);
  for (let i = 0; i < n && !g.game.over; i++) {
    g.p.battery = 100;
    g.game.update(DT, ctl, null);
    if (each) each(g);
  }
}
/** Bremsen bis zum Stand, R einlegen und rückwärts fahren, bis sec vorbei sind. */
function back(g, sec, each) {
  play(g, sec, { brake: 1 }, each);
}

{
  // Rempler rückwärts gegen ein stehendes Auto: zählt wie jeder Rempler, und der Wagen bleibt davor stehen
  const g = stream(31);
  const { game, p } = g;
  play(g, 20, { throttle: 1 });
  for (let i = 0; i < 600 && p.speed > 0.3; i++) play(g, DT, { brake: 1 });
  back(g, 4);
  ok(p.gear === 'R' && p.speed > 1, 'Kein R für den Rempler');
  const car = { s: p.s - (4.7 + p.len) / 2 + 0.3, len: 4.7, speed: 0, x: p.x };
  const crashes = game.stats.crashes;
  const hits = p.hits;
  const update = game.traffic.update;
  game.traffic.update = () => [{ type: 'crash', car, ds: car.s - p.s, dx: 0, latOverlap: 1.8, lonOverlap: 0.3 }];
  play(g, DT, { brake: 1 });
  game.traffic.update = update;
  ok(game.stats.crashes === crashes + 1 && p.hits === hits + 1, `Der Rempler rückwärts zählt nicht (${game.stats.crashes - crashes}, ${p.hits - hits})`);
  ok(p.speed === 0 && Math.abs(p.s - (car.s + (car.len + p.len) / 2 + 0.35)) < 1e-9, 'Nach dem Rempler steht der Wagen nicht vor dem anderen');
}

{
  // Blitzer: rückwärts vorbei und wieder vor – kein zweiter Blitz, kein zweites Lob, kein zweites Foto
  for (const fast of [false, true]) {
    const g = stream(23);
    const { game, p } = g;
    play(g, 5, { throttle: 0.5 });
    game.S.blitzer = p.s + 10;
    const kmh = fast ? 150 : 100;
    let i = 0;
    while (!(game.blitzer && game.blitzer.checked) && i++ < 4000) {
      p.speed = kmh / 3.6;
      play(g, DT, {});
    }
    const b = game.blitzer;
    ok(b && b.checked, 'Kein Blitzer erreicht');
    const praise = () => g.log.filter((e) => e.call === 'toast' && /geblitzt/.test(e.args[0])).length;
    const n0 = { flash: g.log.filter((e) => e.who === 'fx' && e.call === 'flash').length, photo: game.stats.photos, clean: game.stats.blitzerClean, toast: praise() };
    // anhalten, rückwärts hinter den Blitzer, wieder vor bis hinter seine Zone
    back(g, 60);
    ok(p.s < b.camS - 50, `Rückwärts nicht hinter den Blitzer gekommen (${(p.s - b.camS).toFixed(0)} m)`);
    play(g, 3, { throttle: 1 });
    i = 0;
    while (p.s < b.endS + 60 && i++ < 4000) {
      p.speed = kmh / 3.6;
      play(g, DT, {});
    }
    const n1 = { flash: g.log.filter((e) => e.who === 'fx' && e.call === 'flash').length, photo: game.stats.photos, clean: game.stats.blitzerClean, toast: praise() };
    ok(same(n0, n1) && n1.photo === (fast ? 1 : 0) && n1.clean === (fast ? 0 : 1), `Blitzer ${kmh} km/h: zurück und wieder vor ändert ${JSON.stringify(n0)} → ${JSON.stringify(n1)}`);
  }
}

{
  // während der Halt am Brunnen läuft (halt) oder BrunnenTV (tv): kein R, auch wenn der Spieler die Bremse hält
  for (const key of ['halt', 'tv']) {
    const g = stream(41);
    const { game, p } = g;
    play(g, 2, { throttle: 1 });
    play(g, 8, { brake: 1 });
    game.money = 100;
    const g2 = stream(41);
    play(g2, 2, { throttle: 1 });
    g2.game[key] = key === 'halt' ? { sec: null, still: 0 } : { n: 1, place: 0, t0: g2.game.t, until: g2.game.t + 999, busy: true };
    if (key === 'halt') g2.game.navi.stopping = false;
    let r = false;
    const n = Math.round(6 / DT);
    for (let i = 0; i < n; i++) {
      g2.p.battery = 100;
      g2.p.update(DT, { steer: 0, throttle: 0, brake: 1 }, { reverse: true && !g2.game.halt && !g2.game.tv });
      if (g2.p.gear === 'R') r = true;
    }
    ok(!r, `R während ${key}`);
    ok(p.gear === 'R', 'Im normalen Spiel legt die gehaltene Bremse kein R ein');
  }
}

{
  // wer nie rückwärts fährt, fährt genau wie vorher: derselbe Stream mit und ohne Erlaubnis, mit Bremsen bis zum Stand
  // (nie länger als 0,4 s), stimmt in Kasse, Abrechnung, Statistik, Zuschauern, Zeit, Strecke und Aufträgen überein
  const run = (reverse) => {
    const g = stream(57);
    // bremsen bis zum Stand und dann loslassen: die Bremse steht nie eine halbe Sekunde im Stand
    const script = (t, p) => (t % 30 < 22 ? { throttle: 1 } : t % 30 < 29.6 ? { brake: p.speed > 0.3 ? 1 : 0 } : {});
    let t = 0;
    for (let i = 0; i < Math.round(240 / DT) && !g.game.over; i++) {
      g.p.battery = 100;
      g.game.update(DT, { steer: Math.sin(t / 3) > 0.9 ? 1 : 0, kappa: 0, grade: 0, horn: false, wiper: false, megafon: false, ...script(t, g.p), reverse }, null);
      t += DT;
    }
    const G = g.game;
    return JSON.stringify([G.money, G.breakdown, G.stats, G.viewers, G.t, g.p.s, g.p.x, G.jobs.map((j) => [j.id, j.done])]);
  };
  const a = run(false);
  const b = run(true);
  ok(a === b, 'Ein Stream ohne Rückwärtsfahrt ändert sich mit der Erlaubnis');
}

// --- 3. Die Reise über die echte Karte -------------------------------------------------------------------------------
{
  Math.random = mulberry32(5);
  const trip = new Trip({ rng: Math.random });
  const arrival = new Arrival();
  arrival.hold = true;
  const nav = new NavModel(trip);
  let ids = 0;
  const game = new Game({
    traffic: loose({ cars: NONE, update: () => NONE, nearby: () => NONE, police: () => null, megafon: () => 0 }),
    scenery: loose({ request: () => ++ids, landmarkSpot: (s) => s, placed: () => null }),
    road: loose(),
    sky: loose(),
    rain: loose(),
    windshield: loose({ firmware: 0, manual: () => 'wipe' }),
    cockpit: loose({ nomi: loose() }),
    audio: loose(),
    speech: loose({ say: () => 2.5, busy: false, queue: NONE, current: null }),
    ui: loose(),
    fx: loose(),
    pickups: loose({ update: () => NONE }),
    world: { trip: () => trip, stopping: () => !!arrival.pending, release: () => arrival.reset(), square: () => null, town: () => null },
  });
  game.start({ upgrades: {}, best: {} });
  const p = game.player;
  p.s = trip.s;
  p.x = trip.x;
  p.speed = 40 / 3.6;
  const lim = { left: 0, right: 0, shoulder: 0, lanes: null, extraLane: null, vmax: Infinity, decel: 0, slack: 0, closing: 0 };
  const seen = new Map(); // Ereignis + Abschnitt → wie oft
  let dup = [];
  let kmDown = 0;
  let clockDown = 0;
  let floorHit = 0;
  let statR = 0; // Bilder in R, in denen eine Strecke der Statistik wuchs
  let secR = null; // Abschnitt, in dem R eingelegt wurde
  const step = (input) => {
    limitsFor(trip, lim, arrival.stop(trip));
    p.setLimits(lim);
    const want = trip.section.kind === 'ab' ? 5.625 : 9;
    const dx = want - (p.x + p.vx * AUTO.look);
    const ctl = { steer: Math.abs(dx) > AUTO.tol ? Math.max(-1, Math.min(1, dx * AUTO.gain)) : 0, throttle: 0, brake: 0, kappa: 0, grade: 0, horn: false, wiper: false, megafon: false, reverse: true, ...input };
    if (ctl.throttle === 'auto') ctl.throttle = p.gear === 'D' && p.speed < Math.min(lim.vmax, 100 / 3.6) - 0.5 ? 1 : 0;
    const km0 = trip.km;
    const c0 = game.clock;
    const st = game.stats;
    const st0 = [st.distance, st.cleanDistance, st.rainDistance, st.leftLaneTime];
    game.update(DT, ctl, null);
    if (p.gear === 'R' && [st.distance, st.cleanDistance, st.rainDistance, st.leftLaneTime].some((v, i) => v > st0[i])) statR++;
    p.battery = 100;
    const evs = trip.update(p.s, p.x);
    for (const e of evs) {
      const key = e.type + ':' + (e.sec ? e.sec.s0 : e.fork ? e.fork.s : '') + ':' + (e.place ?? '');
      seen.set(key, (seen.get(key) || 0) + 1);
      if (seen.get(key) > 1) dup.push(key);
      game.onTrip(e);
    }
    const rest = arrival.update(trip, evs, p.speed);
    if (rest) game.onTrip(rest);
    if (game.tv) game.endBrunnenTV();
    nav.update(DT);
    if (trip.km < km0 - 1e-12) kmDown++;
    if (game.clock < c0 - 1e-12) clockDown++;
    // in R bleibt der Wagen in dem Abschnitt, in dem er R eingelegt hat
    if (p.gear !== 'R') secR = null;
    else if (!secR) secR = trip.section;
    else if (trip.section !== secR) floorHit++;
  };
  // vorwärts, dann an vielen Stellen anhalten, zurück bis an die Grenze, wieder vor: nichts darf doppelt kommen
  let rounds = 0;
  let farthestBack = 0;
  let sectionStops = 0;
  for (let leg = 0; leg < 14; leg++) {
    const go = 20 + ((leg * 37) % 50);
    for (let i = 0; i < Math.round(go / DT); i++) step({ throttle: 'auto' });
    for (let i = 0; i < Math.round(6 / DT) && p.speed > 0.05; i++) step({ brake: 1 });
    const s0 = p.s;
    let kmBefore = null;
    for (let i = 0; i < Math.round(90 / DT); i++) {
      step({ brake: 1 });
      if (p.gear === 'R' && kmBefore === null) kmBefore = trip.km;
    }
    if (p.gear === 'R') rounds++;
    farthestBack = Math.max(farthestBack, s0 - p.s);
    if (Math.abs(p.s - lim.back) < 0.5) sectionStops++;
    ok(trip.km === kmBefore, `Rückwärts ändern sich die Reisekilometer (${kmBefore} → ${trip.km})`);
    for (let i = 0; i < Math.round(4 / DT); i++) step({ throttle: 1 });
  }
  ok(rounds === 14, `Auf der Reise legte die gehaltene Bremse nur ${rounds} von 14 Mal R ein`);
  ok(farthestBack > 150 && farthestBack <= REVERSE.back + 1e-6, `Reise: zurück höchstens ${farthestBack.toFixed(0)} m`);
  ok(kmDown === 0 && clockDown === 0, `Reise: Kilometer (${kmDown}) oder Uhr (${clockDown}) laufen rückwärts`);
  ok(statR === 0, `Reise: Rückwärts zählt eine Strecke der Statistik (${statR} Bilder)`);
  ok(floorHit === 0, 'Reise: Der Wagen fährt über den Anfang seines Abschnitts zurück');
  ok(dup.length === 0, `Reise: Ereignisse kommen doppelt: ${[...new Set(dup)].slice(0, 6).join(', ')}`);
  console.log(`  Reise: 14 Mal zurück (weitester Weg ${farthestBack.toFixed(0)} m, ${sectionStops}× am Anfang des Abschnitts), ${seen.size} Ereignisse je einmal, ${trip.km.toFixed(1)} Reisekilometer`);
}

if (fails) {
  console.error(`rueckwaerts-test: ${fails} von ${checks} Prüfungen fehlgeschlagen`);
  process.exit(1);
}
console.log(`rueckwaerts-test: ok (${checks} Prüfungen: R nur vom Spieler im Stand, höchstens ${(REVERSE.vmax * 3.6).toFixed(0)} km/h, D mit Strom, Grenze hält, nichts zählt doppelt)`);
