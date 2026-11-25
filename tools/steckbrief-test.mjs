// Prüft die Steckbriefe der Orte (src/world/kit/steckbriefe-de.js, Wörter in steckbrief.js): node tools/steckbrief-test.mjs
// Jeder deutsche Ort der Karte hat einen eigenen, gültigen Eintrag; kein Eintrag ohne Ort; Nachbarorte sehen nicht
// gleich aus; jeder Ort im Ausland bekommt ein Profil seiner Gegend; das Profil ist wiederholbar.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { STECKBRIEFE } from '../src/world/kit/steckbriefe-de.js';
import { checkEntry, LOOK_KEYS } from '../src/world/kit/steckbrief.js';
import { profileOf } from '../src/world/kit/layout.js';

const hier = dirname(fileURLToPath(import.meta.url));
const places = JSON.parse(readFileSync(join(hier, 'map', 'netz.json'), 'utf8')).places;
const fehler = [];
const de = Object.entries(places).filter(([, p]) => p.cc === 'DE');

for (const [key] of de) {
  if (!STECKBRIEFE[key]) { fehler.push(`${key}: kein Steckbrief`); continue; }
  for (const b of checkEntry(STECKBRIEFE[key])) fehler.push(`${key}: ${b}`);
  if (!STECKBRIEFE[key].t || STECKBRIEFE[key].t.length < 12) fehler.push(`${key}: Beschreibung fehlt`);
}
for (const key of Object.keys(STECKBRIEFE)) {
  if (!places[key]) fehler.push(`${key}: Steckbrief ohne Ort in netz.json`);
  else if (places[key].cc !== 'DE') fehler.push(`${key}: Steckbrief für einen Ort im Ausland`);
}

const prof = (key) => profileOf({ key, ...places[key] });
for (const [key] of de) {
  const p = prof(key);
  if (!p.own) fehler.push(`${key}: Profil nicht aus dem Steckbrief`);
  if (!LOOK_KEYS.includes(p.looks[0][0])) fehler.push(`${key}: Bauweise ${p.looks[0][0]}`);
}
for (const [key, pl] of Object.entries(places)) {
  if (pl.cc === 'DE') continue;
  const p = prof(key);
  if (!p.looks.length || !p.walls.length || !p.roofs.length) fehler.push(`${key}: Profil unvollständig`);
}
// Wiederholbar: zweimal dasselbe
const a = JSON.stringify(prof('Fulda')), b = JSON.stringify(profileOf({ key: 'Fulda', ...places.Fulda }));
if (a !== b) fehler.push('Profil von Fulda nicht wiederholbar');

// Nachbarn (bis 25 km) mit exakt gleichem Steckbrief (Bauweisen, Fassaden, Dächer, Baum, Pflaster) fallen auf
const km = (p, q) => Math.hypot((p.lat - q.lat) * 111.2, (p.lon - q.lon) * 111.2 * Math.cos(p.lat * Math.PI / 180));
const sig = (e) => [e.s, e.f, e.d, e.b, e.p].join('|');
let paare = 0;
for (let i = 0; i < de.length; i++) for (let j = i + 1; j < de.length; j++) {
  const [ka, pa] = de[i], [kb, pb] = de[j];
  if (km(pa, pb) > 25 || !STECKBRIEFE[ka] || !STECKBRIEFE[kb]) continue;
  paare++;
  if (sig(STECKBRIEFE[ka]) === sig(STECKBRIEFE[kb])) fehler.push(`${ka} und ${kb} (${km(pa, pb).toFixed(0)} km) haben denselben Steckbrief`);
}
// Vielfalt im ganzen Land: keine Kombination aus erster Bauweise, erster Fassade und erstem Dach mehr als 12-mal
const zahl = new Map();
for (const [key] of de) {
  const e = STECKBRIEFE[key]; if (!e) continue;
  const k = [e.s, e.f, e.d].map((w) => String(w).split(' ')[0]).join('|');
  zahl.set(k, [...(zahl.get(k) ?? []), key]);
}
for (const [k, ks] of zahl) if (ks.length > 12) fehler.push(`${ks.length} Orte mit ${k}: ${ks.join(', ')}`);

console.log(`${de.length} deutsche Orte, ${Object.keys(places).length - de.length} im Ausland, ${paare} Nachbarpaare, ${zahl.size} Grundmischungen`);
if (fehler.length) { console.error(fehler.join('\n')); console.error(`${fehler.length} Fehler`); process.exit(1); }
console.log('Steckbriefe in Ordnung');
