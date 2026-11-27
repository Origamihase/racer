// Reicht der Akku überall? Prüft das Ladenetz der Karte (src/map/ladenetz.js), die Rasthöfe mit ihren Ladeparks
// (tools/map/rasthoefe.mjs) und auf echten Fahrten, dass OMI immer einen Ladeplatz in Reichweite nennen kann:
//
//     node tools/laden-test.mjs [Anzahl Fahrten]
import * as G from '../src/map/graph.js';
import { Trip, J } from '../src/game/trip.js';
import { PARKS, parkAt } from '../src/map/parks.js';
import { ladenetz, ladeluecken, onRoad, LADENETZ } from '../src/map/ladenetz.js';
import { REISE_AKKU } from '../src/data.js';

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
const need = (r) => (r.m - r.realM) * REISE_AKKU.perM.open + r.realM * REISE_AKKU.perM.real;

// --- 1. Das Netz: zwischen zwei Ladeplätzen nirgends mehr als LADENETZ.max Prozent ------------------------------
const net = ladenetz();
{
  let worst = 0;
  let count = 0;
  for (let s = 0; s < net.N; s++) {
    if (!onRoad(s)) continue;
    count++;
    ok(isFinite(net.ahead[s]), `kein Ladeplatz erreichbar: ${net.name(s)}`);
    ok(net.gap[s] <= LADENETZ.max, `${net.name(s)}: ${net.gap[s].toFixed(0)} % zwischen zwei Ladeplätzen`);
    if (isFinite(net.gap[s])) worst = Math.max(worst, net.gap[s]);
  }
  // über dem Ziel bleiben nur einzelne Stellen ohne geeignete Ausfahrt (ladenetz.js LADENETZ)
  const over = ladeluecken(net);
  ok(over.length <= 16, `${over.length} Stellen über ${LADENETZ.aim} %`);
  console.log(`Ladenetz: ${count} Zustände auf Straßen, schlimmste Stelle ${worst.toFixed(0)} %, über ${LADENETZ.aim} %: ${over.length}`);
  for (const l of over.slice(0, 6)) console.log(`  ${l.gap.toFixed(0)} % ${l.name} (zurück ${l.back.toFixed(0)}, voraus ${l.ahead.toFixed(0)})`);
}

// --- 2. Rasthöfe: geteilte Etappe einer Straße, jeder mit Ladepark -------------------------------------------------
const rast = G.nodes.filter((n) => n.kind === 'rast');
{
  ok(rast.length >= 150, `nur ${rast.length} Rasthöfe`);
  for (const nd of rast) {
    const pk = parkAt(nd.i);
    ok(pk >= 0 && PARKS[pk].rast, `${nd.name}: kein Ladepark`);
    ok(nd.places.length === 0 && /^Rasthof /.test(nd.name), `${nd.name}: Rasthof mit Ort oder ohne Namen`);
    const es = nd.edges.map((de) => G.edges[de >> 1]);
    ok(es.length === 2 && es[0].road === es[1].road && es[0].kind === es[1].kind, `${nd.name}: keine durchgehende Straße`);
    for (const e of es) ok(G.edgeLen(e) > 1500, `${nd.name}: Etappe nur ${G.edgeLen(e)} m`);
    // eine Autobahn läuft durch (der Park hinter der Ausfahrt, danach geradeaus weiter)
    if (es[0].kind === 'ab') for (const de of nd.edges) ok(G.straight(de ^ 1) >= 0, `${nd.name}: die Autobahn endet am Rasthof`);
  }
  const names = new Set(PARKS.map((p) => p.name));
  ok(names.size === PARKS.length, 'Ladeparks: Namen doppelt');
  const land = rast.filter((n) => G.edges[n.edges[0] >> 1].kind === 'land').length;
  console.log(`Rasthöfe: ${rast.length} (${land} an Landstraßen), Ladeparks ${PARKS.length}, davon zusätzlich ${PARKS.filter((p) => p.extra).length}`);
}

/** Fährt dem Navi nach (Spur vor jeder Gabelung wie der Plan), step Meter je Schritt; onStep(trip, events). */
function drive(trip, metres, onStep, step = 5) {
  let x = J.L0;
  const end = trip.s + metres;
  while (trip.s < end) {
    const s = trip.s + step;
    const sec = trip.section;
    if (sec.kind === 'ab') {
      const f = sec.fork;
      if (f && !f.taken && f.s - s < J.decel - 20) x = trip.planFor(f) === 'exit' ? J.L0 : 5.625;
      else if (s - sec.s0 > J.accel) x = 5.625;
    } else x = J.L0;
    const p = trip.profile(s);
    x = Math.min(Math.max(x, p.xmin), p.xmax);
    if (onStep(trip, trip.update(s, x)) === false) return;
  }
}

