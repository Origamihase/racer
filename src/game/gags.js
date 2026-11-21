// Running Gags aus dem Stream des Eigentümers vom 21.11.2026 (Herr Schönnbrun, Bezahlschranke, Verein, Code ADAM,
// Tracker, Paketsuche, „Schade Schokolade“, Mitleidskauf, Mysteryboxen): reine Regeln, ohne Grafik und ohne DOM.
//
// Der Zufall der Gags ist ein eigener (mulberry32, je Stream neu gesät): Ein Gag zieht nie aus Math.random, schreibt
// seine Zeilen direkt in den Chat (nie über Game.chat oder Game.bot – die würfeln Namen oder schieben die Uhr des
// Chats) und rührt Geld und Stimmung nur an, wo die Welt mitspielt (Schranke, Laden). So verläuft ein Stream mit den
// Gags genauso wie ohne sie – die Prüfstände mit festem Zufall (journey-, geld-, ansagen-test) bleiben, wie sie sind.
import { BOTS, SCHOENNBRUN, viewerNameAt } from '../data.js';

/** Kleiner, schneller Zufall mit Saat (wie in tools/stream-sim.mjs). */
export function mulberry32(a) {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class StreamGags {
  /** game: das Spiel (ui, later, t, …); reset() sät den Zufall neu und setzt alle Gags zurück. on = false schaltet alle ab. */
  constructor(game) {
    this.g = game;
    this.on = true;
    this.reset(1);
  }

  reset(seed) {
    this.rnd = mulberry32(seed >>> 0);
  }

  // --- Zufall der Gags ------------------------------------------------------------------------------------------
  pick(list) {
    return list[Math.floor(this.rnd() * list.length)];
  }

  chance(p) {
    return this.rnd() < p;
  }

  between(a, b) {
    return a + (b - a) * this.rnd();
  }

  /** Ein Zuschauername aus der festen Folge der Namen (data.js viewerNameAt), gewählt mit dem Zufall der Gags. */
  name() {
    return viewerNameAt(Math.floor(this.rnd() * 997));
  }

  // --- Chat --------------------------------------------------------------------------------------------------------
  /** Eine Zeile im Chat (fertig ausgefüllt), von name; gag markiert sie für die Prüfstände (die Oberfläche übergeht es). */
  say(text, name = this.name()) {
    this.g.ui.chat({ name, text, gag: true });
  }

  /** Bot James (Finanz-Bot) meldet etwas. */
  james(text) {
    const b = BOTS.james;
    this.g.ui.chat({ name: b.name, text, bot: 'james', icon: b.icon, gag: true });
  }

  /** In delay Sekunden Spielzeit (Game.later: dieselbe Warteschlange wie alles andere). */
  later(delay, fn) {
    this.g.later(delay, fn);
  }

  // --- 1. Herr Schönnbrun ------------------------------------------------------------------------------------------
  /** BrunnenTV: Kaum ist die Folge auf Sendung, grüßt der Chat Herrn Schönnbrun mit Namen – ein, zwei Zuschauer. */
  tvGreet() {
    if (!this.on) return;
    const lines = SCHOENNBRUN.gruss.slice();
    const n = this.chance(0.45) ? 2 : 1;
    for (let i = 0; i < n; i++) {
      const k = Math.floor(this.rnd() * lines.length);
      const text = lines.splice(k, 1)[0];
      const name = this.name();
      this.later(0.4 + i * this.between(0.7, 1.3), () => this.say(text, name));
    }
  }
}
