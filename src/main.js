// Mini Adam – Navi ferngesteuert BrunnenTV XXL
// Hauptprogramm: Renderer, Bildkomposition (Welt → Regentropfen/Effekte → Cockpit), Kameras
// (Cockpit, Drohne, Szenen), Zustände und Menüs.
import * as THREE from 'three';
import { W, curveTable, curveAt, curveOffset } from './curve.js';
import { Course, MapPlanner, PROBE_MARKS } from './game/course.js';
import * as mapGraph from './map/graph.js';
import * as mapShapes from './map/shapes.js';
import { sectionWater } from './map/crossings.js';
import { setMaxAnisotropy } from './textures.js';
import { Road } from './world/road.js';
import { XxlWorld, ROAD_OPTS, autoTarget, autoDrive, AUTO } from './world/xxl/world.js';
import { installDebug } from './world/xxl/debug.js';
import { Gegenverkehr } from './world/xxl/gegenverkehr.js';
import { camerasAlong } from './world/xxl/blitzer.js';
import { Sky } from './world/sky.js';
import { Scenery } from './world/scenery.js';
import { CurveSigns, gridBusy, profileLayout } from './world/kit/curvesigns.js';
import { createNatureKit } from './world/kit/nature.js';
import { cityKit, naviLayout } from './world/xxl/towns.js';
import { SCENE, chargeOf } from './world/xxl/charge.js';
import { squareOf } from './world/xxl/plan.js';
import { shotAt, windowAt, stillShot, STILL } from './world/xxl/brunnentv.js';
import { PopStand, POP_STAND } from './world/xxl/popstand.js';
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
import { loadSave, storeSave, resetSave, refundMegafon, megafonNoteSeen, storePicture, loadPictures, PIC_MAX, settleStream, settlePending } from './save.js';
import { Game } from './game/game.js';
import { Radio } from './radio.js';
import { WAVE, walkerToWave } from './game/wave.js';
import { Chassis, CHASSIS } from './game/chassis.js';
import { Pickups } from './game/pickups.js';
import { UI } from './ui/ui.js';
import * as sicht from './ui/sicht.js';
import { Menus } from './ui/menus.js';
import { bindFullscreenKey, onFullscreenChange } from './ui/fullscreen.js';
import { SHOP, UPGRADE_LIMITS, shopPrice, canBuy } from './data.js';
import { NavModel } from './map/navroute.js';
import { loadLandscape } from './map/landscape.js';
import { skyline } from './map/skyline.js';
import { nextStart, startNode } from './game/starts.js';
import { setRoadAhead, setTownLayout, setBridgeReach, setBandReach } from './map/roadahead.js';
import { recordVisit } from './ui/mapscreen.js';
import { albumBadges } from './ui/album.js';
import { thinLine } from './ui/routemap.js';
import { clamp, easeInOut, mulberry32 } from './util.js';
import { ORBIT, createOrbitCam } from './camera/orbit.js';
import { setSceneContext } from './scenes/context.js';
import { chargeRun, chargePlug, chargeBegin, chargeTitle, chargeStep, streamStart, liveOff, chargeGreet } from './scenes/start.js';
import { STOP_CTL, STOP_FADE, stopRun, stopPose, stopTick, stopPlace, hookStop } from './scenes/stop.js';
import { tvRun, sceneSkip, tvTick, tvStop, tvPlace, tvHorn, hookTv } from './scenes/tv.js';

// Ladezeit: Marken für die Messung (performance.mark ma:…, zu lesen mit performance.getEntriesByType('mark')): alle
// Module ausgewertet
performance.mark('ma:main');

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
// Endete die Seite zuletzt mitten im Stream (Tab zu, Absturz, Handy-Akku), bucht der Start ihn jetzt: Der Titel sagt bis
// zur nächsten Fahrt, was er gebracht hat (save.streamNote)
const recovered = settlePending(save);
if (megafonBack || recovered) storeSave(save);
// Startort des nächsten Streams (game/starts.js): nie der vom letzten Mal; im Titel wartet der Wagen schon dort
let startId = nextStart(save.start);
let shopRefund = 0;
let mapHudT = 0; // die Navi-Zeile des HUD folgt der Fahrt viermal je Sekunde
let turnIns = null; // ihre letzte Ansage (NavModel.instruction), auch für die Tipps der ersten Minuten

