// BrunnenTV am Navi-Ziel: Einstellungen, Megafon, Album-Standbild – aus main.js gelöst. Was die Folge vom Spiel
// braucht, holt sie über den Szenen-Kontext m (scenes/context.js).
import { Game } from '../game/game.js';
import * as THREE from 'three';
import { TV, dollyFor, megaphoneAt, shotAt, shotPose, lookAt as tvLookAt, tvShots, windowAt } from '../world/xxl/brunnentv.js';
import { buildHandMegaphone } from '../models/megaphone.js';
import { clamp, smoothstep } from '../util.js';
import { storeSave } from '../save.js';
import { stopRun } from './stop.js';
import { standSeen } from '../world/xxl/popstand.js';
import { m } from './context.js';

// --- BrunnenTV am Navi-Ziel (world/xxl/brunnentv.js TV, Game.startBrunnenTV) ----------------------------------------
// Der Wagen steht neben dem Brunnen, das Spiel läuft weiter und führt die Zeit der Folge (Sätze, Chat, OMI). Hier
// gehen das Fahrerfenster herunter und wieder hoch, Mini Adam hebt das Megafon (das vom Beifahrersitz, gebaut bei der
// ersten Folge) an den Mund und schaut zum Brunnen, und drei Kameras im Rahmen des Wagens zeigen die Folge (tvShots):
// „Totale“, „Fenster“, „Brunnen“. Von der Drohne gleitet die Kamera in die Totale, aus dem Cockpit wird kurz
// abgeblendet; zurück zur Kamera des Spielers geht es am Ende mit kurzem Abblenden. Überspringen lässt sich die Folge
// nicht (brunnentv.js): Tasten, Tipps aufs Bild und Gamepad-Knöpfe ändern an ihr nichts, sie endet bei TV.end, und der
// Spieler fährt los, wo er steht (Fenster zu, Megafon zurück).
// tv: game.tv, f: Mitte des Brunnens im Rahmen des Wagens, shots: die drei Kameras, prop: das Megafon in der Hand,
// inside: Kamera im Cockpit, from / fromLook: Kamera beim Halt
export const tvRun = {
  on: false, tv: null, f: new THREE.Vector3(), shots: null, prop: null, inside: false,
  from: new THREE.Vector3(), fromLook: new THREE.Vector3(), pose: { pos: [0, 0, 0], look: [0, 0, 0] },
};
export const tvM = new THREE.Matrix4();
/** Meldet die Folge beim Spiel und am Bild an (main.js, einmal beim Laden). */
export function hookTv() {
  // Route des Abspanns: jede Marke (Folge, Ladestopp) liegt dort, wo das Navi den Wagen gerade zeigt
  m.game.onRouteMark = (mark) => {
    if (!m.xxlNav) return;
    mark.x = m.xxlNav.pose.x;
    mark.y = m.xxlNav.pose.y;
  };
  // (die Folge steht schon im Album, game.startBrunnenTV: sofort speichern, auch wenn der Stream gleich abbricht)
  m.game.onBrunnenTV = (e) => {
    storeSave(m.save);
    tvBegin(e);
  };
  // Fürs Überspringen (sceneSkip) zählt auf dem Handy auch ein Tipp aufs Bild, in jeder Touch-Bedienung (in
  // „Wischen“ meldet ihn schon die Lenkfläche); die Knöpfe liegen darüber und fangen ihren Druck selbst. Ebenso in der
  // Startszene (chargeStep), wo die Touch-Bedienung noch gar nicht zu sehen ist
  m.renderer.domElement.addEventListener('pointerdown', () => {
    if (stopRun.on || m.state === 'charge') m.input.anyKey = true;
  });
}

/** Überspringen einer Szene (Ladestopp; BrunnenTV nicht): jede Taste oder Bestätigung, sobald skip Sekunden vorbei sind. */
export function sceneSkip(r, t, skip) {
  if (r.skipT < 0 && t > skip && (m.input.anyKey || m.input.take('confirm'))) r.skipT = t;
}

/** Game.onBrunnenTV: Der Wagen steht am Brunnen. Ohne Brunnen der Welt (Prüfstand) läuft der Fahrplan ohne Bild. */
export function tvBegin(e) {
  const q = e.fountain;
  if (!q || !q.world) return;
  const r = tvRun;
  m.updateCarMatrix();
  // Mitte des Brunnens im Rahmen des haltenden Wagens (er steht still, also bleibt sie dort)
  r.f.set(q.world.x, 0, q.world.z).applyMatrix4(tvM.copy(m.carMatrix).invert());
  r.shots = tvShots({ x: r.f.x, z: r.f.z }, q.r);
  // fürs Standbild: Radius der Insel und Maße des Brunnens (r, h seines Bausteins)
  Object.assign(r, { on: true, tv: e, inside: m.view === 'cockpit', picDone: false, isl: q.r, fi: q.object ? q.object.userData.info : null });
  r.from.copy(m.camera.position);
  m.camera.getWorldDirection(r.fromLook).multiplyScalar(20).add(m.camera.position);
  if (!r.prop) {
    r.prop = buildHandMegaphone();
    m.tesla.adam.holdMegaphone(r.prop);
    // die Figur der Facecam hält ihr eigenes (gerades) Megafon: Beide zeigen dasselbe
    m.facecam.adam.holdMegaphone(buildHandMegaphone({ curved: false }));
  }
  // Mini Adam schaut zum Brunnen (Körperkoordinaten: +x zum Fenster, +z nach vorn)
  m.adamDo((a) => a.lookAt([-r.f.x, 0.85, -r.f.z], TV.look.off[0]));
  // Wo ist Walte? (memes.js folgeStart): Heute steht er halb hinter dem Brunnen (city.js group.walte)
  r.walte = (e.walte && e.town && e.town.group && e.town.group.walte) || null;
  if (r.walte) r.walte.visible = true;
}

