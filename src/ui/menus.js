// Menüs: Titel, Pause („Kappandramäßige Zusammenfassung“), Abspann, Tesla-Shop, Steuerung,
// Einstellungen, „Über das Spiel“ und die große Karte (src/ui/mapscreen.js). Alles per Maus, Tastatur (Pfeile + Enter + Esc) und Gamepad.
import { SHOP, UPGRADE_LIMITS, ABSPANN_CREW, ABSPANN_REISE, GEDENKEN, GAME_TITLE, GAME_SUBTITLE, GAME_XXL, GAME_NAME, TAGLINE, INCOME, FINES, MEGAFON_ERSTATTET, fmtBetrag, nameBreak, fillTemplate } from '../data.js';
import { fmtNum, fmtCent, fmtEuro, fmtSpan } from '../util.js';
import { fmtOdo } from '../map/navroute.js';
import { renderDriveSettings, driveSettings } from './drive-settings.js';
import { MapScreen, visitLine } from './mapscreen.js';
import { renderAlbum } from './album.js';
import { drawRouteMap } from './routemap.js';
import { MAP_SOURCES, TERRAIN_NOTICES } from '../map/credits.js';

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

const REASONS = {
  akku: { title: 'Akku leer', sub: 'Die Stream-Technik im Kofferraum hat den letzten Strom bekommen.' },
  werkstatt: { title: 'Ab in die Werkstatt', sub: 'Zu viele Rempler – der Tesla braucht eine kleine Pause. Mini Adam winkt trotzdem in die Kamera.' },
  quit: { title: 'Stream beendet', sub: 'Mini Adam hat den Stream vorzeitig beendet.' },
};

