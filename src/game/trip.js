// Die Strecke von „Navi ferngesteuert XXL“: aus der Karte (src/map) entsteht beim Fahren ein endloses Band aus
// Abschnitten: Autobahn, Ausfahrt mit Rampe, Zubringer, Ortsdurchfahrt mit Ziel, Ladepark, Landstraße, Auffahrt.
// An jeder Ausfahrt gabelt sich das Band. Der Spieler entscheidet mit der Spur, wohin es geht.
//
// Ladeparks (src/map/parks.js) liegen an Ausfahrten wie ein Ort, der gleich an der Ausfahrt liegt: Rampe, kurzer
// Zubringer, der Abschnitt 'park' (eine Straße wie im Ort, rechts der Ladepark, Haltepunkt an der freien Säule) und
// der Zubringer zurück auf dieselbe Autobahn in derselben Richtung. Dorthin führt jedes Abfahren, das das Navi nicht
// plant, und der geplante Ladestopp (setStop): bis zum Park gilt dann der Weg dorthin, dahinter der zum Ziel.
//
// Diese Datei kennt keine Grafik. Sie sagt der Engine, welche Abschnitte es gerade gibt (paths), in welchem
// Bezugsrahmen sie liegen (frames, shears), welche Spuren und Grenzen gelten (profile) und was das Navi ansagt
// (guidance). Sie läuft auch unter Node (siehe tools/trip-test.mjs).
//
// Koordinaten: s = gefahrene Meter auf dem Band (Meter Straße, wie das Auge sie sieht), x = seitliche Lage in Metern
// (rechts positiv). Auf der Autobahn liegen die vier Spuren bei x = −5,625 … +5,625, der Standstreifen bei
// 7,5 … 10,5. Abseits der Autobahn liegt unsere Spur immer bei x = 9 (J.L0): genau dort, wo auf der Autobahn
// der Verzögerungsstreifen liegt. So muss beim Abfahren nichts umgerechnet werden.
//
// Ein Maß für die Reise (wie beim Euro Truck Simulator 2): Jeder Abschnitt zählt Reisekilometer (kmPerM je Meter
// Straße). Die offene Strecke ist ein gleichmäßiger Zeitraffer – Autobahn und Landstraße tragen die Kartenkilometer
// ihrer Kante über ihre ganze Länge (rund 19 Reisemeter je Meter Straße, siehe edgeLen), ein Zubringer die
// Kartenkilometer zu seinem Ort. Wo der Wagen die offene Strecke verlässt, ist alles echt (J.real, 1:1): Rampen,
// Verbindungsfahrbahnen, Zubringer zurück zur Auffahrt, Ortsdurchfahrten, Terminals. km = Reisekilometer seit dem
// Start (der Kilometerzähler), reach() = Reisekilometer bis zu jeder Stelle voraus – beides aus denselben Abschnitten,
// darum fällt die Entfernung zum Ziel um genau das, was der Zähler steigt. Auch die Uhr des Spiels läuft in diesem
// Maßstab (game.js), also gilt überall: Tacho × Uhr = Reisekilometer.
import {
  nodes, edges, places, K, deEdge, deTo, deFrom, deRev, deKind, deRoad, deTowards, straight, edgeLen, routeTo, routeFrom,
  stateOfNode, transitions, townLen, zubLen, spotIn, visitList, nodeTitle, dePos, turnAngle, PACE,
} from '../map/graph.js';
import { PARK, PARK_STOP_AFTER, PARKS, POST, postName, parkAt, parkZub, parkExcursion, routeToPark, nearestParks } from '../map/parks.js';

/** So weit (Reisekilometer) sucht nextRest geradeaus nach dem nächsten Ladepark. */
const WALK_KM = 1500;
/** nextRest ohne Frage nach dem Akku: jeder Park gilt als erreichbar. */
const ALL = () => true;
/** Schildtexte je Gabelung für nextExit (sie hängen nur an der Karte, darum gemerkt). */
const EXIT_TITLE = new WeakMap();
/** Routen zu Ladeparks für detour und pastTarget (sie hängen nur an der Karte, darum gemerkt). */
const PARK_ROUTES = new Map();
function parkRoute(pk) {
  let pol = PARK_ROUTES.get(pk);
  if (!pol) {
    if (PARK_ROUTES.size >= 48) PARK_ROUTES.clear();
    PARK_ROUTES.set(pk, (pol = routeToPark(pk, true)));
  }
  return pol;
}

/** Maße der Knotenpunkte in Metern. */
export const J = {
  L0: 9.0, // Mitte unserer Spur abseits der Autobahn = Mitte des Verzögerungsstreifens
  laneEdge: 7.5, // rechter Rand der rechten Autobahnspur: wer an der Gabelung weiter rechts ist, fährt ab
  shoulderEdge: 10.5, // äußerer Rand des Standstreifens
  kappa: 1 / 250, // Krümmung, mit der die Rampe von der Autobahn wegläuft
  cap: 87, // nach so vielen Metern läuft die Rampe gerade weiter (Winkel dann BETA)
  decel: 250, // Länge des Verzögerungsstreifens vor der Gabelung
  accel: 250, // Länge des Beschleunigungsstreifens nach dem Einfädelpunkt
  ramp: 250, // Rampe nach der Gabelung (die ersten cap Meter sind der Bogen)
  conn: 1650, // Verbindungsfahrbahn zwischen zwei Autobahnen (zwei Spuren in unserer Richtung); so lang, dass der
  // Einfädelpunkt beim Verschwinden der alten Autobahn noch im Dunst liegt (ramp + conn + auf = hide + show)
  auf: 250, // Auffahrt (die letzten cap Meter sind der Bogen zur Autobahn)
  back: 1850, // Zubringer vom Ort zur Auffahrt: in seinem ersten Waldstück erscheint die nächste Autobahn
  feed: 350, // kurzer Zubringer (zum Terminal, am Start)
  term: 220, // Terminal von Fähre, Autozug und Luftfracht
  termOut: 150,
  horizon: 1600, // so weit voraus wird die Strecke festgelegt
  behind: 400, // so weit zurück bleibt sie bestehen
  hide: 450, // so weit hinter der Gabelung verschwindet die verlassene Autobahn (samt ihren alten Abzweigen)
  show: 1700, // so weit vor dem Einfädelpunkt erscheint die nächste Autobahn: der Punkt selbst liegt dann noch im Dunst
  // Beides geschieht in einem Waldstück, das den Blick zur Seite verdeckt. Es reicht so weit vor und hinter die Stelle:
  curtainBefore: 320,
  curtainAfter: 200,
  ghost: 1200, // so lange bleibt ein nicht genommener Abzweig bestehen
  lock: 500, // ab hier vor der Gabelung ändert ein neues Navi-Ziel den Zweig nicht mehr
  lockNode: 1500, // ab hier vor einem Knoten abseits der Autobahn bleibt die geplante Weiterfahrt bestehen
  taper: 40, // Übergang der Fahrbahngrenzen zwischen zwei Abschnitten
  merge2: 150, // so lang ist der Übergang, wenn die linke Spur der Verbindungsfahrbahn vor der Auffahrt endet
  endCap: 40, // so weit hinter der letzten Ausfahrt reicht die Fahrbahn einer Autobahn, die hier endet
  beginCap: 120, // so weit vor dem Einfädelpunkt beginnt die Fahrbahn einer Autobahn, die hier anfängt
  gore: 70, // Länge der Sperrfläche hinter der Gabelung
  close: 300, // am Autobahnende werden die Spuren auf dieser Länge nach rechts zur Ausfahrt verengt
  real: 0.001, // Reisekilometer je Meter, wo die Straße echt ist (1:1): abseits der offenen Strecke, siehe oben
};
/** Winkel (als Steigung), mit dem Rampe und Autobahn nach dem Bogen auseinanderlaufen. */
export const BETA = J.kappa * J.cap;
/** Seitlicher Abstand der Rampe von der Autobahn, u Meter hinter der Gabelung. */
export function R(u) {
  const v = Math.max(u, 0);
  const q = Math.min(v, J.cap);
  return J.kappa * q * (v - q / 2);
}
/** Steigung von R. */
export function dR(u) {
  return J.kappa * Math.min(Math.max(u, 0), J.cap);
}

/** Länge des Übergangs, auf dem die Fahrbahngrenzen am Ende eines Abschnitts zum nächsten zusammenlaufen. */
export function taperLen(sec, nxt) {
  return sec.profile === 'verbindung' && nxt.profile === 'rampe' ? J.merge2 : J.taper;
}

const AB_LANES = [-5.625, -1.875, 1.875, 5.625];
/** Querschnitte: Grenzen für die Wagenmitte des Spielers, Tempolimit, Spuren (dir −1 = Gegenverkehr). */
export const PROFILES = {
  ab: { name: 'ab', xmin: -7.8, xmax: 10.0, limit: 0, pace: 38, lanes: AB_LANES.map((x) => ({ x, dir: 1, w: 3.75 })) },
  rampe: { name: 'rampe', xmin: 7.55, xmax: 10.45, limit: 80, pace: 21, lanes: [{ x: 9.0, dir: 1, w: 3.5 }] },
  land: { name: 'land', xmin: 4.65, xmax: 10.1, limit: 100, pace: 24, lanes: [{ x: 9.0, dir: 1, w: 3.5 }, { x: 5.5, dir: -1, w: 3.5 }] },
  verbindung: { name: 'verbindung', xmin: 4.65, xmax: 10.1, limit: 100, pace: 28, lanes: [{ x: 9.0, dir: 1, w: 3.5 }, { x: 5.5, dir: 1, w: 3.5 }] },
  stadt: { name: 'stadt', xmin: 5.0, xmax: 9.9, limit: 50, pace: 13, lanes: [{ x: 9.0, dir: 1, w: 3.25 }, { x: 5.75, dir: -1, w: 3.25 }] },
};
const PROFILE_OF = { ab: 'ab', ramp: 'rampe', conn: 'verbindung', auf: 'rampe', zub: 'land', land: 'land', stadt: 'stadt', term: 'stadt', park: 'stadt' };
const lerp = (a, b, t) => a + (b - a) * Math.min(Math.max(t, 0), 1);

