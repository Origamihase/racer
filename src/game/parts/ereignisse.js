// Teil der Regie einer Fahrt (Game, game.js): Ereignisse unterwegs: Blitzer, Polizei Gifhorn, Durchsagen, Rahmen, Elsa,
// Funkloch, Elefantenrennen.
// Die Methoden stehen hier, gehören aber zu Game – game.js hängt sie an (attachParts); this ist das Spiel.
import { CHAT, BOARD, DURCHSAGEN, DURCHSAGEN_REGEN, RAHMEN, RAHMEN_GAP, VOICES, CREW, CREW_LINES, AKTIONEN, MEGAFON_WUENSCHE, SAMMELAKTIONEN, BUSSGELD, viewerName, fillTemplate } from '../../data.js';
import { clamp, rand, randInt, chance, pick, fmtEuro, fmtClock } from '../../util.js';
import { Vector3 } from 'three';
import { elephantPair } from '../../world/traffic.js';
import { EYE } from '../../cockpit/cockpit.js';
import { ELSA_STATUE } from '../../world/scenery.js';
import { curvePoint } from '../../curve.js';
import { camerasAlong, triggerKmh } from '../../world/xxl/blitzer.js';

const POLICE_TEXTS = ['POLIZEI GIFHORN', 'GUTE FAHRT, ADAM!', 'GIFHORN GRÜSST', 'BITTE LÄCHELN'];
// Rechts oben deckt der Innenspiegel aus Mini Adams Sicht ab etwa 17,8° rechts der Blickrichtung ab
// (auf dem Handy hochkant endet dort fast schon das Bild): bis 16° steht Elsa frei in der Scheibe.
const ELSA_VIEW = (16 * Math.PI) / 180;
const elsaTmp = new Vector3();
/**
 * Elefantenrennen (zwei Lkw nebeneinander): bestellt wird es frühestens first, dann alle every Meter Straße (bei Tempo
 * 130 gut vier bis sechs Minuten), nur mit room Metern Autobahn ohne Ausfahrt voraus; OMI sagt es höchstens alle
 * cool Sekunden an, und nur, wenn es wirklich vor dem Wagen fährt (traffic.js elephantPair).
 */
/** Blitzer: Zonenende so weit hinter der Bestellung. */
const BLITZER_END = 1300;
/**
 * Was am Autobahnrand bestellt wird, braucht bis after Meter hinter sich keine Ausfahrt; ist eine näher, wird es retry
 * Meter später noch einmal versucht.
 */
export const ROADSIDE = { after: 100, retry: 400 };
export const ELEFANT = { first: [6000, 9000], every: [9000, 14000], room: 1500, cool: 240 };
/**
 * Was ein Satz über den Moment behauptet, muss stimmen (der Eigentümer: „Wir sind auf der Autobahn und streamen in
 * Full HD“ kam mitten im Ort). Ein Satz in data.js kann mit Stichworten beginnen, „[ab] Wir sind …“, eine Durchsage
 * hat when: Er kommt nur, wenn jedes gerade gilt (Game.fits). ab auf der Autobahn · ort in einem Ort · regen es
 * regnet · langsam in Fahrt, aber unter 90 km/h · offen ein Gebot ändert das Ziel noch (vor dem Zuschlag) · ziel ein
 * Ziel steht im Navi · stau hinter jemandem festgehangen · netz seit einer Minute kein Funkloch.
 */
