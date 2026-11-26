# Knoten auf die abgeglichenen Linien legen und Straßenenden bis zu ihrem Knoten führen.
#
# Regeln (Auftrag K1): Anschlussstellen, Kreuze und Durchgangspunkte rücken auf die echte Linie (Lotfußpunkt, die
# Reihenfolge entlang der Straße bleibt); die Zubringer ihrer Orte ändern sich um die Änderung der Luftlinie × 1,2
# und bleiben ein kurzer, glaubhafter Weg (siehe zubringer_roh).
# Ortsknoten (Art „ort“) bleiben, wo der Ort ist: Ziele liegen immer in Orten, und die Spielregeln (graph.js,
# trip.js) kennen den Ort eines Knotens nur, solange sein Zubringer unter ORT_KM liegt (Hauptort an der Ausfahrt,
# Ortsdurchfahrt am Ende einer Landstraße). Die Straßen führen per Beule oder Anschlussbogen in den Ort. Auch ein
# anderer Knoten, an dem ein Ort liegt, rückt höchstens so weit, dass dieser Ort unter ORT_KM bleibt. Fährhäfen
# bleiben an der Küste. Ein Knoten, an dem sich mehrere Straßen treffen, die sich in Wirklichkeit nicht berühren
# (Kreuze, die von Hand ungefähr gesetzt sind), liegt dort, wo die Straßen sich am wenigsten verbiegen müssen.
import math

import form
import geo

# graph.js/trip.js: ein Ort mit Zubringer unter so viel km liegt am Knoten (Hauptort, Ortsdurchfahrt)
ORT_KM = 1.5
ZUBRINGER = 1.2  # Zubringer-km ändern sich um die Änderung der Luftlinie Ort → Knoten × 1,2 …
ZUBRINGER_PLUS_KM = 1.0  # … und liegen zwischen der Luftlinie und Luftlinie × ZUBRINGER + so viel km
# Gewicht der Ausbeulung je Eintrag: (Straßenart, Durchgang?)
GEWICHT = {('ab', True): 1.0, ('land', True): 0.35, ('ab', False): 0.15, ('land', False): 0.08}
# So weit (km) darf ein Knoten, an dem mehrere Straßen hängen, ohne Strafe von seiner Handlage abrücken …
FREI_KM = {'as': 3.0, 'kreuz': 3.0, 'via': 5.0}
STRAFE_HAND = 1.0  # … darüber kostet jeder km² so viel wie ein km^1,5 Ausbeulung einer Autobahn
KREUZ_UMKREIS = 15.0  # km: echte Kreuzungen der Linien so weit um die Handlage zählen als Kandidaten
ENDE_NE_KM = 1.0  # endet eine Straße weiter als das von ihrem Knoten, wird sie über NE dorthin geroutet


def fenster(a, j):
    """Bogenlängenfenster des j-ten Knotens eines Abschnitts: zwischen den Schichtwechseln der Nachbarn."""
    s, w = a['s'], a['wechsel']
    return (s[w[j - 1]] if j > 0 else 0.0), (s[w[j + 1]] if j + 1 < len(w) else s[-1])


def zubringer_roh(hand_km, ort, alt, neu):
    """Zubringer-km (ungerundet) eines Orts (lat, lon), dessen Knoten von alt nach neu rückt (oder bleibt): der
    Handwert ändert sich um die Änderung der Luftlinie × ZUBRINGER, in beide Richtungen. Ein Ort am Knoten (Handwert
    unter ORT_KM: Hauptort, Ortsdurchfahrt) bleibt es: sein Zubringer endet am Ortsrand, die Ortsdurchfahrt folgt,
    und ort_halten hält ihn unter ORT_KM. Jeder andere Zubringer liegt zwischen der Luftlinie und Luftlinie ×
    ZUBRINGER + ZUBRINGER_PLUS_KM (rückte der Knoten näher, blieb er sonst lang: Nürburg 12 km für 4,4 km Luftlinie)."""
    s_alt, s_neu = geo.hav(*ort, *alt), geo.hav(*ort, *neu)
    z = hand_km + ZUBRINGER * (s_neu - s_alt)
    if hand_km < ORT_KM:
        return max(0.0, z)
    return min(max(z, s_neu), ZUBRINGER * s_neu + ZUBRINGER_PLUS_KM)


