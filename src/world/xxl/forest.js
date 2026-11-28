// Bewuchs der XXL-Welt: Wald an den Waldstücken (trip.curtains) und im Keil hinter einer Ausfahrt, sonst Baumreihen,
// Büsche und Wiesen, im Ort einfache Häuser als Platzhalter für den Stadtbaukasten. Alles sind Instanzen der Bäume
// aus scenery.js (so werden sie mit der Kunst dort automatisch schöner) und ein paar eigener Kleinigkeiten:
// Farn, ein Reh, ein Hochsitz, eine Bank.
//
// Ein Straßenstück plant seine Pflanzen einmal (planProps, deterministisch aus seinem Samen), die Rahmenansicht
// sammelt die Pläne aller ihrer Stücke in je einem InstancedMesh pro Art (PropSet): wenige Zeichenaufrufe.
import * as THREE from 'three';
import { FAR_LAYER } from '../farshadow.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { W } from '../../curve.js';
import { colorize } from '../../models/loft.js';
import { coniferGeo, decidGeo, bushGeo } from '../scenery.js';
import { PAL } from '../kit/palette.js';
import { GeoBuf, boxInto } from './roadkit.js';
import { mulberry32 } from '../../util.js';
import { ROW, RowCull, cullByRows } from '../rowcull.js';

export const TYPES = ['conifer', 'decid', 'bush', 'fern', 'house', 'roof', 'deer', 'hide', 'bench', 'win0', 'win1', 'win2', 'win3', 'gable'];
const T = Object.fromEntries(TYPES.map((t, i) => [t, i]));
export { T as PROP };

// --- eigene kleine Geometrien ------------------------------------------------------------------------------------
function part(geo, hex, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  const g = geo.index ? geo.toNonIndexed() : geo;
  g.rotateX(rx);
  g.rotateY(ry);
  g.rotateZ(rz);
  g.translate(x, y, z);
  g.deleteAttribute('uv');
  return colorize(g, hex);
}
function fernGeo() {
  // Wedel aus flachen, gebogenen Blättern rund um die Mitte
  const parts = [];
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    const leaf = new THREE.ConeGeometry(0.16, 1.05, 4, 1);
    leaf.scale(1, 1, 0.35);
    parts.push(part(leaf, i % 2 ? 0x4f8f3a : 0x5fa046, Math.sin(a) * 0.38, 0.38, Math.cos(a) * 0.38, 0, a, 0));
  }
  const g = mergeGeometries(parts);
  // die Blätter neigen sich nach außen
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const z = p.getZ(i);
    const r = Math.hypot(x, z);
    p.setY(i, Math.max(0, p.getY(i) - r * r * 0.35));
  }
  g.computeVertexNormals();
  return g;
}
function deerGeo() {
  // ein Reh, rundlich und freundlich (schaut zur Straße: Kopf nach +x)
  const fur = 0xa86a3c;
  const light = 0xe9d2b0;
  const dark = 0x3a2a20;
  const parts = [];
  const body = new THREE.SphereGeometry(0.42, 10, 8);
  body.scale(1.45, 0.82, 0.8);
  parts.push(part(body, fur, 0, 0.98, 0));
  const tail = new THREE.SphereGeometry(0.11, 6, 5);
  parts.push(part(tail, light, -0.6, 1.08, 0));
  for (const [x, z] of [[0.38, 0.17], [0.38, -0.17], [-0.4, 0.17], [-0.4, -0.17]]) {
    const leg = new THREE.CylinderGeometry(0.045, 0.035, 0.78, 6);
    parts.push(part(leg, fur, x, 0.39, z));
    const hoof = new THREE.CylinderGeometry(0.04, 0.045, 0.06, 6);
    parts.push(part(hoof, dark, x, 0.03, z));
  }
  const neck = new THREE.CylinderGeometry(0.11, 0.15, 0.55, 8);
  parts.push(part(neck, fur, 0.55, 1.32, 0, 0, 0, -0.45));
  const head = new THREE.SphereGeometry(0.19, 10, 8);
  head.scale(1.25, 0.95, 0.9);
  parts.push(part(head, fur, 0.78, 1.6, 0));
  const snout = new THREE.SphereGeometry(0.085, 8, 6);
  parts.push(part(snout, dark, 0.99, 1.56, 0));
  for (const z of [0.1, -0.1]) {
    const ear = new THREE.ConeGeometry(0.07, 0.22, 6);
    parts.push(part(ear, fur, 0.7, 1.8, z, z * 3, 0, 0.3));
    const eye = new THREE.SphereGeometry(0.03, 6, 5);
    parts.push(part(eye, dark, 0.9, 1.65, z * 0.95));
  }
  const spot = new THREE.SphereGeometry(0.2, 8, 6);
  spot.scale(1, 0.5, 1.4);
  parts.push(part(spot, light, 0.02, 0.72, 0));
  return mergeGeometries(parts);
}
function hideGeo() {
  // Hochsitz: vier schräge Stämme, Leiter, Kanzel mit Dach (Holz in warmen Tönen)
  const wood = 0x8a5a3c;
  const woodLight = 0xa8774f;
  const roof = 0x5e4636;
  const parts = [];
  for (const [x, z] of [[-0.9, -0.9], [0.9, -0.9], [-0.9, 0.9], [0.9, 0.9]]) {
    const post = new THREE.CylinderGeometry(0.08, 0.1, 4.2, 6);
    parts.push(part(post, wood, x * 0.92, 2.1, z * 0.92, z * -0.06, 0, x * 0.06));
  }
  const floor = new THREE.BoxGeometry(1.7, 0.1, 1.7);
  parts.push(part(floor, woodLight, 0, 3.4, 0));
  for (const [x, z, w, d] of [[0, 0.82, 1.7, 0.06], [0, -0.82, 1.7, 0.06], [-0.82, 0, 0.06, 1.7]]) {
    const wall = new THREE.BoxGeometry(w, 0.9, d);
    parts.push(part(wall, woodLight, x, 3.9, z));
  }
  const front = new THREE.BoxGeometry(0.06, 0.45, 1.7);
  parts.push(part(front, woodLight, 0.82, 3.68, 0));
  const top = new THREE.BoxGeometry(2.0, 0.08, 2.0);
  parts.push(part(top, roof, 0, 4.75, 0, 0, 0, 0.12));
  for (const [x, z] of [[0.82, 0.82], [0.82, -0.82], [-0.82, 0.82], [-0.82, -0.82]]) {
    const pole = new THREE.BoxGeometry(0.06, 1.3, 0.06);
    parts.push(part(pole, wood, x, 4.1, z));
  }
  for (const z of [-0.3, 0.3]) {
    const rail = new THREE.BoxGeometry(0.06, 3.7, 0.06);
    parts.push(part(rail, wood, 1.45, 1.75, z, 0, 0, 0.3));
  }
  // Sprossen an den schrägen Holmen (um 0,3 rad zur Kanzel geneigt, Drehpunkt in halber Höhe)
  for (let i = 0; i < 7; i++) {
    const rung = new THREE.BoxGeometry(0.05, 0.05, 0.62);
    const y = 0.35 + i * 0.47;
    parts.push(part(rung, wood, 1.45 + (1.75 - y) * Math.tan(0.3), y, 0));
  }
  return mergeGeometries(parts);
}
function benchGeo() {
  const wood = 0xb07a4a;
  const iron = 0x4a4f57;
  const parts = [];
  for (const z of [-0.12, 0.05, 0.22]) parts.push(part(new THREE.BoxGeometry(1.6, 0.05, 0.13), wood, 0, 0.45, z));
  for (const y of [0.62, 0.78]) parts.push(part(new THREE.BoxGeometry(1.6, 0.11, 0.04), wood, 0, y, 0.32, -0.15, 0, 0));
  for (const x of [-0.68, 0.68]) {
    parts.push(part(new THREE.BoxGeometry(0.06, 0.45, 0.5), iron, x, 0.225, 0.05));
    parts.push(part(new THREE.BoxGeometry(0.06, 0.45, 0.05), iron, x, 0.66, 0.33, -0.15, 0, 0));
  }
  return mergeGeometries(parts);
}

