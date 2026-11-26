// Startet alle Prüfstände parallel (je ein eigener Node-Prozess) und meldet am Ende, was durchfiel.
//   npm test                    – alle
//   npm test -- steer xxl       – nur Prüfstände, deren Name einen der Begriffe enthält
//   PRUEF_JOBS=1 npm test       – nacheinander (Standard: so viele gleichzeitig wie CPU-Kerne)
// Die Ausgabe eines Prüfstands erscheint nur, wenn er durchfällt; sonst eine Zeile mit der Laufzeit.
import { spawn } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { availableParallelism } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Die langsamen zuerst, damit sie nicht am Ende allein laufen.
const ALLE = [
  'geld', 'journey', 'testlauf3', 'citykit', 'xxl', 'stopp', 'streamgags', 'course', 'wiper', 'map',
  'ansagen', 'laden2', 'trip', 'winken2', 'testlauf4', 'brunnen', 'rueckwaerts', 'verkehr', 'menues',
  'radar', 'zwischenstand', 'orbit', 'steer', 'shape', 'album', 'sicht', 'tipps', 'save', 'testlauf5', 'testlauf6', 'steckbrief', 'minus', 'ladepreis', 'fluesse',
];
// Messwerkzeuge, die wie Prüfstände heißen, aber nichts bestehen müssen.
const NICHT_IM_LAUF = ['fine'];

const hier = dirname(fileURLToPath(import.meta.url));
// Ein neuer tools/*-test.mjs, der hier fehlt, würde nie laufen – das soll auffallen.
const vergessen = readdirSync(hier).filter((f) => f.endsWith('-test.mjs')).map((f) => f.slice(0, -'-test.mjs'.length))
  .filter((n) => !ALLE.includes(n) && !NICHT_IM_LAUF.includes(n));
if (vergessen.length) {
  console.error(`Nicht in tools/pruefstaende.mjs eingetragen: ${vergessen.map((n) => `${n}-test.mjs`).join(', ')}`);
  process.exit(1);
}
const filter = process.argv.slice(2);
const liste = filter.length ? ALLE.filter((n) => filter.some((f) => n.includes(f))) : ALLE;
if (!liste.length) {
  console.error(`Kein Prüfstand passt zu: ${filter.join(' ')}`);
  process.exit(1);
}
const jobs = Math.max(1, Math.min(liste.length, Number(process.env.PRUEF_JOBS) || availableParallelism()));
const sek = (ms) => `${(ms / 1000).toFixed(1)} s`;

function lauf(name) {
  return new Promise((fertig) => {
    const t0 = Date.now();
    const p = spawn(process.execPath, [join(hier, `${name}-test.mjs`)], { stdio: ['ignore', 'pipe', 'pipe'] });
    const aus = [];
    p.stdout.on('data', (d) => aus.push(d));
    p.stderr.on('data', (d) => aus.push(d));
    p.on('close', (code, signal) => fertig({ name, ok: code === 0, code: code ?? signal, ms: Date.now() - t0, aus: Buffer.concat(aus).toString() }));
  });
}

const t0 = Date.now();
const offen = [...liste];
const ergebnisse = [];
console.log(`${liste.length} Prüfstände, ${jobs} gleichzeitig`);
await Promise.all(Array.from({ length: jobs }, async () => {
  while (offen.length) {
    const r = await lauf(offen.shift());
    ergebnisse.push(r);
    if (r.ok) console.log(`✓ ${r.name} (${sek(r.ms)})`);
    else console.log(`✗ ${r.name} (${sek(r.ms)}, Exit ${r.code})\n${r.aus.trimEnd()}\n`);
  }
}));

const durch = ergebnisse.filter((r) => !r.ok);
console.log(`\n${ergebnisse.length - durch.length}/${ergebnisse.length} grün in ${sek(Date.now() - t0)}`);
if (durch.length) {
  console.log(`Durchgefallen: ${durch.map((r) => r.name).join(', ')}`);
  process.exit(1);
}
