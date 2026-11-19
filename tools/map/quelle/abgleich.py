# Abgleich der Straßen mit Natural Earth: je Straße ein durchgehender Weg durch alle ihre Knoten (in Reihenfolge).
# Kürzeste Wege über gerichtete Kanten (damit Abbiegewinkel kosten können), in Schichten: Schicht j = unterwegs
# von Knoten j zu Knoten j+1. Kosten = Länge × Straßenartfaktor × Nummernbonus × Korridorfaktor + Abbiegen; der
# Wechsel in die nächste Schicht kostet den Abstand des Wechselpunkts vom Knoten (Fangkreis).
#
# Gelernt aus den Fehlschlägen des ersten Ansatzes: Handknoten liegen oft mehrere Kilometer neben der echten Straße
# (Orte in der Stadtmitte, Kreuze auf 0,01° gerundet), Natural Earth führt viele Autobahnen nur unter ihrer
# E-Nummer, und die Linien sind an Kreuzen zerrissen. Deshalb: Fangkreise nach Knotenart statt „nächste Linie +
# 2,5 km“, ein breiter Korridor (harte Grenze max(10 km, 30 % der Etappe) × Stufenfaktor, darin weiche Kosten
# 1 + 1,5 × (Abstand / Breite)²), Nummern, die aus dem ersten Durchgang gelernt werden, und eine Treppe aus drei
# Suchstufen, bevor eine Etappe einen Ersatzverlauf bekommt.
import heapq
import math

import numpy as np

from geo import Eben, hav, kurs, winkel_diff
from ne_graph import HEIL

# Straßenartfaktoren je Art unserer Straße (Rang wie in ne_graph.RANG; 6 = geheilte Lücke)
FAKTOR = {
    'ab': {0: 1.0, 1: 1.1, 2: 1.15, 3: 1.45, 4: 1.75, 5: 1.6, HEIL: 3.0},
    'land': {0: 1.3, 1: 1.2, 2: 1.1, 3: 1.0, 4: 1.0, 5: 1.15, HEIL: 3.0},
}
LOCKER = {
    'ab': {0: 1.0, 1: 1.05, 2: 1.1, 3: 1.2, 4: 1.3, 5: 1.3, HEIL: 2.0},
    'land': {0: 1.1, 1: 1.1, 2: 1.05, 3: 1.0, 4: 1.0, 5: 1.05, HEIL: 2.0},
}
HEIL_FIX = 0.3  # km Aufschlag je geheilter Lücke
NUMMER_BONUS = 0.85  # Faktor, wenn die Linie eine Nummer unserer Straße trägt
MEIDEN_FAKTOR = 1.6  # Faktor für Landstraßen auf Linien, die schon eine Autobahn unseres Netzes tragen
# Fangkreis (km) je Knotenart: so weit darf der Wechselpunkt vom Handknoten liegen. Orte stehen in der Stadtmitte,
# die Autobahn führt oft weit vorbei; Kreuze und Anschlussstellen sind von Hand nur ungefähr gesetzt.
FANG_KM = {'ort': 13.0, 'as': 10.0, 'kreuz': 9.0, 'via': 10.0}
# km Kosten je km Abstand Knoten ↔ Wechselpunkt: an Durchgangsknoten (die Straße darf am Ort vorbeiführen) und an
# den Enden (dort fehlte sonst ein Stück Straße, das ergänzt werden müsste)
SNAP_DURCH = {'ab': 0.6, 'land': 1.2}
SNAP_ENDE = {'ab': 1.6, 'land': 2.0}
# Suchstufen: (Korridorfaktor, Fangkreisfaktor, lockere Artfaktoren)
STUFEN = ((1.0, 1.0, False), (2.0, 1.0, True), (3.5, 1.5, True))


def abbiegen(w):
    """Kosten (km) für einen Abbiegewinkel w (Grad, Betrag); None = verboten (Kehre)."""
    if w <= 30:
        return 0.0
    if w <= 90:
        return 0.5 * ((w - 30) / 30) ** 2
    if w <= 165:
        return 2.0 + (w - 90) / 30 * 4.0
    return None


def _hav_np(lat, lon, la, lo):
    R = math.pi / 180
    h = np.sin((la - lat) * R / 2) ** 2 + math.cos(lat * R) * np.cos(la * R) * np.sin((lo - lon) * R / 2) ** 2
    return 2 * 6371.0 * np.arcsin(np.minimum(1.0, np.sqrt(h)))


