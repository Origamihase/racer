// Regen in der Welt: fallende Regenstriche rund um die Kamera (komplett im Shader animiert)
// und Gischt hinter Lkw und Autos auf nasser Fahrbahn.
import * as THREE from 'three';
import { CURVE_GLSL, curveUniforms } from '../curve.js';
import { softDotTexture } from '../textures.js';
import { smoothstep } from '../util.js';

// Gischt: je Fahrzeug eine feste Zahl Teilchen pro Sekunde (früher je Bild, dann hing die Dichte an der
// Bildrate), schwach und kurzlebig. So bleibt sie ein weicher Schleier tief hinter den Rädern, durch den man
// das Auto davor mit seinen Rücklichtern weiter gut sieht (vorher stapelten sich Hunderte Teilchen zur Wand).
const SPRAY_RATE = 22; // Teilchen pro Sekunde und Auto bei vollem Regen (Lkw: mal amount)
const SPRAY_ALPHA = 0.1;

export class Rain {
  constructor(scene, count = 2600) {
    const pos = new Float32Array(count * 2 * 3);
    const end = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      const x = Math.random() * 60 - 30;
      const y = Math.random() * 24;
      const z = Math.random() * 70 - 55;
      for (let k = 0; k < 2; k++) {
        pos[(i * 2 + k) * 3] = x;
        pos[(i * 2 + k) * 3 + 1] = y;
        pos[(i * 2 + k) * 3 + 2] = z;
        end[i * 2 + k] = k;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aEnd', new THREE.BufferAttribute(end, 1));
    this.uniforms = {
      uTime: { value: 0 },
      uSpeed: { value: 0 },
      uS: { value: 0 },
      uCam: { value: new THREE.Vector3() },
      uOpacity: { value: 0 },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: /* glsl */ `
        attribute float aEnd;
        uniform float uTime;
        uniform float uSpeed;
        uniform float uS;
        uniform vec3 uCam;
        varying float vA;
        void main() {
          vec3 p = position;
          float fall = 11.0;
          p.y = mod(p.y - uTime * fall, 24.0);
          p.z = mod(p.z + uS, 70.0) - 55.0;
          p.x += uCam.x;
          vec3 vel = vec3(0.0, -fall, uSpeed);
          p += normalize(vel) * aEnd * (0.35 + uSpeed * 0.012);
          vA = 1.0 - smoothstep(10.0, 24.0, abs(p.z + 10.0));
          gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        uniform float uOpacity;
        varying float vA;
        void main() { gl_FragColor = vec4(vec3(0.75, 0.8, 0.88), uOpacity * vA * 0.5); }`,
      transparent: true,
      depthWrite: false,
    });
    this.lines = new THREE.LineSegments(g, mat);
    this.lines.frustumCulled = false;
    this.lines.visible = false;
    scene.add(this.lines);

    // Gischt
    this.maxSpray = 700;
    const sp = new Float32Array(this.maxSpray * 3);
    const sa = new Float32Array(this.maxSpray);
    const ss = new Float32Array(this.maxSpray);
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    sg.setAttribute('aAlpha', new THREE.BufferAttribute(sa, 1));
    sg.setAttribute('aSize', new THREE.BufferAttribute(ss, 1));
    this.sprayData = [];
    this.sprayGeo = sg;
    const smat = new THREE.ShaderMaterial({
      uniforms: { tDot: { value: softDotTexture() }, uCurve: curveUniforms.uCurve, uH: { value: 720 } },
      vertexShader: CURVE_GLSL + /* glsl */ `
        attribute float aAlpha;
        attribute float aSize;
        uniform float uH;
        varying float vA;
        varying float vCut;
        void main() {
          vec4 w = curveWorld(modelMatrix * vec4(position, 1.0));
          vec4 mv = viewMatrix * w;
          gl_Position = projectionMatrix * mv;
          // Größe in Metern: gleich groß bei jeder Bildhöhe und jedem Blickwinkel (auch im Rückspiegel)
          float px = aSize * 0.52 * uH * projectionMatrix[1][1] / max(1.0, -mv.z);
          gl_PointSize = px;
          // Die Fahrbahn schneidet den Punkt unten gerade ab: dort vorher weich ausblenden
          vec4 g = projectionMatrix * viewMatrix * curveWorld(modelMatrix * vec4(position.x, 0.0, position.z, 1.0));
          float below = (gl_Position.y / gl_Position.w - g.y / g.w) * 0.5 * uH;
          vCut = 0.5 + below / max(px, 1.0);
          // dicht vor der Kamera ausblenden: sonst legen sich die großen Punkte über die ganze Frontscheibe
          vA = aAlpha * smoothstep(1.5, 6.0, -mv.z);
        }`,
      fragmentShader: /* glsl */ `
        uniform sampler2D tDot;
        varying float vA;
        varying float vCut;
        void main() {
          float a = texture2D(tDot, gl_PointCoord).a;
          a *= 1.0 - smoothstep(vCut - 0.22, vCut, gl_PointCoord.y);
          gl_FragColor = vec4(vec3(0.82, 0.85, 0.9), a * vA);
        }`,
      transparent: true,
      depthWrite: false,
    });
    this.spray = new THREE.Points(sg, smat);
    this.spray.frustumCulled = false;
    // nach den Scheiben des Teslas (renderOrder 2): sonst schneidet dessen Glas dunkle Streifen in den Schleier
    this.spray.renderOrder = 3;
    // Bildhöhe des gerade gezeichneten Ziels (Bildschirm, Rückspiegel, Blitzerfoto)
    const drawSize = new THREE.Vector2();
    this.spray.onBeforeRender = (renderer, _s, _c, _g, material) => {
      const rt = renderer.getRenderTarget();
      material.uniforms.uH.value = rt ? rt.height : renderer.getDrawingBufferSize(drawSize).y;
    };
    scene.add(this.spray);
    this.intensity = 0;
  }

