// Fahrer-Bot: ein simulierter Mensch (Reaktionszeit 220–280 ms, Tasten mit menschlichem Timing, etwas Ungenauigkeit)
// weicht mit der echten Verkehrslogik (src/world/traffic.js, Fahrzeugmodelle durch Attrappen ersetzt) dem Verkehr aus.
// Verglichen werden die alte Lenkung (bis Paket H) und die neue: freies Lenken, Spurwechsel per Tipp und Touch (nur
// ziehen bzw. wie die Bedienung „Wischen“ gedacht ist: Spurwechsel wischen, Korrekturen ziehen).
// Dazu Kurvenstrecken (Autobahnbögen, S-Kurven, Warnkurven, Landstraße) je Stufe der Kurvenhilfe.
//
//   node tools/steer-bot.mjs [km je Variante (300)] [--only=Name] [--seeds=Fahrer (3)] [--gerade | --kurven]
import { Traffic } from '../src/world/traffic.js';
import { CAR_TYPES } from '../src/models/vehicles.js';
import { Player, KMH } from '../src/game/player.js';
import { PROFILES } from '../src/game/trip.js';
import { ROAD } from '../src/textures.js';
import { STEER, CURVE_ASSIST, SteerControl, lateralStep } from '../src/game/steering.js';
import { TOUCH_DEAD } from '../src/ui/touch-model.js';
import { fileURLToPath } from 'url';

const args = process.argv.slice(2);
const KM = +(args.find((a) => /^\d+(\.\d+)?$/.test(a)) || 300);
const ONLY = (args.find((a) => a.startsWith('--only=')) || '').slice(7);
// Fahrer (Startwerte) je Variante; zusammen fahren sie KM Kilometer
const SEEDS = +((args.find((a) => a.startsWith('--seeds=')) || '').slice(8) || 3);
// nur einer der beiden Teile: --gerade (Autobahn mit Verkehr) oder --kurven
const PART = args.includes('--gerade') ? 'gerade' : args.includes('--kurven') ? 'kurven' : '';
// zum Abstimmen: Kennwerte der Lenkung überschreiben, z. B. STEER='{"down":31.5}'
if (process.env.STEER) Object.assign(STEER, JSON.parse(process.env.STEER));
const FPS = 60;
const DT = 1 / FPS;
const LANE = (i) => ROAD.laneCenter(i);
const AB_LANES = [0, 1, 2, 3].map(LANE);