def ort_halten(netz, nid, P):
    """Liegt am Knoten ein Ort (Zubringer unter ORT_KM), rückt der Knoten von seiner Handlage höchstens so weit in
    Richtung P, dass der Zubringer des Orts danach höchstens ORT_KM − 0,1 beträgt (Luft für das Runden)."""
    n = netz['nodes'][nid]
    H = (n['lat0'], n['lon0'])
    nah = [((netz['places'][p]['lat'], netz['places'][p]['lon']), d) for p, d in n['places0'] if d < ORT_KM]

    def bei(t):
        return (H[0] + t * (P[0] - H[0]), H[1] + t * (P[1] - H[1]))

    def haelt(X):
        return all(zubringer_roh(d, ort, H, X) <= ORT_KM - 0.1 for ort, d in nah)

    if haelt(P):
        return P
    lo, hi = 0.0, 1.0
    for _ in range(30):
        m = 0.5 * (lo + hi)
        if haelt(bei(m)):
            lo = m
        else:
            hi = m
    return bei(lo)


def _schnitt(p, q, u, v):
    """Schnittpunkt der Strecken p–q und u–v in der Ebene oder None."""
    d = (q[0] - p[0]) * (v[1] - u[1]) - (q[1] - p[1]) * (v[0] - u[0])
    if abs(d) < 1e-12:
        return None
    t = ((u[0] - p[0]) * (v[1] - u[1]) - (u[1] - p[1]) * (v[0] - u[0])) / d
    w = ((u[0] - p[0]) * (q[1] - p[1]) - (u[1] - p[1]) * (q[0] - p[0])) / d
    if 0 <= t <= 1 and 0 <= w <= 1:
        return (p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1]))
    return None


def kreuzungen(eintraege, zentrum, r_km=KREUZ_UMKREIS):
    """Schnitt- und Berührpunkte der Wege je zweier Einträge verschiedener Straßen (im Fenster zwischen den
    Nachbarknoten, mit Abstand zu dessen Rändern, höchstens r_km vom zentrum)."""
    teile = []
    for x in eintraege:
        rand = min(1.5, 0.2 * (x['bis'] - x['von']))
        teile.append(form.stueck(x['a']['pts'], x['von'] + rand, x['bis'] - rand, x['a']['s']))
    e = geo.Eben(*zentrum)
    out = []
    for i in range(len(teile)):
        for j in range(i + 1, len(teile)):
            if eintraege[i]['road'] == eintraege[j]['road']:
                continue
            A = [e.xy(*p) for p in teile[i]]
            B = [e.xy(*p) for p in teile[j]]
            for p, q in zip(A, A[1:]):
                if min(math.hypot(*p), math.hypot(*q)) > r_km + 5:
                    continue
                for u, v in zip(B, B[1:]):
                    P = _schnitt(p, q, u, v)
                    if P and math.hypot(*P) <= r_km:
                        out.append(e.ll(*P))
            for P in A:
                if math.hypot(*P) <= r_km and geo.abstand_polylinie(*e.ll(*P), teile[j]) < 0.1:
                    out.append(e.ll(*P))
    return out


def eintraege_sammeln(netz, roads, routen):
    """Je Knoten die Wege, die ihn berühren: Straße, Abschnitt, Fenster, Durchgang?, Lotfußpunkt der Handlage."""
    N = netz['nodes']
    out = {}
    for rid in sorted(routen):
        R = routen[rid]
        r = roads[rid]
        last = len(r['nodes']) - 1
        for a in R['abschnitte']:
            for j in range(a['i1'] - a['i0'] + 1):
                i = a['i0'] + j
                nid = r['nodes'][i]
                von, bis = fenster(a, j)
                _, d, q = form.lot(a['pts'], N[nid]['lat0'], N[nid]['lon0'], a['s'], von, bis)
                out.setdefault(nid, []).append({
                    'road': rid, 'art': r['kind'], 'a': a, 'q': q, 'd': d, 'i': i,
                    'durch': 0 < i < last, 'von': von, 'bis': bis,
                })
    return out


def _abstand(x, P):
    return form.lot(x['a']['pts'], P[0], P[1], x['a']['s'], x['von'], x['bis'])[1]


