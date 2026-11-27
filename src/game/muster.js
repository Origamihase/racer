// Neue Verkehrsmuster auf der Autobahn (der Eigentümer, 27.11.2026: „Mehr Verkehrsmuster wären auch schön.“): eine
// Kolonne Wohnmobile in Urlaubsstimmung, ein Drängler, der hinten klebt und links blinkt, bis Mini Adam Platz macht,
// und ein Schwertransport – ein ganzer Brunnen auf dem Tieflader („Brunnen auf Reisen“), den man anhupen kann wie
// einen am Straßenrand. Die Baustelle (baustelle.js) ist das vierte Muster.
//
// Wann eines kommt, würfelt ein eigener Zufall (mulberry32, je Stream neu gesät) nach gefahrenen Metern.
import { MUSTER_LINES } from '../data.js';
import { mulberry32 } from '../util.js';
import { forkBetween } from './baustelle.js';

/**
 * Je Muster: first (Meter bis zum ersten), every (Meter bis zum nächsten), retry (passt es gerade nicht: so viele
 * Meter später wieder). gap: so viele Meter liegen mindestens zwischen zwei Mustern (auch der Baustelle).
 * draengler.kmh: so schnell muss der Wagen auf einer der linken Spuren fahren; platz: Sekunden, in denen Platzmachen
 * als souverän gilt; greet: so nah (Meter) hupt man den reisenden Brunnen an.
 */
export const MUSTER = {
  kolonne: { first: [4000, 7000], every: [10000, 16000], retry: 500 },
  draengler: { first: [3000, 6000], every: [8000, 13000], retry: 300, kmh: 120, platz: 10 },
  schwer: { first: [9000, 13000], every: [15000, 24000], retry: 600, greet: 140 },
  gap: 1500,
  // so viele Meter voraus darf der Plan die Autobahn nicht verlassen (sonst sieht man das Muster nie)
  clear: { kolonne: 1500, draengler: 800, schwer: 2200 },
};

export class Verkehrsmuster {
  /** g: das Spiel (Game). */
  constructor(g) {
    this.g = g;
    this.reset(1);
  }

  reset(seed) {
    this.rnd = mulberry32(seed >>> 0);
    this.next = {};
    for (const k of ['kolonne', 'draengler', 'schwer']) this.next[k] = this.between(MUSTER[k].first);
    this.quietUntil = 0; // (Meter) bis hierhin kommt kein neues Muster
    this.drg = null; // { car, t0, close, free }
    this.schwer = null; // { car, greeted }
    this.stats = { kolonne: 0, draengler: 0, schwer: 0, platz: 0, gruss: 0 };
  }

  between([a, b]) {
    return a + (b - a) * this.rnd();
  }

  pick(list) {
    return list[Math.floor(this.rnd() * list.length)];
  }

  /**
   * Passt gerade ein Muster (kind)? Auf der Autobahn, keine Folge, kein Halt, keine Baustelle, und die Fahrt bleibt
   * noch MUSTER.clear Meter auf ihr (keine Ausfahrt, die der Plan nimmt: sonst fährt man am Muster vorbei ab).
   */
  free(kind) {
    const g = this.g;
    const trip = g.world.trip();
    const s = g.player.s;
    if (g.offAutobahn || trip.section.kind !== 'ab' || g.traffic.passive === true || g.tv || (g.navi && g.navi.stopping) || g.bau.active || s <= this.quietUntil) return false;
    const end = s + (MUSTER.clear[kind] ?? 1500);
    // (Gabelungen, an denen der Plan geradeaus fährt, stören nicht: s0 = end)
    return !forkBetween(trip, end, end, s);
  }

  update() {
    const g = this.g;
    const p = g.player;
    this.watchDraengler();
    if (this.schwer && (!g.traffic.cars?.includes(this.schwer.car) || g.offAutobahn)) this.schwer = null;
    for (const k of ['draengler', 'kolonne', 'schwer']) {
      if (p.s < this.next[k]) continue;
      if (!this.free(k) || !this.start(k)) {
        this.next[k] = p.s + MUSTER[k].retry;
        continue;
      }
      this.stats[k]++;
      this.next[k] = p.s + this.between(MUSTER[k].every);
      this.quietUntil = p.s + MUSTER.gap;
      break;
    }
  }

  /** Ein Muster beginnen. Liefert false, wenn es gerade nicht geht (dann versucht es das Spiel später). */
  start(kind) {
    const g = this.g;
    const T = g.traffic;
    const p = g.player;
    if (kind === 'kolonne') {
      const list = T.kolonne?.(p.s);
      if (!Array.isArray(list)) return false;
      g.later(4, () => g.burst(MUSTER_LINES.kolonne, 2, 3));
      return true;
    }
    if (kind === 'draengler') {
      if (p.kmh < MUSTER.draengler.kmh || this.drg) return false;
      const car = T.draengler?.(p);
      if (!car || typeof car !== 'object') return false;
      this.drg = { car, t0: g.t, close: false, free: false };
      return true;
    }
    if (kind === 'schwer') {
      const pair = T.schwertransport?.(p.s);
      if (!Array.isArray(pair)) return false;
      this.schwer = { car: pair[0], greeted: false };
      g.say(MUSTER_LINES.omiSchwer, 'think', { priority: false });
      g.later(3, () => g.burst(MUSTER_LINES.schwer, 3, 3));
      return true;
    }
    return false;
  }

  /** Der Drängler: erst klebt er (der Chat ärgert sich), dann macht Mini Adam Platz (souverän) – oder eben nicht. */
  watchDraengler() {
    const d = this.drg;
    if (!d) return;
    const g = this.g;
    const c = d.car;
    if (!g.traffic.cars?.includes(c) || c.behavior !== 'draengler') {
      this.drg = null;
      return;
    }
    if (c.close && !d.close) {
      d.close = true;
      d.closeT = g.t;
      g.burst(MUSTER_LINES.draengler, 2, 2);
      g.say(MUSTER_LINES.omiDraengler, 'worried', { priority: false });
    }
    if (d.close && c.free && !d.free) {
      d.free = true;
      if (g.t - d.closeT < MUSTER.draengler.platz) {
        this.stats.platz++;
        g.chat(g.chatLine(MUSTER_LINES.platz));
        g.eco.cheer('funny');
      } else g.chat(g.chatLine(MUSTER_LINES.endlich));
    }
  }

  /** Die Hupe: Ist der reisende Brunnen nah, ist es ein Gruß wie an einen am Rand (einmal je Transport). */
  horn() {
    const S = this.schwer;
    if (!S || S.greeted) return false;
    const g = this.g;
    const ds = S.car.s - g.player.s;
    if (ds < -30 || ds > MUSTER.schwer.greet) return false;
    S.greeted = true;
    this.stats.gruss++;
    g.ui.toast('⛲ Gruß an den reisenden Brunnen!', 'good', 'schwer');
    g.burst(MUSTER_LINES.gruss, 2, 2);
    g.thrill('greet', 'den reisenden Brunnen');
    return true;
  }

  /** Vorbei am Schwertransport (Traffic-Ereignis passSchwer). */
  passed() {
    this.g.later(1.5, () => this.g.chat(this.g.chatLine(MUSTER_LINES.tschuess)));
  }
}
