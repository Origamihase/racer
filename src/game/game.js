// Eine Fahrt: Regie für alle Ereignisse (linke Spur, Navi-Gebote, Regen, Blitzer, Polizei Gifhorn,
// Sprachdurchsagen, Rahmen, Funkloch, Zuschauer, Spenden, Jobs) und die Abrechnung am Ende.
import {
  CHAT, BOTS, BOARD, DURCHSAGEN, DURCHSAGEN_REGEN, RAHMEN, VOICES, JOB_TEMPLATES,
  viewerName, fillTemplate, alterReaction, randomDonation, berufFor,
} from '../data.js';
import { clamp, rand, randInt, chance, pick, shuffle, damp, fmtCent, fmtNum, fmtClock } from '../util.js';
import { Player, KMH } from './player.js';
import { damageLine } from './damage.js';
import { Navi, shortName } from './navi.js';
import { Vector3 } from 'three';
import { EYE } from '../cockpit/cockpit.js';
import { ELSA_STATUE } from '../world/scenery.js';
import { curvePoint } from '../curve.js';

const POLICE_TEXTS = ['POLIZEI GIFHORN', 'GUTE FAHRT, ADAM!', 'GIFHORN GRÜSST', 'BITTE LÄCHELN'];
// Rechts oben deckt der Innenspiegel aus Mini Adams Sicht ab etwa 17,8° rechts der Blickrichtung ab
// (auf dem Handy hochkant endet dort fast schon das Bild): bis 16° steht Elsa frei in der Scheibe.
const ELSA_VIEW = (16 * Math.PI) / 180;
// Elsas Kopf an der Statue (Maßstab 1): Kronenspitze, Kinn und halbe Kopfbreite in Metern
const ELSA_HEAD = { top: 5.65, chin: 3.1, half: 1.3 };
const elsaTmp = new Vector3();

export class Game {
  /**
   * @param {object} ctx traffic, scenery, road, sky, rain, windshield, cockpit, audio, speech, ui, fx, pickups
   */
  constructor(ctx) {
    Object.assign(this, ctx);
    this.player = new Player();
    this.navi = new Navi(this.scenery);
    // Entfernung zum Navi-Ziel ab der Schilderbrücke (die wird gut 1,7 km voraus gebaut)
    this.scenery.gantryInfo = (sSign = this.player.s) => {
      const km = (this.navi.targetS - sSign) / 1000;
      if (km < 0.2) return null;
      return { target: shortName(this.navi.target), km };
    };
    this.running = false;
    this.over = null;
    // XXL-Welt: abseits der Autobahn ruhen Ereignisse, die nur dort Sinn ergeben (setzt main.js jedes Bild)
    this.offAutobahn = false;
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
    this.viewers = 240;
    this.hype = 0;
    this.peakViewers = 240;
    this.recordShown = false;
    this.lastHorn = -99;
    this.megafonCd = 0;
    this.leftTick = 0;
    this.chatT = 1.5;
    this.donationT = rand(6, 10);
    this.stats = {
      leftLaneTime: 0, naviReached: 0, nearMisses: 0, maxSpeedKmh: 0, bananas: 0, cleanDistance: 0, naviChanges: 0,
      maxViewers: 0, charges: 0, distance: 0, blitzerClean: 0, rainDistance: 0, crashes: 0, koriander: 0, fines: 0,
      wipes: 0, twitches: 0, photos: 0,
    };
    this.jobs = shuffle(JOB_TEMPLATES).slice(0, 5).map((j) => ({ ...j, done: false, progress: 0 }));
    this.allJobsPaid = false;

    // Linke Spur
    const ls = up.linksspur || 0;
    this.left = { open: false, timer: 0, next: rand(22, 30), warned: false, glow: 0, rg: 0, grace: 0, bonusMul: 1 + 0.25 * ls, freq: 1 - 0.14 * ls, earned: 0 };
    // Wetter
    this.weather = { level: 0, target: 0, active: false, dur: 0, cool: 0, announced: false, regenzulage: false };
    // Ereignis-Uhren (Sekunden) und Strecken-Marken (Meter)
    this.T = {
      bid: rand(38, 52), durchsage: rand(28, 40), rahmen: rand(70, 100), funkloch: rand(110, 170), frog: rand(160, 260),
      trunk: rand(120, 200), numbers: rand(80, 130), police: rand(200, 300), wiperChat: 0,
    };
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
    this.navi.reset(0);
    this.traffic.reset();
    this.traffic.populate(0, p.speed);
    this.pickups.reset();
    this.speech.stopAll();
    this.windshield.clear();
    this.windshield.setRain(0);
    this.windshield.setFirmware(up.wischer || 0);
    this.windshield.onEvent = (type) => this.onWiper(type);
    this.cockpit.clearConfetti();
    this.cockpit.setElsa(!!up.elsa);
    this.ui.reset?.();
    this.ui.jobs(this.jobs);
    this.bot('hugo', 'Der Stream läuft! Viel Spaß beim Zuschauen.');
    this.later(1.2, () => this.chat('Hallo Mini Adam ❤'));
    this.later(2.0, () => this.chat('Wohin fahren wir heute?'));
    this.later(3.2, () => this.bot('james', `Startgebot: ${fmtCent(this.navi.bid)} – Ziel: ${this.navi.target.name}`));
  }

