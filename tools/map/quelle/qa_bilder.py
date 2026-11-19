# Prüfbilder der Straßenverläufe: Regionen, berühmte Strecken (mit Schummerung) und ihre Höhenprofile.
#
#   python3 -I tools/map/quelle/qa_bilder.py --daten <Ordner> --arbeit <Ordner> --ziel <Ordner> [Name …]
#
# Gezeichnet wird, was das Spiel bekommt: src/map/data.js und src/map/shapes.js (mit node dekodiert), dazu die
# Natural-Earth-Straßen in Hellgrau, Land und Grenzen. --daten wie bei verlauf.py; --arbeit nimmt den Zwischenspeicher
# der Natural-Earth-Linien auf. Ohne Namen entstehen alle Bilder.
import argparse
import json
import math
import os
import pickle
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import geo  # noqa: E402
import hoehen  # noqa: E402
import qa_karte  # noqa: E402
from qa_karte import Karte, schrift  # noqa: E402

HIER = os.path.dirname(os.path.abspath(__file__))
WURZEL = os.path.normpath(os.path.join(HIER, '..', '..', '..'))
KINDS = ['ab', 'land', 'faehre', 'zug', 'flug']
NODE_KINDS = ['ort', 'as', 'kreuz', 'via']

STATUS_FARBE = {2: (28, 100, 210), 1: (232, 132, 10), 0: (212, 30, 70)}
STATUS_NAME = {2: 'abgeglichen (Natural Earth)', 1: 'teilweise abgeglichen', 0: 'Ersatzverlauf'}
FAEHRE_FARBE = (0, 150, 160)
ZUG_FARBE = (140, 80, 180)
NE_FARBE = {'Major Highway': (168, 168, 176), 'Beltway': (176, 176, 184), 'Bypass': (176, 176, 184),
            'Secondary Highway': (192, 192, 198), 'Road': (206, 206, 210), 'Unknown': (206, 206, 210)}

# Regionen: (Titel, Breite von/bis, Länge von/bis, Bildbreite)
REGIONEN = {
    'deutschland': ('Deutschland', 47.15, 55.15, 5.6, 15.3, 1800),
    'benelux': ('Benelux', 49.35, 53.65, 2.3, 7.4, 1600),
    'alpen': ('Alpen', 45.25, 48.45, 5.6, 16.8, 1900),
    'skandinavien': ('Skandinavien', 54.3, 68.4, 4.4, 30.2, 1700),
    'italien': ('Italien und Malta', 35.7, 47.2, 6.4, 18.9, 1500),
    'iberien': ('Iberische Halbinsel', 35.8, 44.2, -10.2, 4.2, 1700),
    'frankreich': ('Frankreich', 42.2, 51.3, -2.2, 8.6, 1700),
    'usa': ('USA', 24.2, 50.2, -125.5, -66.5, 2000),
    'japan': ('Japan (Tōmei)', 33.9, 36.3, 134.7, 140.5, 1700),
    'osteuropa': ('Polen, Tschechien, Ostalpen', 45.4, 54.9, 12.2, 25.8, 1700),
    'grossbritannien': ('Großbritannien und Irland', 50.6, 56.8, -7.0, 2.0, 1300),
}

# Berühmte Strecken: (Titel, Straße, erster Knoten, letzter Knoten, Hochpunkte [(Name, lat, lon)])
# Benannte Punkte der Profile (Name, Breite, Länge): Hochpunkte, Pässe, Täler, Tunnel – nur, wo sie sicher bekannt
# sind; der höchste Punkt des Profils wird immer markiert.
STRECKEN = {
    'a7_kasseler_berge': ('A7 Kassel – Göttingen (Kasseler Berge)', 'A7', 'Kassel', 'Seesen',
                          [('Kasseler Berge', 51.37, 9.66), ('Werratal', 51.403, 9.714),
                           ('Leinetal bei Göttingen', 51.55, 9.879)]),
    'a3_frankfurt_koeln': ('A3 Frankfurt – Köln', 'A3', 'Frankfurter Kreuz', 'Köln',
                           [('Westerwald', 50.48, 7.74), ('Taunuskamm bei Niedernhausen', 50.168, 8.295)]),
    'a8_muenchen_salzburg': ('A8 München – Salzburg (Irschenberg)', 'A8', 'München', 'Salzburg',
                             [('Irschenberg', 47.836, 11.905), ('Inntal bei Rosenheim', 47.84, 12.14)]),
    'a45_sauerlandlinie': ('A45 Sauerlandlinie', 'A45', 'Dortmund', 'Seligenstädter Dreieck',
                           [('Kalteiche bei Wilnsdorf', 50.796, 8.120)]),
    'a1_hamburg_bremen': ('A1 Hamburg – Bremen', 'A1', 'Hamburg', 'Bremen', []),
    'brenner': ('Brenner: A13/A22 Innsbruck – Brixen', 'A22', 'Innsbruck', 'Brixen',
                [('Brennerpass', 47.0024, 11.5053)]),
    'gotthard': ('Gotthard: A2 Härkingen – Bellinzona', 'A2CH', 'Verzweigung Härkingen', 'Bellinzona',
                 [('Gotthard-Straßentunnel', 46.597, 8.600)]),
}
KREUZE = {
    'frankfurter_kreuz': ('Frankfurter Kreuz', 'Frankfurter Kreuz', 16.0),
}


