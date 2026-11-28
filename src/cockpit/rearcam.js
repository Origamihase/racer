// Rückfahrkamera wie im Model 3: Solange R eingelegt ist, zeigt der Mittelbildschirm oben rechts groß das Bild der
// Kamera über dem Kennzeichen – gespiegelt wie ein Spiegel (links im Bild ist links vom Auto), mit Hilfslinien, die der
// Lenkung folgen. Gerendert wird nur in R und nur, solange das Cockpit zu sehen ist: klein (RES) und in halber
// Bildrate. In D kostet sie nichts: bis zum ersten R gibt es weder Bild noch Flächen (build), danach sind die beiden
// Flächen versteckt, es wird nichts gerendert oder gezeichnet.
import * as THREE from 'three';
import { REAR_RECT, SCREEN_PX } from './screen.js';

/**
 * Kamera in Wagenkoordinaten (x rechts, y oben, vorn = −z): Auge über dem Kennzeichen, Blick schräg nach hinten unten,
 * weitwinklig wie eine echte Rückfahrkamera. res: Auflösung des Bilds, rate: höchstens so viele Bilder je Sekunde
 * (bei 60 Bildern je Sekunde jedes zweite).
 */
export const REAR_CAM = { res: [512, 288], fov: 64, eye: [0, 0.98, 2.43], look: [0, 0.05, 6.4], near: 0.1, far: 420, rate: 30 };
// Qualitätsstufe 'niedrig' (wie Spiegel und Facecam): halb so viele Bilder, Sicht nur bis 200 m (dahinter ist die
// Straße im Bild schmaler als ein Pixel, Himmel und Hügel zeichnet sky.js ohnehin in jeder Ferne)
const REAR_LOW = { rate: 15, far: 200 };
// Hilfslinien: Spurweite (Mitte der Linien, m), so weit nach hinten (m), Krümmung je Lenkradstellung (1/m), Marken (m)
const GUIDE = { half: 0.82, len: 6.5, k: 0.17, marks: [[1, '#ff5a4c'], [2.5, '#ffc542'], [4.5, '#4fd18b']] };

export class RearCam {
  constructor() {
    this.on = false;
    this.wheel = NaN;
    this.acc = 0;
    this.shotT = -Infinity;
    this.place = null;
    this.picture = this.overlay = null;
  }

  /** Platz über dem Fenster des Mittelbildschirms (REAR_RECT) in dessen Gruppe; pw × ph: Größe der Anzeige (m). */
  attach(group, pw, ph, z) {
    this.place = { group, pw, ph, z };
  }