let uid = 0;

/** Ein zusammenhängender Weg aus Abschnitten (der eigene, ein Abzweig oder ein zurückgelassener). */
class Path {
  constructor(s0, frame) {
    this.id = ++uid;
    this.s0 = s0;
    this.s1 = s0;
    this.frame = frame; // Rahmen am Ende des Wegs
    this.sections = [];
    this.frontier = null; // wie es am Ende weitergeht
    this.sig = '';
  }
  at(s) {
    const L = this.sections;
    for (let i = L.length - 1; i >= 0; i--) if (s >= L[i].s0) return L[i];
    return L[0];
  }
}

// Routen zu gedachten Zielen (Trip.whatIf): Ort und Straßen-Schalter → Routenplan
const AS_IF = new Map();

export class Trip {
  /**
   * @param {{start?: number, rng?: () => number}} opts start: Knoten, in dessen Ort die Fahrt beginnt
   */
  constructor(opts = {}) {
    this.rng = opts.rng || Math.random;
    this.reset(opts.start);
  }

  reset(startNode) {
    if (startNode === undefined || startNode < 0) startNode = nodes.findIndex((n) => n.id === 'Erlensee');
    this.frames = new Map(); // id → {id, kind, links}
    this.links = []; // {id, type: 'exit'|'merge', a: Autobahnrahmen, b: Rahmen abseits, s}
    this.s = 0;
    this.far = 0; // weitester Punkt der Fahrt (update zählt Reisekilometer nur dahinter)
    this.x = J.L0;
    this.km = 0; // gefahrene Reisekilometer
    this.target = -1;
    this.stop = -1; // geplanter Ladestopp (Index in PARKS) oder −1, siehe setStop
    this.post = -1; // geplanter Ladestopp an der Ladesäule eines Orts auf dem Weg (Index in places) oder −1, siehe setPost
    this.policy = null; // Routenplan für die Entscheidungen: zum Ziel, bei geplantem Ladestopp erst zum Park (then: danach)
    this.planned = null; // der geplante Weg zum Ziel (siehe plan)
    this.ghosts = []; // {path, from, until, link}
    this.visited = []; // erreichte Ziele
    this.events = [];
    this.version = 0; // zählt hoch, wenn sich an den Wegen etwas ändert
    // Start mitten im Ort: 0 liegt am Startpunkt (bei Erlensee der Supercharger)
    const nd = nodes[startNode];
    const frame = this.newFrame('off');
    const path = new Path(-300, frame);
    this.cur = path;
    const pl = nd.places.length ? nd.places[0].place : -1;
    this.home = pl; // der Ort, in dem die Fahrt begonnen hat (−1: keiner)
    const len = pl >= 0 ? townLen(places[pl].pop) : 300;
    this.add(path, 'stadt', Math.max(len, 500), { node: startNode, place: pl, start: true, spotS: 0 });
    this.add(path, 'zub', J.feed, { node: startNode, place: pl, back: true });
    path.frontier = { t: 'node', n: startNode, via: -1 };
    this.country = nd.cc;
    this.extendAll();
  }

  // --- Rahmen ---------------------------------------------------------------------------
  newFrame(kind) {
    const f = { id: ++uid, kind };
    this.frames.set(f.id, f);
    return f;
  }
  newLink(type, a, b, s) {
    const l = { id: ++uid, type, a, b, s };
    this.links.push(l);
    return l;
  }
  /** Versatz zwischen den Rahmen eines Knotenpunkts: x_Autobahn = x_abseits + off. slope = Ableitung nach s. */
  static offset(link, s) {
    if (link.type === 'exit') return { off: R(s - link.s), slope: dR(s - link.s) };
    return { off: R(link.s - s), slope: -dR(link.s - s) };
  }
  /** Derselbe Versatz, aber als Gerade über den Bogen hinaus verlängert (so hängen die beiden Rahmen zusammen). */
  static offsetLin(link, s) {
    if (link.type === 'exit') return { off: BETA * (s - link.s - J.cap / 2), slope: BETA };
    return { off: BETA * (link.s - s - J.cap / 2), slope: -BETA };
  }
  /** Liegt s im Bogen des Knotenpunkts? Dort ist die Fahrbahn im Rahmen der Autobahn gebaut. */
  static inCurve(link, s) {
    return link.type === 'exit' ? s >= link.s && s < link.s + J.cap : s > link.s - J.cap && s <= link.s;
  }

  // --- Abschnitte bauen -----------------------------------------------------------------
  add(path, kind, len, extra = {}) {
    const prev = path.sections[path.sections.length - 1];
    const sec = {
      id: ++uid,
      path: path.id,
      kind,
      profile: PROFILE_OF[kind],
      s0: path.s1,
      s1: path.s1 + len,
      len,
      frame: path.frame.id,
      node: -1,
      de: -1,
      place: -1,
      fork: null, // Gabelung am Ende (nur Autobahn)
      link: null, // Knotenpunkt, dessen Bogen in diesem Abschnitt liegt
      kmPerM: J.real,
      ...extra,
    };
    path.sections.push(sec);
    path.s1 = sec.s1;
    return sec;
  }

  /** Autobahnabschnitt für eine gerichtete Kante. merge: wir kommen über eine Auffahrt. */
  addAb(path, de, merge = null) {
    const e = deEdge(de);
    const len = edgeLen(e);
    // begins: die Autobahn fängt an diesem Knoten erst an (in Gegenrichtung endet sie hier)
    const sec = this.add(path, 'ab', len, { de, node: deTo(de), kmPerM: e.km / len, merge, begins: !!merge && straight(deRev(de)) < 0 });
    this.border(sec);
    const st = straight(de);
    const fork = {
      id: ++uid,
      sec,
      de,
      node: deTo(de),
      s: sec.s1, // hier fällt die Entscheidung
      stay: st, // gerichtete Kante geradeaus oder −1 (Autobahnende: alle fahren ab)
      forced: st < 0,
      branch: null,
      link: null,
      frameB: null,
      taken: null,
    };
    sec.fork = fork;
    path.frontier = { t: 'fork', fork };
    return sec;
  }

  /** Liegt auf dem Abschnitt eine Landesgrenze? Dann steht sie in der Mitte (borderS, borderTo). */
  border(sec) {
    const a = nodes[deFrom(sec.de)].cc;
    const b = nodes[deTo(sec.de)].cc;
    if (a !== b) {
      sec.borderS = sec.s0 + Math.round(sec.len / 2);
      sec.borderFrom = a;
      sec.borderTo = b;
    }
    return sec;
  }

  /** Was macht die Ausfahrt an dieser Gabelung, wenn man sie jetzt nimmt? */
  planExit(fork) {
    const nd = nodes[fork.node];
    const pol = this.policy;
    // ein Ladepark an der Ausfahrt: dorthin führt der geplante Ladestopp und jedes Abfahren, das das Navi nicht plant
    const pk = parkAt(fork.node);
    if (pk >= 0 && ((pol && pol.park === pk) || this.planFor(fork) !== 'exit')) return { visits: [], park: pk, sig: 'p' + pk };
    const here = pol && pol.place >= 0 && places[pol.place].node === fork.node;
    let visits = [];
    if (here) visits = this.visitList(fork.node, pol.place);
    else if (this.planFor(fork) !== 'exit' && nd.places.length) visits = [nd.places[0].place];
    return { visits, sig: 'v' + visits.join(',') + (visits.length ? '' : ':' + this.pickLeave(fork.node, fork.de).key) };
  }
  /** Orte, die auf dem Abstecher zum Ziel durchfahren werden: erst der Ort an der Ausfahrt, dann das Ziel. */
  visitList(node, target) {
    return visitList(node, target);
  }
  /** Navi-Empfehlung an einer Gabelung: 'exit', 'stay' oder null (kein Ziel). */
  planFor(fork) {
    if (fork.forced) return 'exit';
    const pol = this.policy;
    if (!pol) return null;
    const stayCost = edges[fork.stay >> 1].km + pol.cost[fork.stay];
    const exitCost = 1 + pol.cost[stateOfNode(fork.node)];
    return exitCost < stayCost ? 'exit' : 'stay';
  }

  /** Zweig einer Gabelung anlegen (Rampe, dann je nach Plan Orte oder Verbindungsrampe). */
  buildBranch(fork) {
    const frameA = this.frames.get(fork.sec.frame);
    const frameB = this.newFrame('off');
    const link = this.newLink('exit', frameA, frameB, fork.s);
    fork.link = link;
    fork.frameB = frameB;
    const path = new Path(fork.s, frameB);
    const plan = this.planExit(fork);
    path.sig = plan.sig;
    path.fork = fork;
    this.add(path, 'ramp', J.ramp, { node: fork.node, link });
    if (plan.park >= 0) this.addPark(path, fork.node, plan.park, true);
    else if (plan.visits.length) this.addVisits(path, fork.node, plan.visits, 0);
    else this.add(path, 'conn', J.conn, { node: fork.node });
    path.frontier = { t: 'node', n: fork.node, via: fork.de };
    fork.branch = path;
    this.version++;
    return path;
  }

