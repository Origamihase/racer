// Spontan-Wetten (der Eigentümer, 27.11.2026: „Der dritte Punkt gefällt mir. Das können wir so machen :D“). Ab und zu
// bietet jemand im Chat eine kleine Wette an, die zur Lage passt: zweimal haarscharf in einer Minute, ein paar
// Minuten ohne Kratzer, ein Tempo in kurzer Zeit, das Navi-Ziel vor einer Uhrzeit. Das Angebot steht oben am Rand;
// wer annehmen will, hupt. Gewinnt Mini Adam, zahlt der Wettende seinen Einsatz als Spende (Zeile „Wetten“ der
// Abrechnung). Verliert er, lacht der Chat – eigenes Geld steht nie auf dem Spiel. Die „5 Cent, wenn du …“-Angebote
// (gags.js) bleiben, was sie sind: ein Meme ohne Geld.
//
// Eigener Zufall (mulberry32, je Stream neu gesät) und Namen aus einer festen Folge: Solange niemand annimmt, verläuft
// der Stream genauso wie ohne Wetten.
import { WETTEN_LINES, viewerNameAt, fillTemplate } from '../data.js';
import { mulberry32, fmtEuro } from '../util.js';
import { scratchMarks } from './parts/ziel.js';

/**
 * first: so viele Sekunden nach dem Start kommt frühestens das erste Angebot, gap: so lange nach dem Ende einer Wette
 * (oder einem verfallenen Angebot) das nächste, offer: so lange steht ein Angebot, stamm: so oft wettet ein Stammgast,
 * retry: so lange wartet ein Angebot, zu dem gerade keine Wette passt, early: so viel früher darf die Wette auf das
 * feste Navi-Ziel kommen.
 */
export const WETTE = { first: [80, 140], gap: [150, 260], offer: 12, stamm: 0.35, retry: 15, early: 120 };

/**
 * Die Wetten. ok(g): passt sie gerade; make(g, rnd): Ziel, Frist (Sekunden, Infinity: keine), Einsatz und die Zahlen
 * für den Text; done/lost(g, w): gewonnen, verloren (sonst läuft sie weiter, bis die Frist um ist); show(g, w): Stand
 * für die Zeile in der Jobliste (0..1).
 */
export const WETTEN = {
  haarscharf: {
    ok: (g) => g.world.trip().section.kind === 'ab' && g.player.kmh > 90,
    make: (g, rnd) => ({ k: 2, secs: 60, stake: 5 + 5 * Math.floor(rnd() * 2), base: g.stats.nearMisses }),
    count: (g, w) => g.stats.nearMisses - w.base,
    done: (g, w) => WETTEN.haarscharf.count(g, w) >= w.k,
    show: (g, w) => WETTEN.haarscharf.count(g, w) / w.k,
  },
  sauber: {
    // (in Minuten, nicht Kilometern: Die Reisekilometer der Karte laufen je nach Straße verschieden schnell)
    ok: (g) => g.player.kmh > 60,
    make: (g, rnd) => {
      const min = 1 + Math.floor(rnd() * 3);
      return { min, dauer: min === 1 ? 'Eine Minute' : `${min} Minuten`, secs: min * 60, stake: 5 * min, hits: g.stats.crashes, marks: scratchMarks(g.player.damage) };
    },
    done: (g, w) => g.t - w.t0 >= w.secs,
    lost: (g, w) => g.stats.crashes !== w.hits || scratchMarks(g.player.damage) !== w.marks,
    show: (g, w) => (g.t - w.t0) / w.secs,
  },
  tempo: {
    // nur ohne Tempolimit, und nur wenn bis zur Marke noch Luft ist
    ok: (g) => g.world.trip().section.kind === 'ab' && g.player.limits.vmax === Infinity && WETTEN.tempo.mark(g) - g.player.kmh > 35,
    mark: (g) => Math.min(220, Math.floor((g.player.vmax * 3.6 - 8) / 10) * 10),
    make: (g, rnd) => ({ kmh: WETTEN.tempo.mark(g), secs: 30 + 10 * Math.floor(rnd() * 2), stake: 5 }),
    done: (g, w) => g.player.kmh >= w.kmh - 0.5,
    show: (g, w) => g.player.kmh / w.kmh,
  },
  ziel: {
    // erst, wenn das Ziel feststeht (Zuschlag 5 km davor, ziel.js zuschlag): Vorher könnte ein Gebot es noch ändern
    ok: (g) => {
      const n = g.navi;
      if (!n.target || n.stopping || g.auction.phase !== 'fest') return false;
      const s = n.driveSecs();
      return s > 75 && s < 600;
    },
    make: (g, rnd) => {
      // in halben Minuten, etwas Luft über der Fahrzeit des Navis
      const halbe = Math.ceil((g.navi.driveSecs() * (1.08 + 0.08 * rnd())) / 30);
      const min = Math.floor(halbe / 2);
      const dauer = (halbe % 2 ? (min ? `${min}½` : '½') : `${min}`) + (halbe === 2 ? ' Minute' : ' Minuten');
      return { ort: g.navi.target.name, dauer, secs: halbe * 30, stake: Math.min(20, 5 + 5 * Math.floor(halbe / 4)), reached: g.stats.naviReached };
    },
    // (angekommen ist er, sobald das Navi zum Halt am Brunnen übergibt: Dann ist das Ziel weg, und die Ankunft zählt
    // kurz danach)
    done: (g, w) => g.stats.naviReached > w.reached || (!g.navi.target && !!g.navi.stopping),
    // (das Ziel ändert sich nach dem Zuschlag nicht mehr – sollte es doch, platzt die Wette, und niemand zahlt)
    void: (g, w) => !!g.navi.target && g.navi.target.name !== w.ort,
    show: (g, w) => (g.t - w.t0) / w.secs,
  },
};

