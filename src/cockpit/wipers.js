// Die beiden Scheibenwischer als Bauteile: Achse mit Gummimanschette, gegossener Armkopf mit Mutterkappe,
// Gelenkstift, Federbügel, schlanke gekröpfte Armstange, Flachbalken-Wischblatt mit Gummilippe, Adapter und
// Endkappen. Alles gerundet und etwas kräftiger als beim Vorbild – wie ein liebevoll gebautes Spielzeugteil.
//
// Koordinaten eines Wischers (Ursprung = Fuß der Achse auf der Scheibe): x längs des Arms, y quer dazu
// (in Parkstellung scheibenabwärts), z von der Scheibe weg nach außen. Der Fahrer sieht die Wischer von
// innen durch die Scheibe, also vor allem ihre Unterseiten – deshalb sind alle Körper rundum geschlossen.
//
// buildWipers baut sie starr auf die Scheibenebene des Cockpits, buildCarWipers schmiegt dieselben Teile an
// die gewölbte Glaskuppel des Außenmodells an.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { smoothstep, lerp, clamp } from '../util.js';

// Farben (sRGB): nichts ist reines Schwarz, damit die Form auch im Regenlicht lesbar bleibt
const COL = {
  arm: 0x363a41,
  cap: 0x444851,
  blade: 0x2a2d33,
  clip: 0x3f434c,
  rubber: 0x141416,
  boot: 0x1f2227,
  steel: 0x666b73,
  sill: 0x050506,
};

const UP = new THREE.Vector3(0, 0, 1);
const X = new THREE.Vector3(1, 0, 0);
const at = (x, y, z) => new THREE.Vector3(x, y, z);

/** Querschnitt (y, z) als Superellipse gegen den Uhrzeigersinn: Breite w, Höhe h, Mitte in Höhe zc. */
function roundSection(w, h, zc = 0, n = 3, count = 12) {
  const e = 2 / n;
  const pts = [];
  for (let k = 0; k < count; k++) {
    const a = (k / count) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    pts.push([(Math.sign(c) * Math.abs(c) ** e * w) / 2, zc + (Math.sign(s) * Math.abs(s) ** e * h) / 2]);
  }
  return pts;
}

/** Ring aus einem Querschnitt an der Stelle p, Laufrichtung t (Einheitsvektor). */
function ringAt(p, t, section) {
  const up = UP.clone().addScaledVector(t, -UP.dot(t)).normalize();
  const side = new THREE.Vector3().crossVectors(up, t);
  return section.map(([y, z]) => p.clone().addScaledVector(side, y).addScaledVector(up, z));
}

function centroid(ring) {
  const c = new THREE.Vector3();
  for (const p of ring) c.add(p);
  return c.multiplyScalar(1 / ring.length);
}

/** Runder Abschluss: Ringe, die von ring aus entlang dir (Länge len) auf einen Punkt zulaufen (Viertelkreis). */
function roundEnd(ring, dir, len, steps = 3) {
  const c = centroid(ring);
  const out = [];
  for (let j = 1; j <= steps; j++) {
    const a = (j / (steps + 0.6)) * (Math.PI / 2);
    const k = Math.cos(a);
    out.push(ring.map((p) => p.clone().sub(c).multiplyScalar(k).add(c).addScaledVector(dir, len * Math.sin(a))));
  }
  return { rings: out, tip: c.clone().addScaledVector(dir, len) };
}

/**
 * Haut über Ringe gleicher Punktzahl (in Laufrichtung geordnet, jeder Ring gegen den Uhrzeigersinn, wenn
 * man der Laufrichtung entgegenschaut). Die Enden werden mit einem Fächer zur Spitze geschlossen.
 */
