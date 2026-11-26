// Die Straße voraus, wie die Welt sie baut: Grundlage der Nahansicht des Navis (COMMON.md §9: das Navi zeigt nur,
// was die Welt wirklich hat).
//
// roadAhead(trip, s, dMax) liefert die Linie der eigenen Fahrbahn voraus in Spielmetern relativ zum Auto (x rechts,
// z voraus, alle step Meter) und psi, den Kurs des Autos im Kartenrahmen (0 = Norden, links positiv): dasselbe Format
// wie course.preview() aus Paket K2. Ohne K2 baut die Welt jeden Rahmen gerade, dann ist die Linie gerade und psi
// unbekannt (NaN). Die Karte des Navis dreht sich mit dem Kurs ihres eigenen Wegs, nicht mit psi (src/map/navview.js).
// src/main.js leitet den Adapter auf den Verlauf der Welt um:
//   setRoadAhead((trip, s, dMax) => course.preview(trip, s, dMax));
//
// closeScene(trip, ahead, behind) beschreibt alles, was in der Nahansicht liegt, in Weg-Metern d (vor dem Auto) und
// seitlicher Lage X (rechts, im Rahmen des Autos): jede Fahrbahn so, wie die Welt sie baut (Abschnitt in seinem
// Rahmen, trip.locate; Rahmen gegeneinander geschert, trip.shears; Rampen im Bogen R(u)), dazu die geplante Route,
// die angesagte Ausfahrt, Orte, Terminals und den Zielpunkt. curvePoint() biegt (d, X) längs der Linie des Adapters
// (P(d) + X · N(d)); ohne K2 ist das (X, d). Alles rein und unter Node prüfbar (tools/map-test.mjs).
//
// townLayout(trip, sec): Layout eines Orts aus dem Stadtbaukasten im Rahmen seines Abschnitts (Straßen, Platz mit
// Brunnen), über setTownLayout(fn) angeschlossen. Ohne Baukasten null: dann zeigt das Navi nur, was der Abschnitt der
// Fahrt hat (Durchfahrt, Ortsanfang und -ende, Zielpunkt), kein erfundenes Straßenmuster.
import { J, PROFILES } from '../game/trip.js';
import { places } from './graph.js';
import { riverOfSec, riverAt } from './rivers.js';
import { bridgesOf } from '../world/xxl/bridgeplan.js';
import { bandsOf, centreline } from '../world/xxl/bandplan.js';

/** Abtastung der Linie in Metern. */
export const STEP = 10;
/**
 * Fluss eines Orts in der Nahansicht: Stützstellen längs des Flusses (Meter links und rechts der Straße, weit über
 * den Bildrand hinaus) und die Stelle seines Namens (auf dem Wasser rechts neben der Brücke).
 */
export const RIVER_SCENE = { X: [-900, -450, -200, -60, 0, 60, 200, 450, 900], label: 62 };

let source = null;
let layoutSource = null;
let reachSource = null;
let bandSource = null;
const RP = [0, 0];
const straight = { n: 0, x: new Float64Array(0), z: new Float64Array(0), psi: NaN };

/**
 * Leitet roadAhead um, z. B. auf course.preview (Format: {n, x, z, psi}, x/z Spielmeter relativ zum Auto). null =
 * wieder gerade.
 */
export function setRoadAhead(fn) {
  source = fn || null;
}

/** Die Linie der eigenen Fahrbahn voraus (siehe oben). */
export function roadAhead(trip, s, dMax = 2000) {
  if (source) return source(trip, s, dMax);
  const n = Math.floor(dMax / STEP) + 1;
  if (straight.x.length < n) {
    straight.x = new Float64Array(n);
    straight.z = new Float64Array(n);
  }
  for (let i = 0; i < n; i++) {
    straight.x[i] = 0;
    straight.z[i] = i * STEP;
  }
  straight.n = n;
  return straight;
}

/**
 * Schließt das Layout des Stadtbaukastens an: fn(trip, sec) → {streets: [{pts: [s, x, s, x, …], w}], square: {s, x, r},
 * fountain: {s, x}} in Weg-Metern s und seitlicher Lage x im Rahmen des Ortsabschnitts, oder null.
 */
