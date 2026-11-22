// Mini Adams Mimik: Blinzeln, Blick, Atmen, Sprechen, Stimmungen und kleine Gesten.
// Alles hängt nur an der Zeit t und einem festen Startwert (gleiche Aufrufe → gleiches Bild, Test-Renders sind
// wiederholbar): Blinzeln und Blickwechsel liegen auf einer Zeitachse aus Pseudozufall, Stimmungen blenden weich
// ein und wieder aus. Ergebnis ist ein Satz Gesichtsparameter, den miniAdam.js auf Lider, Brauen, Schnurrbart,
// Unterkiefer, Augen und Kopf überträgt.

/** Ganzzahl-Hash → 0 … 1 (für die Zeitachsen) */
function hash(k, seed) {
  let h = (k * 374761393 + seed * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const sstep = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

/**
 * Ruhegesicht: Lidkanten (rad, Elevation im Augenraum), Pupillengröße, ein kleines Lächeln (rad, wie smile).
 * Das untere Lid steht in Ruhe ein wenig höher (lächelnde Augen), das obere offen, aber nicht starr – mit dem
 * hängenden Schnurrbart wirkt er sonst schnell bekümmert.
 */
export const REST = { lidU: 0.84, lidL: 0.95, pupil: 1, smile: 0.21 };

/**
 * Stimmungen als Abweichung vom Ruhegesicht (alles optional):
 * lidU/lidL: Lidkante weiter auf (+) bzw. zu (−) · brow: Brauen heben (m) · browIn: innere Brauenenden heben (rad) ·
 * smile: Schnurrbart-Enden heben (rad) · jaw: Mund auf (rad) · pupil: Pupille größer (+) · pitch/roll: Kopf (rad,
 * pitch − = Kinn hoch) · bounce: Hüpfen (Stärke) · jump: kleiner Schreck-Hüpfer · nod: zweimal nicken (Stärke) ·
 * gaze: Blickziel · blink: Blinzeln (0 = nie, 1 = normal, Werte > 1 langsamer) · dur: Standarddauer (s)
 * Gesten mit dem Arm gibt es hier nicht: Freude zeigt er im Gesicht und auf dem Sitz (joy: hüpfen, die Hände bleiben
 * am Lenkrad), Dank mit einem Nicken (nod) – der Arm geht in der Fahrt nur zum Winken hoch (game/wave.js).
 */
export const MOODS = {
  happy: { lidU: 0.06, lidL: -0.34, brow: 0.005, browIn: -0.05, smile: 0.24, jaw: 0.13, pupil: 0.1, pitch: -0.05, bounce: 1, dur: 2.6 },
  startled: { lidU: 0.36, lidL: 0.1, brow: 0.005, browIn: 0.2, smile: -0.11, jaw: 0.15, pupil: -0.28, pitch: -0.06, jump: 1, blink: 0, dur: 1.4 },
  ouch: { lidU: -1.02, lidL: -0.84, brow: -0.003, browIn: 0.28, smile: -0.17, jaw: 0.02, roll: 0.06, blink: 0, dur: 0.9 },
  proud: { lidU: -0.14, lidL: -0.2, brow: 0.003, browIn: -0.04, smile: 0.15, jaw: 0.025, pitch: -0.1, dur: 3 },
  sleepy: { lidU: -0.5, lidL: -0.06, brow: -0.002, browIn: 0.08, smile: -0.02, pitch: 0.07, roll: 0.04, blink: 2.6, dur: 8 },
  curious: { lidU: 0.1, brow: 0.004, browIn: -0.06, browTilt: 0.12, roll: -0.12, gaze: 'screen', dur: 2.4 },
  rain: { lidU: 0.12, lidL: 0.04, brow: 0.006, browIn: 0.16, pitch: -0.1, gaze: 'wiper', dur: 2.6 },
  wink: { winkL: 1, smile: 0.12, browIn: 0.05, dur: 0.7 },
  nod: { smile: 0.08, lidL: -0.12, nod: 1, dur: 1.1 },
  joy: { lidU: 0.08, lidL: -0.4, brow: 0.006, browIn: -0.06, smile: 0.26, jaw: 0.16, pupil: 0.12, pitch: -0.06, bounce: 2.6, dur: 3 },
};

/**
 * Blickziele (Körperkoordinaten der Figur: Füße y = 0, Blick +z, +x = Fensterseite): Straße, Innenspiegel,
 * Navi-Bildschirm, OMI, Facecam (oben am Armaturenbrett), Handy mit dem Chat (an der Mittelkonsole), Seitenfenster,
 * Wischer – passend zum Fahrerplatz im Tesla und im Facecam-Studio.
 */
export const GAZE = {
  road: [-0.02, 0.76, 6],
  mirror: [-0.27, 0.95, 0.55],
  screen: [-0.33, 0.6, 0.6],
  nomi: [-0.3, 0.7, 0.58],
  camera: [-0.09, 0.82, 0.64],
  chat: [-0.24, 0.62, 0.5],
  window: [1.2, 0.72, 0.9],
  wiper: [-0.05, 1.02, 0.62],
  side: [-0.9, 0.7, 2.5],
};
// Wohin der Blick von selbst wandert (Gewichte)
const WANDER = [['road', 46], ['mirror', 12], ['screen', 11], ['nomi', 7], ['camera', 9], ['window', 7], ['side', 8]];
const WANDER_SUM = WANDER.reduce((s, w) => s + w[1], 0);

/** Gesten: Fensterhand winkt (wave) oder jubelt (cheer); Dauer in s */
export const GESTURES = { wave: 2.6, cheer: 2.2 };

export class Mimic {
  /** @param {number} seed Startwert der Zeitachsen (alle Mini Adams mit gleichem Wert blinzeln gleich) */
  constructor(seed = 7) {
    this.seed = seed;
    this.moods = [];
    this.gestures = [];
    this.focus = null;
    this.lastT = null;
    // Zeitachsen: Blinzeln und Blickwechsel (Index, Beginn)
    this.blinkK = 0;
    this.blinkT = 1.1;
    this.gazeK = 0;
    this.gazeT = 0;
    // geglättete Kopf- und Augenbewegung
    this.head = { yaw: 0, pitch: 0, vy: 0, vp: 0 };
    this.eye = [0, 0.76, 6];
    this.talk = 0;
    this.out = {
      lidU: [REST.lidU, REST.lidU], lidL: [REST.lidL, REST.lidL], brow: [0, 0], browTilt: [0, 0], smile: 0, jaw: 0, pupil: 1,
      yaw: 0, pitch: 0, roll: 0, lift: 0, breath: 0, gaze: [0, 0.76, 6], wave: 0, cheer: 0,
    };
  }

  /** Stimmung für sec Sekunden (Standard: die der Stimmung), Stärke 0 … 1 */
  setMood(name, sec, strength = 1, t = this.lastT ?? 0) {
    const m = MOODS[name];
    if (!m) return;
    // dieselbe Stimmung wird verlängert statt doppelt gezählt – weich vom jetzigen Gewicht aus (auch mitten im
    // Ausblenden), damit nichts springt
    const old = this.moods.find((x) => x.name === name);
    const dur = sec ?? m.dur;
    if (old) {
      old.from = this.weight(old, t);
      old.k = Math.max(old.from, strength);
      old.start = t;
      old.end = Math.max(old.end, t + dur);
      // Hüpfer neu nur, wenn der alte vorbei ist (sonst bliebe die Figur mitten in der Luft stehen)
      if (t - old.t0 > (m.jump ? 0.32 : 2)) old.t0 = t;
      return;
    }
    this.moods.push({ name, m, start: t, t0: t, end: t + dur, k: strength, from: 0 });
  }

  /** Geste name zur Zeit t, Stärke k (1 = ganz; der verlegene Gruß nach einem Rempler winkt kleiner, game/wave.js) */
  gesture(name, t = this.lastT ?? 0, k = 1) {
    if (!GESTURES[name]) return;
    // läuft dieselbe Geste noch, geht sie von ihrer jetzigen Lage aus weiter (die Hand springt nicht zurück)
    const old = this.gestures.find((g) => g.name === name);
    const from = old ? this.gestureWeight(old, t) : 0;
    this.gestures = this.gestures.filter((g) => g !== old);
    this.gestures.push({ name, start: t, end: t + GESTURES[name], from, k });
  }

  /** Gewicht einer Geste: hoch in 0,55 s (ab from bis zu ihrer Stärke k), zum Schluss in 0,6 s zurück ans Lenkrad */
  gestureWeight(g, t) {
    const k = g.k ?? 1;
    return (g.from + (k - g.from) * sstep(g.start, g.start + 0.55, t)) * (1 - sstep(g.end - 0.6, g.end, t));
  }

  /** Blick für sec Sekunden auf ein Ziel aus GAZE (oder [x, y, z] in Körperkoordinaten) */
  lookAt(target, sec = 1.6, t = this.lastT ?? 0) {
    this.focus = { p: typeof target === 'string' ? GAZE[target] : target, end: t + sec };
  }

  /** Einblendgewicht einer Stimmung: schnell an (0,25 s, ab dem Gewicht from), weich aus (0,7 s) */
  weight(x, t) {
    return (x.from + (x.k - x.from) * sstep(x.start, x.start + 0.25, t)) * (1 - sstep(x.end, x.end + 0.7, t));
  }

  /**
   * Ein Schritt: t = Zeit (s), o = { talk 0 … 1, steer −1 … 1, look −1 … 1 (Kopf zur Seite), sleepy 0 … 1 }.
   * Rückgabe: this.out (wird wiederverwendet).
   */
  update(t, o = {}) {
    let dt = this.lastT === null ? 0 : t - this.lastT;
    if (dt < 0 || dt > 0.5) {
      // Zeit zurückgesprungen (neue Fahrt, Test): Zeitachsen neu ab hier
      this.blinkK = 0;
      this.blinkT = t + 0.6;
      this.gazeK = 0;
      this.gazeT = t;
      dt = 0;
    }
    this.lastT = t;
    const out = this.out;
    // --- Stimmungen mischen ---
    let lidU = 0;
    let lidL = 0;
    let brow = 0;
    let browIn = 0;
    let browTilt = 0;
    let smile = 0;
    let jaw = 0;
    let pupil = 0;
    let pitch = 0;
    let roll = 0;
    let lift = 0;
    let noBlink = 0;
    let slow = 1;
    let winkL = 0;
    let gazeMood = null;
    let gazeW = 0;
    this.moods = this.moods.filter((x) => t < x.end + 0.75);
    for (const x of this.moods) {
      const w = this.weight(x, t);
      if (w <= 0) continue;
      const m = x.m;
      lidU += (m.lidU || 0) * w;
      lidL += (m.lidL || 0) * w;
      brow += (m.brow || 0) * w;
      browIn += (m.browIn || 0) * w;
      browTilt += (m.browTilt || 0) * w;
      smile += (m.smile || 0) * w;
      jaw += (m.jaw || 0) * w;
      pupil += (m.pupil || 0) * w;
      pitch += (m.pitch || 0) * w;
      roll += (m.roll || 0) * w;
      winkL += (m.winkL || 0) * w;
      if (m.blink === 0) noBlink = Math.max(noBlink, w);
      else if (m.blink > 1) slow = Math.max(slow, 1 + (m.blink - 1) * w);
      if (m.bounce) lift += m.bounce * w * 0.012 * Math.max(0, Math.sin((t - x.t0) * 9.5)) * (1 - sstep(x.t0 + 1.2, x.t0 + 2, t));
      if (m.jump) lift += m.jump * x.k * 0.022 * Math.sin(Math.PI * clamp((t - x.t0) / 0.32, 0, 1));
      // nicken: Kinn zweimal runter und wieder hoch (0,42 s je Nicken), dann Ruhe
      if (m.nod) pitch += m.nod * x.k * 0.1 * Math.sin(Math.PI * clamp((t - x.t0) / 0.42, 0, 2)) ** 2;
      if (m.gaze && w > gazeW) {
        gazeMood = GAZE[m.gaze];
        gazeW = w;
      }
    }
    const sleepy = o.sleepy || 0;
    if (sleepy > 0) {
      lidU += MOODS.sleepy.lidU * sleepy;
      pitch += MOODS.sleepy.pitch * sleepy;
      slow = Math.max(slow, 1 + (MOODS.sleepy.blink - 1) * sleepy);
    }

    // --- Blinzeln: unregelmäßig (2 … 6 s, ab und zu doppelt), schläfrig langsamer und länger ---
    const len = 0.17 * slow;
    while (t > this.blinkT + len) {
      const h = hash(this.blinkK * 2 + 1, this.seed);
      const dbl = hash(this.blinkK * 2 + 2, this.seed) < 0.16;
      // (der zweite eines Doppel-Blinzlers erst, wenn der erste ganz offen ist – schläfrig dauert ein Blinzeln
      // länger als der Abstand, sonst spränge das Lid mitten im Aufgehen wieder fast zu)
      this.blinkT += dbl ? len + 0.14 : (2.1 + 3.9 * h) * (0.75 + 0.25 * slow);
      this.blinkK++;
    }
    let blink = 0;
    if (t >= this.blinkT) {
      const p = (t - this.blinkT) / len;
      // schnell zu, kurz halten, langsamer auf
      blink = p < 0.35 ? sstep(0, 0.35, p) : 1 - sstep(0.5, 1, p);
    }

    // --- Blick: wandert zwischen Zielen (0,8 … 3,6 s), dazwischen kleine Sakkaden ---
    while (t >= this.gazeT + this.gazeDur(this.gazeK)) {
      this.gazeT += this.gazeDur(this.gazeK);
      this.gazeK++;
    }
    let tgt = this.wanderTarget(this.gazeK);
    if (this.focus && t < this.focus.end) tgt = this.focus.p;
    else this.focus = null;
    if (gazeMood && gazeW > 0.3) tgt = gazeMood;
    const mk = this.gazeK * 7 + Math.floor((t - this.gazeT) / 0.55);
    const jx = (hash(mk * 3 + 11, this.seed) - 0.5) * 0.05;
    const jy = (hash(mk * 3 + 12, this.seed) - 0.5) * 0.035;
    // Augen springen (Sakkade ~ 70 ms), der Kopf folgt gedämpft
    const ek = dt > 0 ? 1 - Math.exp(-dt / 0.035) : 1;
    const e = this.eye;
    e[0] += (tgt[0] + jx * tgt[2] - e[0]) * ek;
    e[1] += (tgt[1] + jy * tgt[2] - e[1]) * ek;
    e[2] += (tgt[2] - e[2]) * ek;
    out.gaze[0] = e[0];
    out.gaze[1] = e[1];
    out.gaze[2] = e[2];
    // Kopf: dreht etwa halb zum Blickziel (Hals ist kurz), kritisch gedämpfte Feder
    const dx = tgt[0];
    const dy = tgt[1] - 0.74;
    const dz = Math.max(0.2, tgt[2]);
    const wantYaw = clamp(Math.atan2(dx, dz) * 0.5, -0.5, 0.5);
    const wantPitch = clamp(-Math.atan2(dy, Math.hypot(dx, dz)) * 0.45, -0.22, 0.2);
    const H = this.head;
    if (dt > 0) {
      const w0 = 9;
      H.vy += (w0 * w0 * (wantYaw - H.yaw) - 2 * w0 * H.vy) * dt;
      H.vp += (w0 * w0 * (wantPitch - H.pitch) - 2 * w0 * H.vp) * dt;
      H.yaw += H.vy * dt;
      H.pitch += H.vp * dt;
    } else {
      H.yaw = wantYaw;
      H.pitch = wantPitch;
    }

    // --- Sprechen: Unterkiefer im Silbentakt (unregelmäßig, nie mechanisch) ---
    // (geglättet: wer talk hart an- und ausschaltet, bekommt trotzdem keinen springenden Kiefer)
    const tk = dt > 0 ? 1 - Math.exp(-dt / 0.06) : 1;
    this.talk += ((o.talk || 0) - this.talk) * tk;
    const talk = this.talk < 1e-3 ? 0 : this.talk;
    let talkJaw = 0;
    if (talk > 0) {
      const s = Math.sin(t * 11.3) * 0.5 + Math.sin(t * 7.1 + 1.3) * 0.35 + Math.sin(t * 17.9 + 0.4) * 0.15;
      const syl = Math.max(0, s) ** 0.8;
      const pause = sstep(0.15, 0.35, Math.sin(t * 1.9 + 0.7) * 0.5 + 0.5 + Math.sin(t * 0.83) * 0.3);
      talkJaw = talk * (0.03 + 0.14 * syl * pause);
    }

    // --- Gesten (Fensterhand) ---
    let wave = 0;
    let cheer = 0;
    this.gestures = this.gestures.filter((g) => t < g.end);
    for (const g of this.gestures) {
      const k = this.gestureWeight(g, t);
      if (g.name === 'wave') wave = Math.max(wave, k);
      else cheer = Math.max(cheer, k);
    }

    // --- Atmen und kleine Kopfbewegung (überlagerte Sinus, keine sichtbare Wiederholung) ---
    const breath = Math.sin(t * 1.55) * 0.75 + Math.sin(t * 0.61 + 2) * 0.25;
    const steer = o.steer || 0;
    out.breath = breath;
    out.yaw = H.yaw + (o.look || 0) * 0.6 + Math.sin(t * 0.37 + 1) * 0.025;
    out.pitch = H.pitch + pitch + Math.sin(t * 0.53) * 0.015 + breath * 0.006;
    out.roll = roll - steer * 0.1 + Math.sin(t * 0.71 + 0.5) * 0.018;
    out.lift = lift;

    // --- Gesicht zusammensetzen ---
    // erschrocken oder zusammengekniffen: kein Blinzeln
    const bl = blink * (1 - noBlink);
    for (let i = 0; i < 2; i++) {
      const wink = i === 0 ? winkL : 0;
      const shut = Math.max(bl, wink);
      // gemischte Stimmungen addieren sich: nie weiter zu als geschlossen, nie weiter auf als ganz offen
      const u = clamp(REST.lidU + lidU, -0.26, 1.15);
      const l = clamp(REST.lidL + lidL, 0.22, 1.2);
      // geschlossen treffen sich die Lider knapp unter der Mitte
      out.lidU[i] = u + (-0.26 - u) * shut;
      out.lidL[i] = l + (0.22 - l) * shut;
    }
    // (auch hier Grenzen für gemischte Stimmungen: Brauen bleiben unter der Cap, der Mund klafft nicht)
    out.brow[0] = out.brow[1] = clamp(brow, -0.004, 0.009) - 0.001 * bl;
    browIn = clamp(browIn, -0.12, 0.3);
    out.browTilt[0] = browIn - browTilt;
    out.browTilt[1] = browIn + browTilt;
    out.smile = REST.smile + clamp(smile, -0.3, 0.24);
    out.jaw = clamp(jaw + talkJaw, 0, 0.26);
    out.pupil = REST.pupil + clamp(pupil, -0.3, 0.12);
    out.wave = wave;
    out.cheer = cheer;
    return out;
  }

  gazeDur(k) {
    return 0.8 + 2.8 * hash(k * 5 + 3, this.seed);
  }

  wanderTarget(k) {
    // jeder zweite Abschnitt zurück zur Straße: er fährt ja
    if (k % 2 === 0) return GAZE.road;
    let r = hash(k * 5 + 4, this.seed) * WANDER_SUM;
    for (const [name, w] of WANDER) {
      r -= w;
      if (r < 0) return GAZE[name];
    }
    return GAZE.road;
  }
}
