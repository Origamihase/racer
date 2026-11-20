// Innenraum des Außenmodells: was man von außen durch Frontscheibe, Seitenfenster und Glasdach sieht
// (Kameraschwenk beim Start, Drohne, Titelbild, Blitzerfoto). Dieselben Dinge wie im Cockpit, nur in groben
// Zügen: flaches Armaturenbrett mit Holzleiste, Bildschirm mit seinen Leisten, Lenkrad mit drei Speichen,
// Sitze mit Kopfstützen, Konsole mit Bananensaft und Dampfcola, Pandamütze und Megafon auf dem Beifahrersitz
// und die Stream-Technik (Action-Cam mit roter REC-Lampe, Facecam, Bonding-Box mit Antennen).
// Alles mit Vertexfarben in einem Mesh – ein Zeichenaufruf, dazu der Bildschirm und die REC-Lampe.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { W } from '../curve.js';
import { prep, pillow, rbox, lathe, place, skin, v3 } from '../cockpit/parts.js';

const C = {
  pad: 0x34363b,
  low: 0x26282c,
  leather: 0x2f3136,
  seat: 0x303237,
  carpet: 0x1e1f22,
  wood: 0x8a5631,
  satin: 0xb6bac0,
  piano: 0x101114,
  rubber: 0x1a1b1e,
};

/**
 * Mittelbildschirm von außen: nur die Aufteilung des echten Bildschirms (cockpit/screen.js) in dessen hellen
 * Farben – Fahrzeugspalte mit Tempo und Spuren, Kopfleiste, dunkle Symbolleiste. Keine Karte: Das Navi zeigt nur,
 * was die Welt wirklich hat, und ein Kartenbild hier hätte mit der Strecke nichts zu tun.
 */
function screenTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 156;
  const g = c.getContext('2d');
  // Kartenseite ohne Inhalt, oben die Kopfleiste mit Name und Uhrzeit als graue Zeilen
  g.fillStyle = '#eceef0';
  g.fillRect(0, 0, 256, 156);
  g.fillStyle = '#9097a1';
  g.fillRect(100, 5, 36, 3);
  g.fillRect(212, 5, 36, 3);
  // links die Fahrzeugspalte: Tempo oben, darunter drei Spuren mit dem eigenen Wagen
  g.fillStyle = '#f4f5f6';
  g.fillRect(0, 0, 93, 156);
  g.fillStyle = '#1d1f22';
  g.fillRect(12, 12, 30, 14);
  g.fillStyle = '#c3c7cc';
  for (const x of [22, 46, 70]) g.fillRect(x, 40, 2, 92);
  g.fillStyle = '#9aa0a8';
  g.fillRect(52, 98, 12, 22);
  // unten die dunkle Symbolleiste
  g.fillStyle = '#1b1c1f';
  g.fillRect(0, 140, 256, 16);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/**
 * ctx: { uToZ(u), bodyY(u, x): Höhe der Karosserie-Oberseite, open: Kabinenöffnung im Blech { u0, u1, x },
 * wheel: Object3D an der Lenkradmitte (Achse = lokales z) }.
 * Gibt { group, recLed } zurück; recLed ist die rote REC-Lampe vorn an der Action-Cam (blinkt in tesla.update).
 */