// --- Häuser im Ort (Platzhalter für den Stadtbaukasten) ------------------------------------------------------------
// Vier Hausformen mit festen Maßen: Körper (Einheitswürfel, Wandfarbe je Haus) und Dach (Einheitsdach, Dachfarbe)
// sind skaliert, Fenster, Türen, Sockel und Fensterbänke je Form eine eigene Geometrie (ungefärbt). Die Schauseite
// liegt bei +x (zur Straße), die Länge entlang der Straße bei z.
export const HOUSES = [
  { w: 8.0, d: 8.0, h: 5.8, floors: 2, cols: 3, door: 1, shop: false },
  { w: 10.5, d: 9.0, h: 6.0, floors: 2, cols: 4, door: 1, shop: false },
  { w: 7.0, d: 8.5, h: 8.6, floors: 3, cols: 2, door: 0, shop: false },
  { w: 12.5, d: 10.0, h: 6.2, floors: 2, cols: 5, door: 4, shop: true },
];
// Der Körper ist ein schlichter Würfel (Fuß bei y = 0) und nicht das Dorfhaus aus scenery.js: das bringt eigene
// Fenster, Tür, Giebel und Schornstein mit, die sich mit denen hier doppelten und gestreckt aus dem Dach ragten.
function wallGeo() {
  const g = new THREE.BoxGeometry(1, 1, 1);
  g.translate(0, 0.5, 0);
  return colorize(g, 0xffffff);
}
const C3 = (hex) => new THREE.Color(hex);
const HC = {
  frame: C3(0xf4f1ea), glass: C3(0x34495c), glass2: C3(0x4d6479), sill: C3(0xbdb5a6), door: C3(0x7c4a2c),
  plinth: C3(0x9a9388), awning: C3(0xb84a3c), awning2: C3(0xf2e6cf), step: C3(0xa8a196),
};
/**
 * Markise über dem Schaufenster (Wand bei x = x0, Mitte zc, Länge len): schräges Tuch in roten und cremefarbenen
 * Bahnen von der Wand (2,95 m) 1,1 m hinaus und hinab auf 2,5 m, vorn ein Volant mit runden Zungen, seitlich
 * geschlossen. Von der Seite ein Keil, nicht ein schwebender Strich.
 */
