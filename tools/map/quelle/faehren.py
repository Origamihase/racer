# Fährlinien: eine Natural-Earth-Fährroute, wo sie zu unseren Häfen passt, sonst ein glatter Weg übers Wasser
# (kürzester Weg auf einem Wasserraster mit Abstand zur Küste, gestrafft, geglättet und gegen die Landflächen
# geprüft).
import heapq
import math

import numpy as np

import form
from geo import Eben, hav

HAFEN_KM = 15.0  # so weit darf eine Fährroute von unserem Hafenknoten entfernt beginnen oder enden
ZUFAHRT_KM = 25.0  # so weit darf das erste befahrbare Wasser vom Hafenknoten liegen (Lübeck an der Trave)
ZUFAHRT_KOSTEN = 4.0  # die Zufahrt über Land zählt je km vierfach: der Weg legt ab, wo das Wasser nah ist
KUESTE_KM = 3.0  # näher als so an der Küste wird die Fahrt teurer …
KUESTE_KOSTEN = 4.0  # … an der Küste selbst fünffach
RUND_KM = 6.0  # weiteste Eckenabschnitte beim Runden der Kurswechsel
FEIN_BIS_KM = 100.0  # kürzere Fahrten ganz auf dem feinen Raster
FEIN_KM = 40.0  # Umkreis der Häfen, in dem lange Fahrten fein nachgesucht werden
ANSCHLUSS_KM = 1.0  # Umkreis des Anschlusspunkts auf dem groben Weg


def ne_faehre(A, B, linien):
    """Teilstück der am besten passenden NE-Fährlinie zwischen den Punkten nächst A und nächst B, in Richtung
    A → B, oder None. Ergebnis: (Punkte, Abstand A, Abstand B)."""
    S = hav(*A, *B)
    best = None
    for L in linien:
        s = form.kum(L)
        sa, da, _ = form.lot(L, A[0], A[1], s)
        sb, db, _ = form.lot(L, B[0], B[1], s)
        if da > HAFEN_KM or db > HAFEN_KM or abs(sb - sa) < 0.6 * S:
            continue
        teil = form.stueck(L, min(sa, sb), max(sa, sb), s)
        if sa > sb:
            teil.reverse()
        if best is None or da + db < best[1] + best[2]:
            best = (teil, da, db)
    return best


def wasserweg(A, B, ausschnitt):
    """Glatter Weg von A nach B übers Wasser. ausschnitt(lat0, lat1, lon0, lon1, px_pro_grad) liefert die
    Landmaske. Ergebnis: Punkte [(lat, lon)] (A und B eingeschlossen) oder None.
    Kurze Fahrten werden auf einem 0,4-km-Raster gesucht. Lange erst auf einem 1-km-Raster; im Umkreis FEIN_KM der
    Häfen wird der Weg dann fein neu gesucht, damit er durch Schären und Förden das Fahrwasser trifft."""
    if hav(*A, *B) < FEIN_BIS_KM:
        return _wasserweg(A, B, ausschnitt, 0.4, ZUFAHRT_KM, ZUFAHRT_KM)
    grob = _wasserweg(A, B, ausschnitt, 1.0, ZUFAHRT_KM, ZUFAHRT_KM)
    if grob is None:
        return None
    ka = next((k for k, p in enumerate(grob) if hav(*A, *p) >= FEIN_KM), len(grob) - 1)
    kb = max((k for k, p in enumerate(grob) if hav(*B, *p) >= FEIN_KM), default=0)
    if ka >= kb:
        return grob
    anfang = _wasserweg(A, grob[ka], ausschnitt, 0.4, ZUFAHRT_KM, ANSCHLUSS_KM) or grob[:ka + 1]
    ende = _wasserweg(grob[kb], B, ausschnitt, 0.4, ANSCHLUSS_KM, ZUFAHRT_KM) or grob[kb:]
    # die Anschlüsse liegen auf offener See: dort dürfen die Knicke ohne Landprüfung gerundet werden
    return form.abrunden(anfang + grob[ka + 1:kb] + ende, grenze=15.0, t_max=2.0)


