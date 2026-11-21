// Running Gags aus dem Stream des Eigentümers vom 21.11.2026 (Herr Schönnbrun, Bezahlschranke, Verein, Code ADAM,
// Tracker, Paketsuche, „Schade Schokolade“, Mitleidskauf, Mysteryboxen): reine Regeln, ohne Grafik und ohne DOM.
//
// Der Zufall der Gags ist ein eigener (mulberry32, je Stream neu gesät): Ein Gag zieht nie aus Math.random, schreibt
// seine Zeilen direkt in den Chat (nie über Game.chat oder Game.bot – die würfeln Namen oder schieben die Uhr des
// Chats) und rührt Geld und Stimmung nur an, wo die Welt mitspielt (Schranke, Laden). So verläuft ein Stream mit den
// Gags genauso wie ohne sie – die Prüfstände mit festem Zufall (journey-, geld-, ansagen-test) bleiben, wie sie sind.
import { BOTS, SCHOENNBRUN, GAGS, viewerNameAt, fillTemplate } from '../data.js';
import { fmtCent, fmtNum } from '../util.js';
import { schrankeOf } from '../world/xxl/schranke.js';
import { places } from '../map/graph.js';

/**
 * Die Bezahlschranke (world/xxl/schranke.js): Erst nach first Sekunden Stream, danach frühestens gap Sekunden nach der
 * letzten, spielt eine Schranke mit der Wahrscheinlichkeit play (sonst steht sie offen). Gewählt wird sie, solange
 * sie noch mehr als look Meter … (Zahlweg + room) voraus liegt; der Chat zahlt, sobald sie näher ist als near Meter
 * oder ahead Sekunden Fahrt, pay Sekunden später fällt die Münze und der Arm öffnet in open Sekunden – lange bevor
 * der Wagen dort ist (ahead > pay + open). Ohne Schranken in der Welt (world.gate fehlt, die Prüfstände) gibt es sie nicht.
 */
export const GATE = { first: 45, gap: 240, play: 0.75, look: 600, room: 30, near: 170, ahead: 5, pay: 0.8, open: 1.2, keep: 40 };

/**
 * Der Verein (GAGS.verein): gegründet found Sekunden nach Streambeginn, danach tritt alle join Sekunden jemand bei –
 * bei guter Stimmung (Economy.level 0 … 4) öfter; echo: so oft lästert der Chat danach. In einer Szene (Folge,
 * Ladestopp) wartet der nächste Beitritt wait Sekunden.
 */
export const VEREIN = { found: [70, 110], join: [35, 90], echo: 0.3, wait: 4 };

/**
 * „Nur mit Code ADAM“ (GAGS.code): Der Chat erinnert erstmals nach first, dann alle every Sekunden an den Code (in
 * einer Szene fällt die Erinnerung aus); reply: so oft antwortet jemand.
 */
export const CODE = { first: [150, 260], every: [180, 360], reply: 0.35 };

/**
 * Tracker (GAGS.tracker): Der Geo-Tracker meldet einen Ort, sobald er höchstens near Meter voraus auf dem Weg liegt –
 * mit der Wahrscheinlichkeit geo, frühestens gap Sekunden nach der letzten Meldung; das Glotzometer nennt die
 * Zuschauerzahl erstmals nach first, dann alle every Sekunden. Beide nur außerhalb der Szenen.
 */
