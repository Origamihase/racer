// Sprachdurchsagen der Zuschauer (Besitzer, 25.11.2026: „Es sollte mehr Sprachdurchsagen und mehr Abwechslung dabei
// geben“): je Stream ein gemischter Stapel aus allen Durchsagen (data.js DURCHSAGEN, bei Regen auch DURCHSAGEN_REGEN) –
// keine kommt doppelt, bevor nicht jede, die gerade passt, einmal dran war. Was zum Moment passt (eben geblitzt, ein
// Rempler, eine Folge BrunnenTV vorbei, frisch geladen, eine große Spende, die linke Spur frei), kommt zuerst; andere
// Durchsagen zur Lage (Autobahn, Ort, Landstraße, Regen, später Abend, Akku, Laune, Ziel) gern vor den allgemeinen.
// Eigener Zufall je Stream (mulberry32, wie die Gags): Abstände, Stapel, Käufer und Platzhalter ziehen nie aus
// Math.random. Gesprochen wird nur in einer ruhigen Lücke (game/parts/ereignisse.js updateDurchsagen).
import { DURCHSAGEN, DURCHSAGEN_REGEN, CHAT_CITIES, viewerNameAt } from '../data.js';
import { mulberry32 } from '../util.js';
import { places } from '../map/graph.js';

/**
 * Takt der Durchsagen (Sekunden): gap Abstand von Kauf zu Kauf auf der Ereignis-Uhr (die erste würfelt Game.start wie
 * bisher), eager: so viel schneller oder langsamer läuft diese Uhr höchstens mit der Laune des Publikums (economy.js
 * activity; bei 1 etwa alle 36 s, am Ende der Skala 28 und 42 s) · after: nach einem Moment so bald die nächste, aber
 * nicht vor soon Sekunden nach dem letzten Kauf · min: so lange nach dem Beginn der letzten spricht keine neue · big: ab
 * so viel Euro ist eine Spende ein Moment · moment: so lange gilt er (FACTS geblitzt …) · quiet: so viele Sekunden ist
 * vor und nach einer Durchsage keine andere Stimme zu hören · studio: ist das Sprachstudio so bald dran, hat es Vorrang ·
 * goal: so kurz vor dem Brunnen beginnt keine mehr (gleich kommt die Folge) · speak: so lange nach der Spende spricht
 * sie frühestens · lage: Anteil der Züge, in denen eine Durchsage zur Lage vor den allgemeinen kommt.
 */
export const DS = { gap: [27, 45], eager: [0.85, 1.3], after: [4, 9], soon: 25, min: 18, big: 100, moment: 45, quiet: 2.5, studio: 4, goal: 25, speak: 1.2, lage: 0.6 };
/** Momente, die eine Durchsage auslösen können (Game.dsMoment), und das Stichwort (when), das zu ihnen passt. */
export const MOMENTS = { blitz: 'geblitzt', rempler: 'rempler', folge: 'folge', laden: 'geladen', spende: 'spende', links: 'links' };
const MOMENT_KEYS = new Set(Object.values(MOMENTS));
/**
 * Platzhalter einer Durchsage und die Stichworte, von denen eins ihren Wert sicherstellt (city: ein Ort aus dem Chat,
 * immer da; ein Ziel steht bei ziel, nah, weit und offen im Navi).
 */
export const SLOTS = { city: [], ort: ['ort'], gleich: ['gleich'], ziel: ['ziel', 'nah', 'weit', 'offen'], brunnen: ['ziel', 'nah', 'weit', 'offen'], spender: ['spende'] };

/** Alle Durchsagen des Stapels: die Regen-Durchsagen tragen ihr Stichwort mit. */
export const ALL = [...DURCHSAGEN, ...DURCHSAGEN_REGEN.map((d) => ({ ...d, when: d.when ? d.when + ' regen' : 'regen' }))];
const keysOf = (d) => (d.when ? d.when.split(' ') : []);

export class Durchsagen {
  /** g: das Spiel (Game: t, world, gags, navi). */
  constructor(g) {
    this.g = g;
    this.reset(1);
  }

