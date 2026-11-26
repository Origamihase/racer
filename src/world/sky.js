// Himmel der Miniaturwelt: klarer Nachmittagshimmel mit warmem Horizont und sanftem Sonnenschein, Wattewolken
// in mehreren Schichten, drei gestaffelte Hügelketten im Dunst mit Dorf, Kirchturm, Wald und Windrädern, dazu
// Licht, Nebel und die Umgebungsreflexion. Bei Regen zieht es zu (overcast 0 → 1): weiches Graublau, die Wolken
// behalten ihre Form.
import * as THREE from 'three';
import { lerp, clamp, mulberry32 } from '../util.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { ball, box, rod, cone, prism, fuse, move } from './kit/shapes.js';
import { PAL } from './kit/palette.js';
import { VIEW_BEHIND } from './road.js';
import { ringAt } from '../map/skyline.js';

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
// Hinter dem Wagen hört die Welt nach VIEW_BEHIND (140 m) auf: Fahrbahn, Planken und Wiese brachen dort im
// Vorspann-Schwenk und im Innenspiegel mit harter Kante vor dem hellen Dunst ab (der Nebel beginnt erst bei 300 m).
// Rückwärts wird der Nebel darum schon vorher dicht: zur Sichtweite kommt die Lage hinter dem Spieler (Welt-z, der
// Wagen fährt nach −z; aus mvPosition zurückgerechnet, so zählt auch die Biegung der Welt mit). Das gilt für alle
// Kameras nahe am Wagen (Cockpit, Drohne, Spiegel, Vorspann, Titel – auch eine Kamera weit vorn, die zurückschaut).
// Steht eine freie Kamera selbst weit hinter dem Spieler (Prüfstand: Hof aus 300 m), blendet der Rückwärts-Nebel aus,
// sonst hinge ihr ein Dunstvorhang vor der Nase. Nach vorn und zur Seite ändert sich nichts.
const BACK_NEAR = (VIEW_BEHIND - 80).toFixed(1);
const BACK_FAR = (VIEW_BEHIND - 5).toFixed(1);
{
  const C = THREE.ShaderChunk;
  const v = 'varying float vFogDepth;';
  C.fog_pars_vertex = C.fog_pars_vertex.replace(v, `${v}\n\tvarying float vFogBack;`);
  C.fog_pars_fragment = C.fog_pars_fragment.replace(v, `${v}\n\tvarying float vFogBack;`);
  C.fog_vertex = C.fog_vertex.replace('vFogDepth = - mvPosition.z;', 'vFogDepth = - mvPosition.z;\n\tvFogBack = ( ( mvPosition.xyz - viewMatrix[ 3 ].xyz ) * mat3( viewMatrix ) ).z;');
  C.fog_fragment = C.fog_fragment.replace('gl_FragColor.rgb = mix(', `fogFactor = max( fogFactor, smoothstep( ${BACK_NEAR}, ${BACK_FAR}, vFogBack ) * ( 1.0 - smoothstep( ${BACK_NEAR}, ${BACK_FAR}, cameraPosition.z ) ) );\n\tgl_FragColor.rgb = mix(`);
}
const _dir = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);
const _m4 = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _q2 = new THREE.Quaternion();
const _v = new THREE.Vector3();
const _s = new THREE.Vector3();
const AXIS_Z = new THREE.Vector3(0, 0, 1);

// Farben des Himmels als lineare HDR-Werte (dahinter in Klammern, was nach Sättigung und ACES auf dem Bildschirm
// steht). Der Nebel hat die Farbe des Horizonts: so verschwindet das Ende der Welt im warmen Dunst.
const SKY = {
  zenith: [0.054, 0.222, 0.781], // (#3f8fdc)
  mid: [0.09, 0.373, 1.216], // (#6fb4ea)
  low: [0.3, 0.92, 2.5], // (helles Blau über dem Dunst)
  haze: [1.72, 1.5, 1.0], // (#f0ede2, warmer Dunst am Horizont)
  rainTop: [0.257, 0.31, 0.388], // (#9aa7b6)
  rainLow: [0.53, 0.663, 0.826], // (#c9d3dc)
  rainFog: [0.467, 0.572, 0.744], // (#c2ccd8)
};
// Sonne und Himmelslicht bei schönem Wetter: viel Himmelslicht hält die Schattenseiten hell und freundlich
const SUN_FAIR = 3.05;
const HEMI_FAIR = 2.05;
// Alles am Himmel (Wolken, Hügel, Ferndetails) wird im Vertex-Shader auf ein Fünftel an die Kamera herangeholt:
// das Bild bleibt dasselbe, aber auch die Spiegel-Kamera (Sichtweite 700 m) schneidet nichts ab. Die Kuppel
// kommt zuletzt und löscht danach die Tiefe, so liegt der ganze Himmel sicher hinter der Welt.
const SKY_SCALE = 0.2;
const SKY_VERT_LIB = /* glsl */ `
vec4 skyProject(vec4 world) {
  vec4 mv = viewMatrix * world;
  mv.xyz *= ${SKY_SCALE.toFixed(2)};
  return projectionMatrix * mv;
}`;

const SKY_VERT = /* glsl */ `
varying vec3 vDir;
void main() {
  // Richtung in Weltlage: so darf die Kuppel mit dem ganzen Himmel gedreht werden, Verlauf und Sonne bleiben
  vDir = mat3(modelMatrix) * position;
  vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = p.xyww;
}`;

const SKY_FRAG = /* glsl */ `
uniform vec3 uSunDir;
uniform float uOvercast;
uniform vec3 uFog;
uniform vec3 uZenith;
uniform vec3 uMid;
uniform vec3 uLow;
uniform vec3 uHaze;
uniform vec3 uRainTop;
uniform vec3 uRainLow;
varying vec3 vDir;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main() {
  vec3 d = normalize(vDir);
  float h = d.y;
  float t = clamp(h, 0.0, 1.0);
  vec3 col = mix(uLow, uMid, smoothstep(0.0, 0.3, t));
  col = mix(col, uZenith, smoothstep(0.2, 0.95, t));
  // warmer Dunst über dem Horizont
  col = mix(col, uHaze, exp(-t * 13.0));
  float sd = max(dot(d, uSunDir), 0.0);
  float clear = 1.0 - uOvercast;
  // Sonne: weiter Schein, Hof, Scheibe
  col += vec3(1.0, 0.84, 0.58) * (pow(sd, 6.0) * 0.22 + pow(sd, 48.0) * 0.5) * clear;
  col += vec3(1.0, 0.92, 0.74) * pow(sd, 700.0) * 2.5 * clear;
  col += vec3(40.0, 36.0, 30.0) * smoothstep(0.99955, 0.9998, sd) * clear;
  vec3 gray = mix(uRainLow, uRainTop, smoothstep(0.0, 0.55, t));
  col = mix(col, gray, uOvercast * 0.92);
  col = mix(col, uFog, smoothstep(0.045, -0.02, h));
  // feines Rauschen gegen Streifen im Verlauf
  col *= 1.0 + (hash(gl_FragCoord.xy) - 0.5) * 0.014;
  gl_FragColor = vec4(col, 1.0);
}`;