export const FACTS = {
  ab: (g) => !g.offAutobahn && g.roadKind() === 'ab',
  ort: (g) => g.roadKind() === 'stadt',
  regen: (g) => g.weather.level > 0.3,
  langsam: (g) => g.player.kmh >= 3 && g.player.kmh < 90,
  offen: (g) => g.auction.phase === 'offen' && !!g.navi.target,
  ziel: (g) => !!g.navi.target,
  stau: (g) => !!g.stuck,
  netz: (g) => g.funkloch <= 0 && g.t - g.funklochT > 60,
  // … und für die Running Gags (CHAT.meme): start die ersten 150 s · lange nach einer Stunde · weit das Ziel mehr als
  // zehn Minuten entfernt · nah weniger als eine · steht ohne Szene · laden an der Säule · tv in der Folge · folge2 ab der
  // zweiten · wende das Navi will wenden · siegen/gifhorn das Ziel · akku unter 25 % · party beste Laune · studio das
  // Sprachstudio sprach eben · durchsage eine Durchsage lief eben (kassandra: ihre) · donnerstag Streamtag
  start: (g) => g.t < 150,
  lange: (g) => g.t > 3600,
  weit: (g) => !!g.navi.target && g.navi.driveSecs() > 600,
  nah: (g) => !!g.navi.target && g.navi.driveSecs() < 60,
  steht: (g) => g.player.kmh < 3 && !g.tv && !g.charging,
  laden: (g) => !!g.charging,
  tv: (g) => !!g.tv,
  folge2: (g) => !!g.tv && g.tv.n >= 2,
  wende: (g) => !!g.navi.wende,
  siegen: (g) => !!g.navi.target && g.navi.target.special === 'siegen',
  gifhorn: (g) => !!g.navi.target && g.navi.target.special === 'gifhorn',
  akku: (g) => g.player.battery < 25,
  party: (g) => g.eco.level >= 4,
  studio: (g) => g.t - g.studio.last < 20,
  durchsage: (g) => g.t - g.said.t < 20,
  kassandra: (g) => g.t - g.said.t < 20 && g.said.voice === 'kassandra',
  donnerstag: () => new Date().getDay() === 4,
  // … und für die Running Gags (gags.js): gleich ein Ort liegt kurz voraus auf dem Weg (der Geo-Tracker nennt ihn) ·
  // glotz die Zuschauerzahl steht (kein Funkloch; das Glotzometer nennt sie) · faehrt der Wagen rollt (die Paketsuche)
  gleich: (g) => !!g.gags.nextTown(),
  glotz: (g) => g.viewers > 0 && g.funkloch <= 0,
  faehrt: (g) => g.player.kmh >= 3,
};
// Radarwarner (Shop): so viele Meter vor dem Tempo-120-Schild eines Blitzers schlägt er an (ahead); erst piept das
// Kästchen (audio.js RADAR_BEEP, gut 0,6 s), lead Sekunden später – wenn es fertig ist – folgen OMIs Gong und ihre Ansage
export const RADAR = { ahead: 180, lead: 0.7 };
// so viele Meter vor dem ersten Schild der 120-Zone am Blitzer beginnt der Tempomat zu bremsen
export const ZONE_LEAD = 250;

export class EreignissePart {
  /**
   * Am Blitzer vorbei (Autobahn, Ort, Landstraße) mit dem Tempolimit limit. over: zu schnell – Blitz (flash(on)
   * schaltet die Blitzlinse der Welt), Bußgeld, Foto (mit dem Limit in der Datenzeile), Chat; sonst ein Lob. Ein
   * Blitzer kündigt sich nie an: das tut nur der Radarwarner.
   */
  passCamera(over, flash, limit) {
    const p = this.player;
    if (over) {
      this.fx.flash(1);
      this.audio.flash();
      this.onMood('startled', 1);
      flash(true);
      this.later(0.15, () => flash(false));
      this.stats.photos++;
      this.gags.fail('blitzer');
      // Tempo und Uhrzeit im Moment des Blitzes festhalten (danach wird meist gebremst)
      const kmh = Math.round(p.kmh);
      const clock = fmtClock(this.clock);
      this.later(0.6, () => {
        this.fine(BUSSGELD.blitzer, 'Bußgeld');
        this.ui.photo(kmh, clock, limit);
      });
      this.burst(CHAT.blitzer, 3, 2);
      // ab und zu stichelt danach jemand: ohne Radarwarner mit einem Wink zum Shop, mit ihm erst recht (pick statt
      // chatLine: mit und ohne Kästchen gleich viele Zufallszahlen – der Stream verläuft sonst genau gleich)
      if (chance(0.5)) this.later(rand(2.4, 3.6), () => this.chat(pick(this.hasRadar ? CHAT.radarTrotz : CHAT.radarFehlt)));
      this.cockpit.nomi.setMood('surprised', 2);
      // teuer für Mini Adam, aber der Chat liebt das Foto
      this.eco.cheer('blitzerFlash');
    } else {
      this.stats.blitzerClean++;
      this.thrill('blitzerClean', 'vorbildliches Fahren');
      this.ui.toast('📸 Nicht geblitzt – vorbildlich!', 'good');
    }
  }

