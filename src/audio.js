// Alle Geräusche werden mit der Web-Audio-API erzeugt (keine Audiodateien):
// E-Motor-Surren, Abrollgeräusch, Fahrtwind, Regen, Wischer-Motor, Blinker, Hupe,
// Martinshorn, Spenden-Pling, NOMI-Gong, Crash und kleine Jingles.
import { clamp } from './util.js';

export class Audio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.volume = 0.8;
    this.ready = false;
    this.duck = 1;
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
  update(dt, { speed, throttle, rain, sirenLevel, inCabin = true, paused = false }) {
    if (!this.ready) return;
    const t = this.ctx.currentTime;
    const v = paused ? 0 : speed;
    const cab = inCabin ? 1 : 0.7;
    const duck = this.duck;
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

  crash() {
    this.tone(70, 0.5, 'sine', 0.5, 0, 30);
    this.noiseBurst(0.45, 0.4, { freq: 1800, slideTo: 300 });
    this.noiseBurst(0.25, 0.18, { type: 'bandpass', freq: 3500, q: 3, when: 0.03 });
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

  horn() {
    this.tone(415, 0.45, 'square', 0.06);
    this.tone(523, 0.45, 'square', 0.05);
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

  click() {
    this.tone(1200, 0.04, 'square', 0.02);
  }

  jingle() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 987.77, 1046.5];
    notes.forEach((f, i) => this.tone(f, 0.22, 'triangle', 0.06, i * 0.12));
  }

  brunnenJingle() {
    [392, 523.25, 659.25, 523.25, 784].forEach((f, i) => this.tone(f, 0.3, 'sine', 0.07, i * 0.16));
    this.noiseBurst(1.2, 0.03, { type: 'highpass', freq: 4000, when: 0.1 });
  }

  record() {
    [659.25, 783.99, 987.77, 1318.5].forEach((f, i) => this.tone(f, 0.35, 'triangle', 0.08, i * 0.1));
  }

  confetti() {
    this.noiseBurst(0.15, 0.3, { type: 'lowpass', freq: 600 });
    for (let i = 0; i < 8; i++) this.tone(1500 + Math.random() * 2500, 0.05, 'sine', 0.02, 0.1 + i * 0.04);
  }
}
