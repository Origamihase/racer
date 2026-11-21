// Prüft das Geld der Reise ohne Grafik: das echte Spiel (Game mit seiner Stream-Kasse economy.js) auf der echten Fahrt
// über die Karte (Trip, Halt am Brunnen), in simulierten Streams mit drei Fahrertypen.
// node tools/geld-test.mjs [Streams je Fahrer, Standard 4] [Minuten je Stream, Standard 30]
// - Gebote in Zehnern: Jedes Gebot und jeder Schritt ein Vielfaches von 10 €, jede Runde beginnt mit
//   einem Zehner (im Chaos auch mal 20 oder 30 €); gewöhnliche Runden enden bei Zehnern bis wenigen Hundert Euro
//   (Median, 9. Dezil und Höchstes stehen in der Ausgabe, die Grenzen bei TOPS). Die Kasse bucht jedes Gebot ganz.
// - BontanaBack (economy.js BONTANA): ab der dritten Runde, höchstens zweimal je Stream, nie zwei Runden hintereinander;
//   er und wer vorn lag im Wechsel, sein letztes Gebot auf einer 500er-Marke von 1.000 bis 3.000 €. Geprüft an der
//   Stream-Kasse allein (viele Streams) und im echten Spiel (lange Streams: Rand, Chat, James).
// - Werkstatt-Rechnung (data.js REPARATUR): An jedem Ziel kostet jeder zählende Rempler der Runde bump, jede neue
//   Kratzspur mark Euro, bezahlt aus der Stream-Kasse in ganzen Euro (was fehlt, wird erlassen); die Zeile der Runde
//   am Rand nennt Einnahmen und Reparatur, und die Einnahmen aller Runden ergeben zusammen genau, was der Stream
//   verdient hat.
// - Zufriedenheit des Chats (satisfaction.js): die Formel an gestellten Fahrten (Gleichgewicht je Tempo, Stehen, neuer
//   Plan, Umweg, Urteil am Ziel), im Spiel geordnet nach Fahrer (zügig > mittel > gemütlich), und ihre Wirkung auf
//   Spenden, Abos, VIP, Zuschauer und den Ton des Chats.
// - Die Leute des Streams (data.js CREW): wie oft König Knolli raidet und jubelt, die Mods (mit MOD), Discord, die
//   Meldung nach dem Funkloch und das stille Herz; der Abspann der Reise mit der Zeile des Gedenkens im Wortlaut.
import { readFileSync } from 'fs';
import { PerspectiveCamera } from 'three';
import { Trip, J } from '../src/game/trip.js';
import { Game } from '../src/game/game.js';
import { Economy, BONTANA } from '../src/game/economy.js';
import { Satisfaction, ZUFRIEDEN } from '../src/game/satisfaction.js';
import { clamp } from '../src/util.js';
import { limitsFor, Arrival, AUTO } from '../src/world/xxl/plan.js';
import { CHAT, REPARATUR, CREW, CREW_LINES, ABSPANN_CREW, ABSPANN_REISE, GEDENKEN } from '../src/data.js';

const STREAMS = Number(process.argv[2]) || 4;
const MINUTES = Number(process.argv[3]) || 30;
const DT = 1 / 30;
let fails = 0;
let checks = 0;
const seen = new Map();
function ok(cond, msg) {
  checks++;
  if (cond) return;
  fails++;
  const n = (seen.get(msg.slice(0, 40)) || 0) + 1;
  seen.set(msg.slice(0, 40), n);
  if (n <= 3) console.error('FEHLER: ' + msg);
}
const fmt = (x, d = 0) => x.toFixed(d).replace('.', ',');
/** Wert beim Anteil f einer Liste (0,5 = Median, 0,9 = 9. Dezil). */
const q = (list, f) => (list.length ? [...list].sort((a, b) => a - b)[Math.min(list.length - 1, Math.floor(f * list.length))] : NaN);

