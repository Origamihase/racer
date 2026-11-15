// Das Cockpit des Model 3 aus Mini Adams Sicht: flaches Armaturenbrett mit Holzleiste und
// Luftschlitz, großer Mittelbildschirm, Lenkrad mit LIVE-Logo, Mini Adams Plüschhände,
// Innen- und Außenspiegel (echte Rückansicht), NOMI, Stream-Kamera und die Scheibenwischer.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { woodTexture, liveLogoTexture, fabricTexture } from '../textures.js';
import { Nomi } from './nomi.js';
import { CenterScreen } from './screen.js';
import { buildElsa, animateElsa } from '../models/elsa.js';
import { damp, clamp } from '../util.js';

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

// Wischer: Drehpunkt (unten, außen), Länge, maximaler Winkel
export const WIPERS = [
  { pivot: new THREE.Vector3(-0.64, 0.884, -0.905), length: 0.62, max: 1.95 },
  { pivot: new THREE.Vector3(0.06, 0.884, -0.905), length: 0.56, max: 1.75 },
];

function plushMat(color) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.95,
    sheen: 1,
    sheenRoughness: 0.5,
    sheenColor: new THREE.Color(color).lerp(new THREE.Color(0xffffff), 0.35),
    bumpMap: fabricTexture(5),
    bumpScale: 0.5,
  });
}

/** Abgerundete Leiste (flache Kapsel) zwischen zwei Punkten, w quer, d in die Tiefe. */
function roundBeam(a, b, w, d, mat, twist = 0) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const r = 0.5;
  const g = new THREE.CapsuleGeometry(r, Math.max(0.001, len / Math.max(w, d) - 2 * r), 6, 16);
  // Kapsel auf Länge len bringen und abflachen
  g.scale(w, Math.max(w, d), d);
  g.translate(0, len / 2, 0);
  if (twist) g.rotateY(twist);
  const m = new THREE.Mesh(g, mat);
  m.position.copy(a);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return m;
}

