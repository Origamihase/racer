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
- **NOMI**, der Boardcomputer (schwarze Kugel mit zwei Augen auf dem Armaturenbrett), sagt ab und zu
  **„Die linke Fahrspur ist freigeschaltet.“** Wer dann ganz links fährt, bekommt Bonusguthaben.
- **„Das Navi-Ziel wurde geändert.“** Die Zuschauer überbieten sich mit Cent-Beträgen, das Navi rechnet
  automatisch eine neue Route (Erlensee, Burg Hauneck, Megahub Lehrte, Siegen … eher nicht).
  Wer ein Ziel erreicht, bekommt Guthaben.
- **Regen für Könner:** Wer lange sauber fährt, bekommt Regen. Der automatische Scheibenwischer will
  anspringen, zuckt aber nur über die Scheibe (Beta!). Mit <kbd>E</kbd> darf man selbst wischen,
  was auch nicht immer klappt. Dafür gibt es Regenzulage.
- **Akku und Blech:** Die Stream-Technik im Kofferraum zieht Strom, Lade-Ringe helfen.
  Rempler kosten Karosserie-Punkte. Leerer Akku oder zu viel Blechschaden beendet die Fahrt.
- **Live-Chat und Live-Bereich:** Spenden mit Alter-Skala, Sprachdurchsagen, gekaufte Rahmen
  (Rosen, Rettich für 13,69 €, Pappkartons …), Funklöcher, Polizei Gifhorn, Blitzer mit Polaroid,
  Brunnen und Elsa am Straßenrand, Bananensaft und Koriander.
- **You had 5 Jobs:** Pro Fahrt fünf kleine Aufgaben, alle fünf geben einen Bonus.
- **Tesla-Shop:** Mit dem Guthaben rüstest du den Tesla auf: Beschleunigung, Tempo-Freischaltung,
  Akku-Puffer, Stream-Technik, Sportreifen, Plüsch-Polster, Wischer-Firmware (Beta), Megafon,
  Starlink-Schüssel, Wackel-Elsa, Warnweste und Konfetti-Kanone.
- **Abspann** mit Abrechnung, Statistik, Blitzerfotos und erlogener Berufsbezeichnung des Tages.

## Steuerung

| Aktion | Tastatur | Gamepad | Touch |
| --- | --- | --- | --- |
| Lenken | ← → oder A D | Linker Stick | ◀ ▶ |
| Strom geben | ↑ oder W | RT oder Steuerkreuz ↑ | Strom |
| Bremsen | ↓ oder S | LT oder Steuerkreuz ↓ | Bremse |
| Hupen (Brunnen und Elsa grüßen) | Leertaste | A | 📯 |
| Scheibenwischer von Hand | E | X | 🌧️ |
| Megafon (aus dem Shop) | H | Y | 📢 |
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
| `src/game/` | Spiellogik: Fahrphysik, Navi-Auktion, Ereignisse, Einsammelbares |
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
