// Verkehrsteilnehmer: Kleinwagen, Kompakte, Limousinen, Kombis, SUVs, Sportwagen, Transporter,
// Wohnmobile, Sattelzüge (fiktive Speditionen mit Insider-Sprüchen) und die Polizei Gifhorn.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { W } from '../curve.js';
import { plateTexture, trailerTexture, truckRearTexture } from '../textures.js';
import { loft, loftPoint, surfacePatch, curve1, withArches, sideArches, colorize, boxAt, discX } from './loft.js';
import { lerp, pick, weightedPick } from '../util.js';

export const CAR_TYPES = {
  klein: { L: 3.62, half: 0.83, H: 1.5, belt: 0.93, hood: 0.78, ws: 1.32, re: 2.85, ce: 3.48, rear: 'hatch', axles: [0.68, 3.0], wr: 0.29, cl: 0.15, nose: 0.62, weight: 8 },
  kompakt: { L: 4.26, half: 0.895, H: 1.46, belt: 0.93, hood: 1.05, ws: 1.72, re: 3.35, ce: 4.12, rear: 'hatch', axles: [0.86, 3.5], wr: 0.31, cl: 0.16, nose: 0.6, weight: 22 },
  limo: { L: 4.78, half: 0.915, H: 1.45, belt: 0.95, hood: 1.32, ws: 1.98, re: 3.15, ce: 3.88, rear: 'sedan', axles: [0.95, 3.8], wr: 0.32, cl: 0.15, nose: 0.6, weight: 15 },
  kombi: { L: 4.82, half: 0.915, H: 1.5, belt: 0.95, hood: 1.25, ws: 1.92, re: 4.5, ce: 4.74, rear: 'wagon', axles: [0.95, 3.75], wr: 0.32, cl: 0.16, nose: 0.6, weight: 18 },
  suv: { L: 4.62, half: 0.94, H: 1.68, belt: 1.08, hood: 1.12, ws: 1.78, re: 4.2, ce: 4.5, rear: 'wagon', axles: [0.92, 3.62], wr: 0.36, cl: 0.22, nose: 0.74, weight: 14 },
  sport: { L: 4.5, half: 0.93, H: 1.27, belt: 0.82, hood: 1.62, ws: 2.25, re: 2.9, ce: 4.05, rear: 'hatch', axles: [1.12, 3.62], wr: 0.33, cl: 0.12, nose: 0.48, weight: 4 },
  transporter: { L: 5.9, half: 1.0, H: 2.5, belt: 1.2, hood: 0.78, ws: 1.42, re: 5.85, ce: 5.9, rear: 'box', cargo: 2.05, axles: [0.95, 4.6], wr: 0.36, cl: 0.2, nose: 0.78, weight: 8 },
  wohnmobil: { L: 7.0, half: 1.15, H: 3.0, belt: 1.3, hood: 0.8, ws: 1.45, re: 6.95, ce: 7.0, rear: 'box', cargo: 1.9, alkoven: true, axles: [1.0, 4.9], wr: 0.38, cl: 0.22, nose: 0.8, weight: 2 },
};

export const COLORS = [
  [0xb8bcc2, 20], [0x111214, 20], [0xeef0f2, 18], [0x5a5f66, 18], [0x23407a, 10], [0x9e1b1b, 6],
  [0x2d4a3a, 3], [0xb8a07a, 2], [0xe8c31a, 1], [0xd2691e, 1], [0x1d6fa8, 2],
];

const PLATES = [
  'KS-EL 5A', 'GF-PO 110', 'FD-BR 1', 'SI-EG 3', 'F-SK 2017', 'MZ-RT 1369', 'B-AN 333', 'KS-ZF 33', 'HU-PA 42',
  'F-AB 1234', 'DA-HD 1080', 'OF-RT 333', 'GF-MA 3', 'HH-MA 1', 'FD-VIP 3', 'K-OE 1337',
];

