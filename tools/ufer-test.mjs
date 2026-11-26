// Prüft die Flüsse neben der Straße ohne Grafik: node tools/ufer-test.mjs
// Wo die Karte einen Fluss ein Stück weit neben einer Landstraße oder Autobahn zeigt (map/riverside.js), läuft er in der
// Welt neben ihr her (world/xxl/bandplan.js), und die Nahansicht des Navis zeigt dasselbe Wasser (map/roadahead.js) –
// COMMON.md §9. Geprüft wird auf Fahrten durch die Flusstäler (Rheintal links und rechts, Mosel, Inn, Main):
// - Lage: jedes Band samt Bögen im Fenster seines Abschnitts, nicht in der Ruhezone einer Brücke, nicht über einem
//   anderen Band derselben Seite, auf seiner Seite neben dem Asphalt; für denselben Abschnitt dasselbe,
// - Karte: an der Stelle des Bands liegt auf der Karte wirklich dieser Fluss auf dieser Seite neben der Straße,
// - Welt: die Mittellinie läuft ohne Sprung vom Ende des einen Arms bis zum Ende des anderen, die Straße liegt nicht im
//   Wasser, das Wasser ist Wasser (inBand),
// - Navi: auf dem eigenen Weg zeigt die Nahansicht das Band mit beiden Ufern auf der richtigen Seite,
// - und die B9 und die B42 im Rheintal haben ihren Rhein.
const G = await import('../src/map/graph.js');
const { Trip, J } = await import('../src/game/trip.js');
const { NavModel } = await import('../src/map/navroute.js');
const { sectionWater } = await import('../src/map/crossings.js');
const { sectionShores, edgeShores, SHORE } = await import('../src/map/riverside.js');
const { edgeLine, kmPerUnit } = await import('../src/map/mapview.js');
const { waterData } = await import('../src/map/water.js');
const { bandsOf, inBand, centreline, ARM_STATIONS } = await import('../src/world/xxl/bandplan.js');
const { closeScene, setBandReach } = await import('../src/map/roadahead.js');

let fails = 0;
let checks = 0;
const ok = (cond, msg) => {
  checks++;
  if (!cond) {
    fails++;
    if (fails <= 40) console.log('FEHLER:', msg);
  }
};
const built = []; // Bänder für den Bau (4.)
const stat = { trips: 0, sections: 0, bands: 0, navi: 0, kinds: {} };
const byName = (n) => {
  const i = G.places.findIndex((p) => p.name === n);
  if (i < 0) throw new Error('Ort fehlt: ' + n);
  return i;
};

// --- 1. Karte: der Fluss liegt wirklich dort --------------------------------------------------------------------
/** Nächster Abstand (km) und Seite des Flusses ri vom Punkt (x, y) mit Richtung (dx, dy) der Straße. */
function riverSide(ri, x, y, dx, dy) {
  const R = waterData().rivers[ri].pts;
  let best = { d: Infinity, side: 0 };
  for (let j = 0; j + 3 < R.length; j += 2) {
    const vx = R[j + 2] - R[j];
    const vy = R[j + 3] - R[j + 1];
    const l2 = vx * vx + vy * vy || 1;
    const t = Math.max(0, Math.min(1, ((x - R[j]) * vx + (y - R[j + 1]) * vy) / l2));
    const qx = R[j] + vx * t - x;
    const qy = R[j + 1] + vy * t - y;
    const d = Math.hypot(qx, qy);
    if (d < best.d) best = { d, side: qx * -dy + qy * dx >= 0 ? 1 : -1 };
  }
  best.d *= kmPerUnit(y);
  return best;
}
function checkMap(sec, label) {
  const e = G.deEdge(sec.de);
  const P = edgeLine(e.i);
  const A = [0];
  for (let k = 2; k < P.length; k += 2) A.push(A[A.length - 1] + Math.hypot(P[k] - P[k - 2], P[k + 1] - P[k - 1]));
  const len = A[A.length - 1];
  const rev = sec.de & 1;
  for (const q of sectionShores(sec)) {
    // die Mitte des geraden Stücks auf der Karte (Richtung der Kante a → b)
    const sMid = (q.s0 + q.s1) / 2;
    let a = (sMid / sec.len) * len;
    if (rev) a = len - a;
    let k = 0;
    while (k + 2 < A.length && A[k + 1] < a) k++;
    const t = Math.min(1, Math.max(0, (a - A[k]) / (A[k + 1] - A[k] || 1)));
    const x = P[k * 2] + (P[k * 2 + 2] - P[k * 2]) * t;
    const y = P[k * 2 + 1] + (P[k * 2 + 3] - P[k * 2 + 1]) * t;
    let dx = P[k * 2 + 2] - P[k * 2];
    let dy = P[k * 2 + 3] - P[k * 2 + 1];
    if (rev) [dx, dy] = [-dx, -dy];
    const r = riverSide(q.map.ri, x, y, dx, dy);
    ok(r.d < SHORE.near * 1.6 && r.side === q.side, `${label}: Band ${q.name} bei ${sMid.toFixed(0)} m – auf der Karte ${r.d.toFixed(2)} km, Seite ${r.side} statt ${q.side}`);
  }
}

