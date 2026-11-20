// Alle Texte, Insider und Spieldaten an einem Ort.
// Quellen der Insider: SkylineTV LIVE Wiki (siehe INSIDER.md im Repo).
import { pick, randInt, chance, fmtEuro, fmtCent } from './util.js';

export const GAME_TITLE = 'Mini Adam';
export const GAME_SUBTITLE = 'Tesla-Navi ferngesteuert';
export const TAGLINE = 'Live-Eskalationen immer woanders!';
// Die beiden Modi (src/mode.js) auf dem Titelbildschirm: title steht als Untertitel auf dem Titel des Modus selbst,
// badge daneben als Schildchen; icon, name und sub (die kleine Zeile darunter) bilden den Eintrag, der vom Titel des
// anderen Modus dorthin führt. Die Reise ist eine Vorschau, solange an ihr gebaut wird – das sagt sie selbst.
export const MODE_TEXT = {
  klassik: { title: GAME_SUBTITLE, icon: '🛣️', name: 'Klassik', sub: 'die endlose Autobahn' },
  xxl: { title: 'Navi ferngesteuert XXL', badge: '🚧 Vorschau – hier wird noch gebaut', icon: '🧭', name: 'Navi ferngesteuert XXL', sub: 'Vorschau – hier wird noch gebaut' },
};

// ---------------------------------------------------------------------------
// Navi-Ziele aus echten „Tesla ferngesteuert“-Streams (plus ein paar Insider)
// km: [min, max] Spiel-Kilometer bis zum Ziel, special: besondere Ankunft
export const NAVI_TARGETS = [
  { name: 'Tesla Supercharger Erlensee', short: 'Supercharger Erlensee', note: 'Hier begann am 30.01.2021 das allererste Navi-Experiment.', km: [1.6, 3.2] },
  { name: 'Hochofenwerk Phoenix West, Dortmund', short: 'Phoenix West', note: 'Ziel des ersten Navi-Streams (429,16 km).', km: [2.2, 4.0] },
  { name: 'Burg Hauneck, Haunetal', note: 'Das erste Ziel, das 2022 wirklich erreicht wurde.', km: [1.8, 3.4] },
  { name: 'Megahub Lehrte', note: 'Güterbahnhof. Der Chat war erleichtert.', km: [1.8, 3.6] },
  { name: 'Arnhem (Niederlande)', note: 'Kurz mal Ausland.', km: [2.5, 4.6] },
  { name: 'Gifhorn, Supermarkt-Parkplatz', note: 'Historisch bedeutsam. Polizei Gifhorn grüßt.', km: [2.0, 3.8], special: 'gifhorn' },
  { name: 'Liberec (Tschechien)', note: 'Ziemlich weit. Wird bestimmt gleich überboten.', km: [6.0, 8.5] },
  { name: 'Wartburg, Eisenach', note: 'Dort gibt es einen Automaten mit 0-Euro-Geldscheinen.', km: [1.8, 3.5] },
  { name: 'Drive-In: Pommes ohne Rückfragen', note: 'Die legendäre Drive-In-Wette.', km: [1.4, 2.6], special: 'pommes' },
  { name: 'Malte in Norderstedt abholen', short: 'Malte abholen', note: 'Die Bahn fällt mal wieder aus.', km: [2.6, 4.8], special: 'malte' },
  { name: 'Burg Ronneburg', note: 'Burgen gehen immer.', km: [1.6, 3.0] },
  { name: 'Rastplatz Schäferborn Ost', short: 'Schäferborn Ost', note: 'Endstation der dritten Navi-Runde.', km: [1.4, 2.8] },
  { name: 'Weser-Skywalk, Beverungen', note: 'Aussicht mit Wackelfaktor.', km: [2.0, 3.6] },
  { name: 'Ladepark Kirchheim', note: 'Strom tanken mit Stil.', km: [1.5, 3.0], special: 'charger' },
  { name: 'Tesla Supercharger Mogendorf', short: 'Supercharger Mogendorf', note: 'Hier endete die 723-km-Tour 2021.', km: [1.8, 3.2], special: 'charger' },
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
  { name: 'Bischofsheim in der Rhön (Satelliten-Stream)', note: 'Hier lief der erste IRL-Stream über Satellit.', km: [2.2, 3.8] },
  { name: 'Dortmund – die richtige Currywurstbude', note: 'Diesmal ganz sicher die richtige.', km: [1.8, 3.2], special: 'bude' },
  { name: 'Ein sehr schöner Brunnen', note: 'Für eine neue Folge BrunnenTV.', km: [1.4, 2.8], special: 'brunnen' },
  { name: 'Meister Pünktlich abholen', note: 'Er ist ganz bestimmt gleich da.', km: [1.6, 3.0], special: 'propper' },
  { name: 'Bank am Markt (Farbe prüfen)', note: 'Der Wissenschaftliche Dienst braucht Daten.', km: [1.4, 2.6], special: 'sparkasse' },
];

export const BANK_FARBEN = ['rot', 'blau', 'weiß', 'rot (wie immer)', 'überraschend orange'];

// Navi ferngesteuert XXL: Dort wird auf die echten Orte der Karte geboten (src/game/navi.js WorldNavi). Die Insider
// der Liste oben hängen an ihrem Ort – Schlüssel wie in der Karte (places[].key; tools/journey-test.mjs prüft jeden).
// special: besondere Ankunft (Game.onArrive) · note: Zeile unter dem Hinweis aufs neue Ziel.
// Nicht dabei, weil die Karte den Ort nicht hat oder die Welt das Ding dort nicht baut: Megahub Lehrte, Liberec,
// Burg Ronneburg, Schäferborn Ost, der Drive-In und die Farbe der Bank am Markt.
export const INSIDER_ORTE = {
  Kassel: { special: 'elsa', note: 'Elsa besuchen, das Spirit-Animal von SkylineTV LIVE.' },
  Dortmund: { special: 'bude', note: 'Zur richtigen Currywurstbude. Diesmal ganz sicher. Und Phoenix West liegt auch hier.' },
  Norderstedt: { special: 'malte', note: 'Malte abholen. Die Bahn fällt mal wieder aus.' },
  Gifhorn: { special: 'gifhorn', note: 'Zum Supermarkt-Parkplatz. Historisch bedeutsam.' },
  Siegen: { special: 'siegen', note: 'Wurde schon oft gespendet. Setzt sich fast nie durch.' },
  Eisenach: { note: 'Zur Wartburg: Dort gibt es einen Automaten mit 0-Euro-Geldscheinen.' },
  Haunetal: { note: 'Zur Burg Hauneck, dem ersten Ziel, das 2022 wirklich erreicht wurde.' },
  Beverungen: { note: 'Zum Weser-Skywalk: Aussicht mit Wackelfaktor.' },
};

// ---------------------------------------------------------------------------
// Zuschauernamen (frei erfunden)
const NAME_A = ['Ebbelwoi', 'Handkäs', 'Brunnen', 'Schnitzel', 'Navi', 'Plüsch', 'Kürbis', 'Elsa', 'Kaffeekassen',
  'Blinker', 'Wischer', 'Kassel', 'Fulda', 'Gifhorn', 'Mainz', 'Rasthof', 'Akku', 'Supercharger', 'Dampfcola',
  'Bananensaft', 'Kanalpunkte', 'Pommes', 'Funkloch', 'Drohnen', 'Satelliten', 'Spurwechsel', 'Autobahn',
  'Leitplanken', 'Ortsspenden', 'Rahmen', 'FullHD', 'Konfetti', 'Megafon', 'Ringtennis', 'Pandamützen'];
const NAME_B = ['_FFM', '77', '_HD', '3000', '333', '_Fan', 'fahrer', 'freund', 'hesse', '_LIVE', '42', '_93',
  'könig', 'prinzessin', 'opa', 'tante', 'kumpel', '_VIP', '2017', 'liebe', 'meister', '_on_tour', '1337', 'xd'];

export function viewerName() {
  return pick(NAME_A) + pick(NAME_B);
}

/**
 * Für schmale Chats (Handy hochkant): eine Umbruchstelle zwischen den beiden Namensteilen, damit ein langer Name
 * wie „Superchargerprinzessin“ als „Supercharger-“ / „prinzessin“ umbricht statt irgendwo mitten im Wort. Ein
 * weiches Trennzeichen erscheint nur, wenn dort wirklich umbrochen wird; vor „_FFM“ oder „3000“ ohne Strich.
 */
