// Landschaft neben der Straße, wie die Karte sie zeigt (map/landpaint.js coverMask aus ESA WorldCover): Wald, Dorf,
// Acker oder Wiese je Seite und Stelle eines Abschnitts. Rein rechnerisch, läuft auch unter Node; die eine Wahrheit
// für den Bewuchs der Landstraßen und Zubringer (world.js planProps) und für die Szenerie der Autobahn (scenery.js:
// Wald und Dörfer) – COMMON.md §9: das Navi zeigt nur, was die Welt hat, und umgekehrt.
//
// Abgetastet wird die Linie des Abschnitts auf der Karte (Landstraße und Autobahn: die Etappe, wie sectionShores in
// map/riverside.js; Zubringer: zubLine) alle COVER.step Meter der Welt; je Stelle und Seite die Bedeckung in
// COVER.near Kilometern Abstand (Maßstab 1:19: 0,15 km auf der Karte sind 8 m in der Welt, 0,5 km 26 m). Aus den
// Proben entstehen Läufe gleicher Art; zu kurze Läufe gehen im Nachbarn auf (COVER.min), damit kein Wald aus drei
// Bäumen entsteht und kein Dorf aus einem Haus.
import { deEdge } from '../../map/graph.js';
import { edgeLine } from '../../map/mapview.js';
import { zubLine } from '../../map/crossings.js';
import { coverMask } from '../../map/landpaint.js';
import { landscapeVersion } from '../../map/landscape.js';

/**
 * step: Abstand der Proben (Meter der Welt) · near: Abstände der Proben quer zur Straße (km auf der Karte) mit Gewicht ·
 * min: kürzester Lauf je Art (Meter) · wood/town: Schwellen für Wald und Dorf (gewichteter Anteil).
 */
export const COVER = { step: 20, near: [[0.15, 0.45], [0.35, 0.35], [0.7, 0.2]], min: { wald: 90, dorf: 70, feld: 60, wiese: 60 }, wood: 0.5, town: 0.55 };
export const KINDS = ['wiese', 'feld', 'wald', 'dorf'];

/** Linie eines Abschnitts auf der Karte: {P (x, y, …), A (Bogenlängen), len} in Richtung der Fahrt, oder null. */
function sectionLine(sec) {
  if ((sec.kind === 'ab' || sec.kind === 'land') && sec.de >= 0) {
    const e = deEdge(sec.de);
    let P = edgeLine(e.i);
    if (sec.de & 1) {
      const R = new Float64Array(P.length);
      for (let k = 0; k < P.length; k += 2) {
        R[k] = P[P.length - 2 - k];
        R[k + 1] = P[P.length - 1 - k];
      }
      P = R;
    }
    return withArc(P);
  }
  if (sec.kind === 'zub') {
    const z = zubLine(sec);
    return z ? withArc(z.P) : null;
  }
  return null;
}
function withArc(P) {
  const A = [0];
  for (let k = 2; k < P.length; k += 2) A.push(A[A.length - 1] + Math.hypot(P[k] - P[k - 2], P[k + 1] - P[k - 1]));
  const len = A[A.length - 1];
  return len > 0 ? { P, A, len } : null;
}
/** Punkt und Richtung bei Bogenlänge a. */
function pointAt(L, a, out) {
  const { P, A } = L;
  let lo = 0;
  let hi = A.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (A[mid] <= a) lo = mid;
    else hi = mid;
  }
  const sl = A[hi] - A[lo] || 1;
  const t = Math.min(Math.max((a - A[lo]) / sl, 0), 1);
  const dx = P[hi * 2] - P[lo * 2];
  const dy = P[hi * 2 + 1] - P[lo * 2 + 1];
  const l = Math.hypot(dx, dy) || 1;
  out.x = P[lo * 2] + dx * t;
  out.y = P[lo * 2 + 1] + dy * t;
  out.dx = dx / l;
  out.dy = dy / l;
  return out;
}

const kmPerUnit = (y) => 111.32 * Math.cos(2 * Math.atan(Math.exp((-y * Math.PI) / 180)) - Math.PI / 2);

