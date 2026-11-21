// Prüft den Ortsplan des Stadt-Baukastens ohne Grafik: node tools/citykit-test.mjs [Orte-Modul] [Zahl der Keime]
// Für jeden Ort der Karte, in allen vier Ortsgrößen, mit und ohne Ziel und mit vielen Zufallskeimen:
// mindestens ein Brunnen, auf einem Platz an der Straße, vom Fahrersitz aus frei zu sehen, mit Laterne daneben,
// nichts auf der Fahrbahn, keine Häuser übereinander, die beiden Sonderbrunnen nur in Augsburg und Nürnberg.
// Dazu der Zielbrunnen in allen Größen (Kamera für die Nahaufnahme 2–4 m vor dem Brunnen, freie Sicht) und der
// Lageplan fürs Navi (layout.js townLayout) gegen den Plan und, für einige Orte, gegen die gebauten Meshes; dazu die
// Rastanlage (Schleife, Heldenbucht, Säule, Kamera, Tür) gegen ihre gebauten Meshes, jeder Baustein gegen seine
// Angaben (Ursprung, Breite, Tiefe, Höhe) und das Gelände der Wahrzeichen auf offene Ränder.
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

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
const L_ = L;
const dataPath = process.argv[2] ? pathToFileURL(resolve(process.argv[2])).href : new URL('../src/map/data.js', import.meta.url).href;
// Die Kartendaten (src/map/data.js) kommen mit dem Karten-Paket; ohne sie den Pfad als erstes Argument angeben
const { PLACES } = await import(dataPath).catch((e) => {
  if (e.code !== 'ERR_MODULE_NOT_FOUND') throw e;
  console.log(`Kartendaten fehlen (${dataPath}): node tools/citykit-test.mjs <Pfad zu data.js> [Zahl der Keime]`);
  process.exit(1);
});
const SEEDS = Number(process.argv[3] ?? 12);
const city = createCityKit(W);

let fails = 0;
const ok = (cond, msg) => {
  if (!cond) {
    fails++;
    if (fails <= 40) console.log('FEHLER:', msg);
  }
};
// Achsparallele Hülle eines Grundrisses (alle Drehungen im Ort sind Vielfache von 90°, außer Kleinkram)
const box = (fp) => {
  const c = Math.abs(Math.cos(fp.ang));
  const s = Math.abs(Math.sin(fp.ang));
  const hx = fp.hw * c + fp.hd * s;
  const hz = fp.hw * s + fp.hd * c;
  return [fp.cx - hx, fp.cx + hx, fp.cz - hz, fp.cz + hz];
};
const overlap = (a, b, pad = 0) => a[0] < b[1] - pad && b[0] < a[1] - pad && a[2] < b[3] - pad && b[2] < a[3] - pad;
const GROUND = new Set(['pavement', 'plaza', 'lawn']);
// Laternen, Bäume, Ampeln und Schilder dürfen mit Arm oder Krone überstehen: für die Fahrbahn zählt ihr Fuß
const OVER = new Set(['lamp', 'tree', 'signal', 'sign']);
const baseBox = (it) => (OVER.has(city.info(it.name).kind) ? [it.x - 0.3, it.x + 0.3, it.z - 0.3, it.z + 0.3] : box(it.fp));
const isHouse = (name) => ['village', 'shop', 'town', 'city', 'region', 'landmark'].includes(city.info(name).kind) && !city.info(name).centre;

const SIZES = ['dorf', 'klein', 'stadt', 'gross'];
const near = (a, b, e = 0.011) => Math.abs(a - b) <= e;

/**
 * Lageplan fürs Navi gegen den Plan: Straße von 0 bis len, Gehwege lückenlos genau bis zu den Straßenenden, Plätze =
 * Hülle ihres Pflasters, Stecknadel = Mitte des Hauptbrunnens auf dem Hauptplatz, jedes Haus und Wahrzeichen dabei.
 */
function checkLayout(plan, where) {
  const L = plan.layout;
  ok(L && L.streets.length === 1, `${where}: Lageplan fehlt`);
  if (!L) return;
  const st = L.streets[0];
  ok(near(st.pts[0][1], 0) && near(st.pts[st.pts.length - 1][1], -plan.len), `${where}: Straße endet nicht bei 0 und ${-plan.len}`);
  ok(near(st.width, L_.STREET.curbR - L_.STREET.curbL), `${where}: Straßenbreite ${st.width}`);
  for (const w of L.walks) {
    const tiles = plan.items.filter((it) => it.name.startsWith('pavement') && Math.sign(it.x - st.pts[0][0]) === w.side).map((it) => [it.fp.cz - it.fp.hw, it.fp.cz + it.fp.hw]).sort((a, b) => a[0] - b[0]);
    ok(tiles.length && near(tiles[0][0], -plan.len) && near(tiles[tiles.length - 1][1], 0), `${where}: Gehweg ${w.side} reicht nicht genau von 0 bis ${-plan.len}`);
    ok(tiles.every((t, i) => i === 0 || near(t[0], tiles[i - 1][1])), `${where}: Lücke im Gehweg ${w.side}`);
    ok(near(w.z0, -plan.len) && near(w.z1, 0), `${where}: Lageplan-Gehweg ${w.side} ${w.z0} … ${w.z1}`);
  }
  plan.squares.forEach((q, i) => {
    const s = L.squares[i];
    const tiles = plan.items.filter((it) => it.name === 'plaza' && it.x > s.x0 && it.x < s.x1 && it.z > s.z0 && it.z < s.z1);
    const hull = [Math.min(...tiles.map((t) => t.x - 4)), Math.max(...tiles.map((t) => t.x + 4)), Math.min(...tiles.map((t) => t.z - 4)), Math.max(...tiles.map((t) => t.z + 4))];
    ok(tiles.length && near(hull[0], s.x0) && near(hull[1], s.x1) && near(hull[2], s.z0) && near(hull[3], s.z1), `${where}: Platz ${i} im Lageplan ${[s.x0, s.x1, s.z0, s.z1]} statt Pflaster ${hull}`);
  });
  const main = plan.items.find((it) => it.fountain === 0);
  const sq = L.squares[L.goal.square];
  ok(main && near(L.goal.x, main.x) && near(L.goal.z, main.z), `${where}: Stecknadel nicht auf dem Hauptbrunnen`);
  ok(sq && L.goal.x > sq.x0 && L.goal.x < sq.x1 && L.goal.z > sq.z0 && L.goal.z < sq.z1, `${where}: Stecknadel nicht auf dem Zielplatz`);
  const houses = plan.items.filter((it) => { const i = city.info(it.name); return ['village', 'shop', 'town', 'city', 'region'].includes(i.kind) && !i.centre && i.h > 2; });
  ok(houses.length === L.buildings.length, `${where}: ${L.buildings.length} Häuser im Lageplan, ${houses.length} im Plan`);
  ok(plan.items.filter((it) => city.info(it.name).kind === 'landmark').length === L.landmarks.length, `${where}: Wahrzeichen fehlen im Lageplan`);
}
const stats = { plans: 0, fountains: 0, kinds: {}, perSize: {}, sight: { min: Infinity, sum: 0, n: 0 }, specials: {} };
const t0 = Date.now();
for (const [key, name, lat, lon, cc, n, pop] of PLACES) {
  const place = { key, name, lat, lon, cc, n, pop };
  for (const size of SIZES) {
    for (let k = 0; k < SEEDS; k++) {
      const goal = k % 3 === 0 ? undefined : k % 3 === 1 ? Math.round(L.TOWN_LEN[size] * 0.6) : Math.round(L.TOWN_LEN[size] * 0.7);
      const seed = L.hashKey(key) + k * 7919;
      const plan = city.planTown(place, { size, seed, goal });
      const where = `${key} ${size} Keim ${k}`;
      stats.plans++;
      stats.perSize[size] = (stats.perSize[size] ?? 0) + plan.fountains.length;
      ok(plan.fountains.length >= 1, `${where}: kein Brunnen`);
      const main = plan.fountains[0];
      if (!main) continue;
      const sq = plan.squares[0];
      // Hauptbrunnen auf dem Platz, Platz direkt hinter dem Gehweg an der Straße
      ok(sq && sq.side === 1 && sq.d0 === L.STREET.pave, `${where}: Hauptplatz liegt nicht an der Straße`);
      ok(sq && -main.z > sq.u0 && -main.z < sq.u1 && main.x - main.r >= L.STREET.curbR + sq.d0 - 0.01 && main.x + main.r <= L.STREET.curbR + sq.d1 + 0.01, `${where}: Hauptbrunnen nicht auf dem Platz`);
      if (goal !== undefined) ok(main.goal && Math.abs(main.u - goal) <= 40, `${where}: Ziel nicht am Brunnen (u ${main.u}, Ziel ${goal})`);
      const special = key === 'Augsburg' ? 'ursprung' : key === 'Nürnberg' ? 'endgegner' : null;
      ok((main.special ?? null) === special, `${where}: Sonderbrunnen ${main.special} statt ${special}`);
      ok(plan.fountains.slice(1).every((f) => !f.special), `${where}: Sonderbrunnen doppelt`);
      if (special) stats.specials[special] = (stats.specials[special] ?? 0) + 1;
      for (const f of plan.fountains) {
        stats.fountains++;
        stats.kinds[f.kind] = (stats.kinds[f.kind] ?? 0) + 1;
        ok(f.u > 0 && f.u < plan.len, `${where}: Brunnen ${f.kind} außerhalb des Ortes`);
        ok(f.x > L.STREET.curbR + L.STREET.pave || f.x < L.STREET.curbL - L.STREET.pave, `${where}: Brunnen ${f.kind} auf Straße oder Gehweg`);
        const blockers = L.sightBlockers(plan, f);
        ok(blockers.length === 0, `${where}: Sicht auf ${f.kind} verstellt von ${blockers.map((i) => plan.items[i].name).join(', ')}`);
        const lamp = plan.items.some((it) => it.name.startsWith('lamp') && Math.hypot(it.x - f.x, it.z - f.z) <= f.r + 6);
        ok(lamp, `${where}: keine Laterne am Brunnen ${f.kind}`);
        ok(f.cam && f.cam.pos[1] > 1 && f.cam.pos[1] < 1.6, `${where}: Kamera der Nahaufnahme fehlt`);
        // Im Becken steht nichts
        const fb = box(plan.items.find((it) => it.fountain === f.id).fp);
        for (const it of plan.items) {
          if (it.fountain === f.id || GROUND.has(it.name)) continue;
          ok(!overlap(fb, box(it.fp), 0.05), `${where}: ${it.name} steht im Brunnen ${f.kind}`);
        }
        if (f === main) {
          const d = L.sightDistance(plan, f);
          stats.sight.min = Math.min(stats.sight.min, d);
          stats.sight.sum += d;
          stats.sight.n++;
        }
      }
      // Nichts auf der Fahrbahn; Häuser nicht übereinander und nicht auf Plätzen
      const houses = [];
      for (const it of plan.items) {
        const b = baseBox(it);
        ok(b[1] <= L.STREET.curbL + 0.01 || b[0] >= L.STREET.curbR - 0.01, `${where}: ${it.name} ragt auf die Fahrbahn`);
        if (isHouse(it.name)) houses.push([it, box(it.fp)]);
      }
      for (let i = 0; i < houses.length; i++) {
        for (let j = i + 1; j < houses.length; j++) ok(!overlap(houses[i][1], houses[j][1], 0.05), `${where}: ${houses[i][0].name} und ${houses[j][0].name} überlappen`);
        for (const q of plan.squares) {
          const side = q.side;
          const qb = side > 0 ? [L.STREET.curbR + q.d0, L.STREET.curbR + q.d1, -q.u1, -q.u0] : [L.STREET.curbL - q.d1, L.STREET.curbL - q.d0, -q.u1, -q.u0];
          ok(!overlap(houses[i][1], qb, 0.05), `${where}: ${houses[i][0].name} steht auf dem Platz`);
        }
      }
      checkLayout(plan, where);
      // Gleicher Keim, gleicher Ort
      if (k === 1) ok(JSON.stringify(city.planTown(place, { size, seed, goal })) === JSON.stringify(plan), `${where}: Plan nicht reproduzierbar`);
    }
  }
}

