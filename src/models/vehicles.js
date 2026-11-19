// Verkehrsteilnehmer: Kleinwagen, Kompakte, Limousinen, Kombis, SUVs, Sportwagen, Transporter,
// Wohnmobile, Sattelzüge (fiktive Speditionen mit Insider-Sprüchen) und die Polizei Gifhorn.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { W } from '../curve.js';
import { plateTexture, trailerTexture, truckRearTexture, contactShadowTexture } from '../textures.js';
import { loft, loftPoint, loftStations, ringPhi, surfacePatch, curve1, withArches, sideArches, colorize, boxAt, discX } from './loft.js';
import { lerp, pick, weightedPick } from '../util.js';

export const CAR_TYPES = {
  klein: { L: 3.62, half: 0.83, H: 1.5, belt: 0.93, hood: 0.78, ws: 1.32, re: 2.85, ce: 3.48, rear: 'hatch', axles: [0.68, 3.0], wr: 0.29, cl: 0.15, nose: 0.62, weight: 8 },
  kompakt: { L: 4.26, half: 0.895, H: 1.46, belt: 0.93, hood: 1.05, ws: 1.72, re: 3.35, ce: 4.12, rear: 'hatch', axles: [0.86, 3.5], wr: 0.31, cl: 0.16, nose: 0.6, weight: 22 },
  limo: { L: 4.78, half: 0.915, H: 1.45, belt: 0.95, hood: 1.32, ws: 1.98, re: 3.15, ce: 3.88, rear: 'sedan', axles: [0.95, 3.8], wr: 0.32, cl: 0.15, nose: 0.6, weight: 15 },
  kombi: { L: 4.82, half: 0.915, H: 1.5, belt: 0.95, hood: 1.25, ws: 1.92, re: 4.5, ce: 4.74, rear: 'wagon', axles: [0.95, 3.75], wr: 0.32, cl: 0.16, nose: 0.6, weight: 18 },
  suv: { L: 4.62, half: 0.94, H: 1.68, belt: 1.08, hood: 1.12, ws: 1.78, re: 4.2, ce: 4.5, rear: 'wagon', axles: [0.92, 3.62], wr: 0.36, cl: 0.22, nose: 0.74, weight: 14 },
  // arch: Radius des Radlaufs (sonst wr + 0.07); beim flachen Sportwagen kleiner, sonst schaut das Radhaus vorne durch die Haube
  sport: { L: 4.5, half: 0.93, H: 1.27, belt: 0.82, hood: 1.62, ws: 2.25, re: 2.9, ce: 4.05, rear: 'hatch', axles: [1.12, 3.62], wr: 0.33, arch: 0.35, cl: 0.12, nose: 0.48, weight: 4 },
  transporter: { L: 5.9, half: 1.0, H: 2.5, belt: 1.2, hood: 0.78, ws: 1.42, re: 5.85, ce: 5.9, rear: 'box', cargo: 2.05, axles: [0.95, 4.6], wr: 0.36, cl: 0.2, nose: 0.78, weight: 8 },
  wohnmobil: { L: 7.0, half: 1.15, H: 3.0, belt: 1.3, hood: 0.8, ws: 1.45, re: 6.95, ce: 7.0, rear: 'box', cargo: 1.9, alkoven: true, axles: [1.0, 4.9], wr: 0.38, cl: 0.22, nose: 0.8, weight: 2 },
};

// Lackfarben [Farbe, Gewicht]: gut die Hälfte bleibt Silber, Weiß, Grau und Graphit wie auf einer echten Autobahn,
// dazwischen fröhliche Bonbon- und Pastelltöne (kein reines Schwarz: das säuft im Bild zu einem Klecks ab).
export const COLORS = [
  [0xc3c8ce, 16], [0x2b2e34, 11], [0xf2f3f0, 15], [0x6d747d, 12], [0x2f5fa8, 8], [0xc9372c, 7],
  [0x3f7f5f, 3], [0xd9c39a, 3], [0xf2c230, 3], [0xf08a2c, 2], [0x4aa3d8, 4],
  [0x8fd3c2, 3], [0xf6b7c9, 2], [0xb9a7e0, 2], [0xffe08a, 2], [0x7fc8e8, 2], [0xa8d672, 2], [0xe86a8a, 1], [0x35b3a8, 2],
];

const PLATES = [
  'KS-EL 5A', 'GF-PO 110', 'FD-BR 1', 'SI-EG 3', 'F-SK 2017', 'MZ-RT 1369', 'B-AN 333', 'KS-ZF 33', 'HU-PA 42',
  'F-AB 1234', 'DA-HD 1080', 'OF-RT 333', 'GF-MA 3', 'HH-MA 1', 'FD-VIP 3', 'K-OE 1337',
];

