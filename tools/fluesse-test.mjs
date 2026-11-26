// Prüft die Flüsse der Orte (src/map/rivers.js) ohne Grafik: node tools/fluesse-test.mjs
// Main in Frankfurt, Rhein in Köln, Elbe in Hamburg – und nur dort. Für jeden: das Band bleibt bis weit in den Dunst im
// geraden Ort; im Wasser und auf der Uferkante steht nichts (Häuser, Plätze, Ladepark, Stele, Blitzer, Säule), auf der
// Brücke nur ihre Laternen; Insel und Zielbrunnen bleiben, wo der Straßenbau sie baut, und kein Brunnen geht
// verloren; der Plan ist für denselben Ort derselbe; die Ortsdurchfahrt ist gerade; der gebaute Fluss
// (kit/river.js) liegt, wo die Rechnung ihn hat (Wasserspiegel, Mauern, nichts über der Fahrbahn); das Band für das
// Loch im Boden (Towns.riverBand) trifft die Ufer auch in einem gescherten Rahmen.
// Die Wahrzeichen am Fluss: Eiserner Steg und Hohenzollernbrücke quer im Strom links neben der Straßenbrücke (ihr
// Flussstück so breit wie der Fluss, ihr Wasser unter seinem, ihr Ufer unter dem Uferweg), der Hafen am jenseitigen
// Ufer der Elbe rechts, zwei Containerbrücken auf dem Kai links – nichts davon berührt Straße, Häuser oder Plätze;
// die Containerbrücken von Bremen, Bremerhaven und Kiel stehen ohne Fluss am Ortsende hinter der rechten Zeile.
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
    const [x0, x1, z0, z1] = L.aabb(it.fp);
    ok(x0 > STREET.curbR + STREET.pave + 10 && -z0 < len && -z1 > len - 120, `${key}: die Containerbrücke steht am Ortsende rechts hinter dem Gehweg (x ab ${x0.toFixed(0)}, u ${(-z1).toFixed(0)}–${(-z0).toFixed(0)})`);
    for (const o of plan.items) {
      if (o === it || GROUND.has(o.name.split(':')[0])) continue;
      const [a0, a1, b0, b1] = L.aabb(o.fp);
      ok(a1 < x0 || a0 > x1 || b1 < z0 || b0 > z1, `${key}: ${o.name} bei u ${(-o.z).toFixed(0)} steht in der Containerbrücke`);
      // vor ihr bleibt die rechte Zeile frei: man sieht sie von der Straße
      if (HOUSES.has(city.info(o.name).kind) && o.x > STREET.curbR) ok(-b0 < -z1 - 30, `${key}: ${o.name} verstellt die Containerbrücke`);
    }
  }
  for (const f of plan.fountains) ok(L.sightBlockers(plan, f).length === 0, `${key}: freie Sicht auf Brunnen ${f.id}`);
}

// Gegenprobe: ein längerer Abschnitt bekäme sein S (die Prüfung oben misst also etwas)
ok(planner.plan({ kind: 'stadt', len: 1600, place: towns[0].p.i }, null, null, { kind: 'stadt', th0: 0 }, null, []).items.length === 2, 'ein 1600 m langer Ort hätte ein sanftes S');

console.log(fails ? `${fails} Fehler in ${checks} Prüfungen` : `Flüsse: alles in Ordnung (${towns.map((t) => `${t.rv.name} in ${t.p.name}, ${((t.rv.ang * 180) / Math.PI).toFixed(1)}°`).join(' · ')}; ${checks} Prüfungen)`);
process.exit(fails ? 1 : 0);