// Zielbrunnen: alle Größen, viele Keime, dazu die beiden Sonderorte
const goalKinds = {};
for (const size of SIZES) {
  for (let k = 0; k < 40; k++) {
    for (const place of [undefined, 'Augsburg', 'Nürnberg']) {
      const g = city.planGoal({ size, seed: 1000 + k, place });
      const where = `Zielbrunnen ${size} Keim ${k} ${place ?? ''}`;
      goalKinds[g.kind] = (goalKinds[g.kind] ?? 0) + 1;
      const f = g.items.find((it) => it.fountain === 0);
      ok(f && g.cam, `${where}: Brunnen oder Kamera fehlt`);
      if (!f || !g.cam) continue;
      if (place === 'Augsburg') ok(g.kind === 'fountainOrigin', `${where}: nicht der Ursprung`);
      if (place === 'Nürnberg') ok(g.kind === 'fountainBoss', `${where}: nicht der Endgegner`);
      // Abstand der Kamera zum Brunnenrand (Grundriss) 0,8 … 4,5 m, Höhe um 1,2 m
      const fb = box(f.fp);
      const dx = Math.max(fb[0] - g.cam.pos[0], 0, g.cam.pos[0] - fb[1]);
      const dz = Math.max(fb[2] - g.cam.pos[2], 0, g.cam.pos[2] - fb[3]);
      const dist = Math.hypot(dx, dz);
      // Wasserspiele im Pflaster (flat): die Kamera darf auf ihrem Pflaster stehen, aber nicht in den Fontänen
      const fi = city.info(g.kind);
      const fromCentre = Math.hypot(g.cam.pos[0] - f.x, g.cam.pos[2] - f.z);
      if (fi.flat) ok(fromCentre >= 2 && fromCentre <= fi.r + 4.5, `${where}: Kamera ${fromCentre.toFixed(2)} m von der Mitte`);
      else ok(dist >= 0.5 && dist <= 4.5, `${where}: Kamera ${dist.toFixed(2)} m vom Brunnen`);
      ok(g.cam.pos[1] > 1.1 && g.cam.pos[1] < 1.5, `${where}: Kamerahöhe ${g.cam.pos[1]}`);
      // freie Sicht von der Kamera auf den Brunnen, nichts steht im Becken oder auf der Kamera
      for (const it of g.items) {
        if (it.fountain === 0 || GROUND.has(it.name)) continue;
        ok(!L.segHitsBox(g.cam.pos[0], g.cam.pos[2], g.cam.look[0], g.cam.look[2], it.fp, 0.1) || it.fp.h <= 0.95, `${where}: ${it.name} verstellt die Nahaufnahme`);
        ok(!overlap(fb, box(it.fp), 0.05), `${where}: ${it.name} steht im Brunnen`);
      }
    }
  }
}

// Hauptbrunnen jedes Orts (zugleich Zielbrunnen auf der Insel des Straßenbaus): die Tabelle der Radien stimmt mit den
// Brunnen überein, die Sonderbrunnen stehen nur in ihren Städten, jeder Brunnen passt mit Bordstein auf seine Insel
for (const [kind, r] of Object.entries(L.FOUNTAIN_R)) ok(city.info(kind).r === r, `FOUNTAIN_R.${kind} ${r} ≠ info.r ${city.info(kind).r}`);
// … und ihre Namen (so heißt das Navi-Ziel: „Marktbrunnen, Würzburg“)
for (const kind of Object.keys(L.FOUNTAIN_R)) ok(L.FOUNTAIN_TITLE[kind] === city.info(kind).title, `FOUNTAIN_TITLE.${kind} „${L.FOUNTAIN_TITLE[kind]}“ ≠ info.title „${city.info(kind).title}“`);
ok(Object.keys(L.FOUNTAIN_TITLE).length === Object.keys(L.FOUNTAIN_R).length, 'FOUNTAIN_TITLE kennt andere Brunnen als FOUNTAIN_R');
ok(L.goalName({ key: 'X', name: 'Würzburg', pop: 130000 }).endsWith(', Würzburg') && L.goalName({ key: 'Augsburg', name: 'Augsburg', pop: 300000 }) === 'Der Ursprung, Augsburg', 'goalName: Brunnen, Ort');
const islands = {};
for (const row of PLACES) {
  const place = { key: row[0], name: row[1], lat: row[2], cc: row[4], n: row[5], pop: row[6] };
  const kind = L.goalKind(place);
  const ri = L.islandRadius(place);
  islands[kind] = (islands[kind] ?? 0) + 1;
  ok(L.FOUNTAIN_R[kind] > 0, `${place.name}: Hauptbrunnen ${kind} ohne Radius`);
  ok((city.info(kind).special === 'ursprung') === (place.name === 'Augsburg') && (city.info(kind).special === 'endgegner') === (place.name === 'Nürnberg'), `${place.name}: Sonderbrunnen ${kind}`);
  ok(ri >= 2.5 && ri <= L.ISLAND.max && L.FOUNTAIN_R[kind] + L.ISLAND.kerb <= ri + 1e-9, `${place.name}: ${kind} passt nicht auf die Insel (${ri} m)`);
  ok(L.goalKind(place) === kind, `${place.name}: Hauptbrunnen nicht reproduzierbar`);
  // der Name sagt die Art (Gänseliesel → Figur, Markt → Säule, Löwe → Löwen …)
  ok(L.kindOfName(L.fountainName(place)) === kind && L.goalName(place) === `${L.fountainName(place)}, ${place.name}`, `${place.name}: Name „${L.fountainName(place)}“ passt nicht zur Art ${kind}`);
}
// Abwechslung: viele Arten, und benachbarte Orte sehen selten gleich aus (die drei nächsten Orte jedes Orts)
{
  const all = PLACES.map((row) => ({ key: row[0], name: row[1], lat: row[2], lon: row[3], pop: row[6] }));
  const kinds = all.map((p) => L.goalKind(p));
  const dist = (a, b) => Math.hypot(a.lat - b.lat, (a.lon - b.lon) * Math.cos((a.lat * Math.PI) / 180));
  let same = 0;
  let pairs = 0;
  all.forEach((p, i) => {
    const nb = all.map((q, j) => [dist(p, q), j]).filter(([, j]) => j !== i).sort((a, b) => a[0] - b[0]).slice(0, 3);
    for (const [, j] of nb) {
      pairs++;
      if (kinds[j] === kinds[i]) same++;
    }
  });
  const used = new Set(kinds).size;
  ok(used >= 12 && same / pairs < 0.15, `Brunnen zu gleichförmig: ${used} Arten, ${(100 * same / pairs).toFixed(1)} % gleiche Nachbarn`);
  console.log(`Hauptbrunnen: ${used} Arten, ${new Set(all.map((p) => L.fountainName(p))).size} Namen; gleiche Art bei den drei nächsten Orten: ${(100 * same / pairs).toFixed(1)} %`);
}

