// Startszene der Reise am Supercharger: Stecker, Ausparken, Kamera, „Wir sind live.“ – aus main.js gelöst. Was sie vom
// Spiel braucht (Wagen, Kamera, Spielzustand, Ton), holt sie über den Szenen-Kontext m (scenes/context.js).
import { Cockpit } from '../cockpit/cockpit.js';
import { Facecam } from '../cockpit/facecam.js';
import { Game } from '../game/game.js';
import { PARTYPEOPLE } from '../data.js';
import { ROLL_T, SCENE, groundAt, rollPose } from '../world/xxl/charge.js';
import * as THREE from 'three';
import { clamp, smoothstep } from '../util.js';
import { m } from './context.js';

// --- Startszene der Reise: am Supercharger in Erlensee (world/xxl/charge.js SCENE) ---------------------------------
// Das Spiel steht so lange still: Der Spieler wartet schon in der Spur, wie xxlStart ihn hinstellt (40 km/h,
// geradeaus), und das Ausparken endet genau dort. Die Szene bewegt nur Wagen, Stecker, Klappe und Kamera; Tempo und
// Lenkung des Spielers zeigen so lange die des Wagens (Räder, Lenkrad, Tacho, Motor) und stehen danach wieder wie vorher.
// Kamera: Schlüssel im Rahmen des Wagens (placeScene) – schräg von vorne oben auf Buchse und Säule (von der Seite stünde
// die Säule davor), beim Ausparken schräg von vorne, zuletzt am Seitenfenster und hinein ins Cockpit.
export const CHARGE_KEYS = [
  { t: 0, pos: [-2.4, 2.15, -1.3], look: [-0.85, 0.85, 1.9] },
  { t: 1.3, pos: [-2.1, 1.85, -0.2], look: [-1.1, 0.95, 1.95] },
  { t: 2.9, pos: [-3.4, 1.9, -5.0], look: [-0.3, 0.9, -0.3] },
  { t: 4.6, pos: [-2.7, 1.55, -3.4], look: [-0.37, 1.12, 0.22] },
  { t: SCENE.inside - 0.2, pos: [-1.72, 1.26, 0.2], look: [-0.37, 1.16, 0.28] },
];
// im Titel: der ganze Wagen schräg von vorne, Säule und Stecker rechts daneben (links liegt das Menü)
export const CHARGE_TITLE = { pos: [-2.8, 2.6, -4.6], look: [-0.25, 0.85, 0.9] };
export const CHARGE_LINES = { live: 'Wir sind live.', greet: 'Hallo Mini Adam! Akku voll, gute Fahrt!' };
// town: der Startort (Towns.of: plan, group, charge), port: Ladeklappe des Wagens, keep: Spieler vor der Szene,
// skipT: wann übersprungen wurde (dann erst abblenden), greetT: wann OMI grüßt (Spielzeit simT)
// parked: der Titel der Reise zeigt den Wagen am Supercharger (xxlStart)
// hello: der Stream hat begonnen („Wir sind live.“ und Mini Adams Gruß stehen in der Sprachausgabe, streamStart),
// said: sein Gruß hat begonnen, waveT: wann (stateT) er dazu in der Startszene zu winken begann (−1: nicht dort),
// id: Nummer des Streams für die Rückmeldungen der Sprachausgabe (liveOff zählt weiter: Späteres gilt nicht mehr)
export const chargeRun = { town: null, port: null, pose: {}, keep: null, parked: false, chimed: false, hello: false, said: false, waveT: -1, id: 0, skipT: -1, greetT: Infinity };
export const chargeM = new THREE.Matrix4();

