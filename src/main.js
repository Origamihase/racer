// Mini Adam – Navi ferngesteuert BrunnenTV XXL
// Hauptprogramm: Renderer, Bildkomposition (Welt → Regentropfen/Effekte → Cockpit), Kameras
// (Cockpit, Drohne, Szenen), Zustände und Menüs.
import * as THREE from 'three';
import { W, curveTable, curveAt, curveOffset } from './curve.js';
import { Course, MapPlanner, PROBE_MARKS } from './game/course.js';
import * as mapGraph from './map/graph.js';
import * as mapShapes from './map/shapes.js';
import { setMaxAnisotropy, ROAD } from './textures.js';
import { Road } from './world/road.js';
import { XxlWorld, ROAD_OPTS, autoTarget, autoDrive, AUTO } from './world/xxl/world.js';
import { installDebug } from './world/xxl/debug.js';
import { Sky } from './world/sky.js';
import { Scenery } from './world/scenery.js';
import { CurveSigns, gridBusy, profileLayout } from './world/kit/curvesigns.js';
import { createNatureKit } from './world/kit/nature.js';
import { cityKit, naviLayout } from './world/xxl/towns.js';
import { SCENE, ROLL_T, STOP, DOCK, CHARGE, rollPose, groundAt, chargeOf } from './world/xxl/charge.js';
import { buildPopping, POPPING_AT, POPPING_YAW, windowAim } from './world/xxl/popping.js';
import { TV, tvShots, shotPose, dollyFor, shotAt, windowAt, megaphoneAt, lookAt as tvLookAt, stillShot, STILL } from './world/xxl/brunnentv.js';
import { buildHandMegaphone } from './models/megaphone.js';
import { Traffic } from './world/traffic.js';
import { prewarmVehicles } from './models/vehicles.js';
import { buildTesla } from './models/tesla.js';
import { Cockpit, EYE } from './cockpit/cockpit.js';
import { Facecam } from './cockpit/facecam.js';
import { Windshield, createCompositeMaterial } from './fx/windshield.js';
import { Rain } from './fx/rain.js';
import { Audio } from './audio.js';
import { Speech } from './speech.js';
import { Input } from './input.js';
import { TouchControls, TOUCH_BUTTONS } from './ui/touch.js';
import { driveSettings, playerOptions, IS_TOUCH } from './ui/drive-settings.js';
import { showDriveHint, driveHintTick, driveHintBusy, showTip } from './ui/drive-hint.js';
import { FirstTips, loadTips, storeTips } from './ui/first-tips.js';
import { Jolt } from './fx/jolt.js';
import { TeslaDamage } from './models/damage-fx.js';
import { CabinDamage } from './cockpit/damage-cabin.js';
import { loadSave, storeSave, resetSave, refundMegafon, megafonNoteSeen, storePicture, loadPictures, PIC_MAX } from './save.js';
import { Game } from './game/game.js';
import { Chassis, CHASSIS } from './game/chassis.js';
import { Pickups } from './game/pickups.js';
import { UI } from './ui/ui.js';
import * as sicht from './ui/sicht.js';
import { Menus } from './ui/menus.js';
import { bindFullscreenKey } from './ui/fullscreen.js';
import { SHOP, UPGRADE_LIMITS, PARTYPEOPLE } from './data.js';
import { NavModel } from './map/navroute.js';
import { setRoadAhead, setTownLayout } from './map/roadahead.js';
import { recordVisit } from './ui/mapscreen.js';
import { albumBadges } from './ui/album.js';
import { thinLine } from './ui/routemap.js';
import { clamp, lerp, damp, easeInOut, smoothstep } from './util.js';

const QUALITY = {
  hoch: { pr: 1.5, msaa: 4, shadows: true, shadowSize: 2048, mirrorEvery: 1 },
  mittel: { pr: 1.0, msaa: 4, shadows: true, shadowSize: 1024, mirrorEvery: 2 },
  niedrig: { pr: 0.75, msaa: 0, shadows: false, shadowSize: 1024, mirrorEvery: 3 },
};
const DEBUG = /[?&]debug/.test(location.search);
const save = loadSave();
// Das Megafon gehört jetzt zur Ausstattung: Wer es gekauft hatte, bekommt den Preis einmal zurück (save.js); der Titel
// sagt es bis zum ersten Besuch im Shop (save.megafonNote), der Shop dann in dieser Sitzung (shopRefund)
const megafonBack = refundMegafon(save);
if (megafonBack) storeSave(save);
let shopRefund = 0;
let mapHudT = 0; // die Navi-Zeile des HUD folgt der Fahrt viermal je Sekunde
let turnIns = null; // ihre letzte Ansage (NavModel.instruction), auch für die Tipps der ersten Minuten

// ---------------------------------------------------------------------------
const app = document.getElementById('app');
const loadingEl = document.getElementById('loading');
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
const road = new Road(scene, ROAD_OPTS);
const scenery = new Scenery(scene);
// die Welt der Reise (src/world/xxl): Autobahnen, Ausfahrten, Rampen, Landstraßen und Orte aus der echten Karte
const xxl = new XxlWorld({ scene, road, scenery });
// die große Karte der Reise zeigt die BrunnenTV-Folgen des Albums als Abzeichen (goldene Ringe, Zähler)
albumBadges(save);
const rain = new Rain(scene);
const traffic = new Traffic(scene, rain);
const pickups = new Pickups(scene);
prewarmVehicles();
const tesla = buildTesla();
// Schaden außen: Dellen, Schrammen, Pflaster, Leuchten, Dampf (baut nur neu, wenn sich der Schaden ändert)
const teslaDamage = new TeslaDamage(tesla.damageHooks);
scene.add(tesla.root);
const cockpit = new Cockpit();
// letzter Karosserie-Punkt vom Fahrerplatz aus: Haube springt vorn auf und zittert, Dampf, ab und zu ein Ruckeln
const cabinDamage = new CabinDamage(cockpit, tesla.damageHooks);
// Facecam (unten links in der Cockpit-Ansicht): eigenes kleines Studio mit eigenem Mini Adam am gleichen Lenkrad
const facecam = new Facecam();
facecam.setWheel(tesla.adam.wheel.m, tesla.adam.wheel.r);
cockpit.scene.environment = sky.envTarget.texture;
sky.onEnv = (tex) => {
  cockpit.scene.environment = tex;
  facecam.scene.environment = tex;
};
// Verlauf der Straße: Die Welt entwirft ihn aus der Karte (MapPlanner) für die Abschnitte ihrer Fahrt (courseTrip =
// xxl.trip, siehe xxlStart): Autobahn, Landstraße und Ortszufahrt biegen und steigen, wie die Karte sie zeigt; rund um
// Ausfahrten, Einfädelpunkte und Enden bleibt es gerade.
// Prüfstand: __MA.course.drive(kurs, fahrt, tick) fährt einen Kurs über eine Fahrt (trip.js), tick(s) vor jedem Bild
let course = new Course({ planner: new MapPlanner({ graph: mapGraph, shapes: mapShapes }) });
let courseTrip = null;
let courseTick = null;
// die Straße voraus des Navis: der Verlauf, den die Welt zeichnet (preview reicht 4 km weit)
setRoadAhead((trip, s, dMax) => course.preview(trip, s, Math.min(dMax, 4000)));
// und die Orte der Welt in seiner Nahansicht: Brunnenplatz und Zielbrunnen dort, wo die Welt sie baut
setTownLayout((trip, sec) => naviLayout(sec, xxl.town(sec)));
// Kurvenschilder rücken von Möbeln am Rand weg: vom Raster der Landschaft und von Blitzern, Tempo-Schildern und
// Elsa, die das Spiel dort bestellt hat
const EDGE_REQUESTS = new Set(['blitzer', 'speed', 'elsa']);
const curveSigns = new CurveSigns(scene, {
  // am Rand des Querschnitts, den der Abschnitt hat (zweispurige Straßen sind schmaler als die Autobahn)
  layout: profileLayout,
  busy(s) {
    if (gridBusy(s)) return true;
    for (const r of scenery.requests) if (EDGE_REQUESTS.has(r.type) && Math.abs(r.s - s) < 8) return true;
    return false;
  },
  // jede neue Bestellung kommt hinten an die Liste
  edge: () => (scenery.requests.length ? scenery.requests[scenery.requests.length - 1].id : ''),
});
const skyView = { mapX: 0, mapZ: 0, hillY: 0 };
const windshield = new Windshield();

// Render-Ziele
const size = new THREE.Vector2();
function drawSize() {
  renderer.getDrawingBufferSize(size);
  return size;
}
drawSize();
const worldRT = new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType, samples: quality.msaa, depthBuffer: true });
// das Rückdisplay der Action-Cam im Cockpit zeigt das Weltbild (kein eigenes Rendern)
cockpit.setLiveTexture(worldRT.texture);
const mirrorRT = new THREE.WebGLRenderTarget(768, 226, { type: THREE.HalfFloatType, samples: 4, depthBuffer: true });
cockpit.setMirrorTexture(mirrorRT.texture);
// durch die Heckscheibe der Facecam sieht man, was hinter dem Auto ist
facecam.setRearView(mirrorRT.texture);
// … und durchs Seitenfenster, was links neben ihm ist: eine Kamera am Kopf des Fahrers schaut zum Fahrerfenster hinaus
// (gefilmt nur mit der Facecam, auf „niedrig“ gar nicht: dann zieht dort die gemalte Landschaft vorbei)
const SIDE = { w: 384, h: 72, hfov: 100 };
const sideCam = new THREE.PerspectiveCamera((2 * Math.atan(Math.tan((SIDE.hfov * Math.PI) / 360) / (SIDE.w / SIDE.h)) * 180) / Math.PI, SIDE.w / SIDE.h, 0.4, 700);
const sideRT = new THREE.WebGLRenderTarget(SIDE.w, SIDE.h, { type: THREE.HalfFloatType, depthBuffer: true });
facecam.setSideView(sideRT.texture);
const sideOn = () => settings.quality !== 'niedrig';
const compMat = createCompositeMaterial(worldRT.texture, windshield);
const compScene = new THREE.Scene();
const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), compMat);
quad.frustumCulled = false;
compScene.add(quad);
// Die Regentropfen liegen außen auf der Frontscheibe: im Cockpitbild hinter allem im Innenraum und hinter den Wischern
cockpit.root.add(windshield.layer);
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


// Blitzerfoto
const photoCanvas = document.createElement('canvas');
photoCanvas.width = 360;
photoCanvas.height = 270;
const photoCtx = photoCanvas.getContext('2d');
// BrunnenTV-Album: ein Standbild jeder Folge (takeAlbumShot, 16:9, angezeigt halb so groß), reihum aus vier
// Blickwinkeln (brunnentv.js stillShot); Kamera und Leinwand entstehen erst bei der ersten Folge der Reise. t: Sekunde
// der Folge, q: Güte der Kodierung
const ALBUM_PIC = { w: 288, h: 162, t: STILL.t, q: [0.72, 0.5] };
let albumCam = null;
let albumCanvas = null;
let albumLast = null; // zuletzt aufgenommen (Prüfbilder, __MA.album): { n, pose (Blickwinkel), chars, type, stored, ms }

// --- Ton, Sprache, Eingabe, Oberfläche ---------------------------------------------
const audio = new Audio();
audio.enabled = settings.sound;
audio.volume = settings.volume;
const speech = new Speech();
speech.enabled = settings.speech;
const input = new Input();
const ui = new UI(app);
ui.setChat(settings.chat);
ui.setFacecam(settings.facecam !== false);

// Touch-Knöpfe (nur auf Geräten mit Touchscreen sichtbar)
const touchEl = document.createElement('div');
touchEl.className = 'touch';
// Lenken, Bremse und Strom kommen aus src/ui/touch.js (Daumen-Zug oder Lenkknöpfe), die Knöpfe am Rand aus dessen
// Liste TOUCH_BUTTONS: „Ladestopp einplanen“ (wie Taste L) ist zu sehen, wenn der Akku halb leer ist oder OMI gewarnt
// hat, „BrunnenTV hier“ (wie Taste B), solange der Wagen neben einem Brunnen auf dem Weg steht (Game.wayOffer)
const touchBtn = {};
for (const t of TOUCH_BUTTONS) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = t.cls;
  if (t.icon) {
    b.setAttribute('aria-label', t.label);
    b.append(Object.assign(document.createElement('span'), { textContent: t.icon }), ' ' + t.label);
  } else b.textContent = t.label;
  touchEl.appendChild(b);
  input.bindTouch(b, t.action);
  touchBtn[t.action] = b;
}
const stopBtn = touchBtn.ladestopp;
const wayBtn = touchBtn.brunnen;
app.appendChild(touchEl);
const touch = new TouchControls(touchEl, input);
const jolt = new Jolt();

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
  shake: (v, zone) => {
    cockpit.shake = Math.max(cockpit.shake, v);
    // Rempler: Kopf ruckt in Stoßrichtung, Gamepad und Handy rütteln
    if (zone) {
      jolt.hit(zone, v);
      input.rumble(0.9, 220);
    }
  },
  // Bitspende „Kofferraum öffnen“: Der Mittelbildschirm zeigt die Kofferraum-Kamera (der Innenspiegel bleibt ein Spiegel)
  trunk: (dur) => {
    fxState.trunk = dur;
  },
};
const uiFacade = {
  reset: () => ui.reset(),
  chat: (m) => ui.chat(m),
  // parts: eine Zeile in Teilen ([Text, Klasse]), etwa die Zeile der Runde mit Einnahmen grün und Reparatur rot
  toast: (t, k, key, parts) => ui.toast(t, k, key, parts),
  dropKey: (key) => ui.dropKey(key),
  naviNews: () => ui.naviNews(),
  nomi: (t, d) => ui.nomi(t, d),
  studio: (t, d) => ui.studio(t, d),
  money: (a, l) => ui.money(a, l),
  durchsage: (l, t, d, b) => ui.durchsage(l, t, d, b),
  megafon: (t, d, b, l) => ui.megafon(t, d, b, l),
  rahmen: (r, b) => ui.rahmen(r, b),
  funkloch: (on) => ui.funkloch(on),
  damage: (h, m) => ui.damage(h, m),
  jobs: (j) => ui.jobs(j),
  jobDone: (text) => ui.jobDone(text),
  photo: (kmh, clock) => {
    photoRequest = { kmh, clock };
  },
  brunnenTV: (n, name) => ui.brunnenTV(n, name),
};

