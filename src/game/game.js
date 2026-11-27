// Eine Fahrt: Regie für alle Ereignisse (linke Spur, Navi-Gebote, Regen, Blitzer, Polizei Gifhorn,
// Sprachdurchsagen, Rahmen, Funkloch, Zuschauer, Spenden, Jobs) und die Abrechnung am Ende.
// Geld kommt nur vom Publikum: Die Stream-Kasse und die heimliche Chat-Stimmung rechnet economy.js.
// Hier stehen Aufbau, Schritt, Hilfen und Ende; die Themen Spur und Wetter, Ziel, Ereignisse und Stream stehen in parts/
// und hängen ihre Methoden an Game an (attachParts, unten). Der Akku ist eine eigene Klasse (akku.js, this.akku).
import {
  CHAT, BOTS, BOARD, JOB_TEMPLATES, REPARATUR, CREW, INCOME, viewerName, fillTemplate, alterReaction, berufFor, fmtBetrag, PARTYPEOPLE,
  frontalCost, damageCost, BUSSGELD,
} from '../data.js';
import { clamp, rand, chance, pick, shuffle, fmtCent, fmtEuro, fmtClock } from '../util.js';
import { Player } from './player.js';
import { damageLine } from './damage.js';
import { WorldNavi } from './navi.js';
import { Economy, BONTANA } from './economy.js';
import { Satisfaction } from './satisfaction.js';
import { RouteLog } from './routelog.js';
import { WaveRule, WAVE, chatGap } from './wave.js';
import { StreamGags } from './gags.js';
import { Stammgaeste } from './stamm.js';
import { startMemory, rekordMemory, GEDAECHTNIS } from './gedaechtnis.js';
import { Akku } from './akku.js';
import { Studio } from './studio.js';
import { Durchsagen, DS } from './durchsagen.js';
import { SpurWetterPart } from './parts/spur-wetter.js';
import { ZielPart, scratchMarks, WAY } from './parts/ziel.js';
import { EreignissePart, ELEFANT, FACTS } from './parts/ereignisse.js';
import { StreamPart, LAGE_SHARE, QUOTE_DT, untag } from './parts/stream.js';
// (Konstanten der Teile, wie bisher auch über game.js erreichbar)
export { AKKU_CARD, akkuLevel } from './akku.js';
export { fountainIn, EXIT_CALL, exitLine, TOWN_HOLD, AUKTION, WAY } from './parts/ziel.js';
export { ELEFANT, FACTS, RADAR, ZONE_LEAD } from './parts/ereignisse.js';
export { QUOTE_DT, TROEDEL, untag } from './parts/stream.js';

/**
 * Gelungene Manöver spüren (der Eigentümer, 27.11.2026: „ein Feedback für ein gutes Manöver fehlt“ – ohne Zischen):
 * Jedes haarscharfe Überholen gibt einen kurzen Impuls (Gamepad, Handy: rumble [Stärke, ms]), einen leisen hellen
 * Ton und eine Zeile im Chat, das Sprachstudio lobt es (mit Abstand). Kommen serie Manöver innerhalb von window
 * Sekunden, ist es eine Serie: Der Chat rastet aus, der Rand oben sagt es, und das Studio lobt sie immer. Eine neue
 * Höchstgeschwindigkeit ab praiseKmh lobt es auch.
 */
export const MANOEUVRE = { window: 25, serie: 3, rumble: [0.45, 110], second: 0.35, praiseKmh: 220 };
/** So viele Sekunden nach dem Start erinnert das Sprachstudio an frühere Streams (nach Gruß und ersten Geboten). */
const MEMORY_AT = 40;
const ZAHLWORT = ['null', 'eins', 'zwei', 'Drei', 'Vier', 'Fünf', 'Sechs', 'Sieben', 'Acht', 'Neun', 'Zehn', 'Elf', 'Zwölf'];

