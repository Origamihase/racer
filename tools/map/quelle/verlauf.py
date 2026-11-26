# Straßenverläufe für „Navi ferngesteuert XXL“: gleicht jede Etappe mit Natural Earth ab, legt Knoten auf die
# echten Linien, baut Ersatzverläufe, Fährlinien und Höhen und schreibt alles in tools/map/netz.json.
#
#   python3 -I tools/map/quelle/verlauf.py --daten <Ordner> --arbeit <Ordner>
#
# --daten enthält ne/ne_10m_roads.geojson, ne/ne_10m_rivers_lake_centerlines.geojson und ne/ne_10m_rivers_europe.geojson
# (für die Uferstraßen, ufer.py), world-atlas/package/*.json und terrain/{z}/{x}/{y}.png (fehlende
# Kacheln werden geladen, siehe hoehen.py); --arbeit nimmt Zwischenstände, Protokoll und Statistik auf.
# Der Lauf ist wiederholbar: netz.json behält bei jedem verschobenen Knoten den Handstand (Lage und Zubringer) in
# "grob" und bei jeder Kante den Grobverlauf in "pts"; beides ist die Eingabe des nächsten Laufs.
import argparse
import bisect
import json
import math
import os
import pickle
import re
import sys
import time

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import abgleich  # noqa: E402
import faehren  # noqa: E402
import form  # noqa: E402
import geo  # noqa: E402
import hoehen  # noqa: E402
import knoten  # noqa: E402
import ne_graph  # noqa: E402
import tal  # noqa: E402
import ufer  # noqa: E402

HIER = os.path.dirname(os.path.abspath(__file__))
NETZ = os.path.join(HIER, '..', 'netz.json')
STRASSE = ('ab', 'land')
# Muss eine Etappe weiter als das (km) aus ihrem abgeglichenen Weg zu einem ihrer Knoten ausbeulen, ist der Weg
# nicht diese Straße: Ersatzverlauf. Landstraßen führen durch ihre Orte; Autobahnen treffen sich in Knoten, die
# zwischen ihren echten Linien liegen.
BEULE_KM = {'ab': 16.0, 'land': 3.0}
NE_NAH_KM = 0.75  # so nah am abgeglichenen Weg gilt ein Stück der fertigen Form als abgeglichen
STATUS_GRENZE = (0.85, 0.35)  # Anteil auf dem abgeglichenen Weg für „abgeglichen“ (2) und „teilweise“ (1)
TAL_KORRIDOR_KM = (4.0, 2.5)  # halbe Korridorbreite der Talsuche: in den Alpen, sonst
# Natural Earth ist ein Polygonzug mit Ecken alle 1–2 km; echte Straßen sind Bögen: Gauß-σ (km) je Straßenart
GLATT_KM = {'ab': 0.4, 'land': 0.25}
# Fährt eine Landstraßen-Etappe zu mindestens diesem Anteil auf den NE-Linien einer Autobahn unseres Netzes (ohne
# gemeinsame Nummer), kennt Natural Earth die Landstraße dort nicht: Ersatzverlauf
AUTOBAHN_ANTEIL = 0.5
# Steigungsgrenze nach allen Rampen: ein Prozentpunkt unter hoehen.STEIGUNG_GRENZE, Luft für die kürzeren Sehnen
# der Vereinfachung und das Runden auf Meter und 1e-4°
END_STEIGUNG = {k: round(v - 0.01, 4) for k, v in hoehen.STEIGUNG_GRENZE.items()}
UEBERGANG_GERADE_KM = 0.35  # gerades Stück vor und nach jedem Knoten einer Straße (shapes.js misst bei 0,3 km)
# Mindestradius: Richtungswechsel (Grad) zwischen den Sehnen 0,3 km vor und nach einem Punkt; shape-test erlaubt
# 60° (Autobahn) und 100° (Landstraße), die Luft fängt die Vereinfachung im Export auf (50 m quer verdrehen eine
# 0,3-km-Sehne um bis zu 10°)
ECKE_GRAD = {'ab': 45.0, 'land': 85.0}
# Lange Tunnel: Portale so weit (km) neben der Linie gelten noch als ihre (am Gotthard liegt Natural Earth 2,6 km
# neben Airolo); die Linie läuft über mindestens PORTAL_ANLAUF_KM (sonst 2,5 × Abstand) auf sie zu
PORTAL_FANG_KM = 3.0
PORTAL_ANLAUF_KM = 2.0
# Die Portallagen der Liste sind nicht alle genau: für die Höhen zählt ein Tunnel, dessen Portale bis
# PORTAL_HOEHE_FANG_KM neben der Linie liegen, und als Portal gilt der tiefste Punkt der Linie bis PORTAL_SUCHE_KM
# um die Lage der Liste (jeder km Entfernung zählt wie PORTAL_STRAFE_M Höhe)
PORTAL_HOEHE_FANG_KM = 5.0
PORTAL_SUCHE_KM = 3.0
PORTAL_STRAFE_M = 50.0


class Protokoll:
    """Schreibt jede Entscheidung in verlauf.log; Zeilen ohne Einrückung auch auf die Konsole."""

    def __init__(self, pfad):
        self.f = open(pfad, 'w', encoding='utf-8')

    def __call__(self, *a):
        s = ' '.join(str(x) for x in a)
        self.f.write(s + '\n')
        self.f.flush()
        if not s.startswith('  '):
            print(s)


def lade_netz():
    with open(NETZ, encoding='utf-8') as f:
        netz = json.load(f)
    # Handstand vor dem Abgleich: steht bei verschobenen Knoten in "grob"
    for n in netz['nodes'].values():
        hand = n.pop('grob', None) or {'lat': n['lat'], 'lon': n['lon'], 'places': n['places']}
        n['lat0'], n['lon0'], n['places0'] = hand['lat'], hand['lon'], hand['places']
    return netz


def strassen_nummern(r):
    """Kennungen, unter denen Natural Earth unsere Straße führen kann ('A7', 'E45', 'I80', '40' …)."""
    sonder = {
        'FLTP': {'SR91'}, 'BERNINA': {'29', 'H29'}, 'JO15': {'15'}, 'MX85': {'85'}, 'RV40': {'40'}, 'RV3': {'3'},
        'VT9': {'9'}, 'VT5': {'5'}, 'H13': {'13'}, 'A98': {'A98', 'B34'}, 'TOMEI': set(), 'MT1': set(),
    }
    if r['id'] in sonder:
        return sonder[r['id']]
    s = r['id']
    if r['cc'] != 'DE' and len(s) > 3 and s.endswith(r['cc']):
        s = s[:-2]
    s = re.sub(r'^([A-Z]+\d+)[WOSNHE]$', r'\1', s)
    return {s}


def grobverlauf(netz, e):
    N = netz['nodes']
    return [(N[e['a']]['lat0'], N[e['a']]['lon0'])] + [tuple(p) for p in e['pts']] + [(N[e['b']]['lat0'], N[e['b']]['lon0'])]


