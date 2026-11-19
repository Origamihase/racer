# Formen von Polylinien [(lat, lon), …]: Bogenlänge, Lotfußpunkt, Ausbeulen durch einen Knoten, Endrampen,
# glatte Übergänge an Knoten, Prüfungen (Umweg, Kehre, Zickzack, Spitze) und Ersatzverläufe.
import math

from geo import Eben, hav, kurs, winkel_diff


def kum(pts):
    """Bogenlänge (km) an jedem Punkt."""
    s = [0.0]
    for a, b in zip(pts, pts[1:]):
        s.append(s[-1] + hav(a[0], a[1], b[0], b[1]))
    return s


def lot(pts, lat, lon, s=None, von=0.0, bis=None):
    """Nächster Punkt der Polylinie zu (lat, lon), nur im Bogenlängenfenster [von, bis].
    Ergebnis: (Bogenlänge, Abstand km, (lat, lon))."""
    if s is None:
        s = kum(pts)
    if bis is None:
        bis = s[-1]
    e = Eben(lat, lon)
    best = (1e18, 0.0, pts[0])
    for i in range(len(pts) - 1):
        if s[i + 1] < von or s[i] > bis:
            continue
        ax, ay = e.xy(*pts[i])
        bx, by = e.xy(*pts[i + 1])
        dx, dy = bx - ax, by - ay
        l2 = dx * dx + dy * dy
        t = 0.0 if l2 <= 0 else max(0.0, min(1.0, -(ax * dx + ay * dy) / l2))
        seg = s[i + 1] - s[i]
        si = s[i] + t * seg
        if si < von:
            t = (von - s[i]) / seg if seg > 0 else 0.0
        elif si > bis:
            t = (bis - s[i]) / seg if seg > 0 else 0.0
        qx, qy = ax + t * dx, ay + t * dy
        d = math.hypot(qx, qy)
        if d < best[0]:
            best = (d, s[i] + t * seg, e.ll(qx, qy))
    return best[1], best[0], best[2]


def punkt_bei(pts, s_ziel, s=None):
    """Punkt bei Bogenlänge s_ziel (linear zwischen den Stützpunkten)."""
    if s is None:
        s = kum(pts)
    if s_ziel <= 0:
        return pts[0]
    if s_ziel >= s[-1]:
        return pts[-1]
    lo, hi = 0, len(s) - 1
    while hi - lo > 1:
        m = (lo + hi) // 2
        if s[m] <= s_ziel:
            lo = m
        else:
            hi = m
    seg = s[hi] - s[lo]
    t = (s_ziel - s[lo]) / seg if seg > 0 else 0.0
    a, b = pts[lo], pts[hi]
    return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)


def stueck(pts, s0, s1, s=None):
    """Teilstück zwischen den Bogenlängen s0 < s1 mit interpolierten Enden."""
    if s is None:
        s = kum(pts)
    out = [punkt_bei(pts, s0, s)]
    for p, si in zip(pts, s):
        if s0 + 1e-6 < si < s1 - 1e-6:
            out.append(p)
    out.append(punkt_bei(pts, s1, s))
    return out


def verdichten(pts, schritt):
    """Zwischenpunkte so einfügen, dass kein Abschnitt länger als schritt (km) ist (Originalpunkte bleiben)."""
    out = [pts[0]]
    for a, b in zip(pts, pts[1:]):
        d = hav(a[0], a[1], b[0], b[1])
        n = max(1, int(math.ceil(d / schritt)))
        for k in range(1, n + 1):
            t = k / n
            out.append((a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t))
    return out


def beule(pts, s0, ziel, L1, L2):
    """Verformt die Linie um die Bogenlänge s0 so, dass der Punkt dort genau auf ziel liegt.
    Verschiebung mit einer Kosinusglocke (links L1 km, rechts L2 km breit): glatt, ohne Knick.
    Gibt (neue Punkte, Index des Zielpunkts) zurück."""
    s = kum(pts)
    a, b = max(0.0, s0 - L1), min(s[-1], s0 + L2)
    links = verdichten(stueck(pts, a, s0, s), 0.15) if s0 - a > 1e-6 else [punkt_bei(pts, s0, s)]
    rechts = verdichten(stueck(pts, s0, b, s), 0.15) if b - s0 > 1e-6 else [punkt_bei(pts, s0, s)]
    q = links[-1]
    e = Eben(*q)
    zx, zy = e.xy(*ziel)

    def schieb(p, u):
        w = 0.5 * (1 + math.cos(math.pi * min(1.0, u)))
        x, y = e.xy(*p)
        return e.ll(x + zx * w, y + zy * w)

    ls = kum(links)
    rs = kum(rechts)
    neu_l = [schieb(p, (ls[-1] - si) / L1 if L1 > 0 else 1.0) for p, si in zip(links, ls)]
    neu_r = [schieb(p, si / L2 if L2 > 0 else 1.0) for p, si in zip(rechts, rs)]
    neu_l[-1] = ziel
    vor = [p for p, si in zip(pts, s) if si < a - 1e-9]
    nach = [p for p, si in zip(pts, s) if si > b + 1e-9]
    return vor + neu_l + neu_r[1:] + nach, len(vor) + len(neu_l) - 1


