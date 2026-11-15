// Das Stream-Overlay über dem Spiel: LIVE-Anzeige, Zuschauer, Strecke, Guthaben, Akku,
// Karosserie-Punkte, Chat mit Bots, NOMI-Untertitel, Hinweise, Sprachdurchsagen, Rahmen und Blitzerfotos.
import { fmtNum, fmtCent, fmtKm, fmtDuration, clamp } from '../util.js';
import { nameColor, BOTS } from '../data.js';

function el(tag, cls, parent, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  if (parent) parent.appendChild(e);
  return e;
}

const RAHMEN_EMOJI = {
  rosen: '🌹', pommes: '🍟', burger: '🍔', candy: '🍬', chips: '🥔', kuerbis: '🎃',
};

// Ein Rahmen-Streifen zeigt nur so viele Teile, wie ganz hineinpassen – sonst sind sie an den Enden angeschnitten
function fitStrip(strip) {
  const first = strip.firstElementChild;
  if (!first) return;
  const column = strip.classList.contains('strip-left') || strip.classList.contains('strip-right');
  const room = column ? strip.clientHeight : strip.clientWidth;
  const size = column ? first.offsetHeight : first.offsetWidth;
  if (!room || !size) return;
  const n = Math.max(1, Math.floor(room / (size * 1.12)));
  while (strip.childElementCount > n) strip.lastElementChild.remove();
}

