// Ladestopp im Park (REISE.md A5): der Weg in die freie Heldenbucht und wieder hinaus (src/world/xxl/charge.js dockPath,
// rollPose), der Fahrplan des Stopps (STOP, stopPlan) und was das Spiel daraus macht (src/game/game.js startCharge,
// tickCharge, skipCharge): Der Wagen setzt ohne Sprung und ohne etwas zu streifen rückwärts in die Bucht und steht dort
// parallel zu ihr, die Räder kreuzen den Bordstein nur, wo er abgesenkt ist, ausgeparkt wird bis in die Spur des Parks;
// wer überspringt, früh oder spät, steht im selben Zustand wie nach dem ganzen Stopp, und die Fahrt geht auf dem
// geplanten Weg weiter zur Autobahn, ohne „Bitte wenden“; wer ohne Plan rechts in einen Park fährt, bekommt denselben
// Stopp. Aufruf: node tools/stopp-test.mjs
import { PerspectiveCamera } from 'three';
import { CHARGE, DOCK, STOP, SCENE, ROLL_T, dockHalt, dockPath, rollPose, stopEnd, stopPlan, chargeOf, kerbAt } from '../src/world/xxl/charge.js';
import { PARK, PARKS, parkAt } from '../src/map/parks.js';
import { STREET } from '../src/world/kit/layout.js';
import { TESLA } from '../src/models/tesla.js';
import { Trip, J } from '../src/game/trip.js';
import { Arrival, limitsFor, AUTO } from '../src/world/xxl/plan.js';
import { Game } from '../src/game/game.js';

let fails = 0;
const kinds = new Map();
const ok = (cond, msg) => {
  if (cond) return;
  fails++;
  const k = msg.replace(/[-\d.,]+/g, '#');
  const n = (kinds.get(k) || 0) + 1;
  kinds.set(k, n);
  if (n <= 3) console.log('FEHLER: ' + msg);
};
const near = (a, b, e) => Math.abs(a - b) <= e;

// --- 1. Der Weg -----------------------------------------------------------------------------------------------------
// Ortskoordinaten des Parks (wie charge.js): u = Meter ab Abschnittsbeginn, x seitlich; der Park (kit/rest.js ladepark)
// mit Mitte U an der Häuserflucht, sein lx läuft gegen u, lz in den Park hinein (x = Flucht − lz).
const U = PARK.u;
const F = CHARGE.front;
const at = (lx, lz) => [F - lz, U - lx]; // [x, u]
const bayU = U - CHARGE.bay[0] + CHARGE.off;
const bayX = F - CHARGE.bay[1];
ok(near(PARK.halt, dockHalt(U), 0.005), `Halt ${PARK.halt} statt ${dockHalt(U).toFixed(3)}`);

