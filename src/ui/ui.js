// Das Stream-Overlay über dem Spiel: LIVE-Anzeige, Zuschauer, Strecke, Guthaben, Akku, Karosserie-Punkte, Chat mit
// Bots, die Streifen oben (Navi, Hinweise) und unten (Untertitel, BrunnenTV), Rahmen und Blitzerfotos. Wo was wohnt
// und welches Rechteck dabei frei bleibt, steht in sicht.js: Über der Bildmitte liegt nichts, solange gefahren wird.
import { fmtNum, fmtCent, fmtEuro, fmtClock, clamp, tachoKmh } from '../util.js';
import { nameColor, nameBreak, BOTS, SCHOENNBRUN } from '../data.js';
import { DamageBadge, CruiseBadge } from './drive-hud.js';
import { drawTurnIcon } from '../map/symbols.js';
import { fmtOdo, fmtKm } from '../map/navroute.js';
import { NARROW_MID, infoWidth, overlap, cockpitParts, portraitNarrow, droneHud } from './sicht.js';
import { DroneHud } from './drone-hud.js';
import { schoennbrunBadge } from './schoennbrun.js';

/** Zufriedenheit des Chats sichtbar im Chat-Kopf? Nein: Die Chat-Stimmung gehört nicht ins HUD (Besitzer, 17.11.). */

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

const COARSE = typeof matchMedia === 'function' ? matchMedia('(pointer: coarse)') : { matches: false };
// Facecam: Eckradius wie in style.css (.facecam), kleinste sinnvolle Breite, Seitenverhältnis 16 : 9
const FC_RADIUS = 12;
const FC_MIN_W = 168;

// Hinweise im oberen Streifen: einer nach dem anderen. Was der Spieler beachten muss (Art 'bad' und 'warn'), kommt
// vor Tipps und Grüßen und löst einen Tipp ab, sobald der kurz zu lesen war. Wartet etwas, bleibt der gezeigte nur
// noch so lange stehen, wie man zum Lesen braucht (hurry Sekunden; einer, der erst später zu lesen ist, hold Sekunden:
// die Mysterybox springt erst nach dem Wackeln auf). Ein wartender Tipp, der zu alt geworden ist, entfällt (er
// beschriebe etwas, das längst vorbei ist), ebenso der älteste, wenn mehr als vier warten; Dringendes entfällt nie.
const NOTICE = { read: 3.6, hurry: 2.4, yield: 1.2, stale: 8, waiting: 4 };
const urgent = (n) => n.kind === 'bad' || n.kind === 'warn';
const FUNKLOCH = 'Verbindung verloren – alle Handynetze werden neu gebündelt …';
// So lange steht die Navi-Zeile nach einem neuen Ziel oder einer Ankunft hervorgehoben da
const NEWS = 3.6;
// Bis zu dieser Länge ist ein Satz ohne Kopfzeile „kurz“: Neben ihm bleibt die Bauchbinde von BrunnenTV stehen
const SHORT_LINE = 32;

/**
 * Die Navi-Zeile ohne Ziel („Ziel erreicht: … – warte auf das nächste Gebot …“) in ihren zwei Hälften samt dem, was
 * in einer Reihe zwischen ihnen steht: Wo sie nicht in eine Reihe passt, steht die zweite Hälfte darunter, statt
 * abgeschnitten zu werden.
 */