# --- Daten ------------------------------------------------------------------------------------------------
def spieldaten():
    """data.js und shapes.js so, wie das Spiel sie sieht (über node geladen und dekodiert)."""
    code = (
        f"import {{ PLACES, NODES, ROADS, EDGES }} from 'file://{WURZEL}/src/map/data.js';\n"
        f"import {{ edgeShape, shapeCount }} from 'file://{WURZEL}/src/map/shapes.js';\n"
        "const S = [];\n"
        "for (let i = 0; i < shapeCount; i++) { const s = edgeShape(i); S.push([Array.from(s.lat), Array.from(s.lon), Array.from(s.elev), s.matched]); }\n"
        "process.stdout.write(JSON.stringify({ PLACES, NODES, ROADS, EDGES, S }));\n"
    )
    out = subprocess.run(['node', '--input-type=module', '-e', code], capture_output=True, check=True)
    d = json.loads(out.stdout)
    places = [dict(zip(('key', 'name', 'lat', 'lon', 'cc', 'n', 'pop'), p)) for p in d['PLACES']]
    nodes = []
    for i, (nid, name, lat, lon, kind, cc, pop, pl) in enumerate(d['NODES']):
        nodes.append({'i': i, 'id': nid, 'name': name, 'lat': lat, 'lon': lon, 'kind': NODE_KINDS[kind], 'cc': cc, 'pop': pop, 'places': pl})
    roads = [{'i': i, 'id': r[0], 'label': r[1], 'kind': KINDS[r[2]], 'cc': r[3], 'nodes': r[4]} for i, r in enumerate(d['ROADS'])]
    edges = []
    for i, (a, b, r, km, pts, tA, tB) in enumerate(d['EDGES']):
        la, lo, el, m = d['S'][i]
        edges.append({'i': i, 'a': a, 'b': b, 'road': r, 'kind': roads[r]['kind'], 'km': km, 'grob': pts,
                      'pts': list(zip(la, lo)), 'elev': el, 'status': m})
    return {'places': places, 'nodes': nodes, 'roads': roads, 'edges': edges}


def ne_linien(daten, arbeit):
    """Natural-Earth-Straßen als [(Typ, [(lat, lon), …])], zwischengespeichert in --arbeit."""
    quelle = os.path.join(daten, 'ne', 'ne_10m_roads.geojson')
    pfad = os.path.join(arbeit, 'qa_ne_linien.pkl')
    stempel = os.path.getmtime(quelle)
    if os.path.exists(pfad):
        with open(pfad, 'rb') as f:
            st, linien = pickle.load(f)
        if st == stempel:
            return linien
    with open(quelle, encoding='utf-8') as f:
        d = json.load(f)
    linien = []
    for ft in d['features']:
        g = ft.get('geometry')
        typ = (ft.get('properties') or {}).get('type')
        if not g or not isinstance(typ, str):
            continue
        ls = g['coordinates'] if g['type'] == 'MultiLineString' else [g['coordinates']]
        for L in ls:
            pts = [(float(c[1]), float(c[0])) for c in L if len(c) >= 2]
            if len(pts) >= 2:
                linien.append((typ, pts))
    with open(pfad, 'wb') as f:
        pickle.dump((stempel, linien), f)
    return linien


