// Menüs: Titel, Pause („Kappandramäßige Zusammenfassung“), Abspann, Tesla-Shop, Steuerung,
// Einstellungen und „Über das Spiel“. Alles per Maus, Tastatur (Pfeile + Enter + Esc) und Gamepad.
import { SHOP, UPGRADE_LIMITS, ABSPANN_CREW, GAME_TITLE, GAME_SUBTITLE, TAGLINE } from '../data.js';
import { fmtNum, fmtCent, fmtKm, fmtEuro, fmtDuration } from '../util.js';

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

const BREAKDOWN_ORDER = ['Linke Spur', 'Navi-Ziele', 'Spenden', 'Jobs', 'Bananensaft', 'Haarscharf', 'BrunnenTV', 'Elsa-Gruß', 'Vorbildlich', 'Bußgeld', 'Verwarngeld', 'Koriander'];

export class Menus {
  constructor(root, handlers) {
    this.root = el('div', 'screens', root);
    this.h = handlers;
    this.screens = {};
    this.current = null;
    this.stack = [];
    for (const name of ['title', 'pause', 'over', 'shop', 'about', 'controls', 'settings']) {
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
    if (this.current && this.current !== name) this.screens[this.current].classList.add('hidden');
    this.current = name;
    this.data = data;
    const s = this.screens[name];
    this['render_' + name](s, data);
    s.classList.remove('hidden');
    this.root.classList.add('active');
    this.root.classList.toggle('dim', name !== 'title');
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
    if (sel) s.querySelector(sel)?.focus({ preventScroll: true });
  }

  refreshData(prev) {
    return this.h.dataFor ? this.h.dataFor(prev.name, prev.data) : prev.data;
  }

  hide() {
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
        this.push(a, this.h.dataFor ? this.h.dataFor(a) : null);
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
        this.screens.settings.querySelector(`[data-key="${b.dataset.key}"]`)?.focus({ preventScroll: true });
        break;
      }
      case 'quality':
        this.h.setting('quality', b.dataset.value);
        this.render_settings(this.screens.settings, this.h.dataFor('settings'));
        this.screens.settings.querySelector(`[data-value="${b.dataset.value}"]`)?.focus({ preventScroll: true });
        break;
      case 'reset':
        if (b.dataset.confirm === '1') {
          this.h.resetSave();
          this.render_settings(this.screens.settings, this.h.dataFor('settings'));
        } else {
          b.dataset.confirm = '1';
          b.textContent = 'Wirklich alles löschen? Nochmal klicken';
          b.classList.add('danger');
        }
        break;
      default:
        this.h.action?.(a, b);
    }
  }

  onKey(e) {
    if (!this.current) return;
    // Eingabefelder behalten ihre Tasten – der Lautstärke-Regler nur ← →, mit ↑ ↓ geht es weiter
    if (e.target && /input/i.test(e.target.tagName) && e.target.type !== 'range' && e.code !== 'Escape') return;
    const s = this.screens[this.current];
    const btns = [...s.querySelectorAll('.btn:not([disabled]), input[type=range]')];
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
    el('h2', '', card, GAME_SUBTITLE);
    el('p', 'tagline', card, TAGLINE);
    const menu = el('div', 'menu', card);
    button(menu, '▶  Losfahren', 'start', 'primary');
    button(menu, '🛒  Tesla-Shop', 'shop');
    button(menu, '🎮  Steuerung', 'controls');
    button(menu, '⚙️  Einstellungen', 'settings');
    button(menu, 'ℹ️  Über das Spiel', 'about');
    const stats = el('div', 'title-stats', card);
    el('span', '', stats, '💶 ' + fmtCent(d.wallet) + ' Guthaben');
    el('span', '', stats, '🏆 Rekord ' + fmtKm(d.best.distance || 0));
    el('span', '', stats, '🛣️ ' + fmtKm((d.stats.totalKm || 0) * 1000, 1) + ' gesamt');
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
    item('Strecke', fmtKm(g.player.s));
    item('Guthaben dieser Fahrt', fmtCent(g.money));
    item('Navi-Ziel', g.navi.target.name);
    item('Navi-Änderungen', fmtNum(g.stats.naviChanges));
    item('Zuschauer', fmtNum(Math.round(g.viewers)));
    item('Sendezeit', fmtDuration(g.t));
    const jobs = el('div', 'job-list', card);
    el('h3', '', jobs, 'You had 5 Jobs');
    for (const j of g.jobs) {
      const r = el('div', 'job' + (j.done ? ' done' : ''), jobs);
      el('span', 'job-box', r, j.done ? '✔' : '');
      el('span', '', r, j.text);
    }
    const menu = el('div', 'menu row', card);
    button(menu, '▶ Weiterfahren', 'resume', 'primary');
    button(menu, '↻ Neustart', 'restart');
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
    el('span', 'num', dist, fmtKm(o.distance));
    el('span', 'lbl', dist, o.newRecord ? '🏆 Neuer Rekord!' : 'Rekord: ' + fmtKm(o.best));
    const mon = el('div', 'over-money', big);
    el('span', 'num', mon, '+' + fmtCent(o.money));
    el('span', 'lbl', mon, 'Guthaben · jetzt ' + fmtCent(o.wallet));
    const menu = el('div', 'menu row over-menu', card);
    button(menu, '↻ Nochmal fahren', 'restart', 'primary');
    button(menu, '🛒 Tesla-Shop', 'shop');
    button(menu, '🏠 Hauptmenü', 'menu');
    const cols = el('div', 'over-cols', card);
    const left = el('div', 'over-col', cols);
    el('h3', '', left, 'Abrechnung');
    const keys = Object.keys(o.breakdown).sort((a, b) => {
      const ia = BREAKDOWN_ORDER.indexOf(a);
      const ib = BREAKDOWN_ORDER.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
    for (const k of keys) {
      const v = o.breakdown[k];
      if (Math.abs(v) < 0.005) continue;
      const row = el('div', 'bd' + (v < 0 ? ' minus' : ''), left);
      el('span', '', row, k);
      el('span', '', row, (v < 0 ? '−' : '+') + fmtCent(Math.abs(v)));
    }
    el('h3', '', left, 'You had 5 Jobs');
    for (const j of o.jobs) {
      const row = el('div', 'job' + (j.done ? ' done' : ''), left);
      el('span', 'job-box', row, j.done ? '✔' : '');
      el('span', '', row, j.text);
    }
    const right = el('div', 'over-col', cols);
    el('h3', '', right, 'Statistik');
    const st = o.stats;
    const line = (k, v) => {
      const row = el('div', 'bd', right);
      el('span', '', row, k);
      el('span', '', row, v);
    };
    line('Navi-Ziele erreicht', fmtNum(st.naviReached));
    line('Navi-Änderungen', fmtNum(st.naviChanges));
    line('Haarscharf überholt', fmtNum(st.nearMisses));
    line('Rempler', fmtNum(st.crashes));
    line('Höchstgeschwindigkeit', fmtNum(Math.round(st.maxSpeedKmh)) + ' km/h');
    line('Zuschauer-Spitze', fmtNum(o.peakViewers));
    line('Wischer: gezuckt / gewischt', fmtNum(st.twitches) + ' / ' + fmtNum(st.wipes));
    line('Sendezeit', fmtDuration(o.time) + ' (bis ' + o.clock + ' Uhr)');
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
    const crew = el('div', 'crew', card);
    for (const [k, v] of ABSPANN_CREW) {
      const c = el('div', 'crew-row', crew);
      el('span', 'k', c, k);
      el('span', 'v', c, v);
    }
  }

  render_shop(s, d) {
    s.textContent = '';
    const card = el('div', 'card shop-card', s);
    const head = el('div', 'shop-head', card);
    el('h2', '', head, '🛒 Tesla-Shop');
    el('div', 'wallet', head, '💶 ' + fmtCent(d.wallet));
    el('p', 'sub', card, 'Upgrades für den schwarzen Model 3 Long Range AWD. Bezahlt wird mit Bonusguthaben aus dem Live-Bereich.');
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
      ['Lenken', '← → oder A D', 'Linker Stick', '◀ ▶'],
      ['Strom geben', '↑ oder W', 'RT oder Steuerkreuz ↑', 'Gas'],
      ['Bremsen', '↓ oder S', 'LT oder Steuerkreuz ↓', 'Bremse'],
      ['Hupen (Brunnen & Elsa grüßen)', 'Leertaste', 'A', '📯'],
      ['Scheibenwischer von Hand', 'E', 'X', '🌧️'],
      ['Megafon (aus dem Shop)', 'H', 'Y', '📢'],
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
      'Wenn NOMI sagt „Die linke Fahrspur ist freigeschaltet.“, gibt es auf der ganz linken Spur Bonusguthaben – eine Minute lang.',
      'Danach gilt wieder das Rechtsfahrgebot. Sonst kommt die Polizei Gifhorn.',
      'Das Navi-Ziel ändert sich ständig – jeder neue Zuschauer bietet einen Cent mehr. Erreichte Ziele bringen Guthaben.',
      'Lade-Ringe füllen den Akku. Bananensaft ist super, Koriander leider nicht.',
      'Wer gut fährt, bekommt Regen – mit Regenzulage. Der automatische Wischer ist allerdings noch in der Beta.',
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
    toggle('speech', 'Sprachausgabe (NOMI und Sprachdurchsagen)', d.speech);
    toggle('chat', 'Live-Chat anzeigen', d.chat);
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
    if (!d.speechSupported) el('p', 'note', card, 'Hinweis: Dieser Browser hat keine deutsche Sprachausgabe – NOMI spricht dann nur per Untertitel.');
    const rr = el('div', 'set-row', list);
    el('span', '', rr, 'Spielstand');
    button(rr, 'Spielstand zurücksetzen', 'reset', 'off');
    const menu = el('div', 'menu row', card);
    button(menu, '← Zurück', 'back', 'primary');
  }

  render_about(s) {
    s.textContent = '';
    const card = el('div', 'card about-card', s);
    el('h2', '', card, 'ℹ️ Über das Spiel');
    const p = (t) => el('p', '', card, t);
    p('„Mini Adam – Tesla-Navi ferngesteuert“ ist ein liebevolles, nicht-kommerzielles Fan-Spiel rund um SkylineTV LIVE. Mini Adam – der Plüsch-Adam mit Kappe, Bart und LIVE-Shirt – fährt den schwarzen Tesla Model 3 Long Range AWD mit 75-kWh-Akku über die Autobahn, während der Chat das Navi fernsteuert.');
    p('Fast alle Witze stammen aus dem SkylineTV LIVE Wiki: die freigeschaltete linke Spur, das Navi-Bieten mit einem Cent mehr, BrunnenTV mit Herrn Schönnbrun, Elsa, die Polizei Gifhorn, Meister Propper (kommt gleich), Malte, die Sparkassen-Farbe, Rahmen aus dem Live-Bereich, Sprachdurchsagen von Fräulein Kassandra und Brüll-William, Bananensaft statt Koriander, „You had 5 Jobs“ und die erlogenen Berufsbezeichnungen im Abspann.');
    p('NOMI ist der Boardcomputer auf dem Armaturenbrett. Alle Grafiken, Geräusche und Stimmen entstehen direkt im Browser – ohne Bilder- oder Tondateien.');
    const link = el('a', 'link', card, 'SkylineTV LIVE Wiki öffnen');
    link.href = 'https://skylinetv.live/wiki/index.php?title=Hauptseite';
    link.target = '_blank';
    link.rel = 'noopener';
    const mem = el('div', 'tribute', card);
    el('span', 'heart', mem, '🖤');
    el('span', '', mem, 'In Erinnerung an Adam Wolke – danke für die Live-Eskalationen.');
    const menu = el('div', 'menu row', card);
    button(menu, '← Zurück', 'back', 'primary');
  }
}
