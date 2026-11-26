// Prüft Brücken und Wasser ohne Grafik: node tools/bruecken-test.mjs
// Was die Karte als Brücke zeigt, ist in der Welt eine – und umgekehrt (COMMON.md §9). Fahrten kreuz und quer durch
// Europa, von jedem Startort aus und zu Zielen nah und fern; an jedem Abschnitt, den das Navi baut (map/navroute.js),
// gilt: Jede Stelle, an der sein Weg über Wasser der Karte führt (map/water.js), ist in der Welt eine Brücke über
// dieses Wasser (map/crossings.js sectionWater), und das Auto der Karte steht genau dann auf dem Strich des Flusses,
// wenn der Wagen über die Mitte der Brücke fährt. Jede Brücke der Welt liegt auf dem Weg der Karte über ihrem Wasser.
// Dazu die Lage der Brücken: im Fenster ihres Abschnitts, nicht übereinander, für denselben Abschnitt dieselben.
const G = await import('../src/map/graph.js');
const { Trip, J } = await import('../src/game/trip.js');
const { NavModel } = await import('../src/map/navroute.js');
const { sectionWater, zubLine, townEdge, BRIDGE } = await import('../src/map/crossings.js');
const { STARTS, startNode } = await import('../src/game/starts.js');
const { checkSection } = await import('./bruecken-check.mjs');

let fails = 0;
let checks = 0;
const ok = (cond, msg) => {
  checks++;
  if (!cond) {
    fails++;
    if (fails <= 40) console.log('FEHLER:', msg);
  }
};

// --- 1. Fahrten ---------------------------------------------------------------------------------------------------
let seed = Number(process.env.BRUECKEN_SEED || 7);
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const stat = { trips: 0, steps: 0, sections: 0, bridges: 0, zub: 0, lakes: 0 };
const kinds = {};
const STEPS = Number(process.env.BRUECKEN_STEPS || 26000);
function drive(start, target, label) {
  let sd = Math.floor(rnd() * 1e6) + 1;
  const trip = new Trip({ start, rng: () => ((sd = (sd * 16807) % 2147483647) / 2147483647) });
  const nav = new NavModel(trip);
  trip.setTarget(target);
  const seen = new WeakSet();
  let x = J.L0;
  let arrived = false;
  let bad = 0;
  const verify = () => {
    for (const [id, c] of nav.cache) {
      if (seen.has(c)) continue;
      seen.add(c);
      const sec = nav.secById(id);
      if (!sec) continue;
      stat.sections++;
      for (const b of sectionWater(sec.orig || sec)) {
        stat.bridges++;
        kinds[sec.kind] = (kinds[sec.kind] || 0) + 1;
        if (b.cls === 3) stat.lakes++;
      }
      const msgs = checkSection(sec, c.pieces);
      for (const m of msgs) if (bad++ < 3) ok(false, `${label}: ${m}`);
      if (!msgs.length) ok(true, '');
    }
  };
  let n = 0;
  for (; n < STEPS && !arrived; n++) {
    const c = trip.section;
    const s = trip.s + (c.kind === 'stadt' ? 4 : c.kind === 'ab' || c.kind === 'land' ? 14 : 6);
    if (c.kind === 'ab') {
      const f = c.fork;
      if (f && !f.taken && f.s - s < J.decel - 20) x = trip.planFor(f) === 'exit' ? J.L0 : 5.625;
      else if (s - c.s0 > J.accel) x = 5.625;
    } else x = J.L0;
    const q = trip.profile(s);
    x = Math.min(Math.max(x, q.xmin), q.xmax);
    for (const e of trip.update(s, x)) if (e.type === 'arrive' && e.place === target) arrived = true;
    nav.update(0.2);
    verify();
  }
  stat.trips++;
  stat.steps += n;
  return arrived;
}
const placesOf = (n) => G.nodes[n].places.map((p) => p.place);
const big = G.places.map((p, i) => i).filter((i) => G.places[i].pop > 150000 && G.places[i].node >= 0);
let arrivedN = 0;
for (const id of STARTS) {
  const st = startNode(id);
  // zwei Ziele je Startort: eine Großstadt und ein beliebiger Ort
  for (const t of [big[Math.floor(rnd() * big.length)], Math.floor(rnd() * G.places.length)]) {
    if (placesOf(st).includes(t)) continue;
    if (drive(st, t, `${id} → ${G.places[t].name}`)) arrivedN++;
  }
}
// Orte mit Wasser auf dem Zubringer: hin und wieder hinaus
const wetTowns = G.places.map((p, i) => i).filter((i) => G.places[i].node >= 0 && (zubLine({ kind: 'zub', place: i, node: G.places[i].node, back: false, park: -1 }) || { list: [] }).list.length);
for (const i of wetTowns.slice(0, 8)) {
  const nb = G.transitions(G.stateOfNode(G.places[i].node)).filter((t) => t.type === 'enter').map((t) => G.deTo(t.de));
  const from = nb.find((n) => G.nodes[n].places.length) ?? nb[0];
  if (from === undefined) continue;
  stat.zub++;
  if (drive(from, i, `${G.nodes[from].name} → ${G.places[i].name} (Zubringer über Wasser)`)) arrivedN++;
}
// Straßen über Seen (Gardasee, Mälaren, Saimaa …): über die ganze Kante zu einem Ort an ihrem Ende
{
  const { edgeWater } = await import('../src/map/crossings.js');
  let lakeTrips = 0;
  for (let i = 0; i < G.edges.length && lakeTrips < 5; i++) {
    const e = G.edges[i];
    if ((e.kind !== 'ab' && e.kind !== 'land') || !edgeWater(i).list.some((q) => q.cls === 3)) continue;
    const a = G.edges[i].a;
    const b = G.edges[i].b;
    const t = G.nodes[b].places.length ? G.nodes[b].places[0].place : -1;
    if (t < 0 || !G.nodes[a]) continue;
    lakeTrips++;
    if (drive(a, t, `${G.nodes[a].name} → ${G.places[t].name} (über einen See)`)) arrivedN++;
  }
  ok(lakeTrips >= 3, `Fahrten über Seen (${lakeTrips})`);
}
ok(stat.trips >= 25 && arrivedN >= stat.trips * 0.6, `Fahrten kommen an (${arrivedN} von ${stat.trips})`);
ok(stat.bridges > 150 && stat.lakes >= 2, `Brücken unterwegs geprüft (${stat.bridges}, davon ${stat.lakes} über Seen)`);

