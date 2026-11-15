// Mini Adam – stilisierte Plüschfigur (schwarze Cap und Shirt mit LIVE-Logo, Bart,
// dunkle Haare, Plüschhände, dunkelgraue Hose, Handmikrofon). Komplett aus Grundformen.
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

let sharedFabric = null;

function plush(color, curved, { sheen = 0.9, rough = 0.95 } = {}) {
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

/**
 * Baut Mini Adam. Höhe stehend ≈ 1 Einheit (wird vom Aufrufer skaliert).
 * @param {{curved?: boolean, vest?: boolean}} opts
 */
export function buildMiniAdam({ curved = true } = {}) {
  const root = new THREE.Group();
  root.name = 'MiniAdam';

  const mSkin = plush(COLORS.skin, curved);
  const mNose = plush(COLORS.skinDark, curved);
  const mShirt = plush(COLORS.shirt, curved, { sheen: 0.6 });
  const mCap = plush(COLORS.black, curved, { sheen: 0.5 });
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
  const mLogo = new THREE.MeshStandardMaterial({ map: logoTex, transparent: true, roughness: 0.9, alphaTest: 0.2 });
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
  const chestLogo = new THREE.Mesh(new THREE.CylinderGeometry(0.163, 0.163, 0.16, 20, 1, true, -0.62, 1.24), mLogo);
  chestLogo.scale.set(1.08, 1, 0.86);
  chestLogo.position.set(0, 0.45, 0);
  chestLogo.rotation.y = 0; // Öffnung zeigt nach vorne (+z)
  body.add(chestLogo);

  // Ärmel
  const sleeveGeo = new THREE.CylinderGeometry(0.062, 0.07, 0.09, 12);
  const sleeveL = new THREE.Mesh(sleeveGeo, mShirt);
  const sleeveR = new THREE.Mesh(sleeveGeo, mShirt);

  // Arme als Gruppen (Schulter-Pivot)
  const armL = new THREE.Group();
  const armR = new THREE.Group();
  armL.position.set(-0.165, 0.53, 0);
  armR.position.set(0.165, 0.53, 0);
  body.add(armL, armR);
  for (const [arm, sleeve, side] of [[armL, sleeveL, -1], [armR, sleeveR, 1]]) {
    sleeve.position.set(side * 0.015, -0.03, 0);
    sleeve.rotation.z = side * 0.25;
    arm.add(sleeve);
    const upper = capsule(0.045, 0.12, mSkin);
    upper.position.set(side * 0.03, -0.11, 0);
    upper.rotation.z = side * 0.2;
    arm.add(upper);
    const hand = new THREE.Group();
    hand.position.set(side * 0.05, -0.205, 0);
    const palm = sphere(0.056, mSkin);
    palm.scale.set(1, 0.95, 0.85);
    const thumb = sphere(0.024, mSkin);
    thumb.position.set(-side * 0.03, 0.02, 0.035);
    hand.add(palm, thumb);
    arm.add(hand);
    arm.userData.hand = hand;
  }

  // Mikrofon (in der rechten Hand)
  const mic = new THREE.Group();
  const micBody = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.012, 0.13, 12), mMic);
  micBody.position.y = -0.02;
  const micHead = sphere(0.03, mMicHead, 14, 10);
  micHead.position.y = 0.065;
  mic.add(micBody, micHead);
  mic.position.set(0, 0.02, 0.03);
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
  head.position.y = 0.745;
  body.add(head);

  const skull = sphere(0.16, mSkin, 28, 22);
  skull.scale.set(1, 0.96, 0.95);
  head.add(skull);

  // Ohren
  for (const s of [-1, 1]) {
    const ear = sphere(0.035, mSkin);
    ear.scale.set(0.6, 1, 0.8);
    ear.position.set(s * 0.158, -0.005, -0.01);
    head.add(ear);
  }

  // Haare: wuschelige Büschel hinten und an den Seiten
  const hairPuffs = [
    [0, 0.0, -0.13, 0.085], [-0.08, -0.02, -0.12, 0.075], [0.08, -0.02, -0.12, 0.075],
    [-0.13, 0.01, -0.06, 0.07], [0.13, 0.01, -0.06, 0.07], [-0.145, -0.04, 0.0, 0.055], [0.145, -0.04, 0.0, 0.055],
    [-0.05, -0.07, -0.13, 0.07], [0.05, -0.07, -0.13, 0.07], [0, 0.05, -0.12, 0.08],
  ];
  for (const [x, y, z, r] of hairPuffs) {
    const p = sphere(r, mHair, 12, 10);
    p.position.set(x, y, z);
    p.scale.set(1, 0.9, 0.9);
    head.add(p);
  }

  // Bart (unterer Teil des Gesichts) + Koteletten
  const beard = new THREE.Mesh(
    new THREE.SphereGeometry(0.168, 26, 16, Math.PI / 2 - 1.35, 2.7, Math.PI * 0.53, Math.PI * 0.4),
    mBeard,
  );
  beard.scale.set(1, 1, 1.0);
  head.add(beard);
  const chin = sphere(0.075, mBeard);
  chin.scale.set(1.25, 0.8, 0.9);
  chin.position.set(0, -0.12, 0.08);
  head.add(chin);
  for (const s of [-1, 1]) {
    const side = sphere(0.05, mBeard, 10, 8);
    side.position.set(s * 0.13, -0.05, 0.05);
    side.scale.set(0.8, 1.4, 1);
    head.add(side);
  }
  // Schnurrbart
  const stache = capsule(0.022, 0.07, mBeard, 8);
  stache.rotation.z = Math.PI / 2;
  stache.position.set(0, -0.045, 0.152);
  head.add(stache);
  // Mund (kleines Lächeln im Bart)
  const mouth = sphere(0.026, mMouth, 12, 8);
  mouth.scale.set(1.3, 0.55, 0.5);
  mouth.position.set(0, -0.078, 0.15);
  head.add(mouth);

  // Nase (prominent, wie beim Plüsch)
  const nose = sphere(0.043, mNose, 16, 12);
  nose.scale.set(1.05, 0.95, 0.9);
  nose.position.set(0, -0.005, 0.165);
  head.add(nose);

  // Augen
  const eyes = new THREE.Group();
  head.add(eyes);
  for (const s of [-1, 1]) {
    const eye = sphere(0.034, mEye, 16, 12);
    eye.scale.set(0.9, 1.1, 0.5);
    eye.position.set(s * 0.055, 0.045, 0.142);
    const pupil = sphere(0.016, mPupil, 12, 10);
    pupil.position.set(s * 0.004, -0.004, 0.158);
    pupil.scale.set(1, 1.2, 0.5);
    const glint = sphere(0.005, mEye, 6, 6);
    glint.position.set(s * 0.004 + 0.006, 0.006, 0.166);
    eyes.add(eye, pupil, glint);
  }
  // Augenbrauen
  for (const s of [-1, 1]) {
    const brow = capsule(0.011, 0.045, mHair, 6);
    brow.rotation.z = Math.PI / 2 + s * 0.18;
    brow.position.set(s * 0.058, 0.098, 0.135);
    head.add(brow);
  }

  // Cap: Kuppel, Schirm, Knopf, Logo
  const cap = new THREE.Group();
  cap.position.y = 0.025;
  head.add(cap);
  const crown = new THREE.Mesh(new THREE.SphereGeometry(0.172, 26, 14, 0, Math.PI * 2, 0, Math.PI * 0.47), mCap);
  crown.scale.set(1, 0.9, 1.0);
  cap.add(crown);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.173, 0.173, 0.03, 26, 1, true), mCap);
  band.position.y = 0.005;
  cap.add(band);
  const brimShape = new THREE.Shape();
  brimShape.moveTo(-0.15, 0);
  brimShape.quadraticCurveTo(-0.15, 0.16, 0, 0.17);
  brimShape.quadraticCurveTo(0.15, 0.16, 0.15, 0);
  brimShape.lineTo(-0.15, 0);
  const brim = new THREE.Mesh(
    new THREE.ExtrudeGeometry(brimShape, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.005, bevelSize: 0.006, bevelSegments: 2 }),
    mCap,
  );
  brim.rotation.x = Math.PI / 2 - 0.12;
  brim.position.set(0, 0.0, 0.12);
  cap.add(brim);
  const button = sphere(0.018, mCap, 10, 8);
  button.position.y = 0.155;
  cap.add(button);
  const capLogo = new THREE.Mesh(new THREE.CylinderGeometry(0.176, 0.176, 0.1, 20, 1, true, -0.5, 1.0), mLogo);
  capLogo.position.y = 0.065;
  cap.add(capLogo);

  // Warnweste (optional, aus dem Shop)
  const vestMat = plain(0xd7ff1f, curved, { roughness: 0.6, emissive: 0x3a4a00, emissiveIntensity: 0.25 });
  const stripeMat = plain(0xd8d8d8, curved, { roughness: 0.2, metalness: 0.6 });
  const vest = new THREE.Group();
  const vestBody = new THREE.Mesh(new THREE.CylinderGeometry(0.168, 0.165, 0.2, 18, 1, true), vestMat);
  vestBody.scale.set(1.08, 1, 0.88);
  vestBody.position.y = 0.43;
  vest.add(vestBody);
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
    setPose(p) {
      api.pose = p;
      mic.visible = p !== 'drive';
      if (p === 'drive') {
        // Sitzend: Oberschenkel nach vorne, Arme Richtung Lenkrad
        legL.rotation.x = -1.45;
        legR.rotation.x = -1.45;
        legL.position.y = legR.position.y = 0.3;
        armL.rotation.set(-1.15, 0, 0.12);
        armR.rotation.set(-1.15, 0, -0.12);
      } else {
        legL.rotation.x = legR.rotation.x = 0;
        armL.rotation.set(0, 0, 0.18);
        // rechter Arm hält das Mikro vor den Mund
        armR.rotation.set(-1.9, 0.35, -0.35);
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
      head.position.y = 0.745 + Math.sin(t * 2.2) * 0.004;
      if (api.pose === 'drive') {
        armL.rotation.z = 0.12 + steer * 0.25;
        armR.rotation.z = -0.12 + steer * 0.25;
        armL.rotation.x = -1.15 - steer * 0.12;
        armR.rotation.x = -1.15 + steer * 0.12;
        if (wave > 0) {
          // Winken mit der Hand auf der Fensterseite (armR sitzt im Auto links am Fenster),
          // seitlich hoch neben den Kopf statt quer vors Gesicht
          const k = 1 - wave;
          armR.rotation.set(0.2 * wave - 1.15 * k, 0, -0.12 * k + (2.54 + Math.sin(t * 9) * 0.3) * wave);
        }
      } else {
        armL.rotation.z = 0.18 + Math.sin(t * 1.1) * 0.03;
        if (wave > 0) {
          armL.rotation.set(-0.3 * wave, 0, 0.18 + 2.4 * wave + Math.sin(t * 9) * 0.3 * wave);
        }
        const talk = s.talk || 0;
        armR.rotation.x = -1.9 + Math.sin(t * 6) * 0.04 * talk;
      }
    },
  };
  api.setPose('stand');
  return api;
}
