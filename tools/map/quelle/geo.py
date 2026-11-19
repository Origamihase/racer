# Gemeinsame Geometrie für die Straßenverläufe: Abstände, Kurs, ebene Näherung, Polylinien-Kodierung,
# Land und Wasser aus Natural Earth (TopoJSON). Nur Standardbibliothek und numpy.
import json
import math

import numpy as np

R_ERDE = 6371.0
RAD = math.pi / 180


def hav(lat1, lon1, lat2, lon2):
    """Großkreisabstand in km."""
    h = math.sin((lat2 - lat1) * RAD / 2) ** 2 + math.cos(lat1 * RAD) * math.cos(lat2 * RAD) * math.sin((lon2 - lon1) * RAD / 2) ** 2
    return 2 * R_ERDE * math.asin(min(1.0, math.sqrt(h)))


def kurs(lat1, lon1, lat2, lon2):
    """Kurswinkel in Grad (0 = Norden, im Uhrzeigersinn), wie bearing() in src/map/graph.js."""
    y = math.sin((lon2 - lon1) * RAD) * math.cos(lat2 * RAD)
    x = math.cos(lat1 * RAD) * math.sin(lat2 * RAD) - math.sin(lat1 * RAD) * math.cos(lat2 * RAD) * math.cos((lon2 - lon1) * RAD)
    return (math.atan2(y, x) / RAD + 360) % 360


def winkel_diff(a, b):
    """Kleinster Unterschied zweier Kurse in Grad (−180 … 180, positiv = nach rechts)."""
    return (b - a + 540) % 360 - 180


class Eben:
    """Ebene Näherung um einen Bezugspunkt: (lat, lon) ↔ (x, y) in km, x nach Osten, y nach Norden."""

    def __init__(self, lat0, lon0):
        self.lat0 = lat0
        self.lon0 = lon0
        self.kx = 111.32 * math.cos(lat0 * RAD)
        self.ky = 110.574

    def xy(self, lat, lon):
        return ((lon - self.lon0) * self.kx, (lat - self.lat0) * self.ky)

    def ll(self, x, y):
        return (self.lat0 + y / self.ky, self.lon0 + x / self.kx)


def punkt_strecke(px, py, ax, ay, bx, by):
    """Abstand eines Punktes von der Strecke a–b und Parameter t (0…1) des Lotfußpunkts (ebene Koordinaten)."""
    dx, dy = bx - ax, by - ay
    l2 = dx * dx + dy * dy
    t = 0.0 if l2 <= 0 else max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / l2))
    qx, qy = ax + t * dx, ay + t * dy
    return math.hypot(px - qx, py - qy), t


def abstand_polylinie(lat, lon, pts):
    """Kleinster Abstand (km) eines Punktes von einer Polylinie [(lat, lon), …]."""
    e = Eben(lat, lon)
    best = 1e18
    prev = e.xy(*pts[0])
    if len(pts) == 1:
        return math.hypot(*prev)
    for q in pts[1:]:
        cur = e.xy(*q)
        d, _ = punkt_strecke(0.0, 0.0, prev[0], prev[1], cur[0], cur[1])
        best = min(best, d)
        prev = cur
    return best


# --- Polylinien-Kodierung (Verfahren wie Google Encoded Polyline, beliebig viele Spalten) -----------------
def kodiere_zahl(v, out):
    v = ~(v << 1) if v < 0 else v << 1
    while v >= 0x20:
        out.append(chr((0x20 | (v & 0x1F)) + 63))
        v >>= 5
    out.append(chr(v + 63))


def kodiere(reihen):
    """reihen: Liste von Ganzzahl-Tupeln (gleiche Länge). Gibt die Differenzen als Zeichenkette zurück."""
    out = []
    prev = [0] * len(reihen[0])
    for r in reihen:
        for i, v in enumerate(r):
            kodiere_zahl(v - prev[i], out)
        prev = list(r)
    return ''.join(out)


