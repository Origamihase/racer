// Himmel mit Sonne und ziehenden Wolken, Licht, Nebel, Hügel am Horizont und
// Umgebungsreflexion. Bei Regen zieht es langsam zu (overcast 0 → 1).
import * as THREE from 'three';
import { curveUniforms, CURVE_K } from '../curve.js';
import { lerp, fbm1, clamp } from '../util.js';

// Schattenkasten der Sonne (Licht-Einheiten bei 2048er Schattenkarte, „mittel“ mit 1024 nimmt 0,7 davon): u quer
// zur Straße (±63 m), v längs (rund 220 m, davon 40 m hinter der Kamera, der Rest in Blickrichtung). Am Boden
// sind die Texel etwa so groß wie vorher (rund 6 × 10 cm); der alte Kasten lag aber schräg, reichte gut 50 m nach
// hinten und endete 50–130 m voraus mit einer harten Kante. Am Rand laufen die Schatten jetzt aus: kurz an den
// Seiten und hinten, lang an der fernen Kante (bei „hoch“ von knapp 120 bis 180 m).
const SHADOW = { u: 96, v: 176, back: 40, side: 30, edge: 0.04, far: 0.29 };
// three.js füllt Schatten bis genau an den Kastenrand und schaltet dahinter hart auf „kein Schatten“. Hier laufen
// sie stattdessen weich aus (shadowCoord 0…1 über den Kasten; v wächst in Fahrtrichtung). PCFSoftShadowMap nutzt
// shadowRadius nicht: placeShadow legt dort die Blickrichtung längs der Straße ab (+1 voraus … −1 zurück), damit
// gerade die ferne Kante lang ausläuft und die nahe hinter der Kamera kurz.
const EDGE = SHADOW.edge.toFixed(3);
const FAR = SHADOW.far.toFixed(3);
const FADE = /* glsl */ `
		float shFar = clamp( shadowRadius, - 1.0, 1.0 );
		float shFade = smoothstep( 0.0, ${EDGE}, shadowCoord.x ) * smoothstep( 0.0, ${EDGE}, 1.0 - shadowCoord.x )
			* smoothstep( 0.0, mix( ${EDGE}, ${FAR}, max( - shFar, 0.0 ) ), shadowCoord.y )
			* smoothstep( 0.0, mix( ${EDGE}, ${FAR}, max( shFar, 0.0 ) ), 1.0 - shadowCoord.y );
		return mix( 1.0, shadow, shadowIntensity * shFade );`;
{
  const chunk = THREE.ShaderChunk.shadowmap_pars_fragment;
  const end = 'return mix( 1.0, shadow, shadowIntensity );';
  // nur das erste Vorkommen: getShadow (Richtungslicht); das zweite gehört zu getPointShadow
  if (chunk.includes(end)) THREE.ShaderChunk.shadowmap_pars_fragment = chunk.replace(end, FADE.trim());
}
const _dir = new THREE.Vector3();

