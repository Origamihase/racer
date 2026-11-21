// Eine Fahrt: Regie für alle Ereignisse (linke Spur, Navi-Gebote, Regen, Blitzer, Polizei Gifhorn,
// Sprachdurchsagen, Rahmen, Funkloch, Zuschauer, Spenden, Jobs) und die Abrechnung am Ende.
// Geld kommt nur vom Publikum: Die Stream-Kasse und die heimliche Chat-Stimmung rechnet economy.js.
import {
  CHAT, BOTS, BOARD, DURCHSAGEN, DURCHSAGEN_REGEN, RAHMEN, RAHMEN_GAP, VOICES, JOB_TEMPLATES, REISE_AKKU, REPARATUR, CREW, CREW_LINES, INCOME, SPENDEN_ZWECKE, AKTIONEN,
  MEGAFON_WUENSCHE, SAMMELAKTIONEN, STUDIO, viewerName, fillTemplate, alterReaction, berufFor, fmtBetrag,
  BRUNNEN_MEGAFON, BRUNNEN_NOMI, BRUNNEN_DEBATTE, SCHOENER_BRUNNEN, PARTYPEOPLE,
} from '../data.js';
import { clamp, rand, randInt, chance, pick, shuffle, damp, fmtCent, fmtEuro, fmtNum, fmtClock } from '../util.js';
import { Player } from './player.js';
import { damageLine } from './damage.js';

/** Kratzspuren von der Leitplanke am ganzen Wagen (je Seite höchstens drei, damage.js). */
const scratchMarks = (damage) => Object.values(damage.scratches).reduce((a, v) => a + v, 0);
import { WorldNavi } from './navi.js';
import { Economy, BONTANA } from './economy.js';
import { Satisfaction, ZUFRIEDEN } from './satisfaction.js';
import { Vector3 } from 'three';
import { elephantPair } from '../world/traffic.js';
import { EYE } from '../cockpit/cockpit.js';
import { ELSA_STATUE } from '../world/scenery.js';
import { curvePoint } from '../curve.js';
import { stopPlan, STOP } from '../world/xxl/charge.js';
import { TV } from '../world/xxl/brunnentv.js';
import { addEpisode } from './album.js';
import { places } from '../map/graph.js';
import { goalName } from '../world/kit/layout.js';
import { RouteLog } from './routelog.js';
import { estimateSpeech } from '../speech.js';

const POLICE_TEXTS = ['POLIZEI GIFHORN', 'GUTE FAHRT, ADAM!', 'GIFHORN GRÜSST', 'BITTE LÄCHELN'];
// „5 Cent, wenn du …“: Nur bei einem Teil der Angebote (LAGE_SHARE) achtet der Chat auf die Lage, die übrigen kommen
// aus dem großen Vorrat – sonst gäbe es fast nur Regen- und Brunnen-Angebote, denn eins von beiden ist fast immer.
// Passt eins zur Lage, darf es kommen, sobald die Uhr weniger als so viele Sekunden zeigt: Ein Ziel, ein Brunnen
// oder Elsa sind nur kurz da und selten, ein Laster, Regen oder eine lange Gerade öfter.
const LAGE_SHARE = 0.4;
const OFFER_EARLY = { ziel: 100, brunnen: 100, elsa: 100, laster: 50, regen: 50, gerade: 40 };
// Lange Gerade: Die Krümmung unter dem Wagen (aus dem Kurs, siehe course.js) bleibt so klein, dass die Straße auf
// 200 m höchstens 1 m zur Seite läuft, und das schon so viele Meter lang.
const STRAIGHT_KAPPA = 1 / 20000;
const STRAIGHT_RUN = 400;
// Rechts oben deckt der Innenspiegel aus Mini Adams Sicht ab etwa 17,8° rechts der Blickrichtung ab
// (auf dem Handy hochkant endet dort fast schon das Bild): bis 16° steht Elsa frei in der Scheibe.
const ELSA_VIEW = (16 * Math.PI) / 180;
const elsaTmp = new Vector3();
// Wie flott der Chat schreibt, je nach Stufe der heimlichen Chat-Stimmung (0 im Keller … 4 bester Laune)
const CHAT_PACE = [1.3, 1.12, 1, 0.92, 0.85];
// BrunnenTV am Navi-Ziel (Reise): Fahrplan der Folge in world/xxl/brunnentv.js (TV); das erste Gebot der nächsten
// Runde kommt frühestens TV.pause Sekunden, nachdem der Wagen fahren darf.
/** Entfernung für NOMIs Ansage: „39 Kilometern“, unter 10 km mit einer Nachkommastelle („4,5 Kilometern“). */
/** Das Ziel für NOMI: „Marktbrunnen, Würzburg“ → „Marktbrunnen in Würzburg“ (ohne eigenen Namen „Brunnen in …“). */
export function fountainIn(t) {
  const tail = ', ' + t.name;
  const g = t.goal || 'Brunnen in ' + t.name;
  return g.endsWith(tail) ? g.slice(0, -tail.length) + ' in ' + t.name : g;
}

function kmWords(km) {
  if (km < 10) {
    const v = Math.max(0.1, Math.ceil(km * 10 - 1e-6) / 10);
    return v === 1 ? 'einem Kilometer' : v.toFixed(1).replace('.', ',').replace(',0', '') + ' Kilometern';
  }
  return Math.round(km) + ' Kilometern';
}
/**
 * Elefantenrennen (zwei Lkw nebeneinander): bestellt wird es frühestens first, dann alle every Meter Straße (bei Tempo
 * 130 gut vier bis sechs Minuten), nur mit room Metern Autobahn ohne Ausfahrt voraus; NOMI sagt es höchstens alle
 * cool Sekunden an, und nur, wenn es wirklich vor dem Wagen fährt (traffic.js elephantPair).
 */
export const ELEFANT = { first: [6000, 9000], every: [9000, 14000], room: 1500, cool: 240 };
/**
 * NOMI und die nächste Ausfahrt (Game.exitCall): Sie nennt sie ab at Metern Straße vor der Gabelung (dem ersten
 * Vorwegweiser, signplan.js BOARD_D), bis late Meter davor; eine Ausfahrt, an der die Route vorbeiführt, höchstens alle
 * gap Sekunden.
 */
export const EXIT_CALL = { at: 1000, late: 700, gap: 90 };
/** NOMIs Satz zur nächsten Ausfahrt (trip.nextExit): Name wie auf dem Schild, Meter in Worten, was die Route dort tut. */
export function exitLine(nx) {
  const L = BOARD.exit;
  const d = Math.max(50, Math.round(nx.dist / 50) * 50) + ' Metern';
  const head = fillTemplate(L[nx.kind], { name: nx.name, d });
  if (nx.plan === 'exit' && nx.kind !== 'ende') return head + ' ' + L.take;
  return nx.plan === 'stay' ? head + ' ' + fillTemplate(L.stay, { road: nx.road }) : head;
}
/**
 * Akku-Karte des Mittelbildschirms (Game.lowBattery, screenState lowBattery): unter at[0] Prozent „Akku fast leer“,
 * unter at[1] „Akku kritisch“, je show Sekunden; leer steht „Akku leer“, bis der Wagen ausgerollt ist. fade: Sekunden
 * zum Ein- und Ausblenden. Nach dem Laden (über at[0] + 2 %) kommt sie wieder.
 */
