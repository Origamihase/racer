// Eingabe: Tastatur (Pfeile und WASD), Gamepad und Touch (src/ui/touch.js schreibt hier hinein).
//
// Lenktasten zählen pro physischer Taste (e.code): Wer beide Richtungen hält, lenkt in die zuletzt gedrückte;
// lässt er sie los, gilt wieder die andere. Tastenwiederholungen zählen nicht, nur der gehaltene Zustand. Jede
// Änderung der Lenkrichtung wird mit ihrem Zeitpunkt aufgezeichnet und an die Fahrphysik als Anteil am Bild
// weitergegeben (steerLog): Ein Tipp wirkt im richtigen Teilschritt, egal ob der Rechner 30 oder 144 Bilder pro
// Sekunde schafft. Fokusverlust (Alt-Tab, Klick daneben, Tab im Hintergrund) lässt alle Tasten los.

const ACTIONS = {
  ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', ArrowUp: 'gas', KeyW: 'gas',
  ArrowDown: 'brake', KeyS: 'brake', Space: 'horn', KeyE: 'wiper', KeyH: 'megafon', Escape: 'pause', KeyP: 'pause',
  KeyV: 'camera', KeyM: 'mute', Enter: 'confirm', KeyC: 'chat', KeyL: 'ladestopp',
};
const STEER_DIR = { left: -1, right: 1 };
// Fahrtasten: Browser soll damit weder scrollen noch Kurzbefehle auslösen
const DRIVE_KEYS = new Set(['left', 'right', 'gas', 'brake', 'horn']);

/**
 * Lenktasten ohne DOM (auch für die Tests unter Node): gehaltene Tasten in der Reihenfolge des Drückens, die
 * zuletzt gedrückte gewinnt. Zeiten in Millisekunden (wie event.timeStamp und performance.now()).
 */
export class SteerKeys {
  constructor() {
    this.down = []; // [{ id, dir }] in der Reihenfolge des Drückens
    this.dir = 0;
    this.edges = []; // [[Zeit, Richtung]] seit dem letzten take()
  }

  press(id, dir, t) {
    if (this.down.some((d) => d.id === id)) return; // Wiederholung oder doppelt gemeldet
    this.down.push({ id, dir });
    this.changed(t);
  }

  release(id, t) {
    const i = this.down.findIndex((d) => d.id === id);
    if (i < 0) return;
    this.down.splice(i, 1);
    this.changed(t);
  }

  releaseAll(t) {
    if (!this.down.length) return;
    this.down.length = 0;
    this.changed(t);
  }

  changed(t) {
    const d = this.down.length ? this.down[this.down.length - 1].dir : 0;
    if (d === this.dir) return;
    this.dir = d;
    this.edges.push([t, d]);
  }

  /**
   * Kanten im Zeitfenster (t0, t1] als [Anteil 0 … 1, Richtung] für die Fahrphysik; danach ist das Protokoll leer.
   * Kanten vor t0 (spät zugestellte Ereignisse) liegen am Bildanfang.
   */
  take(t0, t1, out = []) {
    out.length = 0;
    const span = t1 - t0;
    for (const [t, d] of this.edges) out.push([span > 0 ? Math.min(1, Math.max(0, (t - t0) / span)) : 1, d]);
    this.edges.length = 0;
    return out;
  }
}

/** Stick: Totzone, dann eine sanfte Kurve (fein um die Mitte, voll am Anschlag). */
export function stickCurve(a, dead = 0.12, gamma = 1.6) {
  const m = Math.abs(a);
  if (m <= dead) return 0;
  return Math.sign(a) * Math.pow(Math.min(1, (m - dead) / (1 - dead)), gamma);
}

const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

/**
 * Zeitpunkt eines Ereignisses auf der Uhr von performance.now(). Ältere Browser zählen event.timeStamp anders (ab
 * 1970); weicht er mehr als eine Sekunde ab, gilt jetzt.
 */
export function eventTime(e, tn = now()) {
  return e && e.timeStamp > 0 && Math.abs(e.timeStamp - tn) < 1000 ? e.timeStamp : tn;
}

