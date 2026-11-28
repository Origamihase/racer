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
// --- Wolkenschatten -------------------------------------------------------------------------------------------
// Weiche Flecken, die mit dem Wind über das Land ziehen: Wo einer liegt, kommt weniger Sonne an (das Himmelslicht
// bleibt, der Schatten ist also bläulich wie jeder andere). Eine Abfrage je Bildpunkt in einer kleinen Kachel, die
// sich schräg zur Straße wiederholt (so kommt entlang der Fahrt lange kein Fleck zweimal). Die Flecken liegen in der
// ungebogenen Welt fest wie die Wiese (der Boden rückt mit s nach +z). Zwischen den Punkten der Kachel wird weich
// überblendet (smoothstep statt geradlinig): Geradlinig gäbe an jeder Punktreihe einen Knick im Verlauf, und den
// sieht man auf der Wiese als feine schräge Linien.
// Ränder der beiden Schattenkarten als Anteil ihres Kastens (hier, weil der Shader beide braucht; sky.js und
// farshadow.js lesen sie von hier): kurz an den Seiten, lang an der fernen Kante
export const SHADOW_FADE = { edge: '0.040', far: '0.290' };
const FAR_EDGE = '0.040';
const FAR_FAR = '0.250';
export const CLOUD = {
  n: 512, // Kachel in Punkten
  tile: 1400, // und in Metern
  turn: 0.46, // Drehung der Kachel gegen die Straße (rad)
  strength: 0.42, // so viel Sonne nimmt die Mitte eines Flecks
  wind: [2.2, 4.5], // m/s nach rechts und entgegen der Fahrt
  end: 0.3, // ab dieser Bewölkung ist der Himmel zu: keine einzelnen Schatten mehr
};
/** Die Kachel: Deckung 0 … 255 je Punkt, an den Rändern nahtlos. */
export function cloudField(n = CLOUD.n) {
  let seed = 9173;
  const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  const f = new Float32Array(n * n);
  for (let b = 0; b < 15; b++) {
    const cx = rnd() * n;
    const cy = rnd() * n;
    const r = (0.085 + rnd() * 0.11) * n;
    const sx = 0.75 + rnd() * 0.7;
    const rx = Math.ceil(r * sx);
    const ry = Math.ceil(r);
    for (let j = -ry; j <= ry; j++) {
      const y = Math.round(cy) + j;
      const dy = y - cy;
      const row = (((y % n) + n) % n) * n;
      for (let i = -rx; i <= rx; i++) {
        const x = Math.round(cx) + i;
        const dx = (x - cx) / sx;
        const d2 = (dx * dx + dy * dy) / (r * r);
        if (d2 < 1) f[row + (((x % n) + n) % n)] += (1 - d2) * (1 - d2);
      }
    }
  }
  const data = new Uint8Array(n * n);
  for (let i = 0; i < n * n; i++) {
    const v = Math.min(1, Math.max(0, (f[i] - 0.18) / 0.62));
    data[i] = Math.round(v * v * (3 - 2 * v) * 255);
  }
  return data;
}
const CLOUD_DATA = cloudField();
const CLOUD_TEX = new THREE.DataTexture(CLOUD_DATA, CLOUD.n, CLOUD.n, THREE.RedFormat, THREE.UnsignedByteType);
CLOUD_TEX.wrapS = CLOUD_TEX.wrapT = THREE.RepeatWrapping;
CLOUD_TEX.minFilter = THREE.LinearMipmapLinearFilter;
CLOUD_TEX.magFilter = THREE.LinearFilter;
CLOUD_TEX.generateMipmaps = true;
CLOUD_TEX.unpackAlignment = 1;
CLOUD_TEX.needsUpdate = true;
// uCloudM: Lage (x, z) in der ungebogenen Welt → Kachel (zwei Zeilen einer Matrix) · uCloud: Versatz in Kacheln
// (x, y) und Stärke
// dazu die weite Schattenkarte (world/farshadow.js): uFarMap, uFarM: gebogene Welt → Karte (0 … 1) und Tiefe,
// uFar: Stärke (0 aus), Luft in der Tiefe, Blick längs der Straße (+1 voraus … −1 zurück), ein Punkt der Karte
export const sunUniforms = {
  uFarMap: { value: null },
  uFarM: { value: new THREE.Matrix4() },
  uFar: { value: new THREE.Vector4(0, 0, 1, 1) },
  uCloudTex: { value: CLOUD_TEX },
  uCloudM: { value: new THREE.Vector4(Math.cos(CLOUD.turn) / CLOUD.tile, -Math.sin(CLOUD.turn) / CLOUD.tile, Math.sin(CLOUD.turn) / CLOUD.tile, Math.cos(CLOUD.turn) / CLOUD.tile) },
  uCloud: { value: new THREE.Vector3(0, 0, 0) },
};
const frac = (v) => v - Math.floor(v);
/**
 * Stellt die Wolkenschatten für dieses Bild: s = gefahrene Meter, t = Zeit des Winds in Sekunden, k = Anteil der
 * Stärke (0 aus … 1 schönes Wetter).
 */
