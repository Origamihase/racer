// Prüft die Ansagen, den Chat und die Auktion der Reise ohne Grafik (die zweite Testfahrt des Eigentümers, 20.11.2026):
// - OMI: Der Boardcomputer heißt überall, wo Spieler ihn lesen oder hören, OMI (Texte, Stimmen, Menüs, README, INSIDER,
//   Ladekarte); intern darf er nomi heißen.
import { readFileSync } from 'node:fs';
import * as DATA from '../src/data.js';

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

console.log(`ansagen-test: ${checks} Prüfungen, ${fails} Fehler`);
if (fails) process.exit(1);
