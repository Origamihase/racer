// Prüft die Landschaft (src/map/landscape.js und was daraus folgt) ohne Grafik: node tools/landschaft-test.mjs
// 1. Die Daten packen sich aus und stimmen mit der Erde überein: die Alpen hoch, die Norddeutsche Tiefebene flach, der
//    Schwarzwald bewaldet, Frankfurt bebaut, die Magdeburger Börde Acker.
// 2. Die Karte malt so viel Wald, wie WorldCover hat (FOREST_T in landpaint.js), und Siedlungsfläche nicht mehr als dort.
// 3. Die Welt neben der Straße (world/xxl/landcover.js, fieldplan.js) folgt der Karte: auf Fahrten durch Deutschland
//    sind die Läufe lückenlos, lang genug und für denselben Abschnitt dieselben; Felder liegen nur an Landstraßen und
//    Zubringern, nur in Ackerläufen, nie auf Brücken oder an den Enden des Abschnitts, und überlappen sich nicht.
// 4. Der Horizont (map/skyline.js): vor München die Alpen im Süden, im Breisgau der Schwarzwald im Osten, in Hamburg
//    flach; Schnee nur, wo die Gipfel hoch genug sind.
const G = await import('../src/map/graph.js');
const { loadLandscape, heightAt, coverAt, landscapeReady } = await import('../src/map/landscape.js');
const { coverMask } = await import('../src/map/landpaint.js');
const { sectionCover, COVER, KINDS } = await import('../src/world/xxl/landcover.js');
const { fieldsOf, CROPS, FIELD } = await import('../src/world/xxl/fieldplan.js');
const { bridgesOf } = await import('../src/world/xxl/bridgeplan.js');
const { skyline, ringAt } = await import('../src/map/skyline.js');
const { Trip, J } = await import('../src/game/trip.js');

let fails = 0;
let checks = 0;
const ok = (cond, msg) => {
  checks++;
  if (!cond) {
    fails++;
    if (fails <= 40) console.log('FEHLER:', msg);
  }
};
const RAD = Math.PI / 180;
const at = (lat, lon) => ({ x: lon, y: -Math.log(Math.tan(Math.PI / 4 + (lat * RAD) / 2)) / RAD });
const DEG = 180 / Math.PI;

// --- 1. Daten --------------------------------------------------------------------------------------------------
ok(!landscapeReady() && heightAt(11, -55) === 0, 'vor dem Laden schon Daten');
const t0 = Date.now();
await loadLandscape();
const tLoad = Date.now() - t0;
ok(landscapeReady(), 'Landschaft nicht geladen');
const h = (lat, lon) => heightAt(at(lat, lon).x, at(lat, lon).y);
const cov = (lat, lon) => coverAt(at(lat, lon).x, at(lat, lon).y, {});
ok(h(47.42, 10.98) > 1800, `Zugspitze nur ${h(47.42, 10.98).toFixed(0)} m`);
ok(h(46.55, 7.98) > 2500, `Jungfrau nur ${h(46.55, 7.98).toFixed(0)} m`);
ok(h(53.55, 10.0) < 60, `Hamburg ${h(53.55, 10.0).toFixed(0)} m hoch`);
ok(h(47.87, 8.0) > 900, `Schwarzwald (Feldberg) nur ${h(47.87, 8.0).toFixed(0)} m`);
ok(h(54.5, 3.0) === 0, 'Nordsee hat eine Höhe');
ok(cov(48.3, 8.2).forest > 0.5, `Schwarzwald kaum Wald (${cov(48.3, 8.2).forest.toFixed(2)})`);
ok(cov(50.11, 8.68).urban > 0.5, `Frankfurt kaum bebaut (${cov(50.11, 8.68).urban.toFixed(2)})`);
ok(cov(52.0, 11.4).crop > 0.5, 'Magdeburger Börde kein Acker');
ok(cov(46.5, 8.0).rock > 0.2, 'Berner Alpen ohne Fels und Eis');
ok(cov(52.0, 11.4).forest < 0.3, 'Magdeburger Börde bewaldet');