// --- 2. Lage der Brücken auf allen Kanten --------------------------------------------------------------------------
{
  let n = 0;
  let worst = 0;
  for (let i = 0; i < G.edges.length; i++) {
    const e = G.edges[i];
    if (e.kind !== 'ab' && e.kind !== 'land') continue;
    for (const dir of [0, 1]) {
      const de = i * 2 + dir;
      const len = G.edgeLen(e);
      if (!(len > 0)) continue;
      const sec = { kind: e.kind, de, s0: 0, len, s1: len };
      const B = sectionWater(sec);
      const win = BRIDGE.win[e.kind];
      for (let k = 0; k < B.length; k++) {
        n++;
        const b = B[k];
        if (len >= win[0] + win[1] + 2 * b.zone) ok(b.s - b.zone >= Math.min(win[0], len / 2) - 1e-6 && b.s + b.zone <= len - Math.min(win[1], len / 2) + 1e-6, `Kante ${i}: Brücke ${b.name} im Fenster`);
        if (k) ok(b.s - b.zone >= B[k - 1].s + B[k - 1].zone + BRIDGE.gap - 1e-6, `Kante ${i}: Brücken ${B[k - 1].name} und ${b.name} getrennt`);
        ok(Math.abs(b.ang) <= (BRIDGE.deg * Math.PI) / 180 + 1e-9 && b.half > 0 && b.drop > 0, `Kante ${i}: Brücke ${b.name} mit Maßen`);
        worst = Math.max(worst, b.half);
      }
      const B2 = sectionWater({ ...sec });
      ok(B2.length === B.length && B2.every((b, k) => b.s === B[k].s && b.key === B[k].key), `Kante ${i}: dieselben Brücken für denselben Abschnitt`);
    }
  }
  ok(n > 500, `Brücken auf den Kanten (${n}, breiteste ${worst.toFixed(0)} m halb)`);
}

// --- 3. Ortsrand vor dem Wasser --------------------------------------------------------------------------------------
for (const i of wetTowns) {
  const p = G.places[i];
  const E = townEdge(i, p.node);
  const z = zubLine({ kind: 'zub', place: i, node: p.node, back: true, park: -1 });
  ok(!!z && z.P[0] === E.x && z.P[1] === E.y && z.list.length > 0, `${p.name}: der Zubringer zurück beginnt am Ortsrand vor dem Wasser`);
}

console.log(fails ? `${fails} Fehler in ${checks} Prüfungen` : `Brücken: alles in Ordnung (${JSON.stringify({ ...stat, arrived: arrivedN, kinds, wetTowns: wetTowns.length })}; ${checks} Prüfungen)`);
process.exit(fails ? 1 : 0);
