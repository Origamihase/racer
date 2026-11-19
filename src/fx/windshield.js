// Regen auf der Frontscheibe und der automatische Scheibenwischer (Beta).
//
// Ein Schauer: Die Automatik erkennt den Regen und startet die Wischer. Die fahren hoch, bleiben aber senkrecht
// stehen – der Fahrerwischer links im Blick, der Beifahrerwischer in der Mitte – und zucken dort, solange es
// regnet: kleine Rucke, ab und zu ein schnelles Rubbeln, alle paar Sekunden ein kräftiger Ruck, als wollten sie
// doch noch anspringen. Gewischt wird nichts. Erst wenn der Schauer vorbei ist, sacken sie in Stufen in die
// Parkstellung. Nur mit der Wischer-Firmware aus dem Shop gelingt ab und zu ein echter Wisch.
//
// Weil nichts wischt, wird die Scheibe im Schauer richtig nass: In den ersten 10–15 s kommen immer mehr Tropfen,
// sie wachsen und fließen zusammen, die großen kriechen im Fahrtwind mit einer Spur die Scheibe hinauf. Dazu legt
// sich ein Wasserfilm über das Glas, der die Ferne weich und matt macht und die Lichter der Autos zu weichen
// Leuchtflecken verschmiert; um die zuckenden Blätter ist er verschmiert statt gewischt. Hört der Regen auf, ist
// die Scheibe nach gut 8 s wieder trocken.
//
// Tropfen und Film liegen in Scheiben-Koordinaten (x quer, u die Scheibe hinauf, in Metern). Die Tropfen
// zeichnet die Grafikkarte als Instanzen in einer Schicht auf der Scheibe (layer, gehört ins Cockpitbild: hinter
// allem im Innenraum und den Wischern draußen; scharf auf jedem Bildschirm), der Film ist ein kleines Datenbild
// auf der Scheibe (Rot = frisch gewischt oder von einem wandernden Tropfen gelichtet, Grün/Blau = Schlieren des
// Fahrer- und des Beifahrerwischers), das der Shader am Ende der Datei perspektivisch richtig ins Bild legt.
import * as THREE from 'three';
import { WINDSHIELD, WIPERS } from '../cockpit/cockpit.js';
import { clamp, lerp, mulberry32 } from '../util.js';

// Wasserfilm: x −0,78 … 0,78 m, u −0,03 … 0,945 m, quadratische Bildpunkte von gut 6 mm (Zeile 0 unten)
const FILM = { x0: -0.78, u0: -0.03, w: 1.56, h: 0.975, cols: 256, rows: 160 };
const FS = FILM.cols / FILM.w;
const TEX = 1 / FS;

// Tropfen (Meter, Sekunden)
const DROP = {
  max: 900, // so viele höchstens; danach fließen neue nur noch mit liegenden zusammen
  gone: 0.0006, // kleiner ist ein Tropfen verdunstet
  grow: 0.00007, // so schnell wachsen liegende Tropfen im Sprühregen (m/s bei vollem Regen)
  evap: 0.0009, // so schnell schrumpfen sie, wenn es aufgehört hat (m/s)
  trail: 0.07, // längste Spur eines wandernden Tropfens
  track: 0.6, // so weit lichtet ein wandernder Tropfen den Film auf seiner Bahn
  vis: 1.15, // im Bild etwas größer als echt: Tropfen sollen lesbar sein, nicht nur Pünktchen
  u0: 0.15, // darunter: außen die Sockelleiste der Wischer, die der Fahrer im flachen Blick davor sieht
  lift: 0.06, // so hoch über dem Glas verdecken Teile außen die Tropfen (Achskappe der Wischer: 5,2 cm)
};
// Raster für die Nachbarsuche der Tropfen (Zusammenfließen, Aufsammeln)
const GRID = { x0: -0.82, u0: -0.06, cell: 0.02, cols: 82, rows: 52 };

// Wischer: Phase 0 = Park, 1 = oberer Anschlag (beide Wischer hängen am selben Gestänge). In STAND stehen beide
// Blätter aus Mini Adams Sicht senkrecht (Fahrerarm 78,6°, Beifahrerarm 98,8°). Die Neigung im Bild ist sehr
// empfindlich (der Blick fällt flach auf die schräge Scheibe): 0,01 Phase kippt ein Blatt um gut 3°.
const TOP = 1;
const STAND = 0.936;
// Regensensor: ab RAIN_ON (eine Weile lang) startet die Automatik, unter RAIN_OFF ist der Schauer vorbei
const RAIN_ON = 0.12;
const RAIN_OFF = 0.05;
// Echter Wisch im Schauer (die verdiente Belohnung aus dem Shop): mittlerer Abstand je Firmware-Stufe (s). Stufe 0
// wischt nie; auch die beste Stufe schafft nur ab und zu einen, die stehenden, zuckenden Wischer bleiben das
// gewohnte Bild. Von Hand (Taste) klappt es mit dieser Wahrscheinlichkeit, höchstens alle 10 s.
const WIPE_EVERY = [Infinity, 60, 40, 27];
const MANUAL_WIPE = [0, 0.25, 0.4, 0.55];
const MANUAL_GAP = 10;

// Mechanik als gedämpfte Federn (Eigenfrequenz in rad/s, Dämpfungsgrad): Der Motor gibt eine Soll-Stellung
// vor, die Wischer folgen mit Masse – sie schwingen über und pendeln aus, statt zu springen.
const DRIVER = { omega: 30, zeta: 0.4 };
// Der Beifahrerwischer hängt am selben Gestänge, aber weicher und mit etwas Spiel: Er zuckt leicht versetzt.
const PASSENGER = { omega: 23, zeta: 0.3, play: 0.012 };
// Das Wischblatt kippelt am Adapter nach, wenn der Arm ruckt.
const BLADE = { omega: 42, zeta: 0.22, gain: 1, max: 0.05 };

/** Gedämpfte Feder einen Zeitschritt weiter (exakte Lösung, also unabhängig von der Bildrate). */
function spring(o, goal, { omega, zeta }, dt) {
  const wd = omega * Math.sqrt(1 - zeta * zeta);
  const x0 = o.x - goal;
  const e = Math.exp(-zeta * omega * dt);
  const c = Math.cos(wd * dt);
  const s = Math.sin(wd * dt);
  o.x = goal + e * (x0 * c + ((o.v + zeta * omega * x0) / wd) * s);
  o.v = e * (o.v * c - ((omega * omega * x0 + zeta * omega * o.v) / wd) * s);
}

const cosEase = (k) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(k, 0, 1));
const halfAt = (u) => lerp(WINDSHIELD.halfBase, WINDSHIELD.halfTop, u / WINDSHIELD.length);
// Fahrtwind: 0 im Stand, 1 ab gut 120 km/h
const airOf = (speed) => clamp((speed - 12) / 22, 0, 1);
// Wellen im Wasserfilm: Zellen des Rauschmusters je Meter Scheibe (es wiederholt sich die Scheibe hinauf alle 64)
const FLOW = 12;
// Wasserrillen der Schlieren: im Mittel so viele je Meter Abstand von der Wischerachse
const RILL = 77;

