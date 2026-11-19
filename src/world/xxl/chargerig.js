// Stecker und Kabel der Heldenbucht im Ladepark von Erlensee (siehe charge.js): In der Startszene steckt der Stecker in
// der Ladebuchse des Wagens, zieht sich heraus und kehrt in seinen Halter an der Säule zurück; danach hängt er dort wie
// alle anderen (kit/rest.js hose: Stecker im Halter, das Kabel in einer Schlaufe längs der Seitenwand, nie am Boden).
//
// Rahmen der Säule: Mitte ihrer Grundfläche im Ursprung, y = 0 auf dem Boden des Parks, +z zur Straße, −x zur
// Heldenbucht (dort ist die Wand bei x = −0,225, der Halter steht davor). Das Kabel ist ein Schlauch längs einer
// Catmull-Rom-Kurve durch sieben Punkte, die zwischen „gesteckt“ und „im Halter“ wandern; er wird nur neu gebogen, wenn
// sich der Stecker bewegt (in der Szene), in vorher angelegte Puffer.
import * as THREE from 'three';
import { W } from '../../curve.js';

const CABLE_R = 0.032; // wie im Baukasten
const ALONG = 48;
const AROUND = 10;
// Stecker: 0,085 × 0,21 × 0,12 m wie im Baukasten, Längsachse = lokales y: unten Tülle und Kabel, oben die runde Spitze
// (0,04 m), die in der Buchse steckt
const PLUG = { w: 0.085, h: 0.21, d: 0.12, tip: 0.04, tipR: 0.029 };
// Ruhelage: Mitte des Steckers vor dem Halter (2 cm weiter außen als im Baukasten, damit das Kabel vor der Halterplatte
// hängt), Eintritt des Kabels in die Säule
const XS = -0.29;
const HOLD = new THREE.Vector3(XS, 1.0616, 0.07);
const ENTRY = new THREE.Vector3(-0.205, 1.02, -0.13);
// Kabel zwischen Stecker und Eintritt: in Ruhe eine Schlaufe in der Ebene x = XS (tiefster Punkt 0,6 m); gesteckt
// folgen ihre Punkte dem Kabelende, je näher am Stecker, desto mehr (DRAG), die an der Säule bleiben fast stehen
const REST = [[XS, 0.8, 0.125], [XS, 0.655, 0.07], [XS, 0.615, -0.04], [XS, 0.7, -0.16], [XS, 0.885, -0.18]].map((p) => new THREE.Vector3(...p));
const DRAG = [0.85, 0.65, 0.45, 0.25, 0.05];
// Kabelende in Ruhe (unter der Tülle)
const END_REST = new THREE.Vector3(XS, HOLD.y - PLUG.h / 2 - 0.03, HOLD.z);
const PULL = 0.06; // so weit zieht sich der Stecker gerade aus der Buchse, ehe er schwenkt
const LIFT = 0.07; // Bogen nach oben auf dem Weg zum Halter

/**
 * Baut Stecker und Kabel. Ergebnis: { group (Rahmen der Säule), plug(pos, normal) – Buchse im Rahmen der Säule
 * (Mitte auf der Karosserie, Normale nach außen), set(k) – 0 gesteckt … 1 im Halter, k, dispose() }.
 */