// --- 2. Lage und Welt ------------------------------------------------------------------------------------------
function checkSection(sec, label) {
  const bands = bandsOf(sec);
  if (!bands.length) return;
  stat.sections++;
  // ein neu zugeschnittener Abschnitt (sec.orig) hat seine Bänder vom ursprünglichen
  const base = sec.orig || sec;
  checkMap(base, label);
  const zones = sectionWater(base).map((w) => [base.s0 + w.s - w.zone, base.s0 + w.s + w.zone]);
  for (const b of bands) {
    stat.bands++;
    stat.kinds[sec.kind] = (stat.kinds[sec.kind] || 0) + 1;
    if (!built.some((q) => q.b.key === b.key) && built.filter((q) => q.sec.kind === sec.kind).length < 8) built.push({ sec, b });
    const where = `${label}: ${b.name} ${b.sg > 0 ? 'rechts' : 'links'} bei ${(b.s0 - base.s0).toFixed(0)} m`;
    ok(b.c0 >= base.s0 + SHORE.win - 1e-6 && b.c1 <= base.s1 - SHORE.win + 1e-6, `${where}: reicht aus dem Fenster des Abschnitts (${b.c0.toFixed(0)}…${b.c1.toFixed(0)} in ${base.s0.toFixed(0)}…${base.s1.toFixed(0)})`);
    for (const [z0, z1] of zones) ok(b.c1 < z0 || b.c0 > z1, `${where}: liegt in der Ruhezone einer Brücke`);
    for (const o of bands) if (o !== b && o.sg === b.sg) ok(o.c0 > b.c1 || o.c1 < b.c0, `${where}: überdeckt ein anderes Band`);
    ok(b.s1 - b.s0 >= SHORE.min - 1e-6, `${where}: zu kurz`);
    // die Straße nicht im Wasser, das Wasser im Wasser
    const sm = (b.s0 + b.s1) / 2;
    // beide Richtungsfahrbahnen der Autobahn (ONCOMING(ROAD.right) … ROAD.right), die Landstraße (VIS.land)
    const xs = sec.kind === 'ab' ? [-28.5, -20, -10, 0, 10.5] : [3.25, 7, 11.25];
    for (const x of xs) ok(!inBand(bands, x, sm, 0) && !inBand(bands, x, b.s0, 0) && !inBand(bands, x, b.s1, 0), `${where}: die Fahrbahn liegt im Band (x ${x})`);
    ok(inBand([b], b.xc, sm, 0) && inBand([b], b.xC + b.sg * 500, b.s0 - b.hb, 0) && inBand([b], b.xC + b.sg * 500, b.s1 + b.hb, 0), `${where}: Wasser liegt nicht im Band`);
    ok(b.sg * (b.xc - b.road) >= SHORE.gap + b.hb - 1e-6, `${where}: Ufer zu nah an der Straße`);
    // Mittellinie ohne Sprung, Arme bis in den Dunst
    const C = centreline(b);
    let jump = 0;
    for (let i = 1; i < C.pts.length; i++) jump = Math.max(jump, Math.hypot(C.pts[i].s - C.pts[i - 1].s, C.pts[i].x - C.pts[i - 1].x));
    ok(jump < 260, `${where}: Mittellinie springt (${jump.toFixed(0)} m)`);
    const end = ARM_STATIONS[ARM_STATIONS.length - 1];
    const f = C.pts[0];
    const l = C.pts[C.pts.length - 1];
    ok(Math.abs(b.sg * (f.x - b.xC) - end) < 1e-6 && Math.abs(b.sg * (l.x - b.xC) - end) < 1e-6, `${where}: Arme reichen nicht bis ${end} m`);
    // dasselbe Band für denselben Abschnitt
    const again = sectionShores({ ...base });
    ok(again.some((q) => Math.abs(base.s0 + q.s0 - b.s0) < 1e-6 && q.side === b.sg), `${where}: nicht wiederholbar`);
  }
}

