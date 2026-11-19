// Elsa – das Heringsmaskottchen aus Kassel und Spirit-Animal von SkylineTV LIVE, so wie die Plüsch-Elsa vom
// Zisselfest: königsblauer Samtplüsch, ein breiter Fischmund wie ein Entenschnabel mit hellblauen Lippen und roter
// Filzzunge, große braune Glasaugen mit langen Wimpern oben auf dem Kopf, dazwischen ein goldenes Krönchen, quer
// über Brust und Bauch zwei weiße Schärpenbänder und ringsum weiße Kleeblätter, Stummelarme mit Paddelhänden und
// große Füße mit drei Zehennähten.
// Sie ist ein Stofftier wie Mini Adam: weiche Formen aus softMesh.js, Stoff aus plushMaterial.js (Farbe, Nähte und
// Aufdruck stehen je Ecke in der Geometrie). Gerechnet wird die Form einmal; Statue und Wackel-Elsa teilen sie sich.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { curve } from '../curve.js';
import { plush } from './plushMaterial.js';
import { ell, cone, smin, smax, netMesh, SoftPart, toGeometry } from './softMesh.js';

// Maße in Figur-Einheiten: Sohlen bei y = 0, Scheitel bei 1, mit Krone 1,07 hoch; sie schaut nach +z, ihr linker
// Arm hängt also bei +x.
const MESH = 0.0125; // Maschenweite des Netzes
// Genäht ist sie wie ein 30 cm großes Stofftier: in diesem Maßstab stehen Körnung und Nahtbreiten, auch wenn sie
// als Statue meterhoch am Straßenrand steht
const PLUSH = 0.3;
const SHOULDER = [0.108, 0.664, 0];
const ARM = [0.755, -0.656]; // Richtung des hängenden linken Arms in der Körperebene (Einheitsvektor)
const EYE = { c: [0.098, 0.935, 0.04], axis: [0.283, 0.188, 0.94], hill: 0.06, felt: 0.044, glass: 0.028 };
const CROWN = { y: 0.972, z: -0.004, r: 0.043, wall: 0.006, flare: 0.17, low: 0.034, high: 0.094, points: 5 };
// Aufdruck: Ausschnitt der Vorderseite (x, y links unten, Kantenlänge), auf den die Textur gelegt wird
const PRINT = { x: -0.2, y: 0.34, size: 0.4 };
// Schärpe: zwei gleichlaufende Bänder von ihrer rechten Schulter hinunter zur linken Hüfte (Höhe bei x = 0, Gefälle)
const SASH = { at: [0.521, 0.459], slope: -0.642, width: 0.0095 };
// Kleeblätter (x, y, Drehung): sechs über der Schärpe, sieben darunter – verstreut wie auf dem Stofftier
const CLOVERS = [
  [-0.005, 0.64, 0.2], [-0.082, 0.617, -0.5], [-0.036, 0.588, 0.6], [0.056, 0.6, -0.2], [0.034, 0.552, 0.4], [0.09, 0.514, -0.6],
  [-0.124, 0.479, 0.5], [-0.082, 0.449, -0.3], [-0.118, 0.42, 0.7], [-0.013, 0.418, -0.4], [-0.064, 0.394, 0.3], [0.003, 0.379, -0.7], [0.054, 0.393, 0.1],
];

const C = {
  fur: new THREE.Color(0x113fb6),
  lip: new THREE.Color(0x78b2ee),
  tongue: new THREE.Color(0xe32a3e),
  felt: new THREE.Color(0xf3f2ec),
  lash: new THREE.Color(0x0b0b10),
  iris: new THREE.Color(0x6a3716),
  pupil: new THREE.Color(0x060505),
  glint: new THREE.Color(0xffffff),
};

// --- Form ---------------------------------------------------------------------------------------
const mouthSdf = (x, y, z) => ell(x, y, z, 0, 0.841, 0.175, 0.104, 0.031, 0.09);

