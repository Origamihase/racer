# Autobahnringe statt Stern (26.11.2026, der Besitzer: „Ist es möglich die Karte näher ans Original zu bringen?“ –
# „Beides“: echte Flüsse und Autobahnen, die an den Städten vorbeiführen wie in echt).
#
# Bis hierher führte jede Autobahn, die eine Großstadt berührt, in deren Ortspunkt: Am Kölner Dom trafen sich A1, A3,
# A4, A57 und A59 wie die Speichen eines Rads. In echt laufen sie als Ring um die Stadt, treffen sich an Kreuzen vor
# der Stadt, und von dort führt eine Ausfahrt hinein. Dieses Skript schreibt das Handnetz in netz.json um (einmal; es
# ist die Herkunft der neuen Knoten, wie roads_def.py die der alten): Je Stadt ersetzt es den Ortsknoten in jeder
# Straße durch die echten Kreuze und Anschlussstellen, teilt Straßen, die in Wirklichkeit eine Lücke haben, und hängt
# den Ort an eine Anschlussstelle mit Zubringer. Danach legt verlauf.py alles auf die echten Linien (Kreuze an die
# echten Schnittpunkte der Linien, Anschlussstellen auf den Lotfußpunkt).
#
#     python3 -I tools/map/quelle/ringe.py tools/map/netz.json
#
# Punkte wie in roads_def.py: „Name“ = vorhandener Knoten, „*Name@lat,lon“ = Kreuz/Dreieck, „AS Name@lat,lon“ =
# Anschlussstelle. Eine Liste ersetzt den Ortsknoten in der Straße; „|“ darin teilt die Straße dort (der zweite Teil
# heißt wie die Straße mit angehängtem „S“). „ort“: die Anschlussstelle, an der der Ort danach hängt (Zubringer =
# Luftlinie × 1,2, wie knoten.zubringer_roh), „bleibt“: Straßen, die weiter im Ort enden (Stadtautobahnen).
import json
import math
import sys

