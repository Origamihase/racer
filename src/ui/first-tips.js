// Die ersten Minuten: Wer zum ersten Mal losfährt, bekommt nacheinander kurze Tipps am Rand – auf der Karte, auf der
// beim ersten Start „So steuerst du“ stand (drive-hint.js: unten links an Stelle der Facecam, auf Touch-Geräten auf
// dem Chat-Feld; nie in der freien Sicht, siehe sicht.js HOMES.steuerung). Jeder Tipp kommt, wenn er gebraucht wird:
// die Ausfahrt am 1000-m-Schild der ersten Ausfahrt, die das Navi nehmen will, das Megafon, sobald vor dem Wagen
// jemand langsamer fährt (spätestens nach zwei Minuten), der Ladestopp, sobald er sich einplanen lässt (Akku höchstens
// halb voll oder OMI warnt), die Kamera nach den ersten Sekunden. Jeder Tipp erscheint einmal je Spieler
// (localStorage); Enter (am Gamepad Back) oder ✕ schaltet alle ab. Diese Datei kennt kein DOM: main.js füttert
// FirstTips, die Karte zeichnet drive-hint.js showTip, tools/tipps-test.mjs prüft den Ablauf.

import { deviceKey } from './controls.js';

const KEY = 'mini-adam-erste-minuten';
/** Kein Tipp mehr (Enter, Back oder ✕) – so steht es im Speicher. */
const OFF = 'aus';

/**
 * Die Tipps in ihrer Rangfolge (sind zwei fällig, kommt der vordere): title, rows je Gerät als [[Tasten …], Text],
 * show: so viele Sekunden steht er, action: diese Eingabe befolgt ihn (dann blendet er bald aus). Die Tasten kommen
 * aus der Belegung (controls.js deviceKey) – am Gamepad steht also der Knopf, den es wirklich gibt.
 */
export const TIPS = {
  ausfahrt: {
    title: '↘️ Ausfahrt voraus',
    show: 10,
    rows: () => [
      [[], 'Ab dem 1000-m-Schild rechts halten und den Streifen nehmen, der abgeht.'],
      [[], 'Das Navi zeigt die Spur: Die hellen Pfeile in der Ansage führen hinaus.'],
    ],
  },
  kamera: {
    title: '🎥 Kamera',
    show: 8,
    action: 'camera',
    rows: (device) => [[[deviceKey('camera', device)], 'Cockpit oder Drohne']],
  },
  megafon: {
    title: '📢 Megafon',
    show: 8,
    action: 'megafon',
    rows: (device) => [[[deviceKey('megafon', device)], 'Eine Durchsage, und wer vor dir fährt, macht Platz.']],
  },
  ladestopp: {
    title: '🔌 Ladestopp',
    show: 9,
    action: 'ladestopp',
    rows: (device) => [[device === 'touch' ? [] : [deviceKey('ladestopp', device)], device === 'touch'
      ? 'Der Knopf „Ladestopp einplanen“ führt zur nächsten Ladesäule auf dem Weg, danach weiter zum Ziel.'
      : 'Ladestopp einplanen: Das Navi führt zur nächsten Ladesäule auf dem Weg, danach weiter zum Ziel.']],
  },
};
export const ORDER = Object.keys(TIPS);
/** Ab so vielen Sekunden Fahrt kommt die Kamera; das Megafon mit Anlass ab MEGAFON[0], ohne ab MEGAFON[1]. */
export const KAMERA_AFTER = 20;
export const MEGAFON = [30, 120];
/** Pause zwischen zwei Tipps (Sekunden freier Fahrt). */
export const GAP = 5;

/**
 * Ist der Tipp jetzt dran? ctx: t (Sekunden freier Fahrt seit dem Losfahren), exit (die Ansage nennt ab dem
 * 1000-m-Schild eine Ausfahrt, die noch mindestens 250 m entfernt ist), carAhead (auf der eigenen Spur fährt
 * jemand langsamer voraus), stop (ein Ladestopp lässt sich einplanen).
 */
function due(id, ctx) {
  if (id === 'ausfahrt') return !!ctx.exit;
  if (id === 'kamera') return ctx.t >= KAMERA_AFTER;
  if (id === 'megafon') return (!!ctx.carAhead && ctx.t >= MEGAFON[0]) || ctx.t >= MEGAFON[1];
  return !!ctx.stop;
}

export class FirstTips {
  /** @param {string} stored was im Speicher steht: die schon gezeigten Tipps (mit Komma getrennt) oder OFF */
  constructor(stored = '') {
    this.off = stored === OFF;
    this.seen = new Set(this.off || !stored ? [] : stored.split(',').filter((k) => k in TIPS));
    this.cur = null; // der Tipp, der gerade steht
    this.left = 0; // so lange steht er noch
    this.gap = GAP; // so lange wartet der nächste noch
  }

  /** Alle gezeigt oder abgeschaltet: Es kommt keiner mehr. */
  get done() {
    return this.off || ORDER.every((k) => this.seen.has(k));
  }

  /** Was in den Speicher gehört. */
  get stored() {
    return this.off ? OFF : [...this.seen].join(',');
  }

  /**
   * Jedes Bild der Fahrt (ctx wie bei due, dazu free: freie Fahrt – kein Halt, keine Szene, kein anderer Hinweis an
   * diesem Platz). Ergebnis: {show: id}, wenn ein Tipp beginnt, {hide: true}, wenn er endet, sonst null.
   */
  update(dt, ctx) {
    if (this.cur) {
      this.left -= dt;
      if (this.left > 0 && ctx.free && !this.off) return null;
      this.cur = null;
      this.gap = GAP;
      return { hide: true };
    }
    if (this.done || !ctx.free || (this.gap -= dt) > 0) return null;
    const id = ORDER.find((k) => !this.seen.has(k) && due(k, ctx));
    if (!id) return null;
    this.cur = id;
    this.left = TIPS[id].show;
    this.seen.add(id);
    return { show: id };
  }

  /** Ein neuer Stream: Es steht kein Tipp, der nächste wartet GAP Sekunden freier Fahrt. */
  restart() {
    this.cur = null;
    this.left = 0;
    this.gap = GAP;
  }

  /** Der Spieler hat getan, wozu der Tipp rät (Kamera, Megafon, Ladestopp): Er blendet bald aus. */
  did(action) {
    if (this.cur && TIPS[this.cur].action === action) this.left = Math.min(this.left, 1.2);
  }

  /** Enter, Back oder ✕: kein Tipp mehr, auch nicht im nächsten Stream (der stehende verschwindet beim nächsten update). */
  stop() {
    this.off = true;
  }
}

/** Was im Speicher steht ('' ohne Speicher oder beim ersten Mal). */
export function loadTips() {
  try {
    return localStorage.getItem(KEY) || '';
  } catch (e) {
    return '';
  }
}

/** Den Stand speichern (ohne Speicher – privates Fenster – gelten die Tipps nur für diese Sitzung). */
export function storeTips(tips) {
  try {
    localStorage.setItem(KEY, tips.stored);
  } catch (e) {
    /* egal */
  }
}
