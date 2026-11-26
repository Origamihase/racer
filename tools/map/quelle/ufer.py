# Uferstraßen: Landstraßen, die in Wahrheit an einem Ufer eines Flusses bleiben, wo Natural Earth sie nicht kennt
# (B9 und B42 im Mittelrheintal, B42 im Rheingau, B34 am Hochrhein). Ihr Ersatzverlauf (verlauf.py) liegt sonst mal links, mal rechts
# des Flusses, und die Karte zeigt Brücken, die es nicht gibt (COMMON.md §9: jede Brücke der Karte steht in der
# Welt). Hier folgt die Etappe dem Fluss im Abstand ABSTAND_KM auf ihrem Ufer; die Orte am Ufer (deren Koordinaten
# auf zwei Stellen gerundet oft im Fluss liegen) rücken mit ihrem Knoten auf dieselbe Linie.
#
# Ufer wie in der Geographie: links und rechts in Fließrichtung (Natural Earth zeichnet Flüsse von der Quelle zur
# Mündung). Der Fluss kommt aus ne/ne_10m_rivers_lake_centerlines.geojson und ne/ne_10m_rivers_europe.geojson im
# Datenordner (dieselben Linien wie tools/map/wasser.mjs).
import json
import math
import os

import form
import geo

ABSTAND_KM = 0.4  # so weit neben der Mittellinie des Flusses läuft die Uferstraße
SCHRITT_KM = 0.1
GLATT_KM = 0.25  # Gauß-σ der Uferlinie (der Fluss ist ein Polygonzug mit Ecken)
ANLAUF_KM = 0.6  # so weit vom Knoten beginnt das Stück am Ufer, wenn der Knoten selbst nicht am Ufer liegt

# Fluss, Ufer, Etappen (Knoten a, b in beliebiger Reihenfolge) und die Orte am Ufer, die mitrücken
UFERSTRASSEN = [
    {'fluss': ('Rhine', 'Rhein'), 'ufer': 'links',
     'etappen': [('Koblenz', 'Bad Salzig'), ('Bad Salzig', 'St. Goar'), ('St. Goar', 'Bacharach'), ('Bacharach', 'Bingen am Rhein')],
     'orte': ['Bad Salzig', 'St. Goar', 'Bacharach']},
    {'fluss': ('Rhine', 'Rhein'), 'ufer': 'rechts',
     'etappen': [('Lahnstein', 'St. Goarshausen'), ('St. Goarshausen', 'Rüdesheim'), ('Rüdesheim', 'Eltville am Rhein'),
                 ('Eltville am Rhein', 'Wiesbaden')],
     'orte': ['St. Goarshausen', 'Rüdesheim', 'Eltville am Rhein']},
    # Hochrhein: die B34 bleibt auf der deutschen Seite, Schaffhausen liegt am Nordufer (die Aare mündet von Süden)
    {'fluss': ('Rhin', 'Rhine', 'Rhein'), 'ufer': 'rechts', 'etappen': [('Lörrach', 'Schaffhausen')], 'orte': []},
]


def flusslinien(daten, namen):
    """Alle Linien des Flusses als [(lat, lon), …] in Fließrichtung."""
    out = []
    for datei in ('ne_10m_rivers_lake_centerlines', 'ne_10m_rivers_europe'):
        pfad = os.path.join(daten, 'ne', datei + '.geojson')
        with open(pfad, encoding='utf-8') as f:
            j = json.load(f)
        for ft in j['features']:
            p = ft['properties']
            g = ft['geometry']
            if not g or p.get('featurecla') == 'Lake Centerline':
                continue
            if p.get('name') not in namen and p.get('name_de') not in namen:
                continue
            linien = [g['coordinates']] if g['type'] == 'LineString' else g['coordinates'] if g['type'] == 'MultiLineString' else []
            for L in linien:
                out.append([(la, lo) for lo, la in L])
    return out


def _glatt(xy, sigma, schritt):
    n = len(xy)
    k = max(1, int(3 * sigma / schritt))
    w = [math.exp(-0.5 * (j * schritt / sigma) ** 2) for j in range(-k, k + 1)]
    out = []
    for i in range(n):
        sx = sy = sw = 0.0
        for j, wj in zip(range(-k, k + 1), w):
            q = xy[min(max(i + j, 0), n - 1)]
            sx += q[0] * wj
            sy += q[1] * wj
            sw += wj
        out.append((sx / sw, sy / sw))
    return out


