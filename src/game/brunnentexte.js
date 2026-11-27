// Jede Folge BrunnenTV spricht über ihren Brunnen (der Besitzer am 27.11.2026 zum Vorschlag „Jede Folge spricht über
// ihren Brunnen“: „1 und 3 klingen toll“). Seit dem Brunnenpass (world/kit/brunnenpass.js) hat jeder Ort seinen eigenen
// Hauptbrunnen mit Figur, Stein, Fassung und Namen, berühmte Orte ihren echten Brunnen; der Steckbrief (steckbrief.js)
// sagt in einer Zeile, was der Ort ist. Daraus entstehen hier die Sätze einer Folge: Mini Adams Gruß durchs Megafon,
// Zeilen im Chat, OMIs Satz danach und ab und zu ein Zuschauer, der etwas über den Ort weiß.
//
// Der Ruf „Schöner Brunnen!“ bleibt in jeder Folge, wie er ist (der Besitzer, 27.11.: „‚Schöner Brunnen‘ muss wirklich
// immer sein, sonst ist es kein BrunnenTV“) – er steht nicht hier, sondern in data.js SCHOENER_BRUNNEN.
//
// Längen: Ein Gruß (mega) muss vor dem Ruf zu Ende gesprochen sein, mit Mini Adams Stimme also höchstens gut 38
// Zeichen (Game.brunnenMegafon filtert ohnehin, was zu lang ist; tools/brunnentexte-test.mjs prüft, dass jeder Brunnen
// genug passende Grüße hat). OMIs Satz bleibt unter 91 Zeichen wie ihr längster Bordsatz (tools/sicht-check.js LONG).
// Platzhalter: {brunnen} der Name des Brunnens, {ort} der Ort, {stein} der Stein, {n} die Folge.
// Reine Daten und Logik ohne Grafik (läuft unter Node).
import { places } from '../map/graph.js';
import { passOf, STONES } from '../world/kit/brunnenpass.js';
import { profileOf, fountainName, SPECIAL } from '../world/kit/layout.js';

