// Formen-Werkzeug für die Bausteine der Miniaturwelt: runde, weiche Grundformen mit eingebackener Schattierung.
// Jede Form kommt als Geometrie mit Position, Normale und Vertex-Farbe (am Fuß etwas dunkler, oben heller), so
// lesen sich die Körper auch ohne teures Licht. fuse() verschmilzt die Teile zu einer einzigen, indizierten
// Geometrie – ein Baustein ist damit ein Draw-Call und teilt sich Ecken, wo Fläche und Farbe glatt durchlaufen.
import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _p = new THREE.Vector3();
const _s = new THREE.Vector3();
const _w = new THREE.Vector3();
const _a = new THREE.Color();
const _b = new THREE.Color();
const _hsl = { h: 0, s: 0, l: 0 };
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Farbton heller (k > 1) oder dunkler machen, optional kräftiger (sat > 1); Hex rein, Hex raus. */
export function tone(hex, k, sat = 1) {
  _a.setHex(hex).getHSL(_hsl, THREE.SRGBColorSpace);
  return _a.setHSL(_hsl.h, clamp01(_hsl.s * sat), clamp01(_hsl.l * k), THREE.SRGBColorSpace).getHex();
}

/** Zwei Farbtöne mischen (t = 0: a, t = 1: b). */
export function blend(a, b, t) {
  return _a.setHex(a).lerp(_b.setHex(b), t).getHex();
}

/**
 * Vertex-Farben setzen. col: Hex oder [unten, oben] (Verlauf über die Höhe y0 … y1, Vorgabe: Ausdehnung des
 * Teils). ao: so viel dunkler am Fuß (läuft nach oben weich aus), under: so viel dunkler an Unterseiten.
 */
export function paint(geo, col = 0xffffff, { ao = 0.14, under = 0, y0, y1 } = {}) {
  const g = geo.index ? geo.toNonIndexed() : geo;
  if (g.attributes.uv) g.deleteAttribute('uv');
  const pos = g.attributes.position;
  const nrm = g.attributes.normal;
  let lo = y0;
  let hi = y1;
  if (lo === undefined || hi === undefined) {
    g.computeBoundingBox();
    if (lo === undefined) lo = g.boundingBox.min.y;
    if (hi === undefined) hi = g.boundingBox.max.y;
  }
  const span = Math.max(1e-6, hi - lo);
  const two = Array.isArray(col);
  _a.setHex(two ? col[0] : col);
  _b.setHex(two ? col[1] : col);
  const arr = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const t = clamp01((pos.getY(i) - lo) / span);
    let k = 1 - ao * (1 - t) * (1 - t);
    if (under) k *= 1 - under * Math.max(0, -nrm.getY(i));
    arr[i * 3] = (_a.r + (_b.r - _a.r) * t) * k;
    arr[i * 3 + 1] = (_a.g + (_b.g - _a.g) * t) * k;
    arr[i * 3 + 2] = (_a.b + (_b.b - _a.b) * t) * k;
  }
  g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  return g;
}

/** Teil skalieren (s), drehen (rot, Euler XYZ) und verschieben (at), dann einfärben (col, ao, under, y0, y1). */
function finish(g, { at, rot, s, col, ...shade } = {}) {
  if (at || rot || s) {
    _e.set(rot ? rot[0] : 0, rot ? rot[1] : 0, rot ? rot[2] : 0);
    _q.setFromEuler(_e);
    _p.set(at ? at[0] : 0, at ? at[1] : 0, at ? at[2] : 0);
    if (typeof s === 'number') _s.setScalar(s);
    else _s.set(s ? s[0] : 1, s ? s[1] : 1, s ? s[2] : 1);
    g.applyMatrix4(_m.compose(_p, _q, _s));
  }
  return paint(g, col, shade);
}

/**
 * Kugel/Ei (Ikosaeder, d = Feinheit). flat < 1 drückt die untere Hälfte platt (Wolken, Büsche, Hauben).
 * d = [Segmente, Bänder, Winkel]: statt des Ikosaeders eine unten offene Kuppel vom Scheitel bis zum Winkel (Bogenmaß
 * vom Scheitel, π/2 = Äquator) – für Laubballen, deren Unterseite ohnehin im Boden oder im Nachbarballen steckt.
 */
