// Testlauf 4 (die Probefahrt des Besitzers vom 21.11.2026 abends), ohne Grafik: node tools/testlauf4-test.mjs
// 2. „Kein ‚Schöner Brunnen‘ bei BrunnenTV (auch mit Taste B)“: In jeder Folge – am Ziel und unterwegs – ruft Mini Adam
//    „Schöner Brunnen!“ genau zu seiner Zeit (TV.call) mit seiner tiefen Stimme, ganz und hörbar, und der Untertitel
//    »SCHÖÖÖÖÖÖÖNER BRUNNEN!!!!!« steht in dieser Zeit oben; der Chat ruft es nach. Geprüft mit der echten Sprachausgabe
//    (speech.js) über einer nachgebauten Web-Speech-API in Spielzeit: Stimmen 35 % langsamer als geschätzt, ein
//    speak() gleich nach cancel() geht verloren (wie in Chrome), dazu eine laufende Sprachdurchsage und ein langer Satz
//    OMIs vor der Folge und ein anderer Untertitel mitten im Ruf – und mit dem echten Untertitel-Stapel (ui.js).
// 1. „An der Tanke in der Stadt kann nicht geladen werden“: Ein Mensch am Steuer (kein braver Autopilot) fährt den echten
//    Stream von Erlensee nach Hanau und hält an der Ladesäule des Orts – mit Plan (Taste L) neben der Bucht, ohne Plan
//    neben der Bucht und ohne Plan ein Stück dahinter; jedes Mal beginnt der Ladestopp (dieselbe Szene wie im Park), der
//    Akku ist danach voll, und es geht weiter zum Brunnen. Der Weg der Szene rollt dafür ohne Sprung erst vor bis an den
//    Haltepunkt und setzt dann rückwärts in die Bucht (charge.js stopPlan, creepPath).
import { PerspectiveCamera } from 'three';
import { Trip, J } from '../src/game/trip.js';
import { findPlace } from '../src/map/graph.js';
import { Arrival, limitsFor, AUTO, POST_ZONE } from '../src/world/xxl/plan.js';
import { Game } from '../src/game/game.js';
import { POST, postName } from '../src/map/parks.js';
import { stopPlan, dockHalt, CREEP, chargeOf } from '../src/world/xxl/charge.js';
import { mulberry32, makeStream, DRIVERS } from './stream-sim.mjs';
import { Speech, estimateSpeech } from '../src/speech.js';
import { UI } from '../src/ui/ui.js';
import { TV } from '../src/world/xxl/brunnentv.js';
import { SCHOENER_BRUNNEN, VOICES } from '../src/data.js';
import { places } from '../src/map/graph.js';
import { readFileSync } from 'node:fs';

let fails = 0;
let checks = 0;
const kinds = new Map();
const ok = (cond, msg) => {
  checks++;
  if (cond) return;
  fails++;
  const k = msg.replace(/[-\d.,]+/g, '#');
  const n = (kinds.get(k) || 0) + 1;
  kinds.set(k, n);
  if (n <= 3) console.log('FEHLER: ' + msg);
};
const near = (a, b, e) => Math.abs(a - b) <= e;
const DT = 1 / 30;
const NONE = [];
const noop = () => {};
const loose = (base = {}) => new Proxy(base, { get: (t, k) => (k in t ? t[k] : noop) });

// --- 1. Ladesäule im Ort ---------------------------------------------------------------------------------------------
console.log('1. Ladesäule im Ort:');
/**
 * Ein Stream mit dem echten Spiel, der echten Fahrt und dem Halt der Welt (Arrival mit Spielzeit, wie world.js), am
 * Steuer ein Mensch: 130 km/h auf der Autobahn, 50 im Ort; im Ort Hanau bremst er ab u = brakeAt voll und bleibt stehen.
 * plan: mit Taste L (game.planStop) den Stopp an der Säule eingeplant. Ergebnis: wo er stand, wann und mit welchem
 * Fahrplan der Ladestopp begann, Akku danach, Ankunft am Brunnen.
 */
