// Stadt-Baukasten, Teil Wahrzeichen: liebevoll vereinfachte Spielzeugfassungen der Bauwerke, an denen man einen Ort
// sofort erkennt – keine Nachbauten, sondern das, was man aus dem Auto in einer Sekunde wiedererkennt: Umriss, die
// zwei, drei Merkmale, die Farben. Jedes ist ein Einzelstück (kit.build(name)) mit
//   info = { w, d, h, far, places, slot, title }
//   far    – true: Skyline-Stück, gedacht für einige hundert Meter Abstand,
//   places – Ortsschlüssel (Wiki-Namen der Karte), zu denen es gehört,
//   slot   – wo es im Ort steht: 'square' (Rückwand des Hauptplatzes, schaut zur Straße), 'plaza' (auf dem Platz),
//            'skyline' (hinter den Häuserzeilen), 'river' (über einem Fluss; bringt sein Wasser selbst mit, siehe
//            opts.water), 'open' (frei im Land neben der Straße).
// Ursprung wie bei den Häusern: Mitte der Vorderkante, das Stück reicht nach −z, die Schauseite blickt nach +z.
// Alles liegt in den Eimern F (matt) und G (Scheiben, Bänder, Gold), Wasser in W: höchstens vier Draw Calls je Stück.
// Jedes Stück hat eine Fernfassung (kit.build(name, { far: true })) mit weniger Teilung und ohne Kleinteile.
// Sakralbauten und Denkmäler erscheinen neutral und respektvoll als Architektur; nichts wird verulkt.
import * as THREE from 'three';
import { PAL, CITY, mix, makeKit, compose } from './citycore.js';
import { arch, archWin, clock } from './town.js';
import { ballTree } from './parts.js';
import { sizeOf, regionOf, hashKey } from './layout.js';
import { registerAbroad } from './abroad.js';

const TAU = Math.PI * 2;

// --- Grundrisse: Punktlisten [[x, z], …] ----------------------------------------------------------------------

/** Doppelte Fläche mit Vorzeichen; positiv heißt: die Seitennormalen (dz, −dx) zeigen nach außen. */
function area2(pts) {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const q = pts[(i + 1) % pts.length];
    a += pts[i][0] * q[1] - q[0] * pts[i][1];
  }
  return a;
}
const outward = (pts) => (area2(pts) < 0 ? [...pts].reverse() : pts);

/** Rechteck w × d um (cx, cz), Ecken um c abgeschrägt (c = 0: scharf). */
function chamfer(w, d, c = 0, cx = 0, cz = 0) {
  const a = w / 2;
  const e = d / 2;
  if (c <= 0) return [[cx - a, cz - e], [cx + a, cz - e], [cx + a, cz + e], [cx - a, cz + e]];
  return [
    [cx - a + c, cz - e], [cx + a - c, cz - e], [cx + a, cz - e + c], [cx + a, cz + e - c],
    [cx + a - c, cz + e], [cx - a + c, cz + e], [cx - a, cz + e - c], [cx - a, cz - e + c],
  ];
}

/** Rechteck w × d um (cx, cz) mit runden Ecken (Radius r, k Teilungen je Ecke). */
function rrect(w, d, r, k = 3, cx = 0, cz = 0) {
  const rr = Math.min(r, w / 2 - 1e-3, d / 2 - 1e-3);
  if (rr <= 1e-3 || k < 1) return chamfer(w, d, 0, cx, cz);
  const a = w / 2 - rr;
  const e = d / 2 - rr;
  const out = [];
  for (const [x, z, t0] of [[a, -e, -Math.PI / 2], [a, e, 0], [-a, e, Math.PI / 2], [-a, -e, Math.PI]]) {
    for (let i = 0; i <= k; i++) {
      const t = t0 + (i / k) * (Math.PI / 2);
      out.push([cx + x + Math.cos(t) * rr, cz + z + Math.sin(t) * rr]);
    }
  }
  return out;
}

/** Regelmäßiges n-Eck mit Umkreisradius R, um a0 gedreht (a0 = 0: eine Ecke bei +x); rc > 0 rundet die Ecken. */
function ngon(n, R, a0 = 0, rc = 0, k = 2, cx = 0, cz = 0) {
  const out = [];
  const half = Math.PI / n;
  for (let i = 0; i < n; i++) {
    const a = a0 + (i / n) * TAU;
    if (rc <= 0 || k < 1) {
      out.push([cx + Math.cos(a) * R, cz + Math.sin(a) * R]);
      continue;
    }
    // Mitte des Eckbogens liegt auf der Ecklinie, rc / cos(π/n) vor der Ecke
    const m = R - rc / Math.cos(half);
    for (let j = 0; j <= k; j++) {
      const t = a - half + (j / k) * 2 * half;
      out.push([cx + Math.cos(a) * m + Math.cos(t) * rc, cz + Math.sin(a) * m + Math.sin(t) * rc]);
    }
  }
  return out;
}
const circle = (r, n, cx = 0, cz = 0) => ngon(n, r, 0, 0, 0, cx, cz);
/** Halbkreisscheibe um (cx, cz): die gerade Seite liegt bei z = cz, der Bogen wölbt sich nach dir·z (±1). */
const halfDisc = (r, n, cx, cz, dir) => Array.from({ length: n + 1 }, (_, i) => [cx + Math.cos((i / n) * Math.PI) * r, cz + dir * Math.sin((i / n) * Math.PI) * r]);

/** Grundriss um e nach außen versetzt (Gehrung an den Ecken). */
function grow(pts, e) {
  const p = outward(pts);
  const n = p.length;
  const nrm = p.map((a, i) => {
    const q = p[(i + 1) % n];
    const l = Math.hypot(q[0] - a[0], q[1] - a[1]) || 1;
    return [(q[1] - a[1]) / l, -(q[0] - a[0]) / l];
  });
  return p.map(([x, z], i) => {
    const a = nrm[(i + n - 1) % n];
    const b = nrm[i];
    const s = e / Math.max(0.25, 1 + a[0] * b[0] + a[1] * b[1]);
    return [x + (a[0] + b[0]) * s, z + (a[1] + b[1]) * s];
  });
}

/** Grundriss um die Senkrechte drehen (a, wie ry: von +z nach +x) und verschieben. */
function move(pts, dx, dz, a = 0) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return pts.map(([x, z]) => [dx + x * c + z * s, dz - x * s + z * c]);
}
const scaleP = (pts, sx, sz = sx) => pts.map(([x, z]) => [x * sx, z * sz]);

// --- Körper aus Grundrissen ------------------------------------------------------------------------------------

/**
 * Körper aus waagrechten Ringen gleicher Punktzahl, von unten nach oben: rings = [[pts, y], …]; y darf auch eine
 * Funktion (x, z) → y sein (schräge Dächer). Ein Ring darf zu einem Punkt schrumpfen (Spitzen). Seiten knicken
 * scharf, außer zwischen Nachbarseiten, deren Normalen weniger abweichen als o.smooth (cos des Winkels, 0,7 ≈ 45°).
 * o.top / o.bottom: Deckel (oben standardmäßig zu), o.capCol: seine Farbe. o.g: Verlauf [unten, oben] über alle
 * Ringe. col: eine Farbe oder eine je Band.
 */
function loft(part, rings, col, o = {}) {
  const n = rings[0][0].length;
  const solid = rings.find(([p]) => Math.abs(area2(p)) > 1e-9);
  const rev = solid ? area2(solid[0]) < 0 : false;
  const R = rings.map(([pts, y]) => (rev ? [...pts].reverse() : pts).map(([x, z]) => [x, typeof y === 'function' ? y(x, z) : y, z]));
  let lo = Infinity;
  let hi = -Infinity;
  for (const r of R) {
    for (const p of r) {
      lo = Math.min(lo, p[1]);
      hi = Math.max(hi, p[1]);
    }
  }
  const oo = { ...o, gy: [lo, hi] };
  const crease = o.smooth ?? 2;
  for (let r = 0; r + 1 < R.length; r++) {
    const A = R[r];
    const B = R[r + 1];
    const fn = [];
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      let ex = A[j][0] - A[i][0];
      let ez = A[j][2] - A[i][2];
      if (ex * ex + ez * ez < 1e-12) {
        ex = B[j][0] - B[i][0];
        ez = B[j][2] - B[i][2];
      }
      const ux = (B[i][0] + B[j][0] - A[i][0] - A[j][0]) / 2;
      const uy = (B[i][1] + B[j][1] - A[i][1] - A[j][1]) / 2;
      const uz = (B[i][2] + B[j][2] - A[i][2] - A[j][2]) / 2;
      // u × e zeigt bei positiver Fläche nach außen
      const nx = uy * ez;
      const ny = uz * ex - ux * ez;
      const nz = -uy * ex;
      const l = Math.hypot(nx, ny, nz) || 1;
      fn.push([nx / l, ny / l, nz / l]);
    }
    const soft = (f, g) => {
      if (f[0] * g[0] + f[1] * g[1] + f[2] * g[2] <= crease) return f;
      const x = f[0] + g[0];
      const y = f[1] + g[1];
      const z = f[2] + g[2];
      const l = Math.hypot(x, y, z) || 1;
      return [x / l, y / l, z / l];
    };
    const P = [];
    const N = [];
    const idx = [];
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const a = soft(fn[i], fn[(i + n - 1) % n]);
      const c = soft(fn[i], fn[j]);
      const q = P.length / 3;
      P.push(...A[i], ...A[j], ...B[j], ...B[i]);
      N.push(...a, ...c, ...c, ...a);
      idx.push(q, q + 1, q + 2, q, q + 2, q + 3);
    }
    part.mesh(P, N, idx, Array.isArray(col) ? col[r] : col, oo);
  }
  const cap = (ring, up, c) => {
    const flat = ring.map(([x, , z]) => [x, z]);
    if (Math.abs(area2(flat)) < 1e-6) return;
    const tris = THREE.ShapeUtils.triangulateShape(flat.map(([x, z]) => new THREE.Vector2(x, z)), []);
    const idx = [];
    for (const [a, b, d] of tris) {
      const p = ring[a];
      const q = ring[b];
      const s = ring[d];
      const ny = (q[2] - p[2]) * (s[0] - p[0]) - (q[0] - p[0]) * (s[2] - p[2]);
      if (ny > 0 === up) idx.push(a, b, d);
      else idx.push(a, d, b);
    }
    part.mesh(ring.flat(), null, idx, c, oo);
  };
  const last = Array.isArray(col) ? col[col.length - 1] : col;
  if (o.top !== false) cap(R[R.length - 1], true, o.capCol ?? last);
  if (o.bottom) cap(R[0], false, Array.isArray(col) ? col[0] : col);
  return part;
}

/** Senkrechtes Prisma über dem Grundriss pts von y0 bis y1 (Optionen wie loft). */
const prism = (part, pts, y0, y1, col, o) => loft(part, [[pts, y0], [pts, y1]], col, o);

/** Spitze: Grundriss pts bei y0, läuft bis zur Höhe y1 in den Punkt (ax, az) zusammen (Pyramiden, Helme). */
const spire = (part, pts, y0, y1, col, o = {}) => loft(part, [[pts, y0], [pts.map(() => [o.ax ?? 0, o.az ?? 0]), y1]], col, { ...o, top: false });

/**
 * Fensterbänder rund um einen senkrechten Körper mit Grundriss pts (G, glänzend): ab y0 alle step Meter ein Band
 * der Höhe h, solange es unter y1 endet; o.e Meter vor der Wand, o.smooth wie bei loft.
 */
function bands(b, pts, y0, y1, step, h, col, o = {}) {
  const ring = grow(pts, o.e ?? 0.08);
  for (let y = y0; y + h <= y1 + 1e-6; y += step) loft(b.G, [[ring, y], [ring, y + h]], col, { smooth: o.smooth ?? 0.7, top: false, g: o.g });
}

/**
 * Senkrechte Fensterschlitze (G) auf jeder Seite von pts, die länger als o.min (4 m) ist: Breite sw, Abstand step,
 * von y0 bis y1, o.e Meter vor der Wand, mindestens o.margin vom Seitenende.
 */
function slots(b, pts, y0, y1, step, sw, col, o = {}) {
  const p = outward(pts);
  const e = o.e ?? 0.08;
  const margin = o.margin ?? step / 2;
  for (let i = 0; i < p.length; i++) {
    const a = p[i];
    const q = p[(i + 1) % p.length];
    const L = Math.hypot(q[0] - a[0], q[1] - a[1]);
    if (L < (o.min ?? 4)) continue;
    const dx = (q[0] - a[0]) / L;
    const dz = (q[1] - a[1]) / L;
    const nx = dz;
    const nz = -dx;
    const m = Math.floor((L - 2 * margin) / step) + 1;
    if (m < 1) continue;
    const t0 = (L - (m - 1) * step) / 2;
    for (let k = 0; k < m; k++) {
      const t = t0 + k * step;
      const cx = a[0] + dx * t + nx * e;
      const cz = a[1] + dz * t + nz * e;
      const hx = (dx * sw) / 2;
      const hz = (dz * sw) / 2;
      b.G.mesh([cx - hx, y0, cz - hz, cx + hx, y0, cz + hz, cx + hx, y1, cz + hz, cx - hx, y1, cz - hz], [nx, 0, nz, nx, 0, nz, nx, 0, nz, nx, 0, nz], [0, 1, 2, 0, 2, 3], col, o);
    }
  }
}

/** Schlanker Mast (Dreikant, verjüngt) von (x, y, z) aus h Meter hoch, mit roter Spitze. */
function mast(b, x, y, z, h, r0, r1, col = 0xd6d8dc) {
  loft(b.F, [[ngon(3, r0, Math.PI / 2, 0, 0, x, z), y], [ngon(3, r1, Math.PI / 2, 0, 0, x, z), y + h]], col, { smooth: 0.4 });
  if (!b.lod) b.F.ball(x, y + h, z, Math.max(0.35, r1 * 1.2), PAL.red, { ws: 6, hs: 3 });
}

// --- Farben ----------------------------------------------------------------------------------------------------
const GLASS = mix(PAL.glass, PAL.glassDark, 0.35);
const WATER = 0x7cc8ec;
const QUAY = 0xc7b9a6;

const defs = {};
/** Ortsschlüssel → Namen der Wahrzeichen, die zu ihm gehören (in der Reihenfolge der Anmeldung). */
const BY_PLACE = new Map();
/** Name → { places, slot, far, title }: ohne Bauen abfragbar (für Ortsplan und Node-Test). */
const META = {};
/** Name des Wahrzeichens, das gerade gebaut wird (für terrainEdges). */
let building = null;

/**
 * Wahrzeichen anmelden: make(b, lod) baut und gibt die Maße zurück; meta = { places, slot, far, title, spins, extras }; extras(kit) liefert Texttafeln (eigene Meshes).
 * spins: Teile, die sich drehen (Mühlenflügel, Riesenrad): [{ at: [x, y, z], ry, speed, axis, make(b, lod) }] – make
 * baut um die eigene Nabe (Drehachse axis, sonst z mit Blick nach +z), at und ry setzen die Nabe ins Stück, speed in
 * rad/s. Dann liefert build eine Gruppe mit userData.update(t), die der Ort jedes Bild aufruft.
 */
function landmark(name, meta, make) {
  META[name] = { places: meta.places, slot: meta.slot, far: !!meta.far, title: meta.title };
  for (const p of meta.places) {
    if (!BY_PLACE.has(p)) BY_PLACE.set(p, []);
    BY_PLACE.get(p).push(name);
  }
  defs[name] = {
    kind: 'landmark',
    far: true,
    fade: meta.fade ?? 4,
    low: meta.low ?? 0.82,
    make: (b, lod) => {
      building = name;
      try {
        return { ...make(b, lod), places: meta.places, slot: meta.slot, far: !!meta.far, title: meta.title, animated: !!meta.spins };
      } finally {
        building = null;
      }
    },
    extras: meta.extras,
  };
  if (!meta.spins) return;
  meta.spins.forEach((sp, i) => {
    defs[name + ':spin' + i] = { kind: 'part', far: true, fade: meta.fade ?? 4, low: meta.low ?? 0.82, make: (b, lod) => (sp.make(b, lod), { w: 1, d: 1, h: 1 }) };
  });
  defs[name].build = (kit, opts = {}) => {
    const far = !!opts.far;
    const g = compose(kit.core, [{ g: kit.geo(name, far) }]);
    const rotors = meta.spins.map((sp, i) => {
      const hub = new THREE.Group();
      hub.position.set(...sp.at);
      hub.rotation.y = sp.ry ?? 0;
      const rot = new THREE.Group();
      for (const c of compose(kit.core, [{ g: kit.geo(name + ':spin' + i, far) }]).children) rot.add(c);
      hub.add(rot);
      g.add(hub);
      return rot;
    });
    g.userData.info = kit.geo(name, far).info;
    /** Drehen: t = Zeit in Sekunden. */
    g.userData.update = (t) => meta.spins.forEach((sp, i) => (rotors[i].rotation[sp.axis ?? 'z'] = (sp.phase ?? 0) + t * sp.speed));
    g.userData.update(0);
    return g;
  };
}

// =============================================================================================================
// Frankfurt am Main: Skyline („Mainhattan“), Römer, Eiserner Steg
// =============================================================================================================
// Die Skyline nach research/landmarks/frankfurt: Reihenfolge von Süden (vom Main aus) gesehen, Höhen × 0,85, Breiten
// wie echt, die Abstände zusammengeschoben (sonst wäre das Stück 1,6 km breit). Jeder Turm trägt seine Krone in
// voller Größe, damit man ihn auf 1–2 km an Umriss und Farbe erkennt.

/** Messeturm („Bleistift“): rotbrauner Granit, Ecken treppenartig eingezogen, oben Zylinder und spitze Pyramide. */
function messeturm(b) {
  const { F, G } = b;
  const near = !b.lod;
  const red = 0xa9503f;
  F.box(0, 0, 0, 54, 20, 54, 0x9c4a3c);
  prism(F, rrect(40, 40, 1.5, 2), 20, 62, red, { smooth: 0.8, g: [0.86, 0.95] });
  // Mittelteil: Ecken in zwei Stufen eingezogen (Zikkurat)
  const mid = stepCorners(20, 3);
  prism(F, mid, 62, 150, red, { g: [0.95, 1.02] });
  const cyl = circle(18, near ? 28 : 16);
  prism(F, cyl, 150, 184, mix(red, 0xffffff, 0.06), { smooth: 0.8 });
  // Pyramide: hellgraues Blech, etwas steiler als 45°
  spire(F, chamfer(34, 34), 184, 214, 0xe2ddd8, { g: [0.9, 1.08] });
  F.cyl(0, 214, 0, 0.35, 0.1, 5, 0xd8d2cc, { seg: 4 });
  // Fensterschlitze als senkrechte Streifen
  const slot = 0x5b6880;
  slots(b, rrect(40, 40, 1.5, 2), 22, 61, near ? 4 : 8, near ? 1.4 : 2.6, slot, { margin: 4 });
  slots(b, mid, 64, 148, near ? 4 : 8, near ? 1.4 : 2.6, slot, { margin: 2.5, min: 9 });
  bands(b, cyl, 152, 182, near ? 4 : 8, near ? 1.6 : 3, slot, { smooth: 0.8 });
  if (near) {
    // Stufen des Mittelteils bekommen dunkle Fugen, damit man sie aus der Ferne liest
    bands(b, rrect(54, 54, 0.1, 1), 17.5, 18.5, 4, 1, 0x8f4538, { e: 0.06 });
    G.box(0, 0.2, 27.1, 12, 6, 0.3, GLASS);
  }
  return { w: 54, d: 54, h: 219 };
}

/** Grundriss mit treppenartig eingezogenen Ecken: Quadrat 2a, je Ecke zwei Stufen der Tiefe s. */
function stepCorners(a, s) {
  const q = [[a - 2 * s, -a], [a - 2 * s, -a + s], [a - s, -a + s], [a - s, -a + 2 * s], [a, -a + 2 * s]];
  const out = [];
  for (let k = 0; k < 4; k++) {
    const ang = (k * Math.PI) / 2;
    const c = Math.cos(ang);
    const sn = Math.sin(ang);
    // Viertel drehen: (x, z) → (x c − z s, x s + z c), der Reihe nach ergibt das einen geschlossenen Umriss
    for (const [x, z] of q) out.push([x * c - z * sn, x * sn + z * c]);
  }
  return out;
}

/** Tower 185: hohe helle Scheibe, durch ein rundes Glasrückgrat geteilt, auf einem Hufeisen-Sockel. */
function tower185(b) {
  const { F } = b;
  const near = !b.lod;
  const alu = 0xaebfd2;
  const H = 170;
  // Hufeisen-Sockel, offen nach vorn
  const u = [[-30, 6], [-30, -38], [30, -38], [30, 6], [20, 6], [20, -26], [-20, -26], [-20, 6]];
  prism(F, u, 0, 18, 0xcfc3b0, { g: [0.88, 1] });
  for (const sx of [-1, 1]) {
    const half = rrect(20, 30, 2.5, 2, sx * 13, -16);
    prism(F, half, 0, H, alu, { smooth: 0.8, g: [0.86, 1.04] });
    bands(b, half, 20, H - 2, near ? 4.6 : 9.2, near ? 1.6 : 3, 0x7f93a8);
  }
  // Rückgrat vorn und hinten: halbe Glaszylinder in der Fuge, wölben sich vor die Fronten
  for (const [z, dir] of [[-1, 1], [-31, -1]]) prism(F, halfDisc(6.5, near ? 8 : 4, 0, z, dir), 0, H + 3, 0x7fa4c4, { smooth: 0.6 });
  F.box(0, H, -16, 38, 0.8, 26, 0xc9ced4);
  return { w: 60, d: 44, h: H + 3 };
}

/** Westendstraße 1 („Kronenhochhaus“): heller Granit, Fächer aus elf Strahlen als Krone. */
function kronenhochhaus(b) {
  const { F } = b;
  const near = !b.lod;
  const cream = 0xe9dcc4;
  F.box(0, 0, -16, 40, 18, 40, 0xd9c7ac);
  const shaft = rrect(30, 30, 2.5, 2, 0, -16);
  prism(F, shaft, 18, 150, cream, { smooth: 0.8, g: [0.9, 1.04] });
  prism(F, rrect(27, 27, 2, 2, 0, -16), 150, 156, cream);
  prism(F, rrect(24, 24, 2, 2, 0, -16), 156, 161, cream);
  bands(b, shaft, 21, 148, near ? 4 : 8, near ? 1.8 : 3.4, 0x6d7e93);
  // Krone: elf spitze Strahlen fächern sich über dem Dach in einem Halbkreis (zur Schauseite hin)
  const n = near ? 11 : 6;
  const cx = 0;
  const cy = 159;
  const cz = -16;
  for (let i = 0; i < n; i++) {
    const a = Math.PI * (0.06 + (0.88 * i) / (n - 1));
    const dx = -Math.cos(a);
    const dy = Math.sin(a);
    const r0 = 6;
    const len = 17;
    const t = near ? 1.5 : 2.2;
    const A = [cx + dx * r0, cy + dy * r0, cz];
    const tip = [cx + dx * (r0 + len), cy + dy * (r0 + len) * 0.85, cz + 1.5];
    // Strahl als flacher Keil: zwei Dreiecke vorn, zwei hinten
    const px = -dy * t;
    const py = dx * t;
    const L = [A[0] + px, A[1] + py, cz + 1.2];
    const Rr = [A[0] - px, A[1] - py, cz + 1.2];
    const Lb = [A[0] + px, A[1] + py, cz - 1.2];
    const Rb = [A[0] - px, A[1] - py, cz - 1.2];
    F.tri(L, Rr, tip, 0xf2f2f4);
    F.tri(Rb, Lb, tip, 0xe2e2e6);
    F.tri(Lb, L, tip, 0xe8e8ec, { k: 0.95 });
    F.tri(Rr, Rb, tip, 0xe8e8ec, { k: 0.95 });
  }
  return { w: 40, d: 40, h: 176 };
}

/** Trianon: schlankes Dreiecksprisma mit feinen senkrechten Streifen, oben ein umgedrehter Pyramidenstumpf. */
function trianon(b) {
  const { F } = b;
  const near = !b.lod;
  const H = 150;
  const R = 28;
  const tri = ngon(3, R, Math.PI / 2, 3, near ? 2 : 1, 0, -14);
  F.box(0, 0, -14, 46, 12, 40, 0xbfb5a5);
  prism(F, tri, 12, H, 0xcdbfa9, { smooth: 0.8, g: [0.9, 1.05] });
  slots(b, ngon(3, R, Math.PI / 2, 0, 0, 0, -14), 14, H - 2, near ? 2.6 : 5.2, near ? 1 : 2, 0x6f8296, { margin: 5 });
  // Eckprismen, ein Stück höher
  for (let k = 0; k < 3; k++) {
    const a = Math.PI / 2 + (k * TAU) / 3;
    prism(F, ngon(3, 6, a, 0, 0, Math.cos(a) * (R - 5.5), -14 + Math.sin(a) * (R - 5.5)), H, H + 6, 0xcdbfa9);
  }
  // Krone: Trichter nach außen, flacher Deckel
  loft(F, [[ngon(3, R - 6, Math.PI / 2, 0, 0, 0, -14), H], [ngon(3, R * 1.22, Math.PI / 2, 0, 0, 0, -14), H + 13]], 0x4c566a, { capCol: 0x5c6678 });
  return { w: 46, d: 44, h: H + 13 };
}

/** Zwillingstürme (Deutsche Bank): zwei Spiegelglas-Scheiben mit abgeschrägten Ecken, gegeneinander versetzt. */
function zwillinge(b) {
  const { F } = b;
  const near = !b.lod;
  const H = 132;
  prism(F, chamfer(66, 40, 6, 0, -22), 0, 14, 0xc9c6be, { g: [0.9, 1] });
  for (const [x, z] of [[-15, -14], [15, -26]]) {
    const pts = chamfer(26, 24, 6.5, x, z);
    prism(F, pts, 14, H, 0x6f9bb0, { g: [0.8, 1.08] });
    bands(b, pts, 16, H - 1, near ? 5.25 : 10.5, near ? 0.8 : 1.4, 0xdfe8ec, { e: 0.06 });
    F.box(x, H, z, 18, 1.4, 16, 0xb8bec4);
  }
  return { w: 66, d: 42, h: H + 1.4 };
}

/** Skyper: Viertelkreis-Turm, die runde Seite schaut nach Südosten; davor die alte Villa mit Schieferdach. */
function skyper(b) {
  const { F, G } = b;
  const near = !b.lod;
  const R = 34;
  const H = 128;
  const ring = [[-R / 2, -R / 2 - 4]];
  const n = near ? 14 : 7;
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * (Math.PI / 2);
    ring.push([-R / 2 + Math.cos(t) * R, -R / 2 - 4 + Math.sin(t) * R]);
  }
  // Dach schräg angeschnitten: zur runden Seite hin 7 m niedriger
  const top = (x, z) => H - 7 * Math.min(1, Math.hypot(x + R / 2, z + R / 2 + 4) / R);
  loft(F, [[ring, 0], [ring, top]], 0x8fb0cc, { smooth: 0.8, g: [0.84, 1.06] });
  for (let y = 6; y < H - 10; y += near ? 5.4 : 10.8) loft(G, [[grow(ring, 0.08), y], [grow(ring, 0.08), y + (near ? 0.7 : 1.3)]], 0xe3e8ea, { smooth: 0.8, top: false });
  if (near) {
    // Villa mit Walmdach vor dem Turm
    F.box(-16, 0, 6, 18, 11, 12, 0xeadfc8);
    b.hip(-16, 11, 6, 18, 12, 4.5, 0x7c8696, { oe: 0.6 });
    for (let i = 0; i < 4; i++) for (const y of [2, 6.5]) G.rect(-22.5 + i * 4.3, y, 12.02, 1.4, 2.2, GLASS);
  }
  return { w: 36, d: 42, h: H };
}

/** Silberturm: breiter, ruhiger Körper mit silbernen Bändern und dunklen Fensterbändern. */
function silberturm(b) {
  const { F } = b;
  const near = !b.lod;
  const H = 141;
  const pts = chamfer(46, 30, 4, 0, -15);
  prism(F, pts, 0, H, 0xc4c9cf, { g: [0.86, 1.06] });
  bands(b, pts, 3, H - 2, near ? 4.4 : 8.8, near ? 2 : 4, 0x4a5664);
  F.box(30, 0, -12, 18, 22, 22, 0xbdb8b0, { g: [0.9, 1] });
  return { w: 66, d: 30, h: H };
}

/** Opernturm: sandfarbener Stein, senkrechte Fensterschlitze, kleine zurückgesetzte Krone. */
function opernturm(b) {
  const { F, G } = b;
  const near = !b.lod;
  const H = 145;
  F.box(0, 0, -18, 40, 22, 36, 0xe0cc9e, { g: [0.9, 1] });
  const pts = rrect(34, 30, 1.5, 1, 0, -18);
  prism(F, pts, 22, H, 0xe2c98f, { g: [0.9, 1.04] });
  slots(b, chamfer(34, 30, 0, 0, -18), 24, H - 3, near ? 4 : 8, near ? 2 : 3.6, 0x6f8199, { margin: 3 });
  prism(F, rrect(28, 24, 1, 1, 0, -18), H, H + 8, 0xd9c79b);
  if (near) for (const x of [-9, 0, 9]) G.extrude(arch(x, 5, 0, 9, 6), 0, 0.12, 0x6f8199, { caps: 'f', sides: false });
  return { w: 40, d: 36, h: H + 8 };
}

/** Main Tower: runder blauer Glasturm mit Plattform und Mast, daneben ein flacherer Glasquader, Steinsockel. */
function mainTower(b) {
  const { F } = b;
  const near = !b.lod;
  const H = 168;
  F.box(0, 0, -20, 50, 22, 40, 0xd8be95, { g: [0.88, 1] });
  const cyl = circle(19, near ? 28 : 16, -4, -24);
  prism(F, cyl, 22, H, 0x3a69a8, { smooth: 0.8, g: [0.85, 1.08] });
  bands(b, cyl, 26, H - 6, near ? 7.5 : 15, near ? 1.5 : 2.6, 0x7da3d6, { smooth: 0.8 });
  // Plattformring kurz unter dem Dach
  prism(F, circle(20.3, near ? 28 : 16, -4, -24), H - 4.5, H - 2.2, 0xe3e6ea, { smooth: 0.8 });
  mast(b, -4, H, -24, 36, 1.4, 0.4);
  const box = rrect(30, 22, 2, 2, 12, -10);
  prism(F, box, 22, 112, 0x7fa6cf, { smooth: 0.8, g: [0.86, 1.04] });
  bands(b, box, 24, 110, near ? 6 : 12, near ? 1.6 : 3, 0x557eae);
  return { w: 50, d: 44, h: H + 36 };
}

/** Commerzbank Tower („Dreiecksturm“): hellblaues Dreieck mit runden Eckpfeilern, grüne Gärten, Mast. */
function dreiecksturm(b) {
  const { F, G } = b;
  const near = !b.lod;
  const H = 220;
  const R = 32;
  const cz = -30;
  F.box(0, 0, cz + 4, 66, 26, 56, 0xcdbda8, { g: [0.88, 1] });
  const body = ngon(3, R - 3, Math.PI / 2, 0, 0, 0, cz);
  prism(F, body, 26, H, 0x96b9d4, { g: [0.84, 1.06] });
  bands(b, body, 28, H - 2, near ? 6.3 : 12.6, near ? 1.6 : 3, 0x6489a8);
  // Gärten: grüne Fenster über 4 Geschosse, wandern alle 25 m eine Seite weiter
  for (let k = 0; 30 + k * 24 + 12 < H; k++) {
    const y = 30 + k * 24;
    const f = k % 3;
    const a0 = Math.PI / 2 + (f * TAU) / 3;
    const a1 = a0 + TAU / 3;
    const p0 = [Math.cos(a0) * (R - 3), cz + Math.sin(a0) * (R - 3)];
    const p1 = [Math.cos(a1) * (R - 3), cz + Math.sin(a1) * (R - 3)];
    const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
    // Außennormale der Seite (dz, −dx); b.at dreht +z auf (sin ry, cos ry)
    const nx = (p1[1] - p0[1]) / len;
    const nz = -(p1[0] - p0[0]) / len;
    b.at((p0[0] + p1[0]) / 2, 0, (p0[1] + p1[1]) / 2, Math.atan2(nx, nz), () => G.rect(0, y, 0.25, len * 0.72, 14, 0x5f9e55, { g: [0.9, 1.1] }));
  }
  // Eckpfeiler: hell, rund, stehen etwas vor; einer läuft höher und trägt den Mast
  for (let k = 0; k < 3; k++) {
    const a = Math.PI / 2 + (k * TAU) / 3;
    const x = Math.cos(a) * (R - 4);
    const z = cz + Math.sin(a) * (R - 4);
    const top = k === 2 ? H + 14 : H + (k === 1 ? 6 : 0);
    prism(F, circle(5.2, near ? 12 : 8, x, z), 26, top, 0xe4e8ec, { smooth: 0.8, g: [0.9, 1.04] });
    if (k === 2) mast(b, x, top, z, 36, 1.6, 0.5, 0xc8ccd2);
  }
  return { w: 66, d: 60, h: H + 50 };
}

/** Eurotower: schlichter Betonriegel mit Fensterbändern (älter, niedriger, am Ostrand der Gruppe). */
function eurotower(b) {
  const near = !b.lod;
  const pts = chamfer(30, 20, 1.5, 0, -10);
  prism(b.F, pts, 0, 126, 0xb5aea2, { g: [0.86, 1.04] });
  bands(b, pts, 4, 124, near ? 3.6 : 7.2, near ? 1.6 : 3, 0x4a5664);
  return { w: 30, d: 20, h: 126 };
}

