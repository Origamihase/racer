// Plüsch-Material und Glasaugen für Mini Adam (und alles, was aus demselben Stoff sein soll).
// Plüsch = raues Material mit Stoffglanz (sheen), dazu drei Dinge, die ein Stofftier weich aussehen lassen:
//   – das Licht greift um die Form herum (kein harter Schattenrand),
//   – am Umriss streuen die Fasern das Licht (Flausch-Rand, besonders im Gegenlicht),
//   – feine Körnung statt glatter Fläche.
// Die Figur selbst nutzt die Variante „paint“: Farben, Flausch, Strich (langer Flor für Haare und Bart),
// Nähte und der LIVE-Aufdruck stehen je Ecke in der Geometrie (siehe softMesh.js), die Körnung kommt ohne
// UV-Koordinaten aus (drei Projektionen entlang der Achsen).
import * as THREE from 'three';
import { curve } from '../curve.js';
import { fabricTexture } from '../textures.js';

// Kacheln der Körnung je Meter (128 Bildpunkte je Kachel → etwa 2,4 mm je Faserbüschel)
const GRAIN = 3.3;
let sharedFabric = null;
const fabric = () => (sharedFabric ||= fabricTexture(11));

// --- Shader-Bausteine ---------------------------------------------------------------------
const FRAG_COMMON = /* glsl */ `
// Plüsch: Flausch (0 = glatt) und Farbe des Randlichts, gesetzt in main() vor der Beleuchtung
float plushFuzzK = 1.0;
vec3 plushRimColor = vec3( 0.0 );
float plushRim( vec3 n, vec3 v ) {
  float f = 1.0 - saturate( dot( n, v ) );
  return f * f * sqrt( f ) * plushFuzzK;
}
`;

const FRAG_PAINT_PARS = /* glsl */ `
uniform sampler2D tPlush;
uniform sampler2D tPlushLogo;
varying vec3 vPlushObj;
varying vec3 vPlushNrm;
varying float vPlushFuzz;
varying vec3 vPlushFlow;
varying vec4 vPlushSeam;
varying vec2 vPlushLogo;
// wie perturbNormalArb in three.js (Mikkelsen): Normale aus der Höhenänderung zum Nachbar-Bildpunkt
vec3 plushBump( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
  vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
  vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
  vec3 R1 = cross( vSigmaY, surf_norm );
  vec3 R2 = cross( surf_norm, vSigmaX );
  float fDet = dot( vSigmaX, R1 ) * faceDirection;
  vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
  vec3 nb = abs( fDet ) * surf_norm - vGrad;
  float l2 = dot( nb, nb );
  return l2 > 1e-12 ? nb * inversesqrt( l2 ) : surf_norm;
}
`;

