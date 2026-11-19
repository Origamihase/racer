// Orte der XXL-Welt aus dem Stadtbaukasten (src/world/kit): jede Ortsdurchfahrt eines Orts der Karte (plan.js kitTown)
// bekommt Häuser, Läden, Plätze, Brunnen, Menschen und Wahrzeichen aus K.planTown + K.buildTown. Fahrbahn, Bordstein
// und Gehweg bleiben beim Straßenbau (roadkit.js, in den Maßen von kit/layout.js STREET), ebenso die Insel des
// Zielbrunnens (plan.js squareOf): der Plan des Orts kennt sie und stellt keinen zweiten Hauptbrunnen daneben.
import { W, curvePoint } from '../../curve.js';
import { places } from '../../map/graph.js';
import { createCityKit } from '../kit/city.js';
import { goalKind, FOUNTAIN_R, STREET } from '../kit/layout.js';
import { XXL_BEHIND, squareOf, squareWeight, secSeedKey } from './plan.js';
import { ISLAND_H } from './roadkit.js';

let kit = null;
/**
 * Der Stadtbaukasten des Spiels: Materialien, Atlas und Geometrien gibt es nur einmal (auch für den Prüfstand,
 * __MA.city). Er entsteht beim ersten Gebrauch, seine Brunnenabfragen rechnen in der gebogenen Welt (curvePoint).
 */
export function cityKit() {
  if (!kit) kit = createCityKit(W, { bend: curvePoint });
  return kit;
}

// Hauptbrunnen von klein nach groß: Ausweichliste, falls einer nicht auf die Insel passt
const BY_SIZE = Object.keys(FOUNTAIN_R).sort((a, b) => FOUNTAIN_R[a] - FOUNTAIN_R[b]);
// Fahrt beginnt mitten im Ort: so weit vor dem Startpunkt liegt dort der Brunnenplatz (rechts, vom Start aus zu sehen)
const START_GOAL = 40;
// Näher als so weit voraus muss ein Ort fertig dastehen; weiter weg entsteht er Teil für Teil, eines je Bild: die
// Fernfassungen sofort (er taucht im Dunst auf), die nahen erst, wenn der Wagen auf ihn zufährt (wer auf der
// Autobahn an seiner Ausfahrt vorbeifährt, braucht sie nie)
const BUILD_NOW = 450;
const BUILD_NEAR = 900;
// Schon der Plan kostet beim ersten Mal Zeit (er lässt die Geometrien seiner Bausteine entstehen, K.planTown): weit
// voraus bekommt er je Bild nur so viele Millisekunden und wird in Raten fertig
const PLAN_MS = 5;
// Bis in diese Entfernung regt sich ein Ort (Fangruppe, Mühlenflügel, Riesenrad)
const ALIVE = 400;

/**
 * Insel des Zielbrunnens einer Ortsdurchfahrt für den Ortsplaner (kit/layout.js planTown, island), in Ortskoordinaten
 * (u = Meter ab Ortsbeginn), oder null: Mitte, Höhe, Radius, Drehung des Brunnens, der Bereich, in dem sich die
 * Straße weitet, und ihre linke Bordsteinkante dort.
 */
export function islandOf(sec) {
  const sq = squareOf(sec);
  if (!sq) return null;
  return {
    u: sq.s - sec.s0, x: sq.x, y: ISLAND_H, r: sq.r, ry: sq.heading, u0: sq.s0 - sec.s0, u1: sq.s1 - sec.s0,
    kerb: (u) => STREET.curbL + (sq.aL - STREET.curbL) * squareWeight(sq, sec.s0 + u),
  };
}

/**
 * Plan des Orts einer Ortsdurchfahrt: für denselben Ort immer derselbe (der Zufall hängt am Ort), mit dem Namen der
 * Karte (den auch Navi und Ortstafel zeigen) und seinem Hauptbrunnen (goalKind) auf der Insel des Straßenbaus bzw.,
 * wo die Fahrt beginnt, auf dem Platz rechts kurz vor dem Wagen. Ortstafeln stellt der Schilderplan (signplan.js).
 * budget (ms): Zeit je Aufruf für einen Plan in Raten; null, solange er noch nicht steht (K.planTown).
 */
