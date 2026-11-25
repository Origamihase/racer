// Prüfstand „Ladepreis“ (Besitzer, 25.11.2026: „Verwende für Deutschland 0,46 bis 0,59 €/kWh (mit Ladekarte). Im
// Ausland soll der Preis höher sein“ – „Der Preis könnte auf der leeren Tafel, die sich auf der Ladesäule befindet,
// ausgeschrieben werden. x €/kWh (oder eine andere Währung im Ausland)“):
// 1. Jeder Ladepark und jede Säule eines Orts hat einen festen Preis (aus ihrem Namen, nie gewürfelt): in Deutschland
//    0,46 … 0,59 €/kWh in Cent-Schritten, im Ausland umgerechnet 0,65 … 0,79 € in einem runden Betrag der
//    Landeswährung; Währungen gibt es genau für die Länder, in denen Ladeplätze stehen. Die Rechnung (James, Abspann)
//    bucht kWh × Preis in Euro und nennt den Preis der Säule, im Ausland in ihrer Währung. Eine Quelle: der Akku nimmt
//    den Preis beim Einstecken aus map/ladepreis.js.
// 2. Die Bildschirme aller Säulen eines Parks (Ort, Startort, Ladepark) zeigen seinen Preis: ein Mesh je Park genau
//    über den dunklen Flächen, aufrecht, ungespiegelt, nach vorn; ein Bild je Preis, geteilt und mit dem letzten Ort
//    freigegeben; weiter weg als PREIS_SCREEN.far dunkel (und nie, solange das Ortsstück schon fern ist).
// 3. Ein Gebot hat immer ein Ziel: Plant L vor dem ersten Gebot einen Ladepark hinter dem Wagen ein, fand die erste
//    Runde keinen Ort mehr und der Stream stürzte beim Gebot ab (navi.js overbid mit undefined). Jetzt wählt sie dann
//    nach der Entfernung, rechnet nur wenige Routen, und gäbe es gar nichts, nimmt der Bieter einen anderen Ort.
// 4. Die Anleitung (README) nennt die Preise aus dem Code: Laden, Rempler, Kratzer, Blitzerfoto, Verwarngeld.
// node tools/ladepreis-test.mjs
import { readFileSync } from 'node:fs';

let fails = 0;
let checks = 0;
function ok(cond, msg) {
  checks++;
  if (cond) return;
  fails++;
  console.error('FEHLER: ' + msg);
}
const src = (f) => readFileSync(new URL('../' + f, import.meta.url), 'utf8');
const NB = ' ';
const cent = (v) => Math.round(v * 100);