// Farbe, Körnung, Flor, Nähte und Aufdruck; verändert diffuseColor und normal, setzt Flausch und Randfarbe
const FRAG_PAINT_MAIN = /* glsl */ `
{
  vec3 pObj = vPlushObj;
  vec3 nObj = normalize( vPlushNrm );
  vec3 tw = nObj * nObj;
  tw *= tw;
  tw /= tw.x + tw.y + tw.z;
  // Körnung (−1 … 1) und großflächiger Strich des Flors (0 … 1): dieselbe Rauschtextur in zwei Maßstäben
  float grain = texture2D( tPlush, pObj.yz * PLUSH_GRAIN ).r * tw.x + texture2D( tPlush, pObj.zx * PLUSH_GRAIN ).r * tw.y + texture2D( tPlush, pObj.xy * PLUSH_GRAIN ).r * tw.z;
  grain = ( grain - 0.784 ) * 7.3;
  float brush = texture2D( tPlush, pObj.yz * PLUSH_GRAIN * 0.07 + 0.31 ).r * tw.x + texture2D( tPlush, pObj.zx * PLUSH_GRAIN * 0.07 + 0.57 ).r * tw.y + texture2D( tPlush, pObj.xy * PLUSH_GRAIN * 0.07 + 0.13 ).r * tw.z;
  brush = saturate( ( brush - 0.72 ) * 8.0 + 0.5 );
  float fuzz = vPlushFuzz;
  // Körnchen nur noch etwa einen Bildpunkt groß: Höhe ausblenden, sonst kippt die Normale von Bildpunkt zu Bildpunkt
  // und der Stoff glitzert (und flimmert in Bewegung)
  float gk = saturate( 1.3 - length( fwidth( pObj ) ) * PLUSH_GRAIN * 128.0 * 0.9 );
  float height = grain * 0.5 * gk;
  diffuseColor.rgb *= 1.0 + 0.085 * grain * min( 1.0, fuzz ) * ( 0.4 + 0.6 * gk );
  // langer Flor (Haare, Bart): Strähnen entlang der Strichrichtung. Die Ableitungen der Strähnen-Koordinaten
  // werden außerhalb der Verzweigung gebildet (dort sind sie verlässlich) und gefiltert gelesen: in der Ferne
  // mitteln die Mip-Stufen die Strähnen ruhig weg, statt dass einzelne Bildpunkte aufblitzen und flimmern
  float pile = length( vPlushFlow );
  vec3 f = pile > 1e-4 ? vPlushFlow / pile : vec3( 0.0, 1.0, 0.0 );
  vec3 ax = abs( f.y ) < 0.9 ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
  vec3 b1 = normalize( cross( f, ax ) );
  vec3 b2 = cross( f, b1 );
  float along = dot( pObj, f );
  vec2 suv = vec2( dot( pObj, b1 ), dot( pObj, b2 ) ) * PLUSH_GRAIN;
  vec2 su1 = suv * 1.15 + along * vec2( 0.21, -0.13 );
  vec2 su2 = suv * 2.3 + along * vec2( -0.17, 0.26 ) + 0.4;
  vec2 su1x = dFdx( su1 );
  vec2 su1y = dFdy( su1 );
  if ( pile > 0.02 ) {
    float strand = textureGrad( tPlush, su1, su1x, su1y ).r * 0.6 + textureGrad( tPlush, su2, su1x * 2.0, su1y * 2.0 ).r * 0.4;
    strand = ( strand - 0.784 ) * 7.3 * pile;
    diffuseColor.rgb *= 1.0 + 0.3 * strand;
    height += strand * 1.1 * saturate( 1.3 - ( abs( su1x.x ) + abs( su1x.y ) + abs( su1y.x ) + abs( su1y.y ) ) * 128.0 * 0.9 );
  }
  // Nähte: schmale dunkle Rille mit eingezogenem Rand (in der Ferne, schmaler als ein Bildpunkt, ausgeblendet)
  float gd = abs( vPlushSeam.x );
  float gw = max( fwidth( vPlushSeam.x ), 1e-5 );
  if ( gd < 0.012 ) {
    float near = saturate( 0.0045 / gw - 0.4 );
    float line = 1.0 - smoothstep( 0.0004, 0.0004 + max( gw, 0.0006 ), gd );
    float pinch = exp( - gd * gd / 0.0000075 ) * near;
    diffuseColor.rgb *= 1.0 - 0.5 * line * saturate( 0.003 / gw ) - 0.16 * pinch;
    height -= pinch * 1.3;
  }
  // Steppstiche: helle Fadenstriche entlang der Lauflänge
  float sd = abs( vPlushSeam.y );
  float sw = max( fwidth( vPlushSeam.y ), 1e-5 );
  if ( sd < 0.004 ) {
    float near = saturate( 0.003 / sw - 0.5 );
    float line = 1.0 - smoothstep( 0.00045, 0.00045 + max( sw, 0.0006 ), sd );
    float dash = smoothstep( 0.28, 0.36, abs( fract( vPlushSeam.z / 0.0052 ) - 0.5 ) * 2.0 );
    float thread = line * ( 1.0 - dash ) * near;
    diffuseColor.rgb = mix( diffuseColor.rgb, diffuseColor.rgb * 1.9 + 0.05, thread );
    height += thread * 0.9 - exp( - sd * sd / 0.000004 ) * near * 0.5;
  }
  // Aufdruck / Stickerei (nur auf Flächen, die nach vorn zeigen): Fäden schräg, leicht erhaben
  vec2 lu = vPlushLogo;
  float inLogo = step( 0.0, lu.x ) * step( lu.x, 1.0 ) * step( 0.0, lu.y ) * step( lu.y, 1.0 ) * smoothstep( 0.05, 0.25, nObj.z );
  float logoA = texture2D( tPlushLogo, clamp( lu, 0.0, 1.0 ) ).a * inLogo;
  float satin = 0.93 + 0.07 * sin( ( lu.x - lu.y ) * 420.0 );
  diffuseColor.rgb = mix( diffuseColor.rgb, vec3( 0.86, 0.855, 0.83 ) * satin, logoA );
  fuzz *= 1.0 - 0.55 * logoA;
  height += logoA * 0.7;
  // an Umrissen (streifender Blick) springt die Höhe von Bildpunkt zu Bildpunkt: dort keine Körnung, sonst kippt die
  // Normale und Glanzpunkte blitzen auf
  float facing = saturate( dot( normal, normalize( vViewPosition ) ) );
  normal = plushBump( - vViewPosition, normal, vec2( dFdx( height ), dFdy( height ) ) * 0.6 * smoothstep( 0.04, 0.3, facing ), faceDirection );
  plushFuzzK = fuzz * ( 0.8 + 0.4 * brush );
}
`;

