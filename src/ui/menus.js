// Menüs: Titel, Pause („Kappandramäßige Zusammenfassung“), Abspann, Shop, Steuerung,
// Einstellungen, „Über das Spiel“ und die große Karte (src/ui/mapscreen.js). Alles per Maus, Tastatur (Pfeile + Enter + Esc) und Gamepad.
import { SHOP, UPGRADE_LIMITS, ABSPANN_CREW, ABSPANN_REISE, GEDENKEN, GAME_TITLE, GAME_SUBTITLE, GAME_XXL, GAME_NAME, TAGLINE, INCOME, FINES, damageCount, ladeCount, MEGAFON_ERSTATTET, STREAM_GEBUCHT, GAGS, fmtBetrag, nameBreak, fillTemplate, shopPrice, shopLocked, canBuy, SHOP_LOCK } from '../data.js';
import { fmtNum, fmtCent, fmtEuro, fmtSpan, fmtKonto, kontoMinus } from '../util.js';
import { fmtOdo } from '../map/navroute.js';
import { renderDriveSettings, driveSettings } from './drive-settings.js';
import { MapScreen, visitLine } from './mapscreen.js';
import { renderAlbum } from './album.js';
import { drawRouteMap } from './routemap.js';
import { fountainCard } from './fountaincard.js';
import { places } from '../map/graph.js';
import { goalKind, fountainName } from '../world/kit/layout.js';
import { drawQuote } from './quotechart.js';
import { MAP_SOURCES, TERRAIN_NOTICES } from '../map/credits.js';
import { canFullscreen, fullscreenLabel, toggleFullscreen, onFullscreenChange, homeScreenHint, escapeTaken } from './fullscreen.js';
import { controlRows, keysOf, padOf } from './controls.js';
import { thanksGroups } from './abspann.js';
import { nextStart, startName } from '../game/starts.js';

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

/** Feedback geht über GitHub: ein neues Issue im Repository des Spiels. Das Spiel selbst sendet nichts. */
export const FEEDBACK = { url: 'https://github.com/Origamihase/racer/issues/new', hint: 'GitHub · neuer Tab · das Spiel sendet nichts' };

/**
 * Der Feedback-Knopf (Titel und Pause): ein echter Link in einem neuen Tab, ohne Rückgriff auf das Spiel (noopener)
 * und ohne angehängte Daten; darunter klein, wohin er führt.
 */
function feedbackLink(parent) {
  const a = el('a', 'btn feedback', parent);
  a.href = FEEDBACK.url;
  a.target = '_blank';
  a.rel = 'noopener';
  a.title = FEEDBACK.url;
  el('span', 'fb-main', a, '💬 Feedback ↗');
  el('span', 'fb-sub', a, FEEDBACK.hint);
  return a;
}

const REASONS = {
  akku: { title: 'Akku leer', sub: 'Die Stream-Technik im Kofferraum hat den letzten Strom bekommen.' },
  werkstatt: { title: 'Ab in die Werkstatt', sub: 'Zu viele Rempler – der Tesla braucht eine kleine Pause. Mini Adam winkt trotzdem in die Kamera.' },
  quit: { title: 'Stream beendet', sub: 'Mini Adam hat den Stream vorzeitig beendet.' },
  // niemand hat nach einer Folge geboten (game.js streamOver)
  stream: { title: 'Keine Gebote mehr', sub: 'Nach der letzten Folge wollte niemand mehr bieten – der Chat sagt Gute Nacht.' },
};

// Zeilen der Abrechnung: erst alles, was das Publikum gegeben hat (Reihenfolge wie in INCOME), ganz unten die Abzüge
const BREAKDOWN_ORDER = [...Object.keys(INCOME), ...FINES];
/** Betrag mit Vorzeichen: „+12,50 €“, „−110,00 €“ (die Schäden können einen Stream ins Minus bringen) */
const signedCent = (v) => (v < 0 ? '−' : '+') + fmtCent(Math.abs(v));

/** Die Posten einer Abrechnung in dieser Reihenfolge, ohne leere: [[Zeile, Betrag], …] */
function breakdownRows(breakdown) {
  // was (noch) nicht in der Liste steht, kommt hinter die Einnahmen und vor die Abzüge
  const rank = (k) => {
    const i = BREAKDOWN_ORDER.indexOf(k);
    return i < 0 ? BREAKDOWN_ORDER.length - FINES.length - 0.5 : i;
  };
  return Object.entries(breakdown).filter(([, v]) => Math.abs(v) >= 0.005).sort((a, b) => rank(a[0]) - rank(b[0]));
}

/** Eine Zeile der „You had 5 Jobs“-Liste, mit dem Betrag, den jemand im Chat dafür versprochen hat. */
function jobRow(parent, j) {
  const r = el('div', 'job' + (j.done ? ' done' : ''), parent);
  el('span', 'job-box', r, j.done ? '✔' : '');
  el('span', 'job-text', r, j.text);
  if (j.pledge) el('span', 'job-pledge', r, fmtBetrag(j.pledge));
  return r;
}

