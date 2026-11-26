// Prüft die Flüsse der Orte (src/map/rivers.js) ohne Grafik: node tools/fluesse-test.mjs
// Main in Frankfurt, Rhein in Köln, Elbe in Hamburg – und nur dort. Für jeden: das Band bleibt bis weit in den Dunst im
// geraden Ort; im Wasser und auf der Uferkante steht nichts (Häuser, Plätze, Ladepark, Stele, Blitzer, Säule), auf der
// Brücke nur ihre Laternen; Insel und Zielbrunnen bleiben, wo der Straßenbau sie baut, und kein Brunnen geht
// verloren; der Plan ist für denselben Ort derselbe; die Ortsdurchfahrt ist gerade; der gebaute Fluss
// (kit/river.js) liegt, wo die Rechnung ihn hat (Wasserspiegel, Mauern, nichts über der Fahrbahn); das Band für das
// Loch im Boden (Towns.riverBand) trifft die Ufer auch in einem gescherten Rahmen, und nur der Ort auf dem Weg des
// Wagens zeigt seinen Fluss und schneidet es (Towns.update) – unter der Autobahn, die an einem Flussort vorbeiführt,
// liegt kein Wasser.
// Die Wahrzeichen am Fluss: Eiserner Steg und Hohenzollernbrücke quer im Strom links neben der Straßenbrücke (ihr
// Flussstück so breit wie der Fluss, ihr Wasser unter seinem, ihr Ufer unter dem Uferweg), der Hafen am jenseitigen
// Ufer der Elbe rechts, zwei Containerbrücken auf dem Kai links – nichts davon berührt Straße, Häuser oder Plätze;
// die Containerbrücken von Bremen, Bremerhaven und Kiel stehen ohne Fluss am Ortsende rechts, das Heck über der Straße.
// Die Karte: jeder Fluss liegt fest in dem Winkel zwischen den Autobahnen, den rivers.js nennt, keine Straße der Karte
// berührt ihn, und auf Fahrten von allen Seiten hinein, hinaus und am Ort vorbei ist das Auto der Karte genau dort
// über Wasser, wo der Wagen in der Welt über die Brücke fährt (Abschnitte 6 und 7).
import * as THREE from 'three';

// Minimaler DOM-Ersatz: die Baukästen malen ihre Schilder auf Canvas (hier ohne Bild)
const ctx = new Proxy({}, {
  get(t, k) {
    if (k === 'measureText') return (s) => ({ width: String(s).length * 10 });
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
globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => ctx, style: {} }) };

const { W } = await import('../src/curve.js');
const { createCityKit } = await import('../src/world/kit/city.js');
const L = await import('../src/world/kit/layout.js');
const G = await import('../src/map/graph.js');
const RV = await import('../src/map/rivers.js');
const { RIVER_KIT, pierSpots } = await import('../src/world/kit/river.js');
const { Towns, townPlan, islandOf } = await import('../src/world/xxl/towns.js');
const { camerasOf } = await import('../src/world/xxl/blitzer.js');
const { chargeOf, steleOf, CHARGE } = await import('../src/world/xxl/charge.js');
const { schrankeOf } = await import('../src/world/xxl/schranke.js');
const { postAt } = await import('../src/map/parks.js');
const { MapPlanner } = await import('../src/game/course.js');

const { STREET } = L;
const { RIVER, RIVERS, riverOf, riverOfSec, riverAt, riverCross, riverAlong, riverSpan, riverHits, riverPoly } = RV;
const city = createCityKit(W);

let fails = 0;
let checks = 0;
const ok = (cond, msg) => {
  checks++;
  if (!cond) {
    fails++;
    if (fails <= 40) console.log('FEHLER:', msg);
  }
};
const near = (a, b, eps = 1e-6) => Math.abs(a - b) <= eps;
// so weit zur Seite muss das Band im geraden Ort bleiben (Nebel: ab 1550 m dicht, hier schon zu neun Zehnteln)
const SEEN = 1400;
const HOUSES = new Set(['village', 'shop', 'town', 'city', 'region']);
const GROUND = new Set(['pavement', 'plaza', 'lawn']);
// was an welchem Fluss steht: Bausteine am Wasser (sortiert) und die Meldung in plan.landmarks
const WANT = {
  'Frankfurt am Main': { items: ['eisernerSteg'], marks: [['eisernerSteg', 'river']] },
  'Köln': { items: ['hohenzollernbruecke'], marks: [['hohenzollernbruecke', 'river']] },
  Hamburg: { items: ['containerCrane', 'containerCrane', 'hamburgHafen'], marks: [['hamburgHafen', 'river'], ['containerCrane', 'open']], cranes: 2 },
};
const secOf = (p) => {
  const len = G.townLen(p.pop);
  const spot = G.spotIn(len);
  const sec = { kind: 'stadt', place: p.i, s0: 1000, s1: 1000 + len, len, spotS: 1000 + spot };
  sec.postAt = postAt(p.i, len, spot);
  return sec;
};

// --- 1. Die Rechnung: Maße, Zufall, Umrechnungen ---------------------------------------------------------------------
ok(near(RIVER.axis, (STREET.curbL + STREET.curbR) / 2), 'RIVER.axis ist die Straßenmitte des Ortsplans');
ok(near(RIVER.deck[0], STREET.curbL - STREET.pave) && near(RIVER.deck[1], STREET.curbR + STREET.pave), 'RIVER.deck sind die Außenkanten der Gehwege');
ok(RIVER_KIT.hole > 0 && RIVER_KIT.hole < RIVER_KIT.cope[1] - 0.3, 'der Rand des Lochs im Boden liegt unter der Uferkante');
ok(RIVER_KIT.yTop < 0 && RIVER_KIT.slab < -0.2 && RIVER_KIT.beam[1] > STREET.top, 'Mauer unter dem Boden, Platte unter der Straße, Randbalken über dem Gehweg');
const towns = [];
const WATER = new Map(); // Fluss → sein gebautes Wasser (Abschnitt 3), für den Vergleich mit dem Navi (Abschnitt 6)
for (const key of Object.keys(RIVERS)) {
  const p = G.places.find((q) => q.key === key);
  ok(!!p, `${key} steht auf der Karte`);
  if (!p) continue;
  const len = G.townLen(p.pop);
  ok(len >= RIVER.minLen, `${key} ist lang genug für einen Fluss (${len} m)`);
  const rv = riverOf(key, len);
  ok(!!rv && rv === riverOf(key, len) && Object.isFrozen(rv), `${key}: derselbe, unveränderliche Fluss`);
  if (!rv) continue;
  towns.push({ p, len, rv });
  const deg = (Math.abs(rv.ang) * 180) / Math.PI;
  ok(deg >= RIVER.deg[0] - 1e-9 && deg <= RIVER.deg[1] + 1e-9, `${key}: Winkel ${deg.toFixed(2)}° im Rahmen`);
  ok(rv.name === RIVERS[key].name && rv.half === RIVERS[key].half && rv.x === RIVER.axis && rv.u === RIVER.u, `${key}: Name und Maße`);
  ok(riverOf(key, RIVER.minLen - 50) === null, `${key}: kein Fluss in einer zu kurzen Ortsdurchfahrt`);
  for (const [X, D] of [[0, 0], [300, rv.half], [-1200, -rv.half], [57.5, 13.25]]) {
    const [x, u] = riverAt(rv, X, D);
    ok(near(riverCross(rv, x, u), D, 1e-9) && near(riverAlong(rv, x, u), X, 1e-9), `${key}: riverAt, riverCross und riverAlong passen zusammen`);
  }
  // Band bis weit in den Dunst im Ort (dort ist die Straße gerade, der Fluss also nirgends gestaucht)
  for (const X of [-SEEN, SEEN]) {
    for (const D of [-rv.half - rv.bank, rv.half + rv.bank]) {
      const u = riverAt(rv, X, D)[1];
      ok(u > 0 && u < len, `${key}: das Band liegt ${X} m seitlich noch im Ort (u = ${u.toFixed(0)})`);
    }
  }
  // riverSpan umschließt das Band zwischen zwei seitlichen Lagen genau, riverHits sagt dasselbe für Rechtecke
  const [u0, u1] = riverSpan(rv, -40, 60, rv.bank);
  for (const x of [-40, 10, 60]) {
    const d0 = riverCross(rv, x, u0);
    const d1 = riverCross(rv, x, u1);
    ok(d0 <= -(rv.half + rv.bank) + 1e-9 && d1 >= rv.half + rv.bank - 1e-9, `${key}: riverSpan deckt das Band bei x = ${x}`);
  }
  ok(riverHits(rv, -40, 60, u0 + 1, u0 + 2, rv.bank) && !riverHits(rv, -40, 60, u0 - 20, u0 - 0.01, rv.bank) && !riverHits(rv, -40, 60, u1 + 0.01, u1 + 30, rv.bank), `${key}: riverHits am Rand des Bands`);
  const poly = riverPoly(rv);
  ok(poly.length === 4 && poly.every(([x, u]) => near(Math.abs(riverCross(rv, x, u)), rv.half, 1e-9) && near(Math.abs(riverAlong(rv, x, u)), rv.reach, 1e-9)), `${key}: riverPoly ist der Umriss des Wassers`);
}
ok(towns.length === 3, 'drei Orte haben einen Fluss');
for (const p of G.places) {
  if (RIVERS[p.key]) continue;
  if (riverOf(p.key, 1200) !== null) ok(false, `${p.key} hat einen Fluss, steht aber nicht in RIVERS`);
}
ok(riverOfSec({ kind: 'stadt', place: towns[0].p.i, s0: 0, s1: 1200, start: true }, G.places) === null, 'wo die Fahrt beginnt, fließt kein Fluss');
ok(riverOfSec({ kind: 'land', place: towns[0].p.i, s0: 0, s1: 1200 }, G.places) === null, 'nur Ortsdurchfahrten haben einen Fluss');

