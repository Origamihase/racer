// Rubriken von BrunnenTV (src/game/rubriken.js), zur Probe das Brunnen-Interview: Jede Frage passt vor den Ruf, jede
// Übersetzung ist so kurz wie OMIs längster Bordsatz, an jedem Ort der Karte, und kein Platzhalter bleibt stehen. Im
// simulierten Stream läuft jede Interview-Folge in der richtigen Reihenfolge – Frage, „Schöner Brunnen!“, der Brunnen
// plätschert, OMI übersetzt –, und der Ruf „Schöner Brunnen!“ kommt in jeder Folge, mit Rubrik wie ohne (der Besitzer,
// 27.11.2026: „sonst ist es kein BrunnenTV“).
import { places } from '../src/map/graph.js';
import { folgeTexte, fuelle } from '../src/game/brunnentexte.js';
import { INTERVIEW, WUNSCHBRUNNEN, WUENSCHE, WUNSCH, RUBRIKEN, ANTWORT_T, rubrikFor } from '../src/game/rubriken.js';
import { TV } from '../src/world/xxl/brunnentv.js';
import { VOICES, SCHOENER_BRUNNEN } from '../src/data.js';
import { estimateSpeech } from '../src/speech.js';
import { mulberry32 } from '../src/util.js';
import { makeStream, DRIVERS } from './stream-sim.mjs';

let fails = 0;
let checks = 0;
const ok = (c, msg) => {
  checks++;
  if (!c) {
    fails++;
    if (fails <= 25) console.error('FEHLER: ' + msg);
  }
};

// --- Texte an jedem Ort --------------------------------------------------------------------------------------------
const room = (TV.call - TV.line - 0.3) / 1.35;
const fits = (l) => estimateSpeech(l, VOICES.adam.rate) <= room;
let minFragen = Infinity;
for (const p of places) {
  const T = folgeTexte(p);
  const fragen = INTERVIEW.fragen.filter((f) => fits(fuelle(f.q, T, 1)));
  minFragen = Math.min(minFragen, fragen.length);
  ok(fragen.length >= 6, `${p.name}: nur ${fragen.length} Fragen passen vor den Ruf`);
  for (const f of INTERVIEW.fragen) {
    for (const a of f.a) {
      const t = fuelle(a, T, '9.999');
      ok(t.length <= 91, `${p.name}: Übersetzung zu lang (${t.length}): ${t}`);
      ok(!/[{}]/.test(t), `${p.name}: Platzhalter übrig: ${t}`);
      ok(t.startsWith('Übersetzung: „') && t.endsWith('“'), `Übersetzung nicht als Zitat: ${t}`);
    }
    ok(!/[{}]/.test(fuelle(f.q, T, 1)), `${p.name}: Platzhalter in der Frage: ${f.q}`);
  }
}
for (const f of INTERVIEW.fragen) ok(f.a.length >= 2 && f.q.endsWith('?'), `Frage ohne zwei Antworten oder Fragezeichen: ${f.q}`);
ok(new Set(INTERVIEW.fragen.map((f) => f.q)).size === INTERVIEW.fragen.length, 'eine Frage doppelt');
for (const k of ['blubb', 'chatFrage', 'chatAntwort', 'chatNach']) ok(INTERVIEW[k].length >= 3 && INTERVIEW[k].every((l) => l.length <= 48), `${k}: zu wenige oder zu lange Zeilen`);
ok(ANTWORT_T > TV.call + 2 && ANTWORT_T < TV.nomi - 1, `Antwort des Brunnens bei ${ANTWORT_T} s liegt nicht zwischen Ruf und OMI`);
// keine Rubrik ersetzt den Ruf: Er steht in keiner ihrer Zeilen
for (const r of RUBRIKEN) ok(!JSON.stringify(r).includes(SCHOENER_BRUNNEN.say), `${r.key}: Ruf in der Rubrik selbst`);
// Wunschbrunnen: Aufrufe vor dem Ruf, OMIs Sätze mit dem längsten Wunsch und einem langen Ort unter 91 Zeichen
{
  const W = WUNSCHBRUNNEN;
  for (const l of W.aufruf) ok(fits(l), `Aufruf zu lang für die Zeit vor dem Ruf: ${l}`);
  const kurz = Object.values(WUENSCHE).map((w) => w.kurz).reduce((a, b) => (b.length > a.length ? b : a));
  const ort = 'x'.repeat(28);
  for (const l of [...W.omi, ...WUNSCH.omi]) {
    const t = l.replace('{wunsch}', kurz).replaceAll('{ort}', ort);
    ok(t.length <= 91 && !/[{}]/.test(t), `Wunschbrunnen: OMI zu lang oder mit Platzhalter (${t.length}): ${t}`);
  }
  for (const [k, w] of Object.entries(WUENSCHE)) ok(w.erfuellt.length >= 2 && w.wunsch.length <= 44 && w.kurz.length <= 30, `Wunsch ${k}: Zeilen fehlen oder zu lang`);
  for (const k of ['blubb', 'chatAufruf', 'chatNach']) ok(W[k].length >= 3 && W[k].every((l) => l.length <= 48), `Wunschbrunnen ${k}: zu wenige oder zu lange Zeilen`);
  ok(WUNSCH.nicht.every((l) => l.replace('{ort}', ort).length <= 80), 'Wunschbrunnen: Zeile „nicht erfüllt“ zu lang');
  ok(WUNSCH.chance > 0.3 && WUNSCH.chance < 0.9, 'Wunschbrunnen: erfüllt sich immer oder nie');
}
console.log(`  Texte: ${INTERVIEW.fragen.length} Fragen (an jedem Ort mindestens ${minFragen} passend), Übersetzungen ≤ 91 Zeichen`);