// Orte in der XXL-Welt (src/world/xxl/towns.js): der Straßenbau baut Fahrbahn, Bordstein, Gehweg und die Insel des
// Zielbrunnens, der Plan kennt sie. Für jeden Ort der Karte mit der Insel, wie der Straßenbau sie legt: genau ein
// Zielbrunnen, es ist der Hauptbrunnen des Orts auf der Insel (und der Lageplan zeigt dorthin), kein zweiter Brunnen
// in seiner Nähe, nichts steht auf der geweiteten Fahrbahn, Häuser weder übereinander noch auf Plätzen, freie Sicht
// auf jeden Brunnen, Licht am Zielbrunnen, keine eigenen Gehwegkacheln und Ortsschilder, der Name wie auf der Karte.
// Dazu der Ort, in dem eine Fahrt beginnt: sein Brunnenplatz liegt kurz vor dem Startpunkt. Und was das Navi vom Ort
// zeigt (naviLayout): die Stecknadel steckt im Zielbrunnen des Lageplans, der Platz liegt um ihn und reicht bis an den
// Bordstein der geweiteten Fahrbahn; am Start liegt er rechts neben der Straße um den Brunnen des Plans. Jeder Ort hat
// seine Ladesäule (xxl/charge.js chargeOf, parks.js POST): rechts an der Flucht am Ortsanfang, kein Haus und kein Platz
// auf ihr, Streifen und Gehweg davor leer, die Popcorn-Maschine oben auf der Heldensäule und der Eimer auf ihrem Poller;
// wer dort hält, setzt rückwärts in die Bucht (POST.halt = dockHalt), und die Insel des Brunnens beginnt erst hinter dem
// Park. Am Start (nur Erlensee hat dort den Supercharger) steht keine Popcorn-Maschine.
const { places, townLen } = await import('../src/map/graph.js');
const { townPlan, islandOf, naviLayout } = await import('../src/world/xxl/towns.js');
const { squareOf, SIDE_VIEW } = await import('../src/world/xxl/plan.js');
const { J } = await import('../src/game/trip.js');
const { POST } = await import('../src/map/parks.js');
const CK = await import('../src/world/xxl/charge.js');
const xxl = { towns: 0, houses: 0, fountains: 0, side: [90, 0], posts: 0 };
for (const p of places) {
  const len = townLen(p.pop);
  const sec = { kind: 'stadt', place: p.i, s0: 1000, s1: 1000 + len, spotS: 1000 + Math.round(len * 0.6) };
  const isl = islandOf(sec);
  const plan = townPlan(city, sec);
  const where = `${p.name} in der XXL-Welt`;
  xxl.towns++;
  xxl.fountains += plan.fountains.length;
  const main = plan.fountains[0];
  ok(isl && main && main.goal && main.island && main.kind === L.goalKind(p), `${where}: Zielbrunnen ist nicht der Hauptbrunnen auf der Insel`);
  if (!isl || !main) continue;
  ok(near(main.x, isl.x) && near(main.z, -isl.u) && near(main.y, isl.y) && main.r + L.ISLAND.kerb <= isl.r + 1e-9, `${where}: Zielbrunnen liegt nicht auf der Insel`);
  ok(plan.fountains.filter((f) => f.goal).length === 1 && plan.goal === isl.u, `${where}: nicht genau ein Ziel`);
  ok(plan.items.filter((it) => it.external).length === 1 && plan.items.find((it) => it.external).fountain === 0, `${where}: der Brunnen der Insel gehört dem Straßenbau`);
  // Halt am Navi-Ziel neben dem Brunnen (plan.js SIDE_VIEW): vom Auge des Fahrers liegt seine Mitte im linken
  // Seitenfenster (gut 65° gegen die Fahrtrichtung; das Fenster reicht etwa von 36° bis 109°), zwischen Wagen und
  // Insel liegt nur Fahrbahn, nichts Hohes verstellt die Sicht, und das Navi nennt ihn mit seinem Namen und dem Ort
  const sq = squareOf(sec);
  const eye = [J.L0 - SIDE_VIEW.left, -(sq.stop - SIDE_VIEW.back - sec.s0)];
  const side = (Math.atan2(eye[0] - main.x, -main.z + eye[1]) * 180) / Math.PI;
  xxl.side = [Math.min(xxl.side[0], side), Math.max(xxl.side[1], side)];
  ok(side > 55 && side < 75 && main.x + isl.r < J.L0 - 1.2, `${where}: am Halt nicht im Seitenfenster (${side.toFixed(0)}°)`);
  const halt = L.sightBlockers(plan, main, [eye]);
  ok(halt.length === 0, `${where}: am Halt verstellt ${halt.map((i) => plan.items[i].name).join(', ')} den Brunnen`);
  ok(L.goalName(p) === `${L.fountainName(p)}, ${p.name}` && L.kindOfName(L.fountainName(p)) === main.kind, `${where}: Navi-Ziel „${L.goalName(p)}“ ist nicht der Brunnen`);
  ok(plan.fountains.slice(1).every((f) => Math.abs(f.u - isl.u) >= 40 && !f.special), `${where}: zweiter Brunnen neben dem Zielbrunnen`);
  const lay = plan.layout;
  ok(lay.goal && near(lay.goal.x, isl.x) && near(lay.goal.z, -isl.u) && lay.squares[lay.goal.square].kind === 'island' && lay.squares[lay.goal.square].fountain === 0, `${where}: Lageplan zeigt nicht auf die Insel`);
  ok(lay.name === p.name && lay.signs.length === 0 && plan.texts.length === 0, `${where}: Name oder Schilder`);
  const nl = naviLayout(sec);
  ok(nl && nl.streets.length === 0 && near(nl.fountain.s, sec.s0 - lay.goal.z) && near(nl.fountain.x, lay.goal.x), `${where}: Stecknadel des Navis nicht im Zielbrunnen`);
  ok(nl && near(nl.square.s, nl.fountain.s) && near(nl.square.x, nl.fountain.x) && near(nl.square.x - nl.square.r, isl.kerb(isl.u)) && nl.square.r > isl.r, `${where}: Platz des Navis nicht um die Insel`);
  ok(lay.walks.every((w) => w.z0 === -len && w.z1 === 0), `${where}: Gehwege des Lageplans`);
  ok(!plan.items.some((it) => it.name === 'pavement' || it.name === 'pavement4'), `${where}: Gehwegkacheln (den Gehweg baut der Straßenbau)`);
  for (const f of plan.fountains) {
    const blockers = L.sightBlockers(plan, f);
    ok(blockers.length === 0, `${where}: Sicht auf ${f.kind} verstellt von ${blockers.map((i) => plan.items[i].name).join(', ')}`);
    // (das Licht am Zielbrunnen steht um die Insel, die sich nach dem Platz des Brunnens richtet, nicht nach ihm)
    const lit = f.island ? Math.max(f.r, isl.r - L.ISLAND.kerb - L.ISLAND.ring) : f.r;
    ok(plan.items.some((it) => it.name.startsWith('lamp') && Math.hypot(it.x - f.x, it.z - f.z) <= lit + 6), `${where}: keine Laterne am Brunnen ${f.kind}`);
    const fb = box(plan.items.find((it) => it.fountain === f.id).fp);
    for (const it of plan.items) if (it.fountain !== f.id && !GROUND.has(it.name)) ok(!overlap(fb, box(it.fp), 0.05), `${where}: ${it.name} steht im Brunnen ${f.kind}`);
  }
  // linke Bordsteinkante: geweitet neben der Insel, sonst wie überall
  const kerbL = (u) => (u > isl.u0 && u < isl.u1 ? isl.kerb(u) : L.STREET.curbL);
  const houses = [];
  for (const it of plan.items) {
    if (it.external) continue;
    const b = baseBox(it);
    const left = Math.min(kerbL(-b[2]), kerbL(-b[3]), kerbL(-(b[2] + b[3]) / 2));
    ok(b[1] <= left + 0.01 || b[0] >= L.STREET.curbR - 0.01, `${where}: ${it.name} ragt auf die Fahrbahn (u ${Math.round(-it.z)})`);
    if (isHouse(it.name)) houses.push([it, box(it.fp)]);
  }
  xxl.houses += houses.length;
  ok(houses.some(([it]) => it.x < L.STREET.curbL - L.STREET.pave - 0.5 && -it.z > isl.u0 && -it.z < isl.u1 && near(it.x, isl.kerb(isl.u) - L.STREET.pave)), `${where}: keine Häuser an der zurückgesetzten Flucht`);
  for (let i = 0; i < houses.length; i++) {
    for (let j = i + 1; j < houses.length; j++) ok(!overlap(houses[i][1], houses[j][1], 0.05), `${where}: ${houses[i][0].name} und ${houses[j][0].name} überlappen`);
    for (const q of plan.squares) {
      const qb = q.side > 0 ? [L.STREET.curbR + q.d0, L.STREET.curbR + q.d1, -q.u1, -q.u0] : [L.STREET.curbL - q.d1, L.STREET.curbL - q.d0, -q.u1, -q.u0];
      ok(!overlap(houses[i][1], qb, 0.05), `${where}: ${houses[i][0].name} steht auf dem Platz`);
    }
  }
  ok(JSON.stringify(townPlan(city, sec)) === JSON.stringify(plan), `${where}: Plan nicht reproduzierbar`);
  // die Ladesäule des Orts
  {
    const C = CK.CHARGE;
    const c = CK.chargeOf(sec);
    const pi = city.info(C.kind);
    ok(c && !c.start && c.u === POST.u && plan.charge && plan.charge.u === POST.u && plan.charge.x === C.front && plan.charge.kind === C.kindStart, `${where}: keine Ladesäule bei POST.u`);
    if (c && plan.charge) {
      xxl.posts++;
      const pk = [C.front, C.front + pi.d, -(c.u + C.half), -(c.u - C.half)];
      const u0 = c.u - C.half - C.keep;
      const u1 = c.u + C.half + C.keep;
      for (const it of plan.items) {
        if (it.name === plan.charge.kind || it.external) continue;
        const b = baseBox(it);
        if (isHouse(it.name)) ok(!overlap(b, pk, 0.05), `${where}: ${it.name} steht in der Ladesäule`);
        ok(!overlap(b, [L.STREET.curbR, C.front, -u1, -u0], 0.01), `${where}: ${it.name} steht vor der Ladesäule (u ${Math.round(-it.z)})`);
      }
      for (const q of plan.squares) ok(q.side < 0 || q.u1 < u0 || q.u0 > u1, `${where}: Platz an der Ladesäule`);
      const pop = plan.items.filter((it) => it.name === 'popcorn_post');
      const top = [C.front - C.post[1], -(c.u - C.post[0])];
      ok(pop.length === 1 && Math.hypot(pop[0].x - top[0], pop[0].z - top[1]) < 0.005 && plan.items.filter((it) => it.name === 'popcorn_eimer').length === 1, `${where}: Popcorn-Maschine nicht oben auf der Heldensäule`);
      ok(near(POST.halt, CK.dockHalt(c.u), 0.005) && sq.s - sq.r - 22 > sec.s0 + u1, `${where}: Halt an der Ladesäule (${POST.halt}) oder Insel ab ${(sq.s - sq.r - 22 - sec.s0).toFixed(0)} m zu nah`);
    }
  }
  // Start der Fahrt mitten im Ort (trip.js: der Abschnitt beginnt 300 m vor dem Startpunkt)
  const first = { kind: 'stadt', place: p.i, s0: -300, s1: -300 + Math.max(len, 500), start: true, spotS: 0 };
  const sp = townPlan(city, first);
  const sm = sp.fountains[0];
  ok(!sp.items.some((it) => it.name === 'popcorn_post'), `${where}: am Start eine Popcorn-Maschine`);
  ok(sm && sm.goal && !sm.island && sm.kind === L.goalKind(p) && sm.x > L.STREET.curbR + L.STREET.pave && sm.u > 300 + 10 && sm.u < 300 + 80, `${where}: am Start kein Brunnen kurz voraus (u ${sm && sm.u})`);
  ok(L.sightBlockers(sp, sm, [[L.STREET.eye, -300]]).length === 0, `${where}: am Start ist der Brunnen verstellt`);
  const ns = naviLayout(first, { plan: sp });
  ok(naviLayout(first) === null && ns && near(ns.fountain.s, first.s0 + sm.u) && near(ns.fountain.x, sm.x), `${where}: am Start zeigt das Navi den Brunnen woanders`);
  ok(ns && ns.square.x - ns.square.r >= L.STREET.curbR - 0.01 && Math.hypot(ns.fountain.s - ns.square.s, ns.fountain.x - ns.square.x) + sm.r <= ns.square.r + 0.01, `${where}: am Start liegt der Platz des Navis nicht um den Brunnen rechts der Straße`);
}
ok(xxl.posts === xxl.towns && xxl.posts > 400, `Ladesäulen: ${xxl.posts} in ${xxl.towns} Orten`);

