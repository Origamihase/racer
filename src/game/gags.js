// Running Gags aus dem Stream des Eigentümers vom 21.11.2026 (Herr Schönnbrun, Bezahlschranke, Verein, Code ADAM,
// Tracker, Paketsuche, „Schade Schokolade“, Mitleidskauf, Mysteryboxen): reine Regeln, ohne Grafik und ohne DOM.
//
// Der Zufall der Gags ist ein eigener (mulberry32, je Stream neu gesät): Ein Gag zieht nie aus Math.random, schreibt
// seine Zeilen direkt in den Chat (nie über Game.chat oder Game.bot – die würfeln Namen oder schieben die Uhr des
// Chats) und rührt Geld und Stimmung nur an, wo die Welt mitspielt (Schranke, Laden). So verläuft ein Stream mit den
// Gags genauso wie ohne sie – die Prüfstände mit festem Zufall (journey-, geld-, ansagen-test) bleiben, wie sie sind.
import { BOTS, SCHOENNBRUN, GAGS, viewerNameAt, fillTemplate } from '../data.js';
import { fmtCent, fmtNum, mulberry32 } from '../util.js';
import { schrankeOf } from '../world/xxl/schranke.js';
import { places } from '../map/graph.js';
import { STREET } from '../world/kit/layout.js';

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

/**
 * Die Paketsuche (GAGS.paket): angekündigt nach first, jeder weitere Schritt step Sekunden später (in einer Szene oder
 * wenn ein Schritt gerade nicht stimmt, wait Sekunden später); in der Packstation liegt das Paket keep Sekunden, dann
 * geht es zurück; again Sekunden nach Abholung oder Rücksendung kommt das nächste. leid: so oft leidet der Chat mit.
 */
export const PAKET = { first: [300, 540], step: [120, 240], wait: 5, keep: 900, again: [900, 1500], leid: 0.6 };

/**
 * „Schade Schokolade“ (GAGS.schade): Geht etwas schief (Game: Ausfahrt verpasst, Bieterfenster bleibt leer, Rempler,
 * Blitzer), tröstet der Chat mit der Wahrscheinlichkeit chance, delay Sekunden später – höchstens alle gap Sekunden.
 */
export const SCHADE = { chance: 0.6, gap: 25, delay: [1.4, 2.8] };

/**
 * Mitleidskauf (GAGS.mitleid): Steht der Wagen in einem Ort ohne Szene stand Sekunden lang (unter kmh), und liegt rechts
 * ein kleiner Laden (GAGS.mitleid.laeden) höchstens reach Meter vor oder hinter ihm, kauft Mini Adam dort ein – in
 * jedem Ort einmal, höchstens alle gap Sekunden, nur mit genug Geld in der Kasse. Rechts: hinter side (x der Straße).
 */
export const MITLEID = { stand: 1.5, kmh: 1, reach: 9, gap: 45, side: STREET.curbR + STREET.pave - 0.5 };

/**
 * Mysterybox (GAGS.mystery): erstmals nach first, dann alle every Sekunden schenkt jemand eine (in einer Szene wait
 * Sekunden später, steht oben am Rand gerade ein Hinweis, retry Sekunden später: Sie kommt sofort dorthin; James nennt
 * den Schenker im Chat). Am Rand oben wackelt sie shake Sekunden und springt dann auf (style.css .mystery-*); der
 * Hinweis steht show Sekunden – wartet ein anderer, bleibt das Ausgepackte noch read Sekunden zu lesen (ui.js hold).
 * Löst Dringendes sie vor dem Aufspringen ab, kommt dieselbe Box noch einmal.
 */