export function buildTeslaCabin({ uToZ, bodyY, open, wheel }) {
  const group = new THREE.Group();
  const parts = [];
  const add = (g, color, shade) => parts.push(prep(g, color, { shade, uv: 'keep' }));
  const at = (g, m) => g.applyMatrix4(m);

  // --- Wanne unter der Kabinenöffnung: Boden, Fußraum-Stirnwand, Türverkleidungen mit Holzleiste und
  // gepolstertem Sims auf der Blechkante (verdeckt die Schnittkante, von außen sieht man ihn durchs Seitenfenster)
  const z0 = uToZ(open.u0) - 0.06;
  const z1 = uToZ(open.u1) + 0.06;
  const WX = open.x + 0.03;
  add(skin([[v3(-WX, 0.28, z0), v3(WX, 0.28, z0)], [v3(-WX, 0.28, z1), v3(WX, 0.28, z1)]], { face: v3(0, 2, 0.5) }), C.carpet);
  add(skin([[v3(-WX, 0.28, -0.72), v3(WX, 0.28, -0.72)], [v3(-WX, 0.74, -0.72), v3(WX, 0.74, -0.72)]], { face: v3(0, 0.5, 1) }), C.low);
  const us = [];
  for (let u = open.u0 - 0.06; u <= open.u1 + 0.061; u += 0.06) us.push(u);
  for (const s of [-1, 1]) {
    add(skin(us.map((u) => [v3(s * WX, 0.28, uToZ(u)), v3(s * WX, bodyY(u, WX) - 0.004, uToZ(u))]), { face: v3(0, 0.6, 0.3) }), C.low, (p) => 0.55 + 0.45 * Math.min(1, Math.max(0, (p.y - 0.3) / 0.6)));
    add(place(rbox(0.012, 0.03, 1.2, 0.004), s * (WX - 0.006), 0.79, -0.08), C.wood);
    // Sims: liegt auf dem Blech zwischen Kabinenkante und Glas und hängt innen ein Stück über die Kante
    const rows = us.map((u) => {
      const z = uToZ(u);
      const yb = bodyY(u, open.x);
      return [
        v3(s * (open.x + 0.05), bodyY(u, open.x + 0.05) + 0.002, z),
        v3(s * (open.x + 0.01), yb + 0.012, z),
        v3(s * (open.x - 0.02), yb + 0.008, z),
        v3(s * (open.x - 0.028), yb - 0.004, z),
        v3(s * (open.x - 0.028), yb - 0.05, z),
      ];
    });
    add(skin(rows, { face: v3(0, 3, 0.3) }), C.pad);
  }

  // --- Armaturenbrett: oberes Polster, Luftschlitz, Holzleiste mit heller Kante, unteres Polster
  const DZ = -0.605;
  add(place(pillow(1.3, 0.09, 0.42, 0.035, [0, 0.006, 0], 5), 0, 0.835, DZ), C.pad, (p) => 0.75 + 0.25 * Math.min(1, Math.max(0, (p.y - 0.82) / 0.05)));
  add(place(pillow(1.24, 0.09, 0.36, 0.035, 0, 4), 0, 0.745, DZ + 0.03), C.low, (p) => 0.55 + 0.45 * Math.min(1, Math.max(0, (p.y - 0.7) / 0.08)));
  add(place(rbox(1.22, 0.008, 0.012, 0.003), 0, 0.81, -0.39), 0x0c0d0f);
  add(place(rbox(1.2, 0.034, 0.012, 0.004), 0, 0.785, -0.388), C.wood);
  add(place(rbox(1.2, 0.004, 0.013, 0.0015), 0, 0.8035, -0.387), C.satin);

  // --- Mittelbildschirm: Rahmen, Fuß, Facecam oben drauf (schaut zum Fahrer)
  const sm = new THREE.Matrix4().compose(new THREE.Vector3(0, 1.0, uToZ(1.93)), new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.2, 0, 0)), new THREE.Vector3(1, 1, 1));
  add(at(place(rbox(0.35, 0.216, 0.018, 0.008), 0, 0, -0.0095), sm), C.piano);
  add(at(place(new THREE.CylinderGeometry(0.018, 0.024, 0.13, 10), 0, -0.13, -0.03), sm), C.low);
  add(at(place(rbox(0.036, 0.022, 0.024, 0.006), 0, 0.119, -0.004), sm), 0x1d1f23);
  add(at(place(new THREE.CylinderGeometry(0.0075, 0.0075, 0.004, 12).rotateX(Math.PI / 2), 0, 0.119, 0.0085), sm), 0x0a1420);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.33, 0.2), W.basic({ map: screenTexture() }));
  screen.applyMatrix4(sm);
  screen.position.addScaledVector(new THREE.Vector3(0, 0, 1).applyEuler(screen.rotation), 0.0005);
  group.add(screen);

  // --- Action-Cam auf dem Armaturenbrett (Saugfuß), Linse und REC-Lampe nach vorn durch die Frontscheibe.
  // Außen steht sie tief und rechts vom Bildschirm, ohne Innenspiegel: Alles, was an der Scheibe auf Kopfhöhe
  // hinge, säße aus irgendeinem Blickwinkel vor Mini Adams großem Gesicht.
  const am = new THREE.Matrix4().compose(new THREE.Vector3(0.24, 0.885, -0.64), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0.12, 0)), new THREE.Vector3(1, 1, 1));
  add(at(new THREE.CylinderGeometry(0.02, 0.024, 0.008, 16).translate(0, 0.004, 0), am), C.rubber);
  add(at(new THREE.CylinderGeometry(0.0045, 0.0045, 0.024, 8).translate(0, 0.018, 0), am), C.satin);
  add(at(place(rbox(0.058, 0.04, 0.026, 0.007), 0, 0.05, 0), am), 0x26282d);
  add(at(place(lathe([[0, 0.012], [0.0128, 0.012], [0.0128, 0.003, 0.002], [0.009, 0]], 16), -0.011, 0.053, -0.013, -Math.PI / 2), am), 0x0d1a2c);
  const recLed = new THREE.Mesh(new THREE.SphereGeometry(0.0045, 10, 8), W.basic({ color: 0xff2a1e }));
  recLed.position.set(0.019, 0.062, -0.0135).applyMatrix4(am);
  group.add(recLed);

  // --- Bonding-Box auf dem Beifahrer-Armaturenbrett: gepolstert, drei Lämpchen, zwei Stummelantennen
  const em = new THREE.Matrix4().compose(new THREE.Vector3(0.42, 0.9, -0.58), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -0.6, 0)), new THREE.Vector3(1, 1, 1));
  add(at(pillow(0.15, 0.04, 0.09, 0.014, 0.003, 3), em), 0x2c2e33);
  [0x3ccf6a, 0x3ccf6a, 0xf0b23a].forEach((col, i) => add(at(place(new THREE.SphereGeometry(0.0035, 8, 6), -0.025 + i * 0.025, 0.017, 0.046), em), col));
  for (const s of [-1, 1]) add(at(place(new THREE.CylinderGeometry(0.0045, 0.006, 0.05, 8).translate(0, 0.025, 0), s * 0.06, 0.018, -0.03, 0.5, 0, -s * 0.3), em), C.rubber);

  // --- Lenkrad (Lage vom Aufrufer, an ihm hängen Mini Adams Hände): Kranz, Prallplatte, drei Speichen, Säule
  wheel.updateMatrix();
  const wm = wheel.matrix;
  add(at(new THREE.TorusGeometry(0.17, 0.024, 10, 40), wm), C.leather);
  add(at(place(rbox(0.11, 0.085, 0.034, 0.016), 0, -0.004, -0.012), wm), C.leather);
  for (const s of [-1, 1]) add(at(place(rbox(0.07, 0.024, 0.012, 0.005), s * 0.105, -0.006, -0.012), wm), C.low);
  add(at(place(rbox(0.024, 0.08, 0.012, 0.005), 0, -0.1, -0.012), wm), C.low);
  add(at(place(new THREE.CylinderGeometry(0.03, 0.036, 0.3, 10).rotateX(Math.PI / 2), 0, 0, -0.17), wm), C.low);

  // --- Sitze mit Kopfstützen (innen nicht weiter als |x| 0,52, siehe tesla.js), Rückbank, Konsole
  for (const s of [-1, 1]) {
    const x = s * 0.31;
    add(place(pillow(0.42, 0.12, 0.5, 0.04, [0, 0.01, 0], 4), x, 0.5, uToZ(2.72)), C.seat);
    add(place(pillow(0.42, 0.64, 0.12, 0.05, [0, 0, 0.01], 4), x, 0.86, uToZ(3.0), 0.2), C.seat, (p) => 0.8 + 0.2 * Math.min(1, Math.max(0, (p.y - 0.6) / 0.4)));
    add(place(pillow(0.27, 0.17, 0.1, 0.045, 0.006, 4), x, 1.24, uToZ(3.1), 0.1), C.seat);
  }
  add(place(pillow(1.36, 0.16, 0.5, 0.04, [0, 0.008, 0], 4), 0, 0.5, uToZ(3.62)), C.seat);
  add(place(pillow(1.12, 0.55, 0.12, 0.05, [0, 0, 0.01], 4), 0, 0.82, uToZ(3.92), 0.18), C.seat);
  add(place(pillow(0.22, 0.2, 0.8, 0.04, 0, 4), 0, 0.55, uToZ(2.6)), C.low);
  add(place(pillow(0.2, 0.05, 0.36, 0.02, [0, 0.006, 0], 4), 0, 0.665, uToZ(2.78)), C.leather);
  // Becherhalter mit Bananensaft (gelb, grüner Deckel) und Dampfcola (blau, Deckel silbern)
  const hz = uToZ(2.42);
  add(place(new THREE.CylinderGeometry(0.03, 0.03, 0.004, 14), -0.05, 0.652, hz), 0x111214);
  add(place(new THREE.CylinderGeometry(0.03, 0.03, 0.004, 14), 0.05, 0.652, hz), 0x111214);
  add(place(new THREE.CylinderGeometry(0.026, 0.026, 0.1, 12), -0.05, 0.69, hz), 0xf3c53a);
  add(place(new THREE.CylinderGeometry(0.012, 0.012, 0.018, 10), -0.05, 0.748, hz), 0x2f9e44);
  add(place(new THREE.CylinderGeometry(0.027, 0.027, 0.07, 12), 0.05, 0.68, hz), 0x1d2f6e);
  add(place(new THREE.CylinderGeometry(0.023, 0.027, 0.006, 12), 0.05, 0.718, hz), 0xc4c8cf);
  // Beifahrersitz: Pandamütze (weiß, schwarze Ohren) und Megafon (weißer Trichter, roter Rand)
  const sy = 0.566;
  const hat = new THREE.SphereGeometry(0.08, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  add(place(hat, 0.38, sy, uToZ(2.84)), 0xf4f1ea);
  add(place(new THREE.TorusGeometry(0.079, 0.012, 6, 20).rotateX(Math.PI / 2), 0.38, sy + 0.008, uToZ(2.84)), 0xe9e5dc);
  for (const s of [-1, 1]) add(place(new THREE.SphereGeometry(0.024, 8, 6).scale(1, 1, 0.55), 0.38 + s * 0.055, sy + 0.068, uToZ(2.84), 0, 0.9, -s * 0.5), 0x1d1e21);
  // das Megafon steht auf seinem Trichter, oben das rote Mundstück
  add(place(new THREE.CylinderGeometry(0.03, 0.068, 0.15, 16, 1, true), 0.25, sy + 0.075, uToZ(2.62)), 0xf3f0ea);
  add(place(new THREE.TorusGeometry(0.067, 0.007, 6, 22).rotateX(Math.PI / 2), 0.25, sy + 0.006, uToZ(2.62)), 0xd8342c);
  add(place(new THREE.CylinderGeometry(0.03, 0.031, 0.03, 16), 0.25, sy + 0.165, uToZ(2.62)), 0xd8342c);
  // (das Megafon sind die letzten Ecken des Meshes: Hat Mini Adam es in der Hand, zeichnet seatMegaphone sie nicht)
  const megaN = parts.slice(-3).reduce((n, g) => n + g.attributes.position.count, 0);
  const mesh = new THREE.Mesh(mergeGeometries(parts), W.std({ vertexColors: true, roughness: 0.78, metalness: 0.05 }));
  for (const g of parts) g.dispose();
  group.add(mesh);
  const seatMegaphone = (show) => mesh.geometry.setDrawRange(0, show ? Infinity : mesh.geometry.attributes.position.count - megaN);
  return { group, recLed, seatMegaphone };
}
