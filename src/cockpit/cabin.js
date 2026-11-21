// Die Kabine des Model 3 als Plüsch-Spielzeug: gepolstertes Armaturenbrett mit Luftschlitz und Holzleiste,
// stoffbezogene Säulen, Dachrahmen mit Sonnenblenden, Türen, Sitze, Mittelkonsole, Boden und Pedale.
// Alles wird in Sammellisten je Material gelegt (siehe parts.js), das Cockpit macht daraus wenige Meshes.
import * as THREE from 'three';
import { smoothstep, clamp, lerp } from '../util.js';
import { fillet, skin, sweep, ring, pillow, rbox, lathe, tube, place, prep, roundedRect, stitches, v3 } from './parts.js';
import { tileUV } from './cabinTextures.js';
import { curve1 } from '../models/loft.js';

const V3 = THREE.Vector3;

// Farben: Anthrazit in mehreren Stufen statt Schwarz, damit die Formen Licht fangen
export const PAL = {
  pad: 0x34373c,
  padLow: 0x2b2d32,
  door: 0x2f3237,
  cloth: 0x3a3d42,
  insert: 0x42454b,
  leather: 0x2d2f34,
  carpet: 0x25272b,
  rubber: 0x1b1c1f,
  deep: 0x121315,
  gloss: 0x141518,
  // Gehäuse von Innenspiegel und Geräten: dunkles Anthrazit mit Klarlack statt Klavierlack (sonst ein schwarzer Rand)
  mirror: 0x26282d,
  thread: 0xc4bdb0,
  spoke: 0x2c2e33,
  satin: 0xb6bac0,
};

/** Wohin die Vorderseiten der Verkleidungen schauen: in den Innenraum. */
const INSIDE = v3(0, 0.95, 0.15);

// Armaturenbrett: Wölbung der Oberseite zu den Türen hin (m)
const crown = (x) => 0.012 * (x / 0.8) ** 2;
const DASH_TOP = [[-0.895, 0.893], [-0.7, 0.9085], [-0.5, 0.913], [-0.44, 0.9105]];
/** Höhe der Armaturenbrett-Oberseite (zum Aufstellen von OMI, Wackel-Elsa und Stream-Technik). */
export function dashTopY(x, z) {
  const zz = clamp(z, DASH_TOP[0][0], DASH_TOP[DASH_TOP.length - 1][0]);
  let y = DASH_TOP[0][1];
  for (let i = 0; i < DASH_TOP.length - 1; i++) {
    const [z0, y0] = DASH_TOP[i];
    const [z1, y1] = DASH_TOP[i + 1];
    if (zz >= z0 && zz <= z1) y = lerp(y0, y1, (zz - z0) / (z1 - z0));
  }
  return y - crown(x);
}

// Höhen an der Stirnseite (gelten auch für die Türen, dort läuft die Holzleiste weiter)
export const WOOD_Y = [0.777, 0.8275];
const SLIT_Y = [0.8285, 0.848];
const DASH_FACE_Z = -0.3985;

/** Weicher Schattenfleck auf einer waagerechten Fläche. */
export function blob(S, x, y, z, rx, rz = rx, rot = 0) {
  const g = new THREE.PlaneGeometry(rx * 2, rz * 2);
  g.rotateX(-Math.PI / 2);
  if (rot) g.rotateY(rot);
  g.translate(x, y + 0.0012, z);
  S.shadow.push(prep(g, 0xffffff, { uv: 'keep' }));
}

/** Rechteck mit einer Atlas-Kachel (liegt in der xy-Ebene, Vorderseite +z). */
export function labelQuad(w, h, tile) {
  const g = new THREE.PlaneGeometry(w, h);
  const [u0, v0, u1, v1] = tileUV(tile);
  const uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, lerp(u0, u1, uv.getX(i)), lerp(v0, v1, uv.getY(i)));
  return g;
}

function buildDash(S) {
  const xs = [];
  for (let i = 0; i <= 32; i++) xs.push(-0.8 + (1.6 * i) / 32);
  const rowsOf = (profile) => xs.map((x) => profile.map(([z, y]) => v3(x, y - crown(x) * smoothstep(0.855, 0.9, y), z)));
  // oberes Polster: flach ansteigend, hinten weich abgerollt, darunter die Lippe über dem Luftschlitz
  const padProfile = fillet([
    [-0.97, 0.866], [-0.895, 0.893, 0.03], [-0.7, 0.9085, 0.25], [-0.5, 0.913, 0.12], [-0.398, 0.902, 0.036],
    [DASH_FACE_Z, SLIT_Y[1], 0.004], [-0.44, SLIT_Y[1]],
  ], 6);
  S.soft.push(prep(skin(rowsOf(padProfile), { face: v3(0, 1.3, 0.2) }), PAL.pad, {
    // unter der Rolle und zur Scheibe hin etwas dunkler (dort fällt weniger Himmelslicht hin)
    shade: (p) => (0.62 + 0.38 * smoothstep(0.85, 0.9, p.y)) * (0.86 + 0.14 * smoothstep(-0.93, -0.7, p.z)),
    uv: 'keep',
  }));
  // Luftschlitz: echte Fuge, innen nach hinten dunkler (die Lamellen sitzen unsichtbar tief drin)
  const slit = [[-0.44, SLIT_Y[1]], [-0.44, SLIT_Y[0]], [-0.39, SLIT_Y[0]]];
  S.soft.push(prep(skin(rowsOf(slit), { face: v3(0, 0.84, 0.5) }), 0x202226, { shade: (p) => 0.18 + 0.82 * smoothstep(-0.44, -0.4, p.z), uv: 'keep' }));
  // Holzleiste mit feiner heller Kante
  const wood = fillet([[-0.42, WOOD_Y[1]], [-0.3972, WOOD_Y[1], 0.003], [-0.392, WOOD_Y[0], 0.003], [-0.42, WOOD_Y[0]]], 3);
  S.wood.push(prep(skin(wood.map(([z, y]) => [-0.8, 0.8].map((x) => v3(x, y, z))), { face: v3(0, 0.8, 1) }), 0xffffff, { uv: 'keep' }));
  S.satin.push(prep(tube([v3(-0.8, WOOD_Y[1] + 0.0006, -0.3966), v3(0.8, WOOD_Y[1] + 0.0006, -0.3966)], 0.0015, { radial: 6, step: 0.4 }), PAL.satin));
  // unteres Armaturenbrett: rollt unter der Leiste nach vorne weg (zu den Knien hin dunkler). Die Unterseite
  // bekommt nur Streulicht vom Boden; aufgehellt bleibt sie dunkles Anthrazit statt schwarz.
  const lower = fillet([
    [-0.42, 0.7745], [-0.393, 0.7745, 0.003], [-0.372, 0.705, 0.045], [-0.39, 0.6, 0.07], [-0.5, 0.49, 0.09], [-0.66, 0.44, 0.05], [-0.82, 0.43],
  ], 6);
  S.soft.push(prep(skin(rowsOf(lower), { face: v3(0, 0.6, 1) }), PAL.padLow, {
    shade: (p, n) => (0.55 + 0.45 * smoothstep(0.45, 0.76, p.y)) * (1 + 1.6 * clamp(-n.y, 0, 1)),
    uv: 'keep',
  }));
  // Fuge des Handschuhfachs (Beifahrerseite): schmale dunkle Linie auf dem unteren Polster
  const gz = (y) => lerp(-0.378, -0.386, (0.74 - y) / 0.1) + 0.0006;
  const groove = [v3(0.24, 0.74, gz(0.74)), v3(0.7, 0.74, gz(0.74)), v3(0.7, 0.64, gz(0.64)), v3(0.24, 0.64, gz(0.64))];
  S.soft.push(prep(tube(groove, 0.0016, { radial: 5, closed: true, tension: 0.05, step: 0.02 }), 0x101113));
  // Steppnaht vorn auf dem oberen Polster, kurz vor der Rolle
  const sp = [];
  const sn = [];
  for (let i = 0; i <= 80; i++) {
    const x = -0.775 + (1.55 * i) / 80;
    sp.push(v3(x, dashTopY(x, -0.462), -0.462));
    sn.push(v3(0, 1, 0));
  }
  // Faden nur wenig heller als das Polster: aus der Fahrerposition eine feine Linie, keine Fahrbahnmarkierung
  S.soft.push(...stitches(sp, sn, { len: 0.0068, gap: 0.0042, w: 0.0011, h: 0.00055, color: 0x6b6d72 }));
  // Lautsprecher- und Entfrosterstreifen am Scheibenfuß: Lochgitter in schmalem Rahmen
  const gx0 = -0.66;
  const gx1 = 0.66;
  const gz0 = -0.872;
  const gz1 = -0.818;
  const gridRows = [gz0, gz1].map((z) => {
    const row = [];
    for (let i = 0; i <= 30; i++) {
      const x = lerp(gx0, gx1, i / 30);
      row.push(v3(x, dashTopY(x, z) + 0.0009, z));
    }
    return row;
  });
  S.perf.push(prep(skin(gridRows, { face: v3(0, 2, 0) }), 0x6a6d74, { uv: 90 }));
  const frame = [];
  for (let i = 0; i <= 24; i++) frame.push(v3(lerp(gx0, gx1, i / 24), 0, gz1));
  for (let i = 0; i <= 24; i++) frame.push(v3(lerp(gx1, gx0, i / 24), 0, gz0));
  for (const p of frame) p.y = dashTopY(p.x, p.z) + 0.001;
  S.soft.push(prep(tube(frame, 0.0026, { radial: 6, closed: true, tension: 0.12, step: 0.03 }), 0x24262a));
  // Abschluss nach unten: Spritzwand im Fußraum, mit Teppich bezogen wie der Boden
  S.soft.push(prep(place(new THREE.PlaneGeometry(1.7, 0.3), 0, 0.37, -0.8), PAL.carpet));
}