/** Nach game.update: Ist die Folge vorbei (ihr Fahrplan zu Ende), übernimmt der Spieler, wo er steht. */
export function tvTick() {
  const r = tvRun;
  if (m.game.tv && m.game.running && !m.game.over) return;
  // endet der Stream mitten in der Folge, bekommt das Album ihr Standbild jetzt (der Wagen steht noch am Brunnen)
  if (r.on && !r.picDone && m.game.over) {
    r.picDone = true;
    m.takeAlbumShot(r);
  }
  tvStop();
}

/** Fenster zu, Megafon zurück auf den Sitz, Szene aus (auch bei einer neuen Fahrt). */
/** Hupe während der Folge (main.js): Ist Walte gerade im Bild, ist er gefunden (memes.js walteSeen, einmal je Folge). */
export function tvHorn() {
  if (tvRun.walteView) m.game.memes.walteSeen();
}

export function tvStop() {
  tvRun.on = false;
  if (tvRun.walte) tvRun.walte.visible = false;
  tvRun.walte = null;
  tvRun.walteView = false;
  m.tesla.setWindow(0);
  m.tesla.seatMegaphone(true);
  if (tvRun.prop) tvRun.prop.visible = false;
}

/** Nach der Welt: Fenster, Megafon und Kamera dieses Bilds. Ergebnis: { inside, look, megafon } für Mini Adam. */
export function tvPlace(dt) {
  const r = tvRun;
  const t = m.game.brunnenT();
  m.updateCarMatrix();
  m.tesla.setWindow(windowAt(t));
  const mk = megaphoneAt(t);
  const ck = m.view === 'cockpit';
  let fade = 0;
  let inside = false;
  const shot = shotAt(t);
  const S = r.shots;
  // hochkant fährt jede Kamera etwas zurück, damit Wagen und Brunnen ins schmale Bild passen (dollyFor)
  const aspect = window.innerWidth / window.innerHeight;
  if (shot === 'totale' && ck && t < TV.fade) {
    // aus dem Cockpit: erst abblenden, dann steht die Totale da
    m.cockpit.placeCamera(m.camera, m.carMatrix, m.simT, 0, 0, dt);
    m.setFov(58);
    inside = true;
    fade = t / TV.fade;
  } else if (shot !== 'zurueck') {
    const s = S[shot];
    shotPose(s, t, r.pose, dollyFor(aspect, s.dolly));
    m.tmpV.fromArray(r.pose.pos).applyMatrix4(m.carMatrix);
    m.tmpV2.fromArray(r.pose.look).applyMatrix4(m.carMatrix);
    if (shot === 'totale' && !ck) {
      // von der Drohne gleitet die Kamera in die Totale
      const k = smoothstep(0, TV.card, t);
      m.tmpV.lerpVectors(r.from, m.tmpV, k);
      m.tmpV2.lerpVectors(r.fromLook, m.tmpV2, k);
    }
    m.camera.position.copy(m.tmpV);
    m.camera.lookAt(m.tmpV2);
    m.setFov(s.fov);
    if (shot === 'totale' && ck) fade = 1 - (t - TV.fade) / TV.fade;
  } else {
    // zurück zur Kamera des Spielers: kurz abblenden, dann steht seine Kamera da (Cockpit oder Drohne hinter dem
    // Wagen) und blendet auf – ein Gleiten von der Brunnen-Kamera vorn zur Drohne hinten führte quer über den Wagen
    const sw = TV.back[0] + TV.fade;
    if (t < sw) {
      shotPose(S.brunnen, TV.back[0], r.pose, dollyFor(aspect, S.brunnen.dolly));
      m.camera.position.fromArray(r.pose.pos).applyMatrix4(m.carMatrix);
      m.camera.lookAt(m.tmpV2.fromArray(r.pose.look).applyMatrix4(m.carMatrix));
      m.setFov(S.brunnen.fov);
      fade = (t - TV.back[0]) / TV.fade;
      m.drone.init = false;
    } else {
      if (ck) {
        m.cockpit.placeCamera(m.camera, m.carMatrix, m.simT, 0, 0, dt);
        m.setFov(58);
        inside = true;
      } else m.placeDrone(dt, 'follow');
      fade = 1 - (t - sw) / (TV.back[1] - sw);
    }
  }
  m.fxState.fade = clamp(fade, 0, 1);
  r.inside = inside;
  // Walte im Bild der Brunnen-Kamera (nicht im Abblenden): Wer ihn jetzt entdeckt und hupt, hat ihn gefunden (tvHorn)
  r.walteView = !!(r.walte && shot === 'brunnen' && fade < 0.5 && standSeen(r.walte, [{ cam: m.camera, far: 60 }]));
  // das Megafon vom Beifahrersitz ist in seiner Hand
  m.tesla.seatMegaphone(!m.tesla.adam.megaphoneShown);
  // das Standbild fürs Album: in der Brunnen-Kamera mit dem Megafon am Fenster
  if (!r.picDone && t >= m.ALBUM_PIC.t) {
    r.picDone = true;
    m.takeAlbumShot(r);
  }
  return { inside, look: tvLookAt(t), megafon: mk };
}
