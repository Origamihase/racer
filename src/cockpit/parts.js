// Bausteine für den Innenraum: weiche, gerundete Formen aus wenig Code. Alles liefert Geometrien, die am
// Ende je Material zu einem einzigen Mesh zusammengefasst werden (wenige Zeichenaufrufe).
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const V3 = THREE.Vector3;
const col = new THREE.Color();
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

export const v3 = (x, y, z) => new V3(x, y, z);

/** Polygonzug mit ausgerundeten Ecken. pts: [x, y, r] (r = Eckradius, 0 oder weggelassen = scharf). */
export function fillet(pts, seg = 4, closed = false) {
  const out = [];
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const r = p[2] || 0;
    if (!r || (!closed && (i === 0 || i === n - 1))) {
      out.push([p[0], p[1]]);
      continue;
    }
    const a = pts[(i - 1 + n) % n];
    const b = pts[(i + 1) % n];
    const la = Math.hypot(a[0] - p[0], a[1] - p[1]);
    const lb = Math.hypot(b[0] - p[0], b[1] - p[1]);
    const ua = [(a[0] - p[0]) / la, (a[1] - p[1]) / la];
    const ub = [(b[0] - p[0]) / lb, (b[1] - p[1]) / lb];
    const half = Math.acos(clamp(ua[0] * ub[0] + ua[1] * ub[1], -1, 1)) / 2;
    const d = Math.min(r / Math.tan(half), la * 0.49, lb * 0.49);
    for (let k = 0; k <= seg; k++) {
      const t = k / seg;
      const w0 = (1 - t) * (1 - t);
      const w1 = 2 * t * (1 - t);
      const w2 = t * t;
      out.push([
        w0 * (p[0] + ua[0] * d) + w1 * p[0] + w2 * (p[0] + ub[0] * d),
        w0 * (p[1] + ua[1] * d) + w1 * p[1] + w2 * (p[1] + ub[1] * d),
      ]);
    }
  }
  return out;
}

/**
 * Fläche durch Punktreihen (rows[i][j] als Vector3, alle Reihen gleich lang), weich schattiert.
 * closed: jede Reihe ist ein Ring. face: Punkt, zu dem die Vorderseite zeigen soll (sonst flip).
 * uv in Metern: u entlang der Reihe, v von Reihe zu Reihe (für Stoff- und Narbenstruktur ohne Verzerrung).
 */
export function skin(rows, { closed = false, face = null, flip = false } = {}) {
  const m = rows.length;
  const n = rows[0].length;
  const nn = closed ? n + 1 : n;
  const pos = new Float32Array(m * nn * 3);
  const uv = new Float32Array(m * nn * 2);
  const vAcc = new Float32Array(nn);
  for (let i = 0; i < m; i++) {
    let u = 0;
    for (let j = 0; j < nn; j++) {
      const p = rows[i][j % n];
      if (j > 0) u += p.distanceTo(rows[i][(j - 1) % n]);
      if (i > 0) vAcc[j] += p.distanceTo(rows[i - 1][j % n]);
      const k = i * nn + j;
      pos[k * 3] = p.x;
      pos[k * 3 + 1] = p.y;
      pos[k * 3 + 2] = p.z;
      uv[k * 2] = u;
      uv[k * 2 + 1] = vAcc[j];
    }
  }
  const index = [];
  for (let i = 0; i < m - 1; i++) {
    for (let j = 0; j < nn - 1; j++) {
      const a = i * nn + j;
      const b = a + 1;
      const c = a + nn;
      const d = c + 1;
      index.push(a, c, b, b, c, d);
    }
  }
  if (face) {
    // zeigt die Fläche im Mittel vom Bezugspunkt weg? Dann umdrehen
    let s = 0;
    const pa = new V3();
    const pb = new V3();
    const pc = new V3();
    const nrm = new V3();
    for (let t = 0; t < index.length; t += 3) {
      pa.fromArray(pos, index[t] * 3);
      pb.fromArray(pos, index[t + 1] * 3);
      pc.fromArray(pos, index[t + 2] * 3);
      nrm.crossVectors(pb.sub(pa), pc.sub(pa));
      s += nrm.dot(pb.copy(face).sub(pa));
    }
    if (s < 0) flip = !flip;
  }
  if (flip) for (let t = 0; t < index.length; t += 3) [index[t + 1], index[t + 2]] = [index[t + 2], index[t + 1]];
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setIndex(index);
  g.computeVertexNormals();
  if (closed) {
    // Naht des Rings: Normalen der ersten und letzten Spalte angleichen
    const nor = g.attributes.normal;
    const a = new V3();
    const b = new V3();
    for (let i = 0; i < m; i++) {
      const k0 = i * nn;
      const k1 = k0 + n;
      a.fromBufferAttribute(nor, k0).add(b.fromBufferAttribute(nor, k1)).normalize();
      nor.setXYZ(k0, a.x, a.y, a.z);
      nor.setXYZ(k1, a.x, a.y, a.z);
    }
  }
  return g;
}

