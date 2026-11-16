// Die Strecke von „Navi ferngesteuert XXL“: aus der Karte (src/map) entsteht beim Fahren ein endloses Band aus
// Abschnitten: Autobahn, Ausfahrt mit Rampe, Zubringer, Ortsdurchfahrt mit Ziel, Landstraße, Auffahrt.
// An jeder Ausfahrt gabelt sich das Band. Der Spieler entscheidet mit der Spur, wohin es geht.
//
// Diese Datei kennt keine Grafik. Sie sagt der Engine, welche Abschnitte es gerade gibt (paths), in welchem
// Bezugsrahmen sie liegen (frames, shears), welche Spuren und Grenzen gelten (profile) und was das Navi ansagt
// (guidance). Sie läuft auch unter Node (siehe tools/trip-test.mjs).
//
// Koordinaten: s = gefahrene Meter auf dem Band (Kilometerzähler des Spielers), x = seitliche Lage in Metern
// (rechts positiv). Auf der Autobahn liegen die vier Spuren bei x = −5,625 … +5,625, der Standstreifen bei
// 7,5 … 10,5. Abseits der Autobahn liegt unsere Spur immer bei x = 9 (J.L0): genau dort, wo auf der Autobahn
// der Verzögerungsstreifen liegt. So muss beim Abfahren nichts umgerechnet werden.
import {
  nodes, edges, places, K, deEdge, deTo, deFrom, deRev, deKind, deRoad, deTowards, straight, edgeLen, routeTo, routeFrom,
  stateOfNode, transitions, townLen, zubLen, nodeTitle, dePos, turnAngle,
} from '../map/graph.js';

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
  conn: 600, // Verbindungsrampe zwischen zwei Autobahnen
  auf: 250, // Auffahrt (die letzten cap Meter sind der Bogen zur Autobahn)
  back: 350, // Zubringer vom Ort zurück zur Auffahrt
  term: 220, // Terminal von Fähre, Autozug und Luftfracht
  termOut: 150,
  pre: 1200, // so weit vor dem Einfädelpunkt gehört die neue Autobahn schon zur Welt (Keil zwischen Auffahrt und Autobahn)
  preTraffic: 700, // so weit vor dem Einfädelpunkt fährt dort schon Verkehr
  horizon: 1600, // so weit voraus wird die Strecke festgelegt
  behind: 400, // so weit zurück bleibt sie bestehen
  ghost: 1200, // so lange bleibt der nicht gewählte Zweig sichtbar
  lock: 500, // ab hier vor der Gabelung ändert ein neues Navi-Ziel den Zweig nicht mehr
  taper: 40, // Übergang der Fahrbahngrenzen zwischen zwei Abschnitten
  gore: 70, // Länge der Sperrfläche hinter der Gabelung
  close: 300, // am Autobahnende werden die Spuren auf dieser Länge nach rechts zur Ausfahrt verengt
  kmOff: 0.0012, // Kartenkilometer je Meter auf Rampen und Zubringern (ein Abstecher soll nur ein, zwei Kilometer zählen)
  kmTown: 0.003, // Kartenkilometer je Meter in der Ortsdurchfahrt
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