// Der Ladepark in Erlensee (xxl/charge.js), am Start und auf der Durchfahrt: er steht, wo der Weg des Wagens ihn
// erwartet (Heldenbucht und Säule wie im Baustein), kein Haus und kein Platz liegt auf ihm, Streifen und Gehweg vor ihm
// sind leer, und beim Ausparken kreuzt kein Rad den Bordstein außerhalb der Einfahrt; der Wagen berührt dabei weder
// die Säule noch ein geparktes Auto und endet am Start genau dort, wo jede Fahrt losrollt.
{
  const { chargeOf, rollPose, ROLL_T, CHARGE } = await import('../src/world/xxl/charge.js');
  // Maße des Wagens (models/tesla.js TESLA; das Modell selbst braucht WebGL): Spur, halbe Breite, halbe Länge
  const CAR = { track: 0.79, half: 0.93, front: 2.345 };
  const p = places.find((q) => q.key === CHARGE.place);
  const len = townLen(p.pop);
  const info = city.info(CHARGE.kind);
  ok(near(info.bays[info.hero][0], CHARGE.bay[0], 1e-9) && near(info.bays[info.hero][1], CHARGE.bay[1], 1e-9) && near(info.posts[info.heroPost][0], CHARGE.post[0], 1e-9) && near(info.posts[info.heroPost][1], CHARGE.post[1], 1e-9) && info.w === 2 * CHARGE.half, 'Ladepark: Bucht oder Säule anders als im Baustein');
  const secs = [
    { kind: 'stadt', place: p.i, s0: -300, s1: -300 + Math.max(len, 500), start: true, spotS: 0 },
    { kind: 'stadt', place: p.i, s0: 1000, s1: 1000 + len, spotS: 1000 + Math.round(len * 0.6) },
  ];
  let checked = 0;
  for (const sec of secs) {
    const where = `Ladepark ${p.name} (${sec.start ? 'Start' : 'Durchfahrt'})`;
    const c = chargeOf(sec);
    const plan = townPlan(city, sec);
    ok(c && plan.charge && near(plan.charge.u, c.u) && plan.charge.x === CHARGE.front && plan.charge.kind === CHARGE.kindStart, `${where}: nicht geplant`);
    if (!c || !plan.charge) continue;
    const pk = [CHARGE.front, CHARGE.front + info.d, -(c.u + CHARGE.half), -(c.u - CHARGE.half)];
    const u0 = c.u - CHARGE.half - CHARGE.keep;
    const u1 = c.u + CHARGE.half + CHARGE.keep;
    for (const it of plan.items) {
      if (it.name === plan.charge.kind) continue;
      const b = baseBox(it);
      if (isHouse(it.name)) ok(!overlap(b, pk, 0.05), `${where}: ${it.name} steht im Park`);
      ok(!overlap(b, [L.STREET.curbR, CHARGE.front, -u1, -u0], 0.01), `${where}: ${it.name} steht vor dem Park (u ${Math.round(-it.z)})`);
    }
    for (const q of plan.squares) ok(q.side < 0 || q.u1 < u0 || q.u0 > u1, `${where}: Platz am Park`);
    const dw = { u0: c.drive.s0 - sec.s0, u1: c.drive.s1 - sec.s0 };
    // Säule 1 (Fuß 0,61 × 0,54 m) und die geparkten Autos im Ort
    const post = [CHARGE.front - CHARGE.post[1] - 0.27, CHARGE.front - CHARGE.post[1] + 0.27, -(c.u - CHARGE.post[0]) - 0.31, -(c.u - CHARGE.post[0]) + 0.31];
    const cars = plan.items.filter((it) => city.info(it.name).kind === 'car').map((it) => box(it.fp));
    for (let t = 0; t <= ROLL_T + 1e-9; t += 0.02) {
      const q = rollPose(c.u, t);
      const fx = Math.sin(q.yaw);
      const fu = Math.cos(q.yaw);
      // Räder: Hinterachse 1,37 m hinter der Mitte, Vorderachse 1,505 m davor; links/rechts ± Spur
      for (const [a, sd] of [[-1.37, -1], [-1.37, 1], [1.505, -1], [1.505, 1]]) {
        const x = q.x + fx * a + fu * sd * CAR.track;
        const u = q.u + fu * a - fx * sd * CAR.track;
        if (x > L.STREET.curbR - 0.2 && x < CHARGE.front) ok(u > dw.u0 && u < dw.u1, `${where}: Rad auf dem Bordstein (t ${t.toFixed(2)}, u ${u.toFixed(2)})`);
      }
      // Wagen als Rechteck (4,69 × 1,86 m): nicht in Säule 1, nicht in einem geparkten Auto
      const corners = [[-CAR.front, -1], [-CAR.front, 1], [CAR.front, -1], [CAR.front, 1]].map(([a, sd]) => [q.x + fx * a + fu * sd * CAR.half, -(q.u + fu * a - fx * sd * CAR.half)]);
      const cb = [Math.min(...corners.map((k) => k[0])), Math.max(...corners.map((k) => k[0])), Math.min(...corners.map((k) => k[1])), Math.max(...corners.map((k) => k[1]))];
      if (Math.abs(fx) > 0.999 || Math.abs(fu) > 0.999) {
        ok(!overlap(cb, post, 0.05), `${where}: Wagen in der Säule (t ${t.toFixed(2)})`);
        for (const b of cars) ok(!overlap(cb, b, 0.05), `${where}: Wagen in einem geparkten Auto (t ${t.toFixed(2)})`);
      }
      checked++;
    }
    if (sec.start) {
      const end = rollPose(c.u, ROLL_T);
      ok(near(end.u, -sec.s0, 1e-6) && near(end.x, L.STREET.lane, 1e-9) && end.yaw === 0 && near(end.v, CHARGE.vEnd, 1e-9) && end.steer === 0, `${where}: das Ausparken endet nicht am Startpunkt`);
    }
  }
  ok(checked > 500, 'Ladepark: zu wenig geprüft');
}

