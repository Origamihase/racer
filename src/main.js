// Mini Adam – Tesla-Navi ferngesteuert
// Hauptprogramm: Renderer, Bildkomposition (Welt → Regentropfen/Effekte → Cockpit), Kameras
// (Cockpit, Drohne, Kameraschwenk beim Start, Vorführmodus), Zustände und Menüs.
import * as THREE from 'three';
import { curveUniforms } from './curve.js';
import { setMaxAnisotropy, ROAD, roundRect } from './textures.js';
import { Road } from './world/road.js';
import { Sky } from './world/sky.js';
import { Scenery } from './world/scenery.js';
import { Traffic } from './world/traffic.js';
import { prewarmVehicles } from './models/vehicles.js';
import { buildTesla } from './models/tesla.js';
import { Cockpit } from './cockpit/cockpit.js';
import { Windshield, createCompositeMaterial } from './fx/windshield.js';
import { Rain } from './fx/rain.js';
import { Audio } from './audio.js';
import { Speech } from './speech.js';
import { Input } from './input.js';
import { loadSave, storeSave, resetSave } from './save.js';
import { Game } from './game/game.js';
import { Pickups } from './game/pickups.js';
import { UI } from './ui/ui.js';
import { Menus } from './ui/menus.js';
import { SHOP, UPGRADE_LIMITS } from './data.js';
import { clamp, lerp, damp, easeInOut, smoothstep } from './util.js';

const QUALITY = {
  hoch: { pr: 1.5, msaa: 4, shadows: true, shadowSize: 2048, mirrorEvery: 1 },
  mittel: { pr: 1.0, msaa: 4, shadows: true, shadowSize: 1024, mirrorEvery: 2 },
  niedrig: { pr: 0.75, msaa: 0, shadows: false, shadowSize: 1024, mirrorEvery: 3 },
};
const DEBUG = /[?&]debug/.test(location.search);

// ---------------------------------------------------------------------------
const app = document.getElementById('app');
const loadingEl = document.getElementById('loading');
const save = loadSave();
let settings = save.settings;

function qualityPreset() {
  const q = settings.quality;
  if (q === 'auto') return { ...QUALITY.hoch, pr: Math.min(window.devicePixelRatio || 1, 1.25), auto: true };
  return { ...(QUALITY[q] || QUALITY.mittel), pr: Math.min(window.devicePixelRatio || 1, (QUALITY[q] || QUALITY.mittel).pr) };
}
let quality = qualityPreset();

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
} catch (e) {
  loadingEl.innerHTML = '<div class="load-card"><h1>Mini Adam</h1><p>WebGL konnte nicht gestartet werden. Bitte eine aktuelle Version von Google Chrome verwenden und die Hardware-Beschleunigung einschalten.</p></div>';
  throw e;
}
let pixelRatio = quality.pr;
renderer.setPixelRatio(pixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = quality.shadows;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.autoUpdate = false;
renderer.domElement.id = 'view';
app.prepend(renderer.domElement);
setMaxAnisotropy(renderer.capabilities.getMaxAnisotropy());

// --- Welt ----------------------------------------------------------------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.25, 3200);
const cockpitCam = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.012, 20);
// Seitenverhältnis wie das Innenspiegelglas (0,245 × 0,072 m), damit nichts verzerrt wird
const rearCam = new THREE.PerspectiveCamera(21, 0.245 / 0.072, 0.6, 700);
const photoCam = new THREE.PerspectiveCamera(24, 16 / 9, 0.2, 900);

const sky = new Sky(renderer, scene, { shadows: quality.shadows, shadowSize: quality.shadowSize });
const road = new Road(scene);
const scenery = new Scenery(scene);
const rain = new Rain(scene);
const traffic = new Traffic(scene, rain);
const pickups = new Pickups(scene);
prewarmVehicles();
const tesla = buildTesla();
scene.add(tesla.root);
const cockpit = new Cockpit();
cockpit.scene.environment = sky.envTarget.texture;
sky.onEnv = (tex) => {
  cockpit.scene.environment = tex;
};
const windshield = new Windshield();

// Render-Ziele
const size = new THREE.Vector2();
function drawSize() {
  renderer.getDrawingBufferSize(size);
  return size;
}
drawSize();
const worldRT = new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType, samples: quality.msaa, depthBuffer: true });
const mirrorRT = new THREE.WebGLRenderTarget(768, 226, { type: THREE.HalfFloatType, samples: 4, depthBuffer: true });
cockpit.setMirrorTexture(mirrorRT.texture);
const compMat = createCompositeMaterial(worldRT.texture, windshield);
const compScene = new THREE.Scene();
const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), compMat);
quad.frustumCulled = false;
compScene.add(quad);
const compCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const U = compMat.uniforms;
// Bildeffekte über dem fertigen Bild aus Welt und Cockpit (sonst wirkt das Cockpit wie aufgeklebt):
// Vignette, Blitz und Überblendung per Mischung; Frosch-Grünstich und Funkloch-Bildstörung brauchen
// das fertige Bild, dafür wird es nur in diesen Momenten kopiert.
const postScene = new THREE.Scene();
const screenSize = new THREE.Vector2();
let screenTex = null;
const postMat = new THREE.ShaderMaterial({
  uniforms: {
    tScreen: { value: null },
    uCopy: { value: 0 },
    uFade: U.uFade,
    uFlash: U.uFlash,
    uFlashColor: U.uFlashColor,
    uVignette: U.uVignette,
    uGreen: U.uGreen,
    uGlitch: U.uGlitch,
    uTime: U.uTime,
  },
  vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
  fragmentShader: `
    uniform sampler2D tScreen;
    uniform float uCopy;
    uniform float uFade;
    uniform float uFlash;
    uniform vec3 uFlashColor;
    uniform float uVignette;
    uniform float uGreen;
    uniform float uGlitch;
    uniform float uTime;
    varying vec2 vUv;
    void main() {
      vec2 vc = vUv - 0.5;
      // gleiche Vignette wie im Weltbild (dort vor, hier nach der sRGB-Kodierung)
      float vig = pow(max(0.0, 1.0 - dot(vc, vc) * uVignette), 0.4545);
      float f = clamp(uFlash, 0.0, 1.0);
      float k = 1.0 - clamp(uFade, 0.0, 1.0);
      vec3 flash = min(uFlashColor * 4.0, vec3(1.0)) * f;
      if (uCopy > 0.5) {
        vec2 uv = vUv;
        if (uGlitch > 0.0) {
          float band = floor(uv.y * 30.0) + floor(uTime * 24.0);
          float r = fract(sin(band * 91.7) * 4375.85);
          uv.x += (r - 0.5) * 0.08 * uGlitch * step(0.6, r);
        }
        vec3 c = texture2D(tScreen, uv).rgb;
        float g = dot(c, vec3(0.3, 0.6, 0.1));
        c = mix(c, vec3(0.08, 1.0, 0.25) * (0.3 + g), uGreen * 0.65);
        gl_FragColor = vec4((c * vig * (1.0 - f) + flash) * k, 1.0);
      } else {
        // vormultipliziert: Bild * (1 - a) + Farbe
        gl_FragColor = vec4(flash * k, 1.0 - vig * (1.0 - f) * k);
      }
    }`,
  transparent: true,
  depthTest: false,
  depthWrite: false,
  blending: THREE.CustomBlending,
  blendSrc: THREE.OneFactor,
  blendDst: THREE.OneMinusSrcAlphaFactor,
});
const postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMat);
postQuad.frustumCulled = false;
postScene.add(postQuad);

// Kofferraum-Ansicht für den Innenspiegel (Bitspende „Kofferraum öffnen“)
const trunkTex = (() => {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 192;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 192);
  g.addColorStop(0, '#2a2c30');
  g.addColorStop(1, '#141517');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 192);
  ctx.fillStyle = '#0c0c0d';
  ctx.fillRect(0, 0, 512, 34);
  const box = (x, y, w, h, col, label) => {
    ctx.fillStyle = col;
    roundRect(ctx, x, y, w, h, 8);
    ctx.fill();
    ctx.fillStyle = '#e8e8e8';
    ctx.font = 'bold 15px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + w / 2, y + h / 2 + 5);
  };
  box(24, 70, 120, 84, '#3b3f46', 'Akku-Pack');
  box(160, 92, 96, 62, '#20242a', 'Router');
  box(272, 60, 92, 94, '#5a2a2a', 'KONFETTI');
  box(380, 84, 110, 70, '#1e3550', 'LTE ×3');
  ctx.strokeStyle = '#d4a21a';
  ctx.lineWidth = 3;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(140 + i * 8, 120);
    ctx.bezierCurveTo(180, 175 - i * 6, 330, 178, 380, 120 + i * 6);
    ctx.stroke();
  }
  ctx.fillStyle = '#ff4d4d';
  ctx.font = 'bold 18px Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('● REC  Kofferraum offen', 18, 24);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.repeat.x = -1;
  t.offset.x = 1;
  return t;
})();

