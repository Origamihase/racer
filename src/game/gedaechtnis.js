// Das Gedächtnis des Sprachstudios (der Eigentümer, 27.11.2026: „Auch das Sprachstudio soll eine Erinnerung haben.“).
// Es erinnert sich an das, was der Spielstand ohnehin bewahrt: das Album der Folgen BrunnenTV (welcher Brunnen wann),
// die Rekorde (Strecke, Einnahmen) und wie viele Streams es schon gab. Daraus macht es Sätze: zu Beginn eines Streams,
// nach einer Folge (ein Brunnen, an dem wir schon waren; eine runde Folge im Album) und wenn der Streckenrekord fällt.
// Reine Logik ohne Zufall: Welcher Satz kommt, folgt aus den Zahlen (so ändert das Gedächtnis nichts am übrigen Stream).
import { STUDIO, fillTemplate } from '../data.js';
import { placeOf } from './album.js';
import { fmtEuro } from '../util.js';
import { fmtOdo } from '../map/navroute.js';

/** Runde Folgen im Album, die das Studio feiert, und ab wie vielen Kilometern ein Rekord der Rede wert ist. */
export const GEDAECHTNIS = { rund: [10, 25, 50, 75, 100, 150, 200, 250, 300, 400, 500, 750, 1000], rekordKm: 5 };

const M = () => STUDIO.memory;
/** Satz i einer Liste (zyklisch). */
const nth = (list, i) => list[((i % list.length) + list.length) % list.length];
const ZAHL = ['', 'einmal', 'zweimal', 'dreimal', 'viermal', 'fünfmal', 'sechsmal', 'siebenmal', 'achtmal', 'neunmal', 'zehnmal'];

/**
 * Was das Studio zu Beginn eines Streams sagt: Gruß mit der Nummer des Streams und bis zu zwei Erinnerungen (die letzte
 * Folge des letzten Streams, das Album, ein Rekord). save: der Spielstand vor diesem Stream (stats.runs zählt die
 * schon abgerechneten Streams).
 */
export function startMemory(save) {
  const nr = (save.stats?.runs || 0) + 1;
  if (nr === 1) return nth(M().erster, 0);
  const parts = [fillTemplate(nth(M().hallo, nr), { nr })];
  const list = save.album?.list || [];
  const last = list[list.length - 1];
  const facts = [];
  if (last) {
    const p = placeOf(last.p);
    const folgen = list.filter((e) => e.t === last.t).length;
    if (p) facts.push(fillTemplate(nth(M().zuletzt, nr), { ort: p.name, folgen: folgen === 1 ? 'eine Folge' : `${folgen} Folgen` }));
  }
  const n = save.album?.n || 0;
  if (n >= 3) facts.push(fillTemplate(nth(M().album, nr), { n }));
  const km = (save.best?.reise || 0) / 1000;
  if (km >= GEDAECHTNIS.rekordKm) facts.push(fillTemplate(nth(M().rekord, nr), { km: fmtOdo(km) }));
  if ((save.best?.earned || 0) >= 50) facts.push(fillTemplate(nth(M().geld, nr), { geld: fmtEuro(Math.floor(save.best.earned)) }));
  // zwei Dinge, die sich von Stream zu Stream abwechseln
  for (let i = 0; i < Math.min(2, facts.length); i++) parts.push(facts[(nr + i) % facts.length]);
  return parts.join(' ');
}

/**
 * Nach einer Folge (entry: der neue Eintrag im Album, ort: Name des Orts): eine runde Folge im Album, ein Brunnen, an
 * dem wir schon waren (der wievielte Besuch), oder ab und zu ein neuer fürs Album. Sonst null.
 */
export function episodeMemory(save, entry, ort) {
  const list = save.album?.list || [];
  const n = entry.n;
  if (GEDAECHTNIS.rund.includes(n)) return fillTemplate(nth(M().rund, n), { n });
  const k = list.filter((e) => e.p === entry.p).length;
  if (k >= 2) return fillTemplate(nth(M().wieder, n), { k, ort, vorher: ZAHL[k - 1] || `${k - 1}-mal` });
  // ein neuer Brunnen: nur bei jeder dritten Folge, sonst redet das Studio nach jeder Folge
  if (n % 3 === 0) return fillTemplate(nth(M().neu, n), { n, ort });
  return null;
}

/** Die Strecke dieses Streams (Meter) hat eben den Rekord aller Streams (best, Meter) übertroffen: der Satz dazu. */
export function rekordMemory(best) {
  return fillTemplate(nth(M().streckenrekord, Math.round(best)), { km: fmtOdo(best / 1000) });
}