def _wasserweg(A, B, ausschnitt, zelle, zufahrt_a, zufahrt_b):
    """Weg von A nach B auf einem Wasserraster mit Zellen von zelle km; das erste (letzte) befahrbare Wasser darf
    bis zufahrt_a (zufahrt_b) km vom Endpunkt liegen."""
    S = hav(*A, *B)
    rand = max(25.0, 0.4 * S)
    e = Eben((A[0] + B[0]) / 2, (A[1] + B[1]) / 2)
    ax, ay = e.xy(*A)
    bx, by = e.xy(*B)
    x0, y0 = min(ax, bx) - rand, min(ay, by) - rand
    W = int((max(ax, bx) + rand - x0) / zelle) + 1
    H = int((max(ay, by) + rand - y0) / zelle) + 1
    ecken = [e.ll(x0, y0), e.ll(x0 + W * zelle, y0 + H * zelle), e.ll(x0, y0 + H * zelle), e.ll(x0 + W * zelle, y0)]
    lat0 = min(p[0] for p in ecken) - 0.1
    lat1 = max(p[0] for p in ecken) + 0.1
    lon0 = min(p[1] for p in ecken) - 0.1
    lon1 = max(p[1] for p in ecken) + 0.1
    maske = ausschnitt(lat0, lat1, lon0, lon1, max(40, int(2 * 111.0 / zelle)))
    gx = x0 + (np.arange(W) + 0.5) * zelle
    gy = y0 + (np.arange(H) + 0.5) * zelle
    X, Y = np.meshgrid(gx, gy)
    # Befahrbar ist eine Zelle, wenn an einer von fünf Stellen (Mitte und vier Punkte zu den Ecken hin) Wasser
    # ist: so bleiben Sunde und Mündungen offen, die schmaler als eine Zelle sind (Drøbaksund vor Oslo, die
    # Stockholmer Schären, der Mersey).
    wasser = np.zeros(X.shape, dtype=bool)
    offen = np.ones(X.shape, dtype=bool)
    for ox, oy in ((0.0, 0.0), (-0.3, -0.3), (0.3, -0.3), (-0.3, 0.3), (0.3, 0.3)):
        la, lo = e.ll(X + ox * zelle, Y + oy * zelle)
        w = ~maske.land_np(la, lo)
        wasser |= w
        offen &= w
    # Abstand zur Küste in Zellen (0 = Zelle berührt Land, höchstens K): der Weg hält Abstand, solange Platz ist,
    # und fährt in Sunden in der Mitte – wie ein Schiff im Fahrwasser; sonst klebte er an jedem Kap
    K = max(2, int(round(KUESTE_KM / zelle)))
    abstand = np.full(X.shape, K, dtype=np.int16)
    zone = ~offen
    for k in range(K):
        abstand[zone & (abstand == K)] = k
        breiter = zone.copy()
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                breiter |= np.roll(np.roll(zone, dy, axis=0), dx, axis=1)
        zone = breiter
    kosten = 1.0 + KUESTE_KOSTEN * (1.0 - abstand / K) ** 2

    def zufahrt(px, py, umkreis):
        """Wasserzellen im Umkreis des Hafens mit den Kosten der Zufahrt (in Zellenlängen)."""
        d = np.hypot(X - px, Y - py)
        rr, cc = np.nonzero(wasser & (d <= umkreis))
        return {int(r) * W + int(c): ZUFAHRT_KOSTEN * float(d[r, c]) / zelle for r, c in zip(rr, cc)}

    starts = zufahrt(ax, ay, zufahrt_a)
    ziele = zufahrt(bx, by, zufahrt_b)
    if not starts or not ziele:
        return None
    weg = _astern(np.where(wasser, kosten, 0.0).ravel().tolist(), W, starts, ziele,
                  ((bx - x0) / zelle - 0.5, (by - y0) / zelle - 0.5), zufahrt_b / zelle)
    if weg is None:
        return None
    P = [(gx[k % W], gy[k // W]) for k in weg]
    frei_bis = [int(abstand.flat[k]) for k in weg]
    # Nicht über die Häfen hinaus: der Weg beginnt am letzten Punkt nächst A und endet am ersten Punkt nächst B
    # (die nächste Wasserzelle eines Inselhafens kann hinter dem Hafen liegen, dann käme eine Kehre)
    da = [math.hypot(x - ax, y - ay) for x, y in P]
    db = [math.hypot(x - bx, y - by) for x, y in P]
    i0 = max(k for k in range(len(P)) if da[k] <= min(da) + 0.5 * zelle)
    i1 = min(k for k in range(i0, len(P)) if db[k] <= min(db[i0:]) + 0.5 * zelle)
    P = P[i0:i1 + 1]
    frei_bis = frei_bis[i0:i1 + 1]

    def zurueck(a, b, c):
        return (b[0] - a[0]) * (c[0] - b[0]) + (b[1] - a[1]) * (c[1] - b[1]) < 0

    # liegt die erste (letzte) Wasserzelle hinter dem Hafen, führte der Weg zurück: sie entfällt
    while len(P) > 2 and zurueck((ax, ay), P[0], P[1]):
        P = P[1:]
        frei_bis = frei_bis[1:]
    while len(P) > 2 and zurueck(P[-2], P[-1], (bx, by)):
        P = P[:-1]
        frei_bis = frei_bis[:-1]

    def proben(p, q):
        k = max(2, int(math.hypot(q[0] - p[0], q[1] - p[1]) / (zelle * 0.4)))
        t = np.arange(k + 1) / k
        return p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t

    def an_land(pts):
        """Anzahl der Proben (alle 0,4 Zellen) auf einem Linienzug, die an Land liegen."""
        n = 0
        for p, q in zip(pts, pts[1:]):
            la, lo = e.ll(*proben(p, q))
            n += int(maske.land_np(la, lo).sum())
        return n

    frei_bis = np.array(frei_bis)

    def zu_nah(i, j):
        """Kommt die Strecke P[i]–P[j] der Küste deutlich näher als der Zellenweg an der entsprechenden Stelle?"""
        xs, ys = proben(P[i], P[j])
        c = np.clip(((xs - x0) / zelle).astype(np.int64), 0, W - 1)
        r = np.clip(((ys - y0) / zelle).astype(np.int64), 0, H - 1)
        k = i + np.rint(np.linspace(0.0, j - i, len(xs))).astype(np.int64)
        return bool((abstand[r, c] < np.minimum(K, frei_bis[k]) - 1).any())

    # Straffen: vom aktuellen Punkt so weit wie möglich geradeaus (höchstens 400 km je Blick), ohne Land und
    # ohne der Küste viel näher zu kommen als der Zellenweg; in engen Sunden bleibt der Zellenweg
    straff = [P[0]]
    i = 0
    while i < len(P) - 1:
        j = min(len(P) - 1, i + int(400 / zelle))
        while j > i + 1 and (zu_nah(i, j) or an_land([P[i], P[j]])):
            j -= 1
        straff.append(P[j])
        i = j
    # Treppen aus Rasterschritten (enge Fahrwasser, in denen nichts gestrafft werden kann) zu Schrägen glätten:
    # Punkte zwischen kurzen Abschnitten rücken zur Mitte ihrer Nachbarn (je Durchgang höchstens eine halbe Zelle)
    for _ in range(3):
        Q = list(straff)
        for k in range(1, len(straff) - 1):
            a, b, c = straff[k - 1], straff[k], straff[k + 1]
            if max(math.hypot(b[0] - a[0], b[1] - a[1]), math.hypot(c[0] - b[0], c[1] - b[1])) <= 2.5 * zelle:
                Q[k] = ((a[0] + 2 * b[0] + c[0]) / 4, (a[1] + 2 * b[1] + c[1]) / 4)
        straff = Q
    weg = ecken_runden([(ax, ay)] + straff + [(bx, by)], an_land)
    return [A] + [e.ll(x, y) for x, y in weg[1:-1]] + [B]


def ecken_runden(P, an_land, runden=5):
    """Schneidet die Ecken eines Linienzugs wiederholt ab (Chaikin, Schnitt höchstens RUND_KM vom Eckpunkt), bis
    die Wendungen weite Bögen sind. Ein Schnitt, der mehr Land berührt als die Ecke selbst, wird kürzer versucht
    und notfalls ausgelassen. Anfangs- und Endpunkt bleiben."""
    for _ in range(runden):
        out = [P[0]]
        for a, b, c in zip(P, P[1:], P[2:]):
            la = math.hypot(a[0] - b[0], a[1] - b[1])
            lc = math.hypot(c[0] - b[0], c[1] - b[1])
            d = min(0.25 * la, 0.25 * lc, RUND_KM)
            neu = [b]
            while d > 0.02 and la > 1e-9 and lc > 1e-9:
                q = (b[0] + (a[0] - b[0]) * d / la, b[1] + (a[1] - b[1]) * d / la)
                r = (b[0] + (c[0] - b[0]) * d / lc, b[1] + (c[1] - b[1]) * d / lc)
                if an_land([q, r]) <= an_land([q, b, r]):
                    neu = [q, r]
                    break
                d /= 3
            out.extend(neu)
        out.append(P[-1])
        P = out
    return P


def _astern(kosten, W, starts, ziele, ziel_xy, ziel_r):
    """A* auf dem Wasserraster (flache Liste der Kosten je Zelle, 0 = nicht befahrbar, Index r·W + c) von allen
    Startzellen (mit Anfangskosten) zu einer der Zielzellen (mit Restkosten bis zum Hafen). Ergebnis: Zellindizes
    vom Start bis zum Ziel oder None."""
    n = len(kosten)
    zx, zy = ziel_xy
    schritte = [(-1, 0, 1.0), (1, 0, 1.0), (0, -1, 1.0), (0, 1, 1.0),
                (-1, -1, math.sqrt(2)), (-1, 1, math.sqrt(2)), (1, -1, math.sqrt(2)), (1, 1, math.sqrt(2))]

    def h(k):
        # zulässig: bis zur nächsten Zielzelle sind es mindestens Abstand zum Hafen − Umkreis
        return max(0.0, math.hypot(k % W - zx, k // W - zy) - ziel_r)

    dist = {}
    vor = {}
    heap = []
    for k, g in starts.items():
        dist[k] = g
        vor[k] = -1
        heapq.heappush(heap, (g + h(k), g, k))
    ende = -1  # Zielknoten außerhalb des Rasters: erreicht über eine Zielzelle plus deren Restkosten
    while heap:
        _, g, u = heapq.heappop(heap)
        if u == ende:
            weg = []
            u = vor[ende]
            while u >= 0:
                weg.append(u)
                u = vor[u]
            return weg[::-1]
        if g > dist[u]:
            continue
        if u in ziele:
            ng = g + ziele[u]
            if ng < dist.get(ende, math.inf):
                dist[ende] = ng
                vor[ende] = u
                heapq.heappush(heap, (ng, ng, ende))
        r, c = divmod(u, W)
        for dr, dc, l in schritte:
            rr, cc = r + dr, c + dc
            if rr < 0 or cc < 0 or cc >= W:
                continue
            v = rr * W + cc
            if v >= n or not kosten[v]:
                continue
            ng = g + l * kosten[v]
            if ng < dist.get(v, math.inf):
                dist[v] = ng
                vor[v] = u
                heapq.heappush(heap, (ng + h(v), ng, v))
    return None
