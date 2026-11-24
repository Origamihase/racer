// Schmale Schnittstelle einer Themen-Klasse des Spiels (src/game/akku.js, studio.js): Sie liest vom Spiel nur über
// this.g.<Name> oder ein lokales g (const g = this.g), und genau die Namen ihrer Liste (AKKU_HOST, STUDIO_HOST).
import { readFileSync } from 'node:fs';

/**
 * Prüft die Datei file (relativ zu src/) gegen die Liste host und meldet über ok(cond, msg). Gibt die benutzten Namen
 * zurück. Fällt durch, wenn die Klasse einen Namen liest, der nicht in der Liste steht, die Liste einen Namen führt, den
 * sie nicht braucht, oder das Spiel anders anfasst (weiterreicht, mit [] liest).
 */
export function checkHost(file, host, ok) {
  const src = readFileSync(new URL(`../../src/${file}`, import.meta.url), 'utf8').replace(/^\s*(\/\/|\*|\/\*).*$/gm, '');
  const used = new Set([...src.matchAll(/(?:this\.g|(?<![\w$./])g)\.([A-Za-z_$][\w$]*)/g)].map((m) => m[1]));
  // (this.g bzw. g nur mit Punkt dahinter: das Spiel wird nicht weitergereicht und nicht mit [] gelesen; /…/g ist ein Regex)
  const loose = src.replace(/this\.g = g;|const g = this\.g;|constructor\(g\)/g, '').match(/(?:this\.g|(?<![\w$./])g)(?!\.[A-Za-z_$])(?![\w$])/g);
  ok(!loose, `${file} greift auf das Spiel anders zu als über this.g.<Name> (${loose})`);
  for (const k of used) ok(host.includes(k), `${file} liest Game.${k}, das nicht in seiner Liste steht`);
  for (const k of host) ok(used.has(k), `die Liste von ${file} nennt ${k}, das die Klasse nicht braucht`);
  return used;
}
