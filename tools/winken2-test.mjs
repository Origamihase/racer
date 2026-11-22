// Winken 2 (die Probefahrt des Besitzers vom 22.11.2026: „Mini Adam winkt weiterhin viel zu oft und streckt seine
// Finger dabei auch nicht aus“), ohne Grafik: node tools/winken2-test.mjs
// 1. Zählen: Ein Stream von 20 Minuten mit Ortsdurchfahrten (tools/winken-sim.mjs) schreibt jeden Arm mit, der
//    hochgeht, mit seinem Anlass – die vier Anlässe der Regel (game/wave.js) und jedes Jubeln (Spende, Ziel). Die
//    Nachbildung (RAISES) muss zu main.js adamMood passen.
// 2. Seltener: In der Fahrt geht der Arm nur zu den vier Anlässen hoch – bei Spenden lächelt und nickt er und schaut aufs
//    Handy, am Ziel hüpft er vor Freude mit beiden Händen am Lenkrad; im Stream höchstens etwa zwei Arme in zehn
//    Minuten (ohne das Intro). Nur der Bananensaft am Ladestopp (im Stand) hebt die Hand noch zum Prost.
import { readFileSync } from 'node:fs';
import { armStream, per10, RAISES } from './winken-sim.mjs';
import { WAVE } from '../src/game/wave.js';
import { Mimic, MOODS } from '../src/models/adamMimic.js';

let fails = 0;
let checks = 0;
const ok = (cond, msg) => {
  checks++;
  if (cond) return;
  fails++;
  console.log('FEHLER:', msg);
};
const src = (f) => readFileSync(new URL('../src/' + f, import.meta.url), 'utf8');
const main = src('main.js');

// --- 1. Jeder Arm, der hochgeht, mit seinem Anlass ------------------------------------------------------------------
console.log('1. Arme im Stream:');
{
  // die Nachbildung passt zu main.js: Jubeln (gesture('cheer')) bei einer Spende bzw. am Ziel genau dann, wenn RAISES es sagt
  const branch = (name) => {
    const a = main.indexOf(`    case '${name}':`, main.indexOf('function adamMood('));
    return main.slice(a, main.indexOf('break;', a));
  };
  ok(/gesture\('cheer'\)/.test(branch('donation')) === (RAISES.spende !== null), `Spende: main.js jubelt ${/gesture\('cheer'\)/.test(branch('donation'))}, Nachbildung ${RAISES.spende}`);
  ok(/gesture\('cheer'\)/.test(branch('cheer')) === RAISES.ziel, `Ziel: main.js jubelt ${/gesture\('cheer'\)/.test(branch('cheer'))}, Nachbildung ${RAISES.ziel}`);
  const known = [...WAVE.why, 'spende', 'ziel'];
  for (const seed of [3, 5]) {
    const r = await armStream({ seed });
    const c = r.count;
    ok(r.minutes > 19.9 && !r.over, `Saat ${seed}: Stream ${r.minutes.toFixed(1)} min${r.over ? ', Ende ' + r.over : ''}`);
    ok(r.towns >= 2 && r.tv >= 1, `Saat ${seed}: ${r.towns} Ortsdurchfahrten, ${r.tv} Folgen`);
    ok(r.raises.every((x) => known.includes(x.why)), `Saat ${seed}: Arm ohne Anlass`);
    ok(c.intro === 1, `Saat ${seed}: Intro ${c.intro}×`);
    console.log(`  Saat ${seed}: ${r.raises.length} Arme in ${r.minutes.toFixed(0)} min (intro ${c.intro}, gehsteig ${c.gehsteig}, chat ${c.chat}, unfall ${c.unfall}, spende ${c.spende}, ziel ${c.ziel}) = ${per10(r).toFixed(1)} je 10 min ohne Intro; ${r.towns} Orte, ${r.tv} Folgen`);
  }
}

