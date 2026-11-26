// Abgleich des Wassers mit dem Straßennetz der Karte (für tools/map/wasser.mjs). Was die Karte als Brücke zeigt, ist
// in der Welt eine (COMMON.md §9) – darum darf die Karte nur dort Wasser unter einer Straße zeigen, wo eine echte
// Brücke hingehört. Die Linien von Natural Earth und die vereinfachten Straßen der Karte (data.js, Zwischenpunkte
// etwa alle 1,5 km) treffen sich aber auch dort, wo in Wahrheit nichts kreuzt: Ein Fluss, der neben der Straße im Tal
// liegt, pendelt über sie und zurück, ein Seeufer schneidet die Ecke einer Uferstraße, ein Fluss läuft mitten durch
// einen Knoten. Hier wird das Wasser – nie die Straße – an solchen Stellen ein Stück zur Seite gelegt:
//
// 1. Knoten und Ortspunkte bekommen einen Kreis ohne Wasser (node, pin km): Rampen, Verbindungsfahrbahnen und
//    Ortsdurchfahrten sind auf der Karte kleine Bögen um sie herum und sollen nie über Wasser führen. Ein Fluss
//    weicht dem Kreis auf der Seite aus, auf der er ihn ohnehin streift; ein See bekommt eine Bucht. Ein Kreis reicht
//    höchstens bis knapp vor die nächste fremde Straße (0,45 × ihr Abstand), sonst schöbe er den Fluss über die
//    Straße am anderen Ufer. Ein Ort auf einer Halbinsel, die Natural Earth im See nicht zeigt (net.peninsulas:
//    Sirmione), bekommt statt der Bucht einen Landstreifen vom Ufer bis um seinen Knoten.
// 2. Kreuzt ein Fluss dieselbe Straße (oder denselben Zubringer) zweimal kurz hintereinander (weniger als gap km
//    Straße dazwischen), ist das ein Pendeln über die Straße: Das Stück jenseits kommt off km neben die Straße auf
//    die Seite, von der der Fluss kam (liegt dort näher als 2 × off eine andere Straße, etwa die am anderen Ufer im
//    Rheintal, in die Mitte zwischen beide). Weiter auseinander (bis gapFar: eine Straße im Flusstal, die in Wahrheit am
//    Ufer bleibt, etwa am Rhein bei Koblenz oder an der Mosel) nur, wenn der Fluss danach seltener über Straßen führt –
//    zwischen zwei Straßen an beiden Ufern pendelte er sonst hin und her.
// 3. Durchquert eine Straße einen See auf weniger als skim km, streift sie sein Ufer: Der kleinere Teil des Sees
//    jenseits der Straße kommt off km neben sie. Längere Querungen bleiben (Dämme und Brücken über Seen).
// Was übrig bleibt, sind echte Kreuzungen; dort baut die Welt Brücken (src/map/crossings.js).
//
// Rechnet in Kartenkoordinaten (Mercator wie project() in graph.js: x = Länge, y = −Mercator-Breite in Grad). Die
// Karte ist winkeltreu: In beiden Richtungen sind es kmScale(Breite) km je Einheit.

export const ABGLEICH = {
  node: 0.8, // km um jeden Knoten ohne Wasser
  pin: 0.4, // km um jeden Ortspunkt ohne Wasser
  gap: 3, // km Straße: zwei Kreuzungen desselben Flusses näher beieinander sind ein Pendeln …
  gapFar: 40, // km: … und bis hierher, wenn das Verlegen Kreuzungen spart (Straßen im Flusstal) …
  farKeep: 2.5, // km: … und das verlegte Wasser so weit (über ihren Kreis hinaus) von Knoten und Orten bleibt
  off: 0.25, // km: so weit neben der Straße liegt das verlegte Wasser
  skim: Infinity, // km: kürzere Wege durch einen See streifen nur sein Ufer
  step: 0.1, // km: so dicht werden Linien nahe am Netz für das Verlegen unterteilt
  near: 4, // km: so nah am Netz wird unterteilt
  debug: !!process.env.WASSER_DEBUG, // Protokoll der Runden
};

const KM = 111.32;
const RAD = Math.PI / 180;
/** Breite (Grad) zur Kartenhöhe y. */
export const latOfY = (y) => Math.atan(Math.sinh(-y * RAD)) / RAD;
/** km je Karteneinheit in der Kartenhöhe y. */
export const kmAt = (y) => KM * Math.max(0.2, Math.cos(latOfY(y) * RAD));

/** Schnitt der Strecken a–b und c–d: [t auf a–b, u auf c–d] oder null. */
export function segCross(ax, ay, bx, by, cx, cy, dx, dy) {
  const rx = bx - ax;
  const ry = by - ay;
  const sx = dx - cx;
  const sy = dy - cy;
  const den = rx * sy - ry * sx;
  if (Math.abs(den) < 1e-18) return null;
  const qx = cx - ax;
  const qy = cy - ay;
  const t = (qx * sy - qy * sx) / den;
  const u = (qx * ry - qy * rx) / den;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1 ? [t, u] : null;
}