const COMPANIES = [
  ['Plüsch-Logistik', 'Wir liefern Mini Adams in ganz Deutschland', '#ffffff', '#c8102e'],
  ['Brunnenbau Schönnbrun', 'Seit 1887 – Brunnen mit Gefühl', '#e8f1f8', '#1d5fa8'],
  ['Rettich-Express', 'Frisch vom Feld – 13,69 € das Kilo', '#f6f6ee', '#3c8d2f'],
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
  'Abstand halten!', 'Wie fahre ich? 0800-BRUNNEN', 'Ladung: 33.333 Rettiche', 'Rechts fahren ist Ehrensache',
  'Mein Wischer zuckt auch', 'Grüße an die Polizei Gifhorn', 'Nicht hupen, Fahrer träumt von Elsa',
];

// ---------------------------------------------------------------------------
// Gemeinsame Materialien
let M = null;
function mats() {
  if (M) return M;
  M = {
    body: new Map(),
    glass: W.std({ color: 0x141a22, metalness: 0.6, roughness: 0.08, envMapIntensity: 1.4 }),
    detail: W.std({ vertexColors: true, roughness: 0.6, metalness: 0.15 }),
    tail: W.std({ color: 0x400808, emissive: 0xff1a12, emissiveIntensity: 0.55, roughness: 0.3 }),
    brake: W.std({ color: 0x500a0a, emissive: 0xff2a1a, emissiveIntensity: 3.2, roughness: 0.3 }),
    blink: W.std({ color: 0x553300, emissive: 0xffa21a, emissiveIntensity: 3.0, roughness: 0.3 }),
    blueOn: W.std({ color: 0x0a1a66, emissive: 0x2255ff, emissiveIntensity: 5, roughness: 0.3 }),
    blueOff: W.std({ color: 0x1a2a66, emissive: 0x0a1540, emissiveIntensity: 0.4, roughness: 0.3 }),
    plates: new Map(),
    trailers: new Map(),
  };
  return M;
}

