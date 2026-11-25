// Alle Texte, Insider und Spieldaten an einem Ort.
// Quellen der Insider: SkylineTV LIVE Wiki (siehe INSIDER.md im Repo).
import { pick, randInt, chance, fmtEuro, fmtCent } from './util.js';

// Der Name des Spiels ist „Mini Adam – Navi ferngesteuert BrunnenTV XXL“ (GAME_NAME: Über das Spiel, Seitentitel und
// README sagen es so). Auf dem Titelbildschirm steht er unter dem großen „Mini Adam“: GAME_SUBTITLE, dahinter GAME_XXL
// in Brunnenblau.
export const GAME_TITLE = 'Mini Adam';
export const GAME_SUBTITLE = 'Navi ferngesteuert';
export const GAME_XXL = 'BrunnenTV XXL';
export const GAME_NAME = `${GAME_TITLE} – ${GAME_SUBTITLE} ${GAME_XXL}`;
export const TAGLINE = 'Live-Eskalationen immer woanders!';

// ---------------------------------------------------------------------------
// Navi-Ziele: Geboten wird auf die echten Orte der Karte (src/game/navi.js WorldNavi). Insider aus echten „Tesla
// ferngesteuert“-Streams hängen an ihrem Ort – Schlüssel wie in der Karte (places[].key; tools/journey-test.mjs prüft
// jeden). special: besondere Ankunft (Game.onArrive) · note: Zeile unter dem Hinweis aufs neue Ziel.
// Nicht dabei, weil die Karte den Ort nicht hat oder die Welt das Ding dort nicht baut: Megahub Lehrte, Liberec,
// Burg Ronneburg, Schäferborn Ost, der Drive-In und die Farbe der Bank am Markt.
export const INSIDER_ORTE = {
  Kassel: { special: 'elsa', note: 'Elsa besuchen, das Spirit-Animal von SkylineTV LIVE.' },
  Dortmund: { special: 'bude', note: 'Zur richtigen Currywurstbude. Diesmal ganz sicher. Und Phoenix West liegt auch hier.' },
  Norderstedt: { special: 'malte', note: 'Walte abholen. Die Bahn fällt mal wieder aus.' },
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

/** Der n-te Name einer festen Folge (ohne Zufall: wer ihn nimmt, ändert nichts an dem, was der Zufall sonst bringt). */
export function viewerNameAt(n) {
  return NAME_A[(n * 7 + 3) % NAME_A.length] + NAME_B[(n * 5 + 1) % NAME_B.length];
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
  Brunnenspenden: 'Brunnenspende',
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
export const FINES = ['Bußgeld', 'Verwarngeld', 'Schäden', 'Mitleidskäufe'];

/**
 * Reise: An jedem erreichten Ziel kommt die Werkstatt-Rechnung der Runde (game.js settleRound). bump: Euro je
 * zählendem Rempler (ein Karosserie-Punkt, so viel wie ein gewöhnliches Siegergebot), mark: je Kratzer an der
 * Leitplanke (jede Schramme, damage.js scraped). Abgebucht wird immer die ganze Rechnung, auch ins Minus, und was am
 * Ende des Streams noch offen ist, auch (Abrechnung „Schäden“). Wann die Fahrt in der Werkstatt endet (keine Punkte
 * mehr), bleibt, wie es ist.
 */
// Der Besitzer am 25.11.: „Ein Rempler kann ruhig 400€ bis 500€ kosten.“ (vorher 210 €, Kratzer 35 €)
export const REPARATUR = { bump: 450, mark: 75 };
/**
 * Bußgelder (der Besitzer am 24.11.: „Die Kosten sind generell noch ein wenig zu günstig“): geblitzt (Autobahn, Ort,
 * Landstraße) blitzer, Verwarngeld für Standstreifen und Rechtsfahrgebot verwarn. Abgebucht wird, was die Kasse hat
 * (Game.fine). Vor dem 24.11.: Rempler 150 €, Kratzer 25 €, Blitzer 15 €, Verwarngeld 10 €.
 */
// der Besitzer am 25.11.: „Ein Blitzerfoto soll 100€ kosten.“ (vorher 20 €), zum Verwarngeld „Mach 50€ draus“ (vorher 15 €)
export const BUSSGELD = { blitzer: 100, verwarn: 50 };
/**
 * Frontal in den Gegenverkehr (der Besitzer am 24.11.: „eine bessere Lösung mit mehr Schaden“): Ein Frontal-Rempler
 * kostet base Rempler und je km/h Annäherung perKmh Rempler mehr (gerundet auf 5 €) – bei 30 km/h gut das Doppelte
 * eines gewöhnlichen, frontal auf der Landstraße (100 + 85 km/h) gut das Fünffache: der teuerste Rempler des Spiels.
 * Ab Player RECOIL.hard km/h (90) kostet er dazu zwei Karosserie-Punkte.
 */
export const FRONTAL = { base: 1.5, perKmh: 1 / 50 };
export const frontalCost = (kmh) => Math.round((REPARATUR.bump * (FRONTAL.base + Math.max(0, kmh) * FRONTAL.perKmh)) / 5) * 5;
/** Werkstatt-Rechnung: hits Rempler (frontale mitgezählt), marks Kratzer, extra = was frontale mehr kosten. */
export const damageCost = (hits, marks, extra = 0) => REPARATUR.bump * hits + REPARATUR.mark * marks + extra;
/**
 * „1 Frontal-Rempler · 2 Rempler · 1 Kratzer“: was eine Werkstatt-Rechnung zählt (Rundenzeile, James, Abrechnung im
 * Abspann); hits zählt alle Rempler, front die frontalen darunter.
 */
export const damageCount = (hits, marks, front = 0) =>
  [front ? `${front} Frontal-Rempler` : '', hits - front ? `${hits - front} Rempler` : '', marks ? `${marks} Kratzer` : ''].filter(Boolean).join(' · ');

// Wofür gespendet wird (etwa jede dritte Spende nennt einen Zweck)
export const SPENDEN_ZWECKE = [
  'eine Runde Bananensaft', 'neue Wischerblätter', 'Strom für den Tesla', 'die Kaffeekasse im Sprachstudio',
  'ein Eis für Mini Adam', 'Plüsch-Shampoo', 'eine Dose Pfefferminz', 'die nächste Pandamütze', 'Popcorn an der Ladesäule',
  'ein neues HDMI-Kabel', 'ein Putztuch für Elsas Krone', 'den Brunnen-Fonds', 'Konfetti-Nachschub', 'die Waschstraße',
  'Meister Pünktlichs Wecker', 'Waltes Bahnticket', 'Pommes ohne Rückfragen', 'einen Ringtennis-Ring',
  'frische 0-Euro-Scheine', 'ein Lob an den Wischer', 'Kaffee für die Polizei Gifhorn', 'Akku-Streicheleinheiten',
  'noch mehr Rahmen', 'das Kappen-Bügeleisen', 'die Drohnen-Akkus', 'einen Blumenstrauß fürs Navi',
  'die richtige Currywurstbude', 'Sitzheizung für alle', 'eine Fusselrolle', 'gute Laune',
];

// Aktionen, die Zuschauer im Live-Bereich kaufen (needs: nur mit diesem Upgrade an Bord; das Megafon gehört zur
// Ausstattung, sein Wunsch geht immer)
export const AKTIONEN = [
  { id: 'trunk', name: 'Kofferraum öffnen', price: 5 },
  { id: 'hupe', name: 'Einmal hupen', price: 2 },
  { id: 'megafon', name: 'Megafon-Wunsch', price: 4 },
];
// Was Brüll-William dann durchs Megafon ruft
export const MEGAFON_WUENSCHE = [
  'Achtung, Achtung! Der Chat wünscht allen eine gute Fahrt!',
  'Hier spricht Mini Adam. Bitte einmal freundlich winken!',
  'Durchsage vom Chat: Wer einen Brunnen sieht, bitte hupen!',
  'Achtung! Hier fährt ein Plüschtier. Bitte nicht streicheln!',
];

// BrunnenTV am Navi-Ziel der Reise: Mini Adam spricht durchs offene Fenster mit dem Megafon zum Brunnen (Stimme wie
// bei der Taste H), {ort} = der Ort – kurz wie die Megafon-Wünsche (mit einem Ortsnamen von 20 Zeichen nicht länger
// als der längste von ihnen, tools/sicht-test.mjs); danach sagt OMI etwas dazu ({n} = Folge)
export const BRUNNEN_MEGAFON = [
  'Achtung, Achtung! BrunnenTV live aus {ort}!',
  'Hallo {ort}! Hier ist BrunnenTV!',
  'Achtung! Dieser Brunnen ist jetzt auf Sendung!',
  'Liebe Leute in {ort}: Was für ein Brunnen!',
  'Durchsage an den Brunnen: Der Chat hat dich lieb!',
  'Achtung! Wasser läuft, Kamera läuft. BrunnenTV!',
  'Hier spricht BrunnenTV. Bitte kräftig sprudeln!',
  'Fünf von fünf Tropfen für {ort}!',
  'Bitte weiterplätschern! Hier ist BrunnenTV!',
];
/**
 * Herr Schönnbrun (Wiki: der Held von BrunnenTV, mit eigenem Logo und eigener Hymne): In jeder Folge moderiert Mini
 * Adam als Herr Schönnbrun. Die Bauchbinde nennt ihn (host), sein Logo steht davor (ui/schoennbrun.js), seine Hymne
 * spielt zu Beginn (audio.js schoennbrunHymne, eine eigene Melodie ohne Text), der Untertitel des Megafons heißt nach
 * ihm (label), der Chat grüßt ihn mit Namen (gruss, game/gags.js), Album und Abspann nennen ihn.
 */
export const SCHOENNBRUN = {
  name: 'Herr Schönnbrun',
  host: 'mit Herrn Schönnbrun',
  label: 'Herr Schönnbrun durchs Megafon',
  gruss: ['Guten Abend, Herr Schönnbrun! 🎩', 'Herr Schönnbrun ist auf Sendung! ⛲', 'Hallo Herr Schönnbrun, schöne Hymne heute 🎺',
    'Herr Schönnbrun, Sie sehen gut aus! 🎩', 'Applaus für Herrn Schönnbrun 👏', 'Da ist er ja, Herr Schönnbrun höchstpersönlich ⛲',
    'Die Hymne! Gänsehaut 🎺', 'Bühne frei für Herrn Schönnbrun! 🎬'],
};
/**
 * Die übrigen Running Gags aus dem Stream des Eigentümers vom 21.11.2026 (game/gags.js; Marken, Seiten und Firmen
 * darin sind erfunden). schranke: die Bezahlschranke hinter der Ortstafel (world/xxl/schranke.js) – der Chat ruft sie
 * aus (spam), einer zahlt ein paar Cent ({name}, {betrag}: James meldet es), OMI kommentiert.
 */
export const GAGS = {
  schranke: {
    spam: ['BEZAHLSCHRANKE! 🚧', 'BEZAHLSCHRANKE 😂', 'Bezahlschranke ist ein geiles Wort', 'Wer zahlt die Bezahlschranke?',
      'BE-ZAHL-SCHRAN-KE 🚧', 'Schranke auf, Schranke auf! 💶', 'Bezahlschranke!! Ich zahl, ich zahl 💶'],
    james: '{name} zahlt {betrag} an der Bezahlschranke – Schranke auf! 🚧',
    omi: 'Bezahlschranke erkannt. Der Chat hat bezahlt. Gute Fahrt!',
    // was ein Zuschauer einwirft (Euro)
    betrag: [0.5, 1, 1.5, 2],
  },
  // „Mini Adam gründet einen Verein“: James ruft ihn aus, Zuschauer treten bei (beitreten), James begrüßt sie
  // ({name}; die Zahl der Mitglieder steht erst in der Abrechnung, die Namen im Abspann), der Chat lästert (echo)
  verein: {
    name: 'Brunnenfreunde Mini Adam e. V.',
    gruendung: '📝 Mini Adam gründet einen Verein: die Brunnenfreunde Mini Adam e. V.! Wer mitmachen will, schreibt !beitreten',
    beitreten: ['!beitreten', '!beitreten 🙋', 'Ich will in den Verein! !beitreten', 'Mitgliedsausweis bitte 🪪 !beitreten',
      'Bin dabei, Vereinsheim ist der Tesla 😂 !beitreten', '!beitreten – wo ist der Aufnahmeantrag?'],
    willkommen: ['Willkommen bei den Brunnenfreunden, {name}! 🎉', 'Neues Mitglied: {name}. Der Mitgliedsausweis ist unterwegs 🪪',
      '{name} ist jetzt Brunnenfreund. Willkommen im Verein! ⛲'],
    echo: ['Vereinsmeier 😂', 'Satzung wann? 📜', 'Erster Vereinsausflug: zum Brunnen ⛲', 'Jahresbeitrag: ein Bananensaft 🍌',
      'Ehrenmitglied: Herr Schönnbrun 🎩', 'Wann ist die Mitgliederversammlung? 😂'],
  },
  // „… nur mit Code ADAM“ aus dem Stream: die ausgedachte, zuckerfreie Brause Plüschbrause (kein Markenname); der Chat erinnert an den Code (chat), manchmal
  // antwortet jemand (antwort); im Shop gibt es die Kiste mit Code ADAM 10 % günstiger (SHOP brause, shopPrice)
  code: {
    chat: ['Nur mit Code ADAM, 10 % auf alles!', 'Code ADAM nicht vergessen: 10 % auf alles bei Plüschbrause 🥤', 'Plüschbrause mit Code ADAM bestellt 😎',
      'CODE ADAM! 10 % auf alles!', 'Gilt Code ADAM auch für Bananensaft? 🍌', 'Ohne Code ADAM kauf ich gar nix mehr', 'Plüschbrause nur mit Code ADAM 🥤', 'Plüschbrause, null Zucker, nur mit Code ADAM 🥤'],
    antwort: ['Plüschbrause 🥤', 'Code ADAM ist Pflicht', 'Plüschbrause > alles', '10 % sind 10 % 😂', 'Zuckerfrei und nur mit Code ADAM!'],
  },
  // Tracker: ein Zuschauer mit Geo-Tracker kündigt den nächsten Ort an ({ort}, wahr: Stichwort gleich), Zahlen zum
  // Stream kommen von der ausgedachten Statistikseite Glotzometer ({n}: die Zuschauer gerade, Stichwort glotz); die
  // Einschaltquote im Abspann nennt sie als Quelle
  tracker: {
    seite: 'Glotzometer',
    geo: ['[gleich] Laut Geo-Tracker bist du gleich in {ort} 📍', '[gleich] Geo-Tracker sagt: gleich {ort}! 📍', '[gleich] Mein Geo-Tracker meldet: {ort} kommt gleich 👀'],
    glotz: ['[glotz] Laut Glotzometer schauen gerade {n} zu 📈', '[glotz] Glotzometer sagt: {n} Leute im Stream 👀', '[glotz] Glotzometer-Check: {n} Zuschauer, läuft 📈'],
  },
  // „Das Leid mit der Paketsuche“: Paketfuchs verfolgt ein Paket für Mini Adam beim ausgedachten Zusteller
  // Schneckenpost (schritte der Reihe nach; {stadt}: echte Orte – das Paket ist nie dort, wo er ist), der Chat leidet
  // mit (leid). Liegt es in der Packstation am Navi-Ziel, holt Mini Adam es nach der Folge dort ab (abgeholt, {inhalt});
  // sonst geht es irgendwann zurück (zurueck), und alles beginnt von vorn
  paket: {
    fuchs: 'Paketfuchs',
    schritte: ['📦 Sendung angekündigt: ein Paket für Mini Adam, Zusteller: Schneckenpost 🐌', '📦 Paket ist im Paketzentrum {stadt}', '📦 Paket ist in {stadt}',
      '[faehrt] 📦 Zustellversuch gescheitert – Empfänger nicht angetroffen (er fährt ja) 😅', '📦 Paket liegt jetzt in der Packstation in {stadt}'],
    leid: ['Das Leid mit der Paketsuche 😩', 'Schneckenpost halt 🐌', 'Wo ist das Paket?? 📦', 'Paketverfolgung ist mein Lieblingssport 😂', 'Nicht schon wieder die Schneckenpost 🐌'],
    abgeholt: '📦 Paket aus der Packstation in {stadt} abgeholt! Drin: {inhalt} 🎉',
    inhalt: ['ein Plüsch-Brunnen für die Ablage', 'eine Kiste Bananensaft', 'neue Wischerblätter (endlich)', 'ein Wackel-Brunnen fürs Armaturenbrett', 'Socken mit Brunnen drauf'],
    jubel: ['ENDLICH! 📦', 'Das Paket ist da! 🎉', 'Schneckenpost hat geliefert 🐌🎉'],
    zurueck: '📦 Paket geht zurück an den Absender. Neue Sendung kommt bestimmt 🙄',
  },
  // „Schade Schokolade“: so tröstet der Chat, wenn etwas schiefgeht (Ausfahrt verpasst, niemand bietet, Rempler, Blitzer)
  schade: ['Schade Schokolade 🍫', 'Schade Schokolade!', 'schade schokolade 😅', 'Tja. Schade Schokolade 🍫', 'Schade Schokolade, Mini Adam 🍫'],
  // „Mitleidskauf“: Hält Mini Adam im Ort vor einem kleinen Laden, kauft er dort eine Kleinigkeit. laeden: je Laden
  // des Baukastens [wo, was (eines davon), Preis von … bis (Euro)] – kurz, der Hinweis am Rand nennt beides
  // (streamgags-test: nie länger als der längste Hinweis, den die Prüfung der freien Sicht misst); chat freut sich
  mitleid: {
    laeden: {
      shopBakery: ['in der Bäckerei', ['eine Brezel', 'zwei Schnecken', 'ein Laugenbrötchen'], [2, 5]],
      shopIce: ['in der Eisdiele', ['eine Kugel Vanille', 'ein Spaghetti-Eis', 'zwei Kugeln Schoko'], [2, 6]],
      shopCafe: ['im Café', ['einen Kaffee', 'ein Stück Apfelkuchen'], [3, 6]],
      shopKiosk: ['am Kiosk', ['saure Schnüre', 'eine Zeitung', 'eine Tüte Gummibärchen'], [2, 5]],
      shopBooks: ['im Buchladen', ['ein Rätselheft', 'eine Brunnen-Postkarte'], [2, 7]],
      shopFlowers: ['im Blumenladen', ['einen kleinen Kaktus', 'drei Tulpen'], [3, 7]],
      shopToys: ['im Spielzeugladen', ['einen Flummi', 'ein Mini-Auto', 'Seifenblasen'], [2, 7]],
      shopVeg: ['im Gemüseladen', ['zwei Bananen', 'einen Apfel', 'eine Gurke'], [2, 4]],
      shopDoner: ['beim Imbiss', ['eine Portion Pommes', 'ein Ayran'], [3, 7]],
      shopPizza: ['in der Pizzeria', ['ein Stück Pizza', 'eine Pizzaschnecke'], [3, 6]],
      shopElectro: ['im Elektroladen', ['ein Ladekabel', 'zwei Batterien'], [4, 7]],
    },
    chat: ['Mitleidskauf! 🛍️', 'Adam unterstützt die kleinen Läden ❤', 'Der Laden freut sich 😊', 'Ehrenmann, kauft im Ort ein 🛍️',
      'Mitleidskauf, wie im Stream 😂', 'Lokal einkaufen, Herr Adam 👏'],
  },
  // „Mysteryboxen“: Ein Zuschauer schenkt eine (James nennt ihn im Chat); am Rand oben wackelt sie, dann springt sie
  // auf (inhalt: [Art, Text] – kurz wie jeder Hinweis am Rand; sound bimmelt, konfetti regnet im Wagen, den witz
  // erzählt der Schenker danach im Chat), der Chat fiebert mit (chat) und freut sich (danach)
  mystery: {
    james: '🎁 {name} schenkt Mini Adam eine Mysterybox!',
    inhalt: [['sticker', 'Sticker »Brunnenfreund« ✨'], ['sticker', 'Sticker »Herr Schönnbrun« 🎩'], ['sound', 'Chat-Sound »Bimmel hurra« 🔔'],
      ['witz', 'ein Brunnenwitz 😄'], ['konfetti', 'Konfetti für den Tesla 🎉'],
      ['ding', 'ein Kühlschrankmagnet mit Brunnen 🧲'], ['ding', 'eine Rolle Pfefferminz 🍬'], ['ding', 'ein 0-Euro-Schein 💶'],
      ['ding', 'ein Gutschein für einmal Wischen 🌧️']],
    chat: ['MYSTERYBOX! 🎁', 'Was ist drin?? 👀', 'Aufmachen, aufmachen! 🎁', 'Mysterybox-Unboxing live 😂'],
    danach: ['Wow 😂', 'Bester Inhalt ever', 'Den will ich auch 😍', 'Mysterybox hat geliefert 🎁'],
    witz: 'Was macht ein Brunnen im Urlaub? Er lässt es plätschern 😄',
  },
};
/**
 * Der Ruf jeder BrunnenTV-Folge (Game.brunnenCall): text steht im Untertitel, wie es klingt (Lautschrift des
 * Besitzers); say spricht die Sprachausgabe – richtig geschrieben, damit jede Stimme es richtig ausspricht, das Lange
 * macht die Stimme 'brunnen' (tief und langsam); chat: so ruft der Chat es nach (das erste immer).
 */
export const SCHOENER_BRUNNEN = {
  text: 'SCHÖÖÖÖÖÖÖNER BRUNNEN!!!!!',
  say: 'Schöner Brunnen!',
  chat: ['SCHÖÖÖNER BRUNNEN!', 'SCHÖÖÖÖNER BRUNNEN!!! ⛲', 'Schöner Brunnen! 😍', 'SCHÖÖÖNER BRUNNEN 💦', 'schöööööner brunnen', 'SCHÖNER BRUNNEN! 🔊', 'SCHÖÖÖNER BRUNNEN! 👏'],
};
// Jeder Stream beginnt mit Mini Adams Gruß (der Eigentümer: „Hallo, Partypeople“), nachdem das Sprachstudio „Wir sind
// live.“ gemeldet hat (der Eigentümer, 21.11.: „Ohne Stream macht ein Gruß keinen Sinn.“): „Partypeople!“, während er
// winkt (der Eigentümer, 21.11.: „nicht ‚Hallo Partypeople‘“) – je Stream genau einmal, mit seiner tiefen Stimme
// (VOICES.adam) und als Untertitel, in der Startszene oder beim Losfahren (main.js streamStart); danach grüßt der Chat
// zurück (chat).
export const PARTYPEOPLE = {
  say: 'Partypeople!',
  chat: ['Hallo Partypeople! 🎉', 'HALLO ADAM! 👋', 'Partypeople am Start 🥳', 'Hallo zurück! ❤', 'Hallo Mini Adam! 🎉', 'Partypeople melden sich zum Dienst 🫡',
    'Hallöchen aus dem Chat 👋', 'Endlich live! ❤', 'Haaallo Partypeople 🎊', 'Die Party kann beginnen 🎉'],
};
export const BRUNNEN_NOMI = [
  'Folge {n} ist im Kasten. Ich finde, das Becken hat heute besonders geglänzt.',
  'Ich habe den Brunnen geprüft: Das Wasser läuft, die Tauben sind zufrieden.',
  'BrunnenTV, Folge {n}: gesendet. Ich speichere diesen Brunnen unter Favoriten.',
  'Laut meinen Daten ist das ein ausgezeichneter Brunnen. Meine Daten irren sich nie.',
  'Das Plätschern liegt bei hervorragenden Werten. Ich bin beeindruckt.',
];
// Die liebevollen Streitfragen des Wikis, in eigenen Worten: als Chatzeile in der Folge und auf ihrer Karte im Album,
// wo sie passen (src/game/album.js debateFor) – ein Trinkbrunnen im Ort, der Kanal in Ravensburg, die Alsterfontäne
export const BRUNNEN_DEBATTE = {
  trink: [
    'Da drüben steht noch ein Trinkbrunnen – zählt der? 💧 #Trinkbrunnenproblematik',
    'Trinkbrunnenproblematik! Hahn nach oben macht noch keinen Brunnen 🤔',
    'Zählt der Trinkbrunnen mit? Der Chat stimmt ab: Becken ja, Hahn nein 😄',
  ],
  kanal: [
    'Und der Kanal? Ein subtiler, horizontal geteilter Brunnen! 🤓',
    'Der Kanal zählt mit: subtiler, horizontal geteilter Brunnen 💦',
  ],
  alster: [
    'Und die Alsterfontäne? Die zählt doch auch! ⛲',
    'Schön – aber die Alsterfontäne ist und bleibt die Königin ⛲👑',
  ],
};

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
    'Welche Farbe hat die Bank hier?', 'Gibt es in {city} einen Ringtennis-Verein?', '[ab] Rechts fahren, Adam! 😅',
    'Schöne Landschaft heute', 'Wie viel Akku noch?', 'Wann kommt Meister Pünktlich?', 'Walte Walte Walte Walte Walte',
    'Erzähl mal die Raab-Story!', '[netz] Das Bild ist so scharf 😍', 'Elsa ❤🐟', 'BrunnenTV wann?', 'Bananensaft-Pause? 🍌',
    'Kappandramäßige Zusammenfassung bitte, bin grad erst rein', '[ab netz] Wir sind auf der Autobahn und streamen in Full HD! 🎶',
    'Wohin fahren wir eigentlich?', '[offen] Das Navi-Ziel ändert sich eh gleich wieder', 'Grüße ans Sprachstudio!',
    'Danke an alle Ehrenmenschen 🙏', 'Pfefferminz jemand?', 'Pandamütze aufsetzen!', '[offen] Wer bietet 10 € mehr? 🤑',
    'Was ist eigentlich im Kofferraum?', 'Grüße an die Polizei Gifhorn 👮', '[ab] Welche Autobahn ist das eigentlich?', 'Schöner Tesla 🖤',
    'Der Wischer ist auch nur ein Mensch', 'Nils weiß bestimmt, wann wir das letzte Mal hier waren',
    'Bester Stream der Woche', 'Die Plüsch-Hände am Lenkrad 😂', '[ziel] Gleich kommt bestimmt ein Brunnen',
    'Tesla-Taxi spielen wann?', 'Erster! (nicht)', 'Falsche Bude? 😂', 'Wer hat das Navi so eingestellt',
    'Adam, schreib mal eine Zahl in den Chat', 'Was läuft da im Radio?', 'Live-Eskalationen immer woanders 🔥',
    'Guten Abend zusammen 👋', 'Bin grad von der Arbeit heim, was hab ich verpasst?', 'Hab den Stream auf dem Fernseher, sieht mega aus',
    'Meine Oma guckt mit und lässt grüßen', 'Wie lange geht der Stream heute?', 'Hugo, wie spät ist es?',
    'James hat heute viel zu tun', 'Kanalpunkte sind gespart, was gibt es dafür?', '[offen] Das Ziel stabilisiert sich … oder auch nicht',
    'Mini Adam, wink mal! 🧸', 'Die Kappe sitzt heute perfekt', '[ab] Kommt gleich eine Raststätte?', 'Wer ist noch aus Hessen hier?',
    'erster stream für mich, wie geht das mit dem navi?', '[offen] Einfach 10 € mehr bieten, dann gehört das Navi dir 😂',
    'Das Lenkrad ist größer als Mini Adam', 'OMI guckt so lieb', 'Wann wieder Drohne?', 'Supercharger wann?',
    'Mein Handy-Akku: 4 %. Eurer?', 'Chat, benehmt euch, Gifhorn liest mit', 'Schöne Grüße aus dem Homeoffice',
    'Ich sollte schlafen, aber das hier ist wichtiger', '[netz] Bild und Ton synchron, ich bin beeindruckt',
    'Bin kurz Getränke holen, bitte nichts Spannendes machen!', 'Ebbelwoi steht kalt 🍏', 'Kriegt das Navi eigentlich Provision? 😂',
    'Läuft bei mir im Zweitfenster, Chef guckt nicht', 'Wer fährt eigentlich, wenn Mini Adam schläft?',
    'Danke fürs Vorlesen, Sprachstudio! 🎧', 'Feierabend, Snacks, Navi-Stream. Mehr brauch ich nicht.',
  ],
  // Die heimliche Chat-Stimmung färbt das Geplauder: ausgelassen bei guter Laune …
  cheerful: [
    'Bester Stream seit Langem 😍', 'ICH LIEBE DIESE FAHRT', '[ab] So muss Autobahn!', 'Mini Adam fährt wie ein Meister 🧸',
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
    '[ab] Überhol doch mal 🙈', 'gähn', 'Wann wird wieder gehupt?', '[langsam] Sogar die Laster haben heute mehr Schwung',
    'Kann mal jemand das Navi ärgern?', '[ziel] Kommen wir heute noch an?', 'Hallo? Jemand da?', 'Ich guck solange aus dem Fenster',
    '[langsam] Schneller, die Pommes werden kalt 🍟', 'Chat schläft 💤', 'Weckt mich, wenn ein Brunnen kommt',
    'Hab nebenbei schon aufgeräumt', '[langsam] Bisschen mehr Strom geben? ⚡', 'Selbst der Wischer langweilt sich',
    '[langsam] laaangsam', '[langsam] Da hinten überholt uns eine Schnecke 🐌', 'Gibt es heute noch Eskalation?', 'zzz',
    'Meine Geduld ist auch nur ein Akku 🔋', 'Ich frag jetzt zum dritten Mal: Wohin fahren wir?', 'Ich mecker nur, weil ich euch mag',
    'Können wir bitte irgendwo ankommen? Egal wo.',
  ],
  // Running Gags aus dem Stream (Recherche memes-A, die stärksten zuerst), jede Zeile nur, wenn sie zum Moment passt
  // (Stichworte: game.js FACTS) – sonst plaudert der Chat wie immer (Game.updateChat, MEME_SHARE)
  meme: [
    '[offen] Summe bereinigt, minus 19 %, wie immer 🤓', '[offen] Jetzt wird es eng da oben 👀',
    '[offen] Nein, bei MIR zuhause! 🏠', '[offen] Was mit Walte, egal was! 🙌', '[offen] 10,01 schlägt 10,00, Mathe ist brutal',
    '[offen] Wer bietet auf „irgendwo mit Schatten“? 😎', '[offen] Früher zu Fuß, heute per Navi 😂',
    '[donnerstag] ENDLICH DONNERSTAG 🎉', '[start] Schon live? Rekordpünktlich ⏰',
    '[studio] Gruß an die ruhige Stimme im Ohr 🎧', '[studio] Wer hat heute Dienst am Mikro? 🎙️',
    '[weit] Fünf Minuten noch, sagt Meister Pünktlich 😂', '[nah] Technisch gesehen sind wir da ✅',
    '[nah] Ich wette, !CF steht schon am Ziel', '[laden] Der Strom kommt in die Streamkosten-Tabelle 🤓',
    '[laden] Ich hab dir einen Bananensaft bestellt 🍌', '[kassandra] Fräulein Kassandra, bitte langsamer lesen 😅',
    '[durchsage] Bitte lies meine auch vor, ist ganz brav', '[durchsage] DIE BOX SOLL LAUTER 🔊',
    '[ort] Drehgenehmigung dabei? 📝', '[ort] Diesmal die richtige Bude? 🌭', '[ort] Magnet kaufen nicht vergessen! 🧲',
    '[ort] Wetten, der Laden hat schon zu?', '[ort] Bodenpommes-Gefahr, Achtung! 🍟',
    '[folge2] Der hier ist schöner als der letzte ⛲', '[tv] Bitte auf Polnisch moderieren 😂', '[tv] DAS MUSS INS WIKI! 📝',
    '[gifhorn] GIFHORN GIFHORN GIFHORN', '[gifhorn] Gifhorn, immer eine Reise wert',
    '[siegen] Siegen im Navi? Glaub ich erst, wenn wir da sind', '[siegen] Diesmal siegt Siegen, ich spür es 🏆',
    '[wende] Navi will wenden? Tschüss du Betrüger 😤', '[ab lange] Stundenlang Autobahn, Wunsch erfüllt ✅',
    '[lange] Noch fit, Mini Adam? 😴', '[akku] Akku knapp, Steckdose suchen! 🔌', '[akku] Powerbank dabei? Diesmal wirklich?',
    '[steht] Im Zweifel: Taxi 🚕', '[langsam] Zu Fuß wären wir schneller 😂', '[regen] Pandamütze bei dem Wetter! 🐼',
    '[ab netz] 4K? Ach, Full HD reicht doch 😌', '[netz] Für diese Aussicht reicht Full HD locker 🏞️',
    '[party] Und da ist sie, die ESKALATION 🔥',
  ],
  // im Regen ist der Chat besonders gesprächig
  rain: ['Schmuddelwetter 🌧', 'Bei dem Wetter bleib ich im Chat', 'Regen-Stream = bester Stream', 'Der Wischer hat Lampenfieber',
    'Die Scheibe sieht aus wie mein Aquarium', 'Platsch!', 'Gemütlich bei euch im Tesla ☔', 'Ich hör den Regen bis hierher',
    'Wisch! … oder auch nicht 😂', 'Tropfen zählen: 1, 2, viele'],
  // jemand ist zum ersten Mal da – das Sprachstudio begrüßt ihn dann mit Namen
  newViewer: ['Hallo! Bin zum ersten Mal hier 👋', 'Hi, bin neu. Warum fährt da ein Plüschtier? 😄',
    'Moin aus {city}! Hab euch eben beim Zappen gefunden', 'Neu hier und schon Fan von OMI 😍',
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
  bidDuel: ['DUELL! 🍿', 'Zwei Sturköpfe, ein Navi 😂', 'Die schaukeln sich hoch', 'Wer gibt zuerst auf?',
    'Ich setz auf den Zweiten', 'Das wird teuer 💸', 'Keiner gibt nach!', 'Bitte weiterbieten, ist gut für die Kasse',
    'Wer überbietet, zahlt. Wer überboten wird, auch 😂'],
  bidDuelEnd: ['Und Ruhe im Karton', 'Duell vorbei, Geldbeutel leer 😅', 'Respekt an beide', 'Abpfiff! Schönes Duell',
    'Das war sportlich'],
  // nach dem Chaos bleibt ein Ziel endlich stehen
  bidCalm: ['Endlich ein Ziel mit Sitzfleisch 🙏', 'Ziel stabil. Vorerst.', 'Bleibt es jetzt dabei?', 'Ruhe im Navi. Verdächtig.',
    'Na also, wir haben ein Ziel'],
  // geboten wird in Zehnern, bis in die Hunderte: Chaos am Anfang der Runde, großes Gebot
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
  schneller: ['Schneller! 😩', '[ziel] Wann sind wir da?', 'Gib Gas, Mini Adam!', 'Das dauert ja ewig', 'Ich schlaf gleich ein 😴',
    'Bitte etwas zügiger 🙏', '[ziel] Sind wir bald da?', 'Das Navi wartet auf dich 😅', 'Das Ziel läuft uns nicht weg … oder? 😅',
    'Ein bisschen mehr Tempo bitte', 'Mein Popcorn ist schon alle 🍿', '[langsam] Gleich überholt uns ein Traktor 🚜'],
  // Werkstatt-Rechnung am Ziel (Reise): freundlich, die Werkstatt gehört dazu – und wer heil ankommt, wird gefeiert
  reparatur: ['Die Werkstatt freut sich 😅', 'Ein bisschen Spachtel, ein bisschen Liebe', 'Beulen gehören dazu',
    'Hauptsache, Mini Adam ist gut angekommen ❤', 'Gut, dass der Chat zusammenlegt 😂', 'Neue Beule, neue Geschichte',
    'Die Plüsch-Hände sind heil, das zählt 🧸'],
  heil: ['Keine Kratzer, keine Rechnung ✨', 'Sauber gefahren!', 'Die Werkstatt hat heute frei 😎',
    'Ohne eine Schramme 👏', 'Der Lack glänzt noch'],
  // Trödeladam (game.js TROEDEL): wenn er lange steht, lange langsam ist oder eine Runde vertrödelt hat – freundlich
  // geneckt, je Anlass eigene Sätze, dazu manchmal ein Echo aus dem Chat
  troedel: {
    steht: ['Trödeladam! 🐌', 'Trödeladam, der Brunnen läuft nicht weg … wir aber auch nicht 😅', 'Steht der Wagen, oder ruckelt mein Stream? Ach so, Trödeladam 😅',
      'Trödeladam macht Pause. Schon wieder 😂', 'Hallo? Trödeladam? Die Straße wartet!', 'Trödeladam parkt wie ein Profi 🅿️',
      'Ich hol mir schnell Pommes, Trödeladam steht ja eh 🍟'],
    langsam: ['TRÖDELADAM 🐌', 'Trödeladam, das Navi schläft gleich ein 😴', 'Sogar die Schnecken überholen uns, Trödeladam 🐌',
      'Trödeladam auf Sightseeing-Tour 📸', 'Gas ist rechts, Trödeladam 😂', 'Gemütlich, Trödeladam, sehr gemütlich 🐢',
      'Das Navi hat die Ankunftszeit gerade nach hinten geschoben, Trödeladam'],
    runde: ['Trödeladam ist angekommen. Endlich 😂', 'Rekord im Trödeln, Trödeladam 🏆🐌', 'Da ist er ja, unser Trödeladam ⛲',
      'Für die Runde gibt es den Trödelpokal 🐌', 'Trödeladam hat den Brunnen gefunden. Irgendwann.'],
    echo: ['🐌🐌🐌', 'Trödeladam 😂', 'Hahaha Trödeladam', 'Trödeladam, der neue Spitzname?', '#Trödeladam', 'Trödeladam forever 🐌'],
  },
  // am Ziel vorbeigefahren (kommt mit der Karte und ihren echten Ausfahrten)
  missedTarget: ['Die Ausfahrt war DA 😭', 'Vorbei … so nah dran', 'Das Navi weint leise', 'Nächste Ausfahrt dann, ja?',
    'Zu flott für die Ausfahrt 😅', 'Tschüss, schönes Ziel 👋'],
  // das Bieterfenster nach einer Folge läuft bald ab (game.js updateNavi): gut gelaunt drängelt der Chat, sonst gähnt er
  fensterBald: ['Leute, bietet mal! ⏳', 'Wer bietet? Die Uhr läuft ⏳', 'Zehn Sekunden noch, kommt schon 😅', 'Ich will weiterfahren, bietet jemand?',
    'Nicht einschlafen, Chat! Bieten!', 'Ich würde ja bieten, aber mein Taschengeld 😭'],
  fensterStill: ['…', 'Ist noch jemand da? 👀', 'Hm.', 'Schon spät heute 🥱', 'Ich glaub, das wars', 'Bietet keiner mehr?'],
  // niemand hat geboten: Der Stream ist vorbei (game.js streamOver)
  streamEnde: ['Gute Nacht, Mini Adam! 🌙', 'Danke für den Stream ❤', 'Bis zum nächsten Mal 👋', 'Schöner Stream heute', 'Tschüss Partypeople! 🎉',
    'Das war schön ⛲'],
  // der Zuschlag fünf Kilometer vor dem Brunnen (game.js zuschlag): Das Ziel steht fest
  zuschlag: ['ZUSCHLAG! 🔨', 'Verkauft! 🔨', 'Glückwunsch zum Ziel 🎉', 'Jetzt gilt es, keine Gebote mehr', 'Ziel steht! Ab zum Brunnen ⛲',
    'Das war ein Rennen 😮', 'Ehrenmensch hat gewonnen 👑', 'Ab jetzt wird nicht mehr umgeplant 😌', 'Gekauft wie gesehen 😂'],
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
  // Ziele sind echte Orte: Die Fahrt dorthin dauert Minuten, gewendet wird nur über eine Ausfahrt, und jede Ankunft
  // endet am Brunnen des Orts
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
    '#BrunnenTV', 'Brunnen gesichtet, Ziel erreicht, alles richtig gemacht', '💦', '💦💦💦', 'Megafon-Folge! 📢⛲',
    'Fenster runter, Megafon raus 📢', 'Der Brunnen hat es gehört 💦', 'Lauter, Mini Adam! 📢', 'Ich höre es bis hierher plätschern 💦',
    'Grüße an den Brunnen!'],
  // nach dem Ruf „Schöner Brunnen!“: Der Chat feiert die Folge (Game.brunnenCall)
  brunnenJubel: ['Beste Folge! ❤⛲', 'Gänsehaut 😍', 'Ich bin nur wegen BrunnenTV hier', 'Clip it! 🎬', 'Folge des Jahres 🏆',
    'Was für ein Brunnen ❤', 'Mehr BrunnenTV!!!', 'Der Brunnen hat sich gefreut 💦', 'Herr Schönnbrun 👏👏👏', 'Ich hab geweint 🥲⛲',
    'Zeigt das meiner Oma!', 'Brunnen des Tages ⛲'],
  elsaKassel: ['ELSA!!! ❤🐟', 'Elsa ❤', 'Kassel ist Elsa-Stadt 👑🐟', 'Grüß Elsa von uns!'],
  gifhornOrt: ['Gifhorn! Historisch bedeutsam 😂', 'Polizei Gifhorn grüßt bestimmt gleich 👮', 'Wo ist der Supermarkt-Parkplatz?'],
  crash: ['Rezeption!', 'Uff 🙈', 'Das gibt Ärger', 'Hat das die Polizei Gifhorn gesehen? 🚓', 'Blechschaden!', 'Hoffentlich hat das keiner gesehen',
    'Eskalation! 😂', 'Das war die falsche Spur'],
  // frontal in den Gegenverkehr (Game.onCrash, ev.headOn): Schreck und Werkstatt, nie Verletzungen
  frontal: ['FRONTAL 😱', 'Gegenverkehr heißt GEGEN-Verkehr 😅', 'Rechts fahren, Adam!!!', 'Das wird eine teure Werkstatt 💸',
    'Stoßstange an Stoßstange 🙈', 'Der kam doch entgegen!', 'Werkstatt-Termin ist gebucht 😂', 'Die Spur gehört dem anderen!',
    'Pflaster für den Tesla! 🩹', 'James schreibt schon die Rechnung'],
  // der Chat will einen Gruß – kurz danach winkt Mini Adam (game/wave.js, Anlass „chat“)
  winkMal: ['Wink mal! 👋', 'Mini Adam, wink mal!', 'Einmal winken bitte! 👋', 'Wink mal in die Kamera!'],
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
  police: ['POLIZEI GIFHORN 🚓', 'Polizei Gifhorn kommt!', 'Benehmen jetzt!', 'Ganz ruhig bleiben…', '👮👮👮',
    'Wer hat die Polizei Gifhorn gerufen? 😂'],
  funkloch: ['F', 'F', 'F', 'Ton f', '/cam2', 'F', 'Bild weg?', 'F', 'Null Balken 📵'],
  funklochBack: ['✔️', '✔️', '✔️ Bild ist wieder da', 'Da ist es wieder ✔️', 'IST DAS LIVE?? 🤨', 'Funkloch vorbei. Tschüss, du Betrüger!'],
  frog: ['🐸', '🐸🐸', 'Frosch!', '🐸 HDMI-Kabel?', 'Wackel mal am Kabel'],
  blitzer: ['📸', 'Lächeln! 📸', 'Das Foto kommt in einen Rahmen', 'Tschüss, du Betrüger!', 'Teures Selfie'],
  // nach einem Blitz stichelt ab und zu jemand: ohne Radarwarner mit einem Wink zum Shop, mit ihm erst recht
  radarFehlt: ['Ein Radarwarner hätte jetzt gepiept', 'Im Shop gibt es Radarwarner 😏', 'Radarwarner wann? 📟',
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
  koriander: ['Bäh, Koriander 🤢', 'Nicht der Koriander!', 'Wer hat da Koriander bestellt?'],
  // Reise: Ladestopp im Ladepark (Akku.tickCharge), die Popcorn-Maschine an der Säule und die Saftpause
  popcorn: ['Popcorn-Stream! 🍿', '🍿🍿🍿', 'Haushaltsgeräte an der E-Säule testen 😂', 'Die Säule kann auch Popcorn!', 'Popcorn mit Ökostrom 🔌', 'Salzig oder süß? 🍿'],
  saftpause: ['Bananensaft-Pause! 🍌', 'Prost, Mini Adam! 🍌', 'Zucker tanken 🍌🔋', 'Erst Saft, dann Strom 😄'],
  shoulder: ['Standstreifen?! 😱', 'Polizei Gifhorn!!', 'Das ist keine Fahrspur!'],
  fiveJobs: ['Job erledigt ✅', 'Weiter so!', 'Noch ein Job weniger', 'Versprochen ist versprochen 🤝',
    'Jetzt wird gezahlt 😂', 'Challenge geschafft!'],
  rahmen: ['Schöner Rahmen 😂', 'Ich sehe nichts mehr', 'Bestes Geld ever', 'Danke für den Rahmen!',
    'Ich seh nur noch Rahmen und einen halben Tesla', 'Noch ein Rahmen und wir fahren nach Gehör'],
  // „5 Cent, wenn du …“: ein Meme aus dem Stream. Ein Zuschauer bietet lächerliche 5 Cent für eine Albernheit – immer
  // genau 5 Cent, das ist der Witz. Mini Adam geht nie darauf ein (kein Geld, keine Aufgabe, keine Antwort von OMI
  // oder dem Sprachstudio); nur der Chat legt noch 2 Cent drauf oder frotzelt. Jedes Angebot höchstens einmal je Stream.
  fuenfCent: [
    '5 Cent, wenn du während der Fahrt den Kopf aus dem Fenster streckst.',
    '5 Cent, wenn du OMI einmal kitzelst 🤏',
    'Angebot des Tages: 5 Cent für ein Tänzchen mit OMI 💃',
    '5 Cent, wenn du OMI beibringst, „Bimmel hurra“ zu sagen',
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
    '5 Cent, wenn du im nächsten Ladepark einmal ums Auto tanzt 🔌',
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
  // drei weitere Zuschauerstimmen (Testfahrt 25.11.2026: mehr Abwechslung): sehr schnell, flüsternd langsam (leiser,
  // volume) und übertrieben förmlich – jede mit eigener Höhe und eigenem Tempo (speech.js pickVoice)
  turbo: { label: 'Turbo-Tina', pitch: 1.25, rate: 1.45 },
  fluester: { label: 'Flüster-Fritz', pitch: 0.8, rate: 0.74, volume: 0.6 },
  amtlich: { label: 'Amtsrat Förmlich', pitch: 0.7, rate: 0.88 },
  board: { label: 'OMI', pitch: 1.18, rate: 1.04 },
  schoennbrun: { label: 'Herr Schönnbrun', pitch: 0.45, rate: 0.82 },
  // Mini Adam bei BrunnenTV: tief und männlich (speech.js DEEP_MALE); sein Ruf „Schöner Brunnen!“ noch tiefer und
  // langgezogen
  adam: { label: 'Mini Adam', pitch: 0.4, rate: 1.1 },
  brunnen: { label: 'Mini Adam: Schöner Brunnen!', pitch: 0.2, rate: 0.6 },
  // das Sprachstudio mit zwei Stimmen, Satz für Satz abwechselnd (speech.js studioVoices): eine Frau und ein Mann; der
  // Untertitel heißt bei beiden „Sprachstudio“
  sprachstudio: { label: 'Sprachstudio', pitch: 1.0, rate: 0.95 },
  sprachstudioM: { label: 'Sprachstudio', pitch: 0.95, rate: 0.95 },
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
      '[netz] Solide Stimmung im Chat. Keine Eskalation, aber auch kein Funkloch.',
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
      nah: ['Das Ziel ist ganz nah, alle sind gespannt.', 'Gleich sind wir da, der Chat zählt schon mit.', 'Kurz vor dem Ziel, da fiebern alle mit.'],
      gruss: ['Der Gruß mit der Hupe kam gut an.', 'So ein Hupgruß geht ihnen ans Herz.'],
      sauber: ['Sie loben die saubere Fahrt.', 'Kein Kratzer, das fällt ihnen auf.'],
      blitzer: ['Das Blitzerfoto macht gerade die Runde.', 'Das Blitzerfoto bekommt gerade viele Herzen.'],
      spur: ['Die linke Spur kam gut an.', 'Wer die linke Spur gespendet hat, ist sehr zufrieden.'],
      gebot: ['Das große Gebot ist Gesprächsthema.', 'So ein Gebot sieht man nicht alle Tage.'],
      spass: ['Die Aktionen sorgen für Stimmung.', 'Es wird viel gelacht.'],
      regen: ['Der Regen macht sie munter.', 'Der Wischer hat inzwischen einen Fanclub.'],
      rekord: ['Der Zuschauerrekord beflügelt sie.', 'So viele waren lange nicht dabei.'],
      job: ['Die erledigte Challenge feiern sie noch.', 'Die eingelöste Challenge kam richtig gut an.'],
      brunnen: ['Die Folge BrunnenTV wirkt noch nach.', 'Alle schwärmen noch vom schönen Brunnen.', 'BrunnenTV hat sie glücklich gemacht.'],
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
      troedel: ['Im Chat heißt er gerade Trödeladam.', 'Der Chat hat einen neuen Spitznamen verteilt: Trödeladam.', 'Trödeladam, sagen sie. Liebevoll, aber deutlich.'],
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
  // (when: nur, wenn es gerade stimmt – game.js FACTS)
  { voice: 'karla', text: 'Wir sind auf der Autobahn und streamen in Full HD!', when: 'ab netz' },
  { voice: 'kassandra', text: 'Bitte rechts fahren. Mit freundlichen Grüßen, die Polizei Gifhorn.', when: 'ab' },
  { voice: 'weronika', text: 'Mini Adam, du fährst besser als jedes Navi.' },
  { voice: 'karla', text: 'Hallo Mini Adam! Schreib mal eine Zahl in den Chat. Aber bitte ohne Drei.' },
  { voice: 'william', text: 'Kappandramäßige Zusammenfassung bitte! Ich war beim Schwimmunterricht.' },
  { voice: 'william', text: 'Mein Sack ist nass!' },
  { voice: 'kassandra', text: 'Achtung, Achtung. Das Tralala bitte nicht anfassen.' },
  // Testfahrt 25.11.2026: mehr und abwechslungsreicher (game/durchsagen.js mischt je Stream einen Stapel). Platzhalter:
  // {city} ein Ort aus dem Chat · {ort} der Ort, durch den er fährt (when ort) · {gleich} der nächste auf dem Weg (when
  // gleich) · {ziel} der Zielort und {brunnen} sein Brunnen (when ziel) · {spender} wer eben groß gespendet hat (when
  // spende). Grüße aus Orten auf dem Weg …
  { voice: 'karla', text: 'Liebe Grüße nach {gleich}! Mini Adam ist gleich bei euch, bitte winken.', when: 'gleich' },
  { voice: 'turbo', text: 'Hallo {ort}! Mini Adam fährt gerade durch, also alle schnell lächeln!', when: 'ort' },
  { voice: 'weronika', text: 'Schöne Grüße an alle in {ziel}. Haltet den Brunnen schon mal sauber!', when: 'ziel' },
  { voice: 'amtlich', text: 'Die Stadt {ziel} bittet um pünktliches Erscheinen. Der Brunnen ist geputzt.', when: 'ziel' },
  { voice: 'fluester', text: 'Psst. {ort} ist heute besonders schön. Aber nicht weitersagen.', when: 'ort' },
  { voice: 'karla', text: 'Grüße aus {city}! Bei uns ist es ruhig, darum schauen wir dir zu.' },
  { voice: 'william', text: 'Viele Grüße aus {city}! Bimmel hurra und gute Fahrt!' },
  { voice: 'turbo', text: 'Grüße an König Knolli! Heute ist der Stream ganz königlich.' },
  // … harmlose Mutproben und Fragen an Mini Adam …
  { voice: 'william', text: 'Mini Adam, sag dreimal ganz schnell: Brunnenbürste!' },
  { voice: 'turbo', text: 'Mini Adam, bitte einmal laut Schöner Brunnen rufen. Nur zur Probe!' },
  { voice: 'weronika', text: 'Mini Adam, winkst du bitte einmal in die Kamera? Nur ganz kurz.' },
  { voice: 'karla', text: 'Mini Adam, wie viele Brunnen schaffst du heute? Ich tippe auf ganz viele.' },
  { voice: 'weronika', text: 'Mini Adam, welcher Brunnen war bisher dein liebster?' },
  { voice: 'karla', text: 'Mini Adam, was ist eigentlich dein Lieblingsgetränk? Ich rate: Bananensaft.' },
  { voice: 'weronika', text: 'Mini Adam, spielst du nach dem Stream noch eine Runde Ringtennis?' },
  { voice: 'turbo', text: 'Mini Adam, wie heißt eigentlich die Drohne? Sie verdient einen Namen!' },
  { voice: 'william', text: 'Mini Adam, die Raab-Story bitte noch mal. Ich habe den Anfang verpasst!' },
  { voice: 'william', text: 'Mini Adam, bitte einmal hupen für alle Ehrenmenschen im Chat!' },
  // … erfundene Bekanntmachungen …
  { voice: 'amtlich', text: 'Bekanntmachung: Das Fundbüro meldet einen herrenlosen Plüschbären. Bitte abholen.' },
  { voice: 'amtlich', text: 'Amtliche Mitteilung: Das Hupen ist heute ausdrücklich erlaubt. Bimmel hurra.' },
  { voice: 'kassandra', text: 'Achtung, Achtung. Der Bananensaft im Getränkehalter ist kein Spielzeug.' },
  { voice: 'amtlich', text: 'Sehr geehrter Herr Mini Adam, Ihr Antrag auf mehr Brunnen wurde genehmigt.' },
  { voice: 'amtlich', text: 'Hiermit wird festgestellt: Meister Pünktlich ist noch immer nicht da.' },
  { voice: 'amtlich', text: 'Das Ordnungsamt grüßt den Dachs. Der Efeu ist bereits informiert.' },
  { voice: 'amtlich', text: 'Zur Kenntnisnahme: Das Tralala befindet sich weiterhin an seinem Platz.' },
  { voice: 'amtlich', text: 'Hinweis: Der Code ADAM gilt weiterhin. Gültig für gute Laune und sonst nichts.' },
  // … kleine Witze mit Pointe …
  { voice: 'kassandra', text: 'Was macht ein Brunnen, wenn er traurig ist? Er lässt alles laufen.' },
  { voice: 'weronika', text: 'Warum ist das Navi immer so entspannt? Es kennt jeden Ausweg.' },
  { voice: 'karla', text: 'Was sagt der Akku zur Ladesäule? Du gibst mir echt Energie.' },
  { voice: 'william', text: 'Treffen sich zwei Brunnen. Sagt der eine: Alles im Fluss? Sagt der andere: Läuft.' },
  { voice: 'kassandra', text: 'Treffen sich zwei Leitplanken. Sagt die eine: Wir müssen zusammenhalten.' },
  { voice: 'turbo', text: 'Was ist grün und sitzt im Navi? Ein Frosch. Er sagt immer nur: Quak, bitte wenden.' },
  // … Werbung für Dinge, die es nicht gibt …
  { voice: 'turbo', text: 'Werbung: Plüschbrause, jetzt zuckerfrei! Prickelt wie ein Brunnen, nur im Mund.' },
  { voice: 'kassandra', text: 'Werbung: Der Dachs-Kalender ist da. Zwölf Monate Dachs, und jeder grüßt Efeu.' },
  { voice: 'turbo', text: 'Kurze Werbung: Handkäs-Kaugummi. Hält länger als jede rote Ampel.' },
  { voice: 'weronika', text: 'Werbung: das Navi-Kissen. Es sagt nach hundert Metern leise: Gute Nacht.' },
  { voice: 'fluester', text: 'Werbung, ganz leise: die Flüsterhupe. Für alle, die niemanden wecken wollen.' },
  { voice: 'amtlich', text: 'Werbepause: Brunnenbürste Glanz und Gloria. Für Brunnen, die glänzen wollen.' },
  // … Wetter und Verkehr …
  { voice: 'kassandra', text: 'Der Verkehrsbericht: Auf allen Straßen ist Mini Adam unterwegs. Bitte lächeln.' },
  { voice: 'karla', text: 'Das Wetter: Über dem Stream zieht gute Laune auf, vereinzelt auch Brunnen.' },
  { voice: 'amtlich', text: 'Verkehrsmeldung: Auf der Autobahn fährt ein Mini Adam. Bitte freundlich grüßen.', when: 'ab' },
  // … Running Gags …
  { voice: 'kassandra', text: 'Liebe Grüße an Elsa! Sie steht bestimmt wieder irgendwo am Rand.' },
  { voice: 'weronika', text: 'Hier spricht Meister Pünktlich. Ich bin unterwegs, in Gedanken schon da.' },
  { voice: 'karla', text: 'Dachs grüßt Efeu. Efeu grüßt zurück. Und der Chat grüßt alle beide.' },
  { voice: 'william', text: 'Ringtennis ist der beste Sport der Welt! Wer widerspricht, muss hupen!' },
  { voice: 'kassandra', text: 'Achtung, Achtung. Die Bank in {city} ist frisch gestrichen. Farbe: geheim.' },
  { voice: 'turbo', text: 'Bimmel hurra, Bimmel hurra, Mini Adam ist wieder da!' },
  { voice: 'fluester', text: 'Psst. Die Plüschbrause ist zuckerfrei. Ich habe extra nachgefragt.' },
  { voice: 'fluester', text: 'Ich habe gehört, das Sprachstudio übt heimlich Ringtennis.' },
  { voice: 'fluester', text: 'Ich verrate dir ein Geheimnis. Der Efeu grüßt den Dachs zurück.' },
  { voice: 'turbo', text: 'Hallo hallo hallo! Ich wollte nur sagen: Du bist der Beste. Tschüss!' },
  // … und zur Lage: Autobahn, Ort, Landstraße, später Abend …
  { voice: 'william', text: 'Mini Adam, auf der Autobahn schön rechts bleiben. Die Polizei Gifhorn schaut zu!', when: 'ab' },
  { voice: 'karla', text: 'Die Autobahn gehört heute dir, Mini Adam. Also fast. Die Laster wollen auch.', when: 'ab' },
  { voice: 'weronika', text: 'Mini Adam, die Landstraße steht dir richtig gut.', when: 'land' },
  { voice: 'fluester', text: 'Auf der Landstraße ist es so schön ruhig. Ich flüstere extra leise.', when: 'land' },
  { voice: 'turbo', text: 'Mini Adam, du bist mitten in {ort}! Bitte einmal freundlich nicken!', when: 'ort' },
  { voice: 'amtlich', text: 'Die Gemeinde {ort} begrüßt Mini Adam herzlich. Bitte Schritttempo am Brunnen.', when: 'ort' },
  { voice: 'fluester', text: 'Es ist schon spät. Ich flüstere, damit die Brunnen schlafen können.', when: 'spaet' },
  { voice: 'kassandra', text: 'Achtung, Achtung. Es ist spät. Der Sendeschluss wurde wieder verschoben.', when: 'spaet' },
  // … zum Moment: geblitzt, Rempler, nach einer Folge, Akku, nach dem Laden (Popcorn!), Laune, große Spende …
  { voice: 'william', text: 'Das Blitzerfoto bitte ausdrucken und einrahmen! Bestes Foto des Abends!', when: 'geblitzt' },
  { voice: 'amtlich', text: 'Der Bescheid folgt per Post. Das Foto ist übrigens sehr gelungen.', when: 'geblitzt' },
  { voice: 'weronika', text: 'Kleiner Rempler, großes Herz. Weiter geht es, Mini Adam!', when: 'rempler' },
  { voice: 'kassandra', text: 'Achtung, Achtung. Die Werkstatt lässt grüßen. Sie hat schon Kaffee gekocht.', when: 'rempler' },
  { voice: 'karla', text: 'Was für eine Folge BrunnenTV! Ich habe Gänsehaut bis in die Socken.', when: 'folge' },
  { voice: 'william', text: 'Schöner Brunnen! Den nehme ich in meine Sammlung auf!', when: 'folge' },
  { voice: 'weronika', text: 'Mini Adam, dein Akku sieht müde aus. Gönn ihm bald eine Ladesäule.', when: 'akku' },
  { voice: 'turbo', text: 'Akku leer, Laune voll! Hauptsache, die nächste Säule kommt bald!', when: 'akku' },
  { voice: 'kassandra', text: 'Achtung, Achtung. Popcorn an der Ladesäule ist ab sofort Pflicht.', when: 'geladen' },
  { voice: 'fluester', text: 'Psst, Mini Adam. Hast du noch Popcorn übrig? Ich frage für einen Freund.', when: 'geladen' },
  { voice: 'william', text: 'Akku voll, Popcorn alle! So muss ein Ladestopp aussehen!', when: 'geladen' },
  { voice: 'turbo', text: 'Der Chat feiert, der Chat tanzt, der Chat hat heute richtig Spaß!', when: 'party' },
  { voice: 'karla', text: 'Kopf hoch, lieber Chat. Gleich passiert bestimmt etwas Schönes.', when: 'mau' },
  { voice: 'amtlich', text: 'Mitteilung an den Chat: Die gute Laune ist hiermit offiziell wieder eröffnet.', when: 'mau' },
  { voice: 'william', text: 'Danke an {spender}! So eine Spende, da wackelt ja die Leitplanke!', when: 'spende' },
  { voice: 'kassandra', text: 'Achtung, Achtung. {spender} ist ab sofort Ehrenmensch des Tages.', when: 'spende' },
  // … Ziel und nächster Brunnen, die linke Spur (vor einem Blitzer warnt nie eine Durchsage: das tut nur OMI mit dem
  // Radarwarner) …
  { voice: 'weronika', text: 'Mini Adam, ich freue mich so auf den {brunnen}. Ist er wirklich so schön?', when: 'ziel' },
  { voice: 'karla', text: 'Grüße an den {brunnen} in {ziel}! Wir kommen bald vorbei.', when: 'ziel' },
  { voice: 'amtlich', text: 'Das Navi meldet: Der {brunnen} ist schon ganz nah. Bitte Haltung annehmen.', when: 'nah' },
  { voice: 'fluester', text: 'Bis {ziel} ist es noch weit. Ich mache es mir schon mal gemütlich.', when: 'weit' },
  { voice: 'william', text: 'Die linke Spur ist frei! Aber bitte trotzdem schön vorsichtig, Mini Adam!', when: 'links' },
  { voice: 'turbo', text: 'Linke Spur frei, Chat dabei, Mini Adam fährt wie ein Profi!', when: 'links ab' },
];

export const DURCHSAGEN_REGEN = [
  { voice: 'karla', text: 'Guten Tag, hier ist der Herr mit den Schirmen. Ich würde meine Schirme gerne heute noch abholen.' },
  { voice: 'weronika', text: 'Mini Adam, dein Scheibenwischer winkt mir gerade zu. Ich winke zurück!' },
  { voice: 'kassandra', text: 'Achtung, Achtung. Der automatische Scheibenwischer befindet sich weiterhin in der Beta-Phase.' },
  { voice: 'kassandra', text: 'Treffen sich zwei Scheibenwischer. Fragt der eine: Na, wie läuft’s? Sagt der andere: Hin und her.' },
  // (Testfahrt 25.11.2026: noch zwei fürs Wetter; game/durchsagen.js nimmt die Regenliste mit dem Stichwort regen)
  { voice: 'kassandra', text: 'Der Wetterbericht: Es regnet. Der Scheibenwischer übernimmt die Moderation.' },
  { voice: 'weronika', text: 'Mini Adam, bei diesem Regen sieht jeder Brunnen doppelt so voll aus.' },
];

// ---------------------------------------------------------------------------
// Boardcomputer-Sätze
export const BOARD = {
  leftLane: 'Die linke Fahrspur ist freigeschaltet.',
  // jedes neue Ziel, sobald es steht (game.js announceTarget): {ziel} „Marktbrunnen in Würzburg“
  neuesZiel: 'Neues Ziel: {ziel}!',
  // die nächste Ausfahrt am ersten Vorwegweiser (game.js exitLine): {name} wie auf dem Schild, {d} „1000 Metern“
  exit: {
    ausfahrt: 'Nächste Ausfahrt: {name} in {d}.',
    kreuz: 'Als Nächstes: {name} in {d}.',
    ende: 'Die Autobahn endet in {d}. Alle Spuren führen hinaus.',
    take: 'Dort fahren wir ab.',
    stay: 'Wir bleiben auf der {road}.',
  },
  rain: 'Regen erkannt. Automatische Scheibenwischer aktiviert.',
  // OMI entschuldigt sich ab und zu für den hängenden Wischer
  wiperSorry: [
    'Entschuldigung. Der automatische Scheibenwischer ist noch in der Beta.',
    'Der Scheibenwischer übt noch. Danke für die Geduld.',
    'Die Scheibenwischer stehen. Das ist ein bekanntes Problem.',
    'Das war nicht ich. Das war die Beta-Software.',
  ],
  wiperPhantom: 'Regen erkannt. Ach nein. Doch nicht.',
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
const BERUFE = [
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
// versprochen hat („Wenn {wenn}, spende ich …“). Strecken zählen Reisekilometer (Game.odometer); geladen wird in den
// Ladeparks an den Ausfahrten (REISE.md A5).
export const JOB_TEMPLATES = [
  { id: 'left20', text: '20 Sekunden auf der freigeschalteten linken Spur', goal: 20, stat: 'leftLaneTime', wenn: 'du 20 Sekunden ganz links fährst' },
  { id: 'navi1', text: 'Ein Navi-Ziel erreichen', goal: 1, stat: 'naviReached', wenn: 'du ein Navi-Ziel erreichst' },
  { id: 'near3', text: '3× haarscharf überholen', goal: 3, stat: 'nearMisses', wenn: 'du dreimal haarscharf überholst' },
  { id: 'speed200', text: '200 km/h fahren', goal: 200, stat: 'maxSpeedKmh', wenn: 'du 200 km/h fährst' },
  { id: 'stop1', text: 'Einen Ladestopp einplanen', goal: 1, stat: 'stopsPlanned', wenn: 'du einen Ladestopp einplanst' },
  { id: 'clean40', text: '40 km ohne Blechschaden', goal: 40000, stat: 'cleanDistance', wenn: 'du 40 km ohne Blechschaden schaffst' },
  { id: 'changes25', text: '25 Navi-Gebote überstehen', goal: 25, stat: 'naviChanges', wenn: 'du 25 Navi-Gebote überstehst' },
  { id: 'viewers1000', text: '1.000 Zuschauer erreichen', goal: 1000, stat: 'maxViewers', wenn: 'hier 1.000 Leute zuschauen' },
  { id: 'park1', text: 'An der Ladesäule den Akku füllen', goal: 1, stat: 'parkCharges', wenn: 'du an der Ladesäule den Akku füllst' },
  { id: 'dist50', text: '50 km Strecke schaffen', goal: 50000, stat: 'distance', wenn: 'du 50 km weit kommst' },
  { id: 'blitzfrei', text: 'An einem Blitzer vorbei, ohne geblitzt zu werden', goal: 1, stat: 'blitzerClean', wenn: 'du brav am Blitzer vorbeikommst' },
  { id: 'rain8', text: '8 km im Regen fahren', goal: 8000, stat: 'rainDistance', wenn: 'du 8 km im Regen durchhältst' },
];

// Reise: OMIs Akku-Warnungen nennen den nächsten Ladeplatz auf dem Weg mit Entfernung (trip.js nextRest: ein Ladepark
// oder die Ladesäule eines Orts, „Ladesäule in …“); Taste L oder der Knopf „Ladestopp einplanen“ machen ihn zum
// Zwischenziel. Dort parkt der Wagen an der freien Säule ein und lädt im Zeitraffer voll (Akku.start,
// xxl/charge.js STOP). {pct} Prozent, {park} Name, {km} Weg.
export const REISE_AKKU = {
  warn: [25, 10], // Prozent: OMI warnt, und noch einmal, wenn es knapp wird
  early: 70, // darunter warnt sie früher, sobald der nächste Park der letzte in Reichweite ist
  // … „der letzte“: Dahinter trägt keine Lademöglichkeit weiter, die mindestens past Reisekilometer hinter ihm liegt
  // (in jedem Ort steht eine Ladesäule – die nächsten paar Kilometer verlängern die Fahrt kaum); gesucht wird unter
  // den look nächsten Halten
  past: 15,
  look: 8,
  reserve: 0.85, // so viel des Akkus gilt als sicher nutzbar
  // Prozent je Meter Straße, bis measure Meter davon seit dem Laden gemessen sind (Player.update: auf der Autobahn bei
  // 38 m/s rund 0,0052; echte Straße mischt Rampen und Zubringer um 0,006 mit Orten um 0,0086 – gemessen 0,0053 bis
  // 0,0061 samt dem Halt am Brunnen)
  perM: { open: 0.0052, real: 0.0065 },
  measure: 1500,
  low: 'Akku {pct} Prozent. Nächster Ladestopp: {park}, in {km}. Einplanen?',
  last: 'Akku {pct} Prozent. {park} in {km} liegt noch in Reichweite. Ladestopp einplanen?',
  veryLow: 'Akku nur noch {pct} Prozent! {park} in {km}. Bitte dort laden.',
  planned: 'Akku {pct} Prozent. Der Ladestopp ist eingeplant: {park}, in {km}.',
  none: 'Akku {pct} Prozent, und keine Ladesäule auf dem Weg. Bitte sparsam fahren.',
  set: 'Ladestopp eingeplant: {park}, in {km}.',
  cancel: 'Ladestopp gestrichen.',
  noPark: 'Keine Ladesäule auf dem Weg.',
  missed: 'Ladestopp verpasst. Ich suche die nächste Ladesäule.',
  start: 'Ladestopp: {park}. Ich lade den Akku voll.',
};

// ---------------------------------------------------------------------------
// Shop (bezahlt wird mit den Stream-Einnahmen)
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
    desc: 'Mehr Grip für schnelle Spurwechsel und flotte Kurven, auch bei Regen.',
    effect: (l) => `Haftung +${l * 12}\u00a0%, Spurwechsel +${l * 12}\u00a0%, besserer Nassgrip`,
  },
  {
    // wirkt in src/game/chassis.js (Wanken, Kopf, Kameras: straffer und schneller ruhig) und steering.js (Kurvendrift)
    id: 'fahrwerk', icon: '🛠️', name: 'Sportfahrwerk', cat: 'Fahrwerk', prices: [450, 1100],
    desc: 'Straffere Dämpfer und dickere Stabis: Nach dem Spurwechsel steht der Wagen sofort ruhig, in Kurven hält er die Linie.',
    effect: (l) => `Wanken −${[0, 18, 32][l]}\u00a0%, schneller ruhig, Kurvendrift −${Math.round((1 - 1 / (1 + 0.2 * l)) * 100)}\u00a0%`,
  },
  {
    // wirkt in src/game/player.js (BRAKES, brakeDecel): mehr Verzögerung, bei Nässe weniger Verlust; Bremsweg ∝ 1 / a
    id: 'bremse', icon: '🛑', name: 'Sportbremsen', cat: 'Fahrwerk', prices: [400, 950],
    desc: 'Größere Scheiben und griffigere Beläge: Der Wagen steht früher, auch wenn die Straße nass ist.',
    effect: (l) => `Bremsweg −${Math.round((1 - 1 / (1 + 0.08 * l)) * 100)}\u00a0%, bei Nässe −${Math.round((1 - 0.82 / ((1 + 0.08 * l) * (1 - 0.18 * (1 - 0.25 * l)))) * 100)}\u00a0%`,
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
    id: 'radar', icon: '📟', name: 'Radarwarner', cat: 'Spaß', prices: [250],
    desc: 'Ein Kästchen fürs Armaturenbrett. Es piept, und OMI sagt jeden Blitzer an, bevor es blitzt. Ohne ihn bleibt es beim Überraschungsfoto.',
    effect: () => 'OMI warnt vor jedem Blitzer',
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
    // die Brause aus dem Stream (eine ausgedachte Marke, GAGS.code): nur mit Code ADAM, 10 % günstiger (shopPrice);
    // wirkt in akku.js: der Schub nach dem Ladestopp hält länger (die Brause ist zuckerfrei, Eigentümer 24.11.2026)
    id: 'brause', icon: '🥤', name: 'Plüschbrause-Kiste', cat: 'Spaß', prices: [190], code: { name: 'ADAM', off: 10 },
    desc: 'Eine Kiste zuckerfreie Plüschbrause für den Kofferraum: Nach dem Ladestopp hält der Schub länger. Nur mit Code ADAM!',
    effect: () => 'Schub nach dem Ladestopp 10 statt 6\u00a0s',
  },
  {
    id: 'elsa', icon: '👑', name: 'Wackel-Elsa', cat: 'Deko', prices: [120],
    desc: 'Das Spirit-Animal von SkylineTV LIVE als Wackelfigur fürs Armaturenbrett: die blaue Plüsch-Elsa mit Krönchen und Schärpe.',
    effect: () => 'Wackelt bei jeder Kurve mit',
  },
  {
    id: 'weste', icon: '🦺', name: 'Warnweste', cat: 'Deko', prices: [90],
    desc: 'Für Mini Adam. Bringt nichts, sieht aber sehr professionell aus.',
    effect: () => 'Sichtbar auf der Facecam und in der Startszene',
  },
  {
    id: 'konfetti', icon: '🎉', name: 'Konfetti-Kanone', cat: 'Deko', prices: [200],
    desc: 'Knallt bei jedem erreichten Ziel. Ein paar Schnipsel kleben danach an der Scheibe – wie 2022.',
    effect: () => 'Konfetti bei Navi-Zielen',
  },
];

export const UPGRADE_LIMITS = Object.fromEntries(SHOP.map((s) => [s.id, s.prices.length]));
/** Preis eines Shop-Artikels auf Stufe lvl – mit Rabattcode (it.code: „Code ADAM −10 %“) auf den Cent gerundet. */
export function shopPrice(it, lvl) {
  const p = it.prices[lvl];
  return it.code ? Math.round(p * (100 - it.code.off)) / 100 : p;
}
// Das Megafon ist kein Shop-Artikel mehr (save.js refundMegafon): Titel und Shop sagen es dem, der es gekauft hatte
/** Titel nach einem Stream, der ohne Abspann endete (Seite zu, Absturz): was er gebracht hat (save.js settlePending). */
export const STREAM_GEBUCHT = (km, euro, minus) =>
  minus
    ? `📼 Letzter Stream ohne Abspann gebucht: ${km}, Werkstatt −${euro}.`
    : `📼 Letzter Stream ohne Abspann gebucht: ${km}, +${euro} im Guthaben.`;
export const MEGAFON_ERSTATTET = (euro) => `📢 Das Megafon gehört jetzt zur Ausstattung – deine ${euro} sind zurück im Guthaben.`;

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
  ['Sprachstudio', '?CF und IceBonbon'],
  ['Scheibenwischer', 'Auto-Wischer (Beta)'],
  ['Navigation', 'ferngesteuert vom Chat'],
];
/**
 * Abspann der Reise: die Leute des Streams, mit ausgedachten Berufen (nach ABSPANN_CREW, vor „Danke an“). Ein drittes
 * Feld 'wide' gibt einer langen Zeile die ganze Breite; sie steht darum am Schluss, damit das Raster keine Lücke hat.
 * {folgen}: die BrunnenTV-Folgen dieser Reise (Game.stats.brunnenTV, „1 Folge“, „3 Folgen“); ohne Folge fehlt die Zeile.
 */
export const ABSPANN_REISE = [
  ['Musik', 'Elti und IceBonbon'],
  ['Geek im Hintergrund', 'Arno Nühm'],
  ['Discord', 'Wils und DomZe'],
  ['Raid-Kommando', 'König Knolli'],
  ['Moderation', 'Wils, Walte, AchPünktchen, Delta34st, Eismann077, Cptbalu1991, Kieskauer und Muyinnchen', 'wide'],
  ['BrunnenTV', '{folgen} mit Herrn Schönnbrun', 'wide'],
];
/** Ganz am Ende des Abspanns der Reise, allein und leise (Wortlaut des Eigentümers, unverändert). */
export const GEDENKEN = 'triazanonym (TriazNervensäge) und Pascal (pscldpr) – Behalten wir ewig in Gedanken wie seine historische Texte';