/** FOUR T1: gedrehter Glasturm mit runden Ecken (jeder Ring ein wenig weiter gedreht). */
function fourT1(b) {
  const near = !b.lod;
  const rings = [];
  const n = near ? 9 : 5;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    rings.push([move(rrect(28, 26, 8, near ? 3 : 2), 0, -14, t * 0.42), t * 196]);
  }
  loft(b.F, rings, 0x7fae9f, { smooth: 0.8, g: [0.84, 1.06] });
  for (let i = 1; i < n; i += near ? 1 : 2) {
    const t = i / n;
    loft(b.G, [[grow(move(rrect(28, 26, 8, near ? 3 : 2), 0, -14, t * 0.42), 0.1), t * 196 - 1], [grow(move(rrect(28, 26, 8, near ? 3 : 2), 0, -14, t * 0.42), 0.1), t * 196 + 1]], 0xc9e0da, { smooth: 0.8, top: false });
  }
  return { w: 32, d: 30, h: 196 };
}

/** Omniturm: schlanker Glasquader, dessen Mitte wie ein Hüftschwung zur Seite rückt. */
function omniturm(b) {
  const near = !b.lod;
  const col = 0xb8c6d4;
  const rings = [[0, 0], [0, 62], [4, 68], [4, 92], [0, 98], [0, 161]];
  const pts = (dx) => rrect(28, 26, 1.5, 1, dx, -13);
  loft(b.F, rings.map(([dx, y]) => [pts(dx), y]), col, { g: [0.86, 1.05] });
  for (let y = 4; y < 158; y += near ? 4 : 8) {
    const dx = y > 64 && y < 96 ? 4 : 0;
    if ((y > 58 && y < 70) || (y > 88 && y < 100)) continue;
    loft(b.G, [[grow(pts(dx), 0.08), y], [grow(pts(dx), 0.08), y + (near ? 1.5 : 2.8)]], 0x6f8296, { top: false });
  }
  return { w: 32, d: 26, h: 161 };
}

/** Europaturm („Ginnheimer Spargel“): dünner Schaft, linsenförmiger Korb mit Fensterband, Gittermast. */
function europaturm(b) {
  const { F, G } = b;
  const near = !b.lod;
  const seg = near ? 16 : 10;
  F.lathe(0, 0, 0, [[13, 0], [11, 40], [8, 150], [7.6, 186]], 0xd6cfc2, { seg, top: false });
  F.lathe(0, 186, 0, [[7.6, 0], [22, 7], [23, 10], [22, 13], [16, 18], [7, 20]], 0xb9b4ac, { seg: near ? 24 : 12 });
  G.lathe(0, 194.5, 0, [[23.15, 0], [23.15, 2.6]], 0x6f7d8b, { seg: near ? 24 : 12, top: false });
  F.lathe(0, 206, 0, [[6.5, 0], [5.5, 14]], 0xcfc8bc, { seg });
  mast(b, 0, 220, 0, 67, 2.6, 0.7, 0xd3d5d8);
  return { w: 46, d: 46, h: 287 };
}

/** Füllturm: schlichte Scheibe mit Bändern. */
function filler(b, w, d, h, col, band) {
  const pts = rrect(w, d, 1.5, 1, 0, -d / 2);
  prism(b.F, pts, 0, h, col, { g: [0.86, 1.05] });
  bands(b, pts, 4, h - 2, b.lod ? 12 : 6, b.lod ? 3.4 : 2, band);
}

// Lage der Türme im Stück (x nach Osten, z nach Süden = zur Schauseite), aus den echten Ost-/Nord-Abständen
// zusammengeschoben; die Reihenfolge von Süden gesehen bleibt.
const FFM = [
  ['europaturm', -232, -330, europaturm],
  ['messeturm', -190, -78, messeturm],
  ['tower185', -128, -42, tower185],
  ['westend1', -72, -30, kronenhochhaus],
  ['trianon', -24, -118, trianon],
  ['zwillinge', 32, -150, zwillinge],
  ['skyper', -8, -6, skyper],
  ['silberturm', 44, 0, silberturm],
  ['opernturm', 84, -232, opernturm],
  ['four', 120, -168, fourT1],
  ['mainTower', 116, -84, mainTower],
  ['omniturm', 172, -128, omniturm],
  ['dreiecksturm', 170, -44, dreiecksturm],
  ['eurotower', 222, -6, eurotower],
  ['taunusturm', 76, -60, (b) => filler(b, 26, 22, 144, 0x7c9cb0, 0x52687c)],
  ['gallileo', 206, -86, (b) => filler(b, 24, 22, 116, 0xbcc6cf, 0x66788c)],
];

/** Innenstadt zwischen den Türmen: heller Boden und niedrige Blöcke mit Dachgärten, damit die Gruppe nicht auf der Wiese steht. */
function downtown(b, x0, x1, z0, z1, avoid, seed) {
  const { F } = b;
  F.poly([[x0, 0.06, z0], [x0, 0.06, z1], [x1, 0.06, z1], [x1, 0.06, z0]], 0xcfc8ba, { flat: true });
  let k = seed;
  const cols = [0xe8dcc6, 0xd9cdb8, 0xf0e4d0, 0xc9cfd4, 0xe2d2bf];
  for (let x = x0 + 14; x < x1 - 14; x += 30) {
    for (let z = z0 - 14; z > z1 + 14; z -= 30) {
      k = (k * 1103515245 + 12345) & 0x7fffffff;
      const w = 18 + (k % 9);
      const d = 16 + ((k >> 4) % 8);
      if (avoid.some(([ax, az, r]) => Math.abs(x - ax) < r + w / 2 && Math.abs(z - az) < r + d / 2)) continue;
      const h = 14 + ((k >> 8) % 4) * 6;
      F.box(x, 0, z, w, h, d, cols[k % cols.length], { g: [0.82, 1.02] });
      // Dachgarten oder Kies: eine flache Fläche knapp über dem Dach
      const rw = w / 2 - 1.5;
      const rd = d / 2 - 1.5;
      if (!b.lod) F.poly([[x - rw, h + 0.08, z + rd], [x - rw, h + 0.08, z - rd], [x + rw, h + 0.08, z - rd], [x + rw, h + 0.08, z + rd]], (k >> 3) % 3 ? 0x9fb08a : 0xb9b2a6, { flat: true });
    }
  }
}

landmark('ffmSkyline', { places: ['Frankfurt am Main'], slot: 'skyline', far: true, title: 'Mainhattan' }, (b) => {
  // alles 7,1 m zurück: der vorderste Innenstadtblock ragte sonst über die Vorderkante (z = 0)
  b.at(0, 0, -7.1, 0, () => {
    for (const [, x, z, fn] of FFM) b.at(x, 0, z, 0, () => fn(b));
    // Türme halten Abstand zu den Blöcken (Mittelpunkt des Turmfußes und Radius)
    const avoid = FFM.map(([, x, z]) => [x, z - 22, 38]);
    downtown(b, -250, 250, 0, -260, avoid, 7);
  });
  return { w: 520, d: 361, h: 288 };
});

// --- Römer: drei Treppengiebel am Römerberg (Alt-Limpurg, Zum Römer, Löwenstein) und das Haus mit dem Türmchen ---
const ROEMER = { plaster: 0xebd3c4, sand: 0xcf9680, coping: 0xe8dccb, slate: 0x6a7187, pane: 0x5e6c86, door: 0x5b4036, copper: 0x7fa89a, gold: 0xd8b25a };

/**
 * Ein Giebelhaus des Römers: Breite w, Traufe 11 m, Treppengiebel mit steps Stufen bis top; Sandstein-Erdgeschoss
 * mit Bogenportalen (portals), Fensterreihen, Satteldach aus Schiefer quer zur Front. Ursprung Mitte der Vorderkante.
 */
function roemerHouse(b, w, top, o = {}) {
  const { F, G } = b;
  const near = !b.lod;
  const d = o.d ?? 15;
  const eave = 11;
  const steps = o.steps ?? 5;
  const R = ROEMER;
  // Treppengiebel als Umriss der Frontwand: rechts Stufe um Stufe hinauf, oben ein schmaler Kopf (halbe Breite c)
  const c = 0.65;
  const dx = (w / 2 - c) / steps;
  const dy = (top - eave) / steps;
  const right = [[w / 2, eave]];
  for (let i = 1; i <= steps; i++) right.push([w / 2 - (i - 1) * dx, eave + i * dy], [w / 2 - i * dx, eave + i * dy]);
  const left = right.map(([x, y]) => [-x, y]).reverse();
  const plaster = o.plaster ?? R.plaster;
  F.extrude([[-w / 2, 0], [w / 2, 0], ...right, ...left], -0.7, 0, plaster, { g: [0.92, 1.03] });
  // Sandstein-Erdgeschoss und Gesims
  F.box(0, 0, 0.02, w, 4.2, 0.36, R.sand, { skip: 'b', g: [0.9, 1] });
  F.box(0, 4.2, 0.05, w + 0.2, 0.35, 0.5, R.coping);
  // Abdeckplatten auf den Stufen und auf dem Kopf
  for (let i = 1; i <= steps; i++) {
    for (const s of [-1, 1]) F.box(s * (w / 2 - (i - 0.5) * dx), eave + i * dy - 0.04, -0.35, dx + 0.25, 0.28, 0.95, R.coping);
  }
  F.box(0, top - 0.04, -0.35, 2 * c + 0.3, 0.28, 0.95, R.coping);
  // Hausleib und Dach (Schiefer, First quer zur Front)
  F.box(0, 0, -0.7 - (d - 0.7) / 2, w - 0.2, eave, d - 0.7, plaster, { skip: 'f' });
  b.gable(0, eave, -d / 2 - 0.35, w - 0.6, d - 0.6, top - eave - 1.2, R.slate, { axis: 'z', oe: 0.3, og: 0, ridge: near });
  // Portale und Fenster
  const portals = o.portals ?? 2;
  const pw = Math.min(2.6, (w - 2) / portals - 0.8);
  for (let i = 0; i < portals; i++) {
    const x = -w / 2 + ((i + 0.5) * w) / portals;
    b.at(0, 0, 0.2, 0, () => archWin(b, x, 0.02, pw, 3.4, { frame: R.coping, pane: R.door, cross: 0, fw: 0.2 }));
  }
  const cols = o.cols ?? Math.max(3, Math.round(w / 2.3));
  for (let f = 0; f < 2; f++) {
    for (let i = 0; i < cols; i++) {
      const x = -w / 2 + ((i + 0.5) * w) / cols;
      if (o.clockAt && f === 1 && Math.abs(x) < 1.6) continue;
      b.win(x, 5.2 + f * 2.9, 0.95, 1.9, { frame: R.coping, pane: R.pane, cross: near ? 2 : 0, sill: near });
    }
  }
  // Fenster im Giebel: je Stufe weniger
  for (let r = 0; r < 3; r++) {
    const y = eave + 0.8 + r * 2.6;
    const half = w / 2 - c - (r + 1) * dx * 1.55;
    const m = Math.max(1, Math.round((2 * half) / 2.2));
    if (half < 0.8 || y + 1.4 > top - dy) break;
    for (let i = 0; i < m; i++) b.win(-half + ((i + 0.5) * 2 * half) / m, y, 0.8, 1.4, { frame: R.coping, pane: R.pane, cross: near ? 1 : 0, sill: false });
  }
  if (o.clockAt) clock(b, 0, o.clockAt, 1.05);
  return { w, d, h: top };
}

landmark('roemer', { places: ['Frankfurt am Main'], slot: 'square', title: 'Römer' }, (b) => {
  const { F, G } = b;
  const near = !b.lod;
  const R = ROEMER;
  // von links: Alt-Limpurg, Zum Römer (Mitte, höchster Giebel, Uhr, Balkon, Türmchen), Löwenstein, Frauenstein
  b.at(-15.6, 0, 0, 0, () => roemerHouse(b, 9.6, 18.4, { portals: 2, cols: 4, plaster: 0xf0d2c2 }));
  b.at(-4.5, 0, 0, 0, () => {
    roemerHouse(b, 11.8, 20.2, { portals: 2, cols: 5, clockAt: 9.3, plaster: 0xeccabb });
    // Balkon über den Portalen: Platte auf Konsolen, steinerne Brüstung
    F.box(0, 4.55, 0.7, 9.6, 0.24, 1.0, R.coping, { skip: 'b' });
    F.box(0, 4.79, 1.14, 9.6, 0.95, 0.14, R.coping, { g: [0.92, 1.02] });
    for (const sx of [-1, 1]) F.box(sx * 4.73, 4.79, 0.7, 0.14, 0.95, 0.9, R.coping);
    if (near) for (let i = 0; i < 6; i++) F.box(-4 + i * 1.6, 3.95, 0.45, 0.3, 0.6, 0.5, R.coping, { skip: 't' });
    // Dachreiter mit Laterne hinter dem Giebel
    F.box(0, 17.5, -4.5, 1.6, 4.2, 1.6, R.slate);
    F.lathe(0, 21.7, -4.5, [[1.15, 0], [0.9, 0.7], [0.55, 1.6], [0.12, 2.6], [0, 3.1]], R.slate, { seg: near ? 8 : 6, bottom: true });
    F.ball(0, 24.9, -4.5, 0.18, R.gold, { ws: 6, hs: 4 });
  });
  b.at(7.8, 0, 0, 0, () => roemerHouse(b, 12.2, 19.0, { portals: 3, cols: 5, plaster: 0xf3dccf }));
  // Frauenstein: Schieferdach zur Traufe, Eck-Erker mit Kupferhaube
  b.at(18.6, 0, 0, 0, () => {
    const w = 9.2;
    const d = 14;
    F.box(0, 0, -d / 2, w, 12, d, 0xe9c7b6, { g: [0.9, 1.02] });
    F.box(0, 0, 0.02, w, 4.2, 0.3, R.sand, { skip: 'b' });
    b.gable(0, 12, -d / 2, w, d, 6.5, R.slate, { axis: 'x', oe: 0.5, og: 0.3 });
    for (let f = 0; f < 2; f++) for (let i = 0; i < 3; i++) b.win(-3 + i * 3, 5.2 + f * 3.1, 1, 1.9, { frame: R.coping, pane: R.pane, cross: near ? 2 : 0 });
    archWin(b, -2.4, 0.02, 2.2, 3.2, { frame: R.coping, pane: R.door, cross: 0, fw: 0.18 });
    F.lathe(-w / 2 + 0.4, 6, -0.2, [[0.2, 0], [1.2, 1.4], [1.2, 6]], 0xe9c7b6, { seg: near ? 10 : 6, top: false });
    F.lathe(-w / 2 + 0.4, 12, -0.2, [[1.35, 0], [1.5, 0.6], [1.0, 1.6], [0.45, 2.4], [0.7, 2.9], [0.3, 3.6], [0, 4.3]], R.copper, { seg: near ? 10 : 6, bottom: true });
    F.ball(-w / 2 + 0.4, 16.4, -0.2, 0.16, R.gold, { ws: 6, hs: 4 });
  });
  if (near) {
    // Fahnenstangen am Mittelhaus, schlicht
    for (const x of [-9.8, 0.8]) F.cyl(x, 4.6, 0.6, 0.05, 0.04, 4.2, PAL.darkMetal, { seg: 5 });
    G.rect(-4.5, 0.02, 0.4, 0.1, 0.1, R.door);
  }
  return { w: 43.6, d: 15, h: 25 };
});

// --- Eiserner Steg: grüne Fachwerkbrücke für Fußgänger mit drei Bögen über den Main -------------------------------
/**
 * Fluss für die Brücken: Wasser zwischen zwei Kaimauern bei x = ±half, von z = 0 bis z = −len (der Fluss läuft von
 * vorn nach hinten, die Brücke quert ihn entlang x, man sieht sie von vorn in ganzer Länge). Hinter den Mauern je ein
 * Uferstreifen von bank Metern auf Höhe y.
 */
function river(b, half, len, y, bank = 12, quay = QUAY) {
  const { F, W } = b;
  W.poolRect(0, 0.05, -len / 2, 2 * half, len, WATER, { rings: 0.12 });
  for (const s of [-1, 1]) {
    F.box(s * (half + bank / 2), 0, -len / 2, bank, y, len, quay, { g: [0.78, 1] });
    F.box(s * (half + 0.25), y, -len / 2, 0.5, 0.45, len, mix(quay, 0xffffff, 0.15));
  }
}

/**
 * Fachwerkträger in der Ebene z: Untergurt auf Höhe y0 von x0 bis x1, Obergurt als Bogen mit Stich rise darüber
 * (Ansatz bei y0 + base), senkrechte und schräge Streben. r: Stabdicke.
 */
function truss(b, x0, x1, y0, base, rise, z, col, r = 0.26) {
  const { F } = b;
  const n = b.lod ? 6 : 12;
  let prev = null;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = x0 + (x1 - x0) * t;
    const p = [x, y0 + base + Math.sin(t * Math.PI) * rise, z];
    if (prev) F.rod(prev, p, r, col, { seg: 4 });
    if (i > 0 && i < n) F.rod([x, y0, z], p, r * 0.55, col, { seg: 4 });
    if (!b.lod && i > 0) F.rod([x - (x1 - x0) / n, y0, z], p, r * 0.4, col, { seg: 3 });
    prev = p;
  }
  F.rod([x0, y0, z], [x1, y0, z], r, col, { seg: 4 });
}

landmark('eisernerSteg', { places: ['Frankfurt am Main'], slot: 'river', title: 'Eiserner Steg' }, (b) => {
  const { F } = b;
  const green = 0x6a9a7c;
  const half = 75; // Fluss zwischen den Kaimauern
  const len = 70;
  const zc = -len / 2;
  const y = 3.2; // Uferweg
  river(b, half, len, y);
  const deckY = y + 1.6;
  const piers = [-32, 32];
  for (const x of piers) prism(F, rrect(4, 7.5, 2, 2, x, zc), 0, deckY - 0.5, 0xc2ae9e, { smooth: 0.7, g: [0.75, 1] });
  F.box(0, deckY - 0.5, zc, 2 * half + 6, 0.5, 5, 0xb9b2a8, { g: [0.85, 1] });
  const fields = [[-half - 3, piers[0], 6], [piers[0], piers[1], 9.5], [piers[1], half + 3, 6]];
  for (const sz of [-1, 1]) for (const [x0, x1, rise] of fields) truss(b, x0, x1, deckY, 1.2, rise, zc + sz * 2.6, green);
  // Portale über den Pfeilern
  for (const x of piers) for (const yy of [deckY + 1.2, deckY + 4.6]) F.rod([x, yy, zc - 2.6], [x, yy, zc + 2.6], 0.2, green, { seg: 4 });
  // Treppen hinauf zum Steg auf beiden Ufern
  for (const s of [-1, 1]) {
    for (let i = 0; i < 5; i++) F.box(s * (half + 3 + (i + 0.5) * 0.6), y, zc, 0.6, deckY - y - (i + 1) * ((deckY - y) / 6), 4.6, 0xb9b2a8, { skip: 'b' });
  }
  return { w: 2 * half + 24, d: len, h: deckY + 11, river: { half, len, y: 0.05 } };
});

// =============================================================================================================
// Köln: Dom und Hohenzollernbrücke
// =============================================================================================================
const DOM = { stone: 0x7a6f68, light: 0x958a7f, dark: 0x463d3a, spire: 0x6b615b, pane: 0x3e4854, lead: 0x8a9291, turret: 0x939a99, plaza: 0xaea9a1 };

/** Spitzbogenfenster als dunkle Fläche in der Wandebene (x Mitte, y Fuß), schaut nach +z. */
function lancet(b, x, y, w, h, col = DOM.dark) {
  b.G.extrude(arch(x, w, y, h, b.lod ? 4 : 6, true), 0, 0.03, col, { caps: 'f', sides: false });
}

/** Fialtürmchen: schlanker Schaft (Quadrat s) bis y1, darauf eine spitze Pyramide der Höhe ph. */
function pinnacle(b, x, z, y0, y1, s, ph, col) {
  prism(b.F, chamfer(s, s, 0, x, z), y0, y1, col, { top: false });
  spire(b.F, chamfer(s * 1.15, s * 1.15, 0, x, z), y1, y1 + ph, col, { ax: x, az: z, bottom: true });
}

/** Ein Westturm des Doms (Mitte bei x = cx, Innenseite bleibt fest): Geschosse, Eckpfeiler, Fenster, Achteck, Helm. */
function domTower(b, side) {
  const { F } = b;
  const near = !b.lod;
  const stages = [[0, 66, 26.5], [66, 90, 24.5], [90, 97, 22.5]];
  const zc = -13.25;
  for (const [y0, y1, w] of stages) {
    const cx = side * (4.25 + w / 2);
    prism(F, chamfer(w, w, 0.6, cx, zc), y0, y1, DOM.stone, { g: [0.78, 1.02] });
    // Gesims am Kopf jedes Geschosses
    prism(F, chamfer(w + 1.2, w + 1.2, 0.8, cx, zc), y1 - 1.2, y1, DOM.light, { g: [0.95, 1.05] });
    // Eckpfeiler laufen über die Kanten
    for (const [dx, dz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const x = cx + dx * (w / 2 - 0.4);
      const z = zc + dz * (w / 2 - 0.4);
      prism(F, chamfer(2.4, 2.4, 0, x, z), y0, y1 + (y1 === 97 ? 0 : 0.6), DOM.light, { top: y1 !== 97, g: [0.82, 1] });
      if (y1 === 97) spire(F, chamfer(3, 3, 0, x, z), 97, 109, DOM.spire, { ax: x, az: z });
    }
    // Fenster auf allen vier Seiten
    b.at(cx, 0, zc + w / 2, 0, () => b.sides(w, w, (len, face) => {
      const rows = y1 === 66 ? [[face === 'f' ? 31 : 10, 17], [face === 'f' ? 50 : 32, 14]] : y1 === 90 ? [[69, 17]] : [];
      for (const [ry, rh] of rows) {
        for (const dx of [-0.22, 0.22]) {
          lancet(b, dx * len, ry, len * 0.2, rh);
          // spitzer Ziergiebel über jedem Fenster
          if (near) b.F.extrude([[dx * len - len * 0.13, ry + rh - 1], [dx * len + len * 0.13, ry + rh - 1], [dx * len, ry + rh + 4.5]], 0, 0.45, DOM.light, { crease: 2 });
        }
      }
      if (face === 'f' && y1 === 66) {
        // Portal mit spitzem Wimperg darüber
        lancet(b, 0, 0.1, 8, 22, DOM.dark);
        b.F.extrude([[-6.2, 21], [6.2, 21], [0, 31]], 0, 0.7, DOM.light, { crease: 2 });
        b.G.extrude([[-4.6, 22], [4.6, 22], [0, 29]], 0.7, 0.72, DOM.dark, { caps: 'f', sides: false });
      }
    }));
  }
  // Achteck mit hohen Fenstern, dann der durchbrochene Helm mit Krabben und Kreuzblume
  const cx = side * (4.25 + 11.25);
  const oct = ngon(8, 10.4, Math.PI / 8, 0, 0, cx, zc);
  prism(F, oct, 97, 110, DOM.stone, { g: [0.9, 1.02] });
  if (near) {
    for (let k = 0; k < 8; k++) {
      const a = Math.PI / 8 + ((k + 0.5) * TAU) / 8;
      const r = 10.4 * Math.cos(Math.PI / 8) + 0.02;
      b.at(cx + Math.cos(a) * r, 0, zc + Math.sin(a) * r, Math.atan2(Math.cos(a), Math.sin(a)), () => lancet(b, 0, 99, 3.4, 9.5));
    }
  }
  const tip = 147.7;
  spire(F, ngon(8, 7.2, Math.PI / 8, 0, 0, cx, zc), 110, tip, DOM.spire, { ax: cx, az: zc, g: [0.92, 1.05] });
  // Krabben: kleine Knospen entlang der acht Grate
  const n = near ? 7 : 3;
  for (let k = 0; k < 8; k++) {
    const a = Math.PI / 8 + (k * TAU) / 8;
    for (let i = 1; i <= n; i++) {
      const t = i / (n + 1);
      const r = 7.2 * (1 - t) + 0.5;
      const y = 110 + (tip - 110) * t;
      const x = cx + Math.cos(a) * r;
      const z = zc + Math.sin(a) * r;
      const ox = Math.cos(a) * 1.4;
      const oz = Math.sin(a) * 1.4;
      F.tri([x - oz * 0.4, y - 0.8, z + ox * 0.4], [x + oz * 0.4, y - 0.8, z - ox * 0.4], [x + ox, y + 0.6, z + oz], DOM.spire, { k: 1.08 });
      F.tri([x + oz * 0.4, y - 0.8, z - ox * 0.4], [x - oz * 0.4, y - 0.8, z + ox * 0.4], [x - ox * 0.2, y + 1.2, z - oz * 0.2], DOM.spire, { k: 0.9 });
    }
  }
  // Kreuzblume: zwei gekreuzte Blattpaare und ein Knauf
  for (const ry of [0, Math.PI / 2]) {
    b.at(cx, 0, zc, ry, () => b.F.extrude([[0, tip - 1], [2.3, tip + 3.2], [0.5, tip + 3.6], [0, tip + 8], [-0.5, tip + 3.6], [-2.3, tip + 3.2]], -0.35, 0.35, DOM.spire, { crease: 2 }));
  }
  F.ball(cx, tip + 8.6, zc, 0.9, DOM.spire, { ws: 6, hs: 3 });
}

landmark('koelnerDom', { places: ['Köln'], slot: 'skyline', title: 'Kölner Dom' }, (b) => {
  const { F } = b;
  const near = !b.lod;
  // Die Domplatte reicht 15 m vor die Westfassade: alles um 12,75 m (15 m im Maßstab 0,85) zurück, damit ihre Vorderkante
  // auf z = 0 liegt wie bei jedem Baustein
  b.xf([0, 0, -12.75], [0, 0, 0], 0.85, () => {
    // Domplatte
    F.box(0, 0, -60, 100, 0.12, 150, DOM.plaza, { skip: 'b' });
    domTower(b, -1);
    domTower(b, 1);
    // Mittelteil der Westfront zwischen den Türmen: großes Fenster und steiler Giebel
    F.box(0, 0, -13.25, 8.5, 44, 26.5, DOM.stone, { g: [0.78, 1] });
    b.at(0, 0, 0, 0, () => {
      lancet(b, 0, 16, 6.4, 24);
      F.extrude([[-4.25, 44], [4.25, 44], [0, 60]], -26.5, 0, DOM.stone, { crease: 2 });
    });
    // Langhaus: Seitenschiffe, Obergaden mit Bleidach, Querhaus, Chor
    const zN = -26.5;
    F.box(0, 0, -73, 45, 20, 93, DOM.stone, { skip: 'f', g: [0.8, 1] });
    F.box(0, 0, -78, 15, 43, 103, DOM.stone, { skip: 'f', g: [0.8, 1.02] });
    b.gable(0, 43, -78, 15, 103, 18, DOM.lead, { axis: 'z', oe: 0.6, og: 0, ridge: near });
    F.box(0, 0, -96, 86, 43, 16, DOM.stone, { g: [0.8, 1.02] });
    b.gable(0, 43, -96, 86, 16, 18, DOM.lead, { axis: 'x', oe: 0.6, og: 0.4, ridge: near });
    for (const s of [-1, 1]) {
      b.at(s * 43, 0, -96, (s * Math.PI) / 2, () => {
        lancet(b, 0, 14, 7, 24);
        F.extrude([[-8, 43], [8, 43], [0, 61]], -0.6, 0.4, DOM.stone, { crease: 2 });
      });
    }
    // Chor: halbes Zehneck mit Bleihaube
    const apse = [];
    for (let i = 0; i <= 5; i++) {
      const a = Math.PI + (i / 5) * Math.PI;
      apse.push([Math.cos(a) * 15, -129.5 + Math.sin(a) * -15]);
    }
    prism(F, apse, 0, 43, DOM.stone, { g: [0.8, 1.02] });
    spire(F, grow(apse, 0.6), 43, 61, DOM.lead, { ax: 0, az: -129.5 });
    // Strebewerk: Pfeiler mit Fialen und schräge Bögen zum Obergaden, beidseits und um den Chor
    const pier = (x, z, ax, az) => {
      prism(F, chamfer(2.2, 2.2, 0, x, z), 0, 30, DOM.light, { top: false, g: [0.8, 1] });
      spire(F, chamfer(2.6, 2.6, 0, x, z), 30, 37, DOM.spire, { ax: x, az: z });
      F.rod([x, 27, z], [ax, 38, az], 0.55, DOM.light, { seg: 4 });
    };
    for (const s of [-1, 1]) for (let z = zN - 6; z > -88; z -= 9.5) pier(s * 23, z, s * 7.5, z);
    for (const s of [-1, 1]) for (let z = -108; z > -126; z -= 9) pier(s * 23, z, s * 7.5, z);
    for (let i = 1; i < 5; i++) {
      const a = Math.PI + (i / 5) * Math.PI;
      pier(Math.cos(a) * 26, -129.5 - Math.sin(a) * 26, Math.cos(a) * 15.2, -129.5 - Math.sin(a) * 15.2);
    }
    // Obergadenfenster
    for (const s of [-1, 1]) {
      b.at(s * 7.5, 0, -78, (s * Math.PI) / 2, () => {
        for (let z = -45; z <= 45; z += 9.5) if (Math.abs(z + 18) > 9) lancet(b, z, 24, 3.6, 15);
      });
    }
    // Dachreiter über der Vierung
    const zx = -96;
    prism(F, ngon(8, 3.4, Math.PI / 8, 0, 0, 0, zx), 58, 72, DOM.turret, { g: [0.9, 1.05] });
    spire(F, ngon(8, 3.6, Math.PI / 8, 0, 0, 0, zx), 72, 103, DOM.turret, { ax: 0, az: zx });
    F.ball(0, 103.5, zx, 0.7, CITY.gold, { ws: 6, hs: 3 });
  });
  return { w: 86, d: 128, h: 134 };
});

// --- Hohenzollernbrücke: drei Stahlbögen über den Rhein, mit Liebesschlössern am Geländer und einer kleinen Bahn ----
landmark('hohenzollernbruecke', { places: ['Köln'], slot: 'river', title: 'Hohenzollernbrücke' }, (b) => {
  const { F, G } = b;
  const near = !b.lod;
  const s = 0.6; // die echte Brücke ist 409 m lang
  const steel = 0x8a9190;
  const half = 112;
  const len = 70;
  const zc = -len / 2;
  const y = 3.6;
  river(b, half, len, y, 16, 0xa39686);
  const deckY = y + 1.4;
  const D = 29.5 * s; // Breite der drei Brückenzüge
  // Pfeiler und Fahrbahn
  const xs = [-204.6, -85.7, 82.0, 204.6].map((x) => x * s);
  for (const x of xs.slice(1, 3)) prism(F, rrect(9, D + 4, 4, 2, x, zc), 0, deckY, 0x756a62, { smooth: 0.7, g: [0.7, 1] });
  F.box(0, deckY - 1.6, zc, xs[3] - xs[0] + 8, 1.6, D, 0x5f666b, { g: [0.85, 1] });
  F.box(0, deckY, zc, xs[3] - xs[0] + 8, 0.12, D - 1, 0x9a948a, { skip: 'b' });
  // Bögen: je Feld drei Bogenebenen (außen und Mitte), Kreisbögen mit Stich f, Hänger alle 8,4 m (× s)
  const spans = [[xs[0], xs[1], 17], [xs[1], xs[2], 25], [xs[2], xs[3], 17.5]];
  const planes = [zc + D / 2 - 0.5, zc, zc - D / 2 + 0.5];
  for (const [x0, x1, f0] of spans) {
    const f = f0 * s;
    const S = x1 - x0;
    const n = near ? 14 : 7;
    for (const z of planes) {
      let pTop = null;
      let pLow = null;
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        const x = x0 + S * t;
        const h = 4 * f * t * (1 - t);
        const top = [x, deckY + h + 1.2, z];
        const low = [x, deckY + Math.max(0, h - 2.2) + 0.2, z];
        if (pTop) {
          F.rod(pTop, top, 0.42, steel, { seg: 4 });
          F.rod(pLow, low, 0.32, steel, { seg: 4 });
          if (near) F.rod(i % 2 ? pTop : pLow, i % 2 ? low : top, 0.16, steel, { seg: 3 });
        }
        if (i > 0 && i < n && h > 2.6) F.rod([x, deckY, z], low, 0.14, steel, { seg: 3 });
        pTop = top;
        pLow = low;
      }
    }
    // Querriegel über der Fahrbahn nahe dem Scheitel
    for (const t of [0.35, 0.5, 0.65]) {
      const h = 4 * f * t * (1 - t) + 1.2;
      F.rod([x0 + S * t, deckY + h, planes[0]], [x0 + S * t, deckY + h, planes[2]], 0.22, steel, { seg: 4 });
    }
  }
  if (near) {
    // Liebesschlösser: bunte Tupfen am vorderen Geländer
    const cols = [0xd9a43f, 0xd4584a, 0x4f87c7, 0xc8ccd1, 0x6fb352, 0xf4a6c0];
    const z = zc + D / 2 + 0.06;
    F.box(0, deckY, zc + D / 2 - 0.05, xs[3] - xs[0], 1.1, 0.08, 0x5f666b);
    for (let i = 0, x = xs[0] + 1; x < xs[3] - 1; i++, x += 0.9) {
      G.rect(x, deckY + 0.25 + ((i * 7) % 5) * 0.14, z, 0.28, 0.22, cols[(i * 5) % cols.length]);
    }
    // eine kleine rote Bahn auf dem mittleren Gleis
    for (let k = 0; k < 3; k++) {
      const x = -30 + k * 12.6;
      F.rbox(x, deckY + 0.6, zc, 12, 3, 2.8, 0.6, 0xd4584a, { seg: 2, g: [0.85, 1.05] });
      for (let w = 0; w < 4; w++) G.rect(x - 4.4 + w * 2.9, deckY + 2.1, zc + 1.42, 1.8, 0.9, GLASS);
    }
  }
  return { w: 2 * half + 32, d: len, h: deckY + 25 * s + 1.5, river: { half, len, y: 0.05 } };
});