export function setTownLayout(fn) {
  layoutSource = fn || null;
}
export function townLayout(trip, sec) {
  return layoutSource ? layoutSource(trip, sec) : null;
}

/**
 * Schließt die Brücken der Welt an: fn(key) → [links, rechts], wie weit (Meter längs des Flusses ab der Straße) die Welt
 * das Wasser der Brücke key (bridgeplan.js: b.key + '@' + Math.round(b.sc)) gerade zeigt, oder null (nicht gebaut).
 * Ohne Welt zeigt die Nahansicht das Wasser jeder Brücke auf einer gezeichneten Straße bis RIVER_SCENE.X.
 */
export function setBridgeReach(fn) {
  reachSource = fn || null;
}

/**
 * Schließt die Flüsse neben der Straße an: fn(key) → [A, B], wie weit (Meter ab der Ecke, bandplan.js) die Welt die
 * beiden Arme des Bands key gerade zeigt, oder null (nicht zu sehen). Ohne Welt zeigt die Nahansicht jedes Band ganz.
 */
export function setBandReach(fn) {
  bandSource = fn || null;
}

/** Mitte der Fahrbahn eines Querschnitts (Mittel der Spuren in unserer Richtung und der Gegenrichtung). */
const MID = {};
for (const [k, P] of Object.entries(PROFILES)) MID[k] = k === 'ab' ? 0 : P.lanes.reduce((a, l) => a + l.x, 0) / P.lanes.length;

/**
 * Punkt (d, X) der Nahansicht auf der Linie L des Adapters: out = [x, z] in Spielmetern relativ zum Auto. Vor dem Auto
 * entlang der Linie (zwischen den Stützpunkten linear, Richtung aus der Sehne), dahinter gerade zurück.
 */
export function curvePoint(L, d, X, out) {
  const n = L.n;
  if (n < 2 || d <= 0) {
    // hinter dem Auto: gerade zurück in der Richtung am Auto
    const [tx, tz] = n >= 2 ? dir(L, 0) : [0, 1];
    out[0] = tx * d + tz * X;
    out[1] = tz * d - tx * X;
    return out;
  }
  const u = d / STEP;
  let i = Math.floor(u);
  if (i >= n - 1) i = n - 2;
  const f = u - i;
  const [tx, tz] = dir(L, Math.min(Math.max(f < 0.5 ? i - 0.5 + f : i + f - 0.5, 0), n - 1.0001));
  const x = L.x[i] + (L.x[i + 1] - L.x[i]) * f;
  const z = L.z[i] + (L.z[i + 1] - L.z[i]) * f;
  // Normale nach rechts: (tz, −tx) bei x rechts, z voraus
  out[0] = x + tz * X;
  out[1] = z - tx * X;
  return out;
}
/** Richtung der Linie an der Stelle u (in Stützpunkten), weich zwischen den Sehnen. */
function dir(L, u) {
  const i = Math.min(Math.max(Math.floor(u), 0), L.n - 2);
  const f = Math.min(Math.max(u - i, 0), 1);
  const a = chord(L, i);
  const b = chord(L, Math.min(i + 1, L.n - 2));
  const tx = a[0] + (b[0] - a[0]) * f;
  const tz = a[1] + (b[1] - a[1]) * f;
  const l = Math.hypot(tx, tz) || 1;
  return [tx / l, tz / l];
}
function chord(L, i) {
  const dx = L.x[i + 1] - L.x[i];
  const dz = L.z[i + 1] - L.z[i];
  const l = Math.hypot(dx, dz) || 1;
  return [dx / l, dz / l];
}

