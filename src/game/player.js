// Fahrphysik des Teslas: Beschleunigung wie ein E-Auto (unten raus kräftig), Software-Drossel, Tempomat,
// Lenkung mit Kurven (steering.js), Spurwechsel per Tipp, Spurhalteassistent, Leitplanken, Standstreifen,
// Akku mit Stream-Technik im Kofferraum.
//
// Gerechnet wird in festen Teilschritten (STEER.h) auf einem durchgehenden Zeitraster: Tastendrücke wirken ab dem
// Teilschritt, in dem sie geschahen (ctl.steerLog), Längs- und Querdynamik laufen in denselben Schritten. So ist die
// Bahn unabhängig von der Bildrate.
import { clamp } from '../util.js';
import { ROAD } from '../textures.js';
import { TESLA } from '../models/tesla.js';
import { STEER, CURVE_ASSIST, LANE_ASSIST, lateralStep, steerParams, SteerControl } from './steering.js';
import { Damage } from './damage.js';

export const KMH = 1 / 3.6;
export const VMAX_KMH = [200, 215, 233, 261];

const LEFT_LIMIT = -7.8; // Mittelleitplanke
const RIGHT_LIMIT = 10.0; // äußere Leitplanke
const SHOULDER_X = 7.9; // ab hier steht der Tesla mehr als halb auf dem Standstreifen
const LANES = [0, 1, 2, 3].map((i) => ROAD.laneCenter(i));
// Spurmitten zählen für Assistent und Spurwechsel per Tipp nur, wenn sie so weit innerhalb der Grenzen liegen (m)
const LANE_MARGIN = 0.3;
const H = STEER.h;
const G = 9.81;

/** Voreinstellungen der Fahrhilfen (main.js setzt die gespeicherten Werte mit configure()). */
export const DRIVE_DEFAULTS = { tip: false, laneAssist: 'sanft', curveAssist: 'sanft', sens: 1, cruise: false };

/**
 * Rückwärtsgang wie im Tesla: Wer im Stand die Bremse ganz (ab press) hold Sekunden hält, legt R ein; dann fährt die
 * Bremse sanft rückwärts (acc m/s², höchstens vmax ≈ 15 km/h), Strom bremst (brake), und im Stand legt Strom wieder D
 * ein. Ohne Pedal rollt er mit coast aus. still: darunter steht der Wagen (m/s). Zurück geht es höchstens back Meter
 * hinter den weitesten Punkt der Fahrt und nie über limits.back hinaus (dahinter hat die Welt nichts mehr); davor
 * bremst er mit soft m/s² weich bis zum Stand.
 */
export const REVERSE = { press: 0.9, hold: 0.5, still: 0.1, vmax: 4.2, acc: 1.5, brake: 6, coast: 1.2, back: 200, soft: 1.2 };

