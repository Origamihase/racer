// Ladestopp im Park: Einparken, Laden, Ausparken mit eigener Kamera – aus main.js gelöst. Was er vom Spiel braucht,
// holt er über den Szenen-Kontext m (scenes/context.js).
import { CHARGE, DOCK, ROLL_T, SCENE, STOP, groundAt, rollPose } from '../world/xxl/charge.js';
import { Cockpit } from '../cockpit/cockpit.js';
import { Game } from '../game/game.js';
import { POPPING_AT, POPPING_YAW, buildPopping, windowAim } from '../world/xxl/popping.js';
import * as THREE from 'three';
import { clamp, smoothstep } from '../util.js';
import { CHARGE_KEYS, chargeM, chargePose } from './start.js';
import { m } from './context.js';

// --- Ladestopp im Park (world/xxl/charge.js STOP, Akku.start) -------------------------------------------------
// Das Spiel läuft weiter (Uhr, Chat, Akku, Gebote, Spenden) und führt die Zeit; der Spieler wartet an seinem Halt in der
// Spur, während der Wagen der Szene rückwärts in die freie Heldenbucht setzt, lädt und ausparkt (die Wege rechnet
// charge.js im Rahmen des Parks). Passiert der ausparkende Wagen den Halt, folgt ihm der Spieler: Die Übergabe am Ende
// ist ohne Sprung. Kamera: beim Einparken die des Spielers (im Cockpit bleibt sie dort, die Drohne steigt über die
// Gegenspur und schaut zu), in der Bucht nah an Buchse, Säule und Popcorn-Maschine (Schlüssel im Rahmen des Wagens wie
// in Erlensee), beim Ausparken die Startszene (CHARGE_KEYS) zurück ins Cockpit bzw. hinter den Wagen wie die Drohne.
// (über den Eimer hinweg auf Buchse, Stecker und Säule – der Eimer bleibt unter dem Bild –, dann von links auf die
// Maschine oben auf der Säule und das offene Fahrerfenster, in das das Popcorn fliegt, zum Bananensaft schräg von vorn
// aufs Fahrerfenster, zuletzt Erlensees erster Schlüssel fürs Ausstecken)
export const STOP_KEYS = [
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
export const STOP_DRONE = { pos: [3.0, 5.4, 10], blend: 1.2, bay: 0.35 };
// Drohne beim Ausparken: Erlensees Schlüssel, bis der Wagen in der Spur ist, dann hinter ihn wie die Verfolgerdrohne
export const STOP_ROLL_DRONE = [...CHARGE_KEYS.slice(0, 4), { t: SCENE.end, pos: [0, 3.3, 9.2], look: [0, 1.0, -14] }];
export const STOP_CTL = { steer: 0, throttle: 0, brake: 0, reverse: false, horn: false, wiper: false, megafon: false, ladestopp: false, device: null, kappa: 0, grade: 0 };
export const STOP_FADE = 0.35; // Aufblenden in der Spur nach dem Überspringen
// c: game.charging (Fahrplan plan), town: der Park (Towns.of), rig: Stecker und Kabel seiner Heldensäule, pop: Popcorn
// in der Maschine (beim ersten Stopp gebaut), q: Lage des Wagens, v: sein Tempo (rückwärts negativ), rev / brake:
// Rückfahr- und Bremslicht, gear: Gang fürs Display, inside: Kamera im Cockpit (für die Pause), skipT: übersprungen bei
// (Zeit der Szene), fadeT: Aufblenden danach, from / fromLook: Kamera beim Halt, cam / look: die der Drohne beim
// Einparken, done: Klänge und Gesten, die schon kamen
// aim / along: Stelle im offenen Fahrerfenster, durch die das Popcorn fliegt, und die Richtung längs des Wagens dort,
// im Rahmen der Maschine
export const stopRun = {
  on: false, c: null, town: null, rig: null, port: null, pop: null, aim: new THREE.Vector3(), along: new THREE.Vector3(), q: {}, v: 0, rev: false, brake: false, gear: 'D', inside: false, skipT: -1, fadeT: 0,
  from: new THREE.Vector3(), fromLook: new THREE.Vector3(), cam: new THREE.Vector3(), look: new THREE.Vector3(), done: {},
};
/** Meldet die Szene beim Spiel an (main.js, einmal beim Laden). */
export function hookStop() {
  m.game.onCharge = (c) => stopBegin(c);
}

/** Game.onCharge: Der Wagen steht an seinem Halt im Park. Ohne gebauten Park (Prüfstand) läuft der Fahrplan ohne Bild. */
export function stopBegin(c) {
  const town = m.xxl.town(c.sec);
  if (!town || !town.charge) return;
  const r = stopRun;
  // (rollt er erst vor bis an den Haltepunkt, legt er R danach ein: stopTick)
  const creep = c.plan.creep;
  Object.assign(r, { on: true, c, town, rig: town.charge, port: m.tesla.port(), v: 0, rev: !creep, brake: !creep, gear: creep ? 'D' : 'R', skipT: -1, fadeT: 0, done: {} });
  // die Buchse des Wagens in der Bucht im Rahmen der Säule (wie chargePlug): dorthin führt der Stecker
  stopPose(rollPose(c.plan.u, 0, r.q));
  m.tesla.root.updateWorldMatrix(true, false);
  r.rig.group.updateWorldMatrix(true, false);
  chargeM.copy(r.rig.group.matrixWorld).invert();
  const pos = m.tmpV.copy(r.port.pos).applyMatrix4(m.tesla.root.matrixWorld).applyMatrix4(chargeM);
  const normal = m.tmpV2.copy(r.port.normal).transformDirection(m.tesla.root.matrixWorld).transformDirection(chargeM);
  r.rig.plug(pos, normal);
  r.rig.set(1);
  r.port.set(0, 0);
  // Popcorn springt in der Maschine oben auf der Säule – und bei offenem Fenster hinüber ins Auto: durch das Fenster des
  // Wagens in der Bucht (dort steht er beim Popcorn still), im Rahmen der Maschine
  const st = town.plan.items.find((it) => it.name === 'popcorn_post');
  if (st) {
    r.pop = r.pop || buildPopping();
    r.pop.group.position.fromArray(POPPING_AT).applyAxisAngle(m.UP_AXIS, st.ry).add(m.tmpV.set(st.x, st.y, st.z));
    r.pop.group.rotation.y = st.ry + POPPING_YAW;
    town.group.add(r.pop.group);
    r.pop.group.updateWorldMatrix(true, false);
    windowAim(m.tesla.windowOpening(), r.aim).applyMatrix4(m.tesla.root.matrixWorld).applyMatrix4(chargeM.copy(r.pop.group.matrixWorld).invert());
    r.along.set(0, 0, 1).transformDirection(m.tesla.root.matrixWorld).transformDirection(chargeM);
  }
  stopPose(creep ? creep.pose(0, r.q) : c.plan.dock.pose(0, r.q));
  // die Drohne fliegt von dort los, wo sie gerade ist
  r.from.copy(m.camera.position);
  m.camera.getWorldDirection(r.fromLook).multiplyScalar(20).add(m.camera.position);
  r.look.copy(r.fromLook);
  if (m.stopBtn) m.stopBtn.classList.remove('show');
  if (!creep) m.audio.gear('R');
}

/** Wagen der Szene an die Lage q (Ortskoordinaten des Parks): über die Matrix des Parks in die Welt (wie chargePose). */
export function stopPose(q) {
  m.carPos.set(q.x, groundAt(q.x), -q.u).applyMatrix4(stopRun.town.group.matrix);
  m.carEuler.set(0, -q.yaw, 0, 'YXZ');
  m.carQuat.setFromEuler(m.carEuler);
  m.carMatrix.compose(m.carPos, m.carQuat, m.ONE);
  m.tesla.root.position.copy(m.carPos);
  m.tesla.root.quaternion.copy(m.carQuat);
  m.cockpit.root.position.copy(m.carPos);
  m.cockpit.root.quaternion.copy(m.carQuat);
}

/**
 * Nach game.update, vor der Welt: Lage des Wagens, Stecker, Klappe, Popcorn und Klänge für diese Zeit der Szene; ab
 * dem Halt folgt der Spieler dem ausparkenden Wagen. Hat das Spiel den Stopp beendet (Fahrplan zu Ende oder
 * übersprungen), übernimmt der Spieler in der Spur.
 */
export function stopTick() {
  const r = stopRun;
  const p = m.game.player;
  const c = r.c;
  const P = c.plan;
  // endet der Stream mitten im Stopp (Stream beenden, keine Gebote mehr), kommt der Abspann gleich: Sonst stünde die
  // Szene still, denn game.update läuft nicht mehr, und game.charging bliebe gesetzt
  if (!m.game.charging || m.game.over) {
    // Übergabe: der Wagen steht da, wo das Ausparken endet, mit dessen Tempo; Stecker im Halter, Klappe zu
    const e = rollPose(P.u, ROLL_T, r.q);
    Object.assign(p, { s: c.sec.s0 + e.u, x: e.x, speed: e.v, wheel: 0, throttle: 0, braking: 0, yaw: 0, vx: 0 });
    r.rig.set(1);
    r.port.set(0, 0);
    m.tesla.setWindow(0);
    if (r.pop) {
      r.pop.update(0, false);
      r.pop.group.removeFromParent();
    }
    Object.assign(r, { on: false, rev: false, brake: false, gear: 'D', v: e.v });
    if (r.skipT >= 0) {
      r.fadeT = STOP_FADE;
      m.fxState.fade = 1;
      m.drone.init = false;
    } else {
      m.drone.pos.copy(m.camera.position);
      m.camera.getWorldDirection(m.drone.look).multiplyScalar(14).add(m.camera.position);
      m.drone.init = true;
    }
    return;
  }
  const t = m.game.akku.sceneT();
  const te = t - P.at(STOP.unplug);
  // (an der Säule eines Orts vor dem Haltepunkt angehalten: erst vorrollen, P.creep, dann R)
  const q = t < P.c ? P.creep.pose(t, r.q) : t < P.d0 ? P.dock.pose(t - P.c - STOP.shift, r.q) : rollPose(P.u, clamp(te - SCENE.roll, 0, ROLL_T), r.q);
  r.v = q.v;
  r.rev = t >= P.c && t < P.d0;
  r.gear = t < P.c ? 'D' : r.rev ? 'R' : t < P.roll ? 'P' : 'D';
  // Bremslicht, solange er in R wartet und wenn er vor der Bucht anhält
  r.brake = (t > P.c - 0.5 && t < P.c + STOP.shift + 0.15) || (t < P.d0 && t > P.d0 - DOCK.down);
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
  m.tesla.setWindow(win);
  if (r.pop) r.pop.update(t - P.at(STOP.pop[0]), t >= P.at(STOP.pop[0]) && t < P.at(STOP.pop[1]), win > 0.95 ? r.aim : null, r.along);
  // Klick, wenn der Stecker sitzt und wenn er sich löst, der Zirper von P nach D beim Anrollen; Mini Adam hebt beim
  // Bananensaft die Flasche (nicht nachgeholt)
  const once = (k, at, fn) => {
    if (t < at || r.done[k]) return;
    r.done[k] = true;
    if (t < at + 0.3) fn();
  };
  if (P.c) once('r', P.c, () => m.audio.gear('R'));
  once('in', P.at(STOP.plug[1]), () => m.audio.unplug());
  once('juice', P.at(STOP.juice), () => m.adamDo((a) => {
    a.raiseBottle();
    a.setMood('happy', 3);
  }));
  once('out', P.at(STOP.unplug + S.plug[0]), () => m.audio.unplug());
  once('d', P.roll, () => m.audio.gear('D'));
  // übersprungen: erst abblenden, dann beendet das Spiel den Stopp (im nächsten Bild die Übergabe)
  if (r.skipT >= 0 && t - r.skipT >= 0.25) m.game.akku.skip();
}

/** Nach der Welt: Wagen und Kamera dieses Bilds. Ergebnis: { inside (Kamera im Cockpit), look (Mini Adam) }. */
export function stopPlace(dt) {
  const r = stopRun;
  const P = r.c.plan;
  const t = m.game.akku.sceneT();
  const te = t - P.at(STOP.unplug);
  const tb = t - P.d0;
  stopPose(r.q);
  let inside = false;
  let fade = 0;
  if (t < P.d0) {
    // Einparken: im Cockpit bleibt die Kamera dort; die Drohne steigt über die Straße und schaut dem Wagen zu
    if (m.view === 'cockpit') {
      m.cockpit.placeCamera(m.camera, m.carMatrix, m.simT, Math.abs(r.v), 0, dt);
      m.setFov(58);
      inside = true;
    } else {
      const k = smoothstep(0, STOP_DRONE.blend, t);
      const yb = P.u - CHARGE.bay[0] + CHARGE.off;
      const g = r.town.group.matrix;
      m.tmpV.set(STOP_DRONE.pos[0], STOP_DRONE.pos[1], -(yb + STOP_DRONE.pos[2])).applyMatrix4(g);
      r.cam.lerpVectors(r.from, m.tmpV, k);
      // Blick zwischen Wagen und Bucht, weich nachgeführt
      m.tmpV2.set(0, 0.7, 0).applyMatrix4(m.carMatrix).lerp(m.tmpV.set(CHARGE.front - CHARGE.bay[1], 0.7, -yb).applyMatrix4(g), STOP_DRONE.bay);
      r.look.lerp(m.tmpV2, 1 - Math.exp(-dt * 5));
      m.camera.position.copy(r.cam);
      m.camera.lookAt(m.tmpV.lerpVectors(r.fromLook, r.look, k));
      m.setFov(50);
    }
    if (t > P.d0 - 0.25) fade = (t - (P.d0 - 0.25)) / 0.25;
  } else if (te < 0) {
    // in der Bucht: nah an Buchse, Säule und Popcorn-Stand
    const { pos, look } = m.lerpKeys(tb, STOP_KEYS);
    m.camera.position.copy(pos.applyMatrix4(m.carMatrix));
    m.camera.lookAt(look.applyMatrix4(m.carMatrix));
    m.setFov(44);
    if (tb < STOP_FADE) fade = 1 - tb / STOP_FADE;
  } else {
    // ausparken wie in Erlensee: im Cockpit-Blick am Ende hinein, sonst hinter den Wagen
    const ck = m.view === 'cockpit';
    inside = m.placeScene(dt, ck ? CHARGE_KEYS : STOP_ROLL_DRONE, te, ck ? SCENE.inside : Infinity, SCENE.end) === 'inside';
    const sw = SCENE.inside;
    if (ck) fade = te > sw - 0.25 && te < sw ? (te - (sw - 0.25)) / 0.25 : te >= sw && te < sw + STOP_FADE ? 1 - (te - sw) / STOP_FADE : 0;
  }
  m.fxState.fade = Math.max(fade, r.skipT >= 0 ? (t - r.skipT) / 0.25 : 0);
  r.inside = inside;
  // Mini Adam schaut zur Säule, bis der Stecker sich löst (winken tut er hier nicht: game/wave.js)
  return {
    inside,
    look: smoothstep(0.6, 1.4, tb) * (1 - smoothstep(-0.6, 0, te)),
  };
}
