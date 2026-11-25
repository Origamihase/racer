// Prüfstand „Ladepreis“ (Besitzer, 25.11.2026: „Verwende für Deutschland 0,46 bis 0,59 €/kWh (mit Ladekarte). Im
// Ausland soll der Preis höher sein“ – „Der Preis könnte auf der leeren Tafel, die sich auf der Ladesäule befindet,
// ausgeschrieben werden. x €/kWh (oder eine andere Währung im Ausland)“):
// 1. Jeder Ladepark und jede Säule eines Orts hat einen festen Preis (aus ihrem Namen, nie gewürfelt): in Deutschland
//    0,46 … 0,59 €/kWh in Cent-Schritten, im Ausland umgerechnet 0,65 … 0,79 € in einem runden Betrag der
//    Landeswährung; Währungen gibt es genau für die Länder, in denen Ladeplätze stehen. Die Rechnung (James, Abspann)
//    bucht kWh × Preis in Euro und nennt den Preis der Säule, im Ausland in ihrer Währung. Eine Quelle: der Akku nimmt
//    den Preis beim Einstecken aus map/ladepreis.js.
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

if (fails) {
  console.error(`ladepreis-test: ${fails} von ${checks} Prüfungen fehlgeschlagen`);
  process.exit(1);
}
console.log(`ladepreis-test: alles grün (${checks} Prüfungen: feste Preise je Ladeplatz, Deutschland 0,46–0,59 €, Ausland 0,65–0,79 € in Landeswährung, Rechnung zum Preis der Säule)`);
console.log('  ' + summary);
console.log('  ' + bill);