function awningInto(buf, x0, zc, len) {
  const out = 1.1;
  const yTop = 2.95;
  const yLow = 2.5;
  const th = 0.03;
  const n = Math.max(4, Math.round(len / 0.45));
  const L = Math.hypot(out, yTop - yLow);
  const up = [(yTop - yLow) / L, out / L, 0]; // Normale der Tuchoberseite (nach oben und außen)
  const shade = (c, k) => [c.r * k, c.g * k, c.b * k];
  const face = (pts, nrm, col) => {
    const ids = pts.map(([x, y, z]) => {
      const i = buf.vert(x, y, z, nrm[0], nrm[1], nrm[2]);
      buf.color(col[0], col[1], col[2]);
      return i;
    });
    for (let i = 1; i < ids.length - 1; i++) upTri3(buf, ids[0], ids[i], ids[i + 1], nrm);
  };
  const z0 = zc - len / 2;
  const xf = x0 + out;
  for (let i = 0; i < n; i++) {
    const a = z0 + (i * len) / n;
    const b = z0 + ((i + 1) * len) / n;
    const c = i % 2 ? HC.awning2 : HC.awning;
    const top = shade(c, 1);
    face([[x0, yTop, a], [x0, yTop, b], [xf, yLow, b], [xf, yLow, a]], up, top);
    face([[x0, yTop - th, a], [x0, yTop - th, b], [xf, yLow - th, b], [xf, yLow - th, a]], [-up[0], -up[1], 0], shade(c, 0.82));
    // Volant: Zunge mit rundem Ende, vorn und hinten
    const m = (a + b) / 2;
    const w = (b - a) / 2;
    const tongue = [[xf, yLow, a], [xf, yLow, b], [xf, yLow - 0.15, b], [xf, yLow - 0.215, m + w * 0.55], [xf, yLow - 0.235, m], [xf, yLow - 0.215, m - w * 0.55], [xf, yLow - 0.15, a]];
    face(tongue.map(([x, y, z]) => [x + 0.012, y, z]), [1, 0, 0], top);
    face(tongue.map(([x, y, z]) => [x - 0.012, y, z]), [-1, 0, 0], shade(c, 0.82));
  }
  // Seitenteile (Dreiecke von der Wand bis zur Vorderkante), beidseitig sichtbar
  for (const [z, sz] of [[z0, -1], [z0 + len, 1]]) {
    const tri = [[x0, yTop, z], [xf, yLow, z], [x0, yLow - 0.15, z]];
    face(tri.map(([x, y, zz]) => [x, y, zz + sz * 0.006]), [0, 0, sz], shade(HC.awning, 0.95));
    face(tri.map(([x, y, zz]) => [x, y, zz - sz * 0.006]), [0, 0, -sz], shade(HC.awning, 0.8));
  }
}
function windowsGeo(v) {
  const buf = new GeoBuf({ color: true, uv: false });
  const rnd = mulberry32(Math.round(v.w * 130 + v.h * 10));
  const fh = v.h / v.floors;
  // Fenster in der Fläche mit Normale n (±1) quer zu x (Schauseite und Rückseite) bzw. z (Giebelseiten)
  const win = (face, n, u, y, ww, hh, sill = true) => {
    // face 'x': Fläche bei x = n·d/2, u entlang z · face 'z': Fläche bei z = n·w/2, u entlang x
    const box = (du, dy, dn, hu, hy, hn, col) => {
      if (face === 'x') boxInto(buf, n * (v.d / 2 + dn), y + dy, u + du, hn, hy, hu, col);
      else boxInto(buf, u + du, y + dy, n * (v.w / 2 + dn), hu, hy, hn, col);
    };
    const g = rnd() < 0.3 ? HC.glass2 : HC.glass;
    box(0, 0, 0.012, ww / 2, hh / 2, 0.012, g);
    const t = 0.07; // Rahmenbreite
    box(0, hh / 2 + t / 2, 0.04, ww / 2 + t, t / 2, 0.04, HC.frame);
    box(0, -hh / 2 - t / 2, 0.04, ww / 2 + t, t / 2, 0.04, HC.frame);
    box(-ww / 2 - t / 2, 0, 0.04, t / 2, hh / 2, 0.04, HC.frame);
    box(ww / 2 + t / 2, 0, 0.04, t / 2, hh / 2, 0.04, HC.frame);
    box(0, 0.1, 0.035, 0.025, hh / 2, 0.035, HC.frame); // Mittelpfosten
    if (sill) box(0, -hh / 2 - t - 0.04, 0.09, ww / 2 + 0.12, 0.04, 0.09, HC.sill);
  };
  // Schauseite (+x): Fenster je Geschoss, unten Tür bzw. Schaufenster; Rückseite (−x) ohne Tür
  for (const n of [1, -1]) {
    for (let f = 0; f < v.floors; f++) {
      for (let i = 0; i < v.cols; i++) {
        const z = -v.w / 2 + ((i + 0.5) * v.w) / v.cols;
        const y = f * fh + fh * 0.52 + (f === 0 ? 0.2 : 0);
        if (n > 0 && f === 0 && i === v.door) {
          // Haustür mit Rahmen, Oberlicht und Stufe
          const dz = z;
          boxInto(buf, v.d / 2 + 0.015, 1.1, dz, 0.015, 1.1, 0.55, HC.door);
          for (const [yy, hy, hz, zz] of [[2.27, 0.07, 0.69, 0], [1.1, 1.1, 0.07, -0.62], [1.1, 1.1, 0.07, 0.62]]) boxInto(buf, v.d / 2 + 0.04, yy, dz + zz, 0.04, hy, hz, HC.frame);
          boxInto(buf, v.d / 2 + 0.35, 0.09, dz, 0.35, 0.09, 0.85, HC.step);
          continue;
        }
        if (n > 0 && f === 0 && v.shop && i < 2) {
          if (i === 1) continue;
          // Schaufenster über zwei Achsen mit Markise
          const zc = -v.w / 2 + (1 * v.w) / v.cols;
          win('x', 1, zc, 1.45, (2 * v.w) / v.cols - 0.8, 1.9, false);
          awningInto(buf, v.d / 2, zc, (2 * v.w) / v.cols - 0.4);
          continue;
        }
        win('x', n, z, y, 1.15, 1.35);
      }
    }
  }
  // Giebelseiten: je Geschoss ein Fenster in der Mitte
  for (const n of [1, -1]) for (let f = 0; f < v.floors; f++) win('z', n, 0, f * fh + fh * 0.52 + (f === 0 ? 0.2 : 0), 1.0, 1.3);
  // Sockel ringsum
  boxInto(buf, 0, 0.22, 0, v.d / 2 + 0.035, 0.22, v.w / 2 + 0.035, HC.plinth);
  const g = buf.build();
  g.deleteAttribute('uv');
  return g;
}

