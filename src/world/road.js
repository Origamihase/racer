// Die Autobahn: zwei Richtungsfahrbahnen mit je vier Fahrstreifen und Standstreifen,
// Mittelleitplanke, Schutzplanken, Leitpfosten und die leuchtende „freigeschaltete“ linke Spur.
// Alles liegt im Kamera-Raum (Spieler bei z = 0) und wird per Textur-Offset bzw. Modulo verschoben.
import * as THREE from 'three';
import { W, CURVE_GLSL, curveUniforms } from '../curve.js';
import { ROAD, roadTexture, grassTexture, fieldTexture, guardrailTexture } from '../textures.js';

export const MEDIAN_X = -9.0; // Mitte der Mittelleitplanke
export const ONCOMING = (x) => 2 * MEDIAN_X - x; // spiegelt eine x-Position auf die Gegenfahrbahn
export const VIEW_BEHIND = 140;
export const VIEW_AHEAD = 1700;
// Helligkeit allen Grases (Bankett, Dämme an den Brücken): wird bei Regen dunkler, siehe setWet
export const GRASS_TINT = new THREE.Color(1, 1, 1);

/** z-Reihen: vorne dicht, in der Ferne grober (die Krümmung braucht Stützpunkte). */
function makeRows(behind = VIEW_BEHIND, ahead = VIEW_AHEAD) {
  const rows = [];
  let z = behind;
  while (z > -ahead) {
    rows.push(z);
    z -= 2 + Math.abs(z) * 0.018;
  }
  rows.push(-ahead);
  return rows;
}
export const ROWS = makeRows();

/**
 * Streifen-Geometrie zwischen zwei Querschnittspunkten (a → b) entlang aller z-Reihen.
 * uvFn(x, y, z, side) → [u, v]
 */