// =============================================================================================================
// Hamburg: Michel, Elbphilharmonie, Containerbrücken
// =============================================================================================================
const MICHEL = { cream: 0xf2e7d5, brick: 0xddaf98, pil: 0xd09882, roof: 0x94706b, shaft: 0x8a7d78, green: 0x88a596, col: 0x8e9c93, slate: 0x5b5759 };

/** Zifferblatt in der Wandebene (Mitte x, y), Radius r: dunkle Scheibe, goldener Ring, goldene Zeiger. */
function dial(b, x, y, r, base = MICHEL.slate) {
  const { G } = b;
  G.disc(x, y, 0.3, r, base, { seg: b.lod ? 12 : 20 });
  if (b.lod) {
    G.rect(x, y - 0.15, 0.32, r * 0.9, 0.3, CITY.gold);
    return;
  }
  b.xf([x, y, 0.3], [Math.PI / 2, 0, 0], 1, () => G.torus(0, 0, 0, r * 0.95, r * 0.06, CITY.gold, { seg: 20, tube: 4 }));
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU;
    G.disc(x + Math.sin(a) * r * 0.8, y + Math.cos(a) * r * 0.8, 0.34, r * 0.06, CITY.gold, { seg: 6 });
  }
  const hand = (a, len, t) => G.quad([x - Math.cos(a) * t, y + Math.sin(a) * t, 0.36], [x + Math.cos(a) * t, y - Math.sin(a) * t, 0.36], [x + Math.sin(a) * len, y + Math.cos(a) * len, 0.36], [x + Math.sin(a) * len, y + Math.cos(a) * len, 0.36], CITY.gold);
  hand(-Math.PI / 3, r * 0.62, r * 0.09);
  hand(Math.PI / 3, r * 0.85, r * 0.07);
}

landmark('michel', { places: ['Hamburg'], slot: 'skyline', title: 'Michel' }, (b) => {
  const { F, G } = b;
  const near = !b.lod;
  const M = MICHEL;
  b.xf([0, 0, 0], [0, 0, 0], 0.85, () => {
    // Kirche: Langhaus entlang x, Querhaus nach vorn und hinten, Walmdächer, Bogenfenster
    F.box(12.75, 0, -25, 46.5, 25, 44, M.brick, { g: [0.86, 1.02] });
    F.box(10, 0, -25, 24, 25, 50, M.brick, { g: [0.86, 1.02] });
    for (const [w, d] of [[46.5, 44], [24, 50]]) F.box(w === 24 ? 10 : 12.75, 24, -25, w + 0.8, 1, d + 0.8, M.cream);
    b.hip(12.75, 25, -25, 46.5, 44, 12, M.roof, { oe: 0.6 });
    b.hip(10, 25, -25, 24, 50, 12, M.roof, { oe: 0.6, ridge: 1 });
    b.at(10, 0, 0, 0, () => {
      F.extrude([[-11, 25], [11, 25], [0, 31]], -0.6, 0.5, M.cream, { crease: 2 });
      G.disc(0, 27.6, 0.52, 1.4, GLASS, { seg: 12 });
      for (let r = 0; r < 2; r++) for (const x of [-7, 0, 7]) archWin(b, x, 4 + r * 10, 3, 7.5, { frame: M.cream, cross: near ? 1 : 0 });
    });
    for (const x of [-6, 26, 32]) for (let r = 0; r < 2; r++) b.at(x, 0, -3, 0, () => archWin(b, 0, 4 + r * 10, 3, 7.5, { frame: M.cream, cross: near ? 1 : 0 }));
    // Turm: Sockel (unten Backstein, oben hell), dunkler Schaft, Uhrgeschoss, Säulenkranz, Kuppel, Nadel
    const tx = -23.25;
    const tz = -25;
    F.box(tx, 0, tz, 25.5, 25, 25.5, M.brick, { g: [0.86, 1] });
    F.box(tx, 25, tz, 25.5, 13.4, 25.5, M.cream);
    F.box(tx, 38.4, tz, 27.5, 1.6, 27.5, M.cream);
    b.at(tx, 0, tz + 12.75, 0, () => {
      archWin(b, 0, 2, 5, 9, { frame: M.cream, pane: 0x5b4036, cross: 0 });
      b.win(0, 28, 2.4, 4.5, { frame: M.cream, cross: near ? 2 : 0 });
      for (const x of [-9, 9]) F.box(x, 0, 0.3, 1.2, 38.4, 0.6, M.cream, { skip: 'b' });
    });
    prism(F, chamfer(18.6, 18.6, 2.5, tx, tz), 40, 70, M.shaft, { g: [0.88, 1.05] });
    b.at(tx, 0, tz + 9.3, 0, () => {
      archWin(b, 0, 46, 3, 6.5, { frame: M.cream, cross: 0 });
      b.win(0, 56, 2.4, 3.8, { frame: M.cream, cross: 0 });
      b.win(0, 63, 2.4, 3.6, { frame: M.cream, cross: 0 });
    });
    F.box(tx, 69.7, tz, 21, 2.5, 21, M.cream);
    F.box(tx, 72.2, tz, 15, 13, 15, M.cream, { g: [0.94, 1.02] });
    // Uhr auf allen vier Seiten (sides arbeitet von der Mitte der Vorderkante aus)
    b.at(tx, 0, tz + 7.5, 0, () => b.sides(15, 15, () => dial(b, 0, 79, 4.0)));
    F.box(tx, 85.2, tz, 15.6, 1.5, 15.6, M.cream);
    const n = near ? 8 : 6;
    for (let i = 0; i < n; i++) {
      const a = ((i + 0.5) / n) * TAU;
      F.cyl(tx + Math.cos(a) * 5.4, 86.7, tz + Math.sin(a) * 5.4, 0.65, 0.6, 11.1, M.col, { seg: 6, top: false });
    }
    F.lathe(tx, 0, tz, [[6.3, 97.8], [7.45, 98.6], [7.45, 99.4], [6.4, 101.1], [6.3, 101.1], [6.1, 102.2], [5.5, 104.3], [4.6, 106.4], [3.4, 108.3], [2.4, 109.9], [2.3, 109.9], [2.3, 112.4], [1.3, 112.7], [0.9, 116.7], [0.6, 121], [0.15, 127]], M.green, { seg: near ? 12 : 8, bottom: true, g: [0.9, 1.08] });
    F.ball(tx, 127.5, tz, 0.8, CITY.gold, { ws: 8, hs: 4 });
    if (near) G.rect(tx + 1.6, 129, tz, 3.2, 1.6, CITY.gold);
  });
  return { w: 61.2, d: 44, h: 112.5 };
});

landmark('elbphilharmonie', { places: ['Hamburg'], slot: 'skyline', title: 'Elbphilharmonie' }, (b) => {
  const { F, G } = b;
  const near = !b.lod;
  b.xf([0, 0, 0], [0, 0, 0], 0.85, () => {
    // Keil aus Backstein (Westspitze schmal, Ostende tief) mit kleinen dunklen Fenstern
    const n = near ? 24 : 12;
    const edge = (inset) => {
      const front = [];
      const back = [];
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        const x = -62 + inset + (124 - 2 * inset) * t;
        front.push([x, -inset]);
        back.push([x, -(22 + 63 * ((x + 62) / 124)) + inset]);
      }
      return [front, back.reverse()];
    };
    const [f0, b0] = edge(0);
    prism(F, [...f0, ...b0], 0, 37, 0x94503f, { g: [0.8, 1.02] });
    for (let r = 0; r < (near ? 3 : 1); r++) for (let i = 0; i < (near ? 28 : 10); i++) G.rect(-58 + (i + 0.5) * (116 / (near ? 28 : 10)), 9 + r * 9, 0.04, near ? 1.4 : 3, near ? 1.4 : 1.6, 0x4a3c3a);
    // Plaza: helle Fuge
    const [f1, b1] = edge(1.5);
    prism(F, [...f1, ...b1], 37, 38.5, 0xe8dccb);
    // Glaskrone mit Wellendach: niedrig im Osten, Kamm an der Westspitze
    const [f2, b2] = edge(4);
    const roof = (x) => {
      const t = (x + 58) / 116;
      const s = 1 - t;
      return Math.max(72, 80 + 30 * s * s * (3 - 2 * s) + 4 * Math.sin(TAU * 1.5 * t));
    };
    const ring = [...f2, ...b2];
    loft(F, [[ring, 38.5], [ring, (x) => roof(x)]], 0xcbd8e0, { top: false, g: [0.92, 1.12] });
    const P = [];
    const idx = [];
    for (let i = 0; i <= n; i++) {
      const [x, z0] = f2[i];
      const z1 = b2[n - i][1];
      P.push(x, roof(x), z0, x, roof(x), z1);
      if (i < n) idx.push(2 * i, 2 * i + 1, 2 * i + 3, 2 * i, 2 * i + 3, 2 * i + 2);
    }
    F.mesh(P, P.map((_, k) => (k % 3 === 1 ? 1 : 0)), idx, 0xe2e9ea);
    // glitzernde Scheiben: helle Felder und runde Öffnungen in der Krone
    // Glasfelder in zwei nahen Tönen (glitzert, ohne ein Raster zu zeigen) und die gewölbten Fensterbuchten
    const cols = near ? 40 : 14;
    for (let i = 0; i < cols; i++) {
      const x = -56 + (i + 0.5) * (112 / cols);
      const top = roof(x) - 3;
      for (let y = 40, r = 0; y < top; y += near ? 3.2 : 9.6, r++) {
        const h = Math.min(near ? 3 : 9.2, top - y);
        G.rect(x, y, -3.9, 112 / cols - 0.25, h, (i * 7 + r * 3) % 5 < 2 ? 0xdce6ee : 0xc2d2de, { g: [0.95, 1.08] });
      }
    }
    if (near) for (const [x, y] of [[-40, 66], [-26, 58], [-8, 50], [6, 62], [20, 54], [34, 47], [48, 58]]) G.disc(x, y, -3.85, 1.9, 0x8ea7ba, { seg: 12 });
  });
  return { w: 105.4, d: 72.3, h: 95.6 };
});

// --- Containerbrücke und Hafen ----------------------------------------------------------------------------------
const CONTAINER = [0xc4553f, 0x4b7ba6, 0x5f9a6e, 0xe09a55, 0xe8c95a, 0x9a8fb8];

/** Stapel aus nx × nz × ny Containern (12,2 × 2,6 × 2,4 m) um (x, z), längs x; seed wählt die Farben. */
function containers(b, x, z, nx, nz, ny, seed = 1) {
  const { F } = b;
  let k = seed * 7;
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < nz; j++) {
      const h = Math.max(1, ny - ((i * 3 + j * 5 + seed) % 3 === 0 ? 1 : 0));
      for (let l = 0; l < h; l++) {
        k = (k * 31 + 17) % 101;
        const cx = x + (i - (nx - 1) / 2) * 12.6;
        const cz = z + (j - (nz - 1) / 2) * 2.7;
        F.box(cx, l * 2.6, cz, 12.2, 2.5, 2.45, CONTAINER[k % CONTAINER.length], { g: [0.86, 1.04] });
        if (!b.lod) for (const s of [-1, 1]) F.box(cx, l * 2.6 + 0.3, cz + s * 1.24, 11.6, 1.9, 0.05, mix(CONTAINER[k % CONTAINER.length], 0x000000, 0.12), { skip: 'tb' });
      }
    }
  }
}

/**
 * Containerbrücke (Ursprung landseitig am Ende des Hecks, Ausleger nach −z übers Wasser), Schienen bei z = −22 und
 * −52. raised = Ausleger hochgeklappt.
 */
function crane(b, raised = false) {
  const { F, L } = b;
  const near = !b.lod;
  const steel = 0xa9bfd0;
  const legs = 0x8aa2b6;
  for (const z of [-22, -52]) {
    F.box(0, 0, z, 36, 0.8, 0.8, PAL.darkMetal);
    for (const sx of [-1, 1]) {
      F.rod([sx * 11, 0, z], [sx * 9, 48, z], 1.3, legs, { seg: 4, caps: true });
      F.box(sx * 11, 0, z, 4, 1.6, 3, 0xd9534a, { g: [0.8, 1] });
    }
    F.box(0, 40, z, 20, 2.4, 2.4, legs);
  }
  for (const sx of [-1, 1]) F.box(sx * 9.5, 46.6, -37, 2.6, 2.4, 33, legs);
  // Heck mit Maschinenhaus, Ausleger am Gelenk z = −48
  F.box(0, 48, -24, 3.6, 3.5, 48, steel);
  F.box(0, 51.5, -12, 10, 6, 6, 0xf0e9da, { g: [0.9, 1.02] });
  F.box(0, 51.5, -44, 2.4, 14, 2.4, legs);
  F.rod([0, 65, -44], [0, 51.5, -2], 0.3, legs, { seg: 4 });
  const boom = () => {
    F.box(0, 0, -37, 3.2, 4.2, 74, steel, { g: [0.88, 1.04] });
    if (near) for (let i = 0; i < 6; i++) F.rod([1.65, 0.3, -6 - i * 12], [1.65, 3.9, -12 - i * 12], 0.18, 0xe6eef4, { seg: 3 });
    // Katze mit Führerhaus, Spreader an Seilen
    if (!raised) {
      F.box(0, -3, -37, 5, 3, 6, steel);
      F.box(1.5, -6, -36, 3, 3, 3, 0xf0e9da);
      F.box(0, -25, -37, 2.5, 0.8, 12, 0xe8c95a);
      for (const dz of [-4, 4]) F.rod([0, -3, -37 + dz], [0, -24.2, -37 + dz], 0.1, PAL.darkMetal, { seg: 3 });
    }
  };
  const th = raised ? 1.3 : 0.07;
  b.xf([0, 49.5, -48], [th, 0, 0], 1, boom);
  // Abspannung vom Portalkopf zur Auslegermitte (in Weltlage gerechnet, damit sie beim Hochklappen mitgeht)
  F.rod([0, 65, -44], [0, 49.5 + 4.2 * Math.cos(th) + 40 * Math.sin(th), -48 + 4.2 * Math.sin(th) - 40 * Math.cos(th)], 0.3, legs, { seg: 4 });
  // Warnlichter
  L.ball(0, 65.4, -44, 0.5, 0xff5a4a, { ws: 6, hs: 3 });
  L.ball(0, 57.6, -12, 0.4, 0xff5a4a, { ws: 6, hs: 3 });
  return { w: 36, d: 122, h: raised ? 110 : 66 };
}

landmark('containerCrane', { places: ['Hamburg', 'Bremen', 'Kiel'], slot: 'open', title: 'Containerbrücke' }, (b) => crane(b));
landmark('containerStack', { places: [], slot: 'open', title: 'Containerstapel' }, (b) => {
  containers(b, 0, -3, 3, 2, 4, 3);
  return { w: 38, d: 6, h: 10.4 };
});

landmark('hamburgHafen', { places: ['Hamburg'], slot: 'river', far: true, title: 'Containerhafen' }, (b) => {
  const { F, W } = b;
  const near = !b.lod;
  // Kai (1,5 m) mit Kante, dahinter Wasser bis zum Ende der Ausleger und ein Schiff am Kai
  F.box(0, 0, -29, 200, 1.5, 58, 0xa8a49c, { g: [0.85, 1] });
  F.box(0, 1.5, -57.6, 200, 0.4, 0.8, 0xd8d3c8);
  W.poolRect(0, 0.05, -100, 200, 84, WATER, { rings: 0.1 });
  b.at(-60, 1.5, 0, 0, () => crane(b));
  b.at(-8, 1.5, 0, 0, () => crane(b, true));
  b.at(44, 1.5, 0, 0, () => crane(b));
  b.at(0, 1.5, 0, 0, () => {
    containers(b, -30, -8, 3, 3, 3, 2);
    containers(b, 30, -10, 3, 4, 4, 5);
    containers(b, 82, -6, 2, 2, 2, 9);
  });
  // Containerschiff: dunkler Rumpf mit rotem Unterwasserschiff, weißes Deckshaus hinten, bunte Ladung
  const len = 150;
  const hull = [[-len / 2, -6], [len / 2 - 14, -6], [len / 2, 0], [len / 2 - 14, 6], [-len / 2, 6]];
  const shipZ = -76;
  b.at(0, 0, shipZ, 0, () => {
    prism(F, hull, 0, 3, 0xb5443a);
    prism(F, hull, 3, 13, 0x3f4a5c, { g: [0.9, 1.05] });
    F.box(-len / 2 + 10, 13, 0, 12, 14, 11, 0xf4f1ea, { g: [0.9, 1.02] });
    F.box(-len / 2 + 10, 27, 0, 14, 1, 12, 0xf4f1ea);
    F.box(-len / 2 + 4, 13, 0, 3, 22, 3, 0x3f4a5c);
    if (near) for (let i = 0; i < 6; i++) b.G.rect(-len / 2 + 5 + i * 2, 24.5, 5.52, 1.4, 1.2, GLASS);
    b.at(10, 13, 0, 0, () => containers(b, 0, 0, 8, 4, 3, 4));
  });
  return { w: 200, d: 142, h: 124 };
});

// =============================================================================================================
// Fernsehtürme: Berlin, Düsseldorf, Stuttgart, München (Olympiaturm)
// =============================================================================================================
const CONCRETE = 0xd8d2c6;

/** Antenne von y0 bis y1 (Radius r0 → r1), in n Ringen abwechselnd weiß und rot; Spitze mit Licht. */
function antenna(b, y0, y1, r0, r1, n = 6, cols = [0xf0eee8, 0xd9573e]) {
  for (let i = 0; i < n; i++) {
    const t0 = i / n;
    const t1 = (i + 1) / n;
    b.F.cyl(0, y0 + (y1 - y0) * t0, 0, r0 + (r1 - r0) * t0, r0 + (r1 - r0) * t1, (y1 - y0) / n, cols[i % cols.length], { seg: b.lod ? 6 : 8, top: i === n - 1 });
  }
  b.L.ball(0, y1 + 0.3, 0, Math.max(0.5, r1 * 1.4), 0xff5a4a, { ws: 6, hs: 3 });
}

landmark('fernsehturmBerlin', { places: ['Berlin'], slot: 'skyline', far: true, title: 'Fernsehturm' }, (b) => {
  const { F, G } = b;
  const near = !b.lod;
  const seg = near ? 20 : 12;
  b.xf([0, 0, -30], [0, 0, 0], 0.85, () => {
    // Pavillon am Fuß: Ring mit gefaltetem Dach (Zacken)
    prism(F, circle(30, near ? 24 : 12), 0, 6, 0xe7e3da, { smooth: 0.8, top: false });
    const n = near ? 24 : 12;
    const P = [];
    const idx = [];
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * TAU;
      const a1 = ((i + 1) / n) * TAU;
      const am = (a0 + a1) / 2;
      const q = P.length / 3;
      P.push(Math.cos(a0) * 30, 6, Math.sin(a0) * 30, Math.cos(a1) * 30, 6, Math.sin(a1) * 30, Math.cos(am) * 31, 9, Math.sin(am) * 31, Math.cos(a0) * 14, 7.5, Math.sin(a0) * 14, Math.cos(a1) * 14, 7.5, Math.sin(a1) * 14);
      idx.push(q, q + 2, q + 1, q, q + 3, q + 2, q + 2, q + 3, q + 4, q + 1, q + 2, q + 4);
    }
    F.mesh(P, null, idx, 0xf2efe8);
    F.lathe(0, 0, 0, [[16, 0], [12, 30], [8.5, 120], [6.2, 196]], CONCRETE, { seg, top: false, g: [0.9, 1.04] });
    // Kugel: glänzend (Sonnenkreuz), Fensterband unter dem Äquator
    G.ball(0, 213, 0, 16, 0xc8ccd2, { ws: near ? 24 : 14, hs: near ? 12 : 8 });
    G.lathe(0, 206, 0, [[15.45, 0], [16.05, 3.4], [16.05, 5.2]], 0x55606e, { seg: near ? 24 : 14, top: false });
    F.lathe(0, 228, 0, [[5.6, 0], [5.2, 24]], CONCRETE, { seg: 12 });
    antenna(b, 252, 368, 2.4, 0.7, 8);
  });
  return { w: 52, d: 60, h: 313 };
});

landmark('rheinturm', { places: ['Düsseldorf'], slot: 'skyline', far: true, title: 'Rheinturm' }, (b) => {
  const { F, G, L } = b;
  const near = !b.lod;
  const seg = near ? 18 : 10;
  b.xf([0, 0, -20], [0, 0, 0], 0.85, () => {
    F.box(0, 0, 0, 30, 6, 26, 0xe7e3da, { g: [0.9, 1] });
    F.lathe(0, 0, 0, [[9.5, 0], [8.2, 20], [6, 90], [4.6, 160]], CONCRETE, { seg, top: false, g: [0.9, 1.04] });
    // Korb: Kelch, Fensterband, flaches Dach
    F.lathe(0, 158, 0, [[4.6, 0], [12.5, 12], [13, 13]], 0xe7e3da, { seg: near ? 24 : 12, top: false });
    G.lathe(0, 171, 0, [[13.05, 0], [13.05, 6]], 0x5f7891, { seg: near ? 24 : 12, top: false });
    F.lathe(0, 177, 0, [[13, 0], [12.6, 1.2], [6, 5]], 0xe7e3da, { seg: near ? 24 : 12 });
    F.lathe(0, 182, 0, [[4.2, 0], [3.8, 14]], CONCRETE, { seg: 12 });
    antenna(b, 196, 240, 1.8, 0.6, 4, [0xf0eee8, 0xf0eee8, 0xf0eee8, 0xd9573e]);
    // Lichtzeitpegel: senkrechte Reihe kleiner Lichter an der Schauseite des Schafts
    if (near) {
      for (let i = 0; i < 39; i++) {
        const y = 42 + i * 3 + Math.floor(i / 13) * 4;
        const r = 9.5 - (9.5 - 4.6) * (y / 160) - 0.05;
        L.disc(0, y, r + 0.06, 0.45, i % 13 < 5 ? 0xffd98a : 0xfff4d6, { seg: 6 });
      }
    }
  });
  return { w: 30, d: 34, h: 205 };
});

landmark('fernsehturmStuttgart', { places: ['Stuttgart'], slot: 'skyline', far: true, title: 'Fernsehturm' }, (b) => {
  const { F, G } = b;
  const near = !b.lod;
  b.xf([0, 0, -14], [0, 0, 0], 0.85, () => {
    // kegelförmiger Fuß, schlanker Schaft, mehrstöckiger Korb, rot-weiße Antenne
    F.lathe(0, 0, 0, [[13.5, 0], [8, 3], [5.4, 8], [4.2, 70], [3.0, 132]], CONCRETE, { seg: near ? 16 : 10, top: false, g: [0.9, 1.04] });
    F.lathe(0, 132, 0, [[3.0, 0], [7.5, 6]], 0xe7e3da, { seg: 16, top: false });
    F.lathe(0, 138, 0, [[7.5, 0], [7.5, 12]], 0xe7e3da, { seg: 16, top: false });
    for (let i = 0; i < 4; i++) G.lathe(0, 139 + i * 2.9, 0, [[7.56, 0], [7.56, 1.6]], 0x5f7891, { seg: 16, top: false });
    F.lathe(0, 150, 0, [[8.4, 0], [8.4, 0.8], [4, 2.4], [2.2, 6]], 0xe7e3da, { seg: 16 });
    antenna(b, 156, 216.6, 1.6, 0.5, 6);
  });
  return { w: 23, d: 25.5, h: 185 };
});

landmark('olympiaturm', { places: ['München'], slot: 'skyline', far: true, title: 'Olympiaturm' }, (b) => {
  const { F, G } = b;
  const near = !b.lod;
  const seg = near ? 16 : 10;
  b.xf([0, 0, 0], [0, 0, 0], 0.85, () => {
    F.box(0, 0, -15, 44, 9, 30, 0xe7e3da, { g: [0.9, 1] });
    b.at(0, 0, -42, 0, () => {
      F.lathe(0, 0, 0, [[20, 0], [8.25, 3]], 0xc3bfb6, { seg, top: false });
      F.lathe(0, 0, 0, [[8.25, 0], [7.4, 25], [6.4, 70], [5.2, 110], [4.3, 145], [4.0, 172], [3.6, 200], [3.0, 248]], CONCRETE, { seg, top: false, g: [0.9, 1.04] });
      // unterer Korb mit drei Antennenkränzen
      F.lathe(0, 146, 0, [[4.3, 0], [10.55, 6], [10.55, 20], [9, 22]], 0xe7e3da, { seg: near ? 20 : 12 });
      for (const y of [152, 160, 168]) F.cyl(0, y - 0.35, 0, 14.1, 14.1, 0.7, 0xc3bfb6, { seg: near ? 20 : 12, bottom: true });
      // oberer Korb mit Fensterband und Aussichtsdeck
      F.lathe(0, 172, 0, [[4.3, 0], [14.15, 6], [14.15, 15]], 0xe7e3da, { seg: near ? 24 : 14 });
      G.lathe(0, 181, 0, [[14.2, 0], [14.2, 5]], 0x647f98, { seg: near ? 24 : 14, top: false });
      if (near) F.torus(0, 189, 0, 14.15, 0.12, 0x7a7873, { seg: 24, tube: 3 });
      F.lathe(0, 187, 0, [[6, 0], [5, 5]], 0xe7e3da, { seg: 12 });
      antenna(b, 192, 291.3, 2.2, 0.6, 7, [0xf0eee8, 0xf0eee8, 0xf0eee8, 0xf0eee8, 0xf0eee8, 0xd9573e, 0xf0eee8]);
    });
  });
  return { w: 44, d: 53, h: 248.6 };
});

// =============================================================================================================
// Berlin: Brandenburger Tor
// =============================================================================================================
/** Pferd im Profil (Blick nach +z), als dicke Scheibe: Ursprung zwischen den Hufen. */
function horse(b, x, col) {
  const prof = [[-1.3, 0], [-1.1, 0], [-0.95, 1.3], [0.7, 1.3], [0.95, 0.9], [1.6, 1.8], [1.25, 1.95], [0.95, 1.5], [1.0, 2.0], [1.55, 2.75], [1.95, 2.65], [2.05, 2.95], [1.5, 3.3], [0.9, 2.9], [0.6, 2.2], [-0.9, 2.15], [-1.5, 2.2], [-1.75, 1.4], [-1.45, 1.55], [-1.25, 1.4]];
  b.xf([x, 0, 0], [0, -Math.PI / 2, 0], 1, () => b.F.extrude(prof.map(([z, y]) => [z, y]), -0.42, 0.42, col, { crease: 0.6 }));
}

landmark('brandenburgerTor', { places: ['Berlin'], slot: 'square', title: 'Brandenburger Tor' }, (b) => {
  const { F } = b;
  const near = !b.lod;
  const stone = 0xe6dcc8;
  const shade = 0xcfc3ab;
  const green = 0x6f9e8c;
  const d = 11;
  const W = 40;
  // Säulen: sechs vorn, sechs hinten; mittlerer Durchgang breiter
  const xs = [-17.9, -11.6, -5.3, 5.3, 11.6, 17.9];
  F.box(0, 0, -d / 2, W + 1, 1.2, d + 1, shade);
  for (const x of xs) {
    for (const z of [-0.9, -d + 0.9]) {
      F.cyl(x, 1.2, z, 0.95, 0.8, 13.2, stone, { seg: near ? 12 : 8, top: false, g: [0.88, 1.03] });
      if (near) F.box(x, 14.2, z, 2.1, 0.5, 2.1, stone);
    }
  }
  // Querwände zwischen den Durchgängen (unter den inneren Säulenpaaren)
  for (const x of xs.slice(1, 5)) F.box(x, 1.2, -d / 2, 1.5, 13.4, d - 2.6, shade);
  for (const x of [xs[0], xs[5]]) F.box(x, 1.2, -d / 2, 1.5, 13.4, d - 2.6, shade);
  // Gebälk mit Triglyphen, Attika mit Relief, Stufen der Attika
  F.box(0, 14.4, -d / 2, W + 1.2, 2.6, d + 0.8, stone, { g: [0.95, 1.02] });
  if (near) for (let i = 0; i < 24; i++) b.G.rect(-W / 2 + 0.9 + i * (W - 1.6) / 23, 14.7, 0.42, 0.55, 1.4, shade);
  F.box(0, 17, -d / 2, W + 1.6, 0.6, d + 1.2, stone);
  F.box(0, 17.6, -d / 2, 24, 3.6, d - 1, stone, { g: [0.95, 1.03] });
  F.box(0, 21.2, -d / 2, 22, 0.5, d - 1.4, stone);
  b.G.rect(0, 18.2, -0.48, 18, 2.4, shade);
  F.box(0, 17.6, -d / 2, W - 2, 1.4, d - 1.2, stone);
  // Quadriga: vier Pferde, Wagen und die Lenkerin mit Stab, in Patinagrün
  b.at(0, 21.7, -d / 2 + 1, 0, () => {
    for (const x of [-2.4, -0.8, 0.8, 2.4]) horse(b, x, green);
    F.box(0, 0, -2.2, 3.4, 1.6, 1.6, green);
    F.cyl(0, 1.6, -2.4, 0.42, 0.32, 2.6, green, { seg: 6 });
    F.ball(0, 4.5, -2.4, 0.38, green, { ws: 6, hs: 4 });
    F.cyl(0.7, 1.6, -2.2, 0.06, 0.06, 4.6, green, { seg: 4 });
    F.ball(0.7, 6.3, -2.2, 0.3, green, { ws: 6, hs: 3 });
  });
  // Seitenflügel mit kleinen Säulenhallen
  for (const s of [-1, 1]) {
    const x = s * 27;
    F.box(x, 0, -d / 2 - 1, 12, 9, d - 2, stone, { g: [0.9, 1.02] });
    F.box(x, 9, -d / 2 - 1, 12.6, 1.2, d - 1.4, stone);
    if (near) for (const dx of [-4.2, -1.4, 1.4, 4.2]) F.cyl(x + dx, 0, -0.6, 0.45, 0.4, 7.6, stone, { seg: 8, top: false });
    b.at(x, 0, -1.98, 0, () => b.G.rect(0, 0.2, 0, 4, 5.5, 0x8a7d6c));
  }
  return { w: 66, d: 12, h: 28.5 };
});

// =============================================================================================================
// München: Frauenkirche
// =============================================================================================================
landmark('frauenkirche', { places: ['München'], slot: 'skyline', title: 'Frauenkirche' }, (b) => {
  const { F, G } = b;
  const near = !b.lod;
  const brick = 0xd08b67;
  const tuff = 0xeaddbf;
  const tile = 0xb8603f;
  const dome = 0x82b9a0;
  b.xf([0, 0, 0], [0, 0, 0], 0.9, () => {
    // Halle, Chor, Pultdach-Schürze und steiles Satteldach
    F.box(0, 0, -53, 40, 30, 96, brick, { g: [0.85, 1.02] });
    F.box(0, 0, -53, 40.4, 1.2, 96.4, tuff);
    const choir = [];
    for (let i = 0; i <= 4; i++) {
      const a = Math.PI + (i / 4) * Math.PI;
      choir.push([Math.cos(a) * 20, -101 + Math.sin(a) * 8]);
    }
    prism(F, choir.map(([x, z]) => [x, z]), 0, 30, brick, { g: [0.85, 1.02] });
    for (const s of [-1, 1]) {
      const q = [[s * 20.3, 30, -5], [s * 20.3, 30, -101], [s * 16, 36, -101], [s * 16, 36, -5]];
      F.quad(...(s > 0 ? q : q.reverse()), tile);
    }
    F.box(0, 36, -53, 33, 0.8, 96, tuff);
    b.gable(0, 37, -53, 35, 96, 28, tile, { axis: 'z', oe: 1, og: 0, ridge: near });
    spire(F, chamfer(35, 16, 0, 0, -103), 37, 62, tile, { ax: 0, az: -98 });
    // Hauptportal zwischen den Türmen
    b.at(0, 0, -4.98, 0, () => lancet(b, 0, 0.5, 4.2, 10, 0x5b4036));
    // Fenster der Halle: hohe Lanzetten zwischen Strebepfeilern
    for (const s of [-1, 1]) {
      b.at(s * 20, 0, -53, (s * Math.PI) / 2, () => {
        for (let z = -40; z <= 40; z += 10) {
          lancet(b, z, 6, 2.4, 20, 0x5e6c86);
          F.box(z + 5, 0, 0.4, 1.4, 28, 0.8, brick);
        }
      });
    }
    // Türme: Stumpf mit Gesimsbändern, Lanzetten oben, grüne Hauben mit Laterne, Kugel und Kreuz
    for (const s of [-1, 1]) {
      const x = s * 12.75;
      loft(F, [[chamfer(14.5, 14.5, 0.5, x, -7.25), 0], [chamfer(12.5, 12.5, 0.5, x, -7.25), 66]], brick, { g: [0.85, 1.04] });
      for (const y of [12, 27, 42, 55]) {
        const w = 14.5 - (2 * y) / 66 + 0.5;
        F.box(x, y, -7.25, w, 0.7, w, tuff);
      }
      F.box(x, 65.3, -7.25, 13.4, 0.9, 13.4, tuff);
      // Halbbreite des Turms in der Höhe y (verjüngt sich von 7,25 auf 6,25 m)
      const half = (y) => 7.25 - y / 66 + 0.03;
      for (const ry of [0, Math.PI / 2, -Math.PI / 2]) {
        b.at(x, 0, -7.25, ry, () => {
          for (const [y, w, h] of [[44, 1.6, 8], [56, 1.6, 7.5], [16, 0.7, 6], [31, 0.7, 6]]) b.at(0, 0, half(y + h / 2), 0, () => lancet(b, 0, y, w, h, 0x5e6c86));
        });
      }
      // welsche Haube: dicke Zwiebel, Rippen, Laterne
      F.lathe(x, 66, -7.25, [[6.2, 0], [7.2, 3], [7.4, 6.5], [6.6, 10], [4.6, 13.5], [2.2, 16], [1.4, 17]], dome, { seg: near ? 16 : 10, g: [0.92, 1.06] });
      if (near) {
        // Rippen über die Haube
        const prof = [[6.2, 0], [7.2, 3], [7.4, 6.5], [6.6, 10], [4.6, 13.5], [2.2, 16], [1.4, 17]];
        for (let k = 0; k < 8; k++) {
          const a = (k / 8) * TAU;
          const pt = ([r, y]) => [x + Math.cos(a) * (r + 0.08), 66 + y, -7.25 + Math.sin(a) * (r + 0.08)];
          for (let i = 0; i + 1 < prof.length; i++) F.rod(pt(prof[i]), pt(prof[i + 1]), 0.2, 0x5f9a84, { seg: 4 });
        }
      }
      F.lathe(x, 83, -7.25, [[1.4, 0], [1.4, 2.6], [1.9, 3], [0.6, 5.2]], 0x5f9a84, { seg: 8 });
      F.ball(x, 88.6, -7.25, 0.75, 0xf1cb62, { ws: 8, hs: 4 });
      F.box(x, 89.2, -7.25, 0.22, 3.4, 0.22, 0xf1cb62);
      F.box(x, 91.3, -7.25, 1.6, 0.22, 0.22, 0xf1cb62);
    }
  });
  return { w: 37.5, d: 100, h: 83.4 };
});