// Zufall mit festem Startwert, damit jeder Lauf dieselben Streams fährt
function mulberry32(a) {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- Die Mitspieler des Spiels, die es ohne Grafik nicht gibt: nehmen alles an, liefern nichts ------------------------
const NONE = [];
const noop = () => {};
const loose = (base = {}) => new Proxy(base, { get: (t, k) => (k in t ? t[k] : noop) });

/**
 * Drei Fahrer wie in tools/journey-test.mjs: cruise ist das Wunschtempo auf freier Strecke (Limits und Kurven hält der
 * Begrenzer ein), miss der Anteil der angesagten Ausfahrten, an denen er vorbeifährt, skip: fährt nach dem Halt am
 * Brunnen gleich weiter.
 */
const DRIVERS = [
  { name: 'zügig', cruise: 185, miss: 0, skip: true },
  { name: 'mittel', cruise: 145, miss: 0.06, skip: false },
  { name: 'gemütlich', cruise: 110, miss: 0.15, skip: false },
];

/**
 * Ein Stream der Reise mit einem Fahrer: minutes Minuten, der Akku bleibt voll (ums Laden geht es hier nicht).
 * Liefert die Runden (je Runde ihre Gebote) und das Spiel am Ende.
 */
function journey(driver, minutes, seed, hook = null) {
  Math.random = mulberry32(seed);
  const trip = new Trip({ rng: Math.random });
  const arrival = new Arrival();
  arrival.hold = true;
  const camera = new PerspectiveCamera(60, 16 / 9, 0.1, 3000);
  let ids = 0;
  const chat = [];
  const toasts = [];
  const game = new Game({
    traffic: loose({ cars: NONE, update: () => NONE, nearby: () => NONE, police: () => null, megafon: () => 0 }),
    scenery: loose({ request: () => ++ids, landmarkSpot: (s) => s, placed: () => null }),
    road: loose(),
    sky: loose(),
    rain: loose(),
    windshield: loose({ firmware: 0, manual: () => 'wipe' }),
    cockpit: loose({ nomi: loose() }),
    audio: loose(),
    speech: loose({ say: () => 2.5, busy: false, queue: NONE, current: null }),
    ui: loose({ chat: (m) => chat.push({ t: game.t, ...m }), toast: (text, kind, key, parts) => toasts.push({ t: game.t, text, kind, key, parts }) }),
    fx: loose(),
    pickups: loose({ update: () => NONE }),
    world: { trip: () => trip, stopping: () => !!arrival.pending, release: () => arrival.reset(), square: () => null, town: () => null },
  });
  // (die Streams laufen hier ihre volle Länge: Ob nach einer Folge noch jemand bietet, prüft ansagen-test)
  game.endless = true;
  game.start({ upgrades: {}, best: {} });
  const p = game.player;
  p.s = trip.s;
  p.x = trip.x;
  p.speed = 40 / 3.6;
  const nv = game.navi;
  const lim = { left: 0, right: 0, shoulder: 0, lanes: null, extraLane: null, vmax: Infinity, decel: 0, slack: 0, closing: 0 };
  const sloppy = new WeakMap();
  const run = { rounds: [[]], bids: 0, booked: 0, bidSum: 0, earned: 0, bills: [], zSum: 0, zN: 0, viewSum: 0, viewers: [] };
  const payBill = game.payBill.bind(game);
  game.payBill = (b) => {
    if (hook && hook.bill) hook.bill(game, b);
    const before = game.money;
    payBill(b);
    run.bills.push({ ...b, t: game.t, paid: before - game.money, left: game.money, toast: toasts[toasts.length - 1], james: chat.filter((m) => m.name === 'James').pop() });
  };
  const overbid = nv.overbid.bind(nv);
  nv.overbid = (s, bidder, inc, target) => {
    const was = nv.bid;
    const t = overbid(s, bidder, inc, target);
    run.bids++;
    run.bidSum += nv.bid;
    const plan = game.bidPlan;
    run.rounds[run.rounds.length - 1].push({ bid: nv.bid, inc, was, bidder, kind: plan.kind, first: !!plan.first, last: !!plan.last, round: game.eco.round, t: game.t });
    return t;
  };
  const earn = game.earn.bind(game);
  game.earn = (amount, label, opts) => {
    if (label === 'Navi-Gebote') run.booked += amount;
    if (amount > 0) run.earned += amount;
    return earn(amount, label, opts);
  };
  const ctl = { steer: 0, throttle: 0, brake: 0, kappa: 0, grade: 0, horn: false, wiper: false, megafon: false };
  const steps = Math.round((minutes * 60) / DT);
  for (let i = 0; i < steps; i++) {
    limitsFor(trip, lim, arrival.stop(trip));
    p.setLimits(lim);
    // der Fahrer: folgt dem Navi (Ausfahrt nehmen, sonst mittlere Spur) – oder fährt an einer Ausfahrt vorbei
    let want = J.L0;
    const sec = trip.section;
    if (sec.kind === 'ab') {
      const f = sec.fork;
      want = 5.625;
      if (f && !f.taken && f.s - trip.s < J.decel - 10) {
        const plan = f.forced ? 'exit' : trip.planFor(f);
        if (!sloppy.has(f)) sloppy.set(f, Math.random() < driver.miss);
        if (plan === 'exit' && !(sloppy.get(f) && !f.forced)) want = J.L0;
      }
    }
    const dx = want - (p.x + p.vx * AUTO.look);
    ctl.steer = Math.abs(dx) > AUTO.tol ? Math.max(-1, Math.min(1, dx * AUTO.gain)) : 0;
    const v = Math.min(lim.vmax, driver.cruise / 3.6);
    ctl.throttle = p.speed < v - 0.5 ? 1 : 0;
    ctl.brake = p.speed > v + 3 ? 0.4 : 0;
    if (game.tv && driver.skip) ctl.throttle = game.t - game.tv.t0 < 0.9 ? 0 : 1;
    game.offAutobahn = sec.kind !== 'ab';
    const tvBefore = game.tv;
    game.update(DT, ctl, camera);
    p.battery = 100;
    if (hook && hook.frame) hook.frame(game);
    if (game.over) break;
    run.zSum += game.zufrieden.value;
    run.zN++;
    run.viewSum += game.viewers;
    if (i % 30 === 0) run.viewers.push(game.viewers);
    const evs = trip.update(p.s, p.x);
    for (const e of evs) game.onTrip(e);
    const rest = arrival.update(trip, evs, p.speed);
    if (rest) game.onTrip(rest);
    // eine Ankunft beendet die Runde: Das nächste Gebot gehört zur neuen
    if (!tvBefore && game.tv) run.rounds.push([]);
  }
  run.game = game;
  run.chat = chat;
  run.toasts = toasts;
  return run;
}

// --- Gebote in Zehnern ---------------------------------------------------------------------------------------------
console.log('Gebote in Zehnern (Reise):');
// gewöhnliche Runden: Höchstgebot im Median und im 9. Dezil, das Höchste überhaupt (Euro)
const TOPS = { median: [60, 300], p90: [100, 800], max: 1000 };
const runs = new Map();
for (const d of DRIVERS) {
  const list = [];
  for (let k = 0; k < STREAMS; k++) list.push(journey(d, MINUTES, 1000 + 7919 * k));
  runs.set(d.name, list);
  const all = list.flatMap((r) => r.rounds.filter((x) => x.length));
  // (gewöhnliche Runden: ohne BontanaBack, der wird unten für sich geprüft)
  const rounds = all.filter((x) => !x.some((b) => b.kind === 'bontana'));
  const tops = rounds.map((x) => x[x.length - 1].bid);
  const sums = rounds.map((x) => x.reduce((s, b) => s + b.bid, 0));
  const bids = all.flat();
  for (const b of bids) ok(b.bid % 10 === 0 && b.inc % 10 === 0 && b.bid - b.was === b.inc, `${d.name}: Gebot ${b.bid} € nach ${b.was} € (Schritt ${b.inc} €) ist kein Zehner`);
  for (const x of all) ok(x[0].was === 0 && x[0].bid >= 10 && x[0].bid <= 30, `${d.name}: Die Runde beginnt bei ${x[0].bid} € (vorher ${x[0].was} €)`);
  for (const r of list) ok(Math.abs(r.booked - r.bidSum) < 1e-6 && Math.abs((r.game.breakdown['Navi-Gebote'] || 0) - r.bidSum) < 1e-6, `${d.name}: Gebote ${r.bidSum} €, verbucht ${r.booked} €`);
  const med = q(tops, 0.5);
  const p90 = q(tops, 0.9);
  const max = Math.max(...tops);
  ok(med >= TOPS.median[0] && med <= TOPS.median[1] && p90 >= TOPS.p90[0] && p90 <= TOPS.p90[1] && max <= TOPS.max, `${d.name}: Höchstgebot je Runde Median ${med} €, 9. Dezil ${p90} €, höchstens ${max} € (erlaubt ${JSON.stringify(TOPS)})`);
  const money = list.map((r) => r.game.money);
  const mins = list.reduce((s, r) => s + r.game.t, 0) / 60;
  console.log(`  ${d.name} (${d.cruise} km/h), ${STREAMS} Streams zu ${MINUTES} min: ${all.length} Runden (${all.length - rounds.length} mit BontanaBack), ${fmt(bids.length / all.length, 1)} Gebote je Runde · Höchstgebot Median ${med} €, 9. Dezil ${p90} €, höchstens ${max} € · Summe der Gebote je Runde Median ${fmt(q(sums, 0.5))} €, 9. Dezil ${fmt(q(sums, 0.9))} € · Gebote ${fmt(list.reduce((s, r) => s + r.bidSum, 0) / mins, 1)} €/min von ${fmt(money.reduce((a, b) => a + b, 0) / mins, 1)} €/min · je Stream ${fmt(money.reduce((a, b) => a + b, 0) / STREAMS)} €`);
}

// --- BontanaBack ---------------------------------------------------------------------------------------------------
/** Prüft eine Eskalation (die Gebote einer Runde mit kind 'bontana', in Reihenfolge); vollständig: endet mit seinem letzten. */
function escalation(list, where) {
  const T = BONTANA;
  ok(list[0].first && list[0].round >= T.from, `${where}: BontanaBack kommt in Runde ${list[0].round} (frühestens ${T.from})`);
  list.forEach((b, k) => {
    const his = k % 2 === 0;
    ok((b.bidder === T.name) === his, `${where}: Gebot ${k + 1} der Eskalation von ${b.bidder}`);
    if (!his) ok(T.rival.includes(b.inc), `${where}: Antwort +${b.inc} € statt ${T.rival.join('/')}`);
    else if (b.last) ok(b.bid % T.mark === 0 && b.bid >= T.floor && b.bid <= T.cap, `${where}: BontanaBack endet bei ${b.bid} €`);
    else {
      const [a, z] = k ? T.then : T.first;
      ok(b.inc >= a && b.inc <= z, `${where}: BontanaBack legt ${b.inc} € drauf (erwartet ${a}–${z})`);
    }
  });
  const done = list[list.length - 1].last;
  if (done) ok(T.bids.includes(list.length), `${where}: Eskalation mit ${list.length} Geboten`);
  return done;
}
console.log('BontanaBack (Reise):');
{
  // die Stream-Kasse allein: 400 Streams zu 12 Runden, je Runde so viele Gebote, dass jede Eskalation zu Ende kommt
  const T = BONTANA;
  const eco = new Economy({ seed: 11 });
  let eligible = 0;
  let came = 0;
  const per = [0, 0, 0];
  const finals = [];
  for (let st = 0; st < 400; st++) {
    eco.reset();
    const rounds = [];
    for (let r = 1; r <= 12; r++) {
      if (r > 1) eco.newRound();
      let bid = 0;
      const list = [];
      let calm = 0;
      for (let i = 0; i < 40 && calm < 3; i++) {
        const plan = eco.nextBid({ bid, drive: 300 });
        if (plan.kind !== 'chaos' && plan.kind !== 'bontana') calm++;
        bid += plan.increment;
        if (plan.kind === 'bontana') list.push({ bid, inc: plan.increment, was: bid - plan.increment, bidder: list.length % 2 ? 'x' : T.name, first: !!plan.first, last: !!plan.last, round: eco.round });
      }
      if (list.length) {
        rounds.push(r);
        ok(escalation(list, `Kasse, Stream ${st}, Runde ${r}`), `Kasse: Eskalation in Runde ${r} bleibt unvollständig`);
        finals.push(list[list.length - 1].bid);
      }
      const blocked = rounds.length >= T.max || rounds.includes(r - 1) || r < T.from;
      if (!blocked || rounds.includes(r)) eligible++;
      if (rounds.includes(r)) came++;
    }
    ok(rounds.length <= T.max && rounds.every((r, i) => r >= T.from && (i === 0 || r - rounds[i - 1] > 1)), `Kasse: BontanaBack in den Runden ${rounds.join(', ')}`);
    per[rounds.length]++;
  }
  const share = came / eligible;
  ok(Math.abs(share - T.chance) < 0.05, `Kasse: BontanaBack in ${fmt(100 * share)} % der möglichen Runden (soll ${fmt(100 * T.chance)} %)`);
  console.log(`  Kasse allein, 400 Streams zu 12 Runden: in ${fmt(100 * share, 1)} % der möglichen Runden, je Stream 0/1/2-mal: ${per.join(' / ')} · Endstand Median ${q(finals, 0.5)} €, 9. Dezil ${q(finals, 0.9)} €, höchstens ${Math.max(...finals)} €`);
  // im echten Spiel: alle Streams von oben, dazu lange Streams des zügigen Fahrers (viele Runden) – mindestens drei
  // und so viele mehr, bis drei Eskalationen ganz geprüft sind (höchstens zwölf): Ob BontanaBack vor der Ankunft
  // zum Zug kommt, hängt am Zufall jedes Streams (und seit dem Zuschlag 5 km vor dem Brunnen auch am Weg dorthin)
  let shown = 0;
  let complete = 0;
  let count = 0;
  let long = 0;
  const tops = [];
  const streams = [...runs.values()].flat();
  for (let i = 0; i < streams.length || (long < 12 && (long < 3 || complete < 3)); i++) {
    const r = i < streams.length ? streams[i] : journey(DRIVERS[0], 90, 4304 + 62 * long++);
    const where = `Spiel, Stream ${i}`;
    const esc = r.rounds.map((x) => x.filter((b) => b.kind === 'bontana')).filter((x) => x.length);
    const at = esc.map((x) => x[0].round);
    ok(esc.length <= BONTANA.max && at.every((n, j) => j === 0 || n - at[j - 1] > 1), `${where}: BontanaBack in den Runden ${at.join(', ')}`);
    count += esc.length;
    for (const x of esc) {
      if (!escalation(x, where)) continue;
      complete++;
      tops.push(x[x.length - 1].bid);
      // am Rand: Auftritt und Endstand; im Chat: er selbst und der Chat außer sich
      const t0 = x[0].t;
      const t1 = x[x.length - 1].t;
      const edge = r.toasts.filter((m) => m.key === 'bontana' && m.t >= t0 - 0.01 && m.t <= t1 + 0.01);
      const own = r.chat.some((m) => m.name === BONTANA.name && m.t >= t0 && m.t <= t1 + 3);
      const said = r.chat.some((m) => m.name === BONTANA.name && CHAT.bontanaSchluss.includes(m.text) && m.t >= t1 && m.t <= t1 + 2);
      const wild = r.chat.filter((m) => m.t >= t0 && m.t <= t1 + 4 && (CHAT.bontana.includes(m.text) || CHAT.bontanaEnde.includes(m.text))).length;
      const james = r.chat.filter((m) => m.name === 'James' && m.t >= t0 - 0.01 && m.t <= t1 + 0.01 && m.text.includes(' bietet ')).length;
      ok(edge.length === 2 && /steigt ein/.test(edge[0].text) && /ESKALIERT: [\d.]+\s€ für /.test(edge[1].text) && own && said && wild >= 3 && james >= x.length, `${where}: Eskalation zeigt Rand ${edge.map((m) => m.text).join(' | ')}, er selbst ${own}, Schlusswort ${said}, Chat ${wild} Zeilen, James ${james}`);
      shown++;
    }
  }
  ok(complete >= 3, `Spiel: nur ${complete} vollständige Eskalationen geprüft`);
  console.log(`  im Spiel: ${count} Auftritte in ${streams.length + long} Streams (die von oben und ${long} × 90 min zügig), ${complete} vollständig, ${shown} mit Rand, Chat und James · Endstand ${tops.join(', ')} €`);
}

// --- Werkstatt-Rechnung je Runde -----------------------------------------------------------------------------------
console.log('Werkstatt-Rechnung (Reise):');
{
  const R = REPARATUR;
  // ein seitlicher Rempler, wie ihn der Verkehr meldet (zählt, wenn die Schonfrist vorbei ist)
  const bump = (game) => game.onCrash({ car: { s: game.player.s, speed: 20, len: 4.6, behavior: 'normal' }, lonOverlap: 3, latOverlap: 0.3, dx: 1, ds: 0 });
  // Runde 1: zwei Rempler und eine Kratzspur; Runde 2: heil; Runde 3: ein Rempler, aber die Kasse ist fast leer
  // (40,50 €: die Werkstatt nimmt ganze 40 €, erlässt 110 €, und die 50 Cent bleiben)
  const plan = { done: new Set(), hits: () => 0 };
  const hook = {
    frame(game) {
      const r = game.eco.round;
      const t = game.t;
      const once = (k, f) => !plan.done.has(k) && (plan.done.add(k), f(), true);
      if (r === 1 && t > 40) once('r1a', () => bump(game));
      if (r === 1 && t > 43) once('r1b', () => bump(game));
      if (r === 1 && t > 45) once('r1c', () => game.player.damage.scrape('left'));
      // (erst wieder in Fahrt: Gleich nach der BrunnenTV-Folge rollt der Wagen am Brunnen erst an, und ein Stoß dort
      // schob ihn an den Rand – das gab eine Kratzspur dazu)
      if (r === 3 && game.navi.target && !game.tv && game.player.speed > 15) once('r3', () => bump(game));
    },
    bill(game, b) {
      if (b.n === 3) game.money = 40.5;
    },
  };
  const run = journey(DRIVERS[0], 60, 2024, hook);
  const g = run.game;
  const [b1, b2, b3] = run.bills;
  ok(run.bills.length >= 3, `nur ${run.bills.length} Rechnungen in 60 Minuten`);
  if (b3) {
    ok(b1.n === 1 && b1.hits === 2 && b1.marks === 1 && b1.amount === 2 * R.bump + R.mark && b1.paid === b1.amount, `Runde 1: ${JSON.stringify(b1)}`);
    ok(/^🧾 Runde 1\s· Einnahmen \+[\d.]+\s€\s· Reparatur −325\s€$/.test(b1.toast.text) && b1.toast.key === 'rechnung', `Runde 1 am Rand: ${b1.toast.text}`);
    ok(b1.james && /Werkstatt-Rechnung für Runde 1: 325\s€ für 2 Rempler und 1 Kratzer – bezahlt aus der Stream-Kasse\./.test(b1.james.text), `Runde 1, James: ${b1.james && b1.james.text}`);
    ok(b2.n === 2 && b2.amount === 0 && b2.paid === 0 && /keine Schäden ✨$/.test(b2.toast.text) && b2.toast.kind === 'good', `Runde 2 ohne Schäden: ${b2.toast.text}`);
    ok(b3.n === 3 && b3.amount === R.bump && b3.paid === 40 && Math.abs(b3.left - 0.5) < 1e-9 && /Reparatur −40\s€ \(Rest 110\s€ erlassen\)$/.test(b3.toast.text) && /Bezahlt sind 40\s€, den Rest erlässt die Werkstatt/.test(b3.james.text), `Runde 3, Kasse fast leer: ${b3.toast.text} / ${b3.james && b3.james.text}`);
  }
  const paid = run.bills.reduce((a, b) => a + b.paid, 0);
  ok(Math.abs((g.breakdown.Reparaturen || 0) + paid) < 1e-6, `Abrechnung: Reparaturen ${g.breakdown.Reparaturen} €, bezahlt ${paid} €`);
  // die Einnahmen aller Runden plus die der laufenden sind genau das Verdiente
  const income = run.bills.reduce((a, b) => a + b.income, 0) + g.tally.income;
  ok(Math.abs(income - run.earned) < 1e-6, `Einnahmen der Runden ${income} € statt ${run.earned} €`);
  for (const b of run.bills) ok(b.toast.parts.map((x) => x[0]).join('') === b.toast.text, `Zeile in Teilen ≠ Text: ${b.toast.text}`);
  // umbrochen wird nur an Trennern ohne Klasse (ein Leerzeichen oder „ · “ mit geschütztem Leerzeichen davor), so steht
  // nie ein „·“ oder eine halbe Angabe am Anfang der zweiten Reihe (Handy hochkant)
  for (const b of run.bills) ok(b.toast.parts.every(([t, c]) => (c ? !/^\s|\s$/.test(t) : /^(\u00a0· | )$/.test(t))), `Trenner der Zeile: ${JSON.stringify(b.toast.parts)}`);
  // Im Browser geht der Hinweis über die UI-Fassade in main.js: Sie muss die Teile weiterreichen, sonst steht die Zeile
  // einfarbig am Rand (so war es bis 694f1ff – die Bilder zeigten es, dieser Test nicht)
  const facade = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8').match(/^\s*toast: \(([^)]*)\) => ui\.toast\(([^)]*)\)/m);
  ok(facade && facade[1].split(',').length === 4 && /\bparts\b/.test(facade[2]), `UI-Fassade (main.js) reicht die Teile eines Hinweises nicht weiter: ${facade && facade[0].trim()}`);
  console.log(`  60 min zügig: ${run.bills.map((b) => `Runde ${b.n} +${fmt(b.income)} € / −${fmt(b.paid)} €${b.paid < b.amount ? ` (${fmt(b.amount - b.paid)} € erlassen)` : ''}`).join(' · ')} · „${b1 && b1.toast.text}“`);
  // ohne Absicht: wie oft rempelt und kratzt der zügige Fahrer ohne Verkehr? (gar nicht – die Rechnung kommt vom Verkehr)
  const all = [...runs.values()].flat().flatMap((r) => r.bills);
  ok(all.length > 0 && all.every((b) => b.amount === R.bump * b.hits + R.mark * b.marks && b.paid <= b.amount + 1e-9), 'Rechnungen der Streams oben passen nicht zu ihren Schäden');
  console.log(`  Streams oben: ${all.length} Rechnungen, davon ${all.filter((b) => b.amount).length} mit Schäden (ohne Verkehr), Kratzspuren ${all.reduce((a, b) => a + b.marks, 0)}`);
}

// --- Zufriedenheit des Chats ---------------------------------------------------------------------------------------
console.log('Zufriedenheit des Chats (Reise):');
{
  const Z = ZUFRIEDEN;
  /** Eine gestellte Fahrt: p faire Sekunden je Sekunde, secs Sekunden lang (R fällt von 5000), Tempo kmh. */
  const drive = (z, p, secs, kmh = 120) => {
    const dt = 1 / 30;
    let R = 5000;
    for (let i = 0; i < secs * 30; i++) {
      R -= p * dt;
      z.update(dt, { secs: R, counted: true, kmh });
    }
    return z;
  };
  const eq = (p) => drive(new Satisfaction(), p, 4000).value;
  const e125 = eq(1.25);
  const e100 = eq(1);
  const e085 = eq(0.85);
  // (neutral ist das Tempo fair, knapp unter dem des Navis: Gleichgewicht home + rate · homeTau · (p − fair), in 0 … 100)
  const want = (p) => clamp(Z.home + Z.rate * Z.homeTau * clamp(p - Z.fair, Z.lo, Z.hi), 0, 100);
  ok(Math.abs(e125 - want(1.25)) < 1.5 && Math.abs(e100 - want(1)) < 1.5 && Math.abs(e085 - want(0.85)) < 1.5 && e125 > e100 && e100 > e085, `Gleichgewicht ${fmt(e125, 1)} / ${fmt(e100, 1)} / ${fmt(e085, 1)}`);
  const st = new Satisfaction();
  drive(st, 0, 60, 0);
  const standDrop = Z.start - st.value;
  ok(standDrop >= 15 && standDrop <= 22, `eine Minute Stehen mit Ziel: −${fmt(standDrop, 1)}`);
  // neuer Plan: R springt (Gebot), das zählt nicht
  const jp = drive(new Satisfaction(), 1, 10);
  const before = jp.value;
  jp.update(1 / 30, { secs: 9000, counted: true, kmh: 120 });
  ok(Math.abs(jp.value - before) < 0.01 && jp.fair < 11, `neuer Plan zählt mit (${fmt(jp.value - before, 3)}, F ${fmt(jp.fair, 1)})`);
  // Umweg: sofort −4, und der Sprung danach kostet faire Sekunden
  const dw = drive(new Satisfaction(), 1, 40);
  const v0 = dw.value;
  dw.detour();
  ok(Math.abs(dw.value - (v0 + Z.detour)) < 1e-9, 'Umweg kostet nicht sofort ' + Z.detour);
  const f0 = dw.fair;
  dw.update(1 / 30, { secs: dw.prev + 120, counted: true, kmh: 120 });
  ok(Math.abs(dw.fair - (f0 - 120)) < 1e-6, `Umweg zählt nicht: F ${fmt(f0, 1)} → ${fmt(dw.fair, 1)}`);
  // Urteil am Ziel: q = F / T
  const fast = drive(new Satisfaction(50), 1.3, 100);
  const dFast = fast.arrive();
  const slow = drive(new Satisfaction(50), 0.7, 100);
  const dSlow = slow.arrive();
  ok(Math.abs(dFast - (Math.min(Z.arrive.hi, Z.arrive.k * 0.3) + Z.arrive.bonus)) < 0.6 && Math.abs(dSlow - (Z.arrive.bonus - Z.arrive.k * 0.3)) < 0.6, `am Ziel: zügig ${fmt(dFast, 1)}, langsam ${fmt(dSlow, 1)}`);
  const at = (v) => Object.assign(new Satisfaction(), { value: v });
  ok(at(0).gain === 0.6 && at(50).gain === 1 && Math.abs(at(100).gain - 1.4) < 1e-12 && at(50).audience === 1, 'Faktoren falsch');
  console.log(`  Formel: Gleichgewicht bei p 1,25 / 1 / 0,85: ${fmt(e125, 1)} / ${fmt(e100, 1)} / ${fmt(e085, 1)} · eine Minute Stehen −${fmt(standDrop, 1)} · am Ziel zügig (q 1,3) ${fmt(dFast, 1)}, langsam (q 0,7) ${fmt(dSlow, 1)}`);
  // im Spiel: die Fahrer von oben, Mittel über ihre Streams
  const mean = (name) => runs.get(name).reduce((a, r) => a + r.zSum, 0) / runs.get(name).reduce((a, r) => a + r.zN, 0);
  const [mz, mm, mg] = DRIVERS.map((d) => mean(d.name));
  ok(mz > mm + 3 && mm > mg + 3, `im Spiel nicht geordnet: zügig ${fmt(mz, 1)}, mittel ${fmt(mm, 1)}, gemütlich ${fmt(mg, 1)}`);
  // Wirkung: derselbe Stream mit festgehaltener Zufriedenheit 90 und 10
  // (drei Streams je Wert: Eine einzelne große Spende soll den Vergleich nicht kippen)
  const held = (v) => [77, 78, 79].map((seed) => journey(DRIVERS[1], 30, seed, { frame: (game) => (game.zufrieden.value = v) }));
  const hi = held(90);
  const lo = held(10);
  const gifts = (rs) => rs.reduce((a, r) => a + ['Spenden', 'Abos', 'VIP-Abos'].reduce((b, k) => b + (r.game.breakdown[k] || 0), 0), 0);
  const plain = (pool) => pool.map((l) => l.replace(/^\[[a-z0-9 ]+\] /, ''));
  const tone = (rs, pool) => rs.reduce((a, r) => a + r.chat.filter((m) => plain(pool).includes(m.text)).length, 0);
  const views = (rs) => rs.reduce((a, r) => a + r.viewSum, 0) / rs.reduce((a, r) => a + r.zN, 0);
  const gr = gifts(hi) / gifts(lo);
  const vr = views(hi) / views(lo);
  ok(gr > 1.5 && vr > 1.15 && tone(hi, CHAT.flott) >= 3 && tone(lo, CHAT.schneller) >= 3 && !tone(hi, CHAT.schneller) && !tone(lo, CHAT.flott), `Wirkung: Spenden/Abos/VIP ×${fmt(gr, 2)}, Zuschauer ×${fmt(vr, 2)}, Ton ${tone(hi, CHAT.flott)}/${tone(lo, CHAT.schneller)}`);
  console.log(`  im Spiel (Mittel je Fahrer): zügig ${fmt(mz, 1)}, mittel ${fmt(mm, 1)}, gemütlich ${fmt(mg, 1)} · bei 90 statt 10: Spenden, Abos, VIP ×${fmt(gr, 2)} (${fmt(gifts(hi))} € statt ${fmt(gifts(lo))} €), Zuschauer ×${fmt(vr, 2)}, flotte Zeilen ${tone(hi, CHAT.flott)}, ungeduldige ${tone(lo, CHAT.schneller)}`);
}

// --- Die Leute des Streams und der Abspann --------------------------------------------------------------------------
console.log('Die Leute des Streams (Reise):');
{
  const all = [...runs.values()].flat();
  const min = (r) => r.game.t / 60;
  const by = (r, f) => r.chat.filter(f);
  const n = { raid: 0, knolli: 0, mod: 0, discord: 0, heart: 0, back: 0, funkloch: 0, minutes: 0 };
  for (const [i, r] of all.entries()) {
    const where = `Stream ${i}`;
    n.minutes += min(r);
    const raids = by(r, (m) => m.name === 'Nora' && m.text.startsWith('Raid! ' + CREW.knolli));
    n.raid += raids.length;
    ok(raids.length === 1 && raids[0].t >= CREW.raid.first[0] * 60 && raids[0].t <= CREW.raid.first[1] * 60 + 10, `${where}: ${raids.length} Raids, der erste nach ${raids.length ? fmt(raids[0].t / 60, 1) : '–'} min`);
    for (const x of raids) {
      const k = Math.round(x.t);
      const jump = r.viewers[k + 1] - r.viewers[k - 1];
      const people = Number(x.text.match(/mit ([\d.]+) Leuten/)[1].replace('.', ''));
      const hello = by(r, (m) => m.name === CREW.knolli && m.t > x.t && m.t < x.t + 3 && CREW_LINES.knolliHallo.includes(m.text)).length;
      const raiders = by(r, (m) => m.t > x.t && m.t < x.t + 8 && CREW_LINES.raider.includes(m.text)).length;
      ok(people >= CREW.raid.min && jump >= 0.9 * people && hello === 1 && raiders === 4, `${where}: Raid mit ${people} Leuten, Sprung ${fmt(jump)}, Gruß ${hello}, Raider-Zeilen ${raiders}`);
      const later = by(r, (m) => m.name === 'James' && m.text.startsWith(CREW.knolli) && m.t > x.t);
      n.knolli += later.length;
      if (min(r) - x.t / 60 > CREW.knolliEvery[1] + 0.5) ok(later.length >= 1, `${where}: König Knolli jubelt nach dem Raid nicht`);
      for (const m of later) ok(/(jubelt mit|hat) \d+,00\s€/.test(m.text), `${where}: Knolli-Spende „${m.text}“`);
    }
    const mods = by(r, (m) => CREW_LINES.mod.includes(m.text));
    n.mod += mods.length;
    ok(mods.every((m) => m.badge === 'MOD' && CREW.mods.includes(m.name)), `${where}: Mod-Zeile ohne Abzeichen oder von Unbekannt`);
    ok(mods.length >= Math.floor(min(r) / CREW.modEvery[1]) - 1 && mods.length <= Math.ceil(min(r) / CREW.modEvery[0]) + 1, `${where}: ${mods.length} Mod-Zeilen in ${fmt(min(r))} min`);
    const disc = by(r, (m) => CREW_LINES.discord.includes(m.text));
    n.discord += disc.length;
    ok(disc.every((m) => CREW.discord.includes(m.name) && (m.badge === 'MOD') === CREW.mods.includes(m.name)) && disc.length >= 1 && disc.length <= Math.ceil(min(r) / CREW.discordEvery[0]), `${where}: ${disc.length} Discord-Zeilen`);
    const hearts = by(r, (m) => m.name === CREW.heart);
    n.heart += hearts.length;
    ok(hearts.every((m) => m.text === '❤') && hearts.length >= 1 && hearts.length <= Math.ceil(min(r) / CREW.heartEvery[0]), `${where}: ${hearts.length} Herzen`);
    const backs = by(r, (m) => m.name === 'Nora' && m.text.startsWith('Verbindung zum Streaming-Server steht wieder'));
    n.funkloch += backs.length;
    for (const x of backs) {
      // (wer sich meldet, tut es CREW.backAfter s danach: Kam das Bild erst kurz vor dem Ende zurück, ist der Stream vorher aus)
      if (x.t + CREW.backAfter > r.game.t) continue;
      const who = by(r, (m) => CREW.back.includes(m.name) && CREW_LINES.back.includes(m.text) && Math.abs(m.t - x.t - CREW.backAfter) < 0.1);
      n.back += who.length;
      ok(who.length === 1 && (who[0].badge === 'MOD') === CREW.mods.includes(who[0].name), `${where}: nach dem Funkloch bei ${fmt(x.t)} s meldet sich ${who.length}× jemand`);
    }
  }
  const per = (k) => fmt((60 * n[k]) / n.minutes, 1);
  ok(n.funkloch >= 3, `nur ${n.funkloch} Funklöcher geprüft`);
  console.log(`  ${all.length} Streams, ${fmt(n.minutes / 60, 1)} h: je Stunde Raids ${per('raid')}, Knolli danach ${per('knolli')}, Mod-Zeilen ${per('mod')}, Discord ${per('discord')}, Herzen ${per('heart')} · nach ${n.funkloch} Funklöchern ${n.back}× „läuft wieder“`);
  // der Abspann der Reise: die Leute mit ihren Berufen, und am Ende die Zeile des Gedenkens im Wortlaut
  const names = ABSPANN_REISE.map(([, v]) => v).join(' | ');
  const want = ['Elti und IceBonbon', 'Arno Nühm', 'Wils, Walte, AchPünktchen, Delta34st, Eismann077, Cptbalu1991, Kieskauer und Muyinnchen', 'Wils und DomZe', 'BontanaBack', 'König Knolli'];
  ok(want.every((w) => ABSPANN_REISE.some(([, v]) => v === w)), `Abspann: ${names}`);
  // das Sprachstudio steht genau einmal im Abspann, mit seinen beiden Leuten (Wunsch des Eigentümers)
  const studio = [...ABSPANN_CREW, ...ABSPANN_REISE].filter(([k, v]) => /Sprachstudio/.test(k + v));
  ok(studio.length === 1 && studio[0][0] === 'Sprachstudio' && studio[0][1] === '?CF und IceBonbon', `Sprachstudio im Abspann: ${studio.map((r) => r.join(': ')).join(' | ')}`);
  ok(GEDENKEN === 'triazanonym (TriazNervensäge) und Pascal (pscldpr) – Behalten wir ewig in Gedanken wie seine historische Texte', `Gedenken nicht im Wortlaut: ${GEDENKEN}`);
  console.log(`  Abspann: ${[...ABSPANN_CREW, ...ABSPANN_REISE].map(([k, v]) => `${k}: ${v}`).join(' · ')} · am Ende: „${GEDENKEN}“`);
}

console.log(fails ? `geld-test: ${fails} von ${checks} Prüfungen FEHLGESCHLAGEN` : `geld-test: alles grün (${checks} Prüfungen)`);
process.exit(fails ? 1 : 0);