export class Wetten {
  /** g: das Spiel (Game). */
  constructor(g) {
    this.g = g;
    this.rnd = mulberry32(1);
    this.reset(1);
  }

  /** Neuer Stream: keine Wette, das erste Angebot nach WETTE.first Sekunden. */
  reset(seed) {
    this.rnd = mulberry32(seed >>> 0);
    this.offer = null; // { kind, name, text, stake, until, note }
    this.bet = null; // die laufende Wette
    this.n = Math.floor(this.rnd() * 1000);
    this.next = this.between(WETTE.first[0], WETTE.first[1]);
    this.stats = { offered: 0, taken: 0, won: 0, lost: 0, void: 0 };
  }

  /** Passt gerade ein Angebot (nichts anderes läuft, das die Hupe oder die Aufmerksamkeit braucht)? */
  quiet() {
    const g = this.g;
    return !g.tv && !g.charging && !(g.funkloch > 0) && !g.stuck && !g.navi.stopping && !(g.landmark && !g.landmark.greeted) && g.player.kmh > 40;
  }

  update(dt) {
    const g = this.g;
    if (this.offer && g.t > this.offer.until) this.expire();
    // (während einer Folge BrunnenTV oder beim Laden ruht die laufende Wette: Die Uhr steht, nichts zählt)
    if (this.bet && (g.tv || g.charging)) {
      this.bet.t0 += dt;
      this.bet.end += dt;
    } else if (this.bet) this.watch();
    if (this.offer || this.bet) return;
    // steht das Navi-Ziel fest, darf die Wette darauf etwas früher kommen (das Fenster dafür ist kurz)
    const ziel = g.t >= this.next - WETTE.early && this.quiet() && WETTEN.ziel.ok(g);
    if (!ziel && g.t < this.next) return;
    if (!this.quiet()) {
      this.next = g.t + 2;
      return;
    }
    const kinds = ziel ? ['ziel'] : Object.keys(WETTEN).filter((k) => WETTEN[k].ok(g));
    if (!kinds.length) {
      this.next = g.t + WETTE.retry;
      return;
    }
    const kind = this.pick(kinds);
    const w = WETTEN[kind].make(g, this.rnd);
    const here = g.stamm.here;
    const name = here.length && this.rnd() < WETTE.stamm ? this.pick(here).name : viewerNameAt(this.n++);
    const text = fillTemplate(WETTEN_LINES.text[kind], w);
    this.offer = { kind, w, name, text, until: g.t + WETTE.offer };
    this.stats.offered++;
    const key = g.hornKey();
    const n = g.ui.toast(`🎲 ${name} wettet ${fmtEuro(w.stake)}: ${text}. Annehmen: Hupen (${key})`, 'info', 'wette');
    // (der Hinweis steht, solange das Angebot gilt)
    if (n && typeof n === 'object') n.t = n.hold = WETTE.offer;
    g.chat(fillTemplate(this.pick(WETTEN_LINES.angebot), { text, betrag: fmtEuro(w.stake) }), name, g.stamm.badge(name));
  }