// =============================================================================================================
// Leipzig: Völkerschlachtdenkmal (als Bauwerk, ruhig und würdevoll)
// =============================================================================================================
landmark('voelkerschlachtdenkmal', { places: ['Leipzig'], slot: 'skyline', title: 'Völkerschlachtdenkmal' }, (b) => {
  const { F, G, W } = b;
  const near = !b.lod;
  const stone = 0xb9a98f;
  const dark = 0x8a7a66;
  const terr = 0xcdbfa6;
  const arc = 0x6b5546;
  b.xf([0, 0, 0], [0, 0, 0], 0.8, () => {
    // Wasserbecken vorn, Terrasse mit Stufen, Rasenränder
    F.box(0, 0, -30, 104, 0.6, 60, 0x86ad5e, { skip: 'b' });
    F.box(0, 0.6, -30, 92, 0.3, 46, terr);
    W.poolRect(0, 0.95, -30, 86, 40, 0x7db1c6, { rings: 0.05 });
    F.box(0, 0, -98, 124, 4, 76, terr, { g: [0.85, 1] });
    for (let i = 0; i < 3; i++) F.box(0, 0, -57.5 - i, 40, i + 1, 1, terr, { skip: 'b' });
    // Sockel mit zwei Absätzen und Reliefnische
    const z0 = -64;
    F.box(0, 4, z0 - 35, 80, 16, 70, stone, { g: [0.8, 1] });
    F.box(0, 20, z0 - 35, 74, 3, 64, stone);
    F.box(0, 23, z0 - 35, 68, 4, 58, stone, { g: [0.95, 1.02] });
    b.at(0, 0, z0, 0, () => {
      G.rect(0, 7, 0.02, 56, 12, dark);
      // Relief: flache, helle Gruppen vor der dunklen Nische
      if (near) for (let i = 0; i < 7; i++) F.rbox(-24 + i * 8, 8.5, 0.15, 5.2, 8 + (i % 3) * 1.2, 0.6, 1.2, terr, { seg: 2 });
    });
    // Würfel mit großen Rundbögen auf allen Seiten
    const zc = z0 - 35;
    F.box(0, 27, zc, 56, 25, 56, stone, { g: [0.86, 1.02] });
    b.at(0, 0, zc + 28, 0, () => b.sides(56, 56, () => {
      G.extrude(arch(0, 24, 29, 20, near ? 10 : 6), 0, 0.03, arc, { caps: 'f', sides: false });
      for (const x of [-8, 0, 8]) G.rect(x, 50.5, 0.03, 3, 1.2, arc);
    }));
    F.box(0, 52, zc, 50, 2.5, 50, stone);
    F.box(0, 54.5, zc, 46, 2.5, 46, stone);
    // Trommel, Kranz der Wächterfiguren, flache Kuppel, kleine Plattform
    F.lathe(0, 57, zc, [[17, 0], [17, 14], [14, 18], [8, 21]], stone, { seg: near ? 24 : 12, g: [0.9, 1.04] });
    const n = 12;
    for (let i = 0; i < n; i++) {
      const a = ((i + 0.5) / n) * TAU;
      const x = Math.cos(a) * 17.6;
      const z = zc + Math.sin(a) * 17.6;
      F.lathe(x, 66, z, [[1.9, 0], [2.1, 4], [1.8, 9], [1.2, 11.5], [1.4, 12.6], [0.6, 14], [0, 14.4]], 0xc2b399, { seg: near ? 8 : 5, g: [0.9, 1.05] });
    }
    F.box(0, 78, zc, 8, 3, 8, stone);
    F.box(0, 81, zc, 9, 0.6, 9, terr);
  });
  return { w: 99, d: 109, h: 65.3 };
});

// =============================================================================================================
// Fulda: Dom St. Salvator (Dientzenhofer, 1704–1712), zwei schlanke Türme mit doppelten Schweifhauben
// =============================================================================================================
const FULDA = { stone: 0xc4987a, light: 0xe2cdb5, roof: 0x564d50, gold: 0xe6bd4e, door: 0x4a3b33, pane: 0x4e5868, deep: 0x3b3436 };

/** Rundbogenfenster ohne Tiefe (Scheibe und flacher Rahmen, G) für Wände, die man nur von weitem sieht. */
function flatArch(b, x, y, w, h, frame, pane, fw = 0.28) {
  const n = b.lod ? 5 : 8;
  const inner = arch(x, w, y, h, n);
  b.G.extrude(inner, 0.02, 0.03, pane, { caps: 'f', sides: false, g: [1.1, 0.75] });
  if (frame != null) b.G.extrude(arch(x, w + 2 * fw, y - fw, h + 2 * fw, n), 0.04, 0.05, frame, { caps: 'f', holes: [inner], sides: false });
}

/** Goldenes Zifferblatt (Radius r) mit dunklen Zeigern in der Wandebene. */
function goldDial(b, x, y, r, gold, ink) {
  const { G } = b;
  G.disc(x, y, 0.04, r, gold, { seg: b.lod ? 10 : 16 });
  if (b.lod) return;
  const hand = (a, len, t) => G.quad([x - Math.cos(a) * t, y + Math.sin(a) * t, 0.07], [x + Math.cos(a) * t, y - Math.sin(a) * t, 0.07], [x + Math.sin(a) * len, y + Math.cos(a) * len, 0.07], [x + Math.sin(a) * len, y + Math.cos(a) * len, 0.07], ink);
  hand(-Math.PI / 3, r * 0.55, r * 0.09);
  hand(Math.PI / 3, r * 0.8, r * 0.07);
}

/**
 * Barocke Turmhaube über (x, y, z) wie am Fuldaer Dom: Schweifkuppel, offene Laterne, zweite kleinere Schweifkuppel
 * mit Laterne, Nadel, goldener Knauf und Kreuz, zusammen 22 m · s hoch. Achteckig wie die echten Hauben.
 */
function baroqueHelm(b, x, y, z, s, c) {
  const { F } = b;
  const near = !b.lod;
  const P = (pts) => pts.map(([r, h]) => [r * s, h * s]);
  const oct = { seg: 8, a0: Math.PI / 8, bottom: true, g: [0.9, 1.1] };
  F.lathe(x, y, z, P([[4.6, 0], [5.0, 0.9], [4.85, 1.9], [4.15, 2.9], [3.0, 4.0], [2.2, 4.8]]), c.roof, oct);
  // offene Laterne: dunkler Kern, helle Pfosten (fern ein heller Ring)
  if (near) {
    F.cyl(x, y + 4.8 * s, z, 1.4 * s, 1.4 * s, 2.5 * s, c.deep, { seg: 8, top: false });
    for (let i = 0; i < 8; i++) {
      const a = ((i + 0.5) / 8) * TAU;
      F.box(x + Math.sin(a) * 1.85 * s, y + 4.8 * s, z + Math.cos(a) * 1.85 * s, 0.42 * s, 2.5 * s, 0.42 * s, c.light, { skip: 'b' });
    }
  } else F.cyl(x, y + 4.8 * s, z, 1.9 * s, 1.9 * s, 2.5 * s, mix(c.light, c.deep, 0.45), { seg: 6, top: false });
  F.lathe(x, y + 7.3 * s, z, P([[2.5, 0], [2.85, 0.7], [2.7, 1.6], [2.1, 2.6], [1.3, 3.6], [1.0, 4.5]]), c.roof, oct);
  // kleine Laterne mit hellem Band, Nadel, Knauf und Kreuz
  F.cyl(x, y + 11.8 * s, z, 0.95 * s, 0.9 * s, 2.5 * s, c.roof, { seg: near ? 8 : 6, top: false });
  if (near) F.cyl(x, y + 12.4 * s, z, 0.99 * s, 0.97 * s, 1.0 * s, c.light, { seg: 8, top: false });
  F.lathe(x, y + 14.3 * s, z, P([[0.8, 0], [0.6, 0.5], [0.36, 3.0], [0.2, 3.5]]), c.roof, { seg: near ? 8 : 5 });
  F.ball(x, y + 18.3 * s, z, 0.8 * s, c.gold, { ws: near ? 8 : 6, hs: near ? 5 : 3 });
  F.box(x, y + 19.0 * s, z, 0.24 * s, 3.3 * s, 0.24 * s, c.gold);
  F.box(x, y + 21.0 * s, z, 1.5 * s, 0.24 * s, 0.24 * s, c.gold);
}

landmark('fuldaerDom', { places: ['Fulda'], slot: 'square', title: 'Dom St. Salvator' }, (b) => {
  const { F, G } = b;
  const near = !b.lod;
  const D = FULDA;
  const zf = -0.8; // Wandebene der Front; Gesimse, Säulen und Giebel stehen bis z = 0 vor
  b.xf([0, 0, 0], [0, 0, 0], 0.9, () => {
    // --- Langhaus, Querhaus und Chor nach hinten, dunkle Dächer, helle Traufgesimse --------------------------------
    F.box(0, 0, -40.5, 32, 22, 69, D.stone, { skip: 'f', g: [0.84, 1.02] });
    F.box(0, 21.3, -40.5, 32.8, 0.7, 69, D.light, { skip: 'fb' });
    b.gable(0, 22, -40.5, 32, 69, 11, D.roof, { axis: 'z', oe: 0.5, og: 0, ridge: near });
    F.extrude([[-16, 22], [16, 22], [0, 33]], -75.2, -74.8, D.stone);
    F.box(0, 0, -50, 52, 22, 24, D.stone, { g: [0.84, 1.02] });
    F.box(0, 21.3, -50, 52.8, 0.7, 24.8, D.light, { skip: 'b' });
    b.gable(0, 22, -50, 52, 24, 9, D.roof, { axis: 'x', oe: 0.5, og: 0.3, ridge: near });
    for (const s of [-1, 1]) {
      b.at(s * 26, 0, -50, (s * Math.PI) / 2, () => {
        F.extrude([[-12, 22], [12, 22], [0, 31]], -0.4, 0, D.stone, { crease: 2 });
        flatArch(b, 0, 7, 4.2, 10, D.light, D.pane, 0.4);
        G.disc(0, 25.6, 0.04, 1.3, D.pane, { seg: near ? 12 : 8 });
      });
    }
    F.box(0, 0, -87, 18, 20, 24, D.stone, { skip: 'f', g: [0.84, 1.02] });
    F.box(0, 19.3, -87, 18.8, 0.7, 24.8, D.light, { skip: 'b' });
    b.hip(0, 20, -87, 18, 24, 7, D.roof, { oe: 0.5 });
    // Flankenfenster: oben hohe Rundbögen, unten (nah) kleine
    for (const s of [-1, 1]) {
      b.at(s * 16, 0, 0, (s * Math.PI) / 2, () => {
        for (const zw of [-11, -17.5, -24, -30.5, -68.5]) {
          flatArch(b, -s * zw, 11, 2.8, 7.5, D.light, D.pane);
          if (near) flatArch(b, -s * zw, 3, 2.2, 3.8, null, D.pane);
        }
      });
      b.at(s * 9, 0, 0, (s * Math.PI) / 2, () => {
        for (const zw of [-81, -87, -93]) flatArch(b, -s * zw, 7, 2.6, 8, D.light, D.pane);
      });
    }

    // --- Front: Block zwischen den Kapellen mit Portal, großem Fenster und Giebel -----------------------------------
    F.box(0, 0, zf - 2.7, 32, 21, 5.4, D.stone, { g: [0.84, 1.02] });
    F.box(0, 11.4, zf - 2.4, 33, 0.8, 6.0, D.light);
    F.box(0, 20.5, zf - 2.4, 33.2, 0.9, 6.0, D.light);
    F.box(0, 0, zf - 2.4, 33, 0.9, 6.0, D.light, { skip: 'b' });
    F.box(0, 21, zf - 2.7, 12.5, 6, 5.4, D.stone, { g: [0.95, 1.02] });
    F.box(0, 26.6, zf - 2.5, 13.3, 0.7, 5.6, D.light);
    F.extrude([[-6.25, 27.3], [6.25, 27.3], [0, 33.5]], zf - 5.4, zf, D.stone, { crease: 2 });
    for (const sx of [-1, 1]) F.rod([sx * 6.7, 27.1, zf + 0.25], [0, 33.9, zf + 0.25], 0.34, D.light, { seg: 4 });
    // Segnende Figur auf dem Giebel (schlicht, hell)
    F.cyl(0, 33.6, zf - 0.3, 0.45, 0.32, 1.9, D.light, { seg: near ? 6 : 4 });
    F.ball(0, 35.8, zf - 0.3, 0.36, D.light, { ws: 6, hs: 4 });
    b.at(0, 0, zf, 0, () => {
      G.disc(0, 29.7, 0.04, 1.0, D.pane, { seg: near ? 12 : 8 });
      // Portal: dunkle Bogentür zwischen vier Säulen, Gebälk, Segmentgiebel
      G.extrude(arch(0, 3.4, 0.9, 6.0, near ? 10 : 6), 0.02, 0.03, D.door, { caps: 'f', sides: false });
      for (const x of [-4.5, -2.8, 2.8, 4.5]) F.cyl(x, 0.9, 0.2, 0.5, 0.46, 8.3, D.light, { seg: near ? 8 : 5, top: false });
      F.box(0, 9.2, 0.0, 11.6, 1.0, 1.2, D.light);
      const R = 8.75;
      const yc = 10.2 + 2.2 - R;
      const t0 = Math.acos(5.8 / R);
      const seg = [[-5.8, 10.2]];
      for (let i = 0; i <= 8; i++) {
        const a = Math.PI - t0 - ((Math.PI - 2 * t0) * i) / 8;
        seg.push([Math.cos(a) * R, yc + Math.sin(a) * R]);
      }
      F.extrude(seg, -0.4, 0.55, D.light, { crease: 2 });
      // großes Fenster mit zwei Figuren daneben
      archWin(b, 0, 13.4, 4.4, 6.6, { frame: D.light, pane: D.pane, fw: 0.3 });
      if (near) {
        for (const x of [-3.7, 3.7]) {
          F.box(x, 12.9, 0.3, 1.3, 0.5, 0.8, D.light);
          F.cyl(x, 13.4, 0.3, 0.42, 0.33, 2.0, D.light, { seg: 6 });
          F.ball(x, 15.75, 0.3, 0.32, D.light, { ws: 6, hs: 4 });
        }
        // Lisenen
        for (const x of [-15.5, -6.6, 6.6, 15.5]) F.box(x, 0.9, 0.12, 0.9, 10.5, 0.24, D.light, { skip: 'b' });
        for (const x of [-15.5, -6.6, 6.6, 15.5]) F.box(x, 12.2, 0.12, 0.9, 8.3, 0.24, D.light, { skip: 'b' });
      }
      // Fenster unter den Türmen
      for (const x of [-10.4, 10.4]) {
        flatArch(b, x, 3.4, 2.3, 4.8, D.light, D.pane);
        flatArch(b, x, 13.6, 2.4, 5.2, D.light, D.pane);
      }
    });

    // --- Türme: drei Geschosse über dem Block, das oberste mit gebrochenen Ecken, darauf die Hauben -----------------
    for (const s of [-1, 1]) {
      const tx = s * 10.4;
      const tz = zf - 4.15;
      F.box(tx, 21, tz, 8.3, 15, 8.3, D.stone, { g: [0.88, 1.02] });
      prism(F, chamfer(8.3, 8.3, 1.2, tx, tz), 36, 42.7, D.stone, { g: [0.9, 1.04] });
      F.box(tx, 26.5, tz, 9.0, 0.6, 9.0, D.light);
      F.box(tx, 35.6, tz, 9.1, 0.7, 9.1, D.light);
      prism(F, chamfer(9.4, 9.4, 1.5, tx, tz), 42.2, 42.75, D.light);
      b.at(tx, 0, zf, 0, () => b.sides(8.3, 8.3, (w, side) => {
        const inner = (side === 'r' && s < 0) || (side === 'l' && s > 0);
        const back = side === 'k';
        if (!inner && !back) flatArch(b, 0, 22.0, 1.9, 3.6, D.light, D.pane);
        if (side === 'f') goldDial(b, 0, 31.2, 1.15, D.gold, D.deep);
        else flatArch(b, 0, 28.6, 1.9, 4.2, D.light, D.pane);
        flatArch(b, 0, 37.1, 2.0, 4.2, D.light, D.deep, 0.22);
      }));
      baroqueHelm(b, tx, 42.75, tz, 1, D);
    }

    // --- Vierungskuppel: Tambour mit Fenstern, dunkle Schweifkuppel, Laterne -------------------------------------
    const dz = -50;
    const ds = near ? 16 : 10;
    F.cyl(0, 24, dz, 8.6, 8.6, 10, D.stone, { seg: ds, top: false, g: [0.9, 1.04] });
    F.cyl(0, 33.6, dz, 9.2, 9.2, 0.8, D.light, { seg: ds });
    F.lathe(0, 34.4, dz, [[9.0, 0], [8.8, 2.2], [7.9, 4.4], [6.2, 6.4], [4.0, 7.8], [2.3, 8.4]], D.roof, { seg: ds, g: [0.88, 1.08] });
    F.cyl(0, 42.8, dz, 2.0, 1.9, 3.4, D.light, { seg: near ? 8 : 6, top: false });
    F.lathe(0, 46.2, dz, [[2.4, 0], [2.0, 0.9], [0.9, 2.0], [0.25, 3.2]], D.roof, { seg: near ? 8 : 6 });
    F.ball(0, 49.9, dz, 0.55, D.gold, { ws: 6, hs: 4 });
    F.box(0, 50.3, dz, 0.2, 2.2, 0.2, D.gold);
    F.box(0, 51.7, dz, 1.0, 0.2, 0.2, D.gold);
    if (near) {
      for (let i = 0; i < 8; i++) {
        const a = ((2 * i + 0.5) / 16) * TAU;
        b.at(Math.sin(a) * 8.47, 0, dz + Math.cos(a) * 8.47, a, () => flatArch(b, 0, 26.4, 1.8, 4.6, null, D.pane));
      }
    }

    // --- Kuppelkapellen links und rechts der Front --------------------------------------------------------------
    for (const s of [-1, 1]) {
      const cx = s * 21.5;
      const cz = zf - 5.5;
      F.box(cx, 0, cz, 11, 11.6, 11, D.stone, { g: [0.84, 1.02] });
      F.box(cx, 11.3, cz, 11.8, 0.8, 11.8, D.light);
      F.box(cx, 0, cz, 11.6, 0.9, 11.6, D.light, { skip: 'b' });
      F.cyl(cx, 12.1, cz, 4.3, 4.3, 1.6, D.stone, { seg: near ? 12 : 8, top: false });
      F.lathe(cx, 13.7, cz, [[4.75, 0], [4.6, 1.5], [4.0, 2.9], [2.9, 4.0], [1.4, 4.7], [0.8, 4.8]], D.roof, { seg: near ? 12 : 8, g: [0.88, 1.06] });
      F.cyl(cx, 18.4, cz, 0.85, 0.8, 1.4, D.light, { seg: 6, top: false });
      F.lathe(cx, 19.8, cz, [[1.05, 0], [0.8, 0.6], [0.2, 1.4]], D.roof, { seg: 6 });
      F.ball(cx, 21.4, cz, 0.3, D.gold, { ws: 6, hs: 3 });
      F.box(cx, 21.6, cz, 0.14, 1.3, 0.14, D.gold);
      F.box(cx, 22.4, cz, 0.7, 0.14, 0.14, D.gold);
      b.at(cx, 0, zf, 0, () => flatArch(b, 0, 3.8, 2.4, 5, D.light, D.pane));
      b.at(cx + s * 5.5, 0, cz, (s * Math.PI) / 2, () => flatArch(b, 0, 3.8, 2.4, 5, D.light, D.pane));
    }
  });
  return { w: 48.6, d: 89.6, h: 58.5 };
});

// =============================================================================================================
// Gifhorn: Mühlenmuseum – Galerieholländer nach research/landmarks/stil-backstein (Braaker Mühle), dazu eine
// Bockwindmühle und der Mühlenteich. Die Flügelkreuze drehen sich (spins).
// =============================================================================================================
const MILL = {
  brick: 0xb65c42, plinth: 0xa6a09a, zinc: 0x9c9a94, zincDark: 0x7e7c78, cap: 0x8c9496, cream: 0xe6dcc4,
  sail: 0xe9e4d6, stock: 0x5a4a3c, red: 0xc0623f, door: 0x5a3a2a, frame: 0xf3ecdd, pane: 0x5e7a8c,
  plank: 0x8a6a4c, plankDark: 0x6e5440, roof: 0x7a5a48, path: 0xd9c9a8,
};
const OCT = Math.cos(Math.PI / 8);

/**
 * Etwas auf eine Seite eines achteckigen, sich verjüngenden Körpers setzen: Achse (x, z), Seite in Richtung a,
 * Umkreisradius r0 bei y0 bis r1 bei y1. fn zeichnet in der Wandebene (z = 0, x quer, y ab y0 an der Wand entlang).
 */
function onOctFace(b, x, z, a, r0, r1, y0, y1, fn) {
  const tilt = -Math.atan(((r0 - r1) * OCT) / (y1 - y0));
  b.at(x + Math.sin(a) * r0 * OCT, y0, z + Math.cos(a) * r0 * OCT, a, () => b.xf([0, 0, 0], [tilt, 0, 0], 1, fn));
}

/** Galerieholländer um die Achse (x, z): Sockel, Galerie, Achtkant, Kappe mit Windrose (Flügel: millSails). */
function galleryMill(b, x, z) {
  const { F, G } = b;
  const near = !b.lod;
  const M = MILL;
  const oct = { seg: 8, a0: Math.PI / 8 };
  // 1) Backsteinsockel mit Steinsockel und hellem Band, Tür und zwei kleine Fenster
  F.lathe(x, 0, z, [[4.6, 0], [4.2, 4.4]], M.brick, { ...oct, top: false, g: [0.82, 1.02] });
  F.lathe(x, 0, z, [[4.75, 0], [4.72, 0.4]], M.plinth, { ...oct, top: false });
  F.lathe(x, 2.2, z, [[4.47, 0], [4.45, 0.2]], M.cream, { ...oct, top: false });
  onOctFace(b, x, z, 0, 4.6, 4.2, 0, 4.4, () => {
    G.extrude(arch(0, 1.3, 0.4, 2.3, near ? 8 : 5), 0.02, 0.04, M.door, { caps: 'f', sides: false });
    if (near) for (const a of [-1, 1]) G.rect(a * 0.8, 3.0 - 0.0, 0.03, 0.01, 0.01, M.frame);
  });
  for (let i = 0; i < 3; i++) F.box(x, 0, z + 4.45 + 0.35 + i * 0.3, 1.6, 0.3 * (3 - i), 0.3, M.plinth, { skip: 'b' });
  for (const a of [Math.PI / 4, -Math.PI / 4, (3 * Math.PI) / 4]) {
    onOctFace(b, x, z, a, 4.6, 4.2, 0, 4.4, () => {
      G.rect(0, 2.95, 0.03, 0.9, 1.2, M.frame);
      G.rect(0, 3.05, 0.05, 0.7, 1.0, M.pane);
    });
  }
  // 2) Galerie: Boden als Ring, Pfosten, Handlauf, Streben
  F.lathe(x, 4.4, z, [[4.1, 0], [5.9, 0], [5.9, 0.3], [4.1, 0.3]], M.cream, { seg: near ? 16 : 8, crease: 0.3, top: false });
  if (near) {
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * TAU;
      F.box(x + Math.sin(a) * 5.75, 4.7, z + Math.cos(a) * 5.75, 0.12, 0.95, 0.12, M.cream, { skip: 'b' });
    }
    F.torus(x, 5.62, z, 5.75, 0.08, M.cream, { seg: 16, tube: 4 });
    F.torus(x, 5.15, z, 5.75, 0.04, M.cream, { seg: 16, tube: 3 });
    for (let i = 0; i < 8; i++) {
      const a = ((i + 0.5) / 8) * TAU;
      F.rod([x + Math.sin(a) * 4.25, 3.1, z + Math.cos(a) * 4.25], [x + Math.sin(a) * 5.5, 4.42, z + Math.cos(a) * 5.5], 0.08, M.stock, { seg: 4 });
    }
  } else F.lathe(x, 4.7, z, [[5.8, 0], [5.8, 0.9]], mix(M.cream, M.zinc, 0.35), { seg: 8, top: false });
  // 3) Achtkant mit leichtem Bauch, Blechnähte als dunklere Kanten, kleine Fenster abwechselnd
  F.lathe(x, 4.7, z, [[3.9, 0], [3.78, 3], [3.42, 6.5], [2.7, 9.5]], M.zinc, { ...oct, top: false, g: [0.88, 1.06] });
  const wins = [[7.0, 0], [9.5, Math.PI / 2], [12.0, Math.PI / 4], [9.5, -Math.PI / 2], [7.0, Math.PI]];
  for (const [y, a] of wins) {
    if (!near && y > 8) continue;
    onOctFace(b, x, z, a, 3.9, 2.7, 4.7, 14.2, () => {
      G.rect(0, y - 4.7 - 0.08, 0.03, 0.66, 0.86, M.frame);
      G.rect(0, y - 4.7, 0.05, 0.5, 0.7, M.pane);
    });
  }
  // 4) Krühring und Kappe (halbes Ellipsoid), Windrose hinten
  F.cyl(x, 14.2, z, 2.95, 2.95, 0.4, M.zincDark, { seg: near ? 12 : 8 });
  F.ball(x, 14.6, z, 1, M.cap, { lat: [0, Math.PI / 2], ws: near ? 14 : 8, hs: near ? 5 : 3, sx: 2.2, sz: 3.0, sy: 4.4, g: [0.9, 1.08] });
  F.rod([x, 15.4, z - 2.4], [x, 15.6, z - 4.6], 0.15, M.stock, { seg: 4 });
  F.rod([x, 14.3, z - 2.6], [x, 15.5, z - 4.4], 0.1, M.stock, { seg: 4 });
  const nb = near ? 8 : 4;
  for (let i = 0; i < nb; i++) {
    b.xf([x, 15.6, z - 4.6], [(i / nb) * TAU, 0, 0], 1, () => F.box(0, 0.3, 0, 0.06, 1.45, 0.5, M.red));
  }
  F.ball(x, 15.6, z - 4.6, 0.25, M.stock, { ws: 6, hs: 3 });
}

/** Flügelkreuz um die Nabe (Ursprung, Ebene z = 0): vier Ruten mit Jalousieflügeln, Radius r. */
function millSails(b, r = 10, o = {}) {
  const { F, G } = b;
  const near = !b.lod;
  const M = MILL;
  b.xf([0, 0, -0.7], [Math.PI / 2, 0, 0], 1, () => F.cyl(0, 0, 0, 0.45, 0.42, 0.75, M.stock, { seg: near ? 8 : 6 }));
  const pw = o.panel ?? 2.0;
  const p0 = r * 0.32;
  for (let k = 0; k < 4; k++) {
    b.xf([0, 0, 0.12], [0, 0, Math.PI / 4 + (k * Math.PI) / 2], 1, () => {
      F.box(0, 0.3, 0, 0.3, r - 0.3, 0.3, M.stock);
      // Flügelfläche an einer Seite der Rute: heller Rahmen, Jalousiestreifen
      F.box(0.15 + pw / 2, p0, -0.02, pw, r - 0.4 - p0, 0.1, M.sail);
      if (near) {
        const n = 10;
        for (let i = 0; i < n; i++) G.rect(0.15 + pw / 2, p0 + ((i + 0.5) / n) * (r - 0.4 - p0) - 0.05, 0.05, pw - 0.2, 0.1, M.stock);
        F.box(0.15 + pw, p0, 0, 0.1, r - 0.4 - p0, 0.14, M.stock);
      }
    });
  }
  F.ball(0, 0, 0.2, 0.35, M.stock, { ws: 6, hs: 3 });
}