/**
 * Alles in der Nahansicht: {roads: [{kind, role, fade, pts: [d, X, …], sec}], route: [d, X, …], trail: [d, X, …],
 * towns: [{place, sec, pts, streets: [{pts, w}], square: {d, X, r} | null, river: {name, near: [d, X, …], far: [d, X,
 * …]} | null}], marks: [{type, d, X, …}], carX}. river: der Fluss des Orts (rivers.js – dasselbe Band, das die Welt
 * baut) als seine beiden Wasserkanten diesseits und jenseits, von links nach rechts; dazu die Marke 'river' (sein Name).
 * waters: [{name, near, far, key}]: das Wasser unter den Brücken der gezeichneten Straßen (bridgeplan.js, so weit, wie die
 * Welt es zeigt: setBridgeReach), ebenso als Ufer diesseits und jenseits; auf dem eigenen Weg dazu die Marke 'river'.
 * kind: Querschnitt ('ab', 'rampe', 'verbindung', 'land', 'stadt'); role: 'cur' | 'branch' | 'ghost' | 'ahead';
 * fade 0…1 (verlassene Wege verschwinden, wo die Welt sie verschwinden lässt); marks: 'exit' (angesagte Ausfahrt;
 * name: ihr Schildtext), 'pin' (Zielpunkt), 'term' (Terminal), 'town' (Ortsanfang). ins: die Ansage des Navis (für
 * die Ausfahrt, die sie meint). Ohne gebogene Linie genügen Stützpunkte an den Knicken (gerade Rahmen, nur geschert).
 */