export class Player {
  constructor() {
    this.opts = { ...DRIVE_DEFAULTS };
    this.ctrl = new SteerControl();
    // wiederverwendete Objekte für die Teilschritte (keine Speicheranforderung pro Bild)
    this.P = {};
    this.env = { v: 0, kappa: 0, assist: 0 };
    this.pq = { v: 0, wet: 0, latMul: 1, sens: 1, wetGrip: 0.66 };
    this.copt = { tip: false, lanes: LANES, assist: null, vk: 0, h: H };
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
    // Zustand des Wagens (Zonen, Schrammen, Pflaster); hits zählt mit
    this.damage = new Damage(this.maxHits);

    this.s = 0;
    // Gang ('D' | 'R'), wie lange die Bremse im Stand schon gehalten wird, weitester Punkt der Fahrt, Ende des
    // Rückwegs (Meter der Straße) und ob der Wagen dort schon angekommen ist (siehe REVERSE)
    this.gear = 'D';
    this.revHold = 0;
    this.sFar = 0;
    this.revFloor = -REVERSE.back;
    this.revEnd = false;
    this.bumpFwd = 0; // so weit hat ein Rempler rückwärts den Wagen nach vorn geschoben (Game zieht es von revDebt ab)
    this.x = ROAD.laneCenter(3);
    // Querdynamik (siehe steering.js): Lenkbefehl u (mit Vorstufe u1), Anteile Spieler / Kurve / Stoß
    this.u1 = 0;
    this.u = 0;
    this.vs = 0;
    this.vc = 0;
    this.vi = 0;
    this.as = 0;
    this.ac = 0;
    this.over = 0;
    this.vx = 0;
    this.speed = 95 * KMH;
    this.yaw = 0;
    this.psi = 0;
    this.latAcc = 0;
    this.latAccSm = 0; // geglättet, nur für Kamera und Wankbewegung
    this.steer = 0;
    this.wheel = 0;
    this.understeer = 0;
    this.squeal = 0; // Reifen an der Haftgrenze (0 … 1) für den Ton
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
    // Tempomat: gehaltenes Tempo (m/s); null = aus
    this.cruiseSet = this.opts.cruise ? this.speed : null;
    this.aAuto = 0; // Beschleunigung von Tempomat und Drossel (ruckfrei nachgeführt)
    // Simulationsuhr (s): Zeitpunkt des Bildendes, für die Tastenkanten
    this.clock = 0;
    // letzte Krümmung und wo sie galt (zum Fortschreiben innerhalb eines Bildes)
    this.kPrev = 0;
    this.kS = null;
    this.ctrl.reset();
    // Grenzen der Welt: klassisch die feste Autobahn; die XXL-Welt setzt sie jedes Bild neu (setLimits)
    this.limits = { left: LEFT_LIMIT, right: RIGHT_LIMIT, shoulder: SHOULDER_X, lanes: null, extraLane: null, vmax: Infinity, decel: 0, slack: 0, back: 0 };
    this.lanes = [];
    this.laneKey = null;
    this.setLimits(this.limits);
  }

  /** Fahrhilfen und Lenkempfindlichkeit (siehe DRIVE_DEFAULTS). */
  configure(opts) {
    Object.assign(this.opts, opts);
    if (!this.opts.cruise) this.cruiseSet = null;
    else if (this.cruiseSet === null) this.cruiseSet = this.speed;
  }

  /**
   * Grenzen der Welt an der aktuellen Stelle; nicht angegebene Werte bleiben. left/right: Grenzen für die Wagenmitte
   * (Leitplanken, m), shoulder: ab hier zählt der Standstreifen (Infinity = keiner), lanes: Spuren wie in
   * trip.profile() ([{ x, dir, closed }], auch bloße Zahlen; null = die klassischen vier), extraLane: zusätzliche
   * Spur bei x (Ein- und Ausfädelstreifen, null = keine), vmax: Tempo-Obergrenze in m/s (Infinity = keine, 0 = Halt),
   * decel: Verzögerung in m/s², mit der vmax gerade planmäßig fällt (die XXL-Welt bremst so vor einem Tempolimit und
   * vor dem Halt am Ziel; 0 = fester Wert): Drossel und Tempomat bremsen dann mit, statt der Grenze nachzulaufen.
   * slack: Querbewegung nach außen in m/s, bis zu der eine Grenze den Wagen nur mitschiebt (siehe rails; 0 = feste
   * Leitplanke wie klassisch, die XXL-Welt gibt ihren wandernden Grenzen dieses Spiel). back: bis hierher (Meter der
   * Straße) darf der Rückwärtsgang zurück (klassisch der Start, die XXL-Welt der Anfang ihres Abschnitts).
   */
  setLimits(l = {}) {
    const L = this.limits;
    if (l.left !== undefined) L.left = l.left;
    if (l.right !== undefined) L.right = l.right;
    if (l.shoulder !== undefined) L.shoulder = l.shoulder;
    if (l.lanes !== undefined) L.lanes = l.lanes;
    if (l.extraLane !== undefined) L.extraLane = l.extraLane;
    if (l.vmax !== undefined) L.vmax = l.vmax >= 0 ? l.vmax : Infinity;
    if (l.decel !== undefined) L.decel = l.decel > 0 ? l.decel : 0;
    if (l.slack !== undefined) L.slack = l.slack > 0 ? l.slack : 0;
    if (l.back !== undefined) L.back = l.back;
    // befahrbare Spuren (unsere Richtung, nicht gesperrt, innerhalb der Grenzen) für den Spurhalteassistenten und den
    // Spurwechsel per Tipp: nur neu bestimmen, wenn sich etwas daran geändert hat, und ohne neue Felder
    const lanes = L.lanes || LANES;
    if (lanes === this.laneKey && L.left === this.laneL && L.right === this.laneR && L.extraLane === this.laneX) return;
    this.laneKey = lanes;
    this.laneL = L.left;
    this.laneR = L.right;
    this.laneX = L.extraLane;
    const out = this.lanes;
    out.length = 0;
    const lo = L.left + LANE_MARGIN;
    const hi = L.right - LANE_MARGIN;
    for (let i = 0; i <= lanes.length; i++) {
      const ln = i < lanes.length ? lanes[i] : L.extraLane;
      if (ln === null || ln === undefined) continue;
      const x = typeof ln === 'number' ? ln : ln.dir === undefined || ln.dir > 0 ? (ln.closed ? NaN : ln.x) : NaN;
      if (x >= lo && x <= hi) out.push(x);
    }
    // keine Spur passt (Engstelle): die Mitte des freien Raums
    if (!out.length) out.push((L.left + L.right) / 2);
  }

