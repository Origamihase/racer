// Schwarzer Tesla Model 3 Long Range AWD (stilisiert, ohne Markenlogos) mit Mini Adam am Steuer.
// Wird für den Kameraschwenk beim Start, die Drohnenkamera und den Titelbildschirm gebraucht.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { W } from '../curve.js';
import { plateTexture, aeroWheelTexture, liveLogoTexture } from '../textures.js';
import { buildMiniAdam } from './miniAdam.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { loft, loftPoint, sideArches, surfacePatch, curve1, withArches, tireGeometry, discX, boxAt } from './loft.js';

export const TESLA = {
  length: 4.69,
  width: 1.85,
  height: 1.443,
  wheelR: 0.335,
  frontAxleZ: 0.84 - 4.69 / 2,
  rearAxleZ: 3.715 - 4.69 / 2,
  trackHalf: 0.79,
  plate: 'F-LV 333',
};

// Augenposition des Fahrers (Fahrzeug-Koordinaten, vorne = -z)
export const DRIVER_EYE = new THREE.Vector3(-0.37, 1.2, 0.27);

const L = TESLA.length;
const ARCH_U = [0.84, 3.715];

// Seitenlinie: Oberkante (Motorhaube → Gürtellinie → Kofferraum)
const topLine = curve1([
  [0, 0.5], [0.03, 0.56], [0.1, 0.625], [0.2, 0.675], [0.45, 0.73], [0.8, 0.79], [1.2, 0.86], [1.52, 0.92],
  [2.4, 0.965], [3.3, 0.995], [3.95, 1.03], [4.25, 1.05], [4.55, 1.055], [4.64, 1.04], [4.69, 0.95],
]);
const bottomBase = curve1([[0, 0.31], [0.06, 0.22], [0.15, 0.18], [0.5, 0.17], [4.3, 0.18], [4.6, 0.25], [4.69, 0.42]]);
const bottomLine = withArches(bottomBase, ARCH_U, 0.405, 0.335);
const halfWidth = curve1([
  [0, 0.6], [0.08, 0.77], [0.25, 0.86], [0.6, 0.905], [1.2, 0.925], [3.6, 0.925], [4.3, 0.9], [4.6, 0.845], [4.69, 0.77],
]);
// Glaskuppel (Frontscheibe, Glasdach, Heckscheibe – beim Model 3 fast alles Glas)
const glassTop = curve1([
  [1.48, 0.93], [1.7, 1.04], [2.0, 1.2], [2.25, 1.35], [2.5, 1.415], [2.8, 1.44], [3.1, 1.44], [3.4, 1.415],
  [3.7, 1.3], [3.95, 1.17], [4.15, 1.075], [4.24, 1.045],
]);
const glassHalf = curve1([[1.48, 0.8], [1.8, 0.84], [3.2, 0.85], [4.0, 0.8], [4.24, 0.74]]);

function uToZ(u) {
  return u - L / 2;
}

// Karosserie und Glas als Loft-Beschreibung (für Geometrie und für Punkte auf der Oberfläche)
const BODY = {
  w: halfWidth, b: bottomBase, t: topLine, tw: 0.9, bw: 0.94, n: 4.6, L,
  // Radläufe nur an den Seiten ausschneiden, der Unterboden bleibt geschlossen
  bx: sideArches(bottomLine, 0.48, 0.7),
};
const GLASS_N = 3.2;
const GLASS_TW = 0.76;
const GLASS = { w: glassHalf, b: (u) => topLine(u) - 0.05, t: glassTop, tw: GLASS_TW, bw: 1, n: GLASS_N, L };
const bodyPoint = (u, phi, target) => loftPoint(BODY, u, phi, target);
const glassPoint = (u, phi, target) => loftPoint(GLASS, u, phi, target);
const lerp = (a, b, t) => a + (b - a) * t;
/** Ab diesem Winkel beginnt das schwarze Glasdach (darunter die Seitenscheiben). */
const ROOF_PHI = 0.34;
/** phi für die linke (s = -1) bzw. rechte (s = 1) Fahrzeugseite. */
const sidePhi = (s, phi) => (s > 0 ? phi : Math.PI - phi);