export function ball(r, { d = 1, flat = 1, ...o } = {}) {
  const g = Array.isArray(d) ? new THREE.SphereGeometry(r, d[0], d[1], 0, Math.PI * 2, 0, d[2]) : new THREE.IcosahedronGeometry(r, d);
  if (d === 0) {
    // auch der grobe Zwanzigflächner (Augen, Ohren, Büschel) soll weich schattieren: Normalen wie bei der Kugel
    const p = g.attributes.position;
    const n = g.attributes.normal;
    for (let i = 0; i < p.count; i++) {
      _p.fromBufferAttribute(p, i).normalize();
      n.setXYZ(i, _p.x, _p.y, _p.z);
    }
  }
  if (flat < 1) {
    const p = g.attributes.position;
    const n = g.attributes.normal;
    for (let i = 0; i < p.count; i++) {
      if (p.getY(i) >= 0) continue;
      const y = p.getY(i) * flat;
      p.setY(i, y);
      _p.set(p.getX(i), y / (flat * flat), p.getZ(i)).normalize();
      n.setXYZ(i, _p.x, _p.y, _p.z);
    }
  }
  return finish(g, o);
}

/**
 * Stab/Stamm/Kegelstumpf, steht auf y = 0: unten r0, oben r1, Höhe h. caps: Deckel oben und unten, top: nur oben
 * (Pfosten, Stümpfe – die Unterseite steht ohnehin auf dem Boden).
 */
export function rod(r0, r1, h, { seg = 8, caps = false, top = false, hs = 1, ...o } = {}) {
  let g = new THREE.CylinderGeometry(r1, r0, h, seg, hs, !caps);
  g.translate(0, h / 2, 0);
  if (top && !caps) {
    // CircleGeometry beginnt bei +x, der Zylinder bei +z: eine Vierteldrehung bringt die Ecken zur Deckung
    const lid = new THREE.CircleGeometry(r1, seg).rotateX(-Math.PI / 2).rotateY(-Math.PI / 2).translate(0, h, 0);
    g = mergeGeometries([g.toNonIndexed(), lid.toNonIndexed()]);
  }
  return finish(g, o);
}

/** Kegel, steht auf y = 0 (base: mit Bodenfläche). */
export function cone(r, h, { seg = 8, base = false, ...o } = {}) {
  const g = new THREE.ConeGeometry(r, h, seg, 1, !base);
  g.translate(0, h / 2, 0);
  return finish(g, o);
}

/** Scheibe (flach, Normale nach oben) in Höhe 0. */
export function disc(r, { seg = 10, ...o } = {}) {
  const g = new THREE.CircleGeometry(r, seg);
  g.rotateX(-Math.PI / 2);
  return finish(g, o);
}

/** Quader, steht auf y = 0. round: Kantenradius (dann mit weichen Kanten, rs = Unterteilung). */
export function box(w, h, d, { round = 0, rs = 1, ...o } = {}) {
  const g = round > 0 ? new RoundedBoxGeometry(w, h, d, rs, round) : new THREE.BoxGeometry(w, h, d);
  g.translate(0, h / 2, 0);
  return finish(g, o);
}

/** Drehkörper um die y-Achse aus einem Profil [[r, y], …] von unten nach oben. */
export function lathe(profile, { seg = 10, ...o } = {}) {
  const g = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), seg);
  return finish(g, o);
}

/**
 * Schlauch entlang von Punkten [[x, y, z], …] (weich durchgezogen): Äste, Hälse, Bügel, Schwänze. r1: Radius am
 * Ende (der Schlauch läuft von r gleichmäßig dorthin, etwa ein Hals, der zum Kopf hin schlanker wird).
 */
export function tube(points, r, { seg = 6, steps = 8, r1 = r, ...o } = {}) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  const g = new THREE.TubeGeometry(curve, steps, r, seg, false);
  if (r1 !== r) {
    // TubeGeometry legt steps + 1 Ringe zu je seg + 1 Ecken an: jeden Ring um seinen Mittelpunkt strecken. Die
    // Normalen bleiben die des geraden Schlauchs – bei schlanker Verjüngung ist der Unterschied nicht zu sehen.
    const p = g.attributes.position;
    for (let i = 0; i <= steps; i++) {
      curve.getPointAt(i / steps, _w);
      const k = 1 + (r1 / r - 1) * (i / steps);
      for (let j = 0, v = i * (seg + 1); j <= seg; j++, v++) {
        p.setXYZ(v, _w.x + (p.getX(v) - _w.x) * k, _w.y + (p.getY(v) - _w.y) * k, _w.z + (p.getZ(v) - _w.z) * k);
      }
    }
  }
  return finish(g, o);
}

