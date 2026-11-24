// Gegenverkehr abseits der Autobahn (der Eigentümer, 21.11.2026: „Gegenverkehr außerhalb der Autobahn“): Auf
// Ortsstraßen und Landstraßen (auch dem Zubringer) kommen dem Wagen in der Gegenspur Autos entgegen – die Spur dir −1
// der Querschnitte in trip.js PROFILES –, ab und zu ein Transporter, auf der Landstraße selten ein Wohnmobil. Im Ort
// fahren sie 40–50 km/h, draußen 70–95 km/h, mit den Lichtern des Verkehrs (vorn die Scheinwerfer, hinten die
// Rücklichter, models/vehicles.js).
//
// - Sie tauchen weit voraus auf (GEGEN.spawn) und verschwinden hinter dem Wagen; ihre ganze Strecke bis zum Wagen
//   liegt auf Straßen mit Gegenspur – nie auf der Autobahn, einer Rampe, im Ladepark – und nie an einer Brunneninsel
//   (dort ist die Gegenspur gesperrt, plan.js squareXmin): Vor dem Brunnenplatz kommen sie nur zwischen Wagen und
//   Platz, dahinter erst, wenn er passiert ist.
// - Steht oder fährt der Spieler in ihrer Spur, bremsen sie (GEGEN.brake) und warten; wer dann doch hineinfährt,
//   rempelt (Ereignis 'crash' wie im Verkehr der Autobahn, Game.onCrash). Sonst berühren sie ihn nie, und sie lenken nie
//   in seine Spur: Ihre Spurmitte ist die der Gegenspur (laneX), ihr rechter Rand bleibt links der eigenen Spur.
// - Kommt die Berührung von vorn (ein Bild zuvor lagen beide der Länge nach noch nicht übereinander), ist es ein
//   Frontal-Rempler (headOn, der Besitzer am 24.11.: „fährt man einfach durch das entgegenkommende Auto“): Beide stehen
//   sofort, der Entgegenkommende federt ein Stück zurück (GEGEN.crash) und wartet, der Spieler ebenso (Player.collide);
//   das Ereignis nennt die Annäherung (closing, m/s), nach der die Werkstatt rechnet. Seitlich gestreift (beide waren
//   schon nebeneinander) bleibt es ein seitlicher Rempler.
// - Höchstens GEGEN.max zugleich (je Fahrzeug etwa sieben Zeichenaufrufe), aus einem eigenen kleinen Vorrat.
// Gesetzt werden sie wie der Verkehr: im Rahmen ihres Abschnitts (trip.locate), mit dessen Scherung zum Spieler.
import * as THREE from 'three';
import { Vehicle } from '../../models/vehicles.js';
import { PROFILES } from '../../game/trip.js';
import { squareOf } from './plan.js';
import { appearScale } from '../traffic.js';

const KMH = 1 / 3.6;
export const GEGEN = {
  // [Typ, Gewicht] (CAR_TYPES in models/vehicles.js; einen Bus gibt es dort nicht)
  kinds: {
    stadt: [['klein', 4], ['kompakt', 5], ['limo', 2], ['kombi', 2], ['suv', 2], ['transporter', 1]],
    land: [['klein', 2], ['kompakt', 4], ['limo', 3], ['kombi', 3], ['suv', 3], ['sport', 0.6], ['transporter', 1.2], ['wohnmobil', 0.4]],
  },
  speed: { stadt: [40, 50], land: [70, 95] }, // km/h
  gap: { stadt: [120, 260], land: [260, 560] }, // Abstand zum vorigen Entgegenkommenden (m)
  spawn: { stadt: [190, 280], land: [360, 520] }, // so weit voraus tauchen sie auf (m)
  max: 4,
  behind: 45, // so weit hinter dem Wagen verschwinden sie
  island: 28, // so weit vor und hinter der Brunneninsel (Mitte ± Radius) fährt keiner
  brake: 6, // m/s², wenn der Spieler in ihrer Spur ist
  accel: 2,
  ease: 3, // m/s²: so sanft gehen sie vor dem Ortseingang auf das Tempo im Ort herunter
  look: 90, // so weit voraus achten sie auf ihn
  clear: 0.1, // seitlicher Abstand, unter dem der Spieler als in ihrer Spur gilt (m, zusätzlich zu den halben Breiten)
  taper: 40, // Übergang der Spurmitte zwischen zwei Abschnitten (wie J.taper)
  // nach einem Frontal-Rempler: so lange steht der Entgegenkommende mindestens (s), so federt er zurück (m/s je m/s
  // Annäherung, höchstens back, abklingend mit decel m/s²)
  crash: { stop: 2.5, k: 0.05, back: 2.5, decel: 7 },
};

