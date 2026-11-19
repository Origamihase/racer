# Baut aus den Natural-Earth-Straßen (1:10m, gemeinfrei) einen routingfähigen Graphen.
# Die Linien von Natural Earth sind topologisch nicht sauber (Linienenden berühren sich meist nicht, Stützpunkte
# etwa alle 1,5 km). Deshalb: Linien an ihren Stützpunkten zerlegen, Punkte verschiedener Linien näher als 250 m
# zusammenlegen (die Lage der wichtigeren Straße gewinnt), Kreuzungen ohne gemeinsamen Punkt einfügen und offene
# Linienenden mit dem nächsten Punkt einer anderen Linie im Umkreis von 2 km verbinden (mit Aufschlag).
import json
import math
import re

from geo import Eben, hav, punkt_strecke

# Rang der Straßenarten (klein = wichtig); HEIL = Verbindung über eine Lücke (geheilt)
RANG = {'Major Highway': 0, 'Beltway': 1, 'Bypass': 2, 'Secondary Highway': 3, 'Road': 4, 'Unknown': 5}
HEIL = 6
FAEHRE = ('Ferry Route', 'Ferry, seasonal')


def kennungen(p):
    """Straßennummern einer Natural-Earth-Linie als Menge normierter Kennungen ('A7', 'E45', 'I80', 'US1', '40')."""
    out = set()

    def add(s):
        if not s:
            return
        for t in re.split(r'[\s,;/]+', str(s)):
            t = t.strip().upper().replace('-', '').replace('.', '')
            if not t or t.startswith('_UNTITLED'):
                continue
            t = t.lstrip('_')
            if t:
                out.add(t)

    for k in ('routeraw', 'label', 'label2', 'local', 'localalt', 'namealt', 'namealtt'):
        add(p.get(k))
    name = p.get('name')
    if name:
        lvl = p.get('level') or ''
        pre = p.get('prefix') or ''
        if lvl == 'Interstate':
            add('I' + str(name))
        elif lvl == 'Federal':
            add('US' + str(name))
        elif lvl == 'State':
            add('SR' + str(name))
        elif pre:
            add(pre + str(name))
        else:
            add(name)
    return out


def lade(pfad, zellen, faehren=False):
    """Liest die Linien, die eine der Zellen (1°-Raster, Schlüssel (floor(lat), floor(lon))) berühren.
    Ergebnis: Liste von (Rang, Kennungen, [Linie als [(lat, lon), …], …]), sortiert nach Rang (stabil)."""
    with open(pfad, encoding='utf-8') as f:
        d = json.load(f)
    out = []
    for f in d['features']:
        p = f['properties']
        typ = p.get('type')
        if faehren:
            if typ not in FAEHRE:
                continue
            rang = 0
        else:
            if typ not in RANG:
                continue
            rang = RANG[typ]
        g = f['geometry']
        if not g:
            continue
        linien = g['coordinates'] if g['type'] == 'MultiLineString' else [g['coordinates']]
        treffer = False
        ls = []
        for L in linien:
            pts = []
            for c in L:
                lon, lat = float(c[0]), float(c[1])
                if not (-90 <= lat <= 90 and -180 <= lon <= 180):
                    continue
                if pts and abs(pts[-1][0] - lat) < 1e-9 and abs(pts[-1][1] - lon) < 1e-9:
                    continue
                pts.append((lat, lon))
                if not treffer and (math.floor(lat), math.floor(lon)) in zellen:
                    treffer = True
            if len(pts) >= 2:
                ls.append(pts)
        if treffer and ls:
            out.append((rang, kennungen(p), ls))
    out.sort(key=lambda t: t[0])
    return out


class Raster:
    """Einfaches Punktraster für Nachbarschaftsabfragen (Zellen in Grad)."""

    def __init__(self, dlat, dlon):
        self.dlat = dlat
        self.dlon = dlon
        self.z = {}

    def key(self, lat, lon):
        return (math.floor(lat / self.dlat), math.floor(lon / self.dlon))

    def add(self, lat, lon, v):
        self.z.setdefault(self.key(lat, lon), []).append(v)

    def nahe(self, lat, lon, r=1):
        ky, kx = self.key(lat, lon)
        for dy in range(-r, r + 1):
            for dx in range(-r, r + 1):
                yield from self.z.get((ky + dy, kx + dx), ())


