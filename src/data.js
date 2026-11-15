// Alle Texte, Insider und Spieldaten an einem Ort.
// Quellen der Insider: SkylineTV LIVE Wiki (siehe INSIDER.md im Repo).
import { pick, rand, randInt, chance } from './util.js';

export const GAME_TITLE = 'Mini Adam';
export const GAME_SUBTITLE = 'Tesla-Navi ferngesteuert';
export const TAGLINE = 'Live-Eskalationen immer woanders!';

// ---------------------------------------------------------------------------
// Navi-Ziele aus echten „Tesla ferngesteuert“-Streams (plus ein paar Insider)
// km: [min, max] Spiel-Kilometer bis zum Ziel, special: besondere Ankunft
export const NAVI_TARGETS = [
  { name: 'Tesla Supercharger Erlensee', note: 'Hier begann am 30.01.2021 das allererste Navi-Experiment.', km: [1.6, 3.2] },
  { name: 'Hochofenwerk Phoenix West, Dortmund', note: 'Ziel des ersten Navi-Streams (429,16 km).', km: [2.2, 4.0] },
  { name: 'Burg Hauneck, Haunetal', note: 'Das erste Ziel, das 2022 wirklich erreicht wurde.', km: [1.8, 3.4] },
  { name: 'Megahub Lehrte', note: 'Güterbahnhof. Der Chat war erleichtert.', km: [1.8, 3.6] },
  { name: 'Arnhem (Niederlande)', note: 'Kurz mal Ausland.', km: [2.5, 4.6] },
  { name: 'Gifhorn, Supermarkt-Parkplatz', note: 'Historisch bedeutsam. Polizei Gifhorn grüßt.', km: [2.0, 3.8], special: 'gifhorn' },
  { name: 'Liberec (Tschechien)', note: 'Ziemlich weit. Wird bestimmt gleich überboten.', km: [6.0, 8.5] },
  { name: 'Wartburg, Eisenach', note: 'Mit Automat für 0-Euro-Geldscheine.', km: [1.8, 3.5] },
  { name: 'Drive-In: Pommes ohne Rückfragen', note: 'Die legendäre Drive-In-Wette.', km: [1.4, 2.6], special: 'pommes' },
  { name: 'Malte in Norderstedt abholen', note: 'Die Bahn fällt mal wieder aus.', km: [2.6, 4.8], special: 'malte' },
  { name: 'Burg Ronneburg', note: 'Burgen gehen immer.', km: [1.6, 3.0] },
  { name: 'Rastplatz Schäferborn Ost', note: 'Endstation der dritten Navi-Runde.', km: [1.4, 2.8] },
  { name: 'Weser-Skywalk, Beverungen', note: 'Aussicht mit Wackelfaktor.', km: [2.0, 3.6] },
  { name: 'Ionity-Ladestation Kirchheim', note: 'Strom tanken mit Stil.', km: [1.5, 3.0], special: 'charger' },
  { name: 'Tesla Supercharger Mogendorf', note: 'Hier endete die 723-km-Tour 2021.', km: [1.8, 3.2], special: 'charger' },
  { name: 'Köln', note: 'Wo genau? Egal, Hauptsache Köln.', km: [2.2, 4.0] },
  { name: 'Siegen', note: 'Wurde schon oft gespendet. Setzt sich fast nie durch.', km: [2.0, 3.5], special: 'siegen', weight: 0.25 },
  { name: 'Bispingen', note: 'Schnee im Sommer.', km: [2.4, 4.2] },
  { name: 'Sizilien (wegen Monte)', note: 'Ein ganz normaler Ostersamstag.', km: [8.0, 11.0] },
  { name: 'Gardasee', note: 'Die Oster-Tour lässt grüßen.', km: [5.0, 7.0] },
  { name: 'Burg Staufen', note: 'Silvester-Feeling.', km: [2.2, 3.8] },
  { name: 'Kassel – Elsa besuchen', note: 'Spirit-Animal von SkylineTV LIVE.', km: [2.0, 3.8], special: 'elsa' },
  { name: 'Fulda', note: 'Startort der VIP-Edition.', km: [1.6, 3.0] },
  { name: 'Frankfurt am Main – Skyline', note: 'Heimat von SkylineTV.', km: [2.4, 4.4] },
  { name: 'Bad Soden-Salmünster (Popcorn an der Ladesäule)', note: 'Haushaltsgeräte an der E-Säule testen.', km: [1.6, 3.0], special: 'charger' },
  { name: 'Bischofsheim in der Rhön (Starlink)', note: 'Erster Starlink-IRL-Stream der Welt.', km: [2.2, 3.8] },
  { name: 'Dortmund – die richtige Currywurstbude', note: 'Diesmal ganz sicher die richtige.', km: [1.8, 3.2], special: 'bude' },
  { name: 'Ein sehr schöner Brunnen', note: 'Für eine neue Folge BrunnenTV.', km: [1.4, 2.8], special: 'brunnen' },
  { name: 'Meister Propper abholen', note: 'Er ist ganz bestimmt gleich da.', km: [1.6, 3.0], special: 'propper' },
  { name: 'Sparkasse (Farbe prüfen)', note: 'Der Wissenschaftliche Dienst braucht Daten.', km: [1.4, 2.6], special: 'sparkasse' },
];

