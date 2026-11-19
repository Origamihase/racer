# Höhen aus Terrain Tiles (Terrarium-PNG, Mapzen/AWS Open Data): Kacheln laden (höflich, mit Zwischenspeicher),
# bilinear abtasten und Längsprofile von Straßen säubern (Brücken, Tunnel, Spitzen, Glättung, Steigungsgrenze).
import json
import math
import os
import time
import urllib.error
import urllib.request

import numpy as np
from PIL import Image

URL = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
KENNUNG = 'MiniAdamRacerResearch/1.0'
MAX_KACHELN = 2000
TAKT = 0.25  # s zwischen zwei Anfragen: höchstens 4 je Sekunde
# Regeln, die Python und JS teilen (Steigungsgrenzen, Alpenbox), stehen einmal in regeln.json
with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'regeln.json'), encoding='utf-8') as _f:
    REGELN = json.load(_f)
# In den Alpen sind die Täler enger als ein Pixel bei Zoom 8 (gut 300 m): dort Zoom 9.
ALPEN = tuple(REGELN['alpen'])  # Breite von/bis, Länge von/bis
SCHRITT = 0.2  # km Abstand der Höhenproben entlang einer Form
# Steigungsgrenzen der Straßenarten (ROUTES §3.4; dieselben Zahlen halten export.mjs und shape-test.mjs) und die
# Grenze beim Säubern der Profile, mit einem halben Prozentpunkt Luft für das Runden auf Meter
STEIGUNG_GRENZE = dict(REGELN['steigung'])
STEIGUNG = {k: round(v - 0.005, 4) for k, v in STEIGUNG_GRENZE.items()}
# Täler, die schmaler sind als das, überspannt die Straße (Talbrücke) statt hinab- und wieder hinaufzufahren
BRUECKE_KM = {'ab': 1.0, 'land': 0.6}

# Lange Straßentunnel (Portale als Breite/Länge): dort gilt die Höhe der Portale statt des Bergs darüber.
# Die Lagen sind von Hand und ungenau: nur Gotthard, Katschberg und Bosruck bestehen die Portalprüfung
# (verlauf.log; am Bosruck lagen beide Portale rund 7 km zu weit im Südosten, bei Ardning und Selzthal). Auf
# keiner Etappe des Netzes liegen Gleinalm und Plabutsch (A9AT: die Linie liegt weiter als 1,5 km neben den
# Portalen, die Etappe endet in Graz), Rennsteig (die A71 südlich von Erfurt fehlt im Netz), Mont-Blanc und Fréjus
# (keine Straße des Netzes); sie bleiben für künftige Straßen stehen.
TUNNEL = [
    ('Gotthard-Straßentunnel', (46.6655, 8.5885), (46.5275, 8.6105)),
    ('San-Bernardino-Tunnel', (46.5335, 9.1805), (46.4845, 9.1880)),
    ('Seelisbergtunnel', (46.9715, 8.5130), (46.9175, 8.5905)),
    ('Arlbergtunnel', (47.1305, 10.1170), (47.1425, 10.2705)),
    ('Tauerntunnel', (47.2665, 13.4045), (47.1715, 13.4765)),
    ('Katschbergtunnel', (47.0835, 13.5995), (47.0435, 13.6155)),
    ('Karawankentunnel', (46.4855, 14.0175), (46.4395, 14.0525)),
    ('Gleinalmtunnel', (47.2455, 15.0610), (47.2045, 15.1345)),
    ('Plabutschtunnel', (47.1005, 15.3880), (47.0335, 15.3945)),
    ('Bosrucktunnel', (47.6480, 14.3370), (47.6000, 14.3640)),
    ('Rennsteigtunnel', (50.6545, 10.7180), (50.6080, 10.7810)),
    ('Lærdalstunnel', (60.8865, 7.2945), (61.0575, 7.4825)),
    ('Gudvangatunnel', (60.8745, 6.8445), (60.8885, 7.0345)),
    ('Mont-Blanc-Tunnel', (45.9015, 6.8765), (45.8165, 6.9525)),
    ('Fréjus-Straßentunnel', (45.1995, 6.6615), (45.0955, 6.6995)),
]


