// Flüsse neben der Straße: wo die Karte einen Fluss ein Stück weit neben einer Landstraße oder Autobahn zeigt (die
// Uferstraßen im Rheintal, eine Straße im Flusstal), zeigt die Welt ihn auch – COMMON.md §9: das Navi zeigt nur, was
// die Welt hat, und umgekehrt. Rein rechnerisch, läuft auch unter Node; die eine Wahrheit für die Welt
// (world/xxl/riverbands.js baut Wasser und Ufer), den Bewuchs (nichts im Wasser) und die Nahansicht des Navis
// (map/roadahead.js zeigt dasselbe Band).
//
// Auf der Karte: Die Linie der Kante wird alle STEP_KM abgetastet; zu jeder Stelle der nächste Fluss, wenn er näher als
// near km liegt und ungefähr in Richtung der Straße läuft (höchstens deg Grad dagegen). Stellen am selben Fluss auf
// derselben Seite bilden einen Lauf; Läufe ab minKm Kartenweg zählen.
//
// In der Welt: Der Lauf liegt auf dem Abschnitt an der Stelle seines Anteils am Kartenweg (wie die Brücken,
// map/crossings.js) als gerades Band neben der Straße: das Wasser so breit wie unter einer Brücke derselben Klasse,
// das innere Ufer gap Meter hinter dem Asphalt, bei Flüssen weiter weg auf der Karte entsprechend weiter. An seinen
// Enden biegt der Fluss rechtwinklig von der Straße weg in den Dunst (so wie er auf der Karte die Straße verlässt).
// Abstand halten die Enden vom Anfang und Ende des Abschnitts (Knotenpunkte, Ortstafeln, Szenenwechsel) und von den
// Ruhezonen der Brücken.
import { edges, deEdge } from './graph.js';
import { edgeLine, kmPerUnit } from './mapview.js';
import { waterData } from './water.js';
import { BRIDGE, sectionWater } from './crossings.js';

/**
 * Maße. step: Abtastung der Kante (km) · near: so nah liegt ein Fluss neben der Straße (km, Mitte des Flusses) ·
 * deg: höchstens so schräg zur Straße · minKm: so lang muss ein Lauf auf der Karte sein · hole: so viele Abtaststellen
 * ohne Fluss überbrückt ein Lauf · gap: Meter vom Asphalt bis zur Oberkante des inneren Ufers (bei einem Fluss am
 * Rand der Karte, near0 km von ihrer Linie) · far: so weit höchstens (Meter), wenn er auf der Karte weiter weg liegt ·
 * drop: Wasserspiegel unter der Straße je Klasse – flacher als unter einer Brücke, damit man vom Wagen aus aufs Wasser
 * sieht (eine Uferstraße liegt knapp über dem Fluss) ·
 * near0: so weit liegt eine Uferstraße auf der Karte neben der Mitte des Flusses (tools/map/quelle/ufer.py) · win:
 * so weit bleibt ein Band vom Anfang und Ende des Abschnitts (Meter, dazu die Breite seines Bogens) · clear: so viel
 * Land zwischen einem Band und der Ruhezone einer Brücke · min: kürzer wird kein Band (Meter).
 */
export const SHORE = { step: 0.2, near: 0.75, deg: 35, minKm: 1.5, hole: 2, gap: 6, drop: [2.6, 2.2, 1.8], far: 340, near0: 0.4, win: 40, clear: 40, min: 160 };

const RIVER_CLS_MAX = 2;

function unit(x, y) {
  const l = Math.hypot(x, y);
  return l > 1e-15 ? [x / l, y / l] : [0, -1];
}

/** Nächster Punkt des Linienzugs R (x, y, …) zu (px, py): {d2, j (Strecke), t, dx, dy (Richtung der Strecke)}. */
function nearestOn(R, px, py, best) {
  for (let j = 0; j + 3 < R.length; j += 2) {
    const ax = R[j];
    const ay = R[j + 1];
    const vx = R[j + 2] - ax;
    const vy = R[j + 3] - ay;
    const l2 = vx * vx + vy * vy;
    if (!(l2 > 0)) continue;
    let t = ((px - ax) * vx + (py - ay) * vy) / l2;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    const qx = ax + vx * t - px;
    const qy = ay + vy * t - py;
    const d2 = qx * qx + qy * qy;
    if (d2 < best.d2) {
      best.d2 = d2;
      best.j = j / 2;
      best.t = t;
      best.qx = qx;
      best.qy = qy;
      best.vx = vx;
      best.vy = vy;
      best.hit = true;
    }
  }
}

