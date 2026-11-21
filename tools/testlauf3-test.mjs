// Testlauf 3 (die Probefahrt des Besitzers vom 21.11.2026), ohne Grafik: node tools/testlauf3-test.mjs
// 1. Schneller als erlaubt: „Es sollte auf jeder Straße möglich sein, mehr als gesetzlich erlaubt zu fahren.“ Mit der
//    echten Fahrphysik (Player), dem Kurs der Karte und den Grenzen der Welt (plan.js limitsFor) fährt der Spieler mit
//    Vollgas auf jeder Straßenart (Ort, Rampe, Landstraße, Verbindung, Ladepark) deutlich schneller als das Limit; der
//    brave Fahrer (Autopilot, Player.lawful) und der Tempomat halten es, und am Navi-Ziel hält der Wagen trotzdem.
// 2. Ausfahrten besser ausgeschildert: Jede Anschlussstelle hat eine Nummer (je Autobahn eindeutig), die Vorwegweiser
//    1000 und 500 m tragen sie im Kästchen, und das Navi (nextExit, Ansage, OMI) nennt dieselbe Nummer und denselben
//    Namen wie die Tafel.
// 3. Winken: „Mini Adam winkt zu viel. Soll nur Menschen in der Stadt am Gehsteig, im Intro, wenn der Chat es will und
//    nach einem Unfall winken.“ Die Regel (game/wave.js) kennt genau diese vier Anlässe; an Fußgängern echter Orte
//    winkt er bei Stadttempo höchstens alle WAVE.cool Sekunden, beim Rasen nie; im Spiel winkt er nur nach „Wink mal!“
//    im Chat und nach einem Rempler (verlegen, kleiner), und kein anderer Weg im Code lässt ihn winken.
// 4. BrunnenTV lässt sich nicht überspringen: kein TV.skip, kein Game.skipBrunnenTV, keine Taste, kein Tipp aufs Bild,
//    kein Gamepad-Knopf und kein Text dazu; die Folge (am Ziel und unterwegs) läuft TV.end Sekunden (12–20 s), auch
//    wenn der Spieler alles drückt.
// 5. Zwei Stimmen im Sprachstudio: auf jedem Gerät (Edge, Windows, macOS, Chrome, Android, nur Frauen, eine Stimme) eine
//    Frau und ein Mann, die man auseinanderhört, nie wie OMI oder Mini Adam; im Stream Satz für Satz im Wechsel.
// 6. Tacho und Navi-Karte in der Drohnenansicht: ein Kärtchen in der Spalte des Chats (sicht.js droneHud) auf
//    Desktop, Handy und Tablet, nie in der freien Sicht, nie auf dem eigenen Wagen, dem Chat, den Touch-Knöpfen oder
//    dem Blitzerfoto; es zeigt Ausschnitte des Mittelbildschirms (dieselben Zahlen), der dafür weiterzeichnet, ohne
//    hochzuladen – und es ist nur in der Drohnenansicht während der Fahrt an, im Cockpit nie.
import { readFileSync } from 'node:fs';
import * as G from '../src/map/graph.js';
import * as shapes from '../src/map/shapes.js';
import { Trip, J, PROFILES } from '../src/game/trip.js';
import { Player } from '../src/game/player.js';
import { Course, MapPlanner } from '../src/game/course.js';
import { curveTable, curveAt } from '../src/curve.js';
import { limitsFor, autoTarget, autoDrive, AUTO, Arrival } from '../src/world/xxl/plan.js';
import { parkAt } from '../src/map/parks.js';
import { signsAlong, BOARD_D } from '../src/world/xxl/signplan.js';
import { exitLine } from '../src/game/game.js';
import { NavModel } from '../src/map/navroute.js';
import { WAVE, WaveRule, pedestrianAhead, walkerToWave } from '../src/game/wave.js';
import { STREET, TOWN_LEN } from '../src/world/kit/layout.js';
import { Game } from '../src/game/game.js';
import { CHAT } from '../src/data.js';
import { TV } from '../src/world/xxl/brunnentv.js';
import { Speech } from '../src/speech.js';
import { VOICES } from '../src/data.js';
import { PerspectiveCamera } from 'three';

let fails = 0;
let checks = 0;
const ok = (cond, msg) => {
  checks++;
  if (cond) return;
  fails++;
  console.log('FEHLER:', msg);
};
const f0 = (v) => v.toFixed(0);
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- 1. Tempo über dem Limit -----------------------------------------------------------------------------------------
const DT = 1 / 30;
/**
 * Eine Fahrt über metres Meter. who: 'frei' (der Spieler: Vollgas, lenkt wie der Autopilot, ohne Rücksicht auf das
 * Limit), 'brav' (dasselbe mit Player.lawful, auf der Autobahn bis 130 km/h), 'tempomat' (Tempomat auf 130 km/h, keine
 * Pedale), 'auto' (der Autopilot aus plan.js, lawful wie in main.js). park: an jeder Ausfahrt mit Ladepark einen
 * Ladestopp planen. (Wer mit über 200 km/h erst spät auf den Verzögerungsstreifen zieht, kommt auch brav zu schnell
 * auf die Rampe: Die geplante Bremsung braucht von dort mehr als den Streifen – das war schon immer so.)
 * Ergebnis: je Abschnittsart mit Limit das höchste Tempo über dem Limit (km/h), dazu Halte am Ziel und im Park.
 */