/** Strecken des Netzes in einem Gitter: {line, k (Segment), ax, ay, bx, by}. */
class Grid {
  constructor(cell) {
    this.cell = cell;
    this.map = new Map();
  }
  key(i, j) {
    return i * 1000003 + j;
  }
  add(item, x0, y0, x1, y1) {
    const c = this.cell;
    for (let i = Math.floor(Math.min(x0, x1) / c); i <= Math.floor(Math.max(x0, x1) / c); i++)
      for (let j = Math.floor(Math.min(y0, y1) / c); j <= Math.floor(Math.max(y0, y1) / c); j++) {
        const k = this.key(i, j);
        let L = this.map.get(k);
        if (!L) this.map.set(k, (L = []));
        L.push(item);
      }
  }
  /** Alles in den Zellen des Rechtecks (ohne Doppelte). */
  query(x0, y0, x1, y1, out = new Set()) {
    const c = this.cell;
    for (let i = Math.floor(Math.min(x0, x1) / c); i <= Math.floor(Math.max(x0, x1) / c); i++)
      for (let j = Math.floor(Math.min(y0, y1) / c); j <= Math.floor(Math.max(y0, y1) / c); j++) {
        const L = this.map.get(this.key(i, j));
        if (L) for (const it of L) out.add(it);
      }
    return out;
  }
}

/** Nächster Punkt auf dem Linienzug P = [x, y, …] zu (x, y): {x, y, d, k (Segment), t}. */
export function footOn(P, x, y) {
  let best = { x: P[0], y: P[1], d: Infinity, k: 0, t: 0 };
  for (let k = 0; k + 3 < P.length; k += 2) {
    const dx = P[k + 2] - P[k];
    const dy = P[k + 3] - P[k + 1];
    const l2 = dx * dx + dy * dy;
    const t = l2 > 0 ? Math.max(0, Math.min(1, ((x - P[k]) * dx + (y - P[k + 1]) * dy) / l2)) : 0;
    const fx = P[k] + dx * t;
    const fy = P[k + 1] + dy * t;
    const d = Math.hypot(x - fx, y - fy);
    if (d < best.d) best = { x: fx, y: fy, d, k: k / 2, t };
  }
  return best;
}
/** Seite von (x, y) am Linienzug P beim Fußpunkt f: +1 rechts (y zählt nach Süden), −1 links. */
function sideOf(P, f, x, y) {
  const k = f.k * 2;
  const dx = P[k + 2] - P[k];
  const dy = P[k + 3] - P[k + 1];
  return dx * (y - P[k + 1]) - dy * (x - P[k]) >= 0 ? 1 : -1;
}
/** Einheitsnormale des Linienzugs beim Fußpunkt f zur Seite sg. */
function normalAt(P, f, sg) {
  const k = f.k * 2;
  const dx = P[k + 2] - P[k];
  const dy = P[k + 3] - P[k + 1];
  const l = Math.hypot(dx, dy) || 1;
  return [(-dy / l) * sg, (dx / l) * sg];
}

/** Linienzug [[x, y], …] nahe am Netz unterteilen, so dass kein Stück länger als step km ist. */
function densify(pts, closed, nearNet) {
  const out = [];
  const n = pts.length;
  const m = closed ? n : n - 1;
  for (let i = 0; i < n; i++) {
    out.push(pts[i]);
    if (i >= m) continue;
    const a = pts[i];
    const b = pts[(i + 1) % n];
    const km = Math.hypot(b[0] - a[0], b[1] - a[1]) * kmAt((a[1] + b[1]) / 2);
    if (km <= ABGLEICH.step || !nearNet(a, b)) continue;
    const k = Math.ceil(km / ABGLEICH.step);
    for (let j = 1; j < k; j++) out.push([a[0] + ((b[0] - a[0]) * j) / k, a[1] + ((b[1] - a[1]) * j) / k]);
  }
  return out;
}