// A-Säulen: Mittellinie entlang des Scheibenrands (t = 0 unten … 1 oben). Querschnitt wie eine bezogene
// Verkleidung, kein Rohr: zur Scheibenmitte hin schmal (ai), zum Seitenfenster hin breiter (ao, bis an Tür und
// Spiegeldreieck), zum Innenraum flach gewölbt (Tiefe b); die Rückseite liegt flach an der Scheibe (FLAT: Anteil
// der Tiefe dahinter). Nach oben deutlich schmaler: dort ist die Säule dem Auge dreimal so nah.
const pillarSec = (t) => [lerp(0.028, 0.017, t ** 0.85), lerp(0.044, 0.024, t), lerp(0.021, 0.0152, t)];
const PILLAR_FLAT = 0.3;
const PILLAR_E = 2.8;
function pillarCenter(W, s, t) {
  const p = W.base.clone().addScaledVector(W.U, -0.06 + t * (W.length + 0.11)).addScaledVector(W.N, -0.0085);
  p.x = s * lerp(0.76, 0.634, t);
  return p;
}
/** Querschnitt-Achsen wie bei sweep: X quer (≈ −x), Y zum Innenraum (≈ −N). */
function pillarFrame(W, s) {
  const T = W.U.clone().multiplyScalar(W.length + 0.11).setX(s * (0.634 - 0.76)).normalize();
  const X = W.N.clone().negate().cross(T).normalize();
  return { X, Y: T.cross(X) };
}
/** Querschnitt der A-Säule als Ring für sweep (x zur Scheibenmitte hin gespiegelt, Umlaufsinn bleibt). */
function pillarRing(t, s, seg = 20) {
  const [ai, ao, b] = pillarSec(t);
  const pts = [];
  for (let k = 0; k < seg; k++) {
    const th = (k / seg) * Math.PI * 2;
    const c = Math.cos(th);
    const sn = Math.sin(th);
    const x = (c >= 0 ? ai : ao) * Math.sign(c) * Math.abs(c) ** (2 / PILLAR_E);
    const y = (sn >= 0 ? b : b * PILLAR_FLAT) * Math.sign(sn) * Math.abs(sn) ** (2 / PILLAR_E);
    pts.push([s * x, y]);
  }
  return s > 0 ? pts : [pts[0], ...pts.slice(1).reverse()];
}

/**
 * Punkt auf der Oberfläche der A-Säule (Seite s, t längs, th Winkel im Querschnitt: 0 zur Scheibenmitte hin,
 * π/2 in den Innenraum, π zum Seitenfenster), lift nach außen abgehoben. Für Kabel, Clips und den Hochtöner.
 */
export function pillarPoint(W, s, t, th, lift = 0) {
  const { X, Y } = pillarFrame(W, s);
  const [ai, ao, b0] = pillarSec(t);
  const c = Math.cos(th);
  const sn = Math.sin(th);
  const a = c >= 0 ? ai : ao;
  const b = sn >= 0 ? b0 : b0 * PILLAR_FLAT;
  const rad = (Math.abs(c / a) ** PILLAR_E + Math.abs(sn / b) ** PILLAR_E) ** (-1 / PILLAR_E) + lift;
  return pillarCenter(W, s, t).addScaledVector(X, s * c * rad).addScaledVector(Y, sn * rad);
}

