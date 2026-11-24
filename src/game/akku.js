// Akku und Ladestopps einer Reise: Verbrauch messen, OMIs Warnungen, Reichweite, den Stopp planen, laden, die Akku-Karte
// des Mittelbildschirms und der Zuckerschub danach. Eine eigene Klasse mit eigenem Zustand; vom Spiel (Game, game.js)
// liest sie nur, was AKKU_HOST nennt (die Prüfstände halten die Liste ehrlich: stopp-test).
import { CHAT, REISE_AKKU, fillTemplate } from '../data.js';
import { clamp, pick } from '../util.js';
import { stopPlan, STOP } from '../world/xxl/charge.js';
import { WAY } from './parts/ziel.js';

/** Entfernung für OMIs Ansage: „39 Kilometern“, unter 10 km mit einer Nachkommastelle („4,5 Kilometern“). */
function kmWords(km) {
  if (km < 10) {
    const v = Math.max(0.1, Math.ceil(km * 10 - 1e-6) / 10);
    return v === 1 ? 'einem Kilometer' : v.toFixed(1).replace('.', ',').replace(',0', '') + ' Kilometern';
  }
  return Math.round(km) + ' Kilometern';
}
/**
 * Akku-Karte des Mittelbildschirms (Akku.lowBattery, Game.screenState lowBattery): unter at[0] Prozent „Akku fast leer“,
 * unter at[1] „Akku kritisch“, je show Sekunden; leer steht „Akku leer“, bis der Wagen ausgerollt ist. fade: Sekunden
 * zum Ein- und Ausblenden. Nach dem Laden (über at[0] + 2 %) kommt sie wieder.
 */
export const AKKU_CARD = { at: [10, 5], show: 8, fade: 0.35 };
/** Stufe der Akku-Karte bei pct Prozent: 0 keine, 1 fast leer, 2 kritisch, 3 leer. */
export function akkuLevel(pct) {
  return pct <= 0 ? 3 : pct <= AKKU_CARD.at[1] ? 2 : pct <= AKKU_CARD.at[0] ? 1 : 0;
}
/**
 * Verbrauch des Akkus seit dem letzten Laden (Akku.journeyBattery): Meter Straße und Prozent, getrennt nach offener
 * Strecke und echter Straße; s und b sind Bandmeter und Akku der letzten Messung (NaN: noch keine); park: der nächste
 * Ladepark für die Akku-Karte (Name, Kilometerstand der Reise dort, eingeplant?), sobald sie kommen kann.
 */
export const meterAkku = () => ({ next: 0, s: NaN, b: 0, open: { m: 0, pct: 0 }, real: { m: 0, pct: 0 }, park: null });
/** Ein Weg, den kein Akku schafft (Akku.reachable): kein Ziel oder kein Park dahinter. */
const NOWHERE = { m: Infinity, realM: 0 };

/**
 * Was der Akku vom Spiel liest oder aufruft (und sonst nichts): der Wagen, die Welt mit der Reise, die Spielzeit, ob und
 * welche Szene läuft, OMI, Chat, Rand oben, Töne, Ökonomie, Statistik, die Hooks der Ladeszene und der Route, und ob der
 * Wagen auf der Autobahn ist (Zuckerschub). Geschrieben wird nur in player (Akku, empty, sugar) und stats.
 */
export const AKKU_HOST = [
  'player', 'world', 't', 'running', 'over', 'tv', 'halt', 'offAutobahn', 'up', 'touchUI', 'ui', 'audio', 'eco', 'stats',
  'say', 'sayHeld', 'chat', 'burst', 'thrill', 'routeMark', 'onCharge',
];

export class Akku {
  /** g: das Spiel (Game), von dem nur AKKU_HOST benutzt wird. */
  constructor(g) {
    this.g = g;
    this.reset();
  }

