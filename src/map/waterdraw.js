// Flüsse neben den Straßen sichtbar halten (für mapview.js, rein rechnerisch, läuft auch unter Node).
//
// Wo ein Fluss im Tal neben der Straße liegt, hat ihn der Abgleich (tools/map/wasser-netz.mjs) eine Viertelstunde Wegs
// – 0,25 km – neben die Straße der Karte gelegt, auf die Seite, auf der er in der Welt fließt. Auf der Karte sind das
// je nach Maßstab nur ein, zwei Bildpunkte: Der gezeichnete Strich der Straße (mit Rand) deckt den Fluss dann über
// viele Kilometer zu, und übrig bleiben kurze Flussstücke zwischen den Straßen (die Donau unter der A3 bis Passau, der
// Rhein im Tal unter B9 und B42, die Mosel unter ihren Uferstraßen).
//
// Hier wird der Fluss für das Bild verdrängt, wie es ein Atlas tut: Jeder Punkt des Flusses, der näher an einer
// gezeichneten Straße liegt, als ihr halber Strich, der halbe Fluss und ein Bildpunkt Luft breit sind, rückt von der
// Straße weg auf genau diesen Abstand – immer auf seiner Seite. Dadurch ändert sich nichts daran, wo der Fluss eine
// Straße kreuzt (das sind die Brücken der Welt, src/map/crossings.js): Nahe einer Kreuzung bleibt der Fluss, wie er
// ist (sanft ausgeblendet), und jede Verschiebung, die eine Kreuzung schüfe oder nähme, wird zurückgenommen. Die
// Seite bleibt, die Lage zur Straße bleibt – nur der Abstand passt zum Maßstab.
//
// Kartenkoordinaten wie project() in graph.js; Abstände der Rechnung in Karteneinheiten, Breiten in Bildpunkten.

/** Luft zwischen Straßenrand und Fluss (Bildpunkte) und so weit (Vielfache des Abstands) blendet eine Kreuzung aus. */
export const DISPLACE = { gap: 1, taper: [1.2, 3], step: 0.5, smooth: 2, rounds: 5 };

/** Schnitt der Strecken a–b und c–d (ohne Endpunkte gleich zu behandeln): true, wenn sie sich kreuzen. */
function crosses(ax, ay, bx, by, cx, cy, dx, dy) {
  const rx = bx - ax;
  const ry = by - ay;
  const sx = dx - cx;
  const sy = dy - cy;
  const den = rx * sy - ry * sx;
  if (Math.abs(den) < 1e-18) return false;
  const qx = cx - ax;
  const qy = cy - ay;
  const t = (qx * sy - qy * sx) / den;
  const u = (qx * ry - qy * rx) / den;
  return t >= 0 && t < 1 && u >= 0 && u <= 1;
}

/** Strecken der Straßen in einem Gitter (Zellgröße cell Karteneinheiten). */
class SegGrid {
  constructor(cell) {
    this.cell = cell;
    this.map = new Map();
    this.segs = []; // [ax, ay, bx, by, line]
    this.W = null; // Breite je Linie beim Maßstab der laufenden Rechnung (0: nicht gezeichnet)
  }
  add(ax, ay, bx, by, line) {
    const id = this.segs.length;
    this.segs.push([ax, ay, bx, by, line]);
    const c = this.cell;
    for (let i = Math.floor(Math.min(ax, bx) / c); i <= Math.floor(Math.max(ax, bx) / c); i++)
      for (let j = Math.floor(Math.min(ay, by) / c); j <= Math.floor(Math.max(ay, by) / c); j++) {
        const k = i * 1000003 + j;
        let L = this.map.get(k);
        if (!L) this.map.set(k, (L = []));
        L.push(id);
      }
  }
  /** Ids der Strecken in den Zellen des Rechtecks (jede einmal). */
  query(x0, y0, x1, y1, seen, out) {
    out.length = 0;
    const c = this.cell;
    const i1 = Math.floor(Math.max(x0, x1) / c);
    const j1 = Math.floor(Math.max(y0, y1) / c);
    for (let i = Math.floor(Math.min(x0, x1) / c); i <= i1; i++)
      for (let j = Math.floor(Math.min(y0, y1) / c); j <= j1; j++) {
        const L = this.map.get(i * 1000003 + j);
        if (!L) continue;
        for (const id of L) {
          if (seen[id] === seen.stamp || !this.W[this.segs[id][4]]) continue;
          seen[id] = seen.stamp;
          out.push(id);
        }
      }
    seen.stamp++;
    return out;
  }
}