/** Hat dieser Abschnitt eine Gegenspur, auf der Gegenverkehr fährt? 'stadt', 'land' oder null. */
export function twoWay(sec) {
  if (!sec) return null;
  if (sec.kind === 'stadt') return 'stadt';
  if (sec.kind === 'land' || sec.kind === 'zub') return 'land';
  return null;
}

/** Mitte der Gegenspur eines Abschnitts (Rahmenkoordinate x). */
export function oncomingX(sec) {
  const P = PROFILES[sec.profile];
  const l = P && P.lanes.find((q) => q.dir < 0);
  return l ? l.x : null;
}

/** f() mit rnd als Math.random (ein Fahrzeug zieht Farbe, Kennzeichen und Blinktakt daraus, nicht aus dem des Streams). */
function withRandom(rnd, f) {
  const r = Math.random;
  Math.random = rnd;
  try {
    return f();
  } finally {
    Math.random = r;
  }
}

const pickW = (list, rnd) => {
  let r = rnd() * list.reduce((a, [, w]) => a + w, 0);
  for (const [k, w] of list) {
    r -= w;
    if (r <= 0) return k;
  }
  return list[list.length - 1][0];
};

export class Gegenverkehr {
  /**
   * @param {THREE.Object3D|null} parent Szene (null: ohne Bild, Node-Tests)
   * @param {object} o rnd: Zufall (Standard Math.random), make(kind): Fahrzeug bauen ({ group, length, width,
   *   updateLights?, setBrake? }; Standard: Vehicle aus models/vehicles.js)
   */
  constructor(parent, { rnd = Math.random, make = null } = {}) {
    this.group = new THREE.Group();
    this.group.name = 'Gegenverkehr';
    if (parent) parent.add(this.group);
    this.rnd = rnd;
    this.make = make || ((kind) => withRandom(rnd, () => new Vehicle(kind)));
    this.pool = new Map();
    this.cars = [];
    this.events = [];
    this.next = 0; // nächster Abstand (m), ab dem einer nachkommt
    this.pPrev = null; // wo der Spieler ein Bild zuvor war (von vorn oder von der Seite?)
    this.stats = { spawned: 0, crashes: 0, headOn: 0, max: 0 };
  }

  acquire(kind) {
    const list = this.pool.get(kind) || [];
    this.pool.set(kind, list);
    let v = list.find((x) => !x.inUse);
    if (!v) {
      v = this.make(kind);
      list.push(v);
      this.group.add(v.group);
    }
    v.inUse = true;
    v.group.visible = true;
    v.setBrake?.(false);
    return v;
  }

  release(c) {
    c.v.inUse = false;
    c.v.group.visible = false;
  }

  reset() {
    for (const c of this.cars) this.release(c);
    this.cars = [];
    this.events.length = 0;
    this.next = 0;
    this.pPrev = null;
  }

  /**
   * Darf bei s auf diesem Weg Gegenverkehr fahren? Abschnitt mit Gegenspur, nicht an einer Brunneninsel.
   * Gibt den Abschnitt zurück oder null.
   */
  allowed(path, s) {
    const L = path.sections;
    let i = L.length - 1;
    while (i > 0 && s < L[i].s0) i--;
    const sec = L[i];
    if (!sec || s < sec.s0 || s > sec.s1 || !twoWay(sec)) return null;
    const q = squareOf(sec);
    if (q && Math.abs(s - q.s) < q.r + GEGEN.island) return null;
    return sec;
  }

  /** Ist die ganze Strecke von a bis b (a < b) frei für Gegenverkehr? */
  clearPath(path, a, b) {
    for (let s = a; s < b; s += 8) if (!this.allowed(path, s)) return false;
    return !!this.allowed(path, b);
  }

