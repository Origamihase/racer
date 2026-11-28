// Laufend neu gezeichnete Leinwände als sRGB-Textur (Mittelbildschirm, OMI), ohne den langsamen Weg des Browsers.
//
// Chromium kopiert eine Leinwand nur dann direkt auf der Grafikkarte in eine Textur, wenn deren Format RGBA8 ist. Für
// SRGB8_ALPHA8 (das Format einer CanvasTexture mit colorSpace sRGB) liest es die Leinwand erst zurück in den
// Hauptspeicher und lädt sie von dort hoch. Gemessen auf einem Snapdragon-X-Laptop (Adreno X1-85) für die 1024 × 640
// Punkte des Mittelbildschirms: rund 10 ms statt 0,3 ms, 15-mal je Sekunde, und das mitten im Zeichnen des Cockpits.
// three.js umgeht dasselbe bei Videos (RGBA8 und Umrechnung im Shader), dort wird dann aber im sRGB-Raum gefiltert.
//
// Hier bleibt das Bild Punkt für Punkt gleich: Die Leinwand geht roh als RGBA8 auf die Grafikkarte, und ein Rechteck
// kopiert sie dort in eine sRGB-Textur (der Shader rechnet nach linear, das Ziel beim Schreiben zurück: dieselben
// Bytes wie beim direkten Hochladen). Verkleinerungsstufen, Filter und Anisotropie sind die der Zieltextur, also wie
// zuvor. Kopiert wird vor dem ersten Durchgang eines Bilds (flushLiveCanvases), nicht mehr mittendrin.
import * as THREE from 'three';

const all = new Set();
const pending = new Set();
// die Leinwand des Renderers, an der schon auf eine zurückgesetzte Grafikkarte gelauscht wird
let watched = null;
let copyScene = null;
let copyCam = null;
let copyMat = null;

function copyPass() {
  if (copyScene) return;
  copyMat = new THREE.ShaderMaterial({
    uniforms: { tMap: { value: null } },
    vertexShader: 'varying vec2 vUv;\nvoid main() {\n  vUv = uv;\n  gl_Position = vec4( position.xy, 0.0, 1.0 );\n}',
    // sRGB → linear wie die Grafikkarte beim Lesen einer sRGB-Textur (IEC 61966-2-1); Alpha bleibt
    fragmentShader: [
      'uniform sampler2D tMap;',
      'varying vec2 vUv;',
      'void main() {',
      '  vec4 c = texture2D( tMap, vUv );',
      '  vec3 lo = c.rgb * 0.0773993808;',
      '  vec3 hi = pow( c.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) );',
      '  gl_FragColor = vec4( mix( hi, lo, vec3( lessThanEqual( c.rgb, vec3( 0.04045 ) ) ) ), c.a );',
      '}',
    ].join('\n'),
    depthTest: false,
    depthWrite: false,
    blending: THREE.NoBlending,
    toneMapped: false,
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), copyMat);
  quad.frustumCulled = false;
  copyScene = new THREE.Scene();
  copyScene.add(quad);
  copyCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
}

/**
 * Eine Leinwand, die sich zur Laufzeit ändert, als Textur: texture gehört in das Material (map), needsUpdate = true
 * meldet neuen Inhalt (wie bei einer CanvasTexture). Auf die Grafikkarte kommt er mit dem nächsten flushLiveCanvases.
 */
export class LiveCanvas {
  constructor(canvas, { anisotropy = 1 } = {}) {
    this.canvas = canvas;
    // roh (kein Farbraum: RGBA8), ohne Verkleinerungsstufen und ungefiltert, denn kopiert wird Punkt auf Punkt
    this.source = new THREE.CanvasTexture(canvas);
    this.source.colorSpace = THREE.NoColorSpace;
    this.source.generateMipmaps = false;
    this.source.minFilter = THREE.NearestFilter;
    this.source.magFilter = THREE.NearestFilter;
    // das Ziel: wie die CanvasTexture bisher (sRGB, alle Verkleinerungsstufen, trilinear)
    this.target = new THREE.WebGLRenderTarget(canvas.width, canvas.height, {
      colorSpace: THREE.SRGBColorSpace,
      depthBuffer: false,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
      magFilter: THREE.LinearFilter,
      anisotropy,
    });
    this.texture = this.target.texture;
    this.dirty = false;
    this.needsUpdate = true;
    all.add(this);
  }

  get needsUpdate() {
    return this.dirty;
  }

  set needsUpdate(v) {
    this.dirty = !!v;
    if (this.dirty) pending.add(this);
    else pending.delete(this);
  }

  dispose() {
    all.delete(this);
    pending.delete(this);
    this.source.dispose();
    this.target.dispose();
  }
}

/** Vor dem ersten Durchgang eines Bilds: alle Leinwände mit neuem Inhalt auf die Grafikkarte bringen. */
export function flushLiveCanvases(renderer) {
  if (watched !== renderer.domElement) {
    // Grafikkarte zurückgesetzt: three.js legt die Zieltexturen neu an, aber leer (eine CanvasTexture lüde es von
    // selbst wieder hoch). Also alle Leinwände noch einmal kopieren, auch die, die sich gerade nicht ändern.
    watched = renderer.domElement;
    watched.addEventListener('webglcontextrestored', () => {
      for (const c of all) c.needsUpdate = true;
    });
  }
  if (!pending.size) return;
  copyPass();
  const target = renderer.getRenderTarget();
  // (mit Löschen: so muss die Grafikkarte den alten Inhalt des Ziels nicht erst wiederherstellen)
  const clear = renderer.autoClear;
  renderer.autoClear = true;
  for (const c of pending) {
    c.dirty = false;
    c.source.needsUpdate = true;
    copyMat.uniforms.tMap.value = c.source;
    renderer.setRenderTarget(c.target);
    renderer.render(copyScene, copyCam);
  }
  pending.clear();
  copyMat.uniforms.tMap.value = null;
  renderer.setRenderTarget(target);
  renderer.autoClear = clear;
}