def endrampe(pts, ziel, am_ende, L):
    """Verformt Anfang (am_ende=False) oder Ende der Linie, so dass der Endpunkt genau auf ziel liegt."""
    if am_ende:
        return list(reversed(endrampe(list(reversed(pts)), ziel, False, L)))
    s = kum(pts)
    L = min(L, s[-1])
    e = Eben(*pts[0])
    zx, zy = e.xy(*ziel)
    dicht = verdichten(stueck(pts, 0.0, L, s), 0.15)
    ds = kum(dicht)
    neu = []
    for p, si in zip(dicht, ds):
        w = 0.5 * (1 + math.cos(math.pi * min(1.0, si / L))) if L > 0 else 0.0
        x, y = e.xy(*p)
        neu.append(e.ll(x + zx * w, y + zy * w))
    neu[0] = ziel
    return neu + [p for p, si in zip(pts, s) if si > L + 1e-9]


def bereinigen(pts, fest, max_dev=1.5, scharf=45.0):
    """Entfernt Kehren, Haken und Versätze aus einem Weg (Natural Earth ist an Kreuzen und Linienenden oft
    zerrissen). Für den schärfsten Knick über `scharf` Grad wird das kürzeste Fenster gesucht, das sich durch
    eine Sehne ersetzen lässt (Abweichung höchstens max_dev km, an den Fensterrändern danach kein scharfer Knick).
    fest: Indizes der Schichtwechsel; fallen sie weg, rücken sie auf den Punkt vor dem Fenster.
    Gibt (Punkte, neue Indizes von fest) zurück."""
    P = list(pts)
    orig = list(range(len(P)))
    erlaubt = set()  # Knicke, die sich nicht entschärfen lassen (bleiben)

    def kurs_ij(i, j):
        return kurs(*P[i], *P[j]) if hav(*P[i], *P[j]) > 1e-6 else None

    def knick_an(i):
        # Knick am Punkt i, Nachbarn mit Mindestabstand (sehr kurze Abschnitte überspringen)
        a = i - 1
        while a > 0 and hav(*P[a], *P[i]) < 0.03:
            a -= 1
        b = i + 1
        while b < len(P) - 1 and hav(*P[i], *P[b]) < 0.03:
            b += 1
        k1, k2 = kurs_ij(a, i), kurs_ij(i, b)
        if k1 is None or k2 is None:
            return 0.0
        return winkel_diff(k1, k2)

    for _ in range(500):
        n = len(P)
        if n < 3:
            break
        s = kum(P)
        kandidaten = []
        for i in range(1, n - 1):
            t = abs(knick_an(i))
            if t > scharf and orig[i] not in erlaubt:
                kandidaten.append((t, i))
        if not kandidaten:
            break
        _, k = max(kandidaten)
        best = None
        for i in range(k, max(1, k - 10) - 1, -1):
            for j in range(k, min(n - 2, k + 10) + 1):
                if s[j + 1] - s[i - 1] > 8.0:
                    continue
                e = Eben(*P[i - 1])
                ax, ay = 0.0, 0.0
                bx, by = e.xy(*P[j + 1])
                dx, dy = bx - ax, by - ay
                l2 = dx * dx + dy * dy
                dev = 0.0
                for m in range(i, j + 1):
                    px, py = e.xy(*P[m])
                    u = 0.0 if l2 <= 0 else max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / l2))
                    dev = max(dev, math.hypot(px - ax - u * dx, py - ay - u * dy))
                if dev > max_dev:
                    continue
                sehne = kurs_ij(i - 1, j + 1)
                if sehne is None:
                    continue
                ok = True
                if i - 1 > 0:
                    k0 = kurs_ij(i - 2, i - 1)
                    if k0 is not None and abs(winkel_diff(k0, sehne)) > scharf:
                        ok = False
                if j + 2 < n:
                    k3 = kurs_ij(j + 1, j + 2)
                    if k3 is not None and abs(winkel_diff(sehne, k3)) > scharf:
                        ok = False
                if not ok:
                    continue
                kosten = s[j + 1] - s[i - 1]
                if best is None or kosten < best[0]:
                    best = (kosten, i, j)
        if best is None:
            erlaubt.add(orig[k])
            continue
        _, i, j = best
        P = P[:i] + P[j + 1:]
        orig = orig[:i] + orig[j + 1:]
    # feste Punkte neu zuordnen
    neu = []
    for f in fest:
        k = 0
        while k + 1 < len(orig) and orig[k + 1] <= f:
            k += 1
        neu.append(k)
    return P, neu