function postRun({ plan, brakeAt }) {
  Math.random = mulberry32(11);
  const trip = new Trip({ rng: Math.random });
  const arrival = new Arrival();
  arrival.hold = true;
  const camera = new PerspectiveCamera(60, 16 / 9, 0.1, 3000);
  let ids = 0;
  const game = new Game({
    traffic: loose({ cars: NONE, update: () => NONE, nearby: () => NONE, police: () => null, megafon: () => 0 }),
    scenery: loose({ request: () => ++ids, landmarkSpot: (s) => s, placed: () => null }),
    road: loose(), sky: loose(), rain: loose(), windshield: loose({ firmware: 0, manual: () => 'wipe' }),
    cockpit: loose({ nomi: loose() }), audio: loose(), speech: loose({ say: () => 2.5, busy: false, queue: NONE, current: null }),
    ui: loose(), fx: loose(), pickups: loose({ update: () => NONE }),
    world: { trip: () => trip, stopping: () => !!arrival.pending, release: () => arrival.release(), square: () => null, town: () => null, hold: (sec) => (arrival.held = { s: trip.s + 0.3, sec, place: sec.place, park: -1 }) },
  });
  game.start({ upgrades: {}, best: {} });
  const town = findPlace('Hanau');
  trip.setTarget(town);
  const p = game.player;
  p.s = trip.s;
  p.x = trip.x;
  p.speed = 40 / 3.6;
  p.battery = 30;
  const lim = { left: 0, right: 0, shoulder: 0, lanes: null, extraLane: null, vmax: Infinity, decel: 0, slack: 0, closing: 0 };
  const ctl = { steer: 0, throttle: 0, brake: 0, kappa: 0, grade: 0, horn: false, wiper: false, megafon: false };
  const out = { planned: null, stood: null, charge: null, plan: null, battery: null, charges: 0, rest: null, held: false };
  let braked = false;
  for (let i = 0; i < 700 / DT; i++) {
    game.T.bid = Math.max(game.T.bid, 60);
    if (plan && !out.planned && game.t > 1.5) {
      game.planStop();
      out.planned = { post: trip.post, stop: trip.stop };
    }
    limitsFor(trip, lim, arrival.stop(trip));
    p.setLimits(lim);
    const sec = trip.section;
    let want = J.L0;
    if (sec.kind === 'ab') {
      const f = sec.fork;
      want = 5.625;
      if (f && !f.taken && f.s - trip.s < J.decel - 10 && (f.forced || trip.planFor(f) === 'exit')) want = J.L0;
    }
    const dx = want - (p.x + p.vx * AUTO.look);
    ctl.steer = Math.abs(dx) > AUTO.tol ? Math.max(-1, Math.min(1, dx * AUTO.gain)) : 0;
    const u = sec.kind === 'stadt' && sec.place === town ? p.s - sec.s0 : -1;
    const v = sec.kind === 'stadt' ? 50 / 3.6 : sec.kind === 'ab' ? 130 / 3.6 : 90 / 3.6;
    // bremst einmal bis zum Stand und wartet dort (ohne Gas), bis der Ladestopp vorbei ist; dann fährt er weiter
    const braking = !braked && u >= brakeAt && u < 300;
    if (braking && p.speed < 0.05 && out.stood && game.t - out.stood.t > 3) braked = true;
    ctl.throttle = game.charging || braking ? 0 : p.speed < v - 0.5 ? 1 : 0;
    ctl.brake = braking && p.speed > 0.02 ? 1 : p.speed > v + 3 ? 0.4 : 0;
    if (braking && p.speed < 0.15 && !out.stood) out.stood = { u: +u.toFixed(2), t: game.t };
    const was = !!game.charging;
    game.offAutobahn = trip.section.kind !== 'ab';
    game.update(DT, ctl, camera);
    if (was && !game.charging) {
      out.battery = p.battery;
      out.charges = game.stats.parkCharges;
    }
    const evs = trip.update(p.s, p.x);
    for (const ev of evs) game.onTrip(ev);
    const rest = arrival.update(trip, evs, p.speed, game.t);
    if (rest && rest.type === 'charge') {
      out.charge = { u: +(p.s - rest.sec.s0).toFixed(2), name: rest.name, post: rest.post, park: rest.park, dt: +(game.t - (out.stood ? out.stood.t : game.t)).toFixed(2) };
      game.onTrip(rest);
      const c = game.charging;
      out.plan = c ? c.plan : null;
      out.held = !!arrival.held;
    }
    if (rest && rest.type === 'rest') {
      out.rest = { place: rest.place, u: +(p.s - rest.sec.s0).toFixed(1) };
      break;
    }
  }
  out.town = town;
  return out;
}
const runs = {
  'mit Plan, neben der Bucht': postRun({ plan: true, brakeAt: 60 }),
  'ohne Plan, neben der Bucht': postRun({ plan: false, brakeAt: 60 }),
  'ohne Plan, an der Säule': postRun({ plan: false, brakeAt: 52 }),
  'ohne Plan, hinter der Bucht': postRun({ plan: false, brakeAt: 78 }),
};
for (const [name, R] of Object.entries(runs)) {
  const s = R.stood;
  ok(s && s.u >= POST.u - POST_ZONE.back && s.u <= POST.halt + POST_ZONE.ahead, `${name}: stand bei ${s ? s.u : '–'} m außerhalb der Zone der Säule`);
  ok(R.charge && R.charge.post === R.town && R.charge.park === -1 && R.charge.name === postName(R.town) && near(R.charge.dt, POST_ZONE.still, 0.2) && R.held, `${name}: Ladestopp ${JSON.stringify(R.charge)} (gehalten ${R.held})`);
  ok(R.battery === 100 && R.charges === 1, `${name}: nach dem Stopp Akku ${R.battery}, ${R.charges} Ladestopps`);
  ok(R.rest && R.rest.place === R.town, `${name}: danach am Brunnen ${JSON.stringify(R.rest)}`);
  if (R.plan && R.charge) {
    const P = R.plan;
    const h = dockHalt(P.u);
    // vorrollen nur vor dem Haltepunkt; ohne Sprung vom Stand über das Vorrollen in den Weg rückwärts
    const before = R.charge.u < h - CREEP.min;
    ok(!!P.creep === before && P.c === (P.creep ? P.creep.T : 0), `${name}: Vorrollen ${!!P.creep} bei u ${R.charge.u} (Halt ${h.toFixed(2)})`);
    const q0 = (P.creep || P.dock).pose(0, {});
    ok(near(q0.u, R.charge.u, 0.006) && near(q0.x, 9, 0.4) && q0.v === 0, `${name}: Szene beginnt bei u ${q0.u.toFixed(3)} statt ${R.charge.u}`);
    if (P.creep) {
      const e = P.creep.pose(P.creep.T, {});
      const d = P.dock.pose(0, {});
      ok(near(e.u, h, 1e-6) && near(e.u, d.u, 1e-6) && near(e.x, d.x, 1e-6) && e.v === 0 && d.v === 0, `${name}: Übergang vorrollen → rückwärts ${e.u.toFixed(3)}/${d.u.toFixed(3)}`);
      let back = 0;
      let vmax = 0;
      let last = q0.u;
      for (let t = 0; t <= P.creep.T; t += 0.02) {
        const q = P.creep.pose(t, {});
        if (q.u < last - 1e-9) back++;
        last = q.u;
        vmax = Math.max(vmax, q.v);
      }
      ok(back === 0 && vmax <= CREEP.v + 1e-6, `${name}: Vorrollen ${back}× rückwärts, Spitze ${vmax.toFixed(2)} m/s`);
    }
  }
}
// Fahrplan: dieselben Zeiten wie im Park, nur um das Vorrollen später
{
  const R = runs['ohne Plan, neben der Bucht'];
  const sec = { s0: 0, kind: 'stadt', place: R.town };
  const a = stopPlan(sec, dockHalt(chargeOf(sec).u), 9);
  const b = stopPlan(sec, 64, 9);
  ok(!a.creep && a.c === 0 && b.creep && near(b.d0 - b.c, a.d0, 1e-9) && near(b.end - b.c, a.end, 1e-9), `Fahrplan mit Vorrollen: d0 ${b.d0.toFixed(2)} (ohne ${a.d0.toFixed(2)}, Vorrollen ${b.c.toFixed(2)} s)`);
}
console.log(`  ${Object.entries(runs).map(([n, R]) => `${n}: stand bei u ${R.stood && R.stood.u} m, Stopp nach ${R.charge && R.charge.dt} s${R.plan && R.plan.creep ? `, rollt ${(dockHalt(R.plan.u) - R.charge.u).toFixed(1)} m vor (${R.plan.c.toFixed(1)} s)` : ''}`).join(' · ')}`);