def legen(netz, roads, routen, log):
    """Neue Lage aller Straßenknoten. Ergebnis: {Knoten: (lat, lon)} auf 1e-4° gerundet."""
    N = netz['nodes']
    eintraege = eintraege_sammeln(netz, roads, routen)
    # Fährhäfen, durch die keine Autobahn hindurchführt, bleiben an der Küste: dort legt die Fähre ab
    haefen = {nid for r in netz['roads'] if r['kind'] == 'faehre' for nid in r['nodes']}
    haefen -= {nid for r in netz['roads'] if r['kind'] == 'ab' for nid in r['nodes'][1:-1]}
    lage = {}
    gewicht = {}
    fest = set()  # Knoten an ihrer Handlage: Fährhäfen und Orte
    zaehler = {'ort': 0, 'hafen': 0, 'fuss': 0, 'hub': 0, 'gehalten': 0}
    for nid in sorted(eintraege):
        E = eintraege[nid]
        n = N[nid]
        H = (n['lat0'], n['lon0'])
        # "hand": Knoten, deren echte Lage Natural Earth nicht kennt (dort fehlt eine Straße, etwa die A661 oder die
        # Flughafenbrücke der A44): eine Kreuzung anderer Linien in der Nähe zöge sie sonst kilometerweit an die falsche Stelle
        if nid in haefen or n['kind'] == 'ort' or n.get('hand'):
            lage[nid] = H
            fest.add(nid)
            zaehler['hafen' if nid in haefen else 'ort'] += 1
            continue
        strassen = {x['road'] for x in E}
        if len(strassen) == 1:
            # Eine Straße: Lotfußpunkt (bei mehreren Abschnitten der Durchgang, sonst der nächste)
            x = min(E, key=lambda x: (not x['durch'], x['d']))
            lage[nid] = ort_halten(netz, nid, x['q'])
            zaehler['gehalten'] += lage[nid] != x['q']
            gewicht[nid] = GEWICHT[(x['art'], x['durch'])]
            zaehler['fuss'] += 1
            continue
        gew = [GEWICHT[(x['art'], x['durch'])] for x in E]
        frei = FREI_KM[n['kind']]

        def kosten(P):
            c = sum(w * _abstand(x, P) ** 1.5 for w, x in zip(gew, E))
            return c + STRAFE_HAND * max(0.0, geo.hav(*P, *H) - frei) ** 2

        # Gewichtetes Mittel der Lotfußpunkte, abwechselnd neu gelotet
        X = (sum(w * x['q'][0] for w, x in zip(gew, E)) / sum(gew), sum(w * x['q'][1] for w, x in zip(gew, E)) / sum(gew))
        for _ in range(20):
            qs = [form.lot(x['a']['pts'], X[0], X[1], x['a']['s'], x['von'], x['bis'])[2] for x in E]
            Y = (sum(w * q[0] for w, q in zip(gew, qs)) / sum(gew), sum(w * q[1] for w, q in zip(gew, qs)) / sum(gew))
            fertig = geo.hav(*X, *Y) < 0.001
            X = Y
            if fertig:
                break
        kandidaten = [H, X] + [x['q'] for x in E] + kreuzungen(E, H)
        P = min(kandidaten, key=lambda P: (round(kosten(P), 6), geo.hav(*P, *H)))
        lage[nid] = ort_halten(netz, nid, P)
        zaehler['gehalten'] += lage[nid] != P
        P = lage[nid]
        gewicht[nid] = sum(gew)
        zaehler['hub'] += 1
        weg = geo.hav(*H, *P)
        abw = ', '.join(f'{x["road"]} {_abstand(x, P):.1f}' for x in E if _abstand(x, P) > 0.5)
        log(f'  Knoten {nid} ({n["kind"]}, {len(strassen)} Straßen): {weg:.1f} km von der Handlage'
            + (f'; Ausbeulung km: {abw}' if abw else ''))
    # Nachbarknoten einer Straße dürfen nicht zusammenfallen (eine Kreuzung kann beide anziehen): der leichtere
    # bewegliche Knoten geht auf den Lotfußpunkt seines wichtigsten Wegs zurück. Liegen sie dann noch auf einem
    # Punkt (beide fangen dasselbe Linienende, Natural Earth führt die Straße nicht zwischen ihnen), bleibt er an
    # seiner Handlage, und die Etappe bekommt einen Ersatzverlauf.
    def zusammen(u, v, km):
        return geo.hav(*lage[u], *lage[v]) < km <= geo.hav(N[u]['lat0'], N[u]['lon0'], N[v]['lat0'], N[v]['lon0'])

    for r in netz['roads']:
        for u, v in zip(r['nodes'], r['nodes'][1:]):
            beweglich = [x for x in (u, v) if x not in fest]
            if u in lage and v in lage and beweglich and zusammen(u, v, 1.0):
                k = min(beweglich, key=lambda x: (gewicht.get(x, 0.0), x))
                x = min(eintraege[k], key=lambda x: (-GEWICHT[(x['art'], x['durch'])], x['d']))
                lage[k] = ort_halten(netz, k, x['q'])
                if zusammen(u, v, 0.2):
                    lage[k] = (N[k]['lat0'], N[k]['lon0'])
                    log(f'  Knoten {k} fiele mit {v if k == u else u} zusammen → bleibt an der Handlage')
                else:
                    log(f'  Knoten {k} fiele mit {v if k == u else u} zusammen → Lotfußpunkt auf {x["road"]}')
    lage = {k: (round(v[0], 4), round(v[1], 4)) for k, v in lage.items()}
    log(f'Knoten gelegt: {len(lage)} (Orte {zaehler["ort"]}, Fährhäfen {zaehler["hafen"]}, '
        f'Lotfußpunkte {zaehler["fuss"]}, Knoten mehrerer Straßen {zaehler["hub"]}, davon für ihren Ort '
        f'zurückgehalten {zaehler["gehalten"]})')
    return lage


