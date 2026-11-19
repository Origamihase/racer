// Eine Fahrt: Regie für alle Ereignisse (linke Spur, Navi-Gebote, Regen, Blitzer, Polizei Gifhorn,
// Sprachdurchsagen, Rahmen, Funkloch, Zuschauer, Spenden, Jobs) und die Abrechnung am Ende.
// Geld kommt nur vom Publikum: Die Stream-Kasse und die heimliche Chat-Stimmung rechnet economy.js.
import {
  CHAT, BOTS, BOARD, DURCHSAGEN, DURCHSAGEN_REGEN, RAHMEN, VOICES, JOB_TEMPLATES, INCOME, SPENDEN_ZWECKE, AKTIONEN,
  MEGAFON_WUENSCHE, SAMMELAKTIONEN, STUDIO, NAVI_TARGETS, viewerName, fillTemplate, alterReaction, berufFor, fmtBetrag,
} from '../data.js';
import { clamp, rand, randInt, chance, pick, shuffle, damp, fmtCent, fmtEuro, fmtNum, fmtClock } from '../util.js';
import { Player, KMH } from './player.js';
import { damageLine } from './damage.js';
import { Navi, shortName } from './navi.js';
import { Economy } from './economy.js';
import { Vector3 } from 'three';
import { EYE } from '../cockpit/cockpit.js';
import { ELSA_STATUE } from '../world/scenery.js';
import { curvePoint } from '../curve.js';

const POLICE_TEXTS = ['POLIZEI GIFHORN', 'GUTE FAHRT, ADAM!', 'GIFHORN GRÜSST', 'BITTE LÄCHELN'];
// „5 Cent, wenn du …“: Nur bei einem Teil der Angebote (LAGE_SHARE) achtet der Chat auf die Lage, die übrigen kommen
// aus dem großen Vorrat – sonst gäbe es fast nur Regen- und Brunnen-Angebote, denn eins von beiden ist fast immer.
// Passt eins zur Lage, darf es kommen, sobald die Uhr weniger als so viele Sekunden zeigt: Ein Ziel, ein Brunnen
// oder Elsa sind nur kurz da und selten, ein Laster, Regen oder eine lange Gerade öfter.
const LAGE_SHARE = 0.4;
const OFFER_EARLY = { ziel: 100, brunnen: 100, elsa: 100, laster: 50, regen: 50, gerade: 40 };
// Lange Gerade: Die Krümmung unter dem Wagen (aus dem Kurs, siehe course.js) bleibt so klein, dass die Straße auf
// 200 m höchstens 1 m zur Seite läuft, und das schon so viele Meter lang. Auf dem klassischen Kurs ist die Hälfte der
// Geraden kürzer als 300 m; so zählt etwa ein Fünftel der Strecke als lange Gerade.
const STRAIGHT_KAPPA = 1 / 20000;
const STRAIGHT_RUN = 400;
// Rechts oben deckt der Innenspiegel aus Mini Adams Sicht ab etwa 17,8° rechts der Blickrichtung ab
// (auf dem Handy hochkant endet dort fast schon das Bild): bis 16° steht Elsa frei in der Scheibe.
const ELSA_VIEW = (16 * Math.PI) / 180;
// Elsas Kopf an der Statue (Maßstab 1): Kronenspitze, Kinn und halbe Kopfbreite in Metern
const ELSA_HEAD = { top: 5.65, chin: 3.1, half: 1.3 };
const elsaTmp = new Vector3();
// Wie flott der Chat schreibt, je nach Stufe der heimlichen Chat-Stimmung (0 im Keller … 4 bester Laune)
const CHAT_PACE = [1.3, 1.12, 1, 0.92, 0.85];

export class Game {
  /**
   * @param {object} ctx traffic, scenery, road, sky, rain, windshield, cockpit, audio, speech, ui, fx, pickups
   */
  constructor(ctx) {
    Object.assign(this, ctx);
    this.player = new Player();
    this.navi = new Navi(this.scenery);
    // Stream-Kasse samt heimlicher Chat-Stimmung, und was sie in jedem Schritt vom Fahren wissen will
    this.eco = new Economy();
    this.ecoIn = { kmh: 0, limit: false, stuck: false, leftOpen: false, inLeft: false, funkloch: false };
    this.seenAhead = new WeakSet();
    // Entfernung zum Navi-Ziel ab der Schilderbrücke (die wird gut 1,7 km voraus gebaut). Was jede Brücke als Navi-Ziel
    // zeigt (Schildposition → Ziel oder null), merkt sich gantryShown – so weiß changeNavi, ob es neu beschriften muss.
    this.gantryShown = new Map();
    this.scenery.gantryInfo = (sSign = this.player.s) => {
      const info = this.gantryNavi(sSign);
      this.gantryShown.set(sSign, info);
      return info;
    };
    this.running = false;
    this.over = null;
    // XXL-Welt: abseits der Autobahn ruhen Ereignisse, die nur dort Sinn ergeben (setzt main.js jedes Bild)
    this.offAutobahn = false;
    // Mini Adams Mimik (main.js hängt sich ein): onMood(name, Stärke 0 … 1) bei Spenden, Schreck, Rempler, Ziel …
    this.onMood = () => {};
  }

  // ------------------------------------------------------------------------
  start(save) {
    this.save = save;
    const up = save.upgrades || {};
    this.up = up;
    const p = this.player;
    p.reset(up);
    this.t = 0;
    this.money = 0;
    this.breakdown = {};
    this.over = null;
    this.running = true;
    this.queue = [];
    // Begrüßung und Gong beim Kameraschwenk gibt es in jeder Fahrt
    this._greeted = false;
    this._introChime = false;
    this.clock = 18 * 60;
    this.eco.reset(up);
    this.viewers = this.eco.viewers;
    this.peakViewers = 240;
    this.recordShown = false;
    this.lastHorn = -99;
    this.megafonCd = 0;
    this.chatT = 1.5;
    this.chatSeen = [];
    // wann zuletzt eine Gutschrift aufgeblitzt ist, die Leitplanke gekratzt hat, NOMI das Navi angesagt hat
    this.popT = -9;
    this.scrapeT = -9;
    this.naviSaidT = -99;
    // Verkehr aus Sicht des Chats: hängt Mini Adam hinter jemandem fest? (siehe watchTraffic)
    this.trafficT = 0;
    this.stuck = false;
    this.stuckChatT = 0;
    // Stimmen: bis wann NOMI oder eine Durchsage zu hören ist und bis wann das Sprachstudio (Spielzeit)
    this.voiceUntil = 0;
    this.studioUntil = 0;
    // Sprachstudio: wann es zuletzt gesprochen und zuletzt die Stimmung angesagt hat, wohin sie gerade gekippt ist
    // (trend), der zuletzt genannte Anlass (why), was es sonst noch loswerden will (extra), wen es gleich begrüßt
    // (greet), die nächste runde Summe für den Kassensturz (mark) und welche Sätze gerade erst dran waren (used)
    this.studio = { last: -99, moodT: -99, trend: null, why: null, extra: null, extraT: -99, greet: null, mark: 500, used: {} };
    this.sammel = null;
    this.duel = null;
    // für den Abspann: die größte Spende, wer wie viele Abos verschenkt hat und wer neu VIP geworden ist
    this.fans = { top: null, gifts: {}, vips: [] };
    this.stats = {
      leftLaneTime: 0, naviReached: 0, nearMisses: 0, maxSpeedKmh: 0, bananas: 0, cleanDistance: 0, naviChanges: 0,
      maxViewers: 0, charges: 0, distance: 0, blitzerClean: 0, rainDistance: 0, crashes: 0, koriander: 0, fines: 0,
      wipes: 0, twitches: 0, photos: 0, donations: 0, subs: 0, vips: 0, topBid: 0, overtakes: 0,
    };
    // Für jeden der fünf Jobs hat jemand im Chat eine Spende versprochen – und einer für alle zusammen
    const pledges = this.eco.pledges(5);
    this.jobs = shuffle(JOB_TEMPLATES).slice(0, 5).map((j, i) => ({ ...j, done: false, progress: 0, pledger: viewerName(), pledge: pledges.list[i] }));
    this.allJobs = { pledger: viewerName(), pledge: pledges.all };
    this.allJobsPaid = false;

    // Linke Spur (dur: so lange bleibt sie nach einer Freischaltung offen · freq: Faktor für die Pause danach – so
    // gewählt, dass sie mit dem Shop-Artikel länger offen ist und trotzdem etwas öfter freigeschaltet wird)
    const ls = up.linksspur || 0;
    this.left = { open: false, timer: 0, dur: 60 + 10 * ls, next: rand(22, 30), warned: false, glow: 0, rg: 0, grace: 0, freq: 1 - 0.3 * ls, idle: 0, teased: 0, donor: '' };
    // Wetter: der erste Schauer kommt erst nach einem trockenen Start (cool, siehe updateWeather)
    this.weather = { level: 0, target: 0, active: false, dur: 0, cool: rand(100, 140), announced: false, twitches: 0, laughT: 0, sky: 0, front: 0, next: 0, calm: 0, crashes: 0 };
    // Ereignis-Uhren (Sekunden) und Strecken-Marken (Meter); das erste Navi-Gebot plant die Stream-Kasse (siehe unten)
    this.T = {
      bid: 0, durchsage: rand(28, 40), rahmen: rand(70, 100), funkloch: rand(110, 170), frog: rand(160, 260),
      trunk: rand(120, 200), numbers: rand(80, 130), police: rand(200, 300), wiperChat: 0, sammel: rand(75, 110),
      studio: rand(26, 34), greet: rand(100, 170), cent5: rand(100, 160),
    };
    // „5 Cent, wenn du …“: welche Angebote in diesem Stream schon kamen (keins doppelt), wer zuletzt geboten hat, wie
    // lange die Straße schon geradeaus läuft (Meter) und wann zuletzt ein Ziel erreicht wurde (für Angebote zur Lage)
    this.cent5 = { used: new Set(), name: '', straightS: 0, arrivedT: -99, lage: chance(LAGE_SHARE) };
    this.S = {
      blitzer: rand(3000, 3800), elefant: rand(3200, 4200), landmark: rand(1400, 2000), charge: rand(700, 1000),
      banana: rand(1100, 1500), koriander: rand(2200, 2800),
    };
    this.blitzer = null;
    this.landmark = null;
    this.funkloch = 0;
    this.policeCar = null;
    this.shoulderWarned = false;
    this.batteryWarned = 0;
    this.lastHugo = 0;

    this.scenery.reset();
    this.gantryShown.clear();
    this.navi.reset(0);
    // die erste Bieterrunde: Kaum läuft der Stream, hagelt es Cent-Gebote
    this.bidPlan = this.eco.nextBid({ bid: this.navi.bid });
    this.T.bid = this.bidPlan.delay;
    this.roundNew = false;
    this.traffic.reset();
    this.traffic.populate(0, p.speed);
    this.pickups.reset();
    this.speech.stopAll();
    this.windshield.clear();
    this.windshield.setRain(0);
    this.windshield.setFirmware(up.wischer || 0);
    this.windshield.setAuto(true);
    this.windshield.onEvent = (type) => this.onWiper(type);
    this.cockpit.clearConfetti();
    this.cockpit.setElsa(!!up.elsa);
    this.ui.reset?.();
    this.ui.jobs(this.jobs);
    this.bot('hugo', 'Der Stream läuft! Viel Spaß beim Zuschauen.');
    this.later(1.2, () => this.chat('Hallo Mini Adam ❤'));
    this.later(2.0, () => this.chat('Wohin fahren wir heute?'));
    this.later(3.2, () => this.bot('james', `Startgebot: ${fmtCent(this.navi.bid)} – Ziel: ${this.navi.target.name}`));
    // die Challenges des Abends: Wer was verspricht, steht im Chat
    this.jobs.forEach((j, i) => this.later(10 + i * 11 + rand(0, 5), () => {
      if (!j.done) this.chat(fillTemplate(pick(CHAT.pledge), { wenn: j.wenn, betrag: fmtBetrag(j.pledge) }), j.pledger);
    }));
    this.later(68, () => {
      if (!this.allJobsPaid) this.chat(`Und wenn du alle fünf Jobs schaffst, lege ich ${fmtBetrag(this.allJobs.pledge)} drauf! 🏆`, this.allJobs.pledger);
    });
  }