/** Bockwindmühle um die Achse (x, z): Holzkasten auf dem Bock, Treppe und Steert hinten (Flügel: millSails). */
function postMill(b, x, z) {
  const { F, G } = b;
  const near = !b.lod;
  const M = MILL;
  // Bock: vier Steinsockel, gekreuzte Schwellen, Streben, Hausbaum
  for (const [sx, sz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) F.box(x + sx * 2.7, 0, z + sz * 2.7, 0.8, 0.6, 0.8, M.plinth);
  F.box(x, 0.6, z, 6.2, 0.4, 0.4, M.plankDark);
  F.box(x, 0.6, z, 0.4, 0.4, 6.2, M.plankDark);
  for (const [sx, sz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) F.rod([x + sx * 2.5, 0.9, z + sz * 2.5], [x + sx * 0.3, 3.0, z + sz * 0.3], 0.14, M.plankDark, { seg: 4 });
  F.cyl(x, 0.9, z, 0.35, 0.32, 2.9, M.plankDark, { seg: 6 });
  // Kasten mit Satteldach
  F.box(x, 3.6, z, 5.0, 6.0, 6.4, M.plank, { g: [0.82, 1.04] });
  b.gable(x, 9.6, z, 5.0, 6.4, 2.2, M.roof, { axis: 'z', oe: 0.25, og: 0.2, ridge: near });
  b.at(x, 0, z + 3.2, 0, () => F.extrude([[-2.5, 9.6], [2.5, 9.6], [0, 11.8]], -0.2, 0, M.plank));
  b.at(x, 0, z - 3.2, Math.PI, () => F.extrude([[-2.5, 9.6], [2.5, 9.6], [0, 11.8]], -0.2, 0, M.plank));
  if (near) {
    // Bretterfugen und Fenster
    for (const s of [-1, 1]) {
      b.at(x + s * 2.5, 0, z, (s * Math.PI) / 2, () => {
        for (let i = 1; i < 6; i++) G.rect(0, 3.6 + i, 0.02, 6.3, 0.05, M.plankDark);
        G.rect(0, 6.0, 0.03, 0.9, 0.9, M.frame);
        G.rect(0, 6.08, 0.05, 0.74, 0.74, M.pane);
      });
    }
  }
  // Treppe und Steert hinten
  b.at(x, 0, z - 3.2, 0, () => {
    F.rod([-0.7, 4.0, 0], [-0.7, 0.2, -5.0], 0.1, M.plankDark, { seg: 4 });
    F.rod([0.7, 4.0, 0], [0.7, 0.2, -5.0], 0.1, M.plankDark, { seg: 4 });
    if (near) for (let i = 1; i < 8; i++) F.box(0, 4.0 - (i * 3.8) / 8, -(i * 5.0) / 8, 1.4, 0.08, 0.3, M.plank);
    F.rod([0, 3.8, 0], [0, 0.5, -7.2], 0.17, M.plankDark, { seg: 4 });
    F.cyl(0, 0, -7.4, 0.25, 0.25, 0.6, M.plankDark, { seg: 5 });
    G.rect(0, 4.1, 0.03, 1.0, 1.9, M.door);
  });
}

landmark('muehlenmuseum', {
  places: ['Gifhorn'], slot: 'skyline', far: true, title: 'Mühlenmuseum',
  spins: [
    { at: [9, 15.9, -16.7 + 3.4], speed: 0.32, make: (b) => millSails(b, 10) },
    { at: [-15, 8.6, -12 + 3.45], speed: 0.4, phase: 0.6, make: (b) => millSails(b, 7.4, { panel: 1.6 }) },
  ],
}, (b) => {
  const { F, W } = b;
  const near = !b.lod;
  // Wiese mit Sandweg, Mühlenteich mit Steinrand, ein paar runde Bäume
  F.box(0, 0, -15, 54, 0.08, 30, mix(PAL.grass[0], PAL.grass[1], 0.4), { skip: 'b' });
  F.poly([[-3, 0.1, 0], [3, 0.1, 0], [10, 0.1, -9], [7, 0.1, -10], [-1.5, 0.1, -2.5], [-12, 0.1, -6.5], [-13.5, 0.1, -5]], MILL.path, { flat: true });
  W.pool(19, 0.16, -6.5, 4.6, 0x7cc0dc, { rings: 0.3 });
  F.lathe(19, 0, -6.5, [[4.5, 0], [5.2, 0], [5.2, 0.35], [4.5, 0.35]], PAL.stone, { seg: near ? 16 : 10, crease: 0.3, top: false });
  galleryMill(b, 9, -16.7);
  postMill(b, -15, -12);
  ballTree(b, -24, 0.08, -24, 2.6, 7.5, PAL.crown[1]);
  ballTree(b, 22.5, 0.08, -20, 2.2, 6.5, PAL.crown[0]);
  if (near) ballTree(b, -3.5, 0.08, -27, 2.0, 6, PAL.crown[2]);
  return { w: 54, d: 30, h: 26 };
});

// =============================================================================================================
// Hannover: Neues Rathaus (Eggert, 1901–1913) am Maschteich – lange helle Front, Eckpavillons, Kuppel 97,7 m
// =============================================================================================================
const HAN = { stone: 0xdccfb6, shade: 0xc2b398, cornice: 0xeae0cc, copper: 0x7fae98, copperDark: 0x5f8f7b, pane: 0x4f5c6c, door: 0x4a3d34, gold: 0xe2b84e, water: 0x86bcd4 };

landmark('neuesRathaus', { places: ['Hannover'], slot: 'skyline', far: true, title: 'Neues Rathaus' }, (b) => {
  const { F, G, W } = b;
  const near = !b.lod;
  const H = HAN;
  b.xf([0, 0, 0], [0, 0, 0], 0.72, () => {
    // Maschteich vor der Front, Steinkante, Rasen an den Seiten
    F.box(0, 0, -10, 135, 0.08, 20, mix(PAL.grass[0], PAL.grass[1], 0.4), { skip: 'b' });
    W.poolRect(0, 0.14, -9.5, 110, 13, H.water, { rings: 0.08 });
    for (const s of [-1, 1]) {
      F.box(0, 0, -9.5 + s * 6.85, 111.4, 0.45, 0.7, H.cornice);
      F.box(s * 55.35, 0, -9.5, 0.7, 0.45, 13, H.cornice);
    }
    const z0 = -20; // Vorderkante der Front
    const zc = z0 - 33.5; // Mitte des Hauses (Kuppel)
    // Flügel: vorn, hinten, zwei Seiten; Höhe 24, steile Kupferdächer
    const wing = (cx, cz, w, d, axis) => {
      F.box(cx, 0, cz, w, 24, d, H.stone, { g: [0.84, 1.02] });
      F.box(cx, 23.4, cz, w + 0.8, 0.9, d + 0.8, H.cornice);
      if (axis) b.gable(cx, 24.3, cz, w, d, 7.5, H.copper, { axis, oe: 0.3, og: 0, ridge: near });
    };
    wing(0, z0 - 8, 93, 16, 'x');
    wing(0, z0 - 59, 93, 16, 'x');
    for (const s of [-1, 1]) wing(s * 56.5, zc, 16, 35, 'z');
    // Eckpavillons: höher, steile Walmdächer mit Laterne
    for (const sx of [-1, 1]) {
      for (const sz of [0, 1]) {
        const px = sx * 55.5;
        const pz = sz ? z0 - 58 : z0 - 9;
        F.box(px, 0, pz, 18, 27, 18, H.stone, { g: [0.84, 1.02] });
        F.box(px, 26.4, pz, 18.8, 1.0, 18.8, H.cornice);
        b.hip(px, 27.4, pz, 18, 18, 11, H.copper, { oe: 0.3 });
        F.cyl(px, 37.8, pz, 1.1, 1.0, 2.6, H.cornice, { seg: 6 });
        F.lathe(px, 40.4, pz, [[1.4, 0], [1.0, 0.8], [0.3, 2.4], [0.08, 3.6]], H.copper, { seg: 6 });
      }
    }
    // Mittelrisalit vorn: Portal mit drei Bögen, darüber hohe Fenster und ein Giebel
    F.box(0, 0, z0 - 8, 32, 30, 16, H.stone, { g: [0.84, 1.02] });
    F.box(0, 29.4, z0 - 8, 32.8, 1.0, 16.8, H.cornice);
    b.gable(0, 30.4, z0 - 8, 32, 16, 8, H.copper, { axis: 'z', oe: 0.3, og: 0.4, ridge: near });
    b.at(0, 0, z0, 0, () => {
      F.extrude([[-16, 30.4], [16, 30.4], [0, 38.4]], -0.6, 0.2, H.stone, { crease: 2 });
      G.disc(0, 33.4, 0.24, 1.8, H.pane, { seg: near ? 12 : 8 });
      for (const x of [-7, 0, 7]) G.extrude(arch(x, 5, 0.6, 8, near ? 8 : 5), 0.02, 0.03, H.door, { caps: 'f', sides: false });
      F.box(0, 0, 0.6, 26, 0.6, 1.2, H.cornice, { skip: 'b' });
      for (const x of [-10.5, -3.5, 3.5, 10.5]) F.box(x, 0.6, 0.2, 1.4, 22, 0.4, H.cornice, { skip: 'b' });
      for (const x of [-7, 0, 7]) {
        flatArch(b, x, 11, 3.2, 7.5, H.cornice, H.pane);
        flatArch(b, x, 21, 2.8, 6.0, H.cornice, H.pane);
      }
    });
    // Fensterreihen der Front (drei Geschosse), Gesimse dazwischen
    b.at(0, 0, z0, 0, () => {
      for (const s of [-1, 1]) {
        for (let x = 19; x < 46; x += 4.2) {
          for (const [y, h] of [[3.2, 4.4], [10.2, 4.8], [17.2, 4.0]]) {
            G.rect(s * x, y, 0.03, 2.2, h, H.pane);
            if (near) G.rect(s * x, y - 0.45, 0.025, 2.9, 0.35, H.cornice);
          }
        }
      }
      F.box(0, 8.6, 0.0, 93, 0.6, 0.6, H.cornice);
      F.box(0, 15.6, 0.0, 93, 0.5, 0.6, H.cornice);
    });
    // Pavillon-Fenster zur Front
    for (const sx of [-1, 1]) {
      b.at(sx * 55.5, 0, z0, 0, () => {
        for (const x of [-4.5, 0, 4.5]) for (const [y, h] of [[3.2, 4.4], [10.2, 4.8], [17.6, 5.2]]) G.rect(x, y, 0.03, 2.2, h, H.pane);
      });
      b.at(sx * 64.5, 0, zc, (sx * Math.PI) / 2, () => {
        for (let x = -30; x <= 30; x += 6) for (const y of [3.2, 10.2, 17.2]) G.rect(x, y, 0.03, 2.2, 4.4, H.pane);
      });
    }
    // Kuppel: quadratischer Unterbau mit Ecktürmchen, Tambour mit Fenstern, hohe Kupferkuppel, Laterne mit Umgang
    F.box(0, 0, zc, 30, 36, 30, H.stone, { g: [0.84, 1.03] });
    F.box(0, 35.4, zc, 31, 1.0, 31, H.cornice);
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const tx = sx * 13.2;
        const tz = zc + sz * 13.2;
        F.cyl(tx, 36, tz, 2.3, 2.2, 9, H.stone, { seg: near ? 8 : 6, top: false });
        F.cyl(tx, 45, tz, 2.6, 2.6, 0.6, H.cornice, { seg: near ? 8 : 6 });
        F.lathe(tx, 45.6, tz, [[2.4, 0], [2.3, 1.2], [1.5, 2.8], [0.5, 4.0], [0.12, 5.6]], H.copper, { seg: near ? 8 : 6 });
      }
    }
    const ds = near ? 20 : 12;
    F.cyl(0, 36.4, zc, 11.6, 11.6, 17.6, H.stone, { seg: ds, top: false, g: [0.9, 1.04] });
    F.cyl(0, 53.6, zc, 12.4, 12.4, 1.0, H.cornice, { seg: ds });
    if (near) {
      for (let i = 0; i < 10; i++) {
        const a = ((2 * i + 0.5) / 20) * TAU;
        b.at(Math.sin(a) * 11.45, 0, zc + Math.cos(a) * 11.45, a, () => flatArch(b, 0, 40, 2.4, 9.5, H.cornice, H.pane, 0.3));
      }
    }
    F.lathe(0, 54.6, zc, [[11.4, 0], [11.3, 3], [10.8, 8], [9.6, 13], [7.8, 18.5], [5.4, 23.5], [3.4, 27], [2.6, 28.4]], H.copper, { seg: ds, g: [0.86, 1.1] });
    if (near) {
      // Rippen auf der Kuppel
      const prof = [[11.45, 0], [11.35, 3], [10.85, 8], [9.65, 13], [7.85, 18.5], [5.45, 23.5], [3.45, 27]];
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * TAU;
        for (let k = 0; k < prof.length - 1; k++) {
          const [r0, y0] = prof[k];
          const [r1, y1] = prof[k + 1];
          F.rod([Math.sin(a) * r0, 54.6 + y0, zc + Math.cos(a) * r0], [Math.sin(a) * r1, 54.6 + y1, zc + Math.cos(a) * r1], 0.22, H.copperDark, { seg: 4 });
        }
      }
    }
    // Laterne mit Säulen und Umgang, kleine Haube, Spitze mit goldenem Knauf
    F.cyl(0, 83, zc, 2.6, 2.6, 0.6, H.cornice, { seg: near ? 10 : 6 });
    F.cyl(0, 83.6, zc, 2.0, 2.0, 5.2, near ? H.pane : H.shade, { seg: near ? 10 : 6, top: false });
    if (near) for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU;
      F.cyl(Math.sin(a) * 2.25, 83.6, zc + Math.cos(a) * 2.25, 0.22, 0.2, 5.2, H.cornice, { seg: 5, top: false });
    }
    F.cyl(0, 88.8, zc, 3.2, 3.2, 0.5, H.cornice, { seg: near ? 12 : 6 });
    if (near) F.torus(0, 89.9, zc, 3.1, 0.07, H.cornice, { seg: 12, tube: 3 });
    F.lathe(0, 89.3, zc, [[2.3, 0], [2.1, 1.4], [1.3, 3.0], [0.5, 4.2], [0.2, 7.0]], H.copper, { seg: near ? 10 : 6 });
    F.ball(0, 96.7, zc, 0.5, H.gold, { ws: 6, hs: 4 });
  });
  return { w: 97.2, d: 63, h: 70.4 };
});

// =============================================================================================================
// Kassel: Herkules auf dem Oktogon mit Pyramide, die Kaskaden den Berg hinab (Bergpark Wilhelmshöhe)
// =============================================================================================================
const HERK = { tuff: 0x9e9584, tuffDark: 0x7f776a, copper: 0x7fae96, lawn: 0x8fbf6a, forest: 0x4f7f4a, forest2: 0x5f8f50, cascade: 0xb4ab98, water: 0x8cc8e0, foam: 0xf2f6f8 };

/** Gitterlinien von a nach b in n Schritten, dazu die Linien extra (z. B. Ränder von Wegen und Weinbergen). */
function gridLines(a, b, n, extra = []) {
  const out = [...Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n), ...extra.filter((v) => (v - a) * (v - b) < 0)];
  return [...new Set(out.map((v) => Math.round(v * 100) / 100))].sort((p, q) => (b > a ? p - q : q - p));
}

/**
 * Höhe der vier Ränder jedes gebauten Geländes (lokal, vor b.xf): { name, lod, closed, front, back, left, right }. Vorn und
 * an den Seiten muss das Gelände auf Bodenhöhe auslaufen, sonst sieht man von der Straße eine offene Schnittkante
 * (Node-Test); closed nennt Ränder, die ein anderes Teil schließt (z. B. eine Kaimauer bis zur Randhöhe).
 */
export const terrainEdges = [];

/**
 * Gelände über einem Gitter (xs quer, zs von vorn nach hinten): Höhe hf(x, z), Farbe je Zelle cf(x, z, y) aus der
 * Zellmitte (gerade Grenzen auf den Gitterlinien), Helligkeit je Eckpunkt kf(x, z, y) für weiche Flecken; closed wie
 * bei terrainEdges.
 */
function terrain(b, xs, zs, hf, cf, kf = null, { closed = [] } = {}) {
  const top = (list) => Math.max(...list.map(([x, z]) => hf(x, z)));
  terrainEdges.push({
    name: building, lod: b.lod, closed,
    front: top(xs.map((x) => [x, zs[0]])), back: top(xs.map((x) => [x, zs[zs.length - 1]])),
    left: top(zs.map((z) => [xs[0], z])), right: top(zs.map((z) => [xs[xs.length - 1], z])),
  });
  const nx = xs.length - 1;
  const P = [];
  const N = [];
  const K = [];
  const e = 0.5;
  for (const z of zs) {
    for (const x of xs) {
      const y = hf(x, z);
      P.push(x, y, z);
      const dx = (hf(x + e, z) - hf(x - e, z)) / (2 * e);
      const dz = (hf(x, z + e) - hf(x, z - e)) / (2 * e);
      const l = Math.hypot(dx, 1, dz);
      N.push(-dx / l, 1 / l, -dz / l);
      K.push(kf ? kf(x, z, y) : 1);
    }
  }
  const byCol = new Map();
  for (let j = 0; j + 1 < zs.length; j++) {
    for (let i = 0; i < nx; i++) {
      const a = j * (nx + 1) + i;
      const cx = (xs[i] + xs[i + 1]) / 2;
      const cz = (zs[j] + zs[j + 1]) / 2;
      const c = cf(cx, cz, hf(cx, cz));
      if (!byCol.has(c)) byCol.set(c, []);
      byCol.get(c).push(a, a + 1, a + nx + 2, a, a + nx + 2, a + nx + 1);
    }
  }
  for (const [c, list] of byCol) b.F._tris(P, N, list, c, { g: [0.88, 1.04] }, K);
}

/** Weiche Flecken für Wald und Wiesen: Helligkeit um 1 (0,86 … 1,1). */
const mottle = (x, z) => 0.98 + 0.07 * Math.sin(x * 0.13 + z * 0.05) + 0.05 * Math.sin(z * 0.11 - x * 0.07);

/** Spielzeugfigur nach Art des Farnesischen Herkules: steht, stützt sich links auf die Keule (h = Gesamthöhe). */
function heraclesFigure(b, x, y, z, h, col) {
  const { F } = b;
  const k = h / 8.3;
  const near = !b.lod;
  const seg = near ? 8 : 5;
  b.xf([x, y, z], [0, 0, 0], k, () => {
    // Beine leicht gegrätscht, Rumpf, Kopf, Arme; Keule unter der linken Achsel mit dem Fell darüber
    F.cyl(-0.55, 0, 0, 0.42, 0.55, 3.6, col, { seg });
    F.cyl(0.6, 0, 0.1, 0.42, 0.55, 3.6, col, { seg });
    F.lathe(0, 3.4, 0, [[0.9, 0], [1.15, 1.0], [1.35, 2.4], [1.1, 3.2], [0.5, 3.5]], col, { seg, g: [0.9, 1.08] });
    F.ball(0, 7.25, 0.05, 0.55, col, { ws: seg, hs: near ? 5 : 3 });
    F.cyl(0, 6.7, 0, 0.32, 0.3, 0.3, col, { seg: 5 });
    F.rod([1.3, 6.3, 0], [1.25, 4.2, -0.6], 0.3, col, { seg: 5 });
    F.rod([-1.3, 6.3, 0], [-1.9, 5.3, 0.1], 0.3, col, { seg: 5 });
    F.rod([-2.2, 0, 0.3], [-1.95, 5.4, 0.1], 0.32, col, { seg: 5, r1: 0.5 });
    F.box(-2.0, 4.6, 0.1, 0.9, 1.3, 0.8, col);
  });
}

landmark('herkules', { places: ['Kassel'], slot: 'skyline', far: true, title: 'Herkules' }, (b) => {
  const { F, G, W } = b;
  const near = !b.lod;
  const K = HERK;
  b.xf([0, 0, 0], [0, 0, 0], 0.55, () => {
    // Berg: steigt von vorn (Neptunbecken) 200 m nach hinten um 60 m, oben das Plateau, dahinter und seitlich fällt er
    // sanft ab; Wald mit weichen Flecken, Rasenschneise entlang der Kaskaden
    const top = 60;
    const ss = (a, b2, v) => {
      const t = Math.min(1, Math.max(0, (v - a) / (b2 - a)));
      return t * t * (3 - 2 * t);
    };
    const hf = (x, z) => 0.05 + top * (0.15 * ss(15, 215, -z) + 0.85 * ss(15, 215, -z) ** 1.3) * (1 - ss(305, 345, -z)) * (1 - ss(70, 125, Math.abs(x)));
    const cf = (x, z) => (Math.abs(x) < 14 && -z < 222 ? K.lawn : K.forest);
    const xs = gridLines(-125, 125, near ? 20 : 10, [-14, 14, -8, 8]);
    const zs = gridLines(0, -345, near ? 30 : 15, [-222]);
    terrain(b, xs, zs, hf, cf, mottle);
    // Kaskaden: Becken um Becken den Hang hinauf, das Wasser fällt über jede Stufe; unten das Neptunbecken
    const steps = near ? 22 : 11;
    let prev = 0.35;
    for (let i = 0; i < steps; i++) {
      const za = -22 - (i * 192) / steps;
      const zb = -22 - ((i + 1) * 192) / steps;
      const ya = hf(0, za);
      const yt = hf(0, zb) + 0.3;
      F.box(0, ya - 1.5, (za + zb) / 2, 12, yt - ya + 1.5, za - zb, K.cascade, { g: [0.85, 1.02] });
      W.poolRect(0, yt + 0.12, (za + zb) / 2, 5.5, za - zb - 0.8, K.water, { rings: 0.15 });
      G.quad([-2.75, prev, za + 0.06], [2.75, prev, za + 0.06], [2.75, yt + 0.14, za + 0.06], [-2.75, yt + 0.14, za + 0.06], K.foam, { g: [0.9, 1.05] });
      prev = yt + 0.12;
    }
    W.pool(0, 0.18, -11, 11, K.water, { rings: 0.4 });
    F.lathe(0, 0, -11, [[10.9, 0], [11.8, 0], [11.8, 0.6], [10.9, 0.6]], K.cascade, { seg: near ? 20 : 12, crease: 0.3, top: false });
    // Oktogon (offenes Achteck, 70 m, 33 m hoch, Arkaden in drei Geschossen), Pyramide (26 m) an der Talseite,
    // obenauf die Figur – das Bauwerk um 1,3 größer als der Berg, damit es von unten so mächtig wirkt wie echt
    const oz = -262;
    b.xf([0, hf(0, oz) - 0.6, oz], [0, 0, 0], 1.3, () => {
      const R = 37.9;
      F.lathe(0, 0, 0, [[R, 0], [R, 33], [R - 4, 33]], K.tuff, { seg: 8, a0: Math.PI / 8, crease: 0.5, g: [0.82, 1.02] });
      F.lathe(0, 32, 0, [[R + 0.8, 0], [R + 0.8, 1.6]], K.tuffDark, { seg: 8, a0: Math.PI / 8, top: false });
      const ap = R * OCT;
      const side = 2 * R * Math.sin(Math.PI / 8);
      for (let f = 0; f < 8; f++) {
        const a = (f / 8) * TAU;
        b.at(Math.sin(a) * ap, 0, Math.cos(a) * ap, a, () => {
          const n = near ? 5 : 3;
          for (const [y, h] of [[2, 8], [12.5, 7.5], [23, 7]]) {
            for (let k = 0; k < n; k++) {
              const x = -side / 2 + (side / n) * (k + 0.5);
              G.extrude(arch(x, (side / n) * 0.55, y, h, near ? 6 : 4), 0.02, 0.04, 0x4d463d, { caps: 'f', sides: false });
            }
          }
        });
      }
      const pz = 22;
      F.box(0, 33, pz, 13, 4, 13, K.tuff, { g: [0.86, 1] });
      F.lathe(0, 37, pz, [[7.4, 0], [1.6, 22]], K.tuff, { seg: 4, a0: Math.PI / 4, g: [0.84, 1.04] });
      F.box(0, 59, pz, 2.6, 3, 2.6, K.tuffDark);
      heraclesFigure(b, 0, 62, pz, 8.3, K.copper);
    });
  });
  return { w: 137.5, d: 190, h: 86 };
});

// =============================================================================================================
// Dresden: Frauenkirche (Bähr, 1726–1743, wiederaufgebaut 1994–2005) – die „Steinerne Glocke“
// =============================================================================================================
const FKD = { sand: 0xe0cfaf, light: 0xeee3cc, dark: 0x6f6556, mid: 0xa79a83, pane: 0x56606e, door: 0x5a4636, gold: 0xe4bb52 };

landmark('frauenkircheDresden', { places: ['Dresden'], slot: 'square', title: 'Frauenkirche' }, (b) => {
  const { F, G } = b;
  const near = !b.lod;
  const D = FKD;
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  // Alte, dunkle Steine zwischen den hellen neuen: Wandfelder, die zufällig dunkler sind
  const stone = () => {
    const r = rnd();
    return r < 0.2 ? D.dark : r < 0.36 ? D.mid : D.sand;
  };
  const H0 = 27; // Hauptgesims
  b.xf([0, 0, 0], [0, 0, 0], 0.8, () => {
    const zc = -24;
    // Unterbau: Quadrat mit abgeschrägten Ecken (dort die Treppentürme), Felder zwischen Lisenen
    const body = chamfer(42, 42, 9, 0, zc);
    prism(F, body, 0, H0, D.sand, { g: [0.86, 1.02] });
    prism(F, grow(chamfer(42, 42, 9, 0, zc), 0.6), H0 - 0.6, H0 + 0.6, D.light);
    for (let s = 0; s < 4; s++) {
      b.at(0, 0, zc, (s * Math.PI) / 2, () => b.at(0, 0, 21, 0, () => {
        for (let k = -1; k <= 1; k++) {
          for (const [y0, y1] of [[0.8, 13], [13, H0 - 0.8]]) {
            const c = stone();
            if (c !== D.sand) G.rect(k * 8, y0, 0.03, 7.2, y1 - y0, c);
          }
          flatArch(b, k * 8, 3.6, 3.0, 7.0, D.light, D.pane);
          flatArch(b, k * 8, 15.2, 3.0, 8.4, D.light, D.pane);
        }
        for (const x of [-12, -4, 4, 12]) F.box(x, 0, 0.15, 0.9, H0 - 0.8, 0.3, D.light, { skip: 'b' });
        if (s === 0) G.extrude(arch(0, 3.6, 0.2, 7.0, near ? 8 : 5), 0.04, 0.05, D.door, { caps: 'f', sides: false });
      }));
    }
    // Treppentürme an den vier Schrägen: schlank, über dem Gesims frei, mit kleinen Hauben und Laternen
    for (let s = 0; s < 4; s++) {
      const a = Math.PI / 4 + (s * Math.PI) / 2;
      const tx = Math.sin(a) * 25.2;
      const tz = zc + Math.cos(a) * 25.2;
      F.cyl(tx, 0, tz, 4.0, 3.8, H0 + 9, s % 2 ? D.sand : mix(D.sand, D.mid, 0.35), { seg: near ? 12 : 8, top: false, g: [0.86, 1.02] });
      F.cyl(tx, H0 + 9, tz, 4.3, 4.3, 0.8, D.light, { seg: near ? 12 : 8 });
      F.cyl(tx, H0 + 9.8, tz, 2.8, 2.6, 8.5, D.sand, { seg: near ? 10 : 6, top: false });
      F.lathe(tx, H0 + 18.3, tz, [[3.2, 0], [3.0, 1.2], [2.0, 3.0], [0.8, 4.8], [0.35, 5.6]], D.sand, { seg: near ? 10 : 6 });
      F.cyl(tx, H0 + 23.9, tz, 0.45, 0.35, 2.4, D.light, { seg: 5 });
      F.ball(tx, H0 + 26.6, tz, 0.4, D.gold, { ws: 6, hs: 3 });
      if (near) for (let k = 0; k < 3; k++) {
        b.at(tx, 0, tz, a + (k - 1) * 0.6, () => b.at(0, 0, 3.95, 0, () => flatArch(b, 0, 6 + k * 8, 1.2, 2.8, null, D.pane)));
      }
    }
    // Tambour und Glocke (unten stark gekehlt, oben gewölbt), alles aus Sandstein; dunkle Flecken am Fuß
    const ds = near ? 24 : 12;
    const y1 = H0 + 0.6;
    F.cyl(0, y1, zc, 17.0, 17.0, 3.4, D.light, { seg: ds, top: false });
    F.cyl(0, y1 + 3.4, zc, 13.6, 13.6, 7, D.sand, { seg: ds, top: false, g: [0.9, 1.02] });
    if (near) {
      for (let i = 0; i < 12; i++) {
        const a = ((2 * i + 0.5) / 24) * TAU;
        b.at(Math.sin(a) * 13.45, 0, zc + Math.cos(a) * 13.45, a, () => flatArch(b, 0, y1 + 4.2, 1.8, 4.2, D.light, D.pane, 0.2));
      }
    }
    const yb = y1 + 10.4;
    const bell = [[16.4, 0], [14.6, 1.0], [13.4, 2.6], [12.9, 5], [13.1, 8.5], [12.9, 12], [11.9, 16.5], [9.8, 20.6], [6.9, 24.2], [4.6, 26.4]];
    F.lathe(0, yb, zc, bell, [D.mid, D.sand, D.sand, D.sand, D.sand, D.sand, D.sand, D.sand, D.sand], { seg: ds, g: [0.86, 1.08] });
    // Laterne: Säulenkranz, kleine Haube, Spitze, goldene Kugel und Kreuz
    const ly = yb + 26.4;
    F.cyl(0, ly, zc, 4.9, 4.9, 0.6, D.light, { seg: near ? 12 : 8 });
    F.cyl(0, ly + 0.6, zc, 3.4, 3.4, 7.4, near ? D.pane : D.mid, { seg: near ? 12 : 8, top: false });
    if (near) for (let i = 0; i < 8; i++) {
      const a = ((i + 0.5) / 8) * TAU;
      F.cyl(Math.sin(a) * 3.9, ly + 0.6, zc + Math.cos(a) * 3.9, 0.4, 0.36, 7.4, D.light, { seg: 6, top: false });
    }
    F.cyl(0, ly + 8, zc, 4.7, 4.7, 0.8, D.light, { seg: near ? 12 : 8 });
    F.lathe(0, ly + 8.8, zc, [[4.0, 0], [3.6, 1.6], [2.4, 3.4], [1.0, 4.8], [0.6, 5.4], [0.5, 9.4], [0.25, 11.6]], D.sand, { seg: near ? 12 : 8 });
    F.ball(0, ly + 12.6, zc, 0.85, D.gold, { ws: 8, hs: 5 });
    F.box(0, ly + 13.2, zc, 0.24, 3.4, 0.24, D.gold);
    F.box(0, ly + 15.3, zc, 1.5, 0.24, 0.24, D.gold);
  });
  return { w: 36, d: 37, h: 68 };
});

// =============================================================================================================
// Nürnberg: Kaiserburg auf dem Sandsteinfelsen über der Altstadt (von Süden gesehen, Westen links)
// =============================================================================================================
const NBG = { sand: 0xc98f74, sandLight: 0xdcae92, rock: 0xb87d63, rockDark: 0x9a6650, roof: 0xb8553c, roofDark: 0x95432f, pane: 0x4c4f5a, plaster: 0xeee3cf, beam: 0x6b4433 };

/** Steildach-Haus auf der Burg: Kasten w × d um (x, z) ab y, Traufe eh, Satteldach rh längs x, Fenster nach vorn. */
function castleHouse(b, x, y, z, w, d, eh, rh, o = {}) {
  const { F, G } = b;
  const near = !b.lod;
  F.box(x, y, z, w, eh, d, o.wall ?? NBG.sand, { g: [0.84, 1.03] });
  b.gable(x, y + eh, z, w, d, rh, o.roof ?? NBG.roof, { axis: 'x', oe: 0.4, og: 0.3, ridge: near });
  for (const s of [-1, 1]) b.at(x + s * (w / 2), 0, z, (s * Math.PI) / 2, () => F.extrude([[-d / 2, y + eh], [d / 2, y + eh], [0, y + eh + rh]], -0.3, 0, o.wall ?? NBG.sand));
  b.at(x, 0, z + d / 2, 0, () => {
    const n = Math.max(1, Math.floor(w / (o.step ?? 4.5)));
    for (let r = 0; r < (o.rows ?? 2); r++) {
      for (let i = 0; i < n; i++) G.rect(-w / 2 + (w / n) * (i + 0.5), y + 2.4 + r * 4.2, 0.03, 1.3, 2.0, NBG.pane);
    }
    // Dachgauben in Reihe
    if (near && o.dormers) {
      for (let i = 0; i < o.dormers; i++) {
        const dx = -w / 2 + (w / o.dormers) * (i + 0.5);
        const dy = y + eh + rh * 0.28;
        const dz = -(d / 2) * 0.28 + 0.6;
        F.box(dx, dy, dz - 0.6, 1.8, 1.6, 2.2, o.roof ?? NBG.roof);
        G.rect(dx, dy + 0.3, dz + 0.52, 1.0, 1.0, NBG.pane);
      }
    }
  });
}

/** Zinnen auf einer Mauerkrone von (x0, z) bis (x1, z) in Höhe y. */
function merlons(b, x0, x1, y, z, t, col) {
  for (let x = x0 + 0.8; x < x1 - 0.4; x += 2.2) b.F.box(x, y, z, 1.1, 1.1, t, col);
}

landmark('kaiserburg', { places: ['Nürnberg'], slot: 'skyline', far: true, title: 'Kaiserburg' }, (b) => {
  const { F, G } = b;
  const near = !b.lod;
  const C = NBG;
  b.xf([0, 0, 0], [0, 0, 0], 0.72, () => {
    // Felsen: unregelmäßiger Sandsteinsockel, unten breiter, mit Absatz
    const base = [[-108, -4], [-60, -2], [-20, -8], [30, -4], [80, -6], [108, -14], [104, -58], [40, -64], [-40, -60], [-104, -52]];
    const mid = base.map(([x, z]) => [x * 0.96, -33 + (z + 33) * 0.86]);
    const topR = base.map(([x, z]) => [x * 0.93, -33 + (z + 33) * 0.74]);
    loft(F, [[base, 0], [mid, 9], [topR, 19]], [C.rockDark, C.rock], { g: [0.78, 1.04] });
    // Mauer an der Südkante mit Zinnen (nah)
    const wz = -33 + (-6 + 33) * 0.74;
    F.box(-10, 19, wz - 0.6, 180, 3.2, 1.2, C.sand, { g: [0.9, 1.02] });
    if (near) merlons(b, -100, 80, 22.2, wz - 0.6, 1.2, C.sand);
    // Westen: Palas mit hohem Dach, Heidenturm, Sinwellturm (rund, spitzer Helm)
    castleHouse(b, -80, 19, -30, 34, 14, 13, 13, { dormers: 5, rows: 2 });
    F.box(-56, 19, -26, 9, 22, 9, C.sand, { g: [0.86, 1.03] });
    b.hip(-56, 41, -26, 9, 9, 8, C.roof, { oe: 0.4 });
    b.at(-56, 0, -21.5, 0, () => { G.rect(0, 30, 0.03, 1.4, 2.6, C.pane); G.rect(0, 36, 0.03, 1.4, 2.4, C.pane); });
    F.cyl(-36, 19, -34, 7.2, 6.6, 26, C.sandLight, { seg: near ? 14 : 8, top: false, g: [0.86, 1.04] });
    F.cyl(-36, 45, -34, 7.4, 7.4, 1.0, C.sand, { seg: near ? 14 : 8 });
    F.lathe(-36, 46, -34, [[7.0, 0], [5.2, 6], [2.2, 13], [0.3, 18]], C.roof, { seg: near ? 14 : 8, g: [0.86, 1.06] });
    F.ball(-36, 64.4, -34, 0.6, CITY.gold, { ws: 6, hs: 3 });
    if (near) for (let i = 0; i < 4; i++) {
      const a = (i / 4) * TAU + 0.4;
      b.at(-36 + Math.sin(a) * 6.95, 0, -34 + Math.cos(a) * 6.95, a, () => G.rect(0, 38, 0.03, 1.0, 2.2, C.pane));
    }
    // Mitte: Burgamtmannshaus und kleinere Häuser
    castleHouse(b, -12, 19, -28, 20, 12, 10, 9, { dormers: 3, rows: 2 });
    castleHouse(b, 8, 19, -24, 12, 10, 8, 7, { rows: 1, wall: C.plaster });
    // Fünfeckturm (fünfeckig, flaches Zeltdach)
    const five = ngon(5, 6.2, Math.PI / 2, 0, 0, 24, -30);
    prism(F, five, 19, 44, C.sand, { g: [0.86, 1.03] });
    spire(F, grow(five, 0.5), 44, 50, C.roof, { ax: 24, az: -30 });
    // Osten: Kaiserstallung (lang, sehr steiles Dach mit zwei Gaubenreihen) und Luginsland
    castleHouse(b, 58, 19, -27, 46, 14, 12, 17, { dormers: 7, rows: 2, step: 4 });
    if (near) b.at(58, 0, -20, 0, () => {
      for (let i = 0; i < 6; i++) {
        const dx = -18 + i * 7.2;
        F.box(dx, 19 + 12 + 17 * 0.6, -3.6, 1.4, 1.3, 1.8, C.roof);
        G.rect(dx, 19 + 12 + 17 * 0.6 + 0.25, -2.68, 0.8, 0.8, C.pane);
      }
    });
    F.box(90, 19, -30, 10, 26, 10, C.sand, { g: [0.86, 1.03] });
    F.box(90, 45, -30, 11, 1, 11, C.sandLight);
    b.hip(90, 46, -30, 10, 10, 9, C.roof, { oe: 0.5 });
    for (const [sx, sz] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) {
      F.cyl(90 + sx * 5.2, 42, -30 + sz * 5.2, 1.1, 1.1, 4, C.sandLight, { seg: 6 });
      F.lathe(90 + sx * 5.2, 46, -30 + sz * 5.2, [[1.3, 0], [0.1, 3.5]], C.roof, { seg: 6 });
    }
    b.at(90, 0, -25, 0, () => { G.rect(0, 30, 0.03, 1.4, 2.4, C.pane); G.rect(0, 37, 0.03, 1.4, 2.4, C.pane); });
  });
  return { w: 155.5, d: 46, h: 46.6 };
});