// Hindernisse im Park (kit/rest.js: Säulen 0,45 × 0,4 m auf einem Sockel 0,61 × 0,54 m bei lx −5,2 / 0 / 5,2, lz −5,3,
// AC-Säulen bei ±10,7; Poller r 0,14 bei lz −4,6; Säulen der Ladedächer r 0,4 bei lx ±1,25 / ±7,05, lz −6,4; geparkte
// Wagen in den Buchten 0, 6, 7, 0,2 m tiefer als die Buchtmitte (layout.js planPark); der Popcorn-Tisch hinter der
// Heldensäule (0,62 × 0,48 m)
const boxes = [];
const circles = [];
for (const lx of [-5.2, 0, 5.2]) {
  const [x, u] = at(lx, -5.3);
  boxes.push({ name: 'Säule ' + lx, x0: x - 0.27, x1: x + 0.27, u0: u - 0.305, u1: u + 0.305 });
}
for (const lx of [-10.7, 10.7]) {
  const [x, u] = at(lx, -5.3);
  boxes.push({ name: 'AC-Säule ' + lx, x0: x - 0.27, x1: x + 0.27, u0: u - 0.24, u1: u + 0.24 });
}
for (const lx of [-10.7, -5.2, 0, 5.2, 10.7]) circles.push({ name: 'Poller ' + lx, c: at(lx, -4.6), r: 0.14 });
for (const lx of [-7.05, -1.25, 1.25, 7.05]) circles.push({ name: 'Dachsäule ' + lx, c: at(lx, -6.4), r: 0.4 });
for (const [i, len, w] of [[0, 3.9, 1.72], [6, 3.2, 1.62], [7, 3.9, 1.72]]) {
  const [x, u] = at(-9.1 + i * 2.6, -3.5);
  boxes.push({ name: 'Wagen in Bucht ' + i, x0: x - len / 2 - 0.06, x1: x + len / 2 + 0.06, u0: u - w / 2 - 0.03, u1: u + w / 2 + 0.03 });
}
{
  const [x, u] = at(0.48, -6.08);
  boxes.push({ name: 'Popcorn-Tisch', x0: x - 0.24, x1: x + 0.24, u0: u - 0.31, u1: u + 0.31 });
}
// Umriss des Wagens (Draufsicht) an der Lage q: Ecken und Kantenpunkte alle 0,25 m
const HL = TESLA.length / 2;
const HW = TESLA.width / 2;
const outline = [];
for (let z = -HL; z <= HL + 1e-9; z += HL / 8) for (const s of [-1, 1]) outline.push([s * HW, z]);
for (let x = -HW; x <= HW + 1e-9; x += HW / 3) for (const s of [-1, 1]) outline.push([x, s * HL]);
// Wagenrahmen → Ort: x rechts, z hinten (vorne = −z); Kurs yaw (0 = in Fahrtrichtung +u, −π/2 = zur Straße)
const toTown = (q, px, pz) => {
  const c = Math.cos(q.yaw);
  const s = Math.sin(q.yaw);
  // vorne im Ort: (sin yaw, cos yaw) in (x, u); rechts: (cos yaw, −sin yaw)
  return [q.x + px * c - pz * s, q.u - px * s - pz * c];
};
const inside = (q, x, u) => {
  // Punkt (x, u) im Rechteck des Wagens?
  const dx = x - q.x;
  const du = u - q.u;
  const c = Math.cos(q.yaw);
  const s = Math.sin(q.yaw);
  const right = dx * c - du * s;
  const fwd = dx * s + du * c;
  return Math.abs(right) <= HW && Math.abs(fwd) <= HL;
};
// kleinster Abstand des Wagens zu einem Hindernis (negativ: Überschneidung), über die Kantenpunkte und die Ecken des
// Hindernisses
function clearance(q) {
  let best = Infinity;
  let who = '';
  const pts = outline.map(([px, pz]) => toTown(q, px, pz));
  for (const b of boxes) {
    for (const [x, u] of pts) {
      const dx = Math.max(b.x0 - x, 0, x - b.x1);
      const du = Math.max(b.u0 - u, 0, u - b.u1);
      const d = dx === 0 && du === 0 ? -1 : Math.hypot(dx, du);
      if (d < best) [best, who] = [d, b.name];
    }
    for (const [x, u] of [[b.x0, b.u0], [b.x0, b.u1], [b.x1, b.u0], [b.x1, b.u1]]) if (inside(q, x, u)) [best, who] = [-1, b.name];
  }
  for (const c of circles) {
    for (const [x, u] of pts) {
      const d = Math.hypot(x - c.c[0], u - c.c[1]) - c.r;
      if (d < best) [best, who] = [d, c.name];
    }
    if (inside(q, c.c[0], c.c[1])) [best, who] = [-1, c.name];
  }
  return [best, who];
}
// Räder (Aufstandspunkte) im Ort
const WHEELS = [];
for (const z of [TESLA.frontAxleZ, TESLA.rearAxleZ]) for (const s of [-1, 1]) WHEELS.push([s * TESLA.trackHalf, z]);
const sec = { kind: 'park', park: 0, s0: 0, s1: PARK.len, spotS: PARK.halt - 2 };
const dw = chargeOf(sec).drive;