// Wattewolken: Haufen aus Ballen über einem gemeinsamen flachen Boden, oben sonnig weiß, unten bläulich, zum Horizont
// im Dunst. Die Ballen sind keine Dreiecksnetze: je Wolke wird nur ihr Hüllquader gezeichnet (12 Dreiecke), und der
// Fragment-Shader schneidet den Sehstrahl mit den Ballen der Form (Kugeln, unten an der Bodenebene abgeschnitten).
// So bleibt jeder Umriss bei jeder Auflösung kreisrund, die Normalen gehen an den Kehlen weich ineinander über (keine
// Nähte zwischen den Ballen), die Unterseite ist eine ruhige Fläche statt gestapelter Teller, und die Tiefe stimmt
// pro Pixel (Wolken vor und hinter einander). Die Kante wird über die Pixelabdeckung geglättet (alphaToCoverage, bei
// MSAA); ohne MSAA wird sie bei halber Abdeckung abgeschnitten.
// CLOUD_SHAPES: base = Höhe des Bodens, balls = Ballen [x, y, z, r, sy] (sy streckt den Ballen in der Höhe).
const CLOUD_SHAPES = [
  // große Haufenwolke
  { base: -0.29, balls: [[0, 0, 0, 1, 0.92], [1.12, -0.06, 0.1, 0.8, 0.92], [-1.15, -0.05, -0.05, 0.84, 0.92], [0.42, 0.6, -0.1, 0.72, 1],
    [-0.52, 0.48, 0.15, 0.6, 1], [1.95, -0.14, 0, 0.54, 0.9], [-2.06, -0.12, 0.1, 0.6, 0.9], [0.2, -0.09, 0.72, 0.7, 0.9],
    [-0.3, -0.08, -0.7, 0.74, 0.9], [1.25, 0.42, 0.05, 0.46, 1], [-1.45, 0.28, -0.1, 0.44, 1]] },
  // mittlere, lang gestreckte Wolke
  { base: -0.21, balls: [[0, 0, 0, 0.72, 0.9], [0.95, -0.03, 0.05, 0.62, 0.9], [-0.98, -0.02, 0, 0.66, 0.9], [1.82, -0.08, -0.05, 0.46, 0.9],
    [-1.9, -0.07, 0.08, 0.5, 0.9], [0.35, 0.36, 0, 0.5, 1], [-0.5, 0.3, 0.1, 0.42, 1], [1.1, 0.28, 0.1, 0.36, 1]] },
  // hoch aufgetürmte Wolke
  { base: -0.27, balls: [[0, 0, 0, 0.95, 0.9], [1.05, -0.05, 0.1, 0.72, 0.9], [-1.0, -0.06, -0.08, 0.76, 0.9], [0.15, -0.06, 0.66, 0.66, 0.9],
    [-0.1, -0.05, -0.64, 0.68, 0.9], [0.2, 0.75, 0, 0.8, 1], [-0.55, 0.62, 0.1, 0.62, 1], [0.8, 0.55, -0.1, 0.6, 1],
    [0.05, 1.4, 0.05, 0.6, 1], [-0.45, 1.15, -0.1, 0.46, 1], [0.6, 1.12, 0.12, 0.44, 1]] },
  // kleines Wölkchen
  { base: -0.18, balls: [[0, 0, 0, 0.62, 0.9], [0.78, -0.04, 0.05, 0.5, 0.9], [-0.74, -0.04, -0.05, 0.48, 0.9], [0.2, 0.34, 0, 0.42, 1],
    [-0.28, 0.28, 0.08, 0.36, 1]] },
];
const CLOUD_BALLS = 12; // höchstens so viele Ballen je Form
const NS = CLOUD_SHAPES.length;

const CLOUD_VERT = /* glsl */ `
attribute float aRain;
attribute float aShape;
uniform float uOvercast;
uniform vec4 uBoxMin[${NS}];
uniform vec4 uBoxMax[${NS}];
varying vec3 vLocal;
varying vec3 vWorld;
flat varying vec3 vCam;
flat varying float vShape;
flat varying vec3 vN0;
flat varying vec3 vN1;
flat varying vec3 vN2;
${SKY_VERT_LIB}
void main() {
  int s = int(aShape + 0.5);
  // Regenwolken (aRain > 0) wachsen erst mit der Bewölkung heran, alle werden dabei etwas dicker
  float k = aRain > 0.0 ? smoothstep(aRain - 0.3, aRain, uOvercast) : 1.0;
  k *= 1.0 + 0.18 * uOvercast;
  // Hüllquader der Form (position läuft über den Einheitswürfel 0…1)
  vec3 local = mix(uBoxMin[s].xyz, uBoxMax[s].xyz, position);
  mat4 m = modelMatrix * instanceMatrix;
  vec4 w = m * vec4(local * k, 1.0);
  vWorld = w.xyz;
  vLocal = local;
  // Kamera im Rahmen der Form (ungestreckt): dort wird der Sehstrahl mit den Ballen geschnitten
  vCam = (inverse(m) * vec4(cameraPosition, 1.0)).xyz / max(k, 1e-3);
  vShape = float(s);
  // Normalen aus dem Formrahmen in die Welt: Inverse-Transponierte des linearen Anteils
  mat3 nm = transpose(inverse(mat3(m)));
  vN0 = nm[0];
  vN1 = nm[1];
  vN2 = nm[2];
  gl_Position = k < 0.02 ? vec4(0.0, 0.0, 2.0, 1.0) : skyProject(w);
}`;