// --- 2. Seltener: der Arm nur zum Winken ----------------------------------------------------------------------------
console.log('2. Seltener:');
{
  // kein Jubeln mit dem Arm mehr: weder bei Spenden noch am Ziel (nur raiseBottle am Ladestopp nutzt die Geste)
  const gameSrc = src('game/game.js');
  const mini = src('models/miniAdam.js');
  ok(!/gesture\('cheer'\)/.test(main) && RAISES.spende === null && !RAISES.ziel, 'main.js: kein Jubeln mit dem Arm');
  ok((mini.match(/gesture\('cheer'\)/g) || []).length === 1 && /raiseBottle\(\) \{[^]*?mimic\.gesture\('cheer'\);/.test(mini), 'miniAdam.js: die Faust geht nur mit dem Bananensaft hoch');
  ok(/once\('juice'[^\n]*\n\s*a\.raiseBottle\(\);/.test(main) && (main.match(/raiseBottle\(/g) || []).length === 1, 'main.js: Bananensaft nur im Ladestopp (im Stand)');
  ok(/case 'donation':[^]*?setMood\('nod'/.test(main) && /case 'cheer':[^]*?setMood\('joy'/.test(main) && (gameSrc.match(/onMood\('cheer'/g) || []).length === 1, 'Spende: Nicken, Ziel: Freudenhüpfer');
  // Nicken und Freudenhüpfer: der Kopf nickt (zweimal, nach dem Blick aufs Handy), er hüpft – und die Hand bleibt unten
  const m = new Mimic(7);
  m.update(0);
  m.setMood('nod', undefined, 1, 1.1);
  let nodMax = 0;
  let nodEarly = 0;
  let dips = 0;
  let prev = 0;
  let base = null;
  for (let t = 0; t <= 3; t += 1 / 60) {
    const f = m.update(t);
    const p = f.pitch;
    if (base === null) base = p;
    const d = p - base;
    if (t < 1.1) nodEarly = Math.max(nodEarly, Math.abs(d));
    else nodMax = Math.max(nodMax, d);
    if (d > 0.05 && prev <= 0.05) dips++;
    prev = d;
    ok(f.wave === 0 && f.cheer === 0, `Nicken: Arm bei ${t.toFixed(2)} s`);
  }
  ok(nodMax > 0.07 && nodEarly < 0.03 && dips === 2, `Nicken: ${dips}× um bis zu ${nodMax.toFixed(3)} rad, vorher ${nodEarly.toFixed(3)}`);
  const j = new Mimic(7);
  j.update(0);
  j.setMood('joy', 3, 1);
  let lift = 0;
  for (let t = 0; t <= 3; t += 1 / 60) {
    const f = j.update(t);
    lift = Math.max(lift, f.lift);
    ok(f.wave === 0 && f.cheer === 0, `Freude: Arm bei ${t.toFixed(2)} s`);
  }
  ok(lift > 0.025 && MOODS.joy.bounce > MOODS.happy.bounce, `Freudenhüpfer ${(lift * 100).toFixed(1)} cm (Spende: ${(MOODS.happy.bounce * 1.2).toFixed(1)} cm)`);
  // der Stream: höchstens etwa zwei Arme in zehn Minuten ohne das Intro, nie zum Jubeln; Fußgänger nur im Schritttempo
  for (const seed of [3, 5, 11]) {
    const r = await armStream({ seed });
    const c = r.count;
    ok(per10(r) <= 2.2 && c.spende === 0 && c.ziel === 0 && c.intro === 1, `Saat ${seed}: ${per10(r).toFixed(1)} Arme je 10 min (${JSON.stringify(c)})`);
    // (Fußgänger im Schritttempo in echten Orten, einmal je Durchfahrt: testlauf3-test, Abschnitt 3)
    ok(r.raises.filter((x) => x.why === 'gehsteig').every((x) => x.kmh <= 30 && x.kind === 'stadt'), `Saat ${seed}: Gruß an Fußgänger zu schnell`);
    const un = r.raises.filter((x) => x.why === 'unfall');
    ok(un.every((x, i) => !i || x.t - un[i - 1].t >= WAVE.crashCool) && r.bumps >= 2 && un.length < r.bumps, `Saat ${seed}: ${r.bumps} Rempler, Grüße ${un.map((x) => x.t).join(', ')}`);
    console.log(`  Saat ${seed}: ${r.raises.length} Arme in ${r.minutes.toFixed(0)} min (intro ${c.intro}, gehsteig ${c.gehsteig}, chat ${c.chat}, unfall ${c.unfall} nach ${r.bumps} Remplern, spende ${c.spende}, ziel ${c.ziel}) = ${per10(r).toFixed(1)} je 10 min ohne Intro`);
  }
}

console.log(`winken2-test: ${checks - fails}/${checks} Prüfungen bestanden`);
if (fails) process.exit(1);