  /**
   * Neue Fahrt: kein Ladestopp ({ t0, from, park, name, sec, plan, … }, start), Verbrauch seit dem letzten Laden
   * (meterAkku: Meter Straße und Akku je Art der Straße, für OMIs Warnung) und wann sie wieder misst; warned: 1 früh,
   * 2 bei 25 %, 3 bei 10 % (journeyBattery); low: Stufe der Akku-Karte und seit wann; hint: neben einer Ladesäule oder
   * Bucht wird Laden mit L angeboten, der Hinweis kam zuletzt bei hintT; sugarDue: der Zuckerschub des Bananensafts
   * kommt, sobald der Wagen nach dem Stopp wieder auf der Autobahn ist.
   */
  reset() {
    this.charging = null;
    this.sugarDue = false;
    this.meter = meterAkku();
    this.warned = 0;
    this.low = { lvl: 0, t: 0 };
    this.hint = false;
    this.hintT = 0;
  }

  /**
   * Laden ohne Plan: steht (oder kriecht) der Wagen neben einer Ladesäule oder Bucht, bietet es der Rand oben an –
   * Taste L, auf dem Handy der Knopf „Jetzt laden“ (Besitzer, 21.11.2026: „Es sollte ein manuelles Triggern des Ladens
   * (wie bei BrunnenTV mit B) möglich sein.“), wie bei BrunnenTV alle WAY.remind Sekunden wieder.
   */
  offerHint() {
    const g = this.g;
    const here = !!this.chargeOffer();
    if (here && (!this.hint || g.t - this.hintT >= WAY.remind)) {
      this.hintT = g.t;
      g.ui.toast(g.touchUI ? '🔌 Ladesäule: Knopf „Jetzt laden“' : '🔌 Ladesäule: Jetzt laden mit Taste L', 'info', 'ladenHier');
    } else if (!here && this.hint) g.ui.dropKey('ladenHier');
    this.hint = here;
  }

  /** Je Bild nach Verkehr, Spur und Wetter: der laufende Ladestopp und danach der Zuckerschub des Bananensafts. */
  tick() {
    const g = this.g;
    if (this.charging) this.tickCharge();
    if (this.sugarDue && !g.offAutobahn) {
      this.sugarDue = false;
      // mit der Plüschbrause-Kiste aus dem Shop (Code ADAM, gags.js) hält er länger
      g.player.sugar = g.up.brause ? 10 : 6;
      g.audio.coin();
      g.ui.toast(g.up.brause ? '🍌 Bananensaft und Plüschbrause! Zuckerschub' : '🍌 Bananensaft! Zuckerschub', 'good');
    }
  }

  /** Am Ende jedes Bilds: OMI nennt den nächsten Ladepark (journeyBattery), die Akku-Karte merkt sich die Stufe (lowBattery). */
  watch() {
    this.journeyBattery();
    this.lowBattery();
  }

