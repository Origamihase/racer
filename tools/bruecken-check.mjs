// Gemeinsame Probe für tools/bruecken-test.mjs und tools/fluesse-test.mjs: Führt der Weg des Navis (map/navroute.js)
// irgendwo über Wasser der Karte (map/water.js), fährt der Wagen in der Welt dort über eine Brücke – genau dann, wenn
// das Auto der Karte über dem Strich des Flusses ist, und umgekehrt: jede Brücke der Welt (map/crossings.js
// sectionWater, in den Flussorten rivers.js) liegt auf dem Weg der Karte über ihrem Wasser.
import { waterData } from '../src/map/water.js';
import { sectionWater, townRiverOnMap } from '../src/map/crossings.js';
import { riverOfSec } from '../src/map/rivers.js';
import { places } from '../src/map/graph.js';

const EPS = 1e-9;
function cross(ax, ay, bx, by, cx, cy, dx, dy) {
  const rx = bx - ax;
  const ry = by - ay;
  const sx = dx - cx;
  const sy = dy - cy;
  const den = rx * sy - ry * sx;
  if (Math.abs(den) < 1e-20) return null;
  const t = ((cx - ax) * sy - (cy - ay) * sx) / den;
  const u = ((cx - ax) * ry - (cy - ay) * rx) / den;
  return t >= -EPS && t <= 1 + EPS && u >= -EPS && u <= 1 + EPS ? [t, u] : null;
}
function inRing(R, x, y) {
  let c = false;
  const n = R.length / 2;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    if (R[i * 2 + 1] > y !== R[j * 2 + 1] > y && x < ((R[j * 2] - R[i * 2]) * (y - R[i * 2 + 1])) / (R[j * 2 + 1] - R[i * 2 + 1]) + R[i * 2]) c = !c;
  }
  return c;
}

/**
 * Die Stellen, an denen die Stücke pieces (NavModel.cache: [{s0, s1, pts}]) eines Abschnitts Wasser kreuzen: Flüsse
 * [{ri, s, x, y}], Seen [{li, s0, s1}] (s: Meter der Fahrt, über die Stücke gleichmäßig verteilt wie im Navi).
 */
export function waterOnPieces(pieces) {
  const W = waterData();
  const X = [];
  const S = [];
  for (const p of pieces) {
    if (p.kind === 'transit') continue; // Überfahrt: Fähre, Zug, Flug – keine Straße
    const n = p.pts.length / 2;
    let len = 0;
    const A = [0];
    for (let i = 1; i < n; i++) A.push((len += Math.hypot(p.pts[i * 2] - p.pts[i * 2 - 2], p.pts[i * 2 + 1] - p.pts[i * 2 - 1])));
    for (let i = 0; i < n; i++) {
      X.push(p.pts[i * 2], p.pts[i * 2 + 1]);
      S.push(len > 0 ? p.s0 + ((p.s1 - p.s0) * A[i]) / len : p.s0 + ((p.s1 - p.s0) * i) / Math.max(n - 1, 1));
    }
  }
  const box = [Infinity, Infinity, -Infinity, -Infinity];
  for (let i = 0; i < X.length; i += 2) {
    box[0] = Math.min(box[0], X[i]);
    box[1] = Math.min(box[1], X[i + 1]);
    box[2] = Math.max(box[2], X[i]);
    box[3] = Math.max(box[3], X[i + 1]);
  }
  const hit = (b) => b[0] <= box[2] && b[2] >= box[0] && b[1] <= box[3] && b[3] >= box[1];
  const rivers = [];
  W.rivers.forEach((r, ri) => {
    if (!hit(r.box)) return;
    const R = r.pts;
    for (let j = 0; j + 3 < R.length; j += 2) {
      for (let k = 0; k + 3 < X.length; k += 2) {
        const q = cross(X[k], X[k + 1], X[k + 2], X[k + 3], R[j], R[j + 1], R[j + 2], R[j + 3]);
        if (!q) continue;
        const x = X[k] + (X[k + 2] - X[k]) * q[0];
        const y = X[k + 1] + (X[k + 3] - X[k + 1]) * q[0];
        const s = S[k / 2] + (S[k / 2 + 1] - S[k / 2]) * q[0];
        // an einem Schnitt des Navis (Ende eines Stücks, Anfang des nächsten) nur einmal
        if (!rivers.some((o) => o.ri === ri && Math.abs(o.s - s) < 0.5 && Math.hypot(o.x - x, o.y - y) < 1e-7)) rivers.push({ ri, s, x, y, name: r.name });
      }
    }
  });
  const lakes = [];
  W.lakes.forEach((l, li) => {
    if (!hit(l.box)) return;
    const R = l.pts;
    const n = R.length / 2;
    const xs = [];
    for (let j = 0; j < n; j++) {
      const j2 = (j + 1) % n;
      for (let k = 0; k + 3 < X.length; k += 2) {
        const q = cross(X[k], X[k + 1], X[k + 2], X[k + 3], R[j * 2], R[j * 2 + 1], R[j2 * 2], R[j2 * 2 + 1]);
        if (q) xs.push({ s: S[k / 2] + (S[k / 2 + 1] - S[k / 2]) * q[0], k, t: q[0] });
      }
    }
    xs.sort((a, b) => a.s - b.s);
    for (let i = 0; i + 1 < xs.length; i++) {
      const a = xs[i];
      const b = xs[i + 1];
      if (b.s - a.s < 0.01) continue;
      // die Mitte zwischen zwei Kreuzungen im See?
      const sm = (a.s + b.s) / 2;
      let k = 0;
      while (k + 2 < S.length && S[k + 1] < sm) k++;
      const t = S[k + 1] > S[k] ? (sm - S[k]) / (S[k + 1] - S[k]) : 0;
      if (inRing(R, X[k * 2] + (X[k * 2 + 2] - X[k * 2]) * t, X[k * 2 + 1] + (X[k * 2 + 3] - X[k * 2 + 1]) * t)) lakes.push({ li, s0: a.s, s1: b.s, name: l.name });
    }
  });
  return { rivers, lakes };
}

