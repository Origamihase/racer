// Verkehr wie im echten Leben (Testlauf des Besitzers): Rücklichter, Bremslichter und die Ansagen dazu.
// - Rücklicht immer an, bei Regen und trübem Himmel kräftiger; das Bremslicht deutlich heller (LIGHTS).
// - Bremslicht (brakeLight, BRAKE): an bei spürbarem Verzögern, vor Kurven und im Stand; es flackert nicht im
//   Kolonnenverkehr (Haltezeit, Abstand zwischen An- und Aus-Schwelle) und geht aus, wenn der Wagen wieder Gas gibt.
// - Elefantenrennen (elephantPair, game.js ELEFANT): angesagt nur, wenn zwei Lkw wirklich nebeneinander vor dem Wagen
//   fahren – auf benachbarten Spuren unserer Richtung, nah beieinander, fast gleich schnell –, selten und mit Pause;
//   im Spiel nur auf der Autobahn ohne Ausfahrt in der Nähe (eine Stunde Fahrt mit wechselnden Lkw vor dem Wagen).
// - Die Durchsage „Die linke Fahrspur ist wieder gesperrt“ gibt es nicht mehr.
//   node tools/verkehr-test.mjs
import { LIGHTS } from '../src/models/vehicles.js';
import { BRAKE, brakeLight, ELEPHANTS, elephantPair } from '../src/world/traffic.js';
import { PerspectiveCamera } from 'three';
import { Game, ELEFANT } from '../src/game/game.js';
import { BOARD } from '../src/data.js';
import { Trip, J as TRIP } from '../src/game/trip.js';
import { Arrival, limitsFor, AUTO } from '../src/world/xxl/plan.js';

let fails = 0;
let checks = 0;
function ok(cond, msg) {
  checks++;
  if (!cond) {
    fails++;
    console.error('FEHLER: ' + msg);
  }
}

// --- Rücklichter ----------------------------------------------------------------------------------------------
ok(LIGHTS.tail[0] >= 0.25, `Rücklicht am Tag ${LIGHTS.tail[0]}: zu schwach, um es zu sehen`);
ok(LIGHTS.tail[1] > LIGHTS.tail[0], 'Rücklicht bei Regen nicht kräftiger als am Tag');
ok(LIGHTS.brake >= 1.6 * LIGHTS.tail[1], `Bremslicht ${LIGHTS.brake} kaum heller als das Rücklicht bei Regen ${LIGHTS.tail[1]}`);
ok(LIGHTS.brake <= 1, `Bremslicht ${LIGHTS.brake}: kippt im Tonemapping nach Orange (sähe aus wie ein Blinker)`);

// --- Bremslicht -----------------------------------------------------------------------------------------------
const dt = 1 / 60;
/** Bremslicht über eine Folge von Beschleunigungen (je Bild) bei Tempo v: Anzahl der Wechsel, Anteil an, Verlauf. */
function run(accs, v = 30, curve = () => false) {
  const c = { speed: v, brakeT: 0 };
  let on = false;
  let flips = 0;
  let lit = 0;
  const seq = [];
  accs.forEach((a, i) => {
    const b = brakeLight(c, a, dt, curve(i));
    if (b !== on) flips++;
    on = b;
    if (b) lit++;
    seq.push(b);
  });
  return { flips, lit: lit / accs.length, seq };
}
const frames = (sec, f) => Array.from({ length: Math.round(sec * 60) }, (_, i) => f(i * dt));
// Kolonne: der Abstandsregler zupft um −0,9 m/s² herum (±0,5, sechsmal je Sekunde): früher flackerte es mit jedem Zupfen
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const jitter = frames(20, (t) => -0.9 + 0.5 * Math.sin(t * 6 * Math.PI * 2) + (rnd() - 0.5) * 0.2);
const J = run(jitter);
ok(J.flips <= 2, `Kolonne: Bremslicht wechselt ${J.flips}× in 20 s (flackert)`);
// gleichmäßiges Rollen und Gasgeben: aus
const cruise = run(frames(10, () => 0.3));
ok(cruise.lit === 0, 'Gas geben: Bremslicht an');
// leichtes Lupfen (Fahrtwind, −0,5 m/s²): kein Bremslicht
ok(run(frames(5, () => -0.5)).lit === 0, 'Lupfen mit −0,5 m/s²: Bremslicht an');
// Bremsen: sofort an, bleibt an, solange er bremst; geht nach dem Bremsen höchstens hold + 1 Bild später aus
const brake = run([...frames(1, () => 0.2), ...frames(2, () => -3), ...frames(3, () => 0.5)]);
const firstOn = brake.seq.indexOf(true);
const lastOn = brake.seq.lastIndexOf(true);
ok(firstOn === 60, `Bremsen ab Bild 60, Bremslicht ab Bild ${firstOn}`);
ok(brake.seq.slice(60, 180).every(Boolean), 'Bremslicht geht beim Bremsen aus');
ok(lastOn >= 180 && (lastOn - 179) * dt <= BRAKE.hold + dt + 1e-9, `Bremslicht leuchtet nach dem Bremsen noch ${((lastOn - 179) * dt).toFixed(2)} s (Haltezeit ${BRAKE.hold} s)`);
// im Stand an; vor einer Kurve (sanftes Abbremsen) an
ok(run(frames(2, () => 0), 1).lit === 1, 'im Stand: kein Bremslicht');
ok(run(frames(2, () => -0.4), 30, () => true).lit === 1, 'vor der Kurve: kein Bremslicht');
ok(BRAKE.off > BRAKE.on, 'Bremslicht: Aus-Schwelle muss über der An-Schwelle liegen');

