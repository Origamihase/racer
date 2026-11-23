// Teil der Regie einer Fahrt (Game, game.js): Navi-Ziel: Ausfahrten, die Auktion ums Ziel, Ankunft, Halt am Brunnen,
// Rechnung und BrunnenTV.
// Die Methoden stehen hier, gehören aber zu Game – game.js hängt sie an (attachParts); this ist das Spiel.
import { CHAT, BOARD, VOICES, REISE_AKKU, REPARATUR, damageCount, viewerName, fillTemplate, BRUNNEN_MEGAFON, BRUNNEN_NOMI, BRUNNEN_DEBATTE, SCHOENER_BRUNNEN, SCHOENNBRUN } from '../../data.js';
import { rand, chance, pick, fmtCent, fmtEuro, fmtNum } from '../../util.js';
import { damageLine } from '../damage.js';
import { BONTANA } from '../economy.js';
import { ZUFRIEDEN } from '../satisfaction.js';
import { TV } from '../../world/xxl/brunnentv.js';
import { addEpisode } from '../album.js';
import { places } from '../../map/graph.js';
import { goalName } from '../../world/kit/layout.js';
import { estimateSpeech } from '../../speech.js';
import { TROEDEL } from './stream.js';

/** Kratzer von der Leitplanke bisher: jede Schramme (damage.js scraped; gezeichnet sind höchstens drei je Seite). */
export const scratchMarks = (damage) => damage.scraped || 0;
// So viel langsamer als geschätzt (estimateSpeech) sprechen echte Stimmen höchstens: Der Gruß einer Folge BrunnenTV muss
// auch dann vor ihrem Ruf zu Ende sein
const SPEECH_SLACK = 1.35;
// BrunnenTV am Navi-Ziel (Reise): Fahrplan der Folge in world/xxl/brunnentv.js (TV); das erste Gebot der nächsten
// Runde kommt frühestens TV.pause Sekunden, nachdem der Wagen fahren darf.
/** Das Ziel für OMI: „Marktbrunnen, Würzburg“ → „Marktbrunnen in Würzburg“ (ohne eigenen Namen „Brunnen in …“). */
export function fountainIn(t) {
  const tail = ', ' + t.name;
  const g = t.goal || 'Brunnen in ' + t.name;
  return g.endsWith(tail) ? g.slice(0, -tail.length) + ' in ' + t.name : g;
}
/**
 * OMI und die nächste Ausfahrt (Game.exitCall): Sie nennt sie ab at Metern Straße vor der Gabelung (dem ersten
 * Vorwegweiser, signplan.js BOARD_D), bis late Meter davor; eine Ausfahrt, an der die Route vorbeiführt, höchstens alle
 * gap Sekunden.
 */
export const EXIT_CALL = { at: 1000, late: 700, gap: 90 };
/** OMIs Satz zur nächsten Ausfahrt (trip.nextExit): Name wie auf dem Schild, Meter in Worten, was die Route dort tut. */
export function exitLine(nx) {
  const L = BOARD.exit;
  const d = Math.max(50, Math.round(nx.dist / 50) * 50) + ' Metern';
  // die Nummer der Ausfahrt wie im Kästchen der Tafel vor dem Namen („Nächste Ausfahrt: 6 Hanau in 1000 Metern.“)
  const head = fillTemplate(L[nx.kind], { name: nx.kind === 'ausfahrt' && nx.no ? nx.no + ' ' + nx.name : nx.name, d });
  if (nx.plan === 'exit' && nx.kind !== 'ende') return head + ' ' + L.take;
  return nx.plan === 'stay' ? head + ' ' + fillTemplate(L.stay, { road: nx.road }) : head;
}
// Erste Runde: Fährt der Wagen schon im Zielort, wartet das nächste Gebot – höchstens so viele Sekunden nach der
// Einfahrt (wer dort parkt, statt zum Brunnen zu fahren, hält die Bieter nicht ewig auf)
export const TOWN_HOLD = 75;
/**
 * Die Auktion ums Navi-Ziel (der Eigentümer, 20.11.2026: „Gebote dürfen das Ziel nur bis 5 km vor der Ankunft ändern,
 * danach steht es fest.“): Ab lock Navi-Kilometern vor dem Brunnen fällt der Zuschlag (Game.zuschlag) – für den, der
 * vorn liegt; ein laufendes Bieterrennen endet dort, und bis zur Ankunft ruht die Uhr der Gebote. Nach jeder Folge
 * öffnet ein Bieterfenster von window Sekunden (Game.openWindow): Ob und wie schnell jemand bietet, hängt an der
 * Stimmung (economy.js windowBid); bietet niemand, ist der Stream vorbei (Game.streamOver). warn: so viele Sekunden
 * vor dem Ende des Fensters meldet sich der Chat.
 */
export const AUKTION = { lock: 5, window: 25, warn: 10 };
/**
 * BrunnenTV unterwegs (Game.wayOffer): Steht der Wagen in einem Ort auf dem Weg neben der Insel seines Brunnens –
 * höchstens before Meter vor bis after Meter hinter dem Halt, wo er am Ziel hält, auf seiner Spur (lane Meter
 * daneben) und langsamer als still m/s –, kann Mini Adam dort eine Folge machen (Taste B, Touch-Knopf). gifts: so
 * viele kleine Brunnenspenden gibt es dafür (economy.js wayGifts; am Ziel sind es mehr und größere Ortsspenden).
 * remind: Steht er länger da, kommt der Hinweis am Rand so viele Sekunden nach dem letzten wieder.
 */
export const WAY = { before: 6, after: 2, lane: 0.8, still: 0.3, gifts: 2, remind: 8 };

