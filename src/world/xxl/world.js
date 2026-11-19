// Die XXL-Welt (?xxl): macht die Strecke aus trip.js sichtbar. Jede Autobahn und jedes Straßenstück abseits ist ein
// Rahmen (frames.js) mit Scherung aus trip.shears(). Gezeichnet werden:
// - die eine Autobahn aus trip.autobahnView() mit der klassischen Road (flach, mit Zonen für Lücken und Ende) und
//   der klassischen Szenerie, beide in ihren Rahmen gehängt, dazu ihre Knotenpunkte (junction.js),
// - alle Abschnitte abseits der Autobahn, die trip.visible() erlaubt, als Straßenstücke (roadkit.js) mit Bewuchs
//   (forest.js), in Stücken von höchstens CHUNK Metern, die einmal gebaut und behalten werden, solange sie im
//   Sichtbereich [s − XXL_BEHIND, s + AHEAD] liegen,
// - die Orte der Karte an ihren Ortsdurchfahrten aus dem Stadtbaukasten (towns.js): Häuser, Plätze, Brunnen, Menschen
//   und Wahrzeichen, solange ein Stück ihres Abschnitts im Sichtbereich liegt,
// - die Tafeln (signs.js nach signplan.js: Vorwegweiser, Entfernungstafeln, Ortstafeln …, alle Texte aus der Fahrt),
// - der eine Boden (ground.js).
// Jeder Zufall hängt an stabilen Schlüsseln der Abschnitte (Art, Knoten, Kante, Ort …), nie an IDs: ein neu
// geplanter Zweig sieht genauso aus wie vorher.
import * as THREE from 'three';
import { Trip, J, R as rampR, dR as rampSlope } from '../../game/trip.js';
import { hashString, mulberry32 } from '../../util.js';
import { FramePool } from './frames.js';
import { Ground, LAYER } from './ground.js';
import { RoadMaterials, buildPiece, VIS, VERGE, KERB, AB_EDGE, RAIL_U, ISLAND_H, crossSection, curveShift, linShift, stubOf } from './roadkit.js';
import { Towns } from './towns.js';
import { PropSet, PROP, addProp, forestSide, openSide, fieldSide, houseSide } from './forest.js';
import { Junctions, closeLine } from './junction.js';
import { Signs } from './signs.js';
import { tableAt, tableS } from './signplan.js';
import {
  XXL_BEHIND, AHEAD, secSeedKey, eachPiece, limitsFor, autoTarget, autoDrive, AUTO, Arrival, squareOf, kitTown,
} from './plan.js';

export { XXL_BEHIND, AHEAD, autoTarget, autoDrive, AUTO };
const SYNC_STEP = 25; // spätestens nach so vielen Metern wird die Liste der Stücke abgeglichen
// Bezugspunkt des Bewuchses eines Rahmens rückt erst nach, wenn der Spieler so weit von ihm weg ist (Instanzen bis
// rund 4 km davon: float32 genau auf 0,5 mm)
const PROP_REANCHOR = 2048;
// So weit hinter einer Gabelung bzw. vor einem Einfädelpunkt reicht das Gebiet des abzweigenden Wegs (rechts der
// Winkelhalbierenden): weiter, als die Szenerie der Autobahn je gebaut wird, solange sie zu sehen ist (bis J.hide
// hinter der Gabelung plus 1800 m voraus).
const TERRITORY = 2400;

/** Optionen für die flache Road (siehe Road, opts.zone). */
export const ROAD_OPTS = {
  flat: true,
  behind: XXL_BEHIND,
  verge: VERGE,
  vergeLayer: LAYER.verge,
  zone: { railGap: RAIL_U, gore: J.gore, lane: J.decel, cap: J.cap, kappa: J.kappa, wedgeSum: AB_EDGE + VIS.rampe.aL },
};