function buildPillars(S, W) {
  for (const s of [-1, 1]) {
    // A-Säule: schlank, nach oben verjüngt, mit Stoff bezogen; liegt flach an der Scheibe und deckt deren Rand ab.
    const path = [];
    for (let i = 0; i <= 16; i++) path.push(pillarCenter(W, s, i / 16));
    // Die zum Innenraum gewandten Flächen fangen Licht aus Seiten- und Heckfenster (sonst wirkt die Säule wie ein
    // schwarzer Balken); zur Scheibe hin und am Fuß, wo sie im Armaturenbrett verschwindet, dunkler
    S.cloth.push(prep(sweep(path, (t) => pillarRing(t, s, 20), { up: W.N.clone().negate() }), PAL.cloth, {
      shade: (p, n) => {
        const k = clamp(0.55 - 0.6 * n.dot(W.N), 0, 1);
        return (0.85 + 0.85 * k) * (0.72 + 0.28 * smoothstep(0.88, 1.0, p.y));
      },
      uv: 'keep',
    }));
    // Hochtöner im Säulenfuß: flaches ovales Lochgitter, leicht eingelassen, mit dunklem Rand – zum Fahrer hin
    // gedreht (th: Winkel im Säulenquerschnitt, 0 = zur Scheibenmitte, π/2 = in den Innenraum)
    const th0 = s < 0 ? 0.95 : 0.8;
    const T0 = 0.2;
    const pod = (k, r, lift) => {
      const a = (k / 24) * Math.PI * 2;
      return pillarPoint(W, s, T0 + 0.04 * r * Math.cos(a), th0 + 0.48 * r * Math.sin(a), lift);
    };
    const grille = [];
    for (let i = 0; i <= 4; i++) {
      const row = [];
      const r = i / 4;
      for (let k = 0; k <= 24; k++) row.push(pod(k, r, 0.0009 + 0.0005 * Math.cos(r * 1.4)));
      grille.push(row);
    }
    S.perf.push(prep(skin(grille, { face: INSIDE }), 0x7c7f86, { uv: 120 }));
    const rim = [];
    for (let k = 0; k < 24; k++) rim.push(pod(k, 1.03, 0.0004));
    S.soft.push(prep(tube(rim, 0.0018, { radial: 6, closed: true, tension: 0.3, step: 0.007 }), 0x2a2c31));
    // Dachholm: von der A-Säule über die Türen bis zur C-Säule
    const rail = [v3(s * 0.636, 1.4, -0.07), v3(s * 0.655, 1.412, 0.2), v3(s * 0.668, 1.418, 0.62), v3(s * 0.664, 1.412, 1.05), v3(s * 0.648, 1.392, 1.42)];
    const railPath = new THREE.CatmullRomCurve3(rail).getPoints(24);
    S.cloth.push(prep(sweep(railPath, () => ring(0.042, 0.03, 12, 2.6), { up: v3(0, 1, 0) }), PAL.cloth, { uv: 'keep' }));
    // B-Säule oberhalb der Gürtellinie
    const bp = [v3(s * 0.784, 0.97, 0.66), v3(s * 0.742, 1.15, 0.652), v3(s * 0.7, 1.3, 0.644), v3(s * 0.668, 1.415, 0.638)];
    S.cloth.push(prep(sweep(new THREE.CatmullRomCurve3(bp).getPoints(10), () => ring(0.026, 0.056, 14, 3.2), { up: v3(0, 0, 1) }), PAL.cloth, { uv: 'keep' }));
    // C-Säule: breit, vom Dachholm hinunter zur Hutablage
    const cp = [v3(s * 0.648, 1.392, 1.42), v3(s * 0.69, 1.25, 1.62), v3(s * 0.73, 1.05, 1.86)];
    S.cloth.push(prep(sweep(new THREE.CatmullRomCurve3(cp).getPoints(8), () => ring(0.04, 0.13, 12, 3), { up: v3(0, 0, 1) }), PAL.cloth, { uv: 'keep' }));
    // Spiegeldreieck vorn unten im Seitenfenster (dort sitzt außen der Spiegelfuß)
    const tri = new THREE.Shape();
    tri.moveTo(-0.745, 0.985);
    tri.lineTo(-0.5, 0.985);
    tri.quadraticCurveTo(-0.53, 1.03, -0.588, 1.07);
    tri.quadraticCurveTo(-0.605, 1.08, -0.622, 1.064);
    tri.lineTo(-0.745, 0.985);
    const sail = new THREE.ExtrudeGeometry(tri, { depth: 0.022, bevelEnabled: true, bevelSize: 0.005, bevelThickness: 0.005, bevelSegments: 2, curveSegments: 8 });
    // Form liegt in (z, y): in die Fahrzeugebene drehen, Dicke nach außen
    sail.applyMatrix4(new THREE.Matrix4().makeBasis(v3(0, 0, 1), v3(0, 1, 0), v3(-1, 0, 0)));
    if (s > 0) sail.scale(-1, 1, 1);
    sail.translate(s * 0.772, 0, 0);
    if (s > 0) flipWinding(sail);
    // nach oben einwärts geneigt wie das Seitenfenster: Die Spitze liegt so an der Säule an (sonst sieht man
    // zwischen Dreieck und Säule durch einen Spalt nach draußen)
    const lean = -s * 0.24;
    sail.applyMatrix4(new THREE.Matrix4().set(1, lean, 0, -lean * 0.985, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1));
    S.soft.push(prep(sail, 0x26282c));
    // Fensterrahmen der Tür: schmale Gummidichtung rund ums Seitenfenster – hinter dem Spiegeldreieck hinauf, an
    // der Außenkante der A-Säule entlang, unter dem Dachholm nach hinten und an der B-Säule hinunter bis zur
    // Schachtdichtung der Tür
    const sailEdge = (u) => {
      const z = (1 - u) ** 2 * -0.5 + 2 * u * (1 - u) * -0.53 + u * u * -0.588;
      const y = (1 - u) ** 2 * 0.985 + 2 * u * (1 - u) * 1.03 + u * u * 1.07;
      return v3(s * (0.783 - 0.24 * (y - 0.985)), y + 0.003, z + 0.004);
    };
    const seal = [v3(s * 0.7955, 1.006, -0.49)];
    for (const u of [0.3, 0.55, 0.8, 1]) seal.push(sailEdge(u));
    for (const t of [0.43, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95]) seal.push(pillarPoint(W, s, t, Math.PI, 0.003));
    seal.push(v3(s * 0.674, 1.375, -0.05), v3(s * 0.69, 1.386, 0.2), v3(s * 0.7, 1.39, 0.45));
    seal.push(v3(s * 0.69, 1.37, 0.584), v3(s * 0.712, 1.3, 0.588), v3(s * 0.753, 1.15, 0.596), v3(s * 0.788, 1.006, 0.6));
    S.soft.push(prep(tube(seal, 0.0045, { radial: 6, tension: 0.3, step: 0.035 }), PAL.rubber));
  }
  // Dachrahmen über der Scheibe: gepolstert, in der Mitte leicht nach oben gewölbt. Unterseite und Rückseite
  // aufgehellt wie bei den A-Säulen, in die er übergeht (bei 4:3 und hochkant liegt er als Band am oberen Bildrand)
  const header = [];
  for (let i = 0; i <= 16; i++) {
    const x = -0.67 + (1.34 * i) / 16;
    header.push(v3(x, 1.4 + 0.012 * (1 - (x / 0.67) ** 2), -0.07));
  }
  S.cloth.push(prep(sweep(header, () => ring(0.075, 0.034, 14, 3), { up: v3(0, 1, 0) }), PAL.cloth, {
    shade: (p, n) => 0.85 + 0.85 * clamp(0.55 - 0.6 * n.dot(W.N), 0, 1),
    uv: 'keep',
  }));
  // Dachhimmel zwischen Rahmen und Glasdach, daran die beiden hochgeklappten Sonnenblenden mit Halter und Clip.
  // Was nach unten zeigt, bekommt (wie der Rahmen) das Streulicht aus dem Innenraum dazu.
  const lift = { shade: (p, n) => 1 + 0.6 * clamp(-n.y, 0, 1), uv: 1 };
  S.cloth.push(prep(place(pillow(1.3, 0.03, 0.24, 0.012, 0, 4), 0, 1.4, 0.09), PAL.cloth, lift));
  for (const s of [-1, 1]) {
    // Blende hochgeklappt: unten die Spiegelseite mit dem Deckel des Make-up-Spiegels und einer Steppnaht rundum
    const M = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0.09, 0, -s * 0.012)).setPosition(s * 0.36, 1.371, 0.078);
    S.cloth.push(prep(pillow(0.36, 0.02, 0.15, 0.009, [0, 0.002, 0], 4).applyMatrix4(M), PAL.insert, lift));
    S.cloth.push(prep(place(pillow(0.15, 0.003, 0.066, 0.0015, 0, 3), -s * 0.03, -0.013, 0.004).applyMatrix4(M), PAL.cloth, lift));
    // Unterseite der Blende (gewölbt wie das Kissen): y abhängig von x, z
    const under = (x, z) => -0.01 - 0.002 * (1 - (x / 0.18) ** 2) * (1 - (z / 0.075) ** 2);
    const seam = roundedRect(0.336, 0.126, 0.012).getSpacedPoints(120).map((q) => v3(q.x, under(q.x, q.y), q.y).applyMatrix4(M));
    const down = v3(0, -1, 0).transformDirection(M);
    S.cloth.push(...stitches(seam, seam.map(() => down), { len: 0.007, gap: 0.004, w: 0.0012, h: 0.0005, color: 0x8e8f93 }));
    const rod = new THREE.CylinderGeometry(0.0045, 0.0045, 0.37, 8);
    S.gloss.push(prep(place(rod, s * 0.36, 1.376, 0.004, 0, 0, Math.PI / 2), 0x2a2c30));
    S.gloss.push(prep(place(rbox(0.022, 0.014, 0.02, 0.004, 2), s * 0.172, 1.378, 0.006), 0x2a2c30));
    S.gloss.push(prep(place(rbox(0.03, 0.016, 0.024, 0.005, 2), s * 0.548, 1.381, 0.004), 0x2a2c30));
  }
  // hinterer Dachrahmen, Querträger zwischen den Glasflächen und Hutablage
  const rear = [];
  for (let i = 0; i <= 10; i++) rear.push(v3(-0.66 + 0.132 * i, 1.4 + 0.012 * (1 - ((-0.66 + 0.132 * i) / 0.66) ** 2), 1.44));
  S.cloth.push(prep(sweep(rear, () => ring(0.06, 0.03, 10, 3), { up: v3(0, 1, 0) }), PAL.cloth, { ...lift, uv: 'keep' }));
  const cross = [];
  for (let i = 0; i <= 10; i++) cross.push(v3(-0.68 + 0.136 * i, 1.425 + 0.012 * (1 - ((-0.68 + 0.136 * i) / 0.68) ** 2), 0.66));
  S.cloth.push(prep(sweep(cross, () => ring(0.05, 0.02, 10, 3), { up: v3(0, 1, 0) }), PAL.cloth, { ...lift, uv: 'keep' }));
  S.soft.push(prep(place(pillow(1.5, 0.04, 0.5, 0.015, 0, 4), 0, 1.03, 1.86), 0x26282c));
}