  /**
   * Blitzer im Ort und auf der Landstraße (world/xxl/blitzer.js camerasOf, dieselben, die die Welt aufstellt): Wer an
   * einem vorbeifährt (vorwärts), wird an seinem Tempolimit gemessen. Mit dem Radarwarner piept es RADAR.ahead Meter
   * vorher, dann sagt OMI es an, und sein Lämpchen blinkt bis zum Blitzer (roadAlarm); ohne ihn kommt nichts vorher.
   */
  roadCameras(p) {
    const trip = this.world.trip();
    const s = p.s;
    const prev = this.cam.prev ?? s;
    this.cam.prev = s;
    this.cam.alarm = null;
    if (!trip || !trip.cur || s < prev) return;
    for (const c of camerasAlong(trip.cur.sections, prev - 1, s + RADAR.ahead)) {
      if (this.cam.seen.has(c.key)) continue;
      if (prev < c.s && s >= c.s) {
        this.cam.seen.add(c.key);
        this.passCamera(p.kmh > triggerKmh(c.limit), (on) => this.world.flashCamera?.(on), c.limit);
        continue;
      }
      if (!this.hasRadar || c.s <= s) continue;
      if (!this.cam.warned.has(c.key)) {
        this.cam.warned.add(c.key);
        this.audio.radar();
        this.later(RADAR.lead, () => this.say(BOARD.blitzer, 'wink'));
      }
      this.cam.alarm = c;
    }
  }