export function stripGeometry(segments, rows = ROWS) {
  const pos = [];
  const uv = [];
  const idx = [];
  let base = 0;
  for (const seg of segments) {
    const { a, b, uv: uvFn } = seg;
    for (let i = 0; i < rows.length; i++) {
      const z = rows[i];
      pos.push(a[0], a[1], z, b[0], b[1], z);
      const ua = uvFn(a[0], a[1], z, 0);
      const ub = uvFn(b[0], b[1], z, 1);
      uv.push(ua[0], ua[1], ub[0], ub[1]);
    }
    for (let i = 0; i < rows.length - 1; i++) {
      const p = base + i * 2;
      // Reihen laufen von hinten (z > 0) nach vorne (z < 0)
      if (seg.flip) idx.push(p, p + 2, p + 1, p + 1, p + 2, p + 3);
      else idx.push(p, p + 1, p + 2, p + 1, p + 3, p + 2);
    }
    base += rows.length * 2;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

export class Road {
  constructor(scene) {
    this.group = new THREE.Group();
    this.group.name = 'Road';
    scene.add(this.group);
    this.s = 0;
    this.wet = 0;

    // --- Fahrbahnen ------------------------------------------------------
    this.roadTex = roadTexture();
    this.roadMat = W.std({ map: this.roadTex, roughness: 0.9, metalness: 0.0, envMapIntensity: 0.3 });
    const L = ROAD.texLength;
    const roadUV = (x, y, z) => [(x - ROAD.left) / ROAD.width, -z / L];
    const oppUV = (x, y, z) => [(ONCOMING(x) - ROAD.left) / ROAD.width, -z / L];
    const roadGeo = stripGeometry([
      { a: [ROAD.left, 0], b: [ROAD.right, 0], uv: roadUV },
      { a: [ONCOMING(ROAD.right), 0], b: [ONCOMING(ROAD.left), 0], uv: oppUV },
    ]);
    this.road = new THREE.Mesh(roadGeo, this.roadMat);
    this.road.receiveShadow = true;
    this.road.frustumCulled = false;
    this.group.add(this.road);

    // --- Gras-Bankette und Felder ---------------------------------------
    this.grassTex = grassTexture();
    this.grassTex.repeat.set(1, 1);
    this.grassMat = W.lambert({ map: this.grassTex });
    this.grassMat.color = GRASS_TINT;
    const gUV = (x, y, z) => [x / 6, -z / 6];
    const verge = stripGeometry([
      { a: [ROAD.right, 0.0], b: [ROAD.right + 3.2, 0.15], uv: gUV },
      { a: [ROAD.right + 3.2, 0.15], b: [36, 0.25], uv: gUV },
      { a: [ONCOMING(ROAD.left), 0], b: [ROAD.left, 0], uv: gUV },
      { a: [-52, 0.25], b: [ONCOMING(ROAD.right) - 3.2, 0.15], uv: gUV },
      { a: [ONCOMING(ROAD.right) - 3.2, 0.15], b: [ONCOMING(ROAD.right), 0.0], uv: gUV },
    ]);
    this.verge = new THREE.Mesh(verge, this.grassMat);
    this.verge.receiveShadow = true;
    this.verge.frustumCulled = false;
    this.group.add(this.verge);

    this.fieldTex = fieldTexture();
    this.fieldMat = W.lambert({ map: this.fieldTex });
    const fUV = (x, y, z) => [x / 160, -z / 160];
    const ground = stripGeometry([
      { a: [36, 0.25], b: [420, 0.25], uv: fUV },
      { a: [420, 0.25], b: [2600, -6], uv: fUV },
      { a: [-420, 0.25], b: [-52, 0.25], uv: fUV },
      { a: [-2600, -6], b: [-420, 0.25], uv: fUV },
    ]);
    this.ground = new THREE.Mesh(ground, this.fieldMat);
    this.ground.receiveShadow = true;
    this.ground.frustumCulled = false;
    this.group.add(this.ground);

    // --- Schutzplanken --------------------------------------------------
    this.railTex = guardrailTexture();
    this.railMat = W.std({ map: this.railTex, metalness: 0.75, roughness: 0.38, envMapIntensity: 0.9, side: THREE.DoubleSide });
    const rUV = (x, y, z, side) => [-z / 4, side];
    const rails = [];
    const addRail = (x, facing) => {
      // facing: +1 = Front zeigt nach +x
      const y0 = 0.52;
      const y1 = 0.84;
      rails.push({ a: [x, y0], b: [x, y1], uv: rUV, flip: facing > 0 });
      rails.push({ a: [x - 0.08 * facing, y1], b: [x, y1 + 0.01], uv: rUV, flip: facing < 0 });
    };
    addRail(MEDIAN_X + 0.16, 1);
    addRail(MEDIAN_X - 0.16, -1);
    addRail(ROAD.right + 0.55, -1);
    addRail(ONCOMING(ROAD.right) - 0.55, 1);
    this.rails = new THREE.Mesh(stripGeometry(rails), this.railMat);
    this.rails.castShadow = false;
    this.rails.receiveShadow = true;
    this.rails.frustumCulled = false;
    this.group.add(this.rails);

    // Pfosten (alle 2 m) – periodische Instanzen, verschoben um s mod 2
    const postGeo = new THREE.BoxGeometry(0.1, 0.8, 0.07);
    postGeo.translate(0, 0.4, 0);
    const postMat = W.std({ color: 0x8e9398, metalness: 0.6, roughness: 0.5 });
    this.postSpacing = 2;
    const postX = [MEDIAN_X, ROAD.right + 0.72, ONCOMING(ROAD.right) - 0.72];
    const nPosts = Math.floor(700 / this.postSpacing);
    this.posts = new THREE.InstancedMesh(postGeo, postMat, nPosts * postX.length);
    const m4 = new THREE.Matrix4();
    let k = 0;
    for (const x of postX) {
      for (let i = 0; i < nPosts; i++) {
        m4.makeTranslation(x, 0, VIEW_BEHIND * 0.5 - i * this.postSpacing);
        this.posts.setMatrixAt(k++, m4);
      }
    }
    this.posts.frustumCulled = false;
    this.posts.castShadow = true;
    this.group.add(this.posts);

    // Leitpfosten (alle 50 m): weiß mit schwarzem Band und Reflektor
    this.delinSpacing = 50;
    const delin = new THREE.Group();
    // Band 5 mm über den Seiten des Pfostens, Reflektor 1 cm vor dem Band (vorher 2,5 und 1,5 mm), beide mit
    // Polygon-Offset (der Reflektor mit doppeltem), damit sie auch in der Ferne nicht flimmern
    // der Pfosten reicht bis 2 cm ins Bankett (dort ~0,05 m hoch), statt 7 cm darüber zu schweben
    const dGeo = new THREE.BoxGeometry(0.12, 1.09, 0.12);
    dGeo.translate(0, 0.455, 0);
    const bandGeo = new THREE.BoxGeometry(0.13, 0.25, 0.13);
    bandGeo.translate(0, 0.82, 0);
    const reflGeo = new THREE.PlaneGeometry(0.05, 0.12);
    reflGeo.translate(0, 0.82, 0.075);
    const nD = Math.ceil((VIEW_AHEAD * 0.6) / this.delinSpacing);
    const whiteMat = W.std({ color: 0xf2f2ee, roughness: 0.6 });
    const blackMat = W.std({ color: 0x111111, roughness: 0.6, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -4 });
    const reflMat = W.std({ color: 0xffa020, emissive: 0xff7a00, emissiveIntensity: 0.9, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -8 });
    const dMesh = new THREE.InstancedMesh(dGeo, whiteMat, nD);
    const bMesh = new THREE.InstancedMesh(bandGeo, blackMat, nD);
    const rMesh = new THREE.InstancedMesh(reflGeo, reflMat, nD);
    for (let i = 0; i < nD; i++) {
      m4.makeTranslation(ROAD.right + 1.05, 0.12, VIEW_BEHIND * 0.5 - i * this.delinSpacing);
      dMesh.setMatrixAt(i, m4);
      bMesh.setMatrixAt(i, m4);
      rMesh.setMatrixAt(i, m4);
    }
    for (const mm of [dMesh, bMesh, rMesh]) {
      mm.frustumCulled = false;
      delin.add(mm);
    }
    this.delin = delin;
    this.group.add(delin);

    // --- Leuchtende linke Spur ------------------------------------------
    this.laneUniforms = {
      uTime: { value: 0 },
      uS: { value: 0 },
      uOpacity: { value: 0 },
      uWarn: { value: 0 },
    };
    const laneMat = new THREE.ShaderMaterial({
      uniforms: { ...this.laneUniforms, uCurve: { value: null } },
      vertexShader: CURVE_GLSL + /* glsl */ `
        varying vec2 vUv;
        varying float vDist;
        void main() {
          vUv = uv;
          vec4 w = modelMatrix * vec4(position, 1.0);
          vDist = -w.z;
          w = curveWorld(w);
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform float uS;
        uniform float uOpacity;
        uniform float uWarn;
        varying vec2 vUv;
        varying float vDist;
        void main() {
          float p = uS + vDist;
          float x = vUv.x * 2.0 - 1.0;
          float chev = fract((p + abs(x) * 2.2) / 7.0 - uTime * 0.35);
          chev = smoothstep(0.0, 0.08, chev) * (1.0 - smoothstep(0.18, 0.3, chev));
          float edge = smoothstep(0.82, 0.97, abs(x));
          float wave = exp(-abs(fract((p - uTime * 55.0) / 160.0) - 0.5) * 18.0);
          float a = 0.16 + chev * 0.42 + edge * 0.55 + wave * 0.35;
          float fade = smoothstep(2.0, 12.0, vDist + 6.0) * (1.0 - smoothstep(250.0, 650.0, vDist));
          vec3 col = mix(vec3(0.24, 0.55, 1.0), vec3(0.35, 1.0, 0.75), 0.35 + 0.35 * sin(uTime * 2.0));
          col = mix(col, vec3(1.0, 0.35, 0.2), uWarn);
          gl_FragColor = vec4(col * 1.6, a * fade * uOpacity);
        }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    laneMat.uniforms.uCurve = curveUniforms.uCurve;
    const laneGeo = stripGeometry([
      { a: [ROAD.laneCenter(0) - 1.8, 0.025], b: [ROAD.laneCenter(0) + 1.8, 0.025], uv: (x) => [(x - (ROAD.laneCenter(0) - 1.8)) / 3.6, 0] },
    ]);
    this.lane = new THREE.Mesh(laneGeo, laneMat);
    this.lane.frustumCulled = false;
    this.lane.renderOrder = 1;
    this.lane.visible = false;
    this.group.add(this.lane);
  }

  /** Nässe 0…1 (Regen): Asphalt dunkler und spiegelnder. */
  setWet(w) {
    this.wet = w;
    this.roadMat.roughness = 0.9 - w * 0.64;
    this.roadMat.color.setScalar(1 - w * 0.42);
    this.roadMat.envMapIntensity = 0.3 + w * 1.2;
    this.railMat.roughness = 0.38 - w * 0.2;
    this.grassMat.color.setScalar(1 - w * 0.25);
    this.fieldMat.color.setScalar(1 - w * 0.28);
  }

  update(s, dt, t, laneOpacity, laneWarn = 0) {
    this.s = s;
    this.roadTex.offset.y = (s / ROAD.texLength) % 1;
    this.grassTex.offset.y = (s / 6) % 1;
    this.fieldTex.offset.y = (s / 160) % 1;
    this.railTex.offset.x = (s / 4) % 1;
    this.posts.position.z = s % this.postSpacing;
    this.delin.position.z = s % this.delinSpacing;
    this.laneUniforms.uTime.value = t;
    // 1120 m = kgV aus Pfeilabstand (7 m) und Lichtwelle (160 m), damit beim Umbruch nichts springt
    this.laneUniforms.uS.value = s % 1120;
    this.laneUniforms.uOpacity.value = laneOpacity;
    this.laneUniforms.uWarn.value = laneWarn;
    this.lane.visible = laneOpacity > 0.001;
  }
}
