# Night Racer 3000

Ein HTML5-Highway-Racer im Synthwave-Look — fehlerfrei, hübsch und mit kaputtem Scheibenwischer.

## Features

- Pseudo-3D-Straße mit weichen Kurven und Hügeln
- Outrun/Synthwave-Optik: Mond, Sterne, Magenta-/Cyan-Rumble-Strips
- Dynamischer Verkehr mit Sportwagen und LKW
- Wetterwechsel: Regen mit Tropfen am Glas
- Defekter Scheibenwischer (Feature, nicht Bug)
- WebAudio: Motor, Hupe, Crash
- Witzige Schilder, Easter Eggs (Kuh, UFO, Schneemann, Boombox, Ente, Palme)
- Schaden-System, Highscore, Score-Titel ("Sonntagsfahrer" bis "Lichtgeschwindigkeits-Opa")
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