function inRing(R, x, y) {
  let c = false;
  for (let i = 0, j = R.length - 1; i < R.length; j = i++) {
    const [xi, yi] = R[i];
    const [xj, yj] = R[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}
function ringArea(R) {
  let a = 0;
  for (let i = 0, j = R.length - 1; i < R.length; j = i++) a += (R[j][0] - R[i][0]) * (R[j][1] + R[i][1]);
  return Math.abs(a) / 2;
}

/**
 * Das Wasser abgleichen. rivers: [{name, cls, pts: [[x, y, …], …]}], lakes: [{name, pts}] (Umriss ohne Wiederholung
 * des ersten Punkts), net: {lines: [Float64Array|Array [x, y, …]] (Autobahnen, Landstraßen, Zubringer), nodes:
 * [[x, y]], pins: [[x, y]]}. Ändert die Punkte der Flüsse und Seen (neue Punkte nur [x, y]) und liefert Zahlen
 * dazu: {circles, pendel, ufer, buchten}.
 */
export function abgleich(rivers, lakes, net) {
  const A = ABGLEICH;
  const stats = { circles: 0, pendel: 0, ufer: 0, buchten: 0, rounds: 0 };
  const grid = new Grid(0.05);
  net.lines.forEach((P, li) => {
    for (let k = 0; k + 3 < P.length; k += 2) grid.add({ li, k: k / 2 }, P[k], P[k + 1], P[k + 2], P[k + 3]);
  });
  const nearNet = (a, b) => {
    const pad = A.near / kmAt(a[1]);
    for (const it of grid.query(Math.min(a[0], b[0]) - pad, Math.min(a[1], b[1]) - pad, Math.max(a[0], b[0]) + pad, Math.max(a[1], b[1]) + pad)) {
      const P = net.lines[it.li];
      const k = it.k * 2;
      for (const q of [a, b]) {
        const dx = P[k + 2] - P[k];
        const dy = P[k + 3] - P[k + 1];
        const l2 = dx * dx + dy * dy || 1;
        const t = Math.max(0, Math.min(1, ((q[0] - P[k]) * dx + (q[1] - P[k + 1]) * dy) / l2));
        if (Math.hypot(P[k] + dx * t - q[0], P[k + 1] + dy * t - q[1]) < pad) return true;
      }
    }
    return false;
  };
  for (const r of rivers) r.pts = densify(r.pts, false, nearNet);
  for (const l of lakes) l.pts = densify(l.pts, true, nearNet);

  // --- 1. Kreise um Knoten und Ortspunkte ---------------------------------------------------------------------
  // Knoten und Ortspunkte an derselben Stelle (unter 0,3 km) sind ein Kreis, der größere; liegen zwei Kreise so nah,
  // dass ein Fluss zwischen ihnen nicht vorbeikäme (Bingen und Rüdesheim beiderseits des Rheins), werden beide kleiner
  const circles = [];
  for (const [p, r] of [...net.nodes.map((q) => [q, A.node]), ...net.pins.map((q) => [q, A.pin])]) {
    const k = kmAt(p[1]);
    const same = circles.find((c) => Math.hypot(c[0] - p[0], c[1] - p[1]) * k < 0.3);
    if (same) same[2] = Math.max(same[2], r);
    else circles.push([p[0], p[1], r]);
  }
  // Orte auf einer Halbinsel, die Natural Earth nicht kennt: ihr Kreis führt einen Landstreifen zum Knoten mit (c[3])
  for (const h of net.peninsulas || []) {
    const c = circles.find((q) => Math.hypot(q[0] - h[0], q[1] - h[1]) * kmAt(h[1]) < 0.3);
    if (c) c[3] = [h[2], h[3]];
  }
  for (const c of circles) {
    const k = kmAt(c[1]);
    for (const o of circles) {
      if (o === c) continue;
      const d = Math.hypot(o[0] - c[0], o[1] - c[1]) * k;
      if (d < c[2] + o[2] + 1) c[2] = Math.max(0.15, Math.min(c[2], (d - 1) * (c[2] / (c[2] + o[2]))));
    }
  }
  // Ein Kreis drückt das Wasser höchstens bis knapp vor die nächste fremde Straße (die nicht durch seinen Mittelpunkt
  // führt): sonst schöbe er einen Fluss über die Straße am anderen Ufer (Bad Salzig, Uferstraßen im Rheintal)
  for (const c of circles) {
    const k = kmAt(c[1]);
    const R = (c[2] * 2.3) / k;
    let dmin = Infinity;
    for (const li of new Set([...grid.query(c[0] - R, c[1] - R, c[0] + R, c[1] + R)].map((it) => it.li))) {
      const d = footOn(net.lines[li], c[0], c[1]).d * k;
      if (d > 0.05) dmin = Math.min(dmin, d);
    }
    if (dmin < Infinity) c[2] = Math.max(0.15, Math.min(c[2], dmin * 0.45));
  }
  const cgrid = new Grid(0.05);
  circles.forEach((c, i) => {
    const r = c[2] / kmAt(c[1]);
    cgrid.add(i, c[0] - r, c[1] - r, c[0] + r, c[1] + r);
  });
  const pushRun = (P, run, closed, c, ru) => {
    // Sehne von außen nach außen; der Fluss weicht auf die Seite aus, auf der der Mittelpunkt nicht liegt
    const n = P.length;
    const i0 = run[0];
    const i1 = run[run.length - 1];
    const a = closed || i0 > 0 ? P[(i0 - 1 + n) % n] : null;
    const b = closed || i1 < n - 1 ? P[(i1 + 1) % n] : null;
    for (const i of run) {
      const p = P[i];
      let nx;
      let ny;
      if (a && b && Math.hypot(b[0] - a[0], b[1] - a[1]) > 1e-12) {
        const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
        nx = -(b[1] - a[1]) / l;
        ny = (b[0] - a[0]) / l;
        if ((c[0] - a[0]) * nx + (c[1] - a[1]) * ny > 0) {
          nx = -nx;
          ny = -ny;
        }
      } else {
        // das Ende der Linie liegt im Kreis: hinaus
        const l = Math.hypot(p[0] - c[0], p[1] - c[1]) || 1;
        nx = (p[0] - c[0]) / l;
        ny = (p[1] - c[1]) / l;
      }
      const qx = p[0] - c[0];
      const qy = p[1] - c[1];
      const qn = qx * nx + qy * ny;
      const R = ru * 1.02;
      const lam = -qn + Math.sqrt(Math.max(0, qn * qn - (qx * qx + qy * qy - R * R)));
      P[i] = [p[0] + nx * lam, p[1] + ny * lam];
    }
  };
  const runsIn = (P, closed, c, ru) => {
    const n = P.length;
    const inside = P.map((p) => Math.hypot(p[0] - c[0], p[1] - c[1]) < ru);
    const runs = [];
    let cur = [];
    for (let i = 0; i < n; i++) {
      if (inside[i]) cur.push(i);
      else if (cur.length) {
        runs.push(cur);
        cur = [];
      }
    }
    if (cur.length) {
      // ein Lauf über das Ende eines Umrisses hinweg gehört zum ersten
      if (closed && runs.length && runs[0][0] === 0) runs[0] = [...cur, ...runs[0]];
      else runs.push(cur);
    }
    return runs;
  };
  const circleFix = (P, closed) => {
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    for (const p of P) {
      x0 = Math.min(x0, p[0]);
      y0 = Math.min(y0, p[1]);
      x1 = Math.max(x1, p[0]);
      y1 = Math.max(y1, p[1]);
    }
    let changed = false;
    for (const ci of cgrid.query(x0, y0, x1, y1)) {
      const c = circles[ci];
      let ch = false;
      const ru = c[2] / kmAt(c[1]);
      if (c[0] + ru < x0 || c[0] - ru > x1 || c[1] + ru < y0 || c[1] - ru > y1) continue;
      if (closed && inRing(P, c[0], c[1]) && c[3]) {
        // Ort auf einer Halbinsel: ein Landstreifen (2 × off breit) vom Ufer in Richtung seines Knotens bis um ihn herum
        const [tx, ty] = c[3];
        let best = null;
        for (let i = 0; i < P.length; i++) {
          const a = P[i];
          const b = P[(i + 1) % P.length];
          const q = segCross(c[0], c[1], tx, ty, a[0], a[1], b[0], b[1]);
          if (q && (!best || q[0] < best.t)) best = { i, t: q[0] };
        }
        if (best) {
          const L = Math.hypot(tx - c[0], ty - c[1]);
          const ux = (tx - c[0]) / L;
          const uy = (ty - c[1]) / L;
          const X = [c[0] + (tx - c[0]) * best.t, c[1] + (ty - c[1]) * best.t];
          const w = ABGLEICH.off / kmAt(c[1]);
          const R = Math.max(ru * 1.05, w * 1.5);
          const h = Math.sqrt(R * R - w * w);
          // die beiden Ränder des Streifens (Seite +1 und −1), vom Ufer zum Kreis
          const edge = (sg) => [
            [X[0] - uy * w * sg, X[1] + ux * w * sg, 'bucht'],
            [c[0] + ux * h - uy * w * sg, c[1] + uy * h + ux * w * sg, 'bucht'],
          ];
          const a0 = P[best.i];
          const first = Math.hypot(edge(1)[0][0] - a0[0], edge(1)[0][1] - a0[1]) < Math.hypot(edge(-1)[0][0] - a0[0], edge(-1)[0][1] - a0[1]) ? 1 : -1;
          const e1 = edge(first);
          const e2 = edge(-first).reverse();
          // um den Kreis auf der Seite weg vom Streifen
          const as = Math.atan2(e1[1][1] - c[1], e1[1][0] - c[0]);
          let ae = Math.atan2(e2[0][1] - c[1], e2[0][0] - c[0]);
          let d = ae - as;
          while (d <= 0) d += 2 * Math.PI;
          const mid = as + d / 2;
          if (Math.cos(mid) * ux + Math.sin(mid) * uy > 0) d -= 2 * Math.PI;
          const arc = [];
          const N = 20;
          for (let k = 1; k < N; k++) arc.push([c[0] + Math.cos(as + (d * k) / N) * R, c[1] + Math.sin(as + (d * k) / N) * R, 'bucht']);
          P.splice(best.i + 1, 0, ...e1, ...arc, ...e2);
          stats.buchten++;
          ch = true;
          continue;
        }
      }
      if (closed && inRing(P, c[0], c[1])) {
        // Punkt im See: eine Bucht vom nächsten Uferpunkt aus um ihn herum
        let bi = 0;
        let bd = Infinity;
        P.forEach((p, i) => {
          const d = Math.hypot(p[0] - c[0], p[1] - c[1]);
          if (d < bd) {
            bd = d;
            bi = i;
          }
        });
        const R = ru * 1.05;
        const a0 = Math.atan2(P[bi][1] - c[1], P[bi][0] - c[0]);
        const ring = [];
        // vom Ufer gerade zum Kreis, ganz herum, zurück zum Ufer (der Schlitz hat keine Fläche)
        const N = 24;
        for (let k = 0; k <= N; k++) {
          const a = a0 + (k / N) * 2 * Math.PI;
          ring.push([c[0] + Math.cos(a) * R, c[1] + Math.sin(a) * R]);
        }
        // die Punkte der Bucht tragen eine Marke: das Ufer an Straßen (ufer) lässt sie stehen, sonst nähme es die Bucht
        // wieder weg, wo eine Straße vom Knoten im See über das Wasser ans Ufer führt (das ist dann eine echte Brücke)
        for (const q of ring) q[2] = 'bucht';
        P.splice(bi + 1, 0, ...ring, [P[bi][0], P[bi][1], 'bucht']);
        stats.buchten++;
        if (ABGLEICH.debug) console.log('Bucht', latOfY(c[1]).toFixed(3), c[0].toFixed(3));
        ch = true;
        continue;
      }
      for (const run of runsIn(P, closed, c, ru)) {
        pushRun(P, run, closed, c, ru);
        ch = true;
      }
      // Strecken, die den Kreis ohne Punkt darin schneiden: unterteilen und noch einmal
      for (let i = 0, guard = 0; i < P.length - (closed ? 0 : 1) && guard < 200; i++) {
        const a = P[i];
        const b = P[(i + 1) % P.length];
        const dx = b[0] - a[0];
        const dy = b[1] - a[1];
        const l2 = dx * dx + dy * dy || 1;
        const t = Math.max(0, Math.min(1, ((c[0] - a[0]) * dx + (c[1] - a[1]) * dy) / l2));
        if (Math.hypot(a[0] + dx * t - c[0], a[1] + dy * t - c[1]) < ru * 0.999 && t > 0 && t < 1) {
          P.splice(i + 1, 0, [a[0] + dx * t, a[1] + dy * t]);
          i--;
          guard++;
          ch = true;
          const run = runsIn(P, closed, c, ru);
          for (const r of run) pushRun(P, r, closed, c, ru);
        }
      }
      if (ch) {
        changed = true;
        stats.circles++;
        if (ABGLEICH.debug && stats.rounds > 30) console.log('Kreis', c.map((v) => +v.toFixed(3)), latOfY(c[1]).toFixed(3));
      }
    }
    return changed;
  };

  // --- Kreuzungen eines Linienzugs mit dem Netz -------------------------------------------------------------------
  /** [{li, a (km Straße ab ihrem Anfang), k (Segment des Wassers), t, x, y}] */
  const lineArc = net.lines.map((P) => {
    const A0 = [0];
    for (let k = 2; k < P.length; k += 2) A0.push(A0[A0.length - 1] + Math.hypot(P[k] - P[k - 2], P[k + 1] - P[k - 1]) * kmAt(P[k + 1]));
    return A0;
  });
  const crossings = (W, closed) => {
    const out = [];
    const n = W.length;
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const a = W[i];
      const b = W[(i + 1) % n];
      for (const it of grid.query(Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[0], b[0]), Math.max(a[1], b[1]))) {
        const P = net.lines[it.li];
        const k = it.k * 2;
        const q = segCross(a[0], a[1], b[0], b[1], P[k], P[k + 1], P[k + 2], P[k + 3]);
        if (!q) continue;
        const L = lineArc[it.li];
        out.push({ li: it.li, a: L[it.k] + (L[it.k + 1] - L[it.k]) * q[1], k: i, t: q[0], x: a[0] + (b[0] - a[0]) * q[0], y: a[1] + (b[1] - a[1]) * q[0] });
      }
    }
    return out;
  };
  /** Abstand (Einheiten) vom Punkt (x, y) in Richtung (nx, ny) bis zur ersten anderen Straße als li, höchstens L. */
  const rayHit = (x, y, nx, ny, L, li) => {
    const ex = x + nx * L;
    const ey = y + ny * L;
    let best = L;
    for (const it of grid.query(Math.min(x, ex), Math.min(y, ey), Math.max(x, ex), Math.max(y, ey))) {
      if (it.li === li) continue;
      const P = net.lines[it.li];
      const k = it.k * 2;
      const q = segCross(x, y, ex, ey, P[k], P[k + 1], P[k + 2], P[k + 3]);
      if (q) best = Math.min(best, q[0] * L);
    }
    return best;
  };
  /**
   * Punkte idx des Wassers W off km neben die Straße li auf die Seite sg legen (Punkte schon dort, weit genug: bleiben).
   * Liegt dort näher als zweimal off eine andere Straße (die am anderen Ufer, etwa im Rheintal), kommt das Wasser in
   * die Mitte zwischen beide.
   */
  const moveTo = (W, idx, li, sg) => {
    const P = net.lines[li];
    for (const i of idx) {
      const p = W[i];
      const f = footOn(P, p[0], p[1]);
      const off = ABGLEICH.off / kmAt(p[1]);
      const [nx, ny] = normalAt(P, f, sg);
      const h = rayHit(f.x, f.y, nx, ny, 2 * off, li);
      if (sideOf(P, f, p[0], p[1]) === sg && f.d >= Math.min(off, h / 2) && f.d < h) continue;
      const o = Math.min(off, h / 2);
      W[i] = [f.x + nx * o, f.y + ny * o];
    }
  };

  // --- 2. Pendeln über eine Straße ------------------------------------------------------------------------------
  const pendel = (r) => {
    const W = r.pts;
    const xs = crossings(W, false);
    const by = new Map();
    for (const c of xs) {
      if (!by.has(c.li)) by.set(c.li, []);
      by.get(c.li).push(c);
    }
    for (const [li, L] of by) {
      L.sort((p, q) => p.a - q.a);
      for (let j = 0; j + 1 < L.length; j++) {
        const [c1, c2] = [L[j], L[j + 1]].sort((p, q) => p.k + p.t - (q.k + q.t));
        const span = Math.abs(L[j + 1].a - L[j].a);
        if (span >= ABGLEICH.gapFar) continue;
        const far = span >= ABGLEICH.gap;
        const tag = li + ':' + Math.round(L[j].a * 10) + ':' + Math.round(L[j + 1].a * 10);
        if (far && r.keep && r.keep.has(tag)) continue;
        // Wasserlänge zwischen den beiden: höchstens dreimal der Weg auf der Straße plus 2 km (sonst eine Schleife)
        let wk = 0;
        for (let i = c1.k; i <= c2.k; i++) wk += Math.hypot(W[i + 1][0] - W[i][0], W[i + 1][1] - W[i][1]) * kmAt(W[i][1]);
        if (wk > 3 * Math.abs(L[j + 1].a - L[j].a) + 2) continue;
        const P = net.lines[li];
        const f0 = footOn(P, W[c1.k][0], W[c1.k][1]);
        const sg = sideOf(P, f0, W[c1.k][0], W[c1.k][1]);
        const before = far ? W.map((p) => p.slice()) : null;
        const idx = [];
        for (let i = c1.k + 1; i <= c2.k; i++) idx.push(i);
        if (!idx.length) {
          // beide Kreuzungen auf demselben Stück: einen Punkt dazwischen einfügen und verlegen
          const m = [(c1.x + c2.x) / 2, (c1.y + c2.y) / 2];
          W.splice(c1.k + 1, 0, m);
          idx.push(c1.k + 1);
        }
        moveTo(W, idx, li, sg);
        // (und nicht nah an Knoten und Orten: dort führen Rampen und Ortsränder von der Straße weg, ein Fluss dicht
        // neben ihr läge zwischen ihnen und der Straße)
        const nearPin = (p) => circles.some((c) => Math.hypot(c[0] - p[0], c[1] - p[1]) * kmAt(p[1]) < c[2] + ABGLEICH.farKeep);
        if (far && (crossings(W, false).length > xs.length - 2 || idx.some((i) => nearPin(W[i])))) {
          // spart nichts (der Fluss läge dann über einer anderen Straße): so lassen und nicht noch einmal versuchen
          W.splice(0, W.length, ...before);
          (r.keep ||= new Set()).add(tag);
          continue;
        }
        stats.pendel++;
        return true;
      }
    }
    return false;
  };

  // --- 3. Seeufer an Straßen ------------------------------------------------------------------------------------
  const ufer = (l) => {
    const W = l.pts;
    const xs = crossings(W, true);
    const by = new Map();
    for (const c of xs) {
      if (!by.has(c.li)) by.set(c.li, []);
      by.get(c.li).push(c);
    }
    for (const [li, L] of by) {
      L.sort((p, q) => p.a - q.a);
      for (let j = 0; j + 1 < L.length; j++) {
        const c1 = L[j];
        const c2 = L[j + 1];
        const span = c2.a - c1.a;
        if (span >= ABGLEICH.skim) continue;
        // nur ein Stück im See (zwischen zwei Kreuzungen kann die Straße auch draußen sein): die Mitte auf der Straße
        const P = net.lines[li];
        const LM = lineArc[li];
        const am = (c1.a + c2.a) / 2;
        let km = 0;
        while (km + 2 < LM.length && LM[km + 1] < am) km++;
        const tm = (am - LM[km]) / (LM[km + 1] - LM[km] || 1);
        const mx = P[km * 2] + (P[km * 2 + 2] - P[km * 2]) * tm;
        const my = P[km * 2 + 1] + (P[km * 2 + 3] - P[km * 2 + 1]) * tm;
        const f = { x: mx, y: my, k: km, t: tm, d: 0 };
        if (!inRing(W, f.x, f.y)) continue;
        // Der Umriss zwischen den beiden Kreuzungen läuft künftig off km neben der Straße her, auf der Seite des
        // übrigen Sees; was jenseits lag (der kleinere Teil, die Kappe), fällt weg
        const n = W.length;
        const arc = (from, to) => {
          const idx = [];
          for (let i = (from + 1) % n; ; i = (i + 1) % n) {
            idx.push(i);
            if (i === to) break;
          }
          return idx;
        };
        const off = ABGLEICH.off / kmAt(my);
        // Stelle auf der Straße bei Bogenlänge a (km), off neben ihr zur Seite sg
        const LA = lineArc[li];
        const along = (sg, a0, a1) => {
          const out = [];
          const put = (x, y, k) => {
            const dx = P[k * 2 + 2] - P[k * 2];
            const dy = P[k * 2 + 3] - P[k * 2 + 1];
            const l = Math.hypot(dx, dy) || 1;
            out.push([x - (dy / l) * sg * off, y + (dx / l) * sg * off]);
          };
          const seg = (a) => {
            let k = 0;
            while (k + 2 < LA.length && LA[k + 1] < a) k++;
            return k;
          };
          const at = (a) => {
            const k = seg(a);
            const t = (a - LA[k]) / (LA[k + 1] - LA[k] || 1);
            put(P[k * 2] + (P[k * 2 + 2] - P[k * 2]) * t, P[k * 2 + 1] + (P[k * 2 + 3] - P[k * 2 + 1]) * t, k);
          };
          const lo = Math.min(a0, a1);
          const hi = Math.max(a0, a1);
          at(lo);
          for (let k = 1; k + 1 < LA.length; k++) if (LA[k] > lo && LA[k] < hi) put(P[k * 2], P[k * 2 + 1], Math.min(k, LA.length - 2));
          at(hi);
          return a0 <= a1 ? out : out.reverse();
        };
        const bucht = (i) => W[i][2] === 'bucht';
        if (bucht(c1.k) || bucht((c1.k + 1) % n) || bucht(c2.k) || bucht((c2.k + 1) % n)) continue;
        let ring;
        if (c1.k === c2.k) {
          // beide Kreuzungen auf derselben Kante des Umrisses: die Straße beult in den See hinein, das Ufer weicht ihr
          // auf der Seite des Sees aus
          const [nx, ny] = normalAt(P, f, 1);
          const sg = inRing(W, f.x + nx * off, f.y + ny * off) ? 1 : -1;
          const first = c1.t <= c2.t ? c1 : c2;
          const last = first === c1 ? c2 : c1;
          const k = c1.k;
          ring = [...W.slice(0, k + 1), ...along(sg, first.a, last.a), ...W.slice(k + 1)];
        } else {
          const A1 = arc(c1.k, c2.k);
          const A2 = arc(c2.k, c1.k);
          const area = (idx, p, q) => ringArea([[p.x, p.y], ...idx.map((i) => W[i]), [q.x, q.y]]);
          const capIs1 = area(A1, c1, c2) <= area(A2, c2, c1);
          if ((capIs1 ? A1 : A2).some(bucht)) continue;
          const rest = capIs1 ? A2 : A1;
          // Seite des übrigen Sees: die seines Punkts gleich an der ersten Kreuzung (weiter weg kann sich die Straße
          // schon gewunden haben)
          const Wr = capIs1 ? W[c1.k] : W[(c1.k + 1) % n];
          const fr = footOn(P, Wr[0], Wr[1]);
          const sg = sideOf(P, fr, Wr[0], Wr[1]);
          // der Umriss läuft von c1 über A1 zu c2 und von c2 über A2 zurück zu c1
          ring = capIs1 ? [...A2.map((i) => W[i]), ...along(sg, c1.a, c2.a)] : [...A1.map((i) => W[i]), ...along(sg, c2.a, c1.a)];
        }
        if (ABGLEICH.debug && stats.ufer < 6) console.log('ufer', li, c1.a.toFixed(2), c2.a.toFixed(2), c1.k, c2.k, W.length, '->', ring.length);
        W.splice(0, W.length, ...ring);
        stats.ufer++;
        return true;
      }
    }
    return false;
  };

  for (let round = 0; round < 40; round++) {
    let any = false;
    for (const r of rivers) if (circleFix(r.pts, false)) any = true;
    for (const l of lakes) if (circleFix(l.pts, true)) any = true;
    for (const r of rivers) for (let g = 0; g < 40 && pendel(r); g++) any = true;
    for (const l of lakes) for (let g = 0; g < 40 && ufer(l); g++) any = true;
    stats.rounds = round + 1;
    if (ABGLEICH.debug) console.log('Runde', round, { ...stats });
    if (!any) break;
  }
  return stats;
}

