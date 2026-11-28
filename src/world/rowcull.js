// Bäume, Büsche und Häuser am Rand sind wenige große InstancedMesh (scenery.js, xxl/forest.js): je Art ein
// Zeichenaufruf für alles von 300 m hinter dem Wagen bis zum Horizont. three.js kann so ein Netz nur ganz zeichnen
// oder gar nicht, also lief es bisher in jedem Durchgang ganz durch die Grafikkarte: auch im Rückspiegel, der nur
// sieht, was hinter dem Wagen steht, in der Schattenkarte, die 220 m lang ist, und im Seitenfenster der Facecam.
// Gemessen auf der Autobahn (Adreno X1-85): knapp 5000 Instanzen, davon sieht der Rückspiegel 556, die Schattenkarte
// 521, das Seitenfenster 413; alle übrigen kosteten dort nur Rechenzeit für ihre Eckpunkte.
//
// Deshalb liegen die Instanzen jetzt in Reihen entlang der Straße (ROW Meter lang), aufsteigend von hinten nach vorn.
// Vor jedem Durchgang sucht RowCull von vorn die letzte Reihe, die diese Kamera überhaupt sehen kann, und das Netz
// zeichnet nur die Instanzen bis dorthin (InstancedMesh.count: ein Zeichenaufruf wie zuvor, nur kürzer). Der Blick
// nach vorn sieht meist bis zur letzten Reihe und zeichnet dann wie bisher alles; wo die Straße weit vorn aus dem
// Bild läuft, endet auch er früher.
//
// Dass ein Durchgang weniger zeichnet, ändert am Bild nichts, solange nie eine Reihe fehlt, von der etwas zu sehen
// wäre. Dafür hat jede Reihe vier Quader um ihre Instanzen: links und rechts der Straße je einen für das Nahe (bis
// FAR Meter) und einen für das Ferne, damit ein Dorf am Horizont nicht die Hülle der Bäume am Straßenrand aufbläht.
// Geprüft wird eine Kugel um das, was beim Biegen der Welt aus dem Quader wird (curveBound in curve.js, mit
// Herleitung): eher zu groß als zu klein, im Zweifel wird gezeichnet.
//
// Anders als vorher ist die Reihenfolge, in der gezeichnet wird: die Instanzen eines Netzes nach Reihen statt nach
// Plätzen oder Plänen, und damit auch Netze desselben Materials untereinander (three.js ordnet sie nach dem
// Mittelpunkt ihrer Hüllkugel, und die setzt es in der Reihenfolge der Instanzen zusammen). Sehen kann man das nur,
// wo zwei Pflanzen ineinander stehen und ein Bildpunkt beider genau gleich tief liegt: Dort gewinnt, wer später
// gezeichnet wird, also vielleicht die andere als früher. Welche gewinnt, war auch vorher Zufall der Reihenfolge.
import * as THREE from 'three';
import { curveBound, curveStamp } from '../curve.js';

/** Länge einer Reihe in Metern entlang der Straße. */
export const ROW = 50;
// Quader je Reihe: fern links, nah links, nah rechts, fern rechts (nach dem Mittelpunkt der Instanz)
const BANDS = 4;
const FAR = 100;

// Zähler für Prüfstände und Messungen (?debug: __MA.rows): gezeichnete und vorhandene Instanzen seit dem letzten reset
export const rowStats = { drawn: 0, total: 0, bounds: 0 };
// Für Prüfbilder und Messungen: aus zeichnet jeder Durchgang alle Instanzen. Ihre Reihenfolge bleibt die der Reihen,
// der Vergleich an/aus zeigt also genau das, worauf es ankommt: ob irgendwo eine Reihe fehlt
let enabled = true;
export function setRowCull(on) {
  enabled = !!on;
}

const BOX = 6; // minx, miny, minz, maxx, maxy, maxz
const OPEN = 0; // Kugel dieses Stands noch nicht gerechnet
const BALL = 1; // Kugel gilt
const EMPTY = 2; // nichts in diesem Quader

/** Nummer des Quaders, in den eine Instanz der Reihe row mit Mittelpunkt x (im Raum des Netzes) gehört. */
export const rowBox = (row, x) => row * BANDS + (x < 0 ? (x < -FAR ? 0 : 1) : x < FAR ? 2 : 3);