// --- 1. Preise je Ladeplatz -----------------------------------------------------------------------------------------
const { LADEPREIS, WAEHRUNG, LANDESWAEHRUNG, EURO_LAENDER, waehrungOf, preisFuer, ladePreis, fmtWaehrung } = await import('../src/map/ladepreis.js');
const { nodes, places } = await import('../src/map/graph.js');
const { PARKS } = await import('../src/map/parks.js');
const { fmtCent, fmtKwh } = await import('../src/util.js');
let summary = '';
{
  ok(LADEPREIS.de[0] === 0.46 && LADEPREIS.de[1] === 0.59 && LADEPREIS.ausland[0] > LADEPREIS.de[1], `Bänder ${JSON.stringify(LADEPREIS)}`);
  ok(/Verwende für Deutschland 0,46 bis 0,59 €\/kWh \(mit Ladekarte\)\.\s+\/\/ Im Ausland soll der Preis höher sein/.test(src('src/map/ladepreis.js')), 'der Wunsch des Besitzers steht nicht über den Preisen');
  const all = [
    ...PARKS.map((p, i) => ({ what: p.name, cc: nodes[p.node].cc, P: ladePreis({ park: i }) })),
    ...places.map((p) => ({ what: 'Säule ' + p.name, cc: p.cc, P: ladePreis({ post: p.i }) })),
  ];
  ok(all.length === PARKS.length + places.length && all.every((x) => x.P && x.P.cc === x.cc), 'nicht jeder Ladeplatz hat einen Preis aus seinem Land');
  const de = all.filter((x) => x.cc === 'DE');
  const ab = all.filter((x) => x.cc !== 'DE');
  const deVals = new Set(de.map((x) => cent(x.P.euro)));
  ok(de.every((x) => x.P.cur === 'EUR' && x.P.local === x.P.euro && Number.isInteger(Math.round(x.P.euro * 100)) && Math.abs(x.P.euro * 100 - Math.round(x.P.euro * 100)) < 1e-9 && x.P.euro >= 0.46 - 1e-9 && x.P.euro <= 0.59 + 1e-9), 'Deutschland: Preis außerhalb von 0,46 … 0,59 € oder nicht in Cent-Schritten');
  ok(deVals.size === 14, `Deutschland: nur ${deVals.size} der 14 Preise kommen vor`);
  ok(de.every((x) => x.P.label === x.P.num + NB + '€/kWh' && /^0,(4[6-9]|5\d)$/.test(x.P.num)), `Deutschland: Schreibweise ${de[0].P.label}`);
  ok(ab.length > 100 && ab.every((x) => x.P.euro >= 0.65 - 1e-9 && x.P.euro <= 0.79 + 1e-9), `Ausland: umgerechnet außerhalb von 0,65 … 0,79 € (${ab.filter((x) => x.P.euro < 0.65 - 1e-9 || x.P.euro > 0.79 + 1e-9).map((x) => x.what + ' ' + x.P.label).join(', ')})`);
  // ein runder Betrag der Landeswährung, in deren Schreibweise
  const roundLocal = (P) => {
    const W = WAEHRUNG[P.cur];
    const k = P.local / W.step;
    return Math.abs(k - Math.round(k)) < 1e-6 && P.label === fmtWaehrung(P.local, P.cur) + '/kWh' && Math.abs(P.euro - P.local / W.kurs) < 1e-12;
  };
  ok(ab.every((x) => roundLocal(x.P)), `Ausland: kein runder Preis der Landeswährung (${ab.filter((x) => !roundLocal(x.P)).map((x) => x.P.label).slice(0, 3).join(', ')})`);
  // Ladepark Salzburg steht an einer Ausfahrt in Deutschland: deutscher Preis, obwohl er nach Salzburg heißt
  const sbg = PARKS.findIndex((p) => p.name === 'Ladepark Salzburg');
  ok(sbg >= 0 && ladePreis({ park: sbg }).cc === 'DE' && ladePreis({ park: sbg }).euro <= 0.59, 'Ladepark Salzburg: das Land der Ausfahrt zählt');
  // Beispiele wie dem Besitzer versprochen: die Schweiz in Franken, Tschechien in Kronen, Österreich in Euro (teurer)
  const of = (cc) => ab.find((x) => x.cc === cc).P;
  ok(/^0,\d\d CHF\/kWh$/.test(of('CH').label.replace(NB, ' ')) && /^\d\d,\d0 Kč\/kWh$/.test(of('CZ').label.replace(NB, ' ')) && of('AT').cur === 'EUR' && of('AT').euro >= 0.65, `Beispiele: ${of('CH').label}, ${of('CZ').label}, ${of('AT').label}`);
  // fest: zweimal gefragt dasselbe, auch ohne Zufall (Math.random darf nicht vorkommen)
  const rnd = Math.random;
  Math.random = () => {
    throw new Error('Zufall im Ladepreis');
  };
  let same = true;
  try {
    for (const x of all.slice(0, 40)) same &&= JSON.stringify(preisFuer(x.cc, x.what)) === JSON.stringify(preisFuer(x.cc, x.what));
  } catch (e) {
    same = false;
  }
  Math.random = rnd;
  ok(same && ladePreis({ park: 3 }) === ladePreis({ park: 3 }) && ladePreis({ post: 7 }).label === ladePreis({ post: 7 }).label, 'Preis nicht fest');
  ok(ladePreis({}) === null && ladePreis({ park: -1, post: -1 }) === null, 'ohne Ladeplatz ein Preis');
  // Währungen genau für die Länder mit Ladeplätzen: jedes Land in einer Liste, jede Währung gebraucht
  const ccs = new Set(all.map((x) => x.cc));
  const unknown = [...ccs].filter((cc) => !EURO_LAENDER.includes(cc) && !(cc in LANDESWAEHRUNG));
  const both = EURO_LAENDER.filter((cc) => cc in LANDESWAEHRUNG);
  const idle = Object.keys(WAEHRUNG).filter((c) => ![...ccs].some((cc) => waehrungOf(cc) === c));
  const ghost = [...EURO_LAENDER, ...Object.keys(LANDESWAEHRUNG)].filter((cc) => !ccs.has(cc));
  ok(!unknown.length && !both.length && !idle.length && !ghost.length, `Währungen: ohne Liste ${unknown}, doppelt ${both}, unbenutzt ${idle}, Land ohne Ladeplatz ${ghost}`);
  ok(Object.values(WAEHRUNG).every((W) => W.kurs > 0 && W.step > 0 && Number.isInteger(W.dec) && W.zeichen), 'Währungstabelle unvollständig');
  const curs = [...new Set(ab.map((x) => x.P.cur))].sort();
  summary = `${PARKS.length} Parks + ${places.length} Säulen; DE ${de.length} (14 Preise), Ausland ${ab.length} in ${curs.length} Währungen (${curs.join(' ')}); z. B. ${of('CH').label}, ${of('CZ').label}, ${of('AT').label}, ${of('JP').label}`;
}

