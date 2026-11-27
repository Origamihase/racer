// Verkehr: Autos und Lkw mit Abstandsregelung (IDM), Spurwechseln mit Blinker,
// Rechtsfahrgebot, Lkw nur rechts, Elefantenrennen, Polizei Gifhorn und Gegenverkehr.
import * as THREE from 'three';
import { Vehicle, randomKind, setVehicleLights } from '../models/vehicles.js';
import { ROAD } from '../textures.js';
import { ONCOMING } from './road.js';
import { curveAt } from '../curve.js';
import { clamp, lerp, rand, chance, pick, smoothstep } from '../util.js';
import { BAU_LEN, bauShift, bauLeftLogical } from './baustelle-plan.js';

const LANE_SPEEDS = [
  [150, 205],
  [128, 160],
  [112, 138],
  [95, 120],
];
const KMH = 1 / 3.6;
// Vor Kurven nimmt der Verkehr Gas weg, wo die Querbeschleunigung sonst über diesen Komfortwert stiege (m/s²),
// und bremst dafür sanft (m/s²). Lkw kriechen an langen Steigungen etwas (km/h weniger je Prozent über 2 %).
const CURVE = { car: { lat: 2.5, dec: 1.2 }, truck: { lat: 1.8, dec: 0.8 }, look: 250, climb: 4.5 };
/**
 * Elefantenrennen, wie es auf der Straße zu sehen ist: zwei Lkw auf benachbarten Spuren unserer Richtung (nicht auf
 * dem Verzögerungsstreifen), höchstens side Meter gegeneinander versetzt, beide zwischen near und far Metern vor dem
 * Wagen und fast gleich schnell (höchstens dv m/s Unterschied, sie überholen sich also kaum).
 */
export const ELEPHANTS = { side: 14, near: 25, far: 320, dv: 2.5 };
/** Fahren gerade zwei Lkw nebeneinander vor dem Wagen (ELEPHANTS)? Liefert das Paar oder null. cars: {truck, lane, s, speed}. */
export function elephantPair(cars, sPlayer) {
  const E = ELEPHANTS;
  for (const a of cars) {
    const da = a.s - sPlayer;
    if (!a.truck || a.lane > 3 || da < E.near || da > E.far) continue;
    for (const b of cars) {
      if (b === a || !b.truck || b.lane !== a.lane + 1 || b.lane > 3) continue;
      const db = b.s - sPlayer;
      if (db >= E.near && db <= E.far && Math.abs(a.s - b.s) <= E.side && Math.abs(a.speed - b.speed) <= E.dv) return [a, b];
    }
  }
  return null;
}
/**
 * Bremslicht wie bei echten Fahrern: an, sobald der Wagen spürbar verzögert (on, m/s²), vor einer Kurve bremst oder
 * fast steht; aus erst, wenn er wieder rollt oder Gas gibt (über off) und das Licht mindestens hold Sekunden an war –
 * so flackert es nicht bei jedem kleinen Lupfen im Kolonnenverkehr.
 */
export const BRAKE = { on: -0.9, off: -0.3, hold: 0.6, stand: 3 };
/** Ein Schritt des Bremslichts (BRAKE): c.brakeT zählt die Haltezeit herunter. Liefert, ob es leuchtet. */
export function brakeLight(c, acc, dt, hard = false) {
  if (hard || acc < BRAKE.on || c.speed < BRAKE.stand) c.brakeT = BRAKE.hold;
  else if (acc > BRAKE.off) c.brakeT = Math.max(0, c.brakeT - dt);
  return c.brakeT > 0;
}
const _cf = { x: 0, z: 0, th: 0, y: 0, k: 0, dk: 0, xr: 0, g: 0 };

let nextId = 1;

const NONE = Object.freeze([]);
// der Spieler, solange er nicht auf dieser Autobahn fährt (passive): weit hinter allen und neben der Fahrbahn
const AWAY = Object.freeze({ s: -1e9, x: -1e4, speed: 0, len: 0, w: 0, isPlayer: true });
/**
 * Wie lange ein neues Fahrzeug braucht, bis es ganz da ist (s): Es wächst aus der Straße, statt im Nebel oder ganz
 * deutlich aus dem Nichts aufzutauchen (beim Nachschub voraus, von hinten und auf der Gegenfahrbahn; der erste
 * Verkehr einer Autobahn, populate, steht gleich ganz da).
 */
export const APPEAR = 0.7;
/** Größe eines Fahrzeugs age Sekunden nach dem Auftauchen (0…1, weich). */
export const appearScale = (age) => {
  const k = Math.min(1, Math.max(0, age / APPEAR));
  return k * k * (3 - 2 * k);
};

/**
 * Gierwinkel eines Fahrzeugs in unserer Richtung: Spurwechsel, dazu die Scherung seines Rahmens (XXL) und hinter dem
 * Ende der Autobahn E der Bogen der Rampe, über die es hinausfährt (siehe towardsEnd).
 */
function carYaw(c, sh, E) {
  const lane = c.change && c.change.t > c.change.delay ? (c.change.to > c.change.from ? -0.035 : 0.035) : 0;
  const ramp = E && c.lane === 4 && !c.change ? E.rampSlope(c.s - E.fs) : 0;
  return lane - Math.atan((sh ? sh.b : 0) + ramp);
}

