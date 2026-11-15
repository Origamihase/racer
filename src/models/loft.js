// Werkzeuge zum Modellieren der Fahrzeuge: Karosserien werden aus Querschnitten
// „gelofted“ (wie beim Bootsbau). So entstehen runde, glatte Formen ohne externe Modelle.
import * as THREE from 'three';
import { lerp } from '../util.js';

/** Glatte 1D-Kurve durch Stützpunkte [[u, v], …] (kubisch hermitesch, Catmull-Rom-Tangenten). */
export function curve1(points) {
  const n = points.length;
  return (u) => {
    if (u <= points[0][0]) return points[0][1];
    if (u >= points[n - 1][0]) return points[n - 1][1];
    let i = 0;
    while (i < n - 2 && u > points[i + 1][0]) i++;
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(n - 1, i + 2)];
    const h = p2[0] - p1[0];
    const t = (u - p1[0]) / h;
    const m1 = ((p2[1] - p0[1]) / (p2[0] - p0[0] || 1)) * h;
    const m2 = ((p3[1] - p1[1]) / (p3[0] - p1[0] || 1)) * h;
    const t2 = t * t;
    const t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * p1[1] + (t3 - 2 * t2 + t) * m1 + (-2 * t3 + 3 * t2) * p2[1] + (t3 - t2) * m2;
  };
}

/** Radlauf: Unterkante der Karosserie wird um die Räder herum angehoben. */
export function withArches(bottom, arches, r = 0.4, cv = 0.335) {
  return (u) => {
    let b = bottom(u);
    for (const a of arches) {
      const du = u - a;
      if (Math.abs(du) < r) b = Math.max(b, cv + Math.sqrt(r * r - du * du));
    }
    return b;
  };
}

/**
 * Loft-Geometrie. Querschnitt = „Squircle“ zwischen Unterkante b(u) und Oberkante t(u),
 * halbe Breite w(u), oben schmaler (tw). u läuft von vorne (0) nach hinten, z = u - L/2.
 */