/**
 * Körper entlang eines Pfades (Vector3[]) mit Querschnitt section(t, i) → [[a, b], …] (Ring, a quer, b „oben“).
 * up: grobe Oben-Richtung für die Ausrichtung des Querschnitts. Enden werden mit einer Kappe geschlossen.
 */
export function sweep(path, section, { up = new V3(0, 1, 0), caps = true, face = null } = {}) {
  const rows = [];
  const T = new V3();
  const X = new V3();
  const Y = new V3();
  const n = path.length;
  for (let i = 0; i < n; i++) {
    T.subVectors(path[Math.min(n - 1, i + 1)], path[Math.max(0, i - 1)]).normalize();
    X.crossVectors(up, T).normalize();
    Y.crossVectors(T, X);
    const ring = section(i / (n - 1), i).map(([a, b]) => path[i].clone().addScaledVector(X, a).addScaledVector(Y, b));
    if (caps && i === 0) rows.push(ring.map(() => path[0].clone()));
    rows.push(ring);
    if (caps && i === n - 1) rows.push(ring.map(() => path[n - 1].clone()));
  }
  // ohne Bezugspunkt zeigen die Flächen vom Pfad weg nach außen
  return skin(rows, { closed: true, face, flip: !face });
}

/** Ring-Querschnitt: Superellipse mit Halbachsen a, b (e = 2 rund, größer = eckiger). */
export function ring(a, b, seg = 12, e = 2, ox = 0, oy = 0) {
  const out = [];
  for (let k = 0; k < seg; k++) {
    const t = (k / seg) * Math.PI * 2;
    const c = Math.cos(t);
    const s = Math.sin(t);
    out.push([ox + a * Math.sign(c) * Math.abs(c) ** (2 / e), oy + b * Math.sign(s) * Math.abs(s) ** (2 / e)]);
  }
  return out;
}

/** Verformt eine Geometrie mit f(p) (verändert p) und führt die Normalen über kleine Differenzen mit. */
export function warp(geo, f, eps = 1e-3) {
  const pos = geo.attributes.position;
  const nor = geo.attributes.normal;
  const p = new V3();
  const n = new V3();
  const t1 = new V3();
  const t2 = new V3();
  const a = new V3();
  const b = new V3();
  const c = new V3();
  const d = new V3();
  for (let i = 0; i < pos.count; i++) {
    p.fromBufferAttribute(pos, i);
    n.fromBufferAttribute(nor, i);
    t1.set(1, 0, 0);
    if (Math.abs(n.x) > 0.8) t1.set(0, 1, 0);
    t1.addScaledVector(n, -t1.dot(n)).normalize();
    t2.crossVectors(n, t1);
    f(a.copy(p).addScaledVector(t1, eps));
    f(b.copy(p).addScaledVector(t1, -eps));
    f(c.copy(p).addScaledVector(t2, eps));
    f(d.copy(p).addScaledVector(t2, -eps));
    n.crossVectors(a.sub(b), c.sub(d)).normalize();
    f(p);
    pos.setXYZ(i, p.x, p.y, p.z);
    nor.setXYZ(i, n.x, n.y, n.z);
  }
  return geo;
}