class Router:
    def __init__(self, g):
        self.g = g
        n = g.n
        self.lat = np.array(g.lat)
        self.lon = np.array(g.lon)
        self.zell = 0.05
        self.ras = {}
        for k in range(n):
            if not g.adj[k]:
                continue
            self.ras.setdefault((math.floor(g.lat[k] / self.zell), math.floor(g.lon[k] / self.zell)), []).append(k)
        # Kurs je gerichteter Kante (2e: u→v, 2e+1: v→u)
        E = len(g.ku)
        self.kurs = [0.0] * (2 * E)
        for e in range(E):
            u, v = g.ku[e], g.kv[e]
            b = kurs(g.lat[u], g.lon[u], g.lat[v], g.lon[v])
            self.kurs[2 * e] = b
            self.kurs[2 * e + 1] = (b + 180) % 360

    def kopf(self, de):
        e = de >> 1
        return self.g.kv[e] if de & 1 == 0 else self.g.ku[e]

    def fuss(self, de):
        e = de >> 1
        return self.g.ku[e] if de & 1 == 0 else self.g.kv[e]

    def knoten_im_umkreis(self, lat, lon, r_km):
        rl = r_km / 110.574
        ro = r_km / (111.32 * max(0.15, math.cos(math.radians(lat))))
        out = []
        for y in range(math.floor((lat - rl) / self.zell), math.floor((lat + rl) / self.zell) + 1):
            for x in range(math.floor((lon - ro) / self.zell), math.floor((lon + ro) / self.zell) + 1):
                out.extend(self.ras.get((y, x), ()))
        if not out:
            return {}
        ids = np.array(out)
        d = _hav_np(lat, lon, self.lat[ids], self.lon[ids])
        m = d <= r_km
        return dict(zip(ids[m].tolist(), d[m].tolist()))

    def korridor(self, pts, W):
        """Knoten im Abstand ≤ W (km) vom Grobverlauf pts [(lat, lon), …] → {Knoten: Abstand}."""
        la = [p[0] for p in pts]
        lo = [p[1] for p in pts]
        latc = (min(la) + max(la)) / 2
        rl = W / 110.574
        ro = W / (111.32 * max(0.15, math.cos(math.radians(latc))))
        out = []
        for y in range(math.floor((min(la) - rl) / self.zell), math.floor((max(la) + rl) / self.zell) + 1):
            for x in range(math.floor((min(lo) - ro) / self.zell), math.floor((max(lo) + ro) / self.zell) + 1):
                out.extend(self.ras.get((y, x), ()))
        if not out:
            return {}
        ids = np.array(out)
        e = Eben(latc, (min(lo) + max(lo)) / 2)
        px = (self.lon[ids] - e.lon0) * e.kx
        py = (self.lat[ids] - e.lat0) * e.ky
        best = np.full(len(ids), 1e18)
        P = [e.xy(*p) for p in pts]
        for (ax, ay), (bx, by) in zip(P, P[1:]):
            dx, dy = bx - ax, by - ay
            l2 = dx * dx + dy * dy
            t = np.zeros(len(ids)) if l2 <= 0 else np.clip(((px - ax) * dx + (py - ay) * dy) / l2, 0, 1)
            best = np.minimum(best, np.hypot(px - (ax + t * dx), py - (ay + t * dy)))
        m = best <= W
        return dict(zip(ids[m].tolist(), best[m].tolist()))

    def kennungen_weg(self, des):
        """Kennungen entlang eines Wegs aus gerichteten Kanten: {Kennung: km}."""
        g = self.g
        out = {}
        for de in des:
            e = de >> 1
            for k in g.kennsets[g.ken[e]]:
                out[k] = out.get(k, 0.0) + g.km[e]
        return out

    def route(self, ziele, grob, art, nummern, stufe=0, meiden=()):
        """Weg durch die Knoten in Reihenfolge.
        ziele: je Knoten (lat, lon, Fangkreis km, Kosten je km Abstand); grob: je Etappe der Grobverlauf; art: 'ab' |
        'land'; nummern: Kennungen unserer Straße; stufe: Index in STUFEN; meiden: Kanten, die MEIDEN_FAKTOR kosten,
        wenn sie keine unserer Nummern tragen.
        Ergebnis: ((gerichtete Kanten, Schichtwechsel-Indizes, Kosten), J) oder (None, erreichte Schicht)."""
        g = self.g
        f_kor, f_fang, locker = STUFEN[stufe]
        fak = (LOCKER if locker else FAKTOR)[art]
        J = len(grob)
        kor = []
        Ws = []
        for j in range(J):
            L = sum(hav(*a, *b) for a, b in zip(grob[j], grob[j][1:]))
            W = max(10.0, 0.3 * L) * f_kor
            Ws.append(W)
            kor.append(self.korridor(grob[j], W))
        fang = []
        for i, (lat, lon, r, snap) in enumerate(ziele):
            alle = self.knoten_im_umkreis(lat, lon, r * f_fang)
            fang.append({k: d * snap for k, d in alle.items() if (i < J and k in kor[i]) or (i > 0 and k in kor[i - 1])})
        if not fang[0]:
            return None, 0
        nb = {}

        def bonus(e):
            v = nb.get(e)
            if v is None:
                v = NUMMER_BONUS if nummern and (g.kennsets[g.ken[e]] & nummern) else 1.0
                nb[e] = v
            return v

        def kosten(de, j):
            e = de >> 1
            K = kor[j]
            du = K.get(g.ku[e])
            dv = K.get(g.kv[e])
            if du is None or dv is None:
                return None
            dm = 0.5 * (du + dv) / Ws[j]
            b = bonus(e)
            c = g.km[e] * fak[g.rang[e]] * b * (1 + 1.5 * dm * dm)
            if b == 1.0 and e in meiden:
                c *= MEIDEN_FAKTOR
            if g.rang[e] == HEIL:
                c += HEIL_FIX
            return c

        NE2 = 2 * len(g.ku)
        dist = {}
        vor = {}
        heap = []
        for k, c0 in fang[0].items():
            for e in g.adj[k]:
                de = 2 * e if g.ku[e] == k else 2 * e + 1
                c = kosten(de, 0)
                if c is None:
                    continue
                c += c0
                if c < dist.get(de, 1e18):
                    dist[de] = c
                    vor[de] = -1
                    heapq.heappush(heap, (c, de))
        beste_schicht = 0
        ziel = None
        while heap:
            c, key = heapq.heappop(heap)
            if c > dist.get(key, 1e18):
                continue
            j, de = divmod(key, NE2)
            if j == J:
                ziel = key
                break
            beste_schicht = max(beste_schicht, j)
            v = self.kopf(de)
            c_fang = fang[j + 1].get(v)
            if c_fang is not None:
                nk = (j + 1) * NE2 + de
                nc = c + c_fang
                if nc < dist.get(nk, 1e18):
                    dist[nk] = nc
                    vor[nk] = key
                    heapq.heappush(heap, (nc, nk))
            b_in = self.kurs[de]
            for e2 in g.adj[v]:
                de2 = 2 * e2 if g.ku[e2] == v else 2 * e2 + 1
                if de2 == (de ^ 1):
                    continue
                pen = abbiegen(abs(winkel_diff(b_in, self.kurs[de2])))
                if pen is None:
                    continue
                if g.km[e2] < 0.1 or g.km[de >> 1] < 0.1:
                    pen *= 0.5
                c2 = kosten(de2, j)
                if c2 is None:
                    continue
                nk = j * NE2 + de2
                nc = c + c2 + pen
                if nc < dist.get(nk, 1e18):
                    dist[nk] = nc
                    vor[nk] = key
                    heapq.heappush(heap, (nc, nk))
        if ziel is None:
            return None, beste_schicht
        kette = []
        key = ziel
        while key != -1:
            kette.append(key)
            key = vor[key]
        kette.reverse()
        des = []
        wechsel = [0]
        for key in kette:
            j, de = divmod(key, NE2)
            if des and des[-1] == de:
                wechsel.append(len(des))  # Schichtwechsel: Knoten j liegt am Kopf der letzten Kante
                continue
            des.append(de)
        return (des, wechsel, dist[ziel]), J