export function setCloudShadows(s, t, k) {
  const M = sunUniforms.uCloudM.value;
  const C = sunUniforms.uCloud.value;
  const wx = CLOUD.wind[0] * t;
  const wz = CLOUD.wind[1] * t - s;
  C.x = frac(M.x * wx + M.y * wz);
  C.y = frac(M.z * wx + M.w * wz);
  C.z = CLOUD.strength * Math.min(Math.max(k, 0), 1);
}
/** Anteil der Sonne (1 − Stärke … 1) an der Stelle (x, z) der ungebogenen Welt: dieselbe Rechnung wie im Shader. */
export function cloudSunAt(x, z) {
  const M = sunUniforms.uCloudM.value;
  const C = sunUniforms.uCloud.value;
  const n = CLOUD.n;
  const u = frac(M.x * x + M.y * z + C.x) * n - 0.5;
  const v = frac(M.z * x + M.w * z + C.y) * n - 0.5;
  const i = Math.floor(u);
  const j = Math.floor(v);
  const fu = (u - i) * (u - i) * (3 - 2 * (u - i));
  const fv = (v - j) * (v - j) * (3 - 2 * (v - j));
  const at = (a, b) => CLOUD_DATA[(((b % n) + n) % n) * n + (((a % n) + n) % n)];
  const c = (at(i, j) * (1 - fu) + at(i + 1, j) * fu) * (1 - fv) + (at(i, j + 1) * (1 - fu) + at(i + 1, j + 1) * fu) * fv;
  return 1 - (C.z * c) / 255;
}

// zählt die Stände der Tabelle (commit): Wer etwas aus ihr errechnet und aufhebt, erkennt daran, ob es noch gilt
let stamp = 0;
export const curveStamp = () => stamp;

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
    stamp++;
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
#ifdef CW_SUN
  vCwSunUv = vec2( dot( uCloudM.xy, cwPos.xz ), dot( uCloudM.zw, cwPos.xz ) ) + uCloud.xy;
#endif
#ifdef CW_NORMALS
  cwPos = curveWorldN( cwPos, transformedNormal );
  #ifndef FLAT_SHADED
    vNormal = normalize( transformedNormal );
  #endif
#else
  cwPos = curveWorld( cwPos );
