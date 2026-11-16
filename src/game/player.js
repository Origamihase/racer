// Fahrphysik des Teslas: Beschleunigung wie ein E-Auto (unten raus kräftig), Software-Drossel,
// sanfter Spurhalteassistent, Leitplanken, Standstreifen, Akku mit Stream-Technik im Kofferraum.
import { clamp, damp } from '../util.js';
import { ROAD } from '../textures.js';
import { TESLA } from '../models/tesla.js';

export const KMH = 1 / 3.6;
export const VMAX_KMH = [200, 215, 233, 261];

const LEFT_LIMIT = -7.8; // Mittelleitplanke
const RIGHT_LIMIT = 10.0; // äußere Leitplanke
const SHOULDER_X = 7.9; // ab hier steht der Tesla mehr als halb auf dem Standstreifen

export class Player {
  constructor() {
    this.reset({});
  }

  /** Neue Fahrt mit den gekauften Upgrades. */
  reset(upgrades = {}) {
    const l = (id) => upgrades[id] || 0;
    this.upgrades = upgrades;
    this.vmaxBase = VMAX_KMH[Math.min(3, l('vmax'))] * KMH;
    this.accelMul = 1 + 0.2 * l('boost');
    this.capacity = 75 + 4 * l('akku');
    this.streamDrain = 0.1 * (1 - 0.15 * l('encoder'));
    this.latMul = 1 + 0.12 * l('reifen');
    this.wetGrip = 0.66 + 0.13 * l('reifen');
    this.maxHits = 3 + l('polster');

    this.s = 0;
    this.x = ROAD.laneCenter(3);
    this.vx = 0;
    this.speed = 95 * KMH;
    this.yaw = 0;
    this.latAcc = 0;
    this.steer = 0;
    this.throttle = 0;
    this.braking = 0;
    this.battery = 100;
    this.hits = 0;
    this.cooldown = 0;
    this.len = TESLA.length;
    this.w = TESLA.width;
    this.shoulderTime = 0;
    this.scrapeCooldown = 0;
    this.sugar = 0; // Bananensaft-Zuckerschub (Sekunden)
    this.wobble = 0; // Koriander-Schütteln (Sekunden)
    this.limiter = 0; // Tempolimit-Hinweis
    this.empty = false;
    this.events = [];
  }

  get kmh() {
    return this.speed * 3.6;
  }

  get vmax() {
    return this.vmaxBase * (this.sugar > 0 ? 1.08 : 1);
  }

  /** Nächste Fahrspur (0 = links … 3 = rechts). */
  get lane() {
    return clamp(Math.round((this.x + 5.625) / 3.75), 0, 3);
  }

  /** Steht der Tesla (überwiegend) auf der linken Spur? */
  get inLeftLane() {
    return this.x < -3.75 - 0.35;
  }

  get onShoulder() {
    return this.x > SHOULDER_X;
  }

