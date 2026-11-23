// Quelltext von main.js und game.js für Prüfstände, die dort nach Regeln im Code suchen (Regex über den Quelltext): mit den Szenen
// (src/scenes/*.js), die aus main.js gelöst sind. Dort heißt, was aus main.js kommt, m.game, m.state, …; das „m.“ fällt
// hier weg, damit dieselben Muster wie vorher passen.
import { readFileSync, readdirSync } from 'node:fs';

const root = new URL('../../src/', import.meta.url);

export function mainSource() {
  const scenes = readdirSync(new URL('scenes/', root)).filter((f) => f.endsWith('.js')).sort();
  const parts = [readFileSync(new URL('main.js', root), 'utf8')];
  for (const f of scenes) parts.push(readFileSync(new URL(`scenes/${f}`, root), 'utf8').replace(/(?<![\w$.])m\.(?=[A-Za-z_$])/g, ''));
  return parts.join('\n');
}

/** game.js samt seinen Teilen (src/game/parts/*.js), deren Methoden Game anhängt. */
export function gameSource() {
  const parts = readdirSync(new URL('game/parts/', root)).filter((f) => f.endsWith('.js')).sort();
  return [readFileSync(new URL('game/game.js', root), 'utf8'), ...parts.map((f) => readFileSync(new URL(`game/parts/${f}`, root), 'utf8'))].join('\n');
}