  /**
   * Akku auf der Reise (REISE.md A5): Geladen wird in den Ladeparks an den Ausfahrten und an der Ladesäule jedes Orts auf
   * dem Weg. OMI warnt bei REISE_AKKU.warn (25 % und 10 %) und nennt den nächsten Ladeplatz in Reichweite mit
   * Entfernung (trip.nextRest: auf dem Weg, sonst der nächste Park über Straßen, ein Abstecher). Schon früher, unter
   * REISE_AKKU.early, warnt sie, sobald er der letzte in Reichweite ist (reachable): Der übernächste und das Ziel liegen
   * weiter weg, wer an ihm vorbeifährt, kommt nicht mehr an. Ist ein Stopp geplant, sagt sie nur, wie weit es bis dorthin
   * ist. warned: 1 früh, 2 bei 25 %, 3 bei 10 %; nach dem Laden wieder 0. Einmal je Sekunde misst sie dazu den
   * Verbrauch je Meter Straße (meter, perM).
   */
  journeyBattery() {
    const p = this.g.player;
    const A = REISE_AKKU;
    if (this.charging || this.g.t < this.meter.next) return;
    const a = this.meter;
    const trip = this.g.world.trip();
    a.next = this.g.t + 1;
    // gemessen wird, wo der Wagen fährt: auf der offenen Strecke (Zeitraffer) oder auf echter Straße (1:1); ein Sprung auf
    // dem Band zählt nicht
    const ds = p.s - a.s;
    if (ds < 120) {
      const k = trip.scale > 1 ? a.open : a.real;
      k.m += Math.max(0, ds);
      k.pct += Math.max(0, a.b - p.battery);
    }
    a.s = p.s;
    a.b = p.battery;
    // die Akku-Karte nennt denselben Ladepark wie OMI: den nächsten in Reichweite, sonst den Abstecher dorthin
    const fits = (q) => this.reachable(q);
    if (p.battery <= AKKU_CARD.at[0] + 1) {
      const [q] = trip.restsAhead(1, fits);
      a.park = q ? { name: q.name, at: trip.km + q.km, planned: q.planned } : null;
    }
    if (p.battery > A.early + 5) this.warned = 0;
    const lvl = p.battery < A.warn[1] ? 3 : p.battery < A.warn[0] ? 2 : 0;
    if (lvl && lvl <= this.warned) return;
    if (!lvl && (this.warned || p.battery > A.early)) return;
    const rests = trip.restsAhead(lvl ? 2 : A.look, fits);
    const r = rests[0];
    // früh nur, wenn r der letzte Halt in Reichweite ist: Hinter ihm liegt keiner in Reichweite, der die Fahrt verlängert
    // (A.past km und mehr dahinter – die Ladesäulen der nächsten Orte zählen nicht), und auch das Ziel samt einem Park
    // von dort ist nicht zu schaffen. Liegt die volle Liste ganz in diesen A.past km, ist unbekannt, was danach kommt:
    // dann nicht.
    const open = rests.length >= A.look && Math.max(...rests.map((q) => q.km)) < r.km + A.past;
    const beyond = () => open || rests.some((q) => q.km >= r.km + A.past && fits(q)) || fits(trip.pastTarget() ?? NOWHERE);
    if (!lvl && (!r || r.planned || (fits(r) && beyond()))) return;
    this.warned = lvl || 1;
    const vars = { pct: Math.round(p.battery), park: r ? r.name : '', km: r ? kmWords(r.km) : '' };
    const text = !r ? A.none : r.planned ? A.planned : lvl === 3 ? A.veryLow : lvl || !fits(r) ? A.low : A.last;
    this.g.say(fillTemplate(text, vars), 'worried');
    if (r && !r.planned) this.g.ui.toast(this.g.touchUI ? '🔌 Ladestopp einplanen: Knopf unten' : '🔌 Ladestopp einplanen: Taste L', 'info', 'ladestopp');
    this.g.chat(pick(['Akku! 🔋', r && r.post >= 0 ? 'Ab an die Ladesäule!' : 'Ab in den Ladepark!', 'Popcorn-Pause? 🍿', 'Lade-Pause!']));
  }

  /**
   * Akku-Karte (AKKU_CARD): merkt sich, wann der Akku unter eine Stufe fiel. Leer sagt es auch das HUD – in jeder
   * Ansicht, nicht nur im Cockpit.
   */
  lowBattery() {
    const p = this.g.player;
    const c = this.low;
    const lvl = akkuLevel(p.battery);
    if (lvl > c.lvl) {
      c.lvl = lvl;
      c.t = this.g.t;
      if (lvl === 3) this.g.ui.toast('🔋 Akku leer – der Wagen rollt aus', 'bad', 'akku');
    } else if (p.battery > AKKU_CARD.at[0] + 2) c.lvl = 0;
  }

  /**
   * Die Akku-Karte für den Mittelbildschirm (null: keine): Stufe (akkuLevel), Prozent, Deckkraft beim Ein- und
   * Ausblenden und der Ladepark, den OMI nennt (Name, Reisekilometer bis dorthin, eingeplant?).
   */
  card() {
    const c = this.low;
    const age = this.g.t - c.t;
    if (!c.lvl || (c.lvl < 3 && age > AKKU_CARD.show)) return null;
    const F = AKKU_CARD.fade;
    const alpha = Math.min(1, age / F, c.lvl < 3 ? (AKKU_CARD.show - age) / F : 1);
    const pk = c.lvl < 3 ? this.meter.park : null;
    return { lvl: c.lvl, pct: this.g.player.battery, alpha, park: pk ? pk.name : '', km: pk ? Math.max(0, pk.at - this.g.world.trip().km) : 0, planned: !!(pk && pk.planned) };
  }

