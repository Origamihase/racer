// Das ferngesteuerte Navi: Zuschauer überbieten sich (in Zehnern), das Ziel wechselt automatisch, die Route wird neu
// berechnet – manchmal mit „Bitte wenden“ über die nächste Ausfahrt. Jedes Gebot nennt einen echten Ort der Karte;
// Weg, Entfernung und Ankunft gehören der Fahrt (trip.js). Geboten wird in game.js (updateNavi/changeNavi).
import { INSIDER_ORTE } from '../data.js';
import { fmtEuro } from '../util.js';
import { places } from '../map/graph.js';
import { fmtRoad, fmtDistance } from '../map/navroute.js';
import { goalName } from '../world/kit/layout.js';

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

/**
 * Die erste Runde eines Streams – vom Start bis zum ersten Halt an einem Brunnen (oder dem ersten Vorbeirollen): Wer
 * neu ist, soll in seinen ersten Minuten erleben, worum es geht. Darum nennen die Gebote dort nur Orte in der Nähe:
 * höchstens secs Sekunden Fahrt im Tempo des Navis, von dort, wo der Wagen gerade ist (trip.whatIf – vom Start in
 * Erlensee sind das Hanau 2:22, Bad Vilbel 2:45, Frankfurt am Main 3:54, Eschborn 3:58 und Offenbach am Main 4:21);
 * nur wenn weniger als min Orte so nah liegen, die min nächsten (zwei: neben dem aktuellen Ziel, auf das nie geboten
 * wird, bleibt so immer ein anderer Ort). Das gilt für jedes Gebot der Runde, auch für eins, das ein stehendes Ziel
 * wieder wegnimmt (tools/journey-test.mjs, 300 erste Runden je Fahrer: mit min 4 lagen 33 bis 47 % dieser Ziele
 * weiter als secs entfernt, bis 363 s, mit min 2 sind es 24 bis 32 %, bis 345 s).
 * Unter ihnen entscheiden Bekanntheit und Neuheit wie sonst; die Entfernung zählt
 * nicht weiter, auch minKm nicht (sonst fiele Hanau heraus). Nie zur Wahl stehen der Ort, in dem die Fahrt begonnen
 * hat (ein Gebot auf Erlensee wäre von Erlensee aus eine Schleife von 16 km), und Orte, zu denen das Navi erst
 * „Bitte wenden“ sagen müsste: Der Weg aus dem Startort liegt fest, bevor das erste Gebot kommt, und die erste
 * Ansage eines Streams soll nach vorn zeigen. pool: so viele Orte, die laut Karte am nächsten liegen, werden dafür
 * durchgerechnet. Wie lange das Ziel danach stehen bleibt, regelt economy.js (OPENING_CALM); im Zielort selbst wartet
 * das nächste Gebot, bis der Wagen am Brunnen steht oder vorbeigerollt ist (Game.updateNavi).
 */
