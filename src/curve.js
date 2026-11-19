// „Curved World“: Die Simulation bleibt eine gerade Straße (s längs, x quer, y hoch), gezeichnet wird sie entlang
// ihres echten Verlaufs (src/game/course.js). Ein Punkt, den die Simulation d Meter vor dem Spieler (z = −d) bei x, y
// hinstellt, erscheint bei Q(d) + x · N(d) + (y + Y(d)) · oben: Q ist die Linie x = 0 der Straße, N ihre rechte
// Normale, Y die Höhe – alles relativ zum Spieler, der immer bei z = 0 in Richtung −z fährt. So biegen sich gerade
// Dinge sanft mit der Straße, und was am Rand steht, dreht sich mit ihr.
//
// Die Tabelle (Q, Kurs, Höhe, Krümmung …) steckt in EINER Textur, die wie früher die Kurve `uCurve` heißt: Jeder
// eigene Shader, der `uCurve: curveUniforms.uCurve` bindet und `curveWorld()` aus CURVE_GLSL aufruft, biegt sich mit.
import * as THREE from 'three';

/** Tabelle: N Stützstellen im Abstand DS ab D0 Meter (hinter dem Spieler negativ). */
export const CURVE_N = 512;
export const CURVE_D0 = -400;
export const CURVE_DS = 7.5;
// Innen in engen Kurven: ab diesem Anteil des Radius rückt alles weich zusammen (nie über den Mittelpunkt hinaus)
const U0 = 0.7;
// Rückfaltung: Nach einer großen Wende (Schleife eines Kleeblatts, 270°) fiele die ferne Welt wieder auf die nahe,
// Felder und Bäume von hinter der Schleife lägen auf der eigenen Fahrbahn. Was weiter als FOLD.d voraus liegt, aber
// näher am Spieler erscheint als FOLD.lo · d, sinkt deshalb tief unter den Boden (weich bis FOLD.hi · d). Auf
// gewöhnlichen Straßen (auch Kehren und Landstraßen-Schlangen) bleibt das Verhältnis über 0,6: dort ändert sich nichts.
const FOLD = { d: 200, lo: 0.22, hi: 0.32, sink: 60 };

// Zeile 0: Qx, Qz, Kurs theta (links positiv), Höhe Y · Zeile 1: Krümmung kappa (1/m, links positiv), Bezugslinie
// xref (dort ist die Abbildung längentreu), Steigung, frei
const DATA = new Float32Array(CURVE_N * 2 * 4);
const TEX = new THREE.DataTexture(DATA, CURVE_N, 2, THREE.RGBAFormat, THREE.FloatType);
TEX.minFilter = TEX.magFilter = THREE.NearestFilter;
TEX.generateMipmaps = false;

export const curveUniforms = {
  uCurve: { value: TEX },
};

/** Schreibzugriff für den Kurs (course.fill): Stützstelle j setzen, danach commit(). */
export const curveTable = {
  n: CURVE_N,
  d0: CURVE_D0,
  ds: CURVE_DS,
  data: DATA,
  set(j, qx, qz, th, y, k, xr, g) {
    const a = j * 4;
    const b = (CURVE_N + j) * 4;
    DATA[a] = qx;
    DATA[a + 1] = qz;
    DATA[a + 2] = th;
    DATA[a + 3] = y;
    DATA[b] = k;
    DATA[b + 1] = xr;
    DATA[b + 2] = g;
  },
  /** Gerade, ebene Welt (Prüfstand ?debug und Ausgangszustand). */
  flat() {
    for (let j = 0; j < CURVE_N; j++) this.set(j, 0, -(CURVE_D0 + j * CURVE_DS), 0, 0, 0, 0, 0);
  },
  /** Neue Werte zur Grafikkarte; mit renderer sofort (die Schattenkarte entsteht vor allem anderen im Bild). */
  commit(renderer) {
    TEX.needsUpdate = true;
    if (renderer) renderer.initTexture(TEX);
  },
};
curveTable.flat();

