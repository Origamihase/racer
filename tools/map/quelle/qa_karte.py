# Zeichnet Prüfbilder (Pillow): Land, Grenzen, Natural-Earth-Straßen, unsere Etappen nach Abgleich-Status,
# Knoten, Ortsnamen, Legende und Maßstab. Projektion Mercator (winkeltreu, wie die Höhenkacheln). Gezeichnet wird
# doppelt so groß und dann verkleinert (Kantenglättung).
import math

import numpy as np
from PIL import Image, ImageDraw, ImageFont

SCHRIFT = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
SCHRIFT_FETT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'

WASSER = (206, 224, 238)
LAND = (244, 241, 230)
KUESTE = (150, 165, 180)


def schrift(px, fett=False):
    try:
        return ImageFont.truetype(SCHRIFT_FETT if fett else SCHRIFT, px)
    except OSError:
        return ImageFont.load_default(size=px)


def merc(lat):
    """Mercator-Ordinate in „Grad“ (wie die Länge skaliert)."""
    phi = math.radians(max(-85.0, min(85.0, lat)))
    return math.degrees(math.log(math.tan(math.pi / 4 + phi / 2)))


def merc_inv(y):
    return math.degrees(2 * math.atan(math.exp(math.radians(y))) - math.pi / 2)


def _weich(z, sigma):
    """Trennbarer Gaußfilter (σ in Bildpixeln) mit Randwiederholung."""
    if sigma < 0.6:
        return z
    r = int(math.ceil(3 * sigma))
    k = np.exp(-0.5 * (np.arange(-r, r + 1) / sigma) ** 2)
    k /= k.sum()
    p = np.pad(z, r, mode='edge')
    p = np.apply_along_axis(lambda v: np.convolve(v, k, mode='valid'), 1, p)
    return np.apply_along_axis(lambda v: np.convolve(v, k, mode='valid'), 0, p)