function splitWait(line) {
  const m = /^(.+?)( – |(?<=\?) )(.+)$/.exec(line);
  return m ? [m[1], m[3], m[2] === ' ' ? '\u00a0' : '\u00a0– '] : [line, '', ''];
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
    this.timeEl = el('span', 'streamtime', live, '');
    this.timeText = ''; // was die Uhr der Reise zuletzt gezeigt hat (nur bei einer neuen Minute wird geschrieben)
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

    // --- Streifen oben, zwischen Info-Feld und Chat: was das Navi sagt, darunter ein Hinweis nach dem anderen ---
    const strip = el('div', 'top-strip', this.hud);
    // Ziel und Entfernung in einer Reihe, das Gebot dahinter: wird es eng, rückt das Gebot in eine zweite Reihe, dann
    // kürzt sich der Zielname
    this.naviEl = el('div', 'navi-line', strip);
    const first = el('span', 'navi-first', this.naviEl);
    this.naviTarget = el('span', 'navi-target', first, '');
    this.naviKm = el('span', 'navi-km', first, '');
    this.naviBid = el('span', 'navi-bid', this.naviEl, '');
    const second = el('div', 'top-row', strip);
    // Navi-Ansage für Ansichten ohne Mittelbildschirm (Drohne, schmale Formate): Pfeil, Entfernung, Ausfahrt
    this.turnEl = el('div', 'navi-turn', second);
    this.turnIcon = el('canvas', 'navi-turn-icon', this.turnEl);
    this.turnIcon.width = this.turnIcon.height = 56;
    this.turnDist = el('b', 'navi-turn-dist', this.turnEl, '');
    // die Nummer der Ausfahrt im Kästchen wie auf den Tafeln (leer: keine)
    this.turnNo = el('span', 'exit-no', this.turnEl, '');
    this.turnText = el('span', 'navi-turn-text', this.turnEl, '');
    // die nächste Ausfahrt, auch wenn die Route geradeaus bleibt: ein blaues Schild wie am Straßenrand (ins.next)
    this.turnNext = el('span', 'navi-next', this.turnEl);
    el('i', '', this.turnNext, 'Nächste Ausfahrt');
    this.turnNextNo = el('span', 'exit-no', this.turnNext, '');
    this.turnNextText = el('b', '', this.turnNext, '');
    // (die Entfernung für sich: wird es eng, kürzt sich der Name, die Meter bleiben stehen)
    this.turnNextDist = el('span', 'navi-next-d', this.turnNext, '');
    this.leftLaneEl = el('div', 'leftlane hidden', second);
    this.leftLaneText = el('div', 'leftlane-text', this.leftLaneEl, '');
    const bar = el('div', 'leftlane-bar', this.leftLaneEl);
    this.leftLaneFill = el('div', 'leftlane-fill', bar);
    // Handy hochkant ragt der Mittelbildschirm rechts aus dem Bild und mit ihm die Akku-Karte: Dann steht hier eine
    // kleine Kopie (showAkkuCard, style.css .screen-cut .akku-mini) – Batterie, Stufe, Prozent und der Ladepark
    this.akkuEl = el('div', 'akku-mini', second);
    this.akkuFill = el('i', '', el('span', 'akku-mini-icon', this.akkuEl));
    this.akkuTitle = el('b', 'akku-mini-title', this.akkuEl, '');
    this.akkuPark = el('span', 'akku-mini-park', this.akkuEl, '');
    this.noticeEl = el('div', 'notice', strip);

    // --- rechts: Chat ---
    this.chatEl = el('div', 'chat', this.hud);
    // (die Zuschauerzahl steht nur oben links am 👁: eine Zahl, an einer Stelle – der Eigentümer, 20.11.2026; die
    // Stimmung des Chats zeigt das HUD nie, sie wirkt nur: Geld, Zuschauer, Ton)
    const head = el('div', 'chat-head', this.chatEl);
    el('span', '', head, 'Live-Chat');
    this.chatList = el('div', 'chat-list', this.chatEl);
    // Tacho und Navi-Karte der Drohnenansicht, in der Spalte des Chats (ui/drone-hud.js; main.js schaltet es ein)
    this.droneHud = new DroneHud(this.hud);

    // Funkloch: Der Stream ist weg – das steht dort, wo er fehlt, im Chat-Feld an Stelle der Nachrichten
    this.funklochEl = el('div', 'funkloch hidden', this.chatEl);
    el('span', 'funkloch-icon', this.funklochEl, '📡');
    el('span', 'funkloch-text', this.funklochEl, FUNKLOCH);

    // --- Streifen unten: BrunnenTV als Bauchbinde, daneben der Untertitel – OMI, das Sprachstudio, die
    // Sprachdurchsage und der Megafon-Wunsch sprechen alle hier, einer nach dem anderen, jeder mit seinem Zeichen
    // (OMIs Augen, Kopfhörer, Mikrofon mit Stimme und Spender, Megafon) ---
    const bottom = el('div', 'bottom-strip', this.hud);
    // (die Bauchbinde: das Logo von Herrn Schönnbrun, „BrunnenTV mit Herrn Schönnbrun“, darunter Folge und Ort)
    this.tvEl = el('div', 'brunnentv hidden', bottom);
    this.tvEl.appendChild(schoennbrunBadge(document, 'brunnentv-badge', 46));
    const tv = el('div', 'brunnentv-words', this.tvEl);
    const logo = el('div', 'brunnentv-logo', tv);
    el('span', '', logo, 'BrunnenTV');
    el('span', 'brunnentv-host', logo, SCHOENNBRUN.host);
    const line = el('div', 'brunnentv-line', tv);
    this.tvEpisode = el('span', 'brunnentv-episode', line, '');
    this.tvPlace = el('span', 'brunnentv-place', line, '');
    this.subEl = el('div', 'sub-bar hidden', bottom);
    const eyes = el('span', 'sub-sign nomi-eyes', this.subEl);
    el('i', '', eyes);
    el('i', '', eyes);
    el('span', 'sub-sign studio-icon', this.subEl, '🎧');
    el('span', 'sub-sign durchsage-icon', this.subEl, '🎙️');
    el('span', 'sub-sign megafon-icon', this.subEl, '📢');
    el('span', 'sub-sign adam-icon', this.subEl, '🎤');
    const words = el('span', 'sub-words', this.subEl);
    this.subLabel = el('span', 'sub-label', words, '');
    this.subText = el('span', 'sub-text', words, '');
    this.cameraHint = el('div', 'camera-hint hidden', bottom, '');
    // „So steuerst du“ beim ersten Start (drive-hint.js füllt und leert die Karte)
    this.hintEl = el('div', 'hint-card hidden', this.hud);
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
    // Hinweise: der gezeigte und die wartenden; Untertitel: wer gerade spricht und wen er unterbrochen hat
    this.notice = null;
    this.notices = [];
    this.lines = [];
    this.newsT = 0;
    this.photoT = 0;
    this.rahmenList = [];
    this.photos = [];

    // Der obere Streifen liegt zwischen den Feldern links und rechts. Ist dort kein Platz (Handy hochkant), steht er
    // unter den Feldern, statt sie zu überdecken.
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        this.layout();
        this.trimChat();
      });
      ro.observe(info);
      ro.observe(this.chatEl);
    }
    window.addEventListener('resize', () => this.layout());
  }

  /**
   * Der Streifen oben nach der echten Größe von Info-Feld und Chat (--left, --mid, --top): zwischen den beiden
   * Feldern, und wo dort kein Platz ist, unter ihnen. Links zählt die Höchstbreite des Info-Felds, damit der Streifen
   * nicht wandert, wenn dort eine Zahl länger wird.
   */
  layout() {
    const a = this.infoEl.getBoundingClientRect();
    const chat = this.chatOn && this.chatEl.getBoundingClientRect();
    const hasChat = !!(chat && chat.width);
    // wo der Chat gerade steht (null, wenn er nicht zu sehen ist) – dahinter bleibt die REC-Lampe im Cockpit aus
    this.chatRect = hasChat ? chat : null;
    if (!a.width) return; // HUD gerade unsichtbar
    const W = window.innerWidth;
    let left = Math.max(a.right, 14 + infoWidth(W, window.innerHeight)) + 14;
    let mid = (hasChat ? chat.left - 14 : W - left) - left;
    let top = 14;
    // (hochkant bis PORTRAIT_W immer: Tablets hätten sonst eine schmale Säule zwischen den Feldern)
    const narrow = mid < NARROW_MID || portraitNarrow(W, window.innerHeight);
    if (narrow) {
      left = 14;
      mid = W - 28;
      // unter beiden Feldern; beim Chat zählt seine Höchsthöhe, damit der Streifen nicht mit jeder Nachricht springt
      top = Math.max(a.bottom, hasChat ? chat.top + (parseFloat(getComputedStyle(this.chatEl).maxHeight) || chat.height) : 0) + 10;
    }
    const st = this.hud.style;
    st.setProperty('--left', Math.round(left) + 'px');
    st.setProperty('--mid', Math.round(mid) + 'px');
    st.setProperty('--top', Math.round(top) + 'px');
    this.hud.classList.toggle('hud-narrow', narrow);
    this.droneHud.place(droneHud(W, window.innerHeight, { touch: COARSE.matches, narrow }), window.devicePixelRatio || 1);
    // ragt der Mittelbildschirm rechts aus dem Bild? (sicht.js cockpitParts; Handy hochkant) – dann die Akku-Kopie
    this.hud.classList.toggle('screen-cut', cockpitParts(W, window.innerHeight).screen.right > W);
    this.naviMax = Math.min(760, mid);
  }

  /**
   * Die Akku-Karte des Mittelbildschirms (Game.lowBatteryCard, screen.js drawLowBattery) als kleine Kopie in der
   * zweiten Reihe oben – zu sehen nur, wo der Mittelbildschirm aus dem Bild ragt (style.css .screen-cut). b: null = keine.
   */
  showAkkuCard(b) {
    this.akkuEl.classList.toggle('on', !!b);
    if (!b) return;
    this.akkuEl.classList.toggle('crit', b.lvl > 1);
    this.akkuEl.style.opacity = b.alpha.toFixed(2);
    const pct = clamp(b.pct, 0, 100);
    this.akkuFill.style.width = (b.lvl < 3 ? Math.max(8, pct) : 0) + '%';
    const title = ['', 'Akku fast leer', 'Akku kritisch', 'Akku leer'][b.lvl] + ' · ' + Math.round(pct) + ' %';
    const park = b.lvl === 3 ? 'Der Wagen rollt aus' : b.park ? b.park + ' · ' + fmtKm(b.km) : 'Nächste Ladesäule ansteuern';
    if (this.akkuTitle.textContent !== title) this.akkuTitle.textContent = title;
    if (this.akkuPark.textContent !== park) this.akkuPark.textContent = park;
  }

  /** Navi-Ansage der Fahrt (NavModel.instruction()) oder null; sichtbar nur ohne Mittelbildschirm (style.css). */
  setTurn(ins) {
    const on = !!ins && ins.turn !== 'none';
    this.turnEl.classList.toggle('on', on);
    if (!on) return;
    if (this.turnKind !== ins.turn) {
      this.turnKind = ins.turn;
      const c = this.turnIcon.getContext('2d');
      c.clearRect(0, 0, 56, 56);
      c.fillStyle = '#2f6fe4';
      c.beginPath();
      c.arc(28, 28, 28, 0, Math.PI * 2);
      c.fill();
      drawTurnIcon(c, ins.turn, 28, 28, 40, '#ffffff');
    }
    // die Entfernung in den Worten des Mittelbildschirms (ins.say); weit vor einer Ausfahrt (ins.calm) steht sie ruhig
    // hinter dem Namen – die Zahl vorn gehört den Metern, die ab dem ersten Vorwegweiser herunterzählen
    const dist = ins.dist > 0 && ins.turn !== 'straight' && ins.turn !== 'merge' && !ins.calm ? ins.say : '';
    const text = ins.calm && ins.say ? ins.head + ' · in ' + ins.say : ins.head;
    const no = ins.turn === 'exit' && ins.no ? String(ins.no) : '';
    if (this.turnDist.textContent !== dist) this.turnDist.textContent = dist;
    if (this.turnNo.textContent !== no) this.turnNo.textContent = no;
    if (this.turnText.textContent !== text) this.turnText.textContent = text;
    // die nächste Ausfahrt – nicht, solange die Ansage selbst sie nennt
    const nx = ins.next && ins.next.fork !== ins.fork ? ins.next : null;
    const next = nx ? nx.name : '';
    const nextDist = nx ? '· ' + nx.say : '';
    this.turnNext.classList.toggle('on', !!nx);
    this.turnNext.firstChild.textContent = nx && nx.kind === 'kreuz' ? 'Nächstes Kreuz' : 'Nächste Ausfahrt';
    const nextNo = nx && nx.no ? String(nx.no) : '';
    if (this.turnNextNo.textContent !== nextNo) this.turnNextNo.textContent = nextNo;
    if (this.turnNextText.textContent !== next) this.turnNextText.textContent = next;
    if (this.turnNextDist.textContent !== nextDist) this.turnNextDist.textContent = nextDist;
  }

  /** v: HUD an oder aus; subs (bei v = false): von allem nur der Untertitel-Streifen (Startszene der Reise). */
  show(v, subs = false) {
    this.hud.classList.toggle('hidden', !v && !subs);
    this.hud.classList.toggle('subs', !v && subs);
    // gleich mit den echten Maßen der Felder (der ResizeObserver meldet sich erst nach dem nächsten Bild)
    if (v) this.layout();
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
    // was darauf liegen könnte: der Hinweis des ersten Starts (er steht an ihrem Platz), der Streifen unten, das
    // Blitzerfoto, ein Rahmen-Hinweis
    let blocked = false;
    const parts = [this.hintEl, this.photoEl, ...this.subEl.parentNode.children, ...this.rahmenEl.querySelectorAll('.rahmen-caption')];
    for (const e of parts) {
      if (e.classList.contains('hidden')) continue;
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
    const on = want && this.facecamOn && !this.hud.classList.contains('hidden') && !this.hud.classList.contains('subs') && this.hud.style.display !== 'none';
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
    this.noticeEl.textContent = '';
    this.rahmenEl.textContent = '';
    this.clearMoneyPop();
    this.notice = null;
    this.notices = [];
    this.lines = [];
    this.rahmenList = [];
    this.photos = [];
    this.jobsDone = null;
    this.subEl.classList.add('hidden');
    this.brunnenTV(0);
    this.photoEl.classList.add('hidden');
    this.hintEl.classList.add('hidden');
    // Funkloch-Anzeige samt „● LIVE“-Schild zurück (eine Fahrt kann mitten im Funkloch enden)
    this.funkloch(false);
    this.newsT = this.photoT = 0;
  }

  // --- Chat -------------------------------------------------------------------
  chat({ name, text, bot, icon, badge }) {
    const m = el('div', 'msg' + (bot ? ' bot bot-' + bot : ''), this.chatList);
    // Leerzeichen zwischen den Teilen, sonst bricht ein schmaler Chat mitten im Namen um
    if (bot) {
      el('span', 'bot-icon', m, icon || BOTS[bot]?.icon || '🤖');
      const n = el('span', 'name', m, name);
      n.style.color = '#ffd76a';
      m.append(' ');
      el('span', 'bot-tag', m, 'BOT');
    } else {
      // Abzeichen vor dem Namen (die Mods der Reise: MOD)
      if (badge) {
        el('span', 'mod-tag', m, badge);
        m.append(' ');
      }
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

  // --- Hinweise (Streifen oben) --------------------------------------------------------
  /**
   * Ein Hinweis: eine kleine Reihe unter der Navi-Zeile, einer nach dem anderen (Reihenfolge und Dauer: NOTICE).
   * kind: info | good | warn | bad · key: Ein neuer Hinweis mit demselben Schlüssel ersetzt den alten sofort, auch den
   * gerade gezeigten – für Meldungen, die ein Zustand sind und keine Schlange (etwa was das Navi zum Ziel sagt).
   * Rückgabe: { drop() } nimmt ihn vorzeitig weg, ob er wartet oder steht; t ist, wie lange er steht, hold, wie lange
   * ihn nur Dringendes ablöst (beides lässt sich setzen), gone, ob er schon weg ist.
   */
  toast(text, kind = 'info', key = '', parts = null) {
    const n = { text, kind, key, parts, t: NOTICE.read, hold: 0, age: 0, wait: 0, gone: false, drop: () => this.dropNotice(n) };
    if (key) this.dropKey(key);
    // Dringendes vor allem, was nicht dringend ist; sonst der Reihe nach
    let i = this.notices.length;
    if (urgent(n)) while (i > 0 && !urgent(this.notices[i - 1])) i--;
    this.notices.splice(i, 0, n);
    // zu viele wartende Tipps: der älteste entfällt
    const tips = this.notices.filter((x) => !urgent(x));
    if (tips.length > NOTICE.waiting) this.dropNotice(tips[0]);
    if (!this.notice) this.nextNotice();
    return n;
  }

  /** Nimmt einen Hinweis weg, ob er noch wartet oder schon steht. */
  dropNotice(n) {
    n.gone = true;
    const i = this.notices.indexOf(n);
    if (i >= 0) this.notices.splice(i, 1);
    if (this.notice === n) this.nextNotice();
  }

  /** Steht oben gerade ein Hinweis, oder wartet einer? (Die Mysterybox kommt erst, wenn dort nichts steht.) */
  noticeBusy() {
    return !!this.notice || this.notices.length > 0;
  }

  /** Nimmt alle Hinweise mit diesem Schlüssel weg. */
  dropKey(key) {
    for (const n of this.notices.filter((x) => x.key === key)) this.dropNotice(n);
    if (this.notice && this.notice.key === key) this.dropNotice(this.notice);
  }

  nextNotice() {
    const n = (this.notice = this.notices.shift() || null);
    this.noticeEl.textContent = '';
    if (!n) return;
    if (!n.parts) {
      el('div', 'toast toast-' + n.kind, this.noticeEl, n.text);
      return;
    }
    // in Teilen: [Text, Klasse] – etwa Einnahmen grün und Reparatur rot (Zeile der Runde, game.js payBill). Teile mit
    // Klasse bleiben beisammen (nowrap), die ohne sind Text zwischen ihnen: Nur dort darf die Zeile umbrechen.
    const box = el('div', 'toast toast-' + n.kind, this.noticeEl);
    for (const [text, cls] of n.parts) {
      if (cls) el('span', cls, box, text);
      else box.append(text);
    }
  }

  tickNotices(dt) {
    for (const n of this.notices) n.wait += dt;
    // ein wartender Tipp, der zu alt geworden ist, entfällt (meist wartet keiner: dann keine neue Liste je Bild)
    if (this.notices.length) this.notices = this.notices.filter((n) => urgent(n) || n.wait < NOTICE.stale || ((n.gone = true), false));
    const n = this.notice;
    if (!n) return;
    n.age += dt;
    const next = this.notices[0];
    const limit = next ? (urgent(next) && !urgent(n) ? NOTICE.yield : Math.min(n.t, Math.max(NOTICE.hurry, n.hold))) : n.t;
    if (n.age >= limit) {
      n.gone = true;
      this.nextNotice();
    }
  }

  /**
   * Das Navi hat ein neues Ziel, oder der Wagen ist angekommen: Die Navi-Zeile sagt es selbst und steht dafür kurz
   * hervorgehoben da. Sie zeigt immer das Ziel, das gerade gilt – ein neueres ersetzt das alte also sofort, und was
   * das Navi zum alten Ziel noch zu sagen hatte (Schlüssel 'navi'), verschwindet mit ihm.
   */
  naviNews() {
    this.newsT = NEWS;
    this.dropKey('navi');
    this.lastHud = 0;
  }

  // --- Untertitel (Streifen unten) ----------------------------------------------------
  /**
   * Jemand spricht: who = nomi | studio | durchsage | megafon, label = Zeile über dem Satz. Der Neueste hat das
   * Wort; wen er unterbrochen hat, der steht danach wieder da, solange seine Zeit noch läuft – so geht kein Satz
   * verloren.
   */
  /** Ein Untertitel für dur Sekunden; gibt die Zeile zurück (t = 0 nimmt sie wieder weg). */
  speak(who, text, dur, label = '') {
    const l = { who, text, label, t: dur };
    this.lines.push(l);
    this.showLine();
    return l;
  }

  showLine() {
    // der jüngste Satz – außer einer mit top (der Ruf einer Folge BrunnenTV) lebt noch: der bleibt oben
    let l = this.lines[this.lines.length - 1];
    for (let i = this.lines.length - 1; i >= 0; i--) {
      if (this.lines[i].top) {
        l = this.lines[i];
        break;
      }
    }
    this.subEl.classList.toggle('hidden', !l);
    if (!l || l === this.line) return;
    this.line = l;
    this.subEl.className = 'sub-bar sub-' + l.who + (!l.label && l.text.length <= SHORT_LINE ? ' short' : '');
    this.subLabel.textContent = l.label;
    this.subText.textContent = l.text;
  }

  nomi(text, dur = 3) {
    return this.speak('nomi', text, Math.max(2.2, dur));
  }

  /** Mini Adam sagt selbst etwas, ohne Megafon (der Gruß zu Beginn jedes Streams): Mikrofon und sein Name. */
  adam(text, dur = 3) {
    return this.speak('adam', '»' + text + '«', Math.max(2.2, dur), 'Mini Adam');
  }

  /** Das Sprachstudio spricht: derselbe Untertitel-Platz wie bei OMI, aber klar als Sprachstudio erkennbar. */
  studio(text, dur = 3) {
    return this.speak('studio', text, Math.max(2.2, dur), 'Sprachstudio');
  }

  money(amount, label) {
    // eine Gutschrift auf einmal an Stelle von „Guthaben“; die nächste löst die vorige ab
    this.moneyPops.textContent = '';
    const p = el('span', 'money-pop ' + (amount >= 0 ? 'plus' : 'minus'), this.moneyPops, (amount >= 0 ? '+' : '−') + fmtCent(Math.abs(amount)));
    if (label) el('small', '', p, label);
    this.popAmount = amount;
    this.fitMoneyPop();
    this.moneySlot.classList.add('popping');
    clearTimeout(this.moneyTimer);
    this.moneyTimer = setTimeout(() => this.clearMoneyPop(), 1900);
  }

  /**
   * Die stehende Gutschrift bleibt im Feld neben dem Guthaben: Passt sie nicht, fällt erst der Grund weg, dann bei
   * einem runden Betrag die Cent („+1.000 €“ – auf der Reise ist das Guthaben schnell fünfstellig und ein Gebot bis
   * 3.000 € hoch), zuletzt wird sie kleiner. Geprüft auch, wenn das Guthaben danach eine Stelle länger wird.
   */
  fitMoneyPop() {
    const p = this.moneyPops.firstChild;
    const fits = () => p.offsetWidth <= this.moneySlot.clientWidth;
    if (!p || fits()) return;
    const label = p.querySelector('small');
    if (label) {
      label.remove();
      if (fits()) return;
    }
    const v = Math.abs(this.popAmount);
    if (Number.isInteger(v)) {
      p.firstChild.nodeValue = (this.popAmount >= 0 ? '+' : '−') + fmtEuro(v);
      if (fits()) return;
    }
    p.classList.add('tight');
  }

  clearMoneyPop() {
    clearTimeout(this.moneyTimer);
    this.moneyPops.textContent = '';
    this.moneySlot.classList.remove('popping');
  }

  /** Eine gekaufte Sprachdurchsage: Mikrofon, Stimme und Spender über dem vorgelesenen Satz. */
  durchsage(voiceLabel, text, dur, buyer) {
    return this.speak('durchsage', '»' + text + '«', clamp(dur, 3, 14), `${voiceLabel} · Sprachdurchsage von ${buyer}`);
  }

  /**
   * Durchsage durchs Megafon: ein Wunsch, den der Wagen gerade ausruft (buyer), oder mit label Mini Adam selbst
   * (BrunnenTV) – auch das ist gesprochen und steht deshalb hier.
   */
  megafon(text, dur, buyer, label = 'Megafon-Wunsch von ' + buyer) {
    return this.speak('megafon', '»' + text + '«', clamp(dur, 3, 14), label);
  }

  /**
   * BrunnenTV am Navi-Ziel: die Bauchbinde der Folge n aus dem Ort name, unten im Bild wie im Fernsehen –
   * der Brunnen in der Bildmitte bleibt zu sehen. Solange die Folge läuft, trägt der Streifen .tv: Die Bauchbinde
   * steht dann über dem Untertitel, statt zu warten, bis keiner mehr spricht (in der Folge spricht fast immer jemand).
   * n = 0 blendet sie aus.
   */
  brunnenTV(n, name = '') {
    this.tvEl.classList.toggle('hidden', !n);
    this.tvEl.parentElement.classList.toggle('tv', !!n);
    if (!n) return;
    this.tvEpisode.textContent = 'Folge ' + fmtNum(n);
    this.tvPlace.textContent = 'Heute aus ' + name;
    this.tvEl.classList.remove('pop');
    void this.tvEl.offsetWidth;
    this.tvEl.classList.add('pop');
  }

  /** Funkloch: Der Stream ist weg. Das steht im Chat-Feld, wo er fehlt – ist der Chat abgeschaltet, als Hinweis. */
  funkloch(on) {
    this.funklochEl.classList.toggle('hidden', !on);
    this.chatEl.classList.toggle('funk', on);
    this.liveBadge.classList.toggle('offline', on);
    this.liveBadge.textContent = on ? '● OFFLINE' : '● LIVE';
    if (on && !this.chatOn) this.toast('📡 ' + FUNKLOCH, 'info', 'funk');
    else this.dropKey('funk');
  }

  damage() {
    this.damageEl.parentNode.classList.remove('shake');
    void this.damageEl.offsetWidth;
    this.damageEl.parentNode.classList.add('shake');
  }

  jobs(list) {
    this.jobsEl.textContent = '';
    const all = list.length > 0 && list.every((j) => j.done);
    el('span', 'jobs-title' + (all ? ' all' : ''), this.jobsEl, all ? '🏆 Alle 5 Jobs erledigt!' : 'You had 5 Jobs');
    for (const j of list) {
      const fresh = j.done && this.jobFresh && this.jobFresh.text === j.text;
      const r = el('div', 'job' + (j.done ? ' done' : '') + (fresh ? ' fresh' : ''), this.jobsEl);
      el('span', 'job-box', r, j.done ? '✔' : '');
      el('span', 'job-text', r, j.text);
      if (!j.done && j.progress > 0) {
        const b = el('span', 'job-bar', r);
        el('span', 'job-fill', b).style.width = Math.round(j.progress * 100) + '%';
      }
    }
  }

  /**
   * Ein Job ist erledigt (ohne text: alle fünf). Das steht in der Jobliste: Die Zeile leuchtet kurz, sind alle
   * erledigt, sagt es ihre Überschrift. Wo die Liste nicht zu sehen ist (Handy), kommt stattdessen ein Hinweis.
   */
  jobDone(text) {
    if (text) this.jobFresh = { text, t: 4 };
    if (!this.jobsEl.offsetParent) this.toast(text ? `✅ Job erledigt: ${text}` : '🏆 Alle 5 Jobs erledigt!', 'good');
  }

  /** Rahmen-Einblendung (wie im Live-Bereich gekauft). */
  rahmen(r, buyer) {
    // einer zur Zeit: Ein neuer Rahmen löst einen ab, der noch im Bild ist (zwei Abdeckungen gibt es nie zugleich)
    for (const old of this.rahmenList) old.el.remove();
    this.rahmenList.length = 0;
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
  }

  /** Blitzerfoto als Polaroid einblenden. */
  photo(dataUrl, kmh, clock) {
    this.photoEl.textContent = '';
    if (dataUrl) {
      const img = el('img', '', this.photoEl);
      img.src = dataUrl;
      img.alt = 'Blitzerfoto';
      // der Abspann zeigt die letzten drei; ältere Fotos (je 30–40 KB) nicht den ganzen Stream lang aufheben
      this.photos.push({ url: dataUrl, kmh, clock });
      if (this.photos.length > 3) this.photos.shift();
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
  /** Tempo im HUD (ganze km/h, siehe tachoKmh); nur bei einer neuen Zahl in den DOM. */
  showKmh(kmh) {
    if (kmh === this.kmhShown) return;
    this.kmhShown = kmh;
    this.speedEl.textContent = kmh + ' km/h';
  }

  /** g: das laufende Spiel (sonst null); tacho: die Zahl, die der Mittelbildschirm gerade zeigt (null: er zeichnet nicht). */
  update(dt, g, tacho = null) {
    // Zeitgesteuerte Elemente
    this.tickNotices(dt);
    if (this.lines.length) {
      for (const l of this.lines) l.t -= dt;
      this.lines = this.lines.filter((l) => l.t > 0);
      this.showLine();
    }
    if (this.newsT > 0) this.newsT -= dt;
    if (this.jobFresh && (this.jobFresh.t -= dt) <= 0) {
      this.jobFresh = null;
      this.jobsEl.querySelector('.job.fresh')?.classList.remove('fresh');
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
    if (this.rahmenList.length) this.rahmenList = this.rahmenList.filter((r) => r.t > 0);

    // Die Uhr der Reise neben LIVE: dieselbe wie auf dem Mittelbildschirm (Game.clock) – an ihr hängen die Ankunftszeit und „Sendezeit … (bis … Uhr)“ am Ende. Sie springt in jedem Bild
    // mit um, nicht erst mit den übrigen Zahlen: Auf geraffter Straße läuft sie schnell, und zwei Uhren, die eine
    // Zehntelsekunde lang verschiedene Minuten zeigen, fallen auf.
    if (g) {
      const uhr = fmtClock(g.clock) + '\u202fUhr';
      if (uhr !== this.timeText) this.timeEl.textContent = this.timeText = uhr;
    }
    // Tempo: Zeichnet der Mittelbildschirm (tacho = seine Zahl), wechselt es im selben Bild wie dort
    if (g && tacho !== null) this.showKmh(tacho);
    // Zahlen nur 10× pro Sekunde
    this.lastHud -= dt;
    if (this.lastHud > 0 || !g) return;
    this.lastHud = 0.1;
    const p = g.player;
    this.viewersEl.textContent = '👁 ' + fmtNum(Math.round(g.viewers));
    // nach dem Ruf einer Folge BrunnenTV leuchtet die Zahl, solange sie steigt (Game.viewersUpT)
    this.viewersEl.classList.toggle('up', g.viewersUpT > g.t);
    // der Kilometerzähler der Fahrt in Reisekilometern, mit dem Rekord (Game.odometer)
    const odo = g.odometer;
    const strecke = (m) => fmtOdo(m / 1000);
    this.distEl.textContent = strecke(odo);
    const best = g.save.best.reise || 0;
    this.recordEl.textContent = odo > best && best > 0 ? '🏆 neuer Rekord!' : best > 0 ? 'Rekord ' + strecke(best) : '';
    this.recordEl.classList.toggle('record', odo > best && best > 0);
    if (tacho === null) this.showKmh(tachoKmh(p.kmh));
    // (die Schäden können die Stream-Kasse ins Minus bringen)
    const money = (g.money < 0 ? '−' : '') + fmtCent(Math.abs(g.money));
    if (money !== this.moneyRow.textContent) {
      this.moneyRow.textContent = money;
      // ein längeres Guthaben lässt einer stehenden Gutschrift weniger Platz
      if (this.moneyPops.firstChild) this.fitMoneyPop();
    }
    this.batteryEl.textContent = Math.round(p.battery) + ' %';
    this.batteryFill.style.width = clamp(p.battery, 0, 100) + '%';
    this.batteryFill.className = 'battery-fill' + (p.battery < 15 ? ' low' : p.battery < 30 ? ' mid' : '');
    if (g.lowBatteryCard) this.showAkkuCard(g.lowBatteryCard());
    this.dmgBadge.update(p.damage);
    this.cruiseBadge.update(p);
    // linke Spur: Der Balken erscheint mit der Freischaltung und zählt herunter; in den letzten zehn Sekunden warnt er
    const L = g.left;
    this.leftLaneEl.classList.toggle('hidden', !L.open);
    if (L.open) {
      const inLane = p.inLeftLane;
      const warn = L.timer < 10;
      const secs = Math.ceil(L.timer) + ' s';
      const lt = this.leftLaneText;
      const sign = warn ? '⏳ ' : '⬅️ ';
      const brief = sign + (inLane ? 'Links · ' : 'Spur frei · ') + secs;
      // der Balken bleibt einzeilig: Teilt er die Reihe mit der Navi-Ansage oder passt der Satz nicht hinein (schmaler
      // Balken auf dem Handy), steht nur das Wichtigste da
      const shared = this.turnEl.offsetWidth > 0;
      this.leftLaneEl.classList.toggle('chip', shared);
      lt.textContent = shared ? brief : sign + (inLane ? 'Du fährst links · noch ' : 'Linke Spur frei · noch ') + secs;
      if (!shared && lt.scrollWidth > lt.clientWidth + 1) lt.textContent = brief;
      this.leftLaneEl.classList.toggle('active', inLane);
      this.leftLaneEl.classList.toggle('warn', warn);
      this.leftLaneFill.style.width = clamp(L.timer / (L.dur || 60), 0, 1) * 100 + '%';
    }
    // Navi-Zeile: Ziel, Entfernung, Gebot und Bieter. Das Ziel ist ein echter Ort, die Entfernung steht da wie auf dem
    // Kärtchen im Auto (nv.distance), und zwischen Ankunft und erstem Gebot sagt die Zeile das.
    // Ein neues Ziel und die Ankunft sagt sie selbst an (naviNews) – so hängt die Nachricht nie hinter dem Navi her.
    const nv = g.navi;
    const news = this.newsT > 0;
    const pin = news ? '📍 Neues Ziel: ' : '📍 ';
    let target;
    let short = '';
    let km = '';
    let bid = '';
    let join = '\u00a0· ';
    const t = nv.shown;
    if (t) {
      target = pin + (t.goal ?? t.name);
      // (geboten wird in Zehnern: ganze Euro, „Gebot 1.250 € von …“)
      bid = `Gebot ${fmtEuro(nv.bid)} von ${nv.bidder}`;
      // (das Ziel ist ein Brunnen, „Marktbrunnen, Würzburg“; wo das nicht passt, steht nur der Ort da – mit seinem
      // ganzen Namen: „Frankfurt“ ist nicht „Frankfurt (Oder)“)
      [km, short] = [nv.distance, pin + t.name];
    } else {
      [target, bid, join] = splitWait(nv.waitLine);
      if (nv.reached) short = '📍 Ziel erreicht: ' + nv.reached.name;
    }
    this.naviEl.classList.toggle('news', news);
    const line = target + '|' + km + '|' + bid + '|' + this.naviMax;
    if (line !== this.naviShown) {
      this.naviShown = line;
      this.naviEl.classList.remove('wrap');
      this.naviTarget.textContent = target;
      this.naviKm.textContent = km && '\u00a0· ' + km;
      this.naviBid.textContent = bid && join + bid;
      // passt die ganze Zeile nicht zwischen Info-Feld und Chat, rückt ihre zweite Hälfte (das Gebot) in eine zweite
      // Reihe; reicht die erste dann immer noch nicht für den Zielnamen, steht sein kurzer da (wie auf den
      // Schilderbrücken) – erst danach wird gekürzt (…), und die Entfernung bleibt immer stehen
      const max = (this.naviMax || 760) - 30;
      const first = () => this.naviTarget.scrollWidth + this.naviKm.scrollWidth;
      if (bid && first() + this.naviBid.scrollWidth > max) {
        this.naviEl.classList.add('wrap');
        this.naviBid.textContent = bid;
        if (short && first() > max) this.naviTarget.textContent = short;
      }
    }
  }
}