export const SPARKASSEN_FARBEN = ['rot', 'blau', 'weiß', 'rot (wie immer)', 'überraschend orange'];

// ---------------------------------------------------------------------------
// Zuschauernamen (frei erfunden)
const NAME_A = ['Ebbelwoi', 'Handkäs', 'Brunnen', 'Schnitzel', 'Navi', 'Plüsch', 'Rettich', 'Elsa', 'Sparkassen',
  'Blinker', 'Wischer', 'Kassel', 'Fulda', 'Gifhorn', 'Mainz', 'Rasthof', 'Akku', 'Supercharger', 'Dampfcola',
  'Bananensaft', 'Kanalpunkte', 'Pommes', 'Funkloch', 'Drohnen', 'Starlink', 'Spurwechsel', 'Autobahn',
  'Leitplanken', 'Ortsspenden', 'Rahmen', 'FullHD', 'Konfetti', 'Megafon', 'Ringtennis', 'Pandamützen'];
const NAME_B = ['_FFM', '77', '_HD', '3000', '333', '_Fan', 'fahrer', 'freund', 'hesse', '_LIVE', '42', '_93',
  'könig', 'prinzessin', 'opa', 'tante', 'kumpel', '_VIP', '2017', 'liebe', 'meister', '_on_tour', '1337', 'xd'];

export function viewerName() {
  return pick(NAME_A) + pick(NAME_B);
}

export function nameColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return `hsl(${h}, 75%, 68%)`;
}

// ---------------------------------------------------------------------------
// Chat-Bots aus dem Live-Bereich
export const BOTS = {
  james: { name: 'James', icon: '💶', role: 'Finanz-Bot' },
  claudia: { name: 'Claudia', icon: '⚙️', role: 'Aktions-Bot' },
  victoria: { name: 'Victoria', icon: '🏆', role: 'Sieges-Böttin' },
  hugo: { name: 'Hugo', icon: '⏰', role: 'Hilfs-Bot' },
  nora: { name: 'Nora', icon: '🖥️', role: 'Server-Bot' },
};