  /** Vorführmodus für den Titelbildschirm: nur fahren, kein Stream-Trubel. */
  startDemo() {
    this.running = false;
    this.over = null;
    this.demoT = 0;
    this.player.reset({});
    this.player.x = 1.875;
    this.player.speed = 118 * KMH;
    this.weather = { level: 0, target: 0, active: false, dur: 0, cool: 0, announced: false, sky: 0, front: 0, next: 0, calm: 0, crashes: 0 };
    this.left = { open: false, timer: 0, glow: 0 };
    this.sirenLevel = 0;
    // nach einer Regenfahrt: Scheibe trocken, Wischer still (auch kein Fehlalarm im Titelbild)
    this.windshield.setRain(0);
    this.windshield.setAuto(false);
    this.windshield.clear();
    this.scenery.reset();
    this.navi.reset(0);
    this.traffic.reset();
    this.traffic.populate(0, this.player.speed);
    this.pickups.reset();
  }

  demo(dt, ctl) {
    this.demoT += dt;
    const p = this.player;
    p.update(dt, ctl, { wet: 0 });
    p.battery = 100;
    p.hits = 0;
    if (!p.damage.pristine) p.damage.reset(p.maxHits);
    this.navi.update(dt, p.s);
    if (this.navi.arrived) this.navi.overbid(p.s, 'Demo', 0.01, this.pickBidTarget());
    this.traffic.update(dt, this.demoT, p, { difficulty: 0.15, leftOpen: false, rain: 0 });
  }

  // --- Hilfen --------------------------------------------------------------
  later(delay, fn) {
    this.queue.push({ at: this.t + delay, fn });
  }

  chat(text, name = viewerName(), opts = {}) {
    if (this.ui.chat) this.ui.chat({ name, text: fillTemplate(text), ...opts });
  }

  bot(key, text) {
    const b = BOTS[key];
    this.ui.chat({ name: b.name, text, bot: key, icon: b.icon });
    // haben die Bots viel zu melden, plaudert der Chat etwas weniger – so bleibt er lesbar
    this.chatT += 0.9;
  }

  /**
   * Eine Zeile aus dem Vorrat, die nicht gerade erst im Chat stand – zweimal derselbe Satz untereinander sähe nach
   * einem Fehler aus. Kurze Rufe („F“) dürfen sich häufen, die merkt sich der Chat nicht.
   */
  chatLine(pool) {
    const seen = this.chatSeen;
    let line = pick(pool);
    for (let i = 0; i < 4 && seen.includes(line); i++) line = pick(pool);
    if (line.length > 3) {
      seen.push(line);
      if (seen.length > 14) seen.shift();
    }
    return line;
  }

  burst(pool, n = 3, spread = 2.5) {
    const list = typeof pool === 'function' ? null : pool;
    for (let i = 0; i < n; i++) {
      this.later(rand(0.1, spread), () => this.chat(list ? this.chatLine(list) : pool()));
    }
  }

  /** NOMI spricht (mit Gong, Untertitel und Augen-Animation). */
  say(text, mood = 'talk', { priority = true } = {}) {
    this.audio.nomiChime();
    const nomi = this.cockpit.nomi;
    nomi.setMood(mood, 3.2);
    const go = () => {
      const dur = this.speech.say(text, 'board', {
        priority,
        onStart: (d) => nomi.speak(d),
      });
      this.ui.nomi(text, dur + 0.8);
      this.voiceUntil = Math.max(this.voiceUntil, this.t + dur + 0.8);
    };
    // NOMI hat das Wort: Das Sprachstudio verstummt mitten im Satz und wartet, bis sie fertig ist
    this.voiceUntil = Math.max(this.voiceUntil, this.t + 1.2);
    if (this.t < this.studioUntil) {
      this.studioUntil = this.t;
      if (this.speech.current?.voiceKey === 'sprachstudio') this.speech.cancelCurrent();
    }
    if (this.running) this.later(0.35, go);
    else go();
  }

  /** Einnahme verbuchen. label: Zeile der Abrechnung (siehe INCOME) · silent: ohne Einblendung am Guthaben */
  earn(amount, label, { silent = false } = {}) {
    if (amount <= 0) return 0;
    this.money += amount;
    this.breakdown[label] = (this.breakdown[label] || 0) + amount;
    if (!silent) {
      this.popT = this.t;
      this.ui.money(amount, INCOME[label] || label);
    }
    return amount;
  }

  fine(amount, label) {
    const v = Math.min(this.money, amount);
    this.money -= v;
    this.breakdown[label] = (this.breakdown[label] || 0) - v;
    this.stats.fines += v;
    // nur zeigen, was wirklich abgebucht wurde (bei leerem Konto gibt es nichts zu holen)
    if (v > 0) this.ui.money(-v, label);
    this.audio.bad();
  }

  /**
   * Jemand gibt Geld: Finanz-Bot James sagt es an, die Kasse klingelt.
   * what: wofür · label: Zeile der Abrechnung · line: eigener Satz für James statt „… hat … gespendet!“
   */
  donate(name, amount, what, { label = 'Spenden', line } = {}) {
    this.earn(amount, label);
    this.bot('james', line || `${name} hat ${fmtCent(amount)} ${what ? 'für »' + what + '« ' : ''}gespendet!`);
    this.audio.pling();
    this.stats.donations++;
    if (!(this.fans.top?.amount >= amount)) this.fans.top = { name, amount };
    // die Alter-Skala: Ab 100 € ruft der ganze Chat, darunter kommentiert er nur ab und zu (sonst wird es ein Sprechchor –
    // bei bester Laune kommen Mittelalter im Minutentakt)
    const alter = alterReaction(amount);
    if (alter && amount >= 100) this.burst(alter, 3, 1.8);
    else if (alter && chance(amount >= 50 ? 0.35 : amount >= 20 ? 0.4 : 0.15)) this.later(0.6, () => this.chat(this.chatLine(alter)));
    // genau 4 €: Ab diesem Betrag gibt es im Stream eine Dankeseinblendung – das wissen die Stammgäste
    else if (amount === 4 && chance(0.5)) this.later(0.7, () => this.chat(this.chatLine(CHAT.einblendung)));
    this.eco.donated(amount);
    this.onMood('donation', clamp(amount / 20, 0.25, 1));
    // eine richtig große Spende gibt das Sprachstudio gern weiter, sobald es Luft hat (die größte zuerst) – und ab
    // 100 € ruft es sofort „Alter!“, so wie das echte Sprachstudio
    const S = this.studio;
    if (amount >= 50 && !(S.extra?.amount >= amount)) S.extra = { kind: amount >= 100 ? 'alter' : 'thanks', name, amount, until: this.t + 20 };
    return amount;
  }

  /**
   * Ein schöner Moment (haarscharf überholt, Brunnen gegrüßt, brav am Blitzer vorbei …): Das hebt die Stimmung,
   * und manchmal lässt ein begeisterter Zuschauer dafür eine Kleinigkeit springen. Einen festen Lohn gibt es nie.
   */
  thrill(kind, what) {
    const v = this.eco.thrill(kind);
    if (v) this.later(rand(0.9, 2), () => this.donate(viewerName(), v, what));
  }

  // ------------------------------------------------------------------------
  /**
   * @param {number} dt
   * @param {{steer:number, throttle:number, brake:number, horn:boolean, wiper:boolean, megafon:boolean}} ctl
   */
  update(dt, ctl, camera) {
    if (!this.running) return;
    this.t += dt;
    const p = this.player;
    const st = this.stats;
    const W = this.weather;

    // geplante Kleinigkeiten
    if (this.queue.length) {
      const now = this.t;
      const due = this.queue.filter((q) => q.at <= now);
      if (due.length) {
        this.queue = this.queue.filter((q) => q.at > now);
        for (const q of due) q.fn();
      }
    }

    // --- Fahren ------------------------------------------------------------
    const sBefore = p.s;
    // Krümmung und Steigung unter dem Wagen (Kurven-Paket, sonst 0)
    p.update(dt, ctl, { wet: W.level, kappa: ctl.kappa || 0, grade: ctl.grade || 0 });
    const ds = p.s - sBefore;
    for (const e of p.events) {
      if (e.type === 'rail') {
        this.audio.scrape();
        this.fx.shake(e.hard ? 0.5 : 0.2);
        // wer an der Leitplanke entlangschrammt, verstimmt den Chat nicht mit jedem Funken neu
        if (this.t - this.scrapeT > 1.5) {
          this.scrapeT = this.t;
          this.eco.cheer(e.hard ? 'scrapeHard' : 'scrape');
        }
        if (e.hard && chance(0.4)) this.chat(pick(['Leitplanke! 😬', 'Uff, die Leitplanke', 'Kratz kratz']));
      } else if (e.type === 'understeer' && this.t > (this.understeerSaid ?? -99) + 25) {
        // zu schnell für die Kurve: NOMI sagt es freundlich (höchstens alle 25 s)
        this.understeerSaid = this.t;
        this.say(damageLine('understeer'), 'worried', { priority: false });
      }
    }
    st.distance = p.s;
    st.maxSpeedKmh = Math.max(st.maxSpeedKmh, p.kmh);
    // neue Höchstgeschwindigkeit dieser Fahrt: Der Chat schaut auf den Tacho
    const mark = this.eco.speedMark(p.kmh);
    if (mark) {
      this.chat(fillTemplate(pick(CHAT.speedMark), { kmh: mark }));
      this.thrill('topSpeed', `${mark} km/h`);
    }
    st.cleanDistance += ds;
    if (W.level > 0.3) st.rainDistance += ds;
    this.clock += dt * 0.5;
    this.megafonCd = Math.max(0, this.megafonCd - dt);

    // --- Eingaben ------------------------------------------------------------
    if (ctl.device) this.device = ctl.device;
    if (ctl.horn) this.honk();
    if (ctl.wiper) this.manualWiper();
    if (ctl.megafon) this.useMegafon();

    // --- Verkehr ---------------------------------------------------------------
    const tev = this.traffic.update(dt, this.t, p, { difficulty: clamp(p.s / 16000, 0, 1), leftOpen: this.left.open, rain: W.level });
    for (const e of tev) {
      if (e.type === 'crash') this.onCrash(e);
      else if (e.type === 'nearMiss') this.onNearMiss(e);
      else if (e.type === 'passPolice') {
        this.chat(pick(['Polizei überholt?! Mutig! 😅', 'Tschüss Polizei Gifhorn 👋', 'Das gibt einen Eintrag ins Fahrtenbuch']));
      }
    }
    if (this.over) return;

    // Polizei (Martinshorn-Lautstärke)
    this.sirenLevel = 0;
    if (this.policeCar) {
      if (!this.traffic.cars.includes(this.policeCar)) this.policeCar = null;
      else this.sirenLevel = clamp(1 - Math.abs(this.policeCar.s - p.s) / 260, 0, 1);
    }

    this.updateLeftLane(dt);
    this.updateWeather(dt, ds);
    this.updateNavi(dt);
    this.updateEvents(dt, camera);
    this.updatePickups(dt, camera);
    this.updateViewers(dt);
    this.updateChat(dt, ctl.kappa || 0);
    this.updateStudio();
    this.updateJobs();

    // Standstreifen
    if (p.shoulderTime > 1.2 && !this.shoulderWarned) {
      this.shoulderWarned = true;
      this.say(BOARD.shoulder, 'worried');
      this.burst(CHAT.shoulder, 2, 1.5);
    }
    if (p.shoulderTime > 4.5) {
      p.shoulderTime = 0;
      this.fine(10, 'Verwarngeld');
      this.eco.cheer('fine');
      this.ui.toast('🚓 Standstreifen: 10\u00a0€ Verwarngeld', 'bad');
      this.callPolice('STANDSTREIFEN? NEIN!');
    }
    if (p.shoulderTime <= 0) this.shoulderWarned = false;

    // Akku
    // nach dem Laden wieder scharf schalten (mit etwas Abstand, damit es nicht flackert)
    if (p.battery > 30) this.batteryWarned = 0;
    else if (p.battery > 12 && this.batteryWarned > 1) this.batteryWarned = 1;
    if (p.battery < 20 && this.batteryWarned < 1) {
      this.batteryWarned = 1;
      this.say(BOARD.lowBattery, 'worried');
      this.chat(pick(['Akku! 🔋', 'Wo ist der nächste Supercharger?', 'Lade-Ringe einsammeln!']));
    }
    if (p.battery < 7 && this.batteryWarned < 2) {
      this.batteryWarned = 2;
      this.say(BOARD.veryLowBattery, 'worried');
    }
    if (p.empty && p.speed < 1.5) this.end('akku');
  }