  /**
   * Neuer Stream: Zufall neu säen, Stapel voll. used: schon gesagte (Index in ALL), last: die zuletzt gesagte (kommt
   * auch nach einem neuen Durchgang nicht gleich wieder), moments: wann was zuletzt war, spender: wer zuletzt groß
   * gespendet hat, pending: gekauft, aber noch nicht gesprochen ({ i, name, at, hold, before }), boughtT: wann zuletzt
   * eine gekauft wurde, count: so viele gezogen.
   */
  reset(seed) {
    this.rnd = mulberry32(seed >>> 0);
    this.used = new Set();
    this.last = -1;
    this.moments = {};
    this.spender = '';
    this.pending = null;
    this.boughtT = -99;
    this.count = 0;
    // (lief im letzten Bild ein Ladestopp, eine Folge? updateDurchsagen merkt so ihr Ende)
    this.wasCharging = false;
    this.wasTv = false;
  }

  rand(a, b) {
    return a + (b - a) * this.rnd();
  }

  pick(list) {
    return list[Math.floor(this.rnd() * list.length)];
  }

  /** Abstand bis zur nächsten Durchsage (Ereignis-Uhr). */
  gap() {
    return this.rand(DS.gap[0], DS.gap[1]);
  }

  /** Ein Moment (MOMENTS) ist eben passiert; who: wer groß gespendet hat. */
  moment(kind, who) {
    this.moments[kind] = this.g.t;
    if (who) this.spender = who;
  }

  /** War der Moment mit diesem Stichwort (MOMENTS, z. B. „geladen“) eben (DS.moment Sekunden)? */
  just(key) {
    for (const k in MOMENTS) if (MOMENTS[k] === key) return this.g.t - (this.moments[k] ?? -1e9) < DS.moment;
    return false;
  }

  /** Ein Käufer für die Durchsage (frei erfunden, aus der festen Namensfolge). */
  buyer() {
    return viewerNameAt(Math.floor(this.rnd() * 997));
  }

  /**
   * Die nächste Durchsage vom Stapel, die jetzt passt (fits(d): stimmt jedes Stichwort). Zuerst eine zum Moment, sonst
   * mit DS.lage eine zur Lage, sonst irgendeine; ist jede passende schon gesagt, beginnt ein neuer Durchgang (ohne die
   * zuletzt gesagte). Ergebnis: Index in ALL oder −1.
   */
  draw(fits) {
    const ok = [];
    for (let i = 0; i < ALL.length; i++) if (fits(ALL[i])) ok.push(i);
    let free = ok.filter((i) => !this.used.has(i));
    if (!free.length) {
      for (const i of ok) this.used.delete(i);
      free = ok.filter((i) => i !== this.last);
      if (!free.length) free = ok;
    }
    if (!free.length) return -1;
    const now = free.filter((i) => keysOf(ALL[i]).some((k) => MOMENT_KEYS.has(k)));
    const lage = free.filter((i) => ALL[i].when);
    const i = this.pick(now.length ? now : lage.length && this.rnd() < DS.lage ? lage : free);
    this.used.add(i);
    this.last = i;
    this.count++;
    return i;
  }

  /** Eine gezogene Durchsage, die doch nicht gesprochen wurde, kommt zurück in den Stapel. */
  putBack(i) {
    this.used.delete(i);
    this.count--;
  }

  /**
   * Die Platzhalter einer Durchsage für diesen Moment (g: das Spiel): {city} ein Ort aus dem Chat, {ort} der Ort, durch
   * den der Wagen fährt, {gleich} der nächste auf dem Weg, {ziel} der Zielort, {brunnen} sein Brunnen, {spender} wer eben
   * groß gespendet hat. Ergebnis: { city, ort, … } (nur, was gilt).
   */
  vars() {
    const g = this.g;
    const v = { city: this.pick(CHAT_CITIES) };
    const tr = g.world.trip ? g.world.trip() : null;
    const sec = tr && tr.section;
    if (sec && sec.kind === 'stadt' && places[sec.place]) v.ort = places[sec.place].name;
    const next = g.gags.nextTown();
    if (next) v.gleich = next.name;
    const t = g.navi.target;
    if (t) {
      v.ziel = t.name;
      v.brunnen = String(t.goal || t.name).split(',')[0];
    }
    if (this.spender) v.spender = this.spender;
    return v;
  }
}