export class UI {
  constructor(root) {
    this.root = root;
    this.hud = el('div', 'hud hidden', root);
    this.hud.id = 'hud';
    // --- oben links: Stream-Infos ---
    const info = el('div', 'hud-info', this.hud);
    this.infoEl = info;
    const live = el('div', 'live-row', info);
    this.liveBadge = el('span', 'live-badge', live, '● LIVE');
    this.viewersEl = el('span', 'viewers', live, '👁 0');
    this.timeEl = el('span', 'streamtime', live, '0:00');
    const rows = el('div', 'stat-rows', info);
    const row = (icon, label) => {
      const r = el('div', 'stat', rows);
      el('span', 'stat-icon', r, icon);
      const v = el('span', 'stat-val', r, '');
      if (label) el('span', 'stat-label', r, label);
      return v;
    };
    this.distEl = row('📏', '');
    this.recordEl = el('span', 'stat-sub', this.distEl.parentNode, '');
    this.speedEl = row('🚗', '');
    this.moneyRow = row('💶', 'Guthaben');
    // Gutschriften erscheinen genau dort, wo sonst „Guthaben“ steht, damit nichts aus dem Feld ragt
    const moneyStat = this.moneyRow.parentNode;
    this.moneySlot = el('span', 'money-slot', moneyStat);
    this.moneySlot.appendChild(moneyStat.querySelector('.stat-label'));
    this.moneyPops = el('span', 'money-pops', this.moneySlot);
    this.batteryEl = row('🔋', '');
    this.batteryBar = el('span', 'battery-bar', this.batteryEl.parentNode);
    this.batteryFill = el('span', 'battery-fill', this.batteryBar);
    this.damageEl = row('🧸', '');
    this.jobsEl = el('div', 'jobs-mini', info);
    this.zulageEl = el('div', 'zulage hidden', info, '🌧️ Regenzulage ×1,5');

    // --- Mitte oben ---
    this.leftLaneEl = el('div', 'leftlane hidden', this.hud);
    this.leftLaneText = el('div', 'leftlane-text', this.leftLaneEl, '');
    const bar = el('div', 'leftlane-bar', this.leftLaneEl);
    this.leftLaneFill = el('div', 'leftlane-fill', bar);
    // Ziel, Entfernung und Gebot getrennt: wird es eng, kürzt sich der Name, die Entfernung bleibt stehen
    this.naviEl = el('div', 'navi-line', this.hud);
    this.naviTarget = el('span', 'navi-target', this.naviEl, '');
    this.naviKm = el('span', 'navi-km', this.naviEl, '');
    this.naviBid = el('span', 'navi-bid', this.naviEl, '');
    // NOMI-Untertitel, Banner, Hinweise und die Kamera-Anzeige teilen sich eine Spalte (siehe .center-stack)
    const stack = el('div', 'center-stack', this.hud);
    this.stackEl = stack;
    this.nomiEl = el('div', 'nomi-sub hidden', stack);
    const eyes = el('span', 'nomi-eyes', this.nomiEl);
    el('i', '', eyes);
    el('i', '', eyes);
    this.nomiText = el('span', 'nomi-text', this.nomiEl, '');
    this.bannerEl = el('div', 'banner hidden', stack, '');
    this.toastsEl = el('div', 'toasts', stack);
    this.cameraHint = el('div', 'camera-hint hidden', stack, '');

    // --- rechts: Chat ---
    this.chatEl = el('div', 'chat', this.hud);
    const head = el('div', 'chat-head', this.chatEl);
    el('span', '', head, 'Live-Chat');
    this.chatCount = el('span', 'chat-count', head, '');
    this.chatList = el('div', 'chat-list', this.chatEl);

    // --- unten: Sprachdurchsage, Funkloch ---
    this.durchsageEl = el('div', 'durchsage hidden', this.hud);
    this.funklochEl = el('div', 'funkloch hidden', this.hud);
    el('div', 'funkloch-icon', this.funklochEl, '📡');
    el('div', 'funkloch-text', this.funklochEl, 'Verbindung verloren – Telekom, Vodafone und O₂ werden neu gebündelt …');
    this.photoEl = el('div', 'photo hidden', this.hud);
    this.rahmenEl = el('div', 'rahmen-layer', this.hud);

    this.chatOn = true;
    this.lastHud = 0;
    this.toasts = [];
    this.bannerT = 0;
    this.nomiT = 0;
    this.durchsageT = 0;
    this.photoT = 0;
    this.rahmenList = [];
    this.photos = [];
    this.moneyShown = 0;

    // Die Mittelspalte (Navi-Zeile, linke Spur, NOMI, Banner, Hinweise) liegt zwischen den Feldern links und rechts.
    // Ist dort kein Platz (Handy hochkant), rückt sie unter die Felder, statt sie zu überdecken.
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => this.layout());
      ro.observe(info);
      ro.observe(this.chatEl);
    }
    window.addEventListener('resize', () => this.layout());
  }

  layout() {
    const a = this.infoEl.getBoundingClientRect();
    if (!a.width) return; // HUD gerade unsichtbar
    const W = window.innerWidth;
    const chat = this.chatOn && this.chatEl.getBoundingClientRect();
    const side = Math.max(a.right, chat && chat.width ? W - chat.left : 0) + 14;
    let mid = W - 2 * side;
    let top = 14;
    const narrow = mid < 240;
    if (narrow) {
      // feste Unterkante des Chats (seine Höchsthöhe), damit die Spalte nicht mit jeder Nachricht springt
      const chatBottom = chat && chat.width ? chat.top + (parseFloat(getComputedStyle(this.chatEl).maxHeight) || chat.height) : 0;
      top = Math.max(a.bottom, chatBottom) + 10;
      mid = W - 28;
    }
    const st = this.hud.style;
    st.setProperty('--mid', Math.round(mid) + 'px');
    st.setProperty('--top', Math.round(top) + 'px');
    this.hud.classList.toggle('hud-narrow', narrow);
    this.naviMax = Math.min(760, mid);
  }

  /**
   * Der Stream ist weg: Untertitel, Banner und Hinweise sind so lange ausgeblendet – aber nur, wenn sie unter dem
   * Funkloch-Kasten lägen (sonst schienen sie durch). Daneben bleiben sie stehen, auch NOMIs Funkloch-Ansage.
   */
  funkCover() {
    let hit = false;
    if (!this.funklochEl.classList.contains('hidden')) {
      const f = this.funklochEl.getBoundingClientRect();
      const s = this.stackEl.getBoundingClientRect();
      hit = s.height > 0 && f.left < s.right && f.right > s.left && f.top < s.bottom + 6 && f.bottom > s.top - 6;
    }
    this.hud.classList.toggle('funk', hit);
  }

  /**
   * Läuft die Mittelspalte bis an die Sprachdurchsage, den Rahmen-Hinweis, die Touch-Knöpfe, das eigene Auto
   * (Drohnenansicht) oder den unteren Rand, gehen die ältesten Hinweise vorzeitig – der neueste bleibt immer stehen.
   */
  fitStack() {
    this.funkCover();
    this.fitDurchsage();
    if (!this.toasts.length) return;
    const s = this.stackEl.getBoundingClientRect();
    if (!s.height) return;
    let limit = window.innerHeight - 8;
    // in der Drohnenansicht beginnt das Auto bei gut der Hälfte der Bildhöhe (hochkant ab ~55 %, quer ab ~58 %)
    if (document.body.classList.contains('drone')) limit = Math.min(limit, window.innerHeight * 0.54);
    const below = [this.durchsageEl, ...this.rahmenEl.querySelectorAll('.rahmen-caption'), ...document.querySelectorAll('.touch button')];
    for (const e of below) {
      const r = e.getBoundingClientRect();
      if (r.height && r.top > s.top + 40 && r.left < s.right && r.right > s.left) limit = Math.min(limit, r.top - 8);
    }
    const bottom = () => this.stackEl.getBoundingClientRect().bottom;
    while (this.toasts.length > 1 && bottom() > limit) this.toasts.shift().el.remove();
    // passt selbst der neueste nicht (hohes Banner), wartet er unsichtbar, bis darüber Platz frei wird
    this.toastsEl.classList.toggle('squeezed', bottom() > limit);
    this.fitDurchsage();
  }

  /**
   * Reicht der Platz auch ohne Hinweise nicht (Untertitel und langes Banner auf einem niedrigen Handy quer), wartet
   * die Sprachdurchsage unsichtbar, bis darüber wieder Platz ist – zu hören ist sie ja trotzdem, und das Banner
   * („Ziel erreicht“) ist wichtiger.
   */
  fitDurchsage() {
    const d = this.durchsageEl;
    let hit = false;
    if (!d.classList.contains('hidden')) {
      const r = d.getBoundingClientRect();
      const s = this.stackEl.getBoundingClientRect();
      const shown = [this.nomiEl, this.bannerEl, this.toastsEl].filter((e) => !e.classList.contains('hidden') && !e.classList.contains('squeezed'));
      const bottom = Math.max(-Infinity, ...shown.map((e) => e.getBoundingClientRect()).filter((b) => b.height).map((b) => b.bottom));
      hit = r.height > 0 && r.top > s.top + 40 && r.left < s.right && r.right > s.left && bottom > r.top - 4;
    }
    d.classList.toggle('squeezed', hit);
  }

  show(v) {
    this.hud.classList.toggle('hidden', !v);
  }

  setChat(on) {
    this.chatOn = on;
    this.chatEl.classList.toggle('hidden', !on);
    this.layout();
  }

  reset() {
    this.chatList.textContent = '';
    this.toastsEl.textContent = '';
    this.rahmenEl.textContent = '';
    this.clearMoneyPop();
    this.toasts = [];
    this.rahmenList = [];
    this.photos = [];
    this.bannerEl.classList.add('hidden');
    this.nomiEl.classList.add('hidden');
    this.durchsageEl.classList.add('hidden');
    this.photoEl.classList.add('hidden');
    // Funkloch-Anzeige samt „● LIVE“-Schild zurück (eine Fahrt kann mitten im Funkloch enden)
    this.funkloch(false);
    this.bannerT = this.nomiT = this.durchsageT = this.photoT = 0;
  }

  // --- Chat -------------------------------------------------------------------
  chat({ name, text, bot, icon }) {
    const m = el('div', 'msg' + (bot ? ' bot bot-' + bot : ''), this.chatList);
    // Leerzeichen zwischen den Teilen, sonst bricht ein schmaler Chat mitten im Namen um
    if (bot) {
      el('span', 'bot-icon', m, icon || BOTS[bot]?.icon || '🤖');
      const n = el('span', 'name', m, name);
      n.style.color = '#ffd76a';
      m.append(' ');
      el('span', 'bot-tag', m, 'BOT');
    } else {
      const n = el('span', 'name', m, name);
      n.style.color = nameColor(name);
    }
    m.append(' ');
    el('span', 'text', m, text);
    while (this.chatList.childElementCount > 36) this.chatList.firstElementChild.remove();
    this.chatList.scrollTop = this.chatList.scrollHeight;
  }

  // --- Meldungen -------------------------------------------------------------------
  toast(text, kind = 'info', sub = '') {
    const t = el('div', 'toast toast-' + kind, this.toastsEl, text);
    if (sub) el('div', 'toast-sub', t, sub);
    // drop(): Hinweis vorzeitig wegnehmen (z. B. wenn das, worauf er zeigt, nicht mehr zu sehen ist)
    const rec = { el: t, t: sub ? 5 : 3.6, drop: () => (rec.t = Math.min(rec.t, 0)) };
    this.toasts.push(rec);
    while (this.toasts.length > 4) {
      const old = this.toasts.shift();
      old.el.remove();
    }
    this.fitStack();
    return rec;
  }

  banner(text, dur = 3, sub = '') {
    this.bannerEl.textContent = text;
    if (sub) el('div', 'banner-sub', this.bannerEl, sub);
    this.bannerEl.classList.remove('hidden');
    this.bannerEl.classList.remove('pop');
    void this.bannerEl.offsetWidth;
    this.bannerEl.classList.add('pop');
    this.bannerT = dur;
    this.fitStack();
  }

  nomi(text, dur = 3) {
    this.nomiText.textContent = text;
    this.nomiEl.classList.remove('hidden');
    this.nomiT = Math.max(2.2, dur);
    this.fitStack();
  }

  money(amount, label) {
    // eine Gutschrift auf einmal an Stelle von „Guthaben“; die nächste löst die vorige ab
    this.moneyPops.textContent = '';
    const p = el('span', 'money-pop ' + (amount >= 0 ? 'plus' : 'minus'), this.moneyPops, (amount >= 0 ? '+' : '−') + fmtCent(Math.abs(amount)));
    if (label) {
      el('small', '', p, label);
      // passt der Grund nicht mehr ins Feld, bleibt nur der Betrag
      if (p.offsetWidth > this.moneySlot.clientWidth) p.lastChild.remove();
    }
    this.moneySlot.classList.add('popping');
    clearTimeout(this.moneyTimer);
    this.moneyTimer = setTimeout(() => this.clearMoneyPop(), 1900);
  }

  clearMoneyPop() {
    clearTimeout(this.moneyTimer);
    this.moneyPops.textContent = '';
    this.moneySlot.classList.remove('popping');
  }

  durchsage(voiceLabel, text, dur, buyer) {
    this.durchsageEl.textContent = '';
    const h = el('div', 'durchsage-head', this.durchsageEl, `🎙️ Sprachdurchsage von ${buyer} · Stimme: ${voiceLabel}`);
    h.title = voiceLabel;
    el('div', 'durchsage-text', this.durchsageEl, '»' + text + '«');
    this.durchsageEl.classList.remove('hidden');
    this.durchsageT = clamp(dur, 3, 14);
    this.fitStack();
  }

  funkloch(on) {
    this.funklochEl.classList.toggle('hidden', !on);
    this.funkCover();
    this.liveBadge.classList.toggle('offline', on);
    this.liveBadge.textContent = on ? '● OFFLINE' : '● LIVE';
  }

  damage(hits, max) {
    this.damageEl.parentNode.classList.remove('shake');
    void this.damageEl.offsetWidth;
    this.damageEl.parentNode.classList.add('shake');
  }

  jobs(list) {
    this.jobsEl.textContent = '';
    el('span', 'jobs-title', this.jobsEl, 'You had 5 Jobs');
    for (const j of list) {
      const r = el('div', 'job' + (j.done ? ' done' : ''), this.jobsEl);
      el('span', 'job-box', r, j.done ? '✔' : '');
      el('span', 'job-text', r, j.text);
      if (!j.done && j.progress > 0) {
        const b = el('span', 'job-bar', r);
        el('span', 'job-fill', b).style.width = Math.round(j.progress * 100) + '%';
      }
    }
  }

  /** Rahmen-Einblendung (wie im Live-Bereich gekauft). */
  rahmen(r, buyer) {
    const layer = el('div', 'rahmen rahmen-' + r.id, this.rahmenEl);
    const caption = el('div', 'rahmen-caption', layer, `${r.name} · ${fmtCent(r.price)} von ${buyer}`);
    caption.title = r.name;
    const emoji = RAHMEN_EMOJI[r.id];
    if (emoji) {
      const n = 22;
      for (const side of ['top', 'bottom', 'left', 'right']) {
        const strip = el('div', 'strip strip-' + side, layer);
        for (let i = 0; i < n; i++) el('span', '', strip, emoji);
      }
      if (r.id === 'kuerbis') layer.classList.add('corner-only');
    } else if (r.id === 'pappkarton') {
      const pile = el('div', 'boxes', layer);
      for (let i = 0; i < 26; i++) {
        const b = el('span', 'box', pile, '');
        b.style.left = (i % 13) * 7.8 + (i >= 13 ? 3.5 : 0) + '%';
        b.style.bottom = (i >= 13 ? 11 : 0) + Math.random() * 2 + '%';
        b.style.transform = `rotate(${(Math.random() - 0.5) * 16}deg)`;
        b.style.animationDelay = (i * 0.05).toFixed(2) + 's';
      }
    } else if (r.id === 'haelfte') {
      const side = Math.random() < 0.5 ? 'left' : 'right';
      el('div', 'half half-' + side, layer, 'Bildhälfte abgedeckt');
    } else if (r.id === 'elsa') {
      el('div', 'elsa-fly', layer, '');
    } else if (r.id === 'lego') {
      for (const side of ['top', 'bottom', 'left', 'right']) {
        const strip = el('div', 'strip lego strip-' + side, layer);
        for (let i = 0; i < 18; i++) el('span', 'brick b' + (i % 4), strip, '');
      }
    } else if (r.id === 'briefmarken') {
      el('div', 'stamp-frame', layer, '');
    } else if (r.id === 'keinerechte') {
      for (const side of ['top', 'bottom', 'left', 'right']) {
        const strip = el('div', 'strip norights strip-' + side, layer);
        const n = side === 'top' || side === 'bottom' ? 6 : 3;
        for (let i = 0; i < n; i++) el('span', '', strip, '© Keine Rechte');
      }
    } else if (r.id === 'rettich') {
      for (const side of ['top', 'bottom', 'left', 'right']) {
        const strip = el('div', 'strip strip-' + side, layer);
        for (let i = 0; i < 16; i++) el('span', 'rettich', strip, '');
      }
    }
    // Lego-Steine dehnen sich selbst auf die Streifenlänge, der Kürbis steht allein in der Ecke
    if (!layer.classList.contains('corner-only')) for (const s of layer.querySelectorAll('.strip:not(.lego)')) fitStrip(s);
    this.rahmenList.push({ el: layer, t: r.dur });
    this.fitStack();
  }

  /** Blitzerfoto als Polaroid einblenden. */
  photo(dataUrl, kmh, clock) {
    this.photoEl.textContent = '';
    if (dataUrl) {
      const img = el('img', '', this.photoEl);
      img.src = dataUrl;
      img.alt = 'Blitzerfoto';
      this.photos.push({ url: dataUrl, kmh, clock });
    }
    el('div', 'photo-cap', this.photoEl, `📸 ${kmh} km/h · ${clock} Uhr`);
    el('div', 'photo-sub', this.photoEl, 'Das Foto kommt in einen Rahmen.');
    this.photoEl.classList.remove('hidden');
    this.photoT = 6;
  }

  cameraLabel(text) {
    this.cameraHint.textContent = text;
    this.cameraHint.classList.remove('hidden');
    clearTimeout(this.camTimer);
    this.camTimer = setTimeout(() => this.cameraHint.classList.add('hidden'), 1600);
  }

  // --- pro Bild ------------------------------------------------------------------------
  update(dt, g) {
    // Zeitgesteuerte Elemente
    for (const t of this.toasts) {
      t.t -= dt;
      if (t.t <= 0) t.el.remove();
    }
    this.toasts = this.toasts.filter((t) => t.t > 0);
    if (this.bannerT > 0) {
      this.bannerT -= dt;
      if (this.bannerT <= 0) this.bannerEl.classList.add('hidden');
    }
    if (this.nomiT > 0) {
      this.nomiT -= dt;
      if (this.nomiT <= 0) this.nomiEl.classList.add('hidden');
    }
    if (this.durchsageT > 0) {
      this.durchsageT -= dt;
      if (this.durchsageT <= 0) this.durchsageEl.classList.add('hidden');
    }
    if (this.photoT > 0) {
      this.photoT -= dt;
      if (this.photoT <= 0) this.photoEl.classList.add('hidden');
    }
    for (const r of this.rahmenList) {
      r.t -= dt;
      if (r.t < 0.6) r.el.classList.add('out');
      if (r.t <= 0) r.el.remove();
    }
    this.rahmenList = this.rahmenList.filter((r) => r.t > 0);

    // Zahlen nur 10× pro Sekunde
    this.lastHud -= dt;
    if (this.lastHud > 0 || !g) return;
    this.lastHud = 0.1;
    const p = g.player;
    this.viewersEl.textContent = '👁 ' + fmtNum(Math.round(g.viewers));
    this.timeEl.textContent = fmtDuration(g.t);
    this.distEl.textContent = fmtKm(p.s);
    const best = g.save.best.distance || 0;
    this.recordEl.textContent = p.s > best && best > 0 ? '🏆 neuer Rekord!' : best > 0 ? 'Rekord ' + fmtKm(best) : '';
    this.recordEl.classList.toggle('record', p.s > best && best > 0);
    this.speedEl.textContent = Math.round(p.kmh) + ' km/h';
    this.moneyRow.textContent = fmtCent(g.money);
    this.batteryEl.textContent = Math.round(p.battery) + ' %';
    this.batteryFill.style.width = clamp(p.battery, 0, 100) + '%';
    this.batteryFill.className = 'battery-fill' + (p.battery < 15 ? ' low' : p.battery < 30 ? ' mid' : '');
    const left = Math.max(0, p.maxHits - p.hits);
    this.damageEl.textContent = '♥'.repeat(left) + '♡'.repeat(Math.max(0, p.maxHits - left));
    this.damageEl.title = 'Karosserie-Punkte';
    this.zulageEl.classList.toggle('hidden', !g.weather.regenzulage);
    // linke Spur
    const L = g.left;
    this.leftLaneEl.classList.toggle('hidden', !L.open);
    this.hud.classList.toggle('lane-on', L.open);
    if (L.open) {
      const inLane = p.inLeftLane;
      this.leftLaneText.textContent = (inLane ? '⬅️ Linke Spur: Bonus läuft! ' : '⬅️ Linke Spur frei! ') + Math.ceil(L.timer) + ' s';
      this.leftLaneEl.classList.toggle('active', inLane);
      this.leftLaneEl.classList.toggle('warn', L.timer < 10);
      this.leftLaneFill.style.width = clamp(L.timer / 60, 0, 1) * 100 + '%';
    }
    // Navi-Zeile
    const nv = g.navi;
    const rem = Math.max(0, nv.targetS - p.s);
    this.naviTarget.textContent = nv.arrived ? '📍 Ziel erreicht – warte auf das nächste Gebot …' : '📍 ' + nv.target.name;
    this.naviKm.textContent = nv.arrived ? '' : '\u00a0· ' + fmtKm(rem, rem < 10000 ? 1 : 0);
    this.naviBid.textContent = nv.arrived ? '' : `\u00a0· Gebot ${fmtCent(nv.bid)} von ${nv.bidder}`;
    // passt die ganze Zeile nicht zwischen Info-Feld und Chat, fällt das Gebot weg (es steht auch im Chat und im Auto)
    const need = this.naviTarget.scrollWidth + this.naviKm.scrollWidth + this.naviBid.scrollWidth + 30;
    this.naviEl.classList.toggle('short', need > (this.naviMax || 760));
    this.chatCount.textContent = fmtNum(Math.round(g.viewers)) + ' Zuschauer';
    this.fitStack();
  }
}