export class XxlWorld {
  /**
   * @param {{scene: THREE.Scene, road: import('../road.js').Road, scenery: import('../scenery.js').Scenery}} ctx
   */
  constructor({ scene, road, scenery }) {
    this.root = new THREE.Group();
    this.root.name = 'XXL';
    scene.add(this.root);
    this.scene = scene;
    this.road = road;
    this.scenery = scenery;
    scenery.keepOut = (x, s) => this.sceneryKeepOut(x, s);
    scenery.noCross = (s0, s1) => this.sceneryNoCross(s0, s1);
    // keine Zufallstexte auf Schildern (COMMON.md 9): die Schilderbrücken tragen Entfernungstafeln aus der Fahrt,
    // braune und blaue Fantasietafeln entfallen, ebenso Ziel-Tafel und Skyline des klassischen Navis
    scenery.gantryTexts = (s) => this.gantryTexts(s);
    scenery.noRandomSigns = true;
    scenery.skipRequest = (type) => type === 'ziel' || type === 'skyline';
    this.ground = new Ground(this.root);
    this.frames = new FramePool(this.root);
    this.frames.onRelease = (v) => {
      if (v.props) v.props.fill([], 0);
      v.propSig = null;
      v.propRef = null;
    };
    this.mats = new RoadMaterials();
    this.junctions = new Junctions(this);
    this.signs = new Signs(this);
    this.boards = []; // s der Tafeln am Rand der gezeichneten Autobahn (Szenerie hält dort Abstand)
    this.shear = new Map();
    this.pieces = new Map();
    this.wantKeys = new Set();
    this.events = [];
    this.listeners = [];
    // Ankunft am Navi-Ziel: Halt vor dem Brunnen, Ereignis 'rest' (siehe on); mit arrival.hold = true bleibt der
    // Wagen danach stehen, bis arrival.release() (die Brunnen-Szene des Spiels)
    this.arrival = new Arrival();
    // Orte und Brunnen aus dem Stadtbaukasten
    this.towns = new Towns(this.root);
    /**
     * Haken für das Spiel: baut den Brunnen eines Brunnenplatzes, fn({r, place, seed, heading}) → Object3D mit
     * Ursprung in der Mitte am Boden, Vorderseite +z (zum haltenden Wagen). Standard: der Hauptbrunnen des Orts aus
     * dem Stadtbaukasten (towns.js). Geometrien des Ergebnisses gibt die Welt nie frei (der Baukasten teilt sie);
     * trägt es userData.dispose, ruft sie das beim Abräumen des Stücks.
     */
    this.makeFountain = (opts) => this.towns.fountain(opts);
    this.view = null;
    this.zones = []; // Knotenpunkte der gezeichneten Autobahn: {s, type: +1 Ausfahrt / −1 Einfädeln}
    // Ende bzw. Anfang der gezeichneten Autobahn für den Verkehr (Traffic.end, Traffic.begin)
    this.abEnd = null;
    this.abBegin = null;
    this.debugColors = false;
    // Prüfhilfen: Entscheidung des Autopiloten an Gabelungen ('exit' | 'stay', null = Navi) und die Maske des
    // Wechseltests (blendet alles aus, was mit der gezeichneten Autobahn kommt und geht, siehe setMask)
    this.choice = null;
    this.maskAutobahn = false;
    this.maskOn = false;
    this.placeView = (v, id) => {
      const sh = this.shear.get(id);
      v.group.visible = !!sh;
      if (sh) v.set(sh.a, sh.b, this.s);
    };
    this.reset();
  }

  /** Neue Fahrt ab dem Ort des Knotens start (Standard: Erlensee). */
  reset(start) {
    for (const p of this.pieces.values()) this.dropPiece(p);
    this.pieces.clear();
    this.towns.reset();
    this.trip = new Trip({ start });
    this.s = this.trip.s;
    this.arrival.reset();
    this.version = -1;
    this.nextSync = -Infinity;
    this.road.group.visible = false;
    this.junctions.reset();
    this.signs.reset();
    if (this.onReset) this.onReset();
  }

  /**
   * Ohne Bild m Meter der Route folgen (Titel, Prüfhilfen): x wie der Autopilot, Ereignisse werden nur gezählt.
   * Danach steht der Spieler mit allem drum herum an der neuen Stelle.
   */
  advance(p, m, step = 5) {
    const T = this.trip;
    const end = p.s + m;
    const evs = [];
    while (p.s < end) {
      p.s = Math.min(end, p.s + step);
      p.x = autoTarget(T, this.choice);
      for (const e of T.update(p.s, p.x)) evs.push(e.type);
    }
    p.vx = 0;
    this.version = -1;
    this.update(p.s, p.x, 0);
    return evs;
  }

