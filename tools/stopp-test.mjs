// Ladestopp im Park (REISE.md A5): der Weg in die freie Heldenbucht und wieder hinaus (src/world/xxl/charge.js dockPath,
// rollPose), der Fahrplan des Stopps (STOP, stopPlan) und was das Spiel daraus macht (src/game/akku.js start,
// tickCharge, skip): Der Wagen setzt ohne Sprung und ohne etwas zu streifen rückwärts in die Bucht und steht dort
// parallel zu ihr, die Räder kreuzen den Bordstein nur, wo er abgesenkt ist, ausgeparkt wird bis in die Spur des Parks;
// wer überspringt, früh oder spät, steht im selben Zustand wie nach dem ganzen Stopp, und die Fahrt geht auf dem
// geplanten Weg weiter zur Autobahn, ohne „Bitte wenden“; wer ohne Plan rechts in einen Park fährt, bekommt denselben
// Stopp. Ebenso an der Ladesäule eines Orts auf dem Weg (src/map/parks.js POST): OMI, Akku-Karte und Navi nennen sie
// „Ladesäule in …“, Taste L plant sie ein, der Wagen hält dort und lädt im selben Stopp, dann geht es weiter zum Brunnen.
// Aufruf: node tools/stopp-test.mjs
import { PerspectiveCamera } from 'three';
import { CHARGE, DOCK, STOP, SCENE, ROLL_T, dockHalt, dockPath, rollPose, stopEnd, stopPlan, chargeOf, kerbAt } from '../src/world/xxl/charge.js';
import { PARK, PARKS, POST, parkAt, postName } from '../src/map/parks.js';
import { NavModel } from '../src/map/navroute.js';
import { STREET } from '../src/world/kit/layout.js';
import { TESLA } from '../src/models/tesla.js';
import { Trip, J } from '../src/game/trip.js';
import { findPlace } from '../src/map/graph.js';
import { Arrival, limitsFor, AUTO } from '../src/world/xxl/plan.js';
import { Game, AKKU_CARD, akkuLevel } from '../src/game/game.js';
import { AKKU_HOST } from '../src/game/akku.js';
import { checkHost } from './lib/host.mjs';
import { DRIVE_DEFAULTS } from '../src/game/player.js';
import { BOARD, REISE_AKKU, fillTemplate } from '../src/data.js';

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
// Wagen in den Buchten 0, 6, 7, 0,2 m tiefer als die Buchtmitte (layout.js planPark). Die Popcorn-Maschine steht oben
// auf der Heldensäule (rest.js popcorn_post): kein Hindernis am Boden
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
    cockpit: loose({ nomi: loose() }), audio: loose(), speech: loose({ say: (t, v, o) => (o && o.onStart && o.onStart(2.5), 2.5), busy: false, queue: NONE, current: null }),
    ui: loose({ nomi: (text) => out.nomi.push({ text, during: !!game.charging }) }), fx: loose(), pickups: loose({ update: () => NONE }),
    world: { trip: () => trip, stopping: () => !!arrival.pending, release: () => arrival.reset(), square: () => null, town: () => null },
  });
  game.start({ upgrades: {}, best: {} });
  const p = game.player;
  p.s = trip.s;
  p.x = trip.x;
  p.speed = 40 / 3.6;
  p.battery = 80;
  let chatter = false;
  const lim = { left: 0, right: 0, shoulder: 0, lanes: null, extraLane: null, vmax: Infinity, decel: 0, slack: 0, closing: 0 };
  p.lawful = true; // ein braver Fahrer: auch sein Pedal hält die Tempolimits (Player.lawful)
  const ctl = { steer: 0, throttle: 0, brake: 0, kappa: 0, grade: 0, horn: false, wiper: false, megafon: false };
  const out = { charged: null, after: null, wende: 0, wrong: 0, sugar: false, events: [], nomi: [] };
  let planned = false;
  let halt = null;
  let leftPark = false;
  let abBefore = null;
  let onAb = 0;
  for (let i = 0; i < 1500 / DT; i++) {
    // keine Gebote: die Route bleibt, wie sie ist (der Zufall läuft in allen drei Streams gleich)
    game.T.bid = Math.max(game.T.bid, 60);
    if (!planned && game.t > 1) {
      game.akku.planStop();
      planned = trip.stop >= 0;
      ok(planned, 'Ladestopp lässt sich nicht einplanen');
    }
    const sec = trip.section;
    if (!plan && trip.stop >= 0 && sec.kind === 'ab' && sec.fork && parkAt(sec.fork.node) === trip.stop) game.akku.planStop();
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
    if (game.charging && skip !== null && game.akku.sceneT() >= skip) game.akku.skip();
    // Geplauder mitten im Stopp (der Fehlalarm des Wischers) und etwas Wichtiges: OMI sagt dort nur ihren Satz
    if (game.charging && !chatter && game.akku.sceneT() >= 0.3) {
      chatter = true;
      game.say(BOARD.wiperPhantom, 'think', { priority: false });
      game.say('Prüfsatz nach dem Stopp.', 'think');
    }
    game.offAutobahn = trip.section.kind !== 'ab';
    game.update(DT, ctl, camera);
    if (was && !game.charging) {
      out.charged = { battery: p.battery, charges: game.stats.parkCharges, bananas: game.stats.bananas, held: !!arrival.held, sugarDue: game.akku.sugarDue, stop: trip.stop, t: +(game.t - halt.t).toFixed(2) };
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
  // im Stopp genau ein Satz OMIs (ihrer, wenn er vor dem Überspringen lag), das Wichtige danach, das Geplauder nie
  const during = r.nomi.filter((e) => e.during).map((e) => e.text);
  const own = r.halt ? fillTemplate(REISE_AKKU.start, { park: PARKS[r.halt.sec.park].name }) : '';
  ok(during.length === (name === 'früh übersprungen' ? 0 : 1) && during.every((t) => t === own), `${name}: OMI im Stopp ${during.join(' | ') || '–'}`);
  ok(!r.nomi.some((e) => e.text === BOARD.wiperPhantom) && r.nomi.filter((e) => !e.during && e.text === 'Prüfsatz nach dem Stopp.').length === 1, `${name}: zurückgehalten ${r.nomi.map((e) => e.text).join(' | ')}`);
}

// --- 3b. An der Ladesäule eines Orts ----------------------------------------------------------------------------------
// Ein Stream ab Erlensee mit dem Ziel Hanau und 9,5 % Akku: Der nächste Ladeplatz auf dem Weg ist die Ladesäule in Hanau
// (vor dem Brunnen des Orts); OMI und die Akku-Karte nennen sie mit Entfernung, Taste L plant sie ein (und keinen Park).
// Für die Fahrt dorthin bekommt der Akku 40 %; hinter der Ausfahrt zeigt das Navi den Halt mit ihrem Namen. Der Wagen hält
// in der Spur bei POST.halt, lädt im selben Stopp wie im Park und fährt danach zum Brunnen weiter: Ankunft am Ziel, ohne
// „wenden“ und ohne falschen Abzweig.
function postStream() {
  Math.random = mulberry32(11);
  const trip = new Trip({ rng: Math.random });
  const arrival = new Arrival();
  arrival.hold = true;
  const camera = new PerspectiveCamera(60, 16 / 9, 0.1, 3000);
  let ids = 0;
  const out = { said: [], first: null, card: null, planned: null, guide: null, ins: null, halt: null, scene: null, charged: null, rest: null, wende: 0, wrong: 0 };
  const game = new Game({
    traffic: loose({ cars: NONE, update: () => NONE, nearby: () => NONE, police: () => null, megafon: () => 0 }),
    scenery: loose({ request: () => ++ids, landmarkSpot: (s) => s, placed: () => null }),
    road: loose(), sky: loose(), rain: loose(), windshield: loose({ firmware: 0, manual: () => 'wipe' }),
    cockpit: loose({ nomi: loose() }), audio: loose(), speech: loose({ say: (t, v, o) => (o && o.onStart && o.onStart(2.5), 2.5), busy: false, queue: NONE, current: null }),
    ui: loose({ nomi: (text) => out.said.push({ text, during: !!game.charging }) }), fx: loose(), pickups: loose({ update: () => NONE }),
    world: { trip: () => trip, stopping: () => !!arrival.pending, release: () => arrival.reset(), square: () => null, town: () => null },
  });
  game.start({ upgrades: {}, best: {} });
  const town = findPlace('Hanau');
  trip.setTarget(town);
  const p = game.player;
  p.s = trip.s;
  p.x = trip.x;
  p.speed = 40 / 3.6;
  p.battery = 9.5;
  const lim = { left: 0, right: 0, shoulder: 0, lanes: null, extraLane: null, vmax: Infinity, decel: 0, slack: 0, closing: 0 };
  p.lawful = true; // ein braver Fahrer: auch sein Pedal hält die Tempolimits (Player.lawful)
  const ctl = { steer: 0, throttle: 0, brake: 0, kappa: 0, grade: 0, horn: false, wiper: false, megafon: false };
  for (let i = 0; i < 900 / DT; i++) {
    game.T.bid = Math.max(game.T.bid, 60);
    if (!out.planned && game.t > 1.5) {
      out.first = trip.restsAhead(1)[0] ?? null;
      out.card = game.akku.card();
      game.akku.planStop();
      out.planned = { stop: trip.stop, post: trip.post };
      p.battery = 40;
    }
    // die erste Ansage des Halts (hinter der Ausfahrt)
    if (out.planned && !out.guide && trip.post >= 0) {
      const g = trip.guidance();
      if (g.type === 'stop') {
        out.guide = { type: g.type, post: g.post, park: g.park, m: Math.round(g.dist) };
        const ins = new NavModel(trip).instruction();
        out.ins = { turn: ins.turn, head: ins.head };
      }
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
    const v = Math.min(lim.vmax, 130 / 3.6);
    ctl.throttle = game.charging ? 0 : p.speed < v - 0.5 ? 1 : 0;
    ctl.brake = p.speed > v + 3 ? 0.4 : 0;
    const was = !!game.charging;
    game.offAutobahn = trip.section.kind !== 'ab';
    game.update(DT, ctl, camera);
    if (was && !game.charging) out.charged = { battery: p.battery, charges: game.stats.parkCharges, bananas: game.stats.bananas, post: trip.post, stop: trip.stop, t: +(game.t - out.halt.t).toFixed(2) };
    const evs = trip.update(p.s, p.x);
    for (const ev of evs) {
      if (ev.type === 'fork' && ev.wrong) out.wrong++;
      game.onTrip(ev);
    }
    const rest = arrival.update(trip, evs, p.speed);
    if (rest && rest.type === 'charge') {
      out.halt = { t: game.t, u: p.s - rest.sec.s0, place: rest.sec.place, post: rest.post, park: rest.park, name: rest.name };
      game.onTrip(rest);
      const c = game.charging;
      out.scene = c ? { post: c.post, park: c.park, name: c.name, end: c.plan.end } : null;
    }
    if (out.charged) {
      const g = trip.guidance();
      if (g.then && g.then.wende) out.wende++;
    }
    if (rest && rest.type === 'rest') {
      out.rest = { place: rest.place, u: p.s - rest.sec.s0, spot: rest.sec.spotS - rest.sec.s0 };
      break;
    }
  }
  out.town = town;
  return out;
}
let postRun = null;
{
  const R = postStream();
  const name = postName(R.town);
  ok(name === 'Ladesäule in Hanau' && R.first && R.first.post === R.town && R.first.park === -1 && R.first.name === name && R.first.km > 3, `Ladesäule: als nächster Ladeplatz ${JSON.stringify(R.first)}`);
  const warn = R.said.find((e) => e.text.startsWith('Akku'));
  ok(warn && warn.text.includes(`${name} in `) && R.card && R.card.park === name && R.card.km > 3, `Ladesäule: OMI „${warn ? warn.text : '–'}“, Karte ${JSON.stringify(R.card)}`);
  const set = R.said.find((e) => e.text.startsWith('Ladestopp eingeplant:'));
  ok(R.planned && R.planned.post === R.town && R.planned.stop === -1 && set && set.text.startsWith(`Ladestopp eingeplant: ${name}, in `), `Ladesäule: eingeplant ${JSON.stringify(R.planned)}, OMI „${set ? set.text : '–'}“`);
  ok(R.guide && R.guide.type === 'stop' && R.guide.post === R.town && R.ins && R.ins.turn === 'stop' && R.ins.head === name, `Ladesäule: Navi ${JSON.stringify(R.guide)} ${JSON.stringify(R.ins)}`);
  ok(R.halt && R.halt.place === R.town && R.halt.post === R.town && R.halt.park === -1 && R.halt.name === name && near(R.halt.u, POST.halt, 0.6), `Ladesäule: Halt ${JSON.stringify(R.halt)} statt bei u ${POST.halt}`);
  ok(R.scene && R.scene.post === R.town && R.scene.park === -1 && R.scene.name === name, `Ladesäule: Stopp ${JSON.stringify(R.scene)}`);
  ok(R.charged && R.charged.battery === 100 && R.charged.charges === 1 && R.charged.bananas === 1 && R.charged.post < 0 && R.charged.stop < 0 && R.scene && near(R.charged.t, R.scene.end, 0.05), `Ladesäule: nach dem Stopp ${JSON.stringify(R.charged)}`);
  const during = R.said.filter((e) => e.during).map((e) => e.text);
  ok(during.length === 1 && during[0] === fillTemplate(REISE_AKKU.start, { park: name }), `Ladesäule: OMI im Stopp ${during.join(' | ') || '–'}`);
  ok(R.rest && R.rest.place === R.town && R.rest.u > R.rest.spot && R.wende === 0 && R.wrong === 0, `Ladesäule: danach am Brunnen ${JSON.stringify(R.rest)}, ${R.wende}× „wenden“, ${R.wrong} falsche Abzweige`);
  postRun = R;
}

// --- 4. Akku leer -----------------------------------------------------------------------------------------------------
// Mit 10,6 % Akku auf der Autobahn, Tempomat auf 130 km/h, kein Ladestopp: Der Mittelbildschirm zeigt bei 10 % „Akku
// fast leer“ mit dem nächsten Ladepark, bei 5 % „Akku kritisch“ (je AKKU_CARD.show Sekunden), leer „Akku leer“ bis
// zum Ende, und das HUD sagt es einmal; leer hält der Tempomat nichts mehr, der Wagen rollt aus, und im Stand endet
// die Fahrt mit „akku“.
function emptyRun({ target = null, battery = 10.6, reach = null, secs = 600 } = {}) {
  Math.random = mulberry32(5);
  const trip = new Trip({ rng: Math.random });
  const arrival = new Arrival();
  const camera = new PerspectiveCamera(60, 16 / 9, 0.1, 3000);
  const out = { cards: [], toasts: [], said: [], emptyAt: null, stopT: null, faster: 0, reason: null, vEmpty: 0, onRoute: null };
  let ids = 0;
  const game = new Game({
    traffic: loose({ cars: NONE, update: () => NONE, nearby: () => NONE, police: () => null, megafon: () => 0 }),
    scenery: loose({ request: () => ++ids, landmarkSpot: (s) => s, placed: () => null }),
    road: loose(), sky: loose(), rain: loose(), windshield: loose({ firmware: 0, manual: () => 'wipe' }),
    cockpit: loose({ nomi: loose() }), audio: loose(), speech: loose({ say: (t, v, o) => (o && o.onStart && o.onStart(2.5), 2.5), busy: false, queue: NONE, current: null }),
    ui: loose({ toast: (text, kind, key) => out.toasts.push({ text, kind, key }), nomi: (text) => out.said.push(text) }), fx: loose(), pickups: loose({ update: () => NONE }),
    world: { trip: () => trip, stopping: () => !!arrival.pending, release: () => arrival.reset(), square: () => null, town: () => null },
  });
  game.start({ upgrades: {}, best: {} });
  if (target) trip.setTarget(findPlace(target));
  // Reichweite vorgegeben (reach: Reisekilometer), statt sie aus dem gemessenen Verbrauch zu schätzen
  if (reach !== null) game.akku.reachable = (q) => q.km < reach;
  const p = game.player;
  p.configure({ ...DRIVE_DEFAULTS, cruise: true });
  p.s = trip.s;
  p.x = trip.x;
  p.speed = 130 / 3.6;
  p.cruiseSet = p.speed;
  p.battery = battery;
  const lim = { left: 0, right: 0, shoulder: 0, lanes: null, extraLane: null, vmax: Infinity, decel: 0, slack: 0, closing: 0 };
  p.lawful = true; // ein braver Fahrer: auch sein Pedal hält die Tempolimits (Player.lawful)
  const ctl = { steer: 0, throttle: 0, brake: 0, kappa: 0, grade: 0, horn: false, wiper: false, megafon: false };
  let last = null;
  for (let i = 0; i < secs / DT; i++) {
    game.T.bid = Math.max(game.T.bid, 60);
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
    game.offAutobahn = sec.kind !== 'ab';
    const v0 = p.speed;
    game.update(DT, ctl, camera);
    if (out.emptyAt === null && p.empty) {
      out.emptyAt = game.t;
      out.vEmpty = v0;
    } else if (out.emptyAt !== null && p.speed > v0 + 1e-9) out.faster++;
    if (game.over) break;
    const c = game.screenState().lowBattery;
    if (c && !last) out.onRoute = (trip.restsAhead(1)[0] || { name: '' }).name;
    if (c && (!last || c.lvl !== last.lvl)) out.cards.push({ lvl: c.lvl, t: game.t, pct: p.battery, park: c.park, km: c.km, alpha: c.alpha });
    if (!c && last) out.cards[out.cards.length - 1].gone = game.t;
    if (c) out.cards[out.cards.length - 1].alphaMax = Math.max(out.cards[out.cards.length - 1].alphaMax || 0, c.alpha);
    last = c;
    for (const ev of trip.update(p.s, p.x)) game.onTrip(ev);
    arrival.update(trip, [], p.speed);
  }
  out.stopT = game.over ? game.t : null;
  out.reason = game.over ? game.over.reason : null;
  return out;
}
const E = emptyRun();
const [c1, c2, c3] = E.cards;
ok(akkuLevel(10.01) === 0 && akkuLevel(10) === 1 && akkuLevel(5) === 2 && akkuLevel(0.01) === 2 && akkuLevel(0) === 3, 'Stufen der Akku-Karte');
ok(E.cards.length === 3 && c1.lvl === 1 && c2.lvl === 2 && c3.lvl === 3, `Akku-Karten ${JSON.stringify(E.cards)}`);
if (c1 && c2 && c3) {
  ok(c1.pct <= 10 && c1.pct > 9.8 && c2.pct <= 5 && c2.pct > 4.8 && c3.pct === 0, `Karten bei ${c1.pct.toFixed(2)} / ${c2.pct.toFixed(2)} / ${c3.pct} %`);
  ok(near(c1.gone - c1.t, AKKU_CARD.show, 0.05) && near(c2.gone - c2.t, AKKU_CARD.show, 0.05) && !c3.gone, `Karten stehen ${(c1.gone - c1.t).toFixed(2)} / ${(c2.gone - c2.t).toFixed(2)} s, „Akku leer“ bis zum Ende: ${!c3.gone}`);
  ok(c1.alpha < 0.2 && c1.alphaMax === 1 && c3.alphaMax === 1, `Einblenden: erstes Bild ${c1.alpha.toFixed(2)}, ganz da ${c1.alphaMax} / ${c3.alphaMax}`);
  ok(c1.park !== '' && c1.km > 0 && c2.park !== '' && c3.park === '', `Ladepark auf der Karte: ${c1.park} ${c1.km.toFixed(1)} km / ${c2.park} / „${c3.park}“`);
}
ok(E.toasts.filter((t) => t.key === 'akku').length === 1, `HUD meldet den leeren Akku ${E.toasts.filter((t) => t.key === 'akku').length}×`);
ok(E.emptyAt !== null && E.vEmpty > 30 && E.faster === 0, `leer bei ${E.vEmpty.toFixed(1)} m/s, danach ${E.faster}× schneller geworden (Tempomat)`);
ok(E.reason === 'akku' && E.stopT - E.emptyAt < 40, `leer: Ende ${E.reason} nach ${E.stopT !== null ? (E.stopT - E.emptyAt).toFixed(1) : '–'} s Ausrollen`);
// mit Ziel liegt der erste Ladepark auf dem Weg außer Reichweite: Die Karte nennt wie OMI den Abstecher in Reichweite
const K = emptyRun({ target: 'München', battery: 10.05, reach: 32, secs: 4 });
const k1 = K.cards[0];
const told = K.said.filter((t) => t.includes('Ladepark')).pop() || '';
ok(k1 && k1.lvl === 1 && k1.park !== '' && told.includes(k1.park + ' in ') && K.onRoute && k1.park !== K.onRoute,
  `Ladepark der Karte ${k1 ? k1.park : '–'}, OMI: „${told}“, erster auf dem Weg: ${K.onRoute}`);

// --- Popcorn ins Auto ------------------------------------------------------------------------------------------------
// Die Maschine steht oben auf der Heldensäule (kit/rest.js popcorn_post, um POST_POP.yaw gedreht), der Wagen rückwärts
// in der Heldenbucht (rollPose zu Beginn des Ausparkens). Jedes Korn springt vorn aus der offenen Tür der Maschine und
// fliegt im Bogen durch das offene Fahrerfenster: Strahlen längs seiner Bahn gegen die Meshes des Wagens (models/
// tesla.js) treffen bis dorthin nichts außer dem Glas in der Öffnung (dort ist das Fenster unten), mit Abstand zu ihrem
// Rahmen.
const fly = { n: 0, ok: 0, margin: Infinity, apex: -Infinity, door: 0 };
{
  const canvas = new Proxy({}, { get: (t, k) => (k === 'measureText' ? (x) => ({ width: String(x).length * 10 }) : k === 'getImageData' ? (x, y, w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }) : k === 'createImageData' ? (w, h) => ({ width: w, height: h, data: new Uint8ClampedArray(w * h * 4) }) : k.startsWith?.('create') ? () => ({ addColorStop() {} }) : k in t ? t[k] : () => {}), set: (t, k, v) => ((t[k] = v), true) });
  globalThis.document ??= { createElement: () => ({ width: 0, height: 0, getContext: () => canvas, style: {} }) };
  const THREE = await import('three');
  const { buildTesla } = await import('../src/models/tesla.js');
  const { MACHINE } = await import('../src/world/kit/rest.js');
  const { flyPath, flyTime, windowAim, FLY, POPPING_AT, POPPING_YAW } = await import('../src/world/xxl/popping.js');
  const tesla = buildTesla();
  tesla.setWindow(1);
  tesla.root.updateMatrixWorld(true);
  const win = tesla.windowOpening();
  const meshes = [];
  tesla.root.traverse((o) => o.isMesh && o.visible && meshes.push(o));
  const Y = new THREE.Vector3(0, 1, 0);
  const q = rollPose(U, 0, {});
  const car = new THREE.Matrix4().compose(new THREE.Vector3(q.x, 0.05, -q.u), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -q.yaw, 0, 'YXZ')), new THREE.Vector3(1, 1, 1));
  // Säule im Park (planPark: zur Straße gedreht, FACE −π/2), Hof 0,05 m über der Straße
  const FACE = -Math.PI / 2;
  const [px, pu] = at(CHARGE.post[0], CHARGE.post[1]);
  const mach = new THREE.Matrix4().compose(new THREE.Vector3(px, 0.05, -pu).add(new THREE.Vector3(...POPPING_AT).applyAxisAngle(Y, FACE)), new THREE.Quaternion().setFromAxisAngle(Y, FACE + POPPING_YAW), new THREE.Vector3(1, 1, 1));
  const carInv = car.clone().invert();
  const machInv = mach.clone().invert();
  const aim = windowAim(win, new THREE.Vector3()).applyMatrix4(car).applyMatrix4(machInv);
  const along = new THREE.Vector3(0, 0, 1).transformDirection(car).transformDirection(machInv);
  const zA = (y) => win.a0.z + (win.a1.z - win.a0.z) * Math.min(1, Math.max(0, (y - win.a0.y) / (win.a1.y - win.a0.y)));
  const edge = (h) => Math.min(h.y - win.bottom, win.top - h.y, h.z - zA(h.y), win.zB - h.z);
  const ray = new THREE.Raycaster();
  const [a, b, v, d] = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
  for (let j = 0; j < FLY.n; j++) for (let k = 0; k < 16; k++) {
    fly.n++;
    const tf = flyTime(j, k);
    // aus der Tür: vorn hinaus, unter dem Dach der Kabine und zwischen ihren Pfosten
    flyPath(aim, along, j, k, 0, a, v);
    const tz = (MACHINE.d / 2 - a.z) / v.z;
    if (!(v.z > 0 && Math.abs(a.x + v.x * tz) < MACHINE.w / 2 - 0.03 && a.y + v.y * tz - 4.905 * tz * tz < MACHINE.base + MACHINE.cab - 0.015)) fly.door++;
    let through = null;
    let hit = null;
    for (let i = 0; i < 160 && !hit; i++) {
      flyPath(aim, along, j, k, (tf * i) / 160, a).applyMatrix4(mach).applyMatrix4(carInv);
      flyPath(aim, along, j, k, (tf * (i + 1)) / 160, b).applyMatrix4(mach).applyMatrix4(carInv);
      fly.apex = Math.max(fly.apex, a.y);
      d.subVectors(b, a);
      ray.set(a, d.clone().normalize());
      ray.far = d.length();
      for (const h of ray.intersectObjects(meshes, false)) {
        if (!through && edge(h.point) > 0.035) {
          through = h.point.clone();
          continue;
        }
        if (!through) hit = h.point;
        break;
      }
    }
    if (through && !hit) {
      fly.ok++;
      fly.margin = Math.min(fly.margin, edge(through));
    }
  }
  ok(fly.ok === fly.n && fly.door === 0, `Popcorn: ${fly.ok} von ${fly.n} Körnern durchs offene Fenster, ${fly.door} nicht aus der Tür der Maschine`);
}