// Scheinwerfer-Umriss (rechte Seite) als Ober- und Unterkante im (u, phi)-Raum der Karosserie,
// vom inneren Ende an der Front (t = 0) bis zur Spitze am Kotflügel (t = 1)
const HEAD_UP = [[0.05, 1.24], [0.085, 1.0], [0.13, 0.86], [0.24, 0.8], [0.4, 0.76]];
const HEAD_LO = [[0.03, 1.2], [0.025, 0.86], [0.05, 0.54], [0.16, 0.55], [0.4, 0.7]];
function polyAt(pts, t) {
  const f = Math.min(pts.length - 1.000001, Math.max(0, t * (pts.length - 1)));
  const i = Math.floor(f);
  const k = f - i;
  const p0 = pts[Math.max(0, i - 1)];
  const p1 = pts[i];
  const p2 = pts[i + 1];
  const p3 = pts[Math.min(pts.length - 1, i + 2)];
  const cr = (j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * k + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * k * k + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * k * k * k);
  return [cr(0), cr(1)];
}
function headUV(a, t) {
  const up = polyAt(HEAD_UP, t);
  const lo = polyAt(HEAD_LO, t);
  return [lerp(lo[0], up[0], a), lerp(lo[1], up[1], a)];
}

/** Höhe des Glasdachs an Position (u, x) (für Dinge, die auf dem Dach stehen). */
function roofY(u, x) {
  let lo = ROOF_PHI;
  let hi = Math.PI / 2;
  const p = new THREE.Vector3();
  const ax = Math.abs(x);
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    glassPoint(u, mid, p);
    if (p.x > ax) lo = mid;
    else hi = mid;
  }
  return glassPoint(u, (lo + hi) / 2, p).y;
}