const FRAG_RIM_COLOR = /* glsl */ `
plushRimColor = diffuseColor.rgb * 0.55 + dot( diffuseColor.rgb, vec3( 0.2 ) ) + vec3( 0.036, 0.037, 0.042 );
`;

const VERT_PAINT_PARS = /* glsl */ `
uniform vec3 plushObjScale;
attribute float plushFuzz;
attribute vec3 plushFlow;
attribute vec4 plushSeam;
attribute vec2 plushLogo;
varying vec3 vPlushObj;
varying vec3 vPlushNrm;
varying float vPlushFuzz;
varying vec3 vPlushFlow;
varying vec4 vPlushSeam;
varying vec2 vPlushLogo;
`;

const VERT_PAINT_MAIN = /* glsl */ `
vPlushObj = position * plushObjScale;
vPlushNrm = normal;
vPlushFuzz = plushFuzz;
vPlushFlow = plushFlow;
vPlushSeam = plushSeam;
vPlushLogo = plushLogo;
`;

/**
 * Beleuchtung von three.js mit weichem Schattenrand und Flausch-Rand (siehe Kopf der Datei). Nur das diffuse Licht
 * greift um die Form herum; Glanz und Stoffglanz rechnen mit dem echten N·L (sonst glitzern Kanten auf der
 * Schattenseite).
 */
function plushLights() {
  return THREE.ShaderChunk.lights_physical_pars_fragment.replace(
    'reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}',
    'float plushNL = dot( geometryNormal, directLight.direction );\n' +
      '\treflectedLight.directDiffuse += saturate( ( plushNL + PLUSH_WRAP ) / ( 1.0 + PLUSH_WRAP ) ) * directLight.color * BRDF_Lambert( material.diffuseColor );\n' +
      '\treflectedLight.directDiffuse += directLight.color * plushRimColor * plushRim( geometryNormal, geometryViewDir ) * saturate( plushNL * 0.5 + 0.62 ) * ( 0.55 + 0.75 * saturate( - dot( directLight.direction, geometryViewDir ) ) ) * RECIPROCAL_PI;\n}',
  );
}

