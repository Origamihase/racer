// Fahrwerk: wie Karosserie und Kameras auf die Querbewegung antworten – Wanken des Wagens, der Kopf des Fahrers,
// die Neigung der Cockpitkamera, der Blick, der auf der Straße bleibt, und wie eng die Verfolgerkamera folgt. Rein
// (ohne three.js), damit tools/steer-test.mjs es unter Node prüft.
//
// Warum: Früher hingen Wanken, Kopf und Kamera an der rohen Querbeschleunigung der Lenkung (beim Drücken Spitzen um
// 40 m/s², beim Loslassen −30 m/s²) mit Gliedern erster Ordnung (Kopf mit 4/s nachgezogen). Bei jedem Spurwechsel
// rollte das Bild um gut 6° zur einen und beim Loslassen zur anderen Seite und kam erst eine Sekunde nach dem Wagen
// zur Ruhe; die Verfolgerkamera ließ den Wagen 3 m durchs Bild gleiten. Der Wagen „schwamm“. Jetzt zählt nur, was die
// Reifen an Querbeschleunigung hergeben (weich begrenzt), und alles hängt an einer kritisch gedämpften Feder (straff,
// ohne Überschwingen); das Sportfahrwerk aus dem Shop macht sie noch straffer und die Ausschläge kleiner.

/**
 * feel: gefühlte Querbeschleunigung höchstens (m/s², weich begrenzt) · w: Eigenfrequenz der Feder (1/s) je Stufe
 * (Serie, Sportfahrwerk 1, 2): zur Ruhe nach gut 4,7/w s · amp: Ausschläge je Stufe · roll: Wanken der Karosserie
 * (rad je m/s², höchstens rollMax) · head: Kopf zur Seite (m je m/s², höchstens headMax) · tilt: Neigung der
 * Cockpitkamera gegen den Wagen (rad je m/s²) · gaze: so viel der Gier nehmen die Augen zurück (der Blick bleibt auf
 * der Straße) · lag: Querversatz der Verfolgerkamera je m/s Querfahrt (m) · droneYaw: Anteil der Gier, mit dem sie
 * schwenkt · follow: wie schnell sie nachführt (1/s) je Stufe.
 */
export const CHASSIS = {
  feel: 7,
  w: [13, 16, 19],
  amp: [1, 0.82, 0.68],
  roll: 0.0022,
  rollMax: 0.018,
  head: 0.0032,
  headMax: 0.024,
  tilt: 0.0011,
  gaze: 0.3,
  lag: 0.08,
  droneYaw: 0.5,
  follow: [10, 12, 14],
};

/** Weiche Begrenzung auf ±A (bis 60 % unverändert, darüber stetig in die Sättigung). */
function soft(a, A) {
  const k = 0.6 * A;
  const m = Math.abs(a);
  if (m <= k) return a;
  const r = A - k;
  return Math.sign(a) * (k + r * Math.tanh((m - k) / r));
}

export class Chassis {
  constructor() {
    this.reset();
  }

  reset() {
    this.a = 0; // gefühlte Querbeschleunigung (m/s²), Federweg
    this.av = 0; // ihre Änderung (m/s³)
    this.roll = 0;
    this.head = 0;
    this.tilt = 0;
    this.level = 0;
  }

  /**
   * Ein Bild: Feder auf die gefühlte Querbeschleunigung (genau gelöst für ein im Bild festes Ziel, also unabhängig
   * von der Bildrate). latAcc: Querbeschleunigung der Lenkung (m/s², rechts positiv), level: Sportfahrwerk 0 … 2.
   */
  update(dt, latAcc, level = 0) {
    const C = CHASSIS;
    const i = Math.max(0, Math.min(C.w.length - 1, level | 0));
    this.level = i;
    const target = soft(Number.isFinite(latAcc) ? latAcc : 0, C.feel);
    if (dt > 0) {
      const w = C.w[i];
      const c1 = this.a - target;
      const c2 = this.av + w * c1;
      const e = Math.exp(-w * dt);
      this.a = target + (c1 + c2 * dt) * e;
      this.av = (c2 - w * (c1 + c2 * dt)) * e;
    }
    const k = C.amp[i];
    this.roll = Math.max(-C.rollMax, Math.min(C.rollMax, this.a * C.roll * k));
    this.head = Math.max(-C.headMax, Math.min(C.headMax, -this.a * C.head * k));
    this.tilt = -this.a * C.tilt * k;
    return this;
  }

  /** Wie schnell die Verfolgerkamera nachführt (1/s). */
  get follow() {
    return CHASSIS.follow[this.level];
  }
}