// --- 2. Der Plan des Orts: nichts im Wasser, die Brücke frei, Insel und Brunnen bleiben -------------------------------
const planner = new MapPlanner({ graph: G, shapes: {} });
for (const { p, len, rv } of towns) {
  const sec = secOf(p);
  const name = p.name;
  ok(riverOfSec(sec, G.places) === rv, `${name}: riverOfSec findet den Fluss`);
  const plan = townPlan(city, sec);
  const dry = city.planTown(p, { len, mainKind: L.goalKind(p), pavement: false, signs: false, signName: p.name, island: islandOf(sec) });
  ok(plan.river === rv, `${name}: der Plan trägt seinen Fluss`);
  ok(JSON.stringify(plan.items) === JSON.stringify(townPlan(city, sec).items), `${name}: derselbe Plan beim zweiten Mal`);
  const isl = islandOf(sec);
  const main = plan.fountains[0];
  ok(!!isl && main.island && near(main.u, isl.u) && near(main.x, isl.x), `${name}: der Zielbrunnen steht auf der Insel des Straßenbaus`);
  ok(plan.fountains.length === dry.fountains.length, `${name}: kein Brunnen geht durch den Fluss verloren (${plan.fountains.length} statt ${dry.fountains.length})`);
  for (const f of plan.fountains) ok(L.sightBlockers(plan, f).length === 0, `${name}: freie Sicht auf Brunnen ${f.id}`);
  const lamps = { 1: 0, '-1': 0 };
  const marks = [];
  for (const it of plan.items) {
    const info = city.info(it.name);
    const [x0, x1, z0, z1] = L.aabb(it.fp);
    const what = `${name}: ${it.name} bei u ${(-it.z).toFixed(0)}, x ${it.x.toFixed(1)}`;
    if (it.river && info.kind !== 'landmark') {
      // was zum Fluss gehört und kein Wahrzeichen ist: Laternen auf dem Streifen der Brücke
      ok(it.name.startsWith('lamp') && it.x > RIVER.deck[0] && it.x < RIVER.deck[1] && Math.abs(riverCross(rv, it.x, -it.z)) <= rv.half + 1e-6, `${what} ist eine Laterne auf der Brücke`);
      lamps[it.x > rv.x ? 1 : -1]++;
      continue;
    }
    if (info.kind === 'landmark') {
      if (it.river) marks.push(it);
      else ok(!riverHits(rv, x0, x1, -z1, -z0, rv.bank), `${what} steht nicht am Fluss`);
      continue;
    }
    ok(!riverHits(rv, x0, x1, -z1, -z0, 1), `${what} steht nicht im Wasser oder auf der Uferkante`);
    // auf Fahrbahn und Gehweg steht zwischen den Uferwegen nichts als die Laternen der Brücke
    ok(!(it.x > RIVER.deck[0] && it.x < RIVER.deck[1] && Math.abs(riverCross(rv, it.x, -it.z)) < rv.half + rv.bank), `${what} steht nicht auf Brücke oder Uferweg der Straße`);
    if (HOUSES.has(info.kind)) ok(!riverHits(rv, x0, x1, -z1, -z0, rv.bank - 0.01), `${what} lässt den Uferweg frei`);
  }
  ok(lamps[1] >= 4 && lamps[-1] >= 4, `${name}: Laternen auf beiden Seiten der Brücke (${lamps[1]} rechts, ${lamps[-1]} links)`);
  for (const q of plan.squares) {
    const [x0, x1] = q.side > 0 ? [STREET.curbR, STREET.curbR + q.d1] : [STREET.curbL - q.d1, STREET.curbL];
    ok(!riverHits(rv, x0, x1, q.u0, q.u1, rv.bank), `${name}: Platz ${q.kind} bei u ${q.u0}–${q.u1} liegt nicht am Fluss`);
  }
  // --- 2b. Wahrzeichen am Fluss: Grundriss in Flusskoordinaten (sie stehen gedreht wie der Fluss) ------------------
  const want = WANT[p.key];
  ok(marks.map((it) => it.name).sort().join() === want.items.join(), `${name}: am Fluss stehen ${want.items.join(', ')} (statt ${marks.map((it) => it.name).join(', ')})`);
  for (const [nm, slot] of want.marks) ok(plan.landmarks.some((l) => l.name === nm && l.slot === slot && l.placed), `${name}: ${nm} ist als gesetzt gemeldet`);
  const hwDeck = (RIVER.deck[1] - RIVER.deck[0]) / 2;
  const stX = (D) => (D * rv.sin) / rv.cos;
  const others = plan.items.filter((it) => !it.river && !GROUND.has(it.name.split(':')[0]));
  const parts = [];
  for (const it of marks) {
    const info = city.info(it.name);
    const X = riverAlong(rv, it.x, -it.z);
    const D = riverCross(rv, it.x, -it.z);
    const bridge = !!info.river;
    // Kasten des Stücks in Flusskoordinaten [X0, X1, D0, D1]: Brücken liegen quer (Ursprung an der Schauseite zur
    // Straße), Hafen und Containerbrücken stehen mit dem Rücken zum Land
    const box = bridge ? [X - info.d, X, -info.w / 2, info.w / 2] : [X - info.w / 2, X + info.w / 2, D - info.d, D];
    const what = `${name}: ${it.name}`;
    ok(near(bridge ? ((it.ry - rv.ang - Math.PI / 2) % (2 * Math.PI)) : ((it.ry - rv.ang - Math.PI) % (2 * Math.PI)), 0, 1e-9), `${what} ist wie der Fluss gedreht`);
    // die Straße samt Gehwegen bleibt frei: an jeder Lage quer zum Fluss liegt das Stück neben ihr
    for (let d = box[2]; d <= box[3]; d += 2) {
      const left = stX(d) - hwDeck;
      const right = stX(d) + hwDeck;
      ok(box[1] < left - 4 || box[0] > right + 4, `${what} lässt die Straße frei (quer ${d.toFixed(0)} m)`);
    }
    if (bridge) {
      ok(near(D, 0, 1e-6) && near(info.river.half, rv.half) && box[1] < 0, `${what} quert den Fluss links der Straße, sein Flussstück ist so breit wie der Fluss`);
      const water = it.y + info.river.y;
      ok(water < -rv.drop - 0.01 && water > -rv.drop - 0.15, `${what}: sein Wasser liegt knapp unter dem des Flusses (${water.toFixed(2)} m)`);
      // Sichtbarkeit: neben der Straßenbrücke, höchstens 90 m von ihrem Gehweg
      ok(stX(0) - hwDeck - (box[0] + box[1]) / 2 < 90, `${what} steht nah an der Straßenbrücke`);
      // reicht sein Ufer hinter den Uferweg (Rampen der Eisenbahnbrücke), deckt dort auf beiden Ufern Pflaster den
      // Uferblock: vom Gehweg der Straße bis hinter das Stück
      if (box[3] > rv.half + rv.bank) {
        for (const sg of [-1, 1]) {
          const court = plan.riverside.aprons.filter((a) => a.lx < 0 && a.X < box[0] && Math.min(a.D0 * sg, a.D1 * sg) <= rv.half + rv.bank + 1e-9 && Math.max(a.D0 * sg, a.D1 * sg) > box[3]);
          ok(court.length === 1, `${what}: sein Ufer liegt ${sg < 0 ? 'diesseits' : 'jenseits'} unter einem gepflasterten Vorplatz`);
        }
      }
      parts.push({ it, far: false });
    } else if (info.quay) {
      ok(near(D, rv.half + info.quay.d, 1e-6) && box[0] > 0, `${what}: der Kai liegt am jenseitigen Ufer rechts der Straße`);
      const top = it.y + info.quay.y;
      ok(top > 0.02 && top < STREET.top, `${what}: Kaikante knapp über dem Boden (${top.toFixed(2)} m)`);
      ok(it.y + 0.05 < -rv.drop - 0.01 && it.y + 0.05 > -rv.drop - 0.15, `${what}: sein Wasser liegt knapp unter dem des Flusses`);
      ok(plan.riverside.open.some((q) => q.side === 1 && near(q.X0, box[0], 1e-6) && near(q.X1, box[1], 1e-6)), `${what}: Uferkante und Uferweg setzen vor dem Kai aus`);
    } else {
      // Containerbrücke: Schienen 6 und 36 m hinter der Wasserkante, auf dem gepflasterten Kai
      ok(near(D, rv.half + 58, 1e-6) && box[1] < 0 && near(it.y, RIVER_KIT.pave, 1e-9), `${what} steht auf dem Kai am jenseitigen Ufer links der Straße`);
      ok(plan.riverside.aprons.some((a) => a.lx < 0 && a.X <= box[0] && a.D1 >= D && a.D0 <= rv.half + rv.bank), `${what}: unter ihr ist der Kai gepflastert`);
    }
    // kein Haus, kein Platz, kein Baum im Kasten des Stücks an Land (über dem Wasser ragt es frei)
    for (const o of others) {
      const oX = riverAlong(rv, o.x, -o.z);
      const oD = riverCross(rv, o.x, -o.z);
      const r = Math.hypot(o.fp.hw, o.fp.hd);
      const inside = oX + r > box[0] && oX - r < box[1] && oD + r > box[2] && oD - r < box[3] && Math.abs(oD) > rv.half;
      // (Laternen der Straße und Bäume des Uferwegs stehen neben dem Stück, nie darin)
      ok(!inside, `${what}: ${o.name} bei u ${(-o.z).toFixed(0)}, x ${o.x.toFixed(1)} steht in seinem Kasten`);
    }
    for (const q of plan.squares) {
      const [sx0, sx1] = q.side > 0 ? [STREET.curbR + q.d0, STREET.curbR + q.d1] : [STREET.curbL - q.d1, STREET.curbL - q.d0];
      const [bx0, bx1, bz0, bz1] = L.aabb(it.fp);
      ok(sx1 < bx0 || sx0 > bx1 || q.u1 < -bz1 || q.u0 > -bz0, `${what} berührt Platz ${q.kind} bei u ${q.u0}`);
    }
  }
  ok(marks.filter((it) => it.name === 'containerCrane').length === (want.cranes ?? 0), `${name}: ${want.cranes ?? 0} Containerbrücken am Fluss`);
  // die gebaute Brücke: ihr Ufer liegt unter dem Uferweg, ihr Deck über ihm; ihre Bögen stehen im Strom
  for (const { it } of parts) {
    const info = city.info(it.name);
    const g = city.landmarks.build(it.name);
    let bankTop = -Infinity;
    let deckTop = -Infinity;
    g.traverse((o) => {
      if (!o.isMesh) return;
      const a = o.geometry.getAttribute('position');
      for (let i = 0; i < a.count; i++) {
        const ax = Math.abs(a.getX(i));
        const y = a.getY(i) + it.y;
        // (neben der Brücke gemessen: über ihrem Ufer liegen Deck und Treppen)
        if (ax > rv.half + 0.8 && ax < rv.half + 2.6 && Math.abs(a.getZ(i) + info.d / 2) > 12) bankTop = Math.max(bankTop, y);
        if (ax < rv.half - 5) deckTop = Math.max(deckTop, y);
      }
    });
    ok(bankTop < RIVER_KIT.pave - 0.1, `${name}: ${it.name}: sein Ufer liegt unter dem Uferweg (${bankTop.toFixed(2)} m)`);
    ok(deckTop > 5 && deckTop < info.h, `${name}: ${it.name} steht ${deckTop.toFixed(1)} m hoch über der Straße im Strom`);
    city.release(g);
  }

  // was der Straßenbau in den Ort stellt: Ladesäule (vor oder hinter dem Brunnen), Stele, Schranke, Blitzer
  const span = riverSpan(rv, RIVER.deck[0] - 30, RIVER.deck[1] + 30, rv.bank);
  const clear = (u, pad, what) => ok(u + pad < span[0] || u - pad > span[1], `${name}: ${what} bei u ${u.toFixed(0)} steht nicht an der Brücke (${span[0].toFixed(0)}–${span[1].toFixed(0)})`);
  const c = chargeOf(sec);
  if (c) clear(c.u, CHARGE.half, 'der Ladepark');
  const st = steleOf(sec);
  if (st) clear(st.u, 2, 'die Stele');
  const gate = schrankeOf(sec);
  if (gate) clear(gate.u, 5, 'die Schranke');
  for (const before of [true, false]) {
    const pa = postAt(p.i, len, before ? len : 0);
    clear(pa.u, 30, `die Ladesäule (${pa.after ? 'hinter' : 'vor'} dem Brunnen)`);
  }
  for (const cam of camerasOf(sec)) clear(cam.u, 5, 'der Blitzer');
  clear(isl.u, isl.r + 20, 'die Insel des Zielbrunnens');
  ok(isl.u0 > span[1] + 100, `${name}: zwischen Brücke und Brunnenplatz liegen über 100 m`);

  // die Ortsdurchfahrt ist gerade: zwischen den Ruhezonen an Ortsanfang und -ende (course.js CALM) bleibt in 1200 m
  // kein Platz für das sanfte S längerer Abschnitte – in einem Bogen läge das ferne Band innen gestaucht da (curve.js)
  const bends = planner.plan({ kind: 'stadt', len, place: p.i }, null, null, { kind: 'stadt', th0: 0 }, null, []);
  ok(bends.items.length === 0 && bends.net === 0, `${name}: die Ortsdurchfahrt ist gerade`);

  // --- 3. Der gebaute Fluss ----------------------------------------------------------------------------------------
  const town = city.buildTown(plan);
  const river = town.river;
  ok(!!river && river.parent === town, `${name}: der Ort baut seinen Fluss`);
  if (river) {
    ok(near(river.position.x, rv.x) && near(river.position.z, -rv.u) && river.position.y === 0, `${name}: der Fluss hängt an Achse × Straßenmitte`);
    const water = river.children.find((m) => m.name.startsWith('Wasser'));
    const solid = river.children.find((m) => m !== water);
    ok(!!water && !!solid && river.children.length === 2, `${name}: ein Mesh fürs Feste, eines fürs Wasser`);
    WATER.set(rv, water);
    const hw = (RIVER.deck[1] - RIVER.deck[0]) / 2;
    const each = (mesh, fn) => {
      const a = mesh.geometry.getAttribute('position');
      for (let i = 0; i < a.count; i++) {
        const lx = a.getX(i);
        const lu = -a.getZ(i);
        fn(lx, a.getY(i), lx * rv.cos + lu * rv.sin, lu * rv.cos - lx * rv.sin);
      }
    };
    let wOk = true;
    let reach = 0;
    each(water, (lx, y, X, D) => {
      if (!near(y, -rv.drop, 1e-4) || Math.abs(D) > rv.half - rv.wall + 0.03 || Math.abs(D) < rv.half - rv.wall) wOk = false;
      reach = Math.max(reach, Math.abs(X));
    });
    ok(wOk, `${name}: das Wasser liegt ${rv.drop} m unter der Straße zwischen den Mauern`);
    ok(near(reach, rv.reach, 0.01), `${name}: das Wasser reicht ${rv.reach} m nach beiden Seiten`);
    let top = -Infinity;
    let bottom = Infinity;
    let overRoad = -Infinity;
    let inStream = 0;
    let wall = 0;
    each(solid, (lx, y, X, D) => {
      top = Math.max(top, y);
      bottom = Math.min(bottom, y);
      if (Math.abs(lx) < hw - 0.15) overRoad = Math.max(overRoad, y);
      // im Strom steht außer den Pfeilern unter der Brücke nichts
      if (Math.abs(D) < rv.half - 0.5 && Math.abs(lx) > hw + 4) inStream++;
      if (near(Math.abs(D), rv.half - rv.wall, 1e-3) && near(y, RIVER_KIT.yTop, 1e-4)) wall++;
    });
    ok(overRoad <= -0.03 + 1e-6, `${name}: unter Fahrbahn und Gehweg ragt nichts durch (höchstens ${overRoad.toFixed(3)} m)`);
    ok(top < 1.7 && bottom >= -rv.drop - 0.8 - 1e-4, `${name}: Geländer bis ${top.toFixed(2)} m, Mauern bis ${bottom.toFixed(2)} m`);
    ok(inStream === 0, `${name}: im Strom steht nichts außer den Pfeilern (${inStream} Ecken)`);
    ok(wall >= 8, `${name}: Kaimauern an beiden Ufern`);
    ok(pierSpots(rv).length >= 2 && pierSpots(rv).every((D) => Math.abs(D) < rv.half - 20), `${name}: Strompfeiler stehen im Strom, nicht am Ufer`);
    const tris = river.children.reduce((a, m) => a + (m.geometry.index ? m.geometry.index.count : m.geometry.getAttribute('position').count) / 3, 0);
    ok(tris < 12000, `${name}: der Fluss bleibt leicht (${tris} Dreiecke)`);
  }
  city.release(town);

  // --- 4. Das Loch im Boden: Band aus der Matrix des Orts, auch gedreht und gestreckt in einem fremden Rahmen ----------
  for (const [a, b, d0] of [[0, 0, 400], [3.5, 0.06, 900], [-2, -0.11, -250]]) {
    const q = 1 / (1 + b * b);
    const xr = STREET.lane;
    const g = { matrix: new THREE.Matrix4().set(q, 0, -b, xr + a + b * d0 - q * xr, 0, 1, 0, 0, b * q, 0, 1, -d0 - b * q * xr, 0, 0, 0, 1) };
    const self = { band: { on: false, x: 0, z: 0, nx: 0, nz: 1, half: 0, reach: 0, d: 0 } };
    Towns.prototype.riverBand.call(self, g, rv, d0);
    const band = self.band;
    ok(band.on && near(Math.hypot(band.nx, band.nz), 1, 1e-9), `${name}: Band mit Einheitsvektor (Rahmen ${a}/${b})`);
    for (const X of [-900, -20, 0, 350]) {
      for (const sg of [-1, 1]) {
        const at = (D) => {
          const [x, u] = riverAt(rv, X, D);
          const v = new THREE.Vector3(x, 0, -u).applyMatrix4(g.matrix);
          return Math.abs((v.x - band.x) * band.nx + (v.z - band.z) * band.nz);
        };
        ok(near(at(sg * (rv.half + RIVER_KIT.hole)), band.half, 1e-6), `${name}: der Rand des Lochs liegt ${RIVER_KIT.hole} m hinter der Wasserkante (X ${X}, Rahmen ${a}/${b})`);
        ok(at(sg * rv.half) < band.half && at(sg * (rv.half + RIVER_KIT.cope[1])) > band.half, `${name}: Wasser im Loch, Uferkante auf dem Boden (X ${X})`);
      }
    }
    // ein näherer Fluss bleibt stehen, ein fernerer verdrängt ihn nicht
    Towns.prototype.riverBand.call(self, { matrix: new THREE.Matrix4() }, rv, d0 + 5000);
    ok(near(self.band.d, Math.abs(d0 + rv.u)), `${name}: das Band gehört dem nächsten Fluss`);
  }
  // Wasser nur auf dem Weg des Wagens (Towns.update): der Ort am Abzweig zeigt keinen Fluss und schneidet kein Loch –
  // sein Band läge sonst unter der Autobahn, die an ihm vorbeiführt und auf der Karte über Land läuft
  {
    const own = {};
    const g = { matrix: new THREE.Matrix4(), river: {}, visible: false, pending: false, update() {} };
    const it = { sec: { s0: 1000, s1: 1000 + len, frame: 7 }, path: {}, plan: { river: rv }, group: g, hidden: false };
    const self = { kit: { setWater() {} }, items: new Map([['k', it]]), band: { on: true, x: 0, z: 0, nx: 0, nz: 1, half: 0, reach: 0, d: 0 }, riverBand: Towns.prototype.riverBand };
    const shear = new Map([[7, { a: 40, b: 0.2 }]]);
    Towns.prototype.update.call(self, 0, shear, 0, 0, own);
    ok(g.visible && g.river.visible === false && !self.band.on, `${name}: am Abzweig neben dem Weg des Wagens kein Fluss, der Boden bleibt ganz`);
    it.path = own;
    Towns.prototype.update.call(self, 0, shear, 0, 0, own);
    ok(g.river.visible === true && self.band.on && near(self.band.d, 1000 + rv.u), `${name}: auf dem Weg des Wagens fließt er in seinem Loch`);
  }
}

