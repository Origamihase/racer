// Zielbrunnen (Platzhalter): ein runder Sandsteinbrunnen mit Becken, Säule, Schale und Wasserstrahlen. Er steht auf
// der Insel des Brunnenplatzes (plan.js squareOf, roadkit.js islandInto), bis das Spiel über XxlWorld.makeFountain
// den Brunnen aus dem Baukasten der Orte einsetzt (gleiche Grundfläche: Radius r, Vorderseite +z zum haltenden Wagen).
// Die Geometrien werden je Größe einmal gebaut und von allen Brunnen geteilt (nie freigeben).
import * as THREE from 'three';
import { W } from '../../curve.js';
import { mulberry32 } from '../../util.js';

let mats = null;
function materials() {
  if (mats) return mats;
  mats = {
    stone: W.std({ color: 0xdcc9a3, roughness: 0.86, metalness: 0 }),
    plinth: W.std({ color: 0xb7a37f, roughness: 0.9, metalness: 0 }),
    water: W.std({ map: waterTexture(), roughness: 0.08, metalness: 0.05, envMapIntensity: 1.3, emissive: 0x0b2a3a, emissiveIntensity: 0.35 }),
    // Strahlen, Gischt und Ringwellen: Deckkraft je Ecke (Farbattribut mit Alpha), durchscheinend ohne Tiefenschreiben
    spray: W.std({ vertexColors: true, transparent: true, depthWrite: false, roughness: 0.05, metalness: 0, emissive: 0x9fd4ff, emissiveIntensity: 0.3 }),
  };
  return mats;
}

function waterTexture() {
  // Wasserfläche: zur Beckenwand hin dunkler (tiefer), in der Mitte heller, darüber ein weiches Lichtnetz wie die
  // Kringel, die die Sonne durch gekräuseltes Wasser auf den Grund wirft (Abstand der zwei nächsten Zellpunkte, mit
  // verbogenen Koordinaten, damit die Linien geschwungen statt gerade wie Fliesenfugen laufen)
  const S = 256;
  const c = document.createElement('canvas');
  c.width = S;
  c.height = S;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, '#72bcd8');
  g.addColorStop(0.72, '#509ec2');
  g.addColorStop(1, '#3a80a4');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  const rnd = mulberry32(11);
  const pts = [];
  for (let i = 0; i < 46; i++) pts.push([rnd() * S, rnd() * S]);
  const img = ctx.getImageData(0, 0, S, S);
  const d = img.data;
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const wx = x + 7 * Math.sin(y * 0.071 + 1.3) + 3.5 * Math.sin((x + y) * 0.13);
      const wy = y + 7 * Math.sin(x * 0.063 + 0.4) + 3.5 * Math.sin((x - y) * 0.11);
      let d1 = Infinity;
      let d2 = Infinity;
      for (const [px, py] of pts) {
        const q = (wx - px) * (wx - px) + (wy - py) * (wy - py);
        if (q < d1) {
          d2 = d1;
          d1 = q;
        } else if (q < d2) d2 = q;
      }
      const e = Math.max(0, 1 - (Math.sqrt(d2) - Math.sqrt(d1)) / 3.6);
      const a = 0.16 * e * e;
      const i = (y * S + x) * 4;
      d[i] += (255 - d[i]) * a;
      d[i + 1] += (255 - d[i + 1]) * a;
      d[i + 2] += (255 - d[i + 2]) * a;
    }
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

const geos = new Map();
const lathe = (pts, seg = 48) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg);

/** Puffer für die durchscheinenden Wasserteile: Position, Normale und bläulich weiße Farbe mit Deckkraft. */
class Spray {
  constructor() {
    this.pos = [];
    this.nrm = [];
    this.col = [];
    this.idx = [];
  }
  vert(x, y, z, nx, ny, nz, a) {
    this.pos.push(x, y, z);
    this.nrm.push(nx, ny, nz);
    this.col.push(0.86, 0.95, 1, a);
    return this.pos.length / 3 - 1;
  }
  /** Dreieck mit der Vorderseite zur Seite der Eckennormalen (Umlaufsinn nach Bedarf getauscht). */
  tri(a, b, c) {
    const P = this.pos;
    const N = this.nrm;
    const ux = P[b * 3] - P[a * 3];
    const uy = P[b * 3 + 1] - P[a * 3 + 1];
    const uz = P[b * 3 + 2] - P[a * 3 + 2];
    const vx = P[c * 3] - P[a * 3];
    const vy = P[c * 3 + 1] - P[a * 3 + 1];
    const vz = P[c * 3 + 2] - P[a * 3 + 2];
    const n = (uy * vz - uz * vy) * (N[a * 3] + N[b * 3] + N[c * 3]) + (uz * vx - ux * vz) * (N[a * 3 + 1] + N[b * 3 + 1] + N[c * 3 + 1]) +
      (ux * vy - uy * vx) * (N[a * 3 + 2] + N[b * 3 + 2] + N[c * 3 + 2]);
    if (n >= 0) this.idx.push(a, b, c);
    else this.idx.push(a, c, b);
  }
  build() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nrm, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 4));
    g.setIndex(this.idx);
    return g;
  }
}