function skin(rings, tipStart, tipEnd, color) {
  const n = rings[0].length;
  const pos = [];
  for (const ring of rings) for (const p of ring) pos.push(p.x, p.y, p.z);
  const idx = [];
  for (let i = 0; i < rings.length - 1; i++) {
    for (let k = 0; k < n; k++) {
      const a = i * n + k;
      const b = i * n + ((k + 1) % n);
      idx.push(a, b, b + n, a, b + n, a + n);
    }
  }
  const iStart = pos.length / 3;
  pos.push(tipStart.x, tipStart.y, tipStart.z);
  const iEnd = iStart + 1;
  pos.push(tipEnd.x, tipEnd.y, tipEnd.z);
  const last = (rings.length - 1) * n;
  for (let k = 0; k < n; k++) {
    idx.push(iStart, (k + 1) % n, k);
    idx.push(iEnd, last + k, last + ((k + 1) % n));
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return paint(g, color);
}

/** Körper entlang einer Reihe von Stationen { p, t, section } mit runden Enden (Längen e0, e1). */
function tube(stations, color, e0 = 0.004, e1 = 0.004, steps = 3) {
  const rings = stations.map((s) => ringAt(s.p, s.t, s.section));
  const first = stations[0];
  const lastSt = stations[stations.length - 1];
  const a = roundEnd(rings[0], first.t.clone().negate(), e0, steps);
  const b = roundEnd(rings[rings.length - 1], lastSt.t, e1, steps);
  return skin([...a.rings.reverse(), ...rings, ...b.rings], a.tip, b.tip, color);
}

/** Einfarbige Eckenfarbe; die UVs entfallen (keine Texturen), damit sich alles zusammenfügen lässt. */
function paint(g, hex) {
  const c = new THREE.Color(hex);
  const n = g.attributes.position.count;
  const col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    col[i * 3] = c.r;
    col[i * 3 + 1] = c.g;
    col[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  if (g.attributes.uv) g.deleteAttribute('uv');
  return g;
}

/** Drehkörper um die z-Achse aus einem Profil [Radius, Höhe] (von unten nach oben). */
function turned(profile, color, segments = 24) {
  const g = new THREE.LatheGeometry(profile.map(([r, z]) => new THREE.Vector2(r, z)), segments);
  g.rotateX(Math.PI / 2);
  return paint(g, color);
}

/** Stützstellen verdichten, bis keine Lücke größer als step ist (damit sich lange Teile wölben lassen). */
function dense(xs, step) {
  const out = [xs[0]];
  for (let i = 1; i < xs.length; i++) {
    const n = Math.max(1, Math.ceil((xs[i] - xs[i - 1]) / step - 1e-6));
    for (let k = 1; k <= n; k++) out.push(lerp(xs[i - 1], xs[i], k / n));
  }
  return out;
}

// Querschnitt des Wischblatts (y, z): Spoiler mit flacher Rampe auf der Windseite (+y, scheibenabwärts)
// und steilem Rücken; die Unterkante liegt 7,5 mm über dem Glas, darunter sitzt die Gummilippe
const BLADE_BASE = 0.0075;
const BLADE_SECTION = [
  [0.015, 0.0092], [0.0138, 0.0118], [0.0098, 0.015], [0.005, 0.019], [0.0005, 0.0232], [-0.004, 0.0258],
  [-0.0078, 0.025], [-0.0112, 0.0212], [-0.014, 0.015], [-0.015, 0.01], [-0.014, 0.008], [-0.007, 0.0076],
  [0, BLADE_BASE], [0.007, 0.0076], [0.014, 0.008],
];
const LIP_SECTION = [[0.0013, 0.0004], [0.0032, 0.0048], [0.0032, 0.008], [-0.0032, 0.008], [-0.0032, 0.0048], [-0.0013, 0.0004]];

/** Wischblatt im eigenen System: Ursprung am Adapter (auf dem Glas), x längs des Blatts von x0 bis x1. */
function bladeGeometry(x0, x1, step) {
  const parts = [];
  // Spoilerkörper: zu den Enden hin flacher und etwas schmaler
  const taper = 0.085;
  const xs = dense([x0, x0 + 0.022, x0 + 0.05, x0 + taper, x1 - taper, x1 - 0.05, x1 - 0.022, x1], step);
  const body = xs.map((x) => {
    const k = smoothstep(0, taper, Math.min(x - x0, x1 - x));
    const sy = lerp(0.86, 1, k);
    const sz = lerp(0.66, 1, k);
    return { p: at(x, 0, 0), t: X, section: BLADE_SECTION.map(([y, z]) => [y * sy, BLADE_BASE + (z - BLADE_BASE) * sz]) };
  });
  parts.push(tube(body, COL.blade, 0.0035, 0.0035, 2));
  // Gummilippe (liegt auf dem Glas)
  const lip = dense([x0 + 0.006, x1 - 0.006], step).map((x) => ({ p: at(x, 0, 0), t: X, section: LIP_SECTION }));
  parts.push(tube(lip, COL.rubber, 0.002, 0.002, 1));
  // Endkappen: kleine runde Kunststoffschuhe, die das Blattende umgreifen
  for (const [xa, dir] of [[x0, -1], [x1, 1]]) {
    const sec = roundSection(0.0312, 0.0196, 0.0158, 2.7, 12);
    const st = [0.024, 0.003].map((d) => ({ p: at(xa - dir * d, 0, 0), t: X, section: sec }));
    if (dir < 0) st.reverse();
    parts.push(tube(st, COL.clip, dir < 0 ? 0.0105 : 0.0025, dir < 0 ? 0.0025 : 0.0105, 3));
  }
  // Adapter in der Mitte: daran greift der Arm
  const ad = roundSection(0.0335, 0.0245, 0.0205, 3.2, 14);
  parts.push(tube([-0.025, 0.025].map((x) => ({ p: at(x, 0, 0), t: X, section: ad })), COL.clip, 0.008, 0.008, 3));
  // Entriegelungstaste oben auf dem Adapter (vor dem Armende)
  const tab = roundSection(0.015, 0.0052, 0.0335, 3, 10);
  parts.push(tube([0.016, 0.0265].map((x) => ({ p: at(x, 0, 0), t: X, section: tab })), COL.cap, 0.0024, 0.0024, 2));
  return mergeGeometries(parts);
}

/** Arm im System des Wischers: Kopf an der Achse, Gelenk, Federbügel, gekröpfte Stange bis zum Adapter bei (yoke, −offset). */
function armGeometry(yoke, offset, step) {
  const parts = [];
  // Armkopf (Gussteil) von hinter der Achse bis zum Gelenk
  const HINGE = 0.08;
  const head = [-0.013, 0.014, 0.05, HINGE - 0.005].map((x) => {
    const k = smoothstep(0.014, HINGE, x);
    const z0 = lerp(0.0215, 0.0232, k);
    const z1 = lerp(0.0385, 0.0362, k);
    return { p: at(x, 0, 0), t: X, section: roundSection(lerp(0.04, 0.0275, k), z1 - z0, (z0 + z1) / 2, 2.8, 14) };
  });
  parts.push(tube(head, COL.arm, 0.011, 0.0045, 3));
  // Mutterkappe über der Achse
  parts.push(turned([[0.0176, 0.037], [0.0179, 0.0424], [0.0166, 0.0462], [0.0132, 0.0494], [0.0074, 0.0514], [0, 0.052]], COL.cap));
  // Gelenkstift (blanker Stahl, schaut an beiden Seiten etwas heraus)
  const pin = new THREE.CapsuleGeometry(0.0046, 0.0245, 4, 12);
  pin.translate(HINGE - 0.002, 0, 0.0296);
  parts.push(paint(pin, COL.steel));
  // Zugfeder unter dem Bügel (von innen gut zu sehen)
  const spring = new THREE.CapsuleGeometry(0.0034, 0.07, 3, 10);
  spring.rotateZ(Math.PI / 2);
  spring.translate(0.128, 0, 0.0236);
  parts.push(paint(spring, COL.steel));
  // Federbügel (breit, bis knapp zur Mitte), dann die schlanke Stange; sie ist seitlich gekröpft, damit das
  // Blatt neben dem Arm liegt, und steigt zum Adapter hin leicht an
  const xr = 0.5 * yoke + 0.02;
  const K0 = xr + 0.012;
  const K1 = yoke - 0.068;
  const end = yoke + 0.011;
  const xs = dense([0.066, 0.1, xr - 0.012, xr + 0.012], step);
  for (let i = 1; i <= 6; i++) xs.push(K0 + ((K1 - K0) * i) / 6);
  xs.push(...dense([K1, end], step).slice(1));
  const center = (x) => at(x, -offset * smoothstep(K0, K1, x), lerp(0.0298, 0.031, smoothstep(0.066, xr, x)) + 0.0035 * smoothstep(xr, end, x));
  const bar = xs.map((x) => {
    const k = smoothstep(xr - 0.014, xr + 0.014, x);
    const e = smoothstep(xr, end, x);
    const t = center(x + 0.001).sub(center(x - 0.001)).normalize();
    const w = lerp(lerp(0.0235, 0.021, smoothstep(0.066, xr, x)), lerp(0.0138, 0.0124, e), k);
    const h = lerp(0.0106, lerp(0.0078, 0.007, e), k);
    return { p: center(x), t, section: roundSection(w, h, 0, 3.2, 12) };
  });
  parts.push(tube(bar, COL.arm, 0.003, 0.0052, 2));
  return mergeGeometries(parts);
}

/** Gummimanschette am Fuß der Achse (steht still); z0 = Höhe ihrer Unterkante über dem Glas. */
function bootGeometry(z0 = 0.0006) {
  return turned([[0, z0], [0.0225, z0], [0.0243, 0.0046], [0.0236, 0.0076], [0.02, 0.0122], [0.0166, 0.017], [0.0135, 0.0225]], COL.boot);
}

// Sockelleiste: bis hier (u, Meter die Scheibe hinauf) reicht die schwarze Abdeckung am Scheibenfuß
const SILL_TOP = 0.095;
const SILL_HALF = 0.79;

/**
 * Sockelleiste am Scheibenfuß, außen auf dem Glas: Aus ihr kommen die Wischerachsen. Vom Fahrerplatz aus
 * ist sie der schwarze Rand unter den geparkten Wischern – so stehen die Achsen nie frei in der Scheibe,
 * egal wie hoch das Armaturenbrett davor reicht. Im System der Scheibe: x quer, y scheibenabwärts, z nach außen.
 */
function sillGeometry(step) {
  const section = [
    [0.03, 0.0015], [0.03, 0.0105], [-SILL_TOP + 0.006, 0.0105], [-SILL_TOP + 0.0025, 0.0092], [-SILL_TOP, 0.006],
    [-SILL_TOP + 0.0025, 0.0028], [-SILL_TOP + 0.006, 0.0015],
  ];
  const st = dense([-SILL_HALF, SILL_HALF], step).map((x) => ({ p: at(x, 0, 0), t: X, section }));
  return tube(st, COL.sill, 0.001, 0.001, 1);
}

/** Alle Teile eines Wischers nach den Angaben wp (siehe WIPERS); step verdichtet die langen Teile. */
function wiperParts(wp, step = Infinity) {
  return {
    arm: armGeometry(wp.arm, wp.offset, step),
    blade: bladeGeometry(wp.blade[0] - wp.arm, wp.blade[1] - wp.arm, step),
  };
}

/**
 * Baut beide Wischer auf die Scheibenebene W (siehe WINDSHIELD) nach den Angaben specs (siehe WIPERS).
 * Rückgabe: group (in Fahrzeug-Koordinaten) und set(angles, flex, light) – Armwinkel in rad ab der
 * Waagerechten (nach rechts) gegen den Uhrzeigersinn aus Fahrersicht, flex = kleines Nachschwingen der
 * Blätter am Adapter, light = Helligkeit des Lichts aus dem Innenraum (0 … 1).
 */
export function buildWipers(W, specs, { sill = true } = {}) {
  const group = new THREE.Group();
  group.name = 'Wischer';
  // Aufhellung aus dem Innenraum: Tageslicht, das Armaturenbrett und Sitze zurückwerfen, trifft die Wischer
  // von unten – ohne sie wären ihre Unterseiten (die einzigen, die der Fahrer sieht) tiefschwarze Balken.
  // Flächen, die zum Betrachter schauen, bekommen am meisten: das rundet die Form.
  const fill = { value: 0.62 };
  const cabinFill = (shader) => {
    shader.uniforms.uCabinFill = fill;
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uCabinFill;')
      .replace(
        '#include <emissivemap_fragment>',
        '#include <emissivemap_fragment>\ntotalEmissiveRadiance += diffuseColor.rgb * uCabinFill * (0.25 + 0.75 * max(normal.z, 0.0));',
      );
  };
  const cacheKey = () => 'wiper-cabin-fill';
  const lit = (roughness, metalness, envMapIntensity) => {
    const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness, metalness, envMapIntensity });
    m.onBeforeCompile = cabinFill;
    m.customProgramCacheKey = cacheKey;
    return m;
  };
  // Arme und Blätter: seidenmatter Lack mit etwas Glanz. Sockel und Manschetten: stumpfer Gummi, in dem
  // sich nichts spiegelt – sonst läge ein olivbrauner Schimmer (der Boden) auf der schwarzen Leiste.
  const material = lit(0.42, 0.25, 1);
  const matte = lit(0.95, 0, 0.12);
  // x längs (in Parkrichtung nach rechts), y scheibenabwärts, z nach außen
  const basis = new THREE.Matrix4().makeBasis(W.X, W.U.clone().negate(), W.N);
  const q = new THREE.Quaternion().setFromRotationMatrix(basis);
  const fixed = [];
  const arms = [];
  const blades = [];
  for (const wp of specs) {
    const pivot = new THREE.Group();
    pivot.position.copy(wp.pivot);
    pivot.quaternion.copy(q);
    pivot.updateMatrix();
    // mit Sockelleiste steckt die Manschette in ihr (sonst sähe man von innen ihren Boden vor der Leiste)
    fixed.push(bootGeometry(sill ? 0.004 : undefined).applyMatrix4(pivot.matrix));
    const parts = wiperParts(wp);
    const arm = new THREE.Mesh(parts.arm, material);
    const blade = new THREE.Mesh(parts.blade, material);
    blade.position.set(wp.arm, -wp.offset, 0);
    arm.add(blade);
    arm.rotation.z = -wp.park;
    pivot.add(arm);
    group.add(pivot);
    arms.push(arm);
    blades.push(blade);
  }
  if (sill) fixed.push(sillGeometry(Infinity).applyMatrix4(basis.clone().setPosition(W.base)));
  group.add(new THREE.Mesh(mergeGeometries(fixed), matte));
  return {
    group,
    set(angles, flex, light = 1) {
      fill.value = 0.62 * light;
      for (let i = 0; i < arms.length; i++) {
        arms[i].rotation.z = -angles[i];
        blades[i].rotation.z = flex ? -flex[i] : 0;
      }
    },
  };
}