// --- 2. Karte: Wald und Siedlung wie in WorldCover -------------------------------------------------------------
let raw = 0;
let mask = 0;
let ur = 0;
let um = 0;
let n = 0;
const m = {};
const o = {};
for (let lat = 47.5; lat < 54.5; lat += 0.031) {
  for (let lon = 6.5; lon < 14.5; lon += 0.043) {
    const p = at(lat, lon);
    coverMask(p.x, p.y, m);
    if (!m.data) continue;
    coverAt(p.x, p.y, o);
    raw += o.forest;
    mask += m.forest;
    ur += o.urban;
    um += m.urban;
    n++;
  }
}
raw /= n;
mask /= n;
ur /= n;
um /= n;
ok(Math.abs(mask - raw) < 0.06, `Karte malt ${(mask * 100).toFixed(1)} % Wald, WorldCover hat ${(raw * 100).toFixed(1)} %`);
ok(raw > 0.25 && raw < 0.45, `Waldanteil Deutschlands ${(raw * 100).toFixed(1)} % (erwartet rund ein Drittel)`);
ok(um <= ur * 1.3 && um > ur * 0.4, `Karte malt ${(um * 100).toFixed(1)} % Siedlung, WorldCover hat ${(ur * 100).toFixed(1)} %`);

// --- 3. Welt neben der Straße ----------------------------------------------------------------------------------
const byName = (name) => {
  const i = G.places.findIndex((p) => p.name === name);
  if (i < 0) throw new Error('Ort fehlt: ' + name);
  return i;
};
const stat = { trips: 0, secs: 0, km: 0, kinds: { wiese: 0, feld: 0, wald: 0, dorf: 0 }, fields: 0, fieldKm: 0, crops: new Set() };
const seen = new WeakSet();
function checkSection(sec) {
  const len = sec.s1 - sec.s0;
  const c = sectionCover(sec);
  if (!c) return;
  stat.secs++;
  if (process.env.LDBG) console.log(sec.kind, sec.de, Math.round(len), JSON.stringify(c).slice(0, 200));
  stat.km += len / 1000;
  ok(sectionCover(sec) === c, `${sec.kind} ${sec.de}: Plan nicht zwischengespeichert`);
  // ein frischer Abschnitt mit denselben Daten plant dasselbe
  const twin = sectionCover({ ...sec });
  ok(JSON.stringify(twin) === JSON.stringify(c), `${sec.kind} ${sec.de}: Plan hängt nicht nur an der Lage`);
  for (const side of ['left', 'right']) {
    const R = c[side];
    ok(R.length > 0 && Math.abs(R[0][0]) < 1e-6 && Math.abs(R[R.length - 1][1] - len) < 1e-3, `${sec.kind} ${sec.de} ${side}: Läufe decken den Abschnitt nicht`);
    for (let i = 0; i < R.length; i++) {
      const [a, b, k] = R[i];
      ok(KINDS.includes(k), `unbekannte Art ${k}`);
      if (i) ok(Math.abs(R[i - 1][1] - a) < 1e-6 && R[i - 1][2] !== k, `${sec.kind} ${sec.de} ${side}: Lücke oder Doppel bei ${a.toFixed(0)} m`);
      if (R.length > 1) ok(b - a >= COVER.min[k] - 1e-6, `${sec.kind} ${sec.de} ${side}: ${k} nur ${(b - a).toFixed(0)} m lang`);
      stat.kinds[k] += (b - a) / 1000;
    }
  }
  const F = fieldsOf(sec);
  ok(fieldsOf(sec) === F, `${sec.kind} ${sec.de}: Felder nicht zwischengespeichert`);
  if (sec.kind !== 'land' && sec.kind !== 'zub') {
    ok(F.length === 0, `Felder an ${sec.kind}`);
    return;
  }
  ok(JSON.stringify(fieldsOf({ ...sec })) === JSON.stringify(F), `${sec.kind} ${sec.de}: Felder hängen nicht nur an der Lage`);
  const B = bridgesOf(sec);
  for (const f of F) {
    stat.fields++;
    stat.fieldKm += (f.s1 - f.s0) / 1000;
    stat.crops.add(CROPS[f.crop].name);
    ok(f.s0 >= sec.s0 + FIELD.ends - 1e-6 && f.s1 <= sec.s1 - FIELD.ends + 1e-6, `${sec.kind} ${sec.de}: Feld am Ende des Abschnitts (${(f.s0 - sec.s0).toFixed(0)} m)`);
    ok(f.d0 >= FIELD.near[0] && f.d1 > f.d0 + 10 && f.s1 > f.s0 + 19, `${sec.kind} ${sec.de}: Feld verkehrt (${f.d0.toFixed(1)}–${f.d1.toFixed(1)} m)`);
    for (const b of B) ok(f.s1 <= b.c0 - FIELD.bridge + 1e-6 || f.s0 >= b.c1 + FIELD.bridge - 1e-6, `${sec.kind} ${sec.de}: Feld an der Brücke ${b.name || ''}`);
    // im Ackerlauf der Seite
    const R = f.side < 0 ? sectionCover(sec).left : sectionCover(sec).right;
    const s0 = f.s0 - sec.s0;
    const s1 = f.s1 - sec.s0;
    ok(R.some(([a, b, k]) => k === 'feld' && a <= s0 + 1e-6 && b >= s1 - 1e-6), `${sec.kind} ${sec.de}: Feld außerhalb eines Ackerlaufs`);
    for (const g of F) {
      if (g === f || g.side !== f.side) continue;
      const over = Math.min(f.s1, g.s1) - Math.max(f.s0, g.s0) > 0.01 && Math.min(f.d1, g.d1) - Math.max(f.d0, g.d0) > 0.01;
      ok(!over, `${sec.kind} ${sec.de}: Felder überlappen`);
    }
  }
}
function drive(from, to) {
  let sd = 4711;
  const trip = new Trip({ start: G.places[byName(from)].node, rng: () => ((sd = (sd * 16807) % 2147483647) / 2147483647) });
  trip.setTarget(byName(to));
  let x = J.L0;
  let arrived = false;
  for (let k = 0; k < 40000 && !arrived; k++) {
    const c = trip.section;
    const s = trip.s + (c.kind === 'stadt' ? 4 : c.kind === 'ab' || c.kind === 'land' ? 14 : 6);
    if (c.kind === 'ab') {
      const f = c.fork;
      if (f && !f.taken && f.s - s < J.decel - 20) x = trip.planFor(f) === 'exit' ? J.L0 : 5.625;
      else if (s - c.s0 > J.accel) x = 5.625;
    } else x = J.L0;
    const q = trip.profile(s);
    x = Math.min(Math.max(x, q.xmin), q.xmax);
    for (const e of trip.update(s, x)) if (e.type === 'arrive' && e.place === byName(to)) arrived = true;
    for (const sec of trip.cur.sections) {
      if (seen.has(sec) || !(sec.kind === 'land' || sec.kind === 'zub' || sec.kind === 'ab')) continue;
      seen.add(sec);
      checkSection(sec);
    }
  }
  stat.trips++;
  ok(arrived, `${from} → ${to}: kommt nicht an`);
}
const t1 = Date.now();
for (const [a, b] of [
  ['Hanau', 'Fulda'],
  ['Freiburg im Breisgau', 'Offenburg'],
  ['Koblenz', 'Trier'],
  ['Magdeburg', 'Halle an der Saale'],
]) drive(a, b);
const tWorld = Date.now() - t1;
ok(stat.secs > 8, `nur ${stat.secs} Abschnitte mit Landschaft`);
for (const k of KINDS) ok(stat.kinds[k] > 0, `nirgends ${k} neben der Straße`);
ok(stat.fields > 10 && stat.crops.size >= 4, `nur ${stat.fields} Felder (${stat.crops.size} Feldfrüchte)`);