// --- Elefantenrennen ------------------------------------------------------------------------------------------
const truck = (lane, ds, v = 23.4) => ({ truck: true, lane, s: 1000 + ds, speed: v });
const car = (lane, ds, v = 30) => ({ truck: false, lane, s: 1000 + ds, speed: v });
const pair = (list) => !!elephantPair(list, 1000);
ok(pair([truck(3, 200), truck(2, 205)]), 'zwei Lkw nebeneinander 200 m voraus: kein Elefantenrennen erkannt');
ok(pair([truck(1, 120), truck(2, 112)]), 'zwei Lkw nebeneinander auf Spur 1 und 2: kein Elefantenrennen erkannt');
ok(!pair([truck(3, 200)]), 'ein Lkw allein ist kein Elefantenrennen');
ok(!pair([truck(3, 200), car(2, 202)]), 'Lkw neben Pkw ist kein Elefantenrennen');
ok(!pair([truck(3, 200), truck(2, 200 + ELEPHANTS.side + 15)]), 'zwei Lkw hintereinander versetzt sind kein Elefantenrennen');
ok(!pair([truck(3, 200), truck(1, 200)]), 'Lkw mit einer Spur dazwischen sind kein Elefantenrennen');
ok(!pair([truck(3, -40), truck(2, -38)]), 'ein Elefantenrennen hinter dem Wagen wird nicht angesagt');
ok(!pair([truck(3, ELEPHANTS.far + 80), truck(2, ELEPHANTS.far + 82)]), 'ein Elefantenrennen weit voraus (außer Sicht) wird noch nicht angesagt');
ok(!pair([truck(4, 150), truck(3, 152)]), 'ein Lkw auf dem Verzögerungsstreifen fährt kein Elefantenrennen');
ok(!pair([truck(3, 150, 22), truck(2, 152, 27)]), 'ein Lkw, der zügig überholt, fährt kein Elefantenrennen');
ok(!pair([]), 'leere Straße: Elefantenrennen erkannt');
// selten: bestellt höchstens alle ELEFANT.every Meter, angesagt höchstens alle ELEFANT.cool Sekunden
ok(ELEFANT.every[0] >= 8000 && ELEFANT.first[0] >= 5000, `Elefantenrennen zu häufig bestellt: ${JSON.stringify(ELEFANT)}`);
ok(ELEFANT.cool >= 180, `Elefantenrennen: Pause zwischen zwei Ansagen nur ${ELEFANT.cool} s`);
ok(ELEFANT.room >= 1000, 'Elefantenrennen: bestellt, obwohl gleich eine Ausfahrt kommt');