// --- 5. Containerbrücken ohne Fluss: Bremen, Bremerhaven, Kiel ------------------------------------------------------
for (const key of ['Bremen', 'Bremerhaven', 'Kiel']) {
  const p = G.places.find((q) => q.key === key);
  ok(!!p, `${key} steht auf der Karte`);
  if (!p) continue;
  const sec = secOf(p);
  const len = sec.len;
  ok(riverOfSec(sec, G.places) === null, `${key} hat keinen Fluss`);
  const plan = townPlan(city, sec);
  const cranes = plan.items.filter((it) => it.name === 'containerCrane');
  ok(cranes.length === 1 && plan.landmarks.some((l) => l.name === 'containerCrane' && l.slot === 'open' && l.placed), `${key}: eine Containerbrücke, als gesetzt gemeldet`);
  ok(!plan.river && !plan.riverside, `${key}: kein Fluss im Plan`);
  for (const it of cranes) {
    const info = city.info(it.name);
    const [x0, x1, z0, z1] = L.aabb(it.fp);
    const line = STREET.curbR + STREET.pave;
    const rail = it.x + info.rail;
    ok(-z0 < len && -z1 > len - 120 && near(it.ry, -Math.PI / 2), `${key}: die Containerbrücke steht am Ortsende, der Ausleger zeigt von der Straße weg (u ${(-z1).toFixed(0)}–${(-z0).toFixed(0)})`);
    // die Straße ist ihre Kaistraße: Die landseitige Schiene liegt gleich hinter dem rechten Gehweg, ihr Grundriss
    // (Kaiplatte, Schienen, Beine, Ausleger) beginnt an der Häuserflucht, und ihr Heck davor reicht in der Luft über
    // Gehweg und Fahrbahn bis zur linken Bordsteinkante, aber nicht über die linke Zeile. Über der Straße verdeckt es
    // kein Haus: Vom Auto aus sieht man es die ganze Straße entlang
    ok(rail > line + 3 && rail < line + 8, `${key}: die landseitige Schiene der Containerbrücke liegt gleich hinter dem Gehweg (x ${rail.toFixed(1)})`);
    ok(info.overhang > 0 && info.overhang < info.rail - 2 && near(x0, it.x + info.overhang) && x0 >= line - 0.01, `${key}: der Grundriss der Containerbrücke beginnt hinter dem Gehweg (x ${x0.toFixed(1)})`);
    ok(it.x <= STREET.curbL && it.x >= STREET.curbL - STREET.pave, `${key}: das Heck der Containerbrücke reicht über die Fahrbahn, nicht über die linke Zeile (bis x ${it.x.toFixed(1)})`);
    for (const o of plan.items) {
      if (o === it || GROUND.has(o.name.split(':')[0])) continue;
      const [a0, a1, b0, b1] = L.aabb(o.fp);
      const house = HOUSES.has(city.info(o.name).kind);
      // vor ihr bleibt die rechte Zeile frei: man sieht ihre Beine von der Straße
      if (house && o.x > STREET.curbR) ok(-b0 < -z1 - 30, `${key}: ${o.name} verstellt die Containerbrücke`);
      if (b1 < z0 || b0 > z1) continue;
      ok(a1 < x0 || a0 > x1, `${key}: ${o.name} bei u ${(-o.z).toFixed(0)} steht in der Containerbrücke`);
      // unter dem Heck steht nur, was an jeder Straße steht (Laternen, Bäume, Autos) – 30 m unter ihm
      if (a1 > it.x && a0 < x0) ok(!house && o.fp.h < 16, `${key}: ${o.name} bei u ${(-o.z).toFixed(0)} steht unter dem Heck der Containerbrücke`);
    }
  }
  for (const f of plan.fountains) ok(L.sightBlockers(plan, f).length === 0, `${key}: freie Sicht auf Brunnen ${f.id}`);
}