const COMPANIES = [
  ['Plüsch-Logistik', 'Wir liefern Mini Adams in ganz Deutschland', '#ffffff', '#c8102e'],
  ['Brunnenbau Schönnbrun', 'Seit 1887 – Brunnen mit Gefühl', '#e8f1f8', '#1d5fa8'],
  ['Kürbis-Express', 'Frisch vom Feld – 13,37 € das Kilo', '#f6f6ee', '#3c8d2f'],
  ['Pappkarton & Söhne', 'Haufenweise Kartons seit 1972', '#d8b98a', '#5a3b1c'],
  ['Elsa Fischtransporte', 'Kassel · frisch & königlich', '#ffffff', '#1d3f9a'],
  ['Bananensaft-Spedition', 'Gelb ist das neue Schnell', '#fff6c0', '#c79a00'],
  ['Sprachstudio-Logistik', 'Wir bringen jede Durchsage an', '#f0f0f0', '#7a2ca0'],
  ['Konfetti-Transporte', 'Vorsicht: Rutschgefahr beim Öffnen', '#ffffff', '#e5307a'],
  ['Ringtennis-Bedarf', 'Ringe, Netze, Leidenschaft', '#eef6ff', '#d45a00'],
  ['Kanalpunkte-Kurier', 'Wetten, dass wir pünktlich sind?', '#f4f4f4', '#6c3fc4'],
  ['Leitplanken-Lutz', 'Wir halten zusammen', '#e6e6e6', '#444444'],
  ['Schnelle Pommes', 'Ohne Rückfragen', '#fff3d6', '#d81e1e'],
];
const REAR_TEXTS = [
  'Abstand halten!', 'Wie fahre ich? 0800-BRUNNEN', 'Ladung: 33.333 Kürbisse', 'Rechts fahren ist Ehrensache',
  'Mein Wischer zuckt auch', 'Grüße an die Polizei Gifhorn', 'Nicht hupen, Fahrer träumt von Elsa',
];

// ---------------------------------------------------------------------------
// Gemeinsame Materialien
let M = null;
function mats() {
  if (M) return M;
  M = {
    body: new Map(),
    // Scheiben: freundliches Blaugrau statt fast Schwarz, der Himmel spiegelt sich weich darin
    glass: W.std({ color: 0x2c3d52, metalness: 0.5, roughness: 0.12, envMapIntensity: 1.15 }),
    detail: W.std({ vertexColors: true, roughness: 0.6, metalness: 0.15 }),
    // reines Rot: das Rücklicht bleibt dunkelrot, das Bremslicht leuchtet hell. Noch heller kippt
    // es im ACES-Tonemapping nach Orange und sähe aus wie ein Blinker.
    tail: W.std({ color: 0x2a0505, emissive: 0xff0000, emissiveIntensity: 0.14, roughness: 0.3 }),
    brake: W.std({ color: 0x500a0a, emissive: 0xff0000, emissiveIntensity: 0.95, roughness: 0.3 }),
    // dunkles Radhaus, von beiden Seiten sichtbar
    liner: W.std({ color: 0x0c0c0d, roughness: 0.85, side: THREE.DoubleSide }),
    blink: W.std({ color: 0x553300, emissive: 0xffa21a, emissiveIntensity: 3.0, roughness: 0.3 }),
    blueOn: W.std({ color: 0x0a1a66, emissive: 0x2255ff, emissiveIntensity: 5, roughness: 0.3 }),
    blueOff: W.std({ color: 0x1a2a66, emissive: 0x0a1540, emissiveIntensity: 0.4, roughness: 0.3 }),
    plates: new Map(),
    trailers: new Map(),
    // weicher Bodenschatten (bei Regen kräftiger, siehe setVehicleEnvIntensity)
    ground: W.basic({ color: 0x000000, map: contactShadowTexture(), transparent: true, opacity: 0.5, depthWrite: false }),
  };
  return M;
}

const groundGeos = new Map();
/** Bodenschatten-Fläche passend zur Grundfläche (lange Flächen unterteilt, damit sie der Erdkrümmung folgen). */
function groundGeometry(w, l) {
  const key = w.toFixed(2) + 'x' + l.toFixed(2);
  if (!groundGeos.has(key)) {
    const g = new THREE.PlaneGeometry(w, l, 1, Math.max(1, Math.ceil(l / 2.5)));
    g.rotateX(-Math.PI / 2);
    g.translate(0, 0.02, 0);
    groundGeos.set(key, g);
  }
  return groundGeos.get(key);
}

export function bodyMaterial(color, map = null) {
  const m = mats();
  const key = color + (map ? ':' + map.uuid : '');
  if (!m.body.has(key)) {
    // weicher Lack wie bei Spielzeugautos: wenig Metall, sanfter Glanz
    m.body.set(key, W.std({ color, map, metalness: 0.28, roughness: 0.36, envMapIntensity: 0.95 }));
  }
  return m.body.get(key);
}

function plateMaterial(text) {
  const m = mats();
  if (!m.plates.has(text)) m.plates.set(text, W.std({ map: plateTexture(text), roughness: 0.6 }));
  return m.plates.get(text);
}

/** Setzt die Umgebungs-Reflexion (PMREM) auf allen gemeinsamen Fahrzeug-Materialien. */
export function setVehicleEnvIntensity(rainy) {
  const m = mats();
  m.tail.emissiveIntensity = rainy ? 0.3 : 0.14;
  m.ground.opacity = rainy ? 0.78 : 0.5;
}

// ---------------------------------------------------------------------------
// Geometrie pro Typ (einmal gebaut, von allen Fahrzeugen geteilt)
const geoCache = new Map();

/** x der Außenhaut (rechte Seite) einer Loft-Form auf Höhe y an der Stelle u; 0, wenn y darüber liegt. */
const tmpP = new THREE.Vector3();
function surfX(shape, u, y) {
  let px = 0;
  let py = -Infinity;
  for (let k = 0; k <= 48; k++) {
    loftPoint(shape, u, -Math.PI / 2 + (k / 48) * Math.PI, tmpP);
    if (tmpP.y >= y) return py === -Infinity ? tmpP.x : lerp(px, tmpP.x, (y - py) / Math.max(1e-6, tmpP.y - py));
    px = tmpP.x;
    py = tmpP.y;
  }
  return 0;
}

