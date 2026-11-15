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
 * Optional bx(u, X, b(u)): Radlauf-Ausschnitt abhängig von der Querposition X (-1 … 1).
 * Nur was unter dieser Linie liegt, wird auf sie angehoben; die Flanke darüber bleibt, wie sie ist
 * (früher wurde der ganze Querschnitt gestaucht: Beule über dem Rad und senkrechte Knicke).
 */

/** Radläufe nur an den Seiten: innen bleibt der Unterboden unten, außen wird ausgeschnitten. */
export function sideArches(bottomWithArches, from = 0.5, to = 0.72) {
  return (u, X, base) => {
    const k = Math.abs(X);
    if (k <= from) return base;
    const t = Math.min(1, (k - from) / (to - from));
    return base + (bottomWithArches(u) - base) * t * t * (3 - 2 * t);
  };
}

/** Punkt auf einer Loft-Oberfläche (gleiche Formel wie loft), phi: -π/2 unten, 0 rechts, π/2 oben. */
export function loftPoint({ w, b, t, tw = 0.9, bw = 0.96, n = 4, L = 4.7, bx = null }, u, phi, target = new THREE.Vector3()) {
  const e = 2 / n;
  const c = Math.cos(phi);
  const s = Math.sin(phi);
  const X = Math.sign(c) * Math.pow(Math.abs(c), e);
  const Y = Math.sign(s) * Math.pow(Math.abs(s), e);
  const bSec = b(u);
  const tt = Math.max(t(u), bSec + 0.002);
  let y = bSec + ((Y + 1) / 2) * (tt - bSec);
  if (bx) y = Math.max(y, Math.min(bx(u, X, bSec), tt));
  const wf = Y > 0 ? lerp(1, tw, Y) : lerp(1, bw, -Y);
  return target.set(X * w(u) * wf, y, u - L / 2);
}

/**
 * Flächenstück auf einer Oberfläche: point(u, phi) liefert Punkte, das Stück wird um lift entlang
 * der Flächennormale nach außen gesetzt (liegt also sauber auf der Karosserie bzw. dem Glas).
 * uv(s, t) -> [u, phi] beschreibt die Form (s quer, t längs, beide 0 … 1).
 */
