// Prüft die Reise der XXL-Welt als Ganzes, ohne Grafik: das echte Spiel (Game: Bieterregeln, WorldNavi, BrunnenTV) mit
// der echten Stream-Kasse (economy.js), der echten Fahrt über die Karte (Trip), dem Halt am Brunnen (Arrival), dem Navi
// des Mittelbildschirms (NavModel) und der Fahrphysik (Player) – in simulierten Streams mit drei Fahrertypen:
// node tools/journey-test.mjs [Stunden je Stream, Standard 3] [log: jedes Gebot und jede Ankunft ausgeben]
// - Kein Hänger: Der Wagen kommt voran, nach jeder Ankunft beginnt eine neue Runde, jede BrunnenTV-Folge endet (von
//   selbst oder mit einer neuen Eingabe), und danach rollt der Wagen aus dem Ort.
// - Ziele: Jedes Gebot nennt einen echten Ort, den die Fahrt von hier über Straßen erreicht (keine Fähre, kein
//   Autozug, keine Luftfracht – ihre Terminals baut die Welt noch nicht), und nie das aktuelle Ziel; die Insider-Ziele
//   aus data.js gibt es in der Karte.
// - Kasse: Jedes Gebot ist genau einmal Einnahme (Summe aller Gebote = Posten „Navi-Gebote“ der Abrechnung).
// - Navi und Welt (COMMON.md §9, wie tools/map-test.mjs) über alle Zielwechsel hinweg, auch bei Geboten in den
//   Sperrzonen vor Gabelung (J.lock) und Knoten (J.lockNode): Jede Ansage meint eine Stelle, die die Fahrt wirklich
//   hat, und wer dem Navi folgt, wird an keiner Gabelung „falsch“ gefahren sein.
// - Ankunft: nur am Brunnenplatz des aktuellen Ziels, und jede ist eine BrunnenTV-Folge; ein Gebot, das vorher das
//   Ziel ändert (auch mitten im Zielort), nimmt sie weg – dann hält der Wagen nicht.
// Dazu misst es das Tempo der Reise (Fahrzeiten, Ankünfte je Stunde, Gebote und Einnahmen je Minute). Die Zahlen
// stehen am Ende der Ausgabe; wer an den Bieterregeln dreht, liest sie dort ab.
import { PerspectiveCamera } from 'three';
import { places, nodeTitle } from '../src/map/graph.js';
import { Trip, J } from '../src/game/trip.js';
import { Game } from '../src/game/game.js';
import { BID_PLACES } from '../src/game/navi.js';
import { INSIDER_ORTE } from '../src/data.js';
import { NavModel } from '../src/map/navroute.js';
import { limitsFor, Arrival, AUTO } from '../src/world/xxl/plan.js';

const HOURS = Number(process.argv[2]) || 3;
const LOG = process.argv[3] === 'log';
const DT = 1 / 30;
let fails = 0;
const seen = new Map();
function ok(cond, msg) {
  if (cond) return;
  fails++;
  const n = (seen.get(msg.slice(0, 40)) || 0) + 1;
  seen.set(msg.slice(0, 40), n);
  if (n <= 3) console.error('FEHLER: ' + msg);
}