/** Kopf, Bauch, Beine und Füße in einem Stück (ohne Arme) */
function bodySdf(x, y, z) {
  const ax = Math.abs(x);
  // birnenförmiger Bauch mit Brust, darauf ohne Hals der große runde Kopf
  let d = smin(ell(x, y, z, 0, 0.5, 0.004, 0.168, 0.178, 0.138), ell(x, y, z, 0, 0.662, 0, 0.143, 0.105, 0.113), 0.07);
  const head = smin(ell(x, y, z, 0, 0.858, 0, 0.152, 0.14, 0.134), ell(x, y, z, 0, 0.8, 0.002, 0.146, 0.088, 0.126), 0.04);
  d = smin(d, head, 0.06);
  // Augenhügel oben außen, dazwischen der Nasenrücken hinunter zur Oberlippe
  d = smin(d, ell(ax, y, z, EYE.c[0], EYE.c[1], EYE.c[2], EYE.hill, EYE.hill, EYE.hill), 0.03);
  d = smin(d, ell(x, y, z, 0, 0.925, 0.085, 0.034, 0.05, 0.05), 0.04);
  // Entenschnabel: zwei flache Lippen, dazwischen der offene Mund
  const bill = smin(ell(x, y, z, 0, 0.875, 0.108, 0.126, 0.031, 0.088), ell(x, y, z, 0, 0.807, 0.1, 0.12, 0.031, 0.082), 0.015);
  d = smax(smin(d, bill, 0.03), -mouthSdf(x, y, z), 0.02);
  // dicke gerade Beine, große flache Füße mit ebener Sohle
  const leg = cone(ax, y, z, 0.09, 0.38, 0, 0.094, 0.06, 0.004, 0.068, 0.062);
  const foot = ell(ax, y, z, 0.1, 0.038, 0.05, 0.084, 0.042, 0.118);
  d = smin(d, smin(leg, foot, 0.03), 0.025);
  return smax(d, -y, 0.012);
}

/** Linker Arm um das Schultergelenk: kurzer dicker Stummel, der in eine flache Paddelhand ausläuft */
function armSdf(x, y, z) {
  const u = x * ARM[0] + y * ARM[1];
  const v = y * ARM[0] - x * ARM[1];
  return smin(cone(u, v, z, 0, 0, 0, 0.17, 0, 0, 0.054, 0.043), ell(u, v, z, 0.24, 0, 0.004, 0.077, 0.062, 0.027), 0.04);
}

/** Die ganze Figur mit hängenden Armen (für die Schatten in Falten und Achseln) */
const figureSdf = (x, y, z) => Math.min(bodySdf(x, y, z), armSdf(Math.abs(x) - SHOULDER[0], y - SHOULDER[1], z - SHOULDER[2]));

// --- Nähte ----------------------------------------------------------------------------------------
// Eine Naht ist die Nullstelle eines Abstands, der sich über ein Dreieck gleichmäßig ändert (siehe softMesh.js).

/**
 * Drei Zehennähte je Fuß: vorn auf dem Fußrücken, im Abstand g um die Fußmitte. Hinter ihrem Ende fällt der Wert
 * steil ab: den steilen Nulldurchgang dort blendet der Shader aus wie eine Naht in weiter Ferne.
 */
function toeSeam(x, z) {
  const u = Math.abs(x) - 0.1;
  const g = 0.041;
  const f = Math.abs(u) <= g / 2 ? u : Math.sign(u) * (g - Math.abs(u));
  return -Math.max(f, 40 * (0.082 - z));
}

/** Ringnaht um den Hals und Quernaht über den Beinen: Nullstellen in beiden Höhen, dazwischen ein Dach */
const ringSeam = (y) => (y < 0.5385 ? y - 0.356 : 0.721 - y);

// --- Geometrie ------------------------------------------------------------------------------------
/** Dreiecksnetz von three.js als Stück für die Plüsch-Geometrie */
function partOf(geo, matrix) {
  const part = new SoftPart(Float32Array.from(geo.attributes.position.array), Float32Array.from(geo.attributes.normal.array), Array.from(geo.index.array));
  geo.dispose();
  return part.transform(matrix);
}