def anschluss(pts, ziel, am_ende, adv):
    """Glatter Anschluss eines Linienendes an einen abseits liegenden Punkt: die Linie wird adv km vor ihrem Ende
    verlassen, ein Hermite-Bogen führt tangential hinüber zum Ziel."""
    if not am_ende:
        return list(reversed(anschluss(list(reversed(pts)), ziel, True, adv)))
    s = kum(pts)
    adv = max(0.0, min(adv, s[-1] * 0.9))
    sJ = s[-1] - adv
    J = punkt_bei(pts, sJ, s)
    e = Eben(*J)
    t = richtung(pts, max(0.0, sJ - 0.2), s, 0.2) if sJ > 0.05 else richtung(pts, min(s[-1], 0.2), s, 0.2)
    zx, zy = e.xy(*ziel)
    L = math.hypot(zx, zy)
    if L < 1e-6:
        return stueck(pts, 0.0, sJ, s) + [ziel]
    tz = (zx / L, zy / L)
    # Endtangente: zwischen der Richtung zum Ziel und der alten Richtung
    ex, ey = tz[0] + 0.5 * t[0], tz[1] + 0.5 * t[1]
    El = math.hypot(ex, ey) or 1.0
    n = max(3, int(math.ceil(L / 0.12)))
    bogen = hermite((0.0, 0.0), (t[0] * L, t[1] * L), (zx, zy), (ex / El * L, ey / El * L), n)
    return stueck(pts, 0.0, sJ, s) + [e.ll(x, y) for x, y in bogen[:-1]] + [ziel]


def hermite(p0, t0, p1, t1, n):
    """Kubische Hermite-Kurve in der Ebene von p0 nach p1 mit Tangenten t0, t1 (n Abschnitte, ohne p0)."""
    out = []
    for k in range(1, n + 1):
        u = k / n
        h00 = 2 * u ** 3 - 3 * u ** 2 + 1
        h10 = u ** 3 - 2 * u ** 2 + u
        h01 = -2 * u ** 3 + 3 * u ** 2
        h11 = u ** 3 - u ** 2
        out.append((h00 * p0[0] + h10 * t0[0] + h01 * p1[0] + h11 * t1[0], h00 * p0[1] + h10 * t0[1] + h01 * p1[1] + h11 * t1[1]))
    return out


def richtung(pts, s_ziel, s, d=0.4):
    """Mittlere Richtung (Einheitsvektor in der Ebene um den Punkt) um die Bogenlänge s_ziel."""
    a = punkt_bei(pts, max(0.0, s_ziel - d), s)
    b = punkt_bei(pts, min(s[-1], s_ziel + d), s)
    e = Eben(*punkt_bei(pts, s_ziel, s))
    ax, ay = e.xy(*a)
    bx, by = e.xy(*b)
    L = math.hypot(bx - ax, by - ay)
    return ((bx - ax) / L, (by - ay) / L) if L > 0 else (0.0, 1.0)


