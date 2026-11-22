// Testlauf 4 (die Probefahrt des Besitzers vom 21.11.2026 abends), ohne Grafik: node tools/testlauf4-test.mjs
// 9. „Der Spielstart benötigt viel Zeit beim Laden“: Am unteren Rand des Ladebilds wächst eine Ladeanzeige in zehn
//    Stufen, bis der Titel steht (fließend zeichnete sie das ganze Ladebild in jedem Takt neu und kostete das erste
//    Bild Sekunden); die Shader der Welt und der Facecam werden für ihr Render-Ziel übersetzt (sonst übersetzt das erste
//    Bild alles noch einmal), die Fahrzeugnetze entstehen erst nach dem ersten Titelbild, und die Marken ma:… messen
//    jeden Abschnitt (Laden, Übersetzen, Module, Aufbau, Welt, Shader, erstes Bild, Start einer Fahrt). Geprüft an
//    index.html, style.css, build.mjs und main.js.
// 8. „Gegenverkehr außerhalb der Autobahn“: Auf Orts- und Landstraßen kommen in der Gegenspur Autos entgegen
//    (world/xxl/gegenverkehr.js), im Ort 40–50 km/h, draußen 70–95 km/h, ab und zu ein Transporter; nie auf der
//    Autobahn, nie an einer Brunneninsel, höchstens GEGEN.max zugleich. Wer in seiner Spur bleibt, wird nie berührt;
//    wer in der Gegenspur steht, vor dem halten sie an, und wer hineinfährt, rempelt (ein Ereignis 'crash').
// 7. „Parkende Autos sollten kein aktives Rücklicht haben“: Die Spielzeugautos am Straßenrand und in den Parks
//    (kit/street.js toyCar) haben dunkle Rücklichter und graue Scheinwerfer; es leuchtet nur der fahrende Verkehr.
// 6. „Finger beim Winken ausstrecken“: Die winkende Hand ist offen – Handteller, vier gespreizte Finger und der Daumen
//    (Figur in Außenansicht und Facecam: adamSculpt.js armOpenL/R; Ich-Perspektive: hands.js openHandGeometry); sie
//    ersetzt den Fäustling nur beim Winken, beim Jubeln, mit Megafon oder Flasche bleibt die Faust. Geprüft an den
//    Netzen (Finger mit Lücken dazwischen, wo der Fäustling keine hat) und an der Umschaltung (miniAdam.js, cockpit.js).
// 5. Intro: „Wenn Mini Adam im Intro winkt, soll er ‚Partypeople‘ sagen (nicht ‚Hallo Partypeople‘)“ und (laden2, 21.11.
//    18:45 UTC) „Es sollte zuerst ‚Wir sind live‘ und danach ‚Partypeople‘ kommen“: Das Sprachstudio meldet den Stream,
//    dann sagt er „Partypeople!“ und winkt dabei (draußen in der Startszene, sonst in die Facecam), dann grüßt der Chat
//    zurück – je Stream genau einmal, in jedem Weg (ganze Szene, übersprungen, ohne Ladepark). Geprüft am Code aus
//    main.js (streamStart, Szene, Losfahren), ausgeführt mit einer Warteschlange wie speech.js und langsamen Stimmen.
// 4. „BrunnenTV macht die Zuschauer sehr glücklich“: Beim Ruf jeder Folge springt die Stimmung des Chats deutlich
//    (CHEER.brunnenTV), die Zuschauerzahl steigt sichtbar (oben links leuchtet sie, am Ende der Folge steht am Rand
//    „📈 BrunnenTV: +N Zuschauer“), die Zufriedenheit steigt (ZUFRIEDEN.tv), und der Chat feiert. Gemessen gegen
//    denselben Stream ohne diesen Schub (gleicher Zufall).
// 3. „Die Schäden werden nicht abgezogen“: Jeder Rempler kostet 150 €, jeder Kratzer 25 € – ganz, auch wenn die Kasse
//    dafür ins Minus geht, und auch über die drei gezeichneten Kratzer je Seite hinaus. Die Zeile der Runde am Rand hat
//    dafür eine eigene rote Zeile „Schäden −… € (N Rempler · M Kratzer)“, das Guthaben sinkt um genau so viel, und am
//    Ende bucht der Stream, was noch offen ist; die Abrechnung im Abspann führt „Schäden (N Rempler · M Kratzer)“ mit
//    dem Betrag, das Ergebnis des Streams steht mit Vorzeichen da (gerendert mit menus.js über einem kleinen DOM).
// 2. „Kein ‚Schöner Brunnen‘ bei BrunnenTV (auch mit Taste B)“: In jeder Folge – am Ziel und unterwegs – ruft Mini Adam
//    „Schöner Brunnen!“ genau zu seiner Zeit (TV.call) mit seiner tiefen Stimme, ganz und hörbar, und der Untertitel
//    »SCHÖÖÖÖÖÖÖNER BRUNNEN!!!!!« steht in dieser Zeit oben; der Chat ruft es nach. Geprüft mit der echten Sprachausgabe
//    (speech.js) über einer nachgebauten Web-Speech-API in Spielzeit: Stimmen 35 % langsamer als geschätzt, ein
//    speak() gleich nach cancel() geht verloren (wie in Chrome), dazu eine laufende Sprachdurchsage und ein langer Satz
//    OMIs vor der Folge und ein anderer Untertitel mitten im Ruf – und mit dem echten Untertitel-Stapel (ui.js).
// 1. „An der Tanke in der Stadt kann nicht geladen werden“: Ein Mensch am Steuer (kein braver Autopilot) fährt den echten
//    Stream von Erlensee nach Hanau und hält an der Ladesäule des Orts – mit Plan (Taste L) neben der Bucht, ohne Plan
//    neben der Bucht und ohne Plan ein Stück dahinter; mit Plan beginnt der Ladestopp von selbst, ohne Plan mit Taste L
//    (laden2: ein manuelles Triggern wie bei BrunnenTV mit B) – dieselbe Szene wie im Park, der Akku ist danach voll,
//    und es geht weiter zum Brunnen. Der Weg der Szene rollt dafür ohne Sprung erst vor bis an den
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
import { REPARATUR, CHAT, PARTYPEOPLE } from '../src/data.js';
import { SCENE } from '../src/world/xxl/charge.js';
import { buildAdamGeometry } from '../src/models/adamSculpt.js';
import { openHandGeometry, mittenGeometry } from '../src/cockpit/hands.js';
import { LAMP_OFF } from '../src/world/kit/street.js';
import { PAL } from '../src/world/kit/palette.js';
import { Gegenverkehr, GEGEN, twoWay, oncomingX } from '../src/world/xxl/gegenverkehr.js';
import { CAR_TYPES } from '../src/models/vehicles.js';
import { autoTarget, squareOf } from '../src/world/xxl/plan.js';
import { Group } from 'three';
import { CHEER } from '../src/game/economy.js';
import { ZUFRIEDEN } from '../src/game/satisfaction.js';
import { Menus } from '../src/ui/menus.js';

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
 * plan: mit Taste L (game.planStop) den Stopp an der Säule eingeplant; key: so viele Sekunden nach dem Halt drückt er
 * dort L (ohne Plan lädt nur L, laden2: „wie bei BrunnenTV mit B“). Ergebnis: wo er stand, wann und mit welchem
 * Fahrplan der Ladestopp begann, Akku danach, Ankunft am Brunnen.
 */