// =============================================================================================================
// Bremen: Rathaus mit Renaissance-Schauseite, davor der Roland; die Stadtmusikanten nur angedeutet (Tierstapel)
// =============================================================================================================
const BRE = { stone: 0xd7cab2, light: 0xebe1cc, brick: 0x9c5a46, copper: 0x7da994, pane: 0x4d5a68, gold: 0xd9b257, roland: 0xcfc8b8, shield: 0x6c7480, bronze: 0x8a7350 };

/** Volutengiebel in der Wandebene: Breite w, Fuß y0, Höhe h, k Stufen mit Schnecken, Fenster darin. */
function voluteGable(b, w, y0, h, k, col) {
  const { F, G } = b;
  const pts = [[-w / 2, y0]];
  for (let i = 0; i < k; i++) {
    const t0 = i / k;
    const t1 = (i + 1) / k;
    const x0 = (w / 2) * (1 - t0 * 0.82);
    const x1 = (w / 2) * (1 - t1 * 0.82);
    pts.push([-x0, y0 + h * t0 + h / k * 0.55], [-x1, y0 + h * t1]);
  }
  pts.push([0, y0 + h + 1.2]);
  for (let i = pts.length - 2; i >= 1; i--) pts.push([-pts[i][0], pts[i][1]]);
  pts.push([w / 2, y0]);
  F.extrude(pts, -0.5, 0, col, { crease: 2 });
  for (let i = 0; i < k; i++) {
    const t = (i + 0.5) / k;
    const x = (w / 2) * (1 - t * 0.82);
    if (!b.lod) for (const s of [-1, 1]) F.ball(s * x * 0.98, y0 + h * ((i + 1) / k) - 0.3, 0.05, 0.42, col, { ws: 6, hs: 3 });
  }
  return pts;
}

/** Stehende Figur mit Schild und erhobenem Schwert (Roland), Höhe h, Fuß bei (x, y, z), Blick nach +z. */
function rolandFigure(b, x, y, z, h, col, shield) {
  const { F } = b;
  const k = h / 5.5;
  const seg = b.lod ? 5 : 8;
  b.xf([x, y, z], [0, 0, 0], k, () => {
    F.cyl(0, 0, 0, 0.75, 0.6, 2.5, col, { seg });
    F.lathe(0, 2.4, 0, [[0.62, 0], [0.8, 1.1], [0.72, 2.0], [0.35, 2.3]], col, { seg });
    F.ball(0, 4.95, 0.05, 0.42, col, { ws: seg, hs: 4 });
    F.box(-0.55, 2.0, 0.55, 1.1, 1.9, 0.2, shield);
    F.box(0.75, 1.0, 0.35, 0.1, 3.6, 0.1, 0x9aa1aa);
    F.box(0.75, 3.7, 0.35, 0.6, 0.12, 0.12, 0x9aa1aa);
  });
}

landmark('bremerRathaus', { places: ['Bremen'], slot: 'square', title: 'Rathaus und Roland' }, (b) => {
  const { F, G } = b;
  const near = !b.lod;
  const C = BRE;
  const zf = -12; // Schauseite des Rathauses; davor Roland und Tierstapel
  // Halle: Backstein, steiles Kupferdach längs x
  F.box(0, 0, zf - 8.5, 41.5, 15, 17, C.brick, { g: [0.84, 1.02] });
  b.gable(0, 15, zf - 8.5, 41.5, 17, 10, C.copper, { axis: 'x', oe: 0.3, og: 0.3, ridge: near });
  for (const s of [-1, 1]) b.at(s * 20.75, 0, zf - 8.5, (s * Math.PI) / 2, () => F.extrude([[-8.5, 15], [8.5, 15], [0, 25]], -0.3, 0, C.brick));
  // Renaissance-Schauseite: Laube mit elf Bögen, Balustrade mit Figuren, hohe Fenster, drei Giebel
  b.at(0, 0, zf, 0, () => {
    F.box(0, 0, 1.5, 41.5, 6.2, 3.0, C.stone, { g: [0.88, 1.02] });
    for (let i = 0; i < 11; i++) {
      const x = -18.9 + i * 3.78;
      G.extrude(arch(x, 2.6, 0, 5.0, near ? 8 : 5), 3.0, 3.02, 0x5b5248, { caps: 'f', sides: false });
    }
    F.box(0, 6.2, 1.6, 41.9, 0.6, 3.2, C.light);
    if (near) for (let i = 0; i <= 11; i++) {
      const x = -20.8 + i * 3.78;
      F.cyl(x, 6.8, 2.9, 0.22, 0.2, 1.0, C.light, { seg: 5 });
      F.ball(x, 8.1, 2.9, 0.26, C.light, { ws: 5, hs: 3 });
    }
    for (let i = 0; i < 10; i++) {
      const x = -17 + i * 3.78;
      if (Math.abs(x) < 5) continue;
      G.rect(x, 8.0, 0.03, 2.2, 5.6, C.pane);
      G.rect(x, 7.7, 0.02, 2.8, 6.3, C.light);
    }
    // Mittelrisalit mit großem Erkerfenster und hohem Volutengiebel
    F.box(0, 6.8, 0.4, 10, 8.2, 0.8, C.stone);
    G.rect(0, 7.6, 0.85, 7.6, 6.4, C.pane);
    if (near) for (const x of [-2.5, 0, 2.5]) G.rect(x, 7.6, 0.87, 0.18, 6.4, C.light);
    b.at(0, 0, 0.8, 0, () => voluteGable(b, 10, 15, 10, 4, C.stone));
    G.rect(0, 16.5, 0.84, 3.2, 3.6, C.pane);
    F.ball(0, 26.6, 0.3, 0.45, C.gold, { ws: 6, hs: 4 });
    for (const s of [-1, 1]) {
      b.at(s * 13.5, 0, 0.3, 0, () => {
        F.box(0, 15, -0.25, 7, 0.5, 0.5, C.light);
        voluteGable(b, 7, 15, 6.8, 3, C.stone);
        G.rect(0, 16.2, 0.04, 2.0, 2.6, C.pane);
      });
    }
  });
  // Roland auf dem Platz (links vorn): Stufen, Sockel, Figur, Baldachin
  const rx = -15;
  const rz = -5;
  F.lathe(rx, 0, rz, [[2.2, 0], [2.2, 0.3], [1.7, 0.3], [1.7, 0.6], [1.25, 0.6], [1.25, 1.6]], C.roland, { seg: 8, a0: Math.PI / 8, crease: 0.3 });
  F.box(rx, 1.6, rz - 0.9, 1.2, 9.2, 0.7, C.roland, { g: [0.9, 1.05] });
  rolandFigure(b, rx, 1.6, rz - 0.2, 5.5, C.roland, C.shield);
  F.box(rx, 7.4, rz - 0.4, 1.9, 0.3, 1.6, C.roland);
  F.lathe(rx, 7.7, rz - 0.4, [[1.1, 0], [0.7, 1.4], [0.15, 2.5]], C.copper, { seg: 4, a0: Math.PI / 4 });
  // Tierstapel (Andeutung, keine Nachbildung): Esel, Hund, Katze, Hahn übereinander, warme Bronze
  const mx = 17;
  const mz = -5;
  F.box(mx, 0, mz, 1.4, 0.5, 2.2, C.stone);
  b.at(mx, 0.5, mz, 0, () => {
    F.rbox(0, 0.9, 0, 0.8, 0.9, 1.8, 0.3, C.bronze, { seg: 2 });
    for (const [x, z] of [[-0.25, 0.65], [0.25, 0.65], [-0.25, -0.65], [0.25, -0.65]]) F.cyl(x, 0, z, 0.1, 0.09, 0.95, C.bronze, { seg: 5 });
    F.rod([0, 1.6, 0.8], [0, 2.3, 1.25], 0.2, C.bronze, { seg: 5 });
    F.rbox(0, 2.15, 1.3, 0.34, 0.4, 0.7, 0.14, C.bronze, { seg: 2 });
    for (const s of [-1, 1]) F.rod([s * 0.1, 2.5, 1.1], [s * 0.18, 3.0, 1.05], 0.05, C.bronze, { seg: 4 });
    F.rbox(0, 1.8, -0.1, 0.55, 0.55, 1.0, 0.22, C.bronze, { seg: 2 });
    F.ball(0, 2.5, 0.45, 0.25, C.bronze, { ws: 6, hs: 4 });
    F.rbox(0, 2.35, -0.15, 0.4, 0.45, 0.6, 0.18, C.bronze, { seg: 2 });
    F.ball(0, 2.95, 0.05, 0.2, C.bronze, { ws: 6, hs: 4 });
    F.ball(0, 3.15, -0.15, 0.22, C.bronze, { ws: 6, hs: 4 });
    F.cyl(0, 3.3, 0.0, 0.03, 0.14, 0.32, 0xb0503a, { seg: 5 });
  });
  return { w: 42, d: 29, h: 26.6 };
});

// =============================================================================================================
// Dortmund: Dortmunder U (früheres Brauerei-Hochhaus mit dem goldenen U auf dem Dach)
// =============================================================================================================
const DOU = { wall: 0xd8d2c4, shade: 0xbcb4a3, strip: 0xe9e4d8, pane: 0x4c5868, gold: 0xf0c247, frame: 0x6d7076 };

/** Ein U als flaches Profil in der Ebene z = 0, Breite w, Höhe h, Stärke t (Blick nach +z). */
function letterU(b, w, h, t, col) {
  const n = b.lod ? 4 : 8;
  const r = w / 2;
  const ri = r - t;
  const out = [[-r, h], [-r + t, h]];
  for (let i = 0; i <= n; i++) {
    const a = Math.PI + (i / n) * Math.PI;
    out.push([Math.cos(a) * ri, r + Math.sin(a) * ri]);
  }
  out.push([r - t, h], [r, h]);
  for (let i = n; i >= 0; i--) {
    const a = Math.PI + (i / n) * Math.PI;
    out.push([Math.cos(a) * r, r + Math.sin(a) * r]);
  }
  b.G.extrude(out, -0.35, 0.35, col, { crease: 2 });
}

landmark('dortmunderU', { places: ['Dortmund'], slot: 'skyline', far: true, title: 'Dortmunder U' }, (b) => {
  const { F, G } = b;
  const near = !b.lod;
  const C = DOU;
  // Unterbau, Turm mit Lisenen und schmalen Fenstern, das U-Gerüst mit vier goldenen Us
  F.box(0, 0, -20, 62, 24, 36, C.wall, { g: [0.84, 1.02] });
  F.box(0, 23.4, -20, 62.8, 1.0, 36.8, C.strip);
  const tz = -20;
  F.box(0, 24, tz, 24, 38, 24, C.wall, { g: [0.88, 1.04] });
  F.box(0, 61.4, tz, 24.8, 1.0, 24.8, C.strip);
  b.at(0, 0, tz + 12, 0, () => b.sides(24, 24, (w) => {
    for (let i = 0; i < 5; i++) {
      const x = -w / 2 + 2.4 + i * ((w - 4.8) / 4);
      F.box(x, 24, 0.15, 0.9, 37.4, 0.3, C.strip, { skip: 'b' });
      if (i < 4) G.rect(x + (w - 4.8) / 8, 26, 0.32, 1.6, 33, C.pane);
    }
  }, 'frkl'));
  b.at(0, 0, -2, 0, () => {
    for (let i = 0; i < 12; i++) for (const y of [3, 9.5, 16]) G.rect(-27.5 + i * 5, y, 0.03, 2.4, 4.2, C.pane);
  });
  // Gerüst auf dem Dach
  const fy = 62.4;
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) F.box(sx * 8.5, fy, tz + sz * 8.5, 0.5, 9.5, 0.5, C.frame);
  for (const y of [fy + 0.2, fy + 9.2]) {
    F.box(0, y, tz + 8.5, 17.5, 0.35, 0.35, C.frame);
    F.box(0, y, tz - 8.5, 17.5, 0.35, 0.35, C.frame);
    F.box(8.5, y, tz, 0.35, 0.35, 17.5, C.frame);
    F.box(-8.5, y, tz, 0.35, 0.35, 17.5, C.frame);
  }
  for (let s = 0; s < 4; s++) b.at(0, fy + 0.6, tz, (s * Math.PI) / 2, () => b.at(0, 0, 8.9, 0, () => letterU(b, 7.4, 8.6, 1.8, C.gold)));
  return { w: 62, d: 38, h: 71.6 };
});

// =============================================================================================================
// Erfurt: Domberg – Dom St. Marien und Severikirche nebeneinander über den breiten Domstufen
// =============================================================================================================
const ERF = { stone: 0xcdbfa4, light: 0xdfd3bb, dark: 0xa89a80, slate: 0x5c6068, pane: 0x4b5664, step: 0xd6cbb6, grass: 0x88b062 };

/** Gotischer Spitzhelm über quadratischem Turm (Mitte x, z, Seite s) ab y, Helmhöhe h, mit vier Ecktürmchen. */
function gothicSpire(b, x, z, s, y, h, col, o = {}) {
  const { F } = b;
  const oct = ngon(8, s * 0.62, Math.PI / 8, 0, 0, x, z);
  spire(F, oct, y, y + h, col, { ax: x, az: z, g: [0.9, 1.08] });
  if (!b.lod && o.pinnacles !== false) {
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const px = x + sx * s * 0.42;
      const pz = z + sz * s * 0.42;
      spire(F, chamfer(1.2, 1.2, 0, px, pz), y - 0.2, y + h * 0.22, col, { ax: px, az: pz });
    }
  }
  F.ball(x, y + h + 0.3, z, 0.35, CITY.gold, { ws: 6, hs: 3 });
}

landmark('erfurterDomberg', { places: ['Erfurt'], slot: 'skyline', title: 'Dom und Severi' }, (b) => {
  const { F, G } = b;
  const near = !b.lod;
  const C = ERF;
  b.xf([0, 0, 0], [0, 0, 0], 0.8, () => {
    // Berg: Plateau 16 m hoch, Böschungen grün, breite Treppe in der Mitte
    loft(F, [[chamfer(132, 96, 10, 0, -50), 0], [chamfer(116, 78, 8, 0, -54), 16]], [C.grass], { g: [0.82, 1.02], capCol: C.step });
    const stairs = near ? 16 : 6;
    for (let i = 0; i < stairs; i++) {
      const y = ((i + 1) * 16) / stairs;
      const z = -2 - (i * 13) / stairs;
      F.box(0, 0, z - 0.6, 46 - i * 0.6, y, 13 / stairs + 0.6, C.step, { g: [0.86, 1.02] });
    }
    // Dom (links): hoher Chor mit Spitzbogenfenstern, Langhaus, Mittelturm mit Spitzhelm zwischen zwei Seitentürmen
    const dx = -26;
    F.box(dx, 16, -46, 26, 22, 30, C.stone, { g: [0.84, 1.02] });
    b.gable(dx, 38, -46, 26, 30, 10, C.slate, { axis: 'z', oe: 0.3, og: 0.2, ridge: near });
    F.box(dx, 16, -24, 18, 26, 16, C.stone, { g: [0.84, 1.02] });
    b.gable(dx, 42, -24, 18, 16, 8, C.slate, { axis: 'z', oe: 0.3, og: 0.3, ridge: near });
    b.at(dx, 0, -16, 0, () => {
      F.extrude([[-9, 42], [9, 42], [0, 50]], -0.4, 0, C.stone);
      for (const x of [-5.6, 0, 5.6]) G.extrude(arch(x, 2.6, 22, 15, near ? 8 : 5, true), 0.02, 0.03, C.pane, { caps: 'f', sides: false });
    });
    for (const s of [-1, 1]) {
      b.at(dx + s * 13, 0, -46, (s * Math.PI) / 2, () => {
        for (const z of [-10, -3.5, 3, 9.5]) G.extrude(arch(s * z, 2.4, 22, 12, near ? 8 : 5, true), 0.02, 0.03, C.pane, { caps: 'f', sides: false });
      });
    }
    const tz = -62;
    F.box(dx, 16, tz, 10, 40, 10, C.light, { g: [0.86, 1.04] });
    gothicSpire(b, dx, tz, 10, 56, 26, C.slate);
    for (const s of [-1, 1]) {
      F.box(dx + s * 10, 16, tz, 6.5, 32, 6.5, C.stone, { g: [0.86, 1.04] });
      gothicSpire(b, dx + s * 10, tz, 6.5, 48, 15, C.slate, { pinnacles: false });
    }
    // Severikirche (rechts): Hallenkirche mit drei Spitztürmen über dem Westbau
    const sx = 30;
    F.box(sx, 16, -48, 30, 18, 32, C.stone, { g: [0.84, 1.02] });
    b.hip(sx, 34, -48, 30, 32, 14, C.slate, { oe: 0.4 });
    b.at(sx, 0, -32, 0, () => {
      for (const x of [-9, -3, 3, 9]) G.extrude(arch(x, 2.8, 20, 11, near ? 8 : 5, true), 0.02, 0.03, C.pane, { caps: 'f', sides: false });
    });
    F.box(sx, 16, -68, 26, 26, 9, C.stone, { g: [0.86, 1.04] });
    for (const [x, h, s] of [[-8.5, 22, 5.6], [0, 30, 6.4], [8.5, 22, 5.6]]) {
      F.box(sx + x, 42, -68, s, 6, s, C.light);
      gothicSpire(b, sx + x, -68, s, 48, h, C.slate, { pinnacles: false });
    }
  });
  return { w: 105.6, d: 80, h: 65.6 };
});

// =============================================================================================================
// Würzburg: Festung Marienberg über dem Main, Weinberge am Hang
// =============================================================================================================
const WUE = { wall: 0xeee2c8, stone: 0xc9bb9e, roof: 0xb4553b, vine: 0x6f9a48, vine2: 0x8a7a4e, forest: 0x5a874c, copper: 0x7da48e, pane: 0x4f5866 };

landmark('festungMarienberg', { places: ['Würzburg'], slot: 'skyline', far: true, title: 'Festung Marienberg' }, (b) => {
  const { F, G } = b;
  const near = !b.lod;
  const C = WUE;
  b.xf([0, 0, 0], [0, 0, 0], 0.62, () => {
    // Berg mit Weinbergen (Streifen quer zum Hang), Wald an den Seiten und hinter der Festung, wo er wieder abfällt
    const top = 62;
    const ss = (a, b2, v) => {
      const t = Math.min(1, Math.max(0, (v - a) / (b2 - a)));
      return t * t * (3 - 2 * t);
    };
    const hf = (x, z) => 0.05 + top * ss(6, 126, -z) * (1 - ss(232, 290, -z)) * (1 - ss(95, 150, Math.abs(x)));
    const sw = near ? 6 : 12.6;
    const cf = (x, z) => (Math.abs(x) > 88 || -z > 126 ? C.forest : Math.floor(-z / sw) % 2 ? C.vine : C.vine2);
    const xs = gridLines(-150, 150, near ? 20 : 10, [-88, 88]);
    const zs = [...gridLines(0, -126, Math.round(126 / sw)), ...gridLines(-126, -290, near ? 12 : 6)].filter((v, i, a) => a.indexOf(v) === i);
    terrain(b, xs, zs, hf, cf, (x, z) => (Math.abs(x) > 88 || -z > 126 ? mottle(x, z) : 1));
    const y0 = top - 0.5;
    const zc = -175;
    // Äußerer Ring: Bastionen und Mauern
    loft(F, [[chamfer(132, 92, 14, 0, zc), y0 - 6], [chamfer(128, 88, 13, 0, zc), y0 + 6]], C.stone, { g: [0.8, 1.02] });
    // Innere Burg: vier Flügel um den Hof, helle Wände, rote Dächer
    const wing = (x, z, w, d, ax) => {
      F.box(x, y0 + 6, z, w, 14, d, C.wall, { g: [0.86, 1.03] });
      b.gable(x, y0 + 20, z, w, d, 7, C.roof, { axis: ax, oe: 0.3, og: 0.2, ridge: near });
    };
    wing(0, zc + 30, 90, 12, 'x');
    wing(0, zc - 30, 90, 12, 'x');
    wing(-39, zc, 12, 48, 'z');
    wing(39, zc, 12, 48, 'z');
    for (const s of [-1, 1]) b.at(s * 45, 0, zc + 30, (s * Math.PI) / 2, () => F.extrude([[-6, y0 + 20], [6, y0 + 20], [0, y0 + 27]], -0.3, 0, C.wall));
    b.at(0, 0, zc + 36, 0, () => {
      for (let i = 0; i < 16; i++) for (const y of [y0 + 9, y0 + 14.5]) G.rect(-40 + i * 5.33, y, 0.03, 1.5, 2.6, C.pane);
    });
    // Bergfried (rund, mit Haube) und die Marienkirche (Rundbau mit Kuppel) im Hof
    F.cyl(-12, y0 + 6, zc + 4, 6.5, 6.2, 34, C.wall, { seg: near ? 14 : 8, top: false, g: [0.86, 1.04] });
    F.cyl(-12, y0 + 40, zc + 4, 7.0, 7.0, 1.0, C.stone, { seg: near ? 14 : 8 });
    F.lathe(-12, y0 + 41, zc + 4, [[6.4, 0], [6.2, 2.2], [4.6, 4.6], [2.0, 6.6], [0.9, 7.4], [0.9, 9.4], [0.2, 11.4]], C.copper, { seg: near ? 14 : 8, g: [0.88, 1.08] });
    F.cyl(14, y0 + 6, zc - 2, 9, 9, 18, C.wall, { seg: near ? 16 : 10, top: false, g: [0.86, 1.04] });
    F.lathe(14, y0 + 24, zc - 2, [[9.4, 0], [8.6, 3], [6.4, 6], [3.2, 8.2], [1.4, 9]], C.copper, { seg: near ? 16 : 10, g: [0.88, 1.08] });
    F.cyl(14, y0 + 33, zc - 2, 1.4, 1.3, 3, C.wall, { seg: 6 });
    F.lathe(14, y0 + 36, zc - 2, [[1.7, 0], [0.2, 3.5]], C.copper, { seg: 6 });
  });
  return { w: 186, d: 180, h: 70 };
});

// =============================================================================================================
// Heidelberg: Schlossruine aus rotem Sandstein am Waldhang über der Altstadt
// =============================================================================================================
const HDB = { red: 0xb9644e, redDark: 0x94503f, redLight: 0xcd7c62, roof: 0x55545a, forest: 0x557f48, forest2: 0x648d50, lawn: 0x8ab565, hole: 0x5a3a33, pane: 0x4c5462 };

/** Turmruine: runder Turm ohne Dach (Mauerring mit Innenseite) von y bis y + h, Radius r, Wand t. */
function ruinTower(b, x, y, z, r, h, t, col, a0 = 0, a1 = TAU) {
  const { F } = b;
  const seg = b.lod ? 8 : 14;
  const part = a1 - a0 < TAU - 1e-6;
  F.lathe(x, y, z, [[r, 0], [r, h]], col, { seg, a0, a1, top: false, g: [0.84, 1.03] });
  F.lathe(x, y, z, [[r - t, h], [r - t, 0]], HDB.redDark, { seg, a0, a1, top: false });
  F.lathe(x, y + h, z, [[r, 0], [r - t, 0]], HDB.redLight, { seg, a0, a1, top: false });
  if (part) {
    for (const a of [a0, a1]) {
      const s = Math.sin(a);
      const c = Math.cos(a);
      F.quad([x + s * (r - t), y, z + c * (r - t)], [x + s * r, y, z + c * r], [x + s * r, y + h, z + c * r], [x + s * (r - t), y + h, z + c * (r - t)], HDB.redDark);
    }
  }
}

landmark('heidelbergerSchloss', { places: ['Heidelberg'], slot: 'skyline', far: true, title: 'Schloss' }, (b) => {
  const { F, G } = b;
  const near = !b.lod;
  const C = HDB;
  b.xf([0, 0, 0], [0, 0, 0], 0.62, () => {
    // Waldhang (Königstuhl): steigt zur Schlossterrasse (44 m), hinter dem Schloss weiter zum Kamm und fällt dahinter ab
    const ss = (a, b2, v) => {
      const t = Math.min(1, Math.max(0, (v - a) / (b2 - a)));
      return t * t * (3 - 2 * t);
    };
    const side = (x) => 1 - ss(110, 160, Math.abs(x));
    // eben auf 44 m zwischen 40 und 132 m Tiefe (die Terrasse), dahinter weiter hinauf zum Kamm bei 108 m
    const hf = (x, z) => 0.05 + (44 * ss(4, 40, -z) + 64 * ss(132, 230, -z)) * (1 - ss(262, 320, -z)) * side(x);
    const cf = (x, z, y) => (Math.abs(x) < 88 && -z > 38 && -z < 132 ? C.lawn : C.forest);
    const xs = gridLines(-160, 160, near ? 22 : 11, [-88, 88]);
    const zs = gridLines(0, -320, near ? 26 : 13, [-38, -132]);
    terrain(b, xs, zs, hf, cf, (x, z) => (Math.abs(x) < 88 && -z > 38 && -z < 132 ? 1 : mottle(x, z)));
    const y0 = 44;
    // Mauer der Terrasse
    F.box(0, y0 - 18, -44, 150, 18, 2.4, C.redDark, { g: [0.8, 1] });
    // Friedrichsbau: Schaufassade mit zwei Zwerchgiebeln und Dach
    F.box(-30, y0, -62, 34, 22, 16, C.red, { g: [0.84, 1.03] });
    b.gable(-30, y0 + 22, -62, 34, 16, 11, C.roof, { axis: 'x', oe: 0.3, og: 0.3, ridge: near });
    for (const s of [-1, 1]) b.at(-30 + s * 17, 0, -62, (s * Math.PI) / 2, () => F.extrude([[-8, y0 + 22], [8, y0 + 22], [0, y0 + 33]], -0.3, 0, C.red));
    b.at(-30, 0, -54, 0, () => {
      for (const x of [-8.5, 8.5]) b.at(x, 0, 0, 0, () => voluteGable(b, 9, y0 + 22, 9, 3, C.red));
      for (let i = 0; i < 6; i++) for (const y of [y0 + 3, y0 + 9.5, y0 + 16]) G.rect(-14 + i * 5.6, y, 0.03, 2.2, 4.2, C.pane);
    });
    // Ottheinrichsbau: Fassade ohne Dach, Fensterlöcher, dahinter Himmel
    b.at(6, 0, -60, 0, () => {
      const holes = [];
      for (let i = 0; i < 5; i++) for (const y of [y0 + 4, y0 + 11, y0 + 18]) holes.push(arch(-11 + i * 5.5, 2.4, y, 4.6, near ? 6 : 4));
      F.extrude([[-14, y0], [14, y0], [14, y0 + 25], [-14, y0 + 25]], -1.4, 0, C.redLight, { holes, g: [0.86, 1.04] });
    });
    for (const s of [-1, 1]) F.box(6 + s * 13.3, y0, -68, 1.4, 21, 15, C.red, { g: [0.84, 1.02] });
    // Glockenturm: unten viereckig, oben achteckig mit dunklem Helm
    F.box(-56, y0, -66, 11, 30, 11, C.red, { g: [0.84, 1.03] });
    prism(F, ngon(8, 5.4, Math.PI / 8, 0, 0, -56, -66), y0 + 30, y0 + 40, C.redLight);
    F.lathe(-56, y0 + 40, -66, [[5.6, 0], [4.0, 3], [1.4, 6], [1.0, 8], [0.2, 11]], C.roof, { seg: 8, a0: Math.PI / 8 });
    // Gesprengter Turm: halber Rundturm, das abgesprengte Stück liegt im Graben
    ruinTower(b, 48, y0 - 16, -60, 10, 34, 3.2, C.red, -0.4 * Math.PI, 0.9 * Math.PI);
    b.xf([56, y0 - 18, -46], [0.5, 0.3, 0.9], 1, () => F.box(0, 0, 0, 9, 7, 5, C.redDark, { g: [0.8, 1] }));
    // Dicker Turm (ohne Dach) und Englischer Bau als Ruine
    ruinTower(b, -74, y0 - 4, -52, 9, 26, 3.4, C.red);
    b.at(28, 0, -66, 0, () => {
      const holes = [];
      for (let i = 0; i < 3; i++) for (const y of [y0 + 3, y0 + 10]) holes.push(arch(-6 + i * 6, 2.6, y, 4.8, near ? 6 : 4));
      F.extrude([[-9, y0], [9, y0], [9, y0 + 17], [-9, y0 + 17]], -1.2, 0, C.red, { holes, g: [0.86, 1.04] });
    });
  });
  return { w: 198, d: 198, h: 66 };
});

// =============================================================================================================
// Mainz: Dom St. Martin – roter Sandstein, sechs Türme, der große Westturm mit gestufter Barockhaube
// =============================================================================================================
const MZ = { red: 0xb7644f, redLight: 0xc97a62, redDark: 0x985140, roof: 0x5e7569, roofDark: 0x4f6359, pane: 0x4d5462, gold: 0xe0b552 };

/** Romanischer Rundturm (Treppenturm) mit Kegeldach: Mitte (x, z), Radius r, Schaft bis y1, Kegel ch hoch. */
function stairTower(b, x, z, r, y1, ch, col, roof) {
  const { F } = b;
  const seg = b.lod ? 8 : 12;
  F.cyl(x, 0, z, r, r * 0.96, y1, col, { seg, top: false, g: [0.86, 1.03] });
  F.cyl(x, y1, z, r + 0.35, r + 0.35, 0.6, MZ.redLight, { seg });
  F.lathe(x, y1 + 0.6, z, [[r + 0.25, 0], [0.12, ch]], roof, { seg });
}

landmark('mainzerDom', { places: ['Mainz'], slot: 'skyline', title: 'Dom St. Martin' }, (b) => {
  const { F, G } = b;
  const near = !b.lod;
  const C = MZ;
  b.xf([0, 0, 0], [0, 0, 0], 0.8, () => {
    const zc = -25.5;
    // Langhaus längs x: Seitenschiffe, Obergaden mit Satteldach, Rundbogenfenster
    F.box(0, 0, zc, 62, 16, 40, C.red, { g: [0.84, 1.02] });
    F.box(0, 15.4, zc, 62.6, 0.8, 40.6, C.redLight);
    b.gable(0, 16, zc, 62, 40, 4, C.roof, { axis: 'x', oe: 0.3, og: 0, ridge: false });
    F.box(0, 16, zc, 62, 14, 16, C.red, { g: [0.88, 1.03] });
    b.gable(0, 30, zc, 62, 16, 9, C.roof, { axis: 'x', oe: 0.3, og: 0, ridge: near });
    b.at(0, 0, zc + 20, 0, () => {
      for (let i = 0; i < 9; i++) flatArch(b, -28 + i * 7, 5, 2.2, 6, C.redLight, C.pane, 0.25);
    });
    b.at(0, 0, zc + 8, 0, () => {
      for (let i = 0; i < 9; i++) flatArch(b, -28 + i * 7, 20, 2.0, 5.5, C.redLight, C.pane, 0.25);
    });
    // Westen (links): Querhaus, Kleeblattchor, großer Vierungsturm mit gestufter Haube
    const wx = -40;
    F.box(wx, 0, zc, 16, 30, 50, C.red, { g: [0.84, 1.03] });
    b.gable(wx, 30, zc, 16, 50, 8, C.roof, { axis: 'z', oe: 0.3, og: 0.3, ridge: near });
    for (const s of [-1, 1]) b.at(wx, 0, zc + s * 25, s > 0 ? 0 : Math.PI, () => {
      F.extrude([[-8, 30], [8, 30], [0, 38]], -0.3, 0, C.red);
      flatArch(b, 0, 12, 4, 11, C.redLight, C.pane, 0.35);
    });
    prism(F, halfDisc(9, near ? 8 : 5, wx - 8, zc, 1).map(([x, z]) => [wx - 8 - (z - zc), x - (wx - 8) + zc]), 0, 26, C.red, { g: [0.84, 1.02] });
    F.box(wx, 30, zc, 17, 16, 17, C.red, { g: [0.88, 1.04] });
    F.box(wx, 45.6, zc, 18, 0.9, 18, C.redLight);
    prism(F, ngon(8, 9.4, Math.PI / 8, 0, 0, wx, zc), 46.5, 56, C.redLight, { g: [0.9, 1.04] });
    if (near) b.at(wx, 0, zc + 8.5, 0, () => b.sides(17, 17, () => { for (const x of [-4.5, 0, 4.5]) flatArch(b, x, 36, 2.2, 6.5, C.redLight, C.pane, 0.2); }));
    F.lathe(wx, 56, zc, [[9.6, 0], [8.4, 2.4], [6.8, 3.4], [6.2, 5.4], [5.0, 7.2], [3.8, 7.6], [3.4, 9.6], [2.2, 11.4], [1.4, 12.2], [1.2, 15], [0.5, 20], [0.15, 24]], [C.roof, C.roof, C.roof, C.roofDark, C.roof, C.roof, C.roof, C.roof, C.roof, C.roof, C.roof], { seg: 8, a0: Math.PI / 8, crease: 0.4, g: [0.88, 1.08] });
    F.ball(wx, 80.4, zc, 0.6, C.gold, { ws: 6, hs: 4 });
    // Osten (rechts): Apsis, achteckiger Vierungsturm mit Spitzhelm
    const ex = 36;
    F.box(ex, 0, zc, 12, 30, 34, C.red, { g: [0.84, 1.03] });
    b.gable(ex, 30, zc, 12, 34, 7, C.roof, { axis: 'z', oe: 0.3, og: 0.3, ridge: near });
    prism(F, ngon(8, 8.2, Math.PI / 8, 0, 0, ex, zc), 30, 46, C.red, { g: [0.88, 1.04] });
    if (near) for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU;
      b.at(ex + Math.sin(a) * 7.55, 0, zc + Math.cos(a) * 7.55, a, () => flatArch(b, 0, 38, 1.6, 4.4, C.redLight, C.pane, 0.2));
    }
    spire(F, ngon(8, 8.6, Math.PI / 8, 0, 0, ex, zc), 46, 62, C.roof, { ax: ex, az: zc, g: [0.88, 1.08] });
    F.ball(ex, 62.4, zc, 0.5, C.gold, { ws: 6, hs: 3 });
    prism(F, halfDisc(8, near ? 8 : 5, ex + 6, zc, 1).map(([x, z]) => [ex + 6 + (z - zc), -(x - (ex + 6)) + zc]), 0, 24, C.red, { g: [0.84, 1.02] });
    // Vier Treppentürme an den Enden
    for (const s of [-1, 1]) {
      stairTower(b, wx + 9, zc + s * 18, 3.2, 40, 9, C.redLight, C.roof);
      stairTower(b, ex + 6.5, zc + s * 14, 3.0, 36, 8, C.redLight, C.roof);
    }
  });
  return { w: 92, d: 42, h: 65 };
});