// --- GLSL -----------------------------------------------------------------------------------------------
const DEFS = `#define CW_N ${CURVE_N}
#define CW_D0 ${CURVE_D0.toFixed(1)}
#define CW_DS ${CURVE_DS.toFixed(4)}
#define CW_U0 ${U0.toFixed(4)}
#define CW_FOLD_D ${FOLD.d.toFixed(1)}
#define CW_FOLD_LO ${FOLD.lo.toFixed(4)}
#define CW_FOLD_HI ${FOLD.hi.toFixed(4)}
#define CW_SINK ${FOLD.sink.toFixed(1)}
`;

/**
 * GLSL für eigene Shader: uniform uCurve, curveWorld(w) biegt eine Weltlage, curveWorldN zusätzlich die Normale.
 * (Die Erklärungen stehen hier statt im GLSL, damit sie nicht in jedem Shader mitgeschickt werden.)
 *
 * cwSample(d): Bahn an der Stelle d: Q, Kurs th, Höhe Y, Krümmung k (und ihre Ableitung dk), Bezugslinie xr,
 * Steigung g. Zwischen zwei Stützstellen kubisch (Hermite mit den Ableitungen aus der Tabelle): keine Knicke, keine
 * Facetten. Jenseits der Tabelle geht es geradeaus und eben weiter.
 *
 * cwOffset(x, k, xr): Querlage. Innen ab CW_U0 · Radius weich zum Kurvenmittelpunkt hin gestaucht, nie über ihn
 * hinaus. Was dort steht, schrumpft im selben Maß fx auch in der Höhe: tief in einer engen Kurve wird es klein wie in
 * der Ferne, statt zur dünnen Nadel gequetscht zu werden. Ausgaben: fx = ∂f/∂x (zugleich Höhenfaktor),
 * fk = ∂f/∂kappa, hx = ∂fx/∂x, hk = ∂fx/∂kappa (für die Normalen).
 *
 * cwSink(d, p): wie tief ein Punkt d Meter voraus, der bei p erscheint, unter den Boden sinkt (Rückfaltung, siehe
 * FOLD).
 *
 * curveWorldN(w, n): wie curveWorld, dreht und neigt zusätzlich die Normale n (Kameraraum) mit der Verformung:
 * inverse Transponierte der Jacobi-Matrix in den Achsen quer (N), hoch und längs (T). Tief innen (ab etwa 1,5 Radien)
 * ist alles zu einem winzigen Fleck zusammengedrückt: dort bleibt die Stauchung für das Licht begrenzt, sonst liefen
 * die Normalen über.
 */
