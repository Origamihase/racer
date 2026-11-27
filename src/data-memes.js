// Memes aus dem Wiki-Export, aus Zeitung, Radio und TV und aus dem Podcast „Henke's Corner #72“ (21.02.2025), die der
// Besitzer am 27.11.2026 freigegeben hat („Versuch alles zu verwenden“). Gespielt werden sie in src/game/memes.js (mit
// eigenem Zufall, wie die Running Gags in gags.js); was zu einer bestehenden Stelle gehört (Durchsagen, Abspann,
// Steckbriefe, Navi-Hinweise), steht dort. Echte Menschen nur mit dem Namen, den der Insider ihnen gibt (Walte,
// König Knolli, Rollstuhl-Holger) – nie mit dem echten. Die Berichte über Adams Tod sind nie Stoff für einen Gag.
//
// Stichworte am Anfang einer Zeile wie in CHAT.meme (game/parts/ereignisse.js FACTS): Die Zeile kommt nur, wenn jedes
// gerade gilt. Für Orte gilt ein Stichwort, wenn der Ort das Navi-Ziel ist oder der Wagen gerade durch ihn fährt.

/**
 * Was der Chat ab und zu schreibt (Memes.updateChat). Jede Zeile kommt je Stream höchstens einmal.
 * Ohne Stichwort: kleine Insider (Wüstenrot 2017 drei Kinder und zwei Atomkraftwerke, der sprechende Kaktus vom
 * Flohmarkt 2022, Reutlingen, der Hase mit Sitzplatz in Nizza, Kopfhörer im Gulli in San Francisco, Krabbencocktail-
 * Chips aus London, die Laternen-Superkraft, Walte als Sparfuchs, Elsa im Schaufenster-Fernseher, die Biografie aus
 * dem Podcast, die Fleetball-WM aus Buxtehude 2017).
 */