// Blitzerfoto
const photoCanvas = document.createElement('canvas');
photoCanvas.width = 360;
photoCanvas.height = 270;
const photoCtx = photoCanvas.getContext('2d');

// --- Ton, Sprache, Eingabe, Oberfläche ---------------------------------------------
const audio = new Audio();
audio.enabled = settings.sound;
audio.volume = settings.volume;
const speech = new Speech();
speech.enabled = settings.speech;
const input = new Input();
const ui = new UI(app);
ui.setChat(settings.chat);

// Touch-Knöpfe (nur auf Geräten mit Touchscreen sichtbar)
const touchEl = document.createElement('div');
touchEl.className = 'touch';
for (const [action, label, cls] of [
  ['left', '◀', 't-left'], ['right', '▶', 't-right'], ['brake', 'Bremse', 't-brake'], ['gas', 'Strom', 't-gas'],
  ['horn', '📯', 't-small t-horn'], ['wiper', '🌧️', 't-small t-wiper'], ['megafon', '📢', 't-small t-megafon'],
  ['camera', '🎥', 't-small t-camera'], ['pause', '⏸', 't-small t-pause'],
]) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = cls;
  b.textContent = label;
  touchEl.appendChild(b);
  input.bindTouch(b, action);
}
app.appendChild(touchEl);

let photoRequest = null;
const fxState = { flash: 0, glitch: 0, green: 0, trunk: 0, fade: 0, fadeTarget: 0 };
const fx = {
  flash: (v = 1) => {
    fxState.flash = Math.max(fxState.flash, v);
  },
  glitch: (dur) => {
    fxState.glitch = Math.max(fxState.glitch, dur);
  },
  green: (dur) => {
    fxState.green = Math.max(fxState.green, dur);
  },
  shake: (v) => {
    cockpit.shake = Math.max(cockpit.shake, v);
  },
  trunk: (dur) => {
    fxState.trunk = dur;
    cockpit.setTrunkView(trunkTex);
    cockpit.mirrorMat.needsUpdate = true;
  },
};
const uiFacade = {
  reset: () => ui.reset(),
  chat: (m) => ui.chat(m),
  toast: (t, k, sub) => ui.toast(t, k, sub),
  banner: (t, d, sub) => ui.banner(t, d, sub),
  nomi: (t, d) => ui.nomi(t, d),
  money: (a, l) => ui.money(a, l),
  durchsage: (l, t, d, b) => ui.durchsage(l, t, d, b),
  rahmen: (r, b) => ui.rahmen(r, b),
  funkloch: (on) => ui.funkloch(on),
  damage: (h, m) => ui.damage(h, m),
  jobs: (j) => ui.jobs(j),
  photo: (kmh, clock) => {
    photoRequest = { kmh, clock };
  },
};

const game = new Game({ traffic, scenery, road, sky, rain, windshield, cockpit, audio, speech, ui: uiFacade, fx, pickups });

// --- Zustände ------------------------------------------------------------------
let state = 'loading';
let view = 'cockpit'; // oder 'drone'
let stateT = 0;
let paused = false;
let lastOver = null;
let introSkip = false;

const menus = new Menus(app, {
  click: () => {
    audio.init();
    audio.click();
  },
  action: (a) => {
    if (a === 'start' || a === 'restart') startRun();
    else if (a === 'resume') resume();
    else if (a === 'quit') {
      paused = false;
      menus.hide();
      game.end('quit');
    } else if (a === 'menu') toTitle();
  },
  back: () => {},
  dataFor: (name, data) => {
    if (name === 'shop') return { wallet: save.wallet, upgrades: save.upgrades };
    if (name === 'settings') return { ...settings, speechSupported: speech.supported };
    if (name === 'title') return save;
    if (name === 'pause') return game;
    // Guthaben frisch, falls im Shop aus dem Abspann heraus eingekauft wurde
    if (name === 'over') return lastOver ? { ...lastOver, wallet: save.wallet } : data;
    return data;
  },
  buy: (id) => {
    const it = SHOP.find((x) => x.id === id);
    const lvl = save.upgrades[id] || 0;
    if (!it || lvl >= UPGRADE_LIMITS[id]) return false;
    const price = it.prices[lvl];
    if (save.wallet < price) {
      audio.bad();
      return false;
    }
    save.wallet = Math.round((save.wallet - price) * 100) / 100;
    save.upgrades[id] = lvl + 1;
    storeSave(save);
    audio.coin();
    applyCosmetics();
    return true;
  },
  setting: (key, value) => {
    settings[key] = value;
    save.settings = settings;
    storeSave(save);
    applySettings(key);
  },
  resetSave: () => {
    const fresh = resetSave();
    for (const k of Object.keys(save)) delete save[k];
    Object.assign(save, fresh);
    settings = save.settings;
    storeSave(save);
    applyCosmetics();
    applySettings();
  },
});

function applyCosmetics() {
  const up = save.upgrades;
  tesla.setStarlink(!!up.starlink);
  tesla.setVest(!!up.weste);
  cockpit.setElsa(!!up.elsa);
}

function applySettings(key) {
  audio.enabled = settings.sound;
  audio.volume = settings.volume;
  audio.setEnabled(settings.sound);
  speech.enabled = settings.speech;
  if (!settings.speech) speech.stopAll();
  ui.setChat(settings.chat);
  if (!key || key === 'quality') {
    const before = quality;
    quality = qualityPreset();
    pixelRatio = quality.pr;
    if (before.shadows !== quality.shadows) {
      renderer.shadowMap.enabled = quality.shadows;
      sky.sun.castShadow = quality.shadows;
      scene.traverse((o) => {
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => (m.needsUpdate = true));
      });
    }
    // neue Schattenauflösung: alte Schattenkarte verwerfen, three.js legt sie passend neu an
    const sh = sky.sun.shadow;
    if (sh.mapSize.x !== quality.shadowSize) {
      sh.mapSize.set(quality.shadowSize, quality.shadowSize);
      if (sh.map) {
        sh.map.dispose();
        sh.map = null;
      }
    }
    worldRT.samples = quality.msaa;
    worldRT.dispose();
    onResize();
  }
}

function toTitle() {
  state = 'title';
  stateT = 0;
  paused = false;
  cockpit.shake = 0;
  view = 'cockpit';
  ui.show(false);
  speech.stopAll();
  game.startDemo();
  applyCosmetics();
  menus.hide();
  menus.show('title', save);
}

function startRun() {
  audio.init();
  menus.hide();
  paused = false;
  game.start(save);
  applyCosmetics();
  state = 'intro';
  stateT = 0;
  introSkip = false;
  view = 'cockpit';
  ui.show(false);
  fxState.fade = 1;
  cockpit.shake = 0;
  // die Taste, die „Losfahren“ ausgelöst hat, soll den Kameraschwenk nicht gleich überspringen
  input.endFrame();
}

function resume() {
  paused = false;
  menus.hide();
  speech.pause(false);
  input.pressed.clear();
  input.keys.clear();
}

function pause() {
  if (state !== 'drive' || paused) return;
  paused = true;
  speech.pause(true);
  menus.show('pause', game);
}

function finishRun() {
  const o = game.over;
  const km = o.distance / 1000;
  const best = save.best.distance || 0;
  const newRecord = o.distance > best && o.distance > 50;
  save.wallet = Math.round((save.wallet + o.money) * 100) / 100;
  save.best.distance = Math.max(best, o.distance);
  save.best.earned = Math.max(save.best.earned || 0, o.money);
  save.best.viewers = Math.max(save.best.viewers || 0, o.peakViewers);
  save.stats.runs++;
  save.stats.totalKm += km;
  save.stats.naviReached += o.stats.naviReached;
  save.stats.crashes += o.stats.crashes;
  save.stats.leftLaneEuro += o.breakdown['Linke Spur'] || 0;
  storeSave(save);
  lastOver = { ...o, newRecord, best: save.best.distance, wallet: save.wallet, photos: ui.photos.slice() };
}

