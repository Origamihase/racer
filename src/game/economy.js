// Die Stream-Kasse einer Fahrt. Jeder Euro kommt vom Publikum: Spenden, Ortsspenden bei der Ankunft, Navi-Gebote,
// Abos und VIP, Sprachdurchsagen, Rahmen, Aktionen, Sammelaktionen und eingelöste Challenge-Versprechen.
// Fürs Fahren selbst gibt es nichts. Gutes Fahren unterhält aber den Chat – und ein gut unterhaltener Chat gibt mehr.
//
// Dahinter läuft eine heimliche Chat-Stimmung (0 = im Keller … 1 = Eskalation, 0,5 = neutral). Sie steht nirgends
// im Bild: Nach außen gibt es nur ihre Stufe (level) und den Anlass (why), und beides bekommt allein das Sprachstudio
// zu sagen und der Chat zu spüren. Der Wert selbst ist privat (#mood); peek() und poke() sind für Tests und die
// Nachrechnung in Node.
//
// Reine Logik ohne three.js und ohne DOM, mit setzbarem Zufall ({ seed }), damit sich alles reproduzieren lässt.
import { clamp, damp, mulberry32 } from '../util.js';

/** Grenzen der fünf Stimmungsstufen: 0 im Keller, 1 unruhig, 2 entspannt, 3 gut drauf, 4 bester Laune. */
const LEVEL_EDGES = [0.25, 0.42, 0.6, 0.78];
// erst wenn die Stimmung eine Grenze deutlich überschritten hat, wechselt die Stufe (sonst flattert sie an der Kante)
const LEVEL_SLACK = 0.025;
// … und sie muss dort ein paar Sekunden bleiben
const LEVEL_HOLD = 4;

// neutral: Dorthin findet die Stimmung von selbst zurück, mit dieser Zeitkonstante in Sekunden
const NEUTRAL = 0.5;
const DRIFT = 150;
// Der Eigentümer: „Die Chatstimmung ist bei Streamstart immer gut.“ So beginnt jeder Stream (Stufe 3, gut drauf).
export const MOOD_START = 0.68;
/**
 * Fortschritt zum Navi-Ziel (satisfaction.js pace: faire Sekunden je Sekunde, gegen das Tempo des Navis – auf jeder
 * Straße, auch im Ort und auf der Landstraße mit ihren Limits): Ab fair hebt er die Stimmung (up je Sekunde und
 * Einheit über fair, höchstens bis max darüber), darunter senkt er sie (down, höchstens bis min darunter). Wer im Tempo
 * des Navis fährt (p = 1), hält sie gegen das Zurücksinken zur Mitte; wer zügig ist, hebt sie deutlich (Zahlen in
 * NOTES des Ansagen-Schritts). Auf den letzten near Sekunden zum Ziel fiebert der Chat mit (nearSway je Sekunde).
 */
export const PROGRESS = { fair: 0.9, up: 0.03, down: 0.02, max: 0.5, min: -0.4, near: 90, nearSway: 0.0015 };
// So stark hängt die Spendierlaune an der Stimmung: Faktor e^(GAIN · (Stimmung − 0,5)),
// also etwa ×0,46 bei 0,2 · ×1 bei 0,5 · ×2,2 bei 0,8
const MOOD_GAIN = 2.6;
// die ersten Sekunden zählt das Tempo noch nicht: Der Stream fängt gerade erst an
const GRACE = 20;

/**
 * Was den Chat bewegt: [Stimmung, Hype, Anlass]. Hype sind Zuschauer, die für eine Weile dazukommen (klingt mit 4 %
 * pro Sekunde ab). Die Stimmung wird nahe den Enden zäh: Schönes wirkt bei bester Laune kaum noch, Ärgerliches bei
 * ohnehin mieser Stimmung auch nicht (siehe sway). Der Anlass ist das Stichwort, unter dem sich das Sprachstudio
 * merkt, warum der Chat gerade so drauf ist (siehe why).
 */
export const CHEER = {
  nearMiss: [0.06, 15, 'manoever'], // haarscharf überholt
  overtake: [0.0025, 2, 'manoever'], // überholt (jedes Fahrzeug)
  topSpeed: [0.03, 25, 'tempo'], // neue Höchstgeschwindigkeit dieser Fahrt (ab 200 km/h, in 10er-Schritten)
  arrive: [0.08, 120, 'ziel'], // Navi-Ziel erreicht
  greet: [0.05, 60, 'gruss'], // Brunnen oder Elsa angehupt
  banana: [0.012, 8], // Bananensaft
  blitzerClean: [0.015, 10, 'sauber'], // brav am Blitzer vorbei
  blitzerFlash: [0.01, 25, 'blitzer'], // geblitzt: Der Chat liebt das Foto
  cleanMinute: [0.008, 10, 'sauber'], // eine volle Minute ohne Kratzer
  laneOpen: [0.005, 40], // linke Spur freigeschaltet
  laneUsed: [0.005, 0, 'spur'], // … und sie wurde gut genutzt (beim Schließen)
  bid: [0, 12], // neues Navi-Gebot
  bidChaos: [0, 4], // Gebot im Chaos
  bidBig: [0.02, 60, 'gebot'], // großes Gebot
  funny: [0.005, 15, 'spass'], // Frosch, Kofferraum, Rahmen, Zahlen im Chat, Polizei Gifhorn, Sammelaktion geschafft
  rainStart: [0.025, 30, 'regen'], // es fängt an zu regnen
  wiperTwitch: [0.003, 3, 'regen'], // der Wischer zuckt
  record: [0.04, 0, 'rekord'], // Zuschauerrekord
  challenge: [0.015, 20, 'job'], // Job erledigt
  megafon: [0.008, 10, 'spass'],
  // und was ihn verstimmt
  scrape: [-0.03, 0, 'blech'], // Leitplanke gestreift
  scrapeHard: [-0.05, 5, 'blech'],
  crash: [-0.16, 10, 'blech'], // Rempler: Aufregung ja, gute Laune nein
  funkloch: [-0.06, 0, 'funkloch'],
  missedTarget: [-0.08, 0, 'verpasst'], // am Ziel vorbeigefahren
  laneIgnored: [-0.004, 0, 'spur'], // freigeschaltete Spur gar nicht benutzt (beim Schließen)
  fine: [-0.02, 10, 'strafe'], // Verwarngeld
};