// Satteldach der Ortshäuser als Einheit (skaliert mit Haustiefe × Dachhöhe × Hauslänge, Fuß auf der Traufhöhe y = 0,
// First bei y = 1): zwei Dachplatten mit Dicke, die über Traufe und Giebel hinausragen, mit Stirnbrett und Ortgang.
// Die Unterseite der Platten geht genau durch Traufkante und Giebelspitze, die Oberseite liegt um die Dicke darüber:
// keine Wandkante berührt die Dachfläche (sonst blitzt sie dort als helle Punktlinie durch). Untersicht und
// Giebeldreieck (bündig mit der Wand) gehören zur Wand (gableGeo, Wandfarbe): von keiner Seite schwebt ein Dachteil
// frei, und die Untersicht ist hell gestrichen statt ein schwarzer Keil im Schatten.
const ROOF = { ex: 0.07, ez: 0.035, t: 0.05 }; // Überstand an der Traufe (× Tiefe) und am Giebel (× Länge), Dicke (× Höhe)
const roofXe = 0.5 + ROOF.ex;
const roofYe = -2 * ROOF.ex; // die Dachfläche y = 1 − 2|x| über die Traufe hinaus verlängert
const roofZ = 0.5 + ROOF.ez;
const roofL = Math.hypot(2, 1);
function quadFace(buf, pts, n, k) {
  const ids = pts.map(([x, y, z]) => {
    const i = buf.vert(x, y, z, n[0], n[1], n[2]);
    buf.color(k, k, k);
    return i;
  });
  for (let i = 1; i < ids.length - 1; i++) upTri3(buf, ids[0], ids[i], ids[i + 1], n);
}
function townRoofGeo() {
  const buf = new GeoBuf({ color: true, uv: false });
  const { t } = ROOF;
  const [xe, ye, Z] = [roofXe, roofYe, roofZ];
  for (const sx of [1, -1]) {
    // Oberseite und Stirnbrett an der Traufe
    quadFace(buf, [[0, 1 + t, -Z], [0, 1 + t, Z], [sx * xe, ye + t, Z], [sx * xe, ye + t, -Z]], [(sx * 2) / roofL, 1 / roofL, 0], 1);
    quadFace(buf, [[sx * xe, ye + t, -Z], [sx * xe, ye + t, Z], [sx * xe, ye, Z], [sx * xe, ye, -Z]], [sx, 0, 0], 0.8);
    // Ortgang: Stirnseiten der Platten an den Giebeln
    for (const sz of [1, -1]) quadFace(buf, [[0, 1 + t, sz * Z], [sx * xe, ye + t, sz * Z], [sx * xe, ye, sz * Z], [0, 1, sz * Z]], [0, 0, sz], 0.8);
  }
  return buf.build();
}
function gableGeo() {
  const buf = new GeoBuf({ color: true, uv: false });
  for (const sz of [1, -1]) {
    const ids = [[-0.5, 0], [0.5, 0], [0, 1]].map(([x, y]) => {
      const i = buf.vert(x, y, sz * 0.5, 0, 0, sz);
      buf.color(1, 1, 1);
      return i;
    });
    upTri3(buf, ids[0], ids[1], ids[2], [0, 0, sz]);
  }
  // Untersicht der Dachplatten
  for (const sx of [1, -1]) quadFace(buf, [[0, 1, -roofZ], [0, 1, roofZ], [sx * roofXe, roofYe, roofZ], [sx * roofXe, roofYe, -roofZ]], [(-sx * 2) / roofL, -1 / roofL, 0], 0.9);
  return buf.build();
}
/** Dreieck mit der Vorderseite in Richtung n (Umlaufsinn nach Bedarf getauscht). */
function upTri3(buf, a, b, c, n) {
  const P = buf.pos;
  const ux = P[b * 3] - P[a * 3];
  const uy = P[b * 3 + 1] - P[a * 3 + 1];
  const uz = P[b * 3 + 2] - P[a * 3 + 2];
  const vx = P[c * 3] - P[a * 3];
  const vy = P[c * 3 + 1] - P[a * 3 + 1];
  const vz = P[c * 3 + 2] - P[a * 3 + 2];
  const d = (uy * vz - uz * vy) * n[0] + (uz * vx - ux * vz) * n[1] + (ux * vy - uy * vx) * n[2];
  if (d >= 0) buf.tri(a, b, c);
  else buf.tri(a, c, b);
}