const SKY_VERT = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = p.xyww;
}`;

const SKY_FRAG = /* glsl */ `
uniform vec3 uSunDir;
uniform float uOvercast;
uniform vec2 uOffset;
uniform vec3 uFog;
varying vec3 vDir;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}
void main() {
  vec3 d = normalize(vDir);
  float h = d.y;
  vec3 zenith = vec3(0.13, 0.33, 0.82);
  vec3 horizon = vec3(0.62, 0.77, 0.95);
  vec3 col = mix(horizon, zenith, pow(clamp(h, 0.0, 1.0), 0.5));
  float sd = max(dot(d, uSunDir), 0.0);
  float clear = 1.0 - uOvercast;
  col += vec3(1.0, 0.82, 0.55) * pow(sd, 6.0) * 0.28 * clear;
  col += vec3(1.0, 0.92, 0.78) * pow(sd, 90.0) * 1.2 * clear;
  col += vec3(40.0, 35.0, 28.0) * smoothstep(0.99955, 0.9998, sd) * clear;
  if (h > 0.0) {
    vec2 p = d.xz / (h + 0.06) * 0.9 + uOffset;
    float cov = mix(0.56, 0.18, uOvercast);
    float n = fbm(p);
    float c = smoothstep(cov, cov + 0.28, n);
    float shade = 0.72 + 0.28 * fbm(p * 2.1 + 3.0);
    vec3 cloudCol = mix(vec3(1.05, 1.05, 1.08), vec3(0.42, 0.45, 0.5), uOvercast) * shade;
    cloudCol += vec3(1.0, 0.85, 0.6) * pow(sd, 5.0) * 0.5 * clear;
    col = mix(col, cloudCol, c * smoothstep(0.0, 0.1, h) * (0.85 + 0.15 * uOvercast));
  }
  vec3 gray = mix(vec3(0.36, 0.39, 0.44), vec3(0.52, 0.55, 0.6), smoothstep(-0.05, 0.6, h));
  col = mix(col, gray, uOvercast * 0.8);
  col = mix(col, uFog, smoothstep(0.06, -0.02, h));
  gl_FragColor = vec4(col, 1.0);
}`;

export class Sky {
  constructor(renderer, scene, { shadows = true, shadowSize = 2048 } = {}) {
    this.renderer = renderer;
    this.scene = scene;
    this.overcast = 0;
    this.sunDir = new THREE.Vector3(0.52, 0.6, 0.6).normalize();
    this.fogClear = new THREE.Color(0.66, 0.78, 0.92);
    this.fogRain = new THREE.Color(0.43, 0.46, 0.5);
    this.fogColor = this.fogClear.clone();

    this.uniforms = {
      uSunDir: { value: this.sunDir },
      uOvercast: { value: 0 },
      uOffset: { value: new THREE.Vector2(0, 0) },
      uFog: { value: this.fogColor },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: SKY_VERT,
      fragmentShader: SKY_FRAG,
      side: THREE.BackSide,
      depthWrite: false,
      depthTest: true,
      fog: false,
    });
    this.dome = new THREE.Mesh(new THREE.SphereGeometry(3000, 40, 20), mat);
    this.dome.frustumCulled = false;
    this.dome.renderOrder = -10;
    scene.add(this.dome);

    scene.fog = new THREE.Fog(this.fogColor, 140, 1550);
    // Nebel und Himmel teilen sich dieselbe Farbe, damit der Horizont im Regen mitgraut
    scene.fog.color = this.fogColor;

    // Licht
    this.sun = new THREE.DirectionalLight(0xfff0dc, 3.0);
    this.sun.castShadow = shadows;
    // Schattenkamera immer einrichten, damit ein späteres Umschalten auf „mittel“/„hoch“ sofort passt
    this.sun.shadow.mapSize.set(shadowSize, shadowSize);
    const c = this.sun.shadow.camera;
    // „oben“ im Schattenbild ist Fahrtrichtung: so laufen die Seitenkanten des Kastens am Boden längs der Straße
    c.up.set(0, 0, -1);
    c.near = 10;
    c.far = 400;
    this.sun.shadow.bias = -0.0005;
    this.sun.shadow.normalBias = 0.04;
    // Achsen des Schattenbilds (wie three.js sie mit lookAt bildet): eU quer, rein waagrecht; eV längs
    this.eU = new THREE.Vector3().crossVectors(c.up, this.sunDir).normalize();
    this.eV = new THREE.Vector3().crossVectors(this.sunDir, this.eU);
    this.shadowK = 0;
    this.shadowBox();
    scene.add(this.sun);
    scene.add(this.sun.target);
    this.hemi = new THREE.HemisphereLight(0xc4dcff, 0x5f6a45, 1.05);
    scene.add(this.hemi);

    // Hügelkette am Horizont
    this.hills = this.buildHills();
    scene.add(this.hills);

    // Umgebungs-Szene für Reflexionen
    this.pmrem = new THREE.PMREMGenerator(renderer);
    this.envScene = new THREE.Scene();
    const envDome = new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16), mat);
    this.envScene.add(envDome);
    this.envGround = new THREE.Mesh(
      new THREE.CircleGeometry(48, 24).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(0.16, 0.17, 0.13) }),
    );
    this.envGround.position.y = -2;
    this.envScene.add(this.envGround);
    this.envTarget = null;
    this.lastEnvOvercast = -1;
    this.updateEnv();
  }

  buildHills() {
    const N = 320;
    const R = 1950;
    const pos = [];
    const col = [];
    const idx = [];
    const near = new THREE.Color().setRGB(0.3, 0.42, 0.33, THREE.SRGBColorSpace);
    const far = new THREE.Color().setRGB(0.5, 0.6, 0.7, THREE.SRGBColorSpace);
    const H = (u) => 25 + Math.max(0, fbm1(u * 0.09, 4) * 0.5 + 0.5) * 150 + Math.max(0, fbm1(u * 0.31, 9)) * 40;
    // Der Ring schließt sich genau vor dem Auto: die letzten Stützpunkte laufen weich auf
    // die Höhe des ersten zu, sonst stünde dort eine senkrechte Felskante über der Fahrbahn.
    const SEAM = 48;
    for (let i = 0; i <= N; i++) {
      const a = (i / N) * Math.PI * 2;
      const x = Math.sin(a) * R;
      const z = -Math.cos(a) * R;
      const w = Math.max(0, (i - (N - SEAM)) / SEAM);
      const h = w > 0 ? lerp(H(i), H(i - N), w * w * (3 - 2 * w)) : H(i);
      pos.push(x, -40, z, x, h, z);
      const c1 = near.clone().lerp(far, 0.25);
      const c2 = near.clone().lerp(far, 0.7 + 0.2 * Math.sin((i / N) * Math.PI * 6));
      col.push(c1.r, c1.g, c1.b, c2.r, c2.g, c2.b);
      if (i < N) {
        const p = i * 2;
        idx.push(p, p + 2, p + 1, p + 1, p + 2, p + 3);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    g.setIndex(idx);
    this.hillMat = new THREE.MeshBasicMaterial({ vertexColors: true, fog: false, side: THREE.DoubleSide, transparent: true, opacity: 1 });
    const m = new THREE.Mesh(g, this.hillMat);
    m.frustumCulled = false;
    m.renderOrder = -5;
    return m;
  }

  updateEnv() {
    if (this.envTarget) this.envTarget.dispose();
    this.envTarget = this.pmrem.fromScene(this.envScene, 0.02, 0.1, 100);
    this.scene.environment = this.envTarget.texture;
    this.lastEnvOvercast = this.overcast;
    if (this.onEnv) this.onEnv(this.envTarget.texture);
  }

  setOvercast(v) {
    this.overcast = clamp(v, 0, 1);
  }

  /** Schattenkasten passend zur Schattenkarte der Qualitätsstufe (2048: voll, 1024: 0,7). Gibt den Faktor zurück. */
  shadowBox() {
    const sh = this.sun.shadow;
    const k = sh.mapSize.x >= 2048 ? 1 : 0.7;
    if (k !== this.shadowK) {
      this.shadowK = k;
      const cam = sh.camera;
      cam.left = (-SHADOW.u * k) / 2;
      cam.right = (SHADOW.u * k) / 2;
      cam.bottom = (-SHADOW.v * k) / 2;
      cam.top = (SHADOW.v * k) / 2;
      cam.updateProjectionMatrix();
    }
    return k;
  }

  /**
   * Schattenkasten (siehe SHADOW) dorthin legen, wohin die Kamera schaut: 40 m hinter ihr bis gut 180 m vor ihr,
   * bei Blick zur Seite (Titel) entsprechend quer. Er rastet auf ganze Texel der Welt ein (die Welt rückt mit s
   * nach +z): sonst wandern die Treppchen an Schattenkanten beim Fahren mit und flimmern.
   */
  placeShadow(camera, s) {
    const sh = this.sun.shadow;
    const size = sh.mapSize.x;
    const k = this.shadowBox();
    const W = SHADOW.u * k;
    const V = SHADOW.v * k;
    // Blickrichtung am Boden
    camera.getWorldDirection(_dir);
    const len = Math.hypot(_dir.x, _dir.z);
    const fx = len > 1e-3 ? _dir.x / len : 0;
    const fz = len > 1e-3 ? _dir.z / len : -1;
    const eU = this.eU;
    const eV = this.eV;
    // Kastenmitte am Boden: quer zwischen Straßenmitte und Kamera wie bisher, dazu in Blickrichtung verschoben
    const halfX = W / 2 / eU.x;
    const halfZ = V / 2 / -eV.z;
    const x = camera.position.x * 0.5 + fx * (halfX - SHADOW.side * k);
    const z = camera.position.z + fz * (halfZ - SHADOW.back * k);
    // auf das Texelraster der Welt einrasten (eU hat keinen z-Anteil, nur v wandert mit s)
    const tu = W / size;
    const tv = V / size;
    const u = Math.round((eU.x * x) / tu) * tu;
    const sv = eV.z * s;
    const v = Math.round((eV.x * x + eV.z * z - sv) / tv) * tv + sv;
    const cx = u / eU.x;
    this.sun.target.position.set(cx, 0, (v - eV.x * cx) / eV.z);
    this.sun.position.copy(this.sun.target.position).addScaledVector(this.sunDir, 200);
    sh.radius = -fz;
  }

  update(dt, camera, s, t) {
    const o = this.overcast;
    this.uniforms.uOvercast.value = o;
    const off = this.uniforms.uOffset.value;
    off.x += dt * 0.004;
    off.y = -s * 0.0006 - t * 0.002;
    this.fogColor.copy(this.fogClear).lerp(this.fogRain, o);
    const fog = this.scene.fog;
    fog.near = lerp(140, 18, o);
    fog.far = lerp(1550, 430, o);
    this.sun.intensity = lerp(3.0, 0.32, o);
    this.hemi.intensity = lerp(1.05, 1.35, o);
    this.hemi.color.setRGB(lerp(0.77, 0.6, o), lerp(0.86, 0.64, o), lerp(1.0, 0.7, o));
    this.hillMat.opacity = 1 - o;
    this.hillMat.color.setRGB(1, 1, 1).lerp(this.fogColor, 0.15 + o * 0.6);
    this.hills.visible = o < 0.98;

    this.dome.position.copy(camera.position);
    const B = (d) => (d * d) / (1 + d * CURVE_K);
    const cu = curveUniforms.uCurve.value;
    this.hills.position.set(camera.position.x + cu.x * B(1950) * 0.7, cu.y * B(1950) * 0.8, 0);

    this.placeShadow(camera, s);
    this.envGround.material.color.setRGB(lerp(0.16, 0.1, o), lerp(0.17, 0.11, o), lerp(0.13, 0.11, o));
    if (Math.abs(o - this.lastEnvOvercast) > 0.12) this.updateEnv();
  }
}