const CLOUD_FRAG = /* glsl */ `
uniform mat4 projectionMatrix;
uniform vec3 uSunDir;
uniform float uOvercast;
uniform vec3 uFog;
uniform float uCut;
uniform vec4 uBall[${NS * CLOUD_BALLS}];
uniform float uBallSy[${NS * CLOUD_BALLS}];
uniform vec4 uBoxMin[${NS}];
uniform vec4 uBoxMax[${NS}];
varying vec3 vLocal;
varying vec3 vWorld;
flat varying vec3 vCam;
flat varying float vShape;
flat varying vec3 vN0;
flat varying vec3 vN1;
flat varying vec3 vN2;
void main() {
  int sh = int(vShape + 0.5);
  int n = int(uBoxMin[sh].w);
  float yb = uBoxMax[sh].w;
  vec3 o = vCam;
  vec3 d = vLocal - vCam;
  float tHit = 1e20;
  int iHit = -1;
  // für die Kantenglättung: wie knapp verfehlt der Strahl den nächsten Ballen (in Ballenradien); verfehlt heißt:
  // an der Kugel vorbei oder nur unter dem Boden durch sie hindurch
  float miss = 1e20;
  float tMiss = 0.0;
  int iMiss = 0;
  for (int i = 0; i < ${CLOUD_BALLS}; i++) {
    if (i >= n) break;
    vec4 b = uBall[sh * ${CLOUD_BALLS} + i];
    vec3 r = vec3(b.w, b.w * uBallSy[sh * ${CLOUD_BALLS} + i], b.w);
    vec3 oc = (o - b.xyz) / r;
    vec3 dd = d / r;
    float A = dot(dd, dd);
    float B = dot(oc, dd);
    float disc = B * B - A * (dot(oc, oc) - 1.0);
    float tc = -B / A;
    float ybn = (yb - b.y) / r.y;
    float hs = sqrt(max(disc, 0.0)) / A;
    float t0 = tc - hs;
    float y0 = oc.y + t0 * dd.y;
    float yTop = max(y0, oc.y + (tc + hs) * dd.y);
    float m = max(length(oc + tc * dd) - 1.0, ybn - yTop);
    if (m < miss) {
      miss = m;
      tMiss = tc;
      iMiss = i;
    }
    if (disc > 0.0) {
      // Eintritt: durch die Kugel oder, von unten, durch den Boden (solange der Strahl dabei in der Kugel ist)
      float tin = y0 >= ybn ? t0 : (dd.y > 0.0 ? (ybn - oc.y) / dd.y : 1e20);
      if (tin > 0.0 && tin < tc + hs && tin < tHit) {
        tHit = tin;
        iHit = i;
      }
    }
  }
  // Abdeckung des Pixels aus dem Abstand zur Kante (fwidth: wie viel sich miss über ein Pixel ändert)
  float fw = max(fwidth(miss), 1e-5);
  float cover = clamp(0.5 - miss / fw, 0.0, 1.0);
  bool hit = iHit >= 0;
  cover = hit ? max(cover, 0.5) : min(cover, 0.5);
  if (cover <= uCut) discard;
  // Punkt auf der Wolke: der Treffer oder (knapp daneben) der nächste Randpunkt des verfehlten Ballens
  float t = hit ? tHit : tMiss;
  vec3 p = o + t * d;
  if (!hit) {
    vec4 b = uBall[sh * ${CLOUD_BALLS} + iMiss];
    vec3 r = vec3(b.w, b.w * uBallSy[sh * ${CLOUD_BALLS} + iMiss], b.w);
    p = b.xyz + normalize((p - b.xyz) / r) * r;
    p.y = max(p.y, yb);
  }
  // weiche Normale: die Gradienten aller Ballen, je näher ihre Oberfläche am Punkt liegt, desto stärker
  vec3 g = vec3(0.0);
  for (int i = 0; i < ${CLOUD_BALLS}; i++) {
    if (i >= n) break;
    vec4 c = uBall[sh * ${CLOUD_BALLS} + i];
    vec3 ri = vec3(c.w, c.w * uBallSy[sh * ${CLOUD_BALLS} + i], c.w);
    vec3 q = (p - c.xyz) / ri;
    float e = max(length(q) - 1.0, 0.0);
    g += normalize(q / ri) * exp(-e * 9.0);
  }
  // zum Boden hin biegt sich die Normale nach unten: die Kante zum flachen Boden wirkt gerundet
  float up = p.y - yb;
  float base = 1.0 - smoothstep(0.0, 0.22, up);
  vec3 nn = normalize(mat3(vN0, vN1, vN2) * mix(normalize(g), vec3(0.0, -1.0, 0.0), base * base * (3.0 - 2.0 * base)));
  vec3 lo = uBoxMin[sh].xyz;
  vec3 hi = uBoxMax[sh].xyz;
  vec3 world = cameraPosition + t * (vWorld - cameraPosition);
  vec3 v = normalize(world - cameraPosition);
  // unten etwas dunkler (wie eingebackenes Umgebungslicht)
  float tY = clamp(up / max(hi.y - yb, 1e-3), 0.0, 1.0);
  float ao = 1.0 - 0.45 * (1.0 - tY) * (1.0 - tY);
  float sun = dot(nn, uSunDir) * 0.5 + 0.5;
  float upL = nn.y * 0.5 + 0.5;
  float lit = smoothstep(0.2, 0.9, sun * 0.55 + upL * 0.45) * ao;
  vec3 shade = mix(vec3(0.5, 0.78, 1.25), vec3(0.3, 0.36, 0.45), uOvercast);
  vec3 bright = mix(vec3(1.75, 1.68, 1.55), vec3(0.8, 0.92, 1.12), uOvercast);
  vec3 col = mix(shade, bright, lit);
  // von unten gesehen ist der Boden zur Mitte hin etwas dunkler: dort ist die Wolke am dicksten
  vec2 hw = 0.5 * (hi.xz - lo.xz);
  vec2 mid = 0.5 * (hi.xz + lo.xz);
  col *= 1.0 - 0.14 * base * (1.0 - smoothstep(0.1, 1.05, length((p.xz - mid) / (hw * vec2(0.8, 1.0)))));
  // heller Saum (wie durchscheinende Ränder) an den Seiten, nicht auf dem flach gesehenen Boden
  float rim = pow(1.0 - max(0.0, -dot(nn, v)), 3.0) * (1.0 - base);
  col += rim * mix(vec3(0.35, 0.33, 0.3), vec3(0.08, 0.09, 0.1), uOvercast);
  // zum Horizont hin im Dunst
  col = mix(uFog, col, smoothstep(0.0, 0.2, v.y) * (1.0 - 0.25 * uOvercast));
  gl_FragColor = vec4(col, cover);
  // Tiefe des Wolkenpunkts (wie alles am Himmel auf SKY_SCALE herangeholt)
  vec4 clip = projectionMatrix * vec4((viewMatrix * vec4(world, 1.0)).xyz * ${SKY_SCALE.toFixed(2)}, 1.0);
  gl_FragDepth = 0.5 + 0.5 * clip.z / clip.w;
}`;

// Hügel und Ferndetails: unbeleuchtet, Farbe im Vertex, aHaze = Anteil Dunst (1 = ganz in der Horizontfarbe),
// vUp = Höhe über dem Fuß der Hügel
const HILL_VERT = /* glsl */ `
attribute float aHaze;
varying vec3 vColor;
varying float vHaze;
varying float vUp;
${SKY_VERT_LIB}
void main() {
  vColor = color;
  vHaze = aHaze;
  vec4 p = vec4(position, 1.0);
  #ifdef USE_INSTANCING
    p = instanceMatrix * p;
  #endif
  vUp = p.y;
  gl_Position = skyProject(modelMatrix * p);
}`;

const HILL_FRAG = /* glsl */ `
uniform vec3 uFog;
uniform float uOvercast;
varying vec3 vColor;
varying float vHaze;
varying float vUp;
void main() {
  // bei Regen verschwindet alles im Grau
  float haze = clamp(vHaze + uOvercast * 1.1, 0.0, 1.0);
  // die untersten Meter stecken ganz im Bodendunst: so geht der ferne, verblasste Boden ohne Kante in die Hügel über
  haze = max(haze, 1.0 - smoothstep(0.0, 16.0, vUp));
  gl_FragColor = vec4(mix(vColor, uFog, haze), 1.0);
}`;

