// Prüft die Steckbriefe der Orte (src/world/kit/steckbriefe-de.js und steckbriefe-ausland.js, Wörter in steckbrief.js):
// node tools/steckbrief-test.mjs
// Jeder Ort der Karte hat einen eigenen, gültigen Eintrag (im Ausland mit seinem Ländercode); kein Eintrag ohne Ort;
// Nachbarorte sehen nicht gleich aus; das Ausland hebt sich ab (Bauweisen, die es in Deutschland nicht gibt, in den
// meisten Orten); das Profil ist wiederholbar.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { STECKBRIEFE as DE_E } from '../src/world/kit/steckbriefe-de.js';
import { STECKBRIEFE as AUS_E } from '../src/world/kit/steckbriefe-ausland.js';
import { checkEntry, LOOK_KEYS } from '../src/world/kit/steckbrief.js';
import { profileOf } from '../src/world/kit/layout.js';

const hier = dirname(fileURLToPath(import.meta.url));
const places = JSON.parse(readFileSync(join(hier, 'map', 'netz.json'), 'utf8')).places;
const fehler = [];
const STECKBRIEFE = { ...DE_E, ...AUS_E };
for (const k of Object.keys(DE_E)) if (AUS_E[k]) fehler.push(`${k}: in beiden Dateien`);
const de = Object.entries(places).filter(([, p]) => p.cc === 'DE');
const alle = Object.entries(places);

for (const [key, pl] of Object.entries(places)) {
  if (!STECKBRIEFE[key]) { fehler.push(`${key}: kein Steckbrief`); continue; }
  for (const b of checkEntry(STECKBRIEFE[key], pl.cc)) fehler.push(`${key}: ${b}`);
  if (!STECKBRIEFE[key].t || STECKBRIEFE[key].t.length < 12) fehler.push(`${key}: Beschreibung fehlt`);
}
for (const key of Object.keys(DE_E)) {
  if (!places[key]) fehler.push(`${key}: Steckbrief ohne Ort in netz.json`);
  else if (places[key].cc !== 'DE') fehler.push(`${key}: deutscher Steckbrief für einen Ort im Ausland`);
}
for (const key of Object.keys(AUS_E)) {
  if (!places[key]) fehler.push(`${key}: Steckbrief ohne Ort in netz.json`);
  else if (places[key].cc === 'DE') fehler.push(`${key}: Auslands-Steckbrief für einen deutschen Ort`);
}

const prof = (key) => profileOf({ key, ...places[key] });
for (const [key] of de) {
  const p = prof(key);
  if (!p.own) fehler.push(`${key}: Profil nicht aus dem Steckbrief`);
  if (!LOOK_KEYS.includes(p.looks[0][0])) fehler.push(`${key}: Bauweise ${p.looks[0][0]}`);
}
// Das Ausland hebt sich ab: die erste Bauweise der meisten Orte gibt es in Deutschland nicht
const GERMAN = new Set(['default', 'fachwerk', 'schiefer', 'kurort', 'gruenderzeit', 'sandstein', 'brick', 'barock', 'platte', 'nachkrieg', 'baeder', 'schwarzwald']);
const aus = Object.entries(places).filter(([, p]) => p.cc !== 'DE');
let fremd = 0;
for (const [key] of aus) {
  const p = prof(key);
  if (!p.own) fehler.push(`${key}: Profil nicht aus dem Steckbrief`);
  if (!p.looks.length || !p.walls.length || !p.roofs.length) fehler.push(`${key}: Profil unvollständig`);
  if (!GERMAN.has(p.looks[0][0])) fremd++;
}
if (fremd < aus.length * 0.85) fehler.push(`nur ${fremd} von ${aus.length} Orten im Ausland mit eigener Bauweise`);
// Wiederholbar: zweimal dasselbe
const a = JSON.stringify(prof('Fulda')), b = JSON.stringify(profileOf({ key: 'Fulda', ...places.Fulda }));
if (a !== b) fehler.push('Profil von Fulda nicht wiederholbar');

// Nachbarn (bis 25 km) mit exakt gleichem Steckbrief (Bauweisen, Fassaden, Dächer, Baum, Pflaster) fallen auf
const km = (p, q) => Math.hypot((p.lat - q.lat) * 111.2, (p.lon - q.lon) * 111.2 * Math.cos(p.lat * Math.PI / 180));
const sig = (e) => [e.s, e.f, e.d, e.b, e.p].join('|');
let paare = 0;
for (let i = 0; i < alle.length; i++) for (let j = i + 1; j < alle.length; j++) {
  const [ka, pa] = alle[i], [kb, pb] = alle[j];
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

console.log(`${de.length} deutsche Orte, ${aus.length} im Ausland (${fremd} mit eigener Bauweise), ${paare} Nachbarpaare, ${zahl.size} Grundmischungen`);
if (fehler.length) { console.error(fehler.join('\n')); console.error(`${fehler.length} Fehler`); process.exit(1); }
console.log('Steckbriefe in Ordnung');