// --- 2. Die Rechnung nimmt den Preis des Ladeplatzes ------------------------------------------------------------------
const { ladeKosten, ladeCount, ladePreisText } = await import('../src/data.js');
const { makeStream, DRIVERS } = await import('./stream-sim.mjs');
let bill = '';
{
  ok(!/export const LADEN\b|euroPerKwh:\s*\d/.test(src('src/data.js')) && !/LADEN\./.test(src('src/game/parts/ziel.js') + src('src/game/akku.js')), 'ein fester Preis neben map/ladepreis.js');
  ok(/price: ladePreis\(\{ park: e\.park, post \}\)/.test(src('src/game/akku.js')) && /price: c\.price/.test(src('src/game/akku.js')), 'der Akku nimmt den Preis nicht beim Einstecken aus ladePreis');
  // ein Stream, der an einem Ladepark in der Schweiz und an der Säule eines deutschen Orts lädt (payCharge wie Akku)
  const S = makeStream({ driver: DRIVERS.zuegig, seed: 4, endless: true });
  const g = S.game;
  S.step(2);
  const ch = PARKS.findIndex((p) => nodes[p.node].cc === 'CH');
  const P = ladePreis({ park: ch });
  const cap = g.player.capacity;
  const a = g.payCharge(95, { name: PARKS[ch].name, price: P });
  S.step(1.5);
  const want = ladeKosten(95, cap, P.euro);
  ok(a.euro === want.euro && want.euro === Math.round(0.95 * cap * (P.local / WAEHRUNG.CHF.kurs) * 100) / 100 && g.breakdown.Ladestrom === -want.euro, `Schweiz: ${JSON.stringify(a)} statt ${JSON.stringify(want)}`);
  const james = S.log.chat.filter((m) => m.bot === 'james' && m.text.startsWith('Ladestrom')).pop();
  const local = fmtWaehrung(want.kwh * P.local, 'CHF');
  ok(james && james.text.startsWith(`Ladestrom (${PARKS[ch].name}): ${fmtKwh(want.kwh)} × ${P.label} = ${local} ≈ ${fmtCent(want.euro)} – `), `James in der Schweiz: ${james && james.text}`);
  ok(g.ladeBill.n === 1 && g.ladeBill.preis === P.label && ladePreisText(g.ladeBill) === 'à ' + P.label, `Rechnung nach einem Stopp: ${JSON.stringify(g.ladeBill)}`);
  ok(ladeCount(1, want.kwh, ladePreisText(g.ladeBill)) === `1 Ladestopp · ${fmtKwh(want.kwh)} à ${P.label}`, `Abspann: ${ladeCount(1, want.kwh, ladePreisText(g.ladeBill))}`);
  // dieselbe Säule noch einmal: der Preis bleibt stehen; dann eine deutsche Säule: der Schnitt in Euro
  g.payCharge(40, { name: PARKS[ch].name, price: P });
  ok(g.ladeBill.n === 2 && g.ladeBill.preis === P.label, 'zweimal dieselbe Säule: der Preis fehlt');
  const de = places.findIndex((p) => p.cc === 'DE');
  const D = ladePreis({ post: de });
  const b = g.payCharge(60, { name: 'Ladesäule in ' + places[de].name, price: D });
  S.step(1.5);
  const L = g.ladeBill;
  const avg = L.amount / L.kwh;
  ok(L.n === 3 && L.preis === '' && ladePreisText(L) === `· Ø ${avg.toFixed(2).replace('.', ',')}${NB}€/kWh` && avg > D.euro && avg < P.euro, `verschiedene Preise: ${JSON.stringify(L)} → ${ladePreisText(L)}`);
  const jd = S.log.chat.filter((m) => m.bot === 'james' && m.text.startsWith('Ladestrom')).pop();
  ok(b.euro === ladeKosten(60, cap, D.euro).euro && jd && jd.text.startsWith(`Ladestrom (Ladesäule in ${places[de].name}): ${fmtKwh(b.kwh)} × ${D.label} = ${fmtCent(b.euro)} – `), `James in Deutschland: ${jd && jd.text}`);
  ok(Math.abs(g.breakdown.Ladestrom + L.amount) < 0.005 && cent(L.amount) === cent(a.euro) + cent(ladeKosten(40, cap, P.euro).euro) + cent(b.euro), `Summe ${L.amount} €`);
  bill = `${PARKS[ch].name} ${P.label}: ${fmtKwh(want.kwh)} → ${local} ≈ ${fmtCent(want.euro)}; mit ${D.label} dazu: ${ladeCount(L.n, L.kwh, ladePreisText(L))}`;
}