export class Cockpit {
  constructor() {
    this.scene = new THREE.Scene();
    this.root = new THREE.Group();
    this.root.name = 'Cockpit';
    this.scene.add(this.root);

    this.hemi = new THREE.HemisphereLight(0xc8dcff, 0x40372c, 1.25);
    this.scene.add(this.hemi);
    this.sun = new THREE.DirectionalLight(0xfff0dc, 2.0);
    this.scene.add(this.sun);
    this.scene.add(this.sun.target);
    this.fill = new THREE.PointLight(0xfff4e8, 0.25, 2.5, 1.2);
    this.fill.position.set(-0.2, 1.25, 0.1);
    this.root.add(this.fill);

    const M = {
      dashTop: new THREE.MeshStandardMaterial({ color: 0x1d1e21, roughness: 0.86 }),
      dash: new THREE.MeshStandardMaterial({ color: 0x18191c, roughness: 0.62 }),
      vent: new THREE.MeshStandardMaterial({ color: 0x050506, roughness: 0.9 }),
      wood: new THREE.MeshStandardMaterial({ map: woodTexture(), roughness: 0.42, color: 0xd9c4b0 }),
      pillar: new THREE.MeshStandardMaterial({ color: 0x26272a, roughness: 0.95 }),
      door: new THREE.MeshStandardMaterial({ color: 0x1b1c1f, roughness: 0.68 }),
      chrome: new THREE.MeshStandardMaterial({ color: 0xb9bdc2, metalness: 1, roughness: 0.22 }),
      rim: new THREE.MeshStandardMaterial({ color: 0x131315, roughness: 0.52 }),
      spoke: new THREE.MeshStandardMaterial({ color: 0x2b2c30, metalness: 0.55, roughness: 0.32 }),
      black: new THREE.MeshStandardMaterial({ color: 0x0b0b0c, roughness: 0.3, metalness: 0.2 }),
      skin: plushMat(0xd9a477),
      sleeve: plushMat(0x161618),
      wiper: new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.6, metalness: 0.4 }),
    };
    this.M = M;

    this.buildDash(M);
    this.buildPillars(M);
    this.buildDoor(M);
    this.buildWheel(M);
    this.buildScreen(M);
    this.buildMirrors(M);
    this.buildWipers(M);
    this.buildExtras(M);

    this.nomi = new Nomi();
    this.nomi.group.position.set(-0.225, 0.913, -0.66);
    this.nomi.group.scale.setScalar(1.3);
    this.root.add(this.nomi.group);

    this.steer = 0;
    this.wheelAngle = 0;
    this.elsaWobble = 0;
    this.elsaVel = 0;
    this.headOffset = new THREE.Vector3();
    this.shake = 0;
  }

  buildDash(M) {
    const sh = new THREE.Shape();
    const pts = [
      [-0.92, 0.882], [-0.86, 0.9], [-0.5, 0.913], [-0.455, 0.905], [-0.42, 0.875], [-0.405, 0.85], [-0.405, 0.8],
      [-0.43, 0.793], [-0.43, 0.776], [-0.395, 0.77], [-0.335, 0.62], [-0.35, 0.42], [-0.92, 0.42],
    ];
    sh.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) sh.lineTo(pts[i][0], pts[i][1]);
    sh.closePath();
    const W = 1.6;
    const g = new THREE.ExtrudeGeometry(sh, { depth: W, bevelEnabled: false, curveSegments: 4 });
    g.rotateY(-Math.PI / 2);
    g.translate(W / 2, 0, 0);
    const dash = new THREE.Mesh(g, M.dashTop);
    this.root.add(dash);
    // Holzleiste über die ganze Breite
    const woodGeo = new THREE.BoxGeometry(1.5, 0.05, 0.012);
    const wood = new THREE.Mesh(woodGeo, M.wood);
    wood.position.set(0.02, 0.826, -0.399);
    this.root.add(wood);
    // Luftschlitz (dunkel)
    const vent = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.014, 0.02), M.vent);
    vent.position.set(0.02, 0.785, -0.425);
    this.root.add(vent);
    // Lautsprecher-Gitter oben auf dem Armaturenbrett (links und rechts)
    for (const x of [-0.62, 0.62]) {
      const sp = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.004, 0.08), M.vent);
      sp.position.set(x, 0.912, -0.78);
      this.root.add(sp);
    }
  }

  buildPillars(M) {
    const W = WINDSHIELD;
    for (const s of [-1, 1]) {
      // A-Säule: unten im Armaturenbrett verankert, oben in den Dachrahmen übergehend
      const a = new THREE.Vector3(s * 0.765, W.base.y - 0.07, W.base.z - 0.03);
      const b = new THREE.Vector3(s * 0.64, W.top.y + 0.015, W.top.z + 0.0);
      this.root.add(roundBeam(a, b, 0.085, 0.06, M.pillar));
      const c = new THREE.Vector3(s * 0.68, W.top.y + 0.035, 0.8);
      this.root.add(roundBeam(b, c, 0.08, 0.07, M.pillar));
    }
    const header = new THREE.Mesh(new RoundedBoxGeometry(1.34, 0.06, 0.12, 3, 0.025), M.pillar);
    header.position.set(0, W.top.y + 0.02, W.top.z + 0.03);
    this.root.add(header);
  }

  buildDoor(M) {
    const door = new THREE.Group();
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.56, 1.35), M.door);
    panel.position.set(-0.8, 0.7, -0.08);
    door.add(panel);
    const sill = new THREE.Mesh(new RoundedBoxGeometry(0.075, 0.06, 1.3, 3, 0.025), M.dash);
    sill.position.set(-0.775, 0.975, -0.06);
    door.add(sill);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 0.4), M.dashTop);
    arm.position.set(-0.73, 0.76, 0.15);
    door.add(arm);
    const wood = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.04, 0.8), M.wood);
    wood.position.set(-0.762, 0.9, -0.1);
    door.add(wood);
    const btn = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.018, 0.04), M.black);
    btn.position.set(-0.76, 0.86, -0.32);
    door.add(btn);
    this.root.add(door);
  }

  buildWheel(M) {
    // Lenkrad: Kranz, zwei Speichen mit Scrollrädern, Prallplatte mit LIVE-Logo
    const pivot = new THREE.Group();
    pivot.position.set(-0.37, 0.865, -0.2);
    pivot.rotation.x = -0.5;
    this.root.add(pivot);
    const wheel = new THREE.Group();
    pivot.add(wheel);
    this.wheel = wheel;
    const R = 0.17;
    const rimGeo = new THREE.TorusGeometry(R, 0.023, 14, 56);
    rimGeo.scale(1.0, 0.94, 1.15);
    wheel.add(new THREE.Mesh(rimGeo, M.rim));
    for (const s of [-1, 1]) {
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.034, 0.02), M.spoke);
      spoke.position.set(s * 0.115, -0.01, -0.005);
      wheel.add(spoke);
      const scroll = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.01, 16), M.black);
      scroll.rotation.x = Math.PI / 2;
      scroll.position.set(s * 0.11, -0.01, 0.009);
      wheel.add(scroll);
    }
    const lower = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.11, 0.02), M.spoke);
    lower.position.set(0, -0.1, -0.005);
    wheel.add(lower);
    const hubGeo = new THREE.CylinderGeometry(0.065, 0.07, 0.04, 28);
    hubGeo.rotateX(Math.PI / 2);
    hubGeo.scale(1.25, 0.85, 1);
    const hub = new THREE.Mesh(hubGeo, M.rim);
    hub.position.set(0, -0.008, -0.01);
    wheel.add(hub);
    const logo = new THREE.Mesh(
      new THREE.PlaneGeometry(0.075, 0.075),
      new THREE.MeshStandardMaterial({ map: liveLogoTexture({ w: 256, h: 256 }), transparent: true, roughness: 0.4, alphaTest: 0.2 }),
    );
    logo.position.set(0, -0.004, 0.011);
    wheel.add(logo);
    // Lenksäule + Hebel
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.24, 14), M.dash);
    col.rotation.x = Math.PI / 2;
    col.position.set(0, -0.01, -0.13);
    pivot.add(col);
    for (const s of [-1, 1]) {
      const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.006, 0.14, 8), M.black);
      stalk.rotation.z = s * (Math.PI / 2 - 0.25);
      stalk.position.set(s * 0.09, 0.0, -0.08);
      pivot.add(stalk);
    }

    // Mini Adams Plüschhände (fast „Viertel vor drei“, damit NOMI zu sehen ist)
    this.hands = [];
    for (const s of [-1, 1]) {
      const a = s * 1.32;
      const hand = new THREE.Group();
      hand.position.set(Math.sin(a) * R, Math.cos(a) * R, 0.012);
      hand.rotation.z = -a;
      const palm = new THREE.Mesh(new THREE.SphereGeometry(0.048, 18, 14), M.skin);
      palm.scale.set(1.05, 0.85, 0.85);
      palm.position.set(0, 0.005, 0.014);
      const thumb = new THREE.Mesh(new THREE.SphereGeometry(0.019, 12, 10), M.skin);
      thumb.position.set(-s * 0.03, -0.012, 0.035);
      const back = new THREE.Mesh(new THREE.SphereGeometry(0.04, 14, 10), M.skin);
      back.scale.set(1, 0.7, 0.6);
      back.position.set(0, 0.01, -0.025);
      hand.add(palm, thumb, back);
      wheel.add(hand);
      this.hands.push(hand);
    }
    // Arme (werden jedes Bild zwischen Schulter und Hand ausgerichtet)
    this.arms = [];
    const armGeo = new THREE.CapsuleGeometry(0.036, 1, 6, 14);
    const sleeveGeo = new THREE.CylinderGeometry(0.052, 0.058, 1, 16, 1, true);
    for (const s of [-1, 1]) {
      const arm = new THREE.Mesh(armGeo, M.sleeve);
      const sleeve = new THREE.Mesh(sleeveGeo, M.sleeve);
      this.root.add(arm, sleeve);
      this.arms.push({ arm, sleeve, shoulder: new THREE.Vector3(-0.37 + s * 0.25, 0.84, 0.3) });
    }
  }

  buildScreen(M) {
    this.screen = new CenterScreen();
    const g = new THREE.Group();
    g.position.set(0.0, 1.03, -0.465);
    g.rotation.x = -0.16;
    const bezel = new THREE.Mesh(new THREE.BoxGeometry(0.352, 0.226, 0.018), M.black);
    bezel.position.z = -0.01;
    const display = new THREE.Mesh(
      new THREE.PlaneGeometry(0.336, 0.21),
      new THREE.MeshBasicMaterial({ map: this.screen.texture, toneMapped: false }),
    );
    display.position.z = 0.0005;
    const stand = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.03), M.dash);
    stand.position.set(0, -0.13, -0.03);
    g.add(bezel, display, stand);
    this.root.add(g);
    this.displayMat = display.material;
  }

  buildMirrors(M) {
    // Innenspiegel
    const mw = 0.245;
    const mh = 0.072;
    const shape = new THREE.Shape();
    const r = 0.03;
    shape.moveTo(-mw / 2 + r, -mh / 2);
    shape.lineTo(mw / 2 - r, -mh / 2);
    shape.quadraticCurveTo(mw / 2, -mh / 2, mw / 2, -mh / 2 + r);
    shape.lineTo(mw / 2, mh / 2 - r);
    shape.quadraticCurveTo(mw / 2, mh / 2, mw / 2 - r, mh / 2);
    shape.lineTo(-mw / 2 + r, mh / 2);
    shape.quadraticCurveTo(-mw / 2, mh / 2, -mw / 2, mh / 2 - r);
    shape.lineTo(-mw / 2, -mh / 2 + r);
    shape.quadraticCurveTo(-mw / 2, -mh / 2, -mw / 2 + r, -mh / 2);
    const glassGeo = new THREE.ShapeGeometry(shape, 6);
    const uv = glassGeo.attributes.uv;
    const pos = glassGeo.attributes.position;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, 1 - (pos.getX(i) / mw + 0.5), pos.getY(i) / mh + 0.5);
    this.mirrorMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const mirror = new THREE.Group();
    // hängt knapp hinter der Scheibe (die Scheibe ist sehr flach, deshalb etwas tiefer als früher)
    mirror.position.set(-0.08, 1.235, -0.225);
    mirror.rotation.set(-0.06, -0.18, 0);
    const glass = new THREE.Mesh(glassGeo, this.mirrorMat);
    glass.position.z = 0.021;
    const frameGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.022, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006, bevelSegments: 2 });
    frameGeo.translate(0, 0, -0.012);
    const frame = new THREE.Mesh(frameGeo, M.black);
    mirror.add(frame, glass);
    this.root.add(mirror);

    // Kameragehäuse oben an der Frontscheibe (wie beim Model 3), daran hängt der Innenspiegel
    const W = WINDSHIELD;
    const toGlass = new THREE.Matrix4().makeBasis(W.X, W.U, W.N.clone().negate()).setPosition(W.base);
    const hs = new THREE.Shape();
    const hx = -0.07; // Mitte des Gehäuses (über dem Spiegel)
    const hb = 0.075; // halbe Breite unten
    const ht = 0.14; // halbe Breite oben
    const v0 = 0.79;
    const v1 = 0.95;
    hs.moveTo(hx - hb + 0.025, v0);
    hs.lineTo(hx + hb - 0.025, v0);
    hs.quadraticCurveTo(hx + hb, v0, hx + hb + 0.003, v0 + 0.025);
    hs.lineTo(hx + ht, v1);
    hs.lineTo(hx - ht, v1);
    hs.lineTo(hx - hb - 0.003, v0 + 0.025);
    hs.quadraticCurveTo(hx - hb, v0, hx - hb + 0.025, v0);
    const sensorGeo = new THREE.ExtrudeGeometry(hs, { depth: 0.014, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006, bevelSegments: 2, curveSegments: 6 });
    sensorGeo.translate(0, 0, 0.007);
    sensorGeo.applyMatrix4(toGlass);
    const sensorBox = new THREE.Mesh(sensorGeo, M.dash);
    // kurzer Spiegelfuß mit Kugelgelenk am Spiegelrücken
    const onGlass = (x, v, d) => new THREE.Vector3(x, v, d).applyMatrix4(toGlass);
    const footTop = onGlass(-0.08, 0.805, 0.024);
    const footEnd = new THREE.Vector3(-0.08, 1.258, -0.243);
    const footDir = footEnd.clone().sub(footTop);
    const footGeo = new THREE.CylinderGeometry(0.008, 0.011, footDir.length(), 10);
    footGeo.translate(0, footDir.length() / 2, 0);
    const foot = new THREE.Mesh(footGeo, M.black);
    foot.position.copy(footTop);
    foot.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), footDir.normalize());
    const joint = new THREE.Mesh(new THREE.SphereGeometry(0.013, 12, 8), M.black);
    joint.position.copy(footEnd);
    this.root.add(sensorBox, foot, joint);
    this.mirrorHousing = { toGlass, onGlass };

    // Außenspiegel links (zeigt den linken Teil der Rückansicht): Gehäuse nach vorne gewölbt,
    // Spiegelglas mit schmalem Rand, sitzt komplett über der Türbrüstung
    const side = new THREE.Group();
    side.position.set(-1.0, 1.045, -0.6);
    side.rotation.y = 0.62;
    const housingMat = new THREE.MeshPhysicalMaterial({ color: 0x050607, metalness: 0.5, roughness: 0.3, clearcoat: 1, side: THREE.DoubleSide });
    const housingGeo = new THREE.SphereGeometry(1, 28, 16, Math.PI, Math.PI);
    housingGeo.scale(0.122, 0.07, 0.075);
    const housing = new THREE.Mesh(housingGeo, housingMat);
    const rimGeo = new THREE.TorusGeometry(1, 0.07, 8, 40);
    rimGeo.scale(0.117, 0.066, 0.1);
    const rim = new THREE.Mesh(rimGeo, housingMat);
    rim.position.z = 0.002;
    const sGeo = new THREE.CircleGeometry(1, 32);
    sGeo.scale(0.107, 0.058, 1);
    const sUv = sGeo.attributes.uv;
    const sPos = sGeo.attributes.position;
    for (let i = 0; i < sUv.count; i++) sUv.setXY(i, 1 - (sPos.getX(i) / 0.214 + 0.5) * 0.42, sPos.getY(i) / 0.116 + 0.5);
    this.sideMirrorMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sGlass = new THREE.Mesh(sGeo, this.sideMirrorMat);
    sGlass.position.z = 0.004;
    side.add(housing, rim, sGlass);
    const arm = roundBeam(new THREE.Vector3(-0.79, 0.985, -0.635), new THREE.Vector3(-0.905, 1.035, -0.665), 0.05, 0.035, housingMat);
    this.root.add(side, arm);
  }

  setMirrorTexture(tex) {
    this.mirrorMat.map = tex;
    this.mirrorMat.needsUpdate = true;
    this.sideMirrorMat.map = tex;
    this.sideMirrorMat.needsUpdate = true;
  }

  buildWipers(M) {
    const W = WINDSHIELD;
    const basis = new THREE.Matrix4().makeBasis(W.X, W.U, W.N.clone().negate());
    const q = new THREE.Quaternion().setFromRotationMatrix(basis);
    this.wiperObjs = WIPERS.map((wp) => {
      const pivot = new THREE.Group();
      pivot.position.copy(wp.pivot).addScaledVector(W.N, 0.02);
      pivot.quaternion.copy(q);
      const arm = new THREE.Group();
      pivot.add(arm);
      const armMesh = new THREE.Mesh(new THREE.BoxGeometry(wp.length, 0.016, 0.012), M.wiper);
      armMesh.position.set(wp.length / 2, 0, -0.012);
      const blade = new THREE.Mesh(new THREE.BoxGeometry(wp.length * 0.92, 0.022, 0.008), M.wiper);
      blade.position.set(wp.length * 0.52, 0.01, -0.001);
      arm.add(armMesh, blade);
      this.root.add(pivot);
      return arm;
    });
  }

  buildExtras(M) {
    // Stream-Kamera mit rotem REC-Licht: filmt durch die Frontscheibe nach vorne und sitzt
    // links oben am Kameragehäuse des Innenspiegels (Mini Adam sieht nur die Rückseite)
    const cam = new THREE.Group();
    cam.position.copy(this.mirrorHousing.onGlass(-0.105, 0.875, 0.049));
    const body = new THREE.Mesh(new RoundedBoxGeometry(0.06, 0.044, 0.036, 2, 0.006), M.black);
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, 0.012, 16), new THREE.MeshStandardMaterial({ color: 0x1a2a3a, metalness: 0.9, roughness: 0.1 }));
    lens.rotation.x = Math.PI / 2;
    lens.position.z = -0.022;
    this.recLed = new THREE.Mesh(new THREE.SphereGeometry(0.0055, 10, 8), new THREE.MeshBasicMaterial({ color: 0xff2020, toneMapped: false }));
    this.recLed.position.set(0.019, -0.008, 0.0175);
    // Klemme zum Gehäuse
    const clamp = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, 0.03), M.black);
    clamp.position.set(0, 0.026, -0.004);
    cam.add(body, lens, this.recLed, clamp);
    this.root.add(cam);

    // Wackel-Elsa (Shop)
    this.elsa = buildElsa({ curved: false });
    this.elsa.scale.setScalar(0.11);
    this.elsaSpring = new THREE.Group();
    this.elsaSpring.position.set(-0.6, 0.913, -0.68);
    this.elsaSpring.rotation.y = 0.5;
    const springBase = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.012, 16), M.black);
    this.elsaSpring.add(springBase, this.elsa);
    this.elsa.position.y = 0.008;
    this.elsaSpring.visible = false;
    this.root.add(this.elsaSpring);

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
    for (let i = 0; i < n && this.confetti.count < 400; i++) {
      const u = Math.random() * W.length * 0.9 + 0.03;
      const half = W.halfBase + (W.halfTop - W.halfBase) * (u / W.length) - 0.05;
      const x = (Math.random() * 2 - 1) * half;
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
   * @param {object} st steer (-1..1), speed (m/s), latAcc, t, dt, wiperAngles [a, b], sunDir, overcast
   */
  update(st) {
    const { dt, t } = st;
    this.wheelAngle = damp(this.wheelAngle, st.steer * 1.25, 10, dt);
    this.wheel.rotation.z = -this.wheelAngle;
    // Arme ausrichten
    this.root.updateMatrixWorld(true);
    const inv = new THREE.Matrix4().copy(this.root.matrixWorld).invert();
    const hp = new THREE.Vector3();
    const dir = new THREE.Vector3();
    this.arms.forEach((a, i) => {
      this.hands[i].getWorldPosition(hp);
      hp.applyMatrix4(inv);
      dir.subVectors(hp, a.shoulder);
      const len = dir.length();
      dir.normalize();
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      a.arm.position.copy(a.shoulder).addScaledVector(dir, len / 2 - 0.01);
      a.arm.quaternion.copy(q);
      a.arm.scale.set(1, (len - 0.04) / 1.086, 1);
      a.sleeve.position.copy(a.shoulder).addScaledVector(dir, 0.08);
      a.sleeve.quaternion.copy(q);
      a.sleeve.scale.set(1, 0.22, 1);
    });
    // Wischer
    if (st.wiperAngles) {
      this.wiperObjs[0].rotation.z = st.wiperAngles[0];
      this.wiperObjs[1].rotation.z = st.wiperAngles[1];
    }
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
    this.recLed.visible = Math.sin(t * 3.5) > -0.3;
    // Licht an Wetter/Sonne angleichen
    const o = st.overcast || 0;
    if (st.sunDir) {
      this.sun.position.copy(this.root.position).addScaledVector(st.sunDir, 10);
      this.sun.target.position.copy(this.root.position);
    }
    this.sun.intensity = 2.1 * (1 - o * 0.85);
    this.hemi.intensity = 1.2 - o * 0.25;
    this.nomi.update(dt, t, -0.16);
    this.screen.update(dt, st.screen);
  }
}
