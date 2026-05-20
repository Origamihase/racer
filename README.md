# Night Racer 3000

Ein HTML5-Highway-Racer im Synthwave-Look — fehlerfrei, hübsch und mit kaputtem Scheibenwischer.

## Features

- Pseudo-3D-Straße mit weichen Kurven und Hügeln
- Outrun/Synthwave-Optik: Mond, Sterne, Magenta-/Cyan-Rumble-Strips
- Aurora-Borealis-Bänder am Himmel (selten, dezent)
- Beleuchtete Brücken über die Strecke mit Lichterketten
- Straßenlaternen mit warmem gelbem Glow
- Dynamischer Verkehr: Sportwagen, LKW, Polizei mit Blaulicht, Geisterfahrer
- Wetterwechsel: Regen mit Tropfen am Glas und Wind-Drift
- Defekter Scheibenwischer mit Sprüh-Witz (Feature, nicht Bug)
- WebAudio: Motor, Hupe, Crash, Muh, Quietsch
- Witzige Schilder, Easter Eggs (Kuh, UFO, Schneemann, Boombox, Ente, Palme, Pinguin, Wetterballon)
- Schaden-System mit Selbstreparatur bei ruhigem Fahren
- Highscore mit Vorher-Wert beim Übertreffen
- Score-Titel ("Sonntagsfahrer" bis "Lichtgeschwindigkeits-Opa")
- Zufällige Kennzeichen mit Sprüchen (OPA, OMA, NEIN, JA, BMW, BAFÖG, ZEN …)
- Pause, Restart, Touch- und Tastatur-Steuerung

## Steuerung

- `←` `→` (oder `A` `D`, oder Touch links/rechts) — Lenken
- `↑` Vollgas (passiert automatisch)
- `↓` (oder Touch links Mitte) — Bremse
- `H` (oder Touch rechts Mitte) — Hupe
- `P` oder `Esc` — Pause
- `Enter` / `Space` — Start oder Neustart

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