  get kmh() {
    return this.speed * 3.6;
  }

  /** Tempo längs der Straße mit Richtung (m/s): im Rückwärtsgang negativ; speed bleibt immer der Betrag. */
  get v() {
    return this.gear === 'R' ? -this.speed : this.speed;
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
    return this.x > this.limits.shoulder;
  }

  /** Spurwechsel per Tipp läuft gerade (für Anzeigen und den Bot). */
  get laneChanging() {
    return !!this.ctrl.lc;
  }

  /**
   * @param {number} dt
   * @param {{steer:number, throttle:number, brake:number, steerKey?:number, steerLog?:Array<[number, number]>,
   *   analog?:number, lane?:number}} ctl steerKey: Lenktasten am Bildende (−1/0/1), steerLog: ihre Kanten in diesem
   *   Bild als [Anteil 0 … 1 am Bild, Richtung], analog: Stick oder Touch-Zug, lane: Spurwechsel-Wunsch (Wischen).
   *   steer ist die Summe für ältere Leser; fehlen Tastenstand und Protokoll oder hat jemand steer selbst gesetzt
   *   (Autopilot), lenkt steer stufenlos.
   * @param {{wet?:number, kappa?:number, grade?:number}} env Nässe 0 … 1, Krümmung (1/m, > 0 links), Steigung dh/ds
   */
  update(dt, ctl, env = {}) {
    this.events.length = 0;
    const wet = env.wet || 0;
    const kappa = env.kappa || 0;
    const grade = env.grade || 0;
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

    // --- Eingaben dieses Bildes ----------------------------------------------
    const throttle = this.empty ? 0 : clamp(ctl.throttle || 0, 0, 1);
    const brake = clamp(ctl.brake || 0, 0, 1);
    // Gang (REVERSE): R legt nur der Spieler selbst ein (env.reverse), nie Autopilot, Vorführung oder Halt; ohne
    // diese Erlaubnis bremst R bis zum Stand und legt D ein
    const mayR = env.reverse === true;
    this.mayR = mayR;
    if (this.gear === 'D') {
      const hold = mayR && brake >= REVERSE.press && this.speed < REVERSE.still && this.limits.vmax > 0;
      this.revHold = hold ? this.revHold + dt : 0;
      if (this.revHold >= REVERSE.hold) this.shift('R');
    } else if (this.speed < REVERSE.still && (clamp(ctl.throttle || 0, 0, 1) > 0.02 || !mayR)) this.shift('D');
    this.revFloor = Math.max(this.sFar - REVERSE.back, this.limits.back);
    // im Rückwärtsgang bremst das Strompedal (die Bremslichter folgen ihm)
    this.braking = this.gear === 'R' ? (mayR ? throttle : 1) : brake;
    const keyed = ctl.steerLog && ctl.steerKey !== undefined && (ctl.steer || 0) === (ctl.steerKey || ctl.analog || 0);
    const log = keyed ? ctl.steerLog : null;
    const C = this.ctrl;
    C.analog = clamp(keyed ? ctl.analog || 0 : ctl.steer || 0, -1, 1);
    const o = this.opts;
    const copt = this.copt;
    copt.tip = !!o.tip;
    copt.lanes = this.lanes;
    copt.assist = LANE_ASSIST[o.laneAssist] || null;
    const E = this.env;
    E.kappa = kappa;
    E.assist = CURVE_ASSIST[o.curveAssist] ?? 0;
    const pq = this.pq;
    pq.wet = wet;
    pq.latMul = this.latMul;
    pq.sens = o.sens;
    pq.wetGrip = this.wetGrip;

    // --- Teilschritte -------------------------------------------------------------------------
    // Das Bild wird an den Tastenkanten geteilt und jedes Stück in gleiche Schritte von höchstens STEER.h zerlegt:
    // Jede Kante wirkt genau zu ihrem Zeitpunkt, und der letzte Schritt endet genau am Bildende (kein Zeitversatz
    // zwischen Bild und Physik, also kein Ruckeln). So fährt dasselbe Tastenskript bei jeder Bildrate dieselbe Bahn.
    const t0 = this.clock;
    const t1 = t0 + dt;
    const keyNow = keyed ? Math.sign(ctl.steerKey) : 0;
    // verlorene Kanten (Pause, Menü) oder ein Aufrufer ohne Protokoll: Tastenstand gleich zu Bildbeginn abgleichen
    if ((!log || !log.length) && C.key !== keyNow) C.setKey(keyNow, t0, this, copt);
    // Spurwechsel-Wunsch (Wischen auf dem Handy)
    if (ctl.lane) C.requestLane(Math.sign(ctl.lane), this, copt);
    // Krümmung: der Aufrufer misst sie am Bildanfang; innerhalb des Bildes wird sie aus dem letzten Wert
    // fortgeschrieben (stetige Klothoiden genau, Sprünge bleiben Sprünge) – das hält auch Kurven bildratenfest
    const s0 = this.s;
    let kSlope = 0;
    if (this.kS !== null && s0 - this.kS > 0.05 && Math.abs(kappa - this.kPrev) < 0.002) kSlope = (kappa - this.kPrev) / (s0 - this.kS);
    this.kPrev = kappa;
    this.kS = s0;
    let li = 0;
    let aSum = 0;
    let over = 0;
    let N = 0;
    let ta = t0;
    while (dt > 0) {
      // Kanten, die jetzt fällig sind
      while (log && li < log.length && t0 + log[li][0] * dt <= ta + 1e-9) {
        C.setKey(log[li][1], ta, this, copt);
        li++;
      }
      const tb = log && li < log.length ? Math.min(t1, t0 + log[li][0] * dt) : t1;
      const n = Math.max(1, Math.ceil((tb - ta) / H - 1e-6));
      const h = (tb - ta) / n;
      copt.h = h;
      for (let k = 1; k <= n && h > 0; k++) {
        const t = ta + k * h;
        this.longStep(throttle, brake, wet, grade, h);
        E.v = this.speed;
        pq.v = this.speed;
        steerParams(this.P, pq);
        E.kappa = kappa + kSlope * (this.s - s0);
        copt.vk = this.speed * this.speed * E.kappa;
        let d = C.command(t, this, this.P, copt);
        // Koriander: der Wagen schlingert ein wenig (sanft, vorhersehbar)
        if (this.wobble > 0) d = clamp(d + Math.sin(this.wobble * 9 + t * 2) * 0.22, -1, 1);
        lateralStep(this, d, this.P, E, h);
        this.rails();
        aSum += (this.as + this.ac - STEER.imp * this.vi) * h;
        over = Math.max(over, this.over);
        N++;
      }
      ta = tb;
      if (tb >= t1 - 1e-12) break;
    }
    for (; log && li < log.length; li++) C.setKey(log[li][1], t1, this, copt);
    if (log && log.length && C.key !== keyNow) C.setKey(keyNow, t1, this, copt);
    this.clock = t1;
    if (this.s > this.sFar) this.sFar = this.s;
    // am Ende des Rückwegs angekommen, die Bremse noch gehalten: einmal melden (NOMI sagt es)
    if (this.gear === 'R' && !this.revEnd && brake > 0.5 && this.s - this.revFloor < 0.3) {
      this.revEnd = true;
      this.events.push({ type: 'reverseEnd' });
    }

    // --- Ausgaben für Anzeige, Kamera und Spielregeln ------------------------------
    this.vx = this.vs + this.vc + this.vi;
    if (N && dt > 0) this.latAcc = aSum / dt;
    this.latAccSm += (clamp(this.latAcc, -12, 12) - this.latAccSm) * (1 - Math.exp(-8 * dt));
    this.steer = this.u;
    // Lenkrad, Hände und Vorderräder: der Lenkbefehl plus das, was die Kurve gerade braucht
    this.wheel = clamp(this.u + this.ac / STEER.wheelAcc, -1.35, 1.35);
    // rückwärts führt das Heck: Die Nase dreht zur Gegenseite der Querbewegung (lenkt man links, geht das Heck nach
    // links und die Nase nach rechts – wie bei jedem echten Auto)
    const nose = this.gear === 'R' ? -1 : 1;
    this.psi = nose * Math.atan2(this.vx, Math.max(this.speed, 1));
    this.yaw = nose * clamp(Math.atan2(this.vx, Math.max(this.speed, 4)), -0.22, 0.22);
    const was = this.understeer;
    this.understeer = clamp(over, 0, 1.5);
    if (this.understeer >= 1 && was < 1) this.events.push({ type: 'understeer' });
    // Quietschen: leise ab 85 % der Haftung, voll, wenn der Wagen deutlich schiebt
    const use = this.P.grip > 0 ? Math.abs(this.ac) / this.P.grip : 0;
    this.squeal = clamp((use - 0.85) / 0.15, 0, 1) * 0.6 + clamp(this.understeer, 0, 1) * 0.4;

    // Standstreifen
    if (this.onShoulder && this.speed > 5) {
      this.shoulderTime += dt;
    } else {
      this.shoulderTime = Math.max(0, this.shoulderTime - dt * 2);
    }
  }