export function closeScene(trip, ahead = 2200, behind = 500, ins = null, step = STEP) {
  const s = trip.s;
  const lo = s - behind;
  const hi = s + ahead;
  const sh = trip.shears();
  const scene = { roads: [], route: [], trail: [], towns: [], waters: [], marks: [], carX: 0 };
  const lat = (sec, so, x) => {
    const l = trip.locate(sec, so, x);
    const f = sh.get(l.frame);
    return f ? l.x + f.a + f.b * (so - s) : NaN;
  };
  // Stützpunkte: mit gebogener Linie (K2) alle step Meter; ohne genügen die Knicke, denn jeder Rahmen ist gerade und
  // gegen den eigenen nur geschert: fein nur im Bogen eines Knotenpunkts (R(u)) und im Spurwechsel der Route
  const curved = !!source;
  const sample = (sec, a, b, x, pts) => {
    if (!(b > a)) return pts;
    const fn = typeof x === 'function';
    const l = sec.link;
    const c0 = l ? (l.type === 'exit' ? l.s : l.s - J.cap) : Infinity;
    const c1 = l ? (l.type === 'exit' ? l.s + J.cap : l.s) : -Infinity;
    for (let so = a, guard = 0; guard < 2000; guard++) {
      const X = lat(sec, so, fn ? x(so) : x);
      if (Number.isFinite(X)) pts.push(so - s, X);
      if (so >= b) break;
      let nx;
      if (curved) nx = so + step;
      else if (so >= c0 && so < c1) nx = Math.min(so + 6, c1);
      else if (fn) nx = so + 25;
      else nx = so < c0 ? c0 : b;
      so = Math.min(Math.max(nx, so + 0.5), b);
    }
    return pts;
  };
  // das Wasser unter den Brücken eines Abschnitts, soweit die Straße darüber in [a, b] gezeichnet ist
  const seen = new Set();
  const waters = (sec, a, b, own) => {
    for (const br of bridgesOf(sec)) {
      if (br.sc < a || br.sc > b) continue;
      const key = br.key + '@' + Math.round(br.sc);
      if (seen.has(key)) continue;
      seen.add(key);
      const reach = reachSource ? reachSource(key) : [Infinity, Infinity];
      if (!reach) continue;
      const Xs = [-reach[0]];
      for (const X of RIVER_SCENE.X) if (X > -reach[0] && X < reach[1]) Xs.push(X);
      Xs.push(reach[1]);
      for (let i = 0; i < Xs.length; i++) Xs[i] = Math.min(Math.max(Xs[i], RIVER_SCENE.X[0]), RIVER_SCENE.X[RIVER_SCENE.X.length - 1]);
      // Fluss → Straße: x = X·cos − D·sin, s = sc + D·cos + X·sin
      const bank = (D) => {
        const q = [];
        for (const X of Xs) {
          const so = br.sc + D * br.cos + X * br.sin;
          const Xl = lat(sec, so, X * br.cos - D * br.sin);
          if (Number.isFinite(Xl)) q.push(so - s, Xl);
        }
        return q;
      };
      const w = { name: br.name, key, near: bank(-br.half), far: bank(br.half) };
      if (w.near.length < 4 || w.far.length < 4) continue;
      scene.waters.push(w);
      const L = RIVER_SCENE.label;
      if (own && br.name && L < reach[1]) {
        const so = br.sc + L * br.sin;
        scene.marks.push({ type: 'river', name: br.name, d: so - s, X: lat(sec, so, L * br.cos) });
      }
    }
    // Flüsse neben der Straße (bandplan.js): dasselbe Band wie in der Welt, mit den Armen so weit, wie sie reichen
    for (const bd of bandsOf(sec)) {
      if (bd.c1 < a || bd.c0 > b || seen.has(bd.key)) continue;
      seen.add(bd.key);
      const reach = bandSource ? bandSource(bd.key) : [Infinity, Infinity];
      if (!reach) continue;
      const far = RIVER_SCENE.X[RIVER_SCENE.X.length - 1];
      const C = centreline(bd, Math.min(reach[0], far), Math.min(reach[1], far), 25, 6);
      const bank = (D) => {
        const q = [];
        for (const p of C.pts) {
          const so = p.s + p.ns * D;
          const Xl = lat(sec, so, p.x + p.nx * D);
          if (Number.isFinite(Xl)) q.push(so - s, Xl);
        }
        return q;
      };
      const w = { name: bd.name, key: bd.key, near: bank(-bd.half), far: bank(bd.half) };
      if (w.near.length < 4 || w.far.length < 4) continue;
      scene.waters.push(w);
      if (own && bd.name) {
        const so = Math.min(Math.max(s + 140, bd.s0 + 40), bd.s1 - 40);
        if (so > a && so < b) scene.marks.push({ type: 'river', name: bd.name, d: so - s, X: lat(sec, so, bd.xc) });
      }
    }
  };
  scene.carX = lat(trip.section, s, trip.x);
  if (!Number.isFinite(scene.carX)) scene.carX = trip.x;

  // Die Autobahn (die Welt zeigt immer höchstens eine, trip.autobahnView)
  const av = trip.autobahnView();
  if (av) {
    const f = sh.get(av.frame);
    const a = Math.max(av.s0, lo);
    const b = Math.min(av.s1, hi);
    if (f && b > a) {
      const pts = [];
      // gerade im eigenen Rahmen: zwei Punkte genügen ohne Biegung, die Linie des Adapters braucht aber Stützpunkte
      const n = curved ? Math.max(1, Math.ceil((b - a) / step)) : 1;
      for (let i = 0; i <= n; i++) {
        const so = a + ((b - a) * i) / n;
        pts.push(so - s, f.a + f.b * (so - s));
      }
      let fade = 1;
      if (av.role === 'ghost') {
        const g = trip.ghosts.find((q) => q.fork && q.fork.taken === 'exit');
        if (g) fade = Math.min(Math.max((g.until - s) / 150, 0), 1);
      }
      scene.roads.push({ kind: 'ab', role: av.role, fade, pts });
      for (const c of av.secs) if (c.kind === 'ab') waters(c, a, b, av.role !== 'ghost');
    }
  }

  // Alles abseits der Autobahn auf allen sichtbaren Wegen
  const ghostOf = new Map(trip.ghosts.map((g) => [g.path, g]));
  for (const { path, role } of trip.paths()) {
    const own = role === 'cur';
    const end = own ? path.s1 : trip.drawnEnd(path);
    const g = ghostOf.get(path);
    const fade = g ? Math.min(Math.max((g.until - s) / 150, 0), 1) : 1;
    for (const sec of path.sections) {
      if (sec.kind === 'ab') continue;
      const a = Math.max(sec.s0, lo);
      const b = Math.min(sec.s1, hi, end);
      if (!(b > a) || !trip.visible(sec, path)) continue;
      const pts = sample(sec, a, b, MID[sec.profile], []);
      if (pts.length >= 4) scene.roads.push({ kind: sec.profile, role, fade, pts, sec });
      waters(sec, a, b, own);
      if (sec.kind === 'stadt' && sec.place >= 0) {
        const town = { place: sec.place, sec, role, pts: pts.slice(), streets: [], square: null, river: null };
        // der Fluss nur, wo auch die Straße des Orts über ihn gezeichnet ist
        const rv = riverOfSec(sec, places);
        if (rv && sec.s0 + rv.u > a && sec.s0 + rv.u < b) {
          const bank = (D) => {
            const q = [];
            for (const X of RIVER_SCENE.X) {
              riverAt(rv, X, D, RP);
              const Xl = lat(sec, sec.s0 + RP[1], RP[0]);
              if (Number.isFinite(Xl)) q.push(sec.s0 + RP[1] - s, Xl);
            }
            return q;
          };
          town.river = { name: rv.name, near: bank(-rv.half), far: bank(rv.half) };
          riverAt(rv, RIVER_SCENE.label, 0, RP);
          if (own) scene.marks.push({ type: 'river', name: rv.name, d: sec.s0 + RP[1] - s, X: lat(sec, sec.s0 + RP[1], RP[0]) });
        }
        // Straßen und Platz aus dem Stadtbaukasten (über setTownLayout), in die Lage der Nahansicht umgerechnet
        const L = townLayout(trip, sec);
        if (L) {
          for (const st of L.streets || []) {
            const q = [];
            for (let i = 0; i + 1 < st.pts.length; i += 2) {
              const X = lat(sec, st.pts[i], st.pts[i + 1]);
              if (Number.isFinite(X)) q.push(st.pts[i] - s, X);
            }
            if (q.length >= 4) town.streets.push({ pts: q, w: st.w || 6 });
          }
          // der Platz nur, wo auch die Straße des Orts gezeichnet ist (ein Zweig reicht erst bis trip.drawnEnd)
          if (L.square && L.square.s >= a && L.square.s <= b) town.square = { d: L.square.s - s, X: lat(sec, L.square.s, L.square.x), r: L.square.r || 12 };
        }
        scene.towns.push(town);
      }
    }
  }

  // Route: eigener Weg, an einer geplanten Ausfahrt in ihren Zweig, bis zum Zielpunkt, zum Rand oder so weit, wie die
  // Welt den Weg schon zeigt (trip.visible); dahinter der gefahrene Weg
  const exitFork = (f) => f && !f.taken && (f.forced || trip.planFor(f) === 'exit');
  const cf = trip.cur.fork;
  if (cf && cf.sec && lo < cf.s) {
    // gerade abgefahren: der gefahrene Weg beginnt noch auf der Autobahn (auf dem Verzögerungsstreifen)
    sample(cf.sec, Math.max(cf.sec.s0, lo), cf.s, (so) => J.L0 * smooth((so - (cf.s - J.decel - 150)) / (J.decel + 150)), scene.trail);
  }
  let path = trip.cur;
  let from = lo;
  let open = null; // Autobahn, die über das Ende des bekannten Wegs hinaus geradeaus weitergeht
  for (let guard = 0; guard < 4 && path; guard++) {
    const own = path === trip.cur;
    const end = own ? path.s1 : trip.drawnEnd(path);
    let next = null;
    let stop = false;
    for (const sec of path.sections) {
      if (sec.s1 <= from) continue;
      if (sec.s0 >= end || !trip.visible(sec, path)) {
        stop = true;
        break;
      }
      let a = Math.max(sec.s0, from);
      let b = Math.min(sec.s1, hi, end);
      const f = sec.fork;
      // die Route endet am Zielpunkt – ohne Ziel am Halt des Ladestopps
      const target = (sec.kind === 'stadt' && sec.place === trip.target && trip.target >= 0 && sec.spotS !== undefined && !sec.spotDone) ||
        (sec.kind === 'park' && sec.park === trip.stop && trip.target < 0 && sec.spotS !== undefined && !sec.spotDone);
      if (target) b = Math.min(b, sec.spotS);
      if (b > a) {
        let x = MID[sec.profile];
        if (sec.kind === 'ab' && exitFork(f)) {
          // vor der geplanten Ausfahrt nach rechts auf den Verzögerungsstreifen (die Spur, die abgeht)
          const t0 = f.s - J.decel - 150;
          x = (so) => J.L0 * smooth((so - t0) / (J.decel + 150));
        }
        if (a < s) {
          sample(sec, a, Math.min(b, s), x, scene.trail);
          a = Math.min(b, s);
        }
        if (b > a) sample(sec, a, b, x, scene.route);
      }
      if ((target && sec.spotS <= hi) || sec.s1 >= hi) {
        stop = true;
        break;
      }
      if (exitFork(f)) {
        if (f.branch) {
          next = f.branch;
          from = f.s;
        } else stop = true;
        break;
      }
    }
    if (!next) {
      if (!stop && own && path.frontier && path.frontier.t === 'fork' && !exitFork(path.frontier.fork)) open = path.frontier.fork.sec;
      break;
    }
    path = next;
  }
  if (open && open.s1 < hi) {
    // geradeaus weiter auf derselben Autobahn (gleicher Rahmen), auch wenn die Fahrt sie noch nicht angelegt hat
    const f = sh.get(open.frame);
    if (f) for (let so = open.s1, i = 0; so < hi; i++) {
      so = Math.min(curved ? open.s1 + (i + 1) * step : hi, hi);
      scene.route.push(so - s, f.a + f.b * (so - s));
    }
  }

  // Marken: angesagte Ausfahrt (am Ende der Sperrfläche, wo Rampe und Autobahn auseinandergehen), Zielpunkt,
  // Terminal, Ortsnamen am Ortsanfang
  const fork = ins && ins.fork ? ins.fork : null;
  if (fork && fork.branch && !fork.taken) {
    const ramp = fork.branch.sections[0];
    const so = fork.s + J.gore;
    if (so < hi && so > lo) scene.marks.push({ type: 'exit', d: so - s, X: lat(ramp, so, MID.rampe), name: ins.head });
  }
  for (const { path: p, role } of trip.paths()) {
    if (role === 'ghost') continue;
    const end = role === 'cur' ? p.s1 : trip.drawnEnd(p);
    for (const sec of p.sections) {
      if (sec.s0 > hi || sec.s1 < lo || sec.s0 > end) continue;
      if (sec.kind === 'stadt' && sec.place === trip.target && trip.target >= 0 && sec.spotS !== undefined && !sec.spotDone && sec.spotS >= lo && sec.spotS <= hi) {
        const L = townLayout(trip, sec);
        const sp = L && L.fountain ? L.fountain : { s: sec.spotS, x: MID.stadt };
        scene.marks.push({ type: 'pin', d: sp.s - s, X: lat(sec, sp.s, sp.x), place: sec.place, layout: L });
      }
      if (sec.kind === 'park' && sec.park === trip.stop && sec.spotS !== undefined && !sec.spotDone && sec.spotS >= lo && sec.spotS <= hi) {
        scene.marks.push({ type: 'park', park: sec.park, d: sec.spotS - s, X: lat(sec, sec.spotS, MID.stadt) });
      }
      // der Halt an der geplanten Ladesäule eines Orts (trip.post)
      if (sec.kind === 'stadt' && trip.post >= 0 && sec.place === trip.post && sec.postS !== undefined && !sec.postDone && sec.postS >= lo && sec.postS <= hi) {
        scene.marks.push({ type: 'park', park: -1, d: sec.postS - s, X: lat(sec, sec.postS, MID.stadt) });
      }
      if (sec.kind === 'term' && !sec.arrival && sec.spotS !== undefined && sec.spotS >= lo && sec.spotS <= hi) {
        scene.marks.push({ type: 'term', transit: sec.transit, d: sec.spotS - s, X: lat(sec, sec.spotS, MID.stadt) });
      }
      if (sec.kind === 'stadt' && sec.place >= 0 && sec.s0 >= lo && sec.s0 <= hi) {
        scene.marks.push({ type: 'town', place: sec.place, d: sec.s0 - s, X: lat(sec, sec.s0, MID.stadt), d1: sec.s1 - s });
      }
    }
  }
  return scene;
}

const smooth = (t) => {
  const u = Math.min(Math.max(t, 0), 1);
  return u * u * (3 - 2 * u);
};
