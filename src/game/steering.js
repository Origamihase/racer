// Lenkung des Teslas: Aus Tasten, Stick oder Touch wird ein weicher Lenkbefehl und daraus die Querbewegung in
// Straßenkoordinaten (x quer, rechts positiv; kappa > 0: die Straße biegt nach links). Rein – ohne three.js und
// DOM –, damit tools/steer-test.mjs und der Fahrer-Bot (tools/steer-bot.mjs) sie unter Node prüfen können.
//
// Die Querbewegung vx = vs + vc + vi hat drei Teile:
//  vs – was der Spieler lenkt: drei gleich schnelle Glieder erster Ordnung hintereinander (zusammen kritisch
//       gedämpft, also ohne Überschwingen, und ohne Ruck beim Drücken). Die ersten beiden formen aus der Taste den
//       weichen Lenkbefehl u – ihn zeigen Lenkrad, Hände und Vorderräder –, das dritte ist die Quergeschwindigkeit.
//       Aufbau, Loslassen und Gegenlenken sind verschieden schnell.
//  vc – was die Kurve macht: Ein Auto, das in der Welt geradeaus fährt, wandert in einer Linkskurve nach rechts
//       hinaus (relativ zur Straße mit v²κ beschleunigt). Die Reifen halten mit a = −h·v²κ − μ·vc dagegen
//       (Kurvenhilfe h, Selbstausrichtung μ – dieselbe, die auf der Geraden das seitliche Gleiten beendet), aber nie
//       mehr als die Haftgrenze. Freihändig ohne Kurvenhilfe: erst x ≈ ½·v²κ·t² wie geradeaus in der Welt, dann eine
//       gleichmäßige Drift v²κ/μ nach außen. Über der Haftgrenze wächst vc weiter: Der Wagen schiebt nach außen.
//  vi – Stöße (Rempler, Leitplanke); klingen rasch ab.
//
// Gerechnet wird in festen Teilschritten auf einem durchgehenden Zeitraster (siehe Player.update): Ein Tastendruck
// wirkt ab dem Teilschritt, in dem er wirklich geschah. So fährt dasselbe Tastenskript bei 30, 60 und 144 Bildern pro
// Sekunde dieselbe Bahn.

export const STEER = {
  h: 1 / 1000, // Teilschritt (s)
  vLat: 4.7, // höchste Quergeschwindigkeit (m/s) ab vFull: mit dem sanften Anfang eine Spur in knapp 1 s
  vFull: 40 / 3.6, // darunter proportional weniger: beim Rangieren sanfter
  up: 29, // Aufbau (1/s) der drei Glieder: ein Sprung im Lenkwunsch steht nach 0,22 s zu 95 %
  down: 37, // Loslassen: nach 0,18 s ist die Querbewegung vorbei (95 %)
  rev: 42, // Gegenlenken
  tapMin: 0.065, // so lange wirkt jeder Tipp mindestens (s): der kürzeste Tipp ist eine kleine Feinkorrektur (≈ 0,15 m)
  // Halten wird fortschreitend stärker: Die Taste lenkt anfangs mit ease der vollen Querfahrt und wächst zwischen
  // easeFrom und easeTo (s nach dem Drücken) stetig auf die volle. Kurzes Halten ist eine kleine Korrektur, langes ein
  // entschlossener Spurwechsel. Der Lenkwunsch steigt nur (kein Stoß, der wieder abfällt): Die Querbeschleunigung hat
  // einen einzigen weichen Buckel, der Wagen zieht gleichmäßig an, ohne „Ruck, Pause, Ruck“.
  ease: 0.62,
  easeFrom: 0,
  easeTo: 0.26,
  wetSlow: 0.22, // Nässe: so viel langsamere Antwort (Anteil) …
  wetLat: 0.1, // … und so viel weniger Quergeschwindigkeit
  mu: 1.9, // Selbstausrichtung gegen die Kurvendrift (1/s)
  grip: 8, // Haftgrenze trocken (m/s²) für Kurve plus Selbstausrichtung
  gripWet: 5, // nass
  imp: 6, // Abklingen von Stößen (1/s)
  wheelAcc: 9, // so viel Querbeschleunigung (m/s²) zeigt das Lenkrad als vollen Einschlag (Kurvenanteil)
};