export const MEME_CHAT = [
  'Was machen eigentlich deine drei Kinder? Und die zwei Atomkraftwerke? ☢️',
  'Sag dem Kaktus, er soll billiger werden 🌵',
  'Ich komme übrigens aus Reutlingen. Nur damit ihr Bescheid wisst 😄',
  'Kriegt der Hase heute wieder einen eigenen Sitzplatz? 🐇',
  'Kopfhörer gut festhalten, nicht dass sie wieder im Gulli landen 🎧',
  'Krabbencocktail-Chips für Mini Adam! 🦀',
  'Wo ist der Kameramann mit der Laternen-Superkraft? 🏮',
  'Walte nimmt bestimmt wieder das bessere Hotelzimmer. Sparfuchs 🦊',
  'Hab gerade Elsa im Fernseher im Schaufenster gesehen. Elsa-Inception 🐟📺',
  'Titel der Biografie: »13 SIM-Karten waren nicht genug«. Ich kauf sie sofort 📖',
  'Gab es die Fleetball-WM eigentlich wirklich? 🏸',
  'Was hat Kanzler Adam eigentlich als Zweites beschlossen? 😄',
  // König Knolli raidet gerade (Instagram 20.05.2026)
  '[raid] Proben wir heute wieder den Tigerangriff? 🐯',
  '[raid] König Knolli, Tigerangriff auf drei! 🐯👑',
  // Hamburg: Rollstuhl-Holger aus den Sprachdurchsagen (am 29.03.2018 vergessen, er wartet noch immer) und das
  // Rollstuhlexperiment vom 27.08.2020 (der Besitzer: „So konnten wir einen Perspektivwechsel sehen“) – der Witz ist
  // das Warten, nie der Rollstuhl
  '[hamburg] Hat eigentlich schon jemand Rollstuhl-Holger abgeholt? Der wartet seit 2018 🙈',
  '[hamburg] Kurz anhalten? Rollstuhl-Holger wartet bestimmt noch auf uns 🚏',
  '[hamburg] Weißt du noch, das Rollstuhlexperiment 2020? Ein ganzer Stream Perspektivwechsel ❤',
  // Trier: Schlössertour 23.01.2021 und Moseltour 13.02.2021, beide Male nicht erreicht
  '[trier] Trier im Navi? Das hat noch nie geklappt 😂',
  '[trier] Schlössertour, Moseltour … jetzt der dritte Versuch nach Trier 🍷',
  '[trier] Ich glaube erst an Trier, wenn die Porta Nigra im Bild ist',
  // Fulda: Platzverweis vom Weihnachtsmarkt am 09.12.2021, eine Woche später Glühwein zur Versöhnung (Fuldaer Nachrichten)
  '[fulda] Achtung, Ordnungsamt Fulda! Diesmal bitte nicht vom Weihnachtsmarkt fliegen 🎄',
  '[fulda] Bauchbinde bereithalten: »Gleich geht es weiter« 😂',
  '[fulda] Fulda hat sich ja mit Glühwein entschuldigt ☕❤',
  // Bonn 11.05.2017: der KiBa, der nie ausgegeben wurde
  '[bonn] Wo bleibt eigentlich der KiBa für den Herrn aus Bonn? 🍹',
  '[bonn] Die KiBa-Schuld von 2017 ist immer noch offen!',
  // Dortmund: scharfe Currywurst, danach die Pappe ablecken, der Eimer Wasser (Dresden 2017, Berlin)
  '[dortmund] Nach der scharfen Wurst die Pappe ablecken! Der Eimer Wasser steht bereit 🌶️🪣',
  // Köln: mit der BahnCard ins Studiopublikum von TV Total (Podcast)
  '[koeln] Hier saß Adam früher im Studiopublikum von TV Total 📺',
  '[koeln] Mit der BahnCard zur Studioaufzeichnung, das waren Zeiten 🚆',
  // Konstanz 18.05.2017: Ein Reporter des Südkuriers gab dem Sprachstudio seinen Namen
  '[konstanz] In Konstanz hat das Sprachstudio seinen Namen bekommen 🎧',
  // Lübeck/Travemünde: Goldschmied wäre sein Handwerk geworden (Podcast)
  '[luebeck] Travemünde! Hier hätte Adam Goldschmied werden können 💍',
  // Gifhorn: der Hausmeister, der „alle Frequenzen löschen“ ließ (Podcast: der Ursprung des Gifhorn-Memes)
  '[gifhorn] Sie löschen jetzt alle Frequenzen! 📡',
  '[gifhorn] Wo ist der Hausmeister? Alle Frequenzen löschen! 😂',
  // Polnisch statt Französisch in der Schule (Podcast)
  '[polen] Dzień dobry! Endlich wird das Schulpolnisch gebraucht 🇵🇱',
  '[frankreich] Französisch hatte er in der Schule abgewählt. Wird spannend 😅',
  // BrunnenTV: Klinkenputzen von klein auf (Podcast, Predigtdienst von Tür zu Tür)
  '[tv] An fremden Türen klingeln konnte er schon als Kind. BrunnenTV ist nur die Fortsetzung 🚪⛲',
  '[tv] Klinkenputzen für den Brunnen. Profi am Werk 😄',
  // im Ort: die Ein-Guide-Regel und die „Strafe“ Schuh zubinden (Siegen 08.11.2018)
  '[ort] Ein-Guide-Regel! Wer zuerst winkt, dem wird der Schuh gebunden 👟',
  // ein Übertragungswagen steht am Rand (Memes.uewagen)
  '[uewagen] Da steht ein Ü-Wagen! Hupen, dann sind wir im Fernsehen 📺',
];

/** Frage und Antwort, je Stream einmal: Physalis heißt jedes Mal anders (Bielefeld „Mirabellen“, Potsdam „Äpfel“). */
export const MEME_PAARE = [
  ['[laden] Sind das da drüben Mirabellen? 🍑', 'Nein, Äpfel.', 'Das ist Physalis 😂'],
  ['Wer hat eigentlich die meisten Zooms gezählt? 🔍', 'Ich führe seit Augsburg 2017 Liste 📋'],
];