/** Einfarbiges Glasteil (Kugelausschnitt mit dem Pol auf der Blickachse) */
function glassPart(color, matrix, radius, thetaStart, thetaLength, rings) {
  const geo = new THREE.SphereGeometry(radius, 32, rings, 0, Math.PI * 2, thetaStart, thetaLength);
  const col = new Float32Array(geo.attributes.position.count * 3);
  for (let i = 0; i < col.length; i += 3) color.toArray(col, i);
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return geo.applyMatrix4(matrix);
}

/**
 * Ein Auge: weißer Filz auf dem Augenhügel, darauf das braune Glasauge mit schwarzer Pupille und Glanzpunkt,
 * dahinter ein Fächer aus fünf Filzwimpern nach oben außen.
 */
function buildEye(side, soft, glass) {
  const axis = new THREE.Vector3(side * EYE.axis[0], EYE.axis[1], EYE.axis[2]).normalize();
  const c = new THREE.Vector3(side * EYE.c[0], EYE.c[1], EYE.c[2]);
  const turn = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis);
  const one = new THREE.Vector3(1, 1, 1);
  const at = (d) => new THREE.Matrix4().compose(c.clone().addScaledVector(axis, d), turn, one);
  soft.push(partOf(new THREE.SphereGeometry(EYE.felt, 36, 10, 0, Math.PI * 2, 0, 1.35), at(0.026)).flat(C.felt, 0.45));
  const m = at(0.052);
  glass.push(glassPart(C.pupil, m, EYE.glass, 0, 0.74, 5), glassPart(C.iris, m, EYE.glass, 0.74, 1.2, 6));
  // Glanzpunkt: sitzt halb im Glas, bei beiden Augen oben links
  const glint = new THREE.Vector3(-0.42, 0.5, 0).add(axis).normalize().multiplyScalar(EYE.glass * 0.94).addScaledVector(axis, 0.052).add(c);
  glass.push(glassPart(C.glint, new THREE.Matrix4().compose(glint, turn, one), 0.0068, 0, Math.PI, 6));
  // Wimpern: in der Ebene quer zur Blickachse, von außen bis knapp über die Senkrechte
  const up = new THREE.Vector3(0, 1, 0).addScaledVector(axis, -axis.y).normalize();
  const out = new THREE.Vector3().crossVectors(up, axis).multiplyScalar(side);
  for (const deg of [4, 31, 58, 85, 112]) {
    const a = (deg * Math.PI) / 180;
    const radial = out.clone().multiplyScalar(Math.cos(a)).addScaledVector(up, Math.sin(a));
    const dir = radial.clone().addScaledVector(axis, 0.22).normalize();
    const flat = axis.clone().addScaledVector(dir, -axis.dot(dir)).normalize();
    const base = c.clone().addScaledVector(axis, 0.03).addScaledVector(radial, 0.034);
    const lash = new THREE.ConeGeometry(0.0135, 0.052, 6).translate(0, 0.026, 0).scale(1, 1, 0.36);
    soft.push(partOf(lash, new THREE.Matrix4().makeBasis(new THREE.Vector3().crossVectors(dir, flat), dir, flat).setPosition(base)).flat(C.lash, 0.3));
  }
}