export function buildTesla() {
  const root = new THREE.Group();
  root.name = 'Tesla';

  const paint = W.phys({
    color: 0x060708,
    metalness: 0.5,
    roughness: 0.34,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    envMapIntensity: 1.25,
  });
  const glass = W.phys({
    color: 0x05080c,
    metalness: 0.25,
    roughness: 0.04,
    transparent: true,
    opacity: 0.74,
    envMapIntensity: 2.6,
    depthWrite: false,
  });
  const dark = W.std({ color: 0x0b0b0c, roughness: 0.8, side: THREE.DoubleSide });
  const plastic = W.std({ color: 0x141516, roughness: 0.55 });
  const pianoBlack = W.phys({ color: 0x030304, metalness: 0.3, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.08, side: THREE.DoubleSide });
  const headMat = W.std({ color: 0xc8d6e6, emissive: 0xeaf3ff, emissiveIntensity: 1.1, roughness: 0.15, metalness: 0.2, side: THREE.DoubleSide });
  const lampChrome = W.phys({ color: 0xaeb6bf, metalness: 1, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.04, side: THREE.DoubleSide });
  const lampLens = W.phys({ color: 0x0c1016, metalness: 0.5, roughness: 0.1, clearcoat: 1, side: THREE.DoubleSide });
  const tailMat = W.std({ color: 0x4a0606, emissive: 0xff1414, emissiveIntensity: 0.9, roughness: 0.25, side: THREE.DoubleSide });
  const interior = W.std({ color: 0x1b1b1e, roughness: 0.85 });
  const screenMat = W.basic({ color: 0x7fa4c8 });

  // --- Karosserie --------------------------------------------------------
  const bodyGeo = loft({ u0: 0, u1: L, ...BODY, segs: 150, ring: 44, H: 1.5 });
  const body = new THREE.Mesh(bodyGeo, paint);
  body.castShadow = true;
  root.add(body);

  const glassGeo = loft({ u0: 1.48, u1: 4.24, ...GLASS, segs: 70, ring: 32, H: 1.5 });
  const glassMesh = new THREE.Mesh(glassGeo, glass);
  glassMesh.renderOrder = 2;
  root.add(glassMesh);

  // Säulen, Fensterleisten und Glasdach liegen als flache Flächen direkt auf der Glaskuppel
  // (keine Rohre mehr – so sieht es aus wie beim echten Model 3 und nicht wie ein Überrollbügel).
  const trim = [];
  const patchOnGlass = (uv, opts) => surfacePatch(glassPoint, uv, opts);
  for (const s of [-1, 1]) {
    // A-Säule: von der Spiegelecke schräg nach oben bis zur Dachkante
    trim.push(patchOnGlass((a, t) => [lerp(lerp(1.5, 2.25, t), lerp(1.6, 2.36, t), a), sidePhi(s, lerp(-0.74, ROOF_PHI + 0.04, t))], { ns: 2, nt: 18, lift: 0.005 }));
    // B-Säule
    trim.push(patchOnGlass((a, t) => [lerp(2.76, 2.88, a), sidePhi(s, lerp(-0.74, ROOF_PHI + 0.04, t))], { ns: 2, nt: 14, lift: 0.005 }));
    // C-Säule: breite Fläche hinter dem hinteren Seitenfenster (Fließheck)
    trim.push(patchOnGlass((a, t) => [lerp(lerp(4.0, 3.62, t), 4.24, a), sidePhi(s, lerp(-0.74, ROOF_PHI + 0.04, t))], { ns: 8, nt: 14, lift: 0.005 }));
    // Fensterleiste unten (deckt den Übergang Glas/Karosserie ab)
    trim.push(patchOnGlass((a, t) => [lerp(1.52, 4.1, t), sidePhi(s, lerp(-0.86, -0.66, a))], { ns: 2, nt: 30, lift: 0.004 }));
  }
  // Getöntes Glasdach mit Heckscheibe: von außen schwarz glänzend
  trim.push(patchOnGlass((a, t) => [lerp(2.3, 4.24, t), lerp(ROOF_PHI, Math.PI - ROOF_PHI, a)], { ns: 18, nt: 34, lift: 0.004 }));
  const trimMesh = new THREE.Mesh(mergeGeometries(trim), pianoBlack);
  trimMesh.castShadow = true;
  root.add(trimMesh);

  // Radhäuser: dunkle Innenkotflügel über den Reifen (nur außen, wo die Radläufe ausgeschnitten sind)
  // (bis weit nach innen und innen mit einer Wand verschlossen, damit man nicht in die Karosserie sieht)
  const wellParts = [];
  for (const u of ARCH_U) {
    for (const s of [-1, 1]) {
      const liner = new THREE.CylinderGeometry(0.405, 0.405, 0.5, 22, 1, true, 0, Math.PI);
      liner.rotateZ(Math.PI / 2);
      liner.translate(s * 0.665, 0.335, uToZ(u));
      const wall = new THREE.CircleGeometry(0.405, 22, 0, Math.PI);
      wall.rotateY(Math.PI / 2);
      wall.translate(s * 0.415, 0.335, uToZ(u));
      wellParts.push(liner, wall);
    }
  }
  root.add(new THREE.Mesh(mergeGeometries(wellParts), dark));

  // Lufteinlass vorne, Diffusor hinten
  const lip = new THREE.Mesh(
    mergeGeometries([boxAt(0.95, 0.07, 0.05, 0, 0.3, uToZ(0.02)), boxAt(1.1, 0.06, 0.05, 0, 0.34, uToZ(4.62))]),
    plastic,
  );
  root.add(lip);

  // Scheinwerfer (mandelförmig, um die Ecke gezogen) und Rückleuchten (um die Ecke) – liegen auf der Karosserie
  const patchOnBody = (uv, opts) => surfacePatch(bodyPoint, uv, opts);
  const housings = [];
  const lenses = [];
  const drls = [];
  const tails = [];
  for (const s of [-1, 1]) {
    const head = (a, t) => {
      const [u, ph] = headUV(a, t);
      return [u, sidePhi(s, ph)];
    };
    // Chrom-Reflektor unter klarem Glas, darin zwei dunkle Linsen, oben das LED-Tagfahrlicht
    housings.push(patchOnBody(head, { ns: 8, nt: 24, lift: 0.004 }));
    for (const [tc, rt] of [[0.34, 0.1], [0.58, 0.11]]) {
      lenses.push(patchOnBody((r, ang) => head(0.4 + 0.24 * r * Math.cos(ang * Math.PI * 2), tc + rt * r * Math.sin(ang * Math.PI * 2)), { ns: 3, nt: 18, lift: 0.006 }));
    }
    drls.push(patchOnBody((a, t) => head(lerp(0.8, 0.94, a), lerp(0.08, 0.95, t)), { ns: 2, nt: 22, lift: 0.007 }));
    tails.push(patchOnBody((a, t) => [lerp(4.4, 4.672, t), sidePhi(s, lerp(lerp(0.5, 0.36, t), lerp(0.78, 1.0, t), a))], { ns: 6, nt: 14, lift: 0.006 }));
  }
  root.add(new THREE.Mesh(mergeGeometries(housings), lampChrome));
  root.add(new THREE.Mesh(mergeGeometries(lenses), lampLens));
  root.add(new THREE.Mesh(mergeGeometries(drls), headMat));
  const tailMesh = new THREE.Mesh(mergeGeometries(tails), tailMat);
  root.add(tailMesh);

  // Kennzeichen vorne und hinten
  const plateMat = W.std({ map: plateTexture(TESLA.plate), roughness: 0.5 });
  const plateGeo = new THREE.PlaneGeometry(0.52, 0.112);
  const plateF = new THREE.Mesh(plateGeo, plateMat);
  plateF.position.set(0, 0.36, uToZ(0) - 0.012);
  plateF.rotation.y = Math.PI;
  const plateR = new THREE.Mesh(plateGeo, plateMat);
  plateR.position.set(0, 0.62, uToZ(L) + 0.004);
  root.add(plateF, plateR);

  // LIVE-Aufkleber auf dem Kofferraumdeckel (Fan-Detail)
  const sticker = new THREE.Mesh(
    new THREE.PlaneGeometry(0.34, 0.34),
    W.std({ map: liveLogoTexture({ w: 256, h: 256 }), transparent: true, roughness: 0.4, alphaTest: 0.3 }),
  );
  sticker.rotation.x = -Math.PI / 2 + 0.08;
  sticker.position.set(0, topLine(4.42) + 0.006, uToZ(4.42));
  root.add(sticker);

  // Außenspiegel: Gehäuse in Wagenfarbe (nach vorne gewölbt), Spiegelglas hinten bündig, kurzer Fuß zur Tür
  const mirrorParts = [];
  const mirrorGlass = [];
  const mz = uToZ(1.8);
  for (const s of [-1, 1]) {
    const cx = s * 1.0;
    const cy = 1.0;
    const h = new THREE.SphereGeometry(1, 20, 12, Math.PI, Math.PI);
    h.scale(0.115, 0.064, 0.09);
    h.translate(cx, cy, mz);
    mirrorParts.push(h);
    const rim = new THREE.TorusGeometry(1, 0.06, 6, 28);
    rim.scale(0.112, 0.062, 0.12);
    rim.translate(cx, cy, mz + 0.002);
    mirrorParts.push(rim);
    mirrorParts.push(boxAt(0.13, 0.035, 0.07, s * 0.885, 0.965, mz - 0.005, 0, 0, s * 0.25));
    const g = new THREE.CircleGeometry(1, 28);
    g.scale(0.104, 0.055, 1);
    g.translate(cx, cy, mz + 0.004);
    mirrorGlass.push(g);
  }
  const mirrorGeo = mergeGeometries(mirrorParts.map((g) => g.toNonIndexed()));
  root.add(new THREE.Mesh(mirrorGeo, paint));
  root.add(new THREE.Mesh(mergeGeometries(mirrorGlass), W.std({ color: 0x9fb2c4, metalness: 1, roughness: 0.06 })));

  // Räder: Reifen + Aero-Radkappen (drehen sich)
  const tireGeo = tireGeometry(TESLA.wheelR, 0.235, 24);
  const tireMat = W.std({ color: 0x111111, roughness: 0.9 });
  const aeroMat = W.std({ map: aeroWheelTexture(), roughness: 0.45, metalness: 0.5 });
  const wheels = [];
  for (const z of [TESLA.frontAxleZ, TESLA.rearAxleZ]) {
    for (const s of [-1, 1]) {
      const wheel = new THREE.Group();
      wheel.position.set(s * TESLA.trackHalf, TESLA.wheelR, z);
      const tire = new THREE.Mesh(tireGeo, tireMat);
      tire.castShadow = true;
      const cap = new THREE.Mesh(discX(TESLA.wheelR * 0.7, s * 0.119, 0, 0, s), aeroMat);
      wheel.add(tire, cap);
      root.add(wheel);
      wheels.push(wheel);
    }
  }

  // --- Innenraum -------------------------------------------------------
  const rbox = (w, h, d, x, y, z, rx = 0, r = 0.03) => {
    const g = new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001));
    if (rx) g.rotateX(rx);
    g.translate(x, y, z);
    return g;
  };
  const inner = [];
  // Armaturenbrett
  inner.push(rbox(1.56, 0.2, 0.42, 0, 0.82, uToZ(1.72), 0, 0.05));
  // Sitze (gepolstert)
  for (const s of [-1, 1]) {
    inner.push(rbox(0.5, 0.12, 0.5, s * 0.37, 0.5, uToZ(2.72), 0, 0.04));
    inner.push(rbox(0.5, 0.64, 0.12, s * 0.37, 0.86, uToZ(3.0), -0.2, 0.05));
    inner.push(rbox(0.27, 0.19, 0.1, s * 0.37, 1.25, uToZ(3.07), -0.1, 0.045));
  }
  inner.push(rbox(1.36, 0.16, 0.5, 0, 0.5, uToZ(3.62), 0, 0.04));
  inner.push(rbox(1.36, 0.55, 0.12, 0, 0.82, uToZ(3.92), -0.18, 0.05));
  inner.push(rbox(0.22, 0.2, 0.8, 0, 0.55, uToZ(2.6), 0, 0.04)); // Mittelkonsole
  const interiorMesh = new THREE.Mesh(mergeGeometries(inner), interior);
  root.add(interiorMesh);
  // Mittelbildschirm (leuchtet)
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.33, 0.2), screenMat);
  screen.position.set(0, 1.0, uToZ(1.93));
  screen.rotation.x = -0.2;
  root.add(screen);
  // Lenkrad
  const wheelRing = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.022, 10, 28), interior);
  wheelRing.position.set(-0.37, 0.9, uToZ(2.15));
  wheelRing.rotation.x = -0.35;
  root.add(wheelRing);

  // Mini Adam auf einem Kissen hinterm Steuer
  const adam = buildMiniAdam({ curved: true });
  adam.setPose('drive');
  adam.root.position.set(-0.37, 0.4, uToZ(2.62));
  adam.root.rotation.y = Math.PI;
  root.add(adam.root);
  // zwei Kissen, damit Mini Adam über das Lenkrad schauen kann
  const cushion = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.22, 0.07, 18),
    W.phys({ color: 0xb0122b, roughness: 0.9, sheen: 1, sheenColor: new THREE.Color(0xff6680) }),
  );
  cushion.position.set(-0.37, 0.59, uToZ(2.72));
  root.add(cushion);
  const cushion2 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.2, 0.07, 18),
    W.phys({ color: 0x1d4fa0, roughness: 0.9, sheen: 1, sheenColor: new THREE.Color(0x77a8ff) }),
  );
  cushion2.position.set(-0.37, 0.655, uToZ(2.71));
  root.add(cushion2);

  // Innenlicht (nur beim Kameraschwenk hell, damit man Mini Adam gut sieht)
  const cabinLight = new THREE.PointLight(0xfff1dd, 0, 2.2, 1.5);
  cabinLight.position.set(-0.2, 1.3, uToZ(2.4));
  root.add(cabinLight);

  // Stream-Kamera vorne auf dem Glasdach (Saugfuß) + drei Mobilfunkantennen auf Magnetfüßen
  // (Telekom, Vodafone, O₂ gebündelt)
  const gear = [];
  const camU = 2.5;
  const camY = roofY(camU, 0);
  const suction = new THREE.CylinderGeometry(0.05, 0.055, 0.012, 20);
  suction.translate(0, camY + 0.004, uToZ(camU));
  gear.push(suction);
  const neck = new THREE.CylinderGeometry(0.012, 0.016, 0.03, 10);
  neck.translate(0, camY + 0.024, uToZ(camU));
  gear.push(neck);
  gear.push(rbox(0.12, 0.068, 0.1, 0, camY + 0.07, uToZ(camU), 0, 0.012));
  const antU = 3.45;
  for (let i = 0; i < 3; i++) {
    const x = -0.18 + i * 0.18;
    const y = roofY(antU, x);
    const foot = new THREE.CylinderGeometry(0.03, 0.034, 0.014, 16);
    foot.translate(x, y + 0.005, uToZ(antU));
    gear.push(foot);
    const rod = new THREE.CylinderGeometry(0.005, 0.009, 0.17, 8);
    rod.translate(0, 0.085, 0);
    rod.rotateX(0.22); // leicht nach hinten geneigt
    rod.translate(x, y + 0.01, uToZ(antU));
    gear.push(rod);
    const tip = new THREE.SphereGeometry(0.009, 8, 6);
    tip.translate(0, 0.17, 0);
    tip.rotateX(0.22);
    tip.translate(x, y + 0.01, uToZ(antU));
    gear.push(tip);
  }
  root.add(new THREE.Mesh(mergeGeometries(gear.map((g) => (g.index ? g.toNonIndexed() : g))), plastic));
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.025, 14), W.std({ color: 0x223344, metalness: 0.9, roughness: 0.1 }));
  lens.position.set(0, camY + 0.07, uToZ(camU) - 0.051);
  lens.rotation.y = Math.PI;
  root.add(lens);
  const recLed = new THREE.Mesh(new THREE.SphereGeometry(0.008, 8, 6), W.basic({ color: 0xff2222 }));
  recLed.position.set(0.04, camY + 0.092, uToZ(camU) - 0.048);
  root.add(recLed);

  // Starlink-Schüssel (Shop)
  const starlink = new THREE.Group();
  const dishMat = W.std({ color: 0xf2f2f2, roughness: 0.5 });
  const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.27, 0.035, 28), dishMat);
  dish.rotation.x = -0.35;
  dish.position.y = 0.16;
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.16, 8), dishMat);
  mast.position.y = 0.08;
  starlink.add(dish, mast);
  starlink.position.set(0, roofY(3.05, 0), uToZ(3.05));
  starlink.visible = false;
  root.add(starlink);

  root.traverse((o) => {
    if (o.isMesh && o !== glassMesh) o.castShadow = true;
  });

  let wheelAngle = 0;
  let brake = false;

  return {
    root,
    adam,
    glass,
    wheels,
    cabinLight,
    recLed,
    setStarlink(v) {
      starlink.visible = !!v;
    },
    setVest(v) {
      adam.setVest(v);
    },
    setBrake(b) {
      if (b === brake) return;
      brake = b;
      tailMat.emissiveIntensity = b ? 3.2 : 0.9;
    },
    update(dt, speed, steer, t) {
      wheelAngle -= (speed * dt) / TESLA.wheelR;
      for (let i = 0; i < wheels.length; i++) {
        wheels[i].rotation.x = wheelAngle;
        if (i < 2) wheels[i].rotation.y = -steer * 0.35;
      }
      recLed.visible = Math.sin(t * 4) > -0.2;
    },
  };
}