/** Dreht die Dreiecke einer (nicht indizierten oder indizierten) Geometrie um – nach dem Spiegeln nötig. */
function flipWinding(g) {
  if (g.index) {
    const a = g.index.array;
    for (let i = 0; i < a.length; i += 3) [a[i + 1], a[i + 2]] = [a[i + 2], a[i + 1]];
    return g;
  }
  for (const k of Object.keys(g.attributes)) {
    const at = g.attributes[k];
    const n = at.itemSize;
    const a = at.array;
    for (let i = 0; i < at.count; i += 3) {
      for (let c = 0; c < n; c++) {
        const t = a[(i + 1) * n + c];
        a[(i + 1) * n + c] = a[(i + 2) * n + c];
        a[(i + 2) * n + c] = t;
      }
    }
  }
  return g;
}

/** Spiegelt eine Geometrie an der Fahrzeugmitte (für die rechte Seite). */
export function mirrorX(g) {
  g.scale(-1, 1, 1);
  return flipWinding(g);
}

// --- Türen ---------------------------------------------------------------------------------
const DOOR_Z = [-0.96, 0.6];
const ARM = { z0: -0.03, z1: 0.6, top: 0.755, out: 0.085 };
/** Innenfläche der rechten Türverkleidung: x als Funktion von (z, y) – ein weiches Relief. */
function doorX(z, y) {
  // Grundform: unten etwas bauchiger, oben die runde Brüstung zur Scheibe hin
  let x = 0.763 - 0.016 * smoothstep(0.62, 0.42, y);
  const r = 0.03;
  const yc = 1.004 - r;
  if (y > yc) x += r - Math.sqrt(Math.max(0, r * r - (y - yc) ** 2));
  // Armlehne: gepolsterte Ablage, vorn rund auslaufend
  const az = smoothstep(ARM.z0 - 0.07, ARM.z0 + 0.06, z) * smoothstep(ARM.z1 + 0.05, ARM.z1 - 0.05, z);
  const ay = smoothstep(ARM.top + 0.012, ARM.top - 0.012, y) * (0.3 + 0.7 * smoothstep(0.6, 0.72, y)) * smoothstep(0.56, 0.62, y);
  x -= ARM.out * az * ay;
  // Zuziehmulde vor der Armlehne
  const gz = (z + 0.15) / 0.085;
  const gy = (y - 0.722) / 0.034;
  const gr = gz ** 4 + gy ** 4;
  if (gr < 1) x += 0.024 * (1 - gr) ** 0.6;
  // Kartentasche unten
  x -= 0.03 * smoothstep(0.505, 0.47, y) * smoothstep(-0.34, -0.24, z) * smoothstep(0.6, 0.52, z);
  return x;
}

function doorNormal(z, y, out) {
  const e = 0.002;
  const dxz = (doorX(z + e, y) - doorX(z - e, y)) / (2 * e);
  const dxy = (doorX(z, y + e) - doorX(z, y - e)) / (2 * e);
  return out.set(-1, dxy, dxz).normalize();
}