  /**
   * Ereignisse von trip.update an Zuhörer (z. B. das Spiel) weitergeben: fn(ev). Dazu kommt
   * {type: 'rest', place, sec, square, fountain}, sobald der Wagen am Navi-Ziel vor dem Brunnen steht (siehe square).
   */
  on(fn) {
    this.listeners.push(fn);
  }

  /**
   * Einmal pro Bild nach der Bewegung des Spielers: Strecke fortschreiben, Stücke abgleichen, Rahmen setzen.
   * Danach gilt trip.profile() für die nächste Bewegung (siehe limitsFor). speed: Tempo des Wagens (m/s), time:
   * Spielzeit in Sekunden (bewegt das Wasser der Brunnen und was sich in den Orten regt).
   */
  update(s, x, wet, speed = Infinity, time = 0) {
    const T = this.trip;
    this.s = s;
    const ev = T.update(s, x);
    this.events = ev;
    if (T.version !== this.version || s >= this.nextSync || ev.length) this.sync();
    T.shearsInto(this.shear);
    for (let i = 0; i < ev.length; i++) for (let k = 0; k < this.listeners.length; k++) this.listeners[k](ev[i]);
    const rest = this.arrival.update(T, ev, speed);
    if (rest) {
      rest.fountain = this.square(rest.sec);
      for (let k = 0; k < this.listeners.length; k++) this.listeners[k](rest);
    }
    this.frames.byId.forEach(this.placeView);
    this.ground.update(s, wet);
    this.mats.setWet(wet);
    this.towns.update(s, this.shear, time, wet);
    this.updateRoad(s);
    this.junctions.update(s, wet);
    if (this.maskAutobahn !== this.maskOn) this.setMask(this.maskAutobahn);
  }

  /**
   * Prüfhilfe für den Wechseltest (ENGINE.md 5): on = alles unsichtbar, was mit der gezeichneten Autobahn erscheint
   * oder verschwindet (Fahrbahn, Szenerie, Knotenpunkte, fremde Wege, eigene Abschnitte hinter der nächsten
   * Auffahrt), so als wäre der Wechsel an genau dieser Stelle schon geschehen bzw. noch nicht. Den Verkehr blendet
   * main.js aus. Ein Bild mit und eines ohne Maske an derselben Stelle zeigen, was von der Autobahn zu sehen ist.
   */
  setMask(on) {
    this.maskOn = on;
    const T = this.trip;
    let after = Infinity;
    for (const c of T.cur.sections) if (c.kind === 'ab' && c.merge && c.s0 > T.s) {
      after = c.s0;
      break;
    }
    const ab = !!this.view && !on;
    this.road.group.visible = ab;
    this.scenery.track.visible = ab;
    for (const it of this.junctions.items.values()) it.group.visible = !on;
    for (const it of this.signs.items.values()) it.group.visible = !on || ((!this.view || it.frame !== this.view.frame) && this.frameOwn(it.frame, after));
    for (const p of this.pieces.values()) p.group.visible = !on || (p.path === T.cur && p.sec.s0 < after);
    for (const t of this.towns.items.values()) t.hidden = on && !(t.path === T.cur && t.sec.s0 < after);
    for (const fv of this.frames.byId.values()) if (fv.props) fv.props.group.visible = !on || this.frameOwn(fv.id, after);
  }

  /** Gehört der Rahmen zum eigenen Weg vor der nächsten Auffahrt (für setMask)? */
  frameOwn(id, after) {
    for (const p of this.pieces.values()) if (p.frame === id && p.path === this.trip.cur && p.sec.s0 < after) return true;
    return false;
  }

  /** Zonen der Autobahn (Lücken, Blockmarkierung, Anfang/Ende) relativ zum Spieler. */
  updateRoad(s) {
    const v = this.view;
    if (!v) return;
    // die beiden nächsten Knotenpunkte
    let d0 = 1e6;
    let t0 = 0;
    let d1 = 1e6;
    let t1 = 0;
    for (let i = 0; i < this.zones.length; i++) {
      const z = this.zones[i];
      const d = z.s - s;
      if (Math.abs(d) < Math.abs(d0)) {
        d1 = d0;
        t1 = t0;
        d0 = d;
        t0 = z.type;
      } else if (Math.abs(d) < Math.abs(d1)) {
        d1 = d;
        t1 = z.type;
      }
    }
    this.road.setZones(d0, t0, d1, t1, isFinite(v.s0) ? v.s0 - s : -1e6, isFinite(v.s1) ? v.s1 - s : 1e6);
  }