// --- 3. Navi ---------------------------------------------------------------------------------------------------
function navi(trip, label) {
  const sc = closeScene(trip, 2200, 500);
  const av = trip.autobahnView();
  for (const sec of trip.cur.sections) {
    if (sec.s1 < trip.s || sec.s0 > trip.s + 1500 || !trip.visible(sec, trip.cur)) continue;
    if (sec.kind === 'ab' && !(av && av.role === 'cur' && av.secs.includes(sec))) continue;
    for (const b of bandsOf(sec)) {
      if (b.s0 > trip.s + 1200 || b.s1 < trip.s + 20) continue;
      stat.navi++;
      const w = sc.waters.find((q) => q.key === b.key);
      // ein Punkt in der Mitte des geraden Stücks: die Ufer in der Nahansicht auf seiner Seite, um die Breite auseinander
      const d = Math.max(b.s0, trip.s + 20) - trip.s;
      const at = (pts) => {
        let best = null;
        for (let i = 0; i < pts.length; i += 2) if (!best || Math.abs(pts[i] - d) < Math.abs(best[0] - d)) best = [pts[i], pts[i + 1]];
        return best;
      };
      const good = w && (() => {
        const n = at(w.near);
        const f = at(w.far);
        return n && f && Math.sign(n[1] - sc.carX) === b.sg && Math.abs(Math.abs(f[1] - n[1]) - 2 * b.half) < 3;
      })();
      ok(good, `${label}: Navi zeigt den Fluss ${b.name} neben der Straße bei ${d.toFixed(0)} m nicht richtig`);
      // die Arme so weit, wie die Welt sie zeigt (setBandReach), und nichts, was die Welt nicht zeigt
      if (good && stat.navi % 6 === 1) {
        const out = (q) => Math.max(...[...q.near, ...q.far].filter((v, i) => i % 2).map((v) => b.sg * (v - sc.carX)));
        const farO = b.sg * (b.xc - b.road) + b.hb;
        setBandReach((key) => (key === b.key ? [34, 34] : null));
        const sc2 = closeScene(trip, 2200, 500);
        const w2 = sc2.waters.find((q) => q.key === b.key);
        const others = sc2.waters.filter((q) => q.key && q.key.startsWith('U') && q.key !== b.key).length;
        ok(w2 && out(w2) < farO + 34 + 45 && out(w) > farO + 500 && !others, `${label}: Navi folgt der Reichweite der Welt nicht (${w2 ? out(w2).toFixed(0) : '–'} statt bis ${(farO + 34).toFixed(0)}, ${others} fremde)`);
        setBandReach(null);
      }
    }
  }
}

// --- Fahrten ---------------------------------------------------------------------------------------------------
function drive(from, target, label) {
  let sd = 4711;
  const trip = new Trip({ start: from, rng: () => ((sd = (sd * 16807) % 2147483647) / 2147483647) });
  const nav = new NavModel(trip);
  trip.setTarget(target);
  const seen = new WeakSet();
  let x = J.L0;
  let arrived = false;
  for (let n = 0; n < 40000 && !arrived; n++) {
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
    for (const [id] of nav.cache) {
      const sec = nav.secById(id);
      if (!sec || seen.has(sec) || (sec.kind !== 'land' && sec.kind !== 'ab')) continue;
      seen.add(sec);
      checkSection(sec, label);
    }
    if (n % 25 === 0) navi(trip, label);
  }
  stat.trips++;
  ok(arrived, `${label}: kommt nicht an`);
}
const node = (p) => G.places[byName(p)].node;
const RIDES = [
  ['Koblenz', 'Bingen am Rhein'], // B9 links des Rheins
  ['Bingen am Rhein', 'Koblenz'],
  ['Wiesbaden', 'Lahnstein'], // B42 rechts des Rheins
  ['Lahnstein', 'Wiesbaden'],
  ['Koblenz', 'Trier'], // Mosel
  ['Innsbruck', 'Zernez'], // Inn über Landeck
  ['Innsbruck', 'Rattenberg'], // Inn an der A12
  ['Hanau', 'Würzburg'], // Main an der A3
  ['Lörrach', 'Büsingen am Hochrhein'], // Hochrhein
];
for (const [a, b] of RIDES) drive(node(a), byName(b), `${a} → ${b}`);