  /** Die Hupe: Steht ein Angebot, gilt die Wette. Gibt true zurück, wenn sie damit angenommen ist. */
  horn() {
    const g = this.g;
    const o = this.offer;
    // (ein Brunnen oder Elsa, die gerade gegrüßt werden wollen, gehen vor: Die Hupe gilt ihnen)
    if (!o || this.bet || (g.landmark && g.landmark.seen && !g.landmark.greeted)) return false;
    this.offer = null;
    this.bet = { ...o, ...o.w, t0: g.t, end: g.t + o.w.secs };
    this.stats.taken++;
    g.ui.dropKey('wette');
    g.ui.toast(`🤝 Wette gilt: ${o.text}`, 'good', 'wette');
    g.chat(this.pick(WETTEN_LINES.top), o.name, g.stamm.badge(o.name));
    g.audio.chime();
    g.ui.wette(this.row());
    return true;
  }

  /** Das Angebot verfällt ungenutzt: Der Chat nimmt es gelassen. */
  expire() {
    const o = this.offer;
    this.offer = null;
    this.g.ui.dropKey('wette');
    if (this.rnd() < 0.5) this.g.chat(this.pick(WETTEN_LINES.feige), o.name, this.g.stamm.badge(o.name));
    this.next = this.g.t + this.between(WETTE.gap[0], WETTE.gap[1]);
  }

  /** Die laufende Wette: gewonnen, verloren, geplatzt, oder ihr Stand in der Jobliste. */
  watch() {
    const g = this.g;
    const b = this.bet;
    const W = WETTEN[b.kind];
    if (W.void && W.void(g, b)) return this.finish('void');
    if (W.done(g, b)) return this.finish('won');
    if ((W.lost && W.lost(g, b)) || g.t > b.end) return this.finish('lost');
    const row = this.row();
    if (!this.shown || Math.abs(row.progress - this.shown.progress) > 0.02 || row.left !== this.shown.left) g.ui.wette(row);
  }

  /** Die Zeile der Wette unter den Jobs: Text, Stand, Restzeit (ganze Sekunden, null ohne Frist). */
  row() {
    const g = this.g;
    const b = this.bet;
    if (!b) return (this.shown = null);
    const progress = Math.max(0, Math.min(1, WETTEN[b.kind].show(g, b)));
    const left = Number.isFinite(b.end) ? Math.max(0, Math.ceil(b.end - g.t)) : null;
    return (this.shown = { text: `🎲 ${b.text} (${fmtEuro(b.stake)} von ${b.name})`, progress, left });
  }

  finish(how) {
    const g = this.g;
    const b = this.bet;
    this.bet = null;
    this.next = g.t + this.between(WETTE.gap[0], WETTE.gap[1]);
    g.ui.wette(this.row());
    this.stats[how]++;
    const badge = g.stamm.badge(b.name);
    if (how === 'void') {
      g.ui.toast(`🎲 Wette geplatzt: neues Navi-Ziel`, 'info', 'wette');
      g.chat(this.pick(WETTEN_LINES.geplatzt), b.name, badge);
      return;
    }
    if (how === 'won') {
      g.ui.toast(`🎲 Wette gewonnen! ${b.name} zahlt ${fmtEuro(b.stake)}`, 'good', 'wette');
      g.chat(this.pick(WETTEN_LINES.verloren), b.name, badge);
      g.eco.cheer('wetteGewonnen');
      g.onMood('proud', 1);
      g.later(1.2, () => g.donate(b.name, b.stake, '', { label: 'Wetten', line: fillTemplate(this.pick(WETTEN_LINES.zahlt), { name: b.name, betrag: fmtEuro(b.stake), text: b.text }) }));
      g.studio.praise('wette', { name: b.name });
      return;
    }
    g.ui.toast(`🎲 Wette verloren: ${b.text}`, 'info', 'wette');
    g.chat(this.pick(WETTEN_LINES.gewonnen), b.name, badge);
    g.later(1.5, () => g.chat(this.pick(WETTEN_LINES.trost)));
    g.eco.cheer('wetteVerloren');
  }

  pick(list) {
    return list[Math.floor(this.rnd() * list.length)];
  }

  between(a, b) {
    return a + (b - a) * this.rnd();
  }
}
