// Teil der Regie einer Fahrt (Game, game.js): Zuschauer, Spenden und Chat: Zufriedenheit, Trödeladam, Sammelaktionen,
// Crew, „5 Cent, wenn du …“, Sprachstudio, Jobs.
// Die Methoden stehen hier, gehören aber zu Game – game.js hängt sie an (attachParts); this ist das Spiel.
import { CHAT, CREW, CREW_LINES, SPENDEN_ZWECKE, STUDIO, viewerName, viewerNameAt, fillTemplate, fmtBetrag } from '../../data.js';
import { clamp, rand, randInt, chance, pick, shuffle, fmtCent, fmtEuro, fmtNum } from '../../util.js';
import { ZUFRIEDEN } from '../satisfaction.js';
import { WAVE, chatGap } from '../wave.js';

// „5 Cent, wenn du …“: Nur bei einem Teil der Angebote (LAGE_SHARE) achtet der Chat auf die Lage, die übrigen kommen
// aus dem großen Vorrat – sonst gäbe es fast nur Regen- und Brunnen-Angebote, denn eins von beiden ist fast immer.
// Passt eins zur Lage, darf es kommen, sobald die Uhr weniger als so viele Sekunden zeigt: Ein Ziel, ein Brunnen
// oder Elsa sind nur kurz da und selten, ein Laster, Regen oder eine lange Gerade öfter.
export const LAGE_SHARE = 0.4;
const OFFER_EARLY = { ziel: 100, brunnen: 100, elsa: 100, laster: 50, regen: 50, gerade: 40 };
// Lange Gerade: Die Krümmung unter dem Wagen (aus dem Kurs, siehe course.js) bleibt so klein, dass die Straße auf
// 200 m höchstens 1 m zur Seite läuft, und das schon so viele Meter lang.
const STRAIGHT_KAPPA = 1 / 20000;
const STRAIGHT_RUN = 400;
// Wie flott der Chat schreibt, je nach Stufe der heimlichen Chat-Stimmung (0 im Keller … 4 bester Laune)
const CHAT_PACE = [1.3, 1.12, 1, 0.92, 0.85];
// Einschaltquote für den Abspann (menus.js, ui/quotechart.js): alle QUOTE_DT Sekunden die Zuschauerzahl
export const QUOTE_DT = 5;
/**
 * „Trödeladam“ (der Eigentümer, 20.11.2026): Wer lange steht (stand Sekunden, ohne Szene und ohne Halt am Ziel),
 * lange unter dem Tempo des Navis bleibt (Fortschritt unter slowPace, slowFor Sekunden lang; satisfaction.js) oder
 * eine Runde vertrödelt (Urteil am Ziel unter round), den nennt der Chat so – mit Abstand (cool Sekunden, mit jedem
 * Mal etwas mehr, höchstens das Dreifache), und es kostet die Stimmung ein wenig (mood).
 */
export const TROEDEL = { stand: 14, slowPace: 0.7, slowFor: 45, round: 0.8, cool: 75, mood: 0.03 };
// so oft greift der Chat zu einem Running Gag (CHAT.meme), wenn einer zum Moment passt
const MEME_SHARE = 0.18;
/** Der Satz ohne seine Stichworte: „[ab] Wir sind …“ → „Wir sind …“. */
export const untag = (line) => (line.charCodeAt(0) === 91 ? line.slice(line.indexOf(']') + 2) : line);