  // --- Abgleich -----------------------------------------------------------------------------------------------
  sync() {
    const T = this.trip;
    const s = this.s;
    this.version = T.version;
    this.nextSync = s + SYNC_STEP;
    const view = (this.view = T.autobahnView());
    // nächste Schwelle, an der eine Autobahn erscheint (autobahnView und visible hängen an s)
    for (const c of T.cur.sections) {
      if (c.kind === 'ab' && c.merge && c.s0 - J.show > s) this.nextSync = Math.min(this.nextSync, c.s0 - J.show);
    }
    const lo = s - XXL_BEHIND;
    const hi = s + AHEAD;
    const want = this.wantKeys;
    want.clear();
    const signGroups = view ? [[view.secs, view.secs]] : [];
    this.towns.begin();
    eachPiece(
      T,
      view,
      (key, path, sec, prev, next, ch, forest) => {
        want.add(key);
        if (kitTown(sec)) this.towns.need(sec, path);
        const p = this.pieces.get(key);
        if (!p) this.pieces.set(key, this.buildPiece(key, path, sec, prev, next, ch, forest));
        else {
          // derselbe Abschnitt, vielleicht in einem neu angelegten Zweig: neue Rahmen-ID übernehmen
          p.sec = sec;
          p.path = path;
          p.frame = sec.frame;
        }
      },
      (path, drawn) => signGroups.push([path.sections, drawn]),
    );
    for (const [key, p] of this.pieces) {
      if (want.has(key)) continue;
      this.dropPiece(p);
      this.pieces.delete(key);
    }
    this.towns.sweep();
    // Tafeln (und ihre Stellen am Rand der gezeichneten Autobahn, an denen die Szenerie Platz lässt)
    this.signs.sync(T, signGroups, lo, hi + 400, hi);
    this.boards.length = 0;
    if (view) for (const e of this.signs.entries) if (e.frame === view.frame && e.side > 0 && e.kind !== 'bake') this.boards.push(e.s);
    // Knotenpunkte und Zonen der gezeichneten Autobahn (ändern sie sich, baut die Szenerie die Ferne neu)
    this.zones.length = 0;
    if (view) {
      for (const c of view.secs) {
        if (c.merge) this.zones.push({ s: c.merge.s, type: -1 });
        if (c.fork) this.zones.push({ s: c.fork.s, type: 1 });
      }
    }
    this.abBegin = view && isFinite(view.s0) ? view.s0 : null;
    let fs = null;
    if (view && isFinite(view.s1)) for (const c of view.secs) if (c.fork && c.fork.forced) fs = c.fork.s;
    if (fs === null) this.abEnd = null;
    else if (!this.abEnd || this.abEnd.fs !== fs) this.abEnd = { fs, s1: view.s1, openLeft: (s) => closeLine(fs, s), rampX: rampR, rampSlope };
    const zsig = (view ? view.frame + ':' + view.s0 + ':' + view.s1 + ':' : '') + this.zones.map((z) => z.type + '@' + Math.round(z.s)).join(',') + '|' + this.boards.map(Math.round).join(',');
    if (zsig !== this.zoneSig) {
      this.zoneSig = zsig;
      this.zonesChanged = true;
    }
    this.junctions.sync(view, T);
    // Rahmenansichten: die der Autobahn und die aller Stücke
    const keep = new Set();
    if (view) keep.add(view.frame);
    for (const p of this.pieces.values()) keep.add(p.frame);
    for (const id of this.junctions.frames()) keep.add(id);
    for (const id of this.signs.frames()) keep.add(id);
    for (const id of keep) this.frames.acquire(id);
    // Road und Szenerie hängen in der Ansicht der gezeichneten Autobahn
    if (view) {
      const fv = this.frames.get(view.frame);
      if (this.road.group.parent !== fv.group) fv.group.add(this.road.group);
      if (this.scenery.track.parent !== fv.group) fv.group.add(this.scenery.track);
      this.road.group.visible = true;
      this.scenery.track.visible = true;
    } else {
      this.root.add(this.road.group);
      this.root.add(this.scenery.track);
      this.road.group.visible = false;
      this.scenery.track.visible = false;
    }
    for (const p of this.pieces.values()) {
      const fv = this.frames.get(p.frame);
      if (p.group.parent !== fv.track) fv.track.add(p.group);
    }
    this.junctions.attach();
    this.signs.attach();
    if (this.maskOn) this.setMask(true);
    if (this.afterSync) this.afterSync();
    // Bewuchs je Rahmen neu sammeln, wenn sich seine Stücke geändert haben
    const lists = new Map();
    for (const p of this.pieces.values()) {
      if (!lists.has(p.frame)) lists.set(p.frame, []);
      lists.get(p.frame).push(p);
    }
    for (const id of keep) {
      const fv = this.frames.get(id);
      const ps = lists.get(id) || [];
      const sig = ps.map((p) => p.key).sort().join(',');
      if (fv.propSig === sig) continue;
      fv.propSig = sig;
      if (!fv.props) fv.props = new PropSet(fv.track);
      // Der Bezugspunkt bleibt stehen, solange er nah ist: kommt ein Stück hinzu oder fällt eines weg (am Horizont,
      // beim Wechsel der Autobahn), bekommen alle übrigen Bäume bitgleich dieselben Matrizen wie vorher. Ein neuer
      // Bezugspunkt verschiebt sie um Rundungsreste der float32-Matrizen (einzelne Pixel an Kanten flackern).
      if (fv.propRef === null || Math.abs(s - fv.propRef) > PROP_REANCHOR) fv.propRef = Math.round(s);
      fv.props.fill(ps.map((p) => p.props), fv.propRef);
    }
    this.frames.releaseExcept(keep);
  }