def glatt_am_knoten(rein, raus, D, gerade=0.0):
    """Glatter Übergang zweier Linien am gemeinsamen Knoten (rein endet dort, raus beginnt dort).
    Ersetzt je D km vor und nach dem Knoten durch Hermite-Bögen; der Knoten bleibt exakt, die Richtung dort ist
    der Mittelwert. gerade: so lang (km) läuft die Linie vor und nach dem Knoten schnurgerade in dieser Richtung
    (die Richtung am Knoten ist dann auch auf einem Raster messbar). Gibt (rein, raus) neu zurück."""
    sr = kum(rein)
    so = kum(raus)
    D1 = min(D, 0.45 * sr[-1])
    D2 = min(D, 0.45 * so[-1])
    if D1 < 0.05 or D2 < 0.05:
        return rein, raus
    g1 = min(gerade, 0.4 * D1)
    g2 = min(gerade, 0.4 * D2)
    N = rein[-1]
    e = Eben(*N)
    A = punkt_bei(rein, sr[-1] - D1, sr)
    B = punkt_bei(raus, D2, so)
    tA = richtung(rein, sr[-1] - D1, sr, min(0.3, D1 / 3))
    tB = richtung(raus, D2, so, min(0.3, D2 / 3))
    t_in = richtung(rein, sr[-1] - min(0.3, D1 / 2), sr, min(0.3, D1 / 2))
    t_out = richtung(raus, min(0.3, D2 / 2), so, min(0.3, D2 / 2))
    tx, ty = t_in[0] + t_out[0], t_in[1] + t_out[1]
    L = math.hypot(tx, ty)
    if L < 1e-6:
        return rein, raus
    tN = (tx / L, ty / L)
    pA = e.xy(*A)
    pB = e.xy(*B)
    Q1 = (-tN[0] * g1, -tN[1] * g1)
    Q2 = (tN[0] * g2, tN[1] * g2)
    n1 = max(2, int(math.ceil((D1 - g1) / 0.05)))
    n2 = max(2, int(math.ceil((D2 - g2) / 0.05)))
    k1 = hermite(pA, (tA[0] * D1, tA[1] * D1), Q1, (tN[0] * D1, tN[1] * D1), n1)
    k2 = hermite(Q2, (tN[0] * D2, tN[1] * D2), pB, (tB[0] * D2, tB[1] * D2), n2)
    # k1 endet in Q1 (bei gerade = 0 im Knoten), k2 beginnt nach Q2
    neu_rein = stueck(rein, 0.0, sr[-1] - D1, sr) + [e.ll(x, y) for x, y in k1[:-1]] + ([e.ll(*Q1)] if g1 > 1e-6 else []) + [N]
    neu_raus = [N] + ([e.ll(*Q2)] if g2 > 1e-6 else []) + [e.ll(x, y) for x, y in k2[:-1]] + stueck(raus, D2, so[-1], so)
    return neu_rein, neu_raus


# --- Prüfungen ------------------------------------------------------------------------------------------
def knicke(pts, min_seg=0.03):
    """Kurswechsel zwischen aufeinanderfolgenden Abschnitten (Grad, positiv = rechts); sehr kurze Abschnitte
    werden übersprungen."""
    kurse = []
    for a, b in zip(pts, pts[1:]):
        if hav(a[0], a[1], b[0], b[1]) >= min_seg:
            kurse.append(kurs(a[0], a[1], b[0], b[1]))
    return [winkel_diff(x, y) for x, y in zip(kurse, kurse[1:])]


def pruefen(pts, art):
    """Plausibilität eines Verlaufs. Ergebnis: Liste der Mängel (leer = in Ordnung) und Kennzahlen."""
    L = sum(hav(a[0], a[1], b[0], b[1]) for a, b in zip(pts, pts[1:]))
    S = hav(pts[0][0], pts[0][1], pts[-1][0], pts[-1][1])
    ratio = L / S if S > 0.05 else 1.0
    maengel = []
    if ratio > 1.6:
        maengel.append(f'Umweg {ratio:.2f}')
    if ratio < 0.999:
        maengel.append(f'kürzer als Luftlinie {ratio:.3f}')
    kn = knicke(pts)
    if kn and max(abs(k) for k in kn) > 120:
        maengel.append(f'Kehre {max(abs(k) for k in kn):.0f}°')
    # Zickzack: zwei starke Knicke in entgegengesetzte Richtung innerhalb kurzer Strecke
    s = kum(pts)
    idx = [i for i in range(1, len(pts) - 1)]
    stark = []
    for i in idx:
        a, b, c = pts[i - 1], pts[i], pts[i + 1]
        if hav(*a, *b) < 0.03 or hav(*b, *c) < 0.03:
            continue
        w = winkel_diff(kurs(*a, *b), kurs(*b, *c))
        if abs(w) > 60:
            stark.append((s[i], w))
    for (s1, w1), (s2, w2) in zip(stark, stark[1:]):
        if s2 - s1 < 3.0 and w1 * w2 < 0:
            maengel.append(f'Zickzack bei km {s1:.1f}')
            break
    # Spitze: ein Punkt, der weit von der Sehne seiner Nachbarn (je 1 km) abweicht und dorthin zurückkehrt
    for i in range(1, len(pts) - 1):
        a = punkt_bei(pts, max(0.0, s[i] - 1.0), s)
        c = punkt_bei(pts, min(s[-1], s[i] + 1.0), s)
        sehne = hav(*a, *c)
        bogen = min(s[-1], s[i] + 1.0) - max(0.0, s[i] - 1.0)
        if bogen > 1.5 and sehne < 0.35 * bogen:
            maengel.append(f'Spitze bei km {s[i]:.1f}')
            break
    return maengel, {'km': L, 'luft': S, 'ratio': ratio, 'max_knick': max((abs(k) for k in kn), default=0.0)}


