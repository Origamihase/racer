// Mini Adams Mitbringsel: Bananensaft und Dampfcola in den Becherhaltern, Megafon und Pandamütze auf dem
// Beifahrersitz. Kleine, runde Dinge in fröhlichen Farben – jedes hält einen Blick aus der Nähe aus.
// Alles landet in den Sammellisten der Kabine (siehe parts.js), also kein einziger zusätzlicher Zeichenaufruf.
import * as THREE from 'three';
import { lathe, place, prep, v3 } from './parts.js';
import { CUPS } from './cabin.js';
import { tileUV } from './cabinTextures.js';
import { smoothstep } from '../util.js';

const lerp = (a, b, t) => a + (b - a) * t;

/** Rundum-Etikett (offener Zylindermantel) mit einer Atlas-Kachel; die Kachelmitte zeigt nach +z. */
function wrapLabel(r, y0, y1, tile, seg = 32) {
  const g = new THREE.CylinderGeometry(r, r, y1 - y0, seg, 1, true);
  // CylinderGeometry: u = 0 bei +z, u = 0,5 bei −z → halbe Drehung, damit die Vorderseite nach +z schaut
  g.rotateY(Math.PI);
  g.translate(0, (y0 + y1) / 2, 0);
  const [u0, v0, u1, v1] = tileUV(tile);
  const uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, lerp(u0, u1, uv.getX(i)), lerp(v0, v1, uv.getY(i)));
  return g;
}

/** Riffeln rund um die y-Achse (Deckel, Griffe): Radius mit cos(n·Winkel) modulieren. */
function ribs(g, n, amount, yMin = -Infinity, yMax = Infinity) {
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    if (y < yMin || y > yMax) continue;
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const k = 1 + amount * Math.max(0, Math.cos(Math.atan2(x, z) * n));
    pos.setX(i, x * k);
    pos.setZ(i, z * k);
  }
  g.computeVertexNormals();
  return g;
}

/** Weicher Schattenfleck auf einer (leicht geneigten) Fläche: Mitte p, Halbachsen rx/rz, Neigung um x, Drehung um y. */
function tiltedBlob(S, p, rx, rz, tilt = 0, rot = 0) {
  const g = new THREE.PlaneGeometry(rx * 2, rz * 2);
  g.rotateX(-Math.PI / 2);
  if (rot) g.rotateY(rot);
  if (tilt) g.rotateX(tilt);
  g.translate(p.x, p.y + 0.0015, p.z);
  S.shadow.push(prep(g, 0xffffff, { uv: 'keep' }));
}

/** Bananensaft: runde Halbliterflasche mit gelbem Saft, grünem Riffeldeckel und Rundum-Etikett. */
function bottle(S, base, yaw) {
  const m = new THREE.Matrix4().makeRotationY(yaw).setPosition(base);
  const add = (slot, g, color, opts) => S[slot].push(prep(g.applyMatrix4(m), color, opts));
  const body = lathe([
    [0, 0.003], [0.023, 0, 0.004], [0.03, 0.005, 0.004], [0.0318, 0.026], [0.0318, 0.116], [0.0296, 0.131, 0.012],
    [0.019, 0.153, 0.01], [0.0122, 0.163, 0.004], [0.0122, 0.171], [0.0142, 0.1722, 0.0008], [0.0142, 0.1745], [0, 0.1745],
  ], 24, 3);
  // unten dunkler: dort steht die Flasche tief im Becherhalter
  add('gloss', body, 0xf3c53a, { shade: (p) => 0.55 + 0.45 * Math.min(1, Math.max(0, (p.y - base.y) / 0.07)), uv: 'keep' });
  add('label', wrapLabel(0.0322, 0.034, 0.108, 'saft'), 0xffffff, { uv: 'keep' });
  const cap = ribs(lathe([[0, 0.1735], [0.0148, 0.1735], [0.0152, 0.176, 0.001], [0.0152, 0.1905, 0.0016], [0, 0.1915]], 36, 2), 28, 0.035, 0.175, 0.1895);
  add('gloss', cap, 0x2f9e44, { uv: 'keep' });
}