// die Etappen der Uferstraßen im Rheintal haben ihren Rhein, auf der richtigen Seite
const edgeOf = (a, b) => G.edges.findIndex((e) => (G.nodes[e.a].name === a && G.nodes[e.b].name === b) || (G.nodes[e.a].name === b && G.nodes[e.b].name === a));
for (const [a, b, side] of [['Bad Salzig', 'St. Goar', -1], ['St. Goar', 'Bacharach', -1], ['Lahnstein', 'St. Goarshausen', 1], ['St. Goarshausen', 'Rüdesheim', 1]]) {
  const i = edgeOf(a, b);
  ok(i >= 0, `Kante ${a}–${b} fehlt`);
  if (i < 0) continue;
  const e = G.edges[i];
  // Seite in Richtung a → b der Kante (rechts = +1); die Tabelle gilt flussab, B9 nach Süden: der Rhein liegt links
  const flip = G.nodes[e.a].name === a ? 1 : -1;
  const list = edgeShores(i).list.filter((q) => q.name === 'Rhein');
  const km = list.reduce((m, q) => m + (q.a1 - q.a0), 0) / (edgeShores(i).len || 1);
  ok(km > 0.6 && list.every((q) => q.side * flip === side), `${a}–${b}: Rhein neben der Straße auf ${(km * 100).toFixed(0)} % der Etappe, Seiten ${list.map((q) => q.side * flip).join(',')}`);
}