/**
 * Mini Adams eigene Zeilen im Chat (Podcast: unter fast jeder Nachricht 🙌 und 🌠, dazu der alte Lächler 🙂). Er
 * schreibt nach einem erreichten Ziel (ziel), nach einer Folge BrunnenTV (folge) oder einfach so (sonst); der Chat
 * erkennt ihn daran (echo). Abzeichen im Chat: STREAMER.
 */
export const ADAM_CHAT = {
  name: 'Mini Adam',
  badge: 'STREAMER',
  ziel: ['Angekommen 🙌🌠', 'Danke Chat 🙌🌠', 'Geschafft 🙂', 'Ihr seid die Besten 🙌'],
  folge: ['Schöner Brunnen 🙌🌠', 'Danke fürs Zuschauen 🌠', 'Das war eine schöne Folge 🙂'],
  sonst: ['Gute Fahrt allen 🌠', 'Weiter geht es 🙌', 'Hallo zusammen 🙂', 'Schön, dass ihr da seid 🙌🌠'],
  echo: ['Da sind sie wieder, 🙌 und 🌠', 'Echter Adam-Stil 🙌🌠', 'Die Sternschnuppe darf nie fehlen 🌠', '🙌🌠'],
};

/**
 * Wie alt ist Mini Adam? (Podcast: Als Kind gab es keine Geburtstage, er muss bis heute rechnen.) Einer fragt, Mini
 * Adam antwortet kurz, der Chat spielt mit der Alter-Skala.
 */
export const ALTER_FRAGE = {
  frage: ['Wie alt bist du eigentlich, Mini Adam?', 'Mini Adam, wie alt bist du?', 'Ganz ehrlich: Wie alt bist du?'],
  antwort: ['Moment, ich rechne kurz 🙂', 'Gute Frage. Ich rechne kurz 🙂', 'Moment … ich rechne noch 🙌'],
  echo: ['Alter! 😂', 'Mittelalter? 🏰', 'Er rechnet noch 😂', 'Ein ganzes Alter, mindestens'],
};

/** Pi auf 250 Stellen (Podcast): Bei der Zahlen-Aktion schreibt einer Pi, der Rest zählt die Dreien. */
export const PI = {
  zahl: '3,14159265358979323846',
  echo: ['Pi! Da sind sogar zwei Dreien drin 🤓', 'Wer kann weiter als 250 Stellen? 😂', 'Synchron mit dem Kreis 🤝', 'Streber 😄'],
};

/**
 * Das Sitcom-Lachen (Podcast: Adam lacht meist nach innen; seine Idee: Schreibt der Chat LOL, spielt ihm eine KI ein
 * Lachen vom Band ins Ohr). Der Chat lacht in einem Schwall (lol), man hört kurz das Lachen vom Band (audio.js
 * sitcomLaugh), und das Sprachstudio sagt es an (studio).
 */
export const LOL = {
  lol: ['LOL', 'LOL 😂', 'lol', 'LOOOL', 'LOL!!!', '😂😂😂', 'lol 😂'],
  studio: ['Der Chat lacht.', 'Kurze Meldung: Der Chat lacht gerade sehr.', 'Ich lese viele LOL. Der Chat lacht.'],
};

/**
 * Der Zoom-Zähler (Augsburg 04.05.2017 und Hannover 22.06.2017: Seitdem zählt der Chat jeden Zoom). Ein Zoom ist
 * jeder Wechsel der Kamera und jedes Öffnen der Kofferraum-Kamera ({n}: der wievielte im Stream).
 */
export const ZOOM = ['Zoom Nr. {n}! 🔍', 'ZOOM {n} 🔍', 'Zoom Nummer {n}, ich zähle mit 📋', 'Und das war Zoom {n} 🔍'];

/** Das Fleetball-Set im Kofferraum (Buxtehude 15.06.2017, 28 Euro, reiste mit und kam fast nie zum Einsatz). */
export const FLEETBALL = {
  chat: ['Ist das da hinten das Fleetball-Set?! 🏸', 'Das Fleetball-Set für 28 Euro fährt immer noch mit 😂', 'Fleetball-Set gesichtet!'],
  streit: ['Die Fleetball-WM gab es wirklich!', 'Fleetball-WM? Nie gehört 🤔', 'Einmal ausgepackt seit 2017 😂', 'Wann wird endlich gespielt? 🏸'],
};