// Zufall mit festem Startwert, damit jeder Lauf dieselben Streams fährt
function mulberry32(a) {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- Insider-Ziele: jeder Schlüssel ist ein Ort der Karte ---------------------------------------------------------
for (const key of Object.keys(INSIDER_ORTE)) ok(places.some((p) => p.key === key), `Insider-Ziel „${key}“ gibt es in der Karte nicht`);

// --- Die Mitspieler des Spiels, die es ohne Grafik nicht gibt: nehmen alles an, liefern nichts -----------------------
const NONE = [];
const noop = () => {};
const loose = (base = {}) => new Proxy(base, { get: (t, k) => (k in t ? t[k] : noop) });

/**
 * Drei Fahrer. cruise: Wunschtempo auf freier Strecke (km/h; Limits und Kurven der Strecke hält der Begrenzer ein),
 * miss: Anteil der angesagten Ausfahrten, an denen er vorbeifährt, skip: fährt nach dem Halt am Brunnen sofort weiter
 * (gibt neu Gas) statt die Folge abzuwarten.
 */
const DRIVERS = [
  { name: 'zügig', cruise: 185, miss: 0, skip: true },
  { name: 'mittel', cruise: 145, miss: 0.06, skip: false },
  { name: 'gemütlich', cruise: 110, miss: 0.15, skip: false },
];
/**
 * Härtetest für den Halt am Brunnen: Auf den letzten 150 m im Zielort bricht jedes Mal ein hastiges Bieterduell aus,
 * das Ziel springt bis zum Brunnen hin und her. Der Wagen steht danach am Brunnen (BrunnenTV), ist vorbeigerollt
 * (keine Ankunft) oder das Ziel ist weg – aber nie bleibt er hängen.
 */
const DUELLIST = { name: 'zügig, Duell im Zielort', cruise: 185, miss: 0, skip: true, duel: true };

/** Liegt die Fahrt in einer Sperrzone, in der ein neues Ziel schon Geplantes nicht mehr ändert? */
function lockZone(trip) {
  for (const c of trip.cur.sections) {
    const f = c.fork;
    if (f && !f.taken && f.branch && f.s > trip.s && f.s - trip.s < J.lock) return 'fork';
  }
  for (const c of trip.cur.sections) if (c.leave && c.s1 > trip.s && c.s0 - trip.s < J.lockNode) return 'node';
  return '';
}

/**
 * Navi und Welt: Die Ansage des Mittelbildschirms meint eine Stelle, die die Fahrt wirklich hat (wie map-test).
 * promised: Ausfahrten hinter dem Horizont, die später genau dort liegen müssen (nur solange das Ziel bleibt).
 */
function checkNavi(trip, nav, promised, n, where) {
  for (const sec of trip.cur.sections) {
    const f = sec.fork;
    const pr = f && promised.get(f.node);
    if (!pr) continue;
    promised.delete(f.node);
    ok(Math.abs(f.s - pr.s) <= 1, `${where}: Ausfahrt ${pr.head} versprochen bei ${pr.s.toFixed(0)}, gebaut bei ${f.s.toFixed(0)}`);
    n.farKept++;
  }
  const ins = nav.instruction();
  const g = trip.guidance();
  const near = (a, b) => Math.abs(a - b) <= 0.01;
  if (ins.turn === 'exit') {
    if (ins.fork) {
      n.exit++;
      const f = ins.fork;
      ok(near(ins.dist, f.s - trip.s), `${where}: Entfernung ${ins.dist} statt ${f.s - trip.s} zu ${ins.head}`);
      ok(trip.cur.sections.some((c) => c.fork === f) && !f.taken, `${where}: Ansage meint eine Gabelung, die nicht vor uns liegt: ${ins.head}`);
      ok(f.forced || trip.planFor(f) === 'exit', `${where}: Ansage zu einer Gabelung, an der die Route bleibt: ${ins.head}`);
      ok(ins.head === trip.signs(f).title, `${where}: Name „${ins.head}“ ≠ Schild „${trip.signs(f).title}“`);
      if (g.then && g.then.wende) n.wende++;
    } else {
      n.far++;
      ok(g.far && near(ins.dist, g.dist), `${where}: Ausfahrt hinter dem Horizont ohne Entfernung der Fahrt: ${ins.head}`);
      ok(ins.head === nodeTitle(g.node) || ins.head === 'Autobahnende', `${where}: Name hinter dem Horizont: ${ins.head}`);
      promised.set(g.node, { s: trip.s + g.dist, head: ins.head });
    }
  } else if (ins.turn === 'arrive') {
    n.arrive++;
    const c = trip.cur.sections.find((q) => q.kind === 'stadt' && q.place === trip.target && !q.spotDone && q.s1 > trip.s);
    ok(c && near(ins.dist, c.spotS - trip.s), `${where}: Ziel-Entfernung ohne Zielpunkt: ${ins.head}`);
    ok(!c || ins.head === places[c.place].name, `${where}: Zielname ≠ Ortsschild: ${ins.head}`);
  } else {
    ok(ins.turn !== 'faehre' && ins.turn !== 'zug' && ins.turn !== 'flug', `${where}: Das Navi sagt eine Überfahrt an (${ins.turn}: ${ins.head})`);
    ok(ins.dist === 0 || ins.turn === 'faehre' || ins.turn === 'zug' || ins.turn === 'flug', `${where}: Ansage ${ins.turn} „${ins.head}“ mit Entfernung ${ins.dist}, aber ohne Stelle`);
  }
  n.checks++;
}

/** Ein Stream: hours Stunden Spielzeit mit einem Fahrer. Liefert die Messwerte. */
function stream(driver, hours, seed) {
  Math.random = mulberry32(seed);
  const trip = new Trip({ rng: Math.random });
  const arrival = new Arrival();
  arrival.hold = true;
  const nav = new NavModel(trip);
  const camera = new PerspectiveCamera(60, 16 / 9, 0.1, 3000);
  let ids = 0;
  const tvCards = [];
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
    ui: loose({ brunnenTV: (n, name) => tvCards.push({ n, name }) }),
    fx: loose(),
    pickups: loose({ update: () => NONE }),
    world: { trip: () => trip, stopping: () => !!arrival.pending, release: () => arrival.reset(), square: () => null, town: () => null },
  });
  game.start({ upgrades: {}, best: {} });
  const p = game.player;
  p.s = trip.s;
  p.x = trip.x;
  p.speed = 40 / 3.6;
  const nv = game.navi;
  const lim = { left: 0, right: 0, shoulder: 0, lanes: null, extraLane: null, vmax: Infinity, decel: 0, slack: 0, closing: 0 };
  const m = {
    bids: 0, bidSum: 0, earnN: 0, earnSum: 0, chaos: 0, calm: 0, late: 0, snatched: 0, spots: 0, rolled: 0, arrivals: 0, rests: 0, late2: 0, tvEnds: 0, duels: 0,
    lockFork: 0, lockNode: 0, wrong: 0, wende: 0, first1: 0, firstN: 0, maxGap: 0, maxTv: 0, minTv: Infinity, passed: 0,
    bands: [0, 0, 0, 0], legs: [], navi: { checks: 0, exit: 0, far: 0, farKept: 0, arrive: 0, wende: 0 }, reroutes: 0, standing: 0, ratio: 0, stand: [], flipped: 0, minChoice: Infinity,
  };
  const promised = new Map();
  const sloppy = new WeakMap(); // Gabelung → fährt dieser Fahrer hier am Navi vorbei?
  const planSince = new WeakMap(); // Gabelung → {plan, s}: was das Navi dort will und seit welchem Meter
  let lastBidT = 0;
  let lastPlan = null; // das jüngste Gebot: {t, km, secs} – Zeit, Kartenkilometer und Fahrzeit laut Navi
  let roundOpen = false; // seit der letzten Ankunft kam schon ein Gebot
  let arrivedT = -1;
  let spotT = -1;
  let halting = false; // zwischen Zielpunkt und Halt am Brunnen
  let duelSec = null; // Härtetest: die Ortsdurchfahrt, in der gerade das Duell tobt
  let duelPace = 0; // … und wie viele Sekunden dort höchstens zwischen zwei Geboten liegen
  let tvT0 = -1;
  let tvEndT = -1;
  let progressS = p.s;
  let progressT = 0;
  let pendingCheck = false;

  // jedes Gebot läuft über WorldNavi.overbid, jede Einnahme über Game.earn
  const overbid = nv.overbid.bind(nv);
  nv.overbid = (s, bidder, inc, target) => {
    const before = nv.target;
    const inTown = nv.inTown;
    const plan = game.bidPlan;
    const zone = lockZone(trip);
    const t = overbid(s, bidder, inc, target);
    m.bids++;
    m.bidSum += nv.bid;
    ok(t && places[t.place] && places[t.place].name === t.name, `Gebot auf etwas, das kein Ort der Karte ist: ${t && t.name}`);
    ok(t !== before, `Gebot auf das aktuelle Ziel ${t.name}`);
    ok(trip.target === t.place && trip.policy && trip.policy.road, `Die Fahrt führt nach dem Gebot nicht über Straßen nach ${t.name}`);
    const km = nv.km;
    const secs = nv.driveSecs();
    ok(km > 0 && isFinite(km) && secs > 0 && isFinite(secs), `Ziel ${t.name} ist von hier nicht erreichbar (${km} km, ${secs} s)`);
    // HUD-Zeile, Pause-Karte und roter Balken nennen sofort das neue Ziel, seine Entfernung und den Bieter
    ok(nv.shown === t && nv.label === t.name && /^[\d.,]+ (km|m)$/.test(nv.distance) && nv.screen().bidder === nv.bidder && nv.bidder, `Nach dem Gebot auf ${t.name} zeigt das Navi „${nv.label} · ${nv.distance}“ von „${nv.screen().bidder}“`);
    // die nächste Runde findet immer ein Ziel: Von überall stehen genug Orte zur Wahl
    m.minChoice = Math.min(m.minChoice, game.bidTargets().length);
    m.bands[km < BID_PLACES.nearKm ? 0 : km <= BID_PLACES.farKm ? 1 : km <= 500 ? 2 : 3]++;
    if (zone === 'fork') m.lockFork++;
    else if (zone === 'node') m.lockNode++;
    if (inTown) m.snatched++;
    if (plan.late) m.late++;
    if (!roundOpen) {
      roundOpen = true;
      m.firstN++;
      if (Math.abs(nv.bid - 0.01) < 1e-9) m.first1++;
      ok(nv.bid <= 0.05 + 1e-9, `Die Runde beginnt bei ${nv.bid} € statt bei Cent-Geboten`);
      if (arrivedT >= 0) ok(game.t - Math.max(arrivedT, tvEndT) < 12, `Erstes Gebot der Runde erst ${(game.t - Math.max(arrivedT, tvEndT)).toFixed(1)} s nach der Ankunft`);
    }
    m.maxGap = Math.max(m.maxGap, game.t - lastBidT);
    lastBidT = game.t;
    if (plan.kind === 'chaos') m.chaos++;
    else m.calm++;
    if (LOG) console.log(`  ${game.t.toFixed(0)} s: ${plan.kind}${plan.late ? ' (spät)' : ''} ${nv.bid.toFixed(2)} € → ${t.name}, ${km.toFixed(0)} km, Navi ${secs.toFixed(0)} s${zone ? ', Sperrzone ' + zone : ''}${inTown ? ', im Zielort weggeboten' : ''}`);
    promised.clear();
    pendingCheck = true;
    lastPlan = { t: game.t, km, secs };
    return t;
  };
  // nach changeNavi steht fest, wann das nächste Gebot kommt: Bleibt das Ziel eine Weile stehen (wie im Spiel: > 6 s)?
  const changeNavi = game.changeNavi.bind(game);
  game.changeNavi = (siegenOverbid) => {
    changeNavi(siegenOverbid);
    const next = game.bidPlan;
    if (next.delay > 6) {
      m.standing++;
      m.ratio += next.delay / lastPlan.secs;
      lastPlan.stand = { ratio: next.delay / lastPlan.secs, reached: false };
      m.stand.push(lastPlan.stand);
      if (LOG) console.log(`      … bleibt stehen: nächstes Gebot in ${next.delay.toFixed(0)} s (${(next.delay / lastPlan.secs).toFixed(2)} × Fahrzeit)`);
    }
  };
  const earn = game.earn.bind(game);
  game.earn = (amount, label, opts) => {
    if (label === 'Navi-Gebote') {
      m.earnN++;
      m.earnSum += amount;
    }
    return earn(amount, label, opts);
  };

  const onEvent = (e) => {
    if (e.type === 'arrive') {
      ok(nv.target && nv.target.place === e.place, `Zielpunkt in ${places[e.place].name}, aber das Navi-Ziel ist ${nv.target ? nv.target.name : 'offen'}`);
      m.spots++;
      spotT = game.t;
      promised.clear();
    } else if (e.type === 'pass') m.passed++;
    else if (e.type === 'transit') ok(false, 'Die Fahrt nimmt eine Überfahrt: ' + e.kind);
    else if (e.type === 'fork' && e.wrong) {
      m.wrong++;
      promised.clear();
      // Wer dem Navi folgt, fährt nur dann „falsch“, wenn ein Gebot den Plan erst kurz vor der Gabelung gekippt hat
      const since = planSince.get(e.fork);
      const flipped = !!since && e.fork.s - since.s < J.lock;
      if (flipped) m.flipped++;
      ok(driver.miss > 0 || flipped, `Wer dem Navi folgt, fährt falsch: Gabelung bei s=${e.fork.s.toFixed(0)}, geplant ${e.planned}, gefahren ${e.taken}`);
    }
    if (LOG && (e.type === 'arrive' || e.type === 'pass' || (e.type === 'fork' && e.wrong))) console.log(`  ${game.t.toFixed(0)} s: ${e.type === 'arrive' ? 'Zielpunkt' : e.type}${e.place >= 0 ? ' ' + places[e.place].name : ''}${e.wrong ? ' (anders als angesagt)' : ''}${e.type === 'arrive' ? ' mit ' + p.kmh.toFixed(0) + ' km/h' : ''}`);
    game.onTrip(e);
  };

  const steps = Math.round((hours * 3600) / DT);
  const ctl = { steer: 0, throttle: 0, brake: 0, kappa: 0, grade: 0, horn: false, wiper: false, megafon: false };
  for (let i = 0; i < steps; i++) {
    limitsFor(trip, lim, arrival.stop(trip));
    p.setLimits(lim);
    // der Fahrer: folgt dem Navi (Ausfahrt nehmen, sonst mittlere Spur) – oder fährt an einer Ausfahrt vorbei
    let want = J.L0;
    const sec = trip.section;
    if (sec.kind === 'ab') {
      const f = sec.fork;
      want = 5.625;
      if (f && !f.taken) {
        // seit wann gilt der Plan für diese Gabelung? (Ein Gebot kann ihn noch auf dem Verzögerungsstreifen kippen.)
        const plan = f.forced ? 'exit' : trip.planFor(f);
        const known = planSince.get(f);
        if (!known || known.plan !== plan) planSince.set(f, { plan, s: trip.s });
        if (f.s - trip.s < J.decel - 10) {
          if (!sloppy.has(f)) sloppy.set(f, Math.random() < driver.miss);
          if (plan === 'exit' && !(sloppy.get(f) && !f.forced)) want = J.L0;
        }
      }
    }
    const dx = want - (p.x + p.vx * AUTO.look);
    ctl.steer = Math.abs(dx) > AUTO.tol ? Math.max(-1, Math.min(1, dx * AUTO.gain)) : 0;
    const v = Math.min(lim.vmax, driver.cruise / 3.6);
    ctl.throttle = p.speed < v - 0.5 ? 1 : 0;
    ctl.brake = p.speed > v + 3 ? 0.4 : 0;
    // am Brunnen: Der Ungeduldige lässt das Gas kurz los und gibt neu Gas – das beendet die Folge sofort
    if (game.tv && driver.skip) ctl.throttle = game.t - tvT0 < 0.9 ? 0 : 1;
    if (driver.duel) {
      if (nv.inTown && sec !== duelSec && trip.guidance().dist < 150) {
        // mal ein kurzer Schlagabtausch, mal ein langer; mal hastig, mal mit Sekunden zwischen den Geboten
        duelSec = sec;
        const hasty = Math.random() < 0.5;
        duelPace = hasty ? 0.25 + 0.25 * Math.random() : 0.6 + 2 * Math.random();
        m.duels++;
        game.eco.bids.chaos = 0;
        game.eco.bids.duel = hasty ? 10 + Math.floor(30 * Math.random()) : 1 + Math.floor(8 * Math.random());
        game.bidPlan = { increment: 0.1, delay: 0, kind: 'duel', first: true };
        game.T.bid = 0;
      } else if (sec === duelSec && !sec.spotDone && game.bidPlan.kind === 'duel' && game.T.bid > duelPace) game.T.bid = duelPace * (0.5 + 0.5 * Math.random());
    }
    game.offAutobahn = sec.kind !== 'ab';
    const tvBefore = game.tv;
    game.update(DT, ctl, camera);
    p.battery = 100;
    if (game.over) {
      ok(false, `Der Stream endet von selbst (${game.over.reason || 'ohne Grund'}) bei t=${game.t.toFixed(0)}`);
      break;
    }
    if (tvBefore && !game.tv) {
      const dur = game.t - tvT0;
      m.tvEnds++;
      m.maxTv = Math.max(m.maxTv, dur);
      m.minTv = Math.min(m.minTv, dur);
      tvEndT = game.t;
      ok(!arrival.held, 'Die Folge ist vorbei, aber der Wagen wird noch gehalten');
    }
    const evs = trip.update(p.s, p.x);
    for (let k = 0; k < evs.length; k++) onEvent(evs[k]);
    const rest = arrival.update(trip, evs, p.speed);
    if (rest) {
      m.rests++;
      game.onTrip(rest);
      ok(game.tv && game.tv.place === rest.place && arrival.held, 'Halt am Brunnen ohne BrunnenTV-Folge');
    }
    if (!tvBefore && game.tv) {
      // Ankunft: Der Wagen steht am Brunnen des Ziels (die Welt meldet den Halt, oder das Spiel stellt ihn selbst fest)
      halting = false;
      m.arrivals++;
      if (!rest) m.late2++;
      ok(p.speed < 0.2 && game.t - spotT < 15, `BrunnenTV bei ${p.kmh.toFixed(0)} km/h, ${(game.t - spotT).toFixed(1)} s nach dem Zielpunkt`);
      arrivedT = game.t;
      tvEndT = -1;
      roundOpen = false;
      if (lastPlan) m.legs.push({ km: lastPlan.km, navi: lastPlan.secs, secs: game.t - lastPlan.t });
      if (lastPlan && lastPlan.stand) lastPlan.stand.reached = true;
      tvT0 = game.t;
      // ab jetzt gilt „Ziel erreicht“, und der rote Balken nennt keinen Bieter mehr: Die neue Runde ist offen
      ok(!nv.shown && nv.waitLine.includes('Ziel erreicht: ' + places[game.tv.place].name) && nv.screen().bidder === '', 'Am Brunnen angekommen, aber die Anzeigen nennen noch ein Ziel oder einen Bieter');
      if (LOG) console.log(`  ${game.t.toFixed(0)} s: steht am Brunnen von ${places[game.tv.place].name}${rest ? '' : ' (knapp hinter dem Haltepunkt)'}`);
    } else if (nv.stopping) {
      halting = true;
      // bis der Wagen steht, nennen HUD-Zeile und roter Balken noch Ziel, Gebot und Bieter der Runde
      ok(nv.shown === nv.stopping && nv.label === nv.stopping.name && nv.distance === '0 m' && nv.screen().bidder === nv.bidder, 'Zwischen Zielpunkt und Halt zeigen die Anzeigen nicht mehr das Ziel der Runde');
    } else if (halting) {
      // am Brunnen vorbeigerollt: keine Ankunft, die Runde läuft weiter
      halting = false;
      m.rolled++;
      ok(nv.missed && !game.roundNew && game.T.bid <= 3.1, 'Vorbeigerollt, aber das Spiel wartet nicht auf das nächste Gebot der Runde');
      ok(!nv.shown && nv.waitLine.includes('vorbeigerollt') && nv.screen().bidder === '', 'Vorbeigerollt, aber die Anzeigen sagen es nicht');
    }
    // kein Hänger: außerhalb der Folge kommt der Wagen voran
    if (game.tv) {
      progressS = p.s;
      progressT = game.t;
    } else if (game.t - progressT > 60) {
      ok(p.s - progressS > 300, `Der Wagen steht: ${(p.s - progressS).toFixed(0)} m in 60 s bei s=${p.s.toFixed(0)} (${trip.section.kind}, Limit ${(lim.vmax * 3.6).toFixed(0)} km/h, Halt ${arrival.pending ? 'geplant' : arrival.held ? 'gehalten' : 'frei'}, Ziel ${nv.target ? nv.target.name : nv.stopping ? 'bremst für ' + nv.stopping.name : 'offen'})`);
      progressS = p.s;
      progressT = game.t;
    }
    // Navi und Welt: gleich nach jedem Gebot und sonst dreimal je Sekunde
    if (pendingCheck || i % 10 === 0) {
      nav.update(pendingCheck ? DT : 10 * DT);
      for (const e of nav.events) if (e.type === 'reroute') m.reroutes++;
      checkNavi(trip, nav, promised, m.navi, pendingCheck ? 'nach einem Gebot' : 'unterwegs');
      pendingCheck = false;
    }
  }
  // Kasse: jedes Gebot genau einmal
  ok(m.earnN === m.bids && m.bids === game.stats.naviChanges && m.bids === nv.changes, `Gebote ${m.bids}, davon verbucht ${m.earnN} (Statistik ${game.stats.naviChanges})`);
  ok(Math.abs(m.earnSum - m.bidSum) < 0.005 && Math.abs((game.breakdown['Navi-Gebote'] || 0) - m.bidSum) < 0.005, `Summe der Gebote ${m.bidSum.toFixed(2)} €, verbucht ${m.earnSum.toFixed(2)} €`);
  ok(game.stats.naviReached === m.arrivals && game.stats.brunnenTV === m.arrivals && tvCards.filter((c) => c.n > 0).length === m.arrivals, `Ankünfte ${m.arrivals}, gezählt ${game.stats.naviReached}; Folgen gezählt ${game.stats.brunnenTV}`);
  ok(m.arrivals === m.rests + m.late2, `${m.arrivals} Ankünfte, aber ${m.rests} Halte der Welt und ${m.late2} knapp dahinter`);
  ok(m.spots - m.arrivals - m.rolled >= 0 && m.spots - m.arrivals - m.rolled <= 1, `${m.spots} Zielpunkte, aber ${m.arrivals} Ankünfte und ${m.rolled}× vorbeigerollt`);
  ok(m.tvEnds >= m.arrivals - 1, `${m.arrivals} Folgen begonnen, ${m.tvEnds} beendet`);
  ok(m.minChoice >= 100, `Nur ${m.minChoice} Orte standen bei einem Gebot zur Wahl`);
  m.hours = game.t / 3600;
  m.km = (p.s - trip.cur.s0) / 1000;
  m.roadKm = game.stats.distance / 1000;
  m.money = game.money;
  return m;
}

