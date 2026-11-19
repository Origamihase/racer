// Prüft die Planung der XXL-Welt ohne Grafik (src/world/xxl/plan.js) zusammen mit der echten Fahrphysik (Player) und
// dem Kurs der Karte (Course mit MapPlanner, gefüllt aus der Fahrt wie in main.js):
// node tools/xxl-test.mjs [Anzahl Zufallsfahrten]
// - Wald: jeder Vorhang des eigenen Wegs (trip.curtains) liegt in einem Waldstück (forestRanges), Waldstücke im
//   Sichtbereich ändern sich nie, neue entstehen nur jenseits des Dunsts.
// - Spieler: Grenzen und Spurhalteassistent lassen den Wagen nie an eine Planke stoßen, auch ohne Lenken (auf gerader
//   Strecke); in den Kurven der Karte hält ihn ein Fahrer, der lenkt wie ein Mensch (plan.js autoDrive), ohne
//   Plankenstoß in der Spur; das Tempo liegt beim Einfahren in einen Abschnitt mit Limit höchstens knapp darüber, auch
//   mit Tempomat; der Autopilot nimmt jede geplante Ausfahrt; am Navi-Ziel kommt der Wagen vor dem Brunnen zum Stehen.
// - Kurs: rund um jede Gabelung und jeden Einfädelpunkt des eigenen Wegs ist die Straße auf ±400 m gerade (darauf
//   bauen Rahmen, Scherungen und Knotenpunkte der Engine).
// - Welt: trip.shearsInto (ohne neue Objekte je Bild) liefert dieselben Scherungen wie trip.shears(). Kein Straßenstück
//   im Blickfeld wird neu gebaut (plan.js eachPiece wie XxlWorld.sync): ein Stück bekommt einen neuen Schlüssel nur,
//   wenn sich ein Nachbar am Ende jenseits des Dunsts ändert (der Folgeabschnitt wird geplant), nie durch das
//   Abräumen des Vorgängers hinter dem Wagen und nie durch einen Wechsel der Autobahn.
// - Nähte: Asphaltränder und Randlinien zweier aufeinanderfolgender Abschnitte stoßen ohne Sprung aneinander.
// - Schilder gegen Navi (COMMON.md 9) über mindestens 50 Fahrten: zu jeder Ansage von guidance() stehen die
//   Vorwegweiser mit demselben Titel 1000 und 500 m und die Baken 300/200/100 m vor der genannten Gabelung, am Ziel
//   der Platz bei spotS; jede Zahl einer Entfernungstafel ist (±1 km) die, die das Navi an der Tafel für diesen Ort
//   zeigt, wäre er das Ziel, und das Navi führte über genau diese Ausfahrt hin; kein Schild nennt einen Ort oder eine
//   Straße, die es in der Karte nicht gibt.
import * as G from '../src/map/graph.js';
import * as shapes from '../src/map/shapes.js';
import { Trip, J, PROFILES } from '../src/game/trip.js';
import { Player } from '../src/game/player.js';
import { Course, MapPlanner, CALM } from '../src/game/course.js';
import { curveTable, curveAt } from '../src/curve.js';
import { forestRanges, limitsFor, autoTarget, autoDrive, AUTO, Arrival, squareOf, eachPiece, FOREST_IN, FOREST_OUT, AHEAD, XXL_BEHIND } from '../src/world/xxl/plan.js';
import { sectionSigns, tableAt, BOARD_D, BEACON_D, NEAR_ROAD } from '../src/world/xxl/signplan.js';
import { crossSection } from '../src/world/xxl/roadkit.js';

let fails = 0;
const kinds = new Map(); // Art des Fehlers (Meldung ohne Zahlen) → Anzahl; jede Art wird höchstens dreimal gezeigt
const ok = (cond, msg) => {
  if (cond) return;
  fails++;
  const k = msg.replace(/-?[\d.]+/g, '#');
  kinds.set(k, (kinds.get(k) || 0) + 1);
  if (kinds.get(k) <= 3) console.log('FEHLER:', msg);
};
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
const FOG_END = 1550;
const shearMap = new Map();
const stats = { shears: 0, metres: 0, forks: 0, wrong: 0, rails: 0, entries: 0, over: 0, maxOver: 0, curtains: 0, forests: 0, stops: 0, rests: 0, island: 0, pieces: 0, rebuilt: 0, seams: 0, bendM: 0, tightM: 0, maxOff: 0, maxLat: 0, links: 0 };