export const MYSTERY = { first: [240, 420], every: [480, 840], wait: 10, retry: 1, shake: 1.6, read: 2.4, show: 5.5 };

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
    // Paketsuche: der nächste Schritt (−1: noch keine Sendung), wann; die Packstation ({ place, name }); der Ort, in
    // dem der Wagen zuletzt war (dort ist das Paket dann gerade); abgeholt in einer Folge, gemeldet nach ihr
    this.paket = { step: 0, due: this.between(...PAKET.first), pack: null, picked: false, n: 0 };
    this.lastTown = null;
    this.schadeT = 0;
    // Mitleidskäufe: Anzahl, Summe, wie lange der Wagen schon steht, die Orte mit Kauf, wann wieder
    this.mitleid = { n: 0, sum: 0, still: 0, towns: new Set(), next: 0 };
    // Mysteryboxen: wann die nächste kommt, wie viele es gab, eine noch ungeöffnete (unbox)
    this.boxT = this.between(...MYSTERY.first);
    this.boxes = 0;
    this.unopened = null;
  }

  /** Was Abrechnung und Abspann von den Gags wissen (Game.end): { verein: { name, members } | null, mitleid: { n, sum } }. */
  report() {
    const V = this.verein;
    const M = this.mitleid;
    return { verein: V.founded ? { name: GAGS.verein.name, members: V.members.slice() } : null, mitleid: { n: M.n, sum: Math.round(M.sum * 100) / 100 } };
  }

  /** Einmal je Bild (Game.update), dt: Sekunden seit dem letzten. */
  update(dt) {
    if (!this.on) return;
    if (this.g.world.gate) this.updateGate();
    this.updateVerein();
    this.updateCode();
    this.updateTracker();
    this.updatePaket();
    if (this.g.world.town) this.updateMitleid(dt);
    this.updateMystery();
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

  // --- 6. Das Leid mit der Paketsuche --------------------------------------------------------------------------------
  /** Ein Ort für das Paket: ein echter Ort der Karte (big: eine Großstadt für das Paketzentrum), nie der, in dem er ist. */
  somewhere(big = false) {
    const here = this.g.world.trip().section;
    const list = places.filter((p) => (!big || p.pop >= 100000) && p.i !== here.place);
    return list[Math.floor(this.rnd() * list.length)];
  }

  updatePaket() {
    const g = this.g;
    const P = this.paket;
    const G = GAGS.paket;
    const sec = g.world.trip().section;
    if (sec.kind === 'stadt' && places[sec.place]) this.lastTown = places[sec.place];
    // abgeholt: in einer Folge am Ort der Packstation; gemeldet, sobald die Folge vorbei ist
    if (P.pack && g.tv && g.tv.place === P.pack.place) P.picked = true;
    if (P.picked && !g.tv) {
      this.james(fillTemplate(G.abgeholt, { stadt: P.pack.name, inhalt: this.pick(G.inhalt) }));
      const text = this.pick(G.jubel);
      const name = this.name();
      this.later(this.between(1, 2), () => this.say(text, name));
      P.n++;
      Object.assign(P, { step: 0, due: g.t + this.between(...PAKET.again), pack: null, picked: false });
      return;
    }
    if (g.t < P.due) return;
    if (g.tv || g.charging) {
      P.due = g.t + PAKET.wait;
      return;
    }
    if (P.pack) {
      // zu lange in der Packstation: zurück an den Absender, später eine neue Sendung
      this.say(G.zurueck, G.fuchs);
      Object.assign(P, { step: 0, due: g.t + this.between(...PAKET.again), pack: null });
      return;
    }
    let text = G.schritte[P.step];
    if (!g.fits(text)) {
      P.due = g.t + PAKET.wait;
      return;
    }
    text = text.replace(/^\[[^\]]*\] /, '');
    if (P.step === 1) text = fillTemplate(text, { stadt: this.somewhere(true).name });
    // das Paket ist immer dort, wo der Wagen gerade war
    if (P.step === 2) text = fillTemplate(text, { stadt: (this.lastTown && this.lastTown.i !== sec.place ? this.lastTown : this.somewhere()).name });
    if (P.step === 4) {
      // die Packstation steht am Navi-Ziel (ohne Ziel: irgendwo)
      const t = g.navi?.target;
      P.pack = t ? { place: t.place, name: t.name } : (({ i, name }) => ({ place: i, name }))(this.somewhere());
      text = fillTemplate(text, { stadt: P.pack.name });
    }
    this.say(text, G.fuchs);
    P.due = g.t + (P.step === 4 ? PAKET.keep : this.between(...PAKET.step));
    P.step++;
    if (this.chance(PAKET.leid)) {
      const leid = this.pick(G.leid);
      const name = this.name();
      this.later(this.between(1.2, 3), () => this.say(leid, name));
    }
  }

  // --- 7. Schade Schokolade ------------------------------------------------------------------------------------------
  /** Etwas ist schiefgegangen (kind: ausfahrt, fenster, rempler, blitzer): vielleicht tröstet der Chat. */
  fail(kind) {
    const g = this.g;
    if (!this.on || g.t < this.schadeT || !this.chance(SCHADE.chance)) return;
    this.schadeT = g.t + SCHADE.gap;
    const text = this.pick(GAGS.schade);
    const name = this.name();
    this.later(this.between(...SCHADE.delay), () => this.say(text, name));
  }

  // --- 8. Mitleidskauf -----------------------------------------------------------------------------------------------
  /** Der kleine Laden rechts neben dem Wagen in der Ortsdurchfahrt sec (Plan des Orts, x wie die Straße, z = −u) oder null. */
  shopAt(sec, u) {
    const town = this.g.world.town(sec);
    if (!town || !town.plan) return null;
    return town.plan.items.find((it) => GAGS.mitleid.laeden[it.name] && it.x > MITLEID.side && Math.abs(-it.z - u) <= MITLEID.reach) || null;
  }

  updateMitleid(dt) {
    const g = this.g;
    const M = this.mitleid;
    if (g.player.kmh >= MITLEID.kmh || g.tv || g.charging || g.halt || g.navi.stopping || g.world.stopping()) {
      M.still = 0;
      return;
    }
    M.still += dt;
    if (M.still < MITLEID.stand || g.t < M.next) return;
    const sec = g.world.trip().section;
    const key = sec.place + '@' + Math.round(sec.s0);
    if (sec.kind !== 'stadt' || M.towns.has(key)) return;
    const shop = this.shopAt(sec, g.player.s - sec.s0);
    if (!shop) return;
    const [where, things, [lo, hi]] = GAGS.mitleid.laeden[shop.name];
    const what = this.pick(things);
    const amount = Math.round(this.between(lo, hi) * 10) / 10;
    M.towns.add(key);
    M.next = g.t + MITLEID.gap;
    if (g.money < amount) return;
    // bezahlt aus der Kasse des Streams: eine Zeile der Abrechnung (bei den Abzügen), die Stimmung steigt
    g.money -= amount;
    g.breakdown['Mitleidskäufe'] = (g.breakdown['Mitleidskäufe'] || 0) - amount;
    M.n++;
    M.sum += amount;
    g.ui.money(-amount, 'Mitleidskauf');
    g.ui.toast(`🛍️ Mitleidskauf ${where}: ${what} · −${fmtCent(amount)}`, 'good', 'mitleid');
    g.audio.coin();
    g.eco.cheer('mitleid');
    const lines = GAGS.mitleid.chat.slice();
    for (let i = 0, n = this.chance(0.5) ? 2 : 1; i < n; i++) {
      const text = lines.splice(Math.floor(this.rnd() * lines.length), 1)[0];
      const name = this.name();
      this.later(this.between(0.8, 1.6) + i * this.between(0.8, 1.4), () => this.say(text, name));
    }
  }

  // --- 9. Mysterybox -------------------------------------------------------------------------------------------------
  updateMystery() {
    const g = this.g;
    if (g.t < this.boxT) return;
    if (g.tv || g.charging) {
      this.boxT = g.t + MYSTERY.wait;
      return;
    }
    // sie kommt sofort an den Rand oben (dann passt das Pling zum Aufspringen), also erst, wenn dort nichts steht
    if (g.ui.noticeBusy?.()) {
      this.boxT = g.t + MYSTERY.retry;
      return;
    }
    // eine Box, die Dringendes vor dem Aufspringen abgelöst hat: dieselbe noch einmal (geschenkt ist sie schon)
    if (this.unopened) {
      const b = this.unopened;
      this.unopened = null;
      this.boxT = b.nextT;
      this.unbox(b);
      return;
    }
    this.boxT = g.t + this.between(...MYSTERY.every);
    this.boxes++;
    const M = GAGS.mystery;
    const name = this.name();
    const [kind, what] = this.pick(M.inhalt);
    // wer sie schenkt, sagt James im Chat, und der Chat fiebert mit; dann wird ausgepackt
    this.james(fillTemplate(M.james, { name }));
    const hype = this.pick(M.chat);
    const hypeName = this.name();
    this.later(this.between(0.3, 0.9), () => this.say(hype, hypeName));
    this.unbox({ name, kind, what, after: this.pick(M.danach), afterName: this.name(), afterT: this.between(1, 2) });
  }

  /**
   * Die Box b ({ name: wer sie schenkt, kind, what, after, afterName, afterT }) am Rand oben: Sie wackelt, springt mit
   * einem Pling auf, dann steht da, was drin war (die Teile: style.css .mystery-*), und der Chat reagiert. Löst
   * Dringendes sie vor dem Aufspringen ab, plingt nichts, und dieselbe Box kommt wieder, sobald der Rand frei ist.
   */
  unbox(b) {
    const g = this.g;
    const n = g.ui.toast(`🎁 Mysterybox: ${b.what}`, 'good', 'mystery', [['🎁', 'mystery-box'], [' Mysterybox: '], [b.what, 'mystery-what']]);
    // (ui.js toast gibt den Hinweis zurück: Er steht länger als andere, und was danach kommt, wartet, bis das
    // Ausgepackte zu lesen war – nur Dringendes nicht)
    const box = n && typeof n === 'object' ? n : null;
    if (box) {
      box.t = MYSTERY.show;
      box.hold = MYSTERY.shake + MYSTERY.read;
    }
    let open = !box;
    this.later(MYSTERY.shake, () => {
      if (box && box.gone) {
        this.unopened = { ...b, nextT: this.boxT };
        this.boxT = g.t + MYSTERY.retry;
        return;
      }
      open = true;
      g.audio.pling();
      if (b.kind === 'sound') this.later(0.35, () => g.audio.pling());
      if (b.kind === 'konfetti') g.cockpit.addConfetti?.(30);
    });
    // der Witz selbst: vom Schenker, gleich nach dem Auspacken; dann sagt der Chat etwas dazu
    if (b.kind === 'witz') {
      this.later(MYSTERY.shake + 0.6, () => {
        if (open) this.say(GAGS.mystery.witz, b.name);
      });
    }
    this.later(MYSTERY.shake + b.afterT, () => {
      if (open) this.say(b.after, b.afterName);
    });
  }
}