function buildDoor(S, s, W) {
  const M = (g) => (s > 0 ? g : mirrorX(g));
  const PILLAR_Z = (y) => pillarCenter(W, 1, (y - pillarCenter(W, 1, 0).y) / (pillarCenter(W, 1, 1).y - pillarCenter(W, 1, 0).y)).z;
  const face = v3(0, 0.8, 0.1);
  // Raster über (z, y), an Brüstung und Armlehne dichter
  const ys = [];
  for (let i = 0; i <= 6; i++) ys.push(lerp(0.29, 0.6, i / 6));
  for (let i = 1; i <= 16; i++) ys.push(lerp(0.6, 0.96, i / 16));
  for (let i = 1; i <= 5; i++) ys.push(lerp(0.96, 1.004, i / 5));
  // Vorderkante: unten am Armaturenbrett, darüber an der Rückseite der A-Säule entlang (sonst stünde die obere
  // Ecke vor der Säule und wäre durch die Frontscheibe als Flosse über der Motorhaube zu sehen)
  const front = (y) => Math.max(DOOR_Z[0], PILLAR_Z(y) + 0.012);
  const rows = ys.map((y) => {
    const z0 = front(y);
    const row = [];
    for (let i = 0; i <= 32; i++) {
      const z = lerp(z0, DOOR_Z[1], i / 32);
      row.push(v3(doorX(z, y), y, z));
    }
    return row;
  });
  const card = skin(rows, { face });
  S.soft.push(prep(M(card), PAL.door, {
    shade: (p) => {
      const z = p.z;
      const y = p.y;
      let f = 0.5 + 0.5 * smoothstep(0.32, 0.8, y);
      // Schatten unter der Armlehne, in der Mulde und oben in der Kartentasche
      f *= 1 - 0.45 * smoothstep(ARM.top - 0.03, ARM.top - 0.1, y) * smoothstep(0.58, 0.64, y) * smoothstep(ARM.z0 - 0.03, ARM.z0 + 0.06, z);
      const gr = ((z + 0.15) / 0.085) ** 4 + ((y - 0.722) / 0.034) ** 4;
      if (gr < 1) f *= 0.45 + 0.55 * gr;
      f *= 1 - 0.5 * smoothstep(0.47, 0.5, y) * smoothstep(0.53, 0.505, y) * smoothstep(-0.3, -0.24, z) * smoothstep(0.58, 0.52, z);
      return f;
    },
    uv: 'keep',
  }));
  const on = (z, y, lift = 0) => {
    const n = doorNormal(z, y, new V3());
    return v3(doorX(z, y), y, z).addScaledVector(n, lift);
  };
  // Stoffeinsatz im oberen Polster mit Keder ringsum: Rechteck mit denselben runden Ecken wie der Keder (sonst
  // stehen die Ecken des Stoffs unter dem Keder hervor). Die Tür ist hier eben, die Fläche braucht kein Raster.
  const iz0 = -0.37;
  const iz1 = 0.56;
  const iy0 = 0.868;
  const iy1 = 0.954;
  const rc = 0.02;
  // Form liegt in (z, y): gegen den Uhrzeigersinn umlaufen zeigt die Vorderseite nach −x, in den Innenraum
  const insert = new THREE.ShapeGeometry(roundedRect(iz1 - iz0, iy1 - iy0, rc), 6);
  const ip = insert.attributes.position;
  for (let i = 0; i < ip.count; i++) {
    const v = on(ip.getX(i) + (iz0 + iz1) / 2, ip.getY(i) + (iy0 + iy1) / 2, 0.0016);
    ip.setXYZ(i, v.x, v.y, v.z);
  }
  insert.computeVertexNormals();
  S.cloth.push(prep(M(insert), PAL.insert, { uv: 'keep' }));
  const piping = [];
  const corner = (cz, cy, a0) => {
    for (let k = 0; k <= 5; k++) {
      const a = a0 + (k / 5) * (Math.PI / 2);
      piping.push(on(cz + Math.cos(a) * rc, cy + Math.sin(a) * rc, 0.002));
    }
  };
  corner(iz1 - rc, iy1 - rc, 0);
  for (let i = 1; i < 16; i++) piping.push(on(lerp(iz1 - rc, iz0 + rc, i / 16), iy1, 0.002));
  corner(iz0 + rc, iy1 - rc, Math.PI / 2);
  corner(iz0 + rc, iy0 + rc, Math.PI);
  for (let i = 1; i < 16; i++) piping.push(on(lerp(iz0 + rc, iz1 - rc, i / 16), iy0, 0.002));
  corner(iz1 - rc, iy0 + rc, Math.PI * 1.5);
  S.cloth.push(prep(M(tube(piping, 0.0028, { radial: 6, closed: true, tension: 0.3, step: 0.05 })), 0x30333a));
  // Holzleiste läuft vom Armaturenbrett in die Tür weiter, mit derselben hellen Kante
  const wz0 = DASH_FACE_Z + 0.005;
  const wz1 = 0.56;
  const wrows = [];
  for (const [y, lift] of [[WOOD_Y[0] - 0.0015, 0], [WOOD_Y[0], 0.003], [WOOD_Y[1], 0.003], [WOOD_Y[1] + 0.0015, 0]]) {
    const row = [];
    for (let i = 0; i <= 30; i++) row.push(on(lerp(wz0, wz1, i / 30), y, lift));
    wrows.push(row);
  }
  S.wood.push(prep(M(skin(wrows, { face })), 0xffffff, { uv: 'keep' }));
  const edge = [];
  for (let i = 0; i <= 30; i++) edge.push(on(lerp(wz0, wz1, i / 30), WOOD_Y[1] + 0.0008, 0.0032));
  S.satin.push(prep(M(tube(edge, 0.0015, { radial: 6, step: 0.03 })), PAL.satin));
  // rundes Ende der Leiste
  S.satin.push(prep(M(place(rbox(0.006, WOOD_Y[1] - WOOD_Y[0] + 0.004, 0.004, 0.0018), doorX(wz1, 0.8) - 0.0025, (WOOD_Y[0] + WOOD_Y[1]) / 2, wz1 + 0.002)), PAL.satin));
  // Lederauflage der Armlehne
  const pad = pillow(0.062, 0.016, 0.5, 0.007, [0, 0.004, 0], 7);
  S.leather.push(prep(M(place(pad, 0.714, ARM.top + 0.004, 0.32)), PAL.leather, { uv: 1 }));
  // Fensterheber: Schalterblock mit zwei Wippen vorn auf der Armlehne
  S.satin.push(prep(M(place(rbox(0.046, 0.006, 0.084, 0.0028), 0.716, ARM.top + 0.0015, 0.022)), 0x8d9197));
  for (const dz of [-0.019, 0.019]) {
    S.gloss.push(prep(M(place(rbox(0.03, 0.008, 0.028, 0.0035), 0.716, ARM.top + 0.006, 0.022 + dz, 0.12)), PAL.gloss));
    S.label.push(prep(M(place(labelQuad(0.02, 0.015, 'fenster').rotateX(-Math.PI / 2), 0.716, ARM.top + 0.0105, 0.022 + dz - 0.0006, 0.12)), 0xffffff, { uv: 'keep' }));
  }
  // runder Türöffner: Chromring, schwarzer Knopf mit Symbol
  {
    const p = on(-0.3, 0.735, 0);
    const n = doorNormal(-0.3, 0.735, new V3());
    const q = new THREE.Quaternion().setFromUnitVectors(v3(0, 1, 0), n);
    const m = new THREE.Matrix4().compose(p, q, v3(1, 1, 1));
    const ringG = lathe([[0, 0.0035], [0.013, 0.0035], [0.0165, 0.0045, 0.002], [0.019, 0.003, 0.002], [0.0195, 0]], 22, 2);
    S.satin.push(prep(M(ringG.applyMatrix4(m)), PAL.satin));
    const btn = lathe([[0, 0.0062], [0.0105, 0.0062, 0.003], [0.013, 0.004, 0.002], [0.013, 0.002]], 22, 2);
    S.gloss.push(prep(M(btn.applyMatrix4(m)), PAL.gloss));
    const icon = labelQuad(0.016, 0.016, 'tuer').rotateX(-Math.PI / 2).rotateY(Math.PI / 2);
    icon.translate(0, 0.0066, 0);
    S.label.push(prep(M(icon.applyMatrix4(m)), 0xffffff, { uv: 'keep' }));
  }
  // Lautsprecher vorn unten: rundes Lochgitter im Chromring
  {
    const z = -0.52;
    const y = 0.5;
    const p = on(z, y, 0.002);
    const n = doorNormal(z, y, new V3());
    const q = new THREE.Quaternion().setFromUnitVectors(v3(0, 0, 1), n);
    const m = new THREE.Matrix4().compose(p, q, v3(1, 1, 1));
    const disc = new THREE.SphereGeometry(0.16, 24, 6, 0, Math.PI * 2, 0, 0.44);
    disc.rotateX(Math.PI / 2);
    disc.translate(0, 0, -0.144);
    S.perf.push(prep(M(disc.applyMatrix4(m)), 0x5c5f66, { uv: 90 }));
    const rg = new THREE.TorusGeometry(0.0705, 0.0042, 6, 32);
    S.satin.push(prep(M(rg.applyMatrix4(m)), 0x8d9197));
  }
  // Einstiegsleiste unten
  S.satin.push(prep(M(place(rbox(0.03, 0.008, 1.0, 0.003), 0.77, 0.302, -0.1)), 0x6f7379));
  // Schachtdichtung: schmale Gummilippe an der Oberkante, dort taucht die Seitenscheibe ein (vorn steckt sie im
  // Spiegeldreieck)
  const lip = [];
  for (let i = 0; i <= 12; i++) lip.push(v3(doorX(0, 1.004) + 0.0035, 1.0045, lerp(-0.56, DOOR_Z[1], i / 12)));
  S.soft.push(prep(M(tube(lip, 0.0035, { radial: 6, step: 0.06 })), PAL.rubber));
  // Ziernaht auf der Brüstung, wie auf dem Armaturenbrett
  const sp = [];
  const sn = [];
  for (let i = 0; i <= 24; i++) {
    const z = lerp(-0.49, 0.56, i / 24);
    sp.push(on(z, 0.995));
    sn.push(doorNormal(z, 0.995, new V3()));
  }
  for (const g of stitches(sp, sn, { len: 0.0068, gap: 0.0042, w: 0.0011, h: 0.00055, color: 0x6b6d72 })) S.soft.push(M(g));
}