STAEDTE = {
    'Köln': {
        # A1: westlicher Ring (Kreuz Köln-Nord mit der A57, Kreuz Köln-West mit der A4)
        'A1': ['*Kreuz Köln-Nord@51.005,6.885', '*Kreuz Köln-West@50.925,6.85'],
        # A3: östlicher Ring über Köln-Mülheim und das Dreieck Heumar
        'A3': ['AS Köln-Mülheim@50.975,7.035', '*Dreieck Heumar@50.885,7.075'],
        # A4: über Köln-West, Köln-Süd und die Rodenkirchener Brücke nach Heumar, dann ostwärts
        'A4W': ['*Kreuz Köln-West@50.925,6.85', '*Kreuz Köln-Süd@50.875,6.935', '*Dreieck Heumar@50.885,7.075'],
        # A57 endet am Kreuz Köln-Nord (die Innere Kanalstraße ist keine Autobahn)
        'A57': ['*Kreuz Köln-Nord@51.005,6.885'],
        # A59: Lücke durch Köln (zwischen Leverkusen und Heumar fährt man auf der A3)
        'A59': ['|', '*Dreieck Heumar@50.885,7.075'],
        # von Osten über den Rhein zum Dom, wie die Welt den Ort baut (Hohenzollernbrücke)
        'ort': 'AS Köln-Mülheim',
    },
    'Hamburg': {
        'A1': ['*Kreuz Hamburg-Ost@53.585,10.155', 'AS Hamburg-Veddel@53.51,10.045'],
        'A7': ['*Kreuz Hamburg-Nordwest@53.615,9.905'],
        'A23': ['*Kreuz Hamburg-Nordwest@53.615,9.905'],
        'A24': ['*Kreuz Hamburg-Ost@53.585,10.155'],
        'B73': ['Maschener Kreuz'],
        # von Süden über die Elbbrücken in die Stadt (die Welt baut dort die Elbe mit dem Hafen)
        'ort': 'AS Hamburg-Veddel',
    },
    'Frankfurt am Main': {
        'A5': ['*Bad Homburger Kreuz@50.20,8.635', '*Nordwestkreuz Frankfurt@50.137,8.605'],
        'A66W': ['*Nordwestkreuz Frankfurt@50.137,8.605'],
        'A66': ['*Dreieck Erlenbruch@50.128,8.737'],
        'ins': [('A3', 'Mönchhof-Dreieck', ['AS Frankfurt-Flughafen@50.052,8.575']),
                ('A3', 'Frankfurter Kreuz', ['AS Frankfurt-Süd@50.08,8.67', '*Offenbacher Kreuz@50.09,8.74'])],
        'neu': [{'id': 'A661', 'kind': 'ab', 'cc': 'DE', 'nodes': ['Bad Homburger Kreuz', 'Dreieck Erlenbruch', 'AS Offenbach-Kaiserlei@50.104,8.737', 'Offenbacher Kreuz']}],
        # Luftfracht ab dem Flughafen, der Ort von Süden über den Main (Eiserner Steg)
        'flug': 'AS Frankfurt-Flughafen',
        'hand': ['Dreieck Erlenbruch', 'AS Offenbach-Kaiserlei'],
        'ort': 'AS Frankfurt-Süd',
    },
    'Offenbach am Main': {
        # nicht mehr an der A3 (die führt südlich vorbei): von der A661 am Kaiserlei in die Stadt
        'A3': [],
        'ort': 'AS Offenbach-Kaiserlei',
    },
    'München': {
        # A8 endet von Westen in der Stadt und beginnt im Südosten neu, der Ring A99 verbindet
        'A8': ['*Dreieck München-Eschenried@48.20,11.43', 'München', '|', 'München', '*Kreuz München-Süd@48.07,11.66'],
        'A96': ['München', '*Dreieck München-Südwest@48.10,11.43'],
        'ins': [('A9', 'Kreuz Neufahrn', ['*Kreuz München-Nord@48.258,11.625'])],
        'neu': [{'id': 'A99', 'kind': 'ab', 'cc': 'DE', 'nodes': ['Dreieck München-Südwest', 'Dreieck München-Eschenried', 'Kreuz München-Nord', 'Kreuz München-Süd']}],
    },
    'Düsseldorf': {
        'A44W': ['*Kreuz Meerbusch@51.265,6.655', '*Kreuz Düsseldorf-Nord@51.29,6.80'],
        'A52': ['*Kreuz Kaarst@51.22,6.62', '|'],
        'A46': ['AS Düsseldorf-Bilk@51.195,6.785', '*Kreuz Düsseldorf-Süd@51.165,6.875'],
        'A59': ['*Kreuz Düsseldorf-Süd@51.165,6.875'],
        'ins': [('A57', 'Krefeld', ['*Kreuz Meerbusch@51.265,6.655', '*Kreuz Kaarst@51.22,6.62'])],
        'ort': 'AS Düsseldorf-Bilk',
        'hand': ['Kreuz Meerbusch'],
    },
    'Essen': {
        'A40': ['AS Essen-Zentrum@51.448,7.01', '*Dreieck Essen-Ost@51.452,7.065'],
        'A52S': ['*Dreieck Essen-Ost@51.452,7.065'],
        'ort': 'AS Essen-Zentrum',
    },
    'Dortmund': {
        # A40 endet als B1 in der Stadt, die A44 beginnt dort; die A45 beginnt am Kreuz Dortmund-West
        'A40': ['*Kreuz Dortmund-West@51.495,7.395', 'Dortmund'],
        'A45': ['*Kreuz Dortmund-West@51.495,7.395'],
    },
    'Bochum': {
        'A40': ['AS Bochum-Zentrum@51.488,7.21', '*Kreuz Bochum@51.49,7.265'],
        'A43': ['*Kreuz Bochum@51.49,7.265'],
        'ort': 'AS Bochum-Zentrum',
    },
    'Wuppertal': {
        'A1': ['*Kreuz Wuppertal-Nord@51.305,7.245', 'AS Wuppertal-Ronsdorf@51.22,7.21'],
        'A43': ['*Kreuz Wuppertal-Nord@51.305,7.245'],
        'A46': ['AS Wuppertal-Elberfeld@51.25,7.13', '*Kreuz Wuppertal-Nord@51.305,7.245'],
        'ort': 'AS Wuppertal-Elberfeld',
    },
    'Hagen': {
        'A1': ['*Westhofener Kreuz@51.425,7.515', '*Kreuz Hagen@51.389,7.476', 'AS Hagen-West@51.35,7.43'],
        'A45': ['*Westhofener Kreuz@51.425,7.515', 'AS Hagen-Süd@51.33,7.49'],
        'A46O': ['*Kreuz Hagen@51.389,7.476'],
        'ort': 'AS Hagen-West',
    },
    'Hannover': {
        'A2': ['AS Hannover-Herrenhausen@52.43,9.67', '*Kreuz Hannover-Ost@52.42,9.89'],
        'A7': ['*Kreuz Hannover-Ost@52.42,9.89', 'AS Hannover-Anderten@52.37,9.85'],
        'B3N': ['*Kreuz Hannover-Ost@52.42,9.89'],
        'B217': ['AS Hannover-Herrenhausen@52.43,9.67'],
        'ort': 'AS Hannover-Herrenhausen',
    },
    'Bremen': {
        'A1': ['*Bremer Kreuz@53.06,8.98', 'AS Bremen-Arsten@53.03,8.85', '*Dreieck Stuhr@53.025,8.76'],
        'A27': ['AS Bremen-Vahr@53.08,8.88', '*Bremer Kreuz@53.06,8.98'],
        'A28': ['*Dreieck Stuhr@53.025,8.76'],
        'ort': 'AS Bremen-Vahr',
    },
    'Nürnberg': {
        # die A73 läuft als Frankenschnellweg durch die Stadt, A3 und A9 außen herum
        'A3': ['AS Nürnberg-Nord@49.51,11.10', '*Kreuz Nürnberg@49.525,11.20'],
        'A9': ['*Kreuz Nürnberg@49.525,11.20'],
    },
    'Dresden': {
        'A4': ['*Dreieck Dresden-West@51.065,13.615', 'AS Dresden-Neustadt@51.10,13.705', '*Dreieck Dresden-Nord@51.13,13.745'],
        'A13': ['*Dreieck Dresden-Nord@51.13,13.745'],
        'D8': ['*Dreieck Dresden-West@51.065,13.615', 'AS Dresden-Südvorstadt@51.02,13.72'],
        'B170': ['AS Dresden-Südvorstadt@51.02,13.72'],
        'ort': 'AS Dresden-Südvorstadt',
    },
    'Braunschweig': {
        'A2': ['AS Braunschweig-Nord@52.31,10.53'],
        'A39S': ['*Kreuz Braunschweig-Süd@52.225,10.555'],
        'A36': ['*Kreuz Braunschweig-Süd@52.225,10.555'],
        'B4': ['AS Braunschweig-Nord@52.31,10.53'],
        'ort': 'AS Braunschweig-Nord',
    },
    'Kassel': {
        'A7': ['AS Kassel-Nord@51.34,9.55', '*Dreieck Kassel-Süd@51.285,9.53'],
        'A44': ['*Kreuz Kassel-West@51.295,9.385', '*Dreieck Kassel-Süd@51.285,9.53'],
        'A44O': ['*Dreieck Kassel-Süd@51.285,9.53'],
        'A49': ['*Kreuz Kassel-West@51.295,9.385'],
        'ort': 'AS Kassel-Nord',
    },
    'Osnabrück': {
        'A1': ['*Dreieck Osnabrück-Nord@52.33,8.04', '*Lotter Kreuz@52.245,7.93'],
        'A30': ['*Lotter Kreuz@52.245,7.93', '*Kreuz Osnabrück-Süd@52.235,8.10'],
        'A33': ['*Dreieck Osnabrück-Nord@52.33,8.04', 'AS Osnabrück-Schinkel@52.285,8.09', '*Kreuz Osnabrück-Süd@52.235,8.10'],
        'ort': 'AS Osnabrück-Schinkel',
    },
    'Münster': {
        'A1': ['AS Münster-Nord@52.02,7.67', '*Kreuz Münster-Süd@51.905,7.665'],
        'A43': ['*Kreuz Münster-Süd@51.905,7.665'],
        'ort': 'AS Münster-Nord',
    },
    'Karlsruhe': {
        # die A65 kommt über den Rhein in die Stadt, die A5 läuft östlich vorbei
        'A5': ['AS Karlsruhe-Durlach@49.0,8.47', '*Dreieck Karlsruhe@48.98,8.43'],
        'A8': ['*Dreieck Karlsruhe@48.98,8.43'],
    },
    'Magdeburg': {
        'A2': ['*Kreuz Magdeburg@52.205,11.555'],
        'A14': ['*Kreuz Magdeburg@52.205,11.555', 'AS Magdeburg-Sudenburg@52.10,11.58'],
        'ort': 'AS Magdeburg-Sudenburg',
    },
    'Erfurt': {
        'A4': ['*Erfurter Kreuz@50.925,10.93', 'AS Erfurt-Ost@50.94,11.09'],
        'A71': ['AS Erfurt-Bindersleben@50.98,10.96', '*Erfurter Kreuz@50.925,10.93'],
        'ort': 'AS Erfurt-Bindersleben',
    },
    'Chemnitz': {
        'A4': ['*Kreuz Chemnitz@50.875,12.835', 'AS Chemnitz-Nord@50.87,12.92'],
        'A72': ['*Kreuz Chemnitz@50.875,12.835'],
        'ort': 'AS Chemnitz-Nord',
    },
    'Bielefeld': {
        'A2': ['*Kreuz Bielefeld@51.99,8.62', 'AS Bielefeld-Ost@52.035,8.625'],
        'A33': ['AS Bielefeld-Zentrum@52.0,8.55', '*Kreuz Bielefeld@51.99,8.62'],
        'ort': 'AS Bielefeld-Zentrum',
    },
    'Aachen': {
        'A4W': ['*Aachener Kreuz@50.825,6.155'],
        'A44W': ['*Aachener Kreuz@50.825,6.155'],
        'E40': ['*Aachener Kreuz@50.825,6.155', 'AS Aachen-Brand@50.75,6.17'],
        'ort': 'AS Aachen-Brand',
    },
    'Stuttgart': {
        'A8': ['AS Stuttgart-Degerloch@48.72,9.18'],
        'ort': 'AS Stuttgart-Degerloch',
    },
}