  /**
   * Beim ersten R: Bild, Kameras, Hilfslinien, Maske und die beiden Flächen anlegen. Erst hier, damit D keinen
   * Speicher kostet und die Kennungen der three.js-Objekte (die ziehen Zufallszahlen) den Lauf ohne R nicht verändern.
   */
  build() {
    const [w, h] = REAR_CAM.res;
    this.rt = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, samples: 4, depthBuffer: true });
    this.cam = new THREE.PerspectiveCamera(REAR_CAM.fov, w / h, REAR_CAM.near, REAR_CAM.far);
    // derselbe Blick in Wagenkoordinaten: projiziert die Hilfslinien vom Boden in das Bild
    this.local = new THREE.PerspectiveCamera(REAR_CAM.fov, w / h, REAR_CAM.near, REAR_CAM.far);
    this.local.position.fromArray(REAR_CAM.eye);
    this.local.lookAt(new THREE.Vector3().fromArray(REAR_CAM.look));
    this.local.updateMatrixWorld(true);
    this.local.updateProjectionMatrix();
    this.v = new THREE.Vector3();
    this.eye = new THREE.Vector3();
    this.at = new THREE.Vector3();
    // Hilfslinien (durchsichtig, über dem Bild)
    this.canvas = document.createElement('canvas');
    this.canvas.width = w;
    this.canvas.height = h;
    this.ctx = this.canvas.getContext('2d');
    this.lines = new THREE.CanvasTexture(this.canvas);
    this.lines.colorSpace = THREE.SRGBColorSpace;
    // runde Ecken wie die Karten des Bildschirms (Maske für beide Flächen)
    const m = document.createElement('canvas');
    m.width = w;
    m.height = h;
    const mc = m.getContext('2d');
    mc.fillStyle = '#000';
    mc.fillRect(0, 0, w, h);
    mc.fillStyle = '#fff';
    const r = (REAR_RECT.r / REAR_RECT.w) * w;
    mc.beginPath();
    mc.roundRect(0, 0, w, h, r);
    mc.fill();
    this.mask = new THREE.CanvasTexture(m);
    if (!this.place) return;
    // zwei Flächen genau über dem Fenster
    const { group, pw, ph, z } = this.place;
    const R = REAR_RECT;
    const geo = new THREE.PlaneGeometry((R.w / SCREEN_PX[0]) * pw, (R.h / SCREEN_PX[1]) * ph);
    // gespiegelt wie ein Spiegel: links im Bild ist links vom Auto
    const uv = geo.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setX(i, 1 - uv.getX(i));
    const lineGeo = new THREE.PlaneGeometry((R.w / SCREEN_PX[0]) * pw, (R.h / SCREEN_PX[1]) * ph);
    const x = ((R.x + R.w / 2) / SCREEN_PX[0] - 0.5) * pw;
    const y = (0.5 - (R.y + R.h / 2) / SCREEN_PX[1]) * ph;
    // das Bild der Welt wird wie im Innenspiegel getont (toneMapped), die Linien nicht
    this.picture = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: this.rt.texture, alphaMap: this.mask, transparent: true, depthWrite: false }));
    this.overlay = new THREE.Mesh(lineGeo, new THREE.MeshBasicMaterial({ map: this.lines, alphaMap: this.mask, transparent: true, depthWrite: false, toneMapped: false }));
    this.picture.position.set(x, y, z);
    this.overlay.position.set(x, y, z + 0.0004);
    this.picture.renderOrder = 1;
    this.overlay.renderOrder = 2;
    this.picture.visible = this.overlay.visible = false;
    group.add(this.picture, this.overlay);
  }

  /** Pro Bild (Cockpit): on = R eingelegt und Cockpit zu sehen; wheel: Lenkradstellung für die Hilfslinien. */
  update(dt, on, wheel) {
    // eben eingelegt: gleich im nächsten Bild rendern (nie ein altes Bild von der letzten Rückwärtsfahrt)
    if (on && !this.on) {
      if (!this.rt) this.build();
      this.shotT = -Infinity;
    }
    this.on = on;
    if (this.picture) this.picture.visible = this.overlay.visible = on;
    if (!on) {
      this.wheel = NaN;
      return;
    }
    this.acc += dt;
    // die Linien neu zeichnen, wenn sich die Lenkung merklich bewegt hat (höchstens 15-mal je Sekunde)
    if (this.acc < 1 / 15 || Math.abs(wheel - this.wheel) < 0.01) return;
    this.acc = 0;
    this.wheel = wheel;
    this.drawLines(wheel);
    this.lines.needsUpdate = true;
  }

  /** Punkt am Boden hinter dem Wagen (Wagenkoordinaten) → Bildpunkt der gespiegelten Kamera. */
  toPx(x, z) {
    const [w, h] = REAR_CAM.res;
    const v = this.v.set(x, 0, z).project(this.local);
    return [(1 - (v.x + 1) / 2) * w, ((1 - v.y) / 2) * h];
  }

  drawLines(wheel) {
    const ctx = this.ctx;
    const [w, h] = REAR_CAM.res;
    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // rückwärts geht das Heck zur gelenkten Seite: links gelenkt (wheel < 0) biegt die Bahn nach links (−x)
    const k = wheel * GUIDE.k;
    const z0 = REAR_CAM.eye[2] + 0.12;
    const lat = (d) => (k * d * d) / 2;
    const n = 26;
    for (const side of [-1, 1]) {
      // erst eine weiche dunkle Kante, dann die Linie: auf hellem Asphalt wie auf dunklem gut zu sehen
      for (const [color, width] of [['rgba(0,0,0,0.35)', 7], ['#ffd76a', 3.2]]) {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        for (let i = 0; i <= n; i++) {
          const d = (i / n) * GUIDE.len;
          const [px, py] = this.toPx(lat(d) + side * GUIDE.half, z0 + d);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
    }
    // Abstandsmarken quer zwischen den Linien (rot nah, gelb, grün weit)
    for (const [d, color] of GUIDE.marks) {
      const a = this.toPx(lat(d) - GUIDE.half, z0 + d);
      const b = this.toPx(lat(d) + GUIDE.half, z0 + d);
      const tick = (p, q) => {
        ctx.beginPath();
        ctx.moveTo(p[0], p[1]);
        ctx.lineTo(p[0] + (q[0] - p[0]) * 0.22, p[1] + (q[1] - p[1]) * 0.22);
        ctx.stroke();
      };
      for (const [color2, width] of [['rgba(0,0,0,0.35)', 6], [color, 3]]) {
        ctx.strokeStyle = color2;
        ctx.lineWidth = width;
        tick(a, b);
        tick(b, a);
      }
    }
  }

  /**
   * Das Bild der Kamera rendern (main.js, vor dem Cockpit; nur wenn on): toWorld(v) setzt einen Punkt in
   * Wagenkoordinaten in die Welt um (wie beim Innenspiegel), t: Spielzeit (s). force: auch außerhalb ihres Takts (für
   * Prüfbilder, __MA.redraw).
   */
  render(renderer, scene, toWorld, t, quality = 'hoch', force = false) {
    const q = quality === 'niedrig' ? REAR_LOW : REAR_CAM;
    if (!this.on || (!force && t - this.shotT < 0.97 / q.rate)) return;
    this.shotT = t;
    if (this.cam.far !== q.far) {
      this.cam.far = q.far;
      this.cam.updateProjectionMatrix();
    }
    this.cam.position.copy(toWorld(this.eye.fromArray(REAR_CAM.eye)));
    this.cam.lookAt(toWorld(this.at.fromArray(REAR_CAM.look)));
    renderer.setRenderTarget(this.rt);
    renderer.render(scene, this.cam);
    renderer.setRenderTarget(null);
  }
}
