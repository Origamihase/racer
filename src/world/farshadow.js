// Weite Schattenkarte: Schatten der Landschaft. Die Schattenkarte der Sonne (sky.js, SHADOW) reicht nur gut 60 m
// zur Seite und 180 m voraus: Bäume, Büsche und Häuser am Rand standen dahinter ohne Schatten auf der Wiese. Diese
// zweite Karte fasst ein Vielfaches (FAR) und ist entsprechend gröber (bei „hoch“ rund 25 × 40 cm je Punkt): Sie
// gilt dort, wo die feine ausläuft, linear mit ihr überblendet (curve.js cwFarLit, getShadow in sky.js), so dass
// beide zusammen überall genau einen Schatten geben.
// Gezeichnet wird in jedem Bild, vor allen anderen Durchgängen: nur, was auf der Ebene FAR_LAYER liegt (Bewuchs,
// Häuser), mit einem Tiefen-Material für alles, gebogen wie die Welt (curve.js biegt three.js' Tiefen-Shader mit).
// Rückseiten statt Vorderseiten: Eine besonnte Fläche liegt dann sicher vor dem, was in der Karte steht, und kann
// sich nicht selbst gestreift beschatten; die abgewandte ist ohnehin ohne Sonne.
import * as THREE from 'three';
import { sunUniforms } from '../curve.js';

/** Was einen weiten Schatten wirft, liegt zusätzlich auf dieser Ebene (mesh.layers.enable). */
export const FAR_LAYER = 5;
// Kasten in Licht-Einheiten wie SHADOW in sky.js (u quer, v längs der Blickrichtung); seine Ränder stehen in curve.js
// (FAR_EDGE, FAR_FAR)
export const FAR = { u: 520, v: 800, back: 90, near: 10, depth: 1500, bias: 0.25 };

const _dir = new THREE.Vector3();
const _m = new THREE.Matrix4();
const BIAS = new THREE.Matrix4().set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);

export class FarShadow {
  constructor() {
    this.size = 0;
    this.on = false;
    this.camera = new THREE.OrthographicCamera(-FAR.u / 2, FAR.u / 2, FAR.v / 2, -FAR.v / 2, FAR.near, FAR.depth);
    this.camera.up.set(0, 0, -1); // wie die Schattenkamera der Sonne: v wächst in Fahrtrichtung
    this.camera.layers.set(FAR_LAYER);
    this.camera.matrixAutoUpdate = false;
    this.material = new THREE.MeshDepthMaterial({ side: THREE.BackSide });
    this.material.colorWrite = false;
    this.rt = null;
    this.setSize(0);
  }

  /** Auflösung der Karte (Punkte je Kante); 0 = aus (dann bleibt eine winzige, leere Karte: alles in der Sonne). */
  setSize(size) {
    const n = size || 4;
    this.on = size > 0;
    if (this.rt && this.rt.width === n) return;
    if (this.rt) this.rt.dispose();
    const depth = new THREE.DepthTexture(n, n, THREE.UnsignedIntType);
    depth.compareFunction = THREE.LessEqualCompare; // als sampler2DShadow gelesen: vier Punkte, weich gemittelt
    depth.minFilter = depth.magFilter = THREE.LinearFilter;
    // Farbe wird nie geschrieben noch gelesen: ein Kanal zu 8 Bit statt RGBA (bei 2048² 4 statt 16 MB)
    this.rt = new THREE.WebGLRenderTarget(n, n, { depthTexture: depth, generateMipmaps: false, format: THREE.RedFormat, type: THREE.UnsignedByteType });
    this.size = n;
    this.clear = true;
    sunUniforms.uFarMap.value = depth;
    if (!this.on) sunUniforms.uFar.value.x = 0;
  }