const _frustum = new THREE.Frustum();
const _proj = new THREE.Matrix4();
const _sphere = new THREE.Sphere();

export class RowCull {
  constructor() {
    this.n = 0;
    this.box = new Float32Array(0); // je Reihe BANDS Quader im Raum des Netzes
    this.ball = new Float32Array(0); // … und seine gebogene Hüllkugel (x, y, z, r) für den Stand stamp/mat
    this.state = new Uint8Array(0);
    this.stamp = -1;
    this.mat = new Float64Array(16);
    this.passes = new WeakMap(); // Kamera → { frame, last }
  }

  /** Neu beginnen mit n leeren Reihen. */
  reset(n) {
    if (this.state.length < n * BANDS) {
      let cap = 64;
      while (cap < n * BANDS) cap *= 2;
      this.box = new Float32Array(cap * BOX);
      this.ball = new Float32Array(cap * 4);
      this.state = new Uint8Array(cap);
    }
    this.n = n;
    this.state.fill(EMPTY, 0, n * BANDS);
    this.stamp = -1;
    this.passes = new WeakMap();
  }

  /** Eine Instanz in Reihe row: Kugel (x, y, z, r) im Raum des Netzes, in der sie ganz liegt. */
  add(row, x, y, z, r) {
    const i = rowBox(row, x);
    const o = i * BOX;
    const B = this.box;
    if (this.state[i] === EMPTY) {
      this.state[i] = OPEN;
      B[o] = x - r;
      B[o + 1] = y - r;
      B[o + 2] = z - r;
      B[o + 3] = x + r;
      B[o + 4] = y + r;
      B[o + 5] = z + r;
      return;
    }
    if (x - r < B[o]) B[o] = x - r;
    if (y - r < B[o + 1]) B[o + 1] = y - r;
    if (z - r < B[o + 2]) B[o + 2] = z - r;
    if (x + r > B[o + 3]) B[o + 3] = x + r;
    if (y + r > B[o + 4]) B[o + 4] = y + r;
    if (z + r > B[o + 5]) B[o + 5] = z + r;
  }

  /** Reihe row wieder leer. */
  clearRow(row) {
    this.state.fill(EMPTY, row * BANDS, (row + 1) * BANDS);
  }

  /** Reihe row bekommt die Quader der Reihe fromRow von from. */
  take(row, from, fromRow) {
    for (let band = 0; band < BANDS; band++) {
      const i = row * BANDS + band;
      const j = fromRow * BANDS + band;
      if (from.state[j] === EMPTY) continue;
      this.state[i] = OPEN;
      for (let k = 0; k < BOX; k++) this.box[i * BOX + k] = from.box[j * BOX + k];
    }
  }