function drive(trip, metres, who, { park = false } = {}) {
  const p = new Player();
  p.lawful = who === 'brav' || who === 'auto';
  if (who === 'tempomat') p.configure({ cruise: true });
  p.s = trip.s;
  p.x = trip.x;
  p.speed = 40 / 3.6;
  if (who === 'tempomat') p.cruiseSet = AUTO.cruise;
  const course = new Course({ planner: new MapPlanner({ graph: G, shapes }) });
  const env = { kappa: 0, grade: 0 };
  course.fill(trip, p.s, curveTable, DT);
  const lim = {};
  const arrival = new Arrival();
  const over = new Map(); // Art → { limit, max, m }
  const out = { over, rests: 0, charges: 0, restKmh: [] };
  const end = p.s + metres;
  for (let guard = 0; p.s < end && guard < 200000; guard++) {
    const stop = arrival.stop(trip);
    limitsFor(trip, lim, stop);
    p.setLimits(lim);
    const sec = trip.section;
    if (park && sec.kind === 'ab' && sec.fork && !sec.fork.taken && !sec.fork.forced && trip.stop < 0) {
      const pk = parkAt(sec.fork.node);
      if (pk >= 0 && sec.fork.s - trip.s < 2500 && sec.fork.s - trip.s > J.decel) trip.setStop(pk);
    }
    const ctl = { steer: 0, throttle: who === 'tempomat' || (who === 'brav' && p.speed > AUTO.cruise) ? 0 : 1, brake: 0 };
    const want = autoTarget(trip);
    let k = 0;
    for (let d = 0; d <= AUTO.ahead; d += 20) k = Math.max(k, Math.abs(curveAt(d).k));
    if (who === 'auto') autoDrive(ctl, p, want, lim.vmax, k);
    else {
      const dx = want - (p.x + p.vx * AUTO.look);
      ctl.steer = Math.abs(dx) > AUTO.tol ? Math.max(-1, Math.min(1, dx * AUTO.gain)) : 0;
    }
    env.kappa = course.state.kappa;
    env.grade = course.state.grade;
    p.update(DT, ctl, env);
    const evs = trip.update(p.s, p.x);
    course.fill(trip, p.s, curveTable, DT);
    const P = trip.profile();
    if (P.limit > 0) {
      const kind = trip.section.kind;
      const o = over.get(kind) || { limit: P.limit, max: -Infinity, m: 0 };
      o.max = Math.max(o.max, p.kmh - P.limit);
      o.m += p.speed * DT;
      over.set(kind, o);
    }
    const rest = arrival.update(trip, evs, p.speed);
    if (rest && rest.type === 'rest') out.rests++;
    if (rest && rest.type === 'charge') out.charges++;
    if (rest) out.restKmh.push(p.kmh);
  }
  return out;
}
const kinds = (o) => [...o.over].map(([k, v]) => `${k} ${v.limit}: +${f0(v.max)} km/h (${f0(v.m)} m)`).join(', ');

{
  console.log('1. Schneller als erlaubt (Vollgas, Tempomat, Autopilot; Erlensee → Hanau, Bacharach, Köln mit Ladepark)');
  const runs = [
    ['Hanau', 1, 9000, {}],
    ['Bacharach', 3, 16000, {}],
    ['Köln', 2, 24000, { park: true }],
  ];
  const seen = { frei: new Map(), brav: new Map(), tempomat: new Map(), auto: new Map() };
  for (const who of ['frei', 'brav', 'tempomat', 'auto']) {
    for (const [name, seed, m, opts] of runs) {
      const trip = new Trip({ rng: rng(seed) });
      trip.setTarget(G.findPlace(name));
      const r = drive(trip, m, who, opts);
      for (const [k, v] of r.over) {
        const o = seen[who].get(k) || { limit: v.limit, max: -Infinity, m: 0 };
        o.max = Math.max(o.max, v.max);
        o.m += v.m;
        seen[who].set(k, o);
      }
      // am Ziel (und im Ladepark) hält jeder Wagen, auch der Raser: der Halt ist die einzige Grenze seines Pedals
      ok(r.restKmh.every((v) => v < 0.6), `${who} nach ${name}: Halt nicht im Stand (${r.restKmh.map(f0).join(', ')} km/h)`);
      if (name === 'Hanau') ok(r.rests === 1, `${who}: ${r.rests} Halte am Brunnen in Hanau`);
      if (opts.park) ok(r.charges >= 1, `${who}: kein Halt im Ladepark`);
    }
    console.log(`  ${who}: ${kinds({ over: seen[who] })}`);
  }
  // der Spieler: auf jeder Straßenart mit Limit deutlich schneller (mindestens 20 km/h über dem Schild)
  for (const k of ['stadt', 'ramp', 'auf', 'land', 'zub', 'conn', 'park']) {
    const o = seen.frei.get(k);
    if (!o) continue;
    ok(o.max >= 20, `Spieler im Abschnitt ${k} (Limit ${o.limit}) höchstens ${f0(o.max)} km/h über dem Limit`);
  }
  for (const k of ['stadt', 'ramp', 'auf', 'zub', 'conn', 'park']) ok(seen.frei.has(k), `keine Fahrt durch einen Abschnitt ${k}`);
  // brav, Tempomat und Autopilot halten das Limit (Einfahren mit geplanter Bremsung: wenige km/h darüber)
  for (const who of ['brav', 'tempomat', 'auto']) {
    for (const [k, o] of seen[who]) ok(o.max < 8, `${who} im Abschnitt ${k}: ${f0(o.max)} km/h über dem Limit ${o.limit}`);
  }
  // die Abschnittsarten der Welt haben ihre Limits wie auf den Schildern (Ort 50, Rampe 80, Landstraße 100)
  ok(PROFILES.stadt.limit === 50 && PROFILES.rampe.limit === 80 && PROFILES.land.limit === 100 && PROFILES.ab.limit === 0, 'Limits der Abschnitte');
}