/**
 * Verdränger für einen Maßstab: roads = [{ pts: Float64Array [x, y, …], w }] die gezeichneten Straßen mit der ganzen
 * Breite ihres Strichs w (Bildpunkte, mit Rand), css = Bildpunkte je Karteneinheit, riverPx(cls, y) = Breite eines
 * Flusses in Bildpunkten in der Kartenhöhe y. Liefert run(pts, cls) → { pts, over, orig }: der verdrängte Linienzug
 * (nahe an Straßen dichter geteilt), je Punkt 1, wo er über den Straßen zu zeichnen ist (oder null), und je Punkt
 * des alten Linienzugs seine Nummer im neuen. Die Rechnung ist örtlich: Ein Ausschnitt des Flusses gibt in seiner
 * Mitte dieselben Punkte wie der ganze Fluss (mapview.js rechnet nur, was ein Bild braucht).
 */
export function makeDisplacer(roads, css, riverPx, opt = {}) {
  const O = { ...DISPLACE, ...opt };
  const u = 1 / css; // ein Bildpunkt in Karteneinheiten
  const grid = gridOf(roads);
  const W = new Float32Array(roads.length);
  let wMax = 0;
  roads.forEach((r, li) => {
    W[li] = r.w;
    wMax = Math.max(wMax, r.w);
  });
  const seen = new Uint32Array(grid.segs.length);
  seen.stamp = 1;
  const ids = [];
  return {
    u,
    run: (pts, cls) => {
      grid.W = W;
      return displaceOne(pts, (y) => riverPx(cls, y), wMax, grid, u, O, seen, ids);
    },
  };
}

// Das Gitter der Straßen hängt nur an ihren Linien, nicht am Maßstab: einmal je Liste (mapview.js gibt immer
// dieselben Linien, die nicht gezeichneten mit w = 0)
const GRIDS = new WeakMap();
function gridOf(roads) {
  const key = roads.lines || roads;
  let g = GRIDS.get(key);
  if (g) return g;
  g = new SegGrid(0.05);
  roads.forEach((r, li) => {
    const P = r.pts;
    for (let k = 0; k + 3 < P.length; k += 2) g.add(P[k], P[k + 1], P[k + 2], P[k + 3], li);
  });
  GRIDS.set(key, g);
  return g;
}

/** Alle Flüsse auf einmal (für die Prüfungen): je Fluss { pts, over, orig }. */
export function displaceRivers(rivers, roads, css, riverPx, opt = {}) {
  const D = makeDisplacer(roads, css, riverPx, opt);
  return rivers.map((r) => D.run(r.pts, r.cls));
}