// --- 6. Das Navi zeigt dasselbe Wasser -------------------------------------------------------------------------------
// Eine echte Fahrt in jeden Flussort. Nahansicht (map/roadahead.js closeScene): Das gebaute Wasser der Welt liegt im
// Wasser des Navis, dessen Kanten liegen auf den Kaimauern der Rechnung, die Ortsdurchfahrt kreuzt beide Ufer und der
// Name steht auf dem Wasser. Karte (map/navroute.js riverOnMap): Der Fluss liegt fest auf der Karte, für jede Fahrt
// gleich und für alle drei Orte, im Maßstab 1:1 in dem Winkel zwischen den Autobahnen, den rivers.js nennt – keine
// Straße der Karte berührt ihn. Die Ortsdurchfahrt kreuzt ihn, wo das Auto auf der Karte steht, wenn es in der Welt
// über die Flussachse fährt, im Winkel der Welt; das Auto ist auf der Karte genau so lange über Wasser wie in der Welt
// auf der Brücke; der Zeichner legt ihn unter die Straßen; er bleibt, wenn der Ort hinter dem Auto liegt, und die Karte
// des Abspanns zeigt ihn, wenn die Fahrt durch seinen Ort ging.
{
  const { Trip, J } = await import('../src/game/trip.js');
  const { NavModel, RIVER_MAP, roadGap, riverOnMap, mapRivers, riverTouch } = await import('../src/map/navroute.js');
  const { closeScene, RIVER_SCENE } = await import('../src/map/roadahead.js');
  const { MapPainter, THEMES, PLACE_BY_INDEX, townKm, kmPerUnit, bucketOf, netData } = await import('../src/map/mapview.js');
  const { RIVER_FADE } = await import('../src/map/symbols.js');
  const { STARTS, startPlace } = await import('../src/game/starts.js');
  const { routeKeep, routeRivers } = await import('../src/ui/routemap.js');
  /** Liegt (x, y) im Vieleck P = [x, y, …]? */
  const inside = (P, x, y) => {
    let c = false;
    for (let i = 0, j = P.length - 2; i < P.length; j = i, i += 2) {
      if (P[i + 1] > y !== P[j + 1] > y && x < ((P[j] - P[i]) * (y - P[i + 1])) / (P[j + 1] - P[i + 1]) + P[i]) c = !c;
    }
    return c;
  };
  /** Kreuzt der Linienzug A = [x, y, …] den Linienzug B? */
  const crosses = (A, B) => {
    const side = (ax, ay, bx, by, px, py) => Math.sign((bx - ax) * (py - ay) - (by - ay) * (px - ax));
    for (let i = 0; i + 3 < A.length; i += 2) {
      for (let j = 0; j + 3 < B.length; j += 2) {
        const [a0, a1, a2, a3, b0, b1, b2, b3] = [A[i], A[i + 1], A[i + 2], A[i + 3], B[j], B[j + 1], B[j + 2], B[j + 3]];
        if (side(a0, a1, a2, a3, b0, b1) !== side(a0, a1, a2, a3, b2, b3) && side(b0, b1, b2, b3, a0, a1) !== side(b0, b1, b2, b3, a2, a3)) return true;
      }
    }
    return false;
  };
  // so weit bleibt jede Straße der Karte vom Wasser weg (km): daneben führt der Zubringer um das Ende des Flusses
  const CLEAR_KM = 0.6;
  globalThis.Path2D = class {};
  for (const k of ['moveTo', 'lineTo', 'closePath', 'quadraticCurveTo', 'bezierCurveTo', 'arc', 'ellipse', 'rect', 'addPath']) globalThis.Path2D.prototype[k] = () => {};
  const widths = {};
  for (const { p, rv } of towns) {
    const key = p.key;
    const target = G.places.indexOf(p);
    let seed = 11;
    const trip = new Trip({ rng: () => ((seed = (seed * 16807) % 2147483647) / 2147483647) });
    const nav = new NavModel(trip);
    trip.setTarget(target);
    const inTown = () => trip.section.kind === 'stadt' && trip.section.place === target && !trip.section.start;
    let x = J.L0;
    const step = (ds) => {
      const c = trip.section;
      const s = trip.s + ds;
      if (c.kind === 'ab') {
        const f = c.fork;
        if (f && !f.taken && f.s - s < J.decel - 20) x = trip.planFor(f) === 'exit' ? J.L0 : 5.625;
        else if (s - c.s0 > J.accel) x = 5.625;
      } else x = J.L0;
      const q = trip.profile(s);
      x = Math.min(Math.max(x, q.xmin), q.xmax);
      trip.update(s, x);
      nav.update(0.2);
    };
    for (let n = 0; n < 400000 && !inTown(); n++) step(trip.section.kind === 'stadt' ? 5 : 12);
    ok(inTown(), `${key}: die Fahrt erreicht den Ort`);
    if (!inTown()) continue;
    const sec = trip.section;
    ok(riverOfSec(sec, G.places) === rv, `${key}: die Ortsdurchfahrt der Fahrt hat den Fluss der Rechnung`);
    const s0 = sec.s0;

    // Nahansicht an drei Stellen: vor der Brücke, auf ihr, dahinter (der Fluss liegt dann hinter dem Auto)
    const water = WATER.get(rv);
    ok(!!water, `${key}: das gebaute Wasser liegt zum Vergleich vor`);
    if (!water) continue;
    for (const u of [60, rv.u - 20, rv.u + rv.half + 140]) {
      while (trip.s - s0 < u) step(5);
      const s = trip.s;
      const sc = closeScene(trip, 2200, 500);
      const t = sc.towns.find((q) => q.sec === sec);
      const R = t && t.river;
      ok(!!R && R.name === rv.name, `${key} (u ${u}): die Nahansicht hat den Fluss mit seinem Namen`);
      if (!R) continue;
      ok(R.near.length === RIVER_SCENE.X.length * 2 && R.far.length === R.near.length, `${key} (u ${u}): beide Wasserkanten vollständig`);
      // im eigenen Rahmen ist die Nahansicht der Ortsplan selbst: d = Meter voraus, X = seitliche Lage
      const toTown = (d, X) => [X, d + s - s0];
      for (const [E, D] of [[R.near, -rv.half], [R.far, rv.half]]) {
        for (let i = 0; i < E.length; i += 2) {
          const [tx, tu] = toTown(E[i], E[i + 1]);
          ok(near(riverCross(rv, tx, tu), D, 1e-6), `${key} (u ${u}): Wasserkante des Navis auf der Kaimauer (D ${riverCross(rv, tx, tu).toFixed(3)} statt ${D})`);
          if (i) ok(riverAlong(rv, tx, tu) > riverAlong(rv, ...toTown(E[i - 2], E[i - 1])), `${key} (u ${u}): Wasserkante läuft von links nach rechts`);
        }
        ok(riverAlong(rv, ...toTown(E[0], E[1])) < -800 && riverAlong(rv, ...toTown(E[E.length - 2], E[E.length - 1])) > 800, `${key} (u ${u}): das Wasser reicht weit über den Bildrand`);
      }
      const poly = R.near.slice();
      for (let i = R.far.length - 2; i >= 0; i -= 2) poly.push(R.far[i], R.far[i + 1]);
      // das gebaute Wasser der Welt (kit/river.js) liegt im Wasser des Navis – bis auf den Rand unter der Kaimauer
      const P = water.geometry.attributes.position;
      let seen = 0;
      for (let i = 0; i < P.count; i++) {
        const wx = rv.x + P.getX(i);
        const wu = rv.u - P.getZ(i);
        const X = riverAlong(rv, wx, wu);
        const D = riverCross(rv, wx, wu);
        if (Math.abs(X) > 880) continue;
        seen++;
        const k = Math.abs(D) > rv.half - 0.02 ? (rv.half - 0.02) / Math.abs(D) : 1; // Rand: ein Stück zur Achse hin prüfen
        const [qx, qu] = riverAt(rv, X, D * k);
        ok(Math.abs(D) <= rv.half + 0.5 && inside(poly, qu + s0 - s, qx), `${key} (u ${u}): Wasser der Welt bei X ${X.toFixed(0)}, D ${D.toFixed(1)} liegt im Wasser des Navis`);
      }
      ok(seen >= 8, `${key} (u ${u}): Wasser der Welt geprüft (${seen} Punkte)`);
      for (const X of [-700, -150, 0, 150, 700]) {
        for (const [D, wet] of [[0, true], [rv.half - 1, true], [1 - rv.half, true], [rv.half + 1, false], [-rv.half - 1, false]]) {
          const [qx, qu] = riverAt(rv, X, D);
          ok(inside(poly, qu + s0 - s, qx) === wet, `${key} (u ${u}): X ${X}, D ${D} ist im Navi ${wet ? 'Wasser' : 'Land'}`);
        }
      }
      // die Ortsdurchfahrt läuft als Brücke darüber: ihre Linie kreuzt beide Ufer
      const road = sc.roads.find((q) => q.sec === sec);
      ok(!!road && crosses(road.pts, R.near) && crosses(road.pts, R.far), `${key} (u ${u}): die Ortsdurchfahrt kreuzt beide Ufer`);
      const mk = sc.marks.filter((q) => q.type === 'river');
      ok(mk.length === 1 && mk[0].name === rv.name && inside(poly, mk[0].d, mk[0].X), `${key} (u ${u}): der Name steht einmal, auf dem Wasser`);
      if (mk.length) ok(Math.abs(mk[0].X - RIVER.axis) > (RIVER.deck[1] - RIVER.deck[0]) / 2 + 20, `${key} (u ${u}): der Name steht neben der Brücke`);
    }

    // Karte: der feste Fluss des Orts – dieselbe Liste für jede Fahrt, alle drei Flüsse, wo auch immer der Wagen ist
    const r = riverOnMap(target);
    ok(nav.rivers === mapRivers() && nav.rivers.length === towns.length && nav.rivers.includes(r), `${key}: die Karte hat immer alle Flüsse, auch den dieses Orts`);
    ok(!!r && r.name === rv.name && r.place === target && riverOnMap(target) === r, `${key}: der Fluss der Karte trägt den Namen der Welt, für denselben Ort immer derselbe`);
    if (!r) continue;
    const C0 = PLACE_BY_INDEX[target];
    const perM = 0.001 / kmPerUnit(C0.y);
    const bear = (rv.map.deg * Math.PI) / 180;
    ok(near(r.k, perM, perM * 1e-9) && near(r.half, rv.half * perM, perM * 1e-6), `${key}: der Fluss liegt 1:1 auf der Karte, so breit wie in der Welt`);
    ok(near(r.x, C0.x + Math.sin(bear) * rv.map.km * 1000 * perM, 1e-12) && near(r.y, C0.y - Math.cos(bear) * rv.map.km * 1000 * perM, 1e-12), `${key}: die Brücke liegt ${rv.map.km} km vom Ortspunkt in Richtung ${rv.map.deg}°`);
    ok(near(r.tx, -Math.sin(bear), 1e-12) && near(r.ty, Math.cos(bear), 1e-12) && near(r.reach, rv.map.reach * 1000 * perM, 1e-12), `${key}: die Ortsdurchfahrt läuft über die Brücke zum Ortspunkt, das Wasser reicht ${rv.map.reach} km nach beiden Seiten`);
    ok(near(Math.hypot(r.tx, r.ty), 1, 1e-9) && near(Math.hypot(r.wx, r.wy), 1, 1e-9), `${key}: Richtungen der Karte sind Einheitsvektoren`);
    ok(near(r.wx * r.tx + r.wy * r.ty, rv.sin, 1e-9) && near(-r.ty * r.wx + r.tx * r.wy, rv.cos, 1e-9), `${key}: der Fluss der Karte liegt im Winkel der Welt quer zur Ortsdurchfahrt (rechts +)`);
    const [u0, u1] = riverSpan(rv, RIVER.axis, RIVER.axis);
    ok(near(r.u0, u0) && near(r.u1, u1) && u0 > 100 && u1 < sec.spotS - s0 - 100, `${key}: die Brücke der Karte beginnt und endet, wo die Straße der Welt über Wasser fährt (u ${u0.toFixed(1)} … ${u1.toFixed(1)}), vor dem Brunnen`);
    for (const [name, Q, u] of [['Tor', r.gate, 0], ['äußere Wasserkante', r.near, u0], ['innere Wasserkante', r.far, u1]]) {
      ok(near(Q[0], r.x + r.tx * (u - rv.u) * perM, 1e-12) && near(Q[1], r.y + r.ty * (u - rv.u) * perM, 1e-12), `${key}: ${name} der Karte liegt ${u.toFixed(0)} m hinter dem Ortsbeginn auf der Ortsdurchfahrt`);
    }
    // quer zum Fluss der Karte (voraus +): das Auto ist so lange über Wasser wie in der Welt auf der Brücke
    const at = (u, out = [0, 0]) => (nav.cur.at(nav.cur.aOf(s0 + u), out), out);
    const cross = (Q) => (Q[0] - r.x) * r.wy - (Q[1] - r.y) * r.wx;
    const Cx = at(rv.u);
    ok(near(Cx[0], r.x, 1e-9) && near(Cx[1], r.y, 1e-9), `${key}: der Fluss der Karte kreuzt den Weg, wo das Auto über seine Achse fährt`);
    for (const [u, D] of [[u0, -rv.half], [u1, rv.half], [(u0 + rv.u) / 2, -rv.half / 2], [(u1 + rv.u) / 2, rv.half / 2], [u0 - 40, -rv.half - 40 * rv.cos], [20, (20 - rv.u) * rv.cos]]) {
      ok(near(cross(at(u)) / r.k, D, 0.01), `${key}: bei u ${u.toFixed(0)} steht das Auto auf der Karte ${D.toFixed(0)} m quer zum Fluss wie in der Welt (${(cross(at(u)) / r.k).toFixed(2)})`);
    }
    // hinter der Brücke dehnt die Karte den Rest bis zum Brunnen am Ortspunkt: weiter vom Wasser weg als in der Welt
    ok(cross(at(u1 + 40)) / r.k > rv.half + 40 * rv.cos, `${key}: 40 m hinter der Brücke steht das Auto auf der Karte an Land`);
    const B = at(sec.spotS - s0);
    ok(near(B[0], C0.x, 1e-9) && near(B[1], C0.y, 1e-9), `${key}: am Brunnen steht das Auto auf dem Ortspunkt der Karte`);
    // er bleibt in der Ortsfläche (kein Fluss ohne Stadt im leeren Land) und fern von jeder Straße der Karte
    const R0 = townKm(p.pop) / kmPerUnit(C0.y);
    for (const sg of [-1, 1]) ok(Math.hypot(r.x + r.wx * r.reach * sg - C0.x, r.y + r.wy * r.reach * sg - C0.y) < R0, `${key}: das ${sg < 0 ? 'linke' : 'rechte'} Ende des Flusses liegt in der Ortsfläche`);
    ok(r.reach > r.half * 12, `${key}: der Fluss der Karte ist ein Fluss, kein Teich (${(r.reach / r.half).toFixed(1)} halbe Breiten je Seite)`);
    const net = netData();
    const roads = [...net.lines.filter((l) => l.kind === 'ab' || l.kind === 'land').map((l) => l.pts), ...net.feeders.map((f) => f.pts)];
    ok(roads.length > 400 && !roads.some((P) => riverTouch(P, r, CLEAR_KM * 1000 * perM)), `${key}: keine Autobahn, keine Landstraße und kein Zubringer der Karte kommt dem Fluss näher als ${CLEAR_KM} km`);
    ok(roads.some((P) => riverTouch(P, r, R0)), `${key}: Gegenprobe – mit dem Halbmesser des Orts als Abstand träfe die Prüfung Straßen`);
    widths[rv.name] = r.half / r.k;
    // sein Name: neben der Brücke auf deckendem Wasser, an der Stelle mit dem meisten Platz zwischen den Straßen der Karte
    const gapAt = (t) => Math.min(...[-RIVER_MAP.span, 0, RIVER_MAP.span].map((e) => roadGap(r.x + r.wx * r.reach * (t + e), r.y + r.wy * r.reach * (t + e), r.reach)));
    ok(RIVER_MAP.label.includes(r.label) && RIVER_MAP.label.every((t) => gapAt(t) <= gapAt(r.label) + r.reach * 1e-6), `${key}: der Name steht, wo auf dem Wasser am meisten Platz zwischen den Straßen ist (${r.label})`);
    ok(gapAt(r.label) > 0, `${key}: der Name steht auf keiner Straße der Karte`);

    // der Zeichner legt ihn in die statischen Ebenen: über die Ortsfläche, unter alle Straßen
    const T = THEMES.light;
    const rec = [];
    const cx = new Proxy({}, {
      get(t, k) {
        if (k === 'canvas') return { width: 256, height: 256 };
        if (k === 'measureText') return (q) => ({ width: String(q).length * 7 });
        if (k === 'createLinearGradient') return (...a) => ({ ends: a, stops: [], addColorStop(o, c) { this.stops.push([o, c]); } });
        if (k === 'fill') return () => rec.push(['fill', t.fillStyle]);
        if (k === 'stroke') return () => rec.push(['stroke', t.strokeStyle]);
        return k in t ? t[k] : () => {};
      },
      set: (t, k, v) => ((t[k] = v), true),
    });
    const painter = new MapPainter({ theme: 'light', look: 'navi' });
    const scale = 3000;
    const tile = () => ((rec.length = 0), painter.renderStatic(cx, r.x - 128 / scale, r.y - 128 / scale, scale, 256, 256, 1, bucketOf(scale)));
    tile();
    ok(!rec.some((q) => q[1] && q[1].stops), `${key}: ohne setRivers zeichnet die Karte keinen Fluss`);
    painter.tiles.set('alt', { canvas: { width: 1, height: 1 }, used: 0 });
    painter.lv[0] = { b: 1 };
    painter.setRivers(nav.rivers);
    ok(painter.tiles.size === 0 && painter.lv[0].stale === true, `${key}: ein neuer Fluss lässt die Ebenen der Karte neu entstehen`);
    painter.tiles.set('neu', { canvas: { width: 1, height: 1 }, used: 0 });
    painter.setRivers(nav.rivers);
    painter.setRivers(nav.rivers.slice());
    ok(painter.tiles.size === 1, `${key}: dieselben Flüsse lassen die Kacheln stehen`);
    tile();
    const iw = rec.findIndex((q) => q[0] === 'fill' && q[1] && q[1].stops);
    const g = iw >= 0 ? rec[iw][1] : null;
    ok(!!g && rec.filter((q) => q[1] && q[1].stops).length === 1, `${key}: die Karte füllt den Fluss einmal`);
    if (g) {
      ok(g.stops.length === 4 && g.stops[1][1] === T.sea && g.stops[2][1] === T.sea && g.stops[0][1] === T.sea + '00' && near(g.stops[1][0], RIVER_FADE), `${key}: Wasser in der Farbe der Karte, an den Enden auslaufend`);
      ok(near(g.ends[0], r.x - r.wx * r.reach, 1e-12) && near(g.ends[3], r.y + r.wy * r.reach, 1e-12), `${key}: der Zeichner zeichnet den Fluss des Navis`);
      const roadInk = new Set([T.road, T.roadCase, T.hwy, T.hwyCase]);
      const firstRoad = rec.findIndex((q) => q[0] === 'stroke' && roadInk.has(q[1]));
      const lastTown = rec.map((q) => q[0] === 'fill' && q[1] === T.town).lastIndexOf(true);
      ok(firstRoad > iw, `${key}: der Fluss liegt unter allen Straßen der Karte (${iw} vor ${firstRoad})`);
      ok(lastTown >= 0 && lastTown < iw, `${key}: der Fluss liegt über der Ortsfläche`);
    }

    // weiter, bis der Ort hinter dem Auto aus dem Weg fällt: Der Fluss bleibt auf der Karte, er ist Landschaft
    for (let n = 0; n < 40000 && trip.cur.sections.includes(sec); n++) step(trip.section.kind === 'stadt' ? 5 : 12);
    ok(!trip.cur.sections.includes(sec), `${key}: der Ort fällt hinter dem Auto aus dem Weg`);
    ok(nav.rivers === mapRivers() && nav.rivers.includes(r), `${key}: hinter dem Ort zeigt die Karte seinen Fluss weiter`);
    // die Karte des Abspanns (ui/routemap.js): wer durch den Ort fuhr, sieht dort seinen Fluss – und nur den
    const drawn = routeRivers(routeKeep({ secs: [{ kind: 'zub', place: sec.place }, { kind: 'stadt', place: sec.place }] }));
    ok(drawn.length === 1 && drawn[0] === r, `${key}: die Karte des Abspanns zeigt den Fluss des durchfahrenen Orts`);
  }
  ok(routeRivers(routeKeep({ secs: [{ kind: 'stadt', place: G.places.findIndex((q) => q.key === 'Bremen') }, { kind: 'ab', place: -1 }] })).length === 0, 'eine Fahrt ohne Flussort: die Karte des Abspanns zeigt keinen Fluss');
  ok(widths.Rhein > widths.Main && widths.Elbe > widths.Main, 'Rhein und Elbe sind auf der Karte breiter als der Main');
  const far = RIVER_MAP.label.map(Math.abs);
  ok(Math.min(...far) - RIVER_MAP.span > 0.15 && Math.max(...far) + RIVER_MAP.span < 1 - 2 * RIVER_FADE + 0.1, 'Flussnamen der Karte stehen neben dem Weg und auf deckendem Wasser');
  ok(near(roadGap(1e6, 1e6, 0.5), 0.5), 'roadGap misst höchstens bis zur Grenze');
  ok(!STARTS.some((id) => riverOnMap(startPlace(id))), 'kein Startort hat einen Fluss (die Startszene baut keinen, die Karte zeigte dort sonst einen)');
  // riverTouch: Punkt im Wasser, Strecke quer hindurch, Strecke am Ende vorbei, Abstand
  {
    const r = mapRivers()[0];
    const P = (X, D) => [r.x + r.wx * X + r.wy * D, r.y + r.wy * X - r.wx * D];
    ok(riverTouch(P(0, 0), r) && riverTouch([...P(0, -3 * r.half), ...P(0, 3 * r.half)], r) && riverTouch([...P(-2 * r.reach, 0), ...P(2 * r.reach, 0)], r), 'riverTouch: Punkt im Wasser, Strecke quer und längs hindurch');
    ok(!riverTouch([...P(r.reach * 1.01, -3 * r.half), ...P(r.reach * 1.01, 3 * r.half)], r) && !riverTouch([...P(-r.reach, 1.5 * r.half), ...P(r.reach, 1.5 * r.half)], r), 'riverTouch: am Ende vorbei und am Ufer entlang berührt nichts');
    ok(riverTouch([...P(r.reach * 1.01, -3 * r.half), ...P(r.reach * 1.01, 3 * r.half)], r, r.reach * 0.02) && riverTouch([...P(-r.reach, 1.5 * r.half), ...P(r.reach, 1.5 * r.half)], r, r.half), 'riverTouch: mit Abstand zählt die Nähe');
  }

  // --- 7. Das Auto ist auf der Karte genau dort über Wasser, wo die Welt Wasser hat -----------------------------------
  // Fahrten in jeden Flussort von allen Seiten (jede Straße an seinem Knoten, mindestens vier Richtungen) und wieder
  // hinaus in drei Richtungen, dazu Fahrten über seinen Knoten hinweg zu einem anderen Ziel und eine mit neuem Ziel
  // mitten auf dem Zubringer. Alle paar Meter: Liegt das Auto der Karte (NavModel.pose) im Wasser irgendeines Flusses,
  // fährt der Wagen in der Welt gerade über die Brücke dieses Flusses – und umgekehrt. Dazu: kein Stück des Wegs auf
  // Autobahn oder Landstraße kommt einem Fluss nahe, und ein Navi, das erst mitten im Ort entsteht, zeigt dasselbe.
  {
    const rivers = mapRivers();
    const EDGE = 1.5; // Meter um die Wasserkante, in denen die Probe nichts behauptet (Schrittweite, Spur des Wagens)
    const wetOnMap = (P) => rivers.filter((r) => Math.abs((P.x - r.x) * r.wx + (P.y - r.y) * r.wy) < r.reach && Math.abs((P.x - r.x) * r.wy - (P.y - r.y) * r.wx) < r.half);
    const neighbours = (n) => G.transitions(G.stateOfNode(n)).filter((t) => t.type === 'enter').map((t) => G.deTo(t.de));
    let all = 0;
    let wetAll = 0;
    for (const { p, rv } of towns) {
      const key = p.key;
      const target = G.places.indexOf(p);
      const r = riverOnMap(target);
      // Startknoten: hinter jeder Straße am Knoten der nächste Knoten mit einem Ort
      const starts = [];
      for (const n of neighbours(p.node)) {
        let m = n;
        for (let hop = 0; hop < 4 && !G.nodes[m].places.length; hop++) {
          const nx = neighbours(m).filter((q) => q !== p.node && !starts.includes(q));
          if (!nx.length) break;
          m = nx[0];
        }
        if (G.nodes[m].places.length && m !== p.node && !starts.includes(m)) starts.push(m);
      }
      ok(starts.length >= 4, `${key}: Fahrten aus mindestens vier Richtungen (${starts.map((n) => G.nodes[n].name).join(', ')})`);
      const drive = (from, to, mode) => {
        const name = `${key} (${G.nodes[from].name} → ${mode === 'vorbei' ? '' : key + ' → '}${G.nodes[to].name}${mode === 'neu' ? ', neues Ziel auf dem Zubringer' : ''})`;
        const away = G.nodes[to].places[0].place;
        let seed = 11;
        const trip = new Trip({ start: from, rng: () => ((seed = (seed * 16807) % 2147483647) / 2147483647) });
        const nav = new NavModel(trip);
        trip.setTarget(mode === 'vorbei' ? away : target);
        let x = J.L0;
        let town = null;
        let end = Infinity;
        let bad = 0;
        let wet = 0;
        let n = 0;
        let fresh = mode === 'hin';
        let swapped = false;
        let lastWet = false;
        for (; n < 60000 && trip.s < end; n++) {
          const c = trip.section;
          const s = trip.s + (c.kind === 'stadt' ? 2 : c.kind === 'ab' || c.kind === 'land' ? 6 : 3);
          if (c.kind === 'ab') {
            const f = c.fork;
            if (f && !f.taken && f.s - s < J.decel - 20) x = trip.planFor(f) === 'exit' ? J.L0 : 5.625;
            else if (s - c.s0 > J.accel) x = 5.625;
          } else x = J.L0;
          const q = trip.profile(s);
          x = Math.min(Math.max(x, q.xmin), q.xmax);
          for (const e of trip.update(s, x)) {
            if ((e.type === 'arrive' || e.type === 'pass') && e.place === (mode === 'vorbei' ? away : target) && end === Infinity) {
              trip.setTarget(away);
              end = trip.s + (mode === 'vorbei' ? 500 : 9000);
            }
          }
          nav.update(0.2);
          const sec = trip.section;
          if (!town && sec.kind === 'stadt' && sec.place === target && riverOfSec(sec, G.places)) town = sec;
          if (mode === 'neu' && !swapped && sec.kind === 'zub' && !sec.back && sec.place === target && trip.s - sec.s0 > 200) {
            // neues Ziel mitten auf dem Zubringer: der Weg unter dem Auto entsteht ab hier neu
            swapped = true;
            trip.setTarget(away);
          }
          const u = town && sec === town ? trip.s - town.s0 : NaN;
          const D = Math.abs(riverCross(rv, RIVER.axis, u));
          if (Math.abs(D - rv.half) < EDGE * rv.cos) continue;
          const world = D < rv.half;
          const onMap = wetOnMap(nav.pose);
          if (onMap.length !== (world ? 1 : 0) || (world && onMap[0] !== r)) {
            if (!bad++) ok(false, `${name}: bei ${sec.kind} ${(trip.s - sec.s0).toFixed(0)}/${sec.len} ist die Karte ${onMap.length ? 'im Wasser (' + onMap.map((o) => o.name).join(', ') + ')' : 'an Land'}, die Welt ${world ? 'über Wasser' : 'an Land'}`);
          }
          if (world) wet++;
          if (fresh && (u > 100 || (fresh === 1 && u > rv.u))) {
            // ein Navi, das erst jetzt entsteht (vor der Brücke, dann mitten auf ihr), steht an derselben Stelle der Karte
            const nav2 = new NavModel(trip);
            nav2.update(0);
            ok(near(nav2.pose.x, nav.pose.x, r.k * 0.01) && near(nav2.pose.y, nav.pose.y, r.k * 0.01), `${name}: ein neu entstandenes Navi steht ${fresh === 1 ? 'auf' : 'vor'} der Brücke an derselben Stelle`);
            fresh = fresh === 1 ? false : 1;
            if (fresh && u > rv.u) fresh = false;
          }
          lastWet = world;
        }
        all += n;
        wetAll += wet;
        ok(end < Infinity && n < 60000, `${name}: die Fahrt kommt an und führt weiter (${n} Proben)`);
        ok(!lastWet, `${name}: die Fahrt endet an Land`);
        // am Ort vorbei führt kein Wasser – außer die Landstraße endet in ihm und die Fahrt führt hindurch (Hamburg, B73)
        if (mode === 'vorbei' && !town) ok(wet === 0, `${name}: am Ort vorbei führt kein Wasser`);
        else ok(wet * 2 > (2 * rv.half) / rv.cos - 2 * EDGE - 4 && !!town, `${name}: die Brücke wird in der Welt und auf der Karte gefahren (${wet} Proben über Wasser)`);
        // Autobahn und Landstraße des Wegs bleiben dem Wasser fern (die Karte zeichnet sie als Straßen)
        for (const c of trip.cur.sections) {
          const cc = nav.cache.get(c.id);
          if (!cc || (c.kind !== 'ab' && c.kind !== 'land')) continue;
          for (const piece of cc.pieces) ok(!rivers.some((o) => riverTouch(piece.pts, o, o.half)), `${name}: ${c.kind} bei s ${c.s0} bleibt dem Wasser fern`);
        }
      };
      for (let i = 0; i < starts.length; i++) {
        drive(starts[i], starts[(i + 1) % starts.length], 'hin');
        drive(starts[i], starts[(i + 2) % starts.length], 'weiter');
        drive(starts[i], starts[i], 'zurück');
        drive(starts[i], starts[(i + Math.ceil(starts.length / 2)) % starts.length], 'vorbei');
      }
      drive(starts[0], starts[1], 'neu');
    }
    ok(all > 100000 && wetAll > 2000, `Flussfahrten geprüft (${all} Proben, ${wetAll} über Wasser)`);
  }
}

// Gegenprobe: ein längerer Abschnitt bekäme sein S (die Prüfung oben misst also etwas)
ok(planner.plan({ kind: 'stadt', len: 1600, place: towns[0].p.i }, null, null, { kind: 'stadt', th0: 0 }, null, []).items.length === 2, 'ein 1600 m langer Ort hätte ein sanftes S');

console.log(fails ? `${fails} Fehler in ${checks} Prüfungen` : `Flüsse: alles in Ordnung (${towns.map((t) => `${t.rv.name} in ${t.p.name}, ${((t.rv.ang * 180) / Math.PI).toFixed(1)}°`).join(' · ')}; ${checks} Prüfungen)`);
process.exit(fails ? 1 : 0);