export const CURVE_GLSL = DEFS + /* glsl */ `
uniform sampler2D uCurve;
void cwSample(float d, out vec2 Q, out float th, out float Y, out float k, out float dk, out float xr, out float g) {
  float u = (d - CW_D0) / CW_DS;
  float j = clamp(floor(u), 0.0, float(CW_N - 2));
  float t = u - j;
  float tc = clamp(t, 0.0, 1.0);
  ivec2 ia = ivec2(int(j), 0);
  vec4 a0 = texelFetch(uCurve, ia, 0);
  vec4 b0 = texelFetch(uCurve, ia + ivec2(1, 0), 0);
  vec4 a1 = texelFetch(uCurve, ia + ivec2(0, 1), 0);
  vec4 b1 = texelFetch(uCurve, ia + ivec2(1, 1), 0);
  float t2 = tc * tc;
  float t3 = t2 * tc;
  float h00 = 2.0 * t3 - 3.0 * t2 + 1.0;
  float h10 = (t3 - 2.0 * t2 + tc) * CW_DS;
  float h01 = 3.0 * t2 - 2.0 * t3;
  float h11 = (t3 - t2) * CW_DS;
  vec2 Ta = vec2(-sin(a0.z), -cos(a0.z));
  vec2 Tb = vec2(-sin(b0.z), -cos(b0.z));
  Q = h00 * a0.xy + h10 * (1.0 - a1.y * a1.x) * Ta + h01 * b0.xy + h11 * (1.0 - b1.y * b1.x) * Tb;
  th = h00 * a0.z + h10 * a1.x + h01 * b0.z + h11 * b1.x;
  Y = h00 * a0.w + h10 * a1.z + h01 * b0.w + h11 * b1.z;
  k = mix(a1.x, b1.x, tc);
  dk = (b1.x - a1.x) / CW_DS;
  xr = mix(a1.y, b1.y, tc);
  g = mix(a1.z, b1.z, tc);
  float e = (t - tc) * CW_DS;
  if (e != 0.0) {
    Q += e * (t < 0.0 ? Ta : Tb);
    k = 0.0;
    dk = 0.0;
    g = 0.0;
  }
}
float cwOffset(float x, float k, float xr, out float fx, out float fk, out float hx, out float hk) {
  float u = (xr - x) * k;
  fx = 1.0;
  fk = 0.0;
  hx = 0.0;
  hk = 0.0;
  if (u <= CW_U0) return x;
  float e = exp((CW_U0 - u) / (1.0 - CW_U0));
  float gu = 1.0 - (1.0 - CW_U0) * e;
  fx = e;
  fk = (gu - u * e) / (k * k);
  hx = e * k / (1.0 - CW_U0);
  hk = e * (x - xr) / (1.0 - CW_U0);
  return xr - gu / k;
}
float cwSink(float d, vec2 p) {
  if (d < CW_FOLD_D) return 0.0;
  return CW_SINK * (1.0 - smoothstep(CW_FOLD_LO * d, CW_FOLD_HI * d, length(p)));
}
vec4 curveWorld(vec4 w) {
  vec2 Q; float th; float Y; float k; float dk; float xr; float g; float fx; float fk; float hx; float hk;
  cwSample(-w.z, Q, th, Y, k, dk, xr, g);
  float f = cwOffset(w.x, k, xr, fx, fk, hx, hk);
  vec2 p = vec2(Q.x + f * cos(th), Q.y - f * sin(th));
  return vec4(p.x, w.y * fx + Y - cwSink(-w.z, p), p.y, w.w);
}
vec4 curveWorldN(vec4 w, inout vec3 n) {
  vec2 Q; float th; float Y; float k; float dk; float xr; float g; float fx; float fk; float hx; float hk;
  cwSample(-w.z, Q, th, Y, k, dk, xr, g);
  float f = cwOffset(w.x, k, xr, fx, fk, hx, hk);
  float c = cos(th);
  float s = sin(th);
  mat3 vr = mat3(viewMatrix);
  vec3 nw = transpose(vr) * n;
  float nU = nw.y / max(fx, 0.02);
  float nN = (nw.x - w.y * hx * nU) / max(fx, 0.02);
  float nT = (-nw.z - fk * dk * nN - (w.y * hk * dk + g) * nU) / max(1.0 + (f - xr) * k, 0.02);
  n = vr * (nN * vec3(c, 0.0, -s) + vec3(0.0, nU, 0.0) + nT * vec3(-s, 0.0, -c));
  vec2 p = vec2(Q.x + f * c, Q.y - f * s);
  return vec4(p.x, w.y * fx + Y - cwSink(-w.z, p), p.y, w.w);
}
`;

// Ersatz für three.js' project_vertex / worldpos_vertex: gebogene Weltlage cwPos, auch für die Schattenabfrage
const PROJECT = /* glsl */ `
vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
  mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
  mvPosition = instanceMatrix * mvPosition;
#endif
vec4 cwPos = modelMatrix * mvPosition;
#ifdef CW_NORMALS
  cwPos = curveWorldN( cwPos, transformedNormal );
  #ifndef FLAT_SHADED
    vNormal = normalize( transformedNormal );
  #endif
#else
  cwPos = curveWorld( cwPos );
#endif
mvPosition = viewMatrix * cwPos;
gl_Position = projectionMatrix * mvPosition;
`;
const WORLDPOS = /* glsl */ `
#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
  vec4 worldPosition = cwPos;
#endif
`;