export function loft({
  u0, u1, w, b, t, tw = 0.9, bw = 0.96, n = 4, segs = 80, ring = 28, L = 4.7, H = 1.5, caps = true,
  sampleEnds = 0.55,
}) {
  const pos = [];
  const uv = [];
  const idx = [];
  const us = [];
  for (let i = 0; i <= segs; i++) {
    const s = i / segs;
    // an den Enden dichter (Rundungen), in der Mitte gleichmäßig
    const sc = (1 - Math.cos(Math.PI * s)) / 2;
    us.push(u0 + (u1 - u0) * lerp(s, sc, sampleEnds));
  }
  const e = 2 / n;
  const ringXY = [];
  for (let k = 0; k < ring; k++) {
    const phi = (k / ring) * Math.PI * 2 - Math.PI / 2;
    const c = Math.cos(phi);
    const s = Math.sin(phi);
    ringXY.push([Math.sign(c) * Math.pow(Math.abs(c), e), Math.sign(s) * Math.pow(Math.abs(s), e)]);
  }
  for (const u of us) {
    const bb = b(u);
    const tt = Math.max(t(u), bb + 0.002);
    const ww = w(u);
    for (const [X, Y] of ringXY) {
      const y = bb + ((Y + 1) / 2) * (tt - bb);
      const wf = Y > 0 ? lerp(1, tw, Y) : lerp(1, bw, -Y);
      const x = X * ww * wf;
      pos.push(x, y, u - L / 2);
      uv.push(x < 0 ? u / L : 1 - u / L, y / H);
    }
  }
  for (let i = 0; i < segs; i++) {
    for (let k = 0; k < ring; k++) {
      const a = i * ring + k;
      const bq = i * ring + ((k + 1) % ring);
      const c = (i + 1) * ring + k;
      const d = (i + 1) * ring + ((k + 1) % ring);
      idx.push(a, bq, c, bq, d, c);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();

  if (!caps) return geo;
  // Deckel vorne/hinten mit eigenen (flachen) Normalen
  const nPos = Array.from(geo.attributes.position.array);
  const nNor = Array.from(geo.attributes.normal.array);
  const nUv = Array.from(geo.attributes.uv.array);
  const addCap = (sectionIndex, front) => {
    const base = nPos.length / 3;
    let cx = 0;
    let cy = 0;
    const z = nPos[sectionIndex * ring * 3 + 2];
    for (let k = 0; k < ring; k++) {
      const j = (sectionIndex * ring + k) * 3;
      cx += nPos[j];
      cy += nPos[j + 1];
      nPos.push(nPos[j], nPos[j + 1], nPos[j + 2]);
      nNor.push(0, 0, front ? -1 : 1);
      nUv.push(nUv[(sectionIndex * ring + k) * 2], nUv[(sectionIndex * ring + k) * 2 + 1]);
    }
    nPos.push(cx / ring, cy / ring, z);
    nNor.push(0, 0, front ? -1 : 1);
    nUv.push(0.5, 0.5);
    const center = base + ring;
    for (let k = 0; k < ring; k++) {
      const a = base + k;
      const bq = base + ((k + 1) % ring);
      if (front) idx.push(center, bq, a);
      else idx.push(center, a, bq);
    }
  };
  addCap(0, true);
  addCap(segs, false);
  const g2 = new THREE.BufferGeometry();
  g2.setAttribute('position', new THREE.Float32BufferAttribute(nPos, 3));
  g2.setAttribute('normal', new THREE.Float32BufferAttribute(nNor, 3));
  g2.setAttribute('uv', new THREE.Float32BufferAttribute(nUv, 2));
  g2.setIndex(idx);
  geo.dispose();
  return g2;
}

/** Fügt einer Geometrie eine einheitliche Vertex-Farbe hinzu (für zusammengeführte Detail-Meshes). */
export function colorize(geo, hex) {
  const c = new THREE.Color(hex);
  const n = geo.attributes.position.count;
  const arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    arr[i * 3] = c.r;
    arr[i * 3 + 1] = c.g;
    arr[i * 3 + 2] = c.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  return geo;
}

/** Box mit Position/Rotation als fertige Geometrie (für mergeGeometries). */
export function boxAt(w, h, d, x, y, z, rx = 0, ry = 0, rz = 0) {
  const g = new THREE.BoxGeometry(w, h, d);
  if (rx || ry || rz) g.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(rx, ry, rz)));
  g.translate(x, y, z);
  return g;
}

/** Reifen (gerundetes Profil) mit Achse entlang x. */
export function tireGeometry(r, width, segs = 20) {
  const pts = [];
  const rim = r * 0.62;
  const hw = width / 2;
  const sh = Math.min(0.045, width * 0.22);
  pts.push(new THREE.Vector2(rim, -hw));
  pts.push(new THREE.Vector2(r - sh, -hw));
  for (let i = 0; i <= 4; i++) {
    const a = -Math.PI / 2 + (i / 4) * (Math.PI / 2);
    pts.push(new THREE.Vector2(r - sh + Math.cos(a) * sh, -hw + sh + Math.sin(a) * sh));
  }
  for (let i = 0; i <= 4; i++) {
    const a = (i / 4) * (Math.PI / 2);
    pts.push(new THREE.Vector2(r - sh + Math.cos(a) * sh, hw - sh + Math.sin(a) * sh));
  }
  pts.push(new THREE.Vector2(rim, hw));
  const g = new THREE.LatheGeometry(pts, segs);
  g.rotateZ(Math.PI / 2);
  return g;
}

/** Scheibe (Radkappe / Felge) mit Normale entlang ±x. */
export function discX(r, x, y, z, outward = 1, segs = 20) {
  const g = new THREE.CircleGeometry(r, segs);
  g.rotateY(outward > 0 ? Math.PI / 2 : -Math.PI / 2);
  g.translate(x, y, z);
  return g;
}