// Im Spiel: eine Stunde Autobahn (wer dem Navi folgt, bleibt geradeaus), vor dem Wagen wechseln alle 15 s die Lkw –
// ein echtes Paar nebeneinander, ein Lkw allein, Lkw hintereinander, Lkw neben Pkw. Jede Ansage muss ein echtes Paar
// vor sich haben, auf der Autobahn ohne Ausfahrt in ELEFANT.room Metern, und zwei Ansagen liegen ELEFANT.cool
// Sekunden auseinander; bestellt wird höchstens alle ELEFANT.every[0] Meter Straße.
{
  let a = 0x2f6b;
  Math.random = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const noop = () => {};
  const loose = (base = {}) => new Proxy(base, { get: (t, k) => (k in t ? t[k] : noop) });
  const NONE = [];
  const trip = new Trip({ rng: Math.random });
  const arrival = new Arrival();
  const orders = [];
  const T = { cars: [], update: () => NONE, nearby: () => NONE, police: () => null, megafon: () => 0, elefantenrennen: (s) => orders.push({ s, ab: trip.section.kind === 'ab' }) };
  const game = new Game({
    traffic: loose(T), scenery: loose({ request: () => 1, landmarkSpot: (s) => s, placed: () => null }),
    road: loose(), sky: loose(), rain: loose(), windshield: loose({ firmware: 0, manual: () => 'wipe' }),
    cockpit: loose({ nomi: loose() }), audio: loose(), speech: loose({ say: () => 2.5, busy: false, queue: NONE, current: null }),
    ui: loose(), fx: loose(), pickups: loose({ update: () => NONE }),
    world: { trip: () => trip, stopping: () => !!arrival.pending, release: () => arrival.reset(), square: () => null, town: () => null },
  });
  game.start({ upgrades: {}, best: {} });
  const p = game.player;
  p.s = trip.s;
  p.x = trip.x;
  p.speed = 30;
  const said = [];
  const say = game.say.bind(game);
  game.say = (text, ...rest) => {
    if (text === BOARD.elefant) {
      const nx = trip.nextExit();
      said.push({ t: game.t, pair: !!elephantPair(T.cars, p.s), ab: trip.section.kind === 'ab' && !game.offAutobahn, room: !nx || nx.dist > ELEFANT.room });
    }
    return say(text, ...rest);
  };
  const lim = { left: 0, right: 0, shoulder: 0, lanes: null, extraLane: null, vmax: Infinity, decel: 0, slack: 0, closing: 0 };
  p.lawful = true; // ein braver Fahrer: auch sein Pedal hält die Tempolimits (Player.lawful)
  const ctl = { steer: 0, throttle: 0, brake: 0, kappa: 0, grade: 0, horn: false, wiper: false, megafon: false };
  const camera = new PerspectiveCamera(60, 16 / 9, 0.1, 3000);
  const SCENES = [
    [truck(3, 150), truck(2, 154)], // echtes Elefantenrennen
    [truck(3, 150)],
    [truck(3, 150), truck(2, 150 + ELEPHANTS.side + 20)],
    [truck(3, 150), car(2, 152)],
    [],
  ];
  const DTG = 1 / 30;
  let pairT = 0;
  for (let i = 0; i < 3600 / DTG; i++) {
    game.T.bid = Math.max(game.T.bid, 60);
    p.battery = 100;
    limitsFor(trip, lim, arrival.stop(trip));
    p.setLimits(lim);
    const sec = trip.section;
    let want = TRIP.L0;
    if (sec.kind === 'ab') {
      const f = sec.fork;
      want = 5.625;
      if (f && !f.taken && f.s - trip.s < TRIP.decel - 10 && (f.forced || trip.planFor(f) === 'exit')) want = TRIP.L0;
    }
    const dx = want - (p.x + p.vx * AUTO.look);
    ctl.steer = Math.abs(dx) > AUTO.tol ? Math.max(-1, Math.min(1, dx * AUTO.gain)) : 0;
    const v = Math.min(lim.vmax, 130 / 3.6);
    ctl.throttle = p.speed < v - 0.5 ? 1 : 0;
    ctl.brake = p.speed > v + 3 ? 0.4 : 0;
    // alle 15 s eine andere Lage vor dem Wagen (fährt mit ihm mit)
    const scene = SCENES[Math.floor(game.t / 15) % SCENES.length];
    T.cars = scene.map((c) => ({ ...c, s: p.s + (c.s - 1000), speed: c.truck ? 23.4 : 30 }));
    if (elephantPair(T.cars, p.s) && trip.section.kind === 'ab') pairT += DTG;
    game.offAutobahn = sec.kind !== 'ab';
    game.update(DTG, ctl, camera);
    for (const ev of trip.update(p.s, p.x)) game.onTrip(ev);
    arrival.update(trip, [], p.speed);
    if (game.over) break;
  }
  ok(!game.over, `Fahrt vorzeitig zu Ende (${game.over && game.over.reason})`);
  ok(said.length >= 3, `in einer Stunde nur ${said.length} Ansagen, obwohl ${pairT.toFixed(0)} s lang ein Elefantenrennen vor dem Wagen fuhr`);
  ok(said.every((e) => e.pair && e.ab && e.room), `Elefantenrennen angesagt ohne echtes Paar, abseits der Autobahn oder vor einer Ausfahrt: ${JSON.stringify(said.filter((e) => !(e.pair && e.ab && e.room)))}`);
  const gaps = said.slice(1).map((e, i) => e.t - said[i].t);
  ok(gaps.every((g) => g >= ELEFANT.cool - 1e-6), `Elefantenrennen zu dicht hintereinander angesagt: ${gaps.map((g) => g.toFixed(0)).join(', ')} s`);
  const og = orders.slice(1).map((o, i) => o.s - orders[i].s);
  ok(orders.every((o) => o.ab) && og.every((g) => g >= ELEFANT.every[0]), `Elefantenrennen bestellt abseits der Autobahn oder zu oft: ${JSON.stringify(orders)}`);
  console.log(`Elefantenrennen im Spiel: 1 h, ${pairT.toFixed(0)} s mit einem Paar vor dem Wagen, ${said.length} Ansagen (Abstand ≥ ${gaps.length ? Math.min(...gaps).toFixed(0) : '–'} s), ${orders.length} bestellt`);
}