// Ladeparks hinter den Autobahn-Ausfahrten (src/map/parks.js; layout.js planPark über towns.js parkPlan): der Park
// steht an der Flucht mit der Mitte bei PARK.u, der Wagen hält in der Spur ein Stück hinter der freien Heldenbucht
// (PARK.halt) und setzt rückwärts hinein, vor ihr ist der Bordstein abgesenkt (charge.js chargeOf, dockHalt). Nichts steht auf Fahrbahn oder Gehweg außer
// den Laternen am Streifen, nichts vor dem Park, kein Baum im Park, im Rasthaus, in der Tafel oder in einem Tisch; die
// Heldenbucht und ihre Nachbarn bleiben frei, die Popcorn-Maschine steht oben auf der Heldensäule. Der Ort der Welt
// (towns.js Towns) baut ihn wie einen Ort, zählt ihn aber nicht zu den Orten (list).
{
  const { PARKS, PARK } = await import('../src/map/parks.js');
  const { chargeOf, CHARGE, dockHalt } = await import('../src/world/xxl/charge.js');
  const { parkPlan } = await import('../src/world/xxl/towns.js');
  const info = city.info(CHARGE.kind);
  ok(near(PARK.halt, dockHalt(PARK.u), 0.005), `Ladepark: Halt ${PARK.halt} nicht dort, wo der Wagen rückwärts in die Heldenbucht setzt`);
  const bayU = PARK.u - CHARGE.bay[0] + CHARGE.off;
  const S0 = 4000;
  let n = 0;
  for (const pk of PARKS) {
    const sec = { kind: 'park', park: pk.i, s0: S0, s1: S0 + PARK.len, spotS: S0 + PARK.halt - 2 };
    const where = pk.name;
    const plan = parkPlan(city, sec);
    const c = chargeOf(sec);
    ok(c && !c.start && c.u === PARK.u && plan.charge.u === PARK.u && plan.charge.x === CHARGE.front && plan.charge.kind === CHARGE.kindStart, `${where}: Park nicht bei PARK.u`);
    ok(c && c.drive.s0 < sec.s0 + bayU && c.drive.s1 > sec.s0 + bayU, `${where}: kein abgesenkter Bordstein vor der Heldenbucht`);
    const pkBox = [CHARGE.front, CHARGE.front + info.d, -(PARK.u + CHARGE.half), -(PARK.u - CHARGE.half)];
    const front = [L.STREET.curbL, CHARGE.front, -(PARK.u + CHARGE.half + CHARGE.keep), -(PARK.u - CHARGE.half - CHARGE.keep)];
    const solid = plan.items.filter((it) => !OVER.has(city.info(it.name).kind) && it.name !== plan.charge.kind);
    for (const it of plan.items) {
      const k = city.info(it.name).kind;
      const b = baseBox(it);
      ok(b[1] <= L.STREET.curbL - L.STREET.pave + 0.01 || b[0] >= CHARGE.front - 0.01 || (k === 'lamp' && (b[1] <= L.STREET.curbL || b[0] >= L.STREET.curbR)), `${where}: ${it.name} auf Fahrbahn oder Gehweg (x ${it.x.toFixed(1)})`);
      ok(b[2] >= -PARK.len && b[3] <= 0, `${where}: ${it.name} außerhalb des Abschnitts (u ${(-it.z).toFixed(0)})`);
      ok(!overlap(b, front, 0.01), `${where}: ${it.name} vor dem Park`);
      if (k === 'tree') {
        ok(!overlap(box(it.fp), pkBox, 0.05), `${where}: Baum im Park`);
        for (const o of solid) ok(!overlap(box(it.fp), box(o.fp), 0.05), `${where}: Baum in ${o.name}`);
      }
    }
    // Buchten: belegt 0, 6, 7; die Heldenbucht und ihre Nachbarn frei
    const cars = plan.items.filter((it) => city.info(it.name).kind === 'car').map((it) => box(it.fp));
    for (const i of [info.hero - 1, info.hero, info.hero + 1]) {
      const [bx, bz] = info.bays[i];
      const bay = [CHARGE.front - bz - 1, CHARGE.front - bz + 1, -(PARK.u - bx) - 1.2, -(PARK.u - bx) + 1.2];
      ok(!cars.some((b) => overlap(b, bay, 0.05)), `${where}: Bucht ${i} belegt`);
    }
    const pop = plan.items.filter((it) => it.name === 'popcorn_post');
    const post = [CHARGE.front - CHARGE.post[1], -(PARK.u - CHARGE.post[0])];
    ok(pop.length === 1 && Math.hypot(pop[0].x - post[0], pop[0].z - post[1]) < 0.005 && !plan.items.some((it) => it.name === 'popcorn_stand'), `${where}: Popcorn-Maschine nicht oben auf der Heldensäule`);
    const sign = plan.items.find((it) => it.name === 'autobahn_schild');
    ok(sign && sign.extras && sign.extras.title === pk.name && sign.extras.icons.includes('plug'), `${where}: Tafel ohne Namen`);
    n++;
  }
  ok(n === PARKS.length && n > 100, 'Ladepark: zu wenig geprüft');
  // geparkte Autos: die Buchse, in der das Kabel ihrer Säule steckt, sitzt auf ihrer Flanke zur Säule, hinter dem Bug
  const { parkedPorts } = await import('../src/world/kit/rest.js');
  const plan0 = parkPlan(city, { kind: 'park', park: 0, s0: S0, s1: S0 + PARK.len, spotS: S0 + PARK.halt - 2 });
  const parked = plan0.items.filter((it) => city.info(it.name).kind === 'car');
  let plugs = 0;
  for (const [px, pz] of info.posts) {
    for (const port of Object.values(parkedPorts(px))) {
      const x = CHARGE.front - (pz + port[2]);
      const z = -(PARK.u - (px + port[0]));
      const car = parked.find((it) => Math.abs(it.z - z) < 1.3 && Math.abs(it.x - x) < 2);
      const ci = car && city.info(car.name);
      ok(car && near(Math.abs(car.z - z), (ci.w - 0.06) / 2, 0.005) && Math.abs(car.x - x) < (ci.d - 0.12) / 2 - 0.3, `Ladepark: Kabel an Säule ${px} steckt in keinem Auto`);
      plugs++;
    }
  }
  ok(plugs === info.parked.length && parked.length === plugs, `Ladepark: ${plugs} Kabel für ${parked.length} geparkte Autos`);
  // in der Welt: geplant und gebaut wie ein Ort, aber kein Ort
  const THREE = await import('three');
  const { Towns } = await import('../src/world/xxl/towns.js');
  const root = new THREE.Group();
  const towns = new Towns(root);
  const sec = { kind: 'park', park: 0, s0: S0, s1: S0 + PARK.len, spotS: S0 + PARK.halt - 2, frame: 3 };
  towns.begin();
  towns.need(sec, null);
  towns.sweep();
  const shear = new Map([[3, { a: 0, b: 0 }]]);
  for (let i = 0; i < 10 && !towns.of(sec); i++) towns.update(S0 - 100, shear, 0, 0);
  const t = towns.of(sec);
  ok(t && t.group && !t.group.pending && t.group.visible && towns.list().length === 0, 'Ladepark in der Welt: nicht gebaut oder als Ort gezählt');
  // Stecker und Kabel der Heldensäule für den Ladestopp (chargerig.js), der Stecker im Halter
  ok(t && t.charge && t.charge.k === 1 && t.charge.group.parent === t.group, 'Ladepark in der Welt: kein Stecker an der Heldensäule');
  console.log(`Ladeparks: ${n} Pläne geprüft (Park bei u ${PARK.u}, Halt bei ${PARK.halt} m, Bordstein abgesenkt, Buchten ${info.hero - 1}–${info.hero + 1} frei, ${plugs} geparkte Autos am Kabel), in der Welt ${t ? t.group.children.length : 0} Teile`);
  towns.reset();
}