export class Windshield {
  constructor() {
    // --- Wasserfilm auf der Scheibe ---
    const texels = FILM.cols * FILM.rows;
    this.filmF = new Float32Array(texels * 3);
    this.filmData = new Uint8Array(texels * 4);
    this.filmTex = new THREE.DataTexture(this.filmData, FILM.cols, FILM.rows);
    this.filmTex.minFilter = THREE.LinearFilter;
    this.filmTex.magFilter = THREE.LinearFilter;
    this.filmTex.needsUpdate = true;
    this.filmBlank = true;
    this.filmDirty = false;
    this.filmAcc = 0;
    this.uploadAcc = 0;
    this.wet = 0; // Nässe der ganzen Scheibe (0 … 1)

    // --- Tropfen ---
    this.drops = [];
    this.pool = [];
    this.spawnAcc = 0;
    this.gridHead = new Int32Array(GRID.cols * GRID.rows);
    this.gridNext = new Int32Array(DROP.max + 256);
    this.hits = new Int32Array(64);
    this.dropA = new Float32Array(DROP.max * 4);
    this.dropB = new Float32Array(DROP.max * 4);
    const geo = new THREE.InstancedBufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0], 3));
    geo.setIndex([0, 1, 2, 0, 2, 3]);
    this.attrA = new THREE.InstancedBufferAttribute(this.dropA, 4).setUsage(THREE.DynamicDrawUsage);
    this.attrB = new THREE.InstancedBufferAttribute(this.dropB, 4).setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('aA', this.attrA);
    geo.setAttribute('aB', this.attrB);
    geo.instanceCount = 0;
    this.dropGeo = geo;
    this.layer = null; // Netz der Tropfen (in Fahrzeug-Koordinaten), entsteht mit dem Kompositions-Material

    // Vorpass: Weichbild und Lichter in Viertelauflösung (entsteht beim ersten nassen Bild)
    this.soft = null;
    this.softSize = new THREE.Vector2();
    this.uniforms = null;

    this.intensity = 0;
    this.firmware = 0;
    this.auto = true;
    this.onEvent = null; // (type) => {}
    this.twitches = 0;
    this.wipes = 0;
    this.speed = 0;
    this.flow = 0; // Lage der Wellen im Wasserfilm (Zellen des Musters, siehe FLOW)
    this.camera = null;
    this.carMatrix = null;
    this.glassMatrix = new THREE.Matrix3();
    this.m4 = new THREE.Matrix4();
    this.m3 = new THREE.Matrix3();
    this.v2 = new THREE.Vector2();

    // Wischer: Lage auf der Scheibe (Achse, Radien und Winkelversatz der Blattenden gegenüber dem Arm)
    const W = WINDSHIELD;
    // Scheibenpunkt (x, u, Abstand nach innen) → Fahrzeug-Koordinaten (Lage der Tropfenschicht im Cockpit;
    // rechtshändig, sonst drehte three.js die Vorderseite der Tropfen weg)
    this.glassBasis = new THREE.Matrix4().set(
      1, 0, -W.N.x, 0,
      0, W.U.y, -W.N.y, W.base.y,
      0, W.U.z, -W.N.z, W.base.z,
      0, 0, 0, 1,
    );
    this.kin = WIPERS.map((wp) => {
      const rIn = Math.hypot(wp.blade[0], wp.offset);
      const rOut = Math.hypot(wp.blade[1], wp.offset);
      return {
        px: wp.pivot.x, pu: wp.pivot.clone().sub(W.base).dot(W.U), park: wp.park, max: wp.max, off: wp.offset,
        rIn, rOut, tIn: wp.blade[0], tOut: wp.blade[1], prev: wp.park, dir: 0, travel: 0, rest: 0, load: 0,
      };
    });
    const seed = (Math.random() * 0xffffffff) >>> 0;
    this.rng = mulberry32(seed);
    this.drng = mulberry32(seed ^ 0x5bd1e995);
    this.mech = { x: 0, v: 0 }; // Phase des Fahrerwischers
    this.mechP = { x: 0, v: 0 }; // Phase des Beifahrerwischers
    this.link = 0;
    this.bladeFlex = [{ x: 0, v: 0 }, { x: 0, v: 0 }];
    this.goal = 0;
    this.st = {
      mode: 'park', kind: null, t: 0, dur: 0, from: 0, to: 0, hold: 0, base: 0, next: 0, side: 1, burst: 0,
      rested: false, small: 1, drop: false, landed: true, stall: 0, stallAt: 0, stallFor: 0, kick: 0, kickStep: 0,
      catchAt: 0, catchFor: 0, catchT: 0, stage: 0, back: false, repeat: 0,
    };
    this.hold = null;
    this.sensed = false; // der Regensensor meldet Regen
    this.senseT = 0;
    this.senseDelay = 0.8;
    this.phantomTimer = this.rnd(40, 90);
    this.wipeIn = Infinity;
    this.sinceWipe = 99;
    this.manualCd = 0;
    this.jerkCd = 0;
    this.wiperAngles = [WIPERS[0].park, WIPERS[1].park];
    this.wiperFlex = [0, 0];
  }

  rnd(a, b) {
    return a + this.rng() * (b - a);
  }

  emit(type) {
    if (this.onEvent) this.onEvent(type);
  }

  /** Geräusch eines kräftigen Rucks oder Rubbelns: höchstens alle 0,9 s, sonst rattert es wie ein Maschinengewehr. */
  jerk() {
    if (this.jerkCd > 0) return;
    this.jerkCd = 0.9;
    this.emit('jerk');
  }

  setRain(v) {
    this.intensity = clamp(v, 0, 1);
  }

  setFirmware(level) {
    this.firmware = level;
    if (this.st.mode === 'stand') this.rollWipe();
  }

  /** Automatik (Beta) ein/aus: Im Titelbild ruht der Wischer. */
  setAuto(on) {
    this.auto = !!on;
  }

  /** Armwinkel der beiden Wischer (rad, siehe WIPERS). */
  get angles() {
    return this.wiperAngles;
  }

  /** Nachschwingen der beiden Wischblätter am Adapter (rad). */
  get flex() {
    return this.wiperFlex;
  }

  /** Was der Wischer gerade tut: 'park', 'rise', 'stand', 'stuck', 'sag' oder 'sweep'. */
  get mode() {
    return this.st.mode;
  }

  // --- Wischer: Ablauf ------------------------------------------------------------------------

  /** Wischer von Hand auslösen (Taste). Gibt zurück, was passiert: 'wipe', 'twitch' oder null (zu früh). */
  manual() {
    const s = this.st;
    if (this.hold !== null || this.manualCd > 0 || s.mode === 'sweep') return null;
    this.manualCd = 0.6;
    if (this.sinceWipe > MANUAL_GAP && this.rng() < (MANUAL_WIPE[this.firmware] ?? 0)) {
      this.attempt('wipe');
      return 'wipe';
    }
    if (s.mode === 'stand') {
      // steht er schon: gleich ein kräftiger Ruck (gezählt wird der wie jeder andere)
      s.kick = 0;
      s.next = Math.min(s.next, 0.02);
      s.burst = 0;
    } else if (s.mode === 'park' || s.mode === 'sag' || s.mode === 'stuck') {
      if (this.intensity > RAIN_OFF) this.attempt('shower');
      else this.attempt(this.rng() < 0.45 ? 'giveup' : 'stuck', { hold: this.rnd(0.7, 1.8) });
    }
    return 'twitch';
  }

  /**
   * Einen Versuch beginnen: 'shower' (hoch und stehen bleiben, solange es regnet), 'wipe' (echter Wisch),
   * 'stuck' (bleibt bei trockener Scheibe hängen und zuckt), 'giveup' (gibt gleich wieder auf) oder 'phantom'
   * (kurzer Fehlalarm ohne Regen). opts.to/opts.hold legen Höhe (Phase) und Dauer des Hängens fest.
   */
  attempt(kind, { to, hold } = {}) {
    const s = this.st;
    const from = Math.max(0, this.mech.x);
    s.kind = kind;
    s.t = 0;
    s.from = from;
    s.stall = 0;
    s.stallAt = 0;
    s.kickStep = 0;
    s.catchAt = 0;
    s.catchT = 0;
    s.burst = 0;
    s.drop = false;
    if (kind === 'wipe') {
      s.mode = 'sweep';
      s.stage = 0;
      // im Schauer geht es danach wieder in den Stand, sonst zurück in die Parkstellung
      s.back = this.sensed && this.intensity > RAIN_OFF;
      s.dur = from > 0.5 ? 0.12 + 0.6 * (TOP - from) : 0.14 + 0.44 * (TOP - from);
      // auch die beste Beta stockt ab und zu mitten im Wisch
      if (from < 0.3 && this.rng() < 0.2) {
        s.stallAt = this.rnd(0.4, 0.75);
        s.stallFor = this.rnd(0.45, 1.0);
      }
      s.repeat = this.firmware >= 2 && this.rng() < 0.3 ? 1 : 0;
      this.wipes++;
      this.sinceWipe = 0;
      this.emit('wipe');
      return;
    }
    s.mode = 'rise';
    s.small = 1;
    if (kind === 'shower') {
      this.sensed = true;
      s.to = STAND;
      s.dur = 0.3 + 0.62 * Math.abs(STAND - from);
      // manchmal stockt er auf halbem Weg, ruckelt und zieht dann weiter
      if (from < 0.3 && this.rng() < 0.35) {
        s.stallAt = this.rnd(0.35, 0.65);
        s.stallFor = this.rnd(0.3, 0.7);
      }
    } else {
      if (kind === 'stuck') {
        s.to = to ?? this.rnd(0.25, 0.6);
        s.hold = hold ?? this.rnd(1, 3);
      } else if (kind === 'giveup') {
        s.to = to ?? this.rnd(0.1, 0.22);
        s.hold = hold ?? this.rnd(0.25, 0.6);
        s.small = 0.55;
      } else {
        // Fehlalarm: hoch genug, dass man ihn vor der Straße sieht, und gleich wieder weg
        s.to = to ?? this.rnd(0.16, 0.3);
        s.hold = hold ?? this.rnd(0.35, 0.7);
        s.small = 0.55;
      }
      s.to = Math.max(s.to, from + 0.04);
      s.dur = 0.2 + 0.55 * (s.to - from);
    }
    this.twitches++;
    this.emit(kind === 'phantom' ? 'phantom' : 'twitch');
  }

  /** Für Tests: Wischer auf einer Phase (0 = Park … 1 = oben) festhalten; null gibt ihn wieder frei. */
  debugPose(phase) {
    const s = this.st;
    if (phase === null || phase === undefined) {
      // loslassen: sinkt von dort in die Parkstellung
      if (this.hold !== null) {
        this.hold = null;
        this.goal = this.mech.x;
        this.release();
      }
      return;
    }
    this.hold = clamp(phase, 0, TOP);
    this.mech.x = this.mechP.x = this.link = this.goal = this.hold;
    this.mech.v = this.mechP.v = 0;
    for (let i = 0; i < 2; i++) {
      const k = this.kin[i];
      this.bladeFlex[i].x = this.bladeFlex[i].v = 0;
      // ohne Wischspur dorthin (der Wischer wird hingesetzt, nicht hingefahren)
      k.prev = this.wiperAngles[i] = k.park + (k.max - k.park) * this.hold;
      this.wiperFlex[i] = 0;
    }
    s.mode = 'park';
  }

  /** Für Tests: Zufallsfolgen von Wischer und Tropfen festlegen (gleiche Zahl = gleiches Zucken). */
  debugSeed(seed) {
    this.rng = mulberry32(seed >>> 0);
    this.drng = mulberry32((seed ^ 0x5bd1e995) >>> 0);
  }

  /** Für Tests: Nässe der Scheibe sofort setzen (0 … 1), statt sie sich aufbauen zu lassen. */
  debugWet(v) {
    this.wet = clamp(v, 0, 1);
  }

  park() {
    const s = this.st;
    s.mode = 'park';
    s.kind = null;
    this.goal = 0;
    this.phantomTimer = this.rnd(60, 120);
  }

  /** Aufgeben: in Stufen absinken, vielleicht unterwegs noch einmal hängen bleiben. */
  release() {
    const s = this.st;
    s.mode = 'sag';
    s.t = 0;
    s.next = 0;
    s.catchT = 0;
    s.catchAt = this.goal > 0.35 && this.rng() < 0.35 ? this.goal * this.rnd(0.35, 0.6) : 0;
    s.catchFor = this.rnd(0.6, 1.2);
    s.landed = false;
    this.emit('release');
  }

  /** Nächster echter Wisch im Schauer (nur mit Firmware): zufälliger Abstand um den Mittelwert. */
  rollWipe() {
    const mean = WIPE_EVERY[this.firmware] ?? Infinity;
    this.wipeIn = Number.isFinite(mean) ? Math.max(6, -Math.log(1 - this.rng()) * mean) : Infinity;
  }

  /** Der Regensensor: meldet Regen erst nach einer Weile über RAIN_ON, Ende erst nach einer Weile darunter. */
  sense(dt) {
    const v = this.intensity;
    if (this.sensed) {
      this.senseT = v < RAIN_OFF ? this.senseT + dt : 0;
      if (this.senseT > 0.6) {
        this.sensed = false;
        this.senseT = 0;
        this.senseDelay = this.rnd(0.5, 1.2);
      }
    } else {
      this.senseT = v > RAIN_ON ? this.senseT + dt : 0;
      if (this.senseT > this.senseDelay) {
        this.sensed = true;
        this.senseT = 0;
      }
    }
  }

  updateWiper(dt) {
    const s = this.st;
    this.manualCd -= dt;
    this.jerkCd -= dt;
    this.sinceWipe += dt;
    s.t += dt;
    this.sense(dt);
    if (this.hold !== null) this.goal = this.hold;
    else if (s.mode === 'park') {
      // --- Automatik (Beta) ---
      if (this.auto && this.mech.x < 0.01) {
        if (this.sensed) this.attempt('shower');
        else if (this.intensity < 0.02) {
          // trockene Scheibe: ganz selten ein Fehlalarm
          this.phantomTimer -= dt;
          if (this.phantomTimer <= 0) this.attempt('phantom');
        }
      }
    } else if (s.mode === 'rise') {
      if (s.stall > 0) {
        // stockt unterwegs: Der Motor ruckelt auf der Stelle, dann zieht er weiter (die Zeit steht so lange)
        s.stall -= dt;
        s.t -= dt;
        this.jitter(dt);
      } else {
        // der Motor zieht kräftig an und verhungert zum Ende hin
        const k = clamp(s.t / s.dur, 0, 1);
        this.goal = s.from + (s.to - s.from) * (1 - (1 - k) ** 2.4);
        if (s.stallAt > 0 && k >= s.stallAt) {
          s.stall = s.stallFor;
          s.stallAt = 0;
          s.base = this.goal;
          s.next = 0.04;
          s.small = 0.6;
          this.jerk();
        } else if (k >= 1) this.arrive();
      }
    } else if (s.mode === 'stand') {
      if (!this.sensed) this.release();
      else {
        this.wipeIn -= dt;
        if (this.wipeIn <= 0 && s.kickStep === 0) this.attempt('wipe');
        else this.twitch(dt);
      }
    } else if (s.mode === 'stuck') {
      this.jitter(dt);
      if (s.t >= s.hold) this.release();
    } else if (s.mode === 'sag') {
      if (this.auto && this.sensed) this.attempt('shower');
      else this.sag(dt);
    } else if (s.mode === 'sweep') this.sweep(dt);

    // --- Mechanik: Motor-Soll → Fahrerwischer → Gestänge mit Spiel → Beifahrerwischer ---
    const m = this.mech;
    const v0 = m.v;
    spring(m, this.goal, DRIVER, dt);
    // abgehoben: Erst jetzt zählt der nächste Aufprall am Parkanschlag wieder als Landung (beim Start aus der
    // Parkstellung steht das Soll noch einen Augenblick auf null)
    if (m.x > 0.02) s.landed = false;
    this.stop(m, s);
    // (das Spiel verschwindet zur Parkstellung hin: Dort liegen beide Wischer am Anschlag)
    const play = PASSENGER.play * clamp(m.x / 0.05, 0, 1);
    this.link = clamp(this.link, m.x - play, m.x + play);
    const mp = this.mechP;
    const vp0 = mp.v;
    spring(mp, this.link, PASSENGER, dt);
    this.stop(mp, null);
    // Wischblätter: bekommen jede Geschwindigkeitsänderung ihres Arms als Stoß in die Gegenrichtung
    for (let i = 0; i < 2; i++) {
      const k = this.kin[i];
      const b = this.bladeFlex[i];
      const span = k.max - k.park;
      b.v -= BLADE.gain * span * (i === 0 ? m.v - v0 : mp.v - vp0);
      spring(b, 0, BLADE, dt);
      this.wiperAngles[i] = k.park + span * (i === 0 ? m.x : mp.x);
      // weich begrenzt: Auch beim härtesten Ruck kippt das Blatt nur wenige Grad
      this.wiperFlex[i] = BLADE.max * Math.tanh(b.x / BLADE.max);
    }
  }

  /** Oben angekommen: im Schauer stehen bleiben, sonst (trocken, von Hand) kurz hängen. */
  arrive() {
    const s = this.st;
    s.t = 0;
    s.base = s.to;
    s.next = this.rnd(0.1, 0.2);
    s.burst = 0;
    s.rested = false;
    s.small = 1;
    if (s.kind === 'shower') {
      s.mode = 'stand';
      s.kick = this.rnd(1.6, 3.2);
      this.rollWipe();
      this.emit('stand');
    } else {
      s.mode = 'stuck';
      if (s.kind === 'stuck') this.emit('stuck');
    }
  }

  /** Absinken in Stufen; bleibt vielleicht noch einmal hängen und zuckt dort, dann Klack am Anschlag. */
  sag(dt) {
    const s = this.st;
    if (s.catchT > 0) {
      s.catchT -= dt;
      this.jitter(dt);
      if (s.catchT <= 0) s.next = 0.12;
    } else {
      s.next -= dt;
      if (s.next <= 0 && this.goal > 0) {
        const h = this.goal;
        let g = h - Math.max(0.07, h * this.rnd(0.22, 0.42));
        if (g < 0.08) g = 0;
        if (s.catchAt > 0 && g <= s.catchAt) {
          this.goal = s.base = s.catchAt;
          s.catchAt = 0;
          s.catchT = s.catchFor;
          s.next = 0.12;
          s.small = 0.6;
          this.emit('stuck');
        } else {
          this.goal = g;
          s.next = this.rnd(0.16, 0.38);
        }
      }
    }
    if (this.goal === 0 && s.landed && Math.abs(this.mech.v) < 0.08 && this.mech.x < 0.004) this.park();
  }

  /** Ein echter Wisch: hoch an den Anschlag, ganz hinunter bis Park, im Schauer wieder hinauf in den Stand. */
  sweep(dt) {
    const s = this.st;
    if (s.stage === 0) {
      const k = s.t / s.dur;
      this.goal = s.from + (TOP - s.from) * cosEase(k);
      if (s.stallAt > 0 && this.goal >= s.stallAt) {
        // stockt mitten im Wisch, zuckt kurz und läuft dann weiter
        s.stage = 9;
        s.hold = s.t;
        s.t = 0;
        s.base = this.goal;
        s.next = 0.1;
        s.stallAt = 0;
        s.small = 0.7;
        this.emit('stuck');
      } else if (k >= 1) {
        s.stage = 1;
        s.t = 0;
      }
    } else if (s.stage === 9) {
      this.jitter(dt);
      if (s.t >= s.stallFor) {
        s.stage = 0;
        s.t = s.hold;
      }
    } else if (s.stage === 1) {
      if (s.t >= 0.06) {
        s.stage = 2;
        s.t = 0;
      }
    } else if (s.stage === 2) {
      // hinunter bis in die Parkstellung
      this.goal = TOP * (1 - cosEase(s.t / 0.6));
      if (s.t >= 0.6) {
        this.goal = 0;
        if (s.landed && this.mech.x < 0.004 && Math.abs(this.mech.v) < 0.08) {
          if (s.back) {
            s.stage = 3;
            s.t = 0;
          } else if (s.repeat > 0) {
            s.repeat--;
            s.stage = 0;
            s.t = 0;
            s.from = 0;
            s.dur = 0.58;
          } else this.park();
        }
      }
    } else if (s.stage === 3) {
      // im Schauer: wieder hinauf …
      this.goal = TOP * cosEase(s.t / 0.6);
      if (s.t >= 0.66) {
        if (s.repeat > 0) {
          s.repeat--;
          s.stage = 1;
          s.t = 0;
        } else {
          // … und dort hängt die Beta wieder: zurück in den Stand
          s.kind = 'shower';
          s.to = STAND;
          this.goal = STAND;
          this.arrive();
        }
      }
    }
  }

  /** Anschläge: unten die Parkstellung (mit kleinem Abpraller), oben das Ende des Wischfelds. */
  stop(m, s) {
    if (m.x < 0) {
      if (s && !s.landed && this.goal === 0) {
        s.landed = true;
        if (m.v < -0.25) this.emit('park');
      }
      m.x = -m.x * 0.3;
      m.v = m.v < 0 ? -m.v * 0.3 : m.v;
    } else if (m.x > TOP + 0.012) {
      m.x = TOP + 0.012;
      m.v = Math.min(0, m.v);
    }
    if (s && !s.landed && this.goal === 0 && m.x < 0.003 && Math.abs(m.v) < 0.05) s.landed = true;
  }

  /**
   * Kleine Rucke um s.base: der Motor drückt gegen die Sperre (hin und her, mal einzeln, mal als schnelles
   * Rubbeln) und hält zwischendurch kurz inne. Gibt false zurück, wenn gerade nichts zu tun war.
   */
  nudge(rest0, rest1) {
    const s = this.st;
    const a = s.small;
    // nach einer Pause geht es immer mit einem Ruck weiter
    const r = s.rested ? 0 : this.rng();
    s.rested = false;
    if (s.burst > 0 || r < 0.55) {
      // kleiner Ruck, meist in die Gegenrichtung des letzten
      if (this.rng() < 0.72) s.side = -s.side;
      this.goal = s.base + s.side * this.rnd(0.01, 0.03) * a + 0.005 * a;
      if (s.burst > 0) {
        s.burst--;
        s.next = this.rnd(0.045, 0.075);
      } else {
        s.next = this.rnd(0.08, 0.18);
        if (this.rng() < 0.2) {
          s.burst = 2 + Math.floor(this.rng() * 4);
          this.jerk();
        }
      }
    } else {
      this.goal = s.base;
      s.next = this.rnd(rest0, rest1);
      s.rested = true;
    }
  }

  /** Zucken eines hängenden Wischers (trocken, von Hand, beim Stocken): Rucke, ab und zu ein kräftiger. */
  jitter(dt) {
    const s = this.st;
    s.next -= dt;
    if (s.next > 0) return;
    const a = s.small;
    if (s.drop) {
      // nach dem kräftigen Ruck fällt er zurück
      s.drop = false;
      this.goal = s.base - this.rnd(0.01, 0.035) * a;
      s.next = this.rnd(0.12, 0.3);
      return;
    }
    if (s.kind === 'phantom') {
      // trockenes Gummi rubbelt in winzigen Schritten über das Glas
      this.goal = s.base + this.rnd(-0.014, 0.02);
      s.next = this.rnd(0.04, 0.08);
      return;
    }
    if (!s.rested && this.rng() < 0.16) {
      this.goal = s.base + this.rnd(0.07, 0.13) * a;
      s.next = this.rnd(0.09, 0.15);
      s.drop = true;
      this.jerk();
      return;
    }
    this.nudge(0.22, 0.5);
  }

  /**
   * Das Zucken der stehenden Wischer im Schauer: kleine Rucke gegen die Sperre, ab und zu ein Rubbeln, kurze
   * Pausen – und alle paar Sekunden ein kräftiger Ruck: Sie sacken ein Stück ab und drücken wieder hoch, ein
   * Stück über den Stand hinaus, als wollten sie doch noch anspringen. Jeder kräftige Ruck zählt als ein Zucken.
   */
  twitch(dt) {
    const s = this.st;
    s.kick -= dt;
    s.next -= dt;
    if (s.next > 0) return;
    if (s.kickStep === 1) {
      // … und drückt wieder hoch
      s.kickStep = 2;
      this.goal = Math.min(TOP, s.base + this.rnd(0.025, 0.04));
      s.next = this.rnd(0.12, 0.2);
      this.twitches++;
      this.emit('twitch');
    } else if (s.kickStep === 2) {
      s.kickStep = 0;
      this.goal = s.base;
      s.next = this.rnd(0.3, 0.55);
      s.rested = true;
    } else if (s.kick <= 0 && s.burst === 0) {
      // kräftiger Ruck: erst sackt er ein Stück ab …
      s.kickStep = 1;
      s.kick = this.rnd(3.5, 7);
      this.goal = s.base - this.rnd(0.025, 0.04);
      s.next = this.rnd(0.14, 0.22);
    } else this.nudge(0.3, 0.9);
  }

  // --- Bild für Bild --------------------------------------------------------------------------

  update(dt, { speed, camera, carMatrix }) {
    this.camera = camera;
    this.carMatrix = carMatrix;
    this.speed = speed;
    this.updateWiper(dt);

    // Nässe der Scheibe: baut sich im Regen in gut 10 s auf, trocknet danach in wenigen Sekunden ab
    const target = clamp(this.intensity / 0.85, 0, 1);
    const tau = target > this.wet ? 4.2 : 1.5;
    this.wet += (target - this.wet) * (1 - Math.exp(-dt / tau));
    if (target === 0 && this.wet < 0.003) this.wet = 0;
    // die Wellen im Film kriechen im Fahrtwind die Scheibe hinauf, im Stand rinnen sie langsam hinab; auf der
    // trockenen Scheibe gibt es keinen Film, dort beginnt das Muster von vorn (so wird die Zahl nie groß)
    const air = airOf(speed);
    this.flow = this.wet === 0 ? 0 : this.flow + (air * 0.08 - (1 - air) * 0.02) * FLOW * dt;

    this.stepDrops(dt, speed);
    // Wischer räumen ab oder verschmieren
    const s = this.st;
    const cleaning = s.mode === 'sweep' && s.stage !== 9;
    for (let i = 0; i < 2; i++) this.sweepBlade(i, dt, cleaning);
    this.decayFilm(dt);
    this.writeDrops();
  }

  // --- Tropfen --------------------------------------------------------------------------------

  /** Raster der Tropfen neu aufbauen (verkettete Listen je Zelle). */
  buildGrid() {
    const head = this.gridHead;
    const next = this.gridNext;
    head.fill(-1);
    const drops = this.drops;
    for (let i = 0; i < drops.length; i++) {
      const c = this.cellOf(drops[i].x, drops[i].u);
      next[i] = head[c];
      head[c] = i;
    }
  }

  cellOf(x, u) {
    const cx = clamp(Math.floor((x - GRID.x0) / GRID.cell), 0, GRID.cols - 1);
    const cu = clamp(Math.floor((u - GRID.u0) / GRID.cell), 0, GRID.rows - 1);
    return cu * GRID.cols + cx;
  }

  /**
   * Tropfen des Rasters in der Nähe von (x, u): alle, die weniger als reach plus ihren eigenen Radius entfernt
   * sind, landen (als Index) in this.hits; zurück kommt ihre Anzahl (höchstens limit).
   */
  gather(x, u, reach, limit = 64) {
    const span = reach + 0.012;
    const c0 = clamp(Math.floor((x - span - GRID.x0) / GRID.cell), 0, GRID.cols - 1);
    const c1 = clamp(Math.floor((x + span - GRID.x0) / GRID.cell), 0, GRID.cols - 1);
    const r0 = clamp(Math.floor((u - span - GRID.u0) / GRID.cell), 0, GRID.rows - 1);
    const r1 = clamp(Math.floor((u + span - GRID.u0) / GRID.cell), 0, GRID.rows - 1);
    const drops = this.drops;
    const hits = this.hits;
    let n = 0;
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        for (let j = this.gridHead[r * GRID.cols + c]; j >= 0; j = this.gridNext[j]) {
          const o = drops[j];
          if (o.r <= 0) continue;
          const lim = reach + o.r;
          const dx = o.x - x;
          const du = o.u - u;
          if (dx * dx + du * du < lim * lim) {
            hits[n++] = j;
            if (n >= limit) return n;
          }
        }
      }
    }
    return n;
  }

  addDrop(x, u, r) {
    if (this.drops.length >= DROP.max || u - r < DROP.u0) return null;
    const d = this.pool.pop() || { x: 0, u: 0, r: 0, age: 0, tx: 0, tu: 1, trail: 0, drip: 0, trk: 0, seed: 0 };
    d.x = x;
    d.u = u;
    d.r = r;
    d.age = 0;
    d.tx = 0;
    d.tu = 1;
    d.trail = 0;
    d.drip = 0.01;
    d.trk = 0;
    d.seed = this.drng();
    this.drops.push(d);
    return d;
  }

  /** Ein neuer Regentropfen; trifft er einen liegenden, fließen beide zusammen (so wachsen die Tropfen). */
  spawnDrop() {
    const W = WINDSHIELD;
    const rnd = this.drng;
    const r = rnd() < 0.06 ? 0.0036 + rnd() * 0.0026 : 0.0011 + rnd() ** 2.2 * 0.003;
    const u = DROP.u0 + r + rnd() * (W.length - DROP.u0 - r);
    const x = (rnd() * 2 - 1) * (halfAt(u) - 0.004);
    // ist die Scheibe voll, fließt er mit einem Nachbarn in der Umgebung zusammen
    let n = this.gather(x, u, r * 0.8, 1);
    if (n === 0 && this.drops.length >= DROP.max) n = this.gather(x, u, 0.03, 1);
    const hit = n > 0 ? this.drops[this.hits[0]] : null;
    if (hit) {
      const v = hit.r ** 3 + r ** 3;
      const w = r ** 3 / v;
      hit.x += (x - hit.x) * w;
      hit.u += (u - hit.u) * w;
      hit.r = Math.cbrt(v);
    } else this.addDrop(x, u, r);
  }

  stepDrops(dt, speed) {
    const drops = this.drops;
    const rain = this.intensity;
    if (drops.length === 0 && rain <= 0.02) return;
    // Ab rc wandert ein Tropfen – im Fahrtwind schon mittlere, im Stand nur große (die rutschen dann langsam nach
    // unten).
    const air = airOf(speed);
    const rc = lerp(0.0062, 0.0034, air);
    const dry = rain < 0.02;
    this.buildGrid();
    if (!dry) {
      this.spawnAcc += rain * (24 + 1.5 * speed) * dt;
      while (this.spawnAcc >= 1) {
        this.spawnAcc -= 1;
        this.spawnDrop();
      }
    }
    for (let i = 0; i < drops.length; i++) {
      const d = drops[i];
      if (d.r <= 0) continue;
      d.age += dt;
      // trocken: verdunsten, unterschiedlich schnell (nicht alle im selben Augenblick weg); große Tropfen schneller,
      // sie zerfließen im Fahrtwind – rund 5 s nach dem letzten Tropfen ist die Scheibe wieder trocken
      if (dry) d.r -= DROP.evap * dt * (0.7 + 0.6 * d.seed) * (1 + d.r / 0.004);
      else if (d.r < rc) d.r += DROP.grow * rain * dt * (0.5 + d.seed);
      const m = clamp((d.r - rc) / 0.0016, 0, 1);
      if (m > 0) this.moveDrop(d, i, m, air, dt);
      else if (d.trail > 0) d.trail = Math.max(0, d.trail - 0.3 * dt);
    }
    // aufräumen: verdunstet, aufgesogen oder von der Scheibe gelaufen (oben, seitlich, unten unter die Leiste)
    const W = WINDSHIELD;
    let n = 0;
    for (let i = 0; i < drops.length; i++) {
      const d = drops[i];
      if (d.r > DROP.gone && d.u - d.r > DROP.u0 && d.u < W.length + 0.015 && Math.abs(d.x) < halfAt(d.u) + 0.01) drops[n++] = d;
      else this.pool.push(d);
    }
    drops.length = n;
  }

  /**
   * Ein wandernder Tropfen: ruckelnd (haften, losreißen) und leicht schlängelnd, im Fahrtwind die Scheibe
   * hinauf und etwas nach außen. Er sammelt ein, was im Weg liegt, und lässt ab und zu ein Tröpfchen zurück.
   */
  moveDrop(d, i, m, air, dt) {
    const slip = 0.35 + 0.65 * Math.max(0, Math.sin(d.age * 2.4 + d.seed * 40));
    const vu = (air * 0.17 - (1 - air) * 0.035) * m * slip;
    const vx = Math.abs(vu) * (0.35 * Math.sin(d.age * 3.1 + d.seed * 23) + 0.4 * d.x);
    const v = Math.hypot(vx, vu);
    if (v < 1e-5) return;
    d.x += vx * dt;
    d.u += vu * dt;
    // die Spur zeigt dorthin, woher er kam (Richtung gleitet der Bewegung nach)
    const k = Math.min(1, dt * 6);
    d.tx += (vx / v - d.tx) * k;
    d.tu += (vu / v - d.tu) * k;
    const l = Math.hypot(d.tx, d.tu) || 1;
    d.tx /= l;
    d.tu /= l;
    const step = v * dt;
    d.trail = Math.min(DROP.trail, d.trail + step);
    const n = this.gather(d.x, d.u, d.r * 0.7);
    for (let h = 0; h < n; h++) {
      const j = this.hits[h];
      if (j === i) continue;
      const o = this.drops[j];
      d.r = Math.cbrt(d.r ** 3 + o.r ** 3);
      o.r = 0;
    }
    // seine Bahn im Film: ein Abdruck je halbem Film-Bildpunkt Weg (lückenlos, aber nicht in jedem Bild)
    d.trk += step;
    if (d.trk >= 0.5 * TEX && this.wet > 0.05) {
      d.trk = 0;
      this.trackFilm(d.x, d.u, d.r);
    }
    d.drip -= step;
    if (d.drip <= 0) {
      d.drip = 0.008 + this.drng() * 0.016;
      if (this.drops.length < DROP.max && this.drng() < 0.6) {
        const rr = d.r * (0.17 + this.drng() * 0.12);
        const back = d.r * 1.15;
        this.addDrop(d.x - d.tx * back, d.u - d.tu * back, rr);
        d.r = Math.cbrt(Math.max(1e-12, d.r ** 3 - rr ** 3));
      }
    }
  }

  /**
   * Ein Wischblatt zwischen dem Armwinkel des letzten und dieses Bildes: nimmt die Tropfen mit, die es
   * überstreicht, hinterlässt einen sauberen Fächer (echter Wisch) oder Schlieren (zuckender Wischer) und
   * lässt an der Stelle, an der es umkehrt oder stehen bleibt, eine Reihe kleiner Wasserperlen zurück.
   */
  sweepBlade(i, dt, cleaning) {
    const k = this.kin[i];
    const a = k.prev;
    const b = this.wiperAngles[i];
    const d = b - a;
    k.prev = b;
    if (Math.abs(d) < 1e-5) {
      // steht: was es vor sich hergeschoben hat, bleibt als Perlenreihe an der Blattkante liegen
      k.rest += dt;
      if (k.rest > 0.1 && k.travel > 0.012) this.beads(i, b, k.dir);
      return;
    }
    k.rest = 0;
    const dir = Math.sign(d);
    if (dir !== k.dir) {
      if (k.travel > 0.012) this.beads(i, a, k.dir);
      k.dir = dir;
    }
    k.travel += Math.abs(d);
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    // Die Gummilippe ist eine Gerade parallel zum Arm, um off zur Wischrichtung versetzt. Überstrichen ist,
    // was zwischen ihrer alten und neuen Lage liegt (Abstände zu beiden Geraden) und längs im Bereich des Blatts.
    const sl = Math.sin(lo);
    const cl = Math.cos(lo);
    const sh = Math.sin(hi);
    const chi = Math.cos(hi);
    const cm = Math.cos((lo + hi) / 2);
    const sm = Math.sin((lo + hi) / 2);
    const drops = this.drops;
    let n = 0;
    for (let j = 0; j < drops.length; j++) {
      const p = drops[j];
      const gx = p.x - k.px;
      const gu = p.u - k.pu;
      const tol = 0.004 + p.r;
      const t = gx * cm + gu * sm;
      const hit = t > k.tIn - tol && t < k.tOut + tol && -gx * sl + gu * cl - k.off > -tol && k.off + gx * sh - gu * chi > -tol;
      if (hit) {
        k.load++;
        this.pool.push(p);
      } else drops[n++] = p;
    }
    drops.length = n;
    // nur was nass ist, schmiert
    if (cleaning) this.paintFilm(i, lo, hi, true, 1);
    else if (this.wet > 0.02) this.paintFilm(i, lo, hi, false, this.wet * Math.min(0.95, 0.6 + 0.35 * this.wet));
  }

  /** Wasserperlen an der Blattkante (auf der Seite, zu der das Blatt zuletzt lief). */
  beads(i, angle, side) {
    const k = this.kin[i];
    k.travel = 0;
    const count = Math.min(16, Math.round(k.load * 0.6 + this.wet * 6));
    k.load = 0;
    for (let j = 0; j < count; j++) {
      const r = lerp(k.rIn + 0.02, k.rOut - 0.012, (j + this.drng()) / count);
      const at = angle + Math.asin(k.off / r) + (side * (0.011 + this.drng() * 0.008)) / r;
      this.addDrop(k.px + Math.cos(at) * r, k.pu + Math.sin(at) * r, 0.0014 + this.drng() * 0.0014);
    }
  }

  // --- Wasserfilm -----------------------------------------------------------------------------

  /**
   * Vom Blatt i zwischen den Armwinkeln lo und hi überstrichene Fläche in den Film malen: cleaning = frisch
   * gewischt (Rot), sonst Schlieren (Grün/Blau) der Stärke amount. Je Zeile des Films liegt die Fläche zwischen
   * den beiden Lagen der Gummilippe (zwei Geraden), also wird nur dieses Stück jeder Zeile durchgegangen. Die
   * Kanten sind weich und reichen zwei Bildpunkte über die Lippe hinaus: Die Stücke aufeinander folgender
   * Bilder überlappen sich so, dass keine Nähte stehen bleiben.
   */
  paintFilm(i, lo, hi, cleaning, amount) {
    const k = this.kin[i];
    const F = this.filmF;
    const D = this.filmData;
    const E = 2 * TEX;
    const sl = Math.sin(lo);
    const cl = Math.cos(lo);
    const sh = Math.sin(hi);
    const chi = Math.cos(hi);
    const cm = Math.cos((lo + hi) / 2);
    const sm = Math.sin((lo + hi) / 2);
    // Zeilen: zwischen den Blattenden in beiden Lagen (plus Rand und Wölbung des äußeren Bogens)
    const bulge = k.tOut * (1 - Math.cos((hi - lo) / 2)) + E;
    const uA = k.pu + Math.min(k.tIn * sl, k.tIn * sh, k.tOut * sl, k.tOut * sh) + k.off * Math.min(cl, chi) - bulge;
    const uB = k.pu + Math.max(k.tIn * sl, k.tIn * sh, k.tOut * sl, k.tOut * sh) + k.off * Math.max(cl, chi) + bulge;
    const r0 = Math.max(0, Math.floor((uA - FILM.u0) * FS));
    const r1 = Math.min(FILM.rows - 1, Math.ceil((uB - FILM.u0) * FS));
    const ch = cleaning ? 0 : i === 0 ? 1 : 2;
    let painted = false;
    for (let row = r0; row <= r1; row++) {
      const gu = FILM.u0 + (row + 0.5) * TEX - k.pu;
      // Lippe in der alten Lage: links von ihr (gx ≤ xb), in der neuen: rechts von ihr (gx ≥ xa)
      const xa = (gu * chi - k.off - E) / sh;
      const xb = (gu * cl - k.off + E) / sl;
      const c0 = Math.max(0, Math.floor((k.px + Math.min(xa, xb) - FILM.x0) * FS));
      const c1 = Math.min(FILM.cols - 1, Math.ceil((k.px + Math.max(xa, xb) - FILM.x0) * FS));
      for (let col = c0; col <= c1; col++) {
        const gx = FILM.x0 + (col + 0.5) * TEX - k.px;
        const t = gx * cm + gu * sm;
        const cov = clamp((-gx * sl + gu * cl - k.off) / E + 1, 0, 1) * clamp((k.off + gx * sh - gu * chi) / E + 1, 0, 1)
          * clamp((t - k.tIn) / E + 0.5, 0, 1) * clamp((k.tOut - t) / E + 0.5, 0, 1);
        if (cov <= 0) continue;
        const o = (row * FILM.cols + col) * 3;
        const v = cov * amount;
        if (cleaning) {
          // frisch gewischt: auch die Schlieren sind weg
          F[o] = Math.max(F[o], v);
          F[o + 1] *= 1 - v;
          F[o + 2] *= 1 - v;
        } else F[o + ch] = Math.max(F[o + ch], v);
        const p = (row * FILM.cols + col) * 4;
        D[p] = F[o] * 255 + 0.5;
        D[p + 1] = F[o + 1] * 255 + 0.5;
        D[p + 2] = F[o + 2] * 255 + 0.5;
        painted = true;
      }
    }
    if (painted) {
      this.filmBlank = false;
      this.filmDirty = true;
    }
  }

  /**
   * Wasserspur eines wandernden Tropfens: Wo er entlangläuft, nimmt er den Film mit. Dort sieht man ein paar
   * Sekunden lang klarer hindurch (im Film wie frisch gewischt, nur schwächer), bis der Regen die Bahn wieder
   * zuzieht – so kriechen im Fahrtwind klare, weich auslaufende Bahnen die Scheibe hinauf.
   */
  trackFilm(x, u, r) {
    const F = this.filmF;
    const D = this.filmData;
    const rad = r + 0.7 * TEX;
    const c0 = Math.max(0, Math.floor((x - rad - FILM.x0) * FS));
    const c1 = Math.min(FILM.cols - 1, Math.floor((x + rad - FILM.x0) * FS));
    const r0 = Math.max(0, Math.floor((u - rad - FILM.u0) * FS));
    const r1 = Math.min(FILM.rows - 1, Math.floor((u + rad - FILM.u0) * FS));
    for (let row = r0; row <= r1; row++) {
      const du = FILM.u0 + (row + 0.5) * TEX - u;
      for (let col = c0; col <= c1; col++) {
        const dx = FILM.x0 + (col + 0.5) * TEX - x;
        const v = DROP.track * clamp(1.25 - Math.hypot(dx, du) / rad, 0, 1);
        const o = (row * FILM.cols + col) * 3;
        if (v <= F[o]) continue;
        F[o] = v;
        D[(row * FILM.cols + col) * 4] = v * 255 + 0.5;
        this.filmBlank = false;
        this.filmDirty = true;
      }
    }
  }

  /**
   * Der Film verändert sich langsam (alle 0,2 s): Frisch Gewischtes wird im Regen wieder nass, Schlieren
   * verlaufen (an trockener Luft trocknen sie). Zur Grafikkarte geht er höchstens 20-mal je Sekunde und nur,
   * wenn sich etwas geändert hat.
   */
  decayFilm(dt) {
    this.filmAcc += dt;
    this.uploadAcc += dt;
    if (!this.filmBlank && this.filmAcc >= 0.2) {
      const step = this.filmAcc;
      this.filmAcc = 0;
      const rain = this.intensity;
      const kr = Math.exp(-step * (0.25 + 0.25 * rain));
      const ks = Math.exp(-step / (rain > 0.02 ? 6 : 2));
      const F = this.filmF;
      const D = this.filmData;
      let max = 0;
      for (let o = 0, p = 0; o < F.length; o += 3, p += 4) {
        const r = (F[o] *= kr);
        const g = (F[o + 1] *= ks);
        const b = (F[o + 2] *= ks);
        D[p] = r * 255 + 0.5;
        D[p + 1] = g * 255 + 0.5;
        D[p + 2] = b * 255 + 0.5;
        if (r > max) max = r;
        if (g > max) max = g;
        if (b > max) max = b;
      }
      if (max < 0.004) {
        F.fill(0);
        D.fill(0);
        this.filmBlank = true;
      }
      this.filmDirty = true;
    }
    if (this.filmDirty && this.uploadAcc >= 0.05) {
      this.uploadAcc = 0;
      this.filmDirty = false;
      this.filmTex.needsUpdate = true;
    }
  }

  /** Tropfen in die Instanz-Daten der Grafikkarte schreiben. */
  writeDrops() {
    const drops = this.drops;
    const n = drops.length;
    const A = this.dropA;
    const B = this.dropB;
    for (let i = 0; i < n; i++) {
      const d = drops[i];
      const j = i * 4;
      // neu: wächst in einem Augenblick auf (Aufprall); verdunstend: wird kleiner und blasser
      const grow = Math.min(1, d.age / 0.08);
      A[j] = d.x;
      A[j + 1] = d.u;
      A[j + 2] = d.r * DROP.vis * (0.55 + 0.45 * grow);
      A[j + 3] = clamp((d.r - DROP.gone) / 0.0006, 0, 1);
      B[j] = d.tx;
      B[j + 1] = d.tu;
      // die Spur endet an der Unterkante (sonst läge sie hell auf der Sockelleiste)
      B[j + 2] = d.tu > 0.05 ? Math.min(d.trail, (d.u - DROP.u0) / d.tu) : d.trail;
      B[j + 3] = d.seed;
    }
    this.dropGeo.instanceCount = n;
    if (n > 0) {
      this.attrA.clearUpdateRanges();
      this.attrA.addUpdateRange(0, n * 4);
      this.attrA.needsUpdate = true;
      this.attrB.clearUpdateRanges();
      this.attrB.addUpdateRange(0, n * 4);
      this.attrB.needsUpdate = true;
    }
  }

  // --- Projektion und Vorpass ---------------------------------------------------------------------

  /**
   * Kurz vor dem Zeichnen des Bildes: Film und Tropfen mit der Kamera dieses Bildes projizieren (nicht mit der
   * vom letzten) und, wenn die Scheibe nass ist, den Vorpass rendern. uv des Bildschirms → Scheiben-Koordinaten
   * ist eine ebene Projektion (3×3-Matrix), Scheibe → Bild für die Tropfen eine 4×4-Matrix.
   */
  project(renderer) {
    const camera = this.camera;
    const U = this.uniforms;
    if (!camera || !U) return;
    camera.updateMatrixWorld();
    const W = WINDSHIELD;
    const M = this.m4.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse).multiply(this.carMatrix);
    const e = M.elements;
    const Uv = W.U;
    const B = W.base;
    // (x, u, 1) auf der Scheibe → (x, y, w) im Bild; Spalten: Querrichtung, Scheibe hinauf, Fußpunkt
    const m = this.m3.set(
      e[0], e[4] * Uv.y + e[8] * Uv.z, e[4] * B.y + e[8] * B.z + e[12],
      e[1], e[5] * Uv.y + e[9] * Uv.z, e[5] * B.y + e[9] * B.z + e[13],
      e[3], e[7] * Uv.y + e[11] * Uv.z, e[7] * B.y + e[11] * B.z + e[15],
    );
    if (Math.abs(m.determinant()) > 1e-9) {
      m.invert();
      const t = m.elements;
      // davor: uv (0 … 1) → Bildkoordinaten (−1 … 1)
      this.glassMatrix.set(
        2 * t[0], 2 * t[3], t[6] - t[0] - t[3],
        2 * t[1], 2 * t[4], t[7] - t[1] - t[4],
        2 * t[2], 2 * t[5], t[8] - t[2] - t[5],
      );
    }
    const need = U.uDrops.value > 0.5 && (this.wet > 0.002 || !this.filmBlank || this.drops.length > 0);
    U.uSoftOn.value = need ? 1 : 0;
    U.uWet.value = this.wet;
    U.uFlow.value = this.flow;
    if (need) this.prepass(renderer);
  }

  /**
   * Vorpass in Viertelauflösung (zwei Bilder auf einmal, mit Mipmaps): das Weltbild weichgezeichnet (für die
   * Ferne hinter dem Wasserfilm, das Streulicht und die Tropfen) und nur seine Lichter – das kräftige Rot der
   * Bremslichter, alles Überhelle wie Blinker und Blaulicht – für die weichen Leuchtflecken.
   * Gerendert wird mitten im Zeichnen des Kompositionsbildes (wie beim Spiegel von three.js, Reflector).
   */
  prepass(renderer) {
    const U = this.uniforms;
    const size = renderer.getDrawingBufferSize(this.v2);
    const w = Math.max(1, Math.ceil(size.x / 4));
    const h = Math.max(1, Math.ceil(size.y / 4));
    if (!this.soft) {
      this.soft = new THREE.WebGLRenderTarget(w, h, {
        count: 2, type: THREE.HalfFloatType, depthBuffer: false, generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter, magFilter: THREE.LinearFilter,
      });
      U.tSoft.value = this.soft.textures[0];
      U.tGlow.value = this.soft.textures[1];
      const mat = new THREE.ShaderMaterial({
        glslVersion: THREE.GLSL3,
        uniforms: { tScene: U.tScene },
        vertexShader: 'void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }',
        fragmentShader: PREPASS,
        depthTest: false,
        depthWrite: false,
      });
      const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
      quad.frustumCulled = false;
      this.softScene = new THREE.Scene();
      this.softScene.add(quad);
      this.softCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    } else if (this.soft.width !== w || this.soft.height !== h) this.soft.setSize(w, h);
    if (this.softSize.x !== size.x || this.softSize.y !== size.y) {
      this.softSize.copy(size);
      // Unschärfe in festem Blickwinkel: bei doppelter Auflösung eine Mip-Stufe höher
      const lod = Math.log2(Math.max(0.25, size.y / 900)) + 0.5;
      U.uSoftLod.value = lod;
      // Abstand der Abtastungen für die Leuchtflecken (1,5 Texel der Stufe lod + 1,5)
      const texel = 4 * 2 ** Math.max(0, lod + 1.5) * 1.5;
      U.uGlowStep.value.set(texel / size.x, texel / size.y);
    }
    const prev = renderer.getRenderTarget();
    renderer.setRenderTarget(this.soft);
    renderer.render(this.softScene, this.softCam);
    renderer.setRenderTarget(prev);
  }

  /** Scheibe trocken und sauber, Wischer in Parkstellung (neue Fahrt, Titelbild). */
  clear() {
    for (const d of this.drops) this.pool.push(d);
    this.drops.length = 0;
    this.dropGeo.instanceCount = 0;
    this.filmF.fill(0);
    this.filmData.fill(0);
    this.filmTex.needsUpdate = true;
    this.filmBlank = true;
    this.filmDirty = false;
    this.wet = 0;
    this.hold = null;
    this.sensed = false;
    this.senseT = 0;
    this.mech.x = this.mech.v = this.mechP.x = this.mechP.v = this.link = 0;
    for (const b of this.bladeFlex) b.x = b.v = 0;
    for (let i = 0; i < 2; i++) {
      const k = this.kin[i];
      k.prev = k.park;
      k.dir = k.travel = k.rest = k.load = 0;
      this.wiperAngles[i] = k.park;
      this.wiperFlex[i] = 0;
    }
    this.park();
    this.phantomTimer = this.rnd(40, 90);
    this.wipeIn = Infinity;
  }
}

