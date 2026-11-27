// Prüft die Flüsse auf der großen Karte und im Navi (src/map/waterdraw.js über mapview.js), ohne Grafik:
//   node tools/flusskarte-test.mjs
// Bei jedem Maßstab, vom ganzen Europa bis zur Navi-Nahansicht:
// 1. Der verdrängte Fluss kreuzt dieselben gezeichneten Straßen gleich oft wie der Fluss aus water.js –
//    die Brücken der Welt (crossings.js) bleiben, wo die Karte sie zeigt, und keine kommt dazu.
// 2. Kein Stück eines sichtbaren Flusses liegt unter einer Straße versteckt – außer an einer Kreuzung (Brücke) oder
//    dort, wo die Karte ihn über der Straße zeichnet (zwischen zwei Uferstraßen). Gezählt wird, wie viele km vorher
//    versteckt waren und wie viele jetzt.
// 3. Kein Punkt rückt weiter als nötig: höchstens so weit, wie der breiteste Strich samt Fluss und Luft verlangt.
// 4. Die Karte rechnet nur die Stücke, die ein Bild braucht (displacedChunk): Sie stimmen mit dem ganzen Fluss überein.
globalThis.document = undefined;
const { RIVER_DRAW, bucketOf, kmPerUnit } = await import('../src/map/mapview.js');
const { waterData, WATER_CLASS } = await import('../src/map/water.js');

let fails = 0;
let checks = 0;
const ok = (cond, msg) => {
  checks++;
  if (!cond) {
    fails++;
    if (fails <= 30) console.log('FEHLER:', msg);
  }
};

function crosses(ax, ay, bx, by, cx, cy, dx, dy) {
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
  return t >= 0 && t < 1 && u >= 0 && u <= 1 ? t : null;
}

/** Strecken der gezeichneten Straßen in einem Gitter: [ax, ay, bx, by, Linie, Breite]. */
function roadGrid(roads, cell) {
  const map = new Map();
  roads.forEach((r, li) => {
    if (!r.w) return;
    const P = r.pts;
    for (let k = 0; k + 3 < P.length; k += 2) {
      const s = [P[k], P[k + 1], P[k + 2], P[k + 3], li, r.w];
      for (let i = Math.floor(Math.min(s[0], s[2]) / cell); i <= Math.floor(Math.max(s[0], s[2]) / cell); i++)
        for (let j = Math.floor(Math.min(s[1], s[3]) / cell); j <= Math.floor(Math.max(s[1], s[3]) / cell); j++) {
          const key = i * 100003 + j;
          if (!map.has(key)) map.set(key, []);
          map.get(key).push(s);
        }
    }
  });
  return {
    near(x0, y0, x1, y1) {
      const out = new Set();
      for (let i = Math.floor(Math.min(x0, x1) / cell); i <= Math.floor(Math.max(x0, x1) / cell); i++)
        for (let j = Math.floor(Math.min(y0, y1) / cell); j <= Math.floor(Math.max(y0, y1) / cell); j++)
          for (const s of map.get(i * 100003 + j) || []) out.add(s);
      return out;
    },
  };
}

/** Folge der gekreuzten Straßen (Linie) längs eines Linienzugs. */
function crossSeq(P, G) {
  const seq = [];
  for (let i = 0; i + 3 < P.length; i += 2) {
    const hits = [];
    for (const s of G.near(P[i], P[i + 1], P[i + 2], P[i + 3])) {
      const t = crosses(P[i], P[i + 1], P[i + 2], P[i + 3], s[0], s[1], s[2], s[3]);
      if (t !== null) hits.push([t, s[4]]);
    }
    hits.sort((a, b) => a[0] - b[0]);
    for (const h of hits) seq.push(h[1]);
  }
  // gezählt je Straße: An einem Knoten kreuzt der Fluss zwei Straßen dicht hintereinander, dort darf die Reihenfolge
  // um Haaresbreite wechseln
  return seq.sort((a, b) => a - b);
}

const segDist = (x, y, s) => {
  const dx = s[2] - s[0];
  const dy = s[3] - s[1];
  const l2 = dx * dx + dy * dy;
  const t = l2 > 0 ? Math.max(0, Math.min(1, ((x - s[0]) * dx + (y - s[1]) * dy) / l2)) : 0;
  return Math.hypot(x - s[0] - dx * t, y - s[1] - dy * t);
};

/**
 * km eines Flusses, die unter einer Straße liegen (Mitte jedes Stücks näher als halber Strich + halber Fluss), ohne
 * die Umgebung von Kreuzungen (along: so weit längs des Flusses um eine Kreuzung) und ohne Läufe über den Straßen.
 */