export const TRACKER = { near: 1200, geo: 0.7, gap: 90, first: [200, 320], every: [240, 420] };

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
    // Bezahlschranke: die gerade gespielte, die nächste frühestens um gateT, entschieden ist über jede nur einmal
    this.gate = null;
    this.gateT = GATE.first;
    this.gatesSeen = new Set();
    this.gatesPaid = 0;
    // Verein: gegründet?, wann es weitergeht (Gründung, dann der nächste Beitritt), die Mitglieder (in der Reihenfolge
    // des Beitritts)
    this.verein = { founded: false, due: this.between(...VEREIN.found), members: [] };
    this.codeT = this.between(...CODE.first);
    // Tracker: der zuletzt gemeldete Ort, wann der Geo-Tracker wieder darf, wann das Glotzometer dran ist
    this.trackedKey = null;
    this.geoT = 0;
    this.glotzT = this.between(...TRACKER.first);
  }

  /** Was Abrechnung und Abspann von den Gags wissen (Game.end): { verein: { name, members } | null }. */
  report() {
    const V = this.verein;
    return { verein: V.founded ? { name: GAGS.verein.name, members: V.members.slice() } : null };
  }

  /** Einmal je Bild (Game.update). */
  update() {
    if (!this.on) return;
    if (this.g.world.gate) this.updateGate();
    this.updateVerein();
    this.updateCode();
    this.updateTracker();
  }

  /** Eine Zeile eines Vorrats, die gerade stimmt (FACTS über Game.fits), ohne Stichwort; '' wenn keine passt. */
  line(pool, vars = {}) {
    const fits = pool.filter((l) => this.g.fits(l));
    if (!fits.length) return '';
    const l = this.pick(fits);
    return fillTemplate(l.charCodeAt(0) === 91 ? l.slice(l.indexOf(']') + 2) : l, vars);
  }

  /** Der nächste Ort voraus auf dem Weg, höchstens TRACKER.near Meter entfernt: { sec, name, d } oder null. */
  nextTown() {
    const trip = this.g.world.trip();
    // (Prüfstände mit einer Fahrt ohne Abschnitte: kein Ort)
    if (!trip || !trip.cur) return null;
    const s = this.g.player.s;
    for (const sec of trip.cur.sections) {
      if (sec.kind !== 'stadt' || sec.s0 <= s) continue;
      return sec.s0 - s <= TRACKER.near && places[sec.place] ? { sec, name: places[sec.place].name, d: sec.s0 - s } : null;
    }
    return null;
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

  // --- 2. Bezahlschranke ---------------------------------------------------------------------------------------------
  updateGate() {
    const g = this.g;
    const trip = g.world.trip();
    const s = g.player.s;
    const near = Math.max(GATE.near, GATE.ahead * Math.max(0, g.player.speed));
    const gt = this.gate;
    if (gt) {
      // zu, bis die Münze fällt, dann öffnet der Arm; vorbei (oder nicht mehr auf dem Weg): sie bleibt offen stehen
      g.world.gate(gt.sec, gt.openAt === Infinity ? 0 : (g.t - gt.openAt) / GATE.open);
      if (!gt.paid && gt.s - s < near) this.payGate(gt);
      if (s > gt.s + GATE.keep || !trip.cur.sections.includes(gt.sec)) {
        g.world.gate(gt.sec, 1);
        this.gate = null;
      }
      return;
    }
    if (g.t < this.gateT || g.tv || g.charging) return;
    for (const sec of trip.cur.sections) {
      const sc = sec.s1 > s ? schrankeOf(sec) : null;
      if (!sc || sc.s - s > GATE.look) continue;
      const key = sec.place + '@' + Math.round(sec.s0);
      if (this.gatesSeen.has(key) || sc.s - s < near + GATE.room) continue;
      this.gatesSeen.add(key);
      if (!this.chance(GATE.play)) continue;
      this.gate = { sec, s: sc.s, paid: false, openAt: Infinity };
      this.gateT = g.t + GATE.gap;
      g.world.gate(sec, 0);
      return;
    }
  }

  /** Der Chat sieht die Schranke: Spam, einer zahlt (James meldet es), die Schranke öffnet, OMI kommentiert. */
  payGate(gt) {
    gt.paid = true;
    const g = this.g;
    const S = GAGS.schranke;
    const spam = S.spam.slice();
    const n = this.chance(0.5) ? 3 : 2;
    for (let i = 0; i < n; i++) {
      const text = spam.splice(Math.floor(this.rnd() * spam.length), 1)[0];
      const name = this.name();
      this.later(i * this.between(0.25, 0.45), () => this.say(text, name));
    }
    const name = this.name();
    const amount = this.pick(S.betrag);
    this.later(GATE.pay, () => {
      gt.openAt = g.t;
      this.gatesPaid++;
      g.donate(name, amount, 'die Bezahlschranke', { line: fillTemplate(S.james, { name, betrag: fmtCent(amount) }) });
    });
    this.later(GATE.pay + GATE.open + 0.6, () => g.say(S.omi, 'happy', { priority: false }));
  }

  // --- 3. Der Verein -------------------------------------------------------------------------------------------------
  updateVerein() {
    const g = this.g;
    const V = this.verein;
    if (g.t < V.due) return;
    if (g.tv || g.charging) {
      V.due = g.t + VEREIN.wait;
      return;
    }
    const G = GAGS.verein;
    // bessere Stimmung, schnellere Beitritte: bei bester Laune gut die Hälfte der Wartezeit
    const gap = () => this.between(...VEREIN.join) * (1 - 0.11 * Math.min(4, Math.max(0, g.eco?.level ?? 0)));
    if (!V.founded) {
      V.founded = true;
      this.james(G.gruendung);
      V.due = g.t + gap() * 0.5;
      return;
    }
    V.due = g.t + gap();
    const name = this.name();
    if (V.members.includes(name)) return;
    this.say(this.pick(G.beitreten), name);
    const hello = this.pick(G.willkommen);
    const echo = this.chance(VEREIN.echo) ? this.pick(G.echo) : null;
    const echoName = this.name();
    this.later(this.between(1.1, 1.8), () => {
      V.members.push(name);
      this.james(fillTemplate(hello, { name }));
      if (echo) this.later(this.between(1.2, 2.4), () => this.say(echo, echoName));
    });
  }

  // --- 4. Nur mit Code ADAM ------------------------------------------------------------------------------------------
  updateCode() {
    const g = this.g;
    if (g.t < this.codeT) return;
    this.codeT = g.t + this.between(...CODE.every);
    if (g.tv || g.charging) return;
    const C = GAGS.code;
    this.say(this.pick(C.chat));
    if (this.chance(CODE.reply)) {
      const text = this.pick(C.antwort);
      const name = this.name();
      this.later(this.between(1.2, 2.6), () => this.say(text, name));
    }
  }

  // --- 5. Geo-Tracker und Glotzometer ---------------------------------------------------------------------------------
  updateTracker() {
    const g = this.g;
    const T = GAGS.tracker;
    const scene = g.tv || g.charging;
    const next = this.nextTown();
    const key = next ? next.sec.place + '@' + Math.round(next.sec.s0) : null;
    if (key && key !== this.trackedKey) {
      this.trackedKey = key;
      if (!scene && g.t >= this.geoT && this.chance(TRACKER.geo)) {
        this.geoT = g.t + TRACKER.gap;
        const name = this.name();
        const pick = this.rnd();
        // gesagt wird, was im Moment der Zeile stimmt (der Ort kann inzwischen erreicht sein: dann nichts)
        this.later(this.between(0.6, 2.2), () => {
          const now = this.nextTown();
          const fits = T.geo.filter((l) => g.fits(l));
          if (now && fits.length) this.say(fillTemplate(fits[Math.floor(pick * fits.length)].replace(/^\[[^\]]*\] /, ''), { ort: now.name }), name);
        });
      }
    }
    if (g.t < this.glotzT) return;
    this.glotzT = g.t + this.between(...TRACKER.every);
    if (scene) return;
    const text = this.line(T.glotz, { n: fmtNum(Math.round(g.viewers)) });
    if (text) this.say(text);
  }
}