/** Dampfcola: 0,33-l-Dose mit eingezogenem Deckel, Lasche und bedrucktem Mantel. */
function can(S, base, yaw) {
  const m = new THREE.Matrix4().makeRotationY(yaw).setPosition(base);
  const add = (slot, g, color, opts) => S[slot].push(prep(g.applyMatrix4(m), color, opts));
  const shell = lathe([
    [0, 0.006], [0.021, 0.001, 0.003], [0.0285, 0, 0.002], [0.0331, 0.011, 0.004], [0.0331, 0.101], [0.0278, 0.1115, 0.004],
    [0.0278, 0.1148, 0.0008], [0.0262, 0.1148, 0.0006], [0.0255, 0.1128], [0, 0.1128],
  ], 24, 3);
  add('satin', shell, 0xc4c8cf, { shade: (p) => 0.5 + 0.5 * Math.min(1, Math.max(0, (p.y - base.y) / 0.06)), uv: 'keep' });
  add('label', wrapLabel(0.0334, 0.0125, 0.0995, 'cola'), 0xffffff, { uv: 'keep' });
  // Lasche auf dem Deckel: flacher Ring mit Steg
  const tab = new THREE.TorusGeometry(0.0062, 0.0016, 4, 16);
  tab.scale(1, 1.35, 0.5);
  tab.rotateX(-Math.PI / 2);
  add('satin', place(tab, 0, 0.1138, 0.006), 0xb3b8c0);
  add('satin', place(new THREE.CylinderGeometry(0.0022, 0.0022, 0.0012, 10), 0, 0.1133, -0.0005), 0xa9aeb6);
}

/** Megafon: weißer Trichter mit rotem Rand, dunkler Lautsprecher, Pistolengriff mit rotem Auslöser. */
export function megaphone(S, m) {
  const add = (slot, g, color, opts) => S[slot].push(prep(g.applyMatrix4(m), color, opts));
  // Trichter entlang +y: hinten das Mundstück-Gehäuse, vorn die Öffnung (innen eine zweite Wand)
  const horn = lathe([
    [0, -0.02], [0.022, -0.02, 0.006], [0.026, 0.0, 0.004], [0.03, 0.02], [0.068, 0.15, 0.004], [0.073, 0.158, 0.003],
    [0.071, 0.162, 0.002], [0.063, 0.156], [0.026, 0.035], [0, 0.03],
  ], 24, 3);
  // die Innenwand (Normale zur Achse hin) wird zum Lautsprecher hin dunkler: dort fällt kaum Licht hinein
  S.gloss.push(prep(horn, 0xf3f0ea, {
    shade: (p, n) => (p.x * n.x + p.z * n.z < 0 ? 0.38 + 0.6 * smoothstep(0.035, 0.155, p.y) : 1),
    uv: 'keep',
  }).applyMatrix4(m));
  // roter Wulst an der Öffnung und rotes Band hinten
  const rim = new THREE.TorusGeometry(0.0705, 0.0048, 8, 36);
  rim.rotateX(Math.PI / 2);
  add('gloss', place(rim, 0, 0.158, 0), 0xd8342c);
  add('gloss', lathe([[0.0262, -0.006], [0.0282, -0.004, 0.001], [0.0286, 0.012, 0.001], [0.0266, 0.014]], 28, 2), 0xd8342c);
  // Lautsprecher-Gitter tief im Trichter
  const grille = new THREE.CircleGeometry(0.03, 24);
  grille.rotateX(-Math.PI / 2);
  add('perf', place(grille, 0, 0.042, 0), 0x6a6d74, { uv: 260 });
  // Pistolengriff unter dem Gehäuse (zeigt nach −x im Megafon-Rahmen) mit Auslöser
  const grip = lathe([[0, 0], [0.0125, 0, 0.004], [0.0135, 0.04, 0.004], [0.0115, 0.075, 0.006], [0, 0.077]], 16, 2);
  grip.scale(1, 1, 0.75);
  add('gloss', place(grip, -0.018, 0.004, 0, 0, 0, Math.PI / 2 + 0.25), 0x2c2e33, { uv: 'keep' });
  add('gloss', place(new THREE.BoxGeometry(0.008, 0.016, 0.008), -0.034, 0.02, 0, 0, 0, 0.3), 0xd8342c);
}