/** Krönchen aus Goldstoff: ein nach oben weiter werdender Reif mit fünf Zacken, außen, innen und an der Kante */
function crownGeometry() {
  const SEG = CROWN.points * 8;
  const height = (i) => CROWN.low + (CROWN.high - CROWN.low) * (1 - Math.abs(2 * (((i / SEG) * CROWN.points) % 1) - 1)) ** 0.85;
  const point = (i, y, inset) => {
    const a = (i / SEG) * Math.PI * 2;
    const r = CROWN.r + CROWN.flare * y - inset;
    return [Math.sin(a) * r, CROWN.y + y, CROWN.z + Math.cos(a) * r];
  };
  const strip = (from, to) => {
    const pos = [];
    const idx = [];
    for (let i = 0; i <= SEG; i++) pos.push(...from(i), ...to(i));
    for (let i = 0; i < SEG; i++) idx.push(i * 2, i * 2 + 2, i * 2 + 3, i * 2, i * 2 + 3, i * 2 + 1);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  };
  const strips = [
    strip((i) => point(i, 0, 0), (i) => point(i, height(i), 0)),
    strip((i) => point(i, height(i), 0), (i) => point(i, height(i), CROWN.wall)),
    strip((i) => point(i, height(i), CROWN.wall), (i) => point(i, 0, CROWN.wall)),
  ];
  const g = mergeGeometries(strips);
  for (const s of strips) s.dispose();
  return g;
}

let shared = null;
/** Die Geometrien der Figur (einmal gerechnet): Plüsch am Stück, beide Arme, Glasaugen, Krone */
function elsaGeometry() {
  if (shared) return shared;
  const body = netMesh(bodySdf, [-0.21, -0.02, -0.16], [0.21, 1.01, 0.22], MESH).flat(C.fur, 1);
  // Lippen und Mundhöhle aus hellblauem Stoff: von der Höhle bis um die Lippenkante herum
  body.tint(C.lip, (x, y, z) => (0.03 - mouthSdf(x, y, z)) / 0.024);
  body.seams((x, y, z, o) => {
    o[0] = (y < 0.2 ? toeSeam(x, z) : ringSeam(y)) * PLUSH;
  });
  // der Aufdruck liegt von vorn auf der ganzen Figur; die Textur ist außerhalb von Brust und Bauch leer
  body.set('logo', (x, y, z, nx, ny, nz, o) => {
    o[0] = (x - PRINT.x) / PRINT.size;
    o[1] = (y - PRINT.y) / PRINT.size;
  });
  body.occlude(figureSdf, 0.42, [0.012, 0.03, 0.06]);

  const armL = netMesh(armSdf, [-0.075, -0.275, -0.07], [0.3, 0.075, 0.07], MESH).flat(C.fur, 1);
  // die Arme sind aus Vorder- und Rückseite genäht: Naht rundum an der Kante
  armL.seams((x, y, z, o) => {
    o[0] = (z - 0.002) * PLUSH;
  });
  armL.occlude((x, y, z) => figureSdf(x + SHOULDER[0], y + SHOULDER[1], z + SHOULDER[2]), 0.42, [0.012, 0.03, 0.06]);
  const armR = armL.clone().transform(new THREE.Matrix4().makeScale(-1, 1, 1));

  const soft = [body];
  const glass = [];
  buildEye(1, soft, glass);
  buildEye(-1, soft, glass);
  // rote Filzzunge auf der Unterlippe
  soft.push(partOf(new THREE.SphereGeometry(1, 18, 10), new THREE.Matrix4().makeScale(0.042, 0.012, 0.036).setPosition(0, 0.818, 0.14)).flat(C.tongue, 0.4));
  const eyes = mergeGeometries(glass);
  for (const g of glass) g.dispose();
  shared = { body: toGeometry(soft), armL: toGeometry([armL]), armR: toGeometry([armR]), eyes, crown: crownGeometry() };
  return shared;
}