  /** Vorführmodus für den Titelbildschirm: nur fahren, kein Stream-Trubel. */
  startDemo() {
    this.running = false;
    this.over = null;
    this.demoT = 0;
    this.player.reset({});
    this.player.x = 1.875;
    this.player.speed = 118 * KMH;
    this.weather = { level: 0, target: 0, active: false, dur: 0, cool: 0, announced: false, regenzulage: false };
    this.left = { open: false, timer: 0, glow: 0 };
    this.sirenLevel = 0;
    // nach einer Regenfahrt: Scheibe trocken, Wischer still
    this.windshield.setRain(0);
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
    if (this.navi.arrived) this.navi.overbid(p.s, 'Demo');
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
  }

  burst(pool, n = 3, spread = 2.5) {
    const list = typeof pool === 'function' ? null : pool;
    for (let i = 0; i < n; i++) {
      this.later(rand(0.1, spread), () => this.chat(list ? pick(list) : pool()));
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
    };
    if (this.running) this.later(0.35, go);
    else go();
  }

  earn(amount, label, { mult = true, silent = false } = {}) {
    if (amount <= 0) return 0;
    const m = mult && this.weather.regenzulage ? 1.5 : 1;
    const v = amount * m;
    this.money += v;
    this.breakdown[label] = (this.breakdown[label] || 0) + v;
    if (!silent) this.ui.money(v, label);
    return v;
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

  donate(name, amount, what) {
    // Angesagt wird, was der Zuschauer zahlt; Starlink-Bonus und Regenzulage zeigt nur die Gutschrift
    const v = this.earn(amount * (this.up.starlink ? 1.2 : 1), 'Spenden', { silent: true });
    this.bot('james', `${name} hat ${fmtCent(amount)} ${what ? 'für »' + what + '« ' : ''}gespendet!`);
    this.ui.money(v, 'Spende');
    this.audio.pling();
    const alter = alterReaction(amount);
    if (alter) this.later(0.6, () => this.chat(alter + (amount >= 33 ? ' 😱' : '')));
    this.hype += v * 2;
    return v;
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
        if (e.hard && chance(0.4)) this.chat(pick(['Leitplanke! 😬', 'Uff, die Leitplanke', 'Kratz kratz']));
      } else if (e.type === 'understeer' && this.t > (this.understeerSaid ?? -99) + 25) {
        // zu schnell für die Kurve: NOMI sagt es freundlich (höchstens alle 25 s)
        this.understeerSaid = this.t;
        this.say(damageLine('understeer'), 'worried', { priority: false });
      }
    }
    st.distance = p.s;
    st.maxSpeedKmh = Math.max(st.maxSpeedKmh, p.kmh);
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
    this.updateChat(dt);
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
      if (p.inLeftLane) {
        const rate = 1.25 * (0.45 + 0.55 * clamp(p.speed / 50, 0, 1.3)) * L.bonusMul;
        const v = this.earn(rate * dt, 'Linke Spur', { silent: true });
        L.earned += v;
        this.leftTick += v;
        this.stats.leftLaneTime += dt;
        if (this.leftTick >= 1) {
          this.ui.money(this.leftTick, 'Linke Spur');
          this.leftTick = 0;
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
    L.timer = 60;
    L.warned = false;
    const name = viewerName();
    this.say(BOARD.leftLane, 'happy');
    this.audio.chime();
    this.later(0.2, () => this.donate(name, pick([3.33, 5, 2.5, 10, 4.2]), 'Linke Spur freischalten'));
    this.burst(CHAT.leftLane, 3, 3);
    this.ui.banner('⬅️ Linke Spur freigeschaltet!', 4, 'Eine Minute Bonusguthaben auf der ganz linken Spur');
    this.hype += 40;
  }

  closeLeftLane() {
    const L = this.left;
    L.open = false;
    L.next = rand(45, 70) * L.freq;
    L.grace = 5;
    this.say(BOARD.leftLaneEnd, 'idle');
    if (L.earned > 0.5) this.ui.toast(`⬅️ Linke Spur: ${fmtCent(L.earned)} Bonusguthaben`, 'good');
    L.earned = 0;
    this.burst(CHAT.leftLaneEnd, 2, 2.5);
  }

  // --- Wetter ------------------------------------------------------------------
  updateWeather(dt, ds) {
    const W = this.weather;
    const p = this.player;
    if (!W.active) {
      W.cool -= dt;
      const skilled = p.s >= 4000 && this.stats.cleanDistance >= 2500;
      if (W.cool <= 0 && (skilled || p.s >= 7500)) {
        W.active = true;
        W.target = rand(0.6, 1);
        W.dur = rand(95, 150);
        W.announced = false;
      }
    } else {
      W.dur -= dt;
      if (W.dur <= 0) {
        W.active = false;
        W.target = 0;
        W.cool = rand(60, 100);
        this.later(8, () => this.chat(pick(['Endlich trocken ☀️', 'Regen vorbei!', 'Der Wischer hat sich erholt'])));
      }
    }
    const rate = W.target > W.level ? 0.07 : 0.05;
    W.level += clamp(W.target - W.level, -rate * dt, rate * dt);
    if (W.active && !W.announced && W.level > 0.12) {
      W.announced = true;
      this.say(BOARD.rain, 'worried');
      this.burst(CHAT.rainStart, 3, 4);
      this.later(4, () => this.ui.banner('🌧️ Regenzulage!', 4, 'Solange es regnet, gibt es 1,5-fach Guthaben'));
      this.audio.whoosh();
    }
    W.regenzulage = W.level > 0.3;
    this.windshield.setRain(W.level);
  }

  onWiper(type) {
    if (type === 'twitch') {
      this.audio.wiperTwitch();
      this.stats.twitches++;
    } else {
      this.audio.wiperSweep();
      this.stats.wipes++;
    }
    if (this.running && type === 'twitch' && this.T.wiperChat <= 0 && this.weather.level > 0.2 && chance(0.3)) {
      this.T.wiperChat = 14;
      this.chat(pick(CHAT.wiper));
    }
  }

  manualWiper() {
    const r = this.windshield.manual();
    if (r === 'wipe') this.ui.toast('🌧️ Wisch! Klare Sicht.', 'info');
    else if (r === 'twitch') {
      this.ui.toast('🌧️ Der Wischer zuckt nur …', 'info');
      if (chance(0.4)) this.chat(pick(CHAT.wiper));
    }
  }

  // --- Navi ------------------------------------------------------------------------
  updateNavi(dt) {
    const p = this.player;
    if (this.T.bid <= 0) {
      this.T.bid = rand(36, 72);
      if (chance(0.16)) {
        // Siegen wird geboten … und sofort überboten
        const n = viewerName();
        // das Siegen-Gebot zählt wirklich, damit das Gegengebot danach mindestens 1 Cent mehr ist
        this.navi.bid = Math.round((this.navi.bid + 0.01) * 100) / 100;
        this.bot('james', `${n} bietet ${fmtCent(this.navi.bid)} – neues Ziel: Siegen`);
        this.chat(pick(['SIEGEN!', 'Siegen? 👀', 'Diesmal Siegen!']));
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

  changeNavi(siegenOverbid) {
    const p = this.player;
    const bidder = viewerName();
    const t = this.navi.overbid(p.s, bidder);
    this.scenery.relabelGantries();
    this.stats.naviChanges++;
    this.bot('james', `${bidder} bietet ${fmtCent(this.navi.bid)} – neues Ziel: ${t.name}`);
    if (siegenOverbid) this.later(0.8, () => this.chat(pick(['Siegen wurde überboten. Wie immer 😂', 'Nicht schon wieder Siegen verpasst', 'Klassiker'])));
    this.say(BOARD.naviChanged, 'think');
    this.audio.naviAlert();
    this.burst(CHAT.naviChanged, 2, 3);
    if (t.special === 'siegen') this.later(1.4, () => this.chat('SIEGEN SETZT SICH DURCH?! 😱'));
    if (this.navi.wende) this.later(3.5, () => this.ui.toast('↩️ Navi: „Bitte wenden“ – auf der Autobahn?', 'info'));
    this.ui.toast(`📍 Neues Navi-Ziel: ${t.name} (${fmtNum(this.navi.km, 1)} km)`, 'info', t.note);
    this.hype += 25;
  }

  onArrive(e) {
    const p = this.player;
    const t = e.target;
    this.stats.naviReached++;
    let bonus = Math.round(20 + e.km * 14);
    if (t.special === 'siegen') bonus *= 2;
    this.say(BOARD.arrived, 'love');
    this.audio.jingle();
    // klassisches Spiel: an jedem erreichten Navi-Ziel wird ein Karosserie-Punkt repariert (mit Pflaster)
    if (p.repair(1)) {
      this.ui.damage(p.hits, p.maxHits);
      this.later(2.2, () => this.ui.toast('🩹 ' + damageLine('repair'), 'good'));
    }
    this.earn(bonus, 'Navi-Ziele');
    this.ui.banner(`🏁 Ziel erreicht: ${t.name}`, 4);
    this.burst(CHAT.naviReached, 4, 3);
    this.hype += 120;
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
        this.later(4.5, () => this.say('Meister Propper ist leider noch nicht da.', 'worried', { priority: false }));
        this.later(6, () => this.chat(pick(['Wie immer 😂', 'Er ist bestimmt gleich da', 'Fünf Minuten noch!'])));
        break;
      case 'malte':
        this.burst(['Malte Malte Malte Malte', 'MALTE!', 'MaLTE', 'Malte ist eingestiegen ✔️'], 5, 3);
        break;
      case 'siegen':
        this.burst(['SIEGEN!!! Es ist tatsächlich passiert 😱', 'Geschichte wurde geschrieben', 'Doppelter Bonus für Siegen!'], 3, 2);
        break;
      case 'sparkasse':
        this.later(1.5, () => this.ui.chat({ name: 'Wissenschaftlicher Dienst', text: `🔬 Ergebnis: Die Sparkasse ist ${this.navi.sparkColor}.`, bot: 'claudia', icon: '🔬' }));
        break;
      case 'pommes':
        this.earn(10, 'Navi-Ziele');
        this.burst(['Pommes ohne Rückfragen 🍟', 'Mit Mayo!', 'Keine Rückfragen!'], 3, 2);
        break;
      case 'bude':
        this.burst(['Diesmal die richtige Bude! 🌭', 'Falsche Bude? 😂', 'Currywurst!'], 3, 2);
        break;
      default:
        break;
    }
    // nach kurzer Zeit kommt das nächste Gebot
    this.T.bid = Math.min(this.T.bid, rand(6, 10));
  }

  // --- Ereignisse ------------------------------------------------------------------
  updateEvents(dt, camera) {
    const p = this.player;
    const T = this.T;
    for (const k of Object.keys(T)) T[k] -= dt;

    // Sprachdurchsage
    if (T.durchsage <= 0) {
      T.durchsage = rand(48, 85);
      const pool = this.weather.level > 0.3 && chance(0.5) ? DURCHSAGEN_REGEN : DURCHSAGEN;
      const d = pick(pool);
      const text = fillTemplate(d.text);
      const name = viewerName();
      this.donate(name, 3, 'Sprachdurchsage');
      this.later(1.2, () => {
        const dur = this.speech.say(text, d.voice);
        this.ui.durchsage(VOICES[d.voice].label, text, dur + 1, name);
      });
    }

    // Rahmen
    if (T.rahmen <= 0 && p.s > 1000) {
      T.rahmen = rand(75, 130);
      const r = pick(RAHMEN);
      const name = viewerName();
      this.donate(name, r.price, r.name);
      this.ui.rahmen(r, name);
      this.later(2, () => this.chat(pick(CHAT.rahmen)));
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
        this.fx.glitch(this.funkloch);
        this.ui.funkloch(true);
        this.burst(CHAT.funkloch, 5, 1.6);
        if (chance(0.5)) this.later(0.5, () => this.say(BOARD.funkloch, 'worried', { priority: false }));
      } else if (chance(0.5)) {
        this.chat(pick(['Starlink sei Dank: kein Funkloch 🛰️', 'Bild bleibt stabil ✔️', 'Starlink 🔥']));
      }
    }

    // Frosch-Flackern
    if (T.frog <= 0) {
      T.frog = rand(170, 300);
      this.fx.green(1.4);
      this.burst(CHAT.frog, 4, 1.5);
    }

    // Kofferraum (Bitspende)
    if (T.trunk <= 0 && p.s > 2000) {
      T.trunk = rand(140, 220);
      const name = viewerName();
      this.donate(name, 5, 'Kofferraum öffnen');
      this.fx.trunk(7);
      this.burst(CHAT.trunk, 3, 2.5);
    }

    // Zahlen im Chat
    if (T.numbers <= 0) {
      T.numbers = rand(90, 150);
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
        } else {
          this.stats.blitzerClean++;
          this.earn(5, 'Vorbildlich');
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

    // Brunnen und Elsa am Straßenrand (Hupen bringt Bonus)
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
          this.earn(10, 'BrunnenTV');
          this.audio.brunnenJingle();
          this.later(0.5, () => this.speech.say('Ein sehr schöner Brunnen.', 'schoennbrun'));
          this.ui.toast('⛲ BrunnenTV-Bonus!', 'good');
        } else {
          this.earn(10, 'Elsa-Gruß');
          this.cockpit.nomi.setMood('love', 2.5);
          this.scenery.waveBack(lm.id);
          // Antwort statt Hinweis; ist sie schon hinter dem Spiegel oder vorbei, winkt sie hinterher
          this.elsaToast(lm, null);
          const reply = this.ui.toast(view.visible ? '👑 Elsa winkt zurück!' : '👑 Elsa winkt dir hinterher!', 'good');
          if (view.visible) this.elsaToast(lm, reply);
        }
        this.hype += 60;
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
        this.earn(15, 'Bananensaft');
        this.ui.toast('🍌 Bananensaft! Zuckerschub', 'good');
        if (chance(0.7)) this.chat(pick(CHAT.banana));
      } else {
        this.stats.koriander++;
        p.wobble = 2.2;
        this.fine(5, 'Koriander');
        this.ui.toast('🌿 Koriander … bäh!', 'bad');
        this.cockpit.nomi.setMood('dizzy', 2.5);
        this.burst(CHAT.koriander, 2, 1.5);
      }
    }
  }