function walk(name, T, pose, check) {
  const n = Math.ceil(T * 240);
  const prev = pose(0, {});
  let minC = Infinity;
  let minWho = '';
  let maxStep = 0;
  let kerbBad = 0;
  for (let i = 0; i <= n; i++) {
    const t = (T * i) / n;
    const q = pose(t, {});
    maxStep = Math.max(maxStep, Math.hypot(q.x - prev.x, q.u - prev.u) / (T / n));
    if (check) check(q, prev, t);
    Object.assign(prev, q);
    const [c, who] = clearance(q);
    if (c < minC) [minC, minWho] = [c, who];
    // Bordstein rechts: ein Rad darüber nur, wo er ganz abgesenkt ist
    for (const [px, pz] of WHEELS) {
      const [x, u] = toTown(q, px, pz);
      if (Math.abs(x - STREET.curbR) < 0.2 && kerbAt(dw, u, 0.15) > CHARGE.drop + 1e-6) kerbBad++;
    }
  }
  ok(minC >= 0.15, `${name}: ${minC.toFixed(2)} m an ${minWho}`);
  ok(kerbBad === 0, `${name}: ${kerbBad}× ein Rad über dem hohen Bordstein`);
  return { minC, minWho, maxStep };
}

let dockStat = null;
for (const du of [-0.5, -0.3, 0, 0.4, 1.5]) {
  for (const x0 of [8.9, 9.0, 9.12]) {
    const u0 = PARK.halt + du;
    const d = dockPath(U, u0, x0);
    const a = d.pose(0, {});
    ok(near(a.x, x0, 1e-9) && near(a.u, u0, 1e-9) && a.yaw === 0 && a.v === 0, `Einparken beginnt nicht, wo der Wagen steht (${du}, ${x0}): ${JSON.stringify(a)}`);
    const b = d.pose(d.T, {});
    ok(near(b.x, bayX, 0.01) && near(b.u, bayU, 0.01) && near(b.yaw, -Math.PI / 2, 1e-6) && b.v === 0, `Einparken endet nicht in der Bucht: ${JSON.stringify(b)}`);
    let back = 0;
    let turn = 0;
    const st = walk(`Einparken (${du}, ${x0})`, d.T, d.pose, (q, p) => {
      if (q.v > 1e-9 || q.v < -DOCK.v - 1e-9) back++;
      if (q.yaw > p.yaw + 1e-9) turn++;
    });
    ok(back === 0, `Einparken: ${back}× vorwärts oder schneller als ${DOCK.v} m/s`);
    ok(turn === 0, `Einparken: der Wagen dreht ${turn}× zurück`);
    // (die Wagenmitte läuft im Bogen außen um die Hinterachse: Radius √(R² + rear²) statt R)
    ok(st.maxStep <= DOCK.v * Math.hypot(1, CHARGE.rear / CHARGE.R) * 1.001, `Einparken: Sprung (${st.maxStep.toFixed(2)} m/s)`);
    if (du === 0 && x0 === 9.0) dockStat = { T: d.T, len: d.len, ...st };
  }
}
// rollPose beginnt, wo das Einparken endet, und übergibt in der Spur des Parks, vorwärts hinter dem Halt
const r0 = rollPose(U, 0, {});
const e = stopEnd(U);
ok(near(r0.x, bayX, 1e-9) && near(r0.u, bayU, 1e-9) && near(r0.yaw, -Math.PI / 2, 1e-12), 'Ausparken beginnt nicht in der Bucht');
ok(near(e.x, J.L0, 1e-9) && e.yaw === 0 && near(e.v, CHARGE.vEnd, 1e-9) && e.u > PARK.halt + 5 && e.u < PARK.len - 60, `Übergabe nicht in der Spur des Parks: ${JSON.stringify(e)}`);
const rollStat = walk('Ausparken', ROLL_T, (t, out) => rollPose(U, t, out));
// zwischen den Wagen: Die Wagenmitte kreuzt den Halt beim Ausparken genau einmal, vorwärts (danach folgt ihr der Spieler)
{
  let cross = 0;
  let last = rollPose(U, 0, {}).u;
  for (let i = 1; i <= 600; i++) {
    const u = rollPose(U, (ROLL_T * i) / 600, {}).u;
    if (last < PARK.halt && u >= PARK.halt) cross++;
    ok(u >= last - 1e-9 || last < bayU + 8, 'Ausparken: der Wagen rollt in der Spur zurück');
    last = u;
  }
  ok(cross === 1, `Ausparken kreuzt den Halt ${cross}×`);
}

