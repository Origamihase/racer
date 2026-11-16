# Straßennetz für „Navi ferngesteuert XXL“: echte Fernstraßen als Folgen von Orten.
# Zeile: Kennung | Art (ab = Autobahn, land = Landstraße, faehre, zug, flug) | Land | Punkte mit ';'
# Punkt: Name            → Wiki-Ort oder Ortsverzeichnis (im Land der Straße)
#        Name|CC         → anderes Land
#        Name@lat,lon    → feste Koordinate
#        *Name@lat,lon   → Autobahnkreuz/-dreieck (kein Ort)
ROADS = r"""
A1 | ab | DE | Puttgarden@54.50,11.22; Oldenburg in Holstein@54.29,10.88; Scharbeutz; Lübeck; *Kreuz Bargteheide@53.72,10.27; Hamburg; *Maschener Kreuz@53.39,10.05; Bremen; *Dreieck Ahlhorner Heide@52.90,8.25; Osnabrück; Münster; Werne; *Kamener Kreuz@51.58,7.69; *Kreuz Dortmund/Unna@51.52,7.63; Hagen; Wuppertal; *Kreuz Leverkusen@51.05,7.02; Köln; *Kreuz Bliesheim@50.78,6.83; Euskirchen; Blankenheim@50.44,6.65; *Dreieck Vulkaneifel@50.20,6.88; Wittlich; Hermeskeil; *Dreieck Nonnweiler@49.60,6.97; Saarbrücken
A2 | ab | DE | Oberhausen; Bottrop; Gelsenkirchen; Recklinghausen; *Kamener Kreuz; Hamm; Beckum; Bielefeld; Herford; Bad Oeynhausen; Hannover; Peine; Braunschweig; *Kreuz Wolfsburg/Königslutter@52.28,10.78; Helmstedt; Magdeburg; Brandenburg an der Havel; *Dreieck Werder@52.35,12.87
A3 | ab | DE | Arnhem|NL; Emmerich am Rhein@51.83,6.25; Wesel; Oberhausen; *Kreuz Kaiserberg@51.43,6.80; *Kreuz Breitscheid@51.36,6.87; *Kreuz Hilden@51.17,6.95; *Kreuz Leverkusen; Köln; Siegburg; Mogendorf; *Dernbacher Dreieck@50.45,7.78; Montabaur; Limburg an der Lahn; Idstein; *Wiesbadener Kreuz@50.05,8.37; *Mönchhof-Dreieck@50.02,8.49; *Frankfurter Kreuz@50.05,8.60; Offenbach am Main; Hanau; *Seligenstädter Dreieck@50.03,9.00; Aschaffenburg; Marktheidenfeld@49.85,9.60; Würzburg; *Kreuz Biebelried@49.77,10.07; Dettelbach; Haidt; Geiselwind; Höchstadt an der Aisch@49.71,10.81; Erlangen; Nürnberg; Altdorf bei Nürnberg; Neumarkt in der Oberpfalz@49.28,11.46; Regensburg; Straubing; Deggendorf; Passau
A4W | ab | DE | Aachen; Düren; *Kreuz Kerpen@50.87,6.72; Köln; Bergisch Gladbach; Gummersbach; *Kreuz Olpe-Süd@51.00,7.88
A4 | ab | DE | Kirchheim; Bad Hersfeld; Eisenach; Gotha; Erfurt; Weimar; Jena; *Hermsdorfer Kreuz@50.89,11.87; Gera; Glauchau; Chemnitz; *Dreieck Nossen@51.05,13.33; Dresden; Bautzen; Görlitz; Zgorzelec; Legnica|PL; Breslau@51.11,17.03; Opole|PL; Katowice; Krakau
A5 | ab | DE | *Hattenbacher Dreieck@50.79,9.60; Alsfeld; *Reiskirchener Dreieck@50.59,8.83; *Gambacher Kreuz@50.47,8.72; Bad Nauheim; Friedrichsdorf; Bad Homburg vor der Höhe; Frankfurt am Main; *Frankfurter Kreuz; Langen; *Darmstädter Kreuz@49.85,8.60; Pfungstadt; Bensheim; Heppenheim@49.64,8.64; Weinheim; Schriesheim; Heidelberg; *Kreuz Walldorf@49.31,8.61; Bruchsal; Karlsruhe; Rastatt; Baden-Baden; Bühl; Offenburg; Lahr@48.34,7.87; Rust; Freiburg im Breisgau; Bad Krozingen@47.92,7.70; Neuenburg am Rhein@47.81,7.56; Weil am Rhein; Basel
A6 | ab | DE | Saarbrücken; Homburg@49.33,7.34; *Kreuz Landstuhl@49.42,7.55; Kaiserslautern; Grünstadt@49.56,8.17; *Kreuz Frankenthal@49.55,8.33; *Viernheimer Dreieck@49.55,8.55; Mannheim; Schwetzingen; Hockenheim; *Kreuz Walldorf; Sinsheim; Heilbronn; *Weinsberger Kreuz@49.16,9.29; Öhringen@49.20,9.50; *Kreuz Feuchtwangen/Crailsheim@49.19,10.25; Ansbach; Schwabach; Feucht; Altdorf bei Nürnberg; Alfeld; Amberg; *Kreuz Oberpfälzer Wald@49.53,12.15; Vohenstrauß; Waidhaus@49.64,12.49; Roßhaupt; Pilsen@49.75,13.38; Prag
A7 | ab | DE | Flensburg; Schleswig; Rendsburg; Warder; *Dreieck Bordesholm@54.17,10.00; Neumünster; Bad Bramstedt@53.92,9.88; Norderstedt; Hamburg; *Maschener Kreuz; Bispingen; Soltau; *Walsroder Dreieck@52.83,9.63; Hodenhagen; Hannover; Hildesheim; *Dreieck Salzgitter@52.08,10.17; Seesen; Northeim; Göttingen; *Dreieck Drammetal@51.47,9.87; Lutterberg; Kassel; Melsungen; Homberg (Efze)@51.03,9.40; Kirchheim; *Hattenbacher Dreieck; Fulda; *Dreieck Fulda@50.49,9.72; Bad Brückenau@50.31,9.79; *Kreuz Schweinfurt/Werneck@49.99,10.10; *Kreuz Biebelried; Rothenburg ob der Tauber@49.38,10.18; *Kreuz Feuchtwangen/Crailsheim; Ellwangen; Aalen; Heidenheim an der Brenz@48.68,10.15; *Kreuz Ulm/Elchingen@48.45,10.07; Illertissen; *Kreuz Memmingen@47.98,10.18; Kempten@47.73,10.31; Füssen@47.57,10.70
A8 | ab | DE | Karlsruhe; Pforzheim; *Dreieck Leonberg@48.79,8.99; Stuttgart; Kirchheim unter Teck@48.65,9.45; *Kreuz Ulm/Elchingen; Günzburg; Jettingen; Augsburg; Dachau; München; Holzkirchen@47.88,11.70; *Inntal-Dreieck@47.83,12.12; Rosenheim; Prien am Chiemsee; Traunstein; Bad Reichenhall; Salzburg
A9 | ab | DE | *Dreieck Potsdam@52.30,12.95; Dessau@51.84,12.25; Köckern; Bitterfeld-Wolfen; *Schkeuditzer Kreuz@51.42,12.19; Leuna; *Kreuz Rippachtal@51.22,12.07; Naumburg@51.15,11.81; *Hermsdorfer Kreuz; Hof@50.31,11.91; Bayreuth; Pegnitz@49.75,11.54; Nürnberg; Feucht; Hilpoltstein; Ingolstadt; *Dreieck Holledau@48.60,11.63; Pfaffenhofen an der Ilm@48.53,11.51; *Kreuz Neufahrn@48.31,11.62; München
A10 | ab | DE | *Dreieck Werder; *Dreieck Potsdam; *Schönefelder Kreuz@52.33,13.47; *Dreieck Spreeau@52.37,13.80; Rüdersdorf bei Berlin; *Dreieck Barnim@52.67,13.60; *Kreuz Oranienburg@52.72,13.20; *Dreieck Havelland@52.70,13.02; Falkensee@52.56,13.09; *Dreieck Werder
A115 | ab | DE | Berlin; Potsdam; *Dreieck Potsdam
A113 | ab | DE | Berlin; *Schönefelder Kreuz
A111 | ab | DE | Berlin; Hennigsdorf; *Kreuz Oranienburg
A11 | ab | DE | *Dreieck Barnim; Eberswalde; *Kreuz Uckermark@53.27,13.95; Stettin@53.43,14.55
A12 | ab | DE | *Dreieck Spreeau; Fürstenwalde@52.36,14.06; Frankfurt (Oder); Slubice; Posen@52.41,16.93; Lodz@51.76,19.46; Warschau
A13 | ab | DE | *Schönefelder Kreuz; Krausnick; Lübbenau@51.87,13.97; Ruhland@51.46,13.87; Dresden
A14 | ab | DE | Wismar; Schwerin; *Kreuz Schwerin@53.52,11.52; Ludwigslust; Wittenberge; Stendal; Magdeburg; Bernburg@51.79,11.74; Halle an der Saale; *Schkeuditzer Kreuz; Leipzig; *Dreieck Parthenaue@51.33,12.57; Grimma; Döbeln; *Dreieck Nossen
A19 | ab | DE | Rostock; Güstrow; Malchow@53.47,12.42; *Dreieck Wittstock/Dosse@53.20,12.47
A20 | ab | DE | Lübeck; Dassow; Wismar; Rostock; Grimmen@54.11,13.04; Greifswald; Neubrandenburg; Pasewalk@53.50,13.99; *Kreuz Uckermark
A21 | ab | DE | Kiel; Bad Segeberg@53.94,10.31; *Kreuz Bargteheide
A215 | ab | DE | *Dreieck Bordesholm; Kiel
A23 | ab | DE | Hamburg; Elmshorn; Itzehoe; Wacken; Heide
A24 | ab | DE | Hamburg; Wittenburg@53.51,11.07; *Kreuz Schwerin; Neustadt-Glewe; Parchim; *Dreieck Wittstock/Dosse; Neuruppin; *Dreieck Havelland
A27 | ab | DE | Cuxhaven; Wurster Nordseeküste; Bremerhaven; Bremen; Verden@52.92,9.23; *Walsroder Dreieck
A28 | ab | DE | Leer@53.23,7.45; Oldenburg@53.14,8.21; Delmenhorst; Bremen
A29 | ab | DE | Wilhelmshaven; Oldenburg@53.14,8.21; *Dreieck Ahlhorner Heide
A30 | ab | DE | Hengelo|NL; Bad Bentheim@52.30,7.16; *Kreuz Schüttorf@52.32,7.25; Rheine; Osnabrück; Melle@52.20,8.34; Bad Oeynhausen
A31 | ab | DE | Emden; Leer@53.23,7.45; Meppen; Lingen@52.52,7.32; *Kreuz Schüttorf; Gronau@52.21,7.02; Borken in Westfalen@51.84,6.86; Dorsten; Bottrop
A33 | ab | DE | Osnabrück; Bielefeld; Paderborn; *Kreuz Wünnenberg-Haaren@51.52,8.72
A36 | ab | DE | Braunschweig; Bad Harzburg@51.88,10.56; Wernigerode; Quedlinburg; Bernburg@51.79,11.74
A38 | ab | DE | *Dreieck Drammetal; Heiligenstadt@51.38,10.14; Nordhausen; Sangerhausen; Eisleben@51.53,11.55; *Kreuz Rippachtal; Markkleeberg; Großpösna; *Dreieck Parthenaue
A39 | ab | DE | *Maschener Kreuz; Lüneburg
A39S | ab | DE | Wolfsburg; *Kreuz Wolfsburg/Königslutter; Braunschweig; Salzgitter; *Dreieck Salzgitter
A40 | ab | DE | Venlo|NL; Moers; *Kreuz Kaiserberg; Mülheim an der Ruhr; Essen; Bochum - Wattenscheid; Bochum; Dortmund
A43 | ab | DE | Münster; Recklinghausen; Bochum; Wuppertal
A44W | ab | DE | Aachen; Alsdorf; Aldenhoven; Jüchen; Düsseldorf; *Kreuz Breitscheid
A44 | ab | DE | Dortmund; *Kreuz Dortmund/Unna; Werl; Soest; Erwitte@51.61,8.34; *Kreuz Wünnenberg-Haaren; Diemelstadt@51.47,8.99; Warburg@51.49,9.15; Zierenberg@51.37,9.30; Kassel
A44O | ab | DE | Kassel; Hessisch Lichtenau@51.20,9.72; Eisenach
A45 | ab | DE | Dortmund; Hagen; Lüdenscheid; *Kreuz Olpe-Süd; Siegen; Dillenburg@50.74,8.29; Herborn@50.68,8.30; Wetzlar; *Gambacher Kreuz; Wölfersheim@50.40,8.82; Hammersbach; *Langenselbolder Dreieck@50.17,9.03; Alzenau@50.09,9.06; *Seligenstädter Dreieck
A46 | ab | DE | Heinsberg; Erkelenz; Jüchen; Neuss; Düsseldorf; *Kreuz Hilden; Wuppertal
A46O | ab | DE | Hagen; Iserlohn; Arnsberg; Meschede
A48 | ab | DE | *Dernbacher Dreieck; Koblenz; *Kreuz Koblenz@50.37,7.48; Polch@50.30,7.31; Mayen; Kehrig; Kaisersesch@50.23,7.14; Ulmen@50.21,6.98; *Dreieck Vulkaneifel
A49 | ab | DE | Kassel; Baunatal; Fritzlar; Borken (Hessen); Schwalmstadt@50.91,9.21; Alsfeld
A52 | ab | DE | Mönchengladbach; Düsseldorf; *Kreuz Breitscheid; Essen
A57 | ab | DE | Nijmegen|NL; Goch; Weeze; Moers; Krefeld; Neuss; Köln
A59 | ab | DE | Düsseldorf; Monheim; *Kreuz Leverkusen; Köln; Bonn; Bad Godesberg; *Kreuz Meckenheim@50.62,7.03
A60 | ab | DE | *Rüsselsheimer Dreieck@49.98,8.42; Mainz; Bingen am Rhein; *Dreieck Nahetal@49.93,7.87
A61 | ab | DE | Venlo|NL; Mönchengladbach; Jüchen; *Kreuz Kerpen; *Kreuz Bliesheim; *Kreuz Meckenheim; Bad Neuenahr-Ahrweiler@50.54,7.11; Mendig@50.37,7.28; *Kreuz Koblenz; Emmelshausen@50.15,7.56; Rheinböllen@50.01,7.67; *Dreieck Nahetal; Bad Kreuznach; Alzey; Worms; *Kreuz Frankenthal; Ludwigshafen; Speyer; Hockenheim
A62 | ab | DE | *Dreieck Nonnweiler; St. Wendel; Kusel@49.54,7.40; *Kreuz Landstuhl
A63 | ab | DE | Mainz; Alzey; Kaiserslautern
A64 | ab | DE | Trier; Luxemburg
A65 | ab | DE | Ludwigshafen; Neustadt an der Weinstraße@49.35,8.14; Landau in der Pfalz@49.20,8.11; Karlsruhe
A66W | ab | DE | Wiesbaden; *Wiesbadener Kreuz; Hofheim am Taunus@50.09,8.45; Eschborn; Frankfurt am Main
A66 | ab | DE | Frankfurt am Main; Maintal; Hanau; Erlensee; *Langenselbolder Dreieck; Gründau; Gelnhausen; Wächtersbach; Bad Orb; Bad Soden-Salmünster; Schlüchtern; Neuhof; Eichenzell; *Dreieck Fulda
A67 | ab | DE | *Mönchhof-Dreieck; *Rüsselsheimer Dreieck; Groß-Gerau; *Darmstädter Kreuz; Lorsch@49.65,8.57; *Viernheimer Dreieck
A70 | ab | DE | *Kreuz Schweinfurt/Werneck; Schweinfurt; Haßfurt@50.03,10.51; Bamberg; Bayreuth
A71 | ab | DE | Sangerhausen; Erfurt; Ilmenau; Suhl; Meiningen; Bad Neustadt an der Saale@50.32,10.22; Schweinfurt
A72 | ab | DE | Hof@50.31,11.91; Plauen; Netzschkau; Zwickau; Chemnitz; Borna@51.12,12.50; Markkleeberg
A73 | ab | DE | Suhl; Coburg; Lichtenfels@50.14,11.06; Bamberg; Forchheim; Erlangen; Nürnberg; Feucht
A81 | ab | DE | Würzburg; Tauberbischofsheim@49.62,9.66; *Weinsberger Kreuz; Heilbronn; Ludwigsburg; *Dreieck Leonberg; Böblingen; Herrenberg; Rottweil; Villingen-Schwenningen; *Dreieck Bad Dürrheim@47.99,8.55; *Kreuz Hegau@47.85,8.83; Singen (Hohentwiel); Schaffhausen|CH; Winterthur|CH
A92 | ab | DE | *Kreuz Neufahrn; Freising; Landshut; Dingolfing; Deggendorf
A93 | ab | DE | Hof@50.31,11.91; Weiden@49.68,12.16; *Kreuz Oberpfälzer Wald; Schwandorf; Regensburg; *Dreieck Holledau
A93S | ab | DE | *Inntal-Dreieck; Kufstein|AT
A95 | ab | DE | München; Starnberg; Murnau am Staffelsee@47.68,11.20; Garmisch-Partenkirchen
A96 | ab | DE | München; Landsberg am Lech; Buchloe@48.04,10.72; *Kreuz Memmingen; Leutkirch im Allgäu@47.83,10.02; Wangen im Allgäu@47.69,9.83; Lindau@47.55,9.69; Bregenz|AT
A98 | land | DE | Weil am Rhein; Lörrach; Rheinfelden@47.56,7.79; Bad Säckingen; Waldshut-Tiengen; Schaffhausen|CH
A480 | ab | DE | *Reiskirchener Dreieck; Gießen; Wetzlar
B1 | land | DE | Paderborn; Horn-Bad Meinberg; Blomberg@51.94,9.09; Hameln; Hildesheim
B2 | land | DE | Garmisch-Partenkirchen; Mittenwald@47.44,11.26; Seefeld in Tirol; Zirl@47.27,11.24; Innsbruck
B3 | land | DE | Gießen; Marburg; Jesberg@51.00,9.15; Borken (Hessen)
B3N | land | DE | Hannover; Celle; Uelzen
B4 | land | DE | Lüneburg; Uelzen; Gifhorn; Braunschweig
B4H | land | DE | Bad Harzburg@51.88,10.56; Torfhaus; Braunlage@51.73,10.61; Wieda; Nordhausen
B5 | land | DE | Heide; Friedrichstadt; Husum; Niebüll@54.79,8.83; Dagebüll@54.73,8.69
B9 | land | DE | Koblenz; Bad Salzig; St. Goar; Bacharach; Bingen am Rhein
B9N | land | DE | Nijmegen|NL; Kranenburg; Kleve; Goch
B17 | land | DE | Augsburg; Königsbrunn; Landsberg am Lech; Schongau@47.81,10.90; Schwangau; Füssen@47.57,10.70
B20 | land | DE | Bad Reichenhall; Berchtesgaden
B27 | land | DE | Fulda; Hünfeld@50.67,9.77; Burghaun; Haunetal; Bad Hersfeld
B28 | land | DE | Offenburg; Kehl; Straßburg
B30 | land | DE | Friedrichshafen; Ravensburg; Weingarten; Biberach an der Riß@48.10,9.79; Ulm
B31 | land | DE | Lindau@47.55,9.69; Friedrichshafen; Überlingen; *Kreuz Hegau
B31H | land | DE | Freiburg im Breisgau; Titisee-Neustadt; Donaueschingen; *Dreieck Bad Dürrheim
B33 | land | DE | Singen (Hohentwiel); Radolfzell@47.74,8.97; Konstanz; Kreuzlingen
B42 | land | DE | Koblenz; Lahnstein; St. Goarshausen; Rüdesheim; Eltville am Rhein; Wiesbaden
B49 | land | DE | Wetzlar; Weilburg@50.48,8.26; Limburg an der Lahn
B53 | land | DE | Koblenz; Cochem; Traben-Trarbach; Bernkastel-Kues@49.92,7.07; Trier
B54 | land | DE | Gronau@52.21,7.02; Enschede
B73 | land | DE | Cuxhaven; Hemmoor; Stade; Buxtehude; Hamburg
B76 | land | DE | Kiel; Eckernförde; Schleswig
B83 | land | DE | Hameln; Holzminden@51.83,9.45; Höxter@51.77,9.38; Beverungen; Hann. Münden@51.42,9.65; Lutterberg
B96 | land | DE | Grimmen@54.11,13.04; Stralsund; Bergen auf Rügen@54.42,13.43; Binz; Prora
B105 | land | DE | Rostock; Gelbensande; Ribnitz-Damgarten@54.24,12.43; Stralsund
B170 | land | DE | Dresden; Dippoldiswalde@50.90,13.67; Zinnwald-Georgenfeld; Teplice; Lovosice@50.52,14.05
B179 | land | DE | Füssen@47.57,10.70; Reutte (Österreich); Nassereith@47.32,10.84; Imst@47.24,10.74
B203 | land | DE | Heide; Büsum
B217 | land | DE | Hannover; Hameln
B242 | land | DE | Seesen; Clausthal-Zellerfeld; Braunlage@51.73,10.61; Elend; Wernigerode
B254 | land | DE | Fulda; Bad Salzschlirf; Lauterbach@50.64,9.40; Alsfeld
B279 | land | DE | Fulda; Gersfeld; Bischofsheim in der Rhön; Bad Neustadt an der Saale@50.32,10.22
B310 | land | DE | Füssen@47.57,10.70; Pfronten; Sonthofen@47.51,10.28; Bad Hindelang
B318 | land | DE | Holzkirchen@47.88,11.70; Gmund am Tegernsee
A1NL | ab | NL | Hengelo; Apeldoorn; Amersfoort; Amsterdam
A35NL | ab | NL | Enschede; Hengelo
A12NL | ab | NL | Arnhem; Utrecht; Den Haag@52.08,4.31
A2NL | ab | NL | Amsterdam; Utrecht; 's-Hertogenbosch@51.70,5.30; Eindhoven; Maastricht; Lüttich@50.63,5.57
A20NL | ab | NL | Utrecht; Gouda; Rotterdam
A16NL | ab | NL | Rotterdam; Breda; Antwerpen@51.22,4.40
A50NL | ab | NL | Arnhem; Nijmegen; Venlo
A67NL | ab | NL | Venlo; Eindhoven; Antwerpen@51.22,4.40
E40 | ab | BE | Aachen|DE; Lüttich@50.63,5.57; Leuven; Brüssel; Gent; Brügge@51.21,3.22; Dünkirchen@51.03,2.38; Calais|FR
E19 | ab | BE | Antwerpen@51.22,4.40; Brüssel
E411 | ab | BE | Brüssel; Namur; Arlon; Luxemburg
A31FR | ab | FR | Luxemburg; Thionville; Metz; Nancy
A320 | ab | FR | Saarbrücken|DE; Metz
A4FR | ab | FR | Straßburg; Saverne@48.74,7.36; Metz; Reims; Paris
A35FR | ab | FR | Straßburg; Colmar; Mülhausen@47.75,7.34; Basel
A36FR | ab | FR | Mülhausen@47.75,7.34; Burnhaupt-le-Haut; Belfort; Besançon; Beaune
A6FR | ab | FR | Paris; Auxerre; Beaune; Mâcon; Lyon
A7FR | ab | FR | Lyon; Vienne@45.52,4.87; Pont-de-l'Isère; Valence; Montélimar; Orange; Avignon; Salon-de-Provence; Marseille
A9FR | ab | FR | Orange; Nîmes; Montpellier; Béziers; Narbonne; Perpignan; Le Boulou@42.52,2.83; La Jonquera@42.42,2.87
A54FR | ab | FR | Nîmes; Arles; Salon-de-Provence
A8FR | ab | FR | Salon-de-Provence; Aix-en-Provence; Fréjus; Cannes; Nizza; Èze; Monaco; Menton; Ventimiglia@43.79,7.61
A1FR | ab | FR | Paris; Arras; Lille
A26FR | ab | FR | Calais; Arras; Reims
E17 | ab | BE | Lille|FR; Kortrijk; Gent
A10FR | ab | FR | Paris; Orléans; Tours; Poitiers; Bordeaux
A63FR | ab | FR | Bordeaux; Bayonne; San Sebastián@43.32,-1.98; Bilbao
A61FR | ab | FR | Narbonne; Carcassonne; Toulouse; Agen; Bordeaux
A40FR | ab | FR | Genf; Annecy; Lyon
AP7 | ab | ES | La Jonquera@42.42,2.87; Figueres; Girona; Barcelona; Tarragona; Castellón de la Plana@39.99,-0.04; Valencia; Alicante
A2ES | ab | ES | Barcelona; Lleida; Zaragoza; Madrid
AP68 | ab | ES | Zaragoza; Logroño; Bilbao
A1ES | ab | ES | Madrid; Burgos; Vitoria-Gasteiz@42.85,-2.67; San Sebastián@43.32,-1.98
A3ES | ab | ES | Madrid; Valencia
A5ES | ab | ES | Madrid; Mérida@38.92,-6.34; Badajoz; Lissabon
A2CH | ab | CH | Basel; *Verzweigung Härkingen@47.31,7.82; Luzern; Altdorf UR@46.88,8.64; Bellinzona; Lugano; Como@45.81,9.08; Mailand
A1CH | ab | CH | St. Margrethen@47.45,9.63; St. Gallen@47.42,9.37; Winterthur; Zürich; *Verzweigung Härkingen; Bern; Lausanne; Genf
A3CH | ab | CH | Basel; Zürich; Sargans@47.05,9.44
A13CH | ab | CH | St. Margrethen@47.45,9.63; Feldkirch|AT; Sargans@47.05,9.44; Landquart@46.97,9.56; Chur; Bellinzona
A28CH | land | CH | Landquart@46.97,9.56; Klosters@46.87,9.88; Davos; Zernez; Scuol@46.80,10.30; Landeck@47.14,10.57
A6CH | ab | CH | Bern; Thun; Spiez@46.69,7.68; Interlaken
A7CH | ab | CH | Winterthur; Frauenfeld; Kreuzlingen
H13 | land | CH | Kreuzlingen; Romanshorn; St. Gallen@47.42,9.37
BERNINA | land | CH | Zernez; Samedan@46.53,9.87; Poschiavo@46.32,10.06; Tirano@46.22,10.17
SS38 | land | IT | Mailand; Lecco; Colico@46.14,9.37; Comunità montana della Valtellina di Sondrio; Tirano@46.22,10.17
A12AT | ab | AT | Kufstein; Wörgl; Rattenberg; Innsbruck; Zirl@47.27,11.24; Imst@47.24,10.74; Landeck@47.14,10.57
S16 | ab | AT | Landeck@47.14,10.57; St. Anton am Arlberg@47.13,10.27; Bludenz
A14AT | ab | AT | Bludenz; Feldkirch; Dornbirn; Bregenz
A22 | ab | IT | Innsbruck|AT; Brenner@47.00,11.51; Sterzing@46.90,11.43; Brixen@46.72,11.66; Bozen@46.50,11.35; Trient@46.07,11.12; Rovereto; Verona; Mantua@45.16,10.79; Modena
A1AT | ab | AT | Salzburg; Wels; Linz; St. Pölten@48.20,15.63; Wien
A8AT | ab | AT | Passau|DE; Wels
A10AT | ab | AT | Salzburg; Bischofshofen@47.42,13.22; Spittal an der Drau@46.80,13.50; Villach
A2AT | ab | AT | Villach; Klagenfurt@46.62,14.31; Graz; Wien
A9AT | ab | AT | Wels; Liezen@47.57,14.24; Graz; Maribor@46.55,15.65; Zagreb@45.81,15.98
A2SI | ab | SI | Villach|AT; Ljubljana; Zagreb@45.81,15.98
A3HR | ab | HR | Zagreb@45.81,15.98; Slavonski Brod; Osijek
A5AT | ab | AT | Wien; Brünn@49.20,16.61; Prag
D8 | ab | CZ | Dresden|DE; Ústí nad Labem@50.66,14.03; Lovosice@50.52,14.05; Prag
A4IT | ab | IT | Turin; Novara; Mailand; Bergamo; Brescia; Sirmione; Verona; Vicenza; Padua@45.41,11.88; Venedig@45.49,12.24; Portogruaro@45.78,12.84; Triest@45.65,13.78
A1IT | ab | IT | Mailand; Piacenza; Parma; Modena; Bologna; Florenz@43.77,11.25; Arezzo; Orvieto; Rom; Caserta; Neapel@40.85,14.27
A2IT | ab | IT | Neapel@40.85,14.27; Salerno; Cosenza; Villa San Giovanni@38.22,15.64
A20IT | ab | IT | Messina; Cefalù@38.04,14.02; Palermo
A29IT | ab | IT | Palermo; Alcamo; Mazara del Vallo
A18IT | ab | IT | Messina; Catania; Syrakus@37.08,15.29; Pozzallo@36.73,14.85
A7IT | ab | IT | Mailand; Genua@44.41,8.93
A10IT | ab | IT | Ventimiglia@43.79,7.61; Sanremo; Savona; Genua@44.41,8.93
A12IT | ab | IT | Genua@44.41,8.93; La Spezia; Pisa; Florenz@43.77,11.25
A21IT | ab | IT | Turin; Alessandria; Piacenza
A6IT | ab | IT | Turin; Savona
SS51 | land | IT | Venedig@45.49,12.24; Treviso; Belluno; Corte Belluno; Toblach@46.73,12.22; Bruneck@46.80,11.94; Brixen@46.72,11.66
MT1 | land | MT | Valletta; Mdina; Mellieha
A4PL | ab | PL | Krakau; Rzeszów
A1PL | ab | PL | Danzig; Toruń; Lodz@51.76,19.46; Katowice
S7 | ab | PL | Danzig; Elbląg; Warschau; Radom; Kielce; Krakau
S6 | ab | PL | Stettin@53.43,14.55; Koszalin; Słupsk; Rumia; Danzig
E67 | land | PL | Warschau; Białystok; Suwałki; Kaunas@54.90,23.90; Vilnius
E45 | ab | DK | Flensburg|DE; Kolding; Vejle; Aarhus@56.15,10.21; Randers; Haverslev; Aalborg; Hirtshals
E20 | ab | DK | Kolding; Odense; Halsskov; Ringsted; Kopenhagen; Malmö
E47 | ab | DK | Rødby@54.65,11.35; Køge@55.46,12.18; Kopenhagen
E6 | ab | SE | Malmö; Helsingborg; Halmstad; Göteborg; Uddevalla; Sarpsborg@59.28,11.11; Moss@59.43,10.66; Oslo
E22 | ab | SE | Trelleborg; Malmö
E4 | ab | SE | Helsingborg; Ljungby; Jönköping; Röttle; Linköping; Norrköping; Södertälje; Stockholm; Uppsala; Gävle; Sundsvall; Umeå; Luleå; Haparanda@65.84,24.14; Kemi@65.74,24.56
RV40 | ab | SE | Göteborg; Borås; Jönköping
E18NO | ab | NO | Oslo; Drammen; Larvik; Arendal; Kristiansand
E39S | land | NO | Kristiansand; Flekkefjord@58.30,6.66; Stavanger; Haugesund; Leirvik@59.78,5.50; Halhjem; Bergen
E16 | land | NO | Oslo; Hønefoss; Fagernes@60.99,9.23; Lærdal@61.10,7.48; Voss@60.63,6.42; Bergen
E6NO | land | NO | Oslo; Hamar; Lillehammer; Dombås@62.07,9.12; Oppdal@62.59,9.69; Ulsberg@62.75,9.99; Trondheim
RV3 | land | NO | Hamar; Elverum; Stor-Elvdal; Tynset@62.28,10.78; Ulsberg@62.75,9.99
E136 | land | NO | Dombås@62.07,9.12; Åndalsnes@62.57,7.69; Ålesund
E39N | land | NO | Bergen; Førde@61.45,5.86; Hellesylt; Ålesund; Molde; Orkanger@63.30,9.85; Trondheim
E18FI | ab | FI | Turku; Helsinki
E75 | ab | FI | Helsinki; Lahden seutukunta; Heinola; Jyväskylä; Oulu; Kemi@65.74,24.56; Rovaniemi; Sodankylä@67.42,26.59; Lappland
VT9 | land | FI | Turku; Tampere; Jämsän seutukunta; Jyväskylä
VT5 | land | FI | Heinola; Mikkeli; Sisä-Savon seutukunta; Kuopio; Iisalmi; Kajaanin seutukunta; Oulu
M20 | ab | GB | Folkestone; Maidstone; London
M1 | ab | GB | London; Milton Keynes; Birmingham; Stoke-on-Trent; Warrington; Preston; Carlisle; Glasgow; Stirling; Perth (Schottland)
M62 | ab | GB | Liverpool; Warrington; Manchester
I5 | ab | US | Vancouver|CA; Seattle; Portland@45.52,-122.68; Medford@42.33,-122.87; Sacramento; Los Angeles; Anaheim; San Diego
I80W | ab | US | San Francisco; Sacramento; Salt Lake City; Omaha; Chicago
I10W | ab | US | Santa Monica; Los Angeles; Phoenix; Tucson; El Paso; San Antonio; Houston; New Orleans; Mobile@30.69,-88.04; Tallahassee; *Lake City (I-75)@30.19,-82.64; Jacksonville@30.33,-81.66
I35 | ab | US | Laredo; San Antonio; Austin@30.27,-97.74; Fort Worth; Oklahoma City; St. Louis@38.63,-90.20; Chicago
US290 | land | US | Houston; Branham; Austin@30.27,-97.74; Fredericksburg (Texas)
MX85 | land | MX | Laredo|US; Monterrey
I75 | ab | US | Frankenmuth Township; Detroit; Cincinnati; Atlanta; *Lake City (I-75); Tampa
I4 | ab | US | Tampa; Lake Buena Vista; Orlando; Daytona Beach
I95 | ab | US | Miami; Daytona Beach; Jacksonville@30.33,-81.66; Savannah@32.08,-81.09; Richmond@37.54,-77.44; Washington@38.90,-77.04; Philadelphia; New York City
FLTP | ab | US | Orlando; Miami
US1 | land | US | Miami; Key Largo; Key West
I80E | ab | US | New York City; Cleveland@41.50,-81.69; Chicago
I94 | ab | US | Chicago; Detroit
I90 | ab | US | Chicago; Minneapolis; Billings; Spokane; Seattle
TOMEI | ab | JP | Tokio; Shizuoka; Nagoya; Kyoto; Osaka
JO15 | land | JO | Amman; Petra
TF1 | ab | ES | Arona; Adeje
F_PUTT | faehre | DE | Puttgarden@54.50,11.22; Rødby@54.65,11.35
F_HELG | faehre | DE | Cuxhaven; Helgoland
F_HELG2 | faehre | DE | Büsum; Helgoland
F_FOEHR | faehre | DE | Dagebüll@54.73,8.69; Wyk auf Föhr
Z_SYLT | zug | DE | Niebüll@54.79,8.83; Sylt
F_OSLO | faehre | DE | Kiel; Oslo
F_GOET | faehre | DE | Kiel; Göteborg
F_TREL | faehre | DE | Rostock; Trelleborg
F_HELS | faehre | DE | Lübeck; Helsinki
F_KRIS | faehre | DK | Hirtshals; Kristiansand
F_TURKU | faehre | SE | Stockholm; Turku
F_STHEL | faehre | SE | Stockholm; Helsinki
Z_TUNNEL | zug | FR | Calais; Folkestone
F_DUBLIN | faehre | GB | Liverpool; Dublin
F_PALMA | faehre | ES | Barcelona; Palma
F_MESSINA | faehre | IT | Villa San Giovanni@38.22,15.64; Messina
F_MALTA | faehre | IT | Pozzallo@36.73,14.85; Valletta
X_NYC | flug | DE | Frankfurt am Main; New York City
X_CHI | flug | DE | Frankfurt am Main; Chicago
X_MIA | flug | DE | Frankfurt am Main; Miami
X_MCO | flug | DE | Frankfurt am Main; Orlando
X_IAH | flug | DE | Frankfurt am Main; Houston
X_LAX | flug | DE | Frankfurt am Main; Los Angeles
X_SFO | flug | DE | Frankfurt am Main; San Francisco
X_SEA | flug | DE | Frankfurt am Main; Seattle
X_YVR | flug | DE | Frankfurt am Main; Vancouver
X_TYO | flug | DE | Frankfurt am Main; Tokio
X_CPT | flug | DE | Frankfurt am Main; Kapstadt
X_AMM | flug | DE | Frankfurt am Main; Amman
X_EVN | flug | DE | Frankfurt am Main; Jerewan
X_SDQ | flug | DE | Frankfurt am Main; Santo Domingo Este
X_CV | flug | DE | Frankfurt am Main; São Vicente
X_TFS | flug | DE | Frankfurt am Main; Arona
X_FNC | flug | DE | Frankfurt am Main; Funchal
X_PMI | flug | DE | Frankfurt am Main; Palma
"""
