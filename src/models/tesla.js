// Schwarzer Tesla Model 3 Long Range AWD (stilisiert, ohne Markenlogos) mit Mini Adam am Steuer.
// Wird für den Kameraschwenk beim Start, die Drohnenkamera und den Titelbildschirm gebraucht.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { W } from '../curve.js';
import { plateTexture, aeroWheelTexture, liveLogoTexture } from '../textures.js';
import { buildMiniAdam } from './miniAdam.js';
import { loft, curve1, withArches, tireGeometry, discX, boxAt } from './loft.js';

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

// Punkt auf der Glaskuppel (gleiche Formel wie die Loft-Geometrie): phi 0 = rechte Seite, π/2 = oben
const GLASS_N = 3.2;
const GLASS_TW = 0.76;
function glassPoint(u, phi, out = 1) {
  const e = 2 / GLASS_N;
  const c = Math.cos(phi);
  const s = Math.sin(phi);
  const X = Math.sign(c) * Math.pow(Math.abs(c), e);
  const Y = Math.sign(s) * Math.pow(Math.abs(s), e);
  const bb = topLine(u) - 0.05;
  const tt = Math.max(glassTop(u), bb + 0.002);
  const y = bb + ((Y + 1) / 2) * (tt - bb);
  const wf = Y > 0 ? 1 + (GLASS_TW - 1) * Y : 1;
  return new THREE.Vector3(X * glassHalf(u) * wf * out, y + (out - 1) * 0.4, uToZ(u));
}
const lerp = (a, b, t) => a + (b - a) * t;
/** Ab diesem Winkel beginnt das schwarze Glasdach (darunter die Seitenscheiben). */
const ROOF_PHI = 0.34;