/** Kurvenhilfe: welcher Anteil der Kurve von selbst gefahren wird. */
export const CURVE_ASSIST = { aus: 0, sanft: 0.5, stark: 0.85 };

/**
 * Spurhalteassistent (nur freihändig, nach einer kurzen Pause, weich anfahrend). Er schaut, wo der Wagen ohne Lenken
 * zum Stehen käme: Liegt das in der Totzone um eine Spurmitte (dead, m), bleibt der Wagen dort – Tipps zum
 * Feinpositionieren werden nie zurückgenommen. Liegt es weiter daneben, führt er ihn ganz in die Mitte dieser Spur:
 * gemächlich nach einer Pause (pause s; höchstens max m/s, Anfahren und Verzögern mit acc m/s², am Ende gain 1/s),
 * und zügig, wenn der Wagen sonst auf der Linie zwischen zwei Spuren stünde (weiter als far m daneben; far…-Werte):
 * Wer mitten im Spurwechsel loslässt, wird nicht dort stehen gelassen. In Kurven tritt er zurück – dort lenkt der
 * Spieler, die Kurvenhilfe nimmt ihm nur einen Teil ab.
 */
export const LANE_ASSIST = {
  aus: null,
  sanft: { dead: 0.7, pause: 0.45, max: 0.7, acc: 0.8, gain: 5, far: 0.9, farPause: 0.12, farMax: 2.2, farAcc: 4.5 },
  an: { dead: 0.2, pause: 0.3, max: 1, acc: 1.2, gain: 5.5, far: 0.9, farPause: 0.1, farMax: 2.4, farAcc: 5 },
};

/** Weiche Begrenzung auf ±A: bis 75 % unverändert, darüber stetig (ohne Knick) in die Sättigung. */
export function softclip(a, A) {
  const k = 0.75 * A;
  const m = Math.abs(a);
  if (m <= k) return a;
  const r = A - k;
  return Math.sign(a) * (k + r * Math.tanh((m - k) / r));
}

/** Geschwindigkeit (1/s), mit der ein Glied von cur auf target zuläuft. */
function rate(target, cur, P) {
  if (target * cur < 0) return P.rev;
  return Math.abs(target) >= Math.abs(cur) ? P.up : P.down;
}

/**
 * Wirksame Lenk-Kennwerte für Tempo, Nässe, Reifen-Upgrade und Lenkempfindlichkeit.
 * @param {object} out wird befüllt und zurückgegeben (keine Speicheranforderung pro Teilschritt)
 * @param {{v:number, wet:number, latMul:number, sens:number, wetGrip:number}} q
 */
export function steerParams(out, q) {
  const wet = Math.min(1, Math.max(0, q.wet || 0));
  // Reifen-Upgrade nimmt einen Teil des Nässe-Nachteils weg (wetGrip 0,66 … 1)
  const wetK = wet * (1 - Math.min(1, Math.max(0, ((q.wetGrip ?? 0.66) - 0.66) / 0.34)) * 0.5);
  const sens = q.sens ?? 1;
  const slow = 1 - STEER.wetSlow * wetK;
  const low = Math.min(1, Math.max(0, q.v / STEER.vFull));
  out.vq = STEER.vLat * (q.latMul || 1) * (0.8 + 0.2 * sens) * (1 - STEER.wetLat * wetK) * low;
  out.up = STEER.up * slow * (0.92 + 0.08 * sens);
  out.down = STEER.down * slow;
  out.slow = slow;
  out.rev = STEER.rev * slow;
  out.mu = STEER.mu;
  out.grip = STEER.grip + (STEER.gripWet - STEER.grip) * wetK;
  return out;
}

/**
 * Ein Teilschritt der Querdynamik (rein). s: { x, u1, u, vs, vc, vi } wird fortgeschrieben, dazu s.as (Beschleunigung des
 * Spieler-Anteils), s.ac (Querbeschleunigung der Reifen für die Kurve, Welt) und s.over (wie weit über der Haftgrenze).
 * @param {object} s Zustand
 * @param {number} d Lenkwunsch −1 … 1 (Tasten, Stick, Assistenten)
 * @param {object} P aus steerParams()
 * @param {{v:number, kappa:number, assist:number}} env Tempo (m/s), Krümmung (1/m, > 0 links), Kurvenhilfe 0 … 1
 * @param {number} h Schrittweite (s)
 */