  /**
   * Zubringer und Ortsdurchfahrten für eine Liste von Orten, danach der Zubringer zurück. Der Zubringer trägt die
   * Kartenkilometer zu seinem Ort über seine Länge; liegt der Ort gleich an der Ausfahrt, ist er echte Straße (1:1,
   * wie graph.js feederKm – nie zählt ein Meter Straße weniger als einen Meter Reise).
   */
  addVisits(path, node, visits, fromKm) {
    let km = fromKm;
    for (const pi of visits) {
      const p = places[pi];
      const far = Math.max(p.zubKm - km, 0);
      const zl = zubLen(far);
      this.add(path, 'zub', zl, { node, place: pi, kmPerM: far * 1000 > zl ? far / zl : J.real });
      const tl = townLen(p.pop);
      const town = this.add(path, 'stadt', tl, { node, place: pi });
      town.spotS = town.s0 + spotIn(tl);
      town.postS = town.s0 + POST.halt - PARK_STOP_AFTER;
      km = p.zubKm;
    }
    this.add(path, 'zub', J.back, { node, place: visits[visits.length - 1], back: true });
  }

  /**
   * Ladepark pk an der Ausfahrt node: Zubringer (echte Straße, eigener Mindestwert), der Park mit dem Haltepunkt spotS
   * vor der freien Heldenbucht (PARK.halt − PARK_STOP_AFTER: dort meldet update 'park', der Wagen hält kurz dahinter),
   * dann der Zubringer zurück. short: gleich hinter der Rampe einer Ausfahrt – dann ist er so lang, dass die nächste
   * Autobahn dort erscheint, wo die verlassene verschwindet (J.ramp + Zubringer + Park + zurück + J.auf = J.hide +
   * J.show, wie auf einer Verbindungsfahrbahn); sonst J.back wie hinter jedem Ort.
   */
  addPark(path, node, pk, short) {
    this.add(path, 'zub', parkZub(), { node, park: pk });
    const sec = this.add(path, 'park', PARK.len, { node, park: pk });
    sec.spotS = sec.s0 + PARK.halt - PARK_STOP_AFTER;
    this.add(path, 'zub', short ? PARK.back : J.back, { node, park: pk, back: true });
  }

  /** Wahl der Weiterfahrt an einem Knoten abseits der Autobahn. */
  pickLeave(n, via) {
    const pol = this.policy;
    const st = stateOfNode(n);
    if (pol && pol.goal === st) return { goal: true, key: 'goal' };
    let best = null;
    if (pol && isFinite(pol.cost[st])) {
      let bc = Infinity;
      for (const t of transitions(st)) {
        // ein Ziel nur über Straßen (setTarget mit road): an keinem Knoten lockt eine Überfahrt
        if (pol.road && t.type !== 'enter') continue;
        const c = t.cost + pol.cost[t.to];
        if (c < bc) {
          bc = c;
          best = t;
        }
      }
    }
    if (!best) {
      // kein Ziel: möglichst in der alten Richtung weiter, sonst irgendwie weg, zuletzt per Fähre oder Flug
      const ts = transitions(st);
      const rev = via >= 0 ? deRev(via) : -1;
      const viaKind = via >= 0 ? deKind(via) : 'ab';
      const str = via >= 0 ? straight(via) : -1;
      const rank = (t) => {
        if (t.type !== 'enter') return 50;
        if (t.de === str) return 0;
        if (t.de === rev) return 20;
        return (deKind(t.de) === viaKind ? 5 : 10) + Math.abs(turnAngle(via >= 0 ? via : t.de, t.de)) / 180;
      };
      best = ts.slice().sort((a, b) => rank(a) - rank(b))[0];
    }
    return { t: best, key: best.type + best.de };
  }

  /** Vom Knoten weg: Auffahrt auf eine Autobahn, Landstraße, Terminal oder Abstecher zum Ziel am selben Knoten. */
  leave(path, n, via) {
    const pick = this.pickLeave(n, via);
    const mark = path.sections.length;
    const frame = path.frame;
    this.leave2(path, n, via, pick);
    const first = path.sections[mark];
    if (first) first.leave = { n, via, key: pick.key, frame };
  }
  leave2(path, n, via, pick) {
    if (pick.goal && this.policy.park >= 0) {
      // der geplante Ladestopp liegt an diesem Knoten: aus dem Park heraus geht es auf dem Weg zum Ziel weiter
      const pol = this.policy;
      const last = path.sections[path.sections.length - 1];
      if (last && last.park === pol.park && last.kind !== 'ab') {
        this.policy = pol.then;
        this.leave2(path, n, via, this.pickLeave(n, via));
        this.policy = pol;
        return;
      }
      this.addPark(path, n, pol.park, false);
      path.frontier = { t: 'node', n, via };
      return;
    }
    if (pick.goal) {
      // das Ziel liegt an diesem Knoten und wurde noch nicht angefahren
      const pi = this.policy.place;
      const last = path.sections[path.sections.length - 1];
      if (last && last.place === pi && last.kind !== 'ab') {
        // wir kommen gerade von dort: ohne Ziel weiterfahren
        const saved = this.policy;
        this.policy = null;
        this.leave2(path, n, via, this.pickLeave(n, via));
        this.policy = saved;
        return;
      }
      this.addVisits(path, n, [pi], 0);
      path.frontier = { t: 'node', n, via };
      return;
    }
    const t = pick.t;
    const de = t.de;
    const kind = deKind(de);
    if (kind === 'ab') {
      const last = path.sections[path.sections.length - 1];
      // vor jeder Auffahrt liegt eine Verbindungsfahrbahn oder ein langer Zubringer (siehe J.back)
      if (!last || !(last.kind === 'conn' || (last.kind === 'zub' && last.back))) this.add(path, 'zub', J.back, { node: n, place: last ? last.place : -1, back: true });
      const frameA = this.newFrame('ab');
      const sM = path.s1 + J.auf;
      const link = this.newLink('merge', frameA, path.frame, sM);
      this.add(path, 'auf', J.auf, { node: n, de, link });
      path.frame = frameA;
      this.addAb(path, de, link);
    } else if (kind === 'land') {
      this.addLand(path, de);
    } else {
      // Fähre, Autozug, Luftfracht: Zubringer zum Terminal, Überfahrt, drüben vom Terminal weg
      const m = deTo(de);
      this.add(path, 'zub', J.feed, { node: n, transitTo: m });
      const term = this.add(path, 'term', J.term, { node: n, de, transit: kind, transitTo: m });
      term.spotS = term.s0 + Math.round(J.term * 0.7);
      this.add(path, 'term', J.termOut, { node: m, de, transit: kind, arrival: true });
      this.add(path, 'zub', J.back, { node: m, back: true });
      path.frontier = { t: 'node', n: m, via: de };
    }
  }

  /** Landstraße bis zum nächsten Knoten, dort gleich die Ortsdurchfahrt. */
  addLand(path, de) {
    const e = deEdge(de);
    const len = edgeLen(e);
    const h = deTo(de);
    this.border(this.add(path, 'land', len, { de, node: h, kmPerM: e.km / len }));
    const town = nodes[h].places.find((p) => p.zubKm < 1.5);
    if (town) {
      const tl = townLen(places[town.place].pop);
      const sec = this.add(path, 'stadt', tl, { node: h, place: town.place, inline: true });
      sec.spotS = sec.s0 + spotIn(tl);
      sec.postS = sec.s0 + POST.halt - PARK_STOP_AFTER;
    }
    path.frontier = { t: 'node', n: h, via: de };
  }

  /** Einen Weg bis zum Horizont verlängern. */
  extend(path, upTo) {
    let guard = 0;
    while (path.s1 < upTo && guard++ < 50) {
      const f = path.frontier;
      if (!f) break;
      if (f.t === 'fork') {
        if (f.fork.forced) break; // weiter geht es nur über den Zweig
        this.addAb(path, f.fork.stay);
        const sec = path.sections[path.sections.length - 1];
        sec.afterFork = f.fork;
      } else if (f.t === 'node') {
        this.leave(path, f.n, f.via);
      }
      this.version++;
    }
  }

  /** Alle Wege auf Stand bringen: eigener Weg, Zweige der kommenden Gabelungen. */
  extendAll() {
    const upTo = this.s + J.horizon;
    this.extend(this.cur, upTo);
    for (const sec of this.cur.sections) {
      const fork = sec.fork;
      if (!fork || fork.taken || fork.s > upTo) continue;
      if (!fork.branch) this.buildBranch(fork);
      this.extend(fork.branch, upTo);
    }
  }