# --- Ersatzverlauf --------------------------------------------------------------------------------------
def fnv(text):
    h = 0x811C9DC5
    for ch in text.encode('utf-8'):
        h ^= ch
        h = (h * 0x01000193) & 0xFFFFFFFF
    return h


class Zufall:
    """Kleiner deterministischer Zufallsgenerator (mulberry32 wie in tools/trip-test.mjs)."""

    def __init__(self, seed):
        self.a = seed & 0xFFFFFFFF

    def __call__(self):
        self.a = (self.a + 0x6D2B79F5) & 0xFFFFFFFF
        t = self.a
        t = ((t ^ (t >> 15)) * (1 | t)) & 0xFFFFFFFF
        t = (t + (((t ^ (t >> 7)) * (61 | t)) & 0xFFFFFFFF)) & 0xFFFFFFFF ^ t
        return ((t ^ (t >> 14)) & 0xFFFFFFFF) / 4294967296


def catmull(pts_xy, schritt):
    """Zentripetale Catmull-Rom-Kurve durch Punkte der Ebene, abgetastet etwa alle schritt km."""
    if len(pts_xy) == 2:
        (ax, ay), (bx, by) = pts_xy
        n = max(1, int(math.ceil(math.hypot(bx - ax, by - ay) / schritt)))
        return [(ax + (bx - ax) * k / n, ay + (by - ay) * k / n) for k in range(n + 1)]
    P = [(2 * pts_xy[0][0] - pts_xy[1][0], 2 * pts_xy[0][1] - pts_xy[1][1])] + list(pts_xy) + [(2 * pts_xy[-1][0] - pts_xy[-2][0], 2 * pts_xy[-1][1] - pts_xy[-2][1])]
    out = [pts_xy[0]]
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]

        def tj(ti, a, b):
            return ti + max(1e-6, math.hypot(b[0] - a[0], b[1] - a[1])) ** 0.5

        t0 = 0.0
        t1 = tj(t0, p0, p1)
        t2 = tj(t1, p1, p2)
        t3 = tj(t2, p2, p3)
        n = max(2, int(math.ceil(math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / schritt)))
        for k in range(1, n + 1):
            t = t1 + (t2 - t1) * k / n

            def lerp(a, b, ta, tb):
                if tb - ta < 1e-12:
                    return a
                return ((tb - t) / (tb - ta) * a[0] + (t - ta) / (tb - ta) * b[0], (tb - t) / (tb - ta) * a[1] + (t - ta) / (tb - ta) * b[1])

            A1 = lerp(p0, p1, t0, t1)
            A2 = lerp(p1, p2, t1, t2)
            A3 = lerp(p2, p3, t2, t3)
            B1 = lerp(A1, A2, t0, t2)
            B2 = lerp(A2, A3, t1, t3)
            out.append(lerp(B1, B2, t1, t2))
    return out


def maeander(L, rnd, wellen, amp_anteil, amp_max, rampe):
    """Seitliche Auslenkung y(s) (km) für Bogenlängen 0…L: Summe dreier Sinuswellen mit zufälliger Wellenlänge
    (aus wellen = (λmin, λmax) km, höchstens L/1,5) und Phase, an beiden Enden über die Länge rampe weich auf
    null geführt, damit Lage und Richtung an den Enden bleiben."""
    komp = []
    for k in range(3):
        lam = wellen[0] + (wellen[1] - wellen[0]) * rnd()
        lam = min(lam, max(L / 1.5, 0.5)) / (1.0 + 0.6 * k)
        komp.append((lam, (0.55 + 0.45 * rnd()) / (k + 1), 2 * math.pi * rnd()))
    gesamt = sum(a for _, a, _ in komp)
    A = min(amp_anteil * L, amp_max)

    def y(s):
        if L <= 0:
            return 0.0
        w = 1.0
        if rampe > 0:
            u = max(0.0, min(1.0, s / rampe, (L - s) / rampe))
            w = u * u * (3 - 2 * u)
        return w * A * sum(a * math.sin(2 * math.pi * s / lam + ph) for lam, a, ph in komp) / gesamt

    return y


