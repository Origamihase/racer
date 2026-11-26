# Die Karte von „Navi ferngesteuert XXL“

`netz.json` ist die Quelle der Spielkarte: 426 Orte aus dem SkylineTV-LIVE-Wiki, 603 Knoten (Ausfahrten, Kreuze,
Endpunkte), 251 Straßen und 808 Etappen mit zusammen rund 65.900 km Autobahnen und Landstraßen von Lappland bis
Malta, in den USA und Japan, dazu Fähren, Autozüge und Luftfracht ab Frankfurt.

    npm run map     # netz.json → src/map/data.js und src/map/shapes.js (kompakte Daten für das Spiel)
    npm test        # prüft Karte, Routen, Streckenlogik und Straßenverläufe ohne Grafik

- `src/map/graph.js` macht daraus den Graphen: Routen wie ein echtes Navi (Kartenkilometer), Fernziele für die
  Schilder, Spiellängen im Maßstab 1:19.
- `src/game/trip.js` baut beim Fahren daraus die Strecke: Autobahn, Ausfahrt, Rampe, Zubringer, Ortsdurchfahrt mit
  Ziel, Landstraße, Auffahrt.
- `src/map/shapes.js` (erzeugt) enthält je Etappe den echten Verlauf mit Höhen: `edgeShape(i)` liefert
  `{ n, lat, lon, elev, matched }` in Richtung Knoten a → Knoten b (`matched` beschreibt nur die Lage: 2 abgeglichen,
  1 teilweise, 0 Ersatzverlauf; `elev` kommt bei jedem Status aus dem Gelände und gilt immer), dekodiert beim ersten
  Abruf und zwischengespeichert (dasselbe Objekt bei jedem Abruf, nur zum Lesen; ein falscher Index wirft einen
  `RangeError`); `shapeCount` ist die Zahl der Etappen.
  Anfangs- und Endpunkt sind genau die Knoten aus `data.js`. Die Zwischenpunkte in `data.js` sind derselbe
  Verlauf, auf 1,5 km vereinfacht (1e-3°); der erste und der letzte sind die Richtungspunkte des Verlaufs 0,1 bis
  0,3 km vor den Knoten (1e-4°), so zeigen `straight()` in `graph.js`, `turnAngle` in `trip.js` und die Karte an
  jedem Knoten in dieselbe Richtung wie der Verlauf (Abweichung höchstens 2,7°, vorher Median 12°, bis 118°).

## Woher die Daten kommen

`quelle/` enthält die Skripte, mit denen `netz.json` entstanden ist (sie laufen nicht im Build).

Das Netz (Orte, Straßen, Reihenfolge der Knoten) stammt aus dem Wiki und ist von Hand gebaut:

1. `places_final.py`: Orte aus dem Wiki-Export (Kategorie der Streams je Ort) mit Koordinaten.
2. `roads_def.py`: die Fernstraßen von Hand als Folgen von Orten, Kreuzen und Durchgangspunkten.
3. `build_net.py`, `build_graph.py`: Koordinaten auflösen, alle Wiki-Orte an die nächste Straße hängen
   (Anschlussstelle mit Zubringer), Knoten und Etappen bilden.
4. `enrich.py`, `pack.py`: Einwohnerzahlen ergänzen und alles in `netz.json` schreiben.