class Graph:
    """Ungerichteter Graph: Knoten (lat, lon), Kanten (u, v, Rang, Kennungen-Index, Länge km, Linie)."""

    def __init__(self):
        self.lat = []
        self.lon = []
        self.ku = []
        self.kv = []
        self.rang = []
        self.ken = []  # Index in self.kennsets
        self.km = []
        self.linie = []
        self.kennsets = []
        self._kidx = {}
        self.adj = []

    def knoten(self, lat, lon):
        self.lat.append(lat)
        self.lon.append(lon)
        self.adj.append([])
        return len(self.lat) - 1

    def kset(self, s):
        k = tuple(sorted(s))
        if k not in self._kidx:
            self._kidx[k] = len(self.kennsets)
            self.kennsets.append(frozenset(k))
        return self._kidx[k]

    def kante(self, u, v, rang, ken, linie):
        e = len(self.ku)
        self.ku.append(u)
        self.kv.append(v)
        self.rang.append(rang)
        self.ken.append(ken)
        self.km.append(hav(self.lat[u], self.lon[u], self.lat[v], self.lon[v]))
        self.linie.append(linie)
        self.adj[u].append(e)
        self.adj[v].append(e)
        return e

    @property
    def n(self):
        return len(self.lat)


def baue_graph(features, merge_km=0.25, heil_km=2.0, kreuzungen=True, log=print):
    """Graph aus den Linien bauen (siehe Kopf der Datei). features wie aus lade()."""
    g = Graph()
    ras = Raster(0.005, 0.01)
    herkunft = []  # Feature-Index je Knoten (für die Zusammenlegung)
    kanten = {}  # (u, v) → Kantenindex
    for fi, (rang, ken, linien) in enumerate(features):
        ki = g.kset(ken)
        for L in linien:
            ids = []
            for lat, lon in L:
                best = None
                bd = merge_km
                for v in ras.nahe(lat, lon):
                    d = hav(lat, lon, g.lat[v], g.lon[v])
                    if d < bd and (herkunft[v] != fi or d < 0.001):
                        bd = d
                        best = v
                if best is None:
                    best = g.knoten(lat, lon)
                    herkunft.append(fi)
                    ras.add(lat, lon, best)
                if not ids or ids[-1] != best:
                    ids.append(best)
            for u, v in zip(ids, ids[1:]):
                k = (u, v) if u < v else (v, u)
                e = kanten.get(k)
                if e is None:
                    kanten[k] = g.kante(k[0], k[1], rang, ki, fi)
                else:
                    if rang < g.rang[e]:
                        g.rang[e] = rang
                    if ken - g.kennsets[g.ken[e]]:
                        g.ken[e] = g.kset(g.kennsets[g.ken[e]] | ken)
    log(f'NE-Graph: {len(features)} Linien, {g.n} Knoten, {len(g.ku)} Kanten nach dem Zusammenlegen')
    if kreuzungen:
        n = kreuzungen_einfuegen(g, log)
        log(f'  {n} Kreuzungen ohne gemeinsamen Punkt eingefügt')
    n = heilen(g, heil_km, log)
    log(f'  {n} offene Enden verbunden; jetzt {g.n} Knoten, {len(g.ku)} Kanten')
    return g


def _kantenraster(g, zell=0.05):
    ras = {}
    for e in range(len(g.ku)):
        if g.ku[e] < 0:
            continue
        u, v = g.ku[e], g.kv[e]
        la0, la1 = sorted((g.lat[u], g.lat[v]))
        lo0, lo1 = sorted((g.lon[u], g.lon[v]))
        for y in range(math.floor(la0 / zell), math.floor(la1 / zell) + 1):
            for x in range(math.floor(lo0 / zell), math.floor(lo1 / zell) + 1):
                ras.setdefault((y, x), []).append(e)
    return ras


def _teile(g, e, k):
    """Kante e am Knoten k teilen (k liegt auf ihr). Die alte Kante wird zur ersten Hälfte, eine neue kommt dazu."""
    u, v = g.ku[e], g.kv[e]
    g.adj[v].remove(e)
    g.kv[e] = k
    g.km[e] = hav(g.lat[u], g.lon[u], g.lat[k], g.lon[k])
    g.adj[k].append(e)
    return g.kante(k, v, g.rang[e], g.ken[e], g.linie[e])