// --- Wann eine Folge ein Interview ist -----------------------------------------------------------------------------
{
  const R = mulberry32(7);
  ok(rubrikFor(1, R) === null, 'erste Folge mit Rubrik');
  ok(rubrikFor(5, () => 0, { abroad: true }) === null, 'Rubrik im Ausland');
  ok(rubrikFor(5, () => 0, { last: INTERVIEW }) === null, 'zweimal hintereinander Interview');
  ok(rubrikFor(5, () => 0) === INTERVIEW && rubrikFor(5, () => INTERVIEW.chance + 0.01) === WUNSCHBRUNNEN && rubrikFor(5, () => 0.99) === null, 'Rubrik nicht nach dem Zufall der Folge');
  ok(rubrikFor(1, R, { force: 'interview' }) === INTERVIEW && rubrikFor(1, R, { force: 'wunsch' }) === WUNSCHBRUNNEN, 'erzwungene Rubrik fehlt');
  const n = { interview: 0, wunsch: 0 };
  let last = null;
  let twice = 0;
  for (let i = 0; i < 4000; i++) {
    const r = rubrikFor(2 + i, R, { last });
    if (r && r === last) twice++;
    if (r) n[r.key]++;
    last = r;
  }
  ok(twice === 0, 'Rubrik zweimal hintereinander');
  ok(n.interview > 500 && n.interview < 1000 && n.wunsch > 350 && n.wunsch < 800, `Anteil der Rubriken: ${JSON.stringify(n)} von 4000`);
  console.log(`  Anteil: Interview ${((n.interview / 40)).toFixed(0)} %, Wunschbrunnen ${((n.wunsch / 40)).toFixed(0)} % der Folgen (ab Folge 2, nie zweimal dieselbe hintereinander)`);
}

