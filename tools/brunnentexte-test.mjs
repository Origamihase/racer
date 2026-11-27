// Jede Folge spricht über ihren Brunnen (src/game/brunnentexte.js): An jedem Ort der Karte gibt es Grüße, die vor dem
// Ruf „Schöner Brunnen!“ zu Ende gesprochen sind, OMI-Sätze, die so kurz sind wie ihr längster Bordsatz, Chatzeilen
// zur Figur, und kein Platzhalter bleibt stehen. Jede Figur des Brunnenpasses und jeder berühmte Brunnen hat Sätze.
import { places } from '../src/map/graph.js';
import { FIGUR, ECHT, FAKT, folgeTexte, fuelle } from '../src/game/brunnentexte.js';
import { FIG_NAMES, REAL } from '../src/world/kit/brunnenpass.js';
import { SPECIAL } from '../src/world/kit/layout.js';
import { TV } from '../src/world/xxl/brunnentv.js';
import { VOICES } from '../src/data.js';
import { estimateSpeech } from '../src/speech.js';

let fails = 0;
let checks = 0;
const ok = (c, msg) => {
  checks++;
  if (!c) {
    fails++;
    if (fails <= 25) console.error('FEHLER: ' + msg);
  }
};
// wie Game.brunnenMegafon: so lang darf ein Gruß sein (Sprechzeit mit Luft für langsame Stimmen)
const room = (TV.call - TV.line - 0.3) / 1.35;
const OMI_MAX = 91;

for (const f of Object.keys(FIG_NAMES)) ok(FIGUR[f] && FIGUR[f].mega.length >= 3 && FIGUR[f].chat.length >= 3 && FIGUR[f].omi.length >= 2, `Figur ${f}: zu wenige Sätze`);
for (const k of [...Object.keys(REAL), ...Object.keys(SPECIAL)]) ok(ECHT[k] && ECHT[k].mega.length >= 2 && ECHT[k].omi.length >= 1 && ECHT[k].fakt, `berühmter Brunnen ${k}: keine eigenen Sätze`);
for (const [f, t] of Object.entries(FIGUR)) for (const l of t.mega) ok(estimateSpeech(l, VOICES.adam.rate) <= room, `Gruß der Figur ${f} zu lang: „${l}“`);

let minOwn = Infinity;
let minAt = '';
let withFakt = 0;
const kinds = new Map();
for (const p of places) {
  const T = folgeTexte(p);
  const mega = T.mega.map((l) => fuelle(l, T, 7)).filter((l) => estimateSpeech(l, VOICES.adam.rate) <= room);
  if (mega.length < minOwn) (minOwn = mega.length), (minAt = p.name);
  ok(mega.length >= 3, `${p.name}: nur ${mega.length} eigene Grüße passen vor den Ruf`);
  ok(T.omi.length >= 3 && T.chat.length >= 3, `${p.name}: zu wenige eigene Sätze (OMI ${T.omi.length}, Chat ${T.chat.length})`);
  for (const l of [...T.mega, ...T.omi, ...T.chat].map((x) => fuelle(x, T, 12))) ok(!/[{}]/.test(l), `${p.name}: Platzhalter übrig in „${l}“`);
  for (const l of T.omi.map((x) => fuelle(x, T, '9.999'))) ok(l.length <= OMI_MAX, `${p.name}: OMI-Satz mit ${l.length} Zeichen: „${l}“`);
  if (T.fakt) withFakt++;
  for (const l of mega) kinds.set(l, (kinds.get(l) ?? 0) + 1);
}
ok(FAKT.chance > 0 && FAKT.chance < 1, 'Anteil der Ortszeilen');
console.log(`Brunnentexte: ${Object.keys(FIGUR).length} Figuren, ${Object.keys(ECHT).length} berühmte Brunnen; an jedem der ${places.length} Orte mindestens ${minOwn} eigene Grüße (${minAt}), ${kinds.size} verschiedene Grüße insgesamt, ${withFakt} Orte mit Wissen für den Chat`);
console.log(fails ? `${fails} Fehler (${checks} Prüfungen)` : `✓ ${checks} Prüfungen`);
process.exit(fails ? 1 : 0);