  // --- Ereignisse ------------------------------------------------------------------
  updateEvents(dt, camera) {
    const p = this.player;
    const T = this.T;
    for (const k in T) T[k] -= dt;
    // ein großes, gut gelauntes Publikum bucht öfter Durchsagen, Rahmen und Aktionen
    const eager = (clamp(this.eco.activity(), 0.6, 1.8) - 1) * dt;
    T.durchsage -= eager;
    T.rahmen -= eager;
    T.trunk -= eager;

    // Sprachdurchsage (wartet, bis das Sprachstudio ausgeredet hat und keine Szene läuft: Folge, Ladestopp)
    if (T.durchsage <= 0 && this.t >= this.studio.until && !this.tv && !this.charging) {
      T.durchsage = rand(48, 85);
      const pool = this.weather.level > 0.3 && chance(0.5) ? DURCHSAGEN_REGEN : DURCHSAGEN;
      const d = pick(pool.filter((x) => !x.when || x.when.split(' ').every((k) => FACTS[k](this))));
      const text = fillTemplate(d.text);
      const name = viewerName();
      this.donate(name, this.eco.durchsagePrice(), 'Sprachdurchsage', { label: 'Sprachdurchsagen' });
      this.voiceUntil = Math.max(this.voiceUntil, this.t + 3);
      this.later(1.2, () => {
        // hat inzwischen eine Szene begonnen (Folge, Ladestopp), entfällt sie: dort spricht keine Durchsage
        if (this.tv || this.charging) return;
        // die Karte nur zu einer Durchsage, die auch zu hören ist: Sie kommt, wenn sie spricht, und geht, wenn OMI oder
        // eine Folge BrunnenTV sie aus der Warteschlange drängt oder abbricht
        let line = null;
        const dur = this.speech.say(text, d.voice, {
          onStart: (dd) => (line = this.ui.durchsage(VOICES[d.voice].label, text, dd + 1, name)),
          onDrop: () => line && (line.t = 0),
        });
        if (!dur) return;
        this.said = { t: this.t, voice: d.voice };
        this.voiceUntil = Math.max(this.voiceUntil, this.t + dur + 1);
      });
    }

    // Rahmen
    if (T.rahmen <= 0 && p.s > 1000) {
      T.rahmen = rand(RAHMEN_GAP.min, RAHMEN_GAP.max);
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
        // und aus dem Chat meldet sich jemand, den man kennt (CREW.back)
        const who = pick(CREW.back);
        this.later(1.2 + CREW.backAfter, () => this.chat(pick(CREW_LINES.back), who, this.crewBadge(who)));
      }
    }
    // (nie mitten in einer Szene – Folge, Ladestopp, Halt am Brunnen: Das Funkloch wartet, bis sie vorbei ist)
    if (T.funkloch <= 0 && p.s > 1500 && !this.tv && !this.charging && !this.halt && !this.navi.stopping) {
      T.funkloch = rand(120, 220);
      if (!this.up.starlink) {
        this.funkloch = rand(2.2, 3.2);
        this.funklochT = this.t;
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
    // (Aktionen warten, bis die Szene vorbei ist: Der Megafon-Wunsch soll nicht in die Folge platzen)
    if (T.trunk <= 0 && p.s > 2000 && !this.tv && !this.charging) {
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
          // hat inzwischen eine Szene begonnen (Folge, Ladestopp), entfällt er: Dort spricht nur die Szene
          if (this.tv || this.charging) return;
          this.audio.megafon();
          // Mini Adam ruft den Wunsch durchs Megafon – mit seiner Stimme
          let line = null;
          const dur = this.speech.say(text, 'adam', { onStart: (dd) => (line = this.ui.megafon(text, dd + 1, name)), onDrop: () => line && (line.t = 0) });
          if (!dur) return;
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

    // Was am Rand der Autobahn bestellt ist (Blitzer, Brunnen, Elsa), gilt nur, solange der Wagen auf ihr bleibt: Nach
    // der Ausfahrt oder dem Wechsel auf eine andere Autobahn steht es nicht mehr an seinem Weg (dropRoadside)
    if (this.offAutobahn && (this.blitzer || this.landmark)) this.dropRoadside();

    // Blitzer mit Tempo-120-Zone – nur, wo bis hinter ihr Ende keine Ausfahrt kommt, die der Wagen nehmen könnte
    if (!this.blitzer && p.s > this.S.blitzer && !this.offAutobahn && this.notBlocked('blitzer', BLITZER_END + ROADSIDE.after)) {
      const s = p.s;
      this.blitzer = { limitS: s + 520, camS: s + 1120, endS: s + BLITZER_END, announced: false, checked: false };
      this.blitzer.ids = [
        this.scenery.request('speed', this.blitzer.limitS, { limit: 120 }),
        this.scenery.request('blitzer', this.blitzer.camS),
        this.scenery.request('speed', this.blitzer.endS, { limit: 'ende' }),
      ];
    }
    // Kann die Welt ein Teil davon nicht aufstellen (es fiele auf eine Rampe oder hinter das Ende der Autobahn), gibt
    // es diesen Blitzer nicht – genauso Brunnen und Elsa (siehe unten)
    if (this.blitzer && !this.blitzer.checked && (this.blitzer.ids || []).some((id) => this.scenery.blocked(id))) this.dropRoadside('blitzer');
    // der Tempomat hält die 120 am Blitzer: ab ZONE_LEAD Metern vor dem ersten Schild (dann ist er an der Kamera längst
    // langsam genug), bis zum Ende der Zone (Player.limits.zone; das Strompedal des Spielers kennt sie nicht)
    const zb = this.blitzer;
    p.setLimits({ zone: zb && p.s > zb.limitS - ZONE_LEAD && p.s < zb.endS ? 120 / 3.6 : Infinity });
    if (this.blitzer) {
      const b = this.blitzer;
      // Einen Blitzer kündigt niemand an: Die Warnung vorher ist ein Artikel des Shops (hasRadar) – Blitz, Bußgeld
      // und Foto gibt es mit ihm und ohne ihn.
      if (this.hasRadar && !b.announced && p.s > b.limitS - RADAR.ahead) {
        b.announced = true;
        this.audio.radar();
        this.later(RADAR.lead, () => this.say(BOARD.blitzer, 'wink'));
      }
      if (!b.checked && p.s > b.camS) {
        b.checked = true;
        this.passCamera(p.kmh > triggerKmh(120), (on) => this.scenery.flashBlitzer(on), 120);
      }
      if (p.s > b.endS + 50) {
        this.blitzer = null;
        this.S.blitzer = p.s + rand(2600, 4200);
      }
    }

    // Blitzer im Ort und auf der Landstraße (world/xxl/blitzer.js): fest an ihrem Ort, gemessen wie der an der Autobahn
    this.roadCameras(p);

    // Elefantenrennen: selten und nur auf der Autobahn mit Platz voraus (keine Ausfahrt in Sicht, die der Wagen nehmen
    // könnte). Angesagt wird es nur, wenn zwei Lkw wirklich nebeneinander vor dem Wagen fahren – ob bestellt oder von
    // selbst entstanden – und höchstens alle ELEFANT.cool Sekunden
    const nx = this.offAutobahn ? null : this.world.trip().nextExit();
    const ab = !this.offAutobahn && this.world.trip().section.kind === 'ab' && (!nx || nx.dist > ELEFANT.room);
    if (ab && p.s > this.S.elefant) {
      this.S.elefant = p.s + rand(ELEFANT.every[0], ELEFANT.every[1]);
      this.traffic.elefantenrennen(p.s);
    }
    if (ab && this.t >= this.elefantT && elephantPair(this.traffic.cars, p.s)) {
      this.elefantT = this.t + ELEFANT.cool;
      this.say(BOARD.elefant, 'worried', { priority: false });
      this.later(3, () => this.burst(CHAT.elefant, 3, 3));
    }

    // Brunnen und Elsa am Straßenrand (Hupen freut den Chat – und manchmal spendet dann jemand)
    if (!this.landmark && p.s > this.S.landmark && !this.offAutobahn) {
      const type = chance(0.55) ? 'brunnen' : 'elsa';
      // hinten in einem Abschnitt ohne Lärmschutzwand und ohne Brücke davor
      const s = this.scenery.landmarkSpot(p.s + 1500);
      if (this.notBlocked('landmark', s - p.s + ROADSIDE.after)) this.landmark = { type, s, seen: false, greeted: false, id: this.scenery.request(type, s) };
    }
    if (this.landmark && !this.landmark.greeted && this.scenery.blocked(this.landmark.id)) this.dropRoadside('landmark');
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
      // Elsas Hinweise stehen nur, solange sie zu sehen ist (mindestens kurz, damit sie nicht nur aufblitzen)
      if (lm.toast && !view.visible && this.t - lm.toastT > 1.2) this.elsaToast(lm, null);
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
    return { visible, show };
  }

  /** Wie man hupt – passend zum Gerät, mit dem gerade gespielt wird. */
  hornKey() {
    return this.device === 'touch' ? '📯' : this.device === 'gamepad' ? 'A' : 'Leertaste';
  }

  /** Hinweis, der mit Elsa verschwindet (null: den bisherigen wegnehmen). */
  /**
   * Ist auf den nächsten len Metern Autobahn Platz für etwas am Rand (keine Gabelung, an der der Wagen abfahren könnte,
   * kein Autobahnende)? Wenn nicht, fragt key (S.blitzer, S.landmark) erst ROADSIDE.retry Meter später wieder.
   */
  notBlocked(key, len) {
    // (abseits der Autobahn fragt niemand: offAutobahn hält dort alles zurück)
    const nx = this.world.trip().nextExit();
    if (!nx || nx.dist > len) return true;
    this.S[key] = this.player.s + ROADSIDE.retry;
    return false;
  }

  /**
   * Blitzer, Brunnen und Elsa vergessen (sie stehen nicht am Weg: Autobahn verlassen, oder die Welt konnte sie nicht
   * aufstellen) und neu einplanen. which: nur 'blitzer' oder 'landmark' (ohne Angabe: beide).
   */
  dropRoadside(which = null) {
    const s = this.player.s;
    if (this.blitzer && which !== 'landmark') {
      this.blitzer = null;
      this.S.blitzer = s + ROADSIDE.retry;
    }
    if (this.landmark && which !== 'blitzer') {
      this.elsaToast(this.landmark, null);
      this.landmark = null;
      this.S.landmark = s + ROADSIDE.retry;
    }
  }

  elsaToast(lm, t) {
    if (lm.toast && lm.toast !== t) lm.toast.drop?.();
    lm.toast = t;
    lm.toastT = this.t;
  }

  callPolice(text) {
    if (this.policeCar) return;
    this.policeCar = this.traffic.police(this.player.s, text);
    if (!this.policeCar) return; // (gleich hinter dem Beginn einer Autobahn hat sie keinen Platz)
    this.burst(CHAT.police, 3, 2.5);
    this.later(1, () => this.cockpit.nomi.setMood('worried', 2.5));
  }

  // --- Sammelsachen ---------------------------------------------------------------
  updatePickups(dt, camera) {
    const p = this.player;
    const S = this.S;
    const spawn = !this.offAutobahn;
    // der Akku lädt in den Ladeparks, Bananensaft gibt es dort auch (REISE.md A5): Auf der Straße liegt nur Koriander
    if (p.s > S.koriander && spawn) {
      S.koriander = p.s + rand(1300, 2300);
      this.pickups.spawnAhead(p.s, this.traffic);
    }
    for (let n = this.pickups.update(dt, this.t, p, camera, spawn).length; n > 0; n--) {
      this.stats.koriander++;
      p.wobble = 2.2;
      this.audio.bad();
      this.ui.toast('🌿 Koriander … bäh!', 'bad');
      this.cockpit.nomi.setMood('dizzy', 2.5);
      this.burst(CHAT.koriander, 2, 1.5);
    }
  }
}