// --- 3. Der Park eines Rasthofs an der Landstraße liegt an der Straße: geplant halten, ungeplant durchfahren --------
{
  // ein Rasthof an einer Landstraße mit Orten auf beiden Seiten
  const side = (nd, de) => {
    for (let guard = 0; guard < 40; guard++) {
      const n = G.nodes[G.deTo(de)];
      if (n.places.length) return { node: n.i, place: n.places[0].place };
      const nx = n.edges.find((d) => d !== (de ^ 1) && G.edges[d >> 1].kind === 'land');
      if (nx === undefined) return null;
      de = nx;
    }
    return null;
  };
  let pick = null;
  for (const nd of rast) {
    if (G.edges[nd.edges[0] >> 1].kind !== 'land') continue;
    const a = side(nd, nd.edges[0]);
    const b = side(nd, nd.edges[1]);
    if (a && b && a.place !== b.place) {
      pick = { nd, a, b };
      break;
    }
  }
  ok(pick, 'kein Rasthof an einer Landstraße mit Orten auf beiden Seiten');
  if (pick) {
    const pk = parkAt(pick.nd.i);
    const run = (planned) => {
      const trip = new Trip({ rng: rng(7), start: pick.a.node });
      trip.setTarget(pick.b.place);
      const m = { seen: false, park: null, arrive: false, named: false };
      let first = true;
      drive(trip, 400000, (t, evs) => {
        if (first) {
          first = false;
          const r = t.nextRest();
          m.named = !!r && t.restsAhead(4).some((q) => q.park === pk);
          if (planned) t.setStop(pk);
        }
        if (t.paths().some(({ path }) => path.sections.some((c) => c.kind === 'park' && c.park === pk && c.inline))) m.seen = true;
        for (const e of evs) {
          if (e.type === 'park') m.park = { park: e.park ?? e.sec?.park, planned: e.planned };
          if (e.type === 'arrive') m.arrive = true;
        }
        return !m.arrive;
      });
      return m;
    };
    const p = run(true);
    ok(p.named && p.seen && p.park && p.park.planned && p.arrive, `${PARKS[pk].name} geplant: ${JSON.stringify(p)}`);
    const u = run(false);
    ok(u.seen && !u.park && u.arrive, `${PARKS[pk].name} ungeplant durchfahren: ${JSON.stringify(u)}`);
    console.log(`Landstraße: ${G.places[pick.a.place].name} → ${G.places[pick.b.place].name} über ${PARKS[pk].name}: geplant gehalten, ungeplant durchgefahren`);
  }
}

// --- 4. Fahrten kreuz und quer: OMI nennt immer einen Ladeplatz, und er liegt in Reichweite ------------------------
{
  const runs = Number(process.argv[2] || 24);
  // Ziele, die über Straßen erreichbar sind (Inseln hinter Fähre und Luftfracht: dort hält der Wagen an der Säule des Ziels)
  const byRoad = G.places.filter((p) => G.nodes[p.node].edges.some((de) => G.deKind(de) === 'ab' || G.deKind(de) === 'land'));
  // wie das Spiel (akku.js planStop): erreicht der Wagen den nächsten am Weg nicht, nennt OMI den nächsten über Straßen
  const fits = (q) => need(q) <= LADENETZ.max;
  let samples = 0;
  let worst = { pct: 0 };
  let km = 0;
  for (let r = 0; r < runs; r++) {
    const rnd = rng(500 + r);
    const trip = new Trip({ rng: rnd, start: byRoad[Math.floor(rnd() * byRoad.length)].node });
    for (let leg = 0; leg < 3; leg++) {
      const d = trip.distances();
      const cand = byRoad.filter((p) => p.i !== trip.home && isFinite(d.toPlace(p.i).cost));
      trip.setTarget(cand[Math.floor(rnd() * cand.length)].i);
      let arrived = false;
      let next = trip.s;
      drive(trip, 3000000, (t, evs) => {
        for (const e of evs) {
          if (e.type === 'arrive') arrived = true;
        }
        if (t.s >= next) {
          next = t.s + 250;
          samples++;
          const q = t.nextRest(fits);
          ok(q, `${G.places[t.target]?.name}: kein Ladeplatz voraus (${t.section.kind}, ${t.km.toFixed(0)} km)`);
          // über eine Überfahrt (Fähre, Autozug, Luftfracht) hinweg zählt der Akku nicht wie auf der Straße
          const over = q && t.plan().legs.some((L) => L.sec.kind === 'term' && L.s1 > t.s && L.s0 < t.s + q.m);
          if (q && !over) {
            const pct = need(q);
            ok(pct <= LADENETZ.max, `${q.name}: ${pct.toFixed(0)} % bis dorthin (${t.section.kind}, Fahrt ${r})`);
            if (pct > worst.pct) worst = { pct, name: q.name, run: r };
          }
        }
        return !arrived;
      }, 10);
      ok(arrived, `Fahrt ${r}: Ziel ${G.places[trip.target]?.name} nicht erreicht`);
    }
    km += trip.km;
  }
  console.log(`${runs} Fahrten, ${km.toFixed(0)} Reisekilometer, ${samples} Proben: der nächste Ladeplatz höchstens ${worst.pct.toFixed(0)} % entfernt (${worst.name}, Fahrt ${worst.run})`);
}

console.log(fails ? `${fails} FEHLER` : 'alles in Ordnung');
process.exit(fails ? 1 : 0);