/** Alle Kreuzungen der Linien des Netzes mit Flüssen und Seen (für die Zahlen von wasser.mjs --stats). */
export function countCrossings(rivers, lakes, lines) {
  let r = 0;
  let l = 0;
  for (const P of lines) {
    for (const W of rivers) {
      for (let i = 0; i + 1 < W.pts.length; i++)
        for (let k = 0; k + 3 < P.length; k += 2) if (segCross(W.pts[i][0], W.pts[i][1], W.pts[i + 1][0], W.pts[i + 1][1], P[k], P[k + 1], P[k + 2], P[k + 3])) r++;
    }
    for (const W of lakes) {
      const n = W.pts.length;
      for (let i = 0; i < n; i++)
        for (let k = 0; k + 3 < P.length; k += 2) if (segCross(W.pts[i][0], W.pts[i][1], W.pts[(i + 1) % n][0], W.pts[(i + 1) % n][1], P[k], P[k + 1], P[k + 2], P[k + 3])) l++;
    }
  }
  return { rivers: r, lakes: l };
}

/** Paare von Kreuzungen desselben Flusses mit derselben Linie, näher als gap km (für --stats). */
export function pairsLeft(rivers, lines) {
  const out = [];
  lines.forEach((P, li) => {
    const A0 = [0];
    for (let k = 2; k < P.length; k += 2) A0.push(A0[A0.length - 1] + Math.hypot(P[k] - P[k - 2], P[k + 1] - P[k - 1]) * kmAt(P[k + 1]));
    rivers.forEach((W, ri) => {
      const xs = [];
      for (let i = 0; i + 1 < W.pts.length; i++)
        for (let k = 0; k + 3 < P.length; k += 2) {
          const q = segCross(W.pts[i][0], W.pts[i][1], W.pts[i + 1][0], W.pts[i + 1][1], P[k], P[k + 1], P[k + 2], P[k + 3]);
          if (q) xs.push({ a: A0[k / 2] + (A0[k / 2 + 1] - A0[k / 2]) * q[1], i, t: q[0] });
        }
      xs.sort((p, q) => p.a - q.a);
      for (let j = 1; j < xs.length; j++) if (xs[j].a - xs[j - 1].a < ABGLEICH.gap) out.push({ li, ri, d: xs[j].a - xs[j - 1].a, i: [xs[j - 1].i, xs[j].i] });
    });
  });
  return out;
}