  // --- Linke Spur ------------------------------------------------------------
  updateLeftLane(dt) {
    const L = this.left;
    const p = this.player;
    if (!L.open) {
      if (!this.offAutobahn) L.next -= dt;
      if (L.next <= 0) this.openLeftLane();
    } else {
      L.timer -= dt;
      // Geld gibt es fürs Linksfahren nicht – aber jemand hat dafür gespendet und will es jetzt auch sehen
      if (p.inLeftLane) {
        this.stats.leftLaneTime += dt;
        L.idle = 0;
      } else {
        L.idle += dt;
        if (L.idle > 14 && L.teased < 2 && L.timer > 8) {
          L.idle = 0;
          L.teased++;
          // erst fragt, wer gespendet hat, dann stupst der Rest des Chats
          if (L.teased === 1) this.chat(pick(CHAT.leftLaneDonor), L.donor);
          else this.chat(this.chatLine(CHAT.leftLaneTease));
        }
      }
      if (L.timer <= 10 && !L.warned) {
        L.warned = true;
        this.ui.banner('⏳ Linke Spur: noch 10 Sekunden', 2.5);
      }
      if (L.timer <= 0) this.closeLeftLane();
    }
    L.glow = damp(L.glow, L.open ? 1 : 0, 3, dt);
    // Rechtsfahrgebot
    L.grace = Math.max(0, L.grace - dt);
    if (!L.open && p.inLeftLane && L.grace <= 0) {
      L.rg += dt;
      if (L.rg > 7 && !L.rgWarned) {
        L.rgWarned = true;
        this.ui.toast('⚠️ Rechtsfahrgebot! Die linke Spur ist gesperrt.', 'bad');
        this.callPolice('BITTE RECHTS FAHREN');
        this.burst(['Rechts fahren! 😅', 'Rechtsfahrgebot!', 'Polizei Gifhorn kommt…'], 2, 1.5);
      }
      if (L.rg > 15) {
        L.rg = 0;
        L.rgWarned = false;
        this.fine(10, 'Verwarngeld');
        this.eco.cheer('fine');
        this.ui.toast('🚓 Rechtsfahrgebot missachtet: 10\u00a0€ Verwarngeld', 'bad');
      }
    } else {
      L.rg = Math.max(0, L.rg - dt * 2);
      if (L.rg <= 0) L.rgWarned = false;
    }
  }

  openLeftLane() {
    const L = this.left;
    L.open = true;
    L.timer = L.dur;
    L.warned = false;
    L.idle = 0;
    L.teased = 0;
    L.donor = viewerName();
    this.eco.laneOpened();
    this.say(BOARD.leftLane, 'happy');
    this.audio.chime();
    this.later(0.2, () => this.donate(L.donor, this.eco.laneDonation(), 'Linke Spur freischalten', { label: 'Aktionen' }));
    this.burst(CHAT.leftLane, 3, 3);
    this.ui.banner('⬅️ Linke Spur freigeschaltet!', 4, `${L.dur === 60 ? 'Eine Minute' : L.dur + ' Sekunden'} lang darfst du ganz links fahren`);
  }

  closeLeftLane() {
    const L = this.left;
    L.open = false;
    // genutzt: Der Chat freut sich, und die nächste Freischaltung kommt eher – links liegen gelassen: umgekehrt
    const { used, wait } = this.eco.laneClosed(L.freq);
    L.next = wait;
    L.grace = 5;
    this.say(BOARD.leftLaneEnd, 'idle');
    this.burst(used >= 0.6 ? CHAT.leftLaneUsed : used < 0.2 ? CHAT.leftLaneIgnored : CHAT.leftLaneEnd, 2, 2.5);
  }

  // --- Wetter ------------------------------------------------------------------
  // Regen kommt als Schauer: gut 30 bis 75 s, dazwischen mehrere Minuten trocken. Der erste erst nach einem
  // trockenen Start und nur, wenn eine Weile kein Rempler war (geschickte Spieler bekommen ihn eher). Alles
  // läuft nach Fahrzeit, nicht nach Strecke. Vor dem Schauer zieht der Himmel ein paar Sekunden lang zu
  // (front, sky), danach klart er langsam wieder auf.
  updateWeather(dt, ds) {
    const W = this.weather;
    if (W.crashes !== this.stats.crashes) {
      W.crashes = this.stats.crashes;
      W.calm = 0;
    }
    W.calm += dt;
    if (W.front > 0) {
      W.front -= dt;
      if (W.front <= 0) {
        W.active = true;
        W.target = W.next;
        W.dur = rand(28, 70);
        W.announced = false;
      }
    } else if (!W.active) {
      W.cool -= dt;
      if (W.cool <= 0 && (W.calm >= 30 || W.cool <= -60)) {
        W.front = rand(6, 9);
        W.next = rand(0.6, 1);
      }
    } else {
      W.dur -= dt;
      if (W.dur <= 0) {
        W.active = false;
        W.target = 0;
        W.cool = rand(170, 290);
        this.later(8, () => this.chat(pick(['Endlich trocken ☀️', 'Regen vorbei!', 'Der Wischer hat sich erholt'])));
      }
    }
    const rate = W.target > W.level ? 0.12 : 0.15;
    W.level += clamp(W.target - W.level, -rate * dt, rate * dt);
    const sky = W.active || W.front > 0 ? W.next : 0;
    W.sky += clamp(sky - W.sky, -dt / 12, dt / 6);
    if (W.active && !W.announced && W.level > 0.12) {
      W.announced = true;
      this.say(BOARD.rain, 'worried');
      this.onMood('rain', 1);
      // Regen ist Unterhaltung: Der Chat wird wach (Geld gibt es dafür nicht)
      this.eco.cheer('rainStart');
      this.burst(CHAT.rainStart, 5, 5);
      this.audio.whoosh();
    }
    // der zuckende Wischer ist ein Dauerbrenner (gezählt wird in onWiper): alle paar Sekunden ein Lacher
    if (this.stats.twitches !== W.twitches) {
      W.twitches = this.stats.twitches;
      if (W.level > 0.2 && this.t > W.laughT) {
        W.laughT = this.t + 10;
        this.thrill('wiperTwitch', 'den zuckenden Wischer');
      }
    }
    this.windshield.setRain(W.level);
  }

  /**
   * Ereignisse des Scheibenwischers: 'twitch' je Anlauf (im Schauer jeder kräftige Ruck der stehenden Wischer) und
   * 'wipe' je ganzem Wisch, 'stand' wenn sie im Schauer stehen bleiben, der Rest nur für Geräusche.
   */
  onWiper(type) {
    const A = this.audio;
    const wet = this.running && this.weather.level > 0.2;
    if (type === 'wipe') {
      A.wiperSweep();
      this.stats.wipes++;
      // mit früher Firmware ist ein ganzer Wisch ein kleines Wunder
      if (wet && this.windshield.firmware < 2 && chance(0.5)) this.later(1.3, () => this.chat(pick(CHAT.wiperWipe)));
    } else if (type === 'twitch') {
      A.wiperStrain();
      this.stats.twitches++;
      this.onMood('wiper', 1);
      if (wet && this.T.wiperChat <= 0 && chance(0.3)) {
        this.T.wiperChat = 14;
        // ab dem fünften Zucken zählt der Chat auch mal mit
        const n = this.stats.twitches;
        this.chat(n >= 5 && chance(0.4) ? fillTemplate(pick(CHAT.wiperCount), { n, w: this.stats.wipes }) : pick(CHAT.wiper));
      }
    } else if (type === 'phantom') {
      // Fehlalarm bei trockener Scheibe
      A.wiperSqueak();
      this.stats.twitches++;
      if (this.running) {
        if (chance(0.5)) this.later(1, () => this.chat(pick(CHAT.wiperPhantom)));
        else if (chance(0.5)) this.say(BOARD.wiperPhantom, 'think', { priority: false });
      }
    } else if (type === 'stand' || type === 'stuck') {
      A.wiperStutter(3);
      this.onMood('wiper', 1);
      // stehen die Wischer im Schauer, entschuldigt sich NOMI ab und zu für die Beta-Software (nach der Regenansage;
      // die Uhr läuft mit den anderen in this.T)
      if (type === 'stand' && wet && !(this.T.wiperSorry > 0) && chance(0.6)) {
        this.T.wiperSorry = rand(70, 110);
        this.later(rand(5, 8), () => this.say(pick(BOARD.wiperSorry), 'worried', { priority: false }));
      }
    } else if (type === 'jerk') {
      A.wiperTwitch();
      A.wiperStutter(4, 0.1);
    } else if (type === 'release') A.wiperGiveUp();
    else if (type === 'park') A.wiperClack();
  }

  manualWiper() {
    const r = this.windshield.manual();
    if (r === 'wipe') this.ui.toast('🌧️ Wisch! Klare Sicht.', 'info');
    else if (r === 'twitch') {
      this.ui.toast('🌧️ Der Wischer zuckt nur …', 'info');
      this.onMood('wiper', 1);
      if (chance(0.4)) this.chat(pick(CHAT.wiper));
    }
  }