export class Menus {
  constructor(root, handlers) {
    this.root = el('div', 'screens', root);
    this.h = handlers;
    this.screens = {};
    this.current = null;
    this.stack = [];
    for (const name of ['title', 'pause', 'over', 'shop', 'about', 'controls', 'settings', 'karte', 'album']) {
      const s = el('section', 'screen screen-' + name + ' hidden', this.root);
      this.screens[name] = s;
    }
    this.root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-action]');
      if (!b || b.disabled) return;
      this.h.click?.();
      this.action(b.dataset.action, b);
    });
    window.addEventListener('keydown', (e) => this.onKey(e));
    // Vollbild an oder aus (Knopf, Taste F oder Esc): die Knöpfe sagen, was ein Klick jetzt tut
    onFullscreenChange(() => {
      for (const b of this.root.querySelectorAll('.fs-btn')) b.textContent = fullscreenLabel();
    });
  }

  get open() {
    return !!this.current;
  }

  show(name, data) {
    if (this.current === 'karte' && name !== 'karte') this.mapScreen.stop();
    if (this.current && this.current !== name) this.screens[this.current].classList.add('hidden');
    this.current = name;
    this.data = data;
    const s = this.screens[name];
    this['render_' + name](s, data);
    this.watchScroll(s);
    s.classList.remove('hidden');
    this.root.classList.add('active');
    this.root.classList.toggle('dim', name !== 'title' && name !== 'karte');
    requestAnimationFrame(() => {
      const first = s.querySelector('.btn.primary:not([disabled])') || s.querySelector('.btn:not([disabled])');
      first?.focus({ preventScroll: true });
    });
  }

  /** Untermenü öffnen und mit „Zurück“ wieder ins vorige Menü. */
  push(name, data) {
    if (this.current) this.stack.push({ name: this.current, data: this.data });
    this.show(name, data);
  }

  back() {
    const prev = this.stack.pop();
    if (prev) this.show(prev.name, prev.name === 'title' || prev.name === 'pause' || prev.name === 'over' ? this.refreshData(prev) : prev.data);
    else this.h.back?.(this.current);
  }

  /** Offenen Bildschirm neu zeichnen (z. B. nach M/C-Tastenkürzeln); Scrollstand und Fokus bleiben. */
  refresh(name) {
    if (this.current !== name) return;
    const s = this.screens[name];
    const a = document.activeElement;
    // (die Knöpfe einer Auswahl tragen beide: dann genau dieser, nicht der erste der Reihe)
    const d = a && s.contains(a) && a.dataset;
    const sel = d && (d.key || d.value) ? (d.key ? `[data-key="${d.key}"]` : '') + (d.value ? `[data-value="${d.value}"]` : '') : null;
    const st = s.querySelector('.card')?.scrollTop || 0;
    this['render_' + name](s, this.h.dataFor ? this.h.dataFor(name, this.data) : this.data);
    const card = s.querySelector('.card');
    if (card) {
      card.style.animation = 'none';
      card.scrollTop = st;
    }
    this.watchScroll(s);
    if (sel) s.querySelector(sel)?.focus({ preventScroll: true });
  }

  /**
   * Geht eine Karte über den Bildschirm hinaus, zeigt ein längerer Verlauf über der Knopfzeile, dass darunter noch etwas
   * kommt (.more); ist sie heruntergescrollt, läuft auch der obere Rand weich aus (.less), statt Zeilen anzuschneiden.
   */
  watchScroll(s) {
    this.scrollObs?.disconnect();
    // (dieselbe Karte bekommt sonst bei jedem Aufruf einen Zuhörer mehr, etwa beim Auf- und Zuklappen der Hinweise)
    this.scrollCard?.removeEventListener('scroll', this.scrollFn);
    this.scrollCard = null;
    const card = s.querySelector('.card');
    if (!card) return;
    const more = () => {
      card.classList.toggle('more', card.scrollHeight - card.scrollTop - card.clientHeight > 4);
      card.classList.toggle('less', card.scrollTop > 4);
    };
    card.addEventListener('scroll', more, { passive: true });
    this.scrollCard = card;
    this.scrollFn = more;
    this.scrollObs = new ResizeObserver(more);
    this.scrollObs.observe(card);
  }

  refreshData(prev) {
    return this.h.dataFor ? this.h.dataFor(prev.name, prev.data) : prev.data;
  }

  hide() {
    if (this.current === 'karte') this.mapScreen.stop();
    if (this.current) this.screens[this.current].classList.add('hidden');
    this.current = null;
    this.stack = [];
    this.root.classList.remove('active', 'dim');
  }

  action(a, b) {
    switch (a) {
      case 'back':
        this.back();
        break;
      case 'shop':
      case 'about':
      case 'controls':
      case 'settings':
      case 'karte':
      case 'album':
        this.push(a, this.h.dataFor ? this.h.dataFor(a) : null);
        break;
      case 'albumtab':
        // BrunnenTV-Album: der andere Reiter (Folgen / Fehlen noch), der Knopf behält den Fokus
        this.data = { ...this.data, tab: b.dataset.value };
        this.render_album(this.screens.album, this.data);
        this.watchScroll(this.screens.album);
        this.screens.album.querySelector(`[data-action="albumtab"][data-value="${b.dataset.value}"]`)?.focus({ preventScroll: true });
        break;
      case 'buy': {
        const id = b.dataset.id;
        if (this.h.buy(id)) {
          // Liste bleibt, wo sie war: Scrollstand übernehmen, ohne die Einblend-Animation
          const st = this.screens.shop.querySelector('.card')?.scrollTop || 0;
          this.render_shop(this.screens.shop, this.h.dataFor('shop'));
          const card = this.screens.shop.querySelector('.card');
          if (card) {
            card.style.animation = 'none';
            card.scrollTop = st;
          }
          this.watchScroll(this.screens.shop);
          const nb = this.screens.shop.querySelector(`[data-id="${id}"]`);
          const next = nb && !nb.disabled ? nb : this.screens.shop.querySelector('.btn.back');
          next?.focus({ preventScroll: true });
          next?.scrollIntoView({ block: 'nearest' });
        }
        break;
      }
      case 'toggle': {
        this.h.setting(b.dataset.key, !(b.dataset.on === '1'));
        this.render_settings(this.screens.settings, this.h.dataFor('settings'));
        this.watchScroll(this.screens.settings);
        this.screens.settings.querySelector(`[data-key="${b.dataset.key}"]`)?.focus({ preventScroll: true });
        break;
      }
      case 'choice':
        this.h.setting(b.dataset.key, b.dataset.value);
        this.render_settings(this.screens.settings, this.h.dataFor('settings'));
        this.watchScroll(this.screens.settings);
        this.screens.settings.querySelector(`[data-key="${b.dataset.key}"][data-value="${b.dataset.value}"]`)?.focus({ preventScroll: true });
        break;
      case 'quality':
        this.h.setting('quality', b.dataset.value);
        this.render_settings(this.screens.settings, this.h.dataFor('settings'));
        this.watchScroll(this.screens.settings);
        this.screens.settings.querySelector(`[data-value="${b.dataset.value}"]`)?.focus({ preventScroll: true });
        break;
      case 'reset':
        if (b.dataset.confirm === '1') {
          this.h.resetSave();
          this.render_settings(this.screens.settings, this.h.dataFor('settings'));
          this.watchScroll(this.screens.settings);
        } else {
          b.dataset.confirm = '1';
          b.textContent = 'Wirklich alles löschen? Nochmal klicken';
          b.classList.add('danger');
        }
        break;
      case 'vollbild':
        toggleFullscreen();
        break;
      case 'credits': {
        // „Über das Spiel“: die Hinweise der Höhendaten auf- und zuklappen (der Knopf bleibt, wo er ist)
        const box = this.screens.about.querySelector('.credit-notices');
        const open = !box.classList.toggle('hidden');
        b.setAttribute('aria-expanded', String(open));
        b.textContent = (open ? '▾' : '▸') + ' Hinweise der Höhendaten';
        this.watchScroll(this.screens.about);
        if (open) box.scrollIntoView({ block: 'nearest' });
        break;
      }
      default:
        this.h.action?.(a, b);
    }
  }

  onKey(e) {
    if (!this.current) return;
    // Esc im Vollbild beendet nur das Vollbild (der Browser), nicht auch noch die Pause oder ein Untermenü
    if (escapeTaken(e)) return;
    if (this.current === 'karte' && this.mapScreen.onKey(e)) return;
    // Eingabefelder behalten ihre Tasten – der Lautstärke-Regler nur ← →, mit ↑ ↓ geht es weiter
    if (e.target && /input/i.test(e.target.tagName) && e.target.type !== 'range' && e.code !== 'Escape') return;
    const s = this.screens[this.current];
    // (Links stehen mit in der Reihe: Mit den Pfeiltasten angesteuert, öffnet Enter sie wie einen Knopf)
    const btns = [...s.querySelectorAll('.btn:not([disabled]), input[type=range], a.link')];
    const idx = btns.indexOf(document.activeElement);
    if (e.code === 'ArrowDown' || e.code === 'ArrowRight' || e.code === 'KeyS' || e.code === 'KeyD') {
      if (e.target.type === 'range' && (e.code === 'ArrowRight' || e.code === 'KeyD')) return;
      e.preventDefault();
      btns[(idx + 1 + btns.length) % btns.length]?.focus();
    } else if (e.code === 'ArrowUp' || e.code === 'ArrowLeft' || e.code === 'KeyW' || e.code === 'KeyA') {
      if (e.target.type === 'range' && (e.code === 'ArrowLeft' || e.code === 'KeyA')) return;
      e.preventDefault();
      btns[(idx - 1 + btns.length) % btns.length]?.focus();
    } else if (e.code === 'Escape' || e.code === 'Backspace' || (e.code === 'KeyP' && this.current === 'pause')) {
      e.preventDefault();
      if (this.current === 'pause') this.h.action('resume');
      else if (this.current !== 'title' && this.current !== 'over') this.back();
    } else if (e.code === 'Enter' || e.code === 'Space') {
      if (document.activeElement && btns.includes(document.activeElement)) {
        // einen Link (Feedback, Wiki) öffnet der Browser nur mit Enter selbst – mit der Leertaste wie einen Knopf
        if (e.code === 'Space' && document.activeElement.tagName === 'A') {
          e.preventDefault();
          document.activeElement.click();
        }
        return; // Browser klickt selbst
      }
      e.preventDefault();
      (s.querySelector('.btn.primary:not([disabled])') || btns[0])?.click();
    }
  }

  /** Gamepad-Navigation (vom Hauptprogramm aufgerufen). */
  pad(dir, confirm, cancel) {
    if (!this.current) return;
    const s = this.screens[this.current];
    const btns = [...s.querySelectorAll('.btn:not([disabled])')];
    const idx = btns.indexOf(document.activeElement);
    if (dir) btns[(idx + dir + btns.length) % btns.length]?.focus();
    if (confirm) (document.activeElement && btns.includes(document.activeElement) ? document.activeElement : btns[0])?.click();
    if (cancel) {
      if (this.current === 'pause') this.h.action('resume');
      else if (this.current !== 'title' && this.current !== 'over') this.back();
    }
  }

  /** Gamepad: Der rechte Stick scrollt die offene Karte (lange Listen: Abspann mit „Danke an“, Shop, Steuerung). */
  scroll(dy) {
    const card = this.current && this.current !== 'karte' ? this.screens[this.current].querySelector('.card') : null;
    if (card) card.scrollTop += dy;
  }

  // --- Bildschirme -------------------------------------------------------------
  render_title(s, d) {
    s.textContent = '';
    const card = el('div', 'title-card', s);
    const logo = el('div', 'title-logo', card);
    el('span', 'title-live', logo, '● LIVE');
    el('h1', '', card, GAME_TITLE);
    const h2 = el('h2', '', card, GAME_SUBTITLE + ' ');
    el('span', 'title-xxl', h2, GAME_XXL);
    el('p', 'tagline', card, TAGLINE);
    const menu = el('div', 'menu', card);
    button(menu, '▶  Losfahren', 'start', 'primary');
    button(menu, '🛒  Shop', 'shop');
    button(menu, '🗺️  Karte', 'karte');
    // die Reise sammelt ihre BrunnenTV-Folgen in einem Album (src/ui/album.js)
    button(menu, '⛲  BrunnenTV-Folgen', 'album');
    button(menu, '🎮  Steuerung', 'controls');
    button(menu, '⚙️  Einstellungen', 'settings');
    button(menu, 'ℹ️  Über das Spiel', 'about');
    feedbackLink(menu);
    const stats = el('div', 'title-stats', card);
    // im Minus mit Minuszeichen und in der Farbe der Abzüge (Schäden und Bußgelder dürfen es unter null ziehen)
    el('span', kontoMinus(d.wallet) ? 'minus' : '', stats, '💶 ' + fmtKonto(d.wallet) + ' Guthaben');
    // Rekord und Summe in Reisekilometern, dazu die besuchten Orte (dieselbe Zahl wie auf der großen Karte)
    el('span', '', stats, '🏆 Rekord ' + fmtOdo((d.best.reise || 0) / 1000));
    el('span', '', stats, '🛣️ ' + fmtOdo(d.stats.reiseKm || 0) + ' gesamt');
    el('span', '', stats, '❤️ ' + visitLine(d.visits));
    // wo der nächste Stream beginnt (game/starts.js; dort steht der Wagen schon im Ladepark)
    el('span', '', stats, '📍 Start ' + startName(nextStart(d.start)));
    // das gekaufte Megafon ist erstattet worden (save.js refundMegafon): die Zeile steht bis zum ersten Besuch im Shop
    if (d.megafonNote) el('p', 'refund-note', card, MEGAFON_ERSTATTET(fmtEuro(d.megafonNote)));
    // der letzte Stream endete ohne Abspann (Seite zu, Absturz): Er ist gebucht, bis zur nächsten Fahrt steht es hier
    const sn = d.streamNote;
    if (sn) el('p', 'refund-note', card, STREAM_GEBUCHT(fmtOdo(sn.distance / 1000).replace(/ /g, '\u00a0'), fmtCent(Math.abs(sn.money)), sn.money < 0));
    // mit einem Hinweis wird die Karte höher: Der Tastenhinweis am unteren Rand macht ihr Platz (style.css)
    s.classList.toggle('has-note', !!(d.megafonNote || sn));
    el('div', 'title-hint', s, 'Enter: Losfahren · Pfeiltasten oder WASD: fahren · Esc: Pause' + (canFullscreen() ? ' · F: Vollbild' : ''));
    // Vollbild: oben rechts in der Ecke (die Liste darunter bleibt kurz); ein iPhone kann es nur vom Home-Bildschirm
    if (canFullscreen()) button(s, fullscreenLabel(), 'vollbild', 'fs-btn fs-corner');
    else if (homeScreenHint()) el('p', 'fs-hint', card, '📱 Ohne Leisten spielen: Teilen ⬆️ → „Zum Home-Bildschirm“');
  }

  render_pause(s, g) {
    s.textContent = '';
    const card = el('div', 'card pause-card', s);
    // neben der Überschrift Feedback und der Knopf fürs Vollbild (die Knöpfe unten bleiben in einer Zeile)
    const head = el('div', 'pause-head', card);
    el('h2', '', head, '⏸ Pause');
    const tools = el('div', 'pause-tools', head);
    feedbackLink(tools);
    if (canFullscreen()) button(tools, fullscreenLabel(), 'vollbild', 'fs-btn');
    el('p', 'sub', card, 'Kappandramäßige Zusammenfassung für alle, die gerade erst reingekommen sind:');
    const grid = el('div', 'summary-grid', card);
    const item = (k, v, cls = '') => {
      const r = el('div', 'sum', grid);
      el('span', 'k', r, k);
      el('span', cls ? 'v ' + cls : 'v', r, v);
    };
    item('Strecke', fmtOdo(g.odometer / 1000));
    // im Minus mit Minuszeichen in der Farbe der Abzüge wie die Posten der Kasse darunter (nie „−0,00 €“)
    item('Einnahmen dieser Fahrt', fmtKonto(g.money), kontoMinus(g.money) ? 'minus' : '');
    // ein echter Ort – oder, zwischen Ankunft und erstem Gebot der Runde, was gerade gilt (WorldNavi.label)
    item('Navi-Ziel', g.navi.label);
    item('Navi-Gebote', fmtNum(g.stats.naviChanges));
    item('Zuschauer', fmtNum(Math.round(g.viewers)));
    item('Sendezeit', fmtSpan(g.airtime));
    // woher das Geld bisher kam – dieselben Posten wie später in der Abrechnung
    const rows = breakdownRows(g.breakdown);
    if (rows.length) {
      const kasse = el('p', 'kasse', card);
      el('span', 'kasse-k', kasse, 'Stream-Kasse: ');
      rows.forEach(([k, v], i) => {
        if (i) kasse.append(' · ');
        const part = el('span', 'kasse-item' + (v < 0 ? ' minus' : ''), kasse);
        part.textContent = `${k}\u00a0${v < 0 ? '−' : ''}${fmtCent(Math.abs(v))}`;
      });
    }
    const jobs = el('div', 'job-list', card);
    el('h3', '', jobs, 'You had 5 Jobs');
    for (const j of g.jobs) jobRow(jobs, j);
    const menu = el('div', 'menu row', card);
    button(menu, '▶ Weiterfahren', 'resume', 'primary');
    button(menu, '↻ Neustart', 'restart');
    button(menu, '🗺️ Karte', 'karte');
    button(menu, '⛲ Folgen', 'album');
    button(menu, '🎮 Steuerung', 'controls');
    button(menu, '⚙️ Einstellungen', 'settings');
    button(menu, '⏹ Stream beenden', 'quit');
  }

  render_over(s, o) {
    s.textContent = '';
    const card = el('div', 'card over-card', s);
    const r = REASONS[o.reason] || REASONS.quit;
    el('div', 'abspann-tag', card, 'ABSPANN');
    el('h2', '', card, r.title);
    el('p', 'sub', card, r.sub);
    const big = el('div', 'over-big', card);
    const dist = el('div', 'over-dist', big);
    const strecke = (m) => fmtOdo(m / 1000);
    el('span', 'num', dist, strecke(o.distance));
    el('span', 'lbl', dist, o.newRecord ? '🏆 Neuer Rekord!' : 'Rekord: ' + strecke(o.best));
    const mon = el('div', 'over-money' + (o.money < 0 ? ' minus' : ''), big);
    el('span', 'num', mon, signedCent(o.money));
    const now = el('span', 'lbl', mon, 'Guthaben · jetzt ');
    el('span', 'konto' + (kontoMinus(o.wallet) ? ' minus' : ''), now, fmtKonto(o.wallet));
    const menu = el('div', 'menu row over-menu', card);
    button(menu, '↻ Nochmal fahren', 'restart', 'primary');
    button(menu, '🛒 Shop', 'shop');
    button(menu, '🏠 Hauptmenü', 'menu');
    // die Route des Tages auf der Karte, daneben die Summen
    this.routeObs?.disconnect();
    this.quoteObs?.disconnect();
    if (o.route) this.routeBlock(card, o);
    if (o.route) this.episodesBlock(card, o);
    if (o.quote && o.quote.v.length > 1) this.quoteBlock(card, o.quote);
    const cols = el('div', 'over-cols', card);
    const left = el('div', 'over-col', cols);
    el('h3', '', left, 'Abrechnung');
    for (const [k, v] of breakdownRows(o.breakdown)) {
      const row = el('div', 'bd' + (v < 0 ? ' minus' : ''), left);
      // die Schäden mit ihrer Zahl: „Schäden (2 Rempler · 1 Kratzer)“, der Ladestrom: „Ladestrom (2 Ladestopps · 142,5 kWh)“
      const count = k === 'Schäden' && o.damage ? damageCount(o.damage.hits, o.damage.marks, o.damage.front || 0)
        : k === 'Ladestrom' && o.laden && o.laden.n ? ladeCount(o.laden.n, o.laden.kwh) : '';
      el('span', '', row, count ? `${k} (${count})` : k);
      el('span', '', row, (v < 0 ? '−' : '+') + fmtCent(Math.abs(v)));
    }
    el('h3', '', left, 'You had 5 Jobs');
    for (const j of o.jobs) jobRow(left, j);
    const right = el('div', 'over-col', cols);
    el('h3', '', right, 'Statistik');
    const st = o.stats;
    const line = (k, v) => {
      const row = el('div', 'bd', right);
      el('span', '', row, k);
      el('span', '', row, v);
    };
    line('Navi-Ziele erreicht', fmtNum(st.naviReached));
    if (st.brunnenTV) line('BrunnenTV-Folgen', fmtNum(st.brunnenTV));
    line('Navi-Gebote · höchstes', fmtNum(st.naviChanges) + ' · ' + fmtEuro(st.topBid));
    line('Spenden · Abos · neue VIPs', fmtNum(st.donations) + ' · ' + fmtNum(st.subs) + ' · ' + fmtNum(st.vips));
    line('Haarscharf überholt', fmtNum(st.nearMisses));
    line('Rempler', fmtNum(st.crashes));
    line('Höchstgeschwindigkeit', fmtNum(Math.round(st.maxSpeedKmh)) + ' km/h');
    line('Zuschauer-Spitze', fmtNum(o.peakViewers));
    // die Running Gags (game/gags.js); der Verein steht weder hier noch im Abspann (Eigentümer, 24.11.2026)
    if (o.gags?.mitleid.n) line('Mitleidskäufe', fmtNum(o.gags.mitleid.n) + ' · ' + fmtCent(o.gags.mitleid.sum));
    line('Wischer: gezuckt / gewischt', fmtNum(st.twitches) + ' / ' + fmtNum(st.wipes));
    line('Sendezeit', fmtSpan(o.air) + ' (bis ' + o.clock + ' Uhr)');
    const beruf = el('div', 'beruf', right);
    el('div', 'beruf-k', beruf, 'Erlogene Berufsbezeichnung des Tages');
    el('div', 'beruf-v', beruf, 'Mini Adam, ' + o.beruf.job);
    el('div', 'beruf-src', beruf, '(aus dem Stream vom ' + o.beruf.src + ')');
    if (o.photos && o.photos.length) {
      el('h3', '', right, 'Blitzerfotos');
      const ph = el('div', 'over-photos', right);
      for (const p of o.photos.slice(-3)) {
        const f = el('figure', '', ph);
        const img = el('img', '', f);
        img.src = p.url;
        img.alt = 'Blitzerfoto';
        el('figcaption', '', f, p.kmh + ' km/h');
      }
    }
    const credit = (grid, k, lines, wide) => {
      const c = el('div', wide ? 'crew-row wide' : 'crew-row', grid);
      el('span', 'k', c, k);
      for (const v of lines) el('span', 'v', c, v);
    };
    const crew = el('div', 'crew', card);
    for (const [k, v] of ABSPANN_CREW) credit(crew, k, [v]);
    // die Leute des Streams, mit ausgedachten Berufen, und die BrunnenTV-Folgen der Reise
    const folgen = st.brunnenTV === 1 ? '1 Folge' : fmtNum(st.brunnenTV || 0) + ' Folgen';
    for (const [k, v, wide] of ABSPANN_REISE) if (st.brunnenTV || !v.includes('{folgen}')) credit(crew, k, [fillTemplate(v, { folgen })], wide === 'wide');
    // Wie im echten Abspann danach die Unterstützenden, alle mit Namen, je Art (src/ui/abspann.js); eine eigene Zeile
    // „Größte Spende“ gibt es nicht mehr (Besitzer, 25.11.: „Den Punkt sollte es auch gar nicht mehr geben“), die Spender
    // stehen nach ihrer Summe sortiert unter „Spenden“
    // jeder, der gespendet, geboten, Abos verschenkt hat, neu VIP wurde oder geraidet hat – die Karte scrollt, so weit es
    // nötig ist
    const F = o.fans;
    const groups = thanksGroups(F);
    if (groups.length) {
      const thanks = el('div', 'crew thanks', card);
      el('h3', '', thanks, 'Danke an');
      for (const g of groups) {
        const box = el('div', 'crew-row wide thanks-group', thanks);
        box.dataset.group = g.id;
        const k = el('span', 'k', box, g.title);
        el('span', 'thanks-sum', k, ' · ' + g.sub);
        const names = el('ul', 'thanks-names', box);
        for (const x of g.names) {
          const li = el('li', '', names, nameBreak(x.name));
          if (x.what) el('span', 'thanks-what', li, ' ' + x.what);
        }
      }
    }
    // ganz am Ende, allein und leise
    el('p', 'gedenken', card, GEDENKEN);
  }

  /**
   * Abspann der Reise: die Karte mit dem gefahrenen Weg, Start, Folgen und Ladestopps (src/ui/routemap.js), daneben
   * Kilometer, Brunnen, Folgen, Ladestopps und Einnahmen. Gezeichnet wird, sobald die Karte ihre Größe hat, und neu,
   * wenn sie sich ändert (Handy gedreht).
   */
  routeBlock(card, o) {
    const R = o.route;
    const box = el('section', 'over-route', card);
    el('h3', '', box, 'Route des Tages');
    const row = el('div', 'route-row', box);
    const left = el('div', 'route-left', row);
    const wrap = el('div', 'route-map-wrap', left);
    const canvas = el('canvas', 'route-map', wrap);
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Karte der gefahrenen Route');
    const legend = el('div', 'route-legend', left);
    const lg = (cls, mark, text) => {
      const e = el('span', 'lg', legend);
      el('i', 'lg-' + cls, e, mark);
      e.append(text);
    };
    lg('start', '', places[R.home] ? 'Start ' + places[R.home].name : 'Start');
    lg('tv', '1', 'BrunnenTV-Folge');
    lg('park', '', 'Ladestopp');
    const tv = R.marks.filter((m) => m.type === 'brunnen');
    const stops = R.marks.filter((m) => m.type === 'laden').length;
    const towns = new Set(tv.map((m) => m.place)).size;
    const tot = el('div', 'route-totals', row);
    const item = (icon, v, k) => {
      const r = el('div', 'rt', tot);
      el('span', 'rt-i', r, icon);
      el('span', 'rt-v', r, v);
      el('span', 'rt-k', r, k);
    };
    // Besitzer, 25.11.: Die Einnahmen stehen schon groß oben auf der Karte, eine zweite Kachel dafür entfällt. „Brunnen
    // besucht“ und „BrunnenTV-Folgen“ zeigten fast immer dieselbe Zahl (jede Folge spielt an einem Brunnen) – eine Kachel;
    // nur wenn ein Brunnen zwei Folgen bekam, sagt sie, an wie vielen Brunnen es waren
    item('🛣️', fmtOdo(R.km), 'gefahren');
    const folgen = tv.length === 1 ? 'BrunnenTV-Folge' : 'BrunnenTV-Folgen';
    item('📺', fmtNum(tv.length), towns < tv.length ? `${folgen} an ${fmtNum(towns)} Brunnen` : folgen);
    item('🔌', fmtNum(stops), stops === 1 ? 'Ladestopp' : 'Ladestopps');
    const draw = () => {
      const w = Math.round(wrap.clientWidth);
      const h = Math.round(wrap.clientHeight);
      if (w < 20 || h < 20 || (canvas.dataset.size === w + 'x' + h)) return;
      canvas.dataset.size = w + 'x' + h;
      this.routeMarks = drawRouteMap(canvas, R, w, h, Math.min(2, window.devicePixelRatio || 1));
    };
    this.routeObs = new ResizeObserver(draw);
    this.routeObs.observe(wrap);
  }

  /**
   * Abspann der Reise: die Folgen dieses Streams als Bilderleiste – je Folge ihr Standbild (o.pics: Nummer → Bild,
   * save.js loadPictures) oder die gezeichnete Karte ihres Brunnens (fountaincard.js), darunter Nummer, Ort und Brunnen;
   * Folgen an einem Brunnen unterwegs tragen „unterwegs“.
   */
  episodesBlock(card, o) {
    const eps = o.route.marks.filter((m) => m.type === 'brunnen' && places[m.place]);
    if (!eps.length) return;
    const box = el('section', 'over-route over-eps', card);
    el('h3', '', box, eps.length === 1 ? 'Die Folge dieses Streams' : 'Folgen dieses Streams');
    const grid = el('div', 'eps-grid', box);
    for (const m of eps) {
      const p = places[m.place];
      const fig = el('figure', 'eps-tile', grid);
      const pic = o.pics && o.pics.get(m.n);
      const frame = el('div', 'eps-pic', fig);
      if (pic) {
        const img = el('img', '', frame);
        img.alt = `BrunnenTV Folge ${m.n} in ${p.name}`;
        img.decoding = 'async';
        img.src = pic;
      } else frame.append(fountainCard({ kind: goalKind(p), place: p.name, n: m.n }));
      const cap = el('figcaption', '', fig);
      el('span', 'eps-n', cap, `Folge ${fmtNum(m.n)}` + (m.way ? ' · unterwegs' : ''));
      el('span', 'eps-place', cap, p.name);
      el('span', 'eps-kind', cap, fountainName(p));
    }
  }

  /**
   * Abspann der Reise: die Einschaltquote – wie viele zugeschaut haben, über die ganze Sendezeit (ui/quotechart.js),
   * im Stil der Route darüber. Neu gezeichnet, wenn sich die Größe ändert.
   */
  quoteBlock(card, q) {
    const box = el('section', 'over-route over-quote', card);
    const head = el('h3', '', box, 'Einschaltquote');
    // die Zahlen „laut Glotzometer“ (GAGS.tracker: die ausgedachte Statistikseite, die der Chat zitiert)
    el('span', 'quote-src', head, ' · Quelle: ' + GAGS.tracker.seite);
    const wrap = el('div', 'route-map-wrap quote-wrap', box);
    const canvas = el('canvas', 'route-map', wrap);
    canvas.setAttribute('role', 'img');
    let peak = 0;
    for (const v of q.v) peak = Math.max(peak, v);
    canvas.setAttribute('aria-label', `Zuschauer im Lauf des Streams, Spitze ${fmtNum(peak)}`);
    const legend = el('div', 'route-legend', box);
    const e = el('span', 'lg', legend);
    el('i', 'lg-quote', e, '');
    e.append('Zuschauer im Lauf des Streams');
    if (q.tv.length) {
      const f = el('span', 'lg', legend);
      el('i', 'lg-tv', f, '1');
      f.append('BrunnenTV-Folge');
    }
    const draw = () => {
      const w = Math.round(wrap.clientWidth);
      const h = Math.round(wrap.clientHeight);
      if (w < 20 || h < 20 || canvas.dataset.size === w + 'x' + h) return;
      canvas.dataset.size = w + 'x' + h;
      drawQuote(canvas, q, w, h, Math.min(2, window.devicePixelRatio || 1));
    };
    this.quoteObs = new ResizeObserver(draw);
    this.quoteObs.observe(wrap);
  }

  render_shop(s, d) {
    s.textContent = '';
    const card = el('div', 'card shop-card', s);
    const head = el('div', 'shop-head', card);
    el('h2', '', head, '🛒 Shop');
    el('div', 'wallet' + (kontoMinus(d.wallet) ? ' minus' : ''), head, '💶 ' + fmtKonto(d.wallet));
    el('p', 'sub', card, 'Upgrades für den schwarzen Model 3 Long Range AWD. Bezahlt wird mit den Stream-Einnahmen: Spenden, Abos, Navi-Gebote.');
    if (d.refund) el('p', 'refund-note', card, MEGAFON_ERSTATTET(fmtEuro(d.refund)));
    // im Minus ist der Shop zu: der Grund oben, jeder Kauf-Knopf gesperrt (Spielen und Laden gehen weiter)
    const locked = shopLocked(d.wallet);
    if (locked) el('p', 'shop-lock', card, SHOP_LOCK);
    const grid = el('div', 'shop-grid', card);
    for (const it of SHOP) {
      const lvl = d.upgrades[it.id] || 0;
      const max = UPGRADE_LIMITS[it.id];
      const c = el('div', 'shop-item' + (lvl >= max ? ' maxed' : ''), grid);
      const top = el('div', 'shop-top', c);
      el('span', 'shop-icon', top, it.icon);
      const t = el('div', 'shop-title', top);
      el('div', 'shop-name', t, it.name);
      el('div', 'shop-cat', t, it.cat);
      const pips = el('div', 'pips', c);
      for (let i = 0; i < max; i++) el('span', 'pip' + (i < lvl ? ' on' : ''), pips);
      el('p', 'shop-desc', c, it.desc);
      const eff = el('div', 'shop-eff', c);
      if (lvl > 0) el('div', 'now', eff, 'Aktuell: ' + it.effect(lvl));
      if (lvl < max) el('div', 'next', eff, (lvl > 0 ? 'Nächste Stufe: ' : 'Bringt: ') + it.effect(lvl + 1));
      if (lvl < max) {
        const price = shopPrice(it, lvl);
        // mit Rabattcode (die Plüschbrause: Code ADAM): der Code, daneben der alte Preis durchgestrichen
        if (it.code) {
          const code = el('div', 'shop-code', c);
          el('span', 'shop-code-tag', code, `Code ${it.code.name} −${it.code.off}\u00a0%`);
          el('s', '', code, fmtEuro(it.prices[lvl]));
        }
        const ok = canBuy(d.wallet, price);
        // reicht das Guthaben nicht, steht da, wie viel noch fehlt; im Minus nur der Preis mit dem Schloss
        const label = ok ? 'Kaufen · ' + fmtEuro(price) : locked ? '🔒 Gesperrt · ' + fmtEuro(price) : fmtEuro(price) + ' · fehlt noch ' + fmtCent(price - d.wallet);
        const b = button(c, label, 'buy', ok ? 'buy' : 'buy poor');
        b.dataset.id = it.id;
        if (!ok) b.disabled = true;
      } else el('div', 'maxed-tag', c, 'Ausgebaut ✔');
    }
    const menu = el('div', 'menu row', card);
    button(menu, '← Zurück', 'back', 'back primary');
  }

  render_controls(s) {
    s.textContent = '';
    const card = el('div', 'card', s);
    el('h2', '', card, '🎮 Steuerung');
    // jede Zeile aus den echten Belegungen (src/ui/controls.js): Tasten und Knöpfe als Kappen, gleichwertige mit „oder“
    const tbl = el('div', 'controls-grid', card);
    const head = el('div', 'crow head', tbl);
    for (const h of ['Aktion', 'Tastatur', 'Gamepad', 'Touch']) el('span', '', head, h);
    for (const r of controlRows()) {
      const row = el('div', 'crow', tbl);
      const act = el('span', 'c-act', row);
      el('span', 'c-name', act, r.text);
      if (r.note) el('span', 'c-note', act, r.note);
      for (const [dev, list] of [['Tastatur', r.keys], ['Gamepad', r.pad], ['Touch', r.touch]]) {
        const c = el('span', 'c-in', row);
        c.dataset.dev = dev;
        if (!list.length) el('span', 'c-none', c, '–');
        list.forEach((k, i) => {
          if (i) el('span', 'c-or', c, 'oder');
          // Tasten und Knöpfe als Kappe, Beschreibungen („jede Taste“, „aufs Bild tippen“) als Text
          if (/^[a-zäöü]/.test(k)) el('span', 'c-say', c, k);
          else el('kbd', 'ckey', c, k);
        });
      }
    }
    const tips = el('div', 'tips', card);
    el('h3', '', tips, 'Tipps');
    for (const t of [
      'Geld gibt es nur vom Publikum: Spenden, Abos, Navi-Gebote. Fürs Fahren selbst zahlt niemand – aber wer flott, knapp und sauber fährt, hat einen gut gelaunten Chat, und der gibt gern.',
      'Wenn OMI sagt „Die linke Fahrspur ist freigeschaltet.“, hat jemand dafür gespendet: Eine Minute lang darfst du ganz links fahren. Nutzt du sie, freut sich der Chat. Danach gilt wieder das Rechtsfahrgebot, sonst kommt die Polizei Gifhorn.',
      'Das Navi-Ziel ist ein echter Ort – jeder Bieter legt mindestens einen Zehner drauf und schickt dich woandershin. Stehst du am Brunnen des Ziels, bevor wieder jemand überbietet, läuft dort eine Folge BrunnenTV. Dort rechnet auch die Werkstatt die Rempler der Runde ab, und je zügiger du von Ziel zu Ziel kommst, desto zufriedener ist der Chat – und desto lieber gibt er.',
      'Die Ausfahrt kündigt das Navi an: Halte dich ab dem 1000-m-Schild rechts und nimm den Streifen, der abgeht. Wer vorbeifährt, bekommt einfach eine neue Route.',
      'Blitzer kündigt niemand an. Wer vorher gewarnt werden will, kauft im Shop den Radarwarner.',
      'Das Sprachstudio (🎧) sagt dir ab und zu ins Ohr, wie der Chat gerade drauf ist.',
      `${keysOf('brunnen')[0]} = BrunnenTV: An jedem Brunnen auf dem Weg daneben anhalten und ${keysOf('brunnen')[0]} drücken (am Gamepad ${padOf('brunnen')[0]}, auf dem Handy „BrunnenTV hier“) – schon läuft eine Folge. Am Brunnen des Navi-Ziels beginnt sie von selbst.`,
      `${keysOf('ladestopp')[0]} = Laden: Geladen wird an den Ladesäulen, in jedem Ort auf dem Weg und in den Ladeparks an den Ausfahrten. Neben einer Säule oder Bucht lädt ${keysOf('ladestopp')[0]} (am Gamepad ${padOf('ladestopp')[0]}, auf dem Handy „Jetzt laden“) gleich dort; unterwegs plant dieselbe Taste (auf dem Handy „Ladestopp einplanen“) die nächste Säule ein, das Navi führt hin und danach weiter zum Ziel. Koriander liegt trotzdem auf der Straße.`,
      'Wer gut fährt, bekommt Regen – dann wird der Chat erst richtig wach. Der automatische Wischer ist allerdings noch in der Beta.',
      `In den ersten Minuten erklären kurze Tipps am Bildrand, was gerade dran ist – jeder kommt nur einmal. ${keysOf('confirm')[0]} (am Gamepad ${padOf('confirm')[0]}) oder ✕ schaltet sie ab.`,
    ]) el('p', '', tips, '• ' + t);
    const menu = el('div', 'menu row', card);
    button(menu, '← Zurück', 'back', 'primary');
  }

  render_settings(s, d) {
    s.textContent = '';
    const card = el('div', 'card settings-card', s);
    el('h2', '', card, '⚙️ Einstellungen');
    const list = el('div', 'settings-list', card);
    const toggle = (key, label, on) => {
      const r = el('div', 'set-row', list);
      el('span', '', r, label);
      const b = button(r, on ? 'An' : 'Aus', 'toggle', on ? 'on' : 'off');
      b.dataset.key = key;
      b.dataset.on = on ? '1' : '0';
    };
    toggle('sound', 'Geräusche', d.sound);
    toggle('speech', 'Sprachausgabe (OMI, Sprachstudio, Durchsagen)', d.speech);
    toggle('chat', 'Live-Chat anzeigen', d.chat);
    toggle('facecam', 'Facecam (Mini Adam im Bild)', d.facecam !== false);
    const vr = el('div', 'set-row', list);
    el('span', '', vr, 'Lautstärke');
    const range = el('input', 'range', vr);
    range.type = 'range';
    range.min = '0';
    range.max = '1';
    range.step = '0.05';
    range.value = String(d.volume);
    range.addEventListener('input', () => this.h.setting('volume', parseFloat(range.value)));
    const qr = el('div', 'set-row', list);
    el('span', '', qr, 'Grafik');
    const qs = el('div', 'seg', qr);
    for (const [v, label] of [['auto', 'Automatisch'], ['hoch', 'Hoch'], ['mittel', 'Mittel'], ['niedrig', 'Niedrig']]) {
      const b = button(qs, label, 'quality', d.quality === v ? 'on' : 'off');
      b.dataset.value = v;
    }
    if (!d.speechSupported) el('p', 'note', card, 'Hinweis: Dieser Browser hat keine deutsche Sprachausgabe – OMI und das Sprachstudio sprechen dann nur per Untertitel.');
    // Lenkung, Fahrhilfen, Tempomat, Touch und Vibration (src/ui/drive-settings.js)
    renderDriveSettings(list, driveSettings(d), (k, v) => this.h.setting(k, v), button);
    const rr = el('div', 'set-row', list);
    el('span', '', rr, 'Spielstand');
    button(rr, 'Spielstand zurücksetzen', 'reset', 'off');
    const menu = el('div', 'menu row', card);
    button(menu, '← Zurück', 'back', 'primary');
  }

  render_album(s, d) {
    renderAlbum(s, d);
  }

  render_karte(s, d) {
    (this.mapScreen || (this.mapScreen = new MapScreen())).mount(s, d);
  }

  render_about(s) {
    s.textContent = '';
    const card = el('div', 'card about-card', s);
    el('h2', '', card, 'ℹ️ Über das Spiel');
    const p = (t) => el('p', '', card, t);
    p(`„${GAME_NAME}“ ist ein liebevolles, nicht-kommerzielles Fan-Spiel rund um SkylineTV LIVE. Mini Adam – der Plüsch-Adam mit Kappe, Bart und LIVE-Shirt – fährt den schwarzen Tesla Model 3 Long Range AWD mit 75-kWh-Akku vom Supercharger in Erlensee (und jeden weiteren Stream von einem anderen Ort) über echte Autobahnen, Landstraßen und Ortsdurchfahrten, während der Chat das Navi fernsteuert.`);
    p('Jedes Navi-Ziel ist der Hauptbrunnen eines echten Orts, und jedes Gebot legt mindestens einen Zehner drauf. Steht Mini Adam am Brunnen, bevor wieder jemand überbietet, kurbelt er das Fenster herunter und macht mit dem Megafon BrunnenTV aus dem Auto – jede Folge kommt ins Album. Geladen wird in den Ladeparks an den Ausfahrten.');
    p('Fast alle Witze stammen aus dem SkylineTV LIVE Wiki: die freigeschaltete linke Spur, das Navi-Bieten, BrunnenTV mit Herrn Schönnbrun, Elsa, die Polizei Gifhorn, Meister Pünktlich (kommt gleich), Walte, die Farbe der Bank, Rahmen aus dem Live-Bereich, Sprachdurchsagen von Fräulein Kassandra und Brüll-William, das Sprachstudio in Mini Adams Ohr, Bananensaft statt Koriander, „You had 5 Jobs“ und die erlogenen Berufsbezeichnungen im Abspann.');
    p('Geld gibt es wie im echten Stream nur vom Publikum: Spenden, Ortsspenden, Abos, VIPs und Navi-Gebote. Wie der Chat gerade gelaunt ist, steht nirgends – das Sprachstudio sagt es Mini Adam ins Ohr.');
    p('OMI ist der Boardcomputer auf dem Armaturenbrett. Alle Grafiken, Geräusche und Stimmen entstehen direkt im Browser – ohne Bilder- oder Tondateien.');
    const ext = (parent, text, href) => {
      const a = el('a', 'link', parent, text);
      a.href = href;
      a.target = '_blank';
      a.rel = 'noopener';
      return a;
    };
    ext(card, 'SkylineTV LIVE Wiki öffnen', 'https://skylinetv.live/wiki/index.php?title=Hauptseite');
    // Kartendaten: Quelle, Lizenz und was angepasst wurde (src/map/credits.js); die Hinweise der Höhenquellen stehen
    // im Wortlaut dahinter – aufgeklappt mit einem Knopf, damit die Karte kurz bleibt
    const credits = el('div', 'credits', card);
    el('h3', '', credits, 'Kartendaten');
    for (const q of MAP_SOURCES) {
      const row = el('p', '', credits, q.what + ': ');
      if (q.url) ext(row, q.name, q.url);
      else row.append(q.name);
      if (q.by) row.append(` (${q.by})`);
      if (q.license) {
        row.append(q.licenseUrl ? ', Lizenz ' : ` (${q.license})`);
        if (q.licenseUrl) ext(row, q.license, q.licenseUrl);
      }
      if (q.changed) row.append(' · ' + q.changed);
    }
    const more = button(credits, '▸ Hinweise der Höhendaten', 'credits', 'credit-more');
    more.setAttribute('aria-expanded', 'false');
    const notices = el('ul', 'credit-notices hidden', credits);
    notices.lang = 'en';
    for (const n of TERRAIN_NOTICES) el('li', '', notices, n.text);
    const mem = el('div', 'tribute', card);
    el('span', 'heart', mem, '🖤');
    el('span', '', mem, 'In Erinnerung an Adam Wolke – danke für die Live-Eskalationen.');
    const menu = el('div', 'menu row', card);
    button(menu, '← Zurück', 'back', 'primary');
  }
}