  /** Spurmitte bei s: die des Abschnitts, an seinen Enden weich in die des Nachbarn übergeführt. */
  laneX(path, sec, s) {
    const x = oncomingX(sec);
    const L = path.sections;
    const i = L.indexOf(sec);
    const h = GEGEN.taper / 2;
    // auf den letzten bzw. ersten h Metern halb in die Spurmitte des Nachbarn (an der Grenze genau die Mitte)
    const up = s > sec.s1 - h;
    const nb = up ? L[i + 1] : s < sec.s0 + h ? L[i - 1] : null;
    const y = nb && twoWay(nb) ? oncomingX(nb) : null;
    if (y === null || y === x) return x;
    const k = up ? (s - (sec.s1 - h)) / (2 * h) : (sec.s0 + h - s) / (2 * h);
    return x + (y - x) * Math.min(0.5, Math.max(0, k));
  }

  spawn(path, s, sec) {
    const kind = twoWay(sec);
    const rnd = this.rnd;
    const k = pickW(GEGEN.kinds[kind], rnd);
    const v = this.acquire(k);
    const [a, b] = GEGEN.speed[kind];
    const pace = rnd();
    const car = {
      v, kind: k, s, sec, x: oncomingX(sec), len: v.length, w: v.width, pace,
      speed: (a + (b - a) * pace) * KMH, stop: 0, back: 0, hit: false, frame: sec.frame, age: 0, sPrev: s,
    };
    this.cars.push(car);
    this.stats.spawned++;
    return car;
  }