export function bodyMaterial(color, map = null) {
  const m = mats();
  const key = color + (map ? ':' + map.uuid : '');
  if (!m.body.has(key)) {
    m.body.set(key, W.std({ color, map, metalness: 0.45, roughness: 0.3, envMapIntensity: 1.1 }));
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
  m.tail.emissiveIntensity = rainy ? 1.6 : 0.55;
}

// ---------------------------------------------------------------------------
// Geometrie pro Typ (einmal gebaut, von allen Fahrzeugen geteilt)
const geoCache = new Map();

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
  const bottom = withArches(bottomBase, axles, wr + 0.07, wr);
  const width = curve1([[0, half - 0.22], [0.1, half - 0.08], [0.4, half - 0.02], [0.9, half], [L - 0.9, half], [L - 0.3, half - 0.03], [L, half - 0.1]]);
  // Radläufe nur an den Seiten ausschneiden (innen bleibt der Unterboden geschlossen)
  const bodyGeos = [loft({ u0: 0, u1: L, w: width, b: bottomBase, bx: sideArches(bottom, 0.5, 0.72), t: top, tw: 0.9, bw: 0.95, n: 4.5, segs: 64, ring: 24, L, H })];

  // Glas
  const beltEnd = rear === 'sedan' ? belt + 0.07 : belt + 0.12;
  const gEnd = box ? p.cargo + 0.02 : ce;
  const gTopPts = [
    [hood - 0.02, belt + 0.01], [lerp(hood, ws, 0.5), lerp(belt, H, 0.56)], [ws, H - 0.01],
  ];
  if (box) gTopPts.push([gEnd, H - 0.01]);
  else gTopPts.push([(ws + re) / 2, H], [re, H - 0.015], [lerp(re, ce, 0.5), lerp(H, beltEnd, 0.55)], [ce, beltEnd]);
  const gTop = curve1(gTopPts);
  const gHalf = (u) => width(u) - 0.06;
  const glassShape = { w: gHalf, b: (u) => top(u) - 0.05, t: gTop, tw: box ? 0.95 : 0.8, bw: 1, n: 3.4, L };
  const glassGeo = loft({ u0: hood - 0.02, u1: gEnd, ...glassShape, segs: 36, ring: 22, H });

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
    // Dach liegt direkt auf der Glaskuppel (kein schwebender Deckel)
    const onGlass = (u, phi, target) => loftPoint(glassShape, u, phi, target);
    bodyGeos.push(surfacePatch(onGlass, (a, t) => [lerp(ws - 0.03, re + 0.02, t), lerp(0.42, Math.PI - 0.42, a)], { ns: 12, nt: 16, lift: 0.006 }));
  }
  const bodyGeo = mergeGeometries(bodyGeos);

  // Details: Reifen, Felgen, Stoßfänger, Grill, Spiegel, Scheinwerfer
  const det = [];
  const z = (u) => u - L / 2;
  for (const a of axles) {
    for (const s of [-1, 1]) {
      // dunkles Radhaus, innen verschlossen
      const xIn = half * 0.45;
      const liner = new THREE.CylinderGeometry(wr + 0.07, wr + 0.07, half - xIn, 14, 1, true, 0, Math.PI);
      liner.rotateZ(Math.PI / 2);
      liner.translate(s * (half + xIn) / 2, wr, z(a));
      const wall = new THREE.CircleGeometry(wr + 0.07, 14, 0, Math.PI);
      wall.rotateY(Math.PI / 2);
      wall.translate(s * xIn, wr, z(a));
      det.push(colorize(liner, 0x0c0c0d), colorize(wall, 0x0c0c0d));
      const tire = new THREE.CylinderGeometry(wr, wr, 0.22, 16);
      tire.rotateZ(Math.PI / 2);
      tire.translate(s * (half - 0.13), wr, z(a));
      det.push(colorize(tire, 0x121212));
      det.push(colorize(discX(wr * 0.62, s * (half - 0.015), wr, z(a), s, 14), 0x9a9fa6));
    }
  }
  det.push(colorize(boxAt(half * 1.7, 0.16, 0.06, 0, cl + 0.12, z(0.03)), 0x1b1b1d));
  det.push(colorize(boxAt(half * 1.75, 0.15, 0.06, 0, cl + 0.16, z(L - 0.03)), 0x1b1b1d));
  det.push(colorize(boxAt(half * 0.9, 0.12, 0.04, 0, nose - 0.1, z(0.02)), 0x222326));
  for (const s of [-1, 1]) {
    det.push(colorize(boxAt(0.26, 0.09, 0.05, s * (half - 0.25), nose - 0.03, z(0.04)), 0xdfe6ee));
    const mir = new THREE.SphereGeometry(1, 8, 6);
    mir.scale(0.1, 0.06, 0.07);
    mir.translate(s * (half + 0.06), belt + 0.05, z(hood + 0.25));
    det.push(colorize(mir, 0x1a1a1c));
  }
  const detailGeo = mergeGeometries(det);

  // Rückleuchten (eigenes Mesh, leuchten beim Bremsen)
  const tl = [];
  const tailY = rear === 'box' ? 0.85 : belt - 0.08;
  for (const s of [-1, 1]) tl.push(boxAt(0.32, 0.12, 0.05, s * (half - 0.2), tailY, z(L) + 0.01));
  const tailGeo = mergeGeometries(tl);
  const blinkGeo = (s) => mergeGeometries([
    boxAt(0.1, 0.06, 0.05, s * (half - 0.07), tailY + 0.11, z(L) + 0.012),
    boxAt(0.08, 0.05, 0.05, s * (half - 0.08), nose - 0.03, z(0) - 0.01),
    boxAt(0.04, 0.04, 0.12, s * (half + 0.01), belt - 0.15, z(0.75)),
  ]);
  const plateGeo = new THREE.PlaneGeometry(0.52, 0.112);
  plateGeo.translate(0, rear === 'box' ? 0.55 : Math.max(cl + 0.32, belt - 0.32), z(L) + 0.035);
  const lightbarGeo = [boxAt(0.42, 0.08, 0.22, -0.22, H + 0.05, z((ws + re) / 2)), boxAt(0.42, 0.08, 0.22, 0.22, H + 0.05, z((ws + re) / 2))];

  const g = { bodyGeo, glassGeo, detailGeo, tailGeo, blinkL: blinkGeo(-1), blinkR: blinkGeo(1), plateGeo, lightbarGeo };
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
  det.push(colorize(boxAt(2.2, 1.05, 0.05, 0, 2.72, z(0.06), -0.06), 0x182028)); // Frontscheibe
  for (const s of [-1, 1]) det.push(colorize(boxAt(0.04, 0.85, 1.0, s * 1.255, 2.75, z(0.75)), 0x182028));
  det.push(colorize(boxAt(2.3, 0.35, 0.12, 0, 0.75, z(0.05)), 0x2a2a2c)); // Stoßfänger
  det.push(colorize(boxAt(1.7, 0.9, 0.04, 0, 1.6, z(0.01)), 0x2f3236)); // Grill
  det.push(colorize(boxAt(2.4, 0.12, 0.35, 0, 3.4, z(0.05), 0.25), 0x1e1e20)); // Sonnenblende
  det.push(colorize(boxAt(1.0, 0.45, 5.2, 0, 0.78, z(3.2)), 0x222224)); // Rahmen
  for (const s of [-1, 1]) {
    const tank = new THREE.CylinderGeometry(0.3, 0.3, 1.2, 12);
    tank.rotateX(Math.PI / 2);
    tank.translate(s * 0.95, 0.75, z(3.2));
    det.push(colorize(tank, 0xb9bec4));
    det.push(colorize(boxAt(0.3, 0.12, 0.08, s * 0.85, 1.25, z(0.02)), 0xe7eef5)); // Scheinwerfer
    det.push(colorize(boxAt(0.08, 0.55, 0.06, s * 1.38, 2.6, z(0.55)), 0x1a1a1a)); // Spiegel
    det.push(colorize(boxAt(0.05, 0.4, 9.0, s * 1.24, 0.95, z(9.3)), 0x9aa0a6)); // Seitenschutz
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
  plateGeo.translate(0, 0.85, z(16.5) + 0.03);
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
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 54px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('POLIZEI', 512, (yOf(0.86) + yOf(0.42)) / 2 + 2);
  ctx.fillStyle = '#1b4ea3';
  ctx.font = 'bold 24px Arial, sans-serif';
  ctx.fillText('Gifhorn', 512, yOf(0.98));
  policeTex = new THREE.CanvasTexture(c);
  policeTex.colorSpace = THREE.SRGBColorSpace;
  policeTex.anisotropy = 4;
  return policeTex;
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
      const cabColor = color ?? pick([0xf2f2f2, 0xb01818, 0x1d4f9a, 0xe8b400, 0x222222, 0x2d6b3a, 0xdadde0]);
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
      this.tail = new THREE.Mesh(g.tailGeo, m.tail);
      this.blinkL = new THREE.Mesh(g.blinkL, m.blink);
      this.blinkR = new THREE.Mesh(g.blinkR, m.blink);
      this.plate = new THREE.Mesh(g.plateGeo, plateMaterial(plate ?? (this.police ? 'GF-3333' : pick(PLATES))));
      this.group.add(this.body, this.glass, this.details, this.tail, this.blinkL, this.blinkR, this.plate);
      if (this.police) {
        this.bar = g.lightbarGeo.map((geo) => new THREE.Mesh(geo, m.blueOff));
        this.group.add(...this.bar);
      }
    }
    this.blinkL.visible = false;
    this.blinkR.visible = false;
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
      this.display.position.set(0, p.H - 0.25, p.L / 2 - 0.02);
      this.display.rotation.x = -0.35;
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
}