let shared = null;
function sharedGeo() {
  if (shared) return shared;
  const mat = W.lambert({ vertexColors: true });
  const walls = W.lambert({ vertexColors: true });
  shared = {
    geo: [coniferGeo(), decidGeo(), bushGeo(), fernGeo(), wallGeo(), townRoofGeo(), deerGeo(), hideGeo(), benchGeo(), ...HOUSES.map(windowsGeo), gableGeo()],
    mat: TYPES.map((t) => (t === 'house' || t === 'gable' ? walls : t === 'roof' ? W.lambert({ vertexColors: true }) : mat)),
    shadow: TYPES.map((t) => t !== 'fern' && !t.startsWith('win')),
  };
  // Hüllkugel jeder Form (für die Reihen, siehe PropSet.fill)
  shared.ball = shared.geo.map((g) => {
    g.computeBoundingSphere();
    return g.boundingSphere;
  });
  return shared;
}

/** Plan der Pflanzen und Dinge eines Stücks: flache Zahlenliste, je Eintrag STRIDE Werte. */
export const STRIDE = 9; // Art, x, y, s, Breite, Höhe, Tiefe, Drehung, Farbe (0xRRGGBB)
export function addProp(out, type, x, s, sx, sy, sz, rot, color, y = 0) {
  out.push(type, x, y, s, sx, sy, sz, rot, color);
}

/**
 * Instanzen aller Stücke eines Rahmens, je Art ein InstancedMesh. Die Instanzen liegen in Reihen entlang der Straße
 * (rowcull.js): So zeichnen Rückspiegel, Schattenkarte und Seitenfenster nur, was bei ihnen überhaupt vorkommen kann.
 */
export class PropSet {
  constructor(parent) {
    this.group = new THREE.Group();
    this.group.name = 'XXL-Bewuchs';
    parent.add(this.group);
    this.meshes = new Array(TYPES.length).fill(null);
    this.cull = new RowCull();
  }

  /** lists: Pläne (siehe addProp); sRef: Bezugspunkt (die Instanzen stehen relativ dazu, kleine Zahlen). */
  fill(lists, sRef) {
    const S = sharedGeo();
    const counts = new Array(TYPES.length).fill(0);
    // Reihen: ROW Meter Strecke je Reihe, die erste dort, wo das hinterste Stück beginnt
    let row0 = Infinity;
    let row1 = -Infinity;
    for (const L of lists) {
      for (let i = 0; i < L.length; i += STRIDE) {
        counts[L[i]]++;
        const row = Math.floor(L[i + 3] / ROW);
        if (row < row0) row0 = row;
        if (row > row1) row1 = row;
      }
    }
    const rows = row1 >= row0 ? row1 - row0 + 1 : 0;
    this.cull.reset(rows);
    for (let t = 0; t < TYPES.length; t++) {
      let m = this.meshes[t];
      if (m && m.instanceMatrix.count < counts[t]) {
        this.group.remove(m);
        m.dispose();
        m = this.meshes[t] = null;
      }
      if (!m && counts[t] > 0) {
        let cap = 64;
        while (cap < counts[t]) cap *= 2;
        m = this.meshes[t] = cullByRows(new THREE.InstancedMesh(S.geo[t], S.mat[t], cap), this.cull);
        m.frustumCulled = false;
        m.castShadow = S.shadow[t];
        if (S.shadow[t]) m.layers.enable(FAR_LAYER);
        m.receiveShadow = true;
        m.name = 'XXL-' + TYPES[t];
        m.setColorAt(0, _c.setRGB(1, 1, 1));
        this.group.add(m);
      }
      if (!m) continue;
      m.count = m.userData.rowTotal = counts[t];
      // erste Instanz jeder Reihe: zuerst zählen (um eins versetzt), dann aufsummieren
      m.userData.rowStart = new Uint32Array(rows + 1);
    }
    for (const L of lists) for (let i = 0; i < L.length; i += STRIDE) this.meshes[L[i]].userData.rowStart[Math.floor(L[i + 3] / ROW) - row0 + 1]++;
    const next = this.meshes.map((m) => {
      if (!m) return null;
      const st = m.userData.rowStart;
      for (let r = 1; r <= rows; r++) st[r] += st[r - 1];
      return st.slice(0, rows);
    });
    this.group.position.z = -sRef;
    for (const L of lists) {
      for (let i = 0; i < L.length; i += STRIDE) {
        const t = L[i];
        const m = this.meshes[t];
        const row = Math.floor(L[i + 3] / ROW) - row0;
        const at = next[t][row]++;
        _p.set(L[i + 1], L[i + 2], -(L[i + 3] - sRef));
        _q.setFromAxisAngle(_y, L[i + 7]);
        _s.set(L[i + 4], L[i + 5], L[i + 6]);
        _m.compose(_p, _q, _s);
        m.setMatrixAt(at, _m);
        m.setColorAt(at, _c.setHex(L[i + 8]));
        // Hülle der Reihe: die Kugel der Form, mit der Instanz gedreht, verschoben und um ihr größtes Maß gestreckt
        const ball = S.ball[t];
        _v.copy(ball.center).applyMatrix4(_m);
        this.cull.add(row, _v.x, _v.y, _v.z, ball.radius * Math.max(Math.abs(L[i + 4]), Math.abs(L[i + 5]), Math.abs(L[i + 6])));
      }
    }
    for (const m of this.meshes) {
      if (!m) continue;
      m.instanceMatrix.needsUpdate = true;
      if (m.instanceColor) m.instanceColor.needsUpdate = true;
    }
  }
}
const _p = new THREE.Vector3();
const _v = new THREE.Vector3();
const _s = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _y = new THREE.Vector3(0, 1, 0);
const _m = new THREE.Matrix4();
const _c = new THREE.Color();