export class Traffic {
  constructor(scene, rain) {
    this.scene = scene;
    this.rain = rain;
    this.group = new THREE.Group();
    this.group.name = 'Traffic';
    scene.add(this.group);
    this.cars = [];
    this.oncoming = [];
    this.pool = new Map();
    this.difficulty = 0;
    this.leftOpen = false;
    this.grip = 1;
    this.t = 0;
    this.events = [];
    this.policeText = null;
    // XXL-Welt: Scherung {a, b} des Rahmens der Autobahn, auf der der Verkehr fährt (null = ungeschert), und ob der
    // Spieler gerade woanders fährt (passive: kein Nachschub, keine Begegnungen mit dem Spieler)
    this.shear = null;
    this.passive = false;
    this.growing = true; // neue Fahrzeuge wachsen aus der Straße (APPEAR), außer beim ersten Füllen (populate)
    // XXL-Welt: Ende dieser Autobahn ({fs: Gabelung, s1: Ende der Fahrbahn, openLeft(s): linke Kante des offenen
    // Teils, rampX(u): Versatz der Rampe u Meter hinter der Gabelung}) bzw. ihr Anfang (s), sonst null
    this.end = null;
    this.begin = null;
    // die Baustelle (world/baustelle-plan.js), die das Spiel eingerichtet hat: { s0 } Beginn der Verengung, sonst null.
    // Gerechnet wird ohne ihre Verschwenkung (Spuren wie sonst); erst beim Zeichnen und gegenüber dem Spieler rückt
    // jedes Fahrzeug um bauShift zur Seite
    this.work = null;
  }

  /** Seitlicher Versatz der Fahrbahn bei s durch die Verschwenkung der Baustelle (0 ohne). */
  shiftAt(s) {
    return this.work ? bauShift(s - this.work.s0) : 0;
  }

  /** Ist die Spur zwischen s und s + ahead von der Baustelle gesperrt (die linken beiden, samt Anlauf davor)? */
  workClosed(lane, s, ahead = 0) {
    const W = this.work;
    return !!W && lane < 2 && s + ahead > W.s0 - WORK.lead && s < W.s0 + BAU_LEN;
  }

  acquire(kind) {
    const list = this.pool.get(kind) || [];
    this.pool.set(kind, list);
    let v = list.find((x) => !x.inUse);
    if (!v) {
      v = new Vehicle(kind);
      list.push(v);
      this.group.add(v.group);
    }
    v.inUse = true;
    v.group.visible = true;
    v.setBrake(false);
    v.setBlink(0);
    return v;
  }

  releaseVehicle(v) {
    v.inUse = false;
    v.group.visible = false;
  }

  reset() {
    for (const c of this.cars) this.releaseVehicle(c.v);
    for (const c of this.oncoming) this.releaseVehicle(c.v);
    this.cars = [];
    this.oncoming = [];
    this.events = [];
    // neue Fahrt = wieder entspannter Verkehr (auch nach „Neustart“ aus einer langen Fahrt)
    this.difficulty = 0;
    this.leftOpen = false;
    this.work = null;
  }

  laneSpeed(lane, truck) {
    if (truck) return rand(lane === 2 ? 86 : 80, lane === 2 ? 92 : 89) * KMH;
    const [a, b] = LANE_SPEEDS[lane];
    return rand(a, b + this.difficulty * 15) * KMH;
  }

  /** Neues Fahrzeug einsetzen. */
  spawn(s, lane, { kind, speed, behavior = 'normal' } = {}) {
    const k = kind || randomKind(lane >= 2, lane === 3 ? 0.3 : 0.22);
    const truck = k === 'lkw' || k === 'schwer';
    if (truck && lane < 2) lane = 2 + Math.round(Math.random());
    const v = this.acquire(k);
    const car = {
      id: nextId++,
      v,
      kind: k,
      truck,
      lane,
      x: ROAD.laneCenter(lane),
      s,
      speed: speed ?? this.laneSpeed(lane, truck),
      len: v.length,
      w: v.width,
      v0: 0,
      change: null,
      decideIn: rand(0.5, 2.5),
      brake: false,
      brakeT: 0,
      passed: false,
      behavior,
      sirens: behavior === 'polizei',
      careless: chance(0.08 + this.difficulty * 0.18),
      wobble: Math.random() * 10,
    };
    car.v0 = car.speed;
    car.born = this.growing ? this.t : -Infinity;
    if (behavior === 'polizei') v.setPoliceText?.(this.policeText);
    this.cars.push(car);
    // relativ zum Spieler (Stand des letzten update()), sonst stünde es bis dahin ein Bild lang auf dem Tesla
    this.place(car, this.sPlayer ?? s);
    return car;
  }