// --- Im simulierten Stream -----------------------------------------------------------------------------------------
function episodes(sim, n, secs = 2400) {
  const out = [];
  let tv = null;
  for (let t = 0; t < secs && out.length < n; t += 0.5) {
    sim.step(0.5);
    if (sim.game.tv && !tv) tv = { t0: sim.game.tv.t0, t1: Infinity, rubrik: sim.game.tv.rubrik, frage: null };
    if (sim.game.tv && tv) tv.frage = sim.game.tv.frage || tv.frage;
    if (!sim.game.tv && tv) {
      tv.t1 = sim.game.t;
      out.push(tv);
      tv = null;
    }
  }
  return out;
}
{
  let inter = 0;
  for (const [seed, force] of [[3, 'interview'], [8, 'interview'], [4, null], [11, null]]) {
    const sim = makeStream({ driver: DRIVERS.zuegig, seed, endless: true });
    const { game, log } = sim;
    game.forceRubrik = force;
    const eps = episodes(sim, force ? 2 : 4);
    ok(eps.length >= 2, `Seed ${seed}: nur ${eps.length} Folgen`);
    for (const e of eps) {
      const inside = (t) => t >= e.t0 && t <= e.t1 + 0.01;
      const at = (x) => x.t - e.t0;
      const says = log.say.filter((x) => inside(x.t));
      const call = says.filter((x) => x.text === SCHOENER_BRUNNEN.say);
      ok(call.length === 1 && Math.abs(at(call[0]) - TV.call) < 0.6, `Seed ${seed}, Folge um ${e.t0.toFixed(0)} s: Ruf „Schöner Brunnen!“ ${call.length}×`);
      const tvRow = log.tv.find((x) => x.n && Math.abs(x.t - e.t0 - TV.card) < 0.6);
      ok(tvRow && tvRow.rubrik === (e.rubrik ? `${e.rubrik.icon} ${e.rubrik.name}` : ''), `Seed ${seed}: Bauchbinde ohne Rubrik ${JSON.stringify(tvRow)}`);
      if (e.rubrik === WUNSCHBRUNNEN) continue;
      if (e.rubrik !== INTERVIEW) {
        ok(!log.speak.some((x) => inside(x.t) && x.who === 'quelle'), `Seed ${seed}: Brunnen antwortet ohne Interview`);
        continue;
      }
      inter++;
      ok(!!e.frage, `Seed ${seed}: Interview ohne Frage`);
      const q = says.find((x) => e.frage && x.text.startsWith(e.frage.q.split('{')[0]));
      ok(q && at(q) < TV.call && at(q) >= TV.line - 0.1, `Seed ${seed}: Frage nicht vor dem Ruf (${q ? at(q).toFixed(2) : 'fehlt'})`);
      const blubb = log.speak.filter((x) => inside(x.t) && x.who === 'quelle');
      ok(blubb.length === 1 && Math.abs(at(blubb[0]) - ANTWORT_T) < 0.6 && INTERVIEW.blubb.includes(blubb[0].text), `Seed ${seed}: Antwort des Brunnens ${blubb.length}×`);
      const omi = says.filter((x) => x.text.startsWith('Übersetzung:'));
      ok(omi.length === 1 && at(omi[0]) >= TV.nomi - 0.1, `Seed ${seed}: OMI übersetzt ${omi.length}× (${omi.map(at).join(', ')})`);
      ok(q && call.length && blubb.length && omi.length && q.t < call[0].t && call[0].t < blubb[0].t && blubb[0].t < omi[0].t, `Seed ${seed}: Reihenfolge Frage, Ruf, Plätschern, Übersetzung`);
    }
  }
  ok(inter >= 4, `nur ${inter} Interview-Folgen im Stream`);
  console.log(`  Stream: ${inter} Interview-Folgen in der Reihenfolge Frage, „Schöner Brunnen!“, Plätschern, Übersetzung`);
}