function patchVertex(src) {
  // Normalen gibt es nur, wo three.js sie auch für das Licht braucht
  const normals = src.includes('#include <normal_vertex>') ? '#define CW_NORMALS\n' : '';
  return normals + CURVE_GLSL + src.replace('#include <project_vertex>', PROJECT).replace('#include <worldpos_vertex>', WORLDPOS);
}

// Schattenwerfer werden genauso gebogen wie das, was man sieht: three.js zeichnet die Schattenkarte mit eigenen
// Tiefen-Materialien, deren Shader hier einmal für alle mitgebogen werden (es gibt nur die Welt-Schatten der Sonne,
// das Cockpit hat keine). Ihre Uniform-Kopien teilen sich die Textur über deren Quelle (siehe curveTable.commit).
for (const lib of [THREE.ShaderLib.depth, THREE.ShaderLib.distanceRGBA]) {
  lib.vertexShader = patchVertex(lib.vertexShader);
  lib.uniforms.uCurve = { value: TEX };
}

/** Macht ein eingebautes three.js-Material „kurvig“. */
export function curve(material) {
  material.userData.curved = true;
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uCurve = curveUniforms.uCurve;
    shader.vertexShader = patchVertex(shader.vertexShader);
  };
  material.customProgramCacheKey = () => 'curved-world';
  return material;
}

// --- dasselbe auf der CPU (gleiche Formeln wie im Shader, z. B. für Kamera, Schilder, Raycasts) ----------------
/** Bahn an der Stelle d (Meter voraus): x, z der Linie x = 0, Kurs th, Höhe y, Krümmung k, dk, Bezugslinie xr, Steigung g. */
export const curveFrame = { x: 0, z: 0, th: 0, y: 0, k: 0, dk: 0, xr: 0, g: 0 };
export function curveAt(d, out = curveFrame) {
  const u = (d - CURVE_D0) / CURVE_DS;
  const j = Math.min(Math.max(Math.floor(u), 0), CURVE_N - 2);
  const t = u - j;
  const tc = Math.min(Math.max(t, 0), 1);
  const a = j * 4;
  const b = a + 4;
  const a1 = (CURVE_N + j) * 4;
  const b1 = a1 + 4;
  const t2 = tc * tc;
  const t3 = t2 * tc;
  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = (t3 - 2 * t2 + tc) * CURVE_DS;
  const h01 = 3 * t2 - 2 * t3;
  const h11 = (t3 - t2) * CURVE_DS;
  const sa = (1 - DATA[a1 + 1] * DATA[a1]) * h10;
  const sb = (1 - DATA[b1 + 1] * DATA[b1]) * h11;
  out.x = h00 * DATA[a] - sa * Math.sin(DATA[a + 2]) + h01 * DATA[b] - sb * Math.sin(DATA[b + 2]);
  out.z = h00 * DATA[a + 1] - sa * Math.cos(DATA[a + 2]) + h01 * DATA[b + 1] - sb * Math.cos(DATA[b + 2]);
  out.th = h00 * DATA[a + 2] + h10 * DATA[a1] + h01 * DATA[b + 2] + h11 * DATA[b1];
  out.y = h00 * DATA[a + 3] + h10 * DATA[a1 + 2] + h01 * DATA[b + 3] + h11 * DATA[b1 + 2];
  out.k = DATA[a1] + (DATA[b1] - DATA[a1]) * tc;
  out.dk = (DATA[b1] - DATA[a1]) / CURVE_DS;
  out.xr = DATA[a1 + 1] + (DATA[b1 + 1] - DATA[a1 + 1]) * tc;
  out.g = DATA[a1 + 2] + (DATA[b1 + 2] - DATA[a1 + 2]) * tc;
  const e = (t - tc) * CURVE_DS;
  if (e !== 0) {
    const th = DATA[(t < 0 ? a : b) + 2];
    out.x -= e * Math.sin(th);
    out.z -= e * Math.cos(th);
    out.k = 0;
    out.dk = 0;
    out.g = 0;
  }
  return out;
}

