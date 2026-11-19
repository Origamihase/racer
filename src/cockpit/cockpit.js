// Das Cockpit des Model 3 aus Mini Adams Sicht – wie ein Spielzeugmacher es für einen Plüschfahrer bauen würde:
// gepolsterte Kabine (cabin.js), Lenkrad mit LIVE-Logo (wheel.js), Mini Adams Plüschhände (hands.js), großer
// Mittelbildschirm, Innen- und Außenspiegel (echte Rückansicht), NOMI, Stream-Technik (rig.js), Mitbringsel
// (props.js) und die Scheibenwischer.
import * as THREE from 'three';
import { liveLogoTexture, softDotTexture } from '../textures.js';
import { Nomi } from './nomi.js';
import { CenterScreen } from './screen.js';
import { buildWipers } from './wipers.js';
import { buildElsa, animateElsa } from '../models/elsa.js';
import { damp, clamp, smoothstep, lerp } from '../util.js';
import { mirrorShape, mirrorHousingGeometry } from '../models/loft.js';
import { plush, COLORS, buildMiniAdam, ADAM_DIM } from '../models/miniAdam.js';
import { prep, meshOf, mergeByMaterial, rbox, sweep, ring, place, roundedRect, warp, pillow, lathe } from './parts.js';
import { buildCabin, buildHood, roofGlassGeometry, blob, dashTopY, pillarPoint, PAL, SEAT } from './cabin.js';
import { WHEEL, buildWheelParts, buildColumn } from './wheel.js';
import { mittenGeometry, forearmGeometry, upperArmGeometry, sleeveGeometry, WRIST } from './hands.js';
import { buildRig, setLiveCrop } from './rig.js';
import { buildProps } from './props.js';
import { buildRadar } from './radar.js';
import { grainTexture, weaveTexture, leatherTexture, perfTexture, walnutTexture, labelAtlas, decalAtlas, decalUV } from './cabinTextures.js';

// Augenposition (Fahrzeug-Koordinaten; vorne = -z). Mini Adam sitzt auf zwei Kissen.
export const EYE = new THREE.Vector3(-0.37, 1.2, 0.27);
export const PITCH = -0.12;

// Frontscheibe als Ebene
export const WINDSHIELD = (() => {
  const base = new THREE.Vector3(0, 0.9, -0.88);
  const top = new THREE.Vector3(0, 1.38, -0.095);
  const U = top.clone().sub(base);
  const length = U.length();
  U.normalize();
  const X = new THREE.Vector3(1, 0, 0);
  const N = new THREE.Vector3().crossVectors(U, X).normalize(); // nach außen (vorne oben)
  return { base, top, U, X, N, length, halfBase: 0.74, halfTop: 0.63 };
})();

// Wischer (Fahrer-, dann Beifahrerseite). pivot: Fuß der Achse auf der Scheibe, knapp über ihrer Unterkante;
// park/max: Winkel des Arms in Parkstellung und am oberen Anschlag (rad; 0 = waagerecht nach rechts, positiv
// gegen den Uhrzeigersinn aus Fahrersicht); arm: Abstand Achse–Adapter; blade: Wischblatt von … bis (längs des
// Arms ab der Achse); offset: seitlicher Versatz des Blatts durch die Kröpfung des Arms (zur Wischrichtung hin).
export const WIPERS = (() => {
  const W = WINDSHIELD;
  const foot = (x, u) => W.base.clone().addScaledVector(W.U, u).setX(x);
  // das Fahrerblatt endet oben parallel zur linken Scheibenkante (A-Säule), 7 cm vor ihr. Die Beifahrerachse sitzt
  // 20 cm links der Mitte und schwenkt weiter: Bleiben beide im Schauer stehen (STAND in windshield.js), steht aus
  // Fahrersicht jedes Blatt senkrecht – das Fahrerblatt links im Blick, das Beifahrerblatt nahe der Mitte, links
  // vom Innenspiegel. Das Beifahrerblatt reicht in Parkstellung rechts neben den Mittelbildschirm hinaus.
  const edge = Math.atan2(W.length, W.halfBase - W.halfTop);
  return [
    { pivot: foot(-0.64, 0.065), park: 0.2, max: edge, arm: 0.41, blade: [0.1, 0.72], offset: 0.022 },
    { pivot: foot(-0.2, 0.065), park: 0.2, max: 1.83, arm: 0.4, blade: [0.12, 0.68], offset: 0.02 },
  ];
})();

// Kameragehäuse an der Scheibe, an dem der Innenspiegel hängt: ein kleines, weich gepolstertes Kissen, das hinter
// dem Spiegel beginnt (vom Fahrer aus verdeckt der Spiegel die untere Hälfte) und 10 cm die Scheibe hinaufreicht –
// bis in den Dachrahmen läge es aus Fahrersicht als dunkles Brett vor dem Himmel. Mitte x, halbe Breite unten und
// größte, von/bis v längs der Scheibe ab ihrer Unterkante, Dicke unten/oben (unten dünn: Luft zum Spiegel).
const HOUSING = { x: -0.08, hb: 0.038, hw: 0.045, v0: 0.695, v1: 0.795, t0: 0.011, t1: 0.022 };