function displaceOne(P0, rpAt, wMax, grid, u, O, seen, ids) {
  const n0 = P0.length / 2;
  const ident = () => Int32Array.from({ length: n0 }, (_, i) => i);
  if (n0 < 2) return { pts: P0, over: null, orig: ident() };
  const segs = grid.segs;
  // Abstand (Karteneinheiten), den eine Straße der Breite w zum Fluss braucht
  // (die Breite des Flusses hängt an der Kartenhöhe: je Punkt, damit ein Ausschnitt rechnet wie der ganze Fluss)
  const needOf = (w, y) => (w / 2 + rpAt(y) / 2 + O.gap) * u;
  const reachAt = (y) => needOf(wMax, y); // weiter wirkt keine Straße
  // 1. nahe an Straßen dichter teilen, damit auch die Mitte langer Stücke rücken kann
  const near = (x0, y0, x1, y1, pad) => grid.query(x0 - pad, y0 - pad, x1 + pad, y1 + pad, seen, ids).length > 0;
  const D = [P0[0], P0[1]];
  const orig = new Int32Array(n0);
  let any = false;
  for (let i = 1; i < n0; i++) {
    const ax = P0[i * 2 - 2];
    const ay = P0[i * 2 - 1];
    const bx = P0[i * 2];
    const by = P0[i * 2 + 1];
    const reach = reachAt((ay + by) / 2);
    if (near(Math.min(ax, bx), Math.min(ay, by), Math.max(ax, bx), Math.max(ay, by), reach)) {
      any = true;
      const step = Math.max(reach * O.step, 1e-6);
      const L = Math.hypot(bx - ax, by - ay);
      const m = Math.min(400, Math.ceil(L / step));
      for (let j = 1; j < m; j++) D.push(ax + ((bx - ax) * j) / m, ay + ((by - ay) * j) / m);
    }
    orig[i] = D.length / 2;
    D.push(bx, by);
  }
  if (!any) return { pts: P0, over: null, orig: ident() };
  const n = D.length / 2;
  // Länge längs des Flusses bis zu jedem Punkt
  const S = new Float64Array(n);
  for (let i = 1; i < n; i++) S[i] = S[i - 1] + Math.hypot(D[i * 2] - D[i * 2 - 2], D[i * 2 + 1] - D[i * 2 - 1]);
  // 2. Kreuzungen je Straße (Linie): Stellen längs des Flusses
  const cross = new Map(); // line → [s, …]
  const crossAt = []; // je Flussstück: Liste der gekreuzten Linien (für die Prüfung am Ende)
  for (let i = 0; i + 1 < n; i++) {
    const ax = D[i * 2];
    const ay = D[i * 2 + 1];
    const bx = D[i * 2 + 2];
    const by = D[i * 2 + 3];
    let list = null;
    for (const id of grid.query(Math.min(ax, bx), Math.min(ay, by), Math.max(ax, bx), Math.max(ay, by), seen, ids)) {
      const g = segs[id];
      if (!crosses(ax, ay, bx, by, g[0], g[1], g[2], g[3])) continue;
      (list || (list = [])).push(g[4]);
      let C = cross.get(g[4]);
      if (!C) cross.set(g[4], (C = []));
      C.push((S[i] + S[i + 1]) / 2);
    }
    crossAt.push(list);
  }
  // 3. Verschiebung je Punkt: von jeder nahen Straße weg, je Straße nur ihr nächstes Stück
  const V = new Float64Array(n * 2);
  const atCross = new Uint8Array(n); // eine Kreuzung ist nah: hier darf der Fluss unter der Straße liegen (Brücke)
  const best = new Map();
  for (let i = 0; i < n; i++) {
    const x = D[i * 2];
    const y = D[i * 2 + 1];
    best.clear();
    const reach = reachAt(y);
    for (const id of grid.query(x - reach, y - reach, x + reach, y + reach, seen, ids)) {
      const g = segs[id];
      const dx = g[2] - g[0];
      const dy = g[3] - g[1];
      const l2 = dx * dx + dy * dy;
      const t = l2 > 0 ? Math.max(0, Math.min(1, ((x - g[0]) * dx + (y - g[1]) * dy) / l2)) : 0;
      const fx = g[0] + dx * t;
      const fy = g[1] + dy * t;
      const d = Math.hypot(x - fx, y - fy);
      const need = needOf(grid.W[g[4]], y);
      if (d >= need) continue;
      const b = best.get(g[4]);
      if (b && b.d <= d) continue;
      let nx;
      let ny;
      if (d > 1e-12) {
        nx = (x - fx) / d;
        ny = (y - fy) / d;
      } else {
        // genau auf der Straße: zur Seite, auf der der Fluss davor lag
        const l = Math.sqrt(l2) || 1;
        const px = i > 0 ? D[i * 2 - 2] : D[i * 2 + 2];
        const py = i > 0 ? D[i * 2 - 1] : D[i * 2 + 3];
        const sg = dx * (py - g[1]) - dy * (px - g[0]) >= 0 ? 1 : -1;
        nx = (-dy / l) * sg;
        ny = (dx / l) * sg;
      }
      best.set(g[4], { d, need, nx, ny });
    }
    let vx = 0;
    let vy = 0;
    let vmax = 0;
    for (const [line, b] of best) {
      // nahe einer Kreuzung dieser Straße bleibt der Fluss, wie er ist (sanft ausgeblendet)
      let w = 1;
      const C = cross.get(line);
      if (C) {
        let dc = Infinity;
        for (const c of C) dc = Math.min(dc, Math.abs(c - S[i]));
        const a = O.taper[0] * b.need;
        const z = O.taper[1] * b.need;
        const t = Math.max(0, Math.min(1, (dc - a) / (z - a)));
        w = t * t * (3 - 2 * t);
        if (w < 1) atCross[i] = 1;
      }
      const p = (b.need - b.d) * w;
      vx += b.nx * p;
      vy += b.ny * p;
      vmax = Math.max(vmax, p);
    }
    // zwei Straßen von beiden Seiten: nicht weiter rücken als die stärkste allein verlangt
    const vl = Math.hypot(vx, vy);
    if (vl > vmax && vl > 0) {
      vx *= vmax / vl;
      vy *= vmax / vl;
    }
    V[i * 2] = vx;
    V[i * 2 + 1] = vy;
  }
  // 4. glätten (keine Zacken, wo die Straße abknickt), ohne den nötigen Abstand zu verlieren
  for (let p = 0; p < O.smooth; p++) {
    const W2 = V.slice();
    for (let i = 1; i + 1 < n; i++) {
      for (let c = 0; c < 2; c++) W2[i * 2 + c] = (V[i * 2 - 2 + c] + 2 * V[i * 2 + c] + V[i * 2 + 2 + c]) / 4;
      // nie weniger als vorher: die Glättung darf den Fluss nur weiter von der Straße nehmen
      if (Math.hypot(W2[i * 2], W2[i * 2 + 1]) < Math.hypot(V[i * 2], V[i * 2 + 1])) {
        W2[i * 2] = V[i * 2];
        W2[i * 2 + 1] = V[i * 2 + 1];
      }
    }
    V.set(W2);
  }
  // 5. Prüfen: Jedes Stück kreuzt dieselben Straßen wie vorher – sonst die Verschiebung dort zurücknehmen
  const Q = new Float64Array(n * 2);
  const place = () => {
    for (let i = 0; i < n * 2; i++) Q[i] = D[i] + V[i];
  };
  place();
  const same = (i) => {
    const ax = Q[i * 2];
    const ay = Q[i * 2 + 1];
    const bx = Q[i * 2 + 2];
    const by = Q[i * 2 + 3];
    const want = crossAt[i];
    let got = 0;
    for (const id of grid.query(Math.min(ax, bx), Math.min(ay, by), Math.max(ax, bx), Math.max(ay, by), seen, ids)) {
      const g = segs[id];
      if (!crosses(ax, ay, bx, by, g[0], g[1], g[2], g[3])) continue;
      if (!want || !want.includes(g[4])) return false;
      got++;
    }
    return got === (want ? want.length : 0);
  };
  // erst halbieren, nach O.rounds Runden ganz zurück (unverschoben stimmt es immer)
  for (let round = 0; ; round++) {
    let bad = 0;
    for (let i = 0; i + 1 < n; i++) {
      if (same(i)) continue;
      bad++;
      const f = round < O.rounds ? 0.5 : 0;
      if (round > O.rounds + 40) throw new Error('waterdraw: Kreuzungen lassen sich nicht halten');
      for (const j of [i, i + 1]) {
        V[j * 2] *= f;
        V[j * 2 + 1] *= f;
        Q[j * 2] = D[j * 2] + V[j * 2];
        Q[j * 2 + 1] = D[j * 2 + 1] + V[j * 2 + 1];
      }
    }
    if (!bad) break;
  }
  // 6. Was trotzdem unter einer Straße bliebe (zwischen zwei Straßen an beiden Ufern, wie im Rheintal bei kleinem
  // Maßstab), zeichnet die Karte über ihr – außer an Kreuzungen: Dort liegt die Brücke über dem Fluss
  let over = null;
  const tol = 0.25 * u;
  for (let i = 0; i < n; i++) {
    if (atCross[i]) continue;
    const x = Q[i * 2];
    const y = Q[i * 2 + 1];
    const reach = reachAt(y);
    for (const id of grid.query(x - reach, y - reach, x + reach, y + reach, seen, ids)) {
      const g = segs[id];
      const dx = g[2] - g[0];
      const dy = g[3] - g[1];
      const l2 = dx * dx + dy * dy;
      const t = l2 > 0 ? Math.max(0, Math.min(1, ((x - g[0]) * dx + (y - g[1]) * dy) / l2)) : 0;
      if (Math.hypot(x - g[0] - dx * t, y - g[1] - dy * t) < needOf(grid.W[g[4]], y) - tol) {
        (over || (over = new Uint8Array(n)))[i] = 1;
        break;
      }
    }
  }
  return { pts: Q, over, orig };
}

/**
 * Die Läufe eines Flusses, die über den Straßen gezeichnet werden (over aus displaceRivers): je Lauf ein Linienzug,
 * um einen Punkt nach beiden Seiten verlängert, damit er ohne Lücke an den Fluss darunter anschließt.
 */
export function overRuns(pts, over) {
  const out = [];
  if (!over) return out;
  const n = pts.length / 2;
  let i = 0;
  while (i < n) {
    if (!over[i]) {
      i++;
      continue;
    }
    let j = i;
    while (j + 1 < n && over[j + 1]) j++;
    const a = Math.max(0, i - 1);
    const b = Math.min(n - 1, j + 1);
    if (b > a) out.push(pts.slice(a * 2, b * 2 + 2));
    i = j + 1;
  }
  return out;
}