export class Input {
  constructor() {
    this.codes = new Set(); // gehaltene physische Tasten (e.code)
    this.sk = new SteerKeys();
    this.pressed = new Set();
    // gehaltene Aktionen (abgeleitet aus den Tasten)
    this.keys = new Set();
    // Touch (src/ui/touch.js): Zug-Lenkung −1 … 1, Spurwechsel-Wunsch, Pedale
    this.touch = { left: false, right: false, gas: false, brake: false, analog: 0, lane: 0 };
    this.steer = 0;
    this.steerKey = 0;
    this.steerLog = [];
    this.analog = 0;
    this.lane = 0;
    this.throttle = 0;
    this.brake = 0;
    this.anyKey = false;
    this.lastPoll = now();
    this.vibration = true; // Einstellung „Vibration“ (Handy und Gamepad)
    // bis zur ersten Eingabe: Handy und Tablet spielen mit Touch
    this.lastDevice = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches ? 'touch' : 'keyboard';
    this.map = ACTIONS;
    this.padPrev = {};
    this.padSteer = {};
    if (typeof window === 'undefined') return;
    window.addEventListener('keydown', (e) => this.onKey(e, true));
    window.addEventListener('keyup', (e) => this.onKey(e, false));
    // Fokus weg: nichts darf hängen bleiben
    window.addEventListener('blur', () => this.releaseAll());
    window.addEventListener('pagehide', () => this.releaseAll());
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) this.releaseAll();
      });
    }
  }

  onKey(e, down) {
    const a = ACTIONS[e.code];
    if (down && e.target && /input|textarea|select/i.test(e.target.tagName)) return;
    const t = eventTime(e);
    // Befehlstaste (macOS): Tasten, die währenddessen losgelassen werden, melden kein keyup – also alles loslassen
    // und Kurzbefehle mit ihr nicht als Fahrtasten zählen
    if (down && (e.code === 'MetaLeft' || e.code === 'MetaRight')) {
      this.releaseAll(t);
      return;
    }
    if (down && e.metaKey) return;
    if (!down) {
      if (!this.codes.has(e.code)) return;
      this.codes.delete(e.code);
      if (a in STEER_DIR) this.sk.release(e.code, t);
      this.syncKeys();
      return;
    }
    this.anyKey = true;
    this.lastDevice = 'keyboard';
    if (!a) return;
    // Fahrtasten nicht scrollen lassen, aber Leertaste und Pfeile auf sichtbaren Menü-Knöpfen dem Browser lassen
    const onButton = e.target && e.target.tagName === 'BUTTON' && e.target.offsetParent !== null;
    if (DRIVE_KEYS.has(a) && !onButton) e.preventDefault();
    // Wiederholungen zählen nicht – nur, ob die Taste gehalten wird. Eine Wiederholung ohne vorheriges Drücken
    // (die Taste war beim Fokuswechsel schon unten) bleibt ebenfalls ohne Wirkung, bis sie neu gedrückt wird.
    if (e.repeat || this.codes.has(e.code)) return;
    this.codes.add(e.code);
    if (!this.keys.has(a)) this.pressed.add(a);
    if (a in STEER_DIR) this.sk.press(e.code, STEER_DIR[a], t);
    this.syncKeys();
  }

  syncKeys() {
    this.keys.forEach((a) => {
      if (![...this.codes].some((c) => ACTIONS[c] === a)) this.keys.delete(a);
    });
    for (const c of this.codes) this.keys.add(ACTIONS[c]);
  }

  /** Alle Tasten loslassen (Fokusverlust, Menü zu). */
  releaseAll(t = now()) {
    this.codes.clear();
    this.keys.clear();
    this.sk.releaseAll(t);
    this.touch.left = this.touch.right = this.touch.gas = this.touch.brake = false;
    this.touch.analog = 0;
    if (this.onReleaseAll) this.onReleaseAll();
  }

  /** Touch-Tasten (Bedienung „Tasten“) lenken wie die Tastatur, mit Zeitstempel. */
  touchSteer(id, dir, down, t = now()) {
    // nur ein Druck zeigt das Gerät an: Loslassen kommt auch vom Zurücksetzen (Start, Pause), am Rechner ohne Touch
    if (down) {
      this.lastDevice = 'touch';
      this.sk.press(id, dir, t);
    } else this.sk.release(id, t);
  }

  bindTouch(el, action) {
    const on = (e) => {
      e.preventDefault();
      this.lastDevice = 'touch';
      if (action in this.touch) this.touch[action] = true;
      else this.pressed.add(action);
    };
    const off = (e) => {
      e.preventDefault();
      if (action in this.touch) this.touch[action] = false;
    };
    el.addEventListener('pointerdown', on);
    el.addEventListener('pointerup', off);
    el.addEventListener('pointercancel', off);
    el.addEventListener('pointerleave', off);
  }

  /** Einmal pro Bild vor der Fahrphysik. t: Zeitpunkt des Bildes (ms, wie performance.now()). */
  poll(t = now()) {
    if (t < this.lastPoll) t = this.lastPoll;
    let gas = this.keys.has('gas') || this.touch.gas ? 1 : 0;
    let brake = this.keys.has('brake') || this.touch.brake ? 1 : 0;
    let analog = this.touch.analog || 0;
    const pads = typeof navigator !== 'undefined' && navigator.getGamepads ? navigator.getGamepads() : [];
    for (const p of pads) {
      if (!p || !p.connected) continue;
      // Stick: Totzone und sanfte Kennlinie; der Stick hat Vorrang vor dem Touch-Zug
      const ax = stickCurve(p.axes[0] || 0);
      if (ax !== 0) {
        analog = ax;
        this.lastDevice = 'gamepad';
      }
      const rt = p.buttons[7]?.value || 0;
      const lt = p.buttons[6]?.value || 0;
      if (rt > 0.05) gas = Math.max(gas, Math.min(1, (rt - 0.05) / 0.9));
      if (lt > 0.05) brake = Math.max(brake, Math.min(1, (lt - 0.05) / 0.9));
      if (p.buttons[12]?.pressed) gas = 1;
      if (p.buttons[13]?.pressed) brake = 1;
      if (rt > 0.05 || lt > 0.05) this.lastDevice = 'gamepad';
      // Steuerkreuz: digital wie die Pfeiltasten (Zeitpunkt: letzte Meldung des Pads)
      const pt = p.timestamp > 0 && p.timestamp <= t ? Math.max(this.lastPoll, p.timestamp) : t;
      for (const [i, dir] of [[14, -1], [15, 1]]) {
        const id = 'pad' + p.index + ':' + i;
        const down = !!p.buttons[i]?.pressed;
        if (down !== !!this.padSteer[id]) {
          this.padSteer[id] = down;
          if (down) {
            this.sk.press(id, dir, pt);
            this.lastDevice = 'gamepad';
            this.anyKey = true;
          } else this.sk.release(id, pt);
        }
      }
      const btn = (i, action) => {
        // pro Gamepad merken, sonst löst ein zweites Pad den Knopf in jedem Bild neu aus
        const key = p.index + ':' + i;
        const down = !!p.buttons[i]?.pressed;
        if (down && !this.padPrev[key]) {
          this.pressed.add(action);
          this.anyKey = true;
          this.lastDevice = 'gamepad';
        }
        this.padPrev[key] = down;
      };
      btn(0, 'horn');
      btn(2, 'wiper');
      btn(3, 'megafon');
      btn(9, 'pause');
      btn(1, 'camera');
    }
    this.sk.take(this.lastPoll, t, this.steerLog);
    this.lastPoll = t;
    this.analog = Math.max(-1, Math.min(1, analog));
    // steerKey: Lenktasten am Bildende (zu steerLog); steer: mit Taste deren Richtung, sonst der stufenlose Wert
    this.steerKey = this.sk.dir;
    this.steer = this.sk.dir !== 0 ? this.sk.dir : this.analog;
    this.lane = this.touch.lane;
    this.touch.lane = 0;
    this.throttle = gas;
    this.brake = brake;
  }

  /** Rütteln: Gamepad (wo der Browser es kann) und Handy (Einstellung „Vibration“). */
  rumble(strength = 0.5, ms = 120) {
    if (!this.vibration) return;
    try {
      if (this.lastDevice === 'gamepad' && navigator.getGamepads) {
        for (const p of navigator.getGamepads()) {
          const va = p && p.vibrationActuator;
          if (va && va.playEffect) {
            va.playEffect('dual-rumble', { duration: ms, strongMagnitude: Math.min(1, strength), weakMagnitude: Math.min(1, strength * 0.6 + 0.2) }).catch(() => {});
          }
        }
      } else if (this.lastDevice === 'touch' && navigator.vibrate) navigator.vibrate(Math.round(ms * (0.5 + strength * 0.5)));
    } catch (e) {
      /* Rütteln ist Beiwerk */
    }
  }

  /** Wurde die Aktion seit dem letzten Bild gedrückt? */
  take(action) {
    if (this.pressed.has(action)) {
      this.pressed.delete(action);
      return true;
    }
    return false;
  }

  endFrame() {
    this.pressed.clear();
    this.anyKey = false;
  }
}