  setPixelScale(h) {
    this.spray.material.uniforms.uH.value = h;
  }

  /**
   * Gischt hinter einem Fahrzeug (x, z: Heckmitte im Kamera-Raum der Welt). amount: Menge relativ zum Auto
   * (Lkw mehr), dt: Zeitschritt, src: Objekt, das den Rest zwischen zwei Bildern aufhebt (das Fahrzeug).
   */
  emit(x, z, width, speed, amount = 1, dt = 1 / 60, src = null) {
    if (this.intensity < 0.15) {
      if (src) src.sprayAcc = 0;
      return;
    }
    // erst ab Tempo spritzt es richtig
    const rate = SPRAY_RATE * amount * this.intensity * smoothstep(4, 22, speed);
    let acc = (src ? src.sprayAcc || 0 : Math.random()) + rate * dt;
    const n = Math.floor(acc);
    acc -= n;
    if (src) src.sprayAcc = acc;
    const big = amount > 1.5;
    for (let i = 0; i < n && this.sprayData.length < this.maxSpray; i++) {
      // aus den Radspuren links und rechts, nicht über die ganze Breite
      const side = Math.random() < 0.5 ? -1 : 1;
      this.sprayData.push({
        x: x + side * (width * 0.5 - 0.32) + (Math.random() - 0.5) * 0.35,
        y: 0.18 + Math.random() * 0.2,
        z: z + Math.random() * 0.4,
        vx: side * Math.random() * 0.6,
        vy: 0.3 + Math.random() * 0.7,
        vz: speed * 0.9,
        life: 0,
        max: 0.5 + Math.random() * 0.3,
        size: (big ? 1.2 : 0.8) + Math.random() * 0.6,
        grow: big ? 2.2 : 1.6,
      });
    }
  }

  update(dt, t, { speed, s, camX, intensity }) {
    this.intensity = intensity;
    const u = this.uniforms;
    u.uTime.value = t;
    u.uSpeed.value = speed;
    u.uS.value = s % 70;
    u.uCam.value.x = camX;
    u.uOpacity.value = intensity;
    this.lines.visible = intensity > 0.02;

    // Gischt bewegt sich relativ zum Spieler: Welt steht, Spieler fährt mit speed
    const pos = this.sprayGeo.attributes.position.array;
    const al = this.sprayGeo.attributes.aAlpha.array;
    const sz = this.sprayGeo.attributes.aSize.array;
    let j = 0;
    const keep = [];
    for (const p of this.sprayData) {
      p.life += dt;
      if (p.life > p.max) continue;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy -= 0.8 * dt;
      p.z += (speed - p.vz * Math.exp(-p.life * 2)) * dt;
      p.size += dt * p.grow;
      keep.push(p);
      pos[j * 3] = p.x;
      pos[j * 3 + 1] = p.y;
      pos[j * 3 + 2] = p.z;
      // kurz einblenden (kein Aufploppen), dann bis zum Ende ausblenden
      al[j] = SPRAY_ALPHA * Math.min(1, p.life / 0.06) * (1 - p.life / p.max) * this.intensity;
      sz[j] = p.size;
      j++;
    }
    this.sprayData = keep;
    this.sprayGeo.setDrawRange(0, j);
    this.sprayGeo.attributes.position.needsUpdate = true;
    this.sprayGeo.attributes.aAlpha.needsUpdate = true;
    this.sprayGeo.attributes.aSize.needsUpdate = true;
    this.spray.visible = j > 0;
  }
}