/**
 * Die Glücksrad-Spende (Live-Bereich: Wer mindestens die Hälfte des führenden Gebots fürs Glücksrad gibt, lässt das
 * Rad den Ort wählen). Am linken Rand dreht ein kleines Rad über die Orte, auf die gerade geboten wird; wo es stehen
 * bleibt, ist das neue Ziel – die Navi-Durchsage bleibt dieselbe wie bei jedem Gebot.
 */
export const GLUECKSRAD = {
  james: '🎡 {name} spendet {betrag} fürs Glücksrad! Das Rad wählt das nächste Ziel.',
  chat: ['GLÜCKSRAD! 🎡', 'Dreh, dreh, dreh! 🎡', 'Bitte nicht Siegen 😂', 'Jetzt entscheidet das Schicksal 🎡', 'Das Rad hat immer recht'],
  danach: ['Das Rad hat gesprochen 🎡', 'Schicksal! 😂', 'Gutes Rad', 'Na dann, auf nach {ort}!'],
};

/** Wo ist Walte? (Laboe 30.01.2022: „Wo ist Walter?“ mit Kamera-Zoom.) Walte versteckt sich am Brunnenplatz. */
export const WALTE = {
  frage: ['Wo ist Walte? 🔍', 'Ich hab Walte gesehen! Irgendwo am Platz 👀', 'Walte versteckt sich wieder 😄'],
  tipp: '🔍 Walte am Brunnen entdeckt? Dann hupen ({taste})!',
  gefunden: ['DA IST WALTE! 🎉', 'Gefunden! Walte Walte Walte', 'Adleraugen! 🦅'],
  james: '🔍 {name} spendet {betrag}: Walte gefunden!',
  weg: ['Walte war wieder zu gut versteckt 😅', 'Nächstes Mal finden wir ihn'],
};

/**
 * Sammelaktion Streamabbruch (Moseltour 13.02.2021: „Technik kaputt, dunkel, kalt, reicht für heute“ füllte die
 * Aktion). Claudia startet sie selten, und nur nach einer langen Fahrt; wird sie voll, endet der Stream liebevoll mit
 * dem Abspann.
 */
export const ABBRUCH = {
  name: 'Streamabbruch',
  start: 'Sammelaktion gestartet: »{name}« – Ziel: {ziel}. Wird sie voll, ist für heute Schluss 🌙',
  chat: ['Nein, nicht abbrechen! 😭', 'Ich zahl dagegen!', 'Doch, ab ins Bett 😴', 'Dunkel und kalt ist es wirklich', 'Technik kaputt? Läuft doch 😂'],
  voll: 'Die Sammelaktion ist voll: Technik kaputt, dunkel, kalt, reicht für heute. Gute Nacht! 🌙',
  omi: 'Der Chat hat entschieden: Für heute ist Schluss. Danke fürs Zuschauen.',
};

/** Countdown-Ampeln mit QR-Code „Grün kaufen“ (Jerewan 24.05.2025: Adams Idee). Der Chat bietet natürlich 5 Cent. */
export const AMPEL = ['5 Cent für Grün! 🚦', 'QR-Code scannen, Grün kaufen 😂', 'Ich kauf die Ampel grün! 💶', 'Countdown-Ampel, wie Adam es wollte 🚦'];

/** Die 0900-Tombola (Podcast: als Kind Flyer „Tolle Gewinne!“ verteilt; niemand rief an, aber Omas schenkten Kekse). */
export const TOMBOLA = [
  'Da hängt ein Zettel: »Tombola! Tolle Gewinne!« 😂',
  'Tombola-Zettel! Ruft da jemand an? ☎️',
  'Niemand hat damals angerufen, aber es gab Kekse von den Omas 🍪',
  'Die 0900-Tombola lebt! 🎟️',
];