// --- 4. Bau: Löcher im Boden und Wasser decken sich ----------------------------------------------------------------
// Das Band wird wirklich gebaut (riverbands.js) und update() mit einer ungescherten Spur gerufen: das Wasser liegt in
// den Löchern (sonst deckt es der Boden zu), und jedes Loch ist voll Wasser, Böschung oder Wiese (sonst sähe man durch
// den Boden ins Leere); die Löcher liegen im Band (inBand: kein Baum, keine Szenerie darin). Dazu fremde Straßen vor
// einem Arm, am geraden Stück und an einer Ausfahrt hinter dem Abschnitt, und die Vergabe der Löcher (mergeHoles).
const THREE = await import('three');
const { RiverBands } = await import('../src/world/xxl/riverbands.js');
const { XxlWorld } = await import('../src/world/xxl/world.js');
const { HOLES } = await import('../src/world/xxl/ground.js');
const MAT = { water: new THREE.MeshBasicMaterial(), bank: new THREE.MeshBasicMaterial(), plug: new THREE.MeshBasicMaterial() };
const rb = new RiverBands({ core: { riverWater: MAT.water } }, MAT.bank, MAT.plug);
const inHole = (h, px, pz) => {
  const rx = px - h.x;
  const rz = pz - h.z;
  const across = rx * -h.tz + rz * h.tx;
  const along = rx * h.tx + rz * h.tz - (h.skew || 0) * across;
  return Math.abs(across) < h.half && along > h.r0 && along < h.r1;
};
/** Sichtbare Dreiecke der Gruppe in der Spur (x, z vor der Krümmung, Wagen bei s): [{ kind, a, b, c (je [x, y, z]) }]. */
function trianglesOf(it, s) {
  const out = [];
  it.group.updateMatrixWorld(true);
  for (const m of it.group.children) {
    if (!m.visible) continue;
    const kind = m.material === MAT.water ? 'water' : m.material === MAT.plug ? 'plug' : 'bank';
    const g = m.geometry;
    const P = g.attributes.position.array;
    const I = g.index.array;
    const start = g.drawRange.start;
    const end = Math.min(I.length, start + (Number.isFinite(g.drawRange.count) ? g.drawRange.count : I.length));
    const v = (i) => [P[i * 3] + m.position.x, P[i * 3 + 1], P[i * 3 + 2] + m.position.z + it.group.position.z + s];
    for (let t = start; t + 2 < end; t += 3) out.push({ kind, a: v(I[t]), b: v(I[t + 1]), c: v(I[t + 2]) });
  }
  return out;
}
function cover(tris) {
  const cell = 12;
  const grid = new Map();
  for (const t of tris) {
    if (t.kind === 'plug') continue;
    const xs = [t.a[0], t.b[0], t.c[0]];
    const zs = [t.a[2], t.b[2], t.c[2]];
    for (let i = Math.floor(Math.min(...xs) / cell); i <= Math.floor(Math.max(...xs) / cell); i++) {
      for (let j = Math.floor(Math.min(...zs) / cell); j <= Math.floor(Math.max(...zs) / cell); j++) {
        const k = i + ',' + j;
        if (!grid.has(k)) grid.set(k, []);
        grid.get(k).push(t);
      }
    }
  }
  const sideOf = (p, q, x, z) => (q[0] - p[0]) * (z - p[2]) - (q[2] - p[2]) * (x - p[0]);
  return (x, z) => {
    for (const t of grid.get(Math.floor(x / cell) + ',' + Math.floor(z / cell)) || []) {
      const d1 = sideOf(t.a, t.b, x, z);
      const d2 = sideOf(t.b, t.c, x, z);
      const d3 = sideOf(t.c, t.a, x, z);
      if ((d1 >= -1e-6 && d2 >= -1e-6 && d3 >= -1e-6) || (d1 <= 1e-6 && d2 <= 1e-6 && d3 <= 1e-6)) return true;
    }
    return false;
  };
}
/** Das Band b bauen und mit fremden Straßen roads ([{ x (Achse im Rahmen), s0, s1 }]) für den Wagen bei s stellen. */
function stage(sec, b, s, roads = []) {
  rb.begin();
  rb.need(sec, b.c0, b.c1);
  rb.sweep();
  const shear = new Map([[sec.frame, { a: 0, b: 0 }]]);
  const list = roads.map((r, k) => {
    const frame = { fremd: k };
    shear.set(frame, { a: r.x, b: 0 });
    return { frame, s0: r.s0, s1: r.s1 };
  });
  rb.update(s, shear, list);
  const it = rb.items.get(b.key);
  return { it, holes: rb.holes.filter((h) => h.it === it) };
}
function checkBuilt(sec, b, label, roads) {
  const s = b.s0 - 60;
  const { it, holes } = stage(sec, b, s, roads);
  const where = `${label} ${b.name} ${b.sg > 0 ? 'rechts' : 'links'} (${sec.kind})`;
  ok(it && !it.hidden && holes.length === 3, `${where}: Band nicht zu sehen (${holes.length} Löcher)`);
  if (!it || it.hidden) return it;
  const tris = trianglesOf(it, s);
  // das Wasser in den Löchern
  let wet = 0;
  let dry = 0;
  for (const t of tris) {
    if (t.kind !== 'water') continue;
    const x = (t.a[0] + t.b[0] + t.c[0]) / 3;
    const z = (t.a[2] + t.b[2] + t.c[2]) / 3;
    if (holes.some((h) => inHole(h, x, z))) wet++;
    else dry++;
  }
  ok(wet > 50 && dry === 0, `${where}: ${dry} von ${wet + dry} Wasserflächen unter dem Boden`);
  // jedes Loch voll, und im Band
  const covered = cover(tris);
  let empty = 0;
  let outside = 0;
  let n = 0;
  for (const h of holes) {
    for (let al = h.r0 + 0.6; al < h.r1 - 0.6; al += 2.5) {
      for (let ac = -h.half + 0.6; ac < h.half - 0.6; ac += 2.5) {
        const rx = h.tx * (al + (h.skew || 0) * ac) - h.tz * ac;
        const rz = h.tz * (al + (h.skew || 0) * ac) + h.tx * ac;
        const x = h.x + rx;
        const z = h.z + rz;
        n++;
        if (!covered(x, z)) empty++;
        if (!inBand([b], x, s - z, 0)) outside++;
      }
    }
  }
  ok(n > 500 && empty === 0, `${where}: ${empty} von ${n} Stellen der Löcher ohne Wasser, Böschung oder Wiese`);
  ok(outside === 0, `${where}: ${outside} Stellen der Löcher außerhalb des Bands (inBand)`);
  return it;
}
let builds = 0;
for (const { sec, b } of built) {
  const label = `Bau ${b.key}`;
  checkBuilt(sec, b, label);
  builds++;
  const farO = b.sg * (b.xc - b.road) + b.hb;
  // Achse einer fremden Straße, deren nächste Kante (FOREIGN −31 … 14) q Meter vom Asphaltrand nach außen liegt
  const axis = (q) => (b.sg > 0 ? b.road + q + 31 : b.road - q - 14);
  // vor Arm A, 400 m hinter dem Ende des geraden Stücks: der Arm endet an der Stützstelle 320 mit einer Stirnwand
  const it = checkBuilt(sec, b, label + ' (Arm A gekürzt)', [{ x: axis(farO + 400), s0: b.s0 - 2 * b.hb - 20, s1: b.s0 }]);
  if (it) {
    ok(it.reach[0] === 320 && it.reach[1] === ARM_STATIONS[ARM_STATIONS.length - 1], `${label}: Arm A reicht ${it.reach[0]} m statt 320 m, B ${it.reach[1]} m`);
    ok(it.arms[0].plug.visible && !it.arms[1].plug.visible, `${label}: Stirnwand am gekürzten Arm fehlt`);
  }
  // am geraden Stück zwischen Fluss und Straße: das Band bleibt unsichtbar
  const hid = stage(sec, b, b.s0 - 60, [{ x: axis(farO / 2), s0: b.s0 + 30, s1: b.s0 + 80 }]);
  ok(hid.it.hidden && !hid.holes.length && !hid.it.group.visible, `${label}: fremde Straße am geraden Stück, Band trotzdem zu sehen`);
  // eine Ausfahrt hinter dem Ende des Abschnitts (Rahmen ab der Gabel bei x ≈ 0) stört nicht
  const exit = stage(sec, b, b.s0 - 60, [{ x: 0, s0: b.c1 + 6, s1: b.c1 + 600 }]);
  ok(!exit.it.hidden && exit.holes.length === 3, `${label}: eine Ausfahrt hinter dem Abschnitt blendet das Band aus`);
}
rb.reset();
ok(builds >= 10 && built.some((q) => q.sec.kind === 'ab'), `Bänder gebaut (${builds})`);

