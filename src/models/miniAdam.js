// Mini Adam – stilisierte Plüschfigur nach dem Fan-Plüsch: schwarze Cap mit LIVE-Logo hoch auf dem Kopf,
// große Kulleraugen, dicke Nase, Schnurrbart und Bart, dunkle Haare, schwarzes T-Shirt mit kurzen Ärmeln,
// Plüscharme mit Ellbogen und Fäustlingshänden, dunkelgraue Hose, Handmikrofon. Komplett aus Grundformen.
import * as THREE from 'three';
import { curve } from '../curve.js';
import { liveLogoTexture, fabricTexture } from '../textures.js';

const COLORS = {
  skin: 0xd9a477,
  skinDark: 0xc98b62,
  black: 0x141416,
  shirt: 0x161618,
  hair: 0x3a281c,
  beard: 0x2b1d14,
  pants: 0x34353a,
  shoe: 0x0f0f10,
  white: 0xf7f5f0,
  mouth: 0x6b2a25,
};

/** Hauptmaße (Körperkoordinaten, Figur schaut nach +z) */
export const ADAM_DIM = {
  shoulder: [0.165, 0.53, 0],
  upperArm: 0.15,
  foreArm: 0.14,
  head: 0.745,
};

let sharedFabric = null;

function plush(color, curved, { sheen = 0.9, rough = 0.95, side = THREE.FrontSide } = {}) {
  if (!sharedFabric) sharedFabric = fabricTexture(11);
  const m = new THREE.MeshPhysicalMaterial({
    color,
    roughness: rough,
    metalness: 0,
    sheen,
    sheenRoughness: 0.55,
    sheenColor: new THREE.Color(color).lerp(new THREE.Color(0xffffff), 0.35),
    bumpMap: sharedFabric,
    bumpScale: 0.6,
    side,
  });
  return curved ? curve(m) : m;
}

function plain(color, curved, params = {}) {
  const m = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0, ...params });
  return curved ? curve(m) : m;
}

function capsule(r, len, mat, segs = 10) {
  return new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 6, segs), mat);
}

function sphere(r, mat, ws = 18, hs = 14) {
  return new THREE.Mesh(new THREE.SphereGeometry(r, ws, hs), mat);
}

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// --- Arme per Zwei-Knochen-IK -------------------------------------------------------------
// Die Hände folgen Zielpunkten in Körperkoordinaten (Lenkradkranz bzw. Winkposition neben dem Kopf),
// Ellbogen zeigen in eine vorgegebene Richtung, die Handfläche in eine vorgegebene Richtung.
const V = () => new THREE.Vector3();
const ik = { d: V(), u: V(), v: V(), e: V(), u1: V(), u2: V(), x: V(), y: V(), z: V(), down: new THREE.Vector3(0, -1, 0), m: new THREE.Matrix4(), q: new THREE.Quaternion() };

/** Setzt Oberarm (arm) und Unterarm (elbow) so, dass die Hand auf target liegt. */
export function solveArm(arm, target, pole, palm) {
  const S = arm.position;
  const d = ik.d.subVectors(target, S);
  let len = d.length();
  const a = ADAM_DIM.upperArm;
  const b = ADAM_DIM.foreArm;
  const maxL = a + b - 0.003;
  const minL = Math.abs(a - b) + 0.03;
  if (len < 1e-6) d.set(0, -1, 0), (len = 1);
  const u = ik.u.copy(d).divideScalar(len);
  len = Math.min(maxL, Math.max(minL, len));
  const v = ik.v.copy(pole).addScaledVector(u, -pole.dot(u));
  if (v.lengthSq() < 1e-8) v.set(0, -1, 0).addScaledVector(u, -u.y);
  v.normalize();
  const cosA = Math.min(1, Math.max(-1, (a * a + len * len - b * b) / (2 * a * len)));
  const sinA = Math.sqrt(1 - cosA * cosA);
  const u1 = ik.u1.copy(u).multiplyScalar(cosA).addScaledVector(v, sinA);
  const e = ik.e.copy(S).addScaledVector(u1, a);
  const u2 = ik.u2.copy(S).addScaledVector(u, len).sub(e).normalize();
  arm.quaternion.setFromUnitVectors(ik.down, u1);
  // Unterarm + Hand: -y entlang des Unterarms, +z = Handfläche
  const y = ik.y.copy(u2).negate();
  const z = ik.z.copy(palm).addScaledVector(y, -palm.dot(y));
  if (z.lengthSq() < 1e-8) z.set(0, 0, 1).addScaledVector(y, -y.z);
  z.normalize();
  const x = ik.x.crossVectors(y, z);
  ik.m.makeBasis(x, y, z);
  ik.q.setFromRotationMatrix(ik.m);
  arm.userData.elbow.quaternion.copy(arm.quaternion).invert().multiply(ik.q);
}