/** Was jede Figur sagen lässt: mega (Gruß durchs Megafon), chat (der Chat dazu), omi (OMIs Satz nach dem Ruf). */
export const FIGUR = {
  bergmann: {
    mega: ['Glück auf, Bergmann!', 'Glück auf! Hier ist BrunnenTV!', 'Schicht im Schacht? Nein: BrunnenTV!'],
    chat: ['Glück auf! ⛏️', 'Der Bergmann hat Feierabend verdient', 'Glück auf, Glück auf! ⛏️⛲', 'Kumpel am Brunnen 😍'],
    omi: ['Ein Bergmann am Brunnen. Endlich mal Wasser, das man nicht abpumpen muss.', 'Glück auf! Die Grubenlampe der Figur leuchtet nicht. Ich habe nachgesehen.'],
  },
  winzer: {
    mega: ['Prost, lieber Winzer! Mit Wasser!', 'Hallo Winzer! Schöne Trauben!', 'BrunnenTV im Weinort, zum Wohl!'],
    chat: ['Der Winzer hat Wasser statt Wein 😂', 'Zum Wohl! 🍇', 'Schorle-Brunnen wann? 🍇💦', 'Trauben am Brunnen, edel'],
    omi: ['Der Winzer hält eine Traube. Ich habe die Trauben gezählt: alle aus Stein.', 'Dieser Brunnen führt Wasser. Für den Wein ist der Winzer zuständig.'],
  },
  marktfrau: {
    mega: ['Guten Tag, liebe Marktfrau!', 'Was kostet das Wasser, Marktfrau?', 'Frisches Wasser! Hier ist BrunnenTV!'],
    chat: ['Was hat die Marktfrau im Korb? 🧺', 'Zwei Kilo Äpfel bitte 🍎', 'Marktfrau ❤', 'Mitleidskauf bei der Marktfrau! 🛍️'],
    omi: ['Die Marktfrau hat ihren Korb voll. Heute ist Markttag am Brunnen.', 'Ich habe mit der Marktfrau verhandelt. Das Wasser bleibt kostenlos.'],
  },
  moench: {
    mega: ['Grüß Gott, lieber Mönch!', 'Psst! Ganz leise: BrunnenTV!', 'Ein stiller Brunnen. Ein schöner!'],
    chat: ['Der Mönch ist ganz entspannt 🙏', 'Ruhe bitte, hier wird geplätschert 🤫', 'Mönch am Brunnen, sehr friedlich'],
    omi: ['Der Mönch schaut freundlich. Ich glaube, er mag das Plätschern.', 'Hier ist es so ruhig, dass ich meine eigenen Lüfter höre.'],
  },
  kaiser: {
    mega: ['Majestät, hier ist BrunnenTV!', 'Ein Hoch auf den Kaiser! Und Brunnen!', 'Ehre, wem Ehre gebührt: dem Brunnen!'],
    chat: ['Majestät 👑', 'Der Kaiser lässt grüßen', 'Kaiserwetter am Brunnen 👑☀️', 'Verbeugung vor dem Kaiser 🙇'],
    omi: ['Ein Kaiser auf dem Brunnen. Ich habe ihm unseren Stream als Audienz eingetragen.', 'Majestät sitzt trocken, das Becken ist voll. So soll es sein.'],
  },
  justitia: {
    mega: ['Hohes Gericht, hier ist BrunnenTV!', 'Urteil: Schöner Brunnen!', 'Im Namen des Chats: BrunnenTV!'],
    chat: ['Urteil: ein Brunnen ⚖️', 'Freispruch für den Brunnen! ⚖️💦', 'Die Waage ist im Gleichgewicht', 'Justitia ❤ ⚖️'],
    omi: ['Justitia hält die Waage. Ich habe nachgewogen: Wasser und Chat im Gleichgewicht.', 'Das Urteil des Gerichts: Dieser Brunnen darf weiter plätschern.'],
  },
  neptun: {
    mega: ['Ahoi, Neptun! Hier ist BrunnenTV!', 'Neptun, Herr der Meere: Hallo!', 'Gott des Wassers? Dann richtig hier!'],
    chat: ['Neptun mit Gabel 🔱', 'Der Meeresgott wohnt jetzt hier 🔱💦', 'Neptun, gib mir Wellen 🌊', 'Achtung, Dreizack! 🔱'],
    omi: ['Neptun hält seinen Dreizack. Ich habe gefragt: Er ist für Brunnen zuständig.', 'Der Gott der Meere hat sich für einen kleinen Brunnen entschieden. Gute Wahl.'],
  },
  ritter: {
    mega: ['Edler Ritter, hier ist BrunnenTV!', 'Rüstung glänzt, Wasser plätschert!', 'Hallo Herr Ritter! Schönes Schwert!'],
    chat: ['Ritter am Brunnen ⚔️', 'Der bewacht den Brunnen 🛡️', 'Rost am Ritter? Nein, Patina!', 'Ritter Sport? 😂'],
    omi: ['Der Ritter bewacht den Brunnen. Seit Jahrhunderten keinen einzigen Diebstahl.', 'Ich habe die Rüstung geprüft. Sie ist wasserdicht, im Gegensatz zum Becken.'],
  },
  fischer: {
    mega: ['Petri Heil, lieber Fischer!', 'Was gefangen? Hier ist BrunnenTV!', 'Hallo Fischer! Beißt was?'],
    chat: ['Petri Heil! 🎣', 'Der Fischer hat seinen Fang dabei 🐟', 'Im Brunnen angeln ist verboten 😂', 'Fischbrötchen wann? 🐟'],
    omi: ['Der Fischer hat einen Fang im Netz. Im Becken ist aber nur Wasser.', 'Petri Heil. Ich habe den Fisch der Figur vermessen: ein kapitaler Brocken.'],
  },
  bauer: {
    mega: ['Guten Morgen, lieber Bauer!', 'Hallo Bauer! Gute Ernte heute?', 'BrunnenTV vom Land! Hallo!'],
    chat: ['Bauer am Brunnen, ehrliche Arbeit 🌾', 'Wo sind die Kühe? 🐄', 'Gute Ernte! 🌾', 'Landluft und Brunnen 😍'],
    omi: ['Der Bauer stützt sich auf seine Harke. Wasser für die Felder gibt es hier reichlich.', 'Ich empfehle diesen Brunnen allen Pflanzen im Umkreis.'],
  },
  nymphe: {
    mega: ['Hallo, liebe Nymphe!', 'Quellnymphe, hier ist BrunnenTV!', 'Was für eine elegante Figur!'],
    chat: ['So elegant 😍', 'Die Nymphe ist auf Sendung ✨', 'Die schönste Figur heute', 'Quellwasser deluxe 💦'],
    omi: ['Die Nymphe ist die Hüterin der Quelle. Sie hat uns gerade freundlich zugenickt.', 'Eine Quellnymphe. Ich habe sie gefragt, wie das Wasser heute ist: ausgezeichnet.'],
  },
  narr: {
    mega: ['Helau und Alaaf! BrunnenTV!', 'Hallo, lieber Narr! Schöne Kappe!', 'Narrenfreiheit am Brunnen!'],
    chat: ['Helau! 🤡', 'Der Narr ist auf Sendung 😂', 'Narrenkappe am Brunnen 🎭', 'Konfetti für den Narren! 🎉'],
    omi: ['Ein Narr auf dem Brunnen. Ich glaube, er macht sich über das Becken lustig.', 'Der Narr läutet mit seiner Schelle. Ich habe zurückgeklingelt.'],
  },
  rotkaeppchen: {
    mega: ['Hallo Rotkäppchen! Wo ist der Wolf?', 'Es war einmal ein schöner Brunnen!', 'Rotkäppchen, hier ist BrunnenTV!'],
    chat: ['Rotkäppchen ❤ 🧺', 'Wo ist der Wolf?? 🐺', 'Es war einmal ein Brunnen ✨', 'Märchenbrunnen 😍'],
    omi: ['Rotkäppchen hat den Korb dabei. Kuchen und Wein für die Großmutter, laut Märchen.', 'Ich habe den Wald abgesucht. Kein Wolf weit und breit. Gute Nachricht.'],
  },
  herkules: {
    mega: ['Starker Herkules, hier ist BrunnenTV!', 'Hallo Herkules! Muskeln wie Stein!', 'Herkules, du starker Brunnen!'],
    chat: ['Herkules 💪', 'Beinahe so stark wie Mini Adam 💪😂', 'Der hat bestimmt zwölf Aufgaben', 'Muskelbrunnen 💪💦'],
    omi: ['Herkules ruht sich aus. Nach zwölf Aufgaben hat er sich diesen Brunnen verdient.', 'Ich habe die Muskeln der Figur gemessen. Ergebnis: sehr viel Stein.'],
  },
  heinzel: {
    mega: ['Hallo Heinzelmännchen! Fleißig?', 'Wer hat hier aufgeräumt? BrunnenTV!', 'Kleine Helfer, großer Brunnen!'],
    chat: ['Die Heinzelmännchen! ❤', 'Wer räumt hier nachts auf? 😄', 'Heinzelmännchen, bitte das Cockpit putzen 🧹', 'So fleißig 😍'],
    omi: ['Die Heinzelmännchen arbeiten nur nachts. Darum ist der Brunnen so sauber.', 'Ich habe die Heinzelmännchen gebeten, das Cockpit aufzuräumen. Keine Antwort.'],
  },
  engel: {
    mega: ['Hallo, kleiner Engel!', 'Ein Engel am Brunnen! BrunnenTV!', 'Himmlischer Brunnen hier!'],
    chat: ['Engelchen 😇', 'Himmlisch schön ✨', 'Der Engel passt auf uns auf 😇', 'So ein süßer Engel ❤'],
    omi: ['Ein Engel wacht über dem Becken. Seitdem ist hier nichts mehr übergelaufen.', 'Himmlisches Wasser. Mein Messwert für Schönheit ist gerade nach oben gegangen.'],
  },
  madonna: {
    mega: ['Grüß Gott! Was für ein Brunnen!', 'Ein feierlicher Brunnen! BrunnenTV!', 'Ganz ruhig und schön hier!'],
    chat: ['Ein wunderschöner alter Brunnen ✨', 'Sehr feierlich hier 🙏', 'So friedlich ❤', 'Der Platz hat was'],
    omi: ['Die Marienfigur ist liebevoll gepflegt. Hier achtet jemand auf seinen Brunnen.', 'Ein feierlicher Brunnen. Ich habe meine Lautstärke ein wenig heruntergedreht.'],
  },
  gelehrter: {
    mega: ['Herr Professor, hier ist BrunnenTV!', 'Wissenschaft plätschert! Hallo!', 'Frage an den Gelehrten: Schön, oder?'],
    chat: ['Der Professor liest Wasserkunde 📚', 'Brunnen mit Doktortitel 🎓', 'Gelehrter Brunnen, kluges Wasser 🤓', 'Prüfung bestanden 🎓'],
    omi: ['Der Gelehrte liest in seinem Buch. Ich habe nachgefragt: Es geht um Brunnen.', 'Dieser Brunnen hat einen Doktortitel. Ich habe die Arbeit gelesen: plätschernd gut.'],
  },
  schmied: {
    mega: ['Hallo Schmied! Heißes Eisen heute?', 'Hammer! Hier ist BrunnenTV!', 'Klopf klopf, Herr Schmied!'],
    chat: ['Der Schmied hat einen Hammer 🔨', 'Hammer Brunnen! 🔨😂', 'Hier wird das Eisen gekühlt 💦', 'Schmiedekunst 😍'],
    omi: ['Der Schmied kühlt sein Eisen im Brunnen. Ich habe die Temperatur geprüft: alles gut.', 'Hammer, Amboss, Wasser. Ein Brunnen mit Handwerk.'],
  },
  waescherin: {
    mega: ['Hallo, fleißige Wäscherin!', 'Waschtag am Brunnen! BrunnenTV!', 'Saubere Sache, dieser Brunnen!'],
    chat: ['Wäsche im Brunnen 🧺💦', 'Waschtag! 🧼', 'Bring meine Socken mit 🧦', 'Blitzsauber hier ✨'],
    omi: ['Die Wäscherin hat früher hier gewaschen. Ich empfehle heute die Waschstraße.', 'Ich habe das Wasser geprüft: sauber genug für Wäsche, aber bitte nicht den Tesla.'],
  },
  baer: {
    mega: ['Hallo, lieber Bär! Brummbrumm!', 'Ein Bär am Brunnen! BrunnenTV!', 'Bärenstark, dieser Brunnen!'],
    chat: ['BÄÄÄR 🐻', 'Bärenstark 🐻💪', 'Der Bär hat Durst 🐻💦', 'Kuschelbär am Brunnen ❤'],
    omi: ['Der Bär trinkt aus dem Becken. Ich habe ihn gefragt: Er ist aus Plüsch im Herzen.', 'Ein Bär am Brunnen. Bitte nicht füttern, er ist aus Metall.'],
  },
  loewe: {
    mega: ['Hallo, stolzer Löwe!', 'Brüllend schöner Brunnen!', 'Der Löwe brüllt: BrunnenTV!'],
    chat: ['Der Löwe 🦁', 'ROAAAR 🦁', 'König der Brunnen 🦁👑', 'Brüllend schön 🦁💦'],
    omi: ['Der Löwe brüllt nicht, er plätschert. Das ist mir viel lieber.', 'Ich habe dem Löwen einen Gruß gesendet. Er hat stolz zurückgeschaut.'],
  },
  adler: {
    mega: ['Hallo Adler! Flieg nicht weg!', 'Ein Adler am Brunnen! BrunnenTV!', 'Adlerauge, sei wachsam!'],
    chat: ['Adler 🦅', 'Der Adler sieht alles 🦅👀', 'Hoch hinaus 🦅', 'Wappentier am Brunnen 😍'],
    omi: ['Der Adler breitet die Flügel aus. Er hat uns sicher schon von weitem gesehen.', 'Ein Adler, der nicht wegfliegt. Mein Lieblingsvogel.'],
  },
  pferd: {
    mega: ['Hallo, schönes Pferd!', 'Hü hott! Hier ist BrunnenTV!', 'Pferdestärken treffen Plätschern!'],
    chat: ['Pferdchen 🐴', 'Mehr PS als der Tesla? 🐴😂', 'Das Pferd hat Durst 🐴💦', 'Wiiiehhh 🐴'],
    omi: ['Ein Pferd am Brunnen. Früher wurden hier Pferde getränkt, heute Zuschauer.', 'Eine Pferdestärke aus Bronze. Der Tesla hat ein paar mehr.'],
  },
  hirsch: {
    mega: ['Hallo, stolzer Hirsch!', 'Ein Hirsch am Brunnen! BrunnenTV!', 'Was für ein Geweih!'],
    chat: ['Hirsch 🦌', 'Das Geweih! 😍🦌', 'Der Platzhirsch 🦌', 'Waldbrunnen ❤🌲'],
    omi: ['Ich habe die Enden des Geweihs gezählt. Es sind viele. Ein ehrwürdiger Hirsch.', 'Der Hirsch ist hier der Platzhirsch. Im wahrsten Sinne.'],
  },
  hahn: {
    mega: ['Kikeriki! Hier ist BrunnenTV!', 'Guten Morgen, lieber Gockel!', 'Der Hahn kräht: BrunnenTV!'],
    chat: ['KIKERIKI 🐓', 'Gockel am Brunnen 😂🐓', 'Der weckt das ganze Dorf', 'Hahn im Korb 🐓'],
    omi: ['Der Hahn kräht nicht. Ich habe es für ihn erledigt: Kikeriki.', 'Ein Gockel am Brunnen. Er ist hier eindeutig der Chef.'],
  },
  fisch: {
    mega: ['Blubb blubb! Hier ist BrunnenTV!', 'Hallo, lieber Fisch!', 'Ein Fisch, der Wasser speit! Toll!'],
    chat: ['Blubb 🐟', 'Der Fisch spuckt Wasser 😂🐟', 'Fischbrunnen ❤', 'Nemo?? 🐠'],
    omi: ['Der Fisch speit Wasser ins Becken. Er hat sich die Arbeit gut ausgesucht.', 'Ein Fisch am Brunnen. Endlich hat er genug Wasser.'],
  },
  storch: {
    mega: ['Klapper klapper! Hallo Storch!', 'Hallo Storch! Bringst du was?', 'Ein Storch am Brunnen! BrunnenTV!'],
    chat: ['Storch 🪶', 'Klapperstorch! 😄', 'Der Storch bringt Brunnen 😂', 'Langes Bein, schöner Brunnen'],
    omi: ['Der Storch steht auf einem Bein. Ich habe es nachgemacht. Es klappt nicht.', 'Ein Storch am Brunnen. Hier ist man auf Nachwuchs eingestellt.'],
  },
  ochse: {
    mega: ['Muh! Hier ist BrunnenTV!', 'Hallo, kräftiger Ochse!', 'Ochsenstark, dieser Brunnen!'],
    chat: ['Muuuh 🐂', 'Ochsenstark 💪🐂', 'Der zieht den Brunnen 😂', 'Ochs am Brunnen 😍'],
    omi: ['Der Ochse sieht stark aus. Ich glaube, er könnte den Tesla ziehen.', 'Ein Ochse am Brunnen. Er trinkt hier seit Jahrhunderten umsonst.'],
  },
  gans: {
    mega: ['Hallo, liebe Gans! Schnatter!', 'Gänse und Brunnen! BrunnenTV!', 'Schnatter schnatter! Hallo!'],
    chat: ['Schnatter 🪿', 'Gänseliesel? 🪿❤', 'Die Gans wackelt bestimmt 😂', 'Gänsebrunnen 😍'],
    omi: ['Die Gans schnattert nicht. Sie ist aus Bronze. Ich schnattere für sie.', 'Ich habe die Gans gezählt. Es ist eine. Genau richtig für einen Brunnen.'],
  },
  anker: {
    mega: ['Ahoi! Anker gesetzt! BrunnenTV!', 'Ahoi, ihr Landratten!', 'Leinen los für BrunnenTV!'],
    chat: ['Ahoi! ⚓', 'Anker gesetzt ⚓💦', 'Seemannsbrunnen 😍', 'Leinen los! ⛵'],
    omi: ['Der Anker hält den Brunnen fest. Wir treiben nicht ab.', 'Ein Anker am Brunnen. Hier legen Schiffe und Teslas gerne an.'],
  },
  kogge: {
    mega: ['Ahoi, Kogge! Volle Fahrt!', 'Hanse-Gruß vom BrunnenTV!', 'Ein Schiff im Brunnen! Toll!'],
    chat: ['Die Kogge ⛵', 'Die Kogge segelt und segelt und kommt nie an ⛵', 'Hanse-Brunnen 😍', 'Schiff ahoi! ⛵💦'],
    omi: ['Die Kogge war das Schiff der Hanse. Hier fährt sie seit Ewigkeiten auf der Stelle.', 'Ich habe den Kurs der Kogge berechnet. Ergebnis: Sie bleibt im Brunnen.'],
  },
  krone: {
    mega: ['Eine Krone auf dem Brunnen! Hallo!', 'Majestätischer Brunnen hier!', 'Krönung der Folge: BrunnenTV!'],
    chat: ['Die Krone 👑', 'Königlicher Brunnen 👑💦', 'Elsa will die Krone 👑🐟', 'Krönchen richten 👑'],
    omi: ['Die goldene Krone glänzt. Elsa hat gefragt, ob sie die ausleihen darf.', 'Ein gekrönter Brunnen. Ich verneige mich digital.'],
  },
  globus: {
    mega: ['Hallo Welt! Hier ist BrunnenTV!', 'Die ganze Welt auf einem Brunnen!', 'Weltkugel, wir grüßen dich!'],
    chat: ['Hallo Welt 🌍', 'Wo sind wir auf dem Globus? 🌍', 'Weltreise am Brunnen 😂🌍', 'Die Erde ist rund, der Brunnen auch'],
    omi: ['Auf der Weltkugel habe ich unseren Standort gesucht. Wir sind genau hier.', 'Die ganze Welt auf einem Brunnen. Ich habe sie einmal gedreht. Sie dreht sich nicht.'],
  },
  zahnrad: {
    mega: ['Hallo Zahnrad! Läuft wie geschmiert!', 'Industrie trifft Brunnen! Hallo!', 'Alles greift ineinander: BrunnenTV!'],
    chat: ['Zahnrad ⚙️', 'Läuft wie geschmiert ⚙️💦', 'Industriebrunnen 😍', 'Mehr Öl! 😂⚙️'],
    omi: ['Das Zahnrad greift in nichts. Aber es sieht sehr fleißig aus.', 'Ein Zahnrad am Brunnen. Als Maschine fühle ich mich hier verstanden.'],
  },
  zirbel: {
    mega: ['Eine goldene Zirbelnuss! Hallo!', 'Hallo Zirbel! Glänzt aber schön!', 'Gold am Brunnen! BrunnenTV!'],
    chat: ['Die Zirbelnuss ✨', 'Ist das ein Tannenzapfen? 🌲😂', 'Goldener Zapfen 😍', 'Zirbel! Wie in Augsburg'],
    omi: ['Die Zirbelnuss ist kein Tannenzapfen. Ich wurde dazu mehrfach korrigiert.', 'Eine goldene Zirbelnuss. Ich habe den Glanz gemessen: maximal.'],
  },
  manneken: {
    mega: ['Hallo, kleiner Mann! Na, na, na!', 'Manneken, hier ist BrunnenTV!', 'Der berühmteste kleine Brunnen!'],
    chat: ['MANNEKEN PIS 😂', 'Der Kleine hat keine Hemmungen 😂💦', 'Der hat mehr Kostüme als Mini Adam Mützen', 'So klein und so berühmt'],
    omi: ['Das Manneken Pis ist nur gut fünfzig Zentimeter groß. Berühmt ist es trotzdem.', 'Das Manneken hat über tausend Kostüme. Heute trägt es nichts. Ich schaue weg.'],
  },
};

