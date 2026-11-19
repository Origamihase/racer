// Das Lenkrad des Model 3 als Spielzeug: dicker, weicher Lederkranz mit Naht, flache Speichen mit den beiden
// Scrollrädern, eine gepolsterte Prallplatte mit dem weißen LIVE-Logo; dazu die Lenksäulenverkleidung mit
// Manschette am Armaturenbrett und die beiden Hebel mit runden Enden.
// Lenkrad-Koordinaten: Ursprung in der Mitte des Kranzes, x nach rechts, y zur 12-Uhr-Stellung, z zum Fahrer.
import * as THREE from 'three';
import { skin, ring, sweep, pillow, lathe, place, prep, roundedRect, v3 } from './parts.js';
import { PAL } from './cabin.js';

/**
 * Lage des Lenkrads (Fahrzeug-Koordinaten). Kleiner als beim Vorbild (Mini Adam ist klein) und so weit vorn,
 * dass der Kranz unter dem Scheibenfuß bleibt (keine Straße verdeckt) und die Prallplatte mit dem Logo bei
 * 16:9 und 21:9 ganz im Bild ist: Kranz-Oberkante −14,4° unter der Waagerechten, Nabe −29,4°.
 */
export const WHEEL = { c: new THREE.Vector3(-0.37, 0.885, -0.29), tilt: 0.55, R: 0.155, tr: 0.0182, td: 0.0208 };

/** Punkt auf dem Kranz: Winkel a ab 12 Uhr (im Uhrzeigersinn), Querschnitt (r radial, z zum Fahrer). */
function rimPoint(a, r, z) {
  const rr = WHEEL.R + r;
  return v3(Math.sin(a) * rr, Math.cos(a) * rr, z);
}

/** Gleicht die Normalen der ersten und letzten Reihe eines in sich geschlossenen Rings an (sonst sieht man die Naht). */
function closeLoop(g, m, nn) {
  const nor = g.attributes.normal;
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  for (let j = 0; j < nn; j++) {
    const k0 = j;
    const k1 = (m - 1) * nn + j;
    a.fromBufferAttribute(nor, k0).add(b.fromBufferAttribute(nor, k1)).normalize();
    nor.setXYZ(k0, a.x, a.y, a.z);
    nor.setXYZ(k1, a.x, a.y, a.z);
  }
  return g;
}

/** Querschnitt des Kranzes: weich gerundet, zum Fahrer etwas dicker. */
function rimSection(seg) {
  const { tr, td } = WHEEL;
  return ring(tr, td, seg, 2.3);
}

/**
 * Baut das Lenkrad in Sammellisten L (je Material, siehe Cockpit.MS): Kranz und Prallplatte aus Leder, Naht,
 * Speichen, Scrollräder, Logo (decal). Alles in Lenkrad-Koordinaten.
 */