Koordinaten und Einwohnerzahlen stammen aus dem Ortsverzeichnis von [GeoNames](https://www.geonames.org/)
(Lizenz CC BY 4.0).

### Straßenverläufe und Höhen

`verlauf.py` legt jede Etappe auf ihren echten Verlauf und schreibt Form, Höhen, Abgleich und Kilometer in
`netz.json` zurück (der Handstand bleibt bei jedem verschobenen Knoten in `grob` erhalten, so ist der Lauf
wiederholbar):

    python3 -I tools/map/quelle/verlauf.py --daten <Kartendaten> --arbeit <Arbeitsordner>
    npm run map

`<Kartendaten>` enthält `ne/ne_10m_roads.geojson` (Natural Earth 1:10m Roads), für die Uferstraßen
`ne/ne_10m_rivers_lake_centerlines.geojson` und `ne/ne_10m_rivers_europe.geojson`, `world-atlas/package/*.json`
(Natural Earth Land und Staaten als TopoJSON) und `terrain/{z}/{x}/{y}.png` (Zwischenspeicher der Höhenkacheln;
fehlende Kacheln lädt `hoehen.py` höflich nach: höchstens 2000 Kacheln im ganzen Speicher, 4 Anfragen je Sekunde;
Zoom 8, in den Alpen Zoom 9). Rohdaten und Kacheln gehören nicht ins Repository. Der Lauf dauert mit geladenen
Kacheln gut zwei Minuten und ist wiederholbar (gleiche Eingaben, byte-gleiches `netz.json`); `verlauf.log` im
Arbeitsordner hält jede Entscheidung fest, `statistik.json` den Abgleich je Land und Straßenart. Der NE-Graph wird
als `ne_graph.pkl` im Arbeitsordner zwischengespeichert, solange Quelle, `ne_graph.py` und die 1°-Zellen um die
Grobverläufe gleich bleiben.

Die Schritte:

1. **Routingfähiger Graph** aus den Natural-Earth-Linien (`ne_graph.py`): Linien an ihren Stützpunkten teilen,
   Punkte näher als 250 m verschmelzen, Kreuzungen einfügen, offene Linienenden bis 2 km an die drei nächsten
   Linien heilen (teuer). Eine Heilung nur an die nächste Linie ließe Lücken: am Kreuz Memmingen endet die A96 in
   Natural Earth knapp neben der A7, die nächste Linie ist aber ein Stück der A96 selbst.
2. **Abgleich** (`abgleich.py`): je Straße ein durchgehender kürzester Weg durch alle ihre Knoten, Kosten = Länge ×
   Straßenartfaktor × Nummernbonus × Korridorfaktor + Abbiegen. Der Korridor um den Handverlauf ist eine harte
   Grenze (max(10 km, 30 % der Etappe), in den lockeren Stufen 2- und 3,5-mal so breit), darin steigen die Kosten
   weich mit dem Abstand (1 + 1,5 × (Abstand / Breite)²); Fangkreise nach Knotenart, E-Nummern werden aus dem
   ersten Durchgang gelernt; ohne Weg am Stück einzeln mit drei immer lockereren Stufen, sonst Ersatzverlauf. Erst
   die Autobahnen, dann die Landstraßen: Linien, die schon eine Autobahn des Netzes tragen, kosten eine Landstraße
   1,6-mal so viel. Fährt eine Landstraßen-Etappe trotzdem zur Hälfte oder mehr auf einer Autobahn (die B9 am Rhein
   auf der A61, weil Natural Earth das Rheintal nicht führt), bekommt sie einen Ersatzverlauf statt eines Verlaufs
   auf der Autobahn.
3. **Talsuche** (`tal.py`): Natural Earth ist generalisiert und liegt im Gebirge bis 4 km neben dem Tal. Lange
   Tunnel (Liste in `hoehen.py`) laufen gerade von Portal zu Portal, wenn die Portallage zum Gelände passt. Bergige
   Stücke werden auf einem 150-m-Raster im Korridor um die Linie neu gelegt (Kosten Länge × (1 + Abstand²) +
   Steigung²): der Weg folgt dem Talboden und quert Kämme im Sattel. Danach werden die Ecken des Polygonzugs zu
   Bögen geglättet (Gauß, über die Enden hinaus punktgespiegelt fortgesetzt).
4. **Knoten** (`knoten.py`): Ortsknoten bleiben, wo der Ort ist: Ziele liegen immer in Orten, und `graph.js` und
   `trip.js` kennen den Ort eines Knotens nur, solange sein Zubringer unter 1,5 km liegt (Hauptort an der
   Ausfahrt, Ortsdurchfahrt am Ende einer Landstraße). Die Straßen führen per Beule (Durchgang) oder
   Anschlussbogen (Ende) in den Ort; eine Autobahn, die in einem Ort endet, bekommt immer den Anschlussbogen statt
   eines Natural-Earth-Wegs über Stadtringe. Anschlussstellen, Kreuze und Durchgangspunkte rücken auf die echte
   Linie (Lotfußpunkt); treffen sich mehrere Straßen, die sich in Wirklichkeit nicht berühren, liegt der Knoten
   dort, wo sie sich am wenigsten verbiegen müssen. Liegt an einem solchen Knoten ein Ort, rückt er höchstens so
   weit, dass dessen Zubringer unter 1,5 km bleibt. Zubringer ändern sich um die Änderung der Luftlinie × 1,2 (in
   beide Richtungen); ein Ort abseits des Knotens bekommt einen kurzen, glaubhaften Weg zwischen Luftlinie und
   Luftlinie × 1,2 + 1 km (das richtet auch Handwerte, die kürzer als die Luftlinie waren), ein Ort am Knoten
   (unter 1,5 km) bleibt es: sein Zubringer endet am Ortsrand, die Ortsdurchfahrt folgt.
   Fährhäfen am Ende ihrer Straßen bleiben an der Küste. Straßenenden werden über das NE-Netz bis zu ihrem Knoten
   verlängert. `tools/shape-test.mjs` prüft beides: Ortsknoten an ihrer Handlage, jeder Ort am Knoten noch da.
   Eine Handlage ist korrigiert: Kreuz Schwerin stand 9 km nördlich der echten Kreuzung auf der A14, und die A24
   fuhr bis Schwerin hinauf und zurück (158 statt 105 km); `grob` hält jetzt die Kreuzung der Linien. Seither prüft
   `shape-test.mjs` jede Autobahn auf Schleifen (12 km Verlauf, die auf weniger als 3 km zurückkehren).
5. **Formen** (`form.py`): Beulen durch versetzte Knoten, Endrampen, Prüfung auf Umweg, Kehre, Zickzack und
   Spitze, glatte Übergänge mit gemeinsamer Richtung an jedem Knoten einer Straße. Zuletzt ein Mindestradius
   (`form.ecken_runden`): ändert sich die Richtung zwischen den Sehnen 0,3 km vor und nach einem Punkt um mehr als
   45° (Autobahn) bzw. 85° (Landstraße), ersetzt ein Hermite-Bogen ein Fenster um die Ecke, bis er die Grenze hält
   (Natural-Earth-Ecken an Kreuzen, Anschlüsse über Stadtstraßen); `shape-test` erlaubt nach der Vereinfachung
   60° bzw. 100°, mit zwei begründeten Ausnahmen (kurze Etappen zwischen zwei Übergängen).
6. **Ersatzverläufe** für Etappen ohne glaubhaften Abgleich: im Bergland ein Geländeweg (`tal.gelaende_weg`)
   von Ort zu Ort durch die Täler, auf einem Raster im Korridor um den Handverlauf, an Land und mit Abstand zu
   den Ersatzwegen anderer Straßen; im flachen Land der geglättete Handverlauf mit deterministischen Mäandern
   (Seed = Kante) von wenigen Prozent der Länge, an Land gehalten.
   **Uferstraßen** (`ufer.py`): Wo Natural Earth eine Straße am Fluss nicht kennt (B9 und B42 im Mittelrheintal,
   B42 im Rheingau, B34 am Hochrhein), läge ihr Ersatzverlauf mal links, mal rechts des Flusses, und die Karte
   zeigte Brücken, die es nicht gibt. Diese Etappen folgen der Flusslinie 0,4 km neben ihr auf ihrem Ufer (links
   und rechts in Fließrichtung, Liste `UFERSTRASSEN`); Orte am Ufer, deren gerundete Koordinaten im Fluss lagen
   (Bad Salzig, St. Goar, Bacharach, St. Goarshausen, Rüdesheim, Eltville), rücken mit ihrem Knoten auf dieselbe
   Linie. `export.mjs` vereinfacht Uferstraßen fein (80 m statt 1,5 km), sonst schnitte die grobe Linie die
   Flussbögen. Weil der Grobverlauf einer Uferstraße den Korridor ihrer Nachbaretappen mitbestimmt, braucht eine
   Änderung der Liste zwei Läufe, bis `netz.json` wieder byte-gleich bleibt.
7. **Fähren** (`faehren.py`): Natural-Earth-Fährlinien, wo sie passen, sonst ein Weg übers Wasser: A* auf einem
   Wasserraster (1 km, an den Häfen 0,4 km, Zufahrt bis 25 km vom Hafenknoten, damit auch Lübeck an der Trave
   aufs Meer findet), Kosten steigen nahe der Küste; danach gestrafft, ohne Land zu berühren, und die Ecken mit
   Bögen gerundet, die auf dem Wasser bleiben. Autozüge gerade, Luftfracht als Großkreisbogen.
8. **Höhen** (`hoehen.py`): bilinear aus den Höhenkacheln, Spitzen und Wasserflächen entfernt, Täler unter 1 km
   (Autobahn) bzw. 0,6 km (Landstraße) überbrückt, lange Tunnel gerade zwischen ihren Portalen (als Portal gilt der
   tiefste Punkt der Linie bis 3 km um die Lage der Liste), leicht geglättet; ganze Meter. Die Steigungsgrenze der
   Straßenart (ROUTES §3.4: 8 % Autobahn, 12 % Landstraße) steht wie die Alpenbox einmal in `quelle/regeln.json`
   (die Pipeline, `export.mjs` und `shape-test.mjs` lesen sie); gesäubert wird auf einen halben Prozentpunkt
   darunter (7,5 / 11,5 %), nach allen Rampen klemmt `verlauf.py` auf einen ganzen Punkt darunter (7 / 11 %) und
   bricht ab, wenn das nicht gelingt. Die Luft fangen die kürzeren Sehnen der Vereinfachung und das Runden auf;
   `export.mjs` hält 8 / 12 % auf jedem Abschnitt, `shape-test.mjs` prüft das.

Land und Wasser kommen aus den Natural-Earth-Landflächen. Ringe, die die Datumsgrenze kreuzen (Eurasien an der
Beringstraße), laufen über ±180° hinaus stetig weiter (`geo.ueber_datumsgrenze`); eben gezeichnet kippte sonst die
Füllung, und ganz Lappland galt als Wasser.

### Die kompakten Verläufe (`shapes.js`)

`export.mjs` vereinfacht jeden Verlauf gierig (vom letzten behaltenen Punkt so weit wie möglich, mit ein paar
Punkten Vorausschau; gut 15 % weniger Punkte als Douglas-Peucker bei gleicher Genauigkeit): jeder Punkt aus
`netz.json` liegt höchstens 50 m neben dem vereinfachten Verlauf und 10 m über oder unter ihm. Je Knoten bleibt ein
Richtungspunkt am Ende des geraden Stücks (höchstens 0,3 km), so stimmen die Richtungen an den Knoten einer Straße
überein. Kodiert wird jeder Zwischenpunkt als Schritt im mitgedrehten Rahmen: Vielfache von 10 m längs der Richtung
des letzten Abschnitts und quer dazu. Straßen laufen meist fast geradeaus weiter, das spart gut 3 Bit je Punkt
gegenüber Differenzen von Breite und Länge; der Kodierer rechnet jeden Schritt wie der Dekodierer, Rasterfehler
laufen nicht auf (höchstens 7 m). Die Zahlen werden wie Exp-Golomb zu einem Zeichen für Oktave und zwei Bits, die
übrigen Bits stehen in einer eigenen Zeichenkette; längs, quer, Höhen und Zusatzbits stehen je in einer
Zeichenkette für alle Kanten, damit gzip für jede die passende Häufigkeitstabelle findet. Der Dekodierer steht
genau einmal in `export.mjs` und wird wörtlich nach `shapes.js` geschrieben; der Export dekodiert jede Kante zur
Probe. Wo das Raster die Steigungsgrenze um Bruchteile verschärfen würde, rücken Höhen um höchstens 3 m.

Größe (Budget 300 kB roh, 120 kB gzip): 162 kB roh, 109 kB mit `gzip -9` (106 kB mit zlib, Stufe 6 und 9), rund
34.200 Punkte; alle Verläufe dekodieren in gut 20 ms Rechenzeit (node; die Wanduhr hängt von der Last ab).
`tools/shape-test.mjs` prüft das Budget und höchstens 60 ms Rechenzeit (Prozess-CPU-Zeit, nicht die Wanduhr).

`qa_bilder.py` zeichnet die Prüfbilder (Regionen, berühmte Strecken mit Schummerung, Höhenprofile):

    python3 -I tools/map/quelle/qa_bilder.py --daten <Kartendaten> --arbeit <Arbeitsordner> --ziel <Bildordner>

### Abgleich (Stand der letzten Erzeugung)

`matched` je Etappe: **2** (abgeglichen) – mindestens 85 % des fertigen Verlaufs liegen höchstens 0,75 km neben dem
abgeglichenen Natural-Earth-Weg; **1** (teilweise) – mindestens 35 %; **0** (Ersatz) – weniger, oder die Etappe hat
einen Ersatzverlauf. `matched` sagt nichts über die Höhen: die kommen bei jedem Status aus dem Gelände, auch die
Ersatzverläufe im Bergland folgen den Tälern (Berninapass bis 2.240 m, Flüela, SS51, E39 an den Fjorden). Wer die
Höhen nur bei `matched` ≥ 1 nutzt (der Kurs aus Paket K2 tut das bisher), ersetzt dort echtes Relief durch
entworfene Hügel; die Höhen sind gültig, sobald `elev` nicht überall 0 ist. Bei Fähren heißt 2
Natural-Earth-Fährlinie, 0 Weg übers Wasser; Autozüge und Luftfracht fehlen
in der Tabelle. Etappen je Land der Straße, km des fertigen Verlaufs:

| Land | Art | abgeglichen | teilweise | Ersatz |
|---|---|---:|---:|---:|
| AT | Autobahn | 12 / 1.548 km | 6 / 238 km | – |
| BE | Autobahn | 4 / 503 km | 3 / 143 km | – |
| CH | Autobahn | 14 / 961 km | 5 / 172 km | – |
| CH | Landstraße | 1 / 39 km | 1 / 19 km | 4 / 204 km |
| CZ | Autobahn | 1 / 68 km | 1 / 62 km | – |
| DE | Autobahn | 168 / 6.909 km | 220 / 6.153 km | 41 / 604 km |
| DE | Landstraße | 25 / 850 km | 14 / 318 km | 56 / 1.121 km |
| DE | Fähre | 3 / 607 km | – | 5 / 1.910 km |
| DK | Autobahn | 5 / 637 km | 1 / 86 km | 1 / 30 km |
| DK | Fähre | 1 / 141 km | – | – |
| ES | Autobahn | 11 / 2.803 km | 2 / 72 km | 1 / 6 km |
| ES | Fähre | 1 / 299 km | – | – |
| FI | Autobahn | 7 / 1.049 km | 1 / 33 km | – |
| FI | Landstraße | 6 / 884 km | – | – |
| FR | Autobahn | 25 / 3.845 km | 10 / 333 km | 2 / 26 km |
| GB | Autobahn | 3 / 707 km | 2 / 129 km | – |
| GB | Fähre | – | – | 1 / 219 km |
| HR | Autobahn | 1 / 274 km | – | – |
| IT | Autobahn | 20 / 3.088 km | 4 / 352 km | – |
| IT | Landstraße | 2 / 152 km | 1 / 125 km | 1 / 77 km |
| IT | Fähre | 1 / 11 km | – | 1 / 97 km |
| JO | Landstraße | 1 / 216 km | – | – |
| JP | Autobahn | 1 / 520 km | – | – |
| MT | Landstraße | – | – | 2 / 21 km |
| MX | Landstraße | 1 / 233 km | – | – |
| NL | Autobahn | 12 / 826 km | 1 / 8 km | – |
| NO | Autobahn | 1 / 303 km | – | – |
| NO | Landstraße | 9 / 1.653 km | – | 6 / 772 km |
| PL | Autobahn | 7 / 1.620 km | – | – |
| PL | Landstraße | 1 / 440 km | – | – |
| SE | Autobahn | 7 / 2.179 km | 2 / 85 km | – |
| SE | Fähre | – | – | 2 / 703 km |
| SI | Autobahn | 1 / 223 km | – | – |
| US | Autobahn | 32 / 21.400 km | 2 / 108 km | – |
| US | Landstraße | 5 / 636 km | – | – |
| **alle** | **Autobahn** | **332 / 49.461 km (85 %)** | **260 / 7.974 km (14 %)** | **45 / 667 km (1 %)** |
| **alle** | **Landstraße** | **51 / 5.103 km (66 %)** | **16 / 462 km (6 %)** | **69 / 2.196 km (28 %)** |
| **alle** | **Fähre** | **6 / 1.058 km (27 %)** | **0 / 0 km (0 %)** | **9 / 2.930 km (73 %)** |

Einen Ersatzverlauf bekommen nur 4 Autobahn-Etappen (71 km): Umwege, die Natural Earth nicht anders hergibt (A1
Wuppertal → Solingen 1,95, A46 Düsseldorf → Kreuz Hilden 2,60, A60 Rüsselsheimer Dreieck → Mainz 1,66), und die
A49 Borken → Alsfeld (Natural Earth führt den Lückenschluss nicht). Die übrigen 41 Autobahn-Etappen mit Status 0
und viele mit Status 1 folgen Natural Earth, enden aber in einem Ortsknoten: der liegt am Ort (ROUTES §3.2), und
der Anschlussbogen von der Autobahn in den Ort zählt nicht als abgeglichen (A5 Bad Homburg → Frankfurt, A7
Norderstedt → Hamburg, A115 Berlin → Potsdam, A1 Hagen → Wuppertal). Bei den
Landstraßen fehlen in Natural Earth vor allem Mittelgebirgs- und Talstraßen: B1, B4 und B242 im Harz, B9/B42 am
Rhein und B53 an der Mosel (dort führt Natural Earth nur die A61, A48 und A1 auf den Höhen), B27, B254 und B279
um Fulda und in der Rhön (nur die A7), B83 an der Weser, B310 im Allgäu, die Fjordstrecken der E39, Flüelapass
und Unterengadin (A28CH), der Berninapass und die SS51 durch die Dolomiten. Bei den Fähren führt Natural Earth die
Linien ab Kiel nach Oslo, ab Lübeck, Stockholm und Liverpool und nach Helgoland, Föhr und Malta nicht; sie fahren
einen Weg übers Wasser. Jede Entscheidung mit Grund steht in `verlauf.log`.

### Bekannte Grenzen

- Natural Earth ist auf etwa 1 km generalisiert. Liegt eine Linie neben der echten Trasse, stimmt auch das Profil
  nicht: der Meishin (Straße `TOMEI`) läuft zwischen Sekigahara und Yōkaichi 3–7 km östlich der echten Trasse durch
  die Ausläufer des Suzuka-Gebirges (Profil bis 454 m statt gut 100 bis 200 m am Rand der Ebene); die A8 quert den
  Irschenberg knapp 2 km nördlich des Orts und damit tiefer als in Wirklichkeit (Scheitel 660 m).
- Die Portallagen der Tunnelliste in `hoehen.py` sind ungenau; viele liegen am Hang (`verlauf.log`: „Portallage der
  Liste passt nicht zum Gelände“). Dann bleibt die Linie, und für die Höhen zählt der tiefste Punkt der Linie nahe
  dem Portal. Grob falsch ist dadurch die E16 zwischen Lærdal und Voss: Natural Earth zieht den Lærdalstunnel als
  Gerade bis Flåm und die Straße danach als Gerade über die Berge südlich der Nærøydalen, und die Talsuche legt sie
  auf die Hochfläche (Profil bis 1.220 m; die echte Straße liegt dort in Tunneln, am Fjord und im Tal unter
  400 m). Der Tauerntunnel ist ein 15 km langes gerades Stück von 1.085 auf 1.217 m (echt 6,4 km mit steilen
  Rampen davor). Am Bosrucktunnel lagen beide Portale der Liste rund 7 km zu weit im Südosten, und die A9 stieg auf
  1.109 m; seit der Korrektur fährt sie von Portal zu Portal (673 → 650 m). Dabei ist eine Stelle sichtbar
  geworden, die die falsche Lage verdeckt hatte: bei Selzthal läuft die Linie 0,7 km östlich der Talenge über eine
  Schulter (Profil bis 822 m statt um 650–700 m).
- Abhilfe: genaue Portallagen samt fehlender Tunnel (Flenja-, Stalheimtunnel), Tunnelstrecken auch ohne passende
  Portale von der Talsuche ausnehmen, in den Fjorden Kacheln mit Zoom 10. `shape-test.mjs` prüft den höchsten Punkt
  der A9 am Bosruck (höchstens 850 m) und der A2 am Gotthard (höchstens 1.200 m).
- Führt das Netz eine Autobahn durch einen Ortsknoten, beult sie mehrere Kilometer in den Ort aus und biegt dort
  zurück (A5 in Frankfurt und Heidelberg): der Knoten bleibt am Ort (ROUTES §3.2), die Ecken halten den
  Mindestradius. Solche Etappen zählen oft nur als teilweise abgeglichen.

### Quellen und Lizenzen

- Straßenverläufe: Natural Earth (gemeinfrei)
- Höhendaten: Terrain Tiles (Mapzen/AWS Open Data); Quellen u. a. SRTM, GMTED2010 und ETOPO1 (gemeinfrei) sowie
  EU-DEM: Produced using Copernicus data and information funded by the European Union – EU-DEM layers
- Küsten und Grenzen der Prüfbilder: Natural Earth (gemeinfrei), als TopoJSON aus dem Paket world-atlas
- Orte: GeoNames (CC BY 4.0)

## Küsten, Grenzen und Länder (`land.mjs` → `src/map/land.js`)

Die Umrisse der großen Karte und des Navis stammen aus [Natural Earth](https://www.naturalearthdata.com/)
(gemeinfrei), gelesen aus dem npm-Paket `world-atlas` 2.0.2 (TopoJSON, `countries-10m.json`). Das Paket wird nur
als Daten gelesen – ein eigener kleiner TopoJSON-Decoder in `land.mjs`, kein Code aus dem Paket, nichts wird nach
`node_modules` kopiert. Den Ordner mit `countries-10m.json` gibt man als Argument an:

    node tools/map/land.mjs <Ordner mit countries-10m.json> [--stats]

Das Ergebnis ist deterministisch (gleiche Eingabe → bitgleiche Datei) und bleibt unter 70 kB:

- zwei Detailstufen in einem Bitstrom: grob für die Weltansicht, fein (≈ 1 km) nahe am Straßennetz;
- Landesgrenzen nur dort, wo die Karte spielt; strittige Grenzlinien (Krim, Kosovo, Westsahara, Zypern …) werden
  nicht gezeichnet, damit die Karte neutral bleibt;
- die 33 Länder mit Orten des Spiels als eigene Ringe (Pastellfarbe, Nachbarn verschieden) mit Namenspunkt
  (Kürzel, deutscher Name, Punkt, Abstand zum Rand), dazu Meeresnamen für die große Karte;
- `REGIONS`: Gebiete mit feinen Küsten (jeder Ort liegt in einem, `npm test` prüft das).

Nachweis im Spiel („Über das Spiel“, Block „Kartendaten“; die Texte stehen in `src/map/credits.js`): Straßenverläufe,
Küsten und Grenzen von Natural Earth (gemeinfrei, mit Link); Orte (Lage und Einwohnerzahlen) von GeoNames mit Link,
Lizenz CC BY 4.0 mit Link und dem Zusatz „Auswahl und Namen fürs Spiel angepasst“; Höhen aus den Terrain Tiles
(Mapzen, AWS Open Data), dahinter aufklappbar die Hinweise der Höhenquellen im englischen Wortlaut – für jede Quelle,
deren Gebiet die Karte berührt (Österreich, Europa, ETOPO1, Norwegen, Vereinigtes Königreich, USGS und ArcticDEM für
die Straßen nördlich von 60°). `tools/save-test.mjs` prüft diese Liste gegen die Länder der Karte.