/**
 * Rasterlinien einer Quaderkante von −half bis half: in den beiden Rundungen (Radius rr) gleiche Winkelschritte
 * (k je halber Rundung, die andere Hälfte liefert die Nachbarfläche), dazwischen m gleiche Schritte.
 * Gibt eine stetige Abbildung des gleichmäßigen Rasters der BoxGeometry auf diese Linien zurück.
 */
function edgeGrid(half, rr, k, m) {
  const band = [];
  for (let i = 0; i <= k; i++) band.push(half - rr + rr * Math.tan((Math.PI / 4) * (i / k)));
  const inner = half - rr;
  const g = band.map((v) => -v).reverse();
  for (let i = 1; i < m; i++) g.push(-inner + (2 * inner * i) / m);
  // reicht die Rundung bis zur Mitte, fallen die beiden mittleren Linien zusammen
  g.push(...(inner > 1e-6 ? band : band.slice(1)));
  const n = g.length - 1;
  const step = (2 * half) / n;
  return {
    n,
    map(v) {
      const f = clamp((v + half) / step, 0, n);
      const i = Math.min(n - 1, Math.floor(f));
      return g[i] + (g[i + 1] - g[i]) * (f - i);
    },
  };
}

/**
 * Kissen: Quader mit runden Kanten (r) und nach außen gewölbten Seiten (puff: Zahl oder [x, y, z] in Metern).
 * Im Gegensatz zur RoundedBoxGeometry sind auch die Flächen unterteilt, damit sie sich wölben können; die
 * Rundungen bekommen eigene Winkelschritte (sonst wird aus einer Kante eine Fase).
 */
export function pillow(w, h, d, r = 0.03, puff = 0, seg = 8) {
  const hx = w / 2;
  const hy = h / 2;
  const hz = d / 2;
  const rr = Math.min(r, hx, hy, hz);
  const pf = typeof puff === 'number' ? [puff, puff, puff] : puff;
  const m = Math.max(w, h, d);
  // Schritte der Fläche zwischen den Rundungen: gewölbte Flächen brauchen mehr
  const flat = (v, i) => Math.max(pf[i] ? 3 : 1, Math.round((seg * (v - 2 * rr)) / m));
  // zwei Winkelschritte je halbe Rundung reichen mit weichen Normalen (spart gut ein Drittel der Dreiecke)
  const k = 2;
  const gx = edgeGrid(hx, rr, k, flat(w, 0));
  const gy = edgeGrid(hy, rr, k, flat(h, 1));
  const gz = edgeGrid(hz, rr, k, flat(d, 2));
  const g = new THREE.BoxGeometry(w, h, d, gx.n, gy.n, gz.n);
  const q = new V3();
  const keep = (t) => Math.max(0, 1 - t * t);
  return warp(g, (p) => {
    p.set(gx.map(p.x), gy.map(p.y), gz.map(p.z));
    const tx = p.x / hx;
    const ty = p.y / hy;
    const tz = p.z / hz;
    q.set(clamp(p.x, -hx + rr, hx - rr), clamp(p.y, -hy + rr, hy - rr), clamp(p.z, -hz + rr, hz - rr));
    p.sub(q);
    const l = p.length();
    if (l > 1e-9) p.multiplyScalar(rr / l);
    p.add(q);
    p.x += Math.sign(tx) * pf[0] * keep(ty) * keep(tz) * Math.min(1, Math.abs(tx)) ** 6;
    p.y += Math.sign(ty) * pf[1] * keep(tx) * keep(tz) * Math.min(1, Math.abs(ty)) ** 6;
    p.z += Math.sign(tz) * pf[2] * keep(tx) * keep(ty) * Math.min(1, Math.abs(tz)) ** 6;
  });
}

/** Rechteck w × h mit runden Ecken (Radius r) als Form, Mitte im Ursprung. */
export function roundedRect(w, h, r) {
  const x = w / 2;
  const y = h / 2;
  const s = new THREE.Shape();
  s.moveTo(-x + r, -y);
  s.lineTo(x - r, -y);
  s.absarc(x - r, -y + r, r, -Math.PI / 2, 0);
  s.lineTo(x, y - r);
  s.absarc(x - r, y - r, r, 0, Math.PI / 2);
  s.lineTo(-x + r, y);
  s.absarc(-x + r, y - r, r, Math.PI / 2, Math.PI);
  s.lineTo(-x, -y + r);
  s.absarc(-x + r, -y + r, r, Math.PI, Math.PI * 1.5);
  return s;
}