export function buildWheelParts(L) {
  const { R } = WHEEL;
  // --- Kranz: geschlossener Ring aus Querschnitten
  const sec = rimSection(16);
  const rows = [];
  const N = 96;
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * Math.PI * 2;
    rows.push(sec.map(([r, z]) => rimPoint(a, r, z)));
  }
  const rim = closeLoop(skin(rows, { closed: true, flip: true }), rows.length, sec.length + 1);
  L.leather.push(prep(rim, PAL.leather, {
    // zur Nabe und nach hinten hin etwas dunkler (dort fällt weniger Licht hin)
    shade: (p, n) => {
      const out = (p.x * n.x + p.y * n.y) / Math.max(1e-6, Math.hypot(p.x, p.y));
      return 0.78 + 0.12 * out + 0.1 * Math.max(0, n.z);
    },
    uv: 'keep',
  }));
  // Naht: kurze Stiche auf der Fahrerseite an der Innenkante des Kranzes
  {
    const { tr, td } = WHEEL;
    const th = 2.2; // Winkel im Querschnitt (zur Nabe und zum Fahrer)
    const r0 = Math.cos(th) * tr * 1.02;
    const z0 = Math.sin(th) * td * 1.02;
    const n0 = v3(Math.cos(th) / tr, 0, Math.sin(th) / td).normalize();
    const M = 150;
    for (let i = 0; i < M; i++) {
      const a = ((i + 0.5) / M) * Math.PI * 2;
      const p = rimPoint(a, r0, z0);
      const t = v3(Math.cos(a), -Math.sin(a), 0);
      const nr = v3(Math.sin(a) * n0.x, Math.cos(a) * n0.x, n0.z);
      // flaches Stichrechteck knapp über dem Leder (rechtshändige Basis: Vorderseite zeigt nach außen)
      const b = v3().crossVectors(nr, t);
      const st = new THREE.PlaneGeometry(0.0042, 0.0012);
      st.applyMatrix4(new THREE.Matrix4().makeBasis(t, b, nr).setPosition(p.addScaledVector(nr, 0.0004)));
      L.soft.push(prep(st, PAL.thread));
    }
  }
  // --- Speichen: links und rechts flach, unten schmal; sie sitzen etwas hinter der Kranzmitte
  // Querschnitt: a quer zur Speiche in der Lenkradebene, b in der Tiefe (z)
  const spoke = (pts, wide, thick) => sweep(pts, (t) => ring(wide(t), thick(t), 14, 3.2), { up: v3(0, 0, 1) });
  for (const s of [-1, 1]) {
    const pts = [];
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      pts.push(v3(s * (0.046 + t * (R - 0.046 + 0.004)), -0.011 - 0.006 * t * t, 0.006 - 0.01 * t));
    }
    const g = spoke(pts, (t) => 0.0215 - 0.006 * t, () => 0.0085);
    L.soft.push(prep(g, PAL.spoke, { shade: (p, n) => 0.8 + 0.2 * Math.max(0, n.z), uv: 'keep' }));
    // Zierleiste in Satin entlang der Unterkante
    const trim = [];
    for (let i = 0; i <= 6; i++) {
      const t = 0.1 + (i / 6) * 0.78;
      trim.push(v3(s * (0.046 + t * (R - 0.046)), -0.011 - 0.006 * t * t - (0.0215 - 0.006 * t) + 0.0016, 0.0062 - 0.01 * t + 0.004));
    }
    L.satin.push(prep(sweep(trim, () => ring(0.0016, 0.0018, 8), { up: v3(0, 0, 1) }), PAL.satin));
    // Scrollrad in einer runden Mulde: Mulde (dunkel), Rad mit Riffeln (Klavierlack), Ring in Satin
    const cx = s * 0.093;
    const cy = -0.0122;
    // Vorderfläche der Speiche an dieser Stelle (Mittellinie + Dicke) plus etwas Luft, damit Mulde und Ring
    // auch dort aufliegen, wo die Speiche zum Kranz hin abfällt
    const cz = 0.006 - 0.01 * ((0.093 - 0.046) / (R - 0.042)) + 0.0085 + 0.0012;
    const well = lathe([[0, 0], [0.0102, 0], [0.0112, 0.0014, 0.0008], [0.0122, 0.0016]], 28);
    L.gloss.push(prep(place(well, cx, cy, cz - 0.0018, Math.PI / 2), PAL.deep));
    const ringG = new THREE.TorusGeometry(0.0115, 0.0011, 6, 32);
    L.satin.push(prep(place(ringG, cx, cy, cz), PAL.satin));
    // Rolle mit waagerechter Achse, die nur ein Stück aus der Mulde schaut; Riffeln rundherum
    const roll = lathe([[0, -0.0036], [0.0066, -0.0036, 0.0012], [0.0074, 0, 0.002], [0.0066, 0.0036, 0.0012], [0, 0.0036]], 36, 2);
    const pos = roll.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const k = 1 + 0.07 * Math.max(0, Math.cos(Math.atan2(x, z) * 18)) * Math.min(1, Math.hypot(x, z) / 0.0066);
      pos.setX(i, x * k);
      pos.setZ(i, z * k);
    }
    roll.computeVertexNormals();
    L.gloss.push(prep(place(roll, cx, cy, cz - 0.0042, 0, 0, Math.PI / 2), PAL.gloss));
  }
  // untere Speiche
  {
    const pts = [];
    for (let i = 0; i <= 6; i++) {
      const t = i / 6;
      pts.push(v3(0, -0.036 - t * (R - 0.036 + 0.004), 0.004 - 0.008 * t));
    }
    const g = spoke(pts, (t) => 0.0145 + 0.004 * t, () => 0.0085);
    L.soft.push(prep(g, PAL.spoke, { shade: (p, n) => 0.8 + 0.2 * Math.max(0, n.z), uv: 'keep' }));
  }
  // --- Prallplatte: weiches Kissen, vorn gewölbt; davor das Logo, das der Wölbung folgt
  const HW = 0.114;
  const HH = 0.088;
  const HD = 0.03;
  const HZ = 0.012;
  const PF = 0.0035;
  const HR = 0.018;
  const pad = pillow(HW, HH, HD, HR, [0.002, 0.002, PF], 10);
  L.leather.push(prep(place(pad, 0, -0.004, HZ), PAL.leather, { shade: (p, n) => 0.8 + 0.2 * Math.max(0, n.z), uv: 'keep' }));
  // Fuge zwischen Prallplatte und Speichenkreuz: flache Platte mit denselben runden Ecken wie das Kissen
  const gap = new THREE.ExtrudeGeometry(roundedRect(HW + 0.006, HH + 0.006, HR + 0.003), { depth: 0.01, bevelEnabled: false, curveSegments: 6 });
  L.gloss.push(prep(place(gap, 0, -0.004, HZ - HD / 2 - 0.004), PAL.deep));
  // Logo (Kachel „live“ im Decal-Atlas), ganz im flachen Teil des Kissens
  const LW = 0.056;
  const LH = 0.056;
  const logo = new THREE.PlaneGeometry(LW, LH, 10, 10);
  const lp = logo.attributes.position;
  const keep = (t) => Math.max(0, 1 - t * t);
  for (let i = 0; i < lp.count; i++) {
    const tx = lp.getX(i) / (HW / 2);
    const ty = (lp.getY(i) + 0.002) / (HH / 2);
    lp.setZ(i, PF * keep(tx) * keep(ty) + 0.0006);
  }
  logo.computeVertexNormals();
  return { logo: place(logo, 0, -0.002, HZ + HD / 2), pad: { HW, HH, HZ, HD } };
}

