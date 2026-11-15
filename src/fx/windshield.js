// Regentropfen auf der Frontscheibe + der automatische Scheibenwischer (Beta), der immer
// wieder anspringen will, aber meistens nur kurz zuckt – und dabei Wasser verschmiert.
// Die Tropfen liegen in Scheiben-Koordinaten und werden jedes Bild auf den Bildschirm projiziert.
import * as THREE from 'three';
import { dropSprite } from '../textures.js';
import { WINDSHIELD, WIPERS } from '../cockpit/cockpit.js';
import { clamp, rand, chance, lerp } from '../util.js';

const CW = 640;
const CH = 360;
const FW = 160;
const FH = 90;

export class Windshield {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = CW;
    this.canvas.height = CH;
    this.ctx = this.canvas.getContext('2d');
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.generateMipmaps = false;
    this.texture.minFilter = THREE.LinearFilter;
    this.film = document.createElement('canvas');
    this.film.width = FW;
    this.film.height = FH;
    this.fctx = this.film.getContext('2d');
    this.fctx.fillStyle = '#000';
    this.fctx.fillRect(0, 0, FW, FH);
    this.filmTex = new THREE.CanvasTexture(this.film);
    this.filmTex.generateMipmaps = false;
    this.filmTex.minFilter = THREE.LinearFilter;
    this.sprite = dropSprite();
    this.drops = [];
    this.intensity = 0;
    this.firmware = 0;
    this.enabled = true;
    this.wiper = { angle: 0, mode: 'park', t: 0, dur: 0, amp: 0, queue: 0, pause: 0, prevAngle: 0 };
    this.autoTimer = 2.5;
    this.onEvent = null; // (type) => {}
    this.tmp = new THREE.Vector3();
    this.camPos = new THREE.Vector3();
    this.twitches = 0;
    this.wipes = 0;
    this.dirty = true;
  }

  setRain(v) {
    this.intensity = clamp(v, 0, 1);
  }

  setFirmware(level) {
    this.firmware = level;
  }

  get angles() {
    const a = this.wiper.angle;
    return [a * (WIPERS[0].max / 2.15), a * (WIPERS[1].max / 2.15)];
  }

  /** Wischer manuell auslösen (Taste). Gibt zurück, was passiert ist. */
  manual() {
    if (this.wiper.mode !== 'park') return null;
    const p = [0.18, 0.42, 0.62, 0.82][this.firmware] ?? 0.18;
    if (chance(p)) {
      this.startSweep();
      return 'wipe';
    }
    this.startTwitch(1 + Math.floor(Math.random() * 2));
    return 'twitch';
  }

  startTwitch(n = 1) {
    this.wiper.mode = 'twitch';
    this.wiper.t = 0;
    this.wiper.dur = rand(0.18, 0.3);
    this.wiper.amp = rand(0.28, 0.66);
    this.wiper.queue = n - 1;
    this.twitches++;
    this.onEvent && this.onEvent('twitch');
  }

  startSweep() {
    this.wiper.mode = 'sweep';
    this.wiper.t = 0;
    this.wiper.dur = 1.0;
    this.wiper.amp = 2.15;
    this.wipes++;
    this.onEvent && this.onEvent('wipe');
  }

  update(dt, { speed, camera, carMatrix }) {
    const w = this.wiper;
    w.prevAngle = w.angle;
    // --- Automatik (Beta) ---------------------------------------------
    if (this.intensity > 0.05 && w.mode === 'park') {
      this.autoTimer -= dt;
      if (this.autoTimer <= 0) {
        this.autoTimer = rand(1.4, 3.8) / (0.6 + this.intensity * 0.6);
        const sweepP = [0.0, 0.18, 0.36, 0.55][this.firmware] ?? 0;
        if (chance(sweepP)) this.startSweep();
        else this.startTwitch(1 + Math.floor(Math.random() * 3));
      }
    }
    if (w.mode === 'twitch') {
      w.t += dt;
      const k = w.t / w.dur;
      w.angle = k < 1 ? w.amp * Math.sin(Math.PI * k) * (1 - 0.3 * k) : 0;
      if (k >= 1) {
        w.angle = 0;
        if (w.queue > 0) {
          w.queue--;
          w.mode = 'pause';
          w.pause = rand(0.08, 0.25);
        } else w.mode = 'park';
      }
    } else if (w.mode === 'pause') {
      w.pause -= dt;
      if (w.pause <= 0) {
        w.mode = 'twitch';
        w.t = 0;
        w.dur = rand(0.15, 0.28);
        w.amp = rand(0.2, 0.55);
      }
    } else if (w.mode === 'sweep') {
      w.t += dt;
      const k = w.t / w.dur;
      w.angle = k < 1 ? w.amp * Math.sin(Math.PI * Math.min(1, k)) ** 0.8 : 0;
      if (k >= 1) {
        w.angle = 0;
        w.mode = 'park';
      }
    }

    // --- Tropfen erzeugen ----------------------------------------------
    const W = WINDSHIELD;
    if (this.intensity > 0) {
      const rate = this.intensity * (22 + speed * 1.3);
      let n = rate * dt;
      while (n > 0) {
        if (Math.random() < n) {
          const u = Math.random() * W.length;
          const half = lerp(W.halfBase, W.halfTop, u / W.length);
          const big = Math.random() < 0.08;
          this.drops.push({
            x: (Math.random() * 2 - 1) * half,
            u,
            r: big ? rand(0.006, 0.011) : rand(0.0022, 0.0058),
            life: 0,
          });
        }
        n -= 1;
      }
    }
    // Fahrtwind schiebt Tropfen nach oben, langsam rutschen sie nach unten
    const up = Math.max(0, speed - 14) * 0.0055;
    for (const d of this.drops) {
      d.life += dt;
      const mobility = clamp((d.r - 0.003) / 0.006, 0, 1);
      d.u += (up * mobility - (1 - Math.min(1, speed / 14)) * 0.02 * mobility) * dt;
      d.x += Math.sin(d.life * 3 + d.r * 1000) * 0.002 * mobility * dt * (speed / 30);
    }
    this.drops = this.drops.filter((d) => d.u > -0.02 && d.u < W.length + 0.02 && !(this.intensity < 0.01 && d.life > 6));

    // --- Wischer räumen ab ------------------------------------------
    const a0 = Math.min(w.prevAngle, w.angle);
    const a1 = Math.max(w.prevAngle, w.angle);
    if (a1 > 0.01 && a1 - a0 > 0.0001) {
      const twitch = w.mode !== 'sweep';
      for (let i = 0; i < WIPERS.length; i++) {
        const wp = WIPERS[i];
        const scale = wp.max / 2.15;
        const lo = a0 * scale - 0.04;
        const hi = a1 * scale + 0.04;
        const px = wp.pivot.x;
        const pu = this.pivotU(wp.pivot);
        this.drops = this.drops.filter((d) => {
          const gx = d.x - px;
          const gu = d.u - pu;
          const r = Math.hypot(gx, gu);
          if (r < 0.06 || r > wp.length + 0.015) return true;
          const phi = Math.atan2(gu, gx);
          return !(phi >= lo && phi <= hi);
        });
        this.paintFilm(camera, carMatrix, wp, a0 * scale, a1 * scale, twitch);
      }
    }
    if (this.drops.length > 520) this.drops.splice(0, this.drops.length - 520);

    // Film trocknet langsam, bei Regen bleibt ein leichter Schleier
    this.fctx.globalCompositeOperation = 'source-over';
    this.fctx.fillStyle = `rgba(0,0,0,${clamp(dt * 0.35, 0, 1)})`;
    this.fctx.fillRect(0, 0, FW, FH);
    if (this.intensity > 0) {
      this.fctx.fillStyle = `rgba(255,255,255,${dt * 0.05 * this.intensity})`;
      this.fctx.fillRect(0, 0, FW, FH);
    }
    this.filmTex.needsUpdate = true;

    this.draw(camera, carMatrix);
  }

  pivotU(p) {
    const W = WINDSHIELD;
    return this.tmp.copy(p).sub(W.base).dot(W.U);
  }

  glassToScreen(x, u, camera, carMatrix, out) {
    const W = WINDSHIELD;
    this.tmp.copy(W.base).addScaledVector(W.U, u);
    this.tmp.x = x;
    this.tmp.applyMatrix4(carMatrix);
    const dist = this.tmp.distanceTo(camera.position);
    this.tmp.project(camera);
    out.x = (this.tmp.x * 0.5 + 0.5) * CW;
    out.y = (0.5 - this.tmp.y * 0.5) * CH;
    out.z = this.tmp.z;
    out.d = dist;
    return out;
  }

  paintFilm(camera, carMatrix, wp, a0, a1, twitch) {
    const pu = this.pivotU(wp.pivot);
    const pts = [];
    const p = { x: 0, y: 0 };
    const steps = 6;
    for (let i = 0; i <= steps; i++) {
      const a = a0 + ((a1 - a0) * i) / steps;
      this.glassToScreen(wp.pivot.x + Math.cos(a) * wp.length, pu + Math.sin(a) * wp.length, camera, carMatrix, p);
      pts.push([p.x * (FW / CW), p.y * (FH / CH)]);
    }
    this.glassToScreen(wp.pivot.x, pu, camera, carMatrix, p);
    const ctx = this.fctx;
    ctx.beginPath();
    ctx.moveTo(p.x * (FW / CW), p.y * (FH / CH));
    for (const q of pts) ctx.lineTo(q[0], q[1]);
    ctx.closePath();
    if (twitch) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = `rgba(255,255,255,${0.06 + this.intensity * 0.12})`;
      ctx.fill();
    } else {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.85)';
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#000';
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  draw(camera, carMatrix) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CW, CH);
    if (!this.enabled || this.drops.length === 0) {
      this.texture.needsUpdate = true;
      return;
    }
    const f = CH / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    const p = { x: 0, y: 0, z: 0, d: 1 };
    for (const d of this.drops) {
      this.glassToScreen(d.x, d.u, camera, carMatrix, p);
      if (p.z > 1) continue;
      const rpx = Math.max(1.2, (d.r / p.d) * f * 2.3);
      const stretch = 1 + Math.min(2.2, d.life < 0.4 ? 0 : (d.r > 0.004 ? 0.35 : 0));
      ctx.drawImage(this.sprite, p.x - rpx, p.y - rpx * stretch, rpx * 2, rpx * 2 * stretch);
    }
    this.texture.needsUpdate = true;
  }

  clear() {
    this.drops = [];
    this.fctx.fillStyle = '#000';
    this.fctx.fillRect(0, 0, FW, FH);
    this.filmTex.needsUpdate = true;
    this.ctx.clearRect(0, 0, CW, CH);
    this.texture.needsUpdate = true;
  }
}