  /**
   * Letzte Reihe, von der diese Kamera in diesem Durchgang etwas sehen kann (−1: keine). object: das Netz (seine
   * Weltmatrix trägt Lage und Scherung des Rahmens). Je Durchgang (renderer.render oder Schattenkarte) einmal gerechnet.
   */
  last(renderer, camera, object) {
    if (!enabled) return this.n - 1;
    const frame = renderer.info.render.frame;
    let pass = this.passes.get(camera);
    if (!pass) this.passes.set(camera, (pass = { frame: -1, last: -1 }));
    if (pass.frame === frame) return pass.last;
    pass.frame = frame;
    // Die Kugeln gelten, solange die Bahn (curveStamp) und die Lage des Netzes dieselben sind: in allen Durchgängen
    // eines Bilds
    const e = object.matrixWorld.elements;
    const M = this.mat;
    let same = this.stamp === curveStamp();
    for (let k = 0; same && k < 16; k++) same = M[k] === e[k];
    if (!same) {
      this.stamp = curveStamp();
      for (let k = 0; k < 16; k++) M[k] = e[k];
      const S = this.state;
      for (let i = 0, n = this.n * BANDS; i < n; i++) if (S[i] !== EMPTY) S[i] = OPEN;
    }
    _frustum.setFromProjectionMatrix(_proj.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
    let row = this.n - 1;
    while (row >= 0 && !this.rowSeen(row)) row--;
    pass.last = row;
    return row;
  }

  rowSeen(row) {
    for (let i = row * BANDS, end = i + BANDS; i < end; i++) if (this.seen(i)) return true;
    return false;
  }

  seen(i) {
    const st = this.state[i];
    if (st === EMPTY) return false;
    if (st === OPEN) this.bend(i);
    const A = this.ball;
    const o = i * 4;
    _sphere.center.set(A[o], A[o + 1], A[o + 2]);
    _sphere.radius = A[o + 3];
    return _frustum.intersectsSphere(_sphere);
  }

  /** Für Prüfstände: gebogene Hüllkugel des Quaders i im Stand des letzten last() als [x, y, z, r]; null: leer. */
  hull(i) {
    if (this.state[i] === EMPTY) return null;
    if (this.state[i] === OPEN) this.bend(i);
    return this.ball.subarray(i * 4, i * 4 + 4);
  }

  /** Quader i mit der Matrix des Netzes in die Simulation, dann die Hüllkugel dessen, was beim Biegen aus ihm wird. */
  bend(i) {
    const B = this.box;
    const o = i * BOX;
    const M = this.mat;
    const cx = (B[o] + B[o + 3]) / 2;
    const cy = (B[o + 1] + B[o + 4]) / 2;
    const cz = (B[o + 2] + B[o + 5]) / 2;
    const hx = (B[o + 3] - B[o]) / 2;
    const hy = (B[o + 4] - B[o + 1]) / 2;
    const hz = (B[o + 5] - B[o + 2]) / 2;
    // Die Matrix ist affin (Verschiebung, im Knotenpunkt eine Scherung): Der Quader wird ein Spat. Der Quader längs
    // der Achsen, der ihn einschließt, hat die halben Kanten |M| · h.
    const ex = Math.abs(M[0]) * hx + Math.abs(M[4]) * hy + Math.abs(M[8]) * hz;
    const ey = Math.abs(M[1]) * hx + Math.abs(M[5]) * hy + Math.abs(M[9]) * hz;
    const ez = Math.abs(M[2]) * hx + Math.abs(M[6]) * hy + Math.abs(M[10]) * hz;
    _sphere.center.set(M[0] * cx + M[4] * cy + M[8] * cz + M[12], M[1] * cx + M[5] * cy + M[9] * cz + M[13], M[2] * cx + M[6] * cy + M[10] * cz + M[14]);
    rowStats.bounds++;
    curveBound(_sphere, ex, ey, ez);
    this.state[i] = BALL;
    const A = this.ball;
    A[i * 4] = _sphere.center.x;
    A[i * 4 + 1] = _sphere.center.y;
    A[i * 4 + 2] = _sphere.center.z;
    A[i * 4 + 3] = _sphere.radius;
  }
}

/**
 * Ein InstancedMesh, dessen Instanzen nach Reihen sortiert sind, zeichnet in jedem Durchgang nur bis zur letzten
 * sichtbaren Reihe. mesh.userData.rowStart[row] = erste Instanz der Reihe (Länge Reihen + 1, am Ende alle),
 * mesh.userData.rowTotal = alle Instanzen; beides setzt, wer das Netz füllt.
 */
export function cullByRows(mesh, cull) {
  const upTo = (row) => {
    const total = mesh.userData.rowTotal;
    const start = mesh.userData.rowStart;
    const n = row < 0 ? 0 : row + 1 < start.length ? Math.min(total, start[row + 1]) : total;
    rowStats.drawn += n;
    rowStats.total += total;
    mesh.count = n;
  };
  const all = () => {
    mesh.count = mesh.userData.rowTotal;
  };
  mesh.userData.rowStart = new Uint32Array(1);
  mesh.userData.rowTotal = 0;
  mesh.onBeforeRender = (renderer, scene, camera) => upTo(cull.last(renderer, camera, mesh));
  mesh.onAfterRender = all;
  mesh.onBeforeShadow = (renderer, object, camera, shadowCamera) => upTo(cull.last(renderer, shadowCamera, mesh));
  mesh.onAfterShadow = all;
  return mesh;
}