function patchPlush(shader, paint) {
  shader.fragmentShader = shader.fragmentShader
    .replace('#include <lights_physical_pars_fragment>', '#define PLUSH_WRAP 0.38\n#define PLUSH_GRAIN ' + GRAIN.toFixed(2) + '\n' + FRAG_COMMON + (paint ? FRAG_PAINT_PARS : '') + plushLights())
    .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\n' + (paint ? FRAG_PAINT_MAIN : '') + FRAG_RIM_COLOR)
    .replace(
      '#include <lights_fragment_end>',
      '#include <lights_fragment_end>\n\treflectedLight.indirectDiffuse += ( irradiance + iblIrradiance ) * plushRimColor * plushRim( geometryNormal, geometryViewDir ) * RECIPROCAL_PI;',
    );
  if (paint) {
    // Stoffglanz je Bildpunkt aus der Stofffarbe (die Farbe steht in der Geometrie, nicht im Material)
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <lights_physical_fragment>',
      '#include <lights_physical_fragment>\n\tmaterial.sheenColor = ( diffuseColor.rgb * 0.65 + 0.35 * dot( diffuseColor.rgb, vec3( 0.33 ) ) + 0.02 ) * min( plushFuzzK, 1.4 ) * sheenColor.r;',
    );
    shader.vertexShader = VERT_PAINT_PARS + shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n' + VERT_PAINT_MAIN);
    shader.uniforms.tPlush = { value: fabric() };
    shader.uniforms.tPlushLogo = { value: paint.logo };
    shader.uniforms.plushObjScale = { value: paint.scale || new THREE.Vector3(1, 1, 1) };
  }
}

/**
 * Plüsch-Material. Ohne „paint“ für beliebige Geometrie mit UV-Koordinaten (Körnung über die UVs, Farbe aus
 * `color`; Vertexfarben darf der Aufrufer einschalten).
 * @param {number} color Stofffarbe
 * @param {boolean} curved für die gebogene Welt (siehe curve.js)
 * @param {object} o sheen: Stoffglanz, rough: Rauheit, side; paint: { logo: Textur, scale?: Vector3 } schaltet die
 *   Variante für die Figur ein (Farbe, Flausch, Strich, Nähte und Aufdruck aus der Geometrie); scale: Maßstab der
 *   Geometrie in Metern je Einheit (für Teile, die nicht in Metern gebaut sind – die Körnung bleibt dann gleich fein)
 */
export function plush(color, curved, { sheen = 0.9, rough = 0.95, side = THREE.FrontSide, paint = null } = {}) {
  const m = new THREE.MeshPhysicalMaterial({
    color: paint ? 0xffffff : color,
    roughness: rough,
    metalness: 0,
    sheen,
    sheenRoughness: 0.55,
    // mit „paint“ rechnet der Shader den Glanz aus der Stofffarbe; sheenColor.r ist dann nur die Stärke
    sheenColor: paint ? new THREE.Color(1, 1, 1) : new THREE.Color(color).lerp(new THREE.Color(0xffffff), 0.35),
    side,
    vertexColors: !!paint,
  });
  if (!paint) {
    m.bumpMap = fabric();
    m.bumpScale = 0.6;
  }
  const bend = curved ? curve(m).onBeforeCompile : null;
  m.onBeforeCompile = (shader, renderer) => {
    if (bend) bend(shader, renderer);
    patchPlush(shader, paint);
  };
  m.customProgramCacheKey = () => 'plush' + (paint ? '-paint' : '') + (curved ? '-curved' : '');
  return m;
}

// --- Augen ------------------------------------------------------------------------------------
// Beide Augen sind ein Netz aus zwei gestauchten Kugelkappen. Iris, Pupille und Glanzlichter malt der Shader
// auf die (ungestauchte) Einheitskugel: die Pupille ist ein Kreis um die Blickrichtung, kann also weder
// flimmern noch das Auge verlassen, und sie verkürzt sich von der Seite gesehen wie auf einem echten Glasauge.
export const EYE = {
  iris: 0.5, // Öffnungswinkel der Iris auf der Einheitskugel (rad)
  pupil: 0.33,
};

const EYE_VERT_PARS = /* glsl */ `
attribute vec4 eyeDir;
varying vec4 vEyeDir;
`;

const EYE_FRAG_PARS = /* glsl */ `
uniform vec3 uEyeGaze[ 2 ];
uniform vec2 uEyeLid[ 2 ];
uniform float uEyePupil;
varying vec4 vEyeDir;
float eyeDisc( vec3 n, vec3 c, float r, float aa ) {
  return 1.0 - smoothstep( r - aa, r + aa, acos( clamp( dot( n, c ), -1.0, 1.0 ) ) );
}
`;