/** Gerade Stange von a nach b ([x, y, z]) mit Radius r: Streben, Holme, Haken. hs: Abschnitte entlang der Stange. */
export function bar(a, b, r, { seg = 8, caps = false, hs = 1, col, ...shade } = {}) {
  _w.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const len = _w.length();
  const g = new THREE.CylinderGeometry(r, r, len, seg, hs, !caps);
  g.translate(0, len / 2, 0);
  _q.setFromUnitVectors(_p.set(0, 1, 0), _w.normalize());
  g.applyMatrix4(_m.compose(_p.set(a[0], a[1], a[2]), _q, _s.set(1, 1, 1)));
  return paint(g, col, shade);
}

/**
 * Querschnitt entlang x ziehen, von x0 bis x1 in n Abschnitten (lange Teile quer über die Fahrbahn bleiben so
 * biegsam): profile [[y, z, ny, nz, col], …] läuft einmal um den Querschnitt herum, jede Ecke mit ihrer Normale und
 * Farbe. Zwei aufeinanderfolgende Punkte an derselben Stelle geben eine harte Kante (oder einen Farbsprung); die
 * Stirnseiten bleiben offen.
 */
export function sweep(profile, x0, x1, n = 1) {
  const pos = [];
  const nrm = [];
  const col = [];
  const xs = Array.from({ length: n + 1 }, (_, i) => x0 + ((x1 - x0) * i) / n);
  for (let j = 0; j < profile.length - 1; j++) {
    const A = profile[j];
    const B = profile[j + 1];
    if (A[0] === B[0] && A[1] === B[1]) continue;
    // Umlaufsinn so, dass die Fläche zur gemittelten Normale der beiden Ecken schaut
    const flip = (x1 - x0) * ((B[0] - A[0]) * (A[3] + B[3]) - (B[1] - A[1]) * (A[2] + B[2])) < 0;
    const [P, Q] = flip ? [B, A] : [A, B];
    for (let i = 0; i < n; i++) {
      const quad = [[xs[i], P], [xs[i + 1], P], [xs[i + 1], Q], [xs[i], P], [xs[i + 1], Q], [xs[i], Q]];
      for (const [x, [y, z, ny, nz, c]] of quad) {
        pos.push(x, y, z);
        nrm.push(0, ny, nz);
        _a.setHex(c);
        col.push(_a.r, _a.g, _a.b);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  return g;
}

/**
 * Ebene, konvexe Fläche aus Punkten [[x, y, z], …]; out zeigt grob nach außen und legt die Umlaufrichtung fest.
 * Die Normale ist die der Ebene (harte Kante zu den Nachbarflächen). both: auch von hinten sichtbar.
 */
export function face(pts, out, { both = false, ...o } = {}) {
  const a = new THREE.Vector3(...pts[0]);
  const n = new THREE.Vector3(...pts[1]).sub(a).cross(new THREE.Vector3(...pts[2]).sub(a)).normalize();
  const flip = n.dot(_p.set(out[0], out[1], out[2])) < 0;
  if (flip) n.negate();
  const P = flip ? [...pts].reverse() : pts;
  const pos = [];
  const nrm = [];
  for (let i = 1; i < P.length - 1; i++) {
    for (const p of [P[0], P[i], P[i + 1]]) {
      pos.push(p[0], p[1], p[2]);
      nrm.push(n.x, n.y, n.z);
    }
  }
  if (both) {
    // Rückseite (Blätter, Fahnen, Flügel): dieselben Dreiecke andersherum
    for (let i = 1; i < P.length - 1; i++) {
      for (const p of [P[0], P[i + 1], P[i]]) {
        pos.push(p[0], p[1], p[2]);
        nrm.push(-n.x, -n.y, -n.z);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  return finish(g, o);
}

/**
 * Prisma: konvexer Umriss [[x, y], …] in der x-y-Ebene, entlang z von −d/2 bis +d/2 gezogen (Hauskörper mit
 * Giebel, Dachplatten, Tröge). ends: Stirnflächen mitbauen; skip: Kanten des Umrisses ohne Seitenfläche.
 */
export function prism(outline, d, { ends = true, skip = [], ...o } = {}) {
  const parts = [];
  const cx = outline.reduce((s, p) => s + p[0], 0) / outline.length;
  const cy = outline.reduce((s, p) => s + p[1], 0) / outline.length;
  const n = outline.length;
  for (let i = 0; i < n; i++) {
    if (skip.includes(i)) continue;
    const [x0, y0] = outline[i];
    const [x1, y1] = outline[(i + 1) % n];
    const out = [(x0 + x1) / 2 - cx, (y0 + y1) / 2 - cy, 0];
    parts.push(face([[x0, y0, d / 2], [x1, y1, d / 2], [x1, y1, -d / 2], [x0, y0, -d / 2]], out));
  }
  if (ends) {
    parts.push(face(outline.map(([x, y]) => [x, y, d / 2]), [0, 0, 1]));
    parts.push(face(outline.map(([x, y]) => [x, y, -d / 2]), [0, 0, -1]));
  }
  return finish(mergeGeometries(parts), o);
}

/**
 * Haufen aus Kugeln [[x, y, z, r, sy = 1, d = 1, k = 1, f = flat], …] (Baumkronen, Büsche, Wolken). Dreiecke, die
 * ganz in einer Nachbarkugel stecken oder unter floor liegen, fallen weg: man sähe sie nie, sie kosteten nur
 * Rechenzeit. d wie bei ball (Feinheit oder Kuppel). k tönt eine Kugel heller oder dunkler als die anderen (Laub in
 * Büscheln statt ein Brocken), flat drückt die Unterseiten platt (siehe ball), f weicht davon für eine einzelne Kugel
 * ab (bei Wolken bleiben die oberen Ballen rund, nur die unteren bilden den flachen Boden).
 * Für Laub: soft (0…1) biegt die Normalen zur Hülle des ganzen Haufens hin – das Licht läuft dann weich über alle
 * Kugeln wie über ein Kissen, statt jede Kugel als eigenen Stein zu beleuchten; crease dunkelt die Kehlen ab, wo eine
 * Kugel in die nächste übergeht (so bleiben die Büschel trotzdem lesbar).
 */
export function puffs(list, { floor = -Infinity, flat = 1, soft = 0, crease = 0, cap = 0, ...o } = {}) {
  // wie tief ein Punkt in der nächsten Nachbarkugel steckt (< 1: drinnen, 1: auf ihrer Oberfläche). Bei einer
  // Kuppel zählt die Innenkugel ihrer Facetten: die ebenen Trapeze liegen bis zu gut 10 % innerhalb der runden Kugel,
  // ein Punkt dazwischen wäre durch eine Lücke zu sehen
  const depth = (x, y, z, self) => {
    let q = Infinity;
    for (let j = 0; j < list.length; j++) {
      if (j === self) continue;
      const [bx, by, bz, rb, sy = 1, d = 1, , f = flat] = list[j];
      const r = Array.isArray(d) ? rb * Math.cos(Math.PI / d[0]) * Math.cos(d[2] / (2 * d[1])) : rb;
      const dy = (y - by) / (r * sy * (y < by ? f : 1));
      q = Math.min(q, ((x - bx) / r) ** 2 + dy * dy + ((z - bz) / r) ** 2);
    }
    return q;
  };
  // Hülle: Ellipsoid um alle Kugeln (Mitte und Halbachsen der Umgebungsbox)
  const lo = [Infinity, Infinity, Infinity];
  const hi = [-Infinity, -Infinity, -Infinity];
  for (const [x, y, z, r, sy = 1] of list) {
    const e = [r, r * sy, r];
    [x, y, z].forEach((c, a) => {
      lo[a] = Math.min(lo[a], c - e[a]);
      hi[a] = Math.max(hi[a], c + e[a]);
    });
  }
  const mid = lo.map((v, a) => (v + hi[a]) / 2);
  const rad2 = lo.map((v, a) => ((hi[a] - v) / 2) ** 2);
  const parts = [];
  list.forEach(([x, y, z, r, sy = 1, d = 1, k = 1, f = flat], self) => {
    const g = ball(r, { d, flat: f, s: [1, sy, 1], at: [x, y, z] });
    const p = g.attributes.position;
    const nr = g.attributes.normal;
    const pos = [];
    const nrm = [];
    const shade = [];
    for (let i = 0; i < p.count; i += 3) {
      let hidden = true;
      let low = true;
      for (let v = i; v < i + 3; v++) {
        if (depth(p.getX(v), p.getY(v), p.getZ(v), self) >= 0.9) hidden = false;
        if (p.getY(v) > floor) low = false;
      }
      if (hidden || low) continue;
      for (let v = i; v < i + 3; v++) {
        const [px, py, pz] = [p.getX(v), p.getY(v), p.getZ(v)];
        pos.push(px, py, pz);
        _p.set(nr.getX(v), nr.getY(v), nr.getZ(v));
        if (soft > 0) {
          _s.set((px - mid[0]) / rad2[0], (py - mid[1]) / rad2[1], (pz - mid[2]) / rad2[2]).normalize();
          _p.multiplyScalar(1 - soft).addScaledVector(_s, soft).normalize();
        }
        nrm.push(_p.x, _p.y, _p.z);
        const t = crease > 0 ? clamp01((depth(px, py, pz, self) - 0.9) / 0.9) : 1;
        const top = clamp01((nr.getY(v) - 0.15) / 0.85);
        shade.push(k * (1 - crease * (1 - t) * (1 - t)) * (1 + cap * top * top));
      }
    }
    const c = new THREE.BufferGeometry();
    c.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    c.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
    c.setAttribute('shade', new THREE.Float32BufferAttribute(shade, 1));
    parts.push(c);
  });
  const g = finish(mergeGeometries(parts), o);
  const col = g.attributes.color;
  const shade = g.attributes.shade;
  for (let i = 0; i < col.count; i++) col.setXYZ(i, col.getX(i) * shade.getX(i), col.getY(i) * shade.getX(i), col.getZ(i) * shade.getX(i));
  g.deleteAttribute('shade');
  return g;
}

/** Schon fertige Teile gemeinsam verschieben, drehen, skalieren (ihre Farben bleiben). */
export function move(parts, { at, rot, s } = {}) {
  _e.set(rot ? rot[0] : 0, rot ? rot[1] : 0, rot ? rot[2] : 0);
  _q.setFromEuler(_e);
  _p.set(at ? at[0] : 0, at ? at[1] : 0, at ? at[2] : 0);
  if (typeof s === 'number') _s.setScalar(s);
  else _s.set(s ? s[0] : 1, s ? s[1] : 1, s ? s[2] : 1);
  const m = new THREE.Matrix4().compose(_p, _q, _s);
  return [parts].flat(Infinity).filter(Boolean).map((g) => g.clone().applyMatrix4(m));
}

/**
 * Teile zu einer indizierten Geometrie verschmelzen (null, wenn es keine gibt). Entartete Dreiecke (etwa an der
 * Achse eines Drehkörpers) fallen dabei weg.
 */
export function fuse(...parts) {
  const list = parts.flat(Infinity).filter(Boolean);
  if (!list.length) return null;
  const g = mergeVertices(mergeGeometries(list), 1e-4);
  const idx = g.index.array;
  const pos = g.attributes.position;
  const same = (i, j) => i === j || (Math.abs(pos.getX(i) - pos.getX(j)) + Math.abs(pos.getY(i) - pos.getY(j)) + Math.abs(pos.getZ(i) - pos.getZ(j)) < 1e-5);
  const keep = [];
  for (let i = 0; i < idx.length; i += 3) {
    if (!same(idx[i], idx[i + 1]) && !same(idx[i + 1], idx[i + 2]) && !same(idx[i], idx[i + 2])) keep.push(idx[i], idx[i + 1], idx[i + 2]);
  }
  g.setIndex(keep);
  g.computeBoundingBox();
  g.computeBoundingSphere();
  return g;
}

/** Zahl der Dreiecke einer Geometrie. */
export const tris = (g) => (g ? (g.index ? g.index.count : g.attributes.position.count) / 3 : 0);