/**
 * Neubauten von Straßenstücken (wie XxlWorld.sync): built = Stück-Id (Abschnitt, Lage, Nummer) → Schlüssel. Ein
 * Stück mit neuem Schlüssel ist nur erlaubt, wenn sich allein der Nachfolger geändert hat und das Abschnittsende
 * jenseits des Dunsts liegt (sonst sähe man es umspringen oder es ruckelt beim Bauen).
 */
/**
 * Nähte zwischen zwei Abschnitten eines Wegs (roadkit crossSection): Asphaltränder, Randlinien und ihre Breiten am
 * Ende des einen und am Anfang des nächsten stimmen überein (kein Sprung, keine Lücke zwischen den Bändern).
 */
const seamsDone = new WeakSet();
function checkSeams(trip) {
  for (const { path } of trip.paths()) {
    const L = path.sections;
    for (let i = 0; i + 1 < L.length; i++) {
      const A = L[i];
      const B = L[i + 1];
      if (A.kind === 'ab' || B.kind === 'ab' || seamsDone.has(A) || i + 2 >= L.length) continue;
      seamsDone.add(A);
      stats.seams++;
      const a = crossSection(A, i > 0 ? L[i - 1] : null, B, A.s1, {});
      const b = crossSection(B, A, L[i + 2], B.s0, {});
      for (const k of ['aL', 'aR', 'eL', 'eR', 'ewL', 'ewR']) {
        ok(Math.abs(a[k] - b[k]) < 1e-6, `Naht ${A.kind}→${B.kind} bei s=${A.s1.toFixed(0)}: ${k} ${a[k].toFixed(3)} → ${b[k].toFixed(3)}`);
      }
    }
  }
}

function checkPieces(trip, built) {
  const s = trip.s;
  eachPiece(trip, trip.autobahnView(), (key, path, sec, prev, next, ch) => {
    stats.pieces++;
    const cut = key.indexOf('<');
    const id = key.slice(0, cut);
    const old = built.get(id);
    built.set(id, key);
    if (old === undefined || old === key) return;
    stats.rebuilt++;
    const part = (k) => {
      const m = /<(.*)>(.*)~(.*)$/.exec(k);
      return { p: m[1], n: m[2], f: m[3] };
    };
    const a = part(old);
    const b = part(key);
    const what = `${sec.kind} ${Math.round(ch.a)}…${Math.round(ch.b)} bei s=${s.toFixed(0)}: ${old.slice(cut)} → ${key.slice(cut)}`;
    ok(a.p === b.p, `Stück neu gebaut, weil sich der Vorgänger änderte: ${what}`);
    ok(a.f === b.f || ch.a - s > FOG_END - 5, `Stück im Blickfeld neu gebaut (Wald): ${what}`);
    ok(a.n === b.n || sec.s1 - s > FOG_END - 5, `Stück im Blickfeld neu gebaut (Nachfolger): ${what}`);
  });
}

/**
 * Eine Fahrt mit der Fahrphysik über den Kurs der Karte, im Takt von main.js: Grenzen setzen, steuern, bewegen,
 * trip.update, dann course.fill – dessen Krümmung und Steigung unter dem Wagen gelten für die nächste Bewegung.
 * mode 'auto': der Fahrer des Autopiloten (plan.js autoDrive wie main.js xxlAuto) lenkt in den Kurven mit, nimmt enge
 * Kurven gemütlich und hält sonst das Tempo am Limit; mode 'lazy': lenkt nie (nur Spurhalteassistent), fährt
 * Vollgas (der Begrenzer muss bremsen) – auf gerader Strecke, denn ohne Lenken trüge jede Kurve den Wagen an die
 * Planke (so will es die Fahrphysik); Steigungen bleiben. cruise: mit Tempomat auf 130 km/h statt mit dem Fuß.
 */