export function surfacePatch(point, uv, { ns = 6, nt = 16, lift = 0.006, center = new THREE.Vector3(0, 0.75, 0) } = {}) {
  const pos = [];
  const idx = [];
  const a = new THREE.Vector3();
  const du = new THREE.Vector3();
  const dp = new THREE.Vector3();
  const nrm = new THREE.Vector3();
  const h = 1e-3;
  for (let j = 0; j <= nt; j++) {
    for (let i = 0; i <= ns; i++) {
      const [u, phi] = uv(i / ns, j / nt);
      point(u, phi, a);
      point(u + h, phi, du).sub(a);
      point(u, phi + h, dp).sub(a);
      nrm.crossVectors(du, dp);
      if (nrm.lengthSq() < 1e-14) nrm.set(a.x, a.y - center.y, a.z - center.z);
      nrm.normalize();
      // nach außen zeigen lassen
      if (nrm.x * a.x + nrm.y * (a.y - center.y) + nrm.z * (a.z - center.z) < 0) nrm.negate();
      pos.push(a.x + nrm.x * lift, a.y + nrm.y * lift, a.z + nrm.z * lift);
    }
  }
  for (let j = 0; j < nt; j++) {
    for (let i = 0; i < ns; i++) {
      const p0 = j * (ns + 1) + i;
      const p1 = p0 + 1;
      const p2 = p0 + ns + 1;
      const p3 = p2 + 1;
      idx.push(p0, p2, p1, p1, p2, p3);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  // Wicklung so drehen, dass die Normalen nach außen zeigen
  g.computeVertexNormals();
  const n0 = new THREE.Vector3().fromBufferAttribute(g.attributes.normal, Math.floor((ns + 1) * (nt + 1) / 2));
  const p0 = new THREE.Vector3().fromBufferAttribute(g.attributes.position, Math.floor((ns + 1) * (nt + 1) / 2));
  if (n0.x * p0.x + n0.y * (p0.y - center.y) + n0.z * (p0.z - center.z) < 0) {
    const arr = g.index.array;
    for (let k = 0; k < arr.length; k += 3) {
      const tmp = arr[k + 1];
      arr[k + 1] = arr[k + 2];
      arr[k + 2] = tmp;
    }
    g.computeVertexNormals();
  }
  const uvs = [];
  for (let j = 0; j <= nt; j++) for (let i = 0; i <= ns; i++) uvs.push(i / ns, j / nt);
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  return g;
}
export function loft({
  u0, u1, w, b, t, tw = 0.9, bw = 0.96, n = 4, segs = 80, ring = 28, L = 4.7, H = 1.5, caps = true,
  sampleEnds = 0.55, bx = null, capDome = 0,
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
    const bSec = b(u);
    const tSec = t(u);
    const ww = w(u);
    const tt = Math.max(tSec, bSec + 0.002);
    for (const [X, Y] of ringXY) {
      // bx: Radlauf-Ausschnitt je nach Querposition (nur außen); angehoben wird nur, was darunter liegt
      let y = bSec + ((Y + 1) / 2) * (tt - bSec);
      if (bx) y = Math.max(y, Math.min(bx(u, X, bSec), tt));
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
  // Deckel vorne/hinten mit eigenen Normalen: flach, oder mit capDome zum Rand hin wie gewölbt
  // (die Randnormalen neigen sich zur Flanke, so glänzt der Deckel wie eine runde Fläche)
  const nPos = Array.from(geo.attributes.position.array);
  const nNor = Array.from(geo.attributes.normal.array);
  const nUv = Array.from(geo.attributes.uv.array);
  const addCap = (sectionIndex, front) => {
    const base = nPos.length / 3;
    let cx = 0;
    let cy = 0;
    const z = nPos[sectionIndex * ring * 3 + 2];
    const az = front ? -1 : 1;
    for (let k = 0; k < ring; k++) {
      const j = (sectionIndex * ring + k) * 3;
      cx += nPos[j];
      cy += nPos[j + 1];
      nPos.push(nPos[j], nPos[j + 1], nPos[j + 2]);
      if (capDome > 0) {
        // Seitennormale ohne Längsanteil, mit der Deckelrichtung gemischt
        const sx = nNor[j];
        const sy = nNor[j + 1];
        const sl = Math.hypot(sx, sy) || 1;
        const nx = (sx / sl) * capDome;
        const ny = (sy / sl) * capDome;
        const nz = az * (1 - capDome * 0.55);
        const nl = Math.hypot(nx, ny, nz);
        nNor.push(nx / nl, ny / nl, nz / nl);
      } else nNor.push(0, 0, az);
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

/**
 * Umriss eines Außenspiegels im Stil des Model 3: außen groß gerundet, innen niedriger und straffer.
 * Glasseite zeigt nach +z. outer = −1: Außenseite liegt bei −x (linker Spiegel), +1: bei +x (rechter).
 */
export function mirrorShape(k = 1, outer = -1) {
  const X = (x) => (outer < 0 ? x : -x);
  const xo = -0.118 * k;
  const xi = 0.112 * k;
  const yto = 0.062 * k;
  const yti = 0.05 * k;
  const ybo = -0.058 * k;
  const ybi = -0.046 * k;
  const ro = 0.055 * k;
  const ri = 0.022 * k;
  const sh = new THREE.Shape();
  sh.moveTo(X(xo + ro), ybo);
  sh.lineTo(X(xi - ri), ybi);
  sh.quadraticCurveTo(X(xi), ybi, X(xi), ybi + ri);
  sh.lineTo(X(xi), yti - ri);
  sh.quadraticCurveTo(X(xi), yti, X(xi - ri), yti);
  sh.lineTo(X(xo + ro), yto);
  sh.quadraticCurveTo(X(xo), yto, X(xo), yto - ro);
  sh.lineTo(X(xo), ybo + ro);
  sh.quadraticCurveTo(X(xo), ybo, X(xo + ro), ybo);
  return sh;
}

/** Spiegelgehäuse: gerundete Schale nach vorne (−z), Vorderkante der Glasseite bei z = 0. */
export function mirrorHousingGeometry(outer = -1) {
  const g = new THREE.ExtrudeGeometry(mirrorShape(1, outer), {
    depth: 0.07, bevelEnabled: true, bevelThickness: 0.014, bevelSize: 0.011, bevelSegments: 4, curveSegments: 12,
  });
  g.translate(0, 0, -0.084);
  return g;
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