// --- Autopilot (Titel, Kameraschwenk, Abspann) -------------------------------------
const ap = { lane: 2, cool: 0 };
function autopilot(dt, targetKmh, allowChanges = true) {
  const p = game.player;
  ap.cool -= dt;
  let lead = null;
  let leadDs = Infinity;
  for (const c of traffic.cars) {
    const ds = c.s - p.s;
    if (ds > 0 && ds < 70 && Math.abs(c.x - p.x) < 2.3 && ds < leadDs) {
      lead = c;
      leadDs = ds;
    }
  }
  if (allowChanges && lead && leadDs < 55 && ap.cool <= 0) {
    const free = (lane) => lane >= 1 && lane <= 3 && traffic.cars.every((c) => Math.abs(c.x - ROAD.laneCenter(lane)) > 2.4 || c.s - p.s < -22 || c.s - p.s > 48);
    const cur = p.lane;
    const opts = [cur - 1, cur + 1].filter(free);
    if (opts.length) {
      ap.lane = opts[0];
      ap.cool = 3;
    }
  }
  if (ap.cool <= -8 && ap.lane < 3) {
    const lane = ap.lane + 1;
    if (traffic.cars.every((c) => Math.abs(c.x - ROAD.laneCenter(lane)) > 2.4 || c.s - p.s < -22 || c.s - p.s > 60)) {
      ap.lane = lane;
      ap.cool = 3;
    }
  }
  const dx = ROAD.laneCenter(ap.lane) - p.x;
  const steer = Math.abs(dx) > 0.25 ? clamp(dx * 0.9, -1, 1) : 0;
  let throttle = p.kmh < targetKmh ? 0.6 : 0;
  let brake = 0;
  if (lead && leadDs < 40 && lead.speed < p.speed) {
    throttle = 0;
    brake = clamp((p.speed - lead.speed) / 8 + (40 - leadDs) / 40, 0, 1);
  }
  return { steer, throttle, brake, horn: false, wiper: false, megafon: false };
}

// --- Kameras -----------------------------------------------------------------------
const carMatrix = new THREE.Matrix4();
const carPos = new THREE.Vector3();
const carQuat = new THREE.Quaternion();
const carEuler = new THREE.Euler();
const ONE = new THREE.Vector3(1, 1, 1);
const tmpV = new THREE.Vector3();
const tmpV2 = new THREE.Vector3();
const drone = { pos: new THREE.Vector3(0, 4, 10), look: new THREE.Vector3(0, 1, -10), init: false };

function updateCarMatrix() {
  const p = game.player;
  carPos.set(p.x, 0, 0);
  carEuler.set(0, -p.yaw, clamp(p.latAcc * 0.0025, -0.03, 0.03), 'YXZ');
  carQuat.setFromEuler(carEuler);
  carMatrix.compose(carPos, carQuat, ONE);
  tesla.root.position.copy(carPos);
  tesla.root.quaternion.copy(carQuat);
  cockpit.root.position.copy(carPos);
  cockpit.root.quaternion.copy(carQuat);
}

function setFov(vfovCockpit) {
  const aspect = window.innerWidth / window.innerHeight;
  const minH = THREE.MathUtils.degToRad(86);
  const v = Math.max(THREE.MathUtils.degToRad(vfovCockpit), 2 * Math.atan(Math.tan(minH / 2) / aspect));
  camera.fov = clamp(THREE.MathUtils.radToDeg(v), 50, 78);
  camera.aspect = aspect;
  // Bildverschiebung gibt es nur im Titel (titleViewOffset setzt sie danach wieder)
  if (camera.view) camera.view.enabled = false;
  camera.updateProjectionMatrix();
}

// Im Titel fährt der Wagen sonst hinter den Menüknöpfen (4:3, Handy hochkant): Das Bild wird so verschoben, dass
// der ganze Wagen (sein Umriss auf dem Bildschirm, nicht der Blickpunkt auf Dachhöhe) mitten in der freien Fläche
// neben, unter oder über der Titelkarte steht – in der, in die er am besten passt. Ist auch die zu klein, fährt
// die Orbit-Kamera so weit zurück, dass er hineinpasst.
const viewOff = { x: 0, y: 0 };
// so groß wird der Wagen auf dem Bildschirm höchstens (m, Seitenansicht etwas von oben), Abstände (px), Füllgrad
const TITLE_CAR = { w: 5.4, h: 2.8, gap: 12, edge: 10, fill: 0.9, zoomMax: 1.7 };
const carBoxPt = new THREE.Vector3();
/** Bildschirm-Rechteck [x0, y0, x1, y1] um den Tesla für die Kamera ohne Bildverschiebung */
function carScreenBox(Wd, Hd) {
  camera.updateMatrixWorld();
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (let i = 0; i < 8; i++) {
    carBoxPt.set(i & 1 ? 1.0 : -1.0, i & 2 ? 1.45 : 0, i & 4 ? 2.35 : -2.35).applyMatrix4(carMatrix).project(camera);
    const px = ((carBoxPt.x + 1) / 2) * Wd;
    const py = ((1 - carBoxPt.y) / 2) * Hd;
    x0 = Math.min(x0, px);
    x1 = Math.max(x1, px);
    y0 = Math.min(y0, py);
    y1 = Math.max(y1, py);
  }
  return [x0, y0, x1, y1];
}
/** Lage der Titelkarte ohne ihre Einflug-Animation (die schiebt sie nur kurz zur Seite) */
function titleCardRect() {
  const card = state === 'title' ? document.querySelector('.screen-title:not(.hidden) .title-card') : null;
  if (!card || !card.offsetWidth) return null;
  const par = card.offsetParent;
  const pr = par ? par.getBoundingClientRect() : { left: 0, top: 0 };
  const left = pr.left + card.offsetLeft - (par ? par.scrollLeft : 0);
  const top = pr.top + card.offsetTop - (par ? par.scrollTop : 0);
  return { left, top, right: left + card.offsetWidth, bottom: top + card.offsetHeight };
}
/**
 * Abspann-Fahrt („Akku leer …“): die sichtbare HUD-Mitte (NOMI-Untertitel, Banner, Hinweise). Auf dem Handy quer
 * steht sie mitten im Bild – der Wagen gehört darunter, sonst verdeckt der Untertitel ihn die ganze Zeit.
 */