function drive(trip, metres, { mode = 'auto', decide = null, dt = 1 / 30, onEvent = null, cruise = false } = {}) {
  const p = new Player();
  if (cruise) p.configure({ cruise: true });
  p.s = trip.s;
  p.x = trip.x;
  p.speed = 40 / 3.6;
  if (cruise) p.cruiseSet = AUTO.cruise;
  const course = new Course({ planner: new MapPlanner({ graph: G, shapes }) });
  const env = { kappa: 0, grade: 0 };
  course.fill(trip, p.s, curveTable, dt);
  const lim = { left: 0, right: 0, shoulder: 0, lanes: null, extraLane: null, vmax: Infinity, decel: 0, slack: 0, closing: 0 };
  const seen = new Map(); // Waldstücke im Sichtbereich: Schlüssel → Weg-ID
  const built = new Map(); // Straßenstücke: Id → Schlüssel (checkPieces)
  const arrival = new Arrival();
  const choice = new Map(); // Gabelung → gewählte Richtung (decide wird je Gabelung einmal gefragt)
  let resting = 0;
  const end = p.s + metres;
  let guard = 0;
  while (p.s < end && guard++ < 400000) {
    const stop = arrival.stop(trip);
    limitsFor(trip, lim, stop);
    p.setLimits(lim);
    // Steuerung: wie der Autopilot; mit decide entscheidet der Test selbst über jede Ausfahrt
    const ctl = { steer: 0, throttle: 1, brake: 0 };
    let want = autoTarget(trip);
    const f = trip.section.kind === 'ab' ? trip.section.fork : null;
    if (decide && f && !f.taken && !f.forced && f.s - trip.s < J.decel - 10) {
      if (!choice.has(f)) choice.set(f, decide(f, trip));
      want = choice.get(f) ? J.L0 : 5.625;
    }
    if (mode === 'auto') {
      let k = 0;
      for (let d = 0; d <= AUTO.ahead; d += 20) k = Math.max(k, Math.abs(curveAt(d).k));
      autoDrive(ctl, p, want, lim.vmax, k);
      // mit Tempomat rührt der Fahrer die Pedale nicht an
      if (cruise) ctl.throttle = ctl.brake = 0;
    }
    if (resting > 0) {
      // am Ziel kurz stehen, dann weiter
      ctl.throttle = 0;
      resting -= dt;
    }
    const s0 = p.s;
    env.kappa = mode === 'auto' ? course.state.kappa : 0;
    env.grade = course.state.grade;
    p.update(dt, ctl, env);
    for (const e of p.events) if (e.type === 'rail') {
      stats.rails++;
      ok(false, `Planke (${mode}) bei s=${p.s.toFixed(0)} x=${p.x.toFixed(2)} in ${trip.section.kind} [${lim.left.toFixed(2)}, ${lim.right.toFixed(2)}] vx=${p.vx.toFixed(2)} R=${env.kappa ? (1 / env.kappa).toFixed(0) : '∞'} bei ${p.kmh.toFixed(0)} km/h`);
    }
    if (mode === 'auto' && Math.abs(env.kappa) > 1e-5) {
      // in der Kurve: wie weit trägt es den Wagen von seiner Linie, wie stark drückt es zur Seite
      stats.bendM += p.s - s0;
      if (Math.abs(env.kappa) > 1 / 450) stats.tightM += p.s - s0;
      if (!decide) stats.maxOff = Math.max(stats.maxOff, Math.abs(p.x - want));
      stats.maxLat = Math.max(stats.maxLat, p.speed * p.speed * Math.abs(env.kappa));
    }
    ok(p.x >= lim.left - 1e-6 && p.x <= lim.right + 1e-6, 'außerhalb der Grenzen');
    // Brunneninsel: der Wagen (4,7 × 1,86 m) berührt sie nie
    const sq = trip.section.kind === 'stadt' ? squareOf(trip.section) : null;
    if (sq && Math.abs(p.s - sq.s) < sq.r + 3) {
      const cx = Math.max(p.x - 0.93, Math.min(sq.x, p.x + 0.93));
      const cs = Math.max(p.s - 2.35, Math.min(sq.s, p.s + 2.35));
      stats.island++;
      ok(Math.hypot(cx - sq.x, cs - sq.s) > sq.r + 0.05, `Wagen an der Brunneninsel bei s=${p.s.toFixed(1)} x=${p.x.toFixed(2)}`);
    }
    const evs = trip.update(p.s, p.x);
    course.fill(trip, p.s, curveTable, dt);
    stats.metres += p.s - s0;
    // Knotenpunkte des eigenen Wegs: rundherum gerade
    for (const c of trip.cur.sections) {
      for (const at of [c.fork ? c.fork.s : NaN, c.kind === 'ab' && c.merge ? c.merge.s : NaN]) {
        if (!(Math.abs(at - p.s) <= CALM)) continue;
        stats.links++;
        ok(Math.abs(course.state.kappa) < 1e-9, `Kurve am Knotenpunkt: R=${(1 / course.state.kappa).toFixed(0)} m bei s=${p.s.toFixed(0)}, ${(p.s - at).toFixed(0)} m vom Punkt (${c.kind})`);
      }
    }
    // Scherungen ohne neue Objekte (trip.shearsInto, von der Welt je Bild benutzt) = trip.shears()
    if ((guard & 7) === 0) {
      checkPieces(trip, built);
      checkSeams(trip);
      const ref = trip.shears();
      trip.shearsInto(shearMap);
      stats.shears++;
      ok(ref.size === shearMap.size, `shearsInto: ${shearMap.size} statt ${ref.size} Rahmen bei s=${p.s.toFixed(0)}`);
      for (const [id, e] of ref) {
        const q = shearMap.get(id);
        ok(q && Math.abs(q.a - e.a) < 1e-6 && Math.abs(q.b - e.b) < 1e-9, `shearsInto weicht ab: Rahmen ${id} bei s=${p.s.toFixed(0)}`);
      }
    }
    for (const e of evs) {
      if (onEvent) onEvent(e, trip, p);
      if (e.type === 'fork') {
        stats.forks++;
        if (e.wrong && !decide) stats.wrong++;
        ok(mode !== 'auto' || decide || !e.wrong, `Autopilot verpasst die Ausfahrt bei s=${e.fork.s} (x=${p.x.toFixed(2)})`);
      }
      if (e.type === 'enter') {
        const L = PROFILES[e.sec.profile].limit;
        if (L > 0 && mode === 'auto') {
          stats.entries++;
          const over = p.kmh - L;
          stats.maxOver = Math.max(stats.maxOver, over);
          if (over > 4) stats.over++;
          ok(over < 8, `zu schnell in ${e.sec.kind}: ${p.kmh.toFixed(0)} statt ${L} km/h bei s=${p.s.toFixed(0)}`);
        }
      }
    }
    // Halt am Ziel
    const rest = arrival.update(trip, evs, p.speed);
    if (rest) {
      stats.rests++;
      ok(rest.square && Math.abs(rest.square.stop - p.s) < 1.5, `steht ${(rest.square ? rest.square.stop - p.s : NaN).toFixed(2)} m vor dem Haltepunkt`);
      resting = 2;
    }
    if (stop && p.s > stop.s + 1) ok(false, `über den Haltepunkt gerollt: ${(p.s - stop.s).toFixed(2)} m bei ${p.kmh.toFixed(0)} km/h`);
    // Wald
    const s = trip.s;
    const own = forestRanges(trip.cur, []);
    for (const c of trip.curtains()) {
      if (c.path !== trip.cur || c.s1 < s - 50) continue;
      stats.curtains++;
      ok(own.some((r) => r.s0 <= c.s0 - FOREST_IN + 1 && r.s1 >= c.s1 + FOREST_OUT - 1), `Vorhang ${c.why} ${c.s0}–${c.s1} ohne Wald bei s=${s.toFixed(0)}`);
    }
    for (const { path } of trip.paths()) {
      const fr = forestRanges(path, []);
      for (const r of fr) {
        if (r.s1 < s - XXL_BEHIND || r.s0 > s + AHEAD) continue;
        const key = path.id + ':' + Math.round(r.s0) + '-' + Math.round(r.s1);
        if (!seen.has(key)) {
          stats.forests++;
          ok(r.s0 > s + FOG_END - 1 || seen.size === 0 || guard < 3, `Waldstück erscheint im Blickfeld bei s=${s.toFixed(0)}: ${key} (${(r.s0 - s).toFixed(0)} m voraus)`);
          seen.set(key, { path, r, s });
        }
      }
    }
    for (const [key, v] of seen) {
      if (v.r.s1 < s - XXL_BEHIND - 50) {
        seen.delete(key);
        continue;
      }
      const still = trip.paths().some((e) => e.path === v.path) && forestRanges(v.path, []).some((r) => Math.round(r.s0) === Math.round(v.r.s0) && Math.round(r.s1) === Math.round(v.r.s1));
      // ein Zweig darf mitsamt seinem Wald verschwinden, wenn er hinter uns liegt oder nie gezeichnet wurde (neu geplant)
      if (!still) seen.delete(key);
    }
  }
  return p;
}

