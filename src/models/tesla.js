// Schwarzer Tesla Model 3 Long Range AWD (stilisiert, ohne Markenlogos) mit Mini Adam am Steuer.
// Wird für den Kameraschwenk beim Start, die Drohnenkamera und den Titelbildschirm gebraucht.
import * as THREE from 'three';
import { buildTeslaCabin } from './teslaCabin.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { W } from '../curve.js';
import { plateTexture, aeroWheelTexture, liveLogoTexture, contactShadowTexture } from '../textures.js';
import { buildMiniAdam } from './miniAdam.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { loft, loftPoint, sideArches, surfacePatch, curve1, withArches, tireGeometry, discX, boxAt, mirrorShape, mirrorHousingGeometry } from './loft.js';
import { WINDSHIELD, WIPERS } from '../cockpit/cockpit.js';
import { buildCarWipers } from '../cockpit/wipers.js';

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
// zum Heck hin schmaler (wie beim echten Wagen): sonst steht die Glaskuppel über die Schulter hinaus
const glassHalf = curve1([[1.48, 0.8], [1.8, 0.84], [2.3, 0.8], [2.9, 0.74], [3.5, 0.7], [4.0, 0.63], [4.24, 0.57]]);

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
// Karosserie ohne Radlauf-Ausschnitt: Umriss für die Stirnwände in den Radläufen
const BODY_UNCUT = { ...BODY, bx: null };

/**
 * Stirnwand im Radlauf bei u (Seite s): von der Innenwand (x = 0,415) bis zur Außenhaut und vom
 * Unterboden bis knapp über die Radmitte. Folgt dem gerundeten Querschnitt, ragt also nirgends heraus.
 */
function archEndWall(u, s, xi = 0.415, yTop = 0.345) {
  const p = new THREE.Vector3();
  const pts = [];
  let prev = null;
  for (let i = 0; i <= 96; i++) {
    loftPoint(BODY_UNCUT, u, -Math.PI / 2 + (i / 96) * (Math.PI / 2), p);
    // ein paar Millimeter nach innen, die Loft-Fläche zwischen den Querschnitten ist etwas flacher
    const cur = [p.x - 0.005, p.y + 0.003];
    if (prev) {
      if (prev[0] < xi && cur[0] >= xi) {
        const k = (xi - prev[0]) / (cur[0] - prev[0]);
        pts.push([xi, prev[1] + k * (cur[1] - prev[1])]);
      }
      if (cur[1] >= yTop) {
        const k = (yTop - prev[1]) / (cur[1] - prev[1]);
        pts.push([prev[0] + k * (cur[0] - prev[0]), yTop]);
        break;
      }
      if (cur[0] >= xi) pts.push(cur);
    }
    prev = cur;
  }
  pts.push([xi, yTop]);
  const g = new THREE.ShapeGeometry(new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(s * x, y))));
  g.translate(0, 0, uToZ(u));
  return g;
}
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

/** Höhe der Karosserie-Oberseite an Position (u, x) (für Dinge, die auf dem Blech liegen). */
function bodyTopY(u, x) {
  let lo = 0;
  let hi = Math.PI / 2;
  const p = new THREE.Vector3();
  const ax = Math.abs(x);
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    bodyPoint(u, mid, p);
    if (p.x > ax) lo = mid;
    else hi = mid;
  }
  return bodyPoint(u, (lo + hi) / 2, p).y;
}

/**
 * Kabinenöffnung: Innerhalb der Glaskuppel ist das Blech oben offen – sonst läge auf Höhe der Gürtellinie ein
 * lackierter Deckel über dem Innenraum, und durchs Glas sähe man nur Mini Adams Kopf. Entfernt werden die
 * Dreiecke der Oberseite zwischen Frontscheibe und Rückbank bis |x| = x (die Ringpunkte der Karosserie liegen
 * dort bei 0,645 und 0,705: Die Kante läuft gerade, außen bleibt ein schmaler Türsims unter dem Glas).
 * Wanne, Boden, Türverkleidungen und Polster auf der Kante bringt teslaCabin.js mit.
 */
