// Die Baustelle als Geschicklichkeitsspiel (der Eigentümer, 27.11.2026: „Eine Baustelle könnte ein
// Geschicklichkeitsspiel werden.“). Ab und zu sperrt eine Baustelle die beiden linken Spuren der Autobahn: Ein Schild
// kündigt sie einen Kilometer vorher an, OMI sagt es, und dann führen Leitbaken auf zwei schmalen Spuren rechts vorbei
// und einmal nach links hinüber und zurück (world/baustelle-plan.js). Die Baken sind die Grenze des Wagens: Wer sie
// streift (oder sich von der Verengung schieben lässt), schrammt wie an der Leitplanke, und der Chat lacht. Wer ohne
// eine einzige Berührung durchkommt, wird gefeiert – das Sprachstudio lobt, und manchmal spendet jemand.
import { BAUSTELLE_LINES } from '../data.js';
import { BAU_LEN, bauGasse, bauShift } from '../world/baustelle-plan.js';
import { mulberry32 } from '../util.js';

/**
 * every: so viele Meter liegen zwischen zwei Baustellen (die erste nach first), ahead: so weit vor dem Wagen beginnt
 * die Verengung, wenn sie eingerichtet wird (das Schild steht sign Meter davor, Tempo 80 limit davor), room: so viel
 * Autobahn ohne Gabelung braucht sie davor, cool: Sekunden zwischen zwei gezählten Berührungen, zone: Tempo
 * des Tempomaten darin (km/h, ab brake Metern vor dem Schild), pad: Luft zwischen Wagen und Gasse, touch: so nah an
 * ihrer Grenze liegt der Wagen an den Baken an, tidy: so weit hinter ihrem Ende ist sie abgebaut (der Verkehr fährt wieder frei).
 */
export const BAUSTELLE = { first: [5000, 8000], every: [10000, 16000], ahead: 1300, sign: 1000, limit: 200, room: 250, cool: 1.2, zone: 80, brake: 250, tidy: 300, pad: 0.04, touch: 0.01, look: 0.9 };

/**
 * Liegt zwischen s0 und s1 eine Gabelung dieser Autobahn (Ausfahrt, Kreuz, Ende)? Dort darf keine Baustelle stehen:
 * Ihre Gasse ließe die Ausfahrt nicht erreichen. Davor (ab from, dem Wagen) darf eine liegen, an der der Plan
 * geradeaus fährt – nimmt er sie, käme der Wagen nie bis zur Baustelle.
 */
export function forkBetween(trip, s0, s1, from = s0) {
  if (!trip.cur) return false;
  for (const c of trip.cur.sections) {
    const f = c.fork;
    if (!f || f.taken || f.s <= from || f.s >= s1) continue;
    // (davor nur eine Ausfahrt, die der Plan nimmt: Dann käme der Wagen gar nicht bis zur Baustelle)
    if (f.s > s0 || f.forced || trip.planFor(f) === 'exit') return true;
  }
  // (reicht der gebaute Weg nicht bis hinter die Baustelle, weiß niemand, was dort kommt: lieber nicht)
  const last = trip.cur.sections[trip.cur.sections.length - 1];
  return !last || last.s1 < s1;
}

export class Baustelle {
  /** g: das Spiel (Game). */
  constructor(g) {
    this.g = g;
    this.reset(1);
  }

  /**
   * Neue Fahrt: keine Baustelle, die erste nach BAUSTELLE.first Metern. Eigener Zufall (seed): Wann eine Baustelle
   * kommt, ändert nichts an dem, was der Zufall sonst bringt.
   */
  reset(seed) {
    this.rnd = mulberry32(seed >>> 0);
    this.zone = null; // { s0, touches, t0, entered, done, work }
    this.next = BAUSTELLE.first[0] + this.rnd() * (BAUSTELLE.first[1] - BAUSTELLE.first[0]);
    this.stats = { built: 0, clean: 0, touched: 0 };
    this.touchT = -99;
    this._g = { left: 0, right: 0 };
  }