// Das Spiel bietet auf echte Orte und braucht dafür die Fahrt der Welt (jedes Gebot setzt ihr Ziel), den Halt am
// Brunnen (stopping: der Wagen bremst gerade dorthin · release: weiterfahren, auch wenn er knapp hinter dem
// Haltepunkt zum Stehen kam) sowie Brunnenplatz und Ort für die BrunnenTV-Szene
const gameWorld = {
  trip: () => xxl.trip, stopping: () => !!xxl.arrival.pending, release: () => xxl.arrival.reset(), square: (sec) => xxl.square(sec), town: (sec) => xxl.town(sec),
  // BrunnenTV unterwegs: der Wagen bleibt stehen, wo er steht, bis release()
  hold: (sec) => (xxl.arrival.held = { s: xxl.trip.s + 0.3, sec, place: sec.place, park: -1 }),
};
// (touchUI: Auf Handy und Tablet zeigt das Bild die Touch-Knöpfe – von Anfang an, nicht erst nach dem ersten Tipp)
const game = new Game({ traffic, scenery, road, sky, rain, windshield, cockpit, audio, speech, ui: uiFacade, fx, pickups, world: gameWorld, touchUI: IS_TOUCH });
// Ankunft, Halt am Brunnen, Ausfahrten und verpasste Abzweige der Fahrt gehen ans Spiel (Ziel erreicht, BrunnenTV,
// Mimik, Chat); jeder Ort, durch dessen Mitte der Spieler fährt, zählt als Besuch auf der großen Karte
xxl.on((e) => {
  game.onTrip(e);
  // an der angesagten Ausfahrt vorbei: Die Fahrt plant neu, das Navi im Auto zeigt es
  if (e.type === 'fork' && e.wrong && game.running) xxlNav.replanned();
  if (game.running && (e.type === 'arrive' || e.type === 'pass')) {
    recordVisit(save, e.place);
    storeSave(save);
  }
});
// Krümmung (1/m, links positiv) und Steigung unter dem Wagen für die Lenkung: course.fill() misst sie am Ende jedes
// Bildes, also genau dort, wo das nächste beginnt; beim Fahren gehen sie mit den Eingaben (ctl) an game.update
const courseEnv = { kappa: 0, grade: 0 };