// --- 2. Der Fahrplan ------------------------------------------------------------------------------------------------
{
  const P = stopPlan({ kind: 'park', park: 3, s0: 5000, s1: 5000 + PARK.len }, 5000 + PARK.halt, J.L0);
  ok(near(P.d0, STOP.shift + P.dock.T, 1e-9) && P.u === U, 'Fahrplan: Einparken');
  ok(STOP.flap[1] <= STOP.plug[1] && STOP.plug[1] <= STOP.fill[0] && STOP.fill[1] <= STOP.unplug && STOP.nomi > STOP.plug[1], 'Fahrplan: Laden, solange der Stecker nicht steckt');
  ok(STOP.pop[0] > STOP.plug[1] && STOP.pop[1] <= STOP.unplug && STOP.juice > STOP.pop[0] && STOP.juice < STOP.unplug, 'Fahrplan: Popcorn und Saft außerhalb der Ladezeit');
  ok(near(P.roll, P.d0 + STOP.unplug + SCENE.roll, 1e-9) && near(P.end, P.d0 + STOP.unplug + SCENE.end, 1e-9), 'Fahrplan: Ausparken wie in Erlensee');
  ok(PARKS.length > 100, 'zu wenig Parks');
}

// --- 3. Im Spiel: einmal ganz, einmal früh und einmal spät übersprungen, einmal ohne Plan rechts hinein -------------
const NONE = [];
const noop = () => {};
const loose = (base = {}) => new Proxy(base, { get: (t, k) => (k in t ? t[k] : noop) });
function mulberry32(a) {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const DT = 1 / 30;
/**
 * Ein Stream ab Erlensee mit 80 % Akku und gleich eingeplantem Ladestopp; der Fahrer folgt dem Navi. skip: Sekunden nach
 * dem Halt im Park, zu denen übersprungen wird (null: nie); plan false: der Stopp führt nur bis vor die Ausfahrt seines
 * Parks und wird dort abgesagt, der Fahrer hält sich ohne Plan rechts hinein. Gibt den Zustand nach dem Stopp und nach
 * der Weiterfahrt.
 */
function stream(skip, plan = true) {
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
    world: { trip: () => trip, stopping: () => !!arrival.pending, release: () => arrival.reset(), square: () => null, town: () => null },
  });
  game.start({ upgrades: {}, best: {} });
  const p = game.player;
  p.s = trip.s;
  p.x = trip.x;
  p.speed = 40 / 3.6;
  p.battery = 80;
  const lim = { left: 0, right: 0, shoulder: 0, lanes: null, extraLane: null, vmax: Infinity, decel: 0, slack: 0, closing: 0 };
  const ctl = { steer: 0, throttle: 0, brake: 0, kappa: 0, grade: 0, horn: false, wiper: false, megafon: false };
  const out = { charged: null, after: null, wende: 0, wrong: 0, sugar: false, events: [] };
  let planned = false;
  let halt = null;
  let leftPark = false;
  let abBefore = null;
  let onAb = 0;
  for (let i = 0; i < 1500 / DT; i++) {
    // keine Gebote: die Route bleibt, wie sie ist (der Zufall läuft in allen drei Streams gleich)
    game.T.bid = Math.max(game.T.bid, 60);
    if (!planned && game.t > 1) {
      game.planStop();
      planned = trip.stop >= 0;
      ok(planned, 'Ladestopp lässt sich nicht einplanen');
    }
    const sec = trip.section;
    if (!plan && trip.stop >= 0 && sec.kind === 'ab' && sec.fork && parkAt(sec.fork.node) === trip.stop) game.planStop();
    limitsFor(trip, lim, arrival.stop(trip));
    p.setLimits(lim);
    let want = J.L0;
    if (sec.kind === 'ab') {
      if (!halt) abBefore = sec.fork;
      const f = sec.fork;
      want = 5.625;
      if (f && !f.taken && f.s - trip.s < J.decel - 10 && (f.forced || trip.planFor(f) === 'exit' || (!plan && parkAt(f.node) >= 0))) want = J.L0;
    }
    const dx = want - (p.x + p.vx * AUTO.look);
    ctl.steer = Math.abs(dx) > AUTO.tol ? Math.max(-1, Math.min(1, dx * AUTO.gain)) : 0;
    const v = Math.min(lim.vmax, 130 / 3.6);
    ctl.throttle = game.charging ? 0 : p.speed < v - 0.5 ? 1 : 0;
    ctl.brake = p.speed > v + 3 ? 0.4 : 0;
    const was = !!game.charging;
    if (game.charging && skip !== null && game.chargeT() >= skip) game.skipCharge();
    game.offAutobahn = trip.section.kind !== 'ab';
    game.update(DT, ctl, camera);
    if (was && !game.charging) {
      out.charged = { battery: p.battery, charges: game.stats.parkCharges, bananas: game.stats.bananas, held: !!arrival.held, sugarDue: game.sugarDue, stop: trip.stop, t: +(game.t - halt.t).toFixed(2) };
    }
    const evs = trip.update(p.s, p.x);
    for (const ev of evs) {
      if (ev.type === 'fork' && ev.wrong) out.wrong++;
      game.onTrip(ev);
    }
    const rest = arrival.update(trip, evs, p.speed);
    if (rest && rest.type === 'charge') {
      halt = { t: game.t, s: p.s, x: p.x, sec: rest.sec };
      game.onTrip(rest);
      ok(game.charging && arrival.held && near(p.s, rest.sec.s0 + PARK.halt, 0.6), `Halt im Park ${(p.s - rest.sec.s0).toFixed(2)} m statt ${PARK.halt}`);
      ok(plan || trip.stop < 0, 'ohne Plan: beim Halt ist doch ein Stopp geplant');
    }
    if (out.charged) {
      // nach dem Stopp: das Navi sagt nie „dann wenden“, der Weg führt auf dieselbe Autobahn zurück
      const g = trip.guidance();
      if (g.then && g.then.wende) out.wende++;
      if (trip.section.kind === 'park') leftPark = true;
      // zurück auf der Autobahn (ein paar Bilder später: der Zuckerschub kommt mit dem nächsten Bild des Spiels)
      if (leftPark && trip.section.kind === 'ab' && ++onAb === 3) {
        out.after = { same: trip.section.de === abBefore.stay, sugar: +p.sugar.toFixed(2) };
        break;
      }
    }
  }
  out.halt = halt;
  return out;
}