// --- 2. Nummern der Ausfahrten: Tafel, Navi und OMI sagen dasselbe -------------------------------------------------
{
  // je Autobahn jede Nummer genau einmal, jede Anschlussstelle einer Autobahn hat eine
  const used = new Map();
  let numbered = 0;
  for (const r of G.roads) {
    if (r.kind !== 'ab') continue;
    for (const n of r.nodes) {
      const no = G.exitNumber(r.label, n);
      ok(no >= 1, `${r.label}: ${G.nodes[n].name} ohne Nummer`);
      const k = r.label + '|' + no;
      ok(!used.has(k) || used.get(k) === n, `${r.label}: Nummer ${no} doppelt (${G.nodes[n].name}, ${G.nodes[used.get(k)]?.name})`);
      used.set(k, n);
      numbered++;
    }
  }
  // Fahrten: an jeder Gabelung voraus (bis zur Gabelung) Tafel = nextExit = Ansage = OMI
  let boards = 0;
  let calls = 0;
  for (let r = 0; r < 6; r++) {
    const rnd = rng(900 + r);
    const trip = new Trip({ rng: rnd, start: Math.floor(rnd() * G.nodes.length) });
    const d = trip.distances();
    const cand = G.places.map((pl) => ({ i: pl.i, c: d.toPlace(pl.i).cost })).filter((c) => isFinite(c.c) && c.c > 40).sort((a, b) => a.c - b.c);
    if (!cand.length) continue;
    trip.setTarget(cand[Math.floor(rnd() * Math.min(cand.length, 30))].i);
    const nav = new NavModel(trip);
    const p = new Player();
    p.lawful = true;
    p.s = trip.s;
    p.x = trip.x;
    const lim = {};
    const arrival = new Arrival();
    for (let i = 0; i < 30 * 60 * 4 && p.s < trip.s + 12000; i++) {
      limitsFor(trip, lim, arrival.stop(trip));
      p.setLimits(lim);
      const ctl = { steer: 0, throttle: 0, brake: 0 };
      autoDrive(ctl, p, autoTarget(trip), lim.vmax, 0);
      p.update(DT, ctl, {});
      const evs = trip.update(p.s, p.x);
      arrival.update(trip, evs, p.speed);
      const nx = trip.nextExit();
      if (!nx || nx.kind === 'ende' || (i % 15)) continue;
      const sg = trip.signs(nx.fork);
      ok(nx.no >= 1 && nx.no === sg.no, `nextExit ${nx.title}: Nummer ${nx.no}, Tafel ${sg.no}`);
      // die Vorwegweiser dieser Gabelung tragen dieselbe Nummer und denselben Titel
      for (const e of signsAlong(trip, trip.cur, nx.fork.s - BOARD_D[0] - 1, nx.fork.s)) {
        if (e.kind !== 'vorweg' || e.fork !== nx.fork.id) continue;
        boards++;
        ok(e.no === nx.no && e.board.no === nx.no && e.title === nx.title, `Tafel ${e.texts[0]} [${e.no}] zur Ausfahrt ${nx.title} [${nx.no}]`);
      }
      // OMI nennt Nummer und Namen wie die Tafel
      if (nx.kind === 'ausfahrt') {
        calls++;
        ok(exitLine(nx).includes(nx.no + ' ' + nx.name), `OMI: „${exitLine(nx)}“ ohne „${nx.no} ${nx.name}“`);
      }
      // die Ansage einer Ausfahrt, die die Route nimmt, zeigt dieselbe Nummer wie ihre Tafel
      const ins = nav.instruction();
      if (ins.turn === 'exit' && ins.fork && !ins.fork.forced) ok(ins.no === trip.signs(ins.fork).no && ins.no >= 1, `Ansage ${ins.head}: Nummer ${ins.no}`);
    }
  }
  ok(boards >= 20 && calls >= 20, `zu wenig geprüft: ${boards} Tafeln, ${calls} Sätze`);
  console.log(`2. Nummern der Ausfahrten: ${numbered} Anschlussstellen nummeriert, ${boards} Tafeln und ${calls} OMI-Sätze mit derselben Nummer wie das Navi`);
}

/** Ein Spiel ohne Grafik wie in tools/geld-test.mjs (Reise, Stream ohne Ende); chat sammelt den Chat, ui erweitert die UI. */
function newGame(seed, { ui = {}, world = {} } = {}) {
  const NONE = [];
  const noop = () => {};
  const loose = (base = {}) => new Proxy(base, { get: (t, k) => (k in t ? t[k] : noop) });
  Math.random = rng(seed);
  const trip = new Trip({ rng: Math.random });
  const arrival = new Arrival();
  const chat = [];
  const said = [];
  let ids = 0;
  const game = new Game({
    traffic: loose({ cars: NONE, update: () => NONE, nearby: () => NONE, police: () => null, megafon: () => 0 }),
    scenery: loose({ request: () => ++ids, landmarkSpot: (x) => x, placed: () => null }),
    road: loose(), sky: loose(), rain: loose(), fx: loose(), audio: loose(),
    windshield: loose({ firmware: 0, manual: () => 'wipe' }),
    cockpit: loose({ nomi: loose() }),
    speech: loose({ say: (text, voice, o) => (said.push({ t: game.t, text, voice }), o && o.onStart && o.onStart(2.5), 2.5), busy: false, queue: NONE, current: null }),
    ui: loose({ chat: (m) => chat.push({ t: game.t, ...m }), ...ui }),
    pickups: loose({ update: () => NONE }),
    world: { trip: () => trip, stopping: () => !!arrival.pending, release: () => arrival.reset(), square: () => null, town: () => null, ...world },
  });
  game.endless = true;
  game.start({ upgrades: {}, best: {} });
  return { game, trip, arrival, chat, said };
}

let stream12 = [];