export class Game {
  /**
   * @param {object} ctx traffic, scenery, windshield, cockpit, audio, speech, ui, fx, pickups;
   *   world: { trip(): die Fahrt über die echte Karte (trip.js), stopping(): bremst der Wagen gerade zum Halt am Brunnen
   *   des Ziels?, release(): der Wagen am Brunnen darf weiterfahren, square(sec) und town(sec): Brunnenplatz und Ort
   *   einer Ortsdurchfahrt für die BrunnenTV-Szene, gate(sec, k): die Bezahlschranke eines Orts stellen (gags.js; fehlt
   *   sie, gibt es keine) }. Geboten wird auf echte Orte (WorldNavi): Jedes Gebot setzt das
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
    this.tally = { income: 0, hits: 0, marks: 0, front: 0, extra: 0, laden: 0, kwh: 0 };
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
    // wann Mini Adam winkt (wave.js): Intro, Fußgänger am Gehweg, „Wink mal!“ im Chat, nach einem Rempler
    this.waves = new WaveRule();
    // die Running Gags aus dem Stream des Eigentümers (gags.js): mit eigenem Zufall, damit der Stream sonst gleich verläuft
    this.gags = new StreamGags(this);
    // die Stammzuschauer mit Gedächtnis (stamm.js): eigener Zufall, ihr Gedächtnis steht im Spielstand (save.stamm)
    this.stamm = new Stammgaeste(this);
    // die Sprachdurchsagen der Zuschauer: Stapel, Momente und eigener Zufall je Stream (durchsagen.js)
    this.ds = new Durchsagen(this);
    // Akku und Ladestopps (akku.js): eigener Zustand, liest vom Spiel nur AKKU_HOST
    this.akku = new Akku(this);
    // das Sprachstudio (studio.js): eigener Zustand, liest vom Spiel nur STUDIO_HOST
    this.studio = new Studio(this);
    // BrunnenTV am Navi-Ziel: Hier hängt sich die Szene ein (siehe startBrunnenTV)
    this.onBrunnenTV = () => {};
    // Ladestopp im Park: Hier hängt sich die Szene ein (siehe akku.js start)
    this.onCharge = () => {};
    // Reise: eine Marke der Route des Streams (Folge, Ladestopp); main.js trägt ihre Lage auf der Karte nach
    this.onRouteMark = () => {};
    // ein kurzer Impuls am Gamepad oder Handy (main.js: input.rumble) – Stärke 0 … 1, Dauer in ms
    this.onFeel = () => {};
  }

  /** Der laufende Ladestopp (akku.js start) oder null: Szenen, Ereignisse und Gags ruhen, solange er läuft. */
  get charging() {
    return this.akku.charging;
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
    // Reise: was die laufende Runde eingebracht und gekostet hat (Rempler, Kratzspuren bis dahin; settleRound); front:
    // die frontalen unter den Remplern, extra: was sie mehr kosten als ein gewöhnlicher (data.js frontalCost); laden und
    // kwh: der Ladestrom der Runde (payCharge)
    this.tally = { income: 0, hits: 0, marks: 0, front: 0, extra: 0, laden: 0, kwh: 0 };
    // alle abgebuchten Schäden des Streams (Abrechnung im Abspann: „Schäden (N Rempler · M Kratzer)“) und die
    // Rechnung, die gerade unterwegs ist (payBill kommt 3,2 s nach der Ankunft; endet der Stream vorher, bucht end)
    this.damageBill = { hits: 0, marks: 0, front: 0, amount: 0 };
    this.billDue = null;
    // der Ladestrom des Streams (Abrechnung im Abspann: „Ladestrom (N Ladestopps · X kWh à 0,52 €/kWh)“, payCharge);
    // preis: der Preis der Säulen, solange alle Stopps denselben hatten, sonst leer
    this.ladeBill = { n: 0, kwh: 0, amount: 0, preis: '' };
    this.viewersUpT = -1;
    this.over = null;
    this.running = true;
    this.queue = [];
    this.clock = 18 * 60;
    // Reise: Beginn des Streams (Datum im BrunnenTV-Album) und seine Route für den Abspann (routelog.js)
    this.streamT = Date.now();
    this.gags.reset(this.streamT);
    // (Prüfstände setzen stammSeed, damit jeder Lauf gleich ist; im Spiel würfeln die Stammgäste je Stream neu)
    this.stamm.reset(this.stammSeed ?? this.streamT ^ 0x5a17);
    // das Gedächtnis des Sprachstudios (gedaechtnis.js): nach der Begrüßung erinnert es an frühere Streams, und fällt
    // der Streckenrekord aller Streams, sagt es das einmal
    const memo = startMemory(save);
    this.later(MEMORY_AT, () => this.studio.remember(memo));
    this.rekordSaid = !((save.best?.reise || 0) >= GEDAECHTNIS.rekordKm * 1000);
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
    // die haarscharfen Manöver der letzten MANOEUVRE.window Sekunden (Spielzeit), für die Serie
    this.manoeuvres = [];
    // wann OMI zuletzt „zu schnell für die Kurve“ und den Rückwärtsgang gesagt hat und der Chat ihn kommentiert hat
    // (Spielzeit: die beginnt in jedem Stream bei 0)
    this.understeerSaid = this.reverseSaid = this.reverseChat = -99;
    this.megafonCd = 0;
    this.chatT = 1.5;
    this.chatSeen = [];
    this.waves.reset();
    this.waveChatN = 0;
    this.waveChatT = chatGap(0);
    // wann zuletzt eine Gutschrift aufgeblitzt ist, die Leitplanke gekratzt hat, OMI das Navi angesagt hat
    this.popT = -9;
    this.scrapeT = -9;
    this.naviSaidT = -99;
    // die nächste Ausfahrt (exitCall): die Gabelung, die OMI zuletzt genannt hat, und wann
    this.exitSaid = null;
    this.exitSaidT = -99;
    // Verkehr aus Sicht des Chats: hängt Mini Adam hinter jemandem fest? (siehe watchTraffic)
    this.trafficT = 0;
    this.stuck = false;
    this.stuckChatT = 0;
    // Stimmen: bis wann OMI oder eine Durchsage zu hören ist (Spielzeit; das Sprachstudio: studio.until)
    this.voiceUntil = 0;
    this.sammel = null;
    this.duel = null;
    // für den Abspann: die größte Spende, wer wie viel gespendet und geboten hat (Summe und Anzahl je Name), wer wie
    // viele Abos verschenkt hat, wer neu VIP geworden ist und wer mit wie vielen Leuten geraidet hat
    this.fans = { gifts: {}, vips: [], donors: {}, bids: {}, raids: {} };
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
    // Akku: Ladestopp, Verbrauch, Warnungen, Akku-Karte, Hinweis an der Ladesäule, Zuckerschub (akku.js reset)
    this.akku.reset();
    // was OMI in einer Szene sagen wollte und erst danach sagt ([Satz, Stimmung], say)
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
    // (die beiden Uhren des Sprachstudios laufen bei ihm, studio.js countdown; gewürfelt werden sie hier zwischen den
    // anderen, damit der Zufall des Streams derselbe bleibt)
    const { studio, greet, ...T } = {
      bid: 0, durchsage: rand(28, 40), rahmen: rand(70, 100), funkloch: rand(110, 170), frog: rand(160, 260),
      trunk: rand(120, 200), numbers: rand(80, 130), police: rand(200, 300), wiperChat: 0, sammel: rand(75, 110),
      studio: rand(26, 34), greet: rand(100, 170), cent5: rand(100, 160),
    };
    this.T = T;
    this.studio.reset(studio, greet);
    // „5 Cent, wenn du …“: welche Angebote in diesem Stream schon kamen (keins doppelt), wer zuletzt geboten hat, wie
    // lange die Straße schon geradeaus läuft (Meter) und wann zuletzt ein Ziel erreicht wurde (für Angebote zur Lage)
    this.cent5 = { used: new Set(), name: '', straightS: 0, arrivedT: -99, lage: chance(LAGE_SHARE) };
    this.S = { blitzer: rand(3000, 3800), elefant: rand(ELEFANT.first[0], ELEFANT.first[1]), landmark: rand(1400, 2000), koriander: rand(2200, 2800) };
    this.elefantT = 0;
    this.blitzer = null;
    // Blitzer im Ort und auf der Landstraße (roadCameras): schon passierte und schon angesagte, wo der Wagen zuletzt
    // war, vor welchem der Radarwarner gerade warnt
    this.cam = { seen: new Set(), warned: new Set(), prev: null, alarm: null };
    this.landmark = null;
    this.funkloch = 0;
    this.funklochT = -99; // wann das letzte Funkloch begann (FACTS.netz)
    this.said = { t: -99, voice: null, end: -99 }; // die letzte Sprachdurchsage (FACTS.durchsage), end: wann sie endet
    this.policeCar = null;
    this.shoulderWarned = false;
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
    // geboten, der Stream endet; said: das Ziel, das OMI zuletzt angesagt hat
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
    // Mini Adam sagt nach „Wir sind live.“ „Partypeople!“ (main.js streamStart): Der Chat grüßt zurück – nie vor seinem
    // Gruß (greetFirst: main.js meldet ihn mit greet; wer vorher dran wäre, wartet in helloHeld)
    this.helloSaid = !this.greetFirst;
    this.helloHeld = [];
    shuffle(PARTYPEOPLE.chat).slice(0, 4).forEach((line, i) => this.later(0.6 + i * 0.6 + rand(0, 0.3), () => this.helloChat(line)));
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
    // der Stapel der Sprachdurchsagen mit eigenem Zufall (gesät aus dem des Streams: in den Prüfständen wiederholbar)
    this.ds.reset(Math.floor(Math.random() * 4294967296));
  }