/**
 * Berühmte Brunnen (die Orte aus brunnenpass.js REAL und die beiden Sonderbrunnen): eigene Grüße, Chat und OMI,
 * dazu fakt (ein Zuschauer weiß etwas darüber; nur, was sicher stimmt). Sie gehen den Sätzen der Figur vor.
 */
export const ECHT = {
  'Frankfurt am Main': {
    mega: ['Hallo Justitia! Hallo Frankfurt!', 'Römerberg, hier ist BrunnenTV!'],
    chat: ['Der Gerechtigkeitsbrunnen 😍⚖️', 'Römerberg! Heimspiel! 🏙️', 'Skyline-Stadt, Skyline-Brunnen'],
    omi: ['Die Justitia auf dem Römerberg trägt keine Augenbinde. Sie sieht also auch den Chat.'],
    fakt: 'Die Frankfurter Justitia hat keine Augenbinde 👀⚖️',
  },
  Bern: {
    mega: ['Grüezi, Justitia! BrunnenTV!', 'Hallo Bern! Was für Farben!'],
    chat: ['Grüezi! 🇨🇭', 'So bunt bemalt 😍', 'Berner Brunnen sind die besten'],
    omi: ['Die Berner Justitia trägt eine Augenbinde. Ich habe ihr den Stream beschrieben.'],
    fakt: 'Bern hat über hundert Brunnen in der Altstadt ⛲',
  },
  'Brüssel': {
    mega: ['Bonjour, Manneken! BrunnenTV!', 'Hallo Brüssel! Hallo kleiner Mann!'],
    chat: ['MANNEKEN PIS 😂', 'Der Kleine kennt keine Scham 😂', 'Bonjour Bruxelles! 🇧🇪'],
    omi: ['Das Manneken Pis hat über tausend Kostüme. Heute hat es frei.'],
    fakt: 'Das Manneken Pis hat einen ganzen Kleiderschrank: über 1000 Kostüme 👕',
  },
  Genf: {
    mega: ['Bonjour Genf! Was für ein Strahl!', 'Jet d’eau, hier ist BrunnenTV!'],
    chat: ['Der Strahl ist RIESIG 😱💦', 'Bis in die Wolken ☁️💦', 'Höher als der Chat-Rekord'],
    omi: ['Der Jet d’eau spritzt etwa 140 Meter hoch. Ich bleibe lieber im Wagen.'],
    fakt: 'Der Jet d’eau in Genf schießt rund 140 Meter hoch 💦',
  },
  Wien: {
    mega: ['Servus Wien! Hier ist BrunnenTV!', 'Hochstrahlbrunnen, servus!'],
    chat: ['Servus! 🇦🇹', 'Wiener Brunnen-Schmäh 😂', 'Melange und Brunnen ☕⛲'],
    omi: ['Der Hochstrahlbrunnen leuchtet abends bunt. Am Tag reicht ihm das Wasser.'],
    fakt: 'Abends wird der Hochstrahlbrunnen in Wien bunt beleuchtet 🌈',
  },
  Wiesbaden: {
    mega: ['Hallo Kochbrunnen! Schön warm?', 'Wiesbaden, hier ist BrunnenTV!'],
    chat: ['Kochbrunnen 🔥💦', 'Nicht anfassen, heiß! 😅', 'Wellness-Brunnen 🧖'],
    omi: ['Das Wasser des Kochbrunnens kommt sehr heiß aus der Erde. Bitte keine Hand hineinhalten.'],
    fakt: 'Der Kochbrunnen in Wiesbaden ist eine heiße Quelle, das Wasser kommt mit über 60 Grad heraus 🔥',
  },
  Kassel: {
    mega: ['Hallo Herkules! Grüße an Elsa!', 'Kassel, hier ist BrunnenTV!'],
    chat: ['Elsa-Stadt! 👑🐟', 'Herkules oben auf dem Berg 💪', 'Kassel ❤'],
    omi: ['In Kassel wacht Herkules hoch über der Stadt. Hier unten wacht sein kleiner Bruder.'],
    fakt: 'Oben im Bergpark von Kassel steht der große Herkules, mit Wasserspielen darunter 💪💦',
  },
  Chicago: {
    mega: ['Hello Chicago! BrunnenTV!', 'Buckingham, hier ist BrunnenTV!'],
    chat: ['Den kenn ich aus dem Fernsehen! 📺', 'Eine schrecklich nette Familie! 😂', 'Hello from Germany 🇩🇪'],
    omi: ['Diesen Brunnen kennt man aus dem Vorspann einer Fernsehserie. Jetzt auch aus BrunnenTV.'],
    fakt: 'Der Buckingham-Brunnen war im Vorspann von „Eine schrecklich nette Familie“ 📺',
  },
  Aachen: {
    mega: ['Hallo Kaiser Karl! BrunnenTV!', 'Aachen, hier ist BrunnenTV!'],
    chat: ['Karl der Große 👑', 'Printen wann? 🍪', 'Kaiserstadt ❤'],
    omi: ['Karl der Große steht auf dem Marktbrunnen. Er hat Aachen zu seiner Lieblingsstadt gemacht.'],
    fakt: 'Auf dem Aachener Marktbrunnen steht Karl der Große 👑',
  },
  Bamberg: {
    mega: ['Hallo Gabelmann! BrunnenTV!', 'Bamberg, hier ist BrunnenTV!'],
    chat: ['GABELMANN 🔱😂', 'Der heißt wirklich Gabelmann', 'Bamberg ist so schön 😍'],
    omi: ['Die Bamberger nennen ihren Neptun Gabelmann. Wegen der Gabel. Sehr logisch.'],
    fakt: 'Die Bamberger nennen ihren Neptunbrunnen einfach Gabelmann 🔱',
  },
  Berlin: {
    mega: ['Hallo Berlin! Hallo Neptun!', 'Hauptstadt, hier ist BrunnenTV!'],
    chat: ['Berlin, Berlin! 🐻', 'Neptun mit vier Flüssen 🌊', 'Hauptstadtbrunnen 😍'],
    omi: ['Um Neptun sitzen vier Frauen. Sie stehen für Rhein, Elbe, Oder und Weichsel.'],
    fakt: 'Die vier Frauen am Berliner Neptunbrunnen stehen für Rhein, Elbe, Oder und Weichsel 🌊',
  },
  Braunschweig: {
    mega: ['Hallo Till Eulenspiegel!', 'Braunschweig, hier ist BrunnenTV!'],
    chat: ['Eulenspiegel 🦉🪞', 'Der hat bestimmt was ausgeheckt 😂', 'Narrenbrunnen ❤'],
    omi: ['Till Eulenspiegel sitzt hier mit Eule und Spiegel. Ich halte meine Kamera lieber fest.'],
    fakt: 'Till Eulenspiegel sitzt auf dem Brunnen mit Eule und Spiegel 🦉🪞',
  },
  'Köln': {
    mega: ['Alaaf, Heinzelmännchen!', 'Köln, hier ist BrunnenTV!'],
    chat: ['Kölle Alaaf! 🎉', 'Die Erbsen! 😂', 'Heinzelmännchen ❤'],
    omi: ['Die Heinzelmännchen gingen, als jemand Erbsen auf die Treppe streute. Ich streue nichts.'],
    fakt: 'Laut Sage verschwanden die Kölner Heinzelmännchen wegen der Erbsen auf der Treppe 🫛',
  },
  Mainz: {
    mega: ['Helau, Mainz! Hier ist BrunnenTV!', 'Mainzer Marktbrunnen, hallo!'],
    chat: ['Helau! 🎭', 'Mainz bleibt Mainz 😄', 'Was für ein alter Brunnen 😍'],
    omi: ['Der Mainzer Marktbrunnen ist einer der ältesten Renaissancebrunnen in Deutschland.'],
    fakt: 'Der Mainzer Marktbrunnen gehört zu den ältesten Renaissancebrunnen Deutschlands ⛲',
  },
  'München': {
    mega: ['Servus München! BrunnenTV!', 'Marienplatz, hier ist BrunnenTV!'],
    chat: ['Servus! 🥨', 'Marienplatz ❤', 'Geldbeutel waschen! 💶💦'],
    omi: ['Am Aschermittwoch waschen die Münchner hier ihren Geldbeutel. Unserer bleibt trocken.'],
    fakt: 'Am Fischbrunnen in München wäscht man am Aschermittwoch den Geldbeutel 💶💦',
  },
  Stuttgart: {
    mega: ['Hallo Galatea! BrunnenTV!', 'Stuttgart, hier ist BrunnenTV!'],
    chat: ['Galatea ✨', 'Grüß Gott, Stuttgart!', 'Schwäbischer Brunnen 😍'],
    omi: ['Galatea steht hoch über dem Becken. Sie hat den besten Blick auf den Tesla.'],
    fakt: 'Die Figur auf dem Galateabrunnen in Stuttgart ist die Meeresnymphe Galatea 🌊',
  },
  Salzburg: {
    mega: ['Servus Salzburg! BrunnenTV!', 'Residenzbrunnen, servus!'],
    chat: ['Servus! 🇦🇹', 'Die Pferde! 🐴😍', 'Mozartkugel wann? 🍫'],
    omi: ['Der Residenzbrunnen ist einer der größten Barockbrunnen nördlich der Alpen.'],
    fakt: 'Der Residenzbrunnen gilt als größter Barockbrunnen nördlich der Alpen 🐴',
  },
  Valletta: {
    mega: ['Bonġu Valletta! BrunnenTV!', 'Hallo Tritonen! BrunnenTV!'],
    chat: ['Malta! ☀️', 'Drei Tritonen 🔱', 'Urlaubsbrunnen 🏖️'],
    omi: ['Drei Tritonen tragen hier eine große Schale. Ich habe ihnen Kraft gewünscht.'],
    fakt: 'Am Stadttor von Valletta tragen drei Tritonen die große Brunnenschale 🔱',
  },
  Hanau: {
    mega: ['Hallo Hanau! Es war einmal!', 'Märchenbrunnen, hier ist BrunnenTV!'],
    chat: ['Brüder-Grimm-Stadt! 📖', 'Es war einmal ein Brunnen ✨', 'Hanau ❤'],
    omi: ['In Hanau wurden die Brüder Grimm geboren. Darum wohnen hier die Märchen.'],
    fakt: 'Die Brüder Grimm sind in Hanau geboren 📖',
  },
  Kopenhagen: {
    mega: ['Hej Kopenhagen! BrunnenTV!', 'Hallo Gefion! BrunnenTV!'],
    chat: ['Hej! 🇩🇰', 'Die Ochsen! 🐂💦', 'Wikinger-Brunnen 😄'],
    omi: ['Gefion pflügt mit vier Ochsen. Laut Sage hat sie so eine ganze Insel gezogen.'],
    fakt: 'Laut Sage hat Gefion mit vier Ochsen die Insel Seeland aus dem Land gepflügt 🐂',
  },
  Rom: {
    mega: ['Ciao Roma! Hier ist BrunnenTV!', 'Trevi, hier ist BrunnenTV!'],
    chat: ['Münze werfen! 🪙', 'Über die Schulter, nicht vergessen 🪙', 'Ciao! 🇮🇹', 'Dolce Vita ⛲'],
    omi: ['Wer eine Münze über die Schulter in den Trevi-Brunnen wirft, kommt zurück. Ich werfe eine.'],
    fakt: 'Wer eine Münze in den Trevi-Brunnen wirft, kommt nach Rom zurück 🪙',
  },
  Augsburg: {
    mega: ['Hallo Ursprung! Hier fing alles an!', 'Augsburg, hier ist BrunnenTV!', 'Zurück am Ursprung! BrunnenTV!'],
    chat: ['DER URSPRUNG 😱⛲', 'Hier hat alles angefangen ❤', 'Historischer Moment 🏛️', 'Zurück zu den Wurzeln'],
    omi: ['Hier begann BrunnenTV. Ich habe diesen Brunnen als Denkmal gespeichert.', 'Der Ursprung. Ich habe die Zirbelnuss gegrüßt, ganz offiziell.', 'Am Ursprung ist das Wasser besonders historisch. Messwert: unbezahlbar.'],
    fakt: 'Hier fing BrunnenTV an: der Ursprung ⛲',
  },
  'Nürnberg': {
    mega: ['Der Endgegner! Hier ist BrunnenTV!', 'Nürnberg, wir sind bereit!', 'Bosskampf am Brunnen! BrunnenTV!'],
    chat: ['DER ENDGEGNER 😱', 'Bosskampf! ⚔️⛲', 'Das ist der schönste Brunnen 😍', 'Endgegner besiegt? 🏆'],
    omi: ['Der Endgegner ist sehr hoch. Ich habe ihn vermessen und meine Messung bewundert.', 'Endgegner erreicht. Ich speichere den Spielstand, nur zur Sicherheit.', 'So viele Figuren an einem Brunnen. Ich habe aufgehört zu zählen.'],
    fakt: 'In Nürnberg steht der Endgegner unter den Brunnen ⛲🏆',
  },
};