def zellen_um(linien):
    """1°-Zellen (mit Nachbarn) entlang von Linien [(lat, lon), …]."""
    zellen = set()
    for pts in linien:
        for p, q in zip(pts, pts[1:]):
            n = max(1, int(geo.hav(*p, *q) / 20))
            for i in range(n + 1):
                la = p[0] + (q[0] - p[0]) * i / n
                lo = p[1] + (q[1] - p[1]) * i / n
                for dy in (-1, 0, 1):
                    for dx in (-1, 0, 1):
                        zellen.add((math.floor(la) + dy, math.floor(lo) + dx))
    return zellen


def ne_graph_laden(args, netz, roads, log):
    """NE-Graph der 1°-Zellen um die Grobverläufe; zwischengespeichert, solange Quelle, ne_graph.py und die Zellen
    gleich sind (eine neue Straße oder ein verschobener Knoten in neuen Zellen baut ihn neu)."""
    pfad = os.path.join(args.arbeit, 'ne_graph.pkl')
    quelle = os.path.join(args.daten, 'ne', 'ne_10m_roads.geojson')
    linien = [grobverlauf(netz, e) for e in netz['edges'] if roads[e['road']]['kind'] in STRASSE]
    zellen = zellen_um(linien)
    stempel = (os.path.getmtime(quelle), os.path.getmtime(ne_graph.__file__), tuple(sorted(zellen)))
    if os.path.exists(pfad):
        with open(pfad, 'rb') as f:
            st, g = pickle.load(f)
        if st == stempel:
            return g
    t = time.time()
    g = ne_graph.baue_graph(ne_graph.lade(quelle, zellen), log=log)
    log(f'NE-Graph gebaut in {time.time() - t:.1f} s')
    with open(pfad, 'wb') as f:
        pickle.dump((stempel, g), f)
    return g


# --- 1) Routing --------------------------------------------------------------------------------------------
def ziele_der_strasse(netz, r):
    """Je Knoten der Straße: (lat, lon) der Handlage, Fangkreis und Kosten je km Abstand (Enden teurer)."""
    N = netz['nodes']
    last = len(r['nodes']) - 1
    out = []
    for i, nid in enumerate(r['nodes']):
        n = N[nid]
        snap = (abgleich.SNAP_ENDE if i in (0, last) else abgleich.SNAP_DURCH)[r['kind']]
        out.append((n['lat0'], n['lon0'], abgleich.FANG_KM[n['kind']], snap))
    return out


def alle_routen(netz, roads, kanten_von, router, log):
    """Routet alle Autobahnen und Landstraßen. Natural Earth führt viele Straßen nur unter ihrer E-Nummer: E-Nummern,
    die mindestens ein Viertel des ersten Wegs tragen, zählen im zweiten Durchgang wie die eigene Nummer.
    Die Landstraßen kommen nach den Autobahnen und meiden deren Linien (abgleich.MEIDEN_FAKTOR): wo Natural Earth eine
    Bundesstraße nicht kennt (B9 im Mittelrheintal), lief sie sonst kilometerweit auf der Autobahn nebenan (A61)
    und lernte sogar deren E-Nummer."""
    nummern = {r['id']: strassen_nummern(r) for r in netz['roads'] if r['kind'] in STRASSE}
    ergebnis = {}
    meiden = {}  # NE-Kante → Autobahn, die sie trägt
    for art in ('ab', 'land'):
        ids = [rid for rid in nummern if roads[rid]['kind'] == art]
        for rid in ids:
            ergebnis[rid] = strasse_routen(netz, roads[rid], kanten_von, router, None, nummern[rid], log, meiden)
        for rid in sorted(ids):
            km = {}
            gesamt = 0.0
            for a in ergebnis[rid]['abschnitte']:
                for k, v in router.kennungen_weg([de for de in a['des'] if de >> 1 not in meiden]).items():
                    km[k] = km.get(k, 0.0) + v
                gesamt += sum(router.g.km[de >> 1] for de in a['des'])
            neu = {k for k, v in km.items() if re.fullmatch(r'E\d+', k) and v >= 0.25 * gesamt} - nummern[rid]
            if neu:
                log(f'  {rid}: gelernte Nummern {", ".join(sorted(neu))}')
                nummern[rid] |= neu
                ergebnis[rid] = strasse_routen(netz, roads[rid], kanten_von, router, None, nummern[rid], log, meiden)
        if art == 'ab':
            meiden = {de >> 1: rid for rid in ids for a in ergebnis[rid]['abschnitte'] for de in a['des']}
    for rid, R in ergebnis.items():
        R['nummern'] = nummern[rid]
    return ergebnis


def strasse_routen(netz, r, kanten_von, router, ziele, nummern, log, meiden=None):
    """Routet eine Straße durch ihre Knoten (oder durch abweichende Zielpunkte) und räumt die Wege auf. meiden: NE-Kanten
    der Autobahnen → Autobahn (siehe alle_routen); je Etappe wird festgehalten, welcher Anteil darauf fährt."""
    meiden = meiden or {}
    g = router.g
    if ziele is None:
        ziele = ziele_der_strasse(netz, r)
    grob = []
    for j, i in enumerate(kanten_von[r['id']]):
        gv = grobverlauf(netz, netz['edges'][i])
        gv[0], gv[-1] = ziele[j][:2], ziele[j + 1][:2]
        grob.append(gv)
    absch, luecken = abgleich.strasse_routen(router, ziele, grob, r['kind'], nummern, log, r['id'], meiden)
    for a in absch:
        des = a['des']
        a['auf_autobahn'] = []
        for j0, j1 in zip(a['wechsel'], a['wechsel'][1:]):
            km = {}
            for de in des[j0:j1]:
                e = de >> 1
                ab = meiden.get(e) if not g.kennsets[g.ken[e]] & nummern else None
                km[ab] = km.get(ab, 0.0) + g.km[e]
            fremd = {ab: v for ab, v in km.items() if ab}
            ab = max(fremd, key=fremd.get) if fremd else None
            a['auf_autobahn'].append((sum(fremd.values()) / max(1e-9, sum(km.values())), ab))
        weg = [router.fuss(des[0])] + [router.kopf(d) for d in des]
        roh = [(g.lat[k], g.lon[k]) for k in weg]
        a['pts'], a['wechsel'] = form.bereinigen(roh, a['wechsel'])
        a['s'] = form.kum(a['pts'])
        a['locker'] = a['stufe'] > 0
        if len(roh) > len(a['pts']):
            log(f'  {r["id"]} Abschnitt {a["i0"]}–{a["i1"]}: {len(roh) - len(a["pts"])} Punkte aus Haken und '
                f'Versätzen entfernt')
    return {'abschnitte': absch, 'luecken': luecken, 'ziele': ziele, 'nummern': nummern, 'meiden': meiden}


def tal_grenze(la, lo):
    """Halbe Korridorbreite der Talsuche (km) je Punkt: in den Alpen ist Natural Earth gröber."""
    return np.where(hoehen.in_alpen(la, lo), TAL_KORRIDOR_KM[0], TAL_KORRIDOR_KM[1])