  // --- Stücke ---------------------------------------------------------------------------------------------------
  buildPiece(key, path, sec, prev, next, ch, forest) {
    const group = buildPiece(this.mats, sec, prev, next, ch.a, ch.b, ch.curve);
    group.name = 'XXL-Stück ' + sec.kind;
    const props = [];
    const seed = hashString(secSeedKey(sec)) ^ Math.imul(Math.round(ch.a - sec.s0) + 1, 2654435761);
    this.planProps(props, mulberry32(seed), path, sec, prev, next, ch, forest);
    // der Brunnen steht im Stück, das die Mitte der Insel enthält
    const sq = squareOf(sec);
    let fountain = null;
    if (sq && sq.s >= ch.a && sq.s < ch.b) {
      fountain = this.makeFountain({ r: sq.r - 0.45, place: sec.place, seed: hashString(secSeedKey(sec)), heading: sq.heading });
      fountain.position.set(sq.x, ISLAND_H, -(sq.s - ch.a));
      fountain.rotation.y = sq.heading;
      group.add(fountain);
    }
    return { key, sec, path, frame: sec.frame, group, props, a: ch.a, b: ch.b, fountain };
  }

  dropPiece(p) {
    if (p.fountain) {
      // geteilte Geometrien des Brunnens bleiben; was eigens für ihn entstand, räumt er selbst ab
      p.group.remove(p.fountain);
      if (p.fountain.userData.dispose) p.fountain.userData.dispose();
    }
    if (p.group.parent) p.group.parent.remove(p.group);
    p.group.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
    });
  }

  /** Bewuchs eines Stücks planen (Rahmenkoordinaten des Abschnitts). */
  planProps(out, rnd, path, sec, prev, next, ch, forest) {
    const X = {};
    const link = sec.link;
    const uOf = (s) => (link.type === 'exit' ? s - link.s : link.s - s);
    const off = (s) => (ch.curve ? curveShift(uOf(s)) : 0);
    // Autobahnen in der Nähe (verlassene hinter der Ausfahrt, kommende vor der Auffahrt): ihre rechte Kante im
    // eigenen Rahmen; Bewuchs bleibt rechts der Winkelhalbierenden zwischen ihr und unserem linken Rand
    const exitLink = path.fork && path.fork.link && path.fork.branch === path ? path.fork.link : null;
    let mergeLink = null;
    for (const c of path.sections) if (c.kind === 'auf' && c.link && c.s0 >= sec.s0 - 1) {
      mergeLink = c.link;
      break;
    }
    const abEdge = (s) => {
      let e = -Infinity;
      if (exitLink && s >= exitLink.s) e = Math.max(e, AB_EDGE + VERGE - linShift(s - exitLink.s));
      if (mergeLink && s <= mergeLink.s) e = Math.max(e, AB_EDGE + VERGE - linShift(mergeLink.s - s));
      return e;
    };
    const ctx = {
      edge: (s, side) => {
        crossSection(sec, prev, next, s, X);
        const o = off(s);
        const band = X.kerb ? KERB.pave + KERB.garden : X.rails ? Math.max(VERGE, 1.6) : X.verge;
        return side < 0 ? X.aL + o - band : X.aR + o + band;
      },
      limit: (s, side) => {
        if (side > 0) return Infinity;
        const e = abEdge(s);
        if (e === -Infinity) return -Infinity;
        crossSection(sec, prev, next, s, X);
        const left = X.aL + off(s);
        return (e + left) / 2 + 1.5;
      },
      // im Stummel und seinen Ecken wächst nichts (sein Ende verschwindet unten zwischen eigens gesetzten Bäumen)
      blocked: (x, s, r) => {
        if (!st || x > Math.max(st.near, st.far)) return false;
        if (s > st.s - st.w / 2 - 3 - r && s < st.s + st.w / 2 + 3 + r && x > st.x1 - 9) return true;
        return s > st.a - 2 - r && s < st.b + 2 + r && x > Math.min(st.near, st.far) - st.R - 3 - r;
      },
    };
    const st = stubOf(sec, prev, next);
    const inForest = (a, b) => forest.filter((r) => r.s1 > a && r.s0 < b).map((r) => [Math.max(a, r.s0), Math.min(b, r.s1)]);
    const segs = [];
    let at = ch.a;
    for (const [a, b] of inForest(ch.a, ch.b)) {
      if (a > at) segs.push([at, a, false]);
      segs.push([a, b, true]);
      at = b;
    }
    if (at < ch.b) segs.push([at, ch.b, false]);
    const town = sec.profile === 'stadt';
    // Orte der Karte bebaut der Stadtbaukasten (towns.js): dort bleibt der Rand der Straße frei
    const kit = kitTown(sec);
    // Stummel: Bäume an seinen Rändern, an seinem Ende ein dichter Busch- und Baumtupfen, hinter dem er verschwindet
    if (st && st.s >= ch.a && st.s < ch.b) {
      const { x1, s: sc, w } = st;
      for (const [dx, ds, k] of [[2.6, -1.9, 1.75], [1.4, 1.7, 1.9], [4.2, 0.2, 1.5], [0.2, -0.3, 1.8], [3.0, 3.4, 1.3]]) {
        addProp(out, PROP.bush, x1 + dx, sc + ds, k, k * 1.05, k, rnd() * 6.3, 0xffffff);
      }
      for (const [dx, ds] of [[-1.5, -3.6], [-2.5, 3.3], [-5, 0], [-3.5, -7.5], [-4, 7.5], [-8, -3], [-8.5, 4]]) {
        const k = 1.3 + rnd() * 0.4;
        addProp(out, rnd() < 0.5 ? PROP.conifer : PROP.decid, x1 + dx, sc + ds, k, k, k, rnd() * 6.3, 0xffffff);
      }
      for (let x = Math.min(st.near, st.far) - st.R - 4; x > x1 + 5; x -= 4.5 + rnd() * 2) {
        for (const sg of [-1, 1]) {
          const k = 1.1 + rnd() * 0.35;
          addProp(out, rnd() < 0.4 ? PROP.conifer : PROP.decid, x + rnd() - 0.5, sc + sg * (w / 2 + 3.4 + rnd() * 1.2), k, k, k, rnd() * 6.3, 0xffffff);
        }
      }
    }
    // Brunnenplatz: Bäume und Bänke am linken Gehweg, mit Blick auf den Brunnen
    const sq = kit ? null : squareOf(sec);
    if (sq) {
      for (const [ds, kind] of [[-9, 'tree'], [-3.2, 'bench'], [3.2, 'bench'], [9, 'tree']]) {
        const s1 = sq.s + ds;
        if (s1 < ch.a || s1 >= ch.b) continue;
        crossSection(sec, prev, next, s1, X);
        const x = X.aL - KERB.w - 1.6;
        if (kind === 'tree') addProp(out, PROP.decid, x, s1, 1.15, 1.2, 1.15, rnd() * 6.3, 0xffffff);
        else addProp(out, PROP.bench, x - 0.3, s1, 1, 1, 1, -Math.PI / 2, 0xffffff);
      }
    }
    for (const [a, b, wood] of kit ? [] : segs) {
      for (const side of [-1, 1]) {
        if (wood) forestSide(out, rnd, ctx, a, b, side, 22);
        else if (town) houseSide(out, rnd, ctx, a, b, side);
        else if (sec.kind === 'ramp' || sec.kind === 'auf') openSide(out, rnd, ctx, a, b, side, false);
        else {
          openSide(out, rnd, ctx, a, b, side, sec.kind === 'land' && rnd() < 0.4);
          fieldSide(out, rnd, ctx, a, b, side);
        }
      }
      // Lichtungen mit kleinen Freuden im Wald: ein Reh, ein Hochsitz, eine Bank
      if (wood && b - a > 120) {
        const s1 = a + 40 + rnd() * (b - a - 80);
        const side = rnd() < 0.5 ? -1 : 1;
        const pick = rnd();
        const x = ctx.edge(s1, side) + side * 0.9;
        if (pick < 0.4) addProp(out, PROP.deer, x + side * 0.6, s1, 1, 1, 1, side < 0 ? 0 : Math.PI, 0xffffff);
        else if (pick < 0.7) addProp(out, PROP.hide, x + side * 2.2, s1, 1, 1, 1, side < 0 ? 0 : Math.PI, 0xffffff);
        else addProp(out, PROP.bench, x + side * 0.2, s1, 1, 1, 1, side < 0 ? -Math.PI / 2 : Math.PI / 2, 0xffffff);
      }
    }
  }

  // --- Gebiete der Autobahn-Szenerie ---------------------------------------------------------------------------
  /** true, wo die Szenerie der gezeichneten Autobahn nichts hinstellen darf (Rahmenkoordinaten der Autobahn). */
  sceneryKeepOut(x, s) {
    const v = this.view;
    if (!v || s > v.s1 - 2 || s < v.s0 + 2) return true;
    // Tafeln am Rand: davor, dahinter und dahinter im Grünen nichts (Bäume, Büsche, Häuser)
    if (x > AB_EDGE && x < AB_EDGE + 12) for (let i = 0; i < this.boards.length; i++) if (Math.abs(s - this.boards[i]) < 9) return true;
    for (let i = 0; i < this.zones.length; i++) {
      const z = this.zones[i];
      const u = z.type > 0 ? s - z.s : z.s - s;
      // rechts der Winkelhalbierenden zur Rampe (mit Platz für Kronen und Häuser) liegt das Gebiet der Rampe
      if (u >= 0 && u < TERRITORY && x > (AB_EDGE + VIS.rampe.aL + rampR(u)) / 2 - 8) return true;
    }
    return false;
  }
  /** true, wenn im Stück [s0, s1] keine Brücken, Schilderbrücken oder Wände stehen dürfen. */
  sceneryNoCross(s0, s1) {
    const v = this.view;
    if (!v || s1 > v.s1 - 60 || s0 < v.s0 + 60) return true;
    for (let i = 0; i < this.boards.length; i++) if (this.boards[i] > s0 && this.boards[i] < s1) return true;
    for (let i = 0; i < this.zones.length; i++) {
      const z = this.zones[i];
      const a = z.type > 0 ? z.s - 400 : z.s - 700;
      const b = z.type > 0 ? z.s + 700 : z.s + 400;
      if (s1 > a && s0 < b) return true;
    }
    return false;
  }

  /**
   * Texte einer Schilderbrücke der Szenerie bei sSign: eine Entfernungstafel aus der Fahrt (drei bis vier Orte, zwei
   * je Tafel) oder null (dann steht dort keine: zu wenige Orte, oder die Entfernungstafel am Rand ist nah).
   */
  gantryTexts(sSign) {
    const v = this.view;
    if (!v) return null;
    const sec = v.secs.find((c) => sSign >= c.s0 && sSign < c.s1);
    if (!sec || Math.abs(sSign - tableS(sec)) < 300) return null;
    const rows = tableAt(v.secs, sSign, 4);
    if (rows.length < 3) return null;
    const line = (r) => ({ left: r.name, right: r.km + ' km' });
    return { a: rows.slice(0, 2).map(line), b: rows.slice(2).map(line) };
  }

  /** Schilder-Log (COMMON.md 9): Tafeln im Sichtbereich wie signplan, dazu die Schilderbrücken der Szenerie. */
  signsLog() {
    const out = this.signs.list();
    const pool = this.scenery.pools.get('gantry');
    if (pool && this.view) {
      for (const g of pool) {
        const t = g.userData.texts;
        if (!g.userData.active || !t) continue;
        const texts = [...t.a, ...t.b].map((r) => r.left + ' ' + r.right);
        out.push({ kind: 'tafel', s: g.userData.sSign, x: 0, side: 0, frame: this.view.frame, texts, built: true });
      }
    }
    out.sort((a, b) => a.s - b.s);
    return out;
  }

  // --- Auskunft ------------------------------------------------------------------------------------------------
  /** Grenzen, Spuren und Tempo für die nächste Bewegung des Spielers (siehe plan.js limitsFor, Halt am Ziel). */
  limitsFor(out) {
    return limitsFor(this.trip, out, this.arrival.stop(this.trip));
  }

  /**
   * Brunnenplatz einer Ortsdurchfahrt (Standard: Navi-Ziel bzw. die gerade erreichte Ankunft) für das Spiel:
   * {place, sec, s, x, r, heading, stop: {s, x}, object (der Brunnen, falls gebaut), world: {x, y, z, yaw}} oder null.
   * world: Lage des Brunnens im Bild (Kameraraum der Welt vor der Krümmung, wie alle Rahmen); yaw: Drehung um y, mit
   * der seine Vorderseite (+z) zum haltenden Wagen zeigt. Gilt für dieses Bild (die Welt bewegt sich mit s).
   */
  square(sec = null) {
    const T = this.trip;
    if (!sec) sec = this.arrival.pending ? this.arrival.pending.sec : this.arrival.held ? this.arrival.held.sec : null;
    if (!sec && T.target >= 0) for (const c of T.cur.sections) if (c.kind === 'stadt' && c.place === T.target && !c.spotDone && c.s1 > T.s) { sec = c; break; }
    const sq = sec ? squareOf(sec) : null;
    if (!sq) return null;
    let object = null;
    for (const p of this.pieces.values()) if (p.sec === sec && p.fountain) object = p.fountain;
    const sh = this.shear.get(sec.frame);
    const d = sq.s - this.s;
    const h = sq.heading;
    const world = sh ? { x: sq.x + sh.a + sh.b * d, y: ISLAND_H, z: -d, yaw: Math.atan2(Math.sin(h) - sh.b * Math.cos(h), Math.cos(h)) } : null;
    return { place: sec.place, sec, s: sq.s, x: sq.x, r: sq.r, heading: sq.heading, stop: { s: sq.stop, x: J.L0 }, object, world };
  }

  /**
   * Der Ort einer Ortsdurchfahrt aus dem Stadtbaukasten (Standard: der Abschnitt des Wagens, sonst der nächste Ort
   * voraus) für Navi-Karte und Brunnen-Szene, siehe Towns.of: { place, sec, plan, group } oder null. plan.layout ist
   * der Lageplan in Ortskoordinaten (x wie die Straße, z = −(s − sec.s0)), plan.fountains die Brunnen ([0]: der
   * Zielbrunnen), group.fountainsInView / watchFountains melden Brunnen im Blick (Weltkoordinaten nach der Krümmung).
   */
  town(sec = null) {
    if (sec) return this.towns.of(sec);
    const all = this.towns.list();
    return all.find((t) => t.sec.s1 > this.s) ?? null;
  }

  info() {
    const T = this.trip;
    const v = this.view;
    return {
      s: Math.round(T.s), x: +T.x.toFixed(2), sec: T.section.kind, place: T.section.place, version: T.version,
      view: v ? { role: v.role, frame: v.frame, s0: v.s0, s1: v.s1 } : null,
      pieces: this.pieces.size, frames: this.frames.byId.size, towns: this.towns.items.size,
    };
  }
}