// --- 3. Der Preis auf den Bildschirmen der Säulen (rest.js priceScreens) -------------------------------------------
// Minimaler DOM-Ersatz wie in citykit-test; fillText merkt sich, was auf die Bildschirme geschrieben wird
const drawn = [];
const ctx = new Proxy({ fillText: (t) => drawn.push(String(t)) }, {
  get(t, k) {
    if (k === 'measureText') return (str) => ({ width: String(str).length * 10 });
    if (k === 'createLinearGradient' || k === 'createRadialGradient') return () => ({ addColorStop() {} });
    if (k in t) return t[k];
    return () => {};
  },
  set(t, k, v) {
    t[k] = v;
    return true;
  },
});
globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => ctx, style: {} }) };
const { postScreen, PREIS_SCREEN } = await import('../src/world/kit/rest.js');
const { cityKit, townPlan, parkPlan } = await import('../src/world/xxl/towns.js');
const { STREET } = await import('../src/world/kit/layout.js');
let screens = '';
{
  const K = cityKit();
  const D = postScreen('dc');
  const A = postScreen('ac');
  // die dunkle Fläche liegt im Rahmen und davor; die kleine Säule nimmt dasselbe Bild (höchstens 4 % gestaucht)
  for (const S of [D, A]) ok(S.w < S.frame.w && S.h < S.frame.h && S.y > S.frame.y && S.y + S.h < S.frame.y + S.frame.h && S.z > S.frame.z, `Bildschirm nicht im Rahmen: ${JSON.stringify(S)}`);
  ok(Math.abs(A.w / A.h / (D.w / D.h) - 1) < 0.04, `AC-Bildschirm verzerrt das Bild: ${(A.w / A.h).toFixed(3)} gegen ${(D.w / D.h).toFixed(3)}`);
  // die Fernfassung der Ortsstücke (city.js: 260 m ab der Mitte eines 100-m-Stücks) steht nie, solange der Preis steht
  const built = [];
  const parkIn = (plan) => plan.items.find((it) => /^ladepark/.test(it.name));
  const build = (plan) => {
    const g = K.buildTown(plan, { lazy: true });
    while (g.step());
    g.updateMatrixWorld(true);
    built.push(g);
    const lods = [];
    g.traverse((o) => {
      if (o.isLOD && /^Ladepreis/.test(o.name)) lods.push(o);
    });
    return { g, lods };
  };
  // a) der Startort (Erlensee), ein Ladepark in Deutschland und einer in der Schweiz: der Plan trägt den Preis der Säule
  const erl = places.find((q) => q.key === 'Erlensee');
  const pStart = townPlan(K, { kind: 'stadt', place: erl.i, s0: -300, s1: 400, start: true, spotS: 0 });
  const deP = PARKS.findIndex((p) => nodes[p.node].cc === 'DE');
  const chP = PARKS.findIndex((p) => nodes[p.node].cc === 'CH');
  const pDe = parkPlan(K, { kind: 'park', park: deP, s0: 0, s1: 250 });
  const pCh = parkPlan(K, { kind: 'park', park: chP, s0: 0, s1: 250 });
  const want = [[pStart, ladePreis({ post: erl.i }), 'Erlensee'], [pDe, ladePreis({ park: deP }), PARKS[deP].name], [pCh, ladePreis({ park: chP }), PARKS[chP].name]];
  for (const [plan, P, where] of want) {
    const it = parkIn(plan);
    ok(it && it.extras && it.extras.price === P && !('s' in it), `${where}: der Park trägt nicht den Preis seiner Säule (${it && it.extras && it.extras.price && it.extras.price.label})`);
    const ci = Math.floor(-it.z / 100);
    const dChunk = Math.hypot(it.x - (STREET.curbL + STREET.curbR) / 2, it.z + (ci + 0.5) * 100);
    ok(PREIS_SCREEN.far + dChunk + 24 / 2 < 260, `${where}: der Preis steht noch, wenn das Ortsstück schon fern ist (${PREIS_SCREEN.far} + ${dChunk.toFixed(1)} m)`);
  }
  // b) gebaut: eine LOD je Park (nah: ein Mesh mit einem Rechteck je Säule; ab far: leer), aufrecht und ungespiegelt
  for (const [plan, P, where] of want) {
    const { lods } = build(plan);
    const lod = lods[0];
    ok(lods.length === 1 && lod.name === 'Ladepreis ' + P.label && lod.levels.length === 2 && lod.levels[0].distance === 0 && lod.levels[1].distance === PREIS_SCREEN.far && lod.levels[1].object.children.length === 0 && !lod.levels[1].object.isMesh, `${where}: LOD der Bildschirme ${lods.map((o) => o.name)}`);
    if (!lod) continue;
    const mesh = lod.levels[0].object;
    const geo = mesh.geometry;
    const pos = geo.attributes.position;
    const uv = geo.attributes.uv;
    const nrm = geo.attributes.normal;
    const idx = geo.index.array;
    ok(mesh.isMesh && pos.count === 20 && idx.length === 30 && geo.userData.merged && geo.boundingSphere.radius > 14, `${where}: ein Mesh mit fünf Rechtecken, eigene Geometrie mit Puffer für die Krümmung`);
    // je Säule: das Rechteck genau über ihrer dunklen Fläche, nach +z, u wächst nach rechts, v nach oben, Vorderseite +z
    const posts = K.info('ladepark_start').posts;
    let fine = posts.length === 5;
    posts.forEach(([x, z, , kind], i) => {
      const S = postScreen(kind);
      const v = (k) => [pos.getX(4 * i + k), pos.getY(4 * i + k), pos.getZ(4 * i + k)];
      const [a, b, c, d] = [0, 1, 2, 3].map(v);
      const ground = K.info('ladepark_start').ground;
      fine &&= Math.abs(a[0] - (x - S.w / 2)) < 1e-6 && Math.abs(b[0] - (x + S.w / 2)) < 1e-6 && Math.abs(a[1] - (ground + S.y)) < 1e-6 && Math.abs(c[1] - (ground + S.y + S.h)) < 1e-6;
      fine &&= [a, b, c, d].every((q) => Math.abs(q[2] - (z + S.z + PREIS_SCREEN.lift)) < 1e-6);
      fine &&= uv.getX(4 * i) === 0 && uv.getX(4 * i + 1) === 1 && uv.getY(4 * i) === 0 && uv.getY(4 * i + 2) === 1 && nrm.getZ(4 * i) === 1;
      const [i0, i1, i2] = [idx[6 * i], idx[6 * i + 1], idx[6 * i + 2]];
      const P0 = [pos.getX(i0), pos.getY(i0)];
      const P1 = [pos.getX(i1), pos.getY(i1)];
      const P2 = [pos.getX(i2), pos.getY(i2)];
      fine &&= (P1[0] - P0[0]) * (P2[1] - P0[1]) - (P1[1] - P0[1]) * (P2[0] - P0[0]) > 0;
    });
    ok(fine, `${where}: ein Bildschirm liegt nicht genau, schaut nicht nach vorn oder ist gespiegelt`);
    // die Gruppe der Zusätze steht wie der Park: nur gedreht, nie gespiegelt oder verzerrt
    const ex = lod.parent;
    const it = parkIn(plan);
    ok(ex && ex.scale.x === 1 && ex.scale.y === 1 && ex.scale.z === 1 && ex.rotation.y === it.ry && ex.position.x === it.x && ex.position.z === it.z, `${where}: Zusätze nicht am Park`);
    ok(mesh.material.userData.textKey === 'preis:' + P.label, `${where}: Bild ${mesh.material.userData.textKey}`);
  }
  ok(['Ladepreis', want[0][1].num, want[0][1].unit, want[2][1].num, want[2][1].unit].every((t) => drawn.includes(t)), `Bildschirm zeigt nicht Zahl und Einheit: ${drawn.slice(0, 8).join(' | ')}`);
  // c) ein Bild je Preis: Parks mit demselben Preis teilen es; frei erst, wenn der letzte Ort mit ihm geht
  const label = want[1][1].label;
  const key = 'preis:' + label;
  const twin = PARKS.findIndex((p, i) => i !== deP && ladePreis({ park: i }).label === label);
  build(parkPlan(K, { kind: 'park', park: twin, s0: 0, s1: 250 }));
  const meshOf = (g) => lodsOf(g)[0].levels[0].object;
  const same = built.filter((g) => lodsOf(g)[0].name === 'Ladepreis ' + label);
  const mat = meshOf(same[0]).material;
  ok(same.length >= 2 && same.every((g) => meshOf(g).material === mat) && mat.userData.users === same.length, `${same.length} Parks mit ${label}: nicht dasselbe Bild (${mat.userData.users} Nutzer)`);
  ok(built.filter((g) => !same.includes(g)).every((g) => meshOf(g).material !== mat), 'Parks mit verschiedenen Preisen teilen ein Bild');
  for (const g of same.slice(0, -1)) K.release(g);
  ok(mat.userData.users === 1 && mat.userData.textMats.get(key) === mat, 'Bild schon frei, solange ein Park es noch zeigt');
  K.release(same.at(-1));
  ok(mat.userData.users === 0 && mat.userData.textMats.get(key) !== mat, 'Bild bleibt nach dem letzten Park im Speicher');
  screens = `Bildschirm DC ${(D.w * 100).toFixed(1)} × ${(D.h * 100).toFixed(1)} cm, AC ${(A.w * 100).toFixed(1)} × ${(A.h * 100).toFixed(1)} cm, Bild ${PREIS_SCREEN.px} px breit je Preis, bis ${PREIS_SCREEN.far} m; ${want.map(([, P, w]) => `${w} ${P.label}`).join(', ')}`;
  function lodsOf(g) {
    const out = [];
    g.traverse((o) => o.isLOD && /^Ladepreis/.test(o.name) && out.push(o));
    return out;
  }
}