// Lebenslauf eines Orts in der XXL-Welt (towns.js Towns): angelegt, sobald ein Stück seines Abschnitts gebraucht wird;
// weit voraus entsteht er Teil für Teil (erst alle Fernfassungen, die nahen erst bei der Anfahrt), nah steht er sofort
// fertig da. Im gescherten Rahmen fährt er starr mit: die eigene Spur liegt genau auf der gescherten Straße, jede Linie
// längs der Straße bleibt auf ihr, rechte Winkel bleiben rechte. Abgeräumt, wenn kein Stück mehr gebraucht wird.
const THREE = await import('three');
const { Towns } = await import('../src/world/xxl/towns.js');
{
  // ein Querschnitt für Straßenbau, Spiel und Baukasten: Bordsteinkanten und die Spur des Wagens
  const { VIS } = await import('../src/world/xxl/roadkit.js');
  const { PROFILES } = await import('../src/game/trip.js');
  ok(VIS.stadt.aL === L.STREET.curbL && VIS.stadt.aR === L.STREET.curbR, 'XXL-Ort: Bordsteinkanten des Straßenbaus sind nicht die des Baukastens');
  ok(PROFILES.stadt.lanes[0].x === L.STREET.lane, 'XXL-Ort: die Spur des Wagens im Ort ist nicht die des Baukastens');
}
{
  const root = new THREE.Group();
  const towns = new Towns(root);
  const p = places.find((q) => q.name === 'Frankfurt am Main') ?? places[0];
  const len = townLen(p.pop);
  const S0 = 5000;
  // Schilder mit Text (textMaterial): so viele hält der Baukasten, bevor der Ort entsteht
  const texts0 = towns.kit.core.textMats.size;
  const sec = { kind: 'stadt', place: p.i, s0: S0, s1: S0 + len, spotS: S0 + Math.round(len * 0.6), frame: 7 };
  towns.begin();
  towns.need(sec, null);
  towns.sweep();
  ok(towns.items.size === 1 && towns.of(sec) === null && towns.list().length === 0 && root.children.length === 0, 'XXL-Ort: schon vor dem ersten Bild geplant');
  const sh = { a: -120, b: 0.348 };
  const shear = new Map([[7, sh]]);
  let s = S0 - 1700;
  // weit voraus: der Plan steht nach wenigen Bildern (hier sind die Bausteine schon bekannt: nach dem ersten)
  for (let i = 0; i < 40 && !towns.of(sec); i++) towns.update(s, shear, 0, 0);
  const t = towns.of(sec);
  ok(t && root.children.includes(t.group) && !t.group.visible && t.group.pendingFar > 0 && t.group.pending > t.group.pendingFar, 'XXL-Ort: nicht angelegt');
  ok(t && JSON.stringify(t.plan) === JSON.stringify(townPlan(city, sec)), 'XXL-Ort: in Raten anders geplant als am Stück');
  const total = t.group.pending;
  const farN = t.group.pendingFar;
  const lods = [];
  t.group.traverse((o) => o.isLOD && lods.push(o));
  for (let i = 0; i < farN + 6; i++) towns.update(s, shear, 0, 0);
  ok(t.group.pendingFar === 0 && t.group.pending === total - farN, `XXL-Ort: in der Ferne sollen nur die Fernfassungen entstehen (Rest ${t.group.pending} von ${total})`);
  ok(lods.length > 0 && lods.every((o) => o.levels.length === 1 && o.levels[0].distance > 0), 'XXL-Ort: Fernfassungen fehlen');
  const at = (x, u) => new THREE.Vector3(x, 0, -u).applyMatrix4(t.group.matrix);
  for (const u of [0, 300, len]) {
    const q = at(L.STREET.lane, u);
    const d = S0 + u - s;
    ok(near(q.x, L.STREET.lane + sh.a + sh.b * d, 1e-6) && near(q.z, -d, 1e-6), `XXL-Ort: eigene Spur bei u ${u} nicht auf der gescherten Straße`);
  }
  for (const x of [L.STREET.curbL, L.STREET.curbR, -20, 40]) {
    // auf der gescherten Straße ist x' − a − b·d längs konstant
    const [c0, c1] = [at(x, 0), at(x, len)].map((q) => q.x - sh.a + sh.b * q.z);
    ok(near(c0, c1, 1e-6), `XXL-Ort: Linie x = ${x} verlässt die gescherte Straße`);
  }
  ok(Math.abs(at(1, 0).sub(at(0, 0)).dot(at(0, 1).sub(at(0, 0)))) < 1e-9, 'XXL-Ort: rechte Winkel bleiben in der Scherung nicht recht');
  s = S0 - 800;
  towns.update(s, shear, 0, 0);
  ok(t.group.pending === total - farN - 1, 'XXL-Ort: bei der Anfahrt entstehen die nahen Fassungen nicht');
  s = S0 - 400;
  towns.update(s, shear, 0, 0);
  ok(t.group.pending === 0 && lods.every((o) => o.levels.length === 2 && o.levels[0].distance === 0), 'XXL-Ort: nah nicht fertig gebaut');
  shear.set(7, { a: 0, b: 0 });
  towns.update(S0 + 100, shear, 0, 0);
  const q = at(3, 50);
  ok(t.group.visible && near(q.x, 3, 1e-9) && near(q.z, 50, 1e-9), 'XXL-Ort: im eigenen Rahmen nicht einfach verschoben');
  shear.clear();
  towns.update(S0 + 100, shear, 0, 0);
  ok(!t.group.visible, 'XXL-Ort: ohne Rahmen noch zu sehen');
  towns.begin();
  towns.sweep();
  ok(towns.items.size === 0 && root.children.length === 0, 'XXL-Ort: nicht abgeräumt');
  // wer mitten in einen Ort gesetzt wird (Start der Fahrt), sieht ihn im ersten Bild fertig
  towns.begin();
  towns.need(sec, null);
  towns.update(S0 + 300, new Map([[7, { a: 0, b: 0 }]]), 0, 0);
  const u = towns.of(sec);
  ok(u && u.group.visible && u.group.pending === 0, 'XXL-Ort: mitten im Ort nicht sofort fertig');
  const textsBuilt = towns.kit.core.textMats.size;
  towns.reset();
  ok(towns.items.size === 0 && root.children.length === 0, 'XXL-Ort: nach reset nicht leer');
  // abgeräumt gehen auch seine Schilder (Ortstafel, Wegweiser …), die niemand sonst nutzt
  ok(textsBuilt > texts0 && towns.kit.core.textMats.size === texts0, `XXL-Ort: Textmaterialien vor dem Ort ${texts0}, gebaut ${textsBuilt}, abgeräumt ${towns.kit.core.textMats.size}`);
  xxl.parts = total;
}

// Plan in Raten (K.planTown mit budget, so plant die XXL-Welt weit voraus): ein frischer Baukasten kennt noch keine
// Maße. Ohne Zeit (budget 0) schafft jeder Aufruf genau einen neuen Baustein und gibt null zurück, bis alle da sind;
// der fertige Plan ist derselbe wie am Stück.
{
  const fresh = createCityKit(W);
  const p = places.find((q) => q.name === 'Hanau') ?? places[0];
  const opts = { len: townLen(p.pop), goal: 200 };
  let calls = 0;
  let plan = null;
  while (!plan && calls < 1000) {
    plan = fresh.planTown(p, { ...opts, budget: 0 });
    calls++;
  }
  ok(plan && calls > 10, `Plan in Raten: nach ${calls} Aufrufen ${plan ? 'zu schnell fertig' : 'nicht fertig'}`);
  ok(plan && JSON.stringify(plan) === JSON.stringify(city.planTown(p, opts)), 'Plan in Raten: anders als am Stück');
  ok(JSON.stringify(fresh.planTown(p, { ...opts, budget: 0 })) === JSON.stringify(plan), 'Plan in Raten: mit bekannten Bausteinen nicht im ersten Aufruf fertig');
  xxl.calls = calls;
}

