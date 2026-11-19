# Talsuche: Natural Earth 1:10m zeichnet Straßen generalisiert (Stützpunkte oft Kilometer auseinander). Im
# Gebirge liegt die Linie dann bis zu 4 km neben dem Tal, gerade Sehnen schneiden Bergrücken ab, und das
# Längsprofil führte über Gipfel. Die Suche legt solche Stücke neu: kürzester Weg auf einem Raster im Korridor um
# die Linie, Kosten = Länge × (1 + Abstand² von der Linie) + Steigung² – so folgt der Weg dem Talboden und quert
# Kämme im Sattel, bleibt aber in der Nähe der Linie. Flache Stücke bleiben, wie sie sind. Dieselbe Suche lenkt
# Ersatzverläufe in die Täler (dann mit festen Enden).
import heapq
import math

import numpy as np

import geo

SCHRITT = 0.2  # km zwischen den Stationen der Reliefprüfung
ZELLE = 0.15  # km Rasterweite der Suche (Höhenmodell: 0,2–0,4 km je Pixel)
RELIEF = 120.0  # m Höhenspanne quer zur Linie, ab der eine Station als bergig gilt
RAND_KM = 2.0  # bergige Stücke werden um so viel verlängert (dort beginnt und endet die Suche auf der Linie)
LUECKE_KM = 5.0  # bergige Stücke mit weniger Abstand werden zusammengelegt
LAENGE = 1.0  # Kosten je km Weg
LAGE = 0.5  # Kosten je km Weg und km² Abstand von der Linie
STEIGUNG = 800.0  # Kosten je km Weg für Steigung² (Anteil: 0,05 = 5 %)
SEE = 40.0  # Kosten je km über einem See (Höhenmodell dort vollkommen eben), wenn die Linie nicht dort liegt
GLAETTEN_KM = {'ab': 0.5, 'land': 0.35}  # Gauß-σ für den gefundenen Weg (Rasterstufen weg, Kurvenradien)
FREI_ENDE_KM = 1.5  # offene Enden (Abschnittsenden, dort legen sich die Knoten danach) dürfen so weit wandern
MAX_UMWEG = 1.25  # der neue Weg darf höchstens so viel länger sein als das ersetzte Stück (+1 km)
MAX_DREHUNG = 60.0  # Grad zwischen zwei 0,2-km-Stücken: schärfer = Rasterfehler, das Stück bleibt alt


def _bogen(la, lo):
    d = np.hypot(np.diff(la) * 111.195, np.diff(lo) * 111.195 * np.cos(np.radians(0.5 * (la[1:] + la[:-1]))))
    return np.concatenate([[0.0], np.cumsum(d)])


def _gleichmaessig(la, lo, schritt):
    s = _bogen(la, lo)
    n = max(2, int(math.ceil(s[-1] / schritt)) + 1)
    si = np.linspace(0.0, s[-1], n)
    return si, np.interp(si, s, la), np.interp(si, s, lo)


