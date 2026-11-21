// Menüseite „BrunnenTV-Folgen“ der Reise (Titel und Pause): jede Folge, die Mini Adam je gemacht hat – neueste
// zuerst, mit Nummer, Ort, Brunnenart, Datum des Streams und der Uhr der Reise, wie das HUD sie zeigte, und dem
// Standbild der Brunnen-Kamera (oder einer gezeichneten Karte, wo keins gespeichert ist); dazu die Zahl der Folgen und,
// im zweiten Reiter, die Orte, deren Brunnen noch fehlt. Die große Karte zeigt dieselbe Sammlung als Abzeichen
// (albumBadges, Ringe an Orten mit Folge). Daten: src/game/album.js, Bilder: src/save.js loadPictures.
import { albumOf, albumCounts, missingPlaces, missingLine, episodeTitle, fmtStreamDate, placeOf, episodesByPlace } from '../game/album.js';
import { BRUNNEN_DEBATTE } from '../data.js';
import { fountainCard } from './fountaincard.js';
import { fmtNum, fmtClock } from '../util.js';
import { addBadges, countryName } from '../map/mapview.js';
import { places } from '../map/graph.js';

function el(tag, cls, parent, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  if (parent) parent.appendChild(e);
  return e;
}

function button(parent, text, action, cls = '') {
  const b = el('button', 'btn ' + cls, parent, text);
  b.type = 'button';
  b.dataset.action = action;
  return b;
}

/** „1 Folge“ / „12 Folgen“ */
export const folgen = (n) => (n === 1 ? '1 Folge' : `${fmtNum(n)} Folgen`);

/**
 * Die Seite in den Abschnitt s zeichnen. d = { save, pics (Map Folge → Bild), tab ('folgen' | 'fehlen') }.
 * Die Reiter sind Knöpfe (data-action 'albumtab'), Menus.action zeichnet die Seite mit dem anderen Reiter neu.
 */
export function renderAlbum(s, d) {
  s.textContent = '';
  const album = albumOf(d.save);
  const c = albumCounts(album);
  const tab = d.tab === 'fehlen' ? 'fehlen' : 'folgen';
  const card = el('div', 'card album-card', s);
  el('h2', '', card, '⛲ BrunnenTV-Folgen');
  const chips = el('div', 'album-chips', card);
  const chip = (icon, text, cls = '') => {
    const e = el('span', 'album-chip ' + cls, chips);
    el('span', 'album-chip-icon', e, icon);
    el('span', '', e, text);
  };
  chip('📺', folgen(c.episodes));
  chip('⛲', `${fmtNum(c.fountains)} von ${fmtNum(c.total)} Brunnen`);
  chip('🔎', missingLine(c.missing), 'miss');
  const tabs = el('div', 'seg album-tabs', card);
  for (const [k, label] of [['folgen', '📺 Folgen'], ['fehlen', '🔎 Fehlen noch']]) {
    const b = button(tabs, label, 'albumtab', k === tab ? 'on' : 'off');
    b.dataset.value = k;
    b.setAttribute('aria-pressed', String(k === tab));
  }
  if (tab === 'folgen') episodeList(card, album, d.pics || new Map());
  else missingList(card, album);
  const menu = el('div', 'menu row', card);
  button(menu, '← Zurück', 'back', 'primary');
  if (tab === 'fehlen') button(menu, '🗺️ Auf der Karte', 'karte');
}

/** Die Folgen, neueste zuerst; ohne Folge ein freundlicher Hinweis, wie die erste entsteht. */
function episodeList(card, album, pics) {
  if (!album.list.length) {
    el('p', 'album-empty', card, 'Noch keine Folge im Album. Steh am Brunnen eines Navi-Ziels, bevor jemand überbietet – dann macht Mini Adam BrunnenTV aus dem Auto, und die Folge landet hier, mit Bild.');
    return;
  }
  const grid = el('div', 'album-grid', card);
  for (let i = album.list.length - 1; i >= 0; i--) episodeCard(grid, album.list[i], pics.get(album.list[i].n));
}

