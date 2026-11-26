// Die Autobahn: zwei Richtungsfahrbahnen mit je vier Fahrstreifen und Standstreifen,
// Mittelleitplanke, Schutzplanken, Leitpfosten und die leuchtende „freigeschaltete“ linke Spur.
// Alles liegt im Kamera-Raum (Spieler bei z = 0) und wird per Textur-Offset bzw. Modulo verschoben.
import * as THREE from 'three';
import { W, CURVE_GLSL, curveUniforms } from '../curve.js';
import { ROAD, roadTexture, grassTexture, guardrailTexture } from '../textures.js';

export const MEDIAN_X = -9.0; // Mitte der Mittelleitplanke
export const ONCOMING = (x) => 2 * MEDIAN_X - x; // spiegelt eine x-Position auf die Gegenfahrbahn
export const VIEW_BEHIND = 140;
export const VIEW_AHEAD = 1700;
// Helligkeit allen Grases (Bankett, Dämme an den Brücken): wird bei Regen dunkler, siehe setWet
export const GRASS_TINT = new THREE.Color(1, 1, 1);
// Asphalt trocken und bei Nässe w (0 … 1: dunkler und spiegelnder): für die Autobahn und für die Straßen der XXL-Welt
// (roadkit.js), damit der Belag an Ausfahrt und Auffahrt ohne Kante weiterläuft
export const ASPHALT = { roughness: 0.9, metalness: 0, envMapIntensity: 0.3 };
export function wetAsphalt(m, w) {
  m.roughness = ASPHALT.roughness - w * 0.64;
  m.color.setScalar(1 - w * 0.42);
  m.envMapIntensity = ASPHALT.envMapIntensity + w * 1.2;
}

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