// Zeilen der Abrechnung: erst alles, was das Publikum gegeben hat (Reihenfolge wie in INCOME), ganz unten die Abzüge
const BREAKDOWN_ORDER = [...Object.keys(INCOME), ...FINES];

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
    const sel = a && s.contains(a) && a.dataset ? (a.dataset.key ? `[data-key="${a.dataset.key}"]` : a.dataset.value ? `[data-value="${a.dataset.value}"]` : null) : null;
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
    const card = s.querySelector('.card');
    if (!card) return;
    const more = () => {
      card.classList.toggle('more', card.scrollHeight - card.scrollTop - card.clientHeight > 4);
      card.classList.toggle('less', card.scrollTop > 4);
    };
    card.addEventListener('scroll', more, { passive: true });
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
      if (document.activeElement && btns.includes(document.activeElement)) return; // Browser klickt selbst
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
    button(menu, '🛒  Tesla-Shop', 'shop');
    button(menu, '🗺️  Karte', 'karte');
    // die Reise sammelt ihre BrunnenTV-Folgen in einem Album (src/ui/album.js)
    button(menu, '⛲  BrunnenTV-Folgen', 'album');
    button(menu, '🎮  Steuerung', 'controls');
    button(menu, '⚙️  Einstellungen', 'settings');
    button(menu, 'ℹ️  Über das Spiel', 'about');
    const stats = el('div', 'title-stats', card);
    el('span', '', stats, '💶 ' + fmtCent(d.wallet) + ' Guthaben');
    // Rekord und Summe in Reisekilometern, dazu die besuchten Orte (dieselbe Zahl wie auf der großen Karte)
    el('span', '', stats, '🏆 Rekord ' + fmtOdo((d.best.reise || 0) / 1000));
    el('span', '', stats, '🛣️ ' + fmtOdo(d.stats.reiseKm || 0) + ' gesamt');
    el('span', '', stats, '❤️ ' + visitLine(d.visits));
    // das gekaufte Megafon ist erstattet worden (save.js refundMegafon): die Zeile steht bis zum ersten Besuch im Shop
    if (d.megafonNote) el('p', 'refund-note', card, MEGAFON_ERSTATTET(fmtEuro(d.megafonNote)));
    el('div', 'title-hint', s, 'Enter: Losfahren · Pfeiltasten oder WASD: fahren · Esc: Pause');
  }

  render_pause(s, g) {
    s.textContent = '';
    const card = el('div', 'card pause-card', s);
    el('h2', '', card, '⏸ Pause');
    el('p', 'sub', card, 'Kappandramäßige Zusammenfassung für alle, die gerade erst reingekommen sind:');
    const grid = el('div', 'summary-grid', card);
    const item = (k, v) => {
      const r = el('div', 'sum', grid);
      el('span', 'k', r, k);
      el('span', 'v', r, v);
    };
    item('Strecke', fmtOdo(g.odometer / 1000));
    item('Einnahmen dieser Fahrt', fmtCent(g.money));
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
    const mon = el('div', 'over-money', big);
    el('span', 'num', mon, '+' + fmtCent(o.money));
    el('span', 'lbl', mon, 'Guthaben · jetzt ' + fmtCent(o.wallet));
    const menu = el('div', 'menu row over-menu', card);
    button(menu, '↻ Nochmal fahren', 'restart', 'primary');
    button(menu, '🛒 Tesla-Shop', 'shop');
    button(menu, '🏠 Hauptmenü', 'menu');
    // die Route des Tages auf der Karte, daneben die Summen
    this.routeObs?.disconnect();
    if (o.route) this.routeBlock(card, o);
    const cols = el('div', 'over-cols', card);
    const left = el('div', 'over-col', cols);
    el('h3', '', left, 'Abrechnung');
    for (const [k, v] of breakdownRows(o.breakdown)) {
      const row = el('div', 'bd' + (v < 0 ? ' minus' : ''), left);
      el('span', '', row, k);
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
    // Wie im echten Abspann danach die Unterstützenden: größte Spende, Abo-Verschenker (die meisten zuerst), neue VIPs
    const F = o.fans;
    if (F && (F.top || F.gifters.length || F.vips.length)) {
      const thanks = el('div', 'crew thanks', card);
      el('h3', '', thanks, 'Danke an');
      if (F.top) credit(thanks, 'Größte Spende', [`${nameBreak(F.top.name)} (${fmtCent(F.top.amount)})`]);
      // je Abschnitt höchstens drei Zeilen: bei mehr Namen die ersten zwei und „und N weitere“
      const top3 = (list, fmt) => (list.length > 3 ? [...list.slice(0, 2).map(fmt), `und ${list.length - 2} weitere`] : list.map(fmt));
      if (F.gifters.length) credit(thanks, 'Abos verschenkt', top3(F.gifters, (x) => `${nameBreak(x.name)} (${x.count})`));
      if (F.vips.length) credit(thanks, 'Neue VIPs', top3(F.vips, nameBreak));
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
    lg('start', '', 'Start Erlensee');
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
    item('🛣️', fmtOdo(R.km), 'gefahren');
    item('⛲', fmtNum(towns), 'Brunnen besucht');
    item('📺', fmtNum(tv.length), tv.length === 1 ? 'BrunnenTV-Folge' : 'BrunnenTV-Folgen');
    item('🔌', fmtNum(stops), stops === 1 ? 'Ladestopp' : 'Ladestopps');
    item('💶', '+' + fmtCent(o.money), 'eingenommen');
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

  render_shop(s, d) {
    s.textContent = '';
    const card = el('div', 'card shop-card', s);
    const head = el('div', 'shop-head', card);
    el('h2', '', head, '🛒 Tesla-Shop');
    el('div', 'wallet', head, '💶 ' + fmtCent(d.wallet));
    el('p', 'sub', card, 'Upgrades für den schwarzen Model 3 Long Range AWD. Bezahlt wird mit den Stream-Einnahmen: Spenden, Abos, Navi-Gebote.');
    if (d.refund) el('p', 'refund-note', card, MEGAFON_ERSTATTET(fmtEuro(d.refund)));
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
        const price = it.prices[lvl];
        const ok = d.wallet >= price;
        // reicht das Guthaben nicht, steht da, wie viel noch fehlt
        const b = button(c, ok ? 'Kaufen · ' + fmtEuro(price) : fmtEuro(price) + ' · fehlt noch ' + fmtCent(price - d.wallet), 'buy', ok ? 'buy' : 'buy poor');
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
    const tbl = el('div', 'controls-grid', card);
    const rows = [
      // geschützte Leerzeichen: wird die Spalte schmal, bricht die Zeile nur vor und nach „oder“, nie zwischen A und D
      ['Lenken', '←\u00a0→ oder A\u00a0D', 'Linker Stick', '◀\u00a0▶'],
      ['Strom geben', '↑ oder W', 'RT oder Steuerkreuz ↑', 'Strom'],
      ['Bremsen', '↓ oder S', 'LT oder Steuerkreuz ↓', 'Bremse'],
      ['Rückwärtsgang (im Stand halten, zurück mit Strom)', '↓ oder S', 'LT oder Steuerkreuz ↓', 'Bremse'],
      ['Hupen (Brunnen & Elsa grüßen)', 'Leertaste', 'A', '📯'],
      ['Scheibenwischer von Hand', 'E', 'X', '🌧️'],
      ['Megafon', 'H', 'Y', '📢'],
      ['Ladestopp einplanen (nächster Ladepark)', 'L', '–', '🔌 Ladestopp'],
      ['Kamera (Cockpit / Drohne)', 'V', 'B', '🎥'],
      ['Chat ein/aus', 'C', '–', '–'],
      ['Ton aus', 'M', '–', '–'],
      ['Pause', 'Esc oder P', 'Start', '⏸'],
    ];
    const head = el('div', 'crow head', tbl);
    for (const h of ['Aktion', 'Tastatur', 'Gamepad', 'Touch']) el('span', '', head, h);
    for (const r of rows) {
      const row = el('div', 'crow', tbl);
      for (const c of r) el('span', '', row, c);
    }
    const tips = el('div', 'tips', card);
    el('h3', '', tips, 'Tipps');
    for (const t of [
      'Geld gibt es nur vom Publikum: Spenden, Abos, Navi-Gebote. Fürs Fahren selbst zahlt niemand – aber wer flott, knapp und sauber fährt, hat einen gut gelaunten Chat, und der gibt gern.',
      'Wenn NOMI sagt „Die linke Fahrspur ist freigeschaltet.“, hat jemand dafür gespendet: Eine Minute lang darfst du ganz links fahren. Nutzt du sie, freut sich der Chat. Danach gilt wieder das Rechtsfahrgebot, sonst kommt die Polizei Gifhorn.',
      'Das Navi-Ziel ist ein echter Ort – jeder Bieter legt mindestens einen Zehner drauf und schickt dich woandershin. Stehst du am Brunnen des Ziels, bevor wieder jemand überbietet, läuft dort eine Folge BrunnenTV. Dort rechnet auch die Werkstatt die Rempler der Runde ab, und je zügiger du von Ziel zu Ziel kommst, desto zufriedener ist der Chat (das Gesicht oben im Chat) – und desto lieber gibt er.',
      'Die Ausfahrt kündigt das Navi an: Halte dich ab dem 1000-m-Schild rechts und nimm den Streifen, der abgeht. Wer vorbeifährt, bekommt einfach eine neue Route.',
      'Blitzer kündigt niemand an. Wer vorher gewarnt werden will, kauft im Tesla-Shop den Radarwarner.',
      'Das Sprachstudio (🎧) sagt dir ab und zu ins Ohr, wie der Chat gerade drauf ist.',
      'Geladen wird in den Ladeparks an den Ausfahrten: Warnt NOMI vor dem Akku, plant L (oder der Knopf „Ladestopp einplanen“) den nächsten Park ein, das Navi führt hinein und danach weiter zum Ziel. Koriander liegt trotzdem auf der Straße.',
      'Wer gut fährt, bekommt Regen – dann wird der Chat erst richtig wach. Der automatische Wischer ist allerdings noch in der Beta.',
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
    toggle('speech', 'Sprachausgabe (NOMI, Sprachstudio, Durchsagen)', d.speech);
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
    if (!d.speechSupported) el('p', 'note', card, 'Hinweis: Dieser Browser hat keine deutsche Sprachausgabe – NOMI und das Sprachstudio sprechen dann nur per Untertitel.');
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
    p(`„${GAME_NAME}“ ist ein liebevolles, nicht-kommerzielles Fan-Spiel rund um SkylineTV LIVE. Mini Adam – der Plüsch-Adam mit Kappe, Bart und LIVE-Shirt – fährt den schwarzen Tesla Model 3 Long Range AWD mit 75-kWh-Akku über die Autobahn, während der Chat das Navi fernsteuert.`);
    p('Auf der Reise über die echte Karte ist jedes Navi-Ziel der Hauptbrunnen eines Orts: Dort hält Mini Adam neben dem Brunnen, kurbelt das Fenster herunter und macht mit dem Megafon BrunnenTV aus dem Auto. Das Megafon gehört zur Ausstattung.');
    p('Fast alle Witze stammen aus dem SkylineTV LIVE Wiki: die freigeschaltete linke Spur, das Navi-Bieten mit einem Cent mehr, BrunnenTV mit Herrn Schönnbrun, Elsa, die Polizei Gifhorn, Meister Pünktlich (kommt gleich), Walte, die Farbe der Bank, Rahmen aus dem Live-Bereich, Sprachdurchsagen von Fräulein Kassandra und Brüll-William, das Sprachstudio in Mini Adams Ohr, Bananensaft statt Koriander, „You had 5 Jobs“ und die erlogenen Berufsbezeichnungen im Abspann.');
    p('Geld gibt es wie im echten Stream nur vom Publikum: Spenden, Ortsspenden, Abos, VIPs und Navi-Gebote. Wie der Chat gerade gelaunt ist, steht nirgends – das Sprachstudio sagt es Mini Adam ins Ohr.');
    p('NOMI ist der Boardcomputer auf dem Armaturenbrett. Alle Grafiken, Geräusche und Stimmen entstehen direkt im Browser – ohne Bilder- oder Tondateien.');
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