export class ZielPart {
  // --- Navi ------------------------------------------------------------------------
  /**
   * OMI nennt die nächste Ausfahrt am ersten Vorwegweiser, wie das Schild am Rand: „Nächste Ausfahrt: Hanau-Nord in
   * 1000 Metern.“ – und sagt dazu, ob die Route dort abfährt oder auf der Autobahn bleibt. Ruhig (EXIT_CALL): Eine
   * Ausfahrt, an der die Route vorbeiführt, nennt sie höchstens alle EXIT_CALL.gap Sekunden; jede Gabelung einmal,
   * nie in einer Szene und nie in einen anderen Satz hinein (wer dann zu spät kommt, entfällt).
   */
  exitCall() {
    const nx = this.world.trip().nextExit();
    if (!nx || nx.fork === this.exitSaid || nx.dist > EXIT_CALL.at) return;
    if (nx.dist < EXIT_CALL.late) {
      this.exitSaid = nx.fork;
      return;
    }
    if (this.charging || this.tv || this.t < this.voiceUntil) return;
    if (!nx.exit && this.t - this.exitSaidT < EXIT_CALL.gap) {
      this.exitSaid = nx.fork;
      return;
    }
    this.exitSaid = nx.fork;
    this.exitSaidT = this.t;
    this.say(exitLine(nx), 'talk', { priority: false });
  }