// ---------------------------------------------------------------------------
// Chat-Sprüche
export const CHAT = {
  ambient: [
    'Grüße aus {city}! 👋', 'Hallo Mini Adam ❤', 'Ist das Bild wirklich Full HD?', 'Wo seid ihr gerade?',
    'Welche Farbe hat die Sparkasse hier?', 'Gibt es in {city} einen Ringtennis-Verein?', 'Rechts fahren, Adam! 😅',
    'Schöne Landschaft heute', 'Wie viel Akku noch?', 'Wann kommt Meister Propper?', 'Malte Malte Malte Malte Malte',
    'Erzähl mal die Raab-Story!', 'Das Bild ist so scharf 😍', 'Elsa ❤🐸', 'BrunnenTV wann?', 'Bananensaft-Pause? 🍌',
    'Kappandramäßige Zusammenfassung bitte, bin grad erst rein', 'Wir sind auf der Autobahn und streamen in Full HD! 🎶',
    'Wohin fahren wir eigentlich?', 'Das Navi-Ziel ändert sich eh gleich wieder', 'Grüße ans Sprachstudio!',
    'Danke an alle Ehrenmenschen 🙏', 'Tic Tac jemand?', 'Pandamütze aufsetzen!', 'Ich biete 1 Cent mehr 🤑',
    'Was ist eigentlich im Kofferraum?', 'Grüße an die Polizei Gifhorn 👮', 'Ist das die A7?', 'Schöner Tesla 🖤',
    'Der Wischer ist auch nur ein Mensch', 'Nils weiß bestimmt, wann wir das letzte Mal hier waren',
    'Bester Stream der Woche', 'Die Plüsch-Hände am Lenkrad 😂', 'Gleich kommt bestimmt ein Brunnen',
    'Tesla-Taxi spielen wann?', 'Erster! (nicht)', 'Falsche Bude? 😂', 'Wer hat das Navi so eingestellt',
    'Adam, schreib mal eine Zahl in den Chat', 'Was läuft da im Radio?', 'Live-Eskalationen immer woanders 🔥',
  ],
  leftLane: ['LINKS IST FREI!!! ⬅️', 'Endlich linke Spur 🚀', 'Gib ihm!', 'Eine Minute Freiheit!', 'Danke für die Freischaltung!',
    '⬅️⬅️⬅️', 'Jetzt aber links!', 'Linke Spur, Baby!'],
  leftLaneEnd: ['Und wieder rechts 😅', 'Rechtsfahrgebot!', 'War schön, solange es ging', 'Nochmal freischalten!'],
  naviChanged: ['Wer war das? 😂', 'Nicht schon wieder!', 'Überboten! 🤑', 'Navi ferngesteuert 🔥', 'Wendemanöver incoming',
    'Das Navi weiß auch nicht mehr weiter', 'Ich biete 1 Cent mehr', 'Klassiker', 'Jetzt aber wirklich!', 'NEIN 😂'],
  naviReached: ['ANGEKOMMEN! 🎉', 'Geschafft!!!', 'Und jetzt?', 'Gibt es hier eine Sparkasse?', 'Wo ist der Guide?', 'Ziel erreicht 🏁'],
  crash: ['Rezeption!', 'Uff 🙈', 'Das gibt Ärger', 'Polizei Gifhorn ist unterwegs 🚓', 'Blechschaden!', 'Hoffentlich hat das keiner gesehen',
    'Eskalation! 😂', 'Das war die falsche Spur'],
  nearMiss: ['WAS WAR DAS 😱', 'Knapp!!!', 'Millimeterarbeit', 'CLIP!', 'Clip it!', 'Puh…', 'Mutig!'],
  rainStart: ['Regen 🌧', 'Jetzt wird es spannend', 'Wischer.exe reagiert nicht', 'Auto-Wischer (Beta) 😂',
    'Der Herr mit den Schirmen freut sich', 'Ab jetzt gibt es Regenzulage!'],
  wiper: ['Der Wischer zuckt wieder 😂', 'Der Wischer wischt nicht, der winkt nur', 'Software-Update wann?',
    'Das ist kein Bug, das ist ein Feature', 'Wischer-Firmware 0.1 Beta', 'Mach doch einfach manuell!', 'Der Wischer ist schüchtern'],
  police: ['POLIZEI GIFHORN 🚓', 'Polizei Gifhorn kommt!', 'Benehmen jetzt!', 'Ganz ruhig bleiben…', '👮👮👮'],
  funkloch: ['F', 'F', 'F', 'Ton f', '/cam2', 'F', 'Bild weg?', 'F'],
  funklochBack: ['✔️', '✔️', '✔️ Bild ist wieder da', 'Da ist es wieder ✔️'],
  frog: ['🐸', '🐸🐸', 'Frosch!', '🐸 HDMI-Kabel?'],
  blitzer: ['📸', 'Lächeln! 📸', 'Das Foto kommt in einen Rahmen', 'Tschüss, du Betrüger!', 'Teures Selfie'],
  elefant: ['Elefantenrennen 🐘🐘', 'Das dauert…', 'Überholverbot wann?', 'Die stehen ja fast'],
  trunk: ['Kofferraum auf! 😂', 'Was ist da drin?', 'Bitspende-Eskalation', 'Konfetti im Kofferraum?'],
  brunnen: ['BRUNNENTV!!!', 'Herr Schönnbrun!', 'Brunnen gesichtet! ⛲', 'Neue Folge BrunnenTV!'],
  elsa: ['ELSA!!! ❤🐸', 'Elsa ❤', 'Spirit-Animal gesichtet!', '👑🐟'],
  record: ['REKORD!!! 🎉', 'Neuer Zuschauerrekord!', 'Diesmal ohne Viewer-Bots 🤖', 'Hype!'],
  banana: ['🍌🍌🍌', 'Bananensaft-Power!', 'Lecker 🍌'],
  koriander: ['Bäh, Koriander 🤢', 'Nicht der Koriander!', 'Wer hat da Koriander bestellt?'],
  shoulder: ['Standstreifen?! 😱', 'Polizei Gifhorn!!', 'Das ist keine Fahrspur!'],
  fiveJobs: ['Job erledigt ✅', 'Weiter so!', 'Noch ein Job weniger'],
  rahmen: ['Schöner Rahmen 😂', 'Ich sehe nichts mehr', 'Bestes Geld ever', 'Danke für den Rahmen!'],
  zahl: () => {
    const n = chance(0.75) ? threeNumber() : String(randInt(10, 9999));
    return n;
  },
};