export class StreamPart {
  // --- Zuschauer, Spenden, Chat ------------------------------------------------------
  updateViewers(dt) {
    const p = this.player;
    this.watchTraffic(dt);
    // Die Stream-Kasse rechnet: Stimmung, Zuschauer und wer gerade etwas gibt (siehe economy.js). Wie viele
    // zuschauen, hängt an Sendezeit, Stimmung und Trubel – nicht an der gefahrenen Strecke.
    const d = this.ecoIn;
    const b = this.blitzer;
    d.kmh = p.kmh;
    // in der Tempo-120-Zone ist langsam fahren richtig – genauso, wo die Strecke selbst das Tempo begrenzt (Welt:
    // Rampen, Landstraßen, Orte, der Halt am Ziel)
    d.limit = (!!b && p.s > b.limitS - 200 && p.s < b.endS) || p.limits.vmax < Infinity;
    d.stuck = this.stuck && !d.limit;
    // abseits der Autobahn gibt es keine linke Spur, die er nutzen oder liegen lassen könnte
    d.leftOpen = this.left.open && !this.offAutobahn;
    d.inLeft = p.inLeftLane;
    d.funkloch = this.funkloch > 0;
    // Reise: Ein zufriedener Chat gibt mehr und lockt mehr Zuschauer an (satisfaction.js gain, audience)
    this.updateZufrieden(dt, d);
    this.updateTroedel(dt, d);
    for (const e of this.eco.update(dt, d)) this.onStream(e);
    this.viewers = this.eco.viewers;
    this.peakViewers = Math.max(this.peakViewers, this.viewers);
    this.stats.maxViewers = this.peakViewers;
    if (this.t >= this.quote.next) {
      this.quote.v.push(Math.round(this.viewers));
      this.quote.next += QUOTE_DT;
    }
    const best = Math.max(500, this.save.best.viewers || 0);
    if (!this.recordShown && this.viewers > best && this.t > 45) {
      this.recordShown = true;
      this.eco.cheer('record');
      this.bot('victoria', `Neuer Zuschauerrekord: ${fmtNum(Math.round(this.viewers))} Zuschauer!`);
      this.audio.record();
      this.onMood('proud', 1);
      this.burst(CHAT.record, 4, 2.5);
      this.ui.toast('🏆 Neuer Zuschauerrekord!', 'good');
      if (this.up.konfetti) this.cockpit.addConfetti(30);
    }
  }

  /**
   * Reise: Zufriedenheit des Chats fortschreiben. Gezählt wird, solange ein Ziel gilt und der Wagen nicht am Brunnen
   * (BrunnenTV, Halt) oder an der Säule steht; R ist die Fahrzeit, die das Navi bis zum Ziel nennt.
   */
  updateZufrieden(dt, d) {
    const Z = this.zufrieden;
    const nv = this.navi;
    const counted = !!nv.target && !nv.stopping && !this.tv && !this.charging && !this.world.stopping();
    const secs = counted ? nv.driveSecs() : Infinity;
    Z.update(dt, { secs, counted, kmh: this.player.kmh });
    d.gain = Z.gain;
    d.audience = Z.audience;
    // der Fortschritt zum Ziel bewegt auch die heimliche Stimmung (economy.js PROGRESS) – solange gezählt wird
    d.pace = counted && Number.isFinite(secs) ? Z.pace : undefined;
    d.near = secs;
  }

  /**
   * Trödeladam (TROEDEL): Steht der Wagen lange ohne Grund – keine Folge, kein Ladestopp, kein Halt am Brunnen, kein
   * Funkloch – oder bleibt er lange unter dem Tempo des Navis (d.pace, nur solange ein Ziel zählt), ruft ihn der Chat so.
   */
  updateTroedel(dt, d) {
    const Tr = this.troedel;
    const scene = !!(this.tv || this.charging || this.halt || this.navi.stopping || this.world.stopping() || this.funkloch > 0);
    Tr.standT = !scene && this.player.kmh < 3 ? Tr.standT + dt : 0;
    Tr.slowT = !scene && Number.isFinite(d.pace) && d.pace < TROEDEL.slowPace ? Tr.slowT + dt : 0;
    if (Tr.standT > TROEDEL.stand) this.troedeln('steht');
    else if (Tr.slowT > TROEDEL.slowFor) this.troedeln('langsam');
  }

  /** Der Chat nennt ihn Trödeladam (why: steht · langsam · runde) – nie öfter als alle TROEDEL.cool Sekunden. */
  troedeln(why) {
    const Tr = this.troedel;
    Tr.standT = 0;
    Tr.slowT = 0;
    // (ein Spitzname nutzt sich ab: Mit jedem Mal wartet der Chat etwas länger, bis er ihn wieder ruft)
    if (this.t - Tr.lastT < TROEDEL.cool * Math.min(3, 1 + Tr.n / 2)) return;
    Tr.lastT = this.t;
    Tr.n++;
    this.chat(this.chatLine(CHAT.troedel[why]));
    if (chance(0.45)) this.later(rand(1.2, 2.2), () => this.chat(this.chatLine(CHAT.troedel.echo)));
    this.eco.sway(-TROEDEL.mood, 'troedel');
  }