// Zonen der flachen Fahrbahn (XXL-Welt): w = Meter hinter der Gabelung bzw. vor dem Einfädelpunkt.
// road: Blockmarkierung statt der rechten Fahrstreifenbegrenzung auf dem Verzögerungs- bzw. Beschleunigungsstreifen
// (w −len…0), kein äußerer Rand in der Sperrfläche (w 0…gore) · verge: rechts nur bis zur Winkelhalbierenden des
// Keils (das Gebiet der Rampe) · rail: rechte Planke, Pfosten und Leitpfosten offen, bis Rampe und Autobahn Platz
// für eigene Planken haben (w 0…railGap). Alles: nur zwischen Anfang und Ende der Fahrbahn.
// Z: { railGap, gore, lane (Länge der Streifen), cap, kappa, wedgeSum (Asphaltränder von Autobahn + Rampe) }
/** So viele Brücken der gezeichneten Autobahn spart das Bankett höchstens aus (gerade Zahl; Abstand ≥ 310 m). */
export const BR_SLOTS = 8;
function zoneGlsl(Z) {
  return /* glsl */ `
uniform vec4 uXxlJ;
uniform vec2 uXxlClip;
uniform vec4 uXxlBr[${BR_SLOTS / 2}];
varying float vXxlX;
varying float vXxlD;
float xxlW(float dj, float t) { return t > 0.5 ? vXxlD - dj : t < -0.5 ? dj - vXxlD : -1e6; }
float xxlR(float u) { float v = max(u, 0.0); float q = min(v, ${Z.cap.toFixed(3)}); return q * (v - q * 0.5) * ${Z.kappa.toFixed(6)}; }
`;
}
// Lage für die Zonen: x quer und Meter voraus in der geraden Simulation, vor jeder Biegung der Welt. Hängt sich an
// begin_vertex, das der Biege-Shader aus curve.js (alt wie neu) nicht ersetzt, auch nicht im Schattenpass.
function zoneVertex(src) {
  return 'varying float vXxlX;\nvarying float vXxlD;\n' + src.replace(
    '#include <begin_vertex>',
    `#include <begin_vertex>
  #ifdef USE_INSTANCING
    vXxlX = (instanceMatrix * vec4(transformed, 1.0)).x;
    vXxlD = -(modelMatrix * instanceMatrix * vec4(transformed, 1.0)).z;
  #else
    vXxlX = transformed.x;
    vXxlD = -(modelMatrix * vec4(transformed, 1.0)).z;
  #endif`,
  );
}
function zonePatch(material, kind, uniforms, Z) {
  const base = material.onBeforeCompile;
  material.onBeforeCompile = (sh) => {
    base(sh);
    Object.assign(sh.uniforms, uniforms);
    sh.vertexShader = zoneVertex(sh.vertexShader);
    let frag = /* glsl */ `
      if (vXxlD < uXxlClip.x || vXxlD > uXxlClip.y) discard;
      float xxlW0 = xxlW(uXxlJ.x, uXxlJ.y);
      float xxlW1 = xxlW(uXxlJ.z, uXxlJ.w);`;
    if (kind === 'verge') {
      // auf Brücken liegen statt der Bankette die Kappen (xxl/bridges.js)
      frag += /* glsl */ `
      for (int i = 0; i < ${BR_SLOTS / 2}; i++) {
        vec4 br = uXxlBr[i];
        if ((vXxlD > br.x && vXxlD < br.y) || (vXxlD > br.z && vXxlD < br.w)) discard;
      }`;
      frag += /* glsl */ `
      if (vXxlX > ${ROAD.right.toFixed(2)}) {
        if (xxlW0 >= 0.0 && vXxlX > (${Z.wedgeSum.toFixed(3)} + xxlR(xxlW0)) * 0.5) discard;
        if (xxlW1 >= 0.0 && vXxlX > (${Z.wedgeSum.toFixed(3)} + xxlR(xxlW1)) * 0.5) discard;
      }`;
    } else if (kind === 'rail') {
      frag += /* glsl */ `
      if (vXxlX > ${ROAD.right.toFixed(2)} && ((xxlW0 >= 0.0 && xxlW0 < ${Z.railGap.toFixed(2)}) || (xxlW1 >= 0.0 && xxlW1 < ${Z.railGap.toFixed(2)}))) discard;`;
    }
    sh.fragmentShader = zoneGlsl(Z) + sh.fragmentShader.replace('#include <clipping_planes_fragment>', frag + '\n#include <clipping_planes_fragment>');
    if (kind === 'road') {
      // Lücken der Blockmarkierung und die gelöschte Randlinie zeigen den Asphalt daneben (gleiche Ableitungen, keine Naht)
      sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>', /* glsl */ `
      vec2 xxlUv = vMapUv;
      float xxlShift = 0.0;
      if (vXxlX > 7.42 && vXxlX < 7.88) {
        if ((xxlW0 > -${Z.lane.toFixed(1)} && xxlW0 < 0.0 && mod(-xxlW0, 12.0) > 6.0) || (xxlW1 > -${Z.lane.toFixed(1)} && xxlW1 < 0.0 && mod(-xxlW1, 12.0) > 6.0)) xxlShift = 0.6;
      } else if (vXxlX > 10.08 && vXxlX < 10.42) {
        if ((xxlW0 >= 0.0 && xxlW0 < ${Z.gore.toFixed(1)}) || (xxlW1 >= 0.0 && xxlW1 < ${Z.gore.toFixed(1)})) xxlShift = 0.6;
      }
      xxlUv.x -= xxlShift / ${ROAD.width.toFixed(4)};
      vec4 sampledDiffuseColor = textureGrad( map, xxlUv, dFdx( vMapUv ), dFdy( vMapUv ) );
      diffuseColor *= sampledDiffuseColor;`);
    }
  };
  material.customProgramCacheKey = () => 'curved-world-xxl-' + kind;
}

/**
 * Schattenmaterial der Pfosten (XXL): dieselben Lücken und Enden wie zonePatch(…, 'rail'). Der Schattenpass zeichnet
 * sonst mit dem Standard-Tiefenmaterial, und unsichtbare Pfosten hinter dem Ende einer Autobahn oder in der Lücke der
 * Planke am Keil würden Schatten werfen.
 */
function zoneDepth(uniforms, Z) {
  const m = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uniforms);
    sh.vertexShader = zoneVertex(sh.vertexShader);
    sh.fragmentShader = zoneGlsl(Z) + sh.fragmentShader.replace('#include <clipping_planes_fragment>', /* glsl */ `
      if (vXxlD < uXxlClip.x || vXxlD > uXxlClip.y) discard;
      float xxlW0 = xxlW(uXxlJ.x, uXxlJ.y);
      float xxlW1 = xxlW(uXxlJ.z, uXxlJ.w);
      if (vXxlX > ${ROAD.right.toFixed(2)} && ((xxlW0 >= 0.0 && xxlW0 < ${Z.railGap.toFixed(2)}) || (xxlW1 >= 0.0 && xxlW1 < ${Z.railGap.toFixed(2)}))) discard;
#include <clipping_planes_fragment>`);
  };
  m.customProgramCacheKey = () => 'xxl-depth-rail';
  return m;
}

export class Road {
  /**
   * Bankette flach bei y = 0 (Breite opts.verge, Polygon-Offset opts.vergeLayer), kein ferner Boden (den liefert die
   * Welt, xxl/ground.js), Zonen für Lücken in der rechten Planke, Blockmarkierung und Anfang/Ende der Fahrbahn
   * (opts.zone, siehe setZones), opts.behind: so weit reichen die Reihen nach hinten.
   */
  constructor(scene, opts = {}) {
    this.group = new THREE.Group();
    this.group.name = 'Road';
    scene.add(this.group);
    this.s = 0;
    this.wet = 0;
    const rows = makeRows(opts.behind || VIEW_BEHIND);

    // --- Fahrbahnen ------------------------------------------------------
    this.roadTex = roadTexture();
    this.roadMat = W.std({ map: this.roadTex, ...ASPHALT });
    const L = ROAD.texLength;
    const roadUV = (x, y, z) => [(x - ROAD.left) / ROAD.width, -z / L];
    const oppUV = (x, y, z) => [(ONCOMING(x) - ROAD.left) / ROAD.width, -z / L];
    const roadGeo = stripGeometry([
      { a: [ROAD.left, 0], b: [ROAD.right, 0], uv: roadUV },
      { a: [ONCOMING(ROAD.right), 0], b: [ONCOMING(ROAD.left), 0], uv: oppUV },
    ], rows);
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
    // ein gemähter Streifen je Seite und der Mittelstreifen; dahinter liegt der Boden der Welt
    const verge = stripGeometry([
      { a: [ROAD.right - 0.02, 0], b: [ROAD.right + opts.verge, 0], uv: gUV },
      { a: [ONCOMING(ROAD.left), 0], b: [ROAD.left, 0], uv: gUV },
      { a: [ONCOMING(ROAD.right) - opts.verge, 0], b: [ONCOMING(ROAD.right) + 0.02, 0], uv: gUV },
    ], rows);
    Object.assign(this.grassMat, opts.vergeLayer);
    this.verge = new THREE.Mesh(verge, this.grassMat);
    this.verge.receiveShadow = true;
    this.verge.frustumCulled = false;
    this.group.add(this.verge);

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
    this.rails = new THREE.Mesh(stripGeometry(rails, rows), this.railMat);
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
      // der Pfosten reicht 2 cm in den Boden (das Bankett liegt bei y = 0)
      m4.makeTranslation(ROAD.right + 1.05, 0.07, VIEW_BEHIND * 0.5 - i * this.delinSpacing);
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
    this.zoneU = { uXxlJ: { value: new THREE.Vector4(1e6, 0, 1e6, 0) }, uXxlClip: { value: new THREE.Vector2(-1e6, 1e6) }, uXxlBr: { value: Array.from({ length: BR_SLOTS / 2 }, () => new THREE.Vector4(1e6, 1e6, 1e6, 1e6)) } };
    zonePatch(this.roadMat, 'road', this.zoneU, opts.zone);
    zonePatch(this.grassMat, 'verge', this.zoneU, opts.zone);
    for (const m of [this.railMat, postMat, whiteMat, blackMat, reflMat]) zonePatch(m, 'rail', this.zoneU, opts.zone);
    this.posts.customDepthMaterial = zoneDepth(this.zoneU, opts.zone);

    // --- Leuchtende linke Spur ------------------------------------------
    this.laneUniforms = {
      uTime: { value: 0 },
      uS: { value: 0 },
      uOpacity: { value: 0 },
      uWarn: { value: 0 },
    };
    // Anfang und Ende der Fahrbahn in Metern vor dem Spieler (siehe setZones): Das Leuchten hört mit dem Asphalt auf,
    // statt hinter dem Ende einer Autobahn über die Wiese weiterzulaufen
    const laneMat = new THREE.ShaderMaterial({
      uniforms: { ...this.laneUniforms, uCurve: { value: null }, uXxlClip: this.zoneU.uXxlClip },
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
        uniform vec2 uXxlClip;
        varying vec2 vUv;
        varying float vDist;
        void main() {
          if (vDist < uXxlClip.x || vDist > uXxlClip.y) discard;
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

  /**
   * Bis zu zwei Knotenpunkte in Metern vor dem Spieler (dist, type +1 Ausfahrt / −1 Einfädeln,
   * 0 = keiner) und das Stück der Fahrbahn, das existiert (begin, end, ebenfalls in Metern vor dem Spieler).
   */
  setZones(d0, t0, d1, t1, begin, end) {
    this.zoneU.uXxlJ.value.set(d0, t0, d1, t1);
    this.zoneU.uXxlClip.value.set(begin, end);
  }

  /**
   * Bis zu BR_SLOTS Brücken der Autobahn in Metern vor dem Spieler: [[a, b], …] (dort kein Bankett, die Kappen der
   * Brücke liegen darüber).
   */
  setBridges(spans) {
    const v = this.zoneU.uXxlBr.value;
    for (let i = 0; i < BR_SLOTS; i++) {
      const sp = spans[i];
      const a = sp ? sp[0] : 1e6;
      const b = sp ? sp[1] : 1e6;
      if (i & 1) v[i >> 1].z = a, v[i >> 1].w = b;
      else v[i >> 1].x = a, v[i >> 1].y = b;
    }
  }

  /** Nässe 0…1 (Regen): Asphalt dunkler und spiegelnder. */
  setWet(w) {
    this.wet = w;
    wetAsphalt(this.roadMat, w);
    this.railMat.roughness = 0.38 - w * 0.2;
    this.grassMat.color.setScalar(1 - w * 0.25);
  }

  update(s, dt, t, laneOpacity, laneWarn = 0) {
    this.s = s;
    this.roadTex.offset.y = (s / ROAD.texLength) % 1;
    this.grassTex.offset.y = (s / 6) % 1;
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