  // --- Navi-Ziel ------------------------------------------------------------------------
  /**
   * Neues Navi-Ziel (Index in places) oder −1. Zweige vor uns werden neu geplant, wenn sie noch weit genug weg sind.
   * road: der Weg dorthin führt nur über Straßen, nie über Fähre, Autozug oder Luftfracht (für Ziele, auf die im
   * Spiel geboten wird, solange die Welt keine Terminals baut; siehe distances).
   */
  setTarget(placeIdx, road = false) {
    this.target = placeIdx;
    const T = placeIdx >= 0 ? routeTo(placeIdx, road) : null;
    this.policy = this.stop >= 0 ? { ...this.stopRoute, then: T } : T;
    this.rePlan();
    // (eine geplante Ladesäule, deren Ort nicht mehr auf dem neuen Weg liegt, entfällt)
    if (this.post >= 0 && !this.restsAhead(1).some((r) => r.post === this.post)) this.setPost(-1);
  }
  /**
   * Ladestopp planen: pk (Index in PARKS) oder −1 (aufheben). Bis zum Halt im Park gilt der Weg dorthin, dahinter der
   * Weg zum Ziel (policy.then); plan() und reach() rechnen über den Park. Zweige vor uns werden neu geplant wie bei
   * setTarget. Am Haltepunkt jedes Parks endet der Stopp (update: 'park'); wer an der Ausfahrt des geplanten Parks
   * vorbeifährt, verliert ihn (Ereignis 'fork' mit stop).
   */
  setStop(pk) {
    const T = this.stop >= 0 && this.policy ? this.policy.then : this.policy;
    if (pk >= 0) this.post = -1;
    this.stop = pk;
    this.stopRoute = pk >= 0 ? routeToPark(pk, true) : null;
    this.policy = pk >= 0 ? { ...this.stopRoute, then: T } : T;
    this.rePlan();
    // das Navi zeichnet die Route neu, auch wenn kein Zweig neu geplant werden musste
    this.version++;
  }
  /**
   * Ladestopp an der Ladesäule eines Orts auf dem Weg planen: place (Index in places) oder −1 (aufheben). Der Weg bleibt,
   * wie er ist (der Ort liegt auf ihm); an ihrem Haltepunkt meldet update 'post', der Wagen hält dort und lädt wie im
   * Park. Ein geplanter Park entfällt dafür: es gibt immer nur einen geplanten Stopp.
   */
  setPost(place) {
    if (place >= 0 && this.stop >= 0) this.setStop(-1);
    this.post = place;
    // das Navi zeichnet den Halt neu
    this.version++;
  }
  /** Nach einem neuen Ziel oder Ladestopp: Weiterfahrten und Zweige vor uns, die noch weit genug weg sind, neu planen. */
  rePlan() {
    this.replan(this.cur);
    for (const sec of this.cur.sections) {
      const fork = sec.fork;
      if (!fork || fork.taken || !fork.branch) continue;
      if (fork.s - this.s < J.lock) continue;
      if (this.planExit(fork).sig !== fork.branch.sig) {
        this.dropPath(fork.branch, 0);
        this.dropLink(fork.link);
        fork.branch = null;
        this.version++;
      } else this.replan(fork.branch);
    }
    this.extendAll();
  }
  /** Schon festgelegte Weiterfahrten, die nicht mehr zum Ziel passen und noch weit genug weg sind, wieder aufheben. */
  replan(path) {
    const L = path.sections;
    for (let i = 0; i < L.length; i++) {
      const lv = L[i].leave;
      if (!lv || L[i].s0 - this.s < J.lockNode) continue;
      if (this.pickLeave(lv.n, lv.via).key === lv.key) continue;
      this.dropPath(path, i);
      path.s1 = L[i].s0;
      path.frame = lv.frame;
      path.frontier = { t: 'node', n: lv.n, via: lv.via };
      L.length = i;
      this.version++;
      return;
    }
  }
  /** Rahmen und Knotenpunkte der Abschnitte ab Index i freigeben. */
  dropPath(path, i) {
    for (let k = i; k < path.sections.length; k++) {
      const c = path.sections[k];
      if (c.link && c.link.type === 'merge') this.dropLink(c.link);
      if (c.fork && c.fork.link) this.dropLink(c.fork.link);
    }
  }
  dropLink(link) {
    const i = this.links.indexOf(link);
    if (i >= 0) this.links.splice(i, 1);
  }

  /** Zustand für die Routensuche: wo sind wir gerade? */
  state() {
    const sec = this.section;
    if (sec.kind === 'ab' || sec.kind === 'land') return sec.de;
    if (sec.kind === 'auf') return sec.de;
    return stateOfNode(sec.node);
  }
  /** Entfernungen von hier zu allen Orten (für die Auswahl neuer Ziele). road: nur über Straßen (sonst Infinity). */
  distances(road = false) {
    return routeFrom(this.state(), road);
  }

  // --- Fahren ---------------------------------------------------------------------------
  get section() {
    return this.cur.at(this.s);
  }

  /**
   * Einmal pro Bild: Spielerposition melden. Liefert die Ereignisse dieses Schritts.
   * fork {fork, taken, planned, wrong} · enter {sec, prev} · arrive {place, sec} · pass {place, sec} ·
   * transit {kind, from, to, sec} · merge {sec} · country {from, to}
   */
  update(s, x) {
    // Reisekilometer gibt es nur für neue Straße: jenseits des weitesten Punkts (far), nicht rückwärts und nicht für
    // Meter, die der Wagen nach dem Rückwärtsfahren noch einmal fährt
    const far = Math.max(this.s, this.far);
    this.far = Math.max(far, s);
    const ev = (this.events = []);
    const s0 = this.s;
    let prev = this.cur.at(s0);
    this.x = x;
    // Kilometerzähler und Abschnittswechsel
    let guard = 0;
    while (guard++ < 8) {
      const sec = this.cur.at(this.s);
      const end = Math.min(s, sec.s1);
      this.km += Math.max(0, end - Math.max(this.s, far)) * sec.kmPerM;
      this.s = end;
      // an der Ladesäule des Orts: geplant, hält der Wagen dort (plan.js Arrival) und lädt
      if (sec.postS !== undefined && !sec.postDone && s0 < sec.postS && this.s >= sec.postS) {
        sec.postDone = true;
        if (sec.place === this.post) {
          ev.push({ type: 'post', place: sec.place, sec });
          this.setPost(-1);
        }
      }
      // Ziel- oder Ortsmitte passiert?
      if (sec.spotS !== undefined && !sec.spotDone && s0 < sec.spotS && this.s >= sec.spotS) {
        sec.spotDone = true;
        if (sec.kind === 'park') {
          // geladen wird an jedem Park: ein geplanter Ladestopp ist damit erledigt
          ev.push({ type: 'park', park: sec.park, sec, planned: sec.park === this.stop });
          if (this.stop >= 0) this.setStop(-1);
          if (this.post >= 0) this.setPost(-1);
        } else if (sec.kind === 'stadt') {
          if (sec.place >= 0 && sec.place === this.target) {
            this.visited.push(sec.place);
            ev.push({ type: 'arrive', place: sec.place, sec });
            this.setTarget(-1);
          } else if (sec.place >= 0) ev.push({ type: 'pass', place: sec.place, sec });
        } else if (sec.kind === 'term') {
          ev.push({ type: 'transit', kind: sec.transit, from: sec.node, to: sec.transitTo, sec });
        }
      }
      if (sec.borderS !== undefined && !sec.borderDone && this.s >= sec.borderS) {
        sec.borderDone = true;
        ev.push({ type: 'country', from: sec.borderFrom, to: sec.borderTo, sec });
        this.country = sec.borderTo;
      }
      if (s < sec.s1) break;
      // Ende des Abschnitts: Gabelung?
      if (sec.fork && !sec.fork.taken) this.decide(sec.fork, x, ev);
      const nxt = this.cur.at(sec.s1);
      if (nxt === sec) {
        // der Weg ist zu Ende (sollte nicht vorkommen): verlängern
        this.extend(this.cur, this.s + J.horizon);
        if (this.cur.at(sec.s1) === sec) break;
        continue;
      }
      ev.push({ type: 'enter', sec: nxt, prev: sec });
      if (nxt.kind === 'ab' && nxt.merge) ev.push({ type: 'merge', sec: nxt });
      if (nxt.kind === 'term' && nxt.arrival && nodes[nxt.node].cc !== this.country) {
        ev.push({ type: 'country', from: this.country, to: nodes[nxt.node].cc, sec: nxt });
        this.country = nodes[nxt.node].cc;
      }
      prev = sec;
      this.s = sec.s1;
      if (s <= sec.s1) break;
    }
    this.s = s;
    // Aufräumen
    while (this.cur.sections.length > 1 && this.cur.sections[0].s1 < s - J.behind) {
      const old = this.cur.sections.shift();
      if (old.link && old.link.type === 'merge') this.dropLink(old.link);
      this.version++;
    }
    for (let i = this.ghosts.length - 1; i >= 0; i--) {
      const g = this.ghosts[i];
      if (s < g.until) continue;
      // verschwindet die verlassene Autobahn, gehen ihre alten Abzweige mit (alles verdeckt vom Waldstück)
      if (g.fork.taken === 'exit') for (const h of this.ghosts) if (h !== g && h.link.a === g.link.a) h.until = -Infinity;
      this.dropPath(g.path, 0);
      this.dropLink(g.link);
      this.ghosts.splice(i, 1);
      this.version++;
      i = this.ghosts.length;
    }
    this.extendAll();
    if (this.version !== this.gcVersion) this.gc();
    return ev;
  }

  /** Rahmen freigeben, die kein sichtbarer Abschnitt und kein Knotenpunkt mehr braucht. */
  gc() {
    this.gcVersion = this.version;
    const used = new Set();
    for (const { path } of this.paths()) {
      used.add(path.frame.id);
      for (const c of path.sections) used.add(c.frame);
    }
    for (let i = this.links.length - 1; i >= 0; i--) {
      const l = this.links[i];
      if (!used.has(l.a.id) && !used.has(l.b.id)) this.links.splice(i, 1);
    }
    for (const id of this.frames.keys()) if (!used.has(id)) this.frames.delete(id);
  }

