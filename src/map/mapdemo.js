// Prüfstand für Navi und Karte (nur mit ?debug&mapdemo): eine echte Fahrt (src/game/trip.js) über die XXL-Karte, auf
// der ein gedachtes Auto fährt. Es nimmt die geplanten Ausfahrten, sucht nach jeder Ankunft ein neues Ziel und liefert
// dem Mittelbildschirm st.nav. Im Spiel folgt es dem Spieler (follow), und der Kurs der Welt wird aus derselben Fahrt
// gebaut (src/main.js): Windschutzscheibe und Navi zeigen dieselben Bögen. Im fertigen Spiel ersetzt die Fahrt der
// XXL-Welt das gedachte Auto; NavModel, NaviScreen und die Karte bleiben dieselben.
import { Trip, J } from '../game/trip.js';
import { places, findPlace, findNode } from './graph.js';
import { NavModel } from './navroute.js';

/** Richtgeschwindigkeit (m/s) des gedachten Autos je Abschnitt, wenn es ohne Bild vorausfährt. */
const PACE = { ab: 36, land: 24, stadt: 13, zub: 18, term: 10 };

export class MapDemo {
  /** start: Name oder Index eines Knotens (Standard: Erlensee), rng: Zufall für die Zielwahl. */
  constructor({ start, rng = Math.random } = {}) {
    this.rng = rng;
    this.reset(start);
  }

  reset(start) {
    const n = typeof start === 'string' ? findNode(start) : start ?? -1;
    this.trip = new Trip({ start: n >= 0 ? n : undefined, rng: this.rng });
    this.model = new NavModel(this.trip);
    this.x = J.L0;
    this.wait = 1.5; // Sekunden bis zum nächsten Gebot, wenn kein Ziel da ist
    this.visits = [];
    return this;
  }

  /** Neues Navi-Ziel nach Name oder Index (−1: keins). Liefert den Index. */
  target(name) {
    const i = typeof name === 'string' ? findPlace(name) : name;
    this.trip.setTarget(i);
    return i;
  }

  /** Ein Ziel wie aus dem Chat: ein Ort in 60 bis 320 Kartenkilometern, wichtige Orte etwas öfter. */
  pickTarget() {
    const D = this.trip.distances();
    const pool = [];
    for (const p of places) {
      const km = D.toPlace(p.i).km;
      if (km > 60 && km < 320) pool.push([p.i, 1 + Math.log2(1 + p.n)]);
    }
    let r = this.rng() * pool.reduce((s, q) => s + q[1], 0);
    for (const [i, w] of pool) if ((r -= w) <= 0) return this.target(i);
    return pool.length ? this.target(pool[0][0]) : -1;
  }

  /** ds Meter weiterfahren (ohne Bild: Ziel suchen, Navi nachführen). */
  advance(ds, dt) {
    this.move(this.trip.s + ds);
    return this.tick(dt);
  }

  /**
   * Mit dem Spieler fahren (vor course.fill): bis zur Stelle s, in Schritten von höchstens 4 m, damit keine Gabelung
   * übersprungen wird. Springt s weit zurück (neue Runde), beginnt eine neue Fahrt.
   */
  follow(s, dt) {
    if (s < this.trip.s - 20) this.reset();
    for (let n = Math.ceil((s - this.trip.s) / 4); n > 1; n--) this.move(this.trip.s + (s - this.trip.s) / n);
    if (s > this.trip.s) this.move(s);
    return this.tick(dt);
  }

  /** Bis zur Stelle s fahren; die Spur folgt dem Navi (Verzögerungsstreifen vor geplanten Ausfahrten). */
  move(s) {
    const trip = this.trip;
    const sec = trip.section;
    if (sec.kind === 'ab') {
      const f = sec.fork;
      if (f && !f.taken && f.s - s < J.decel - 20) this.x = trip.planFor(f) === 'exit' ? J.L0 : 5.625;
      else if (s - sec.s0 > J.accel) this.x = 5.625;
    } else this.x = J.L0;
    const p = trip.profile(s);
    this.x = Math.min(Math.max(this.x, p.xmin), p.xmax);
    for (const e of trip.update(s, this.x)) if (e.type === 'arrive' || e.type === 'pass') this.visits.push(e.place);
  }

  /** Ohne Ziel nach kurzer Pause ein neues wählen, dann das Navi nachführen. */
  tick(dt) {
    if (this.trip.target < 0 && (this.wait -= dt) <= 0) {
      this.wait = 2.5;
      this.pickTarget();
    }
    return this.model.update(dt);
  }

  /** Ohne Bild vorausfahren, bis cond(demo) gilt oder metres gefahren sind (für Prüfbilder). Liefert true bei cond. */
  drive(metres, cond = null, dt = 1 / 15) {
    const end = this.trip.s + metres;
    while (this.trip.s < end) {
      if (cond && cond(this)) return true;
      this.advance((PACE[this.trip.section.kind] || 20) * dt, dt);
    }
    return !cond;
  }

  /** Neue Orte seit dem letzten Aufruf (für das Speichern der Besuche): Liste von Ortsindizes. */
  takeVisits() {
    const v = this.visits;
    this.visits = [];
    return v;
  }

  /** st.nav für den Mittelbildschirm (src/map/navview.js). */
  nav(st, visible, navi) {
    const [h, m] = String(st.clock || '18:00').split(':').map(Number);
    return { model: this.model, bidder: navi ? navi.bidder : '', bid: navi ? navi.bid : '', clockMin: h * 60 + m, visible };
  }
}