// --- 4. Horizont -----------------------------------------------------------------------------------------------
const sky = (lat, lon) => {
  const p = at(lat, lon);
  return skyline(p.x, p.y, 180);
};
const maxIn = (arr, b0, b1) => {
  let v = -1;
  for (let b = b0; b <= b1; b += 2) v = Math.max(v, ringAt(arr, b * RAD));
  return v;
};
const t2 = Date.now();
const mu = sky(48.14, 11.58);
const fr = sky(48.0, 7.85);
const hh = sky(53.55, 10.0);
const ib = sky(47.27, 11.39);
const tSky = (Date.now() - t2) / 4;
const all = (s, k) => maxIn(s[k], 0, 358);
ok(maxIn(mu.far, 150, 210) * DEG > 0.2, `München: Alpen im Süden nur ${(maxIn(mu.far, 150, 210) * DEG).toFixed(2)}°`);
ok(maxIn(mu.far, 330, 390) < maxIn(mu.far, 150, 210) * 0.5, 'München: im Norden so hoch wie die Alpen');
ok(maxIn(mu.snow, 150, 210) > 0.3, 'München: Alpen ohne Schnee');
ok(maxIn(fr.near, 60, 120) * DEG > 1, `Freiburg: Schwarzwald im Osten nur ${(maxIn(fr.near, 60, 120) * DEG).toFixed(2)}°`);
ok(Math.max(all(hh, 'near'), all(hh, 'mid'), all(hh, 'far')) * DEG < 0.6, 'Hamburg: Berge am Horizont');
ok(all(hh, 'snow') === 0 && all(fr, 'rockN') === 0, 'Schnee in Hamburg oder Fels am Schwarzwald');
ok(all(ib, 'near') * DEG > 5 && all(ib, 'rockN') > 0.3, 'Innsbruck: keine hohen Berge mit Fels ringsum');
for (const [name, s] of [['München', mu], ['Freiburg', fr], ['Hamburg', hh], ['Innsbruck', ib]]) {
  for (const k of ['near', 'mid', 'far', 'wood', 'snow', 'rockN', 'rockM']) ok(s[k].length === 180 && s[k].every(Number.isFinite), `${name}: ${k} ungültig`);
}
ok(tSky < 40, `Horizont braucht ${tSky.toFixed(0)} ms`);

