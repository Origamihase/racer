// Testlauf 3 (die Probefahrt des Besitzers vom 21.11.2026), ohne Grafik: node tools/testlauf3-test.mjs
// 1. Schneller als erlaubt: „Es sollte auf jeder Straße möglich sein, mehr als gesetzlich erlaubt zu fahren.“ Mit der
//    echten Fahrphysik (Player), dem Kurs der Karte und den Grenzen der Welt (plan.js limitsFor) fährt der Spieler mit
//    Vollgas auf jeder Straßenart (Ort, Rampe, Landstraße, Verbindung, Ladepark) deutlich schneller als das Limit; der
//    brave Fahrer (Autopilot, Player.lawful) und der Tempomat halten es, und am Navi-Ziel hält der Wagen trotzdem.
import * as G from '../src/map/graph.js';
import * as shapes from '../src/map/shapes.js';
import { Trip, J, PROFILES } from '../src/game/trip.js';
import { Player } from '../src/game/player.js';
import { Course, MapPlanner } from '../src/game/course.js';
import { curveTable, curveAt } from '../src/curve.js';
import { limitsFor, autoTarget, autoDrive, AUTO, Arrival } from '../src/world/xxl/plan.js';
import { parkAt } from '../src/map/parks.js';

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

console.log(`${checks} Prüfungen, ${fails} Fehler`);
if (fails) process.exit(1);
