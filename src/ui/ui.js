// Das Stream-Overlay über dem Spiel: LIVE-Anzeige, Zuschauer, Strecke, Guthaben, Akku,
// Karosserie-Punkte, Chat mit Bots, NOMI-Untertitel, Hinweise, Sprachdurchsagen, Rahmen und Blitzerfotos.
import { fmtNum, fmtCent, fmtKm, fmtDuration, clamp } from '../util.js';
import { nameColor, nameBreak, BOTS } from '../data.js';
import { DamageBadge, CruiseBadge } from './drive-hud.js';

function el(tag, cls, parent, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  if (parent) parent.appendChild(e);
  return e;
}

const RAHMEN_EMOJI = {
  rosen: '🌹', sonnenblumen: '🌻', pommes: '🍟', burger: '🍔', candy: '🍬', chips: '🥔', kuerbis: '🎃',
};

const DEG = Math.PI / 180;
/**
 * Bildpunkte je Tangens-Einheit der Hauptkamera bei gewünschtem senkrechtem Bildwinkel – wie setFov() in main.js:
 * waagerecht mindestens 86°, senkrecht zwischen 50° und 78°. Damit lässt sich ausrechnen, wo feste Teile des Bildes
 * (Innenspiegel, Mittelbildschirm, das eigene Auto) auf dem Schirm liegen, ohne die 3D-Szene zu kennen.
 */
function camScale(W, H, vfov) {
  const v = clamp(Math.max(vfov * DEG, 2 * Math.atan(Math.tan(43 * DEG) / (W / H))), 50 * DEG, 78 * DEG);
  return H / 2 / Math.tan(v / 2);
}
// Cockpit (setFov(58), Modell aus src/cockpit/cockpit.js): linke Kante von Innenspiegel und Mittelbildschirm samt
// Rahmen als Tangens-Abstand von der Bildmitte (nachgemessen; das Kopfwackeln verschiebt sie um wenige Bildpunkte)
const MIRROR = { left: 0.318 };
const SCREEN = { left: 0.253 };
// Drohne (setFov(50)): Dachkante des eigenen Autos unter der Bildmitte
const CAR_TOP = 0.095;
/** Oberkante des eigenen Autos in der Drohnenansicht (Bildpunkte von oben). */
function droneCarTop(W, H) {
  return H / 2 + CAR_TOP * camScale(W, H, 50);
}
/** Linke Kante von Mittelbildschirm und Innenspiegel des Cockpits (Bildpunkte). */
function cockpitParts(W, H) {
  const S = camScale(W, H, 58);
  return { screen: W / 2 + SCREEN.left * S, mirror: W / 2 + MIRROR.left * S };
}
const COARSE = typeof matchMedia === 'function' ? matchMedia('(pointer: coarse)') : { matches: false };
// Facecam: Eckradius wie in style.css (.facecam), kleinste sinnvolle Breite, Seitenverhältnis 16 : 9
const FC_RADIUS = 12;
const FC_MIN_W = 168;
const overlap = (a, b, pad = 0) => a.left < b.right + pad && a.right > b.left - pad && a.top < b.bottom + pad && a.bottom > b.top - pad;

/**
 * Lage eines Elements ohne Animationen und Drehungen (getBoundingClientRect enthielte etwa das Aufploppen des
 * Banners oder das Hereinfliegen des Fotos). Nur für Elemente ohne verschobene Vorfahren (nicht in .center-stack).
 */
