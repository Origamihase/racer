// Ein gedachtes Auto für die Prüfungen von Navi und Karte (tools/map-test.mjs, tools/journey-test.mjs): eine echte
// Fahrt (src/game/trip.js) über die Karte, ohne Bild. Es nimmt die geplanten Ausfahrten, sucht nach jeder Ankunft ein
// neues Ziel und führt das Navi (NavModel) nach – dasselbe Navi, das im Spiel die Fahrt der Welt zeigt.
import { Trip, J } from '../src/game/trip.js';
import { places, findPlace, findNode } from '../src/map/graph.js';
import { NavModel } from '../src/map/navroute.js';

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

  /** ds Meter weiterfahren: Ziel suchen, Navi nachführen. */
  advance(ds, dt) {
    this.move(this.trip.s + ds);
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
}