class Karte:
    def __init__(self, lat0, lat1, lon0, lon1, breite=1800, ss=2):
        self.lat0, self.lat1, self.lon0, self.lon1 = lat0, lat1, lon0, lon1
        self.ss = ss
        self.y0 = merc(lat1)
        self.w = breite
        self.h = int(round(breite * (merc(lat1) - merc(lat0)) / (lon1 - lon0)))
        self.f = self.w * ss / (lon1 - lon0)  # Pixel (groß) je Grad Länge
        self.img = Image.new('RGB', (self.w * ss, self.h * ss), WASSER)
        self.dr = ImageDraw.Draw(self.img)
        latc = merc_inv((merc(lat0) + merc(lat1)) / 2)
        self.latc = latc
        self.km_px = self.w / ((lon1 - lon0) * 111.32 * math.cos(math.radians(latc)))  # Endbild-Pixel je km (Mitte)
        self.belegt = []  # Rechtecke gesetzter Beschriftungen und Kästen (groß)
        self.rahmen = []  # Rechtecke von Titel, Legende und Maßstab (groß): dort keine Punkte mehr
        self.namen = set()  # schon beschriftete Namen (Orte und Knoten nicht doppelt)

    def xy(self, lat, lon):
        return ((lon - self.lon0) * self.f, (self.y0 - merc(lat)) * self.f)

    def ll(self, x, y):
        """Pixel (groß) → (lat, lon)."""
        return merc_inv(self.y0 - y / self.f), self.lon0 + x / self.f

    def innen(self, lat, lon, rand=0.0):
        return self.lat0 - rand <= lat <= self.lat1 + rand and self.lon0 - rand <= lon <= self.lon1 + rand

    def frei(self, lat, lon):
        """Liegt der Punkt außerhalb von Titel, Legende und Maßstab?"""
        x, y = self.xy(lat, lon)
        return not any(q[0] <= x <= q[2] and q[1] <= y <= q[3] for q in self.rahmen)

    def _rahmen(self, r):
        self.belegt.append(r)
        self.rahmen.append(r)

    def sichtbar(self, pts, rand=0.2):
        la = [p[0] for p in pts]
        lo = [p[1] for p in pts]
        return not (max(la) < self.lat0 - rand or min(la) > self.lat1 + rand or max(lo) < self.lon0 - rand or min(lo) > self.lon1 + rand)

    # --- Hintergrund -------------------------------------------------------------------------------
    def land(self, polygone, farbe=LAND, rand=KUESTE):
        for poly in polygone:
            outer = poly[0]
            if not self.sichtbar([(p[1], p[0]) for p in outer[:: max(1, len(outer) // 50)]], 2):
                continue
            self.dr.polygon([self.xy(y, x) for x, y in outer], fill=farbe)
            for hole in poly[1:]:
                self.dr.polygon([self.xy(y, x) for x, y in hole], fill=WASSER)
        for poly in polygone:
            for r in poly:
                if not self.sichtbar([(p[1], p[0]) for p in r[:: max(1, len(r) // 50)]], 2):
                    continue
                self.dr.line([self.xy(y, x) for x, y in r], fill=rand, width=max(1, self.ss))

    def schummerung(self, hoehe_fn, landmaske=None, staerke=0.55, faerben=True, zelle_km=0.0):
        """Schummerung und Höhenfarben aus einem Höhenmodell. hoehe_fn(lat, lon) mit numpy-Feldern → Meter (NaN =
        unbekannt), zelle_km: Pixelgröße des Höhenmodells. Gerechnet wird auf dem Endbild-Raster und dann
        hochskaliert."""
        W, H = self.w, self.h
        xs = (np.arange(W) + 0.5) * self.ss
        ys = (np.arange(H) + 0.5) * self.ss
        lon = self.lon0 + xs / self.f
        yy = self.y0 - ys / self.f
        lat = np.degrees(2 * np.arctan(np.exp(np.radians(yy))) - np.pi / 2)
        LON, LAT = np.meshgrid(lon, lat)
        z = hoehe_fn(LAT, LON)
        bekannt = np.isfinite(z)
        if not bekannt.any():
            return False
        z = np.where(bekannt, z, np.nanmean(z[bekannt]))
        # Pixelgröße in Metern (Mercator: längentreu je Zeile mit cos(lat))
        px_m = 1000.0 / self.km_px * np.cos(np.radians(LAT)) / math.cos(math.radians(self.latc))
        # Das Höhenmodell ist gröber als das Bild (bilinear abgetastet, je Zelle eine Ebene): erst glätten,
        # sonst zeigt die Schummerung die Zellen als Kacheln
        z = _weich(z, 0.5 * zelle_km * self.km_px) if zelle_km else z
        gy, gx = np.gradient(z)
        gx = gx / px_m
        gy = -gy / px_m
        az, alt = math.radians(315), math.radians(42)
        slope = np.arctan(np.hypot(gx, gy) * 1.6)
        aspect = np.arctan2(gy, -gx)
        hs = np.sin(alt) * np.cos(slope) + np.cos(alt) * np.sin(slope) * np.cos(az - math.pi / 2 - aspect)
        hs = np.clip(hs, 0, 1)
        basis = np.asarray(self.img.resize((W, H), Image.BILINEAR), dtype=np.float64)
        land = basis.sum(axis=2) > sum(WASSER) + 6 if landmaske is None else landmaske
        if faerben:
            # Höhenfarben: grünliches Tiefland, ocker Mittelgebirge, graubraunes Hochgebirge
            stufen = np.array([0, 150, 400, 800, 1300, 1900, 2600, 3500], dtype=np.float64)
            farben = np.array([(208, 228, 196), (226, 236, 200), (238, 234, 198), (234, 218, 182), (220, 198, 168),
                               (200, 184, 166), (222, 218, 214), (246, 246, 248)], dtype=np.float64)
            tint = np.stack([np.interp(z, stufen, farben[:, k]) for k in range(3)], axis=2)
        else:
            tint = basis
        licht = np.clip(1.0 + 1.6 * staerke * (hs - math.sin(alt)), 0.5, 1.12)[:, :, None]
        neu = np.clip(tint * licht, 0, 255)
        mix = (land & bekannt)[:, :, None]
        out = np.where(mix, neu, basis).astype(np.uint8)
        self.img = Image.fromarray(out).resize(self.img.size, Image.BICUBIC)
        self.dr = ImageDraw.Draw(self.img)
        return True

    def grenzen(self, linien, farbe=(150, 130, 160)):
        for L in linien:
            pts = [(y, x) for x, y in L]
            if not self.sichtbar(pts, 1):
                continue
            self._strich([self.xy(*p) for p in pts], farbe, max(1, int(1.2 * self.ss)), 9 * self.ss, 5 * self.ss)

    def _strich(self, xy, farbe, breite, an, aus):
        """Gestrichelte Linie (Muster läuft über die Knicke hinweg weiter)."""
        periode = an + aus
        W, H = self.img.size
        D = 0.0
        for (x0, y0), (x1, y1) in zip(xy, xy[1:]):
            L = math.hypot(x1 - x0, y1 - y0)
            if L <= 0:
                continue
            if max(x0, x1) < -10 or min(x0, x1) > W + 10 or max(y0, y1) < -10 or min(y0, y1) > H + 10:
                D += L
                continue
            k = math.floor(D / periode)
            while k * periode < D + L:
                a = max(D, k * periode)
                b = min(D + L, k * periode + an)
                if b > a:
                    ta = (a - D) / L
                    tb = (b - D) / L
                    self.dr.line([(x0 + (x1 - x0) * ta, y0 + (y1 - y0) * ta), (x0 + (x1 - x0) * tb, y0 + (y1 - y0) * tb)], fill=farbe, width=breite)
                k += 1
            D += L

    # --- Linien und Punkte ---------------------------------------------------------------------------
    def linie(self, pts, farbe, breite=1.0, rund=True):
        if len(pts) < 2 or not self.sichtbar(pts):
            return
        xy = [self.xy(*p) for p in pts]
        b = max(1, int(round(breite * self.ss)))
        self.dr.line(xy, fill=farbe, width=b, joint='curve' if rund else None)
        if rund and b >= 3:
            r = b / 2
            for x, y in (xy[0], xy[-1]):
                self.dr.ellipse((x - r, y - r, x + r, y + r), fill=farbe)

    def strichlinie(self, pts, farbe, breite=1.0, an=6, aus=4):
        if len(pts) < 2 or not self.sichtbar(pts):
            return
        self._strich([self.xy(*p) for p in pts], farbe, max(1, int(round(breite * self.ss))), an * self.ss, aus * self.ss)

    def punkt(self, lat, lon, r=3.0, farbe=(30, 30, 30), rand=(255, 255, 255), rand_b=1.0):
        x, y = self.xy(lat, lon)
        R = r * self.ss
        self.dr.ellipse((x - R, y - R, x + R, y + R), fill=farbe, outline=rand, width=max(1, int(rand_b * self.ss)))

    def raute(self, lat, lon, r=4.0, farbe=(30, 30, 30), rand=(255, 255, 255)):
        x, y = self.xy(lat, lon)
        R = r * self.ss
        self.dr.polygon([(x, y - R), (x + R, y), (x, y + R), (x - R, y)], fill=farbe, outline=rand, width=max(1, self.ss))

    def text(self, lat, lon, s, px=13, farbe=(25, 25, 35), fett=False, dx=6, dy=-8, halo=(255, 255, 255), pflicht=False):
        """Beschriftung neben einem Punkt; weicht belegten Stellen aus (rechts, links, oben, unten)."""
        f = schrift(int(px * self.ss), fett)
        x, y = self.xy(lat, lon)
        box = self.dr.textbbox((0, 0), s, font=f)
        tw, th = box[2] - box[0], box[3] - box[1]
        ss = self.ss
        kand = [(dx, dy), (-dx - tw / ss, dy), (dx, -dy - th / ss + 4), (-dx - tw / ss, -dy - th / ss + 4),
                (-tw / ss / 2, -th / ss - 12), (-tw / ss / 2, 9)]
        for ox, oy in kand:
            X, Y = x + ox * ss, y + oy * ss
            r = (X - 3 * ss, Y - 2 * ss + box[1], X + tw + 3 * ss, Y + box[3] + 2 * ss)
            if r[0] < 0 or r[1] < 0 or r[2] > self.img.width or r[3] > self.img.height:
                continue
            if any(not (r[2] < q[0] or r[0] > q[2] or r[3] < q[1] or r[1] > q[3]) for q in self.belegt):
                continue
            self.belegt.append(r)
            self.dr.text((X, Y), s, font=f, fill=farbe, stroke_width=max(2, int(2.5 * ss)) if halo else 0, stroke_fill=halo)
            return True
        if pflicht:
            X = min(max(x + dx * ss, 2 * ss), self.img.width - tw - 2 * ss)
            Y = min(max(y + dy * ss, 2 * ss), self.img.height - th - 4 * ss)
            self.dr.text((X, Y), s, font=f, fill=farbe, stroke_width=max(2, int(2.5 * ss)), stroke_fill=halo)
        return False

    # --- Rahmen: Titel, Legende, Maßstab ---------------------------------------------------------------
    def kasten(self, x, y, zeilen, titel=None, px=14):
        """Kasten mit Einträgen (Endbild-Koordinaten, negativ = vom rechten/unteren Rand).
        zeilen: [(art, farbe, text)], art 'linie' | 'duenn' | 'strich' | 'punkt' | 'raute' | 'text' | 'grau'."""
        ss = self.ss
        f = schrift(int(px * ss))
        ft = schrift(int((px + 1) * ss), True)
        zh = int(px * 1.55 * ss)
        breite = max(self.dr.textlength(t, font=f) for _, _, t in zeilen) + 66 * ss  # Zeichen 52 px, Rand 14 px
        if titel:
            breite = max(breite, self.dr.textlength(titel, font=ft) + 24 * ss)
        hoehe = zh * len(zeilen) + (zh + 4 * ss if titel else 0) + 16 * ss
        X, Y = x * ss, y * ss
        if X < 0:
            X = self.img.width + X - breite
        if Y < 0:
            Y = self.img.height + Y - hoehe
        self.dr.rounded_rectangle((X, Y, X + breite, Y + hoehe), radius=8 * ss, fill=(255, 255, 255), outline=(120, 120, 130), width=ss)
        cy = Y + 9 * ss
        if titel:
            self.dr.text((X + 12 * ss, cy), titel, font=ft, fill=(20, 20, 30))
            cy += zh + 4 * ss
        for art, farbe, t in zeilen:
            mx = X + 12 * ss
            my = cy + zh // 2
            if art == 'linie':
                self.dr.line([(mx, my), (mx + 30 * ss, my)], fill=farbe, width=4 * ss)
            elif art == 'duenn':
                self.dr.line([(mx, my), (mx + 30 * ss, my)], fill=farbe, width=2 * ss)
            elif art == 'grau':
                self.dr.line([(mx, my), (mx + 30 * ss, my)], fill=farbe, width=max(1, int(1.5 * ss)))
            elif art == 'strich':
                self._strich([(mx, my), (mx + 30 * ss, my)], farbe, 3 * ss, 6 * ss, 4 * ss)
            elif art == 'punkt':
                r = 5 * ss
                self.dr.ellipse((mx + 15 * ss - r, my - r, mx + 15 * ss + r, my + r), fill=farbe, outline=(60, 60, 70), width=ss)
            elif art == 'raute':
                r = 6 * ss
                c = mx + 15 * ss
                self.dr.polygon([(c, my - r), (c + r, my), (c, my + r), (c - r, my)], fill=farbe, outline=(255, 255, 255))
            self.dr.text((mx + 40 * ss, my), t, font=f, fill=(20, 20, 30), anchor='lm')
            cy += zh
        self._rahmen((X, Y, X + breite, Y + hoehe))

    def titel(self, s, unter=None):
        ss = self.ss
        f = schrift(22 * ss, True)
        f2 = schrift(14 * ss)
        zeilen = unter if isinstance(unter, list) else ([unter] if unter else [])
        w = self.dr.textlength(s, font=f)
        w2 = max((self.dr.textlength(z, font=f2) for z in zeilen), default=0)
        B = max(w, w2) + 28 * ss
        H = (40 + 20 * len(zeilen)) * ss
        self.dr.rounded_rectangle((10 * ss, 10 * ss, 10 * ss + B, 10 * ss + H), radius=8 * ss, fill=(255, 255, 255), outline=(120, 120, 130), width=ss)
        self.dr.text((24 * ss, 18 * ss), s, font=f, fill=(20, 20, 30))
        for k, z in enumerate(zeilen):
            self.dr.text((24 * ss, (46 + 20 * k) * ss), z, font=f2, fill=(60, 60, 70))
        self._rahmen((10 * ss, 10 * ss, 10 * ss + B, 10 * ss + H))

    def massstab(self):
        ss = self.ss
        ziel = self.w * 0.18 / self.km_px
        mag = 10 ** math.floor(math.log10(ziel))
        km = max(m * mag for m in (1, 2, 5) if m * mag <= ziel)
        L = km * self.km_px * ss
        x0 = 22 * ss
        y0 = self.img.height - 24 * ss
        f = schrift(13 * ss)
        txt = f'{km:g} km'
        tw = self.dr.textlength(txt, font=f)
        self.dr.rounded_rectangle((x0 - 12 * ss, y0 - 28 * ss, x0 + L + tw / 2 + 12 * ss, y0 + 14 * ss), radius=6 * ss, fill=(255, 255, 255), outline=(120, 120, 130), width=ss)
        for i in range(4):
            a = x0 + L * i / 4
            b = x0 + L * (i + 1) / 4
            self.dr.rectangle((a, y0, b, y0 + 6 * ss), fill=(30, 30, 30) if i % 2 == 0 else (255, 255, 255), outline=(30, 30, 30), width=max(1, ss // 2))
        self.dr.text((x0, y0 - 4 * ss), '0', font=f, fill=(20, 20, 30), anchor='mb')
        self.dr.text((x0 + L, y0 - 4 * ss), txt, font=f, fill=(20, 20, 30), anchor='mb')
        self._rahmen((x0 - 12 * ss, y0 - 28 * ss, x0 + L + tw / 2 + 12 * ss, y0 + 14 * ss))

    def speichern(self, pfad):
        out = self.img.resize((self.w, self.h), Image.LANCZOS) if self.ss != 1 else self.img
        out.save(pfad, optimize=True)
        return pfad