class Kacheln:
    """Höhen aus den zwischengespeicherten Terrain-Kacheln (nichts wird geladen; fehlende Kacheln = NaN)."""

    def __init__(self, ordner):
        self.ordner = ordner
        self.cache = {}

    def _kachel(self, z, x, y):
        k = (z, x, y)
        if k not in self.cache:
            p = os.path.join(self.ordner, str(z), str(x), f'{y}.png')
            if os.path.exists(p):
                with Image.open(p) as im:
                    a = np.asarray(im.convert('RGB'), dtype=np.float64)
                self.cache[k] = a[:, :, 0] * 256.0 + a[:, :, 1] + a[:, :, 2] / 256.0 - 32768.0
            else:
                self.cache[k] = None
        return self.cache[k]

    def feld(self, lat, lon, z):
        """Höhen (bilinear) für numpy-Felder lat, lon bei Zoom z."""
        n = 256 * 2 ** z
        x = (lon + 180.0) / 360.0 * n - 0.5
        phi = np.radians(np.clip(lat, -85, 85))
        y = (1.0 - np.arcsinh(np.tan(phi)) / math.pi) / 2.0 * n - 0.5
        x0 = np.floor(x).astype(np.int64)
        y0 = np.floor(y).astype(np.int64)
        fx = x - x0
        fy = y - y0
        out = np.full(lat.shape, np.nan)
        werte = {}
        for dx in (0, 1):
            for dy in (0, 1):
                gx = (x0 + dx) % n
                gy = np.clip(y0 + dy, 0, n - 1)
                v = np.full(lat.shape, np.nan)
                tx, ty = gx // 256, gy // 256
                for (a, b) in set(zip(tx.ravel().tolist(), ty.ravel().tolist())):
                    t = self._kachel(z, a, b)
                    if t is None:
                        continue
                    m = (tx == a) & (ty == b)
                    v[m] = t[gy[m] % 256, gx[m] % 256]
                werte[(dx, dy)] = v
        out = (werte[(0, 0)] * (1 - fx) + werte[(1, 0)] * fx) * (1 - fy) + (werte[(0, 1)] * (1 - fx) + werte[(1, 1)] * fx) * fy
        return out

    def hoehe(self, lat, lon):
        lat = np.asarray(lat, dtype=np.float64)
        lon = np.asarray(lon, dtype=np.float64)
        alpen = hoehen.in_alpen(lat, lon)
        out = self.feld(lat, lon, 8)
        if alpen.any():
            z9 = self.feld(lat, lon, 9)
            w = (alpen & np.isfinite(z9)).astype(np.float64)
            if lat.ndim == 2 and 0 < w.mean() < 1:
                # Zoom-9-Kacheln gibt es nur entlang der Straßen: weich überblenden, sonst zeichnet die Schummerung
                # an jedem Kachelrand eine Stufe
                w = np.minimum(w, qa_karte._weich(w, max(2.0, 0.012 * max(lat.shape))))
            out = np.where(w > 0, w * np.nan_to_num(z9) + (1 - w) * out, out)
        return out

    @staticmethod
    def zelle_km(lat, lon):
        """Pixelgröße des Höhenmodells (km) an dieser Stelle."""
        z = 9 if hoehen.in_alpen(lat, lon) else 8
        return 40075.0 * math.cos(math.radians(lat)) / (256 * 2 ** z)


# --- Gemeinsames ------------------------------------------------------------------------------------------
def mitte(K):
    return K.ll(K.w * K.ss / 2, K.h * K.ss / 2)


def grundkarte(K, atlas, ne, mit_ne=True):
    K.land(atlas['land'])
    if mit_ne:
        ordnung = ['Road', 'Unknown', 'Secondary Highway', 'Bypass', 'Beltway', 'Major Highway']
        for typ in ordnung:
            farbe = NE_FARBE[typ]
            b = 1.4 if typ == 'Major Highway' else 1.0
            for t, pts in ne:
                if t == typ and K.sichtbar(pts, 0.3):
                    K.linie(pts, farbe, b, rund=False)
    K.grenzen(atlas['grenzen'])


def etappe_zeichnen(K, e, breite_ab=2.4, breite_land=1.7, hervor=False):
    if e['kind'] in ('ab', 'land'):
        farbe = STATUS_FARBE[e['status']]
        b = breite_ab if e['kind'] == 'ab' else breite_land
        if hervor:
            K.linie(e['pts'], (255, 255, 255), b + 2.4)
        if e['status'] == 0:
            K.linie(e['pts'], tuple(int(c * 0.35 + 255 * 0.65) for c in farbe), b)
            K.strichlinie(e['pts'], farbe, b, 7, 3)
        else:
            K.linie(e['pts'], farbe, b)
    elif e['kind'] == 'faehre':
        K.strichlinie(e['pts'], FAEHRE_FARBE, 1.8, 7, 4)
    elif e['kind'] == 'zug':
        K.strichlinie(e['pts'], ZUG_FARBE, 1.8, 3, 3)


