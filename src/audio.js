// Alle Geräusche werden mit der Web-Audio-API erzeugt (keine Audiodateien):
// E-Motor-Surren, Abrollgeräusch, Fahrtwind, Regen, Wischer-Motor, Blinker, Hupe,
// Martinshorn, Spenden-Pling, OMI-Gong, Crash und kleine Jingles.
import { clamp } from './util.js';

/**
 * Der Piepser des Radarwarners: n Doppeltöne (freq, je dur Sekunden, der zweite gap später), alle every Sekunden, ab
 * start; die Fahrgeräusche tragen so lange duck[1] (für duck[0] Sekunden). tools/radar-test.mjs prüft, dass er über
 * Motor, Abrollen und Wind bei 130 km/h zu hören ist.
 */
export const RADAR_BEEP = { freq: [2637, 3136], dur: 0.075, gap: 0.085, every: 0.2, n: 3, start: 0.05, vol: 0.07, duck: [0.75, 0.4] };

/**
 * Die Hupe (Audio.horn): Tiefton und Hochton eines Fanfarenpaars in Hz, ihre Anteile, leichte Verstimmung in Cent,
 * Einsatz in s, Ausklang (Zeitkonstante in s), Länge eines Tipps auf die Taste in s, Lautstärke und Schnarren.
 * Die Länge bleibt unter dem Abstand des Hupkonzerts (0,45 s), damit die drei Huper einzeln zu hören sind.
 */
export const HORN = { freq: [410, 512], mix: [1, 0.85], detune: [-4, 3], attack: 0.012, release: 0.022, dur: 0.36, vol: 0.065, rasp: 0.2 };