def hav(a, b, c, d):
    r = math.radians
    h = math.sin(r(c - a) / 2) ** 2 + math.cos(r(a)) * math.cos(r(c)) * math.sin(r(d - b) / 2) ** 2
    return 2 * 6371 * math.asin(math.sqrt(h))


def punkt(netz, ref, cc):
    """Knotenkennung zu einem Punkt der Liste; legt neue Knoten an."""
    N = netz['nodes']
    if '@' not in ref:
        if ref not in N:
            raise KeyError(f'Knoten {ref!r} fehlt')
        return ref
    name, ll = ref.split('@')
    lat, lon = (float(v) for v in ll.split(','))
    kind = 'kreuz' if name.startswith('*') else 'as' if name.startswith('AS ') else 'via'
    name = name.lstrip('*')
    if name in N:
        n = N[name]
        if hav(n.get('grob', n)['lat'], n.get('grob', n)['lon'], lat, lon) > 0.5 and hav(n['lat'], n['lon'], lat, lon) > 0.5:
            raise ValueError(f'{name}: zwei verschiedene Lagen')
        return name
    # Anschlussstellen tragen wie alle anderen die Kennung „AS …“, heißen aber nur nach dem Ort (Schild: „Ausfahrt …“)
    N[name] = {'name': name[3:] if kind == 'as' else name, 'lat': lat, 'lon': lon, 'kind': kind, 'cc': cc, 'pop': 0, 'places': []}
    return name