// --- Die Streams ---------------------------------------------------------------------------------------------------
const fmt = (x, d = 1) => x.toFixed(d).replace('.', ',');
const rows = [];
const t0 = Date.now();
DRIVERS.forEach((driver, k) => {
  if (LOG) console.log(driver.name + ':');
  const m = stream(driver, HOURS, 4711 + k);
  rows.push({ driver, m });
});
for (const { driver, m } of rows) {
  const h = m.hours;
  const legs = (a, b) => {
    const L = m.legs.filter((l) => l.km >= a && l.km < b);
    if (!L.length) return '–';
    const avg = (f) => L.reduce((s, l) => s + f(l), 0) / L.length;
    return `${fmt(avg((l) => l.secs), 0)} s (Navi ${fmt(avg((l) => l.navi), 0)} s, ${L.length}×)`;
  };
  // stehende Ziele nach Ruhe/Fahrzeit: wie viele davon erreicht wurden
  const band = (a, b) => {
    const L = m.stand.filter((x) => x.ratio >= a && x.ratio < b);
    return `Ruhe ${a ? '≥ ' + fmt(a, 2) : '< ' + fmt(b, 2)}${a && b < 9 ? ' bis ' + fmt(b, 2) : ''} × Fahrzeit: ${L.filter((x) => x.reached).length} von ${L.length}`;
  };
  const tot = m.bands.reduce((a, b) => a + b, 0) || 1;
  console.log(
    `${driver.name} (${driver.cruise} km/h): ${fmt(h)} h, ${fmt(m.roadKm, 0)} km Straße · Ankünfte ${m.arrivals} (${fmt(m.arrivals / h)}/h), alle mit BrunnenTV` +
      ` · Gebote ${m.bids} (${fmt(m.bids / h / 60, 2)}/min, ${fmt(m.bidSum / h / 60, 2)} €/min), je Ankunft ${fmt(m.bids / Math.max(1, m.arrivals))}` +
      ` · ${m.standing} Ziele blieben stehen (Ruhe im Mittel ${fmt(m.ratio / Math.max(1, m.standing), 2)} × Fahrzeit), erreicht ${fmt((100 * m.arrivals) / Math.max(1, m.standing), 0)} %` +
      ` (${band(0, 0.9)} · ${band(0.9, 1.15)} · ${band(1.15, 9)})` +
      ` · ruhige Gebote ${m.calm}, im Chaos ${m.chaos}, spät ${m.late}, im Zielort weggeboten ${m.snatched}, am Brunnen vorbeigerollt ${m.rolled}, knapp hinter dem Haltepunkt gestanden ${m.late2}` +
      ` · längste Pause ${fmt(m.maxGap, 0)} s · Folge ${fmt(m.minTv)}–${fmt(m.maxTv)} s` +
      `\n    Fahrzeit zum Ziel: ~30 km ${legs(18, 45)} · ~100 km ${legs(75, 130)} · ~250 km ${legs(190, 320)}` +
      `\n    Ziele nach Entfernung: <${BID_PLACES.nearKm} km ${fmt((100 * m.bands[0]) / tot, 0)} % · bis ${BID_PLACES.farKm} km ${fmt((100 * m.bands[1]) / tot, 0)} % · bis 500 km ${fmt((100 * m.bands[2]) / tot, 0)} % · weiter ${fmt((100 * m.bands[3]) / tot, 0)} %` +
      ` · zur Wahl standen stets ≥ ${m.minChoice} Orte · in Sperrzonen geboten: ${m.lockFork} vor Gabelungen, ${m.lockNode} vor Knoten · an der Gabelung anders als angesagt ${m.wrong}× (${m.flipped}× kippte ein Gebot den Plan kurz davor) · Einnahmen ${fmt(m.money / h / 60, 2)} €/min` +
      `\n    Navi und Welt: ${m.navi.checks} Ansagen geprüft (${m.navi.exit} Ausfahrten, ${m.navi.far} hinter dem Horizont, ${m.navi.farKept} davon eingelöst, ${m.navi.arrive} Ziel voraus, ${m.navi.wende}× „dann wenden“), ${m.reroutes} Neuberechnungen`,
  );
}
// Härtetest: Bieterduell auf den letzten Metern
{
  if (LOG) console.log(DUELLIST.name + ':');
  const m = stream(DUELLIST, HOURS, 815);
  console.log(
    `${DUELLIST.name}: ${fmt(m.hours)} h, ${m.duels} Duelle auf den letzten 150 m, ${m.bids} Gebote · danach ${m.arrivals}× am Brunnen gestanden (BrunnenTV;` +
      ` ${m.late2}× knapp hinter dem Haltepunkt), ${m.rolled}× vorbeigerollt, ${m.duels - m.spots}× war das Ziel am Brunnen gerade ein anderes`,
  );
  if (HOURS >= 3) ok(m.duels >= 10 && m.arrivals >= 3 && m.rolled >= 1, `Duell im Zielort: zu wenig geprüft (${m.duels} Duelle, ${m.arrivals} Ankünfte, ${m.rolled} vorbeigerollt, ${m.late2} knapp dahinter)`);
  rows.push({ driver: DUELLIST, m });
}
// genug geprüft?
const sum = (f) => rows.reduce((s, r) => s + f(r.m), 0);
if (HOURS >= 3) {
  ok(sum((m) => m.arrivals) >= 30, `zu wenige Ankünfte: ${sum((m) => m.arrivals)}`);
  ok(sum((m) => m.lockFork) >= 10 && sum((m) => m.lockNode) >= 20, `zu wenige Gebote in Sperrzonen: ${sum((m) => m.lockFork)} / ${sum((m) => m.lockNode)}`);
  ok(sum((m) => m.navi.exit) > 2000 && sum((m) => m.navi.arrive) > 300, 'Navi und Welt: zu wenig geprüft');
}
console.log(`Reise: ${rows.length} Streams zu je ${HOURS} h in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
if (fails) {
  console.error(`${fails} Fehler`);
  process.exit(1);
}
console.log('alles in Ordnung');
