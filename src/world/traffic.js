// Verkehr: Autos und Lkw mit Abstandsregelung (IDM), Spurwechseln mit Blinker,
// Rechtsfahrgebot, Lkw nur rechts, Elefantenrennen, Polizei Gifhorn und Gegenverkehr.
import * as THREE from 'three';
import { Vehicle, randomKind, setVehicleEnvIntensity } from '../models/vehicles.js';
import { ROAD } from '../textures.js';
import { ONCOMING } from './road.js';
import { clamp, lerp, rand, chance, pick, smoothstep } from '../util.js';

const LANE_SPEEDS = [
  [150, 205],
  [128, 160],
  [112, 138],
  [95, 120],
];
const KMH = 1 / 3.6;

let nextId = 1;

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
  }

  acquire(kind, opts) {
    const list = this.pool.get(kind) || [];
    this.pool.set(kind, list);
    let v = list.find((x) => !x.inUse && !opts);
    if (!v) {
      v = new Vehicle(kind, opts);
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
  }

  laneSpeed(lane, truck) {
    if (truck) return rand(lane === 2 ? 86 : 80, lane === 2 ? 92 : 89) * KMH;
    const [a, b] = LANE_SPEEDS[lane];
    return rand(a, b + this.difficulty * 15) * KMH;
  }

  /** Neues Fahrzeug einsetzen. */
  spawn(s, lane, { kind, speed, behavior = 'normal', opts } = {}) {
    const k = kind || randomKind(lane >= 2, lane === 3 ? 0.3 : 0.22);
    const truck = k === 'lkw';
    if (truck && lane < 2) lane = 2 + Math.round(Math.random());
    const v = this.acquire(k, opts);
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
      passed: false,
      behavior,
      sirens: behavior === 'polizei',
      careless: chance(0.08 + this.difficulty * 0.18),
      wobble: Math.random() * 10,
    };
    car.v0 = car.speed;
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
    const o = { v, s: sPlayer + (ahead ? rand(700, 1300) : rand(100, 1200)), x: ONCOMING(ROAD.laneCenter(truck ? 2 + Math.round(Math.random()) : lane)), speed, len: v.length };
    // gleich an seinen Platz, sonst steht es ein Bild lang mitten auf dem eigenen Auto
    v.group.position.set(o.x, 0, -(o.s - sPlayer));
    this.oncoming.push(o);
  }

  populate(sPlayer, playerSpeed) {
    this.reset();
    this.sPlayer = sPlayer;
    for (let i = 0; i < 18; i++) {
      const lane = pickLane(this.leftOpen);
      const s = sPlayer + 40 + i * 45 + rand(0, 30);
      if (this.laneFree(lane, s, 30)) this.spawn(s, lane);
    }
    for (let i = 0; i < 10; i++) this.spawnOncoming(sPlayer, false);
  }

  laneFree(lane, s, gap) {
    for (const c of this.cars) {
      if (laneOverlap(c, lane) && Math.abs(c.s - s) < gap + c.len) return false;
    }
    return true;
  }

  place(c, sPlayer) {
    c.v.group.position.set(c.x, 0, -(c.s - sPlayer));
  }

  /** Spieler-Infos: { s, x, speed, len, w } */
  update(dt, t, player, env) {
    this.t = t;
    this.sPlayer = player.s;
    this.events.length = 0;
    this.difficulty = env.difficulty;
    this.leftOpen = env.leftOpen;
    const rainy = env.rain > 0.3;
    setVehicleEnvIntensity(rainy);

    const target = Math.round(lerp(15, 32, this.difficulty));
    // Fahrzeuge vorne nachliefern
    if (this.cars.length < target) {
      const lane = pickLane(this.leftOpen);
      const s = player.s + rand(620, 950);
      if (this.laneFree(lane, s, 60)) this.spawn(s, lane);
    }
    // Schnelle Autos von hinten, wenn der Spieler gemütlich fährt
    if (player.speed < 34 && chance(dt * 0.35) && this.cars.length < target + 4) {
      const lane = this.leftOpen ? 1 : chance(0.6) ? 0 : 1;
      const s = player.s - rand(150, 190);
      // startet hinter dem Spieler: zählt nicht als „überholt“
      if (this.laneFree(lane, s, 40)) this.spawn(s, lane, { speed: rand(170, 215) * KMH }).passed = true;
    }

    const objs = this.cars;
    // Spieler als Hindernis für die KI
    const P = { s: player.s, x: player.x, speed: player.speed, len: player.len, w: player.w, isPlayer: true };

    for (const c of objs) {
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
      // Abstandsregelung
      const lead = this.leader(c, objs, P);
      const T = c.truck ? 1.7 : 1.25 + (c.careless ? -0.4 : 0);
      const aMax = c.truck ? 0.6 : 1.6;
      const b = 2.8;
      const s0 = 3;
      let acc = aMax * (1 - Math.pow(c.speed / Math.max(1, c.v0), 4));
      if (lead) {
        const gap = Math.max(0.1, lead.s - c.s - (lead.len + c.len) / 2);
        const dv = c.speed - lead.speed;
        const sStar = s0 + Math.max(0, c.speed * T + (c.speed * dv) / (2 * Math.sqrt(aMax * b)));
        acc -= aMax * Math.pow(sStar / gap, 2);
        if (gap < 4 && dv > 0) acc = Math.min(acc, -9);
      }
      acc = clamp(acc, -10, aMax);
      c.speed = Math.max(0, c.speed + acc * dt);
      c.brake = acc < -1.2;
      c.v.setBrake(c.brake || (c.speed < 3));
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
    for (const c of objs) {
      const dx = Math.abs(c.x - player.x);
      const ds = c.s - player.s;
      const latOverlap = (c.w + player.w) / 2 - dx;
      const lonOverlap = (c.len + player.len) / 2 - Math.abs(ds);
      if (latOverlap > 0.08 && lonOverlap > 0.05) {
        if (ds < 0 && latOverlap > 0.6 && c.speed > player.speed) {
          // KI würde auffahren: zurücksetzen statt Unfall (fair bleiben)
          c.s = player.s - (c.len + player.len) / 2 - 0.4;
          c.speed = Math.min(c.speed, player.speed * 0.95);
        } else {
          c.contactT = t; // wer gerade gestreift wurde, zählt beim Vorbeifahren nicht als „haarscharf“
          this.events.push({ type: 'crash', car: c, ds, dx: c.x - player.x, latOverlap, lonOverlap });
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
      }
      if (ds > 0) c.passed = false;
    }

    // Aufräumen + Darstellung
    const keep = [];
    for (const c of objs) {
      const rel = c.s - player.s;
      if (rel < -240 || rel > 1250) {
        this.releaseVehicle(c.v);
        continue;
      }
      keep.push(c);
      this.place(c, player.s);
      c.v.group.rotation.y = c.change && c.change.t > c.change.delay ? (c.change.to > c.change.from ? -0.035 : 0.035) : 0;
      c.v.updateLights(t, c.sirens);
      if (rainy && rel > -10 && rel < 140) {
        const z = -(rel) + c.len / 2;
        this.rain.emit(c.x, z, c.w, c.speed, c.truck ? 2.5 : 1, dt, c);
      }
    }
    this.cars = keep;

    // Gegenverkehr
    const okeep = [];
    for (const o of this.oncoming) {
      o.s -= o.speed * dt;
      const rel = o.s - player.s;
      if (rel < -200) {
        this.releaseVehicle(o.v);
        o.v.group.rotation.y = 0;
        continue;
      }
      o.v.group.position.set(o.x, 0, -rel);
      okeep.push(o);
    }
    this.oncoming = okeep;
    while (this.oncoming.length < 11) this.spawnOncoming(player.s, true);
    return this.events;
  }

  leader(c, objs, P) {
    let best = null;
    let bestDs = Infinity;
    const lanes = c.change && c.change.t >= c.change.delay ? [c.change.from, c.change.to] : [c.lane];
    for (const o of objs) {
      if (o === c) continue;
      const ds = o.s - c.s;
      if (ds <= 0 || ds > 220 || ds >= bestDs) continue;
      if (lanes.some((l) => laneOverlap(o, l))) {
        best = o;
        bestDs = ds;
      }
    }
    const ds = P.s - c.s;
    if (ds > 0 && ds < bestDs && lanes.some((l) => laneOverlap(P, l))) best = P;
    return best;
  }

  /** Spurwechsel-Logik (vereinfachtes MOBIL mit Rechtsfahrgebot). */
  decide(c, objs, P) {
    if (c.behavior === 'elefant') return;
    const lead = this.leader(c, objs, P);
    const minLane = c.truck ? 2 : 0;
    // Überholen nach links
    if (lead && c.lane > minLane) {
      const gap = lead.s - c.s - (lead.len + c.len) / 2;
      if (gap < 70 && lead.speed < c.v0 - 2.5) {
        const to = c.lane - 1;
        if (!(c.truck && to < 2) && this.safe(c, to, objs, P)) return this.startChange(c, to);
      }
    }
    // Rechtsfahrgebot (bei freigeschalteter linker Spur besonders eifrig)
    if (c.lane < 3 && !(c.truck && c.lane >= 3)) {
      const eager = c.lane === 0 && this.leftOpen ? 0.65 : c.behavior === 'schleicher' ? 0.02 : 0.25;
      if (chance(eager)) {
        const to = c.lane + 1;
        if (this.laneClearAhead(c, to, objs, P, 90) && this.safe(c, to, objs, P)) return this.startChange(c, to);
      }
    }
    // Unachtsame Fahrer wechseln manchmal einfach so (schwieriger mit Fortschritt)
    if (c.careless && chance(0.04 + this.difficulty * 0.12)) {
      const to = c.lane + (chance(0.5) ? -1 : 1);
      if (to >= minLane && to <= 3 && this.safe(c, to, objs, P, true)) this.startChange(c, to);
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

  startChange(c, to) {
    c.change = { from: c.lane, to, t: 0, delay: c.careless ? rand(0.15, 0.5) : rand(0.9, 1.6), dur: c.truck ? rand(4, 5.5) : rand(2.4, 3.6) };
  }

  /** Megafon-Durchsage: Autos vor dem Spieler machen Platz. */
  megafon(player) {
    let n = 0;
    const P = { s: player.s, x: player.x, speed: player.speed, len: player.len, w: player.w, isPlayer: true };
    for (const c of this.cars) {
      const ds = c.s - player.s;
      if (ds > 0 && ds < 160 && Math.abs(c.x - player.x) < 2.6 && !c.change && c.behavior !== 'elefant') {
        // nur auf freie Nachbarspuren ausweichen; bei Gleichstand lieber nach rechts
        const opts = [c.lane + 1, c.lane - 1].filter((l) => l >= (c.truck ? 2 : 0) && l <= 3 && this.safe(c, l, this.cars, P, true));
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
    setTimeout(() => {
      if (b) b.behavior = 'normal';
    }, 26000);
    return [a, b];
  }

  /** Polizei Gifhorn kommt von hinten auf der Überholspur. */
  police(sPlayer, text) {
    this.policeText = text;
    const lane = this.leftOpen ? 1 : 0;
    const car = this.spawn(sPlayer - 170, lane, { kind: 'polizei', speed: 185 * KMH, behavior: 'polizei' });
    car.v0 = 185 * KMH;
    car.passed = true; // kommt von hinten – erst wenn sie vorbei ist, kann man sie überholen
    return car;
  }

  /** Infos für den Bildschirm / Spiegel */
  nearby(player, range = 130) {
    const out = [];
    for (const c of this.cars) {
      const ds = c.s - player.s;
      if (ds > -25 && ds < range) out.push({ dx: c.x, ds, len: c.len, w: c.w, kind: c.kind, brake: c.brake });
    }
    return out;
  }
}

function laneOverlap(o, lane) {
  const c = ROAD.laneCenter(lane);
  const lo = Math.max(o.x - o.w / 2, c - 1.875);
  const hi = Math.min(o.x + o.w / 2, c + 1.875);
  return hi - lo > 0.35;
}

function pickLane(leftOpen) {
  const r = Math.random();
  if (leftOpen) return r < 0.08 ? 0 : r < 0.32 ? 1 : r < 0.62 ? 2 : 3;
  return r < 0.17 ? 0 : r < 0.4 ? 1 : r < 0.66 ? 2 : 3;
}

export { laneOverlap, KMH };