// --- Außenmodell --------------------------------------------------------------------------------

/**
 * Gitter der Glasoberfläche über den Scheiben-Koordinaten (x quer, u die Scheibe hinauf): Punkt und
 * Normale. glassY(x, z) liefert die Höhe der Glaskuppel über dem Punkt (x, z) in Fahrzeug-Koordinaten.
 */
function glassGrid(W, glassY) {
  const X0 = -0.72;
  const X1 = 0.72;
  const U0 = 0.02;
  const U1 = 0.9;
  const NX = 31;
  const NU = 19;
  const pos = new Float32Array(NX * NU * 3);
  const nrm = new Float32Array(NX * NU * 3);
  const p = new THREE.Vector3();
  for (let j = 0; j < NU; j++) {
    for (let i = 0; i < NX; i++) {
      // Punkt der Scheibenebene, von dort senkrecht zur Ebene bis auf die Kuppel
      p.copy(W.base).addScaledVector(W.U, lerp(U0, U1, j / (NU - 1)));
      p.x = lerp(X0, X1, i / (NX - 1));
      for (let k = 0; k < 6; k++) p.addScaledVector(W.N, (glassY(p.x, p.z) - p.y) * 0.85);
      p.toArray(pos, (j * NX + i) * 3);
    }
  }
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const at3 = (i, j, target) => target.fromArray(pos, (clamp(j, 0, NU - 1) * NX + clamp(i, 0, NX - 1)) * 3);
  for (let j = 0; j < NU; j++) {
    for (let i = 0; i < NX; i++) {
      at3(i, j + 1, a).sub(at3(i, j - 1, p));
      at3(i + 1, j, b).sub(at3(i - 1, j, p));
      a.cross(b).normalize().toArray(nrm, (j * NX + i) * 3);
    }
  }
  /** Punkt und Normale bei (x, u), bilinear aus dem Gitter; schreibt nach out[0…5]. */
  return (x, u, out) => {
    const fx = clamp(((x - X0) / (X1 - X0)) * (NX - 1), 0, NX - 1.001);
    const fu = clamp(((u - U0) / (U1 - U0)) * (NU - 1), 0, NU - 1.001);
    const i = Math.floor(fx);
    const j = Math.floor(fu);
    const tx = fx - i;
    const tu = fu - j;
    const o = (j * NX + i) * 3;
    const w00 = (1 - tx) * (1 - tu);
    const w10 = tx * (1 - tu);
    const w01 = (1 - tx) * tu;
    const w11 = tx * tu;
    for (let c = 0; c < 3; c++) {
      out[c] = pos[o + c] * w00 + pos[o + 3 + c] * w10 + pos[o + NX * 3 + c] * w01 + pos[o + NX * 3 + 3 + c] * w11;
      out[3 + c] = nrm[o + c] * w00 + nrm[o + 3 + c] * w10 + nrm[o + NX * 3 + c] * w01 + nrm[o + NX * 3 + 3 + c] * w11;
    }
    const l = Math.sqrt(out[3] * out[3] + out[4] * out[4] + out[5] * out[5]);
    out[3] /= l;
    out[4] /= l;
    out[5] /= l;
  };
}

