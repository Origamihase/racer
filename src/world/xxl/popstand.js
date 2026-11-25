// Der Popcorn-Stand an der Säule: Maschine, Kabel und Eimer bringt Mini Adam zum Laden mit (Besitzer, 25.11.2026: „Die
// Popcorn-Maschine kommt allerdings von Mini Adam. Sie wird erst beim Laden des Autos angeschlossen.“ – im Stream hatte
// Adam beim Laden eine Popcornmaschine an der Säule angeschlossen). Sonst steht er nirgends: nicht an der Autobahn, nicht
// in den Orten, nicht am Start, auch nicht beim Einparken. city.js buildTown baut ihn als eigenes, verstecktes Stück
// (group.popcornStand); die Ladeszene (scenes/stop.js) stellt ihn im Schwarz vor der Nahaufnahme in der Bucht hin – da ist
// Adam angekommen und hat angeschlossen – und lässt ihn nach der Szene gehen, aber nie mitten im Bild: sobald ihn keine
// Kamera mehr sieht, im Schwarz einer übersprungenen Szene sofort (oder mit seinem Ort).
import * as THREE from 'three';
import { curvePoint } from '../../curve.js';

/**
 * y, r: Mitte (über dem Boden) und Radius der Kugel um Eimer, Maschine und Kabel; far: weiter als so viele Meter ist er
 * in Spiegel und Seitenfenster kleiner als ein Bildpunkt (dort zählt er als ungesehen).
 */
export const POP_STAND = { y: 1.2, r: 2, far: 100 };

const fr = new THREE.Frustum();
const mat = new THREE.Matrix4();
const sph = new THREE.Sphere();

/**
 * Sieht eine der Kameras cams den Stand obj? cams: Liste von { cam, far } (cam null: zeichnet gerade nicht; far: nur so
 * weit zählt sie). Die Mitte wird gebogen wie im Shader (curve.js), damit die Prüfung auch in Kurven stimmt.
 */
export function standSeen(obj, cams) {
  obj.updateWorldMatrix(true, false);
  sph.center.setFromMatrixPosition(obj.matrixWorld);
  sph.center.y += POP_STAND.y;
  curvePoint(sph.center);
  sph.radius = POP_STAND.r;
  for (const c of cams) {
    const cam = c.cam;
    if (!cam) continue;
    if (c.far && cam.position.distanceTo(sph.center) - sph.radius > c.far) continue;
    cam.updateMatrixWorld();
    mat.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse);
    if (fr.setFromProjectionMatrix(mat).intersectsSphere(sph)) return true;
  }
  return false;
}

/** Steht obj noch in einer Szene (ein abgebauter Ort hängt an nichts mehr)? */
function attached(obj) {
  let o = obj;
  while (o.parent) o = o.parent;
  return o.isScene === true;
}

/**
 * Der Stand der laufenden oder letzten Ladeszene: obj (group.popcornStand oder null), want: soll er zu sehen sein.
 * show(obj) je Bild der Szene ab dem Schwarz vor der Nahaufnahme, end(black) mit ihrem Ende, tick(cams) je Bild.
 */
export class PopStand {
  constructor() {
    this.obj = null;
    this.want = false;
  }

  /** Das Bild ist schwarz (Schnitt in die Bucht) oder die Nahaufnahme läuft: Die Maschine steht an der Säule. */
  show(obj) {
    if (this.obj && this.obj !== obj) this.obj.visible = false;
    this.obj = obj || null;
    this.want = !!obj;
    if (obj) obj.visible = true;
  }

  /** Die Szene ist vorbei: Der Stand geht, sobald ihn keine Kamera mehr sieht; ist das Bild schwarz (black), gleich. */
  end(black = false) {
    this.want = false;
    if (black && this.obj) {
      this.obj.visible = false;
      this.obj = null;
    }
  }

  /** Je Bild (nach Kamera und Krümmung): Nach der Szene geht er, sobald keine der Kameras cams hinsieht. */
  tick(cams) {
    const o = this.obj;
    if (!o) return;
    if (!attached(o)) {
      // (sein Ort ist abgebaut: Er geht mit und steht nicht mehr da, falls der Ort wiederkommt)
      o.visible = false;
      this.obj = null;
      return;
    }
    if (!this.want && o.visible && !standSeen(o, cams)) o.visible = false;
    if (!this.want && !o.visible) this.obj = null;
  }

  /** Neuer Stream: kein Stand mehr zu sehen. */
  reset() {
    if (this.obj) this.obj.visible = false;
    this.obj = null;
    this.want = false;
  }
}