  /** Ist eine Baustelle eingerichtet und noch nicht abgebaut? (Polizei, Elefanten, Blitzer warten dann.) */
  get active() {
    return !!this.zone;
  }

  /** Vergessen (Autobahn verlassen, neue Fahrt): Der Verkehr fährt wieder frei. */
  drop() {
    if (!this.zone) return;
    if (this.g.traffic.work === this.zone.work) this.g.traffic.work = null;
    this.zone = null;
  }

  /** Jedes Bild vor dem Fahren: einrichten, die Gasse als Grenze des Wagens setzen, Berührungen zählen, abrechnen. */
  update() {
    const g = this.g;
    const p = g.player;
    if (g.offAutobahn) return this.drop();
    if (!this.zone) return this.maybeStart();
    const Z = this.zone;
    const u = p.s - Z.s0;
    // (hat der Verkehr neu angefangen, etwa auf einer anderen Autobahn, ist die Baustelle nicht mehr da)
    if (g.traffic.work !== Z.work || u > BAU_LEN + BAUSTELLE.tidy) {
      this.drop();
      return;
    }
    const G = bauGasse(u, this._g);
    if (G) {
      if (!Z.entered && u > 0) {
        Z.entered = true;
        Z.t0 = g.t;
        g.burst(BAUSTELLE_LINES.chatStart, 2, 2);
      }
      const half = p.w / 2 + BAUSTELLE.pad;
      const L = p.limits;
      const left = Math.max(L.left, G.left + half);
      const right = Math.min(L.right, G.right - half);
      // liegt der Wagen an den Baken an (die Verengung oder Verschwenkung schiebt ihn, oder er lehnt sich an), zählt das
      // wie Streifen (wer aktiv hineinlenkt, schrammt dazu wie an der Leitplanke: rail)
      if (p.x < left + BAUSTELLE.touch) this.touch(-1, true);
      else if (p.x > right - BAUSTELLE.touch) this.touch(1, true);
      p.setLimits({ left, right });
    } else if (Z.entered && !Z.done && u > BAU_LEN) this.finish();
  }

  /** Neue Baustelle, wenn es Zeit ist und Platz: Autobahn ohne Ausfahrt, kein Blitzer, kein Brunnen, keine Folge, keine freigeschaltete linke Spur. */
  maybeStart() {
    const g = this.g;
    const p = g.player;
    if (p.s < this.next) return;
    const trip = g.world.trip();
    const s0 = p.s + BAUSTELLE.ahead;
    const lm = g.landmark;
    const ok = trip.section.kind === 'ab' && !g.left?.open && g.traffic.passive !== true && !g.tv && !g.blitzer && !(g.navi && g.navi.stopping) &&
      !forkBetween(trip, s0 - BAUSTELLE.room, s0 + BAU_LEN + 60, p.s) && (!lm || lm.s < s0 - BAUSTELLE.sign - 200 || lm.s > s0 + BAU_LEN + 200);
    if (!ok) {
      this.next = p.s + 400;
      return;
    }
    this.next = s0 + BAU_LEN + BAUSTELLE.every[0] + this.rnd() * (BAUSTELLE.every[1] - BAUSTELLE.every[0]);
    this.zone = { s0, touches: 0, entered: false, done: false, t0: 0, work: { s0 } };
    this.stats.built++;
    g.traffic.work = this.zone.work;
    const sc = g.scenery;
    sc.request('bauSchild', s0 - BAUSTELLE.sign);
    sc.request('speed', s0 - BAUSTELLE.limit, { limit: BAUSTELLE.zone });
    for (let k = 0; k * 100 < BAU_LEN; k++) sc.request('baken', s0 + k * 100, { k });
    sc.request('speed', s0 + BAU_LEN + 20, { limit: 'ende' });
    // Blitzer, Brunnen, Elsa und Elefanten kommen erst dahinter
    const S = g.S;
    S.blitzer = Math.max(S.blitzer, s0 + BAU_LEN + 200);
    S.landmark = Math.max(S.landmark, s0 + BAU_LEN + 250 - 1500);
    S.elefant = Math.max(S.elefant, s0 + BAU_LEN + 200);
    g.say(BAUSTELLE_LINES.omi, 'worried', { priority: false });
    g.later(2.5, () => g.burst(BAUSTELLE_LINES.chatSign, 2, 2.5));
  }