/** Sanfte Kuppen rund um den Horizont: Liste von Buckeln { a (Winkel), w (Breite), h } → Höhe(Winkel). */
function humps(seed, n, wMin, wMax, hMin, hMax, base) {
  const rnd = mulberry32(seed);
  const list = [];
  for (let i = 0; i < n; i++) {
    list.push({ a: ((i + rnd() * 0.8) / n) * Math.PI * 2, w: wMin + rnd() * (wMax - wMin), h: hMin + rnd() * (hMax - hMin) });
  }
  return (a) => {
    let sum = 0;
    for (const b of list) {
      let d = Math.abs(a - b.a) % (Math.PI * 2);
      if (d > Math.PI) d = Math.PI * 2 - d;
      if (d >= b.w / 2) continue;
      const c = Math.cos((Math.PI * d) / b.w);
      sum += (b.h * c * c) ** 3;
    }
    return base + Math.cbrt(sum);
  };
}

/** Geometrie für das Hügel-Material: Farben mit eingebackenem Licht, Dunst-Anteil haze (fest oder je Ecke). */
function hazed(geo, haze, sunDir) {
  const n = geo.attributes.normal;
  const c = geo.attributes.color;
  const arr = new Float32Array(c.count);
  for (let i = 0; i < c.count; i++) {
    const k = 0.72 + 0.34 * Math.max(0, n.getX(i) * sunDir.x + n.getY(i) * sunDir.y + n.getZ(i) * sunDir.z) + 0.1 * n.getY(i);
    c.setXYZ(i, c.getX(i) * k, c.getY(i) * k, c.getZ(i) * k);
    arr[i] = haze;
  }
  geo.setAttribute('aHaze', new THREE.BufferAttribute(arr, 1));
  return geo;
}