/**
 * Ein Übertragungswagen am Rand (Stuttgarter Zeitung 26.10.2026: Er schlich sich in eine Quizshow, eine Bundesliga-
 * Übertragung und die Lokalzeit). Wer hupt, ist kurz im Fernsehen.
 */
export const UEWAGEN = {
  gesehen: '📺 Ü-Wagen am Rand! Hupen ({taste}) bringt Adam ins Fernsehen',
  tv: ['WIR SIND IM FERNSEHEN! 📺', 'Mama, ich bin im Fernsehen! 😂', 'Reingeschlichen, wie immer 📺', 'Clip it, das läuft heute Abend in der Lokalzeit 🎬'],
  vorbei: ['Nicht gehupt? Kein Fernsehen 😅', 'Da war die Kamera, und keiner hat gehupt'],
};

/** Knöllchen am Ladepark (Laboe 30.01.2022: Parkticket vergessen). Kommt auf die Abrechnung als Verwarngeld. */
export const KNOELLCHEN = {
  toast: '🧾 Knöllchen am Wischer: Parkschein vergessen! {betrag}',
  chat: ['KNÖLLCHEN! 😂', 'Parkschein vergessen, wie in Laboe', 'Hab ich drauf gewettet! 🤑', 'Das Ordnungsamt war schneller'],
};

/** Der Pizzaautomat im Ladepark (12.04.2022: defekt). Das Popcorn bleibt bei Adams eigener Maschine. */
export const PIZZA = ['Der Pizzaautomat ist schon wieder defekt 😂', 'Pizzaautomat: defekt. Wie immer 🍕', 'Gut, dass es Popcorn gibt 🍿', 'Ein Automat, der funktioniert? Nicht hier 😄'];

/**
 * Wischwasser (21.08.2021, Heimfahrt mit Mond: Adam lernt Wischwasser kennen). Der Tank leert sich mit jedem Wisch;
 * ist er leer, schmiert der Wischer nur noch (die Scheibe bleibt schlierig), bis Mini Adam im Ladepark nachfüllt.
 */
export const WISCHWASSER = {
  leer: 'Wischwasser leer. Bitte beim nächsten Ladestopp nachfüllen.',
  chat: ['Wischwasser leer 😂', 'Jetzt schmiert er nur noch', 'Adam lernt Wischwasser kennen 🧴', 'Ich seh nur Schlieren'],
  voll: '🧴 Wischwasser nachgefüllt. Adam lernt Wischwasser kennen!',
  jubel: ['WISCHWASSER! 🎉', 'Premiere! 🧴', 'Endlich klare Sicht', 'Seit 21.08.2021 ein Profi 🧴'],
};

/** Radio Nordfriesland (06.02.2020 Sylt: Interview beim Inselradio, der Interviewer war Stammzuschauer). */
export const INSELRADIO = {
  name: 'Radio Nordfriesland',
  gruss: 'Moin Mini Adam, Gruß an die Küste!',
  chat: ['Moin! 🌊', 'Radio Nordfriesland, wie damals auf Sylt 📻', 'Der Interviewer war doch Stammzuschauer 😄', 'Inselradio! 🏝️'],
};

/** Das Megafon bei BrunnenTV im Ausland (Podcast: Polnisch statt Französisch). {ort}: der Ort. */
export const MEGAFON_AUSLAND = {
  PL: ['Dzień dobry, {ort}! Tu BrunnenTV!', 'Dzień dobry! Piękna fontanna!'],
  FR: ['Bonjour? … Hallo {ort}! Hier ist BrunnenTV!', 'Bonjour? Äh … schöner Brunnen!'],
};

/** Gifhorn: lustige Namen über den Lautsprecher des Supermarkts ausrufen lassen (Podcast, der erste Gifhorn-Stream). */
export const SUPERMARKT = [
  'Herr Lade Säule, bitte zur Kasse drei. Herr Lade Säule, bitte.',
  'Frau Anna Nas wird an der Information erwartet.',
  'Herr Rainer Zufall, Ihr Einkaufswagen wartet am Ausgang.',
];