// ---------------------------------------------------------------------------
// Lichter im Weltbild: alles Überhelle (Blinker, Blaulicht, Scheinwerfer) und kräftiges, sattes Rot (Bremslichter;
// Rücklichter und roter Lack bleiben darunter, ein nur halb vom Bildpunkt bedecktes fernes Bremslicht nicht)
const LIGHTS = /* glsl */ `
  float hotOf(vec3 c) { return clamp((max(max(c.r, c.g), c.b) - 1.05) * 0.8, 0.0, 1.0); }
  float redOf(vec3 c) { return clamp((c.r - max(c.g, c.b) - 0.45) * 2.5, 0.0, 1.0); }`;

// Vorpass (Viertelauflösung, zwei Ausgaben): je Texel die 4 × 4 Bildpunkte darunter einzeln
const PREPASS = /* glsl */ `
  precision highp float;
  uniform sampler2D tScene;
  layout(location = 0) out vec4 oSoft;
  layout(location = 1) out vec4 oGlow;
  ${LIGHTS}
  void main() {
    ivec2 hi = textureSize(tScene, 0) - 1;
    ivec2 base = ivec2(gl_FragCoord.xy) * 4;
    vec3 sum = vec3(0.0);
    vec3 hot = vec3(0.0);
    vec3 red = vec3(0.0);
    float eSum = 0.0;
    float eMax = 0.0;
    vec3 at = vec3(0.0);
    for (int y = 0; y < 4; y++) {
      for (int x = 0; x < 4; x++) {
        vec3 c = texelFetch(tScene, min(base + ivec2(x, y), hi), 0).rgb;
        sum += c;
        // Überhelles zählt nach seiner Fläche, Bremslichter mit ihrem hellsten Bildpunkt: Ein Bremslicht in 120 m ist
        // nur ein, zwei Bildpunkte groß und soll trotzdem zu einem sichtbaren Leuchtfleck verlaufen
        hot += c * hotOf(c);
        red = max(red, c * redOf(c));
        float e = max(0.0, c.r - max(c.g, c.b));
        eSum += e;
        if (e > eMax) {
          eMax = e;
          at = c;
        }
      }
    }
    // Noch kleiner (auf kleinen Bildschirmen, mit Kantenglättung) bedeckt es nur einen Teil eines Bildpunkts und ist
    // blasser als die Schwelle. Erkannt wird es dann als roter Fleck, viel röter und heller als seine Umgebung und
    // rein rot (mit Grau oder Blau gemischt, nicht nach Orange oder Braun hin): Roter Lack ist ringsum gleich rot,
    // rote Schrift auf hellem Grund dunkler als der Grund, ein Rücklicht zu schwach, Ziegeldach und Schild zu warm.
    vec3 avg = sum / 16.0;
    float spot = clamp((eMax - eSum / 16.0 - 0.1) * 4.0, 0.0, 1.0) * clamp((at.r - avg.r - 0.05) * 6.0, 0.0, 1.0)
      * clamp((at.r - 0.3) * 6.0, 0.0, 1.0) * clamp(1.0 - (at.g - at.b) * 40.0, 0.0, 1.0);
    red = max(red, vec3(1.0, 0.03, 0.03) * min(1.0, eMax * 2.5) * spot);
    oSoft = vec4(avg, 1.0);
    oGlow = vec4(red + hot / 16.0, 1.0);
  }`;