const AB_LANES = [-5.625, -1.875, 1.875, 5.625];
/** Querschnitte: Grenzen für die Wagenmitte des Spielers, Tempolimit, Spuren (dir −1 = Gegenverkehr). */
export const PROFILES = {
  ab: { name: 'ab', xmin: -7.8, xmax: 10.0, limit: 0, pace: 38, lanes: AB_LANES.map((x) => ({ x, dir: 1, w: 3.75 })) },
  rampe: { name: 'rampe', xmin: 7.55, xmax: 10.45, limit: 80, pace: 21, lanes: [{ x: 9.0, dir: 1, w: 3.5 }] },
  land: { name: 'land', xmin: 4.65, xmax: 10.1, limit: 100, pace: 24, lanes: [{ x: 9.0, dir: 1, w: 3.5 }, { x: 5.5, dir: -1, w: 3.5 }] },
  stadt: { name: 'stadt', xmin: 5.0, xmax: 9.9, limit: 50, pace: 13, lanes: [{ x: 9.0, dir: 1, w: 3.25 }, { x: 5.75, dir: -1, w: 3.25 }] },
};
const PROFILE_OF = { ab: 'ab', ramp: 'rampe', conn: 'rampe', auf: 'rampe', zub: 'land', land: 'land', stadt: 'stadt', term: 'stadt' };
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
    this.x = J.L0;
    this.km = 0; // gefahrene Kartenkilometer
    this.target = -1;
    this.policy = null;
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
    const len = pl >= 0 ? townLen(places[pl].pop) : 300;
    this.add(path, 'stadt', Math.max(len, 500), { node: startNode, place: pl, start: true, spotS: 0 });
    this.add(path, 'zub', J.back, { node: startNode, place: pl, back: true, stubEnd: true });
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
      kmPerM: kind === 'stadt' ? J.kmTown : J.kmOff,
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
    const sec = this.add(path, 'ab', len, { de, node: deTo(de), kmPerM: e.km / len, merge, pre: merge ? J.pre : 0 });
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
    const here = pol && places[pol.place].node === fork.node;
    let visits = [];
    if (here) visits = this.visitList(fork.node, pol.place);
    else if (this.planFor(fork) !== 'exit' && nd.places.length) visits = [nd.places[0].place];
    return { visits, sig: 'v' + visits.join(',') + (visits.length ? '' : ':' + this.pickLeave(fork.node, fork.de).key) };
  }
  /** Orte, die auf dem Abstecher zum Ziel durchfahren werden: erst der Ort an der Ausfahrt, dann das Ziel. */
  visitList(node, target) {
    const nd = nodes[node];
    const main = nd.places.find((p) => p.zubKm < 1.5);
    const out = [];
    if (main && main.place !== target) out.push(main.place);
    out.push(target);
    return out;
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
    this.add(path, 'ramp', J.ramp, { node: fork.node, link, stubEnd: true });
    if (plan.visits.length) this.addVisits(path, fork.node, plan.visits, 0);
    else this.add(path, 'conn', J.conn, { node: fork.node });
    path.frontier = { t: 'node', n: fork.node, via: fork.de };
    fork.branch = path;
    this.version++;
    return path;
  }

  /** Zubringer und Ortsdurchfahrten für eine Liste von Orten, danach der Zubringer zurück. */
  addVisits(path, node, visits, fromKm) {
    let km = fromKm;
    for (const pi of visits) {
      const p = places[pi];
      const zl = zubLen(Math.max(p.zubKm - km, 0));
      this.add(path, 'zub', zl, { node, place: pi, kmPerM: Math.max(p.zubKm - km, 0.4) / zl });
      const tl = townLen(p.pop);
      const town = this.add(path, 'stadt', tl, { node, place: pi });
      town.spotS = town.s0 + Math.round(tl * 0.6);
      km = p.zubKm;
    }
    this.add(path, 'zub', J.back, { node, place: visits[visits.length - 1], back: true, stubEnd: true });
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
      this.add(path, 'zub', J.back, { node: n, transitTo: m });
      const term = this.add(path, 'term', J.term, { node: n, de, transit: kind, transitTo: m });
      term.spotS = term.s0 + Math.round(J.term * 0.7);
      this.add(path, 'term', J.termOut, { node: m, de, transit: kind, arrival: true, kmPerM: 0 });
      this.add(path, 'zub', J.back, { node: m, back: true, stubEnd: true });
      path.frontier = { t: 'node', n: m, via: de };
    }
  }

  /** Landstraße bis zum nächsten Knoten, dort gleich die Ortsdurchfahrt. */
  addLand(path, de) {
    const e = deEdge(de);
    const len = edgeLen(e);
    const h = deTo(de);
    this.border(this.add(path, 'land', len, { de, node: h, kmPerM: e.km / len, stubStart: true }));
    const town = nodes[h].places.find((p) => p.zubKm < 1.5);
    if (town) {
      const tl = townLen(places[town.place].pop);
      const sec = this.add(path, 'stadt', tl, { node: h, place: town.place, inline: true });
      sec.spotS = sec.s0 + Math.round(tl * 0.6);
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
  /** Neues Navi-Ziel (Index in places) oder −1. Zweige vor uns werden neu geplant, wenn sie noch weit genug weg sind. */
  setTarget(placeIdx) {
    this.target = placeIdx;
    this.policy = placeIdx >= 0 ? routeTo(placeIdx) : null;
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
      if (!lv || L[i].s0 - this.s < J.lock) continue;
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
  /** Entfernungen von hier zu allen Orten (für die Auswahl neuer Ziele). */
  distances() {
    return routeFrom(this.state());
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
    const ev = (this.events = []);
    const s0 = this.s;
    let prev = this.cur.at(s0);
    this.x = x;
    // Kilometerzähler und Abschnittswechsel
    let guard = 0;
    while (guard++ < 8) {
      const sec = this.cur.at(this.s);
      const end = Math.min(s, sec.s1);
      this.km += Math.max(0, end - this.s) * sec.kmPerM;
      this.s = end;
      // Ziel- oder Ortsmitte passiert?
      if (sec.spotS !== undefined && !sec.spotDone && s0 < sec.spotS && this.s >= sec.spotS) {
        sec.spotDone = true;
        if (sec.kind === 'stadt') {
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
      if (s > this.ghosts[i].until) {
        this.dropPath(this.ghosts[i].path, 0);
        this.dropLink(this.ghosts[i].link);
        this.ghosts.splice(i, 1);
        this.version++;
      }
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
      this.ghosts.push({ path: this.cur, from: fork.s, until: fork.s + J.ghost, link: fork.link, fork });
      this.cur = fork.branch;
    } else {
      this.ghosts.push({ path: fork.branch, from: fork.s, until: fork.s + J.ghost, link: fork.link, fork });
      this.extend(this.cur, this.s + J.horizon);
    }
    this.version++;
    ev.push({ type: 'fork', fork, taken: fork.taken, planned, wrong: planned !== null && planned !== fork.taken });
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
    if (nxt && s > sec.s1 - J.taper) {
      const Q = PROFILES[nxt.profile];
      const t = (s - (sec.s1 - J.taper)) / J.taper;
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

  /** Abstand zwischen der Mitte unserer Spur abseits der Autobahn und dem Rand des Standstreifens (Keil). */
  static wedge(link, s) {
    return J.L0 + Trip.offset(link, s).off - J.shoulderEdge;
  }

  /** Schildtexte einer Gabelung. */
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
    };
  }

  /**
   * Die nächste Navi-Ansage. type: 'arrive' (Ziel voraus) · 'exit' (an der nächsten geplanten Gabelung abfahren) ·
   * 'follow' (dem Straßenverlauf folgen) · 'none' (kein Ziel). dist in Metern auf dem Band, km = Kartenkilometer bis
   * zum Ziel, mins = geschätzte Restfahrzeit, then = was nach der Ausfahrt kommt.
   */
  guidance() {
    if (this.target < 0 || !this.policy) return { type: 'none' };
    const pol = this.policy;
    const st = this.stateAhead();
    const base = { target: this.target, km: st.km, mins: st.secs / 60 };
    for (const sec of this.cur.sections) {
      if (sec.s1 <= this.s) continue;
      if (sec.kind === 'stadt' && sec.place === this.target && !sec.spotDone) return { ...base, type: 'arrive', dist: sec.spotS - this.s, sec };
      const f = sec.fork;
      if (f && !f.taken && this.planFor(f) === 'exit') {
        return { ...base, type: 'exit', dist: f.s - this.s, fork: f, node: f.node, title: f.forced ? 'Autobahnende' : nodeTitle(f.node), then: this.afterExit(f) };
      }
    }
    // weiter voraus: der Route folgen, bis die nächste Ausfahrt kommt
    const fr = this.cur.frontier;
    let dist = this.cur.s1 - this.s;
    if (fr && fr.t === 'fork') {
      let de = fr.fork.de;
      let guard = 0;
      while (guard++ < 200) {
        const t = pol.next[de];
        if (!t || t.type !== 'stay') {
          const node = deTo(de);
          return { ...base, type: 'exit', far: true, dist, node, title: nodeTitle(node), then: this.afterExitAt(node) };
        }
        de = t.to;
        dist += edgeLen(deEdge(de));
      }
    }
    return { ...base, type: 'follow', dist };
  }
  /** Restkilometer und Restzeit bis zum Ziel ab der Spielerposition. */
  stateAhead() {
    const pol = this.policy;
    const sec = this.section;
    let km = 0;
    let secs = 0;
    // Rest des eigenen Wegs bis zu dessen Ende, dann laut Route
    let reached = false;
    for (const c of this.cur.sections) {
      if (c.s1 <= this.s) continue;
      const from = Math.max(c.s0, this.s);
      let to = c.s1;
      if (c.kind === 'stadt' && c.place === this.target && !c.spotDone) {
        to = c.spotS;
        reached = true;
      }
      km += (to - from) * c.kmPerM;
      secs += (to - from) / PROFILES[c.profile].pace;
      if (reached) break;
      const f = c.fork;
      if (f && !f.taken && this.planFor(f) === 'exit') {
        const stn = stateOfNode(f.node);
        return { km: km + pol.km[stn], secs: secs + pol.secs[stn] + 12 };
      }
    }
    if (reached) return { km, secs };
    const fr = this.cur.frontier;
    let st = -1;
    if (fr && fr.t === 'fork') st = fr.fork.de;
    else if (fr && fr.t === 'node') st = stateOfNode(fr.n);
    if (st < 0 || !isFinite(pol.cost[st])) return { km: Infinity, secs: Infinity, sec };
    return { km: km + pol.km[st], secs: secs + pol.secs[st] };
  }
  /** Was kommt nach der Ausfahrt an dieser Gabelung (laut aktuellem Zweig)? */
  afterExit(fork) {
    const br = fork.branch;
    if (br) {
      for (const sec of br.sections) {
        if (sec.kind === 'stadt' && sec.place === this.target) return { type: 'ziel', place: sec.place };
        if (sec.kind === 'term' && !sec.arrival) return { type: sec.transit, to: sec.transitTo };
        if (sec.kind === 'ab') return { type: 'ab', road: deRoad(sec.de).label, towards: deTowards(sec.de).name, wende: sec.de === deRev(fork.de) };
        if (sec.kind === 'land') return { type: 'land', road: deRoad(sec.de).label, towards: deTowards(sec.de).name };
      }
    }
    return this.afterExitAt(fork.node);
  }
  afterExitAt(node) {
    const pol = this.policy;
    if (!pol) return null;
    const st = stateOfNode(node);
    if (pol.goal === st) return { type: 'ziel', place: pol.place };
    const t = pol.next[st];
    if (!t) return null;
    const kind = deKind(t.de);
    if (kind === 'ab' || kind === 'land') return { type: kind, road: deRoad(t.de).label, towards: deTowards(t.de).name };
    return { type: kind, to: deTo(t.de) };
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