def portal_glaubhaft(gel, pts, s, p, q):
    """Taugt die Portallage der Liste, um die Linie dorthin zu ziehen? Beide Portale liegen am Fuß des Bergs (1 km
    tunneleinwärts ist das Gelände mindestens 50 m höher) und höchstens 150 m über dem tiefsten Punkt der Linie im
    Umkreis von PORTAL_SUCHE_KM (sonst liegt die Lage der Liste am Hang)."""
    e = geo.Eben(*p)
    qx, qy = e.xy(*q)
    L = math.hypot(qx, qy)
    innen = [e.ll(qx / L, qy / L), e.ll(qx * (1 - 1 / L), qy * (1 - 1 / L))]
    h, _ = gel.hoehen_np(np.array([p[0], q[0], innen[0][0], innen[1][0]]), np.array([p[1], q[1], innen[0][1], innen[1][1]]))
    if not (h[2] > h[0] + 50 and h[3] > h[1] + 50):
        return False
    for x, hx in ((p, h[0]), (q, h[1])):
        sx = form.lot(pts, x[0], x[1], s)[0]
        um = [form.punkt_bei(pts, min(s[-1], max(0.0, sx + d)), s) for d in np.arange(-PORTAL_SUCHE_KM, PORTAL_SUCHE_KM + 0.01, 0.25)]
        hl, _ = gel.hoehen_np(np.array([u[0] for u in um]), np.array([u[1] for u in um]))
        if hx > hl.min() + 150:
            return False
    return True


def portale_einsetzen(a, gel, log, name):
    """Lange Tunnel (Liste in hoehen.py) führen gerade von Portal zu Portal, die Linie läuft davor und dahinter auf
    die echten Portale zu (Natural Earth liegt dort oft am Hang). Ändert den Abschnitt a samt Schichtwechseln.
    Ergebnis: die Tunnel als Bogenlängen-Paare auf der neuen Linie."""
    pts, s = a['pts'], a['s']
    portale = {name: (p, q) for name, p, q in hoehen.TUNNEL}
    tun = []
    for tname, s0, s1 in sorted(hoehen.tunnel_auf_form(pts, s, form.lot, PORTAL_FANG_KM), key=lambda t: t[1]):
        if portal_glaubhaft(gel, pts, s, *portale[tname]):
            tun.append((tname, s0, s1))
        else:
            log(f'  {name}: {tname} – Portallage der Liste passt nicht zum Gelände, Linie bleibt')
    if not tun:
        return []
    neu, neu_s, innen = [], [], []
    pos = -1.0
    for tname, s0, s1 in tun:
        p, q = portale[tname]
        if form.lot(pts, p[0], p[1], s)[0] > form.lot(pts, q[0], q[1], s)[0]:
            p, q = q, p
        dp, dq = form.lot(pts, p[0], p[1], s)[1], form.lot(pts, q[0], q[1], s)[1]
        von = max(pos, s0 - max(PORTAL_ANLAUF_KM, 2.5 * dp))
        bis = min(s[-1], s1 + max(PORTAL_ANLAUF_KM, 2.5 * dq))
        for k in range(len(pts)):
            if pos < s[k] < von:
                neu.append(pts[k])
                neu_s.append(s[k])
        if von > pos:
            neu.append(form.punkt_bei(pts, von, s))
            neu_s.append(von)
        innen.append(len(neu))
        neu += [p, q]
        neu_s += [s0, s1]
        if bis > s1:
            neu.append(form.punkt_bei(pts, bis, s))
            neu_s.append(bis)
        pos = bis
        log(f'  {name}: {tname} von Portal zu Portal (Linie lag {dp:.1f} / {dq:.1f} km daneben)')
    for k in range(len(pts)):
        if s[k] > pos:
            neu.append(pts[k])
            neu_s.append(s[k])
    a['wechsel'] = [min(len(neu) - 1, bisect.bisect_left(neu_s, s[w] - 1e-9)) for w in a['wechsel']]
    a['wechsel'][0], a['wechsel'][-1] = 0, len(neu) - 1
    a['pts'] = neu
    a['s'] = form.kum(neu)
    return [(a['s'][k], a['s'][k + 1]) for k in innen]


def taeler(routen, roads, gel, masken, log):
    """Tunnel auf ihre Portale, dann Talsuche (tal.py) auf allen abgeglichenen Abschnitten; die Schichtwechsel
    wandern mit."""
    n = 0
    for rid in sorted(routen):
        art = roads[rid]['kind']
        for a in routen[rid]['abschnitte']:
            name = f'{rid} Abschnitt {a["i0"]}–{a["i1"]}'
            tun = portale_einsetzen(a, gel, log, name)
            pts = a['pts']
            maske = masken.um(pts, rand=0.1, px=240)
            r = tal.suchen(pts, gel, art, tunnel=tun, land=maske.land_np, grenze=tal_grenze, log=log, name=name)
            if r is None:
                continue
            neu, s_neu, weit = r
            a['wechsel'] = [min(len(neu) - 1, bisect.bisect_left(s_neu, a['s'][w] - 1e-9)) for w in a['wechsel']]
            a['wechsel'][0], a['wechsel'][-1] = 0, len(neu) - 1
            a['pts'] = neu
            a['s'] = form.kum(neu)
            n += 1
            log(f'  {name}: Talsuche, Linie bis {weit:.1f} km verlegt')
    log(f'Talsuche: {n} Abschnitte verschoben')
    # Ecken des Polygonzugs zu Bögen (die Schichtwechsel wandern über die Bogenlänge mit)
    for rid in sorted(routen):
        art = roads[rid]['kind']
        for a in routen[rid]['abschnitte']:
            if a['s'][-1] < 0.5:
                continue
            la, lo = tal.glaetten([p[0] for p in a['pts']], [p[1] for p in a['pts']], GLATT_KM[art])
            dicht = [(float(x), float(y)) for x, y in zip(la, lo)]
            s_dicht = form.kum(dicht)
            f = s_dicht[-1] / a['s'][-1]
            wechsel = [min(len(dicht) - 1, bisect.bisect_left(s_dicht, a['s'][w] * f - 1e-9)) for w in a['wechsel']]
            # gerade Stücke brauchen keine Punkte alle 100 m (5 m Toleranz; die Schichtwechsel bleiben Punkte)
            bleibt = sorted(set(vereinfachen(dicht, [0] * len(dicht), 0.005, 1e9)) | set(wechsel))
            a['pts'] = [dicht[k] for k in bleibt]
            a['wechsel'] = [bisect.bisect_left(bleibt, w) for w in wechsel]
            a['wechsel'][0], a['wechsel'][-1] = 0, len(bleibt) - 1
            a['s'] = form.kum(a['pts'])