#endif
#ifdef CW_SUN
  vCwFar = ( uFarM * cwPos ).xyz;
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
// Der Anteil der Sonne im Fragment-Shader: cwSunK steht ab <lights_fragment_begin> bereit und ist dort schon in das
// Licht der Sonne eingerechnet (three.js' Baustein, um eine Zeile ergänzt). Wer das Licht der Sonne selbst liest
// (directionalLights[0].color), nimmt cwSunK dazu oder fragt vorher mit cwSunAt() selbst, siehe kit/citycore.js.
const SUN_AT = '#include <lights_fragment_begin>';
const SUN_LIGHT = 'getDirectionalLightInfo( directionalLight, directLight );';
const SUN_VERT = '#define CW_SUN\nuniform vec4 uCloudM;\nuniform vec3 uCloud;\nuniform mat4 uFarM;\nvarying vec2 vCwSunUv;\nvarying vec3 vCwFar;\n';
const SUN_FRAG = /* glsl */ `#define CW_SUN
uniform sampler2D uCloudTex;
uniform vec3 uCloud;
uniform highp sampler2DShadow uFarMap;
uniform vec4 uFar;
varying vec2 vCwSunUv;
varying vec3 vCwFar;
float cwSunAt() {
  vec2 q = vCwSunUv * ${CLOUD.n}.0 + 0.5;
  vec2 i = floor( q );
  vec2 f = q - i;
  f = f * f * ( 3.0 - 2.0 * f );
  return 1.0 - uCloud.z * texture2D( uCloudTex, ( i + f - 0.5 ) / ${CLOUD.n}.0 ).r;
}
`;
// Weite Schattenkarte: gilt mit dem Gegenstück des Gewichts der feinen (shFade in world/sky.js, dieselbe Rechnung),
// läuft an ihren eigenen Rändern aus und fällt nur auf das, was Schatten empfängt
const SUN_FAR = /* glsl */ `
{
  float cwW = uFar.x * smoothstep( 0.0, ${FAR_EDGE}, vCwFar.x ) * smoothstep( 0.0, ${FAR_EDGE}, 1.0 - vCwFar.x )
    * smoothstep( 0.0, mix( ${FAR_EDGE}, ${FAR_FAR}, max( - uFar.z, 0.0 ) ), vCwFar.y )
    * smoothstep( 0.0, mix( ${FAR_EDGE}, ${FAR_FAR}, max( uFar.z, 0.0 ) ), 1.0 - vCwFar.y );
  #if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
    vec3 cwN = vDirectionalShadowCoord[ 0 ].xyz / vDirectionalShadowCoord[ 0 ].w;
    float cwNf = clamp( directionalLightShadows[ 0 ].shadowRadius, - 1.0, 1.0 );
    cwW *= 1.0 - smoothstep( 0.0, ${SHADOW_FADE.edge}, cwN.x ) * smoothstep( 0.0, ${SHADOW_FADE.edge}, 1.0 - cwN.x )
      * smoothstep( 0.0, mix( ${SHADOW_FADE.edge}, ${SHADOW_FADE.far}, max( - cwNf, 0.0 ) ), cwN.y )
      * smoothstep( 0.0, mix( ${SHADOW_FADE.edge}, ${SHADOW_FADE.far}, max( cwNf, 0.0 ) ), 1.0 - cwN.y );
    if ( ! receiveShadow ) cwW = 0.0;
  #endif
  if ( cwW > 0.0 ) {
    // vier Abfragen, jede mittelt selbst vier Punkte: Die groben Punkte der weiten Karte gäben sonst Treppen
    vec3 cwC = vec3( vCwFar.xy, vCwFar.z - uFar.y );
    vec2 cwD = vec2( 0.75, 0.25 ) * uFar.w;
    float cwLit = texture( uFarMap, cwC + vec3( cwD.x, cwD.y, 0.0 ) ) + texture( uFarMap, cwC + vec3( - cwD.y, cwD.x, 0.0 ) )
      + texture( uFarMap, cwC + vec3( - cwD.x, - cwD.y, 0.0 ) ) + texture( uFarMap, cwC + vec3( cwD.y, - cwD.x, 0.0 ) );
    cwSunK *= mix( 1.0, cwLit * 0.25, cwW );
  }
}
`;
const SUN_BEGIN = 'float cwSunK = cwSunAt();\n' + SUN_FAR
  + THREE.ShaderChunk.lights_fragment_begin.replace(SUN_LIGHT, SUN_LIGHT + '\n\t\tdirectLight.color *= cwSunK;');
if (!SUN_BEGIN.includes('directLight.color *= cwSunK;')) throw new Error('curve.js: three.js hat lights_fragment_begin geändert');

export function curve(material) {
  material.userData.curved = true;
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uCurve = curveUniforms.uCurve;
    shader.vertexShader = patchVertex(shader.vertexShader);
    // alles, was die Sonne beleuchtet, bekommt den Anteil cwSunK der Sonne an seiner Stelle (Wolkenschatten)
    if (shader.fragmentShader.includes(SUN_AT)) {
      Object.assign(shader.uniforms, sunUniforms);
      shader.vertexShader = SUN_VERT + shader.vertexShader;
      shader.fragmentShader = SUN_FRAG + shader.fragmentShader.replace(SUN_AT, SUN_BEGIN);
    }
  };
  material.customProgramCacheKey = () => 'curved-world';
  return material;
}