// --- Planung ---------------------------------------------------------------------------------------------------
const TINT = [0xffffff, 0xe6f4dc, 0xd2e8c8, 0xf4ffe2, 0xdcefe0, 0xfff6dc];
const tint = (rnd) => TINT[Math.floor(rnd() * TINT.length)];
const pickOf = (rnd, arr) => arr[Math.floor(rnd() * arr.length)];

/**
 * Freier Streifen neben der Straße bei s: Seite side (−1 links, +1 rechts), von near (Abstand zur Fahrbahnkante) bis
 * far. ctx.edge(s, side): äußere Kante des Straßenbands (Asphalt + Bankett), ctx.limit(s, side): weiter draußen ist
 * fremdes Gebiet (Keil zur Autobahn), ctx.blocked(x, s, r): dort steht etwas anderes (Stummel, Platz, Schild).
 */
function spot(ctx, s, side, dist) {
  const x = ctx.edge(s, side) + side * dist;
  const lim = ctx.limit(s, side);
  if (side < 0 ? x < lim : x > lim) return null;
  return x;
}

/** Wie spot, für einen Körper der Länge len entlang der Straße: der Abstand gilt zur äußersten Kante daneben. */
function spotSpan(ctx, s, len, side, dist) {
  let e = ctx.edge(s, side);
  for (const t of [-0.5, -0.25, 0.25, 0.5]) {
    const q = ctx.edge(s + t * len, side);
    e = side < 0 ? Math.min(e, q) : Math.max(e, q);
  }
  const x = e + side * dist;
  const lim = ctx.limit(s, side);
  if (side < 0 ? x < lim : x > lim) return null;
  return x;
}

/** Waldrand und Wald auf einer Seite (dicht: Hecke, drei versetzte Baumreihen, Farn dazwischen). */
function forestSide(out, rnd, ctx, s0, s1, side, depth) {
  // Hecke am Waldrand
  for (let s = s0 + rnd() * 1.5; s < s1; s += 1.5 + rnd() * 0.6) {
    const x = spot(ctx, s, side, 1.4 + rnd() * 0.5);
    if (x === null || ctx.blocked(x, s, 1.5)) continue;
    const k = 1.15 + rnd() * 0.45;
    addProp(out, T.bush, x, s, k, k * (0.95 + rnd() * 0.3), k, rnd() * 6.3, tint(rnd));
  }
  // Baumreihen (Nadel- und Laubbäume gemischt, die äußeren Reihen dunkler und höher)
  const rows = depth > 16 ? [4.2, 8.6, 13.4, 18.5] : depth > 10 ? [4.2, 8.6] : [4.2];
  rows.forEach((d, r) => {
    const step = 4.6;
    for (let s = s0 + ((r % 2) * step) / 2 + rnd() * 1.5; s < s1; s += step * (0.8 + rnd() * 0.4)) {
      const x = spot(ctx, s, side, d + (rnd() - 0.5) * 1.6);
      if (x === null || ctx.blocked(x, s, 3)) continue;
      const conifer = rnd() < 0.45 + r * 0.12;
      const k = conifer ? 1.35 + rnd() * 0.45 : 1.25 + rnd() * 0.4;
      addProp(out, conifer ? T.conifer : T.decid, x, s, k, k * (0.92 + rnd() * 0.2), k, rnd() * 6.3, tint(rnd));
    }
  });
  // Unterholz: Farn und kleine Büsche zwischen den Reihen
  for (let s = s0 + rnd() * 3; s < s1; s += 2.2 + rnd() * 2.5) {
    const x = spot(ctx, s, side, 2.6 + rnd() * Math.min(depth, 12));
    if (x === null || ctx.blocked(x, s, 1)) continue;
    if (rnd() < 0.6) addProp(out, T.fern, x, s, 0.9 + rnd() * 0.6, 0.9 + rnd() * 0.5, 0.9 + rnd() * 0.6, rnd() * 6.3, 0xffffff);
    else {
      const k = 0.6 + rnd() * 0.4;
      addProp(out, T.bush, x, s, k, k, k, rnd() * 6.3, tint(rnd));
    }
  }
}

/** Lockerer Straßenrand: Baumgruppen, Büsche, mal eine Allee. */
function openSide(out, rnd, ctx, s0, s1, side, alley) {
  if (alley) {
    // Allee: Laubbäume in gleichem Abstand am Bankett
    const step = 16;
    for (let s = Math.ceil(s0 / step) * step; s < s1; s += step) {
      const x = spot(ctx, s, side, 1.6);
      if (x === null || ctx.blocked(x, s, 3)) continue;
      const k = 1.05 + rnd() * 0.2;
      addProp(out, T.decid, x, s, k, k, k, rnd() * 6.3, tint(rnd));
    }
  }
  let s = s0 + rnd() * 30;
  while (s < s1) {
    // eine Gruppe aus Bäumen und Büschen
    const n = 2 + Math.floor(rnd() * 5);
    const d0 = 4 + rnd() * 16;
    for (let i = 0; i < n; i++) {
      const ss = s + (rnd() - 0.5) * 14;
      if (ss < s0 || ss >= s1) continue;
      const x = spot(ctx, ss, side, d0 + rnd() * 9);
      if (x === null || ctx.blocked(x, ss, 3)) continue;
      const r = rnd();
      if (r < 0.35) {
        const k = 0.8 + rnd() * 0.5;
        addProp(out, T.bush, x, ss, k, k, k, rnd() * 6.3, tint(rnd));
      } else {
        const conifer = r > 0.75;
        const k = 0.9 + rnd() * 0.45;
        addProp(out, conifer ? T.conifer : T.decid, x, ss, k, k, k, rnd() * 6.3, tint(rnd));
      }
    }
    s += 25 + rnd() * 60;
  }
}