const runs = [['ganz', null], ['früh übersprungen', 0.5], ['spät übersprungen', 14], ['ohne Plan', null, false]].map(([name, skip, plan]) => [name, stream(skip, plan)]);
const [, full] = runs[0];
ok(full.halt && full.charged, 'Der Lader kommt nicht in den Park oder wird nicht fertig');
if (full.halt && full.charged) {
  const P = stopPlan(full.halt.sec, full.halt.s, full.halt.x);
  ok(near(full.charged.t, P.end, 0.05), `Der ganze Stopp dauert ${full.charged.t} s statt ${P.end.toFixed(2)} s`);
}
for (const [name, r] of runs) {
  const c = r.charged;
  ok(c && c.battery === 100 && c.charges === 1 && c.bananas === 1 && !c.held && c.sugarDue && c.stop < 0, `${name}: Zustand nach dem Stopp ${JSON.stringify(c)}`);
  ok(r.after && r.after.same && r.after.sugar > 5.8, `${name}: nicht auf derselben Autobahn geradeaus weiter oder ohne Zuckerschub ${JSON.stringify(r.after)}`);
  ok(r.wende === 0 && r.wrong === 0, `${name}: ${r.wende}× „wenden“, ${r.wrong} falsche Abzweige nach dem Stopp`);
}

console.log(
  `Ladestopp: Halt bei u ${PARK.halt} m, Einparken ${dockStat.len.toFixed(2)} m in ${dockStat.T.toFixed(2)} s (Abstand ${dockStat.minC.toFixed(2)} m zu ${dockStat.minWho}), ` +
    `Ausparken ${ROLL_T.toFixed(2)} s bis u ${e.u.toFixed(2)} (Abstand ${rollStat.minC.toFixed(2)} m zu ${rollStat.minWho}), ganzer Stopp ${full.charged ? full.charged.t : '?'} s; ` +
    runs.map(([n, r]) => `${n}: ${r.charged ? r.charged.t : '?'} s`).join(', '),
);
if (fails) {
  console.log(`stopp-test: ${fails} Fehler`);
  process.exit(1);
}
console.log('stopp-test: alles grün');