// --- Stoff ------------------------------------------------------------------------------------------
let printTex = null;
/** Aufdruck auf Brust und Bauch (es zählt nur die Deckkraft): zwei Schärpenbänder und dreizehn Kleeblätter */
function printTexture() {
  if (printTex) return printTex;
  const S = 512;
  const c = document.createElement('canvas');
  c.width = S;
  c.height = S;
  const ctx = c.getContext('2d');
  const u = S / PRINT.size; // Bildpunkte je Figur-Einheit
  const px = (x) => (x - PRINT.x) * u;
  const py = (y) => S - (y - PRINT.y) * u;
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = SASH.width * u;
  for (const y0 of SASH.at) {
    ctx.beginPath();
    ctx.moveTo(px(-0.25), py(y0 - SASH.slope * 0.25));
    ctx.lineTo(px(0.25), py(y0 + SASH.slope * 0.25));
    ctx.stroke();
  }
  ctx.lineCap = 'round';
  for (const [x, y, turn] of CLOVERS) {
    ctx.save();
    ctx.translate(px(x), py(y));
    ctx.rotate(turn);
    // drei runde Blätter um die Mitte, dazu ein kurzer gebogener Stiel
    for (let i = 0; i < 3; i++) {
      const a = -Math.PI / 2 + (i * Math.PI * 2) / 3;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * 0.0086 * u, Math.sin(a) * 0.0086 * u, 0.0079 * u, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.lineWidth = 0.0042 * u;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(0.002 * u, 0.012 * u, 0.007 * u, 0.02 * u);
    ctx.stroke();
    ctx.restore();
  }
  printTex = new THREE.CanvasTexture(c);
  printTex.anisotropy = 4;
  return printTex;
}

const materials = {};
/** Plüsch, Glasaugen und Goldstoff – je einmal für die gebogene Welt und für das Cockpit */
function elsaMaterials(curved) {
  const key = curved ? 'curved' : 'flat';
  if (!materials[key]) {
    const k = (m) => (curved ? curve(m) : m);
    materials[key] = {
      fur: plush(0xffffff, curved, { paint: { logo: printTexture(), scale: new THREE.Vector3(PLUSH, PLUSH, PLUSH) } }),
      glass: k(new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.14, clearcoat: 1, clearcoatRoughness: 0.06 })),
      gold: k(new THREE.MeshStandardMaterial({ color: 0xf2c230, metalness: 0.9, roughness: 0.3, emissive: 0x3a2800, emissiveIntensity: 0.3 })),
    };
  }
  return materials[key];
}

/**
 * Elsa, mit Krone gut eine Einheit hoch, steht auf y = 0 und schaut nach +z. Fünf Zeichenaufrufe: Plüsch am Stück,
 * zwei bewegliche Arme (userData.armL / armR, Ursprung im Schultergelenk), Glasaugen, Krone.
 */
export function buildElsa({ curved = true } = {}) {
  const G = elsaGeometry();
  const M = elsaMaterials(curved);
  const g = new THREE.Group();
  g.name = 'Elsa';
  const body = new THREE.Mesh(G.body, M.fur);
  const armL = new THREE.Mesh(G.armL, M.fur);
  const armR = new THREE.Mesh(G.armR, M.fur);
  armL.position.set(SHOULDER[0], SHOULDER[1], SHOULDER[2]);
  armR.position.set(-SHOULDER[0], SHOULDER[1], SHOULDER[2]);
  const eyes = new THREE.Mesh(G.eyes, M.glass);
  const crown = new THREE.Mesh(G.crown, M.gold);
  g.add(body, armL, armR, eyes, crown);
  // Schatten werfen nur die großen Teile
  for (const o of [body, armL, armR, crown]) o.castShadow = true;
  g.userData = { armL, armR, crown, body };
  return g;
}

/**
 * Kleine Animation: Die Arme heben und senken sich gemächlich, der Körper wiegt sich (wobble: Ausschlag der
 * Wackelfeder). Ein Arm hebt sich mit rotation.z – links nach +, rechts nach −; wer sie kräftiger winken lässt,
 * zählt nach diesem Aufruf etwas dazu.
 */
export function animateElsa(elsa, t, wobble = 0) {
  const u = elsa.userData;
  u.armL.rotation.z = 0.1 + Math.sin(t * 3.1) * 0.14;
  u.armR.rotation.z = -0.06 - Math.sin(t * 3.1 + 1) * 0.08;
  elsa.rotation.z = Math.sin(t * 2.2) * 0.04 + wobble;
}