export class Sky {
  constructor(renderer, scene, { shadows = true, shadowSize = 2048 } = {}) {
    this.renderer = renderer;
    this.scene = scene;
    this.overcast = 0;
    // Sonne im Kartenrahmen (fest) und in der Welt (um den Kurs psi des Spielers gedreht, siehe turn)
    this.sunDirMap = new THREE.Vector3(0.52, 0.6, 0.6).normalize();
    this.sunDir = this.sunDirMap.clone();
    this.psi = 0;
    // Drehung der Umgebungsreflexion (für Szenen, die sie benutzen: auch das Cockpit)
    this.envRotation = new THREE.Euler();
    this.fogClear = new THREE.Color(...SKY.haze);
    this.fogRain = new THREE.Color(...SKY.rainFog);
    this.fogColor = this.fogClear.clone();
    this.drift = 0;

    // Kuppel und Wolken rechnen in Weltlage (Kamerarahmen): sie bekommen die mit dem Kurs gedrehte Sonne. Das
    // Umgebungsbild liegt im Kartenrahmen (Sonne sunDirMap) und wird über environmentRotation gedreht.
    this.uniforms = {
      uSunDir: { value: this.sunDir },
      uOvercast: { value: 0 },
      uFog: { value: this.fogColor },
      uZenith: { value: new THREE.Vector3(...SKY.zenith) },
      uMid: { value: new THREE.Vector3(...SKY.mid) },
      uLow: { value: new THREE.Vector3(...SKY.low) },
      uHaze: { value: new THREE.Vector3(...SKY.haze) },
      uRainTop: { value: new THREE.Vector3(...SKY.rainTop) },
      uRainLow: { value: new THREE.Vector3(...SKY.rainLow) },
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
    // Reihenfolge am Himmel: Wolken, Hügel, Ferndetails – zuletzt die Kuppel (füllt nur, was frei blieb) und
    // danach ist die Tiefe wieder leer für die Welt davor. Die Kuppel schreibt selbst keine Tiefe; zum Löschen
    // muss das Schreiben wieder an sein, sonst bliebe die Tiefe des herangeholten Himmels stehen und ferne
    // Windräder, Türme und Dörfer verschwänden hinter Hügeln und Wolken.
    this.dome = new THREE.Mesh(new THREE.SphereGeometry(3000, 40, 20), mat);
    this.dome.frustumCulled = false;
    this.dome.renderOrder = -10;
    this.dome.onAfterRender = (r) => {
      r.state.buffers.depth.setMask(true);
      r.clearDepth();
    };
    // Kuppel, Wolken und Hügel (mit allen Ferndetails) hängen an einer Gruppe, die mit der Kamera mitwandert: der
    // ganze Himmel lässt sich so als Ganzes um die Hochachse drehen (Fahrtrichtung in Kurven) – sunDir dann um
    // denselben Winkel mitdrehen, die Schattierung der Hügel ist relativ zu ihr eingebacken.
    this.root = new THREE.Group();
    this.root.name = 'Sky';
    this.root.add(this.dome);
    scene.add(this.root);

    scene.fog = new THREE.Fog(this.fogColor, 300, 1550);
    // Nebel und Himmel teilen sich dieselbe Farbe, damit der Horizont im Regen mitgraut
    scene.fog.color = this.fogColor;

    // Licht: warme Nachmittagssonne, dazu viel helles Himmelslicht, damit die Schatten weich und freundlich bleiben
    this.sun = new THREE.DirectionalLight(0xfff0d9, SUN_FAIR);
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
    // Achsen des Schattenbilds (wie three.js sie mit lookAt bildet): eU quer (ohne z-Anteil), eV längs
    this.eU = new THREE.Vector3();
    this.eV = new THREE.Vector3();
    this.shadowAxes();
    this.shadowK = 0;
    this.shadowBox();
    scene.add(this.sun);
    scene.add(this.sun.target);
    this.hemi = new THREE.HemisphereLight(0xd8e6ff, 0xc3cf9c, HEMI_FAIR);
    scene.add(this.hemi);

    this.clouds = this.buildClouds();
    this.root.add(this.clouds);
    // Hügelketten am Horizont mit Dorf, Kirche, Wald und Windrädern
    this.hills = this.buildHills();
    this.root.add(this.hills);

    // Umgebungs-Szene für Reflexionen
    this.pmrem = new THREE.PMREMGenerator(renderer);
    this.envScene = new THREE.Scene();
    // für Spiegelungen ein blasserer Himmel (wie mit Wolken darin): sonst wirken Lack und Glas zu blau
    const pale = (c, k) => new THREE.Vector3(...c).lerp(_v.set(1.25, 1.3, 1.4), k);
    const envMat = mat.clone();
    envMat.uniforms = { ...this.uniforms, uSunDir: { value: this.sunDirMap }, uZenith: { value: pale(SKY.zenith, 0.3) }, uMid: { value: pale(SKY.mid, 0.38) }, uLow: { value: pale(SKY.low, 0.3) } };
    const envDome = new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16), envMat);
    this.envScene.add(envDome);
    this.envGround = new THREE.Mesh(
      new THREE.CircleGeometry(48, 24).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(0.2, 0.24, 0.15) }),
    );
    this.envGround.position.y = -2;
    this.envScene.add(this.envGround);
    this.envTarget = null;
    this.lastEnvOvercast = -1;
    this.updateEnv();
  }

  /**
   * Wattewolken in vier Formen (CLOUD_SHAPES): eine ferne Schicht dicht über dem Horizont, eine nahe darüber und ein
   * paar hohe Wolken (für Titel und Rundflug). Alle Wolken sind Instanzen eines Einheitswürfels; welche Form, steht
   * in aShape, der Shader setzt den Würfel auf den Hüllquader der Form und schneidet darin die Ballen.
   */
  buildClouds() {
    const group = new THREE.Group();
    const balls = [];
    const ballSy = [];
    const boxMin = [];
    const boxMax = [];
    for (const { base, balls: list } of CLOUD_SHAPES) {
      const lo = new THREE.Vector3(Infinity, Infinity, Infinity);
      const hi = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
      for (let i = 0; i < CLOUD_BALLS; i++) {
        const [x = 0, y = 0, z = 0, r = 0, sy = 1] = list[i] || [];
        balls.push(new THREE.Vector4(x, y, z, r));
        ballSy.push(sy);
        if (!list[i]) continue;
        lo.min(_v.set(x - r, Math.max(base, y - r * sy), z - r));
        hi.max(_v.set(x + r, y + r * sy, z + r));
      }
      // ein Hauch Luft um den Quader: auch die geglättete Kante bekommt noch Pixel
      lo.subScalar(0.02);
      hi.addScalar(0.02);
      // w: Zahl der Ballen bzw. Höhe des Bodens
      boxMin.push(new THREE.Vector4(lo.x, lo.y, lo.z, list.length));
      boxMax.push(new THREE.Vector4(hi.x, hi.y, hi.z, base));
    }
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uSunDir: this.uniforms.uSunDir,
        uOvercast: this.uniforms.uOvercast,
        uFog: this.uniforms.uFog,
        uCut: { value: 0.004 },
        uBall: { value: balls },
        uBallSy: { value: ballSy },
        uBoxMin: { value: boxMin },
        uBoxMax: { value: boxMax },
      },
      vertexShader: CLOUD_VERT,
      fragmentShader: CLOUD_FRAG,
      alphaToCoverage: true,
      fog: false,
    });
    const rnd = mulberry32(2017);
    const spots = [];
    const add = (shape, az, dist, elev, size, rain) => {
      spots.push({ shape, az, dist, y: dist * Math.tan(elev), s: (dist * size) / 4.6, yaw: rnd() * 6.28, sx: 0.85 + rnd() * 0.4, sy: 0.8 + rnd() * 0.35, rain });
    };
    const deg = Math.PI / 180;
    // ferne Schicht dicht über dem Horizont (lange und kleine Wolken), nahe Schicht darüber (große und hohe), ein paar
    // hohe Wolken; die Formen wechseln sich ab
    for (let i = 0; i < 14; i++) add(i % 3 === 2 ? 3 : 1, ((i + rnd() * 0.7) / 14) * 6.283, 2300 + rnd() * 500, (4 + rnd() * 4.5) * deg, (0.11 + rnd() * 0.07), 0);
    for (let i = 0; i < 12; i++) add(i % 4 === 1 ? 2 : 0, ((i + rnd() * 0.7) / 12) * 6.283, 1300 + rnd() * 500, (10.5 + rnd() * 9) * deg, (0.2 + rnd() * 0.14), 0);
    for (let i = 0; i < 6; i++) add([0, 1, 2][i % 3], ((i + rnd() * 0.7) / 6) * 6.283, 900 + rnd() * 300, (30 + rnd() * 28) * deg, (0.3 + rnd() * 0.2), 0);
    // Regenwolken (am Ende der Liste): füllen die Lücken, sobald es zuzieht – je eine zwischen zwei Schönwetterwolken
    // derselben Schicht, nicht auf ihnen (zwei Wolkenböden übereinander läsen sich als Stapel)
    this.fairClouds = spots.length;
    for (let i = 0; i < 12; i++) add(i % 2 ? 2 : 0, ((i + 0.6 + rnd() * 0.5) / 12) * 6.283, 1100 + rnd() * 700, (7 + rnd() * 16) * deg, (0.28 + rnd() * 0.16), 0.35 + rnd() * 0.55);
    for (let i = 0; i < 6; i++) add(1, ((i + 0.6 + rnd() * 0.5) / 6) * 6.283, 1900 + rnd() * 600, (4 + rnd() * 6) * deg, (0.18 + rnd() * 0.1), 0.35 + rnd() * 0.55);
    // Einheitswürfel 0…1, Flächen nach außen
    const cube = new THREE.BoxGeometry(1, 1, 1).translate(0.5, 0.5, 0.5);
    cube.deleteAttribute('normal');
    cube.deleteAttribute('uv');
    const mesh = new THREE.InstancedMesh(cube, mat, spots.length);
    const rain = new Float32Array(spots.length);
    const shape = new Float32Array(spots.length);
    spots.forEach((c, i) => {
      _q.setFromAxisAngle(_v.set(0, 1, 0), c.yaw);
      _m4.compose(_v.set(Math.sin(c.az) * c.dist, c.y, -Math.cos(c.az) * c.dist), _q, _s.set(c.s * c.sx, c.s * c.sy, c.s));
      mesh.setMatrixAt(i, _m4);
      rain[i] = c.rain;
      shape[i] = c.shape;
    });
    cube.setAttribute('aRain', new THREE.InstancedBufferAttribute(rain, 1));
    cube.setAttribute('aShape', new THREE.InstancedBufferAttribute(shape, 1));
    mesh.frustumCulled = false;
    mesh.renderOrder = -14;
    // Kantenglättung über die Abdeckung geht nur mit MSAA; sonst die Kante bei halber Abdeckung ziehen
    mesh.onBeforeRender = (renderer) => {
      const rt = renderer.getRenderTarget();
      mat.uniforms.uCut.value = (rt ? rt.samples > 0 : renderer.getContextAttributes().antialias) ? 0.004 : 0.5;
    };
    this.cloudMesh = mesh;
    group.add(mesh);
    return group;
  }

  buildHills() {
    const group = new THREE.Group();
    this.hillMat = new THREE.ShaderMaterial({
      uniforms: { uFog: this.uniforms.uFog, uOvercast: this.uniforms.uOvercast },
      vertexShader: HILL_VERT,
      fragmentShader: HILL_FRAG,
      vertexColors: true,
      fog: false,
    });
    // Drei Ketten hintereinander: ferne blaue Berge, mittlere blaugrüne Höhen, nahe grüne Kuppen mit Wald. Ihre Höhen
    // kommen aus dem Horizont der Gegend (map/skyline.js, setSkyline); ohne ihn (Titel, keine Daten) aus erfundenen
    // Kuppen. Die erfundenen bleiben schwach dabei, damit auch ein flacher Horizont lebt.
    const far = humps(31, 13, 0.5, 1.1, 110, 270, 60);
    const mid = humps(47, 19, 0.35, 0.8, 55, 150, 30);
    const near = humps(59, 30, 0.2, 0.5, 12, 62, 8);
    this.gen = [far, mid, near];
    this.horizon = null; // { cur: {near, mid, far, wood, snow, rockN, rockM}, to: … } je 360 Richtungen
    this.nearHeight = (a) => this.layerH(2, a);
    this.hillLayers = [
      { R: 2350, n: 720, top: [0.17, 0.42, 1.0], haze: 0.12, foot: 0.52, key: 'far', ex: 4, base: 40, max: 420 },
      { R: 2080, n: 900, top: [0.11, 0.38, 0.32], haze: 0.04, foot: 0.55, key: 'mid', ex: 3.5, base: 20, max: 380 },
      { R: 1820, n: 720, top: [0.15, 0.46, 0.1], haze: 0, foot: 0.6, woods: true, key: 'near', ex: 3.5, base: 6, max: 330 },
    ];
    const TAU = Math.PI * 2;
    // Aufbau je Kette (fest): Stützstellen rund um den Horizont, unter den Waldkronen der nahen Kette viermal so dicht
    let verts = 0;
    for (const L of this.hillLayers) {
      const rnd = mulberry32(L.R);
      const angles = [];
      for (let i = 0; i < L.n; i++) angles.push((i / L.n) * TAU);
      const crowns = [];
      if (L.woods) {
        const fine = TAU / (L.n * 4);
        for (let a = 0.02; a < TAU - 0.3;) {
          // Kronen rundum dicht an dicht (ob dort Wald steht, sagt der Horizont der Gegend, siehe woodAt)
          const len = 0.05 + rnd() * 0.16;
          let b = a;
          while (b < a + len) {
            const r = 13 + rnd() * 12;
            crowns.push({ a: b, r, k: 0.9 + rnd() * 0.2, gen: false });
            b += (r * (1.1 + rnd() * 0.5)) / L.R;
          }
          // ohne Horizont der Gegend: nur jede zweite Gruppe (wie früher)
          const on = rnd() < 0.5;
          for (const c of crowns) if (c.gen === false && c.a >= a) c.gen = on;
          for (let f = Math.ceil((a - 0.016) / fine) * fine; f < b + 0.016; f += fine) angles.push(f);
          a += len + 0.03 + rnd() * 0.12;
        }
        angles.sort((p, q) => p - q);
      }
      angles.push(TAU);
      const A = [];
      let last = -1;
      for (const a of angles) {
        if (a - last < 1e-5) continue;
        last = a;
        A.push(a);
      }
      L.angles = A;
      L.crowns = crowns;
      L.rows = L.woods ? 5 : 4;
      L.v0 = verts;
      verts += A.length * L.rows;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts * 3), 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(verts * 3), 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('aHaze', new THREE.BufferAttribute(new Float32Array(verts), 1));
    const idx = [];
    for (const L of this.hillLayers) {
      for (let k = 1; k < L.angles.length; k++) {
        for (let r = 0; r < L.rows - 1; r++) {
          const p = L.v0 + (k - 1) * L.rows + r;
          idx.push(p, p + L.rows, p + 1, p + 1, p + L.rows, p + L.rows + 1);
        }
      }
    }
    geo.setIndex(idx);
    this.ridgeGeo = geo;
    this.fillRidges();
    const mesh = new THREE.Mesh(geo, this.hillMat);
    mesh.frustumCulled = false;
    mesh.renderOrder = -12;
    group.add(mesh);
    // Ferndetails (Dörfer, Turm, Windräder) als eigenes Netz: sie stehen auf der nahen Kette und rücken mit ihr
    const det = this.buildFarDetails(group, 1800);
    const P = det.attributes.position;
    this.detBase = new Float32Array(P.count); // Höhe über der Kette am eigenen Winkel
    this.detAng = new Float32Array(P.count);
    for (let i = 0; i < P.count; i++) {
      const a = Math.atan2(P.getX(i), -P.getZ(i));
      this.detAng[i] = a;
      this.detBase[i] = P.getY(i) - this.nearHeight(a);
    }
    P.setUsage(THREE.DynamicDrawUsage);
    const dm = new THREE.Mesh(det, this.hillMat);
    dm.frustumCulled = false;
    dm.renderOrder = -12;
    group.add(dm);
    this.detGeo = det;
    return group;
  }

  /** Höhe der Kette i (0 fern, 1 mittel, 2 nah) bei Winkel a (Peilung im Kartenrahmen). */
  layerH(i, a) {
    const L = this.hillLayers[i];
    const g = this.gen[i](a);
    const H = this.horizon;
    if (!H) return g;
    // Erhebungswinkel der Gegend (überhöht, wie aus der Ferne gesehen) auf den Radius der Kette, dazu ein Hauch der
    // erfundenen Kuppen
    const e = ringAt(H.cur[L.key], a);
    const real = e > 0 ? L.R * Math.tan(Math.min(1.2, e * L.ex)) : 0;
    return Math.min(L.max, L.base + real + (g - L.base) * 0.18);
  }

  /** Wald auf der nahen Kette bei a (0..1). */
  woodAt(a) {
    return this.horizon ? clamp((ringAt(this.horizon.cur.wood, a) - 0.22) / 0.3, 0, 1) : -1;
  }

  /** Positionen, Farben und Dunst der drei Ketten aus den Höhen von layerH. */
  fillRidges() {
    const geo = this.ridgeGeo;
    const P = geo.attributes.position.array;
    const C = geo.attributes.color.array;
    const Hz = geo.attributes.aHaze.array;
    const woodLow = [0.06, 0.2, 0.075];
    const woodTop = [0.115, 0.34, 0.1];
    const rock = [0.46, 0.47, 0.46];
    const snow = [0.93, 0.95, 0.98];
    const H = this.horizon;
    this.hillLayers.forEach((L, li) => {
      let ci = 0;
      let v = L.v0;
      const rockOf = H ? (L.key === 'far' ? null : H.cur[L.key === 'near' ? 'rockN' : 'rockM']) : null;
      for (const a of L.angles) {
        const x = Math.sin(a) * L.R;
        const z = -Math.cos(a) * L.R;
        const h = this.layerH(li, a);
        let tree = 0;
        let shade = 1;
        if (L.woods) {
          const w = this.woodAt(a);
          const cr = L.crowns;
          while (ci < cr.length - 1 && cr[ci].a + cr[ci].r / L.R < a) ci++;
          for (let k = Math.max(0, ci - 1); k < Math.min(cr.length, ci + 3); k++) {
            const scale = w < 0 ? (cr[k].gen ? 1 : 0) : w;
            if (scale <= 0.02) continue;
            const d = (a - cr[k].a) * L.R;
            const r = cr[k].r * (0.6 + 0.4 * scale);
            const t = Math.abs(d) < r ? Math.sqrt(r * r - d * d) * 0.85 + r * 0.25 : 0;
            if (t > tree) {
              tree = t;
              shade = cr[k].k;
            }
          }
        }
        // leichte Farbwechsel entlang der Kette (Wiesen, Felder); rundum periodisch, sonst gäbe es voraus eine Naht
        const vv = 0.92 + 0.08 * (0.5 * Math.sin(3 * a + L.R) + 0.3 * Math.sin(7 * a + 0.4) + 0.2 * Math.sin(13 * a + 2.1));
        let top = [L.top[0] * vv, L.top[1] * vv, L.top[2] * vv];
        // Hochgebirge: oben Fels, darüber Schnee (fern bläulich im Dunst, nah und mittel nach der Gipfelhöhe)
        if (H) {
          const sn = ringAt(H.cur.snow, a);
          const rk = rockOf ? ringAt(rockOf, a) : 0;
          if (rk > 0) top = top.map((c, j) => lerp(c, rock[j], rk * 0.7));
          if (sn > 0) top = top.map((c, j) => lerp(c, L.key === 'far' ? 0.78 + j * 0.06 : snow[j], sn * (L.key === 'far' ? 0.55 : 0.35)));
        }
        const put = (y, col, hz) => {
          P[v * 3] = x;
          P[v * 3 + 1] = y;
          P[v * 3 + 2] = z;
          C[v * 3] = col[0];
          C[v * 3 + 1] = col[1];
          C[v * 3 + 2] = col[2];
          Hz[v] = hz;
          v++;
        };
        put(-70, top, 1);
        put(0, top, L.foot);
        if (L.woods) {
          const y = Math.max(0.5 * h, h - 6);
          put(y, top, lerp(L.foot, L.haze, y / h));
          put(h + tree * 0.45, tree > 0 ? woodLow.map((c) => c * shade) : top, L.haze);
          put(h + tree, tree > 0 ? woodTop.map((c) => c * shade) : top, L.haze);
        } else {
          // weiches Relief für die fernen Ketten: die Flanke zur Sonne hin heller, die abgewandte dunkler (Steigung
          // längs der Kette gegen die Sonnenrichtung), knapp unter dem Kamm etwas tiefer im Ton, der Kamm selbst mit
          // einem hellen Saum – so liest sich jede Kuppe als Form statt als flacher Schleier
          const g = (this.layerH(li, a + 0.002) - this.layerH(li, a - 0.002)) / (0.004 * L.R);
          const along = Math.cos(a) * this.sunDirMap.x + Math.sin(a) * this.sunDirMap.z;
          const lit = clamp(1 - (0.95 * g * along) / this.sunDirMap.y, 0.7, 1.3);
          const tone = (k) => top.map((c) => Math.min(1, c * k));
          put(0.72 * h, tone(0.95 * lerp(1, lit, 0.6)), lerp(L.foot, L.haze, 0.72));
          put(h, tone(1.04 * lit), L.haze);
        }
      }
    });
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
    geo.attributes.aHaze.needsUpdate = true;
  }

  /**
   * Horizont der Gegend setzen (map/skyline.js skyline): die Ketten wachsen in einigen Sekunden in die neue Form.
   * null: zurück zu den erfundenen Kuppen; snap: sofort (neue Fahrt).
   */
  setSkyline(sk, snap = false) {
    if (!sk) {
      if (this.horizon) {
        this.horizon = null;
        this.refreshHills();
      }
      return;
    }
    const to = { near: sk.near, mid: sk.mid, far: sk.far, wood: sk.wood, snow: sk.snow, rockN: sk.rockN, rockM: sk.rockM };
    if (!this.horizon || snap || this.horizon.cur.near.length !== sk.near.length) {
      const copy = {};
      for (const k in to) copy[k] = Float32Array.from(to[k]);
      this.horizon = { cur: copy, to, moving: true };
      this.refreshHills();
    } else {
      this.horizon.to = to;
      this.horizon.moving = true;
    }
  }

  /** Ketten und Ferndetails neu aus den Höhen (nach jeder Änderung des Horizonts). */
  refreshHills() {
    this.fillRidges();
    const P = this.detGeo.attributes.position;
    for (let i = 0; i < P.count; i++) P.setY(i, this.detBase[i] + this.nearHeight(this.detAng[i]));
    P.needsUpdate = true;
    for (const r of this.rotorSpots) r.pos.y = this.nearHeight(r.a) - 2 + r.hub;
  }

  /** Den Horizont weich zum Ziel führen (je Bild; schreibt die Netze höchstens jedes zweite Bild neu). */
  stepHorizon(dt) {
    const H = this.horizon;
    if (!H || !H.moving) return;
    const k = 1 - Math.exp(-dt * 1.6);
    let diff = 0;
    for (const key in H.to) {
      const c = H.cur[key];
      const t = H.to[key];
      for (let i = 0; i < c.length; i++) {
        const d = t[i] - c[i];
        c[i] += d * k;
        if (Math.abs(d) > diff) diff = Math.abs(d);
      }
    }
    if (diff < 2e-4) H.moving = false;
    this.hillTick = (this.hillTick || 0) + 1;
    if (!H.moving || this.hillTick % 2 === 0) this.refreshHills();
  }

  /**
   * Ferndetails auf der nahen Hügelkette (Radius R): drei Dörfchen mit Kirchturm, ein Aussichtsturm und vier
   * Gruppen Windräder, deren Rotoren sich drehen. Alles pummelig und groß genug, um als Schattenriss zu wirken.
   * Gibt die Geometrie der stehenden Teile zurück; die Rotoren kommen als Instanzen in die Gruppe.
   */
  buildFarDetails(group, R) {
    const parts = [];
    const put = (list, a, dy = 0, r = R) => parts.push(move(list, { at: [Math.sin(a) * r, this.nearHeight(a) + dy, -Math.cos(a) * r], rot: [0, -a, 0] }));
    const house = (w, h, d, wall, roof) => [
      box(w, h, d, { col: wall, ao: 0.2 }),
      prism([[-w * 0.56, h], [w * 0.56, h], [0, h + w * 0.55]], d * 1.08, { col: roof, ao: 0 }),
    ];
    const village = (a0, seed, tower) => {
      const rnd = mulberry32(seed);
      const walls = PAL.wall;
      const roofs = PAL.roof;
      for (let i = 0; i < 9; i++) {
        const a = a0 + (i - 4) * 0.0125 + (rnd() - 0.5) * 0.006;
        const w = 17 + rnd() * 9;
        put(move(house(w, 11 + rnd() * 7, 16, walls[Math.floor(rnd() * walls.length)], roofs[Math.floor(rnd() * 3)]), { rot: [0, rnd() < 0.4 ? Math.PI / 2 : 0, 0] }), a, -3, R - 6 - rnd() * 18);
      }
      // Kirche: Schiff, Turm mit Helm (Zwiebel oder Spitze)
      const church = [
        ...move(house(20, 20, 34, PAL.wall[6], PAL.roof[1]), { rot: [0, Math.PI / 2, 0], at: [14, 0, 0] }),
        box(15, 44, 15, { at: [-10, 0, 0], col: PAL.wall[6], ao: 0.2 }),
        ...(tower === 'zwiebel'
          ? [ball(10.5, { at: [-10, 50, 0], s: [1, 1.05, 1], d: 2, col: PAL.roof[3], ao: 0.2 }), cone(4.2, 15, { at: [-10, 58, 0], seg: 8, col: PAL.roof[3], ao: 0 })]
          : [cone(11.5, 30, { at: [-10, 44, 0], seg: 4, rot: [0, Math.PI / 4, 0], col: PAL.roof[3], ao: 0 })]),
      ];
      put(church, a0 + 0.004, -3, R - 30);
    };
    village(0.2, 5, 'zwiebel');
    village(Math.PI + 0.55, 9, 'spitz');
    village(-1.25, 12, 'spitz');
    // Aussichtsturm auf einer Kuppe
    put([rod(7, 5, 46, { seg: 8, col: PAL.stone, ao: 0.25 }), rod(8.5, 8.5, 6, { at: [0, 44, 0], seg: 8, caps: true, col: PAL.wall[0], ao: 0 }), cone(10.5, 12, { at: [0, 50, 0], seg: 8, col: PAL.roof[0], ao: 0 })], -0.52, -2);
    // Windräder: Türme hier, Rotoren als Instanzen (drehen sich)
    const mills = [-0.25, -0.215, -0.185, 0.47, 0.5, 2.2, 2.24, 2.275, -2.1, -2.06];
    const hub = 88;
    for (const a of mills) put([rod(3.2, 1.7, hub, { seg: 8, col: 0xf4f5f7, ao: 0.12 }), ball(4, { at: [0, hub, 2], s: [1, 1, 1.9], d: 1, col: 0xf4f5f7, ao: 0 })], a, -2, R - 14);
    const details = hazed(fuse(parts), 0.2, this.sunDir);
    details.deleteAttribute('normal');

    // Rotor: Nabe und drei schlanke Blätter (in der x-y-Ebene, dreht um z)
    const blade = [];
    for (let i = 0; i < 3; i++) {
      blade.push(move([prism([[-2.4, 3], [2.4, 3], [0.7, 44], [-0.7, 44]], 0.9, { col: 0xf7f8fa, ao: 0 })], { rot: [0, 0, (i / 3) * Math.PI * 2] }));
    }
    blade.push(ball(3.4, { d: 1, s: [1, 1, 1.3], col: 0xf7f8fa, ao: 0 }));
    this.rotors = new THREE.InstancedMesh(hazed(fuse(blade), 0.2, this.sunDir), this.hillMat, mills.length);
    this.rotors.frustumCulled = false;
    this.rotors.renderOrder = -11;
    this.rotorSpots = mills.map((a, i) => ({
      a,
      hub,
      pos: new THREE.Vector3(Math.sin(a) * (R - 22), this.nearHeight(a) - 2 + hub, -Math.cos(a) * (R - 22)),
      yaw: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -a),
      phase: i * 1.7,
      speed: 0.9 + (i % 3) * 0.12,
    }));
    this.spinRotors(0);
    group.add(this.rotors);
    return details;
  }

  spinRotors(t) {
    _s.set(1, 1, 1);
    for (let i = 0; i < this.rotorSpots.length; i++) {
      const r = this.rotorSpots[i];
      _q.copy(r.yaw).multiply(_q2.setFromAxisAngle(AXIS_Z, t * r.speed + r.phase));
      this.rotors.setMatrixAt(i, _m4.compose(r.pos, _q, _s));
    }
    this.rotors.instanceMatrix.needsUpdate = true;
  }

  updateEnv() {
    if (this.envTarget) this.envTarget.dispose();
    this.envTarget = this.pmrem.fromScene(this.envScene, 0.02, 0.1, 100);
    this.scene.environment = this.envTarget.texture;
    this.lastEnvOvercast = this.overcast;
    if (this.onEnv) this.onEnv(this.envTarget.texture);
  }

  shadowAxes() {
    this.eU.crossVectors(this.sun.shadow.camera.up, this.sunDir).normalize();
    this.eV.crossVectors(this.sunDir, this.eU);
  }

  /**
   * Die Welt dreht sich: psi = Kurs des Spielers im Kartenrahmen (rad, links positiv). Kuppel, Hügel, Sonne (und mit
   * ihr Schatten und Licht am Auto) und Umgebungsbild drehen sich um −psi; in einer langen Rechtskurve wandert die
   * Sonne so links herum um das Auto (im langen Bogen der Kurvenprobe von hinten rechts nach vorn rechts).
   */
  turn(psi) {
    this.psi = psi;
    this.root.rotation.y = -psi;
    this.sunDir.copy(this.sunDirMap).applyAxisAngle(UP, -psi);
    this.envRotation.set(0, -psi, 0);
    this.scene.environmentRotation.copy(this.envRotation);
    this.shadowAxes();
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

  /**
   * view (optional): hillY = Höhe der Straße am Horizont (die Hügelkette steigt und sinkt mit). mapX/mapZ braucht
   * dieser Himmel nicht: die Wolken hängen an root, drehen mit dem Kurs und ziehen langsam um den Horizont. Den Kurs
   * setzt turn().
   */
  update(dt, camera, s, t, view = null) {
    const o = this.overcast;
    this.uniforms.uOvercast.value = o;
    this.fogColor.copy(this.fogClear).lerp(this.fogRain, o);
    const fog = this.scene.fog;
    fog.near = lerp(300, 18, o);
    fog.far = lerp(1550, 430, o);
    this.sun.intensity = lerp(SUN_FAIR, 0.36, o);
    this.hemi.intensity = lerp(HEMI_FAIR, 1.6, o);
    this.hemi.color.setRGB(lerp(0.69, 0.6, o), lerp(0.79, 0.66, o), lerp(1.0, 0.74, o));
    this.hills.visible = o < 0.9;

    this.root.position.set(camera.position.x, 0, camera.position.z);
    this.dome.position.y = camera.position.y;
    // die Wolken ziehen ganz langsam um den Horizont
    this.drift += dt * 0.0035;
    this.clouds.rotation.y = this.drift;
    // bei klarem Himmel die (unsichtbar kleinen) Regenwolken gar nicht erst zeichnen
    this.cloudMesh.count = o > 0.04 ? this.cloudMesh.instanceMatrix.count : this.fairClouds;
    this.hills.position.y = view && view.hillY ? view.hillY : 0;
    if (this.hills.visible) {
      this.stepHorizon(dt);
      this.spinRotors(t);
    }

    this.placeShadow(camera, s);
    this.envGround.material.color.setRGB(lerp(0.2, 0.12, o), lerp(0.24, 0.13, o), lerp(0.15, 0.13, o));
    if (Math.abs(o - this.lastEnvOvercast) > 0.12) this.updateEnv();
  }
}