/**
 * Wasserstrahl als Parabel von a (Düse, im Stein verborgen) über den Kontrollpunkt h über a nach b (Auftreffpunkt,
 * unter dem Wasserspiegel): rund, zum Ende dünner (r0 → r1) und durchsichtiger. Offene Enden liegen verdeckt.
 */
function jetInto(sp, a, b, h, r0, r1) {
  const curve = new THREE.QuadraticBezierCurve3(a, new THREE.Vector3((a.x + b.x) / 2, a.y + h, (a.z + b.z) / 2), b);
  const side = new THREE.Vector3(a.z - b.z, 0, b.x - a.x).normalize(); // waagrecht, senkrecht zur Ebene des Bogens
  const P = new THREE.Vector3();
  const T = new THREE.Vector3();
  const Q = new THREE.Vector3();
  const N = 16;
  const K = 6;
  const rows = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    curve.getPoint(t, P);
    curve.getTangent(t, T);
    Q.crossVectors(side, T).normalize();
    const r = r0 + (r1 - r0) * t;
    const row = [];
    for (let k = 0; k < K; k++) {
      const f = (k / K) * Math.PI * 2;
      const nx = Math.cos(f) * Q.x + Math.sin(f) * side.x;
      const ny = Math.cos(f) * Q.y + Math.sin(f) * side.y;
      const nz = Math.cos(f) * Q.z + Math.sin(f) * side.z;
      row.push(sp.vert(P.x + r * nx, P.y + r * ny, P.z + r * nz, nx, ny, nz, 0.8 - 0.42 * t));
    }
    rows.push(row);
  }
  for (let i = 0; i < N; i++) {
    for (let k = 0; k < K; k++) {
      const k1 = (k + 1) % K;
      sp.tri(rows[i][k], rows[i][k1], rows[i + 1][k1]);
      sp.tri(rows[i][k], rows[i + 1][k1], rows[i + 1][k]);
    }
  }
}

/**
 * Flache Ringe um (x, y, z) nach oben: Radien rs mit Deckkraft as (rs[0] = 0 ergibt eine Scheibe). Gischt und
 * Ringwellen, wo ein Strahl auftrifft; sie schweben 6–12 mm über dem Wasserspiegel (kein Flimmern bis weit über
 * die Entfernung der Platzkameras).
 */
function ringsInto(sp, x, y, z, rs, as, seg = 20) {
  const rings = rs.map((r, j) => {
    const n = r === 0 ? 1 : seg;
    const ids = [];
    for (let k = 0; k < n; k++) {
      const f = (k / seg) * Math.PI * 2;
      ids.push(sp.vert(x + r * Math.cos(f), y, z + r * Math.sin(f), 0, 1, 0, as[j]));
    }
    return ids;
  });
  for (let j = 0; j < rings.length - 1; j++) {
    const A = rings[j];
    const B = rings[j + 1];
    for (let k = 0; k < seg; k++) {
      const k1 = (k + 1) % seg;
      if (A.length === 1) sp.tri(A[0], B[k], B[k1]);
      else {
        sp.tri(A[k], B[k], B[k1]);
        sp.tri(A[k], B[k1], A[k1]);
      }
    }
  }
}

