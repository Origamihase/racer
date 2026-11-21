// Laden 2 (die Probefahrt des Besitzers vom 21.11.2026 abends), ohne Grafik: node tools/laden2-test.mjs
// 1. „Ich stand also an der Straße in der Stadt, rechts von mir war eine Tankstelle und ich konnte nicht laden. Es sollte
//    ein manuelles Triggern des Ladens (wie bei BrunnenTV mit B) möglich sein.“ Ein Mensch am Steuer fährt den echten
//    Stream: Steht oder kriecht er ohne Plan neben der Ladesäule eines Orts, bietet der Rand oben das Laden an (Taste L,
//    auf dem Handy heißt der Knopf „Jetzt laden“), von selbst beginnt nichts; L startet den Ladestopp sofort (im Stand)
//    oder nach einem sanften Halt (kriechend). Dasselbe neben der Bucht eines Ladeparks. Anderswo plant L wie bisher den
//    nächsten Stopp, und an der geplanten Säule beginnt er nach POST_ZONE.still von selbst.
import { PerspectiveCamera } from 'three';
import { Trip, J } from '../src/game/trip.js';
import { findPlace } from '../src/map/graph.js';
import { Arrival, limitsFor, AUTO, POST_ZONE } from '../src/world/xxl/plan.js';
import { Game } from '../src/game/game.js';
import { PARK, PARKS, POST, parkAt, postName } from '../src/map/parks.js';
import { dockHalt } from '../src/world/xxl/charge.js';
import { mulberry32 } from './stream-sim.mjs';
import { TOUCH_BUTTONS } from '../src/ui/touch.js';
import { controlRows } from '../src/ui/controls.js';

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

// --- 1. Laden mit L an jeder Säule und Bucht ------------------------------------------------------------------------
console.log('1. Laden mit L an jeder Säule und Bucht:');
/**
 * Ein Stream mit dem echten Spiel, der echten Fahrt und dem Halt der Welt (Arrival mit Spielzeit und den Haken
 * chargeSpot/charge wie main.js), am Steuer ein Mensch. target: Zielort; park: dieser Park wird eingeplant (die Route
 * führt hinein); planPost: L auf der Autobahn plant die Säule des Ziels; at: im Ort bzw. Park ab u = at bremsen (crawl:
 * schon ab u = at − 40 auf so viele m/s abbremsen und weiterkriechen); key: so viele Sekunden nach dem Halt (kriechend:
 * nach Erreichen von at) drückt er L. Ergebnis: Halt, Hinweise am Rand, Touch-Knopf, Beginn und Fahrplan des Ladestopps, Akku danach.
 */