export function lateralStep(s, d, P, env, h) {
  const a0 = s.u1;
  s.u1 = d + (a0 - d) * Math.exp(-rate(d, a0, P) * h);
  const u0 = s.u;
  s.u = s.u1 + (u0 - s.u1) * Math.exp(-rate(s.u1, u0, P) * h);
  // Kurve: was die Reifen gegen die Fliehkraft leisten sollen (Kurvenhilfe plus Selbstausrichtung)
  const vk = env.v * env.v * env.kappa;
  const want = -env.assist * vk - P.mu * s.vc;
  const tgt = s.u * P.vq;
  const v0 = s.vs;
  let vs = tgt + (v0 - tgt) * Math.exp(-rate(tgt, v0, P) * h);
  // An der Haftgrenze lässt sich nicht weiter zur Kurveninnenseite einlenken: Die Reifen sind schon ausgelastet
  // (nach außen geht immer). Unterhalb von 80 % Auslastung merkt man davon nichts.
  if ((vs - v0) * want > 0) vs = v0 + (vs - v0) * (1 - smooth(0.8, 1.05, Math.abs(want) / P.grip));
  s.vs = vs;
  s.as = (vs - v0) / h;
  const ac = softclip(want, P.grip);
  s.ac = ac;
  // Untersteuern: was die Reifen nicht mehr schaffen (0 bis zur Grenze, 1 deutlich darüber)
  s.over = (Math.abs(want) - Math.abs(ac)) / (0.25 * P.grip);
  s.vc += (vk + ac) * h;
  s.vi *= Math.exp(-STEER.imp * h);
  s.x += (s.vs + s.vc + s.vi) * h;
}

/**
 * Wo käme der Wagen zum Stehen (quer), wenn ab jetzt nicht mehr gelenkt würde? Für die Kette aus drei Gliedern mit
 * der Loslass-Geschwindigkeit k ist der Restweg genau (vs + vq·(u + u1)) / k; Kurvendrift und Stoß laufen etwas weiter.
 */
export function stopPoint(s, P) {
  return s.x + (s.vs + P.vq * (s.u + s.u1)) / P.down + s.vc * (3 / P.down) + s.vi / STEER.imp;
}

/**
 * Lenkwunsch aus Tasten, Stick/Touch, Spurwechsel per Tipp und Spurhalteassistent. Läuft in den Teilschritten der
 * Querdynamik mit (Simulationszeit t in Sekunden).
 */
export class SteerControl {
  constructor() {
    this.reset();
  }

  reset() {
    this.key = 0; // Tastenrichtung, wie gedrückt (zuletzt gedrückte gewinnt, siehe Input)
    this.held = 0; // wirksame Tastenrichtung (mit Mindestdauer eines Tipps)
    this.pressT = -1e9; // Zeitpunkt des letzten Drückens
    this.gainT = -1e9; // ab hier zählt der sanfte Anfang (keyGain); beim Wieder-Drücken fortgesetzt, siehe setKey
    this.slow = 1; // zuletzt wirksame Nässe-Verlangsamung (für keyGainAge)
    this.pressX = 0; // Lage beim Drücken (Ziel eines Spurwechsels per Tipp)
    this.holdUntil = -1e9; // ein kurzer Tipp wirkt bis hierhin
    this.chain = null; // laufender Spurwechsel, an den ein weiterer Tipp anschließt
    this.analog = 0; // Stick oder Touch-Zug −1 … 1
    this.free = 0; // seit wann freihändig (s)
    this.centring = 0; // Spurhalteassistent führt gerade in die Spurmitte (1 gemächlich, 2 zügig) …
    this.pull = 0; // … mit dieser Quergeschwindigkeit (m/s)
    this.lc = null; // Spurwechsel per Tipp: { to, from, dir }
    this.lcDone = 0;
    this.presses = 0; // gezählte Tastendrücke (für den Bot und die Statistik)
  }