const EYE_FRAG_MAIN = /* glsl */ `
{
  vec3 en = normalize( vEyeDir.xyz );
  int side = vEyeDir.w < 0.0 ? 0 : 1;
  vec3 eg = uEyeGaze[ side ];
  float ea = acos( clamp( dot( en, eg ), -1.0, 1.0 ) );
  float aa = max( fwidth( ea ) * 0.75, 0.003 );
  float rI = EYE_IRIS;
  float rP = EYE_PUPIL * uEyePupil;
  float iris = 1.0 - smoothstep( rI - aa, rI + aa, ea );
  float pupil = 1.0 - smoothstep( rP - aa, rP + aa, ea );
  // große dunkle Knopf-Pupille wie beim Plüsch: Iris fast schwarzbraun, zum Rand noch dunkler, unten ein warmer
  // Schimmer (Tiefe wie bei einem Glasauge)
  vec3 irisCol = mix( vec3( 0.075, 0.04, 0.022 ), vec3( 0.014, 0.009, 0.007 ), smoothstep( rI * 0.5, rI, ea ) );
  float low = saturate( 0.5 - ( en.y - eg.y ) / rI * 0.9 );
  irisCol *= 0.55 + 1.6 * low * low;
  vec3 col = mix( vec3( 0.93, 0.92, 0.89 ), irisCol, iris );
  col = mix( col, vec3( 0.004 ), pupil );
  // Schatten unter dem Oberlid und über dem Unterlid (Winkel um die Querachse des Auges)
  float elev = atan( en.y, en.z );
  vec2 lid = uEyeLid[ side ];
  float shade = smoothstep( lid.x - 0.5, lid.x + 0.03, elev ) * 0.5 + ( 1.0 - smoothstep( lid.y - 0.03, lid.y + 0.3, elev ) ) * 0.25;
  col *= 1.0 - shade;
  diffuseColor.rgb = col;
  // zwei Glanzlichter, wandern mit dem Blick (bleiben so immer auf der dunklen Iris)
  float glint = eyeDisc( en, normalize( eg + vec3( -0.25, 0.27, 0.0 ) ), 0.125, aa ) + 0.8 * eyeDisc( en, normalize( eg + vec3( 0.21, -0.2, 0.0 ) ), 0.055, aa );
  totalEmissiveRadiance += vec3( 1.9, 1.9, 1.85 ) * glint * ( 1.0 - shade * 1.3 );
  // das Weiß leuchtet ein wenig von selbst (Glasauge mit hellem Grund): sonst wird es im Schatten der Cap grau
  totalEmissiveRadiance += col * ( 1.0 - iris ) * 0.16 * ( 1.0 - shade );
}
`;

/** Material der Augen; uniforms: uEyeGaze[2] (Blick je Auge, Einheitsvektor im Augenraum), uEyeLid[2], uEyePupil. */
export function eyeMaterial(curved) {
  const m = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08 });
  m.userData.eye = {
    uEyeGaze: { value: [new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 1)] },
    // (Kante des Oberlids, Kante des Unterlids) als Winkel um die Querachse: 0 = geradeaus, + = oben
    uEyeLid: { value: [new THREE.Vector2(1.2, -1.2), new THREE.Vector2(1.2, -1.2)] },
    uEyePupil: { value: 1 },
  };
  const bend = curved ? curve(m).onBeforeCompile : null;
  m.onBeforeCompile = (shader, renderer) => {
    if (bend) bend(shader, renderer);
    Object.assign(shader.uniforms, m.userData.eye);
    shader.vertexShader = EYE_VERT_PARS + shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n\tvEyeDir = eyeDir;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#define EYE_IRIS ' + EYE.iris.toFixed(3) + '\n#define EYE_PUPIL ' + EYE.pupil.toFixed(3) + '\n#include <common>\n' + EYE_FRAG_PARS)
      .replace('#include <color_fragment>', '#include <color_fragment>\n' + EYE_FRAG_MAIN);
  };
  m.customProgramCacheKey = () => 'adam-eye' + (curved ? '-curved' : '');
  return m;
}