def strasse_routen(router, ziele, grob, art, nummern, log=print, name='', meiden=()):
    """Routet eine ganze Straße. Zuerst am Stück in jeder Suchstufe; gelingt das nicht, wird die Straße an der
    Etappe geteilt, an der die Suche scheitert: der Rest am Stück, diese Etappe allein mit steigender Stufe.
    Ergebnis: Liste von Abschnitten {i0, i1, des, wechsel, stufe} (Knotenindizes i0 < i1) und Liste der Etappen ohne
    Treffer."""
    abschnitte = []
    luecken = []

    def versuch(i0, i1, stufe):
        res, j = router.route(ziele[i0:i1 + 1], grob[i0:i1], art, nummern, stufe, meiden)
        return res, i0 + j

    def teil(i0, i1):
        if i1 <= i0:
            return
        res, jf = versuch(i0, i1, 0)
        if res:
            abschnitte.append({'i0': i0, 'i1': i1, 'des': res[0], 'wechsel': res[1], 'stufe': 0})
            return
        if i1 - i0 > 1:
            res, _ = versuch(i0, i1, 1)
            if res:
                log(f'  {name}: Etappen {i0}–{i1} nur mit lockerer Suche am Stück')
                abschnitte.append({'i0': i0, 'i1': i1, 'des': res[0], 'wechsel': res[1], 'stufe': 1})
                return
        log(f'  {name}: Etappe {jf} ({jf}→{jf + 1}) ohne Weg am Stück → einzeln mit steigender Stufe')
        teil(i0, jf)
        for stufe in range(len(STUFEN)):
            res, _ = versuch(jf, jf + 1, stufe)
            if res:
                abschnitte.append({'i0': jf, 'i1': jf + 1, 'des': res[0], 'wechsel': res[1], 'stufe': stufe})
                log(f'  {name}: Etappe {jf} in Stufe {stufe} gefunden')
                break
        else:
            log(f'  {name}: Etappe {jf} in keiner Stufe → Ersatzverlauf')
            luecken.append(jf)
        teil(jf + 1, i1)

    teil(0, len(ziele) - 1)
    abschnitte.sort(key=lambda a: a['i0'])
    return abschnitte, sorted(luecken)
