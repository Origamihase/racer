// Richtungstreuer Stoß für die Cockpit-Kamera: Bei einem Rempler bewegt sich der Kopf dorthin, wohin ihn die
// Trägheit schiebt (Auffahren: nach vorn, von hinten: nach hinten, seitlich: zur getroffenen Seite, weil der Wagen
// unter ihm wegrutscht) und federt gedämpft zurück. Klein und kurz – das Bild soll rucken, nicht schaukeln.
import * as THREE from 'three';

const K = 140; // Federsteife (1/s²)
const C = 15; // Dämpfung (1/s)
const DIR = { front: [0, -1], rear: [0, 1], left: [-1, 0], right: [1, 0] };

export class Jolt {
  constructor() {
    this.p = new THREE.Vector2(); // Versatz (x quer, y längs; m)
    this.v = new THREE.Vector2();
    this.tmp = new THREE.Vector3();
  }

  /** Stoß aus der Zone (front/rear/left/right) mit Stärke 0 … 1. */
  hit(zone, strength = 1) {
    const d = DIR[zone] || DIR.front;
    const s = 0.55 * Math.min(1, Math.max(0.3, strength));
    this.v.x += d[0] * s;
    this.v.y += d[1] * s;
  }

  reset() {
    this.p.set(0, 0);
    this.v.set(0, 0);
  }

  /** Feder weiterrechnen (in kleinen Schritten, damit sie bei jeder Bildrate gleich schwingt). */
  update(dt) {
    let left = Math.min(dt, 0.1);
    while (left > 1e-6) {
      const h = Math.min(left, 1 / 240);
      this.v.x += (-K * this.p.x - C * this.v.x) * h;
      this.v.y += (-K * this.p.y - C * this.v.y) * h;
      this.p.x += this.v.x * h;
      this.p.y += this.v.y * h;
      left -= h;
    }
    if (this.p.lengthSq() < 1e-10 && this.v.lengthSq() < 1e-8) this.reset();
  }

  /** Auf die Kamera anwenden (nach cockpit.placeCamera): Versatz im Fahrzeugrahmen und ein Hauch Neigung. */
  apply(camera, carMatrix) {
    if (this.p.x === 0 && this.p.y === 0) return;
    const e = carMatrix.elements;
    // Fahrzeug-x (rechts) und -z (hinten) in Weltkoordinaten
    camera.position.x += e[0] * this.p.x + e[8] * this.p.y;
    camera.position.y += e[1] * this.p.x + e[9] * this.p.y;
    camera.position.z += e[2] * this.p.x + e[10] * this.p.y;
    camera.rotateX(this.p.y * 0.35);
    camera.rotateZ(-this.p.x * 0.5);
  }
}