def in_alpen(lat, lon):
    """Liegt der Punkt in der Alpenbox (Zahlen → bool, numpy-Felder → Maske)?"""
    a = ALPEN
    if np.ndim(lat) == 0 and np.ndim(lon) == 0:
        return a[0] <= lat <= a[1] and a[2] <= lon <= a[3]
    lat, lon = np.asarray(lat), np.asarray(lon)
    return (lat >= a[0]) & (lat <= a[1]) & (lon >= a[2]) & (lon <= a[3])


def _pixel(lat, lon, z):
    """Globale Pixelkoordinate (Mitte des Pixels = ganze Zahl + 0,5) in Web-Mercator bei Zoom z."""
    n = 256 * 2 ** z
    x = (lon + 180.0) / 360.0 * n
    phi = math.radians(max(-85.0, min(85.0, lat)))
    y = (1.0 - math.asinh(math.tan(phi)) / math.pi) / 2.0 * n
    return x, y


class Gelaende:
    """Höhenmodell aus Terrarium-Kacheln (Zwischenspeicher im Ordner ordner/{z}/{x}/{y}.png)."""

    def __init__(self, ordner, log):
        self.ordner = ordner
        self.log = log
        self.kacheln = {}
        self.geholt = 0
        self.letzte = 0.0

    @staticmethod
    def zoom(lat, lon):
        return 9 if in_alpen(lat, lon) else 8

    def pfad(self, z, x, y):
        return os.path.join(self.ordner, str(z), str(x), f'{y}.png')

    def benoetigt(self, punkte):
        """Kacheln, die die bilineare Abtastung der Punkte braucht."""
        out = set()
        for lat, lon in punkte:
            z = self.zoom(lat, lon)
            x, y = _pixel(lat, lon, z)
            for px in (x - 0.5, x + 0.5):
                for py in (y - 0.5, y + 0.5):
                    out.add((z, int(px // 256) % 2 ** z, max(0, min(2 ** z - 1, int(py // 256)))))
        return out

    def im_speicher(self):
        """Zahl der Kacheln im Zwischenspeicher (alle Zoomstufen): die Obergrenze gilt für den ganzen Speicher."""
        return sum(len(f) for _, _, f in os.walk(self.ordner))

    def vorbereiten(self, punkte):
        """Lädt fehlende Kacheln (höchstens MAX_KACHELN im ganzen Speicher, 4 Anfragen je Sekunde, Pausen bei
        Fehlern)."""
        alle = sorted(self.benoetigt(punkte))
        fehlen = [k for k in alle if not os.path.exists(self.pfad(*k))]
        if fehlen and self.im_speicher() + len(fehlen) > MAX_KACHELN:
            raise RuntimeError(f'{len(fehlen)} Kacheln fehlen, der Speicher hat schon {self.im_speicher()}, '
                               f'erlaubt sind {MAX_KACHELN}')
        self.log(f'Höhenkacheln: {len(alle)} nötig, {len(fehlen)} zu laden')
        for k in fehlen:
            self._hole(*k)
        return len(alle), len(fehlen)

    def _hole(self, z, x, y):
        ziel = self.pfad(z, x, y)
        os.makedirs(os.path.dirname(ziel), exist_ok=True)
        anfrage = urllib.request.Request(URL.format(z=z, x=x, y=y), headers={'User-Agent': KENNUNG})
        pause = 2.0
        for versuch in range(6):
            warten = self.letzte + TAKT - time.monotonic()
            if warten > 0:
                time.sleep(warten)
            self.letzte = time.monotonic()
            try:
                with urllib.request.urlopen(anfrage, timeout=60) as antwort:
                    daten = antwort.read()
                if not daten.startswith(b'\x89PNG'):
                    raise ValueError('keine PNG-Datei')
                with open(ziel + '.teil', 'wb') as f:
                    f.write(daten)
                os.replace(ziel + '.teil', ziel)
                self.geholt += 1
                return
            except (urllib.error.URLError, OSError, ValueError) as fehler:
                self.log(f'  Kachel {z}/{x}/{y}: {fehler}, neuer Versuch in {pause:.0f} s')
                time.sleep(pause)
                pause *= 2
        raise RuntimeError(f'Kachel {z}/{x}/{y} nicht ladbar')

    def _kachel(self, z, x, y):
        k = (z, x, y)
        h = self.kacheln.get(k)
        if h is None:
            if not os.path.exists(self.pfad(z, x, y)):
                # Nachladen bei Bedarf (Talsuche quer zur Linie), mit derselben Obergrenze für den ganzen Speicher
                vorhanden = self.im_speicher()
                if vorhanden >= MAX_KACHELN:
                    raise RuntimeError(f'Kachel {z}/{x}/{y} fehlt, der Speicher hat schon {vorhanden} Kacheln')
                self._hole(z, x, y)
            with Image.open(self.pfad(z, x, y)) as im:
                a = np.asarray(im.convert('RGB'), dtype=np.float64)
            h = a[:, :, 0] * 256.0 + a[:, :, 1] + a[:, :, 2] / 256.0 - 32768.0
            self.kacheln[k] = h
        return h

    def _wert(self, z, gx, gy):
        n = 2 ** z
        gy = max(0, min(256 * n - 1, gy))
        gx %= 256 * n
        return self._kachel(z, gx // 256, gy // 256)[gy % 256, gx % 256]

    def hoehe(self, lat, lon):
        """Höhe in Metern, bilinear zwischen den vier nächsten Pixelmitten."""
        z = self.zoom(lat, lon)
        x, y = _pixel(lat, lon, z)
        x -= 0.5
        y -= 0.5
        x0, y0 = math.floor(x), math.floor(y)
        fx, fy = x - x0, y - y0
        h00 = self._wert(z, x0, y0)
        h10 = self._wert(z, x0 + 1, y0)
        h01 = self._wert(z, x0, y0 + 1)
        h11 = self._wert(z, x0 + 1, y0 + 1)
        return (h00 * (1 - fx) + h10 * fx) * (1 - fy) + (h01 * (1 - fx) + h11 * fx) * fy

    def _werte(self, z, gx, gy):
        """Pixelwerte für ganzzahlige globale Pixelkoordinaten (Felder), Kachel für Kachel."""
        n = 2 ** z
        gy = np.clip(gy, 0, 256 * n - 1)
        gx = np.mod(gx, 256 * n)
        tx, ty = gx // 256, gy // 256
        out = np.empty(gx.shape)
        for k in np.unique(tx * n + ty):
            m = (tx * n + ty) == k
            out[m] = self._kachel(z, int(k // n), int(k % n))[gy[m] % 256, gx[m] % 256]
        return out

    def hoehen_np(self, lat, lon):
        """Höhen (m) vieler Punkte auf einmal, bilinear; dazu je Punkt, ob die vier Pixel genau gleich hoch sind
        (Seen und Meer sind im Höhenmodell vollkommen eben, Gelände nie)."""
        lat = np.asarray(lat, dtype=np.float64)
        lon = np.asarray(lon, dtype=np.float64)
        h = np.empty(lat.shape)
        eben = np.zeros(lat.shape, dtype=bool)
        alpen = in_alpen(lat, lon)
        for z, m in ((9, alpen), (8, ~alpen)):
            if not m.any():
                continue
            nz = 256 * 2 ** z
            x = (lon[m] + 180.0) / 360.0 * nz - 0.5
            phi = np.radians(np.clip(lat[m], -85.0, 85.0))
            y = (1.0 - np.arcsinh(np.tan(phi)) / math.pi) / 2.0 * nz - 0.5
            x0, y0 = np.floor(x).astype(np.int64), np.floor(y).astype(np.int64)
            fx, fy = x - x0, y - y0
            h00 = self._werte(z, x0, y0)
            h10 = self._werte(z, x0 + 1, y0)
            h01 = self._werte(z, x0, y0 + 1)
            h11 = self._werte(z, x0 + 1, y0 + 1)
            h[m] = (h00 * (1 - fx) + h10 * fx) * (1 - fy) + (h01 * (1 - fx) + h11 * fx) * fy
            ecken = np.stack([h00, h10, h01, h11])
            eben[m] = (ecken.max(axis=0) - ecken.min(axis=0)) < 0.02
        return h, eben


# --- Profile säubern -------------------------------------------------------------------------------------
def _fenster(z, r, op):
    """Gleitendes Minimum/Maximum über ±r Proben."""
    if r <= 0:
        return z.copy()
    n = len(z)
    pad = np.concatenate([np.full(r, z[0]), z, np.full(r, z[-1])])
    st = np.lib.stride_tricks.sliding_window_view(pad, 2 * r + 1)
    return op(st, axis=1)[:n]


def _luecken_fuellen(z, gueltig):
    """Ungültige Proben (Wasser, Meeresboden) linear zwischen den gültigen Nachbarn ersetzen."""
    if gueltig.all():
        return z
    if not gueltig.any():
        return np.zeros_like(z)
    idx = np.arange(len(z))
    return np.interp(idx, idx[gueltig], z[gueltig])


def _gauss(z, sigma):
    if sigma <= 0:
        return z
    r = int(math.ceil(3 * sigma))
    k = np.exp(-0.5 * (np.arange(-r, r + 1) / sigma) ** 2)
    k /= k.sum()
    pad = np.concatenate([np.full(r, z[0]), z, np.full(r, z[-1])])
    return np.convolve(pad, k, mode='valid')


def _steigung_begrenzen(z, ds, g):
    """Mittel aus der größten Funktion unter z und der kleinsten über z, deren Steigung höchstens g ist
    (zwei Durchläufe je Richtung): bleibt symmetrisch und hebt Kuppen so weit, wie es Senken senkt."""
    d = g * ds * 1000.0
    U = z.copy()
    for i in range(1, len(U)):
        U[i] = min(U[i], U[i - 1] + d)
    for i in range(len(U) - 2, -1, -1):
        U[i] = min(U[i], U[i + 1] + d)
    L = z.copy()
    for i in range(1, len(L)):
        L[i] = max(L[i], L[i - 1] - d)
    for i in range(len(L) - 2, -1, -1):
        L[i] = max(L[i], L[i + 1] - d)
    return 0.5 * (U + L)


def profil(z, wasser, ds, art, tunnel=()):
    """Säubert ein roh abgetastetes Längsprofil (gleichmäßige Proben im Abstand ds km).
    wasser: Proben über Meer oder großen Seen; tunnel: Paare (i, j) von Probenindizes der Portale."""
    z = np.asarray(z, dtype=np.float64)
    gueltig = ~np.asarray(wasser, dtype=bool) & (z > -20.0)
    z = _luecken_fuellen(z, gueltig)
    for i, j in tunnel:
        z[i:j + 1] = np.linspace(z[i], z[j], j - i + 1)
    # Einzelne Pixelspitzen (Talhang neben der Straße) abtragen: Öffnen über 0,4 km
    r = max(1, int(round(0.2 / ds)))
    z = _fenster(_fenster(z, r, np.min), r, np.max)
    # Schmale Täler überbrücken: Schließen über BRUECKE_KM
    r = max(1, int(round(BRUECKE_KM[art] / 2 / ds)))
    z = _fenster(_fenster(z, r, np.max), r, np.min)
    z = _gauss(z, 0.3 / ds)
    return _steigung_begrenzen(z, ds, STEIGUNG[art])


def tunnel_auf_form(pts, s, lot, fang=1.5):
    """Tunnel der Liste, deren beide Portale höchstens fang km neben der Form liegen. s: Bogenlängen der Form;
    lot(pts, lat, lon, s) liefert (Bogenlänge, Abstand km, Punkt). Ergebnis: [(Name, s_von, s_bis)]."""
    la = [p[0] for p in pts]
    lo = [p[1] for p in pts]
    # Vorfilter über das umschließende Rechteck: ein Längengrad ist bei der polfernsten Breite am kürzesten
    # (feste 70 km waren in Norwegen ein Viertel zu schmal)
    rl = fang / 110.5
    ro = fang / (111.32 * max(0.05, math.cos(math.radians(max(abs(min(la)), abs(max(la)))))))
    out = []
    for name, p, q in TUNNEL:
        if not all(min(la) - rl <= x[0] <= max(la) + rl and min(lo) - ro <= x[1] <= max(lo) + ro for x in (p, q)):
            continue
        sp, dp, _ = lot(pts, p[0], p[1], s)
        sq, dq, _ = lot(pts, q[0], q[1], s)
        if dp <= fang and dq <= fang and abs(sq - sp) > 0.5:
            out.append((name, min(sp, sq), max(sp, sq)))
    return out