  decide(fork, x, ev) {
    const planned = this.planFor(fork);
    const exit = fork.forced || x > J.laneEdge;
    fork.taken = exit ? 'exit' : 'stay';
    if (!fork.branch) this.buildBranch(fork);
    if (exit) {
      // Zweige späterer Gabelungen auf der verlassenen Autobahn braucht niemand mehr
      for (const c of this.cur.sections) {
        const f = c.fork;
        if (f && f !== fork && !f.taken && f.branch) {
          this.dropPath(f.branch, 0);
          this.dropLink(f.link);
          f.branch = null;
        }
      }
      // der bisherige Weg (die Autobahn) bleibt als Geist zurück
      this.ghosts.push({ path: this.cur, from: fork.s, until: fork.s + J.hide, link: fork.link, fork });
      this.cur = fork.branch;
    } else {
      // der nicht genommene Zweig bleibt, bis sein sichtbarer Teil hinter uns liegt (nichts verschwindet im Blickfeld)
      this.ghosts.push({ path: fork.branch, from: fork.s, until: Math.max(fork.s + J.ghost, this.drawnEnd(fork.branch) + 200), link: fork.link, fork });
      this.extend(this.cur, this.s + J.horizon);
    }
    this.version++;
    // an der Ausfahrt des geplanten Ladestopps vorbei: der Stopp entfällt (NOMI schlägt den nächsten Park vor)
    let stop = this.stop >= 0 && parkAt(fork.node) === this.stop;
    if (stop && !exit) this.setStop(-1);
    // (eine geplante Ladesäule liegt nach einem anderen Weg als dem geplanten meist nicht mehr auf ihm: sie entfällt)
    const wrong = planned !== null && planned !== fork.taken;
    if (wrong && this.post >= 0) {
      this.setPost(-1);
      stop = true;
    }
    ev.push({ type: 'fork', fork, taken: fork.taken, planned, wrong, stop });
  }

  // --- Auskunft für die Engine ----------------------------------------------------------
  /** Alle Wege, die gerade zu sehen sein können. role: 'cur' | 'branch' | 'ghost'. */
  paths() {
    const out = [{ path: this.cur, role: 'cur', from: -Infinity }];
    for (const sec of this.cur.sections) {
      const f = sec.fork;
      if (f && !f.taken && f.branch) out.push({ path: f.branch, role: 'branch', from: f.s, fork: f });
    }
    for (const g of this.ghosts) out.push({ path: g.path, role: 'ghost', from: g.from, fork: g.fork });
    return out;
  }

  /**
   * Grenzen, Spuren und Tempolimit an der Stelle s eines Wegs (Standard: der eigene Weg an der Spielerposition).
   * xmin/xmax gelten für die Wagenmitte. decel/accel: der Standstreifen ist hier Verzögerungs- bzw.
   * Beschleunigungsstreifen (zählt als Spur bei x = 9, keine Standstreifen-Strafe).
   */
  profile(s = this.s, path = this.cur) {
    const L = path.sections;
    let i = L.length - 1;
    while (i > 0 && s < L[i].s0) i--;
    const sec = L[i];
    const P = PROFILES[sec.profile];
    let { xmin, xmax } = P;
    const u = s - sec.s0;
    // wird es im nächsten Abschnitt enger, laufen die Grenzen schon auf den letzten Metern zusammen
    const nxt = L[i + 1];
    const tl = nxt ? taperLen(sec, nxt) : 0;
    if (nxt && s > sec.s1 - tl) {
      const Q = PROFILES[nxt.profile];
      const t = (s - (sec.s1 - tl)) / tl;
      if (Q.xmin > xmin) xmin = lerp(xmin, Q.xmin, t);
      if (Q.xmax < xmax) xmax = lerp(xmax, Q.xmax, t);
    }
    let decel = false;
    let accel = false;
    let closing = 0;
    if (sec.kind === 'ab') {
      const f = sec.fork;
      if (f && s >= f.s - J.decel) decel = true;
      if (sec.merge && u < J.accel) accel = true;
      // nach einer Gabelung, an der wir geblieben sind: rechts liegt erst die Sperrfläche
      if (sec.afterFork && sec.afterFork.taken === 'stay' && u < J.gore + 30) xmax = u < J.gore ? 7.9 : lerp(7.9, P.xmax, (u - J.gore) / 30);
      // Autobahnende: Baken drängen alle Spuren nach rechts in die Ausfahrt
      if (f && f.forced && f.s - s < J.close + 20) {
        closing = 1 - Math.min(Math.max((f.s - s - 20) / J.close, 0), 1);
        xmin = lerp(P.xmin, PROFILES.rampe.xmin + 0.05, closing);
      }
    }
    return { sec, kind: sec.kind, name: P.name, xmin, xmax, limit: P.limit, pace: P.pace, lanes: P.lanes, decel, accel, closing };
  }

  /**
   * Wo liegt der Punkt (s, x) eines Abschnitts in der Welt? Im Bogen eines Knotenpunkts liegt er im Rahmen der
   * Autobahn (mit Versatz und Schräglage), sonst im Rahmen des Abschnitts.
   */
  locate(sec, s, x) {
    const l = sec.link;
    if (l && Trip.inCurve(l, s)) {
      const o = Trip.offset(l, s);
      return { frame: l.a.id, x: x + o.off, slope: o.slope };
    }
    return { frame: sec.frame, x, slope: 0 };
  }

  /**
   * Scherung aller Rahmen für die aktuelle Spielerposition: Map Rahmen-ID → {a, b}.
   * Ein Objekt mit Rahmenkoordinate x, das d Meter vor dem Spieler liegt, erscheint bei x + a + b·d.
   * Der eigene Rahmen hat {0, 0}, außer im Bogen eines Knotenpunkts.
   */
  shears() {
    const out = new Map();
    const sec = this.section;
    const s = this.s;
    const l = sec.link;
    if (l && Trip.inCurve(l, s)) {
      const o = Trip.offset(l, s);
      out.set(l.a.id, { a: -o.off, b: -o.slope });
    } else out.set(sec.frame, { a: 0, b: 0 });
    // über die Knotenpunkte auf alle anderen Rahmen übertragen
    let grown = true;
    let guard = 0;
    while (grown && guard++ < 10) {
      grown = false;
      for (const k of this.links) {
        const A = out.get(k.a.id);
        const B = out.get(k.b.id);
        if (A && B) continue;
        if (!A && !B) continue;
        const o = Trip.offsetLin(k, s);
        if (A) out.set(k.b.id, { a: A.a + o.off, b: A.b + o.slope });
        else out.set(k.a.id, { a: B.a - o.off, b: B.b - o.slope });
        grown = true;
      }
    }
    return out;
  }

  /**
   * Ist dieser Abschnitt Teil der sichtbaren Welt? Gilt für alles abseits der Autobahn (die Autobahn selbst zeichnet
   * die Engine nur über autobahnView). Auf dem eigenen Weg erscheint alles hinter einer Auffahrt erst J.show Meter
   * vor dem Einfädelpunkt (dann liegt es im Dunst oder hinter dem Waldstück, siehe curtains). Zweige und
   * zurückgelassene Wege enden vor ihrer Auffahrt: ihre nächste Autobahn wird nie gezeichnet.
   */
  visible(sec, path = this.cur) {
    const L = path.sections;
    const own = path === this.cur;
    for (let i = L.indexOf(sec); i >= 0; i--) {
      const c = L[i];
      if (!own && c.kind === 'auf') return false;
      if (c.kind === 'ab' && c.merge) return own && this.s >= c.merge.s - J.show;
      if (own && c.s1 <= this.s) break;
    }
    return true;
  }

  /** Bis wohin (s) reicht der Teil eines Zweigs, der gezeichnet wird? Er endet vor der Auffahrt. */
  drawnEnd(path) {
    for (const c of path.sections) if (c.kind === 'auf' || (c.kind === 'ab' && c.merge)) return c.s0;
    return path.s1;
  }

  /**
   * Die eine Autobahn, die gerade zu sehen ist, oder null. Mehr als eine gibt es nie: die verlassene verschwindet
   * J.hide Meter hinter der Gabelung, die nächste erscheint J.show Meter vor dem Einfädelpunkt, also frühestens im
   * selben Augenblick.
   * role: 'cur' (wir fahren darauf) · 'ghost' (gerade verlassen) · 'ahead' (wir fahren gleich auf)
   * frame: Rahmen-ID · s0, s1: von wo bis wo ihre Fahrbahn existiert (±Infinity = sie läuft weiter; endlich nur,
   * wo eine Autobahn anfängt oder endet) · secs: ihre bekannten Abschnitte (für Gabelungen, Schilder, Verkehr)
   */
  autobahnView() {
    const span = (path, sec, role) => {
      const secs = path.sections.filter((c) => c.kind === 'ab' && c.frame === sec.frame);
      const first = secs[0];
      const last = secs[secs.length - 1];
      const s0 = first.merge && first.begins ? first.s0 - J.beginCap : -Infinity;
      const s1 = last.fork && last.fork.forced ? last.fork.s + J.endCap : Infinity;
      return { role, frame: sec.frame, s0, s1, secs };
    };
    const cur = this.section;
    if (cur.kind === 'ab') return span(this.cur, cur, 'cur');
    for (const g of this.ghosts) if (g.fork.taken === 'exit') return span(g.path, g.fork.sec, 'ghost');
    for (const c of this.cur.sections) {
      if (c.kind !== 'ab' || !c.merge || c.s0 <= this.s) continue;
      return this.s >= c.s0 - J.show ? span(this.cur, c, 'ahead') : null;
    }
    return null;
  }

  /**
   * Waldstücke, die einen Szenenwechsel verdecken: [{path, s0, s1, why: 'exit' | 'merge'}]. Auf dieser Strecke
   * muss beiderseits der Straße dichter, hoher Wald stehen (kein Durchblick, auch nicht von der Drohnenkamera).
   * 'exit': hinter jeder Ausfahrt (dort verschwindet die verlassene Autobahn) · 'merge': dort erscheint die nächste.
   */
  curtains() {
    const out = [];
    for (const { path } of this.paths()) {
      const f = path.fork;
      if (f && f.branch === path) out.push({ path, s0: f.s + J.hide - J.curtainBefore, s1: f.s + J.hide + J.curtainAfter, why: 'exit' });
      if (path !== this.cur) continue;
      for (const c of path.sections) {
        if (c.kind !== 'ab' || !c.merge) continue;
        const at = c.s0 - J.show;
        if (at <= 0) continue; // die erste Autobahn nach dem Start ist von Anfang an da
        if (f && Math.abs(at - (f.s + J.hide)) < 1) continue; // fällt mit dem Waldstück der Ausfahrt zusammen
        out.push({ path, s0: at - J.curtainBefore, s1: at + J.curtainAfter, why: 'merge' });
      }
    }
    return out;
  }