/** Pandamütze: weiße Strickmütze mit Bündchen, schwarzen Ohren, Augenflecken, Näschen und rosa Bäckchen. */
function pandaHat(S, m) {
  const add = (slot, g, color, opts) => S[slot].push(prep(g.applyMatrix4(m), color, opts));
  const R = 0.082;
  // Kuppel (gestrickt: feine Rippen) und umgeschlagenes Bündchen
  const dome = ribs(lathe([[0.081, 0.03], [0.083, 0.06, 0.02], [0.07, 0.1, 0.03], [0.04, 0.122, 0.03], [0, 0.126]], 40, 4), 40, 0.012);
  add('plush', dome, 0xf4f1ea, { uv: 'keep' });
  const cuff = ribs(lathe([[0.077, 0.0], [0.0855, 0.002, 0.004], [0.0875, 0.016, 0.004], [0.0855, 0.032, 0.004], [0.078, 0.034], [0.074, 0.03], [0.074, 0.004]], 40, 2), 40, 0.02);
  add('plush', cuff, 0xe9e5dc, { uv: 'keep' });
  // Ohren: flache, runde Plüschscheiben, leicht nach außen gekippt
  for (const s of [-1, 1]) {
    const ear = new THREE.SphereGeometry(0.026, 14, 10);
    ear.scale(1, 1, 0.5);
    add('plush', place(ear, s * 0.056, 0.112, -0.004, 0, 0, -s * 0.5), 0x1d1e21, { uv: 30 });
  }
  // Gesicht vorn (+z): Augenflecken mit hellem Glanzpunkt, Näschen, Bäckchen
  const onDome = (ax, ay, lift) => {
    // Punkt auf der Kuppel in Kugelkoordinaten (ax: seitlich, ay: Höhe) – als einfache Kugel R angenähert
    const y = 0.032 + ay;
    const r = Math.sqrt(Math.max(0, R * R - (y - 0.032) ** 2 * 0.5)) + lift;
    return v3(Math.sin(ax) * r, y, Math.cos(ax) * r);
  };
  const patch = (ax, ay, w, h, color, slot = 'plush', lift = 0.0015, tilt = 0) => {
    const p = onDome(ax, ay, lift);
    const g = new THREE.SphereGeometry(1, 12, 7);
    g.scale(w, h, 0.004);
    g.rotateZ(tilt);
    g.rotateY(ax);
    add(slot, place(g, p.x, p.y, p.z), color, { uv: 'keep' });
  };
  for (const s of [-1, 1]) {
    patch(s * 0.33, 0.042, 0.0165, 0.021, 0x1d1e21, 'plush', 0.001, -s * 0.5);
    patch(s * 0.31, 0.046, 0.0045, 0.0045, 0xf7f5ef, 'gloss', 0.004);
    patch(s * 0.52, 0.02, 0.011, 0.007, 0xf0a6a6, 'plush', 0.0012);
  }
  patch(0, 0.02, 0.009, 0.006, 0x1d1e21, 'gloss', 0.002);
}

/**
 * Baut alle Mitbringsel in die Sammellisten. seat: Mitte und Neigung der Beifahrer-Sitzfläche
 * { x, y (Oberseite in der Mitte), z, tilt (um x, vorne höher) }.
 */
export function buildProps(S, seat) {
  // Flasche links, Dose rechts in den Becherhaltern (Etiketten schauen schräg nach hinten zur Mitte)
  bottle(S, CUPS[0].clone().setY(CUPS[0].y + 0.0006), 0.35);
  can(S, CUPS[1].clone().setY(CUPS[1].y + 0.0006), -0.5);
  // auf der Sitzfläche: Höhe folgt der Neigung (vorne höher)
  const top = (x, z) => v3(x, seat.y - (z - seat.z) * Math.tan(seat.tilt), z);
  // Megafon liegt auf der Seite, Öffnung nach vorn zur Mitte; die Unterkante des Trichters liegt auf
  const mp = top(seat.x - 0.02, seat.z - 0.03);
  const half = Math.atan2(0.068 - 0.03, 0.13); // halber Öffnungswinkel des Trichters
  const mm = new THREE.Matrix4().compose(
    mp.clone().add(v3(0, 0.07, 0)),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2 + seat.tilt + half * 0.9, -0.55, Math.PI / 2, 'YXZ')),
    v3(1, 1, 1),
  );
  megaphone(S, mm);
  tiltedBlob(S, mp.clone().add(v3(0, 0, 0.01)), 0.09, 0.06, seat.tilt, -0.55);
  // Pandamütze hinten rechts, Gesicht zur Fahrerseite
  const hp = top(seat.x + 0.07, seat.z + 0.13);
  const hm = new THREE.Matrix4().compose(hp, new THREE.Quaternion().setFromEuler(new THREE.Euler(seat.tilt, -0.9, 0, 'YXZ')), v3(1, 1, 1));
  pandaHat(S, hm);
  tiltedBlob(S, hp, 0.1, 0.1, seat.tilt);
}