function hiddenKm(P, over, G, u, rp, alongPx) {
  // Stellen der Kreuzungen längs des Flusses
  const S = [0];
  for (let i = 2; i < P.length; i += 2) S.push(S[S.length - 1] + Math.hypot(P[i] - P[i - 2], P[i + 1] - P[i - 1]));
  const cr = [];
  for (let i = 0; i + 3 < P.length; i += 2)
    for (const s of G.near(P[i], P[i + 1], P[i + 2], P[i + 3]))
      if (crosses(P[i], P[i + 1], P[i + 2], P[i + 3], s[0], s[1], s[2], s[3]) !== null) cr.push((S[i / 2] + S[i / 2 + 1]) / 2);
  let km = 0;
  for (let i = 0; i + 3 < P.length; i += 2) {
    if (over && over[i / 2] && over[i / 2 + 1]) continue;
    const mx = (P[i] + P[i + 2]) / 2;
    const my = (P[i + 1] + P[i + 3]) / 2;
    const sm = (S[i / 2] + S[i / 2 + 1]) / 2;
    if (cr.some((c) => Math.abs(c - sm) < alongPx * u)) continue;
    const r = 12 * u;
    let hid = false;
    for (const s of G.near(mx - r, my - r, mx + r, my + r)) if (segDist(mx, my, s) < (s[5] / 2 + rp / 2) * u * 0.9) hid = true;
    if (hid) km += (S[i / 2 + 1] - S[i / 2]) * kmPerUnit(my);
  }
  return km;
}

const W = waterData();
const report = [];
for (const css of [12, 30, 60, 120, 250, 500, 1000, 2500, 6000, 15000]) {
  const b = bucketOf(css);
  const X = RIVER_DRAW.displacerFor(css, b, true);
  const u = 1 / X.css;
  const G = roadGrid(X.roads, 0.05);
  let wMax = 0;
  for (const r of X.roads) wMax = Math.max(wMax, r.w);
  let before = 0;
  let after = 0;
  let worstMove = 0;
  let seqBad = 0;
  for (const r of W.rivers) {
    const y = r.pts[1];
    const k = X.kAt(y);
    if (k < WATER_CLASS[r.cls].from) continue;
    const rp = Math.max(1, WATER_CLASS[r.cls].px[0]);
    const res = X.D.run(r.pts, r.cls);
    // 1. dieselben Kreuzungen, je Straße gleich oft
    const a = crossSeq(r.pts, G).join(',');
    const z = crossSeq(res.pts, G).join(',');
    if (a !== z) seqBad++;
    ok(a === z, `Maßstab ${css}: ${r.name} (${r.i}) kreuzt andere Straßen: vorher [${a}] jetzt [${z}]`);
    // 2. versteckt vorher/nachher (Umgebung einer Kreuzung: drei Abstände weit)
    const along = 3 * (wMax / 2 + 6);
    before += hiddenKm(r.pts, null, G, u, rp, along);
    after += hiddenKm(res.pts, res.over, G, u, rp, along);
    // 3. nicht weiter als nötig: jeder alte Punkt liegt an seinem neuen Ort höchstens so weit weg, wie der breiteste
    //    Strich samt dem breitesten Fluss verlangt (der Fluss wird nah so breit wie in echt)
    const rpMax = Math.max(...WATER_CLASS.map((C) => Math.max(C.px[1], C.km * k)));
    const lim = (wMax / 2 + rpMax / 2 + 1.5) * u;
    for (let i = 0; i < r.pts.length / 2; i++) {
      const j = res.orig[i];
      const d = Math.hypot(res.pts[j * 2] - r.pts[i * 2], res.pts[j * 2 + 1] - r.pts[i * 2 + 1]);
      worstMove = Math.max(worstMove, d / u);
      ok(d <= lim, `Maßstab ${css}: ${r.name} Punkt ${i} rückt ${(d / u).toFixed(1)} px (erlaubt ${(lim / u).toFixed(1)})`);
    }
  }
  report.push(`Maßstab ${String(css).padStart(5)} px/Einheit: versteckt vorher ${before.toFixed(0).padStart(5)} km, jetzt ${after.toFixed(1).padStart(5)} km; weitester Ruck ${worstMove.toFixed(1)} px`);
  ok(after <= Math.max(5, before * 0.02), `Maßstab ${css}: noch ${after.toFixed(1)} km Fluss unter Straßen versteckt (vorher ${before.toFixed(0)})`);
  ok(seqBad === 0, `Maßstab ${css}: ${seqBad} Flüsse kreuzen andere Straßen`);
}

// 4. Stückweise wie im Bild = am Stück
{
  const chunks = RIVER_DRAW.riverChunks();
  for (const css of [60, 500, 6000]) {
    const X = RIVER_DRAW.displacerFor(css, bucketOf(css), true);
    const u = 1 / X.css;
    let worst = 0;
    for (const R of chunks) {
      if (R.chunks.length < 3) continue;
      const full = X.D.run(R.pts, R.cls);
      R.chunks.forEach((ch, ci) => {
        const c = RIVER_DRAW.displacedChunk(X, R, ci);
        const s0 = full.orig[ch.i0];
        const s1 = full.orig[ch.i1];
        ok(c.pts.length === (s1 - s0 + 1) * 2, `Maßstab ${css}: Stück ${ci} von ${R.river} hat ${c.pts.length / 2} Punkte, am Stück ${s1 - s0 + 1}`);
        if (c.pts.length !== (s1 - s0 + 1) * 2) return;
        for (let i = 0; i < c.pts.length; i++) worst = Math.max(worst, Math.abs(c.pts[i] - full.pts[s0 * 2 + i]) / u);
      });
    }
    ok(worst < 0.5, `Maßstab ${css}: Stücke weichen bis ${worst.toFixed(2)} px vom ganzen Fluss ab`);
    report.push(`Stücke bei ${css}: größte Abweichung zum ganzen Fluss ${worst.toFixed(3)} px`);
  }
}

console.log(report.join('\n'));
console.log(`${checks} Prüfungen, ${fails} Fehler`);
process.exit(fails ? 1 : 0);