  /** Eine Antwort des Chats auf Mini Adams Gruß: gleich, wenn er gegrüßt hat, sonst gleich nach seinem Gruß (greet). */
  helloChat(line) {
    if (this.helloSaid) this.chat(line);
    else this.helloHeld.push(line);
  }

  /** main.js: Mini Adams „Partypeople!“ beginnt (nach „Wir sind live.“) – der Chat grüßt zurück. */
  greet() {
    this.helloSaid = true;
    this.helloHeld.forEach((line, i) => this.later(0.6 + 0.6 * i, () => this.chat(line)));
    this.helloHeld.length = 0;
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

  /**
   * Mini Adam winkt – nur aus einem Anlass der Regel (wave.js WAVE.why). o.look: Blickziel (zum Gehweg hin),
   * o.passage: die Ortsdurchfahrt (gehsteig). Ergebnis: Stärke des Grußes, 0 wenn er jetzt nicht winkt.
   */
  waveAt(why, o = null) {
    const k = this.waves.ask(why, this.t, o && o.passage);
    if (k > 0) this.onMood('wave', k, o);
    return k;
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

  /**
   * OMI spricht (mit Gong, Untertitel und Augen-Animation). navi: die Navi-Durchsage zu einem neuen Ziel (ziel.js
   * announceTarget) – eigener Gong, großer Untertitel, veraltet nie in der Warteschlange.
   */
  say(text, mood = 'talk', { priority = true, scene = false, navi = false } = {}) {
    // eine Szene (Ladestopp, BrunnenTV) hat genau einen Satz OMIs, ihren eigenen (scene): Zufälliges Geplauder
    // (priority false) entfällt dort, Wichtiges wartet bis zum Ende der Szene (sayHeld)
    if (!scene && (this.charging || this.tv)) {
      if (priority && !this.heldSay.some((h) => h[0] === text)) this.heldSay.push([text, mood, navi]);
      return;
    }
    if (navi) this.audio.naviGong();
    else this.audio.nomiChime();
    const nomi = this.cockpit.nomi;
    nomi.setMood(mood, 3.2);
    const go = () => {
      // ihr Satz in einer Folge BrunnenTV gehört zur Folge (episode: der Reihe nach, nie unterbrochen); ihr Untertitel
      // steht, sobald sie wirklich spricht, und geht mit, wenn der Satz entfällt
      let line = null;
      const dur = this.speech.say(text, 'board', {
        priority,
        episode: scene && !!this.tv,
        ...(navi ? { stale: Infinity } : {}),
        onStart: (d) => {
          nomi.speak(d);
          line = navi ? this.ui.naviDurchsage(text, d + 1.5) : this.ui.nomi(text, d + 0.8);
        },
        onDrop: () => line && (line.t = 0),
      });
      this.voiceUntil = Math.max(this.voiceUntil, this.t + dur + 0.8);
    };
    // OMI hat das Wort: Das Sprachstudio verstummt mitten im Satz und wartet, bis sie fertig ist – sein Untertitel
    // geht mit (wie bei jedem abgebrochenen Satz), statt nach ihrem halb gesagt wieder dazustehen
    this.voiceUntil = Math.max(this.voiceUntil, this.t + 1.2);
    this.studio.hush();
    // (die Navi-Durchsage beginnt nach ihrem Gong)
    if (this.running) this.later(navi ? 1.3 : 0.35, go);
    else go();
  }

  /** Nach einer Szene: was OMI darin Wichtiges sagen wollte (say hielt es zurück), der Reihe nach. */
  sayHeld() {
    this.heldSay.forEach(([text, mood, navi], i) => this.later(0.5 + 3.5 * i, () => this.say(text, mood, { navi })));
    this.heldSay.length = 0;
  }

  /**
   * Gang gewechselt (Player.shift): ein kurzer Ton; R sagt OMI an (höchstens alle 20 s, sonst nur der Ton), und auf
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
    return this.running && ((!!b && b.announced && !b.checked) || !!this.cam.alarm);
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

  /**
   * Bußgeld oder Verwarngeld abbuchen, immer ganz (Besitzer, 25.11.2026: „Ich möchte, dass Schäden, Bußgelder etc das
   * Guthaben ins Minus ziehen kann.“): Die Stream-Kasse darf dafür ins Minus gehen, am Guthaben und in der Abrechnung
   * steht der ganze Betrag.
   */
  fine(amount, label) {
    if (!(amount > 0)) return;
    this.money -= amount;
    this.breakdown[label] = (this.breakdown[label] || 0) - amount;
    this.stats.fines += amount;
    this.ui.money(-amount, label);
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
    this.thank('donors', name, amount);
    // die Alter-Skala: Ab 100 € ruft der ganze Chat, darunter kommentiert er nur ab und zu (sonst wird es ein Sprechchor –
    // bei bester Laune kommen Mittelalter im Minutentakt)
    const alter = alterReaction(amount);
    if (alter && amount >= 100) this.burst(alter, 3, 1.8);
    else if (alter && chance(amount >= 50 ? 0.35 : amount >= 20 ? 0.4 : 0.15)) this.later(0.6, () => this.chat(this.chatLine(alter)));
    // genau 4 €: Ab diesem Betrag gibt es im Stream eine Dankeseinblendung – das wissen die Stammgäste
    else if (amount === 4 && chance(0.5)) this.later(0.7, () => this.chat(this.chatLine(CHAT.einblendung)));
    this.eco.donated(amount);
    this.onMood('donation', clamp(amount / 20, 0.25, 1));
    // eine richtig große Spende gibt das Sprachstudio gern weiter (studio.js donated)
    this.studio.donated(name, amount);
    // … und die Zuschauer danken in einer Sprachdurchsage mit (nicht für die Durchsage selbst)
    if (amount >= DS.big && what !== 'Sprachdurchsage') this.dsMoment('spende', name);
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
      // erst nachsehen, ob etwas fällig ist: Die Liste ist fast nie leer, neue Listen braucht es nur dann
      let any = false;
      for (const q of this.queue) if (q.at <= now) any = true;
      if (any) {
        const due = this.queue.filter((q) => q.at <= now);
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
        // zu schnell für die Kurve: OMI sagt es freundlich (höchstens alle 25 s)
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
    if (!this.rekordSaid && st.distance > this.save.best.reise) {
      this.rekordSaid = true;
      this.studio.remember(rekordMemory(this.save.best.reise));
    }
    st.maxSpeedKmh = Math.max(st.maxSpeedKmh, p.kmh);
    // neue Höchstgeschwindigkeit dieser Fahrt: Der Chat schaut auf den Tacho
    const mark = this.eco.speedMark(p.kmh);
    if (mark) {
      this.chat(fillTemplate(pick(CHAT.speedMark), { kmh: mark }));
      this.thrill('topSpeed', `${mark} km/h`);
      if (mark >= MANOEUVRE.praiseKmh) this.studio.praise('tempo', { kmh: mark });
    }
    st.cleanDistance += dm;
    if (W.level > 0.3) st.rainDistance += dm;
    // die Uhr ist die Reisezeit
    this.clock += go.secs / 60;
    this.megafonCd = Math.max(0, this.megafonCd - dt);
    // die Running Gags (gags.js) mit eigenem Zufall: Bezahlschranke, Verein, Paketsuche, Mitleidskauf …
    this.gags.update(dt);

    // --- Eingaben ------------------------------------------------------------
    if (ctl.device) this.device = ctl.device;
    if (ctl.horn) this.honk();
    if (ctl.wiper) this.manualWiper();
    if (ctl.megafon) this.useMegafon();
    // Taste L: neben einer Ladesäule oder Bucht gleich dort laden, sonst den nächsten Ladestopp einplanen
    if (ctl.ladestopp && !this.akku.chargeHere()) this.akku.planStop();
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
    // Laden ohne Plan: neben einer Ladesäule oder Bucht bietet es der Rand oben an (Taste L, Knopf „Jetzt laden“)
    this.akku.offerHint();

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
    // der Ladestopp und danach der Zuckerschub des Bananensafts
    this.akku.tick();
    if (this.tv) this.tickBrunnenTV();
    else if (this.navi.stopping) this.tickHalt(dt);
    this.updateNavi(dt);
    this.exitCall();
    this.studio.countdown(dt);
    this.updateEvents(dt, camera);
    this.updatePickups(dt, camera);
    this.updateViewers(dt);
    this.updateChat(dt, ctl.kappa || 0);
    this.studio.update();
    this.updateJobs();

    // Standstreifen
    if (p.shoulderTime > 1.2 && !this.shoulderWarned) {
      this.shoulderWarned = true;
      this.say(BOARD.shoulder, 'worried');
      this.burst(CHAT.shoulder, 2, 1.5);
    }
    if (p.shoulderTime > 4.5) {
      p.shoulderTime = 0;
      this.fine(BUSSGELD.verwarn, 'Verwarngeld');
      this.eco.cheer('fine');
      this.ui.toast(`🚓 Standstreifen: ${BUSSGELD.verwarn}\u00a0€ Verwarngeld`, 'bad');
      this.callPolice('STANDSTREIFEN? NEIN!');
    }
    if (p.shoulderTime <= 0) this.shoulderWarned = false;

    // Akku: OMI nennt den nächsten Ladepark, der Mittelbildschirm zeigt die Akku-Karte (akku.js watch);
    // leer hält der Tempomat nichts mehr (Player.longStep): Der Wagen rollt aus, im Stand ist die Fahrt zu Ende
    this.akku.watch();
    if (p.empty && p.speed < 1.5) this.end('akku');
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
    this.gags.fail('rempler');
    this.stats.crashes++;
    this.tally.hits++;
    // frontal in den Gegenverkehr: teurer, je schneller beide aufeinander zu fuhren (Rechnung bei der Ankunft)
    const front = !!(e.car.oncoming && e.headOn);
    if (front) {
      this.tally.front++;
      this.tally.extra += frontalCost(e.closing * 3.6) - REPARATUR.bump;
    }
    this.stats.cleanDistance = 0;
    this.eco.cheer('crash', front ? 1.5 : 1);
    this.audio.crash(e.zone, e.power);
    this.fx.shake(1, e.zone);
    // frontal erschrickt Mini Adam (der verlegene Gruß danach folgt der Regel in wave.js wie nach jedem Rempler)
    this.onMood(front ? 'startled' : 'ouch', 1);
    this.cockpit.nomi.setMood('dizzy', 3);
    const left = p.maxHits - p.hits;
    this.ui.damage();
    // OMI tröstet (nie über Verletzungen): erster Rempler, weitere, der letzte Punkt; frontal mit eigenen Sätzen (den
    // letzten Punkt sagt dann der Rand)
    const kind = front ? 'frontal' : left === 1 ? 'last' : p.hits === 1 ? 'first' : 'more';
    if (left > 0) this.later(0.6, () => this.say(damageLine(kind, e.zone), left === 1 || front ? 'worried' : 'talk', { priority: false }));
    if (e.car.behavior === 'polizei') this.chat('Ausgerechnet die Polizei Gifhorn 😱');
    this.burst(front ? CHAT.frontal : CHAT.crash, 3, 2);
    this.dsMoment('rempler');
    if (left <= 0) {
      // (den verlegenen Gruß nach dem letzten Rempler gibt es im Abspann: main.js)
      this.end('werkstatt');
      return;
    }
    // nach dem Schreck ein kleiner, verlegener Gruß in die Kamera (wave.js)
    this.later(WAVE.afterCrash, () => this.waveAt('unfall'));
    const what = front ? '🧸 Frontal-Rempler!' : '🧸 Rempler!';
    this.ui.toast(left === 1 ? `${what} Nur noch ein Karosserie-Punkt!` : `${what} Noch ${left} Karosserie-Punkte`, 'bad');
  }

  /** Haarscharf überholt (MANOEUVRE): Impuls, Ton, Chat und Lob – und nach mehreren kurz hintereinander die Serie. */
  onNearMiss(e) {
    const M = MANOEUVRE;
    this.stats.nearMisses++;
    const list = (this.manoeuvres = this.manoeuvres.filter((t) => this.t - t < M.window));
    list.push(this.t);
    const n = list.length;
    this.thrill('nearMiss', 'dieses Manöver');
    this.onMood('startled', 0.75);
    this.onFeel(Math.min(1, M.rumble[0] + 0.12 * (n - 1)), M.rumble[1]);
    this.audio.clip(n);
    if (n >= M.serie && n % M.serie === 0) {
      // eine Serie: einmal je volle serie Manöver (3, 6, 9 …), danach zählt sie weiter
      this.thrill('nearMissSerie', `${n} Manöver am Stück`);
      this.ui.toast(`🔥 ${n}× haarscharf in Folge!`, 'good', 'serie');
      if (n === M.serie) this.chat('HATTRICK 🎩🎩🎩');
      this.burst(CHAT.nearMissSerie, n === M.serie ? 3 : 4, 2.2);
      this.studio.praise('serie', { n: ZAHLWORT[n] || String(n) });
      this.onMood('proud', 0.8);
      return;
    }
    this.chat(this.chatLine(CHAT.nearMiss));
    if (chance(M.second)) this.later(rand(0.5, 1.3), () => this.chat(this.chatLine(CHAT.nearMiss)));
    this.studio.praise('knapp');
  }

  // --- Ende ------------------------------------------------------------------------------------
  end(reason) {
    if (this.over) return;
    this.running = false;
    const p = this.player;
    // was noch offen ist, geht nicht verloren: die Rechnung, die gerade unterwegs war, und die Schäden der laufenden
    // Runde (auch der letzte Rempler vor der Werkstatt) stehen mit in der Abrechnung
    const B = this.billDue;
    if (B) this.chargeDamage(B.hits, B.marks, B.extra, B.front);
    this.billDue = null;
    const T = this.tally;
    this.chargeDamage(T.hits, scratchMarks(p.damage) - T.marks, T.extra, T.front);
    T.hits = T.front = T.extra = 0;
    T.marks = scratchMarks(p.damage);
    // mitten im Laden beendet: der Strom, der bis dahin geflossen ist
    this.akku.cutShort();
    const km = p.s / 1000; // der Beruf des Tages richtet sich nach den Metern der Straße (keine Zahl auf dem Schirm)
    this.over = {
      reason,
      distance: this.odometer,
      // die Route des Streams (genommene Abschnitte, Folgen, Ladestopps; die Summe ist der Kilometerzähler)
      route: this.route.finish(this.odometer),
      air: this.airtime,
      // die Einschaltquote des Streams (Kurve im Abspann)
      quote: { dt: this.quote.dt, v: [...this.quote.v, Math.round(this.viewers)], tv: this.quote.tv.slice(), t: this.t },
      // (mit Vorzeichen: Die Schäden können mehr kosten, als der Stream eingebracht hat)
      money: Math.round(this.money * 100) / 100,
      breakdown: { ...this.breakdown },
      damage: { ...this.damageBill },
      laden: { ...this.ladeBill },
      jobs: this.jobs.map((j) => ({ text: j.text, done: j.done, pledge: j.pledge, pledger: j.pledger })),
      fans: this.supporters(),
      stats: { ...this.stats },
      peakViewers: Math.round(this.peakViewers),
      // was die Running Gags zur Abrechnung beitragen (gags.js report: der Verein …)
      gags: this.gags.report(),
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
   * Der laufende Stream, wie end() ihn jetzt abrechnen würde (für den Zwischenstand im Spielstand, save.js
   * settleStream): Geld abzüglich der Schäden, die noch nicht gebucht sind (die Rechnung unterwegs und die laufende
   * Runde), Strecke, Zuschauerspitze, erreichte Ziele und Rempler. Ändert nichts am Spiel.
   */
  interim() {
    const cost = (hits, marks, extra) => Math.max(0, damageCost(hits, marks, extra));
    let open = cost(this.tally.hits, scratchMarks(this.player.damage) - this.tally.marks, this.tally.extra);
    if (this.billDue) open += cost(this.billDue.hits, this.billDue.marks, this.billDue.extra);
    // der Strom eines laufenden Ladestopps (end bucht ihn so, Akku.cutShort)
    open += this.akku.openCharge();
    return {
      money: Math.round((this.money - open) * 100) / 100,
      distance: this.odometer,
      peakViewers: Math.round(this.peakViewers),
      naviReached: this.stats.naviReached,
      crashes: this.stats.crashes,
    };
  }

  /** Für den Abspann mitschreiben: kind donors, bids (v: Betrag) oder raids (v: Leute) – Summe und Anzahl je Name. */
  thank(kind, name, v) {
    if (!name) return;
    const e = this.fans[kind][name] || (this.fans[kind][name] = { sum: 0, n: 0 });
    // auf den Cent gerundet: Hunderte Spenden zu 1,99 € summieren sich sonst zu 397,99999 €
    e.sum = Math.round((e.sum + v) * 100) / 100;
    e.n++;
  }

  /**
   * Wem der Abspann dankt – wie im echten SkylineTV-Abspann, der die Unterstützenden nach Art aufteilt: die größte
   * Spende, alle Spender und Bieter (höchste Summe zuerst), die Abo-Verschenker (meiste Abos zuerst), die neuen VIPs
   * und die Raids. Jeder Name, der in diesem Stream etwas gegeben hat, steht darin (src/ui/abspann.js gruppiert). Dazu
   * der Verein des Streams mit seinen Mitgliedern (gags.js; null, solange er nicht gegründet ist).
   */
  supporters() {
    const F = this.fans;
    const gifters = Object.entries(F.gifts).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
    const list = (m) => Object.entries(m).sort((a, b) => b[1].sum - a[1].sum).map(([name, e]) => ({ name, sum: e.sum, n: e.n }));
    return { donors: list(F.donors), bidders: list(F.bids), gifters, vips: [...new Set(F.vips)], raids: list(F.raids), verein: this.gags.report().verein };
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
    // das Tempolimit, das hier gilt: in der Blitzer-Zone 120, sonst das der Straße (Ort 50, Rampe 80, Landstraße 100)
    const limit = this.blitzer && p.s > this.blitzer.limitS && p.s < this.blitzer.endS ? 120 : p.limits.posted || null;
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
      lowBattery: this.akku.card(),
    };
  }
}

/** Die Teile der Regie (src/game/parts/) hängen ihre Methoden an Game an: aufgeteilt nach Thema, ein Spielobjekt. */
function attachParts(cls, parts) {
  for (const part of parts) {
    for (const key of Object.getOwnPropertyNames(part.prototype)) {
      if (key === 'constructor') continue;
      if (Object.prototype.hasOwnProperty.call(cls.prototype, key)) throw new Error(`Game.${key} doppelt (${part.name})`);
      Object.defineProperty(cls.prototype, key, Object.getOwnPropertyDescriptor(part.prototype, key));
    }
  }
}
attachParts(Game, [SpurWetterPart, ZielPart, EreignissePart, StreamPart]);