// Griffwinkel der Hände ab 12 Uhr (Bogenmaß): quer gut „Viertel vor drei“ (knapp über den Speichen, mit Abstand
// zu NOMI), hochkant auf halb elf und halb zwei – mit Abstand zum Bildrand und zu den Touch-Knöpfen
const GRIP_WIDE = 1.2;
const GRIP_TALL = 0.8;
// Arme: Schulter–Handgelenk sind 0,59–0,73 m (je nach Griff und Lenkeinschlag) – länger als Mini Adams eigene
// Plüscharme, deshalb sind sie dehnbar: Ober- und Unterarm (Grundlängen) werden jedes Bild bis zum Ellbogen gestreckt.
// Der Ellbogen liegt knapp vor der Mitte und hängt etwas nach unten und außen durch (nie im Bild der Ich-Perspektive,
// aber aus freien Kameras wirken die Arme so weich statt wie Stangen). Der T-Shirt-Ärmel wird nicht gestreckt.
const UPPER_LEN = 0.3;
const FORE_LEN = 0.36;
const SLEEVE_LEN = 0.13;
const ELBOW = { at: 0.45, down: 0.06, out: 0.035 };
// Schultern: wo Mini Adams Schultern im Sitz sind (unter und hinter dem Auge; dort sitzen sie auch bei der Figur,
// die freie Kameras zu sehen bekommen, siehe showDriver)
const SHOULDER = { dx: 0.165, y: 0.93, z: 0.36 };
const UP = new THREE.Vector3(0, 1, 0);
// Stärke des Himmels (Umgebungstextur) in der Kabine; Lack, Klavierlack und Satin spiegeln ihn ungedämpft
const ENV = 0.5;
// Kabinenlicht bei Sonne: so viel, dass Anthrazit lesbar bleibt, aber nicht mehr – sonst brennen die hellen
// Plüschhände aus. Die Formen tragen dafür aufgemalte Schatten (Vertexfarben) und weicher Glanz.
const LIGHT = { hemi: 2.45, sun: 1.8, back: 1.0 };