// --- 4. Ein Gebot hat immer ein Ziel, auch mit eingeplantem Ladepark vor dem ersten Gebot (navi.js, ziel.js) ------
const { OPENING } = await import('../src/game/navi.js');
let crash = '';
{
  // so stürzte der Stream ab (Zufall 2, zügig): nach 5 s plant L den nächsten Ladepark ein, er liegt hinter dem Wagen
  const S = makeStream({ driver: DRIVERS.zuegig, seed: 2, endless: true });
  const g = S.game;
  const T = S.trip;
  const nv = g.navi;
  S.step(5);
  g.akku.planStop();
  const park = T.stop;
  ok(park >= 0 && nv.opening && !nv.target, `Ausgangslage: Park ${park}, erste Runde ${nv.opening}, Ziel ${nv.target && nv.target.name}`);
  // die Auswahl der ersten Runde findet hier keinen Ort ohne Wenden (das war der Absturz) …
  const ahead = T.cur.sections.filter((c) => c.kind === 'stadt' && !c.spotDone && c.s1 > T.s).map((c) => c.place);
  let runs = 0;
  const whatIf = T.whatIf;
  T.whatIf = (...a) => (runs++, whatIf.apply(T, a));
  const near = nv.nearby(T, T.distances(true), ahead);
  ok(near.size < OPENING.min && runs <= OPENING.pool, `erste Runde mit Park hinter dem Wagen: ${near.size} Orte, ${runs} Routen gerechnet`);
  // … dann steht zur Wahl, was nach der Entfernung passt, ohne jede Route der Karte zu rechnen
  runs = 0;
  nv.listKey = '';
  const list = nv.candidates();
  delete T.whatIf;
  ok(list.length >= OPENING.min && list.every((t) => t.weight > 0 && t.place !== T.home) && runs <= OPENING.pool, `Auswahl: ${list.length} Orte, ${runs} Routen gerechnet`);
  // zehn Minuten weiter: Gebote, Ladestopp im geplanten Park, kein Absturz
  let err = null;
  let first = null;
  let laden = null;
  try {
    for (let i = 0; i < 30 * 600 && !g.over; i++) {
      S.step(1 / 30);
      if (!first && nv.target) first = { t: g.t, name: nv.target.name };
      if (!laden && g.charging) laden = { t: g.t, name: g.charging.name };
    }
  } catch (e) {
    err = e;
  }
  ok(!err && !g.over && first && laden && laden.name === PARKS[park].name && g.stats.parkCharges === 1, `Stream mit eingeplantem Park: ${err ? 'Absturz ' + err.message : 'läuft'}, erstes Gebot ${JSON.stringify(first)}, Laden ${JSON.stringify(laden)}`);
  // gäbe es gar nichts zur Wahl, bietet der Bieter auf einen anderen Ort als das jetzige Ziel und den Startort
  const cand = nv.candidates;
  nv.candidates = () => [];
  const picks = Array.from({ length: 5 }, () => g.pickBidTarget());
  nv.candidates = cand;
  ok(picks.every((t) => t && t !== nv.target && t.place !== T.home && places[t.place]), `ohne Auswahl: ${picks.map((t) => t && t.name).join(', ')}`);
  crash = `Park ${PARKS[park].name} hinter dem Wagen vor dem ersten Gebot: Auswahl ${list.length} Orte, erstes Gebot ${first ? first.name + ' nach ' + first.t.toFixed(0) + ' s' : '–'}, geladen nach ${laden ? laden.t.toFixed(0) + ' s' : '–'}, bis ${g.t.toFixed(0)} s ohne Absturz`;
}