export function townPlan(K, sec, budget = Infinity) {
  const p = places[sec.place];
  const island = islandOf(sec);
  return K.planTown(p, {
    budget, len: sec.s1 - sec.s0, mainKind: goalKind(p), pavement: false, signs: false, signName: p.name,
    ...(island ? { island } : sec.start ? { goal: START_GOAL - sec.s0 } : {}),
  });
}

export class Towns {
  /** @param {import('three').Object3D} root Gruppe der Welt im Raum vor der Krümmung (wie die Rahmen) */
  constructor(root) {
    this.kit = cityKit();
    this.root = root;
    // Schlüssel des Abschnitts → { key, sec, path, place, plan, group, hidden }; plan und group erst, wenn der Plan steht
    this.items = new Map();
    this.want = new Set();
  }

  /**
   * Zielbrunnen eines Brunnenplatzes (Vertrag von XxlWorld.makeFountain): der Hauptbrunnen des Orts aus dem Baukasten
   * (layout.js goalKind: die Sonderbrunnen in Augsburg und Nürnberg, sonst nach Ortsgröße), Ursprung in der Mitte am
   * Boden, Vorderseite +z. userData.info = { name (Art), title, r, h, special, cam: { pos, look } … } in seinen
   * Koordinaten (cam: Nahaufnahme aus 2–4 m in 1,2 m Höhe), userData.dispose() räumt ihn ab.
   */
  fountain({ r, place }) {
    const K = this.kit;
    const p = places[place];
    let kind = p ? goalKind(p) : BY_SIZE[0];
    // die Insel richtet sich nach dem Brunnen (plan.js FOUNTAIN.radius); passt er trotzdem nicht, der größte, der passt
    if (FOUNTAIN_R[kind] > r + 1e-6) kind = BY_SIZE.filter((k) => !K.info(k).special && FOUNTAIN_R[k] <= r + 1e-6).pop() ?? BY_SIZE[0];
    const obj = K.fountains.build(kind);
    obj.userData.dispose = () => K.release(obj);
    return obj;
  }

  // --- Abgleich (XxlWorld.sync): begin, need für jeden Abschnitt mit gebrauchten Stücken, sweep -------------------
  begin() {
    this.want.clear();
  }

  /**
   * Die Ortsdurchfahrt sec (auf dem Weg path) ist im Sichtbereich: ihr Ort wird vorgemerkt (geplant und gebaut wird er
   * in update) bzw. behalten.
   */
  need(sec, path) {
    const key = secSeedKey(sec) + '@' + Math.round(sec.s0);
    this.want.add(key);
    let t = this.items.get(key);
    if (!t) {
      t = { key, place: sec.place, plan: null, group: null, hidden: false };
      this.items.set(key, t);
    }
    // derselbe Abschnitt, vielleicht in einem neu angelegten Zweig: neue Rahmen-ID übernehmen
    t.sec = sec;
    t.path = path;
  }

  /**
   * Plant den Ort von it und legt ihn an (seine verschmolzenen Teile baut update danach Stück für Stück). now: am
   * Stück, sonst in Raten von PLAN_MS je Aufruf. false, solange der Plan noch nicht steht.
   */
  lay(it, now) {
    const plan = townPlan(this.kit, it.sec, now ? Infinity : PLAN_MS);
    if (!plan) return false;
    const group = this.kit.buildTown(plan, { lazy: true });
    // der Ort fährt starr im Rahmen seines Abschnitts mit (siehe update)
    group.matrixAutoUpdate = false;
    group.visible = false;
    this.root.add(group);
    it.plan = plan;
    it.group = group;
    return true;
  }

  sweep() {
    for (const [key, t] of this.items) {
      if (this.want.has(key)) continue;
      this.drop(t);
      this.items.delete(key);
    }
  }