export function nameBreak(name) {
  let a = '';
  for (const p of NAME_A) if (p.length > a.length && p.length < name.length && name.startsWith(p)) a = p;
  if (!a) return name;
  const rest = name.slice(a.length);
  return a + (/^[a-zäöüß]/.test(rest) ? '\u00ad' : '\u200b') + rest;
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
// Die Stream-Kasse: woher das Geld kommt (Zeilen der Abrechnung, in dieser Reihenfolge) und das kurze Wort, das bei
// einer Gutschrift neben dem Betrag aufblitzt. Geld gibt es nur vom Publikum – gerechnet wird in game/economy.js.
export const INCOME = {
  Spenden: 'Spende',
  Ortsspenden: 'Ortsspende',
  'Navi-Gebote': 'Navi-Gebot',
  Abos: 'Abo',
  'VIP-Abos': 'VIP-Abo',
  Sprachdurchsagen: 'Durchsage',
  Rahmen: 'Rahmen',
  Aktionen: 'Aktion',
  Sammelaktionen: 'Sammelaktion',
  Challenges: 'Challenge',
};
// Abzüge stehen in der Abrechnung ganz unten
export const FINES = ['Bußgeld', 'Verwarngeld', 'Reparaturen'];

/**
 * Reise: An jedem erreichten Ziel kommt die Werkstatt-Rechnung der Runde (game.js settleRound). bump: Euro je
 * zählendem Rempler (ein Karosserie-Punkt, so viel wie ein gewöhnliches Siegergebot), mark: je neuer Kratzspur von der
 * Leitplanke (höchstens drei je Seite, damage.js). Bezahlt wird aus der Stream-Kasse in ganzen Euro; was sie nicht
 * hergibt, erlässt die Werkstatt. Wann die Fahrt in der Werkstatt endet (keine Punkte mehr), bleibt, wie es ist.
 */
export const REPARATUR = { bump: 150, mark: 25 };

// Wofür gespendet wird (etwa jede dritte Spende nennt einen Zweck)
export const SPENDEN_ZWECKE = [
  'eine Runde Bananensaft', 'neue Wischerblätter', 'Strom für den Tesla', 'die Kaffeekasse im Sprachstudio',
  'ein Eis für Mini Adam', 'Plüsch-Shampoo', 'eine Dose Pfefferminz', 'die nächste Pandamütze', 'Popcorn an der Ladesäule',
  'ein neues HDMI-Kabel', 'ein Putztuch für Elsas Krone', 'den Brunnen-Fonds', 'Konfetti-Nachschub', 'die Waschstraße',
  'Meister Pünktlichs Wecker', 'Maltes Bahnticket', 'Pommes ohne Rückfragen', 'einen Ringtennis-Ring',
  'frische 0-Euro-Scheine', 'ein Lob an den Wischer', 'Kaffee für die Polizei Gifhorn', 'Akku-Streicheleinheiten',
  'noch mehr Rahmen', 'das Kappen-Bügeleisen', 'die Drohnen-Akkus', 'einen Blumenstrauß fürs Navi',
  'die richtige Currywurstbude', 'Sitzheizung für alle', 'eine Fusselrolle', 'gute Laune',
];

// Aktionen, die Zuschauer im Live-Bereich kaufen (needs: nur mit diesem Upgrade an Bord)
export const AKTIONEN = [
  { id: 'trunk', name: 'Kofferraum öffnen', price: 5 },
  { id: 'hupe', name: 'Einmal hupen', price: 2 },
  { id: 'megafon', name: 'Megafon-Wunsch', price: 4, needs: 'megafon' },
];
// Was Brüll-William dann durchs Megafon ruft
export const MEGAFON_WUENSCHE = [
  'Achtung, Achtung! Der Chat wünscht allen eine gute Fahrt!',
  'Hier spricht Mini Adam. Bitte einmal freundlich winken!',
  'Durchsage vom Chat: Wer einen Brunnen sieht, bitte hupen!',
  'Achtung! Hier fährt ein Plüschtier. Bitte nicht streicheln!',
];

// Sammelaktionen: Der Chat legt zusammen, bis das Ziel erreicht ist – dann passiert es
export const SAMMELAKTIONEN = [
  { id: 'konfetti', name: 'Konfetti-Regen im Tesla' },
  { id: 'hupen', name: 'Hupkonzert' },
  { id: 'kofferraum', name: 'Kofferraum-Party' },
  { id: 'frosch', name: 'Frosch-Alarm' },
  { id: 'polizei', name: 'Ehrenrunde der Polizei Gifhorn' },
];

// ---------------------------------------------------------------------------
// Chat-Sprüche
export const CHAT = {
  ambient: [
    'Grüße aus {city}! 👋', 'Hallo Mini Adam ❤', 'Ist das Bild wirklich Full HD?', 'Wo seid ihr gerade?',
    'Welche Farbe hat die Bank hier?', 'Gibt es in {city} einen Ringtennis-Verein?', 'Rechts fahren, Adam! 😅',
    'Schöne Landschaft heute', 'Wie viel Akku noch?', 'Wann kommt Meister Pünktlich?', 'Malte Malte Malte Malte Malte',
    'Erzähl mal die Raab-Story!', 'Das Bild ist so scharf 😍', 'Elsa ❤🐟', 'BrunnenTV wann?', 'Bananensaft-Pause? 🍌',
    'Kappandramäßige Zusammenfassung bitte, bin grad erst rein', 'Wir sind auf der Autobahn und streamen in Full HD! 🎶',
    'Wohin fahren wir eigentlich?', 'Das Navi-Ziel ändert sich eh gleich wieder', 'Grüße ans Sprachstudio!',
    'Danke an alle Ehrenmenschen 🙏', 'Pfefferminz jemand?', 'Pandamütze aufsetzen!', 'Ich biete 1 Cent mehr 🤑',
    'Was ist eigentlich im Kofferraum?', 'Grüße an die Polizei Gifhorn 👮', 'Welche Autobahn ist das eigentlich?', 'Schöner Tesla 🖤',
    'Der Wischer ist auch nur ein Mensch', 'Nils weiß bestimmt, wann wir das letzte Mal hier waren',
    'Bester Stream der Woche', 'Die Plüsch-Hände am Lenkrad 😂', 'Gleich kommt bestimmt ein Brunnen',
    'Tesla-Taxi spielen wann?', 'Erster! (nicht)', 'Falsche Bude? 😂', 'Wer hat das Navi so eingestellt',
    'Adam, schreib mal eine Zahl in den Chat', 'Was läuft da im Radio?', 'Live-Eskalationen immer woanders 🔥',
    'Guten Abend zusammen 👋', 'Bin grad von der Arbeit heim, was hab ich verpasst?', 'Hab den Stream auf dem Fernseher, sieht mega aus',
    'Meine Oma guckt mit und lässt grüßen', 'Wie lange geht der Stream heute?', 'Hugo, wie spät ist es?',
    'James hat heute viel zu tun', 'Kanalpunkte sind gespart, was gibt es dafür?', 'Das Ziel stabilisiert sich … oder auch nicht',
    'Mini Adam, wink mal! 🧸', 'Die Kappe sitzt heute perfekt', 'Kommt gleich eine Raststätte?', 'Wer ist noch aus Hessen hier?',
    'erster stream für mich, wie geht das mit dem navi?', 'Einfach 1 Cent mehr bieten, dann gehört das Navi dir 😂',
    'Das Lenkrad ist größer als Mini Adam', 'NOMI guckt so lieb', 'Wann wieder Drohne?', 'Supercharger wann?',
    'Mein Handy-Akku: 4 %. Eurer?', 'Chat, benehmt euch, Gifhorn liest mit', 'Schöne Grüße aus dem Homeoffice',
    'Ich sollte schlafen, aber das hier ist wichtiger', 'Bild und Ton synchron, ich bin beeindruckt',
    'Bin kurz Getränke holen, bitte nichts Spannendes machen!', 'Ebbelwoi steht kalt 🍏', 'Kriegt das Navi eigentlich Provision? 😂',
    'Läuft bei mir im Zweitfenster, Chef guckt nicht', 'Wer fährt eigentlich, wenn Mini Adam schläft?',
    'Danke fürs Vorlesen, Sprachstudio! 🎧', 'Feierabend, Snacks, Navi-Stream. Mehr brauch ich nicht.',
  ],
  // Die heimliche Chat-Stimmung färbt das Geplauder: ausgelassen bei guter Laune …
  cheerful: [
    'Bester Stream seit Langem 😍', 'ICH LIEBE DIESE FAHRT', 'So muss Autobahn!', 'Mini Adam fährt wie ein Meister 🧸',
    'Der Tesla schnurrt 🖤', 'Kann das bitte ewig so weitergehen?', 'Chat ist on fire 🔥', 'Hab Popcorn geholt 🍿',
    'Mein Kaffee wird kalt, egal', 'Das ist besser als Fernsehen', 'Wer jetzt abschaltet, verpasst was', 'STIMMUNG!!! 🎉',
    'Meine Katze guckt auch zu 🐈', 'Ehrenfahrt 🙏', 'Gänsehaut vom Blinker', 'Einfach schön hier ❤',
    'LIVE-ESKALATION 🔥', 'Das Plüsch glänzt heute besonders', 'bin so froh das ich eingeschalten hab',
    'Ganz großes Kino', 'Was für ein Abend!', 'Die Nachbarn fragen, warum ich jubel', 'Ich bleib bis zum Abspann',
    'Heute stimmt einfach alles', 'Mini Adam fährt, der Chat lenkt. So muss das ❤', 'Das wird ein Highlight-Clip, wetten? 🎬',
    'Ich kann nicht mehr 😂😂😂',
  ],
  // … und unruhig, wenn zu wenig passiert
  restless: [
    'Passiert heute noch was? 😴', 'Bin kurz Tee kochen', 'Ist das eine Wiederholung?', 'Ich zähl schon Leitpfosten',
    'Überhol doch mal 🙈', 'gähn', 'Wann wird wieder gehupt?', 'Sogar die Laster haben heute mehr Schwung',
    'Kann mal jemand das Navi ärgern?', 'Kommen wir heute noch an?', 'Hallo? Jemand da?', 'Ich guck solange aus dem Fenster',
    'Schneller, die Pommes werden kalt 🍟', 'Chat schläft 💤', 'Weckt mich, wenn ein Brunnen kommt',
    'Hab nebenbei schon aufgeräumt', 'Bisschen mehr Strom geben? ⚡', 'Selbst der Wischer langweilt sich',
    'laaangsam', 'Da hinten überholt uns eine Schnecke 🐌', 'Gibt es heute noch Eskalation?', 'zzz',
    'Meine Geduld ist auch nur ein Akku 🔋', 'Ich frag jetzt zum dritten Mal: Wohin fahren wir?', 'Ich mecker nur, weil ich euch mag',
    'Können wir bitte irgendwo ankommen? Egal wo.',
  ],
  // im Regen ist der Chat besonders gesprächig
  rain: ['Schmuddelwetter 🌧', 'Bei dem Wetter bleib ich im Chat', 'Regen-Stream = bester Stream', 'Der Wischer hat Lampenfieber',
    'Die Scheibe sieht aus wie mein Aquarium', 'Platsch!', 'Gemütlich bei euch im Tesla ☔', 'Ich hör den Regen bis hierher',
    'Wisch! … oder auch nicht 😂', 'Tropfen zählen: 1, 2, viele'],
  // jemand ist zum ersten Mal da – das Sprachstudio begrüßt ihn dann mit Namen
  newViewer: ['Hallo! Bin zum ersten Mal hier 👋', 'Hi, bin neu. Warum fährt da ein Plüschtier? 😄',
    'Moin aus {city}! Hab euch eben beim Zappen gefunden', 'Neu hier und schon Fan von NOMI 😍',
    'Ein Kumpel hat mir den Stream empfohlen. Hallo zusammen!'],
  // Abos und VIP
  sub: ['ABO! 🎉', 'Willkommen im Club ❤', 'Neuer Abonnent, hurra!', 'Abo-Hype!', 'Danke fürs Abo!',
    'Wieder einer mehr in der Familie', 'Abo-Alarm 🚨', 'Herzlich willkommen 👋'],
  subGift: ['GESCHENKE! 🎁', 'Ich hab eins bekommen, DANKE ❤', 'Abo-Regen 🎁🎁🎁', 'Bescherung im Chat!',
    'Hab leider keins abbekommen 😅', 'So spendabel heute!', 'Der Abspann wird heute lang 🎬',
    'Wer die meisten verschenkt, steht im Abspann ganz oben 👀', 'Geschenktes Abo da, ab jetzt meckere ich mit Abzeichen 😌'],
  vip: ['Neuer VIP 👑', 'Die VIP-Lounge wird voll', 'Willkommen im Live-Bereich!', 'VIP! Mit rotem Teppich bitte',
    'VIPs dürfen zuerst einsteigen', 'Krone richten, VIP ist da 👑', 'Die VIPs sehen auf der Live-Karte längst, wo es hingeht 😂',
    'Jederzeit kündbar. Hab ich gehört. Nie ausprobiert.'],
  thanks: ['Danke!', 'Ehrenmensch 🙏', 'Bimmel hurra!', '❤', 'Danke für die Spende!', 'Stark 💪',
    'Spendierhosen an 👖', 'James kommt ins Schwitzen', 'Danke im Namen des Akkus ⚡', 'Danke fürs Strom-Sponsoring 🔌'],
  // genau 4 €: Ab diesem Betrag gab es im Stream eine Dankeseinblendung
  einblendung: ['Genau 4 €, da kennt jemand die Einblendungsgrenze 😂', 'Exakt 4 €. Profi. Die Einblendung ist gesichert 😎'],
  ortsspende: ['Ortsspenden-Zeit! 💶', 'Jetzt klingelt die Kasse', 'Für die schöne Ankunft ❤', 'Ortsspende geht raus!',
    'Dafür hat sich die Fahrt gelohnt', 'Die Ortskasse freut sich', 'Angekommen, jetzt wird gespendet 😂'],
  // Navi-Gebote
  bidChaos: ['Ich leg einen Cent drauf 🤑', '1 CENT!', 'Und noch ein Cent', 'Cent-Krieg 😂', 'Das Navi dreht durch',
    'Wohin denn jetzt?!', 'Mein Cent, mein Ziel', 'Überboten in 2 Sekunden lol', 'Bieter-Chaos! 🍿',
    'Ich komm nicht mehr mit', 'Das Navi braucht Urlaub', 'Jeder Cent zählt 💶', 'Route wird neu berechnet. Schon wieder.',
    'Schnell ein Screenshot, bevor der nächste Cent kommt 📸', 'Noch ein Cent und wir drehen um 👀'],
  bidDuel: ['DUELL! 🍿', 'Zwei Sturköpfe, ein Navi 😂', 'Die schaukeln sich hoch', 'Wer gibt zuerst auf?',
    'Ich setz auf den Zweiten', 'Das wird teuer 💸', 'Keiner gibt nach!', 'Bitte weiterbieten, ist gut für die Kasse',
    'Wer überbietet, zahlt. Wer überboten wird, auch 😂'],
  bidDuelEnd: ['Und Ruhe im Karton', 'Duell vorbei, Geldbeutel leer 😅', 'Respekt an beide', 'Abpfiff! Schönes Duell',
    'Das war sportlich'],
  // nach dem Chaos bleibt ein Ziel endlich stehen
  bidCalm: ['Endlich ein Ziel mit Sitzfleisch 🙏', 'Ziel stabil. Vorerst.', 'Bleibt es jetzt dabei?', 'Ruhe im Navi. Verdächtig.',
    'Na also, wir haben ein Ziel'],
  bidBig: ['WAS?! 😱', 'Da meint es jemand ernst', 'Jetzt traut sich keiner mehr', 'Ansage!',
    'Das Ziel steht jetzt wohl fest', 'So viel für ein Navi-Ziel 😂', 'Wer legt 100 € drauf? Mehr geht auf einmal ja nicht'],
  // Reise: Dort wird in Zehnern geboten, bis in die Hunderte (Chaos am Anfang der Runde, großes Gebot; je Zeile wie
  // bidChaos und bidBig, so zieht der Chat gleich viele Zufallszahlen)
  zehnerChaos: ['Zehner drauf! 🤑', '+10 €!', 'Und noch ein Zehner', 'Zehner-Krieg 😂', 'Das Navi dreht durch',
    'Wohin denn jetzt?!', 'Mein Zehner, mein Ziel', 'Überboten in 2 Sekunden lol', 'Bieter-Chaos! 🍿',
    'Ich komm nicht mehr mit', 'Das Navi braucht Urlaub', 'Jeder Zehner zählt 💶', 'Route wird neu berechnet. Schon wieder.',
    'Schnell ein Screenshot, bevor der nächste Zehner kommt 📸', 'Noch ein Zehner und wir drehen um 👀'],
  zehnerGross: ['WAS?! 😱', 'Da meint es jemand ernst', 'Jetzt traut sich keiner mehr', 'Ansage!',
    'Das Ziel steht jetzt wohl fest', 'So viel für ein Navi-Ziel 😂', 'Gleich ein paar Hunderter auf einmal 💸'],
  // BontanaBack (Reise, ausgedachter Großbieter): Der Chat dreht durch, er selbst sagt wenig, wer vorn lag, hält tapfer
  // dagegen, und am Ende steht die Summe
  bontana: ['BONTANA ESKALIERT 🔥', 'BontanaBack ist da!!', 'Wie viel?! 😱', 'Der Chat brennt 🔥', 'Das Navi zittert',
    'Ich kann nicht mehr 😂', 'Bontana-Modus aktiviert 💸', 'Schnell ein Screenshot 📸', 'Was passiert hier gerade',
    'Hunderter fliegen durch den Chat', 'Der meint das ernst 😳', 'Mini Adam, schau dir das an!'],
  bontanaSelbst: ['Ich lege nach 😎', 'Gute Fahrt, Mini Adam! 💸', 'Das Ziel gefällt mir', 'Da fahren wir hin 😎'],
  bontanaKonter: ['Der traut sich was!', 'Einfach dagegenhalten 😂', 'Mutig!', '+10 € gegen Bontana lol',
    'David gegen Goliath', 'Nicht aufgeben!', 'Ehrenmann, hält dagegen'],
  // sein Schlusswort beim letzten Gebot, je Auftritt des Streams eins (BONTANA.max = 2)
  bontanaSchluss: ['Mein letztes Gebot. Gute Fahrt, Mini Adam! 😎', 'So, und jetzt ab dahin 💸'],
  bontanaEnde: ['BONTANA ESKALIERT 🔥🔥🔥', 'Gekauft. Das Ziel gehört ihm.', 'Das war’s, Leute 😂', 'Legendär',
    'Danke BontanaBack! 💸', 'Ich hab Gänsehaut', 'Das Navi braucht jetzt eine Pause', 'Und das an einem Dienstag 😂'],
  // Zufriedenheit des Chats (Reise, satisfaction.js): zufrieden klingt er flott, unzufrieden ruft er nach Tempo – nie
  // gemein
  flott: ['Das geht ja zack zack 🏎️', 'So macht Reisen Spaß', 'Mini Adam liefert!', 'Ziel um Ziel, sehr stark',
    'Tempo! Ich liebe es', 'Das Navi kommt kaum hinterher 😂', 'Der Chat ist zufrieden 😌', 'Läuft heute 👌',
    'Schon wieder ein Ziel geschafft?!', 'Reisen mit Mini Adam = Express 🚄', 'Die Bieter kommen gar nicht hinterher',
    'Bestes Roadtrip-Tempo'],
  schneller: ['Schneller! 😩', 'Wann sind wir da?', 'Gib Gas, Mini Adam!', 'Das dauert ja ewig', 'Ich schlaf gleich ein 😴',
    'Bitte etwas zügiger 🙏', 'Sind wir bald da?', 'Das Navi wartet auf dich 😅', 'Das Ziel läuft uns nicht weg … oder? 😅',
    'Ein bisschen mehr Tempo bitte', 'Mein Popcorn ist schon alle 🍿', 'Gleich überholt uns ein Traktor 🚜'],
  // Werkstatt-Rechnung am Ziel (Reise): freundlich, die Werkstatt gehört dazu – und wer heil ankommt, wird gefeiert
  reparatur: ['Die Werkstatt freut sich 😅', 'Ein bisschen Spachtel, ein bisschen Liebe', 'Beulen gehören dazu',
    'Hauptsache, Mini Adam ist gut angekommen ❤', 'Gut, dass der Chat zusammenlegt 😂', 'Neue Beule, neue Geschichte',
    'Die Plüsch-Hände sind heil, das zählt 🧸'],
  heil: ['Keine Kratzer, keine Rechnung ✨', 'Sauber gefahren!', 'Die Werkstatt hat heute frei 😎',
    'Ohne eine Schramme 👏', 'Der Lack glänzt noch'],
  // am Ziel vorbeigefahren (kommt mit der Karte und ihren echten Ausfahrten)
  missedTarget: ['Die Ausfahrt war DA 😭', 'Vorbei … so nah dran', 'Das Navi weint leise', 'Nächste Ausfahrt dann, ja?',
    'Zu flott für die Ausfahrt 😅', 'Tschüss, schönes Ziel 👋'],
  bidLate: ['KURZ VORM ZIEL 😭', 'Nein!!! So knapp', 'Das war gemein 😂', 'Chat, wir waren fast da. FAST.',
    'Ich konnte das Ziel schon sehen 😭', 'Auf den letzten Metern überboten', 'Last-Minute-Gebot. Frech, aber Königsdisziplin 👑'],
  // Challenges („Wenn …, spende ich …“) – {wenn} und {betrag} kommen vom Job
  pledge: ['Wenn {wenn}, spende ich {betrag}!', '{betrag} von mir, wenn {wenn} 🤝', 'Challenge: {betrag}, wenn {wenn}',
    'Ich leg {betrag} drauf, wenn {wenn}', 'Deal: {betrag} in die Kasse, sobald {wenn}'],
  speedMark: ['{kmh} km/h! 🚀', 'Tempo {kmh}, festhalten!', '{kmh}!!! Der Akku weint', 'Uiuiui, {kmh} Sachen',
    'Tacho sagt {kmh} 👀', '{kmh} km/h und das Plüsch flattert'],
  stuck: ['Wir kleben am Vordermann 😅', 'Überholen wäre eine Idee', 'Schöne Rückleuchten, aber …',
    'Der vor uns hat es nicht eilig', 'Ich kenn sein Kennzeichen schon auswendig'],
  clean: ['Sauber gefahren 👌', 'Kein Kratzer, top!', 'Fahrschule Mini Adam', 'So fährt ein Profi', 'Lack wie neu ✨'],
  sammel: ['Ich geb was dazu!', 'Das schaffen wir 💪', 'Sammelaktion, los los!', 'Jeder Euro zählt', 'Bin dabei!'],
  sammelDone: ['Ziel erreicht, Aktion läuft! 🎉', 'Chat-Power 💪', 'Teamarbeit!', 'Das war es wert 😂', 'Zusammen schaffen wir alles',
    'Claudia kann abhaken ✔️'],
  leftLane: ['LINKS IST FREI!!! ⬅️', 'Endlich linke Spur 🚀', 'Gib ihm!', 'Eine Minute Freiheit!', 'Danke für die Freischaltung!',
    '⬅️⬅️⬅️', 'Jetzt aber links!', 'Linke Spur, Baby!'],
  leftLaneEnd: ['Und wieder rechts 😅', 'Rechtsfahrgebot!', 'War schön, solange es ging', 'Nochmal freischalten!'],
  // die Spur ist bezahlt – und Mini Adam bleibt rechts: Erst meldet sich, wer gespendet hat, dann der Rest
  leftLaneDonor: ['Wofür hab ich gespendet? 😅', 'Ich hab die Spur bezahlt, also rüber da ⬅️', 'Meine schöne Spur, und keiner fährt drauf',
    'Hallo? Das war meine Spende da links 👀', 'Die linke Spur kommt von Herzen. Bitte benutzen!'],
  leftLaneTease: ['Links ist frei, Mini Adam!', 'Einmal nach links für den Chat? 🙏', 'Links ist noch Platz für einen Tesla',
    'Da links wartet eine ganze Spur auf dich', 'Blinker links, bitte', 'Nicht so schüchtern, rüber!',
    'Die Spende guckt schon ganz traurig'],
  leftLaneUsed: ['Das hat sich gelohnt 🚀', 'So nutzt man eine Freischaltung!', 'Gut angelegtes Geld', 'Links war schön ❤',
    'Gleich nochmal freischalten!', 'Dafür spende ich gern'],
  leftLaneIgnored: ['Schade um die schöne Spur 😅', 'Nächstes Mal dann links, ja?', 'Die linke Spur fühlt sich übersehen',
    'Na gut, dann halt rechts', 'Die Minute hätte ich auch gern gehabt'],
  naviChanged: ['Wer war das? 😂', 'Nicht schon wieder!', 'Überboten! 🤑', 'Navi ferngesteuert 🔥', 'Wendemanöver incoming',
    'Das Navi weiß auch nicht mehr weiter', 'Kaum gewöhnt man sich an ein Ziel …', 'Klassiker', 'Jetzt aber wirklich!', 'NEIN 😂',
    'Und das Navi stellt schon wieder um 😂', 'Ziel weg, Geld auch weg. Ich liebe dieses Format',
    '30 Sekunden hat mein Ziel gehalten. War schön.'],
  naviReached: ['ANGEKOMMEN! 🎉', 'Geschafft!!!', 'Und jetzt?', 'Gibt es hier einen Brunnen?', 'Wo ist der Guide?', 'Ziel erreicht 🏁'],
  // Navi ferngesteuert XXL: Ziele sind echte Orte, die Fahrt dorthin dauert Minuten, gewendet wird nur über eine
  // Ausfahrt, und jede Ankunft endet am Brunnen des Orts
  ortChanged: ['Wer war das? 😂', 'Nicht schon wieder!', 'Überboten! 🤑', 'Navi ferngesteuert 🔥',
    'Das Navi weiß auch nicht mehr weiter', 'Kaum gewöhnt man sich an ein Ziel …', 'Klassiker', 'Jetzt aber wirklich!', 'NEIN 😂',
    'Und das Navi stellt schon wieder um 😂', 'Ziel weg, Geld auch weg. Ich liebe dieses Format',
    'Neuer Ort, neues Glück 🗺️', 'Da wollte ich schon immer mal hin'],
  ortWende: ['Wendemanöver incoming', 'Einmal umdrehen bitte 😂', 'Das liegt ja hinter uns!', 'Nächste Ausfahrt raus und zurück'],
  ortReached: ['ANGEKOMMEN! 🎉', 'Geschafft!!!', 'Ziel erreicht 🏁', 'Vor dem nächsten Gebot da. Stark!', 'Wo ist der Guide?',
    'Und da ist auch schon der Brunnen ⛲', 'Schneller als der Chat bieten kann 😎'],
  // ein Gebot kam, als der Wagen schon durch den Zielort fuhr: kein BrunnenTV, der Chat neckt liebevoll
  brunnenWeg: ['Der Brunnen war schon in Sicht 😭⛲', 'Kein BrunnenTV. So knapp!', 'Winkt dem Brunnen im Vorbeifahren 👋⛲',
    'Der Chat war schneller als der Brunnen 😇', 'Nächstes Mal, Brunnen. Versprochen ❤', 'BrunnenTV fällt heute hier aus 😂',
    'Einmal durch den Ort und weiter. Schön war es trotzdem'],
  // das Ziel wechselte erst im letzten Moment zurück in den Ort: am Brunnen vorbeigerollt, keine Ankunft
  brunnenVorbei: ['Vorbeigerollt! 😂⛲', 'Da war er doch, der Brunnen!', 'Zu schnell für BrunnenTV 😅', 'Der Brunnen winkt hinterher 👋',
    'Knapp daneben ist auch vorbei', 'Der Chat hat sich mal wieder nicht entscheiden können 😇'],
  brunnenTV: ['BRUNNENTV!!! ⛲', 'BrunnenTV! BrunnenTV!', 'Neue Folge BrunnenTV!', 'Herr Schönnbrun, übernehmen Sie!', '⛲⛲⛲',
    'Endlich wieder BrunnenTV ❤', 'Darauf hat der Chat gewartet', 'Was für ein Brunnen!', 'Die Folge speichere ich mir',
    '#BrunnenTV', 'Brunnen gesichtet, Ziel erreicht, alles richtig gemacht'],
  elsaKassel: ['ELSA!!! ❤🐟', 'Elsa ❤', 'Kassel ist Elsa-Stadt 👑🐟', 'Grüß Elsa von uns!'],
  gifhornOrt: ['Gifhorn! Historisch bedeutsam 😂', 'Polizei Gifhorn grüßt bestimmt gleich 👮', 'Wo ist der Supermarkt-Parkplatz?'],
  crash: ['Rezeption!', 'Uff 🙈', 'Das gibt Ärger', 'Polizei Gifhorn ist unterwegs 🚓', 'Blechschaden!', 'Hoffentlich hat das keiner gesehen',
    'Eskalation! 😂', 'Das war die falsche Spur'],
  nearMiss: ['WAS WAR DAS 😱', 'Knapp!!!', 'Millimeterarbeit', 'CLIP!', 'Clip it!', 'Puh…', 'Mutig!'],
  rainStart: ['Regen 🌧', 'Jetzt wird es spannend', 'Wischer.exe reagiert nicht', 'Auto-Wischer (Beta) 😂',
    'Der Herr mit den Schirmen freut sich', 'Regen! Jetzt wird der Chat wach', 'Alle ans Fenster, es regnet 👀'],
  wiper: ['Der Wischer zuckt wieder 😂', 'Der Wischer wischt nicht, der winkt nur', 'Software-Update wann?',
    'Das ist kein Bug, das ist ein Feature', 'Wischer-Firmware 0.1 Beta', 'Mach doch einfach manuell!', 'Der Wischer ist schüchtern',
    'Er will ja, er kann nur nicht 😂', 'Der hängt schon wieder mitten im Bild', 'Gleich schafft er es. Bestimmt.',
    'Die Wischer stehen stramm 🫡', 'Die winken dem Regen nur zu 👋'],
  // der Chat zählt mit: {n} = so oft hat der Wischer auf dieser Fahrt gezuckt, {w} = so oft wirklich gewischt
  wiperCount: ['Zucker Nr. {n} 😂', 'Das war Zucken Nummer {n}, ich führe Liste', '{n}× gezuckt, {w}× gewischt. Läuft.',
    'Wischer-Zähler steht bei {n} 📈', 'Zucken Nr. {n}. Bei 100 gibt es einen Bananensaft 🍌'],
  wiperWipe: ['ER HAT GEWISCHT 🎉', 'Ein ganzer Wisch! Clip!', 'Habt ihr das gesehen? Er kann es doch!',
    'Der Wischer hat heute seinen großen Tag', 'Klare Sicht für drei Sekunden 🥹'],
  wiperPhantom: ['Es regnet doch gar nicht? 😂', 'Der Wischer hat was gehört', 'Phantomregen erkannt', 'Der Wischer träumt',
    'Fehlalarm, weiterfahren'],
  police: ['POLIZEI GIFHORN 🚓', 'Polizei Gifhorn kommt!', 'Benehmen jetzt!', 'Ganz ruhig bleiben…', '👮👮👮'],
  funkloch: ['F', 'F', 'F', 'Ton f', '/cam2', 'F', 'Bild weg?', 'F'],
  funklochBack: ['✔️', '✔️', '✔️ Bild ist wieder da', 'Da ist es wieder ✔️'],
  frog: ['🐸', '🐸🐸', 'Frosch!', '🐸 HDMI-Kabel?'],
  blitzer: ['📸', 'Lächeln! 📸', 'Das Foto kommt in einen Rahmen', 'Tschüss, du Betrüger!', 'Teures Selfie'],
  // nach einem Blitz stichelt ab und zu jemand: ohne Radarwarner mit einem Wink zum Shop, mit ihm erst recht
  radarFehlt: ['Ein Radarwarner hätte jetzt gepiept', 'Im Tesla-Shop gibt es Radarwarner 😏', 'Radarwarner wann? 📟',
    'Mit Radarwarner wäre das nicht passiert'],
  radarTrotz: ['Trotz Radarwarner 😂', 'Der hat doch gepiept?!', 'Gepiept, geblinkt, geblitzt 📟📸',
    'Der Radarwarner hat alles gegeben'],
  elefant: ['Elefantenrennen 🐘🐘', 'Das dauert…', 'Überholverbot wann?', 'Die stehen ja fast'],
  // Mini Adam legt auf der Autobahn den Rückwärtsgang ein
  rueckwaerts: ['Retourgang! Endlich 🎉', 'Rückwärts?! 😂', 'Moonwalk im Tesla 🕺', 'Einmal zurückspulen bitte ⏪',
    'Hast du was vergessen? 😅', 'Rückfahrkamera an, Chat schaut mit 📹', 'Adam parkt auf der Autobahn ein 🅿️',
    'Rückwärts ist auch eine Richtung 😄'],
  trunk: ['Kofferraum auf! 😂', 'Was ist da drin?', 'Bitspende-Eskalation', 'Konfetti im Kofferraum?'],
  brunnen: ['BRUNNENTV!!!', 'Herr Schönnbrun!', 'Brunnen gesichtet! ⛲', 'Neue Folge BrunnenTV!'],
  elsa: ['ELSA!!! ❤🐟', 'Elsa ❤', 'Spirit-Animal gesichtet!', '👑🐟'],
  record: ['REKORD!!! 🎉', 'Neuer Zuschauerrekord!', 'Diesmal ohne Viewer-Bots 🤖', 'Hype!'],
  banana: ['🍌🍌🍌', 'Bananensaft-Power!', 'Lecker 🍌'],
  koriander: ['Bäh, Koriander 🤢', 'Nicht der Koriander!', 'Wer hat da Koriander bestellt?'],
  // Reise: Ladestopp im Ladepark (Game.tickCharge), die Popcorn-Maschine an der Säule und die Saftpause
  popcorn: ['Popcorn-Stream! 🍿', '🍿🍿🍿', 'Haushaltsgeräte an der E-Säule testen 😂', 'Die Säule kann auch Popcorn!', 'Popcorn mit Ökostrom 🔌', 'Salzig oder süß? 🍿'],
  saftpause: ['Bananensaft-Pause! 🍌', 'Prost, Mini Adam! 🍌', 'Zucker tanken 🍌🔋', 'Erst Saft, dann Strom 😄'],
  shoulder: ['Standstreifen?! 😱', 'Polizei Gifhorn!!', 'Das ist keine Fahrspur!'],
  fiveJobs: ['Job erledigt ✅', 'Weiter so!', 'Noch ein Job weniger', 'Versprochen ist versprochen 🤝',
    'Jetzt wird gezahlt 😂', 'Challenge geschafft!'],
  rahmen: ['Schöner Rahmen 😂', 'Ich sehe nichts mehr', 'Bestes Geld ever', 'Danke für den Rahmen!',
    'Ich seh nur noch Rahmen und einen halben Tesla', 'Noch ein Rahmen und wir fahren nach Gehör'],
  // „5 Cent, wenn du …“: ein Meme aus dem Stream. Ein Zuschauer bietet lächerliche 5 Cent für eine Albernheit – immer
  // genau 5 Cent, das ist der Witz. Mini Adam geht nie darauf ein (kein Geld, keine Aufgabe, keine Antwort von NOMI
  // oder dem Sprachstudio); nur der Chat legt noch 2 Cent drauf oder frotzelt. Jedes Angebot höchstens einmal je Stream.
  fuenfCent: [
    '5 Cent, wenn du während der Fahrt den Kopf aus dem Fenster streckst.',
    '5 Cent, wenn du NOMI einmal kitzelst 🤏',
    'Angebot des Tages: 5 Cent für ein Tänzchen mit NOMI 💃',
    '5 Cent, wenn du NOMI beibringst, „Bimmel hurra“ zu sagen',
    '5 Cent, wenn du dem Wischer ein Gute-Nacht-Lied singst',
    '5 Cent wenn du den wischer ab heute zucki nennst',
    '5 Cent, wenn du dem nächsten Brunnen einen Luftkuss zuwirfst 😘',
    '5 Cent, wenn du Herrn Schönnbrun eine Brunnen-Postkarte schickst ⛲',
    '5 Cent, wenn du Elsa um ein Autogramm bittest 👑',
    '5 Cent, wenn du Elsa fragst, wo sie ihre Krone gekauft hat',
    '5 Cent, wenn du bei der Bank anrufst und nach ihrer Farbe fragst',
    '5 Cent, wenn du dem Wissenschaftlichen Dienst einen Farbfächer schenkst 🎨',
    '5 Cent, wenn du dem Navi eine Woche Urlaub gibst 🏖️',
    'Navi rückwärts heißt Ivan. 5 Cent, wenn du es ab jetzt so nennst 😂',
    '5 Cent, wenn du dich beim Navi für jede Neuberechnung bedankst 🙏',
    '5 Cent, wenn du auf der linken Spur einmal laut „Freiheit!“ rufst',
    '5 Cent, wenn du ein Blatt Koriander probierst. EIN Blatt 🌿',
    '5 Cent, wenn du dem nächsten Supercharger ein Kompliment machst ⚡',
    '5 Cent, wenn du im nächsten Funkloch pfeifst. Hört ja keiner 😂',
    '5 Cent, wenn du deinen Bananensaft mit Schirmchen trinkst 🍹',
    '5 Cent, wenn du die Bananensaft-Flasche als Mikrofon benutzt 🍌🎤',
    '5 Cent wenn du die kappe einmal verkehrt rum aufsetzt 🧢',
    '5 Cent, wenn du dir den Bart zu zwei Zöpfchen flechtest',
    '5 Cent, wenn du den Verkehrsfunk ab jetzt selbst sprichst 📻',
    '5 Cent, wenn du der Polizei Gifhorn Kekse anbietest 🍪',
    '5 Cent, wenn du zum Tesla „Braves Auto“ sagst 🖤',
    '5 Cent, wenn du ab jetzt nur noch in Reimen sprichst',
    '5 Cent, wenn du den nächsten Lade-Ring als Hula-Hoop-Reifen benutzt',
    '5 Cent, wenn du eine Zahl ganz ohne Drei in den Chat schreibst 🤓',
    '5 Cent, wenn du den nächsten Rahmen selbst bastelst ✂️',
    '5 Cent, wenn du die Warnweste über die Kappe ziehst 🦺',
    '5 Cent, wenn du dem Satelliten da oben zuwinkst 🛰️',
    '5 Cent, wenn du die Sitzheizung auf Pizza-Stufe stellst 🍕',
    '5 Cent, wenn du dem Akku gut zuredest, damit er durchhält 🔋',
    '5 Cent, wenn du die nächsten zehn Leitpfosten mit Vornamen grüßt',
    '5 Cent, wenn du der Stream-Technik im Kofferraum einen Witz erzählst',
    '5 Cent, wenn du jedem überholten Lkw einen schönen Tag wünschst',
    'Mein letztes Kleingeld: 5 Cent, wenn du wie ein Pirat sprichst. Arrr!',
  ],
  // … und passend zur Lage: nur, wenn es das in diesem Moment wirklich gibt (siehe Game.offerSituation)
  fuenfCentLage: {
    regen: ['5 Cent, wenn du jedem Regentropfen einzeln Hallo sagst 🌧', '5 Cent, wenn du dem Wischer im Takt „Hau ruck!“ zurufst',
      '5 Cent, wenn du die Tropfen auf der Scheibe nach Größe sortierst'],
    laster: ['5 Cent, wenn du dem Laster da vorne sagst, wie schön er glänzt ✨', '5 Cent, wenn du den Lkw vor uns fragst, was er geladen hat 📦'],
    brunnen: ['5 Cent, wenn du für den Brunnen da vorne ein Gedicht aufsagst ⛲', '5 Cent, wenn du dem Brunnen da fünf Sterne gibst ⭐'],
    elsa: ['5 Cent, wenn du Elsa da vorne ein Ständchen singst 🎶', '5 Cent, wenn du Elsa da drüben fragst, ob sie mitfahren will 👑'],
    ziel: ['5 Cent, wenn du hier zur Feier eine Ehrenrunde drehst 🏁', '5 Cent für ein Andenken von hier. Ein Steinchen reicht',
      '5 Cent, wenn du hier einmal laut „Wir sind da!“ rufst'],
    gerade: ['5 Cent, wenn du auf dieser Geraden laut bis hundert zählst', '5 Cent, wenn du die ganze Gerade lang summst 🎵'],
  },
  // ein Zweiter legt noch 2 Cent drauf …
  fuenfCentDrauf: ['Ich leg noch 2 Cent drauf!', '+2 Cent von mir', '7 Cent, letztes Angebot', 'Von mir kommen noch 2 Cent dazu 💶',
    'Ich erhöhe um 2 Cent. Jetzt wird es ernst 😤', 'Noch 2 Cent aus meiner Spardose 🐷', 'Zusammen mit meinen 2 Cent sind das 7. Überleg es dir 😏',
    'noch 2 cent drauf, mehr hab ich grad nicht'],
  // … andere frotzeln …
  fuenfCentNecken: ['5 Cent 😂 da wird er schwach', 'Für 5 Cent würde ich nicht mal blinken 😂', 'Die Inflation ist an diesem Chat spurlos vorbeigegangen',
    'Mit 5 Cent kommst du heute nicht mal durch die Waschstraße', 'Verhandlungsgeschick: 0 von 10 😂', 'Jedes Mal 5 Cent. Der Chat bleibt sich treu',
    'Bietet noch jemand weniger? 😂', 'Für das Geld macht nicht mal der Wischer einen Wisch'],
  // … und wer geboten hat, bleibt stur
  fuenfCentStur: ['Mein Angebot steht übrigens noch 👀', 'Okay, das Angebot gilt bis Sendeschluss.', 'Ich warte. Ich hab Zeit. Die 5 Cent liegen bereit 💰',
    'Na gut, dann eben nicht. Aber ich frag wieder 😤'],
  zahl: () => {
    const n = chance(0.75) ? threeNumber() : String(randInt(10, 9999));
    return n;
  },
};
// Reise: dasselbe Geplauder, nur wird dort in Zehnern geboten statt um einen Cent
const ZEHNER_STATT_CENT = {
  'Ich biete 1 Cent mehr 🤑': 'Ich biete 10 € mehr 🤑',
  'Einfach 1 Cent mehr bieten, dann gehört das Navi dir 😂': 'Einfach 10 € mehr bieten, dann gehört das Navi dir 😂',
};
CHAT.ambientReise = CHAT.ambient.map((line) => ZEHNER_STATT_CENT[line] ?? line);

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

/** Ein Betrag, wie ihn der Chat schreibt: runde ohne Nachkommastellen („25 €“), krumme mit („33,33 €“). */
export const fmtBetrag = (v) => (Number.isInteger(v) ? fmtEuro(v) : fmtCent(v));

// ---------------------------------------------------------------------------
// Spenden-Reaktionen („Alter“-Skala): Ab 100 € ruft der Chat „Alter!“, 50 € sind ein Mittelalter, und darunter
// rechnet er in Brüchen (20 € = Fünftel-Alter) – aber nur, wenn der Bruch aufgeht: 42 € sind nichts Halbes und
// nichts Ganzes. „Sauber“ heißt es nur bei einem glatten Betrag.
const ALTER_SKALA = [
  { from: 100, calls: ['ALTER!', 'Alter!!!', 'ALTER 😳', 'Alter. Einfach nur: Alter.', 'Eskalation seitens Spenden 🚨'] },
  { from: 75, to: 76, calls: ['Dreiviertel-Alter', 'Dreiviertel-Alter 😳', 'Ein Dreiviertel-Alter!'] },
  { from: 66.66, to: 67, calls: ['Zwei-Drittel-Alter', 'Zwei Drittel Alter 😮', 'Das sind zwei Drittel Alter 🤓'] },
  { from: 60, to: 100, calls: ['Fast ein Alter 😳', 'Knapp am Alter vorbei', 'Alter! Also fast.'] },
  { from: 50, to: 60, calls: ['Mittelalter! 🏰', 'Mittelalter', 'Ein Mittelalter, Respekt 🏰', 'MITTELALTER 🏰',
    'Alter! … na gut, Mittelalter', 'Ein halbes Alter, also Mittelalter 🤓'] },
  { from: 33.33, to: 34, calls: ['Drittel-Alter', 'Drittel-Alter 😮', 'Ein Drittel-Alter!'], exact: 33.33,
    call: '33,33 – ein sauberes Drittel-Alter 🤓' },
  { from: 25, to: 26, calls: ['Viertel-Alter', 'Viertel-Alter, läuft', 'Ein Viertel-Alter 👀'] },
  { from: 20, to: 23, calls: ['Fünftel-Alter', 'Fünftel-Alter 👀', 'Ein Fünftel-Alter!'], exact: 20,
    call: 'Das war ein sauberes Fünftel-Alter' },
  { from: 10, to: 11.5, calls: ['Zehntel-Alter', 'Zehntel-Alter, ich rechne mit 🤓'] },
];

/** Was der Chat zu einer Spende ruft: eine Auswahl an Rufen (für Game.chatLine) oder null, wenn kein Bruch aufgeht. */
export function alterReaction(euro) {
  const a = ALTER_SKALA.find((r) => euro >= r.from && !(euro >= r.to));
  if (!a) return null;
  return euro === a.exact ? [...a.calls, a.call, a.call] : a.calls;
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
  sprachstudio: { label: 'Sprachstudio', pitch: 0.94, rate: 0.95 },
};

// ---------------------------------------------------------------------------
// Das Sprachstudio: die ruhige Stimme in Mini Adams Ohr. Sie liest den Chat mit und sagt, wie er gerade drauf ist –
// nur so erfährt man von der heimlichen Chat-Stimmung. Fünf Stufen (0 im Keller, 1 unruhig, 2 entspannt, 3 gut drauf,
// 4 bester Laune), immer freundlich. Eine Ansage ist entweder ein ganzer Satz aus levels oder ein kurzer Einstieg
// (short, nach einem Umschwung in die Mitte: turn) plus der Anlass (why), wenn die Stream-Kasse einen kennt.
export const STUDIO = {
  levels: [
    [
      'Die Stimmung im Chat ist im Keller. Aber der Keller hat WLAN, alle bleiben dran.',
      'Im Chat ist die Luft raus. Ein schöner Moment, und alle sind wieder da.',
      'Der Chat schmollt ein bisschen. Er meint es aber nicht böse.',
      'Gerade schreibt kaum jemand. Die meisten holen sich wohl Bananensaft.',
      'Der Chat ist heute schwer zu begeistern. Aber er ist noch da, und das zählt.',
      'Ich höre den Chat seufzen. Ganz leise, aber ich höre es.',
      'Im Chat ist es so still, dass man den Akku summen hört. Das kriegen wir wieder hin.',
      'Der Chat hat die Arme verschränkt. Mit einem Brunnen bekommt man ihn bestimmt wieder.',
      'Ich filtere gerade viel. Sagen wir so: Die hätten gern wieder etwas Programm.',
      'Der Chat brummelt. Einmal irgendwo ankommen, und alle sind sofort wieder lieb.',
    ],
    [
      'Der Chat wird ein bisschen ungeduldig. Noch ist alles gut.',
      'Im Chat fragen die Ersten, wann es wieder schön wird.',
      'Der Chat rutscht auf dem Stuhl hin und her. Er hätte gern wieder etwas zu sehen.',
      'Leichte Unruhe im Chat. Die Ersten trommeln schon mit den Fingern auf den Tisch.',
      'Der Chat wünscht sich etwas mehr Schwung. Freundlich, aber bestimmt.',
      'Im Chat geht es gerade nur noch um die Farbe der Bank. Etwas Abwechslung täte gut.',
      'Der Chat ist noch dabei, schaut aber öfter auf die Uhr.',
      'Ich lese gerade öfter das Wort langweilig als das Wort Alter.',
      'Der Chat hibbelt. Zwei wollen nach Siegen, einer will Pommes, und alle wollen Action.',
      'Die Stimmung im Chat ist verhalten. Da geht noch was.',
      'Im Chat läuft eine kleine Wasserfall-Diskussion. Du weißt ja, wie die enden.',
    ],
    [
      'Der Chat ist entspannt und schaut zufrieden zu.',
      'Alles im grünen Bereich, und diesmal meine ich nicht den Frosch.',
      'Ruhige, freundliche Stimmung im Chat. Grüße gehen raus an alle.',
      'Der Chat plaudert vor sich hin. Gerade geht es um Ringtennis.',
      'Im Chat ist es gemütlich. Jemand verteilt Pfefferminz.',
      'Der Chat ist dabei und wartet gespannt, was als Nächstes kommt.',
      'Solide Stimmung im Chat. Keine Eskalation, aber auch kein Funkloch.',
      'Der Chat fühlt sich wohl. Ein paar fragen nach Meister Pünktlich.',
      'Der Chat plätschert so dahin. Kein Wasserfall, eher ein ruhiger Bach.',
      'Stimmung so mittel. Nicht Mittelalter, einfach nur mittel.',
      'Nichts Besonderes im Chat. Jemand hat Hugo nach der Uhrzeit gefragt, das war der Höhepunkt.',
      'Ruhige Lage. Der Chat hält schon ein paar Dreien bereit, falls wieder nach einer Zahl gefragt wird.',
    ],
    [
      'Der Chat ist richtig gut drauf. Weiter so!',
      'Im Chat wird gelacht und fleißig geschrieben. Das gefällt den Leuten.',
      'Die Stimmung im Chat steigt. Es regnet Herzen.',
      'Der Chat hat Spaß. Mehrere wollen schon einen Clip.',
      'Gute Laune im Chat. Die Spendierhosen sitzen gerade locker.',
      'Der Chat feiert die Fahrt. Bimmel hurra, schreibt einer.',
      'Sehr gute Stimmung im Chat. Sogar die stillen Mitleser melden sich.',
      'Der Chat ist begeistert bei der Sache. So macht Fernsehen Spaß.',
      'Im Chat wird geklatscht. Na ja, getippt. Aber mit Begeisterung.',
      'Im Chat gibt es mehr Lob als Fragen und mehr Fragen als Gemecker. So mag ich das.',
      'Der Chat mag die Strecke. Ich soll ausrichten: weiter so, und Dachs grüßt Efeu.',
      'Ein paar Neue sind im Chat, und alle sind gut drauf. Herzlich willkommen!',
    ],
    [
      'Der Chat eskaliert komplett. Wenn das so weitergeht, brauchen wir ein zweites Sprachstudio.',
      'Die Stimmung im Chat ist auf dem Höhepunkt. Die tippen schneller, als ich vorlesen kann.',
      'Live-Eskalation! Der Chat tobt vor Freude.',
      'Der Chat ist völlig aus dem Häuschen. So laut war es hier lange nicht.',
      'Im Chat herrscht Ausnahmezustand. Der schönste, den es gibt.',
      'Der Chat schreibt nur noch in Großbuchstaben. Das ist ein sehr gutes Zeichen.',
      'Beste Stimmung! Der Chat will heute die vierzehn Stunden und sechsunddreißig Minuten knacken.',
      'Der Chat feiert dich gerade. Sogar James kommt mit dem Zählen kaum hinterher.',
      'So glücklich habe ich den Chat selten erlebt. Volle Fahrt voraus!',
      'Kurzer Stimmungsbericht: lauter Herzen, lauter Ausrufezeichen, keine einzige Beschwerde.',
      'Ich habe sechzehn Fenster offen, und in jedem ist Party.',
    ],
  ],
  // kurzer Einstieg je Stufe, wenn gleich der Anlass folgt
  short: [
    ['Kurz zur Lage: Der Chat ist geknickt.', 'Im Chat hängen gerade die Mundwinkel.', 'Der Chat ist ziemlich bedient.'],
    ['Der Chat wird unruhig.', 'Im Chat wird es ungeduldig.', 'Im Chat wird gerade viel gegähnt.'],
    ['Der Chat ist zufrieden.', 'Alles ruhig im Chat.', 'Kurz zur Lage: Der Chat ist gemütlich dabei.'],
    ['Im Chat ist gute Stimmung.', 'Der Chat ist prima gelaunt.', 'Kurz zur Lage: Der Chat hat richtig Spaß.'],
    ['Der Chat ist bester Laune.', 'Live-Eskalation im Chat!', 'Im Chat ist Party.'],
  ],
  // die Stimmung ist gerade in die Mitte zurückgekommen: von unten (up) oder von oben (down)
  turn: {
    up: ['Der Chat fängt sich wieder.', 'Im Chat hellt es sich auf.', 'Die Stimmung im Chat erholt sich.'],
    down: ['Die Stimmung im Chat hat einen kleinen Dämpfer bekommen.', 'Im Chat ist es etwas ruhiger geworden.',
      'Der Chat war eben noch besser gelaunt.'],
  },
  // woran es liegt (Stichworte aus game/economy.js): was die Stimmung gehoben (up) oder gedrückt (down) hat
  why: {
    up: {
      manoever: ['Die Überholmanöver kommen bestens an.', 'So knapp überholt, das lieben sie.', 'Jedes Überholen wird mitgezählt.'],
      tempo: ['Das Tempo gefällt ihnen.', 'Sie mögen es, wenn der Tacho arbeitet.', 'So flott waren sie lange nicht unterwegs.'],
      ziel: ['Die Ankunft wird noch gefeiert.', 'Ein erreichtes Ziel vergessen sie nicht so schnell.'],
      gruss: ['Der Gruß mit der Hupe kam gut an.', 'So ein Hupgruß geht ihnen ans Herz.'],
      sauber: ['Sie loben die saubere Fahrt.', 'Kein Kratzer, das fällt ihnen auf.'],
      blitzer: ['Das Blitzerfoto macht gerade die Runde.', 'Das Blitzerfoto bekommt gerade viele Herzen.'],
      spur: ['Die linke Spur kam gut an.', 'Wer die linke Spur gespendet hat, ist sehr zufrieden.'],
      gebot: ['Das große Gebot ist Gesprächsthema.', 'So ein Gebot sieht man nicht alle Tage.'],
      spass: ['Die Aktionen sorgen für Stimmung.', 'Es wird viel gelacht.'],
      regen: ['Der Regen macht sie munter.', 'Der Wischer hat inzwischen einen Fanclub.'],
      rekord: ['Der Zuschauerrekord beflügelt sie.', 'So viele waren lange nicht dabei.'],
      job: ['Die erledigte Challenge feiern sie noch.', 'Die eingelöste Challenge kam richtig gut an.'],
    },
    down: {
      blech: ['Die machen sich Sorgen um den Lack.', 'Die Rempler haben sie erschreckt.', 'Sie wünschen sich etwas mehr Abstand zu den anderen.'],
      langsam: ['Die wollen mehr Tempo sehen.', 'Jemand fragt, ob die Handbremse noch angezogen ist.', 'Ein bisschen mehr Strom, wünschen sie sich.'],
      stau: ['Die wollen, dass du überholst.', 'Das Kennzeichen vor uns kennen sie inzwischen auswendig.', 'Der Vordermann hat im Chat schon einen Spitznamen.'],
      spur: ['Die wollen die linke Spur sehen.', 'Die freigeschaltete Spur blieb leer, das wurmt sie.', 'Wer die linke Spur spendet, will sie auch sehen.'],
      funkloch: ['Das Funkloch hat Nerven gekostet.', 'Sie hatten kurz kein Bild und sehr viele Fragen.',
        'Beim Funkloch haben alle F geschrieben, das wirkt noch nach.'],
      verpasst: ['Dem verpassten Ziel trauern sie noch nach.', 'Die Ausfahrt von eben lässt sie nicht los.'],
      strafe: ['Das Verwarngeld fanden sie nicht so lustig.', 'Die Polizei Gifhorn war ihnen einmal zu oft zu Besuch.'],
    },
  },
  // Kassensturz zwischendurch ({summe}) …
  total: [
    'Kurzer Kassensturz: Bisher sind {summe} zusammengekommen. Danke an alle!',
    'Das Sprachstudio meldet: {summe} in der Stream-Kasse. Vielen Dank, ihr Ehrenmenschen!',
    'Zwischenstand: {summe} von euch für diese Fahrt. Der Chat ist heute großzügig.',
    '{summe} sind bisher zusammengekommen. Das reicht für sehr viel Bananensaft.',
  ],
  // … ein Gruß an jemanden, der neu im Chat ist ({name}) …
  greet: [
    'Herzlich willkommen, {name}! Schön, dass du zuschaust.',
    'Neu im Chat: {name}. Hallo und viel Spaß bei der Fahrt!',
    '{name} ist zum ersten Mal dabei. Willkommen im Tesla!',
    'Grüße an {name}, frisch im Chat eingetroffen.',
  ],
  // … ein Dank für eine große Spende ({name}, {betrag}) …
  thanks: [
    '{name} hat gerade {betrag} gespendet. Vielen, vielen Dank!',
    'Große Spende von {name}: {betrag}. Das Sprachstudio verneigt sich.',
    'Ich lese vor: {betrag} von {name}. Danke, das ist stark!',
    'Danke an {name} für {betrag}. Ein echter Ehrenmensch!',
    '{betrag} von {name} sind gerade eingegangen. Herzlichen Dank!',
    '{name} schickt {betrag} in die Stream-Kasse. Das Sprachstudio sagt danke!',
  ],
  // … und ab 100 € das „Alter!“: Das sagt das Sprachstudio sofort, sobald niemand anderes spricht
  alter: [
    'Alter! {betrag} von {name}. Danke, danke, danke!',
    'Ich sage nur: Alter. {name} spendet {betrag}.',
    'Alter! {name} legt {betrag} hin. Das Sprachstudio ist sprachlos.',
    'Alter. {betrag} von {name}. Da musste ich zweimal hinschauen.',
    'Eskalation seitens Spenden: {betrag} von {name}. Alter!',
  ],
};

export const DURCHSAGEN = [
  { voice: 'kassandra', text: 'Treffen sich zwei Unterhosen. Fragt die eine: Warst du im Urlaub? Du bist so braun.' },
  { voice: 'karla', text: 'Hallo Mini Adam, liebe Grüße aus {city}. Dachs grüßt Efeu.' },
  { voice: 'william', text: 'Mini Adam, bitte einmal hupen! Bimmel hurra!' },
  { voice: 'weronika', text: 'Hier spricht Meister Pünktlich. Ich bin in fünf Minuten da.' },
  { voice: 'karla', text: 'Grüße an das Sprachstudio und an alle Ehrenmenschen!' },
  { voice: 'weronika', text: 'Mini Adam, wann gibt es endlich eine neue Folge BrunnenTV?' },
  { voice: 'kassandra', text: 'Liebe Grüße an Elsa!' },
  { voice: 'karla', text: 'Gibt es in {city} eigentlich einen Ringtennis-Verein?' },
  { voice: 'weronika', text: 'Welche Farbe hat die Bank in {city}?' },
  { voice: 'william', text: 'Mini Adam, erzähl doch mal die Raab-Story!' },
  { voice: 'karla', text: 'Wir sind auf der Autobahn und streamen in Full HD!' },
  { voice: 'william', text: 'Ich biete einen Cent mehr. Neues Ziel: {city}.', reise: 'Ich biete zehn Euro mehr. Neues Ziel: {city}.' },
  { voice: 'kassandra', text: 'Bitte rechts fahren. Mit freundlichen Grüßen, die Polizei Gifhorn.' },
  { voice: 'weronika', text: 'Mini Adam, du fährst besser als jedes Navi.' },
  { voice: 'karla', text: 'Hallo Mini Adam! Schreib mal eine Zahl in den Chat. Aber bitte ohne Drei.' },
  { voice: 'william', text: 'Kappandramäßige Zusammenfassung bitte! Ich war beim Schwimmunterricht.' },
  { voice: 'william', text: 'Mein Sack ist nass!' },
  { voice: 'kassandra', text: 'Achtung, Achtung. Das Tralala bitte nicht anfassen.' },
];

export const DURCHSAGEN_REGEN = [
  { voice: 'karla', text: 'Guten Tag, hier ist der Herr mit den Schirmen. Ich würde meine Schirme gerne heute noch abholen.' },
  { voice: 'weronika', text: 'Mini Adam, dein Scheibenwischer winkt mir gerade zu. Ich winke zurück!' },
  { voice: 'kassandra', text: 'Achtung, Achtung. Der automatische Scheibenwischer befindet sich weiterhin in der Beta-Phase.' },
  { voice: 'kassandra', text: 'Treffen sich zwei Scheibenwischer. Fragt der eine: Na, wie läuft’s? Sagt der andere: Hin und her.' },
];

// ---------------------------------------------------------------------------
// Boardcomputer-Sätze
export const BOARD = {
  leftLane: 'Die linke Fahrspur ist freigeschaltet.',
  leftLaneEnd: 'Die linke Fahrspur ist wieder gesperrt. Bitte rechts fahren.',
  naviChanged: 'Das Navi-Ziel wurde geändert.',
  arrived: 'Sie haben Ihr Ziel erreicht.',
  rain: 'Regen erkannt. Automatische Scheibenwischer aktiviert.',
  // NOMI entschuldigt sich ab und zu für den hängenden Wischer
  wiperSorry: [
    'Entschuldigung. Der automatische Scheibenwischer ist noch in der Beta.',
    'Der Scheibenwischer übt noch. Danke für die Geduld.',
    'Die Scheibenwischer stehen. Das ist ein bekanntes Problem.',
    'Das war nicht ich. Das war die Beta-Software.',
  ],
  wiperPhantom: 'Regen erkannt. Ach nein. Doch nicht.',
  lowBattery: 'Akku schwach. Bitte bald laden.',
  veryLowBattery: 'Akku fast leer. Die Stream-Technik schaltet gleich ab.',
  elefant: 'Achtung. Elefantenrennen voraus.',
  blitzer: 'Hinweis: Tempolimit. Stationärer Blitzer voraus.',
  shoulder: 'Hinweis: Der Standstreifen ist keine Fahrspur.',
  funkloch: 'Verbindung schwach. Mobilfunk wird neu gebündelt.',
  reverse: 'Rückwärtsgang eingelegt.',
  reverseEnd: 'Weiter zurück geht es hier nicht. Bitte wieder vorwärts fahren.',
};

// ---------------------------------------------------------------------------
// Rahmen-Einblendungen (Preise wie im Live-Bereich)
// Zwischen zwei Rahmen vergehen mindestens min Sekunden der Ereignis-Uhr – weit mehr, als der längste dauert: Zwei
// sind nie zugleich im Bild, und was die Sicht absichtlich verdeckt (COVERS in ui/sicht.js), bleibt eine kurze Ausnahme
export const RAHMEN_GAP = { min: 75, max: 130 };
export const RAHMEN = [
  { id: 'rosen', name: 'Rosenrahmen', price: 12.0, dur: 9 },
  { id: 'sonnenblumen', name: 'Sonnenblumenrahmen', price: 12.5, dur: 9 },
  { id: 'pommes', name: 'Pommes-Rahmen', price: 5.0, dur: 7 },
  { id: 'pappkarton', name: 'Pappkartonhaufen', price: 10.0, dur: 8 },
  { id: 'haelfte', name: 'Bildhälfte abdecken', price: 10.0, dur: 3.5 },
  { id: 'elsa', name: 'Elsa auf den Bildschirm zaubern', price: 2.9, dur: 6 },
  { id: 'burger', name: 'Burger-Rahmen', price: 14.0, dur: 8 },
  { id: 'candy', name: 'Candy-Rahmen', price: 10.0, dur: 8 },
  { id: 'lego', name: 'Baustein-Rahmen', price: 12.0, dur: 8 },
  { id: 'briefmarken', name: 'Briefmarken-Rahmen', price: 10.01, dur: 8 },
  { id: 'chips', name: 'Chipsrahmen', price: 5.0, dur: 7 },
  { id: 'keinerechte', name: 'Keine-Rechte-Bildrahmen', price: 10.0, dur: 7 },
  { id: 'kuerbis', name: 'Kürbis im Stream', price: 4.9, dur: 6 },
];

// ---------------------------------------------------------------------------
// Erlogene Berufsbezeichnungen (aus dem Wiki) für den Abspann
export const BERUFE = [
  { km: 0, job: 'Brownietester', src: '19.03.2020, Ersatzstream im Homeoffice' },
  { km: 1, job: 'Briefmarkenautomatenbefüller', src: '26.03.2020, Ersatzstream im Homeoffice' },
  { km: 2, job: 'Plumpsklo-Ingenieur', src: '20.09.2018, Münster' },
  { km: 3, job: 'baut künstliche Maulwurfstunnel', src: '02.01.2020, Cuxhaven' },
  { km: 4, job: 'Bildumdreher im Frankfurter Kunstmuseum', src: '05.03.2020, Werne' },
  { km: 5, job: 'Krokodilwächter im Frankfurter Zoo', src: '26.05.2019, Fulda' },
  { km: 6.5, job: 'Qualitätssicherung für Schilder (prüft die Druckauflösung)', src: '30.03.2017, München' },
  { km: 8, job: 'wartet Schornsteine in Wolkenkratzern', src: '13.12.2019, Salzburg' },
  { km: 10, job: 'richtet WLAN in Flugzeugen ein', src: '25.07.2019, Karlsruhe' },
  { km: 12, job: 'schreibt die Algorithmen für die roten und orangenen Stau-Bereiche auf Navi-Karten', src: '23.05.2019, Freising' },
  { km: 15, job: 'macht statistische Modelle für die Endzeit der Benzintankstellen', src: '07.10.2022, Golfen im Park' },
  { km: 20, job: 'Teilchenbeschleuniger', src: '06.02.2021, Tesla-Navi ferngesteuert' },
];

export function berufFor(km) {
  let best = BERUFE[0];
  for (const b of BERUFE) if (km >= b.km) best = b;
  return best;
}

// ---------------------------------------------------------------------------
// „You had 5 Jobs“ – pro Fahrt fünf kleine Aufgaben. Geld gibt es dafür nur, weil jemand im Chat genau das
// versprochen hat („Wenn {wenn}, spende ich …“).
export const JOB_TEMPLATES = [
  { id: 'left20', text: '20 Sekunden auf der freigeschalteten linken Spur', goal: 20, stat: 'leftLaneTime', wenn: 'du 20 Sekunden ganz links fährst' },
  { id: 'navi1', text: 'Ein Navi-Ziel erreichen', goal: 1, stat: 'naviReached', wenn: 'du ein Navi-Ziel erreichst' },
  { id: 'near3', text: '3× haarscharf überholen', goal: 3, stat: 'nearMisses', wenn: 'du dreimal haarscharf überholst' },
  { id: 'speed200', text: '200 km/h fahren', goal: 200, stat: 'maxSpeedKmh', wenn: 'du 200 km/h fährst' },
  { id: 'banana2', text: '2× Bananensaft einsammeln', goal: 2, stat: 'bananas', wenn: 'du zweimal Bananensaft erwischst' },
  { id: 'clean5', text: '5 km ohne Blechschaden', goal: 5000, stat: 'cleanDistance', wenn: 'du 5 km ohne Blechschaden schaffst' },
  { id: 'changes25', text: '25 Navi-Gebote überstehen', goal: 25, stat: 'naviChanges', wenn: 'du 25 Navi-Gebote überstehst' },
  { id: 'viewers1000', text: '1.000 Zuschauer erreichen', goal: 1000, stat: 'maxViewers', wenn: 'hier 1.000 Leute zuschauen' },
  { id: 'charge2', text: '2 Lade-Ringe einsammeln', goal: 2, stat: 'charges', wenn: 'du zwei Lade-Ringe einsammelst' },
  { id: 'dist8', text: '8 km Strecke schaffen', goal: 8000, stat: 'distance', wenn: 'du 8 km weit kommst' },
  { id: 'blitzfrei', text: 'An einem Blitzer vorbei, ohne geblitzt zu werden', goal: 1, stat: 'blitzerClean', wenn: 'du brav am Blitzer vorbeikommst' },
  { id: 'rain1', text: '1 km im Regen fahren', goal: 1000, stat: 'rainDistance', wenn: 'du 1 km im Regen durchhältst' },
];

// In der XXL-Welt zählen die Strecken-Aufträge Reisekilometer (Game.odometer): je Auftrag etwa so lange gefahren wie
// klassisch (tools/journey-test.mjs: rund 7,5 Reisekilometer je Kilometer Straße; die Strecke ab dem Start etwas
// weniger, weil der Startort echte Straße ist).
// Lade-Ringe und Bananensaft-Flaschen liegen auf der Reise nicht auf der Straße (REISE.md A5): Geladen wird in den
// Ladeparks an den Ausfahrten, also gelten dort deren Aufträge.
export const REISE_JOBS = {
  clean5: { text: '40 km ohne Blechschaden', goal: 40000, wenn: 'du 40 km ohne Blechschaden schaffst' },
  dist8: { text: '50 km Strecke schaffen', goal: 50000, wenn: 'du 50 km weit kommst' },
  rain1: { text: '8 km im Regen fahren', goal: 8000, wenn: 'du 8 km im Regen durchhältst' },
  banana2: { text: 'Einen Ladestopp einplanen', goal: 1, stat: 'stopsPlanned', wenn: 'du einen Ladestopp einplanst' },
  charge2: { text: 'Im Ladepark den Akku füllen', goal: 1, stat: 'parkCharges', wenn: 'du im Ladepark den Akku füllst' },
};

// Reise: NOMIs Akku-Warnungen nennen den nächsten Ladepark auf dem Weg mit Entfernung (trip.js nextRest); Taste L oder
// der Knopf „Ladestopp einplanen“ machen ihn zum Zwischenziel. Dort parkt der Wagen an der freien Säule ein und lädt im
// Zeitraffer voll (Game.startCharge, xxl/charge.js STOP). {pct} Prozent, {park} Name, {km} Weg.
export const REISE_AKKU = {
  warn: [25, 10], // Prozent: NOMI warnt, und noch einmal, wenn es knapp wird
  early: 70, // darunter warnt sie früher, sobald der nächste Park der letzte in Reichweite ist
  reserve: 0.85, // so viel der geschätzten Reichweite gilt als sicher
  kmPerPct: 0.8, // Reisekilometer je Prozent, solange noch nichts gemessen ist (vorsichtig geschätzt)
  low: 'Akku {pct} Prozent. Nächster Ladepark: {park}, in {km}. Ladestopp einplanen?',
  last: 'Akku {pct} Prozent. {park} in {km} liegt noch in Reichweite. Ladestopp einplanen?',
  veryLow: 'Akku nur noch {pct} Prozent! {park} in {km}. Bitte dort laden.',
  planned: 'Akku {pct} Prozent. Der Ladestopp im {park} ist eingeplant, in {km}.',
  none: 'Akku {pct} Prozent, und kein Ladepark auf dem Weg. Bitte sparsam fahren.',
  set: 'Ladestopp eingeplant: {park}, in {km}.',
  cancel: 'Ladestopp gestrichen.',
  noPark: 'Kein Ladepark auf dem Weg.',
  missed: 'Ladestopp verpasst. Ich suche den nächsten Ladepark.',
  start: 'Ladestopp im {park}. Ich lade den Akku voll.',
};

// ---------------------------------------------------------------------------
// Tesla-Shop (bezahlt wird mit den Stream-Einnahmen)
export const SHOP = [
  {
    id: 'boost', icon: '⚡', name: 'Beschleunigungs-Boost', cat: 'Leistung', prices: [300, 700, 1500],
    desc: 'Over-the-Air-Update für mehr Bums. Zieht los wie der Chat bei einer Ortsspende.',
    effect: (l) => `Beschleunigung +${l * 20}\u00a0%`,
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
    desc: 'Alle Handynetze werden effizienter gebündelt. Die Technik im Kofferraum frisst weniger Strom.',
    effect: (l) => `Stromverbrauch der Stream-Technik −${l * 15}\u00a0%`,
  },
  {
    id: 'reifen', icon: '🛞', name: 'Sportreifen', cat: 'Fahrwerk', prices: [350, 900],
    desc: 'Mehr Grip für schnelle Spurwechsel, auch bei Regen.',
    effect: (l) => `Spurwechsel +${l * 12}\u00a0%, besserer Nassgrip`,
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
    id: 'radar', icon: '📟', name: 'Radarwarner', cat: 'Spaß', prices: [250],
    desc: 'Ein Kästchen fürs Armaturenbrett. Es piept, und NOMI sagt jeden Blitzer an, bevor es blitzt. Ohne ihn bleibt es beim Überraschungsfoto.',
    effect: () => 'NOMI warnt vor jedem Blitzer',
  },
  {
    id: 'starlink', icon: '🛰️', name: 'Satelliten-Schüssel', cat: 'Spaß', prices: [1100],
    desc: 'Wie beim ersten IRL-Stream über Satellit: keine Funklöcher, mehr Zuschauer, mehr Spenden.',
    effect: () => 'Keine Funklöcher, +25\u00a0% Zuschauer, +20\u00a0% Spenden',
  },
  {
    id: 'linksspur', icon: '⬅️', name: 'Linke-Spur-Sammelaktion', cat: 'Spaß', prices: [400, 1000],
    desc: 'Die Community sammelt fleißiger: Die linke Spur bleibt länger offen und wird schneller wieder freigeschaltet.',
    effect: (l) => `Linke Spur ${60 + l * 10}\u00a0s offen, Pause danach ${l * 30}\u00a0% kürzer`,
  },
  {
    id: 'elsa', icon: '👑', name: 'Wackel-Elsa', cat: 'Deko', prices: [120],
    desc: 'Das Spirit-Animal von SkylineTV LIVE als Wackelfigur fürs Armaturenbrett: die blaue Plüsch-Elsa mit Krönchen und Schärpe.',
    effect: () => 'Wackelt bei jeder Kurve mit',
  },
  {
    id: 'weste', icon: '🦺', name: 'Warnweste', cat: 'Deko', prices: [90],
    desc: 'Für Mini Adam. Bringt nichts, sieht aber sehr professionell aus.',
    effect: () => 'Sichtbar beim Kameraschwenk',
  },
  {
    id: 'konfetti', icon: '🎉', name: 'Konfetti-Kanone', cat: 'Deko', prices: [200],
    desc: 'Knallt bei jedem erreichten Ziel. Ein paar Schnipsel kleben danach an der Scheibe – wie 2022.',
    effect: () => 'Konfetti bei Navi-Zielen',
  },
];

export const UPGRADE_LIMITS = Object.fromEntries(SHOP.map((s) => [s.id, s.prices.length]));

// Abspann-Crew
/**
 * Die Leute des Streams (nur auf der Reise; ausgedachte Namen, immer freundlich, keine Zitate echter Menschen, game.js
 * updateCrew). Minuten, wo nicht anders gesagt.
 * - König Knolli raidet: zuerst nach raid.first, dann alle raid.every Minuten, mit max(raid.min, raid.share der
 *   Zuschauer) Leuten, die mit raid.fade Sekunden Zeitkonstante wieder gehen; Nora sagt es an, er grüßt, seine Leute
 *   schreiben. Danach jubelt er alle knolli Minuten mit cheer Euro oder spendet gift Euro.
 * - Die Mods (Abzeichen MOD) schreiben alle modEvery Minuten eine kurze freundliche Zeile.
 * - Wils oder DomZe erinnern alle discordEvery Minuten an den Discord.
 * - Nach jedem Funkloch meldet einer von back nach backAfter Sekunden (nach Nora), dass der Stream wieder läuft.
 * - „❤“ schickt alle heart Minuten ein Herz, still – niemand antwortet.
 */
export const CREW = {
  knolli: 'König Knolli',
  raid: { first: [6, 14], every: [30, 45], min: 250, share: [0.2, 0.35], fade: 480 },
  knolliEvery: [6, 11], cheer: [1, 5], gift: [2, 10],
  mods: ['Wils', 'Walte', 'AchPünktchen', 'Delta34st', 'Eismann077', 'Cptbalu1991', 'Kieskauer', 'Muyinnchen'],
  modEvery: [2.5, 5],
  discord: ['Wils', 'DomZe'], discordEvery: [9, 15],
  back: ['IceBonbon', 'Muyinnchen'], backAfter: 1.6,
  heart: '❤', heartEvery: [7, 14],
};
export const CREW_LINES = {
  raid: 'Raid! {name} kommt mit {n} Leuten vorbei. Willkommen!',
  knolliHallo: ['Hallo Mini Adam! Wir kommen zu Besuch 👑', 'Grüße aus dem Knolli-Land! 👑', 'Gute Fahrt euch allen! 👑'],
  raider: ['KNOLLI RAID 👑', 'Hallo zusammen! 👋', 'Wo fahren wir hin? 😄', 'Grüße vom Knolli-Stream', 'Schönes Auto!',
    'Ich bleib noch ein bisschen 👀', 'Knolli hat uns hergebracht 👑', 'Was kostet ein Navi-Ziel hier?'],
  knolliJubel: ['Weiter so, Mini Adam! 👑', 'Ich schau immer noch zu 👑', 'Starke Fahrt!', 'Grüße an den Chat 👑'],
  cheer: '{name} jubelt mit {betrag}! 👑',
  danke: ['Danke, König Knolli! 👑', 'Der König hat gesprochen 👑', 'Knolli ❤'],
  mod: ['Bitte nett bleiben im Chat ❤', 'Willkommen an alle Neuen! 👋', 'Schön, dass ihr da seid!',
    'Wer neu ist: Navi-Gebote gibt es ab 10 €', 'Alle Links findet ihr im Panel unter dem Stream',
    'Gute Stimmung hier heute 😊', 'Grüße an alle Zuschauer!', 'Denkt an eine Pause und ein Glas Wasser 💧'],
  discord: ['Discord-Link ist im Panel', 'Discord-Link ist im Panel 😊', 'Kommt in den Discord – der Link ist im Panel'],
  back: ['Stream läuft wieder! 🎉', 'Wir sind wieder da!', 'Und weiter geht’s 🎉'],
};

export const ABSPANN_CREW = [
  ['Fahrer', 'Mini Adam'],
  ['Kamera', 'stationär'],
  ['Drohne', 'die Drohne'],
  ['Sprachstudio', 'das Sprachstudio'],
  ['Scheibenwischer', 'Auto-Wischer (Beta)'],
  ['Navigation', 'ferngesteuert vom Chat'],
];
/**
 * Abspann der Reise: die Leute des Streams, mit ausgedachten Berufen (nach ABSPANN_CREW, vor „Danke an“). Ein drittes
 * Feld 'wide' gibt einer langen Zeile die ganze Breite; sie steht darum am Schluss, damit das Raster keine Lücke hat.
 */
export const ABSPANN_REISE = [
  ['Musik', 'Elti und IceBonbon'],
  ['Stimmen im Sprachstudio', '?CF und IceDrache'],
  ['Geek im Hintergrund', 'Arno Nühm'],
  ['Discord', 'Wils und DomZe'],
  ['Großbieter vom Dienst', 'BontanaBack'],
  ['Raid-Kommando', 'König Knolli'],
  ['Moderation', 'Wils, Walte, AchPünktchen, Delta34st, Eismann077, Cptbalu1991, Kieskauer und Muyinnchen', 'wide'],
];
/** Ganz am Ende des Abspanns der Reise, allein und leise (Wortlaut des Eigentümers, unverändert). */
export const GEDENKEN = 'triazanonym (TriazNervensäge) und Pascal (pscldpr) – Behalten wir ewig in Gedanken wie seine historische Texte';
