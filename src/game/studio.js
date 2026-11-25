// Das Sprachstudio: die ruhige Stimme in Mini Adams Ohr. Es liest den Chat mit und sagt, wie er drauf ist (der einzige
// Weg, auf dem die heimliche Chat-Stimmung nach außen kommt), dankt für große Spenden, macht Kassensturz und begrüßt,
// wer neu im Chat Hallo sagt. Eine eigene Klasse mit eigenem Zustand; vom Spiel (Game, game.js) liest sie nur, was
// STUDIO_HOST nennt (die Prüfstände halten die Liste ehrlich: ansagen-test).
import { CHAT, STUDIO, viewerName, fillTemplate } from '../data.js';
import { rand, chance, pick, fmtCent, fmtEuro } from '../util.js';
import { untag } from './parts/stream.js';

/**
 * Was das Studio vom Spiel liest oder aufruft (und sonst nichts): Spielzeit und Kasse, den Chat (für den Hallo-Satz
 * des Neuen), die Ökonomie (Stufe und Anlass) samt Game.causeTrue, ob ein Satz gerade stimmt (Game.fits), ob ein
 * Funkloch oder eine Szene läuft, bis wann OMI spricht, die Sprachausgabe, Töne und den Untertitel.
 */
export const STUDIO_HOST = [
  't', 'money', 'chat', 'chatLine', 'eco', 'causeTrue', 'fits', 'funkloch', 'tv', 'charging', 'voiceUntil', 'speech',
  'audio', 'ui',
];

export class Studio {
  /** g: das Spiel (Game), von dem nur STUDIO_HOST benutzt wird. */
  constructor(g) {
    this.g = g;
    this.reset(0, 0);
  }

  /**
   * Neuer Stream. due: Sekunden bis zur ersten Stimmungsansage, greetIn: bis zum ersten Neuen im Chat (Game.start
   * würfelt beide an ihrer alten Stelle zwischen den anderen Ereignis-Uhren, damit der Zufall gleich bleibt).
   * last, moodT: wann es zuletzt sprach und zuletzt die Stimmung ansagte; trend: wohin sie gerade kippte; why: der
   * zuletzt genannte Anlass; extra: was es sonst noch loswerden will (Dank, „Alter!“, Kassensturz), extraT: wann
   * zuletzt; greet: wen es gleich begrüßt; mark: die nächste runde Summe für den Kassensturz; used: welche Sätze gerade
   * erst dran waren (fresh); voices: wie viele Sätze schon (die Stimmen wechseln sich ab); until: bis wann es spricht.
   */
  reset(due, greetIn) {
    this.due = due;
    this.greetIn = greetIn;
    this.last = -99;
    this.moodT = -99;
    this.trend = null;
    this.why = null;
    this.extra = null;
    this.extraT = -99;
    this.greet = null;
    this.mark = 500;
    this.used = {};
    this.voices = 0;
    this.until = 0;
  }

  /** Die Uhren des Studios laufen mit den Ereignis-Uhren des Spiels (Game.update, gleich vor updateEvents). */
  countdown(dt) {
    this.due -= dt;
    this.greetIn -= dt;
  }

  /**
   * Die Stimmung ist deutlich umgeschlagen (Ökonomie, Ereignis 'level'; up: nach oben): Das Studio sagt es bald an,
   * frühestens eine halbe Minute nach der letzten Ansage, damit es bei einer Laune an der Kante nicht ständig hin und
   * her meldet.
   */
  turned(up) {
    this.trend = up ? 'up' : 'down';
    this.due = Math.min(this.due, Math.max(2.5, 30 - (this.g.t - this.moodT)));
  }

  /**
   * Eine Spende ging ein (Game.donate): Eine richtig große gibt das Studio gern weiter, sobald es Luft hat (die größte
   * zuerst) – und ab 100 € ruft es sofort „Alter!“, so wie das echte Sprachstudio.
   */
  donated(name, amount) {
    if (amount >= 50 && !(this.extra?.amount >= amount)) this.extra = { kind: amount >= 100 ? 'alter' : 'thanks', name, amount, until: this.g.t + 20 };
  }

  /**
   * Ist das Studio gleich dran (die Stimmungsansage in s Sekunden fällig, ein „Alter!“ wartet)? Eine Sprachdurchsage
   * lässt ihm dann den Vortritt (game/parts/ereignisse.js dsQuiet).
   */
  soon(s) {
    return this.due <= s || this.extra?.kind === 'alter';
  }

  /**
   * OMI hat das Wort (Game.say): Das Studio verstummt mitten im Satz und wartet, bis sie fertig ist – sein Untertitel
   * geht mit (wie bei jedem abgebrochenen Satz), statt nach ihrem halb gesagt wieder dazustehen.
   */
  hush() {
    const g = this.g;
    if (g.t >= this.until) return;
    this.until = g.t;
    if (/^sprachstudio/.test(g.speech.current?.voiceKey || '')) g.speech.cancelCurrent(true);
  }