  /**
   * Wohin ein braver Fahrer der Prüfstände lenkt (want: sein Ziel-x sonst): ab 300 m vor der Verengung bis zum Ende
   * mitten auf die linke der beiden Spuren der Gasse, mit ihrer Verschwenkung.
   */
  steer(want, s) {
    const Z = this.zone;
    if (!Z || s < Z.s0 - 300 || s > Z.s0 + BAU_LEN || this.g.offAutobahn) return want;
    // (er schaut voraus wie ein Mensch: dorthin, wo die Gasse in BAUSTELLE.look Sekunden ist)
    return 1.875 + bauShift(s + this.g.player.speed * BAUSTELLE.look - Z.s0);
  }

  /** Tempo der Baustelle für den Tempomaten an der Stelle s des Wagens (Infinity außerhalb). */
  zoneLimit(s) {
    const Z = this.zone;
    if (!Z) return Infinity;
    const u = s - Z.s0;
    // (ab brake Metern vor dem Schild, damit der Tempomat bis dahin sanft herunterkommt)
    return u > -BAUSTELLE.limit - BAUSTELLE.brake && u < BAU_LEN ? BAUSTELLE.zone / 3.6 : Infinity;
  }

  /** Der Wagen hat an der Leitplanke geschrammt (Player.rails): in der Baustelle war es eine Bake. */
  rail(e) {
    const Z = this.zone;
    if (!Z || !Z.entered || Z.done) return false;
    this.touch(e.side, false);
    return true;
  }

  /** Eine Bake berührt: zählen (höchstens alle BAUSTELLE.cool Sekunden), Kratzer, und der Chat sieht es. */
  touch(side, pushed) {
    const g = this.g;
    const Z = this.zone;
    if (!Z.entered || Z.done || g.t - this.touchT < BAUSTELLE.cool) return;
    this.touchT = g.t;
    Z.touches++;
    if (pushed) {
      // (gestreift hat er sie ja: eine Schramme an der Seite, wie an der Leitplanke)
      g.player.damage.scrape(side < 0 ? 'left' : 'right');
      g.audio.scrape();
      g.fx.shake(0.2);
      g.eco.cheer('scrape');
    }
    if (Z.touches === 1 || this.rnd() < 0.5) g.chat(g.chatLine(BAUSTELLE_LINES.touch));
  }

  /** Hinter der letzten Bake: sauber durch, oder wie viele Baken er mitgenommen hat. */
  finish() {
    const g = this.g;
    const Z = this.zone;
    Z.done = true;
    const secs = Math.max(1, g.t - Z.t0);
    const kmh = Math.round(((BAU_LEN / secs) * 3.6));
    Z.kmh = kmh;
    if (!Z.touches) {
      this.stats.clean++;
      g.ui.toast(`🚧 Baustelle ohne Kratzer! (${kmh} km/h im Schnitt)`, 'good', 'baustelle');
      g.burst(kmh >= 100 ? BAUSTELLE_LINES.cleanFast : BAUSTELLE_LINES.clean, 3, 2.5);
      g.thrill('baustelle', 'die saubere Baustelle');
      g.onMood('proud', 1);
      g.studio.praise('baustelle', { kmh });
      return;
    }
    this.stats.touched++;
    const n = Z.touches;
    g.ui.toast(`🚧 Baustelle geschafft · ${n} ${n === 1 ? 'Bake' : 'Baken'} gestreift`, 'info', 'baustelle');
    g.chat(g.chatLine(BAUSTELLE_LINES.messy).replace('{n}', String(n)));
  }
}