  // --- Navi ------------------------------------------------------------------------
  updateNavi(dt) {
    const p = this.player;
    const nv = this.navi;
    // Kurz vor dem Ziel doch noch überboten – ein Klassiker. (Nur hier muss das Spiel wissen, wie viele Sekunden
    // es noch bis zum Ziel sind.)
    const eta = nv.arrived ? Infinity : (nv.targetS - p.s) / Math.max(p.speed, 8);
    if (eta < 8 && this.T.bid > eta && this.T.bid < 45 && this.eco.lateBid()) {
      this.T.bid = rand(0.4, Math.max(0.5, eta - 2.5));
      this.bidPlan.late = true;
    }
    if (this.T.bid <= 0) {
      const plan = this.bidPlan;
      const siegen = this.bidTargets().find((x) => x.special === 'siegen');
      if (plan.kind === 'step' && !plan.late && siegen && nv.target !== siegen && chance(0.16)) {
        // Siegen wird geboten … und sofort überboten
        const n = viewerName();
        // Das Siegen-Gebot zählt wirklich: Das Navi stellt kurz auf Siegen um (Navi, Schilderbrücken und James sagen
        // dasselbe), die Kasse bekommt den Cent, und das Gegengebot danach liegt mindestens 1 Cent darüber.
        nv.overbid(p.s, n, 0.01, siegen);
        this.stats.naviChanges++;
        this.stats.topBid = Math.max(this.stats.topBid, nv.bid);
        this.earn(nv.bid, 'Navi-Gebote', { silent: true });
        this.bot('james', `${n} bietet ${fmtCent(nv.bid)} – neues Ziel: Siegen`);
        this.chat(pick(['SIEGEN!', 'Siegen? 👀', 'Diesmal Siegen!']));
        if (this.gantryStale()) this.scenery.relabelGantries();
        // bis das Gegengebot da ist, ruht die Uhr
        this.T.bid = 99;
        this.later(2.2, () => this.changeNavi(true));
      } else this.changeNavi(false);
    }
    for (const e of this.navi.update(dt, p.s)) {
      if (e.type === 'wendeIgnored') {
        this.say('Route wird neu berechnet.', 'think', { priority: false });
        if (chance(0.6)) this.chat(pick(['Wenden auf der Autobahn? 😂', 'Bitte wenden… nein!', 'Das Navi gibt nicht auf']));
      } else if (e.type === 'arrived') this.onArrive(e);
    }
  }

  /**
   * Ein Zuschauer überbietet. Jedes Gebot wird bezahlt (zurück gibt es nichts) und landet in der Stream-Kasse;
   * wie viel draufgelegt wird und wann das nächste Gebot kommt, plant economy.js (bidPlan).
   */
  changeNavi(siegenOverbid) {
    const p = this.player;
    const nv = this.navi;
    const plan = this.bidPlan;
    const chaos = plan.kind === 'chaos';
    // neue Runde nach einer Ankunft: Es geht wieder bei 1 Cent los
    if (this.roundNew) {
      this.roundNew = false;
      nv.bid = 0;
    }
    let bidder = viewerName();
    let target;
    if (plan.kind === 'duel') {
      // Bieterduell: Zwei schaukeln sich hoch, jeder mit seinem Ziel – der Herausforderer und wer gerade vorn lag
      if (plan.first || !this.duel) {
        const holder = nv.bidder === 'Mini Adam' ? viewerName() : nv.bidder;
        this.duel = { n: 0, who: [{ name: bidder, target: this.pickBidTarget() }, { name: holder, target: nv.target }] };
      }
      const d = this.duel.who[this.duel.n++ % 2];
      bidder = d.name;
      target = d.target;
    }
    const t = nv.overbid(p.s, bidder, plan.increment, target || this.pickBidTarget());
    this.stats.naviChanges++;
    this.stats.topBid = Math.max(this.stats.topBid, nv.bid);
    // Cent-Gebote lassen eine frische größere Gutschrift am Guthaben stehen
    this.earn(nv.bid, 'Navi-Gebote', { silent: nv.bid < 1 && this.t - this.popT < 1.6 });
    // im Chaos fasst James sich kurz, sonst schieben seine Meldungen den ganzen Chat aus dem Fenster
    this.bot('james', `${bidder} bietet ${fmtCent(nv.bid)} – neues Ziel: ${chaos ? shortName(t) : t.name}`);
    if (siegenOverbid) this.later(0.8, () => this.chat(pick(['Siegen wurde überboten. Wie immer 😂', 'Nicht schon wieder Siegen verpasst', 'Klassiker'])));
    this.eco.cheer(chaos ? 'bidChaos' : plan.kind === 'big' ? 'bidBig' : 'bid');
    const next = this.eco.nextBid({ bid: nv.bid });
    this.bidPlan = next;
    this.T.bid = next.delay;

    // Was der Chat dazu sagt
    if (chaos) {
      this.audio.tone(1174.7, 0.07, 'triangle', 0.035);
      if (plan.first) {
        this.ui.toast('🤑 Bieter-Chaos im Chat: Jeder legt einen Cent drauf!', 'info');
        this.burst(CHAT.bidChaos, 2, 2.5);
      } else if (chance(0.3)) this.chat(this.chatLine(CHAT.bidChaos));
    } else {
      this.audio.naviAlert();
      if (plan.kind === 'duel') {
        if (plan.first) {
          this.ui.toast(`🤑 Bieterduell: ${this.duel.who[0].name} gegen ${this.duel.who[1].name}`, 'info');
          this.burst(CHAT.bidDuel, 3, 3);
        } else if (chance(0.4)) this.chat(this.chatLine(CHAT.bidDuel));
        if (next.kind !== 'duel' || next.first) this.later(1.6, () => this.chat(this.chatLine(CHAT.bidDuelEnd)));
      } else if (plan.kind === 'big') {
        this.ui.toast(`🤑 Großes Gebot: ${fmtCent(nv.bid)} von ${bidder}`, 'good');
        this.burst(CHAT.bidBig, 3, 2.5);
      } else if (plan.late) this.burst(CHAT.bidLate, 3, 2);
      else this.burst(CHAT.naviChanged, 2, 3);
    }
    if (t.special === 'siegen') this.later(1.4, () => this.chat('SIEGEN SETZT SICH DURCH?! 😱'));
    // Die Navi-Tafeln der Schilderbrücken zeigen immer dasselbe Ziel wie das Navi, auch im Bieter-Chaos (Navi und Welt
    // dürfen sich nie widersprechen). Liegt das Ziel vor allen Brücken voraus, zeigen sie Orte statt eines Navi-Ziels –
    // die bleiben dann stehen, statt bei jedem Cent neu gewürfelt zu werden.
    if (this.gantryStale()) this.scenery.relabelGantries();
    // NOMI und der Hinweis aufs neue Ziel kommen erst, wenn es kurz stehen bleibt – im Chaos und im Duell kämen sie
    // nicht hinterher
    if (next.delay > 6) {
      if (chaos) this.later(rand(2.5, 4), () => this.chat(this.chatLine(CHAT.bidCalm)));
      if (this.t - this.naviSaidT > 10) {
        this.naviSaidT = this.t;
        this.say(BOARD.naviChanged, 'think');
      }
      this.onMood('curious', 1);
      if (nv.wende) this.later(3.5, () => this.ui.toast('↩️ Navi: „Bitte wenden“ – auf der Autobahn?', 'info'));
      this.ui.toast(`📍 Neues Navi-Ziel: ${t.name} (${fmtNum(nv.km, 1)} km)`, 'info', t.note);
    }
  }

  /**
   * Die Ziele, auf die gerade geboten werden kann. Heute die feste Liste aus data.js – die eine Stelle, die man
   * tauscht, wenn die Ziele echte Orte der Karte werden (je Ziel: name, km, optional weight, special, note).
   */
  bidTargets() {
    return NAVI_TARGETS;
  }

  /** Wohin der nächste Bieter will (nie dorthin, wo es ohnehin gerade hingeht). */
  pickBidTarget() {
    return this.eco.pickTarget(this.bidTargets(), this.navi.target);
  }

  /**
   * Was die Navi-Tafel einer Schilderbrücke bei sSign zeigt: das Ziel des Navis (gleicher Kurzname wie überall) und
   * die Entfernung ab dem Schild – oder null, wenn das Ziel schon vor dem Schild liegt (dann stehen dort Orte).
   */
  gantryNavi(sSign) {
    const km = (this.navi.targetS - sSign) / 1000;
    return km < 0.2 ? null : { target: shortName(this.navi.target), km };
  }

  /** Zeigt eine Schilderbrücke voraus ein Navi-Ziel oder muss jetzt eins zeigen? (Vorbeigefahrene vergisst sie.) */
  gantryStale() {
    const s = this.player.s;
    let stale = false;
    for (const [sSign, shown] of this.gantryShown) {
      if (sSign < s - 60) this.gantryShown.delete(sSign);
      else if (shown || this.gantryNavi(sSign)) stale = true;
    }
    return stale;
  }

  onArrive(e) {
    const p = this.player;
    const t = e.target;
    this.stats.naviReached++;
    this.say(BOARD.arrived, 'love');
    this.onMood('cheer', 1);
    this.audio.jingle();
    // klassisches Spiel: an jedem erreichten Navi-Ziel wird ein Karosserie-Punkt repariert (mit Pflaster)
    if (p.repair(1)) {
      this.ui.damage(p.hits, p.maxHits);
      this.later(2.2, () => this.ui.toast('🩹 ' + damageLine('repair'), 'good'));
    }
    this.ui.banner(`🏁 Ziel erreicht: ${t.name}`, 4);
    this.burst(CHAT.naviReached, 4, 3);
    // Fürs Ankommen selbst gibt es nichts – aber der Chat feiert es mit einem Schwung Ortsspenden (Siegen: doppelt;
    // am Drive-In ist die erste natürlich für „Pommes ohne Rückfragen“)
    const gifts = this.eco.arrive({ double: t.special === 'siegen' });
    // bis hier steht die letzte Ortsspende spätestens im Chat (ein „5 Cent“-Angebot zum Ziel kommt erst danach)
    this.cent5.arrivedT = this.t + 2.4 + (gifts.length - 1) * 1.1;
    gifts.forEach((v, i) => this.later(1.8 + i * 1.1 + rand(0, 0.6), () => {
      // kurz gehalten, es kommen ja mehrere hintereinander: „Ortsspende von …: 5,00 €“
      const name = viewerName();
      const what = i === 0 && t.special === 'pommes' ? 'Pommes ohne Rückfragen' : 'Ortsspende';
      this.donate(name, v, what, { label: 'Ortsspenden', line: `${what} von ${name}: ${fmtCent(v)}` });
    }));
    this.later(1.2, () => this.chat(this.chatLine(CHAT.ortsspende)));
    // danach beginnt eine neue Bieterrunde bei 1 Cent
    this.duel = null;
    this.roundNew = true;
    this.bidPlan = this.eco.nextBid({ bid: 0 });
    this.T.bid = this.bidPlan.delay;
    if (this.up.konfetti) {
      this.cockpit.addConfetti(70);
      this.audio.confetti();
      this.later(1, () => this.chat('KONFETTI! 🎉'));
    }
    switch (t.special) {
      case 'charger':
        p.charge(35);
        this.ui.toast('🔌 Schnell geladen: +35 % Akku', 'good');
        this.stats.charges++;
        break;
      case 'gifhorn':
        this.later(1.5, () => this.callPolice('GIFHORN GRÜSST!'));
        break;
      case 'brunnen':
        this.later(1.2, () => this.speech.say('Ein sehr schöner Brunnen. Vielen Dank.', 'schoennbrun'));
        this.audio.brunnenJingle();
        this.burst(CHAT.brunnen, 3, 2);
        break;
      case 'elsa':
        this.burst(CHAT.elsa, 3, 2);
        break;
      case 'propper':
        this.later(4.5, () => this.say('Meister Pünktlich ist leider noch nicht da.', 'worried', { priority: false }));
        this.later(6, () => this.chat(pick(['Wie immer 😂', 'Er ist bestimmt gleich da', 'Fünf Minuten noch!'])));
        break;
      case 'malte':
        this.burst(['Malte Malte Malte Malte', 'MALTE!', 'MaLTE', 'Malte ist eingestiegen ✔️'], 5, 3);
        break;
      case 'siegen':
        this.burst(['SIEGEN!!! Es ist tatsächlich passiert 😱', 'Geschichte wurde geschrieben', 'Doppelte Ortsspenden für Siegen!'], 3, 2);
        break;
      case 'sparkasse':
        this.later(1.5, () => this.ui.chat({ name: 'Wissenschaftlicher Dienst', text: `🔬 Ergebnis: Die Bank am Markt ist ${this.navi.sparkColor}.`, bot: 'claudia', icon: '🔬' }));
        break;
      case 'pommes':
        this.burst(['Pommes ohne Rückfragen 🍟', 'Mit Mayo!', 'Keine Rückfragen!'], 3, 2);
        break;
      case 'bude':
        this.burst(['Diesmal die richtige Bude! 🌭', 'Falsche Bude? 😂', 'Currywurst!'], 3, 2);
        break;
      default:
        break;
    }
  }