/**
 * Quader mit runden Kanten und ebenen Flächen (Geräte, Schalter). Ein Schritt je Rundung reicht bei Radien von ein
 * paar Millimetern (weiche Normalen): 108 statt 300 Dreiecke je Teil. Größere sichtbare Rundungen geben seg = 2+ an.
 */
export function rbox(w, h, d, r = 0.004, seg = 1) {
  return new RoundedBoxGeometry(w, h, d, seg, Math.min(r, w / 2 - 1e-4, h / 2 - 1e-4, d / 2 - 1e-4));
}

/** Rotationskörper um die y-Achse aus einem Profil [[Radius, Höhe, Eckradius?], …]. */
export function lathe(profile, seg = 24, corner = 3) {
  const pts = fillet(profile, corner).map(([r, y]) => new THREE.Vector2(Math.max(0, r), y));
  // LatheGeometry erwartet das Profil von unten nach oben (sonst zeigen die Flächen nach innen)
  let area = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    area += a.x * b.y - b.x * a.y;
  }
  if (area < 0) pts.reverse();
  return new THREE.LatheGeometry(pts, seg);
}

/** Schlauch (Kabel, Keder) durch Punkte, mit runden Enden. */
export function tube(pts, r, { radial = 8, closed = false, step = 0.01, tension = 0.5 } = {}) {
  const curve = new THREE.CatmullRomCurve3(pts, closed, 'catmullrom', tension);
  const len = curve.getLength();
  const g = new THREE.TubeGeometry(curve, Math.max(4, Math.round(len / step)), r, radial, closed);
  if (closed) return g;
  const parts = [g.toNonIndexed()];
  for (const t of [0, 1]) {
    const cap = new THREE.SphereGeometry(r, radial, 4).toNonIndexed();
    const p = curve.getPoint(t);
    cap.translate(p.x, p.y, p.z);
    parts.push(cap);
  }
  return mergeGeometries(parts);
}

/**
 * Kleine Nähfäden entlang einer Linie auf einer Fläche (pts: Punkte, nrm: Flächennormale je Punkt): flache
 * Stichrechtecke knapp über der Fläche, gefärbt wie mit prep. Gibt die Liste der Stiche zurück.
 */
export function stitches(pts, nrm, { len = 0.009, gap = 0.0045, w = 0.0017, h = 0.0007, color = 0xffffff } = {}) {
  const out = [];
  const m = new THREE.Matrix4();
  const t = new V3();
  const b = new V3();
  const p = new V3();
  const n = new V3();
  let acc = 0;
  let next = len / 2;
  for (let i = 0; i < pts.length - 1; i++) {
    const seg = pts[i].distanceTo(pts[i + 1]);
    while (next <= acc + seg) {
      const k = (next - acc) / seg;
      p.lerpVectors(pts[i], pts[i + 1], k);
      n.lerpVectors(nrm[i], nrm[i + 1], k).normalize();
      t.subVectors(pts[i + 1], pts[i]).normalize();
      // flaches Stichrechteck knapp über der Fläche (rechtshändige Basis t, n×t, n: Vorderseite zeigt nach n)
      b.crossVectors(n, t).normalize();
      n.crossVectors(t, b);
      m.makeBasis(t, b, n).setPosition(p.addScaledVector(n, h));
      out.push(prep(new THREE.PlaneGeometry(len, w).applyMatrix4(m), color));
      next += len + gap;
    }
    acc += seg;
  }
  return out;
}

/** Geometrie drehen (Euler XYZ) und verschieben; gibt sie zurück. */
export function place(geo, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, s = 1) {
  if (s !== 1) geo.scale(s, s, s);
  if (rx || ry || rz) geo.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(rx, ry, rz)));
  geo.translate(x, y, z);
  return geo;
}

/** Geometrie an eine Matrix hängen. */
export function at(geo, matrix) {
  geo.applyMatrix4(matrix);
  return geo;
}