  /** Ein Teilschritt der Längsdynamik (Strom, Bremse, Tempomat, Steigung, Tempo-Obergrenzen). */
  longStep(throttleIn, brake, wet, grade, H) {
    if (this.gear === 'R') return this.reverseStep(throttleIn, brake, wet, grade, H);
    const v = this.speed;
    // steil bergauf etwas weniger Höchsttempo (bei 6 % gut 3 %, bei 8 % 6 %)
    const vmax = this.vmax * (1 - 1.2 * Math.max(0, grade - 0.03));
    const top = Math.min(vmax, this.limits.vmax);
    // fällt die Obergrenze der Welt gerade planmäßig, bremst der Wagen mit ihr mit (sonst liefe er ihr hinterher)
    const fall = this.limits.vmax < vmax ? this.limits.decel : 0;
    const slope = G * grade * 0.55; // Hangabtrieb, bewusst gedämpft
    const drag = 0.12 + 0.00011 * v * v;
    // die Bremse gewinnt immer: wer beide Pedale tritt, bremst
    let throttle = brake > 0.02 ? 0 : throttleIn;
    let acc = 0;
    if (this.cruiseSet !== null && brake <= 0.02 && throttle <= 0.02) {
      // Tempomat: hält das gesetzte Tempo, auch am Berg; Obergrenzen der Welt übernimmt er ruckfrei
      const want = clamp((Math.min(this.cruiseSet, top) - v) * 0.9, -2.2, 1.6) - (top < this.cruiseSet ? fall : 0);
      this.aAuto += clamp(want - this.aAuto, -5 * H, 5 * H);
      acc = this.aAuto;
      throttle = clamp((acc + drag + slope) / 5.4, 0, 1);
    } else {
      if (throttle > 0.02 && v < top) {
        acc += throttle * 5.4 * this.accelMul * Math.max(0.12, 1 - Math.pow(clamp(v / vmax, 0, 1), 2.6));
      }
      if (brake > 0.02) acc -= brake * 9.5 * (1 - wet * 0.18);
      if (throttle <= 0.02 && brake <= 0.02) acc -= drag + (this.empty ? 1.4 : 0);
      acc -= slope;
      // über der Obergrenze sanft herunter (Software-Drossel, Tempolimit der Welt)
      if (v > top) acc = Math.min(acc, -fall - clamp((v - top) * 0.8, 0.3, v > vmax ? 1.5 : 2.5));
      this.aAuto = acc;
      // Strom und Bremse verstellen das Tempo des Tempomaten
      if (this.cruiseSet !== null) this.cruiseSet = v;
    }
    this.throttle += (throttle - this.throttle) * (1 - Math.exp(-8 * H));
    this.speed = Math.max(0, v + acc * H);
    if (v <= top && this.speed > top) this.speed = top;
    this.s += this.speed * H;
  }

