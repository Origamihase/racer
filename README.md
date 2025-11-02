# Autobahn‑Racer

Ein HTML5-Ego-Rennspiel mit dynamischem Verkehr, Wetter und Touch-/Tastatursteuerung.

## Lokal starten

1. Repository klonen
2. `index.html` aus dem Verzeichnis `docs/` im Browser öffnen (z. B. per Doppelklick oder mit einem lokalen Webserver).

## Bereitstellung über GitHub Pages

Damit das Spiel leicht über einen Link erreichbar ist, ist die komplette Anwendung als `docs/index.html` abgelegt. So aktivierst du GitHub Pages für das Repository:

1. Öffne auf GitHub die Repository-Einstellungen (`Settings`).
2. Navigiere zum Abschnitt **Pages**.
3. Wähle unter **Source** die Option **Deploy from a branch**.
4. Wähle als Branch `main` (bzw. den Branch, auf dem sich die Dateien befinden) und als Ordner `docs`.
5. Speichere die Einstellung.

Nach wenigen Minuten ist das Spiel unter `https://<dein-benutzername>.github.io/<repository-name>/` erreichbar. Die bestehende `game.html` im Wurzelverzeichnis leitet Besucher automatisch zur GitHub-Pages-Variante weiter.