function threeNumber() {
  const len = randInt(2, 4);
  let s = '';
  for (let i = 0; i < len; i++) s += chance(0.62) ? '3' : String(randInt(0, 9));
  if (!s.includes('3')) s = '3' + s.slice(1);
  return s;
}

export function fillTemplate(text, vars = {}) {
  return text.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : pick(CHAT_CITIES)));
}

export const CHAT_CITIES = ['Fulda', 'Kassel', 'Gifhorn', 'Mainz', 'Köln', 'Siegen', 'Hanau', 'Darmstadt', 'Bielefeld',
  'Buxtehude', 'Konstanz', 'Augsburg', 'Bremen', 'Nürnberg', 'Hamburg', 'Lübeck', 'Trier', 'Erlensee'];

// ---------------------------------------------------------------------------
// Spenden-Reaktionen („Alter“-Skala)
export function alterReaction(euro) {
  if (euro >= 100) return 'ALTER!';
  if (euro >= 50) return 'Mittelalter';
  if (euro >= 33) return 'Drittel-Alter';
  if (euro >= 25) return 'Viertel-Alter';
  if (euro >= 20) return 'Fünftel-Alter';
  if (euro >= 10) return 'Zehntel-Alter';
  return null;
}

// ---------------------------------------------------------------------------
// Sprachdurchsagen (werden per Sprachausgabe vorgelesen)
export const VOICES = {
  kassandra: { label: 'Fräulein Kassandra', pitch: 1.35, rate: 1.0 },
  weronika: { label: 'Weronika', pitch: 1.1, rate: 0.95 },
  karla: { label: 'Karla', pitch: 1.0, rate: 1.05 },
  william: { label: 'Brüll-William', pitch: 0.55, rate: 1.12 },
  board: { label: 'NOMI', pitch: 1.18, rate: 1.04 },
  schoennbrun: { label: 'Herr Schönnbrun', pitch: 0.45, rate: 0.82 },
};

export const DURCHSAGEN = [
  { voice: 'kassandra', text: 'Treffen sich zwei Unterhosen. Fragt die eine: Warst du im Urlaub? Du bist so braun.' },
  { voice: 'karla', text: 'Hallo Mini Adam, liebe Grüße aus {city}. Dachs grüßt Efeu.' },
  { voice: 'william', text: 'Mini Adam, bitte einmal hupen! Bimmel hurra!' },
  { voice: 'weronika', text: 'Hier spricht Meister Propper. Ich bin in fünf Minuten da.' },
  { voice: 'karla', text: 'Grüße an das Sprachstudio und an alle Ehrenmenschen!' },
  { voice: 'weronika', text: 'Mini Adam, wann gibt es endlich eine neue Folge BrunnenTV?' },
  { voice: 'kassandra', text: 'Liebe Grüße an Elsa!' },
  { voice: 'karla', text: 'Gibt es in {city} eigentlich einen Ringtennis-Verein?' },
  { voice: 'weronika', text: 'Welche Farbe hat die Sparkasse in {city}?' },
  { voice: 'william', text: 'Mini Adam, erzähl doch mal die Raab-Story!' },
  { voice: 'karla', text: 'Wir sind auf der Autobahn und streamen in Full HD!' },
  { voice: 'william', text: 'Ich biete einen Cent mehr. Neues Ziel: {city}.' },
  { voice: 'kassandra', text: 'Bitte rechts fahren. Mit freundlichen Grüßen, die Polizei Gifhorn.' },
  { voice: 'weronika', text: 'Mini Adam, du fährst besser als jedes Navi.' },
  { voice: 'karla', text: 'Hallo Mini Adam! Schreib mal eine Zahl in den Chat. Aber bitte ohne Drei.' },
  { voice: 'william', text: 'Kappandramäßige Zusammenfassung bitte! Ich war beim Schwimmunterricht.' },
];

