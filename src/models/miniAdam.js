// Mini Adam – Plüschfigur nach dem Fan-Plüsch: schwarze Cap mit LIVE-Logo, buschige dunkle Haare, große
// Kulleraugen mit Lidern, dicke Nase, Schnurrbart, der in den Kinnbart läuft, schwarzes T-Shirt mit LIVE-Logo,
// Plüscharme mit Fäustlingen, dunkelgraue Hose, weiche Schuhe, Handmikrofon. Die Formen baut adamSculpt.js
// (einmal, für alle Instanzen), die Mimik rechnet adamMimic.js; hier entstehen Material, Gelenke und Bewegung.
import * as THREE from 'three';
import { W } from '../curve.js';
import { liveLogoTexture } from '../textures.js';
import { plush, eyeMaterial } from './plushMaterial.js';
import { buildAdamGeometry, FABRIC, NECK, HEAD_C, EYE_C, EYE_R, BROW_C, JAW_C, STACHE_SMILE, STACHE_POUT, SHOULDER, UPPER_ARM, FORE_ARM, HIP } from './adamSculpt.js';
import { Mimic, GESTURES } from './adamMimic.js';

export { plush };

export const COLORS = {
  skin: FABRIC.skin,
  skinDark: FABRIC.skinDeep,
  black: FABRIC.cap,
  shirt: FABRIC.shirt,
  hair: FABRIC.hair,
  beard: FABRIC.beard,
  pants: FABRIC.pants,
  shoe: FABRIC.shoe,
  white: 0xf7f5f0,
  mouth: FABRIC.mouth,
};

/** Hauptmaße (Körperkoordinaten, Figur schaut nach +z): Schultergelenk, Ober-/Unterarm, Höhe der Kopfmitte */
export const ADAM_DIM = {
  shoulder: SHOULDER,
  upperArm: UPPER_ARM,
  foreArm: FORE_ARM,
  head: NECK[1] + HEAD_C[1],
};

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const EYE_RADII = new THREE.Vector3(EYE_R[0], EYE_R[1], EYE_R[2]);

// Aufdruck auf Shirt und Cap: einmal für alle Figuren
let logoTex = null;
const logo = () => (logoTex ||= liveLogoTexture({ w: 512, h: 512 }));

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
 * Zielpunkte für die Hände (Körperkoordinaten). wheel = { m: Matrix4 Lenkrad → Körper, r } oder null (stehend:
 * die Fensterhand hält das Mikrofon vor die Brust, die andere hängt locker).
 * wave 0 … 1 führt die winkende Hand vom Lenkrad vor der Schulter hoch und dann seitlich neben den Kopf – bleibt dabei
 * im Innenraum; cheer 0 … 1 hebt sie stattdessen etwas höher und weiter vorn zum Jubeln (die Faust wippt, die andere
 * Hand bleibt am Lenkrad). Im Auto winkt die Fensterhand (side = 1), stehend die freie Hand (side = −1, gespiegelt):
 * die Fensterhand hält dann das Mikrofon.
 * Im Auto liegt die Schulter knapp unter der Gürtellinie, und unter dem Seitenfenster ist zwischen
 * Türblech und Glas nach außen hin ein offener Spalt: Hand und Ellbogen gehen deshalb innen (vor der
 * Brust, unter dem Kinn) nach oben und erst über der Gürtellinie zum Fenster hin – und seitlich am
 * Kinn vorbei, nicht quer vors Gesicht, das beim Winken zur Kamera schaut.
 */