  /**
   * Am Navi-Ziel vorbeigefahren: Das verstimmt den Chat. Klassisch liegt jedes Ziel an der Strecke und kann nicht
   * verfehlt werden; in der XXL-Welt mit ihren echten Ausfahrten meldet es onTrip.
   */
  missedTarget() {
    this.eco.cheer('missedTarget');
    this.burst(CHAT.missedTarget, 3, 2.5);
  }

  /**
   * Ereignisse der XXL-Fahrt (trip.js, main.js reicht sie von der Welt durch): Dort liegen Ankunft, Ausfahrten und
   * Abzweige in der Strecke. Mini Adams Mimik reagiert darauf wie an den klassischen Stellen (Ziel erreicht: Jubel,
   * neuer Weg: Blick aufs Navi), und wer an der geplanten Ausfahrt vorbeifährt, verstimmt den Chat.
   */
  onTrip(e) {
    if (!this.running) return;
    if (e.type === 'arrive') this.onMood('cheer', 1);
    else if (e.type === 'rest') this.onMood('happy', 0.6);
    else if (e.type === 'fork') {
      if (e.wrong && e.planned === 'exit') {
        this.missedTarget();
        this.onMood('startled', 0.5);
      } else if (e.taken === 'exit') this.onMood('curious', 0.7);
    }
  }

  // --- Ereignisse ------------------------------------------------------------------
  updateEvents(dt, camera) {
    const p = this.player;
    const T = this.T;
    for (const k of Object.keys(T)) T[k] -= dt;
    // ein großes, gut gelauntes Publikum bucht öfter Durchsagen, Rahmen und Aktionen
    const eager = (clamp(this.eco.activity(), 0.6, 1.8) - 1) * dt;
    T.durchsage -= eager;
    T.rahmen -= eager;
    T.trunk -= eager;

    // Sprachdurchsage (wartet, bis das Sprachstudio ausgeredet hat)
    if (T.durchsage <= 0 && this.t >= this.studioUntil) {
      T.durchsage = rand(48, 85);
      const pool = this.weather.level > 0.3 && chance(0.5) ? DURCHSAGEN_REGEN : DURCHSAGEN;
      const d = pick(pool);
      const text = fillTemplate(d.text);
      const name = viewerName();
      this.donate(name, this.eco.durchsagePrice(), 'Sprachdurchsage', { label: 'Sprachdurchsagen' });
      this.voiceUntil = Math.max(this.voiceUntil, this.t + 3);
      this.later(1.2, () => {
        const dur = this.speech.say(text, d.voice);
        this.ui.durchsage(VOICES[d.voice].label, text, dur + 1, name);
        this.voiceUntil = Math.max(this.voiceUntil, this.t + dur + 1);
      });
    }

    // Rahmen
    if (T.rahmen <= 0 && p.s > 1000) {
      T.rahmen = rand(75, 130);
      const r = pick(RAHMEN);
      const name = viewerName();
      this.donate(name, r.price, r.name, { label: 'Rahmen' });
      this.eco.cheer('funny');
      this.ui.rahmen(r, name);
      this.later(2, () => this.chat(this.chatLine(CHAT.rahmen)));
    }

    // Funkloch (mit Starlink gibt es keins)
    if (this.funkloch > 0) {
      this.funkloch -= dt;
      if (this.funkloch <= 0) {
        this.ui.funkloch(false);
        this.burst(CHAT.funklochBack, 3, 1.5);
        this.later(1.2, () => this.bot('nora', 'Verbindung zum Streaming-Server steht wieder. Weiter geht’s!'));
      }
    }
    if (T.funkloch <= 0 && p.s > 1500) {
      T.funkloch = rand(120, 220);
      if (!this.up.starlink) {
        this.funkloch = rand(2.2, 3.2);
        this.eco.cheer('funkloch');
        this.fx.glitch(this.funkloch);
        this.ui.funkloch(true);
        this.burst(CHAT.funkloch, 5, 1.6);
        if (chance(0.5)) this.later(0.5, () => this.say(BOARD.funkloch, 'worried', { priority: false }));
      } else if (chance(0.5)) {
        this.chat(pick(['Satellit sei Dank: kein Funkloch 🛰️', 'Bild bleibt stabil ✔️', 'Schüssel 🔥']));
      }
    }

    // Frosch-Flackern
    if (T.frog <= 0) {
      T.frog = rand(170, 300);
      this.eco.cheer('funny');
      this.fx.green(1.4);
      this.burst(CHAT.frog, 4, 1.5);
    }

    // Aktion aus dem Live-Bereich: Kofferraum öffnen, hupen lassen oder ein Wunsch fürs Megafon
    if (T.trunk <= 0 && p.s > 2000) {
      T.trunk = rand(140, 220);
      const a = pick(AKTIONEN.filter((x) => !x.needs || this.up[x.needs]));
      const name = viewerName();
      this.donate(name, a.price, a.name, { label: 'Aktionen' });
      this.eco.cheer('funny');
      if (a.id === 'trunk') {
        this.fx.trunk(7);
        this.burst(CHAT.trunk, 3, 2.5);
      } else if (a.id === 'hupe') {
        this.later(0.9, () => this.honk());
        this.later(1.4, () => this.chat('Bimmel hurra! 📯'));
      } else {
        const text = pick(MEGAFON_WUENSCHE);
        this.voiceUntil = Math.max(this.voiceUntil, this.t + 3);
        this.later(1, () => {
          this.audio.megafon();
          const dur = this.speech.say(text, 'william');
          this.ui.toast(`📢 Megafon-Wunsch von ${name}`, 'info', '»' + text + '«');
          this.voiceUntil = Math.max(this.voiceUntil, this.t + dur + 0.6);
        });
      }
    }

    // Sammelaktion: Aktions-Bot Claudia nennt das Ziel, der Chat legt zusammen (die Beiträge meldet die
    // Stream-Kasse, siehe onStream), und wenn es erreicht ist, passiert es
    if (T.sammel <= 0 && !this.sammel) {
      T.sammel = rand(170, 260);
      this.sammel = pick(SAMMELAKTIONEN);
      const goal = this.eco.startSammel();
      this.bot('claudia', `Sammelaktion gestartet: »${this.sammel.name}« – Ziel: ${fmtEuro(goal)}. Jeder Beitrag zählt!`);
      this.burst(CHAT.sammel, 2, 3);
    }

    // Zahlen im Chat
    if (T.numbers <= 0) {
      T.numbers = rand(90, 150);
      this.eco.cheer('funny');
      this.bot('claudia', 'Kanalpunkte-Aktion: Mini Adam möchte eine Zahl im Chat sehen!');
      const nums = [];
      for (let i = 0; i < randInt(6, 9); i++) nums.push(CHAT.zahl());
      nums.forEach((n, i) => this.later(0.6 + i * rand(0.2, 0.45), () => this.chat(n)));
      const dupe = nums.find((n, i) => nums.indexOf(n) !== i);
      if (dupe) this.later(4.5, () => this.chat(`Synchron mit ${dupe}! 🤝`));
    }

    // Polizei Gifhorn einfach mal so
    if (T.police <= 0 && p.s > 2500 && !this.offAutobahn) {
      T.police = rand(220, 340);
      this.eco.cheer('funny');
      this.callPolice(pick(POLICE_TEXTS));
    }

    // Blitzer mit Tempo-120-Zone
    if (!this.blitzer && p.s > this.S.blitzer && !this.offAutobahn) {
      const s = p.s;
      this.blitzer = { limitS: s + 520, camS: s + 1120, endS: s + 1300, announced: false, checked: false };
      this.scenery.request('speed', this.blitzer.limitS, { limit: 120 });
      this.scenery.request('blitzer', this.blitzer.camS);
      this.scenery.request('speed', this.blitzer.endS, { limit: 'ende' });
    }
    if (this.blitzer) {
      const b = this.blitzer;
      if (!b.announced && p.s > b.limitS - 180) {
        b.announced = true;
        this.say(BOARD.blitzer, 'wink');
      }
      if (!b.checked && p.s > b.camS) {
        b.checked = true;
        if (p.kmh > 126) {
          this.fx.flash(1);
          this.audio.flash();
          this.onMood('startled', 1);
          this.scenery.flashBlitzer(true);
          this.later(0.15, () => this.scenery.flashBlitzer(false));
          this.stats.photos++;
          // Tempo und Uhrzeit im Moment des Blitzes festhalten (danach wird meist gebremst)
          const kmh = Math.round(p.kmh);
          const clock = fmtClock(this.clock);
          this.later(0.6, () => {
            this.fine(15, 'Bußgeld');
            this.ui.photo(kmh, clock);
          });
          this.burst(CHAT.blitzer, 3, 2);
          this.cockpit.nomi.setMood('surprised', 2);
          // teuer für Mini Adam, aber der Chat liebt das Foto
          this.eco.cheer('blitzerFlash');
        } else {
          this.stats.blitzerClean++;
          this.thrill('blitzerClean', 'vorbildliches Fahren');
          this.ui.toast('📸 Nicht geblitzt – vorbildlich!', 'good');
        }
      }
      if (p.s > b.endS + 50) {
        this.blitzer = null;
        this.S.blitzer = p.s + rand(2600, 4200);
      }
    }

    // Elefantenrennen
    if (p.s > this.S.elefant && !this.offAutobahn) {
      this.S.elefant = p.s + rand(3200, 5200);
      this.traffic.elefantenrennen(p.s);
      this.say(BOARD.elefant, 'worried', { priority: false });
      this.later(3, () => this.burst(CHAT.elefant, 3, 3));
    }

    // Brunnen und Elsa am Straßenrand (Hupen freut den Chat – und manchmal spendet dann jemand)
    if (!this.landmark && p.s > this.S.landmark && !this.offAutobahn) {
      const type = chance(0.55) ? 'brunnen' : 'elsa';
      // hinten in einem Abschnitt ohne Lärmschutzwand und ohne Brücke davor
      const s = this.scenery.landmarkSpot(p.s + 1500);
      this.landmark = { type, s, seen: false, greeted: false, id: this.scenery.request(type, s) };
    }
    if (this.landmark) {
      const lm = this.landmark;
      const d = lm.s - p.s;
      const elsa = lm.type === 'elsa';
      const view = elsa && this.elsaView(lm, d, camera);
      if (!lm.seen && (elsa ? d < view.show : d < 260)) {
        lm.seen = true;
        lm.seenT = this.t;
        this.burst(lm.type === 'brunnen' ? CHAT.brunnen : CHAT.elsa, 3, 2);
        const key = this.hornKey();
        const t = this.ui.toast(lm.type === 'brunnen' ? `⛲ Ein Brunnen! Hupen für BrunnenTV (${key})` : `👑 Elsa! Hupen zum Grüßen (${key})`, 'info');
        if (elsa) this.elsaToast(lm, t);
      }
      // Elsas Hinweise stehen nur, solange sie zu sehen ist (mindestens kurz, damit sie nicht nur aufblitzen),
      // und nie über ihrem Kopf
      const age = lm.toast ? this.t - lm.toastT : 0;
      if (lm.toast && ((!view.visible && age > 1.2) || (view.covered && age > 0.4))) this.elsaToast(lm, null);
      if (!lm.greeted && (elsa ? lm.seen : d < 220) && d > -40 && this.t - this.lastHorn < 0.3) {
        lm.greeted = true;
        if (lm.type === 'brunnen') {
          this.audio.brunnenJingle();
          this.voiceUntil = Math.max(this.voiceUntil, this.t + 4);
          this.later(0.5, () => this.speech.say('Ein sehr schöner Brunnen.', 'schoennbrun'));
          this.ui.toast('⛲ Neue Folge BrunnenTV! Der Chat freut sich', 'good');
        } else {
          this.cockpit.nomi.setMood('love', 2.5);
          this.scenery.waveBack(lm.id);
          // Antwort statt Hinweis; ist sie schon hinter dem Spiegel oder vorbei, winkt sie hinterher
          this.elsaToast(lm, null);
          const reply = this.ui.toast(view.visible ? '👑 Elsa winkt zurück!' : '👑 Elsa winkt dir hinterher!', 'good');
          if (view.visible) this.elsaToast(lm, reply);
        }
        this.thrill('greet', lm.type === 'brunnen' ? 'BrunnenTV' : 'einen Gruß an Elsa');
      }
      if (d < -80) {
        this.landmark = null;
        this.S.landmark = p.s + rand(2400, 3800);
      }
    }

    // Uhrzeit (Hugo)
    const hour = Math.floor(this.clock / 60) % 24;
    if (hour !== this.lastHugo && this.t > 5) {
      this.lastHugo = hour;
      if (hour === 21) this.bot('hugo', '21 Uhr: Ortsspenden-Schluss! … Verlängerung um 5 Minuten 😉');
      else if (hour === 22) this.bot('hugo', 'Eigentlich wäre jetzt Sendeschluss. Wir fahren einfach weiter!');
      else if (hour >= 19) this.bot('hugo', `Es ist ${hour} Uhr. Sendezeit läuft.`);
      else if (hour === 0) this.bot('hugo', 'Mitternacht! Der Stream läuft einfach weiter. 🌙');
      else if (hour < 6) this.bot('hugo', `Es ist ${hour} Uhr nachts. Sendezeit läuft immer noch.`);
    }
  }