function endStackRect() {
  if (state !== 'ending' || !ui.stackEl) return null;
  const s = ui.stackEl.getBoundingClientRect();
  const bottom = ui.stackBottom(s);
  if (!s.height || !(bottom > s.top)) return null;
  return { left: s.left, top: s.top, right: s.right, bottom };
}
function titleViewOffset(dt) {
  const Wd = window.innerWidth;
  const Hd = window.innerHeight;
  let tx = 0;
  let ty = 0;
  let zoom = 1;
  const card = titleCardRect();
  const r = card || endStackRect();
  if (r) {
    const G = TITLE_CAR;
    const ppm = Hd / (2 * ORBIT.r * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
    const regions = card
      ? [
          [r.right + G.gap, G.edge, Wd - G.edge, Hd - G.edge],
          [G.edge, r.bottom + G.gap, Wd - G.edge, Hd - G.edge],
          [G.edge, G.edge, Wd - G.edge, r.top - G.gap],
        ]
      : [[G.edge, r.bottom + G.gap, Wd - G.edge, Hd - G.edge]];
    let best = null;
    let bestS = Infinity;
    for (const g of regions) {
      const w = g[2] - g[0];
      const h = g[3] - g[1];
      if (w < 60 || h < 40) continue;
      // so viel weiter weg müsste die Kamera, damit der Wagen hineinpasst (unter 1: passt schon)
      const s = Math.max(1, (G.w * ppm) / (w * G.fill), (G.h * ppm) / (h * G.fill));
      if (s < bestS - 0.01) {
        bestS = s;
        best = g;
      }
    }
    if (best) {
      zoom = Math.min(bestS, G.zoomMax);
      const b = carScreenBox(Wd, Hd);
      tx = (best[0] + best[2]) / 2 - (b[0] + b[2]) / 2;
      ty = (best[1] + best[3]) / 2 - (b[1] + b[3]) / 2;
    }
  }
  // im ersten Bild (Titel, Abspann) gleich an Ort und Stelle, danach gleitend
  const first = stateT <= dt * 1.5;
  const k = first ? 1 : 1 - Math.exp(-dt * 4);
  viewOff.x += (tx - viewOff.x) * k;
  viewOff.y += (ty - viewOff.y) * k;
  orbit.zoom += (zoom - orbit.zoom) * (first ? 1 : 1 - Math.exp(-dt * 1.5));
  if (Math.abs(viewOff.x) + Math.abs(viewOff.y) > 0.5) camera.setViewOffset(Wd, Hd, -viewOff.x, -viewOff.y, Wd, Hd);
}

function localToWorld(v) {
  return tmpV.copy(v).applyMatrix4(carMatrix);
}

// Orbit-Kamera (Titel, Abspann): bleibt über der eigenen Fahrbahn – vor Lärmschutzwand, Schildern,
// Schilderbrücken- und Brückenpfeilern und der Mittelleitplanke (auf der Gegenfahrbahn kommen die
// Autos zu schnell). Fahrzeuge, die ihr in den nächsten Sekunden die Sicht auf den Tesla nähmen oder unter ihr
// durchführen (Lkw, Wohnmobil, Transporter, aber auch Autos), umfährt sie: Sie schwenkt rechtzeitig dorthin, wo der
// Blick frei bleibt – hinter oder vor das Auto oder auf die andere Seite – und wartet dort, bis sie vorbei sind.
// Über Fahrzeuge steigt sie nur noch zur Not, statt durch sie hindurchzufliegen.
const ORBIT = {
  r: 8.5, xMin: ROAD.left + 0.25, xMax: ROAD.right + 0.4, yMax: 4.8, clear: 0.9, margin: 0.5, blend: 2.5, lead: 1.4,
  // Sicht: Vorausschau (s) und ihre Schritte; ab „bad“ weicht die Kamera aus, unter „ok“ ist der Blick frei.
  // Ausweichen mit höchstens wEsc (rad/s, die Blickrichtung dreht sich dann gut 30°/s) und Winkelbeschleunigung acc;
  // beim Schwenken schaut sie „ahead“ (rad) voraus
  see: 2.4, seeStep: 0.3, bad: 0.3, ok: 0.12, wEsc: 0.6, acc: 1.4, ahead: 0.21,
  // so lange (s) muss der Blick am Ziel nach der Ankunft frei bleiben (langsame Lkw sind lange im Weg)
  hold: 3.2,
  // so hoch steigt sie, um über Autos zwischen ihr und dem Tesla hinwegzuschauen; Drehrate und Steig-/Sinkrate
  // der Kamera selbst höchstens (rad/s, m/s): der Blick dreht sich nie schneller als etwa 40°/s
  yLow: 3.9, wMax: 0.68, vyMax: 2.2,
};
const orbitPos = new THREE.Vector3();
// Ist auf einer Seite des Autos zu wenig Platz für den vollen Bogen (rechte Spur, Standstreifen, an der
// Mittelleitplanke), kehrt die Kamera hinter bzw. vor dem Auto um und schwingt auf der freien Seite hin und
// her, statt sich dicht neben das Auto zu quetschen (dort wäre es plötzlich anderthalbmal so groß und hochkant
// angeschnitten). Wechselt das Auto mitten im Bogen auf eine enge Spur, verlässt sie die enge Seite zügig auf dem
// kürzesten Weg. Sie springt dabei nie quer durchs Bild und dreht den Blick nie schneller als etwa 40°/s.
const ORBIT_SPEED = 0.16; // rad/s
// a: Winkel um das Auto (0 = dahinter, π/2 = rechts), w: Drehrate, esc: Ziel beim Ausweichen, zoom: Abstand im Titel
const orbit = { a: 0.9, dir: 1, w: 0, esc: null, plan: 0, zoom: 1, phi: 0, dist: ORBIT.r };
function orbitRoom(p, side) {
  // im Titel zählt schon die Spur, auf die der Autopilot gerade wechselt: so ist die Kamera rechtzeitig weg
  const xs = [p.x, orbitLaneX(p)];
  return Math.min(...xs.map((x) => (side > 0 ? ORBIT.xMax - x : x - ORBIT.xMin)));
}
function orbitBlocked(p, side, r = ORBIT.r * orbit.zoom) {
  const room = orbitRoom(p, side);
  return room < r * 0.75 && orbitRoom(p, -side) > room;
}
/** Darf die Kamera bei Winkel a stehen? Auf einer engen Seite nur so weit, wie dort Platz ist (schräg hinter/vor dem Auto). */
function orbitAllowed(p, a, r) {
  const side = Math.sin(a) >= 0 ? 1 : -1;
  return !orbitBlocked(p, side, r) || Math.abs(Math.sin(a)) * r <= orbitRoom(p, side) - 0.3;
}

// Prüfpunkte am Tesla (relativ zur Wagenmitte): sieht die Kamera sie, sieht sie den Wagen
const ORBIT_PTS = [];
for (const x of [-0.8, 0.8]) for (const y of [0.45, 1.25]) for (const z of [-2.0, 0, 2.0]) ORBIT_PTS.push([x, y, z]);
/** Schneidet die Strecke a→b den Quader [x0,x1]×[0,y1]×[z0,z1]? */
function segHitsBox(ax, ay, az, bx, by, bz, x0, x1, y1, z0, z1) {
  const t = [0, 1];
  return slab(t, ax, bx - ax, x0, x1) && slab(t, az, bz - az, z0, z1) && slab(t, ay, by - ay, 0, y1);
}
function slab(t, o, d, mn, mx) {
  if (Math.abs(d) < 1e-9) return o >= mn && o <= mx;
  const ta = (mn - o) / d;
  const tb = (mx - o) / d;
  t[0] = Math.max(t[0], Math.min(ta, tb));
  t[1] = Math.min(t[1], Math.max(ta, tb));
  return t[0] <= t[1];
}
/**
 * Mindesthöhe der Kamera (cx, cz relativ zum Tesla), damit sie über ein Fahrzeug mit Grundriss [x0,x1]×[z0,z1] und
 * Höhe h hinweg die ihr zugewandte Wagenseite fast ganz sieht (0, wenn es nicht dazwischen ist): Ihr Blick auf diese
 * Seite in 0,5 m Höhe geht 0,15 m über das Dach. u = Weg bis zur hinteren Dachkante, bezogen auf den bis zur Wagenseite.
 */
function sightLift(cx, cz, x0, x1, z0, z1, h) {
  let t0 = 0;
  let t1 = 1;
  for (const [o, d, mn, mx] of [[cx, -cx, x0, x1], [cz, -cz, z0, z1]]) {
    if (Math.abs(d) < 1e-9) {
      if (o < mn || o > mx) return 0;
      continue;
    }
    const ta = (mn - o) / d;
    const tb = (mx - o) / d;
    t0 = Math.max(t0, Math.min(ta, tb));
    t1 = Math.min(t1, Math.max(ta, tb));
  }
  if (t0 > t1) return 0;
  const tn = 1 - Math.min(0.93 / Math.max(Math.abs(cx), 1e-6), 2.35 / Math.max(Math.abs(cz), 1e-6));
  if (t1 >= tn - 0.03) return Infinity;
  const u = t1 / tn;
  return (h + 0.15 - 0.5 * u) / (1 - u);
}
/**
 * Wie sehr Fahrzeuge die Kamera bei Winkel a (Höhe y, Abstand r) in der Zeit tau0 … tau1 (s ab jetzt) stören, 0 … 1:
 * 1 = eines fährt unter oder dicht neben ihr durch (Lkw, Wohnmobil, Transporter; Autos, wenn sie nicht hoch genug
 * darüber ist) oder verdeckt einen großen Teil des Teslas. Über Autos dazwischen schaut sie hinweg, indem sie
 * etwas steigt (bis ORBIT.yLow); Späteres zählt etwas weniger.
 */
function orbitSight(p, a, y, r, tau0 = 0, tau1 = ORBIT.see) {
  const cx = clamp(p.x + Math.sin(a) * r, ORBIT.xMin, ORBIT.xMax) - p.x;
  const cz = Math.cos(a) * r;
  // nur Fahrzeuge zwischen Kamera und Tesla (seitlich) oder bei der Kamera zählen
  const sx0 = Math.min(cx, -1) - 1.5;
  const sx1 = Math.max(cx, 1) + 1.5;
  const pT = orbitLaneX(p);
  let worst = 0;
  for (const c of traffic.cars) {
    const xt = c.change ? ROAD.laneCenter(c.change.to) : c.x;
    const hw = c.w / 2 + 0.15;
    if (Math.max(c.x, xt) - Math.min(p.x, pT) + hw < sx0 || Math.min(c.x, xt) - Math.max(p.x, pT) - hw > sx1) continue;
    const z0 = p.s - c.s;
    const vz = p.speed - c.speed;
    const h = c.v.height;
    const tall = h > 2;
    const zStop = (c.len + p.len) / 2 + 0.4;
    // zwischen zwei Prüfzeitpunkten zurückgelegter Weg zählt mit (schnelle Autos im Abspann, Spurwechsel)
    const hl = c.len / 2 + Math.abs(vz) * ORBIT.seeStep * 0.5;
    const mx = c.change || pT !== p.x ? 0.5 : 0;
    for (let tau = tau0; tau <= tau1 + 1e-6; tau += ORBIT.seeStep) {
      const wgt = 1 - 0.35 * Math.min(1, tau / ORBIT.see);
      if (wgt <= worst) break;
      const xc = orbitRelX(c, p, pT, tau);
      const xa = xc - mx;
      const xb = xc + mx;
      // wer in der Spur des Teslas fährt, fährt nicht durch ihn hindurch: Er bremst dahinter (oder wechselt die Spur)
      const same = xa - hw < p.w / 2 && xb + hw > -p.w / 2;
      let zc = z0 + vz * tau;
      if (same) zc = z0 >= 0 ? Math.max(zc, zStop) : Math.min(zc, -zStop);
      let za = zc - hl;
      let zb = zc + hl;
      if (same) {
        if (z0 >= 0) za = Math.max(za, zStop - c.len / 2);
        else zb = Math.min(zb, c.len / 2 - zStop);
      }
      if (zb < -r - 2 || za > r + 2) continue;
      let k = 0;
      const ux = Math.max(0, xa - hw - cx, cx - xb - hw);
      const uz = Math.max(0, za - cz, cz - zb);
      if (uz < 1.2) {
        if (ux < (tall ? 1.4 : 0.9)) k = tall || y < h + ORBIT.clear + 0.3 ? 1 : 0.5;
        // auch nicht dicht neben einem Lkw (& Co.): seine Seitenwand füllte das halbe Bild
        else if (tall) k = 1 - smoothstep(1.4, 2.6, ux);
      }
      // über ein Auto dazwischen schaut sie hinweg, indem sie steigt (siehe orbitTarget) – außer es ginge zu hoch
      if (k < 1 && (tall || sightLift(cx, cz, xa - hw, xb + hw, za, zb, h) > ORBIT.yLow)) {
        let n = 0;
        for (const q of ORBIT_PTS) if (segHitsBox(cx, y, cz, q[0], q[1], q[2], xa - hw, xb + hw, h, za, zb)) n++;
        k = Math.max(k, Math.min(1, (n / ORBIT_PTS.length) * 1.6));
      }
      worst = Math.max(worst, k * wgt);
    }
    if (worst >= 1) break;
  }
  return worst;
}
/** Wohin der Tesla gerade quer fährt: im Titel auf die Spur, die der Autopilot gewählt hat */
function orbitLaneX(p) {
  return state === 'title' ? ROAD.laneCenter(ap.lane) : p.x;
}
/** Wo Fahrzeug c in tau Sekunden quer zum Tesla steht: Spurwechsel der anderen wie geplant, der Tesla fährt mit
 *  gut 4 m/s auf seine Spur pT (so schnell lenkt der Autopilot) */
function orbitRelX(c, p, pT, tau) {
  const ch = c.change;
  const x = ch ? lerp(ROAD.laneCenter(ch.from), ROAD.laneCenter(ch.to), smoothstep(0, 1, (ch.t + tau - ch.delay) / ch.dur)) : c.x;
  return x - p.x - clamp(pT - p.x, -4.3 * tau, 4.3 * tau);
}
function orbitCost(p, a, y, r) {
  return orbitAllowed(p, a, r) ? orbitSight(p, a, y, r) : 2;
}
/**
 * Nächster Winkel mit freier Sicht, von a aus in beide Richtungen gesucht – ohne über eine enge Seite zu springen.
 * Unterwegs zählt nur, was dort ist, wenn die Kamera vorbeikommt; am Ziel, was ab ihrer Ankunft kommt.
 */
function orbitEscape(p, a, y, r) {
  const step = 0.08;
  let best = null;
  let bestCost = Infinity;
  let least = a;
  let leastD = Infinity;
  // die eingeschlagene Richtung behält sie, solange die andere nicht deutlich besser ist (sonst pendelt die Wahl
  // hin und her und die Kamera bleibt stehen): Bonus in Sekunden, umso größer, je schneller sie schon schwenkt
  const moving = Math.abs(orbit.w) > 0.05;
  const keepDir = moving ? Math.sign(orbit.w) : orbit.esc !== null ? Math.sign(orbit.esc - a) : 0;
  const keep = 0.4 + 2.5 * Math.abs(orbit.w);
  for (const s of [1, -1]) {
    let path = 0;
    let wasOk = orbitAllowed(p, a, r);
    for (let k = 1; k <= 40; k++) {
      const th = a + s * k * step;
      const ok = orbitAllowed(p, th, r);
      if (!ok && wasOk) break;
      if (ok) wasOk = true;
      const at = orbitArrival(th - a);
      const d = ok ? orbitSight(p, th, y, r, at, at + ORBIT.hold) : 1;
      if (ok && d + at * 0.01 < leastD) {
        leastD = d + at * 0.01;
        least = th;
      }
      if (ok && d <= ORBIT.ok) {
        // etwas Abstand zur Grenze, wenn es dahinter auch noch frei ist
        const th2 = th + s * step;
        const more = orbitAllowed(p, th2, r) && orbitSight(p, th2, y, r, at, at + ORBIT.hold) <= ORBIT.ok;
        // Kosten in Sekunden: Ankunft (Umkehren kostet Bremsweg) und Störung unterwegs
        const c = at + path * 2.5 - (s === keepDir ? keep : 0);
        if (c < bestCost) {
          bestCost = c;
          best = more ? th + s * step * 0.5 : th;
        }
        break;
      }
      path = Math.max(path, ok ? Math.min(1, orbitSight(p, th, y, r, Math.max(0, at - 0.4), at + 0.4)) : 1);
    }
  }
  return best ?? least;
}
/** Wann die Kamera um den Winkel d weitergedreht ist (s): erst bremsen, falls sie gerade andersherum dreht */
function orbitArrival(d) {
  const back = orbit.w * d < 0 ? Math.abs(orbit.w) / ORBIT.acc : 0;
  return back + 0.25 + Math.abs(d) / ORBIT.wEsc;
}
/** Startwinkel: im Titel schräg hinten auf der Seite mit Platz, im Abspann hinter dem stehenden Auto (rückt dort
 *  gerade einer auf oder fährt einer vorbei, davor oder schräg daneben) – jeweils mit freier Sicht. */
function orbitStart(p, y, r) {
  const title = state === 'title' || state === 'loading'; // boot() setzt die Kamera schon vor dem Titel
  const first = title ? (orbitBlocked(p, 1, r) ? -0.9 : 0.9) : 0;
  const cands = [first, 0, Math.PI, 0.35, -0.35, Math.PI - 0.35, Math.PI + 0.35, 0.9, -0.9, Math.PI - 0.9, Math.PI + 0.9, 1.57, -1.57];
  let best = first;
  let bestC = Infinity;
  cands.forEach((a, i) => {
    const c = orbitCost(p, a, y, r) + i * 0.004;
    if (c < bestC) {
      bestC = c;
      best = a;
    }
  });
  orbit.a = best;
  orbit.w = 0;
  orbit.esc = null;
  // weiter in Richtung der Seite mit mehr Platz
  const side = orbitRoom(p, 1) >= orbitRoom(p, -1) ? 1 : -1;
  orbit.dir = title ? 1 : side * (Math.cos(best) >= 0 ? 1 : -1);
}
function orbitTarget(p, dt) {
  const r = ORBIT.r * orbit.zoom;
  const y0 = 2.4 + Math.sin(stateT * 0.3) * 0.6;
  if (!drone.init) orbitStart(p, y0, r);
  else {
    const cost = (a) => orbitCost(p, a, y0, r);
    let want;
    const here = cost(orbit.a);
    if (here > ORBIT.bad || (orbit.esc !== null && here > ORBIT.ok)) {
      // ausweichen: zum nächsten Winkel mit freier Sicht – alle 0,3 s neu geplant (es kommen Fahrzeuge dazu),
      // sofort, wenn es am Ziel bis zur Ankunft selbst eng wird
      orbit.plan -= dt;
      let stale = orbit.esc === null || orbit.plan <= 0;
      if (!stale) {
        const at = orbitArrival(orbit.esc - orbit.a);
        stale = !orbitAllowed(p, orbit.esc, r) || orbitSight(p, orbit.esc, y0, r, at, at + ORBIT.hold) > ORBIT.bad;
      }
      if (stale) {
        orbit.esc = orbitEscape(p, orbit.a, y0, r);
        orbit.plan = 0.3;
      }
      const d = orbit.esc - orbit.a;
      want = Math.sign(d) * Math.min(ORBIT.wEsc, Math.abs(d) * 2.5);
      if (Math.abs(d) > 0.02) orbit.dir = Math.sign(d);
    } else {
      orbit.esc = null;
      want = orbit.dir * ORBIT_SPEED;
      if (cost(orbit.a + orbit.dir * ORBIT.ahead) > ORBIT.bad) {
        // vorne wird es eng (Fahrzeug oder enge Seite): umkehren, wenn es zurück frei ist, sonst hier warten
        if (cost(orbit.a - orbit.dir * ORBIT.ahead) <= ORBIT.ok) {
          orbit.dir = -orbit.dir;
          want = orbit.dir * ORBIT_SPEED;
        } else want = 0;
      }
    }
    orbit.w += clamp(want - orbit.w, -ORBIT.acc * dt, ORBIT.acc * dt);
    orbit.a += orbit.w * dt;
    if (Math.abs(orbit.a) > Math.PI) {
      const turn = Math.sign(orbit.a) * 2 * Math.PI;
      orbit.a -= turn;
      if (orbit.esc !== null) orbit.esc -= turn;
    }
  }
  const a = orbit.a;
  // relativ zur Fahrbahn, nicht zur Fahrzeuglängsachse: beim Spurwechsel dreht sich der Wagen, nicht das ganze Bild
  const t = orbitPos.set(p.x + Math.sin(a) * r, y0, Math.cos(a) * r);
  // seitlich begrenzt (falls das Auto mitten im Bogen die Spur wechselt): dort wird der Bogen flacher und etwas höher
  const over = Math.max(t.x - ORBIT.xMax, ORBIT.xMin - t.x, 0);
  t.x = clamp(t.x, ORBIT.xMin, ORBIT.xMax);
  t.y += over * 0.3;
  const base = t.y;
  const pT = orbitLaneX(p);
  for (const c of traffic.cars) {
    const zc = p.s - c.s;
    const h = c.v.height;
    // über Autos zwischen Kamera und Tesla schaut sie hinweg: steigt, bevor sie dazwischen sind
    if (h <= 2) {
      const vz = p.speed - c.speed;
      let lift = 0;
      for (let tau = 0; tau <= 2; tau += 0.4) {
        const z = zc + vz * tau;
        const x = orbitRelX(c, p, pT, tau);
        const need = sightLift(t.x - p.x, t.z, x - c.w / 2 - 0.15, x + c.w / 2 + 0.15, z - c.len / 2, z + c.len / 2, h);
        if (need > 0 && need <= ORBIT.yLow) lift = Math.max(lift, lerp(base, need, 1 - tau / 2.6));
      }
      t.y = Math.max(t.y, lift);
    }
    const need = h + ORBIT.clear;
    if (need <= base) continue;
    // Abstand zum Grundriss (mit Rand) – räumlich und, bei schnellen Autos, zeitlich: Die Kamera steigt
    // etwa 1,4 s bevor eines ankommt und sinkt erst danach wieder, gleich wie schnell es ist (im Abspann
    // steht der Tesla, dann rauscht der Verkehr mit voller Fahrt vorbei)
    const dz = Math.max(0, zc - c.len / 2 - ORBIT.margin - t.z, t.z - (zc + c.len / 2 + ORBIT.margin));
    const dx = Math.max(0, Math.abs(t.x - c.x) - c.w / 2 - ORBIT.margin);
    const near = 1 - smoothstep(0, ORBIT.blend, dx);
    const soon = 1 - smoothstep(0.3, ORBIT.lead, dz / Math.max(1e-3, Math.abs(p.speed - c.speed)));
    const k = Math.max(1 - smoothstep(0, ORBIT.blend, Math.hypot(dx, dz)), near * soon);
    if (k > 0) t.y = Math.max(t.y, lerp(base, need, k));
  }
  // nie steiler als 30° auf den Wagen hinunter (auch nicht, wenn sie seitlich begrenzt näher heranrückt)
  t.y = Math.min(t.y, ORBIT.yMax, 0.9 + Math.hypot(t.x - p.x, t.z) * 0.58);
  return t;
}

/** Notbremse nach dem Glätten: nie in einem Fahrzeug (falls die Vorausschau einmal nicht reicht). */
function liftOverVehicles(pos, p) {
  for (const c of traffic.cars) {
    if (Math.abs(pos.x - c.x) < c.w / 2 + 0.35 && Math.abs(pos.z - (p.s - c.s)) < c.len / 2 + 0.35) {
      pos.y = Math.max(pos.y, Math.min(c.v.height + 0.35, ORBIT.yMax));
    }
  }
}

function placeDrone(dt, mode) {
  const p = game.player;
  let pos;
  let look;
  if (mode === 'orbit') {
    pos = orbitTarget(p, dt);
    look = new THREE.Vector3(0, 0.9, 0).applyMatrix4(carMatrix);
  } else {
    pos = new THREE.Vector3(-p.vx * 0.25, 3.3, 9.2).applyMatrix4(carMatrix);
    look = new THREE.Vector3(0, 1.0, -14).applyMatrix4(carMatrix);
  }
  const k = 1 - Math.exp(-dt * (mode === 'orbit' ? 3 : 6));
  if (mode === 'orbit') {
    // geglättet um das Auto herum (Winkel, Abstand, Höhe): wechselt es die Spur, fährt die Kamera mit, statt
    // hinterherzuschwenken, und ihr Blick dreht sich nie schneller als ORBIT.wMax. Muss sie an der Seite stehen
    // bleiben, rückt sie auf ihrer Blicklinie näher heran, statt herumzuwirbeln.
    const relX = pos.x - p.x;
    const phi = Math.atan2(relX, pos.z);
    const dist = Math.hypot(relX, pos.z);
    if (!drone.init) {
      orbit.phi = phi;
      orbit.dist = dist;
    }
    let dPhi = phi - orbit.phi;
    dPhi -= Math.round(dPhi / (2 * Math.PI)) * 2 * Math.PI;
    orbit.phi += clamp(dPhi * k, -ORBIT.wMax * dt, ORBIT.wMax * dt);
    orbit.dist += (dist - orbit.dist) * k;
    let x = p.x + Math.sin(orbit.phi) * orbit.dist;
    let z = Math.cos(orbit.phi) * orbit.dist;
    if (x < ORBIT.xMin || x > ORBIT.xMax) {
      const xl = clamp(x, ORBIT.xMin, ORBIT.xMax);
      z *= (xl - p.x) / (x - p.x);
      x = xl;
    }
    // hoch geht es zügig, herunter gemächlich (sonst hüpft die Kamera bei jedem Lkw)
    const y0 = drone.init ? drone.pos.y : pos.y;
    const vy = clamp((pos.y - y0) * (pos.y > y0 ? 4 : 1.5), -ORBIT.vyMax, ORBIT.vyMax);
    drone.pos.set(x, y0 + vy * dt, z);
    liftOverVehicles(drone.pos, p);
    drone.look.copy(look);
    drone.init = true;
  } else {
    if (!drone.init) {
      drone.pos.copy(pos);
      drone.look.copy(look);
      drone.init = true;
    }
    drone.pos.lerp(pos, k);
    drone.look.lerp(look, k);
  }
  camera.position.copy(drone.pos);
  if (cockpit.shake > 0) camera.position.y += Math.sin(stateT * 60) * cockpit.shake * 0.08;
  camera.lookAt(drone.look);
  setFov(50);
  if (mode === 'orbit') titleViewOffset(dt);
  else viewOff.x = viewOff.y = 0;
}

// Kameraschwenk beim Start: von vorne links an Mini Adam vorbei ins Cockpit
const INTRO = [
  { t: 0.0, pos: [-6.2, 2.4, -9.5], look: [-0.25, 0.95, 0.0] },
  { t: 2.4, pos: [-2.7, 1.55, -3.4], look: [-0.37, 1.12, 0.22] },
  { t: 4.6, pos: [-1.72, 1.26, 0.2], look: [-0.37, 1.16, 0.28] },
];
const INTRO_SWITCH = 4.85;
const INTRO_END = 6.3;
function lerpKeys(t) {
  let a = INTRO[0];
  let b = INTRO[INTRO.length - 1];
  for (let i = 0; i < INTRO.length - 1; i++) {
    if (t >= INTRO[i].t && t <= INTRO[i + 1].t) {
      a = INTRO[i];
      b = INTRO[i + 1];
      break;
    }
  }
  if (t > b.t) return { pos: new THREE.Vector3(...b.pos), look: new THREE.Vector3(...b.look) };
  const k = easeInOut(clamp((t - a.t) / (b.t - a.t), 0, 1));
  return {
    pos: new THREE.Vector3().fromArray(a.pos).lerp(new THREE.Vector3().fromArray(b.pos), k),
    look: new THREE.Vector3().fromArray(a.look).lerp(new THREE.Vector3().fromArray(b.look), k),
  };
}

function placeIntro(dt) {
  const t = stateT;
  if (t < INTRO_SWITCH) {
    const { pos, look } = lerpKeys(t);
    pos.applyMatrix4(carMatrix);
    look.applyMatrix4(carMatrix);
    camera.position.copy(pos);
    camera.lookAt(look);
    setFov(44);
    return 'outside';
  }
  // im Cockpit: Kopf dreht vom Seitenfenster nach vorne
  cockpit.placeCamera(camera, carMatrix, t, game.player.speed, 0, dt);
  const k = easeInOut(clamp((t - INTRO_SWITCH) / (INTRO_END - INTRO_SWITCH), 0, 1));
  camera.rotateOnWorldAxis(tmpV2.set(0, 1, 0), (1 - k) * 1.05);
  setFov(58);
  return 'inside';
}

// --- Fenstergröße & Auflösung -----------------------------------------------------
function onResize() {
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  drawSize();
  worldRT.setSize(size.x, size.y);
  U.uTexel.value.set(1 / size.x, 1 / size.y);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  cockpit.setAspect(camera.aspect);
  rain.setPixelScale(size.y);
}
window.addEventListener('resize', onResize);
onResize();

const perf = { acc: 0, n: 0, cool: 3 };
function adaptResolution(dt) {
  if (!quality.auto || state === 'loading') return;
  perf.acc += dt;
  perf.n++;
  perf.cool -= dt;
  if (perf.n < 40) return;
  const avg = perf.acc / perf.n;
  perf.acc = 0;
  perf.n = 0;
  if (perf.cool > 0) return;
  const maxPR = Math.min(window.devicePixelRatio || 1, 1.5);
  if (avg > 1 / 45 && pixelRatio > 0.55) {
    pixelRatio = Math.max(0.55, pixelRatio - 0.12);
    perf.cool = 1.5;
    onResize();
  } else if (avg < 1 / 75 && pixelRatio < maxPR) {
    pixelRatio = Math.min(maxPR, pixelRatio + 0.06);
    perf.cool = 3;
    onResize();
  }
}

// --- Rendern --------------------------------------------------------------------------
let frameNo = 0;
function renderWorld(cam, { cockpitOn, drops }) {
  tesla.root.visible = !cockpitOn;
  renderer.shadowMap.needsUpdate = quality.shadows;
  renderer.setRenderTarget(worldRT);
  renderer.render(scene, cam);
  renderer.setRenderTarget(null);
  U.uDrops.value = drops ? 1 : 0;
  // mit Cockpit kommen Blitz, Vignette & Co. erst danach über das ganze Bild (postPass)
  U.uPost.value = cockpitOn ? 0 : 1;
  renderer.render(compScene, compCam);
}

function renderFrame(cockpitOn) {
  frameNo++;
  // Während der Kofferraum-Einlage zeigt nur der Innenspiegel das Bild, der Außenspiegel läuft weiter
  if (cockpitOn && frameNo % quality.mirrorEvery === 0) {
    // Rückspiegel: Blick nach hinten
    rearCam.position.copy(localToWorld(tmpV2.set(0, 1.32, 0.9)));
    rearCam.lookAt(localToWorld(tmpV2.set(0, 1.05, 40)));
    tesla.root.visible = false;
    renderer.setRenderTarget(mirrorRT);
    renderer.render(scene, rearCam);
  }
  if (photoRequest) {
    takePhoto(photoRequest);
    photoRequest = null;
  }
  renderWorld(camera, { cockpitOn, drops: cockpitOn });
  if (cockpitOn) {
    cockpitCam.position.copy(camera.position);
    cockpitCam.quaternion.copy(camera.quaternion);
    cockpitCam.fov = camera.fov;
    cockpitCam.aspect = camera.aspect;
    cockpitCam.updateProjectionMatrix();
    renderer.autoClear = false;
    renderer.clearDepth();
    renderer.render(cockpit.scene, cockpitCam);
    postPass();
    renderer.autoClear = true;
  }
}

/** Effekte über Welt und Cockpit zusammen (siehe postMat). */
function postPass() {
  const copy = U.uGreen.value > 0.001 || U.uGlitch.value > 0.001;
  if (copy) {
    renderer.getDrawingBufferSize(screenSize);
    if (!screenTex || screenTex.image.width !== screenSize.x || screenTex.image.height !== screenSize.y) {
      if (screenTex) screenTex.dispose();
      screenTex = new THREE.FramebufferTexture(screenSize.x, screenSize.y);
      postMat.uniforms.tScreen.value = screenTex;
    }
    renderer.copyFramebufferToTexture(screenTex);
  }
  postMat.uniforms.uCopy.value = copy ? 1 : 0;
  renderer.render(postScene, compCam);
}

/** Blitzerfoto: der Tesla von vorne, Mini Adam hinterm Steuer, im Blitzlicht. */
function takePhoto({ kmh, clock }) {
  // immer 4:3 (wie das Polaroid), auch auf dem Handy hochkant: das Bild wird dafür verzerrt gerendert
  // und beim Kopieren ins 4:3-Foto wieder entzerrt
  photoCam.aspect = 4 / 3;
  photoCam.updateProjectionMatrix();
  photoCam.position.copy(localToWorld(tmpV2.set(2.6, 1.55, -10.5)));
  photoCam.lookAt(localToWorld(tmpV2.set(-0.3, 1.05, -0.3)));
  const light = tesla.cabinLight.intensity;
  tesla.cabinLight.intensity = 5;
  // nur ein Hauch Blitz über dem ganzen Bild (mehr macht das Foto grau und flau)
  const fl = U.uFlash.value;
  U.uFlash.value = 0.01;
  renderWorld(photoCam, { cockpitOn: false, drops: false });
  U.uFlash.value = fl;
  tesla.cabinLight.intensity = light;
  photoCtx.drawImage(renderer.domElement, 0, 0, renderer.domElement.width, renderer.domElement.height, 0, 0, 360, 270);
  // Datenzeile wie bei echten Blitzern
  photoCtx.fillStyle = 'rgba(0,0,0,0.55)';
  photoCtx.fillRect(0, 238, 360, 32);
  photoCtx.fillStyle = '#ffd21f';
  photoCtx.font = 'bold 17px "Courier New", monospace';
  photoCtx.textAlign = 'left';
  photoCtx.fillText(`${kmh} km/h   ${clock}   ERLAUBT 120`, 10, 260);
  let url = null;
  try {
    url = photoCanvas.toDataURL('image/jpeg', 0.82);
  } catch (e) {
    url = null;
  }
  ui.photo(url, kmh, clock);
}

// --- Hauptschleife ----------------------------------------------------------------------
let last = performance.now();
let simT = 0;
const menuPad = { prev: {} };

/** Gamepad im Menü. Die Kanten werden in jedem Bild verfolgt, ausgelöst wird nur bei offenem Menü
 * (sonst schließt der Start-Knopf, der gerade pausiert hat, das Pausenmenü im nächsten Bild wieder). */
function pollMenuPad(active) {
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  for (const pd of pads) {
    if (!pd) continue;
    const b = (i) => !!pd.buttons[i]?.pressed;
    const ay = pd.axes[1] || 0;
    const now = { up: b(12) || ay < -0.6, down: b(13) || ay > 0.6, a: b(0), b: b(1), start: b(9) };
    const edge = (k) => now[k] && !menuPad.prev[k];
    let dir = 0;
    if (edge('up')) dir = -1;
    if (edge('down')) dir = 1;
    if (active && (dir || edge('a') || edge('b') || edge('start'))) {
      menus.pad(dir, edge('a') || (edge('start') && menus.current !== 'pause'), edge('b') || (edge('start') && menus.current === 'pause'));
    }
    menuPad.prev = now;
    return;
  }
}

function frame(now) {
  requestAnimationFrame(frame);
  let dt = (now - last) / 1000;
  last = now;
  if (DEBUG && window.__MA && window.__MA.frozen) return;
  if (!(dt > 0)) dt = 1 / 60;
  dt = Math.min(dt, 1 / 20);
  step(dt);
  adaptResolution(dt);
}

function step(dt, { render = true } = {}) {
  simT += dt;
  stateT += dt;
  input.poll();
  pollMenuPad(menus.open);
  const p = game.player;
  let ctl = null;
  let cockpitOn = false;
  let adamWave = 0;
  let adamLook = 0;

  if (input.take('mute')) {
    settings.sound = !settings.sound;
    applySettings('sound');
    storeSave(save);
    ui.toast(settings.sound ? '🔊 Ton an' : '🔇 Ton aus', 'info');
    menus.refresh('settings');
  }
  if (input.take('chat')) {
    settings.chat = !settings.chat;
    applySettings('chat');
    storeSave(save);
    menus.refresh('settings');
  }

  switch (state) {
    case 'title': {
      ctl = autopilot(dt, 118);
      game.demo(dt, ctl);
      updateCarMatrix();
      placeDrone(dt, 'orbit');
      adamWave = smoothstep(0.72, 0.9, Math.sin(simT * 0.5));
      adamLook = Math.sin(simT * 0.4) * 0.6;
      break;
    }
    case 'intro': {
      if (stateT > 0.3 && (input.anyKey || input.take('confirm'))) introSkip = true;
      if (introSkip && stateT < INTRO_SWITCH - 0.25) stateT = INTRO_SWITCH - 0.25;
      ctl = autopilot(dt, 100, false);
      ap.lane = 3;
      game.update(dt, ctl, camera);
      updateCarMatrix();
      const where = placeIntro(dt);
      cockpitOn = where === 'inside';
      // winkt, solange die Kamera schräg von vorne kommt; am Seitenfenster sind die Hände wieder am Lenkrad
      adamWave = smoothstep(1.0, 1.8, stateT) * (1 - smoothstep(3.4, 4.0, stateT));
      adamLook = smoothstep(1.0, 2.6, stateT) * 1.0;
      // Überblendung ins Cockpit
      const tf = stateT;
      fxState.fade = tf < 0.6 ? 1 - tf / 0.6 : tf > INTRO_SWITCH - 0.25 && tf < INTRO_SWITCH ? (tf - (INTRO_SWITCH - 0.25)) / 0.25 : tf >= INTRO_SWITCH && tf < INTRO_SWITCH + 0.35 ? 1 - (tf - INTRO_SWITCH) / 0.35 : 0;
      if (!game._greeted && tf >= INTRO_SWITCH) {
        game._greeted = true;
        audio.whoosh();
        game.say('Hallo Mini Adam! Der Stream läuft. Gute Fahrt!', 'happy');
      }
      if (tf > 0.4 && !game._introChime) {
        game._introChime = true;
        audio.nomiChime();
      }
      if (stateT >= INTRO_END) {
        state = 'drive';
        stateT = 0;
        ui.show(true);
        ui.toast(matchMedia('(pointer: coarse)').matches ? 'Tipp: ◀ ▶ lenken · Strom und Bremse rechts · 🎥 Kamera' : 'Tipp: ← → lenken · ↑ Strom · ↓ Bremse · V Kamera', 'info');
      }
      break;
    }
    case 'drive': {
      if (paused) {
        updateCarMatrix();
        if (view === 'cockpit') cockpit.placeCamera(camera, carMatrix, simT, 0, 0, 0);
        cockpitOn = view === 'cockpit';
        break;
      }
      if (input.take('pause')) {
        pause();
        break;
      }
      if (input.take('camera')) {
        view = view === 'cockpit' ? 'drone' : 'cockpit';
        drone.init = false;
        ui.cameraLabel(view === 'cockpit' ? '🎥 Cockpit' : '🎥 Drohne');
      }
      ctl = {
        steer: input.steer,
        throttle: input.throttle,
        brake: input.brake,
        horn: input.take('horn'),
        wiper: input.take('wiper'),
        megafon: input.take('megafon'),
        device: input.lastDevice,
      };
      game.update(dt, ctl, camera);
      updateCarMatrix();
      if (view === 'cockpit') {
        cockpit.placeCamera(camera, carMatrix, simT, p.speed, p.latAcc, dt);
        setFov(58);
        cockpitOn = true;
      } else placeDrone(dt, 'follow');
      if (game.over) {
        state = 'ending';
        stateT = 0;
        drone.init = false;
        finishRun();
      }
      break;
    }
    case 'ending':
    case 'over': {
      const stop = { steer: 0, throttle: 0, brake: 0.5, horn: false, wiper: false, megafon: false };
      p.update(dt, stop, { wet: game.weather.level });
      traffic.update(dt, simT, p, { difficulty: 0.2, leftOpen: false, rain: game.weather.level });
      // Sammelsachen bleiben an ihrem Platz auf der Straße (eingesammelt wird nichts mehr)
      pickups.update(dt, simT, p, camera, false);
      updateCarMatrix();
      placeDrone(dt, 'orbit');
      adamWave = smoothstep(0.9, 1.5, stateT);
      adamLook = Math.sin(stateT * 0.5) * 0.8;
      if (state === 'ending' && stateT > 2.6) {
        state = 'over';
        ui.show(false);
        menus.show('over', lastOver);
      }
      break;
    }
    default:
      break;
  }

  // --- Welt aktualisieren -------------------------------------------------------
  const s = p.s;
  const w = game.weather ? game.weather.level : 0;
  const frozen = paused;
  if (!frozen) {
    const cu = curveUniforms.uCurve.value;
    cu.x = 0.000125 * (0.62 * Math.sin(s / 1900 + 1.3) + 0.38 * Math.sin(s / 740 + 0.4));
    cu.y = 0.000045 * Math.sin(s / 1300 + 2.1) * (0.5 + 0.5 * Math.sin(s / 3100));
    const L = game.left || { glow: 0 };
    road.update(s, dt, simT, L.glow || 0, L.open && L.timer < 10 ? 1 : 0);
    road.setWet(w);
    scenery.update(s, dt);
    sky.setOvercast(w * 0.95);
    rain.update(dt, simT, { speed: p.speed, s, camX: camera.position.x, intensity: w });
    tesla.update(dt, p.speed, p.steer, simT);
    tesla.setBrake(p.braking > 0.1 || p.speed < 1);
    tesla.adam.animate(simT, { steer: p.steer, wave: adamWave, look: adamLook });
    tesla.cabinLight.intensity = cockpitOn ? 0 : state === 'title' || state === 'intro' || state === 'ending' || state === 'over' ? 3.2 : 0.9;
    tesla.setGroundShade(w);
    windshield.update(dt, { speed: p.speed, camera, carMatrix });
    cockpit.update({
      dt, t: simT, steer: p.steer, latAcc: p.latAcc, wiperAngles: windshield.angles, sunDir: sky.sunDir, overcast: w,
      screen: game.screenState ? safeScreen() : null,
    });
    if (fxState.trunk > 0) {
      fxState.trunk -= dt;
      if (fxState.trunk <= 0) cockpit.setMirrorTexture(mirrorRT.texture);
    }
  }
  sky.update(frozen ? 0 : dt, camera, s, simT);
  audio.update(dt, {
    speed: p.speed, throttle: p.throttle, rain: w, sirenLevel: game.sirenLevel || 0, inCabin: cockpitOn, paused: frozen || state === 'over',
  });

  // Effekte
  cockpit.shake = Math.max(0, cockpit.shake - dt * 1.6);
  fxState.flash = Math.max(0, fxState.flash - dt * 3.5);
  fxState.glitch = Math.max(0, fxState.glitch - dt);
  fxState.green = Math.max(0, fxState.green - dt);
  U.uTime.value = simT;
  U.uRain.value = w;
  U.uFlash.value = fxState.flash;
  U.uGlitch.value = fxState.glitch > 0 ? 0.6 + 0.4 * Math.sin(simT * 40) : 0;
  U.uGreen.value = fxState.green > 0 ? (Math.sin(simT * 26) > 0.2 ? 1 : 0.15) : 0;
  U.uFade.value = state === 'intro' ? clamp(fxState.fade, 0, 1) : 0;
  U.uSat.value = 1.08 - w * 0.25;

  if (DEBUG && window.__MA && window.__MA.camHook) window.__MA.camHook(camera, carMatrix);
  document.body.classList.toggle('playing', state === 'drive' && !paused);
  document.body.classList.toggle('drone', view === 'drone');
  if (render) renderFrame(cockpitOn);
  // in der Pause bleiben Banner, Geld-Anzeigen und Funkloch stehen
  ui.update(paused ? 0 : dt, state === 'drive' || state === 'intro' ? game : null);
  input.endFrame();
}

function safeScreen() {
  try {
    return game.running || game.over ? game.screenState() : demoScreen();
  } catch (e) {
    return demoScreen();
  }
}

function demoScreen() {
  const p = game.player;
  return {
    dark: false, battery: 100, speedKmh: p.kmh, limit: null, playerX: p.x, leftLane: 0, cars: traffic.nearby(p, 125), s: p.s,
    navi: game.navi.screen(p.s, 18 * 60, p.speed), clock: '18:00', temp: 17, funkloch: 0, wiperOn: false,
  };
}

// --- Start ---------------------------------------------------------------------------------
window.addEventListener('pointerdown', () => audio.init());
window.addEventListener('keydown', () => audio.init());
document.addEventListener('visibilitychange', () => {
  // im Hintergrund läuft requestAnimationFrame nicht, also den Ton direkt anhalten
  if (document.hidden) {
    pause();
    audio.suspend();
  } else audio.resume();
});

function boot() {
  applyCosmetics();
  game.startDemo();
  // Ein paar Bilder vorab rendern (Shader kompilieren), dann Titel zeigen
  updateCarMatrix();
  placeDrone(0.016, 'orbit');
  try {
    renderer.compile(scene, camera);
    renderer.compile(cockpit.scene, camera);
  } catch (e) {
    /* egal */
  }
  state = 'title';
  menus.show('title', save);
  loadingEl.classList.add('done');
  setTimeout(() => loadingEl.remove(), 800);
  requestAnimationFrame((t) => {
    last = t;
    frame(t);
  });
}

// Debug-Schnittstelle für Tests (?debug)
if (DEBUG) {
  window.__MA = {
    game, traffic, scenery, cockpit, windshield, tesla, ui, menus, input, renderer, camera, save,
    get state() {
      return state;
    },
    set view(v) {
      view = v;
    },
    start: () => startRun(),
    skipIntro: () => {
      stateT = INTRO_END;
    },
    step: (seconds, dt = 1 / 30) => {
      const n = Math.round(seconds / dt);
      for (let i = 0; i < n; i++) step(dt, { render: i === n - 1 });
    },
    setState: (s, t = 0) => {
      state = s;
      stateT = t;
    },
    rain: (v) => {
      game.weather.active = v > 0;
      game.weather.target = v;
      game.weather.level = v;
      game.weather.dur = 999;
      windshield.setRain(v);
    },
    pause: () => pause(),
    resume: () => resume(),
  };
}

boot();
