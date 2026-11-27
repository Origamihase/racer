// Ein simulierter Stream ohne Grafik für die Prüfstände (ansagen-test, Messwerkzeuge): das echte Spiel (Game, Stream-
// Kasse, WorldNavi, BrunnenTV, Zufriedenheit) auf der echten Fahrt über die Karte (Trip) mit dem Halt am Brunnen
// (Arrival) und einem Fahrer, der dem Navi folgt – wie tools/journey-test.mjs, nur klein und wiederverwendbar.
// Mitgeschrieben wird, was Spieler und Chat erfahren: jede Chatzeile, jede gesprochene Zeile (mit Stimme), jeder
// Hinweis am Rand – je mit Spielzeit und der Lage in diesem Moment (Abschnitt, Tempo, Regen, Funkloch, Folge).
import { PerspectiveCamera } from 'three';
import { Trip, J } from '../src/game/trip.js';
import { Game, FACTS } from '../src/game/game.js';
import { limitsFor, Arrival, AUTO } from '../src/world/xxl/plan.js';

export function mulberry32(a) {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NONE = [];
const noop = () => {};
const loose = (base = {}) => new Proxy(base, { get: (t, k) => (k in t ? t[k] : noop) });

/**
 * Fahrer: cruise Wunschtempo (km/h, Limits hält der Begrenzer ein), dawdle: steht nach jeder Folge so viele Sekunden, bevor er weiterfährt (der Trödler).
 */
export const DRIVERS = {
  zuegig: { name: 'zügig', cruise: 185 },
  mittel: { name: 'mittel', cruise: 145 },
  gemuetlich: { name: 'gemütlich', cruise: 110 },
  troedler: { name: 'Trödler', cruise: 95, dawdle: 25 },
};

/**
 * Baut einen Stream. opts: driver (DRIVERS), seed, upgrades, traffic (Ersatz für den Verkehr), endless (der Stream
 * endet nicht, wenn nach einer Folge niemand bietet: Game.endless), start (Knoten des Startorts, game/starts.js;
 * Standard Erlensee), wallet (das Guthaben des Spielstands vor dem Stream, auch im Minus; Standard 0), charge (der Akku
 * leert sich wirklich, und der Fahrer plant bei jeder Warnung OMIs den Ladestopp, den sie nennt – wie der Lader der
 * journey-test; sonst steht der Akku nach jedem Bild wieder auf 100).
 * Liefert { game, trip, p, log, step(secs), state() }; log.chat/log.say/log.toast: [{ t, text, name|voice, at }],
 * at = state() im Moment der Meldung; Chatzeilen der Running Gags (gags.js) tragen gag: true.
 */
export function makeStream({ driver = DRIVERS.mittel, seed = 1, upgrades = {}, traffic = null, endless = false, start, wallet = 0, charge = false } = {}) {
  Math.random = mulberry32(seed);
  const trip = new Trip({ rng: Math.random, start });
  const arrival = new Arrival();
  arrival.hold = true;
  const camera = new PerspectiveCamera(60, 16 / 9, 0.1, 3000);
  const log = { chat: [], say: [], toast: [], speak: [], tv: [], funk: [] };
  let game = null;
  const state = () => {
    const sec = trip.section;
    return { t: game ? game.t : 0, kind: sec.kind, kmh: game ? game.player.kmh : 0, rain: game ? game.weather.level : 0, funkloch: game ? game.funkloch > 0 : false, tv: !!(game && game.tv), stopping: !!(game && game.navi.stopping), target: game && game.navi.target ? game.navi.target.name : null, phase: game ? game.auction.phase : 'offen', stuck: !!(game && game.stuck), charging: !!(game && game.charging), secs: game && game.navi.target ? game.navi.driveSecs() : Infinity, n: game && game.tv ? game.tv.n : 0, facts: game ? Object.keys(FACTS).filter((k) => FACTS[k](game)) : [] };
  };
  let ids = 0;
  const ui = loose({
    chat: (m) => log.chat.push({ t: game.t, name: m.name, text: m.text, bot: m.bot || null, gag: !!m.gag, at: state() }),
    toast: (text, kind, key) => log.toast.push({ t: game.t, text, kind, key, at: state() }),
    nomi: (text) => log.speak.push({ t: game.t, who: 'nomi', text, at: state() }),
    naviDurchsage: (text) => log.speak.push({ t: game.t, who: 'navi', text, label: 'Navi-Durchsage', at: state() }),
    studio: (text) => log.speak.push({ t: game.t, who: 'studio', text, at: state() }),
    megafon: (text, dur, buyer, label) => log.speak.push({ t: game.t, who: 'megafon', text, label: label || 'Megafon-Wunsch von ' + buyer, at: state() }),
    durchsage: (voice, text) => log.speak.push({ t: game.t, who: 'durchsage', text, voice, at: state() }),
    brunnenTV: (n, name) => log.tv.push({ t: game.t, n, name }),
    funkloch: (on) => log.funk.push({ t: game.t, on, at: state() }),
  });
  game = new Game({
    traffic: traffic || loose({ cars: NONE, update: () => NONE, nearby: () => NONE, police: () => null, megafon: () => 0 }),
    scenery: loose({ request: () => ++ids, landmarkSpot: (s) => s, placed: () => null }),
    road: loose(),
    sky: loose(),
    rain: loose(),
    windshield: loose({ firmware: 0, manual: () => 'wipe' }),
    cockpit: loose({ nomi: loose() }),
    audio: loose(),
    speech: loose({ say: (text, voice, o) => (log.say.push({ t: game.t, text, voice, at: state() }), o && o.onStart && o.onStart(Math.max(1.2, text.length / 14)), Math.max(1.2, text.length / 14)), busy: false, queue: NONE, current: null }),
    ui,
    fx: loose(),
    pickups: loose({ update: () => NONE }),
    world: { trip: () => trip, stopping: () => !!arrival.pending, release: () => arrival.reset(), square: () => null, town: () => null },
  });
  game.endless = endless;
  game.stammSeed = seed; // (Stammgäste: wie die Gags mit der Saat)
  game.start({ upgrades, best: {}, wallet });
  game.gags.reset(seed); // (im Spiel würfeln die Gags je Stream neu – hier mit der Saat, damit jeder Lauf gleich ist)
  const p = game.player;
  p.s = trip.s;
  p.x = trip.x;
  p.speed = 40 / 3.6;
  const lim = { left: 0, right: 0, shoulder: 0, lanes: null, extraLane: null, vmax: Infinity, decel: 0, slack: 0, closing: 0 };
  p.lawful = true; // ein braver Fahrer: auch sein Pedal hält die Tempolimits (Player.lawful)
  const ctl = { steer: 0, throttle: 0, brake: 0, kappa: 0, grade: 0, horn: false, wiper: false, megafon: false };
  const DT = 1 / 30;
  let waitUntil = -1;
  let warned = 0;
  const sim = { game, trip, p, log, arrival, state, driver, DT };
  /** secs Sekunden fahren (oder bis der Stream vorbei ist). Gibt false zurück, sobald game.over gesetzt ist. */
  sim.step = (secs) => {
    const n = Math.round(secs / DT);
    for (let i = 0; i < n; i++) {
      if (game.over) return false;
      limitsFor(trip, lim, arrival.stop(trip));
      p.setLimits(lim);
      let want = J.L0;
      const sec = trip.section;
      if (sec.kind === 'ab') {
        const f = sec.fork;
        want = 5.625;
        if (f && !f.taken && f.s - trip.s < J.decel - 10 && (f.forced || trip.planFor(f) === 'exit')) want = J.L0;
      }
      // (in der Baustelle mitten in der Gasse – ein braver Fahrer streift keine Bake, game/baustelle.js steer)
      want = game.bau.steer(want, p.s);
      const dx = want - (p.x + p.vx * AUTO.look);
      ctl.steer = Math.abs(dx) > AUTO.tol ? Math.max(-1, Math.min(1, dx * AUTO.gain)) : 0;
      // (die 80 der Baustelle hält er ein, game/baustelle.js zoneLimit)
      const v = Math.min(lim.vmax, driver.cruise / 3.6, game.bau.zoneLimit(p.s));
      const idle = game.t < waitUntil;
      ctl.throttle = !idle && p.speed < v - 0.5 ? 1 : 0;
      ctl.brake = idle ? 1 : p.speed > v + 3 ? 0.4 : 0;
      game.offAutobahn = sec.kind !== 'ab';
      if (charge) {
        if (game.akku.warns > warned && trip.stop < 0 && trip.post < 0 && !game.charging) game.akku.planStop();
        warned = game.akku.warns;
      }
      const tvBefore = game.tv;
      game.update(DT, ctl, camera);
      if (tvBefore && !game.tv && driver.dawdle) waitUntil = game.t + driver.dawdle;
      if (game.over) return false;
      const evs = trip.update(p.s, p.x);
      for (let k = 0; k < evs.length; k++) game.onTrip(evs[k]);
      const rest = arrival.update(trip, evs, p.speed);
      if (rest) game.onTrip(rest);
      if (!charge) p.battery = 100;
    }
    return !game.over;
  };
  return sim;
}