  spawnOncoming(sPlayer, ahead = true) {
    const lane = Math.floor(Math.random() * 4);
    const k = randomKind(lane >= 2, 0.2);
    const v = this.acquire(k);
    v.group.rotation.y = Math.PI;
    const truck = k === 'lkw';
    const speed = truck ? rand(80, 89) * KMH : rand(LANE_SPEEDS[lane][0] - 15, LANE_SPEEDS[lane][1]) * KMH;
    const s = sPlayer + (ahead ? rand(700, 1300) : rand(100, 1200));
    // XXL: hinter dem Ende bzw. vor dem Anfang der Autobahn kommt niemand
    if ((this.end && s > this.end.s1 - 30) || (this.begin !== null && s < this.begin + 30)) {
      this.releaseVehicle(v);
      v.group.rotation.y = 0;
      return false;
    }
    const o = { v, s, x: ONCOMING(ROAD.laneCenter(truck ? 2 + Math.round(Math.random()) : lane)), speed, v0: speed, truck, len: v.length, born: this.growing ? this.t : -Infinity };
    // gleich an seinen Platz, sonst steht es ein Bild lang mitten auf dem eigenen Auto
    this.placeOncoming(o, sPlayer);
    this.oncoming.push(o);
    return true;
  }

  populate(sPlayer, playerSpeed) {
    this.reset();
    this.sPlayer = sPlayer;
    // der erste Verkehr steht gleich ganz da (die Autobahn beginnt neu, niemand sah zu)
    this.growing = false;
    for (let i = 0; i < 18; i++) {
      const lane = pickLane();
      const s = sPlayer + 40 + i * 45 + rand(0, 30);
      // XXL: nur auf der Fahrbahn (nicht vor dem Anfang der Autobahn, nicht vor ihrem Ende)
      if (this.laneFree(lane, s, 30) && !(this.begin !== null && s < this.begin + 40) && !(this.end && s > this.end.fs - END_ROOM) && !this.workClosed(lane, s)) this.spawn(s, lane);
    }
    for (let i = 0; i < 10; i++) this.spawnOncoming(sPlayer, false);
    this.growing = true;
  }

  laneFree(lane, s, gap) {
    for (const c of this.cars) {
      if (laneOverlap(c, lane) && Math.abs(c.s - s) < gap + c.len) return false;
    }
    return true;
  }

  /** Offene Fahrbahn auf dieser Spur bei s? XXL: nicht hinter der letzten Ausfahrt, nicht in der Sperrfläche davor. */
  laneOpen(lane, s) {
    const E = this.end;
    return !E || (s < E.fs && ROAD.laneCenter(lane) - LANE_CLEAR >= E.openLeft(s));
  }

  place(c, sPlayer) {
    const d = c.s - sPlayer;
    const sh = this.shear;
    c.v.group.position.set(c.x + this.shiftAt(c.s) + (sh ? sh.a + sh.b * d : 0), 0, -d);
    c.v.group.rotation.y = carYaw(c, sh, this.end);
    c.v.group.scale.setScalar(appearScale(this.t - c.born));
  }

  placeOncoming(o, sPlayer) {
    const d = o.s - sPlayer;
    const sh = this.shear;
    o.v.group.position.set(o.x + (sh ? sh.a + sh.b * d : 0), 0, -d);
    o.v.group.rotation.y = Math.PI - (sh ? Math.atan(sh.b) : 0);
    o.v.group.scale.setScalar(appearScale(this.t - o.born));
  }

  /** XXL: alle Fahrzeuge mit der aktuellen Scherung neu setzen (nach dem Abgleich der Welt in diesem Bild). */
  placeAll(sPlayer) {
    for (const c of this.cars) this.place(c, sPlayer);
    for (const o of this.oncoming) this.placeOncoming(o, sPlayer);
  }