function run({ target, park = -1, planPost = false, at, crawl = 0, key, secs = 900, battery = 30 }) {
  Math.random = mulberry32(11);
  const trip = new Trip({ rng: Math.random });
  const arrival = new Arrival();
  arrival.hold = true;
  const camera = new PerspectiveCamera(60, 16 / 9, 0.1, 3000);
  const toasts = [];
  const dropped = [];
  let ids = 0;
  const game = new Game({
    traffic: loose({ cars: NONE, update: () => NONE, nearby: () => NONE, police: () => null, megafon: () => 0 }),
    scenery: loose({ request: () => ++ids, landmarkSpot: (s) => s, placed: () => null }),
    road: loose(), sky: loose(), rain: loose(), windshield: loose({ firmware: 0, manual: () => 'wipe' }),
    cockpit: loose({ nomi: loose() }), audio: loose(), speech: loose({ say: (t, v, o) => (o && o.onStart && o.onStart(2.5), 2.5), busy: false, queue: NONE, current: null }),
    ui: loose({ toast: (text, kind, key) => toasts.push({ text, key, t: game.t }), dropKey: (key) => dropped.push({ key, t: game.t }) }),
    fx: loose(), pickups: loose({ update: () => NONE }),
    world: {
      trip: () => trip, stopping: () => !!arrival.pending, release: () => arrival.release(), square: () => null, town: () => null,
      hold: (sec) => (arrival.held = { s: trip.s + 0.3, sec, place: sec.place, park: -1 }),
      chargeSpot: (v) => arrival.chargeSpot(trip, v), charge: (v) => arrival.charge(trip, v),
    },
  });
  game.start({ upgrades: {}, best: {} });
  const town = findPlace(target);
  trip.setTarget(town);
  if (park >= 0) trip.setStop(park);
  const p = game.player;
  p.s = trip.s;
  p.x = trip.x;
  p.speed = 40 / 3.6;
  p.battery = battery;
  const lim = { left: 0, right: 0, shoulder: 0, lanes: null, extraLane: null, vmax: Infinity, decel: 0, slack: 0, closing: 0 };
  const ctl = { steer: 0, throttle: 0, brake: 0, kappa: 0, grade: 0, horn: false, wiper: false, megafon: false, ladestopp: false };
  const out = { stood: null, reached: null, pressed: null, planned: null, charge: null, plan: null, battery: null, charges: 0, offer: [], label: [], rest: null };
  const isSpot = (sec) => (park >= 0 ? sec.kind === 'park' && sec.park === park : sec.kind === 'stadt' && sec.place === town);
  let done = false;
  for (let i = 0; i < secs / DT; i++) {
    game.T.bid = Math.max(game.T.bid, 60);
    // L auf der Autobahn: anderswo plant die Taste den nächsten Stopp
    ctl.ladestopp = planPost && !out.planned && game.t > 1.5;
    if (ctl.ladestopp) out.planned = true;
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
    const u = isSpot(sec) ? p.s - sec.s0 : -1;
    const v = sec.kind === 'stadt' || sec.kind === 'park' ? 50 / 3.6 : sec.kind === 'ab' ? 130 / 3.6 : 90 / 3.6;
    const here = !done && u >= at && u < 300;
    const creeping = !done && crawl && u >= at - 40 && u < 300;
    if (here && !out.reached) out.reached = { u: +u.toFixed(2), t: game.t };
    const slow = here && !crawl;
    if (slow && p.speed < 0.15 && !out.stood) out.stood = { u: +u.toFixed(2), t: game.t };
    const vWant = creeping ? crawl : v;
    ctl.throttle = game.charging || slow ? 0 : p.speed < vWant - 0.2 ? 0.3 : 0;
    ctl.brake = slow && p.speed > 0.02 ? 1 : p.speed > vWant + 0.3 ? 1 : 0;
    const from = crawl ? out.reached : out.stood;
    if (key !== undefined && from && !out.pressed && !game.charging && game.t - from.t >= key) {
      ctl.ladestopp = true;
      out.pressed = { t: game.t, u: +u.toFixed(2), kmh: +(p.speed * 3.6).toFixed(1), offer: game.chargeHint, button: game.stopOffer() };
    }
    const was = !!game.charging;
    game.offAutobahn = trip.section.kind !== 'ab';
    game.update(DT, ctl, camera);
    if (here && !game.charging) {
      out.offer.push(game.chargeHint);
      out.label.push(game.stopOffer());
    }
    if (was && !game.charging) {
      out.battery = p.battery;
      out.charges = game.stats.parkCharges;
      done = true;
    }
    const evs = trip.update(p.s, p.x);
    for (const ev of evs) game.onTrip(ev);
    const rest = arrival.update(trip, evs, p.speed, game.t);
    if (rest && rest.type === 'charge') game.onTrip(rest);
    const c = game.charging;
    if (c && !out.charge) {
      out.charge = { u: +(p.s - c.sec.s0).toFixed(2), kmh: +(p.speed * 3.6).toFixed(2), name: c.name, post: c.post, park: c.park, t: game.t };
      out.plan = c.plan;
      out.held = !!arrival.held;
    }
    if (rest && rest.type === 'rest') {
      out.rest = { place: rest.place };
      break;
    }
    if (done && park >= 0 && trip.section.kind === 'ab') break;
  }
  out.town = town;
  out.toasts = toasts;
  out.dropped = dropped;
  out.trip = trip;
  return out;
}