/**
 * Flur hinter dem lockeren Rand (Landstraße, Zubringer, Verbindung), damit die Wiese nicht kahl bis zum Dunst reicht:
 * Feldhecken quer zur Straße teilen sie in Felder, weiter hinten stehen Baumreihen und Feldgehölze in Abschnitten,
 * dazwischen mal ein einzelner großer Baum. Nichts davon steht näher als 7 m an der Straße. Platzhalter, bis Stufe B
 * Felder, Alleen und Höfe aufnäht (ENGINE.md 4.4); alles Instanzen der vorhandenen Bäume und Büsche.
 */
function fieldSide(out, rnd, ctx, s0, s1, side) {
  // Feldhecken: Büsche dicht an dicht, leicht schräg (Felder sind selten rechtwinklig), manche mit Bäumen darin
  for (let s = s0 + 30 + rnd() * 150; s < s1; s += 170 + rnd() * 230) {
    const d0 = 7 + rnd() * 6;
    const len = 18 + rnd() * 30;
    const lean = (rnd() - 0.5) * 0.5;
    const trees = rnd() < 0.45;
    let next = 4 + rnd() * 6;
    for (let d = d0; d < d0 + len; d += 2.3 + rnd() * 0.9) {
      const ss = s + (d - d0) * lean;
      if (ss < s0 || ss >= s1) break;
      const x = spot(ctx, ss, side, d);
      if (x === null || ctx.blocked(x, ss, 2)) break;
      if (trees && d - d0 > next) {
        next += 9 + rnd() * 8;
        const k = 1.05 + rnd() * 0.35;
        addProp(out, rnd() < 0.8 ? T.decid : T.conifer, x, ss, k, k * (0.92 + rnd() * 0.2), k, rnd() * 6.3, tint(rnd));
      } else {
        const k = 0.85 + rnd() * 0.4;
        addProp(out, T.bush, x, ss, k * 1.15, k * (0.9 + rnd() * 0.25), k * 1.15, rnd() * 6.3, tint(rnd));
      }
    }
  }
  // Baumreihen und Feldgehölze weiter hinten: Abschnitte von 40 bis 180 m, dazwischen Blick in die Weite
  for (let s = s0 + rnd() * 120; s < s1; ) {
    const len = 40 + rnd() * 140;
    const d = 40 + rnd() * 38;
    const copse = rnd() < 0.35; // Gehölz: zwei, drei versetzte Reihen statt einer
    for (let t = s; t < Math.min(s + len, s1); t += 6 + rnd() * 4) {
      for (let r = 0; r < (copse ? 3 : 1); r++) {
        if (r > 0 && rnd() < 0.3) continue;
        const ss = t + (r % 2) * 3 + (rnd() - 0.5) * 2;
        if (ss < s0 || ss >= s1) continue;
        const x = spot(ctx, ss, side, d + r * 6 + (rnd() - 0.5) * 4);
        if (x === null || ctx.blocked(x, ss, 3)) continue;
        const conifer = rnd() < (copse ? 0.5 : 0.3);
        const k = 1.25 + rnd() * 0.5;
        addProp(out, conifer ? T.conifer : T.decid, x, ss, k, k * (0.9 + rnd() * 0.25), k, rnd() * 6.3, tint(rnd));
      }
    }
    s += len + 50 + rnd() * 190;
  }
  // einzelne große Bäume auf der Wiese
  for (let s = s0 + rnd() * 250; s < s1; s += 200 + rnd() * 320) {
    const x = spot(ctx, s, side, 14 + rnd() * 24);
    if (x === null || ctx.blocked(x, s, 4)) continue;
    const k = 1.55 + rnd() * 0.4;
    addProp(out, T.decid, x, s, k, k * (0.95 + rnd() * 0.15), k, rnd() * 6.3, tint(rnd));
  }
}

/** Häuser als Platzhalter für den Stadtbaukasten: eine Reihe je Seite hinter den Vorgärten, Schauseite zur Straße. */
function houseSide(out, rnd, ctx, s0, s1, side) {
  let s = s0 + 4 + rnd() * 6;
  while (s < s1 - 6) {
    const k = Math.floor(rnd() * HOUSES.length);
    const { w, d, h } = HOUSES[k]; // w entlang der Straße, d quer
    const sc = s + w / 2;
    if (sc + w / 2 > s1) break;
    const x = spotSpan(ctx, sc, w, side, 0.6 + d / 2);
    if (x !== null && !ctx.blocked(x, sc, Math.max(w, d) / 2 + 0.5)) {
      const wall = pickOf(rnd, PAL.wall);
      const roof = pickOf(rnd, PAL.roof);
      const rh = 0.32 * d + rnd() * 0.12 * d;
      const rot = side < 0 ? 0 : Math.PI;
      // Traufe zur Straße: Breite (x) = Tiefe des Hauses, Tiefe (z) = Länge entlang der Straße, First längs.
      // Dach und Giebelwand stehen auf der Traufhöhe h (siehe townRoofGeo).
      addProp(out, T.house, x, sc, d, h, w, rot, wall);
      addProp(out, T.gable, x, sc, d, rh, w, rot, wall, h);
      addProp(out, T.roof, x, sc, d, rh, w, rot, roof, h);
      addProp(out, T['win' + k], x, sc, 1, 1, 1, rot, 0xffffff);
      // ein Baum oder Busch im Garten
      if (rnd() < 0.6) {
        const gx = ctx.edge(sc, side) + side * 0.4;
        const k = 0.55 + rnd() * 0.3;
        if (!ctx.blocked(gx, s + 1.5, 1)) addProp(out, rnd() < 0.5 ? T.bush : T.decid, gx, s + 1.5, k, k, k, rnd() * 6.3, tint(rnd));
      }
    }
    s += w + 2.5 + rnd() * 5;
  }
}