// Gebaute Meshes gegen den Lageplan, je Größe ein Ort (dazu Frankfurt mit Skyline): die verschmolzenen Ortsstücke reichen
// genau von 0 bis −len, die vier Ecken jedes Platzes liegen als Eckpunkte des Pflasters in Gehweghöhe im Mesh, die
// Brunnenliste der Group liegt auf den Brunnen des Lageplans.
const meshChecks = [];
for (const [key, size] of [['Gründau', 'dorf'], ['Gifhorn', 'klein'], ['Fulda', 'stadt'], ['Hannover', 'gross'], ['Frankfurt am Main', 'gross']]) {
  const row = PLACES.find((p) => p[0] === key);
  if (!row) continue;
  const [, name, lat, lon, cc, n, pop] = row;
  const plan = city.planTown({ key, name, lat, lon, cc, n, pop }, { size, goal: Math.round(L.TOWN_LEN[size] * 0.6) });
  const group = city.buildTown(plan);
  const where = `Meshes ${key} ${size}`;
  ok(group.layout === plan.layout, `${where}: group.layout fehlt`);
  let z0 = Infinity;
  let z1 = -Infinity;
  const corners = new Set();
  const v = { x: 0, y: 0, z: 0 };
  group.updateMatrixWorld(true);
  for (const lod of group.children.filter((c) => c.name.startsWith('Ortsstück'))) {
    lod.levels[0].object.traverse((o) => {
      if (!o.isMesh) return;
      const pos = o.geometry.attributes.position;
      const e = o.matrixWorld.elements;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);
        v.x = e[0] * x + e[4] * y + e[8] * z + e[12];
        v.y = e[1] * x + e[5] * y + e[9] * z + e[13];
        v.z = e[2] * x + e[6] * y + e[10] * z + e[14];
        z0 = Math.min(z0, v.z);
        z1 = Math.max(z1, v.z);
        if (Math.abs(v.y - city.info('plaza').h) < 0.005) corners.add(`${Math.round(v.x * 50)}|${Math.round(v.z * 50)}`);
      }
    });
  }
  const len = plan.len;
  ok(near(z0, -len, 0.05) && near(z1, 0, 0.05), `${where}: Ortsstücke reichen von ${z1.toFixed(2)} bis ${z0.toFixed(2)} statt 0 … ${-len}`);
  for (const s of plan.layout.squares) {
    for (const [x, z] of [[s.x0, s.z0], [s.x1, s.z0], [s.x0, s.z1], [s.x1, s.z1]]) ok(corners.has(`${Math.round(x * 50)}|${Math.round(z * 50)}`), `${where}: Platzecke (${x}, ${z}) nicht im Mesh`);
  }
  const signs = group.children.filter((c) => c.name === 'townSign' || c.name === 'townExit');
  ok(signs.length === 2 && signs.every((c) => c.userData.info.text === plan.layout.name && plan.layout.name === L.signName(name)), `${where}: Ortsschild zeigt ${signs.map((c) => c.userData.info.text)} statt ${plan.layout.name}`);
  ok(group.fountains.length === plan.layout.fountains.length && group.fountains.every((f, i) => near(f.x, plan.layout.fountains[i].x) && near(f.z, plan.layout.fountains[i].z)), `${where}: Brunnenliste weicht vom Lageplan ab`);
  meshChecks.push(`${key} (${size}): Straße 0 … ${-len} m, ${plan.layout.squares.length} Plätze, ${plan.layout.buildings.length} Häuser`);
}

// Rastanlage: Plan, Lageplan und gebaute Meshes. Die Zufahrt liegt im Mesh genau auf x 6 … 12 und endet bei z = 0 und
// z = −len in Höhe 0 (dort schließt der Straßenbau an), nichts ragt auf die Fahrbahn oder aus dem Abschnitt, die
// Heldenbucht liegt im Ladepark und die Säule an der linken hinteren Ecke des rückwärts eingeparkten Autos, die
// Kamera der Nahaufnahme steht 2–4 m vor der Säule in 1,2 m Höhe, die Tür liegt am Gehweg vor der Raststätte.
const restChecks = [];
for (const [name, seed] of [['Kirchheim', undefined], ['Gründau', 3], ['Hannover', 11], ['Fulda', 29]]) {
  const plan = city.planRest({ name, seed });
  const where = `Rastanlage ${name}`;
  const Lr = plan.layout;
  const R = L.REST;
  ok(JSON.stringify(city.planRest({ name, seed })) === JSON.stringify(plan), `${where}: Plan nicht reproduzierbar`);
  ok(Lr.streets.length === 1 && near(Lr.streets[0].width, R.road[1] - R.road[0]), `${where}: Schleife fehlt`);
  const pts = Lr.streets[0].pts;
  ok(near(pts[0][0], R.lane) && near(pts[0][1], 0) && near(pts[pts.length - 1][1], -plan.len), `${where}: Schleife endet nicht bei 0 und ${-plan.len}`);
  // nichts auf der Zufahrt (Laternen zählen mit dem Fuß), nichts außerhalb des Abschnitts, Gebäude nicht übereinander
  const solid = [];
  for (const it of plan.items) {
    const inf = city.info(it.name);
    const b = OVER.has(inf.kind) ? [it.x - 0.3, it.x + 0.3, it.z - 0.3, it.z + 0.3] : box(it.fp);
    ok(b[1] <= R.road[0] + 0.01 || b[0] >= R.road[1] - 0.01, `${where}: ${it.name} ragt auf die Zufahrt`);
    ok(b[2] >= -plan.len - 0.01 && b[3] <= 0.01 && b[0] >= R.x0 - 0.01 && b[1] <= R.x1 + 0.01, `${where}: ${it.name} liegt außerhalb der Anlage`);
    if (inf.kind === 'rest' || inf.kind === 'car' || inf.kind === 'vehicle') solid.push([it, box(it.fp)]);
  }
  for (let i = 0; i < solid.length; i++) for (let j = i + 1; j < solid.length; j++) {
    const [a, ba] = solid[i];
    const [b, bb] = solid[j];
    // Autos und Eimer stehen absichtlich im Ladepark oder unter dem Tankdach
    if ([a.name, b.name].some((n) => n === 'ladepark' || n === 'rasthof_canopy') && [a.name, b.name].some((n) => !n.startsWith('rast') && n !== 'ladepark' && n !== 'lkw_stehend')) continue;
    ok(!overlap(ba, bb, 0.05), `${where}: ${a.name} und ${b.name} überlappen`);
  }
  // Heldenbucht, Säule, Kamera
  const { stop, post, cam } = plan.park;
  const pk = Lr.park;
  ok(pk.bays.some((b) => b.id === pk.hero && b.free && near(b.x, stop.x) && near(b.z, stop.z)), `${where}: Haltepunkt nicht in der freien Heldenbucht`);
  ok(stop.x > pk.x0 && stop.x < pk.x1 && stop.z > pk.z0 && stop.z < pk.z1, `${where}: Haltepunkt außerhalb des Ladeparks`);
  // Auto 4,7 × 1,9 m, Bug nach (−sin ry, −cos ry): linke hintere Ecke
  const fx = -Math.sin(stop.ry);
  const fz = -Math.cos(stop.ry);
  const lx = -Math.cos(stop.ry);
  const lz = Math.sin(stop.ry);
  const corner = [stop.x - fx * 2.35 + lx * 0.95, stop.z - fz * 2.35 + lz * 0.95];
  const dPost = Math.hypot(post.x - corner[0], post.z - corner[1]);
  ok(dPost < 0.8, `${where}: Säule ${dPost.toFixed(2)} m von der Ladeklappe`);
  const dCam = Math.hypot(cam.pos[0] - post.x, cam.pos[2] - post.z);
  ok(dCam >= 2 && dCam <= 4 && cam.pos[1] - stop.y > 1.1 && cam.pos[1] - stop.y < 1.35, `${where}: Kamera ${dCam.toFixed(2)} m vor der Säule, ${(cam.pos[1] - stop.y).toFixed(2)} m hoch`);
  for (const it of plan.items) {
    if (it.name === 'ladepark' || it.name === 'popcorn_eimer' || it.name === 'popcorn_post' || city.info(it.name).kind === 'ground') continue;
    ok(!L.segHitsBox(cam.pos[0], cam.pos[2], post.x, post.z, it.fp, 0.1), `${where}: ${it.name} verstellt die Nahaufnahme`);
  }
  ok(Math.hypot(plan.park.popcorn[0] - post.x, plan.park.popcorn[2] - post.z) < 1.2, `${where}: Popcorn-Eimer nicht an der Säule`);
  const pm = plan.items.filter((it) => it.name === 'popcorn_post');
  ok(pm.length === 1 && Math.hypot(pm[0].x - post.x, pm[0].z - post.z) < 0.005, `${where}: Popcorn-Maschine nicht oben auf der Heldensäule`);
  // Tür am Gehweg
  const [dx, dz] = Lr.shop.door;
  ok(Lr.paved.some((p) => p.kind === 'walk' && near(p.x1, dx, 0.05) && dz > p.z0 && dz < p.z1), `${where}: Tür ${dx}, ${dz} liegt nicht am Gehweg`);
  // gebaute Meshes
  const group = city.buildRest(plan);
  group.updateMatrixWorld(true);
  const lod = group.children.find((c) => c.isLOD);
  const at = new Set();
  let z0 = Infinity;
  let z1 = -Infinity;
  for (const lv of lod.levels) lv.object.traverse((o) => {
    if (!o.isMesh) return;
    const pos = o.geometry.attributes.position;
    const e = o.matrixWorld.elements;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const wx = e[0] * x + e[4] * y + e[8] * z + e[12];
      const wy = e[1] * x + e[5] * y + e[9] * z + e[13];
      const wz = e[2] * x + e[6] * y + e[10] * z + e[14];
      z0 = Math.min(z0, wz);
      z1 = Math.max(z1, wz);
      at.add(`${lv.distance}|${Math.round(wx * 50)}|${Math.round(wy * 100)}|${Math.round(wz * 50)}`);
    }
  });
  for (const lv of lod.levels) {
    for (const [x, y, z] of [[R.road[0], 0, 0], [R.road[1], 0, 0], [R.road[0], 0, -plan.len], [R.road[1], 0, -plan.len], [R.road[0], R.pave, -R.ramp], [R.road[1], R.pave, -plan.len + R.ramp]]) {
      ok(at.has(`${lv.distance}|${Math.round(x * 50)}|${Math.round(y * 100)}|${Math.round(z * 50)}`), `${where}: Stufe ${lv.distance}: Zufahrt hat keinen Eckpunkt bei (${x}, ${y}, ${z})`);
    }
  }
  ok(z1 <= 0.05 && z0 >= -plan.len - 0.05, `${where}: Meshes reichen von ${z1.toFixed(2)} bis ${z0.toFixed(2)} statt 0 … ${-plan.len}`);
  ok(group.stop.pos.distanceTo({ x: stop.x, y: stop.y, z: stop.z }) < 1e-6 && near(group.post.x, post.x) && near(group.door.x, dx), `${where}: Group weicht vom Plan ab`);
  restChecks.push(`${plan.title}: ${plan.items.length} Teile, Halt (${stop.x}, ${stop.z}), Säule ${dPost.toFixed(2)} m von der Klappe, Kamera ${dCam.toFixed(2)} m`);
}

