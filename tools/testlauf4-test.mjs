// Testlauf 4 (die Probefahrt des Besitzers vom 21.11.2026 abends), ohne Grafik: node tools/testlauf4-test.mjs
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
import { mulberry32 } from './stream-sim.mjs';

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

if (fails) {
  console.log(`testlauf4-test: ${fails} FEHLER (${checks} Prüfungen)`);
  process.exit(1);
}
console.log(`testlauf4-test: alles gut (${checks} Prüfungen)`);