def bergige_stuecke(la, lo, gel, grenze, tunnel):
    """Bogenlängen-Paare (km) der Stücke, deren Querprofil im Korridor mehr als RELIEF Meter Spanne hat
    (verlängert, zusammengelegt, an Tunneln getrennt)."""
    si, sla, slo = _gleichmaessig(la, lo, SCHRITT)
    n = len(si)
    k = max(1, int(round(0.8 / SCHRITT)))
    i0 = np.clip(np.arange(n) - k, 0, n - 1)
    i1 = np.clip(np.arange(n) + k, 0, n - 1)
    dy = (sla[i1] - sla[i0]) * 111.195
    dx = (slo[i1] - slo[i0]) * 111.195 * np.cos(np.radians(sla))
    norm = np.maximum(np.hypot(dx, dy), 1e-9)
    nx, ny = -dy / norm, dx / norm
    g = grenze(sla, slo)
    f = np.linspace(-1.0, 1.0, 9)
    LA = sla[:, None] + (f[None, :] * g[:, None] * ny[:, None]) / 111.195
    LO = slo[:, None] + (f[None, :] * g[:, None] * nx[:, None]) / (111.195 * np.cos(np.radians(sla[:, None])))
    Z, _ = gel.hoehen_np(LA.ravel(), LO.ravel())
    Z = Z.reshape(n, len(f))
    berg = (Z.max(axis=1) - Z.min(axis=1)) >= RELIEF
    stuecke = []
    i = 0
    while i < n:
        if not berg[i]:
            i += 1
            continue
        j = i
        while j + 1 < n and berg[j + 1]:
            j += 1
        stuecke.append([max(0.0, si[i] - RAND_KM), min(si[-1], si[j] + RAND_KM)])
        i = j + 1
    zusammen = []
    for st in stuecke:
        if zusammen and st[0] - zusammen[-1][1] < LUECKE_KM:
            zusammen[-1][1] = st[1]
        else:
            zusammen.append(st)
    # Tunnel trennen die Stücke (im Tunnel bleibt die Linie, die Stücke enden an den Portalen)
    out = []
    for a, b in zusammen:
        for x, y in sorted((x, y) for x, y in tunnel if a < y and x < b):
            if x - a > 1.0:
                out.append((a, x))
            a = max(a, y)
        if b - a > 1.0:
            out.append((a, b))
    return out


def _abstand_raster(X, Y, px, py, C, zelle=ZELLE):
    """Abstand (km) jeder Rasterzelle von der Polylinie (px, py); nur im Umkreis C berechnet, sonst unendlich."""
    D = np.full(X.shape, np.inf)
    h, w = X.shape
    x0, y0 = X[0, 0], Y[0, 0]
    for k in range(len(px) - 1):
        ax, ay, bx, by = px[k], py[k], px[k + 1], py[k + 1]
        c0 = max(0, int((min(ax, bx) - C - x0) / zelle))
        c1 = min(w, int((max(ax, bx) + C - x0) / zelle) + 2)
        r0 = max(0, int((min(ay, by) - C - y0) / zelle))
        r1 = min(h, int((max(ay, by) + C - y0) / zelle) + 2)
        if c0 >= c1 or r0 >= r1:
            continue
        qx = X[r0:r1, c0:c1]
        qy = Y[r0:r1, c0:c1]
        dx, dy = bx - ax, by - ay
        l2 = max(dx * dx + dy * dy, 1e-12)
        t = np.clip(((qx - ax) * dx + (qy - ay) * dy) / l2, 0.0, 1.0)
        d = np.hypot(qx - ax - t * dx, qy - ay - t * dy)
        np.minimum(D[r0:r1, c0:c1], d, out=D[r0:r1, c0:c1])
    return D