// ---------------------------------------------------------------------------
const app = document.getElementById('app');
const loadingEl = document.getElementById('loading');
let settings = save.settings;
let tempoFeel = true; // Tempo-Gefühl aus den Fahr-Einstellungen (applyDrive, speedFov)

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
// Grafikkarte zurückgesetzt (Treiber, Energiesparen, zu viele Tabs): three.js wartet auf den neuen Kontext und lädt
// danach alles von selbst wieder hoch. Bis dahin bleibt das Bild stehen – also hält das Spiel an, statt blind
// weiterzufahren; weiter geht es wie nach jeder Pause.
renderer.domElement.addEventListener('webglcontextlost', () => pause());
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
// Gegenverkehr auf Orts- und Landstraßen (eigener kleiner Vorrat und eigener Zufall, gesetzt wie der Verkehr: xxlStep)
const gegen = new Gegenverkehr(scene, { rnd: mulberry32(1121) });
const pickups = new Pickups(scene);
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
// Über Wasser der Karte führt die Straße auf einer Brücke (map/crossings.js): dort gerade und eben
let course = new Course({ planner: new MapPlanner({ graph: mapGraph, shapes: mapShapes, water: sectionWater }) });
let courseTrip = null;
let courseTick = null;
// die Straße voraus des Navis: der Verlauf, den die Welt zeichnet (preview reicht 4 km weit)
setRoadAhead((trip, s, dMax) => course.preview(trip, s, Math.min(dMax, 4000)));
// und die Orte der Welt in seiner Nahansicht: Brunnenplatz und Zielbrunnen dort, wo die Welt sie baut
setTownLayout((trip, sec) => naviLayout(sec, xxl.town(sec)));
// und das Wasser unter den Brücken so weit, wie die Welt es gerade zeigt
setBridgeReach((key) => xxl.bridges.reachOf(key));
setBandReach((key) => xxl.bands.reachOf(key));
// Kurvenschilder rücken von Möbeln am Rand weg: vom Raster der Landschaft und von Blitzern, Tempo-Schildern und
// Elsa, die das Spiel dort bestellt hat
const EDGE_REQUESTS = new Set(['blitzer', 'speed', 'elsa']);
const curveSigns = new CurveSigns(scene, {
  // am Rand des Querschnitts, den der Abschnitt hat (zweispurige Straßen sind schmaler als die Autobahn)
  layout: profileLayout,
  busy(s) {
    if (gridBusy(s)) return true;
    for (const r of scenery.requests) if (EDGE_REQUESTS.has(r.type) && Math.abs(r.s - s) < 8) return true;
    // und von den Blitzern auf Landstraßen und in Orten (world/xxl/blitzer.js)
    return courseTrip ? camerasAlong(courseTrip.cur.sections, s - 8, s + 8).length > 0 : false;
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
// (in „Auto“ schaltet adaptResolution es auf langsamen Geräten ab, bevor das Bild unschärfer wird)
const sideOn = () => settings.quality !== 'niedrig' && !(quality.auto && autoLevel >= 2);
// Popcorn-Stand der Ladeszene (world/xxl/popstand.js): Nach der Szene geht er nur, wo ihn keine der Kameras sieht, die
// gerade Welt zeigen – die Hauptkamera, mit Cockpit der Rückspiegel (auch in der Heckscheibe der Facecam), ihr
// Seitenfenster und in R die Rückfahrkamera
const popStand = new PopStand();
const STAND_CAMS = [{ cam: camera, far: 0 }, { cam: null, far: POP_STAND.far }, { cam: null, far: POP_STAND.far }, { cam: null, far: 0 }];
function standCams(cockpitOn) {
  STAND_CAMS[1].cam = cockpitOn ? rearCam : null;
  STAND_CAMS[2].cam = cockpitOn && sideOn() ? sideCam : null;
  STAND_CAMS[3].cam = (cockpitOn && cockpit.rear.on && cockpit.rear.cam) || null;
  return STAND_CAMS;
}
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
// das Autoradio (src/radio.js): zuerst aus, Taste R oder der Knopf in der Pause schaltet weiter
const radio = new Radio();
audio.enabled = settings.sound;
audio.volume = settings.volume;
const speech = new Speech();
speech.enabled = settings.speech;
const input = new Input();
const ui = new UI(app);
// jedes neue Bild des Mittelbildschirms auch ins Kärtchen der Drohnenansicht (solange es zu sehen ist)
cockpit.screen.onDraw = (c, navi) => ui.droneHud.copy(c, navi);
ui.setChat(settings.chat);
ui.setFacecam(settings.facecam !== false);

// Touch-Knöpfe (nur auf Geräten mit Touchscreen sichtbar)
const touchEl = document.createElement('div');
touchEl.className = 'touch';
// Lenken, Bremse und Strom kommen aus src/ui/touch.js (Daumen-Zug oder Lenkknöpfe), die Knöpfe am Rand aus dessen
// Liste TOUCH_BUTTONS: „Ladestopp einplanen“ (wie Taste L) ist zu sehen, wenn der Akku halb leer ist oder OMI gewarnt
// hat, und heißt „Jetzt laden“, solange der Wagen neben einer Ladesäule oder Bucht steht (Akku.chargeOffer); „BrunnenTV
// hier“ (wie Taste B), solange der Wagen neben einem Brunnen auf dem Weg steht (Game.wayOffer)
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
/** Der Knopf der Taste L sagt, was er gerade tut: neben einer Säule oder Bucht „Jetzt laden“, sonst „Ladestopp einplanen“. */
let stopNow = false;
function stopLabel(now) {
  if (!stopBtn || now === stopNow) return;
  stopNow = now;
  const t = TOUCH_BUTTONS.find((b) => b.action === 'ladestopp');
  const label = now ? t.now : t.label;
  stopBtn.setAttribute('aria-label', label);
  stopBtn.lastChild.textContent = ' ' + label;
}
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
  noticeBusy: () => ui.noticeBusy(),
  naviNews: () => ui.naviNews(),
  nomi: (t, d) => ui.nomi(t, d),
  naviDurchsage: (t, d) => ui.naviDurchsage(t, d),
  studio: (t, d) => ui.studio(t, d),
  money: (a, l) => ui.money(a, l),
  durchsage: (l, t, d, b) => ui.durchsage(l, t, d, b),
  megafon: (t, d, b, l) => ui.megafon(t, d, b, l),
  rahmen: (r, b) => ui.rahmen(r, b),
  funkloch: (on) => ui.funkloch(on),
  damage: () => ui.damage(),
  jobs: (j) => ui.jobs(j),
  jobDone: (text) => ui.jobDone(text),
  wette: (row) => ui.wette(row),
  photo: (kmh, clock, limit) => {
    photoRequest = { kmh, clock, limit };
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
  // Laden ohne Plan: der Ladeplatz neben dem Wagen (Tempo v) und Taste L dort (plan.js Arrival.chargeSpot, charge)
  chargeSpot: (v) => xxl.arrival.chargeSpot(xxl.trip, v),
  charge: (v) => xxl.arrival.charge(xxl.trip, v),
  // die Bezahlschranke eines Orts (gags.js, world/xxl/schranke.js): 0 zu … 1 offen
  gate: (sec, k) => xxl.towns.gate(sec, k),
  // Blitz an den Blitzern im Ort und auf der Landstraße (world/xxl/blitzer.js, gebaut von signs.js)
  flashCamera: (on) => xxl.signs.flashCameras(on),
};
// (touchUI: Auf Handy und Tablet zeigt das Bild die Touch-Knöpfe – von Anfang an, nicht erst nach dem ersten Tipp)
const game = new Game({ traffic, scenery, windshield, cockpit, audio, speech, ui: uiFacade, fx, pickups, world: gameWorld, touchUI: IS_TOUCH });
// Mini Adams Gruß zu Beginn kommt von hier (streamStart): Der Chat grüßt erst danach zurück (Game.greet)
game.greetFirst = true;
// die Memes greifen im Spiel selbst auch in Gebote, Geld und Stimmen ein (memes.js live; in den Prüfständen nur Chat)
game.memes.live = true;
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
// dem Chat (Mund im Silbentakt, Blick in die Kamera) und hört zu, solange OMI oder eine Sprachdurchsage spricht.
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
/** In die Kamera schauen; so lange zieht ihn auch OMI nicht weg. */
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
function adamMood(name, k = 1, o = null) {
  adamCtl.quiet = 0;
  switch (name) {
    case 'wave': {
      // winken, nur aus den Anlässen der Regel (game/wave.js: Intro, Fußgänger am Gehweg, „Wink mal!“ im Chat, nach
      // einem Rempler): in die Kamera schauen und „Hallo!“ – zum Fußgänger hin (o.look) still; k < 1 ist der kleine,
      // verlegene Gruß nach einem Rempler. Die offene Hand zeigt die Handfläche dem, den er grüßt
      const small = k < 1;
      const look = o && o.look;
      adamDo((a) => {
        a.gesture('wave', k, look || 'camera');
        a.setMood('happy', small ? 1.6 : 2.4, small ? 0.3 : 0.6);
        if (look) a.lookAt(look, 2.2);
      });
      if (!look) adamToCamera(small ? 1.8 : 2.6);
      if (!look && !small) adamSay(1.6, 0.5);
      break;
    }
    case 'donation':
      // kurz aufs Handy mit dem Chat, lächeln, nicken (wenn er wieder aufschaut), bedanken – der Arm bleibt unten, auch
      // bei großen Spenden (game/wave.js: in der Fahrt geht er nur zum Winken hoch)
      adamDo((a) => {
        a.lookAt('chat', 1.1);
        a.setMood('happy', 1.4 + 1.6 * k, 0.45 + 0.55 * k);
        a.setMood('nod', undefined, 0.5 + 0.5 * k, 1.1);
      });
      adamSay(1.2 + k, 1.2);
      break;
    case 'cheer':
      // Ziel erreicht: er hüpft vor Freude auf dem Sitz, beide Hände bleiben am Lenkrad
      adamDo((a) => a.setMood('joy', 3, k));
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
// haarscharf überholt (Game.onNearMiss): ein kurzer Impuls am Gamepad oder Handy
game.onFeel = (k, ms) => input.rumble(k, ms);

// Fußgänger auf dem Gehweg eines Orts: alle 0,25 s nachsehen, ob gleich einer vorbeizieht – dann winkt Mini Adam ihm
// zu (zum Gehweg hin geschaut), einmal je Durchfahrt, frühestens WAVE.cool Sekunden nach dem letzten Gruß und nur im
// Schritttempo (game/wave.js)
let walkerT = 0;
function waveAtWalkers(dt, p) {
  walkerT -= dt;
  if (walkerT > 0) return;
  walkerT = 0.25;
  const sec = xxl.trip.section;
  if (!sec || sec.kind !== 'stadt') return;
  const town = xxl.town(sec);
  const who = town && town.plan ? walkerToWave(game.waves, game.t, p.speed, town.plan.items, p.s - sec.s0, sec) : null;
  if (who) game.waveAt('gehsteig', { look: who.side > 0 ? 'side' : 'window', passage: sec });
}

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
// Vollbild beendet ohne Knopf und F (Esc, Zurück-Geste, Leiste des Browsers): Mitten in der Fahrt hält das Spiel an –
// Esc ist hier die Pause-Taste, und das Bild springt gerade in seine neue Größe. Knopf und F wechseln ohne Pause.
onFullscreenChange(({ on, own }) => {
  if (!on && !own) pause();
});
const menus = new Menus(app, {
  click: () => {
    audio.init();
    audio.click();
  },
  action: (a, b) => {
    if (a === 'start' || a === 'restart') startRun();
    else if (a === 'resume') resume();
    else if (a === 'quit') {
      paused = false;
      menus.hide();
      game.end('quit');
    } else if (a === 'menu') toTitle();
    else if (a === 'radio') {
      radioCycle();
      if (b) b.textContent = radioButtonLabel();
    }
  },
  back: () => {},
  radioLabel: () => radioButtonLabel(),
  dataFor: (name, data) => {
    if (name === 'shop' && save.megafonNote) {
      shopRefund = megafonNoteSeen(save);
      storeSave(save);
    }
    if (name === 'shop') return { wallet: save.wallet, upgrades: save.upgrades, refund: shopRefund };
    if (name === 'settings') return { ...settings, speechSupported: speech.supported };
    if (name === 'title') return save;
    if (name === 'pause') return game;
    if (name === 'karte') return { save, nav: xxlNav, odo: paused ? game.odometer : null, home: startId };
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
    const price = shopPrice(it, lvl);
    // im Minus ist der Shop zu (data.js canBuy), sonst reicht das Guthaben für den Preis oder nicht
    if (!canBuy(save.wallet, price)) {
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
  tempoFeel = ds.tempoFeel;
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
    autoLevel = 0;
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
  liveOff();
  cockpit.shake = 0;
  view = 'cockpit';
  ui.show(false);
  speech.stopAll();
  game.startTitle();
  startId = nextStart(save.start);
  xxlStart(true);
  applyCosmetics();
  menus.hide();
  menus.show('title', save);
}

/** Läuft gerade ein Stream (Fahrt oder Startszene), der noch nicht abgerechnet ist? */
const streamOpen = () => (state === 'drive' || state === 'charge') && game.running && !game.over;

/**
 * Zwischenstand des laufenden Streams in den Spielstand (Game.interim): alle INTERIM_EVERY Sekunden und beim Verlassen
 * der Seite. Endet die Seite, bevor der Stream abgerechnet ist, bucht ihn der nächste Start (settlePending).
 */
const INTERIM_EVERY = 15;
let interimT = INTERIM_EVERY;
function storeInterim() {
  if (!streamOpen()) return;
  interimT = INTERIM_EVERY;
  save.pending = game.interim();
  storeSave(save);
}

function startRun() {
  performance.mark('ma:start');
  audio.init();
  // „Neustart“ aus der Pause: Der laufende Stream wird abgerechnet wie beim Beenden (Einnahmen und Schäden zählen)
  if (streamOpen()) settleStream(save, game.interim());
  save.streamNote = null;
  // der Stream beginnt im Startort, den der Titel zeigt (nach einem Neustart aus der Pause im nächsten)
  startId = nextStart(save.start);
  save.start = startId;
  storeSave(save);
  interimT = INTERIM_EVERY;
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
  // jede Fahrt beginnt mit der Startszene im Ladepark des Startorts (ohne Ladepark gleich am Steuer)
  Object.assign(chargeRun, { hello: false, said: false, waveT: -1, greetT: Infinity });
  chargeRun.id++;
  state = 'charge';
  if (!chargeBegin()) toDrive();
  // die Taste, die „Losfahren“ ausgelöst hat, soll die Startszene nicht gleich überspringen
  input.endFrame();
  performance.mark('ma:started');
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
  // Guthaben, Rekord (Reisemeter) und Statistik; der Zwischenstand des Streams ist damit erledigt (save.js)
  const { newRecord } = settleStream(save, { money: o.money, distance: o.distance, peakViewers: o.peakViewers, naviReached: o.stats.naviReached, crashes: o.stats.crashes });
  storeSave(save);
  if (newRecord) adamMood('proud');
  // zur Route des Streams der gefahrene Weg des Navis (Kartenpunkte, ausgedünnt) und der Startort, für die Karte im
  // Abspann
  const route = { ...o.route, line: thinLine(xxlNav.trail, 3000), home: xxl.trip.home };
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
// Ziel und Blickpunkt der Drohne in diesem Bild (placeDrone) und die Kamera einer Szene (lerpKeys): ohne neue Vektoren je Bild
const droneAim = { pos: new THREE.Vector3(), look: new THREE.Vector3() };
const keyCam = { pos: new THREE.Vector3(), look: new THREE.Vector3() };
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

/**
 * Tempo-Gefühl (Einstellung „Tempo-Gefühl“): Ab from km/h weitet sich der Blick im Cockpit langsam um bis zu add Grad
 * (voll ab full km/h) – so wirkt 230 schneller als 130. Weich nachgeführt (tau s), damit Bremsen nicht ruckt.
 */
export const TEMPO_FOV = { from: 150, full: 240, add: 6, tau: 0.6 };
let fovAdd = 0;
function speedFov(kmh, dt) {
  const T = TEMPO_FOV;
  const want = tempoFeel ? clamp((kmh - T.from) / (T.full - T.from), 0, 1) ** 1.5 * T.add : 0;
  fovAdd += (want - fovAdd) * (1 - Math.exp(-dt / T.tau));
  return fovAdd;
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

const orbitCam = createOrbitCam(traffic);
const orbit = orbitCam.state;

function placeDrone(dt, mode) {
  const p = game.player;
  let pos;
  let look;
  if (mode === 'orbit') {
    pos = orbitCam.target(p, dt, stateT, !drone.init);
    look = droneAim.look.set(0, 0.9, 0).applyMatrix4(carMatrix);
  } else {
    // hinter dem Wagen, mit dem halben Gierwinkel geschwenkt und kaum versetzt: Sie bleibt eng am Wagen, statt ihn bei
    // jedem Spurwechsel quer durchs Bild gleiten zu lassen (Fahrwerk)
    droneQuat.setFromAxisAngle(UP_AXIS, -p.yaw * CHASSIS.droneYaw);
    droneMatrix.compose(carPos, droneQuat, ONE);
    pos = droneAim.pos.set(-p.vx * CHASSIS.lag, 3.3, 9.2).applyMatrix4(droneMatrix);
    look = droneAim.look.set(0, 1.0, -14).applyMatrix4(droneMatrix);
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
    orbitCam.lift(drone.pos, p);
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
  // (die Vektoren gelten bis zum nächsten Aufruf)
  if (t > b.t) {
    keyCam.pos.fromArray(b.pos);
    keyCam.look.fromArray(b.look);
    return keyCam;
  }
  const k = easeInOut(clamp((t - a.t) / (b.t - a.t), 0, 1));
  keyCam.pos.fromArray(a.pos).lerp(tmpV2.fromArray(b.pos), k);
  keyCam.look.fromArray(a.look).lerp(tmpV2.fromArray(b.look), k);
  return keyCam;
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

/**
 * Was die Tipps der ersten Minuten vor sich sehen (first-tips.js): fountain – der Brunnen eines Orts auf dem Weg (nicht
 * der des Ziels, dort beginnt die Folge von selbst) liegt höchstens TIP_SEE.brunnen Meter voraus; post – die Ladesäule
 * eines Orts höchstens TIP_SEE.post Meter (ihr Schild steht 100 m davor).
 */
const TIP_SEE = { brunnen: 250, post: 160 };
const tipSeen = { fountain: false, post: false };
function tipSights() {
  const T = xxl.trip;
  tipSeen.fountain = tipSeen.post = false;
  for (const c of T.cur.sections) {
    if (c.s0 > T.s + TIP_SEE.brunnen) break;
    if (c.s1 < T.s || c.kind !== 'stadt' || c.start) continue;
    const q = c.place !== T.target ? squareOf(c) : null;
    if (q && q.s > T.s && q.s - T.s <= TIP_SEE.brunnen) tipSeen.fountain = true;
    const at = c.postS !== undefined && !c.charged ? c.s0 + chargeOf(c).u - T.s : -1;
    if (at > 0 && at <= TIP_SEE.post) tipSeen.post = true;
  }
  return tipSeen;
}

/** Jedes Bild der Fahrt: Tipps der ersten Minuten (camera: V in diesem Bild; ctl: die übrigen Eingaben). */
function tipsTick(dt, ctl, camera) {
  if (firstTips.done && !firstTips.cur) return;
  const p = game.player;
  // frei: kein Halt am Brunnen oder an der Säule, keine Folge, und „So steuerst du“ hat den Platz geräumt
  const free = !game.charging && !game.tv && !game.navi.stopping && !driveHintBusy();
  if (free) tipT += dt;
  if (camera) firstTips.did('camera');
  if (ctl.megafon) firstTips.did('megafon');
  if (ctl.ladestopp) firstTips.did('ladestopp');
  if (ctl.brunnen) firstTips.did('brunnen');
  if (firstTips.cur && input.take('confirm')) tipsOff();
  const ins = turnIns;
  const see = firstTips.seen.has('brunnen') && firstTips.seen.has('laden') ? tipSeen : tipSights();
  const ev = firstTips.update(dt, {
    free,
    t: tipT,
    // die Ansage nennt ab dem 1000-m-Schild eine Ausfahrt, die noch nicht zu nah ist
    exit: !!ins && ins.turn === 'exit' && !ins.calm && ins.dist > 250,
    carAhead: !firstTips.seen.has('megafon') && slowCarAhead(p),
    stop: game.akku.stopOffer(),
    // B: der erste Brunnen auf dem Weg kommt in Sicht (oder der Wagen steht schon daneben)
    fountain: see.fountain || game.wayHint,
    // L: die erste Ladesäule kommt in Sicht, der Wagen steht neben einer (oder OMI warnt: stop)
    post: see.post || game.akku.hint,
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
  // ohne Startszene (übersprungen, ehe „Wir sind live.“ kam, oder kein Ladepark): der Beginn des Streams jetzt
  if (!chargeRun.hello) streamStart();
  // die Facecam geht an: Hat er seinen Gruß in der Startszene gesagt, ohne draußen zu winken (er kam erst, als die
  // Kamera schon ins Cockpit ging), winkt er jetzt hinein; sonst winkt er, sobald sein Gruß beginnt (streamStart)
  if (chargeRun.said && chargeRun.waveT < 0) game.waveAt('intro');
  // die Tipps der ersten Minuten zählen ab hier (first-tips.js); keiner steht noch vom letzten Stream
  firstTips.restart();
  tipT = 0;
  // beim ersten Start auf diesem Gerät „So steuerst du“, danach der kurze Tipp
  if (!showDriveHint(ui, input.lastDevice, driveSettings(settings))) {
    ui.toast(matchMedia('(pointer: coarse)').matches ? 'Tipp: ◀ ▶ lenken · Strom und Bremse rechts · 🎥 Kamera' : 'Tipp: ← → lenken · ↑ Strom · ↓ Bremse · V Kamera', 'info');
  }
}

// --- Szenen: Startszene, Ladestopp, BrunnenTV (src/scenes/) -------------------------------------------------------
// Sie lesen und bewegen Wagen, Kameras und Spielzustand von hier; was sie davon brauchen, steht in diesem Kontext.
setSceneContext({
  get ALBUM_PIC() {
    return ALBUM_PIC;
  },
  get ONE() {
    return ONE;
  },
  get UP_AXIS() {
    return UP_AXIS;
  },
  get adamDo() {
    return adamDo;
  },
  get audio() {
    return audio;
  },
  get camera() {
    return camera;
  },
  get carEuler() {
    return carEuler;
  },
  get carMatrix() {
    return carMatrix;
  },
  get carPos() {
    return carPos;
  },
  get carQuat() {
    return carQuat;
  },
  get cockpit() {
    return cockpit;
  },
  get drone() {
    return drone;
  },
  get facecam() {
    return facecam;
  },
  get fxState() {
    return fxState;
  },
  get game() {
    return game;
  },
  get input() {
    return input;
  },
  get lerpKeys() {
    return lerpKeys;
  },
  get placeDrone() {
    return placeDrone;
  },
  get placeScene() {
    return placeScene;
  },
  get popStand() {
    return popStand;
  },
  get renderer() {
    return renderer;
  },
  get save() {
    return save;
  },
  get setFov() {
    return setFov;
  },
  get simT() {
    return simT;
  },
  get speech() {
    return speech;
  },
  get state() {
    return state;
  },
  get stateT() {
    return stateT;
  },
  get stopBtn() {
    return stopBtn;
  },
  get takeAlbumShot() {
    return takeAlbumShot;
  },
  get tesla() {
    return tesla;
  },
  get tmpV() {
    return tmpV;
  },
  get tmpV2() {
    return tmpV2;
  },
  get toDrive() {
    return toDrive;
  },
  get ui() {
    return ui;
  },
  get updateCarMatrix() {
    return updateCarMatrix;
  },
  get view() {
    return view;
  },
  get xxl() {
    return xxl;
  },
  get xxlNav() {
    return xxlNav;
  },
  get xxlStart() {
    return xxlStart;
  },
  set stateT(v) {
    stateT = v;
  },
});
hookStop();
hookTv();

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

/**
 * Qualität „Auto“: Wird das Bild zu langsam (unter 45 Bildern je Sekunde), spart das Spiel zuerst, wo man es kaum sieht
 * – die Welt im Rückspiegel nur jedes zweite, dann jedes dritte Bild (AUTO_MIRROR) und das Seitenfenster der Facecam
 * gemalt statt gefilmt (sideOn) –, und erst danach an der Schärfe des ganzen Bilds (pixelRatio). Läuft es wieder
 * flüssig (über 75 je Sekunde), kommt alles in umgekehrter Reihenfolge zurück.
 */
const AUTO_MIRROR = [1, 2, 3];
let autoLevel = 0;
const mirrorEvery = () => (quality.auto ? AUTO_MIRROR[autoLevel] : quality.mirrorEvery);
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
  if (avg > 1 / 45) {
    if (autoLevel < AUTO_MIRROR.length - 1) {
      autoLevel++;
      perf.cool = 1.5;
    } else if (pixelRatio > 0.55) {
      pixelRatio = Math.max(0.55, pixelRatio - 0.12);
      perf.cool = 1.5;
      onResize();
    }
  } else if (avg < 1 / 75) {
    if (pixelRatio < maxPR) {
      pixelRatio = Math.min(maxPR, pixelRatio + 0.06);
      perf.cool = 3;
      onResize();
    } else if (autoLevel > 0) {
      autoLevel--;
      perf.cool = 3;
    }
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
  if (cockpitOn && frameNo % mirrorEvery() === 0) {
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
      const due = !paused && (frameNo % Math.max(2, mirrorEvery()) === 0 || Math.abs(simT - facecam.shotT) > 0.3);
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

/** Blitzerfoto: der Tesla von vorne, Mini Adam hinterm Steuer, im Blitzlicht (limit: das Tempolimit am Blitzer). */
function takePhoto({ kmh, clock, limit = 120 }) {
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
  photoCtx.fillText(`${kmh} km/h   ${clock}   ERLAUBT ${limit}`, 10, 260);
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
  // OMIs Gruß, wenn Mini Adam ausgeredet hat (auch erst nach der Übergabe)
  if (simT >= chargeRun.greetT) chargeGreet();

  if (input.take('mute')) {
    settings.sound = !settings.sound;
    applySettings('sound');
    storeSave(save);
    ui.toast(settings.sound ? '🔊 Ton an' : '🔇 Ton aus', 'info');
    menus.refresh('settings');
  }
  if (input.take('radio')) radioCycle();
  if (input.take('chat')) {
    settings.chat = !settings.chat;
    applySettings('chat');
    storeSave(save);
    menus.refresh('settings');
  }

  switch (state) {
    case 'title': {
      // (ohne Ladepark – den hat jeder Startort – steht der Wagen am Start, die Kamera kreist um ihn)
      if (chargeRun.parked) chargeTitle();
      else {
        updateCarMatrix();
        placeDrone(dt, 'orbit');
      }
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
      if (stopRun.fadeT > 0) {
        // nach dem Überspringen des Ladestopps blendet das Bild wieder auf (die BrunnenTV-Folge endet nie übersprungen)
        stopRun.fadeT = Math.max(0, stopRun.fadeT - dt);
        fxState.fade = stopRun.fadeT / STOP_FADE;
      }
      if (stopRun.on) {
        // Ladestopp: jede Taste überspringt ihn (wie die Startszene); das Spiel läuft weiter, der Spieler steht an
        // seinem Halt (Wagen und Kamera stellt stopPlace nach der Welt)
        sceneSkip(stopRun, game.akku.sceneT(), SCENE.skip);
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
        // BrunnenTV: Der Wagen steht am Brunnen, bis die Folge vorbei ist – keine Taste überspringt sie (brunnentv.js);
        // Fenster, Megafon und Kamera stellt tvPlace nach der Welt
        STOP_CTL.device = input.lastDevice;
        p.speed = 0;
        game.update(dt, STOP_CTL, camera);
        // Wo ist Walte? Hupen, wenn er im Bild ist (die Hupe selbst bleibt in der Folge stumm)
        if (input.take('horn')) tvHorn();
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
        // der Chat zählt die Zooms mit (Memes: der Zoom-Zähler)
        game.memes.zoom();
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
      // der Autopilot hält das Tempolimit, der Spieler darf schneller (Player.lawful)
      p.lawful = !!(DEBUG && window.__MA.xxl && window.__MA.xxl.auto);
      if (p.lawful) xxlAuto(p, ctl);
      game.update(dt, ctl, camera);
      if ((interimT -= dt) <= 0) storeInterim();
      waveAtWalkers(dt, p);
      if (stopBtn) {
        stopBtn.classList.toggle('show', game.akku.stopOffer());
        stopLabel(game.akku.hint);
      }
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
        setFov(58 + speedFov(p.kmh, dt));
        cockpitOn = true;
      } else placeDrone(dt, 'follow');
      if (game.over) {
        state = 'ending';
        stateT = 0;
        liveOff();
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
      adamLook = Math.sin(stateT * 0.5) * 0.8;
      // nach dem letzten Rempler (Werkstatt) der kleine, verlegene Gruß (game/wave.js); sonst winkt er im Abspann nicht
      if (state === 'ending' && game.over && game.over.reason === 'werkstatt' && stateT >= WAVE.afterCrash && stateT - dt < WAVE.afterCrash) game.waveAt('unfall');
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
      // Prüfstand: Blickrichtung des Horizonts festhalten (__MA.horizonAt)
      sky.turn(DEBUG && window.__MA && window.__MA.skyPsi != null ? window.__MA.skyPsi : st.psi);
      skyView.mapX = st.mapX;
      skyView.mapZ = st.mapZ;
    }
    curveTable.commit(renderer);
    // der Popcorn-Stand geht nach der Ladeszene nur, wo keine Kamera hinsieht (Kamera und Krümmung stehen jetzt)
    popStand.tick(standCams(cockpitOn));
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
    // Tacho und Navi-Karte der Drohnenansicht (ui/drone-hud.js): der Mittelbildschirm zeichnet dafür weiter, und jedes
    // neue Bild landet dort (onDraw) – im Cockpit, in Szenen und außerhalb der Fahrt ist das Kärtchen aus
    const droneHudOn = state === 'drive' && view === 'drone' && !cockpitOn && !stopRun.on && !tvRun.on;
    ui.droneHud.show(droneHudOn);
    cockpit.screen.hudOut = ui.droneHud.on;
    // den Zustand des Mittelbildschirms nur bauen, wenn er in diesem Bild zeichnet (höchstens 15-mal je Sekunde)
    const scr = game.screenState && cockpit.screen.due(dt, cockpitOn) ? safeScreen() : null;
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
    }
    if ((mapHudT -= dt) <= 0) {
      mapHudT = 0.25;
      turnIns = state === 'drive' ? xxlNav.instruction() : null;
      ui.setTurn(turnIns);
    }
    cockpit.update({
      dt, t: simT, steer: p.wheel, latAcc: p.latAccSm, wiperAngles: windshield.angles, wiperFlex: windshield.flex,
      sunDir: sky.sunDir, overcast: cloud, adam: adamOpts, gesture: tesla.adam.pose === 'drive' ? tesla.adam.gestures : null,
      screen: scr, radar: game.radarAlarm, rear: cockpitOn && (p.gear === 'R' || stopRun.rev), visible: cockpitOn,
    });
    if (fxState.trunk > 0) fxState.trunk = Math.max(0, fxState.trunk - dt);
  }
  sky.update(frozen ? 0 : dt, camera, s, simT, skyView);
  // (leiser, solange OMI oder das Sprachstudio sprechen oder BrunnenTV läuft; ohne Ton stumm)
  radio.update(dt, { sound: settings.sound, duck: game.t < game.voiceUntil || !!game.tv, gain: settings.radioVolume * settings.volume });
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
  U.uFade.value = state === 'charge' || stopRun.on || stopRun.fadeT > 0 || tvRun.on ? clamp(fxState.fade, 0, 1) : 0;
  U.uSat.value = 1.08 - cloud * 0.25;

  if (DEBUG && window.__MA && window.__MA.camHook) window.__MA.camHook(camera, carMatrix);
  document.body.classList.toggle('playing', state === 'drive' && !paused);
  document.body.classList.toggle('drone', view === 'drone');
  // Facecam-Rahmen vor dem Rendern setzen, damit Bild und Rahmen im selben Bild an derselben Stelle sind
  facecamBox = ui.placeFacecam(paused ? 0 : dt, state === 'drive' && cockpitOn);
  if (render) renderFrame(cockpitOn);
  // in der Pause bleiben Banner, Geld-Anzeigen und Funkloch stehen
  ui.update(paused ? 0 : dt, state === 'drive' || state === 'charge' ? game : null, cockpit.screen.live || cockpit.screen.hudOut ? cockpit.screen.kmh : null);
  input.endFrame();
}

function safeScreen() {
  let st;
  try {
    st = game.running || game.over ? game.screenState() : idleScreen();
  } catch (e) {
    st = idleScreen();
  }
  // (das Radio gehört zum Wagen, nicht zur Fahrt: oben in der Leiste, solange es an ist)
  st.radio = radio.label;
  return st;
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
    radio.hold(true);
    storeInterim();
  } else {
    audio.resume();
    radio.hold(false);
  }
});
// (pagehide kommt auch dort, wo die Seite ohne visibilitychange endet, etwa beim Neuladen)
window.addEventListener('pagehide', storeInterim);

// --- XXL-Welt ------------------------------------------------------------------
const xxlLimits = { left: 0, right: 0, shoulder: 0, lanes: null, extraLane: null, vmax: Infinity, decel: 0, hold: Infinity, holdDecel: 0, posted: 0, slack: 0, closing: 0 };
let xxlTrafficFrame = null;
// Navi der XXL-Fahrt (src/map/navroute.js): Lage auf der Karte, Route und Ansage, alles aus xxl.trip; je Fahrt ein Modell
let xxlNav = null;
// was der Mittelbildschirm davon bekommt (st.nav, src/map/navview.js): Bieter und Gebot im roten Balken kommen vom
// Spiel (WorldNavi.screen), ohne Gebot dessen Texte für Balken (bar) und Kärtchen (wait); die Uhr ist die Reisezeit
// (Game.travelStep), in der navview.js die Ankunft rechnet
const xxlScreenNav = { model: null, bidder: '', bid: '', bar: '', wait: '', clockMin: 0, visible: false, visited: null };
// und von der Straße für die Spuransicht (st.road, src/cockpit/screen.js)
const xxlScreenRoad = { lanes: null, extraLane: null, autobahn: true };
/** Neue Fahrt bzw. Titel im Startort startId (game/starts.js): im Titel wartet der Wagen schon in dessen Ladepark. */
function xxlStart(title) {
  const p = game.player;
  xxl.reset(startNode(startId));
  // am Navi-Ziel bleibt der Wagen am Brunnen stehen, bis das Spiel ihn weiterfahren lässt (BrunnenTV)
  xxl.arrival.hold = !title;
  courseTrip = xxl.trip;
  xxlNav = new NavModel(xxl.trip);
  traffic.reset();
  gegen.reset();
  pickups.reset();
  xxlTrafficFrame = null;
  // die Fahrt beginnt im Ladepark des Startorts (die erste am Supercharger in Erlensee): Dort wartet der Wagen schon im Titel
  const atCharger = title && !!chargeOf(xxl.trip.section);
  chargeRun.parked = false;
  stopRun.on = false;
  stopRun.fadeT = 0;
  popStand.reset();
  tvStop();
  p.x = xxl.trip.x;
  p.speed = title ? 0 : 40 / 3.6;
  xxl.update(p.s, p.x, 0);
  xxlNav.update(0);
  xxlHorizon(true);
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
// Horizont der Gegend (map/skyline.js): neu gerechnet, sobald der Wagen ein Stück weiter ist (Kartenmaß), der Himmel
// führt die Hügelketten dann in einigen Sekunden weich in die neue Form
const HORIZON = { km: 2.5, n: 180 };
const horizonAt = { x: NaN, y: NaN };
function xxlHorizon(snap = false) {
  if (DEBUG && window.__MA && window.__MA.skyPsi != null) return;
  const P = xxlNav.pose;
  const kpu = 111.32 * Math.cos(2 * Math.atan(Math.exp((-P.y * Math.PI) / 180)) - Math.PI / 2);
  if (!snap && Math.hypot(P.x - horizonAt.x, P.y - horizonAt.y) * kpu < HORIZON.km) return;
  const sk = skyline(P.x, P.y, HORIZON.n);
  if (!sk) return;
  horizonAt.x = P.x;
  horizonAt.y = P.y;
  sky.setSkyline(sk, snap);
}
/** Einmal pro Bild nach der Bewegung: Strecke und Navi fortschreiben, Grenzen setzen, Verkehr und Sammelsachen einordnen. */
function xxlStep(p, w, dt) {
  xxl.update(p.s, p.x, w, p.speed, simT);
  xxlNav.update(dt);
  xxlHorizon();
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
    game.dropRoadside();
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
  // Gegenverkehr abseits der Autobahn: Ein Rempler zählt nur im Spiel (wer in die Gegenspur gerät, Game.onCrash)
  const gev = gegen.update(dt, xxl.trip, p, xxl.shear, simT);
  if (state === 'drive' && game.running) for (const e of gev) if (e.type === 'crash') game.onCrash(e);
}
/** Autopilot zum Prüfen (?debug, __MA.xxl.auto): folgt dem Navi, hält Spur und Tempo, lenkt in den Kurven mit. */
function xxlAuto(p, ctl) {
  let k = 0;
  for (let d = 0; d <= AUTO.ahead; d += 20) k = Math.max(k, Math.abs(curveAt(d).k));
  // (in einer Baustelle mitten durch die Gasse und mit ihren 80: game/baustelle.js)
  autoDrive(ctl, p, game.bau.steer(autoTarget(xxl.trip, xxl.choice), p.s), Math.min(xxlLimits.vmax, game.bau.zoneLimit(p.s)), k);
}

/** Start: Welt der Titelfahrt, Shader, Titel (die Marken ma:… messen die Ladezeit). */
function boot() {
  performance.mark('ma:init');
  applyCosmetics();
  applyDrive();
  game.startTitle();
  xxlStart(true);
  performance.mark('ma:world');
  // Ein paar Bilder vorab rendern (Shader kompilieren), dann Titel zeigen
  updateCarMatrix();
  placeDrone(0.016, 'orbit');
  // compile geht auch an unsichtbaren Teilen vorbei (Schadensbild, Wölkchen); nur was erst später entsteht, muss
  // hier kurz da sein: das offene Fahrerfenster (eigenes Programm, BrunnenTV) und der Vorpass der nassen Scheibe
  tesla.setWindow(0.01);
  // was nicht an jedem Ladepark des Titels liegt (die Karte entscheidet, ob dort Äcker oder ein Dorf mit Kirche sind):
  // Äcker der Landstraße und der Autobahn, Schmuck der Dorfkirche – je ein unsichtbar kleines Stück zum Übersetzen
  const fieldGeo = new THREE.BufferGeometry();
  fieldGeo.setAttribute('position', new THREE.Float32BufferAttribute([0, -50, 0, 0.01, -50, 0, 0, -50, 0.01], 3));
  fieldGeo.setAttribute('color', new THREE.Float32BufferAttribute([1, 1, 1, 1, 1, 1, 1, 1, 1], 3));
  fieldGeo.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 0, 1], 2));
  const fieldWarm = [xxl.mats.field, scenery.mats.field, W.lambert({ vertexColors: true })].map((m) => {
    const mesh = new THREE.Mesh(fieldGeo, m);
    mesh.frustumCulled = false;
    scene.add(mesh);
    return mesh;
  });
  try {
    // jedes Programm so, wie das erste Bild es braucht: Welt und Facecam zeichnen in ein Render-Ziel (ohne Tone-Mapping,
    // linear – ohne das gebundene Ziel übersetzte das erste Bild die ganze Welt noch einmal), Cockpit und Quads direkt
    renderer.setRenderTarget(worldRT);
    renderer.compile(scene, camera);
    // Spiegel, Seitenfenster und Rückfahrkamera zeigen die Welt ohne den eigenen Wagen, also ohne seine
    // Innenraumleuchte: eine Lichtquelle weniger, für three.js je Material ein anderes Programm
    const shown = tesla.root.visible;
    tesla.root.visible = false;
    renderer.setRenderTarget(mirrorRT);
    renderer.compile(scene, rearCam);
    tesla.root.visible = shown;
    renderer.setRenderTarget(facecam.rt);
    renderer.compile(facecam.scene, facecam.camera);
    renderer.setRenderTarget(null);
    renderer.compile(cockpit.scene, camera);
    renderer.compile(facecam.quadScene, facecam.quadCam);
    renderer.compile(compScene, compCam);
    renderer.compile(postScene, compCam);
    windshield.warm(renderer);
  } catch (e) {
    renderer.setRenderTarget(null);
  }
  tesla.setWindow(0);
  for (const m of fieldWarm) scene.remove(m);
  fieldGeo.dispose();
  performance.mark('ma:compiled');
  state = 'title';
  menus.show('title', save);
  loadingEl.classList.add('done');
  setTimeout(() => loadingEl.remove(), 800);
  requestAnimationFrame((t) => {
    last = t;
    frame(t);
    performance.mark('ma:frame');
    // die Netze aller Fahrzeuge vorab (gegen Ruckler beim ersten Auftauchen) erst nach dem ersten Bild des Titels: bis
    // dahin baut jedes Fahrzeug, was es braucht, selbst
    setTimeout(prewarmVehicles, 300);
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
    // Qualität „Auto“ (adaptResolution): Sparstufe (Rückspiegel-Takt, Seitenfenster) und Schärfe
    get autoQuality() {
      return { level: autoLevel, mirrorEvery: mirrorEvery(), side: sideOn(), pixelRatio };
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
      return { on: tvRun.on, t: +t.toFixed(2), shot: tvRun.on ? shotAt(t, tvRun.shots) : null, plan: tvRun.on && tvRun.shots ? tvRun.shots.plan : null, window: +windowAt(t).toFixed(2), megafon: tesla.adam.megaphoneShown, seat: !tesla.adam.megaphoneShown, game: game.tv ? { n: game.tv.n, goal: game.tv.goal, said: game.tv.said } : null, released: !xxl.arrival.held, walteView: !!tvRun.walteView };
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
    afterWarp: () => { traffic.reset(); gegen.reset(); pickups.reset(); scenery.reset(); xxlNav.update(0); xxlHorizon(true); },
    // ein Sprung plant den Kurs unterwegs wie eine Fahrt mit 30 m/s (ohne die Tabelle des Shaders zu schreiben)
    eachStep: (s, step) => course.fill(xxl.trip, s, null, step / 30),
  });
  window.__MA.kit = { ...window.__MA.kit, nature: createNatureKit(W) };
  window.__MA.gegen = gegen;
  window.__MA.pose = () => xxlNav && { ...xxlNav.pose };
  // Horizont von (lat, lon) mit Blick nach bearing (Grad, im Uhrzeigersinn ab Norden); null: wieder der Fahrt folgen
  window.__MA.horizonAt = (lat, lon, bearing) => {
    if (lat == null) {
      window.__MA.skyPsi = null;
      return xxlHorizon(true);
    }
    const y = -Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * (180 / Math.PI);
    window.__MA.skyPsi = (-bearing * Math.PI) / 180;
    sky.setSkyline(skyline(lon, y, HORIZON.n), true);
  };
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

// die Landschaft der Karte (Relief, Wald, Siedlungen) erst auspacken: Karte, Navi und Welt bauen darauf
loadLandscape().catch((e) => console.warn('Landschaft nicht geladen', e)).finally(boot);

// --- Autoradio (src/radio.js) ------------------------------------------------------------------
/** Weiterschalten (Taste R, Knopf in der Pause): Hinweis am Rand, und im Stream hört der Chat mit. */
function radioCycle() {
  audio.init();
  const S = radio.cycle();
  ui.toast(S ? `📻 ${S.name}` : '📻 Radio aus', 'info', 'radio');
  if (game.running) game.onRadio(S && S.id);
}

/** Beschriftung des Radio-Knopfs in der Pause. */
function radioButtonLabel() {
  return '📻 ' + (radio.station ? radio.station.name : 'Radio aus');
}
radio.onChange = (r) => {
  if (r.status === 'kein Empfang') ui.toast(`📻 ${r.station.name}: kein Empfang`, 'warn', 'radio');
};