/**
 * Nach dem Vereinfachen, vor dem Runden auf das Raster von water-data.js: Punkte des Wassers, die näher als clear km an
 * einer Linie des Netzes liegen, rücken auf ihrer Seite auf clear km ab. So kippt das Runden keinen Punkt über die
 * Straße (das gäbe winzige Scheinkreuzungen). pts: [[x, y, …], …] je Linie, wird geändert.
 */
export function clearNet(waters, lines, clear = 0.05) {
  const grid = new Grid(0.05);
  lines.forEach((P, li) => {
    for (let k = 0; k + 3 < P.length; k += 2) grid.add(li, P[k], P[k + 1], P[k + 2], P[k + 3]);
  });
  let moved = 0;
  for (const w of waters) {
    for (let i = 0; i < w.pts.length; i++) {
      const p = w.pts[i];
      const c = clear / kmAt(p[1]);
      for (const li of grid.query(p[0] - c, p[1] - c, p[0] + c, p[1] + c)) {
        const P = lines[li];
        const f = footOn(P, p[0], p[1]);
        if (f.d >= c) continue;
        const sg = sideOf(P, f, p[0], p[1]);
        const [nx, ny] = normalAt(P, f, sg);
        w.pts[i] = [f.x + nx * c, f.y + ny * c, ...p.slice(2)];
        moved++;
      }
    }
  }
  return moved;
}