  /**
   * @param {number} dt
   * @param {{steer:number, throttle:number, brake:number}} ctl
   * @param {{wet:number}} env
   */
  update(dt, ctl, env = {}) {
    this.events.length = 0;
    const wet = env.wet || 0;
    const grip = 1 - wet * (1 - this.wetGrip);
    this.cooldown = Math.max(0, this.cooldown - dt);
    this.scrapeCooldown = Math.max(0, this.scrapeCooldown - dt);
    this.sugar = Math.max(0, this.sugar - dt);
    this.wobble = Math.max(0, this.wobble - dt);

    // --- Akku --------------------------------------------------------------
    const vr = this.speed / 55;
    const drivePct = 0.25 * vr * vr * (0.4 + 0.6 * Math.max(this.throttle, 0.35));
    const drain = (this.streamDrain + drivePct) * (75 / this.capacity);
    this.battery = Math.max(0, this.battery - drain * dt);
    this.empty = this.battery <= 0;

    // --- Längsdynamik ------------------------------------------------------
    let throttle = this.empty ? 0 : clamp(ctl.throttle, 0, 1);
    const brake = clamp(ctl.brake, 0, 1);
    this.throttle = damp(this.throttle, throttle, 8, dt);
    this.braking = brake;
    const v = this.speed;
    const vmax = this.vmax;
    let acc = 0;
    if (throttle > 0.02 && v < vmax) {
      const k = clamp(v / vmax, 0, 1);
      acc += throttle * 5.4 * this.accelMul * Math.max(0.12, 1 - Math.pow(k, 2.6));
    }
    if (brake > 0.02) acc -= brake * 9.5 * (1 - wet * 0.18);
    if (throttle <= 0.02 && brake <= 0.02) acc -= 0.12 + 0.00011 * v * v + (this.empty ? 1.4 : 0);
    if (v > vmax) acc = Math.min(acc, -1.5);
    this.speed = Math.max(0, v + acc * dt);
    if (v <= vmax && this.speed > vmax) this.speed = vmax; // Software-Drossel

    // --- Querdynamik -------------------------------------------------------
    let steer = clamp(ctl.steer, -1, 1);
    if (this.wobble > 0) steer += Math.sin(this.wobble * 9) * 0.35;
    this.steer = damp(this.steer, steer, 14, dt);
    const lowSpeed = clamp(this.speed / 12, 0, 1);
    const latMax = 4.3 * this.latMul * grip * lowSpeed;
    let target;
    if (Math.abs(steer) > 0.08) {
      target = steer * latMax;
    } else {
      // Spurhalteassistent: sanft in die Mitte der nächsten Spur
      const c = ROAD.laneCenter(this.lane);
      target = clamp((c - this.x) * 2.0, -1.9, 1.9) * lowSpeed;
    }
    const prevVx = this.vx;
    this.vx = damp(this.vx, target, 8.5 * grip, dt);
    this.latAcc = (this.vx - prevVx) / Math.max(dt, 1e-4);
    this.x += this.vx * dt;

    // Leitplanken
    if (this.x < LEFT_LIMIT || this.x > RIGHT_LIMIT) {
      const side = this.x < LEFT_LIMIT ? -1 : 1;
      this.x = side < 0 ? LEFT_LIMIT : RIGHT_LIMIT;
      const hard = Math.abs(this.vx) > 1.2;
      this.vx = -side * Math.min(1.5, Math.abs(this.vx) * 0.4);
      if (this.scrapeCooldown <= 0) {
        this.scrapeCooldown = 0.6;
        this.speed *= hard ? 0.9 : 0.97;
        this.events.push({ type: 'rail', side, hard });
      }
    }

    // Standstreifen
    if (this.onShoulder && this.speed > 5) {
      this.shoulderTime += dt;
    } else {
      this.shoulderTime = Math.max(0, this.shoulderTime - dt * 2);
    }

    this.yaw = clamp(Math.atan2(this.vx, Math.max(this.speed, 4)), -0.22, 0.22);
    this.s += this.speed * dt;
  }

  /** Zusammenstoß verarbeiten. Gibt true zurück, wenn er zählt. */
  collide(ev) {
    // Auseinanderschieben gibt es immer, nur der Karosserie-Punkt hat eine Schonfrist
    const counts = this.cooldown <= 0;
    const c = ev.car;
    const sideHit = ev.lonOverlap > ev.latOverlap * 1.6;
    if (!sideHit && ev.ds > 0) {
      // Auffahren: hinter dem Fahrzeug bleiben
      this.s = c.s - (c.len + this.len) / 2 - 0.35;
      if (counts) {
        this.speed = Math.max(0, Math.min(this.speed, c.speed) - 4);
        c.speed += 2.5;
      } else this.speed = Math.min(this.speed, c.speed);
    } else if (!sideHit && ev.ds < 0) {
      // jemand fährt uns hinten drauf (selten, die KI passt eigentlich auf)
      if (counts) {
        this.speed += 2;
        c.speed = Math.max(0, this.speed - 4);
      } else c.speed = Math.min(c.speed, this.speed);
      c.s = this.s - (c.len + this.len) / 2 - 0.4;
    } else {
      // seitlicher Rempler
      const dir = ev.dx > 0 ? -1 : 1;
      if (counts) {
        this.x += dir * (ev.latOverlap + 0.12);
        this.vx = dir * 3.2;
        this.speed *= 0.93;
        c.speed *= 0.97;
      } else {
        this.x += dir * (ev.latOverlap + 0.05);
        this.vx = dir * Math.max(1.5, this.vx * dir);
      }
    }
    if (!counts) return false;
    this.hits++;
    this.cooldown = 1.6;
    return true;
  }

  charge(pct) {
    this.battery = Math.min(100, this.battery + pct);
    this.empty = false;
  }
}