  /**
   * Ein Teilschritt im Rückwärtsgang (REVERSE): Die Bremse fährt sanft rückwärts, das Strompedal bremst; vor dem Ende
   * des Rückwegs (revFloor) bremst der Wagen weich bis zum Stand. speed bleibt der Betrag, s fällt. Ohne Erlaubnis
   * (mayR) zählt das Pedal nicht, und der Wagen bremst bis zum Stand.
   */
  reverseStep(gas, pedal, wet, grade, H) {
    const R = REVERSE;
    const v = this.speed;
    const room = Math.max(0, this.s - this.revFloor - 0.05);
    const top = Math.min(R.vmax, this.limits.vmax, Math.sqrt(2 * R.soft * room));
    const stop = this.mayR ? gas : 1;
    const drive = this.mayR && !this.empty && stop <= 0.02 ? pedal : 0;
    let acc = 0;
    if (stop > 0.02) acc = -R.brake * stop * (1 - wet * 0.18);
    else if (drive > 0.02) acc = drive * R.acc;
    else acc = -R.coast;
    // Steigung voraus heißt Gefälle hinter dem Wagen: rückwärts rollt er dort etwas leichter (wie vorwärts gedämpft)
    acc += G * grade * 0.55;
    if (v > top) acc = Math.min(acc, -R.soft - (v - top) * 4);
    this.aAuto = 0;
    this.throttle += (drive * 0.5 - this.throttle) * (1 - Math.exp(-8 * H));
    this.speed = Math.max(0, v + acc * H);
    if (v <= top && this.speed > top) this.speed = top;
    const s1 = this.s - this.speed * H;
    // nie hinter das Ende des Rückwegs – und wer schon dahinter steht (eben erst in einen neuen Abschnitt gerollt),
    // bleibt stehen, statt nach vorn zu springen
    if (s1 < this.revFloor) {
      this.s = Math.min(this.s, this.revFloor);
      this.speed = 0;
    } else this.s = s1;
  }

