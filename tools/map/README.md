# Die Karte von „Navi ferngesteuert XXL“

`netz.json` ist die Quelle der Spielkarte: 426 Orte aus dem SkylineTV-LIVE-Wiki, 603 Knoten (Ausfahrten, Kreuze,
Endpunkte), 251 Straßen und 808 Etappen mit zusammen rund 68.000 km: Autobahnen und Landstraßen von Lappland bis
Malta, in den USA und Japan, dazu Fähren, Autozüge und Luftfracht ab Frankfurt.

    npm run map     # netz.json → src/map/data.js (kompakte Daten für das Spiel)
    npm test        # prüft Karte, Routen und Streckenlogik ohne Grafik

- `src/map/graph.js` macht daraus den Graphen: Routen wie ein echtes Navi (Kartenkilometer), Fernziele für die
  Schilder, Spiellängen im Maßstab 1:19.
- `src/game/trip.js` baut beim Fahren daraus die Strecke: Autobahn, Ausfahrt, Rampe, Zubringer, Ortsdurchfahrt mit
  Ziel, Landstraße, Auffahrt.

## Woher die Daten kommen

`quelle/` enthält die Skripte, mit denen `netz.json` entstanden ist (zur Nachvollziehbarkeit, sie laufen nicht im
Build):

1. `places_final.py`: Orte aus dem Wiki-Export (Kategorie der Streams je Ort) mit Koordinaten.
2. `roads_def.py`: die Fernstraßen von Hand als Folgen von Orten, Kreuzen und Durchgangspunkten.
3. `build_net.py`, `build_graph.py`: Koordinaten auflösen, alle Wiki-Orte an die nächste Straße hängen
   (Anschlussstelle mit Zubringer), Knoten und Etappen bilden.
4. `enrich.py`, `pack.py`: Einwohnerzahlen ergänzen und alles in `netz.json` schreiben.

Koordinaten und Einwohnerzahlen stammen aus dem Ortsverzeichnis von [GeoNames](https://www.geonames.org/)
(Lizenz CC BY 4.0). Die Straßenverläufe sind vereinfacht: Etappen verbinden Orte in gerader Linie mit wenigen
Zwischenpunkten, die Kilometer sind Luftlinie mal 1,13.