const L_AFTER = 5;
// a) ohne Plan neben der Bucht der Säule in Hanau stehen: Hinweis am Rand, nach 5 s noch kein Stopp, dann L
const a = run({ target: 'Hanau', at: 62, key: L_AFTER });
{
  const hint = a.toasts.filter((x) => x.key === 'ladenHier');
  ok(a.stood && a.stood.u >= POST.u - POST_ZONE.back && a.stood.u <= POST.halt + POST_ZONE.ahead, `a: stand bei ${a.stood && a.stood.u} m, nicht in der Zone der Säule`);
  ok(hint.length >= 1 && /Taste L/.test(hint[0].text) && hint[0].t - a.stood.t < 0.2, `a: Hinweis am Rand ${JSON.stringify(hint[0])} (Halt bei ${a.stood && a.stood.t.toFixed(2)} s)`);
  ok(a.pressed && a.pressed.offer && a.pressed.button, `a: beim Druck auf L kein Angebot ${JSON.stringify(a.pressed)}`);
  ok(a.charge && near(a.charge.t, a.pressed.t, DT + 1e-6) && a.charge.post === a.town && a.charge.park === -1 && a.charge.name === postName(a.town), `a: Ladestopp ${JSON.stringify(a.charge)} nach L bei ${a.pressed && a.pressed.t.toFixed(2)} s`);
  ok(a.charge && a.charge.t - a.stood.t >= L_AFTER - DT, `a: ohne Plan begann der Stopp von selbst nach ${a.charge && (a.charge.t - a.stood.t).toFixed(2)} s`);
  ok(a.dropped.some((d) => d.key === 'ladenHier' && near(d.t, a.charge.t, 0.05)), 'a: Hinweis bleibt nach dem Start stehen');
  ok(a.plan && a.plan.creep && a.held, `a: Szene ohne Vorrollen oder ungehalten (u ${a.charge && a.charge.u}, Halt ${dockHalt(POST.u).toFixed(2)})`);
  ok(a.battery === 100 && a.charges === 1 && a.rest && a.rest.place === a.town, `a: danach Akku ${a.battery}, ${a.charges} Stopps, Brunnen ${JSON.stringify(a.rest)}`);
}
// b) kriechend (5 km/h) neben der Säule L: Der Wagen hält sanft (weniger als 1,5 m), dann beginnt der Stopp
const b = run({ target: 'Hanau', at: 60, crawl: 1.4, key: 0.5 });
{
  ok(b.pressed && b.pressed.kmh > 3 && b.pressed.offer, `b: beim Druck nicht kriechend oder ohne Angebot ${JSON.stringify(b.pressed)}`);
  ok(b.charge && b.charge.kmh < 0.6 && b.charge.u - b.pressed.u < 1.5 && b.charge.t - b.pressed.t < 1.5 && b.charge.post === b.town, `b: Stopp ${JSON.stringify(b.charge)} nach L ${JSON.stringify(b.pressed)}`);
  ok(b.battery === 100 && b.rest && b.rest.place === b.town, `b: danach Akku ${b.battery}, Brunnen ${JSON.stringify(b.rest)}`);
}
// c) ohne L: stehen bleiben neben der Säule startet nichts (nur der Hinweis kommt alle WAY.remind Sekunden wieder)
const c = run({ target: 'Hanau', at: 66, secs: 150 });
{
  const hint = c.toasts.filter((x) => x.key === 'ladenHier');
  const still = c.offer.length * DT;
  ok(c.stood && !c.charge && hint.length >= 3 && still > 30, `c: ohne L ${c.charge ? 'Ladestopp ' + JSON.stringify(c.charge) : 'kein Stopp'}, ${hint.length} Hinweise in ${still.toFixed(0)} s`);
  ok(c.offer.slice(60).every(Boolean) && c.label.slice(60).every(Boolean), `c: Angebot oder Touch-Knopf „Jetzt laden“ fehlt (${c.offer.filter(Boolean).length}/${c.offer.length})`);
}
// d) L auf der Autobahn plant die Säule, dort beginnt der Stopp von selbst nach POST_ZONE.still (wie bisher)
const d = run({ target: 'Hanau', planPost: true, at: 60 });
{
  ok(d.charge && d.stood && near(d.charge.t - d.stood.t, POST_ZONE.still, 0.1) && d.charge.post === d.town, `d: geplant ${JSON.stringify(d.charge)}, Halt ${JSON.stringify(d.stood)}`);
  ok(d.battery === 100 && d.rest && d.rest.place === d.town, `d: danach Akku ${d.battery}, Brunnen ${JSON.stringify(d.rest)}`);
}
// e) im Ladepark Aschaffenburg (eingeplant, die Route führt hinein): vor dem Halt neben der Bucht stehen, L
const pk = PARKS.findIndex((q) => /Aschaffenburg/.test(q.name));
const e = pk >= 0 ? run({ target: 'Würzburg', park: pk, at: PARK.u - 8, key: 1.5, secs: 1500, battery: 80 }) : null;
{
  ok(pk >= 0, 'e: kein Ladepark Aschaffenburg');
  if (e) {
    ok(e.stood && e.stood.u < PARK.halt - 4 && e.pressed && e.pressed.offer, `e: Halt im Park ${JSON.stringify(e.stood)}, L ${JSON.stringify(e.pressed)}`);
    ok(e.charge && e.charge.park === pk && e.charge.post === -1 && e.charge.name === PARKS[pk].name && near(e.charge.t, e.pressed.t, DT + 1e-6), `e: Ladestopp ${JSON.stringify(e.charge)}`);
    ok(e.plan && e.plan.creep && e.held && e.battery === 100 && e.charges === 1, `e: Szene ${!!(e.plan && e.plan.creep)}, gehalten ${e.held}, Akku ${e.battery}, ${e.charges} Stopps`);
    ok(e.trip.stop < 0, 'e: der geplante Park bleibt nach dem Laden eingeplant');
  }
}
// f) die Texte: Touch-Knopf mit beiden Bedeutungen, die Steuerung nennt beide
{
  const t = TOUCH_BUTTONS.find((x) => x.action === 'ladestopp');
  const row = controlRows().find((r) => r.id === 'ladestopp');
  ok(t.now === 'Jetzt laden' && row.touch.includes('🔌 Jetzt laden') && /gleich hier laden/.test(row.note) && /einplanen/.test(row.note), `f: Knopf ${t.now}, Zeile ${JSON.stringify(row)}`);
}
console.log(`  a: stand bei u ${a.stood && a.stood.u} m, Hinweis „${(a.toasts.find((x) => x.key === 'ladenHier') || {}).text}“, L nach ${L_AFTER} s → Stopp im selben Bild` +
  ` · b: kriechend ${b.pressed && b.pressed.kmh} km/h, Halt ${b.charge && (b.charge.u - b.pressed.u).toFixed(2)} m nach L, Stopp nach ${b.charge && (b.charge.t - b.pressed.t).toFixed(2)} s` +
  ` · c: ${c.stood ? ((c.offer.length * DT) | 0) + ' s' : '–'} gestanden ohne L, kein Stopp` +
  ` · d: geplant, von selbst nach ${d.charge && (d.charge.t - d.stood.t).toFixed(2)} s` +
  ` · e: ${e && e.charge ? `${e.charge.name}, L bei u ${e.pressed.u} m (Halt ${PARK.halt}) → Stopp` : '–'}`);