// --- 2. „Schöner Brunnen!“ in jeder Folge ------------------------------------------------------------------------
console.log('2. Schöner Brunnen in jeder Folge:');
{
  // Uhr der Seite in Spielzeit: setTimeout, clearTimeout und Date.now laufen mit den Schritten des Streams
  const clock = { t: 1000, timers: [], id: 0 };
  const saved = { setTimeout: globalThis.setTimeout, clearTimeout: globalThis.clearTimeout, now: Date.now, window: globalThis.window, utt: globalThis.SpeechSynthesisUtterance };
  globalThis.setTimeout = (fn, ms = 0) => {
    const id = ++clock.id;
    clock.timers.push({ id, at: clock.t + ms / 1000, fn });
    return id;
  };
  globalThis.clearTimeout = (id) => {
    clock.timers = clock.timers.filter((x) => x.id !== id);
  };
  Date.now = () => Math.round(clock.t * 1000);
  const runTimers = () => {
    for (let guard = 0; guard < 1000; guard++) {
      let k = -1;
      for (let i = 0; i < clock.timers.length; i++) if (clock.timers[i].at <= clock.t + 1e-9 && (k < 0 || clock.timers[i].at < clock.timers[k].at)) k = i;
      if (k < 0) return;
      const [x] = clock.timers.splice(k, 1);
      x.fn();
    }
  };
  // die Web-Speech-API des Browsers: eine Stimme spricht 35 % langsamer als geschätzt; speak() im selben Augenblick wie
  // cancel() verschluckt sie (Chrome), cancel() meldet dem laufenden Satz einen Fehler
  const SLOW = 1.35;
  const voices = [{ name: 'Microsoft Katja - German (Germany)', lang: 'de-DE' }, { name: 'Microsoft Stefan - German (Germany)', lang: 'de-DE' }, { name: 'Google Deutsch', lang: 'de-DE' }];
  const engine = {
    speaking: null,
    log: [],
    lastCancel: -1,
    getVoices: () => voices,
    pause() {},
    resume() {},
    speak(u) {
      if (clock.t - this.lastCancel < 0.001) {
        this.log.push({ text: u.text, lost: true, start: clock.t });
        return;
      }
      const e = { u, text: u.text, start: clock.t, end: clock.t + estimateSpeech(u.text, u.rate) * SLOW, pitch: u.pitch, voice: u.voice ? u.voice.name : null };
      this.speaking = e;
      this.log.push(e);
      clock.timers.push({ id: ++clock.id, at: e.end, fn: () => {
        if (this.speaking !== e) return;
        this.speaking = null;
        e.done = true;
        if (u.onend) u.onend();
      } });
    },
    cancel() {
      this.lastCancel = clock.t;
      const e = this.speaking;
      if (!e) return;
      e.cut = clock.t;
      this.speaking = null;
      if (e.u.onerror) e.u.onerror({ error: 'interrupted' });
    },
  };
  globalThis.window = { speechSynthesis: engine };
  globalThis.SpeechSynthesisUtterance = class {
    constructor(text) {
      this.text = text;
    }
  };
  // der Untertitel-Stapel von ui.js an einem Streifen ohne DOM (wie ui.update: Zeit abziehen, Abgelaufene weg, zeigen)
  const cls = { toggle() {}, add() {}, remove() {} };
  const sub = { lines: [], line: null, subEl: { classList: cls, className: '' }, subLabel: { textContent: '' }, subText: { textContent: '' } };
  for (const m of ['speak', 'showLine', 'megafon', 'nomi', 'studio', 'adam', 'durchsage']) sub[m] = UI.prototype[m];
  const subTick = (dt) => {
    for (const l of sub.lines) l.t -= dt;
    sub.lines = sub.lines.filter((l) => l.t > 0);
    sub.showLine();
  };
  const uiSrc = readFileSync(new URL('../src/ui/ui.js', import.meta.url), 'utf8');
  ok(/for \(const l of this\.lines\) l\.t -= dt;\s*this\.lines = this\.lines\.filter\(\(l\) => l\.t > 0\);\s*this\.showLine\(\);/.test(uiSrc), 'ui.js update: der Untertitel-Stapel läuft anders als hier nachgebaut');

  const S = makeStream({ driver: DRIVERS.zuegig, seed: 3, endless: true });
  const g = S.game;
  const speech = new Speech();
  ok(speech.supported && speech.voices.length === 3, `Sprachausgabe nicht erkannt (${speech.voices.length} Stimmen)`);
  g.speech = speech;
  for (const m of ['megafon', 'nomi', 'studio', 'durchsage', 'adam']) g.ui[m] = (...a) => sub[m](...a);
  const offset = clock.t - g.t;
  const episodes = [];
  let last = null;
  let injected = null;
  let wayDone = false;
  const at = (ep, dt) => ep.marks.find((m) => m.dt === dt);
  // bis drei Folgen am Ziel aufgezeichnet sind und die letzte ganz vorbei ist
  const done = () => episodes.filter((e) => !e.way).length >= 3 && g.t > episodes[episodes.length - 1].t0 + TV.end + 1;
  for (let i = 0; i < 1500 * 30 && !done(); i++) {
    // vor der Ankunft am Brunnen: eine Sprachdurchsage läuft noch, OMI hat einen langen Satz in der Schlange
    if (g.halt && injected !== g.halt) {
      injected = g.halt;
      speech.say('Hallo Mini Adam, hier ist eine sehr lange Sprachdurchsage aus dem Chat, die gar nicht mehr aufhören will!', 'karla');
      g.say('Gleich sind wir da. Ich habe die Wasserqualität des Brunnens schon einmal vorsorglich geprüft und für sehr gut befunden.', 'talk');
    }
    // unterwegs (Taste B): eine Folge ohne Ziel, eine Minute nach der ersten am Ziel, während OMI noch spricht
    if (!wayDone && !g.tv && episodes.length === 1 && g.t > episodes[0].t0 + 60) {
      wayDone = true;
      const sec = S.trip.section;
      const place = places.findIndex((q) => q.name === 'Erlensee');
      g.say('Unterwegs ist es auch schön. Ich mache schon einmal die Kamera warm für die nächste Folge.', 'talk');
      g.startBrunnenTV({ place, name: 'Erlensee', goal: 'Erlensee' }, sec, { way: true });
    }
    S.step(1 / 30);
    clock.t += 1 / 30;
    runTimers();
    subTick(1 / 30);
    if (g.tv && g.tv !== last) {
      last = g.tv;
      episodes.push({ way: !!g.tv.way, t0: g.tv.t0, n: g.tv.n, marks: [], other: false });
    }
    const ep = episodes[episodes.length - 1];
    if (ep && g.tv && g.tv === last) {
      const dt = g.t - ep.t0;
      // mitten im Ruf kommt ein anderer Untertitel dazu (er wartet, bis der Ruf abgelaufen ist)
      if (!ep.other && dt >= TV.call + 0.5) {
        ep.other = true;
        sub.nomi('Ein anderer Satz, der den Ruf nicht verdecken darf.', 4);
      }
      for (const m of [0.1, 1.0, 2.0]) {
        if (dt >= TV.call + m && !at(ep, m)) ep.marks.push({ dt: m, text: sub.subText.textContent, label: sub.subLabel.textContent });
      }
    }
  }
  ok(episodes.length >= 4 && episodes.some((e) => e.way), `nur ${episodes.length} Folgen (${episodes.filter((e) => e.way).length} unterwegs)`);
  for (const ep of episodes) {
    const name = `Folge ${ep.n}${ep.way ? ' (unterwegs)' : ''}`;
    const t0 = ep.t0 + offset;
    const call = engine.log.filter((e) => e.text === SCHOENER_BRUNNEN.say && e.start >= t0 && e.start < t0 + TV.end);
    const lost = engine.log.filter((e) => e.lost && e.start >= t0 - 8 && e.start < t0 + TV.end);
    const c = call[0];
    ok(call.length === 1 && c && !c.lost && !c.cut && c.done && c.start - t0 >= TV.call - 1e-6 && c.start - t0 <= TV.call + 0.3, `${name}: Ruf ${c ? `ab ${(c.start - t0).toFixed(2)} s${c.cut ? ', abgebrochen' : ''}${c.done ? '' : ', nicht zu Ende'}` : 'nie gesprochen'} (soll ${TV.call} s)`);
    ok(c && /Stefan/.test(c.voice) && c.pitch === VOICES.brunnen.pitch, `${name}: Ruf mit ${c && c.voice}, Tonhöhe ${c && c.pitch}`);
    ok(!lost.length, `${name}: ${lost.length} Sätze verschluckt (${lost.map((e) => e.text.slice(0, 30)).join(' | ')})`);
    for (const m of [0.1, 1.0, 2.0]) {
      const k = at(ep, m);
      ok(k && k.text === '»' + SCHOENER_BRUNNEN.text + '«', `${name}: Untertitel ${m} s nach dem Ruf „${k && k.text}“`);
    }
    const echo = S.log.chat.filter((x) => x.text === SCHOENER_BRUNNEN.chat[0] && x.t >= ep.t0 + TV.call && x.t < ep.t0 + TV.call + 1.5);
    ok(echo.length === 1, `${name}: Chat ruft ${echo.length}× nach`);
  }
  // der Megafon-Wunsch (eine Aktion, 1 s nach dem Kauf gerufen) platzt nicht in eine Folge
  const gameSrc = readFileSync(new URL('../src/game/game.js', import.meta.url), 'utf8');
  ok(/this\.later\(1, \(\) => \{\s*\/\/[^\n]*\n\s*if \(this\.tv \|\| this\.charging\) return;\s*this\.audio\.megafon\(\);/.test(gameSrc), 'game.js: Megafon-Wunsch ohne Prüfung auf eine Szene');
  const sp = engine.log.filter((e) => e.text === SCHOENER_BRUNNEN.say);
  console.log(`  ${episodes.length} Folgen (${episodes.filter((e) => e.way).length} unterwegs): Ruf ab ${sp.map((e) => { const ep = episodes.find((q) => e.start >= q.t0 + offset && e.start < q.t0 + offset + TV.end); return ep ? (e.start - offset - ep.t0).toFixed(2) : '?'; }).join(', ')} s, je ganz gesprochen (${sp.map((e) => (e.end - e.start).toFixed(1)).join(', ')} s); Untertitel oben; ${engine.log.filter((e) => e.lost).length} Sätze verschluckt, ${engine.log.filter((e) => e.cut).length} abgebrochen`);
  Object.assign(globalThis, { setTimeout: saved.setTimeout, clearTimeout: saved.clearTimeout, window: saved.window, SpeechSynthesisUtterance: saved.utt });
  Date.now = saved.now;
}

if (fails) {
  console.log(`testlauf4-test: ${fails} FEHLER (${checks} Prüfungen)`);
  process.exit(1);
}
console.log(`testlauf4-test: alles gut (${checks} Prüfungen)`);