  drop(t) {
    if (!t.group) return;
    this.root.remove(t.group);
    // geteilte Geometrien des Baukastens bleiben; frei wird, was eigens für diesen Ort verschmolzen wurde
    this.kit.release(t.group);
  }

  reset() {
    for (const t of this.items.values()) this.drop(t);
    this.items.clear();
  }

  /**
   * Einmal je Bild: Orte planen, in ihre Rahmen stellen, weiterbauen, bewegen. s: Ort des Wagens, shear: Scherungen
   * der Rahmen (trip.shearsInto), t: Spielzeit in Sekunden, rain: Regen 0 … 1 (Wasser der Brunnen).
   *
   * Ein Rahmen mit Scherung {a, b} zeigt seine Straße geschert (x' = x + a + b·d, die Tiefe bleibt). Häuser sollen
   * dabei rechtwinklige Kästen bleiben: der Ort wird stattdessen um den Winkel der Scherung gedreht, längs wie die
   * Straße um 1/cos gestreckt und quer um cos gestaucht. So liegt jede Linie längs der Straße (Bordstein,
   * Häuserflucht) genau auf der gescherten Straße, Ortsanfang und -ende treffen ihre Abschnittsgrenzen, und rechte
   * Winkel bleiben rechte. Bezug ist die Mitte der eigenen Spur. Im eigenen Rahmen (b = 0, alles näher als die
   * nächste Gabelung) ist das eine reine Verschiebung.
   */
  update(s, shear, t, rain) {
    this.kit.setWater(t, rain);
    const xr = STREET.lane;
    let planning = false;
    for (const it of this.items.values()) {
      const d0 = it.sec.s0 - s;
      // hinter dem Wagen zählt ein Ort, solange sein Ende im Sichtbereich liegt
      const here = d0 + it.sec.s1 - it.sec.s0 > -XXL_BEHIND;
      // unterwegs wächst ein Ort weit voraus Stück für Stück; wer mitten hinein gesetzt wird, sieht ihn fertig
      const now = here && d0 < BUILD_NOW;
      if (!it.group) {
        // in Raten plant je Bild nur ein Ort; steht sein Plan, kommt er im nächsten Bild in seinen Rahmen
        if (!now) {
          if (planning) continue;
          planning = true;
        }
        if (!this.lay(it, now) || !now) continue;
      }
      const g = it.group;
      const sh = shear.get(it.sec.frame);
      g.visible = !!sh && !it.hidden;
      if (!sh) continue;
      const q = 1 / (1 + sh.b * sh.b);
      g.matrix.set(q, 0, -sh.b, xr + sh.a + sh.b * d0 - q * xr, 0, 1, 0, 0, sh.b * q, 0, 1, -d0 - sh.b * q * xr, 0, 0, 0, 1);
      g.matrixWorldNeedsUpdate = true;
      if (g.pending) {
        if (now) while (g.step());
        else if (g.pendingFar || d0 < BUILD_NEAR) g.step();
      }
      if (here && d0 < ALIVE) g.update(t);
    }
  }

  /**
   * Der Ort einer Ortsdurchfahrt für Navi-Karte und Brunnen-Szene: { place (Index in places), sec, plan (layout.js
   * planTown), group (K.buildTown: layout, fountains, fountainsInView, watchFountains) } oder null, solange keines
   * ihrer Stücke im Sichtbereich liegt oder ihr Plan noch nicht steht. plan.layout (= group.layout) ist der Lageplan
   * in Ortskoordinaten (x seitlich wie die Straße, z = −(s − sec.s0)), plan.fountains[0] der Zielbrunnen auf der Insel.
   */
  of(sec) {
    for (const t of this.items.values()) if (t.sec === sec) return t.group ? t : null;
    return null;
  }

  /** Alle geplanten Orte im Sichtbereich in Fahrtrichtung geordnet (wie of). */
  list() {
    return [...this.items.values()].filter((t) => t.group).sort((a, b) => a.sec.s0 - b.sec.s0);
  }
}