# --- 3) Abschnitte durch die Knoten führen und in Etappen teilen --------------------------------------------
def abschnitt_teilen(a, knoten_ids, lage):
    """Führt den Weg eines Abschnitts exakt durch die gelegten Knoten (Beulen, Endrampen, Anschlussbögen) und
    teilt ihn. Gibt je Etappe des Abschnitts die Punktliste zurück und je Knoten den Abstand vom Weg (km)."""
    pts = a['pts']
    s = form.kum(pts)
    w = a['wechsel']
    J = len(knoten_ids)
    sj = []
    dj = []
    for j, nid in enumerate(knoten_ids):
        von = s[w[j - 1]] if j > 0 else 0.0
        bis = s[w[j + 1]] if j + 1 < len(w) else s[-1]
        x, d, _ = form.lot(pts, lage[nid][0], lage[nid][1], s, von, bis)
        sj.append(x)
        dj.append(d)
    # Reihenfolge der Knoten entlang der Straße sichern
    for j in range(1, J):
        if sj[j] <= sj[j - 1] + 0.05:
            sj[j] = min(s[-1], sj[j - 1] + 0.05)

    def breite(d, frei):
        return min(max(3.5 * d, 1.5), 0.45 * frei)

    def ende(pts, X, d, frei, am_ende):
        if d <= 0.002:
            pts = list(pts)
            pts[-1 if am_ende else 0] = X
            return pts
        if d <= 0.5:
            return form.endrampe(pts, X, am_ende, breite(d, frei))
        return form.anschluss(pts, X, am_ende, min(max(1.2 * d, 0.5), 0.45 * frei))

    pts = form.stueck(pts, 0.0, sj[-1], s) if sj[-1] < s[-1] - 1e-6 else list(pts)
    X = lage[knoten_ids[-1]]
    pts = ende(pts, X, geo.hav(*pts[-1], *X), sj[-1] - sj[-2], True)
    stuecke = [None] * (J - 1)
    for j in range(J - 2, 0, -1):
        X = lage[knoten_ids[j]]
        s_now = form.kum(pts)
        # Lotfußpunkt zwischen dem (noch unveränderten) Knoten davor und dem schon gelegten Knoten danach
        x, d, _ = form.lot(pts, X[0], X[1], s_now, sj[j - 1] + 0.01, s_now[-1] - 0.01)
        if d < 0.002:
            neu, k = form.beule(pts, x, X, 0.0, 0.0)
        else:
            neu, k = form.beule(pts, x, X, breite(d, x - sj[j - 1]), breite(d, s_now[-1] - x))
        stuecke[j] = neu[k:]
        pts = neu[: k + 1]
    s_now = form.kum(pts)
    if sj[0] > 1e-6:
        pts = form.stueck(pts, sj[0], s_now[-1], s_now)
    X = lage[knoten_ids[0]]
    stuecke[0] = ende(pts, X, geo.hav(*pts[0], *X), form.kum(pts)[-1], False)
    return stuecke, dj


def schneiden(netz, roads, kanten_von, routen, lage, log):
    formen = {}
    for rid, R in routen.items():
        r = roads[rid]
        for a in R['abschnitte']:
            ids = r['nodes'][a['i0']: a['i1'] + 1]
            stuecke, dj = abschnitt_teilen(a, ids, lage)
            last = len(r['nodes']) - 1
            for j, p in enumerate(stuecke):
                i = kanten_von[rid][a['i0'] + j]
                formen[i] = {'pts': p, 'herkunft': 'locker' if a['locker'] else 'ne', 'bezug': a['pts']}
                anteil, ab = a['auf_autobahn'][j]
                if r['kind'] == 'land' and anteil >= AUTOBAHN_ANTEIL:
                    formen[i]['herkunft'] = 'ersatz'
                    formen[i]['grund'] = f'abgeglichener Weg fährt zu {anteil:.0%} auf der {ab}'
                    log(f'  {name_kante(netz, i)}: Weg zu {anteil:.0%} auf der {ab} → Ersatzverlauf')
                    continue
                # Durchgangsknoten: Beule; Straßenende: Anschlussbogen, darf bis 40 % der Etappe lang sein
                L = form.kum(p)[-1]
                for jj in (j, j + 1):
                    ende = a['i0'] + jj in (0, last)
                    grenze = max(BEULE_KM[r['kind']], 0.4 * L) if ende else BEULE_KM[r['kind']]
                    if dj[jj] > grenze and formen[i]['herkunft'] != 'ersatz':
                        formen[i]['herkunft'] = 'ersatz'
                        formen[i]['grund'] = f'abgeglichener Weg liegt {dj[jj]:.1f} km neben {ids[jj]}'
                        log(f'  {name_kante(netz, i)}: Weg {dj[jj]:.1f} km neben {ids[jj]} → Ersatzverlauf')
    return formen


# --- 4) Prüfen, reparieren, ersetzen -----------------------------------------------------------------------
def name_kante(netz, i):
    e = netz['edges'][i]
    return f'Kante {i} {e["road"]} {e["a"]} → {e["b"]}'


def reparieren(netz, roads, formen, log):
    """Prüft jede abgeglichene Etappe (Umweg, Kehre, Zickzack, Spitze). Mängel werden zuerst repariert (Umwege mit
    Kehre kappen, scharfe Ecken runden); bleibt ein Mangel, bekommt die Etappe einen Ersatzverlauf."""
    for i in sorted(formen):
        f = formen[i]
        if f['herkunft'] == 'ersatz':
            continue
        art = roads[netz['edges'][i]['road']]['kind']
        m, k = form.pruefen(f['pts'], art)
        if not m:
            continue
        p2, erzeugt = form.umweg_kappen(f['pts'])
        m2, _ = form.pruefen(p2, art)
        if m2:
            # Spitzen und Zickzack aus kleineren Knicken: schärfer suchen, kürzere Bögen zulassen
            p2, mehr = form.umweg_kappen(p2, scharf=60.0, faktor=1.2)
            erzeugt += mehr
        p2 = form.abrunden(p2)
        m2, k2 = form.pruefen(p2, art)
        if not m2:
            log(f'  {name_kante(netz, i)}: {", ".join(m)} → repariert ({erzeugt:.1f} km Bogen, '
                f'{k["km"]:.1f} → {k2["km"]:.1f} km)')
            f['pts'] = p2
            f['repariert'] = erzeugt
        else:
            log(f'  {name_kante(netz, i)}: {", ".join(m)}, nach Reparatur noch {", ".join(m2)} → Ersatzverlauf')
            f['herkunft'] = 'ersatz'
            f['grund'] = ', '.join(m2)


class Landmasken:
    """Landmasken (Natural Earth 1:10m) für Ausschnitte, bei Bedarf gerastert."""

    def __init__(self, daten):
        self.polygone = geo.topo_polygone(os.path.join(daten, 'world-atlas', 'package', 'land-10m.json'), 'land')
        self.boxen = []
        for poly in self.polygone:
            xs = [p[0] for p in poly[0]]
            ys = [p[1] for p in poly[0]]
            self.boxen.append((min(ys), max(ys), min(xs), max(xs)))

    def ausschnitt(self, lat0, lat1, lon0, lon1, px):
        # höchstens etwa 4 Millionen Pixel je Maske
        px = max(10, min(px, int(math.sqrt(4e6 / max(1e-6, (lat1 - lat0) * (lon1 - lon0))))))
        teil = [poly for poly, b in zip(self.polygone, self.boxen) if b[1] >= lat0 and b[0] <= lat1 and b[3] >= lon0 and b[2] <= lon1]
        return geo.LandMaske(teil, lat0, lat1, lon0, lon1, px)

    def um(self, pts, rand=0.5, px=120):
        la = [p[0] for p in pts]
        lo = [p[1] for p in pts]
        return self.ausschnitt(min(la) - rand, max(la) + rand, min(lo) - rand, max(lo) + rand, px)