  // --- Zuschauer, Spenden, Chat ------------------------------------------------------
  updateViewers(dt) {
    const p = this.player;
    const km = p.s / 1000;
    this.hype *= Math.exp(-dt * 0.04);
    let target = 220 + 95 * km + 25 * Math.sin(this.t / 23) + this.hype;
    if (this.up.starlink) target *= 1.25;
    if (this.funkloch > 0) target *= 0.8;
    this.viewers = damp(this.viewers, target, 0.4, dt);
    this.peakViewers = Math.max(this.peakViewers, this.viewers);
    this.stats.maxViewers = this.peakViewers;
    const best = Math.max(500, this.save.best.viewers || 0);
    if (!this.recordShown && this.viewers > best && p.s > 1500) {
      this.recordShown = true;
      this.bot('victoria', `Neuer Zuschauerrekord: ${fmtNum(Math.round(this.viewers))} Zuschauer!`);
      this.audio.record();
      this.burst(CHAT.record, 4, 2.5);
      this.ui.banner('🏆 Neuer Zuschauerrekord!', 3.5);
      if (this.up.konfetti) this.cockpit.addConfetti(30);
    }
    this.donationT -= dt;
    if (this.donationT <= 0) {
      this.donationT = rand(8, 17) * clamp(500 / Math.max(this.viewers, 1), 0.5, 1.5);
      const name = viewerName();
      const v = randomDonation(1, 22);
      this.donate(name, v);
      if (chance(0.35)) this.later(0.9, () => this.chat(pick(['Danke!', 'Ehrenmensch 🙏', 'Bimmel hurra!', 'Fünftel-Alter', '❤'])));
    }
  }