export function buildTesla() {
  const root = new THREE.Group();
  root.name = 'Tesla';

  const paint = W.phys({
    color: 0x060708,
    metalness: 0.5,
    roughness: 0.3,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
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
  const trimMat = W.std({ color: 0x2a2c2f, metalness: 0.7, roughness: 0.35 });
  const headMat = W.std({ color: 0x334455, emissive: 0xdfeeff, emissiveIntensity: 1.2, roughness: 0.2, metalness: 0.3 });
  const tailMat = W.std({ color: 0x3a0505, emissive: 0xff1010, emissiveIntensity: 0.9, roughness: 0.25 });
  const interior = W.std({ color: 0x18181a, roughness: 0.85 });
  const screenMat = W.basic({ color: 0x7fa4c8 });

  // --- Karosserie --------------------------------------------------------
  const bodyGeo = loft({
    u0: 0, u1: L, w: halfWidth, b: bottomLine, t: topLine, tw: 0.9, bw: 0.94, n: 4.6, segs: 120, ring: 32, L, H: 1.5,
  });
  const body = new THREE.Mesh(bodyGeo, paint);
  body.castShadow = true;
  root.add(body);

  const glassGeo = loft({
    u0: 1.48, u1: 4.24, w: glassHalf, b: (u) => topLine(u) - 0.05, t: glassTop, tw: GLASS_TW, bw: 1, n: GLASS_N, segs: 70, ring: 28, L, H: 1.5,
  });
  const glassMesh = new THREE.Mesh(glassGeo, glass);
  glassMesh.renderOrder = 2;
  root.add(glassMesh);

  // A-Säulen, B-Säulen und Fensterrahmen (schwarz-matt) – liegen direkt auf der Glaskuppel
  const pillarParts = [];
  const tube = (pts, r) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), Math.max(8, pts.length * 3), r, 7, false);
  for (const s of [-1, 1]) {
    const side = (phi) => (s > 0 ? phi : Math.PI - phi);
    // A-Säule entlang der Frontscheibenkante
    const aPts = [];
    for (let i = 0; i <= 10; i++) {
      const u = 1.53 + i * 0.085;
      aPts.push(glassPoint(u, side(lerp(-0.2, ROOF_PHI, Math.min(1, i / 4))), 1.012));
    }
    pillarParts.push(tube(aPts, 0.026));
    // B-Säule (breiter, flach)
    const bPts = [];
    for (let i = 0; i <= 8; i++) bPts.push(glassPoint(2.82, side(lerp(-0.55, ROOF_PHI + 0.04, i / 8)), 1.012));
    const bGeo = tube(bPts, 0.034);
    pillarParts.push(bGeo);
    // C-Säule
    const cPts = [];
    for (let i = 0; i <= 8; i++) cPts.push(glassPoint(3.82, side(lerp(-0.55, ROOF_PHI + 0.04, i / 8)), 1.012));
    pillarParts.push(tube(cPts, 0.03));
    // Fensterunterkante und Dachkante
    const fPts = [];
    const rPts = [];
    for (let i = 0; i <= 12; i++) {
      const u = 1.62 + i * 0.2;
      fPts.push(glassPoint(u, side(-0.62), 1.012));
      if (u > 2.3 && u < 4.05) rPts.push(glassPoint(u, side(ROOF_PHI), 1.012));
    }
    pillarParts.push(tube(fPts, 0.016));
    pillarParts.push(tube(rPts, 0.014));
  }
  // Oberkante der Frontscheibe
  const headPts = [];
  for (let i = 0; i <= 12; i++) headPts.push(glassPoint(2.36, lerp(ROOF_PHI, Math.PI - ROOF_PHI, i / 12), 1.01));
  pillarParts.push(tube(headPts, 0.014));
  const pillars = new THREE.Mesh(mergeGeometries(pillarParts.map((g) => g.toNonIndexed())), plastic);
  root.add(pillars);

  // Getöntes Glasdach: von außen schwarz glänzend wie beim echten Model 3
  {
    const NU = 26;
    const NP = 14;
    const pos = [];
    const idx = [];
    for (let i = 0; i <= NU; i++) {
      const u = lerp(2.34, 4.05, i / NU);
      for (let j = 0; j <= NP; j++) {
        const phi = lerp(ROOF_PHI - 0.02, Math.PI - ROOF_PHI + 0.02, j / NP);
        const p = glassPoint(u, phi, 1.004);
        pos.push(p.x, p.y, p.z);
      }
    }
    for (let i = 0; i < NU; i++) {
      for (let j = 0; j < NP; j++) {
        const a = i * (NP + 1) + j;
        const b = a + NP + 1;
        idx.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
    const roofGeo = new THREE.BufferGeometry();
    roofGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    roofGeo.setIndex(idx);
    roofGeo.computeVertexNormals();
    const roofMat = W.phys({
      color: 0x020203,
      metalness: 0.55,
      roughness: 0.07,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      envMapIntensity: 1.7,
      side: THREE.DoubleSide,
    });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    root.add(roof);
  }

  // Radhäuser (verhindern den Durchblick) + Unterboden
  const wellGeo = new THREE.CylinderGeometry(0.41, 0.41, 1.66, 18, 1, true, 0, Math.PI);
  wellGeo.rotateZ(Math.PI / 2);
  for (const u of ARCH_U) {
    const well = new THREE.Mesh(wellGeo, dark);
    well.position.set(0, 0.335, uToZ(u));
    root.add(well);
  }
  const floor = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.04, 3.9), dark);
  floor.position.set(0, 0.2, 0.05);
  root.add(floor);

  // Lufteinlass vorne, Diffusor hinten
  const lip = new THREE.Mesh(
    mergeGeometries([boxAt(0.95, 0.07, 0.05, 0, 0.3, uToZ(0.02)), boxAt(1.25, 0.09, 0.06, 0, 0.3, uToZ(4.66))]),
    plastic,
  );
  root.add(lip);

  // Scheinwerfer (schmal, nach hinten gezogen) und Rückleuchten (um die Ecke)
  const heads = [];
  const tails = [];
  for (const s of [-1, 1]) {
    heads.push(boxAt(0.34, 0.055, 0.2, s * 0.6, 0.655, uToZ(0.2), 0.18, s * -0.5, 0));
    tails.push(boxAt(0.4, 0.07, 0.17, s * 0.6, 0.965, uToZ(4.6), 0, s * 0.42, 0));
    tails.push(boxAt(0.2, 0.05, 0.04, s * 0.22, 0.99, uToZ(4.665)));
  }
  root.add(new THREE.Mesh(mergeGeometries(heads), headMat));
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

  // Außenspiegel
  const mirrorParts = [];
  const mirrorGlass = [];
  for (const s of [-1, 1]) {
    const h = new THREE.SphereGeometry(1, 14, 10);
    h.scale(0.12, 0.065, 0.075);
    h.translate(s * 1.01, 0.985, uToZ(1.78));
    mirrorParts.push(h);
    mirrorParts.push(boxAt(0.12, 0.03, 0.05, s * 0.93, 0.965, uToZ(1.8)));
    mirrorGlass.push(boxAt(0.2, 0.09, 0.01, s * 1.01, 0.985, uToZ(1.78) + 0.075));
  }
  root.add(new THREE.Mesh(mergeGeometries(mirrorParts), paint));
  root.add(new THREE.Mesh(mergeGeometries(mirrorGlass), W.std({ color: 0x8899aa, metalness: 1, roughness: 0.05 })));

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
  const inner = [];
  // Armaturenbrett
  inner.push(boxAt(1.56, 0.2, 0.42, 0, 0.82, uToZ(1.72)));
  // Sitze
  for (const s of [-1, 1]) {
    inner.push(boxAt(0.5, 0.12, 0.5, s * 0.37, 0.5, uToZ(2.72)));
    inner.push(boxAt(0.5, 0.64, 0.12, s * 0.37, 0.86, uToZ(3.0), -0.2, 0, 0));
    inner.push(boxAt(0.27, 0.19, 0.1, s * 0.37, 1.25, uToZ(3.07), -0.1, 0, 0));
  }
  inner.push(boxAt(1.36, 0.16, 0.5, 0, 0.5, uToZ(3.62)));
  inner.push(boxAt(1.36, 0.55, 0.12, 0, 0.82, uToZ(3.92), -0.18, 0, 0));
  inner.push(boxAt(0.22, 0.2, 0.8, 0, 0.55, uToZ(2.6))); // Mittelkonsole
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

  // Stream-Kamera vorne am Glasdach + drei Mobilfunkantennen (Telekom, Vodafone, O₂ gebündelt)
  const gear = [];
  gear.push(boxAt(0.12, 0.07, 0.1, 0.0, glassTop(2.45) + 0.03, uToZ(2.45)));
  for (let i = 0; i < 3; i++) {
    const g = new THREE.CylinderGeometry(0.008, 0.012, 0.16, 6);
    g.translate(-0.2 + i * 0.2, glassTop(3.5) + 0.08, uToZ(3.5));
    gear.push(g);
  }
  root.add(new THREE.Mesh(mergeGeometries(gear), plastic));
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.025, 14), W.std({ color: 0x223344, metalness: 0.9, roughness: 0.1 }));
  lens.position.set(0, glassTop(2.45) + 0.03, uToZ(2.45) - 0.051);
  lens.rotation.y = Math.PI;
  root.add(lens);
  const recLed = new THREE.Mesh(new THREE.SphereGeometry(0.008, 8, 6), W.basic({ color: 0xff2222 }));
  recLed.position.set(0.04, glassTop(2.45) + 0.055, uToZ(2.45) - 0.05);
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
  starlink.position.set(0, glassTop(3.05), uToZ(3.05));
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

// Zylinder zwischen zwei Punkten (für Säulen/Leisten)
function stick(a, b, r) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const g = new THREE.CylinderGeometry(r, r, len, 8);
  g.translate(0, len / 2, 0);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  g.applyQuaternion(q);
  g.translate(a.x, a.y, a.z);
  return g;
}