/** Eine Folge: Bild (oder gezeichnete Karte), Nummer, Datum und Uhr, Ort, Brunnenart, ab und zu eine Chatzeile. */
function episodeCard(grid, e, pic) {
  const p = placeOf(e.p);
  const name = p ? p.name : e.p;
  const art = el('article', 'ep', grid);
  const fig = el('div', 'ep-pic', art);
  if (pic) {
    const img = el('img', '', fig);
    img.alt = `BrunnenTV Folge ${e.n} in ${name}`;
    img.decoding = 'async';
    img.loading = 'lazy';
    img.src = pic;
  } else {
    // gezeichnete Karte: der Brunnen dieser Folge in Gestalt und Stein seiner Art, der Ort, die Nummer
    fig.append(fountainCard({ kind: e.k, place: name, n: e.n }));
  }
  const tx = el('div', 'ep-text', art);
  const top = el('div', 'ep-top', tx);
  el('span', 'ep-n', top, `Folge ${fmtNum(e.n)}` + (e.w ? ' · unterwegs' : ''));
  const when = [fmtStreamDate(e.t), Number.isFinite(e.u) ? fmtClock(e.u) + ' Uhr' : ''].filter(Boolean).join(' · ');
  if (when) el('span', 'ep-when', top, when);
  el('div', name.length > 18 ? 'ep-place long' : 'ep-place', tx, name);
  const kind = el('div', 'ep-kind', tx, episodeTitle(e));
  // im Ausland schreibt der Chat „BrunnenTV international“
  if (p && p.cc !== 'DE') el('span', 'ep-intl', kind, '🌍 international');
  const lines = e.d ? BRUNNEN_DEBATTE[e.d] : null;
  if (lines) {
    const chat = el('div', 'ep-chat', art);
    el('span', 'ep-chat-k', chat, '💬 Chat');
    el('span', 'ep-chat-v', chat, lines[e.n % lines.length]);
  }
}

/** Orte, deren Brunnen noch fehlt: nach Ländern, darin die meisten Streams laut Wiki zuerst. */
function missingList(card, album) {
  const miss = missingPlaces(album);
  if (!miss.length) {
    el('p', 'album-empty', card, 'Alle Brunnen der Karte sind im Album. Der Chat ist sprachlos – fast. 🎉');
    return;
  }
  el('p', 'sub album-miss-sub', card, 'Diese Orte haben ihren Brunnen noch nicht im Album – die meisten Streams laut Wiki zuerst. Auf der großen Karte tragen Orte mit Folge einen goldenen Ring.');
  const by = new Map();
  for (const p of miss) {
    if (!by.has(p.cc)) by.set(p.cc, []);
    by.get(p.cc).push(p);
  }
  // Deutschland zuerst, dann die Länder mit den meisten fehlenden Brunnen
  const groups = [...by].sort((a, b) => (a[0] === 'DE' ? -1 : b[0] === 'DE' ? 1 : b[1].length - a[1].length || countryName(a[0]).localeCompare(countryName(b[0]), 'de')));
  const box = el('div', 'album-miss', card);
  for (const [cc, list] of groups) {
    const g = el('section', 'miss-group', box);
    el('h3', '', g, `${countryName(cc)} · noch ${fmtNum(list.length)}`);
    // der Punkt bleibt beim Namen davor: eine Zeile beginnt immer mit einem Namen
    const names = el('p', 'miss-names', g);
    list.forEach((p, i) => {
      if (i) names.append(' ');
      el('span', 'miss-name', names, i < list.length - 1 ? `${p.name} ·` : p.name);
    });
  }
}

/**
 * Die Sammlung auf der großen Karte (mapview.js addBadges): ein goldener Ring an jedem Ort mit Folge, in seiner
 * Ortskarte die Zahl der Folgen, oben der Zähler mit den fehlenden Brunnen. save: der Spielstand (das Album wächst
 * während der Fahrt; gezählt wird beim Zeichnen, je Stand des Albums einmal).
 */
export function albumBadges(save) {
  let n = -1;
  let by = null;
  const count = () => {
    const a = albumOf(save);
    if (a.n !== n || !by) {
      n = a.n;
      by = episodesByPlace(a);
    }
    return by;
  };
  addBadges('brunnen', {
    icon: '⛲',
    title: 'BrunnenTV',
    count: (i) => count().get(places[i].key) || 0,
    text: (k) => (k === 1 ? 'Eine BrunnenTV-Folge' : `${fmtNum(k)} BrunnenTV-Folgen`),
    total: () => `${folgen(albumOf(save).n)} · ${missingLine(albumCounts(albumOf(save)).missing)}`,
  });
}