// Vergabe der Löcher: je Brücke bzw. Band alle oder keines, die nahen zuerst, nie mehr als HOLES − 1
{
  const items = [];
  const mk = (n, d, band) => {
    const it = { holed: null, group: { visible: true }, hidden: false, band, n };
    items.push(it);
    return Array.from({ length: n }, () => ({ d, it }));
  };
  const bridges = [...mk(1, 10, false), ...mk(1, 20, false), ...mk(1, 60, false)];
  const bands = [...mk(3, 5, true), ...mk(3, 30, true), ...mk(3, 40, true), ...mk(3, 50, true), ...mk(3, 70, true)];
  let shown = 0;
  const ctx = { holeList: [], bridges: { holes: bridges }, bands: { holes: bands, showHoled: () => shown++ } };
  const got = XxlWorld.prototype.mergeHoles.call(ctx);
  const per = new Map();
  for (const h of got) per.set(h.it, (per.get(h.it) || 0) + 1);
  const whole = items.every((it) => (it.holed ? per.get(it) === it.n : !per.has(it)));
  const holed = items.map((it) => (it.holed ? 1 : 0)).join('');
  ok(got.length <= HOLES - 1 && whole && holed === '11011100' && shown === 1, `Löcher vergeben: ${got.length} (${holed}), je Stück ganz: ${whole}`);
}

ok(stat.bands >= 15 && (stat.kinds.ab || 0) >= 2 && (stat.kinds.land || 0) >= 10, `Bänder unterwegs geprüft (${stat.bands}: ${JSON.stringify(stat.kinds)})`);
ok(stat.navi >= 30, `Bänder in der Nahansicht geprüft (${stat.navi})`);
console.log(`Ufer: ${stat.trips} Fahrten, ${stat.sections} Abschnitte, ${stat.bands} Bänder, ${stat.navi} Navi-Blicke; ${checks} Prüfungen`);
if (fails) {
  console.log(`${fails} Fehler`);
  process.exit(1);
}
console.log('alles in Ordnung');
