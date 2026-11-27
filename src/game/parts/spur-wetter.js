// Teil der Regie einer Fahrt (Game, game.js): Linke Spur (Sperrung und Freigabe) und Wetter (Regen, Wischer).
// Die Methoden stehen hier, gehören aber zu Game – game.js hängt sie an (attachParts); this ist das Spiel.
import { CHAT, BOARD, BUSSGELD, viewerName, fillTemplate } from '../../data.js';
import { clamp, rand, chance, pick, damp } from '../../util.js';


export class SpurWetterPart {
  // --- Linke Spur ------------------------------------------------------------
  updateLeftLane(dt) {
    const L = this.left;
    const p = this.player;
    if (!L.open) {
      if (!this.offAutobahn) L.next -= dt;
      // (nicht in einer Baustelle: Dort sind die linken Spuren gesperrt, eine Freischaltung wartet bis dahinter)
      if (L.next <= 0) {
        if (this.bau?.active) L.next = 10;
        else this.openLeftLane();
      }
    } else if (this.offAutobahn) {
      // abseits der Autobahn gibt es keine linke Spur: Die Freischaltung endet an der Ausfahrt (sonst bettelt der Chat
      // im Ort darum, sie zu nutzen)
      this.closeLeftLane();
    } else {
      L.timer -= dt;
      // Geld gibt es fürs Linksfahren nicht – aber jemand hat dafür gespendet und will es jetzt auch sehen (rückwärts
      // zählt es nicht)
      if (p.inLeftLane) {
        if (p.gear === 'D') this.stats.leftLaneTime += dt;
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
        this.ui.toast('⏳ Linke Spur: noch 10 Sekunden', 'warn', 'spur');
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
        this.fine(BUSSGELD.verwarn, 'Verwarngeld');
        this.eco.cheer('fine');
        this.ui.toast(`🚓 Rechtsfahrgebot missachtet: ${BUSSGELD.verwarn}\u00a0€ Verwarngeld`, 'bad');
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
    this.dsMoment('links');
  }

  closeLeftLane() {
    const L = this.left;
    L.open = false;
    // genutzt: Der Chat freut sich, und die nächste Freischaltung kommt eher – links liegen gelassen: umgekehrt
    const { used, wait } = this.eco.laneClosed(L.freq);
    L.next = wait;
    L.grace = 5;
    // (ohne Durchsage: Das Ende zeigen Balken und Spuransicht, der Chat sagt den Rest)
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
      // stehen die Wischer im Schauer, entschuldigt sich OMI ab und zu für die Beta-Software (nach der Regenansage;
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
}