console.log(
  `Landschaft: ausgepackt in ${tLoad} ms; Wald ${(raw * 100).toFixed(1)} % (Karte ${(mask * 100).toFixed(1)} %), Siedlung ${(ur * 100).toFixed(1)} % (Karte ${(um * 100).toFixed(1)} %)`,
);
console.log(
  `Welt: ${stat.trips} Fahrten, ${stat.secs} Abschnitte, ${stat.km.toFixed(1)} km je Seite: ` +
    KINDS.map((k) => `${k} ${((stat.kinds[k] / (2 * stat.km)) * 100).toFixed(0)} %`).join(', ') +
    `; ${stat.fields} Felder (${stat.fieldKm.toFixed(1)} km, ${[...stat.crops].join(', ')}) in ${tWorld} ms`,
);
console.log(
  `Horizont (${tSky.toFixed(1)} ms): München Süden ${(maxIn(mu.far, 150, 210) * DEG).toFixed(2)}°, Freiburg Osten ${(maxIn(fr.near, 60, 120) * DEG).toFixed(2)}°, Hamburg ${(all(hh, 'near') * DEG).toFixed(2)}°, Innsbruck ${(all(ib, 'near') * DEG).toFixed(1)}°`,
);
console.log(`${checks} Prüfungen, ${fails} Fehler`);
process.exit(fails ? 1 : 0);