  /** Spieler-Infos: { s, x, speed, len, w } */
  update(dt, t, player, env) {
    this.t = t;
    this.sPlayer = player.s;
    this.events.length = 0;
    this.difficulty = env.difficulty;
    this.leftOpen = env.leftOpen;
    const rainy = env.rain > 0.3;
    setVehicleLights(Math.max(env.rain, env.dim || 0), rainy);

    const target = Math.round(lerp(15, 32, this.difficulty));
    // Fahrzeuge vorne nachliefern
    const E = this.end;
    if (this.cars.length < target && !this.passive) {
      const lane = pickLane();
      const s = player.s + rand(620, 950);
      if (this.laneFree(lane, s, 60) && !(E && s > E.fs - END_ROOM) && !this.workClosed(lane, s)) this.spawn(s, lane);
    }
    // Schnelle Autos von hinten, wenn der Spieler gemütlich fährt
    if (player.speed < 34 && chance(dt * 0.35) && this.cars.length < target + 4 && !this.passive) {
      const lane = chance(0.6) ? 0 : 1;
      const s = player.s - rand(150, 190);
      // startet hinter dem Spieler: zählt nicht als „überholt“
      // nicht mehr kurz vor dem Ende der Autobahn: so schnell käme er dort nicht mehr sanft herunter (endSpeed)
      if (this.laneFree(lane, s, 40) && !(this.begin !== null && s < this.begin + 40) && !(E && s > E.fs - 2 * END_ROOM) && !this.workClosed(lane, s, 600)) this.spawn(s, lane, { speed: rand(170, 215) * KMH }).passed = true;
    }

    const objs = this.cars;
    // Spieler als Hindernis für die KI (rückwärts mit negativem Tempo: wer dahinter fährt, bremst entsprechend früher);
    // fährt er woanders (passive: schon auf der Ausfahrt), ist er für diese Autobahn weg – sonst bremsten die Autos
    // dahinter noch Hunderte Meter hinter der Gabelung vor einem Phantom auf der rechten Spur und wichen ihm aus
    const P = this.passive ? AWAY : { s: player.s, x: player.x - this.shiftAt(player.s), speed: player.v ?? player.speed, len: player.len, w: player.w, isPlayer: true };

    for (const c of objs) {
      if (c.elefantUntil !== undefined && this.t >= c.elefantUntil) {
        c.behavior = 'normal';
        c.elefantUntil = undefined;
        c.v0 = c.cruise ?? c.v0;
        if (c.v.blinkDir) c.v.setBlink(0);
      }
      // der Drängler: klebt am Spieler und blinkt links, bis der Platz macht (dann zieht er vorbei)
      if (c.behavior === 'draengler') this.draengle(c, P);
      // Spurwechsel-Entscheidungen
      c.decideIn -= dt;
      if (!c.change && c.decideIn <= 0) {
        c.decideIn = rand(0.6, 1.6);
        this.decide(c, objs, P);
      }
      if (c.change) {
        const ch = c.change;
        ch.t += dt;
        if (ch.t < ch.delay) {
          c.v.setBlink(ch.to < ch.from ? -1 : 1);
        } else {
          const k = clamp((ch.t - ch.delay) / ch.dur, 0, 1);
          c.x = lerp(ROAD.laneCenter(ch.from), ROAD.laneCenter(ch.to), smoothstep(0, 1, k));
          if (k >= 0.5) c.lane = ch.to;
          if (k >= 1) {
            c.change = null;
            c.v.setBlink(0);
          }
        }
      }
      if (E) this.towardsEnd(c, objs, P);
      else c.closed = false;
      if (this.work) this.towardsWork(c, objs, P);
      // Abstandsregelung (Wunschtempo vor Kurven, am Berg und vor dem Ende der Autobahn gedeckelt)
      const lead = this.leader(c, objs, P);
      const T = c.truck ? 1.7 : c.behavior === 'draengler' ? 0.35 : 1.25 + (c.careless ? -0.4 : 0);
      const aMax = c.truck ? 0.6 : 1.6;
      const b = 2.8;
      const s0 = 3;
      let vc = E ? Math.min(curveSpeed(c, c.s - player.s), endSpeed(c, E)) : curveSpeed(c, c.s - player.s);
      if (this.work) vc = Math.min(vc, workSpeed(c, this.work));
      let acc = aMax * (1 - Math.pow(c.speed / Math.max(1, Math.min(c.v0, vc)), 4));
      if (lead) {
        const gap = Math.max(0.1, lead.s - c.s - (lead.len + c.len) / 2);
        const dv = c.speed - lead.speed;
        const sStar = s0 + Math.max(0, c.speed * T + (c.speed * dv) / (2 * Math.sqrt(aMax * b)));
        acc -= aMax * Math.pow(sStar / gap, 2);
        // der Drängler rauscht heran und hängt sich dicht dran (statt wie alle vorausschauend zu bremsen)
        if (c.behavior === 'draengler' && lead.isPlayer && !c.free) acc = clamp(0.35 * (gap - 10) - 1.25 * dv, -7, 3);
        if (gap < 4 && dv > 0) acc = Math.min(acc, -9);
      }
      // vor einer Kurve (und vor dem Ende der Autobahn) sichtbar (mit Bremslicht), aber sanft abbremsen
      let curveBrake = false;
      if (c.speed > vc + 0.4) {
        const a = -Math.min(c.truck ? 1.4 : 2.2, 0.5 + (c.speed - vc) * 0.5);
        if (a < acc) {
          acc = a;
          curveBrake = true;
        }
      }
      if (c.closed) acc = Math.min(acc, -4);
      acc = clamp(acc, -10, aMax);
      c.speed = Math.max(0, c.speed + acc * dt);
      c.brake = brakeLight(c, acc, dt, curveBrake);
      c.v.setBrake(c.brake);
      c.s += c.speed * dt;
    }

    // Kollisionen der KI untereinander auflösen (sanft)
    for (let i = 0; i < objs.length; i++) {
      for (let j = i + 1; j < objs.length; j++) {
        const a = objs[i];
        const bq = objs[j];
        if (Math.abs(a.x - bq.x) > (a.w + bq.w) / 2 - 0.2) continue;
        const ds = bq.s - a.s;
        const minD = (a.len + bq.len) / 2 + 0.5;
        if (Math.abs(ds) < minD) {
          const back = ds > 0 ? a : bq;
          const front = ds > 0 ? bq : a;
          back.s = front.s - minD;
          back.speed = Math.min(back.speed, front.speed);
        }
      }
    }

    // Spieler-Interaktion: Unfälle, knappe Überholmanöver, Auffahrschutz von hinten
    for (const c of this.passive ? NONE : objs) {
      const cx = c.x + this.shiftAt(c.s);
      const dx = Math.abs(cx - player.x);
      const ds = c.s - player.s;
      const latOverlap = (c.w + player.w) / 2 - dx;
      const lonOverlap = (c.len + player.len) / 2 - Math.abs(ds);
      if (latOverlap > 0.08 && lonOverlap > 0.05) {
        if (ds < 0 && latOverlap > 0.6 && c.speed > player.speed && !(player.v < 0)) {
          // KI würde auffahren: zurücksetzen statt Unfall (fair bleiben); wer rückwärts anstößt, rempelt selbst
          c.s = player.s - (c.len + player.len) / 2 - 0.4;
          c.speed = Math.min(c.speed, player.speed * 0.95);
        } else {
          c.contactT = t; // wer gerade gestreift wurde, zählt beim Vorbeifahren nicht als „haarscharf“
          this.events.push({ type: 'crash', car: c, ds, dx: cx - player.x, latOverlap, lonOverlap });
        }
      }
      // Knapp vorbei
      if (!c.passed && ds < -(c.len + player.len) / 2) {
        c.passed = true;
        const clearance = dx - (c.w + player.w) / 2;
        const rel = player.speed - c.speed;
        const touched = t - (c.contactT ?? -1e9) < 2;
        if (clearance < 0.85 && clearance > -0.05 && rel > 6 && !touched) this.events.push({ type: 'nearMiss', car: c, clearance, rel });
        if (c.behavior === 'polizei') this.events.push({ type: 'passPolice', car: c });
        if (c.behavior === 'schwer') this.events.push({ type: 'passSchwer', car: c });
      }
      if (ds > 0) c.passed = false;
    }

    // Aufräumen + Darstellung
    const keep = [];
    for (const c of objs) {
      const rel = c.s - player.s;
      // wer am Ende der Autobahn über die Rampe hinaus ist, steht schon im Wald der Rampe (solange der Spieler noch
      // auf der Autobahn ist; sonst verschwindet er mit dem Wechsel der Autobahn)
      const gone = E && c.lane === 4 && c.s > E.fs + 160 && !this.passive;
      if (rel < -240 || rel > 1250 || gone) {
        this.releaseVehicle(c.v);
        continue;
      }
      keep.push(c);
      this.place(c, player.s);
      c.v.updateLights(t, c.sirens);
      if (rainy && rel > -10 && rel < 140) {
        const z = -(rel) + c.len / 2;
        this.rain.emit(c.x + this.shiftAt(c.s), z, c.w, c.speed, c.truck ? 2.5 : 1, dt, c);
      }
    }
    this.cars = keep;

    // Gegenverkehr
    const okeep = [];
    for (const o of this.oncoming) {
      // auch der Gegenverkehr nimmt vor Kurven Gas weg (seine Fahrtrichtung zeigt zum Spieler)
      const vt = Math.min(o.v0, curveSpeed(o, o.s - player.s, -1));
      o.speed += clamp(vt - o.speed, -1.6 * dt, 0.8 * dt);
      o.s -= o.speed * dt;
      const rel = o.s - player.s;
      if (rel < -200 || (this.begin !== null && o.s < this.begin + 2)) {
        this.releaseVehicle(o.v);
        o.v.group.rotation.y = 0;
        continue;
      }
      this.placeOncoming(o, player.s);
      okeep.push(o);
    }
    this.oncoming = okeep;
    while (this.oncoming.length < 11 && !this.passive) if (!this.spawnOncoming(player.s, true)) break;
    return this.events;
  }

