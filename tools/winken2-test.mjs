// Winken 2 (die Probefahrt des Besitzers vom 22.11.2026: „Mini Adam winkt weiterhin viel zu oft und streckt seine
// Finger dabei auch nicht aus“), ohne Grafik: node tools/winken2-test.mjs
// 1. Zählen: Ein Stream von 20 Minuten mit Ortsdurchfahrten (tools/winken-sim.mjs) schreibt jeden Arm mit, der
//    hochgeht, mit seinem Anlass – die vier Anlässe der Regel (game/wave.js) und jedes Jubeln (Spende, Ziel). Die
//    Nachbildung (RAISES) muss zu main.js adamMood passen.
import { readFileSync } from 'node:fs';
import { armStream, per10, RAISES } from './winken-sim.mjs';
import { WAVE } from '../src/game/wave.js';

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

console.log(`winken2-test: ${checks - fails}/${checks} Prüfungen bestanden`);
if (fails) process.exit(1);