// Stimmung pro Sekunde: zügig fahren (ab 160 km/h, voll ab 210), kriechen (unter 125, voll ab 75),
// lange hinter jemandem herzuckeln, die freigeschaltete Spur nutzen oder links liegen lassen
const PACE = { fast: 0.0095, fastFrom: 160, slow: 0.008, slowBelow: 125, stuck: 0.012, stuckAfter: 4 };
// Die linke Spur ist eine Spielerei: Eine voll genutzte Minute hebt die Stimmung zusammen mit laneUsed um gut
// 0,01 – ein Fünftel eines haarscharfen Manövers –, eine verschenkte drückt sie um ebenso wenig.
const LANE = { use: 0.00012, ignore: 0.0001 };
// Im Gedächtnis bleibt die Spur dem Chat trotzdem (er hat ja dafür gespendet): So stark zählt sie als Anlass.
const LANE_CAUSE = 0.06;
// So lange (Sekunden) bleibt ein Anlass im Gedächtnis, und so viel Stimmung muss er bewegt haben, um genannt zu werden
const CAUSE_FADE = 45;
const CAUSE_MIN = 0.02;

// Spendenbeträge in fünf Größen (die Alter-Skala lässt grüßen). Gewichte bei neutraler Stimmung und wie stark sie
// sich mit der Stimmung verschieben (Gewicht · e^(tilt · (Stimmung − 0,5))): Bei guter Laune sitzt das Geld lockerer.
// Im Mittel etwa 7 € bei 0,4 · 10 € bei 0,5 · 13 € bei 0,56 · 28 € bei 0,73 · 38 € bei 0,85 · 42 € bei 0,9.
// Ein „ALTER!“ (ab 100 €) bleibt dabei selten, bei jeder Laune unter 1 % der Spenden: Gute Laune zeigt sich
// in vielen Fünftel- bis Mittelaltern, nicht in einem Dauer-Alter. Die Mittelalter-Stufe zieht erst bei bester
// Laune richtig an, Dreiviertel-Alter gibt es fast nur dann – so verdient sehr gutes Fahren etwa das Doppelte,
// ohne dass sich am Durchschnitt viel ändert.
const TIERS = [
  { w: 0.5, tilt: -4, values: [1, 1.5, 2, 2, 2.5, 3, 3.33, 4, 4.2, 5] },
  { w: 0.32, tilt: 0, values: [5, 6, 7.77, 8, 10, 10, 11.11, 12.34, 13.37, 15] },
  { w: 0.14, tilt: 6.8, values: [17, 20, 20, 22.22, 25, 25, 30] },
  { w: 0.028, tilt: 12.5, values: [33.33, 42, 50, 50, 55.55] },
  { w: 0.002, tilt: 16, values: [66.66, 75, 75, 77.77] },
  { w: 0.006, tilt: 3.5, values: [100, 111.11, 123.45] },
];
// … und nach einem „ALTER!“ dauert es mindestens so lange (Sekunden) bis zum nächsten
const ALTER_GAP = 90;
// kleine Spende eines begeisterten Zuschauers (nach einem haarscharfen Manöver, einem Brunnen …)
const THRILL_VALUES = [1, 1.5, 2, 2, 2.5, 3, 3.33, 4.2, 5, 7.77];
/** Wie oft ein schöner Moment jemanden zum Spenden bringt (bei neutraler Stimmung). Nie ein fester Lohn. */
const THRILL = { nearMiss: 0.2, greet: 0.45, banana: 0.12, blitzerClean: 0.3, topSpeed: 0.5, cleanMinute: 0.22, wiperTwitch: 0.05 };

// Sekunden zwischen zwei Ereignissen bei 1.000 Zuschauern und neutraler Stimmung
const EVERY = { donation: [8.5, 15.5], sub: [30, 70], vip: [80, 190], sammel: [9, 20] };
// Ein großes, gut gelauntes Publikum gibt öfter – aber höchstens so viel schneller, damit der Chat lesbar bleibt
// (siehe tempo). Was darüber hinausgeht, steckt in den Beträgen.
const TEMPO_MAX = 3;

// Twitch-Abos: Stufe 1 bis 3, VIP im Live-Bereich ab 7,99 € im Monat (mancher legt freiwillig etwas drauf)
const SUB_PRICES = [4.99, 9.99, 24.99];
// die allermeisten nehmen Stufe 1
const SUB_POOL = [4.99, 4.99, 4.99, 4.99, 4.99, 4.99, 9.99, 24.99];
const GIFT_COUNTS = [1, 1, 1, 3, 3, 5, 5, 5, 10, 10, 20];
const VIP_PRICE = 7.99;
const VIP_EXTRA = [9.99, 10, 12, 15, 20];