// Gemeinsame Farbbehandlung von Komposition und Tropfen (Sättigung, Tonwerte, Farbraum)
const OUTPUT = /* glsl */ `
  col = mix(vec3(dot(col, vec3(0.299, 0.587, 0.114))), col, uSat);`;

// ---------------------------------------------------------------------------
// Bildkomposition: Weltbild + Wasserfilm + Schlieren + Effekte (die Tropfen kommen als eigenes Netz darüber)
export function createCompositeMaterial(sceneTex, ws) {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      tScene: { value: sceneTex },
      tFilm: { value: ws.filmTex },
      tSoft: { value: null },
      tGlow: { value: null },
      uDrops: { value: 1 },
      // der Film folgt der Nässe der Scheibe (setzt project()), die der Regenstärke mit Verzögerung nachläuft
      uWet: { value: 0 },
      uFlow: { value: 0 },
      uSoftOn: { value: 0 },
      uSoftLod: { value: 0.5 },
      uGlowStep: { value: new THREE.Vector2(0.01, 0.01) },
      uTexel: { value: new THREE.Vector2(1 / 1280, 1 / 720) },
      uFlash: { value: 0 },
      uFlashColor: { value: new THREE.Color(1, 1, 1) },
      uFade: { value: 0 },
      uGreen: { value: 0 },
      uGlitch: { value: 0 },
      uTime: { value: 0 },
      uVignette: { value: 0.35 },
      uSat: { value: 1.08 },
      // 1: Blitz, Vignette, Frosch, Funkloch und Überblendung hier; 0: erst nach dem Cockpit (main.js)
      uPost: { value: 1 },
      // Wasserfilm auf der Scheibe (setzt die Windschutzscheibe selbst): Bildschirm-uv → Scheibe (x, u, w),
      // Lage des Films (x0, u0, 1/Breite, 1/Höhe), die beiden Wischerachsen (x, u) und die Scheibe selbst
      // (Länge, halbe Breite unten, halbe Breite oben)
      uGlass: { value: ws.glassMatrix },
      uFilmRect: { value: new THREE.Vector4(FILM.x0, FILM.u0, 1 / FILM.w, 1 / FILM.h) },
      uPivots: { value: new THREE.Vector4(ws.kin[0].px, ws.kin[0].pu, ws.kin[1].px, ws.kin[1].pu) },
      uPane: { value: new THREE.Vector3(WINDSHIELD.length, WINDSHIELD.halfBase, WINDSHIELD.halfTop) },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D tScene;
      uniform sampler2D tFilm;
      uniform sampler2D tSoft;
      uniform sampler2D tGlow;
      uniform float uDrops;
      uniform float uWet;
      uniform float uFlow;
      uniform float uSoftOn;
      uniform float uSoftLod;
      uniform vec2 uGlowStep;
      uniform vec2 uTexel;
      uniform float uFlash;
      uniform vec3 uFlashColor;
      uniform float uFade;
      uniform float uGreen;
      uniform float uGlitch;
      uniform float uTime;
      uniform float uVignette;
      uniform float uSat;
      uniform float uPost;
      uniform mat3 uGlass;
      uniform vec4 uFilmRect;
      uniform vec4 uPivots;
      uniform vec3 uPane;
      varying vec2 vUv;
      float hash1(float i) { return fract(sin(i * 127.1) * 43758.5453); }
      float noise1(float x) {
        float i = floor(x);
        float f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        return mix(hash1(i), hash1(i + 1.0), f);
      }
      float hash2(vec2 p) {
        vec3 q = fract(p.xyx * 0.1031);
        q += dot(q, q.yzx + 33.33);
        return fract((q.x + q.y) * q.z);
      }
      // Wertrauschen, quintisch geglättet (auch seine Steigung hat keine Knicke an den Zellgrenzen)
      float noise2(vec2 p) {
        vec2 i = floor(p);
        vec2 f = p - i;
        f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
        return mix(mix(hash2(i), hash2(i + vec2(1.0, 0.0)), f.x), mix(hash2(i + vec2(0.0, 1.0)), hash2(i + vec2(1.0, 1.0)), f.x), f.y);
      }
      // Dicke des Wasserfilms: zwei Oktaven in gegeneinander gedrehten Gittern – so stehen keine Kanten längs der
      // Scheibe, die der flache Blick zu waagerechten Streifen zöge
      float filmNoise(vec2 q) {
        return 0.62 * noise2(mat2(0.825, 0.565, -0.565, 0.825) * q + 3.1)
          + 0.38 * noise2(mat2(0.454, -0.891, 0.891, 0.454) * q * 2.1 + 11.7);
      }
      // Schlieren: Jede Scharte der Gummilippe zieht auf ihrem Kreis um die Achse eine feine Wasserrille in den
      // Film – unregelmäßig im Abstand, mal kräftig, mal abgerissen; immer im selben Abstand r von der Achse,
      // s ist die Bogenlänge (Meter), q die Breite eines Bildpunkts quer zu den Rillen (in Rillenabständen).
      // Rückgabe: x = Wasserkamm (0 … 1), y = seine Neigung quer zu den Rillen (−1 … 1). Zu dichte Rillen werden
      // breiter und flacher (gleich viel Wasser) und blenden schließlich aus, statt zu flimmern.
      vec2 rills(float r, float s, float q) {
        float k = r * ${RILL.toFixed(1)} + 0.35 * noise1(r * ${(RILL * 0.29).toFixed(2)} + 4.1);
        float i = floor(k + 0.5);
        float x = k - i;
        // Breite des Kamms (Halbwertsbreite in Rillenabständen) und der Exponent, der sie ergibt
        float fw = max(0.26, 1.4 * q);
        float p = (0.53 / fw) * (0.53 / fw);
        float c = max(cos(3.14159 * x), 1e-4);
        float g = pow(c, 2.0 * p);
        float slope = -2.33 * sqrt(p) * sin(3.14159 * x) * pow(c, 2.0 * p - 1.0);
        // Stärke je Rille, entlang des Bogens stellenweise abgerissen
        float amp = (0.3 + 0.7 * hash1(i * 1.731 + 2.9))
          * smoothstep(0.3, 0.7, noise1(s * 28.0 + hash1(i + 0.37) * 61.0));
        amp *= 0.26 / fw * (1.0 - smoothstep(0.22, 0.38, q));
        return vec2(g, slope) * amp;
      }
      ${LIGHTS}
      vec3 lightOf(vec3 c) { return c * max(hotOf(c), redOf(c)); }
      // Leuchtfleck um die Lichter: ein enger Kern (das Licht selbst, weich vergrößert; hält auch ferne Lichter sichtbar)
      // und ein weiter Hof aus 9 Abtastungen in grober Mip-Stufe, zusammen sanft begrenzt (im Farbton erhalten), damit
      // nahe Lichter nicht ausbrennen
      vec3 glowAt(vec2 p) {
        float L = uSoftLod + 1.5;
        vec2 o = uGlowStep;
        vec3 g = textureLod(tGlow, p, L).rgb * 0.2;
        g += (textureLod(tGlow, p + vec2(o.x, 0.0), L).rgb + textureLod(tGlow, p - vec2(o.x, 0.0), L).rgb
          + textureLod(tGlow, p + vec2(0.0, o.y), L).rgb + textureLod(tGlow, p - vec2(0.0, o.y), L).rgb) * 0.12;
        g += (textureLod(tGlow, p + o * 0.7, L).rgb + textureLod(tGlow, p - o * 0.7, L).rgb
          + textureLod(tGlow, p + vec2(o.x, -o.y) * 0.7, L).rgb + textureLod(tGlow, p + vec2(-o.x, o.y) * 0.7, L).rgb) * 0.08;
        // der Kern in fester Größe: je doppelter Auflösung eine Mip-Stufe gröber, die Mittelung dabei ausgeglichen
        float cl = max(0.0, uSoftLod - 0.5);
        g += min(textureLod(tGlow, p, cl).rgb * exp2(2.0 * cl), vec3(2.0)) * 0.5;
        return g * (1.3 / (max(max(g.r, g.g), g.b) + 0.4));
      }
      void main() {
        vec2 uv = vUv;
        if (uGlitch > 0.0 && uPost > 0.5) {
          float band = floor(uv.y * 30.0) + floor(uTime * 24.0);
          float r = fract(sin(band * 91.7) * 4375.85);
          uv.x += (r - 0.5) * 0.08 * uGlitch * step(0.6, r);
        }
        // Wasserfilm: überall gleich nass (uWet), wo frisch gewischt weniger; dazu die Schlieren der Wischer
        float film = 0.0;
        float smear = 0.0;
        float rill = 0.0;
        float flank = 0.0;
        vec2 bend = vec2(0.0);
        vec2 across = vec2(0.0, 1.0);
        if (uDrops > 0.5 && uSoftOn > 0.5) {
          vec3 g = uGlass * vec3(uv, 1.0);
          vec2 gp = g.xy / max(g.z, 1e-5);
          float r0 = length(gp - uPivots.xy);
          float r1 = length(gp - uPivots.zw);
          vec2 g0 = vec2(dFdx(r0), dFdy(r0));
          vec2 g1 = vec2(dFdx(r1), dFdy(r1));
          vec2 fuv = (gp - uFilmRect.xy) * uFilmRect.zw;
          vec2 edge = min(fuv, 1.0 - fuv);
          float inside = g.z > 0.0 ? smoothstep(0.0, 0.015, min(edge.x, edge.y)) : 0.0;
          vec3 fm = texture2D(tFilm, clamp(fuv, 0.0, 1.0)).rgb * inside;
          // die Seitenscheiben (neben der Frontscheibe) sind nur halb so nass
          float hw = mix(uPane.y, uPane.z, clamp(gp.y / uPane.x, 0.0, 1.0));
          float pane = g.z > 0.0 ? 1.0 - 0.5 * smoothstep(-0.01, 0.03, abs(gp.x) - hw) : 0.5;
          film = uWet * pane * (1.0 - fm.r);
          // Struktur im Film: dickere und dünnere Stellen und flache Wellen, die das Bild leicht verbiegen; beides
          // kriecht mit dem Wasser (uFlow)
          vec2 fp = gp * ${FLOW.toFixed(1)} - vec2(0.0, uFlow);
          float w0 = filmNoise(fp);
          float wx = filmNoise(fp + vec2(0.3, 0.0));
          float wu = filmNoise(fp + vec2(0.0, 0.3));
          film = min(1.0, film * (0.75 + 0.5 * smoothstep(0.2, 0.8, w0)));
          bend = vec2(wx - w0, wu - w0) * film * 0.012 * vec2(uTexel.x / uTexel.y, 1.0);
          if (fm.g + fm.b > 0.003) {
            // Richtung quer zu den Bögen (im Bild) und Breite eines Bildpunkts in dieser Richtung (Meter)
            float l0 = max(length(g0), 1e-7);
            float l1 = max(length(g1), 1e-7);
            vec2 n0 = g0 / l0;
            vec2 n1 = g1 / l1;
            vec2 d0 = gp - uPivots.xy;
            vec2 d1 = gp - uPivots.zw;
            vec2 k0 = rills(r0, r0 * atan(d0.y, d0.x), l0 * ${RILL.toFixed(1)}) * fm.g;
            vec2 k1 = rills(r1 + 0.0137, r1 * atan(d1.y, d1.x) + 0.5, l1 * ${RILL.toFixed(1)}) * fm.b;
            // nach der Stärke der beiden Wischspuren gemischt
            across = normalize(mix(n0, dot(n0, n1) < 0.0 ? -n1 : n1, fm.b / (fm.g + fm.b)));
            smear = min(1.0, fm.g + fm.b);
            // zwischen den Rillen ungleich dick verriebenes Wasser: breite, flache Wellen längs der Bögen
            rill = k0.x + k1.x
              + ((noise1(r0 * 38.0 + 2.0) - 0.5) * fm.g + (noise1(r1 * 38.0 + 9.0) - 0.5) * fm.b) * 0.35;
            flank = abs(k0.y) + abs(k1.y);
            // jede Rille ist eine kleine Zylinderlinse: Sie versetzt das Bild quer zu ihrer Richtung
            // (um bis zu 4 Bildpunkte auf 900 Zeilen)
            bend += (k0.y * n0 + k1.y * n1) * 0.004 * vec2(uTexel.x / uTexel.y, 1.0);
          }
        }
        vec2 suv = uv + bend;
        vec3 sharp = texture2D(tScene, suv).rgb;
        vec3 col = sharp;
        if (film + smear > 0.002) {
          // verriebenes Wasser verwischt das Bild ein wenig längs der Bögen (bis gut 4 Bildpunkte auf 900 Zeilen)
          if (smear > 0.01) {
            vec2 along = vec2(-across.y, across.x) * uTexel * (0.0013 / uTexel.y);
            vec3 acc = texture2D(tScene, suv + along * 1.3).rgb + texture2D(tScene, suv - along * 1.3).rgb
              + texture2D(tScene, suv + along * 3.2).rgb + texture2D(tScene, suv - along * 3.2).rgb;
            col = mix(col, (col + acc) / 5.0, smear * 0.85);
          }
          // die Ferne hinter dem Film: weich (fester Blickwinkel, unabhängig von der Auflösung), aber nie ganz – ein
          // Rest des scharfen Bildes bleibt, damit ein Auto 60 m voraus auf der Spitze des Schauers ein Auto bleibt …
          vec3 soft = textureLod(tSoft, suv, uSoftLod - 0.5).rgb;
          col = mix(col, soft, film * 0.62);
          // … und matt: Streulicht aus der Umgebung nimmt Kontrast, das Bild wird etwas dunkler
          vec3 wide = textureLod(tSoft, suv, uSoftLod + 4.0).rgb;
          col = mix(col, wide, film * 0.24);
          col *= 1.0 - film * 0.12;
          // Lichter: ein weicher Leuchtfleck, der den grauen Schleier verdrängt (satteres Rot), darin ein heller Kern
          vec3 gl = glowAt(suv) * film;
          col = col * (1.0 - 0.4 * clamp(max(max(gl.r, gl.g), gl.b), 0.0, 1.0)) + gl;
          col += lightOf(sharp) * film * 0.35;
        }
        // Wasserrillen: Ihr Kamm fängt das Tageslicht (feine helle Linien), die Flanken lenken es weg (dunkler Saum)
        col *= 1.0 - 0.22 * clamp(flank, 0.0, 1.0);
        col = mix(col, col * 1.12 + 0.07, clamp(rill * 1.7, -1.0, 1.0));
        float l = dot(col, vec3(0.299, 0.587, 0.114));
        col = mix(col, vec3(l) * 1.02 + 0.03, clamp(film * 0.14 + smear * 0.08, 0.0, 0.5));
        ${OUTPUT}
        if (uPost > 0.5) {
          col = mix(col, uFlashColor * 4.0, clamp(uFlash, 0.0, 1.0));
          vec2 vc = vUv - 0.5;
          col *= 1.0 - dot(vc, vc) * uVignette;
        }
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        if (uPost > 0.5) {
          float g = dot(gl_FragColor.rgb, vec3(0.3, 0.6, 0.1));
          gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.08, 1.0, 0.25) * (0.3 + g), uGreen * 0.65);
          gl_FragColor.rgb *= 1.0 - uFade;
        }
      }`,
    depthTest: false,
    depthWrite: false,
  });
  ws.uniforms = mat.uniforms;
  mat.onBeforeRender = (renderer) => ws.project(renderer);
  ws.layer = createDropLayer(ws, mat.uniforms);
  return mat;
}

/**
 * Die Tropfen als Instanzen in einer Schicht auf der Scheibe (gehört ins Cockpitbild): jeder ein Viereck auf der
 * Scheibe (perspektivisch richtig, auf der schrägen Scheibe also leicht oval), darin per Abstandsfunktion der
 * runde Kopf und die schmale Spur dahinter – scharf und geglättet auf jeder Auflösung. Der Tiefentest versteckt
 * sie hinter allem im Innenraum und hinter den Wischern und A-Säulen an der Scheibe. Ein Tropfen ist eine
 * kleine Weitwinkel-Linse: Er zeigt die Welt verkleinert und auf dem Kopf (oben die dunkle Straße, unten der
 * helle Himmel), mit dunklem Rand, einem Lichtsaum unten und einem Glanzpunkt oben links. Die Spur ist eine
 * dünne Wasserbahn, durch die man klarer sieht als durch den Film.
 */
function createDropLayer(ws, U) {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      tScene: U.tScene,
      tSoft: U.tSoft,
      uDrops: U.uDrops,
      uSoftLod: U.uSoftLod,
      uTexel: U.uTexel,
      uSat: U.uSat,
      uWet: U.uWet,
    },
    vertexShader: /* glsl */ `
      attribute vec4 aA; // Mitte (x, u), Radius, Deckkraft
      attribute vec4 aB; // Laufrichtung (x, u), Spurlänge, Zufall
      uniform float uDrops;
      varying vec2 vLocal;
      varying vec4 vBasis;
      varying vec2 vDir;
      varying float vTrail;
      varying float vAlpha;
      varying float vSeed;
      vec2 toUv(vec4 c) { return c.xy / c.w * 0.5 + 0.5; }
      // auf der Scheibe, für den Tiefentest aber weiter draußen: entlang des Sehstrahls so weit, bis er DROP.lift über
      // dem Glas ist (im Bild bleibt alles, wo es ist). So liegt ein Tropfen hinter allem, was außen auf der Scheibe
      // sitzt – den Wischern samt Armen und Achskappen und dem Rand der A-Säulen, den man schräg hinter der
      // Scheibenebene sieht. Sonst läge er als heller Fleck auf ihnen (er zeigt ja die Welt dahinter, nicht sie).
      vec4 toClip(vec2 g) {
        vec4 v = modelViewMatrix * vec4(g, 0.0, 1.0);
        vec3 nOut = normalize((modelViewMatrix * vec4(0.0, 0.0, -1.0, 0.0)).xyz);
        vec3 ray = normalize(v.xyz);
        v.xyz += ray * (${DROP.lift.toFixed(3)} / max(abs(dot(ray, nOut)), 0.2));
        return projectionMatrix * v;
      }
      void main() {
        if (uDrops < 0.5 || aA.w <= 0.0) {
          gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
          return;
        }
        float r = aA.z;
        vec2 t = aB.xy;
        vec2 nr = vec2(-t.y, t.x);
        float m = 1.3;
        float along = position.x > 0.0 ? r * m : -(aB.z + r * m);
        float acr = position.y * r * m;
        gl_Position = toClip(aA.xy + t * along + nr * acr);
        vLocal = vec2(along, acr) / r;
        vTrail = aB.z / r;
        vDir = t;
        vAlpha = aA.w;
        vSeed = aB.w;
        // Bildverschiebung (uv) je Tropfenradius quer (x) und die Scheibe hinauf (u)
        vec2 c0 = toUv(toClip(aA.xy));
        vBasis = vec4(toUv(toClip(aA.xy + vec2(r, 0.0))) - c0, toUv(toClip(aA.xy + vec2(0.0, r))) - c0);
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D tScene;
      uniform sampler2D tSoft;
      uniform float uSoftLod;
      uniform vec2 uTexel;
      uniform float uSat;
      uniform float uWet;
      varying vec2 vLocal;
      varying vec4 vBasis;
      varying vec2 vDir;
      varying float vTrail;
      varying float vAlpha;
      varying float vSeed;
      float smin(float a, float b, float k) {
        float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
        return mix(b, a, h) - k * h * (1.0 - h);
      }
      void main() {
        vec2 p = vLocal;
        // Kopf: Kreis vom Radius 1. Spur: verjüngt sich nach hinten, weich an den Kopf angesetzt.
        float dHead = length(p) - 1.0;
        float d = dHead;
        float k = 0.0;
        float w = 0.0;
        float dTrail = 1e3;
        if (vTrail > 0.3) {
          k = clamp(-p.x / vTrail, 0.0, 1.0);
          w = mix(0.3, 0.05, sqrt(k));
          dTrail = max(abs(p.y) - w, max(-p.x - vTrail, p.x - 0.2));
          d = smin(dHead, dTrail, 0.25);
        }
        float aa = fwidth(d) * 0.7 + 1e-4;
        float cover = smoothstep(aa, -aa, d);
        if (cover * vAlpha < 0.004) discard;
        vec2 uv = gl_FragCoord.xy * uTexel;
        // Kopf oder Spur (weicher Übergang am Ansatz)
        float isHead = clamp((dTrail - dHead) * 3.0 + 0.5, 0.0, 1.0);
        // Lage im Tropfen in Scheiben-Richtungen (quer, hinauf), Rand = 1
        vec2 q = vDir * p.x + vec2(-vDir.y, vDir.x) * p.y;
        float rr = clamp(length(p), 0.0, 1.0);
        // Linse: Richtung im Bild (in Pixeln) mal Blickweite; der Rand sieht ein Fünftel der Bildhöhe weit
        vec2 ex = normalize(vBasis.xy / uTexel);
        vec2 eu = normalize(vBasis.zw / uTexel);
        vec2 lens = -(ex * q.x + eu * q.y) * (0.2 * (0.6 + 0.4 * rr)) * vec2(uTexel.x / uTexel.y, 1.0);
        vec3 head = textureLod(tSoft, uv + lens, uSoftLod + 0.8).rgb;
        vec3 sky = textureLod(tSoft, vec2(0.5, 0.92), 5.0).rgb;
        // dunkler Rand (dort lenkt die gewölbte Oberfläche das Licht weg), oben kräftiger
        head *= 1.0 - smoothstep(0.6, 1.0, rr) * (0.42 + 0.2 * q.y);
        // Lichtsaum unten im Tropfen (gebündeltes Himmelslicht) und der Glanzpunkt oben links
        head += sky * (smoothstep(0.45, 0.88, rr) * smoothstep(1.0, 0.9, rr) * smoothstep(0.1, 0.85, -q.y) * 0.32);
        vec2 g = (q - vec2(-0.3, 0.38)) * vec2(1.0, 1.4);
        head += mix(sky, vec3(1.0), 0.5) * (smoothstep(0.24, 0.05, length(g)) * (0.55 + 0.3 * vSeed));
        // Spur: dünne Wasserbahn, klarer als der Film ringsum, weich auslaufend (ohne Kanten)
        float e = w > 0.0 ? clamp(abs(p.y) / w, 0.0, 1.0) : 1.0;
        vec3 trail = mix(texture2D(tScene, uv).rgb, sky, 0.08);
        vec3 col = mix(trail, head, isHead);
        float fade = (1.0 - k) * (1.0 - k);
        float alpha = cover * vAlpha * mix((1.0 - e * e) * fade * 0.6 * (0.4 + 0.6 * uWet), 1.0, isHead);
        ${OUTPUT}
        gl_FragColor = vec4(col, alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    transparent: true,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(ws.dropGeo, mat);
  mesh.matrixAutoUpdate = false;
  mesh.matrix.copy(ws.glassBasis);
  mesh.frustumCulled = false;
  // vor allem anderen Durchsichtigen im Cockpit (NOMI-Gesicht, Logo, Spiegelmaske – das liegt innen)
  mesh.renderOrder = -1;
  return mesh;
}