/**
 * Bringt eine Geometrie in die gemeinsame Form (ohne Index; position, normal, uv, color) und färbt sie.
 * shade(p, n) → Faktor (aufgemalte Schatten in Falten und unter Kanten), uv: 'keep' | Zahl (Kacheln je Meter,
 * dann wird die Struktur von der passendsten Achse aus aufgelegt und nirgends gestreckt).
 */
export function prep(geo, color = 0xffffff, { shade = null, uv = 1 } = {}) {
  const g = geo.index ? geo.toNonIndexed() : geo;
  if (!g.attributes.normal) g.computeVertexNormals();
  for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'uv') g.deleteAttribute(k);
  g.clearGroups();
  const pos = g.attributes.position;
  const nor = g.attributes.normal;
  const n = pos.count;
  if (!g.attributes.uv || uv !== 'keep') {
    const s = uv === 'keep' ? 1 : uv;
    const arr = new Float32Array(n * 2);
    const fn = new V3();
    const pa = new V3();
    const pb = new V3();
    const pc = new V3();
    for (let i = 0; i < n; i += 3) {
      pa.fromBufferAttribute(pos, i);
      pb.fromBufferAttribute(pos, i + 1);
      pc.fromBufferAttribute(pos, i + 2);
      fn.crossVectors(pb.clone().sub(pa), pc.clone().sub(pa));
      const ax = Math.abs(fn.x);
      const ay = Math.abs(fn.y);
      const az = Math.abs(fn.z);
      for (let k = 0; k < 3; k++) {
        const p = k === 0 ? pa : k === 1 ? pb : pc;
        const u = ax >= ay && ax >= az ? p.z : p.x;
        const v = ay >= ax && ay >= az ? p.z : p.y;
        arr[(i + k) * 2] = u * s;
        arr[(i + k) * 2 + 1] = v * s;
      }
    }
    g.setAttribute('uv', new THREE.BufferAttribute(arr, 2));
  }
  const c = new Float32Array(n * 3);
  col.set(color);
  const p = new V3();
  const nn = new V3();
  for (let i = 0; i < n; i++) {
    let f = 1;
    if (shade) f = shade(p.fromBufferAttribute(pos, i), nn.fromBufferAttribute(nor, i));
    c[i * 3] = col.r * f;
    c[i * 3 + 1] = col.g * f;
    c[i * 3 + 2] = col.b * f;
  }
  g.setAttribute('color', new THREE.BufferAttribute(c, 3));
  return g;
}

/** Fasst vorbereitete Geometrien zu einem Mesh zusammen (null, wenn die Liste leer ist). */
export function meshOf(list, material) {
  if (!list.length) return null;
  const m = new THREE.Mesh(mergeGeometries(list), material);
  for (const g of list) g.dispose();
  return m;
}

const HIDDEN = new THREE.MeshBasicMaterial({ visible: false });

/**
 * Fertige Figur aus vielen Einzelteilen (z. B. Wackel-Elsa) auf wenige Zeichenaufrufe bringen: alle Meshes unter
 * root – außer denen in den Teilbäumen von keep (bewegliche Teile) – je Material zu einem Mesh verschmelzen, das
 * direkt an root hängt (Lage relativ zu root eingebacken). Die alten Meshes bleiben als unsichtbare Träger stehen,
 * damit Kinder, die an ihnen hängen, ihre Lage behalten.
 */
export function mergeByMaterial(root, keep = []) {
  const skip = new Set();
  for (const k of keep) k.traverse((o) => skip.add(o));
  root.updateMatrixWorld(true);
  const inv = root.matrixWorld.clone().invert();
  const groups = new Map();
  root.traverse((o) => {
    if (!o.isMesh || o.isInstancedMesh || skip.has(o) || !o.visible || Array.isArray(o.material)) return;
    const g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
    for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'uv') g.deleteAttribute(k);
    if (!g.attributes.normal || !g.attributes.uv) return;
    g.morphAttributes = {};
    g.clearGroups();
    g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld));
    if (!groups.has(o.material)) groups.set(o.material, []);
    groups.get(o.material).push(g);
    o.material = HIDDEN;
    o.castShadow = false;
  });
  for (const [material, list] of groups) {
    const m = new THREE.Mesh(mergeGeometries(list), material);
    for (const g of list) g.dispose();
    root.add(m);
  }
}
