# Night Racer 3000

Ein HTML5-Highway-Racer im Synthwave-Look — fehlerfrei, hübsch und mit kaputtem Scheibenwischer.

## Features

- Pseudo-3D-Straße mit weichen Kurven und Hügeln
- Outrun/Synthwave-Optik: Mond, Sterne, Magenta-/Cyan-Rumble-Strips
- Aurora-Borealis-Bänder am Himmel (häufiger sichtbar, dezent wabernd)
- Sternschnuppen am Nachthimmel (zufällig, mit Schweif)
- Beleuchtete Brücken über die Strecke mit Lichterketten
- Straßenlaternen mit warmem gelbem Glow
- Dynamischer Verkehr: Sportwagen, LKW, Polizei mit Blaulicht, Geisterfahrer (mit Bissfaktor)
- Korrekte Spurmitten (3-Lane) — kein Drauf-Fahren in den Standstreifen mehr
- Rückspiegel mit Verkehr von hinten ("Objekte näher als sie erscheinen")
- Eigene Motorhaube/Nase sichtbar (Synthwave-Hood mit Lufthutzen)
- Wetterwechsel: Regen mit Tropfen am Glas und Wind-Drift
- Defekter Scheibenwischer mit Sprüh-Witz (Feature, nicht Bug)
- Crash-Funken & Reifenrauch beim Offroad-Trip
- WebAudio: Motor, Hupe, Crash, Muh, Quietsch — mit Mute-Taste (M)
- Über 75 witzige Schilder und 14 Easter Eggs (Kuh, UFO, Schneemann, Boombox, Ente, Palme, Pinguin, Wetterballon, Dino, Verkehrskegel, Yeti, Astronaut, Schaf, Roboter)
- Schaden-System mit Selbstreparatur bei ruhigem Fahren
- Trip-Odometer auf dem Cockpit (separate Distanz-Anzeige)
- Highscore mit Vorher-Wert beim Übertreffen, automatisch gesichert bei Tab-Wechsel
- 11 Score-Titel ("Sonntagsfahrer" bis "Neon-Götze")
- Zufällige Kennzeichen mit Sprüchen (OPA, OMA, NEIN, JA, BMW, BAFÖG, ZEN, IKEA, KAKAO, NERD, YETI, MIAU, CRINGE …)
- Konami-Code Easter Egg (↑↑↓↓←→←→BA → Goldener Modus mit Sternschnuppenregen)
- "Mut zur Lücke" Score-Bonus beim knappen Vorbeifahren (mit Whoosh-Sound und +80-Pop)
- Schwebende Score-Pops bei Bonus-Aktionen
- Max-Speed-Tracking mit individueller Bewertung im Game-Over-Screen
- Tier-Wechsel-Celebration mit Synthwave-Fanfare und Sternschnuppen
- Bestdistanz-Tracking neben Highscore
- Sichtbare Brems-Lichter auf der Motorhaube
- Wet-Road-Shimmer bei Regen (Mondreflexionen auf der Straße)
- Mond mit sanfter Lens-Flare und 3D-Halbschatten
- Aurora-Borealis in 4 Schichten mit Smoothstep-Übergängen
- Sternschnuppen mit glühendem Kopf
- Tacho-Nadel-Vibration im Redline-Bereich
- Frame-rate-stabile Physik (gleiches Verhalten bei 30/60/120 fps)
- Respektiert `prefers-reduced-motion` Browser-Präferenz
- Funktioniert auch bei deaktiviertem localStorage (Privacy-Mode)
- Pause, Restart, Touch- und Tastatur-Steuerung

## Steuerung

- `←` `→` (oder `A` `D`, oder Touch links/rechts) — Lenken
- `↑` Vollgas (passiert automatisch)
- `↓` (oder Touch links Mitte) — Bremse
- `H` (oder Touch rechts Mitte) — Hupe
- `M` — Audio stumm/laut (wird gespeichert)
- `P` oder `Esc` — Pause
- `Enter` / `Space` — Start oder Neustart
- Konami: `↑↑↓↓←→←→BA` — Goldener Modus

## Lokal starten

1. Repository klonen
2. `docs/index.html` im Browser öffnen (am einfachsten per `python3 -m http.server` im Repo-Root)

## Bereitstellung über GitHub Pages

Die komplette Anwendung liegt als `docs/index.html`. Pages-Aktivierung:

1. `Settings → Pages` öffnen
2. Unter **Source** `Deploy from a branch` wählen
3. Branch `main`, Ordner `/docs`
4. Speichern

Die `game.html` im Wurzelverzeichnis leitet automatisch nach `docs/index.html` weiter.