  leader(c, objs, P) {
    let best = null;
    let bestDs = Infinity;
    // die Spur, beim Wechsel beide (zwei Zahlen statt einer Liste: das läuft je Wagen und Bild)
    const both = c.change && c.change.t >= c.change.delay;
    const l0 = both ? c.change.from : c.lane;
    const l1 = both ? c.change.to : c.lane;
    for (const o of objs) {
      if (o === c) continue;
      const ds = o.s - c.s;
      if (ds <= 0 || ds > 220 || ds >= bestDs) continue;
      if (laneOverlap(o, l0) || laneOverlap(o, l1)) {
        best = o;
        bestDs = ds;
      }
    }
    const ds = P.s - c.s;
    if (ds > 0 && ds < bestDs && (laneOverlap(P, l0) || laneOverlap(P, l1))) best = P;
    return best;
  }

  /** Spurwechsel-Logik (vereinfachtes MOBIL mit Rechtsfahrgebot). */
  decide(c, objs, P) {
    if (c.behavior === 'elefant' || c.behavior === 'kolonne' || c.behavior === 'schwer' || c.behavior === 'begleit' || c.lane === 4) return;
    // der Drängler wechselt nur, um am Spieler vorbeizukommen, sobald der Platz gemacht hat (draengle)
    if (c.behavior === 'draengler' && !c.free) return;
    if (this.end && c.s > this.end.fs - END_ROOM) return; // vor dem Ende der Autobahn nur noch nach rechts (towardsEnd)
    const lead = this.leader(c, objs, P);
    const minLane = c.truck ? 2 : 0;
    // Überholen nach links
    if (lead && c.lane > minLane) {
      const gap = lead.s - c.s - (lead.len + c.len) / 2;
      if (gap < 70 && lead.speed < c.v0 - 2.5) {
        const to = c.lane - 1;
        if (!(c.truck && to < 2) && !this.workClosed(to, c.s, WORK.look) && this.safe(c, to, objs, P)) return this.startChange(c, to);
      }
    }
    // Rechtsfahrgebot
    if (c.lane < 3) {
      const eager = c.behavior === 'schleicher' ? 0.02 : 0.25;
      if (chance(eager)) {
        const to = c.lane + 1;
        if (this.laneClearAhead(c, to, objs, P, 90) && this.safe(c, to, objs, P)) return this.startChange(c, to);
      }
    }
    // Unachtsame Fahrer wechseln manchmal einfach so (schwieriger mit Fortschritt)
    if (c.careless && chance(0.04 + this.difficulty * 0.12)) {
      const to = c.lane + (chance(0.5) ? -1 : 1);
      if (to >= minLane && to <= 3 && !this.workClosed(to, c.s, WORK.look) && this.safe(c, to, objs, P, true)) this.startChange(c, to);
    }
  }