// =============================================================================================================
// Wiesbaden: Kurhaus – Säulenportikus mit Giebel, flache Kuppel, Flügel mit Bogenfenstern
// =============================================================================================================
const WI = { stone: 0xeee5d2, shade: 0xd9cdb5, column: 0xf6f1e6, copper: 0x7aa892, pane: 0x4d5868, door: 0x5a4a3c, gold: 0xdcb354 };

landmark('kurhaus', { places: ['Wiesbaden'], slot: 'square', title: 'Kurhaus' }, (b) => {
  const { F, G } = b;
  const near = !b.lod;
  const C = WI;
  b.xf([0, 0, 0], [0, 0, 0], 0.62, () => {
    const zf = -10;
    // Freitreppe, Portikus mit sechs Säulen und Giebel
    for (let i = 0; i < 5; i++) F.box(0, 0, zf + 8 - i * 1.0, 34 - i * 0.6, 0.35 * (i + 1), 1.1, C.shade, { skip: 'b' });
    F.box(0, 1.75, zf + 3.5, 32, 0.6, 8, C.shade);
    for (let i = 0; i < 6; i++) {
      const x = -13.5 + i * 5.4;
      F.cyl(x, 2.35, zf + 6.4, 1.15, 1.0, 15.2, C.column, { seg: near ? 12 : 6, top: false, g: [0.9, 1.04] });
      F.box(x, 17.4, zf + 6.4, 2.8, 0.9, 2.8, C.column);
    }
    F.box(0, 18.3, zf + 3.6, 33, 2.4, 7.8, C.stone);
    F.extrude([[-16.5, 20.7], [16.5, 20.7], [0, 27.4]], zf - 0.4, zf + 7.5, C.stone, { crease: 2 });
    if (near) G.rect(0, 19.1, zf + 7.52, 22, 1.0, C.shade);
    // Haupthaus hinter dem Portikus, Kuppel mit Laterne
    F.box(0, 0, zf - 16, 44, 24, 32, C.stone, { g: [0.86, 1.02] });
    F.box(0, 23.4, zf - 16, 44.8, 1.0, 32.8, C.shade);
    b.at(0, 0, zf, 0, () => {
      G.extrude(arch(0, 5.4, 2.35, 9.5, near ? 8 : 5), 0.02, 0.03, C.door, { caps: 'f', sides: false });
      for (const x of [-10.8, 10.8]) G.extrude(arch(x, 4, 2.35, 8, near ? 8 : 5), 0.02, 0.03, C.pane, { caps: 'f', sides: false });
    });
    F.cyl(0, 24.4, zf - 18, 11, 11, 4, C.stone, { seg: near ? 20 : 10, top: false });
    F.lathe(0, 28.4, zf - 18, [[11.6, 0], [11.0, 2.2], [9.2, 4.6], [6.2, 6.8], [3.0, 8.0], [2.0, 8.3]], C.copper, { seg: near ? 20 : 10, g: [0.88, 1.08] });
    F.cyl(0, 36.7, zf - 18, 1.8, 1.7, 2.4, C.column, { seg: 8 });
    F.lathe(0, 39.1, zf - 18, [[2.2, 0], [1.4, 1.2], [0.2, 2.6]], C.copper, { seg: 8 });
    F.ball(0, 41.9, zf - 18, 0.4, C.gold, { ws: 6, hs: 3 });
    // Flügel mit Bogenfenstern und Balustrade, Eckpavillons
    for (const s of [-1, 1]) {
      F.box(s * 37, 0, zf - 12, 30, 16, 24, C.stone, { g: [0.86, 1.02] });
      F.box(s * 37, 15.5, zf - 12, 30.6, 0.9, 24.6, C.shade);
      if (near) for (let x = -13; x <= 13; x += 2.2) F.cyl(s * 37 + x, 16.4, zf + 0.1, 0.25, 0.22, 1.1, C.column, { seg: 5 });
      F.box(s * 37, 17.5, zf + 0.1, 30, 0.3, 0.5, C.column);
      F.box(s * 55, 0, zf - 13, 10, 19, 26, C.stone, { g: [0.86, 1.02] });
      b.hip(s * 55, 19, zf - 13, 10, 26, 4, C.copper, { oe: 0.4 });
      b.at(s * 37, 0, zf, 0, () => {
        for (let i = 0; i < 5; i++) {
          const x = -12 + i * 6;
          G.extrude(arch(x, 3.4, 1.4, 7.6, near ? 8 : 5), 0.02, 0.03, C.pane, { caps: 'f', sides: false });
          G.rect(x, 10.4, 0.03, 2.6, 3.6, C.pane);
        }
      });
      b.at(s * 55, 0, zf, 0, () => { G.rect(0, 2, 0.03, 3, 6, C.pane); G.rect(0, 10.6, 0.03, 3, 5, C.pane); });
    }
  });
  return { w: 74.4, d: 26, h: 26 };
});

// =============================================================================================================
// Konstanz: Hafen am Bodensee – Konzilgebäude, Mole mit Leuchtturm und, angedeutet, die drehende Figur
// =============================================================================================================
const KN = { quay: 0xcbbfa9, quayDark: 0xa99c86, wall: 0xe4d7bd, roof: 0x9d4c3a, pane: 0x4b5664, water: 0x7cbfd8, robe: 0xece4d6, robe2: 0x8fb3c9, boat: 0xf4f1ea, sail: 0xf7f4ec, wood: 0x8a6448 };

/** Stehende Figur im langen Gewand mit Krone, die Arme leicht geöffnet (Andeutung, keine Nachbildung), Höhe h. */
function robedFigure(b, h) {
  const { F } = b;
  const k = h / 9;
  const seg = b.lod ? 6 : 10;
  b.xf([0, 0, 0], [0, 0, 0], k, () => {
    F.lathe(0, 0, 0, [[2.0, 0], [1.9, 1.2], [1.5, 3.4], [1.05, 5.4], [0.85, 6.3], [1.0, 6.9], [0.8, 7.3], [0.3, 7.5]], [KN.robe2, KN.robe, KN.robe, KN.robe, KN.robe, KN.robe, KN.robe], { seg, g: [0.9, 1.06] });
    F.ball(0, 8.0, 0.05, 0.55, KN.robe, { ws: seg, hs: 5 });
    F.lathe(0, 8.35, 0, [[0.5, 0], [0.62, 0.45], [0.5, 0.5]], CITY.gold, { seg: 8, top: false });
    for (const s of [-1, 1]) F.rod([s * 0.85, 6.9, 0], [s * 2.0, 6.0, 0.4], 0.2, KN.robe, { seg: 5 });
  });
}

landmark('konstanzHafen', {
  places: ['Konstanz'], slot: 'skyline', title: 'Hafen',
  spins: [{ at: [26, 3.4, -50], axis: 'y', speed: TAU / 240, make: (b) => robedFigure(b, 13) }],
}, (b) => {
  const { F, G, W } = b;
  const near = !b.lod;
  const C = KN;
  // Uferkai vorn, See dahinter, rechts die Mole mit Leuchtturm und Figur, links das Konzilgebäude
  F.box(0, 0, -3, 120, 0.9, 6, C.quay, { g: [0.9, 1.02] });
  W.poolRect(10, 0.2, -36, 100, 60, C.water, { rings: 0.06 });
  F.box(10, -1, -36, 100.4, 1.0, 60.4, 0x6f9fb8);
  F.box(-55, 0, -30, 30, 0.9, 48, C.quay, { g: [0.9, 1.02] });
  // Konzilgebäude: Steinsockel, riesiges Walmdach mit kleinen Gauben
  F.box(-52, 0.9, -26, 22, 11, 36, C.wall, { g: [0.86, 1.03] });
  b.hip(-52, 11.9, -26, 22, 36, 13, C.roof, { oe: 0.5 });
  b.at(-41, 0, -26, Math.PI / 2, () => {
    for (let i = 0; i < 6; i++) for (const y of [3, 7]) G.rect(-14 + i * 5.6, y, 0.03, 1.4, 2.2, C.pane);
  });
  b.at(-52, 0, -8, 0, () => {
    for (let i = 0; i < 4; i++) for (const y of [3, 7]) G.rect(-7.5 + i * 5, y, 0.03, 1.4, 2.2, C.pane);
    G.extrude(arch(0, 2.6, 0.9, 3.6, near ? 8 : 5), 0.02, 0.03, 0x5a4a3c, { caps: 'f', sides: false });
  });
  if (near) for (let i = 0; i < 3; i++) {
    F.box(-52 + (i - 1) * 7, 17, -14.6, 1.6, 1.6, 2.4, C.roof);
    G.rect(-52 + (i - 1) * 7, 17.3, -13.38, 0.9, 0.9, C.pane);
  }
  // Mole: vom rechten Ufer hinaus und nach links gebogen, am Kopf die Figur, daneben der kleine Leuchtturm
  F.box(44, 0, -24, 8, 2.2, 42, C.quay, { g: [0.88, 1.02] });
  F.box(33, 0, -48, 30, 2.2, 8, C.quay, { g: [0.88, 1.02] });
  F.cyl(26, 0, -50, 4.2, 4.2, 3.4, C.quayDark, { seg: near ? 16 : 10 });
  F.cyl(40, 2.2, -50, 1.6, 1.4, 11, 0xf3efe6, { seg: 10, top: false });
  F.cyl(40, 13.2, -50, 2.0, 2.0, 0.5, 0x5f7d6a, { seg: 10 });
  G.lathe(40, 13.7, -50, [[1.1, 0], [1.1, 1.6]], 0xfff1b8, { seg: 8, top: false, k: 1.1 });
  F.lathe(40, 15.3, -50, [[1.5, 0], [0.2, 1.8]], 0x5f7d6a, { seg: 8 });
  // Boote: ein weißes Fahrgastschiff am Kai, zwei Segelboote
  b.at(4, 0.2, -12, 0, () => {
    F.lathe(0, 0, 0, [[1.6, -0.6], [3.4, 0.6], [3.6, 2.2]], C.boat, { seg: 12, sx: 7, sz: 1, bottom: true });
    F.box(-2, 2.2, 0, 26, 2.6, 5.4, C.boat);
    F.box(-3, 4.8, 0, 16, 2.2, 4.6, C.boat);
    if (near) b.at(0, 0, 2.72, 0, () => { G.rect(-2, 2.9, 0.03, 23, 1.0, C.pane); G.rect(-3, 5.4, -0.38, 14, 0.9, C.pane); });
    F.cyl(3, 7, 0, 0.7, 0.6, 2.2, 0xd8b04e, { seg: 8 });
  });
  for (const [x, z, r] of [[-12, -40, 0.3], [16, -58, -0.5]]) {
    b.at(x, 0.2, z, r, () => {
      F.lathe(0, 0, 0, [[0.6, -0.3], [1.3, 0.5]], C.boat, { seg: 10, sx: 3.2, sz: 1, bottom: true });
      F.cyl(0, 0.5, 0, 0.08, 0.06, 9, C.wood, { seg: 5 });
      G.tri([0.1, 1.4, 0], [0.1, 9.2, 0], [3.6, 1.4, 0], C.sail);
      G.tri([0.1, 1.4, 0], [3.6, 1.4, 0], [0.1, 9.2, 0], C.sail);
    });
  }
  return { w: 140, d: 66.2, h: 28 };
});

// =============================================================================================================
// Kiel: Fähre am Terminal – eine große weiße Skandinavienfähre an der Förde (ohne Reederei-Farben)
// =============================================================================================================
const KI = { hull: 0xf4f2ec, band: 0x2f4f7a, deck: 0xeceae3, win: 0x3f4e60, funnel: 0xf2f0ea, funnelBand: 0x7fb6d8, boat: 0xf08a3c, quay: 0xc6bba7, water: 0x6fb2cf, glass: 0x8fb5cc, steel: 0x9aa1a8 };

landmark('kielFaehre', { places: ['Kiel'], slot: 'skyline', far: true, title: 'Fähre' }, (b) => {
  const { F, G, W } = b;
  const near = !b.lod;
  const C = KI;
  b.xf([0, 0, 0], [0, 0, 0], 0.68, () => {
    // Kai vorn mit Terminal, Förde dahinter
    F.box(0, 0, -6, 200, 1.2, 12, C.quay, { g: [0.9, 1.02] });
    W.poolRect(0, 0.1, -55, 200, 86, C.water, { rings: 0.05 });
    F.box(0, -1.2, -55, 200.4, 1.2, 86.4, 0x5f97b1);
    F.box(-78, 1.2, -6, 34, 9, 10, C.glass, { g: [0.86, 1.05] });
    F.box(-78, 10.2, -6, 35, 0.8, 11, 0xe9e6de);
    if (near) b.at(-78, 0, -1, 0, () => { for (let i = 0; i < 8; i++) G.rect(-15 + i * 4.3, 1.4, 0.03, 0.15, 8.6, 0xe9e6de); });
    F.box(-62, 8, -15, 3, 3, 16, C.glass);
    // Schiff: Rumpf mit Bug und Heck, Band an der Wasserlinie, Decks, zwei Schornsteine, Rettungsboote
    const L = 170;
    const zs = -30;
    const n = near ? 10 : 6;
    const plan = [];
    for (let i = 0; i <= n; i++) {
      const a = -Math.PI / 2 + (i / n) * Math.PI;
      plan.push([L / 2 - 24 + Math.cos(a) * 24, Math.sin(a) * 13 + zs]);
    }
    plan.push([-L / 2 + 2, zs + 13], [-L / 2, zs + 11], [-L / 2, zs - 11], [-L / 2 + 2, zs - 13]);
    loft(F, [[scaleP(plan.map(([x, z]) => [x, z - zs]), 0.93, 0.8).map(([x, z]) => [x, z + zs]), -2], [plan, 4], [plan, 15]], [C.band, C.hull], { g: [0.86, 1.04], smooth: 0.5 });
    F.box(-6, 15, zs, L - 40, 6, 24, C.deck, { g: [0.92, 1.03] });
    F.box(-12, 21, zs, L - 60, 6, 22, C.deck, { g: [0.92, 1.03] });
    F.box(-18, 27, zs, L - 84, 5, 20, C.deck);
    F.box(48, 27, zs, 14, 6, 21, C.deck);
    b.at(0, 0, zs + 13.02, 0, () => {
      for (const [y, w] of [[8, L - 34], [16.8, L - 44], [22.8, L - 64], [28.6, L - 88]]) G.rect(-8, y, 0.03, w, 1.6, C.win);
      if (near) for (let i = 0; i < 9; i++) F.box(-60 + i * 12, 19.2, -0.2, 7, 1.6, 1.6, C.boat);
    });
    G.rect(48, 30, zs + 10.52, 14, 1.8, C.win);
    for (const x of [-30, -12]) {
      F.rbox(x, 32, zs, 7, 9, 5, 1.6, C.funnel, { seg: 3 });
      F.box(x, 37.5, zs, 7.1, 1.6, 5.1, C.funnelBand);
    }
    F.cyl(36, 33, zs, 0.25, 0.18, 9, C.steel, { seg: 5 });
  });
  return { w: 136, d: 66.6, h: 28 };
});

// =============================================================================================================
// Sylt: rot-weißer Leuchtturm auf der Düne, Strandkörbe (nach research/landmarks/stil-backstein), die Nordsee dahinter
// =============================================================================================================
const SY = { sand: 0xe8d9b5, dune: 0xdcc89d, duneGrass: 0xc4c48c, grass: 0x9fb26a, red: 0xc9473a, white: 0xf4f1ea, black: 0x3c3f45, lantern: 0xfff0b0, sea: 0x6fb6d0, wood: 0xb08a5c, woodDark: 0x8b6b4e };
const WICKER = [0xd2b27a, 0xede3cf, 0xf2d98e, 0xb9c9d2, 0xb9cba3, 0xe5b4a6];
const LINING = [0x5e8fb0, 0xc8694a, 0x6e9a4c];

/** Strandkorb (Ostseeform) nach Spec: Ursprung Mitte des Sockels, offene Seite nach +z. */
function strandkorb(b, x, z, ry, wick, lining) {
  const { F, G } = b;
  const near = !b.lod;
  b.at(x, 0, z, ry, () => {
    F.box(0, 0, -0.03, 1.2, 0.42, 1.05, SY.wood, { g: [0.86, 1] });
    if (near) for (const s of [-1, 1]) F.box(s * 0.27, 0.3, 0.72, 0.5, 0.14, 0.45, SY.woodDark);
    // Haube: Rücken, nach vorn gerundetes Dach, als Profil quer über die Breite
    const prof = [[-0.55, 0.42], [-0.45, 0.9], [-0.32, 1.3], [-0.08, 1.55], [0.25, 1.62], [0.52, 1.56], [0.52, 1.46], [0.24, 1.5], [-0.04, 1.44], [-0.24, 1.22], [-0.35, 0.86], [-0.43, 0.42]];
    b.at(0, 0, 0, Math.PI / 2, () => F.extrude(prof.map(([zz, y]) => [-zz, y]), -0.6, 0.6, wick, { crease: 0.6 }));
    // Wangen
    for (const s of [-1, 1]) {
      b.at(s * 0.54, 0, 0, Math.PI / 2, () => F.extrude([[0.55, 0.42], [-0.5, 0.42], [-0.5, 1.0], [-0.1, 1.3], [0.25, 1.45], [0.5, 1.45]].map(([zz, y]) => [-zz, y]), -0.06, 0.06, wick));
    }
    if (near) {
      G.rect(0, 0.5, -0.36, 1.0, 0.9, lining);
      F.box(0, 0.42, 0.05, 1.0, 0.12, 0.7, SY.white);
    }
  });
}

landmark('syltLeuchtturm', { places: ['Sylt'], slot: 'skyline', title: 'Leuchtturm' }, (b) => {
  const { F, G, W } = b;
  const near = !b.lod;
  const C = SY;
  // Düne: sanfter Hügel aus Sand mit Strandhafer, dahinter der Strand und die See
  const ss = (a, b2, v) => {
    const t = Math.min(1, Math.max(0, (v - a) / (b2 - a)));
    return t * t * (3 - 2 * t);
  };
  const hf = (x, z) => 0.05 + (9 + 1.5 * Math.sin(x * 0.2)) * ss(0, 16, -z) * (1 - ss(30, 46, -z)) * (1 - ss(26, 44, Math.abs(x - 6)));
  const cf = (x, z, y) => (y > 6.4 ? C.grass : y > 3.6 ? C.duneGrass : C.dune);
  terrain(b, gridLines(-50, 50, near ? 20 : 10), gridLines(0, -56, near ? 14 : 7), hf, cf, mottle);
  // Strandhafer: kleine Büschel auf der Düne
  if (near) for (let i = 0; i < 26; i++) {
    const x = -40 + ((i * 37) % 80) + Math.sin(i * 1.7) * 2;
    const z = -6 - ((i * 23) % 34);
    const y = hf(x, z);
    if (y < 2.4 || Math.hypot(x - 8, z + 22) < 6 || Math.hypot(x + 6, z + 18) < 6) continue;
    F.cyl(x, y - 0.1, z, 0.55, 0.05, 1.0, i % 3 ? C.grass : C.duneGrass, { seg: 5 });
  }
  F.box(0, 0, -64, 100, 0.12, 16, C.sand, { skip: 'b' });
  W.poolRect(0, 0.08, -90, 120, 36, C.sea, { rings: 0.05 });
  // Leuchtturm: rot-weiße Ringe, Galerie, Laterne, dunkle Haube
  const lx = 8;
  const lz = -22;
  const ly = hf(lx, lz) - 0.3;
  const bands = 6;
  for (let i = 0; i < bands; i++) {
    const y0 = ly + (i * 26) / bands;
    const r0 = 3.4 - (i * 1.1) / bands;
    F.lathe(lx, y0, lz, [[r0, 0], [r0 - 1.1 / bands, 26 / bands]], i % 2 ? C.white : C.red, { seg: near ? 14 : 8, top: false, g: [0.92, 1.04] });
  }
  F.cyl(lx, ly + 26, lz, 3.4, 3.4, 0.5, C.black, { seg: near ? 14 : 8 });
  if (near) F.torus(lx, ly + 27.4, lz, 3.25, 0.06, C.black, { seg: 14, tube: 3 });
  G.lathe(lx, ly + 26.5, lz, [[1.8, 0], [1.8, 2.8]], C.lantern, { seg: near ? 12 : 8, top: false, k: 1.15 });
  F.lathe(lx, ly + 29.3, lz, [[2.2, 0], [1.8, 1.0], [0.6, 2.4], [0.3, 3.2]], C.black, { seg: near ? 12 : 8 });
  F.ball(lx, ly + 32.7, lz, 0.4, C.black, { ws: 6, hs: 3 });
  b.at(lx, 0, lz + 3.2, 0, () => { G.rect(0, ly + 0.3, 0.03, 1.2, 2.2, 0x5a3a2a); G.rect(0, ly + 9, 0.03, 0.7, 1.0, 0x5e7a8c); });
  // Wärterhäuschen
  const hx = -6;
  const hz = -18;
  const hy = hf(hx, hz) - 0.4;
  F.box(hx, hy, hz, 7, 3.2, 6, C.white, { g: [0.9, 1.02] });
  b.gable(hx, hy + 3.2, hz, 7, 6, 3.2, C.red, { axis: 'x', oe: 0.3, og: 0.3, ridge: near });
  for (const s of [-1, 1]) b.at(hx + s * 3.5, 0, hz, (s * Math.PI) / 2, () => F.extrude([[-3, hy + 3.2], [3, hy + 3.2], [0, hy + 6.4]], -0.2, 0, C.white));
  // Strandkörbe in einer Reihe am Strand, Blick zur See
  for (let i = 0; i < (near ? 9 : 6); i++) {
    const x = -34 + i * (near ? 4.2 : 6.3);
    strandkorb(b, x, -62, Math.PI + (i % 3 - 1) * 0.05, WICKER[i % WICKER.length], LINING[i % LINING.length]);
  }
  return { w: 120, d: 108, h: 43.4 };
});

// =============================================================================================================
// Wacken: freundliche große Festivalbühne auf dem Acker (Traversen, Boxentürme, Licht), kein Totenkopf, kein Logo
// =============================================================================================================
const WA = { truss: 0x4a4d55, stage: 0x2f3138, black: 0x26282e, field: 0x93ad62, mud: 0x8d7a5a, tent: 0xf3efe6, barrier: 0xb9bec4, screen: 0x34405a, warm: 0xffc46b, heart: 0xe86a5a };

landmark('wackenBuehne', { places: ['Wacken'], slot: 'skyline', far: true, title: 'Festivalbühne' }, (b) => {
  const { F, G, L } = b;
  const near = !b.lod;
  const C = WA;
  // Acker mit Wegen, Bühne mit Dach aus Traversen, Boxentürme, Leinwand mit großem Herz, Zelte, Absperrung
  F.box(0, 0, -36, 110, 0.08, 72, C.field, { skip: 'b' });
  F.box(0, 0.08, -24, 70, 0.06, 18, C.mud);
  const zs = -50;
  F.box(0, 0, zs, 44, 2.2, 18, C.stage);
  F.box(0, 2.2, zs - 7, 44, 18, 4, C.black, { g: [0.9, 1.05] });
  b.at(0, 0, zs - 4.95, 0, () => {
    G.rect(0, 6, 0.03, 20, 11, C.screen);
    // großes Herz auf der Leinwand
    const hp = [];
    for (let i = 0; i <= 16; i++) {
      const t = (i / 16) * TAU;
      hp.push([Math.pow(Math.sin(t), 3) * 4.2, 11.6 + (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 0.27]);
    }
    G.extrude(hp, 0.04, 0.05, C.heart, { caps: 'f', sides: false });
  });
  // Dachtraversen: vier Stützen, Rahmen oben, Querträger
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) F.box(sx * 21, 0, zs + sz * 8.5, 1.2, 24, 1.2, C.truss);
  }
  F.box(0, 24, zs + 8.5, 43.4, 1.2, 1.2, C.truss);
  F.box(0, 24, zs - 8.5, 43.4, 1.2, 1.2, C.truss);
  for (const sx of [-1, 1]) F.box(sx * 21, 24, zs, 1.2, 1.2, 18.2, C.truss);
  F.box(0, 25.2, zs, 44, 1.6, 18.4, C.black);
  if (near) for (let i = -3; i <= 3; i++) F.box(i * 6, 23, zs + 8.5, 0.3, 1.0, 0.3, C.truss);
  // Scheinwerfer (leuchten warm) an der vorderen Traverse
  for (let i = -4; i <= 4; i++) L.ball(i * 4.8, 23.4, zs + 8.2, 0.55, i % 2 ? C.warm : 0xff8fa8, { ws: 6, hs: 4 });
  // Boxentürme neben der Bühne und gehängte Lautsprecher
  for (const s of [-1, 1]) {
    F.box(s * 27, 0, zs + 4, 6, 14, 6, C.black, { g: [0.9, 1.05] });
    F.box(s * 23.5, 12, zs + 8, 2.4, 9, 2.4, C.black);
    if (near) b.at(s * 27, 0, zs + 7.02, 0, () => { for (let k = 0; k < 3; k++) G.disc(0, 3 + k * 4, 0.03, 1.4, 0x4b4f58, { seg: 12 }); });
  }
  // Absperrung vor der Bühne, Zelte am Rand
  F.box(0, 0, zs + 14, 46, 1.2, 0.4, C.barrier);
  for (const [x, z] of [[-44, -18], [-44, -36], [44, -22]]) {
    F.box(x, 0, z, 10, 2.6, 8, C.tent);
    b.gable(x, 2.6, z, 10, 8, 2.4, C.tent, { axis: 'x', oe: 0.2, og: 0.2, ridge: false });
  }
  return { w: 110, d: 72, h: 26.8 };
});

// =============================================================================================================
// Helgoland: Lange Anna – roter Felsturm vor dem Klippenrand, Brandung, die Nordsee ringsum
// =============================================================================================================
const HE = { rock: 0xb4583f, rock2: 0xc86a4c, rockDark: 0x8f4433, grass: 0x8fb46a, sea: 0x5fa8c8, foam: 0xf3f6f7, bird: 0xf6f4ee };

landmark('langeAnna', { places: ['Helgoland'], slot: 'skyline', far: true, title: 'Lange Anna' }, (b) => {
  const { F, G, W } = b;
  const near = !b.lod;
  const C = HE;
  W.poolRect(0, 0.1, -50, 130, 100, C.sea, { rings: 0.05 });
  F.box(0, -1.2, -50, 130.4, 1.2, 100.4, 0x4f8fae);
  // Klippe rechts: Schichten nach oben schmaler, grüne Hochfläche
  const cliff = [[2, -30], [60, -26], [64, -96], [10, -98], [-6, -72], [-4, -44]];
  // jede Kante bekommt zwei Zwischenpunkte, quer versetzt; jede Schicht anders (Abbrüche, Rinnen)
  const jag = (pts, amp, seed) => pts.flatMap((p, i) => {
    const q = pts[(i + 1) % pts.length];
    const l = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1;
    const nx = (q[1] - p[1]) / l;
    const nz = -(q[0] - p[0]) / l;
    const out = [p];
    for (const t of [0.34, 0.68]) {
      const o = amp * Math.sin(seed + i * 2.7 + t * 9.1);
      out.push([p[0] + (q[0] - p[0]) * t + nx * o, p[1] + (q[1] - p[1]) * t + nz * o]);
    }
    return out;
  });
  const lay = (k) => jag(cliff.map(([x, z]) => [x + (x < 20 ? k * 0.6 : -k * 0.2), z]), 2.2, k * 0.8);
  loft(F, [[lay(0), 0], [lay(2), 12], [lay(3), 24], [lay(5), 38], [lay(6), 46]], [C.rockDark, C.rock, C.rock2, C.rock], { g: [0.8, 1.04], capCol: C.grass });
  if (near) for (const y of [12, 24, 38]) loft(F, [[grow(lay(y / 8), 0.3), y - 0.4], [grow(lay(y / 8), 0.3), y]], C.rock2, { top: false });
  // Lange Anna: freistehender Felsturm, unten breiter, oben gekappt, mit grüner Kappe
  const sx = -26;
  const sz = -46;
  const stack = (k, rx, rz) => ngon(9, 1, 0.4, 0, 0, 0, 0).map(([x, z], i) => [sx + x * rx * k * (1 + 0.1 * Math.sin(i * 2.3 + rx)), sz + z * rz * k * (1 + 0.1 * Math.cos(i * 1.9 + rz))]);
  loft(F, [[stack(1, 9, 7), 0], [stack(1, 8, 6.4), 14], [stack(1, 7, 5.6), 30], [stack(1, 6.2, 4.6), 42], [stack(1, 5.4, 4.0), 47]], [C.rockDark, C.rock, C.rock2, C.rock], { g: [0.8, 1.06], capCol: C.grass });
  // Brandung um den Fuß von Turm und Klippe
  W.pool(sx, 0.18, sz, 11, C.foam, { r0: 8.5, rings: 0.4, seg: near ? 20 : 10 });
  if (near) for (let i = 0; i < 14; i++) {
    const a = i * 2.4;
    G.disc(sx + Math.cos(a) * (6 + (i % 3)), 20 + (i * 7) % 24, sz + 5.6 + 0.2 * (i % 2), 0.35, C.bird, { seg: 6 });
  }
  return { w: 130, d: 100, h: 47 };
});

// =============================================================================================================
// Alpen: Gipfel mit Gipfelkreuz (Fels, Schnee, Almwiese; schlichtes Holzkreuz)
// =============================================================================================================
const ALP = { rock: 0x9a958d, rock2: 0xb1aba2, rockDark: 0x7b766f, snow: 0xf4f6f8, meadow: 0x8db86a, forest: 0x557e4c, cross: 0x7a5a3e };

landmark('alpenGipfel', { places: [], slot: 'skyline', far: true, title: 'Gipfelkreuz' }, (b) => {
  const { F } = b;
  const near = !b.lod;
  const C = ALP;
  // Berg als Gelände: Almwiese unten, Wald, Fels, Schnee; ein schiefer Hauptgipfel und ein Nebengipfel
  const peak = (x, z, px, pz, h, r) => h * Math.exp(-((((x - px) / r) ** 2 + ((z - pz) / (r * 0.9)) ** 2) ** 0.75));
  // vorn und hinten auf die Grundhöhe auslaufen lassen (sonst stünde am Rand eine offene, 33 m hohe Schnittkante)
  const smooth = (a, c, v) => {
    const t = Math.min(1, Math.max(0, (v - a) / (c - a)));
    return t * t * (3 - 2 * t);
  };
  const edge = (z) => smooth(0, 110, -z) * smooth(0, 110, 340 + z);
  const hf = (x, z) => 0.05 + Math.max(peak(x, z, 10, -170, 240, 120), peak(x, z, -110, -150, 150, 90), 0) * (1 - Math.min(1, Math.max(0, (Math.abs(x) - 190) / 30))) * edge(z);
  const cf = (x, z, y) => (y > 190 ? C.snow : y > 120 ? (Math.sin(x * 0.05 + z * 0.03) > -0.3 ? C.rock : C.rock2) : y > 55 ? C.forest : C.meadow);
  terrain(b, gridLines(-220, 220, near ? 28 : 14), gridLines(0, -340, near ? 24 : 12, [-170]), hf, cf, mottle);
  // Gipfelkreuz: schlichtes Holzkreuz auf dem Hauptgipfel
  const gy = hf(10, -170);
  F.box(10, gy - 0.5, -170, 0.7, 9, 0.7, C.cross);
  F.box(10, gy + 5.6, -170, 4.6, 0.6, 0.6, C.cross);
  return { w: 440, d: 340, h: 250 };
});

// =============================================================================================================
// Sammelsätze: Kirmes (Riesenrad, Karussell, Achterbahn), Zeche, Flughafen, Burg auf dem Berg
// =============================================================================================================
const FAIR = { steel: 0xe9e4da, steelDark: 0x9aa1a8, red: 0xe5483a, yellow: 0xf2c94a, blue: 0x5a9bd8, mint: 0x7cc9b4, pink: 0xf29ab4, wood: 0xb98a5a, ground: 0xd9c9a6, lamp: 0xfff1b8 };
const GONDOLA = [FAIR.red, FAIR.yellow, FAIR.blue, FAIR.mint, FAIR.pink, 0xf08a2c];