  /**
   * Tastenrichtung ändert sich zur Zeit t (Simulationszeit). opts: { tip, lanes } – Spurwechsel per Tipp an?
   */
  setKey(dir, t, st, opts) {
    if (dir === this.key) return;
    const prev = this.key;
    this.key = dir;
    if (dir !== 0) {
      this.presses++;
      this.pressT = t;
      // Lenkt der Wagen noch in diese Richtung (kurz losgelassen), geht es dort weiter, wo das Lenkrad steht
      this.gainT = Math.sign(st.u) === dir ? t - keyGainAge(Math.abs(st.u), this.slow) : t;
      this.pressX = st.x;
      this.holdUntil = t + STEER.tapMin;
      this.held = dir;
      this.chain = null;
      if (this.lc && dir === -this.lc.dir) {
        // Tipp in die Gegenrichtung bricht einen laufenden Spurwechsel ab: zurück auf die alte Spur
        this.lc = opts.tip || this.lc.swipe ? { to: this.lc.from, from: this.lc.to, dir, back: true } : null;
        this.cancelT = t;
      } else if (this.lc && opts.tip) {
        // noch ein Tipp in dieselbe Richtung: eine Spur weiter (der Spurwechsel läuft so lange weiter)
        this.chain = this.lc;
      } else this.lc = null;
      return;
    }
    // losgelassen: kurzer Tipp → bis zur Mindestdauer weiterwirken; im Tipp-Modus wird daraus ein Spurwechsel
    const dur = t - this.pressT;
    if (opts.tip && dur <= TIP.window && prev !== 0) {
      if (this.lc && this.lc.back && this.cancelT === this.pressT) {
        // der Abbruch-Tipp selbst: Ziel steht schon fest
        this.held = 0;
        this.holdUntil = -1e9;
        return;
      }
      const base = this.chain ? this.chain.to : this.pressX;
      const to = nextLane(opts.lanes, base, prev);
      if (to !== null) {
        this.lc = { to, from: this.chain ? this.chain.from : nearestLane(opts.lanes, this.pressX), dir: prev, back: false };
        this.chain = null;
        this.held = 0;
        this.holdUntil = -1e9;
        return;
      }
    }
    this.chain = null;
    if (t >= this.holdUntil) this.held = 0;
  }

  /** Spurwechsel auf Wunsch (Wischen): eine Spur in Richtung dir; in die Gegenrichtung zurück auf die alte Spur. */
  requestLane(dir, st, opts) {
    if (this.lc && dir === -this.lc.dir) {
      this.lc = { to: this.lc.from, from: this.lc.to, dir, back: true, swipe: true };
      return true;
    }
    const to = nextLane(opts.lanes, this.lc ? this.lc.to : st.x, dir);
    if (to === null) return false;
    this.lc = { to, from: this.lc ? this.lc.from : nearestLane(opts.lanes, st.x), dir, back: false, swipe: true };
    this.free = 0;
    return true;
  }

  /**
   * Lenkwunsch für den nächsten Teilschritt.
   * @param {number} t Simulationszeit
   * @param {object} st Zustand der Querdynamik (x, u1, u, vs, vc, vi)
   * @param {object} P steerParams
   * @param {{tip:boolean, lanes:number[], assist:object|null, vk:number, h:number}} opts
   */
  command(t, st, P, opts) {
    if (this.held !== 0 && this.key === 0 && t >= this.holdUntil) this.held = 0;
    this.slow = P.slow;
    let d = this.held * keyGain(t - this.gainT, P.slow);
    if (d === 0 && this.analog !== 0) d = this.analog;
    if (d !== 0) {
      this.free = 0;
      this.centring = 0;
      // wer frei lenkt (halten, Stick), beendet einen Spurwechsel per Tipp
      if (this.key !== 0 && t - this.pressT > TIP.window) {
        this.lc = null;
        this.chain = null;
      }
      if (this.analog !== 0 && this.key === 0) this.lc = null;
      if (!this.lc) return d;
    }
    if (this.lc) return this.laneChange(st, P, opts);
    this.free += opts.h;
    const A = opts.assist;
    const curve = A ? 1 - smooth(0.2, 0.8, Math.abs(opts.vk)) : 0;
    if (curve <= 0 || !opts.lanes.length) {
      this.centring = 0;
      return 0;
    }
    // Ziel: die Spur, in der der Wagen ohne Lenken zum Stehen käme
    const sp = stopPoint(st, P);
    const e = nearestLane(opts.lanes, sp) - sp;
    if (!this.centring) {
      if (Math.abs(e) <= A.dead) return 0;
      this.centring = Math.abs(e) > A.far ? 2 : 1;
      this.pull = 0;
    }
    if (Math.abs(e) < 0.01 && Math.abs(st.vs + st.vc + st.vi) < 0.05) {
      this.centring = 0;
      return 0;
    }
    const far = this.centring === 2;
    if (this.free < (far ? A.farPause : A.pause)) return 0;
    // Zuggeschwindigkeit: höchstens max, zum Ziel hin verzögert, ganz am Ende proportional; sie ändert sich höchstens
    // mit acc (weiches Anfahren ohne Ruck)
    const acc = far ? A.farAcc : A.acc;
    const m = Math.abs(e);
    const want = Math.sign(e) * Math.min(far ? A.farMax : A.max, m * A.gain, Math.sqrt(2 * acc * m)) * curve;
    const dv = acc * opts.h;
    this.pull += Math.max(-dv, Math.min(dv, want - this.pull));
    return P.vq > 0.05 ? Math.max(-1, Math.min(1, this.pull / P.vq)) : 0;
  }

