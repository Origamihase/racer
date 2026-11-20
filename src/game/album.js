// Das BrunnenTV-Album der Reise: jede Folge, die Mini Adam je gemacht hat, über alle Streams – mit Nummer, Ort,
// Art des Brunnens, Datum des Streams und der Uhr der Reise, wie das HUD sie zeigte. Die Folgen stehen klein im
// Spielstand (save.album, siehe src/save.js), die Bilder dazu liegen daneben unter eigenem Schlüssel (storePicture):
// Fehlt eins, zeigt das Album eine gezeichnete Karte. Diese Datei kennt keine Grafik und läuft auch unter Node
// (tools/album-test.mjs).
//
// Eintrag: { n: Folge (fortlaufend über alle Streams), p: Ortsschlüssel (places[i].key), k: Art des Hauptbrunnens
// (layout.js goalKind), t: Beginn des Streams (ms seit 1970, zugleich seine Kennung), u: Uhr der Reise in Minuten,
// d: eine Streitfrage des Wikis, die zu dieser Folge passt (optional, BRUNNEN_DEBATTE in data.js) }.
import { places } from '../map/graph.js';
import { goalKind, FOUNTAIN_TITLE } from '../world/kit/layout.js';
import { ALBUM_MAX, cleanAlbum } from '../save.js';

export { ALBUM_MAX };

/** Die Streitfragen des Wikis, die zu einer Folge passen können. */
export const DEBATES = ['trink', 'kanal', 'alster'];
/** So oft kommt die Trinkbrunnenproblematik auf, wenn im Ort ein Trinkbrunnen steht (sonst stünde sie fast überall). */
const TRINK_CHANCE = 0.3;

const BY_KEY = new Map(places.map((p) => [p.key, p]));
/** Ort zu einem Schlüssel des Albums (oder null, wenn die Karte ihn nicht mehr kennt). */
export const placeOf = (key) => BY_KEY.get(key) ?? null;

/** Das Album eines Spielstands (ein Spielstand ohne Album bekommt hier ein leeres). */
export function albumOf(save) {
  if (!save.album || !Array.isArray(save.album.list) || !Number.isInteger(save.album.n)) save.album = cleanAlbum(save.album);
  return save.album;
}

/**
 * Welche Streitfrage des Wikis zu einer Folge passt: die Alsterfontäne in Hamburg, der Kanal in Ravensburg („subtiler,
 * horizontal geteilter Brunnen“), sonst ab und zu der Trinkbrunnen, wenn der Ort einen hat. kinds: Arten der Brunnen
 * im Ort (Lageplan des Stadtbaukastens), roll: Zufallszahl 0 … 1. Ergebnis: 'alster' | 'kanal' | 'trink' | null.
 */
export function debateFor(key, kinds = [], roll = Math.random()) {
  if (key === 'Hamburg') return 'alster';
  if (key === 'Ravensburg') return 'kanal';
  return kinds.includes('fountainDrink') && roll < TRINK_CHANCE ? 'trink' : null;
}

/**
 * Eine neue Folge ins Album: place = Ortsindex der Karte, t = Beginn des Streams, clock = Uhr der Reise (Minuten),
 * kinds = Arten der Brunnen im Ort (für die Streitfrage). Ergebnis: der Eintrag (seine Nummer n ist die Folge).
 */
export function addEpisode(save, { place, t, clock, kinds = [], roll = Math.random() }) {
  const a = albumOf(save);
  const p = places[place];
  const e = { n: a.n + 1, p: p.key, k: goalKind(p), t: Math.round(t), u: Math.round(clock) };
  const d = debateFor(p.key, kinds, roll);
  if (d) e.d = d;
  a.n = e.n;
  a.list.push(e);
  if (a.list.length > ALBUM_MAX) a.list.splice(0, a.list.length - ALBUM_MAX);
  return e;
}

/** Name der Brunnenart (FOUNTAIN_TITLE), „Brunnen“ für eine unbekannte. */
export const kindTitle = (k) => FOUNTAIN_TITLE[k] ?? 'Brunnen';

/** Datum des Streams wie „20.11.2026“. */
export function fmtStreamDate(t) {
  const d = new Date(t);
  if (!Number.isFinite(d.getTime())) return '';
  const two = (v) => String(v).padStart(2, '0');
  return `${two(d.getDate())}.${two(d.getMonth() + 1)}.${d.getFullYear()}`;
}

/** Folgen je Ortsschlüssel. */
export function episodesByPlace(album) {
  const m = new Map();
  for (const e of album.list) m.set(e.p, (m.get(e.p) || 0) + 1);
  return m;
}

/**
 * Zahlen des Albums: episodes (alle Folgen, auch die, die über ALBUM_MAX hinaus aus der Liste gingen), fountains
 * (Orte der Karte mit mindestens einer Folge), missing (Orte der Karte, deren Brunnen noch keine Folge hat).
 */
export function albumCounts(album) {
  let fountains = 0;
  const by = episodesByPlace(album);
  for (const p of places) if (by.has(p.key)) fountains++;
  return { episodes: album.n, fountains, missing: places.length - fountains, total: places.length };
}

/** Orte, deren Brunnen noch fehlt: meiste Streams laut Wiki zuerst, dann nach Namen. */
export function missingPlaces(album) {
  const by = episodesByPlace(album);
  return places.filter((p) => !by.has(p.key)).sort((a, b) => b.n - a.n || a.name.localeCompare(b.name, 'de'));
}

/** „noch 401 Brunnen fehlen“ (die Zeile im Album und auf der großen Karte). */
export function missingLine(missing) {
  return missing === 0 ? 'alle Brunnen besucht 🎉' : missing === 1 ? 'noch 1 Brunnen fehlt' : `noch ${missing} Brunnen fehlen`;
}