def seitlich_versetzen(pts_xy, y):
    """Punkte der Ebene entlang ihrer Normalen um y(s) versetzen (s = Bogenlänge)."""
    s = [0.0]
    for (ax, ay), (bx, by) in zip(pts_xy, pts_xy[1:]):
        s.append(s[-1] + math.hypot(bx - ax, by - ay))
    out = []
    n = len(pts_xy)
    for i, (x, yy) in enumerate(pts_xy):
        a = pts_xy[max(0, i - 1)]
        b = pts_xy[min(n - 1, i + 1)]
        tx, ty = b[0] - a[0], b[1] - a[1]
        L = math.hypot(tx, ty)
        if L <= 0:
            out.append((x, yy))
            continue
        nx, ny = ty / L, -tx / L  # rechte Normale
        d = y(s[i])
        out.append((x + nx * d, yy + ny * d))
    return out


# Kurvenbild der abgeglichenen Straßen (gemessen über alle Etappen ab 15 km Länge): Autobahnen wechseln die
# Krümmungsrichtung im Mittel alle 12,5 km, Landstraßen alle 9,8 km; die größte Abweichung von der Sehne je 10 km
# liegt im Median bei 0,47 km (Autobahn) und 0,62 km (Landstraße). Ersatzverläufe bekommen dasselbe Kurvenbild.
WELLEN = {'ab': (16.0, 34.0), 'land': (12.0, 28.0)}  # Wellenlängen der Mäander (km)
AMPLITUDE = {'ab': (0.03, 0.9), 'land': (0.035, 1.1)}  # Anteil der Länge, Höchstwert (km)


def _laenge_xy(xy):
    return sum(math.hypot(b[0] - a[0], b[1] - a[1]) for a, b in zip(xy, xy[1:]))


def ersatz(A, B, mitte, art, seed, land=None):
    """Ersatzverlauf von A nach B (lat, lon) durch die Grobpunkte mitte: geglättete Grundlinie plus
    deterministische Mäander (Seed: Kennung der Kante). Verlässt ein Mäander das Land, wird er flacher.
    Gibt (Punkte, Grundlinie auf Land) zurück."""
    e = Eben((A[0] + B[0]) / 2, (A[1] + B[1]) / 2)
    P = [e.xy(*A)]
    for p in mitte:
        q = e.xy(*p)
        if math.hypot(q[0] - P[-1][0], q[1] - P[-1][1]) > 1.0:
            P.append(q)
    Bx = e.xy(*B)
    if len(P) > 1 and math.hypot(Bx[0] - P[-1][0], Bx[1] - P[-1][1]) < 1.0:
        P.pop()
    P.append(Bx)
    basis = catmull(P, 0.25)
    L = _laenge_xy(basis)
    rnd = Zufall(fnv(seed))
    anteil, amax = AMPLITUDE[art]
    y = maeander(L, rnd, WELLEN[art], anteil, amax, min(0.25 * L, 4.0))
    basis_land = land is None or all(land.land(*e.ll(*q)) for q in basis[::4])
    faktor = 1.0
    for _ in range(4):
        xy = seitlich_versetzen(basis, lambda s, f=faktor: f * y(s))
        pts = [e.ll(x, yy) for x, yy in xy]
        if not basis_land or all(land.land(*p) for p in pts[::2]):
            break
        faktor *= 0.5
    pts[0] = A
    pts[-1] = B
    return pts, basis_land


def geraden_beleben(pts, art, seed, lang=15.0):
    """Natural Earth zieht manche Strecken über viele Kilometer schnurgerade (vereinfacht). Abschnitte über lang km
    bekommen sanfte Mäander im Kurvenbild der Straßenart; Anfang, Ende und Richtung dort bleiben.
    Gibt (Punkte, ersetzte km) zurück."""
    out = [pts[0]]
    ersetzt = 0.0
    for k, (a, b) in enumerate(zip(pts, pts[1:])):
        L = hav(a[0], a[1], b[0], b[1])
        if L <= lang:
            out.append(b)
            continue
        e = Eben(*a)
        bx, by = e.xy(*b)
        n = int(math.ceil(L / 0.25))
        xy = [(bx * i / n, by * i / n) for i in range(n + 1)]
        rnd = Zufall(fnv(f'{seed}/{k}'))
        y = maeander(L, rnd, WELLEN[art], 0.02, 0.6, min(0.3 * L, 3.0))
        neu = seitlich_versetzen(xy, y)
        out.extend(e.ll(x, yy) for x, yy in neu[1:-1])
        out.append(b)
        ersetzt += L
    return out, ersetzt