const edgeCache = new Map();
/**
 * Flüsse neben der Kante i (Richtung a → b): [{a0, a1 (Bogenlänge auf ihrer Linie, Einheiten), side (+1 rechts,
 * −1 links in Richtung a → b), d (km, Mittel des Abstands zur Mitte des Flusses), ri, name, cls}], dazu len
 * (Länge der Linie, Einheiten).
 */
export function edgeShores(i) {
  let out = edgeCache.get(i);
  if (out) return out;
  out = { len: 0, list: [] };
  edgeCache.set(i, out);
  if (edges[i].kind !== 'ab' && edges[i].kind !== 'land') return out;
  const P = edgeLine(i);
  const A = [0];
  for (let k = 2; k < P.length; k += 2) A.push(A[A.length - 1] + Math.hypot(P[k] - P[k - 2], P[k + 1] - P[k - 1]));
  const len = A[A.length - 1];
  out.len = len;
  if (!(len > 0)) return out;
  const W = waterData();
  const kpu = kmPerUnit(P[1]);
  const step = SHORE.step / kpu;
  const near = SHORE.near / kpu;
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (let k = 0; k < P.length; k += 2) {
    x0 = Math.min(x0, P[k]);
    x1 = Math.max(x1, P[k]);
    y0 = Math.min(y0, P[k + 1]);
    y1 = Math.max(y1, P[k + 1]);
  }
  const cand = W.rivers.filter((r) => r.cls <= RIVER_CLS_MAX && r.box[0] <= x1 + near && r.box[2] >= x0 - near && r.box[1] <= y1 + near && r.box[3] >= y0 - near);
  if (!cand.length) return out;
  // von jedem Fluss nur die Stücke, die der Kante nahe genug kommen können (der Rhein ist lang): Linienzüge zum Absuchen
  const runs = cand.map((r) => {
    const R = r.pts;
    const list = [];
    let cur = null;
    for (let j = 0; j + 3 < R.length; j += 2) {
      const hit = Math.min(R[j], R[j + 2]) <= x1 + near && Math.max(R[j], R[j + 2]) >= x0 - near
        && Math.min(R[j + 1], R[j + 3]) <= y1 + near && Math.max(R[j + 1], R[j + 3]) >= y0 - near;
      if (!hit) {
        cur = null;
        continue;
      }
      if (!cur) list.push((cur = [R[j], R[j + 1]]));
      cur.push(R[j + 2], R[j + 3]);
    }
    return list;
  });
  const cosMax = Math.cos((SHORE.deg * Math.PI) / 180);
  // Abtastung: je Stelle der nächste Fluss, der nah genug und gleichläufig ist
  const n = Math.max(2, Math.ceil(len / step) + 1);
  const samples = [];
  let k = 0;
  for (let si = 0; si < n; si++) {
    const a = (len * si) / (n - 1);
    while (k + 2 < A.length && A[k + 1] < a) k++;
    const sl = A[k + 1] - A[k] || 1;
    const t = Math.min(Math.max((a - A[k]) / sl, 0), 1);
    const px = P[k * 2] + (P[k * 2 + 2] - P[k * 2]) * t;
    const py = P[k * 2 + 1] + (P[k * 2 + 3] - P[k * 2 + 1]) * t;
    const [dx, dy] = unit(P[k * 2 + 2] - P[k * 2], P[k * 2 + 3] - P[k * 2 + 1]);
    let pick = null;
    for (let ci = 0; ci < cand.length; ci++) {
      const r = cand[ci];
      if (px < r.box[0] - near || px > r.box[2] + near || py < r.box[1] - near || py > r.box[3] + near) continue;
      const b = { d2: near * near, hit: false };
      for (const R of runs[ci]) nearestOn(R, px, py, b);
      if (!b.hit) continue;
      const [rx, ry] = unit(b.vx, b.vy);
      if (Math.abs(rx * dx + ry * dy) < cosMax) continue;
      if (!pick || b.d2 < pick.d2) pick = { d2: b.d2, ri: r.i, side: b.qx * -dy + b.qy * dx >= 0 ? 1 : -1 };
    }
    samples.push(pick ? { a, ri: pick.ri, side: pick.side, d: Math.sqrt(pick.d2) * kpu } : { a, ri: -1 });
  }
  // Läufe: dieselbe Seite, derselbe Fluss, Lücken bis SHORE.hole Stellen
  let run = null;
  const close = () => {
    if (run && (run.a1 - run.a0) * kpu >= SHORE.minKm) {
      const r = W.rivers[run.ri];
      out.list.push({ a0: run.a0, a1: run.a1, side: run.side, d: run.dsum / run.n, ri: run.ri, name: r.name, cls: r.cls });
    }
    run = null;
  };
  for (let si = 0; si < samples.length; si++) {
    const q = samples[si];
    if (q.ri >= 0 && run && q.ri === run.ri && q.side === run.side && si - run.last <= SHORE.hole + 1) {
      run.a1 = q.a;
      run.last = si;
      run.dsum += q.d;
      run.n++;
      continue;
    }
    if (q.ri < 0) {
      if (run && si - run.last > SHORE.hole) close();
      continue;
    }
    close();
    run = { ri: q.ri, side: q.side, a0: q.a, a1: q.a, last: si, dsum: q.d, n: 1 };
  }
  close();
  return out;
}