const CABIN_OPEN = { u0: 1.62, u1: 3.88, x: 0.66 };
function openCabin(geo) {
  const pos = geo.attributes.position;
  const idx = geo.index.array;
  const inside = (i) => {
    const u = pos.getZ(i) + L / 2;
    return u >= CABIN_OPEN.u0 && u <= CABIN_OPEN.u1 && Math.abs(pos.getX(i)) <= CABIN_OPEN.x && pos.getY(i) > 0.8;
  };
  const keep = [];
  for (let i = 0; i < idx.length; i += 3) {
    if (!(inside(idx[i]) && inside(idx[i + 1]) && inside(idx[i + 2]))) keep.push(idx[i], idx[i + 1], idx[i + 2]);
  }
  geo.setIndex(keep);
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
  const GLASS_MAT = { color: 0x05080c, metalness: 0.25, roughness: 0.04, transparent: true, opacity: 0.62, envMapIntensity: 2.6, depthWrite: false };
  const glass = W.phys(GLASS_MAT);
  const dark = W.std({ color: 0x0b0b0c, roughness: 0.8, side: THREE.DoubleSide });
  const plastic = W.std({ color: 0x141516, roughness: 0.55 });
  const pianoBlack = W.phys({ color: 0x030304, metalness: 0.3, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.08, side: THREE.DoubleSide });
  const headMat = W.std({ color: 0xc8d6e6, emissive: 0xeaf3ff, emissiveIntensity: 1.1, roughness: 0.15, metalness: 0.2, side: THREE.DoubleSide });
  const lampChrome = W.phys({ color: 0xaeb6bf, metalness: 1, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.04, side: THREE.DoubleSide });
  const lampLens = W.phys({ color: 0x0c1016, metalness: 0.5, roughness: 0.1, clearcoat: 1, side: THREE.DoubleSide });
  const tailMat = W.std({ color: 0x3a0505, emissive: 0xff0000, emissiveIntensity: 0.2, roughness: 0.25, side: THREE.DoubleSide });

  // --- Karosserie --------------------------------------------------------
  // Bug und Heck mit gewölbter Schattierung (capDome), sonst wirkt das Heck wie ein schwarzes Loch
  const bodyGeo = loft({ u0: 0, u1: L, ...BODY, segs: 150, ring: 44, H: 1.5, capDome: 0.8 });
  openCabin(bodyGeo);
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
  // Glasdach mit Heckscheibe: getöntes Glas wie die Frontscheibe (von oben sieht man Mini Adam und den
  // Innenraum dunkel durchschimmern), vorn am Scheibenrahmen und über den B-Säulen je ein schwarzer Steg
  for (const [u0, u1] of [[2.3, 2.4], [2.76, 2.88]]) {
    trim.push(patchOnGlass((a, t) => [lerp(u0, u1, t), lerp(ROOF_PHI, Math.PI - ROOF_PHI, a)], { ns: 18, nt: 2, lift: 0.004 }));
  }
  const trimMesh = new THREE.Mesh(mergeGeometries(trim), pianoBlack);
  trimMesh.castShadow = true;
  root.add(trimMesh);

  // Radhäuser: dunkle Innenkotflügel über den Reifen (nur außen, wo die Radläufe ausgeschnitten sind)
  // (bis weit nach innen und innen mit einer Wand verschlossen, damit man nicht in die Karosserie sieht)
  // Radius knapp innerhalb des Radlauf-Ausschnitts (0,405): auf genau demselben Zylinder flimmerten
  // Innenkotflügel und die Kante des Blechs ineinander (Streifen im Radlauf, Kammlinien auf dem Lack)
  const LINER_R = 0.395;
  const wellParts = [];
  for (const u of ARCH_U) {
    for (const s of [-1, 1]) {
      const liner = new THREE.CylinderGeometry(LINER_R, LINER_R, 0.5, 22, 1, true, 0, Math.PI);
      liner.rotateZ(Math.PI / 2);
      liner.translate(s * 0.665, 0.335, uToZ(u));
      const wall = new THREE.CircleGeometry(LINER_R, 22, 0, Math.PI);
      wall.rotateY(Math.PI / 2);
      wall.translate(s * 0.415, 0.335, uToZ(u));
      wellParts.push(liner, wall);
      // senkrechte Stirnwände vorne und hinten im Radlauf (unterhalb der Radmitte), sonst glänzt dort Lack;
      // sie folgen dem Querschnitt der Karosserie, damit unten nichts wie ein Schmutzfänger heraussteht
      for (const e of [-1, 1]) wellParts.push(archEndWall(u + e * (0.405 - 0.012), s));
    }
  }
  root.add(new THREE.Mesh(mergeGeometries(wellParts.map((g) => (g.index ? g.toNonIndexed() : g))), dark));

  // Lufteinlass vorne und Diffusor hinten: flache, abgerundete Schlitze auf Bug- und Heckfläche
  // (keine Klötze, die unter der Nase hängen)
  const slot = (w, h, r) => {
    const sh = new THREE.Shape();
    sh.moveTo(-w / 2 + r, -h / 2);
    sh.lineTo(w / 2 - r, -h / 2);
    sh.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    sh.lineTo(w / 2, h / 2 - r);
    sh.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    sh.lineTo(-w / 2 + r, h / 2);
    sh.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    sh.lineTo(-w / 2, -h / 2 + r);
    sh.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    const g = new THREE.ShapeGeometry(sh, 6);
    g.deleteAttribute('uv');
    return g;
  };
  const intake = slot(0.8, 0.03, 0.015);
  intake.rotateY(Math.PI);
  intake.translate(0, 0.333, uToZ(0) - 0.003);
  const diffuser = slot(1.08, 0.07, 0.03);
  diffuser.translate(0, 0.475, uToZ(L) + 0.003);
  const slots = new THREE.Mesh(mergeGeometries([intake, diffuser]), plastic);
  root.add(slots);

  // Scheinwerfer (mandelförmig, um die Ecke gezogen) und Rückleuchten (um die Ecke) – liegen auf der Karosserie
  const patchOnBody = (uv, opts) => surfacePatch(bodyPoint, uv, opts);
  const housings = [];
  const lenses = [];
  const drls = [];
  const tails = [];
  // Leuchten im (u, phi)-Raum der Karosserie, je Seite s (auch für die Schadensanzeige, siehe damage-fx.js)
  const lampUV = {
    head: (s) => (a, t) => {
      const [u, ph] = headUV(a, t);
      return [u, sidePhi(s, ph)];
    },
    drl: (s) => (a, t) => lampUV.head(s)(lerp(0.8, 0.94, a), lerp(0.08, 0.95, t)),
    tail: (s) => (a, t) => [lerp(4.4, 4.672, t), sidePhi(s, lerp(lerp(0.5, 0.36, t), lerp(0.78, 1.0, t), a))],
  };
  for (const s of [-1, 1]) {
    const head = lampUV.head(s);
    // Chrom-Reflektor unter klarem Glas, darin zwei dunkle Linsen, oben das LED-Tagfahrlicht
    housings.push(patchOnBody(head, { ns: 8, nt: 24, lift: 0.004 }));
    for (const [tc, rt] of [[0.34, 0.1], [0.58, 0.11]]) {
      lenses.push(patchOnBody((r, ang) => head(0.4 + 0.24 * r * Math.cos(ang * Math.PI * 2), tc + rt * r * Math.sin(ang * Math.PI * 2)), { ns: 3, nt: 18, lift: 0.006 }));
    }
    drls.push(patchOnBody(lampUV.drl(s), { ns: 2, nt: 22, lift: 0.007 }));
    tails.push(patchOnBody(lampUV.tail(s), { ns: 6, nt: 14, lift: 0.006 }));
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
  plateF.position.set(0, 0.415, uToZ(0) - 0.012);
  plateF.rotation.y = Math.PI;
  const plateR = new THREE.Mesh(plateGeo, plateMat);
  plateR.position.set(0, 0.62, uToZ(L) + 0.004);
  root.add(plateF, plateR);

  // LIVE-Aufkleber auf dem Kofferraumdeckel (Fan-Detail)
  // folgt der Wölbung des Deckels (nicht halb versunken, nicht schwebend); Bildoberkante zeigt nach vorne
  const stickerGeo = new THREE.PlaneGeometry(0.34, 0.34, 8, 8);
  const sp = stickerGeo.attributes.position;
  for (let i = 0; i < sp.count; i++) {
    const x = sp.getX(i);
    const u = 4.44 - sp.getY(i);
    sp.setXYZ(i, x, bodyTopY(u, x) + 0.003, uToZ(u));
  }
  stickerGeo.computeVertexNormals();
  const sticker = new THREE.Mesh(
    stickerGeo,
    W.std({
      map: liveLogoTexture({ w: 256, h: 256 }), transparent: true, roughness: 0.4, alphaTest: 0.3,
      polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
    }),
  );
  root.add(sticker);

  // Außenspiegel: Gehäuse in Wagenfarbe (nach vorne gewölbt), Spiegelglas hinten bündig, kurzer Fuß zur Tür
  const mirrorParts = [];
  const mirrorGlass = [];
  const mz = uToZ(1.8);
  for (const s of [-1, 1]) {
    const cx = s * 1.0;
    const cy = 1.0;
    // Model-3-Form wie im Cockpit: Schale nach vorne, Glas mit schmalem Rand hinten
    const h = mirrorHousingGeometry(s);
    h.translate(cx, cy, mz);
    mirrorParts.push(h);
    // Fuß zur Tür – liegt ganz hinter der Glasfläche und steckt nicht durch das Glas
    mirrorParts.push(boxAt(0.1, 0.032, 0.045, s * 0.86, 0.968, mz - 0.045, 0, 0, s * 0.22));
    const g = new THREE.ShapeGeometry(mirrorShape(0.9, s), 10);
    g.deleteAttribute('uv');
    g.translate(cx, cy, mz + 0.002);
    mirrorGlass.push(g);
  }
  const mirrorGeo = mergeGeometries(mirrorParts.map((g) => (g.index ? g.toNonIndexed() : g)));
  const mirrorMesh = new THREE.Mesh(mirrorGeo, paint);
  const mirrorGlassMesh = new THREE.Mesh(mergeGeometries(mirrorGlass), W.std({ color: 0x9fb2c4, metalness: 1, roughness: 0.06 }));
  root.add(mirrorMesh, mirrorGlassMesh);

  // Räder: Reifen + Aero-Radkappen (drehen sich)
  const tireGeo = tireGeometry(TESLA.wheelR, 0.235, 24);
  const tireMat = W.std({ color: 0x111111, roughness: 0.9 });
  const aeroMat = W.std({ map: aeroWheelTexture(), roughness: 0.45, metalness: 0.5 });
  const wheels = [];
  for (const z of [TESLA.frontAxleZ, TESLA.rearAxleZ]) {
    for (const s of [-1, 1]) {
      const wheel = new THREE.Group();
      // erst lenken (Hochachse), dann drehen – sonst taumelt das gelenkte Rad beim Rollen
      wheel.rotation.order = 'YXZ';
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
  // Armaturenbrett mit Holzleiste, Bildschirm, Spiegel, Lenkrad, Sitze, Konsole, Mitbringsel und Stream-Technik:
  // teslaCabin.js. Der Fahrerplatz ist etwas zur Mitte gerückt (wie die Sitze): sonst ragen Mini Adams Schulter
  // und beim Winken sein Ärmel auf der Fensterseite unter dem Seitenfenster heraus aufs Türblech.
  const SEAT_X = -0.3;
  // Lenkradmitte (Achse = lokales z): an ihr richten sich Mini Adams Hände aus
  const wheelRing = new THREE.Group();
  wheelRing.position.set(SEAT_X, 0.84, uToZ(2.4));
  wheelRing.rotation.x = -0.35;
  root.add(wheelRing);
  const cabin = buildTeslaCabin({ uToZ, bodyY: bodyTopY, open: CABIN_OPEN, wheel: wheelRing });
  root.add(cabin.group);
  // Mini Adam auf einem Kissen hinterm Steuer
  const adam = buildMiniAdam({ curved: true });
  adam.setPose('drive');
  adam.root.position.set(SEAT_X, 0.4, uToZ(2.62));
  adam.root.rotation.y = Math.PI;
  root.add(adam.root);
  adam.root.updateMatrix();
  wheelRing.updateMatrix();
  adam.setWheel(adam.root.matrix.clone().invert().multiply(wheelRing.matrix), 0.17);
  // zwei Kissen, damit Mini Adam über das Lenkrad schauen kann
  const cushion = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.22, 0.07, 18),
    W.phys({ color: 0xb0122b, roughness: 0.9, sheen: 1, sheenColor: new THREE.Color(0xff6680) }),
  );
  cushion.position.set(SEAT_X, 0.59, uToZ(2.72));
  root.add(cushion);
  const cushion2 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.2, 0.07, 18),
    W.phys({ color: 0x1d4fa0, roughness: 0.9, sheen: 1, sheenColor: new THREE.Color(0x77a8ff) }),
  );
  cushion2.position.set(SEAT_X, 0.655, uToZ(2.71));
  root.add(cushion2);

  // Innenlicht (nur beim Kameraschwenk hell, damit man Mini Adam gut sieht): ein Spot von vorne oben
  // auf ihn – eine Punktleuchte schien durchs Glas auf Motorhaube und Türen (helle Flecken im Lack)
  const cabinLight = new THREE.SpotLight(0xfff1dd, 0, 2.2, 0.62, 0.6, 1.5);
  cabinLight.position.set(SEAT_X, 1.24, uToZ(2.24));
  cabinLight.target.position.set(SEAT_X, 0.96, uToZ(2.66));
  root.add(cabinLight, cabinLight.target);

  // weicher Bodenschatten (sonst schwebt der Wagen, vor allem bei Regen ohne Sonnenschatten)
  const groundMat = W.basic({ color: 0x000000, map: contactShadowTexture(), transparent: true, opacity: 0.55, depthWrite: false });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 5.15), groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, 0.02, 0);
  ground.renderOrder = -1;
  root.add(ground);

  // Antennenleiste hinten auf dem Glasdach: drei kurze Mobilfunkantennen (Telekom, Vodafone, O₂ gebündelt) auf
  // einer flachen Leiste mit zwei Gummifüßen. Die Stream-Kamera sitzt innen an der Frontscheibe (teslaCabin.js).
  const rbox = (w, h, d, x, y, z, rx = 0, r = 0.03) => {
    const g = new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001));
    if (rx) g.rotateX(rx);
    g.translate(x, y, z);
    return g;
  };
  const gear = [];
  const antU = 3.45;
  const antZ = uToZ(antU);
  const barY = roofY(antU, 0) + 0.016;
  gear.push(rbox(0.44, 0.016, 0.05, 0, barY, antZ, 0, 0.008));
  for (const x of [-0.17, 0.17]) {
    const y0 = roofY(antU, x);
    const h = barY - y0;
    gear.push(new THREE.CylinderGeometry(0.02, 0.024, h, 14).translate(x, y0 + h / 2, antZ));
  }
  for (let i = 0; i < 3; i++) {
    const x = -0.14 + i * 0.14;
    const rod = new THREE.CylinderGeometry(0.0045, 0.008, 0.1, 8);
    rod.translate(0, 0.05, 0);
    rod.rotateX(0.25); // leicht nach hinten geneigt
    rod.translate(x, barY + 0.006, antZ);
    gear.push(rod);
    const tip = new THREE.SphereGeometry(0.008, 8, 6);
    tip.translate(0, 0.1, 0);
    tip.rotateX(0.25);
    tip.translate(x, barY + 0.006, antZ);
    gear.push(tip);
  }
  root.add(new THREE.Mesh(mergeGeometries(gear.map((g) => (g.index ? g.toNonIndexed() : g))), plastic));
  // rote REC-Lampe vorn an der Action-Cam (blinkt in update)
  const recLed = cabin.recLed;

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
    if (o.isMesh && o !== glassMesh && o !== ground) o.castShadow = true;
  });

  // Scheibenwischer außen auf der Glaskuppel, in derselben Stellung wie im Cockpit (setWipers). Sie werfen
  // keinen eigenen Schatten: Der läge nur auf dem Glas darunter.
  // Höhe der Kuppel über (x, z): Ihr Querschnitt ist über einen Winkel beschrieben, also wird der Winkel
  // gesucht, dessen Punkt bei x liegt (Halbierung, 18 Schritte reichen für Bruchteile eines Millimeters).
  const wiperGlassY = (x, z) => {
    let lo = 0;
    let hi = Math.PI / 2;
    const p = new THREE.Vector3();
    const ax = Math.abs(x);
    for (let i = 0; i < 18; i++) {
      const mid = (lo + hi) / 2;
      glassPoint(z + L / 2, mid, p);
      if (p.x > ax) lo = mid;
      else hi = mid;
    }
    return glassPoint(z + L / 2, (lo + hi) / 2, p).y;
  };
  const wipers = buildCarWipers(WINDSHIELD, WIPERS, wiperGlassY, W.std({ vertexColors: true, roughness: 0.42, metalness: 0.25 }));
  root.add(wipers.group);

  // Ladeklappe links hinten (vor der Rückleuchte, wie beim Model 3): erst auf Anfrage gebaut (port(), Startszene und
  // Ladestopp). Darunter die Ladebuchse: dunkle Öffnung, runder
  // Einsatz und ein Leuchtring, der grün leuchtet, solange geladen wird. Die Klappe schwenkt um ihre hintere Kante auf.
  let port = null;
  // Mitte (u, Winkel der linken Seite in 0,86 m Höhe), halbe Breite in u (m) und halbe Höhe im Winkel (rad, 0,385 m/rad)
  const PORT = { u: 4.3, phi: sidePhi(-1, 0.27), hu: 0.064, hp: 0.125, mPerRad: 0.385, seam: 0.0045 };
  function buildPort() {
    // Fleck im (u, phi)-Raum: ein Rechteck mit runden Ecken (Superellipse) mit halben Maßen hu (m) × hp (rad)
    const squircle = (hu, hp, n = 6, cu = PORT.u) => (a, t) => {
      const ang = t * Math.PI * 2;
      const c = Math.cos(ang);
      const sn = Math.sin(ang);
      return [cu + a * hu * Math.sign(c) * Math.abs(c) ** (2 / n), PORT.phi + a * hp * Math.sign(sn) * Math.abs(sn) ** (2 / n)];
    };
    // Ring von Radius r0 bis r1 (m), rund auf der Karosserie
    const ring = (r0, r1) => (a, t) => {
      const ang = t * Math.PI * 2;
      const r = r0 + (r1 - r0) * a;
      return [PORT.u + Math.cos(ang) * r, PORT.phi + (Math.sin(ang) * r) / PORT.mPerRad];
    };
    const both = { side: THREE.DoubleSide };
    const g = new THREE.Group();
    // Mulde und Einsatz in grauem Kunststoff (auf dem schwarzen Lack wäre eine schwarze Öffnung nicht zu sehen); der
    // Leuchtring färbt die Mulde beim Laden leicht grün
    const socketMat = W.std({ color: 0x3a4047, emissive: 0x39d98a, emissiveIntensity: 0, roughness: 0.72, ...both });
    const socket = new THREE.Mesh(patchOnBody(squircle(PORT.hu, PORT.hp), { ns: 2, nt: 40, lift: 0.0025 }), socketMat);
    const inlet = new THREE.Mesh(patchOnBody(ring(0, 0.032), { ns: 2, nt: 28, lift: 0.0034 }), W.std({ color: 0x5b626b, roughness: 0.45, metalness: 0.3, ...both }));
    const ringMat = W.std({ color: 0x0d1a12, emissive: 0x39d98a, emissiveIntensity: 0, roughness: 0.3, toneMapped: false, ...both });
    const led = new THREE.Mesh(patchOnBody(ring(0.034, 0.042), { ns: 1, nt: 32, lift: 0.0038 }), ringMat);
    g.add(socket, inlet, led);
    // Klappe im Lack des Wagens, ringsum eine feine Fuge (etwas kleiner als die Öffnung); Drehachse: ihre hintere Kante
    const flapGeo = patchOnBody(squircle(PORT.hu - PORT.seam, PORT.hp - PORT.seam / PORT.mPerRad), { ns: 3, nt: 40, lift: 0.0052 });
    const ue = PORT.u + PORT.hu - PORT.seam;
    const a = bodyPoint(ue, PORT.phi - PORT.hp, new THREE.Vector3());
    const b = bodyPoint(ue, PORT.phi + PORT.hp, new THREE.Vector3());
    const hinge = new THREE.Group();
    hinge.position.copy(a).add(b).multiplyScalar(0.5);
    flapGeo.translate(-hinge.position.x, -hinge.position.y, -hinge.position.z);
    const flap = new THREE.Mesh(flapGeo, W.phys({ color: 0x060708, metalness: 0.5, roughness: 0.34, clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 1.25, ...both }));
    flap.castShadow = true;
    // Innenseite der Klappe: hellgraue Verkleidung, 3 mm kleiner und 1,5 mm unter dem Lack (zu nur bei offener Klappe)
    const lin = PORT.seam + 0.003;
    const linerGeo = patchOnBody(squircle(PORT.hu - lin, PORT.hp - lin / PORT.mPerRad), { ns: 3, nt: 40, lift: 0.0037 });
    linerGeo.translate(-hinge.position.x, -hinge.position.y, -hinge.position.z);
    const liner = new THREE.Mesh(linerGeo, W.std({ color: 0x858b92, roughness: 0.62, ...both }));
    hinge.add(flap, liner);
    const axis = b.sub(a).normalize();
    g.add(hinge);
    root.add(g);
    // Mitte der Buchse auf der Karosserie und ihre Normale nach außen (Wagenkoordinaten): dort steckt der Stecker
    const pos = bodyPoint(PORT.u, PORT.phi, new THREE.Vector3());
    const du = bodyPoint(PORT.u + 1e-3, PORT.phi, new THREE.Vector3()).sub(pos);
    const dp = bodyPoint(PORT.u, PORT.phi + 1e-3, new THREE.Vector3()).sub(pos);
    const normal = new THREE.Vector3().crossVectors(du, dp).normalize();
    if (normal.x > 0) normal.negate();
    const q = new THREE.Quaternion();
    return {
      group: g, pos, normal,
      /** open: 0 zu … 1 offen (Klappe um 100° nach hinten aufgeschwenkt), glow: Leuchtring 0 … 1. */
      set(open, glow) {
        q.setFromAxisAngle(axis, -open * 1.75);
        hinge.quaternion.copy(q);
        socket.visible = inlet.visible = led.visible = liner.visible = open > 0.002;
        ringMat.emissiveIntensity = 1.6 * glow;
        socketMat.emissiveIntensity = 0.12 * glow;
      },
    };
  }

  // Rückfahrlicht: ein weißes Feld am inneren Ende jeder Rückleuchte (rundum bleibt Rot), 2,5 mm über ihr. Erst
  // beim ersten Rückwärtsgang gebaut und nur im R sichtbar: Im D bleibt alles wie zuvor.
  let reverseMesh = null;
  function buildReverse() {
    const parts = [-1, 1].map((s) => patchOnBody((a, t) => lampUV.tail(s)(lerp(0.55, 0.9, a), lerp(0.8, 0.97, t)), { ns: 3, nt: 6, lift: 0.0085 }));
    const m = new THREE.Mesh(mergeGeometries(parts), W.std({ color: 0xf4f6f8, emissive: 0xf2f6ff, emissiveIntensity: 1.15, roughness: 0.2, side: THREE.DoubleSide }));
    root.add(m);
    return m;
  }

  // Fahrerfenster (BrunnenTV): Das Glas ist eine Kuppel aus einem Stück, also „fährt“ die Scheibe herunter, indem ein
  // eigenes Material (erst bei der ersten Folge gebaut) ihren Teil oberhalb der Oberkante y verwirft – zwischen
  // A-Säule (Mitte ihrer Leiste) und B-Säule, von der Fensterleiste bis zum Dach. Die Leisten liegen darüber.
  let winMat = null;
  const WIN = (() => {
    const p = new THREE.Vector3();
    const a0 = glassPoint(1.55, sidePhi(-1, -0.74), p).clone();
    const a1 = glassPoint(2.305, sidePhi(-1, ROOF_PHI + 0.04), p).clone();
    const bottom = glassPoint(2.5, sidePhi(-1, -0.7), p).y;
    const top = glassPoint(2.5, sidePhi(-1, ROOF_PHI), p).y;
    // (u: A-Säule unten und oben, B-Säule; phi: Unter- und Oberkante – für windowOpening().at)
    return { a0, a1, bottom, top, zB: uToZ(2.82), u: [1.55, 2.305, 2.82], phi: [-0.7, ROOF_PHI] };
  })();
  function windowGlass() {
    const m = W.phys(GLASS_MAT);
    const curved = m.onBeforeCompile;
    const u = { uWinA: { value: new THREE.Vector4(WIN.top, WIN.top, WIN.zB, -0.3) }, uWinB: { value: new THREE.Vector4(WIN.a0.y, WIN.a0.z, WIN.a1.y, WIN.a1.z) } };
    m.userData.win = u;
    m.onBeforeCompile = (shader) => {
      curved(shader);
      Object.assign(shader.uniforms, u);
      shader.vertexShader = 'varying vec3 vWinP;\n' + shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvWinP = position;');
      shader.fragmentShader = 'uniform vec4 uWinA;\nuniform vec4 uWinB;\nvarying vec3 vWinP;\n' + shader.fragmentShader.replace(
        'void main() {',
        'void main() {\n  float winZ = mix(uWinB.y, uWinB.w, clamp((vWinP.y - uWinB.x) / (uWinB.z - uWinB.x), 0.0, 1.0));\n' +
          '  if (vWinP.x < uWinA.w && vWinP.y > uWinA.x && vWinP.y < uWinA.y && vWinP.z < uWinA.z && vWinP.z > winZ) discard;',
      );
    };
    m.customProgramCacheKey = () => 'curved-world-window';
    return m;
  }

  let wheelAngle = 0;
  let brake = false;
  let reverse = false;

  return {
    root,
    adam,
    glass,
    wheels,
    cabinLight,
    recLed,
    // Haken für den Schaden außen (src/models/damage-fx.js): verformbare Teile, Kennzeichen, Flächen-Abbildung
    damageHooks: { root, body, slots, sticker, plateF, plateR, mirrors: [mirrorMesh, mirrorGlassMesh], mirrorZ: mz, bodyPoint, sidePhi, L, n: BODY.n, lampUV },
    setStarlink(v) {
      starlink.visible = !!v;
    },
    /** Ladeklappe und -buchse (beim ersten Aufruf gebaut): { group, pos, normal, set(open, glow) }, siehe buildPort. */
    port() {
      if (!port) port = buildPort();
      return port;
    },
    /** Bodenschatten: bei Regen kräftiger (die Sonne wirft dann kaum noch Schatten). */
    setGroundShade(rain) {
      groundMat.opacity = 0.55 + 0.3 * Math.min(1, Math.max(0, rain));
    },
    setVest(v) {
      adam.setVest(v);
    },
    /** Fahrerfenster: 0 zu … 1 ganz offen (BrunnenTV; das Material dafür entsteht beim ersten Öffnen). */
    setWindow(k) {
      if (k > 0 && !winMat) winMat = windowGlass();
      glassMesh.material = k > 0 ? winMat : glass;
      if (winMat) winMat.userData.win.uWinA.value.x = lerp(WIN.top, WIN.bottom, Math.min(1, Math.max(0, k)));
    },
    /**
     * Öffnung des Fahrerfensters im Rahmen des Wagens (vorn −z, links −x): a0 / a1 Punkte auf dem Glas an der A-Säule
     * unten und oben, zB die B-Säule, bottom / top Unter- und Oberkante; at(along, up, out): der Punkt auf dem Glas,
     * along (0 B-Säule … 1 A-Säule) längs und up (0 Unter- … 1 Oberkante) hoch in der Öffnung (Ladestopp: dort fliegt
     * das Popcorn hindurch).
     */
    windowOpening() {
      const at = (along, up, out) => {
        const uA = WIN.u[0] + (WIN.u[1] - WIN.u[0]) * up;
        return glassPoint(WIN.u[2] + (uA - WIN.u[2]) * along, sidePhi(-1, WIN.phi[0] + (WIN.phi[1] - WIN.phi[0]) * up), out);
      };
      return { a0: WIN.a0.clone(), a1: WIN.a1.clone(), zB: WIN.zB, bottom: WIN.bottom, top: WIN.top, at };
    },
    /** Megafon auf dem Beifahrersitz zeigen (false, solange Mini Adam es in der Hand hat). */
    seatMegaphone(show) {
      cabin.seatMegaphone(show);
    },
    /** Armwinkel der beiden Scheibenwischer (rad, wie windshield.angles). */
    setWipers(a0, a1) {
      wipers.set(a0, a1);
    },
    setBrake(b) {
      if (b === brake) return;
      brake = b;
      // Rücklicht dunkelrot, Bremslicht hell: sonst sieht beides im Tonemapping gleich aus
      tailMat.emissiveIntensity = b ? 0.95 : 0.2;
    },
    /** Rückfahrlicht an, solange der Rückwärtsgang drin ist (rollend oder stehend). */
    setReverse(r) {
      if (r === reverse) return;
      reverse = r;
      if (r && !reverseMesh) reverseMesh = buildReverse();
      if (reverseMesh) reverseMesh.visible = r;
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
