// Das ferngesteuerte Navi: Zuschauer überbieten sich (immer 1 Cent mehr), das Ziel wechselt
// automatisch, die Route wird neu berechnet – manchmal mit „Bitte wenden“ auf der Autobahn.
import { NAVI_TARGETS, SPARKASSEN_FARBEN } from '../data.js';
import { rand, chance, pick, weightedPick, fmtCent, fmtClock, clamp } from '../util.js';

/** Kurzer Name für Schilderbrücken und das Navi-Kärtchen. */
export function shortName(t) {
  if (!t) return '';
  if (t.short) return t.short;
  const n = t.name.split(/[,(–:]/)[0].trim();
  return n.length > 24 ? n.slice(0, 23) + '…' : n;
}

const SPARK_HEX = { rot: '#d5121e', blau: '#1d5fbf', 'weiß': '#f2f2f2', 'rot (wie immer)': '#d5121e', 'überraschend orange': '#f07a12' };

export class Navi {
  constructor(scenery) {
    this.scenery = scenery;
    this.requests = [];
    this.reset(0);
  }

  reset(s) {
    for (const id of this.requests) this.scenery.cancel(id);
    this.requests = [];
    this.bid = 0.01;
    this.changes = 0;
    this.history = [];
    this.set(s, NAVI_TARGETS[0], 'Mini Adam', { first: true });
  }

  /** Neues Ziel auswählen (nie dasselbe wie gerade). */
  pickTarget() {
    const cur = this.target;
    return weightedPick(NAVI_TARGETS.filter((t) => t !== cur), (t) => t.weight ?? 1);
  }

  /** Ein Zuschauer überbietet: neues Ziel, Gebot + 1 Cent (manchmal mehr). */
  overbid(s, bidder) {
    const extra = chance(0.18) ? Math.floor(rand(2, 12)) : 1;
    this.bid = Math.round((this.bid + extra * 0.01) * 100) / 100;
    this.changes++;
    const t = this.pickTarget();
    this.set(s, t, bidder);
    return t;
  }

  set(s, target, bidder, { first = false } = {}) {
    // Überboten: Schild und Wahrzeichen des alten Ziels verschwinden. Schon angekommen: alles bleibt stehen.
    for (const id of this.requests) this.scenery.cancel(id, !this.arrived);
    this.requests = [];
    this.target = target;
    this.bidder = bidder;
    this.km = rand(target.km[0], target.km[1]);
    this.startS = s;
    this.targetS = s + this.km * 1000;
    this.recalc = first ? 0 : 1;
    this.wende = !first && chance(0.28);
    this.wendeS = s + rand(380, 820);
    this.arrived = false;
    this.side = chance(0.5) ? 1 : -1;
    this.sparkColor = pick(SPARKASSEN_FARBEN);
    this.history.push({ name: target.name, bidder, bid: this.bid });
    if (this.history.length > 12) this.history.shift();
    this.placeLandmarks();
  }

  placeLandmarks() {
    const t = this.target;
    const S = this.targetS;
    const req = (type, s, data) => this.requests.push(this.scenery.request(type, s, data));
    req('ziel', S, { title: shortName(t) });
    switch (t.special) {
      case 'brunnen':
        req('brunnen', S - 70);
        break;
      case 'elsa':
        req('elsa', S - 70);
        break;
      case 'sparkasse':
        req('sparkasse', S - 90, { color: SPARK_HEX[this.sparkColor] || '#d5121e' });
        break;
      case 'pommes':
        req('kiosk', S - 80, { title: 'Drive-In', sub: 'Pommes ohne Rückfragen' });
        break;
      case 'bude':
        req('kiosk', S - 80, { title: 'Currywurst', sub: 'die richtige Bude (wirklich!)' });
        break;
      case 'charger':
        req('charger', S - 80);
        break;
      default:
        break;
    }
    if (/Burg|Wartburg/.test(t.name)) req('burg', S - 40);
    // Skyline hinter dem Ziel, damit ihr Segment erst abgebaut wird, wenn die Türme hinter uns liegen
    if (/Frankfurt/.test(t.name)) req('skyline', S + 300);
  }

  get remaining() {
    return Math.max(0, this.targetS - this._s);
  }

  update(dt, s) {
    this._s = s;
    const ev = [];
    this.recalc = Math.max(0, this.recalc - dt / 2.4);
    if (this.wende && s > this.wendeS) {
      this.wende = false;
      this.recalc = 0.8;
      ev.push({ type: 'wendeIgnored' });
    }
    if (!this.arrived && s >= this.targetS) {
      this.arrived = true;
      ev.push({ type: 'arrived', target: this.target, km: this.km });
    }
    return ev;
  }

  /** Daten für den Mittelbildschirm. */
  screen(s, clockMin, speed) {
    const remaining = Math.max(0, this.targetS - s);
    const eta = clockMin + (remaining / clamp(speed, 20, 70)) * 0.5;
    return {
      target: this.arrived ? 'Warte auf das nächste Gebot …' : this.target.name,
      arrived: this.arrived,
      remaining,
      recalc: this.recalc,
      side: this.side,
      wende: this.wende,
      wendeS: this.wendeS,
      eta: this.arrived ? '' : 'Ankunft ' + fmtClock(eta),
      bidder: this.bidder,
      bid: fmtCent(this.bid),
    };
  }
}