/**
 * Lenksäule: Verkleidung vom Lenkrad bis ins Armaturenbrett (dort mit gepolsterter Manschette) und die beiden
 * Hebel. In Fahrzeug-Koordinaten (dreht sich nicht mit).
 */
export function buildColumn(S) {
  const { c, tilt } = WHEEL;
  const ax = v3(0, Math.sin(tilt), Math.cos(tilt)); // zum Fahrer
  const m = new THREE.Matrix4().makeRotationX(-tilt).setPosition(c);
  // Verkleidung: von knapp hinter der Prallplatte bis 2 cm hinter die Stirnfläche
  const z0 = -0.032;
  const z1 = (-0.425 - c.z) / ax.z;
  const pts = [];
  for (let i = 0; i <= 10; i++) pts.push(v3(0, 0, z0 + (i / 10) * (z1 - z0)));
  const shroud = sweep(pts, (t) => ring(0.03 + 0.012 * t, 0.026 + 0.012 * t, 18, 2.6, 0, -0.004 - 0.006 * t), { up: v3(0, 1, 0) });
  S.soft.push(prep(shroud.applyMatrix4(m), PAL.padLow, { shade: (p, n) => 0.7 + 0.3 * Math.max(0, n.y), uv: 'keep' }));
  // Manschette, wo die Säule im Armaturenbrett verschwindet: weicher Wulst über den Fugen
  const entry = c.clone().addScaledVector(ax, (-0.3985 - c.z) / ax.z);
  const cuff = new THREE.TorusGeometry(0.047, 0.011, 10, 32);
  cuff.scale(1, 0.88, 1);
  const q = new THREE.Quaternion().setFromUnitVectors(v3(0, 0, 1), ax);
  cuff.applyQuaternion(q).translate(entry.x, entry.y - 0.006, entry.z + 0.004);
  S.leather.push(prep(cuff, PAL.leather, { uv: 'keep' }));
  const plate = new THREE.CircleGeometry(0.05, 32);
  plate.scale(1, 0.88, 1);
  plate.applyQuaternion(q).translate(entry.x, entry.y - 0.006, entry.z - 0.002);
  S.soft.push(prep(plate, PAL.padLow, { shade: () => 0.6 }));
  // Hebel: links Blinker/Wischer, rechts Gangwahl – leicht nach unten geneigt, mit runden Enden
  for (const s of [-1, 1]) {
    const base = v3(s * 0.03, -0.006, -0.052);
    const tip = v3(s * 0.118, -0.03, -0.046);
    const pts = [];
    for (let i = 0; i <= 6; i++) {
      const t = i / 6;
      pts.push(base.clone().lerp(tip, t).add(v3(0, -0.006 * Math.sin(Math.PI * t), 0)));
    }
    const stalk = sweep(pts, (t) => ring(0.0052 - 0.0012 * t, 0.0052 - 0.0012 * t, 12, 2), { up: v3(0, 1, 0) });
    S.gloss.push(prep(stalk.applyMatrix4(m), PAL.gloss));
    const knob = new THREE.SphereGeometry(0.0068, 16, 12);
    knob.scale(1.5, 1, 1);
    S.gloss.push(prep(place(knob, tip.x + s * 0.004, tip.y - 0.0003, tip.z).applyMatrix4(m), PAL.gloss));
    const band = new THREE.CylinderGeometry(0.0058, 0.0058, 0.004, 16);
    band.rotateZ(Math.PI / 2);
    S.satin.push(prep(place(band, tip.x - s * 0.008, tip.y + 0.0002, tip.z).applyMatrix4(m), PAL.satin));
  }
}
