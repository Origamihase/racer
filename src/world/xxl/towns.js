// Orte der XXL-Welt aus dem Stadtbaukasten (src/world/kit): jede Ortsdurchfahrt eines Orts der Karte (plan.js kitTown)
// bekommt Häuser, Läden, Plätze, Brunnen, Menschen und Wahrzeichen aus K.planTown + K.buildTown, jeder Abschnitt
// 'park' hinter einer Autobahn-Ausfahrt seinen Ladepark aus K.planPark (src/map/parks.js). Fahrbahn, Bordstein
// und Gehweg bleiben beim Straßenbau (roadkit.js, in den Maßen von kit/layout.js STREET), ebenso die Insel des
// Zielbrunnens (plan.js squareOf): der Plan des Orts kennt sie und stellt keinen zweiten Hauptbrunnen daneben.
import { W, curvePoint } from '../../curve.js';
import { places } from '../../map/graph.js';
import { createCityKit } from '../kit/city.js';
import { goalKind, FOUNTAIN_R, STREET } from '../kit/layout.js';
import { XXL_BEHIND, squareOf, squareWeight, secSeedKey } from './plan.js';
import { ISLAND_H } from './roadkit.js';
import { CHARGE, chargeOf, steleOf } from './charge.js';
import { buildChargeRig } from './chargerig.js';
import { SCHRANKE, schrankeOf, buildSchranke } from './schranke.js';
import { camerasOf } from './blitzer.js';
import { TOWN_SIGN_X } from './signplan.js';
import { PARKS, PARK } from '../../map/parks.js';
import { ladePreis } from '../../map/ladepreis.js';
import { riverOfSec, riverAt } from '../../map/rivers.js';
import { RIVER_KIT } from '../kit/river.js';

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
const PT = [0, 0];

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
 * Karte, wie ihn die Ortstafel zeigt (die stellt der Schilderplan, signplan.js), und seinem Hauptbrunnen (goalKind)
 * auf der Insel des Straßenbaus bzw., wo die Fahrt beginnt, auf dem Platz rechts kurz vor dem Wagen.
 * budget (ms): Zeit je Aufruf für einen Plan in Raten; null, solange er noch nicht steht (K.planTown).
 */
export function townPlan(K, sec, budget = Infinity) {
  const p = places[sec.place];
  const island = islandOf(sec);
  const charge = chargeOf(sec);
  const poles = camerasOf(sec).map((c) => ({ u: c.u, x: c.x }));
  // die Tafel der Ladesäule, wenn sie hinter dem Brunnenplatz im Ort steht (parks.js postAt, signplan.js)
  if (sec.postAt && sec.postAt.after) poles.push({ u: sec.postAt.u - sec.postAt.sign, x: TOWN_SIGN_X });
  // Main, Rhein und Elbe (map/rivers.js): der Plan hält ihr Band frei, der Ort baut Wasser, Ufer und Brücke
  const river = riverOfSec(sec, places);
  return K.planTown(p, {
    budget, len: sec.s1 - sec.s0, mainKind: goalKind(p), pavement: false, signs: false, signName: p.name,
    ...(island ? { island } : sec.start ? { goal: START_GOAL - sec.s0 } : {}),
    // die Ladesäule des Orts (charge.js; in Erlensee am Start der Supercharger, an dem jede Fahrt beginnt): Stecker und
    // Kabel bringt der Ort mit (Towns.lay, chargerig.js), auf der Ortsdurchfahrt steht die Popcorn-Maschine auf der Säule
    // und vor dem Park die Stele (der Plan hält ihr Platz und Sichtlinie frei); die Bildschirme der Säulen zeigen den
    // Preis der Säule des Orts (map/ladepreis.js, derselbe, den der Ladestopp dort bucht)
    ...(charge ? { charge: { u: charge.u, kind: CHARGE.kindStart, stop: !charge.start, stele: steleOf(sec), price: ladePreis({ post: sec.place }) } } : {}),
    // der Blitzer des Orts (blitzer.js) und die Tafel einer Säule hinter dem Brunnen (die stellt der Schilderplan): ihr
    // Platz im Streifen bleibt frei
    ...(poles.length ? { poles } : {}),
    ...(river ? { river } : {}),
  });
}

/**
 * Plan des Ladeparks eines Abschnitts 'park' (kit/layout.js planPark): derselbe für denselben Park, benannt wie seine
 * Schilder, der Ladepark mit der Mitte bei PARK.u (dort hält der Wagen neben der freien Heldenbucht, PARK.halt), auf
 * den Bildschirmen seiner Säulen sein Preis (map/ladepreis.js).
 */
export function parkPlan(K, sec) {
  return K.planPark({ title: PARKS[sec.park].name, len: sec.s1 - sec.s0, u: PARK.u, kind: CHARGE.kindStart, price: ladePreis({ park: sec.park }) });
}