// --- 3. Winken nur zu vier Anlässen ---------------------------------------------------------------------------------
{
  // die Regel selbst
  const r = new WaveRule();
  ok(WAVE.why.join() === 'intro,gehsteig,chat,unfall', `Anlässe: ${WAVE.why.join()}`);
  for (const why of ['titel', 'ladestopp', 'abspann', 'spende', 'ziel', 'losfahren', 'start', 'wave', 'brunnen']) ok(r.ask(why, 100) === 0 && !r.may(why, 100), `winkt zu „${why}“`);
  ok(r.ask('intro', 0) === 1 && r.ask('intro', 60) === 0 && r.ask('intro', 600) === 0, 'Intro: genau einmal je Stream');
  ok(r.ask('gehsteig', 10) === 0, 'Fußgänger 10 s nach dem Intro-Gruß');
  ok(r.ask('gehsteig', WAVE.cool) === 1 && r.ask('gehsteig', WAVE.cool + 20) === 0 && r.ask('gehsteig', 2 * WAVE.cool) === 1, `Fußgänger: höchstens alle ${WAVE.cool} s`);
  const kc = r.ask('chat', 2 * WAVE.cool + 1);
  const ku = r.ask('unfall', 2 * WAVE.cool + 2);
  ok(kc === 1 && ku === WAVE.small && ku > 0.5 && ku < 1, `Chat ${kc}, Unfall ${ku} (klein und verlegen)`);
  ok(r.ask('gehsteig', 2 * WAVE.cool + 10) === 0, 'Fußgänger gleich nach dem Gruß an den Chat');
  r.reset();
  ok(r.may('intro', 0) && r.ask('gehsteig', 0) === 1, 'neuer Stream: Intro wieder offen, Fußgänger frei');

  // wer gilt als Mensch am Gehweg
  const u = 100;
  const R = STREET.curbR + STREET.strip + 1;
  const Lx = STREET.curbL - STREET.strip - 1;
  const at = (name, x, d) => ({ name, x, y: 0, z: -(u + d), ry: 0 });
  ok(pedestrianAhead([at('frau_walk', R, 20)], u)?.side === 1, 'Fußgängerin rechts am Gehweg, 20 m voraus');
  ok(pedestrianAhead([at('opa_walk', Lx, 12)], u)?.side === -1, 'Fußgänger links am Gehweg, 12 m voraus');
  ok(!pedestrianAhead([at('frau_walk', R, 45)], u) && !pedestrianAhead([at('frau_walk', R, 3)], u) && !pedestrianAhead([at('frau_walk', R, -8)], u), 'zu weit, zu nah oder schon vorbei');
  ok(!pedestrianAhead([at('kind_wave', 26, 15)], u) && !pedestrianAhead([at('mann_stand', STREET.lane, 15)], u), 'auf dem Platz oder auf der Fahrbahn');
  ok(!pedestrianAhead([at('bench', R, 15), at('dog', R, 16), at('streetTree', R, 17)], u), 'Bank, Hund, Baum');
  ok(pedestrianAhead([at('mann_walk', R, 25), at('oma_walk', R, 9)], u)?.name === 'oma_walk', 'der nächste zuerst');

  // echte Orte aus dem Stadtbaukasten: einmal mit 50 km/h hindurch, einmal mit 100 km/h
  if (!globalThis.document) {
    const ctx = new Proxy({}, {
      get(t, k) {
        if (k === 'measureText') return (x) => ({ width: String(x).length * 10 });
        if (k === 'createLinearGradient' || k === 'createRadialGradient') return () => ({ addColorStop() {} });
        if (k === 'getImageData') return (x, y, w, h) => ({ data: new Uint8ClampedArray(w * h * 4) });
        if (k in t) return t[k];
        return () => {};
      },
      set(t, k, v) {
        t[k] = v;
        return true;
      },
    });
    globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => ctx, style: {} }) };
  }
  const { W } = await import('../src/curve.js');
  const { createCityKit } = await import('../src/world/kit/city.js');
  const city = createCityKit(W);
  const towns = G.places.filter((pl) => pl.pop > 20000).slice(0, 24);
  let slowWaves = 0;
  let fastWaves = 0;
  let people = 0;
  let minGap = Infinity;
  for (const [i, pl] of towns.entries()) {
    const size = ['klein', 'stadt', 'gross'][i % 3];
    const plan = city.planTown(pl, { size, seed: 7 + i });
    people += plan.items.filter((it) => /_(walk|wave|stand)$/.test(it.name)).length;
    for (const kmh of [50, 100]) {
      const rule = new WaveRule();
      rule.ask('intro', -100);
      const v = kmh / 3.6;
      let last = -Infinity;
      for (let t = 0, uu = 0; uu < TOWN_LEN[size]; t += 0.25, uu += v * 0.25) {
        const who = walkerToWave(rule, t, v, plan.items, uu);
        if (!who || !rule.ask('gehsteig', t)) continue;
        const d = -who.z - uu;
        ok(d >= WAVE.near[0] && d <= WAVE.near[1] && Math.abs(who.side) === 1, `${pl.name}: winkt ${who.name} in ${d.toFixed(1)} m (x ${who.x})`);
        if (kmh === 50) {
          slowWaves++;
          minGap = Math.min(minGap, t - last);
          last = t;
        } else fastWaves++;
      }
    }
  }
  ok(slowWaves >= towns.length && minGap >= WAVE.cool, `mit 50 km/h durch ${towns.length} Orte: ${slowWaves} Grüße, kürzester Abstand ${minGap.toFixed(1)} s`);
  ok(fastWaves === 0, `mit 100 km/h durch den Ort: ${fastWaves} Grüße`);

  // im Spiel: „Wink mal!“ im Chat, dann winkt er; nach einem Rempler ein kleiner Gruß; sonst nie
  const { game, trip, arrival, chat, said } = newGame(31);
  stream12 = said;
  const waves = [];
  game.onMood = (name, k, o) => {
    if (name === 'wave') waves.push({ t: game.t, k, o });
  };
  const p = game.player;
  p.s = trip.s;
  p.x = trip.x;
  p.speed = 40 / 3.6;
  p.lawful = true;
  const lim = {};
  const camera = new PerspectiveCamera(60, 16 / 9, 0.1, 3000);
  const ctl = { steer: 0, throttle: 0, brake: 0, kappa: 0, grade: 0, horn: false, wiper: false, megafon: false };
  let crashT = -1;
  for (let i = 0; i < Math.round(720 / DT) && !game.over; i++) {
    limitsFor(trip, lim, arrival.stop(trip));
    p.setLimits(lim);
    const want = autoTarget(trip);
    const dx = want - (p.x + p.vx * AUTO.look);
    ctl.steer = Math.abs(dx) > AUTO.tol ? Math.max(-1, Math.min(1, dx * AUTO.gain)) : 0;
    ctl.throttle = p.speed < Math.min(lim.vmax, 120 / 3.6) - 0.5 ? 1 : 0;
    game.offAutobahn = trip.section.kind !== 'ab';
    game.update(DT, ctl, camera);
    p.battery = 100;
    // nach fünf Minuten ein Rempler von hinten auf ein langsames Auto
    if (crashT < 0 && game.t > 300 && !game.tv && !game.charging) {
      crashT = game.t;
      game.onCrash({ type: 'crash', car: { s: p.s + 4.6, len: 4.4, speed: p.speed - 4, behavior: 'normal' }, ds: 4.6, lonOverlap: 0.4, latOverlap: 1.5 });
    }
    const evs = trip.update(p.s, p.x);
    for (const e of evs) game.onTrip(e);
    const rest = arrival.update(trip, evs, p.speed);
    if (rest) game.onTrip(rest);
  }
  const asks = chat.filter((m) => CHAT.winkMal.includes(m.text));
  const chatWaves = waves.filter((w) => w.k === 1);
  const crashWaves = waves.filter((w) => w.k < 1);
  ok(asks.length >= 2 && chatWaves.length === asks.length, `12 Minuten Stream: ${asks.length}× „Wink mal!“, ${chatWaves.length} Grüße`);
  for (const w of chatWaves) ok(asks.some((m) => Math.abs(w.t - m.t - WAVE.chatDelay) < 0.05), `Gruß bei ${w.t.toFixed(1)} s ohne „Wink mal!“ ${WAVE.chatDelay} s vorher`);
  ok(crashT > 0 && crashWaves.length === 1 && Math.abs(crashWaves[0].t - crashT - WAVE.afterCrash) < 0.05 && crashWaves[0].k === WAVE.small, `Rempler bei ${crashT.toFixed(1)} s: ${crashWaves.map((w) => w.t.toFixed(1) + ' s Stärke ' + w.k).join(', ') || 'kein Gruß'}`);
  ok(waves.length === chatWaves.length + crashWaves.length, `weitere Grüße: ${waves.length - chatWaves.length - crashWaves.length}`);

  // kein anderer Weg im Code: winken nur über die Regel
  const src = (f) => readFileSync(new URL('../src/' + f, import.meta.url), 'utf8');
  const main = src('main.js');
  const gameSrc = src('game/game.js');
  const reasons = [...main.matchAll(/waveAt\('(\w+)'/g), ...gameSrc.matchAll(/waveAt\('(\w+)'/g), ...main.matchAll(/waves\.ask\('(\w+)'/g)].map((m) => m[1]);
  ok(reasons.length >= 5 && reasons.every((x) => WAVE.why.includes(x)), `Anlässe im Code: ${reasons.join(', ')}`);
  ok((gameSrc.match(/onMood\('wave'/g) || []).length === 1 && !/adamMood\('wave'/.test(main), 'winken nur über Game.waveAt');
  ok((main.match(/adamWave = /g) || []).length === 2 && main.includes('adamWave = c.wave;'), 'äußeres Winken nur in der Startszene (Intro)');
  ok(!/wave:/.test(main.slice(main.indexOf('function stopPlace'), main.indexOf('function stopPlace') + 3000)), 'Ladestopp: kein Winken');
  console.log(`3. Winken: ${slowWaves} Grüße an Fußgänger in ${towns.length} Orten (${people} Menschen, kürzester Abstand ${minGap.toFixed(0)} s, mit 100 km/h ${fastWaves}), im Stream ${asks.length}× „Wink mal!“ → ${chatWaves.length} Grüße, Rempler → ${crashWaves.length} kleiner Gruß`);
}

// --- 4. BrunnenTV lässt sich nicht überspringen ------------------------------------------------------------------------
{
  const src = (f) => readFileSync(new URL('../src/' + f, import.meta.url), 'utf8');
  const main = src('main.js');
  ok(TV.skip === undefined && typeof Game.prototype.skipBrunnenTV === 'undefined', 'BrunnenTV: TV.skip oder Game.skipBrunnenTV gibt es noch');
  ok(TV.end >= 12 && TV.end <= 20, `Folge dauert ${TV.end} s (gewünscht etwa 12–20 s)`);
  ok(!/sceneSkip\(tvRun/.test(main) && !/tvRun\.skipT/.test(main), 'main.js: Tasten oder Gamepad überspringen die Folge');
  const tap = main.slice(main.indexOf("addEventListener('pointerdown'"), main.indexOf("addEventListener('pointerdown'") + 160);
  ok(tap.includes('stopRun.on') && !tap.includes('tvRun'), `main.js: ein Tipp aufs Bild überspringt die Folge (${tap.split('\n')[1]})`);
  // kein Text, kein Tipp, keine Taste spricht mehr vom Überspringen der Folge (Startszene und Ladestopp schon)
  const texts = ['ui/controls.js', 'ui/first-tips.js', 'ui/drive-hint.js', 'ui/menus.js', 'data.js', 'world/xxl/brunnentv.js'].map((f) => [f, src(f)]);
  for (const [f, t] of texts) ok(!/BrunnenTV[^'`\n]{0,40}(überspring|skip)|(überspring|skip)[^'`\n]{0,40}BrunnenTV/i.test(t.replace(/^\s*(\/\/|\*).*$/gm, '')), `${f}: Text über das Überspringen von BrunnenTV`);
  ok(/id: 'skip'.*note: 'Startszene und Ladestopp\.'/.test(src('ui/controls.js')), 'Steuerung: „Szene überspringen“ nennt noch BrunnenTV');
  // eine Folge am Ziel, während der Spieler alles drückt, was die Steuerung hergibt: Sie läuft bis TV.end
  for (const way of [false, true]) {
    const log = [];
    const { game } = newGame(77, { ui: { brunnenTV: (n) => log.push({ t: game.t, n }) } });
    const nv = game.navi;
    const target = nv.targets.find((t) => t.name === 'Würzburg') || nv.targets[0];
    nv.stop(target.place);
    if (way) game.startBrunnenTV({ place: target.place, name: target.name }, null, { way: true });
    else {
      game.halt = { sec: { kind: 'stadt', place: target.place, s0: 0, s1: 800, spotS: 480 }, still: 0 };
      game.arriveAtFountain();
    }
    ok(!!game.tv, `${way ? 'unterwegs' : 'am Ziel'}: keine Folge`);
    const t0 = game.t;
    const all = { steer: 1, throttle: 1, brake: 0, reverse: true, horn: true, wiper: true, megafon: true, ladestopp: true, brunnen: true, device: 'keyboard', kappa: 0, grade: 0 };
    const camera = new PerspectiveCamera(60, 16 / 9, 0.1, 3000);
    let end = -1;
    for (let i = 0; i < 30 * 30 && end < 0; i++) {
      game.player.speed = 0;
      game.update(DT, all, camera);
      if (!game.tv) end = game.t - t0;
    }
    ok(Math.abs(end - TV.end) < 2.5 * DT, `${way ? 'unterwegs' : 'am Ziel'}: Folge endet nach ${end.toFixed(2)} s statt ${TV.end} s`);
    ok(log.length >= 2 && log[0].n > 0 && log[log.length - 1].n === 0, `${way ? 'unterwegs' : 'am Ziel'}: Bauchbinde ${log.map((e) => e.n).join(' → ')}`);
  }
  console.log(`4. BrunnenTV: ${TV.end} s am Stück, am Ziel und unterwegs, auch wenn der Spieler alles drückt; kein Weg zum Überspringen (Tasten, Tipp aufs Bild, Gamepad, Texte)`);
}

// --- 5. Zwei Stimmen im Sprachstudio -------------------------------------------------------------------------------
{
  const de = (names) => names.map((name) => ({ name, lang: 'de-DE' }));
  const SETS = {
    'Edge (Windows, natürliche Stimmen)': ['Microsoft Katja Online (Natural) - German (Germany)', 'Microsoft Conrad Online (Natural) - German (Germany)', 'Microsoft Amala Online (Natural) - German (Germany)', 'Microsoft Killian Online (Natural) - German (Germany)', 'Microsoft Seraphina Online (Natural) - German (Germany)', 'Microsoft Florian Online (Natural) - German (Germany)'],
    'Windows': ['Microsoft Hedda - German (Germany)', 'Microsoft Katja - German (Germany)', 'Microsoft Stefan - German (Germany)'],
    macOS: ['Anna', 'Markus', 'Petra', 'Yannick', 'Helena', 'Viktor'],
    'Chrome (Google)': ['Google Deutsch', 'Anna'],
    'Android': ['Deutsch (Deutschland) female 1', 'Deutsch (Deutschland) male 1', 'Deutsch (Deutschland) female 2', 'Deutsch (Deutschland) male 2'],
    'nur Frauenstimmen': ['Anna', 'Petra', 'Helena'],
    'eine Stimme': ['Anna'],
  };
  const male = (v) => /Conrad|Killian|Florian|Stefan|Markus|Yannick|Viktor|\bmale\b/i.test(v.name);
  const rows = [];
  for (const [dev, names] of Object.entries(SETS)) {
    const sp = new Speech();
    sp.voices = de(names);
    const omi = sp.pickVoice('board');
    const adam = sp.pickVoice('adam');
    const st = sp.studioVoices();
    const f = sp.pickVoice('sprachstudio');
    const m = sp.pickVoice('sprachstudioM');
    const pf = sp.pitchFor('sprachstudio');
    const pm = sp.pitchFor('sprachstudioM');
    ok(f === st.f && m === st.m && f && m, `${dev}: Studio-Stimmen ${f && f.name} / ${m && m.name}`);
    // zwei Rollen, die man auseinanderhört: zwei Stimmen, oder eine Stimme deutlich höher und tiefer
    ok(f !== m || pf - pm >= 0.25, `${dev}: Frau und Mann klingen gleich (${f.name} ${pf} / ${m.name} ${pm})`);
    // OMI und Mini Adam bleiben eigene Stimmen: andere Stimme oder deutlich andere Tonhöhe
    for (const [who, v, p] of [['OMI', omi, VOICES.board.pitch], ['Mini Adam', adam, VOICES.adam.pitch]]) {
      for (const [role, sv, sp2] of [['Frau', f, pf], ['Mann', m, pm]]) ok(sv !== v || Math.abs(sp2 - p) >= 0.15, `${dev}: Studio-${role} klingt wie ${who} (${sv.name} ${sp2} / ${v.name} ${p})`);
    }
    // gibt es genug Stimmen, bekommt jeder seine eigene; die Frau ist keine Männerstimme, der Mann eine, wo es eine gibt
    const males = sp.voices.filter((v) => male(v) && v !== omi);
    if (names.length >= 4) ok(new Set([omi, adam, f, m]).size === 4, `${dev}: OMI ${omi.name}, Mini Adam ${adam.name}, Studio ${f.name} / ${m.name}`);
    ok(!male(f) || sp.voices.every(male), `${dev}: Studio-Frau ist ${f.name}`);
    if (males.length) ok(male(m) && pm === VOICES.sprachstudioM.pitch, `${dev}: Studio-Mann ist ${m.name} (${pm})`);
    rows.push(`${dev}: OMI ${omi.name.replace(/Microsoft | Online \(Natural\) - German \(Germany\)| - German \(Germany\)/g, '')}, Mini Adam ${adam.name.replace(/Microsoft | Online \(Natural\) - German \(Germany\)| - German \(Germany\)/g, '')}, Studio ${[f, m].map((v, i) => v.name.replace(/Microsoft | Online \(Natural\) - German \(Germany\)| - German \(Germany\)/g, '') + ' ' + [pf, pm][i]).join(' / ')}`);
  }
  // im Stream: die Sätze des Studios wechseln Frau und Mann ab, der Untertitel bleibt „Sprachstudio“
  const studio = stream12.filter((x) => /^sprachstudio/.test(x.voice));
  ok(studio.length >= 6, `12 Minuten Stream: nur ${studio.length} Sätze des Studios`);
  ok(studio.every((x, i) => x.voice === (i % 2 ? 'sprachstudioM' : 'sprachstudio')), `Wechsel Frau/Mann: ${studio.map((x) => (x.voice === 'sprachstudio' ? 'F' : 'M')).join('')}`);
  ok(VOICES.sprachstudio.label === 'Sprachstudio' && VOICES.sprachstudioM.label === 'Sprachstudio', 'Untertitel des Studios heißt anders');
  console.log(`5. Sprachstudio mit zwei Stimmen (im Stream ${studio.length} Sätze, Frau und Mann im Wechsel):\n  ${rows.join('\n  ')}`);
}

// --- 6. Tacho und Navi-Karte in der Drohnenansicht ----------------------------------------------------------------
{
  const S = await import('../src/ui/sicht.js');
  const { DroneHud, TACHO_SRC, MAP_SRC } = await import('../src/ui/drone-hud.js');
  const { CenterScreen, SCREEN_PX } = await import('../src/cockpit/screen.js');
  // Desktop, Laptop, breite niedrige Fenster, Handys quer und hochkant, Tablets hochkant und quer
  const FORMATS = [
    [1920, 1080, false], [1280, 720, false], [1366, 768, false], [1920, 600, false], [1024, 600, false], [844, 390, false],
    [844, 390, true], [667, 375, true], [932, 430, true], [390, 844, true], [360, 780, true], [768, 1024, true],
    [820, 1180, true], [1024, 768, true], [1180, 820, true],
  ];
  const rows = [];
  for (const [w, h, touch] of FORMATS) {
    const name = `${w}×${h}${touch ? ' Touch' : ''}`;
    const r = S.droneHud(w, h, { touch });
    const box = { left: r.left, top: r.top, right: r.left + r.width, bottom: r.top + r.height };
    ok(r.width > 40 && r.height > 40 && Number.isInteger(r.height), `${name}: kein Platz für Tacho und Karte (${r.width} × ${r.height})`);
    ok(!S.overlap(box, S.freeView(w, h, { touch })), `${name}: Tacho und Karte in der freien Sicht`);
    ok(!S.overlap(box, S.droneCar(w, h)), `${name}: Tacho und Karte auf dem eigenen Wagen`);
    ok(box.left >= 0 && box.top >= 0 && box.right <= w && box.bottom <= h, `${name}: außerhalb des Fensters`);
    // am Rand: rechts in der Spalte des Chats, so breit wie er
    ok(Math.abs(box.right - (w - 14)) <= 1 && Math.abs(r.width - S.chatWidth(w, h)) <= 1, `${name}: nicht in der Spalte des Chats`);
    if (r.chatTop != null) {
      // hochkant über dem Chat: Der rückt darunter und endet unten, wo er sonst endet (der Streifen oben bleibt)
      ok(r.top === 14 && r.chatTop >= box.bottom + 4 && Math.abs(r.chatTop + r.chatMax - S.chatBottom(h)) <= 1 && r.chatMax >= 60, `${name}: Chat unter dem Kärtchen (${r.chatTop} + ${r.chatMax})`);
    } else {
      ok(box.top >= S.chatBottom(h) + 8, `${name}: Kärtchen auf dem Chat`);
      ok(box.bottom <= (touch ? h - S.touchTop(w, h) - 4 : S.photoTop(w, h) - 4), `${name}: Kärtchen auf den Touch-Knöpfen oder dem Blitzerfoto`);
    }
    rows.push(`${name}: ${r.width}×${r.height} ${r.side ? 'nebeneinander' : 'untereinander'}${r.chatTop != null ? ', Chat darunter' : ''}`);
  }

  // die Ausschnitte: der Tacho im Feld des Wagens (Zahl, km/h, Tempolimit-Schild), das ganze Navi ohne Statusleiste
  // und Dock (Ansage, nächste Ausfahrt, Route, Ziel mit Entfernung und Ankunft)
  const [CW, CH] = SCREEN_PX;
  ok(TACHO_SRC.x >= 0 && TACHO_SRC.x + TACHO_SRC.w <= 372 && TACHO_SRC.x < 186 - 90 && TACHO_SRC.x + TACHO_SRC.w >= 314 + 38 && TACHO_SRC.y <= 196 - 76 && TACHO_SRC.y + TACHO_SRC.h >= 238, 'Tacho-Ausschnitt verfehlt Zahl, Einheit oder Schild');
  ok(MAP_SRC.x === 372 && MAP_SRC.x + MAP_SRC.w === CW && MAP_SRC.y === 44 && MAP_SRC.y + MAP_SRC.h === CH - 64, 'Navi-Ausschnitt');

  // das Kärtchen selbst, mit einem kleinen DOM-Ersatz
  const elem = (tag) => {
    const cls = new Set();
    const e = {
      tag, children: [], calls: [], width: 300, height: 150,
      style: { setProperty(k, v) { this[k] = v; } },
      classList: { toggle: (c, v) => (v ? cls.add(c) : cls.delete(c), !!v), contains: (c) => cls.has(c) },
      set className(v) { cls.clear(); for (const c of String(v).split(/\s+/)) if (c) cls.add(c); },
      appendChild(c) { this.children.push(c); return c; },
    };
    e.getContext = () => ({ clearRect() {}, drawImage: (...a) => e.calls.push(a) });
    return e;
  };
  const doc0 = globalThis.document;
  globalThis.document = { createElement: elem };
  const parent = elem('div');
  const hud = new DroneHud(parent);
  hud.place(S.droneHud(1280, 720), 2);
  const T = hud.tacho;
  const M = hud.map;
  ok(T.width === Math.round(parseFloat(T.style.width) * 2) && M.height === Math.round(parseFloat(M.style.height) * 2), 'Zeichenflächen in Gerätepixeln (DPR 2)');
  ok(!hud.el.classList.contains('side') && parseFloat(M.style.width) >= 280 && parseFloat(M.style.height) >= 200, `Laptop: Karte ${M.style.width} × ${M.style.height}`);
  const src = { id: 'Mittelbildschirm' };
  hud.copy(src);
  ok(!T.calls.length && !M.calls.length && !hud.el.classList.contains('on'), 'aus: nichts zu sehen, nichts herübergeholt');
  hud.show(true);
  hud.copy(src);
  const [a] = T.calls;
  const [b] = M.calls;
  ok(hud.el.classList.contains('on') && a && b && a[0] === src && b[0] === src, 'an: beide Ausschnitte herübergeholt');
  ok(a && a.slice(1, 5).join() === [TACHO_SRC.x, TACHO_SRC.y, TACHO_SRC.w, TACHO_SRC.h].join() && b && b.slice(1, 5).join() === [MAP_SRC.x, MAP_SRC.y, MAP_SRC.w, MAP_SRC.h].join(), 'die Ausschnitte des Mittelbildschirms');
  const inside = (c, q) => q[5] >= 0 && q[6] >= 0 && q[5] + q[7] <= c.width + 0.5 && q[6] + q[8] <= c.height + 0.5 && Math.abs(q[7] / q[8] - q[3] / q[4]) < 0.02;
  ok(a && b && inside(T, a) && inside(M, b), 'ganz zu sehen, unverzerrt');
  hud.place(S.droneHud(390, 844, { touch: true }), 3);
  ok(hud.el.classList.contains('side') && hud.el.classList.contains('over-chat') && parent.style['--dh-chat-top'] === '103px' && parent.style['--dh-chat-max'] === '91px', `Handy hochkant: nebeneinander, Chat darunter (${parent.style['--dh-chat-top']}, ${parent.style['--dh-chat-max']})`);
  hud.place(S.droneHud(844, 390, { touch: true }), 3);
  ok(hud.el.classList.contains('side') && !hud.el.classList.contains('over-chat'), 'Handy quer: nebeneinander unter dem Chat');
  hud.place(null);
  ok(!hud.on && !hud.el.classList.contains('on'), 'ohne Platz aus');
  globalThis.document = doc0;

  // der Mittelbildschirm: zeichnet in der Drohnenansicht für das Kärtchen weiter (ohne Hochladen), sonst wie bisher
  const fake = { acc: 0, spin: 0, live: false, hudOut: false, onDraw: null, texture: { needsUpdate: false }, drawn: 0, draw() { this.drawn++; } };
  const up = (visible) => CenterScreen.prototype.update.call(fake, 0.1, { nav: { visible } });
  let got = 0;
  up(false);
  ok(fake.drawn === 0 && !fake.texture.needsUpdate, 'ohne Cockpit und ohne Kärtchen ruht der Bildschirm');
  fake.onDraw = () => got++;
  fake.hudOut = true;
  up(false);
  ok(fake.drawn === 1 && got === 1 && !fake.texture.needsUpdate, 'Drohnenansicht: zeichnen und ans Kärtchen geben, nicht hochladen');
  fake.hudOut = false;
  up(true);
  ok(fake.drawn === 2 && got === 1 && fake.texture.needsUpdate, 'Cockpit: zeichnen und hochladen, das Kärtchen bekommt nichts');

  // nur in der Drohnenansicht während der Fahrt (main.js), im Cockpit nie (style.css); HUD und Kärtchen nennen dieselbe Zahl
  const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../docs/style.css', import.meta.url), 'utf8');
  const uiSrc = readFileSync(new URL('../src/ui/ui.js', import.meta.url), 'utf8');
  ok(/const droneHudOn = state === 'drive' && view === 'drone' && !cockpitOn && !stopRun\.on && !tvRun\.on;/.test(main) && main.includes('ui.droneHud.show(droneHudOn);') && main.includes('cockpit.screen.hudOut = ui.droneHud.on;') && main.includes('cockpit.screen.onDraw = (c, navi) => ui.droneHud.copy(c, navi);'), 'main.js schaltet das Kärtchen nur in der Drohnenansicht ein');
  ok(main.includes('cockpit.screen.live || cockpit.screen.hudOut ? cockpit.screen.kmh : null'), 'HUD-Tempo und Tacho des Kärtchens aus demselben Bild');
  ok(/\.drone-hud \{ position: absolute; display: none;/.test(css) && css.includes('body.drone .drone-hud.on { display: flex; }') && (css.match(/drone-hud[^{]*\{[^}]*display: flex/g) || []).every((r) => r.startsWith('drone-hud.on') || r.includes('body.drone')), 'style.css: nur mit body.drone zu sehen');
  ok(uiSrc.includes('this.droneHud.place(droneHud(W, window.innerHeight, { touch: COARSE.matches, narrow }), window.devicePixelRatio || 1);'), 'ui.js legt das Kärtchen nach sicht.js');
  ok(!!S.HOMES.tacho && !!S.HOMES.karte, 'Plätze in HOMES');
  console.log(`6. Tacho und Navi-Karte in der Drohnenansicht (Ausschnitte des Mittelbildschirms, Spalte des Chats):\n  ${rows.join('\n  ')}`);
}

console.log(`${checks} Prüfungen, ${fails} Fehler`);
if (fails) process.exit(1);