// Navi-Gebote in Zehnern (der Eigentümer: „keine Cent-Beträge, sondern in 10€ Abständen bis in die hunderte“): im
// Chaos fast immer genau ein Zehner mehr, sonst auch mal ein kleiner Sprung, ein Duell oder ganz selten ein Gebot, das
// ein Zeichen setzen soll. Je Eintrag [Stufe der Takt-Leiter, Euro]: Nach der Takt-Leiter (bids.level, siehe nextBid)
// richtet sich die Ruhe bis zum nächsten Gebot – ihre kleinen Stufen halten den Rhythmus der Runden, wie er gemessen
// ist (tools/journey-test.mjs), gleich wie groß die Beträge werden.
const STEP = [0.01, 10];
const CHAOS_JUMPS = [[0.02, 20], [0.02, 20], [0.03, 20], [0.05, 30]];
const SMALL_JUMPS = [[0.02, 10], [0.05, 20], [0.1, 20], [0.1, 20], [0.25, 30], [0.5, 50]];
const DUEL_STEPS = [[0.1, 10], [0.5, 20], [0.5, 20], [1, 20], [1, 20], [1.5, 30], [2, 30], [2, 30], [2.5, 40], [3, 50], [5, 100]];
const BIG_BIDS = [[10, 100], [15, 150], [20, 150], [25, 200], [33.33, 250], [50, 300]];
/**
 * BontanaBack: ein seltener Großbieter, der eine Runde in großen Schritten bis in die niedrigen
 * Tausender treibt. Ab Runde from (zwei Ziele erreicht) wird je Runde einmal gewürfelt (chance), wenn ihr Chaos vorbei
 * ist – höchstens max-mal je Stream und nie in zwei Runden hintereinander. Er nimmt den Platz des ersten ruhigen Gebots
 * ein (es kommt nach derselben Ruhe) und eskaliert mit bids Geboten (die größere Zahl mit Anteil five), er und wer vorn
 * lag im Wechsel, gap Sekunden auseinander, er zuletzt: seine Schritte first, dann then Euro (in Zehnern), sein letztes
 * Gebot landet auf der nächsten mark-Marke ab floor (höchstens cap); der andere hält mit rival Euro dagegen. Die
 * Takt-Leiter steigt je Gebot um Euro / ladder: Danach ist es so lange still wie nach einem großen Gebot. Er kommt nur
 * zu einem gut gelaunten Chat (Stimmung ab mood).
 */
export const BONTANA = {
  name: 'BontanaBack',
  from: 3, chance: 0.35, max: 2, bids: [3, 5], five: 0.4, gap: [3, 5], mood: 0.6,
  first: [200, 400], then: [300, 500], mark: 500, floor: 1000, cap: 3000, rival: [10, 20, 50], ladder: 40,
};
// Die Ruhe nach einem Gebot ist für ein Ziel eine knappe Minute voraus bemessen. Echte Orte liegen aber Minuten entfernt (30 Kartenkilometer gut 4 Minuten, 100 gut 6, 250 gut 11): Dort wächst die Ruhe mit der
// Fahrzeit, die das Navi nennt – um (Fahrzeit / CALM_DRIVE) hoch CALM_GROW, also etwas langsamer als die Fahrzeit
// selbst (nahe Ziele halten eher bis zur Ankunft als ferne), und nie länger als CALM_MAX × Fahrzeit (auch nach einem
// großen Gebot schweigt der Chat nicht ewig). Die Werte sind mit tools/journey-test.mjs gemessen: Bei kleinen Geboten
// ist die Ruhe im Mittel etwa so lang wie die Fahrt – wer zügig fährt, steht bei gut der Hälfte der Ziele am
// Brunnen, bevor wieder jemand überbietet, ein gemütlicher Fahrer bei einem Drittel.
const CALM_DRIVE = 18;
const CALM_GROW = 0.8;
const CALM_MAX = 2;
// Die erste Runde eines Streams (WorldNavi.opening: bis zum ersten Halt an einem Brunnen) bietet nur auf nahe Orte,
// und nach dem Bieter-Chaos bleibt das Ziel so lange stehen, dass die meisten dort ankommen: die Fahrzeit des Navis
// mal einem Faktor aus diesem Bereich. Fährt der Wagen schon im Zielort, wartet das nächste Gebot ohnehin, bis er am
// Brunnen steht oder vorbeigerollt ist (Game.updateNavi) – die Ruhe muss also nur bis zum Ortseingang reichen.
// Gemessen mit tools/journey-test.mjs (je Fahrer 60 erste Runden zu 10 Minuten): Seit dem Zuschlag fünf Kilometer vor
// dem Brunnen (game.js AUKTION) steht der zügige und der mittlere Fahrer fast immer am Brunnen des Ziels, das stand,
// der gemütliche bei 85 %. Die Regel selbst bleibt: Ein Gebot vor dem Zuschlag nimmt die Folge weg.
const OPENING_CALM = [0.6, 1.7];
// Wem ein Gebot das erste stehende Ziel doch genommen hat, der hat die Regel gesehen – das nächste bleibt länger
// stehen, damit auch die erste Runde eines gemütlichen Fahrers an einem Brunnen endet.
const OPENING_AGAIN = [1.2, 2.4];
// Bieterfenster nach jeder Folge (windowBid): mittlere Wartezeit aufs erste Gebot in Sekunden, [fest, je (1 − Stimmung)³]
// (kubisch: Ein gut gelaunter Chat lässt einen ordentlichen Fahrer praktisch nie stehen, ein mürrischer oft)
export const WINDOW = { mean: [3, 80] };

// Sammelaktionen: Zielbeträge und was einzelne dazugeben
const SAMMEL_GOALS = [20, 25, 30, 30, 35, 40, 50];
const SAMMEL_VALUES = [2, 2.5, 3, 5, 5, 5, 7.5, 10, 10, 12];
// eine Sprachdurchsage kostet in der Regel zwei bis fünf Euro, „Linke Spur freischalten“ je nach Laune des Spenders
const DURCHSAGE_PRICES = [2, 2.5, 3, 3, 3.5, 4, 5];
const LANE_PRICES = [2.5, 3.33, 4.2, 5, 5, 10];
// Versprechen für die fünf Jobs („Wenn Mini Adam 200 fährt, spende ich …“) und für alle fünf zusammen
const PLEDGES = [15, 20, 20, 25, 25, 30, 33.33];
const PLEDGE_ALL = 100;

const cent = (v) => Math.round(v * 100) / 100;

export class Economy {
  #mood = NEUTRAL;
  // träge Stimmung: nur sie zieht an der Zuschauerzahl, damit die nicht jede Laune sofort verrät
  #slow = NEUTRAL;