// --- Wunschbrunnen im simulierten Stream: Ablauf der Folge, und der Wunsch erfüllt sich wirklich (oder nicht) ------
{
  const res = { regen: 0, raid: 0, geld: 0, nicht: 0 };
  let folgen = 0;
  for (const seed of [3, 5, 9, 12, 21, 30]) {
    const sim = makeStream({ driver: DRIVERS.zuegig, seed, endless: true });
    const { game, log } = sim;
    game.forceRubrik = 'wunsch';
    const eps = [];
    let tv = null;
    const rain = [];
    for (let t = 0; t < 2400 && eps.length < 4; t += 0.5) {
      sim.step(0.5);
      if (game.weather.active) rain.push(game.t);
      if (game.tv && !tv) tv = { t0: game.tv.t0, t1: Infinity, rubrik: game.tv.rubrik };
      if (game.tv && tv && game.tv.wunsch) tv.wunsch = game.tv.wunsch;
      if (!game.tv && tv) {
        tv.t1 = game.t;
        eps.push(tv);
        tv = null;
      }
    }
    // noch etwas weiterfahren, damit sich der letzte Wunsch zeigt
    for (let t = 0; t < 200; t += 0.5) {
      sim.step(0.5);
      if (game.weather.active) rain.push(game.t);
    }
    for (const e of eps) {
      const inside = (t) => t >= e.t0 && t <= e.t1 + 0.01;
      const at = (x) => x.t - e.t0;
      const says = log.say.filter((x) => inside(x.t));
      const call = says.filter((x) => x.text === SCHOENER_BRUNNEN.say);
      ok(call.length === 1, `Wunschbrunnen, Seed ${seed}: Ruf „Schöner Brunnen!“ ${call.length}×`);
      if (e.rubrik !== WUNSCHBRUNNEN) continue;
      folgen++;
      ok(!!e.wunsch && WUENSCHE[e.wunsch.kind], `Seed ${seed}: Wunschbrunnen ohne Wunsch`);
      if (!e.wunsch) continue;
      const aufruf = says.find((x) => WUNSCHBRUNNEN.aufruf.includes(x.text));
      ok(aufruf && at(aufruf) < TV.call, `Seed ${seed}: Aufruf nicht vor dem Ruf`);
      const wish = log.chat.find((m) => inside(m.t) && m.name === e.wunsch.name && m.text === '🪙 Ich wünsche mir ' + WUENSCHE[e.wunsch.kind].wunsch);
      ok(wish && at(wish) < TV.call, `Seed ${seed}: Wunsch nicht im Chat vor dem Ruf`);
      const muenze = log.speak.filter((x) => inside(x.t) && x.who === 'quelle');
      ok(muenze.length === 1 && muenze[0].label === 'Der Brunnen nimmt die Münze' && Math.abs(at(muenze[0]) - ANTWORT_T) < 0.6, `Seed ${seed}: Münze ${muenze.length}×`);
      const omi = says.filter((x) => at(x) >= TV.nomi - 0.1 && WUNSCHBRUNNEN.omi.some((l) => x.text.startsWith(l.split('{')[0].slice(0, 12))));
      ok(omi.length === 1, `Seed ${seed}: OMI erklärt den Wunschbrunnen ${omi.length}×`);
      // die nächste Runde: erfüllt (Hinweis am Rand und die Sache selbst) oder nicht (der Wünschende sagt es im Chat)
      const end = e.t1 + WUNSCH.delay[1] + 60;
      const done = log.toast.find((x) => x.key === 'wunsch' && x.t > e.t1 && x.t < end);
      const nicht = log.chat.find((m) => m.t > e.t1 && m.t < end && m.name === e.wunsch.name && WUNSCH.nicht.some((l) => m.text.startsWith(l.split('{')[0])));
      ok(!!done !== !!nicht, `Seed ${seed}: Wunsch weder erfüllt noch abgesagt (oder beides)`);
      ok(!!done === e.wunsch.ok, `Seed ${seed}: Wunsch erfüllt ${!!done}, ausgelost ${e.wunsch.ok}`);
      if (nicht) res.nicht++;
      if (!done) continue;
      ok(done.t - e.t1 >= WUNSCH.delay[0] - 0.5, `Seed ${seed}: Wunsch zu früh erfüllt (${(done.t - e.t1).toFixed(0)} s)`);
      const kind = Object.keys(WUENSCHE).find((k) => done.text.endsWith(WUENSCHE[k].kurz));
      res[kind]++;
      if (kind === 'regen') ok(rain.some((t) => t > done.t && t < done.t + 20), `Seed ${seed}: Regen gewünscht, aber kein Schauer`);
      if (kind === 'raid') ok(log.toast.some((x) => x.key === 'raid' && x.t >= done.t && x.t < done.t + 10), `Seed ${seed}: Raid gewünscht, aber keiner kam`);
      if (kind === 'geld') ok(log.chat.some((m) => m.bot === 'james' && m.t >= done.t - 0.1 && m.t < done.t + 2 && /Wunschbrunnen/.test(m.text)), `Seed ${seed}: Geldregen ohne Spende`);
    }
  }
  ok(folgen >= 10, `nur ${folgen} Folgen Wunschbrunnen`);
  ok(res.nicht >= 1 && res.regen + res.raid + res.geld >= 4, `Wünsche: ${JSON.stringify(res)}`);
  console.log(`  Wunschbrunnen: ${folgen} Folgen, erfüllt ${res.regen}× Regen, ${res.raid}× Raid, ${res.geld}× Geldregen, ${res.nicht}× nicht`);
}

console.log(fails ? `rubriken-test: ${fails} Fehler (${checks} Prüfungen)` : `rubriken-test: alles gut (${checks} Prüfungen)`);
if (fails) process.exit(1);