  /** Gang wechseln (REVERSE) und den Spielregeln melden. R schaltet den Tempomaten aus; mit D hält er wieder, was man fährt. */
  shift(gear) {
    this.gear = gear;
    this.revHold = 0;
    this.revEnd = false;
    this.speed = 0;
    this.aAuto = 0;
    this.cruiseSet = gear === 'D' && this.opts.cruise ? 0 : null;
    this.events.push({ type: 'gear', gear });
  }

  /**
   * Leitplanken: sanft abprallen; wer weiter nach außen lenkt oder treibt, schrammt weiter. Eine Grenze, die auf den
   * quer ruhenden Wagen zukommt (die XXL-Welt verengt so die Fahrbahn und führt um die Brunneninsel), schiebt ihn
   * nur mit, ohne Schramme: dafür nennt die Welt mit limits.slack, bis zu welcher Querbewegung nach außen der Wagen
   * als ruhend gilt (die abklingenden Anteile werden nie genau null). An der festen Leitplanke ist das 0.
   */
  rails() {
    const L = this.limits;
    if (this.x >= L.left && this.x <= L.right) return;
    const side = this.x < L.left ? -1 : 1;
    this.x = side < 0 ? L.left : L.right;
    const out = (this.vs + this.vc + this.vi) * side;
    if (out <= L.slack) return;
    const hard = out > 1.2;
    if (this.vs * side > 0) this.vs = 0;
    if (this.vc * side > 0) this.vc = 0;
    this.vi = -side * Math.min(1.5, out * 0.4);
    if (this.scrapeCooldown <= 0) {
      this.scrapeCooldown = 0.6;
      this.speed *= hard ? 0.9 : 0.97;
      // kostet keinen Punkt, zeichnet aber die Seite
      this.damage.scrape(side < 0 ? 'left' : 'right');
      this.events.push({ type: 'rail', side, hard });
    }
  }