/** Wagen in die Bucht des Startorts, Stecker in die Buchse, Ring grün. false, wenn der Startort keinen Ladepark hat. */
export function chargePlug() {
  const town = m.xxl.town(m.xxl.trip.section);
  if (!town || !town.charge) return false;
  Object.assign(chargeRun, { town, port: m.tesla.port() });
  // die Buchse im Rahmen der Säule: Wagen in der Bucht → Welt → Säule
  chargePose(0);
  m.tesla.root.updateWorldMatrix(true, false);
  town.charge.group.updateWorldMatrix(true, false);
  chargeM.copy(town.charge.group.matrixWorld).invert();
  const pos = m.tmpV.copy(chargeRun.port.pos).applyMatrix4(m.tesla.root.matrixWorld).applyMatrix4(chargeM);
  const normal = m.tmpV2.copy(chargeRun.port.normal).transformDirection(m.tesla.root.matrixWorld).transformDirection(chargeM);
  town.charge.plug(pos, normal);
  town.charge.set(0);
  chargeRun.port.set(1, 1);
  return true;
}

/** Startszene vorbereiten (nach xxlStart): eingesteckt wie im Titel, nur der Untertitel. false ohne Ladepark. */
export function chargeBegin() {
  if (!chargePlug()) return false;
  const p = m.game.player;
  Object.assign(chargeRun, { chimed: false, unplugged: false, shifted: false, skipT: -1 });
  chargeRun.keep = { speed: p.speed, wheel: p.wheel, throttle: p.throttle, braking: p.braking };
  m.ui.show(false, true);
  return true;
}

/** Titel der Reise am Supercharger: Der Wagen lädt, die Kamera schwebt langsam vor ihm. */
export function chargeTitle() {
  chargePose(0);
  const k = CHARGE_TITLE;
  const pos = m.tmpV.set(k.pos[0] + 0.5 * Math.sin(m.simT * 0.21), k.pos[1] + 0.12 * Math.sin(m.simT * 0.17), k.pos[2] + 0.6 * Math.sin(m.simT * 0.13));
  m.camera.position.copy(pos.applyMatrix4(m.carMatrix));
  m.camera.lookAt(m.tmpV2.fromArray(k.look).applyMatrix4(m.carMatrix));
  m.setFov(44);
}

/** Wagen in der Szene bei t: über die Matrix des Orts in die Welt (wie updateCarMatrix). Gibt die Lage (rollPose) zurück. */
export function chargePose(t) {
  const town = chargeRun.town;
  const q = rollPose(town.plan.charge.u, clamp(t - SCENE.roll, 0, ROLL_T), chargeRun.pose);
  m.carPos.set(q.x, groundAt(q.x), -q.u).applyMatrix4(town.group.matrix);
  m.carEuler.set(0, -q.yaw, 0, 'YXZ');
  m.carQuat.setFromEuler(m.carEuler);
  m.carMatrix.compose(m.carPos, m.carQuat, m.ONE);
  m.tesla.root.position.copy(m.carPos);
  m.tesla.root.quaternion.copy(m.carQuat);
  m.cockpit.root.position.copy(m.carPos);
  m.cockpit.root.quaternion.copy(m.carQuat);
  return q;
}

/** Ein Bild der Startszene: { inside (Kamera im Cockpit), wave, look (Mini Adam) }. */
export function chargeStep(dt) {
  const S = SCENE;
  const run = chargeRun;
  if (run.skipT < 0 && m.stateT > S.skip && m.stateT < S.inside - 0.25 && (m.input.anyKey || m.input.take('confirm'))) run.skipT = m.stateT;
  // übersprungen: erst abblenden, dann gleich ins Cockpit (dort steht alles schon so, wie die Szene es hinterlässt)
  if (run.skipT >= 0 && m.stateT - run.skipT >= 0.25) {
    m.stateT = S.inside;
    run.skipT = -2;
  }
  const t = m.stateT;
  const q = chargePose(t);
  const p = m.game.player;
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
    if (t < S.plug[0] + 0.3) m.audio.unplug();
  }
  if (t >= S.roll && !run.shifted) {
    run.shifted = true;
    if (t < S.roll + 0.3) m.audio.gear('D');
  }
  if (t >= S.chime && !run.chimed) {
    run.chimed = true;
    m.audio.nomiChime();
  }
  // der Stream geht live (das Sprachstudio), danach grüßt Mini Adam und winkt dabei aus dem Fenster (streamStart)
  if (t >= S.live && !run.hello) streamStart();
  const where = m.placeScene(dt, CHARGE_KEYS, t, S.inside, S.end);
  const sw = S.inside;
  const fade = t < 0.6 ? 1 - t / 0.6 : t > sw - 0.25 && t < sw ? (t - (sw - 0.25)) / 0.25 : t >= sw && t < sw + 0.35 ? 1 - (t - sw) / 0.35 : 0;
  m.fxState.fade = Math.max(fade, run.skipT >= 0 ? (m.stateT - run.skipT) / 0.25 : 0);
  if (m.stateT >= S.end) {
    // Übergabe: Der Wagen steht genau da, wo der Spieler wartet; der hat wieder sein eigenes Tempo
    Object.assign(p, run.keep);
    m.updateCarMatrix();
    m.toDrive();
  }
  // er winkt, solange er grüßt (ab waveT, S.wave Sekunden lang), und schaut dabei hinaus bis zum Schnitt ins Cockpit
  const w = run.waveT;
  return {
    inside: where === 'inside',
    wave: w < 0 ? 0 : smoothstep(w, w + 0.4, t) * (1 - smoothstep(w + S.wave - 0.5, w + S.wave, t)),
    look: w < 0 ? 0 : smoothstep(w, w + 0.8, t) * (1 - smoothstep(w + S.wave, S.inside, t)),
  };
}