/** Türverkleidung hinten: gleiche Grundform, ohne Einbauten (man sieht sie nur im Vorbeischauen). */
function buildRearSide(S, s) {
  const ys = [];
  for (let i = 0; i <= 10; i++) ys.push(lerp(0.29, 0.96, i / 10));
  for (let i = 1; i <= 6; i++) ys.push(lerp(0.96, 1.004, i / 6));
  const zs = [0.6, 0.72, 1.0, 1.3, 1.6, 2.0];
  const rows = ys.map((y) => zs.map((z) => v3(doorX(-0.6, y), y, z)));
  const g = skin(rows, { face: v3(0, 0.8, 1.2) });
  S.soft.push(prep(s > 0 ? g : mirrorX(g), PAL.door, { shade: (p) => 0.5 + 0.5 * smoothstep(0.32, 0.8, p.y), uv: 'keep' }));
  // B-Säule unterhalb der Gürtellinie: flaches Band über dem Türspalt
  const band = pillow(0.03, 0.72, 0.12, 0.012, 0, 4);
  place(band, 0.768, 0.64, 0.66);
  S.soft.push(prep(s > 0 ? band : mirrorX(band), 0x2a2c31, { shade: (p) => 0.55 + 0.45 * smoothstep(0.32, 0.8, p.y) }));
}

// --- Boden, Pedale ------------------------------------------------------------------------------
function buildFloor(S) {
  const floor = new THREE.PlaneGeometry(1.64, 3.0);
  floor.rotateX(-Math.PI / 2);
  floor.translate(0, 0.3, 0.55);
  S.soft.push(prep(floor, PAL.carpet, { shade: (p) => 0.75 + 0.25 * smoothstep(-0.9, -0.2, p.z), uv: 2.2 }));
  // Rückwand hinter der Rückbank
  S.soft.push(prep(place(new THREE.PlaneGeometry(1.64, 0.76).rotateY(Math.PI), 0, 0.67, 1.99), 0x26282c));
  // Fußmatten vorn (mit Stickerei) – leicht erhaben, mit rundem Rand
  for (const s of [-1, 1]) {
    const mat = labelQuad(0.4, 0.44, 'matte').rotateX(-Math.PI / 2);
    place(mat, s * 0.39, 0.306, -0.3, 0, s > 0 ? 0 : 0);
    S.label.push(prep(mat, 0xffffff, { uv: 'keep' }));
    const rim = pillow(0.41, 0.01, 0.45, 0.005, 0, 3);
    S.soft.push(prep(place(rim, s * 0.39, 0.3005, -0.3), PAL.rubber));
  }
  // Pedale: breites Bremspedal, schmales Fahrpedal, Fußstütze links
  const pedal = (w, h, x, y, z, rx) => {
    S.soft.push(prep(place(pillow(w, h, 0.016, 0.007, [0, 0, 0.002], 4), x, y, z, rx), PAL.rubber));
    for (let i = -1; i <= 1; i++) {
      S.satin.push(prep(place(rbox(w * 0.78, 0.006, 0.004, 0.0018), 0, i * h * 0.26, 0.0085).applyMatrix4(new THREE.Matrix4().makeRotationX(rx)).translate(x, y, z), 0x8d9197));
    }
    S.gloss.push(prep(place(rbox(0.018, 0.018, 0.2, 0.006), x, y + 0.04, z - 0.09, rx - 0.5), 0x202226));
  };
  pedal(0.11, 0.07, -0.335, 0.47, -0.615, -0.5);
  pedal(0.052, 0.13, -0.2, 0.44, -0.6, -0.62);
  S.soft.push(prep(place(pillow(0.09, 0.19, 0.03, 0.012, 0, 4), -0.6, 0.41, -0.62, -0.7), 0x1e2023));
}

