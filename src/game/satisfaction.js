// Zufriedenheit des Chats auf der Reise (0 … 100; das HUD zeigt sie nie, sie wirkt nur). Der Eigentümer: „Je
// schneller man von Ziel zu Ziel ist, desto zufriedener ist der Chat. Die Zufriedenheit des Chats beeinflusst
// natürlich auch das Finanzielle.“
//
// Gemessen wird nicht die Strecke, sondern der Fortschritt gegen eine faire Zeit: R ist die Fahrzeit zum Ziel, wie
// das Navi sie im eigenen Tempo rechnet (trip.reach().secs: Autobahn 38 m/s, Landstraße 24, Rampe 21, Ort 13). Wer im
// Navi-Tempo fährt, gewinnt je Sekunde genau eine faire Sekunde (p = 1); wer schneller ist, mehr. So zählt eine lange
// Runde nicht gegen den Fahrer – nur, wie zügig er sie fährt.
//
// - Gezählt wird nur, solange ein Ziel gilt und der Wagen nicht am Brunnen (BrunnenTV, Halt) oder an der Säule steht.
// - Ein Sprung von R (neues Gebot, Ladestopp, Sprung im Debug) ist ein neuer Plan und zählt nicht – außer direkt nach
//   einer falschen Ausfahrt: Dann ist es der Umweg, und der kostet faire Sekunden.
// - Laufend: dS/dt = rate · clamp(p − fair, lo, hi) + (home − S) / homeTau, p über tau Sekunden geglättet; wer mit
//   Ziel länger als standAfter Sekunden steht, verliert zusätzlich stand je Sekunde. fair liegt unter 1: Das Tempo des
//   Navis ist auf Straßen mit Limit (Ort 50, Rampe 80, Landstraße 100) kaum zu überbieten – wer es hält, fährt gut.
// - Am Ziel: q = gewonnene / gezählte Sekunden der Runde (ab minT gezählten): ΔS = clamp(k · (q − 1), lo, hi) + bonus.
// - Falsche Ausfahrt mit Ziel: sofort detour.
// Gleichgewicht ohne Ankünfte: S = home + rate · homeTau · (p − fair), also etwa 78 bei p = 1,05, 90 bei 1,15, 60 bei
// 0,9 und 36 bei 0,7. Der Stream beginnt gut gelaunt (start, der Eigentümer: „bei Streamstart immer gut“).
//
// Wirkung (game.js): Spenden-, Abo- und VIP-Uhren laufen mit gain (0,6 … 1,4; 1 bei S = 50), die Zuschauerzahl strebt
// audience (0,85 … 1,15) mal so viele an, und der Chat klingt danach (CHAT.flott, CHAT.schneller).
// Reine Logik ohne DOM und ohne Zufall.
import { clamp } from '../util.js';

export const ZUFRIEDEN = {
  start: 72,
  tau: 20, rate: 0.2, fair: 0.9, lo: -1, hi: 0.6, home: 60, homeTau: 600,
  stand: 0.25, standAfter: 12, standKmh: 3,
  arrive: { k: 30, lo: -10, hi: 12, bonus: 3, minT: 30 },
  detour: -4,
  // eine Folge BrunnenTV (beim Ruf): Der Chat ist glücklich, auch wenn die Runde nicht die schnellste war
  tv: 5,
  // Wirkung: Geld (Uhren) und Zuschauer, je bei S = 0 und S = 100
  gain: [0.6, 1.4], audience: [0.85, 1.15],
  // Ton des Chats: ab happy klingt er zu share fröhlich-flott, bis grumpy zu share ungeduldig
  happy: 70, happyShare: 0.2, grumpy: 35, grumpyShare: 0.25,
};

export class Satisfaction {
  constructor(start = ZUFRIEDEN.start) {
    this.reset(start);
  }

  reset(start = ZUFRIEDEN.start) {
    this.value = start;
    this.pace = 1; // geglätteter Fortschritt p (faire Sekunden je Sekunde)
    this.prev = null; // R im letzten gezählten Bild
    this.fair = 0; // gewonnene faire Sekunden der Runde (F)
    this.time = 0; // gezählte Sekunden der Runde (T)
    this.standT = 0;
    this.wrong = false; // eine falsche Ausfahrt war gerade: der nächste Sprung ist der Umweg
    this.q = 1;
    return this;
  }

  /** Faktor für Spenden, Abos und VIP: 0,6 bei 0, 1 bei 50, 1,4 bei 100. */
  get gain() {
    return lerp(ZUFRIEDEN.gain, this.value / 100);
  }

  /** Faktor für die Zuschauerzahl, die der Stream anstrebt. */
  get audience() {
    return lerp(ZUFRIEDEN.audience, this.value / 100);
  }

  /**
   * Ein Bild. secs: Fahrzeit des Navis zum Ziel (Infinity ohne Ziel) · counted: zählt dieses Bild (Ziel gilt, kein
   * Halt am Brunnen, keine Säule) · kmh: Tempo des Wagens.
   */
  update(dt, { secs, counted, kmh }) {
    const Z = ZUFRIEDEN;
    if (!counted || !Number.isFinite(secs)) {
      this.prev = Number.isFinite(secs) ? secs : null;
      this.standT = 0;
      return this.value;
    }
    let gained = this.prev === null ? 0 : this.prev - secs;
    this.prev = secs;
    if (Math.abs(gained) > 1 + 10 * dt) {
      // neuer Plan – oder der Umweg nach einer falschen Ausfahrt
      if (!this.wrong) gained = 0;
      this.wrong = false;
    }
    this.fair += gained;
    this.time += dt;
    this.pace += (gained / dt - this.pace) * (1 - Math.exp(-dt / Z.tau));
    this.standT = kmh < Z.standKmh ? this.standT + dt : 0;
    let d = Z.rate * clamp(this.pace - Z.fair, Z.lo, Z.hi) + (Z.home - this.value) / Z.homeTau;
    if (this.standT > Z.standAfter) d -= Z.stand;
    this.value = clamp(this.value + d * dt, 0, 100);
    return this.value;
  }

  /** Falsche Ausfahrt mit Ziel: Der Chat stöhnt sofort, und der Umweg zählt (der nächste Sprung von R). */
  detour() {
    this.wrong = true;
    this.value = clamp(this.value + ZUFRIEDEN.detour, 0, 100);
  }

  /** Eine Folge BrunnenTV: Der Chat freut sich (ZUFRIEDEN.tv). Gibt die Änderung zurück. */
  brunnenTV() {
    const before = this.value;
    this.value = clamp(this.value + ZUFRIEDEN.tv, 0, 100);
    return this.value - before;
  }

  /** Ziel erreicht: Die Runde zählt als Ganzes (q), dann beginnt die nächste. Gibt die Änderung zurück. */
  arrive() {
    const A = ZUFRIEDEN.arrive;
    const q = this.time >= A.minT ? this.fair / this.time : 1;
    this.q = q; // das Urteil der letzten Runde (Game.onArrive: Trödeladam)
    const before = this.value;
    this.value = clamp(this.value + clamp(A.k * (q - 1), A.lo, A.hi) + A.bonus, 0, 100);
    this.fair = 0;
    this.time = 0;
    this.prev = null;
    return this.value - before;
  }
}

const lerp = ([a, b], f) => a + (b - a) * clamp(f, 0, 1);
