// Wind in Bäumen, Büschen und Farn: Die Spitzen schwingen ein paar Zentimeter, der Fuß bleibt stehen.
//
// Jede Pflanzen-Geometrie bekommt das Attribut cwWind (0 am Boden … bis 1 an der Spitze, quadratisch mit der Höhe,
// kleine Pflanzen etwas weniger), der Vertex-Shader (PROJECT in curve.js, CW_WIND) verschiebt die Punkte nach dem
// Legen der Instanz in Richtung des Winds, derselben, mit der die Wolkenschatten ziehen. Böen laufen in Windrichtung
// über das Land, jede Pflanze hat dazu ihren eigenen Takt aus ihrer Lage. Die Schatten der Sonne schwingen mit
// (eigenes Tiefen-Material), die der weiten Schattenkarte nicht: Dort sind ein paar Zentimeter weniger als ein Punkt.
//
// Höchstens WIND.max Meter: Die Hüllen der Reihen (curveBound) haben 0,25 m Luft, mehr darf sich nichts bewegen.
import * as THREE from 'three';
import { W, CLOUD } from '../curve.js';

const len = Math.hypot(CLOUD.wind[0], CLOUD.wind[1]);
export const WIND = {
  dir: [CLOUD.wind[0] / len, CLOUD.wind[1] / len],
  fair: 0.075, // Ausschlag je Einheit des Takts in m bei schönem Wetter …
  rain: 0.115, // … und bei Regen
  peak: 1.25, // größter Wert des Takts (0,55 + 0,25 + 0,45)
  max: 0.15,
  tall: 6, // ab dieser Höhe (m) schwingt eine Pflanze voll, kleinere weniger
};
if (WIND.rain * WIND.peak > WIND.max + 1e-9) throw new Error('wind.js: Wind zu stark für die Hüllen der Reihen');

// x: Zeit in s, y: Ausschlag in m
export const windUniforms = { uWind: { value: new THREE.Vector2(0, WIND.fair) } };

/** Wind für dieses Bild: t = Zeit des Winds in Sekunden, o = Bewölkung 0 … 1. */
export function setWind(t, o) {
  windUniforms.uWind.value.set(t, WIND.fair + (WIND.rain - WIND.fair) * Math.min(Math.max(o, 0), 1));
}

/** Trägt cwWind in eine Pflanzen-Geometrie ein (Fuß bei y = 0). */
export function windGeo(geo) {
  if (geo.attributes.cwWind) return geo;
  const p = geo.attributes.position;
  let h = 0;
  for (let i = 0; i < p.count; i++) h = Math.max(h, p.getY(i));
  const k = Math.min(Math.max(h / WIND.tall, 0.35), 1);
  const a = new Float32Array(p.count);
  for (let i = 0; i < p.count; i++) {
    const s = h > 0 ? Math.max(p.getY(i), 0) / h : 0;
    a[i] = s * s * k;
  }
  geo.setAttribute('cwWind', new THREE.BufferAttribute(a, 1));
  return geo;
}

/** Ausschlag einer Pflanze in m (Takt × Stärke), dieselbe Rechnung wie im Shader: für den Prüfstand. */
export function windSway(x, z, t, w = 1) {
  const A = windUniforms.uWind.value.y;
  const ph = (x * WIND.dir[0] + z * WIND.dir[1]) * 0.08 + x * 0.031 - z * 0.047;
  const s = Math.sin(t * 1.3 - ph) * 0.55 + Math.sin(t * 2.9 - ph * 1.7) * 0.25 + 0.45;
  return A * w * s;
}

export const WIND_GLSL = /* glsl */ `
{
  vec2 cwB = instanceMatrix[ 3 ].xz;
  float cwPh = dot( cwB, vec2( ${WIND.dir[0].toFixed(6)}, ${WIND.dir[1].toFixed(6)} ) ) * 0.08 + cwB.x * 0.031 - cwB.y * 0.047;
  float cwS = sin( uWind.x * 1.3 - cwPh ) * 0.55 + sin( uWind.x * 2.9 - cwPh * 1.7 ) * 0.25 + 0.45;
  mvPosition.xz += vec2( ${WIND.dir[0].toFixed(6)}, ${WIND.dir[1].toFixed(6)} ) * ( uWind.y * cwWind * cwS );
}
`;
// die Stelle in PROJECT (curve.js): nach dem Legen der Instanz, vor dem Biegen der Welt
const MARK = '  // CW_WIND\n';
const PREFIX = '#define CW_WIND\nuniform vec2 uWind;\nattribute float cwWind;\n';

function addWind(material, key) {
  const before = material.onBeforeCompile;
  material.onBeforeCompile = (shader, renderer) => {
    if (before) before.call(material, shader, renderer);
    shader.uniforms.uWind = windUniforms.uWind;
    if (!shader.vertexShader.includes(MARK)) throw new Error('wind.js: Stelle für den Wind fehlt (curve.js, PROJECT)');
    shader.vertexShader = PREFIX + shader.vertexShader.replace(MARK, WIND_GLSL);
  };
  material.customProgramCacheKey = () => key;
  return material;
}

/**
 * Material für Pflanzen: wie W.lambert({ vertexColors: true }), dazu der Wind. depth gehört als customDepthMaterial
 * an jedes InstancedMesh damit, sonst stünden die Schatten still.
 */
export function windMaterials() {
  const mat = addWind(W.lambert({ vertexColors: true }), 'curved-world-wind');
  // Tiefen-Material wie das von three.js für die Sonne (RGBA gepackt); dessen Shader ist schon gebogen (curve.js)
  const depth = addWind(new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking }), 'depth-wind');
  return { mat, depth };
}
