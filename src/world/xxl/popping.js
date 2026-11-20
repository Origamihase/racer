// Popcorn springt in der Glaskabine der Maschine auf dem Tisch an der Heldensäule (kit/rest.js popcorn_stand), solange
// der Wagen beim Ladestopp lädt: Körner fliegen über den Rand des Kessels unter dem Dach, prallen an den Scheiben ab,
// fallen auf den Haufen und sinken darin ein. Gebaut erst beim ersten Ladestopp der Reise (main.js stopBegin).
//
// Rahmen der Maschine wie im Baukasten: Mitte ihrer Grundfläche im Ursprung, y = 0 auf der Tischplatte, +z vorn.
import * as THREE from 'three';
import { W } from '../../curve.js';
import { MACHINE, STAND } from '../kit/rest.js';

const N = 22;
// Innenraum der Kabine (Glas 1,8 cm innerhalb der Kanten, dazu ein Korn Abstand)
const IX = MACHINE.w / 2 - 0.035;
const IZ = MACHINE.d / 2 - 0.035;
const Y1 = MACHINE.base;
// Rand des Kessels (rest.js popcornMachine: Topf mit Radius 0,07 m, 0,07 m unter dem Dach)
const RIM = { r: 0.06, y: MACHINE.base + MACHINE.cab - 0.07 };
// Haufen am Boden der Kabine (wie popcornHeap: Kuppel mit den Halbachsen rx, rz und der Höhe h um (0 | −0,01))
const HEAP = { rx: MACHINE.w / 2 - 0.048, rz: MACHINE.d / 2 - 0.053, h: 0.07, z: -0.01 };
const G = 9.81;

/** Höhe des Haufens bei (x, z) über der Platte. */
function heapAt(x, z) {
  const q = Math.hypot(x / HEAP.rx, (z - HEAP.z) / HEAP.rz);
  return Y1 + HEAP.h * Math.sqrt(Math.max(0, 1 - Math.min(1, q) ** 2));
}

/** Pseudozufall je Korn und Runde (gleich in jedem Bild). */
function hash(i, k) {
  const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

/**
 * Baut die springenden Körner. Ergebnis: { group (Rahmen der Maschine, im Park an den Tisch zu setzen),
 * update(t, on) – t Sekunden seit dem Anschalten, on: ob die Maschine läuft (sonst unsichtbar), dispose() }.
 */
export function buildPopping() {
  const group = new THREE.Group();
  group.name = 'Popcorn';
  group.visible = false;
  // ein Korn: unregelmäßige Flocke (Ikosaeder mit verschobenen Ecken), wenige Flächen
  const geo = new THREE.IcosahedronGeometry(0.012, 0);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const k = 0.75 + 0.5 * hash(Math.round(p.getX(i) * 1e4), Math.round((p.getY(i) + p.getZ(i)) * 1e4));
    p.setXYZ(i, p.getX(i) * k, p.getY(i) * k, p.getZ(i) * k);
  }
  geo.computeVertexNormals();
  const mats = [W.std({ color: 0xfff3c2, roughness: 0.85 }), W.std({ color: 0xf7dc8a, roughness: 0.85 })];
  const kernels = [];
  for (let i = 0; i < N; i++) {
    const m = new THREE.Mesh(geo, mats[i % 3 ? 0 : 1]);
    m.castShadow = false;
    group.add(m);
    kernels.push(m);
  }
  const pos = new THREE.Vector3();

  /** Lage eines Korns zur Zeit tau seiner Runde: Flug ab dem Kesselrand, Abprall am Glas, Liegen auf dem Haufen. */
  function flight(i, k, tau, out) {
    const a = hash(i, k) * Math.PI * 2;
    const vh = 0.18 + 0.3 * hash(i + 0.5, k);
    const vy = 0.35 + 0.6 * hash(i, k + 0.5);
    const tf = (vy + Math.sqrt(vy * vy + 2 * G * (RIM.y - Y1))) / G;
    const t = Math.min(tau, tf);
    let x = Math.cos(a) * (RIM.r + vh * t);
    let z = Math.sin(a) * (RIM.r * 0.8 + vh * t);
    // an den Scheiben abprallen (gespiegelt, so oft es nötig ist)
    const fold = (v, m) => {
      const w = 4 * m;
      const r = (((v + m) % w) + w) % w;
      return r < 2 * m ? r - m : 3 * m - r;
    };
    x = fold(x, IX);
    z = fold(z, IZ);
    const y = Math.max(heapAt(x, z) + 0.004, RIM.y + vy * t - (G * t * t) / 2);
    return out.set(x, y, z);
  }

  return {
    group,
    update(t, on) {
      group.visible = on;
      if (!on) return;
      for (let i = 0; i < N; i++) {
        // jede Runde 0,5 … 0,8 s, versetzt: in der Kabine knallt es ständig irgendwo
        const T = 0.5 + 0.3 * hash(i, 7);
        const u = t / T + i / N;
        const k = Math.floor(u);
        const tau = (u - k) * T;
        const m = kernels[i];
        flight(i, k, tau, pos);
        m.position.copy(pos);
        m.rotation.set(tau * 9 + i, tau * 7 + k, 0);
        // springt auf (klein → groß), am Ende der Runde sinkt es in den Haufen
        const grow = Math.min(1, tau / 0.06);
        const sink = 1 - Math.max(0, (tau - (T - 0.15)) / 0.15);
        m.scale.setScalar(Math.max(0.01, (0.5 + 0.5 * grow) * sink * (0.85 + 0.4 * hash(i, k + 3))));
      }
    },
    dispose() {
      geo.dispose();
      for (const m of mats) m.dispose();
    },
  };
}

/** Lage der Maschine im Rahmen eines Popcorn-Stands des Baukastens (Tischplatte, rest.js STAND.machine). */
export const POPPING_AT = [STAND.machine[0], STAND.top, STAND.machine[1]];