  /**
   * Elsa aus Mini Adams Sicht: frei zu sehen, solange sie weniger als ELSA_VIEW rechts der Blickrichtung steht
   * (danach verdeckt sie der Innenspiegel). show: ab diesem Abstand kommt der Hinweis – sobald die Figur
   * (4,3 m × Maßstab) 4 % der Bildhöhe hat, bei hohem Tempo etwas früher, damit er gut 1,5 s steht.
   */
  elsaView(lm, d, camera) {
    const p = this.player;
    const { x, scale } = this.scenery.placed(lm.id) || ELSA_STATUE;
    const side = x - (p.x + EYE.x);
    // Blickwinkel in der gebogenen Welt (in einer Linkskurve rückt sie weiter nach rechts)
    const seen = d > 0 ? curvePoint(elsaTmp.set(x, 0, -d)) : null;
    const visible = d > 0 && Math.atan2(seen.x - (p.x + EYE.x), -seen.z) - p.yaw < ELSA_VIEW;
    const fov = ((camera?.fov || 58) * Math.PI) / 180;
    const clear = (4.3 * scale) / (0.08 * Math.tan(fov / 2));
    const show = Math.min(175, Math.max(clear, side / Math.tan(ELSA_VIEW) + p.speed * 1.5));
    // Liegt ihr Kopf auf dem Bildschirm schon unter dem Hinweis (hochkant oder wenn die Mittelspalte
    // weiter unten beginnt), kommt der Hinweis weg, sonst verdeckt er Krone und Augen.
    let covered = false;
    const r = lm.toast && camera && d > 0 ? lm.toast.el.getBoundingClientRect() : null;
    if (r && r.width > 0) {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const at = (dx, y) => {
        const v = curvePoint(elsaTmp.set(x + dx * scale, y * scale, -d)).project(camera);
        return [((v.x + 1) / 2) * W, ((1 - v.y) / 2) * H];
      };
      const [l, top] = at(-ELSA_HEAD.half, ELSA_HEAD.top);
      const [rt, chin] = at(ELSA_HEAD.half, ELSA_HEAD.chin);
      covered = l < r.right + 6 && rt > r.left - 6 && top < r.bottom + 6 && chin > r.top - 6;
    }
    return { visible, show, covered };
  }

  /** Wie man hupt – passend zum Gerät, mit dem gerade gespielt wird. */
  hornKey() {
    return this.device === 'touch' ? '📯' : this.device === 'gamepad' ? 'A' : 'Leertaste';
  }

  /** Hinweis, der mit Elsa verschwindet (null: den bisherigen wegnehmen). */
  elsaToast(lm, t) {
    if (lm.toast && lm.toast !== t) lm.toast.drop?.();
    lm.toast = t;
    lm.toastT = this.t;
  }

  callPolice(text) {
    if (this.policeCar) return;
    this.policeCar = this.traffic.police(this.player.s, text);
    this.burst(CHAT.police, 3, 2.5);
    this.later(1, () => this.cockpit.nomi.setMood('worried', 2.5));
  }

  // --- Sammelsachen ---------------------------------------------------------------
  updatePickups(dt, camera) {
    const p = this.player;
    const S = this.S;
    const spawn = !this.offAutobahn;
    if (p.s > S.charge && spawn) {
      S.charge = p.s + rand(900, 1500);
      this.pickups.spawnAhead('charge', p.s, this.traffic);
    }
    if (p.s > S.banana && spawn) {
      S.banana = p.s + rand(1200, 1900);
      this.pickups.spawnAhead('banana', p.s, this.traffic);
    }
    if (p.s > S.koriander && spawn) {
      S.koriander = p.s + rand(1300, 2300);
      this.pickups.spawnAhead('koriander', p.s, this.traffic);
    }
    for (const it of this.pickups.update(dt, this.t, p, camera, spawn)) {
      if (it.type === 'charge') {
        p.charge(12);
        this.stats.charges++;
        this.audio.chime();
        this.ui.toast('⚡ Lade-Ring: +12 % Akku', 'good');
      } else if (it.type === 'banana') {
        this.stats.bananas++;
        p.sugar = 6;
        this.audio.coin();
        this.thrill('banana', 'Bananensaft');
        this.ui.toast('🍌 Bananensaft! Zuckerschub', 'good');
        if (chance(0.7)) this.chat(pick(CHAT.banana));
      } else {
        this.stats.koriander++;
        p.wobble = 2.2;
        this.audio.bad();
        this.ui.toast('🌿 Koriander … bäh!', 'bad');
        this.cockpit.nomi.setMood('dizzy', 2.5);
        this.burst(CHAT.koriander, 2, 1.5);
      }
    }
  }

  // --- Zuschauer, Spenden, Chat ------------------------------------------------------
  updateViewers(dt) {
    const p = this.player;
    this.watchTraffic(dt);
    // Die Stream-Kasse rechnet: Stimmung, Zuschauer und wer gerade etwas gibt (siehe economy.js). Wie viele
    // zuschauen, hängt an Sendezeit, Stimmung und Trubel – nicht an der gefahrenen Strecke.
    const d = this.ecoIn;
    const b = this.blitzer;
    d.kmh = p.kmh;
    // in der Tempo-120-Zone ist langsam fahren richtig
    d.limit = !!b && p.s > b.limitS - 200 && p.s < b.endS;
    d.stuck = this.stuck && !d.limit;
    d.leftOpen = this.left.open;
    d.inLeft = p.inLeftLane;
    d.funkloch = this.funkloch > 0;
    for (const e of this.eco.update(dt, d)) this.onStream(e);
    this.viewers = this.eco.viewers;
    this.peakViewers = Math.max(this.peakViewers, this.viewers);
    this.stats.maxViewers = this.peakViewers;
    const best = Math.max(500, this.save.best.viewers || 0);
    if (!this.recordShown && this.viewers > best && this.t > 45) {
      this.recordShown = true;
      this.eco.cheer('record');
      this.bot('victoria', `Neuer Zuschauerrekord: ${fmtNum(Math.round(this.viewers))} Zuschauer!`);
      this.audio.record();
      this.onMood('proud', 1);
      this.burst(CHAT.record, 4, 2.5);
      this.ui.banner('🏆 Neuer Zuschauerrekord!', 3.5);
      if (this.up.konfetti) this.cockpit.addConfetti(30);
    }
  }

  /**
   * Was der Chat am Verkehr sieht: Überholen unterhält, lange hinter jemandem herzuckeln langweilt.
   * Viermal pro Sekunde hinschauen genügt.
   */
  watchTraffic(dt) {
    this.trafficT -= dt;
    if (this.trafficT > 0) return;
    this.trafficT = 0.25;
    const p = this.player;
    const ahead = this.seenAhead;
    let stuck = false;
    for (const c of this.traffic.cars) {
      const ds = c.s - p.s;
      if (ds > 0) {
        ahead.add(c);
        // dicht hinter jemandem auf derselben Spur, ohne schneller zu sein
        if (ds < 34 + c.len / 2 && Math.abs(c.x - p.x) < 1.5 && p.speed < c.speed + 2.5) stuck = true;
      } else if (ahead.delete(c) && p.speed > c.speed + 1) {
        this.stats.overtakes++;
        this.eco.cheer('overtake');
      }
    }
    this.stuck = stuck && p.kmh < 125;
    if (this.stuck && this.eco.stuckT > 9 && this.t > this.stuckChatT) {
      this.stuckChatT = this.t + 25;
      this.chat(pick(CHAT.stuck));
    }
  }