// --- dasselbe auf der CPU (gleiche Formeln wie im Shader, z. B. für Kamera, Schilder, Raycasts) ----------------
/** Bahn an der Stelle d (Meter voraus): x, z der Linie x = 0, Kurs th, Höhe y, Krümmung k, dk, Bezugslinie xr, Steigung g. */
const curveFrame = { x: 0, z: 0, th: 0, y: 0, k: 0, dk: 0, xr: 0, g: 0 };
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
function curveSink(d, x, z) {
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

/** Querlage zur Bezugslinie nach der Stauchung (wie curveOffset): t = x − xr vorher, Ergebnis f − xr. */
function squeezed(t, k) {
  const u = -t * k;
  return u <= U0 ? t : -(1 - (1 - U0) * Math.exp((U0 - u) / (1 - U0))) / k;
}

/**
 * Hüllkugel in der gebogenen Welt, sicher statt knapp (für world/rowcull.js: dort entscheidet sie, ob ganze Reihen
 * von Bäumen und Häusern in einem Durchgang fehlen dürfen, die Faustregel oben reicht dafür nicht).
 *
 * sphere.center: Mitte eines Quaders in der geraden Welt der Simulation (schon mit der Matrix des Objekts), ex, ey,
 * ez: seine halben Kanten quer, hoch und längs (ohne Angabe: der Würfel um die Kugel sphere). Danach ist sphere eine
 * Kugel, in der nach dem Biegen alles liegt, was vorher im Quader lag.
 *
 * Ein Punkt (x, y, d) erscheint bei B(d) + o · N(d): B = Q + xr · N ist die Bezugslinie, o seine Querlage zu ihr nach
 * der Stauchung (squeezed; ohne Stauchung o = x − xr). o wächst mit der Querlage vorher und mit kappa, liegt für den
 * ganzen Quader also zwischen squeezed(kleinste Querlage, kleinstes kappa) und squeezed(größte Querlage, größtes
 * kappa): Tief innen in einer Kurve bleibt davon ein schmaler Streifen nahe am Kurvenmittelpunkt, auch wenn der
 * Quader in der geraden Welt hunderte Meter neben der Straße liegt.
 *
 * Um die Linie mit fester Querlage m, C(d) = B(d) + m · N(d), liegt dann alles höchstens w = größter Abstand |o − m|
 * quer. Sie selbst läuft über die halbe Länge ez höchstens l = ez · (max|1 + m · kappa| + |xr'| + (|xr| + |m|) · v)
 * weit, denn ihre Ableitung ist (1 + m · kappa + (xr + m) · (th' − kappa)) · T + xr' · N: außen in der Kurve länger,
 * innen kürzer als die Straße. v ist, was der Kurs sich zwischen zwei Stützstellen schneller oder langsamer dreht, als
 * kappa dort sagt (siehe unten); weit neben der Straße zählt das. Beides steht fast senkrecht aufeinander (die Straße
 * dreht sich über ez um höchstens t = ez · (max|kappa| + v)): Der Abstand zu C(d der Mitte) ist höchstens
 * Wurzel((l² + w²) · (1 + t / 2)); wo xr springt, schlicht l + w. Geprüft werden m = 0 (die Bezugslinie: Ihre Länge
 * hängt nicht von kappa ab) und die Mitte des Streifens (kleinstes w).
 *
 * Die Höhe ist y · fx + Y(d): ohne Stauchung die eigene, mit Stauchung (fx < 1) schrumpft sie höchstens bis zum Boden.
 *
 * kappa, xr und g laufen zwischen den Stützstellen gerade: Ihre Grenzen über [d − ez, d + ez] stehen an den
 * Stützstellen, die das Stück einschließen (jenseits der Tabelle geht es gerade und eben weiter). Der Kurs th ist
 * dazwischen ein kubischer Bogen durch die Kurse der beiden Stützstellen mit kappa als Steigung an den Enden. Seine
 * Steigung ist kappa (gerade verbunden) + 6 · t · (1 − t) · e, mit e = (Unterschied der Kurse) / DS − Mittel der
 * beiden kappa: also höchstens v = 1,5 · |e| neben kappa. e ist 0, wenn die Kurse genau die Trapezsumme von kappa
 * sind. course.fill schreibt aber den genauen Kurs des Straßenprofils (5-m-Raster) in ein 7,5-m-Raster: Wo die
 * Krümmung sich biegt (Anfang und Ende eines Übergangs), bleibt ein e von bis zu 0,13 mrad je Meter.
 *
 * Kann im Quader die Rückfaltung greifen (cwSink: bis FOLD.sink Meter hinab), reicht die Kugel entsprechend tiefer.
 */
export function curveBound(sphere, ex = sphere.radius, ey = ex, ez = ex) {
  const p = sphere.center;
  const d = -p.z;
  const u0 = (d - ez - CURVE_D0) / CURVE_DS;
  const u1 = (d + ez - CURVE_D0) / CURVE_DS;
  const j0 = Math.min(Math.max(Math.floor(u0), 0), CURVE_N - 1);
  const j1 = Math.min(Math.max(Math.ceil(u1), 0), CURVE_N - 1);
  // (ragt der Quader über die Tabelle hinaus, gehört die Gerade dort dazu)
  const beyond = u0 < 0 || u1 > CURVE_N - 1;
  let kmin = beyond ? 0 : Infinity;
  let kmax = beyond ? 0 : -Infinity;
  let xmin = Infinity; // Bezugslinie xr
  let xmax = -Infinity;
  let g = 0;
  let y0 = Infinity;
  let y1 = -Infinity;
  let dxr = 0; // größte Änderung von xr zwischen zwei Stützstellen
  let dev = 0; // größtes |e|: so viel dreht der Kurs zwischen zwei Stützstellen neben kappa (je Meter, im Mittel)
  let xr0 = DATA[(CURVE_N + j0) * 4 + 1];
  let k0 = 0;
  let th0 = 0;
  for (let j = j0, a = j0 * 4 + 3, b = (CURVE_N + j0) * 4; j <= j1; j++, a += 4, b += 4) {
    const k = DATA[b];
    if (k < kmin) kmin = k;
    if (k > kmax) kmax = k;
    const th = DATA[a - 1];
    if (j > j0) {
      const e = Math.abs((th - th0) / CURVE_DS - (k + k0) / 2);
      if (e > dev) dev = e;
    }
    k0 = k;
    th0 = th;
    const xr = DATA[b + 1];
    if (xr < xmin) xmin = xr;
    if (xr > xmax) xmax = xr;
    if (Math.abs(xr - xr0) > dxr) dxr = Math.abs(xr - xr0);
    xr0 = xr;
    const s = Math.abs(DATA[b + 2]);
    if (s > g) g = s;
    const y = DATA[a];
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
  // der Streifen der Querlagen nach der Stauchung
  const tmin = p.x - ex - xmax;
  const tmax = p.x + ex - xmin;
  const oMin = squeezed(tmin, kmin);
  const oMax = squeezed(tmax, kmax);
  const jump = dxr / CURVE_DS;
  const turn = 1.5 * dev;
  const xra = Math.max(Math.abs(xmin), Math.abs(xmax));
  const skew = Math.sqrt(1 + (ez * (Math.max(kmax, -kmin) + turn)) / 2);
  let m = 0;
  let across = 0;
  for (let i = 0; i < 2; i++) {
    const mi = i ? (oMin + oMax) / 2 : 0;
    const l = ez * (Math.max(Math.abs(1 + mi * kmin), Math.abs(1 + mi * kmax)) + (xra + Math.abs(mi)) * turn + jump);
    const w = Math.max(oMax - mi, mi - oMin);
    const q = jump > 0 ? l + w : Math.sqrt(l * l + w * w) * skew;
    if (i && q >= across) break;
    m = mi;
    across = q;
  }
  // Höhe: gestaucht wird, wo (xr − x) · kappa über U0 liegt (am größten an einer Ecke der Bereiche)
  let lo = p.y - ey;
  let hi = p.y + ey;
  if (Math.max(-tmin * kmax, -tmin * kmin, -tmax * kmax, -tmax * kmin) > U0) {
    lo = Math.min(lo, 0);
    hi = Math.max(hi, 0);
  }
  // (zwischen den Stützstellen ist Y ein kubischer Bogen: Er schwingt höchstens 8/27 · DS · g über sie hinaus)
  lo += y0 - 0.3 * CURVE_DS * g;
  hi += y1 + 0.3 * CURVE_DS * g;
  const c = curveAt(d, _fr);
  const f = c.xr + m;
  p.x = c.x + f * Math.cos(c.th);
  p.z = c.z - f * Math.sin(c.th);
  p.y = (lo + hi) / 2;
  // (etwas Luft: Die Grafikkarte rechnet mit float32, zwischen den Stützstellen ist die Bahn ein kubischer Bogen, und
  // course.fill dreht den Kurs zuletzt um einen winzigen Rest, dem die Linie nicht folgt: gemessen bis 0,11 mrad (auf
  // der Landstraße, wo zwei Gegenbögen aufeinandertreffen), die Luft trägt das Neunfache; tools/reihen-test.mjs prüft
  // beides)
  // Math.sqrt statt Math.hypot: hypot legt in V8 bei jedem Aufruf Speicher an, und das hier läuft für jede Hülle in
  // jedem Bild
  const half = (hi - lo) / 2;
  sphere.radius = Math.sqrt(across * across + half * half) * 1.02 + 0.25;
  if (d + ez >= FOLD.d && Math.sqrt(p.x * p.x + p.z * p.z) - sphere.radius < FOLD.hi * (d + ez)) {
    p.y -= FOLD.sink / 2;
    sphere.radius += FOLD.sink / 2;
  }
  return sphere;
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