def umweg_kappen(pts, scharf=100.0, faktor=1.5, fenster=15.0):
    """Schneidet Umwege mit Kehre ab: Fehlt Natural Earth ein Stück Straße, führt der kürzeste Weg über eine
    andere Linie hin und zurück. Um jeden Knick über scharf Grad wird das Fenster gesucht, das sich am meisten
    lohnt (Weglänge − faktor × Sehne) und dessen Sehne höchstens 60° gegen den Weg an ihren Enden steht; es wird
    durch einen Hermite-Bogen ersetzt. Gibt (Punkte, Länge der Bögen in km) zurück."""
    P = list(pts)
    erzeugt = 0.0
    erlaubt = set()
    for _ in range(30):
        s = kum(P)
        kandidat = None
        for i in range(1, len(P) - 1):
            if i in erlaubt:
                continue
            w = max(abs(_knick(P, i)), _drehung_um(P, s, i))
            if w > scharf and (kandidat is None or w > kandidat[0]):
                kandidat = (w, i)
        if kandidat is None:
            break
        k = kandidat[1]
        best = None
        i = k
        while i >= 0 and s[k] - s[i] <= fenster:
            j = k
            while j < len(P) and s[j] - s[k] <= fenster:
                if j - i >= 2:
                    c = hav(*P[i], *P[j])
                    gewinn = (s[j] - s[i]) - faktor * c
                    if c > 0.2 and gewinn > 0 and (best is None or gewinn > best[0]):
                        e = Eben(*P[i])
                        cx, cy = e.xy(*P[j])
                        ti = richtung(P, s[i], s, 0.3)
                        tj = richtung(P, s[j], s, 0.3)
                        # An den Enden der Etappe zählt die alte Richtung nicht (dort glättet später der Übergang)
                        wi = 0.0 if i == 0 else math.degrees(math.acos(max(-1.0, min(1.0, (ti[0] * cx + ti[1] * cy) / c))))
                        wj = 0.0 if j == len(P) - 1 else math.degrees(math.acos(max(-1.0, min(1.0, (tj[0] * cx + tj[1] * cy) / c))))
                        if wi <= 60 and wj <= 60:
                            best = (gewinn, i, j, ti, tj, c)
                j += 1
            i -= 1
        if best is None:
            erlaubt.add(k)
            continue
        _, i, j, ti, tj, c = best
        e = Eben(*P[i])
        cx, cy = e.xy(*P[j])
        if i == 0:
            ti = (cx / c, cy / c)
        if j == len(P) - 1:
            tj = (cx / c, cy / c)
        n = max(3, int(math.ceil(c / 0.15)))
        bogen = hermite((0.0, 0.0), (ti[0] * c, ti[1] * c), (cx, cy), (tj[0] * c, tj[1] * c), n)
        neu = [e.ll(x, y) for x, y in bogen[:-1]]
        erzeugt += kum([P[i]] + neu + [P[j]])[-1]
        P = P[: i + 1] + neu + P[j:]
        erlaubt = set()
    return P, erzeugt


def _knick(P, i):
    """Kurswechsel (Grad) am Punkt i; Nachbarn näher als 30 m werden übersprungen."""
    a = i - 1
    while a > 0 and hav(*P[a], *P[i]) < 0.03:
        a -= 1
    b = i + 1
    while b < len(P) - 1 and hav(*P[i], *P[b]) < 0.03:
        b += 1
    if hav(*P[a], *P[i]) < 1e-6 or hav(*P[i], *P[b]) < 1e-6:
        return 0.0
    return winkel_diff(kurs(*P[a], *P[i]), kurs(*P[i], *P[b]))


def _drehung_um(P, s, i, d=0.5):
    """Kurswechsel (Grad, Betrag) am Punkt i zwischen den Sehnen d km davor und danach: findet auch Kehren, die
    eine Glättung auf viele kleine Knicke verteilt hat."""
    a = punkt_bei(P, max(0.0, s[i] - d), s)
    c = punkt_bei(P, min(s[-1], s[i] + d), s)
    if hav(*a, *P[i]) < 0.05 or hav(*P[i], *c) < 0.05:
        return abs(_knick(P, i))
    return abs(winkel_diff(kurs(*a, *P[i]), kurs(*P[i], *c)))