/** Querlage nach der Stauchung innen (siehe cwOffset im Shader). */
export function curveOffset(x, k, xr) {
  const u = (xr - x) * k;
  if (u <= U0) return x;
  return xr - (1 - (1 - U0) * Math.exp((U0 - u) / (1 - U0))) / k;
}
/** Höhenfaktor an dieser Querlage (1, außer tief innen in einer Kurve; siehe cwOffset). */
export function curveShrink(x, k, xr) {
  const u = (xr - x) * k;
  return u <= U0 ? 1 : Math.exp((U0 - u) / (1 - U0));
}

/** Wie tief ein Punkt d Meter voraus, der bei (x, z) erscheint, unter den Boden sinkt (Rückfaltung, siehe FOLD). */
export function curveSink(d, x, z) {
  if (d < FOLD.d) return 0;
  const t = Math.min(Math.max((Math.hypot(x, z) - FOLD.lo * d) / ((FOLD.hi - FOLD.lo) * d), 0), 1);
  return FOLD.sink * (1 - t * t * (3 - 2 * t));
}

/** Biegt einen Punkt auf der CPU genauso wie der Shader (z. B. für Schilder-Raycasts). */
export function curvePoint(v) {
  const d = -v.z;
  const c = curveAt(d);
  const f = curveOffset(v.x, c.k, c.xr);
  const x = c.x + f * Math.cos(c.th);
  const z = c.z - f * Math.sin(c.th);
  v.y = v.y * curveShrink(v.x, c.k, c.xr) + c.y - curveSink(d, x, z);
  v.x = x;
  v.z = z;
  return v;
}

// Sichtprüfung in der gebogenen Welt: three.js prüft die Hüllkugel eines Objekts an seiner geraden Stelle in der
// Simulation. In einer Kurve stünde es aber ganz woanders (am Bildrand verschwände es zu früh, hinter der Kamera würde
// es umsonst gezeichnet). Für Objekte mit gebogenem Material wird hier deshalb der Mittelpunkt genauso gebogen wie im
// Shader und der Radius um die größte Dehnung (außen in der Kurve, Gefälle) vergrößert. Das gilt für jede Kamera,
// auch für die Schattenkarte und den Rückspiegel.
const _sph = new THREE.Sphere();
const _fr = { x: 0, z: 0, th: 0, y: 0, k: 0, dk: 0, xr: 0, g: 0 };
const flatTest = THREE.Frustum.prototype.intersectsObject;
THREE.Frustum.prototype.intersectsObject = function (object) {
  const m = Array.isArray(object.material) ? object.material[0] : object.material;
  if (!m || !m.userData.curved) return flatTest.call(this, object);
  let bs = object.boundingSphere;
  if (bs === undefined) {
    const g = object.geometry;
    if (g.boundingSphere === null) g.computeBoundingSphere();
    bs = g.boundingSphere;
  } else if (bs === null) {
    object.computeBoundingSphere();
    bs = object.boundingSphere;
  }
  _sph.copy(bs).applyMatrix4(object.matrixWorld);
  const p = _sph.center;
  const r = _sph.radius;
  const d = -p.z;
  let k = Math.abs(curveAt(d + r, _fr).k);
  k = Math.max(k, Math.abs(curveAt(d - r, _fr).k));
  const c = curveAt(d, _fr);
  k = Math.max(k, Math.abs(c.k));
  const f = curveOffset(p.x, c.k, c.xr);
  const x = c.x + f * Math.cos(c.th);
  p.z = c.z - f * Math.sin(c.th);
  p.x = x;
  p.y += c.y;
  _sph.radius = r * (1.1 + k * (Math.abs(f - c.xr) + r));
  return this.intersectsSphere(_sph);
};

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
