// Der Spielmodus: „Klassik“ (die endlose Autobahn) oder „Navi ferngesteuert XXL“ (die Reise über die echte Karte).
// Die Welt wird beim Laden gebaut, also gilt je Seitenaufruf genau ein Modus, und er wird hier an einer Stelle
// entschieden (modeFor). Gewählt wird auf dem Titelbildschirm: Der Eintrag merkt die Wahl im Spielstand (save.mode)
// und lädt die Seite neu (modeSearch) – in den anderen Modus kommt man von dort immer zurück.

export const MODES = ['klassik', 'xxl'];

/**
 * Der Modus ohne Wunsch in der Adresse und ohne gemerkte Wahl. Klassik bleibt es, bis die Reise ganz ist; soll sie
 * der Standard werden, wird hier 'xxl' eingetragen – sonst nirgends.
 */
export const DEFAULT_MODE = 'klassik';

// ?xxl oder ?klassik in der Adresse (auch als &xxl hinter anderen Schaltern); stehen beide da, gilt der erste
const FLAG = /[?&](xxl|klassik)(?=[&=#]|$)/;
const DEBUG = /[?&]debug(?=[&=#]|$)/;
const MAPDEMO = /[?&]mapdemo(?=[&=#]|$)/;

/**
 * Der Modus dieses Seitenaufrufs.
 * 1. Ein Schalter in der Adresse gewinnt immer (?xxl, ?klassik): So kommt niemand in einen Modus, aus dem ihn die
 *    gemerkte Wahl nicht mehr herausließe.
 * 2. Prüfseiten (?debug) ohne Schalter nehmen den Standard und nie die gemerkte Wahl – die Seiten eines Prüflaufs
 *    teilen sich den Speicher, und jede soll bedeuten, was ihre Adresse sagt. Der Navi-Prüfstand (?debug&mapdemo)
 *    steht neben dem klassischen Spiel und bleibt dort, auch wenn der Standard einmal wechselt.
 * 3. Sonst die Wahl vom Titelbildschirm (save.mode), und ohne sie der Standard.
 * @param {string} search location.search
 * @param {string|null} [stored] save.mode
 * @returns {'klassik'|'xxl'}
 */
export function modeFor(search, stored) {
  const flag = FLAG.exec(search);
  if (flag) return flag[1];
  if (DEBUG.test(search)) return MAPDEMO.test(search) ? 'klassik' : DEFAULT_MODE;
  return MODES.includes(stored) ? stored : DEFAULT_MODE;
}

/** Der jeweils andere Modus (der Eintrag auf dem Titelbildschirm). */
export function otherMode(mode) {
  return mode === 'xxl' ? 'klassik' : 'xxl';
}

/**
 * Die Adresse (location.search), unter der die Seite nach der Wahl auf dem Titelbildschirm neu lädt: ohne einen
 * Schalter für den Modus – sonst käme, wer mit ?xxl gekommen ist, über den Eintrag nie zurück zur Klassik. Alle
 * anderen Schalter bleiben. Nur eine Prüfseite bekommt den Schalter des gewählten Modus, weil sie die gemerkte Wahl
 * nicht liest.
 */
export function modeSearch(search, mode) {
  const rest = search.replace(/^\?/, '').split('&').filter((p) => p && !/^(xxl|klassik)(=|$)/.test(p));
  if (DEBUG.test(search)) rest.push(mode);
  return rest.length ? '?' + rest.join('&') : '';
}