// ---------------------------------------------------------------------------
// Bildkomposition: Weltbild + Tropfen-Lichtbrechung + Wasserfilm + Effekte
export function createCompositeMaterial(sceneTex, ws) {
  return new THREE.ShaderMaterial({
    uniforms: {
      tScene: { value: sceneTex },
      tDrops: { value: ws.texture },
      tFilm: { value: ws.filmTex },
      uDrops: { value: 1 },
      uRain: { value: 0 },
      uTexel: { value: new THREE.Vector2(1 / 1280, 1 / 720) },
      uFlash: { value: 0 },
      uFlashColor: { value: new THREE.Color(1, 1, 1) },
      uFade: { value: 0 },
      uGreen: { value: 0 },
      uGlitch: { value: 0 },
      uTime: { value: 0 },
      uVignette: { value: 0.35 },
      uSat: { value: 1.08 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D tScene;
      uniform sampler2D tDrops;
      uniform sampler2D tFilm;
      uniform float uDrops;
      uniform float uRain;
      uniform vec2 uTexel;
      uniform float uFlash;
      uniform vec3 uFlashColor;
      uniform float uFade;
      uniform float uGreen;
      uniform float uGlitch;
      uniform float uTime;
      uniform float uVignette;
      uniform float uSat;
      varying vec2 vUv;
      void main() {
        vec2 uv = vUv;
        if (uGlitch > 0.0) {
          float band = floor(uv.y * 30.0) + floor(uTime * 24.0);
          float r = fract(sin(band * 91.7) * 4375.85);
          uv.x += (r - 0.5) * 0.08 * uGlitch * step(0.6, r);
        }
        vec4 d = texture2D(tDrops, uv) * uDrops;
        float mask = clamp(d.a * (0.4 + d.b), 0.0, 1.0);
        vec2 n = (d.rg - 0.5) * 2.0;
        float film = texture2D(tFilm, uv).r * uDrops;
        vec2 suv = uv - n * mask * 0.06;
        vec3 col = texture2D(tScene, suv).rgb;
        float blur = film * 2.6 + mask * 0.7 + uRain * 0.25 * uDrops;
        if (blur > 0.04) {
          vec3 acc = col;
          for (int i = 0; i < 8; i++) {
            float a = float(i) * 0.7853 + 0.3;
            vec2 o = vec2(cos(a), sin(a)) * uTexel * (2.0 + blur * 7.0);
            acc += texture2D(tScene, suv + o).rgb;
          }
          col = mix(col, acc / 9.0, clamp(blur, 0.0, 1.0));
        }
        float l = dot(col, vec3(0.299, 0.587, 0.114));
        col = mix(col, vec3(l) * 1.02 + 0.03, clamp(film * 0.45, 0.0, 0.6));
        col *= 1.0 - mask * 0.22 * (1.0 - n.y * 0.5);
        col += mask * pow(max(0.0, n.y), 4.0) * 0.35;
        col = mix(vec3(dot(col, vec3(0.299, 0.587, 0.114))), col, uSat);
        col = mix(col, uFlashColor * 4.0, clamp(uFlash, 0.0, 1.0));
        vec2 vc = vUv - 0.5;
        col *= 1.0 - dot(vc, vc) * uVignette;
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        float g = dot(gl_FragColor.rgb, vec3(0.3, 0.6, 0.1));
        gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.08, 1.0, 0.25) * (0.3 + g), uGreen * 0.65);
        gl_FragColor.rgb *= 1.0 - uFade;
      }`,
    depthTest: false,
    depthWrite: false,
  });
}