export function buildChargeRig() {
  const group = new THREE.Group();
  group.name = 'Ladekabel';
  const plugMat = W.std({ color: 0x5a5552, roughness: 0.55 });
  const gripMat = W.std({ color: 0x2f3236, roughness: 0.7 });
  const cableMat = W.std({ color: 0x4a4543, roughness: 0.62 });
  // Stecker: Griff mit runden Kanten, dunkles Griffband, Tülle am Kabelende
  const plug = new THREE.Group();
  const bh = PLUG.h - PLUG.tip;
  const body = new THREE.Mesh(roundBox(PLUG.w, bh, PLUG.d, 0.03), plugMat);
  body.position.y = -PLUG.tip / 2;
  const band = new THREE.Mesh(roundBox(PLUG.w + 0.008, 0.06, PLUG.d + 0.008, 0.032), gripMat);
  band.position.y = -0.03;
  const tip = new THREE.Mesh(new THREE.CylinderGeometry(PLUG.tipR, PLUG.tipR + 0.004, PLUG.tip + 0.004, 20), gripMat);
  tip.position.y = PLUG.h / 2 - PLUG.tip / 2;
  const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.04, 0.045, 16), gripMat);
  sleeve.position.y = -PLUG.h / 2 - 0.012;
  plug.add(body, band, tip, sleeve);
  for (const m of [body, band, tip, sleeve]) m.castShadow = true;
  group.add(plug);
  // Kabel: Schlauch mit festen Puffern
  const n = (ALONG + 1) * (AROUND + 1);
  const pos = new Float32Array(n * 3);
  const nrm = new Float32Array(n * 3);
  const idx = [];
  for (let i = 0; i < ALONG; i++) {
    for (let j = 0; j < AROUND; j++) {
      const a = i * (AROUND + 1) + j;
      const b = a + AROUND + 1;
      idx.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
  geo.setIndex(idx);
  const cable = new THREE.Mesh(geo, cableMat);
  cable.castShadow = true;
  cable.frustumCulled = false;
  group.add(cable);

  const curve = new THREE.CatmullRomCurve3([...Array(9)].map(() => new THREE.Vector3()), false, 'centripetal');
  const pts = curve.points;
  const port = { pos: new THREE.Vector3(), normal: new THREE.Vector3(1, 0, 0), set: false };
  const qPort = new THREE.Quaternion();
  const qRest = new THREE.Quaternion();
  const q = new THREE.Quaternion();
  const UP = new THREE.Vector3(0, 1, 0);
  const tmp = new THREE.Vector3();
  const end = new THREE.Vector3();
  const axis = new THREE.Vector3();
  const P = new THREE.Vector3();
  const T = new THREE.Vector3();
  const N = new THREE.Vector3();
  const B = new THREE.Vector3();
  const pulled = new THREE.Vector3();
  const rig = { group, k: -1 };

  /** Lage des Steckers bei k: Mitte in out, Drehung in q. */
  function plugAt(k, out) {
    // gesteckt: die Spitze 1 cm in der Buchse
    const seat = tmp.copy(port.pos).addScaledVector(port.normal, PLUG.h / 2 - 0.01);
    if (k <= 0.25) {
      const e = smooth(k / 0.25);
      out.copy(seat).addScaledVector(port.normal, PULL * e);
      q.copy(qPort);
      return out;
    }
    const e = smooth((k - 0.25) / 0.75);
    pulled.copy(seat).addScaledVector(port.normal, PULL);
    out.lerpVectors(pulled, HOLD, e);
    out.y += LIFT * Math.sin(Math.PI * e);
    q.slerpQuaternions(qPort, qRest, e);
    return out;
  }

  rig.plug = (pos, normal) => {
    port.pos.copy(pos);
    port.normal.copy(normal).normalize();
    // Längsachse des Steckers (lokal +y, zur Spitze) zeigt gesteckt in die Buchse
    qPort.setFromUnitVectors(UP, tmp.copy(port.normal).negate());
    port.set = true;
    rig.k = -1;
  };

  rig.set = (k) => {
    k = Math.min(1, Math.max(0, k));
    if (k === rig.k) return;
    rig.k = k;
    if (!port.set) k = 1;
    plugAt(k, plug.position);
    plug.quaternion.copy(q);
    // Kabelende: unten am Stecker (lokal −y), Richtung nach außen
    axis.set(0, -1, 0).applyQuaternion(q);
    end.copy(plug.position).addScaledVector(axis, PLUG.h / 2 + 0.03);
    pts[0].copy(end).addScaledVector(axis, -0.06);
    pts[1].copy(end);
    // wie weit das Kabelende von seiner Ruhelage weg ist: so weit zieht es die Schlaufe mit
    tmp.copy(end).sub(END_REST);
    for (let i = 0; i < 5; i++) pts[2 + i].copy(REST[i]).addScaledVector(tmp, DRAG[i]);
    pts[7].copy(ENTRY);
    pts[8].copy(ENTRY).add(tmp.set(0.06, 0.03, 0));
    sweep();
  };

  // Schlauch längs der Kurve zwischen pts[1] und pts[7] (parallel mitgeführter Rahmen, keine Verdrehung)
  function sweep() {
    const t0 = 1 / 8;
    const t1 = 7 / 8;
    let v = 0;
    for (let i = 0; i <= ALONG; i++) {
      const t = t0 + ((t1 - t0) * i) / ALONG;
      curve.getPoint(t, P);
      curve.getTangent(t, T);
      if (i === 0) {
        N.set(0, 0, 1);
        if (Math.abs(N.dot(T)) > 0.9) N.set(1, 0, 0);
      } else {
        // Rahmen weiterdrehen: Normale auf die neue Tangente projizieren
        N.addScaledVector(T, -N.dot(T));
      }
      N.normalize();
      B.crossVectors(T, N);
      for (let j = 0; j <= AROUND; j++) {
        const a = (j / AROUND) * Math.PI * 2;
        const c = Math.cos(a);
        const s = Math.sin(a);
        const nx = N.x * c + B.x * s;
        const ny = N.y * c + B.y * s;
        const nz = N.z * c + B.z * s;
        nrm[v] = nx;
        nrm[v + 1] = ny;
        nrm[v + 2] = nz;
        pos[v] = P.x + nx * CABLE_R;
        pos[v + 1] = P.y + ny * CABLE_R;
        pos[v + 2] = P.z + nz * CABLE_R;
        v += 3;
      }
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.normal.needsUpdate = true;
    geo.computeBoundingSphere();
  }

  // alles hier gehört nur diesem Kabel (Towns.drop räumt es mit dem Ort ab)
  rig.dispose = () => {
    group.traverse((o) => o.geometry?.dispose());
    for (const m of [plugMat, gripMat, cableMat]) m.dispose();
  };

  qRest.identity();
  rig.set(1);
  return rig;
}

function roundBox(w, h, d, r) {
  const shape = new THREE.Shape();
  const x = w / 2 - r - 0.008;
  const z = d / 2 - r - 0.008;
  shape.absarc(x, -z, r, -Math.PI / 2, 0);
  shape.absarc(x, z, r, 0, Math.PI / 2);
  shape.absarc(-x, z, r, Math.PI / 2, Math.PI);
  shape.absarc(-x, -z, r, Math.PI, Math.PI * 1.5);
  // die Fase (8 mm) kommt rundum dazu: Umriss und Höhe darum kleiner anlegen
  const g = new THREE.ExtrudeGeometry(shape, { depth: h - 0.016, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2, curveSegments: 4 });
  g.rotateX(-Math.PI / 2);
  g.translate(0, -(h - 0.016) / 2, 0);
  return g;
}

function smooth(k) {
  const q = Math.min(1, Math.max(0, k));
  return q * q * (3 - 2 * q);
}