  /** Abstand zwischen der Mitte unserer Spur abseits der Autobahn und dem Rand des Standstreifens (Keil). */
  static wedge(link, s) {
    return J.L0 + Trip.offset(link, s).off - J.shoulderEdge;
  }

  /** Schildtexte einer Gabelung (park: Name des Ladeparks an dieser Ausfahrt oder null). */
  signs(fork) {
    const nd = nodes[fork.node];
    const exits = [];
    const seen = new Set();
    for (const de of nd.edges) {
      if (de === fork.stay || deKind(de) === 'flug') continue;
      const label = deRoad(de).label;
      const kind = deKind(de);
      if (de === deRev(fork.de)) continue;
      const key = label + '|' + deTowards(de).name;
      if (seen.has(key)) continue;
      seen.add(key);
      exits.push({ road: label, kind, towards: kind === 'ab' || kind === 'land' ? deTowards(de).name : nodes[deTo(de)].name });
    }
    return {
      title: fork.forced ? 'Autobahnende' : nodeTitle(nd),
      name: nd.name,
      kind: nd.kind,
      places: nd.places.map((p) => places[p.place].name),
      exits,
      stay: fork.stay >= 0 ? { road: deRoad(fork.stay).label, towards: deTowards(fork.stay).name } : null,
      airport: nd.edges.some((de) => deKind(de) === 'flug'),
      park: parkAt(fork.node) >= 0 && !fork.forced ? PARKS[parkAt(fork.node)].name : null,
    };
  }

  // --- Der geplante Weg: eine Rechnung für jede Entfernung -----------------------------------------------------------
  /**
   * Der Weg, den das Navi von hier bis zum Ziel plant, Abschnitt für Abschnitt: erst was schon angelegt ist (der eigene
   * Weg, an jeder Gabelung mit Plan 'exit' ihr Zweig), dann was die Fahrt hinter ihrem Horizont anlegen wird – gebaut
   * mit ihren eigenen Regeln (shadow). Darum zählt der Kilometerzähler später genau das, was reach() heute nennt.
   * Ergebnis (dasselbe Objekt, bis sich Wege oder Ziel ändern): {legs, end, done}. legs: [{sec, s0, s1 (Meter auf dem
   * Band, lückenlos; der Zielort endet am Zielpunkt), k (Reisekilometer je Meter), pace (Tempo des Navis, m/s), fork
   * (die Gabelung am Ende, an der der Plan abfährt, sonst null), hop (Kartenkilometer einer Überfahrt davor, sonst
   * 0)}], end: Zielpunkt, done: der Weg reicht bis zum Ziel. Ohne Ziel ist es der eigene Weg, so weit er angelegt ist.
   * Mit geplantem Ladestopp führt der Weg erst durch den Park (bis dorthin gilt der Weg zum Park, dahinter der zum Ziel);
   * ohne Ziel endet er am Haltepunkt des Parks. Ein Schatten mit onward (pastTarget) fährt am Ziel weiter nach diesem Plan.
   */
  plan() {
    const pol0 = this.target >= 0 || this.stop >= 0 ? this.policy : null;
    let P = this.planned;
    if (P && P.version === this.version && P.policy === pol0 && P.target === this.target) return P;
    P = this.planned = { version: this.version, policy: pol0, target: this.target, legs: [], end: this.s, done: false };
    const legs = P.legs;
    let pol = pol0;
    let onward = this.onward;
    const dry = this.shadow();
    const take = (c) => {
      // der Zielort zählt beim ersten Durchfahren, auch vor einem geplanten Ladestopp (dort hält der Wagen am Brunnen,
      // der Stopp bleibt für danach)
      let goal = c.kind === 'stadt' && c.place === this.target && !c.spotDone && c.spotS > this.s;
      if (goal && onward) {
        // (Schatten von pastTarget) durch den Zielort hindurch und weiter zum Park
        pol = onward;
        onward = null;
        dry.policy = pol;
        goal = false;
      }
      if (pol && pol.park >= 0 && c.kind === 'park' && c.park === pol.park && !c.spotDone && c.spotS > this.s) {
        // der Ladestopp: dahinter gilt der Weg zum Ziel (ohne Ziel ist hier Schluss)
        pol = pol.then;
        dry.policy = pol;
        goal = !pol;
      }
      const hop = c.kind === 'term' && c.arrival && c.de >= 0 ? edges[c.de >> 1].km : 0;
      legs.push({ sec: c, s0: c.s0, s1: goal ? c.spotS : c.s1, k: c.kmPerM, pace: PROFILES[c.profile].pace, fork: null, hop });
      P.end = goal ? c.spotS : c.s1;
      return goal;
    };
    let path = this.cur;
    let i = path.sections.indexOf(this.section);
    let own = false; // path gehört dem Schatten und darf wachsen
    for (let guard = 0; guard < 4000; guard++) {
      if (i < path.sections.length) {
        const c = path.sections[i++];
        if (take(c)) {
          P.done = true;
          break;
        }
        const f = c.fork;
        if (f && !f.taken && dry.planFor(f) === 'exit') {
          // der Plan fährt hier ab: weiter auf dem Zweig – dem angelegten oder dem, den die Fahrt hier anlegen wird
          // (whatIf: Einen angelegten Zweig, der nicht zum gedachten Ziel passt, ersetzt setTarget außerhalb der
          // Sperrzone – also zählt dort der, den die Fahrt dann anlegt)
          legs[legs.length - 1].fork = f;
          const br = f.branch && !(this.asIf && f.s - this.s >= J.lock && f.branch.sig !== dry.planExit(f).sig) ? f.branch : null;
          own = !br;
          path = br || dry.buildBranch({ ...f });
          i = 0;
        }
        continue;
      }
      // Ende des Angelegten: so weiter, wie die Fahrt es tun wird (extend) – auf einem eigenen Weg des Schattens
      const fr = path.frontier;
      if (!pol || !fr || !isFinite(pol.cost[fr.t === 'fork' ? fr.fork.de : stateOfNode(fr.n)])) break;
      if (!own) {
        const last = path.sections[path.sections.length - 1];
        const next = new Path(path.s1, path.frame);
        next.sections.push(last); // leave() schaut auf den Abschnitt davor
        next.frontier = fr;
        path = next;
        i = 1;
        own = true;
      }
      if (fr.t === 'fork') dry.addAb(path, fr.fork.stay);
      else dry.leave(path, fr.n, fr.via);
    }
    return P;
  }
  /**
   * Schatten der Fahrt für plan(): baut mit ihren Regeln und ihrem Ziel Abschnitte auf eigenen Wegen, ohne Rahmen,
   * Knotenpunkte oder den Stand der Fahrt anzufassen.
   */
  shadow() {
    const t = Object.create(this);
    t.frames = new Map();
    t.links = [];
    t.version = 0;
    return t;
  }

  /**
   * Die eine Entfernung des Spiels: vom Wagen bis zur Stelle to auf dem geplanten Weg (Meter auf dem Band; ohne Angabe
   * der Zielpunkt). km: Reisekilometer – genau das, was der Kilometerzähler bis dorthin zählen wird · m: Meter Straße ·
   * real: dazwischen liegt nur echte Straße (1:1), dann sind beide dieselbe Strecke und die Anzeigen nennen Meter ·
   * realM: die Meter davon auf echter Straße (der Akku leert sich je Meter Straße, nicht je Reisekilometer) · secs:
   * Fahrzeit im Tempo des Navis in echten Sekunden · clock: dieselbe Fahrt in Sekunden der Uhr (Reisezeit: jede
   * Sekunde zählt im Maßstab ihres Abschnitts). Eine Überfahrt bis dorthin zählt mit ihren Kartenkilometern zu km
   * (gefahren wird sie nicht: der Zähler lässt sie aus). Ohne Ziel oder ohne Weg dorthin ist alles Infinity; eine
   * Stelle auf dem eigenen Weg hat ihre Entfernung auch ohne Ziel.
   */
  reach(to) {
    const P = this.plan();
    if (to === undefined && !P.done) return { km: Infinity, m: Infinity, real: false, realM: Infinity, secs: Infinity, clock: Infinity };
    if (to === undefined) to = P.end;
    const s = this.s;
    let km = 0;
    let secs = 0;
    let clock = 0;
    let real = true;
    let realM = 0;
    for (const L of P.legs) {
      if (L.s1 <= s) continue;
      if (L.s0 >= to) break;
      if (L.hop && L.s0 >= s) {
        km += L.hop;
        secs += PACE.transit;
        real = false;
      }
      const len = Math.min(L.s1, to) - Math.max(L.s0, s);
      const t = len / L.pace;
      km += len * L.k;
      secs += t;
      clock += t * L.k * 1000;
      if (L.k !== J.real) real = false;
      else realM += len;
    }
    return { km, m: Math.max(to - s, 0), real, realM, secs, clock };
  }
  /**
   * Was wäre, wenn das Navi-Ziel jetzt place hieße? Die Entfernung dorthin wie reach() nach setTarget(place, road),
   * dazu wende: Der Weg führt erst zurück (an einer Ausfahrt ab und auf derselben Straße in die Gegenrichtung –
   * „Bitte wenden“). Gerechnet auf einem Schatten: An der Fahrt, ihrem Ziel und ihren Wegen ändert sich nichts.
   * Für die Wahl naher Ziele (WorldNavi.candidates): Nur so zählt mit, was schon festliegt – etwa der Weg aus dem
   * Startort, den die Routensuche über die Karte (distances) nicht kennt.
   */
  whatIf(place, road = false) {
    // (die Route zu einem Ort hängt nur an der Karte: gemerkt, weil dieselben nahen Orte immer wieder gefragt werden)
    const key = place * 2 + (road ? 1 : 0);
    let pol = AS_IF.get(key);
    if (!pol) {
      if (AS_IF.size >= 48) AS_IF.clear();
      AS_IF.set(key, (pol = routeTo(place, road)));
    }
    const t = this.shadow();
    t.asIf = true;
    t.target = place;
    // wie setTarget: ein geplanter Ladestopp bleibt, der Weg führt erst durch den Park
    t.policy = this.stop >= 0 ? { ...this.stopRoute, then: pol } : pol;
    t.planned = null;
    const r = t.reach();
    r.wende = false;
    const legs = t.plan().legs;
    for (let i = 0; i < legs.length && !r.wende; i++) {
      const f = legs[i].fork;
      if (!f) continue;
      // der erste Straßenabschnitt hinter der Ausfahrt: dieselbe Straße zurück?
      for (let k = i + 1; k < legs.length; k++) {
        const c = legs[k].sec;
        if (c.kind !== 'ab' && c.kind !== 'land') continue;
        r.wende = c.de === deRev(f.de);
        break;
      }
    }
    return r;
  }
  /** Reisemeter je Meter Straße unter dem Wagen: der Maßstab, in dem Kilometerzähler und Uhr gerade laufen. */
  get scale() {
    return this.section.kmPerM * 1000;
  }