const WAVE_POS = new THREE.Vector3(0.27, 0.77, 0.06);
const CHEER_POS = new THREE.Vector3(0.235, 0.84, 0.15);
const WAVE_C1 = new THREE.Vector3(0.2, 0.55, 0.22);
const WAVE_C2 = new THREE.Vector3(0.22, 0.69, 0.1);
const WAVE_PALM = new THREE.Vector3(0.55, -0.1, 0.83).normalize();
const CHEER_PALM = new THREE.Vector3(-0.35, 0.1, 0.93).normalize();
// Ellbogen beim Hochnehmen nach unten vorne, oben dann vorne-außen
const WAVE_POLE_UP = new THREE.Vector3(0, -1, 0.3).normalize();
const WAVE_POLE = new THREE.Vector3(0.1, -0.5, 0.9).normalize();
// stehend: Mikrofonhand vor der Brust (Handfläche nach innen), die andere hängt neben dem Bauch
const STAND = [
  { pos: new THREE.Vector3(-0.205, 0.245, 0.045), pole: new THREE.Vector3(-0.25, 0, -1).normalize(), palm: new THREE.Vector3(0.9, 0, 0.35).normalize() },
  { pos: new THREE.Vector3(0.115, 0.41, 0.205), pole: new THREE.Vector3(0.6, -0.8, -0.2).normalize(), palm: new THREE.Vector3(-1, 0, 0.1).normalize() },
];
const gripTmp = { a: V(), n: V(), end: V(), c1: V(), c2: V(), m: V() };
/** v mit gespiegeltem x (für die winkende Hand auf der Seite side) nach out */
const sideV = (v, side, out) => out.set(v.x * side, v.y, v.z);

/** Welche Hand winkt: im Auto die Fensterhand, stehend die freie (die Fensterhand hält das Mikrofon) */
export const waveSide = (wheel) => (wheel ? 1 : -1);

// Megafon (BrunnenTV, nur im Auto): Die Fensterhand holt es neben dem Sitz unter der Gürtellinie hervor (LOW, ab
// MEGA.show ist es zu sehen) und hält es vor den Mund, der Trichter zeigt durchs offene Fenster schräg nach vorn zum
// Brunnen (MEGA.dir); der Kopf ist dabei zum Fenster gedreht (look, Gierwinkel bis 0,75). Lage in Körperkoordinaten,
// Megafon-Rahmen wie cockpit/props.js megaphone: Achse +y zur Öffnung, Pistolengriff nach −x, Maßstab MEGA.s.
export const MEGA = {
  show: 0.4,
  s: 1.2,
  low: new THREE.Vector3(0.17, 0.36, 0.17),
  via: new THREE.Vector3(0.25, 0.47, 0.23),
  at: new THREE.Vector3(0.131, 0.602, 0.12),
  dir: new THREE.Vector3(0.82, -0.06, 0.57).normalize(),
  carry: new THREE.Vector3(0.15, 0.25, 0.96).normalize(),
  grip: new THREE.Vector3(-0.0553, -0.0055, 0),
  pole: new THREE.Vector3(0.75, -0.6, -0.2).normalize(),
};
const megaTmp = { q0: new THREE.Quaternion(), q1: new THREE.Quaternion(), m: new THREE.Matrix4(), x: V(), y: V(), z: V(), g: V(), a: V(), b: V() };
/** Drehung des Megafon-Rahmens, dessen Achse (+y) nach dir zeigt, der Griff (−x) möglichst nach unten. */
function megaQuat(dir, out) {
  const { x, y, z, m } = megaTmp;
  y.copy(dir);
  x.set(0, 1, 0).addScaledVector(y, -y.y).normalize();
  z.crossVectors(x, y);
  return out.setFromRotationMatrix(m.makeBasis(x, y, z));
}
/**
 * Megafon in der Hand bei k (0 … 1, siehe MEGA): Ziel der Hand am Griff (out.pos, Ellbogen out.pole, Handfläche
 * out.palm) und, ab MEGA.show, Lage des Megafons (mp: Position, mq: Drehung; sonst mp = null).
 */