  /**
   * Was der Chat am Verkehr sieht: Überholen unterhält, lange hinter jemandem herzuckeln langweilt.
   * Viermal pro Sekunde hinschauen genügt.
   */
  watchTraffic(dt) {
    this.trafficT -= dt;
    if (this.trafficT > 0) return;
    this.trafficT = 0.25;
    // abseits der Autobahn fährt deren Verkehr woanders weiter: Dort überholt und bremst ihn niemand
    if (this.offAutobahn) {
      this.stuck = false;
      return;
    }
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
    this.ui.toast(`🎉 Sammelaktion geschafft: ${S.name}`, 'good');
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

  /**
   * Der Ton des Chats folgt seiner Zufriedenheit – zufrieden klingt er öfter flott, unzufrieden ruft er nach Tempo
   * (ZUFRIEDEN.happy/grumpy).
   */
  zufriedenPool() {
    const Z = this.zufrieden;
    if (Z.value >= ZUFRIEDEN.happy) return chance(ZUFRIEDEN.happyShare) ? CHAT.flott : null;
    if (Z.value <= ZUFRIEDEN.grumpy) return chance(ZUFRIEDEN.grumpyShare) ? CHAT.schneller : null;
    return null;
  }

  /** Abzeichen im Chat: Die Mods tragen MOD. */
  crewBadge(name) {
    return CREW.mods.includes(name) ? { badge: 'MOD' } : {};
  }

  /**
   * Reise: die Leute des Streams (data.js CREW) – König Knollis Raid und sein Jubel danach, die Mods, die
   * Discord-Erinnerung und das stille Herz. Ihre Uhren laufen nicht, solange der Stream im Funkloch hängt.
   */
  updateCrew(dt) {
    const T = this.crewT;
    if (this.funkloch > 0) return;
    const M = (r) => rand(r[0], r[1]) * 60;
    for (const k in T) T[k] -= dt;
    if (T.raid <= 0) {
      T.raid = M(CREW.raid.every);
      T.knolli = M(CREW.knolliEvery);
      this.raid();
    }
    if (T.knolli <= 0) {
      T.knolli = M(CREW.knolliEvery);
      const name = CREW.knolli;
      if (chance(0.5)) {
        const v = randInt(CREW.cheer[0], CREW.cheer[1]);
        this.donate(name, v, '', { line: fillTemplate(CREW_LINES.cheer, { name, betrag: fmtCent(v) }) });
      } else this.donate(name, randInt(CREW.gift[0], CREW.gift[1]), '');
      this.later(1.4, () => this.chat(pick(chance(0.5) ? CREW_LINES.knolliJubel : CREW_LINES.danke), chance(0.5) ? name : viewerName()));
    }
    if (T.mod <= 0) {
      T.mod = M(CREW.modEvery);
      this.chat(this.chatLine(CREW_LINES.mod), pick(CREW.mods), { badge: 'MOD' });
    }
    if (T.discord <= 0) {
      T.discord = M(CREW.discordEvery);
      const who = pick(CREW.discord);
      this.chat(pick(CREW_LINES.discord), who, this.crewBadge(who));
    }
    if (T.heart <= 0) {
      T.heart = M(CREW.heartEvery);
      this.chat('❤', CREW.heart);
    }
  }

  /**
   * König Knolli raidet (Reise): Nora sagt es an, die Zuschauerzahl springt (CREW.raid, verblasst langsam), er grüßt,
   * und seine Leute sagen Hallo.
   */
  raid() {
    const R = CREW.raid;
    const n = Math.round(Math.max(R.min, this.viewers * rand(R.share[0], R.share[1])));
    this.eco.raidIn(n, R.fade);
    this.viewers = this.eco.viewers;
    this.thank('raids', CREW.knolli, n);
    this.bot('nora', fillTemplate(CREW_LINES.raid, { name: CREW.knolli, n: fmtNum(n) }));
    this.ui.toast(`👑 Raid von ${CREW.knolli}: +${fmtNum(n)} Zuschauer`, 'good', 'raid');
    this.later(1.3, () => this.chat(pick(CREW_LINES.knolliHallo), CREW.knolli));
    shuffle([...CREW_LINES.raider]).slice(0, 4).forEach((line, i) => this.later(2.2 + i * rand(0.5, 1.1), () => this.chat(line)));
  }

  updateChat(dt, kappa = 0) {
    this.updateCentOffers(dt, kappa);
    this.updateCrew(dt);
    this.chatT -= dt;
    if (this.chatT <= 0) {
      // Die heimliche Stimmung färbt den Chat: wie flott er schreibt und was. Im Regen ist er ohnehin gesprächig.
      const lv = this.eco.level;
      const rainy = this.weather.level > 0.3;
      this.chatT = rand(1.5, 3.8) * clamp(600 / Math.max(this.viewers, 1), 0.75, 1.4) * CHAT_PACE[lv] * (rainy ? 0.9 : 1);
      const pool = rainy && chance(0.22) ? CHAT.rain
        : lv < 2 && chance(lv === 0 ? 0.65 : 0.4) ? CHAT.restless
          : lv > 2 && chance(lv === 4 ? 0.65 : 0.4) ? CHAT.cheerful
            : chance(MEME_SHARE) ? CHAT.meme
              : this.zufriedenPool() || CHAT.ambient;
      this.chat(this.chatLine(pool) || this.chatLine(CHAT.ambient));
    }
    // ab und zu will jemand einen Gruß: „Wink mal!“, kurz danach winkt er (wave.js; nicht in einer Szene am Brunnen
    // oder an der Ladesäule – dort hat er anderes zu tun, der Wunsch kommt dann etwas später)
    this.waveChatT -= dt;
    if (this.waveChatT <= 0) {
      if (this.tv || this.charging) this.waveChatT = 10;
      else {
        // (ohne Zufall: Satz, Name und Abstand folgen dem Zähler – der Gruß ändert nichts am übrigen Stream)
        const n = this.waveChatN++;
        this.waveChatT = chatGap(n + 1);
        this.chat(CHAT.winkMal[n % CHAT.winkMal.length], viewerNameAt(n));
        this.later(WAVE.chatDelay, () => this.waveAt('chat'));
      }
    }
  }

  // --- „5 Cent, wenn du …“ ------------------------------------------------------------------
  /**
   * Ein Meme aus dem Stream: Alle paar Minuten bietet jemand lächerliche 5 Cent für eine Albernheit – nie zwei
   * Angebote kurz hintereinander, keins zweimal im selben Stream. Ab und zu passt eins zur Lage (Ziel erreicht,
   * Brunnen oder Elsa in Sicht, Laster vor uns, Regen, lange Gerade); das darf etwas früher kommen. Mini Adam geht nie
   * darauf ein: kein Geld, keine Aufgabe, kein Zähler, keine Antwort von OMI oder dem Sprachstudio. Nur der Chat legt
   * noch 2 Cent drauf, frotzelt, und wer geboten hat, bleibt manchmal stur.
   */
  updateCentOffers(dt, kappa = 0) {
    const C = this.cent5;
    // kappa: Krümmung unter dem Wagen (1/m), kommt mit den Eingaben aus dem Kurs (main.js courseEnv)
    const straight = Math.abs(kappa) < STRAIGHT_KAPPA && this.player.kmh > 90;
    C.straightS = straight ? C.straightS + this.player.speed * dt : 0;
    const T = this.T;
    // nicht ins Funkloch (da schreiben alle F) und nicht ins Bieter-Chaos oder Duell (da fliegen ohnehin die Gebote;
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
    // Wahrzeichen am Rand und Laster voraus gibt es nur auf der Autobahn (abseits ist ihr Verkehr woanders)
    const lm = this.offAutobahn ? null : this.landmark;
    // Brunnen und Elsa erst, wenn der Jubel über die Sichtung durch ist – sonst rutscht das Angebot gleich wieder weg
    if (lm && lm.seen && this.t - lm.seenT > 2.5) {
      const d = lm.s - p.s;
      if (lm.type === 'brunnen' && d > 40 && d < 240) return 'brunnen';
      // Elsa nur, solange sie frei in der Scheibe steht (dann steht auch ihr Hinweis da, siehe elsaView)
      if (lm.type === 'elsa' && lm.toast && d > 40) return 'elsa';
    }
    if (!this.offAutobahn) {
      for (const c of this.traffic.cars) {
        const d = c.s - p.s;
        if (c.truck && d > 25 && d < 110 && Math.abs(c.x - p.x) < 2) return 'laster';
      }
    }
    if (this.weather.level > 0.4) return 'regen';
    if (this.cent5.straightS > STRAIGHT_RUN) return 'gerade';
    return null;
  }

  // --- Sprachstudio ---------------------------------------------------------------------
  /**
   * Die ruhige Stimme in Mini Adams Ohr liest den Chat mit und sagt, wie er drauf ist: der einzige Weg, auf dem die
   * heimliche Chat-Stimmung nach außen kommt (als Satz, nie als Zahl oder Balken). Etwa einmal pro Minute und wenn
   * die Stimmung deutlich umschlägt – aber nie, während OMI oder eine Sprachdurchsage zu hören ist. Dazwischen gibt
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
    // (in einer Szene – Folge, Ladestopp – schweigt das Studio und spricht danach)
    if (this.funkloch > 0 || this.tv || this.charging || this.t < this.voiceUntil + 0.6 || this.t < this.studioUntil || this.speech.busy || this.speech.queue.length) return;
    let text;
    if (mood) {
      // Woran es liegt, sagt es gern dazu: bei guter Laune das Schöne, bei schlechter den Kummer – und in der Mitte
      // das, was die Stimmung gerade dorthin gebracht hat.
      const lv = this.eco.level;
      const dir = lv > 2 ? 'up' : lv < 2 ? 'down' : S.trend;
      const why = dir && chance(0.75) ? this.eco.why(dir, S.why, (k) => this.causeTrue(k)) : null;
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
    // ein leiser Zweiklang, damit man hört, dass jetzt nicht OMI spricht
    this.audio.tone(659.25, 0.16, 'sine', 0.05);
    this.audio.tone(523.25, 0.24, 'sine', 0.05, 0.13);
    let line = null;
    const dur = this.speech.say(text.replace(/_/g, ' '), this.studioVoice(), { onStart: (d) => (line = this.ui.studio(text, d + 0.8)), onDrop: () => line && (line.t = 0) });
    S.last = this.t;
    this.studioUntil = this.t + dur + 0.8;
  }

  /**
   * Die Stimme des nächsten Studio-Satzes: abwechselnd die Frau (sprachstudio) und der Mann (sprachstudioM) – so hört
   * man beide (speech.js studioVoices). „Wir sind live.“ zu Beginn (main.js) spricht die Frau, danach der Mann.
   */
  studioVoice() {
    const key = this.studio.voices % 2 ? 'sprachstudioM' : 'sprachstudio';
    this.studio.voices++;
    return key;
  }

  /** Ein Satz aus der Liste, aber keiner der beiden zuletzt gesagten (key: je Liste ein Gedächtnis). */
  fresh(list, key) {
    const used = this.studio.used[key] || (this.studio.used[key] = []);
    // (nur Sätze, die gerade stimmen: FACTS – und davon einer, der nicht eben erst dran war)
    const fit = list.map((_, n) => n).filter((n) => this.fits(list[n]));
    const i = pick(fit.filter((n) => !used.includes(n))) ?? pick(fit);
    used.push(i);
    if (used.length > Math.min(2, list.length - 1)) used.shift();
    return untag(list[i]);
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
        this.ui.jobDone(j.text);
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
      // Kam der letzte Job mit einer Ankunft (Navi-Ziel, Ladepark), gehört das Banner erst dem Ziel – die Feier für alle
      // fünf folgt, wenn es durch ist, statt es gleich wieder zu verdrängen
      const wait = last && (last.stat === 'naviReached' || last.stat === 'parkCharges') ? 3.6 : 0;
      this.later(wait, () => {
        this.bot('victoria', 'You had 5 Jobs – und alle erledigt! 🏆');
        this.onMood('proud', 1);
        this.later(2.4, () => this.donate(A.pledger, A.pledge, '', { label: 'Challenges', line: `${A.pledger} hatte ${fmtBetrag(A.pledge)} auf alle fünf Jobs gesetzt – und zahlt mit Freuden!` }));
        this.audio.record();
        this.ui.jobDone();
      });
    }
  }
}