  /** Was das Publikum gerade getan hat (Ereignisse der Stream-Kasse, siehe Economy.update). */
  onStream(e) {
    switch (e.type) {
      case 'donation':
        this.donate(viewerName(), e.amount, chance(0.35) ? pick(SPENDEN_ZWECKE) : '');
        if (chance(0.25)) this.later(0.9, () => this.chat(this.chatLine(CHAT.thanks)));
        break;
      case 'sub': {
        const name = viewerName();
        const gift = e.kind === 'gift';
        const tier = e.tier > 1 ? ` (Stufe ${e.tier})` : '';
        this.bot('james', gift ? `${name} verschenkt ${e.count === 1 ? 'ein Abo' : e.count + ' Abos'} an den Chat! 🎁`
          : e.kind === 'resub' ? `${name} verlängert das Abo${tier} – schon ${e.months} Monate dabei! 🎉`
            : `${name} hat ein Abo abgeschlossen${tier}! 🎉`);
        this.earn(e.amount, 'Abos');
        this.audio.coin();
        this.stats.subs += gift ? e.count : 1;
        if (gift) this.fans.gifts[name] = (this.fans.gifts[name] || 0) + e.count;
        this.eco.donated(e.amount);
        this.burst(gift ? CHAT.subGift : CHAT.sub, gift ? Math.min(3, 1 + e.count) : randInt(1, 2), 2.5);
        break;
      }
      case 'vip': {
        const name = viewerName();
        this.bot('james', e.amount > 7.99 ? `Neuer VIP im Live-Bereich: ${name} – und legt freiwillig ${fmtCent(e.amount)} hin! 👑`
          : `Neuer VIP im Live-Bereich: ${name} (${fmtCent(e.amount)} im Monat) 👑`);
        this.earn(e.amount, 'VIP-Abos');
        this.audio.coin();
        this.stats.vips++;
        this.fans.vips.push(name);
        this.eco.donated(e.amount);
        if (chance(0.7)) this.later(0.8, () => this.chat(this.chatLine(CHAT.vip)));
        break;
      }
      case 'sammel': {
        const S = this.sammel;
        if (!S) break;
        const name = viewerName();
        // der letzte Beitrag schießt meist übers Ziel hinaus: dann kein „22,00 € von 20 €“, sondern Jubel
        const now = e.done ? 'Ziel erreicht! 🎯' : `jetzt ${fmtCent(e.sum)} von ${fmtEuro(e.goal)}`;
        this.donate(name, e.amount, '', { label: 'Sammelaktionen', line: `Sammelaktion: ${name} legt ${fmtCent(e.amount)} dazu – ${now}` });
        if (e.half) this.later(0.6, () => this.bot('claudia', `Sammelaktion »${S.name}«: ${fmtCent(e.sum)} von ${fmtEuro(e.goal)} – ${e.sum * 2 > e.goal ? 'schon über die Hälfte' : 'Halbzeit'}!`));
        if (e.done) this.later(0.9, () => this.finishSammel(S, e.sum));
        break;
      }
      case 'clean':
        // eine volle Minute ohne Kratzer: Das fällt auch dem Chat auf
        if (chance(0.5)) this.chat(this.chatLine(CHAT.clean));
        if (e.amount) this.later(rand(0.9, 2), () => this.donate(viewerName(), e.amount, 'sauberes Fahren'));
        break;
      case 'level':
        // die Stimmung ist deutlich umgeschlagen: Das Sprachstudio sagt es bald an (frühestens eine halbe Minute nach
        // der letzten Ansage, damit es bei einer Laune an der Kante nicht ständig hin und her meldet)
        this.studio.trend = e.level > e.from ? 'up' : 'down';
        this.T.studio = Math.min(this.T.studio, Math.max(2.5, 30 - (this.t - this.studio.moodT)));
        // steigt sie, freut sich Mini Adam mit (sein Gesicht hängt an diesem Ereignis, nie am Stimmungswert selbst)
        if (e.level > e.from) this.onMood('happy', 0.6);
        break;
      default:
        break;
    }
  }

  /** Sammelziel erreicht: Claudia verkündet es – und dann passiert, wofür gesammelt wurde. */
  finishSammel(S, sum) {
    this.sammel = null;
    this.bot('claudia', `Sammelaktion »${S.name}« geschafft: ${fmtCent(sum)} gesammelt! 🎉`);
    this.ui.banner(`🎉 Sammelaktion geschafft: ${S.name}`, 3.5);
    this.audio.record();
    this.eco.cheer('funny');
    this.burst(CHAT.sammelDone, 3, 2.5);
    switch (S.id) {
      case 'konfetti':
        this.cockpit.addConfetti(30);
        this.audio.confetti();
        break;
      case 'hupen':
        for (let i = 0; i < 3; i++) this.later(0.5 + i * 0.45, () => this.audio.horn());
        break;
      case 'kofferraum':
        this.fx.trunk(7);
        break;
      case 'frosch':
        this.fx.green(1.4);
        this.burst(CHAT.frog, 3, 1.5);
        break;
      default:
        this.callPolice('DANKE, CHAT!');
        break;
    }
  }

  updateChat(dt, kappa = 0) {
    this.updateCentOffers(dt, kappa);
    this.chatT -= dt;
    if (this.chatT <= 0) {
      // Die heimliche Stimmung färbt den Chat: wie flott er schreibt und was. Im Regen ist er ohnehin gesprächig.
      const lv = this.eco.level;
      const rainy = this.weather.level > 0.3;
      this.chatT = rand(1.5, 3.8) * clamp(600 / Math.max(this.viewers, 1), 0.75, 1.4) * CHAT_PACE[lv] * (rainy ? 0.9 : 1);
      const pool = rainy && chance(0.22) ? CHAT.rain
        : lv < 2 && chance(lv === 0 ? 0.65 : 0.4) ? CHAT.restless
          : lv > 2 && chance(lv === 4 ? 0.65 : 0.4) ? CHAT.cheerful : CHAT.ambient;
      this.chat(this.chatLine(pool));
    }
  }

  // --- „5 Cent, wenn du …“ ------------------------------------------------------------------
  /**
   * Ein Meme aus dem Stream: Alle paar Minuten bietet jemand lächerliche 5 Cent für eine Albernheit – nie zwei
   * Angebote kurz hintereinander, keins zweimal im selben Stream. Ab und zu passt eins zur Lage (Ziel erreicht,
   * Brunnen oder Elsa in Sicht, Laster vor uns, Regen, lange Gerade); das darf etwas früher kommen. Mini Adam geht nie
   * darauf ein: kein Geld, keine Aufgabe, kein Zähler, keine Antwort von NOMI oder dem Sprachstudio. Nur der Chat legt
   * noch 2 Cent drauf, frotzelt, und wer geboten hat, bleibt manchmal stur.
   */
  updateCentOffers(dt, kappa = 0) {
    const C = this.cent5;
    // kappa: Krümmung unter dem Wagen (1/m), kommt mit den Eingaben aus dem Kurs (main.js courseEnv)
    const straight = Math.abs(kappa) < STRAIGHT_KAPPA && this.player.kmh > 90;
    C.straightS = straight ? C.straightS + this.player.speed * dt : 0;
    const T = this.T;
    // nicht ins Funkloch (da schreiben alle F) und nicht ins Bieter-Chaos oder Duell (da fliegen ohnehin Cent-Beträge;
    // nach einer Ankunft geht es erst mit dem ersten Gebot der neuen Runde los)
    if (T.cent5 > 100 || this.funkloch > 0) return;
    const lage = C.lage ? this.offerSituation() : null;
    const bidding = this.bidPlan.kind === 'chaos' || this.bidPlan.kind === 'duel';
    if (bidding && !(lage === 'ziel' && this.roundNew)) return;
    if (T.cent5 > 0 && !(lage && T.cent5 < OFFER_EARLY[lage])) return;
    let pool = lage ? CHAT.fuenfCentLage[lage].filter((x) => !C.used.has(x)) : [];
    if (!pool.length) {
      // früher nur mit einem Angebot zur Lage; ist die Uhr abgelaufen, eins aus dem großen Vorrat
      if (T.cent5 > 0) return;
      pool = CHAT.fuenfCent.filter((x) => !C.used.has(x));
    }
    T.cent5 = rand(170, 290);
    C.lage = chance(LAGE_SHARE);
    // alle schon dran: Für heute hat der Chat genug geboten
    if (!pool.length) return;
    const text = pick(pool);
    C.used.add(text);
    const name = viewerName();
    C.name = name;
    // „5 Cent“ und „2 Cent“ brechen nie zwischen Zahl und Wort um
    const nb = (s) => s.replace(/(\d) Cent/g, '$1\u00a0Cent');
    this.chat(nb(text), name);
    // ein paar Sekunden lang plaudert der Chat nicht dazwischen, damit man das Angebot lesen kann (am Handy steht oft
    // nur eine Zeile); Nachschlag und Frotzelei kommen von anderen Zuschauern
    this.chatT = Math.max(this.chatT, 4.5);
    const other = () => {
      let n = viewerName();
      for (let i = 0; i < 8 && n === name; i++) n = viewerName();
      return n;
    };
    if (chance(0.5)) this.later(rand(2.6, 3.8), () => this.chat(nb(this.chatLine(CHAT.fuenfCentDrauf)), other()));
    if (chance(0.35)) this.later(rand(5, 7), () => this.chat(nb(this.chatLine(CHAT.fuenfCentNecken)), other()));
    if (chance(0.15)) this.later(rand(30, 55), () => {
      if (C.name === name && this.funkloch <= 0) this.chat(nb(pick(CHAT.fuenfCentStur)), name);
    });
  }

  /** Wozu gerade ein „5 Cent“-Angebot passt – nur, was es in diesem Moment wirklich gibt (sonst null). */
  offerSituation() {
    const p = this.player;
    // gerade angekommen: nach Jubel und Ortsspenden, solange noch niemand fürs nächste Ziel bietet
    const since = this.t - this.cent5.arrivedT;
    if (since > 0.6 && since < 20 && this.roundNew) return 'ziel';
    const lm = this.landmark;
    // Brunnen und Elsa erst, wenn der Jubel über die Sichtung durch ist – sonst rutscht das Angebot gleich wieder weg
    if (lm && lm.seen && this.t - lm.seenT > 2.5) {
      const d = lm.s - p.s;
      if (lm.type === 'brunnen' && d > 40 && d < 240) return 'brunnen';
      // Elsa nur, solange sie frei in der Scheibe steht (dann steht auch ihr Hinweis da, siehe elsaView)
      if (lm.type === 'elsa' && lm.toast && d > 40) return 'elsa';
    }
    for (const c of this.traffic.cars) {
      const d = c.s - p.s;
      if (c.truck && d > 25 && d < 110 && Math.abs(c.x - p.x) < 2) return 'laster';
    }
    if (this.weather.level > 0.4) return 'regen';
    if (this.cent5.straightS > STRAIGHT_RUN) return 'gerade';
    return null;
  }