// --- 5. Die Anleitung nennt die Preise aus dem Code (README) --------------------------------------------------------
const { REPARATUR, BUSSGELD, frontalCost } = await import('../src/data.js');
const { fmtNum } = await import('../src/util.js');
{
  const rd = src('README.md').replace(/\s+/g, ' ');
  const [a, b] = LADEPREIS.de;
  ok(rd.includes(`in Deutschland ${fmtNum(a, 2)} bis ${fmtNum(b, 2)} € je kWh, im Ausland mehr`), 'README: Ladepreis in Deutschland fehlt oder stimmt nicht');
  const basel = ladePreis({ park: PARKS.findIndex((p) => p.name === 'Ladepark Basel') });
  ok(rd.includes(`etwa ${basel.label.replace(NB, ' ')}; abgerechnet wird in Euro`), `README: Beispiel im Ausland ist nicht ${basel.label}`);
  // jeder Betrag „… € je Rempler/Kratzer/Blitzerfoto“ und das Verwarngeld wie in data.js, kein alter daneben
  const want = { Rempler: REPARATUR.bump, Kratzer: REPARATUR.mark, Blitzerfoto: BUSSGELD.blitzer };
  const seen = [...rd.matchAll(/(\d[\d.]*) € je (Rempler|Kratzer|Blitzerfoto)/g)].map((m) => [m[2], +m[1].replace('.', '')]);
  ok(seen.length === 3 && seen.every(([k, v]) => want[k] === v), `README: Preise ${JSON.stringify(seen)} statt ${JSON.stringify(want)}`);
  ok(rd.includes(`${BUSSGELD.verwarn} € Verwarngeld`) && !/je geladene kWh|210 €|35 € je/.test(rd), 'README: Verwarngeld oder alte Preise');
  // frontal auf der Landstraße (100 + 85 km/h, data.js FRONTAL)
  const top = Math.floor(frontalCost(185) / 1000) * 1000;
  ok(rd.includes(`bis über ${fmtNum(top)} €`), `README: frontal bis über ${fmtNum(top)} € (${frontalCost(185)} €)`);
  ok(/ins Minus ziehen \(im HUD steht es mit den Einnahmen des laufenden Streams, im Minus rot\); dann bleibt der Shop zu/.test(rd), 'README: Guthaben im Minus und Shop zu');
}

if (fails) {
  console.error(`ladepreis-test: ${fails} von ${checks} Prüfungen fehlgeschlagen`);
  process.exit(1);
}
console.log(`ladepreis-test: alles grün (${checks} Prüfungen: feste Preise je Ladeplatz, Deutschland 0,46–0,59 €, Ausland 0,65–0,79 € in Landeswährung, Rechnung zum Preis der Säule, Preis auf jedem Bildschirm, ein Gebot hat immer ein Ziel, Preise im README)`);
console.log('  ' + summary);
console.log('  ' + bill);
console.log('  ' + screens);
console.log('  ' + crash);