/**
 * Dorf am Rand einer Landstraße (wo die Karte Siedlung zeigt, landcover.js): Gruppen aus zwei bis vier Häusern, mal
 * näher, mal weiter von der Straße, Schauseite zur Straße, Gärten mit Bäumen dahinter, zwischen den Gruppen Wiese
 * mit Obstbäumen. Dieselben Häuser wie houseSide, nur lockerer (dort steht eine geschlossene Reihe).
 */
function hamletSide(out, rnd, ctx, s0, s1, side) {
  let s = s0 + 6 + rnd() * 14;
  while (s < s1 - 10) {
    const n = 2 + Math.floor(rnd() * 3);
    const back = 2.5 + rnd() * 9; // Vorgarten
    for (let i = 0; i < n && s < s1 - 8; i++) {
      const k = rnd() < 0.12 ? 3 : Math.floor(rnd() * 3);
      const { w, d, h } = HOUSES[k];
      const sc = s + w / 2;
      if (sc + w / 2 > s1) break;
      const x = spotSpan(ctx, sc, w, side, back + (rnd() - 0.5) * 2 + d / 2);
      if (x !== null && !ctx.blocked(x, sc, Math.max(w, d) / 2 + 0.5)) {
        const wall = pickOf(rnd, PAL.wall);
        const roof = pickOf(rnd, PAL.roof);
        const rh = 0.32 * d + rnd() * 0.14 * d;
        const rot = side < 0 ? 0 : Math.PI;
        addProp(out, T.house, x, sc, d, h, w, rot, wall);
        addProp(out, T.gable, x, sc, d, rh, w, rot, wall, h);
        addProp(out, T.roof, x, sc, d, rh, w, rot, roof, h);
        addProp(out, T['win' + k], x, sc, 1, 1, 1, rot, 0xffffff);
        // Garten hinter dem Haus: ein, zwei Bäume, vorn mal ein Busch
        for (let t = 0; t < 1 + Math.floor(rnd() * 2); t++) {
          const gx = x + side * (d / 2 + 3 + rnd() * 6);
          const gs = sc + (rnd() - 0.5) * w;
          if (ctx.blocked(gx, gs, 2)) continue;
          const kk = 0.8 + rnd() * 0.45;
          addProp(out, rnd() < 0.75 ? T.decid : T.conifer, gx, gs, kk, kk, kk, rnd() * 6.3, tint(rnd));
        }
        if (rnd() < 0.5) {
          const bx = x - side * (d / 2 + 1.2);
          const bs = sc + (rnd() - 0.5) * w * 0.8;
          const kk = 0.55 + rnd() * 0.3;
          if (!ctx.blocked(bx, bs, 1)) addProp(out, T.bush, bx, bs, kk, kk, kk, rnd() * 6.3, tint(rnd));
        }
      }
      s += w + 3 + rnd() * 6;
    }
    // Lücke mit Obstwiese
    const gap = 18 + rnd() * 40;
    for (let t = s + 4; t < Math.min(s + gap - 4, s1); t += 7 + rnd() * 5) {
      const x = spot(ctx, t, side, 5 + rnd() * 16);
      if (x === null || ctx.blocked(x, t, 3)) continue;
      const kk = 0.75 + rnd() * 0.3;
      addProp(out, T.decid, x, t, kk, kk * 0.9, kk, rnd() * 6.3, tint(rnd));
    }
    s += gap;
  }
}

/**
 * Offene Wiese (wo die Karte weder Wald noch Acker noch Dorf zeigt): Weideland mit einzelnen Bäumen, Buschgruppen und
 * ab und zu einer Baumreihe am Bach, ohne die Feldhecken der Äcker.
 */
function meadowSide(out, rnd, ctx, s0, s1, side) {
  for (let s = s0 + rnd() * 60; s < s1; s += 45 + rnd() * 110) {
    const x = spot(ctx, s, side, 12 + rnd() * 40);
    if (x === null || ctx.blocked(x, s, 4)) continue;
    const k = 1.2 + rnd() * 0.6;
    addProp(out, T.decid, x, s, k, k * (0.9 + rnd() * 0.2), k, rnd() * 6.3, tint(rnd));
    // ein paar Büsche um den Baum
    for (let b = 0; b < Math.floor(rnd() * 4); b++) {
      const bs = s + (rnd() - 0.5) * 10;
      const bx = x + (rnd() - 0.5) * 8;
      if (bs < s0 || bs >= s1 || ctx.blocked(bx, bs, 1.5)) continue;
      const kk = 0.6 + rnd() * 0.5;
      addProp(out, T.bush, bx, bs, kk, kk, kk, rnd() * 6.3, tint(rnd));
    }
  }
}

export { forestSide, openSide, fieldSide, houseSide, hamletSide, meadowSide, spot };