// --- Sitze -------------------------------------------------------------------------------------
/** Sitzfläche der Vordersitze: Mitte (y, z), Dicke h, Wölbung oben, Neigung um x (vorne höher). */
export const SEAT = { y: 0.53, z: 0.28, h: 0.1, puff: 0.012, tilt: 0.06 };

function buildSeat(S, x0, { cushions = false } = {}) {
  const ao = (p) => 0.55 + 0.45 * smoothstep(0.42, 0.75, p.y);
  // Sitzgestell mit Seitenblende
  S.soft.push(prep(place(pillow(0.5, 0.2, 0.52, 0.05, 0, 5), x0, 0.4, 0.3), 0x26282c, { shade: ao }));
  // Sitzfläche mit Seitenwangen
  S.leather.push(prep(place(pillow(0.4, SEAT.h, 0.5, 0.045, [0, SEAT.puff, 0.006], 7), x0, SEAT.y, SEAT.z, SEAT.tilt), PAL.leather, { shade: ao }));
  for (const s of [-1, 1]) {
    S.leather.push(prep(place(pillow(0.095, 0.1, 0.47, 0.045, [0.004, 0.006, 0.004], 5), x0 + s * 0.212, 0.555, 0.285, 0.06, 0, s * 0.18), PAL.leather, { shade: ao }));
  }
  // Lehne (oben nach hinten geneigt) mit Wangen, drei Steppnähten und Schulterpolster
  const back = new THREE.Matrix4().makeRotationX(0.24).setPosition(x0, 0.9, 0.615);
  const addBack = (g, color, slot = 'leather') => S[slot].push(prep(g.applyMatrix4(back), color, { shade: (p) => 0.7 + 0.3 * smoothstep(0.55, 0.9, p.y) }));
  addBack(pillow(0.4, 0.64, 0.11, 0.05, [0, 0.004, 0.014], 7), PAL.leather);
  for (const s of [-1, 1]) addBack(place(pillow(0.09, 0.56, 0.12, 0.045, [0.004, 0.004, 0.006], 5), s * 0.2, -0.03, -0.022, 0, -s * 0.2), PAL.leather);
  for (const y of [-0.12, 0.03, 0.18]) {
    const sp = [];
    const sn = [];
    for (let i = 0; i <= 12; i++) {
      const x = -0.14 + (0.28 * i) / 12;
      sp.push(v3(x, y, -0.055 - 0.014 * (1 - (x / 0.2) ** 2) * (1 - (y / 0.32) ** 2)));
      sn.push(v3(0, 0, -1));
    }
    for (const g of stitches(sp, sn, { len: 0.008, gap: 0.004, color: 0x8e8f93 })) S.leather.push(g.applyMatrix4(back));
  }
  // Kopfstütze auf zwei Stangen
  const head = new THREE.Matrix4().makeRotationX(0.16).setPosition(x0, 1.315, 0.71);
  S.leather.push(prep(pillow(0.25, 0.19, 0.1, 0.045, [0.004, 0.006, 0.01], 8).applyMatrix4(head), PAL.leather));
  for (const s of [-1, 1]) {
    S.satin.push(prep(place(new THREE.CylinderGeometry(0.006, 0.006, 0.1, 8), x0 + s * 0.06, 1.215, 0.7, 0.2), PAL.satin));
  }
  if (cushions) {
    // Mini Adam sitzt auf zwei Kissen, damit er übers Lenkrad schauen kann
    const disc = (r, h, y, color) => {
      const g = lathe([[0, -h / 2], [r - 0.02, -h / 2, 0.02], [r, 0, 0.03], [r - 0.02, h / 2, 0.02], [0, h / 2 + 0.006]], 24, 3);
      S.plush.push(prep(place(g, x0, y, 0.33), color, { uv: 3.3 }));
    };
    disc(0.2, 0.07, 0.618, 0xb0122b);
    disc(0.185, 0.068, 0.686, 0x1d4fa0);
  }
}

function buildRearBench(S) {
  const ao = (p) => 0.5 + 0.5 * smoothstep(0.42, 0.8, p.y);
  S.soft.push(prep(place(pillow(1.42, 0.2, 0.56, 0.05, 0, 4), 0, 0.4, 1.3), 0x26282c, { shade: ao }));
  S.leather.push(prep(place(pillow(1.36, 0.1, 0.54, 0.045, [0, 0.01, 0.005], 5), 0, 0.52, 1.28, 0.05), PAL.leather, { shade: ao }));
  S.leather.push(prep(place(pillow(1.36, 0.6, 0.12, 0.05, [0, 0.004, 0.012], 5), 0, 0.84, 1.62, 0.3), PAL.leather, { shade: ao }));
  for (const x of [-0.43, 0, 0.43]) {
    S.leather.push(prep(place(pillow(x ? 0.24 : 0.2, 0.16, 0.09, 0.04, 0.006, 3), x, 1.17, 1.74, 0.25), PAL.leather));
  }
}

// --- Mittelkonsole ---------------------------------------------------------------------------------
/** Becherhalter: Mitte der beiden Mulden (x, y Boden, z) – für Flasche und Dose. */
export const CUPS = [v3(-0.052, 0.578, 0.115), v3(0.052, 0.578, 0.115)];
const CUP_R = 0.041;