console.log(
  `Akku leer: Karten bei ${E.cards.map((c) => c.pct.toFixed(1) + ' %').join(' / ')} (${c1 ? c1.park + ', ' + c1.km.toFixed(1) + ' km' : '–'}), ausgerollt aus ${(E.vEmpty * 3.6).toFixed(0)} km/h in ${E.stopT !== null ? (E.stopT - E.emptyAt).toFixed(1) : '–'} s`,
);
console.log(
  `Ladestopp: Halt bei u ${PARK.halt} m, Einparken ${dockStat.len.toFixed(2)} m in ${dockStat.T.toFixed(2)} s (Abstand ${dockStat.minC.toFixed(2)} m zu ${dockStat.minWho}), ` +
    `Ausparken ${ROLL_T.toFixed(2)} s bis u ${e.u.toFixed(2)} (Abstand ${rollStat.minC.toFixed(2)} m zu ${rollStat.minWho}), ganzer Stopp ${full.charged ? full.charged.t : '?'} s; ` +
    runs.map(([n, r]) => `${n}: ${r.charged ? r.charged.t : '?'} s`).join(', '),
);
if (postRun) {
  const R = postRun;
  console.log(`Ladesäule: ${R.first ? R.first.name + ' nach ' + R.first.km.toFixed(1) + ' km' : '–'} als nächster Ladeplatz, eingeplant mit L, Halt bei u ${R.halt ? R.halt.u.toFixed(2) : '–'} m (POST.halt ${POST.halt}), Stopp ${R.charged ? R.charged.t : '?'} s, danach am Brunnen bei u ${R.rest ? R.rest.u.toFixed(1) : '–'} m`);
}
console.log(`Popcorn: ${fly.ok} von ${fly.n} Körnern springen aus der Tür der Maschine oben auf der Säule (bis ${fly.apex.toFixed(2)} m hoch) und fliegen durchs offene Fahrerfenster, mindestens ${fly.margin.toFixed(3)} m vom Rahmen`);