// --- Fahrt 1: Erlensee → Hanau mit Halt am Brunnen -------------------------------------------------------------
{
  const trip = new Trip({ rng: rng(1) });
  trip.setTarget(G.findPlace('Hanau'));
  let arrived = false;
  drive(trip, 7000, { onEvent: (e) => (arrived ||= e.type === 'arrive') });
  ok(arrived, 'Ankunft in Hanau');
  ok(stats.rests === 1, 'Halt am Ziel in Hanau: ' + stats.rests);
}
// --- Fahrt 2: lange Fahrt nach Köln, faul (nur Spurhalteassistent, Vollgas) ------------------------------------
{
  const trip = new Trip({ rng: rng(2) });
  trip.setTarget(G.findPlace('Köln'));
  drive(trip, 20000, { mode: 'lazy' });
}
// --- Fahrt 2b: Erlensee → Hanau mit Tempomat (Limits und Halt am Brunnen ohne Pedale) ----------------------------
{
  const trip = new Trip({ rng: rng(1) });
  trip.setTarget(G.findPlace('Hanau'));
  const before = stats.rests;
  drive(trip, 7000, { cruise: true });
  ok(stats.rests === before + 1, 'Halt am Ziel in Hanau mit Tempomat: ' + (stats.rests - before));
}
// --- Fahrt 3: Sonderfälle (Autobahnende, -anfang, Landstraße, Grenze, Verbindung) --------------------------------
for (const name of ['Wiesbaden', 'Adeje', 'Key West', 'Barcelona', 'Bacharach']) {
  const trip = new Trip({ rng: rng(3) });
  trip.setTarget(G.findPlace(name));
  drive(trip, 14000);
}
// --- Zufallsfahrten -----------------------------------------------------------------------------------------------
const runs = Number(process.argv[2] || 12);
for (let r = 0; r < runs; r++) {
  const rnd = rng(500 + r);
  const start = Math.floor(rnd() * G.nodes.length);
  const trip = new Trip({ rng: rnd, start });
  const obey = rnd() < 0.5;
  for (let leg = 0; leg < 6; leg++) {
    const d = trip.distances();
    const cand = G.places.map((p) => ({ i: p.i, c: d.toPlace(p.i).cost })).filter((c) => isFinite(c.c)).sort((a, b) => a.c - b.c);
    trip.setTarget(cand[Math.min(cand.length - 1, Math.floor(Math.pow(rnd(), 3) * cand.length))].i);
    drive(trip, 3000, { mode: r % 3 === 2 ? 'lazy' : 'auto', decide: obey ? null : () => rnd() < 0.5 });
  }
}
// --- Schilder gegen Navi ------------------------------------------------------------------------------------------
const sig = { trips: 0, km: 0, forks: 0, said: 0, boards: 0, tables: 0, rows: 0, maxDev: 0, gantries: 0, towns: 0, arrive: 0 };
{
  const placeNames = new Set(G.places.map((p) => p.name));
  const nodeNames = new Set(G.nodes.map((n) => n.name));
  const roadLabels = new Set(G.roads.map((r) => r.label));
  const routeCache = new Map();
  const routeOf = (pi) => {
    if (!routeCache.has(pi)) routeCache.set(pi, G.routeTo(pi));
    return routeCache.get(pi);
  };
  // Was das Navi an der Stelle des Spielers für Ort pi zeigt, wäre er das Ziel (trip.stateAhead mit dessen Route),
  // und an welchem Knoten es dafür abfahren ließe (erste Gabelung mit 'exit' im angelegten Weg, sonst −1)
  const navi = (trip, pi) => {
    const pol = trip.policy;
    const tg = trip.target;
    trip.policy = routeOf(pi);
    trip.target = pi;
    const km = trip.stateAhead().km;
    let node = -1;
    for (const c of trip.cur.sections) {
      if (c.s1 <= trip.s || !c.fork || c.fork.taken) continue;
      if (trip.planFor(c.fork) === 'exit') {
        node = c.fork.node;
        break;
      }
    }
    trip.policy = pol;
    trip.target = tg;
    return { km, node };
  };
  const checkTable = (trip, rows, where) => {
    for (const r of rows) {
      sig.rows++;
      ok(placeNames.has(r.name) && G.places[r.place].name === r.name, `Tafel nennt unbekannten Ort ${r.name} (${where})`);
      const n = navi(trip, r.place);
      const dev = Math.abs(r.km - n.km);
      sig.maxDev = Math.max(sig.maxDev, dev);
      ok(dev <= 1, `Tafel ${where}: ${r.name} ${r.km} km, das Navi zeigt ${n.km.toFixed(1)} km`);
      ok(n.node < 0 || n.node === r.node, `Tafel ${where}: ${r.name} – das Navi führte über ${G.nodes[n.node]?.name} statt ${G.nodes[r.node].name}`);
      // Ausfahrt mindestens NEAR_ROAD Meter entfernt (wo die Gabelung schon angelegt ist)
      for (const c of trip.cur.sections) {
        if (c.s1 <= trip.s || !c.fork || c.fork.node !== r.node) continue;
        ok(c.fork.s - trip.s >= NEAR_ROAD - 6, `Tafel ${where}: ${r.name}, Ausfahrt schon in ${(c.fork.s - trip.s).toFixed(0)} m`);
        break;
      }
    }
  };
  const checked = new Set();
  const tablesDone = new Set();
  const N = Math.max(50, Number(process.argv[3] || 50));
  for (let r = 0; r < N; r++) {
    const rnd = rng(9000 + r);
    const start = r === 0 ? undefined : Math.floor(rnd() * G.nodes.length);
    const trip = new Trip({ rng: rnd, start });
    sig.trips++;
    const choice = r % 5 === 4 ? 'stay' : null;
    let nextGantry = trip.s + 700;
    for (let leg = 0; leg < 4; leg++) {
      const d = trip.distances();
      const cand = G.places.map((p) => ({ i: p.i, c: d.toPlace(p.i).cost })).filter((c) => isFinite(c.c) && c.c > 30).sort((a, b) => a.c - b.c);
      if (!cand.length) break;
      trip.setTarget(cand[Math.min(cand.length - 1, Math.floor(Math.pow(rnd(), 2) * cand.length))].i);
      const end = trip.s + 9000;
      while (trip.s < end) {
        const s = trip.s + 5;
        trip.update(s, autoTarget(trip, choice));
        sig.km += 0.005;
        const g = trip.guidance();
        // Ansage → Schilder an der genannten Gabelung
        if (g.type === 'exit' && !g.far && g.fork && !checked.has(g.fork.id)) {
          checked.add(g.fork.id);
          sig.forks++;
          const f = g.fork;
          const list = sectionSigns(trip, trip.cur.sections, f.sec, [], { target: trip.target, tables: false });
          ok(Math.abs(trip.s + g.dist - f.s) < 1e-6, 'guidance().dist zeigt nicht auf die Gabelung');
          for (const dd of BOARD_D) {
            const b = list.find((e) => e.kind === 'vorweg' && e.fork === f.id && e.dist === dd);
            ok(b && Math.abs(b.s - (f.s - dd)) < 1e-6, `kein Vorwegweiser ${dd} m vor ${g.title}`);
            if (!b) continue;
            sig.boards++;
            ok(b.title === g.title && b.texts[0] === g.title && b.texts[b.texts.length - 1] === dd + ' m', `Vorwegweiser „${b.texts.join(' / ')}“ zur Ansage „${g.title}“`);
            for (const row of b.board.rows) {
              ok(!row.road || roadLabels.has(row.road), `Vorwegweiser nennt unbekannte Straße ${row.road}`);
              ok(placeNames.has(row.text) || nodeNames.has(row.text), `Vorwegweiser nennt unbekannten Ort ${row.text}`);
            }
          }
          for (const dd of BEACON_D) ok(list.some((e) => e.kind === 'bake' && e.fork === f.id && Math.abs(e.s - (f.s - dd)) < 1e-6), `keine Bake ${dd} m vor ${g.title}`);
          ok(list.some((e) => (f.forced ? e.kind === 'ende' : e.kind === 'ausfahrt') && e.fork === f.id), `keine Tafel ${f.forced ? 'Ende der Autobahn' : 'Ausfahrt'} an ${g.title}`);
        }
        if (g.type === 'exit' && !g.far && g.fork) {
          // sagt das Navi „in 1000 m …“, steht genau dort (±2,5 m, halber Schritt) der Vorwegweiser mit diesem Titel
          for (const dd of BOARD_D) if (Math.abs(g.dist - dd) <= 2.5) {
            sig.said++;
            const list = sectionSigns(trip, trip.cur.sections, g.fork.sec, [], { tables: false });
            ok(list.some((e) => e.kind === 'vorweg' && e.title === g.title && e.dist === dd && Math.abs(e.s - trip.s) <= 2.5 + 1e-6), `Ansage „in ${dd} m ${g.title}“ ohne Tafel hier (s=${trip.s.toFixed(0)})`);
          }
        }
        if (g.type === 'arrive' && !checked.has('z' + g.sec.id)) {
          checked.add('z' + g.sec.id);
          sig.arrive++;
          const list = sectionSigns(trip, trip.cur.sections, g.sec, [], { target: trip.target, tables: false });
          const z = list.find((e) => e.kind === 'ziel');
          ok(z && Math.abs(z.s - g.sec.spotS) < 1e-6 && Math.abs(trip.s + g.dist - z.s) < 1e-6, `Navi-Ziel ${G.places[g.sec.place].name}: kein Platz bei spotS`);
          ok(list.some((e) => e.kind === 'ort' && e.texts[0] === G.places[g.sec.place].name), `keine Ortstafel ${G.places[g.sec.place].name}`);
        }
        // Tafeln, an denen der Wagen gerade vorbeifährt
        const sec = trip.section;
        const list = sectionSigns(trip, trip.cur.sections, sec, [], { target: trip.target });
        for (const e of list) {
          if (e.s > trip.s || e.s <= trip.s - 5 || tablesDone.has(e.key)) continue;
          tablesDone.add(e.key);
          if (e.kind === 'tafel') {
            sig.tables++;
            checkTable(trip, e.rows, `bei s=${e.s.toFixed(0)}`);
          } else if (e.kind === 'ort' || e.kind === 'ortsende') {
            sig.towns++;
            ok(placeNames.has(e.texts[0]) && e.texts[0] === G.places[e.place].name, `Ortstafel ${e.texts[0]}`);
          } else if (e.kind === 'auffahrt') {
            ok(roadLabels.has(e.road) && nodeNames.has(e.towards), `Wegweiser zur Autobahn: ${e.road} ${e.towards}`);
          }
        }
        // Schilderbrücken (Szenerie): Tafel an beliebiger Stelle auf der Autobahn
        if (sec.kind === 'ab' && trip.s >= nextGantry) {
          nextGantry = trip.s + 1300;
          const rows = tableAt(trip.cur.sections, trip.s, 4);
          if (rows.length) {
            sig.gantries++;
            checkTable(trip, rows, `Schilderbrücke bei s=${trip.s.toFixed(0)}`);
          }
        }
      }
    }
  }
  ok(sig.trips >= 50 && sig.forks > 150 && sig.tables > 200 && sig.arrive > 5, `zu wenig geprüft: ${JSON.stringify(sig)}`);
}
console.log(`Schilder gegen Navi: ${sig.trips} Fahrten, ${sig.km.toFixed(0)} km, ${sig.forks} angesagte Gabelungen (${sig.boards} Vorwegweiser, ${sig.said} Ansagen genau an einer Tafel), ${sig.arrive} Ziele, ${sig.tables} Entfernungstafeln und ${sig.gantries} Schilderbrücken mit ${sig.rows} Zeilen (größte Abweichung zum Navi ${sig.maxDev.toFixed(2)} km), ${sig.towns} Ortstafeln`);
console.log(`XXL-Planung: ${(stats.metres / 1000).toFixed(1)} km gefahren, ${stats.forks} Gabelungen, ${stats.entries} Einfahrten mit Limit (${stats.over} über +4 km/h, höchstens +${stats.maxOver.toFixed(1)} km/h), ${stats.forests} Waldstücke, ${stats.rests} Halte am Ziel, ${stats.island} Bilder neben einer Brunneninsel, ${stats.shears} Scherungsvergleiche, ${stats.pieces} Stückabgleiche (${stats.rebuilt} Neubauten, alle jenseits des Dunsts), ${stats.seams} Nähte zwischen Abschnitten, ${stats.rails} Plankenstöße; Kurven: ${(stats.bendM / 1000).toFixed(1)} km gelenkt (${(stats.tightM / 1000).toFixed(1)} km enger als R 450), höchstens ${stats.maxOff.toFixed(2)} m neben der Linie, Querbeschleunigung bis ${stats.maxLat.toFixed(1)} m/s², ${stats.links} Bilder an Knotenpunkten gerade`);
for (const [k, n] of kinds) if (n > 3) console.log(`  … ${n}× ${k}`);
console.log(fails ? `${fails} FEHLER` : 'alles in Ordnung');
process.exit(fails ? 1 : 0);