  /**
   * Je Bild: Etwa einmal pro Minute und wenn die Stimmung deutlich umschlägt, sagt es, wie der Chat drauf ist – aber
   * nie, während OMI oder eine Sprachdurchsage zu hören ist. Dazwischen gibt es höchstens einmal etwas anderes weiter
   * (den Dank für eine große Spende, einen Kassensturz) und begrüßt, wer neu im Chat Hallo sagt.
   */
  update() {
    const g = this.g;
    // Kassensturz bei jeder runden Summe, und ab und zu ein Gruß an jemanden, der neu im Chat ist
    if (g.money >= this.mark) {
      const step = this.mark < 2000 ? 500 : 1000;
      this.mark = (Math.floor(g.money / step) + 1) * step;
      this.extra = this.extra || { kind: 'total', until: g.t + 30 };
    }
    if (this.greetIn <= 0) {
      this.greetIn = rand(150, 240);
      // wer neu ist, meldet sich erst im Chat – und das Sprachstudio begrüßt genau ihn, sobald es Luft hat
      if (!this.greet) {
        const name = viewerName();
        this.greet = { name, until: g.t + 40 };
        g.chat(g.chatLine(CHAT.newViewer), name);
      }
    }
    if (this.extra && g.t > this.extra.until) this.extra = null;
    if (this.greet && g.t > this.greet.until) this.greet = null;
    const x = this.extra;
    // Außer der Reihe nur mit Abstand: zur letzten Zugabe, zum letzten Satz und zur nächsten Stimmungsansage. Nur ein
    // „Alter!“ muss gleich raus, sobald niemand spricht – die Stimmungsansage wartet dann einen Moment (und hält auch
    // sonst ein paar Sekunden Abstand zum letzten Satz, etwa wenn die Stufe gleich nach einem Dank wechselt). Ein Gruß
    // wartet nicht auf die Pause zwischen den Zugaben: Der Neue hat ja schon Hallo gesagt.
    const alter = x?.kind === 'alter' && g.t - this.last > 3;
    const mood = !alter && this.due <= 0 && g.t - this.last > 8;
    const greet = !alter && !mood && this.greet && g.t - this.last > 10 && this.due > 6;
    if (!alter && !mood && !greet && !(x && g.t - this.extraT > 75 && g.t - this.last > 15 && this.due > 10)) return;
    // (in einer Szene – Folge, Ladestopp – schweigt das Studio und spricht danach)
    if (g.funkloch > 0 || g.tv || g.charging || g.t < g.voiceUntil + 0.6 || g.t < this.until || g.speech.busy || g.speech.queue.length) return;
    let text;
    if (mood) {
      // Woran es liegt, sagt es gern dazu: bei guter Laune das Schöne, bei schlechter den Kummer – und in der Mitte
      // das, was die Stimmung gerade dorthin gebracht hat.
      const lv = g.eco.level;
      const dir = lv > 2 ? 'up' : lv < 2 ? 'down' : this.trend;
      const why = dir && chance(0.75) ? g.eco.why(dir, this.why, (k) => g.causeTrue(k)) : null;
      if (lv === 2 && this.trend) text = this.fresh(STUDIO.turn[this.trend], 'turn' + this.trend);
      else text = why ? this.fresh(STUDIO.short[lv], 'short' + lv) : this.fresh(STUDIO.levels[lv], 'level' + lv);
      if (why) {
        text += ' ' + this.fresh(STUDIO.why[dir][why], dir + why);
        this.why = why;
      }
      this.trend = null;
      this.moodT = g.t;
      this.due = rand(52, 72);
    } else if (greet) {
      text = fillTemplate(this.fresh(STUDIO.greet, 'greet'), { name: this.greet.name });
      this.greet = null;
    } else {
      this.extra = null;
      this.extraT = g.t;
      if (alter) {
        text = fillTemplate(this.fresh(STUDIO.alter, 'alter'), { name: x.name, betrag: fmtCent(x.amount) });
        this.due = Math.max(this.due, 12);
      } else if (x.kind === 'thanks') text = fillTemplate(this.fresh(STUDIO.thanks, 'thanks'), { name: x.name, betrag: fmtCent(x.amount) });
      else text = fillTemplate(this.fresh(STUDIO.total, 'total'), { summe: fmtEuro(Math.floor(g.money)) });
    }
    // ein leiser Zweiklang, damit man hört, dass jetzt nicht OMI spricht
    g.audio.tone(659.25, 0.16, 'sine', 0.05);
    g.audio.tone(523.25, 0.24, 'sine', 0.05, 0.13);
    let line = null;
    const dur = g.speech.say(text.replace(/_/g, ' '), this.voice(), { onStart: (d) => (line = g.ui.studio(text, d + 0.8)), onDrop: () => line && (line.t = 0) });
    this.last = g.t;
    this.until = g.t + dur + 0.8;
  }

  /**
   * Die Stimme des nächsten Studio-Satzes: abwechselnd die Frau (sprachstudio) und der Mann (sprachstudioM) – so hört
   * man beide (speech.js studioVoices). „Wir sind live.“ zu Beginn (scenes/start.js) spricht die Frau, danach der Mann.
   */
  voice() {
    const key = this.voices % 2 ? 'sprachstudioM' : 'sprachstudio';
    this.voices++;
    return key;
  }

  /** Ein Satz aus der Liste, aber keiner der beiden zuletzt gesagten (key: je Liste ein Gedächtnis). */
  fresh(list, key) {
    const used = this.used[key] || (this.used[key] = []);
    // (nur Sätze, die gerade stimmen: FACTS – und davon einer, der nicht eben erst dran war)
    const fit = list.map((_, n) => n).filter((n) => this.g.fits(list[n]));
    const i = pick(fit.filter((n) => !used.includes(n))) ?? pick(fit);
    used.push(i);
    if (used.length > Math.min(2, list.length - 1)) used.shift();
    return untag(list[i]);
  }
}