/**
 * Zielpunkte für die Hände (Körperkoordinaten). wheel = { m: Matrix4 Lenkrad → Körper, r }.
 * wave 0 … 1 führt die Fensterhand (rechte Hand der Figur, side = 1) vom Lenkrad vor der Schulter
 * hoch und dann seitlich neben den Kopf – bleibt dabei im Innenraum.
 */
const WAVE_POS = new THREE.Vector3(0.292, 0.765, 0.04);
const WAVE_VIA = new THREE.Vector3(0.255, 0.6, 0.13);
const WAVE_PALM = new THREE.Vector3(0.55, -0.1, 0.83).normalize();
const WAVE_POLE = new THREE.Vector3(1, -0.45, -0.1).normalize();
const gripTmp = { p: V(), n: V(), c: V(), pole: V(), palm: V(), a: V(), b: V() };

export function handTarget(side, wheel, { wave = 0, steer = 0, t = 0 } = {}, out = { pos: V(), pole: V(), palm: V() }) {
  // Griff am Kranz: rechte Hand der Figur (Fensterseite) bei etwa halb zehn, linke bei halb drei
  const phi = (side > 0 ? Math.PI - 0.3 : 0.3) + steer * 0.5;
  const c = Math.cos(phi);
  const s = Math.sin(phi);
  const r = wheel.r + 0.012;
  out.pos.set(c * r, s * r, 0.026).applyMatrix4(wheel.m);
  // Handfläche zur Lenkradmitte und etwas nach vorne, Ellbogen hängen locker nach unten-außen
  gripTmp.n.set(-c, -s, -0.45).transformDirection(wheel.m);
  out.palm.copy(gripTmp.n);
  out.pole.set(side * 0.55, -1, -0.15).normalize();
  if (side > 0 && wave > 0) {
    const w = wave;
    // quadratische Bézierkurve Lenkrad → vor der Schulter → neben dem Kopf
    const k0 = (1 - w) * (1 - w);
    const k1 = 2 * (1 - w) * w;
    const k2 = w * w;
    gripTmp.a.copy(out.pos).multiplyScalar(k0).addScaledVector(WAVE_VIA, k1).addScaledVector(WAVE_POS, k2);
    // Winken: Hand pendelt seitlich, nur wenn sie oben ist
    const wig = smooth(0.7, 1, w);
    gripTmp.a.x += Math.sin(t * 9) * 0.026 * wig;
    gripTmp.a.y += Math.abs(Math.cos(t * 9)) * 0.008 * wig;
    out.pos.copy(gripTmp.a);
    out.pole.lerp(WAVE_POLE, smooth(0.15, 0.85, w)).normalize();
    out.palm.lerp(WAVE_PALM, smooth(0.2, 0.9, w)).normalize();
  }
  return out;
}

/**
 * Baut Mini Adam. Höhe stehend ≈ 1 Einheit (wird vom Aufrufer skaliert).
 * @param {{curved?: boolean}} opts
 */