function layoutRect(e) {
  let x = 0;
  let y = 0;
  for (let p = e; p; p = p.offsetParent) {
    x += p.offsetLeft;
    y += p.offsetTop;
  }
  return { left: x, top: y, right: x + e.offsetWidth, bottom: y + e.offsetHeight, height: e.offsetHeight };
}

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
    // Wagen von oben mit farbigen Zonen und den übrigen Punkten; Tempomat-Schild neben dem Tempo (src/ui/drive-hud.js)
    this.dmgBadge = new DamageBadge(this.damageEl.parentNode, this.damageEl);
    this.cruiseBadge = new CruiseBadge(this.speedEl.parentNode);
    this.jobsEl = el('div', 'jobs-mini', info);

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
    // am selben Platz spricht auch das Sprachstudio: dann mit Kopfhörer statt NOMIs Augen (siehe studio())
    el('span', 'studio-icon', this.nomiEl, '🎧');
    const words = el('span', 'nomi-words', this.nomiEl);
    el('span', 'studio-label', words, 'Sprachstudio');
    this.nomiText = el('span', 'nomi-text', words, '');
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
    el('div', 'funkloch-text', this.funklochEl, 'Verbindung verloren – alle Handynetze werden neu gebündelt …');
    this.photoEl = el('div', 'photo hidden', this.hud);
    this.rahmenEl = el('div', 'rahmen-layer', this.hud);
    // --- unten links: Facecam. Hier nur Rahmen und Namensschild; das Bild zeichnet WebGL genau in dieses Rechteck
    // (facecam.js, nach dem Cockpit), es liegt also unter allen HUD-Elementen und weicht ihnen deshalb aus ---
    this.facecamEl = el('div', 'facecam', this.hud);
    const tag = el('div', 'facecam-tag', this.facecamEl);
    el('i', 'facecam-dot', tag);
    el('span', '', tag, 'Mini Adam');
    this.facecamOn = true;
    // Lage in CSS-Pixeln (x, y, w, h) und Deckkraft; target: wohin sie gleitet (null = ausblenden); fcBox: was
    // placeFacecam zurückgibt (gerundet, mit Eckradius r)
    this.fc = { x: 0, y: 0, w: 0, h: 0, alpha: 0, target: null, check: 0 };
    this.fcBox = null;

    this.chatOn = true;
    this.chatRect = null;
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
      const ro = new ResizeObserver(() => {
        this.layout();
        this.trimChat();
      });
      ro.observe(info);
      ro.observe(this.chatEl);
      // die Spalte unter dem Spur-Balken beginnt nach seiner echten Höhe (--lane-h), nicht nach einer angenommenen
      const lane = new ResizeObserver(() => {
        const h = this.leftLaneEl.offsetHeight;
        if (h) this.hud.style.setProperty('--lane-h', h + 'px');
      });
      lane.observe(this.leftLaneEl);
    }
    window.addEventListener('resize', () => this.layout());
  }

  layout() {
    const drone = document.body.classList.contains('drone');
    this.layoutDrone = drone;
    this.layoutPhoto = !this.photoEl.classList.contains('hidden');
    const a = this.infoEl.getBoundingClientRect();
    const chat = this.chatOn && this.chatEl.getBoundingClientRect();
    const hasChat = !!(chat && chat.width);
    // wo der Chat gerade steht (null, wenn er nicht zu sehen ist) – dahinter bleibt die REC-Lampe im Cockpit aus
    this.chatRect = hasChat ? chat : null;
    if (!a.width) return; // HUD gerade unsichtbar
    const W = window.innerWidth;
    const H = window.innerHeight;
    const side = Math.max(a.right, hasChat ? W - chat.left : 0) + 14;
    let mid = W - 2 * side;
    let top = 14;
    const narrow = mid < 240;
    if (narrow) mid = W - 28;
    const hud = this.hud;
    const st = hud.style;
    st.setProperty('--mid', Math.round(mid) + 'px');
    hud.classList.toggle('hud-narrow', narrow);
    hud.classList.remove('col-fit');
    // so breit und so weit links steht die Spalte nach style.css (mittig)
    const w0 = this.stackEl.offsetWidth;
    const L = (W - w0) / 2;
    const R = (W + w0) / 2;
    const across = (r) => r.left < R + 10 && r.right > L - 10;
    if (narrow) {
      // nur unter den Feldern, über denen sie sonst läge – auf dem Handy quer endet das Info-Feld links neben ihr,
      // dann beginnt sie schon unter dem Chat und hat bis zum Auto der Drohnenansicht mehr Platz
      if (across(a)) top = Math.max(top, a.bottom + 10);
      // feste Unterkante des Chats (seine Höchsthöhe), damit die Spalte nicht mit jeder Nachricht springt
      if (hasChat && across(chat)) top = Math.max(top, chat.top + (parseFloat(getComputedStyle(this.chatEl).maxHeight) || chat.height) + 10);
      // Touch hochkant liegt das Blitzerfoto oben rechts über dem Chat und reicht etwas tiefer: so lange darunter
      if (this.layoutPhoto) {
        const p = layoutRect(this.photoEl);
        if (p.height && across(p)) top = Math.max(top, p.bottom + 14);
      }
    }
    st.setProperty('--top', Math.round(top) + 'px');
    // Cockpit auf Touch-Geräten quer: Innenspiegel und Mittelbildschirm liegen rechts der Mitte, wo sonst Spur-Balken,
    // Untertitel und Hinweise stünden – die Spalte endet dann links davor und rückt dafür neben das Info-Feld
    if (!drone && W > H && COARSE.matches) {
      const { screen, mirror } = cockpitParts(W, H);
      const right = Math.min(R, screen - 10, mirror - 10);
      const left = narrow ? L : Math.min(L, a.right + 14);
      const w = Math.max(120, Math.min(w0, right - left));
      if (right < R) {
        const c = clamp(W / 2, left + w / 2, Math.max(left + w / 2, right - w / 2));
        st.setProperty('--col-w', Math.round(w) + 'px');
        st.setProperty('--lane-w', Math.round(Math.min(460, w)) + 'px');
        st.setProperty('--col-dx', Math.round(c - W / 2) + 'px');
        hud.classList.add('col-fit');
        // die Navi-Zeile darüber rückt mit, damit alles eine Spalte bleibt
        mid = Math.min(mid, w);
      }
    }
    this.naviMax = Math.min(760, mid);
  }

  /** Hat sich seit dem letzten layout() etwas geändert, wonach sich die Spalte richtet? */
  layoutStale() {
    return document.body.classList.contains('drone') !== this.layoutDrone || this.photoEl.classList.contains('hidden') === this.layoutPhoto;
  }

  /**
   * Der Stream ist weg: Untertitel, Banner und Hinweise sind so lange ausgeblendet – aber nur, wenn sie unter dem
   * Funkloch-Kasten lägen (sonst schienen sie durch). Daneben bleiben sie stehen, auch NOMIs Funkloch-Ansage.
   * Ebenso der Spur-Balken, der auf dem Handy quer unter dem Chat genau dort steht.
   */
  funkCover() {
    let hit = false;
    let lane = false;
    if (!this.funklochEl.classList.contains('hidden')) {
      const f = this.funklochEl.getBoundingClientRect();
      const under = (r) => r.height > 0 && f.left < r.right && f.right > r.left && f.top < r.bottom + 6 && f.bottom > r.top - 6;
      hit = under(this.stackEl.getBoundingClientRect());
      lane = !this.leftLaneEl.classList.contains('hidden') && under(this.leftLaneEl.getBoundingClientRect());
    }
    this.hud.classList.toggle('funk', hit);
    this.hud.classList.toggle('funk-lane', lane);
  }

  /**
   * Untere Grenzen der Mittelspalte. hard: was nie verdeckt werden darf (unterer Rand, Touch-Knöpfe, das eigene Auto
   * der Drohnenansicht); soft: zusätzlich Sprachdurchsage und Rahmen-Hinweis – die warten, wenn Untertitel oder Banner
   * hinunterreichen, nur Hinweise weichen ihnen.
   */
  stackLimits(s) {
    const W = window.innerWidth;
    const H = window.innerHeight;
    let hard = H - 8;
    if (document.body.classList.contains('drone')) hard = Math.min(hard, droneCarTop(W, H) - 10);
    // was unterhalb des Spaltenanfangs liegt (daneben Liegendes zählt nicht)
    const below = (r) => r.height && r.top > s.top + 4 && r.left < s.right && r.right > s.left;
    for (const b of document.querySelectorAll('.touch button')) {
      const r = b.getBoundingClientRect();
      if (below(r)) hard = Math.min(hard, r.top - 8);
    }
    let soft = hard;
    for (const e of [this.durchsageEl, ...this.rahmenEl.querySelectorAll('.rahmen-caption')]) {
      if (e.classList.contains('hidden')) continue;
      const r = layoutRect(e);
      if (below(r)) soft = Math.min(soft, r.top - 8);
    }
    return { hard, soft };
  }

  /** Unterkante der sichtbaren Teile der Mittelspalte (ohne Animationen). */
  stackBottom(s, parts = this.stackEl.children) {
    let b = -Infinity;
    for (const e of parts) {
      if (e.classList.contains('squeezed') || !e.offsetHeight) continue;
      b = Math.max(b, s.top + e.offsetTop + e.offsetHeight);
    }
    return b;
  }

  /**
   * Läuft die Mittelspalte bis an die Sprachdurchsage, den Rahmen-Hinweis, die Touch-Knöpfe, das eigene Auto
   * (Drohnenansicht) oder den unteren Rand, gehen die ältesten Hinweise vorzeitig – der neueste bleibt immer stehen.
   * Reicht es dann noch immer nicht (Drohnenansicht auf dem Handy quer), wird die Spalte Schritt für Schritt knapper:
   * Kamera-Anzeige weg, der neueste Hinweis wartet, Banner kleiner (ohne Unterzeile), NOMI-Untertitel weg (NOMI ist zu
   * hören), Banner einzeilig.
   */
  fitStack() {
    if (this.layoutStale()) this.layout();
    this.funkCover();
    const sc = this.stackEl.classList;
    sc.remove('tight', 'tight2');
    for (const e of [this.nomiEl, this.toastsEl, this.cameraHint]) e.classList.remove('squeezed');
    const s = this.stackEl.getBoundingClientRect();
    if (s.height) {
      const { hard, soft } = this.stackLimits(s);
      const over = (limit) => this.stackBottom(s) > limit;
      while (this.toasts.length > 1 && over(soft)) this.toasts.shift().el.remove();
      // passt selbst der neueste nicht (hohes Banner), wartet er unsichtbar, bis darüber Platz frei wird
      if (over(soft)) this.toastsEl.classList.add('squeezed');
      if (over(soft)) this.cameraHint.classList.add('squeezed');
      if (over(hard)) sc.add('tight');
      if (over(hard)) this.nomiEl.classList.add('squeezed');
      if (over(hard)) sc.add('tight2');
    }
    this.fitDurchsage();
  }

  /**
   * Reicht der Platz auch ohne Hinweise nicht (Untertitel und langes Banner auf einem niedrigen Handy quer), wartet
   * die Sprachdurchsage unsichtbar, bis darüber wieder Platz ist – zu hören ist sie ja trotzdem, und das Banner
   * („Ziel erreicht“) ist wichtiger. Ebenso ein Rahmen-Hinweis, auf den die Spalte reicht.
   * Gemessen wird ohne Animationen: das Banner ploppt aus 60 % Größe auf und wäre sonst anfangs zu klein.
   */
  fitDurchsage() {
    const s = this.stackEl.getBoundingClientRect();
    const bottom = this.stackBottom(s, [this.nomiEl, this.bannerEl, this.toastsEl]);
    const hit = (e) => {
      if (e.classList.contains('hidden') || !s.height) return false;
      const r = layoutRect(e);
      return r.height > 0 && r.top > s.top + 4 && r.left < s.right && r.right > s.left && bottom > r.top - 4;
    };
    this.durchsageEl.classList.toggle('squeezed', hit(this.durchsageEl));
    for (const c of this.rahmenEl.querySelectorAll('.rahmen-caption')) c.classList.toggle('squeezed', hit(c));
  }

  show(v) {
    this.hud.classList.toggle('hidden', !v);
  }

  /** Einstellung „Facecam“ (an/aus) */
  setFacecam(on) {
    this.facecamOn = on;
  }

  /**
   * Wo die Facecam hin soll (CSS-Pixel) – unten links über der Türverkleidung des Cockpits, etwa 22 % der Bildbreite.
   * Rahmen-Streifen und Briefmarkenrand schieben sie nach innen, Pappkartons nach oben, auf Tablets steht sie über den
   * Touch-Knöpfen; nach oben begrenzt sie das Info-Feld (dann wird sie kleiner). null: kein Platz (Handy hochkant,
   * kleine Handys quer, abgedeckte linke Bildhälfte). blocked: ein anderes HUD-Element liegt gerade darauf – dann
   * blendet sie so lange aus (sie ist das Unwichtigste im Bild).
   */
  facecamTarget() {
    const W = window.innerWidth;
    const H = window.innerHeight;
    if (COARSE.matches && (H > W || H <= 500)) return null;
    const vh = H / 100;
    let w = Math.min(W * 0.22, H * 0.5, 440);
    let left = 14;
    let bottom = 14;
    for (const { el: r } of this.rahmenList) {
      if (r.querySelector('.half-left')) return null;
      if (r.querySelector('.strip-left') && !r.classList.contains('corner-only')) {
        left = Math.max(left, 7.5 * vh + 10);
        bottom = Math.max(bottom, 7.5 * vh + 10);
      }
      if (r.querySelector('.stamp-frame')) {
        left = Math.max(left, 4.2 * vh + 22);
        bottom = Math.max(bottom, 4.2 * vh + 22);
      }
      if (r.querySelector('.boxes')) bottom = Math.max(bottom, 15 * vh + 8);
    }
    // Touch-Knöpfe in der linken Spalte (Tablet quer): darüber
    for (const b of document.querySelectorAll('.touch button')) {
      const r = b.getBoundingClientRect();
      if (r.width && r.left < left + w) bottom = Math.max(bottom, H - r.top + 10);
    }
    const info = this.infoEl.getBoundingClientRect();
    const top = info.width && info.left < left + w ? info.bottom + 12 : 14;
    let h = (w * 9) / 16;
    if (H - bottom - h < top) {
      h = H - bottom - top;
      w = (h * 16) / 9;
    }
    if (w < FC_MIN_W) return null;
    const box = { left, top: H - bottom - h, right: left + w, bottom: H - bottom };
    // was darauf liegen könnte: Sprachdurchsage, Blitzerfoto, Mittelspalte, Funkloch, Spur-Balken, Rahmen-Hinweis
    let blocked = false;
    const parts = [this.durchsageEl, this.photoEl, this.funklochEl, this.leftLaneEl, ...this.stackEl.children, ...this.rahmenEl.querySelectorAll('.rahmen-caption')];
    for (const e of parts) {
      if (e.classList.contains('hidden') || e.classList.contains('squeezed')) continue;
      const r = e.getBoundingClientRect();
      if (r.width && r.height && overlap(r, box, 6)) blocked = true;
    }
    return { x: left, y: box.top, w, h, blocked };
  }

  /**
   * Pro Bild vor dem Rendern (main.js): Facecam einblenden, wenn want (Cockpit-Ansicht in der Fahrt) und die
   * Einstellung an ist, sanft an ihren Platz gleiten lassen und den Rahmen dorthin setzen. Rückgabe: Lage und
   * Deckkraft fürs WebGL-Bild ({ x, y, w, h, r, alpha } in CSS-Pixeln) oder null, wenn nichts zu zeichnen ist.
   */
  placeFacecam(dt, want) {
    const f = this.fc;
    const on = want && this.facecamOn && !this.hud.classList.contains('hidden') && this.hud.style.display !== 'none';
    // neue Fenstergröße (auch in der Pause): sofort neu einpassen, ohne Gleiten
    const resized = f.vw !== window.innerWidth || f.vh !== window.innerHeight;
    f.vw = window.innerWidth;
    f.vh = window.innerHeight;
    // Lage neu bestimmen: 10× pro Sekunde (liest Elementgrößen) und sofort beim Einblenden. Kamerawechsel, Ende der
    // Fahrt oder Einstellung aus: sofort weg (das WebGL-Bild gibt es dann ohnehin nicht mehr)
    f.check -= dt;
    if (!on) {
      f.target = null;
      f.alpha = 0;
    } else if (resized || f.check <= 0 || !f.target) {
      f.check = 0.1;
      f.target = this.facecamTarget();
    }
    const t = f.target;
    const show = t && !t.blocked ? 1 : 0;
    if (!t && resized) f.alpha = 0;
    if (t) {
      if (f.alpha <= 0.001 || resized) {
        // taucht auf: gleich am Ziel, nur ein kleines Stück von unten herein (neue Fenstergröße: genau ans Ziel)
        Object.assign(f, { x: t.x, y: t.y + (resized ? 0 : 10), w: t.w, h: t.h });
      }
      const k = 1 - Math.exp(-dt * 9);
      f.x += (t.x - f.x) * k;
      f.y += (t.y - f.y) * k;
      f.w += (t.w - f.w) * k;
      f.h += (t.h - f.h) * k;
    }
    // ein: 0,4 s, aus (ein HUD-Element liegt darauf): 0,25 s; ohne Zeit, etwa in der Pause, bleibt alles stehen
    f.alpha = clamp(f.alpha + (show ? dt / 0.4 : -dt / 0.25), 0, 1);
    // Rahmen und WebGL-Bild bekommen dieselben (auf 0,1 px gerundeten) Werte
    const st = this.facecamEl.style;
    const css = (k, v) => {
      if (st[k] !== v) st[k] = v;
    };
    css('display', f.alpha > 0 ? 'block' : 'none');
    if (!(f.alpha > 0)) return null;
    const b = this.fcBox || (this.fcBox = { r: FC_RADIUS });
    const r10 = (v) => Math.round(v * 10) / 10;
    b.x = r10(f.x);
    b.y = r10(f.y);
    b.w = r10(f.w);
    b.h = r10(f.h);
    b.alpha = Math.round(f.alpha * 1000) / 1000;
    css('left', b.x + 'px');
    css('top', b.y + 'px');
    css('width', b.w + 'px');
    css('height', b.h + 'px');
    css('opacity', String(b.alpha));
    return b;
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
      const n = el('span', 'name', m, nameBreak(name));
      n.style.color = nameColor(name);
    }
    m.append(' ');
    el('span', 'text', m, text);
    while (this.chatList.childElementCount > 36) this.chatList.firstElementChild.remove();
    this.trimChat();
  }

  /**
   * Neueste Nachricht unten, und nur ganze Nachrichten zeigen: was oben aus dem Chat geschoben wird, verschwindet
   * ganz, statt angeschnitten unter der Kopfzeile zu hängen.
   */
  trimChat() {
    const list = this.chatList;
    list.scrollTop = list.scrollHeight;
    if (!list.clientHeight) return;
    // Die neueste verschwindet nie: Ist sie allein schon höher als das Fenster (Handy quer zeigt zwei Zeilen, die
    // Ansagen von James brauchen oft drei), wird sie auf die Zeilen gekürzt, die hineinpassen – sonst bliebe der
    // Chat leer. Jedes Mal neu gemessen, weil sich das Fenster beim Drehen des Handys ändert.
    const last = list.lastElementChild;
    if (last) {
      last.classList.remove('cut');
      const cs = getComputedStyle(list);
      const room = list.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      if (last.offsetHeight > room + 0.5) {
        last.classList.add('cut');
        last.style.webkitLineClamp = Math.max(1, Math.floor(room / parseFloat(getComputedStyle(last).lineHeight)));
      }
      list.scrollTop = list.scrollHeight;
    }
    const top = list.getBoundingClientRect().top - 0.5;
    for (const m of list.children) m.classList.toggle('gone', m.getBoundingClientRect().top < top);
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
    this.nomiEl.classList.remove('studio');
    this.nomiEl.classList.remove('hidden');
    this.nomiT = Math.max(2.2, dur);
    this.fitStack();
  }

  /** Das Sprachstudio spricht: derselbe Untertitel-Platz wie bei NOMI, aber klar als Sprachstudio erkennbar. */
  studio(text, dur = 3) {
    this.nomiText.textContent = text;
    this.nomiEl.classList.add('studio');
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
    this.layout();
    this.fitStack();
  }

  cameraLabel(text) {
    this.cameraHint.textContent = text;
    this.cameraHint.classList.remove('hidden');
    clearTimeout(this.camTimer);
    this.camTimer = setTimeout(() => this.cameraHint.classList.add('hidden'), 1600);
    this.fitStack();
  }

  // --- pro Bild ------------------------------------------------------------------------
  update(dt, g) {
    // Kamera gewechselt (Cockpit und Drohne halten verschiedene Stellen frei: Spiegel und Bildschirm bzw. das Auto)
    // oder Blitzerfoto gekommen bzw. gegangen: Spalte gleich neu einpassen
    if (this.layoutStale()) {
      this.layout();
      this.fitStack();
    }
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
    this.dmgBadge.update(p.damage);
    this.cruiseBadge.update(p);
    // linke Spur
    const L = g.left;
    this.leftLaneEl.classList.toggle('hidden', !L.open);
    this.hud.classList.toggle('lane-on', L.open);
    if (L.open) {
      const inLane = p.inLeftLane;
      const secs = Math.ceil(L.timer) + ' s';
      const lt = this.leftLaneText;
      lt.textContent = (inLane ? '⬅️ Du fährst links · noch ' : '⬅️ Linke Spur frei · noch ') + secs;
      // der Balken bleibt einzeilig: passt der Satz nicht (schmaler Balken auf dem Handy), steht nur das Wichtigste da
      if (lt.scrollWidth > lt.clientWidth + 1) lt.textContent = (inLane ? '⬅️ Links · ' : '⬅️ Spur frei · ') + secs;
      this.leftLaneEl.classList.toggle('active', inLane);
      this.leftLaneEl.classList.toggle('warn', L.timer < 10);
      this.leftLaneFill.style.width = clamp(L.timer / (L.dur || 60), 0, 1) * 100 + '%';
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