export const OPENING = { secs: 270, min: 2, pool: 16 };

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
   * @param {{trip: () => object}} world die Fahrt (trip.js). Sie wird bei jedem Zugriff neu erfragt: jede
   *   Fahrt hat ihre eigene, und die Welt legt sie erst nach Game.start an.
   */
  constructor(world) {
    this.world = world;
    // je Ort ein festes Ziel-Objekt (economy.pickTarget vergleicht Objekte): Name wie auf der Ortstafel, goal: das
    // Ziel selbst, der Hauptbrunnen des Orts („Marktbrunnen, Würzburg“, kit/layout.js goalName), dazu der Insider des
    // Orts (special: besondere Ankunft, note: Zeile unter dem Hinweis aufs neue Ziel)
    this.targets = places.map((p) => ({ place: p.i, name: p.name, goal: goalName(p), weight: 0, ...INSIDER_ORTE[p.key] }));
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
    this.window = 0; // Sekunden, die das Bieterfenster nach einer Folge noch offen ist (Game.openWindow), sonst 0
    this.changes = 0;
    this.wende = false;
    this.visits = new Map(); // Ortsindex → Gewichtsfaktor aus den Besuchen dieses Streams
    this.listKey = '';
    // die erste Runde des Streams läuft noch (siehe OPENING): bis zum ersten Halt am Brunnen oder Vorbeirollen
    this.opening = true;
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
    // (in der ersten Runde hängt die Wahl auch daran, wo der Wagen gerade ist – was er noch ohne Wenden erreicht:
    // dort je Gebot frisch, das kostet etwa eine Millisekunde)
    const key = trip.state() + ':' + trip.version + (this.opening ? ':' + trip.s.toFixed(0) : '');
    if (key === this.listKey) return this.list;
    this.listKey = key;
    const D = trip.distances(true);
    const list = (this.list = []);
    const ahead = trip.cur.sections.filter((c) => c.kind === 'stadt' && !c.spotDone && c.s1 > trip.s).map((c) => c.place);
    // (liegt ein eingeplanter Ladepark hinter dem Wagen, führt schon der Weg dorthin über ein Wenden, und die erste
    // Runde fände keinen Ort: dann wählt sie nach der Entfernung wie jede andere – es gibt immer etwas zu bieten)
    let near = this.opening ? this.nearby(trip, D, ahead) : null;
    if (near && near.size < OPENING.min) near = null;
    for (const t of this.targets) {
      const p = places[t.place];
      const far = near ? (near.has(t.place) ? 1 : 0) : placeWeight(D.toPlace(t.place).km);
      const w = ahead.includes(t.place) ? 0 : far * (1 + Math.log2(p.n)) * (this.visits.get(t.place) ?? 1);
      // Siegen wird oft geboten und setzt sich fast nie durch (ein Viertel des Gewichts, dafür der Siegen-Gag)
      t.weight = t.special === 'siegen' ? w * 0.25 : w;
      if (w > 0) list.push(t);
    }
    return list;
  }

  /**
   * Die Orte, die in der ersten Runde zur Wahl stehen (siehe OPENING): Ortsindex → Sekunden Fahrt im Tempo des Navis.
   * D: Entfernungen laut Karte von hier (für die Vorauswahl), ahead: Orte, durch die der Wagen ohnehin gleich fährt.
   */
  nearby(trip, D, ahead) {
    const O = OPENING;
    const pool = [];
    for (const t of this.targets) {
      const secs = D.toPlace(t.place).secs;
      if (isFinite(secs) && t.place !== trip.home && !ahead.includes(t.place)) pool.push({ place: t.place, secs });
    }
    pool.sort((a, b) => a.secs - b.secs);
    const rows = [];
    // (liegen zu viele der nächsten hinter dem Wagen, geht die Suche weiter, bis min Orte gefunden sind – außer mit
    // eingeplantem Ladestopp: führt der Weg zu ihm über ein Wenden, wendet er zu jedem Ort, und die Suche liefe für
    // jedes Gebot über die ganze Karte)
    const scan = trip.stop >= 0 || trip.post >= 0 ? O.pool : pool.length;
    for (let i = 0; i < Math.min(pool.length, scan) && (i < O.pool || rows.length < O.min); i++) {
      const r = trip.whatIf(pool[i].place, true);
      if (isFinite(r.secs) && !r.wende) rows.push({ place: pool[i].place, secs: r.secs });
    }
    rows.sort((a, b) => a.secs - b.secs);
    const near = new Map();
    rows.forEach((r, i) => {
      if (r.secs <= O.secs || i < O.min) near.set(r.place, r.secs);
    });
    return near;
  }

  /**
   * Ein Zuschauer überbietet: Gebot + increment, die Fahrt plant zum Ort des Ziels (nur über Straßen). Geboten wird in
   * Zehnern (economy.js: jeder Schritt ein Vielfaches von 10 €, das erste Gebot einer Runde 10 €).
   */
  overbid(s, bidder, increment = 10, target) {
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
    this.opening = false;
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
    this.opening = false;
  }

  /** Ein Ort wurde besucht (factor: BID_PLACES.seen am Ziel, passed bei der Durchfahrt): Er wird seltener geboten. */
  visit(place, factor = BID_PLACES.passed) {
    this.visits.set(place, (this.visits.get(place) ?? 1) * factor);
    this.listKey = '';
  }

  /** Reisekilometer bis zum Ziel (Infinity ohne Ziel). */
  get km() {
    return this.target ? this.trip.reach().km : Infinity;
  }

  /**
   * Entfernung zum Ziel in Worten, genau wie auf dem Kärtchen im Auto und in der Ansage (fmtDistance: Reisekilometer,
   * und Meter, sobald bis zum Brunnen nur noch echte Straße liegt).
   */
  get distance() {
    return this.stopping ? fmtRoad(0) : fmtDistance(this.trip.reach());
  }

  /**
   * Echte Sekunden bis zum Ziel im Tempo, das das Navi annimmt (für die Pause bis zum nächsten Gebot, siehe
   * economy.js – die Bieter warten in echter Zeit, nicht in der Reisezeit der Uhr).
   */
  driveSecs() {
    return this.target ? this.trip.reach().secs : 0;
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

  /** Das Navi-Ziel in Worten (Pause-Karte): der Brunnen und sein Ort. */
  get label() {
    const t = this.shown;
    if (t) return t.goal;
    return this.reached ? this.reached.goal + ' (erreicht)' : 'noch offen';
  }

  /**
   * Die Zeile oben im HUD ohne Ziel: vor dem ersten Gebot, zwischen Ankunft und nächstem Gebot und nach einer
   * verpassten Ankunft.
   */
  get waitLine() {
    if (this.reached && this.window > 0) return `📍 Ziel erreicht: ${this.reached.goal} – Gebote noch ${this.window} s …`;
    if (this.reached) return `📍 Ziel erreicht: ${this.reached.goal} – warte auf das nächste Gebot …`;
    return this.missed ? '📍 Am Brunnen vorbeigerollt – gleich kommt das nächste Gebot …' : '📍 Wohin geht die Reise? Gleich kommt das erste Gebot …';
  }

  /**
   * Für den Mittelbildschirm (st.navi → st.nav, src/map/navview.js): Bieter und Gebot (ganze Euro) im roten Balken;
   * ohne Gebot der Text des Balkens (bar) und die Zeile im Kärtchen (wait). Weg, Kilometer und Ankunft zeigt das Navi
   * aus der Fahrt.
   */
  screen() {
    const S = this.screenOut;
    S.bidder = this.shown ? this.bidder : '';
    S.bid = this.shown ? fmtEuro(this.bid) : '';
    // (das Navi selbst meldet „Ziel erreicht“ schon am Zielpunkt, wie jedes Navi – darum gilt das Kärtchen ab dort)
    const r = this.stopping || this.reached;
    S.bar = r ? (this.window > 0 ? `📡 Neue Runde: noch ${this.window} s für Gebote` : '📡 Neue Runde: Gebote ab 10 €') : this.missed ? '📡 Der Chat bietet weiter …' : '📡 Der Chat bietet: Gebote ab 10 €';
    S.wait = r ? '⛲ Ziel erreicht: ' + r.goal : this.missed ? '⏳ Vorbeigerollt – gleich kommt das nächste Gebot …' : '⏳ Gleich kommt das erste Gebot …';
    return S;
  }
}