const cache = new WeakMap();
/**
 * Läufe der Landschaft eines Abschnitts: {left: [[s0, s1, art]], right: [...]} in Metern ab Abschnittsanfang, Art aus
 * KINDS; null, wenn der Abschnitt keine Linie auf der Karte hat oder dort keine Daten liegen.
 */
export function sectionCover(sec) {
  const v = landscapeVersion();
  let c = cache.get(sec);
  if (c && c.v === v) return c.out;
  const out = plan(sec);
  cache.set(sec, { v, out });
  return out;
}

function plan(sec) {
  const L = sectionLine(sec);
  const len = sec.len ?? sec.s1 - sec.s0;
  if (!L || !(len > 0)) return null;
  const n = Math.max(2, Math.ceil(len / COVER.step) + 1);
  const q = { x: 0, y: 0, dx: 0, dy: 0 };
  const m = { forest: 0, urban: 0, crop: 0, data: false };
  const sides = { left: [], right: [] };
  let any = false;
  for (let i = 0; i < n; i++) {
    const s = (len * i) / (n - 1);
    pointAt(L, (s / len) * L.len, q);
    const kpu = kmPerUnit(q.y);
    for (const [name, sg] of [['left', -1], ['right', 1]]) {
      // rechts der Fahrtrichtung: Karten-y zeigt nach Süden, also (−dy, dx)
      const nx = -q.dy * sg;
      const ny = q.dx * sg;
      let f = 0;
      let u = 0;
      let cr = 0;
      for (const [km, w] of COVER.near) {
        coverMask(q.x + (nx * km) / kpu, q.y + (ny * km) / kpu, m);
        if (m.data) any = true;
        f += m.forest * w;
        u += m.urban * w;
        cr += m.crop * w;
      }
      const kind = u >= COVER.town ? 'dorf' : f >= COVER.wood ? 'wald' : cr >= 0.5 ? 'feld' : 'wiese';
      sides[name].push([s, kind]);
    }
  }
  if (!any) return null;
  const runs = (S) => {
    let R = [];
    for (let i = 0; i < S.length; i++) {
      const s0 = i ? (S[i - 1][0] + S[i][0]) / 2 : 0;
      const s1 = i + 1 < S.length ? (S[i][0] + S[i + 1][0]) / 2 : len;
      const last = R[R.length - 1];
      if (last && last[2] === S[i][1]) last[1] = s1;
      else R.push([s0, s1, S[i][1]]);
    }
    // zu kurze Läufe gehen im längeren Nachbarn auf (der kürzeste zuerst), bis alle lang genug sind
    for (;;) {
      let bad = -1;
      for (let i = 0; i < R.length; i++) {
        if (R.length < 2) break;
        if (R[i][1] - R[i][0] < COVER.min[R[i][2]] && (bad < 0 || R[i][1] - R[i][0] < R[bad][1] - R[bad][0])) bad = i;
      }
      if (bad < 0) break;
      const p = R[bad - 1];
      const nx = R[bad + 1];
      const into = !p ? nx : !nx ? p : p[1] - p[0] >= nx[1] - nx[0] ? p : nx;
      into[0] = Math.min(into[0], R[bad][0]);
      into[1] = Math.max(into[1], R[bad][1]);
      R.splice(bad, 1);
      // gleiche Nachbarn zusammenlegen
      const M = [];
      for (const r of R) {
        const l = M[M.length - 1];
        if (l && l[2] === r[2]) l[1] = r[1];
        else M.push(r);
      }
      R = M;
    }
    return R;
  };
  return { left: runs(sides.left), right: runs(sides.right) };
}

/** Art der Landschaft bei s (Meter ab Abschnittsanfang) auf Seite side (−1 links, +1 rechts), oder null. */
export function coverKindAt(sec, s, side) {
  const c = sectionCover(sec);
  if (!c) return null;
  for (const r of side < 0 ? c.left : c.right) if (s >= r[0] && s < r[1]) return r[2];
  return null;
}