function postRun({ plan, brakeAt, key }) {
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
    cockpit: loose({ nomi: loose() }), audio: loose(), speech: loose({ say: (t, v, o) => (o && o.onStart && o.onStart(2.5), 2.5), busy: false, queue: NONE, current: null }),
    ui: loose(), fx: loose(), pickups: loose({ update: () => NONE }),
    world: { trip: () => trip, stopping: () => !!arrival.pending, release: () => arrival.release(), square: () => null, town: () => null, hold: (sec) => (arrival.held = { s: trip.s + 0.3, sec, place: sec.place, park: -1 }), chargeSpot: (v) => arrival.chargeSpot(trip, v), charge: (v) => arrival.charge(trip, v) },
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
    ctl.ladestopp = key !== undefined && !!out.stood && !out.pressed && game.t - out.stood.t >= key;
    if (ctl.ladestopp) out.pressed = game.t - out.stood.t;
    game.update(DT, ctl, camera);
    if (was && !game.charging) {
      out.battery = p.battery;
      out.charges = game.stats.parkCharges;
    }
    const evs = trip.update(p.s, p.x);
    for (const ev of evs) game.onTrip(ev);
    const rest = arrival.update(trip, evs, p.speed, game.t);
    if (rest && rest.type === 'charge') game.onTrip(rest);
    // (begonnen mit L oder von selbst an der geplanten Säule)
    const c = game.charging;
    if (c && !out.charge) {
      out.charge = { u: +(p.s - c.sec.s0).toFixed(2), name: c.name, post: c.post, park: c.park, dt: +(game.t - (out.stood ? out.stood.t : game.t)).toFixed(2) };
      out.plan = c.plan;
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
const KEY_AFTER = 2;
const runs = {
  'mit Plan, neben der Bucht': postRun({ plan: true, brakeAt: 60 }),
  'ohne Plan, neben der Bucht, L': postRun({ plan: false, brakeAt: 60, key: KEY_AFTER }),
  'ohne Plan, an der Säule, L': postRun({ plan: false, brakeAt: 52, key: KEY_AFTER }),
  'ohne Plan, hinter der Bucht, L': postRun({ plan: false, brakeAt: 78, key: KEY_AFTER }),
};
for (const [name, R] of Object.entries(runs)) {
  const s = R.stood;
  ok(s && s.u >= POST.u - POST_ZONE.back && s.u <= POST.halt + POST_ZONE.ahead, `${name}: stand bei ${s ? s.u : '–'} m außerhalb der Zone der Säule`);
  // geplant: von selbst nach POST_ZONE.still; ohne Plan erst mit L (vorher nichts), dann sofort
  const when = R.pressed ?? POST_ZONE.still;
  ok(R.charge && R.charge.post === R.town && R.charge.park === -1 && R.charge.name === postName(R.town) && near(R.charge.dt, when, 0.2) && R.held, `${name}: Ladestopp ${JSON.stringify(R.charge)} (gehalten ${R.held})`);
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
  const R = runs['ohne Plan, neben der Bucht, L'];
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
    // (die Uhr der Seite geht hier einen Schritt nach: Was im Schritt gesprochen wird, beginnt 1/30 s vor der Spielzeit)
    ok(call.length === 1 && c && !c.lost && !c.cut && c.done && c.start - t0 >= TV.call - 1 / 30 - 1e-6 && c.start - t0 <= TV.call + 0.3, `${name}: Ruf ${c ? `ab ${(c.start - t0).toFixed(2)} s${c.cut ? ', abgebrochen' : ''}${c.done ? '' : ', nicht zu Ende'}` : 'nie gesprochen'} (soll ${TV.call} s)`);
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

// --- 3. Die Werkstatt-Rechnung wird abgezogen ---------------------------------------------------------------------
console.log('3. Schäden werden abgezogen:');
{
  const R = REPARATUR;
  const S = makeStream({ driver: DRIVERS.zuegig, seed: 5, endless: true });
  const g = S.game;
  const bump = () => {
    g.player.cooldown = 0;
    g.onCrash({ car: { s: g.player.s, speed: 20, len: 4.6, behavior: 'normal' }, lonOverlap: 3, latOverlap: 0.3, dx: 1, ds: 0 });
  };
  const bills = [];
  const pay = g.payBill.bind(g);
  g.payBill = (b) => {
    const before = g.money;
    const shown = [];
    const money = g.ui.money;
    g.ui.money = (v, label) => shown.push({ v, label });
    pay(b);
    g.ui.money = money;
    bills.push({ ...b, before, after: g.money, shown, toast: S.log.toast[S.log.toast.length - 1], tp: g.t });
  };
  // Runde 1: zwei Rempler (der dritte Punkt bleibt, sonst endet der Stream in der Werkstatt) und fünf Kratzer an der
  // linken Seite; die Kasse ist bei der Rechnung fast leer. Runde 2: ein Rempler, dann endet der Stream
  let done = 0;
  let open2 = false;
  for (let i = 0; i < 30 * 900 && !(open2 && g.t > bills[0].tp + 35); i++) {
    if (g.eco.round === 1 && g.t > 30 && done < 2 && g.t > 30 + done * 4) (bump(), done++);
    if (g.eco.round === 1 && g.t > 40 && g.player.damage.scraped < 5) g.player.damage.scrape('left');
    if (g.billDue && g.billDue.n === 1 && !bills.length) g.money = 120;
    if (bills.length === 1 && !open2 && !g.tv && g.t > bills[0].tp + 30) (bump(), (open2 = true));
    S.step(1 / 30);
  }
  const [b1] = bills;
  ok(b1 && b1.hits === 2 && b1.marks === 5 && b1.amount === 2 * R.bump + 5 * R.mark, `Runde 1: ${b1 && JSON.stringify({ hits: b1.hits, marks: b1.marks, amount: b1.amount })}`);
  if (b1) {
    ok(near(b1.before - b1.after, b1.amount, 1e-9) && b1.after < 0, `Runde 1: Kasse ${b1.before} → ${b1.after} € (soll −${b1.amount} €, ins Minus)`);
    ok(b1.shown.length === 1 && b1.shown[0].v === -b1.amount && b1.shown[0].label === 'Schäden', `Runde 1 am Guthaben: ${JSON.stringify(b1.shown)}`);
    ok(b1.toast && /Schäden −425\s€ \(2 Rempler · 5 Kratzer\)$/.test(b1.toast.text), `Runde 1 am Rand: ${b1.toast && b1.toast.text}`);
    ok(g.player.damage.scratches.left === 3, `gezeichnet ${g.player.damage.scratches.left} Kratzer links (höchstens drei)`);
  }
  // Ende des Streams: Der Rempler der offenen Runde wird noch gebucht
  const mid = g.money;
  const bd = g.breakdown.Schäden;
  const open = g.tally.hits;
  g.end('quit');
  const o = g.over;
  ok(open >= 1 && near(mid - g.money, open * R.bump, 1e-9) && near(o.breakdown.Schäden, bd - open * R.bump, 1e-9), `Ende: offene Runde (${open} Rempler) nicht gebucht: ${mid} → ${g.money} €`);
  ok(o.damage.hits === 2 + open && o.damage.marks === 5 && near(o.damage.amount, -o.breakdown.Schäden, 1e-9), `Abspann: ${JSON.stringify(o.damage)} / ${o.breakdown.Schäden}`);
  ok(o.money === Math.round(g.money * 100) / 100, `Abspann: Ergebnis ${o.money} statt ${g.money}`);
  // der Abspann (menus.js render_over über einem kleinen DOM): „Schäden (3 Rempler · 5 Kratzer)“ −575,00 € und das
  // Ergebnis mit Vorzeichen
  const node = (tag) => ({ tag, className: '', textContent: '', children: [], dataset: {}, style: {}, classList: { add() {}, remove() {}, toggle() {} }, appendChild(c) { this.children.push(c); return c; }, append(...c) { this.children.push(...c); }, setAttribute() {}, addEventListener() {}, querySelector: () => null });
  const keep = globalThis.document;
  globalThis.document = { createElement: node };
  const screen = node('div');
  Menus.prototype.render_over.call({}, screen, { ...o, route: null, quote: null, wallet: 0, best: 0, newRecord: false, photos: [] });
  globalThis.document = keep;
  const all = [];
  const walk = (n) => {
    if (!n || typeof n !== 'object') return;
    all.push(n);
    for (const c of n.children || []) walk(c);
  };
  walk(screen);
  const row = all.find((n) => n.className === 'bd minus' && n.children[0] && /^Schäden/.test(n.children[0].textContent));
  const want = `Schäden (${2 + open} Rempler · 5 Kratzer)`;
  ok(row && row.children[0].textContent === want && /^−[\d.]+,00\s€$/.test(row.children[1].textContent) && row.children[1].textContent.includes(String(o.damage.amount).replace(/\B(?=(\d{3})+$)/g, '.')), `Abrechnung: „${row && row.children[0].textContent}“ ${row && row.children[1].textContent} (soll „${want}“ −${o.damage.amount} €)`);
  const mon = all.find((n) => /^over-money/.test(n.className));
  ok(mon && mon.children[0].textContent.startsWith(o.money < 0 ? '−' : '+') && mon.className === (o.money < 0 ? 'over-money minus' : 'over-money'), `Ergebnis im Abspann: ${mon && mon.children[0].textContent} (${o.money})`);
  // das Guthaben fällt mit einem Stream im Minus, aber nie unter null (main.js finishRun)
  ok(/save\.wallet = Math\.max\(0, Math\.round\(\(save\.wallet \+ o\.money\) \* 100\) \/ 100\);/.test(readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')), 'main.js: Guthaben nach dem Stream');
  console.log(`  Runde 1: ${b1 ? `${b1.hits} Rempler + ${b1.marks} Kratzer = ${b1.amount} €, Kasse ${b1.before} → ${b1.after} €, „${b1.toast.text}“` : '–'} · Ende: ${open} Rempler offen gebucht · Abspann „${row && row.children[0].textContent} ${row && row.children[1].textContent}“, Ergebnis ${mon && mon.children[0].textContent}`);
}

// --- 4. BrunnenTV macht die Zuschauer glücklich -------------------------------------------------------------------
console.log('4. BrunnenTV macht die Zuschauer glücklich:');
{
  // derselbe Stream zweimal (gleicher Zufall bis zum ersten Ruf): mit dem Schub der Folge und ohne
  const run = (boost) => {
    const keep = CHEER.brunnenTV;
    const tv = ZUFRIEDEN.tv;
    if (!boost) {
      CHEER.brunnenTV = [0, 0];
      ZUFRIEDEN.tv = 0;
    }
    const S = makeStream({ driver: DRIVERS.mittel, seed: 11, endless: true });
    const g = S.game;
    const r = { eps: [] };
    let ep = null;
    for (let i = 0; i < 30 * 1500 && r.eps.length < 3; i++) {
      S.step(1 / 30);
      if (g.tv && !ep) ep = { t0: g.t, way: g.tv.way };
      if (ep && !ep.pre && g.t - ep.t0 >= TV.call - 0.05) Object.assign(ep, { pre: g.eco.peek().mood, v0: g.viewers, z0: g.zufrieden.value });
      if (ep && ep.pre !== undefined && ep.post === undefined && g.t - ep.t0 >= TV.call + 0.2) Object.assign(ep, { post: g.eco.peek().mood, z1: g.zufrieden.value, glow: g.viewersUpT > g.t });
      if (ep && ep.v10 === undefined && g.t - ep.t0 >= TV.call + 10) ep.v10 = g.viewers;
      if (ep && ep.v30 === undefined && g.t - ep.t0 >= TV.call + 30) {
        ep.v30 = g.viewers;
        ep.chat = S.log.chat.filter((c) => c.t >= ep.t0 + TV.call && c.t < ep.t0 + TV.call + 9);
        ep.toast = S.log.toast.find((x) => x.key === 'zuschauer' && x.t >= ep.t0 && x.t < ep.t0 + TV.end + 1);
        r.eps.push(ep);
        ep = null;
      }
    }
    CHEER.brunnenTV = keep;
    ZUFRIEDEN.tv = tv;
    return r;
  };
  const a = run(true);
  const b = run(false);
  const e = a.eps[0];
  const f = b.eps[0];
  ok(e && f && near(e.pre, f.pre, 1e-9) && near(e.v0, f.v0, 1e-9), 'die beiden Streams laufen bis zum Ruf nicht gleich');
  if (e && f) {
    // (nahe der besten Laune wird die Stimmung zäh: economy.js sway – der Sprung ist 2 · 0,12 · (1 − Stimmung))
    ok(e.post - e.pre >= 0.2 * (1 - e.pre) && f.post - f.pre < 0.01, `Stimmung beim Ruf ${e.pre.toFixed(2)} → ${e.post.toFixed(2)} (ohne Schub ${f.pre.toFixed(2)} → ${f.post.toFixed(2)})`);
    ok(e.v10 - f.v10 >= 150 && e.v30 - f.v30 >= 100, `Zuschauer +10 s ${Math.round(e.v10)} statt ${Math.round(f.v10)}, +30 s ${Math.round(e.v30)} statt ${Math.round(f.v30)}`);
    ok(near(e.z1 - e.z0, ZUFRIEDEN.tv, 0.05), `Zufriedenheit beim Ruf ${e.z0.toFixed(1)} → ${e.z1.toFixed(1)}`);
    ok(e.glow, 'Zuschauerzahl leuchtet nach dem Ruf nicht');
    const jubel = e.chat.filter((c) => CHAT.brunnenJubel.includes(c.text) || SCHOENER_BRUNNEN.chat.includes(c.text));
    ok(jubel.length >= 6, `Chat feiert nur ${jubel.length}× in 9 s nach dem Ruf`);
    ok(e.toast && /^📈 BrunnenTV: \+[\d.]+ Zuschauer$/.test(e.toast.text), `Rand am Ende der Folge: ${e.toast && e.toast.text}`);
  }
  ok(a.eps.length >= 2 && a.eps.every((x) => x.post - x.pre >= 0.2 * (1 - x.pre)), `Stimmung je Folge: ${a.eps.map((x) => `${x.pre.toFixed(2)}→${x.post.toFixed(2)}`).join(' ')}`);
  const m = (k) => a.eps.reduce((s, x, i) => s + x[k] - b.eps[i][k], 0) / Math.min(a.eps.length, b.eps.length);
  console.log(`  ${a.eps.length} Folgen: Stimmung beim Ruf ${a.eps.map((x) => `${x.pre.toFixed(2)} → ${x.post.toFixed(2)}`).join(', ')} · Zuschauer gegenüber ohne Schub +${Math.round(m('v10'))} nach 10 s, +${Math.round(m('v30'))} nach 30 s (Folge 1: ${Math.round(e.v0)} → ${Math.round(e.v10)}) · Zufriedenheit +${ZUFRIEDEN.tv} · Chat feiert ${e.chat.length} Zeilen in 9 s · „${e.toast && e.toast.text}“`);
}

// --- 5. Intro: „Wir sind live.“, dann „Partypeople!“ beim Winken -------------------------------------------------------
console.log('5. Intro: erst Wir sind live, dann Partypeople beim Winken:');
{
  const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  ok(PARTYPEOPLE.say === 'Partypeople!' && !('wave' in PARTYPEOPLE), `Gruß: ${PARTYPEOPLE.say}`);
  // die Stellen aus main.js: der Beginn des Streams, sein Aufruf in der Szene und beim Losfahren, das Winken danach
  const fn = main.match(/function streamStart\(\) \{[\s\S]*?\n\}/);
  const scene = main.match(/^\s*if \(t >= S\.live && !run\.hello\) streamStart\(\);$/m);
  const drive = main.match(/^\s*if \(!chargeRun\.hello\) streamStart\(\);$/m);
  const late = main.match(/^\s*if \(chargeRun\.said && chargeRun\.waveT < 0\) game\.waveAt\('intro'\);$/m);
  const lines = main.match(/const CHARGE_LINES = \{[^\n]*\};/);
  ok(fn && scene && drive && late && lines, `main.js: Beginn ${!!fn}, in der Szene ${!!scene}, beim Losfahren ${!!drive}, Winken danach ${!!late}`);
  // (zurückgesetzt nur beim Start eines Streams)
  ok((main.match(/Object\.assign\(chargeRun, \{ hello: false/g) || []).length === 1 && /function streamStart\(\) \{\s*const run = chargeRun;\s*run\.hello = true;/.test(main), 'main.js: der Beginn wird nicht genau einmal je Stream gemerkt');
  if (fn && scene && drive && late && lines) {
    const CHARGE_LINES = new Function(`${lines[0]}; return CHARGE_LINES;`)();
    /**
     * Ausführen: Szene in Schritten von 1/30 s bis zum Ende (oder übersprungen bei skipAt, dann Losfahren), dazu eine
     * Warteschlange wie speech.js für Sätze mit Vorrang (der Reihe nach, 0,25 s Pause), Stimmen slow-mal so langsam wie
     * geschätzt. Ergebnis: was wann geschah (queue, studio, adam, greet, wave-scene, wave-drive).
     */
    const flow = (skipAt, slow) => {
      const log = [];
      const q = [];
      let cur = null;
      let gap = 0;
      const env = {
        state: 'charge', stateT: 0, simT: 0, SCENE, PARTYPEOPLE, CHARGE_LINES,
        chargeRun: { hello: false, said: false, waveT: -1, id: 1, greetT: Infinity },
        speech: { say: (text, voice, opts) => (q.push({ text, voice, opts, dur: estimateSpeech(text, VOICES[voice].rate) * slow }), log.push({ t: env.stateT, what: 'queue', text, prio: !!opts.priority }), 1) },
        ui: { studio: (text) => log.push({ t: env.stateT, what: 'studio', text }), adam: (text) => log.push({ t: env.stateT, what: 'adam', text }) },
        game: { t: 0, studioVoice: () => 'sprachstudio', greet: () => log.push({ t: env.stateT, what: 'greet' }), waves: { ask: () => log.push({ t: env.stateT, what: 'wave-scene' }) }, waveAt: () => log.push({ t: env.stateT, what: 'wave-drive' }) },
      };
      const streamStart = new Function('env', `with (env) { ${fn[0]}; return streamStart; }`)(env);
      const tick = new Function('t', 'S', 'run', 'streamStart', scene[0]);
      const toDrive = new Function('chargeRun', 'streamStart', 'game', drive[0] + '\n' + late[0]);
      const pump = (t) => {
        if (cur && t >= cur.t0 + cur.dur) {
          cur.opts.onEnd?.();
          cur = null;
          gap = t + 0.25;
        }
        if (!cur && q.length && t >= gap) {
          cur = q.shift();
          cur.t0 = t;
          cur.opts.onStart?.(cur.dur);
        }
      };
      let t = 0;
      for (; t < Math.min(skipAt, SCENE.end); t += 1 / 30) {
        env.stateT = env.simT = t;
        tick(t, SCENE, env.chargeRun, streamStart);
        pump(t);
      }
      env.state = 'drive';
      toDrive(env.chargeRun, streamStart, env.game);
      for (const t1 = t + 6; t < t1; t += 1 / 30) {
        env.stateT = env.simT = t;
        pump(t);
      }
      return { log, run: env.chargeRun, at: (what) => log.filter((x) => x.what === what) };
    };
    const cases = { 'ganze Szene': flow(Infinity, 1.35), 'ganze Szene, Stimmen wie geschätzt': flow(Infinity, 1), 'übersprungen vor „Wir sind live.“': flow(SCENE.skip + 0.05, 1.35), 'übersprungen mitten in „Wir sind live.“': flow(SCENE.live + 0.4, 1.35) };
    for (const [name, r] of Object.entries(cases)) {
      const [st] = r.at('studio');
      const [ad] = r.at('adam');
      const [gr] = r.at('greet');
      const queued = r.at('queue');
      ok(queued.length === 2 && queued[0].text === CHARGE_LINES.live && queued[1].text === 'Partypeople!' && queued.every((x) => x.prio), `${name}: Warteschlange ${JSON.stringify(queued)}`);
      ok(r.at('studio').length === 1 && r.at('adam').length === 1 && r.at('greet').length === 1, `${name}: ${r.log.map((x) => x.what).join(', ')}`);
      ok(st && ad && gr && st.t < ad.t && near(gr.t, ad.t, 1e-9), `${name}: live ${st && st.t.toFixed(2)} s, Gruß ${ad && ad.t.toFixed(2)} s, Chat grüßt ${gr && gr.t.toFixed(2)} s`);
      // nichts vom Gruß vor der Meldung: kein Untertitel, kein Winken, kein Gruß des Chats
      ok(r.log.filter((x) => x.what !== 'queue' && x.t < st.t).length === 0, `${name}: vor „Wir sind live.“ ${JSON.stringify(r.log.filter((x) => x.what !== 'queue' && x.t < st.t))}`);
      // er winkt genau, wenn er grüßt: in der Szene draußen (und fertig vor dem Schnitt ins Cockpit), sonst in der Facecam
      const waves = [...r.at('wave-scene'), ...r.at('wave-drive')];
      ok(waves.length === 1 && near(waves[0].t, ad.t, 1e-9), `${name}: gewinkt ${JSON.stringify(waves)} zum Gruß bei ${ad && ad.t.toFixed(2)} s`);
      if (r.at('wave-scene').length) ok(near(r.run.waveT, ad.t, 1e-9) && r.run.waveT + SCENE.wave <= SCENE.inside, `${name}: Winken ${r.run.waveT.toFixed(2)}–${(r.run.waveT + SCENE.wave).toFixed(2)} s, Schnitt ins Cockpit ${SCENE.inside.toFixed(2)} s`);
    }
    const a = cases['ganze Szene'];
    ok(a.at('wave-scene').length === 1, 'ganze Szene: er winkt nicht draußen');
    ok(cases['übersprungen vor „Wir sind live.“'].at('wave-drive').length === 1, 'übersprungen: er winkt nicht in die Facecam');
    console.log(`  ${Object.entries(cases).map(([n, r]) => `${n}: live ${r.at('studio')[0]?.t.toFixed(2)} s → „Partypeople!“ ${r.at('adam')[0]?.t.toFixed(2)} s (${r.at('wave-scene').length ? 'winkt draußen' : 'winkt in die Facecam'})`).join(' · ')}`);
  }
  // der Chat grüßt erst nach seinem Gruß zurück (Game.greet); wer vorher dran wäre, wartet
  const g = Object.create(Game.prototype);
  const said = [];
  Object.assign(g, { helloSaid: false, helloHeld: [], chat: (l) => said.push(l), later: (dt, f) => f() });
  g.helloChat('a');
  const before = said.length;
  g.greet();
  g.helloChat('b');
  ok(before === 0 && said.join() === 'a,b', `Chat grüßt vor dem Gruß (${before}) oder nicht danach (${said.join()})`);
}

// --- 6. Finger beim Winken ----------------------------------------------------------------------------------------
console.log('6. Finger beim Winken:');
{
  // Finger zählen: der Schnitt des Netzes mit der Ebene y = y0 (je Dreieck eine Strecke), ihre x-Bereiche vereinigt –
  // jeder Finger ist ein eigener Bereich, dazwischen ist Luft
  const fingers = (geo, axis, y0) => {
    const p = geo.getAttribute('position');
    const ix = geo.index ? geo.index.array : null;
    const nT = (ix ? ix.length : p.count) / 3;
    const seg = [];
    const v = (k) => (ix ? ix[k] : k);
    for (let t = 0; t < nT; t++) {
      const xs = [];
      for (let e = 0; e < 3; e++) {
        const a = v(t * 3 + e);
        const b = v(t * 3 + ((e + 1) % 3));
        const ya = p.getY(a) - y0;
        const yb = p.getY(b) - y0;
        if ((ya < 0) !== (yb < 0)) xs.push(p.getX(a) + ((p.getX(b) - p.getX(a)) * ya) / (ya - yb));
      }
      if (xs.length === 2) seg.push([Math.min(xs[0], xs[1]), Math.max(xs[0], xs[1])]);
    }
    seg.sort((a, b) => a[0] - b[0]);
    let n = 0;
    let end = -Infinity;
    for (const [a, b] of seg) {
      if (a > end + 1e-4) n++;
      end = Math.max(end, b);
    }
    return { n, w: seg.length ? end - seg[0][0] : 0 };
  };
  const G = buildAdamGeometry();
  const res = [];
  for (const [k, o] of [['armL', 'armOpenL'], ['armR', 'armOpenR']]) {
    G[k].computeBoundingBox();
    G[o].computeBoundingBox();
    const bottom = G[k].boundingBox.min.y; // Unterkante des Fäustlings
    // (die offene Hand ist größer als der Fäustling, ihr Handteller reicht etwas tiefer: 2 cm unter seiner Unterkante
    // schneidet die Ebene nur noch die vier Finger; den Daumen zählt winken2-test mit)
    const f = fingers(G[o], 'y', bottom - 0.02);
    const m = fingers(G[k], 'y', bottom + 0.01);
    res.push(`${o}: ${f.n} Finger auf ${(f.w * 100).toFixed(1)} cm (Fäustling ${m.n})`);
    ok(f.n === 4 && f.w > 0.07 && m.n === 1, `${o}: ${f.n} Finger auf ${f.w.toFixed(3)} m, Fäustling ${m.n} Stück`);
    ok(G[o].getAttribute('skinIndex') && G[o].getAttribute('position').count > G[k].getAttribute('position').count, `${o}: kein gehäutetes Netz`);
  }
  for (const s of [-1, 1]) {
    const g = openHandGeometry(s);
    const f = fingers(g, 'y', 0.08);
    const m = fingers(mittenGeometry(s, 0.018, 0.17), 'y', 0.035);
    res.push(`Ich-Perspektive ${s < 0 ? 'links' : 'rechts'}: ${f.n} Finger (Fäustling ${m.n})`);
    ok(f.n === 4 && f.w > 0.06, `Ich-Perspektive ${s}: ${f.n} Finger auf ${f.w.toFixed(3)} m`);
  }
  // umgeschaltet wird nur beim Winken: Jubeln (die Faust wippt), Megafon und Flasche behalten den Fäustling
  const mini = readFileSync(new URL('../src/models/miniAdam.js', import.meta.url), 'utf8');
  ok(/const open = waving && !mega && !gest\.bottle && gest\.wave > 0\.3 && gest\.cheer < 0\.15;\s*const geo = open \? \(side < 0 \? G\.armOpenL : G\.armOpenR\) : side < 0 \? G\.armL : G\.armR;\s*if \(arm\.userData\.skin\.geometry !== geo\) arm\.userData\.skin\.geometry = geo;/.test(mini), 'miniAdam.js: die Hand wird beim Winken nicht offen');
  const cock = readFileSync(new URL('../src/cockpit/cockpit.js', import.meta.url), 'utf8');
  ok(/const open = up > 0\.3 && kc < 0\.2 && !g\.bottle && !\(g\.megafon > 0\);/.test(cock) && /if \(G\.mitten && hand\.geometry !== G\.mitten\) hand\.geometry = G\.mitten;/.test(cock), 'cockpit.js: die Hand der Ich-Perspektive wird beim Winken nicht offen');
  console.log('  ' + res.join(' · '));
}

// --- 7. Geparkte Autos leuchten nicht -------------------------------------------------------------------------------
console.log('7. Geparkte Autos leuchten nicht:');
{
  // Helligkeit (sRGB-Werte, Rec. 709) und Sättigung der Lampenfarben
  const lum = (c) => (0.2126 * ((c >> 16) & 255) + 0.7152 * ((c >> 8) & 255) + 0.0722 * (c & 255)) / 255;
  ok(lum(LAMP_OFF.tail) < 0.6 * lum(PAL.red) && ((LAMP_OFF.tail >> 16) & 255) > ((LAMP_OFF.tail >> 8) & 255), `Rücklicht aus ${LAMP_OFF.tail.toString(16)} (Helligkeit ${lum(LAMP_OFF.tail).toFixed(2)}, an ${lum(PAL.red).toFixed(2)})`);
  ok(lum(LAMP_OFF.head) < 0.65, `Scheinwerfer aus ${LAMP_OFF.head.toString(16)} (Helligkeit ${lum(LAMP_OFF.head).toFixed(2)})`);
  const street = readFileSync(new URL('../src/world/kit/street.js', import.meta.url), 'utf8');
  const toy = street.slice(street.indexOf('function toyCar('), street.indexOf('const CAR_TINTS'));
  ok(/const lamp = back \? LAMP_OFF\.tail : LAMP_OFF\.head;/.test(toy) && !/PAL\.red|0xfff4cc/.test(toy), 'street.js: Lampen der Spielzeugautos leuchten noch');
  console.log(`  Spielzeugautos: Rücklicht ${LAMP_OFF.tail.toString(16)} (Helligkeit ${lum(LAMP_OFF.tail).toFixed(2)} statt ${lum(PAL.red).toFixed(2)}), Scheinwerfer ${LAMP_OFF.head.toString(16)} (${lum(LAMP_OFF.head).toFixed(2)} statt ${lum(0xfff4cc).toFixed(2)})`);
}

// --- 8. Gegenverkehr auf Orts- und Landstraßen --------------------------------------------------------------------
console.log('8. Gegenverkehr:');
{
  // Fahrzeuge ohne Bild, mit den Maßen der echten (models/vehicles.js)
  const make = (kind) => ({ group: new Group(), length: CAR_TYPES[kind].L, width: CAR_TYPES[kind].half * 2 + 0.12 });
  Math.random = mulberry32(21);
  const trip = new Trip({ rng: Math.random });
  const goals = ['Hanau', 'Gelnhausen', 'Fulda', 'Frankfurt am Main', 'Offenbach am Main', 'Aschaffenburg'].map(findPlace).filter((i) => i >= 0);
  let gi = 0;
  trip.setTarget(goals[gi]);
  const G = new Gegenverkehr(null, { rnd: mulberry32(5), make });
  const P = { s: trip.s, x: trip.x, speed: 0, len: 4.7, w: 1.92 };
  const st = { steps: 0, wrong: 0, fast: 0, lane: 0, crash: 0, max: 0, km: { stadt: 0, land: 0 }, seen: { stadt: new Set(), land: new Set() }, kinds: {}, ab: 0, island: 0 };
  let t = 0;
  for (let i = 0; i < (30 * 60) / DT; i++) {
    const sec = trip.section;
    const prof = trip.profile();
    P.speed = prof.limit > 0 ? prof.limit / 3.6 : 130 / 3.6;
    P.s += P.speed * DT;
    P.x = autoTarget(trip);
    trip.update(P.s, P.x);
    // angekommen: das nächste Ziel
    if (trip.target < 0) trip.setTarget(goals[(gi = (gi + 1) % goals.length)]);
    t += DT;
    const ev = G.update(DT, trip, P, trip.shears(), t);
    st.crash += ev.length;
    const k = twoWay(trip.section);
    if (k) st.km[k] += (P.speed * DT) / 1000;
    st.max = Math.max(st.max, G.cars.length);
    for (const c of G.cars) {
      st.steps++;
      const ahead = c.s > P.s + 2;
      const at = G.allowed(trip.cur, c.s);
      if (ahead && !at) st.wrong++;
      const csec = c.sec;
      if (!twoWay(csec)) st.ab++;
      const q = csec.kind === 'stadt' ? squareOf(csec) : null;
      if (q && ahead && Math.abs(c.s - q.s) < q.r + 4) st.island++;
      const lim = twoWay(csec) === 'stadt' ? 50 : 95;
      if (c.speed > lim / 3.6 + 0.01) st.fast++;
      if (Math.abs(c.x - oncomingX(csec)) > 0.45) st.lane++;
      st.seen[twoWay(csec) || 'stadt'].add(c);
      st.kinds[c.kind] = (st.kinds[c.kind] || 0) + 1;
    }
  }
  const nS = st.seen.stadt.size;
  const nL = st.seen.land.size;
  ok(nS >= 5 && nL >= 5, `zu wenig Gegenverkehr: ${nS} im Ort, ${nL} draußen`);
  ok(st.wrong === 0 && st.ab === 0 && st.island === 0, `Gegenverkehr am falschen Ort: ${st.wrong}× außerhalb, ${st.ab}× ohne Gegenspur, ${st.island}× an der Brunneninsel`);
  ok(st.fast === 0 && st.lane === 0, `Gegenverkehr zu schnell ${st.fast}×, neben der Spur ${st.lane}×`);
  ok(st.crash === 0, `${st.crash} Rempler, obwohl der Wagen in seiner Spur blieb`);
  ok(st.max <= GEGEN.max, `${st.max} Fahrzeuge zugleich (höchstens ${GEGEN.max})`);
  ok(Object.keys(st.kinds).some((k) => k === 'transporter' || k === 'wohnmobil'), `nur Autos: ${Object.keys(st.kinds).join(', ')}`);
  // in die Gegenspur geraten: Stehend wartet der Entgegenkommende davor, hineinfahren gibt genau einen Rempler
  // (eine neue Fahrt bis zur ersten Landstraße mit 160 m Gegenspur voraus)
  let drift = null;
  Math.random = mulberry32(21);
  const trip2 = new Trip({ rng: Math.random });
  trip2.setTarget(goals[2]);
  P.s = trip2.s;
  for (let i = 0; i < (20 * 60) / DT && !drift; i++) {
    const prof = trip2.profile();
    P.speed = prof.limit > 0 ? prof.limit / 3.6 : 130 / 3.6;
    P.s += P.speed * DT;
    P.x = autoTarget(trip2);
    trip2.update(P.s, P.x);
    if (twoWay(trip2.section) === 'land' && G.clearPath(trip2.cur, P.s, P.s + 160)) drift = true;
  }
  ok(drift, 'keine Landstraße mit 160 m Gegenspur gefunden');
  if (drift) {
    const D2 = new Gegenverkehr(null, { rnd: mulberry32(9), make });
    const sec = trip2.section;
    P.x = oncomingX(sec) + 0.1;
    P.speed = 0;
    const c = D2.spawn(trip2.cur, P.s + 95, sec);
    c.speed = 25;
    let ev = 0;
    for (let i = 0; i < 8 / DT; i++) ev += D2.update(DT, trip2, P, trip2.shears(), i * DT).length;
    const gap = c.s - P.s - (c.len + P.len) / 2;
    ok(ev === 0 && c.speed < 0.05 && gap > 0.5 && gap < 12, `stehend in der Gegenspur: ${ev} Rempler, der andere steht ${gap.toFixed(1)} m davor mit ${(c.speed * 3.6).toFixed(1)} km/h`);
    // jetzt fährt der Spieler mit 18 km/h hinein
    const hits = [];
    for (let i = 0; i < 4 / DT; i++) {
      P.speed = 5;
      P.s += P.speed * DT;
      for (const e of D2.update(DT, trip2, P, trip2.shears(), 8 + i * DT)) hits.push(e);
      if (hits.length) P.s = Math.min(P.s, c.s - (c.len + P.len) / 2 - 0.35);
    }
    ok(hits.length >= 1 && hits[0].type === 'crash' && hits[0].car.oncoming && hits[0].ds > 0 && D2.stats.crashes === 1, `hineingefahren: ${hits.length} Ereignisse, ${D2.stats.crashes} Rempler`);
    console.log(`  ${(st.km.stadt + st.km.land).toFixed(1)} km mit Gegenspur (Ort ${st.km.stadt.toFixed(1)} km, draußen ${st.km.land.toFixed(1)} km): ${nS} Entgegenkommende im Ort (${(nS / Math.max(0.01, st.km.stadt)).toFixed(1)} je km), ${nL} draußen (${(nL / Math.max(0.01, st.km.land)).toFixed(1)} je km), höchstens ${st.max} zugleich · Typen ${Object.entries(st.kinds).map(([k, n]) => `${k} ${Math.round((100 * n) / st.steps)} %`).join(', ')} · 0 Rempler in der eigenen Spur · in der Gegenspur: steht ${gap.toFixed(1)} m davor, hineingefahren ${D2.stats.crashes} Rempler`);
  }
}

// --- 9. Ladezeit: Ladeanzeige, Shader für ihr Ziel, Fahrzeugnetze später, Marken ---------------------------------
console.log('9. Ladezeit:');
{
  const read = (f) => readFileSync(new URL('../' + f, import.meta.url), 'utf8');
  const html = read('docs/index.html');
  const css = read('docs/style.css');
  const build = read('build.mjs');
  const main = read('src/main.js');
  ok(/<div class="load-bar" aria-hidden="true"><i><\/i><\/div>/.test(html) && html.indexOf('load-bar') > html.indexOf('id="loading"') && html.indexOf('load-bar') < html.indexOf('<noscript>'), 'index.html: keine Ladeanzeige im Ladebild');
  ok(/performance\.mark\('ma:inject'\)/.test(html) && /performance\.mark\(\\'ma:run\\'\)/.test(build), 'Marken ma:inject (index.html) und ma:run (build.mjs) fehlen');
  ok(/\.load-bar \{ position: absolute; left: 0; right: 0; bottom: env\(safe-area-inset-bottom, 0px\); height: 3px;/.test(css) && /\.load-bar i \{[^}]*transform-origin: 0 50%;[^}]*animation: loadcreep 16s step-end forwards;/.test(css), 'style.css: Ladeanzeige am Rand fehlt');
  // in Stufen (step-end): wenige neue Bilder des Ladebilds statt eines je Bildschirmtakt, stetig wachsend bis 0,9
  const kf = (css.match(/@keyframes loadcreep \{([\s\S]*?\} )\}/) || ['', ''])[1];
  const steps = [...kf.matchAll(/(\d+)% \{ transform: scaleX\(([\d.]+)\); \}/g)].map((m) => [+m[1], +m[2]]);
  ok(steps.length >= 6 && steps.length <= 12 && steps[0][0] === 0 && steps[steps.length - 1][0] === 100 && steps[steps.length - 1][1] === 0.9 && steps.every((q, i) => !i || (q[0] > steps[i - 1][0] && q[1] > steps[i - 1][1])), `style.css: Stufen der Ladeanzeige ${JSON.stringify(steps)}`);
  const boot = main.slice(main.indexOf('function boot()'), main.indexOf('// Debug-Schnittstelle'));
  const order = ["mark('ma:init')", 'xxlStart(true)', "mark('ma:world')", 'renderer.setRenderTarget(worldRT);', 'renderer.compile(scene, camera)', 'renderer.setRenderTarget(facecam.rt);', 'renderer.compile(facecam.scene, facecam.camera)', 'renderer.setRenderTarget(null);', 'renderer.compile(cockpit.scene, camera)', 'renderer.compile(compScene, compCam)', "mark('ma:compiled')", "state = 'title'", "mark('ma:frame')", 'setTimeout(prewarmVehicles, 300)'];
  let at = 0;
  const miss = order.filter((k) => {
    const i = boot.indexOf(k, at);
    if (i < 0) return true;
    at = i + k.length;
    return false;
  });
  ok(boot.length > 0 && miss.length === 0, `main.js boot: Schritte fehlen oder stehen anders: ${miss.join(' | ')}`);
  ok(!/async function boot|await /.test(boot), 'main.js: der Start wartet zwischendurch (er läuft in einem Zug wie bisher)');
  ok(/^performance\.mark\('ma:main'\);$/m.test(main) && /function startRun\(\) \{\n  performance\.mark\('ma:start'\);/.test(main) && /performance\.mark\('ma:started'\);\n\}/.test(main), 'main.js: Marken ma:main, ma:start, ma:started fehlen');
  ok(!/^prewarmVehicles\(\);$/m.test(main), 'main.js: die Fahrzeugnetze werden noch vor dem Titel gebaut');
  console.log(`  Ladeanzeige am unteren Rand in ${steps.length} Stufen, Shader der Welt und der Facecam für ihr Render-Ziel, Fahrzeugnetze erst nach dem ersten Titelbild, Marken ma:inject, run, main, init, world, compiled, frame, start, started`);
}

if (fails) {
  console.log(`testlauf4-test: ${fails} FEHLER (${checks} Prüfungen)`);
  process.exit(1);
}
console.log(`testlauf4-test: alles gut (${checks} Prüfungen)`);