def kante_alt(netz, road, a, b):
    for e in netz['edges']:
        if e['road'] == road and ((e['a'], e['b']) == (a, b) or (e['a'], e['b']) == (b, a)):
            return e
    return None


def umbauen(netz, stadt, spec):
    N = netz['nodes']
    roads = netz['roads']
    ort = N[stadt]
    neue_roads = []
    betroffen = set()
    for r in roads:
        if stadt not in r['nodes'] or r['id'] not in spec or r['kind'] in ('flug', 'faehre', 'zug'):
            continue
        betroffen.add(r['id'])
        k = r['nodes'].index(stadt)
        repl = spec[r['id']]
        teil1, teil2 = r['nodes'][:k], r['nodes'][k + 1:]
        if '|' in repl:
            i = repl.index('|')
            vor = [punkt(netz, p, r['cc']) for p in repl[:i]]
            nach = [punkt(netz, p, r['cc']) for p in repl[i + 1:]]
            r['nodes'] = teil1 + vor
            neu = dict(r, id=r['id'] + 'S', nodes=nach + teil2)
            neue_roads.append(neu)
            betroffen.add(neu['id'])
        else:
            r['nodes'] = teil1 + [punkt(netz, p, r['cc']) for p in repl] + teil2
    roads.extend(neue_roads)
    # Überfahrten (Luftfracht, Fähren) ab dem Ort: an ihren neuen Knoten
    if 'flug' in spec:
        for r in roads:
            if r['kind'] in ('flug', 'faehre', 'zug') and stadt in r['nodes']:
                r['nodes'] = [spec['flug'] if x == stadt else x for x in r['nodes']]
                betroffen.add(r['id'])
    # Knoten zwischen zwei vorhandenen einfügen
    for rid, nach, pts in spec.get('ins', []):
        r = next(q for q in roads if q['id'] == rid)
        k = r['nodes'].index(nach)
        r['nodes'] = r['nodes'][:k + 1] + [punkt(netz, p, r['cc']) for p in pts] + r['nodes'][k + 1:]
        betroffen.add(rid)
    for q in spec.get('neu', []):
        r = dict(q, nodes=[punkt(netz, p, q['cc']) for p in q['nodes']])
        roads.append(r)
        betroffen.add(r['id'])
    # Knoten an ihrer Handlage (knoten.py: Natural Earth kennt die Straße dort nicht)
    for nid in spec.get('hand', []):
        N[nid]['hand'] = True
    # Etappen der betroffenen Straßen neu, an der Stelle der alten: vorhandene Paare bleiben (mit ihren Zwischenpunkten),
    # neue bekommen die Zwischenpunkte der alten Etappe zwischen dem Ort und einem ihrer Enden
    basis = {r['id']: r['id'] for r in roads if r['id'] in betroffen}
    for r in neue_roads:
        basis[r['id']] = r['id'][:-1]
    alte = [e for e in netz['edges'] if e['road'] in betroffen]
    neu_edges = {}
    for r in roads:
        if r['id'] not in betroffen:
            continue
        b0 = basis[r['id']]
        liste = neu_edges.setdefault(b0, [])
        for a, b in zip(r['nodes'], r['nodes'][1:]):
            e = next((x for x in alte if x['road'] == b0 and {x['a'], x['b']} == {a, b}), None)
            if e:
                e = dict(e, road=r['id'])
                if (e['a'], e['b']) != (a, b):
                    e = dict(e, a=a, b=b, pts=list(reversed(e['pts'])))
            else:
                pts = []
                for x in alte:
                    if x['road'] != b0 or stadt not in (x['a'], x['b']):
                        continue
                    other = x['b'] if x['a'] == stadt else x['a']
                    if other in (a, b):
                        P = x['pts'] if x['a'] == other else list(reversed(x['pts']))
                        pts = P if other == a else list(reversed(P))
                A, B = N[a], N[b]
                km = round(hav(A['lat'], A['lon'], B['lat'], B['lon']) * 1.15, 1)
                e = {'a': a, 'b': b, 'road': r['id'], 'km': km, 'pts': pts, 'form': '', 'status': 0}
            liste.append(e)
    out = []
    for e in netz['edges']:
        if e['road'] in betroffen:
            out.extend(neu_edges.pop(e['road'], []))
        else:
            out.append(e)
    for rest in neu_edges.values():  # neue Straßen: ans Ende
        out.extend(rest)
    netz['edges'] = out
    # der Ort: an seine Anschlussstelle; ohne Straße im Ort verschwindet sein Knoten
    noch = any(stadt in r['nodes'] for r in roads)
    if 'ort' not in spec:
        if not noch:
            raise ValueError(f'{stadt}: keine Straße mehr im Ort, aber kein „ort“')
        return
    ziel = N[spec['ort']]
    for p, d in ort.get('grob', ort)['places']:
        P = netz['places'][p]
        z = round(max(d, hav(ziel['lat'], ziel['lon'], P['lat'], P['lon']) * 1.2), 1)
        ziel['places'].append([p, z])
    if noch:
        ort['places'] = []
        ort['kind'] = 'via'
    else:
        del N[stadt]


def main():
    pfad = sys.argv[1]
    with open(pfad, encoding='utf-8') as f:
        netz = json.load(f)
    for stadt, spec in STAEDTE.items():
        umbauen(netz, stadt, spec)
    # Reihenfolge wie verlauf.py schreibt
    P, N = netz['places'], netz['nodes']
    with open(pfad, 'w', encoding='utf-8') as f:
        d = lambda v: json.dumps(v, ensure_ascii=False)  # noqa: E731
        f.write('{\n"places": {\n' + ',\n'.join(d(k) + ': ' + d(v) for k, v in P.items()) + '\n},\n')
        f.write('"nodes": {\n' + ',\n'.join(d(k) + ': ' + d(v) for k, v in N.items()) + '\n},\n')
        f.write('"roads": [\n' + ',\n'.join(d(v) for v in netz['roads']) + '\n],\n')
        if 'ladeparks' in netz:  # zusätzliche Ladeparks (tools/map/ladeparks.mjs) bleiben
            f.write('"ladeparks": ' + d(netz['ladeparks']) + ',\n')
        f.write('"edges": [\n' + ',\n'.join(d(v) for v in netz['edges']) + '\n]\n}\n')


if __name__ == '__main__':
    main()