// --- Frühe Akku-Warnung ---------------------------------------------------------------------------------------------
// Unter REISE_AKKU.early warnt OMI, sobald der nächste Halt der letzte in Reichweite ist. Die Ladesäulen der nächsten
// Orte (wenige Kilometer dahinter) zählen dabei nicht als „dahinter“: Liegt hinter dem Park nur die Säule des Orts
// 4 km weiter in Reichweite, ist er trotzdem die letzte Gelegenheit, die weiter trägt. Ein Halt ab past km dahinter
// in Reichweite (oder eine volle Liste, die ganz in diesen past km liegt) hält die Warnung zurück. Gerechnet mit dem
// echten Game und einer Fahrt, die genau diese Halte nennt.
{
  const { makeStream } = await import('./stream-sim.mjs');
  const A = REISE_AKKU;
  const rest = (name, km, m, extra = {}) => ({ name, km, m, realM: 300, park: 1, post: -1, planned: false, ...extra });
  const park = rest('Ladepark Testhausen', 30, 2000);
  const cases = [
    ['Säule 4 km hinter dem Park', [park, rest('Ladesäule in Testdorf', 34, 2150, { park: -1, post: 3 }), rest('Ladepark Fernweh', 140, 9e6)], true],
    ['Säule 4 km dahinter und eine weit hinten in Reichweite', [park, rest('Ladesäule in Testdorf', 34, 2150, { park: -1, post: 3 }), rest('Ladesäule in Weiterweg', 30 + A.past + 1, 3200, { park: -1, post: 4 })], false],
    ['volle Liste in den nächsten Kilometern', Array.from({ length: A.look }, (_, i) => rest('Ladesäule ' + i, 30 + i, 2000 + 30 * i, { park: -1, post: i }))],
    // (die häufige Lage: Säulen in jedem Ort, die Liste voll, die weiten Halte außer Reichweite)
    ['volle Liste, die weiten außer Reichweite', [park, ...Array.from({ length: A.look - 2 }, (_, i) => rest('Ladesäule ' + i, 31 + i, 2050 + 30 * i, { park: -1, post: i })), rest('Ladepark Fernweh', 30 + A.past + 5, 9e6)], true],
    ['nichts dahinter', [park], true],
  ];
  const said = [];
  for (const [what, rests, want = false] of cases) {
    const sim = makeStream({ seed: 2 });
    const g = sim.game;
    const trip = { scale: 1, km: 0, restsAhead: (n) => rests.slice(0, n), pastTarget: () => null };
    g.world.trip = () => trip;
    g.player.battery = 60;
    g.akku.meter.next = 0;
    g.akku.warned = 0;
    let line = null;
    g.say = (text) => (line = text);
    g.akku.journeyBattery();
    ok(!!line === want && (!want || line === fillTemplate(A.last, { pct: 60, park: rests[0].name, km: '30 Kilometern' }) || /liegt noch in Reichweite/.test(line)), `Frühe Akku-Warnung (${what}): ${line || 'keine'}`);
    if (line) said.push(line);
  }
  console.log(`Frühe Akku-Warnung bei 60 %: ${said.length} von ${cases.length} Lagen („${said[0] || '–'}“), Säulen bis ${A.past} km hinter dem Park zählen nicht`);
}
// --- Schnittstelle des Akkus ------------------------------------------------------------------------------------------
// Die Klasse Akku (src/game/akku.js) liest vom Spiel nur, was AKKU_HOST nennt – und die Liste nennt nichts, was sie nicht braucht.
{
  const used = checkHost('game/akku.js', AKKU_HOST, ok);
  console.log(`Akku-Schnittstelle: ${used.size} Namen des Spiels (${[...used].sort().join(', ')})`);
}
if (fails) {
  console.log(`stopp-test: ${fails} Fehler`);
  process.exit(1);
}
console.log('stopp-test: alles grün');