// --- 2. Eine Ladesäule in jedem Ort, von weitem zu sehen -------------------------------------------------------------
// „Bitte überprüfe, ob in jedem Ort eine Ladesäule ist – ich habe keine gesehen.“ Jeder Ort der Karte (alle Größen),
// wie er auf dem Weg liegt: Der Park mit der Säule steht bei POST.u rechts an der Flucht, davor im Streifen seine blaue
// Stele, 100 m davor die Tafel „Ladesäule 100 m“. Die Stele steht auf dem Streifen (nicht auf der Fahrbahn, nicht auf
// der abgesenkten Einfahrt), und vom Auge im Cockpit wie von der Drohne über der Spur liegt bis 150 m davor nichts
// zwischen ihr und dem Betrachter, was ihren Kopf mit dem Stecker verdeckt – gerechnet in 3D gegen jeden Baustein
// (Bäume mit der Krone, alles andere mit Grundriss und Höhe; der Mast einer Laterne verdeckt nur einen Streifen). Ein Ort hat seinen
// Plan unabhängig von der Seite, von der man kommt (er liegt immer in Fahrtrichtung): an anderer Stelle des Wegs und
// über einen anderen Knoten derselbe Park, dieselbe Stele; als Navi-Ziel dieselben Tafeln und das Ziel dazu. Am Start
// (Erlensee) steht der Wagen schon im Park: dort keine.
console.log('2. Eine Ladesäule in jedem Ort, von weitem zu sehen:');
{
  // Minimaler DOM-Ersatz wie in tools/citykit-test.mjs: der Baukasten malt Schilder auf Canvas (hier ohne Bild)
  const ctx2 = new Proxy({}, {
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
  globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => ctx2, style: {} }) };
  const { W } = await import('../src/curve.js');
  const { createCityKit } = await import('../src/world/kit/city.js');
  const L = await import('../src/world/kit/layout.js');
  const { places, townLen } = await import('../src/map/graph.js');
  const { townPlan } = await import('../src/world/xxl/towns.js');
  const { CHARGE, chargeOf, steleOf } = await import('../src/world/xxl/charge.js');
  const { sectionSigns, POST_SIGN_D } = await import('../src/world/xxl/signplan.js');
  const city = createCityKit(W);
  const S = L.STREET;
  const ST = CHARGE.stele;
  // Kopf der Stele (Mitte des Steckers) und was ihn von einem Sichtpunkt (x, Höhe y, d Meter davor) aus verdeckt
  const head = ST.y + ST.h - ST.w / 2;
  const hides = (plan, st, ex, ey, d) => {
    const out = new Set();
    for (const it of plan.items) {
      const fp = it.fp;
      if (it.external || fp.h <= S.top + 0.01) continue;
      // (der Mast einer Laterne oder Ampel verdeckt von der 1 m breiten Tafel nur einen schmalen Streifen)
      const tree = city.info(it.name).kind === 'tree';
      if (fp.thin && !tree) continue;
      const b = L.aabb(fp);
      for (let k = 0.02; k < 0.995; k += 0.005) {
        const x = ex + (st.x - ex) * k;
        const u = st.u - d * (1 - k);
        const y = ey + (head - ey) * k;
        if (x > b[0] && x < b[1] && -u > b[2] && -u < b[3] && y < fp.h) {
          out.add(it.name);
          break;
        }
      }
    }
    return [...out];
  };
  const DRONE_Y = 4.5;
  const bySize = new Map();
  const list = [];
  let free150 = 0;
  for (const p of places) {
    const len = townLen(p.pop);
    const sec = { kind: 'stadt', place: p.i, node: 1, frame: 1, s0: 1000, s1: 1000 + len, spotS: 1000 + Math.round(len * 0.6) };
    const where = p.name;
    const plan = townPlan(city, sec);
    const c = chargeOf(sec);
    const st = steleOf(sec);
    const pc = plan.charge;
    ok(c && pc && pc.u === POST.u && c.u === POST.u && pc.x === CHARGE.front, `2: ${where}: kein Park mit Säule bei POST.u (${JSON.stringify(pc && { u: pc.u, x: pc.x })})`);
    if (!c || !pc || !st) {
      ok(false, `2: ${where}: keine Stele`);
      continue;
    }
    ok(JSON.stringify(pc.stele) === JSON.stringify(st) && st.u === POST.u - ST.d, `2: ${where}: Stele im Plan ${JSON.stringify(pc.stele)} statt ${JSON.stringify(st)}`);
    // auf dem Streifen, vor dem Park und vor der abgesenkten Einfahrt
    ok(st.x - st.w / 2 >= S.curbR + S.kerb && st.x + st.w / 2 <= S.curbR + S.strip && st.u + st.w / 2 < POST.u - CHARGE.half - CHARGE.keep, `2: ${where}: Stele nicht im Streifen vor dem Park`);
    ok(sec.s0 + st.u + 1 < c.drive.s0 - c.drive.ramp, `2: ${where}: Stele auf der Einfahrt`);
    // Tafeln: „Ladesäule 100 m“ vor dem Ort, die Stele selbst
    const signs = [];
    sectionSigns(null, [sec], sec, signs, { tables: false });
    const board = signs.find((e) => e.kind === 'ladesaeule');
    const stele = signs.find((e) => e.kind === 'ladestele');
    ok(board && near(board.s, sec.s0 + POST.u - POST_SIGN_D, 1e-6) && board.texts[0] === 'Ladesäule', `2: ${where}: keine Tafel „Ladesäule ${POST_SIGN_D} m“`);
    ok(stele && near(stele.s, sec.s0 + st.u, 1e-6) && stele.x === st.x && stele.texts[0] === 'Ladesäule', `2: ${where}: keine Stele unter den Schildern`);
    // als Navi-Ziel (mit dem Zielbrunnen am Ende der Fahrt) dieselben Tafeln, dazu das Ziel
    const goal = [];
    sectionSigns(null, [sec], sec, goal, { tables: false, target: p.i });
    ok(goal.some((e) => e.kind === 'ziel') && goal.filter((e) => e.kind === 'ladestele' || e.kind === 'ladesaeule').length === 2, `2: ${where}: als Ziel ohne Stele oder Tafel`);
    // nichts auf ihrem Platz, nichts in der Sichtlinie (die Regel des Plans und, unabhängig davon, in 3D)
    ok(L.steleBlockers(plan, st, city.info).length === 0, `2: ${where}: Plan lässt ${L.steleBlockers(plan, st, city.info).map((i) => plan.items[i].name)} an der Stele`);
    let free = 0;
    for (let dd = 20; dd <= 150; dd += 10) {
      const h = [...hides(plan, st, S.eye, S.eyeY, dd), ...hides(plan, st, S.lane, DRONE_Y, dd + 8)];
      if (h.length) {
        ok(dd < 30, `2: ${where}: aus ${dd} m verdeckt ${h.join(', ')} die Stele`);
        break;
      }
      free = dd;
    }
    if (free === 150) free150++;
    // derselbe Ort an anderer Stelle des Wegs, über einen anderen Knoten erreicht: derselbe Park, dieselbe Stele
    const other = { ...sec, node: 2, s0: 7000, s1: 7000 + len, spotS: 7000 + (sec.spotS - sec.s0) };
    const op = townPlan(city, other);
    ok(op.charge.u === pc.u && JSON.stringify(op.charge.stele) === JSON.stringify(pc.stele) && op.items.length === plan.items.length, `2: ${where}: von anderswo ein anderer Park`);
    const size = L.sizeOf(p.pop);
    const b = bySize.get(size) || { towns: 0, free: Infinity };
    b.towns++;
    b.free = Math.min(b.free, free);
    bySize.set(size, b);
    list.push(`${p.name}\t${size}\t${free}`);
  }
  // am Start in Erlensee: der Supercharger, keine Stele und keine Tafel davor
  const erl = places.find((p) => p.key === CHARGE.place);
  const first = { kind: 'stadt', place: erl.i, node: 1, frame: 1, s0: -300, s1: 200, start: true, spotS: 0 };
  const fs = [];
  sectionSigns(null, [first], first, fs, { tables: false });
  ok(steleOf(first) === null && !fs.some((e) => e.kind === 'ladestele' || e.kind === 'ladesaeule'), '2: am Start eine Stele');
  ok(list.length === places.length && list.length > 400 && free150 === places.length, `2: ${list.length} Orte, ${free150} davon bis 150 m frei`);
  if (process.env.LADEN2_LIST) (await import('node:fs')).writeFileSync(process.env.LADEN2_LIST, 'Ort\tGröße\tStele frei bis (m)\n' + list.join('\n') + '\n');
  console.log(`  ${list.length} Orte: ` + [...bySize].map(([k, v]) => `${k} ${v.towns} (frei bis ${v.free} m)`).join(', ') + ` · Stele ${ST.w} × ${ST.h} m ab ${ST.y} m, ${ST.d} m vor der Mitte des Parks, Tafel ${POST_SIGN_D} m davor`);
}