def ersatzverlaeufe(netz, roads, kanten_von, routen, formen, lage, masken, gel, log):
    """Ersatzverläufe für Etappen ohne Abgleich (Lücken) und für verworfene Abgleiche. Im Bergland gibt das Gelände
    den Verlauf vor (tal.gelaende_weg: durch die Täler von Ort zu Ort, Ersatzwegen anderer Straßen ausweichend); im
    flachen Land ist es der geglättete Grobverlauf mit Mäandern (form.ersatz), bergige Stücke darin per Talsuche
    (Enden fest auf den Knoten)."""
    N = netz['nodes']
    for rid, R in routen.items():
        for j in R['luecken']:
            i = kanten_von[rid][j]
            formen[i] = {'herkunft': 'ersatz', 'grund': 'kein Weg im Natural-Earth-Netz (auch locker nicht)'}
    fremd = [(netz['edges'][i]['road'], f['pts']) for i, f in sorted(formen.items()) if f.get('ersatz')]
    for i in sorted(formen):
        f = formen[i]
        if f['herkunft'] != 'ersatz' or ('pts' in f and f.get('ersatz')):
            continue
        e = netz['edges'][i]
        art = roads[e['road']]['kind']
        A = lage.get(e['a'], (N[e['a']]['lat0'], N[e['a']]['lon0']))
        B = lage.get(e['b'], (N[e['b']]['lat0'], N[e['b']]['lon0']))
        mitte = [tuple(p) for p in e['pts']]
        maske = masken.um([A, B] + mitte)
        auf_land = all(maske.land(*p) for p in form.verdichten([A] + mitte + [B], 1.0))
        pts = tal.gelaende_weg([A] + mitte + [B], gel, art, land=maske.land_np,
                               fremd=[F for r, F in fremd if r != e['road']], log=log, name=name_kante(netz, i))
        if pts is not None:
            f['gelaende'] = True
        else:
            pts, auf_land = form.ersatz(A, B, mitte, art, f'{e["road"]}/{e["a"]}/{e["b"]}', maske)
            s = form.kum(pts)
            tun = [(x, y) for _, x, y in hoehen.tunnel_auf_form(pts, s, form.lot)]
            r = tal.suchen(pts, gel, art, tunnel=tun, land=maske.land_np, grenze=tal_grenze, fest=True, log=log,
                           name=name_kante(netz, i))
            if r is not None:
                pts = [A] + r[0][1:-1] + [B]
                f['tal'] = r[2]
        f['pts'] = pts
        f['ersatz'] = True
        fremd.append((e['road'], pts))
        m, k = form.pruefen(pts, art)
        log(f'  {name_kante(netz, i)}: Ersatzverlauf {k["km"]:.1f} km (Luftlinie {k["luft"]:.1f}), Grund: {f["grund"]}'
            + ('; aus dem Gelände' if f.get('gelaende') else '; Mäander' + (f', Talsuche bis {f["tal"]:.1f} km' if 'tal' in f else ''))
            + ('' if auf_land else '; Grobverlauf quert Wasser') + (f'; Mängel: {", ".join(m)}' if m else ''))


def geraden(netz, roads, formen, log):
    for i in sorted(formen):
        f = formen[i]
        if f['herkunft'] == 'ersatz':
            continue
        e = netz['edges'][i]
        pts, ersetzt = form.geraden_beleben(f['pts'], roads[e['road']]['kind'], f'{e["road"]}/{e["a"]}/{e["b"]}')
        if ersetzt > 0:
            f['pts'] = pts
            f['belebt'] = ersetzt
            log(f'  {name_kante(netz, i)}: {ersetzt:.1f} km schnurgerade NE-Strecke sanft geschwungen')


def ecken(netz, roads, formen, log):
    """Mindestradius für jede Straße: Ecken über ECKE_GRAD (Natural-Earth-Ecken an Kreuzen, Anschlüsse über
    Stadtstraßen, Beulen in Ortsknoten) werden zu Bögen; die Übergänge an den Knoten bleiben unberührt."""
    n = 0
    for i in sorted(formen):
        art = roads[netz['edges'][i]['road']]['kind']
        if art not in STRASSE:
            continue
        pts, gerundet, rest = form.ecken_runden(formen[i]['pts'], ECKE_GRAD[art], UEBERGANG_GERADE_KM + 0.05)
        formen[i]['pts'] = pts
        n += len(gerundet)
        for km, w, lang in gerundet:
            log(f'  {name_kante(netz, i)}: Ecke {w:.0f}° bei km {km:.1f} → Bogen über {lang:.1f} km')
        for km, w in rest:
            log(f'  {name_kante(netz, i)}: Ecke {w:.0f}° bei km {km:.1f} bleibt (kein Bogen hält die Grenze)')
    log(f'Ecken gerundet: {n}')


def kurs_am_ende(pts, am_ende, d=0.3):
    s = form.kum(pts)
    if am_ende:
        a, b = form.punkt_bei(pts, max(0.0, s[-1] - d), s), pts[-1]
    else:
        a, b = pts[0], form.punkt_bei(pts, min(s[-1], d), s)
    return geo.kurs(*a, *b)


def uebergaenge(netz, kanten_von, formen, log):
    """Etappen einer Straße schließen an ihren gemeinsamen Knoten ohne Knick aneinander."""
    n = 0
    for r in netz['roads']:
        if r['kind'] not in STRASSE:
            continue
        ks = kanten_von[r['id']]
        for k1, k2 in zip(ks, ks[1:]):
            rein, raus = formen[k1]['pts'], formen[k2]['pts']
            # Jeder Übergang bekommt eine gemeinsame Richtung und davor/danach ein gerades Stück (so misst auch
            # das 1e-4°-Raster von shapes.js dieselbe Richtung); Knicke werden über D km ausgerundet.
            w = abs(geo.winkel_diff(kurs_am_ende(rein, True), kurs_am_ende(raus, False)))
            D = min(4.0, max(1.0, 0.05 * w))
            formen[k1]['pts'], formen[k2]['pts'] = form.glatt_am_knoten(rein, raus, D, gerade=UEBERGANG_GERADE_KM)
            n += 1
            if w > 20:
                log(f'  {r["id"]} am Knoten {netz["edges"][k1]["b"]}: Knick {w:.0f}° über {D:.1f} km geglättet')
    log(f'Übergänge geglättet: {n}')