// Jeder Baustein, nah und fern: die Geometrie liegt in dem Rahmen, den info angibt. Häuser, Bodenkacheln, Wahrzeichen und
// Raststätten-Teile haben den Ursprung in der Mitte der Vorderkante (x ∈ ±w/2, z ∈ [−d, 0]), alles andere (und info.centre)
// in der Mitte der Grundfläche, Laternen am Mast (der Arm reicht nach +z über die Fahrbahn). Erlaubt: Dachüberstand 1,3 m
// nach hinten (Alpenhäuser), Markisen und Vordächer bis 2,7 m über den Gehweg (vorn), Seitenteile 2 m, Wasser und Gräben
// bis 1,6 m unter dem Boden, 1 m über h.
const FRONT = new Set(['village', 'shop', 'town', 'city', 'region', 'landmark', 'rest']);
let blocks = 0;
for (const kitName of ['town', 'street', 'fountains', 'people', 'landmarks', 'rest']) {
  const kit = city[kitName];
  for (const name of kit.list()) {
    const inf = kit.info(name);
    if (inf.kind === 'part' || inf.kind === 'ground') continue;
    for (const far of [false, true]) {
      const g = kit.geo(name, far);
      if (!g || (far && g === kit.geo(name))) continue;
      blocks++;
      const b = [Infinity, -Infinity, Infinity, -Infinity, Infinity, -Infinity];
      for (const geo of [g.tint, g.fixed, g.gloss, g.water, g.light]) {
        const p = geo && geo.attributes.position.array;
        if (!p) continue;
        for (let i = 0; i < p.length; i += 3) {
          b[0] = Math.min(b[0], p[i]);
          b[1] = Math.max(b[1], p[i]);
          b[2] = Math.min(b[2], p[i + 1]);
          b[3] = Math.max(b[3], p[i + 1]);
          b[4] = Math.min(b[4], p[i + 2]);
          b[5] = Math.max(b[5], p[i + 2]);
        }
      }
      const front = FRONT.has(inf.kind) && !inf.centre;
      const [z0, z1] = front ? [-inf.d - 1.3, 2.7] : inf.kind === 'lamp' ? [-1.0, inf.d + 0.3] : [-inf.d / 2 - 1.3, inf.d / 2 + 1.3];
      const where = `${name}${far ? ' (fern)' : ''}`;
      ok(b[0] >= -inf.w / 2 - 2.0 && b[1] <= inf.w / 2 + 2.0, `${where}: x ${b[0].toFixed(2)} … ${b[1].toFixed(2)} passt nicht zu w = ${inf.w}`);
      ok(b[4] >= z0 && b[5] <= z1, `${where}: z ${b[4].toFixed(2)} … ${b[5].toFixed(2)} passt nicht zu d = ${inf.d} (${front ? 'Vorderkante' : 'Mitte'})`);
      ok(b[2] >= -1.6 && b[3] <= inf.h + 1.0, `${where}: y ${b[2].toFixed(2)} … ${b[3].toFixed(2)} passt nicht zu h = ${inf.h}`);
    }
  }
}

// Gelände der Wahrzeichen (Berge, Hügel, Dünen): läuft vorn und an den Seiten auf Bodenhöhe aus – von der Straße aus
// (die Stücke stehen mit der Vorderseite zu ihr) darf keine offene Schnittkante zu sehen sein. Hinten darf ein Grat enden.
const { terrainEdges } = await import('../src/world/kit/landmarks.js');
for (const e of terrainEdges) {
  const where = `${e.name}${e.lod ? ' (fern)' : ''}`;
  const open = ['front', 'left', 'right'].filter((k) => !e.closed.includes(k) && e[k] > 0.3);
  ok(!open.length, `${where}: Gelände endet offen (vorn ${e.front.toFixed(2)}, links ${e.left.toFixed(2)}, rechts ${e.right.toFixed(2)} m)`);
}

const avg = stats.sight.sum / Math.max(1, stats.sight.n);
console.log(`Orte: ${PLACES.length} · Pläne: ${stats.plans} (je Ort 4 Größen × ${SEEDS} Keime, mit und ohne Ziel) · ${((Date.now() - t0) / 1000).toFixed(1)} s`);
console.log(`Brunnen gesamt: ${stats.fountains} · je Größe: ${SIZES.map((s) => `${s} ${(stats.perSize[s] / (PLACES.length * SEEDS)).toFixed(2)}`).join(', ')} je Ort`);
console.log('Arten:', Object.entries(stats.kinds).map(([k, v]) => `${k} ${v}`).join(', '));
console.log('Sonderbrunnen:', JSON.stringify(stats.specials));
console.log(`Hauptbrunnen frei zu sehen ab: mindestens ${stats.sight.min} m, im Mittel ${avg.toFixed(1)} m vor dem Brunnen`);
console.log('Lageplan gegen Meshes:', meshChecks.join(' · '));
console.log('Rastanlagen:', restChecks.join(' · '));
console.log(`Bausteine: ${blocks} Fassungen, Geometrie im Rahmen von info (Ursprung, w, d, h); ${terrainEdges.length} Gelände ohne offene Ränder`);
console.log('Zielbrunnen-Arten:', Object.entries(goalKinds).map(([k, v]) => `${k} ${v}`).join(', '));
console.log(`Orte in der XXL-Welt: ${xxl.towns} mit Insel und als Startort, ${xxl.houses} Häuser, ${xxl.fountains} Brunnen, je einer davon das Ziel auf der Insel, ${xxl.posts} Ladesäulen mit Popcorn-Maschine, am Halt im Seitenfenster bei ${xxl.side.map((d) => d.toFixed(1)).join('–')}°; Lebenslauf: ${xxl.parts} Teile in Schritten gebaut, starr im gescherten Rahmen; Plan in Raten: ${xxl.calls} Aufrufe für Hanau, derselbe Plan`);
console.log('Hauptbrunnen der Orte (auf der Insel am Ziel):', Object.entries(islands).map(([k, v]) => `${k} ${v}`).join(', '));
console.log(fails ? `${fails} FEHLER` : 'Alles in Ordnung: jeder Ort hat mindestens einen Brunnen, frei sichtbar und beleuchtet.');
process.exit(fails ? 1 : 0);