/** Höhe der Oberseite einer Loft-Form an der Stelle u im seitlichen Abstand x (rechte Seite). */
function surfY(shape, u, x) {
  let px = 0;
  let py = 0;
  for (let k = 0; k <= 48; k++) {
    loftPoint(shape, u, Math.PI / 2 - (k / 48) * (Math.PI / 2), tmpP);
    if (k > 0 && tmpP.x >= x) return lerp(py, tmpP.y, (x - px) / Math.max(1e-6, tmpP.x - px));
    px = tmpP.x;
    py = tmpP.y;
  }
  return py;
}

/**
 * Stirnwand im Radlauf an der Stelle u (Seite s): von der Innenwand (x = xi) bis zur Außenhaut und vom
 * Unterboden bis yTop. Folgt dem Querschnitt der Karosserie ohne Radlauf-Ausschnitt, ragt also nirgends
 * heraus (eine rechteckige Platte stand unten und an der gerundeten Flanke wie ein Schmutzfänger über).
 */
function archEndWall(shape, u, s, xi, yTop) {
  const pts = [];
  let prev = null;
  for (let i = 0; i <= 96; i++) {
    loftPoint(shape, u, -Math.PI / 2 + (i / 96) * (Math.PI / 2), tmpP);
    // ein paar Millimeter nach innen, die Loft-Fläche zwischen den Querschnitten ist etwas flacher
    const cur = [tmpP.x - 0.005, tmpP.y + 0.003];
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
  g.translate(0, 0, u - shape.L / 2);
  return g;
}

/**
 * Höhe der Unterseite einer Loft-Form an der Stelle u im seitlichen Abstand x (rechte Seite), zwischen den
 * Ringpunkten des Lofts gerade verbunden wie dessen Flächen (die echte Rundung liegt ein wenig tiefer).
 */
function underY(shape, u, x, ring) {
  let px = 0;
  let py = 0;
  for (let k = 0; k <= ring / 4; k++) {
    loftPoint(shape, u, ringPhi(k, ring), tmpP);
    if (k > 0 && tmpP.x >= x) return lerp(py, tmpP.y, (x - px) / Math.max(1e-6, tmpP.x - px));
    px = tmpP.x;
    py = tmpP.y;
  }
  return py;
}

function carGeometry(key) {
  if (geoCache.has(key)) return geoCache.get(key);
  const p = CAR_TYPES[key];
  const { L, half, H, belt, hood, ws, re, ce, rear, axles, wr, cl, nose } = p;
  const box = rear === 'box';

  const topPts = [[0, nose - 0.13], [0.06, nose], [0.3, nose + 0.06], [hood, belt]];
  if (rear === 'sedan') topPts.push([ce, belt + 0.05], [L - 0.16, belt + 0.06], [L, belt - 0.1]);
  else topPts.push([lerp(hood, L, 0.6), belt + 0.02], [L - 0.06, belt - 0.02], [L, belt - 0.14]);
  const top = curve1(topPts);
  const bottomBase = curve1([[0, 0.36], [0.08, cl + 0.07], [0.28, cl], [L - 0.3, cl], [L - 0.06, cl + 0.1], [L, 0.4]]);
  const rArch = p.arch ?? wr + 0.07;
  const bottom = withArches(bottomBase, axles, rArch, wr);
  const width = curve1([[0, half - 0.22], [0.1, half - 0.08], [0.4, half - 0.02], [0.9, half], [L - 0.9, half], [L - 0.3, half - 0.03], [L, half - 0.1]]);
  // Radläufe nur an den Seiten ausschneiden (innen bleibt der Unterboden geschlossen)
  const bodyShape = { w: width, b: bottomBase, bx: sideArches(bottom, 0.5, 0.72), t: top, tw: 0.9, bw: 0.95, n: 4.5, L };
  // Querschnitte genau an den Enden der Radläufe (knapp außen und an den Stirnwänden): Dazwischen lief der
  // Ausschnitt sonst als schräge Fläche in Wagenfarbe in den Radlauf hinein (heller Spalt vor/hinter dem Reifen)
  const archUs = axles.flatMap((a) => [a - rArch - 0.002, a - rArch + 0.01, a + rArch - 0.01, a + rArch + 0.002]);
  const bodyGeos = [loft({ u0: 0, u1: L, ...bodyShape, segs: 64, ring: 24, H, extraUs: archUs })];
  // Leuchten und Blinker liegen als Flächenstücke direkt auf dem Blech (keine herausragenden Klötze)
  const onBody = (u, phi, target) => loftPoint(bodyShape, u, phi, target);
  // fein genug unterteilt, damit die Stücke auf der Rundung nicht ins Blech einsinken (sonst Zacken)
  const bodyPatch = (s, u0, u1, p0, p1, lift = 0.004) => surfacePatch(onBody, (a, t) => {
    const phi = lerp(p0, p1, a);
    return [lerp(u0, u1, t), s > 0 ? phi : Math.PI - phi];
  }, { ns: Math.max(6, Math.ceil(Math.abs(p1 - p0) / 0.08)), nt: 8, lift });

  // Glas
  const beltEnd = rear === 'sedan' ? belt + 0.07 : belt + 0.12;
  const gEnd = box ? p.cargo + 0.02 : ce;
  // Kastenwagen: Fahrerhausdach etwas unter dem Kasten. Die Kurve schießt hinter der Frontscheibe über ihren
  // letzten Punkt hinaus (Tangente), deshalb gedeckelt: sonst ragt die Dachkappe über den Kasten hinaus
  // (Transporter) bzw. die Scheibe oben durch den Alkoven (Wohnmobil).
  const gRoof = box ? H - 0.08 : H - 0.01;
  const gTopPts = [
    [hood - 0.02, belt + 0.01], [lerp(hood, ws, 0.5), lerp(belt, H, 0.56)], [ws, gRoof],
  ];
  if (box) gTopPts.push([gEnd, gRoof]);
  else gTopPts.push([(ws + re) / 2, H], [re, H - 0.015], [lerp(re, ce, 0.5), lerp(H, beltEnd, 0.55)], [ce, beltEnd]);
  const gCurve = curve1(gTopPts);
  const gTop = box ? (u) => Math.min(gCurve(u), gRoof) : gCurve;
  const gHalf = (u) => width(u) - 0.06;
  const glassShape = { w: gHalf, b: (u) => top(u) - 0.05, t: gTop, tw: box ? 0.95 : 0.8, bw: 1, n: 3.4, L };
  const gU0 = hood - 0.02;
  const gSegs = 36;
  const gRing = 22;
  const glassGeo = loft({ u0: gU0, u1: gEnd, ...glassShape, segs: gSegs, ring: gRing, H });

  // Dach in Wagenfarbe bzw. Kofferaufbau
  if (box) {
    bodyGeos.push(loft({
      u0: p.cargo, u1: L, w: (u) => width(u) + 0.01, b: () => belt - 0.06, t: curve1([[p.cargo, H - 0.02], [p.cargo + 0.3, H], [L, H]]),
      tw: 0.97, bw: 1, n: 7, segs: 24, ring: 24, L, H,
    }));
    if (p.alkoven) {
      bodyGeos.push(loft({
        u0: 0.45, u1: p.cargo + 0.2, w: () => half + 0.02, b: curve1([[0.45, H - 0.45], [1.2, H - 0.7], [p.cargo + 0.2, H - 0.72]]),
        t: () => H, tw: 0.98, bw: 1, n: 6, segs: 16, ring: 24, L, H,
      }));
    } else {
      bodyGeos.push(loft({
        u0: ws - 0.05, u1: p.cargo + 0.05, w: (u) => gHalf(u) * 0.95 + 0.02, b: (u) => gTop(u) - 0.07, t: (u) => gTop(u) + 0.015,
        tw: 0.95, bw: 1, n: 5, segs: 10, ring: 20, L, H,
      }));
    }
  } else {
    // Dach liegt direkt auf der Glaskuppel (kein schwebender Deckel), und zwar genau auf deren
    // Stützstellen (Querschnitte und Ringpunkte): Zwischen ihnen sind beide Flächen eben, so sticht
    // keine Glaskante durch das Dach. Hinten endet es an der Kante zur Heckscheibe.
    const onGlass = (u, phi, target) => loftPoint(glassShape, u, phi, target);
    const gUs = loftStations(gU0, gEnd, gSegs);
    const nearest = (u) => gUs.reduce((best, v, i) => (Math.abs(v - u) < Math.abs(gUs[best] - u) ? i : best), 0);
    const j0 = nearest(ws - 0.03);
    const j1 = nearest(re + 0.02);
    const k0 = Math.round((gRing * (0.42 + Math.PI / 2)) / (2 * Math.PI));
    const k1 = gRing - k0;
    const roof = surfacePatch(onGlass, (a, t) => [gUs[j0 + Math.round(t * (j1 - j0))], ringPhi(k0 + Math.round(a * (k1 - k0)), gRing)], {
      ns: k1 - k0, nt: j1 - j0, lift: 0.006,
    });
    // einfarbig: die Polizei-Lackierung zeigt auf dem Dach ihr Silber (nicht die Streifen der Flanken)
    const roofUv = roof.attributes.uv;
    for (let i = 0; i < roofUv.count; i++) roofUv.setXY(i, 0.5, 0.97);
    bodyGeos.push(roof);
  }
  const bodyGeo = mergeGeometries(bodyGeos);

  // Details: Reifen, Felgen, Stoßfänger, Grill, Spiegel, Scheinwerfer
  const det = [];
  const liners = [];
  const z = (u) => u - L / 2;
  const bodyUncut = { ...bodyShape, bx: null };
  // dunkles Radhaus, innen verschlossen (eigenes Mesh mit beidseitigem Material). Die Innenwand steht dicht
  // innen am Reifen, also vor der Schräge, mit der der Unterboden zum Radlauf hochgezogen ist: weiter innen
  // sah man durch den Spalt um den Reifen diese Schräge in Wagenfarbe, mit schwarzen Fetzen davor.
  const xIn = half - 0.245;
  const rL = rArch - 0.005;
  const bodyUs = loftStations(0, L, 64, 0.55, archUs); // Querschnitt-Stellen des Karosserie-Lofts (siehe oben)
  for (const a of axles) {
    // Schale über dem Rad, 5 mm unter der Radlauf-Kante. Sie knickt an denselben Stellen u wie der Loft:
    // Zwischen zwei Querschnitten ist dessen Kante gerade und liegt, wo der Radlauf steil ist, fast 7 mm innerhalb
    // des Kreises. Durch eine runde Schale (Zylinder) stach sie dort als heller Streifen.
    const arc = [[-rL, 0]];
    for (const u of bodyUs) if (Math.abs(u - a) < rL) arc.push([u - a, Math.sqrt(rL * rL - (u - a) * (u - a))]);
    arc.push([rL, 0]);
    // Innenwand bis zum Unterboden, auch vor und hinter dem Reifen und ein Stück über den Radlauf hinaus:
    // Der Ausschnitt läuft zwischen zwei Querschnitten schräg aus, auch dort soll man nur Schwarz sehen.
    // Was über den Radlauf hinausragt, liegt im Blech (über dem Radlauf bleibt mindestens 1 cm Blech).
    const ext = rArch + 0.07;
    const wallShape = new THREE.Shape();
    for (let i = 0; i <= 10; i++) {
      const dz = -ext + (2 * ext * i) / 10;
      const y = underY(bodyUncut, a + dz, xIn, 24) + 0.003 - wr;
      if (i === 0) wallShape.moveTo(dz, y);
      else wallShape.lineTo(dz, y);
    }
    wallShape.lineTo(ext, 0);
    wallShape.absarc(0, 0, rArch + 0.005, 0, Math.PI, false);
    wallShape.lineTo(-ext, 0);
    wallShape.closePath();
    for (const s of [-1, 1]) {
      const lp = [];
      for (let i = 0; i < arc.length - 1; i++) {
        const [z0, y0] = arc[i];
        const [z1, y1] = arc[i + 1];
        const A = [s * xIn, wr + y0, z(a) + z0];
        const B = [s * half, wr + y0, z(a) + z0];
        const C = [s * xIn, wr + y1, z(a) + z1];
        const D = [s * half, wr + y1, z(a) + z1];
        lp.push(...A, ...B, ...C, ...B, ...D, ...C);
      }
      const liner = new THREE.BufferGeometry();
      liner.setAttribute('position', new THREE.Float32BufferAttribute(lp, 3));
      liner.computeVertexNormals();
      const wall = new THREE.ShapeGeometry(wallShape, 28);
      // -90°: Form-x wird zu +z (gleiche Richtung wie u)
      wall.rotateY(-Math.PI / 2);
      wall.translate(s * xIn, wr, z(a));
      liners.push(liner, wall.toNonIndexed());
      // senkrechte Stirnwände vorne und hinten im Radlauf (bis knapp über die Radmitte), sonst glänzt dort Lack
      for (const e of [-1, 1]) liners.push(archEndWall(bodyUncut, a + e * (rArch - 0.01), s, xIn, wr + 0.01).toNonIndexed());
      const tire = new THREE.CylinderGeometry(wr, wr, 0.22, 16);
      tire.rotateZ(Math.PI / 2);
      tire.translate(s * (half - 0.13), wr, z(a));
      det.push(colorize(tire, 0x121212));
      det.push(colorize(discX(wr * 0.62, s * (half - 0.015), wr, z(a), s, 14), 0x9a9fa6));
    }
  }
  // Stoßfänger als dunkle Lippe unten um Front und Heck (folgt der Karosserie)
  det.push(colorize(bodyPatch(1, 0.0, 0.16, -Math.PI + 0.42, -0.42, 0.004), 0x1b1b1d));
  det.push(colorize(bodyPatch(1, L - 0.18, L, -Math.PI + 0.42, -0.42, 0.004), 0x1b1b1d));
  // Lufteinlass flach vor der Frontfläche (innerhalb ihres Umrisses)
  const capTop = top(0);
  const capBot = bottomBase(0);
  det.push(colorize(boxAt(width(0) * 1.05, Math.max(0.04, (capTop - capBot) * 0.55), 0.01, 0, capBot + (capTop - capBot) * 0.45, z(0) - 0.006), 0x222326));
  const uMir = hood + 0.25;
  // Spiegelarm beginnt knapp innerhalb von Blech bzw. Scheibe (sonst schaut sein Ende oben heraus)
  const armY = belt + 0.035;
  const armIn = Math.max(surfX(bodyShape, uMir, armY), surfX(glassShape, uMir, armY)) - 0.02;
  for (const s of [-1, 1]) {
    // Scheinwerfer an der vorderen Ecke, nach hinten gezogen
    // beginnt ein Stück hinter der Spitze: Ganz vorne (beim flachen Sportwagen stark gekrümmt) liegen die ebenen
    // Loft-Flächen etwas außerhalb der echten Rundung und stachen gezackt durch den Rahmen
    det.push(colorize(bodyPatch(s, 0.025, 0.17, 0.2, 0.8, 0.004), 0x2c3138));
    det.push(colorize(bodyPatch(s, 0.035, 0.15, 0.3, 0.7, 0.007), 0xe4ecf4));
    // Außenspiegel: flaches Gehäuse mit Arm, der im Blech beginnt
    det.push(colorize(boxAt(0.15, 0.085, 0.06, s * (half + 0.03), belt + 0.07, z(uMir), 0, s * 0.12, 0), 0x1a1a1c));
    det.push(colorize(boxAt(half - 0.03 - armIn, 0.035, 0.05, s * (armIn + half - 0.03) / 2, armY, z(uMir) + 0.01), 0x1a1a1c));
  }
  const detailGeo = mergeGeometries(det);
  for (const g of liners) g.deleteAttribute('uv');
  const linerGeo = mergeGeometries(liners);

  // Rückleuchten (eigenes Mesh, leuchten beim Bremsen) – auf der Heckfläche, nicht darüber
  const tl = [];
  const tailY = rear === 'box' ? 0.85 : top(L) - 0.1;
  // innerhalb der gerundeten Heckecken (auch beim Kastenaufbau): die obere Außenecke bleibt 3 cm
  // innerhalb des Heckumrisses, sonst steht sie über der Rundung in der Luft
  const tailX = Math.min(width(L) - 0.26, surfX(bodyShape, L, tailY + 0.06) - 0.18);
  for (const s of [-1, 1]) tl.push(boxAt(0.3, 0.12, 0.024, s * tailX, tailY, z(L) + 0.004));
  const tailGeo = mergeGeometries(tl);
  const blinkY = rear === 'box' ? tailY + 0.11 : tailY - 0.1;
  const blinkX = Math.min(width(L) - 0.18, surfX(bodyShape, L, blinkY + 0.03) - 0.08);
  const blinkGeo = (s) => mergeGeometries([
    boxAt(0.1, 0.06, 0.024, s * blinkX, blinkY, z(L) + 0.006),
    // vorne unter dem Scheinwerfer und seitlich am Kotflügel, beides auf der Karosserie
    bodyPatch(s, 0.025, 0.12, 0.02, 0.18, 0.005),
    bodyPatch(s, Math.min(axles[0] + wr + 0.12, hood - 0.1), Math.min(axles[0] + wr + 0.2, hood - 0.02), 0.3, 0.4, 0.005),
  ]);
  const plateGeo = new THREE.PlaneGeometry(0.52, 0.112);
  plateGeo.translate(0, rear === 'box' ? 0.55 : Math.max(cl + 0.32, belt - 0.32), z(L) + 0.012);
  // Blaulicht steht auf dem gewölbten Dach: Unterkante auf Dachhöhe an den Außenecken (schwebt dort nicht)
  const uBar = (ws + re) / 2;
  const yBar = Math.min(surfY(glassShape, uBar - 0.11, 0.43), surfY(glassShape, uBar + 0.11, 0.43));
  const lightbarGeo = [-1, 1].map((s) => boxAt(0.42, 0.09, 0.22, s * 0.22, yBar + 0.045, z(uBar)));

  const g = { bodyGeo, glassGeo, detailGeo, linerGeo, tailGeo, blinkL: blinkGeo(-1), blinkR: blinkGeo(1), plateGeo, lightbarGeo, bodyShape };
  geoCache.set(key, g);
  return g;
}

// ---------------------------------------------------------------------------
// Sattelzug
const TRUCK_L = 16.5;
function truckGeometry() {
  if (geoCache.has('lkw')) return geoCache.get('lkw');
  const z = (u) => u - TRUCK_L / 2;
  const cab = loft({
    u0: 0, u1: 2.3, w: curve1([[0, 1.18], [0.12, 1.24], [2.3, 1.25]]), b: () => 0.92,
    t: curve1([[0, 3.35], [0.2, 3.62], [0.8, 3.75], [2.3, 3.78]]), tw: 0.96, bw: 1, n: 8, segs: 14, ring: 28, L: TRUCK_L, H: 4,
  });
  const det = [];
  // Frontscheibe vor der Fahrerhausfront; schmal genug, dass die oberen Ecken innerhalb der Rundung bleiben
  det.push(colorize(boxAt(2.0, 1.05, 0.05, 0, 2.72, z(0) - 0.06, -0.06), 0x182028));
  for (const s of [-1, 1]) det.push(colorize(boxAt(0.04, 0.85, 1.0, s * 1.255, 2.75, z(0.75)), 0x182028));
  det.push(colorize(boxAt(2.3, 0.35, 0.12, 0, 0.75, z(0.05)), 0x2a2a2c)); // Stoßfänger
  det.push(colorize(boxAt(1.7, 0.9, 0.04, 0, 1.6, z(0.01)), 0x2f3236)); // Grill
  det.push(colorize(boxAt(1.8, 0.12, 0.35, 0, 3.4, z(0.05), 0.25), 0x1e1e20)); // Sonnenblende (endet vor den gerundeten Ecken)
  det.push(colorize(boxAt(1.0, 0.45, 5.2, 0, 0.78, z(3.2)), 0x222224)); // Rahmen
  for (const s of [-1, 1]) {
    const tank = new THREE.CylinderGeometry(0.3, 0.3, 1.2, 12);
    tank.rotateX(Math.PI / 2);
    tank.translate(s * 0.95, 0.75, z(3.2));
    det.push(colorize(tank, 0xb9bec4));
    det.push(colorize(boxAt(0.3, 0.12, 0.08, s * 0.85, 1.25, z(0.02)), 0xe7eef5)); // Scheinwerfer
    det.push(colorize(boxAt(0.08, 0.55, 0.06, s * 1.38, 2.6, z(0.55)), 0x1a1a1a)); // Spiegel
    for (const y of [2.42, 2.8]) det.push(colorize(boxAt(0.2, 0.035, 0.035, s * 1.29, y, z(0.55)), 0x1a1a1a)); // Spiegelhalter (beginnen im Blech)
    det.push(colorize(boxAt(0.05, 0.4, 7.1, s * 1.24, 0.95, z(9.12)), 0x9aa0a6)); // Seitenschutz zwischen Antriebsrad und Auflieger-Achsen
  }
  const wheelsAt = [[1.35, 0.52, 0.32], [4.9, 0.52, 0.55], [13.3, 0.48, 0.5], [14.6, 0.48, 0.5], [15.9, 0.48, 0.5]];
  for (const [u, r, wdt] of wheelsAt) {
    for (const s of [-1, 1]) {
      const tire = new THREE.CylinderGeometry(r, r, wdt, 16);
      tire.rotateZ(Math.PI / 2);
      tire.translate(s * (1.25 - wdt / 2 - 0.02), r, z(u));
      det.push(colorize(tire, 0x121212));
      det.push(colorize(discX(r * 0.6, s * 1.24, r, z(u), s, 14), 0x8a8f96));
    }
  }
  det.push(colorize(boxAt(2.4, 0.15, 0.12, 0, 0.6, z(16.45)), 0x9aa0a6)); // Unterfahrschutz
  det.push(colorize(boxAt(2.4, 0.3, 13.6, 0, 1.12, z(9.7)), 0x2b2c2e)); // Auflieger-Rahmen
  const detailGeo = mergeGeometries(det);

  const trailerGeo = new THREE.BoxGeometry(2.55, 2.75, 13.6);
  trailerGeo.translate(0, 2.65, z(9.7));
  const tailGeo = mergeGeometries([boxAt(0.4, 0.14, 0.05, -0.95, 1.05, z(16.5) + 0.02), boxAt(0.4, 0.14, 0.05, 0.95, 1.05, z(16.5) + 0.02)]);
  const blinkGeo = (s) => mergeGeometries([
    boxAt(0.14, 0.12, 0.05, s * 1.17, 1.05, z(16.5) + 0.025),
    boxAt(0.12, 0.1, 0.05, s * 1.05, 1.25, z(0) - 0.02),
    boxAt(0.04, 0.08, 0.16, s * 1.27, 1.25, z(1.9)),
  ]);
  const plateGeo = new THREE.PlaneGeometry(0.52, 0.112);
  plateGeo.translate(0, 1.12, z(16.5) + 0.03); // am Auflieger-Rahmen (nicht in der Luft zwischen den Rädern)
  const g = { bodyGeo: cab, detailGeo, trailerGeo, tailGeo, blinkL: blinkGeo(-1), blinkR: blinkGeo(1), plateGeo };
  geoCache.set('lkw', g);
  return g;
}

function trailerMaterials(idx) {
  const m = mats();
  if (!m.trailers.has(idx)) {
    const [company, slogan, color, accent] = COMPANIES[idx];
    const side = W.std({ map: trailerTexture(company, slogan, color, accent), roughness: 0.7 });
    const rear = W.std({ map: truckRearTexture(REAR_TEXTS[idx % REAR_TEXTS.length]), roughness: 0.7 });
    const plain = W.std({ color: new THREE.Color(color), roughness: 0.75 });
    m.trailers.set(idx, [side, side, plain, plain, rear, plain]);
  }
  return m.trailers.get(idx);
}

// Polizei-Lackierung (blau-silber) als Seitentextur
let policeTex = null;
function policeTexture() {
  if (policeTex) return policeTex;
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 256;
  const ctx = c.getContext('2d');
  // u: 0..L (4.82 m), v: 0..H (1.5 m), Canvas oben = Dach
  ctx.fillStyle = '#d9dde2';
  ctx.fillRect(0, 0, 1024, 256);
  const yOf = (m) => 256 - (m / 1.5) * 256;
  ctx.fillStyle = '#1b4ea3';
  ctx.fillRect(0, yOf(0.86), 1024, yOf(0.42) - yOf(0.86));
  ctx.fillStyle = '#d7e64a';
  ctx.fillRect(0, yOf(0.88), 1024, 5);
  // Schriftzug nicht in dieser Textur: die Mitte von Motorhaube und Heck würde sonst die ganze
  // Texturbreite gestaucht zeigen (weiße Striche). Er sitzt als eigene Folie auf den Seiten.
  policeTex = new THREE.CanvasTexture(c);
  policeTex.colorSpace = THREE.SRGBColorSpace;
  policeTex.anisotropy = 4;
  return policeTex;
}

/** Schriftzug „POLIZEI / Gifhorn“ als Folie auf der Seite (liest sich auf beiden Seiten richtig). */
let policeDecal = null;
function policeDecals() {
  if (policeDecal) return policeDecal;
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 192;
  const ctx = c.getContext('2d');
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 118px Arial, sans-serif';
  ctx.fillText('POLIZEI', 512, 84);
  ctx.font = 'bold 40px Arial, sans-serif';
  ctx.fillText('Gifhorn', 512, 166);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const mat = W.std({ map: tex, transparent: true, depthWrite: false, roughness: 0.4 });
  const shape = carGeometry('kombi').bodyShape;
  const { n } = { n: 4.5 };
  // phi so wählen, dass die Folie auf Höhe y liegt (an jeder Stelle u)
  const phiAt = (u, y) => {
    const b = shape.b(u);
    const t = shape.t(u);
    const Y = Math.min(0.995, Math.max(-0.995, (2 * (y - b)) / (t - b) - 1));
    return Math.asin(Math.sign(Y) * Math.pow(Math.abs(Y), n / 2));
  };
  const geos = [-1, 1].map((s) => {
    const g = surfacePatch((u, phi, target) => loftPoint(shape, u, phi, target), (a, t) => {
      const u = lerp(1.62, 3.22, t);
      const phi = phiAt(u, lerp(0.47, 0.8, a));
      return [u, s > 0 ? phi : Math.PI - phi];
    }, { ns: 4, nt: 28, lift: 0.006 });
    const uv = g.attributes.uv;
    for (let i = 0; i < uv.count; i++) {
      const a = uv.getX(i);
      const t = uv.getY(i);
      uv.setXY(i, s > 0 ? 1 - t : t, a);
    }
    return g;
  });
  policeDecal = { mat, geo: mergeGeometries(geos) };
  return policeDecal;
}

// ---------------------------------------------------------------------------
export class Vehicle {
  constructor(kind, { color, plate, company } = {}) {
    const m = mats();
    this.kind = kind;
    this.group = new THREE.Group();
    this.brake = false;
    this.blinkDir = 0;
    this.police = kind === 'polizei';
    const typeKey = kind === 'polizei' ? 'kombi' : kind;
    if (kind === 'lkw') {
      const g = truckGeometry();
      this.length = TRUCK_L;
      this.width = 2.55;
      this.height = 4.0;
      const cabColor = color ?? pick([0xf4f4f1, 0xd24a3a, 0x3f7fc4, 0xf2c230, 0x3a3f47, 0x4f9a6a, 0xdfe3e6, 0xf08a2c, 0x35b3a8]);
      this.cab = new THREE.Mesh(g.bodyGeo, bodyMaterial(cabColor));
      this.details = new THREE.Mesh(g.detailGeo, m.detail);
      const ci = company ?? Math.floor(Math.random() * COMPANIES.length);
      this.company = COMPANIES[ci][0];
      this.trailer = new THREE.Mesh(g.trailerGeo, trailerMaterials(ci));
      this.tail = new THREE.Mesh(g.tailGeo, m.tail);
      this.blinkL = new THREE.Mesh(g.blinkL, m.blink);
      this.blinkR = new THREE.Mesh(g.blinkR, m.blink);
      this.plate = new THREE.Mesh(g.plateGeo, plateMaterial(plate ?? pick(PLATES)));
      this.group.add(this.cab, this.details, this.trailer, this.tail, this.blinkL, this.blinkR, this.plate);
      this.trailer.castShadow = true;
      this.cab.castShadow = true;
    } else {
      const g = carGeometry(typeKey);
      const p = CAR_TYPES[typeKey];
      this.length = p.L;
      this.width = p.half * 2 + 0.12;
      this.height = p.H;
      let mat;
      if (this.police) mat = bodyMaterial(0xffffff, policeTexture());
      else if (kind === 'wohnmobil') mat = bodyMaterial(0xf4f4f0);
      else mat = bodyMaterial(color ?? weightedPick(COLORS, (c) => c[1])[0]);
      this.body = new THREE.Mesh(g.bodyGeo, mat);
      this.body.castShadow = true;
      this.glass = new THREE.Mesh(g.glassGeo, m.glass);
      this.details = new THREE.Mesh(g.detailGeo, m.detail);
      this.liners = new THREE.Mesh(g.linerGeo, m.liner);
      this.tail = new THREE.Mesh(g.tailGeo, m.tail);
      this.blinkL = new THREE.Mesh(g.blinkL, m.blink);
      this.blinkR = new THREE.Mesh(g.blinkR, m.blink);
      this.plate = new THREE.Mesh(g.plateGeo, plateMaterial(plate ?? (this.police ? 'GF-3333' : pick(PLATES))));
      this.group.add(this.body, this.glass, this.details, this.liners, this.tail, this.blinkL, this.blinkR, this.plate);
      if (this.police) {
        this.bar = g.lightbarGeo.map((geo) => new THREE.Mesh(geo, m.blueOff));
        this.group.add(...this.bar);
        const d = policeDecals();
        this.group.add(new THREE.Mesh(d.geo, d.mat));
      }
    }
    this.blinkL.visible = false;
    this.blinkR.visible = false;
    // Bodenschatten (Lkw: über Zugmaschine und Auflieger)
    this.ground = new THREE.Mesh(groundGeometry(this.width + 0.2, this.length + 0.35), m.ground);
    this.ground.renderOrder = -1;
    this.group.add(this.ground);
  }

  /** Laufschrift-Anzeige in der Heckscheibe des Polizeiautos. */
  setPoliceText(text) {
    if (!this.police) return;
    if (!this.display) {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 96;
      this.displayCanvas = c;
      this.displayTex = new THREE.CanvasTexture(c);
      this.displayTex.colorSpace = THREE.SRGBColorSpace;
      const p = CAR_TYPES.kombi;
      const mat = W.basic({ map: this.displayTex, toneMapped: false });
      this.display = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.17), mat);
      // liegt auf der schrägen Heckscheibe (nicht frei in der Luft dahinter)
      this.display.position.set(0, p.H - 0.25, p.L / 2 - 0.18);
      this.display.rotation.x = -0.52;
      this.group.add(this.display);
    }
    const ctx = this.displayCanvas.getContext('2d');
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, 512, 96);
    ctx.fillStyle = '#ffb21a';
    ctx.font = 'bold 54px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const t = (text || 'POLIZEI GIFHORN').toUpperCase();
    let size = 54;
    while (ctx.measureText(t).width > 490 && size > 20) {
      size -= 4;
      ctx.font = `bold ${size}px "Courier New", monospace`;
    }
    ctx.fillText(t, 256, 50);
    this.displayTex.needsUpdate = true;
  }

  setBrake(b) {
    if (b === this.brake) return;
    this.brake = b;
    this.tail.material = b ? mats().brake : mats().tail;
  }

  setBlink(dir) {
    this.blinkDir = dir;
    if (!dir) {
      this.blinkL.visible = false;
      this.blinkR.visible = false;
    }
  }

  /** @param {number} t Zeit in s; @param {boolean} sirens Blaulicht an */
  updateLights(t, sirens = false) {
    const on = Math.sin(t * Math.PI * 2 * 1.45) > 0;
    if (this.blinkDir) {
      this.blinkL.visible = this.blinkDir < 0 && on;
      this.blinkR.visible = this.blinkDir > 0 && on;
    }
    if (this.bar) {
      const m = mats();
      const ph = Math.floor(t * 7) % 4;
      this.bar[0].material = sirens && (ph === 0 || ph === 2) ? m.blueOn : m.blueOff;
      this.bar[1].material = sirens && (ph === 1 || ph === 3) ? m.blueOn : m.blueOff;
    }
  }
}

/** Zufälliger Fahrzeugtyp; Lkw nur, wenn erlaubt. */
export function randomKind(allowTruck = true, truckShare = 0.18) {
  if (allowTruck && Math.random() < truckShare) return 'lkw';
  const keys = Object.keys(CAR_TYPES);
  return weightedPick(keys, (k) => CAR_TYPES[k].weight);
}

/** Baut alle Geometrien vorab (verhindert Ruckler beim ersten Auftauchen). */
export function prewarmVehicles() {
  for (const k of Object.keys(CAR_TYPES)) carGeometry(k);
  truckGeometry();
  for (let i = 0; i < COMPANIES.length; i++) trailerMaterials(i);
  policeTexture();
  policeDecals();
}