class Ufer:
    """Die Uferlinie eines Flusses auf einer Seite, als Polylinie in Fließrichtung (Bogenlänge wie die des Flusses)."""

    def __init__(self, linie, seite):
        e = geo.Eben(*linie[len(linie) // 2])
        self.e = e
        fein = form.verdichten(linie, SCHRITT_KM)
        xy = _glatt([e.xy(*p) for p in fein], GLATT_KM, SCHRITT_KM)
        self.fluss = [e.ll(*q) for q in xy]
        sg = 1.0 if seite == 'links' else -1.0
        ufer = []
        for i in range(len(xy)):
            a = xy[max(0, i - 3)]
            b = xy[min(len(xy) - 1, i + 3)]
            tx, ty = b[0] - a[0], b[1] - a[1]
            l = math.hypot(tx, ty) or 1.0
            # links in Fließrichtung: (−ty, tx)
            ufer.append((xy[i][0] - ty / l * ABSTAND_KM * sg, xy[i][1] + tx / l * ABSTAND_KM * sg))
        # Innenbögen enger als der Abstand falten die Linie: glätten und jeden Punkt auf den Abstand zurückschieben
        ufer = _glatt(ufer, GLATT_KM, SCHRITT_KM)
        self.pts = [e.ll(*q) for q in ufer]
        self.s = form.kum(self.pts)
        self.sf = form.kum(self.fluss)

    def lot(self, lat, lon):
        """(Bogenlänge auf dem Fluss, Abstand km) des Punkts."""
        s, d, _ = form.lot(self.fluss, lat, lon, self.sf)
        return s, d

    def bei(self, s_fluss):
        """Punkt der Uferlinie neben der Stelle s_fluss des Flusses."""
        i = min(range(len(self.sf)), key=lambda k: abs(self.sf[k] - s_fluss))
        return self.pts[i]

    def stueck(self, s0, s1):
        """Uferlinie neben dem Fluss von s0 bis s1 (in dieser Richtung, auch flussauf)."""
        lo, hi = min(s0, s1), max(s0, s1)
        out = [p for p, sf in zip(self.pts, self.sf) if lo <= sf <= hi]
        return out if s0 <= s1 else out[::-1]


def legen(netz, daten, lage, formen, log):
    """Knoten der Orte am Ufer verlegen und die Etappen am Ufer entlang führen. lage: Knoten → (lat, lon) (wird
    ergänzt); formen: Kante → {'pts', …} (wird ersetzt). Gibt die Kanten zurück, die jetzt Uferstraßen sind."""
    N = netz['nodes']
    P = netz['places']
    pos = lambda nid: lage.get(nid, (N[nid]['lat0'], N[nid]['lon0']))  # noqa: E731
    kanten = {}
    for i, e in enumerate(netz['edges']):
        kanten[(e['a'], e['b'])] = i
        kanten[(e['b'], e['a'])] = i
    strassen = {r['id'] for r in netz['roads'] if r['kind'] in ('ab', 'land')}
    neu = set()
    for U in UFERSTRASSEN:
        knoten_ids = {k for et in U['etappen'] for k in et}
        linien = flusslinien(daten, U['fluss'])
        # die Linie des Flusses, an der alle Knoten der Etappen am nächsten liegen
        def summe(L):
            s = form.kum(L)
            return sum(form.lot(L, *pos(k), s)[1] for k in knoten_ids)
        linie = min(linien, key=summe)
        u = Ufer(linie, U['ufer'])
        for ort in U['orte']:
            # nur Knoten, an denen keine andere Straße hängt (Fähren werden erst danach gelegt)
            fremd = [e for e in netz['edges'] if ort in (e['a'], e['b']) and (e['a'], e['b']) not in U['etappen']
                     and (e['b'], e['a']) not in U['etappen'] and e['road'] in strassen]
            if fremd:
                log(f'  Ufer {U["fluss"][-1]}: {ort} bleibt (auch an {fremd[0]["road"]})')
                continue
            s, d = u.lot(*pos(ort))
            lat, lon = u.bei(s)
            lat, lon = round(lat, 4), round(lon, 4)  # Knoten stehen auf 1e-4° (export.mjs)
            log(f'  Ufer {U["fluss"][-1]} {U["ufer"]}: {ort} rückt {geo.hav(*pos(ort), lat, lon):.2f} km ans Ufer '
                f'(lag {d:.2f} km neben der Mitte des Flusses)')
            # der Ort selbst lag falsch (auf zwei Stellen gerundet im Fluss): Ort, Knoten und Handstand rücken
            # zusammen, der Knoten bleibt am Ort (shape-test)
            lage[ort] = (lat, lon)
            N[ort]['lat0'], N[ort]['lon0'] = lat, lon
            for p, dist in N[ort]['places0']:
                if dist < 0.05:
                    P[p]['lat'], P[p]['lon'] = lat, lon
        for a, b in U['etappen']:
            i = kanten[(a, b)]
            e = netz['edges'][i]
            A, B = pos(e['a']), pos(e['b'])
            sA, dA = u.lot(*A)
            sB, dB = u.lot(*B)
            # liegt ein Knoten nicht am Ufer (Koblenz, Wiesbaden), beginnt das Stück am Ufer ANLAUF_KM neben ihm
            r = 1.0 if sB >= sA else -1.0
            s0 = sA if dA < ABSTAND_KM * 1.5 else sA + r * ANLAUF_KM
            s1 = sB if dB < ABSTAND_KM * 1.5 else sB - r * ANLAUF_KM
            mitte = u.stueck(s0, s1)
            pts = [A] + [p for p in mitte if geo.hav(*p, *A) > 0.15 and geo.hav(*p, *B) > 0.15] + [B]
            pts = form.verdichten(pts, SCHRITT_KM)
            f = formen.setdefault(i, {})
            f.update({'herkunft': 'ersatz', 'grund': f'Uferstraße am {U["ufer"][:-1]}en Ufer: {U["fluss"][-1]}', 'pts': pts,
                      'ersatz': True, 'ufer': U['fluss'][-1]})
            neu.add(i)
            log(f'  Kante {i} {e["road"]} {e["a"]} → {e["b"]}: Uferstraße {form.kum(pts)[-1]:.1f} km am {U["ufer"][:-1]}en Ufer')
    return neu