export const DURCHSAGEN_REGEN = [
  { voice: 'karla', text: 'Guten Tag, hier ist der Herr mit den Schirmen. Ich würde meine Schirme gerne heute noch abholen.' },
  { voice: 'weronika', text: 'Mini Adam, dein Scheibenwischer winkt mir gerade zu. Ich winke zurück!' },
  { voice: 'kassandra', text: 'Achtung, Achtung. Der automatische Scheibenwischer befindet sich weiterhin in der Beta-Phase.' },
];

// ---------------------------------------------------------------------------
// Boardcomputer-Sätze
export const BOARD = {
  leftLane: 'Die linke Fahrspur ist freigeschaltet.',
  leftLaneEnd: 'Die linke Fahrspur ist wieder gesperrt. Bitte rechts fahren.',
  naviChanged: 'Das Navi-Ziel wurde geändert.',
  arrived: 'Sie haben Ihr Ziel erreicht.',
  rain: 'Regen erkannt. Automatische Scheibenwischer aktiviert.',
  lowBattery: 'Akku schwach. Bitte bald laden.',
  veryLowBattery: 'Akku fast leer. Die Stream-Technik schaltet gleich ab.',
  elefant: 'Achtung. Elefantenrennen voraus.',
  blitzer: 'Hinweis: Tempolimit. Stationärer Blitzer voraus.',
  shoulder: 'Hinweis: Der Standstreifen ist keine Fahrspur.',
  funkloch: 'Verbindung schwach. Mobilfunk wird neu gebündelt.',
};

// ---------------------------------------------------------------------------
// Rahmen-Einblendungen (Preise wie im Live-Bereich)
export const RAHMEN = [
  { id: 'rosen', name: 'Rosenrahmen', price: 12.0, dur: 9 },
  { id: 'rettich', name: 'Rettichrahmen', price: 13.69, dur: 9 },
  { id: 'pommes', name: 'Pommes-Rahmen', price: 5.0, dur: 7 },
  { id: 'pappkarton', name: 'Pappkartonhaufen', price: 10.0, dur: 8 },
  { id: 'haelfte', name: 'Bildhälfte abdecken', price: 10.0, dur: 3.5 },
  { id: 'elsa', name: 'Elsa auf den Bildschirm zaubern', price: 2.9, dur: 6 },
  { id: 'burger', name: 'Burger-Rahmen', price: 14.0, dur: 8 },
  { id: 'candy', name: 'Candy-Rahmen', price: 10.0, dur: 8 },
  { id: 'lego', name: 'Lego-Rahmen', price: 12.0, dur: 8 },
  { id: 'briefmarken', name: 'Briefmarken-Rahmen', price: 10.01, dur: 8 },
  { id: 'chips', name: 'Chipsrahmen', price: 5.0, dur: 7 },
  { id: 'keinerechte', name: 'Keine-Rechte-Bildrahmen', price: 10.0, dur: 7 },
  { id: 'kuerbis', name: 'Kürbis im Stream', price: 4.9, dur: 6 },
];