export function megaphoneHold(k, from, out, mp, mq) {
  const { g, a, b, q0, q1 } = megaTmp;
  const show = MEGA.show;
  if (k < show) {
    // die Hand geht vom Lenkrad (oder vom Jubeln) hinunter neben den Sitz
    const u = smooth(0, show, k);
    out.pos.copy(from).lerp(MEGA.low, u);
    out.pole.lerp(MEGA.pole, u).normalize();
    out.palm.lerp(MEGA.dir, u).normalize();
    return false;
  }
  // von dort mit dem Megafon (quadratische Bézierkurve) hoch vor den Mund, dabei dreht es sich zum Fenster
  const u = smooth(show, 1, k);
  megaQuat(MEGA.carry, q0);
  megaQuat(MEGA.dir, q1);
  mq.copy(q0).slerp(q1, u);
  g.copy(MEGA.grip).multiplyScalar(MEGA.s).applyQuaternion(q1);
  const end = b.copy(MEGA.at).add(g);
  a.copy(MEGA.low).multiplyScalar((1 - u) * (1 - u)).addScaledVector(MEGA.via, 2 * u * (1 - u)).addScaledVector(end, u * u);
  out.pos.copy(a);
  out.pole.copy(MEGA.pole);
  out.palm.copy(MEGA.dir);
  mp.copy(MEGA.grip).multiplyScalar(MEGA.s).applyQuaternion(mq).negate().add(a);
  return true;
}

export function handTarget(side, wheel, { wave = 0, cheer = 0, steer = 0, t = 0 } = {}, out = { pos: V(), pole: V(), palm: V() }) {
  if (wheel) {
    // Griff am Kranz: Hand auf der Fensterseite bei etwa halb zehn, die andere bei halb drei; Lenken nach rechts
    // (steer > 0) dreht das Lenkrad aus Fahrersicht im Uhrzeigersinn (+x des Lenkrads zeigt zur Wagenmitte)
    const phi = (side > 0 ? Math.PI - 0.3 : 0.3) - steer * 0.5;
    const c = Math.cos(phi);
    const s = Math.sin(phi);
    const r = wheel.r + 0.012;
    out.pos.set(c * r, s * r, 0.026).applyMatrix4(wheel.m);
    // Handfläche zur Lenkradmitte und etwas nach vorne, Ellbogen hängen locker nach unten-außen
    gripTmp.n.set(-c, -s, -0.45).transformDirection(wheel.m);
    out.palm.copy(gripTmp.n);
    out.pole.set(side * 0.55, -1, -0.15).normalize();
  } else {
    const st = STAND[side > 0 ? 1 : 0];
    out.pos.copy(st.pos);
    out.pole.copy(st.pole);
    out.palm.copy(st.palm);
  }
  const w = side === waveSide(wheel) ? Math.max(wave, cheer) : 0;
  if (w > 0) {
    // Ziel oben: neben dem Kopf (Winken) oder höher und weiter vorn (Jubeln), je nach Anteil
    const kc = cheer / (wave + cheer);
    sideV(gripTmp.m.copy(WAVE_POS).lerp(CHEER_POS, kc), side, gripTmp.end);
    // kubische Bézierkurve Lenkrad → vor der Brust → seitlich am Kinn hoch → oben
    const k0 = (1 - w) * (1 - w) * (1 - w);
    const k1 = 3 * (1 - w) * (1 - w) * w;
    const k2 = 3 * (1 - w) * w * w;
    const k3 = w * w * w;
    gripTmp.a.copy(out.pos).multiplyScalar(k0).addScaledVector(sideV(WAVE_C1, side, gripTmp.c1), k1).addScaledVector(sideV(WAVE_C2, side, gripTmp.c2), k2).addScaledVector(gripTmp.end, k3);
    // Winken: Hand pendelt seitlich; Jubeln: Faust wippt – beides nur, wenn die Hand oben ist
    const wig = smooth(0.7, 1, w);
    gripTmp.a.x += Math.sin(t * 9) * 0.026 * wig * (1 - kc);
    gripTmp.a.y += (Math.abs(Math.cos(t * 9)) * 0.008 * (1 - kc) + Math.abs(Math.sin(t * 7.5)) * 0.03 * kc) * wig;
    out.pos.copy(gripTmp.a);
    out.pole.lerp(sideV(WAVE_POLE_UP, side, gripTmp.m), smooth(0, 0.35, w)).lerp(sideV(WAVE_POLE, side, gripTmp.m), smooth(0.6, 1, w)).normalize();
    out.palm.lerp(sideV(gripTmp.n.copy(WAVE_PALM).lerp(CHEER_PALM, kc), side, gripTmp.m), smooth(0.2, 0.9, w)).normalize();
  }
  return out;
}

