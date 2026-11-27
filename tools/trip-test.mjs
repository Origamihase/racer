// Prüft Karte, Routen und Streckenlogik ohne Grafik: node tools/trip-test.mjs [Anzahl Zufallsfahrten]
import * as G from '../src/map/graph.js';
import { Trip, J, R, dR, BETA, PROFILES } from '../src/game/trip.js';
import { PARKS, PARK, PARK_STOP_AFTER, parkAt, placeParks, parkCandidate, parkZub, postAt } from '../src/map/parks.js';

let fails = 0;
const ok = (cond, msg) => {
  if (!cond) {
    fails++;
    if (fails < 40) console.log('FEHLER:', msg);
  }
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

// --- Karte -----------------------------------------------------------------------------
ok(G.places.every((p) => p.node >= 0), 'jeder Ort hängt an einem Knoten');
const erl = G.findNode('Erlensee');
const from = G.routeFrom(G.stateOfNode(erl));
ok(G.places.every((p) => isFinite(from.toPlace(p.i).cost)), 'alle Orte sind von Erlensee aus erreichbar');
for (const n of G.nodes) ok(n.edges.length > 0, 'Knoten ohne Straße: ' + n.id);

// --- Ladeparks an Ausfahrten (src/map/parks.js) -----------------------------------------
{
  ok(JSON.stringify(placeParks()) === JSON.stringify(PARKS), 'Ladeparks: dieselbe Regel liefert dieselbe Liste');
  ok(PARKS.length >= 380 && PARKS.length <= 480, 'Ladeparks: Anzahl ' + PARKS.length);
  ok(G.places.length === 426 && PARKS.every((p) => !G.places.some((q) => q.name === p.name)), 'Ladeparks sind keine Orte');
  ok(new Set(PARKS.map((p) => p.name)).size === PARKS.length && PARKS.every((p) => p.name.startsWith('Ladepark ')), 'Ladeparks: Namen eindeutig');
  const hb = PARKS.find((p) => p.name === 'Ladepark Hammersbach');
  ok(hb && G.nodeTitle(hb.node) === 'Ausfahrt Hammersbach' && G.roads[hb.road].label === 'A45', 'Ladepark Hammersbach an der A45 (Anker der Regel)');
  ok(parkZub() >= 300 && parkZub() <= 500 && parkZub() === G.zubLen(0, PARK.zub), 'Zubringer zum Park: ' + parkZub() + ' m');
  ok(J.ramp + parkZub() + PARK.len + PARK.back + J.auf === J.hide + J.show, 'Park-Zweig: Rampe bis Auffahrt = J.hide + J.show');
  for (const p of PARKS) {
    ok(parkAt(p.node) === p.i && parkCandidate(G.nodes[p.node]), 'Ladepark an keiner Ausfahrt: ' + p.name);
    for (const de of G.nodes[p.node].edges) if (G.deKind(de ^ 1) === 'ab') ok(G.straight(de ^ 1) >= 0, `${p.name}: die Autobahn endet hier`);
  }
  // Abstände je Autobahn: im Fenster; darunter nur, wo ein Park einer anderen Autobahn mitzählt; darüber nur, wo im
  // Fenster keine Ausfahrt lag
  const gaps = [];
  for (const r of G.roads) {
    if (r.kind !== 'ab') continue;
    let km = 0;
    let last = null;
    const cand = [];
    for (let i = 0; i < r.nodes.length; i++) {
      const n = r.nodes[i];
      if (i > 0) {
        const de = G.nodes[r.nodes[i - 1]].edges.find((d) => G.edges[d >> 1].road === r.i && G.deTo(d) === n);
        if (de === undefined) break;
        km += G.edges[de >> 1].km;
      }
      if (parkCandidate(G.nodes[n])) cand.push(km);
      const pk = parkAt(n);
      if (pk < 0) continue;
      const g = km - (last ? last.km : 0);
      if (last) gaps.push(g);
      // die Parks der Rasthöfe und die zusätzlichen (tools/map/ladeparks.mjs) stehen, wo das Ladenetz sie braucht
      const frei = (k) => PARKS[k].rast || PARKS[k].extra;
      if (g < PARK.min) ok(PARKS[pk].road !== r.i || (last && PARKS[last.pk].road !== r.i) || !last || frei(pk) || frei(last.pk), `${r.label}: ${PARKS[pk].name} nur ${g.toFixed(0)} km hinter dem vorigen Park`);
      if (g > PARK.max) {
        const from = last ? last.km : 0;
        ok(!cand.some((c) => c - from >= PARK.min && c - from <= PARK.max), `${r.label}: Lücke ${g.toFixed(0)} km vor ${PARKS[pk].name}, obwohl eine Ausfahrt im Fenster lag`);
      }
      last = { km, pk };
    }
  }
  gaps.sort((a, b) => a - b);
  const q = (f) => gaps[Math.floor(f * (gaps.length - 1))].toFixed(0);
  console.log(`Ladeparks: ${PARKS.length} an Ausfahrten, Abstand je Autobahn Median ${q(0.5)} km (p25 ${q(0.25)}, p75 ${q(0.75)}), ${gaps.filter((g) => g >= PARK.min && g <= PARK.max).length} von ${gaps.length} im Fenster ${PARK.min}–${PARK.max} km, Zubringer ${parkZub()} m`);
}

// --- Geometrie des Knotenpunkts --------------------------------------------------------
ok(Math.abs(R(J.cap) - (J.kappa * J.cap * J.cap) / 2) < 1e-9, 'R am Ende des Bogens');
ok(Math.abs(dR(J.cap + 50) - BETA) < 1e-9, 'Steigung nach dem Bogen');

/** Prüft die Wege eines Trips auf Lücken. */
function checkPaths(trip) {
  for (const { path } of trip.paths()) {
    let prev = null;
    for (const sec of path.sections) {
      if (prev) ok(Math.abs(prev.s1 - sec.s0) < 1e-6, `Lücke im Weg ${path.id} vor ${sec.kind}`);
      ok(sec.len > 0, 'Abschnitt ohne Länge: ' + sec.kind);
      ok(trip.frames.has(sec.frame), 'Rahmen fehlt');
      prev = sec;
    }
  }
}

/**
 * Fährt eine Strecke ab. decide(fork, trip) → true = abfahren. Prüft dabei, dass nichts springt:
 * die Lage jedes Rahmens im Bild (a + b·d) darf sich von Meter zu Meter nur wenig ändern.
 */
const VIEW = { cur: 0, ghost: 0, ahead: 0, none: 0, begins: 0, ends: 0, swaps: 0 };
function drive(trip, metres, decide, opts = {}) {
  const log = [];
  let x = J.L0;
  let lastSh = null;
  let lastProf = null;
  let lastView = null;
  const step = opts.step || 1;
  const end = trip.s + metres;
  while (trip.s < end) {
    const s = trip.s + step;
    // Spur wählen: vor einer Gabelung rechtzeitig auf den Verzögerungsstreifen oder weg davon
    const sec = trip.section;
    if (sec.kind === 'ab') {
      const f = sec.fork;
      if (f && !f.taken && f.s - s < J.decel - 20) x = decide(f, trip) ? J.L0 : 5.625;
      else if (s - sec.s0 > J.accel) x = 5.625;
    } else x = J.L0;
    const p0 = trip.profile(s);
    x = Math.min(Math.max(x, p0.xmin), p0.xmax);
    const evs = trip.update(s, x);
    for (const e of evs) {
      log.push(e);
      if (opts.onEvent) opts.onEvent(e, trip);
    }
    const prof = trip.profile();
    ok(prof.xmin < prof.xmax, 'Grenzen verdreht');
    if (lastProf && !evs.some((e) => e.type === 'fork')) {
      // Grenzen dürfen nur langsam enger werden
      ok(prof.xmin - lastProf.xmin < 0.2 * step + 1e-9, `linke Grenze springt bei ${trip.section.kind} um ${(prof.xmin - lastProf.xmin).toFixed(2)}`);
      ok(lastProf.xmax - prof.xmax < 0.2 * step + 1e-9, `rechte Grenze springt bei ${trip.section.kind} um ${(lastProf.xmax - prof.xmax).toFixed(2)}`);
    }
    lastProf = prof;
    const sh = trip.shears();
    ok(sh.has(trip.section.frame) || trip.section.link, 'eigener Rahmen ohne Scherung');
    for (const { path } of trip.paths()) for (const c of path.sections) if (c.s1 > s - 100 && c.s0 < s + 1500) ok(sh.has(c.frame), `sichtbarer Abschnitt ${c.kind} ohne Scherung`);
    if (lastSh) {
      for (const [id, v] of sh) {
        const w = lastSh.get(id);
        if (!w) continue;
        // Punkt 0 m und 300 m voraus
        const j0 = Math.abs(v.a - w.a + (v.b - w.b) * 0 - w.b * 0);
        const near = Math.abs(v.a - (w.a + w.b * step));
        const far = Math.abs(v.a + v.b * 300 - (w.a + w.b * (300 + step)));
        ok(near < 0.02 * step + 1e-6 && far < 1.3 * step, `Rahmen springt (nah ${near.toFixed(3)}, fern ${far.toFixed(3)}) in ${trip.section.kind} bei s=${s.toFixed(0)}`);
      }
    }
    lastSh = sh;
    // höchstens eine Autobahn ist zu sehen, und unter uns liegt immer Fahrbahn
    const av = trip.autobahnView();
    if (trip.section.kind === 'ab') ok(av && av.role === 'cur' && av.frame === trip.section.frame && av.s0 <= s && av.s1 >= s, 'Autobahn unter uns fehlt bei s=' + s);
    if (av) {
      ok(sh.has(av.frame), 'sichtbare Autobahn ohne Scherung (' + av.role + ')');
      ok(av.s0 < av.s1 && av.secs.length > 0, 'Autobahn ohne Ausdehnung');
      const ghost = trip.ghosts.some((g) => g.fork.taken === 'exit');
      const ahead = trip.cur.sections.some((c) => c.kind === 'ab' && c.merge && c.s0 > s && s >= c.s0 - J.show);
      ok(!(ghost && ahead), 'zwei Autobahnen zugleich zu sehen bei s=' + s);
      VIEW[av.role] += step;
      if (isFinite(av.s0)) VIEW.begins += step;
      if (isFinite(av.s1)) VIEW.ends += step;
    } else VIEW.none += step;
    // eine Autobahn verschwindet oder erscheint nur, während wir tief in einem Waldstück stecken
    const key = av ? av.role + av.frame : '';
    if (lastView && key !== lastView.key) {
      const deep = trip.curtains().some((c) => c.path === trip.cur && s - c.s0 >= J.curtainBefore - step - 1 && c.s1 - s >= J.curtainAfter - step - 1);
      if (lastView.role === 'ghost') ok(deep, 'Autobahn verschwindet außerhalb des Waldstücks bei s=' + s);
      if (av && av.role === 'ahead') {
        ok(deep, `Autobahn erscheint außerhalb des Waldstücks bei s=${s} (${trip.section.kind})`);
        ok(av.secs[0].s0 - s >= J.show - step - 1, 'Autobahn erscheint zu nah: ' + (av.secs[0].s0 - s));
      }
      VIEW.swaps++;
    }
    lastView = { key, role: av ? av.role : '' };
    for (const c of trip.curtains()) {
      if (c.path !== trip.cur || c.s1 < s - 50) continue;
      for (const q of c.path.sections) if (q.s1 > c.s0 && q.s0 < c.s1) ok(q.kind === 'ramp' || q.kind === 'conn' || q.kind === 'zub', `Waldstück (${c.why}, ${c.s0}–${c.s1}) liegt auf ${q.kind} ${q.s0}–${q.s1}`);
    }
    for (const { path, role } of trip.paths()) {
      for (const c of path.sections) if (c.kind !== 'ab' && trip.visible(c, path) && c.s1 > s - 100 && c.s0 < s + 1500) ok(sh.has(c.frame), `gezeichneter Abschnitt ${c.kind} (${role}) ohne Scherung`);
    }
    if (opts.check !== false && (s | 0) % 97 === 0) checkPaths(trip);
  }
  return log;
}

// --- Fahrt 1: von Erlensee nach Hanau, immer dem Navi nach ------------------------------
{
  const trip = new Trip({ rng: rng(1) });
  ok(trip.section.kind === 'stadt' && G.places[trip.section.place].name === 'Erlensee', 'Start im Ort Erlensee');
  const hanau = G.findPlace('Hanau');
  trip.setTarget(hanau);
  const g0 = trip.guidance();
  ok(g0.km > 6 && g0.km < 13, 'Hanau liegt rund 9 km entfernt: ' + g0.km);
  const log = drive(trip, 6000, (f, t) => t.planFor(f) === 'exit');
  const arr = log.find((e) => e.type === 'arrive');
  ok(arr && arr.place === hanau, 'Ankunft in Hanau');
  console.log('Erlensee → Hanau:', log.filter((e) => e.type !== 'pass').map((e) => (e.type === 'enter' ? e.sec.kind : e.type === 'fork' ? `Gabelung(${e.taken})` : e.type)).join(' '), `| ${trip.km.toFixed(1)} Karten-km auf ${trip.s.toFixed(0)} m`);
}

// --- Fahrt 1b: Ladestopp nach Würzburg – geplant, ohne Plan genommen, vorbeigefahren -------
{
  const wz = G.findPlace('Würzburg');
  const start = () => {
    const trip = new Trip({ rng: rng(4) });
    trip.setTarget(wz, true);
    drive(trip, 300, (f, t) => t.planFor(f) === 'exit');
    return trip;
  };
  // fährt dem Navi nach (takePark: an jeder Park-Ausfahrt rechts halten) und schreibt mit, was der Zähler zählt
  const run = (trip, takePark) => {
    const km0 = trip.km;
    const m = { park: null, planned: null, arrive: null, wende: 0, after: null, forkDe: -1, missed: 0 };
    drive(trip, 16000, (f, t) => (takePark && parkAt(f.node) >= 0 && m.park === null) || t.planFor(f) === 'exit', {
      step: 2,
      onEvent: (e, t) => {
        if (e.type === 'fork' && e.taken === 'exit' && parkAt(e.fork.node) >= 0 && m.park === null) m.forkDe = e.fork.de;
        if (e.type === 'fork' && e.stop) m.missed++;
        if (e.type === 'park') {
          m.park = t.km - km0;
          m.planned = e.planned;
        }
        if (e.type === 'enter' && e.sec.kind === 'ab' && m.park !== null && m.after === null) m.after = e.sec.de;
        if (e.type === 'arrive' && m.arrive === null) m.arrive = t.km - km0;
        const g = t.guidance();
        if (m.arrive === null && g.then && g.then.wende) m.wende++;
      },
    });
    return m;
  };
  // geplant: nextRest nennt den Park, setStop plant ihn ein, der Umweg sind genau Rampe bis Auffahrt (echte Straße)
  let trip = start();
  const r0 = trip.reach();
  const nr = trip.nextRest();
  ok(nr && nr.name === 'Ladepark Aschaffenburg' && !nr.planned, 'nächster Ladepark nach Würzburg: ' + (nr && nr.name));
  // der Akku leert sich je Meter Straße: die echte Straße darunter (realM), der Abstecher wie nach setStop (detour, bis
  // zum Haltepunkt) und der Weg hinter dem Ziel weiter zum nächsten Park von dort (pastTarget)
  const dt = trip.detour(nr.park);
  const D = PARK_STOP_AFTER;
  ok(nr.realM > J.ramp && nr.realM < nr.m && Math.abs(dt.km - nr.km + D / 1000) < 1e-9 && Math.abs(dt.m - nr.m + D) < 1e-9 && Math.abs(dt.realM - nr.realM + D) < 1e-9, `Abstecher zum Park: ${dt.m} m (${dt.realM} echt) statt ${nr.m} m (${nr.realM} echt)`);
  const pt = trip.pastTarget();
  ok(pt && pt.km > r0.km && pt.m > r0.m && pt.realM > r0.realM && pt.m - r0.m >= pt.realM - r0.realM, `hinter Würzburg zum nächsten Park: ${pt && pt.m} m (${pt && pt.realM} echt)`);
  trip.setStop(nr.park);
  const r1 = trip.reach();
  const nr1 = trip.nextRest();
  ok(trip.stop === nr.park && nr1.planned && Math.abs(nr1.km - nr.km) < 1e-9 && Math.abs(nr1.m - nr.m) < 1e-9 && Math.abs(nr1.realM - nr.realM) < 1e-9, 'geplanter Stopp: nextRest nennt ihn mit denselben Zahlen');
  ok(Math.abs(r1.km - r0.km - (J.hide + J.show) / 1000) < 1e-6, `Umweg des Ladestopps ${(r1.km - r0.km).toFixed(3)} km = Rampe bis Auffahrt`);
  ok(Math.abs(r1.realM - r0.realM - (J.hide + J.show)) < 1e-6 && trip.pastTarget() === null, `Umweg des Ladestopps: ${r1.realM - r0.realM} m echte Straße`);
  let m = run(trip, false);
  ok(m.planned === true && Math.abs(m.park - (nr.km - PARK_STOP_AFTER / 1000)) < 0.003, `Kilometer bis zum Park ${m.park} statt ${nr.km}`);
  ok(m.arrive !== null && Math.abs(m.arrive - r1.km) < 0.003, `Kilometer bis Würzburg über den Park ${m.arrive} statt ${r1.km}`);
  ok(m.after === G.straight(m.forkDe) && m.wende === 0 && trip.stop === -1, 'nach dem Park: dieselbe Autobahn, kein „Bitte wenden“');
  const pm = m.park;
  // ohne Plan rechts gehalten: derselbe Park, dieselben Kilometer
  trip = start();
  m = run(trip, true);
  ok(m.planned === false && Math.abs(m.park - pm) < 0.003 && Math.abs(m.arrive - r1.km) < 0.003, `Park ohne Plan: ${m.park} / ${m.arrive} km`);
  ok(m.after === G.straight(m.forkDe) && m.wende === 0, 'Park ohne Plan: zurück auf dieselbe Autobahn, kein „Bitte wenden“');
  // vorbeigefahren: kein Park, Würzburg nach den Kilometern ohne Stopp
  trip = start();
  m = run(trip, false);
  ok(m.park === null && Math.abs(m.arrive - r0.km) < 0.003, `ohne Stopp: ${m.arrive} statt ${r0.km} km`);
  // geplant, aber an der Ausfahrt vorbei: der Stopp entfällt, die Route bleibt vorwärts
  trip = start();
  trip.setStop(trip.nextRest().park);
  const km0 = trip.km;
  m = { missed: 0, wende: 0, arrive: null };
  drive(trip, 16000, (f, t) => !(t.stop >= 0 && parkAt(f.node) === t.stop) && t.planFor(f) === 'exit', {
    step: 2,
    onEvent: (e, t) => {
      if (e.type === 'fork' && e.stop) m.missed++;
      if (e.type === 'arrive' && m.arrive === null) m.arrive = t.km - km0;
      const g = t.guidance();
      if (m.arrive === null && g.then && g.then.wende) m.wende++;
    },
  });
  ok(m.missed === 1 && trip.stop === -1 && m.wende === 0 && Math.abs(m.arrive - r0.km) < 0.01, `Stopp verpasst: ${JSON.stringify(m)}`);
  // die Ladesäule im Zielort zählt mit (in Würzburg steht sie hinter dem Brunnenplatz, map/parks.js postAt: nach dem
  // Park an der Ausfahrt); in der Sperrzone vor der Ausfahrt nach Würzburg führt der Zweig schon in den Ort: der Park an
  // dieser Ausfahrt liegt dann nicht mehr am Weg, die Ladesäule im Ort schon
  const wue = G.findPlace('Würzburg');
  const wueLen = G.townLen(G.places[wue].pop);
  const order = postAt(wue, wueLen, G.spotIn(wueLen)).after ? 'Ladepark Aschaffenburg,Ladepark Würzburg,Ladesäule in Würzburg' : 'Ladepark Aschaffenburg,Ladesäule in Würzburg,Ladepark Würzburg';
  trip = start();
  const names0 = trip.restsAhead(3).map((r) => r.name);
  let locked = null;
  for (let i = 0; i < 400 && !locked; i++) {
    drive(trip, 200, (f, t) => t.planFor(f) === 'exit', { step: 2 });
    const f = trip.cur.sections.map((c) => c.fork).find((q) => q && !q.taken && q.branch && q.s > trip.s && q.s - trip.s < J.lock && parkAt(q.node) >= 0 && q.branch.sections.some((c) => c.kind === 'stadt'));
    if (f) locked = { park: PARKS[parkAt(f.node)].name, names: trip.restsAhead(3).map((r) => r.name) };
  }
  ok(names0.join() === order && locked && locked.park === 'Ladepark Würzburg' && !locked.names.includes(locked.park) && locked.names[0] === 'Ladesäule in Würzburg', `Ladeplätze nach Würzburg ${JSON.stringify(names0)}, in der Sperrzone ${JSON.stringify(locked)}`);
  console.log(`Ladestopp Erlensee → Würzburg: ${nr.name} nach ${pm.toFixed(2)} km (${(nr.m / 1000).toFixed(2)} km Straße), Würzburg ${r0.km.toFixed(2)} km ohne, ${r1.km.toFixed(2)} km mit Stopp`);
}

// --- Fahrt 2: Ansagen und Schilder unterwegs nach Köln ---------------------------------
{
  const trip = new Trip({ rng: rng(2) });
  trip.setTarget(G.findPlace('Köln'));
  let last = '';
  let arrived = false;
  drive(trip, 40000, (f, t) => t.planFor(f) === 'exit', {
    onEvent: (e, t) => {
      if (e.type === 'arrive') arrived = true;
      if (e.type !== 'enter' && e.type !== 'fork') return;
      const g = t.guidance();
      const txt = g.type === 'exit' ? `${g.title} in ${(g.dist / 1000).toFixed(1)} km → ${JSON.stringify(g.then)}` : g.type;
      if (txt.replace(/in [\d.]+ km/, '') !== last.replace(/in [\d.]+ km/, '') && !arrived) console.log(`  s=${t.s.toFixed(0)} noch ${g.km?.toFixed(0)} km, ${g.mins?.toFixed(1)} min: ${txt}`);
      last = txt;
    },
  });
  ok(arrived, 'Ankunft in Köln');
  const f = trip.cur.sections.find((c) => c.fork && !c.fork.taken);
  if (f) console.log('  Schild:', JSON.stringify(trip.signs(f.fork)));
}

// --- Fahrt 3: weite Ziele mit Fähre, Autozug und Luftfracht ----------------------------
for (const name of ['Sylt', 'Tokio', 'Key West', 'Valletta', 'Lappland', 'Wyk auf Föhr', 'Dublin', 'Grindelwald']) {
  const trip = new Trip({ rng: rng(3) });
  const pi = G.findPlace(name);
  ok(pi >= 0, 'Ort unbekannt: ' + name);
  trip.setTarget(pi);
  const est = trip.guidance();
  let arrived = false;
  const transits = [];
  let guard = 0;
  while (!arrived && guard++ < 400) {
    drive(trip, 2000, (f, t) => t.planFor(f) === 'exit', { step: 5, check: false, onEvent: (e) => { if (e.type === 'arrive') arrived = true; if (e.type === 'transit') transits.push(e.kind); } });
  }
  ok(arrived, 'Ankunft in ' + name);
  console.log(`${name}: geschätzt ${est.km.toFixed(0)} km / ${est.mins.toFixed(0)} min, gefahren ${trip.km.toFixed(0)} Karten-km auf ${(trip.s / 1000).toFixed(1)} Spiel-km (${(trip.s / 38 / 60).toFixed(0)} min bei 137 km/h)`, transits.length ? '· ' + transits.join(', ') : '');
}

// --- Zufallsfahrten: beliebige Entscheidungen, wechselnde Ziele ------------------------
const runs = Number(process.argv[2] || 30);
let forks = 0;
let arrivals = 0;
let wrong = 0;
const kinds = {};
for (let r = 0; r < runs; r++) {
  const rnd = rng(100 + r);
  const start = Math.floor(rnd() * G.nodes.length);
  const trip = new Trip({ rng: rnd, start });
  const obey = rnd() < 0.5 ? 0.9 : 0.5;
  let nextChange = 0;
  for (let leg = 0; leg < 40; leg++) {
    if (trip.s >= nextChange || trip.target < 0) {
      // neues Ziel: meist in der Nähe
      const d = trip.distances();
      const cand = G.places.map((p) => ({ i: p.i, c: d.toPlace(p.i).cost })).filter((c) => isFinite(c.c)).sort((a, b) => a.c - b.c);
      const pick = cand[Math.min(cand.length - 1, Math.floor(Math.pow(rnd(), 3) * cand.length))];
      trip.setTarget(pick.i);
      nextChange = trip.s + 1500 + rnd() * 9000;
    }
    const log = drive(trip, 2500, (f, t) => (rnd() < obey ? t.planFor(f) === 'exit' : rnd() < 0.5), { step: 2.5, check: leg % 5 === 0 });
    for (const e of log) {
      if (e.type === 'fork') {
        forks++;
        if (e.wrong) wrong++;
      }
      if (e.type === 'arrive') arrivals++;
      if (e.type === 'enter') kinds[e.sec.kind] = (kinds[e.sec.kind] || 0) + 1;
    }
    const g = trip.guidance();
    ok(g.type === 'none' || isFinite(g.km), 'Ansage ohne Entfernung');
    ok(trip.paths().length <= 6, 'zu viele Wege gleichzeitig: ' + trip.paths().length);
    ok(trip.frames.size < 4000, 'Rahmen laufen voll');
  }
}
console.log(`${runs} Zufallsfahrten: ${forks} Gabelungen (${wrong} gegen das Navi), ${arrivals} Ankünfte, Abschnitte`, JSON.stringify(kinds));
console.log('Autobahn im Blick (m):', JSON.stringify(VIEW));
console.log(fails ? `${fails} FEHLER` : 'alles in Ordnung');
process.exit(fails ? 1 : 0);