function build(R) {
  // Becken: Sockel, Wand mit gerundetem Rand, innen bis unter den Wasserspiegel
  // (Profil von außen unten nach innen: so zeigen die Flächen nach außen bzw. oben bzw. zur Mitte)
  const basin = lathe([
    [R + 0.12, 0], [R + 0.12, 0.1], [R + 0.1, 0.14], [R + 0.03, 0.14], [R, 0.16], [R, 0.48], [R - 0.02, 0.53],
    [R - 0.07, 0.56], [R - 0.24, 0.56], [R - 0.31, 0.53], [R - 0.35, 0.47], [R - 0.36, 0.3],
  ]);
  const water = new THREE.CircleGeometry(R - 0.34, 48);
  water.rotateX(-Math.PI / 2);
  water.translate(0, 0.44, 0);
  // Säule mit Schale und Aufsatz
  const column = lathe([
    [0.001, 0.3], [0.42, 0.3], [0.42, 0.5], [0.34, 0.56], [0.24, 0.66], [0.2, 0.8], [0.19, 1.2], [0.23, 1.27],
    [0.27, 1.33], [0.2, 1.4], [0.3, 1.44], [0.62, 1.53], [0.92, 1.64], [1.04, 1.72], [1.06, 1.78], [1.0, 1.8],
    [0.92, 1.74], [0.001, 1.7],
  ], 40);
  const bowlWater = new THREE.CircleGeometry(0.93, 40);
  bowlWater.rotateX(-Math.PI / 2);
  bowlWater.translate(0, 1.74, 0);
  const top = lathe([
    [0.001, 1.7], [0.13, 1.7], [0.11, 1.84], [0.1, 1.98], [0.15, 2.04], [0.17, 2.1], [0.12, 2.16], [0.09, 2.2],
    [0.11, 2.27], [0.12, 2.34], [0.08, 2.42], [0.001, 2.45],
  ], 32);
  // Wasser: acht Bögen vom Schalenrand ins Becken, vier vom Aufsatz in die Schale, je mit Gischt und zwei Ringwellen.
  // Die Auftreffpunkte liegen so, dass die äußere Ringwelle auf dem Wasser bleibt (Becken r − 0,34, Schale 0,93).
  const sp = new Spray();
  const land = Math.min(R - 0.97, 1.8);
  for (let k = 0; k < 8; k++) {
    const a = ((k + 0.5) / 8) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    jetInto(sp, new THREE.Vector3(c * 0.99, 1.75, s * 0.99), new THREE.Vector3(c * land, 0.4, s * land), 0.2, 0.024, 0.015);
    ringsInto(sp, c * land, 0.452, s * land, [0, 0.09, 0.19], [0.7, 0.5, 0]);
    ringsInto(sp, c * land, 0.448, s * land, [0.25, 0.3, 0.36], [0, 0.26, 0], 28);
    ringsInto(sp, c * land, 0.446, s * land, [0.47, 0.52, 0.58], [0, 0.13, 0], 32);
  }
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    jetInto(sp, new THREE.Vector3(c * 0.06, 2.3, s * 0.06), new THREE.Vector3(c * 0.6, 1.72, s * 0.6), 0.24, 0.016, 0.011);
    ringsInto(sp, c * 0.6, 1.752, s * 0.6, [0, 0.05, 0.1], [0.7, 0.5, 0], 16);
    ringsInto(sp, c * 0.6, 1.748, s * 0.6, [0.13, 0.16, 0.2], [0, 0.26, 0], 20);
  }
  return { basin, water, column, bowlWater, top, spray: sp.build() };
}

/**
 * Platzhalter-Brunnen für den Brunnenplatz. opts: {r: verfügbarer Radius auf der Insel, place, seed, heading}.
 * Ergebnis: Group (Ursprung Mitte am Boden der Insel, Vorderseite +z) mit userData.info = {title, r, h, cam} wie die
 * Brunnen des Baukastens (cam: Nahaufnahme aus 2–4 m in 1,2 m Höhe, Koordinaten des Brunnens).
 */
export function placeholderFountain(opts = {}) {
  const R = Math.max(2.2, Math.min(7.5, Math.round((opts.r || 3.4) * 10) / 10));
  let g = geos.get(R);
  if (!g) geos.set(R, (g = build(R)));
  const M = materials();
  const group = new THREE.Group();
  group.name = 'Zielbrunnen';
  const add = (geo, mat, cast = true, receive = true) => {
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = cast;
    m.receiveShadow = receive;
    m.frustumCulled = false;
    group.add(m);
  };
  add(g.basin, M.stone);
  add(g.water, M.water, false);
  add(g.column, M.stone);
  add(g.bowlWater, M.water, false);
  add(g.top, M.plinth);
  add(g.spray, M.spray, false, false);
  group.userData.info = { title: 'Zielbrunnen', r: R + 0.12, h: 2.45, cam: { pos: [1.3, 1.2, R + 2.3], look: [0, 1.05, 0] } };
  return group;
}