/**
 * Bananensaft für die Hand (wie im Becherhalter, ohne Schrift): gelbe Flasche, helles Etikett, grüner Deckel; Boden
 * im Ursprung, Hals nach +y.
 */
export function buildBottle(curved) {
  const g = new THREE.Group();
  g.name = 'bananensaft';
  const add = (geo, color, roughness) => {
    const params = { color, roughness };
    g.add(new THREE.Mesh(geo, curved ? W.std(params) : new THREE.MeshStandardMaterial(params)));
  };
  const lathe = (pts) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), 16);
  add(lathe([[0, 0], [0.023, 0], [0.03, 0.005], [0.0318, 0.026], [0.0318, 0.116], [0.0296, 0.131], [0.019, 0.153], [0.0122, 0.163], [0.0122, 0.1745], [0, 0.1745]]), 0xf3c53a, 0.3);
  add(new THREE.CylinderGeometry(0.0324, 0.0324, 0.074, 16, 1, true).translate(0, 0.071, 0), 0xfaf6e8, 0.6);
  add(lathe([[0, 0.1735], [0.0152, 0.1735], [0.0152, 0.1905], [0, 0.1915]]), 0x2f9e44, 0.5);
  return g;
}

/**
 * Baut Mini Adam. Höhe stehend ≈ 0,95 Einheiten (wird vom Aufrufer skaliert).
 * @param {{curved?: boolean, seed?: number}} opts curved: Material für die gebogene Welt (siehe curve.js);
 *   seed: Startwert der Mimik (gleicher Wert und gleiche Aufrufe → gleiche Mimik, etwa im Auto und in der Facecam)
 */