def ecken_runden(pts, grenze, rand, d_max=3.0, sehne=0.3):
    """Mindestradius: Wo sich die Richtung zwischen den Sehnen sehne km vor und nach einem Punkt um mehr als grenze
    Grad ändert (Ecken des Natural-Earth-Polygonzugs, Anschlüsse über Stadtstraßen), wird ein Fenster um den Punkt
    durch einen Hermite-Bogen ersetzt, tangential an den Weg davor und danach; das Fenster wächst, bis der Bogen die
    Grenze hält (höchstens d_max km je Seite). Die ersten und letzten rand km bleiben (Übergänge an den Knoten).
    Gibt (Punkte, Liste der Rundungen (km, Grad vorher, Fensterlänge)), Liste der verbliebenen Ecken (km, Grad))
    zurück."""
    P = list(pts)
    gerundet = []
    rest = []

    def ecken(Q, sq):
        out = []
        for i in range(1, len(Q) - 1):
            if sehne <= sq[i] <= sq[-1] - sehne:
                w = _drehung_um(Q, sq, i, sehne)
                if w > grenze:
                    out.append((w, i))
        return out

    for _ in range(60):
        s = kum(P)
        L = s[-1]
        kandidaten = [(w, i) for w, i in ecken(P, s) if all(abs(s[i] - x) > 0.5 for x, _ in rest)]
        if not kandidaten:
            break
        w, k = max(kandidaten)
        neu = None
        for D in (0.6, 0.9, 1.2, 1.6, 2.0, 2.5, d_max):
            s0, s1 = max(rand, s[k] - D), min(L - rand, s[k] + D)
            if s1 - s0 < 2 * sehne:
                break
            A, B = punkt_bei(P, s0, s), punkt_bei(P, s1, s)
            tA = richtung(P, s0 - 0.5 * sehne, s, 0.5 * sehne)
            tB = richtung(P, s1 + 0.5 * sehne, s, 0.5 * sehne)
            e = Eben(*A)
            bx, by = e.xy(*B)
            c = math.hypot(bx, by)
            bogen = hermite((0.0, 0.0), (tA[0] * c, tA[1] * c), (bx, by), (tB[0] * c, tB[1] * c),
                            max(4, int(math.ceil((s1 - s0) / 0.1))))
            j0 = sum(1 for x in s if x < s0 - 1e-9)
            j1 = sum(1 for x in s if x <= s1 + 1e-9)
            Q = P[:j0] + [A] + [e.ll(x, y) for x, y in bogen[:-1]] + [B] + P[j1:]
            sq = kum(Q)
            b0, b1 = sq[j0] - sehne, sq[j0 + len(bogen)] + sehne  # Bogen von A (Index j0) bis B samt Sehnen
            if all(not (b0 <= sq[i] <= b1) for _, i in ecken(Q, sq)):
                neu = Q
                gerundet.append((s[k], w, s1 - s0))
                break
        if neu is None:
            rest.append((s[k], w))
        else:
            P = neu
    return P, gerundet, rest


def abrunden(pts, grenze=45.0, t_max=0.8):
    """Rundet Ecken über grenze Grad mit einem quadratischen Bézierbogen ab (Tangentenlänge höchstens t_max km
    und 45 % der anliegenden Abschnitte); Anfangs- und Endpunkt bleiben."""
    P = list(pts)
    out = [P[0]]
    for i in range(1, len(P) - 1):
        a, b, c = P[i - 1], P[i], P[i + 1]
        la, lc = hav(*a, *b), hav(*b, *c)
        if la < 1e-6 or lc < 1e-6 or abs(winkel_diff(kurs(*a, *b), kurs(*b, *c))) <= grenze:
            out.append(b)
            continue
        t = min(t_max, 0.45 * la, 0.45 * lc)
        e = Eben(*b)
        ax, ay = e.xy(*a)
        cx, cy = e.xy(*c)
        p0 = (ax * t / la, ay * t / la)
        p2 = (cx * t / lc, cy * t / lc)
        n = 8
        for k in range(n + 1):
            u = k / n
            x = (1 - u) ** 2 * p0[0] + u * u * p2[0]
            y = (1 - u) ** 2 * p0[1] + u * u * p2[1]
            out.append(e.ll(x, y))
    out.append(P[-1])
    return out