  updateChat(dt) {
    this.chatT -= dt;
    if (this.chatT <= 0) {
      this.chatT = rand(1.3, 3.4) * clamp(600 / Math.max(this.viewers, 1), 0.6, 1.4);
      this.chat(pick(CHAT.ambient));
    }
  }

  // --- Jobs ---------------------------------------------------------------------------
  updateJobs() {
    const st = this.stats;
    let changed = false;
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
        this.earn(25, 'Jobs', { mult: false });
        this.ui.toast(`✅ Job erledigt: ${j.text}`, 'good');
        this.audio.chime();
        this.chat(pick(CHAT.fiveJobs));
      }
    }
    if (changed) this.ui.jobs(this.jobs);
    if (!this.allJobsPaid && this.jobs.every((j) => j.done)) {
      this.allJobsPaid = true;
      this.earn(100, 'Jobs', { mult: false });
      this.bot('victoria', 'You had 5 Jobs – und alle erledigt! 100\u00a0€ Bonus!');
      this.audio.record();
      this.ui.banner('🏆 Alle 5 Jobs erledigt!', 4);
    }
  }

  // --- Tasten ---------------------------------------------------------------------------
  honk() {
    this.audio.horn();
    this.lastHorn = this.t;
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
    this.ui.toast(n ? `📢 ${n} Fahrzeug${n > 1 ? 'e machen' : ' macht'} Platz` : '📢 Durchsage!', 'info');
    this.chat(pick(['Wie in Gifhorn 📢', 'MEGAFON 😂', 'Platz da!']));
  }

  // --- Unfälle -------------------------------------------------------------------------------
  onCrash(e) {
    const p = this.player;
    if (!p.collide(e)) return;
    this.stats.crashes++;
    this.stats.cleanDistance = 0;
    this.audio.crash(e.zone, e.power);
    this.fx.shake(1, e.zone);
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
    this.earn(3, 'Haarscharf');
    this.hype += 15;
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
      jobs: this.jobs.map((j) => ({ text: j.text, done: j.done })),
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