/** Die Brücken der Welt auf dem Abschnitt sec: [{s (Mitte der Brücke über diesem Wasser, Meter der Fahrt), s0, s1 (Wasser der Welt), x, y, ri, cls, name}]. */
export function bridgesOf(sec) {
  const base = sec.orig || sec;
  const out = [];
  for (const b of sectionWater(base)) {
    const m = b.map.length;
    b.map.forEach((q, j) => {
      const s = base.s0 + b.s + (m > 1 ? (j / (m - 1) - 0.5) * b.half : 0);
      out.push({ s, s0: base.s0 + b.s - b.half, s1: base.s0 + b.s + b.half, x: q.x, y: q.y, ri: q.ri, cls: q.cls, name: q.name });
    });
  }
  const rv = base.kind === 'stadt' ? riverOfSec(base, places) : null;
  const tr = rv ? townRiverOnMap(base.place) : null;
  if (tr) out.push({ s: base.s0 + rv.u, s0: base.s0 + rv.u - rv.half / rv.cos, s1: base.s0 + rv.u + rv.half / rv.cos, x: tr.x, y: tr.y, ri: tr.w.ri, cls: tr.w.cls, name: tr.name, town: true });
  return out;
}

/**
 * Probe eines Abschnitts: Liste der Widersprüche zwischen Karte und Welt (leer: alles stimmt). tol: so viele Meter darf
 * die Stelle der Karte von der Mitte der Brücke abweichen.
 */
export function checkSection(sec, pieces, tol = 0.5) {
  const bad = [];
  const tag = () => (process.env.BRUECKEN_DEBUG ? ' ' + JSON.stringify({ back: sec.back, from: sec.from, transitTo: sec.transitTo, park: sec.park, start: sec.start, place: sec.place, pn: places[sec.place]?.name, node: sec.node, pnode: places[sec.place]?.node }) : '');
  const { rivers, lakes } = waterOnPieces(pieces);
  const exp = bridgesOf(sec);
  const s0 = Math.min(...pieces.map((p) => p.s0));
  const s1 = Math.max(...pieces.map((p) => p.s1));
  for (const r of rivers) {
    const m = exp.find((e) => e.ri === r.ri && Math.abs(e.s - r.s) <= tol);
    if (!m) bad.push(`${sec.kind} ${sec.id}: Weg der Karte über ${r.name || 'Fluss'} bei s ${(r.s - sec.s0).toFixed(1)}/${sec.len}, in der Welt keine Brücke dort${tag()}`);
  }
  for (const l of lakes) {
    if (!exp.some((e) => e.cls === 3 && e.s >= l.s0 - tol && e.s <= l.s1 + tol)) bad.push(`${sec.kind} ${sec.id}: Weg der Karte über ${l.name || 'See'} bei s ${(l.s0 - sec.s0).toFixed(1)} … ${(l.s1 - sec.s0).toFixed(1)}/${sec.len}, in der Welt keine Brücke dort${tag()}`);
  }
  for (const e of exp) {
    if (e.s < s0 - 1e-6 || e.s > s1 + 1e-6) continue; // nicht in diesen Stücken (Rest nach recut)
    const found = e.cls === 3 ? lakes.some((l) => e.s >= l.s0 - tol && e.s <= l.s1 + tol) : rivers.some((r) => r.ri === e.ri && Math.abs(e.s - r.s) <= tol);
    if (!found) bad.push(`${sec.kind} ${sec.id}: Brücke über ${e.name} bei s ${(e.s - sec.s0).toFixed(1)}/${sec.len}, der Weg der Karte führt dort nicht über das Wasser`);
  }
  return bad;
}