  /**
   * Erreicht der Wagen das Stück Weg r (m Meter Straße, davon realM auf echter Straße; ein Ladepark aus trip.restsAhead
   * oder trip.reach() bis zum Ziel) mit dem Akku, den er hat, und der Reserve? Der Akku leert sich je Sekunde, im
   * Zeitraffer der offenen Strecke trägt ein Prozent rund zwanzigmal so viele Reisekilometer wie auf echter Straße – je
   * Meter Straße dagegen kostet die Fahrt fast überall gleich viel (perM).
   */
  reachable(r) {
    const need = (r.m - r.realM) * this.perM('open') + r.realM * this.perM('real');
    return need <= this.g.player.battery * REISE_AKKU.reserve;
  }

  /**
   * Akku in Prozent je Meter Straße seit dem letzten Laden, k = 'open' (offene Strecke) oder 'real' (echte Straße):
   * gemessen, sobald REISE_AKKU.measure Meter davon gefahren sind, bis dahin vorsichtig geschätzt (REISE_AKKU.perM, für
   * einen größeren Akku entsprechend weniger).
   */
  perM(k) {
    const a = this.meter[k];
    return a.m >= REISE_AKKU.measure ? a.pct / a.m : (REISE_AKKU.perM[k] * 75) / this.g.player.capacity;
  }

  /**
   * Soll der Touch-Knopf zu sehen sein? Neben einer Ladesäule oder Bucht als „Jetzt laden“ (chargeHint), sonst als
   * „Ladestopp einplanen“ (kein Stopp geplant, Akku halb leer oder Warnung).
   */
  stopOffer() {
    if (!this.g.running || this.charging) return false;
    if (this.hint) return true;
    const trip = this.g.world.trip();
    // im Park selbst nicht: dort hält der Wagen ohnehin an der Säule
    if (trip.section && trip.section.kind === 'park') return false;
    return trip.stop < 0 && trip.post < 0 && (this.g.player.battery <= 50 || this.warned > 0);
  }

  /**
   * Ladeplatz neben dem Wagen ({ sec, park, post, name }, plan.js Arrival.chargeSpot) oder null: nicht in einer Szene
   * (Folge, Ladestopp, Halt am Brunnen). Ein Funkloch stört nicht: Sonst plante L dort einen Stopp oder striche ihn.
   */
  chargeOffer() {
    if (!this.g.running || this.g.over || this.g.tv || this.charging || this.g.halt || !this.g.world.chargeSpot) return null;
    return this.g.world.chargeSpot(this.g.player.speed);
  }

  /**
   * Taste L neben einer Ladesäule oder Bucht (chargeOffer): Der Ladestopp beginnt hier, auch ohne Plan – steht der
   * Wagen, gleich; kriecht er noch, bremst die Welt ihn sanft zum Stand und meldet dann 'charge' (onTrip). false: hier
   * gibt es nichts zu laden (dann plant L den nächsten Stopp).
   */
  chargeHere() {
    if (!this.chargeOffer()) return false;
    this.g.ui.dropKey('ladenHier');
    const e = this.g.world.charge(this.g.player.speed);
    if (e) this.start(e);
    return true;
  }

  /**
   * Ladestopp einplanen (Reise; Taste L, Touch-Knopf „Ladestopp einplanen“): Der nächste Ladeplatz auf dem Weg wird
   * Zwischenziel – ein Ladepark (das Navi führt hinein und danach weiter zum Ziel) oder die Ladesäule eines Orts, durch
   * den der Weg führt (der Wagen hält dort). Ein zweiter Druck streicht den Stopp wieder.
   */
  planStop() {
    if (!this.g.running || this.charging) return;
    const A = REISE_AKKU;
    const trip = this.g.world.trip();
    if (trip.stop >= 0 || trip.post >= 0) {
      trip.setStop(-1);
      trip.setPost(-1);
      this.g.say(A.cancel, 'think', { priority: false });
      return;
    }
    const r = trip.nextRest((q) => this.reachable(q));
    if (!r) {
      this.g.say(A.noPark, 'think', { priority: false });
      return;
    }
    if (r.post >= 0) trip.setPost(r.post);
    else trip.setStop(r.park);
    this.g.ui.dropKey('ladestopp');
    this.g.stats.stopsPlanned++;
    this.g.say(fillTemplate(A.set, { park: r.name, km: kmWords(r.km) }), 'happy');
  }