// --- reproduzierbarer Zufall (auch für die Verkehrslogik) -------------------------------------------
function mulberry(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const nativeRandom = Math.random;

// --- Verkehr mit Attrappen statt three.js-Fahrzeugen ---------------------------------------------------
const STUB = {
  group: { position: { set() {} }, rotation: { y: 0 }, visible: true },
  setBrake() {},
  setBlink() {},
  updateLights() {},
  setPoliceText() {},
};
class BotTraffic extends Traffic {
  acquire(kind) {
    const T = CAR_TYPES[kind === 'polizei' ? 'kombi' : kind];
    const dims = kind === 'lkw' ? { length: 16.5, width: 2.55, height: 4 } : { length: T.L, width: T.half * 2 + 0.12, height: T.H };
    return { ...STUB, group: { position: { set() {} }, rotation: { y: 0 }, visible: true }, kind, ...dims };
  }
  releaseVehicle() {}
}
const scene = { add() {} };
const rain = { emit() {} };
// Die Verkehrslogik stellt beim Wetterwechsel Fahrzeugmaterialien um (Leinwand-Texturen): ein stummes Leinwand-Double
if (typeof document === 'undefined') {
  const ctx = new Proxy(function () {}, {
    get: (o, k) => (k === 'measureText' ? () => ({ width: 10 }) : ctx),
    apply: () => ctx,
    set: () => true,
  });
  globalThis.document = { createElement: () => ({ width: 0, height: 0, style: {}, getContext: () => ctx }) };
}

// --- die alte Lenkung (Stand vor Paket H, aus src/game/player.js übernommen) ------------------------------
class LegacyPlayer extends Player {
  update(dt, ctl, env = {}) {
    this.events.length = 0;
    const wet = env.wet || 0;
    const grip = 1 - wet * (1 - this.wetGrip);
    this.cooldown = Math.max(0, this.cooldown - dt);
    this.scrapeCooldown = Math.max(0, this.scrapeCooldown - dt);
    const throttle = Math.min(1, Math.max(0, ctl.throttle));
    const brake = Math.min(1, Math.max(0, ctl.brake));
    this.throttle += (throttle - this.throttle) * (1 - Math.exp(-8 * dt));
    const v = this.speed;
    const vmax = this.vmax;
    let acc = 0;
    if (throttle > 0.02 && v < vmax) acc += throttle * 5.4 * this.accelMul * Math.max(0.12, 1 - Math.pow(Math.min(1, v / vmax), 2.6));
    if (brake > 0.02) acc -= brake * 9.5 * (1 - wet * 0.18);
    if (throttle <= 0.02 && brake <= 0.02) acc -= 0.12 + 0.00011 * v * v;
    if (v > vmax) acc = Math.min(acc, -1.5);
    this.speed = Math.max(0, v + acc * dt);
    if (v <= vmax && this.speed > vmax) this.speed = vmax;
    const steer = Math.min(1, Math.max(-1, ctl.steer));
    const lowSpeed = Math.min(1, Math.max(0, this.speed / 12));
    const latMax = 4.3 * this.latMul * grip * lowSpeed;
    let target;
    if (Math.abs(steer) > 0.08) target = steer * latMax;
    else target = Math.min(1.9, Math.max(-1.9, (LANE(this.lane) - this.x) * 2.0)) * lowSpeed;
    const prev = this.vx;
    this.vx += (target - this.vx) * (1 - Math.exp(-8.5 * grip * dt));
    this.latAcc = (this.vx - prev) / dt;
    this.x += this.vx * dt;
    if (this.x < this.left || this.x > this.right) {
      const side = this.x < this.left ? -1 : 1;
      this.x = side < 0 ? this.left : this.right;
      const hard = Math.abs(this.vx) > 1.2;
      this.vx = -side * Math.min(1.5, Math.abs(this.vx) * 0.4);
      if (this.scrapeCooldown <= 0) {
        this.scrapeCooldown = 0.6;
        this.speed *= hard ? 0.9 : 0.97;
        this.events.push({ type: 'rail', side, hard });
      }
    }
    this.s += this.speed * dt;
  }

  collide(ev) {
    // alte Fassung: der Seitenstoß setzt vx direkt
    const counts = this.cooldown <= 0;
    const c = ev.car;
    const sideHit = ev.lonOverlap > ev.latOverlap * 1.6;
    ev.zone = !sideHit ? (ev.ds > 0 ? 'front' : 'rear') : ev.dx > 0 ? 'right' : 'left';
    if (!sideHit && ev.ds > 0) {
      this.s = c.s - (c.len + this.len) / 2 - 0.35;
      if (counts) {
        this.speed = Math.max(0, Math.min(this.speed, c.speed) - 4);
        c.speed += 2.5;
      } else this.speed = Math.min(this.speed, c.speed);
    } else if (!sideHit && ev.ds < 0) {
      if (counts) {
        this.speed += 2;
        c.speed = Math.max(0, this.speed - 4);
      } else c.speed = Math.min(c.speed, this.speed);
      c.s = this.s - (c.len + this.len) / 2 - 0.4;
    } else {
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
}

// --- Strecken: Krümmung über s ----------------------------------------------------------------------------
/** Aus Abschnitten [Länge, Radius (0 = gerade, > 0 links, < 0 rechts)] mit Übergangsbögen eine Funktion kappa(s). */
function course(parts, ease = 120) {
  const segs = [];
  let s = 0;
  for (const [len, R] of parts) {
    segs.push({ s0: s, s1: s + len, k: R ? 1 / R : 0 });
    s += len;
  }
  const L = s;
  const at = (q) => {
    const u = ((q % L) + L) % L;
    let lo = 0;
    let hi = segs.length - 1;
    while (lo < hi) {
      const m = (lo + hi + 1) >> 1;
      if (segs[m].s0 <= u) lo = m;
      else hi = m - 1;
    }
    return lo;
  };
  const kappa = (q) => {
    // Klothoiden-ähnlicher Übergang: Krümmung wechselt linear über ease Meter um jede Abschnittsgrenze
    const i = at(q);
    const g = segs[i];
    const u = ((q % L) + L) % L;
    const prev = segs[(i - 1 + segs.length) % segs.length];
    const next = segs[(i + 1) % segs.length];
    const a = u - g.s0;
    const b = g.s1 - u;
    if (a < ease / 2) return lerp(prev.k, g.k, 0.5 + a / ease);
    if (b < ease / 2) return lerp(g.k, next.k, 0.5 - b / ease);
    return g.k;
  };
  return { kappa, length: L, segs };
}
const lerp = (a, b, t) => a + (b - a) * t;

function sweepers(rnd) {
  const parts = [];
  for (let i = 0; i < 60; i++) {
    parts.push([200 + rnd() * 600, 0]);
    const R = 500 + rnd() * 2500;
    parts.push([400 + rnd() * 800, (rnd() < 0.5 ? 1 : -1) * R]);
  }
  return course(parts, 160);
}
function sCurves(rnd) {
  const parts = [];
  for (let i = 0; i < 40; i++) {
    parts.push([300 + rnd() * 500, 0]);
    const R = 600 + rnd() * 400;
    const d = rnd() < 0.5 ? 1 : -1;
    parts.push([350, d * R], [350, -d * R]);
  }
  return course(parts, 140);
}
function advisory(rnd) {
  // Warnkurven mit „100“-Schild: 250 … 400 m Radius
  const parts = [];
  for (let i = 0; i < 40; i++) {
    parts.push([900 + rnd() * 600, 0]);
    parts.push([200 + rnd() * 200, (rnd() < 0.5 ? 1 : -1) * (250 + rnd() * 150)]);
  }
  return course(parts, 120);
}
function country(rnd) {
  const parts = [];
  for (let i = 0; i < 80; i++) {
    parts.push([60 + rnd() * 200, 0]);
    parts.push([80 + rnd() * 160, (rnd() < 0.5 ? 1 : -1) * (120 + rnd() * 180)]);
  }
  return course(parts, 50);
}

// --- der simulierte Mensch ------------------------------------------------------------------------------------
const PLEN = 4.69;
// so weit (s) schaut er beim Korrigieren voraus: was die Kurve in dieser Zeit ohne Lenken aus dem Wagen macht
const LOOK = 0.45;
// Fahrstile: wann er ausweicht (Zeit bis zum Auffahren, s) und wie genau er es mit der Spurmitte nimmt (m)
/** Bremsweg (m) bei dieser Annäherung (m/s): kräftig bremsen (6,5 m/s²) nach einer knappen halben Sekunde, plus Abstand. */
const stopDist = (closing) => (closing > 0 ? (closing * closing) / 13 + closing * 0.45 + 8 : 0);

const STYLES = {
  ruhig: { late: 2.4, tol: 0.3 },
  flink: { late: 1.5, tol: 0.3 },
  // Kilometer-Fresser: wie „ruhig“, schaut zum Bremsen aber nur 70 m voraus (bei 230 gegen 90 km/h zu wenig)
  fresser: { late: 2.4, tol: 0.3, short: true },
};
/**
 * Was ein Mensch über die neue Lenkung gelernt hat: wie lange er drücken muss, damit der Wagen um e (m) versetzt stehen
 * bleibt. Gemessen an der Lenkung selbst (Tipp-Stoß, sanfter Anfang, dann voll), je Kennwertsatz einmal.
 */
const learned = new Map();
function pressFor(e, P) {
  if (!(P && P.vq > 0.05)) return e / STEER.vLat + 0.022;
  const key = `${P.vq.toFixed(3)}|${P.up.toFixed(2)}|${P.down.toFixed(2)}|${(P.slow ?? 1).toFixed(3)}|${STEER.ease}|${STEER.easeTo}|${STEER.tapMin}`;
  let tab = learned.get(key);
  if (!tab) {
    tab = [];
    const h = 1 / 1000;
    const env = { v: 36, kappa: 0, assist: 0 };
    const opts = { tip: false, lanes: [], assist: null, vk: 0, h };
    for (let T = 0.02; T <= 1.6001; T += 0.01) {
      const C = new SteerControl();
      const st = { x: 0, u1: 0, u: 0, vs: 0, vc: 0, vi: 0 };
      C.setKey(1, 0, st, opts);
      let released = false;
      for (let t = h; t <= T + 0.6; t += h) {
        if (!released && t >= T) {
          C.setKey(0, t, st, opts);
          released = true;
        }
        lateralStep(st, C.command(t, st, P, opts), P, env, h);
      }
      tab.push([T, st.x]);
    }
    learned.set(key, tab);
  }
  if (e <= tab[0][1]) return tab[0][0];
  for (let i = 1; i < tab.length; i++) {
    if (tab[i][1] >= e) {
      const [ta, ea] = tab[i - 1];
      const [tb, eb] = tab[i];
      return ta + ((tb - ta) * (e - ea)) / Math.max(1e-9, eb - ea);
    }
  }
  return tab[tab.length - 1][0];
}

class Human {
  constructor(rnd, { mode, model, lanes, style = 'ruhig', curveAssist = 0, wet = 0, sideGap = 0, sideOnly = false, swipe = false }) {
    this.rnd = rnd;
    // Touch „Wischen“: Spurwechsel mit einem kurzen Wischer (wie die Bedienung es anbietet), sonst nur ziehen
    this.swipe = swipe;
    this.lane = 0;
    // Seitenabstand in der eigenen Spur (m, 0 = immer zur Mitte), siehe keepSide()
    this.sideGap = sideGap;
    this.sideOnly = sideOnly;
    this.side = 0;
    this.sideUntil = 0;
    this.wet = wet;
    this.mode = mode; // keys | tip | touch
    this.model = model; // old | new
    this.lanes = lanes;
    this.buf = [];
    this.target = null;
    this.key = 0;
    this.keyKind = null;
    this.releaseAt = 0;
    this.nextAllowed = 0;
    this.decideT = 0;
    this.delay = 0.25;
    this.edges = [];
    this.analog = 0;
    this.thumb = 0;
    this.thumbBase = 0;
    this.thumbPulse = 0;
    this.raw = 0;
    this.gas = 0;
    this.gasKey = false;
    this.brake = 0;
    this.presses = 0;
    this.vWish = 130 * KMH;
    const st = STYLES[style];
    this.late = +(process.env.LATE || st.late);
    this.tol = st.tol;
    this.short = !!st.short;
    // gelernt: wie stark der Wagen in Kurven nach außen treibt (wie lange er nach dem Loslassen noch quer läuft und
    // wie weit ein Druck trägt, liest er in act() aus den wirksamen Kennwerten, also auch bei Nässe richtig)
    this.driftGain = model === 'old' ? 0 : (1 - curveAssist) / STEER.mu;
    // ab und zu schaut er kurz weg (Chat, Navi)
    this.lapseAt = 6 + rnd() * 10;
    this.lapseEnd = 0;
  }

  gauss() {
    return (this.rnd() + this.rnd() + this.rnd() - 1.5) * 1.41;
  }

  observe(t, p, cars, kappa) {
    const snap = this.spare && this.buf.length >= 90 ? this.buf.shift() : { cars: [] };
    snap.t = t;
    snap.x = p.x;
    snap.vx = p.vx;
    snap.s = p.s;
    snap.v = p.speed;
    snap.k = kappa;
    snap.cars.length = 0;
    for (const c of cars) snap.cars.push({ s: c.s, x: c.x, v: c.speed, w: c.w, len: c.len, to: c.change ? c.change.to : -1 });
    this.buf.push(snap);
    this.spare = true;
    while (this.buf.length > 90) this.buf.shift();
  }

  seen(t) {
    // was der Mensch jetzt sieht: der Stand vor seiner Reaktionszeit; schaut er gerade weg, der Stand von davor.
    // Wegschauen nur, wenn er gerade keine Taste drückt
    if (t >= this.lapseAt && this.key === 0) {
      this.lapseEnd = t + 0.35 + this.rnd() * 0.5;
      this.lapseFrom = t;
      this.lapseAt = t + 8 + this.rnd() * 14;
    }
    const tt = t < this.lapseEnd ? this.lapseFrom : t;
    let best = this.buf[0];
    for (const b of this.buf) if (b.t <= tt - this.delay + 1e-9) best = b;
    return best;
  }

  /** Lage und Querfahrt jetzt, wie der Mensch sie schätzt (gesehene Lage, mit der gesehenen Querfahrt fortgeschrieben). */
  estimate(t) {
    const b = this.seen(t);
    return { x: b.x + b.vx * (t - b.t) * 0.9, vx: b.vx, b };
  }

  /** Was die Kurve voraus (gesehen mit Reaktionszeit) ohne Lenken an Querfahrt nach außen bringt (m/s, rechts +). */
  drift(b, course) {
    if (!this.driftGain || !course) return 0;
    const k = course.kappa(b.s + b.v * (0.6 + this.delay));
    return this.driftGain * b.v * b.v * k;
  }

  laneOf(x) {
    let best = 0;
    for (let i = 1; i < this.lanes.length; i++) if (Math.abs(this.lanes[i] - x) < Math.abs(this.lanes[best] - x)) best = i;
    return best;
  }

  evalLane(b, L) {
    const c = this.lanes[L];
    let ahead = Infinity;
    let aheadV = 0;
    let behind = Infinity;
    let behindClose = 0;
    let side = false;
    for (const car of b.cars) {
      const occ = (x) => Math.min(x + car.w / 2, c + 1.875) - Math.max(x - car.w / 2, c - 1.875) > 0.3;
      if (!occ(car.x) && !(car.to >= 0 && occ(LANE(car.to)))) continue;
      const ds = car.s - b.s;
      const need = (car.len + PLEN) / 2;
      if (ds > need) {
        if (ds - need < ahead) {
          ahead = ds - need;
          aheadV = car.v;
        }
      } else if (ds < -need) {
        if (-ds - need < behind) {
          behind = -ds - need;
          behindClose = car.v - b.v;
        }
      } else side = true;
    }
    const closing = b.v - aheadV;
    return { ahead, aheadV, ttc: closing > 0.2 ? ahead / closing : Infinity, closing, behind, behindClose, side };
  }

  decide(t) {
    const b = this.seen(t);
    const cur = this.laneOf(b.x);
    if (this.target === null) this.target = cur;
    if (this.lanes.length === 1) return;
    const E = (L) => this.evalLane(b, L);
    const safe = (L) => {
      const e = E(L);
      return !e.side && e.behind > 4 + Math.max(0, e.behindClose) * 1.4 && e.ahead > 8 && e.ttc > 1.2;
    };
    if (this.target !== cur) {
      // unterwegs: abbrechen, wenn es auf der Zielspur eng wird
      if (!safe(this.target) && Math.abs(b.x - this.lanes[this.target]) > 1.4) this.target = cur;
      return;
    }
    const here = E(cur);
    // wie ein Spieler, der Kilometer machen will: weicht spät aus und bremst erst, wenn es keine Lücke gibt – aber
    // nicht später, als der Bremsweg es erlaubt (sonst ist bei 230 gegen 90 km/h nichts mehr zu machen)
    const threat = here.ttc < this.late || here.ahead < Math.max(10, b.v * 0.4) || (!this.short && here.ahead < stopDist(here.closing));
    if (threat) {
      // besser ist eine Spur, auf der er später auffährt; klebt er schon hinter einem Langsameren (keine Annäherung
      // mehr, also Zeit unendlich), zählt, ob nebenan deutlich mehr Platz ist – sonst bliebe er ewig hinter dem Lkw
      const better = (e) => (here.ttc === Infinity ? e.ahead > here.ahead + 15 && e.ttc > this.late + 1 : e.ttc > here.ttc + 1);
      let best = null;
      for (const L of [cur + 1, cur - 1]) {
        if (L < 0 || L >= this.lanes.length || !safe(L)) continue;
        const e = E(L);
        if (better(e) && (!best || e.ttc > best.e.ttc + 0.5 || (e.ttc === best.e.ttc && e.ahead > best.e.ahead))) best = { L, e };
      }
      if (best) this.target = best.L;
    } else if (cur < this.lanes.length - 1 && this.rnd() < 0.08) {
      const e = E(cur + 1);
      if (safe(cur + 1) && e.ttc > 9 && e.ahead > 90) this.target = cur + 1;
    }
  }

  /**
   * Seitenabstand: Er rückt in der eigenen Spur um sideGap von einem Auto auf der Nachbarspur weg, das er gleich
   * überholt oder das neben ihm fährt – erst recht, wenn es zu ihm herüber blinkt –, und bleibt dort, bis eine Sekunde
   * lang kein Grund mehr da ist. Fahren auf beiden Seiten Autos, bleibt er in der Mitte; beim Spurwechsel zählt nur die
   * Zielspur. Mit der alten Lenkung versucht er dasselbe, ihr Spurhalter zieht aber nach jedem Tipp zur Mitte zurück.
   */
  keepSide(t) {
    if (!this.sideGap) return;
    const b = this.seen(t);
    const cur = this.laneOf(b.x);
    if (this.target !== cur) {
      this.side = 0;
      this.sideUntil = 0;
      return;
    }
    const c = this.lanes[cur];
    let left = 0;
    let right = 0;
    for (const car of b.cars) {
      const dx = car.x - c;
      const coming = car.to === cur;
      // Nachbarspur (Mitte 2,4–5,6 m daneben) oder auf dem Weg zu mir, aber noch nicht drin (dann hilft nur Bremse/Ausweichen)
      if (coming ? Math.abs(dx) < 1 : Math.abs(dx) < 2.4 || Math.abs(dx) > 5.6) continue;
      const ds = car.s - b.s;
      const need = (car.len + PLEN) / 2;
      // im Blick: neben mir oder in den nächsten 1,5 s überholt (blinkt es zu mir, schon 2,5 s vorher)
      const reach = need + 6 + Math.max(0, b.v - car.v) * (coming ? 2.5 : 1.5);
      if (ds < -need - 3 || ds > reach) continue;
      // nur Blinker und breite Lkw (sideOnly) oder jedes Auto daneben
      if (this.sideOnly && !coming && car.w < 2.3) continue;
      const w = coming ? 2 : 1;
      if (dx < 0) left = Math.max(left, w);
      else right = Math.max(right, w);
    }
    const want = left === right ? 0 : (left > right ? 1 : -1) * this.sideGap;
    if (want !== 0) {
      this.side = want;
      this.sideUntil = t + 1;
    } else if (t >= this.sideUntil) this.side = 0;
  }

  /** Tempo: Wunschtempo, vor langsameren Autos rechtzeitig bremsen. */
  speedControl(t, p) {
    const b = this.seen(t);
    const cur = this.laneOf(b.x);
    const e = this.lanes.length > 1 ? this.evalLane(b, cur) : { ahead: Infinity, closing: 0 };
    let brake = 0;
    // er schaut so weit voraus, wie er zum Bremsen braucht (mindestens 70 m); wechselt er gerade die Spur, um
    // auszuweichen, bremst er nur noch im Notfall
    const escaping = !this.short && this.target !== null && this.target !== cur;
    if (e.closing > 0 && e.ahead < (this.short ? 70 : Math.max(70, stopDist(e.closing)))) {
      const need = (e.closing * e.closing) / (2 * Math.max(1, e.ahead - 6));
      if ((need > 2.2 && !(escaping && need < 6.5)) || e.ahead < b.v * 0.3) brake = Math.min(1, need / 6 + (e.ahead < b.v * 0.3 ? 0.3 : 0));
    }
    const vw = this.vWishAt ? this.vWishAt(p.s, p) : this.vWish;
    if (p.speed > vw + 2 * KMH) brake = Math.max(brake, Math.min(0.6, (p.speed - vw) / 8));
    // hinter einem Auto, das nicht davonfährt: Abstand halten (knapp 1 s) statt mit Vollgas aufzurücken; wird es
    // eng (unter einer halben Sekunde), leicht bremsen. Sonst schaukelt er sich an einen Lkw heran, bis es rumst.
    const follow = e.ahead < Math.max(8, b.v * 0.9) && e.closing > -1.5;
    if (follow && e.ahead < Math.max(5, b.v * 0.5) && e.closing > -0.5) brake = Math.max(brake, 0.3);
    this.brake = brake;
    // Strom halten wie ein Mensch: Taste drücken, wenn zu langsam, loslassen, wenn das Tempo passt
    if (brake > 0 || follow) this.gasKey = false;
    else if (p.speed < vw - 2.5 * KMH) this.gasKey = true;
    else if (p.speed > vw) this.gasKey = false;
    this.gas = this.gasKey ? 1 : 0;
  }

  press(t, dir, kind, dur = 0) {
    this.key = dir;
    this.keyKind = kind;
    this.pressT = t;
    this.releaseAt = t + dur;
    this.edges.push([t, dir]);
    this.presses++;
  }

  release(t) {
    this.key = 0;
    this.edges.push([t, 0]);
    // erst die Wirkung abwarten, bis er (mit seiner Reaktionszeit) sieht, dass der Wagen ausgerollt ist – ein Tipp der
    // neuen Lenkung wirkt mindestens tapMin –, dann nachkorrigieren
    const end = this.model === 'new' ? Math.max(t, this.pressT + STEER.tapMin) : t;
    this.nextAllowed = end + this.delay + 0.15 + this.rnd() * 0.1;
  }

  /**
   * Eingaben für das Bild [t, t + DT): Tastenkanten zu genauen (menschlich gestreuten) Zeitpunkten bzw. der Daumen.
   * Er schätzt, wo der Wagen gleich stünde, wenn er nichts täte (Ausrollen nach dem Loslassen und was die Kurve voraus
   * in LOOK Sekunden aus ihm macht), und korrigiert, wenn das mehr als tol neben dem Ziel liegt. Was kürzer dauert als
   * seine Reaktionszeit, drückt er „blind“ so lange, wie er es für diesen Weg gelernt hat (mit Streuung); länger hält
   * er, bis er sieht, dass es reicht.
   */
  act(t, p, center, course) {
    const est = this.estimate(t);
    const c = center ?? this.lanes[this.target] + this.side;
    const dr = this.drift(est.b, course);
    // Nachlauf nach dem Loslassen: alte Lenkung ein Glied (8,5/s, nass langsamer), neue drei Glieder (3/down)
    const tStop = this.model === 'old' ? 1 / (8.5 * (1 - this.wet * (1 - p.wetGrip))) : 3 / (p.P.down || STEER.down);
    const rest = (vx, k) => est.x + (vx - dr) * tStop * k + dr * LOOK;
    if (this.mode === 'touch') return this.thumbAct(t, p, c, est, dr, rest);
    if (this.key !== 0) {
      if (this.keyKind === 'tap') {
        if (t + DT > this.releaseAt) this.release(Math.max(t, this.releaseAt));
      } else if ((c - rest(est.vx, 1 + this.gauss() * 0.15)) * this.key <= 0.05) this.release(t + this.rnd() * DT);
      return;
    }
    // erst die Wirkung des letzten Drucks abwarten; beim Wegschauen sieht er nichts Neues, also lenkt er nicht
    if (t < this.nextAllowed || t < this.lapseEnd) return;
    const e = c - rest(est.vx, 1);
    const at = t + this.rnd() * DT;
    const dir = Math.sign(e);
    // so lange trägt ein Druck den Wagen um |e| (gelernt, siehe pressFor); kürzer als ein Tipp wirkt wie ein Tipp
    const T = this.model === 'old' ? Math.abs(e) / Math.max(0.5, p.P.vq || STEER.vLat) + 0.022 : pressFor(Math.abs(e), p.P);
    const planned = (Tp) => this.press(at, dir, 'tap', Tp * (1 + this.gauss() * 0.12));
    if (this.mode === 'tip') {
      // Spurwechsel: ein Tipp; Korrekturen: länger drücken als ein Tipp (sonst wäre es ein Spurwechsel)
      const cur = this.laneOf(est.x);
      const lc = p.ctrl.lc;
      if (lc) {
        // er hat umentschieden (Zielspur wird eng): ein Tipp in die Gegenrichtung bricht den Spurwechsel ab
        if ((this.lanes[this.target] - lc.to) * lc.dir < -0.5) this.press(at, -lc.dir, 'tap', 0.06 + this.rnd() * 0.03);
        return;
      }
      if (this.target !== cur && Math.abs(est.x - this.lanes[cur]) < 0.5) {
        this.press(at, Math.sign(this.lanes[this.target] - est.x), 'tap', 0.06 + this.rnd() * 0.03);
      } else if (Math.abs(e) > 0.8) {
        if (T < this.delay + 0.08) planned(Math.max(0.24, T));
        else this.press(at, dir, 'hold');
      }
      return;
    }
    if (Math.abs(e) <= this.tol) return;
    if (this.model === 'old') {
      // alte Lenkung: der Spurhalter zieht nach jedem Tipp zur Spurmitte, also nur Spurwechsel und grobe Korrekturen
      if (Math.abs(e) < 0.6) this.press(at, dir, 'tap', 0.06 + this.rnd() * 0.03);
      else this.press(at, dir, 'hold');
      return;
    }
    // ein natürlicher Tipp dauert 45–75 ms; was länger dauert als die Reaktionszeit, hält er, bis es reicht
    if (T < this.delay + 0.08) planned(Math.max(0.045 + this.rnd() * 0.03, T));
    else this.press(at, dir, 'hold');
  }

  /**
   * Daumen-Zug: Ein Mensch mit Reaktionszeit regelt nicht stetig. In Kurven hält er den Daumen ruhig so weit
   * ausgelenkt, wie die Kurve voraus verlangt (gelernt), und korrigiert wie mit Tasten – ziehen, warten, zurück –,
   * nur stufenlos. Der Daumen braucht Zeit (höchstens 7 Einheiten pro Sekunde) und zittert ein wenig; die Totzone des
   * Touch-Moduls schluckt das.
   */
  thumbAct(t, p, c, est, dr, rest) {
    const vq = Math.max(0.5, p.P.vq || STEER.vLat);
    this.thumbBase = Math.max(-1, Math.min(1, -dr / vq));
    if (this.swipe && this.swipeAct(t, p, est)) return;
    if (this.key !== 0) {
      const done = this.keyKind === 'tap' ? t >= this.releaseAt : (c - rest(est.vx, 1 + this.gauss() * 0.15 + Math.abs(this.thumbPulse) / 3)) * this.key <= 0.05;
      if (done) {
        this.key = 0;
        this.thumbPulse = 0;
        this.nextAllowed = t + this.delay + 0.1 + this.rnd() * 0.1;
      }
    } else if (t >= this.nextAllowed) {
      const e = c - rest(est.vx, 1);
      if (Math.abs(e) > 0.9) {
        this.key = Math.sign(e);
        this.keyKind = 'hold';
        this.thumbPulse = this.key * Math.min(1, 0.55 + Math.abs(e) / 5);
        this.presses++;
      } else if (Math.abs(e) > this.tol) {
        this.key = Math.sign(e);
        this.keyKind = 'tap';
        this.releaseAt = t + 0.14 + this.rnd() * 0.06;
        this.thumbPulse = this.key * 0.45;
        this.presses++;
      }
    }
    this.thumbMove();
  }

  thumbMove() {
    this.thumb = this.thumb * 0.97 + this.gauss() * 0.004;
    const want = Math.max(-1, Math.min(1, this.thumbBase + this.thumbPulse + this.thumb));
    this.raw += Math.max(-7 * DT, Math.min(7 * DT, want - this.raw));
    this.analog = Math.abs(this.raw) < TOUCH_DEAD ? 0 : this.raw;
  }

  /**
   * Wischen für den Spurwechsel (Touch-Bedienung „Wischen“): Will er in eine andere Spur und steht er noch in seiner,
   * schnippt er den Daumen 0,12–0,2 s zur Seite (währenddessen lenkt der Zug schon mit) und hebt ihn ab: Der Wagen
   * wechselt auf der S-Kurve genau eine Spur. Wird die Zielspur eng, wischt er zurück (bricht ab). Solange die S-Kurve
   * läuft, zieht er nicht (ein Zug würde sie beenden). Gibt true zurück, wenn der Daumen damit beschäftigt ist.
   */
  swipeAct(t, p, est) {
    const lc = p.ctrl.lc;
    if (this.keyKind === 'swipe') {
      if (t >= this.releaseAt) {
        // abheben: der Zug endet sofort, der Wischer zählt
        this.lane = this.key;
        this.key = 0;
        this.keyKind = null;
        this.thumbPulse = 0;
        this.raw = 0;
        this.analog = 0;
        this.nextAllowed = t + this.delay + 0.1 + this.rnd() * 0.1;
        return true;
      }
      this.thumbMove();
      return true;
    }
    if (this.key !== 0 || t < this.nextAllowed || t < this.lapseEnd) return false;
    const cur = this.laneOf(est.x);
    const go = (dir) => {
      this.key = dir;
      this.keyKind = 'swipe';
      this.thumbPulse = dir * (0.55 + this.rnd() * 0.25);
      this.releaseAt = t + 0.12 + this.rnd() * 0.08;
      this.presses++;
      this.thumbMove();
      return true;
    };
    if (lc) {
      // umentschieden (Zielspur wird eng): zurückwischen
      if ((this.lanes[this.target] - lc.to) * lc.dir < -0.5) return go(-lc.dir);
      this.thumbBase = 0;
      this.thumbPulse = 0;
      this.thumbMove();
      return true;
    }
    if (this.target !== cur && Math.abs(est.x - this.lanes[cur]) < 0.6) return go(Math.sign(this.lanes[this.target] - est.x));
    return false;
  }
}

// --- eine Fahrt ----------------------------------------------------------------------------------------------
/** Art eines Remplers: eingekeilt aufgefahren, zu spät ausgewichen, zwischen zwei Spuren, jemand scherte ein, seitlich. */
function bumpKind(e, P, H) {
  const c = e.car;
  if (c.change) return 'einscheren';
  const off = Math.abs(P.x - H.lanes[H.laneOf(P.x)]);
  if (H.key !== 0 || P.laneChanging || Math.abs(P.vs ?? P.vx) > 1) return 'spät';
  if (off > 0.9) return 'zwischen';
  return e.zone === 'front' || e.ds > 0 ? 'eingekeilt' : 'seitlich';
}

function run(cfg) {
  const { model = 'new', mode = 'keys', km = KM, wet = 0, seed = 1, traffic: withTraffic = true, style = 'ruhig' } = cfg;
  const rnd = mulberry(seed * 7919 + 13);
  Math.random = mulberry(seed);
  const P = model === 'old' ? new LegacyPlayer() : new Player();
  const curveAssist = cfg.curveAssist ?? 'sanft';
  if (model === 'new') {
    P.configure({ tip: mode === 'tip', laneAssist: cfg.laneAssist ?? 'sanft', curveAssist, cruise: false });
  }
  P.reset(cfg.upgrades || {});
  const lanes = cfg.lanes || AB_LANES;
  if (cfg.limits) P.setLimits(cfg.limits);
  P.x = cfg.x0 ?? LANE(3);
  P.speed = (cfg.kmh || 120) * KMH;
  // humanModel: zum Prüfen derselbe Mensch wie bei der anderen Lenkung (nur Diagnose)
  const H = new Human(rnd, { mode, model: cfg.humanModel || model, lanes, style, curveAssist: CURVE_ASSIST[curveAssist], wet, sideGap: cfg.sideGap || 0, sideOnly: !!cfg.sideOnly, swipe: !!cfg.swipe });
  H.vWish = (cfg.kmh || 130) * KMH;
  if (cfg.vWishAt) H.vWishAt = cfg.vWishAt;
  H.target = lanes.length - 1;
  const T = new BotTraffic(scene, rain);
  if (withTraffic) T.populate(0, P.speed);
  const course = cfg.course || null;
  const kap = course ? course.kappa : () => 0;
  const M = { zones: {}, kinds: {}, t: 0, bumps: 0, near: 0, rail: 0, under: 0, jerk2: 0, jerkN: 0, off: 0, offT: 0, err: 0, errT: 0, frames: 0 };
  let ax0 = 0;
  let vx0 = 0;
  let t = 0;
  let keyState = 0; // für die alte Lenkung: Tastenzustand, einmal pro Bild abgefragt
  const goal = km * 1000;
  let underWas = false;
  // Sicherung: steht der Wagen, kommt die Fahrt nie an
  const tMax = (goal / (20 * KMH)) + 60;
  while (P.s < goal && t < tMax) {
    H.delay = 0.22 + rnd() * 0.06;
    const kappa = kap(P.s);
    H.observe(t, P, T.cars, kappa);
    if (t >= H.decideT) {
      H.decideT = t + 0.1;
      H.decide(t);
      H.keepSide(t);
    }
    H.speedControl(t, P);
    H.edges.length = 0;
    H.act(t, P, cfg.center, course);
    let ctl;
    if (model === 'old') {
      for (const [, d] of H.edges) keyState = d; // alte Eingabe: nur der Stand zum Bild zählt
      ctl = { steer: keyState, throttle: H.gas, brake: H.brake };
    } else if (mode === 'touch') {
      ctl = { steer: H.analog, lane: H.lane, throttle: H.gas, brake: H.brake };
      H.lane = 0;
    }
    else ctl = { steer: H.key, steerKey: H.key, steerLog: H.edges.map(([te, d]) => [Math.min(1, Math.max(0, (te - t) / DT)), d]), analog: 0, throttle: H.gas, brake: H.brake };
    // der Akku ist hier nicht das Thema: immer voll (sonst rollt der Wagen nach gut 18 km aus und steht)
    P.battery = 100;
    P.update(DT, ctl, { wet, kappa, grade: 0 });
    if (model === 'new' && P.understeer >= 1 && !underWas) M.under++;
    underWas = model === 'new' && P.understeer >= 1;
    for (const e of P.events) if (e.type === 'rail') M.rail++;
    if (withTraffic) {
      const ev = T.update(DT, t, P, { difficulty: Math.min(1, P.s / 16000), leftOpen: false, rain: wet });
      for (const e of ev) {
        if (e.type === 'crash' && P.cooldown <= 0) {
          const kind = bumpKind(e, P, H);
          if (P.collide(e)) {
            if (cfg.onBump) cfg.onBump(e, kind, t, P, H, T);
            M.bumps++;
            M.zones[e.zone || 'front'] = (M.zones[e.zone || 'front'] || 0) + 1;
            M.kinds[kind] = (M.kinds[kind] || 0) + 1;
          }
        } else if (e.type === 'crash') P.collide(e);
        else if (e.type === 'nearMiss') M.near++;
      }
    }
    if (cfg.onFrame) cfg.onFrame(t, P, H, kappa, T);
    // Komfort: Querruck aus der Querfahrt (gleiche Abtastung für alt und neu)
    const ax = (P.vx - vx0) / DT;
    if (M.frames > 2) {
      const j = (ax - ax0) / DT;
      M.jerk2 += j * j;
      M.jerkN++;
    }
    ax0 = ax;
    vx0 = P.vx;
    // Abweichung von der Spurmitte; der Fehler zählt gegen die Linie, die er fahren will (Mitte oder Seitenabstand),
    // ohne die Zeit des Spurwechsels selbst
    const c = cfg.center ?? lanes[H.laneOf(P.x)];
    const dev = Math.abs(P.x - c);
    M.offT += DT;
    if (dev > 0.5) M.off += DT;
    if (H.target === H.laneOf(P.x) && !P.laneChanging) {
      M.err += Math.abs(P.x - c - (cfg.center == null ? H.side : 0)) * DT;
      M.errT += DT;
    }
    t += DT;
    M.frames++;
  }
  Math.random = nativeRandom;
  const dkm = P.s / 1000;
  return {
    km: dkm,
    bumps: M.bumps,
    bumps100: (M.bumps / dkm) * 100,
    near100: (M.near / dkm) * 100,
    rail100: (M.rail / dkm) * 100,
    rail: M.rail,
    under: M.under,
    jerkRms: Math.sqrt(M.jerk2 / Math.max(1, M.jerkN)),
    offPct: (M.off / M.offT) * 100,
    err: M.err / Math.max(1e-9, M.errT),
    keysKm: H.presses / dkm,
    zones: M.zones,
    kinds: M.kinds,
    avgKmh: (dkm * 1000) / t * 3.6,
  };
}

// --- Varianten ------------------------------------------------------------------------------------------------
// Wunschtempo 230 km/h mit dem Software-Upgrade: so fahren Spieler, die Kilometer machen wollen – der Bot muss sich
// spät durch dichten Verkehr fädeln. Dazu das Grundauto mit 190 km/h.
const FAST = { kmh: 230, upgrades: { vmax: 3 } };
const BASE = { kmh: 190 };
const straight = [
  ['Alt (bis Paket H)', { model: 'old', ...FAST }],
  ['Alt, flinker Fahrer', { model: 'old', style: 'flink', ...FAST }],
  ['Neu: freies Lenken (Standard)', { model: 'new', mode: 'keys', ...FAST }],
  ['Neu: freies Lenken, flinker Fahrer', { model: 'new', mode: 'keys', style: 'flink', ...FAST }],
  ['Neu: Spurwechsel per Tipp', { model: 'new', mode: 'tip', ...FAST }],
  ['Neu: Touch-Zug', { model: 'new', mode: 'touch', ...FAST }],
  // Touch-Bedienung „Wischen“ so, wie sie gedacht ist: Spurwechsel mit einem Wischer, Korrekturen mit dem Zug
  ['Neu: Touch, Wischen und Zug', { model: 'new', mode: 'touch', swipe: true, ...FAST }],
  // derselbe Mensch, der in der eigenen Spur von Blinkern und Lkw daneben wegrückt (0,6 m; mit der alten Lenkung
  // zieht deren Spurhalter nach jedem Tipp zur Mitte zurück)
  ['Neu: freies Lenken, Seitenabstand zu Blinkern und Lkw', { model: 'new', mode: 'keys', sideGap: 0.6, sideOnly: true, ...FAST }],
  ['Alt, Seitenabstand zu Blinkern und Lkw', { model: 'old', sideGap: 0.6, sideOnly: true, ...FAST }],
  ['Neu: freies Lenken, Spurhalteassistent an', { model: 'new', mode: 'keys', laneAssist: 'an', ...FAST }],
  ['Neu: freies Lenken, Spurhalteassistent aus', { model: 'new', mode: 'keys', laneAssist: 'aus', ...FAST }],
  ['Alt, nass', { model: 'old', wet: 1, ...FAST }],
  ['Neu: freies Lenken, nass', { model: 'new', mode: 'keys', wet: 1, ...FAST }],
  ['Alt, Grundauto 190 km/h', { model: 'old', ...BASE }],
  ['Neu: freies Lenken, Grundauto 190 km/h', { model: 'new', mode: 'keys', ...BASE }],
  ['Alt, Kilometer-Fresser', { model: 'old', style: 'fresser', ...FAST }],
  ['Neu: freies Lenken, Kilometer-Fresser', { model: 'new', mode: 'keys', style: 'fresser', ...FAST }],
];

const rndC = mulberry(99);
const COURSES = {
  sweep: sweepers(rndC),
  scurve: sCurves(rndC),
  advisory: advisory(rndC),
  country: country(rndC),
};
// Warnkurven: ein vernünftiger Mensch bremst vor dem „100“-Schild auf höchstens 110 km/h
const advWish = (s) => {
  for (let a = 0; a <= 350; a += 25) if (Math.abs(COURSES.advisory.kappa(s + a)) > 1 / 450) return 105 * KMH;
  return 130 * KMH;
};
// Landstraße: Tempo nach Kurvenradius (so viel, wie sich gemütlich anfühlt), höchstens 100 km/h
const landWish = (s) => {
  let k = 0;
  for (let a = 0; a <= 140; a += 20) k = Math.max(k, Math.abs(COURSES.country.kappa(s + a)));
  return Math.min(100 * KMH, Math.max(70 * KMH, Math.sqrt(3.2 / Math.max(k, 1e-4))));
};
const land = PROFILES.land;
const curveRuns = [
  ['Autobahnbögen R 500–3000, 130 km/h', { course: COURSES.sweep, kmh: 130 }],
  ['S-Kurven R 600–1000, 130 km/h', { course: COURSES.scurve, kmh: 130 }],
  ['Warnkurven R 250–400, vor dem Schild auf 105 km/h', { course: COURSES.advisory, kmh: 130, vWishAt: advWish }],
  ['Warnkurven R 250–400, stur 180 km/h', { course: COURSES.advisory, kmh: 180 }],
  ['Landstraße R 120–300, 70–100 km/h (ohne Verkehr)', {
    course: COURSES.country, kmh: 90, vWishAt: landWish, traffic: false, lanes: [9.0], x0: 9.0, limits: { left: land.xmin, right: land.xmax, lanes: land.lanes, vmax: 100 * KMH },
  }],
  ['Autobahnbögen nass', { course: COURSES.sweep, kmh: 130, wet: 1 }],
];

// --- Tabellen ------------------------------------------------------------------------------------------------
const f1 = (v) => (isFinite(v) ? v.toFixed(1) : '–');
const f2 = (v) => (isFinite(v) ? v.toFixed(2) : '–');
function table(title, rows, cols) {
  console.log('\n### ' + title + '\n');
  console.log('| Variante | ' + cols.map((c) => c[0]).join(' | ') + ' |');
  console.log('|---|' + cols.map(() => '---:').join('|') + '|');
  for (const [name, r] of rows) console.log('| ' + name + ' | ' + cols.map((c) => c[1](r)).join(' | ') + ' |');
}

function main() {
  const t0 = Date.now();
  // Rempler-Arten (siehe bumpKind) mit Kurznamen für die Tabelle
  const KINDS = [['eingekeilt', 'keil'], ['spät', 'spät'], ['zwischen', 'zw'], ['einscheren', 'ein'], ['seitlich', 'seit']];
  const COLS = [
    ['km', (r) => f1(r.km)],
    ['Rempler/100 km', (r) => f1(r.bumps100)],
    ['Haarscharf/100 km', (r) => f1(r.near100)],
    ['Querruck RMS (m/s³)', (r) => f1(r.jerkRms)],
    ['Zeit > 0,5 m neben Mitte (%)', (r) => f1(r.offPct)],
    ['Spurmitte-Fehler (m)', (r) => f2(r.err)],
    ['Leitplanke', (r) => String(r.rail)],
    ['Tasten/km', (r) => f1(r.keysKm)],
    ['Ø km/h', (r) => f1(r.avgKmh)],
    ['Rempler v/h/l/r', (r) => ['front', 'rear', 'left', 'right'].map((z) => r.zones[z] || 0).join('/')],
    ['Arten ' + KINDS.map((k) => k[1]).join('/'), (r) => KINDS.map(([k]) => r.kinds[k] || 0).join('/')],
  ];
  const add = (list, key) => list.reduce((a, r) => {
    for (const z in r[key]) a[z] = (a[z] || 0) + r[key][z];
    return a;
  }, {});
  const rows = [];
  for (const [name, cfg] of straight) {
    if ((ONLY && !name.includes(ONLY)) || PART === 'kurven') continue;
    const parts = Array.from({ length: SEEDS }, (_, i) => run({ ...cfg, km: KM / SEEDS, seed: i + 1 }));
    const sum = (k) => parts.reduce((a, r) => a + r[k] * r.km, 0) / parts.reduce((a, r) => a + r.km, 0);
    rows.push([name, {
      km: parts.reduce((a, r) => a + r.km, 0), bumps100: sum('bumps100'), near100: sum('near100'), jerkRms: sum('jerkRms'), offPct: sum('offPct'),
      err: sum('err'), rail: parts.reduce((a, r) => a + r.rail, 0), keysKm: sum('keysKm'), avgKmh: sum('avgKmh'),
      zones: add(parts, 'zones'), kinds: add(parts, 'kinds'),
    }]);
  }
  if (rows.length) table('Gerade Autobahn mit Verkehr (Bot, Reaktionszeit 220–280 ms)', rows, COLS);

  // Kurven je Stufe der Kurvenhilfe
  const CURVE_COLS = [
    ['km', (r) => f1(r.km)],
    ['Spurmitte-Fehler (m)', (r) => f2(r.err)],
    ['Tasten/km', (r) => f1(r.keysKm)],
    ['Leitplanke', (r) => String(r.rail)],
    ['Untersteuern', (r) => String(r.under)],
    ['Rempler/100 km', (r) => f1(r.bumps100)],
    ['Ø km/h', (r) => f1(r.avgKmh)],
  ];
  const CK = Math.max(10, Math.round(KM / 10));
  for (const [cname, ccfg] of PART === 'gerade' ? [] : curveRuns) {
    const crow = [];
    for (const lvl of ['aus', 'sanft', 'stark']) {
      const name = 'Kurvenhilfe ' + lvl;
      if (ONLY && !(cname + name).includes(ONLY)) continue;
      for (const [mname, mcfg] of [['Tasten', { mode: 'keys' }], ['Tipp', { mode: 'tip' }]]) {
        if (mname === 'Tipp' && lvl !== 'sanft') continue;
        crow.push([name + ' · ' + mname, run({ model: 'new', ...mcfg, ...ccfg, curveAssist: lvl, km: CK, seed: 5 })]);
      }
    }
    if (crow.length) table(cname + ` (je ${CK} km)`, crow, CURVE_COLS);
  }
  console.log(`\n(${((Date.now() - t0) / 1000).toFixed(0)} s Rechenzeit)`);
}

export { run, straight, curveRuns, COURSES, LANE, AB_LANES, LegacyPlayer, mulberry };
// nur als Programm aufgerufen rechnen (nicht beim Import durch ein Diagnose-Skript)
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
