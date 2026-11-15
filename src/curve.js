// „Curved World“: Statt einer echten Kurven-Geometrie wird die Welt im Vertex-Shader
// relativ zur Kamera gebogen. Die Simulation bleibt gerade (einfach & robust),
// optisch gibt es trotzdem sanfte Kurven und Kuppen wie auf einer echten Autobahn.
import * as THREE from 'three';

export const curveUniforms = {
  uCurve: { value: new THREE.Vector2(0, 0) },
};

const PATCH = /* glsl */ `
vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
  mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
  mvPosition = instanceMatrix * mvPosition;
#endif
vec4 cwWorld = modelMatrix * mvPosition;
float cwD = cwWorld.z;
float cwB = cwD * cwD / (1.0 + abs(cwD) * CURVE_K);
cwWorld.x += uCurve.x * cwB;
cwWorld.y += uCurve.y * cwB;
mvPosition = viewMatrix * cwWorld;
gl_Position = projectionMatrix * mvPosition;
`;

// GLSL-Schnipsel für eigene ShaderMaterials
// Ab ca. 700 m wächst die Biegung nur noch linear (sonst fliegt der Horizont weg).
export const CURVE_K = 1 / 700;
const K_GLSL = '#define CURVE_K ' + CURVE_K.toFixed(8) + '\n';

export const CURVE_GLSL = K_GLSL + /* glsl */ `
uniform vec2 uCurve;
vec4 curveWorld(vec4 w) {
  float d = w.z;
  float b = d * d / (1.0 + abs(d) * CURVE_K);
  w.x += uCurve.x * b;
  w.y += uCurve.y * b;
  return w;
}
`;

/** Macht ein eingebautes three.js-Material „kurvig“. */
export function curve(material) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uCurve = curveUniforms.uCurve;
    shader.vertexShader = K_GLSL + 'uniform vec2 uCurve;\n' + shader.vertexShader.replace('#include <project_vertex>', PATCH);
  };
  material.customProgramCacheKey = () => 'curved-world';
  return material;
}

/** Biegt einen Punkt auf der CPU genauso wie der Shader (z. B. für Schilder-Raycasts). */
export function curvePoint(v) {
  const d = v.z;
  const b = (d * d) / (1 + Math.abs(d) * CURVE_K);
  v.x += curveUniforms.uCurve.value.x * b;
  v.y += curveUniforms.uCurve.value.y * b;
  return v;
}

/** Material-Fabrik für die Welt: alle Materialien sind automatisch gebogen. */
export const W = {
  std(params) {
    return curve(new THREE.MeshStandardMaterial(params));
  },
  lambert(params) {
    return curve(new THREE.MeshLambertMaterial(params));
  },
  basic(params) {
    return curve(new THREE.MeshBasicMaterial(params));
  },
  phys(params) {
    return curve(new THREE.MeshPhysicalMaterial(params));
  },
};
