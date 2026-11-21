// Popcorn springt in der Glaskabine der Maschine oben auf der Heldensäule (kit/rest.js popcorn_post), solange der Wagen
// beim Ladestopp lädt: Körner fliegen über den Rand des Kessels unter dem Dach, prallen an den Scheiben ab, fallen auf
// den Haufen und sinken darin ein. Ist das Fahrerfenster offen, springen dazu Körner aus der offenen Tür und fliegen im
// Bogen hinein ins Auto, zu Mini Adam (Ziel aim, main.js stopTick). Gebaut erst beim ersten Ladestopp der Reise
// (main.js stopBegin).
//
// Rahmen der Maschine wie im Baukasten: Mitte ihrer Grundfläche im Ursprung, y = 0 auf dem Deckel der Säule, +z vorn
// (dort steht die Tür offen).
import * as THREE from 'three';
import { W } from '../../curve.js';
import { MACHINE, POST_POP } from '../kit/rest.js';

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
/**
 * Körner ins Auto: n fliegen zugleich, jedes alle period Sekunden (je Korn etwas anders) einmal; flight: Flugzeit (s)
 * von der Tür der Maschine bis durchs Fenster, spread: so weit (m) streut die Stelle, an der sie hindurchfliegen, um
 * aim (in der Höhe, längs des Fensters); after: so lange (s) fliegen sie dahinter im Auto weiter und schrumpfen dabei.
 */
export const FLY = { n: 9, period: [1.0, 1.5], flight: [0.56, 0.68], spread: [0.05, 0.09], after: 0.12 };
/**
 * Stelle im offenen Fahrerfenster, durch die die Körner fliegen (windowAim): inside Meter hinter dem Glas, mid: Höhe
 * als Anteil von der Unter- zur Oberkante der Öffnung, along: Anteil des Wegs von der B-Säule zur A-Säule (die Maschine
 * steht hinter dem Wagen: die Körner kommen von hinten oben und fliegen außen am Dach vorbei hinein).
 */
export const AIM = { inside: 0.03, mid: 0.5, along: 0.4 };

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
 * Flug eines Korns aus der Tür ins Auto (Rahmen der Maschine): Start in der offenen Tür (vorn, auf Höhe des Kessels),
 * nach flyTime Sekunden im Fenster bei aim – gestreut je Korn i und Runde k in der Höhe und längs des Fensters
 * (along: Richtung des Wagens nach hinten, Einheitsvektor im Rahmen der Maschine) –, dazwischen die Wurfparabel,
 * dahinter dieselbe Parabel weiter ins Auto. Ergebnis in out; die Startgeschwindigkeit steht danach in vel (für
 * Prüfungen). tau: Sekunden seit dem Start.
 */
export function flyPath(aim, along, i, k, tau, out, vel = null) {
  const tf = flyTime(i, k);
  const x0 = (hash(i, k + 0.1) - 0.5) * 0.1;
  const y0 = RIM.y - 0.02;
  const z0 = MACHINE.d / 2 - 0.01;
  const sy = (hash(i + 0.75, k) - 0.5) * 2 * FLY.spread[0];
  const sz = (hash(i + 0.5, k + 0.25) - 0.5) * 2 * FLY.spread[1];
  const vx = (aim.x + along.x * sz - x0) / tf;
  const vy = (aim.y + sy - y0 + (G * tf * tf) / 2) / tf;
  const vz = (aim.z + along.z * sz - z0) / tf;
  if (vel) vel.set(vx, vy, vz);
  const t = Math.min(tau, tf + FLY.after);
  return out.set(x0 + vx * t, y0 + vy * t - (G * t * t) / 2, z0 + vz * t);
}

/**
 * Stelle im offenen Fahrerfenster, durch die die Körner fliegen, im Rahmen des Wagens (vorn −z, links −x): auf dem Glas
 * (win: tesla.windowOpening()) in der Höhe AIM.mid der Öffnung, zwischen B- und A-Säule (AIM.along), AIM.inside
 * dahinter. out wird gefüllt.
 */
export function windowAim(win, out) {
  win.at(AIM.along, AIM.mid, out);
  out.x += AIM.inside;
  return out;
}

/** Flugzeit des Korns i in Runde k bis ins Fenster (wie flyPath). */
export function flyTime(i, k) {
  return FLY.flight[0] + (FLY.flight[1] - FLY.flight[0]) * hash(i + 0.25, k);
}

/**
 * Baut die springenden Körner. Ergebnis: { group (Rahmen der Maschine, an die Säule zu setzen: POPPING_AT, POPPING_YAW),
 * update(t, on, aim, along) – t Sekunden seit dem Anschalten, on: ob die Maschine läuft (sonst unsichtbar), aim:
 * Stelle im Fenster (Rahmen der Maschine, THREE.Vector3) oder null (Fenster zu: keine Körner hinaus), along: die
 * Richtung längs des Wagens dort (flyPath), dispose() }.
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
  for (let i = 0; i < N + FLY.n; i++) {
    const m = new THREE.Mesh(geo, mats[i % 3 ? 0 : 1]);
    m.castShadow = false;
    // (fliegende Körner verlassen die Kabine: die Gruppe hat keine feste Hülle)
    m.frustumCulled = false;
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
    update(t, on, aim = null, along = null) {
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
      // durch die offene Tür ins Auto: jedes Korn einmal je Runde, danach bis zur nächsten unsichtbar
      for (let j = 0; j < FLY.n; j++) {
        const m = kernels[N + j];
        const T = FLY.period[0] + (FLY.period[1] - FLY.period[0]) * hash(j, 11);
        const u = t / T + j / FLY.n;
        const k = Math.floor(u);
        const tau = (u - k) * T;
        const tf = flyTime(j, k);
        m.visible = !!aim && tau < tf + FLY.after;
        if (!m.visible) continue;
        flyPath(aim, along, j, k, tau, m.position);
        m.rotation.set(tau * 11 + j, tau * 8 + k, tau * 3);
        // aufgehen gleich an der Tür, hinter dem Fenster im Auto schrumpfen
        const grow = Math.min(1, tau / 0.05);
        const gone = 1 - Math.max(0, (tau - tf) / FLY.after);
        m.scale.setScalar(Math.max(0.01, (0.55 + 0.6 * grow) * gone * (0.9 + 0.35 * hash(j, k + 5))));
      }
    },
    dispose() {
      geo.dispose();
      for (const m of mats) m.dispose();
    },
  };
}

/** Lage und Drehung der Maschine im Rahmen der Säule des Baukastens (rest.js popcorn_post: auf dem Deckel, um yaw gedreht). */
export const POPPING_AT = [0, POST_POP.top, 0];
export const POPPING_YAW = POST_POP.yaw;