def _weg(la, lo, gel, C, land, art, offen=(False, False)):
    """Kürzester Weg im Korridor C (km) um die Linie (la, lo) von ihrem Anfang zu ihrem Ende, geglättet;
    None, wenn es keinen gibt. offen: Anfang/Ende dürfen bis FREI_ENDE_KM wandern (Kosten 2 je km)."""
    e = geo.Eben(float(la[len(la) // 2]), float(lo[len(lo) // 2]))
    px, py = e.xy(la, lo)
    xmin, ymin = px.min() - C - ZELLE, py.min() - C - ZELLE
    w = int(math.ceil((px.max() + C + ZELLE - xmin) / ZELLE)) + 1
    h = int(math.ceil((py.max() + C + ZELLE - ymin) / ZELLE)) + 1
    xs = xmin + np.arange(w) * ZELLE
    ys = ymin + np.arange(h) * ZELLE
    X, Y = np.meshgrid(xs, ys)
    D = _abstand_raster(X, Y, px, py, C)
    rr, cc = np.nonzero(D <= C)
    zla, zlo = e.ll(X[rr, cc], Y[rr, cc])
    z, eben = gel.hoehen_np(zla, zlo)
    Z = np.zeros(X.shape)
    Z[rr, cc] = z
    b = LAENGE + LAGE * D[rr, cc] ** 2
    # Seen: ebenes Wasser kostet, solange die Linie selbst nicht über Wasser führt
    if not gel.hoehen_np(la, lo)[1].any():
        b = b + SEE * eben
    if land is not None and land(la, lo).all():
        b = np.where(land(zla, zlo), b, np.inf)
    basis = np.full(X.shape, np.inf)
    basis[rr, cc] = b
    def enden(x, y, frei):
        r0, c0 = int(round((y - ymin) / ZELLE)), int(round((x - xmin) / ZELLE))
        if not np.isfinite(basis[r0, c0]):
            basis[r0, c0] = LAENGE
        out = {r0 * w + c0: 0.0}
        if frei:
            k = int(FREI_ENDE_KM / ZELLE)
            for r_ in range(max(0, r0 - k), min(h, r0 + k + 1)):
                for c_ in range(max(0, c0 - k), min(w, c0 + k + 1)):
                    d = ZELLE * math.hypot(r_ - r0, c_ - c0)
                    if d <= FREI_ENDE_KM and np.isfinite(basis[r_, c_]):
                        out[r_ * w + c_] = 2.0 * d
        return out

    quellen = enden(px[0], py[0], offen[0])
    ziele = enden(px[-1], py[-1], offen[1])
    B = basis.ravel().tolist()
    Zl = Z.ravel().tolist()
    nachbarn = [(dr * w + dc, dc, ZELLE * math.hypot(dr, dc)) for dr in (-1, 0, 1) for dc in (-1, 0, 1) if dr or dc]
    n_ges = w * h
    inf = math.inf
    dist = dict(quellen)
    vor = {u: -1 for u in quellen}
    heap = [(c, u) for u, c in quellen.items()]
    heapq.heapify(heap)
    fertig = set()
    bestes, ziel = inf, None
    while heap:
        c, u = heapq.heappop(heap)
        if u in fertig:
            continue
        if c >= bestes:
            break
        fertig.add(u)
        if u in ziele and c + ziele[u] < bestes:
            bestes, ziel = c + ziele[u], u
        bu, zu = B[u], Zl[u]
        uc = u % w
        for off, dc, l in nachbarn:
            v = u + off
            if v < 0 or v >= n_ges or not 0 <= uc + dc < w:
                continue
            bv = B[v]
            if bv == inf or v in fertig:
                continue
            g = (Zl[v] - zu) / (1000.0 * l)
            cv = c + l * (0.5 * (bu + bv) + STEIGUNG * g * g)
            if cv < dist.get(v, inf):
                dist[v] = cv
                vor[v] = u
                heapq.heappush(heap, (cv, v))
    if ziel is None:
        return None
    zellen = []
    u = ziel
    while u != -1:
        zellen.append(u)
        u = vor[u]
    zellen.reverse()
    wx = np.array([xs[u % w] for u in zellen])
    wy = np.array([ys[u // w] for u in zellen])
    if not offen[0]:
        wx[0], wy[0] = px[0], py[0]
    if not offen[1]:
        wx[-1], wy[-1] = px[-1], py[-1]
    return e.ll(wx, wy)


def _gauss_gespiegelt(x, sigma):
    """Gauß-Filter einer gleichmäßig abgetasteten Koordinate; über die Enden hinaus wird die Linie punktgespiegelt
    fortgesetzt, so behalten die Enden ihre Richtung (kein Einrollen, keine Haken)."""
    r = int(math.ceil(3 * sigma))
    m = min(r, len(x) - 1)
    vorn = 2 * x[0] - x[m:0:-1]
    hinten = 2 * x[-1] - x[-2:-m - 2:-1]
    pad = np.concatenate([np.full(r - m, vorn[0]), vorn, x, hinten, np.full(r - m, hinten[-1])])
    k = np.exp(-0.5 * (np.arange(-r, r + 1) / sigma) ** 2)
    return np.convolve(pad, k / k.sum(), mode='valid')


def glaetten(la, lo, sigma, fest=(True, True)):
    """Gauß-Glättung einer Linie (σ km) nach gleichmäßiger Abtastung (0,1 km). Feste Enden bleiben genau: die
    Restverschiebung des geglätteten Endes läuft über 3σ aus."""
    la = np.asarray(la, dtype=np.float64)
    lo = np.asarray(lo, dtype=np.float64)
    si, gla, glo = _gleichmaessig(la, lo, 0.1)
    if len(si) < 3 or sigma <= 0:
        return la, lo
    e = geo.Eben(float(gla[len(gla) // 2]), float(glo[len(glo) // 2]))
    gx, gy = e.xy(gla, glo)
    sig = sigma / max(1e-6, si[1] - si[0])
    hx, hy = _gauss_gespiegelt(gx, sig), _gauss_gespiegelt(gy, sig)
    for j, ab in ((0, si), (-1, si[-1] - si)):
        if fest[j]:
            f = np.clip(1.0 - ab / (3 * sigma), 0.0, 1.0)
            hx -= f * (hx[j] - gx[j])
            hy -= f * (hy[j] - gy[j])
    return e.ll(hx, hy)


def _drehung_max(la, lo):
    _, a, b = _gleichmaessig(la, lo, SCHRITT)
    k = np.arctan2(np.diff(b) * np.cos(np.radians(a[1:])), np.diff(a))
    if len(k) < 2:
        return 0.0
    return float(np.degrees(np.abs((np.diff(k) + math.pi) % (2 * math.pi) - math.pi)).max())


def suchen(pts, gel, art, tunnel=(), land=None, grenze=None, fest=False, log=None, name=''):
    """Legt die bergigen Stücke von pts ins Tal. tunnel: Bogenlängen-Paare (km), dort bleibt die Linie.
    land(lat, lon) → Wahrheitsfeld (der Weg bleibt an Land, wenn die Linie es ist); grenze(lat, lon) → halbe
    Korridorbreite (km) je Punkt; fest: ist irgendwo Relief, wird die ganze Linie gesucht (Ersatzverläufe).
    Ergebnis: (neue Punkte, je neuem Punkt die Bogenlänge auf der alten Linie, größter Abstand km) oder None."""
    la = np.array([p[0] for p in pts], dtype=np.float64)
    lo = np.array([p[1] for p in pts], dtype=np.float64)
    s = _bogen(la, lo)
    if s[-1] < 2.0:
        return None
    if grenze is None:
        grenze = lambda a, b: np.full(np.shape(a), 2.5)  # noqa: E731
    stuecke = bergige_stuecke(la, lo, gel, grenze, tunnel)
    if fest and stuecke and not tunnel:
        stuecke = [(0.0, float(s[-1]))]
    if not stuecke:
        return None
    neu_p, neu_s = [], []
    pos = -1.0
    weit = 0.0
    for a, b in stuecke:
        for k in range(len(s)):
            if pos < s[k] < a:
                neu_p.append((float(la[k]), float(lo[k])))
                neu_s.append(float(s[k]))
        sa = np.concatenate([[a], s[(s > a) & (s < b)], [b]])
        ta = np.interp(sa, s, la)
        to = np.interp(sa, s, lo)
        offen = (not fest and a <= 0.0, not fest and b >= s[-1])
        w = _weg(ta, to, gel, float(grenze(ta, to).max()), land, art, offen)
        if w is not None:
            # Rasterstufen weg; zu scharfe Bögen bekommen mehr Glättung (bis 4σ)
            for k in (1, 2, 4):
                wla, wlo = glaetten(w[0], w[1], k * GLAETTEN_KM[art], (not offen[0], not offen[1]))
                dreh = _drehung_max(wla, wlo)
                if dreh <= MAX_DREHUNG:
                    break
            L_alt, L_neu = _bogen(ta, to)[-1], _bogen(wla, wlo)[-1]
            if L_neu > MAX_UMWEG * L_alt + 1.0 or dreh > MAX_DREHUNG:
                if log:
                    log(f'  {name}: Talsuche km {a:.1f}–{b:.1f} verworfen (Länge {L_alt:.1f} → {L_neu:.1f} km, '
                        f'Drehung {dreh:.0f}°)')
                w = None
        if w is not None:
            e = geo.Eben(float(ta[0]), float(to[0]))
            _, dla, dlo = _gleichmaessig(ta, to, 0.1)
            ax, ay = e.xy(dla, dlo)
            bx, by = e.xy(wla, wlo)
            for x, y in zip(bx[::5], by[::5]):
                d = np.hypot(ax - x, ay - y).min()
                weit = max(weit, float(d))
            sw = _bogen(wla, wlo)
            for x, y, f in zip(wla, wlo, sw / max(sw[-1], 1e-9)):
                neu_p.append((float(x), float(y)))
                neu_s.append(float(a + f * (b - a)))
        else:
            for x, y, sv in zip(ta, to, sa):
                neu_p.append((float(x), float(y)))
                neu_s.append(float(sv))
        pos = b
    for k in range(len(s)):
        if s[k] > pos:
            neu_p.append((float(la[k]), float(lo[k])))
            neu_s.append(float(s[k]))
    out_p, out_s = [neu_p[0]], [neu_s[0]]
    for p, sv in zip(neu_p[1:], neu_s[1:]):
        if abs(p[0] - out_p[-1][0]) + abs(p[1] - out_p[-1][1]) > 1e-7:
            out_p.append(p)
            out_s.append(sv)
    if weit < 0.1:
        return None
    return out_p, out_s, weit


# --- Ersatzverläufe aus dem Gelände ---------------------------------------------------------------------------
# Fehlt eine Straße in Natural Earth (die Talstraßen an Rhein und Mosel, Pässe, die Harzstraßen), entsteht ihr
# Verlauf aus dem Gelände: kürzester Weg auf einem Raster in einem breiten Korridor um den Grobverlauf. Kosten je km:
# 1 + Abstand² vom Grobverlauf (relativ zur Korridorbreite) + Höhe über dem Talboden + Steigung² + Wasser. So folgt
# der Weg den Tälern von Ort zu Ort, quert Kämme im Sattel und bleibt an Land. Flaches Land gibt keinen Verlauf vor;
# dort bleibt es beim Grobverlauf mit Mäandern (form.ersatz).
E_ZELLE_KM = 0.15  # Rasterweite; lange Etappen gröber, damit der Korridor höchstens E_ZELLEN Zellen hat
E_ZELLEN = 160000
E_KORRIDOR = (0.3, 3.0, 8.0)  # halbe Korridorbreite: Anteil der Länge des Grobverlaufs, mindestens, höchstens (km)
E_LAGE = 1.0  # Kosten je km am Korridorrand (mit dem Quadrat des Abstands)
E_TAL = 0.8  # Kosten je km für je 100 m über dem Talboden (tiefster Punkt im Umkreis von E_TAL_KM)
E_TAL_KM = 1.2
E_WASSER = 8.0  # Kosten je km über Wasser (Meer, Fjord, See): nur, wo es sein muss (Damm, Brücke, Fähre)
# (Gelände und Wasser zählen weniger, wenn der Weg sonst zu lang würde: Gewicht f = 1, 0,5, 0,25, 0,1)
E_RELIEF = 80.0  # m Höhenspanne im Korridor, unter der das Gelände keinen Verlauf vorgibt
E_UMWEG = {'ab': 1.35, 'land': 1.6}  # höchstens so viel länger als die Luftlinie, sonst zählt das Gelände weniger
# Ersatzwege anderer Straßen im selben Tal (Rhein: B 9 links, B 42 rechts) laufen nebeneinander her, statt sich zu
# kreuzen: der fremde Weg ist eine Wand (Aufschlag je km bis E_WAND km), daneben ein Streifen (bis E_STREIFEN km);
# beides gilt nicht in der Nähe der eigenen Enden (E_FREMD_ENDE km), dort treffen sich Straßen in ihren Knoten.
E_WAND = (0.15, 25.0)
E_STREIFEN = (0.4, 1.0)
E_FREMD_ENDE = 2.0
NACHBARN = [(dr, dc) for dr in (-2, -1, 0, 1, 2) for dc in (-2, -1, 0, 1, 2)
            if (dr or dc) and math.gcd(abs(dr), abs(dc)) == 1]  # 16 Richtungen: weniger Rasterecken


def _min_filter(Z, r):
    """Gleitendes Minimum über ein Quadrat von ±r Zellen (getrennt nach Zeilen und Spalten, Ränder wiederholt)."""
    if r <= 0:
        return Z.copy()
    p = np.pad(Z, ((0, 0), (r, r)), mode='edge')
    m = np.lib.stride_tricks.sliding_window_view(p, 2 * r + 1, axis=1).min(axis=2)
    p = np.pad(m, ((r, r), (0, 0)), mode='edge')
    return np.lib.stride_tricks.sliding_window_view(p, 2 * r + 1, axis=0).min(axis=2)


def _astern(B, Z, w, h, zelle, start, ziel, f):
    """A* auf dem Raster: Zellkosten B (je km, inf = gesperrt), Höhen Z (m), Gewicht f für die Steigung.
    Gibt die Zellfolge von start nach ziel zurück oder None."""
    Bl = B.ravel().tolist()
    Zl = Z.ravel().tolist()
    zr, zc = divmod(ziel, w)
    schritte = [(dr * w + dc, dr, dc, zelle * math.hypot(dr, dc)) for dr, dc in NACHBARN]
    inf = math.inf
    dist = {start: 0.0}
    vor = {start: -1}
    r0, c0 = divmod(start, w)
    heap = [(zelle * math.hypot(r0 - zr, c0 - zc), start)]
    fertig = set()
    k_st = f * STEIGUNG
    while heap:
        _, u = heapq.heappop(heap)
        if u in fertig:
            continue
        if u == ziel:
            break
        fertig.add(u)
        du, bu, zu = dist[u], Bl[u], Zl[u]
        ur, uc = divmod(u, w)
        for off, dr, dc, l in schritte:
            vr, vc = ur + dr, uc + dc
            if not (0 <= vr < h and 0 <= vc < w):
                continue
            v = u + off
            bv = Bl[v]
            if bv == inf or v in fertig:
                continue
            g = (Zl[v] - zu) / (1000.0 * l)
            nd = du + l * (0.5 * (bu + bv) + k_st * g * g)
            if nd < dist.get(v, inf):
                dist[v] = nd
                vor[v] = u
                heapq.heappush(heap, (nd + zelle * math.hypot(vr - zr, vc - zc), v))
    if ziel not in vor:
        return None
    out = []
    u = ziel
    while u != -1:
        out.append(u)
        u = vor[u]
    return out[::-1]


def gelaende_weg(grob, gel, art, land=None, fremd=(), log=None, name=''):
    """Ersatzverlauf durch das Gelände von grob[0] nach grob[-1] im Korridor um den Grobverlauf grob [(lat, lon), …].
    land(lat, lon) → Wahrheitsfeld (Natural-Earth-Land); fremd: Polylinien anderer Straßen, denen der Weg ausweicht.
    Ergebnis: Punkte [(lat, lon), …] mit genau grob[0] und grob[-1] als Enden, oder None (flaches Land)."""
    la = np.array([p[0] for p in grob], dtype=np.float64)
    lo = np.array([p[1] for p in grob], dtype=np.float64)
    L0 = float(_bogen(la, lo)[-1])
    luft = geo.hav(*grob[0], *grob[-1])
    if luft < 1.0:
        return None
    W = min(max(E_KORRIDOR[0] * L0, E_KORRIDOR[1]), E_KORRIDOR[2])
    e = geo.Eben(float(la.mean()), float(lo.mean()))
    px, py = e.xy(la, lo)
    zelle = max(E_ZELLE_KM, math.sqrt((2 * W * L0 + math.pi * W * W) / E_ZELLEN))
    xmin, ymin = px.min() - W - zelle, py.min() - W - zelle
    w = int(math.ceil((px.max() + W + zelle - xmin) / zelle)) + 1
    h = int(math.ceil((py.max() + W + zelle - ymin) / zelle)) + 1
    X, Y = np.meshgrid(xmin + np.arange(w) * zelle, ymin + np.arange(h) * zelle)
    D = _abstand_raster(X, Y, px, py, W, zelle)
    gilt = D <= W
    zla, zlo = e.ll(X, Y)
    Z, eben = gel.hoehen_np(zla.ravel(), zlo.ravel())
    Z, eben = Z.reshape(X.shape), eben.reshape(X.shape)
    if np.ptp(Z[gilt]) < E_RELIEF:
        return None
    hrel = Z - _min_filter(Z, int(round(E_TAL_KM / zelle)))
    wasser = eben.copy()
    if land is not None:
        wasser |= ~land(zla, zlo)
    fremd_km = np.full(X.shape, np.inf)
    for F in fremd:
        fx, fy = e.xy(np.array([p[0] for p in F]), np.array([p[1] for p in F]))
        np.minimum(fremd_km, _abstand_raster(X, Y, fx, fy, E_STREIFEN[0], zelle), out=fremd_km)
    ende = np.minimum(np.hypot(X - px[0], Y - py[0]), np.hypot(X - px[-1], Y - py[-1]))
    fremd_b = np.where(ende > E_FREMD_ENDE, np.where(fremd_km <= E_WAND[0], E_WAND[1], 0.0)
                       + np.where(fremd_km <= E_STREIFEN[0], E_STREIFEN[1], 0.0), 0.0)

    def zelle_von(x, y):
        return int(round((y - ymin) / zelle)) * w + int(round((x - xmin) / zelle))

    start, ziel = zelle_von(px[0], py[0]), zelle_von(px[-1], py[-1])
    for f in (1.0, 0.5, 0.25, 0.1):
        B = 1.0 + E_LAGE * (D / W) ** 2 + f * (E_TAL * hrel / 100.0 + E_WASSER * wasser) + fremd_b
        B = np.where(gilt, B, np.inf)
        B.flat[start] = B.flat[ziel] = 1.0
        weg = _astern(B, Z, w, h, zelle, start, ziel, f)
        if weg is None:
            return None
        wx = np.array([X.flat[u] for u in weg])
        wy = np.array([Y.flat[u] for u in weg])
        wx[0], wy[0], wx[-1], wy[-1] = px[0], py[0], px[-1], py[-1]
        wla, wlo = e.ll(wx, wy)
        for k in (1, 2, 4):
            gla, glo = glaetten(wla, wlo, k * GLAETTEN_KM[art])
            dreh = _drehung_max(gla, glo)
            if dreh <= MAX_DREHUNG:
                break
        L = float(_bogen(gla, glo)[-1])
        if L <= E_UMWEG[art] * luft:
            break
        if log:
            log(f'  {name}: Geländeweg {L:.1f} km auf {luft:.1f} km Luftlinie mit Geländegewicht {f:g} zu lang')
    pts = [(float(a), float(b)) for a, b in zip(gla, glo)]
    pts[0], pts[-1] = tuple(grob[0]), tuple(grob[-1])
    if log:
        log(f'  {name}: Geländeweg {L:.1f} km (Luftlinie {luft:.1f}, Korridor ±{W:.1f} km, Raster {zelle * 1000:.0f} m, '
            f'Geländegewicht {f:g}, Drehung bis {dreh:.0f}°)')
    return pts