  updateNavi(dt) {
    const p = this.player;
    const nv = this.navi;
    const A = this.auction;
    // 5 km vor dem Brunnen fällt der Zuschlag: Ab da steht das Ziel fest, und bis zur Ankunft ruht die Uhr der Gebote
    if (A.phase === 'offen' && nv.target && nv.km <= AUKTION.lock) this.zuschlag();
    // (eine Folge unterwegs ändert die Runde nicht: Solange sie läuft, kommt kein Gebot, und ein offenes Bieterfenster
    // wartet, bis sie vorbei ist)
    if (this.tv && this.tv.way) {
      if (A.phase === 'fenster') A.until += dt;
      this.T.bid = Math.max(this.T.bid, 1);
      return;
    }
    if (A.phase === 'fest' || A.phase === 'folge' || A.phase === 'aus') {
      this.T.bid = Math.max(this.T.bid, 1);
      return;
    }
    if (A.phase === 'fenster') {
      // das Bieterfenster nach der Folge: Navi-Zeile und roter Balken zählen mit, der Chat kurz vor Schluss auch
      const left = A.until - this.t;
      nv.window = Math.max(0, Math.ceil(left));
      if (!A.warned && left <= AUKTION.warn) {
        A.warned = true;
        this.chat(this.chatLine(this.eco.level >= 2 ? CHAT.fensterBald : CHAT.fensterStill));
        this.gags.fail('fenster');
      }
      // ob jemand bietet, würfelt die Stream-Kasse je Schritt nach der Stimmung (economy.js windowBid) – die ersten
      // TV.pause Sekunden gehören James' Aufruf; bietet bis zum Ende niemand, ist der Stream vorbei (endless: dann
      // bietet doch noch jemand)
      const heard = this.t - (A.until - AUKTION.window) >= TV.pause;
      if ((heard && this.eco.windowBid(dt)) || (left <= 0 && this.endless)) this.T.bid = 0;
      else if (left <= 0) {
        this.streamOver();
        return;
      } else this.T.bid = Math.max(this.T.bid, 1);
    }
    // (… und ist der Wagen dort schon im Zielort, wartet das nächste Gebot, bis er am Brunnen steht oder vorbeigerollt
    // ist: Die erste Runde soll an einem Brunnen enden, nicht zweihundert Meter davor – höchstens TOWN_HOLD lang)
    this.townT = nv.inTown ? this.townT + dt : 0;
    if (nv.opening && nv.inTown && this.townT < TOWN_HOLD) this.T.bid = Math.max(this.T.bid, 1);
    if (this.T.bid <= 0) {
      const plan = this.bidPlan;
      const siegen = this.bidTargets().find((x) => x.special === 'siegen');
      if (plan.kind === 'step' && siegen && nv.target !== siegen && chance(0.16)) {
        // Siegen wird geboten … und sofort überboten
        const n = viewerName();
        // Das Siegen-Gebot zählt wirklich: Das Navi stellt kurz auf Siegen um (Navi und James sagen dasselbe), die
        // Kasse bekommt den Zehner, und das Gegengebot liegt darüber.
        nv.overbid(p.s, n, this.eco.extraBid(), siegen);
        this.stats.naviChanges++;
        this.stats.topBid = Math.max(this.stats.topBid, nv.bid);
        this.earn(nv.bid, 'Navi-Gebote', { silent: true });
        this.thank('bids', n, nv.bid);
        this.bot('james', `${n} bietet ${fmtEuro(nv.bid)} – neues Ziel: Siegen`);
        this.bidChip(n, siegen);
        this.chat(pick(['SIEGEN!', 'Siegen? 👀', 'Diesmal Siegen!']));
        // bis das Gegengebot da ist, ruht die Uhr
        this.T.bid = 99;
        // (Hält der Wagen in der Zwischenzeit am Brunnen von Siegen, gehört das nächste Gebot zur neuen Runde)
        // (… es sei denn, in der Zwischenzeit fiel der Zuschlag: Dann setzt sich Siegen durch)
        this.later(2.2, () => (this.roundNew || this.navi.stopping || this.auction.phase !== 'offen' ? null : this.changeNavi(true)));
      } else this.changeNavi(false);
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
    // neue Runde nach einer Ankunft: Es geht wieder beim ersten Zehner los (und das Bieterfenster ist zu)
    if (this.roundNew) {
      this.roundNew = false;
      nv.bid = 0;
    }
    if (this.auction.phase === 'fenster') {
      this.auction.phase = 'offen';
      nv.window = 0;
    }
    let bidder = viewerName();
    let target;
    if (plan.kind === 'duel' || plan.kind === 'bontana') {
      // Bieterduell: Zwei schaukeln sich hoch, jeder mit seinem Ziel – der Herausforderer und wer gerade vorn lag
      // (BontanaBacks Auftritt läuft genauso, nur ist er der Herausforderer)
      if (plan.first || !this.duel) {
        const holder = nv.bidder === 'Mini Adam' ? viewerName() : nv.bidder;
        if (plan.kind === 'bontana') bidder = BONTANA.name;
        this.duel = { n: 0, who: [{ name: bidder, target: this.pickBidTarget() }, { name: holder, target: nv.target }] };
      }
      const d = this.duel.who[this.duel.n++ % 2];
      bidder = d.name;
      target = d.target;
    }
    // Fährt der Wagen schon durch den Zielort, nimmt ihm dieses Gebot das BrunnenTV vor der Nase weg
    const snatched = nv.inTown;
    const t = nv.overbid(p.s, bidder, plan.increment, target || this.pickBidTarget());
    this.stats.naviChanges++;
    this.stats.topBid = Math.max(this.stats.topBid, nv.bid);
    this.earn(nv.bid, 'Navi-Gebote');
    this.thank('bids', bidder, nv.bid);
    // (echte Orte heißen überall wie auf ihrer Ortstafel, auch wenn es eilt) – jedes Gebot im Chat und am Rand
    this.bot('james', `${bidder} bietet ${fmtEuro(nv.bid)} – neues Ziel: ${t.name}`);
    this.bidChip(bidder, t);
    if (siegenOverbid) this.later(0.8, () => this.chat(pick(['Siegen wurde überboten. Wie immer 😂', 'Nicht schon wieder Siegen verpasst', 'Klassiker'])));
    this.eco.cheer(chaos ? 'bidChaos' : plan.kind === 'big' || plan.kind === 'bontana' ? 'bidBig' : 'bid');
    // Echte Orte liegen Minuten auseinander – die Stream-Kasse plant die Ruhe danach mit der Fahrzeit des Navis
    const next = this.eco.nextBid({ bid: nv.bid, drive: nv.driveSecs(), opening: nv.opening });
    this.bidPlan = next;
    this.T.bid = next.delay;

    // Was der Chat dazu sagt
    if (chaos) {
      this.audio.tone(1174.7, 0.07, 'triangle', 0.035);
      if (plan.first) {
        this.ui.toast('🤑 Bieter-Chaos im Chat: Jeder legt einen Zehner drauf!', 'info');
        this.burst(CHAT.zehnerChaos, 2, 2.5);
      } else if (chance(0.3)) this.chat(this.chatLine(CHAT.zehnerChaos));
    } else {
      this.audio.naviAlert();
      if (plan.kind === 'duel') {
        if (plan.first) {
          this.ui.toast(`🤑 Bieterduell: ${this.duel.who[0].name} gegen ${this.duel.who[1].name}`, 'info');
          this.burst(CHAT.bidDuel, 3, 3);
        } else if (chance(0.4)) this.chat(this.chatLine(CHAT.bidDuel));
        if (next.kind !== 'duel' || next.first) this.later(1.6, () => this.chat(this.chatLine(CHAT.bidDuelEnd)));
      } else if (plan.kind === 'bontana') this.bontanaChat(plan, bidder);
      else if (plan.kind === 'big') {
        this.ui.toast(`🤑 Großes Gebot: ${fmtEuro(nv.bid)} von ${bidder}`, 'good');
        this.burst(CHAT.zehnerGross, 3, 2.5);
      } else this.burst(CHAT.ortChanged, 2, 3);
    }
    if (snatched) this.later(1, () => this.burst(CHAT.brunnenWeg, 2, 2.5));
    if (t.special === 'siegen') this.later(1.4, () => this.chat('SIEGEN SETZT SICH DURCH?! 😱'));
    // OMI und der Hinweis aufs neue Ziel kommen erst, wenn es kurz stehen bleibt – im Chaos und im Duell kämen sie
    // nicht hinterher
    if (next.delay > 6) {
      if (chaos) this.later(rand(2.5, 4), () => this.chat(this.chatLine(CHAT.bidCalm)));
      this.announceTarget(t);
      this.onMood('curious', 1);
      if (t.note) this.ui.toast('📍 ' + t.note, 'info', 'navi');
      // die Fahrt wendet über die nächste Ausfahrt und ihre Rampen (nv.wende gibt es nur, wenn sie zurückführt) – das
      // muss der Spieler fahren, deshalb als Warnung
      if (nv.wende) {
        this.later(1.5, () => this.chat(this.chatLine(CHAT.ortWende)));
        this.later(3.5, () => nv.target === t && this.ui.toast('↩️ Navi: „Bitte wenden“ – über die nächste Ausfahrt', 'warn', 'navi'));
      }
    }
  }

  /**
   * Die Ziele, auf die gerade geboten werden kann (je Ziel: name, optional weight, special, note): die echten Orte der
   * Karte, die die Fahrt von hier über Straßen erreicht – gewichtet nach Bekanntheit, Entfernung und Neuheit
   * (WorldNavi.candidates).
   */
  bidTargets() {
    return this.navi.candidates();
  }

  /** Wohin der nächste Bieter will (nie dorthin, wo es ohnehin gerade hingeht). */
  pickBidTarget() {
    return this.eco.pickTarget(this.bidTargets(), this.navi.target);
  }

  /**
   * Die Folge ist vorbei: Das Bieterfenster der neuen Runde geht auf. James eröffnet es, Navi-Zeile und roter Balken
   * zählen die Sekunden. Wann das erste Gebot kommt – oder ob keins –, würfelt die Stream-Kasse Schritt für Schritt
   * nach der Stimmung (updateNavi, economy.js windowBid); ohne Gebot endet der Stream (außer endless: Prüfstände).
   */
  openWindow() {
    const A = this.auction;
    A.phase = 'fenster';
    A.until = this.t + AUKTION.window;
    A.warned = false;
    this.navi.window = AUKTION.window;
    this.T.bid = Math.max(this.T.bid, 1);
    this.bot('james', `Neue Runde! Wohin geht es als Nächstes? Gebote ab 10 € – ihr habt ${AUKTION.window} Sekunden.`);
  }

  /**
   * Im Bieterfenster hat niemand geboten: Der Stream ist vorbei. James sagt es, der Chat verabschiedet sich, dann der
   * Abspann mit dem Grund 'stream' (wie nach der Werkstatt, menus.js REASONS).
   */
  streamOver() {
    this.auction.phase = 'aus';
    this.navi.window = 0;
    this.bot('james', 'Keine Gebote mehr – niemand will weiter. Der Stream ist vorbei. Danke fürs Zuschauen! ❤');
    this.burst(CHAT.streamEnde, 3, 2.4);
    this.later(3.2, () => this.end('stream'));
  }

  /** Das Gebot am Rand (oben, als Hinweis der Auktion – ein neues ersetzt das alte): wer vorn liegt, wie viel, wohin. */
  bidChip(bidder, t) {
    this.ui.toast(`🔨 ${bidder} bietet ${fmtEuro(this.navi.bid)} → ${t.name}`, 'info', 'auktion');
  }

  /**
   * Ein neues Ziel steht (das letzte Gebot eines Rennens, ein einzelnes ruhiges Gebot oder der Zuschlag): OMI sagt
   * es mit Brunnen und Ort an („Neues Ziel: Marktbrunnen in Würzburg!“), und die Navi-Zeile zeigt es hervorgehoben.
   * Was das Navi sonst dazu sagt – die Zeile zum Ort, „Bitte wenden“ –, steht als Hinweis mit dem Schlüssel 'navi'
   * darunter: immer nur einer, und er geht mit dem Ziel, zu dem er gehört.
   */
  announceTarget(t) {
    if (this.auction.said === t) return;
    this.auction.said = t;
    this.naviSaidT = this.t;
    this.say(fillTemplate(BOARD.neuesZiel, { ziel: fountainIn(t) }), 'think');
    this.ui.naviNews();
  }

  /**
   * Der Zuschlag (AUKTION.lock Navi-Kilometer vor dem Brunnen): Wer jetzt vorn liegt, bekommt das Ziel. Ein laufendes
   * Rennen (Chaos, Duell, BontanaBack) endet hier, der Rest seiner Gebote entfällt. Kurze Fanfare, oben am Rand der
   * Gewinner mit Betrag, James und der Chat feiern ihn; stand das Ziel noch nicht angesagt, sagt OMI es jetzt.
   */
  zuschlag() {
    const nv = this.navi;
    const t = nv.target;
    const plan = this.bidPlan;
    const race = this.eco.cutRace() || ((plan.kind === 'chaos' || plan.kind === 'duel' || plan.kind === 'bontana') && !plan.last);
    this.auction.phase = 'fest';
    this.duel = null;
    this.audio.zuschlag();
    const who = nv.bidder;
    this.ui.toast(`🔨 Zuschlag: ${who} · ${fmtEuro(nv.bid)} · ${t.name}`, 'good', 'auktion');
    this.bot('james', `Zuschlag für ${who}: ${fmtEuro(nv.bid)}!` + (race ? ' Das Rennen ist entschieden.' : '') + ` Das Ziel steht fest: ${t.goal || t.name}.`);
    this.later(0.8, () => this.burst(CHAT.zuschlag, 2, 2.5));
    this.announceTarget(t);
  }

  onArrive(e) {
    const p = this.player;
    const t = e.target;
    this.stats.naviReached++;
    // (OMI sagt hier nichts: Gleich beginnt die Folge, und die hat genau einen Satz von ihr, TV.nomi)
    this.onMood('cheer', 1);
    this.audio.jingle();
    // an jedem erreichten Navi-Ziel wird ein Karosserie-Punkt repariert (mit Pflaster)
    if (p.repair(1)) {
      this.ui.damage();
      this.later(2.2, () => this.ui.toast('🩹 ' + damageLine('repair'), 'good'));
    }
    // die Ankunft sagt die Navi-Zeile an („Ziel erreicht: …“)
    this.ui.naviNews();
    this.burst(CHAT.ortReached, 4, 3);
    // Fürs Ankommen selbst gibt es nichts – aber der Chat feiert es mit einem Schwung Ortsspenden (Siegen: doppelt)
    const round = this.eco.round;
    const gifts = this.eco.arrive({ double: t.special === 'siegen' });
    // Die Runde wird abgerechnet – ihre Einnahmen (samt dieser Ortsspenden) und die Werkstatt-Rechnung; der Chat urteilt
    // über die ganze Runde (satisfaction.js arrive) und sagt es, wenn es deutlich war
    this.settleRound(round, gifts);
    // (der Ton passt zur Laune: ein mürrischer Chat lobt nicht, ein glücklicher drängelt nicht)
    const dz = this.zufrieden.arrive();
    const zv = this.zufrieden.value;
    // eine vertrödelte Runde: Der Chat sagt es nach dem Jubel
    if (this.zufrieden.q < TROEDEL.round) this.later(3.4, () => this.troedeln('runde'));
    if (dz >= 9 && zv > ZUFRIEDEN.grumpy) this.later(2.6, () => this.chat(this.chatLine(CHAT.flott)));
    else if (dz <= -3 && zv < ZUFRIEDEN.happy) this.later(2.6, () => this.chat(this.chatLine(CHAT.schneller)));
    // bis hier steht die letzte Ortsspende spätestens im Chat (ein „5 Cent“-Angebot zum Ziel kommt erst danach)
    this.cent5.arrivedT = this.t + 2.4 + (gifts.length - 1) * 1.1;
    gifts.forEach((v, i) => this.later(1.8 + i * 1.1 + rand(0, 0.6), () => {
      // kurz gehalten, es kommen ja mehrere hintereinander: „Ortsspende von …: 5,00 €“
      const name = viewerName();
      this.donate(name, v, 'Ortsspende', { label: 'Ortsspenden', line: `Ortsspende von ${name}: ${fmtCent(v)}` });
    }));
    this.later(1.2, () => this.chat(this.chatLine(CHAT.ortsspende)));
    // danach beginnt eine neue Bieterrunde beim ersten Zehner
    this.duel = null;
    this.auction.phase = 'folge';
    this.roundNew = true;
    this.bidPlan = this.eco.nextBid({ bid: 0 });
    this.T.bid = this.bidPlan.delay;
    if (this.up.konfetti) {
      this.cockpit.addConfetti(70);
      this.audio.confetti();
      this.later(1, () => this.chat('KONFETTI! 🎉'));
    }
    switch (t.special) {
      case 'gifhorn':
        // (im Ort fährt kein Verkehr, also auch kein Streifenwagen vor: dort grüßt der Chat)
        this.burst(CHAT.gifhornOrt, 3, 2.5);
        break;
      case 'elsa':
        this.burst(CHAT.elsaKassel, 3, 2);
        break;
      case 'malte':
        this.burst(['Walte Walte Walte Walte', 'WALTE!', 'WaLTE', 'Walte ist eingestiegen ✔️'], 5, 3);
        break;
      case 'siegen':
        this.burst(['SIEGEN!!! Es ist tatsächlich passiert 😱', 'Geschichte wurde geschrieben', 'Doppelte Ortsspenden für Siegen!'], 3, 2);
        break;
      case 'bude':
        this.burst(['Diesmal die richtige Bude! 🌭', 'Falsche Bude? 😂', 'Currywurst!'], 3, 2);
        break;
      default:
        break;
    }
  }

  /** An der Ausfahrt zum Navi-Ziel vorbeigefahren (onTrip): Das verstimmt den Chat. */
  missedTarget() {
    this.eco.cheer('missedTarget');
    this.burst(CHAT.missedTarget, 3, 2.5);
  }

  /**
   * Ereignisse der Fahrt (trip.js, main.js reicht sie von der Welt durch): Dort liegen Ankunft, Ausfahrten und
   * Abzweige in der Strecke. Am Zielpunkt des Brunnenplatzes ('arrive') bremst der Wagen zum Halt; erreicht ist das
   * Navi-Ziel, wenn er am Brunnen steht ('rest') – dann wird gefeiert (onArrive jubelt selbst), und BrunnenTV beginnt.
   * Mini Adams Mimik reagiert auch sonst (neuer Weg: Blick aufs Navi), und wer an der geplanten Ausfahrt vorbeifährt,
   * verstimmt den Chat.
   */
  onTrip(e) {
    if (!this.running) return;
    if (e.type === 'arrive') {
      this.navi.stop(e.place);
      this.halt = { sec: e.sec, still: 0 };
    } else if (e.type === 'pass') this.navi.visit(e.place);
    else if (e.type === 'rest') {
      // (hat tickHalt den Halt schon selbst festgestellt, ist die Ankunft längst gefeiert)
      if (this.navi.stopping) this.arriveAtFountain();
    } else if (e.type === 'charge') this.startCharge(e);
    else if (e.type === 'fork') {
      // anders gefahren als angesagt: Die Fahrt plant von dort neu, und OMI sagt es (am geplanten Ladestopp vorbei:
      // der Stopp ist weg, die nächste Warnung bietet den nächsten Park an)
      if (e.wrong) this.say(e.stop ? REISE_AKKU.missed : 'Route wird neu berechnet.', 'think', { priority: false });
      if (e.wrong && e.stop) this.batteryWarned = 0;
      // ein Umweg mit Ziel: Der Chat stöhnt, und die Zeit des Umwegs zählt (satisfaction.js)
      if (e.wrong && this.navi.target) this.zufrieden.detour();
      if (e.wrong && e.planned === 'exit') {
        this.missedTarget();
        this.gags.fail('ausfahrt');
        this.onMood('startled', 0.5);
      } else if (e.taken === 'exit') this.onMood('curious', 0.7);
    }
  }

  /**
   * Zwischen Zielpunkt und Halt am Brunnen warten die Bieter. Kommt der Wagen nicht zum Stehen – das Ziel wechselte
   * erst im letzten Moment wieder hierher, etwa mitten im Bieterduell –, gibt die Welt den Halt auf: Dann war es keine
   * Ankunft, der Chat neckt, und die Runde läuft mit dem nächsten Gebot weiter (ohne neuen Start bei 10 €).
   */
  tickHalt(dt) {
    this.T.bid = Math.max(this.T.bid, TV.pause);
    if (!this.world.stopping()) {
      this.halt = null;
      this.navi.miss();
      this.auction.phase = 'offen';
      this.T.bid = rand(1.5, 3);
      this.burst(CHAT.brunnenVorbei, 3, 2.5);
      return;
    }
    // Die Welt meldet den Halt nur auf 2 m genau am Haltepunkt. Kam das Ziel so spät zurück, dass der Wagen erst ein
    // paar Meter dahinter steht, bliebe er dort für immer gebremst – er steht am Brunnen, also zählt es als Ankunft.
    this.halt.still = this.player.speed < 0.15 ? this.halt.still + dt : 0;
    if (this.halt.still > 0.5) this.arriveAtFountain();
  }

  /** Der Wagen steht am Brunnen des Navi-Ziels: Ankunft feiern, dann BrunnenTV. */
  /**
   * Reise: Am Ziel wird die Runde abgerechnet (REPARATUR, data.js). Was sie eingebracht hat (samt der Ortsspenden, die
   * gleich kommen) und was die Werkstatt für ihre Rempler und Kratzer bekommt, steht kurz untereinander am oberen Rand
   * (payBill); ab hier zählt die nächste Runde.
   */
  settleRound(n, gifts) {
    const T = this.tally;
    const sum = gifts.reduce((a, v) => a + v, 0);
    const marks = scratchMarks(this.player.damage);
    const bill = { n, income: T.income + sum, hits: T.hits, marks: marks - T.marks };
    bill.amount = REPARATUR.bump * bill.hits + REPARATUR.mark * bill.marks;
    // (die Ortsspenden dieser Ankunft buchen sich gleich noch, gehören aber zu dieser Runde)
    this.tally = { income: -sum, hits: 0, marks };
    this.billDue = bill;
    this.later(3.2, () => this.payBill(bill));
  }

  /**
   * Schäden abbuchen, immer ganz (REPARATUR je Rempler und Kratzer): Die Stream-Kasse darf dafür ins Minus gehen. Die
   * Abrechnung führt sie unter „Schäden“ (mit der Zahl der Rempler und Kratzer im Abspann), am Guthaben steht der Abzug.
   */
  chargeDamage(hits, marks) {
    const amount = REPARATUR.bump * hits + REPARATUR.mark * marks;
    if (amount <= 0) return 0;
    this.money -= amount;
    this.breakdown.Schäden = (this.breakdown.Schäden || 0) - amount;
    const D = this.damageBill;
    D.hits += hits;
    D.marks += marks;
    D.amount += amount;
    if (!this.over) this.ui.money(-amount, 'Schäden');
    return amount;
  }

  /**
   * Die Werkstatt-Rechnung einer Runde (chargeDamage): Am Rand die Zeile der Runde – die Einnahmen, darunter in einer
   * eigenen Zeile „Schäden −325 € (2 Rempler · 1 Kratzer)“ –, am Guthaben der Abzug, James bucht, der Chat nimmt es
   * gelassen – und wer heil angekommen ist, wird gefeiert.
   */
  payBill(b) {
    if (this.billDue !== b) return;
    this.billDue = null;
    const paid = this.chargeDamage(b.hits, b.marks);
    // Teile mit Klasse bleiben beisammen, umbrochen wird nur an den Trennern ohne Klasse (auf dem Handy hochkant) – und
    // nie vor einem „·“ (geschütztes Leerzeichen davor); die Schäden stehen in einer eigenen Zeile (schaden)
    const dot = '\u00a0· ';
    const parts = [[`🧾 Runde ${b.n}`, 'runde'], [dot], [`Einnahmen +${fmtEuro(b.income)}`, 'plus']];
    if (!paid) parts.push([dot], ['keine Schäden ✨', 'plus']);
    else parts.push([' '], [`Schäden −${fmtEuro(paid)} (${damageCount(b.hits, b.marks)})`, 'minus schaden']);
    this.ui.toast(parts.map((x) => x[0]).join(''), paid ? 'info' : 'good', 'rechnung', parts);
    if (!paid) {
      if (chance(0.6)) this.later(1, () => this.chat(this.chatLine(CHAT.heil)));
      return;
    }
    const what = damageCount(b.hits, b.marks).replace(' · ', ' und ');
    const left = this.money < 0 ? ` – die Stream-Kasse steht jetzt bei −${fmtCent(-this.money)}.` : ' – bezahlt aus der Stream-Kasse.';
    this.bot('james', `Werkstatt-Rechnung für Runde ${b.n}: ${fmtEuro(paid)} für ${what}` + left);
    this.later(1.2, () => this.chat(this.chatLine(CHAT.reparatur)));
  }

  arriveAtFountain() {
    const sec = this.halt.sec;
    this.halt = null;
    const t = this.navi.arrive();
    this.onArrive({ target: t });
    this.onMood('happy', 0.6);
    this.startBrunnenTV(t, sec);
  }

  /**
   * BrunnenTV. Die Regel des Eigentümers: „Wenn das Navi-Ziel (in einer Stadt) vor der nächsten Änderung erreicht
   * wurde, gibt es am Ziel BrunnenTV.“ Eine Ankunft gibt es nur am Brunnenplatz des aktuellen Ziels – steht der
   * Wagen dort, wurde es vor der nächsten Änderung erreicht: Jede Ankunft ist eine Folge. Weg nimmt sie nur ein
   * Gebot, das das Ziel ändert, bevor der Wagen am Brunnen steht (siehe changeNavi, snatched, und tickHalt).
   * Und seit dem 19.11.: „Wenn das Ziel erreicht wird, macht Mini Adam dort BrunnenTV aus dem Auto mit dem Megafon.“
   * Die Folge läuft nach dem Fahrplan TV (world/xxl/brunnentv.js, Sekunden ab dem Halt): Bauchbinde „BrunnenTV · Folge
   * N“, Mini Adam durchs Megafon zum Brunnen, der Chat jubelt, OMI sagt etwas, dann darf der Wagen weiter. main.js
   * zeigt dazu Fenster, Megafon und Kameras (onBrunnenTV({ n, place, name, goal, sec, fountain, town }): Folge, Ort,
   * Name des Ziels, Abschnitt, Brunnenplatz der Welt mit Lage und Haltepunkt, der Ort aus dem Stadtbaukasten); ohne
   * Szene (Node-Tests) läuft derselbe Fahrplan, der Wagen wartet an seinem Halt.
   */
  startBrunnenTV(t, sec, { way = false } = {}) {
    this.stats.brunnenTV++;
    // je Ortsdurchfahrt eine Folge: am Brunnen des Ziels gibt es danach keine zweite unterwegs (wayOffer)
    if (sec) this.wayDone.add(sec);
    // ins Album (album.js): Die Folge zählt über alle Streams, und so heißt sie auch in Bauchbinde und Abspann-Route
    const town = this.world.town(sec);
    const kinds = town && town.plan && Array.isArray(town.plan.fountains) ? town.plan.fountains.map((f) => f.kind) : [];
    const entry = addEpisode(this.save, { place: t.place, t: this.streamT, clock: this.clock, kinds, way });
    const n = entry.n;
    this.tv = { n, place: t.place, name: t.name, goal: t.goal || t.name, t0: this.t, said: 0, called: false, debate: entry.d || null, way };
    // ab jetzt gehört die Sprachausgabe der Folge: Was spricht, endet höflich, alles andere wartet dahinter (speech.js)
    this.speech.episode?.(true);
    this.quote.tv.push({ t: this.t, n });
    this.routeMark('brunnen', way ? { n, place: t.place, way: true } : { n, place: t.place });
    this.onBrunnenTV({ n, entry, place: t.place, name: t.name, goal: this.tv.goal, sec, fountain: this.world.square(sec), town, way });
  }

  /**
   * BrunnenTV unterwegs: der Ort, in dem Mini Adam jetzt eine Folge machen könnte ({ sec, place }), oder null (siehe
   * WAY). Nicht im Ort des Navi-Ziels (dort gibt es die Folge des Ziels), nur einmal je Durchfahrt, nicht in einer
   * anderen Szene (Folge, Ladestopp, Halt am Ziel, Funkloch).
   */
  wayOffer() {
    if (!this.running || this.over || this.tv || this.charging || this.halt || this.funkloch > 0 || !this.world.hold) return null;
    if (Math.abs(this.player.speed) > WAY.still) return null;
    const trip = this.world.trip();
    const sec = trip && trip.section;
    if (!sec || sec.kind !== 'stadt' || sec.start || !(sec.place >= 0) || sec.place === trip.target || this.wayDone.has(sec)) return null;
    if (this.world.stopping()) return null;
    const q = this.world.square(sec);
    if (!q || !q.stop) return null;
    const d = trip.s - q.stop.s;
    if (d < -WAY.before || d > WAY.after || Math.abs(this.player.x - q.stop.x) > WAY.lane) return null;
    return { sec, place: sec.place };
  }

  /**
   * Taste B / Knopf „BrunnenTV hier“: die Folge unterwegs, wenn wayOffer sie anbietet. Dieselbe Folge wie am Ziel –
   * Bauchbinde, Gruß, „Schöner Brunnen!“, Chat und OMI, Album und Abspann –, aber die Runde läuft weiter: Das Ziel
   * und die Gebote bleiben, abgerechnet wird nichts, kein Bieterfenster; dafür zwei kleine Brunnenspenden. Die Welt
   * hält den Wagen, bis die Folge vorbei ist.
   */
  wayEpisode() {
    const o = this.wayOffer();
    if (!o) return false;
    const p = places[o.place];
    this.world.hold(o.sec);
    this.ui.dropKey('brunnenHier');
    this.onMood('happy', 0.4);
    this.startBrunnenTV({ place: o.place, name: p.name, goal: goalName(p) }, o.sec, { way: true });
    const gifts = this.eco.wayGifts();
    gifts.forEach((v, i) => this.later(TV.chat + 1.6 + i * 1.3, () => {
      const name = viewerName();
      this.donate(name, v, 'Brunnenspende', { label: 'Brunnenspenden', line: `Brunnenspende von ${name}: ${fmtCent(v)}` });
    }));
    return true;
  }

  /** Eine Marke auf der Route des Streams (main.js trägt über onRouteMark ihre Lage auf der Karte nach). */
  routeMark(type, data) {
    this.onRouteMark(this.route.mark(type, data));
  }

  /** Sekunden seit dem Halt am Brunnen (Fahrplan der Folge). */
  brunnenT() {
    return this.tv ? this.t - this.tv.t0 : 0;
  }

  /**
   * Solange die Folge läuft, wartet die nächste Bieterrunde; ihre Momente kommen je einmal zu ihrer Zeit, und sie endet
   * erst bei TV.end – überspringen lässt sie sich nicht (brunnentv.js), der Ruf „Schöner Brunnen!“ kommt in jeder Folge.
   */
  tickBrunnenTV() {
    const tv = this.tv;
    this.T.bid = Math.max(this.T.bid, TV.pause);
    const t = this.t - tv.t0;
    const moments = [
      [TV.card, () => {
        this.ui.brunnenTV(tv.n, tv.name);
        // Mini Adam moderiert als Herr Schönnbrun: dessen Hymne eröffnet die Folge
        this.audio.schoennbrunHymne();
      }],
      [TV.line, () => this.brunnenMegafon(tv)],
      [TV.chat, () => {
        this.chat('BRUNNENTV! 💦');
        this.burst(CHAT.brunnenTV, 4, 3);
        this.gags.tvGreet();
        // passt eine Streitfrage des Wikis (Trinkbrunnen, Kanal, Alsterfontäne), kommt sie nach dem Jubel
        if (tv.debate) this.later(3.2, () => this.chat(this.chatLine(BRUNNEN_DEBATTE[tv.debate])));
      }],
      [TV.call, () => this.brunnenCall()],
      [TV.nomi, () => this.say(fillTemplate(pick(BRUNNEN_NOMI), { n: fmtNum(tv.n) }), 'love', { priority: false, scene: true })],
    ];
    while (tv.said < moments.length && t >= moments[tv.said][0]) moments[tv.said++][1]();
    if (t >= TV.end) this.endBrunnenTV();
  }

  /**
   * Mini Adam grüßt durchs Megafon den Brunnen, mit seiner tiefen Stimme (VOICES.adam); der Satz steht unten im Bild
   * wie ein Megafon-Wunsch, nur mit Herrn Schönnbrun statt eines Käufers – als der moderiert Mini Adam die Folge
   * (SCHOENNBRUN.label; die Bauchbinde darüber nennt ihn auch). Nur ein
   * Gruß, der vor seinem Ruf (TV.call) zu Ende ist: Mit langem Ortsnamen bleiben die kürzeren.
   */
  brunnenMegafon(tv) {
    // (echte Stimmen sprechen oft langsamer als geschätzt: Der Gruß lässt dem Ruf Luft; passt keiner, der kürzeste)
    const room = (TV.call - TV.line - 0.3) / SPEECH_SLACK;
    const all = BRUNNEN_MEGAFON.map((l) => fillTemplate(l, { ort: tv.name }));
    const fits = all.filter((l) => estimateSpeech(l, VOICES.adam.rate) <= room);
    const text = fits.length ? pick(fits) : all.reduce((a, b) => (b.length < a.length ? b : a));
    this.audio.megafon();
    // ein Satz der Folge (episode): Was sonst noch reden wollte, wartet dahinter; sein Untertitel kommt mit ihm
    const dur = this.speech.say(text, 'adam', { episode: true, onStart: (d) => this.ui.megafon(text, d + 1, '', SCHOENNBRUN.label) });
    this.voiceUntil = Math.max(this.voiceUntil, this.t + dur + 0.6);
    this.onMood('megafon', Math.min(dur, TV.lift.down[0] - TV.line));
  }

  /**
   * Der Ruf jeder Folge (SCHOENER_BRUNNEN): Mini Adam ruft „Schöner Brunnen!“ durchs Megafon, tief und langgezogen
   * (VOICES.brunnen); der Untertitel schreibt es, wie es klingt, und der Chat ruft es nach. Genau einmal je Folge.
   */
  brunnenCall() {
    const S = SCHOENER_BRUNNEN;
    if (this.tv) this.tv.called = true;
    this.audio.megafon();
    // ein Satz der Folge (episode) und sofort (cut): vor allem, was sonst wartet; der Gruß davor redet aus (die Folge
    // wird nie unterbrochen – brunnenMegafon wählt ihn so kurz, dass er vorher endet). Sein Untertitel kommt mit ihm
    // und bleibt oben, bis er abläuft (top), auch wenn derweil ein anderer Satz kommt
    const dur = this.speech.say(S.say, 'brunnen', {
      episode: true,
      cut: true,
      onStart: (d) => {
        const line = this.ui.megafon(S.text, d + 1.2, '', SCHOENNBRUN.label);
        if (line && typeof line === 'object') line.top = true;
      },
    });
    this.voiceUntil = Math.max(this.voiceUntil, this.t + dur + 0.6);
    this.onMood('megafon', Math.min(dur, TV.lift.down[0] - TV.call));
    // die Zuschauer sind begeistert (CHEER.brunnenTV: Stimmung und ein Schub Zuschauer, ZUFRIEDEN.tv), oben links
    // leuchtet die Zuschauerzahl, solange sie steigt (viewersUpT), und der Chat feiert die Folge
    this.eco.cheer('brunnenTV');
    this.zufrieden.brunnenTV();
    this.viewersUpT = this.t + TV.end - TV.call + 4;
    if (this.tv) this.tv.viewers = this.viewers;
    this.later(0.6, () => {
      this.chat(S.chat[0]);
      this.burst(S.chat.slice(1), 3, 2.5);
    });
    this.later(3.4, () => this.burst(CHAT.brunnenJubel, 4, 3));
  }

  /** Die Folge ist vorbei: Bauchbinde weg, der Wagen darf weiter – durch den Ort zur nächsten Straße. */
  endBrunnenTV() {
    const way = this.tv && this.tv.way;
    // was die Folge gebracht hat, steht kurz am Rand
    const gain = this.tv && this.tv.viewers !== undefined ? Math.round(this.viewers - this.tv.viewers) : 0;
    if (gain >= 20) this.ui.toast(`📈 BrunnenTV: +${fmtNum(gain)} Zuschauer`, 'good', 'zuschauer');
    this.tv = null;
    // was hinter der Folge gewartet hat, spricht jetzt (Veraltetes entfällt)
    this.speech.episode?.(false);
    this.ui.brunnenTV(0);
    this.world.release();
    // (unterwegs läuft die Runde weiter: kein Bieterfenster)
    if (!way) this.openWindow();
    this.sayHeld();
  }
}