  // --- Sprachstudio ---------------------------------------------------------------------
  /**
   * Die ruhige Stimme in Mini Adams Ohr liest den Chat mit und sagt, wie er drauf ist: der einzige Weg, auf dem die
   * heimliche Chat-Stimmung nach außen kommt (als Satz, nie als Zahl oder Balken). Etwa einmal pro Minute und wenn
   * die Stimmung deutlich umschlägt – aber nie, während NOMI oder eine Sprachdurchsage zu hören ist. Dazwischen gibt
   * es höchstens einmal etwas anderes weiter (den Dank für eine große Spende, einen Kassensturz) und begrüßt, wer neu
   * im Chat Hallo sagt.
   */
  updateStudio() {
    const S = this.studio;
    const T = this.T;
    // Kassensturz bei jeder runden Summe, und ab und zu ein Gruß an jemanden, der neu im Chat ist
    if (this.money >= S.mark) {
      const step = S.mark < 2000 ? 500 : 1000;
      S.mark = (Math.floor(this.money / step) + 1) * step;
      S.extra = S.extra || { kind: 'total', until: this.t + 30 };
    }
    if (T.greet <= 0) {
      T.greet = rand(150, 240);
      // wer neu ist, meldet sich erst im Chat – und das Sprachstudio begrüßt genau ihn, sobald es Luft hat
      if (!S.greet) {
        const name = viewerName();
        S.greet = { name, until: this.t + 40 };
        this.chat(this.chatLine(CHAT.newViewer), name);
      }
    }
    if (S.extra && this.t > S.extra.until) S.extra = null;
    if (S.greet && this.t > S.greet.until) S.greet = null;
    const x = S.extra;
    // Außer der Reihe nur mit Abstand: zur letzten Zugabe, zum letzten Satz und zur nächsten Stimmungsansage. Nur ein
    // „Alter!“ muss gleich raus, sobald niemand spricht – die Stimmungsansage wartet dann einen Moment (und hält auch
    // sonst ein paar Sekunden Abstand zum letzten Satz, etwa wenn die Stufe gleich nach einem Dank wechselt). Ein Gruß
    // wartet nicht auf die Pause zwischen den Zugaben: Der Neue hat ja schon Hallo gesagt.
    const alter = x?.kind === 'alter' && this.t - S.last > 3;
    const mood = !alter && T.studio <= 0 && this.t - S.last > 8;
    const greet = !alter && !mood && S.greet && this.t - S.last > 10 && T.studio > 6;
    if (!alter && !mood && !greet && !(x && this.t - S.extraT > 75 && this.t - S.last > 15 && T.studio > 10)) return;
    if (this.funkloch > 0 || this.t < this.voiceUntil + 0.6 || this.t < this.studioUntil || this.speech.busy || this.speech.queue.length) return;
    let text;
    if (mood) {
      // Woran es liegt, sagt es gern dazu: bei guter Laune das Schöne, bei schlechter den Kummer – und in der Mitte
      // das, was die Stimmung gerade dorthin gebracht hat.
      const lv = this.eco.level;
      const dir = lv > 2 ? 'up' : lv < 2 ? 'down' : S.trend;
      const why = dir && chance(0.75) ? this.eco.why(dir, S.why) : null;
      if (lv === 2 && S.trend) text = this.fresh(STUDIO.turn[S.trend], 'turn' + S.trend);
      else text = why ? this.fresh(STUDIO.short[lv], 'short' + lv) : this.fresh(STUDIO.levels[lv], 'level' + lv);
      if (why) {
        text += ' ' + this.fresh(STUDIO.why[dir][why], dir + why);
        S.why = why;
      }
      S.trend = null;
      S.moodT = this.t;
      T.studio = rand(52, 72);
    } else if (greet) {
      text = fillTemplate(this.fresh(STUDIO.greet, 'greet'), { name: S.greet.name });
      S.greet = null;
    } else {
      S.extra = null;
      S.extraT = this.t;
      if (alter) {
        text = fillTemplate(this.fresh(STUDIO.alter, 'alter'), { name: x.name, betrag: fmtCent(x.amount) });
        T.studio = Math.max(T.studio, 12);
      } else if (x.kind === 'thanks') text = fillTemplate(this.fresh(STUDIO.thanks, 'thanks'), { name: x.name, betrag: fmtCent(x.amount) });
      else text = fillTemplate(this.fresh(STUDIO.total, 'total'), { summe: fmtEuro(Math.floor(this.money)) });
    }
    // ein leiser Zweiklang, damit man hört, dass jetzt nicht NOMI spricht
    this.audio.tone(659.25, 0.16, 'sine', 0.05);
    this.audio.tone(523.25, 0.24, 'sine', 0.05, 0.13);
    const dur = this.speech.say(text.replace(/_/g, ' '), 'sprachstudio');
    this.ui.studio(text, dur + 0.8);
    S.last = this.t;
    this.studioUntil = this.t + dur + 0.8;
  }

  /** Ein Satz aus der Liste, aber keiner der beiden zuletzt gesagten (key: je Liste ein Gedächtnis). */
  fresh(list, key) {
    const used = this.studio.used[key] || (this.studio.used[key] = []);
    const i = pick(list.map((_, n) => n).filter((n) => !used.includes(n)));
    used.push(i);
    if (used.length > Math.min(2, list.length - 1)) used.shift();
    return list[i];
  }

  // --- Jobs ---------------------------------------------------------------------------
  updateJobs() {
    const st = this.stats;
    let changed = false;
    let last = null;
    for (const j of this.jobs) {
      if (j.done) continue;
      const v = st[j.stat] || 0;
      const prog = clamp(v / j.goal, 0, 1);
      // erst neu zeichnen, wenn sich der Balken sichtbar bewegt (sonst summieren sich kleine Schritte nie)
      if (Math.abs(prog - j.progress) > 0.01) {
        j.progress = prog;
        changed = true;
      }
      if (v >= j.goal - 0.5) {
        j.done = true;
        j.progress = 1;
        changed = true;
        last = j;
        this.ui.toast(`✅ Job erledigt: ${j.text}`, 'good');
        this.audio.chime();
        this.chat(pick(CHAT.fiveJobs));
        // Geld gibt es, weil jemand genau das versprochen hat – und Wort hält
        this.eco.cheer('challenge');
        this.later(1, () => this.donate(j.pledger, j.pledge, '', { label: 'Challenges', line: `${j.pledger} hält Wort: ${fmtCent(j.pledge)} für »${j.text}«` }));
      }
    }
    if (changed) this.ui.jobs(this.jobs);
    if (!this.allJobsPaid && this.jobs.every((j) => j.done)) {
      this.allJobsPaid = true;
      const A = this.allJobs;
      // Kam der letzte Job mit einer Ankunft (Navi-Ziel, Supercharger), gehört das Banner erst dem Ziel – die Feier
      // für alle fünf folgt, wenn es durch ist, statt es gleich wieder zu verdrängen
      const wait = last && (last.stat === 'naviReached' || last.stat === 'charges') ? 3.6 : 0;
      this.later(wait, () => {
        this.bot('victoria', 'You had 5 Jobs – und alle erledigt! 🏆');
        this.onMood('proud', 1);
        this.later(2.4, () => this.donate(A.pledger, A.pledge, '', { label: 'Challenges', line: `${A.pledger} hatte ${fmtBetrag(A.pledge)} auf alle fünf Jobs gesetzt – und zahlt mit Freuden!` }));
        this.audio.record();
        this.ui.banner('🏆 Alle 5 Jobs erledigt!', 4);
      });
    }
  }

  // --- Tasten ---------------------------------------------------------------------------
  honk() {
    this.audio.horn();
    this.lastHorn = this.t;
    this.onMood('startled', 0.45);
    if (chance(0.12)) this.chat(pick(['Bimmel hurra! 📯', 'HUP HUP', 'Hupkonzert!']));
  }

  useMegafon() {
    if (!this.up.megafon) {
      this.ui.toast('📢 Das Megafon gibt es im Tesla-Shop', 'info');
      return;
    }
    if (this.megafonCd > 0) {
      this.ui.toast(`📢 Megafon lädt noch (${Math.ceil(this.megafonCd)} s)`, 'info');
      return;
    }
    this.megafonCd = 15;
    this.audio.megafon();
    const n = this.traffic.megafon(this.player);
    this.speech.say('Achtung, Achtung! Bitte machen Sie die Spur frei!', 'william');
    this.voiceUntil = Math.max(this.voiceUntil, this.t + 4);
    this.eco.cheer('megafon');
    this.onMood('megafon', 2.6);
    this.ui.toast(n ? `📢 ${n} Fahrzeug${n > 1 ? 'e machen' : ' macht'} Platz` : '📢 Durchsage!', 'info');
    this.chat(pick(['Wie in Gifhorn 📢', 'MEGAFON 😂', 'Platz da!']));
  }

  // --- Unfälle -------------------------------------------------------------------------------
  onCrash(e) {
    const p = this.player;
    if (!p.collide(e)) return;
    this.stats.crashes++;
    this.stats.cleanDistance = 0;
    this.eco.cheer('crash');
    this.audio.crash(e.zone, e.power);
    this.fx.shake(1, e.zone);
    this.onMood('ouch', 1);
    this.cockpit.nomi.setMood('dizzy', 3);
    const left = p.maxHits - p.hits;
    this.ui.damage(p.hits, p.maxHits);
    // NOMI tröstet (nie über Verletzungen): erster Rempler, weitere, der letzte Punkt
    if (left > 0) this.later(0.6, () => this.say(damageLine(left === 1 ? 'last' : p.hits === 1 ? 'first' : 'more', e.zone), left === 1 ? 'worried' : 'talk', { priority: false }));
    if (e.car.behavior === 'polizei') this.chat('Ausgerechnet die Polizei Gifhorn 😱');
    this.burst(CHAT.crash, 3, 2);
    if (left <= 0) {
      this.end('werkstatt');
      return;
    }
    this.ui.toast(left === 1 ? '🧸 Rempler! Nur noch ein Karosserie-Punkt!' : `🧸 Rempler! Noch ${left} Karosserie-Punkte`, 'bad');
  }

  onNearMiss(e) {
    this.stats.nearMisses++;
    this.thrill('nearMiss', 'dieses Manöver');
    this.onMood('startled', 0.75);
    if (chance(0.5)) this.chat(pick(CHAT.nearMiss));
  }

  // --- Ende ------------------------------------------------------------------------------------
  end(reason) {
    if (this.over) return;
    this.running = false;
    const p = this.player;
    const km = p.s / 1000;
    this.over = {
      reason,
      distance: p.s,
      money: Math.max(0, Math.round(this.money * 100) / 100),
      breakdown: { ...this.breakdown },
      jobs: this.jobs.map((j) => ({ text: j.text, done: j.done, pledge: j.pledge, pledger: j.pledger })),
      fans: this.supporters(),
      stats: { ...this.stats },
      peakViewers: Math.round(this.peakViewers),
      beruf: berufFor(km),
      time: this.t,
      clock: fmtClock(this.clock),
      naviHistory: this.navi.history.slice(-5),
    };
    this.speech.stopAll();
    if (reason === 'akku') this.say('Akku leer. Die Stream-Technik verabschiedet sich.', 'sleep');
    else if (reason === 'werkstatt') this.say('Bitte einen Werkstatttermin vereinbaren.', 'dizzy');
    if (reason === 'akku' || reason === 'werkstatt') this.onMood(reason === 'akku' ? 'sleepy' : 'ouch', 1);
  }

  /**
   * Wem der Abspann dankt – wie im echten SkylineTV-Abspann, der die Unterstützenden nach VIPs und Abo-Verschenkern
   * aufteilt: die größte Spende, die eifrigsten Verschenker (meiste Abos zuerst) und die neuen VIPs.
   */
  supporters() {
    const F = this.fans;
    const gifters = Object.entries(F.gifts).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
    return { top: F.top, gifters, vips: F.vips.slice() };
  }

  /** Daten für den Mittelbildschirm. */
  screenState() {
    const p = this.player;
    const W = this.weather;
    const limit = this.blitzer && p.s > this.blitzer.limitS && p.s < this.blitzer.endS ? 120 : null;
    return {
      dark: W.level > 0.45,
      battery: p.battery,
      speedKmh: p.kmh,
      limit,
      playerX: p.x,
      leftLane: this.left.open ? this.left.timer : 0,
      cars: this.traffic.nearby(p, 125),
      s: p.s,
      navi: this.navi.screen(p.s, this.clock, p.speed),
      clock: fmtClock(this.clock),
      temp: Math.round(17 - W.level * 6),
      funkloch: this.funkloch > 0 ? 1 : 0,
      wiperOn: W.level > 0.05,
      damage: p.damage,
    };
  }
}

export { KMH };