/**
 * Der Beginn jedes Streams, genau einmal (chargeRun.hello; in der Startszene bei SCENE.live, sonst beim Losfahren):
 * Zuerst meldet das Sprachstudio „Wir sind live.“, dann ruft Mini Adam „Partypeople!“ (data.js PARTYPEOPLE) und winkt
 * dabei, dann grüßt der Chat zurück (Game.greet) und OMI wünscht gute Fahrt (Besitzer, 21.11.2026: „Es sollte zuerst
 * ‚Wir sind live‘ und danach ‚Partypeople‘ kommen. Ohne Stream macht ein Gruß keinen Sinn.“). Beide Sätze stehen in
 * der Warteschlange der Sprachausgabe (mit Vorrang, in dieser Reihenfolge): Sein Gruß beginnt erst, wenn das Studio
 * ausgeredet hat, und Untertitel und Winken beginnen mit ihm – in der Startszene draußen am Fenster, solange die Kamera
 * noch draußen ist, sonst in Facecam und Cockpit (game/wave.js 'intro').
 */
export function streamStart() {
  const run = chargeRun;
  run.hello = true;
  const id = run.id;
  const now = () => id === run.id;
  m.speech.say(CHARGE_LINES.live, m.game.studioVoice(), { priority: true, onStart: (d) => now() && m.ui.studio(CHARGE_LINES.live, d + 0.8) });
  const text = PARTYPEOPLE.say;
  m.speech.say(text, 'adam', {
    priority: true,
    onStart: (d) => {
      if (!now()) return;
      run.said = true;
      m.ui.adam(text, d + 0.8);
      m.game.greet();
      if (m.state === 'charge' && m.stateT < SCENE.inside - SCENE.wave) {
        run.waveT = m.stateT;
        m.game.waves.ask('intro', m.game.t);
      } else if (m.state === 'drive') m.game.waveAt('intro');
    },
    onEnd: () => {
      if (now()) run.greetT = m.simT + 0.6;
    },
  });
}

/** Der Stream ist aus: kein Gruß OMIs mehr, und was die Sprachausgabe vom Beginn noch meldet, gilt nicht mehr. */
export function liveOff() {
  chargeRun.greetT = Infinity;
  chargeRun.id++;
}

/** OMI grüßt (wie Game.say, aber ohne die Spielzeit: die steht in der Szene still). */
export function chargeGreet() {
  chargeRun.greetT = Infinity;
  m.audio.nomiChime();
  m.cockpit.nomi.setMood('happy', 3.2);
  let line = null;
  m.speech.say(CHARGE_LINES.greet, 'board', {
    priority: true,
    onStart: (x) => {
      m.cockpit.nomi.speak(x);
      line = m.ui.nomi(CHARGE_LINES.greet, x + 0.8);
    },
    onDrop: () => line && (line.t = 0),
  });
}