  /**
   * @param {{seed?: number}} opts mit seed läuft alles reproduzierbar, ohne über Math.random
   */
  constructor({ seed } = {}) {
    this.rnd = seed === undefined ? () => Math.random() : mulberry32(seed);
    this.events = [];
    this.reset();
  }

  // --- Zufall ------------------------------------------------------------------
  rand(a, b) {
    return a + this.rnd() * (b - a);
  }

  int(a, b) {
    return Math.floor(this.rand(a, b + 1));
  }

  chance(p) {
    return this.rnd() < p;
  }

  pick(list) {
    return list[Math.floor(this.rnd() * list.length)];
  }

  // --- Fahrt ---------------------------------------------------------------------
  reset(upgrades = {}) {
    this.up = upgrades;
    this.t = 0;
    this.#mood = MOOD_START;
    this.#slow = MOOD_START;
    this.level = 2; // levelOf geht von der Stufe aus, die gerade gilt
    this.level = this.levelOf(MOOD_START);
    this.levelT = 0;
    this.hype = 0;
    // Raid (Reise, König Knolli): Leute, die eine Weile bleiben und langsam wieder gehen (raidIn)
    this.raid = 0;
    this.raidFade = 480;
    this.viewers = 240;
    this.clock = { donation: this.rand(6, 10), sub: this.rand(14, 26), vip: this.rand(30, 60), sammel: 0 };
    this.sammel = null;
    this.cleanT = 0;
    this.cleanN = 0;
    this.stuckT = 0;
    this.topKmh = 190;
    this.alterT = -ALTER_GAP;
    this.sinceArrival = 0;
    // woran es gerade liegt: je Anlass, wie viel Stimmung er zuletzt nach oben oder unten bewegt hat (verblasst)
    this.causes = { up: {}, down: {} };
    // linke Spur: wie viel der Freischaltungen genutzt wurde (gleitend, anfangs unentschieden)
    this.lane = { openT: 0, usedT: 0, share: 0.5 };
    this.bids = null;
    // BontanaBack in diesem Stream: wie oft, und in welcher Runde zuletzt
    this.bontana = { n: 0, round: -9 };
    this.newRound(true);
    this.events.length = 0;
  }

  /**
   * Stimmung verschieben. Nahe 1 wirkt Schönes kaum noch, nahe 0 Ärgerliches – so bleibt sie ohne harte Kante im
   * Rahmen. cause: Stichwort für why().
   */
  sway(d, cause) {
    const m = this.#mood;
    this.#mood = clamp(m + d * 2 * (d > 0 ? 1 - m : m), 0, 1);
    if (cause) {
      const c = d > 0 ? this.causes.up : this.causes.down;
      c[cause] = (c[cause] || 0) + Math.abs(d);
    }
  }

  /** Etwas ist passiert, das den Chat bewegt (Schlüssel aus CHEER). */
  cheer(kind, scale = 1) {
    const c = CHEER[kind];
    if (!c) return;
    if (c[0]) this.sway(c[0] * scale, c[2]);
    this.hype += c[1] * scale;
    if (kind === 'crash' || kind === 'scrape' || kind === 'scrapeHard') {
      this.cleanT = 0;
      this.cleanN = 0;
    }
  }

  /** Geld ist eingegangen (Spende, Aktion, Abo …): Das spricht sich herum und zieht Zuschauer an. */
  donated(amount) {
    this.hype += amount * 2;
  }