# --- Natural Earth als TopoJSON (world-atlas) --------------------------------------------------------------
def ueber_datumsgrenze(ring):
    """Ringe, die die Datumsgrenze kreuzen (Eurasien an der Beringstraße, Fidschi), springen von +180° auf −180°.
    Eben gezeichnet zöge jeder Sprung eine Kante um die ganze Erde, und die Füllung kippte nördlich davon (ganz
    Lappland wäre Wasser). Solche Ringe laufen deshalb stetig über ±180° hinaus weiter; nur ein Ring um den Pol
    (Antarktis, ein einziger Sprung) bleibt, wie er ist."""
    out = [ring[0]] if ring else []
    versatz = 0.0
    gesprungen = False
    for (x0, _), (x1, y1) in zip(ring, ring[1:]):
        if abs(x1 - x0) > 180:
            versatz += 360.0 if x0 > x1 else -360.0
            gesprungen = True
        out.append((x1 + versatz, y1))
    if not gesprungen or versatz != 0.0:
        return ring
    # Der größte Teil des Rings gehört nach −180° … 180° (Eurasien beginnt östlich der Beringstraße und läge sonst
    # bei −380° … −180°)
    mitte = sorted(x for x, _ in out)[len(out) // 2]
    k = 360.0 * round(mitte / 360.0)
    return [(x - k, y) for x, y in out]


def topo_polygone(pfad, objekt, mit_namen=False):
    """Liest Polygone eines TopoJSON-Objekts: Liste von (Name, [Ring als [(lon, lat), …], …])."""
    with open(pfad, encoding='utf-8') as f:
        topo = json.load(f)
    sx, sy = topo['transform']['scale']
    tx, ty = topo['transform']['translate']
    arcs = []
    for arc in topo['arcs']:
        x = y = 0
        pts = []
        for dx, dy in arc:
            x += dx
            y += dy
            pts.append((x * sx + tx, y * sy + ty))
        arcs.append(pts)

    def ring(idx):
        pts = []
        for a in idx:
            seg = arcs[a] if a >= 0 else arcs[~a][::-1]
            pts.extend(seg if not pts else seg[1:])
        return ueber_datumsgrenze(pts)

    out = []
    for g in topo['objects'][objekt]['geometries']:
        name = (g.get('properties') or {}).get('name', '')
        polys = g['arcs'] if g['type'] == 'MultiPolygon' else ([g['arcs']] if g['type'] == 'Polygon' else [])
        for poly in polys:
            out.append((name, [ring(r) for r in poly]))
    return out if mit_namen else [p for _, p in out]


def topo_grenzen(pfad, objekt='countries'):
    """Grenzlinien (Bögen, die zwei Länder trennen) als Liste von [(lon, lat), …]."""
    with open(pfad, encoding='utf-8') as f:
        topo = json.load(f)
    sx, sy = topo['transform']['scale']
    tx, ty = topo['transform']['translate']
    zaehler = {}
    for g in topo['objects'][objekt]['geometries']:
        polys = g['arcs'] if g['type'] == 'MultiPolygon' else ([g['arcs']] if g['type'] == 'Polygon' else [])
        for poly in polys:
            for r in poly:
                for a in r:
                    k = a if a >= 0 else ~a
                    zaehler[k] = zaehler.get(k, 0) + 1
    out = []
    for k, n in sorted(zaehler.items()):
        if n < 2:
            continue
        x = y = 0
        pts = []
        for dx, dy in topo['arcs'][k]:
            x += dx
            y += dy
            pts.append((x * sx + tx, y * sy + ty))
        out.append(pts)
    return out


class LandMaske:
    """Rasterisierte Landmaske für einen Ausschnitt (Pillow), Abfrage per Breite/Länge."""

    def __init__(self, polygone, lat0, lat1, lon0, lon1, px_pro_grad=60):
        from PIL import Image, ImageDraw

        self.lat0, self.lat1, self.lon0, self.lon1 = lat0, lat1, lon0, lon1
        self.f = px_pro_grad
        w = max(2, int(math.ceil((lon1 - lon0) * px_pro_grad)))
        h = max(2, int(math.ceil((lat1 - lat0) * px_pro_grad)))
        img = Image.new('1', (w, h), 0)
        dr = ImageDraw.Draw(img)
        for poly in polygone:
            outer = poly[0]
            xs = [p[0] for p in outer]
            ys = [p[1] for p in outer]
            if max(xs) < lon0 or min(xs) > lon1 or max(ys) < lat0 or min(ys) > lat1:
                continue
            dr.polygon([((x - lon0) * px_pro_grad, (lat1 - y) * px_pro_grad) for x, y in outer], fill=1)
            for hole in poly[1:]:
                dr.polygon([((x - lon0) * px_pro_grad, (lat1 - y) * px_pro_grad) for x, y in hole], fill=0)
        self.m = np.asarray(img, dtype=bool)
        self.w, self.h = w, h

    def land(self, lat, lon):
        # abrunden wie land_np (int() schnitte links und oben vom Rand zur Mitte hin ab)
        x = math.floor((lon - self.lon0) * self.f)
        y = math.floor((self.lat1 - lat) * self.f)
        if x < 0 or y < 0 or x >= self.w or y >= self.h:
            return False
        return bool(self.m[y, x])

    def land_np(self, lat, lon):
        """Wie land(), für ganze Felder von Breiten und Längen."""
        x = np.floor((np.asarray(lon) - self.lon0) * self.f).astype(np.int64)
        y = np.floor((self.lat1 - np.asarray(lat)) * self.f).astype(np.int64)
        innen = (x >= 0) & (y >= 0) & (x < self.w) & (y < self.h)
        out = np.zeros(x.shape, dtype=bool)
        out[innen] = self.m[y[innen], x[innen]]
        return out