/** Halbe Breite des Wassers in der Welt (wie unter einer Brücke derselben Klasse). */
export const shoreHalf = (cls) => BRIDGE.half[Math.min(cls, 2)];

const secCache = new WeakMap();
/**
 * Flüsse neben einem Abschnitt der Fahrt (Landstraße oder Autobahn), nach Lage: [{s0, s1 (Meter ab Abschnittsanfang:
 * das gerade Stück neben der Straße, ohne die Bögen), side (+1 rechts, −1 links), inner (Abstand der Oberkante des
 * inneren Ufers vom Asphaltrand, Meter), half, bank, drop, cls, name, key, map: {a0, a1, ri} (Stück der Kante, Richtung
 * des Abschnitts, Einheiten)}].
 */
export function sectionShores(sec) {
  let out = secCache.get(sec);
  if (out) return out;
  out = [];
  secCache.set(sec, out);
  if ((sec.kind !== 'ab' && sec.kind !== 'land') || !(sec.de >= 0)) return out;
  const e = deEdge(sec.de);
  const sh = edgeShores(e.i);
  if (!sh.list.length || !(sh.len > 0)) return out;
  const L = sec.len;
  const k = L / sh.len;
  const rev = sec.de & 1;
  // Ruhezonen der Brücken auf diesem Abschnitt
  const zones = sectionWater(sec).map((w) => [w.s - w.zone - SHORE.clear, w.s + w.zone + SHORE.clear]);
  for (const q of sh.list) {
    const a0 = rev ? sh.len - q.a1 : q.a0;
    const a1 = rev ? sh.len - q.a0 : q.a1;
    const side = rev ? -q.side : q.side;
    const half = shoreHalf(q.cls);
    const bank = BRIDGE.bank;
    // der Bogen am Ende braucht die Breite des Flusses samt Ufern
    const arm = 2 * (half + bank);
    let s0 = Math.max(a0 * k, SHORE.win + arm);
    let s1 = Math.min(a1 * k, L - SHORE.win - arm);
    // nicht in die Ruhezone einer Brücke: das längere Stück davor oder dahinter bleibt
    for (const [z0, z1] of zones) {
      if (z1 + arm <= s0 || z0 - arm >= s1) continue;
      if (z0 - arm - s0 >= s1 - (z1 + arm)) s1 = Math.min(s1, z0 - arm);
      else s0 = Math.max(s0, z1 + arm);
    }
    if (s1 - s0 < SHORE.min) continue;
    const inner = Math.min(SHORE.far, SHORE.gap + Math.max(0, q.d - SHORE.near0) * 1000);
    out.push({
      s0, s1, side, inner, half, bank, drop: SHORE.drop[Math.min(q.cls, 2)], cls: q.cls, name: q.name,
      key: 'U' + e.i + ':' + Math.round(q.a0 * 1e5) + (rev ? 'r' : ''), map: { a0, a1, ri: q.ri },
    });
  }
  // zwei Bänder auf derselben Seite dürfen sich mit ihren Bögen nicht treffen: das kürzere fällt weg
  out.sort((p, q) => p.s0 - q.s0);
  for (let i = 0; i + 1 < out.length; i++) {
    const p = out[i];
    for (let j = i + 1; j < out.length; j++) {
      const q = out[j];
      if (q.side !== p.side) continue;
      if (q.s0 - 2 * (q.half + q.bank) < p.s1 + 2 * (p.half + p.bank) + SHORE.clear) {
        if (q.s1 - q.s0 > p.s1 - p.s0) out.splice(i--, 1);
        else out.splice(j, 1);
        break;
      }
    }
  }
  return out;
}