export function buildMiniAdam({ curved = true, seed = 7 } = {}) {
  const G = buildAdamGeometry();
  const root = new THREE.Group();
  root.name = 'MiniAdam';

  const mat = plush(0xffffff, curved, { paint: { logo: logo() } });
  // Lider sind im gestauchten Augenraum gebaut (Einheitskugel): eigenes Material mit dem Maßstab des Auges, damit ihre
  // Körnung so fein ist wie im Gesicht (dasselbe Shader-Programm, kein zusätzlicher Draw Call)
  const matLid = plush(0xffffff, curved, { paint: { logo: logo(), scale: EYE_RADII } });
  const mEye = eyeMaterial(curved);
  const eyeU = mEye.userData.eye;
  const micParams = { color: FABRIC.micBody, roughness: 0.42, metalness: 0.35 };
  const mMic = curved ? W.std(micParams) : new THREE.MeshStandardMaterial(micParams);
  const mesh = (geo, parent, name, material = mat) => {
    const o = new THREE.Mesh(geo, material);
    o.name = name;
    parent.add(o);
    return o;
  };

  // --- Körper -------------------------------------------------------------
  const body = new THREE.Group();
  body.name = 'body';
  root.add(body);
  const torso = mesh(G.body, body, 'torso');
  const vest = mesh(G.vest, body, 'vest');

  // Beine (Ursprung im Hüftgelenk)
  const legL = new THREE.Group();
  const legR = new THREE.Group();
  legL.position.set(-HIP[0], HIP[1], HIP[2]);
  legR.position.set(HIP[0], HIP[1], HIP[2]);
  body.add(legL, legR);
  const legMeshes = [mesh(G.legL, legL, 'legL'), mesh(G.legR, legR, 'legR')];

  // Arme: Knochen Schulter → Ellbogen → Hand (Fäustling-Mitte), das Netz ist weich gehäutet
  const arms = [];
  for (const side of [-1, 1]) {
    const arm = new THREE.Bone();
    arm.position.set(side * SHOULDER[0], SHOULDER[1], SHOULDER[2]);
    const elbow = new THREE.Bone();
    elbow.position.y = -UPPER_ARM;
    const hand = new THREE.Bone();
    hand.position.y = -FORE_ARM;
    arm.add(elbow);
    elbow.add(hand);
    body.add(arm);
    arm.userData.elbow = elbow;
    arm.userData.hand = hand;
    const sk = new THREE.SkinnedMesh(side < 0 ? G.armL : G.armR, mat);
    sk.name = side < 0 ? 'armL' : 'armR';
    sk.position.copy(arm.position);
    sk.frustumCulled = false;
    body.add(sk);
    arm.userData.skin = sk;
    arms.push(arm);
  }
  const [armL, armR] = arms;

  // Mikrofon in der Fensterhand: Stiel quer durch die Faust, der Windschutz ragt auf der Daumenseite heraus
  const mic = new THREE.Group();
  mic.name = 'mic';
  mic.rotation.z = -Math.PI / 2;
  mic.position.set(0.004, -0.004, 0.01);
  mesh(G.micFoam, mic, 'micFoam');
  mesh(G.micBody, mic, 'micBody', mMic);
  armR.userData.hand.add(mic);
  // Bananensaft in der Fensterhand (raiseBottle): erst beim ersten Prost gebaut, zu sehen nur, solange die Hand dabei
  // oben ist
  let bottle = null;
  let bottleUntil = -1;

  // --- Kopf ---------------------------------------------------------------
  const head = new THREE.Group();
  head.name = 'head';
  head.rotation.order = 'YXZ';
  head.position.set(NECK[0], NECK[1], NECK[2]);
  body.add(head);
  const headMesh = mesh(G.head, head, 'headMesh');
  const eyesMesh = mesh(G.eyes, head, 'eyes', mEye);
  const stache = mesh(G.stache, head, 'stache');
  const jaw = mesh(G.jaw, head, 'jaw');
  // Lider: je Auge ein gestauchter Augenraum, darin drehen Ober- und Unterlid um die Querachse; dazu je eine Braue
  const lids = [];
  const brows = [];
  for (const s of [-1, 1]) {
    const space = new THREE.Group();
    space.position.set(HEAD_C[0] + s * EYE_C[0], HEAD_C[1] + EYE_C[1], HEAD_C[2] + EYE_C[2]);
    space.scale.copy(EYE_RADII);
    head.add(space);
    const up = new THREE.Group();
    const lo = new THREE.Group();
    space.add(up, lo);
    mesh(G.lidUpper, up, 'lidUpper', matLid);
    mesh(G.lidLower, lo, 'lidLower', matLid);
    lids.push({ up, lo, center: space.position });
    brows.push(mesh(s < 0 ? G.browL : G.browR, head, s < 0 ? 'browL' : 'browR'));
  }

  // Schatten werfen nur die großen Teile (die kleinen kosten im Schattenpass nur Draw Calls)
  for (const o of [torso, vest, headMesh, armL.userData.skin, armR.userData.skin, ...legMeshes]) o.castShadow = true;

  // Häuten erst, wenn alle Matrizen stehen (Ruhelage: Arme gestreckt nach unten)
  root.updateMatrixWorld(true);
  for (const arm of arms) {
    const { elbow, hand, skin } = arm.userData;
    skin.bind(new THREE.Skeleton([arm, elbow, hand]));
  }

  // Lenkrad (von außen gesehen): wird vom Auto gesetzt, Standard: vor der Brust
  const wheel = { m: new THREE.Matrix4().makeRotationX(0.35).setPosition(0, 0.44, 0.22), r: 0.17 };
  const targets = [{ pos: V(), pole: V(), palm: V() }, { pos: V(), pole: V(), palm: V() }];
  const gest = { steer: 0, wave: 0, cheer: 0, t: 0, megafon: 0, bottle: false };
  // Megafon in der Fensterhand (BrunnenTV): das Modell hängt der Aufrufer an (holdMegaphone), sonst gibt es keins
  let prop = null;
  const megaFrom = V();
  const poseArms = () => {
    const drive = api.pose === 'drive';
    for (const [arm, side, tg] of [[armL, -1, targets[0]], [armR, 1, targets[1]]]) {
      handTarget(side, drive ? wheel : null, gest, tg);
      // hüpft er auf dem Sitz, bleiben die Hände trotzdem am Lenkrad
      if (drive) tg.pos.y -= body.position.y;
      // das Megafon hält er vor dem Körper (es hüpft mit ihm)
      const mega = drive && side === waveSide(wheel) && gest.megafon > 0;
      if (mega) {
        megaFrom.copy(tg.pos);
        const shown = megaphoneHold(gest.megafon, megaFrom, tg, prop ? prop.position : megaFrom, prop ? prop.quaternion : megaTmp.q0);
        if (prop) prop.visible = shown;
      }
      if (side === waveSide(wheel) && prop && !mega) prop.visible = false;
      solveArm(arm, tg.pos, tg.pole, tg.palm);
      const waving = side === waveSide(drive ? wheel : null);
      arm.userData.hand.rotation.set(0, 0, waving ? side * Math.sin(gest.t * 9 - 0.6) * 0.3 * smooth(0.7, 1, gest.wave) * (1 - gest.cheer) : 0);
    }
  };

  // --- Mimik auf Gesicht und Kopf ------------------------------------------
  const mimic = new Mimic(seed);
  const gazeHead = V();
  const eyeFrom = V();
  const invHead = new THREE.Matrix4();
  const applyFace = (f, look) => {
    head.position.set(NECK[0], NECK[1] + 0.0012 * f.breath, NECK[2]);
    // Kinn nicht zu tief (der Kinnbart liegt auf der Brust) und nicht über die Schulter
    head.rotation.set(clamp(f.pitch, -0.3, 0.12), clamp(f.yaw, -0.75, 0.75), f.roll);
    head.updateMatrix();
    // Atmen: die Brust hebt und weitet sich kaum merklich (die Weste mit)
    torso.scale.set(1 + 0.004 * f.breath, 1, 1 + 0.008 * f.breath);
    vest.scale.copy(torso.scale);
    // Blickziel in Kopf-Koordinaten – schaut er zur Seite (look), wandern die Augen mit
    const a = look * 0.75;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    gazeHead.set(f.gaze[0] * ca + f.gaze[2] * sa, f.gaze[1], -f.gaze[0] * sa + f.gaze[2] * ca).applyMatrix4(invHead.copy(head.matrix).invert());
    for (let i = 0; i < 2; i++) {
      const s = i ? 1 : -1;
      const l = lids[i];
      l.up.rotation.x = -f.lidU[i];
      l.lo.rotation.x = f.lidL[i];
      eyeU.uEyeLid.value[i].set(f.lidU[i], -f.lidL[i]);
      // Blick als Richtung auf der Einheitskugel des Auges; die Pupille bleibt im sichtbaren Teil. Gezielt wird von
      // einem Punkt halb zwischen Auge und Nasenwurzel: so schielt er bei nahen Zielen (Kamera, Navi) nicht
      eyeFrom.set(l.center.x * 0.5, l.center.y, l.center.z);
      const g = eyeU.uEyeGaze.value[i].subVectors(gazeHead, eyeFrom).multiply(EYE_RADII).normalize();
      g.x = clamp(g.x, -0.5, 0.5);
      g.y = clamp(g.y, -0.4, 0.34);
      g.z = Math.sqrt(Math.max(0.05, 1 - g.x * g.x - g.y * g.y));
      g.normalize();
      // Brauen: heben (an der Stirn entlang etwas nach hinten), innere Enden heben
      const br = brows[i];
      br.position.set(HEAD_C[0] + s * BROW_C[0], HEAD_C[1] + BROW_C[1] + f.brow[i], HEAD_C[2] + BROW_C[2] - 0.41 * f.brow[i]);
      br.rotation.z = -s * f.browTilt[i];
    }
    eyeU.uEyePupil.value = f.pupil;
    const smile = clamp(f.smile / STACHE_SMILE, 0, 1.1);
    const pout = clamp(-f.smile / STACHE_POUT, 0, 1.1);
    stache.morphTargetInfluences[0] = jaw.morphTargetInfluences[0] = smile;
    stache.morphTargetInfluences[1] = jaw.morphTargetInfluences[1] = pout;
    // Mund auf: der Unterkiefer gleitet nach unten und etwas nach vorn (an der Brust entlang)
    jaw.position.set(HEAD_C[0] + JAW_C[0], HEAD_C[1] + JAW_C[1] - 0.09 * f.jaw, HEAD_C[2] + JAW_C[2] + 0.045 * f.jaw);
  };

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
    eyes: eyesMesh,
    /** Lenkrad, an dem die Hände in der Fahrpose greifen ({ m, r }, siehe setWheel) */
    wheel,
    pose: 'stand',
    setVest(v) {
      vest.visible = !!v;
    },
    /** Lenkrad-Lage: m bildet Lenkrad-Koordinaten (Kranz in der xy-Ebene) auf Körperkoordinaten ab. */
    setWheel(m, r = 0.17) {
      wheel.m.copy(m);
      wheel.r = r;
      poseArms();
    },
    setPose(p) {
      api.pose = p;
      mic.visible = p !== 'drive';
      legL.rotation.x = legR.rotation.x = p === 'drive' ? -1.2 : 0;
      poseArms();
    },
    /** Stimmung (siehe MOODS in adamMimic.js) für seconds Sekunden (Standard je Stimmung), Stärke 0 … 1 */
    setMood(name, seconds, strength = 1) {
      mimic.setMood(name, seconds, strength);
    },
    /** Geste der Fensterhand: 'wave' (winken) oder 'cheer' (jubeln), Stärke k (1 = ganz, kleiner: verlegen) */
    gesture(name, k = 1) {
      mimic.gesture(name, undefined, k);
    },
    /** Prost mit Bananensaft (Ladestopp): jubelt wie 'cheer', die Flasche in der Fensterhand. */
    raiseBottle() {
      if (!bottle) {
        bottle = buildBottle(curved);
        // Boden vorn in der Faust, Bauch mit Etikett und Hals ragen über die Fingerspitzen hinaus
        bottle.rotation.z = Math.PI;
        bottle.position.set(0, -0.03, 0.006);
        bottle.scale.setScalar(1);
        bottle.visible = false;
        armR.userData.hand.add(bottle);
      }
      bottleUntil = gest.t + GESTURES.cheer;
      mimic.gesture('cheer');
    },
    /** Blick für seconds Sekunden auf ein Ziel ('camera', 'screen', 'mirror', 'nomi', 'wiper' … oder [x, y, z]) */
    lookAt(target, seconds) {
      mimic.lookAt(target, seconds);
    },
    /**
     * Megafon für die Fensterhand (BrunnenTV): ein Objekt im Megafon-Rahmen (MEGA), Maßstab setzt die Figur. Zu sehen
     * ist es nur, solange animate es mit megafon über MEGA.show hält.
     */
    holdMegaphone(o) {
      prop = o;
      prop.scale.setScalar(MEGA.s);
      prop.visible = false;
      body.add(prop);
    },
    /** Ist das Megafon gerade in der Hand zu sehen? */
    get megaphoneShown() {
      return !!prop && prop.visible;
    },
    /**
     * @param {number} t Zeit in Sekunden
     * @param {{wave?: number, steer?: number, talk?: number, look?: number, sleepy?: number, megafon?: number}} s
     *   wave 0 … 1 (Winken von außen, zusätzlich zu den Gesten), steer −1 … 1, talk 0 … 1 (spricht gerade), look −1 … 1
     *   (Kopf zur Fensterseite +), sleepy 0 … 1, megafon 0 … 1 (Megafon an den Mund, nur im Auto, siehe MEGA)
     */
    animate(t, s = {}) {
      const f = mimic.update(t, s);
      body.position.y = f.lift;
      applyFace(f, s.look || 0);
      gest.steer = s.steer || 0;
      gest.wave = Math.max(s.wave || 0, f.wave);
      gest.cheer = f.cheer;
      gest.t = t;
      gest.megafon = s.megafon || 0;
      gest.bottle = t < bottleUntil;
      if (bottle) bottle.visible = gest.bottle && f.cheer > 0.25;
      poseArms();
    },
    /**
     * Was die Hände gerade tun (nach animate, nur lesen): wave, cheer, megafon 0 … 1, bottle (hält den Bananensaft), t –
     * die Ich-Perspektive im Cockpit macht dieselbe Geste (cockpit.placeGesture).
     */
    get gestures() {
      return gest;
    },
  };
  vest.visible = false;
  api.setPose('stand');
  api.animate(0);
  return api;
}