/** Riesenrad (dreht sich um z): zwei Kränze, Speichen, n Gondeln als Trommeln längs der Achse (sehen in jeder Lage gleich aus). */
function wheelRotor(b, R, n, o = {}) {
  const { F, L } = b;
  const near = !b.lod;
  const col = o.col ?? FAIR.steel;
  const hw = o.hw ?? 1.3;
  for (const z of [-hw, hw]) {
    b.xf([0, 0, z], [Math.PI / 2, 0, 0], 1, () => F.torus(0, 0, 0, R, near ? 0.32 : 0.45, col, { seg: near ? 32 : 18, tube: near ? 4 : 3 }));
    const sp = near ? n : n / 2;
    for (let i = 0; i < sp; i++) {
      const a = (i / sp) * TAU;
      F.rod([0, 0, z], [Math.cos(a) * R, Math.sin(a) * R, z], near ? 0.1 : 0.16, col, { seg: 4 });
    }
  }
  b.xf([0, 0, -hw - 0.4], [Math.PI / 2, 0, 0], 1, () => F.cyl(0, 0, 0, 1.0, 1.0, 2 * hw + 0.8, FAIR.steelDark, { seg: 10 }));
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU + Math.PI / n;
    const x = Math.cos(a) * (R + 1.1);
    const y = Math.sin(a) * (R + 1.1);
    b.xf([x, y, -hw + 0.1], [Math.PI / 2, 0, 0], 1, () => F.cyl(0, 0, 0, 1.25, 1.25, 2 * hw - 0.2, GONDOLA[i % GONDOLA.length], { seg: near ? 12 : 8 }));
    if (near) b.G.disc(x, y, hw - 0.08, 0.75, 0x6f8fa8, { seg: 10 });
    if (L && i % 2 === 0) L.ball(Math.cos(a) * R, Math.sin(a) * R, hw + 0.4, near ? 0.28 : 0.4, FAIR.lamp, { ws: 6, hs: 4 });
  }
}

/** Gestell des Riesenrads: zwei A-Böcke bis zur Nabe in Höhe hy, Kasse unten. */
function wheelStand(b, x, z, hy, hw, col) {
  const { F } = b;
  for (const s of [-1, 1]) {
    for (const k of [-1, 1]) F.rod([x + k * hy * 0.42, 0, z + s * (hw + 1.4)], [x, hy, z + s * (hw + 0.4)], 0.45, col, { seg: 6 });
    F.rod([x - hy * 0.3, hy * 0.28, z + s * (hw + 1.2)], [x + hy * 0.3, hy * 0.28, z + s * (hw + 1.2)], 0.25, col, { seg: 4 });
  }
}

landmark('kirmes', {
  places: ['Herne'], slot: 'skyline', far: true, title: 'Rummel',
  spins: [
    { at: [-30, 24.5, -40], axis: 'z', speed: TAU / 70, make: (b) => wheelRotor(b, 20, 16) },
    { at: [16, 0, -22], axis: 'y', speed: TAU / 14, make: (b) => carousel(b) },
  ],
}, (b) => {
  const { F, G, L } = b;
  const near = !b.lod;
  // Platz aus festem Sand, Riesenrad-Gestell, Achterbahn hinten rechts, Buden vorn
  F.box(0, 0, -36, 120, 0.1, 72, FAIR.ground, { skip: 'b' });
  wheelStand(b, -30, -40, 24.5, 1.3, FAIR.steel);
  F.box(-30, 0, -32, 6, 2.6, 3, FAIR.red);
  b.gable(-30, 2.6, -32, 6, 3, 1.2, FAIR.yellow, { axis: 'x', oe: 0.3, og: 0.3, ridge: false });
  // Achterbahn: ein Rundkurs mit zwei Hügeln, Schienen als Rohre, Stützen
  const path = [];
  const N = near ? 40 : 20;
  for (let i = 0; i < N; i++) {
    const t = (i / N) * TAU;
    const x = 34 + Math.cos(t) * 20;
    const z = -48 + Math.sin(t) * 12;
    const y = 3 + 13 * Math.max(0, Math.sin(t * 2 + 0.6)) ** 1.5 + 5 * Math.max(0, -Math.cos(t));
    path.push([x, y, z]);
  }
  for (let i = 0; i < N; i++) {
    const p = path[i];
    const q = path[(i + 1) % N];
    for (const s of [-0.6, 0.6]) {
      const dx = q[0] - p[0];
      const dz = q[2] - p[2];
      const l = Math.hypot(dx, dz) || 1;
      const ox = (-dz / l) * s;
      const oz = (dx / l) * s;
      F.rod([p[0] + ox, p[1], p[2] + oz], [q[0] + ox, q[1], q[2] + oz], 0.16, FAIR.red, { seg: 4 });
    }
    if (i % (near ? 3 : 4) === 0) F.rod([p[0], 0, p[2]], [p[0], p[1] - 0.2, p[2]], 0.18, FAIR.steelDark, { seg: 4 });
  }
  // Wagenzug auf dem höchsten Punkt
  const top = path.reduce((a, q) => (q[1] > a[1] ? q : a), path[0]);
  for (let k = 0; k < 3; k++) F.rbox(top[0] - 1.2 + k * 1.3, top[1] + 0.2, top[2], 1.2, 0.9, 1.6, 0.3, GONDOLA[k], {});
  // Buden mit gestreiften Dächern, Lichterketten
  for (let i = 0; i < 5; i++) {
    const x = -46 + i * 12.5;
    const z = -8 - (i % 2) * 3;
    F.box(x, 0, z, 8, 2.6, 4, i % 2 ? 0xf4efe4 : 0xfff3d6);
    const n = near ? 8 : 4;
    for (let k = 0; k < n; k++) {
      b.at(x - 4 + (k + 0.5) * (8 / n), 0, z, 0, () => b.gable(0, 2.6, 0, 8 / n, 4.6, 1.2, k % 2 ? 0xffffff : GONDOLA[i % GONDOLA.length], { axis: 'z', oe: 0, og: 0.3, ridge: false, t: 0.1 }));
    }
    G.rect(x, 0.9, z + 2.02, 7, 1.0, 0x5e4a3c);
    if (L && near) for (let k = 0; k < 6; k++) L.ball(x - 3.5 + k * 1.4, 2.5, z + 2.3, 0.14, FAIR.lamp, { ws: 5, hs: 3 });
  }
  return { w: 120, d: 72, h: 46 };
});

/** Karussell (dreht um y): Plattform, Mittelsäule, gestreiftes Zeltdach, Pferdchen an Stangen. */
function carousel(b) {
  const { F, L } = b;
  const near = !b.lod;
  const R = 8;
  F.cyl(0, 0, 0, R, R, 0.6, 0xf4efe4, { seg: near ? 24 : 12 });
  F.cyl(0, 0.6, 0, 1.4, 1.4, 5.2, FAIR.yellow, { seg: 10, top: false });
  const n = near ? 12 : 8;
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * TAU;
    const a1 = ((i + 1) / n) * TAU;
    F.lathe(0, 5.6, 0, [[R + 0.6, 0], [R * 0.5, 2.0], [0.4, 3.4]], i % 2 ? 0xffffff : FAIR.red, { seg: 3, a0, a1, top: false });
    F.lathe(0, 5.0, 0, [[R + 0.6, 0], [R + 0.6, 0.6]], i % 2 ? FAIR.red : 0xffffff, { seg: 3, a0, a1, top: false });
  }
  F.ball(0, 9.0, 0, 0.5, FAIR.yellow, { ws: 6, hs: 4 });
  const m = near ? 10 : 6;
  for (let i = 0; i < m; i++) {
    const a = (i / m) * TAU;
    const x = Math.cos(a) * (R - 1.6);
    const z = Math.sin(a) * (R - 1.6);
    F.cyl(x, 0.6, z, 0.07, 0.07, 4.4, 0xe0b552, { seg: 4, top: false });
    const y = 1.6 + (i % 2) * 0.5;
    b.at(x, y, z, -a, () => {
      F.ball(0, 0, 0, 0.5, GONDOLA[i % GONDOLA.length], { ws: 6, hs: 4, sx: 0.6, sz: 1.5 });
      F.ball(0, 0.45, 0.65, 0.28, GONDOLA[i % GONDOLA.length], { ws: 6, hs: 3 });
    });
    if (L && i % 2 === 0) L.ball(Math.cos(a) * (R + 0.6), 5.2, Math.sin(a) * (R + 0.6), 0.2, FAIR.lamp, { ws: 5, hs: 3 });
  }
}

// --- Zeche: Doppelbock-Förderturm (rot), Maschinenhalle aus Backstein mit Stahlfachwerk, Schornstein, Kühlturm
const ZE = { red: 0xa8432f, redDark: 0x86372a, brick: 0xa5553f, frame: 0x5e3a30, glass: 0x6f8496, concrete: 0xcfc9bc, chimney: 0x9e5a44, ground: 0xb7b1a5, wheel: 0x5a5f66 };

/** Seilscheibe (dreht um x) mit Kranz, Speichen, Nabe. */
function sheave(b, r) {
  const { F } = b;
  const near = !b.lod;
  b.xf([0, 0, 0], [0, 0, Math.PI / 2], 1, () => F.torus(0, 0, 0, r, 0.22, ZE.wheel, { seg: near ? 20 : 12, tube: 3 }));
  for (let i = 0; i < (near ? 6 : 3); i++) {
    const a = (i / (near ? 6 : 3)) * Math.PI;
    F.rod([0, Math.cos(a) * r, Math.sin(a) * r], [0, -Math.cos(a) * r, -Math.sin(a) * r], 0.08, ZE.wheel, { seg: 3 });
  }
}

landmark('zeche', {
  places: ['Essen', 'Gelsenkirchen', 'Bottrop', 'Bochum', 'Herne', 'Duisburg', 'Recklinghausen', 'Gladbeck', 'Oberhausen'], slot: 'skyline', far: true, title: 'Zeche',
  spins: [
    { at: [-4, 52, -26], axis: 'x', speed: 0.5, make: (b) => sheave(b, 3.4) },
    { at: [4, 52, -26], axis: 'x', speed: -0.5, make: (b) => sheave(b, 3.4) },
  ],
}, (b) => {
  const { F, G } = b;
  const near = !b.lod;
  const C = ZE;
  F.box(0, 0, -38, 150, 0.1, 76, C.ground, { skip: 'b' });
  // Förderturm: vier Stiele, Riegel, Kopf mit den Scheiben, schräger Bock nach hinten
  const tz = -26;
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) F.box(sx * 6, 0, tz + sz * 4, 1.2, 50, 1.2, C.red, { g: [0.86, 1.04] });
  for (let y = 8; y < 50; y += 8) {
    for (const sz of [-1, 1]) F.box(0, y, tz + sz * 4, 13.2, 0.7, 0.7, C.redDark);
    for (const sx of [-1, 1]) F.box(sx * 6, y, tz, 0.7, 0.7, 8.6, C.redDark);
  }
  F.box(0, 49, tz, 14, 2.4, 10, C.red, { g: [0.9, 1.05] });
  for (const sx of [-1, 1]) F.rod([sx * 6, 0, tz - 34], [sx * 5, 50, tz - 3], 0.9, C.red, { seg: 4 });
  F.rod([-6, 0, tz - 34], [6, 0, tz - 34], 0.5, C.redDark, { seg: 4 });
  for (const y of [14, 30]) {
    const k = 1 - y / 50;
    F.rod([-6 + (1 - k) * 1, y, tz - 3 - 31 * k], [6 - (1 - k) * 1, y, tz - 3 - 31 * k], 0.35, C.redDark, { seg: 4 });
  }
  // Maschinenhalle vorn: Backstein in Stahlrahmen (Kubus mit Raster), Fensterbänder
  const hall = (x, z, w, h, d) => {
    F.box(x, 0, z, w, h, d, C.brick, { g: [0.84, 1.02] });
    F.box(x, h, z, w + 0.4, 0.6, d + 0.4, C.frame);
    b.at(x, 0, z + d / 2, 0, () => {
      const n = Math.round(w / 4);
      for (let i = 0; i <= n; i++) G.rect(-w / 2 + (i * w) / n, 0, 0.02, 0.35, h, C.frame);
      for (const y of [h * 0.33, h * 0.66]) G.rect(0, y, 0.02, w, 0.3, C.frame);
      for (let i = 0; i < n; i++) G.rect(-w / 2 + ((i + 0.5) * w) / n, h * 0.4, 0.03, w / n - 1.4, h * 0.22, C.glass);
    });
  };
  hall(-30, -18, 34, 14, 16);
  hall(30, -14, 26, 10, 12);
  hall(0, -6, 18, 7, 6);
  // Schornstein und Kühlturm
  F.cyl(50, 0, -44, 3.2, 2.2, 58, C.chimney, { seg: near ? 12 : 8, g: [0.86, 1.05] });
  if (near) for (const y of [20, 40, 56]) F.cyl(50, y, -44, 3.2 - (y / 58) * 1.0 + 0.15, 3.2 - (y / 58) * 1.0 + 0.15, 0.6, C.redDark, { seg: 12 });
  F.lathe(-46, 0, -50, [[15, 0], [12.5, 12], [10.8, 26], [11.4, 34], [12.2, 38]], C.concrete, { seg: near ? 24 : 12, top: false, g: [0.84, 1.05] });
  F.lathe(-46, 0.5, -50, [[11.6, 37.4], [10.6, 26.5], [11.9, 12.4], [14.4, 0.5]].map(([r, y]) => [r, y]), mix(C.concrete, 0x000000, 0.25), { seg: near ? 24 : 12, top: false });
  return { w: 150, d: 76, h: 58 };
});

// --- Flughafen: Terminal mit Glasfront und geschwungenem Dach, Tower, ein knuffiges Frachtflugzeug auf dem Vorfeld
const AIR = { glass: 0x8fb5cc, glassDark: 0x5f7f99, roof: 0xe9e6de, concrete: 0xd4d0c6, apron: 0xb9b6ae, mark: 0xf2d24a, white: 0xf6f4ee, tail: 0x5a9bd8, belly: 0xc9ced3, prop: 0x4a4f57 };

/** Knuffiges Frachtflugzeug: dicker Rumpf (Nase nach +x), Schulterdecker, zwei Propellertriebwerke, hohes Leitwerk. */
function cargoPlane(b, x, z, ry) {
  const { F, G } = b;
  const near = !b.lod;
  b.at(x, 0, z, ry, () => {
    b.xf([0, 3.4, 0], [0, 0, -Math.PI / 2], 1, () => F.lathe(0, -15, 0, [[0.6, 0], [2.6, 2.2], [3.0, 6], [3.0, 20], [2.4, 25], [1.0, 29], [0.3, 30]], [AIR.white, AIR.white, AIR.white, AIR.white, AIR.white, AIR.white], { seg: near ? 14 : 8, bottom: true, g: [0.92, 1.04] }));
    F.box(4, 5.6, 0, 6, 0.5, 34, AIR.white, { g: [0.9, 1.03] });
    for (const s of [-1, 1]) {
      b.xf([5.2, 5.0, s * 7.5], [0, 0, -Math.PI / 2], 1, () => F.lathe(0, -2.5, 0, [[0.4, 0], [1.1, 0.8], [1.1, 4.2], [0.6, 5.2]], AIR.belly, { seg: near ? 10 : 6, bottom: true }));
      if (near) {
        F.box(8.0, 4.0, s * 7.5, 0.12, 2.6, 0.35, AIR.prop);
        F.box(8.0, 5.0, s * 7.5, 0.12, 0.35, 2.6, AIR.prop);
      }
      F.box(1, 0, s * 2.2, 0.5, 1.5, 0.5, AIR.prop);
      F.cyl(1, 0.6, s * 2.2, 0.6, 0.6, 0.5, 0x3a3f47, { seg: 8 });
    }
    F.box(-13, 4.5, 0, 4, 7.5, 0.5, AIR.tail, { g: [0.9, 1.05] });
    F.box(-13.4, 11.4, 0, 3.6, 0.4, 10, AIR.white);
    F.box(-13, 3.6, 0, 2, 1.2, 0.5, AIR.white);
    b.at(13.2, 0, 0, Math.PI / 2, () => G.rect(0, 4.1, 0.02, 1.7, 0.5, AIR.glassDark));
    for (const s of [-1, 1]) b.at(11, 0, s * 2.12, s > 0 ? 0 : Math.PI, () => G.rect(0, 4.0, 0.02, 1.4, 0.55, AIR.glassDark));
    if (near) for (let i = 0; i < 5; i++) for (const s of [-1, 1]) b.at(6 - i * 3, 0, s * 3.0, s > 0 ? 0 : Math.PI, () => G.disc(0, 3.6, 0.02, 0.32, AIR.glassDark, { seg: 8 }));
    F.box(9, 0, 0, 0.4, 1.4, 0.4, AIR.prop);
    F.cyl(9, 0.5, 0, 0.5, 0.5, 0.4, 0x3a3f47, { seg: 8 });
  });
}

landmark('flughafen', { places: ['Weeze', 'Hahn', 'Memmingen', 'Lahr'], slot: 'skyline', far: true, title: 'Flughafen' }, (b) => {
  const { F, G } = b;
  const near = !b.lod;
  const C = AIR;
  F.box(0, 0, -45, 170, 0.1, 90, C.apron, { skip: 'b' });
  if (near) for (let i = 0; i < 6; i++) G.rect(-60 + i * 24, 0.11, -62, 0.4, 0.01, C.mark);
  // Terminal: Glasfront, weißes geschwungenes Dach (Wellenprofil quer)
  const tz = -14;
  F.box(-20, 0, tz, 90, 11, 20, C.glass, { g: [0.88, 1.06] });
  b.at(-20, 0, tz + 10.02, 0, () => {
    for (let i = 0; i <= 18; i++) G.rect(-45 + i * 5, 0, 0.02, 0.3, 11, C.roof);
    G.rect(0, 5.4, 0.03, 90, 0.4, C.roof);
  });
  b.at(-20, 0, tz, Math.PI / 2, () => F.extrude([[-12, 11], [-8, 13.4], [0, 14.6], [8, 13.4], [12, 11], [12, 10.4], [-12, 10.4]], -46, 46, C.roof, { g: [0.88, 1.04], crease: 0.6 }));
  // Fluggastbrücken
  for (const x of [-48, -20, 8]) F.box(x, 4, tz - 16, 3, 2.8, 12, C.concrete);
  // Tower: Schaft, Kanzel aus Glas, Dach mit Antenne
  F.cyl(45, 0, -22, 2.6, 2.3, 30, C.concrete, { seg: near ? 12 : 8, g: [0.86, 1.04] });
  F.lathe(45, 30, -22, [[2.4, 0], [5.2, 1.6], [5.2, 2.2]], C.concrete, { seg: 10, top: false });
  F.lathe(45, 32.2, -22, [[5.2, 0], [5.6, 3.2]], C.glassDark, { seg: 10, top: false });
  F.lathe(45, 35.4, -22, [[6.0, 0], [5.6, 0.6], [1.0, 1.2]], C.white, { seg: 10 });
  F.cyl(45, 36.6, -22, 0.12, 0.08, 6, C.prop, { seg: 4 });
  // Flugzeug auf dem Vorfeld
  cargoPlane(b, 20, -56, 0.35);
  // Gepäckwagen und kleiner Schlepper
  if (near) for (let i = 0; i < 3; i++) F.box(2 + i * 3, 0, -40, 2.4, 1.3, 1.6, i ? 0xf4efe4 : C.mark);
  return { w: 170, d: 90, h: 43 };
});

// --- Burg auf dem Berg: bewaldeter Kegel, Ringmauer mit Rundtürmen, Bergfried, Palas (Cochem, Salzburg, Nürburg …)
const BU = { wall: 0xe4d9c4, wallShade: 0xc9bca4, roof: 0x6a7480, roofRed: 0xb5503c, forest: 0x5e8f4e, forest2: 0x6f9f58, rock: 0xa89c88, meadow: 0x8fb466 };

/** Rundturm mit Kegeldach: Mitte (x, z), Fuß y, Radius r, Höhe h. */
function roundTower(b, x, y, z, r, h, wall, roof) {
  const { F } = b;
  F.cyl(x, y, z, r, r * 0.96, h, wall, { seg: b.lod ? 8 : 12, top: false, g: [0.86, 1.04] });
  F.lathe(x, y + h, z, [[r + 0.5, 0], [0.15, r * 1.9]], roof, { seg: b.lod ? 8 : 12 });
}

landmark('burgBerg', { places: ['Cochem', 'Nürburg', 'Eltz', 'Burghausen'], slot: 'skyline', far: true, title: 'Burg' }, (b) => {
  const { F, G } = b;
  const near = !b.lod;
  const C = BU;
  const ss = (a, c, v) => {
    const t = Math.min(1, Math.max(0, (v - a) / (c - a)));
    return t * t * (3 - 2 * t);
  };
  const cz = -80;
  const hf = (x, z) => 0.05 + 46 * (1 - ss(18, 86, Math.hypot(x, (z - cz) * 1.1)));
  const cf = (x, z, y) => (y > 43 ? C.meadow : y > 6 ? C.forest : C.meadow);
  terrain(b, gridLines(-100, 100, near ? 24 : 12), gridLines(0, -170, near ? 22 : 11, [cz]), hf, cf, mottle);
  // Waldkuppen auf den Hängen
  if (near) for (let i = 0; i < 34; i++) {
    const a = i * 2.39996;
    const r = 30 + ((i * 17) % 50);
    const x = Math.cos(a) * r;
    const z = cz + (Math.sin(a) * r) / 1.1;
    const y = hf(x, z);
    if (y < 7 || y > 42 || (Math.abs(x + 12) < 30 && z > cz && Math.abs(x - (z - cz) * 0.5) < 9)) continue;
    F.ball(x, y + 2.2, z, 3.2 + (i % 3) * 0.6, i % 2 ? C.forest2 : mix(C.forest, 0x2f5f43, 0.2), { ws: 6, hs: 4, sy: 0.85 });
  }
  const y0 = 45.5;
  // Ringmauer mit Zinnen, Rundtürme an den Ecken
  const wx = 20;
  const wz = 14;
  for (const s of [-1, 1]) {
    F.box(0, y0 - 1, cz + s * wz, 2 * wx, 7, 1.4, C.wall, { g: [0.86, 1.03] });
    F.box(s * wx, y0 - 1, cz, 1.4, 7, 2 * wz, C.wall, { g: [0.86, 1.03] });
    if (near) {
      merlons(b, -wx, wx, y0 + 6, cz + s * wz, 1.4, C.wall);
      b.at(s * wx, 0, cz, Math.PI / 2, () => merlons(b, -wz, wz, y0 + 6, 0, 1.4, C.wall));
    }
  }
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) roundTower(b, sx * wx, y0 - 1, cz + sz * wz, 3.4, 11, C.wall, C.roof);
  // Palas mit Gauben, Bergfried mit spitzem Helm und Erkertürmchen
  castleHouse(b, -4, y0, cz - 4, 26, 12, 12, 8, { wall: C.wall, roof: C.roof, dormers: 3, rows: 2 });
  F.box(12, y0, cz + 2, 9, 30, 9, C.wall, { g: [0.86, 1.04] });
  b.at(12, 0, cz + 6.5, 0, () => {
    for (const y of [y0 + 8, y0 + 16, y0 + 24]) G.rect(0, y, 0.03, 1.2, 2.0, NBG.pane);
  });
  F.lathe(12, y0 + 30, cz + 2, [[6.8, 0], [0.2, 12]], C.roof, { seg: 4, a0: Math.PI / 4 });
  for (const [sx, sz] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) {
    if (!near && sz < 0) continue;
    F.cyl(12 + sx * 4.5, y0 + 27, cz + 2 + sz * 4.5, 1.1, 1.1, 4, C.wall, { seg: 8, top: false });
    F.lathe(12 + sx * 4.5, y0 + 31, cz + 2 + sz * 4.5, [[1.4, 0], [0.1, 3.4]], C.roof, { seg: 8 });
  }
  F.ball(12, y0 + 42.4, cz + 2, 0.4, CITY.gold, { ws: 6, hs: 3 });
  // Weg in Kehren den Berg hinauf
  if (near) {
    const pts = [[-40, -6], [10, -20], [-24, -34], [16, -48], [-6, -60]];
    for (let i = 0; i + 1 < pts.length; i++) {
      const [ax, az] = pts[i];
      const [bx, bz] = pts[i + 1];
      F.rod([ax, hf(ax, az) + 0.2, az], [bx, hf(bx, bz) + 0.2, bz], 0.9, 0xd9ccb0, { seg: 3 });
    }
  }
  return { w: 200, d: 170, h: 88 };
});

// Wahrzeichen im Ausland und weitere Sammelsätze stehen in abroad.js und nutzen dieselben Werkzeuge
registerAbroad({
  landmark, loft, prism, spire, bands, slots, chamfer, rrect, ngon, circle, grow, move, terrain, gridLines, mottle, river, truss,
  antenna, dial, galleryMill, millSails, gothicSpire, pinnacle, lancet, merlons, castleHouse, roundTower, containers, crane,
  cargoPlane, strandkorb, wheelStand, wheelRotor, robedFigure,
});

// =============================================================================================================
// Auswahl je Ort
// =============================================================================================================
// Orte ohne eigenes Wahrzeichen: viel besuchte bekommen ein passendes Stück aus den Sammelsätzen, das Ausland eines
// nach Land, die Berge einen Gipfel mit Kreuz; kleine Orte kommen mit Kirche, Rathaus und Brunnen aus.
const EXTRA = {
  // Burg oder Festung auf dem Berg über der Stadt
  Salzburg: ['burgBerg'], Graz: ['burgBerg'], Vaduz: ['burgBerg'], Feldkirch: ['burgBerg'], 'Reutte (Österreich)': ['burgBerg'],
  Rattenberg: ['burgBerg'], 'Neuhausen am Rheinfall': ['burgBerg'], Luxemburg: ['burgBerg'], Vilnius: ['burgBerg'],
  'Perth (Schottland)': ['burgBerg'], Marburg: ['burgBerg'], Passau: ['burgBerg'], Landshut: ['burgBerg'], Koblenz: ['burgBerg'],
  Siegen: ['burgBerg'], Bacharach: ['burgBerg'], 'St. Goar': ['burgBerg'], 'St. Goarshausen': ['burgBerg'], 'Bingen am Rhein': ['burgBerg'],
  Lahnstein: ['burgBerg'], 'Traben-Trarbach': ['burgBerg'], 'Eltville am Rhein': ['burgBerg'], 'Rüdesheim': ['burgBerg'],
  Eisenach: ['burgBerg'], Coburg: ['burgBerg'], 'Königstein im Taunus': ['burgBerg'], Schwangau: ['burgBerg'],
  'Singen (Hohentwiel)': ['burgBerg'], 'Staufen im Breisgau': ['burgBerg'], 'Lörrach': ['burgBerg'], Kleve: ['burgBerg'],
  Edertal: ['burgBerg'], Schriesheim: ['burgBerg'], Hilpoltstein: ['burgBerg'], Ellwangen: ['burgBerg'], 'Bad Godesberg': ['burgBerg'],
  // Residenzschloss mit Garten
  Potsdam: ['schloss'], Ludwigsburg: ['schloss'], Karlsruhe: ['schloss'], Mannheim: ['schloss'], Celle: ['schloss'],
  Braunschweig: ['schloss'], Bayreuth: ['schloss'], Aschaffenburg: ['schloss'], Hanau: ['schloss'], Wolfsburg: ['schloss'],
  Erlangen: ['schloss'], 'Saarbrücken': ['schloss'], 'Münster': ['schloss'], Bonn: ['schloss'], Darmstadt: ['schloss'],
  Weimar: ['schloss'], 'Osnabrück': ['schloss'], Schwetzingen: ['schloss'], Bruchsal: ['schloss'], Rastatt: ['schloss'],
  'Bad Arolsen': ['schloss'], 'Jüchen': ['schloss'], Eichenzell: ['schloss'], 'Wächtersbach': ['schloss'], 'Prien am Chiemsee': ['schloss'],
  // Kurhaus, römische Arena, Hafen, Leuchtturm, Zeche, Rummel, Skyline, Karibik, Küste
  'Baden-Baden': ['kurhaus'], 'Bad Kreuznach': ['kurhaus'], 'Verwaltungsgemeinschaft Bad Mergentheim': ['kurhaus'],
  'Bad Homburg vor der Höhe': ['kurhaus'], Teplice: ['kurhaus'], 'Nîmes': ['kolosseum'], Arles: ['kolosseum'],
  Kreuzlingen: ['konstanzHafen'], Romanshorn: ['kielFaehre'], Friedrichshafen: ['kielFaehre'], Laboe: ['kielFaehre'],
  Danzig: ['nyhavn'], Flensburg: ['nyhavn'], Stade: ['nyhavn'], Cuxhaven: ['syltLeuchtturm'], Rostock: ['syltLeuchtturm'],
  Wilhelmshaven: ['syltLeuchtturm'], 'Büsum': ['syltLeuchtturm'], 'Wurster Nordseeküste': ['syltLeuchtturm'],
  Bremerhaven: ['syltLeuchtturm', 'containerCrane'], Katowice: ['zeche'], Ahlen: ['zeche'], Alsdorf: ['zeche'],
  'Clausthal-Zellerfeld': ['zeche'], 'Bochum - Wattenscheid': ['zeche'], 'Mülheim an der Ruhr': ['zeche'],
  Rust: ['kirmes'], Soltau: ['kirmes'], Geiselwind: ['kirmes'], 'Großpösna': ['kirmes'], 'Göteborg': ['kirmes'],
  Hodenhagen: ['zooEingang'], Stuer: ['zooEingang'], Warder: ['zooEingang'], Warschau: ['chicagoSkyline'],
  'Santo Domingo Este': ['miamiDeco'], Palermo: ['mittelmeerDorf'], Marseille: ['mittelmeerDorf'], Nizza: ['mittelmeerDorf'],
  // bewusst nichts: kein Hochgebirge in Sicht
  'Büsingen am Hochrhein': [],
};
// je Land (nicht Deutschland): nach Größe oder 'all'; eine leere Liste heißt bewusst nichts
const BY_COUNTRY = {
  AT: { dorf: ['alpenGipfel'], klein: ['alpenGipfel'], stadt: ['burgBerg'], gross: ['burgBerg'] },
  CH: { all: ['alpenGipfel'] },
  LI: { all: ['burgBerg'] },
  IT: { gross: ['stadion'], all: ['campanile'] },
  ES: { gross: ['stadion'], all: ['mittelmeerDorf'] },
  PT: { all: ['tramHuegel'] },
  HR: { all: [] },
  DK: { dorf: ['hollaenderMuehle'], klein: ['nyhavn'] },
  NO: { dorf: ['saunaSee'], klein: ['bryggen'], stadt: ['bryggen'] },
  SE: { dorf: ['saunaSee'], klein: ['saunaSee'] },
  FI: { all: ['saunaSee'] },
  NL: { all: ['hollaenderMuehle'] },
  BE: { all: ['hollaenderMuehle'] },
  GB: { gross: ['stadion'], all: ['burgBerg'] },
  US: { dorf: ['texasFarm'], klein: ['texasFarm'], gross: ['chicagoSkyline'] },
  CA: { gross: ['chicagoSkyline'] },
  DO: { all: ['miamiDeco'] },
};
// je Gegend (auch Deutschland): Gipfel in den Alpen, Windmühle im Norden, weißes Dorf am Mittelmeer
const BY_REGION = {
  alpine: { dorf: ['alpenGipfel'], klein: ['alpenGipfel'] },
  brick: { dorf: ['hollaenderMuehle'], klein: ['hollaenderMuehle'] },
  med: { dorf: ['mittelmeerDorf'], klein: ['mittelmeerDorf'], stadt: ['mittelmeerDorf'], gross: ['stadion'] },
  nordic: { dorf: ['saunaSee'] },
};
// zuletzt nach Größe (Auswahl nach dem Namen): Großstädte bekommen ihr Stadion, kleinere Orte nichts Erfundenes
const BY_SIZE = { gross: ['stadion'] };

/**
 * Wahrzeichen für einen Ort: place = { key, name, cc, pop, n, lat }. Die erste Quelle, die etwas sagt, gilt: die
 * eigenen Stücke des Orts (Wiki-Name der Karte), EXTRA (Sammelstücke für bestimmte Orte), das Land (BY_COUNTRY, nach
 * Größe oder 'all'), die Gegend (BY_REGION) und zuletzt die Größe (BY_SIZE, nach dem Namen gewählt, damit es bei
 * jedem Besuch dasselbe ist). Eine leere Liste in einer Tabelle heißt bewusst nichts.
 * Ergebnis: [{ name, slot, far, title }]; leer heißt: keins.
 */
export function landmarkFor(place) {
  const key = place.key ?? place.name ?? '';
  const size = sizeOf(place.pop ?? 0);
  const country = place.cc && place.cc !== 'DE' ? BY_COUNTRY[place.cc] : null;
  const generic = BY_SIZE[size] ? [BY_SIZE[size][hashKey(key) % BY_SIZE[size].length]] : [];
  const names = BY_PLACE.get(key) ?? BY_PLACE.get(place.name) ?? EXTRA[key] ?? country?.[size] ?? country?.all ?? BY_REGION[regionOf(place)]?.[size] ?? generic;
  return names.filter((n) => defs[n]).map((name) => ({ name, ...META[name] }));
}

export function createLandmarkKit(F) {
  return makeKit(F, defs);
}