export class Audio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.volume = 0.8;
    this.ready = false;
    // kurz leiser (duckFor): bis duckUntil (Zeit des Audio-Kontexts) tragen Motor, Abrollen und Wind nur duckTo
    this.duckUntil = 0;
    this.duckTo = 1;
  }

  /** Ton anhalten (z. B. wenn der Tab in den Hintergrund geht). */
  suspend() {
    if (this.ctx && this.ctx.state === 'running') this.ctx.suspend().catch(() => {});
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
  }

  /** Muss nach einer Nutzer-Geste aufgerufen werden. */
  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = this.enabled ? this.volume : 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 4;
    this.master.connect(comp).connect(ctx.destination);
    this.sfx = ctx.createGain();
    this.sfx.connect(this.master);
    this.amb = ctx.createGain();
    this.amb.connect(this.master);

    // Rauschquelle
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.noiseBuf = buf;
    const noise = () => {
      const n = ctx.createBufferSource();
      n.buffer = buf;
      n.loop = true;
      n.start();
      return n;
    };

    // E-Motor: zwei Töne + Inverter-Pfeifen
    this.motor = ctx.createGain();
    this.motor.gain.value = 0;
    const motorFilter = ctx.createBiquadFilter();
    motorFilter.type = 'bandpass';
    motorFilter.Q.value = 2;
    this.motorFilter = motorFilter;
    this.oscA = ctx.createOscillator();
    this.oscA.type = 'sawtooth';
    this.oscB = ctx.createOscillator();
    this.oscB.type = 'sine';
    this.oscA.connect(motorFilter);
    this.oscB.connect(motorFilter);
    motorFilter.connect(this.motor).connect(this.amb);
    this.oscA.start();
    this.oscB.start();
    this.whine = ctx.createOscillator();
    this.whine.type = 'sine';
    this.whineGain = ctx.createGain();
    this.whineGain.gain.value = 0;
    this.whine.connect(this.whineGain).connect(this.amb);
    this.whine.start();

    // Abrollen
    const road = noise();
    this.roadFilter = ctx.createBiquadFilter();
    this.roadFilter.type = 'lowpass';
    this.roadGain = ctx.createGain();
    this.roadGain.gain.value = 0;
    road.connect(this.roadFilter).connect(this.roadGain).connect(this.amb);
    // Wind
    const wind = noise();
    this.windFilter = ctx.createBiquadFilter();
    this.windFilter.type = 'bandpass';
    this.windFilter.frequency.value = 700;
    this.windFilter.Q.value = 0.6;
    this.windGain = ctx.createGain();
    this.windGain.gain.value = 0;
    wind.connect(this.windFilter).connect(this.windGain).connect(this.amb);
    // Regen auf dem Dach
    const rain = noise();
    const rf = ctx.createBiquadFilter();
    rf.type = 'highpass';
    rf.frequency.value = 1800;
    this.rainGain = ctx.createGain();
    this.rainGain.gain.value = 0;
    rain.connect(rf).connect(this.rainGain).connect(this.amb);
    // Martinshorn
    this.siren = ctx.createOscillator();
    this.siren.type = 'triangle';
    this.sirenGain = ctx.createGain();
    this.sirenGain.gain.value = 0;
    const sf = ctx.createBiquadFilter();
    sf.type = 'lowpass';
    sf.frequency.value = 2200;
    this.siren.connect(sf).connect(this.sirenGain).connect(this.sfx);
    this.siren.start();
    this.ready = true;
    this.rainTick = 0;
  }

  setEnabled(on) {
    this.enabled = on;
    if (this.master) this.master.gain.setTargetAtTime(on ? this.volume : 0, this.ctx.currentTime, 0.05);
  }

  /** Laufende Geräusche an den Fahrzustand anpassen. */
  update(dt, { speed, throttle, rain, sirenLevel, inCabin = true, paused = false, squeal = 0, rattle = 0 }) {
    if (!this.ready) return;
    const t = this.ctx.currentTime;
    const v = paused ? 0 : speed;
    const cab = inCabin ? 1 : 0.7;
    const duck = t < this.duckUntil ? this.duckTo : 1;
    this.oscA.frequency.setTargetAtTime(60 + v * 7.5, t, 0.05);
    this.oscB.frequency.setTargetAtTime(120 + v * 15, t, 0.05);
    this.motorFilter.frequency.setTargetAtTime(300 + v * 30, t, 0.05);
    this.motor.gain.setTargetAtTime(paused ? 0 : (0.012 + throttle * 0.03 + v * 0.0004) * cab * duck, t, 0.08);
    this.whine.frequency.setTargetAtTime(500 + v * 48, t, 0.05);
    this.whineGain.gain.setTargetAtTime(paused ? 0 : (0.0025 + throttle * 0.006) * Math.min(1, v / 8) * duck, t, 0.08);
    this.roadFilter.frequency.setTargetAtTime(200 + v * 22, t, 0.1);
    this.roadGain.gain.setTargetAtTime(paused ? 0 : clamp(v / 60, 0, 1) * 0.11 * cab * duck, t, 0.1);
    this.windGain.gain.setTargetAtTime(paused ? 0 : clamp((v / 65) ** 2, 0, 1) * 0.08 * duck, t, 0.1);
    this.windFilter.frequency.setTargetAtTime(500 + v * 14, t, 0.1);
    this.rainGain.gain.setTargetAtTime(paused ? 0 : rain * 0.05 * (0.7 + v / 120), t, 0.3);
    // Tropfen-Ticks
    if (!paused && rain > 0.1) {
      this.rainTick -= dt;
      if (this.rainTick <= 0) {
        this.rainTick = 0.02 + Math.random() * 0.12 / rain;
        this.tick(2000 + Math.random() * 3000, 0.012 * rain);
      }
    }
    // Martinshorn (zwei Töne, eine Quarte auseinander)
    const ph = (t % 1.4) < 0.7;
    this.siren.frequency.setTargetAtTime(ph ? 440 : 587, t, 0.01);
    this.sirenGain.gain.setTargetAtTime(paused ? 0 : sirenLevel * 0.05, t, 0.1);
    // Reifen an der Haftgrenze, Klappern des beschädigten Wagens
    if (squeal > 0 || this.squealGain) this.squeal(paused ? 0 : squeal);
    if (!paused) this.rattle(rattle, v, dt);
  }

  // --- Einmal-Geräusche ------------------------------------------------
  env(node, t0, a, peak, decay) {
    node.gain.setValueAtTime(0.0001, t0);
    node.gain.exponentialRampToValueAtTime(peak, t0 + a);
    node.gain.exponentialRampToValueAtTime(0.0001, t0 + a + decay);
  }

  tone(freq, dur = 0.2, type = 'sine', vol = 0.15, when = 0, slideTo = null) {
    if (!this.ready) return;
    const ctx = this.ctx;
    const t0 = ctx.currentTime + when;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    const g = ctx.createGain();
    this.env(g, t0, 0.008, vol, dur);
    o.connect(g).connect(this.sfx);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
  }

  noiseBurst(dur, vol, { type = 'lowpass', freq = 1000, q = 0.7, when = 0, slideTo = null } = {}) {
    if (!this.ready) return;
    const ctx = this.ctx;
    const t0 = ctx.currentTime + when;
    const n = ctx.createBufferSource();
    n.buffer = this.noiseBuf;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(freq, t0);
    if (slideTo) f.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    f.Q.value = q;
    const g = ctx.createGain();
    this.env(g, t0, 0.01, vol, dur);
    n.connect(f).connect(g).connect(this.sfx);
    n.start(t0, Math.random());
    n.stop(t0 + dur + 0.05);
  }

  tick(freq, vol) {
    this.tone(freq, 0.03, 'sine', vol);
  }

  nomiChime() {
    this.tone(1318.5, 0.35, 'sine', 0.09);
    this.tone(987.8, 0.5, 'sine', 0.08, 0.14);
    this.tone(2637, 0.2, 'sine', 0.02, 0.0);
  }

  naviAlert() {
    this.tone(880, 0.12, 'sine', 0.1);
    this.tone(1174.7, 0.18, 'sine', 0.1, 0.13);
  }

  pling() {
    this.tone(1567.98, 0.25, 'triangle', 0.08);
    this.tone(2093, 0.4, 'sine', 0.06, 0.06);
  }

  coin() {
    this.tone(987.8, 0.08, 'square', 0.04);
    this.tone(1318.5, 0.3, 'square', 0.04, 0.07);
  }

  chime() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.tone(f, 0.25, 'triangle', 0.07, i * 0.07));
  }

  bad() {
    this.tone(330, 0.25, 'sawtooth', 0.05, 0, 180);
  }

  /** Rempler, je nach Zone und Wucht (m/s) etwas anders – immer mit einem kleinen Plüsch-„Boing“. */
  crash(zone = 'front', power = 8) {
    const k = clamp(0.55 + power / 25, 0.55, 1);
    if (zone === 'left' || zone === 'right') {
      this.tone(95, 0.35, 'sine', 0.35 * k, 0, 45);
      this.noiseBurst(0.4, 0.22 * k, { type: 'bandpass', freq: 2200, slideTo: 700, q: 2 });
    } else if (zone === 'rear') {
      this.tone(110, 0.4, 'sine', 0.4 * k, 0, 40);
      this.noiseBurst(0.3, 0.28 * k, { freq: 2400, slideTo: 400 });
      this.tone(1900, 0.06, 'square', 0.025 * k, 0.05);
    } else {
      this.tone(70, 0.5, 'sine', 0.5 * k, 0, 30);
      this.noiseBurst(0.45, 0.4 * k, { freq: 1800, slideTo: 300 });
      this.noiseBurst(0.25, 0.18 * k, { type: 'bandpass', freq: 3500, q: 3, when: 0.03 });
    }
    this.tone(420, 0.22, 'sine', 0.05, 0.08, 230);
  }

  /** Reifen quietschen an der Haftgrenze (0 … 1), läuft dauerhaft und wird nur lauter oder leiser. */
  squeal(level) {
    if (!this.ready) return;
    const ctx = this.ctx;
    if (!this.squealGain) {
      const n = ctx.createBufferSource();
      n.buffer = this.noiseBuf;
      n.loop = true;
      this.squealFilter = ctx.createBiquadFilter();
      this.squealFilter.type = 'bandpass';
      this.squealFilter.Q.value = 9;
      this.squealGain = ctx.createGain();
      this.squealGain.gain.value = 0;
      n.connect(this.squealFilter).connect(this.squealGain).connect(this.sfx);
      n.start();
    }
    const t = ctx.currentTime;
    const l = clamp(level, 0, 1);
    this.squealFilter.frequency.setTargetAtTime(1150 + 380 * l + Math.sin(t * 9) * 40, t, 0.05);
    this.squealGain.gain.setTargetAtTime(l * l * 0.07, t, 0.08);
  }

  /** Leises Klappern, das mit dem Schaden wächst (0 … 3) – nur bei Fahrt. */
  rattle(level, speed, dt) {
    if (!this.ready || level <= 0 || speed < 3) return;
    this.rattleT = (this.rattleT || 0) - dt;
    if (this.rattleT > 0) return;
    this.rattleT = (0.09 + Math.random() * 0.5) / (0.4 + level * 0.45) / Math.min(1.5, 0.5 + speed / 40);
    const f = 900 + Math.random() * 1600;
    this.noiseBurst(0.035, 0.012 + level * 0.008, { type: 'bandpass', freq: f, q: 5 });
    if (level >= 2 && Math.random() < 0.3) this.tone(380 + Math.random() * 300, 0.03, 'triangle', 0.01 + level * 0.004);
  }

  scrape() {
    this.noiseBurst(0.35, 0.12, { type: 'bandpass', freq: 2600, q: 6 });
  }

  whoosh() {
    this.noiseBurst(0.5, 0.18, { type: 'bandpass', freq: 400, slideTo: 2500, q: 1.5 });
  }

  wiperTwitch() {
    this.tone(75, 0.12, 'sawtooth', 0.05);
    this.noiseBurst(0.08, 0.03, { type: 'bandpass', freq: 900, q: 4 });
  }

  wiperSweep() {
    this.tone(70, 0.9, 'sawtooth', 0.035);
    this.tone(1400, 0.35, 'sine', 0.012, 0.2, 1800);
  }

  /** Der Wischermotor zieht an und verhungert (Beginn eines Versuchs, der hängen bleibt). */
  wiperStrain() {
    this.tone(72, 0.34, 'sawtooth', 0.045, 0, 128);
    this.tone(290, 0.3, 'triangle', 0.012, 0.02, 520);
  }

  /** Das Gummi rubbelt über die Scheibe: n ganz kurze Stöße (when = Verzögerung in s). */
  wiperStutter(n = 4, when = 0) {
    for (let i = 0; i < n; i++) {
      this.noiseBurst(0.028, 0.034, { type: 'bandpass', freq: 620 + 90 * i, q: 5, when: when + i * 0.042 });
    }
  }

  /** Der Motor gibt auf: kurzes, absinkendes Brummen. */
  wiperGiveUp() {
    this.tone(96, 0.28, 'sawtooth', 0.03, 0, 52);
  }

  /** Der Wischer fällt auf den Anschlag der Parkstellung zurück. */
  wiperClack() {
    this.tone(170, 0.05, 'triangle', 0.055, 0, 85);
    this.noiseBurst(0.022, 0.04, { type: 'highpass', freq: 2400 });
  }

  /** Trockenes Gummi quietscht über trockenes Glas (Fehlalarm ohne Regen). */
  wiperSqueak() {
    this.tone(880, 0.12, 'triangle', 0.03, 0, 1480);
    this.tone(1020, 0.14, 'triangle', 0.028, 0.17, 1720);
    this.noiseBurst(0.1, 0.012, { type: 'bandpass', freq: 2600, q: 12, when: 0.02 });
    this.noiseBurst(0.1, 0.012, { type: 'bandpass', freq: 3000, q: 12, when: 0.19 });
  }

  /**
   * Die Hupe: ein Paar Fanfaren wie unter der Stoßstange, Tiefton und Hochton eine große Terz auseinander (HORN).
   * Beide klingen gleich laut, solange gehupt wird – kein abklingendes Pling –, setzen in ein paar Millisekunden ein
   * und verstummen ebenso kurz, ohne Knacken und ohne Tonhöhenrutschen. Den blechernen Klang macht die Membran:
   * ein Obertonspektrum mit einer Resonanz um 2,6 kHz (hornWave), dazu ein Hauch Schnarren aus gefiltertem Rauschen.
   * Hochton und Tiefton schwingen wie zwei echte Hörner nicht ganz gleich, daher die leichte Schwebung.
   */
  horn(dur = HORN.dur) {
    if (!this.ready) return;
    const ctx = this.ctx;
    const t0 = ctx.currentTime + 0.005;
    const t1 = t0 + dur;
    const end = t1 + HORN.release * 6;
    // ein Ausgang für beide Hörner: Einsatz (kurz etwas kräftiger, wie die anschlagende Membran), Halten, Ausklang
    const out = ctx.createGain();
    out.gain.setValueAtTime(0, t0);
    out.gain.linearRampToValueAtTime(HORN.vol * 1.15, t0 + HORN.attack);
    out.gain.setTargetAtTime(HORN.vol, t0 + HORN.attack, 0.04);
    out.gain.setTargetAtTime(0, t1, HORN.release);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 5200;
    lp.Q.value = 0.5;
    out.connect(lp).connect(this.sfx);
    HORN.freq.forEach((f, i) => {
      const o = ctx.createOscillator();
      o.setPeriodicWave(this.hornWave(f));
      o.frequency.setValueAtTime(f, t0);
      o.detune.setValueAtTime(HORN.detune[i], t0);
      const g = ctx.createGain();
      g.gain.value = HORN.mix[i];
      o.connect(g).connect(out);
      o.start(t0);
      o.stop(end);
    });
    // Schnarren der Membran
    const n = ctx.createBufferSource();
    n.buffer = this.noiseBuf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 2600;
    bp.Q.value = 3;
    const ng = ctx.createGain();
    ng.gain.value = HORN.rasp;
    n.connect(bp).connect(ng).connect(out);
    n.start(t0, Math.random());
    n.stop(end);
  }

  /** Die Schwingungsform eines Horns mit Grundton f (einmal gebaut, dann gemerkt). */
  hornWave(f) {
    this.hornWaves = this.hornWaves || new Map();
    let w = this.hornWaves.get(f);
    if (w) return w;
    const N = Math.min(40, Math.floor(6000 / f));
    const re = new Float32Array(N + 1);
    const im = new Float32Array(N + 1);
    for (let k = 1; k <= N; k++) {
      // abfallende Obertöne, die Membranresonanz hebt die um 2,6 kHz an
      const res = Math.exp(-(((k * f - 2600) / 900) ** 2));
      im[k] = (k ** -0.85) * (1 + 1.6 * res) * (k % 2 ? 1 : 0.8);
    }
    w = this.ctx.createPeriodicWave(re, im);
    this.hornWaves.set(f, w);
    return w;
  }

  blinker() {
    this.tone(2400, 0.02, 'square', 0.03);
  }

  flash() {
    this.noiseBurst(0.05, 0.15, { type: 'highpass', freq: 3000 });
    this.tone(3200, 0.6, 'sine', 0.02, 0.05, 6000);
  }

  megafon() {
    this.tone(900, 0.4, 'square', 0.04, 0, 1300);
  }

  /**
   * Ein Piepton mit flachem Dach: in 6 ms an, gleich laut gehalten, in 12 ms aus. Ein abklingender Ton (tone) hat seine
   * Kraft in den ersten 20 ms – so einer geht bei 130 km/h unter Abrollen und Wind unter.
   */
  beep(freq, dur, vol, when = 0, type = 'square') {
    if (!this.ready) return;
    const ctx = this.ctx;
    const t0 = ctx.currentTime + when;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 0.006);
    g.gain.setValueAtTime(vol, t0 + dur - 0.012);
    g.gain.linearRampToValueAtTime(0, t0 + dur);
    o.connect(g).connect(this.sfx);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  }

  /** Motor, Abrollen und Wind für secs Sekunden auf den Anteil to (update führt es aus, sanft wie jede Änderung). */
  duckFor(secs, to) {
    if (!this.ready) return;
    this.duckUntil = this.ctx.currentTime + secs;
    this.duckTo = to;
  }

  /**
   * Radarwarner: drei Doppelpiepser des kleinen Kästchens, hoch und höher (RADAR_BEEP) – über 2 kHz, wo das Ohr am
   * besten hört und Abrollen und Fahrtwind kaum noch Kraft haben; solange er piept, sind die Fahrgeräusche leiser.
   * OMIs Gong folgt, wenn er fertig ist (game.js RADAR.lead).
   */
  radar() {
    const B = RADAR_BEEP;
    this.duckFor(B.duck[0], B.duck[1]);
    for (let i = 0; i < B.n; i++) B.freq.forEach((f, k) => this.beep(f, B.dur, B.vol, B.start + i * B.every + k * B.gap));
  }

  /** Gang gewechselt: R zwei kurze steigende Zirper (wie der Radarwarner, nur leiser), D einer. */
  gear(g) {
    if (g === 'R') for (let i = 0; i < 2; i++) this.tone(1397, 0.07, 'triangle', 0.04, i * 0.11, 1568);
    else this.tone(1175, 0.07, 'triangle', 0.035, 0, 1319);
  }

  /** Ladestecker löst sich: die Verriegelung der Buchse klickt, das Relais in der Säule fällt dumpf ab. */
  unplug() {
    this.tone(2637, 0.02, 'square', 0.02, 0, 1568);
    this.tone(196, 0.07, 'triangle', 0.06, 0.03, 98);
    this.tone(2093, 0.02, 'square', 0.012, 0.12, 1319);
  }

  click() {
    this.tone(1200, 0.04, 'square', 0.02);
  }

  jingle() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 987.77, 1046.5];
    notes.forEach((f, i) => this.tone(f, 0.22, 'triangle', 0.06, i * 0.12));
  }

  /** Zuschlag der Auktion: ein Hammerschlag, dann eine kurze Fanfare. */
  zuschlag() {
    this.noiseBurst(0.08, 0.12, { type: 'lowpass', freq: 900 });
    [392, 523.25, 659.25].forEach((f, i) => this.tone(f, 0.11, 'square', 0.035, 0.12 + i * 0.1));
    this.tone(783.99, 0.5, 'triangle', 0.07, 0.42);
    this.tone(1046.5, 0.45, 'sine', 0.03, 0.44);
  }

  brunnenJingle() {
    [392, 523.25, 659.25, 523.25, 784].forEach((f, i) => this.tone(f, 0.3, 'sine', 0.07, i * 0.16));
    this.noiseBurst(1.2, 0.03, { type: 'highpass', freq: 4000, when: 0.1 });
  }

  /**
   * Die Hymne von Herrn Schönnbrun (Wiki: er hat eine eigene) zu Beginn jeder Folge BrunnenTV: eine eigene kleine
   * Melodie in C-Dur, gut zwei Sekunden, ohne Text – aufsteigend wie ein Strahl, zum Schluss ein Tusch und ein Plätschern.
   */
  schoennbrunHymne() {
    const melody = [
      [0, 392, 0.14], [0.15, 523.25, 0.14], [0.3, 659.25, 0.14], [0.45, 783.99, 0.3], [0.8, 659.25, 0.14], [0.95, 783.99, 0.14],
      [1.1, 880, 0.28], [1.42, 783.99, 0.14], [1.57, 659.25, 0.14], [1.72, 587.33, 0.14], [1.87, 523.25, 0.55],
    ];
    for (const [t, f, d] of melody) this.tone(f, d, 'triangle', 0.06, t);
    for (const [t, f, d] of [[0, 130.81, 0.4], [0.8, 98, 0.4], [1.87, 130.81, 0.6]]) this.tone(f, d, 'sine', 0.05, t);
    this.tone(659.25, 0.5, 'sine', 0.022, 1.87);
    this.tone(783.99, 0.5, 'sine', 0.018, 1.87);
    this.noiseBurst(0.8, 0.025, { type: 'highpass', freq: 3500, when: 1.95 });
  }

  record() {
    [659.25, 783.99, 987.77, 1318.5].forEach((f, i) => this.tone(f, 0.35, 'triangle', 0.08, i * 0.1));
  }

  confetti() {
    this.noiseBurst(0.15, 0.3, { type: 'lowpass', freq: 600 });
    for (let i = 0; i < 8; i++) this.tone(1500 + Math.random() * 2500, 0.05, 'sine', 0.02, 0.1 + i * 0.04);
  }
}