  /**
   * Die nächste Navi-Ansage. type: 'arrive' (Ziel voraus) · 'stop' (Haltepunkt im Park des Ladestopps voraus, park,
   * oder an der geplanten Ladesäule eines Orts, post; die auch ohne Ziel) · 'exit' (an der nächsten geplanten Gabelung
   * abfahren) ·
   * 'follow' (dem Straßenverlauf folgen) · 'none' (kein Ziel). dist in Metern auf dem Band bis zur Stelle der Ansage,
   * toKm = Reisekilometer bis dorthin; km, m, real = die Entfernung zum Ziel (reach), mins = geschätzte Restfahrzeit,
   * clock = dieselbe in Sekunden der Uhr, then = was nach der Ausfahrt kommt. far: die Ausfahrt liegt hinter dem
   * Horizont der Fahrt (ihre Gabelung gibt es noch nicht).
   */
  guidance() {
    if ((this.target < 0 && this.stop < 0) || !this.policy) {
      // ohne Ziel: nur der Halt an einer geplanten Ladesäule auf dem eigenen Weg
      const sec = this.post >= 0 ? this.cur.sections.find((c) => c.s1 > this.s && c.kind === 'stadt' && c.place === this.post && c.postS !== undefined && !c.postDone) : null;
      if (!sec) return { type: 'none' };
      const r = this.reach(sec.postS);
      return { target: this.target, km: r.km, m: r.m, real: r.real, mins: r.secs / 60, clock: r.clock, type: 'stop', dist: sec.postS - this.s, toKm: r.km, sec, park: -1, post: sec.place };
    }
    const all = this.reach();
    const base = { target: this.target, km: all.km, m: all.m, real: all.real, mins: all.secs / 60, clock: all.clock };
    for (const sec of this.cur.sections) {
      if (sec.s1 <= this.s) continue;
      // im Zweig zum geplanten Ladestopp: der Halt an der freien Säule
      if (sec.kind === 'park' && sec.park === this.stop && !sec.spotDone) return { ...base, type: 'stop', dist: sec.spotS - this.s, toKm: this.reach(sec.spotS).km, sec, park: sec.park, post: -1 };
      // im Ort mit der geplanten Ladesäule: ihr Halt (vor dem Brunnen des Orts)
      if (sec.kind === 'stadt' && this.post >= 0 && sec.place === this.post && sec.postS !== undefined && !sec.postDone) return { ...base, type: 'stop', dist: sec.postS - this.s, toKm: this.reach(sec.postS).km, sec, park: -1, post: sec.place };
      if (sec.kind === 'stadt' && sec.place === this.target && !sec.spotDone) return { ...base, type: 'arrive', dist: sec.spotS - this.s, toKm: all.km, sec };
      const f = sec.fork;
      if (f && !f.taken && this.planFor(f) === 'exit') {
        return { ...base, type: 'exit', dist: f.s - this.s, toKm: this.reach(f.s).km, fork: f, node: f.node, title: f.forced ? 'Autobahnende' : nodeTitle(f.node), then: this.afterExit(f) };
      }
    }
    // weiter voraus: der Route folgen, bis die nächste Ausfahrt kommt (die erste des geplanten Wegs)
    const fr = this.cur.frontier;
    if (fr && fr.t === 'fork') {
      const P = this.plan();
      const L = P.legs.find((q) => q.fork && q.s1 > this.s);
      if (L) {
        const f = L.fork;
        return { ...base, type: 'exit', far: true, dist: f.s - this.s, toKm: this.reach(f.s).km, node: f.node, title: f.forced ? 'Autobahnende' : nodeTitle(f.node), then: this.afterExitAt(f.node, f.de) };
      }
    }
    return { ...base, type: 'follow', dist: this.cur.s1 - this.s };
  }
  /**
   * Die nächste Ausfahrt auf der eigenen Autobahn: die erste Gabelung voraus, ob der Plan dort abfährt oder geradeaus
   * bleibt (das Navi zeigt sie immer, NOMI nennt sie am ersten Vorwegweiser). Nur auf der Autobahn, denn nur sie hat
   * Gabelungen. Ergebnis {fork, dist (Meter Straße bis zur Gabelung), title (wie auf dem Schild: „Ausfahrt Hanau-Nord“,
   * „Frankfurter Kreuz“, „Autobahnende“), name (ohne „Ausfahrt “), kind ('ausfahrt' | 'kreuz' | 'ende'), plan
   * (planFor: 'exit', 'stay', ohne Ziel null), exit (der Plan fährt dort ab), road (die Autobahn geradeaus, am
   * Autobahnende '')} oder null.
   */
  nextExit() {
    if (!this.section || this.section.kind !== 'ab') return null;
    for (const c of this.cur.sections) {
      const f = c.fork;
      if (c.s1 <= this.s || !f || f.taken || f.s <= this.s) continue;
      let t = EXIT_TITLE.get(f);
      if (!t) {
        const title = f.forced ? 'Autobahnende' : nodeTitle(f.node);
        const kind = f.forced ? 'ende' : title.startsWith('Ausfahrt ') ? 'ausfahrt' : 'kreuz';
        t = { title, kind, name: kind === 'ausfahrt' ? title.slice(9) : title, road: f.stay >= 0 ? deRoad(f.stay).label : '' };
        EXIT_TITLE.set(f, t);
      }
      const plan = this.planFor(f);
      return { fork: f, dist: f.s - this.s, title: t.title, name: t.name, kind: t.kind, plan, exit: plan === 'exit', road: t.road };
    }
    return null;
  }
  /** Restkilometer und Restzeit bis zum Ziel ab der Spielerposition (reach bis zum Zielpunkt). */
  stateAhead() {
    return this.reach();
  }
  /**
   * Der nächste Ladeplatz auf dem Weg: der geplante Stopp, sonst die Ladesäule eines Orts, durch den der Weg führt, oder
   * der erste Ladepark an einer Ausfahrt des geplanten Wegs (ohne Ziel: des eigenen Wegs), dahinter geradeaus auf
   * derselben Autobahn (bis WALK_KM) – was zuerst kommt. Ergebnis { park (Index in PARKS, an einer Ladesäule −1), post
   * (Ort der Ladesäule, sonst −1), name, node, m (Meter
   * Straße bis zum Halt an der Säule), realM (die Meter davon auf echter Straße, wie reach), km (Reisekilometer bis
   * dorthin, wie reach und der Kilometerzähler sie zählen), planned (der geplante Stopp), fork (die Gabelung, wenn die
   * Fahrt sie schon angelegt hat) } oder null. fits(r): erreicht der Wagen diesen Park? (das Spiel fragt seinen Akku)
   */
  nextRest(fits = ALL) {
    return this.restsAhead(1, fits)[0] ?? null;
  }
  /**
   * Die nächsten n Ladeplätze wie nextRest, nach Reisekilometern geordnet: die Ladesäulen der Orte auf dem Weg und die
   * Ladeparks an Ausfahrten des geplanten Wegs (und geradeaus dahinter); liegt dort keiner oder erreicht der Wagen den
   * ersten nicht (fits), dazu der nächste Park über Straßen von der nächsten Gabelung aus, auch abseits des Wegs (ein
   * Abstecher: km, m und realM wie nach setStop dorthin, siehe detour). Mit geplantem Stopp nur dieser.
   */
  restsAhead(n = 2, fits = ALL) {
    const found = [];
    const s = this.s;
    const ex = parkExcursion();
    const add = (pk, m, realM, km, fork = null) => {
      if (!found.some((r) => r.park === pk)) found.push({ park: pk, post: -1, name: PARKS[pk].name, node: PARKS[pk].node, m, realM, km, planned: pk === this.stop, fork });
      return found.length >= n;
    };
    // die Ladesäule eines Orts auf dem Weg (place); mit geplantem Stopp nur dieser
    const addPost = (c) => {
      const planned = c.place === this.post;
      if (this.stop >= 0 || (this.post >= 0 && !planned) || found.some((r) => r.post === c.place)) return false;
      // (zu nah, um noch davor zu halten: angeboten wird sie nicht mehr)
      if (!planned && c.postS - s < POST.near) return false;
      const r = this.reach(c.postS);
      found.push({ park: -1, post: c.place, name: postName(c.place), node: c.node, m: c.postS - s, realM: r.realM, km: r.km, planned, fork: null });
      return found.length >= n;
    };
    const P = this.plan();
    const onRoute = () => {
      for (const L of P.legs) {
        const c = L.sec;
        if (L.s1 <= s && c.kind !== 'park') continue;
        if (c.kind === 'park' && !c.spotDone && c.spotS > s) {
          const r = this.reach(c.spotS);
          if (add(c.park, c.spotS - s, r.realM, r.km)) return;
          continue;
        }
        if (c.kind === 'stadt' && c.postS !== undefined && !c.postDone && c.postS > s && addPost(c)) return;
        const f = c.kind === 'ab' ? c.fork : null;
        if (!f || f.taken || f.s <= s || f.forced) continue;
        const pk = parkAt(f.node);
        if (pk < 0 || (this.stop >= 0 && pk !== this.stop) || this.post >= 0) continue;
        // in der Sperrzone führt der angelegte Zweig schon woandershin (etwa in einen Ort, dessen Ladesäule dann folgt):
        // der Park liegt nicht mehr am Weg
        if (f.branch && f.s - s < J.lock && !f.branch.sections.some((q) => q.kind === 'park' && q.park === pk)) continue;
        // abfahren und hinein: Rampe und Abstecher sind echte Straße
        const r = this.reach(f.s);
        if (add(pk, f.s - s + J.ramp + ex.m, r.realM + J.ramp + ex.m, r.km + J.ramp / 1000 + ex.km, f)) return;
      }
      // hinter dem Geplanten geradeaus weiter (ohne Ziel kennt die Fahrt nur ihren Horizont)
      const last = P.legs.length ? P.legs[P.legs.length - 1].sec : this.section;
      if (last.kind !== 'ab' || !last.fork || last.fork.forced || this.stop >= 0 || this.post >= 0) return;
      let m = last.fork.s - s;
      const r = this.reach(last.fork.s);
      let km = r.km;
      if (!isFinite(km)) km = (last.s1 - Math.max(s, last.s0)) * last.kmPerM;
      let de = last.fork.de;
      for (let guard = 0; guard < 80 && km < WALK_KM; guard++) {
        const pk = parkAt(deTo(de));
        if (pk >= 0 && (guard > 0 || !last.fork.taken) && add(pk, m + J.ramp + ex.m, r.realM + J.ramp + ex.m, km + J.ramp / 1000 + ex.km, guard ? null : last.fork)) return;
        const st = straight(de);
        if (st < 0) break;
        const e = deEdge(st);
        m += edgeLen(e);
        km += e.km;
        de = st;
      }
    };
    onRoute();
    if (this.stop < 0 && this.post < 0 && (!found.length || !fits(found[0]))) {
      // der nächste über Straßen von der nächsten Gabelung (bzw. dem Ende des Angelegten) aus
      const N = nearestParks();
      let st = -1;
      for (const c of this.cur.sections) {
        if (c.fork && !c.fork.taken && c.fork.s > s) {
          st = c.fork.de;
          break;
        }
      }
      const fr = this.cur.frontier;
      if (st < 0 && fr) st = fr.t === 'fork' ? fr.fork.de : stateOfNode(fr.n);
      const pk = st >= 0 && isFinite(N.km[st]) ? N.park[st] : -1;
      if (pk >= 0 && !found.some((r) => r.park === pk)) {
        const r = this.detour(pk);
        if (isFinite(r.km)) found.push({ park: pk, post: -1, name: PARKS[pk].name, node: PARKS[pk].node, m: r.m, realM: r.realM, km: r.km, planned: false, fork: null });
      }
    }
    found.sort((a, b) => a.km - b.km);
    return found.slice(0, n);
  }
  /**
   * Der Weg zum Ladepark pk, als wäre er jetzt der geplante Stopp (setStop, gerechnet auf einem Schatten wie whatIf: an
   * der Fahrt ändert sich nichts): reach bis zu seinem Halt – Reisekilometer, Meter Straße und echte Straße darunter.
   */
  detour(pk) {
    const t = this.shadow();
    t.asIf = true;
    t.target = -1;
    t.stop = pk;
    t.policy = { ...parkRoute(pk), then: null };
    t.planned = null;
    return t.reach();
  }
  /**
   * Der Weg über das Ziel hinaus bis zum nächsten Ladepark von dort (über Straßen; auf einem Schatten: plan() fährt am
   * Ziel weiter, onward): reach bis zum Halt in diesem Park. Erreicht der Akku hinter dem Ziel noch einen Park? null
   * ohne Ziel, mit geplantem Stopp oder ohne Park.
   */
  pastTarget() {
    if (this.target < 0 || this.stop >= 0) return null;
    const pk = nearestParks().park[stateOfNode(places[this.target].node)];
    if (pk < 0) return null;
    const t = this.shadow();
    t.onward = { ...parkRoute(pk), then: null };
    t.planned = null;
    return t.reach();
  }
  /**
   * Was kommt nach der Ausfahrt an dieser Gabelung (laut aktuellem Zweig, sonst laut Routenplan)? wende: die Route
   * fährt dieselbe Straße zurück (über die Rampen). type 'park': der Zweig führt in den Ladepark park.
   */
  afterExit(fork) {
    const br = fork.branch;
    if (br) {
      for (const sec of br.sections) {
        if (sec.kind === 'park') return { type: 'park', park: sec.park };
        if (sec.kind === 'stadt' && sec.place === this.target) return { type: 'ziel', place: sec.place };
        if (sec.kind === 'term' && !sec.arrival) return { type: sec.transit, to: sec.transitTo };
        if (sec.kind === 'ab' || sec.kind === 'land') return { type: sec.kind, road: deRoad(sec.de).label, towards: deTowards(sec.de).name, wende: sec.de === deRev(fork.de) };
      }
    }
    return this.afterExitAt(fork.node, fork.de);
  }
  /** Was am Knoten laut Routenplan kommt. via: die Kante, auf der die Fahrt ankommt (für wende wie in afterExit). */
  afterExitAt(node, via = -1) {
    const pol = this.policy;
    if (!pol) return null;
    const st = stateOfNode(node);
    if (pol.goal === st) return pol.park >= 0 ? { type: 'park', park: pol.park } : { type: 'ziel', place: pol.place };
    const t = pol.next[st];
    if (!t) return null;
    const kind = deKind(t.de);
    if (kind === 'ab' || kind === 'land') return { type: kind, road: deRoad(t.de).label, towards: deTowards(t.de).name, wende: via >= 0 && t.de === deRev(via) };
    return { type: kind, to: deTo(t.de) };
  }