// ---------------------------------------------------------------------------
// Erlogene Berufsbezeichnungen (aus dem Wiki) für den Abspann
export const BERUFE = [
  { km: 0, job: 'Brownietester', src: '19.03.2020, Ersatzstream im Homeoffice' },
  { km: 1, job: 'Münzentwerter auf dem Jahrmarkt', src: '23.01.2020, Emskirchen' },
  { km: 2, job: 'Plumpsklo-Ingenieur', src: '20.09.2018, Münster' },
  { km: 3, job: 'Baut künstliche Maulwurfstunnel', src: '02.01.2020, Cuxhaven' },
  { km: 4, job: 'Bildumdreher im Frankfurter Kunstmuseum', src: '05.03.2020, Werne' },
  { km: 5, job: 'Krokodilwächter im Frankfurter Zoo', src: '26.05.2019, Fulda' },
  { km: 6.5, job: 'Qualitätssicherung für Schilder (prüft die Druckauflösung)', src: '30.03.2017, München' },
  { km: 8, job: 'Wartet Schornsteine in Wolkenkratzern', src: '13.12.2019, Salzburg' },
  { km: 10, job: 'Richtet WLAN in Flugzeugen ein', src: '25.07.2019, Karlsruhe' },
  { km: 12, job: 'Schreibt die Algorithmen für die roten und orangenen Bereiche bei Google Maps', src: '23.05.2019, Freising' },
  { km: 15, job: 'Statistische Modelle für die Endzeit der Benzintankstellen', src: '07.10.2022, Golfen im Park' },
  { km: 20, job: 'Teilchenbeschleuniger', src: '06.02.2021, Tesla-Navi ferngesteuert' },
];

export function berufFor(km) {
  let best = BERUFE[0];
  for (const b of BERUFE) if (km >= b.km) best = b;
  return best;
}

// ---------------------------------------------------------------------------
// „You had 5 Jobs“ – pro Fahrt fünf kleine Aufgaben
export const JOB_TEMPLATES = [
  { id: 'left20', text: '20 Sekunden auf der freigeschalteten linken Spur', goal: 20, stat: 'leftLaneTime' },
  { id: 'navi1', text: 'Ein Navi-Ziel erreichen', goal: 1, stat: 'naviReached' },
  { id: 'near3', text: '3× haarscharf überholen', goal: 3, stat: 'nearMisses' },
  { id: 'speed200', text: '200 km/h fahren', goal: 200, stat: 'maxSpeedKmh' },
  { id: 'banana2', text: '2× Bananensaft einsammeln', goal: 2, stat: 'bananas' },
  { id: 'clean5', text: '5 km ohne Blechschaden', goal: 5000, stat: 'cleanDistance' },
  { id: 'changes3', text: '3 Navi-Änderungen überstehen', goal: 3, stat: 'naviChanges' },
  { id: 'viewers1000', text: '1.000 Zuschauer erreichen', goal: 1000, stat: 'maxViewers' },
  { id: 'charge2', text: '2 Lade-Ringe einsammeln', goal: 2, stat: 'charges' },
  { id: 'dist8', text: '8 km Strecke schaffen', goal: 8000, stat: 'distance' },
  { id: 'blitzfrei', text: 'An einem Blitzer vorbei, ohne geblitzt zu werden', goal: 1, stat: 'blitzerClean' },
  { id: 'rain1', text: '1 km im Regen fahren', goal: 1000, stat: 'rainDistance' },
];

