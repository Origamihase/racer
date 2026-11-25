# Mini Adam – Navi ferngesteuert BrunnenTV XXL

*Live-Eskalationen immer woanders!*

Ein liebevolles, leicht verrücktes 3D-Fahrspiel für den Browser und ein Fan-Spiel rund um
[SkylineTV LIVE](https://skylinetv.live/wiki/index.php?title=Hauptseite).
Mini Adam (Plüsch, schwarze Cap, LIVE-Shirt, Mikrofon) sitzt am Steuer eines schwarzen
**Tesla Model 3 Long Range AWD mit 75-kWh-Akku**. Vom Supercharger in Erlensee aus (jeder weitere Stream beginnt
in einem anderen Ort, etwa Gelnhausen, Bad Vilbel oder Idstein) fährst du über die echte Karte – Autobahnen,
Ausfahrten, Landstraßen und Ortsdurchfahrten –, und der Chat steuert das Navi fern: Jedes Ziel ist der Hauptbrunnen
eines echten Orts.

## Spielen

- **Online:** Nach dem Merge über GitHub Pages: <https://origamihase.github.io/racer/>
  (Pages-Quelle: „GitHub Actions“; die CI baut `main` und veröffentlicht `docs/`, sobald alle Prüfungen grün sind).
- **Lokal:** einmal `npm install && npm run build`, dann `docs/index.html` einfach im Chrome öffnen (Doppelklick
  genügt, kein Server nötig).
  Alternativ `npm run serve` und <http://localhost:8080> aufrufen.

Gebaut für aktuelle Versionen von Google Chrome (Desktop). Tastatur, Gamepad und Touch werden unterstützt. Vollbild gibt
es mit <kbd>F</kbd> oder dem Knopf „Vollbild“ (auf dem iPhone über Teilen → „Zum Home-Bildschirm“).

## Worum geht's?

- **BrunnenTV XXL:** Jedes Navi-Ziel ist der Hauptbrunnen eines Orts, und das Navi nennt ihn
  („Marktbrunnen, Würzburg“). Am Ziel hält Mini Adam neben dem Brunnen, kurbelt das Fahrerfenster herunter und
  macht mit dem Megafon BrunnenTV aus dem Auto: In jeder Folge ruft er tief und langgezogen „Schöner Brunnen!“,
  der Chat jubelt, OMI lobt den Brunnen, und die Folge kommt ins Album. Jede Taste überspringt sie (den Ruf gibt es
  dann beim Losfahren), und die nächste Navi-Runde geht los.
- **Losfahren am Supercharger:** Der Stecker springt aus der Buchse, die Klappe schließt, der Tesla rollt aus dem
  Ladepark des Startorts (der Titel nennt ihn), und die Kamera geht ins Cockpit. In den ersten Minuten erklären kurze Tipps am Bildrand,
  was gerade dran ist (Ausfahrt nehmen, Spurpfeile im Navi, BrunnenTV mit <kbd>B</kbd>, Laden mit <kbd>L</kbd>,
  Kamera, Megafon) – jeder einmal je Spieler,
  <kbd>Enter</kbd> oder ✕ schaltet sie ab.
- **Geld gibt es nur vom Publikum** – wie im echten Stream: Spenden mit Alter-Skala, Ortsspenden, Abos,
  VIPs, Navi-Gebote, Sprachdurchsagen, Rahmen, Aktionen und Sammelaktionen. Fürs Fahren selbst zahlt
  niemand. Aber wer flott, knapp und sauber fährt, hat einen gut gelaunten Chat, und der gibt gern.
- **OMI**, der Boardcomputer (schwarze Kugel mit zwei Augen auf dem Armaturenbrett), sagt
  **„Die linke Fahrspur ist freigeschaltet.“**, sobald ein Zuschauer dafür gespendet hat. Dann darfst du
  eine Minute lang ganz links fahren. Geld bringt das keins – aber wer die Spur nutzt, macht den Chat
  froh, und die nächste Freischaltung kommt etwas schneller. Sonst gilt das Rechtsfahrgebot.
- **„Das Navi-Ziel wurde geändert.“** Die Zuschauer überbieten sich in Zehnern, bis in die Hunderte (und selten
  treibt BontanaBack eine Runde in die Tausender), das Navi plant die Route über echte Straßen neu – Ausfahrt,
  Landstraße, Ortsdurchfahrt. Jedes Gebot landet in der Stream-Kasse, zurück gibt es nichts. Wer am Brunnen steht,
  bevor wieder jemand überbietet, wird mit Ortsspenden gefeiert – danach beginnt die nächste Runde wieder bei 10 €.
  Je zügiger es von Ziel zu Ziel geht, desto zufriedener ist der Chat (das Gesicht oben im Chat).
- **Das Sprachstudio** (🎧) sagt Mini Adam etwa einmal pro Minute ins Ohr, wie der Chat gerade drauf ist,
  und bei einer richtig großen Spende ruft es „Alter!“. Eine Anzeige für die Chat-Stimmung gibt es mit
  Absicht nicht – man muss hinhören und den Chat lesen.
- **Regen für Könner:** Wer lange sauber fährt, bekommt Regen. Der automatische Scheibenwischer will
  anspringen, zuckt aber nur über die Scheibe (Beta!). Mit <kbd>E</kbd> darf man selbst wischen,
  was auch nicht immer klappt. Der Chat liebt es trotzdem.
- **Akku und Blech:** Die Stream-Technik im Kofferraum zieht Strom. Geladen wird in den Ladeparks an den
  Ausfahrten und an der Ladesäule jedes Orts (eine hohe blaue Stele am rechten Rand zeigt sie von weitem): Steht
  oder kriecht der Wagen daneben, bietet der Bildrand das Laden an, und <kbd>L</kbd> (am Gamepad LB, auf dem Handy
  „Jetzt laden“) lädt gleich dort. Anderswo plant dieselbe Taste (der Knopf heißt dann „Ladestopp einplanen“) den
  nächsten Stopp ein, das Navi führt hinein und danach weiter zum Ziel; nur an der geplanten Säule beginnt das Laden
  von selbst. Der Strom kommt auf die Rechnung (Zeile „Ladestrom“): Jeder Ladepark und jede Säule eines Orts hat einen
  festen Preis, den die Bildschirme der Säulen zeigen – in Deutschland 0,46 bis 0,59 € je kWh, im Ausland mehr und in
  der Landeswährung (etwa 0,73 CHF/kWh; abgerechnet wird in Euro). Geladen wird aber immer, auch wenn das Guthaben im
  Minus steht. Bei 10 und bei 5 % warnt der Mittelbildschirm mit einer roten Karte; ist der Akku leer, rollt der Wagen aus,
  und die Fahrt ist zu Ende. Rempler kosten Karosserie-Punkte, die Werkstatt rechnet sie am Brunnen ab (450 € je
  Rempler, 75 € je Kratzer; frontal in den Gegenverkehr je nach Annäherung bis über 2.000 € und ab 90 km/h zwei
  Punkte); zu viel Blechschaden beendet die Fahrt ebenfalls.
- **Live-Chat und Live-Bereich:** Spenden mit Alter-Skala, Sprachdurchsagen, gekaufte Rahmen
  (Rosen, Sonnenblumen, Pappkartons …), Funklöcher, Polizei Gifhorn, Blitzer mit Polaroid,
  Brunnen und die blaue Plüsch-Elsa mit Krönchen und Schärpe am Straßenrand, Bananensaft und Koriander – und ab und zu ein lächerliches
  „5 Cent, wenn du …“-Angebot, auf das Mini Adam natürlich nie eingeht (der Chat legt höchstens 2 Cent drauf).
- **You had 5 Jobs:** Pro Fahrt fünf kleine Aufgaben. Für jede verspricht ein Zuschauer eine Spende
  („Wenn du 200 km/h fährst, spende ich 20 €!“), für alle fünf legt noch jemand ordentlich drauf.
- **Shop:** Mit den Stream-Einnahmen rüstest du den Tesla auf: Beschleunigung, Tempo-Freischaltung,
  Akku-Puffer, Stream-Technik, Sportreifen, Sportfahrwerk, Sportbremsen, Plüsch-Polster, Wischer-Firmware (Beta),
  Radarwarner, Satelliten-Schüssel, Linke-Spur-Sammelaktion, Wackel-Elsa, Warnweste und Konfetti-Kanone. Blitzer
  kommen unangekündigt – nur wer den Radarwarner an Bord hat, hört es vorher piepen und OMI warnen. Das Megafon
  gehört zur Ausstattung (wer es früher gekauft hat, bekommt die 450 € einmal zurück). Schäden, Bußgelder (100 € je
  Blitzerfoto, 50 € Verwarngeld für Standstreifen und Rechtsfahrgebot) und Ladestrom werden immer ganz gebucht und
  dürfen das Guthaben ins Minus ziehen (im HUD steht es mit den Einnahmen des laufenden Streams, im Minus rot); dann
  bleibt der Shop zu, bis spätere Streams es wieder ins Plus bringen – gespielt und geladen wird trotzdem.
- **Abspann** mit Abrechnung, Statistik, Blitzerfotos, erlogener Berufsbezeichnung des Tages und einem
  „Danke an“ – größte Spende, wer Abos verschenkt hat und wer neu VIP geworden ist.

## Steuerung

| Aktion | Tastatur | Gamepad | Touch |
| --- | --- | --- | --- |
| Lenken | ← → oder A D | Linker Stick | ◀ ▶ |
| Strom geben | ↑ oder W | RT oder Steuerkreuz ↑ | Strom |
| Bremsen | ↓ oder S | LT oder Steuerkreuz ↓ | Bremse |
| Rückwärtsgang: im Stand die Bremse halten (½ s), zurück in D mit Strom | ↓ oder S | LT oder Steuerkreuz ↓ | Bremse |
| Hupen (Brunnen und Elsa grüßen) | Leertaste | A | 📯 |
| Scheibenwischer von Hand | E | X | 🌧️ |
| Megafon | H | Y | 📢 |
| Laden: neben Säule oder Bucht gleich hier, sonst Ladestopp einplanen | L | LB | 🔌 Jetzt laden / Ladestopp einplanen |
| BrunnenTV unterwegs (neben einem Brunnen anhalten) | B | RB | ⛲ BrunnenTV hier |
| Kamera (Cockpit / Drohne) | V | B | 🎥 |
| Chat ein/aus | C | – | – |
| Ton aus | M | – | – |
| Vollbild an/aus (auch Knopf im Menü und in der Pause) | F | – | ⛶ im Menü |
| Pause | Esc oder P | Start | ⏸ |

Guthaben, Upgrades, Rekorde, besuchte Orte, Einstellungen und das Album der BrunnenTV-Folgen werden im Browser
gespeichert (`localStorage`). In den Einstellungen lassen sich Ton, Sprachausgabe, Chat, Facecam, Lenkung und
Grafikqualität umstellen.

## Entwicklung

Der Quellcode liegt in `src/`, gebaut wird mit [esbuild](https://esbuild.github.io/) zu einer einzigen
Datei `docs/game.js` (inklusive [three.js](https://threejs.org/), MIT-Lizenz). Dadurch läuft das Spiel
auch direkt per `file://`.

```bash
npm install
npm run build   # baut docs/game.js
npm run dev     # baut bei jeder Änderung neu (mit Sourcemap)
npm run serve   # startet einen kleinen Webserver auf Port 8080
npm test        # alle Prüfstände, parallel (npm test -- xxl geld: nur diese)
npm run smoke   # Browser-Probe: lädt docs/index.html in Chromium und fährt kurz an
```

Für `npm run smoke` braucht es einmal `npx playwright install chromium`.

`docs/game.js` wird **nicht** eingecheckt (steht in `.gitignore`): Es ist ein gebautes Bundle, und als eine einzige
große Datei im Repo hat es fast jedem zweiten Pull Request nach einem fremden Merge einen Konflikt beschert. Lokal
baut `npm run build` es, für GitHub Pages baut es die CI.

Die CI (`.github/workflows/ci.yml`) prüft jeden Pull Request und jeden Stand von `main`: Sie baut `docs/game.js` aus
`src/`, `src/map/data.js` und `shapes.js` müssen genau der Ausgabe von `npm run map` entsprechen, und
`npm test` (alle Prüfstände) muss durchlaufen. Parallel dazu lädt die Browser-Probe (`npm run smoke`) das gebaute
Spiel in Chromium, startet eine Fahrt, pausiert sie und simuliert einen Grafikverlust. Fällt einer der Schritte durch, nennt die CI den Befehl, der fehlt.
Auf `main` veröffentlicht der Job „Pages“ danach genau dieses gebaute `docs/` – nur, wenn alles grün ist. Dafür steht
unter *Settings → Pages → Build and deployment* die Source auf „GitHub Actions“.

| Ordner | Inhalt |
| --- | --- |
| `src/main.js` | Renderer, Kameras, Zustände (Titel, Startszene, Fahrt, Halt am Brunnen, Abspann), Hauptschleife |
| `src/scenes/` | Szenen-Regie: Startszene am Supercharger, Ladestopp im Park, BrunnenTV am Ziel (Kontext aus `main.js`) |
| `src/camera/` | Orbit-Kamera der Drohne (Abspann), ohne Browser prüfbar |
| `src/game/` | Spiellogik: Fahrt über die Karte (`trip.js`), Fahrphysik, Navi-Auktion, Stream-Kasse und Chat-Stimmung (`economy.js`), Ereignisse, Album; `game.js` mit seinen Teilen in `parts/` (Spur und Wetter, Ziel, Ereignisse, Stream); eigene Klassen für Akku und Ladestopps (`akku.js`) und das Sprachstudio (`studio.js`), die vom Spiel nur ihre Liste (`AKKU_HOST`, `STUDIO_HOST`) lesen |
| `src/map/` | Karte (Knoten, Straßen, Orte), Routen, Navi-Bildschirm, große Karte, Kartendaten |
| `src/world/` | Autobahn, Himmel, Verkehr (mit Spurwechseln); `xxl/`: die Welt der Reise (Ausfahrten, Landstraßen, Orte, Tafeln, Ladeparks); `kit/`: Stadtbaukasten und Brunnen |
| `src/models/` | Tesla, Mini Adam, Elsa, Fahrzeuge |
| `src/cockpit/` | Cockpit, OMI, Mittelbildschirm mit Navi |
| `src/fx/` | Regen, Tropfen auf der Scheibe, zuckender Wischer, Bild-Effekte |
| `src/ui/` | HUD, Chat, Menüs, Shop, Abspann |
| `src/data.js` | Alle Texte, Insider-Orte, Rahmen, Durchsagen und Shop-Artikel |

Mit `?debug` in der Adresse gibt es `window.__MA` für automatisierte Tests.

## Fan-Projekt

Ein inoffizielles Fan-Spiel ohne Verbindung zu SkylineTV. Alle Insider stammen aus dem
SkylineTV LIVE Wiki, eine Übersicht mit Quellen steht in [INSIDER.md](INSIDER.md).
In Erinnerung an Adam Wolke – danke für die Live-Eskalationen.