export function buildMiniAdam({ curved = true } = {}) {
  const root = new THREE.Group();
  root.name = 'MiniAdam';

  const mSkin = plush(COLORS.skin, curved);
  const mNose = plush(COLORS.skinDark, curved);
  const mShirt = plush(COLORS.shirt, curved, { sheen: 0.6 });
  // Ärmel und Cap sind offen: innen dieselbe Farbe statt durchsichtig
  const mSleeve = plush(COLORS.shirt, curved, { sheen: 0.6, side: THREE.DoubleSide });
  const mCap = plush(COLORS.black, curved, { sheen: 0.5, side: THREE.DoubleSide });
  const mHair = plush(COLORS.hair, curved, { sheen: 1, rough: 1 });
  const mBeard = plush(COLORS.beard, curved, { sheen: 1, rough: 1 });
  const mPants = plush(COLORS.pants, curved, { sheen: 0.7 });
  const mShoe = plush(COLORS.shoe, curved, { sheen: 0.4 });
  const mEye = plain(COLORS.white, curved, { roughness: 0.25 });
  const mPupil = plain(0x0a0a0a, curved, { roughness: 0.15 });
  const mMouth = plain(COLORS.mouth, curved, { roughness: 0.6 });
  const mMic = plain(0x1a1a1a, curved, { roughness: 0.35, metalness: 0.4 });
  const mMicHead = plain(0x3c3c3c, curved, { roughness: 0.8, metalness: 0.3 });

  const logoTex = liveLogoTexture({ w: 256, h: 256 });
  const mLogo = new THREE.MeshStandardMaterial({
    map: logoTex, transparent: true, roughness: 0.9, alphaTest: 0.2,
    polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1,
  });
  if (curved) curve(mLogo);

  // --- Körper -------------------------------------------------------------
  const body = new THREE.Group();
  body.name = 'body';
  root.add(body);

  const torso = capsule(0.15, 0.12, mShirt, 14);
  torso.scale.set(1.08, 1, 0.86);
  torso.position.y = 0.43;
  body.add(torso);

  // LIVE-Logo auf der Brust (leicht gewölbte Fläche)
  const chestLogo = new THREE.Mesh(new THREE.CylinderGeometry(0.152, 0.152, 0.16, 20, 1, true, -0.62, 1.24), mLogo);
  chestLogo.scale.set(1.08, 1, 0.86);
  chestLogo.position.set(0, 0.45, 0);
  body.add(chestLogo);

  // Arme: runde Schulter im Shirt, kurzer Ärmel, Plüsch-Oberarm, Ellbogen, Unterarm, Fäustlingshand
  const sleeveGeo = new THREE.CylinderGeometry(0.058, 0.066, 0.085, 16, 1, true);
  const armL = new THREE.Group();
  const armR = new THREE.Group();
  const [sx, sy] = ADAM_DIM.shoulder;
  armL.position.set(-sx, sy, 0);
  armR.position.set(sx, sy, 0);
  body.add(armL, armR);
  for (const [arm, side] of [[armL, -1], [armR, 1]]) {
    const shoulder = sphere(0.063, mShirt, 16, 12);
    arm.add(shoulder);
    const sleeve = new THREE.Mesh(sleeveGeo, mSleeve);
    sleeve.position.y = -0.045;
    arm.add(sleeve);
    const upper = capsule(0.041, 0.1, mSkin);
    upper.position.y = -0.085;
    arm.add(upper);
    const elbow = new THREE.Group();
    elbow.position.y = -ADAM_DIM.upperArm;
    arm.add(elbow);
    const fore = capsule(0.039, 0.085, mSkin);
    fore.position.y = -0.062;
    elbow.add(fore);
    const hand = new THREE.Group();
    hand.position.y = -ADAM_DIM.foreArm;
    elbow.add(hand);
    // Fäustling: flache, ovale Handfläche mit abstehendem Daumen
    const palm = sphere(0.05, mSkin);
    palm.scale.set(1, 1.12, 0.64);
    hand.add(palm);
    const thumb = capsule(0.017, 0.026, mSkin, 8);
    thumb.position.set(side * 0.042, 0.006, 0.012);
    thumb.rotation.z = -side * 0.75;
    hand.add(thumb);
    arm.userData.elbow = elbow;
    arm.userData.hand = hand;
  }

  // Mikrofon (in der rechten Hand)
  const mic = new THREE.Group();
  const micBody = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.012, 0.13, 12), mMic);
  micBody.position.y = -0.02;
  const micHead = sphere(0.03, mMicHead, 14, 10);
  micHead.position.y = 0.065;
  mic.add(micBody, micHead);
  mic.position.set(0, 0.02, 0.035);
  armR.userData.hand.add(mic);

  // Beine
  const legs = new THREE.Group();
  body.add(legs);
  const legL = new THREE.Group();
  const legR = new THREE.Group();
  legL.position.set(-0.075, 0.29, 0);
  legR.position.set(0.075, 0.29, 0);
  legs.add(legL, legR);
  for (const leg of [legL, legR]) {
    const thigh = capsule(0.072, 0.13, mPants);
    thigh.position.y = -0.11;
    leg.add(thigh);
    const shoe = sphere(0.075, mShoe);
    shoe.scale.set(1.0, 0.7, 1.35);
    shoe.position.set(0, -0.245, 0.03);
    leg.add(shoe);
    leg.userData.shoe = shoe;
    leg.userData.thigh = thigh;
  }

  // --- Kopf ---------------------------------------------------------------
  const head = new THREE.Group();
  head.position.y = ADAM_DIM.head;
  body.add(head);

  const skull = sphere(0.16, mSkin, 28, 22);
  skull.scale.set(1, 1, 0.95);
  head.add(skull);

  // Ohren
  for (const s of [-1, 1]) {
    const ear = sphere(0.035, mSkin);
    ear.scale.set(0.6, 1, 0.8);
    ear.position.set(s * 0.158, -0.005, -0.01);
    head.add(ear);
  }

  // Haare: wuschelige Büschel hinten und an den Seiten (schauen unter der Cap hervor)
  const hairPuffs = [
    [0, 0.0, -0.13, 0.085], [-0.08, -0.02, -0.12, 0.075], [0.08, -0.02, -0.12, 0.075],
    [-0.13, 0.01, -0.06, 0.07], [0.13, 0.01, -0.06, 0.07], [-0.145, -0.04, 0.0, 0.055], [0.145, -0.04, 0.0, 0.055],
    [-0.05, -0.07, -0.13, 0.07], [0.05, -0.07, -0.13, 0.07], [0, 0.03, -0.11, 0.08],
  ];
  for (const [x, y, z, r] of hairPuffs) {
    const p = sphere(r, mHair, 12, 10);
    p.position.set(x, y, z);
    p.scale.set(1, 0.9, 0.9);
    head.add(p);
  }

  // Bart (unterer Teil des Gesichts) + Koteletten
  const beard = new THREE.Mesh(
    new THREE.SphereGeometry(0.168, 26, 16, Math.PI / 2 - 1.35, 2.7, Math.PI * 0.55, Math.PI * 0.38),
    mBeard,
  );
  head.add(beard);
  const chin = sphere(0.075, mBeard);
  chin.scale.set(1.25, 0.8, 0.9);
  chin.position.set(0, -0.125, 0.08);
  head.add(chin);
  for (const s of [-1, 1]) {
    const side = sphere(0.05, mBeard, 10, 8);
    side.position.set(s * 0.13, -0.05, 0.05);
    side.scale.set(0.8, 1.4, 1);
    head.add(side);
  }
  // Schnurrbart: kommt unter der Nase hervor, die Enden etwas nach unten
  const stache = new THREE.Group();
  stache.position.set(0, -0.062, 0.151);
  head.add(stache);
  for (const s of [-1, 1]) {
    const half = capsule(0.02, 0.04, mBeard, 8);
    half.rotation.z = Math.PI / 2 + s * 0.32;
    half.position.set(s * 0.03, -0.006, -0.004);
    stache.add(half);
  }
  // Mund (kleines Lächeln im Bart)
  const mouth = sphere(0.026, mMouth, 12, 8);
  mouth.scale.set(1.3, 0.55, 0.5);
  mouth.position.set(0, -0.095, 0.146);
  head.add(mouth);

  // Nase (prominent, wie beim Plüsch)
  const nose = sphere(0.043, mNose, 16, 12);
  nose.scale.set(1.05, 0.95, 0.9);
  nose.position.set(0, -0.016, 0.162);
  head.add(nose);

  // Augen: große weiße Kulleraugen direkt über der Nase, Pupillen mit Lichtpunkt
  const eyes = new THREE.Group();
  head.add(eyes);
  for (const s of [-1, 1]) {
    const ex = s * 0.057;
    const ey = 0.026;
    const ez = 0.141;
    const eye = sphere(0.036, mEye, 18, 14);
    eye.scale.set(0.86, 1.12, 0.48);
    eye.position.set(ex, ey, ez);
    const pupil = sphere(0.0165, mPupil, 14, 10);
    pupil.scale.set(1, 1.15, 0.42);
    pupil.position.set(ex - s * 0.002, ey - 0.002, ez + 0.0125);
    const glint = sphere(0.0048, mEye, 8, 6);
    glint.position.set(ex - s * 0.002 + 0.006, ey + 0.006, ez + 0.0185);
    eyes.add(eye, pupil, glint);
  }
  // Augenbrauen: zwischen Augen und Cap-Rand
  for (const s of [-1, 1]) {
    const brow = capsule(0.009, 0.034, mHair, 6);
    brow.rotation.z = Math.PI / 2 + s * 0.2;
    brow.position.set(s * 0.058, 0.077, 0.133);
    head.add(brow);
  }

  // Cap: sitzt hoch auf dem Kopf und ist leicht nach hinten gekippt, der Schirm endet über den Augen
  const CAP_R = 0.166;
  const cap = new THREE.Group();
  cap.position.y = 0.093;
  cap.rotation.x = -0.14;
  head.add(cap);
  const crown = new THREE.Mesh(new THREE.SphereGeometry(CAP_R, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), mCap);
  crown.scale.set(1, 0.74, 1);
  cap.add(crown);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(CAP_R + 0.001, CAP_R + 0.003, 0.03, 28, 1, true), mCap);
  band.position.y = -0.012;
  cap.add(band);
  // Schirm: hinten der Rundung des Bands folgend, vorne oval
  const bw = 0.13;
  const zb = (x) => Math.sqrt(CAP_R * CAP_R - x * x) - 0.012;
  const brimShape = new THREE.Shape();
  brimShape.moveTo(-bw, zb(-bw));
  brimShape.quadraticCurveTo(-bw - 0.012, CAP_R + 0.07, 0, CAP_R + 0.088);
  brimShape.quadraticCurveTo(bw + 0.012, CAP_R + 0.07, bw, zb(bw));
  for (let i = 1; i < 12; i++) {
    const x = bw - (2 * bw * i) / 12;
    brimShape.lineTo(x, zb(x));
  }
  brimShape.lineTo(-bw, zb(-bw));
  const brimGeo = new THREE.ExtrudeGeometry(brimShape, { depth: 0.008, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.005, bevelSegments: 2, curveSegments: 10 });
  brimGeo.deleteAttribute('uv');
  const brim = new THREE.Mesh(brimGeo, mCap);
  brim.rotation.x = Math.PI / 2 - 0.1;
  brim.position.set(0, -0.022, 0);
  cap.add(brim);
  const button = sphere(0.016, mCap, 10, 8);
  button.scale.set(1, 0.55, 1);
  button.position.y = CAP_R * 0.74;
  cap.add(button);
  // LIVE-Logo als Stück der Kuppel: liegt überall dicht auf und kippt mit der Cap
  const capLogo = new THREE.Mesh(new THREE.SphereGeometry(CAP_R + 0.0016, 24, 8, Math.PI / 2 - 0.45, 0.9, 0.62, 0.86), mLogo);
  capLogo.scale.set(1, 0.74, 1);
  cap.add(capLogo);

  // Warnweste (optional, aus dem Shop): Weste um den Oberkörper, Kragen und Schulterstücke
  // schauen auch über die Türkante (beim Kameraschwenk und im Titelbild zu sehen)
  const vestMat = plain(0xd7ff1f, curved, { roughness: 0.6, emissive: 0x3a4a00, emissiveIntensity: 0.25 });
  const stripeMat = plain(0xd8d8d8, curved, { roughness: 0.2, metalness: 0.6 });
  const vest = new THREE.Group();
  const vestBody = new THREE.Mesh(new THREE.CylinderGeometry(0.168, 0.165, 0.2, 18, 1, true), vestMat);
  vestBody.scale.set(1.08, 1, 0.88);
  vestBody.position.y = 0.43;
  vest.add(vestBody);
  const yoke = new THREE.Mesh(new THREE.CylinderGeometry(0.118, 0.168, 0.075, 18, 1, true), vestMat);
  yoke.scale.set(1.08, 1, 0.88);
  yoke.position.y = 0.567;
  vest.add(yoke);
  for (const s of [-1, 1]) {
    // deckt die runde Schulter samt Ärmelansatz ganz ab (sonst schaut Schwarz durch)
    const pad = sphere(0.071, vestMat, 18, 12);
    pad.position.set(s * sx, sy + 0.002, 0);
    vest.add(pad);
  }
  for (const y of [0.38, 0.47]) {
    const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.022, 18, 1, true), stripeMat);
    stripe.scale.set(1.08, 1, 0.88);
    stripe.position.y = y;
    vest.add(stripe);
  }
  vest.visible = false;
  body.add(vest);

  root.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = false;
    }
  });

  // Lenkrad (von außen gesehen): wird vom Auto gesetzt, Standard: vor der Brust
  const wheel = { m: new THREE.Matrix4().makeRotationX(0.35).setPosition(0, 0.44, 0.22), r: 0.17 };
  const targets = [{ pos: V(), pole: V(), palm: V() }, { pos: V(), pole: V(), palm: V() }];
  const poseArms = (o) => {
    for (const [arm, side, tg] of [[armL, -1, targets[0]], [armR, 1, targets[1]]]) {
      handTarget(side, wheel, o, tg);
      solveArm(arm, tg.pos, tg.pole, tg.palm);
      arm.userData.hand.rotation.set(0, 0, side > 0 ? Math.sin(t9(o) - 0.6) * 0.3 * smooth(0.7, 1, o.wave || 0) : 0);
    }
  };
  const t9 = (o) => (o.t || 0) * 9;

  const api = {
    root,
    body,
    head,
    armL,
    armR,
    legL,
    legR,
    mic,
    vest,
    eyes,
    pose: 'stand',
    setVest(v) {
      vest.visible = !!v;
    },
    /** Lenkrad-Lage: m bildet Lenkrad-Koordinaten (Kranz in der xy-Ebene) auf Körperkoordinaten ab. */
    setWheel(m, r = 0.17) {
      wheel.m.copy(m);
      wheel.r = r;
      if (api.pose === 'drive') poseArms({});
    },
    setPose(p) {
      api.pose = p;
      mic.visible = p !== 'drive';
      if (p === 'drive') {
        // Sitzend: Oberschenkel nach vorne, Hände am Lenkrad
        legL.rotation.x = -1.45;
        legR.rotation.x = -1.45;
        legL.position.y = legR.position.y = 0.3;
        armL.userData.hand.rotation.set(0, 0, 0);
        armR.userData.hand.rotation.set(0, 0, 0);
        poseArms({});
      } else {
        legL.rotation.x = legR.rotation.x = 0;
        armL.rotation.set(0, 0, 0.18);
        armL.userData.elbow.rotation.set(-0.2, 0, 0);
        armL.userData.hand.rotation.set(0, 0, 0);
        // rechter Arm hält das Mikro vor den Mund
        armR.rotation.set(-0.9, 0.3, -0.3);
        armR.userData.elbow.rotation.set(-1.5, 0, 0);
        armR.userData.hand.rotation.set(0, 0, 0);
      }
    },
    /**
     * @param {number} t Zeit in Sekunden
     * @param {{wave?: number, steer?: number, talk?: number, look?: number}} s
     */
    animate(t, s = {}) {
      const wave = s.wave || 0;
      const steer = s.steer || 0;
      head.rotation.y = (s.look || 0) * 0.6 + Math.sin(t * 0.7) * 0.05;
      head.rotation.z = Math.sin(t * 1.3) * 0.03 - steer * 0.12;
      head.position.y = ADAM_DIM.head + Math.sin(t * 2.2) * 0.004;
      if (api.pose === 'drive') {
        // Hände am Lenkrad; gewinkt wird mit der Hand auf der Fensterseite (armR sitzt im Auto links)
        poseArms({ steer, wave, t });
      } else {
        armL.rotation.z = 0.18 + Math.sin(t * 1.1) * 0.03;
        if (wave > 0) {
          armL.rotation.set(-0.3 * wave, 0, 0.18 + 2.4 * wave + Math.sin(t * 9) * 0.3 * wave);
        }
        const talk = s.talk || 0;
        armR.rotation.x = -0.9 + Math.sin(t * 6) * 0.04 * talk;
      }
    },
  };
  api.setPose('stand');
  return api;
}