# --- 5) Anteil auf dem abgeglichenen Weg -> Status ----------------------------------------------------
def anteil_am_weg(pts, bezug, nah=NE_NAH_KM, schritt=0.25):
    """Anteil der fertigen Form, der höchstens nah km neben ihrem abgeglichenen Weg liegt (Beulen in Knoten,
    Anschlussbögen und Rundungen zählen nicht als abgeglichen)."""
    s = form.kum(pts)
    n = max(1, int(s[-1] / schritt))
    P = np.array([form.punkt_bei(pts, s[-1] * k / n, s) for k in range(n + 1)])
    B = np.array(bezug)
    rand = nah / 111.0 + 0.02
    drin = ((np.maximum(B[:-1, 0], B[1:, 0]) >= P[:, 0].min() - rand) & (np.minimum(B[:-1, 0], B[1:, 0]) <= P[:, 0].max() + rand)
            & (np.maximum(B[:-1, 1], B[1:, 1]) >= P[:, 1].min() - 2 * rand) & (np.minimum(B[:-1, 1], B[1:, 1]) <= P[:, 1].max() + 2 * rand))
    if not drin.any():
        return 0.0
    e = geo.Eben(*P[len(P) // 2])
    ax, ay = e.xy(B[:-1, 0][drin], B[:-1, 1][drin])
    bx, by = e.xy(B[1:, 0][drin], B[1:, 1][drin])
    px, py = e.xy(P[:, 0], P[:, 1])
    dx, dy = bx - ax, by - ay
    l2 = np.maximum(dx * dx + dy * dy, 1e-12)
    treffer = 0
    for k in range(0, len(px), 256):
        qx, qy = px[k:k + 256, None], py[k:k + 256, None]
        t = np.clip(((qx - ax) * dx + (qy - ay) * dy) / l2, 0, 1)
        d = np.hypot(qx - ax - t * dx, qy - ay - t * dy).min(axis=1)
        treffer += int((d <= nah).sum())
    return treffer / len(px)


# --- 6) Fähren, Autozüge, Flüge ---------------------------------------------------------------------------
def sonderwege(args, netz, roads, lage, masken, log):
    N = netz['nodes']
    out = {}

    def pos(nid):
        return lage.get(nid, (N[nid]['lat0'], N[nid]['lon0']))

    fe = [i for i, e in enumerate(netz['edges']) if roads[e['road']]['kind'] == 'faehre']
    quelle = os.path.join(args.daten, 'ne', 'ne_10m_roads.geojson')
    linien = []
    for _, _, ls in ne_graph.lade(quelle, zellen_um([[pos(netz['edges'][i]['a']), pos(netz['edges'][i]['b'])] for i in fe]), faehren=True):
        linien.extend(ls)
    for i, e in enumerate(netz['edges']):
        art = roads[e['road']]['kind']
        if art in STRASSE:
            continue
        A, B = pos(e['a']), pos(e['b'])
        if art == 'faehre':
            ne = faehren.ne_faehre(A, B, linien)
            if ne:
                pts = form.abrunden([A] + ne[0] + [B], grenze=30.0, t_max=2.0)
                log(f'  {name_kante(netz, i)}: NE-Fährroute (Häfen {ne[1]:.1f} / {ne[2]:.1f} km entfernt)')
                out[i] = {'pts': pts, 'herkunft': 'ne', 'status': 2}
                continue
            pts = faehren.wasserweg(A, B, masken.ausschnitt)
            if pts:
                log(f'  {name_kante(netz, i)}: keine passende NE-Fährroute → Weg übers Wasser')
                out[i] = {'pts': pts, 'herkunft': 'ersatz', 'status': 0}
            else:
                log(f'  {name_kante(netz, i)}: kein Weg übers Wasser gefunden → gerade Linie')
                out[i] = {'pts': [A, B], 'herkunft': 'ersatz', 'status': 0}
        elif art == 'zug':
            out[i] = {'pts': [A, B], 'herkunft': 'gerade', 'status': 2}
        else:
            out[i] = {'pts': grosskreis(A, B), 'herkunft': 'bogen', 'status': 2}
    return out


def grosskreis(A, B, n=24):
    """Großkreisbogen von A nach B (sanfter Bogen für Luftfracht)."""
    la1, lo1, la2, lo2 = (math.radians(v) for v in (*A, *B))
    p1 = (math.cos(la1) * math.cos(lo1), math.cos(la1) * math.sin(lo1), math.sin(la1))
    p2 = (math.cos(la2) * math.cos(lo2), math.cos(la2) * math.sin(lo2), math.sin(la2))
    om = math.acos(max(-1.0, min(1.0, sum(a * b for a, b in zip(p1, p2)))))
    out = [A]
    for k in range(1, n):
        t = k / n
        a = math.sin((1 - t) * om) / math.sin(om)
        b = math.sin(t * om) / math.sin(om)
        x, y, z = (a * u + b * v for u, v in zip(p1, p2))
        out.append((math.degrees(math.atan2(z, math.hypot(x, y))), math.degrees(math.atan2(y, x))))
    out.append(B)
    return out


# --- 7) Höhen ----------------------------------------------------------------------------------------------
def gleichmaessig(pts, schritt):
    """Proben im gleichen Abstand (≈ schritt km) entlang der Form; die Stützpunkte der Form kommen hinzu.
    Ergebnis: (Punkte, Bogenlänge je Punkt, Indizes der gleichmäßigen Proben, Probenabstand)."""
    s = form.kum(pts)
    n = max(1, int(math.ceil(s[-1] / schritt)))
    ds = s[-1] / n
    alle = sorted({(s[-1] * k / n, 1) for k in range(n + 1)} | {(si, 0) for si in s})
    punkte, bogen, proben = [], [], []
    for si, ist_probe in alle:
        if bogen and si - bogen[-1] < 1e-6:
            if ist_probe:
                proben.append(len(bogen) - 1)
            continue
        punkte.append(form.punkt_bei(pts, si, s))
        bogen.append(si)
        if ist_probe:
            proben.append(len(bogen) - 1)
    return punkte, bogen, proben, ds


def steigung_klemmen(z, s, g):
    """Begrenzt die Steigung zwischen allen Nachbarpunkten (Bogenlänge s in km) auf g; Anfang und Ende bleiben.
    Abwechselnd vorwärts und rückwärts, bis jedes Paar die Grenze hält (solange die Enden sie zulassen)."""
    z = np.array(z, dtype=np.float64)
    d = g * np.diff(np.asarray(s)) * 1000.0
    n = len(z)
    for _ in range(20):
        for k in range(1, n - 1):
            z[k] = min(max(z[k], z[k - 1] - d[k - 1]), z[k - 1] + d[k - 1])
        for k in range(n - 2, 0, -1):
            z[k] = min(max(z[k], z[k + 1] - d[k]), z[k + 1] + d[k])
        if (np.abs(np.diff(z)) <= d + 1e-6).all():
            return z
    raise RuntimeError(f'Steigung {g:.1%} nach 20 Durchgängen nicht eingehalten (Enden {z[0]:.0f} / {z[-1]:.0f} m)')


def portale_im_profil(z, k0, k1, ds):
    """Portale eines Tunnels im Profil z (Proben im Abstand ds): je der tiefste Punkt bis PORTAL_SUCHE_KM um die Lage
    der Liste, jeder km Entfernung zählt wie PORTAL_STRAFE_M Höhe; die Tunnelmitte bleibt innen."""
    r = int(round(PORTAL_SUCHE_KM / ds))
    mitte = (k0 + k1) // 2
    out = []
    for k, a, b in ((k0, max(0, k0 - r), min(mitte, k0 + r)), (k1, max(mitte, k1 - r), min(len(z) - 1, k1 + r))):
        j = np.arange(a, b + 1)
        out.append(int(j[np.argmin(z[a:b + 1] + PORTAL_STRAFE_M * np.abs(j - k) * ds)]))
    return out[0], out[1]


def hoehen_rechnen(netz, roads, formen, masken, gel, log):
    """Höhenprofil jeder Form (Meter, ganzzahlig, an jedem Punkt der verdichteten Form)."""
    vor = {}
    alle_punkte = []
    for i, f in formen.items():
        art = roads[netz['edges'][i]['road']]['kind']
        if art in STRASSE:
            vor[i] = gleichmaessig(f['pts'], hoehen.SCHRITT)
            alle_punkte.extend(vor[i][0])
        else:
            alle_punkte.extend([f['pts'][0], f['pts'][-1]])
    gel.vorbereiten(alle_punkte)
    gefunden = set()
    roh = {}
    for i in sorted(vor):
        punkte, bogen, proben, ds = vor[i]
        art = roads[netz['edges'][i]['road']]['kind']
        P = [punkte[k] for k in proben]
        z = np.array([gel.hoehe(*p) for p in P])
        maske = masken.um(P, rand=0.1, px=240)
        wasser = ~maske.land_np(np.array([p[0] for p in P]), np.array([p[1] for p in P]))
        tun = []
        for name, s0, s1 in hoehen.tunnel_auf_form(P, [k * ds for k in range(len(P))], form.lot, PORTAL_HOEHE_FANG_KM):
            k0, k1 = portale_im_profil(z, int(round(s0 / ds)), int(round(s1 / ds)), ds)
            tun.append((k0, k1))
            gefunden.add(name)
            log(f'  {name_kante(netz, i)}: {name} km {k0 * ds:.1f}–{k1 * ds:.1f} (Liste: {s0:.1f}–{s1:.1f})')
        roh[i] = (hoehen.profil(z, wasser, ds, art, tun), ds)
    for name, _, _ in hoehen.TUNNEL:
        if name not in gefunden:
            log(f'  Tunnel {name}: liegt auf keiner Etappe')
    # Knotenhöhe: Mittel der Profilenden aller anliegenden Straßen-Etappen; die Profile laufen sanft darauf zu
    enden = {}
    for i, (z, ds) in roh.items():
        e = netz['edges'][i]
        enden.setdefault(e['a'], []).append(z[0])
        enden.setdefault(e['b'], []).append(z[-1])
    knoten_h = {k: float(round(sum(v) / len(v))) for k, v in enden.items()}
    for i, f in formen.items():
        e = netz['edges'][i]
        for k in (e['a'], e['b']):
            if k not in knoten_h:
                knoten_h[k] = float(max(0, round(gel.hoehe(*f['pts'][0 if k == e['a'] else -1]))))
    for i, f in formen.items():
        e = netz['edges'][i]
        art = roads[e['road']]['kind']
        ha, hb = knoten_h[e['a']], knoten_h[e['b']]
        if i in roh:
            z, ds = roh[i]
            z = z.copy()
            L = ds * (len(z) - 1)
            for am_ende, ziel in ((False, ha), (True, hb)):
                delta = ziel - (z[-1] if am_ende else z[0])
                D = min(L / 2, max(0.6, abs(delta) / 4.0))  # höchstens 0,4 % zusätzliche Steigung
                u = np.arange(len(z)) * ds
                if am_ende:
                    u = u[-1] - u
                z += delta * np.clip(1 - u / D, 0, None)
            punkte, bogen, proben, ds = vor[i]
            zp = np.interp(bogen, [bogen[k] for k in proben], z)
            zp[0], zp[-1] = ha, hb
            zp = steigung_klemmen(zp, bogen, END_STEIGUNG[art])
            f['pts'] = punkte
            f['hoehe'] = [int(round(v)) for v in zp]
        elif art == 'faehre':
            # auf dem Wasser Meereshöhe, in den Häfen die Knotenhöhe
            s = form.kum(f['pts'])
            f['hoehe'] = [int(round(max(ha * (1 - si / 0.5), hb * (1 - (s[-1] - si) / 0.5), 0))) for si in s]
            f['hoehe'][0], f['hoehe'][-1] = int(ha), int(hb)
        else:
            s = form.kum(f['pts'])
            f['hoehe'] = [int(round(ha + (hb - ha) * si / s[-1])) if s[-1] > 0 else int(ha) for si in s]
    log(f'Höhen: {len(roh)} Straßenprofile, Kacheln neu geladen: {gel.geholt}')


# --- 8) Vereinfachen und schreiben -------------------------------------------------------------------------
def vereinfachen(pts, hoehe, tol_km, tol_m):
    """Douglas-Peucker in Lage und Höhe: ein Punkt bleibt, wenn er weiter als tol_km neben der Sehne oder weiter
    als tol_m über/unter ihr liegt. Gibt die Indizes der bleibenden Punkte zurück."""
    n = len(pts)
    if n <= 2:
        return list(range(n))
    e = geo.Eben(*pts[0])
    xy = [e.xy(*p) for p in pts]
    s = [0.0]
    for a, b in zip(xy, xy[1:]):
        s.append(s[-1] + math.hypot(b[0] - a[0], b[1] - a[1]))
    behalten = [False] * n
    behalten[0] = behalten[-1] = True
    stapel = [(0, n - 1)]
    while stapel:
        i, j = stapel.pop()
        if j <= i + 1:
            continue
        ax, ay = xy[i]
        bx, by = xy[j]
        dx, dy = bx - ax, by - ay
        l2 = dx * dx + dy * dy
        best, bk = 0.0, -1
        for k in range(i + 1, j):
            px, py = xy[k]
            t = 0.0 if l2 <= 0 else max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / l2))
            dxy = math.hypot(px - ax - t * dx, py - ay - t * dy) / tol_km
            u = (s[k] - s[i]) / (s[j] - s[i]) if s[j] > s[i] else 0.0
            dz = abs(hoehe[k] - (hoehe[i] + (hoehe[j] - hoehe[i]) * u)) / tol_m
            v = max(dxy, dz)
            if v > best:
                best, bk = v, k
        if best > 1.0:
            behalten[bk] = True
            stapel.append((i, bk))
            stapel.append((bk, j))
    return [k for k in range(n) if behalten[k]]