  laneClearAhead(c, lane, objs, P, dist) {
    for (const o of [...objs, P]) {
      if (o === c) continue;
      const ds = o.s - c.s;
      if (ds > -10 && ds < dist && laneOverlap(o, lane)) return false;
    }
    return true;
  }

  safe(c, lane, objs, P, sloppy = false) {
    for (const o of [...objs, P]) {
      if (o === c) continue;
      if (!laneOverlap(o, lane) && !(o.change && o.change.to === lane)) continue;
      const ds = o.s - c.s;
      const need = (o.len + c.len) / 2;
      if (ds >= 0) {
        if (ds - need < Math.max(8, c.speed * (sloppy ? 0.3 : 0.6))) return false;
      } else {
        const gap = -ds - need;
        const closing = o.speed - c.speed;
        const lookBack = o.isPlayer ? (sloppy ? 6 : 14) : 8;
        if (gap < lookBack + Math.max(0, closing) * (sloppy ? 0.6 : 2.2)) return false;
      }
    }
    return true;
  }

  /** XXL: vor dem Ende der Autobahn rechtzeitig nach rechts und über die Rampe hinaus (this.end). */
  towardsEnd(c, objs, P) {
    const E = this.end;
    c.closed = false;
    if (c.lane === 4) {
      if (!c.change) c.x = ROAD.laneCenter(4) + (c.s > E.fs ? E.rampX(c.s - E.fs) : 0);
      return;
    }
    if (c.s < E.fs - END_ROOM) return;
    const left = (s) => ROAD.laneCenter(c.lane) - c.w / 2 - 0.4 < E.openLeft(s);
    // Bremsweg bei den 4 m/s², mit denen ein Fahrzeug vor der Sperrfläche hält (c.closed): er zählt bei beiden
    // Blicken voraus mit, sonst wäre der Wagen schon zu nah, wenn er die Verengung bemerkt
    const stop = (c.speed * c.speed) / 8;
    if (!c.change && left(c.s + stop + 30 + c.speed * 4) && this.safe(c, c.lane + 1, objs, P, true)) {
      this.startChange(c, c.lane + 1);
      c.change.delay = 0.3;
    }
    // die Spur endet gleich und es ging nicht hinüber: anhalten und warten
    c.closed = !c.change && left(c.s + stop + c.len / 2 + 10 + c.speed * 1.2);
  }

  /**
   * Baustelle: rechtzeitig von den gesperrten linken Spuren nach rechts (wie vor dem Ende einer Autobahn,
   * towardsEnd); wer nicht hinüberkommt, hält vor den Baken und wartet auf eine Lücke.
   */
  towardsWork(c, objs, P) {
    const W = this.work;
    if (c.lane >= 2 || c.s < W.s0 - WORK.lead || c.s > W.s0 + BAU_LEN) return;
    const left = (s) => ROAD.laneCenter(c.lane) - c.w / 2 - 0.4 < bauLeftLogical(s - W.s0);
    const stop = (c.speed * c.speed) / 8;
    if (!c.change && left(c.s + stop + 30 + c.speed * 4) && this.safe(c, c.lane + 1, objs, P, true)) {
      this.startChange(c, c.lane + 1);
      c.change.delay = 0.3;
    }
    c.closed = c.closed || (!c.change && left(c.s + stop + c.len / 2 + 10 + c.speed * 1.2));
  }

  startChange(c, to) {
    c.change = { from: c.lane, to, t: 0, delay: c.careless ? rand(0.15, 0.5) : rand(0.9, 1.6), dur: c.truck ? rand(4, 5.5) : rand(2.4, 3.6) };
  }

