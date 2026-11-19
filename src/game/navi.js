// Das ferngesteuerte Navi: Zuschauer überbieten sich (mindestens 1 Cent mehr), das Ziel wechselt
// automatisch, die Route wird neu berechnet – manchmal mit „Bitte wenden“ auf der Autobahn.
// Zwei Navis mit derselben Schnittstelle fürs Bieten (game.js updateNavi/changeNavi): Navi für das klassische Spiel
// mit seinen erfundenen Zielen an der endlosen Autobahn, WorldNavi für „Navi ferngesteuert XXL“ – dort nennt jedes
// Gebot einen echten Ort der Karte, und Weg, Entfernung und Ankunft gehören der Fahrt (trip.js).
import { NAVI_TARGETS, BANK_FARBEN, INSIDER_ORTE } from '../data.js';
import { rand, chance, pick, weightedPick, fmtCent, fmtClock, clamp } from '../util.js';
import { places } from '../map/graph.js';
import { fmtMeters, fmtToTarget } from '../map/navroute.js';

/** Kurzer Name für Schilderbrücken und das Navi-Kärtchen. */
export function shortName(t) {
  if (!t) return '';
  if (t.short) return t.short;
  const n = t.name.split(/[,(–:]/)[0].trim();
  return n.length > 24 ? n.slice(0, 23) + '…' : n;
}

const SPARK_HEX = { rot: '#d5121e', blau: '#1d5fbf', 'weiß': '#f2f2f2', 'rot (wie immer)': '#d5121e', 'überraschend orange': '#f07a12' };

export class Navi {
  constructor(scenery) {
    this.scenery = scenery;
    this.requests = [];
    this.reset(0);
  }

  reset(s) {
    for (const id of this.requests) this.scenery.cancel(id);
    this.requests = [];
    this.bid = 0.01;
    this.changes = 0;
    this.history = [];
    this.set(s, NAVI_TARGETS[0], 'Mini Adam', { first: true });
  }

  /** Neues Ziel auswählen (nie dasselbe wie gerade). */
  pickTarget() {
    const cur = this.target;
    return weightedPick(NAVI_TARGETS.filter((t) => t !== cur), (t) => t.weight ?? 1);
  }

  /**
   * Ein Zuschauer überbietet: neues Ziel, Gebot + increment (mindestens 1 Cent; wie viel, entscheidet die
   * Stream-Kasse in economy.js). Im Bieterduell bringt jeder sein eigenes Ziel mit (target).
   */
  overbid(s, bidder, increment = 0.01, target = this.pickTarget()) {
    this.bid = Math.round((this.bid + increment) * 100) / 100;
    this.changes++;
    this.set(s, target, bidder);
    return target;
  }

  set(s, target, bidder, { first = false } = {}) {
    // Überboten: Schild und Wahrzeichen des alten Ziels verschwinden. Schon angekommen: alles bleibt stehen.
    for (const id of this.requests) this.scenery.cancel(id, !this.arrived);
    this.requests = [];
    this.target = target;
    this.bidder = bidder;
    this.km = rand(target.km[0], target.km[1]);
    this.startS = s;
    this.targetS = s + this.km * 1000;
    this.recalc = first ? 0 : 1;
    this.wende = !first && chance(0.28);
    this.wendeS = s + rand(380, 820);
    this.arrived = false;
    this.side = chance(0.5) ? 1 : -1;
    this.sparkColor = pick(BANK_FARBEN);
    this.history.push({ name: target.name, bidder, bid: this.bid });
    if (this.history.length > 12) this.history.shift();
    this.placeLandmarks();
  }

  placeLandmarks() {
    const t = this.target;
    const S = this.targetS;
    const req = (type, s, data) => this.requests.push(this.scenery.request(type, s, data));
    req('ziel', S, { title: shortName(t) });
    switch (t.special) {
      case 'brunnen':
        req('brunnen', S - 70);
        break;
      case 'elsa':
        req('elsa', S - 70);
        break;
      case 'sparkasse':
        req('sparkasse', S - 90, { color: SPARK_HEX[this.sparkColor] || '#d5121e' });
        break;
      case 'pommes':
        req('kiosk', S - 80, { title: 'Drive-In', sub: 'Pommes ohne Rückfragen' });
        break;
      case 'bude':
        req('kiosk', S - 80, { title: 'Currywurst', sub: 'die richtige Bude (wirklich!)' });
        break;
      case 'charger':
        req('charger', S - 80);
        break;
      default:
        break;
    }
    if (/Burg|Wartburg/.test(t.name)) req('burg', S - 40);
    // Skyline hinter dem Ziel, damit ihr Segment erst abgebaut wird, wenn die Türme hinter uns liegen
    if (/Frankfurt/.test(t.name)) req('skyline', S + 300);
  }

  get remaining() {
    return Math.max(0, this.targetS - this._s);
  }

  update(dt, s) {
    this._s = s;
    const ev = [];
    this.recalc = Math.max(0, this.recalc - dt / 2.4);
    if (this.wende && s > this.wendeS) {
      this.wende = false;
      this.recalc = 0.8;
      ev.push({ type: 'wendeIgnored' });
    }
    if (!this.arrived && s >= this.targetS) {
      this.arrived = true;
      ev.push({ type: 'arrived', target: this.target, km: this.km });
    }
    return ev;
  }

  /** Daten für den Mittelbildschirm. */
  screen(s, clockMin, speed) {
    const remaining = Math.max(0, this.targetS - s);
    const eta = clockMin + (remaining / clamp(speed, 20, 70)) * 0.5;
    return {
      target: this.arrived ? 'Warte auf das nächste Gebot …' : this.target.name,
      arrived: this.arrived,
      remaining,
      recalc: this.recalc,
      side: this.side,
      wende: this.wende,
      wendeS: this.wendeS,
      eta: this.arrived ? '' : 'Ankunft ' + fmtClock(eta),
      bidder: this.bidder,
      bid: fmtCent(this.bid),
    };
  }
}

// --- Navi ferngesteuert XXL: geboten wird auf echte Orte ------------------------------------------------------------
/**
 * Wohin ein Bieter will (REISE A2): Gewicht eines Orts = Bekanntheit × Entfernung × Neuheit.
 * - Bekanntheit: Streams im Community-Wiki (places[].n), gedämpft als 1 + log2(n) – Frankfurt am Main 8, Kassel 4,6,
 *   die allermeisten Orte 1. Ungedämpft ginge fast jedes Gebot nach Frankfurt, Köln und Hamburg.
 * - Entfernung in Kartenkilometern über das Straßennetz, von dort, wo der Wagen gerade ist (siehe placeWeight): die
 *   meisten Gebote liegen zwischen nearKm und farKm (gemessen mit tools/journey-test.mjs: rund 80 %, dazu je etwa
 *   10 % näher und weiter), nahe Orte etwas öfter als ferne (pull); dahinter klingt es mit fade ab, und ganz selten
 *   will jemand sehr weit weg (farFloor). Näher als minKm bietet niemand: das wäre der Ort, in dem der Wagen steht,
 *   oder der nächste.
 * - Neuheit: jeder Besuch in diesem Stream senkt das Gewicht auf seen (zum Ziel gefahren) bzw. passed (durchgefahren).
 * Nie zur Wahl stehen das aktuelle Ziel (economy.pickTarget) und Orte, die die Fahrt nur mit Fähre, Autozug oder
 * Luftfracht erreicht: Terminals baut die Welt noch nicht, also führt jedes Gebot über Straßen (trip.setTarget road).
 */
export const BID_PLACES = { minKm: 12, nearKm: 30, farKm: 250, pull: 1.3, fade: 30, farFloor: 0.0008, seen: 0.2, passed: 0.6 };

/** Gewicht der Entfernung (Kartenkilometer über Straßen): 0 = steht nicht zur Wahl. */
export function placeWeight(km) {
  const B = BID_PLACES;
  if (!(km >= B.minKm) || !isFinite(km)) return 0;
  if (km < B.nearKm) return 0.15 + (0.85 * (km - B.minKm)) / (B.nearKm - B.minKm);
  // je weiter weg, desto mehr Orte gibt es: pull gleicht das aus, sonst läge fast jedes Ziel am fernen Rand
  const band = Math.pow(B.nearKm / Math.min(km, B.farKm), B.pull);
  return km <= B.farKm ? band : Math.max(B.farFloor, band * Math.exp(-(km - B.farKm) / B.fade));
}

export class WorldNavi {
  /**
   * @param {{trip: () => object}} world die Fahrt der XXL-Welt (trip.js). Sie wird bei jedem Zugriff neu erfragt: jede
   *   Fahrt hat ihre eigene, und die Welt legt sie erst nach Game.start an.
   */
  constructor(world) {
    this.world = world;
    // je Ort ein festes Ziel-Objekt (economy.pickTarget vergleicht Objekte): Name wie auf der Ortstafel, dazu der
    // Insider des Orts (special: besondere Ankunft, note: Zeile unter dem Hinweis aufs neue Ziel)
    this.targets = places.map((p) => ({ place: p.i, name: p.name, weight: 0, ...INSIDER_ORTE[p.key] }));
    this.list = [];
    this.screenOut = { bidder: '', bid: '', bar: '', wait: '' };
    this.reset();
  }

  reset() {
    this.bid = 0;
    this.bidder = '';
    this.target = null;
    // arrived: gerade führt kein Gebot (vor dem ersten Gebot des Streams und nach jeder Ankunft bis zum nächsten)
    this.arrived = true;
    this.reached = null; // das zuletzt erreichte Ziel, solange noch kein neues Gebot da ist
    this.stopping = null; // das Ziel, an dessen Brunnen der Wagen gerade zum Halt bremst
    this.missed = false; // am Brunnen des letzten Ziels vorbeigerollt, noch kein neues Gebot
    this.changes = 0;
    this.history = [];
    this.wende = false;
    this.visits = new Map(); // Ortsindex → Gewichtsfaktor aus den Besuchen dieses Streams
    this.listKey = '';
  }

  get trip() {
    return this.world.trip();
  }

  /**
   * Die Orte, auf die gerade geboten werden kann (für Game.bidTargets), mit frischen Gewichten. Gerechnet wird nur,
   * wenn der Wagen auf einer anderen Straße ist, sein Weg sich geändert hat oder ein Besuch dazukam (eine Routensuche
   * über die ganze Karte). Nicht zur Wahl steht ein Ort, durch den der Wagen auf seinem Weg ohnehin gleich fährt:
   * Das wäre ein geschenktes Ziel, und kurz vor dem Brunnen käme er nicht einmal mehr zum Stehen.
   */
  candidates() {
    const trip = this.trip;
    const key = trip.state() + ':' + trip.version;
    if (key === this.listKey) return this.list;
    this.listKey = key;
    const D = trip.distances(true);
    const list = (this.list = []);
    const ahead = trip.cur.sections.filter((c) => c.kind === 'stadt' && !c.spotDone && c.s1 > trip.s).map((c) => c.place);
    for (const t of this.targets) {
      const p = places[t.place];
      const w = ahead.includes(t.place) ? 0 : placeWeight(D.toPlace(t.place).km) * (1 + Math.log2(p.n)) * (this.visits.get(t.place) ?? 1);
      // Siegen wird oft geboten und setzt sich fast nie durch (ein Viertel des Gewichts, dafür der Siegen-Gag)
      t.weight = t.special === 'siegen' ? w * 0.25 : w;
      if (w > 0) list.push(t);
    }
    return list;
  }

  /** Ein Zuschauer überbietet: Gebot + increment, die Fahrt plant zum Ort des Ziels (nur über Straßen). */
  overbid(s, bidder, increment = 0.01, target) {
    this.bid = Math.round((this.bid + increment) * 100) / 100;
    this.changes++;
    this.target = target;
    this.bidder = bidder;
    this.arrived = false;
    this.reached = null;
    this.missed = false;
    const trip = this.trip;
    trip.setTarget(target.place, true);
    // „Bitte wenden“ gibt es nur, wenn die Fahrt wirklich zurückführt: über die nächste Ausfahrt und ihre Rampen
    const g = trip.guidance();
    this.wende = !!(g.then && g.then.wende);
    this.history.push({ name: target.name, bidder, bid: this.bid });
    if (this.history.length > 12) this.history.shift();
    return target;
  }

  /**
   * Die Fahrt meldet den Zielpunkt am Brunnenplatz: Der Wagen bremst jetzt zum Halt am Brunnen (stopping). Angekommen
   * ist er erst, wenn er dort steht (arrive) – rollt er vorbei, war es keine Ankunft (miss).
   */
  stop(place) {
    this.stopping = this.targets[place];
    this.target = null;
    this.wende = false;
  }

  /** Der Wagen steht am Brunnen des Ziels: Die Runde ist vorbei. Liefert das erreichte Ziel. */
  arrive() {
    const t = this.stopping;
    this.stopping = null;
    this.visit(t.place, BID_PLACES.seen);
    this.arrived = true;
    this.reached = t;
    return t;
  }

  /**
   * Am Brunnen vorbeigerollt: Das Ziel wechselte erst im letzten Moment wieder hierher (etwa mitten im Bieterduell),
   * zum Anhalten war der Wagen zu schnell. Keine Ankunft – die Runde läuft mit dem nächsten Gebot weiter.
   */
  miss() {
    this.visit(this.stopping.place);
    this.stopping = null;
    this.missed = true;
  }

  /** Ein Ort wurde besucht (factor: BID_PLACES.seen am Ziel, passed bei der Durchfahrt): Er wird seltener geboten. */
  visit(place, factor = BID_PLACES.passed) {
    this.visits.set(place, (this.visits.get(place) ?? 1) * factor);
    this.listKey = '';
  }

  /** Kartenkilometer bis zum Ziel (Infinity ohne Ziel). */
  get km() {
    return this.target ? this.trip.stateAhead().km : Infinity;
  }

  /** Entfernung zum Ziel in Worten, genau wie auf dem Kärtchen im Auto (fmtToTarget: zuletzt die Meter der Ansage). */
  get distance() {
    if (this.stopping) return fmtMeters(0);
    const g = this.trip.guidance();
    return fmtToTarget(this.km, g.type === 'arrive' ? g.dist : 0);
  }

  /** Sekunden bis zum Ziel im Tempo, das das Navi annimmt (für die Pause bis zum nächsten Gebot, siehe economy.js). */
  driveSecs() {
    return this.target ? this.trip.stateAhead().secs : 0;
  }

  /** Sekunden bis zum Zielpunkt bei diesem Tempo – nur im Zielort, auf den letzten Metern (sonst Infinity). */
  eta(speed) {
    const g = this.target ? this.trip.guidance() : null;
    return g && g.type === 'arrive' ? g.dist / Math.max(speed, 8) : Infinity;
  }

  /** Fährt der Wagen schon durch den Zielort, den Brunnen voraus? (Ein Gebot nimmt dann das BrunnenTV weg.) */
  get inTown() {
    const trip = this.trip;
    const sec = trip.section;
    return !!this.target && sec.kind === 'stadt' && sec.place === trip.target && !sec.spotDone;
  }

  /**
   * Das Ziel, das HUD-Zeile, Pause-Karte und roter Balken nennen: das Ziel der Runde – auch noch auf den letzten
   * Metern vom Zielpunkt bis zum Halt. Erreicht ist es für die Bieter erst, wenn der Wagen am Brunnen steht.
   */
  get shown() {
    return this.target || this.stopping;
  }

  /** Das Navi-Ziel in Worten (Pause-Karte). */
  get label() {
    const t = this.shown;
    if (t) return t.name;
    return this.reached ? this.reached.name + ' (erreicht)' : 'noch offen';
  }

  /**
   * Die Zeile oben im HUD ohne Ziel: vor dem ersten Gebot, zwischen Ankunft und nächstem Gebot und nach einer
   * verpassten Ankunft.
   */
  get waitLine() {
    if (this.reached) return `📍 Ziel erreicht: ${this.reached.name} – warte auf das nächste Gebot …`;
    return this.missed ? '📍 Am Brunnen vorbeigerollt – gleich kommt das nächste Gebot …' : '📍 Wohin geht die Reise? Gleich kommt das erste Gebot …';
  }

  update() {
    return NO_EVENTS;
  }

  /**
   * Für den Mittelbildschirm (st.navi → st.nav, src/map/navview.js): Bieter und Gebot im roten Balken; ohne Gebot der
   * Text des Balkens (bar) und die Zeile im Kärtchen (wait). Weg, Kilometer und Ankunft zeigt das Navi aus der Fahrt.
   */
  screen() {
    const S = this.screenOut;
    S.bidder = this.shown ? this.bidder : '';
    S.bid = this.shown ? fmtCent(this.bid) : '';
    // (das Navi selbst meldet „Ziel erreicht“ schon am Zielpunkt, wie jedes Navi – darum gilt das Kärtchen ab dort)
    const r = this.stopping || this.reached;
    S.bar = r ? '📡 Neue Runde: Gebote ab 0,01 €' : this.missed ? '📡 Der Chat bietet weiter …' : '📡 Der Chat bietet: Gebote ab 0,01 €';
    S.wait = r ? '⛲ Ziel erreicht: ' + r.name : this.missed ? '⏳ Vorbeigerollt – gleich kommt das nächste Gebot …' : '⏳ Gleich kommt das erste Gebot …';
    return S;
  }
}
const NO_EVENTS = [];