def form_kodieren(pts, hoehe):
    return geo.kodiere([(round(p[0] * 1e5), round(p[1] * 1e5), h) for p, h in zip(pts, hoehe)])


def schreiben(netz, roads, lage, formen, status, log):
    N = netz['nodes']
    P = netz['places']
    for nid in N:
        n = N[nid]
        neu = lage.get(nid)
        orig = (n.pop('lat0'), n.pop('lon0'))
        hand = n.pop('places0')
        lage_neu = neu if neu and geo.hav(*neu, *orig) > 0.001 else orig
        # Zubringer folgen der Lage (knoten.zubringer_roh); der Handstand bleibt in "grob", sobald sich etwas ändert
        n['lat'], n['lon'] = lage_neu
        n['places'] = [[p, round(knoten.zubringer_roh(d, (P[p]['lat'], P[p]['lon']), orig, lage_neu), 1)] for p, d in hand]
        if lage_neu != orig or n['places'] != hand:
            n['grob'] = {'lat': orig[0], 'lon': orig[1], 'places': hand}
    for i, e in enumerate(netz['edges']):
        f = formen[i]
        art = roads[e['road']]['kind']
        idx = vereinfachen(f['pts'], f['hoehe'], 0.008, 2.0) if art in STRASSE else list(range(len(f['pts'])))
        pts = [f['pts'][k] for k in idx]
        h = [f['hoehe'][k] for k in idx]
        pts[0] = (N[e['a']]['lat'], N[e['a']]['lon'])
        pts[-1] = (N[e['b']]['lat'], N[e['b']]['lon'])
        e['form'] = form_kodieren(pts, h)
        e['status'] = status[i]
        # Uferstraße (ufer.py): der Export vereinfacht sie feiner, sonst schnitte die grobe Linie die Flussbögen
        if f.get('ufer'):
            e['ufer'] = f['ufer']
        else:
            e.pop('ufer', None)
        if art in ('ab', 'land', 'faehre'):
            e['km'] = round(form.kum(f['pts'])[-1], 1)
    with open(NETZ, 'w', encoding='utf-8') as f:
        d = lambda v: json.dumps(v, ensure_ascii=False)  # noqa: E731
        f.write('{\n"places": {\n' + ',\n'.join(d(k) + ': ' + d(v) for k, v in P.items()) + '\n},\n')
        f.write('"nodes": {\n' + ',\n'.join(d(k) + ': ' + d(v) for k, v in N.items()) + '\n},\n')
        f.write('"roads": [\n' + ',\n'.join(d(v) for v in netz['roads']) + '\n],\n')
        f.write('"edges": [\n' + ',\n'.join(d(v) for v in netz['edges']) + '\n]\n}\n')
    log(f'netz.json geschrieben ({os.path.getsize(NETZ) / 1024:.0f} kB)')