  // --- Ergänzung der Engine (Paket G): shears() ohne neue Objekte je Bild ------------------------------------------
  /**
   * Dasselbe wie shears(), aber in die wiederverwendete Map out (Rahmen-ID → {a, b, gen}): vorhandene Einträge werden
   * überschrieben, nicht mehr gültige gelöscht. Gleiche Formeln wie offset() und offsetLin(), nur ohne Zwischenobjekte.
   */
  shearsInto(out) {
    const gen = (this.shearGen = (this.shearGen || 0) + 1);
    const sec = this.section;
    const s = this.s;
    const l = sec.link;
    if (l && Trip.inCurve(l, s)) {
      const u = l.type === 'exit' ? s - l.s : l.s - s;
      this.putShear(out, l.a.id, -R(u), l.type === 'exit' ? -dR(u) : dR(u), gen);
    } else this.putShear(out, sec.frame, 0, 0, gen);
    let grown = true;
    let guard = 0;
    while (grown && guard++ < 10) {
      grown = false;
      for (const k of this.links) {
        const A = out.get(k.a.id);
        const B = out.get(k.b.id);
        const hasA = !!A && A.gen === gen;
        const hasB = !!B && B.gen === gen;
        if (hasA === hasB) continue;
        const exit = k.type === 'exit';
        const off = BETA * ((exit ? s - k.s : k.s - s) - J.cap / 2);
        const slope = exit ? BETA : -BETA;
        if (hasA) this.putShear(out, k.b.id, A.a + off, A.b + slope, gen);
        else this.putShear(out, k.a.id, B.a - off, B.b - slope, gen);
        grown = true;
      }
    }
    out.forEach(this.dropStaleShear, this);
    return out;
  }
  dropStaleShear(e, id, out) {
    if (e.gen !== this.shearGen) out.delete(id);
  }
  putShear(out, id, a, b, gen) {
    let e = out.get(id);
    if (!e) {
      e = { a: 0, b: 0, gen: 0 };
      out.set(id, e);
    }
    e.a = a;
    e.b = b;
    e.gen = gen;
  }

  /** Position auf der Landkarte (Breite, Länge, Kurs) für die Kartenansicht. */
  position() {
    const sec = this.section;
    const t = (this.s - sec.s0) / sec.len;
    if (sec.kind === 'ab' || sec.kind === 'land') return dePos(sec.de, t);
    const nd = nodes[sec.node];
    if (sec.place >= 0 && (sec.kind === 'zub' || sec.kind === 'stadt')) {
      const p = places[sec.place];
      const f = sec.kind === 'stadt' ? 1 : sec.back ? 1 - t : t;
      return { lat: nd.lat + (p.lat - nd.lat) * f, lon: nd.lon + (p.lon - nd.lon) * f, heading: 0 };
    }
    return { lat: nd.lat, lon: nd.lon, heading: 0 };
  }
}