/** OMI über den Stein ({stein}), wenn der Brunnen umgefärbt ist. */
export const STEIN_OMI = [
  'Ich habe den Stein gescannt: {stein}. Er stammt aus der Gegend.',
  'Dieser Brunnen ist aus {stein}. Der Chat findet, er steht ihm gut.',
  '{stein}, sauber gearbeitet. Meine Steinanalyse vergibt fünf von fünf Tropfen.',
];

/** OMI über die Fassung der Figur. */
export const FASSUNG_OMI = {
  gold: ['Die Figur ist vergoldet. Ich habe den Glanz gemessen und musste kurz die Augen schließen.', 'Gold am Brunnen. Bitte nicht in die Stream-Kasse einzahlen.'],
  bunt: ['Die Figur ist bunt bemalt. Jemand hat hier mit sehr viel Liebe gepinselt.', 'So bunt wie der Chat. Ich mag diese Figur.'],
  bronze: ['Bronze mit grüner Patina. Das ist kein Schmutz, das ist Würde.'],
  dunkel: ['Die Figur ist dunkel gefasst. Sehr elegant, wie Mini Adams Shirt.'],
  stein: ['Die Figur ist aus Stein gehauen. Ich habe großen Respekt vor dem Steinmetz.'],
};

/** Gruß mit dem Namen des Brunnens (für jeden Ort; zu lange fallen von selbst heraus). */
export const NAME_MEGA = ['Hallo {brunnen}!', 'Achtung, {brunnen}! BrunnenTV!', '{brunnen}, du bist auf Sendung!'];