/**
 * Was die Nahansicht des Navis von einer Ortsdurchfahrt zeigt (src/map/roadahead.js setTownLayout): den Brunnenplatz
 * und den Zielbrunnen dort, wo Straßenbau und Baukasten sie bauen, in Metern der Fahrt (s) und seitlicher Lage x im
 * Rahmen des Abschnitts: { streets, square: { s, x, r }, fountain: { s, x } } oder null. Nebenstraßen hat der Ort
 * keine (streets bleibt leer), die Stecknadel des Navis steckt im Zielbrunnen.
 * Die Insel legt der Straßenbau fest (islandOf), der Plan des Orts stellt seinen Hauptbrunnen genau darauf
 * (tools/citykit-test.mjs prüft das für jeden Ort): sie steht, ehe der Ort geplant ist, das Navi wartet also nie auf
 * einen Plan und stößt keinen an. Der Platz ist dort die Fahrbahn, die sich links um die Insel weitet, bis an ihren
 * Bordstein. Wo die Fahrt beginnt, gibt es keine Insel: der Platz liegt rechts der Straße, wie ihn der Plan des Orts
 * zeigt (town = Towns.of(sec): null, solange der Plan noch nicht steht).
 */
export function naviLayout(sec, town = null) {
  const isl = islandOf(sec);
  if (isl) {
    const s = sec.s0 + isl.u;
    return { streets: [], square: { s, x: isl.x, r: isl.x - isl.kerb(isl.u) }, fountain: { s, x: isl.x } };
  }
  const L = town ? town.plan.layout : null;
  const q = L && L.goal ? L.squares[L.goal.square] : null;
  if (!q) return null;
  return {
    streets: [],
    square: { s: sec.s0 - (q.z0 + q.z1) / 2, x: (q.x0 + q.x1) / 2, r: Math.min(q.x1 - q.x0, q.z1 - q.z0) / 2 },
    fountain: { s: sec.s0 - L.goal.z, x: L.goal.x },
  };
}

export class Towns {
  /** @param {import('three').Object3D} root Gruppe der Welt im Raum vor der Krümmung (wie die Rahmen) */
  constructor(root) {
    this.kit = cityKit();
    this.root = root;
    // Schlüssel des Abschnitts → { key, sec, path, place, plan, group, hidden }; plan und group erst, wenn sein Plan
    // steht (update)
    this.items = new Map();
    this.want = new Set();
    /**
     * Das Flussband für den Boden der Welt (ground.js setHoles), im Raum vor der Krümmung wie die Rahmen: on, Punkt
     * der Achse (x, z), Einheitsvektor quer zum Fluss (nx, nz), halbe Breite des Lochs und seine halbe Länge. Je Bild
     * neu aus dem nächsten Ort mit gebautem Fluss auf dem Weg des Wagens (update); ein Objekt für alle Bilder.
     */
    this.band = { on: false, x: 0, z: 0, nx: 0, nz: 1, half: 0, reach: 0, d: 0 };
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
    // (ein kleinerer Brunnen bekommt auf seiner Insel einen Garten, fountains.js GARDEN)
    const obj = K.fountains.onIsland(kind, r);
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
    const plan = it.sec.kind === 'park' ? parkPlan(this.kit, it.sec) : townPlan(this.kit, it.sec, now ? Infinity : PLAN_MS);
    if (!plan) return false;
    const group = this.kit.buildTown(plan, { lazy: true });
    // der Ort fährt starr im Rahmen seines Abschnitts mit (siehe update)
    group.matrixAutoUpdate = false;
    group.visible = false;
    this.root.add(group);
    it.plan = plan;
    it.group = group;
    // an jeder Ladesäule (Startort, Orte auf dem Weg, Ladeparks): Stecker und Kabel an der Heldensäule (die Startszene
    // zieht sie aus dem Wagen, der Ladestopp steckt sie hinein und wieder zurück)
    if (plan.charge?.kind === CHARGE.kindStart) {
      it.charge = buildChargeRig();
      it.charge.group.position.set(plan.charge.x - CHARGE.post[1], this.kit.info(plan.charge.kind).ground, -(plan.charge.u - CHARGE.post[0]));
      it.charge.group.rotation.y = -Math.PI / 2;
      group.add(it.charge.group);
    }
    // die Bezahlschranke hinter der Ortstafel (schranke.js): offen, bis das Spiel sie schließt (gate)
    const gate = schrankeOf(it.sec);
    if (gate) {
      it.gate = buildSchranke();
      it.gate.group.position.set(SCHRANKE.x, STREET.top, -gate.u);
      group.add(it.gate.group);
    }
    return true;
  }

  /** Die Bezahlschranke der Ortsdurchfahrt sec stellen: k 0 zu … 1 offen (ohne gebauten Ort: nichts). */
  gate(sec, k) {
    for (const t of this.items.values()) if (t.sec === sec && t.gate) t.gate.set(k);
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
    t.charge?.dispose();
  }