// --- Durchsagen -----------------------------------------------------------------------------------------------
const lines = JSON.stringify(BOARD);
ok(!('leftLaneEnd' in BOARD) && !/gesperrt/i.test(lines), 'OMI sagt noch an, dass die linke Spur gesperrt wird');

// --- Elefantenrennen und Polizei im echten Verkehr (ohne Grafik, Leinwand als Attrappe) ---------------------------
const real = {};
{
  const canvas = new Proxy({}, { get: (t, k) => (k === 'measureText' ? (x) => ({ width: String(x).length * 10 }) : k === 'getImageData' || k === 'createImageData' ? (...a) => ({ data: new Uint8ClampedArray(a[a.length - 2] * a[a.length - 1] * 4) }) : k.startsWith?.('create') ? () => ({ addColorStop() {} }) : k in t ? t[k] : () => {}), set: (t, k, v) => ((t[k] = v), true) });
  globalThis.document ??= { createElement: () => ({ width: 0, height: 0, getContext: () => canvas, style: {} }) };
  const { Traffic } = await import('../src/world/traffic.js');
  const tr = new Traffic({ add() {} });
  tr.reset();
  const P = { s: 1000, x: 0, speed: 30, v: 30, len: 4.7, w: 1.9 };
  const env = { difficulty: 0, leftOpen: false, rain: 0 };
  tr.update(1 / 30, 10, P, env);
  const [a, b] = tr.elefantenrennen(P.s);
  // nach 26 s Spielzeit fahren beide wieder normal, auch der Lkw rechts (die Uhr ist die des Spiels, keine Wanduhr)
  let t = 10;
  const at = (sec) => {
    for (; t < sec; t += 1 / 30) {
      P.s += 30 / 30;
      tr.update(1 / 30, t, P, env);
    }
    return a.behavior + '/' + b.behavior;
  };
  real.mid = at(30);
  real.end = at(37);
  ok(real.mid === 'elefant/elefant' && real.end === 'normal/normal', `Elefantenrennen nach 20 s ${real.mid}, nach 27 s ${real.end}`);
  // Polizei von hinten: nie vor dem Beginn der Autobahn
  tr.begin = P.s - 80;
  ok(tr.police(P.s, 'X') === null, 'Polizei kommt, obwohl hinter dem Wagen nur 80 m Autobahn sind');
  for (const [back, want] of [[150, -110], [400, -170]]) {
    tr.begin = P.s - back;
    const cop = tr.police(P.s, 'X');
    ok(cop && cop.s - P.s === want, `Polizei mit ${back} m Autobahn dahinter bei ${cop && (cop.s - P.s).toFixed(0)} m statt ${want} m`);
  }
}

console.log(`Verkehr: Rücklicht ${LIGHTS.tail.join(' … ')}, Bremslicht ${LIGHTS.brake}; Bremslicht in der Kolonne ${J.flips} Wechsel in 20 s (${(J.lit * 100).toFixed(0)} % an); Elefantenrennen nur echt (${ELEPHANTS.near}–${ELEPHANTS.far} m voraus, höchstens ${ELEPHANTS.side} m versetzt), alle ${ELEFANT.every.map((m) => m / 1000).join('–')} km bestellt, Ansage höchstens alle ${ELEFANT.cool} s, Ende nach Spielzeit (${real.mid} → ${real.end}), Polizei nie vor dem Beginn der Autobahn`);
console.log(fails ? `${fails} FEHLER (${checks} Prüfungen)` : `verkehr-test: alles grün (${checks} Prüfungen)`);
process.exit(fails ? 1 : 0);