  /** Megafon-Durchsage: Autos vor dem Spieler machen Platz. */
  megafon(player) {
    let n = 0;
    const P = { s: player.s, x: player.x - this.shiftAt(player.s), speed: player.speed, len: player.len, w: player.w, isPlayer: true };
    for (const c of this.cars) {
      const ds = c.s - player.s;
      if (ds > 0 && ds < 160 && Math.abs(c.x - P.x) < 2.6 && !c.change && c.behavior !== 'elefant') {
        // nur auf freie Nachbarspuren ausweichen; bei Gleichstand lieber nach rechts
        const opts = [c.lane + 1, c.lane - 1].filter((l) => l >= (c.truck ? 2 : 0) && l <= 3 && !this.workClosed(l, c.s, WORK.look) && this.safe(c, l, this.cars, P, true));
        const to = opts.sort((a, b) => Math.abs(ROAD.laneCenter(b) - player.x) - Math.abs(ROAD.laneCenter(a) - player.x))[0];
        if (to !== undefined) {
          c.change = { from: c.lane, to, t: 0, delay: 0.3, dur: 1.8 };
          // eine Weile auf der neuen Spur bleiben, statt per Rechtsfahrgebot gleich zurückzuziehen
          c.decideIn = 10 + rand(0, 5);
          n++;
        }
      }
    }
    return n;
  }

  /** Elefantenrennen: zwei Lkw nebeneinander auf den rechten Spuren. */
  elefantenrennen(sPlayer) {
    const s = sPlayer + 420;
    for (const c of this.cars) {
      if (c.s > s - 60 && c.s < s + 60 && c.lane >= 2) {
        this.releaseVehicle(c.v);
        c.s = -1e9;
      }
    }
    this.cars = this.cars.filter((c) => c.s > -1e8);
    const a = this.spawn(s, 3, { kind: 'lkw', speed: 84 * KMH, behavior: 'elefant' });
    const b = this.spawn(s + 6, 2, { kind: 'lkw', speed: 84.6 * KMH, behavior: 'elefant' });
    // nach 26 s Spielzeit (die Pause und Szenen halten sie an) fahren beide wieder wie alle (update)
    a.elefantUntil = b.elefantUntil = this.t + 26;
    return [a, b];
  }

  /**
   * Verkehrsmuster (game/parts/ereignisse.js): eine Kolonne Wohnmobile auf der rechten Spur, ein Drängler von hinten,
   * ein Schwertransport mit Begleitfahrzeug. Wie beim Elefantenrennen räumen sie sich ihren Platz voraus frei und
   * fahren nach until Sekunden wieder wie alle (Wohnmobile, Drängler) – der Schwertransport bleibt, bis er hinter dem
   * Spieler verschwindet.
   */
  clearAt(s, lanes, span = 60) {
    for (const c of this.cars) {
      if (c.s > s - span && c.s < s + span && lanes.includes(c.lane)) {
        this.releaseVehicle(c.v);
        c.s = -1e9;
      }
    }
    this.cars = this.cars.filter((c) => c.s > -1e8);
  }

  /** Urlaubszeit: n Wohnmobile hintereinander auf der rechten Spur, gemütlich und ohne zu überholen. */
  kolonne(sPlayer, n = 4) {
    const s = sPlayer + 480;
    this.clearAt(s + n * 14, [3], n * 16 + 60);
    const out = [];
    for (let i = 0; i < n; i++) {
      const c = this.spawn(s + i * 28, 3, { kind: 'wohnmobil', speed: (92 + i * 0.4) * KMH, behavior: 'kolonne' });
      c.cruise = c.v0;
      c.elefantUntil = this.t + 70;
      out.push(c);
    }
    return out;
  }

  /** Ein Drängler von hinten auf der Spur des Spielers (nur links, nie hinter einer Baustelle). Liefert ihn oder null. */
  draengler(player) {
    const lane = Math.round((player.x - this.shiftAt(player.s) - ROAD.laneCenter(0)) / ROAD.laneWidth);
    if (lane < 0 || lane > 1 || this.work) return null;
    const s = this.begin !== null ? Math.max(player.s - 160, this.begin + 40) : player.s - 160;
    if (s > player.s - 80 || !this.laneFree(lane, s, 40)) return null;
    const c = this.spawn(s, lane, { kind: 'sport', speed: Math.max(player.speed + 12, 210 * KMH), behavior: 'draengler' });
    c.v0 = 240 * KMH;
    c.cruise = 200 * KMH;
    c.careless = true;
    c.passed = true;
    c.free = false;
    c.elefantUntil = this.t + 30;
    return c;
  }

  /** Drängler: dicht auf, links blinken; hat der Spieler die Spur verlassen, darf er vorbei. */
  draengle(c, P) {
    const ds = P.s - c.s;
    const same = laneOverlap(P, c.lane);
    const behind = ds > 0 && ds < 60 && same;
    if (behind && !c.change) c.v.setBlink(-1);
    else if (!c.change && c.v.blinkDir === -1) c.v.setBlink(0);
    c.close = behind && ds < 25;
    // (Platz gemacht: Der Spieler ist von seiner Spur, solange er dicht dahinter war)
    if (!same && ds > 0 && ds < 80) c.free = true;
  }

  /** Schwertransport: ein Brunnen auf dem Tieflader, rechts mit 60 km/h, dahinter sein Begleitfahrzeug mit Warnlicht. */
  schwertransport(sPlayer) {
    const s = sPlayer + 650;
    this.clearAt(s, [2, 3], 90);
    const a = this.spawn(s, 3, { kind: 'schwer', speed: 60 * KMH, behavior: 'schwer' });
    const b = this.spawn(s - 30, 3, { kind: 'begleit', speed: 60 * KMH, behavior: 'begleit' });
    a.v0 = 60 * KMH;
    b.v0 = 62 * KMH;
    b.v.setBlink(2);
    return [a, b];
  }