// --- Mini Adams Mimik ------------------------------------------------------------------
// Spielereignisse kommen über game.onMood und werden zu Stimmung, Geste und Blick – für beide Figuren gleich: die im
// Auto (Drohne, Titel, Abspann) und die in der Facecam. Eine Stimme hat Adam nicht: er „redet“ in kurzen Stücken mit
// dem Chat (Mund im Silbentakt, Blick in die Kamera) und hört zu, solange NOMI oder eine Sprachdurchsage spricht.
const adams = [tesla.adam, facecam.adam];
const adamCtl = { talkFrom: 0, talkUntil: 0, talk: 0, chatK: 0, nextChat: 14, megafon: -1, voice: null, camUntil: 0, quiet: 0, doze: 0, wiperT: 0 };
const hash01 = (k) => {
  const x = Math.sin(k * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
function adamDo(fn) {
  for (const a of adams) fn(a);
  // dazu die Figur, die freie Kameras im Cockpit sehen (baut das Cockpit erst beim ersten Blick von außen)
  if (cockpit.driver) fn(cockpit.driver);
}
/** In die Kamera schauen; so lange zieht ihn auch NOMI nicht weg. */
function adamToCamera(sec) {
  adamDo((a) => a.lookAt('camera', sec));
  adamCtl.camUntil = Math.max(adamCtl.camUntil, simT + sec);
}
/** Adam spricht in inSec Sekunden für dur Sekunden (verlängert, was schon läuft). */
function adamSay(dur, inSec = 0) {
  const c = adamCtl;
  const from = simT + inSec;
  if (from > c.talkUntil) c.talkFrom = from;
  c.talkUntil = Math.max(c.talkUntil, from + dur);
}
/** Stimmung aus dem Spiel (MOODS in adamMimic.js) oder ein Auftritt: wave, donation, cheer, wiper, megafon. */
function adamMood(name, k = 1) {
  adamCtl.quiet = 0;
  switch (name) {
    case 'wave':
      // Begrüßung zum Start: in die Kamera schauen, winken, „Hallo Chat!“
      adamDo((a) => {
        a.gesture('wave');
        a.setMood('happy', 2.4, 0.6);
      });
      adamToCamera(2.6);
      adamSay(1.6, 0.5);
      break;
    case 'donation':
      // kurz aufs Handy mit dem Chat, freuen, bedanken; bei großen Spenden jubelt er
      adamDo((a) => {
        a.lookAt('chat', 1.1);
        a.setMood('happy', 1.4 + 1.6 * k, 0.45 + 0.55 * k);
        if (k >= 0.75) a.gesture('cheer');
      });
      adamSay(1.2 + k, 1.2);
      break;
    case 'cheer':
      // Ziel erreicht
      adamDo((a) => {
        a.gesture('cheer');
        a.setMood('happy', 3, k);
      });
      adamToCamera(2.2);
      adamSay(2, 0.9);
      break;
    case 'wiper':
      // der Wischer zuckt nur: hinschauen – im Schauer zucken die stehenden Wischer alle paar Sekunden, dann schaut er
      // nur ab und zu hin (sonst blickte er den ganzen Schauer lang nach oben und nie mehr in die Kamera)
      if (simT < adamCtl.wiperT) break;
      adamCtl.wiperT = simT + 6 + 4 * hash01(simT);
      adamDo((a) => a.setMood('rain', 2.2, k));
      break;
    case 'megafon':
      // durchs Megafon spricht er selbst (k = Dauer)
      adamCtl.megafon = simT + k;
      adamSay(k, 0.1);
      break;
    default:
      adamDo((a) => a.setMood(name, undefined, k));
  }
}
game.onMood = adamMood;

/** Pro Bild: Sprechen, Zuhören und Müdigkeit (leerer Akku) zu den Animationswerten o dazurechnen. */
function adamFrame(dt, o) {
  const c = adamCtl;
  const cur = speech.current;
  // wer gerade spricht (während des Megafons ist er es selbst)
  const voice = cur && simT > c.megafon ? cur.voiceKey : null;
  if (voice !== c.voice) {
    if (simT > c.camUntil) {
      if (voice === 'board') adamDo((a) => a.lookAt('nomi', 1.4));
      else if (voice) adamDo((a) => a.lookAt('chat', 1.6));
    }
    c.voice = voice;
  }
  // von selbst ab und zu ein paar Worte in die Kamera – nur in der Fahrt und wenn sonst niemand spricht
  if (state === 'drive' && !voice) {
    c.nextChat -= dt;
    if (c.nextChat <= 0) {
      c.chatK++;
      c.nextChat = 16 + 26 * hash01(c.chatK);
      const dur = 1.4 + 2.2 * hash01(c.chatK + 0.5);
      adamSay(dur);
      adamToCamera(dur + 0.3);
    }
  }
  const talking = simT >= c.talkFrom && simT < c.talkUntil && !voice;
  c.talk = clamp(c.talk + (talking ? dt / 0.15 : -dt / 0.25), 0, 1);
  o.talk = c.talk;
  // müde: fast leerer Akku, oder lange passiert nichts (dann langsam schwere Lider, bis das nächste Ereignis kommt)
  c.quiet = state === 'drive' && !voice ? c.quiet + dt : 0;
  c.doze = clamp(c.doze + (c.quiet > 50 ? dt / 12 : -dt / 0.6), 0, 1);
  const battery = state === 'drive' ? clamp((14 - game.player.battery) / 14, 0, 1) : 0;
  o.sleepy = Math.max(battery * 0.85, c.doze * 0.5);
  return o;
}

// --- Zustände ------------------------------------------------------------------
let state = 'loading';
let view = 'cockpit'; // oder 'drone'
let stateT = 0;
let paused = false;
let lastOver = null;

// Vollbild mit F, überall (Knöpfe in Titel und Pause: menus.js)
bindFullscreenKey();
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
    if (name === 'shop' && save.megafonNote) {
      shopRefund = megafonNoteSeen(save);
      storeSave(save);
    }
    if (name === 'shop') return { wallet: save.wallet, upgrades: save.upgrades, refund: shopRefund };
    if (name === 'settings') return { ...settings, speechSupported: speech.supported };
    if (name === 'title') return save;
    if (name === 'pause') return game;
    if (name === 'karte') return { save, nav: xxlNav, odo: paused ? game.odometer : null };
    // BrunnenTV-Album: Folgen aus dem Spielstand, Bilder unter ihrem eigenen Schlüssel (frisch gelesen)
    if (name === 'album') return { save, pics: loadPictures(), tab: 'folgen' };
    // Guthaben frisch, falls im Shop aus dem Abspann heraus eingekauft wurde
    if (name === 'over') return lastOver ? { ...lastOver, wallet: save.wallet, pics: loadPictures() } : data;
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
    // (die Zeile zum erstatteten Megafon gilt dem gelöschten Guthaben und verschwindet mit ihm)
    shopRefund = 0;
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
  facecam.adam.setVest(!!up.weste);
  cockpit.setElsa(!!up.elsa);
  cockpit.setRadar(!!up.radar);
}

/** Fahr-Einstellungen auf Fahrphysik, Eingabe und Touch übertragen. */
function applyDrive() {
  const ds = driveSettings(settings);
  game.player.configure(playerOptions(ds));
  input.vibration = ds.vibration;
  touch.configure(ds);
}

function applySettings(key) {
  applyDrive();
  audio.enabled = settings.sound;
  audio.volume = settings.volume;
  audio.setEnabled(settings.sound);
  speech.enabled = settings.speech;
  if (!settings.speech) speech.stopAll();
  ui.setChat(settings.chat);
  ui.setFacecam(settings.facecam !== false);
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
  game.startTitle();
  xxlStart(true);
  applyCosmetics();
  menus.hide();
  menus.show('title', save);
}

function startRun() {
  audio.init();
  menus.hide();
  paused = false;
  game.start(save);
  xxlStart(false);
  applyCosmetics();
  stateT = 0;
  view = 'cockpit';
  ui.show(false);
  fxState.fade = 1;
  cockpit.shake = 0;
  chassis.reset();
  // jede Fahrt beginnt mit der Startszene am Supercharger in Erlensee (ohne Ladepark gleich am Steuer)
  Object.assign(chargeRun, { hello: false, liveT: Infinity, greetT: Infinity });
  state = 'charge';
  if (!chargeBegin()) toDrive();
  // die Taste, die „Losfahren“ ausgelöst hat, soll die Startszene nicht gleich überspringen
  input.endFrame();
}

function resume() {
  paused = false;
  menus.hide();
  speech.pause(false);
  // die Taste, die weiterfahren lässt, soll keinen Ladestopp überspringen
  input.endFrame();
  input.releaseAll();
}

function pause() {
  if (state !== 'drive' || paused) return;
  paused = true;
  // gehaltene Tasten und Daumen loslassen: nach dem Weiterfahren lenkt nichts von allein
  input.releaseAll();
  speech.pause(true);
  menus.show('pause', game);
}

function finishRun() {
  const o = game.over;
  const km = o.distance / 1000;
  // Rekord und Summe in Reisemetern bzw. Reisekilometern
  const best = save.best.reise || 0;
  const newRecord = o.distance > best && o.distance > 50;
  save.wallet = Math.round((save.wallet + o.money) * 100) / 100;
  save.best.reise = Math.max(best, o.distance);
  save.best.earned = Math.max(save.best.earned || 0, o.money);
  save.best.viewers = Math.max(save.best.viewers || 0, o.peakViewers);
  save.stats.runs++;
  save.stats.reiseKm = (save.stats.reiseKm || 0) + km;
  save.stats.naviReached += o.stats.naviReached;
  save.stats.crashes += o.stats.crashes;
  storeSave(save);
  if (newRecord) adamMood('proud');
  // zur Route des Streams der gefahrene Weg des Navis (Kartenpunkte, ausgedünnt), für die Karte im Abspann
  const route = { ...o.route, line: thinLine(xxlNav.trail, 3000) };
  lastOver = { ...o, route, newRecord, best: save.best.reise, wallet: save.wallet, photos: ui.photos.slice() };
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

// Fahrwerk (src/game/chassis.js): Wanken, Kopf, Neigung der Cockpitkamera, Verfolgerkamera – straff, ohne Schaukeln
const chassis = new Chassis();
const droneQuat = new THREE.Quaternion();
const droneMatrix = new THREE.Matrix4();

function updateCarMatrix() {
  const p = game.player;
  carPos.set(p.x, 0, 0);
  carEuler.set(0, -p.yaw, chassis.roll, 'YXZ');
  carQuat.setFromEuler(carEuler);
  carMatrix.compose(carPos, carQuat, ONE);
  tesla.root.position.copy(carPos);
  tesla.root.quaternion.copy(carQuat);
  cockpit.root.position.copy(carPos);
  cockpit.root.quaternion.copy(carQuat);
}

// Blick in die Kurve: Cockpit und Verfolgerdrohne drehen sich sacht zum Straßenpunkt 25–60 m voraus und neigen
// sich ein wenig mit Kuppen und Senken. Geglättet (gut 0,4 s), damit nichts schwimmt.
const lookAhead = { yaw: 0, pitch: 0 };
const UP_AXIS = new THREE.Vector3(0, 1, 0);
const RIGHT_AXIS = new THREE.Vector3(1, 0, 0);
function updateLookAhead(dt, p) {
  const d = clamp(25 + p.speed * 0.9, 25, 60);
  const c = curveAt(d);
  const f = curveOffset(p.x, c.k, c.xr);
  const x = c.x + f * Math.cos(c.th) - p.x;
  const z = c.z - f * Math.sin(c.th);
  const yaw = Math.atan2(-x, -z);
  const pitch = Math.atan2(c.y, d);
  const k = 1 - Math.exp(-dt / 0.42);
  lookAhead.yaw += (yaw - lookAhead.yaw) * k;
  lookAhead.pitch += (pitch - lookAhead.pitch) * k;
}

function setFov(vfovCockpit) {
  const aspect = window.innerWidth / window.innerHeight;
  const minH = THREE.MathUtils.degToRad(86);
  const v = Math.max(THREE.MathUtils.degToRad(vfovCockpit), 2 * Math.atan(Math.tan(minH / 2) / aspect));
  camera.fov = clamp(THREE.MathUtils.radToDeg(v), 50, 78);
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
}

function localToWorld(v) {
  return tmpV.copy(v).applyMatrix4(carMatrix);
}

// Orbit-Kamera (Abspann): bleibt über der eigenen Fahrbahn – vor Lärmschutzwand, Schildern,
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
// a: Winkel um das Auto (0 = dahinter, π/2 = rechts), w: Drehrate, esc: Ziel beim Ausweichen
const orbit = { a: 0.9, dir: 1, w: 0, esc: null, plan: 0, phi: 0, dist: ORBIT.r };
function orbitRoom(p, side) {
  return side > 0 ? ORBIT.xMax - p.x : p.x - ORBIT.xMin;
}
function orbitBlocked(p, side, r = ORBIT.r) {
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
  let worst = 0;
  for (const c of traffic.cars) {
    const xt = c.change ? ROAD.laneCenter(c.change.to) : c.x;
    const hw = c.w / 2 + 0.15;
    if (Math.max(c.x, xt) - p.x + hw < sx0 || Math.min(c.x, xt) - p.x - hw > sx1) continue;
    const z0 = p.s - c.s;
    const vz = p.speed - c.speed;
    const h = c.v.height;
    const tall = h > 2;
    const zStop = (c.len + p.len) / 2 + 0.4;
    // zwischen zwei Prüfzeitpunkten zurückgelegter Weg zählt mit (schnelle Autos im Abspann, Spurwechsel)
    const hl = c.len / 2 + Math.abs(vz) * ORBIT.seeStep * 0.5;
    const mx = c.change ? 0.5 : 0;
    for (let tau = tau0; tau <= tau1 + 1e-6; tau += ORBIT.seeStep) {
      const wgt = 1 - 0.35 * Math.min(1, tau / ORBIT.see);
      if (wgt <= worst) break;
      const xc = orbitRelX(c, p, tau);
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
/** Wo Fahrzeug c in tau Sekunden quer zum Tesla steht (Spurwechsel der anderen wie geplant) */
function orbitRelX(c, p, tau) {
  const ch = c.change;
  const x = ch ? lerp(ROAD.laneCenter(ch.from), ROAD.laneCenter(ch.to), smoothstep(0, 1, (ch.t + tau - ch.delay) / ch.dur)) : c.x;
  return x - p.x;
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
/** Startwinkel: hinter dem stehenden Auto (rückt dort gerade einer auf oder fährt einer vorbei, davor oder schräg
 *  daneben) – mit freier Sicht. */
function orbitStart(p, y, r) {
  const cands = [0, Math.PI, 0.35, -0.35, Math.PI - 0.35, Math.PI + 0.35, 0.9, -0.9, Math.PI - 0.9, Math.PI + 0.9, 1.57, -1.57];
  let best = 0;
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
  orbit.dir = side * (Math.cos(best) >= 0 ? 1 : -1);
}
function orbitTarget(p, dt) {
  const r = ORBIT.r;
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
  for (const c of traffic.cars) {
    const zc = p.s - c.s;
    const h = c.v.height;
    // über Autos zwischen Kamera und Tesla schaut sie hinweg: steigt, bevor sie dazwischen sind
    if (h <= 2) {
      const vz = p.speed - c.speed;
      let lift = 0;
      for (let tau = 0; tau <= 2; tau += 0.4) {
        const z = zc + vz * tau;
        const x = orbitRelX(c, p, tau);
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
    // hinter dem Wagen, mit dem halben Gierwinkel geschwenkt und kaum versetzt: Sie bleibt eng am Wagen, statt ihn bei
    // jedem Spurwechsel quer durchs Bild gleiten zu lassen (Fahrwerk)
    droneQuat.setFromAxisAngle(UP_AXIS, -p.yaw * CHASSIS.droneYaw);
    droneMatrix.compose(carPos, droneQuat, ONE);
    pos = new THREE.Vector3(-p.vx * CHASSIS.lag, 3.3, 9.2).applyMatrix4(droneMatrix);
    look = new THREE.Vector3(0, 1.0, -14).applyMatrix4(droneMatrix);
    // in die Kurve schauen (um die Kamera gedreht) und mit der Straße etwas hoch oder runter
    look.sub(pos).applyAxisAngle(UP_AXIS, lookAhead.yaw * 0.6);
    look.y += Math.tan(lookAhead.pitch * 0.6) * 23;
    look.add(pos);
  }
  const k = 1 - Math.exp(-dt * (mode === 'orbit' ? 3 : chassis.follow));
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
}

/** Kamera zwischen Schlüsseln ({t, pos, look} im Rahmen des Wagens) zur Zeit t. */
function lerpKeys(t, keys) {
  let a = keys[0];
  let b = keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (t >= keys[i].t && t <= keys[i + 1].t) {
      a = keys[i];
      b = keys[i + 1];
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

/** Kamera einer Szene: Schlüssel im Rahmen des Wagens bis inside, danach im Cockpit (Kopf dreht nach vorne bis end). */
function placeScene(dt, keys, t, inside, end) {
  if (t < inside) {
    const { pos, look } = lerpKeys(t, keys);
    pos.applyMatrix4(carMatrix);
    look.applyMatrix4(carMatrix);
    camera.position.copy(pos);
    camera.lookAt(look);
    setFov(44);
    return 'outside';
  }
  // im Cockpit: Kopf dreht vom Seitenfenster nach vorne
  cockpit.placeCamera(camera, carMatrix, t, game.player.speed, 0, dt);
  const k = easeInOut(clamp((t - inside) / (end - inside), 0, 1));
  camera.rotateOnWorldAxis(tmpV2.set(0, 1, 0), (1 - k) * 1.05);
  setFov(58);
  return 'inside';
}

// Tipps der ersten Minuten (src/ui/first-tips.js): einmal je Spieler, am Rand auf der Karte von „So steuerst du“
const firstTips = new FirstTips(loadTips());
let tipT = 0; // Sekunden freier Fahrt in diesem Stream
const tipsOff = () => {
  firstTips.stop();
  storeTips(firstTips);
};

/** Fährt vor dem Wagen auf seiner Spur jemand langsamer (20 bis 120 m voraus)? Dann hilft das Megafon. */
function slowCarAhead(p) {
  return traffic.cars.some((c) => {
    const ds = c.s - p.s;
    return ds > 20 && ds < 120 && Math.abs(c.x - p.x) < 1.8 && c.speed < p.speed - 3;
  });
}

/** Jedes Bild der Fahrt: Tipps der ersten Minuten (camera: V in diesem Bild; ctl: die übrigen Eingaben). */
function tipsTick(dt, ctl, camera) {
  if (firstTips.done && !firstTips.cur) return;
  const p = game.player;
  // frei: kein Halt am Brunnen oder an der Säule, und „So steuerst du“ hat den Platz geräumt
  const free = !game.charging && !game.navi.stopping && !driveHintBusy();
  if (free) tipT += dt;
  if (camera) firstTips.did('camera');
  if (ctl.megafon) firstTips.did('megafon');
  if (ctl.ladestopp) firstTips.did('ladestopp');
  if (firstTips.cur && input.take('confirm')) tipsOff();
  const ins = turnIns;
  const ev = firstTips.update(dt, {
    free,
    t: tipT,
    // die Ansage nennt ab dem 1000-m-Schild eine Ausfahrt, die noch nicht zu nah ist
    exit: !!ins && ins.turn === 'exit' && !ins.calm && ins.dist > 250,
    carAhead: !firstTips.seen.has('megafon') && slowCarAhead(p),
    stop: game.stopOffer(),
  });
  if (!ev) return;
  showTip(ui, ev.show || null, input.lastDevice, tipsOff);
  if (ev.show) storeTips(firstTips);
}

/** Ende der Startszene: Das Spiel übernimmt, HUD und Facecam gehen an. */
function toDrive() {
  state = 'drive';
  stateT = 0;
  ui.show(true);
  if (!chargeRun.hello) streamHello();
  // die Facecam geht an: Mini Adam schaut hinein und winkt
  adamMood('wave');
  // die Tipps der ersten Minuten zählen ab hier (first-tips.js); keiner steht noch vom letzten Stream
  firstTips.restart();
  tipT = 0;
  // beim ersten Start auf diesem Gerät „So steuerst du“, danach der kurze Tipp
  if (!showDriveHint(ui, input.lastDevice, driveSettings(settings))) {
    ui.toast(matchMedia('(pointer: coarse)').matches ? 'Tipp: ◀ ▶ lenken · Strom und Bremse rechts · 🎥 Kamera' : 'Tipp: ← → lenken · ↑ Strom · ↓ Bremse · V Kamera', 'info');
  }
}

// --- Startszene der Reise: am Supercharger in Erlensee (world/xxl/charge.js SCENE) ---------------------------------
// Das Spiel steht so lange still: Der Spieler wartet schon in der Spur, wie xxlStart ihn hinstellt (40 km/h,
// geradeaus), und das Ausparken endet genau dort. Die Szene bewegt nur Wagen, Stecker, Klappe und Kamera; Tempo und
// Lenkung des Spielers zeigen so lange die des Wagens (Räder, Lenkrad, Tacho, Motor) und stehen danach wieder wie vorher.
// Kamera: Schlüssel im Rahmen des Wagens (placeScene) – schräg von vorne oben auf Buchse und Säule (von der Seite stünde
// die Säule davor), beim Ausparken schräg von vorne, zuletzt am Seitenfenster und hinein ins Cockpit.
const CHARGE_KEYS = [
  { t: 0, pos: [-2.4, 2.15, -1.3], look: [-0.85, 0.85, 1.9] },
  { t: 1.3, pos: [-2.1, 1.85, -0.2], look: [-1.1, 0.95, 1.95] },
  { t: 2.9, pos: [-3.4, 1.9, -5.0], look: [-0.3, 0.9, -0.3] },
  { t: 4.6, pos: [-2.7, 1.55, -3.4], look: [-0.37, 1.12, 0.22] },
  { t: SCENE.inside - 0.2, pos: [-1.72, 1.26, 0.2], look: [-0.37, 1.16, 0.28] },
];
// im Titel: der ganze Wagen schräg von vorne, Säule und Stecker rechts daneben (links liegt das Menü)
const CHARGE_TITLE = { pos: [-2.8, 2.6, -4.6], look: [-0.25, 0.85, 0.9] };
const CHARGE_LINES = { live: 'Wir sind live.', greet: 'Hallo Mini Adam! Akku voll, gute Fahrt!' };
// town: der Startort (Towns.of: plan, group, charge), port: Ladeklappe des Wagens, keep: Spieler vor der Szene,
// skipT: wann übersprungen wurde (dann erst abblenden), greetT: wann NOMI grüßt (Spielzeit simT)
// parked: der Titel der Reise zeigt den Wagen am Supercharger (xxlStart)
// hello: Mini Adams „Hallo, Partypeople!“ ist gesagt, liveT: wann das Sprachstudio „Wir sind live.“ sagt (Spielzeit simT)
const chargeRun = { town: null, port: null, pose: {}, keep: null, parked: false, chimed: false, hello: false, skipT: -1, liveT: Infinity, greetT: Infinity };
const chargeM = new THREE.Matrix4();

/** Wagen in die Bucht des Startorts, Stecker in die Buchse, Ring grün. false, wenn der Startort keinen Ladepark hat. */
function chargePlug() {
  const town = xxl.town(xxl.trip.section);
  if (!town || !town.charge) return false;
  Object.assign(chargeRun, { town, port: tesla.port() });
  // die Buchse im Rahmen der Säule: Wagen in der Bucht → Welt → Säule
  chargePose(0);
  tesla.root.updateWorldMatrix(true, false);
  town.charge.group.updateWorldMatrix(true, false);
  chargeM.copy(town.charge.group.matrixWorld).invert();
  const pos = tmpV.copy(chargeRun.port.pos).applyMatrix4(tesla.root.matrixWorld).applyMatrix4(chargeM);
  const normal = tmpV2.copy(chargeRun.port.normal).transformDirection(tesla.root.matrixWorld).transformDirection(chargeM);
  town.charge.plug(pos, normal);
  town.charge.set(0);
  chargeRun.port.set(1, 1);
  return true;
}

/** Startszene vorbereiten (nach xxlStart): eingesteckt wie im Titel, nur der Untertitel. false ohne Ladepark. */
function chargeBegin() {
  if (!chargePlug()) return false;
  const p = game.player;
  Object.assign(chargeRun, { chimed: false, unplugged: false, shifted: false, skipT: -1 });
  chargeRun.keep = { speed: p.speed, wheel: p.wheel, throttle: p.throttle, braking: p.braking };
  ui.show(false, true);
  return true;
}

/** Titel der Reise am Supercharger: Der Wagen lädt, die Kamera schwebt langsam vor ihm. */
function chargeTitle() {
  chargePose(0);
  const k = CHARGE_TITLE;
  const pos = tmpV.set(k.pos[0] + 0.5 * Math.sin(simT * 0.21), k.pos[1] + 0.12 * Math.sin(simT * 0.17), k.pos[2] + 0.6 * Math.sin(simT * 0.13));
  camera.position.copy(pos.applyMatrix4(carMatrix));
  camera.lookAt(tmpV2.fromArray(k.look).applyMatrix4(carMatrix));
  setFov(44);
}

/** Wagen in der Szene bei t: über die Matrix des Orts in die Welt (wie updateCarMatrix). Gibt die Lage (rollPose) zurück. */
function chargePose(t) {
  const town = chargeRun.town;
  const q = rollPose(town.plan.charge.u, clamp(t - SCENE.roll, 0, ROLL_T), chargeRun.pose);
  carPos.set(q.x, groundAt(q.x), -q.u).applyMatrix4(town.group.matrix);
  carEuler.set(0, -q.yaw, 0, 'YXZ');
  carQuat.setFromEuler(carEuler);
  carMatrix.compose(carPos, carQuat, ONE);
  tesla.root.position.copy(carPos);
  tesla.root.quaternion.copy(carQuat);
  cockpit.root.position.copy(carPos);
  cockpit.root.quaternion.copy(carQuat);
  return q;
}

/** Ein Bild der Startszene: { inside (Kamera im Cockpit), wave, look (Mini Adam) }. */
function chargeStep(dt) {
  const S = SCENE;
  const run = chargeRun;
  if (run.skipT < 0 && stateT > S.skip && stateT < S.inside - 0.25 && (input.anyKey || input.take('confirm'))) run.skipT = stateT;
  // übersprungen: erst abblenden, dann gleich ins Cockpit (dort steht alles schon so, wie die Szene es hinterlässt)
  if (run.skipT >= 0 && stateT - run.skipT >= 0.25) {
    stateT = S.inside;
    run.skipT = -2;
  }
  const t = stateT;
  const q = chargePose(t);
  const p = game.player;
  p.speed = q.v;
  p.wheel = q.steer / 0.35; // models/tesla.js: Vorderräder −steer · 0,35 rad
  p.throttle = t > S.roll && q.v < run.keep.speed - 0.05 ? 0.4 : 0;
  p.braking = 0;
  run.town.charge.set((t - S.plug[0]) / (S.plug[1] - S.plug[0]));
  // der Leuchtring erlischt, sobald der Stecker sich löst; die Klappe schließt, wenn er draußen ist
  run.port.set(1 - smoothstep(S.flap[0], S.flap[1], t), 1 - smoothstep(S.plug[0], S.plug[0] + 0.15, t));
  // Klick, wenn der Stecker sich löst, und der Zirper von P nach D, wenn der Wagen anrollt (übersprungen: keiner)
  if (t >= S.plug[0] && !run.unplugged) {
    run.unplugged = true;
    if (t < S.plug[0] + 0.3) audio.unplug();
  }
  if (t >= S.roll && !run.shifted) {
    run.shifted = true;
    if (t < S.roll + 0.3) audio.gear('D');
  }
  if (t >= S.chime && !run.chimed) {
    run.chimed = true;
    audio.nomiChime();
  }
  if (t >= S.hallo && !run.hello) streamHello();
  const where = placeScene(dt, CHARGE_KEYS, t, S.inside, S.end);
  const sw = S.inside;
  const fade = t < 0.6 ? 1 - t / 0.6 : t > sw - 0.25 && t < sw ? (t - (sw - 0.25)) / 0.25 : t >= sw && t < sw + 0.35 ? 1 - (t - sw) / 0.35 : 0;
  fxState.fade = Math.max(fade, run.skipT >= 0 ? (stateT - run.skipT) / 0.25 : 0);
  if (stateT >= S.end) {
    // Übergabe: Der Wagen steht genau da, wo der Spieler wartet; der hat wieder sein eigenes Tempo
    Object.assign(p, run.keep);
    updateCarMatrix();
    toDrive();
  }
  return {
    inside: where === 'inside',
    wave: smoothstep(S.wave[0], S.wave[0] + 0.4, t) * (1 - smoothstep(S.wave[1] - 0.5, S.wave[1], t)),
    look: smoothstep(S.wave[0], S.wave[0] + 0.8, t) * (1 - smoothstep(S.wave[1], S.inside, t)),
  };
}

/**
 * Jeder Stream beginnt mit Mini Adams Gruß (data.js PARTYPEOPLE): in der Startszene, während er winkt, sonst (ohne
 * Ladepark, übersprungen vor dem Gruß) beim Losfahren. Mit seiner tiefen Stimme und Vorrang, damit nichts ihn
 * verschluckt; danach das Sprachstudio „Wir sind live.“ und OMIs Gruß.
 */
function streamHello() {
  chargeRun.hello = true;
  const d = speech.say(PARTYPEOPLE.say, 'adam', { priority: true });
  ui.adam(PARTYPEOPLE.say, d + 0.8);
  chargeRun.liveT = simT + Math.max(d + 0.35, SCENE.live - SCENE.hallo);
}

/** Das Sprachstudio meldet: Wir sind live (nach Mini Adams Gruß). */
function chargeLive() {
  chargeRun.liveT = Infinity;
  const d = speech.say(CHARGE_LINES.live, 'sprachstudio');
  ui.studio(CHARGE_LINES.live, d + 0.8);
  chargeRun.greetT = simT + d + 1.1;
}

/** NOMI grüßt (wie Game.say, aber ohne die Spielzeit: die steht in der Szene still). */
function chargeGreet() {
  chargeRun.greetT = Infinity;
  audio.nomiChime();
  cockpit.nomi.setMood('happy', 3.2);
  const d = speech.say(CHARGE_LINES.greet, 'board', { priority: true, onStart: (x) => cockpit.nomi.speak(x) });
  ui.nomi(CHARGE_LINES.greet, d + 0.8);
}

// --- Ladestopp im Park (world/xxl/charge.js STOP, Game.startCharge) -------------------------------------------------
// Das Spiel läuft weiter (Uhr, Chat, Akku, Gebote, Spenden) und führt die Zeit; der Spieler wartet an seinem Halt in der
// Spur, während der Wagen der Szene rückwärts in die freie Heldenbucht setzt, lädt und ausparkt (die Wege rechnet
// charge.js im Rahmen des Parks). Passiert der ausparkende Wagen den Halt, folgt ihm der Spieler: Die Übergabe am Ende
// ist ohne Sprung. Kamera: beim Einparken die des Spielers (im Cockpit bleibt sie dort, die Drohne steigt über die
// Gegenspur und schaut zu), in der Bucht nah an Buchse, Säule und Popcorn-Maschine (Schlüssel im Rahmen des Wagens wie
// in Erlensee), beim Ausparken die Startszene (CHARGE_KEYS) zurück ins Cockpit bzw. hinter den Wagen wie die Drohne.
// (über den Eimer hinweg auf Buchse, Stecker und Säule – der Eimer bleibt unter dem Bild –, dann von links auf die
// Maschine oben auf der Säule und das offene Fahrerfenster, in das das Popcorn fliegt, zum Bananensaft schräg von vorn
// aufs Fahrerfenster, zuletzt Erlensees erster Schlüssel fürs Ausstecken)
const STOP_KEYS = [
  { t: 0, pos: [-1.7, 1.95, -1.3], look: [-0.95, 0.85, 1.95] },
  { t: STOP.plug[1] + 0.15, pos: [-1.5, 1.8, 1.0], look: [-1.25, 1.2, 1.88] },
  { t: STOP.pop[0] + 0.8, pos: [-3.4, 1.9, -0.3], look: [-1.1, 1.75, 1.15] },
  { t: STOP.juice - 1.0, pos: [-3.15, 1.8, -0.7], look: [-1.0, 1.6, 0.95] },
  { t: STOP.juice - 0.2, pos: [-2.6, 1.45, -1.6], look: [-0.92, 0.95, 0.89] },
  { t: STOP.unplug - 1.4, pos: [-2.5, 1.5, -1.45], look: [-0.9, 0.95, 0.9] },
  { t: STOP.unplug, pos: CHARGE_KEYS[0].pos, look: CHARGE_KEYS[0].look },
];
// Drohne beim Einparken (Ortskoordinaten, u ab der Wagenmitte in der Bucht): über der linken Straßenseite hinter der
// Bucht; ihr Blick liegt zwischen Wagen und Bucht (bay: Anteil der Bucht), so bleibt der Park im Bild
const STOP_DRONE = { pos: [3.0, 5.4, 10], blend: 1.2, bay: 0.35 };
// Drohne beim Ausparken: Erlensees Schlüssel, bis der Wagen in der Spur ist, dann hinter ihn wie die Verfolgerdrohne
const STOP_ROLL_DRONE = [...CHARGE_KEYS.slice(0, 4), { t: SCENE.end, pos: [0, 3.3, 9.2], look: [0, 1.0, -14] }];
const STOP_CTL = { steer: 0, throttle: 0, brake: 0, reverse: false, horn: false, wiper: false, megafon: false, ladestopp: false, device: null, kappa: 0, grade: 0 };
const STOP_FADE = 0.35; // Aufblenden in der Spur nach dem Überspringen
// c: game.charging (Fahrplan plan), town: der Park (Towns.of), rig: Stecker und Kabel seiner Heldensäule, pop: Popcorn
// in der Maschine (beim ersten Stopp gebaut), q: Lage des Wagens, v: sein Tempo (rückwärts negativ), rev / brake:
// Rückfahr- und Bremslicht, gear: Gang fürs Display, inside: Kamera im Cockpit (für die Pause), skipT: übersprungen bei
// (Zeit der Szene), fadeT: Aufblenden danach, from / fromLook: Kamera beim Halt, cam / look: die der Drohne beim
// Einparken, done: Klänge und Gesten, die schon kamen
// aim / along: Stelle im offenen Fahrerfenster, durch die das Popcorn fliegt, und die Richtung längs des Wagens dort,
// im Rahmen der Maschine
const stopRun = {
  on: false, c: null, town: null, rig: null, port: null, pop: null, aim: new THREE.Vector3(), along: new THREE.Vector3(), q: {}, v: 0, rev: false, brake: false, gear: 'D', inside: false, skipT: -1, fadeT: 0,
  from: new THREE.Vector3(), fromLook: new THREE.Vector3(), cam: new THREE.Vector3(), look: new THREE.Vector3(), done: {},
};
game.onCharge = (c) => stopBegin(c);

/** Game.onCharge: Der Wagen steht an seinem Halt im Park. Ohne gebauten Park (Prüfstand) läuft der Fahrplan ohne Bild. */
function stopBegin(c) {
  const town = xxl.town(c.sec);
  if (!town || !town.charge) return;
  const r = stopRun;
  Object.assign(r, { on: true, c, town, rig: town.charge, port: tesla.port(), v: 0, rev: true, brake: true, gear: 'R', skipT: -1, fadeT: 0, done: {} });
  // die Buchse des Wagens in der Bucht im Rahmen der Säule (wie chargePlug): dorthin führt der Stecker
  stopPose(rollPose(c.plan.u, 0, r.q));
  tesla.root.updateWorldMatrix(true, false);
  r.rig.group.updateWorldMatrix(true, false);
  chargeM.copy(r.rig.group.matrixWorld).invert();
  const pos = tmpV.copy(r.port.pos).applyMatrix4(tesla.root.matrixWorld).applyMatrix4(chargeM);
  const normal = tmpV2.copy(r.port.normal).transformDirection(tesla.root.matrixWorld).transformDirection(chargeM);
  r.rig.plug(pos, normal);
  r.rig.set(1);
  r.port.set(0, 0);
  // Popcorn springt in der Maschine oben auf der Säule – und bei offenem Fenster hinüber ins Auto: durch das Fenster des
  // Wagens in der Bucht (dort steht er beim Popcorn still), im Rahmen der Maschine
  const st = town.plan.items.find((it) => it.name === 'popcorn_post');
  if (st) {
    r.pop = r.pop || buildPopping();
    r.pop.group.position.fromArray(POPPING_AT).applyAxisAngle(UP_AXIS, st.ry).add(tmpV.set(st.x, st.y, st.z));
    r.pop.group.rotation.y = st.ry + POPPING_YAW;
    town.group.add(r.pop.group);
    r.pop.group.updateWorldMatrix(true, false);
    windowAim(tesla.windowOpening(), r.aim).applyMatrix4(tesla.root.matrixWorld).applyMatrix4(chargeM.copy(r.pop.group.matrixWorld).invert());
    r.along.set(0, 0, 1).transformDirection(tesla.root.matrixWorld).transformDirection(chargeM);
  }
  stopPose(c.plan.dock.pose(0, r.q));
  // die Drohne fliegt von dort los, wo sie gerade ist
  r.from.copy(camera.position);
  camera.getWorldDirection(r.fromLook).multiplyScalar(20).add(camera.position);
  r.look.copy(r.fromLook);
  if (stopBtn) stopBtn.classList.remove('show');
  audio.gear('R');
}

/** Wagen der Szene an die Lage q (Ortskoordinaten des Parks): über die Matrix des Parks in die Welt (wie chargePose). */
function stopPose(q) {
  carPos.set(q.x, groundAt(q.x), -q.u).applyMatrix4(stopRun.town.group.matrix);
  carEuler.set(0, -q.yaw, 0, 'YXZ');
  carQuat.setFromEuler(carEuler);
  carMatrix.compose(carPos, carQuat, ONE);
  tesla.root.position.copy(carPos);
  tesla.root.quaternion.copy(carQuat);
  cockpit.root.position.copy(carPos);
  cockpit.root.quaternion.copy(carQuat);
}

/**
 * Nach game.update, vor der Welt: Lage des Wagens, Stecker, Klappe, Popcorn und Klänge für diese Zeit der Szene; ab
 * dem Halt folgt der Spieler dem ausparkenden Wagen. Hat das Spiel den Stopp beendet (Fahrplan zu Ende oder
 * übersprungen), übernimmt der Spieler in der Spur.
 */
function stopTick() {
  const r = stopRun;
  const p = game.player;
  const c = r.c;
  const P = c.plan;
  if (!game.charging) {
    // Übergabe: der Wagen steht da, wo das Ausparken endet, mit dessen Tempo; Stecker im Halter, Klappe zu
    const e = rollPose(P.u, ROLL_T, r.q);
    Object.assign(p, { s: c.sec.s0 + e.u, x: e.x, speed: e.v, wheel: 0, throttle: 0, braking: 0, yaw: 0, vx: 0 });
    r.rig.set(1);
    r.port.set(0, 0);
    tesla.setWindow(0);
    if (r.pop) {
      r.pop.update(0, false);
      r.pop.group.removeFromParent();
    }
    Object.assign(r, { on: false, rev: false, brake: false, gear: 'D', v: e.v });
    if (r.skipT >= 0) {
      r.fadeT = STOP_FADE;
      fxState.fade = 1;
      drone.init = false;
    } else {
      drone.pos.copy(camera.position);
      camera.getWorldDirection(drone.look).multiplyScalar(14).add(camera.position);
      drone.init = true;
    }
    return;
  }
  const t = game.chargeT();
  const te = t - P.at(STOP.unplug);
  const q = t < P.d0 ? P.dock.pose(t - STOP.shift, r.q) : rollPose(P.u, clamp(te - SCENE.roll, 0, ROLL_T), r.q);
  r.v = q.v;
  r.rev = t < P.d0;
  r.gear = r.rev ? 'R' : t < P.roll ? 'P' : 'D';
  // Bremslicht, solange er in R wartet und wenn er vor der Bucht anhält
  r.brake = t < STOP.shift + 0.15 || (t < P.d0 && t > P.d0 - DOCK.down);
  // so zeigen Tacho, Räder, Lenkrad und Motor den Wagen der Szene (vor dem nächsten game.update steht der Spieler wieder)
  p.speed = Math.abs(q.v);
  p.wheel = q.steer / 0.35;
  if (q.u > p.s - c.sec.s0) {
    p.s = c.sec.s0 + q.u;
    p.x = q.x;
  }
  // Stecker: aus dem Halter in die Buchse, nach dem Zeitraffer wie in Erlensee zurück; Klappe und Leuchtring
  const S = SCENE;
  if (te < 0) {
    r.rig.set(1 - clamp((t - P.at(STOP.plug[0])) / (STOP.plug[1] - STOP.plug[0]), 0, 1));
    r.port.set(smoothstep(P.at(STOP.flap[0]), P.at(STOP.flap[1]), t), smoothstep(P.at(STOP.plug[1]) - 0.05, P.at(STOP.plug[1]) + 0.25, t));
  } else {
    r.rig.set((te - S.plug[0]) / (S.plug[1] - S.plug[0]));
    r.port.set(1 - smoothstep(S.flap[0], S.flap[1], te), 1 - smoothstep(S.plug[0], S.plug[0] + 0.15, te));
  }
  // Fürs Popcorn geht das Fahrerfenster herunter (und danach wieder hoch); ist es offen, fliegen Körner hinein
  const win = smoothstep(P.at(STOP.pop[0]) - 0.5, P.at(STOP.pop[0]) + 0.2, t) * (1 - smoothstep(P.at(STOP.pop[1]), P.at(STOP.pop[1]) + 0.6, t));
  tesla.setWindow(win);
  if (r.pop) r.pop.update(t - P.at(STOP.pop[0]), t >= P.at(STOP.pop[0]) && t < P.at(STOP.pop[1]), win > 0.95 ? r.aim : null, r.along);
  // Klick, wenn der Stecker sitzt und wenn er sich löst, der Zirper von P nach D beim Anrollen; Mini Adam hebt beim
  // Bananensaft die Flasche (nicht nachgeholt)
  const once = (k, at, fn) => {
    if (t < at || r.done[k]) return;
    r.done[k] = true;
    if (t < at + 0.3) fn();
  };
  once('in', P.at(STOP.plug[1]), () => audio.unplug());
  once('juice', P.at(STOP.juice), () => adamDo((a) => {
    a.raiseBottle();
    a.setMood('happy', 3);
  }));
  once('out', P.at(STOP.unplug + S.plug[0]), () => audio.unplug());
  once('d', P.roll, () => audio.gear('D'));
  // übersprungen: erst abblenden, dann beendet das Spiel den Stopp (im nächsten Bild die Übergabe)
  if (r.skipT >= 0 && t - r.skipT >= 0.25) game.skipCharge();
}

/** Nach der Welt: Wagen und Kamera dieses Bilds. Ergebnis: { inside (Kamera im Cockpit), wave, look (Mini Adam) }. */
function stopPlace(dt) {
  const r = stopRun;
  const P = r.c.plan;
  const t = game.chargeT();
  const te = t - P.at(STOP.unplug);
  const tb = t - P.d0;
  stopPose(r.q);
  let inside = false;
  let fade = 0;
  if (t < P.d0) {
    // Einparken: im Cockpit bleibt die Kamera dort; die Drohne steigt über die Straße und schaut dem Wagen zu
    if (view === 'cockpit') {
      cockpit.placeCamera(camera, carMatrix, simT, Math.abs(r.v), 0, dt);
      setFov(58);
      inside = true;
    } else {
      const k = smoothstep(0, STOP_DRONE.blend, t);
      const yb = P.u - CHARGE.bay[0] + CHARGE.off;
      const g = r.town.group.matrix;
      tmpV.set(STOP_DRONE.pos[0], STOP_DRONE.pos[1], -(yb + STOP_DRONE.pos[2])).applyMatrix4(g);
      r.cam.lerpVectors(r.from, tmpV, k);
      // Blick zwischen Wagen und Bucht, weich nachgeführt
      tmpV2.set(0, 0.7, 0).applyMatrix4(carMatrix).lerp(tmpV.set(CHARGE.front - CHARGE.bay[1], 0.7, -yb).applyMatrix4(g), STOP_DRONE.bay);
      r.look.lerp(tmpV2, 1 - Math.exp(-dt * 5));
      camera.position.copy(r.cam);
      camera.lookAt(tmpV.lerpVectors(r.fromLook, r.look, k));
      setFov(50);
    }
    if (t > P.d0 - 0.25) fade = (t - (P.d0 - 0.25)) / 0.25;
  } else if (te < 0) {
    // in der Bucht: nah an Buchse, Säule und Popcorn-Stand
    const { pos, look } = lerpKeys(tb, STOP_KEYS);
    camera.position.copy(pos.applyMatrix4(carMatrix));
    camera.lookAt(look.applyMatrix4(carMatrix));
    setFov(44);
    if (tb < STOP_FADE) fade = 1 - tb / STOP_FADE;
  } else {
    // ausparken wie in Erlensee: im Cockpit-Blick am Ende hinein, sonst hinter den Wagen
    const ck = view === 'cockpit';
    inside = placeScene(dt, ck ? CHARGE_KEYS : STOP_ROLL_DRONE, te, ck ? SCENE.inside : Infinity, SCENE.end) === 'inside';
    const sw = SCENE.inside;
    if (ck) fade = te > sw - 0.25 && te < sw ? (te - (sw - 0.25)) / 0.25 : te >= sw && te < sw + STOP_FADE ? 1 - (te - sw) / STOP_FADE : 0;
  }
  fxState.fade = Math.max(fade, r.skipT >= 0 ? (t - r.skipT) / 0.25 : 0);
  r.inside = inside;
  // Mini Adam winkt aus dem Fenster, wenn der Stecker sitzt, und schaut zur Säule, bis er sich löst
  return {
    inside,
    wave: smoothstep(1.2, 1.6, tb) * (1 - smoothstep(2.8, 3.2, tb)),
    look: smoothstep(0.6, 1.4, tb) * (1 - smoothstep(-0.6, 0, te)),
  };
}

// --- BrunnenTV am Navi-Ziel (world/xxl/brunnentv.js TV, Game.startBrunnenTV) ----------------------------------------
// Der Wagen steht neben dem Brunnen, das Spiel läuft weiter und führt die Zeit der Folge (Sätze, Chat, NOMI). Hier
// gehen das Fahrerfenster herunter und wieder hoch, Mini Adam hebt das Megafon (das vom Beifahrersitz, gebaut bei der
// ersten Folge) an den Mund und schaut zum Brunnen, und drei Kameras im Rahmen des Wagens zeigen die Folge (tvShots):
// „Totale“, „Fenster“, „Brunnen“. Von der Drohne gleitet die Kamera in die Totale, aus dem Cockpit wird kurz
// abgeblendet; zurück zur Kamera des Spielers geht es am Ende mit kurzem Abblenden. Überspringen wie beim Ladestopp
// (sceneSkip): jede Taste ab TV.skip, kurz abblenden, dann beendet das Spiel die Folge, und der Spieler fährt los, wo
// er steht (Fenster zu, Megafon zurück).
// tv: game.tv, f: Mitte des Brunnens im Rahmen des Wagens, shots: die drei Kameras, prop: das Megafon in der Hand,
// inside: Kamera im Cockpit, skipT / fadeT: wie beim Ladestopp, from / fromLook: Kamera beim Halt
const tvRun = {
  on: false, tv: null, f: new THREE.Vector3(), shots: null, prop: null, inside: false, skipT: -1, fadeT: 0,
  from: new THREE.Vector3(), fromLook: new THREE.Vector3(), pose: { pos: [0, 0, 0], look: [0, 0, 0] },
};
const tvM = new THREE.Matrix4();
// Route des Abspanns: jede Marke (Folge, Ladestopp) liegt dort, wo das Navi den Wagen gerade zeigt
game.onRouteMark = (m) => {
  if (!xxlNav) return;
  m.x = xxlNav.pose.x;
  m.y = xxlNav.pose.y;
};
// (die Folge steht schon im Album, game.startBrunnenTV: sofort speichern, auch wenn der Stream gleich abbricht)
game.onBrunnenTV = (e) => {
  storeSave(save);
  tvBegin(e);
};

/** Überspringen einer Szene (Ladestopp, BrunnenTV): jede Taste oder Bestätigung, sobald skip Sekunden vorbei sind. */
function sceneSkip(r, t, skip) {
  if (r.skipT < 0 && t > skip && (input.anyKey || input.take('confirm'))) r.skipT = t;
}
// Auf dem Handy zählt dafür auch ein Tipp aufs Bild, in jeder Touch-Bedienung (in „Wischen“ meldet ihn schon die
// Lenkfläche); die Knöpfe liegen darüber und fangen ihren Druck selbst. Ebenso in der Startszene (chargeStep), wo die
// Touch-Bedienung noch gar nicht zu sehen ist
renderer.domElement.addEventListener('pointerdown', () => {
  if (stopRun.on || tvRun.on || state === 'charge') input.anyKey = true;
});

/** Game.onBrunnenTV: Der Wagen steht am Brunnen. Ohne Brunnen der Welt (Prüfstand) läuft der Fahrplan ohne Bild. */
function tvBegin(e) {
  const q = e.fountain;
  if (!q || !q.world) return;
  const r = tvRun;
  updateCarMatrix();
  // Mitte des Brunnens im Rahmen des haltenden Wagens (er steht still, also bleibt sie dort)
  r.f.set(q.world.x, 0, q.world.z).applyMatrix4(tvM.copy(carMatrix).invert());
  r.shots = tvShots({ x: r.f.x, z: r.f.z }, q.r);
  // fürs Standbild: Radius der Insel und Maße des Brunnens (r, h seines Bausteins)
  Object.assign(r, { on: true, tv: e, inside: view === 'cockpit', skipT: -1, fadeT: 0, picDone: false, isl: q.r, fi: q.object ? q.object.userData.info : null });
  r.from.copy(camera.position);
  camera.getWorldDirection(r.fromLook).multiplyScalar(20).add(camera.position);
  if (!r.prop) {
    r.prop = buildHandMegaphone();
    tesla.adam.holdMegaphone(r.prop);
    // die Figur der Facecam hält ihr eigenes (gerades) Megafon: Beide zeigen dasselbe
    facecam.adam.holdMegaphone(buildHandMegaphone({ curved: false }));
  }
  // Mini Adam schaut zum Brunnen (Körperkoordinaten: +x zum Fenster, +z nach vorn)
  adamDo((a) => a.lookAt([-r.f.x, 0.85, -r.f.z], TV.look.off[0]));
}

/** Nach game.update: Ist die Folge vorbei (Fahrplan zu Ende oder übersprungen), übernimmt der Spieler, wo er steht. */
function tvTick() {
  const r = tvRun;
  if (game.tv && game.running && !game.over) {
    if (r.skipT >= 0 && game.brunnenT() - r.skipT >= TV.fade) game.skipBrunnenTV();
    return;
  }
  // endet der Stream mitten in der Folge, bekommt das Album ihr Standbild jetzt (der Wagen steht noch am Brunnen)
  if (r.on && !r.picDone && game.over) {
    r.picDone = true;
    takeAlbumShot(r);
  }
  tvStop();
  if (r.skipT >= 0) {
    r.fadeT = STOP_FADE;
    fxState.fade = 1;
    drone.init = false;
  }
}

/** Fenster zu, Megafon zurück auf den Sitz, Szene aus (auch bei einer neuen Fahrt). */
function tvStop() {
  tvRun.on = false;
  tesla.setWindow(0);
  tesla.seatMegaphone(true);
  if (tvRun.prop) tvRun.prop.visible = false;
}

/** Nach der Welt: Fenster, Megafon und Kamera dieses Bilds. Ergebnis: { inside, look, megafon } für Mini Adam. */
function tvPlace(dt) {
  const r = tvRun;
  const t = game.brunnenT();
  updateCarMatrix();
  tesla.setWindow(windowAt(t));
  const mk = megaphoneAt(t);
  const ck = view === 'cockpit';
  let fade = 0;
  let inside = false;
  const shot = shotAt(t);
  const S = r.shots;
  // hochkant fährt jede Kamera etwas zurück, damit Wagen und Brunnen ins schmale Bild passen (dollyFor)
  const aspect = window.innerWidth / window.innerHeight;
  if (shot === 'totale' && ck && t < TV.fade) {
    // aus dem Cockpit: erst abblenden, dann steht die Totale da
    cockpit.placeCamera(camera, carMatrix, simT, 0, 0, dt);
    setFov(58);
    inside = true;
    fade = t / TV.fade;
  } else if (shot !== 'zurueck') {
    const s = S[shot];
    shotPose(s, t, r.pose, dollyFor(aspect, s.dolly));
    tmpV.fromArray(r.pose.pos).applyMatrix4(carMatrix);
    tmpV2.fromArray(r.pose.look).applyMatrix4(carMatrix);
    if (shot === 'totale' && !ck) {
      // von der Drohne gleitet die Kamera in die Totale
      const k = smoothstep(0, TV.card, t);
      tmpV.lerpVectors(r.from, tmpV, k);
      tmpV2.lerpVectors(r.fromLook, tmpV2, k);
    }
    camera.position.copy(tmpV);
    camera.lookAt(tmpV2);
    setFov(s.fov);
    if (shot === 'totale' && ck) fade = 1 - (t - TV.fade) / TV.fade;
  } else {
    // zurück zur Kamera des Spielers: kurz abblenden, dann steht seine Kamera da (Cockpit oder Drohne hinter dem
    // Wagen) und blendet auf – ein Gleiten von der Brunnen-Kamera vorn zur Drohne hinten führte quer über den Wagen
    const sw = TV.back[0] + TV.fade;
    if (t < sw) {
      shotPose(S.brunnen, TV.back[0], r.pose, dollyFor(aspect, S.brunnen.dolly));
      camera.position.fromArray(r.pose.pos).applyMatrix4(carMatrix);
      camera.lookAt(tmpV2.fromArray(r.pose.look).applyMatrix4(carMatrix));
      setFov(S.brunnen.fov);
      fade = (t - TV.back[0]) / TV.fade;
      drone.init = false;
    } else {
      if (ck) {
        cockpit.placeCamera(camera, carMatrix, simT, 0, 0, dt);
        setFov(58);
        inside = true;
      } else placeDrone(dt, 'follow');
      fade = 1 - (t - sw) / (TV.back[1] - sw);
    }
  }
  fxState.fade = Math.max(clamp(fade, 0, 1), r.skipT >= 0 ? (t - r.skipT) / TV.fade : 0);
  r.inside = inside;
  // das Megafon vom Beifahrersitz ist in seiner Hand
  tesla.seatMegaphone(!tesla.adam.megaphoneShown);
  // das Standbild fürs Album: in der Brunnen-Kamera mit dem Megafon am Fenster – oder sofort, wenn übersprungen wird
  if (!r.picDone && (t >= ALBUM_PIC.t || r.skipT >= 0)) {
    r.picDone = true;
    takeAlbumShot(r);
  }
  return { inside, look: tvLookAt(t), megafon: mk };
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
// Lage der Facecam in diesem Bild (ui.placeFacecam) oder null
let facecamBox = null;
function renderWorld(cam, { cockpitOn, drops }) {
  tesla.root.visible = !cockpitOn;
  // Ist der Wagen von außen zu sehen (Drohne, Titel, Blitzerfoto), stehen seine Wischer wie im Cockpit
  if (!cockpitOn) tesla.setWipers(windshield.angles[0], windshield.angles[1]);
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
  // Innen- und Außenspiegel: immer das Spiegelbild der Straße (die Kofferraum-Kamera zeigt der Mittelbildschirm)
  if (cockpitOn && frameNo % quality.mirrorEvery === 0) {
    // Rückspiegel: Blick nach hinten
    rearCam.position.copy(localToWorld(tmpV2.set(0, 1.32, 0.9)));
    rearCam.lookAt(localToWorld(tmpV2.set(0, 1.05, 40)));
    tesla.root.visible = false;
    renderer.setRenderTarget(mirrorRT);
    renderer.render(scene, rearCam);
  }
  // Rückfahrkamera für den Mittelbildschirm: nur in R und nur mit Cockpit (cockpit.rear.on), in halber Bildrate
  if (cockpitOn && cockpit.rear.on) {
    tesla.root.visible = false;
    cockpit.rear.render(renderer, scene, localToWorld, simT, settings.quality);
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
    // Die rote REC-Lampe der Stream-Kamera blinkte sonst als verwischter roter Fleck durch den halbdurchsichtigen Chat
    const led = cockpit.recLed;
    const r = ui.chatRect;
    if (led.visible && r) {
      led.getWorldPosition(tmpV).project(cockpitCam);
      const x = ((tmpV.x + 1) / 2) * window.innerWidth;
      const y = ((1 - tmpV.y) / 2) * window.innerHeight;
      if (x > r.left - 8 && x < r.right + 8 && y > r.top - 8 && y < r.bottom + 8) led.visible = false;
    }
    renderer.autoClear = false;
    renderer.clearDepth();
    renderer.render(cockpit.scene, cockpitCam);
    postPass();
    // Facecam als Teil des Stream-Overlays über allem (Rahmen aus ui.js); neu gefilmt nur jedes 2. bzw. 3. Bild,
    // in der Pause gar nicht
    const fc = facecamBox;
    if (fc) {
      // (nach einem Zeitsprung – Pause, Test – sofort, damit nie ein altes Bild stehen bleibt)
      const due = !paused && (frameNo % Math.max(2, quality.mirrorEvery) === 0 || Math.abs(simT - facecam.shotT) > 0.3);
      if (!facecam.ready || due) {
        if (sideOn()) renderSide();
        facecam.render(renderer, fc, settings.quality === 'auto' ? 'hoch' : settings.quality);
        facecam.shotT = simT;
      }
      facecam.draw(renderer, fc, { alpha: fc.alpha, glitch: U.uGlitch.value, t: simT });
    }
    renderer.autoClear = true;
  }
}

/** Seitenfenster der Facecam: die Welt links neben dem Wagen, vom Kopf des Fahrers aus (ohne den eigenen Wagen). */
function renderSide() {
  sideCam.position.copy(localToWorld(tmpV2.set(EYE.x, EYE.y, EYE.z)));
  sideCam.lookAt(localToWorld(tmpV2.set(EYE.x - 30, EYE.y - 1.6, EYE.z)));
  tesla.root.visible = false;
  const clear = renderer.autoClear;
  renderer.autoClear = true;
  renderer.setRenderTarget(sideRT);
  renderer.render(scene, sideCam);
  renderer.setRenderTarget(null);
  renderer.autoClear = clear;
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

/**
 * Standbild einer BrunnenTV-Folge fürs Album: reihum nach der Nummer der Folge von vorn, dreiviertel (die Brunnen-Kamera
 * der Folge mit Wagen und Mini Adam am Fenster), tief oder vom Auto aus (brunnentv.js stillShot) zur Sekunde
 * ALBUM_PIC.t, immer 16:9 (wie beim Blitzerfoto verzerrt gerendert und beim Verkleinern entzerrt), ohne
 * Abblenden; als WebP (sonst JPEG) unter eigenem Schlüssel gespeichert (save.js storePicture). Passt es nicht, zeigt
 * das Album für diese Folge eine gezeichnete Karte.
 */
function takeAlbumShot(r) {
  const t0 = performance.now();
  const P = ALBUM_PIC;
  if (!albumCam) {
    albumCam = new THREE.PerspectiveCamera(46, P.w / P.h, camera.near, camera.far);
    albumCanvas = document.createElement('canvas');
    albumCanvas.width = P.w;
    albumCanvas.height = P.h;
  }
  const pose = stillShot({ x: r.f.x, z: r.f.z }, r.isl, r.fi, r.tv.n);
  albumCam.fov = pose.fov;
  albumCam.updateProjectionMatrix();
  albumCam.position.fromArray(pose.pos).applyMatrix4(carMatrix);
  albumCam.lookAt(tmpV2.fromArray(pose.look).applyMatrix4(carMatrix));
  const fade = U.uFade.value;
  U.uFade.value = 0;
  renderWorld(albumCam, { cockpitOn: false, drops: false });
  U.uFade.value = fade;
  const ctx = albumCanvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(renderer.domElement, 0, 0, renderer.domElement.width, renderer.domElement.height, 0, 0, P.w, P.h);
  let url = null;
  try {
    for (const q of P.q) {
      url = albumCanvas.toDataURL('image/webp', q);
      if (!url.startsWith('data:image/webp')) url = albumCanvas.toDataURL('image/jpeg', q);
      if (url.length <= PIC_MAX) break;
    }
  } catch (e) {
    url = null;
  }
  // gespeichert wird, sobald der Browser Luft hat (alle Bilder lesen und schreiben kostet ein paar ms); bis dahin null
  const shot = { n: r.tv.n, pose: pose.kind, chars: url ? url.length : 0, type: url ? url.slice(5, url.indexOf(';')) : null, stored: url ? null : false, ms: Math.round(performance.now() - t0) };
  albumLast = shot;
  if (!url) return;
  const keep = () => (shot.stored = storePicture(shot.n, url));
  if (window.requestIdleCallback) requestIdleCallback(keep, { timeout: 1500 });
  else setTimeout(keep, 0);
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
    // der rechte Stick scrollt lange Karten (der Abspann dankt jedem mit Namen)
    const ry = pd.axes[3] || 0;
    if (active && Math.abs(ry) > 0.25) menus.scroll(Math.sign(ry) * (Math.abs(ry) - 0.25) * 24);
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
  const mapOpen = menus.current === 'karte'; // die große Karte deckt alles zu: dahinter kein 3D-Bild
  step(dt, { render: !mapOpen });
  if (!mapOpen) adaptResolution(dt);
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
  let adamMegafon = 0;
  // „Wir sind live.“ nach Mini Adams Gruß, NOMIs Gruß, wenn das Sprachstudio ausgeredet hat (auch erst nach der Übergabe)
  if (simT >= chargeRun.liveT) chargeLive();
  if (simT >= chargeRun.greetT) chargeGreet();

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
      // (ohne Ladepark – den hat Erlensee immer – steht der Wagen am Start, die Kamera kreist um ihn)
      if (chargeRun.parked) chargeTitle();
      else {
        updateCarMatrix();
        placeDrone(dt, 'orbit');
      }
      adamWave = smoothstep(0.72, 0.9, Math.sin(simT * 0.5));
      adamLook = Math.sin(simT * 0.4) * 0.6;
      break;
    }
    case 'charge': {
      const c = chargeStep(dt);
      cockpitOn = c.inside;
      adamWave = c.wave;
      adamLook = c.look;
      break;
    }
    case 'drive': {
      if (paused) {
        // im Ladestopp bleiben Wagen und Kamera, wie die Szene sie zuletzt gestellt hat
        if (stopRun.on) {
          stopPose(stopRun.q);
          cockpitOn = stopRun.inside;
          break;
        }
        // in der BrunnenTV-Folge ebenso (die Kamera steht, wo sie war)
        if (tvRun.on) {
          updateCarMatrix();
          cockpitOn = tvRun.inside;
          break;
        }
        updateCarMatrix();
        if (view === 'cockpit') cockpit.placeCamera(camera, carMatrix, simT, 0, 0, 0);
        cockpitOn = view === 'cockpit';
        break;
      }
      if (input.take('pause')) {
        pause();
        break;
      }
      for (const r of [stopRun, tvRun]) {
        if (r.fadeT <= 0) continue;
        // nach dem Überspringen des Ladestopps oder der BrunnenTV-Folge blendet das Bild wieder auf
        r.fadeT = Math.max(0, r.fadeT - dt);
        fxState.fade = r.fadeT / STOP_FADE;
      }
      if (stopRun.on) {
        // Ladestopp: jede Taste überspringt ihn (wie die Startszene); das Spiel läuft weiter, der Spieler steht an
        // seinem Halt (Wagen und Kamera stellt stopPlace nach der Welt)
        sceneSkip(stopRun, game.chargeT(), SCENE.skip);
        STOP_CTL.device = input.lastDevice;
        p.speed = 0;
        game.update(dt, STOP_CTL, camera);
        stopTick();
        if (stopRun.on) break;
        // übergeben: der Wagen steht in der Spur, wo das Ausparken endet; ab dem nächsten Bild fährt der Spieler
        updateCarMatrix();
        if (view === 'cockpit') {
          cockpit.placeCamera(camera, carMatrix, simT, p.speed, 0, dt);
          setFov(58);
          cockpitOn = true;
        } else placeDrone(dt, 'follow');
        break;
      }
      if (tvRun.on) {
        // BrunnenTV: Der Wagen steht am Brunnen, jede Taste überspringt die Folge (wie den Ladestopp); Fenster, Megafon
        // und Kamera stellt tvPlace nach der Welt
        sceneSkip(tvRun, game.brunnenT(), TV.skip);
        STOP_CTL.device = input.lastDevice;
        p.speed = 0;
        game.update(dt, STOP_CTL, camera);
        tvTick();
        if (tvRun.on) break;
        // vorbei: ab dem nächsten Bild fährt der Spieler, die Kamera ist schon seine
        updateCarMatrix();
        if (view === 'cockpit') {
          cockpit.placeCamera(camera, carMatrix, simT, 0, 0, dt);
          setFov(58);
          cockpitOn = true;
        } else placeDrone(dt, 'follow');
        break;
      }
      const camKey = input.take('camera');
      if (camKey) {
        view = view === 'cockpit' ? 'drone' : 'cockpit';
        drone.init = false;
        ui.cameraLabel(view === 'cockpit' ? '🎥 Cockpit' : '🎥 Drohne');
      }
      ctl = {
        // Lenktasten mit Zeitstempel (steerLog) und Tastenstand am Bildende, Stick/Touch-Zug, Wisch-Spurwechsel
        steer: input.steer,
        steerKey: input.steerKey,
        steerLog: input.steerLog,
        analog: input.analog,
        lane: input.lane,
        throttle: input.throttle,
        brake: input.brake,
        // nur diese Steuerung (die eigenen Eingaben des Spielers) darf den Rückwärtsgang einlegen
        reverse: true,
        horn: input.take('horn'),
        wiper: input.take('wiper'),
        megafon: input.take('megafon'),
        ladestopp: input.take('ladestopp'),
        brunnen: input.take('brunnen'),
        device: input.lastDevice,
        // Krümmung und Steigung unter dem Wagen aus dem Kurs (courseEnv); auf dem Prüfstand (?debug) lässt sich
        // stattdessen eine Probe einhängen: __MA.kappaProbe(s), __MA.gradeProbe(s)
        kappa: DEBUG && window.__MA && window.__MA.kappaProbe ? window.__MA.kappaProbe(p.s) : courseEnv.kappa,
        grade: DEBUG && window.__MA && window.__MA.gradeProbe ? window.__MA.gradeProbe(p.s) : courseEnv.grade,
      };
      if (DEBUG && window.__MA.xxl && window.__MA.xxl.auto) xxlAuto(p, ctl);
      game.update(dt, ctl, camera);
      if (stopBtn) stopBtn.classList.toggle('show', game.stopOffer());
      wayBtn.classList.toggle('show', game.wayHint);
      driveHintTick(dt, ctl);
      tipsTick(dt, ctl, camKey);
      // Leitplanke: der Kopf ruckt zur Planke hin, Gamepad und Handy rütteln kurz
      for (const e of p.events) {
        if (e.type !== 'rail') continue;
        jolt.hit(e.side < 0 ? 'left' : 'right', e.hard ? 0.5 : 0.3);
        input.rumble(e.hard ? 0.6 : 0.3, e.hard ? 140 : 80);
      }
      chassis.update(dt, p.latAcc, p.firm);
      updateCarMatrix();
      updateLookAhead(dt, p);
      jolt.update(dt);
      if (view === 'cockpit') {
        cockpit.placeCamera(camera, carMatrix, simT, p.speed, chassis, dt, p.yaw * CHASSIS.gaze);
        camera.rotateOnWorldAxis(UP_AXIS, lookAhead.yaw * 0.5);
        camera.rotateOnAxis(RIGHT_AXIS, lookAhead.pitch * 0.45);
        jolt.apply(camera, carMatrix);
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
      chassis.update(dt, p.latAcc, p.firm);
      updateCarMatrix();
      placeDrone(dt, 'orbit');
      adamWave = smoothstep(0.9, 1.5, stateT);
      adamLook = Math.sin(stateT * 0.5) * 0.8;
      if (state === 'ending' && stateT > 2.6) {
        state = 'over';
        ui.show(false);
        menus.show('over', { ...lastOver, pics: loadPictures() });
      }
      break;
    }
    default:
      break;
  }

  // --- Welt aktualisieren -------------------------------------------------------
  const s = p.s;
  const w = game.weather ? game.weather.level : 0;
  // der Himmel zieht schon vor dem Schauer zu und klart erst danach auf
  const cloud = Math.max(w, game.weather ? game.weather.sky || 0 : 0);
  const frozen = paused;
  if (!frozen) {
    // zuerst die Fahrt fortschreiben (trip.update) – der Kurs liest gleich danach, welchen Weg sie nimmt
    xxlStep(p, w, dt);
    // Ladestopp: Wagen und Kamera der Szene im Rahmen des Parks, wie ihn xxlStep eben gestellt hat
    if (stopRun.on) {
      const a = stopPlace(dt);
      cockpitOn = a.inside;
      adamWave = a.wave;
      adamLook = a.look;
    }
    // BrunnenTV: Fenster, Megafon und Kamera der Folge
    if (tvRun.on) {
      const a = tvPlace(dt);
      cockpitOn = a.inside;
      adamLook = a.look;
      adamMegafon = a.megafon;
    }
    // Verlauf der Straße in die Tabelle des Shaders; Prüfstand (?debug): flache Welt, damit Bausteine unverzerrt
    // begutachtet werden können
    if (DEBUG && window.__MA && window.__MA.flat) {
      curveTable.flat();
      courseEnv.kappa = courseEnv.grade = 0;
      sky.turn(0);
    } else {
      if (courseTick) courseTick(s, dt);
      const st = course.fill(courseTrip, s, curveTable, dt);
      courseEnv.kappa = st.kappa;
      courseEnv.grade = st.grade;
      sky.turn(st.psi);
      skyView.mapX = st.mapX;
      skyView.mapZ = st.mapZ;
    }
    curveTable.commit(renderer);
    // die Hügelkette am Horizont steigt und sinkt mit der Straße, wo sie im Dunst verschwindet
    skyView.hillY = clamp(curveAt(1500).y * 0.7, -90, 90);
    cockpit.scene.environmentRotation.copy(sky.envRotation);
    const L = game.left || { glow: 0 };
    road.update(s, dt, simT, L.glow || 0, L.open && L.timer < 10 ? 1 : 0);
    curveSigns.update(course, s, xxlSignShear);
    road.setWet(w);
    scenery.update(s, dt);
    sky.setOvercast(cloud * 0.95);
    rain.update(dt, simT, { speed: p.speed, s, camX: camera.position.x, intensity: w });
    tesla.update(dt, stopRun.on ? stopRun.v : p.v, p.wheel, simT); // rückwärts drehen die Räder rückwärts
    teslaDamage.update(dt, simT, p.damage, p.speed);
    cabinDamage.update(dt, simT, p.damage, p.speed, cockpitOn);
    // (am Supercharger, im Titel und in der Startszene, steht der Wagen beim Laden in P: ohne Bremslicht; beim Ladestopp
    // leuchtet es, solange er in R wartet und wenn er vor der Bucht anhält)
    tesla.setBrake(stopRun.on ? stopRun.brake : state !== 'charge' && !(state === 'title' && chargeRun.parked) && (p.braking > 0.1 || p.speed < 1));
    tesla.setReverse(p.gear === 'R' || stopRun.rev);
    const adamOpts = adamFrame(dt, { steer: p.wheel, wave: adamWave, look: adamLook, megafon: adamMegafon });
    tesla.adam.animate(simT, adamOpts);
    facecam.adam.animate(simT, adamOpts);
    facecam.update({ t: simT, dt, steer: p.wheel, overcast: cloud, speed: p.speed, shake: cockpit.shake, rain: w, world: sideOn() });
    tesla.cabinLight.intensity = cockpitOn ? 0 : stopRun.on || tvRun.on || state === 'title' || state === 'charge' || state === 'ending' || state === 'over' ? 3.2 : 0.9;
    tesla.setGroundShade(w);
    windshield.update(dt, { speed: p.speed, camera, carMatrix });
    const scr = game.screenState ? safeScreen() : null;
    // Ladestopp: das Display zeigt den Gang des Wagens der Szene (in R mit dem Bild der Rückfahrkamera)
    if (scr && stopRun.on) scr.gear = stopRun.gear;
    if (scr && tvRun.on) scr.gear = 'P';
    if (scr) scr.trunk = fxState.trunk;
    if (scr) {
      // Karte, Route, Ansage und Ziel des Mittelbildschirms kommen aus der Fahrt der Welt (COMMON.md §9)
      xxlScreenNav.model = xxlNav;
      xxlScreenNav.bidder = scr.navi.bidder;
      xxlScreenNav.bid = scr.navi.bid;
      xxlScreenNav.bar = scr.navi.bar;
      xxlScreenNav.wait = scr.navi.wait;
      xxlScreenNav.clockMin = game.clock;
      xxlScreenNav.visible = cockpitOn;
      scr.nav = xxlScreenNav;
      // die Spuransicht daneben zeigt den Querschnitt, auf dem der Wagen fährt (Rampe, Landstraße, Ort), und die
      // gesperrte linke Spur samt Verkehr nur auf der Autobahn
      xxlScreenRoad.lanes = xxlLimits.lanes;
      xxlScreenRoad.extraLane = xxlLimits.extraLane;
      xxlScreenRoad.autobahn = !game.offAutobahn;
      scr.road = xxlScreenRoad;
      scr.nav.visited = save.visits;
      if ((mapHudT -= dt) <= 0) {
        mapHudT = 0.25;
        turnIns = state === 'drive' ? scr.nav.model.instruction() : null;
        ui.setTurn(turnIns);
      }
    }
    cockpit.update({
      dt, t: simT, steer: p.wheel, latAcc: p.latAccSm, wiperAngles: windshield.angles, wiperFlex: windshield.flex,
      sunDir: sky.sunDir, overcast: cloud, adam: adamOpts, gesture: tesla.adam.pose === 'drive' ? tesla.adam.gestures : null,
      screen: scr, radar: game.radarAlarm, rear: cockpitOn && (p.gear === 'R' || stopRun.rev),
    });
    if (fxState.trunk > 0) fxState.trunk = Math.max(0, fxState.trunk - dt);
  }
  sky.update(frozen ? 0 : dt, camera, s, simT, skyView);
  audio.update(dt, {
    speed: p.speed, throttle: p.throttle, rain: w, sirenLevel: game.sirenLevel || 0, inCabin: cockpitOn, paused: frozen || state === 'over',
    // Quietschen an der Haftgrenze; Klappern wächst mit den verbrauchten Karosserie-Punkten (0 … 3)
    squeal: state === 'drive' ? p.squeal : 0, rattle: state === 'drive' ? (3 * p.hits) / p.maxHits : 0,
  });

  // Effekte
  cockpit.shake = Math.max(0, cockpit.shake - dt * 1.6);
  fxState.flash = Math.max(0, fxState.flash - dt * 3.5);
  fxState.glitch = Math.max(0, fxState.glitch - dt);
  fxState.green = Math.max(0, fxState.green - dt);
  U.uTime.value = simT;
  U.uFlash.value = fxState.flash;
  U.uGlitch.value = fxState.glitch > 0 ? 0.6 + 0.4 * Math.sin(simT * 40) : 0;
  U.uGreen.value = fxState.green > 0 ? (Math.sin(simT * 26) > 0.2 ? 1 : 0.15) : 0;
  U.uFade.value = state === 'charge' || stopRun.on || stopRun.fadeT > 0 || tvRun.on || tvRun.fadeT > 0 ? clamp(fxState.fade, 0, 1) : 0;
  U.uSat.value = 1.08 - cloud * 0.25;

  if (DEBUG && window.__MA && window.__MA.camHook) window.__MA.camHook(camera, carMatrix);
  document.body.classList.toggle('playing', state === 'drive' && !paused);
  document.body.classList.toggle('drone', view === 'drone');
  // Facecam-Rahmen vor dem Rendern setzen, damit Bild und Rahmen im selben Bild an derselben Stelle sind
  facecamBox = ui.placeFacecam(paused ? 0 : dt, state === 'drive' && cockpitOn);
  if (render) renderFrame(cockpitOn);
  // in der Pause bleiben Banner, Geld-Anzeigen und Funkloch stehen
  ui.update(paused ? 0 : dt, state === 'drive' || state === 'charge' ? game : null, cockpit.screen.live ? cockpit.screen.kmh : null);
  input.endFrame();
}

function safeScreen() {
  try {
    return game.running || game.over ? game.screenState() : idleScreen();
  } catch (e) {
    return idleScreen();
  }
}

/** Mittelbildschirm ohne laufenden Stream (Titel): Navi ohne Gebot, Akku voll. */
function idleScreen() {
  const p = game.player;
  return {
    dark: false, battery: 100, speedKmh: p.kmh, limit: null, playerX: p.x, leftLane: 0, cars: traffic.nearby(p, 125), s: p.s,
    navi: game.navi.screen(), clock: '18:00', temp: 17, funkloch: 0, wiperOn: false,
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

// --- XXL-Welt ------------------------------------------------------------------
const xxlLimits = { left: 0, right: 0, shoulder: 0, lanes: null, extraLane: null, vmax: Infinity, decel: 0, slack: 0, closing: 0 };
let xxlTrafficFrame = null;
// Navi der XXL-Fahrt (src/map/navroute.js): Lage auf der Karte, Route und Ansage, alles aus xxl.trip; je Fahrt ein Modell
let xxlNav = null;
// was der Mittelbildschirm davon bekommt (st.nav, src/map/navview.js): Bieter und Gebot im roten Balken kommen vom
// Spiel (WorldNavi.screen), ohne Gebot dessen Texte für Balken (bar) und Kärtchen (wait); die Uhr ist die Reisezeit
// (Game.travelStep), in der navview.js die Ankunft rechnet
const xxlScreenNav = { model: null, bidder: '', bid: '', bar: '', wait: '', clockMin: 0, visible: false, visited: null };
// und von der Straße für die Spuransicht (st.road, src/cockpit/screen.js)
const xxlScreenRoad = { lanes: null, extraLane: null, autobahn: true };
/** Neue Fahrt (Erlensee) bzw. Titel: der Titel fährt gleich auf der ersten Autobahn (die Kamera kreist dort). */
function xxlStart(title) {
  const p = game.player;
  xxl.reset();
  // am Navi-Ziel bleibt der Wagen am Brunnen stehen, bis das Spiel ihn weiterfahren lässt (BrunnenTV)
  xxl.arrival.hold = !title;
  courseTrip = xxl.trip;
  xxlNav = new NavModel(xxl.trip);
  traffic.reset();
  pickups.reset();
  xxlTrafficFrame = null;
  // die Fahrt beginnt am Supercharger in Erlensee: Dort wartet der Wagen schon im Titel
  const atCharger = title && !!chargeOf(xxl.trip.section);
  chargeRun.parked = false;
  stopRun.on = false;
  stopRun.fadeT = 0;
  tvStop();
  tvRun.fadeT = 0;
  p.x = xxl.trip.x;
  p.speed = title ? 0 : 40 / 3.6;
  xxl.update(p.s, p.x, 0);
  xxlNav.update(0);
  p.setLimits(xxl.limitsFor(xxlLimits));
  scenery.reset();
  if (atCharger) chargeRun.parked = chargePlug();
}
/**
 * Kurvenschilder der XXL-Fahrt stehen im Rahmen ihres Abschnitts: dessen Scherung für dieses Bild, oder null, solange
 * der Abschnitt nicht gezeichnet wird (eine Autobahn nur als die eine sichtbare, alles andere nach trip.visible).
 * Ohne das stünden die Tafeln einer Kurve hinter der Ausfahrt am Rand der Autobahn, bis man abgebogen ist.
 */
function xxlSignShear(sec, path) {
  if (sec.kind === 'ab') {
    const v = xxl.view;
    if (!v || v.frame !== sec.frame) return null;
  } else if (!path || !xxl.trip.visible(sec, path)) return null; // ohne Weg: längst zurückgelassen
  return xxl.shear.get(sec.frame) || null;
}
/** Einmal pro Bild nach der Bewegung: Strecke und Navi fortschreiben, Grenzen setzen, Verkehr und Sammelsachen einordnen. */
function xxlStep(p, w, dt) {
  xxl.update(p.s, p.x, w, p.speed, simT);
  xxlNav.update(dt);
  p.setLimits(xxl.limitsFor(xxlLimits));
  const v = xxl.view;
  const frame = v ? v.frame : null;
  traffic.end = xxl.abEnd;
  traffic.begin = xxl.abBegin;
  if (frame !== xxlTrafficFrame) {
    // eine andere Autobahn (im Wald gewechselt): ihr Verkehr beginnt neu, die Szenerie wird neu gebaut
    xxlTrafficFrame = frame;
    traffic.reset();
    pickups.reset();
    scenery.reset();
    if (v && v.role === 'ahead') traffic.populate(p.s, p.speed);
  } else if (xxl.zonesChanged) scenery.invalidate(p.s + 1300);
  xxl.zonesChanged = false;
  const sh = v ? xxl.shear.get(v.frame) : null;
  traffic.shear = sh || null;
  traffic.passive = !v || v.role !== 'cur';
  traffic.group.visible = !!sh && !xxl.maskAutobahn;
  traffic.placeAll(p.s);
  if (sh) pickups.applyShear(sh, p.s);
  pickups.group.visible = traffic.group.visible;
  game.offAutobahn = !v || v.role !== 'cur';
}
/** Autopilot zum Prüfen (?debug, __MA.xxl.auto): folgt dem Navi, hält Spur und Tempo, lenkt in den Kurven mit. */
function xxlAuto(p, ctl) {
  let k = 0;
  for (let d = 0; d <= AUTO.ahead; d += 20) k = Math.max(k, Math.abs(curveAt(d).k));
  autoDrive(ctl, p, autoTarget(xxl.trip, xxl.choice), xxlLimits.vmax, k);
}

function boot() {
  applyCosmetics();
  applyDrive();
  game.startTitle();
  xxlStart(true);
  // Ein paar Bilder vorab rendern (Shader kompilieren), dann Titel zeigen
  updateCarMatrix();
  placeDrone(0.016, 'orbit');
  try {
    renderer.compile(scene, camera);
    renderer.compile(cockpit.scene, camera);
    renderer.compile(facecam.scene, facecam.camera);
    renderer.compile(facecam.quadScene, facecam.quadCam);
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
    game, traffic, scenery, cockpit, windshield, tesla, ui, menus, input, renderer, camera, save, facecam, adamMood,
    // die freie Sicht und die Plätze der Einblendungen (tools/sicht-check.js misst das HUD dagegen)
    sicht,
    // für Prüfstände: Szene, three.js und die Weltmaterial-Fabrik (siehe curve.js)
    scene, THREE, W, sky, road,
    // der eine Stadtbaukasten des Spiels (die XXL-Welt baut ihre Orte daraus), auch für Prüfstände
    get city() {
      return cityKit();
    },
    get state() {
      return state;
    },
    // der Ladestopp im Park (stopBegin … stopTick): on, c (game.charging), q (Lage des Wagens), skipT
    get stop() {
      return stopRun;
    },
    // die Tipps der ersten Minuten (first-tips.js): Prüfbilder ohne Tipps rufen vor dem Losfahren __MA.tips.stop()
    get tips() {
      return firstTips;
    },
    /** BrunnenTV-Folge: Szene (tvRun) und Zustand für Prüfbilder: Zeit, Kamera, Fenster, Megafon. */
    get tv() {
      const t = game.brunnenT();
      return { on: tvRun.on, t: +t.toFixed(2), shot: tvRun.on ? shotAt(t) : null, window: +windowAt(t).toFixed(2), megafon: tesla.adam.megaphoneShown, seat: !tesla.adam.megaphoneShown, skipT: tvRun.skipT, game: game.tv ? { n: game.tv.n, goal: game.tv.goal, said: game.tv.said } : null, released: !xxl.arrival.held };
    },
    /** BrunnenTV-Album: Folgen im Spielstand, gespeicherte Bilder, zuletzt aufgenommenes Standbild. */
    get album() {
      const a = save.album || { n: 0, list: [] };
      return { n: a.n, list: a.list.length, last: a.list.length ? a.list[a.list.length - 1] : null, pics: loadPictures().size, shot: albumLast };
    },
    set view(v) {
      view = v;
    },
    start: () => startRun(),
    // die Startszene überspringen
    skipIntro: () => {
      if (state === 'charge') stateT = SCENE.end;
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
      game.weather.next = v;
      game.weather.dur = 999;
      windshield.setRain(v);
    },
    pause: () => pause(),
    resume: () => resume(),
    // Kurven (src/game/course.js): Zustand ansehen, Kurs wählen ('endless' | 'probe'), an eine Stelle springen
    course: {
      get inst() {
        return course;
      },
      table: curveTable,
      at: curveAt,
      marks: PROBE_MARKS,
      get state() {
        return course.state;
      },
      mode(m, s) {
        course.mode = m;
        course.resetVirtual(m);
        if (s !== undefined) teleport(s);
      },
      teleport: (s) => teleport(s),
      drive(c, trip, tick) {
        course = c;
        courseTrip = trip;
        courseTick = tick;
      },
      bends(dMax = 3000) {
        const out = [];
        const s = game.player.s;
        course.eachBend((s0, s1, k, t, kind) => {
          if (s1 > s && s0 < s + dMax) out.push({ d0: Math.round(s0 - s), d1: Math.round(s1 - s), R: Math.round(1 / Math.abs(k)), dir: k > 0 ? 'links' : 'rechts', kind });
        });
        return out;
      },
    },
  };
  installDebug(window.__MA, xxl, () => game.player, {
    afterWarp: () => { traffic.reset(); pickups.reset(); scenery.reset(); },
    // ein Sprung plant den Kurs unterwegs wie eine Fahrt mit 30 m/s (ohne die Tabelle des Shaders zu schreiben)
    eachStep: (s, step) => course.fill(xxl.trip, s, null, step / 30),
  });
  window.__MA.kit = { ...window.__MA.kit, nature: createNatureKit(W) };
}

/** Prüfstand: den Spieler an die Stelle s setzen (Verkehr, Sammelsachen und Landschaft neu). */
function teleport(sNew) {
  const p = game.player;
  p.s = sNew;
  traffic.populate(sNew, p.speed);
  pickups.reset();
  game.navi.reset?.(sNew);
  scenery.update(sNew, 0);
}

boot();