export const AKKU_CARD = { at: [10, 5], show: 8, fade: 0.35 };
/** Stufe der Akku-Karte bei pct Prozent: 0 keine, 1 fast leer, 2 kritisch, 3 leer. */
export function akkuLevel(pct) {
  return pct <= 0 ? 3 : pct <= AKKU_CARD.at[1] ? 2 : pct <= AKKU_CARD.at[0] ? 1 : 0;
}
/**
 * Verbrauch des Akkus seit dem letzten Laden (Game.journeyBattery): Meter Straße und Prozent, getrennt nach offener
 * Strecke und echter Straße; s und b sind Bandmeter und Akku der letzten Messung (NaN: noch keine); park: der nächste
 * Ladepark für die Akku-Karte (Name, Kilometerstand der Reise dort, eingeplant?), sobald sie kommen kann.
 */
const meterAkku = () => ({ next: 0, s: NaN, b: 0, open: { m: 0, pct: 0 }, real: { m: 0, pct: 0 }, park: null });
/** Ein Weg, den kein Akku schafft (Game.reachable): kein Ziel oder kein Park dahinter. */
const NOWHERE = { m: Infinity, realM: 0 };
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
// Einschaltquote für den Abspann (menus.js, ui/quotechart.js): alle QUOTE_DT Sekunden die Zuschauerzahl
export const QUOTE_DT = 5;
/**
 * „Trödeladam“ (der Eigentümer, 20.11.2026): Wer lange steht (stand Sekunden, ohne Szene und ohne Halt am Ziel),
 * lange unter dem Tempo des Navis bleibt (Fortschritt unter slowPace, slowFor Sekunden lang; satisfaction.js) oder
 * eine Runde vertrödelt (Urteil am Ziel unter round), den nennt der Chat so – mit Abstand (cool Sekunden, mit jedem
 * Mal etwas mehr, höchstens das Dreifache), und es kostet die Stimmung ein wenig (mood).
 */
export const TROEDEL = { stand: 14, slowPace: 0.7, slowFor: 45, round: 0.8, cool: 75, mood: 0.03 };
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
};
// so oft greift der Chat zu einem Running Gag (CHAT.meme), wenn einer zum Moment passt
const MEME_SHARE = 0.18;
/** Der Satz ohne seine Stichworte: „[ab] Wir sind …“ → „Wir sind …“. */
export const untag = (line) => (line.charCodeAt(0) === 91 ? line.slice(line.indexOf(']') + 2) : line);
// Radarwarner (Shop): so viele Meter vor dem Tempo-120-Schild eines Blitzers schlägt er an (ahead); erst piept das
// Kästchen, lead Sekunden später folgen NOMIs Gong und ihre Ansage
const RADAR = { ahead: 180, lead: 0.45 };

export class Game {
  /**
   * @param {object} ctx traffic, scenery, road, sky, rain, windshield, cockpit, audio, speech, ui, fx, pickups;
   *   world: { trip(): die Fahrt über die echte Karte (trip.js), stopping(): bremst der Wagen gerade zum Halt am Brunnen
   *   des Ziels?, release(): der Wagen am Brunnen darf weiterfahren, square(sec) und town(sec): Brunnenplatz und Ort
   *   einer Ortsdurchfahrt für die BrunnenTV-Szene }. Geboten wird auf echte Orte (WorldNavi): Jedes Gebot setzt das
   *   Ziel der Fahrt, das Navi im Auto zeigt sie (src/map), und die Ankunft meldet onTrip am Brunnenplatz.
   *   touchUI: Das Bild zeigt Touch-Knöpfe (Handy, Tablet), der Hinweis zum Ladestopp nennt dann den Knopf.
   */
  constructor(ctx) {
    Object.assign(this, ctx);
    this.player = new Player();
    this.navi = new WorldNavi(this.world);
    // Stream-Kasse samt heimlicher Chat-Stimmung, und was sie in jedem Schritt vom Fahren wissen will
    this.eco = new Economy();
    // die sichtbare Zufriedenheit des Chats (wie zügig es von Ziel zu Ziel geht; satisfaction.js)
    this.zufrieden = new Satisfaction();
    this.tally = { income: 0, hits: 0, marks: 0 };
    this.ecoIn = { kmh: 0, limit: false, stuck: false, leftOpen: false, inLeft: false, funkloch: false };
    this.seenAhead = new WeakSet();
    this.running = false;
    this.over = null;
    // ein Stream ohne Ende: Bietet im Fenster nach einer Folge niemand, geht es trotzdem weiter (Prüfstände über Stunden)
    this.endless = false;
    // abseits der Autobahn ruhen Ereignisse, die nur dort Sinn ergeben (setzt main.js jedes Bild)
    this.offAutobahn = false;
    // Mini Adams Mimik (main.js hängt sich ein): onMood(name, Stärke 0 … 1) bei Spenden, Schreck, Rempler, Ziel …
    this.onMood = () => {};
    // BrunnenTV am Navi-Ziel: Hier hängt sich die Szene ein (siehe startBrunnenTV)
    this.onBrunnenTV = () => {};
    // Ladestopp im Park: Hier hängt sich die Szene ein (siehe startCharge)
    this.onCharge = () => {};
    // Reise: eine Marke der Route des Streams (Folge, Ladestopp); main.js trägt ihre Lage auf der Karte nach
    this.onRouteMark = () => {};
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
    // Reise: was die laufende Runde eingebracht und gekostet hat (Rempler, Kratzspuren bis dahin; settleRound)
    this.tally = { income: 0, hits: 0, marks: 0 };
    this.over = null;
    this.running = true;
    this.queue = [];
    this.clock = 18 * 60;
    // Reise: Beginn des Streams (Datum im BrunnenTV-Album) und seine Route für den Abspann (routelog.js)
    this.streamT = Date.now();
    this.route = new RouteLog();
    this.travel = null; // Fahrt, Stelle und Kilometerzähler beim letzten Schritt (travelStep)
    this.eco.reset(up);
    this.zufrieden.reset();
    // wann die Leute des Streams das nächste Mal vorbeischauen (Sekunden; updateCrew)
    const M = (r) => rand(r[0], r[1]) * 60;
    this.crewT = { raid: M(CREW.raid.first), knolli: Infinity, mod: M(CREW.modEvery), discord: M(CREW.discordEvery), heart: M(CREW.heartEvery) };
    this.viewers = this.eco.viewers;
    this.peakViewers = 240;
    // Einschaltquote (QUOTE_DT): Zuschauer je Schritt und die Folgen mit ihrer Zeit, für die Kurve im Abspann
    this.quote = { dt: QUOTE_DT, v: [], tv: [], next: 0 };
    this.recordShown = false;
    this.lastHorn = -99;
    this.megafonCd = 0;
    this.chatT = 1.5;
    this.chatSeen = [];
    // wann zuletzt eine Gutschrift aufgeblitzt ist, die Leitplanke gekratzt hat, NOMI das Navi angesagt hat
    this.popT = -9;
    this.scrapeT = -9;
    this.naviSaidT = -99;
    // die nächste Ausfahrt (exitCall): die Gabelung, die NOMI zuletzt genannt hat, und wann
    this.exitSaid = null;
    this.exitSaidT = -99;
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
      maxViewers: 0, distance: 0, blitzerClean: 0, rainDistance: 0, crashes: 0, koriander: 0, fines: 0,
      wipes: 0, twitches: 0, photos: 0, donations: 0, subs: 0, vips: 0, topBid: 0, overtakes: 0, brunnenTV: 0,
      stopsPlanned: 0, parkCharges: 0,
    };
    // laufende BrunnenTV-Folge am Navi-Ziel (oder unterwegs, tv.way) oder null; wayDone: Ortsdurchfahrten (Abschnitte),
    // in denen es schon eine Folge unterwegs gab
    this.tv = null;
    this.wayDone = new WeakSet();
    this.wayHint = false;
    this.wayNoteT = 0;
    // Reise: Ladestopp im Ladepark ({ t0, from, park, name, sec, plan, … }, startCharge) oder null; Verbrauch seit dem
    // letzten Laden (meterAkku: Meter Straße und Akku je Art der Straße, für NOMIs Warnung) und wann sie wieder misst;
    // sugarDue: der Zuckerschub des Bananensafts kommt, sobald der Wagen nach dem Stopp wieder auf der Autobahn ist
    this.charging = null;
    this.sugarDue = false;
    this.akku = meterAkku();
    // was NOMI in einer Szene sagen wollte und erst danach sagt ([Satz, Stimmung], say)
    this.heldSay = [];
    // zwischen Zielpunkt und Halt am Brunnen: { sec: Ortsdurchfahrt, still: so lange steht der Wagen schon }
    this.halt = null;
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
    this.S = { blitzer: rand(3000, 3800), elefant: rand(ELEFANT.first[0], ELEFANT.first[1]), landmark: rand(1400, 2000), koriander: rand(2200, 2800) };
    this.elefantT = 0;
    this.blitzer = null;
    this.landmark = null;
    this.funkloch = 0;
    this.funklochT = -99; // wann das letzte Funkloch begann (FACTS.netz)
    this.said = { t: -99, voice: null }; // die letzte Sprachdurchsage (FACTS.durchsage)
    this.policeCar = null;
    this.shoulderWarned = false;
    this.batteryWarned = 0;
    this.lowBat = { lvl: 0, t: 0 };
    // Trödeladam (TROEDEL): Sekunden im Stand und unter dem Tempo des Navis, wann der Chat ihn zuletzt so nannte
    this.troedel = { standT: 0, slowT: 0, lastT: -99, n: 0 };
    this.lastHugo = 0;