  /** Polizei Gifhorn kommt von hinten auf der Überholspur. */
  police(sPlayer, text) {
    this.policeText = text;
    // einzige Rücksicht auf die freigeschaltete Spur: Dort säße sie Mini Adam sonst im Nacken
    const lane = this.leftOpen ? 1 : 0;
    // nicht vor dem Beginn dieser Autobahn (dort ist keine Straße): bis 40 m dahinter, und reicht das nicht für einen
    // Anlauf von hinten, kommt sie diesmal nicht
    const s = this.begin !== null ? Math.max(sPlayer - 170, this.begin + 40) : sPlayer - 170;
    if (s > sPlayer - 60) return null;
    const car = this.spawn(s, lane, { kind: 'polizei', speed: 185 * KMH, behavior: 'polizei' });
    car.v0 = 185 * KMH;
    car.passed = true; // kommt von hinten – erst wenn sie vorbei ist, kann man sie überholen
    return car;
  }

  /** Infos für den Bildschirm / Spiegel */
  nearby(player, range = 130) {
    const out = [];
    for (const c of this.cars) {
      const ds = c.s - player.s;
      if (ds > -25 && ds < range) out.push({ dx: c.x + this.shiftAt(c.s), ds, len: c.len, w: c.w, kind: c.kind, brake: c.brake });
    }
    return out;
  }
}

// Baustelle: lead so weit vor der Verengung sind die linken Spuren für neue Fahrzeuge und Spurwechsel schon zu,
// look so weit schaut ein Fahrer voraus, bevor er nach links wechselt; v Tempo in der Baustelle, dec sanftes Bremsen
const WORK = { lead: 250, look: 400, v: 80 * KMH, dec: 1.0 };

/** Höchsttempo vor und in der Baustelle: sanft herunter auf WORK.v, dahinter wieder frei. */
function workSpeed(c, W) {
  const u = c.s - W.s0;
  if (u > BAU_LEN) return Infinity;
  return Math.sqrt(WORK.v * WORK.v + 2 * WORK.dec * Math.max(0, -u));
}

// so weit vor der letzten Ausfahrt einer endenden Autobahn kommen keine Fahrzeuge mehr hinzu und alle ordnen sich rechts ein
const END_ROOM = 650;
// END_SLOW Meter vor ihr rollen alle nur noch mit END_V, dem Tempo der Rampe: schneller reicht die Verengung nicht,
// um Spur für Spur nach rechts zu kommen oder vor der Sperrfläche zu halten (towardsEnd)
const END_SLOW = 250;
const END_V = 80 * KMH;
// so viel Fahrbahn links der Spurmitte braucht, was vor der Sperrfläche auf einer Spur liegen soll (laneOpen)
const LANE_CLEAR = 1.4;

/**
 * XXL: Höchsttempo vor dem Ende einer Autobahn (E = traffic.end) – wie vor einer Kurve so früh gedeckelt, dass
 * sanftes Bremsen bis END_SLOW vor der letzten Ausfahrt genügt; von dort an und auf der Rampe gilt END_V.
 */
function endSpeed(c, E) {
  const dec = (c.truck ? CURVE.truck : CURVE.car).dec;
  return Math.sqrt(END_V * END_V + 2 * dec * Math.max(0, E.fs - END_SLOW - c.s));
}

/**
 * Höchsttempo, mit dem das Fahrzeug d Meter vor dem Spieler jetzt fahren darf, damit es jede Kurve der nächsten
 * CURVE.look Meter mit sanftem Bremsen bequem nimmt (Infinity: keine Grenze). Lkw zusätzlich langsamer am Berg.
 * dir: Fahrtrichtung entlang d (+1 mit dem Spieler, −1 Gegenverkehr).
 */
function curveSpeed(c, d, dir = 1) {
  const C = c.truck ? CURVE.truck : CURVE.car;
  let v = Infinity;
  for (let u = 0; u <= CURVE.look; u += 25) {
    const k = Math.abs(curveAt(d + dir * u, _cf).k);
    if (k < 1e-5) continue;
    v = Math.min(v, Math.sqrt(C.lat / k + 2 * C.dec * u));
  }
  if (c.truck) {
    const g = dir * curveAt(d, _cf).g;
    if (g > 0.02) v = Math.min(v, c.v0 - (g - 0.02) * 100 * CURVE.climb * KMH);
  }
  return v;
}

function laneOverlap(o, lane) {
  const c = ROAD.laneCenter(lane);
  const lo = Math.max(o.x - o.w / 2, c - 1.875);
  const hi = Math.min(o.x + o.w / 2, c + 1.875);
  return hi - lo > 0.35;
}

function pickLane() {
  const r = Math.random();
  return r < 0.17 ? 0 : r < 0.4 ? 1 : r < 0.66 ? 2 : 3;
}

export { laneOverlap, KMH };