  /**
   * Der Wagen steht im Ladepark oder an der Ladesäule eines Orts in der Spur hinter der freien Heldenbucht (Ereignis
   * 'charge' der Welt; e.park bzw. e.post): der Ladestopp
   * beginnt, eine kleine Szene nach dem Fahrplan von xxl/charge.js stopPlan (Sekunden ab jetzt, Spielzeit): einparken,
   * einstecken, im Zeitraffer laden, Popcorn und Bananensaft, ausstecken, ausparken. Das Spiel führt die Zeit, den Akku,
   * Chat, OMI und Spenden; main.js zeigt dazu Wagen, Kabel, Kamera (onCharge) und lässt den Wagen am Ende in die Spur
   * rollen. Ohne Szene (Node-Tests) läuft derselbe Fahrplan, der Wagen wartet bis zum Ausparken an seinem Halt.
   */
  start(e) {
    if (this.charging) return;
    const p = this.g.player;
    const plan = stopPlan(e.sec, p.s, p.x);
    this.charging = { t0: this.g.t, from: p.battery, park: e.park, post: e.post ?? -1, name: e.name, sec: e.sec, plan, said: 0 };
    this.g.routeMark('laden', e.post >= 0 ? { post: e.post } : { park: e.park });
    this.g.onCharge(this.charging);
  }

  /** Sekunden seit dem Halt im Park (Fahrplan des Ladestopps). */
  sceneT() {
    return this.charging ? this.g.t - this.charging.t0 : 0;
  }

  tickCharge() {
    const c = this.charging;
    const p = this.g.player;
    const P = c.plan;
    const t = this.g.t - c.t0;
    // übersprungen (skip): gleich so, wie der Stopp sonst endet
    if (c.skip) {
      if (!c.rolled) this.g.world.release();
      this.finishCharge();
      return;
    }
    // im Zeitraffer, solange der Stecker steckt
    const q = clamp((t - P.at(STOP.fill[0])) / (STOP.fill[1] - STOP.fill[0]), 0, 1);
    p.battery = Math.max(p.battery, c.from + (100 - c.from) * q * q * (3 - 2 * q));
    p.empty = false;
    // die schönen Momente je einmal: OMI, Popcorn, Bananensaft (eine Spende kommt nach den Regeln der Ökonomie)
    const moments = [
      [STOP.nomi, () => {
        this.g.say(fillTemplate(REISE_AKKU.start, { park: c.name }), 'happy', { scene: true });
        this.g.audio.chime();
      }],
      [STOP.pop[0] + 0.6, () => {
        this.g.eco.cheer('funny');
        this.g.burst(CHAT.popcorn, 3, 2.2);
      }],
      [STOP.juice, () => {
        this.g.stats.bananas++;
        c.juice = true;
        this.g.thrill('banana', 'Bananensaft-Pause');
        this.g.burst(CHAT.saftpause, 2, 1.6);
      }],
    ];
    while (c.said < moments.length && t >= P.at(moments[c.said][0])) moments[c.said++][1]();
    // ausparken: der Halt ist vorbei (main.js lässt den Wagen aus der Bucht in die Spur rollen)
    if (t >= P.roll && !c.rolled) {
      c.rolled = true;
      this.g.world.release();
    }
    if (t >= P.end) this.finishCharge();
  }

  /**
   * Ladestopp überspringen (main.js: jede Taste, wie in der Startszene): Er endet im nächsten Bild so, wie er sonst
   * enden würde – Akku voll, Stecker im Halter, der Wagen in der Spur; was noch nicht gesagt war, bleibt ungesagt.
   */
  skip() {
    if (this.charging) this.charging.skip = true;
  }

  finishCharge() {
    const c = this.charging;
    const p = this.g.player;
    this.charging = null;
    p.battery = 100;
    p.empty = false;
    if (!c.juice) this.g.stats.bananas++;
    this.g.stats.parkCharges++;
    this.meter = meterAkku();
    this.warned = 0;
    this.g.ui.toast('🔋 Akku voll', 'good');
    this.g.sayHeld();
    // der Zuckerschub des Bananensafts, sobald der Wagen wieder auf der Autobahn ist (im Park und auf dem Zubringer
    // gilt ohnehin ein Tempolimit)
    this.sugarDue = true;
  }
}