  /**
   * Ein schöner Moment (Schlüssel aus CHEER): Er hebt die Stimmung, und manchmal spendet ein begeisterter Zuschauer
   * dafür eine Kleinigkeit – je besser die Laune, desto eher. Einen festen Lohn gibt es nie.
   * @returns {number} Betrag der Spende oder 0
   */
  thrill(kind) {
    this.cheer(kind);
    const p = THRILL[kind] || 0;
    return this.chance(p * (0.5 + this.#mood)) ? this.pick(THRILL_VALUES) : 0;
  }

  /**
   * Neue Höchstgeschwindigkeit dieser Fahrt? Zählt ab 200 km/h in 10er-Schritten, damit nicht jedes km/h gefeiert
   * wird – 200 schafft jeder Tesla, alles darüber braucht Upgrades oder Zucker.
   * @returns {number} die neue Marke (dann lohnt ein thrill('topSpeed')) oder 0
   */
  speedMark(kmh) {
    const k = Math.round(kmh);
    if (k < this.topKmh + 10) return 0;
    this.topKmh = Math.floor(k / 10) * 10;
    return this.topKmh;
  }

  /**
   * Wie spendabel und gesprächig das Publikum gerade ist: mehr Zuschauer (mit abnehmendem Zuwachs) und bessere
   * Stimmung heißen mehr Spenden, Abos und Gebote. 1 bei 1.000 Zuschauern und neutraler Stimmung.
   */
  activity() {
    return clamp(Math.pow(this.viewers / 1000, 0.6) * Math.exp(MOOD_GAIN * (this.#mood - NEUTRAL)), 0.3, 3.5);
  }

  /**
   * So schnell laufen die Uhren für Spenden, Abos und VIP bei Aktivität a: 1 bei 1, aber nie schneller als
   * TEMPO_MAX – auch nach Stunden mit Tausenden Zuschauern soll man James noch mitlesen können.
   */
  tempo(a) {
    return (TEMPO_MAX * a) / (a + TEMPO_MAX - 1);
  }

  /**
   * @param {number} dt
   * @param {{kmh:number, limit:boolean, stuck:boolean, leftOpen:boolean, inLeft:boolean, funkloch:boolean}} d
   *   kmh Tempo · limit Tempolimit-Zone (da ist langsam fahren richtig) · stuck hinter jemandem her · leftOpen/inLeft
   *   freigeschaltete linke Spur und ob Mini Adam sie nutzt · funkloch Stream gerade weg · pace Fortschritt zum Ziel
   *   (satisfaction.js; ohne Ziel undefined) und near Sekunden Fahrt bis dorthin (PROGRESS)
   * @returns {object[]} was in diesem Schritt passiert ist: donation, sub, vip, sammel (jeweils mit amount), clean
   *   (volle Minute ohne Kratzer; amount > 0, wenn jemand dafür spendet) und level (Stimmungsstufe hat gewechselt).
   *   Das Feld wird beim nächsten Aufruf wiederverwendet.
   */
  update(dt, d) {
    const ev = this.events;
    ev.length = 0;
    this.t += dt;
    this.sinceArrival += dt;

    // --- Stimmung -----------------------------------------------------------------
    const fade = Math.exp(-dt / CAUSE_FADE);
    for (const k in this.causes.up) this.causes.up[k] *= fade;
    for (const k in this.causes.down) this.causes.down[k] *= fade;
    if (this.t > GRACE && !d.limit) {
      const fast = clamp((d.kmh - PACE.fastFrom) / 50, 0, 1.4);
      const slow = clamp((PACE.slowBelow - d.kmh) / 50, 0, 1);
      if (fast) this.sway(fast * PACE.fast * dt, 'tempo');
      if (slow) this.sway(-slow * PACE.slow * dt, 'langsam');
    }
    // Fortschritt zum Ziel (nur, solange ein Ziel gilt und gezählt wird; pace aus satisfaction.js)
    if (Number.isFinite(d.pace)) {
      const P = PROGRESS;
      const q = clamp(d.pace - P.fair, P.min, P.max);
      if (q > 0) this.sway(q * P.up * dt, 'tempo');
      else if (q < 0) this.sway(q * P.down * dt, 'langsam');
      if (d.near < P.near && q >= 0) this.sway(P.nearSway * dt, 'nah');
    }
    if (d.stuck) {
      this.stuckT += dt;
      if (this.stuckT > PACE.stuckAfter) this.sway(-PACE.stuck * dt, 'stau');
    } else this.stuckT = 0;
    if (d.leftOpen) {
      const L = this.lane;
      L.openT += dt;
      if (d.inLeft) {
        L.usedT += dt;
        this.sway(LANE.use * dt, 'spur');
      } else this.sway(-LANE.ignore * dt, 'spur');
    }
    this.#mood += (NEUTRAL - this.#mood) * (1 - Math.exp(-dt / DRIFT));
    this.#slow = damp(this.#slow, this.#mood, 1 / 30, dt);

    this.cleanT += dt;
    if (this.cleanT >= 60 * (this.cleanN + 1)) {
      this.cleanN++;
      ev.push({ type: 'clean', minutes: this.cleanN, amount: this.thrill('cleanMinute') });
    }

    const lv = this.levelOf(this.#mood);
    if (lv !== this.level) {
      this.levelT += dt;
      if (this.levelT >= LEVEL_HOLD) {
        ev.push({ type: 'level', level: lv, from: this.level });
        this.level = lv;
        this.levelT = 0;
      }
    } else this.levelT = 0;

    // --- Zuschauer -------------------------------------------------------------------
    // Wie viele es sein könnten, hängt an der Sendezeit (erst schnell, dann gemächlich), wie viele bleiben, an der
    // Stimmung; Hype kommt obendrauf. Strecke spielt keine Rolle.
    this.hype *= Math.exp(-dt * 0.04);
    this.raid *= Math.exp(-dt / this.raidFade);
    const reach = 240 + 2400 * (1 - Math.exp(-this.t / 600)) + 0.4 * this.t;
    let target = reach * (0.55 + 0.9 * this.#slow) + this.hype + 25 * Math.sin(this.t / 23) + this.raid;
    if (this.up.starlink) target *= 1.25;
    if (d.funkloch) target *= 0.8;
    // ein zufriedener Chat lockt mehr Zuschauer an (satisfaction.js audience; ohne Angabe 1)
    target *= d.audience ?? 1;
    this.viewers = damp(this.viewers, target, 0.4, dt);

    // --- Spenden, Abos, VIP: Uhren, die mit der Laune des Publikums schneller laufen ---------
    const act = this.activity();
    const pace = this.tempo(act);
    const C = this.clock;
    // Wie zufrieden der Chat ist, treibt Spenden, Abos und VIP an (satisfaction.js gain; ohne Angabe 1)
    const gain = d.gain ?? 1;
    // frischer Trubel (Hype) lockt Spender, und mit Starlink kommt ein Fünftel mehr an
    C.donation -= dt * this.tempo(act * (1 + Math.min(this.hype, 300) / 600)) * (this.up.starlink ? 1.2 : 1) * gain;
    if (C.donation <= 0) {
      C.donation = this.rand(...EVERY.donation);
      ev.push({ type: 'donation', amount: this.donationAmount() });
    }
    C.sub -= dt * pace * gain;
    if (C.sub <= 0) {
      C.sub = this.rand(...EVERY.sub);
      ev.push(this.subEvent());
    }
    C.vip -= dt * pace * gain;
    if (C.vip <= 0) {
      C.vip = this.rand(...EVERY.vip);
      ev.push({ type: 'vip', amount: this.chance(0.12) ? this.pick(VIP_EXTRA) : VIP_PRICE });
    }
    const S = this.sammel;
    if (S) {
      C.sammel -= dt * pace;
      if (C.sammel <= 0) {
        C.sammel = this.rand(...EVERY.sammel);
        const amount = this.pick(SAMMEL_VALUES);
        const before = S.sum;
        S.sum = cent(S.sum + amount);
        const done = S.sum >= S.goal;
        ev.push({ type: 'sammel', amount, sum: S.sum, goal: S.goal, half: before < S.goal / 2 && S.sum >= S.goal / 2 && !done, done });
        if (done) this.sammel = null;
      }
    }
    return ev;
  }

  levelOf(m) {
    let lv = this.level;
    while (lv < 4 && m >= LEVEL_EDGES[lv] + LEVEL_SLACK) lv++;
    while (lv > 0 && m < LEVEL_EDGES[lv - 1] - LEVEL_SLACK) lv--;
    return lv;
  }

  /**
   * Woran liegt die Laune gerade? Das Stichwort eines Anlasses, der die Stimmung zuletzt spürbar gehoben ('up') oder
   * gedrückt ('down') hat – gewürfelt nach Gewicht, damit bei mehreren Anlässen nicht immer derselbe genannt wird.
   * Stichworte nach oben: manoever, tempo, ziel, nah, gruss, sauber, blitzer, spur, gebot, spass, regen, rekord, job ·
   * nach unten: blech, langsam, stau, spur, funkloch, verpasst, strafe.
   * @param {'up'|'down'} dir
   * @param {string} [avoid] zuletzt genanntes Stichwort (kommt nur dran, wenn es das einzige ist)
   * @param {(k:string)=>boolean} [ok] stimmt der Anlass noch? (Game.causeTrue: „gleich sind wir da“ nur kurz davor)
   * @returns {string|null}
   */
  why(dir, avoid, ok = null) {
    const c = this.causes[dir];
    let keys = Object.keys(c).filter((k) => c[k] >= CAUSE_MIN && (!ok || ok(k)));
    if (keys.length > 1) keys = keys.filter((k) => k !== avoid);
    if (!keys.length) return null;
    let r = this.rnd() * keys.reduce((s, k) => s + c[k], 0);
    for (const k of keys) {
      r -= c[k];
      if (r <= 0) return k;
    }
    return keys[keys.length - 1];
  }

  // --- Beträge ---------------------------------------------------------------------
  /** Eine Spende: meist klein, manchmal ordentlich, ganz selten ein „ALTER!“. boost verschiebt zu größeren Beträgen. */
  donationAmount(boost = 0) {
    const k = this.#mood - NEUTRAL + boost;
    let total = 0;
    for (const T of TIERS) total += T.w * Math.exp(T.tilt * k);
    let r = this.rnd() * total;
    let n = 0;
    while (n < TIERS.length - 1) {
      r -= TIERS[n].w * Math.exp(TIERS[n].tilt * k);
      if (r <= 0) break;
      n++;
    }
    // ein „ALTER!“ bleibt ein Ereignis: Kurz nach dem letzten wird es eine Nummer kleiner (66 bis 78 €)
    if (n === TIERS.length - 1) {
      if (this.t - this.alterT < ALTER_GAP) n--;
      else this.alterT = this.t;
    }
    return this.pick(TIERS[n].values);
  }

  /** Ein Abo: neu, verlängert oder – bei guter Laune öfter – gleich mehrere an den Chat verschenkt. */
  subEvent() {
    const r = this.rnd();
    const price = this.pick(SUB_POOL);
    const gift = clamp(0.12 + 0.5 * (this.#mood - NEUTRAL), 0.04, 0.35);
    if (r < gift) {
      const count = this.pick(GIFT_COUNTS);
      return { type: 'sub', kind: 'gift', count, amount: cent(count * SUB_PRICES[0]) };
    }
    if (r < gift + 0.26) return { type: 'sub', kind: 'resub', months: this.int(2, 44), tier: SUB_PRICES.indexOf(price) + 1, amount: price };
    return { type: 'sub', kind: 'new', tier: SUB_PRICES.indexOf(price) + 1, amount: price };
  }

  durchsagePrice() {
    return this.pick(DURCHSAGE_PRICES);
  }

  /** Ein Raid bringt n Leute (Reise, König Knolli), die mit der Zeitkonstante fade (Sekunden) wieder gehen. */
  raidIn(n, fade = this.raidFade) {
    this.raid += n;
    this.raidFade = fade;
    this.viewers += n;
    this.cheer('record');
  }

  // --- Navi-Gebote -----------------------------------------------------------------
  /**
   * Neue Bieterrunde (Stream-Beginn oder Ziel erreicht): Es geht wieder bei 10 € los – erst einmal im Chaos. level:
   * Stand der Takt-Leiter der Runde (danach richtet sich die Ruhe), next: ihre Stufe beim zuletzt geplanten Gebot.
   */
  newRound(first = false) {
    this.round = first ? 1 : this.round + 1;
    // (gut gelaunt bieten nach einer Ankunft mehr mit, verstimmt nur wenige: bei Stimmung 0,8 etwa 7, bei 0,3 etwa 4)
    const chaos = first ? this.int(7, 11) : Math.max(1, Math.round(this.int(5, 9) * clamp(this.#mood + 0.25, 0.4, 1.2)));
    this.bids = { n: 0, chaos, duel: 0, calm: 0, quiet: false, level: 0, next: 0, bontana: 0, bontanaK: 0 };
  }

  /** Das kleinste Gebot und der kleinste Schritt: 10 €. */
  get minStep() {
    return STEP[1];
  }

  /**
   * Ein Gebot außer der Reihe (das Siegen-Gebot, game.js): Es legt den kleinsten Schritt drauf, die Takt-Leiter steigt
   * um ihre kleinste Stufe. Gibt den Schritt in Euro zurück.
   */
  extraBid() {
    this.bids.level = cent(this.bids.level + STEP[0]);
    return this.minStep;
  }

  /**
   * Das nächste Gebot: wie lange es noch dauert und um wie viel es das aktuelle überbietet.
   * Direkt nach dem Start einer Runde hagelt es Gebote. Danach gilt: Je höher der Preis, desto seltener
   * findet sich jemand, der noch einen drauflegt (jeder zahlt sein ganzes Gebot, zurück gibt es nichts). Ab und zu
   * schaukeln sich zwei im Duell hoch, ganz selten setzt jemand mit einem großen Gebot ein Zeichen; danach ist
   * erst einmal Ruhe.
   * @param {{bid:number, drive?:number, opening?:boolean}} state aktueller Preis in Euro; drive: Sekunden Fahrt bis
   *   zum neuen Ziel, wie das Navi sie kennt. Liegt das Ziel Minuten entfernt, wächst die Ruhe mit der Fahrzeit
   *   (stretch, siehe CALM_DRIVE) – wer
   *   zügig fährt, kommt so oft an, bevor wieder jemand überbietet, aber nie sicher. opening: die erste Runde des
   *   Streams läuft noch – dann richtet sich die Ruhe allein nach der Fahrzeit (OPENING_CALM, OPENING_AGAIN), und
   *   ein Duell beginnt nicht.
   *   increment ist ein Vielfaches von 10 €; die Ruhe rechnet mit der Takt-Leiter der Runde (bids.level) statt mit dem
   *   Preis in Euro.
   * @returns {{increment:number, delay:number, kind:'chaos'|'step'|'duel'|'big'|'bontana', first?:boolean, last?:boolean,
   *   stretch?:number}} first: erstes Gebot einer Runde, eines Duells bzw. BontanaBacks Auftritt · last: sein letztes
   *   Gebot · stretch: um diesen Faktor ist die Ruhe gestreckt
   */
  nextBid({ bid = 0, drive = 0, opening = false } = {}) {
    const B = this.bids;
    // das zuletzt geplante Gebot steht inzwischen: Die Takt-Leiter steigt um seine Stufe
    B.level = cent(B.level + B.next);
    const act = clamp(Math.sqrt(this.activity()), 0.75, 1.4);
    const plan = { increment: 0, delay: 0, kind: 'step' };
    let step = STEP;
    if (B.chaos > 0) {
      plan.kind = 'chaos';
      plan.first = B.n === 0;
      if (this.chance(0.14)) step = this.pick(CHAOS_JUMPS);
      // das erste lässt nach der Ankunft kurz auf sich warten, die letzten kommen schon zögerlicher
      plan.delay = B.n === 0 ? this.rand(6, 9) : this.rand(1.3, 2.8) * (B.chaos <= 2 ? 1.7 : 1);
      B.chaos--;
    } else if (B.bontana > 0) {
      // BontanaBack eskaliert: er und wer vorn lag im Wechsel, er zuletzt (BONTANA)
      plan.kind = 'bontana';
      step = this.#bontanaStep(bid, B.bontanaK++, B.bontana === 1);
      plan.delay = this.rand(BONTANA.gap[0], BONTANA.gap[1]);
      plan.last = B.bontana === 1;
      B.bontana--;
      if (B.bontana === 0) B.quiet = true;
    } else if (B.duel > 0) {
      plan.kind = 'duel';
      step = this.pick(DUEL_STEPS);
      plan.delay = this.rand(2.6, 5.5);
      B.duel--;
      if (B.duel === 0) B.quiet = true;
    } else {
      const r = this.rnd();
      const m = this.#mood;
      let quiet = false;
      if (this.#bontanaRoll(opening)) {
        plan.kind = 'bontana';
        plan.first = true;
        step = this.#bontanaStep(bid, 0, false);
        B.bontana = this.chance(BONTANA.five) ? BONTANA.bids[1] - 1 : BONTANA.bids[0] - 1;
        B.bontanaK = 1;
      } else if (r < 0.04 + 0.07 * m) {
        plan.kind = 'big';
        step = this.pick(BIG_BIDS);
        quiet = true;
      } else if (!opening && r < 0.25 + 0.21 * m) {
        // (kein Duell in der ersten Runde: Seine zwei Ziele stehen fest, während der Wagen weiterfährt – eines davon
        // läge bald hinter ihm, und dort zählen nur nahe Orte)
        plan.kind = 'duel';
        plan.first = true;
        step = this.pick(DUEL_STEPS);
        B.duel = this.int(3, 6);
      } else if (r < 0.6) step = this.pick(SMALL_JUMPS);
      plan.delay = (this.rand(0.7, 1.4) * (40 + 26 * Math.pow(B.level, 0.6)) * (B.quiet ? 1.5 : 1)) / act;
      if (opening && drive > 0) {
        const range = B.calm ? OPENING_AGAIN : OPENING_CALM;
        plan.delay = drive * this.rand(range[0], range[1]);
      } else if (drive > CALM_DRIVE) {
        plan.stretch = Math.pow(drive / CALM_DRIVE, CALM_GROW);
        plan.delay = Math.min(plan.delay * plan.stretch, Math.max(plan.delay, CALM_MAX * drive));
      }
      B.quiet = quiet;
      B.calm++;
    }
    plan.increment = step[1];
    B.next = step[0];
    B.n++;
    return plan;
  }

  /**
   * Kommt BontanaBack in dieser Runde? Nur beim ersten ruhigen Gebot einer Runde gewürfelt (BONTANA: ab Runde from,
   * höchstens max-mal je Stream, nie zwei Runden hintereinander).
   */
  #bontanaRoll(opening) {
    const T = BONTANA;
    if (opening || this.bids.calm > 0 || this.round < T.from || this.#mood < T.mood) return false;
    if (this.bontana.n >= T.max || this.bontana.round === this.round - 1 || !this.chance(T.chance)) return false;
    this.bontana.n++;
    this.bontana.round = this.round;
    return true;
  }

  /**
   * Schritt des k-ten Gebots einer BontanaBack-Runde beim Preis bid, als [Takt-Leiter, Euro]: gerade k sind seine
   * (das letzte landet auf der Marke), ungerade die Antworten dessen, der vorn lag.
   */
  #bontanaStep(bid, k, last) {
    const T = BONTANA;
    let euro;
    if (k % 2) euro = this.pick(T.rival);
    else if (last) euro = Math.max(clamp(Math.ceil((bid + T.then[0]) / T.mark) * T.mark, T.floor, T.cap) - bid, T.then[0]);
    else {
      const [a, b] = k ? T.then : T.first;
      euro = 10 * this.int(a / 10, b / 10);
    }
    return [euro / T.ladder, euro];
  }

  /**
   * Das Bieterfenster nach einer Folge (Game.updateNavi): Bietet in diesem Schritt (dt Sekunden) jemand als Erster der
   * neuen Runde? Die Rate je Sekunde ist 1 / (WINDOW.mean[0] + WINDOW.mean[1] · (1 − m)³), m die träge Stimmung (den
   * Jubel der Ankunft hat sie erst zum Teil übernommen: Es zählt, wie die Runde war). Gut gelaunt (0,8) bietet im
   * Mittel nach 4 s jemand, mittel (0,5) nach 13 s, verstimmt (0,3) nach 30 s – im Fenster (nach James' Aufruf gut
   * 23 s) bietet so bei 0,8 praktisch immer jemand, bei 0,5 zu 84 %, bei 0,3 nur zu 54 %. Wer im Fenster trödelt,
   * senkt die Stimmung weiter.
   */
  windowBid(dt) {
    return this.rnd() < dt / (WINDOW.mean[0] + WINDOW.mean[1] * (1 - this.#slow) ** 3);
  }

  /**
   * Zuschlag (Game.zuschlag, fünf Kilometer vor dem Brunnen): Ein laufendes Bieterrennen – Chaos, Duell,
   * BontanaBack – endet hier, der Rest seiner Gebote entfällt; danach ist Ruhe wie nach einem großen Gebot. Gibt
   * zurück, ob noch Gebote des Rennens ausstanden.
   */
  cutRace() {
    const B = this.bids;
    const open = B.chaos > 0 || B.duel > 0 || B.bontana > 0;
    B.chaos = 0;
    B.duel = 0;
    B.bontana = 0;
    B.quiet = true;
    return open;
  }

  /**
   * Wohin der nächste Bieter will: eins der möglichen Ziele (nie das aktuelle), gewichtet nach t.weight (Standard 1).
   * Welche Ziele zur Wahl stehen, bestimmt der Aufrufer – heute eine feste Liste, später die Orte der Karte.
   * @param {object[]} candidates
   * @param {object} [current]
   */
  pickTarget(candidates, current) {
    const list = candidates.filter((t) => t !== current);
    let r = this.rnd() * list.reduce((s, t) => s + (t.weight ?? 1), 0);
    for (const t of list) {
      r -= t.weight ?? 1;
      if (r <= 0) return t;
    }
    return list[list.length - 1];
  }

  // --- Ankunft ----------------------------------------------------------------------
  /**
   * Navi-Ziel erreicht: Der Chat feiert, und es folgt ein Schwung Ortsspenden – umso mehr, je besser die Stimmung
   * ist und je länger die Etappe gedauert hat (gezählt wird die Zeit seit der letzten Ankunft, nicht die Strecke).
   * @returns {number[]} die einzelnen Spenden
   */
  arrive({ double = false } = {}) {
    const leg = clamp(0.7 + this.sinceArrival / 400, 0.7, 1.6);
    this.cheer('arrive');
    let n = clamp(Math.round(1.5 + 3.5 * this.#mood + leg + this.rand(-0.6, 0.6)), 2, 8);
    if (double) n *= 2;
    const out = [];
    for (let i = 0; i < n; i++) out.push(this.donationAmount(0.08 * leg));
    this.sinceArrival = 0;
    this.newRound();
    return out;
  }

  // --- Linke Spur -------------------------------------------------------------------
  laneDonation() {
    return this.pick(LANE_PRICES);
  }

  /** Freigeschaltet: ab jetzt wird mitgezählt, wie viel der Zeit Mini Adam wirklich links fährt (siehe update). */
  laneOpened() {
    this.lane.openT = 0;
    this.lane.usedT = 0;
    this.cheer('laneOpen');
  }

  /**
   * Wieder gesperrt. Genutzt: Der Chat ist zufrieden, und die nächste Freischaltung kommt eher. Links liegen
   * gelassen: umgekehrt. Kleine Wirkung – die Spur bleibt eine Spielerei.
   * @param {number} freq Faktor des Shop-Artikels (kleiner = häufiger)
   * @returns {{used:number, wait:number}} genutzter Anteil 0..1 und Sekunden bis zur nächsten Freischaltung
   */
  laneClosed(freq = 1) {
    const L = this.lane;
    const used = L.openT > 0 ? clamp(L.usedT / L.openT, 0, 1) : 0;
    L.share += (used - L.share) * 0.5;
    const C = this.causes;
    if (used >= 0.5) {
      this.cheer('laneUsed', used);
      C.up.spur = Math.max(C.up.spur || 0, LANE_CAUSE);
    } else if (used < 0.15) {
      this.cheer('laneIgnored');
      C.down.spur = Math.max(C.down.spur || 0, LANE_CAUSE);
    }
    return { used, wait: this.laneWait(freq) };
  }

  laneWait(freq = 1) {
    return this.rand(50, 75) * freq * (1.3 - 0.6 * this.lane.share) * (1.2 - 0.4 * this.#mood);
  }

  // --- Sammelaktion -------------------------------------------------------------------
  /** Aktions-Bot Claudia eröffnet eine Sammelaktion; die Beiträge kommen dann über update(). */
  startSammel() {
    this.sammel = { goal: this.pick(SAMMEL_GOALS), sum: 0 };
    this.clock.sammel = this.rand(4, 9);
    return this.sammel.goal;
  }

  // --- Challenges ---------------------------------------------------------------------
  /** Versprochene Spenden für n Jobs und für alle zusammen. */
  pledges(n) {
    const list = [];
    for (let i = 0; i < n; i++) list.push(this.pick(PLEDGES));
    return { list, all: PLEDGE_ALL };
  }

  // --- nur für Tests und die Nachrechnung ------------------------------------------------
  peek() {
    return { mood: this.#mood, slow: this.#slow, level: this.level, hype: this.hype, viewers: this.viewers, activity: this.activity() };
  }

  poke(mood) {
    this.#mood = clamp(mood, 0, 1);
    this.#slow = this.#mood;
    this.level = 2;
    this.level = this.levelOf(this.#mood);
    this.levelT = 0;
  }
}