  /**
   * Ein Bild. trip: die Fahrt (Weg trip.cur, Abschnitt des Spielers), player: { s, x, speed, len, w }, shears: Map
   * Rahmen → { a, b } (trip.shears()), t: Zeit für die Lichter. Gibt die Ereignisse dieses Bilds zurück.
   */
  update(dt, trip, player, shears, t = 0) {
    this.events.length = 0;
    const path = trip.cur;
    const sP = player.s;
    const sPrev = this.pPrev ?? sP;
    this.pPrev = sP;
    // Nachschub: der nächste weit voraus, wenn der vorige weit genug herangekommen ist
    const here = twoWay(trip.section);
    if (here && this.cars.length < GEGEN.max) {
      const far = this.cars.reduce((m, c) => Math.max(m, c.s), -Infinity);
      const [lo, hi] = GEGEN.spawn[here];
      const want = sP + lo + (hi - lo) * this.rnd();
      if (far === -Infinity || want - far > this.next) {
        const sec = this.allowed(path, want);
        if (sec && this.clearPath(path, sP + 5, want)) {
          this.spawn(path, want, sec);
          const [g0, g1] = GEGEN.gap[twoWay(sec)];
          this.next = g0 + (g1 - g0) * this.rnd();
        }
      }
    }
    // fahren: dem Vordermann (zum Spieler hin) folgen, vor dem Spieler in der eigenen Spur bremsen
    this.cars.sort((a, b) => a.s - b.s);
    for (let i = 0; i < this.cars.length; i++) {
      const c = this.cars[i];
      c.age += dt;
      const sec = this.allowed(path, c.s - 1) || c.sec;
      c.sec = sec;
      const kind = twoWay(sec) || 'stadt';
      const [a, b] = GEGEN.speed[kind];
      let vmax = (a + (b - a) * c.pace) * KMH;
      // vor dem Ortseingang (der nächste Abschnitt zum Spieler hin) rechtzeitig auf das Tempo im Ort
      const nb = path.sections[path.sections.indexOf(sec) - 1];
      if (kind === 'land' && nb && twoWay(nb) === 'stadt') {
        const [p, q] = GEGEN.speed.stadt;
        const vS = (p + (q - p) * c.pace) * KMH;
        vmax = Math.min(vmax, Math.sqrt(vS * vS + 2 * GEGEN.ease * Math.max(0, c.s - sec.s0 - 2)));
      }
      // der Vordermann ist der nächste näher am Spieler
      const lead = this.cars[i - 1];
      if (lead && lead.s > sP - GEGEN.behind) {
        const gap = c.s - lead.s - (c.len + lead.len) / 2 - 8;
        vmax = Math.min(vmax, Math.max(0, lead.speed + gap * 0.5));
      }
      // der Spieler in der Gegenspur voraus: anhalten, bis er weg ist
      const ds = c.s - sP;
      const inLane = player.x - player.w / 2 < c.x + c.w / 2 + GEGEN.clear;
      if (inLane && ds > 0 && ds < GEGEN.look) {
        const room = ds - (c.len + player.len) / 2 - 3;
        vmax = Math.min(vmax, Math.sqrt(2 * GEGEN.brake * Math.max(0, room)));
      }
      if (c.stop > 0) {
        c.stop -= dt;
        vmax = 0;
      }
      const dv = vmax - c.speed;
      c.speed = Math.max(0, c.speed + Math.max(-GEGEN.brake * dt, Math.min(GEGEN.accel * dt, dv)));
      c.sPrev = c.s;
      c.s -= c.speed * dt;
      // nach einem Frontal-Rempler federt er ein Stück zurück
      if (c.back > 0) {
        c.s += c.back * dt;
        c.back = Math.max(0, c.back - GEGEN.crash.decel * dt);
      }
      c.x = this.laneX(path, sec, c.s);
      c.v.setBrake?.(dv < -0.3 || c.speed < 0.5);
      c.v.updateLights?.(t);
    }
    // vorbei oder aus dem erlaubten Stück gefahren (hinter dem Wagen etwa auf die Brunneninsel zu): weg
    for (let i = this.cars.length - 1; i >= 0; i--) {
      const c = this.cars[i];
      if (c.s < sP - GEGEN.behind || (Math.abs(c.s - sP) > 6 && !this.allowed(path, c.s))) {
        this.release(c);
        this.cars.splice(i, 1);
      }
    }
    this.stats.max = Math.max(this.stats.max, this.cars.length);
    // Rempler: nur wer in die Gegenspur gerät (wie im Verkehr der Autobahn: seitlich und der Länge nach überlappend)
    for (const c of this.cars) {
      const dx = c.x - player.x;
      const ds = c.s - sP;
      const half = (c.len + player.len) / 2;
      const latOverlap = (c.w + player.w) / 2 - Math.abs(dx);
      const lonOverlap = half - Math.abs(ds);
      if (latOverlap > 0.08 && lonOverlap > 0.05) {
        // von vorn: Ein Bild zuvor war er noch voraus und lag der Länge nach nicht über dem Wagen
        const before = c.sPrev - sPrev;
        const headOn = before > 0 && half - before <= 0.05;
        const closing = Math.max(0, player.speed) + c.speed;
        const proxy = { s: c.s, speed: -c.speed, len: c.len, w: c.w, x: c.x, behavior: 'normal', oncoming: true };
        // der Entgegenkommende steht danach still, bis der Spieler aus seiner Spur ist (stop)
        c.stop = Math.max(c.stop, headOn ? GEGEN.crash.stop : 1.5);
        if (headOn) {
          c.back = Math.min(GEGEN.crash.back, GEGEN.crash.k * closing);
          this.stats.headOn++;
        }
        c.speed = 0;
        if (!c.hit) this.stats.crashes++;
        c.hit = true;
        this.events.push({ type: 'crash', car: proxy, ds, dx, latOverlap, lonOverlap, headOn, closing });
      } else c.hit = false;
    }
    this.place(trip, sP, shears);
    return this.events;
  }

  /** Setzen wie der Verkehr: Rahmen des Abschnitts (im Bogen eines Knotens der der Autobahn), dazu dessen Scherung. */
  place(trip, sP, shears) {
    for (const c of this.cars) {
      const d = c.s - sP;
      const loc = trip.locate(c.sec, c.s, c.x);
      const sh = shears ? shears.get(loc.frame) : null;
      const vis = !!sh && trip.visible(c.sec);
      c.v.group.visible = vis;
      if (!vis) continue;
      c.v.group.position.set(loc.x + sh.a + sh.b * d, 0, -d);
      c.v.group.rotation.y = Math.PI - Math.atan(sh.b + (loc.slope || 0));
      // im Ort taucht er 190–280 m voraus auf, vor dem Nebel (der beginnt bei klarem Wetter erst bei 300 m): er wächst
      // aus der Straße, statt sichtbar aus dem Nichts zu erscheinen
      c.v.group.scale.setScalar(appearScale(c.age));
    }
  }
}