/** Rahmen fürs Innenspiegelbild: Dachhimmel, C-Säulen, Hutablage und drei Kopfstützen (wie im Spiegel gesehen). */
function rearWindowTexture() {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 300;
  const ctx = c.getContext('2d');
  const W = c.width;
  const H = c.height;
  // Dachhimmel und C-Säulen: Stoff, zur Scheibe hin vom Tageslicht etwas aufgehellt
  const g = ctx.createRadialGradient(W / 2, H * 0.5, H * 0.3, W / 2, H * 0.5, W * 0.55);
  g.addColorStop(0, '#474a51');
  g.addColorStop(1, '#2a2c31');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  // Heckscheibe: groß wie beim Model 3 (das Glasdach reicht bis an sie heran), oben kaum Rahmen, seitlich schmale
  // C-Säulen, unten die Hutablage
  const t = H * 0.05;
  const b = H * 0.86;
  const opening = () => {
    ctx.beginPath();
    ctx.moveTo(W * 0.16, t);
    ctx.lineTo(W * 0.84, t);
    ctx.quadraticCurveTo(W * 0.935, t, W * 0.945, t + H * 0.2);
    ctx.lineTo(W * 0.975, b);
    ctx.lineTo(W * 0.025, b);
    ctx.lineTo(W * 0.055, t + H * 0.2);
    ctx.quadraticCurveTo(W * 0.065, t, W * 0.16, t);
    ctx.closePath();
  };
  // dunkle Einfassung mit weichem Schatten, dann die Scheibe ausstanzen
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 12;
  ctx.strokeStyle = '#1e2024';
  ctx.lineWidth = 9;
  opening();
  ctx.stroke();
  ctx.restore();
  ctx.globalCompositeOperation = 'destination-out';
  opening();
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  // Kopfstützen der Rückbank: oben vom Heckfenster her angeleuchtet
  for (const x of [0.24, 0.5, 0.76]) {
    const w = W * (x === 0.5 ? 0.085 : 0.11);
    const hg = ctx.createLinearGradient(0, H * 0.7, 0, H * 0.95);
    hg.addColorStop(0, '#4b4e55');
    hg.addColorStop(1, '#2d2f34');
    ctx.fillStyle = hg;
    roundRectPath(ctx, W * x - w / 2, H * 0.7, w, H * 0.4, 26);
    ctx.fill();
  }
  // Hutablage
  const sg = ctx.createLinearGradient(0, b, 0, H);
  sg.addColorStop(0, '#383b41');
  sg.addColorStop(1, '#1f2125');
  ctx.fillStyle = sg;
  ctx.fillRect(0, b, W, H - b);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/** Halbe Breite des Kameragehäuses auf der Höhe k (0 unten … 1 oben): unten schmaler, oben ein runder Bogen. */
function housingHalf(k) {
  const { hb, hw } = HOUSING;
  if (k < 0.45) return lerp(hb, hw, Math.sin((k / 0.45) * Math.PI / 2));
  const t = (k - 0.45) / 0.55;
  return hw * Math.sqrt(1 - 0.87 * t * t);
}

/** Dicke des Kameragehäuses (Abstand seiner Vorderseite vom Glas) bei s (−1 … 1 quer) und k: mittig leicht gewölbt. */
function housingDepth(s, k) {
  const { t0, t1 } = HOUSING;
  const ty = 2 * k - 1;
  return lerp(t0, t1, k) + 0.004 * Math.max(0, 1 - s * s) * Math.max(0, 1 - ty * ty) + 0.0006;
}

/**
 * Kameragehäuse (siehe HOUSING) als Kissen auf dem Glas: Rückseite flach am Glas, Vorderseite weich gewölbt, unten
 * schmaler und dünner, oben rund. toGlass: Scheibenkoordinaten (x, v, d nach innen) → Fahrzeug.
 */
function housingGeometry(toGlass) {
  const { x, hw, v0, v1, t1 } = HOUSING;
  const h = v1 - v0;
  const g = pillow(2 * hw, h, t1, 0.011, 0, 16);
  return warp(g, (p) => {
    const k = clamp(p.y / h + 0.5, 0, 1);
    const s = p.x / hw;
    const front = clamp(p.z / t1 + 0.5, 0, 1);
    p.set(x + s * housingHalf(k), v0 + k * h, front * housingDepth(s, k));
  }).applyMatrix4(toGlass);
}

const AIM = { x: new THREE.Vector3(), y: new THREE.Vector3(), z: new THREE.Vector3(), m: new THREE.Matrix4() };

/**
 * Richtet ein Armteil von a nach b aus: lokales +y zeigt nach b, lokales +z so weit wie möglich nach oben (die Nähte
 * und Schatten der Arme bleiben so, wo sie hingehören). Mit len wird das Teil in y auf die Strecke a–b gestreckt.
 */
function aimAlong(obj, a, b, len = 0) {
  const { x, y, z, m } = AIM;
  y.subVectors(b, a);
  const l = y.length();
  y.multiplyScalar(1 / l);
  z.copy(UP).addScaledVector(y, -y.y).normalize();
  x.crossVectors(y, z);
  obj.quaternion.setFromRotationMatrix(m.makeBasis(x, y, z));
  obj.position.copy(a);
  if (len) obj.scale.y = l / len;
}

/** Abgerundete Leiste (Kapsel) zwischen zwei Punkten, Querschnitt w × d. */
function roundBeam(a, b, w, d) {
  const n = 8;
  const pts = [];
  for (let i = 0; i <= n; i++) pts.push(a.clone().lerp(b, i / n));
  return sweep(pts, () => ring(w / 2, d / 2, 14, 2.4), { up: new THREE.Vector3(0, 1, 0) });
}

export class Cockpit {
  constructor() {
    this.scene = new THREE.Scene();
    this.root = new THREE.Group();
    this.root.name = 'Cockpit';
    this.scene.add(this.root);

    // Licht in der Kabine: Das getönte Glasdach dämpft den blauen Himmel (sonst wird alles Anthrazit marineblau),
    // dafür hellt neutrales Himmelslicht von oben und warmes Streulicht aus dem Innenraum auf. Von hinten fällt
    // Licht durch Heck- und Seitenfenster auf alles, was zum Fahrer schaut (Stirnseite, Lenkrad, Säulen).
    this.scene.environmentIntensity = ENV;
    this.hemi = new THREE.HemisphereLight(0xfff4e6, 0x6b5744, LIGHT.hemi);
    this.scene.add(this.hemi);
    this.sun = new THREE.DirectionalLight(0xffeccf, LIGHT.sun);
    this.scene.add(this.sun);
    this.scene.add(this.sun.target);
    this.back = new THREE.DirectionalLight(0xfff3e8, LIGHT.back);
    this.back.position.set(0, 1.6, 2.2);
    this.back.target.position.set(0, 0.8, -0.6);
    this.root.add(this.back, this.back.target);
    this.fill = new THREE.PointLight(0xfff4e8, 0.25, 2.5, 1.2);
    this.fill.position.set(-0.2, 1.25, 0.1);
    this.root.add(this.fill);

    // Sammelmaterialien der Kabine: Formen bringen ihre Farbe als Vertexfarbe mit (samt aufgemalter
    // Schattierung in Falten und unter Kanten), Struktur kommt als feines Relief aus der Textur
    const wood = walnutTexture();
    wood.repeat.set(1, 8);
    this.MS = {
      soft: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.74, bumpMap: grainTexture(), bumpScale: 0.35 }),
      cloth: new THREE.MeshPhysicalMaterial({
        vertexColors: true, roughness: 0.96, sheen: 0.7, sheenRoughness: 0.6, sheenColor: 0x5d6168, bumpMap: weaveTexture(), bumpScale: 0.6,
      }),
      leather: new THREE.MeshPhysicalMaterial({
        vertexColors: true, roughness: 0.52, bumpMap: leatherTexture(), bumpScale: 0.45, clearcoat: 0.2, clearcoatRoughness: 0.45,
      }),
      wood: new THREE.MeshStandardMaterial({ vertexColors: true, map: wood, roughness: 0.46 }),
      satin: new THREE.MeshStandardMaterial({ vertexColors: true, metalness: 0.85, roughness: 0.32 }),
      gloss: new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.24, clearcoat: 1, clearcoatRoughness: 0.12 }),
      perf: new THREE.MeshStandardMaterial({ vertexColors: true, map: perfTexture(), roughness: 0.72 }),
      label: new THREE.MeshStandardMaterial({ vertexColors: true, map: labelAtlas(), roughness: 0.55 }),
      plush: new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.95, sheen: 1, sheenRoughness: 0.55, sheenColor: 0xffffff, bumpMap: grainTexture(), bumpScale: 0.5 }),
      // schwarzer Lack (Spiegelgehäuse, Motorhaube): spiegelt den Himmel gedämpft, sonst wird die flach gesehene
      // Haube zum hellen Band
      paint: new THREE.MeshPhysicalMaterial({
        vertexColors: true, metalness: 0.4, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 0.75,
      }),
      // Motorhaube: derselbe Lack, aber fast streifend gesehen – spiegelt dort nur gedämpft (sonst ein helles Band)
      hood: new THREE.MeshPhysicalMaterial({
        vertexColors: true, metalness: 0.3, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 0.42,
      }),
      led: new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false }),
    };
    // Aufdrucke ohne Rahmen (LIVE-Logo auf der Prallplatte): durchsichtig, über der Fläche
    const logoTex = liveLogoTexture({ w: 512, h: 512 });
    this.decal = new THREE.MeshStandardMaterial({
      vertexColors: true, map: decalAtlas(logoTex.image), transparent: true, depthWrite: false, roughness: 0.5,
      polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
    });
    logoTex.dispose();
    // Mini Adams Hände und Arme: derselbe Plüsch wie die Figur (Nähte als Vertexfarbe darüber)
    this.skinMat = plush(COLORS.skin, false);
    this.skinMat.vertexColors = true;
    this.shirtMat = plush(COLORS.shirt, false);
    this.shirtMat.vertexColors = true;

    // weiche Schatten unter allem, was auf dem Armaturenbrett steht
    this.shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, map: softDotTexture(), transparent: true, opacity: 0.6, depthWrite: false });
    // Lack, Klavierlack und Satin spiegeln die Umgebung in voller Stärke (siehe update)
    this.mirrorish = [this.MS.gloss, this.MS.satin, this.MS.paint, this.MS.hood];
    this.env = null;
    const S = {};
    for (const k of Object.keys(this.MS)) S[k] = [];
    S.shadow = [];
    this.S = S;

    const M = {
      wiper: new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.6, metalness: 0.4 }),
    };
    this.M = M;

    buildCabin(S, WINDSHIELD);
    buildHood(S);
    this.buildWheel(S);
    this.buildScreen(S);
    this.buildMirrors(S);
    this.buildWipers(M);
    this.buildExtras(S);
    this.flush();

    this.nomi = new Nomi();
    // ganz innerhalb der Scheibe (mit etwas Abstand), damit die Wischer hinter NOMI vorbeistreichen
    this.nomi.group.position.set(-0.27, 0.911, -0.53);
    this.nomi.group.scale.setScalar(1.1);
    this.root.add(this.nomi.group);

    this.steer = 0;
    this.wheelAngle = 0;
    this.elsaWobble = 0;
    this.elsaVel = 0;
    this.headOffset = new THREE.Vector3();
    this.shake = 0;
    this.tmp = { m: new THREE.Matrix4(), w: new THREE.Vector3(), e: new THREE.Vector3() };
    this.placeArms();
    this.driver = null;
    this.eyeWorld = new THREE.Vector3();
    this.scene.onBeforeRender = (renderer, scene, camera) => this.showDriver(camera);
  }

  /** Sammellisten zu je einem Mesh zusammenfassen (wenige Zeichenaufrufe). */
  flush() {
    for (const [k, mat] of Object.entries(this.MS)) {
      const mesh = meshOf(this.S[k], mat);
      if (mesh) this.root.add(mesh);
    }
    const shadow = meshOf(this.S.shadow, this.shadowMat);
    if (shadow) {
      shadow.renderOrder = 1;
      this.root.add(shadow);
    }
    // getöntes Glasdach und Heckscheibe: von innen ein abgedunkelter Himmel über der Kabine (sonst wirkt sie aus
    // freien Kameras wie ein Cabrio mit Überrollbügel)
    const roof = meshOf(roofGlassGeometry(), new THREE.MeshBasicMaterial({ color: 0x0b0e12, transparent: true, opacity: 0.62, depthWrite: false }));
    roof.renderOrder = 2;
    this.root.add(roof);
    this.S = null;
  }

  /**
   * Mini Adam selbst sieht nur, wer nicht in seinem Kopf sitzt (freie Kameras im Prüfstand): dann sitzt die Figur
   * auf ihren Kissen, die langen Plüscharme des Cockpits wachsen aus ihren Schultern. Gebaut wird sie erst beim
   * ersten Blick von außen – im Spiel kostet sie nichts.
   */
  showDriver(camera) {
    const eye = this.eyeWorld.copy(EYE).applyMatrix4(this.root.matrixWorld);
    const outside = camera.position.distanceTo(eye) > 0.15;
    if (outside && !this.driver) {
      const adam = buildMiniAdam({ curved: false });
      adam.setPose('drive');
      // ihre eigenen, kurzen Arme reichen nicht bis ans Lenkrad (führt die Figur ihre Arme als gehäutetes Netz
      // neben dem Knochen, liegt es in userData.skin und wird ebenfalls ausgeblendet)
      for (const arm of [adam.armL, adam.armR]) {
        arm.visible = false;
        if (arm.userData.skin) arm.userData.skin.visible = false;
      }
      const k = SHOULDER.dx / ADAM_DIM.shoulder[0];
      adam.root.scale.setScalar(k);
      adam.root.rotation.y = Math.PI;
      adam.root.position.set(EYE.x, SHOULDER.y - ADAM_DIM.shoulder[1] * k, SHOULDER.z);
      this.root.add(adam.root);
      // die Szene hat ihre Matrizen für dieses Bild schon gerechnet – die neue Figur sonst erst im nächsten
      adam.root.updateMatrixWorld(true);
      this.driver = adam;
    }
    if (this.driver) this.driver.root.visible = outside;
  }

  buildWheel(S) {
    // Lenkrad: dreht sich als Ganzes (eigene Meshes je Material), Säule und Hebel stehen still (Sammellisten)
    const pivot = new THREE.Group();
    pivot.position.copy(WHEEL.c);
    pivot.rotation.x = -WHEEL.tilt;
    pivot.updateMatrix();
    pivot.matrixAutoUpdate = false;
    this.root.add(pivot);
    this.wheelPivot = pivot;
    const wheel = new THREE.Group();
    pivot.add(wheel);
    this.wheel = wheel;
    const L = { leather: [], soft: [], satin: [], gloss: [] };
    const { logo } = buildWheelParts(L);
    for (const [k, list] of Object.entries(L)) wheel.add(meshOf(list, this.MS[k]));
    const [u0, v0, u1, v1] = decalUV('live');
    const uv = logo.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, u0 + (u1 - u0) * uv.getX(i), v0 + (v1 - v0) * uv.getY(i));
    const logoMesh = new THREE.Mesh(prep(logo, 0xf4f2ee, { uv: 'keep' }), this.decal);
    logoMesh.renderOrder = 2;
    wheel.add(logoMesh);
    buildColumn(S);

    // Mini Adams Plüschhände. Wo sie am Kranz greifen, hängt vom Bildformat ab (setAspect):
    // quer gut „Viertel vor drei“, damit NOMI frei bleibt, hochkant höher, sonst landen sie
    // am Bildrand unter den Touch-Knöpfen.
    const rt = (WHEEL.tr + WHEEL.td) / 2;
    this.hands = [-1, 1].map((s) => {
      const hand = new THREE.Mesh(mittenGeometry(s, rt, WHEEL.R), this.skinMat);
      hand.userData.side = s;
      wheel.add(hand);
      return hand;
    });
    this.rimR = WHEEL.R;
    this.grip = GRIP_WIDE;
    this.gripTarget = GRIP_WIDE;
    this.gripSet = false;
    this.placeHands();
    // Arme wie beim Plüsch: kurzer schwarzer T-Shirt-Ärmel an der Schulter, darunter der hautfarbene Plüscharm mit
    // weichem Ellbogen bis in die Hand (placeArms richtet sie jedes Bild aus)
    const upperGeo = upperArmGeometry(UPPER_LEN);
    const sleeveGeo = sleeveGeometry(SLEEVE_LEN);
    this.arms = [-1, 1].map((s) => {
      const upper = new THREE.Mesh(upperGeo, this.skinMat);
      const fore = new THREE.Mesh(forearmGeometry(FORE_LEN, s), this.skinMat);
      const sleeve = new THREE.Mesh(sleeveGeo, this.shirtMat);
      this.root.add(upper, fore, sleeve);
      return {
        upper, fore, sleeve,
        shoulder: new THREE.Vector3(EYE.x + s * SHOULDER.dx, SHOULDER.y, SHOULDER.z),
        sag: new THREE.Vector3(s * ELBOW.out, -ELBOW.down, 0),
      };
    });
  }

  /** Hände an den Kranz setzen (Griffwinkel this.grip ab 12 Uhr). */
  placeHands() {
    const R = WHEEL.R;
    for (const hand of this.hands) {
      const a = hand.userData.side * this.grip;
      hand.position.set(Math.sin(a) * R, Math.cos(a) * R, 0);
      hand.rotation.z = -a;
    }
  }

  /** Ärmel und Oberarm ab der Schulter, Unterarm ab dem Handgelenk ausrichten; beide treffen sich im Ellbogen. */
  placeArms() {
    const { m, w, e } = this.tmp;
    this.wheel.updateMatrix();
    for (let i = 0; i < 2; i++) {
      const hand = this.hands[i];
      hand.updateMatrix();
      m.multiplyMatrices(this.wheelPivot.matrix, this.wheel.matrix).multiply(hand.matrix);
      w.copy(WRIST).applyMatrix4(m);
      const a = this.arms[i];
      e.lerpVectors(a.shoulder, w, ELBOW.at).add(a.sag);
      aimAlong(a.sleeve, a.shoulder, e);
      aimAlong(a.upper, a.shoulder, e, UPPER_LEN);
      aimAlong(a.fore, w, e, FORE_LEN);
    }
  }

  /** Bildformat (Breite/Höhe) der Cockpitkamera; hochkant ist das Bild schmal, die Hände greifen höher. */
  setAspect(aspect) {
    if (!(aspect > 0 && aspect < Infinity)) return; // Fenster (noch) ohne Größe
    this.gripTarget = GRIP_TALL + (GRIP_WIDE - GRIP_TALL) * smoothstep(0.6, 1.0, aspect);
    if (!this.gripSet) {
      // beim Start sofort, danach (Handy gedreht) gleiten die Hände am Kranz entlang
      this.gripSet = true;
      this.grip = this.gripTarget;
      this.placeHands();
      this.placeArms();
    }
    this.liveAspect = aspect;
    setLiveCrop(this.liveDisplay, aspect);
  }

  buildScreen(S) {
    this.screen = new CenterScreen();
    const g = new THREE.Group();
    g.position.set(0.0, 1.03, -0.465);
    g.rotation.x = -0.16;
    g.updateMatrix();
    this.screenMatrix = g.matrix.clone();
    const at = (geo) => geo.applyMatrix4(this.screenMatrix);
    // Rahmen in Klavierlack mit weicher Kante, Fuß auf dem Armaturenbrett
    S.gloss.push(prep(at(place(rbox(0.352, 0.226, 0.018, 0.006, 3), 0, 0, -0.01)), PAL.gloss));
    S.soft.push(prep(at(place(rbox(0.06, 0.09, 0.03, 0.008, 3), 0, -0.135, -0.03)), PAL.padLow, { shade: (p) => 0.55 + 0.45 * smoothstep(0.91, 0.95, p.y) }));
    // Kontaktschatten: die Unterkante des Bildschirms schwebt knapp über dem Armaturenbrett
    blob(S, 0, dashTopY(0, -0.455), -0.455, 0.2, 0.045);
    const display = new THREE.Mesh(
      new THREE.PlaneGeometry(0.336, 0.21),
      new THREE.MeshBasicMaterial({ map: this.screen.texture, toneMapped: false }),
    );
    display.position.z = 0.0005;
    g.add(display);
    this.root.add(g);
    this.displayMat = display.material;
  }

  buildMirrors(S) {
    // Innenspiegel
    const mw = 0.245;
    const mh = 0.072;
    const shape = roundedRect(mw, mh, 0.03);
    const glassGeo = new THREE.ShapeGeometry(shape, 6);
    const uv = glassGeo.attributes.uv;
    const pos = glassGeo.attributes.position;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, 1 - (pos.getX(i) / mw + 0.5), pos.getY(i) / mh + 0.5);
    this.mirrorMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const mirror = new THREE.Group();
    // hängt knapp hinter der Scheibe (die Scheibe ist sehr flach, deshalb etwas tiefer als früher)
    mirror.position.set(-0.08, 1.235, -0.225);
    mirror.rotation.set(-0.06, -0.18, 0);
    mirror.updateMatrix();
    const glass = new THREE.Mesh(glassGeo, this.mirrorMat);
    glass.position.z = 0.0205;
    // rahmenlos wie beim Model 3: Das Glas liegt auf einer dünnen Trägerplatte mit schmaler, runder Kante, dahinter
    // sitzt ein kleineres, weich gerundetes Gehäuse – von vorn verdeckt, vom Beifahrer aus ein glatter Kiesel.
    // Die Rückseite (z = −0,004) trägt das Kugelgelenk des Spiegelfußes.
    const carrier = new THREE.ExtrudeGeometry(shape, { depth: 0.002, bevelEnabled: true, bevelSize: 0.0018, bevelThickness: 0.0016, bevelSegments: 2, curveSegments: 4 });
    carrier.translate(0, 0, 0.0167);
    S.gloss.push(prep(carrier.applyMatrix4(mirror.matrix), PAL.mirror));
    const shell = new THREE.ExtrudeGeometry(roundedRect(mw - 0.036, mh - 0.024, 0.022), { depth: 0.008, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006, bevelSegments: 3, curveSegments: 4 });
    shell.translate(0, 0, 0.002);
    S.gloss.push(prep(shell.applyMatrix4(mirror.matrix), PAL.mirror, { shade: (p) => 0.75 + 0.25 * smoothstep(1.2, 1.26, p.y) }));
    // im Spiegel sieht man das Heckfenster mit C-Säulen, Dachhimmel und Kopfstützen
    const maskGeo = glassGeo.clone();
    const mUv = maskGeo.attributes.uv;
    for (let i = 0; i < mUv.count; i++) mUv.setXY(i, pos.getX(i) / mw + 0.5, pos.getY(i) / mh + 0.5);
    this.mirrorFrame = new THREE.Mesh(maskGeo, new THREE.MeshBasicMaterial({ map: rearWindowTexture(), transparent: true, depthWrite: false }));
    this.mirrorFrame.position.z = 0.021;
    mirror.add(glass, this.mirrorFrame);
    this.root.add(mirror);

    // Kameragehäuse an der Frontscheibe (wie beim Model 3, nur kompakter): ein weiches Kissen, oben rund, das flach
    // auf dem Glas liegt und zum Innenraum hin gewölbt ist; der Spiegel hängt mit einem kurzen Kugelgelenk daran
    const W = WINDSHIELD;
    // Scheibenkoordinaten (x quer, v längs ab der Unterkante, d nach innen) → Fahrzeug; öffentlich wie bisher
    const toGlass = new THREE.Matrix4().makeBasis(W.X, W.U, W.N.clone().negate()).setPosition(W.base);
    this.mirrorHousing = { toGlass, onGlass: (x, v, d) => new THREE.Vector3(x, v, d).applyMatrix4(toGlass) };
    S.cloth.push(prep(housingGeometry(toGlass), PAL.cloth, {
      // zum Glas hin im Schatten, die gewölbte Vorderseite fängt Licht durchs Heckfenster (sonst ein dunkler Fleck
      // vor dem Himmel)
      shade: (p, n) => {
        const d = -(p.clone().sub(W.base).dot(W.N));
        return (0.62 + 0.38 * smoothstep(0.002, 0.016, d)) * (0.9 + 0.55 * clamp(-n.dot(W.N), 0, 1));
      },
      uv: 'keep',
    }));
    // die Innenraumkamera des Autos (wie beim Model 3 knapp über dem Spiegel): Zierring und dunkle Linse
    const kLens = 0.85;
    const lensAt = new THREE.Vector3(HOUSING.x, HOUSING.v0 + kLens * (HOUSING.v1 - HOUSING.v0), housingDepth(0, kLens) - 0.0008);
    const lensM = new THREE.Matrix4().makeBasis(W.X, W.N.clone().negate(), W.U.clone().negate()).setPosition(lensAt.applyMatrix4(toGlass));
    const lensRing = lathe([[0.0036, 0], [0.0056, 0], [0.0056, 0.0012, 0.0006], [0.0046, 0.0019, 0.0006], [0.0036, 0.0015]], 20);
    S.satin.push(prep(lensRing.applyMatrix4(lensM), PAL.satin));
    const lensGlass = new THREE.SphereGeometry(0.0046, 18, 5, 0, Math.PI * 2, 0, 0.9);
    lensGlass.translate(0, 0.0014 - 0.0046 * Math.cos(0.9), 0);
    S.gloss.push(prep(lensGlass.applyMatrix4(lensM), 0x0d1a2c));
    // Kugelgelenk: sitzt am Spiegelrücken und steckt mit einem kurzen Hals in der Unterseite des Gehäuses
    const footEnd = new THREE.Vector3(-0.08, 1.258, -0.2385);
    const footTop = new THREE.Vector3(-0.08, 1.278, -0.243);
    S.gloss.push(prep(roundBeam(footTop, footEnd, 0.013, 0.011), PAL.mirror));
    S.gloss.push(prep(place(new THREE.SphereGeometry(0.0105, 16, 12), footEnd.x, footEnd.y, footEnd.z), PAL.mirror));

    // Außenspiegel links (zeigt den linken Teil der Rückansicht): Model-3-Form – außen groß
    // gerundet, innen niedriger und straffer –, Gehäuse als gerundete Schale nach vorne,
    // das Spiegelglas sitzt mit schmalem Rand darin. Montiert auf einem kurzen Fuß an der Tür.
    const side = new THREE.Group();
    side.position.set(-1.0, 1.045, -0.6);
    side.rotation.y = 0.62;
    side.updateMatrix();
    S.paint.push(prep(mirrorHousingGeometry(-1).applyMatrix4(side.matrix), 0x0b0c0e, { uv: 'keep' }));
    const sGeo = new THREE.ShapeGeometry(mirrorShape(0.9, -1), 12);
    sGeo.computeBoundingBox();
    const bb = sGeo.boundingBox;
    const sUv = sGeo.attributes.uv;
    const sPos = sGeo.attributes.position;
    // rechter Teil des Rückspiegelbildes (= links hinter dem Auto), gespiegelt wie ein echter Spiegel
    for (let i = 0; i < sUv.count; i++) {
      const fx = (sPos.getX(i) - bb.min.x) / (bb.max.x - bb.min.x);
      const fy = (sPos.getY(i) - bb.min.y) / (bb.max.y - bb.min.y);
      sUv.setXY(i, 1 - fx * 0.34, 0.03 + fy * 0.6);
    }
    this.sideMirrorMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sGlass = new THREE.Mesh(sGeo, this.sideMirrorMat);
    sGlass.position.z = 0.002;
    side.add(sGlass);
    const armEnd = new THREE.Vector3(0.095, -0.028, -0.05).applyMatrix4(side.matrix);
    S.soft.push(prep(roundBeam(new THREE.Vector3(-0.79, 0.99, -0.66), armEnd, 0.05, 0.035), 0x26282c, { uv: 'keep' }));
    this.root.add(side);
  }

  setMirrorTexture(tex) {
    this.mirrorMat.map = tex;
    this.mirrorMat.needsUpdate = true;
    this.sideMirrorMat.map = tex;
    this.sideMirrorMat.needsUpdate = true;
    this.mirrorFrame.visible = true;
  }

  /** Das Live-Display der Action-Cam zeigt das Weltbild (main.js reicht die Textur des Welt-Renderziels herein). */
  setLiveTexture(tex) {
    const u = this.liveDisplay.material.uniforms;
    u.tLive.value = tex;
    u.uOn.value = tex ? 1 : 0;
  }

  /** Innenspiegel zeigt die Kofferraum-Kamera (ohne Heckfenster-Rahmen), der Außenspiegel bleibt. */
  setTrunkView(tex) {
    this.mirrorMat.map = tex;
    this.mirrorMat.needsUpdate = true;
    this.mirrorFrame.visible = false;
  }

  buildWipers() {
    this.wipers = buildWipers(WINDSHIELD, WIPERS);
    this.root.add(this.wipers.group);
  }

  buildExtras(S) {
    // Stream-Technik: Action-Cam an der Scheibe (ihr roter REC-Punkt ist recLed, main.js blendet ihn unter dem
    // Chat aus), Facecam auf dem Bildschirm, Bonding-Box auf dem Armaturenbrett, Kabel
    const rig = buildRig(S, {
      W: WINDSHIELD, screenM: this.screenMatrix, eye: EYE, onPillar: (t) => pillarPoint(WINDSHIELD, 1, t, 1.25, 0.004),
    });
    this.recLed = rig.led;
    this.liveDisplay = rig.display;
    this.rigOnGlass = rig.glass;
    this.root.add(rig.led, rig.display);
    // Mitbringsel: Bananensaft und Dampfcola in den Becherhaltern, Megafon und Pandamütze auf dem Beifahrersitz
    buildProps(S, { x: 0.37, y: SEAT.y + SEAT.h / 2 + SEAT.puff, z: SEAT.z, tilt: SEAT.tilt });
    // NOMI steht auf dem Armaturenbrett
    blob(S, -0.27, dashTopY(-0.27, -0.53), -0.53, 0.058, 0.05);

    // Wackel-Elsa (Shop)
    this.elsa = buildElsa({ curved: false });
    // aus 38 Einzelteilen werden 8 (je Material eins, die winkenden Flossen bleiben beweglich)
    mergeByMaterial(this.elsa, [this.elsa.userData.finL, this.elsa.userData.finR]);
    this.elsa.scale.setScalar(0.11);
    this.elsaSpring = new THREE.Group();
    this.elsaSpring.position.set(-0.6, dashTopY(-0.6, -0.68), -0.68);
    this.elsaSpring.rotation.y = 0.5;
    const springBase = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.012, 24), new THREE.MeshPhysicalMaterial({ color: PAL.gloss, roughness: 0.3, clearcoat: 1 }));
    springBase.position.y = 0.006;
    const springShadow = new THREE.Mesh(new THREE.PlaneGeometry(0.075, 0.075).rotateX(-Math.PI / 2), this.shadowMat);
    springShadow.position.y = 0.0012;
    springShadow.renderOrder = 1;
    this.elsaSpring.add(springBase, springShadow, this.elsa);
    // die Schwanzflosse steht auf dem Rand des Sockels (Oberkante bei y = 0.012)
    this.elsa.position.y = 0.0105;
    this.elsaSpring.visible = false;
    this.root.add(this.elsaSpring);

    // Radarwarner (Shop): das Kästchen mit dem Lämpchen, links vom Lenkrad schräg vor Elsas Platz
    this.radar = buildRadar(this.MS, this.shadowMat);
    this.radar.group.visible = false;
    this.root.add(this.radar.group);

    // Konfetti an der Innenseite der Scheibe (Konfetti-Kanone)
    const cGeo = new THREE.PlaneGeometry(0.012, 0.008);
    this.confetti = new THREE.InstancedMesh(cGeo, new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.6 }), 400);
    this.confetti.count = 0;
    this.confetti.frustumCulled = false;
    this.root.add(this.confetti);
  }

  addConfetti(n = 40) {
    const W = WINDSHIELD;
    const basis = new THREE.Matrix4().makeBasis(W.X, W.U, W.N.clone().negate());
    const qBase = new THREE.Quaternion().setFromRotationMatrix(basis);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const zq = new THREE.Quaternion();
    const colors = [0xff3b6b, 0xffd23f, 0x3bceac, 0x5a8dee, 0xff8c42, 0xb47cff, 0xffffff];
    const c = new THREE.Color();
    // nicht dort, wo etwas am Glas sitzt oder es berührt: Spiegelgehäuse, Saugnapf und Kabel der Action-Cam,
    // Oberkante des Bildschirms mit der Facecam (ein Schnipsel stäke sonst darin oder läge davor)
    const busy = [
      [HOUSING.x - HOUSING.hw - 0.02, HOUSING.x + HOUSING.hw + 0.02, HOUSING.v0 - 0.025, HOUSING.v1 + 0.02],
      [-0.21, 0.21, 0.4, 0.58],
      ...this.rigOnGlass,
    ];
    const blocked = (x, u) => busy.some(([x0, x1, u0, u1]) => x > x0 && x < x1 && u > u0 && u < u1);
    for (let i = 0, tries = 0; i < n && this.confetti.count < 400 && tries < n * 4; tries++) {
      const u = Math.random() * W.length * 0.9 + 0.03;
      const half = W.halfBase + (W.halfTop - W.halfBase) * (u / W.length) - 0.05;
      const x = (Math.random() * 2 - 1) * half;
      if (blocked(x, u)) continue;
      i++;
      const p = W.base.clone().addScaledVector(W.U, u);
      p.x = x;
      p.addScaledVector(W.N, -0.006);
      zq.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.random() * Math.PI);
      q.copy(qBase).multiply(zq);
      m.compose(p, q, new THREE.Vector3(1, 1, 1).multiplyScalar(0.7 + Math.random() * 0.8));
      const idx = this.confetti.count++;
      this.confetti.setMatrixAt(idx, m);
      this.confetti.setColorAt(idx, c.setHex(colors[idx % colors.length]));
    }
    this.confetti.instanceMatrix.needsUpdate = true;
    if (this.confetti.instanceColor) this.confetti.instanceColor.needsUpdate = true;
  }

  clearConfetti() {
    this.confetti.count = 0;
  }

  setElsa(v) {
    this.elsaSpring.visible = !!v;
  }

  /** Radarwarner aus dem Shop aufs Armaturenbrett stellen (oder wegnehmen). */
  setRadar(v) {
    this.radar.group.visible = !!v;
  }

  /** Kamera-Pose (Weltkoordinaten) aus Fahrzeug-Transformation + Kopfbewegung. */
  placeCamera(camera, carMatrix, t, speed, latAcc, dt) {
    // das Abklingen von shake passiert einmal pro Bild im Hauptprogramm (auch in Drohne, Pause, Abspann)
    const vib = Math.min(1, speed / 60) * 0.0025 + this.shake * 0.03;
    this.headOffset.x = damp(this.headOffset.x, clamp(-latAcc * 0.006, -0.05, 0.05), 4, dt);
    const ox = this.headOffset.x + (Math.sin(t * 37) * 0.5 + Math.sin(t * 23) * 0.5) * vib;
    const oy = (Math.sin(t * 29) + Math.sin(t * 13.3)) * 0.5 * vib + Math.sin(t * 1.4) * 0.003;
    const eye = EYE.clone().add(new THREE.Vector3(ox, oy, 0));
    eye.applyMatrix4(carMatrix);
    camera.position.copy(eye);
    const q = new THREE.Quaternion().setFromRotationMatrix(carMatrix);
    const e = new THREE.Euler(PITCH + oy * 2, this.headOffset.x * 0.6 + Math.sin(t * 0.31) * 0.004, -latAcc * 0.0025 + ox * 2, 'YXZ');
    camera.quaternion.copy(q).multiply(new THREE.Quaternion().setFromEuler(e));
  }

  /**
   * @param {object} st steer (-1..1), speed (m/s), latAcc, t, dt, wiperAngles [a, b], sunDir, overcast,
   *   adam (Animationswerte der Figur, wie sie main.js für Mini Adam im Auto und in der Facecam rechnet),
   *   radar (warnt der Radarwarner gerade? Dann blinkt sein Lämpchen)
   */
  update(st) {
    const { dt, t } = st;
    // st.steer ist schon die ruhige Lenkkurve aus steering.js: hier nur noch eine Spur glätten, kein Nachhinken
    this.wheelAngle = damp(this.wheelAngle, st.steer * 1.25, 40, dt);
    this.wheel.rotation.z = -this.wheelAngle;
    // Griff ans Bildformat angleichen (nach dem Drehen des Handys gleiten die Hände hin)
    if (this.grip !== this.gripTarget) {
      this.grip = Math.abs(this.grip - this.gripTarget) < 0.002 ? this.gripTarget : damp(this.grip, this.gripTarget, 5, dt);
      this.placeHands();
    }
    this.placeArms();
    // Wischer
    if (st.wiperAngles) this.wipers.set(st.wiperAngles, st.wiperFlex, 1 - 0.35 * (st.overcast || 0));
    // Wackel-Elsa: Feder-Dämpfer auf Querbeschleunigung
    if (this.elsaSpring.visible) {
      const k = 60;
      const c = 3.5;
      const force = -k * this.elsaWobble - c * this.elsaVel - (st.latAcc || 0) * 0.9;
      this.elsaVel += force * dt;
      this.elsaWobble += this.elsaVel * dt;
      this.elsaWobble = clamp(this.elsaWobble, -0.6, 0.6);
      this.elsa.rotation.z = this.elsaWobble;
      animateElsa(this.elsa, t, this.elsaWobble);
    }
    if (this.radar.group.visible) this.radar.update(!!st.radar, t);
    this.recLed.visible = Math.sin(t * 3.5) > -0.3;
    // Licht an Wetter/Sonne angleichen
    const o = st.overcast || 0;
    if (st.sunDir) {
      this.sun.position.copy(this.root.position).addScaledVector(st.sunDir, 10);
      this.sun.target.position.copy(this.root.position);
    }
    this.sun.intensity = LIGHT.sun * (1 - o * 0.85);
    this.hemi.intensity = LIGHT.hemi - o * 0.4;
    this.back.intensity = LIGHT.back - o * 0.25;
    // Spiegelnde Teile bekommen die Umgebung direkt (mit eigener Stärke), sobald main.js sie setzt oder tauscht
    const env = this.scene.environment;
    if (env !== this.env) {
      this.env = env;
      for (const m of this.mirrorish) {
        m.envMap = env;
        m.needsUpdate = true;
      }
    }
    // Mit eigener envMap gilt die Drehung des Materials, nicht die der Szene: mit dem Kurs mitdrehen wie die Welt
    for (const m of this.mirrorish) m.envMapRotation.copy(this.scene.environmentRotation);
    if (this.driver && this.driver.root.visible) this.driver.animate(t, st.adam || { steer: st.steer });
    this.nomi.update(dt, t, -0.16);
    this.screen.update(dt, st.screen);
  }
}