def statistik(netz, roads, formen, status, pfad, log):
    """Abgeglichen / teilweise / Ersatz je Land und Straßenart (Etappen und km)."""
    tab = {}
    for i, e in enumerate(netz['edges']):
        r = roads[e['road']]
        km = form.kum(formen[i]['pts'])[-1]
        z = tab.setdefault(r['cc'], {}).setdefault(r['kind'], {'2': [0, 0.0], '1': [0, 0.0], '0': [0, 0.0]})
        z[str(status[i])][0] += 1
        z[str(status[i])][1] += km
    with open(pfad, 'w', encoding='utf-8') as f:
        json.dump(tab, f, ensure_ascii=False, indent=1, sort_keys=True)
    log('Abgleich je Land und Art (abgeglichen / teilweise / Ersatz, Etappen und km):')
    for cc in sorted(tab):
        for art in sorted(tab[cc]):
            z = tab[cc][art]
            log(f'  {cc} {art:6s} ' + '  '.join(f'{z[k][0]:3d} / {z[k][1]:7.0f} km' for k in ('2', '1', '0')))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--daten', required=True)
    ap.add_argument('--arbeit', required=True)
    ap.add_argument('--nur-formen', action='store_true', help='nach den Straßenformen aufhören (ohne Höhen, netz.json bleibt)')
    args = ap.parse_args()
    os.makedirs(args.arbeit, exist_ok=True)
    log = Protokoll(os.path.join(args.arbeit, 'verlauf.log'))
    t0 = time.time()
    netz = lade_netz()
    roads = {r['id']: r for r in netz['roads']}
    kanten_von = {}
    for i, e in enumerate(netz['edges']):
        kanten_von.setdefault(e['road'], []).append(i)
    g = ne_graph_laden(args, netz, roads, log)
    router = abgleich.Router(g)
    t = time.time()
    routen = alle_routen(netz, roads, kanten_von, router, log)
    log(f'Routing aller Straßen: {time.time() - t:.1f} s')
    gel = hoehen.Gelaende(os.path.join(args.daten, 'terrain'), log)
    masken = Landmasken(args.daten)
    t = time.time()
    taeler(routen, roads, gel, masken, log)
    log(f'Talsuche: {time.time() - t:.1f} s')
    lage = knoten.legen(netz, roads, routen, log)
    knoten.enden_verlaengern(netz, roads, routen, router, lage, log)
    formen = schneiden(netz, roads, kanten_von, routen, lage, log)
    log(f'Etappen mit abgeglichener Form: {len(formen)}')
    reparieren(netz, roads, formen, log)
    ersatzverlaeufe(netz, roads, kanten_von, routen, formen, lage, masken, gel, log)
    geraden(netz, roads, formen, log)
    # Uferstraßen (ufer.py): am Ufer entlang statt mal links, mal rechts des Flusses
    ufer.legen(netz, args.daten, lage, formen, log)
    uebergaenge(netz, kanten_von, formen, log)
    # Schlussprüfung: was nach dem Glätten noch Mängel hat, bekommt doch einen Ersatzverlauf
    nachzuegler = []
    for i in sorted(formen):
        m, _ = form.pruefen(formen[i]['pts'], roads[netz['edges'][i]['road']]['kind'])
        if m and formen[i]['herkunft'] != 'ersatz':
            formen[i] = {'herkunft': 'ersatz', 'grund': 'nach dem Glätten ' + ', '.join(m)}
            nachzuegler.append(i)
        elif m:
            log(f'  {name_kante(netz, i)}: Ersatzverlauf bleibt trotz {", ".join(m)} (Grobverlauf)')
    if nachzuegler:
        ersatzverlaeufe(netz, roads, kanten_von, {}, formen, lage, masken, gel, log)
        uebergaenge(netz, kanten_von, formen, log)
    ecken(netz, roads, formen, log)
    log(f'Formen fertig nach {time.time() - t0:.0f} s')
    status = {}
    for i, f in formen.items():
        if f['herkunft'] == 'ersatz':
            status[i] = 0
            continue
        a = anteil_am_weg(f['pts'], f['bezug'])
        status[i] = 2 if a >= STATUS_GRENZE[0] else (1 if a >= STATUS_GRENZE[1] else 0)
        if status[i] < 2:
            log(f'  {name_kante(netz, i)}: {a:.0%} auf dem abgeglichenen Weg → Status {status[i]}')
    log(f'Status bestimmt nach {time.time() - t0:.0f} s')
    if args.nur_formen:
        with open(os.path.join(args.arbeit, 'formen.pkl'), 'wb') as f:
            pickle.dump({'lage': lage, 'formen': formen, 'status': status}, f)
        return
    for i, f in sonderwege(args, netz, roads, lage, masken, log).items():
        formen[i] = f
        status[i] = f['status']
    log(f'Fähren und Flüge fertig nach {time.time() - t0:.0f} s')
    hoehen_rechnen(netz, roads, formen, masken, gel, log)
    statistik(netz, roads, formen, status, os.path.join(args.arbeit, 'statistik.json'), log)
    with open(os.path.join(args.arbeit, 'formen.pkl'), 'wb') as f:
        pickle.dump({'lage': lage, 'formen': formen, 'status': status}, f)
    schreiben(netz, roads, lage, formen, status, log)
    log(f'Fertig in {time.time() - t0:.0f} s')


if __name__ == '__main__':
    main()