    this.scenery.reset();
    this.navi.reset();
    // die erste Bieterrunde: Kaum läuft der Stream, hagelt es Gebote
    this.bidPlan = this.eco.nextBid({ bid: this.navi.bid });
    this.T.bid = this.bidPlan.delay;
    this.roundNew = false;
    this.townT = 0; // Sekunden im Zielort der ersten Runde (updateNavi)
    // Auktion (AUKTION): offen – Gebote ändern das Ziel · fest – Zuschlag erteilt, bis zur Ankunft ändert sich nichts
    // · folge – am Brunnen · fenster – nach der Folge, bis zum ersten Gebot oder bis until · aus – niemand hat
    // geboten, der Stream endet; said: das Ziel, das NOMI zuletzt angesagt hat
    this.auction = { phase: 'offen', said: null, until: 0, warned: false };
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
    this.cockpit.setRadar(this.hasRadar);
    this.ui.reset?.();
    this.ui.jobs(this.jobs);
    this.bot('hugo', 'Der Stream läuft! Viel Spaß beim Zuschauen.');
    // Mini Adam hat zu Beginn „Hallo, Partypeople!“ gesagt (Startszene, main.js): Der Chat grüßt zurück
    shuffle(PARTYPEOPLE.chat).slice(0, 4).forEach((line, i) => this.later(0.6 + i * 0.6 + rand(0, 0.3), () => this.chat(line)));
    this.later(3.4, () => this.chat('Wohin fahren wir heute?'));
    // das erste Ziel sucht der Chat erst aus
    this.later(3.2, () => this.bot('james', 'Die Gebote sind eröffnet: Wohin soll die Reise gehen? Ab 10 € seid ihr dabei.'));
    // die Challenges des Abends: Wer was verspricht, steht im Chat
    this.jobs.forEach((j, i) => this.later(10 + i * 11 + rand(0, 5), () => {
      if (!j.done) this.chat(fillTemplate(pick(CHAT.pledge), { wenn: j.wenn, betrag: fmtBetrag(j.pledge) }), j.pledger);
    }));
    this.later(68, () => {
      if (!this.allJobsPaid) this.chat(`Und wenn du alle fünf Jobs schaffst, lege ich ${fmtBetrag(this.allJobs.pledge)} drauf! 🏆`, this.allJobs.pledger);
    });
  }

  /** Titelbildschirm: Der Wagen steht am Supercharger (die Welt stellt ihn hin), kein Stream-Trubel. */
  startTitle() {
    this.running = false;
    this.over = null;
    this.player.reset({});
    this.weather = { level: 0, target: 0, active: false, dur: 0, cool: 0, announced: false, sky: 0, front: 0, next: 0, calm: 0, crashes: 0 };
    this.left = { open: false, timer: 0, glow: 0 };
    this.sirenLevel = 0;
    // nach einer Regenfahrt: Scheibe trocken, Wischer still (auch kein Fehlalarm im Titelbild)
    this.windshield.setRain(0);
    this.windshield.setAuto(false);
    this.windshield.clear();
    this.scenery.reset();
    this.navi.reset();
    this.traffic.reset();
    this.pickups.reset();
  }

  // --- Hilfen --------------------------------------------------------------
  later(delay, fn) {
    this.queue.push({ at: this.t + delay, fn });
  }

  chat(text, name = viewerName(), opts = {}) {
    if (!text) return; // (kein Satz des Vorrats passte gerade: chatLine)
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
    // (nur Sätze, die gerade stimmen: FACTS)
    const fits = pool.some((l) => l.charCodeAt(0) === 91) ? pool.filter((l) => this.fits(l)) : pool;
    if (!fits.length) return '';
    let line = pick(fits);
    for (let i = 0; i < 4 && seen.includes(line); i++) line = pick(fits);
    if (line.length > 3) {
      seen.push(line);
      if (seen.length > 14) seen.shift();
    }
    return untag(line);
  }

  /** Gilt jedes Stichwort, mit dem der Satz beginnt? (FACTS; ohne Stichwort immer) */
  fits(line) {
    if (line.charCodeAt(0) !== 91) return true;
    for (const k of line.slice(1, line.indexOf(']')).split(' ')) if (!FACTS[k](this)) return false;
    return true;
  }

  /** Die Straße unter dem Wagen (trip.js: ab, stadt, zub, conn, auf, ramp, park); ohne Fahrt über die Karte: ab. */
  roadKind() {
    const tr = this.world.trip ? this.world.trip() : null;
    return tr && tr.section ? tr.section.kind : 'ab';
  }

  /**
   * Stimmt der Anlass noch, den das Sprachstudio nennen will (economy.js why)? „Gleich sind wir da“ nur kurz vor dem
   * Ziel, „der Vordermann“ nur, solange einer vor uns herzuckelt, „das Funkloch“ nur kurz nach einem.
   */
  causeTrue(k) {
    if (k === 'nah') return !!this.navi.target && this.navi.driveSecs() < 120;
    if (k === 'stau') return !!this.stuck;
    if (k === 'funkloch') return this.t - this.funklochT < 90;
    return true;
  }

  /**
   * BontanaBack eskaliert (Reise, economy.js BONTANA): Sein Auftritt steht am Rand, der Chat dreht durch, er selbst
   * grüßt kurz, wer vorn lag, hält tapfer dagegen – und nach seinem letzten Gebot steht die Summe am Rand. James meldet
   * jedes Gebot wie immer.
   */
  bontanaChat(plan, bidder) {
    const nv = this.navi;
    const him = bidder === BONTANA.name;
    if (plan.first) {
      this.ui.toast(`🔥 ${BONTANA.name} steigt ein: ${fmtEuro(nv.bid)}!`, 'good', 'bontana');
      this.burst(CHAT.bontana, 3, 2.5);
      this.later(1.1, () => this.chat(this.chatLine(CHAT.bontanaSelbst), BONTANA.name));
    } else if (him && plan.last) {
      this.ui.toast(`🔥 ${BONTANA.name} ESKALIERT: ${fmtEuro(nv.bid)} für ${nv.target.name}!`, 'good', 'bontana');
      // sein Schlusswort (ohne Zufall: der n-te Auftritt wählt die Zeile), dann ist der Chat außer sich
      const last = CHAT.bontanaSchluss;
      this.later(0.9, () => this.chat(last[Math.max(0, this.eco.bontana.n - 1) % last.length], BONTANA.name));
      this.burst(CHAT.bontanaEnde, 4, 3);
    } else if (him) this.burst(CHAT.bontana, 2, 2);
    else if (chance(0.7)) this.later(0.6, () => this.chat(this.chatLine(CHAT.bontanaKonter)));
  }

  burst(pool, n = 3, spread = 2.5) {
    const list = typeof pool === 'function' ? null : pool;
    for (let i = 0; i < n; i++) {
      this.later(rand(0.1, spread), () => this.chat(list ? this.chatLine(list) : pool()));
    }
  }

  /** NOMI spricht (mit Gong, Untertitel und Augen-Animation). */
  say(text, mood = 'talk', { priority = true, scene = false } = {}) {
    // eine Szene (Ladestopp, BrunnenTV) hat genau einen Satz NOMIs, ihren eigenen (scene): Zufälliges Geplauder
    // (priority false) entfällt dort, Wichtiges wartet bis zum Ende der Szene (sayHeld)
    if (!scene && (this.charging || this.tv)) {
      if (priority && !this.heldSay.some((h) => h[0] === text)) this.heldSay.push([text, mood]);
      return;
    }
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

  /** Nach einer Szene: was NOMI darin Wichtiges sagen wollte (say hielt es zurück), der Reihe nach. */
  sayHeld() {
    this.heldSay.forEach(([text, mood], i) => this.later(0.5 + 3.5 * i, () => this.say(text, mood)));
    this.heldSay.length = 0;
  }

  /**
   * Gang gewechselt (Player.shift): ein kurzer Ton; R sagt NOMI an (höchstens alle 20 s, sonst nur der Ton), und auf
   * der Autobahn freut sich der Chat (höchstens alle 30 s).
   */
  onGear(gear) {
    this.audio.gear(gear);
    if (gear !== 'R') return;
    if (this.t > (this.reverseSaid ?? -99) + 20) {
      this.reverseSaid = this.t;
      this.later(0.3, () => this.say(BOARD.reverse, 'talk', { priority: false }));
    }
    if (!this.offAutobahn && this.t > (this.reverseChat ?? -99) + 30) {
      this.reverseChat = this.t;
      this.burst(CHAT.rueckwaerts, 2, 3);
    }
  }

  /** Ist der Radarwarner aus dem Shop an Bord? Nur dann wird vor einem Blitzer gewarnt (siehe „Blitzer“ in update). */
  get hasRadar() {
    return !!this.up?.radar;
  }

  /** Warnt der Radarwarner gerade? Von seiner Ansage bis zum Blitzer – und nie, wenn die Fahrt vorbei ist. */
  get radarAlarm() {
    const b = this.blitzer;
    return this.running && !!b && b.announced && !b.checked;
  }

  /** Einnahme verbuchen. label: Zeile der Abrechnung (siehe INCOME) · silent: ohne Einblendung am Guthaben */
  earn(amount, label, { silent = false } = {}) {
    if (amount <= 0) return 0;
    this.money += amount;
    this.breakdown[label] = (this.breakdown[label] || 0) + amount;
    this.tally.income += amount;
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
    // Krümmung und Steigung unter dem Wagen (Kurven-Paket, sonst 0); den Rückwärtsgang gibt es nur auf die eigenen
    // Eingaben des Spielers (ctl.reverse aus main.js) und nie, während die Welt den Wagen am Brunnen anhält
    p.update(dt, ctl, { wet: W.level, kappa: ctl.kappa || 0, grade: ctl.grade || 0, reverse: ctl.reverse === true && !this.halt && !this.tv });
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
      } else if (e.type === 'gear') this.onGear(e.gear);
      else if (e.type === 'reverseEnd') this.say(BOARD.reverseEnd, 'think', { priority: false });
    }
    // Uhr und Strecken zählen Reisezeit und Reisemeter (travelStep): rückwärts und auf schon gefahrener Straße nichts
    const go = this.travelStep(dt);
    this.route.add(this.world.trip().section, go.m);
    const dm = go.m;
    st.distance = this.odometer;
    st.maxSpeedKmh = Math.max(st.maxSpeedKmh, p.kmh);
    // neue Höchstgeschwindigkeit dieser Fahrt: Der Chat schaut auf den Tacho
    const mark = this.eco.speedMark(p.kmh);
    if (mark) {
      this.chat(fillTemplate(pick(CHAT.speedMark), { kmh: mark }));
      this.thrill('topSpeed', `${mark} km/h`);
    }
    st.cleanDistance += dm;
    if (W.level > 0.3) st.rainDistance += dm;
    // die Uhr ist die Reisezeit
    this.clock += go.secs / 60;
    this.megafonCd = Math.max(0, this.megafonCd - dt);

    // --- Eingaben ------------------------------------------------------------
    if (ctl.device) this.device = ctl.device;
    if (ctl.horn) this.honk();
    if (ctl.wiper) this.manualWiper();
    if (ctl.megafon) this.useMegafon();
    if (ctl.ladestopp) this.planStop();
    if (ctl.brunnen) this.wayEpisode();
    // BrunnenTV unterwegs: steht der Wagen neben einem Brunnen auf dem Weg, sagt es der Rand oben (Taste B; auf dem
    // Handy steht dazu der Knopf „BrunnenTV hier“ bei den kleinen Knöpfen, main.js)
    // (ein Hinweis steht nur kurz da: wer länger steht, bekommt ihn alle WAY.remind Sekunden wieder)
    const offer = !!this.wayOffer();
    if (offer && (!this.wayHint || this.t - this.wayNoteT >= WAY.remind)) {
      this.wayNoteT = this.t;
      this.ui.toast(this.touchUI ? '⛲ BrunnenTV hier: Knopf unten' : '⛲ BrunnenTV hier: Taste B', 'info', 'brunnenHier');
    } else if (!offer && this.wayHint) this.ui.dropKey('brunnenHier');
    this.wayHint = offer;

    // --- Verkehr ---------------------------------------------------------------
    const tev = this.traffic.update(dt, this.t, p, { difficulty: clamp(p.s / 16000, 0, 1), leftOpen: this.left.open, rain: W.level, dim: W.sky || 0 });
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
    if (this.charging) this.tickCharge(dt);
    if (this.sugarDue && !this.offAutobahn) {
      this.sugarDue = false;
      p.sugar = 6;
      this.audio.coin();
      this.ui.toast('🍌 Bananensaft! Zuckerschub', 'good');
    }
    if (this.tv) this.tickBrunnenTV();
    else if (this.navi.stopping) this.tickHalt(dt);
    this.updateNavi(dt);
    this.exitCall();
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

    // Akku: NOMI nennt den nächsten Ladepark (journeyBattery), der Mittelbildschirm zeigt die Akku-Karte (lowBattery);
    // leer hält der Tempomat nichts mehr (Player.longStep): Der Wagen rollt aus, im Stand ist die Fahrt zu Ende
    this.journeyBattery();
    this.lowBattery();
    if (p.empty && p.speed < 1.5) this.end('akku');
  }

  /**
   * Akku auf der Reise (REISE.md A5): Geladen wird in den Ladeparks an den Ausfahrten und an der Ladesäule jedes Orts auf
   * dem Weg. NOMI warnt bei REISE_AKKU.warn (25 % und 10 %) und nennt den nächsten Ladeplatz in Reichweite mit
   * Entfernung (trip.nextRest: auf dem Weg, sonst der nächste Park über Straßen, ein Abstecher). Schon früher, unter
   * REISE_AKKU.early, warnt sie, sobald er der letzte in Reichweite ist (reachable): Der übernächste und das Ziel liegen
   * weiter weg, wer an ihm vorbeifährt, kommt nicht mehr an. Ist ein Stopp geplant, sagt sie nur, wie weit es bis dorthin
   * ist. batteryWarned: 1 früh, 2 bei 25 %, 3 bei 10 %; nach dem Laden wieder 0. Einmal je Sekunde misst sie dazu den
   * Verbrauch je Meter Straße (akku, perM).
   */
  journeyBattery() {
    const p = this.player;
    const A = REISE_AKKU;
    if (this.charging || this.t < this.akku.next) return;
    const a = this.akku;
    const trip = this.world.trip();
    a.next = this.t + 1;
    // gemessen wird, wo der Wagen fährt: auf der offenen Strecke (Zeitraffer) oder auf echter Straße (1:1); ein Sprung auf
    // dem Band zählt nicht
    const ds = p.s - a.s;
    if (ds < 120) {
      const k = trip.scale > 1 ? a.open : a.real;
      k.m += Math.max(0, ds);
      k.pct += Math.max(0, a.b - p.battery);
    }
    a.s = p.s;
    a.b = p.battery;
    // die Akku-Karte nennt denselben Ladepark wie NOMI: den nächsten in Reichweite, sonst den Abstecher dorthin
    const fits = (q) => this.reachable(q);
    if (p.battery <= AKKU_CARD.at[0] + 1) {
      const [q] = trip.restsAhead(1, fits);
      a.park = q ? { name: q.name, at: trip.km + q.km, planned: q.planned } : null;
    }
    if (p.battery > A.early + 5) this.batteryWarned = 0;
    const lvl = p.battery < A.warn[1] ? 3 : p.battery < A.warn[0] ? 2 : 0;
    if (lvl && lvl <= this.batteryWarned) return;
    if (!lvl && (this.batteryWarned || p.battery > A.early)) return;
    const [r, r2] = trip.restsAhead(2, fits);
    // früh nur, wenn hinter dem nächsten Park weder der übernächste in Reichweite liegt noch das Ziel und von dort ein Park
    const beyond = () => (r2 && fits(r2)) || fits(trip.pastTarget() ?? NOWHERE);
    if (!lvl && (!r || r.planned || (fits(r) && beyond()))) return;
    this.batteryWarned = lvl || 1;
    const vars = { pct: Math.round(p.battery), park: r ? r.name : '', km: r ? kmWords(r.km) : '' };
    const text = !r ? A.none : r.planned ? A.planned : lvl === 3 ? A.veryLow : lvl || !fits(r) ? A.low : A.last;
    this.say(fillTemplate(text, vars), 'worried');
    if (r && !r.planned) this.ui.toast(this.touchUI ? '🔌 Ladestopp einplanen: Knopf unten' : '🔌 Ladestopp einplanen: Taste L', 'info', 'ladestopp');
    this.chat(pick(['Akku! 🔋', r && r.post >= 0 ? 'Ab an die Ladesäule!' : 'Ab in den Ladepark!', 'Popcorn-Pause? 🍿', 'Lade-Pause!']));
  }

  /**
   * Akku-Karte (AKKU_CARD): merkt sich, wann der Akku unter eine Stufe fiel. Leer sagt es auch das HUD – in jeder
   * Ansicht, nicht nur im Cockpit.
   */
  lowBattery() {
    const p = this.player;
    const c = this.lowBat;
    const lvl = akkuLevel(p.battery);
    if (lvl > c.lvl) {
      c.lvl = lvl;
      c.t = this.t;
      if (lvl === 3) this.ui.toast('🔋 Akku leer – der Wagen rollt aus', 'bad', 'akku');
    } else if (p.battery > AKKU_CARD.at[0] + 2) c.lvl = 0;
  }

  /**
   * Die Akku-Karte für den Mittelbildschirm (null: keine): Stufe (akkuLevel), Prozent, Deckkraft beim Ein- und
   * Ausblenden und der Ladepark, den NOMI nennt (Name, Reisekilometer bis dorthin, eingeplant?).
   */
  lowBatteryCard() {
    const c = this.lowBat;
    const age = this.t - c.t;
    if (!c.lvl || (c.lvl < 3 && age > AKKU_CARD.show)) return null;
    const F = AKKU_CARD.fade;
    const alpha = Math.min(1, age / F, c.lvl < 3 ? (AKKU_CARD.show - age) / F : 1);
    const pk = c.lvl < 3 ? this.akku.park : null;
    return { lvl: c.lvl, pct: this.player.battery, alpha, park: pk ? pk.name : '', km: pk ? Math.max(0, pk.at - this.world.trip().km) : 0, planned: !!(pk && pk.planned) };
  }

  /**
   * Erreicht der Wagen das Stück Weg r (m Meter Straße, davon realM auf echter Straße; ein Ladepark aus trip.restsAhead
   * oder trip.reach() bis zum Ziel) mit dem Akku, den er hat, und der Reserve? Der Akku leert sich je Sekunde, im
   * Zeitraffer der offenen Strecke trägt ein Prozent rund zwanzigmal so viele Reisekilometer wie auf echter Straße – je
   * Meter Straße dagegen kostet die Fahrt fast überall gleich viel (perM).
   */
  reachable(r) {
    const need = (r.m - r.realM) * this.perM('open') + r.realM * this.perM('real');
    return need <= this.player.battery * REISE_AKKU.reserve;
  }

  /**
   * Akku in Prozent je Meter Straße seit dem letzten Laden, k = 'open' (offene Strecke) oder 'real' (echte Straße):
   * gemessen, sobald REISE_AKKU.measure Meter davon gefahren sind, bis dahin vorsichtig geschätzt (REISE_AKKU.perM, für
   * einen größeren Akku entsprechend weniger).
   */
  perM(k) {
    const a = this.akku[k];
    return a.m >= REISE_AKKU.measure ? a.pct / a.m : (REISE_AKKU.perM[k] * 75) / this.player.capacity;
  }

  /** Soll der Touch-Knopf „Ladestopp einplanen“ zu sehen sein? (kein Stopp geplant, Akku halb leer oder Warnung) */
  stopOffer() {
    if (!this.running || this.charging) return false;
    const trip = this.world.trip();
    // im Park selbst nicht: dort hält der Wagen ohnehin an der Säule
    if (trip.section && trip.section.kind === 'park') return false;
    return trip.stop < 0 && trip.post < 0 && (this.player.battery <= 50 || this.batteryWarned > 0);
  }

  /**
   * Ladestopp einplanen (Reise; Taste L, Touch-Knopf „Ladestopp einplanen“): Der nächste Ladeplatz auf dem Weg wird
   * Zwischenziel – ein Ladepark (das Navi führt hinein und danach weiter zum Ziel) oder die Ladesäule eines Orts, durch
   * den der Weg führt (der Wagen hält dort). Ein zweiter Druck streicht den Stopp wieder.
   */
  planStop() {
    if (!this.running || this.charging) return;
    const A = REISE_AKKU;
    const trip = this.world.trip();
    if (trip.stop >= 0 || trip.post >= 0) {
      trip.setStop(-1);
      trip.setPost(-1);
      this.say(A.cancel, 'think', { priority: false });
      return;
    }
    const r = trip.nextRest((q) => this.reachable(q));
    if (!r) {
      this.say(A.noPark, 'think', { priority: false });
      return;
    }
    if (r.post >= 0) trip.setPost(r.post);
    else trip.setStop(r.park);
    this.ui.dropKey('ladestopp');
    this.stats.stopsPlanned++;
    this.say(fillTemplate(A.set, { park: r.name, km: kmWords(r.km) }), 'happy');
  }

  /**
   * Der Wagen steht im Ladepark oder an der Ladesäule eines Orts in der Spur hinter der freien Heldenbucht (Ereignis
   * 'charge' der Welt; e.park bzw. e.post): der Ladestopp
   * beginnt, eine kleine Szene nach dem Fahrplan von xxl/charge.js stopPlan (Sekunden ab jetzt, Spielzeit): einparken,
   * einstecken, im Zeitraffer laden, Popcorn und Bananensaft, ausstecken, ausparken. Das Spiel führt die Zeit, den Akku,
   * Chat, NOMI und Spenden; main.js zeigt dazu Wagen, Kabel, Kamera (onCharge) und lässt den Wagen am Ende in die Spur
   * rollen. Ohne Szene (Node-Tests) läuft derselbe Fahrplan, der Wagen wartet bis zum Ausparken an seinem Halt.
   */
  startCharge(e) {
    const p = this.player;
    const plan = stopPlan(e.sec, p.s, p.x);
    this.charging = { t0: this.t, from: p.battery, park: e.park, post: e.post ?? -1, name: e.name, sec: e.sec, plan, said: 0 };
    this.routeMark('laden', e.post >= 0 ? { post: e.post } : { park: e.park });
    this.onCharge(this.charging);
  }

  /** Sekunden seit dem Halt im Park (Fahrplan des Ladestopps). */
  chargeT() {
    return this.charging ? this.t - this.charging.t0 : 0;
  }

  tickCharge() {
    const c = this.charging;
    const p = this.player;
    const P = c.plan;
    const t = this.t - c.t0;
    // übersprungen (skipCharge): gleich so, wie der Stopp sonst endet
    if (c.skip) {
      if (!c.rolled) this.world.release();
      this.finishCharge();
      return;
    }
    // im Zeitraffer, solange der Stecker steckt
    const q = clamp((t - P.at(STOP.fill[0])) / (STOP.fill[1] - STOP.fill[0]), 0, 1);
    p.battery = Math.max(p.battery, c.from + (100 - c.from) * q * q * (3 - 2 * q));
    p.empty = false;
    // die schönen Momente je einmal: NOMI, Popcorn, Bananensaft (eine Spende kommt nach den Regeln der Ökonomie)
    const moments = [
      [STOP.nomi, () => {
        this.say(fillTemplate(REISE_AKKU.start, { park: c.name }), 'happy', { scene: true });
        this.audio.chime();
      }],
      [STOP.pop[0] + 0.6, () => {
        this.eco.cheer('funny');
        this.burst(CHAT.popcorn, 3, 2.2);
      }],
      [STOP.juice, () => {
        this.stats.bananas++;
        c.juice = true;
        this.thrill('banana', 'Bananensaft-Pause');
        this.burst(CHAT.saftpause, 2, 1.6);
      }],
    ];
    while (c.said < moments.length && t >= P.at(moments[c.said][0])) moments[c.said++][1]();
    // ausparken: der Halt ist vorbei (main.js lässt den Wagen aus der Bucht in die Spur rollen)
    if (t >= P.roll && !c.rolled) {
      c.rolled = true;
      this.world.release();
    }
    if (t >= P.end) this.finishCharge();
  }

  /**
   * Ladestopp überspringen (main.js: jede Taste, wie in der Startszene): Er endet im nächsten Bild so, wie er sonst
   * enden würde – Akku voll, Stecker im Halter, der Wagen in der Spur; was noch nicht gesagt war, bleibt ungesagt.
   */
  skipCharge() {
    if (this.charging) this.charging.skip = true;
  }

  finishCharge() {
    const c = this.charging;
    const p = this.player;
    this.charging = null;
    p.battery = 100;
    p.empty = false;
    if (!c.juice) this.stats.bananas++;
    this.stats.parkCharges++;
    this.akku = meterAkku();
    this.batteryWarned = 0;
    this.ui.toast('🔋 Akku voll', 'good');
    this.sayHeld();
    // der Zuckerschub des Bananensafts, sobald der Wagen wieder auf der Autobahn ist (im Park und auf dem Zubringer
    // gilt ohnehin ein Tempolimit)
    this.sugarDue = true;
  }

  // --- Linke Spur ------------------------------------------------------------
  updateLeftLane(dt) {
    const L = this.left;
    const p = this.player;
    if (!L.open) {
      if (!this.offAutobahn) L.next -= dt;
      if (L.next <= 0) this.openLeftLane();
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
  /**
   * NOMI nennt die nächste Ausfahrt am ersten Vorwegweiser, wie das Schild am Rand: „Nächste Ausfahrt: Hanau-Nord in
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
    // NOMI und der Hinweis aufs neue Ziel kommen erst, wenn es kurz stehen bleibt – im Chaos und im Duell kämen sie
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
   * Ein neues Ziel steht (das letzte Gebot eines Rennens, ein einzelnes ruhiges Gebot oder der Zuschlag): NOMI sagt
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
   * Gewinner mit Betrag, James und der Chat feiern ihn; stand das Ziel noch nicht angesagt, sagt NOMI es jetzt.
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
      this.ui.damage(p.hits, p.maxHits);
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
      // anders gefahren als angesagt: Die Fahrt plant von dort neu, und NOMI sagt es (am geplanten Ladestopp vorbei:
      // der Stopp ist weg, die nächste Warnung bietet den nächsten Park an)
      if (e.wrong) this.say(e.stop ? REISE_AKKU.missed : 'Route wird neu berechnet.', 'think', { priority: false });
      if (e.wrong && e.stop) this.batteryWarned = 0;
      // ein Umweg mit Ziel: Der Chat stöhnt, und die Zeit des Umwegs zählt (satisfaction.js)
      if (e.wrong && this.navi.target) this.zufrieden.detour();
      if (e.wrong && e.planned === 'exit') {
        this.missedTarget();
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
   * gleich kommen) und was die Werkstatt für ihre Rempler und neuen Kratzspuren bekommt, steht kurz nebeneinander am
   * oberen Rand (payBill); ab hier zählt die nächste Runde.
   */
  settleRound(n, gifts) {
    const T = this.tally;
    const sum = gifts.reduce((a, v) => a + v, 0);
    const marks = scratchMarks(this.player.damage);
    const bill = { n, income: T.income + sum, hits: T.hits, marks: marks - T.marks };
    bill.amount = REPARATUR.bump * bill.hits + REPARATUR.mark * bill.marks;
    // (die Ortsspenden dieser Ankunft buchen sich gleich noch, gehören aber zu dieser Runde)
    this.tally = { income: -sum, hits: 0, marks };
    this.later(3.2, () => this.payBill(bill));
  }

  /**
   * Die Werkstatt-Rechnung einer Runde: bezahlt aus der Stream-Kasse (die Abrechnung am Ende führt sie unter
   * „Reparaturen“), was die Kasse nicht hergibt, erlässt die Werkstatt. Sie nimmt nur ganze Euro – die Rechnung ist
   * ganz (REPARATUR), also gehen Bezahltes und Erlassenes in der Zeile genau auf, und die Cent bleiben in der Kasse.
   * Am Rand die Zeile der Runde, am Guthaben der Abzug, James bucht, der Chat nimmt es gelassen – und wer heil
   * angekommen ist, wird gefeiert.
   */
  payBill(b) {
    const paid = Math.min(Math.floor(this.money + 1e-6), b.amount);
    if (paid > 0) {
      this.money -= paid;
      this.breakdown.Reparaturen = (this.breakdown.Reparaturen || 0) - paid;
      this.ui.money(-paid, 'Reparatur');
    }
    // Teile mit Klasse bleiben beisammen, umbrochen wird nur an den Trennern ohne Klasse (auf dem Handy hochkant) – und
    // nie vor einem „·“ (geschütztes Leerzeichen davor)
    const dot = '\u00a0· ';
    const parts = [[`🧾 Runde ${b.n}`, 'runde'], [dot], [`Einnahmen +${fmtEuro(b.income)}`, 'plus'], [dot]];
    if (!b.amount) parts.push(['keine Schäden ✨', 'plus']);
    else if (paid <= 0) parts.push([`Reparatur ${fmtEuro(b.amount)} erlassen`, 'minus']);
    else {
      parts.push([`Reparatur −${fmtEuro(paid)}`, 'minus']);
      if (paid < b.amount) parts.push([' '], [`(Rest ${fmtEuro(b.amount - paid)} erlassen)`, 'rest']);
    }
    this.ui.toast(parts.map((x) => x[0]).join(''), b.amount ? 'info' : 'good', 'rechnung', parts);
    if (!b.amount) {
      if (chance(0.6)) this.later(1, () => this.chat(this.chatLine(CHAT.heil)));
      return;
    }
    const what = [b.hits ? `${b.hits} Rempler` : '', b.marks ? `${b.marks} Kratzer` : ''].filter(Boolean).join(' und ');
    this.bot('james', `Werkstatt-Rechnung für Runde ${b.n}: ${fmtEuro(b.amount)} für ${what}` + (paid >= b.amount ? ' – bezahlt aus der Stream-Kasse.' : paid > 0 ? `. Bezahlt sind ${fmtEuro(paid)}, den Rest erlässt die Werkstatt.` : '. Die Werkstatt erlässt sie diesmal.'));
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
   * N“, Mini Adam durchs Megafon zum Brunnen, der Chat jubelt, NOMI sagt etwas, dann darf der Wagen weiter. main.js
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
    this.tv = { n, place: t.place, name: t.name, goal: t.goal || t.name, t0: this.t, said: 0, skip: false, called: false, debate: entry.d || null, way };
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
   * Bauchbinde, Gruß, „Schöner Brunnen!“, Chat und NOMI, Album und Abspann –, aber die Runde läuft weiter: Das Ziel
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
   * Solange die Folge läuft, wartet die nächste Bieterrunde; ihre Momente kommen je einmal zu ihrer Zeit. Übersprungen
   * (skipBrunnenTV) endet sie im nächsten Bild so, wie sie sonst endet; was noch nicht gesagt war, bleibt ungesagt –
   * bis auf den Ruf: „Schöner Brunnen!“ kommt in jeder Folge (der Eigentümer), übersprungen eben beim Losfahren.
   */
  tickBrunnenTV() {
    const tv = this.tv;
    this.T.bid = Math.max(this.T.bid, TV.pause);
    if (tv.skip) {
      if (!tv.called) this.brunnenCall();
      this.endBrunnenTV();
      return;
    }
    const t = this.t - tv.t0;
    const moments = [
      [TV.card, () => {
        this.ui.brunnenTV(tv.n, tv.name);
        this.audio.brunnenJingle();
      }],
      [TV.line, () => this.brunnenMegafon(tv)],
      [TV.chat, () => {
        this.chat('BRUNNENTV! 💦');
        this.burst(CHAT.brunnenTV, 4, 3);
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
   * wie ein Megafon-Wunsch, nur mit Mini Adam statt eines Käufers (die Folge steht in der Bauchbinde darüber). Nur ein
   * Gruß, der vor seinem Ruf (TV.call) zu Ende ist: Mit langem Ortsnamen bleiben die kürzeren.
   */
  brunnenMegafon(tv) {
    const room = TV.call - TV.line - 0.3;
    const fits = BRUNNEN_MEGAFON.map((l) => fillTemplate(l, { ort: tv.name })).filter((l) => estimateSpeech(l, VOICES.adam.rate) <= room);
    const text = pick(fits);
    this.audio.megafon();
    // (mit Vorrang: Eine Durchsage, die noch läuft, endet hier – die Folge gehört Mini Adam)
    const dur = this.speech.say(text, 'adam', { priority: true });
    this.ui.megafon(text, dur + 1, '', 'Mini Adam durchs Megafon');
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
    const dur = this.speech.say(S.say, 'brunnen', { priority: true });
    this.ui.megafon(S.text, dur + 1.2, '', 'Mini Adam durchs Megafon');
    this.voiceUntil = Math.max(this.voiceUntil, this.t + dur + 0.6);
    this.onMood('megafon', Math.min(dur, TV.lift.down[0] - TV.call));
    this.later(0.6, () => {
      this.chat(S.chat[0]);
      this.burst(S.chat.slice(1), 3, 2.5);
    });
  }

  /** Folge überspringen (main.js: jede Taste ab TV.skip, wie beim Ladestopp): Sie endet im nächsten Bild. */
  skipBrunnenTV() {
    if (this.tv) this.tv.skip = true;
  }

  /** Die Folge ist vorbei (oder übersprungen): Bauchbinde weg, der Wagen darf weiter – durch den Ort zur nächsten Straße. */
  endBrunnenTV() {
    const way = this.tv && this.tv.way;
    this.tv = null;
    this.ui.brunnenTV(0);
    this.world.release();
    // (unterwegs läuft die Runde weiter: kein Bieterfenster)
    if (!way) this.openWindow();
    this.sayHeld();
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

    // Sprachdurchsage (wartet, bis das Sprachstudio ausgeredet hat und keine Szene läuft: Folge, Ladestopp)
    if (T.durchsage <= 0 && this.t >= this.studioUntil && !this.tv && !this.charging) {
      T.durchsage = rand(48, 85);
      const pool = this.weather.level > 0.3 && chance(0.5) ? DURCHSAGEN_REGEN : DURCHSAGEN;
      const d = pick(pool.filter((x) => !x.when || x.when.split(' ').every((k) => FACTS[k](this))));
      const text = fillTemplate(d.text);
      const name = viewerName();
      this.donate(name, this.eco.durchsagePrice(), 'Sprachdurchsage', { label: 'Sprachdurchsagen' });
      this.voiceUntil = Math.max(this.voiceUntil, this.t + 3);
      this.later(1.2, () => {
        const dur = this.speech.say(text, d.voice);
        this.said = { t: this.t, voice: d.voice };
        this.ui.durchsage(VOICES[d.voice].label, text, dur + 1, name);
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
          this.audio.megafon();
          // Mini Adam ruft den Wunsch durchs Megafon – mit seiner Stimme
          const dur = this.speech.say(text, 'adam');
          this.ui.megafon(text, dur + 1, name);
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
      // Einen Blitzer kündigt niemand an: Die Warnung vorher ist ein Artikel des Shops (hasRadar) – Blitz, Bußgeld
      // und Foto gibt es mit ihm und ohne ihn.
      if (this.hasRadar && !b.announced && p.s > b.limitS - RADAR.ahead) {
        b.announced = true;
        this.audio.radar();
        this.later(RADAR.lead, () => this.say(BOARD.blitzer, 'wink'));
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
      if (p.s > b.endS + 50) {
        this.blitzer = null;
        this.S.blitzer = p.s + rand(2600, 4200);
      }
    }

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

  // --- Tasten ---------------------------------------------------------------------------
  honk() {
    this.audio.horn();
    this.lastHorn = this.t;
    this.onMood('startled', 0.45);
    if (chance(0.12)) this.chat(pick(['Bimmel hurra! 📯', 'HUP HUP', 'Hupkonzert!']));
  }

  /** Taste H: Das Megafon gehört zur Ausstattung (kein Shop-Artikel mehr), es lädt nur nach jeder Durchsage nach. */
  useMegafon() {
    if (this.megafonCd > 0) {
      this.ui.toast(`📢 Megafon lädt noch (${Math.ceil(this.megafonCd)} s)`, 'info');
      return;
    }
    this.megafonCd = 15;
    this.audio.megafon();
    const n = this.traffic.megafon(this.player);
    this.speech.say('Achtung, Achtung! Bitte machen Sie die Spur frei!', 'adam');
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
    this.tally.hits++;
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
    const km = p.s / 1000; // der Beruf des Tages richtet sich nach den Metern der Straße (keine Zahl auf dem Schirm)
    this.over = {
      reason,
      distance: this.odometer,
      // die Route des Streams (genommene Abschnitte, Folgen, Ladestopps; die Summe ist der Kilometerzähler)
      route: this.route.finish(this.odometer),
      air: this.airtime,
      // die Einschaltquote des Streams (Kurve im Abspann)
      quote: { dt: this.quote.dt, v: [...this.quote.v, Math.round(this.viewers)], tv: this.quote.tv.slice(), t: this.t },
      money: Math.max(0, Math.round(this.money * 100) / 100),
      breakdown: { ...this.breakdown },
      jobs: this.jobs.map((j) => ({ text: j.text, done: j.done, pledge: j.pledge, pledger: j.pledger })),
      fans: this.supporters(),
      stats: { ...this.stats },
      peakViewers: Math.round(this.peakViewers),
      beruf: berufFor(km),
      clock: fmtClock(this.clock),
    };
    this.speech.stopAll();
    if (reason === 'akku') this.say('Akku leer. Die Stream-Technik verabschiedet sich.', 'sleep');
    else if (reason === 'werkstatt') this.say('Bitte einen Werkstatttermin vereinbaren.', 'dizzy');
    else if (reason === 'stream') this.say('Keine Gebote mehr. Der Stream ist zu Ende. Gute Nacht!', 'sleep');
    if (reason !== 'quit') this.onMood(reason === 'werkstatt' ? 'ouch' : 'sleepy', 1);
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

  /**
   * Die Uhr ist die Reisezeit, der Zwilling des Kilometerzählers: Je Schritt gewinnt sie dessen Sekunden
   * mal so viele Reisemeter, wie die Fahrt dort je Meter Straße zählt (auf echter Straße und im Stand 1). Mit 130 km/h
   * schafft der Wagen so überall 130 Reisekilometer je Stunde der Uhr, und wer im Tempo des Navis fährt, sieht die
   * Ankunftszeit stillstehen (Uhr + Reisezeit des Rests, trip.reach().clock). Die Fahrt rückt erst nach game.update
   * vor (src/main.js): gezählt wird darum der Schritt davor, mit dessen Zeit. Liefert { secs: Sekunden der Uhr,
   * m: Reisemeter } dieses Schritts.
   */
  travelStep(dt) {
    const trip = this.world.trip();
    const was = this.travel && this.travel.trip === trip ? this.travel : null;
    const ds = was ? trip.s - was.s : 0;
    const m = was ? (trip.km - was.km) * 1000 : 0;
    // rückwärts und auf schon gefahrener Straße (keine neuen Reisemeter) läuft die Uhr wie im Stand
    const secs = !was ? 0 : ds > 1e-6 && m > 0 ? (was.dt * m) / ds : was.dt;
    this.travel = { trip, s: trip.s, km: trip.km, dt };
    return { secs, m };
  }

  /** Die gefahrene Strecke auf jedem Schirm (Meter): der Kilometerzähler der Fahrt (Reisemeter). */
  get odometer() {
    return this.world.trip().km * 1000;
  }

  /** Sendezeit in Sekunden: die Reisezeit seit 18 Uhr (start). */
  get airtime() {
    return (this.clock - 18 * 60) * 60;
  }

  /** Daten für den Mittelbildschirm. */
  screenState() {
    const p = this.player;
    const W = this.weather;
    const limit = this.blitzer && p.s > this.blitzer.limitS && p.s < this.blitzer.endS ? 120 : null;
    return {
      dark: W.level > 0.45,
      battery: p.battery,
      gear: p.gear,
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
      lowBattery: this.lowBatteryCard(),
    };
  }
}