  /**
   * Kasten dorthin legen, wohin die Kamera schaut (wie Sky.placeShadow, nur weiter), auf ganze Punkte der Welt
   * eingerastet (die Welt rückt mit s nach +z), damit Schattenkanten beim Fahren nicht flimmern.
   */
  place(camera, s, sunDir, eU, eV) {
    if (!this.on) return;
    camera.getWorldDirection(_dir);
    const len = Math.hypot(_dir.x, _dir.z);
    const fx = len > 1e-3 ? _dir.x / len : 0;
    const fz = len > 1e-3 ? _dir.z / len : -1;
    const halfZ = FAR.v / 2 / -eV.z;
    const x = camera.position.x * 0.5;
    const z = camera.position.z + fz * (halfZ - FAR.back);
    const tu = FAR.u / this.size;
    const tv = FAR.v / this.size;
    const u = Math.round((eU.x * x) / tu) * tu;
    const sv = eV.z * s;
    const v = Math.round((eV.x * x + eV.z * z - sv) / tv) * tv + sv;
    const cx = u / eU.x;
    const cz = (v - eV.x * cx) / eV.z;
    const cam = this.camera;
    cam.position.set(cx, 0, cz).addScaledVector(sunDir, FAR.depth / 2);
    cam.updateMatrix(); // lookAt liest die Lage aus der Matrix
    cam.lookAt(cx, 0, cz);
    cam.updateMatrix();
    cam.updateMatrixWorld(true);
    // Welt → Karte (0 … 1) und Tiefe
    sunUniforms.uFarM.value.multiplyMatrices(BIAS, _m.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse));
    const U = sunUniforms.uFar.value;
    U.x = 1;
    U.y = FAR.bias / (FAR.depth - FAR.near);
    U.w = 1 / this.size;
    U.z = -fz; // Blick längs der Straße (+1 voraus … −1 zurück): dort läuft die Karte lang aus
  }

  /**
   * Beim Start: das Tiefen-Programm für jede Art von Netz der Szene übersetzen (mit und ohne Instanzen …), nicht nur
   * für die, die gerade einen weiten Schatten werfen. Sonst stockte das Bild, sobald unterwegs die erste neue Art
   * dazukommt.
   */
  warm(renderer, scene, car) {
    const { on } = this;
    const lent = [];
    scene.traverse((o) => {
      if (o.isMesh && !o.layers.isEnabled(FAR_LAYER)) {
        o.layers.enable(FAR_LAYER);
        lent.push(o);
      }
    });
    this.on = true;
    try {
      this.render(renderer, scene, car);
    } finally {
      this.on = on;
      for (const o of lent) o.layers.disable(FAR_LAYER);
      this.clear = true;
    }
  }

  /**
   * Die Karte zeichnen (vor allen anderen Durchgängen des Bilds). car: der eigene Wagen, er bleibt draußen. Er wirft
   * hier keinen Schatten, und mit seiner Innenraumleuchte zählte three.js eine Lichtquelle mehr: je nachdem, ob er
   * gerade zu sehen ist, wäre das für jedes Tiefen-Programm ein zweites.
   */
  render(renderer, scene, car) {
    if (!this.on && !this.clear) return;
    const target = renderer.getRenderTarget();
    const override = scene.overrideMaterial;
    renderer.setRenderTarget(this.rt);
    if (this.on) {
      const shown = car.visible;
      const { autoClear } = renderer;
      const { background } = scene;
      car.visible = false;
      scene.overrideMaterial = this.material;
      // nur die Tiefe löschen; ohne Hintergrund, der würde sonst als Kasten mitgezeichnet oder die Farbe gelöscht
      scene.background = null;
      renderer.autoClear = false;
      renderer.clear(false, true, false);
      try {
        renderer.render(scene, this.camera);
      } finally {
        renderer.autoClear = autoClear;
        scene.background = background;
        scene.overrideMaterial = override;
        car.visible = shown;
      }
    } else renderer.clear();
    this.clear = false;
    renderer.setRenderTarget(target);
  }
}