  /** Zusammenstoß verarbeiten. Gibt true zurück, wenn er zählt; ev.zone (front/rear/left/right) und ev.power (m/s). */
  collide(ev) {
    // Auseinanderschieben gibt es immer, nur der Karosserie-Punkt hat eine Schonfrist
    const counts = this.cooldown <= 0;
    const c = ev.car;
    const sideHit = ev.lonOverlap > ev.latOverlap * 1.6;
    if (!sideHit && ev.ds > 0) {
      // Auffahren: hinter dem Fahrzeug bleiben
      ev.zone = 'front';
      ev.power = Math.max(0, this.speed - c.speed);
      this.s = c.s - (c.len + this.len) / 2 - 0.35;
      if (counts) {
        this.speed = Math.max(0, Math.min(this.speed, c.speed) - 4);
        c.speed += 2.5;
      } else this.speed = Math.min(this.speed, c.speed);
    } else if (!sideHit && ev.ds < 0 && this.gear === 'R') {
      // rückwärts angestoßen: unser Rempler, der Wagen steht vor dem anderen
      ev.zone = 'rear';
      ev.power = this.speed + Math.max(0, c.speed);
      const s1 = c.s + (c.len + this.len) / 2 + 0.35;
      this.bumpFwd += Math.max(0, s1 - this.s);
      this.s = s1;
      this.speed = 0;
      if (counts) c.speed = Math.max(0, c.speed - 2);
    } else if (!sideHit && ev.ds < 0) {
      // jemand fährt uns hinten drauf (selten, die KI passt eigentlich auf)
      ev.zone = 'rear';
      ev.power = Math.max(0, c.speed - this.speed);
      if (counts) {
        this.speed += 2;
        c.speed = Math.max(0, this.speed - 4);
      } else c.speed = Math.min(c.speed, this.speed);
      c.s = this.s - (c.len + this.len) / 2 - 0.4;
    } else {
      // seitlicher Rempler: der Stoß schiebt quer weg (vi), Spieler- und Kurvenanteil bleiben
      const dir = ev.dx > 0 ? -1 : 1;
      ev.zone = dir < 0 ? 'right' : 'left';
      ev.power = Math.abs(this.vx) + 1.5;
      const vx = this.vs + this.vc + this.vi;
      if (counts) {
        this.x += dir * (ev.latOverlap + 0.12);
        this.vi += dir * 3.2 - vx;
        this.speed *= 0.93;
        c.speed *= 0.97;
      } else {
        this.x += dir * (ev.latOverlap + 0.05);
        this.vi += dir * Math.max(1.5, vx * dir) - vx;
      }
    }
    if (!counts) return false;
    this.damage.hit(ev.zone);
    this.hits = this.damage.hits;
    this.cooldown = 1.6;
    return true;
  }

  /** Repariert bis zu n Karosserie-Punkte (älteste Schäden zuerst, mit Pflaster). Gibt die Zahl zurück. */
  repair(n = 1) {
    const k = this.damage.repair(n);
    this.hits = this.damage.hits;
    return k;
  }

  charge(pct) {
    this.battery = Math.min(100, this.battery + pct);
    this.empty = false;
  }
}