def enden_verlaengern(netz, roads, routen, router, lage, log):
    """Endet eine Straße (oder ein Abschnitt vor einer Lücke) weiter als ENDE_NE_KM von ihrem gelegten Knoten,
    wird das Ende über das NE-Netz bis in seine Nähe geroutet (vom Lotfußpunkt aus); gelingt das nicht glaubhaft,
    schließt später ein Anschlussbogen an. Eine Autobahn, die in einem Ort endet, bekommt immer den Anschlussbogen:
    NE führt sie sonst über Stadtringe und Stadtstraßen in die Ortsmitte (A9 in München über den Mittleren Ring)."""
    N = netz['nodes']
    n_ok = n_bogen = 0
    for rid in sorted(routen):
        r = roads[rid]
        for a in routen[rid]['abschnitte']:
            J = a['i1'] - a['i0']
            for j, am_ende in ((J, True), (0, False)):
                nid = r['nodes'][a['i0'] + j]
                P = lage[nid]
                von, bis = fenster(a, j)
                x, d, q = form.lot(a['pts'], P[0], P[1], a['s'], von, bis)
                if d <= ENDE_NE_KM:
                    continue
                if r['kind'] == 'ab' and N[nid]['kind'] == 'ort':
                    n_bogen += 1
                    log(f'  {rid}: Ende {nid} {d:.1f} km neben dem Weg, Autobahn in einen Ort → Anschlussbogen')
                    continue
                L = geo.hav(*q, *P)
                ziele = [(q[0], q[1], 0.6, 1.0), (P[0], P[1], 2.0, 2.0)] if am_ende else \
                    [(P[0], P[1], 2.0, 2.0), (q[0], q[1], 0.6, 1.0)]
                weg = None
                for stufe in (0, 1):
                    res, _ = router.route(ziele, [[ziele[0][:2], ziele[1][:2]]], r['kind'], routen[rid]['nummern'],
                                          stufe, routen[rid]['meiden'])
                    if res:
                        des = res[0]
                        g = router.g
                        roh = [(g.lat[k], g.lon[k]) for k in [router.fuss(des[0])] + [router.kopf(dd) for dd in des]]
                        roh, _ = form.bereinigen(roh, [0, len(roh) - 1])
                        m, k = form.pruefen([q] + roh + [P] if am_ende else [P] + roh + [q], r['kind'])
                        if not m and k['km'] <= 1.5 * L + 1.0:
                            weg = roh
                            break
                if weg is None:
                    n_bogen += 1
                    log(f'  {rid}: Ende {nid} {d:.1f} km neben dem Weg, kein glaubhafter NE-Weg → Anschlussbogen')
                    continue
                pts, s = a['pts'], a['s']
                if am_ende:
                    neu = form.stueck(pts, 0.0, x, s) + weg
                    k0 = None
                else:
                    neu = weg + form.stueck(pts, x, s[-1], s)
                    k0 = len(weg)
                # Schichtwechsel-Indizes nachführen: Enden auf die neuen Enden, innen um die vorangestellten Punkte
                w = list(a['wechsel'])
                if am_ende:
                    vorher = sum(1 for si in s if si < x - 1e-6) + 1
                    w = [min(v, vorher - 1) for v in w]
                    w[-1] = len(neu) - 1
                else:
                    weg_raus = sum(1 for si in s if si <= x + 1e-6)
                    w = [max(0, v - weg_raus) + k0 + 1 for v in w]
                    w[0] = 0
                a['pts'] = neu
                a['wechsel'] = w
                a['s'] = form.kum(neu)
                n_ok += 1
                log(f'  {rid}: Ende {nid} lag {d:.1f} km neben dem Weg → {form.kum(weg)[-1]:.1f} km NE-Weg angefügt')
    log(f'Straßenenden über NE verlängert: {n_ok}, mit Anschlussbogen: {n_bogen}')