// --- 3. Eine Warteschlange, BrunnenTV zuerst ----------------------------------------------------------------------
// „Wenn eine Folge beginnt, soll sie sofort beginnen und alles andere warten.“ Der echte Stream (stream-sim) mit der
// echten Sprachausgabe über einer nachgebauten Web-Speech-API (wie tools/testlauf4-test.mjs 2: Uhr der Seite in
// Spielzeit, Stimmen 35 % langsamer als geschätzt, speak() gleich nach cancel() verschluckt): Eine Folge unterwegs
// beginnt mitten in einer langen Sprachdurchsage bzw. mitten in einem langen Satz OMIs. Binnen 0,5 s ist es still (der
// Satz endet höflich, sein Untertitel geht mit), die Hymne (TV.card) spielt in die Stille, Gruß, Ruf und OMIs Satz der
// Folge beginnen zu ihrer Zeit, der Reihe nach, ganz gesprochen, mit ihrem Untertitel; was derweil sprechen wollte
// (OMI, ein Megafon-Wunsch), wartet und spricht danach, Veraltetes entfällt.
console.log('3. Eine Warteschlange, BrunnenTV zuerst:');
{
  const { makeStream, DRIVERS } = await import('./stream-sim.mjs');
  const { Speech, estimateSpeech, EPISODE } = await import('../src/speech.js');
  const { UI } = await import('../src/ui/ui.js');
  const { TV } = await import('../src/world/xxl/brunnentv.js');
  const { SCHOENER_BRUNNEN } = await import('../src/data.js');
  const { places } = await import('../src/map/graph.js');
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
  const SLOW = 1.35;
  const engine = {
    speaking: null,
    log: [],
    lastCancel: -1,
    getVoices: () => [{ name: 'Microsoft Katja - German (Germany)', lang: 'de-DE' }, { name: 'Microsoft Stefan - German (Germany)', lang: 'de-DE' }, { name: 'Google Deutsch', lang: 'de-DE' }],
    pause() {},
    resume() {},
    speak(u) {
      if (clock.t - this.lastCancel < 0.001) {
        this.log.push({ text: u.text, lost: true, start: clock.t });
        return;
      }
      const e = { u, text: u.text, start: clock.t, end: clock.t + estimateSpeech(u.text, u.rate) * SLOW };
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
  const cls = { toggle() {}, add() {}, remove() {} };
  const LONG = {
    durchsage: 'Hallo Mini Adam, hier spricht der Chat mit einer sehr langen Sprachdurchsage, die einfach nicht aufhören will, weil wir dich so gern haben!',
    omi: 'Ich habe die Wasserqualität aller Brunnen auf dem Weg vorsorglich geprüft und für sehr gut befunden, das wollte ich nur einmal sagen.',
  };
  const runs = [];
  for (const what of ['durchsage', 'omi']) {
    clock.timers = [];
    const sub = { lines: [], line: null, subEl: { classList: cls, className: '' }, subLabel: { textContent: '' }, subText: { textContent: '' } };
    for (const m of ['speak', 'showLine', 'megafon', 'nomi', 'studio', 'adam', 'durchsage']) sub[m] = UI.prototype[m];
    const S = makeStream({ driver: DRIVERS.zuegig, seed: 5, endless: true });
    const g = S.game;
    const speech = new Speech();
    g.speech = speech;
    for (const m of ['megafon', 'nomi', 'studio', 'durchsage', 'adam']) g.ui[m] = (...a) => sub[m](...a);
    const offset = clock.t - g.t;
    const R = { what, trigger: null, t0: null, quiet: null, subGone: null, cut: null, waited: [], marks: {} };
    let line = null;
    let stage = 0;
    for (let i = 0; i < 200 * 30; i++) {
      // nach einer halben Minute Fahrt: der lange Satz beginnt; 1,5 s später die Folge (Taste B), in ihr will OMI etwas
      // sagen, und Mini Adam ruft durchs Megafon
      if (stage === 0 && g.t > 30 && !g.tv && !g.charging && !speech.current && !speech.queue.length) {
        stage = 1;
        if (what === 'durchsage') speech.say(LONG.durchsage, 'karla', { onStart: (d) => (line = sub.durchsage('Karla', LONG.durchsage, d + 1, 'Testerin')), onDrop: () => line && (line.t = 0) });
        else g.say(LONG.omi, 'talk');
        R.lineAt = g.t;
      }
      if (stage === 1 && g.t > R.lineAt + 1.5 && speech.current) {
        stage = 2;
        R.trigger = g.t;
        R.text = speech.current.text;
        const place = places.findIndex((q) => q.name === 'Erlensee');
        g.startBrunnenTV({ place, name: 'Erlensee', goal: 'Erlensee' }, S.trip.section, { way: true });
        R.t0 = g.tv.t0;
      }
      if (stage === 2 && g.tv && g.t > R.t0 + TV.line + 1 && !R.omiAsked) {
        R.omiAsked = true;
        // OMI will mitten in der Folge etwas Wichtiges sagen (am Spiel vorbei direkt in die Sprachausgabe)
        speech.say('Achtung, gleich wird es eng.', 'board', { priority: true });
      }
      if (stage === 2 && g.tv && g.t > R.t0 + TV.call + 1 && !R.wish) {
        R.wish = true;
        // und Mini Adam ruft durchs Megafon (Taste H)
        speech.say('Achtung, Achtung! Bitte machen Sie die Spur frei!', 'adam');
      }
      S.step(1 / 30);
      clock.t += 1 / 30;
      runTimers();
      for (const l of sub.lines) l.t -= 1 / 30;
      sub.lines = sub.lines.filter((l) => l.t > 0);
      sub.showLine();
      if (stage === 2) {
        const dt = g.t - R.t0;
        if (R.quiet === null && !engine.speaking) R.quiet = dt;
        if (R.subGone === null && !sub.lines.some((l) => l.text.includes(what === 'durchsage' ? 'Sprachdurchsage' : 'Wasserqualität') || (what === 'omi' && l.text === LONG.omi))) R.subGone = dt;
        for (const [k, at] of [['card', TV.card + 0.05], ['line', TV.line + 0.1], ['call', TV.call + 0.1], ['nomi', TV.nomi + 0.5]]) {
          if (!R.marks[k] && dt >= at) R.marks[k] = { text: sub.subText.textContent, speaking: engine.speaking ? engine.speaking.text : null };
        }
        if (!g.tv && dt > TV.end + 12) break;
      }
    }
    const t0 = R.t0 + offset;
    const lineOf = (text) => engine.log.find((e) => e.text === text && e.start >= t0);
    const ep = engine.log.filter((e) => e.start >= t0 && e.start < t0 + TV.end + 4);
    const first = engine.log.find((e) => e.text === R.text);
    R.cut = first && first.cut !== undefined ? first.cut - t0 : null;
    R.ep = ep.map((e) => ({ text: e.text.slice(0, 28), at: +(e.start - t0).toFixed(2), len: +(e.end - e.start).toFixed(2), cut: e.cut !== undefined, done: !!e.done, lost: !!e.lost }));
    const call = lineOf(SCHOENER_BRUNNEN.say);
    const before = ep.filter((e) => call && e.start < call.start);
    const greet = before.find((e) => e.start - t0 >= TV.line - 1e-6);
    const after = engine.log.filter((e) => e.start >= t0 + TV.end - 1);
    const name = `3 ${what}`;
    ok(R.trigger !== null && R.quiet !== null && R.quiet <= EPISODE.polite + 0.1 && R.quiet < 0.5 && R.quiet < TV.card, `${name}: still erst ${R.quiet} s nach dem Beginn der Folge`);
    ok(R.subGone !== null && R.subGone <= 0.5, `${name}: Untertitel des abgebrochenen Satzes noch ${R.subGone} s`);
    ok(greet && near(greet.start - t0, TV.line, 0.1) && greet.done && greet.cut === undefined, `${name}: Gruß ${greet ? `ab ${(greet.start - t0).toFixed(2)} s, ${greet.done ? 'ganz' : 'abgebrochen'}` : 'fehlt'}`);
    ok(call && near(call.start - t0, TV.call, 0.3) && call.done && call.cut === undefined, `${name}: Ruf ${call ? `ab ${(call.start - t0).toFixed(2)} s` : 'fehlt'}`);
    const nomi = ep.find((e) => e.start - t0 >= TV.nomi - 1e-6 && e.start - t0 < TV.nomi + 1);
    ok(nomi && nomi.done && nomi.cut === undefined, `${name}: OMIs Satz der Folge ${nomi ? `ab ${(nomi.start - t0).toFixed(2)} s` : 'fehlt'}`);
    // zwischen Beginn und Ende der Folge spricht nur sie: kein fremder Satz, nichts abgebrochen, nichts verschluckt
    const during = engine.log.filter((e) => e.start >= t0 && e.start < (nomi ? nomi.end : t0 + TV.end));
    ok(during.length === 3 && during.every((e) => !e.lost && e.cut === undefined), `${name}: in der Folge ${JSON.stringify(R.ep)}`);
    ok(R.marks.line && R.marks.line.text.includes(greet ? greet.text.slice(0, 12) : '?') && R.marks.call && R.marks.call.text === '»' + SCHOENER_BRUNNEN.text + '«', `${name}: Untertitel ${JSON.stringify(R.marks)}`);
    // danach: was gewartet hat, spricht (OMIs Wichtiges, Mini Adams Megafon) – der abgebrochene Satz kommt nicht wieder
    ok(after.some((e) => e.text === 'Achtung, gleich wird es eng.') && after.some((e) => /Achtung, Achtung/.test(e.text)) && !after.some((e) => e.text === R.text), `${name}: nach der Folge ${JSON.stringify(after.map((e) => e.text.slice(0, 24)))}`);
    runs.push(R);
  }
  // veraltet: was länger als EPISODE.stale wartete, entfällt am Ende der Folge (onDrop), Frisches bleibt
  {
    const sp = new Speech();
    const dropped = [];
    sp.say('Erster Satz, der gerade spricht.', 'board', { priority: true });
    sp.episode(true);
    sp.say('Alt', 'karla', { onDrop: () => dropped.push('Alt') });
    clock.t += EPISODE.stale + 1;
    runTimers();
    sp.say('Frisch', 'karla', { onDrop: () => dropped.push('Frisch') });
    sp.episode(false);
    ok(dropped.join() === 'Alt' && sp.current && sp.current.text === 'Frisch', `3: veraltet ${dropped}, spricht ${sp.current && sp.current.text}`);
    sp.stopAll();
    // höflich: Ein Satz, der laut Schätzung gleich fertig ist, darf ausreden – spricht er länger (die Stimme ist
    // langsamer als geschätzt), endet er spätestens nach EPISODE.polite
    clock.t += 1;
    runTimers();
    const gone = [];
    sp.say('Gleich fertig.', 'board', { priority: true, onDrop: () => gone.push(clock.t) });
    const e0 = engine.speaking;
    clock.t += estimateSpeech('Gleich fertig.', 1) - 0.25;
    runTimers();
    const t1 = clock.t;
    sp.episode(true);
    const still = engine.speaking === e0;
    for (let i = 0; i < 30; i++) {
      clock.t += 1 / 30;
      runTimers();
    }
    ok(still && e0.cut !== undefined && e0.cut - t1 <= EPISODE.polite + 1e-6 && gone.length === 1, `3: höflich ${still ? 'ausreden lassen' : 'sofort abgebrochen'}, Ende ${e0.cut === undefined ? '–' : (e0.cut - t1).toFixed(2) + ' s'} nach Beginn der Folge`);
    sp.stopAll();
  }
  Object.assign(globalThis, { setTimeout: saved.setTimeout, clearTimeout: saved.clearTimeout, window: saved.window, SpeechSynthesisUtterance: saved.utt });
  Date.now = saved.now;
  console.log('  ' + runs.map((R) => `${R.what}: still nach ${R.quiet && R.quiet.toFixed(2)} s (Satz bis ${R.cut === null ? '–' : R.cut.toFixed(2) + ' s'}), Folge ${R.ep.map((e) => `${e.text.slice(0, 14)}… ${e.at}–${(e.at + e.len).toFixed(1)} s${e.cut ? ' ABGEBROCHEN' : ''}`).join(', ')}`).join(' · '));
}

console.log(fails ? `laden2-test: ${fails} Fehler (${checks} Prüfungen)` : `laden2-test: alles gut (${checks} Prüfungen)`);
process.exit(fails ? 1 : 0);