// ---------------------------------------------------------------------------
// Tesla-Shop (Guthaben aus dem Live-Bereich)
export const SHOP = [
  {
    id: 'boost', icon: '⚡', name: 'Beschleunigungs-Boost', cat: 'Leistung', prices: [300, 700, 1500],
    desc: 'Over-the-Air-Update für mehr Bums. Zieht los wie der Chat bei einer Ortsspende.',
    effect: (l) => `Beschleunigung +${l * 20} %`,
  },
  {
    id: 'vmax', icon: '🏁', name: 'Tempo-Freischaltung', cat: 'Leistung', prices: [400, 900, 1900],
    desc: 'Hebt die Software-Drossel auf. Stufe 3 ist der Performance-Modus.',
    effect: (l) => `Höchstgeschwindigkeit ${[200, 215, 233, 261][l]} km/h`,
  },
  {
    id: 'akku', icon: '🔋', name: 'Akku-Puffer', cat: 'Akku', prices: [350, 800, 1600],
    desc: 'Mehr nutzbare kWh. Offiziell bleibt es natürlich beim 75-kWh-Akku.',
    effect: (l) => `${75 + l * 4} kWh nutzbar`,
  },
  {
    id: 'encoder', icon: '📡', name: 'Stream-Technik-Update', cat: 'Akku', prices: [300, 700, 1400],
    desc: 'Telekom, Vodafone und O₂ werden effizienter gebündelt. Die Technik im Kofferraum frisst weniger Strom.',
    effect: (l) => `Stromverbrauch der Stream-Technik −${l * 15} %`,
  },
  {
    id: 'reifen', icon: '🛞', name: 'Sportreifen', cat: 'Fahrwerk', prices: [350, 900],
    desc: 'Mehr Grip für schnelle Spurwechsel, auch bei Regen.',
    effect: (l) => `Spurwechsel +${l * 12} %, besserer Nassgrip`,
  },
  {
    id: 'polster', icon: '🧸', name: 'Plüsch-Polster', cat: 'Fahrwerk', prices: [500, 1300],
    desc: 'Rundum-Polsterung aus original Mini-Adam-Plüsch. Steckt einen Rempler mehr weg.',
    effect: (l) => `${3 + l} Karosserie-Punkte`,
  },
  {
    id: 'wischer', icon: '🌧️', name: 'Wischer-Firmware (Beta)', cat: 'Sicht', prices: [250, 600, 1200],
    desc: 'Der automatische Wischer wischt jetzt manchmal. Manchmal. Zucken bleibt Kult.',
    effect: (l) => ['Version 0.1 Beta: zuckt nur', 'Version 11.1 Beta: wischt ab und zu', 'Version 11.2 Beta: wischt öfter', 'Version 12 (immer noch Beta)'][l],
  },
  {
    id: 'megafon', icon: '📢', name: 'Megafon', cat: 'Spaß', prices: [450],
    desc: 'Wie in Gifhorn: Mit einer Megafon-Durchsage macht der Verkehr vor dir Platz. Taste H.',
    effect: () => 'Autos vor dir wechseln die Spur',
  },
  {
    id: 'starlink', icon: '🛰️', name: 'Starlink-Schüssel', cat: 'Spaß', prices: [1100],
    desc: 'Wie beim ersten Starlink-IRL-Stream der Welt: keine Funklöcher, mehr Zuschauer, mehr Spenden.',
    effect: () => 'Keine Funklöcher, +25 % Zuschauer, +20 % Spenden',
  },
  {
    id: 'linksspur', icon: '⬅️', name: 'Linke-Spur-Sammelaktion', cat: 'Spaß', prices: [400, 1000],
    desc: 'Die Community sammelt fleißiger: Die linke Spur wird öfter freigeschaltet und zahlt besser.',
    effect: (l) => `Linke-Spur-Bonus +${l * 25} %, häufiger`,
  },
  {
    id: 'elsa', icon: '👑', name: 'Wackel-Elsa', cat: 'Deko', prices: [120],
    desc: 'Das Spirit-Animal von SkylineTV LIVE als Wackelfigur fürs Armaturenbrett.',
    effect: () => 'Wackelt bei jeder Kurve mit',
  },
  {
    id: 'weste', icon: '🦺', name: 'Warnweste', cat: 'Deko', prices: [90],
    desc: 'Für Mini Adam. Bringt nichts, sieht aber sehr professionell aus.',
    effect: () => 'Sichtbar beim Drohnenflug',
  },
  {
    id: 'konfetti', icon: '🎉', name: 'Konfetti-Kanone', cat: 'Deko', prices: [200],
    desc: 'Knallt bei jedem erreichten Ziel. Ein paar Schnipsel kleben danach an der Scheibe – wie 2022.',
    effect: () => 'Konfetti bei Navi-Zielen',
  },
];

export const UPGRADE_LIMITS = Object.fromEntries(SHOP.map((s) => [s.id, s.prices.length]));

// Abspann-Crew
export const ABSPANN_CREW = [
  ['Fahrer', 'Mini Adam'],
  ['Kamera', 'stationär'],
  ['Drohne', 'die Drohne'],
  ['Sprachstudio', 'das Sprachstudio'],
  ['Scheibenwischer', 'Auto-Wischer (Beta)'],
  ['Navigation', 'ferngesteuert vom Chat'],
];

export function randomDonation(min = 1, max = 30) {
  const v = rand(min, max);
  if (chance(0.15)) return 13.69;
  if (chance(0.1)) return 3.33;
  return Math.round(v * 100) / 100;
}