def kreuzungen_einfuegen(g, log):
    """Echte Schnittpunkte zweier Kanten verschiedener Linien werden zu gemeinsamen Knoten."""
    ras = _kantenraster(g)
    paare = set()
    for es in ras.values():
        if len(es) < 2:
            continue
        for i in range(len(es)):
            for j in range(i + 1, len(es)):
                a, b = es[i], es[j]
                if g.linie[a] == g.linie[b]:
                    continue
                paare.add((a, b) if a < b else (b, a))
    schnitte = {}  # Kante → [(t, Knoten)]
    for a, b in sorted(paare):
        ua, va, ub, vb = g.ku[a], g.kv[a], g.ku[b], g.kv[b]
        if len({ua, va, ub, vb}) < 4:
            continue
        e = Eben(g.lat[ua], g.lon[ua])
        p1 = e.xy(g.lat[ua], g.lon[ua])
        p2 = e.xy(g.lat[va], g.lon[va])
        p3 = e.xy(g.lat[ub], g.lon[ub])
        p4 = e.xy(g.lat[vb], g.lon[vb])
        d1x, d1y = p2[0] - p1[0], p2[1] - p1[1]
        d2x, d2y = p4[0] - p3[0], p4[1] - p3[1]
        den = d1x * d2y - d1y * d2x
        if abs(den) < 1e-12:
            continue
        t = ((p3[0] - p1[0]) * d2y - (p3[1] - p1[1]) * d2x) / den
        s = ((p3[0] - p1[0]) * d1y - (p3[1] - p1[1]) * d1x) / den
        if not (0.02 < t < 0.98 and 0.02 < s < 0.98):
            continue
        lat, lon = e.ll(p1[0] + t * d1x, p1[1] + t * d1y)
        schnitte.setdefault(a, []).append((t, lat, lon, b, s))
    # Knoten anlegen (je Schnittpunkt einer) und Kanten teilen
    knoten_von = {}
    for a in sorted(schnitte):
        for t, lat, lon, b, s in schnitte[a]:
            key = (min(a, b), max(a, b))
            if key not in knoten_von:
                knoten_von[key] = g.knoten(lat, lon)
    teil = {}
    for a, lst in schnitte.items():
        for t, lat, lon, b, s in lst:
            k = knoten_von[(min(a, b), max(a, b))]
            teil.setdefault(a, []).append((t, k))
            teil.setdefault(b, []).append((s, k))
    for e in sorted(teil):
        cur = e
        for t, k in sorted(teil[e]):
            if k in (g.ku[cur], g.kv[cur]):
                continue
            nxt = _teile(g, cur, k)
            cur = nxt
    return len(knoten_von)


def heilen(g, heil_km, log, linien_je_ende=3):
    """Offene Linienenden mit dem nächsten Punkt anderer Linien verbinden (höchstens heil_km entfernt): je Ende mit
    den nächsten linien_je_ende Linien. Nur die allernächste genügt nicht: an zerrissenen Kreuzen liegt sie oft
    hinter dem Ende (A96 am Kreuz Memmingen: Anschluss an die A7 nur mit Kehre, die A96 nach Lindau 0,5 km weiter)."""
    ras = _kantenraster(g)
    enden = [k for k in range(g.n) if len(g.adj[k]) == 1]
    neu = []
    zell = 0.05
    for k in enden:
        e0 = g.adj[k][0]
        fi = g.linie[e0]
        lat, lon = g.lat[k], g.lon[k]
        ebene = Eben(lat, lon)
        rlat = heil_km / 110.574
        rlon = heil_km / (111.32 * max(0.2, math.cos(math.radians(lat))))
        kand = set()
        for y in range(math.floor((lat - rlat) / zell), math.floor((lat + rlat) / zell) + 1):
            for x in range(math.floor((lon - rlon) / zell), math.floor((lon + rlon) / zell) + 1):
                kand.update(ras.get((y, x), ()))
        best = {}  # Linie → (Abstand, Kante, t)
        for e in sorted(kand):
            if g.linie[e] == fi:
                continue
            u, v = g.ku[e], g.kv[e]
            if k in (u, v):
                continue
            a = ebene.xy(g.lat[u], g.lon[u])
            b = ebene.xy(g.lat[v], g.lon[v])
            d, t = punkt_strecke(0.0, 0.0, a[0], a[1], b[0], b[1])
            if d <= heil_km and (g.linie[e] not in best or d < best[g.linie[e]][0]):
                best[g.linie[e]] = (d, e, t)
        for b in sorted(best.values())[:linien_je_ende]:
            neu.append((k, b))
    # Verbindungen anlegen; Teilungen je Kante sortiert
    teil = {}
    for k, (d, e, t) in neu:
        teil.setdefault(e, []).append((t, k, d))
    n = 0
    for e in sorted(teil):
        cur = e
        for t, k, d in sorted(teil[e]):
            u, v = g.ku[cur], g.kv[cur]
            ebene = Eben(g.lat[u], g.lon[u])
            a = ebene.xy(g.lat[u], g.lon[u])
            b = ebene.xy(g.lat[v], g.lon[v])
            p = ebene.xy(g.lat[k], g.lon[k])
            dd, tt = punkt_strecke(p[0], p[1], a[0], a[1], b[0], b[1])
            seg = hav(g.lat[u], g.lon[u], g.lat[v], g.lon[v])
            if tt * seg < 0.05:
                ziel = u
            elif (1 - tt) * seg < 0.05:
                ziel = v
            else:
                lat, lon = ebene.ll(a[0] + tt * (b[0] - a[0]), a[1] + tt * (b[1] - a[1]))
                ziel = g.knoten(lat, lon)
                cur = _teile(g, cur, ziel)
            if ziel != k and not any(ziel in (g.ku[x], g.kv[x]) for x in g.adj[k]):
                g.kante(k, ziel, HEIL, g.kset(()), -1)
                n += 1
    return n