  /** Spurwechsel per Tipp: volle Querfahrt, bis der Haltepunkt die Zielspur erreicht, dann sanft hinein. */
  laneChange(st, P, opts) {
    const lc = this.lc;
    const e = lc.to - stopPoint(st, P);
    const vx = st.vs + st.vc + st.vi;
    if (Math.abs(lc.to - st.x) < 0.04 && Math.abs(vx) < 0.12) {
      this.lc = null;
      this.lcDone++;
      return 0;
    }
    const B = TIP.boost;
    const v = Math.max(-B, Math.min(B, (e * TIP.gain) / Math.max(P.vq, 0.5)));
    // gegen die Kurvendrift: im Ziel steht der Wagen, die Drift setzt erst nach dem Spurwechsel wieder ein
    return Math.max(-B, Math.min(B, v - st.vc / Math.max(P.vq, 0.5)));
  }
}

/**
 * Spurwechsel per Tipp: so lange darf ein Tastendruck dauern (s), Verstärkung des Einparkens (1/m) und wie viel
 * schneller als beim Halten der Wagen dabei quer fahren darf (eine Spur in gut 0,8 s).
 */
export const TIP = { window: 0.2, gain: 9, boost: 1.3 };

/**
 * Wie stark eine gehaltene Taste lenkt, tau Sekunden nach dem Drücken: erst sanft (ease), dann stetig bis voll.
 * slow < 1 (Nässe): der Übergang zur vollen Querfahrt dauert so viel länger wie die Antwort der Glieder.
 */
export function keyGain(tau, slow = 1) {
  return STEER.ease + (1 - STEER.ease) * smooth(STEER.easeFrom, STEER.easeTo, tau * slow);
}

/**
 * Umkehrung von keyGain: Wie lange müsste die Taste schon gehalten sein, damit sie mit g lenkt? Wer während eines
 * Lenkvorgangs kurz loslässt und wieder drückt, lenkt dort weiter, wo das Lenkrad gerade steht – der sanfte Anfang
 * beginnt nicht von vorn (sonst bräche die Querfahrt mitten im Spurwechsel ein).
 */
export function keyGainAge(g, slow = 1) {
  const s = (g - STEER.ease) / (1 - STEER.ease);
  if (!(s > 0)) return 0;
  // smoothstep umkehren: 3x² − 2x³ = s  ⇔  x = ½ − sin(asin(1 − 2s) / 3)
  const x = s >= 1 ? 1 : 0.5 - Math.sin(Math.asin(1 - 2 * s) / 3);
  return (STEER.easeFrom + x * (STEER.easeTo - STEER.easeFrom)) / slow;
}

function smooth(a, b, v) {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function nearestLane(lanes, x) {
  let best = lanes[0];
  for (const c of lanes) if (Math.abs(c - x) < Math.abs(best - x)) best = c;
  return best;
}

/** Nächste Spurmitte in Richtung dir, mindestens 0,9 m entfernt (sonst wäre es nur ein Zurechtrücken). */
export function nextLane(lanes, x, dir) {
  let best = null;
  for (const c of lanes) {
    const d = (c - x) * dir;
    if (d > 0.9 && (best === null || d < (best - x) * dir)) best = c;
  }
  return best;
}