  reset() {
    for (const t of this.items.values()) this.drop(t);
    this.items.clear();
  }

  /**
   * Einmal je Bild: Orte planen, in ihre Rahmen stellen, weiterbauen, bewegen. s: Ort des Wagens, shear: Scherungen
   * der Rahmen (trip.shearsInto), t: Spielzeit in Sekunden, rain: Regen 0 … 1 (Wasser der Brunnen), cur: der Weg des
   * Wagens (trip.cur).
   *
   * Wasser hat die Welt nur auf dem Weg des Wagens: das Band eines Flusses reicht quer weit über seinen Ort hinaus und
   * läge sonst unter der Autobahn, die an ihm vorbeiführt – dort zeigt die Karte Land, und eine Brücke hat nur die
   * Ortsstraße. Der Fluss eines Orts am Abzweig voraus oder am verlassenen Abzweig bleibt deshalb weg (Wasser, Ufer,
   * Geländer) und der Boden ganz; er erscheint samt seinem Loch, sobald der Wagen die Ausfahrt nimmt – dann liegt er
   * über einen Kilometer voraus im Dunst.
   *
   * Ein Rahmen mit Scherung {a, b} zeigt seine Straße geschert (x' = x + a + b·d, die Tiefe bleibt). Häuser sollen
   * dabei rechtwinklige Kästen bleiben: der Ort wird stattdessen um den Winkel der Scherung gedreht, längs wie die
   * Straße um 1/cos gestreckt und quer um cos gestaucht. So liegt jede Linie längs der Straße (Bordstein,
   * Häuserflucht) genau auf der gescherten Straße, Ortsanfang und -ende treffen ihre Abschnittsgrenzen, und rechte
   * Winkel bleiben rechte. Bezug ist die Mitte der eigenen Spur. Im eigenen Rahmen (b = 0, alles näher als die
   * nächste Gabelung) ist das eine reine Verschiebung.
   */
  update(s, shear, t, rain, cur) {
    this.kit.setWater(t, rain);
    const xr = STREET.lane;
    let planning = false;
    const band = this.band;
    band.on = false;
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
      if (g.river) {
        g.river.visible = it.path === cur;
        if (g.river.visible && g.visible) this.riverBand(g, it.plan.river, d0);
      }
    }
  }

  /**
   * Trägt den Fluss rv des Orts g (dessen Matrix steht, d0 Meter voraus beginnt er) als Band für den Boden ein, wenn
   * kein näherer schon dasteht. Die Matrix dreht und streckt den Ort in fremden Rahmen ein wenig: das Band entsteht
   * deshalb aus drei mitgeführten Punkten (Achse, 100 m flussab, Wasserkante), nicht aus dem Winkel des Plans.
   */
  riverBand(g, rv, d0) {
    const band = this.band;
    const d = Math.abs(d0 + rv.u);
    if (band.on && band.d <= d) return;
    const e = g.matrix.elements;
    const at = (X, D) => {
      riverAt(rv, X, D, PT);
      const x = PT[0];
      const z = -PT[1];
      PT[0] = e[0] * x + e[8] * z + e[12];
      PT[1] = e[2] * x + e[10] * z + e[14];
    };
    at(0, 0);
    const ax = PT[0];
    const az = PT[1];
    at(100, 0);
    const tx = PT[0] - ax;
    const tz = PT[1] - az;
    const tl = Math.hypot(tx, tz);
    at(0, rv.half + RIVER_KIT.hole);
    band.on = true;
    band.d = d;
    band.x = ax;
    band.z = az;
    band.nx = -tz / tl;
    band.nz = tx / tl;
    band.half = Math.abs((PT[0] - ax) * band.nx + (PT[1] - az) * band.nz);
    band.reach = (rv.reach * tl) / 100;
  }

  /**
   * Der Ort einer Ortsdurchfahrt für Navi-Karte und Brunnen-Szene: { place (Index in places), sec, plan (layout.js
   * planTown), group (K.buildTown: layout, fountains, fountainsInView, watchFountains) } oder null, solange keines
   * ihrer Stücke im Sichtbereich liegt oder ihr Plan noch nicht steht. plan.layout (= group.layout) ist der Lageplan
   * in Ortskoordinaten (x seitlich wie die Straße, z = −(s − sec.s0)), plan.fountains[0] der Zielbrunnen auf der
   * Insel. Im Startort dazu charge: Stecker und Kabel der Heldensäule (chargerig.js, im Ort an der Säule).
   */
  of(sec) {
    for (const t of this.items.values()) if (t.sec === sec) return t.group ? t : null;
    return null;
  }

  /** Alle geplanten Orte im Sichtbereich in Fahrtrichtung geordnet (wie of; ohne die Ladeparks). */
  list() {
    return [...this.items.values()].filter((t) => t.group && t.sec.kind !== 'park').sort((a, b) => a.sec.s0 - b.sec.s0);
  }
}