def statistik_zeile(G, K):
    z = {0: [0, 0.0], 1: [0, 0.0], 2: [0, 0.0]}
    for e in G['edges']:
        if e['kind'] in ('ab', 'land') and any(K.innen(*p) for p in e['pts'][:: max(1, len(e['pts']) // 8)]):
            z[e['status']][0] += 1
            z[e['status']][1] += e['km']
    return (f'Etappen im Bild: {z[2][0]} abgeglichen ({z[2][1]:,.0f} km) · {z[1][0]} teilweise ({z[1][1]:,.0f} km) · '
            f'{z[0][0]} Ersatz ({z[0][1]:,.0f} km)').replace(',', '.')


def legende_status(mit_sonder=True):
    zeilen = [('linie', STATUS_FARBE[2], STATUS_NAME[2]), ('linie', STATUS_FARBE[1], STATUS_NAME[1]),
              ('strich', STATUS_FARBE[0], STATUS_NAME[0] + ' (gestrichelt)')]
    if mit_sonder:
        zeilen += [('strich', FAEHRE_FARBE, 'Fähre'), ('strich', ZUG_FARBE, 'Autozug')]
    zeilen += [('grau', NE_FARBE['Major Highway'], 'Natural-Earth-Straßen'), ('punkt', (255, 255, 255), 'Knoten'),
               ('raute', (60, 60, 70), 'Kreuz / Dreieck'), ('punkt', (40, 40, 50), 'Ort (wahre Lage)')]
    return zeilen


def knoten_zeichnen(K, G, nur=None, r=2.6):
    for n in G['nodes']:
        if nur is not None and n['i'] not in nur:
            continue
        if not K.innen(n['lat'], n['lon']):
            continue
        if n['kind'] == 'kreuz':
            K.raute(n['lat'], n['lon'], r + 1.2, (60, 60, 70))
        else:
            K.punkt(n['lat'], n['lon'], r, (255, 255, 255), (50, 50, 60), 1.0)


def zubringer_zeichnen(K, G):
    """Gestrichelt vom Ort zu seinem Knoten (wo der Zubringer länger als 0,3 km ist)."""
    for n in G['nodes']:
        for p, km in n['places']:
            q = G['places'][p]
            if km > 0.3 and (K.innen(q['lat'], q['lon']) or K.innen(n['lat'], n['lon'])):
                K.strichlinie([(q['lat'], q['lon']), (n['lat'], n['lon'])], (120, 120, 132), 1.2, 4, 3)


def knoten_beschriften(K, G, wichtig, px_wichtig=14, px=12):
    """Knotennamen; ein Knoten, der selbst ein Ort ist, wird am Ort beschriftet (dort steht sein Name), sonst am
    Knoten. wichtig: Knotenindizes, die fett und auf jeden Fall beschriftet werden."""
    for n in G['nodes']:
        w = n['i'] in wichtig
        ort = next((G['places'][p] for p, _ in n['places'] if G['places'][p]['name'] == n['name']), None)
        lat, lon = (ort['lat'], ort['lon']) if ort else (n['lat'], n['lon'])
        if not K.innen(lat, lon) or not K.frei(lat, lon):
            continue
        if ort:
            K.punkt(lat, lon, 3.0, (40, 40, 50), (255, 255, 255), 1.0)
        if n['name'] in K.namen:
            continue
        if K.text(lat, lon, n['name'], px_wichtig if w else px, (15, 15, 30) if w else (60, 60, 80), fett=w, pflicht=w) or w:
            K.namen.add(n['name'])


def orte_beschriften(K, G, anzahl=40, px=13):
    imbild = [p for p in G['places'] if K.innen(p['lat'], p['lon']) and K.frei(p['lat'], p['lon'])]
    imbild.sort(key=lambda p: (-p['pop'], p['name']))
    for p in imbild[:anzahl]:
        K.punkt(p['lat'], p['lon'], 3.0, (40, 40, 50), (255, 255, 255), 1.0)
    for p in imbild[:anzahl]:
        if p['name'] not in K.namen and K.text(p['lat'], p['lon'], p['name'], px, (20, 20, 35), fett=p['pop'] >= 500000):
            K.namen.add(p['name'])


# --- Regionen ---------------------------------------------------------------------------------------------
def region(G, atlas, ne, name, ziel):
    titel, lat0, lat1, lon0, lon1, breite = REGIONEN[name]
    K = Karte(lat0, lat1, lon0, lon1, breite=breite)
    grundkarte(K, atlas, ne)
    for e in G['edges']:
        if e['kind'] in ('faehre', 'zug'):
            etappe_zeichnen(K, e)
    for kind in ('land', 'ab'):
        for st in (2, 1, 0):
            for e in G['edges']:
                if e['kind'] == kind and e['status'] == st:
                    etappe_zeichnen(K, e)
    knoten_zeichnen(K, G)
    K.titel(f'Straßenverläufe: {titel}', [statistik_zeile(G, K), 'Luftfracht nicht gezeichnet; Orte: die 40 größten im Bild'])
    K.kasten(-10, -10, legende_status(), 'Legende')
    K.massstab()
    orte_beschriften(K, G)
    return K.speichern(os.path.join(ziel, f'region_{name}.png'))


# --- Strecken ---------------------------------------------------------------------------------------------
def strecke_kanten(G, road_id, von, bis):
    """Gerichtete Etappen einer Straße zwischen zwei Knoten: [(Kante, umgedreht)]."""
    r = next(r for r in G['roads'] if r['id'] == road_id)
    ns = [G['nodes'][k]['id'] for k in r['nodes']]
    i, j = ns.index(von), ns.index(bis)
    schritt = 1 if j > i else -1
    out = []
    for k in range(i, j, schritt):
        a, b = r['nodes'][k], r['nodes'][k + schritt]
        e = next(e for e in G['edges'] if e['road'] == r['i'] and {e['a'], e['b']} == {a, b})
        out.append((e, e['a'] != a))
    return out


def strecke_punkte(kanten):
    """Durchgehende Punktfolge mit Höhe und Bogenlänge, dazu die Knoten (Bogenlänge, Knotenindex)."""
    pts, el, knoten = [], [], []
    for e, um in kanten:
        p = e['pts'][::-1] if um else e['pts']
        h = e['elev'][::-1] if um else e['elev']
        if not pts:
            knoten.append((0, e['b'] if um else e['a']))
        start = 1 if pts else 0
        pts.extend(p[start:])
        el.extend(h[start:])
        knoten.append((len(pts) - 1, e['a'] if um else e['b']))
    s = [0.0]
    for a, b in zip(pts, pts[1:]):
        s.append(s[-1] + geo.hav(*a, *b))
    return pts, el, s, [(s[i], n) for i, n in knoten]


def lotpunkt(pts, el, s, lat, lon):
    """Bogenlänge und Höhe des Lotfußpunkts von (lat, lon) auf der Punktfolge (auch mitten auf langen geraden
    Stücken wie Tunneln, die nur aus ihren zwei Portalen bestehen)."""
    kx = 111.32 * math.cos(math.radians(lat))
    best = (math.inf, 0.0, 0.0)
    for k in range(len(pts) - 1):
        ax, ay = (pts[k][1] - lon) * kx, (pts[k][0] - lat) * 110.574
        bx, by = (pts[k + 1][1] - lon) * kx, (pts[k + 1][0] - lat) * 110.574
        dx, dy = bx - ax, by - ay
        t = min(1.0, max(0.0, -(ax * dx + ay * dy) / (dx * dx + dy * dy))) if dx or dy else 0.0
        d = math.hypot(ax + t * dx, ay + t * dy)
        if d < best[0]:
            best = (d, s[k] + t * (s[k + 1] - s[k]), el[k] + t * (el[k + 1] - el[k]))
    return best[1], best[2]


def bbox(pts, rand_km):
    la = [p[0] for p in pts]
    lo = [p[1] for p in pts]
    latc = (min(la) + max(la)) / 2
    dl = rand_km / 110.574
    do = rand_km / (111.32 * math.cos(math.radians(latc)))
    return min(la) - dl, max(la) + dl, min(lo) - do, max(lo) + do


def quadratisch(lat0, lat1, lon0, lon1, verh=1.0):
    """Ausschnitt auf ein Seitenverhältnis (Breite/Höhe in km) erweitern."""
    latc = (lat0 + lat1) / 2
    kx = 111.32 * math.cos(math.radians(latc))
    w = (lon1 - lon0) * kx
    h = (lat1 - lat0) * 110.574
    if w / h < verh:
        d = (h * verh - w) / kx / 2
        lon0, lon1 = lon0 - d, lon1 + d
    else:
        d = (w / verh - h) / 110.574 / 2
        lat0, lat1 = lat0 - d, lat1 + d
    return lat0, lat1, lon0, lon1


def km_marken(K, pts, s, alle=10.0):
    if s[-1] < 2 * alle:
        return
    km = alle
    k = 0
    f = schrift(int(10 * K.ss), True)
    while km < s[-1] - alle / 2:
        while s[k + 1] < km:
            k += 1
        t = (km - s[k]) / max(1e-9, s[k + 1] - s[k])
        p = (pts[k][0] + (pts[k + 1][0] - pts[k][0]) * t, pts[k][1] + (pts[k + 1][1] - pts[k][1]) * t)
        x, y = K.xy(*p)
        r = 2.2 * K.ss
        K.dr.ellipse((x - r, y - r, x + r, y + r), fill=(20, 20, 30))
        box = K.dr.textbbox((x + 4 * K.ss, y + 3 * K.ss), f'{km:.0f}', font=f, stroke_width=2 * K.ss)
        K.dr.text((x + 4 * K.ss, y + 3 * K.ss), f'{km:.0f}', font=f, fill=(20, 20, 30), stroke_width=2 * K.ss, stroke_fill=(255, 255, 255))
        K.belegt.append(box)  # Namen weichen den Kilometerzahlen aus
        km += alle


def strecke_karte(G, atlas, ne, kacheln, name, ziel, titel, kanten, hoch=()):
    pts, el, s, knoten = strecke_punkte(kanten)
    lat0, lat1, lon0, lon1 = quadratisch(*bbox(pts, max(6.0, 0.08 * s[-1])), 1.25)
    K = Karte(lat0, lat1, lon0, lon1, breite=1700)
    K.land(atlas['land'])
    maske = np.asarray(K.img.resize((K.w, K.h), Image.NEAREST), dtype=np.int32).sum(axis=2) != sum(qa_karte.WASSER)
    K.schummerung(kacheln.hoehe, maske, zelle_km=kacheln.zelle_km(*mitte(K)))
    for t, p in ne:
        if K.sichtbar(p, 0.2):
            K.linie(p, (150, 150, 158) if t == 'Major Highway' else (176, 176, 182), 1.6 if t == 'Major Highway' else 1.1, rund=False)
    K.grenzen(atlas['grenzen'])
    eigen = {e['i'] for e, _ in kanten}
    for e in G['edges']:
        if e['i'] not in eigen and e['kind'] in ('ab', 'land', 'faehre', 'zug'):
            etappe_zeichnen(K, e, 1.8, 1.4)
    for e, _ in kanten:
        etappe_zeichnen(K, e, 3.6, 3.0, hervor=True)
    km_marken(K, pts, s, 10.0 if s[-1] > 60 else 5.0)
    nur = {n for _, n in knoten}
    zubringer_zeichnen(K, G)
    knoten_zeichnen(K, G, r=3.2)
    for _, hl, ho in hoch:
        K.punkt(hl, ho, 5, (250, 200, 30), (40, 30, 0), 1.5)
    unter = [f'{s[-1]:.1f} km entlang der Strecke · Zahlen: km ab {G["nodes"][knoten[0][1]]["name"]} · '
             'Hintergrund: Schummerung aus den Höhenkacheln']
    K.titel(titel, unter)
    zeilen = legende_status(False)
    if hoch:
        zeilen.append(('punkt', (250, 200, 30), 'benannte Punkte (siehe Profil)'))
    zeilen.append(('strich', (120, 120, 132), 'Zubringer Ort → Knoten'))
    # die Legende kommt in die rechte Ecke (unten oder oben), in der weniger von der Strecke liegt
    def in_ecke(oben):
        n = 0
        for p in pts:
            x, y = (v / K.ss for v in K.xy(*p))
            n += x > K.w - 320 and (y < 280 if oben else y > K.h - 280)
        return n

    K.kasten(-10, 10 if in_ecke(True) < in_ecke(False) else -10, zeilen, 'Legende')
    K.massstab()
    # erst die Knoten der Strecke, dann die benannten Punkte (weichen deren Namen aus), dann die übrigen Orte
    knoten_beschriften(K, G, nur, 14, 12)
    for t, hl, ho in hoch:
        K.text(hl, ho, t, 13, (70, 50, 0), dx=8, dy=8, pflicht=True)
    orte_beschriften(K, G, 25, 12)
    return K.speichern(os.path.join(ziel, f'strecke_{name}.png'))


def kreuz_karte(G, atlas, ne, kacheln, name, ziel, titel, knoten_id, radius):
    nd = next(n for n in G['nodes'] if n['id'] == knoten_id)
    lat0, lat1, lon0, lon1 = quadratisch(*bbox([(nd['lat'], nd['lon'])], radius), 1.25)
    K = Karte(lat0, lat1, lon0, lon1, breite=1600)
    K.land(atlas['land'])
    maske = np.asarray(K.img.resize((K.w, K.h), Image.NEAREST), dtype=np.int32).sum(axis=2) != sum(qa_karte.WASSER)
    K.schummerung(kacheln.hoehe, maske, staerke=0.35, zelle_km=kacheln.zelle_km(*mitte(K)))
    for t, p in ne:
        if K.sichtbar(p, 0.1):
            K.linie(p, (150, 150, 158) if t == 'Major Highway' else (176, 176, 182), 2.0 if t == 'Major Highway' else 1.3, rund=False)
    for e in G['edges']:
        if e['kind'] in ('ab', 'land'):
            etappe_zeichnen(K, e, 3.4, 2.6, hervor=e['a'] == nd['i'] or e['b'] == nd['i'])
    zubringer_zeichnen(K, G)
    knoten_zeichnen(K, G, r=4.0)
    K.titel(titel, ['Alle Etappen am Kreuz hervorgehoben; graue Linien: Natural Earth'])
    K.kasten(-10, -10, legende_status(False) + [('strich', (120, 120, 132), 'Zubringer Ort → Knoten')], 'Legende')
    K.massstab()
    knoten_beschriften(K, G, {nd['i']}, 15, 13)
    orte_beschriften(K, G, 20, 12)
    # Straßennamen an den Etappen
    for e in G['edges']:
        if e['kind'] == 'ab' and (e['a'] == nd['i'] or e['b'] == nd['i']):
            p = e['pts'][len(e['pts']) // 3]
            for q in e['pts']:
                if geo.hav(nd['lat'], nd['lon'], *q) > radius * 0.45:
                    p = q
                    break
            if K.innen(*p):
                K.text(p[0], p[1], G['roads'][e['road']]['label'], 15, STATUS_FARBE[e['status']], fett=True)
    return K.speichern(os.path.join(ziel, f'kreuz_{name}.png'))


# --- Höhenprofile -----------------------------------------------------------------------------------------
def profil_bild(G, kacheln, name, ziel, titel, kanten, hochpunkte):
    pts, el, s, knoten = strecke_punkte(kanten)
    # Gelände entlang der Strecke alle 100 m (roh, wie in den Kacheln)
    L = s[-1]
    n = max(2, int(L / 0.1))
    sg = np.linspace(0, L, n)
    la = np.interp(sg, s, [p[0] for p in pts])
    lo = np.interp(sg, s, [p[1] for p in pts])
    roh = kacheln.hoehe(la, lo)
    W, H = 1800, 665
    ss = 2
    img = Image.new('RGB', (W * ss, H * ss), (255, 255, 255))
    dr = ImageDraw.Draw(img)
    x0, x1, y0, y1 = 90 * ss, (W - 30) * ss, 145 * ss, (H - 70) * ss
    zmin = min(np.nanmin(roh) if np.isfinite(roh).any() else min(el), min(el))
    zmax = max(np.nanmax(roh) if np.isfinite(roh).any() else max(el), max(el))
    stufe = next(v for v in (10, 20, 50, 100, 200, 250, 500, 1000) if (zmax - zmin) / v <= 8)
    zmin = math.floor(zmin / stufe) * stufe
    zmax = math.ceil(zmax / stufe) * stufe + stufe
    X = lambda km: x0 + (x1 - x0) * km / L  # noqa: E731
    Y = lambda z: y1 - (y1 - y0) * (z - zmin) / (zmax - zmin)  # noqa: E731
    f = schrift(13 * ss)
    fb = schrift(14 * ss, True)
    for z in np.arange(zmin, zmax + 1, stufe):
        dr.line([(x0, Y(z)), (x1, Y(z))], fill=(228, 228, 232), width=ss)
        dr.text((x0 - 8 * ss, Y(z)), f'{z:.0f} m', font=f, fill=(70, 70, 80), anchor='rm')
    kstufe = next(v for v in (1, 2, 5, 10, 20, 25, 50, 100) if L / v <= 16)
    for km in np.arange(0, L + 1e-9, kstufe):
        dr.line([(X(km), y1), (X(km), y1 + 5 * ss)], fill=(90, 90, 100), width=ss)
        dr.text((X(km), y1 + 8 * ss), f'{km:.0f}', font=f, fill=(70, 70, 80), anchor='mt')
    dr.text(((x0 + x1) / 2, y1 + 30 * ss), 'km entlang der Strecke', font=f, fill=(70, 70, 80), anchor='mt')
    # Knoten
    for sk, nidx in knoten:
        dr.line([(X(sk), y0 - 6 * ss), (X(sk), y1)], fill=(205, 205, 215), width=ss)
    # Knotennamen in bis zu vier Zeilen über dem Diagramm; geprüft wird dort, wo der Name wirklich steht (am Rand
    # rückt er nach innen)
    belegt = []
    for k, (sk, nidx) in enumerate(knoten):
        t = G['nodes'][nidx]['name']
        tw = dr.textlength(t, font=f)
        xm = min(max(X(sk), x0 + tw / 2), x1 - tw / 2)
        for reihe in range(4):
            yy = y0 - 12 * ss - reihe * 17 * ss
            r = (xm - tw / 2 - 6 * ss, yy - 15 * ss, xm + tw / 2 + 6 * ss, yy)
            if not any(not (r[2] < q[0] or r[0] > q[2] or r[3] < q[1] or r[1] > q[3]) for q in belegt):
                break
        belegt.append(r)
        dr.text((xm, yy), t, font=f, fill=(60, 60, 75), anchor='mb')
    # Gelände roh (grau) und unser Profil (blau)
    gp = [(X(a), Y(b)) for a, b in zip(sg, roh) if np.isfinite(b)]
    if len(gp) > 1:
        dr.line(gp, fill=(170, 170, 178), width=int(1.5 * ss))
    pp = [(X(a), Y(b)) for a, b in zip(s, el)]
    flaeche = pp + [(X(L), y1), (X(0), y1)]
    over = Image.new('RGBA', img.size, (0, 0, 0, 0))
    ImageDraw.Draw(over).polygon(flaeche, fill=(28, 100, 210, 40))
    img.paste(over, (0, 0), over)
    dr = ImageDraw.Draw(img)
    dr.line(pp, fill=(28, 100, 210), width=3 * ss, joint='curve')
    # Steigungen und Hochpunkte
    g_max = 0.0
    for i in range(1, len(s)):
        d = s[i] - s[i - 1]
        if d >= 0.05:
            g_max = max(g_max, abs(el[i] - el[i - 1]) / (d * 1000))
    # Ein benannter Punkt bis 1,5 km neben dem höchsten Punkt benennt diesen (statt zweier Marken fast übereinander)
    k_hoch = int(np.argmax(el))
    marken = []
    for hname, hl, ho in hochpunkte:
        sk, z = lotpunkt(pts, el, s, hl, ho)
        if k_hoch is not None and abs(sk - s[k_hoch]) <= 1.5:
            marken.append((s[k_hoch], el[k_hoch], f'{hname} (höchster Punkt)'))
            k_hoch = None
        else:
            marken.append((sk, z, hname))
    if k_hoch is not None:
        marken.insert(0, (s[k_hoch], el[k_hoch], 'höchster Punkt'))
    # Beschriftungen, die sich überdecken würden, rücken nach oben (mit Strich zum Punkt)
    # (auch den Knotennamen über dem Diagramm); oben kein Platz mehr: unter den Punkt
    besetzt = list(belegt)
    th = 20 * ss
    for sk, z, t in marken:
        x, y = X(sk), Y(z)
        dr.ellipse((x - 5 * ss, y - 5 * ss, x + 5 * ss, y + 5 * ss), fill=(250, 200, 30), outline=(60, 45, 0), width=ss)
        txt = f'{t}: {z:.0f} m (km {sk:.0f})'
        tw = dr.textlength(txt, font=fb)
        tx = min(max(x, x0 + tw / 2 + 4 * ss), x1 - tw / 2 - 4 * ss)

        def frei(ty):
            return not any(not (tx + tw / 2 < q[0] or tx - tw / 2 > q[2] or ty < q[1] or ty - th > q[3])
                           for q in besetzt)

        oben = [y - 10 * ss - k * (th + 2 * ss) for k in range(8)]
        unten = [y + 12 * ss + th + k * (th + 2 * ss) for k in range(4)]
        ty = next((v for v in oben if v - th >= y0 - 4 * ss and frei(v)), None) or \
            next((v for v in unten if v <= y1 and frei(v)), oben[0])
        besetzt.append((tx - tw / 2, ty - th, tx + tw / 2, ty))
        if ty < y - 10 * ss:
            dr.line((x, y - 6 * ss, tx, ty + 2 * ss), fill=(120, 100, 40), width=ss)
        elif ty > y:
            dr.line((x, y + 6 * ss, tx, ty - th + 2 * ss), fill=(120, 100, 40), width=ss)
        dr.text((tx, ty), txt, font=fb, fill=(40, 30, 0), anchor='mb', stroke_width=3 * ss, stroke_fill=(255, 255, 255))
    ft = schrift(22 * ss, True)
    dr.text((24 * ss, 16 * ss), f'Höhenprofil {titel}', font=ft, fill=(20, 20, 30))
    dr.text((24 * ss, 48 * ss), f'blau: Profil im Spiel (geglättet, Brücken und Tunnel, Steigung begrenzt; steilste Stelle '
            f'{g_max * 100:.1f} %) · grau: Gelände roh aus den Kacheln alle 100 m', font=f, fill=(60, 60, 70))
    img = img.resize((W, H), Image.LANCZOS)
    pfad = os.path.join(ziel, f'profil_{name}.png')
    img.save(pfad, optimize=True)
    return pfad


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--daten', required=True)
    ap.add_argument('--arbeit', required=True)
    ap.add_argument('--ziel', required=True)
    ap.add_argument('namen', nargs='*')
    args = ap.parse_args()
    os.makedirs(args.ziel, exist_ok=True)
    os.makedirs(args.arbeit, exist_ok=True)
    G = spieldaten()
    pfad_atlas = os.path.join(args.daten, 'world-atlas', 'package')
    atlas = {'land': geo.topo_polygone(os.path.join(pfad_atlas, 'land-10m.json'), 'land'),
             'grenzen': geo.topo_grenzen(os.path.join(pfad_atlas, 'countries-10m.json'))}
    ne = ne_linien(args.daten, args.arbeit)
    kacheln = Kacheln(os.path.join(args.daten, 'terrain'))
    alle = list(REGIONEN) + list(STRECKEN) + list(KREUZE)
    for name in args.namen or alle:
        if name in REGIONEN:
            print(region(G, atlas, ne, name, args.ziel))
        elif name in STRECKEN:
            titel, rid, von, bis, hoch = STRECKEN[name]
            kanten = strecke_kanten(G, rid, von, bis)
            print(strecke_karte(G, atlas, ne, kacheln, name, args.ziel, titel, kanten, hoch))
            print(profil_bild(G, kacheln, name, args.ziel, titel, kanten, hoch))
        elif name in KREUZE:
            titel, kid, r = KREUZE[name]
            print(kreuz_karte(G, atlas, ne, kacheln, name, args.ziel, titel, kid, r))
        else:
            raise SystemExit(f'unbekanntes Bild: {name}')


if __name__ == '__main__':
    main()
