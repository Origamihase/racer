# Mini Adam – Tesla-Navi ferngesteuert

*Live-Eskalationen immer woanders!*

Ein liebevoller, leicht verrückter 3D-Autobahn-Racer für den Browser und ein Fan-Spiel rund um
[SkylineTV LIVE](https://skylinetv.live/wiki/index.php?title=Hauptseite).
Mini Adam (Plüsch, schwarze Cap, LIVE-Shirt, Mikrofon) sitzt am Steuer eines schwarzen
**Tesla Model 3 Long Range AWD mit 75-kWh-Akku**. Du fährst aus der Cockpit-Ansicht über eine
vierspurige Autobahn bei Tag, weichst dem Verkehr aus und schaffst so viel Strecke wie möglich.
Der Chat steuert dabei das Navi fern.

## Spielen

- **Online:** Nach dem Merge über GitHub Pages: <https://origamihase.github.io/racer/>
  (Pages-Quelle: Branch `main`, Ordner `/docs`).
- **Lokal:** `docs/index.html` einfach im Chrome öffnen (Doppelklick genügt, kein Server nötig).
  Alternativ `npm run serve` und <http://localhost:8080> aufrufen.

Gebaut für aktuelle Versionen von Google Chrome (Desktop). Tastatur, Gamepad und Touch werden unterstützt.

## Worum geht's?

- **Kameraschwenk zum Start:** Die Kamera fährt von außen an Mini Adam vorbei ins Cockpit.
- **Geld gibt es nur vom Publikum** – wie im echten Stream: Spenden mit Alter-Skala, Ortsspenden, Abos,
  VIPs, Navi-Gebote, Sprachdurchsagen, Rahmen, Aktionen und Sammelaktionen. Fürs Fahren selbst zahlt
  niemand. Aber wer flott, knapp und sauber fährt, hat einen gut gelaunten Chat, und der gibt gern.
- **NOMI**, der Boardcomputer (schwarze Kugel mit zwei Augen auf dem Armaturenbrett), sagt
  **„Die linke Fahrspur ist freigeschaltet.“**, sobald ein Zuschauer dafür gespendet hat. Dann darfst du
  eine Minute lang ganz links fahren. Geld bringt das keins – aber wer die Spur nutzt, macht den Chat
  froh, und die nächste Freischaltung kommt etwas schneller. Sonst gilt das Rechtsfahrgebot.
- **„Das Navi-Ziel wurde geändert.“** Die Zuschauer überbieten sich mit Cent-Beträgen, das Navi rechnet
  automatisch eine neue Route (Erlensee, Burg Hauneck, Megahub Lehrte, Siegen … eher nicht).
  Jedes Gebot landet in der Stream-Kasse, zurück gibt es nichts. Wer trotzdem einmal ankommt,
  wird vom Chat mit Ortsspenden gefeiert – danach beginnt die nächste Runde wieder bei 0,01 €.
- **Das Sprachstudio** (🎧) sagt Mini Adam etwa einmal pro Minute ins Ohr, wie der Chat gerade drauf ist,
  und bei einer richtig großen Spende ruft es „Alter!“. Eine Anzeige für die Chat-Stimmung gibt es mit
  Absicht nicht – man muss hinhören und den Chat lesen.
- **Regen für Könner:** Wer lange sauber fährt, bekommt Regen. Der automatische Scheibenwischer will
  anspringen, zuckt aber nur über die Scheibe (Beta!). Mit <kbd>E</kbd> darf man selbst wischen,
  was auch nicht immer klappt. Der Chat liebt es trotzdem.
- **Akku und Blech:** Die Stream-Technik im Kofferraum zieht Strom, Lade-Ringe helfen.
  Rempler kosten Karosserie-Punkte. Leerer Akku oder zu viel Blechschaden beendet die Fahrt.
- **Live-Chat und Live-Bereich:** Spenden mit Alter-Skala, Sprachdurchsagen, gekaufte Rahmen
  (Rosen, Sonnenblumen, Pappkartons …), Funklöcher, Polizei Gifhorn, Blitzer mit Polaroid,
  Brunnen und die blaue Plüsch-Elsa mit Krönchen und Schärpe am Straßenrand, Bananensaft und Koriander – und ab und zu ein lächerliches
  „5 Cent, wenn du …“-Angebot, auf das Mini Adam natürlich nie eingeht (der Chat legt höchstens 2 Cent drauf).
- **You had 5 Jobs:** Pro Fahrt fünf kleine Aufgaben. Für jede verspricht ein Zuschauer eine Spende
  („Wenn du 200 km/h fährst, spende ich 20 €!“), für alle fünf legt noch jemand ordentlich drauf.
- **Tesla-Shop:** Mit den Stream-Einnahmen rüstest du den Tesla auf: Beschleunigung, Tempo-Freischaltung,
  Akku-Puffer, Stream-Technik, Sportreifen, Plüsch-Polster, Wischer-Firmware (Beta), Radarwarner,
  Satelliten-Schüssel, Linke-Spur-Sammelaktion, Wackel-Elsa, Warnweste und Konfetti-Kanone. Blitzer kommen
  unangekündigt – nur wer den Radarwarner an Bord hat, hört es vorher piepen und NOMI warnen. Das Megafon gehört
  zur Ausstattung (wer es früher gekauft hat, bekommt die 450 € einmal zurück).
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
| Kamera (Cockpit / Drohne) | V | B | 🎥 |
| Chat ein/aus | C | – | – |
| Ton aus | M | – | – |
| Pause | Esc oder P | Start | ⏸ |

Spielstand, Guthaben, Upgrades und Bestwerte werden im Browser gespeichert (`localStorage`).
In den Einstellungen lassen sich Ton, Sprachausgabe, Chat und Grafikqualität umstellen.

## Entwicklung

Der Quellcode liegt in `src/`, gebaut wird mit [esbuild](https://esbuild.github.io/) zu einer einzigen
Datei `docs/game.js` (inklusive [three.js](https://threejs.org/), MIT-Lizenz). Dadurch läuft das Spiel
auch direkt per `file://`.

```bash
npm install
npm run build   # baut docs/game.js
npm run dev     # baut bei jeder Änderung neu (mit Sourcemap)
npm run serve   # startet einen kleinen Webserver auf Port 8080
```

`docs/game.js` ist eingecheckt, damit GitHub Pages ohne Build-Schritt funktioniert.
Nach Änderungen in `src/` bitte `npm run build` ausführen und die neue `docs/game.js` mit committen.

| Ordner | Inhalt |
| --- | --- |
| `src/main.js` | Renderer, Kameras, Zustände (Titel, Kameraschwenk, Fahrt, Abspann), Hauptschleife |
| `src/game/` | Spiellogik: Fahrphysik, Navi-Auktion, Stream-Kasse und Chat-Stimmung (`economy.js`), Ereignisse, Einsammelbares |
| `src/world/` | Autobahn, Himmel, Landschaft, Verkehr (mit Spurwechseln) |
| `src/models/` | Tesla, Mini Adam, Elsa, Fahrzeuge |
| `src/cockpit/` | Cockpit, NOMI, Mittelbildschirm mit Navi |
| `src/fx/` | Regen, Tropfen auf der Scheibe, zuckender Wischer, Bild-Effekte |
| `src/ui/` | HUD, Chat, Menüs, Shop, Abspann |
| `src/data.js` | Alle Texte, Navi-Ziele, Rahmen, Durchsagen und Shop-Artikel |

Mit `?debug` in der Adresse gibt es `window.__MA` für automatisierte Tests.

## Fan-Projekt

Ein inoffizielles Fan-Spiel ohne Verbindung zu SkylineTV. Alle Insider stammen aus dem
SkylineTV LIVE Wiki, eine Übersicht mit Quellen steht in [INSIDER.md](INSIDER.md).
In Erinnerung an Adam Wolke – danke für die Live-Eskalationen.