/**
 * Dieselben Wischer für das Außenmodell: Die Glaskuppel dort ist gewölbt, also schmiegen sich Arme und
 * Blätter an sie an (wie echte Wischblätter). glassY(x, z): Höhe der Kuppel in Fahrzeug-Koordinaten;
 * material: Material der Welt mit Eckenfarben. Rückgabe: group und set(a0, a1) (Armwinkel wie im Cockpit).
 */
export function buildCarWipers(W, specs, glassY, material) {
  const group = new THREE.Group();
  group.name = 'Wischer';
  const sample = glassGrid(W, glassY);
  const s = new Float32Array(6);
  /**
   * Geometrie aus dem System eines Wischers (Achse bei px/pu, Armwinkel angle, das Teil sitzt bei ox/oy am
   * Arm) auf die Kuppel legen: Lage in der Scheibe wie im Cockpit, Höhe über dem Glas entlang der Normale.
   */
  const wrap = (rest, restN, geo, px, pu, angle, ox, oy) => {
    const P = geo.attributes.position;
    const Nn = geo.attributes.normal;
    const pa = P.array;
    const na = Nn.array;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    for (let i = 0; i < rest.length; i += 3) {
      const lx = rest[i] + ox;
      const ly = rest[i + 1] + oy;
      const lz = rest[i + 2];
      sample(px + lx * cos + ly * sin, pu + lx * sin - ly * cos, s);
      pa[i] = s[0] + s[3] * lz;
      pa[i + 1] = s[1] + s[4] * lz;
      pa[i + 2] = s[2] + s[5] * lz;
      // Normale: Anteile quer (x), die Scheibe hinauf (u) und nach außen, in die Tangentialebene gelegt
      const nx = restN[i] * cos + restN[i + 1] * sin;
      const nu = restN[i] * sin - restN[i + 1] * cos;
      const nz = restN[i + 2];
      const dx = W.X.x * s[3] + W.X.y * s[4] + W.X.z * s[5];
      const du = W.U.x * s[3] + W.U.y * s[4] + W.U.z * s[5];
      const vx = nx * (W.X.x - dx * s[3]) + nu * (W.U.x - du * s[3]) + nz * s[3];
      const vy = nx * (W.X.y - dx * s[4]) + nu * (W.U.y - du * s[4]) + nz * s[4];
      const vz = nx * (W.X.z - dx * s[5]) + nu * (W.U.z - du * s[5]) + nz * s[5];
      const l = Math.sqrt(vx * vx + vy * vy + vz * vz) || 1;
      na[i] = vx / l;
      na[i + 1] = vy / l;
      na[i + 2] = vz / l;
    }
    P.needsUpdate = true;
    Nn.needsUpdate = true;
  };
  const moving = [];
  const fixed = [];
  for (const wp of specs) {
    const px = wp.pivot.x;
    const pu = wp.pivot.clone().sub(W.base).dot(W.U);
    const boot = bootGeometry();
    wrap(boot.attributes.position.array.slice(), boot.attributes.normal.array.slice(), boot, px, pu, 0, 0, 0);
    fixed.push(boot);
    // alle 8 cm eine Stützstelle: genug, damit sich Arm und Blatt der Wölbung anschmiegen
    const parts = wiperParts(wp, 0.08);
    const items = [[parts.arm, 0, 0], [parts.blade, wp.arm, -wp.offset]].map(([geo, ox, oy]) => {
      const mesh = new THREE.Mesh(geo, material);
      // die Ecken wandern mit dem Wischer über die ganze Scheibe: nicht nach der Ruhelage aussortieren
      mesh.frustumCulled = false;
      group.add(mesh);
      return { geo, ox, oy, rest: geo.attributes.position.array.slice(), restN: geo.attributes.normal.array.slice() };
    });
    moving.push({ px, pu, items, angle: null });
  }
  group.add(new THREE.Mesh(mergeGeometries(fixed), material));
  const set = (i, angle) => {
    const m = moving[i];
    if (m.angle !== null && Math.abs(angle - m.angle) < 2e-4) return;
    m.angle = angle;
    for (const it of m.items) wrap(it.rest, it.restN, it.geo, m.px, m.pu, angle, it.ox, it.oy);
  };
  specs.forEach((wp, i) => set(i, wp.park));
  return {
    group,
    set(a0, a1) {
      set(0, a0);
      set(1, a1);
    },
  };
}
