// Prüft die Ansagen, den Chat und die Auktion der Reise ohne Grafik (die zweite Testfahrt des Eigentümers, 20.11.2026):
// - OMI: Der Boardcomputer heißt überall, wo Spieler ihn lesen oder hören, OMI (Texte, Stimmen, Menüs, README, INSIDER,
//   Ladekarte); intern darf er nomi heißen.
// - Streamstart: Mini Adam sagt „Hallo, Partypeople!“ in seiner Stimme, der Chat grüßt zurück, die Stimmung ist gut;
//   wer zügig zum Ziel fährt, hebt sie deutlich, wer trödelt, senkt sie (simulierte Streams, tools/stream-sim.mjs).
import { readFileSync } from 'node:fs';
import * as DATA from '../src/data.js';
import { ZUFRIEDEN } from '../src/game/satisfaction.js';
import { MOOD_START } from '../src/game/economy.js';
import { makeStream, DRIVERS } from './stream-sim.mjs';

let fails = 0;
let checks = 0;
const seen = new Map();
function ok(cond, msg) {
  checks++;
  if (cond) return;
  fails++;
  const n = (seen.get(msg.slice(0, 40)) || 0) + 1;
  seen.set(msg.slice(0, 40), n);
  if (n <= 3) console.error('FEHLER: ' + msg);
}
const root = new URL('../', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');

// --- OMI --------------------------------------------------------------------------------------------------------
{
  // jeder Text aus data.js (Chat, Ansagen, Stimmen, Shop, Abspann …), auch in Listen und Objekten
  const texts = [];
  const walk = (v, depth = 0) => {
    if (depth > 6 || v === null) return;
    if (typeof v === 'string') texts.push(v);
    else if (typeof v === 'function' && v.length === 0) {
      try {
        const r = v();
        if (typeof r === 'string') texts.push(r);
      } catch (e) {
        /* Funktionen mit Pflichtangaben prüft der Quelltext unten */
      }
    } else if (Array.isArray(v)) v.forEach((x) => walk(x, depth + 1));
    else if (typeof v === 'object') Object.values(v).forEach((x) => walk(x, depth + 1));
  };
  walk(DATA);
  ok(texts.length > 1000, `nur ${texts.length} Texte in data.js gefunden`);
  for (const t of texts) ok(!/NOMI/.test(t), `data.js nennt NOMI: „${t.slice(0, 80)}“`);
  // Zeichenketten im Quelltext von Spiel, Oberfläche und Cockpit (Kommentare dürfen den alten Namen tragen)
  for (const f of ['src/data.js', 'src/game/game.js', 'src/ui/ui.js', 'src/ui/menus.js', 'src/ui/first-tips.js', 'src/ui/drive-hint.js', 'src/cockpit/screen.js', 'src/main.js', 'src/world/xxl/charge.js', 'src/game/damage.js']) {
    read(f).split('\n').forEach((line, i) => {
      const code = line.replace(/^\s*(\/\/|\*|\/\*).*$/, '').replace(/\/\/.*$/, '');
      const strings = code.match(/'[^']*'|`[^`]*`|"[^"]*"/g) || [];
      for (const s of strings) ok(!/NOMI/.test(s), `${f}:${i + 1} zeigt NOMI: ${s.slice(0, 80)}`);
    });
  }
  for (const f of ['README.md', 'INSIDER.md', 'docs/index.html']) ok(!/NOMI/.test(read(f)), `${f} nennt NOMI`);
  ok(DATA.VOICES.board.label === 'OMI', `Stimme des Boardcomputers heißt ${DATA.VOICES.board.label}`);
}

// --- Streamstart und Stimmung -------------------------------------------------------------------------------------
{
  ok(DATA.PARTYPEOPLE.say === 'Hallo, Partypeople!', `Gruß zum Start: ${DATA.PARTYPEOPLE.say}`);
  ok(DATA.VOICES.adam.pitch < 0.6, 'Mini Adams Stimme ist tief');
  const main = read('src/main.js');
  ok(/speech\.say\(PARTYPEOPLE\.say, 'adam'/.test(main) && /ui\.adam\(PARTYPEOPLE\.say/.test(main), 'main.js: Gruß in Mini Adams Stimme mit Untertitel');
  ok(/if \(!chargeRun\.hello\) streamHello\(\)/.test(main), 'main.js: ohne Startszene grüßt er beim Losfahren');
  const avg = { fast: 0, slow: 0, start: 0 };
  const seeds = [1, 2, 3];
  for (const seed of seeds) {
    const fast = makeStream({ driver: DRIVERS.zuegig, seed });
    const e0 = fast.game.eco.peek();
    ok(e0.mood === MOOD_START && e0.level >= 3, `Seed ${seed}: Stimmung zum Start ${e0.mood} (Stufe ${e0.level}), soll gut sein`);
    ok(fast.game.zufrieden.value >= ZUFRIEDEN.happy, `Seed ${seed}: Zufriedenheit zum Start ${fast.game.zufrieden.value}`);
    fast.step(5);
    const back = fast.log.chat.filter((c) => DATA.PARTYPEOPLE.chat.includes(c.text));
    ok(back.length >= 3 && back.every((c) => c.t < 4), `Seed ${seed}: Der Chat grüßt ${back.length}× zurück`);
    fast.step(115);
    const m = fast.game.eco.peek().mood;
    ok(m > MOOD_START + 0.1, `Seed ${seed}: zügig zum nahen Ziel hebt die Stimmung nicht deutlich (${m.toFixed(2)})`);
    ok(fast.game.zufrieden.value > ZUFRIEDEN.start + 1, `Seed ${seed}: zügig hebt die Zufriedenheit nicht (${fast.game.zufrieden.value.toFixed(1)})`);
    const slow = makeStream({ driver: DRIVERS.troedler, seed });
    slow.step(240);
    const ms = slow.game.eco.peek().mood;
    ok(ms < MOOD_START - 0.15, `Seed ${seed}: Trödeln senkt die Stimmung nicht (${ms.toFixed(2)})`);
    avg.fast += m / seeds.length;
    avg.slow += ms / seeds.length;
  }
  console.log(`  Stimmung: Start ${MOOD_START}, zügig nach 120 s ${avg.fast.toFixed(2)}, Trödler nach 240 s ${avg.slow.toFixed(2)}`);
}

console.log(`ansagen-test: ${checks} Prüfungen, ${fails} Fehler`);
if (fails) process.exit(1);