function buildConsole(S) {
  const ao = (p) => 0.5 + 0.5 * smoothstep(0.36, 0.62, p.y);
  // Sockel vom Fußraum bis zwischen die Sitze
  S.soft.push(prep(place(pillow(0.25, 0.3, 1.14, 0.035, 0, 6), 0, 0.43, 0.2), PAL.padLow, { shade: ao }));
  // vorn zieht sich die Konsole zum Armaturenbrett hoch
  S.soft.push(prep(place(pillow(0.25, 0.22, 0.2, 0.035, 0, 4), 0, 0.6, -0.33, 0.5), PAL.padLow, { shade: ao }));
  // Ladeschale für zwei Telefone: geneigte Gummimatte mit Mittelsteg, darauf die Schlüsselkarte
  const tray = new THREE.Matrix4().makeRotationX(0.42).setPosition(0, 0.655, -0.262);
  S.soft.push(prep(pillow(0.21, 0.014, 0.17, 0.006, 0, 4).applyMatrix4(tray), PAL.rubber));
  S.soft.push(prep(place(rbox(0.006, 0.01, 0.15, 0.003), 0, 0.011, 0).applyMatrix4(tray), 0x2b2d32));
  S.satin.push(prep(place(rbox(0.214, 0.006, 0.008, 0.003), 0, 0.006, 0.086).applyMatrix4(tray), 0x8d9197));
  S.gloss.push(prep(place(rbox(0.054, 0.0016, 0.086, 0.0007), 0.052, 0.0082, -0.005, 0, 0.12).applyMatrix4(tray), 0x17181b));
  S.label.push(prep(place(labelQuad(0.05, 0.03, 'karte').rotateX(-Math.PI / 2), 0.052, 0.0094, -0.005, 0, 0.12 + Math.PI / 2).applyMatrix4(tray), 0xffffff, { uv: 'keep' }));
  // Fachdeckel mit schmaler Zierleiste
  S.soft.push(prep(place(pillow(0.215, 0.07, 0.17, 0.014, [0, 0.002, 0], 5), 0, 0.607, -0.075), 0x26282c));
  S.satin.push(prep(place(rbox(0.19, 0.003, 0.006, 0.0014), 0, 0.6435, -0.004), 0x8d9197));
  // Becherhalter: Platte mit zwei echten Öffnungen, darunter dunkle Mulden
  const sh = new THREE.Shape();
  const w = 0.1075;
  const d = 0.085;
  const r = 0.016;
  sh.moveTo(-w + r, -d);
  sh.lineTo(w - r, -d);
  sh.quadraticCurveTo(w, -d, w, -d + r);
  sh.lineTo(w, d - r);
  sh.quadraticCurveTo(w, d, w - r, d);
  sh.lineTo(-w + r, d);
  sh.quadraticCurveTo(-w, d, -w, d - r);
  sh.lineTo(-w, -d + r);
  sh.quadraticCurveTo(-w, -d, -w + r, -d);
  for (const c of CUPS) {
    const h = new THREE.Path();
    h.absarc(c.x, -(c.z - 0.105), CUP_R, 0, Math.PI * 2, true);
    sh.holes.push(h);
  }
  const plate = new THREE.ExtrudeGeometry(sh, { depth: 0.064, bevelEnabled: true, bevelSize: 0.002, bevelThickness: 0.002, bevelSegments: 2, curveSegments: 14 });
  plate.rotateX(-Math.PI / 2);
  plate.translate(0, 0.578, 0.105);
  S.soft.push(prep(plate, 0x26282c, { shade: (p) => 0.35 + 0.65 * smoothstep(0.585, 0.642, p.y) }));
  for (const c of CUPS) {
    const floor = new THREE.CircleGeometry(CUP_R + 0.002, 24);
    floor.rotateX(-Math.PI / 2);
    S.soft.push(prep(place(floor, c.x, c.y + 0.0005, c.z), 0x0e0f11));
    S.satin.push(prep(place(new THREE.TorusGeometry(CUP_R + 0.0012, 0.0022, 6, 28).rotateX(Math.PI / 2), c.x, 0.6445, c.z), 0x8d9197));
  }
  // gepolsterte Mittelarmlehne
  S.soft.push(prep(place(pillow(0.215, 0.07, 0.53, 0.014, 0, 5), 0, 0.607, 0.465), 0x26282c));
  S.leather.push(prep(place(pillow(0.2, 0.06, 0.5, 0.024, [0, 0.008, 0], 8), 0, 0.672, 0.472), PAL.leather));
}

/**
 * Baut die ganze Kabine in die Sammellisten S. W = WINDSHIELD (Scheibenebene).
 */
export function buildCabin(S, W) {
  buildDash(S);
  buildPillars(S, W);
  for (const s of [-1, 1]) {
    buildDoor(S, s, W);
    buildRearSide(S, s);
  }
  buildFloor(S);
  buildSeat(S, -0.37, { cushions: true });
  buildSeat(S, 0.37);
  buildRearBench(S);
  buildConsole(S);
}

// --- Motorhaube -------------------------------------------------------------------------------------
// Durch den unteren Teil der Frontscheibe sieht man die schwarze Motorhaube bis zu ihrer Kuppe (vom Fahrerauge
// gut 12° unter der Waagerechten), dahinter beginnt die Straße. Form wie beim Außenmodell (tesla.js: topLine,
// halfWidth, Querschnitt als Superellipse). Sie beginnt unter dem Scheibenfuß und liegt weiter weg als die
// Wischer samt ihrer Leiste auf dem Glas.
const HOOD_TOP = curve1([[-2.345, 0.5], [-2.315, 0.56], [-2.245, 0.625], [-2.145, 0.675], [-1.895, 0.73], [-1.545, 0.79], [-1.145, 0.86], [-0.9, 0.886]]);
const HOOD_HALF = curve1([[-2.345, 0.6], [-2.265, 0.77], [-2.095, 0.86], [-1.745, 0.905], [-1.145, 0.925], [-0.9, 0.925]]);
const HOOD_N = 4.6;

function hoodPoint(z, phi) {
  const e = 2 / HOOD_N;
  const c = Math.cos(phi);
  const s = Math.sin(phi);
  const X = Math.sign(c) * Math.abs(c) ** e;
  const Y = Math.sign(s) * Math.abs(s) ** e;
  const b = 0.25;
  const t = HOOD_TOP(z);
  return v3(X * HOOD_HALF(z) * lerp(1, 0.9, Math.max(0, Y)), b + ((Y + 1) / 2) * (t - b), z);
}

export function buildHood(S) {
  const rows = [];
  for (let i = 0; i <= 24; i++) {
    const z = lerp(-0.9, -2.345, (i / 24) ** 0.8);
    const row = [];
    for (let j = 0; j <= 32; j++) row.push(hoodPoint(z, lerp(0.05, Math.PI - 0.05, j / 32)));
    rows.push(row);
  }
  // zur Scheibe hin etwas dunkler (dort liegt die Haube im Schatten von Scheibenfuß und Wischern)
  S.hood.push(prep(skin(rows, { face: v3(0, 3, -1.4) }), 0x0a0b0d, { shade: (p) => 0.6 + 0.4 * smoothstep(-0.9, -1.3, p.z), uv: 'keep' }));
}

/** Getöntes Glasdach (vorn und hinten, dazwischen der Querträger) und die Heckscheibe – eigenes, durchsichtiges Mesh. */
export function roofGlassGeometry() {
  const parts = [];
  for (const [z0, z1] of [[0.19, 0.64], [0.68, 1.42]]) {
    const rows = [];
    for (let j = 0; j <= 4; j++) {
      const z = lerp(z0, z1, j / 4);
      const row = [];
      for (let i = 0; i <= 8; i++) {
        const x = -0.66 + (1.32 * i) / 8;
        row.push(v3(x, 1.425 + 0.014 * (1 - (x / 0.66) ** 2) - 0.02 * ((z - 0.66) / 0.8) ** 2, z));
      }
      rows.push(row);
    }
    parts.push(prep(skin(rows, { face: INSIDE }), 0xffffff, { uv: 'keep' }));
  }
  const rear = [[1.42, 1.4], [2.02, 1.06]].map(([z, y]) => [v3(-0.66, y, z), v3(0.66, y, z)]);
  parts.push(prep(skin(rear, { face: INSIDE }), 0xffffff, { uv: 'keep' }));
  return parts;
}