/** Ein Zuschauer, der etwas über den Ort weiß (die Zeile des Steckbriefs), und wie oft das kommt. */
export const FAKT = {
  chance: 0.45,
  // (der Zuschauer schreibt die Zeile des Steckbriefs ab: „{ort}: …“)
  zeile: ['📖 Wusstet ihr? {ort}: {t}', '📖 Ich hab nachgelesen: {ort}, {t}', '📖 Kurz zu {ort}: {t}'],
};

/** So oft kommt der Gruß, OMIs Satz und eine Chatzeile vom Brunnen (sonst die allgemeinen aus data.js). */
export const ANTEIL = { mega: 0.75, omi: 0.75 };

/**
 * Die Sätze einer Folge an einem Ort (places-Index oder Ort): { brunnen (Name), mega, chat, omi (Listen, die Platzhalter
 * noch drin), fakt (eine Chatzeile über den Ort oder null) }. Ohne Pass (unbekannter Ort) leere Listen.
 */
export function folgeTexte(at) {
  const place = typeof at === 'number' ? places[at] : at;
  const out = { brunnen: null, ort: place ? place.name : '', stein: null, mega: [], chat: [], omi: [], fakt: null, echt: false };
  if (!place) return out;
  const key = place.key ?? place.name;
  const pass = passOf(place);
  out.brunnen = fountainName(place);
  const real = ECHT[key];
  const fig = pass && pass.fig ? FIGUR[pass.fig] : null;
  if (real) {
    out.echt = true;
    out.mega.push(...real.mega);
    out.chat.push(...real.chat);
    out.omi.push(...real.omi);
    out.fakt = real.fakt;
  }
  if (fig) {
    out.mega.push(...fig.mega);
    out.chat.push(...fig.chat);
    // (ein echter Brunnen hat seinen eigenen OMI-Satz; die der Figur kommen dazu)
    out.omi.push(...fig.omi);
  }
  if (!SPECIAL[key]) out.mega.push(...NAME_MEGA);
  const st = pass && STONES[pass.stone];
  if (st && st.hex !== null && !SPECIAL[key]) {
    out.stein = st.name;
    out.omi.push(...STEIN_OMI);
  }
  if (pass && pass.fig && FASSUNG_OMI[pass.mat]) out.omi.push(...FASSUNG_OMI[pass.mat]);
  if (!out.fakt) {
    const t = profileOf(place).note;
    if (t) out.fakt = { tpl: FAKT.zeile, t };
  }
  return out;
}

/** Füllt die Platzhalter eines Satzes der Folge. */
export function fuelle(text, T, n = 1) {
  return text
    .replaceAll('{brunnen}', T.brunnen ?? 'Brunnen')
    .replaceAll('{ort}', T.ort ?? '')
    .replaceAll('{stein}', T.stein ? T.stein[0].toUpperCase() + T.stein.slice(1) : 'Stein')
    .replaceAll('{n}', String(n));
}
