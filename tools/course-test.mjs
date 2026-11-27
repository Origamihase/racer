// Prüft den Straßenverlauf (src/game/course.js) und die gebogene Welt (src/curve.js) ohne Grafik.
//   node tools/course-test.mjs               Prüfungen und Kennzahlen (Teil von npm test)
//   node tools/course-test.mjs --plots DIR   zusätzlich sechs Verlaufsbilder (SVG) nach DIR
// Gefahren wird zweimal: mit src/map/shapes.js (Platzhalter oder die echten Verläufe aus Paket K1; die Ausgabe nennt,
// welche) und mit einem eigenen künstlichen Satz Verläufe (lange Bögen, S-Kurven, ein Tal mit Pass, mit Höhen, so
// unruhig wie die echten), der zeigt, wie echte Kurven ankommen. Die Kennzahlen (Abschnitt „Spaß“) gehören in den
// Bericht; mit K1s Daten einfach neu laufen lassen.
import { mkdirSync, writeFileSync } from 'node:fs';
import { Vector3, Group } from 'three';
import * as G from '../src/map/graph.js';
import * as shapes from '../src/map/shapes.js';
import { sectionWater } from '../src/map/crossings.js';
import { Trip, J } from '../src/game/trip.js';
import { Course, MapPlanner, JX, KINDS, DS, R_CREST, R_SAG, SIGN_R, ADVISE_R, PROBE, PROBE_MARKS } from '../src/game/course.js';
import { curveTable, curveAt, curveOffset, curveShrink, curvePoint, CURVE_N, CURVE_D0, CURVE_DS } from '../src/curve.js';

/** Name der Verläufe aus src/map/shapes.js: die echten aus Paket K1 (abgeglichen) oder der Platzhalter. */
const SHAPES = (() => {
  for (let i = 0; i < shapes.shapeCount; i++) if (shapes.edgeShape(i).matched >= 1) return 'K1';
  return 'Platzhalter';
})();
let fails = 0;
const ok = (cond, msg) => {
  if (!cond) {
    fails++;
    if (fails <= 50) console.log('FEHLER:', msg);
  }
};
const PI = Math.PI;
const RAD = PI / 180;
const deg = (r) => r / RAD;
const wrap = (a) => a - 2 * PI * Math.floor((a + PI) / (2 * PI));
const fix = (v, n = 1) => (Number.isFinite(v) ? v.toFixed(n) : String(v));
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const argPlots = process.argv.indexOf('--plots');
const PLOTS = argPlots > 0 ? process.argv[argPlots + 1] : null;

// --- 1. Maße ----------------------------------------------------------------------------------------------------
for (const k of Object.keys(JX)) ok(JX[k] === J[k], `JX.${k} = ${JX[k]}, in trip.js aber ${J[k]}`);
ok(curveTable.n === CURVE_N && curveTable.d0 === CURVE_D0 && curveTable.ds === CURVE_DS, 'Maße der Shader-Tabelle');
ok(CURVE_D0 <= -400 && CURVE_D0 + CURVE_DS * (CURVE_N - 1) >= 3200, 'die Tabelle reicht von −400 bis +3200 m');
ok(shapes.shapeCount === G.edges.length, 'shapes.js: eine Form je Kante');
for (let i = 0; i < G.edges.length; i++) {
  const sh = shapes.edgeShape(i);
  const e = G.edges[i];
  const good = sh.n >= 2 && sh.lat instanceof Float64Array && sh.lon instanceof Float64Array && sh.elev instanceof Float32Array && sh.lat.length === sh.n && sh.lon.length === sh.n && sh.elev.length === sh.n && [0, 1, 2].includes(sh.matched);
  ok(good, `shapes.js: Kante ${i} hat nicht die vereinbarte Form`);
  if (!good) continue;
  const A = G.nodes[e.a];
  const B = G.nodes[e.b];
  ok(sh.lat[0] === A.lat && sh.lon[0] === A.lon && sh.lat[sh.n - 1] === B.lat && sh.lon[sh.n - 1] === B.lon, `shapes.js: Kante ${i} beginnt oder endet nicht genau an ihren Knoten`);
}

// --- 2. Die Formel des Shaders in 32-Bit-Gleitkomma (wie auf der Grafikkarte) -----------------------------------
const f32 = Math.fround;
const U0 = 0.7;
/** cwSample + cwOffset + curveWorld aus CURVE_GLSL, Schritt für Schritt gerundet; liest die Tabelle D. */
function gpuPoint(D, wx, wy, wz, out) {
  const d = f32(-wz);
  const u = f32(f32(d - CURVE_D0) / CURVE_DS);
  const j = Math.min(Math.max(Math.floor(u), 0), CURVE_N - 2);
  const t = f32(u - j);
  const tc = Math.min(Math.max(t, 0), 1);
  const a = j * 4;
  const b = a + 4;
  const a1 = (CURVE_N + j) * 4;
  const b1 = a1 + 4;
  const t2 = f32(tc * tc);
  const t3 = f32(t2 * tc);
  const h00 = f32(f32(f32(2 * t3) - f32(3 * t2)) + 1);
  const h10 = f32(f32(f32(t3 - f32(2 * t2)) + tc) * CURVE_DS);
  const h01 = f32(f32(3 * t2) - f32(2 * t3));
  const h11 = f32(f32(t3 - t2) * CURVE_DS);
  const sa = f32(Math.sin(D[a + 2]));
  const ca = f32(Math.cos(D[a + 2]));
  const sb = f32(Math.sin(D[b + 2]));
  const cb = f32(Math.cos(D[b + 2]));
  const ma = f32(h10 * f32(1 - f32(D[a1 + 1] * D[a1])));
  const mb = f32(h11 * f32(1 - f32(D[b1 + 1] * D[b1])));
  let qx = f32(f32(f32(h00 * D[a]) - f32(ma * sa)) + f32(f32(h01 * D[b]) - f32(mb * sb)));
  let qz = f32(f32(f32(h00 * D[a + 1]) - f32(ma * ca)) + f32(f32(h01 * D[b + 1]) - f32(mb * cb)));
  const th = f32(f32(f32(h00 * D[a + 2]) + f32(h10 * D[a1])) + f32(f32(h01 * D[b + 2]) + f32(h11 * D[b1])));
  const Y = f32(f32(f32(h00 * D[a + 3]) + f32(h10 * D[a1 + 2])) + f32(f32(h01 * D[b + 3]) + f32(h11 * D[b1 + 2])));
  let k = f32(D[a1] + f32(f32(D[b1] - D[a1]) * tc));
  const xr = f32(D[a1 + 1] + f32(f32(D[b1 + 1] - D[a1 + 1]) * tc));
  const e = f32(f32(t - tc) * CURVE_DS);
  if (e !== 0) {
    qx = f32(qx - f32(e * (t < 0 ? sa : sb)));
    qz = f32(qz - f32(e * (t < 0 ? ca : cb)));
    k = 0;
  }
  let f = f32(wx);
  let fx = 1;
  const uu = f32(f32(xr - f) * k);
  if (uu > U0) {
    const ee = f32(Math.exp(f32(f32(U0 - uu) / f32(1 - U0))));
    const gu = f32(1 - f32(f32(1 - U0) * ee));
    f = f32(xr - f32(gu / k));
    fx = ee;
  }
  const c = f32(Math.cos(th));
  const s = f32(Math.sin(th));
  out.x = f32(qx + f32(f * c));
  out.z = f32(qz - f32(f * s));
  out.y = f32(f32(f32(wy) * fx) + Y);
  // cwSink: Rückfaltung nach großen Wenden
  if (d >= 200) {
    const r = f32(Math.hypot(out.x, out.z));
    const lo = f32(0.22 * d);
    const tt = Math.min(Math.max(f32(f32(r - lo) / f32(f32(0.32 * d) - lo)), 0), 1);
    out.y = f32(out.y - f32(60 * f32(1 - f32(f32(tt * tt) * f32(3 - 2 * tt)))));
  }
  return out;
}

/**
 * Abweichung CPU (curvePoint) gegen die Shader-Formel und Faltungsfreiheit für die aktuelle Tabelle. Bis 1000 m neben
 * der Straße (alles, was dort steht) höchstens 1 cm; der Boden reicht bis 2600 m, dort am Horizont zählt die
 * Genauigkeit relativ (32-Bit-Rundung tief in der Stauchung, 1e-4 · |x|).
 */
const V = new Vector3();
const GP = { x: 0, y: 0, z: 0 };
const XS = [-2600, -1800, -1000, -420, -150, -52, -20, -7.5, 0, 3.75, 7.25, 12, 36, 90, 300, 420, 1000, 1800, 2600];
const TWIN = { worst: 0, worstFar: 0, worstAt: '', points: 0, folds: 0, cells: 0, crushed: 0, center: 0 };
function checkTable(label) {
  const D = curveTable.data;
  for (let d = -460; d <= 3500; d += 13.7) {
    for (const x of XS) {
      for (const y of [0, 12, 40]) {
        curvePoint(V.set(x, y, -d));
        gpuPoint(D, x, y, -d, GP);
        const err = Math.hypot(V.x - GP.x, V.y - GP.y, V.z - GP.z);
        TWIN.points++;
        const near = Math.abs(x) <= 1000;
        if (!near) TWIN.worstFar = Math.max(TWIN.worstFar, err / Math.abs(x));
        else if (err > TWIN.worst) {
          TWIN.worst = err;
          TWIN.worstAt = `x ${x}, y ${y}, d ${fix(d, 0)}`;
        }
        if (err > (near ? 0.01 : 1e-4 * Math.abs(x))) ok(false, `${label}: CPU und Shader weichen um ${fix(err * 100)} cm ab (x ${x}, y ${y}, d ${fix(d)})`);
      }
    }
  }
  // Faltungsfreiheit. Abgebildet wird X(d, x) = Q(d) + f(x, d) · N(d); die Ableitungen sind ∂X/∂x = fx · N und
  // ∂X/∂d = ρ · T + f_d · N mit ρ = 1 + (f − xref) · k. Die Orientierung (fx · ρ) bleibt, solange fx ≥ 0 und ρ ≥ 0
  // (ρ = 0 hieße: genau im Kurvenmittelpunkt). Geprüft an jedem Punkt eines Gitters über den ganzen Boden (bis
  // 2600 m), dazu mit echten Gitterzellen bis 600 m neben der Straße, wo Bäume, Wälder und Orte stehen. Die Zellen
  // sind dort 25 m × 0,25 m klein genug, dass sie die Abbildung auflösen: Tief innen in einer Übergangskurve
  // wandert der Kurvenmittelpunkt schnell, die gestauchten Punkte mit ihm, und gröbere Zellen werden zu Splittern.
  const fr = { x: 0, z: 0, th: 0, y: 0, k: 0, dk: 0, xr: 0, g: 0 };
  for (let d = -400; d <= 3400; d += 5) {
    const c = curveAt(d, fr);
    for (let x = -2600; x <= 2600; x += 25) {
      const f = curveOffset(x, c.k, c.xr);
      TWIN.cells++;
      if (1 + (f - c.xr) * c.k < -1e-12 || !(curveShrink(x, c.k, c.xr) >= 0)) TWIN.center++;
      if (curveShrink(x, c.k, c.xr) < 0.02) TWIN.crushed++;
    }
  }
  const XN = 49;
  let ox = new Float64Array(XN);
  let oz = new Float64Array(XN);
  let nx = new Float64Array(XN);
  let nz = new Float64Array(XN);
  let oq = new Float64Array(XN);
  let nq = new Float64Array(XN);
  let bad = 0;
  for (let jd = 0; jd <= 15200; jd++) {
    const c = curveAt(-400 + jd * 0.25, fr);
    const cs = Math.cos(c.th);
    const sn = Math.sin(c.th);
    for (let ix = 0; ix < XN; ix++) {
      const f = curveOffset(-600 + ix * 25, c.k, c.xr);
      nx[ix] = c.x + f * cs;
      nz[ix] = c.z - f * sn;
      nq[ix] = Math.min(curveShrink(-600 + ix * 25, c.k, c.xr), 1 + (f - c.xr) * c.k);
    }
    // Zelle zwischen der letzten und dieser Reihe: gerade Welt e1 = (25, 0), e2 = (0, −0,25) → Kreuzprodukt negativ
    for (let ix = 1; jd && ix < XN; ix++) {
      if (Math.min(oq[ix], oq[ix - 1], nq[ix - 1]) < 0.02) continue; // fast im Mittelpunkt: siehe oben
      const e1x = ox[ix] - ox[ix - 1];
      const e1z = oz[ix] - oz[ix - 1];
      const e2x = nx[ix - 1] - ox[ix - 1];
      const e2z = nz[ix - 1] - oz[ix - 1];
      if (e1x * e2z - e1z * e2x >= 0) bad++;
    }
    [ox, nx] = [nx, ox];
    [oz, nz] = [nz, oz];
    [oq, nq] = [nq, oq];
  }
  TWIN.folds += bad;
  ok(bad === 0, `${label}: ${bad} Gitterzellen klappen um`);
}

// --- 3. Kurvenprobe und Endlos-Kurs ----------------------------------------------------------------------------
{
  const c = new Course();
  c.mode = 'probe';
  c.resetVirtual('probe');
  const at = (s) => {
    c.fill(null, s, curveTable);
    return c.state;
  };
  // jede Station beginnt gerade; die Bögen haben genau den entworfenen Halbmesser
  for (const [name, s] of Object.entries(PROBE_MARKS)) ok(Math.abs(at(s + 1).kappa) < 1e-9, `Kurvenprobe: ${name} beginnt nicht gerade`);
  ok(Math.abs(at(PROBE_MARKS['Langer Bogen'] + 1200).kappa + 1 / 1300) < 1e-6, 'Kurvenprobe: langer Bogen R 1300');
  ok(Math.abs(at(PROBE_MARKS['Enge Kurve'] + 615).kappa - 1 / 430) < 1e-6, 'Kurvenprobe: enge Kurve R 430');
  ok(Math.abs(at(PROBE_MARKS.Schleife + 600).kappa + 1 / 185) < 1e-6, 'Kurvenprobe: Schleife R 185');
  const psi0 = at(PROBE_MARKS['Langer Bogen']).psi;
  ok(Math.abs(deg(at(PROBE_MARKS['S-Kurve']).psi - psi0) + 70) < 0.5, 'Kurvenprobe: der lange Bogen dreht um 70° nach rechts');
  for (const s of [PROBE_MARKS['Langer Bogen'] + 1100, PROBE_MARKS['Enge Kurve'] + 600, PROBE_MARKS.Kuppe + 700, PROBE_MARKS.Schleife + 450, PROBE_MARKS['Landstraße'] + 300, PROBE_MARKS['Landstraße'] + 1400]) {
    at(s);
    checkTable('Kurvenprobe bei ' + s);
  }
  // Endlos-Kurs: gleich bei gleichem Saatwert, auch nach einem Sprung
  const a = new Course();
  const b = new Course();
  const ta = new Float32Array(curveTable.data.length);
  let same = true;
  let maxK = 0;
  let maxPsi = 0;
  let maxG = 0;
  for (let s = 0; s < 40000; s += 4) {
    a.fill(null, s, curveTable, 4 / 38);
    maxK = Math.max(maxK, Math.abs(a.state.kappa));
    maxG = Math.max(maxG, Math.abs(a.state.grade));
    maxPsi = Math.max(maxPsi, Math.abs(a.state.psi));
    if (s % 9000 === 0 && s > 0) {
      ta.set(curveTable.data);
      b.fill(null, s, curveTable);
      for (let i = 0; i < ta.length; i++) if (ta[i] !== curveTable.data[i]) same = false;
      checkTable('Endlos-Kurs bei ' + s);
    }
  }
  ok(same, 'Endlos-Kurs: nach einem Sprung nicht derselbe Verlauf');
  ok(maxK <= KINDS.ab.kmax + 1e-9, 'Endlos-Kurs: zu eng ' + 1 / maxK);
  ok(maxG <= KINDS.ab.gmax + 1e-9, 'Endlos-Kurs: zu steil ' + maxG);
  ok(maxPsi < 75 * RAD, 'Endlos-Kurs: entfernt sich zu weit von der Ausgangsrichtung ' + fix(deg(maxPsi)));
  console.log(`Endlos-Kurs (40 km): engster Halbmesser ${fix(1 / maxK, 0)} m, größte Steigung ${fix(maxG * 100)} %, Kurs höchstens ${fix(deg(maxPsi), 0)}° von der Ausgangsrichtung`);
}

// --- 4. Künstliche Verläufe mit derselben Schnittstelle wie shapes.js ------------------------------------------
// So, wie echte Verläufe ankommen: Jede Straße läuft an ihren Knoten ohne Knick weiter (eine gemeinsame Richtung je
// Straße und Knoten, etwas neben der Winkelhalbierenden), dazwischen lange Bögen, S-Kurven oder ein Tal mit Pass,
// Landstraßen lebhafter. Höhen je Knoten gemeinsam (Norden flach, Mittelgebirge, Alpen), dazwischen Hügel, auf dem
// Pass ein Scheitel. Stützpunkte etwa alle 900 m wie bei einer vereinfachten Linie.
function hashInt(a, b = 0) {
  let h = Math.imul(a ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(b + 0x632be59b, 0xc2b2ae35);
  h = Math.imul(h ^ (h >>> 16), 0x7feb352d);
  return (h ^ (h >>> 15)) >>> 0;
}
const SYN_STYLE = [];
const synth = (() => {
  const KY = 110540;
  const kxAt = (lat) => 111320 * Math.cos(lat * RAD);
  const region = (nd) => (nd.lat < 47.9 || ['CH', 'AT', 'LI'].includes(nd.cc) ? 'alpen' : nd.lat < 52.3 ? 'mitte' : 'nord');
  const nodeElev = (n) => {
    const nd = G.nodes[n];
    const r = rng(hashInt(n, 1))();
    return { alpen: 450 + 800 * r, mitte: 110 + 400 * r, nord: 4 + 60 * r }[region(nd)];
  };
  const tangents = new Map();
  /** Richtung (Ost, Nord) der Straße am Knoten in ihrer Reihenfolge: Winkelhalbierende ± bis zu 10°. */
  const tangent = (n, road) => {
    const key = `${n}/${road}`;
    if (tangents.has(key)) return tangents.get(key);
    const ns = G.roads[road].nodes;
    const i = ns.indexOf(n);
    const nd = G.nodes[n];
    const kx = kxAt(nd.lat);
    const dir = (p, q) => {
      const x = (q.lon - p.lon) * kx;
      const y = (q.lat - p.lat) * KY;
      const l = Math.hypot(x, y) || 1;
      return [x / l, y / l];
    };
    let x = 0;
    let y = 0;
    if (i > 0) [x, y] = dir(G.nodes[ns[i - 1]], nd);
    if (i >= 0 && i + 1 < ns.length) {
      const [qx, qy] = dir(nd, G.nodes[ns[i + 1]]);
      x += qx;
      y += qy;
    }
    const a = (rng(hashInt(n, road + 977))() - 0.5) * 20 * RAD;
    const l = Math.hypot(x, y) || 1;
    const t = [(x * Math.cos(a) - y * Math.sin(a)) / l, (x * Math.sin(a) + y * Math.cos(a)) / l];
    tangents.set(key, t);
    return t;
  };
  const cache = new Map();
  return {
    shapeCount: G.edges.length,
    edgeShape(i) {
      let sh = cache.get(i);
      if (sh) return sh;
      const e = G.edges[i];
      const A = G.nodes[e.a];
      const B = G.nodes[e.b];
      const kx = kxAt((A.lat + B.lat) / 2);
      const bx = (B.lon - A.lon) * kx;
      const by = (B.lat - A.lat) * KY;
      const D = Math.max(1, Math.hypot(bx, by));
      const ux = bx / D;
      const uy = by / D;
      const r = rng(hashInt(i, 7));
      const sg = () => (r() < 0.5 ? -1 : 1);
      const road = e.kind === 'ab' || e.kind === 'land';
      if (!road) {
        sh = { n: 2, lat: Float64Array.of(A.lat, B.lat), lon: Float64Array.of(A.lon, B.lon), elev: new Float32Array(2), matched: 0 };
        cache.set(i, sh);
        return sh;
      }
      // Richtungen an den Knoten (gegen die Reihenfolge der Straße umgedreht), höchstens 55° neben der Sehne
      const ns = G.roads[e.road].nodes;
      const flip = ns.indexOf(e.a) > ns.indexOf(e.b) ? -1 : 1;
      const lim = (t) => {
        const a = clamp(Math.atan2(ux * t[1] - uy * t[0], ux * t[0] + uy * t[1]), -55 * RAD, 55 * RAD);
        return [ux * Math.cos(a) - uy * Math.sin(a), ux * Math.sin(a) + uy * Math.cos(a)];
      };
      const ta = lim(tangent(e.a, e.road).map((v) => v * flip));
      const tb = lim(tangent(e.b, e.road).map((v) => v * flip));
      const reg = region(A.lat < B.lat ? A : B);
      const p = r();
      const harm = [];
      let style;
      if (e.kind === 'land') {
        style = 'Landstraße';
        for (let k = 2; k <= 10; k += 1 + Math.floor(r() * 2)) harm.push([k, sg() * (0.006 + 0.02 * r()) * D]);
      } else if (p < (reg === 'alpen' ? 0.25 : 0.45)) {
        style = 'lange Bögen';
        harm.push([1, sg() * (0.03 + 0.06 * r()) * D], [2, sg() * (0.01 + 0.025 * r()) * D], [3, sg() * 0.012 * r() * D]);
      } else if (p < (reg === 'alpen' ? 0.5 : 0.8)) {
        // Schwünge bis etwa ±15° (Richtungsänderung je Oberschwingung k ≈ π · k · Amplitude / D)
        style = 'S-Kurven';
        harm.push([2, sg() * 0.02 * r() * D]);
        for (let k = 3; k <= 6; k++) harm.push([k, sg() * (0.002 + 0.005 * r()) * D]);
      } else {
        style = 'Tal mit Pass';
        for (const k of [2, 4, 7]) harm.push([k, sg() * (0.004 + 0.009 * r()) * D]);
      }
      if (e.kind === 'ab') {
        // dazu das Hin und Her echter Autobahnen: Oberschwingungen bis etwa eine je 6 km, jede schwenkt die Richtung
        // um bis zu ±(5…17)° (eigene Zufallsfolge, die Höhen bleiben). Abgeglichen mit K1s echten Verläufen (587c1e5,
        // auf die Spiellänge gestaucht und wie in course.js geglättet): dort 85 Bögen der Karte je 100 km, 49 davon
        // dicht gegensinnig, 28° Richtungsänderung je km; ohne diese Zugabe hier nur 47, 11 und 7°, mit ihr 89, 56
        // und 29°
        const rd = rng(hashInt(i, 11));
        const kd = clamp(Math.round(D / 6000), 4, 16);
        for (let k = 3; k <= kd; k++) harm.push([k, ((rd() < 0.5 ? -1 : 1) * (0.3 + 0.7 * rd()) * 0.1 * D) / k]);
      }
      SYN_STYLE[i] = style;
      const ea = nodeElev(e.a);
      const eb = nodeElev(e.b);
      const pass = style === 'Tal mit Pass' ? { alpen: 350 + 650 * r(), mitte: 90 + 160 * r(), nord: 20 + 25 * r() }[reg] : 0;
      const amp = { alpen: 45, mitte: 25, nord: 6 }[reg];
      const roll = [2, 3, 5, 8].map((k) => [k, sg() * amp * (0.2 + 0.8 * r())]);
      // Kubische Hermite-Kurve mit den Richtungen an den Knoten, dazu Schwünge sin(kπt)·sin(πt) (die Richtung an
      // den Knoten bleibt), seitlich zur Sehne
      const n = Math.max(7, Math.ceil(D / 900)) + 1;
      const lat = new Float64Array(n);
      const lon = new Float64Array(n);
      const elev = new Float32Array(n);
      for (let q = 0; q < n; q++) {
        const t = q / (n - 1);
        const t2 = t * t;
        const t3 = t2 * t;
        const h10 = (t3 - 2 * t2 + t) * D;
        const h01 = 3 * t2 - 2 * t3;
        const h11 = (t3 - t2) * D;
        let o = 0;
        for (const [k, a] of harm) o += a * Math.sin(k * PI * t) * Math.sin(PI * t);
        const x = h10 * ta[0] + h01 * bx + h11 * tb[0] - uy * o;
        const y = h10 * ta[1] + h01 * by + h11 * tb[1] + ux * o;
        lat[q] = A.lat + y / KY;
        lon[q] = A.lon + x / kx;
        let h = ea + (eb - ea) * t + pass * Math.pow(Math.sin(PI * t), 1.5);
        for (const [k, a] of roll) h += a * Math.sin(k * PI * t);
        elev[q] = h;
      }
      lat[0] = A.lat;
      lon[0] = A.lon;
      lat[n - 1] = B.lat;
      lon[n - 1] = B.lon;
      sh = { n, lat, lon, elev, matched: 2 };
      cache.set(i, sh);
      return sh;
    },
  };
})();
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

/** Die künstlichen Verläufe selbst: Länge gegen Luftlinie (wie bei K1 1,0 bis 1,6) und Knicke an den Knoten. */
{
  let worstRatio = 0;
  let worstKink = 0;
  const heads = new Map();
  for (const e of G.edges) {
    if (e.kind !== 'ab' && e.kind !== 'land') continue;
    const sh = synth.edgeShape(e.i);
    const kx = 111320 * Math.cos(sh.lat[0] * RAD);
    let L = 0;
    for (let q = 1; q < sh.n; q++) L += Math.hypot((sh.lon[q] - sh.lon[q - 1]) * kx, (sh.lat[q] - sh.lat[q - 1]) * 110540);
    const D = Math.hypot((sh.lon[sh.n - 1] - sh.lon[0]) * kx, (sh.lat[sh.n - 1] - sh.lat[0]) * 110540);
    if (D > 2000) worstRatio = Math.max(worstRatio, L / D);
    const hd = (q) => Math.atan2((sh.lon[q + 1] - sh.lon[q]) * kx, (sh.lat[q + 1] - sh.lat[q]) * 110540);
    heads.set(e.i, [hd(0), hd(sh.n - 2)]);
  }
  for (const R of G.roads) {
    for (let k = 1; k + 1 < R.nodes.length; k++) {
      const ea = G.edges.find((e) => e.road === R.i && e.b === R.nodes[k]);
      const eb = G.edges.find((e) => e.road === R.i && e.a === R.nodes[k]);
      if (!ea || !eb || !heads.has(ea.i) || !heads.has(eb.i)) continue;
      worstKink = Math.max(worstKink, Math.abs(deg(wrap(heads.get(eb.i)[0] - heads.get(ea.i)[1]))));
    }
  }
  ok(worstRatio <= 1.6, `künstliche Verläufe: bis ${fix(worstRatio, 2)}-mal so lang wie die Luftlinie`);
  console.log(`Künstliche Verläufe: höchstens ${fix(worstRatio, 2)}-mal so lang wie die Luftlinie, Knick an einem Knoten höchstens ${fix(worstKink, 1)}° (Stützpunkte etwa alle 900 m)`);
}

// --- 5. Kartenkurs einer gerichteten Kante (unabhängig von course.js nachgerechnet) -----------------------------
/** Kurs der Karte (links positiv, rad) alle DS Spielmeter entlang der gerichteten Kante. */
function mapHeadings(src, de, len) {
  const e = G.deEdge(de);
  const sh = src.edgeShape(e.i);
  const rev = de & 1;
  const np = sh.n;
  const lat0 = (sh.lat[0] + sh.lat[np - 1]) / 2;
  const kx = 111320 * Math.cos(lat0 * RAD);
  const px = [];
  const py = [];
  for (let i = 0; i < np; i++) {
    const j = rev ? np - 1 - i : i;
    px.push(sh.lon[j] * kx);
    py.push(sh.lat[j] * 110540);
  }
  const cum = [0];
  const seg = [];
  let last = 0;
  for (let i = 0; i + 1 < np; i++) {
    const dx = px[i + 1] - px[i];
    const dy = py[i + 1] - py[i];
    cum.push(cum[i] + Math.hypot(dx, dy));
    let th = Math.hypot(dx, dy) > 1e-6 ? Math.atan2(-dx, dy) : last;
    if (i) th = last + wrap(th - last);
    seg.push(th);
    last = th;
  }
  const c = cum[np - 1] / len;
  const n = Math.round(len / DS) + 1;
  const out = new Float64Array(n);
  let k = 0;
  for (let i = 0; i < n; i++) {
    const u = Math.min(i * DS * c, cum[np - 1]);
    while (k < np - 2 && cum[k + 1] < u) k++;
    out[i] = seg[k];
  }
  return out;
}

// --- 6. Fahrten über die Karte ------------------------------------------------------------------------------------
const TARGETS = ['Köln', 'Hamburg', 'Hannover', 'Kassel', 'Würzburg', 'München', 'Salzburg', 'Innsbruck', 'Zürich', 'Freiburg im Breisgau', 'Frankfurt am Main', 'Berlin', 'Leipzig', 'Dresden', 'Nürnberg', 'Stuttgart'];
const KIND_ORDER = ['ab', 'land', 'zub', 'conn', 'stadt', 'ramp', 'auf', 'term'];

/**
 * Fährt metres Spielmeter mit dem Navi (obey: Anteil der Gabelungen, an denen es dem Navi folgt) und prüft dabei
 * jedes Bild: Stetigkeit (die gezeichnete Welt bewegt sich zwischen zwei Bildern nur so, wie das Auto fährt),
 * Ruhezonen, Grenzen, Kette der Abschnitte. Gibt die Aufzeichnung für Kennzahlen und Bilder zurück.
 */
function drive(src, label, metres, seed, obey = 1, lite = false) {
  const r = rng(seed);
  const trip = new Trip({ rng: r });
  const course = new Course({ planner: new MapPlanner({ graph: G, shapes: src, water: sectionWater }) });
  let ti = Math.floor(r() * TARGETS.length);
  const nextTarget = () => {
    for (let guard = 0; guard < TARGETS.length; guard++) {
      const pi = G.findPlace(TARGETS[ti++ % TARGETS.length]);
      if (pi >= 0 && trip.distances().toPlace(pi).cost < Infinity) {
        trip.setTarget(pi);
        return;
      }
    }
  };
  nextTarget();
  const step = 4;
  const dt = step / 36;
  const rec = { s: [], kind: [], k: [], psi: [], y: [], g: [], map: [], calm: [], label };
  const secs = [];
  const seen = new Set();
  const events = [];
  const driven = [trip.section];
  const choice = new Map();
  const old = new Float32Array(curveTable.data.length);
  let have = false;
  let x = J.L0;
  let maxFill = 0;
  let sumFill = 0;
  let fills = 0;
  const fillMs = [];
  let coh = 0;
  let mapTh = null;
  let mapSec = null;
  let lastK = 0;
  let lastG = 0;
  let maxDk = 0;
  const end = trip.s + metres;
  const note = (sec, path) => {
    if (seen.has(sec)) return;
    seen.add(sec);
    secs.push({ sec, path, prof: course.profile(sec, path, trip) });
  };
  while (trip.s < end) {
    const s = trip.s + step;
    const sec = trip.section;
    if (sec.kind === 'ab') {
      const f = sec.fork;
      if (f && !f.taken && f.s - s < J.decel - 20) {
        if (!choice.has(f)) choice.set(f, r() < obey ? trip.planFor(f) === 'exit' : r() < 0.4);
        x = choice.get(f) ? J.L0 : 5.625;
      } else if (s - sec.s0 > 300) x = 5.625;
    } else x = J.L0;
    const p0 = trip.profile(s);
    x = Math.min(Math.max(x, p0.xmin), p0.xmax);
    const evs = trip.update(s, x);
    for (const e of evs) {
      if (e.type === 'fork') {
        events.push([e.fork.s, 400, 'Gabelung']);
        if (e.taken === 'exit') events.push([e.fork.s + J.hide, 400, 'Szenenwechsel (Ausfahrt)']);
      }
      if (e.type === 'enter') {
        driven.push(e.sec);
        const a = e.prev;
        const b = e.sec;
        // Knotenpunkte: Einfädeln (Ende der Auffahrt), Ortsein- und -ausgang, Knoten der Autobahn je ±400 m; Knoten
        // zweier Straßen abseits ±150 m. Der Anfang einer Auffahrt liegt 250 m vor ihrem Einfädelpunkt (der deckt ihn ab).
        if (b.kind !== 'auf') {
          const wide = a.kind === 'auf' || a.kind === 'stadt' || b.kind === 'stadt' || (a.kind === 'ab' && b.kind === 'ab');
          events.push([b.s0, wide ? 400 : 150, `${a.kind}→${b.kind}`]);
        }
        if (b.kind === 'ab' && b.merge && b.s0 - J.show > 0) events.push([b.s0 - J.show, 400, 'Szenenwechsel (Auffahrt)']);
      }
    }
    if (trip.target < 0) nextTarget();
    const t0 = performance.now();
    const st = course.fill(trip, s, curveTable, dt);
    const ms = performance.now() - t0;
    if (fills > 20) {
      maxFill = Math.max(maxFill, ms);
      sumFill += ms;
      fillMs.push(ms);
    }
    fills++;
    // Stetigkeit: Ein Punkt der Strecke (fest in s) erscheint im neuen Bild genau dort, wohin ihn die Fahrt des
    // Autos trägt (verschoben um den Weg, gedreht um die Kursänderung), bis 600 m voraus
    if (have && !lite) {
      gpuPoint(old, 0, 0, -step, GP);
      const ox = GP.x;
      const oz = GP.z;
      const oy = GP.y;
      // Kurs des alten Bilds an der neuen Stelle des Autos (Hermite wie im Shader)
      const tho = oldTheta(old, step);
      const c = Math.cos(-tho);
      const sn = Math.sin(-tho);
      let worst = 0;
      for (let dOld = -300; dOld <= 600; dOld += 25) {
        for (const xx of [-30, 0, 7.25, 15, 60]) {
          gpuPoint(old, xx, 0, -dOld, GP);
          const wx = GP.x - ox;
          const wz = GP.z - oz;
          const ex = c * wx + sn * wz;
          const ez = -sn * wx + c * wz;
          const ey = GP.y - oy;
          gpuPoint(curveTable.data, xx, 0, -(dOld - step), GP);
          worst = Math.max(worst, Math.hypot(GP.x - ex, GP.y - ey, GP.z - ez));
        }
      }
      coh = Math.max(coh, worst);
      if (worst > 0.05) ok(false, `${label}: die Welt springt um ${fix(worst * 100)} cm bei s=${fix(s, 0)} (${trip.section.kind})`);
    }
    old.set(curveTable.data);
    have = true;
    const spec = KINDS[trip.section.kind];
    if (spec && spec.kmax > 0) maxDk = Math.max(maxDk, ((Math.abs(st.kappa - lastK) / step) * spec.t) / spec.kmax);
    ok(Math.abs(st.grade - lastG) / step <= 1 / 1000, `${label}: Steigung springt bei s=${fix(s, 0)}`);
    lastK = st.kappa;
    lastG = st.grade;
    // Kartenkurs an dieser Stelle
    const cs = trip.section;
    let mh = NaN;
    if (cs.de >= 0 && (cs.kind === 'ab' || cs.kind === 'land')) {
      if (mapSec !== cs) {
        mapSec = cs;
        mapTh = mapHeadings(src, cs.de, cs.len);
      }
      mh = mapTh[Math.min(mapTh.length - 1, Math.round((s - cs.s0) / DS))];
    }
    rec.s.push(s);
    rec.kind.push(cs.kind);
    rec.k.push(st.kappa);
    rec.psi.push(st.psi);
    rec.y.push(st.y);
    rec.g.push(st.grade);
    rec.map.push(mh);
    // in einer Ruhezone des Abschnitts? (für die Obergrenze der Karten-Treue)
    const cp = course.cache.get(cs);
    // (auch die Brücken: dort gerade, map/crossings.js)
    const u = s - cs.s0;
    rec.calm.push(cp && (u < cp.calm[0] || u > cs.len - cp.calm[1] || (cp.zones || []).some(([a, b]) => u >= a && u <= b)) ? 1 : 0);
    if (!lite) for (const { path } of trip.paths()) for (const c2 of path.sections) if (c2.s0 < s + 200 && c2.s1 > s - 200 && course.cache.has(c2)) note(c2, path);
  }
  // leichte Fahrt: nur für die Karten-Treue
  if (lite) return { rec };
  // Ruhezonen: rund um jeden Knotenpunkt gerade
  let calmBad = 0;
  for (const [E, R, why] of events) {
    for (let i = 0; i < rec.s.length; i++) {
      if (Math.abs(rec.s[i] - E) <= R && Math.abs(rec.k[i]) > 1e-9) {
        calmBad++;
        if (calmBad < 6) ok(false, `${label}: Kurve in der Ruhezone (${why}) bei s=${fix(rec.s[i], 0)}, ${fix(rec.s[i] - E, 0)} m vom Punkt`);
        break;
      }
    }
  }
  ok(calmBad === 0, `${label}: ${calmBad} Ruhezonen verletzt`);
  // Profile: Grenzen, weiche Übergänge, gerade und ebene Enden, lückenlose Kette
  const byKind = {};
  for (const { sec, prof: P } of secs) {
    const spec = KINDS[P.kind];
    const kk = (byKind[P.kind] ||= { n: 0, km: 0 });
    kk.n++;
    kk.km += P.len / 1000;
    let maxK = 0;
    let maxStep = 0;
    let maxGr = 0;
    let crest = 0;
    let sag = 0;
    for (let i = 0; i < P.n; i++) {
      maxK = Math.max(maxK, Math.abs(P.kappa[i]));
      maxGr = Math.max(maxGr, Math.abs(P.grade[i]));
      if (i) {
        maxStep = Math.max(maxStep, Math.abs(P.kappa[i] - P.kappa[i - 1]) / DS);
        crest = Math.max(crest, (P.grade[i - 1] - P.grade[i]) / DS);
        sag = Math.max(sag, (P.grade[i] - P.grade[i - 1]) / DS);
      }
    }
    ok(maxK <= spec.kmax + 1e-9, `${label}: ${P.kind} zu eng (R ${fix(1 / maxK, 0)} m)`);
    ok(maxGr <= spec.gmax + 1e-9, `${label}: ${P.kind} zu steil (${fix(maxGr * 100)} %)`);
    ok(maxStep <= (1.55 * spec.kmax) / spec.t + 1e-12, `${label}: ${P.kind}: Krümmung ändert sich zu schnell`);
    const rc = P.kind === 'conn' ? 0.6 * R_CREST : R_CREST;
    ok(crest <= 1.02 / rc && sag <= 1.02 / Math.min(rc, R_SAG) + 1e-9, `${label}: ${P.kind}: Kuppe oder Wanne zu eng (R ${fix(1 / crest, 0)} / ${fix(1 / sag, 0)} m)`);
    ok(P.kappa[0] === 0 && P.kappa[P.n - 1] === 0 && P.grade[0] === 0 && P.grade[P.n - 1] === 0, `${label}: ${P.kind} beginnt oder endet nicht gerade und eben`);
    for (let i = 0; i < P.n; i++) {
      const u = i * DS;
      if ((u < P.calm[0] - 1e-6 || u > P.len - P.calm[1] + 1e-6) && P.kappa[i] !== 0) {
        ok(false, `${label}: ${P.kind}: Kurve in der eigenen Ruhezone bei ${u} m`);
        break;
      }
    }
  }
  // die gefahrene Kette: Kurs und Höhe gehen nahtlos von Abschnitt zu Abschnitt
  let links = 0;
  for (let i = 0; i + 1 < driven.length; i++) {
    const Q = course.cache.get(driven[i]);
    const P = course.cache.get(driven[i + 1]);
    if (!Q || !P) continue;
    links++;
    ok(P.th0 === Q.th1 && P.y0 === Q.y1, `${label}: Kurs oder Höhe springt zwischen ${Q.kind} und ${P.kind} bei s=${driven[i + 1].s0}`);
  }
  ok(links > 10, `${label}: zu wenige Abschnittsgrenzen geprüft`);
  ok(maxDk <= 1.55, `${label}: Krümmung am Auto ändert sich zu schnell (${fix(maxDk, 2)} × kmax/t)`);
  console.log(
    `${label}: ${fix(metres / 1000, 0)} km, ${secs.length} Abschnitte (${KIND_ORDER.filter((k) => byKind[k]).map((k) => `${k} ${byKind[k].n}×/${fix(byKind[k].km)} km`).join(', ')}), ` +
      `${events.length} Knotenpunkte geprüft, Füllen ⌀ ${fix(sumFill / Math.max(1, fills - 21), 3)} ms (Median ${fix(quant(fillMs, 0.5), 3)}, 99 % unter ${fix(quant(fillMs, 0.99), 2)}, höchstens ${fix(maxFill, 1)} ms Uhrzeit auf dem geteilten Rechner), ` +
      `Profile: ${course.stats.builds}× in ⌀ ${fix(course.stats.buildMs / Math.max(1, course.stats.builds), 2)} ms (höchstens ${fix(course.stats.maxBuildMs, 1)} ms), Stetigkeit ±${fix(coh * 1000, 1)} mm`,
  );
  return { rec, secs, driven, course, src, label };
}

/** Quantil q einer Zahlenliste (sortiert eine Kopie). */
function quant(a, q) {
  if (!a.length) return 0;
  const b = Float64Array.from(a).sort();
  return b[Math.min(b.length - 1, Math.floor(q * b.length))];
}

/** Kurs des alten Bilds bei d (Hermite wie im Shader). */
function oldTheta(D, d) {
  const u = (d - CURVE_D0) / CURVE_DS;
  const j = Math.min(Math.max(Math.floor(u), 0), CURVE_N - 2);
  const t = u - j;
  const t2 = t * t;
  const t3 = t2 * t;
  const a = j * 4;
  const a1 = (CURVE_N + j) * 4;
  return (2 * t3 - 3 * t2 + 1) * D[a + 2] + (t3 - 2 * t2 + t) * CURVE_DS * D[a1] + (3 * t2 - 2 * t3) * D[a + 6] + (t3 - t2) * CURVE_DS * D[a1 + 4];
}

const runs = [drive(shapes, `${SHAPES}-Verläufe`, 60000, 11), drive(synth, 'Künstliche Verläufe', 60000, 12), drive(shapes, `Zufallsfahrt (${SHAPES})`, 30000, 13, 0.5)];
// Noch eine Zufallsfahrt nur für die Stetigkeit (nicht in den Kennzahlen): Sie fährt mehrmals in der rechten Spur an
// einer geplanten Ausfahrt vorbei. Der gezeichnete Zweig muss dann vor der Gabelung wechseln, nicht erst an ihr
drive(shapes, `Zufallsfahrt 2 (${SHAPES})`, 30000, 55, 0.5);

// --- 7. Spaß: Kennzahlen je Straßenart und Karten-Treue --------------------------------------------------------
/** Ereignisse und Kennzahlen eines Profils (Abschnitt) – Bögen aus den Elementen, Kuppen/Senken aus der Steigung. */
function profileFacts(P) {
  const f = { len: P.len, straight: 0, tight: 0, advise100: 0, advise80: 0, sweep: 0, bends: 0, sBends: 0, crests: 0, sags: 0, events: [], longest: 0 };
  let run = 0;
  // eine Brücke (Mitte der Ruhezone, map/crossings.js) unterbricht eine lange Gerade: die Ruhezone selbst muss gerade
  // sein, der Fluss darunter ist die Abwechslung. In die Dichte der entworfenen Erlebnisse zählt sie nicht.
  const mids = (P.zones || []).map(([a, b]) => Math.round((a + b) / 2 / DS));
  for (let i = 0; i < P.n; i++) {
    if (Math.abs(P.kappa[i]) < 1 / 4000) {
      f.straight += DS;
      run += DS;
      f.longest = Math.max(f.longest, run);
    } else run = 0;
    if (mids.includes(i)) run = 0;
  }
  const bends = P.bends.filter((b) => Math.abs(b.k * (b.b - b.a - b.t)) > 3 * RAD);
  for (let i = 0; i < bends.length; i++) {
    const b = bends[i];
    const R = 1 / Math.abs(b.k);
    f.bends++;
    if (R >= 700 && R <= 3000) f.sweep++;
    if (R < SIGN_R) {
      f.tight++;
      f.events.push(b.a);
      if (R < ADVISE_R[80]) f.advise80++;
      else if (R < ADVISE_R[100]) f.advise100++;
    }
    const nx = bends[i + 1];
    if (nx && Math.sign(nx.k) !== Math.sign(b.k) && nx.a - b.b < 250) {
      f.sBends++;
      f.events.push(b.a);
    }
  }
  // Kuppe: Steigung von mindestens +2 % auf höchstens −2 % in 900 m (Senke umgekehrt)
  for (let i = 0; i < P.n; i++) {
    if (P.grade[i] < 0.02 && P.grade[i] > -0.02) continue;
    const up = P.grade[i] >= 0.02;
    for (let j = i + 1; j < Math.min(P.n, i + 180); j++) {
      if (up ? P.grade[j] <= -0.02 : P.grade[j] >= 0.02) {
        if (up) f.crests++;
        else f.sags++;
        f.events.push(i * DS);
        i = j;
        break;
      }
    }
  }
  return f;
}

/** Profile aller Kanten einer Art (eine Richtung), jede für sich (gerader Anfang auf dem Kartenkurs). */
function edgeProfiles(src, kind) {
  const course = new Course({ planner: new MapPlanner({ graph: G, shapes: src, water: sectionWater }) });
  const out = [];
  for (const e of G.edges) {
    if (e.kind !== kind) continue;
    const len = G.edgeLen(e);
    if (!(len > 0)) continue;
    const de = e.i * 2;
    const sec = { kind, len, de, s0: 0, s1: len, node: e.b };
    out.push({ e, de, sec, P: course.profile(sec, null, null), course });
  }
  return out;
}

/** Karten-Treue in Fenstern von 1 km: wo die Karte um mehr als 10° abbiegt, biegt die Fahrt in dieselbe Richtung. */
function mapTruth(rec) {
  let win = 0;
  let same = 0;
  let weak = 0;
  // fortlaufender Kartenkurs (über die Knoten hinweg), nur auf Strecken mit Kartenkurs
  const n = rec.s.length;
  const mapU = new Float64Array(n).fill(NaN);
  let prev = NaN;
  for (let i = 0; i < n; i++) {
    const m = rec.map[i];
    if (!Number.isFinite(m)) {
      prev = NaN;
      continue;
    }
    mapU[i] = Number.isFinite(prev) ? prev + wrap(m - prev) : rec.psi[i] + wrap(m - rec.psi[i]);
    prev = mapU[i];
  }
  // Obergrenze unter den Ruhezonen: ein Kurs, der außerhalb der Ruhezonen genau die Karte fährt und in jeder geradeaus
  // (Mittel der Karte an ihren Rändern), mit sofortigen Knicken an deren Rändern – also nicht einmal fahrbar
  const ideal = Float64Array.from(mapU);
  for (let i = 0; i < n; i++) if (rec.calm[i] && Number.isFinite(mapU[i])) ideal[i] = NaN;
  for (let i = 0; i < n; i++) {
    if (!Number.isNaN(ideal[i]) || !Number.isFinite(mapU[i])) continue;
    let b = i;
    while (b + 1 < n && Number.isNaN(ideal[b + 1]) && Number.isFinite(mapU[b + 1])) b++;
    const ha = i > 0 ? ideal[i - 1] : NaN;
    const hb = b + 1 < n ? ideal[b + 1] : NaN;
    const v = Number.isFinite(ha) && Number.isFinite(hb) ? (ha + hb) / 2 : Number.isFinite(ha) ? ha : hb;
    for (let j = i; j <= b; j++) ideal[j] = v;
    i = b;
  }
  let best = 0;
  const stepS = rec.s[1] - rec.s[0];
  const w = Math.round(1000 / stepS);
  for (let i = 0; i + w < n; i += Math.round(250 / stepS)) {
    let okWin = true;
    for (let j = i; j <= i + w; j++) if (!Number.isFinite(mapU[j])) okWin = false;
    if (!okWin) continue;
    const dm = mapU[i + w] - mapU[i];
    if (Math.abs(dm) <= 10 * RAD) continue;
    win++;
    const dd = rec.psi[i + w] - rec.psi[i];
    if (Math.sign(dd) === Math.sign(dm)) same++;
    if (Math.sign(dd) === Math.sign(dm) && Math.abs(dd) > 2 * RAD) weak++;
    if (Math.sign(ideal[i + w] - ideal[i]) === Math.sign(dm)) best++;
  }
  return { win, same, weak, best, mapU };
}

/**
 * Kurs der Karte am Rand der Ruhezone (400 m Autobahn, 150 m Landstraße; kurze Kanten ein Viertel) am Anfang oder
 * Ende einer Kante, gemittelt über ±100 m. Was die Karte innerhalb der Ruhezonen abbiegt, fährt der Kurs als Knick
 * gleich davor und dahinter (die Ruhezone selbst bleibt gerade).
 */
function calmHead(src, de, len, kind, end) {
  const h = mapHeadings(src, de, len);
  const n = h.length;
  const i0 = Math.min(Math.round((kind === 'ab' ? 400 : 150) / DS), (n - 1) >> 2);
  const c = end ? n - 1 - i0 : i0;
  const w = Math.round(100 / DS);
  let sum = 0;
  let m = 0;
  for (let i = Math.max(0, c - w); i <= Math.min(n - 1, c + w); i++, m++) sum += h[i];
  return sum / m;
}

/** Kursfehler an den Kantenenden: Kurs der Fahrt am Knoten gegen die Winkelhalbierende der Karte (calmHead). */
function headingErrors(run) {
  const errs = [];
  const { driven, course, src } = run;
  for (let i = 0; i + 1 < driven.length; i++) {
    const a = driven[i];
    const b = driven[i + 1];
    const P = course.cache.get(a);
    if (!P || !(a.de >= 0 && b.de >= 0)) continue;
    if (!['ab', 'land'].includes(a.kind) || !['ab', 'land'].includes(b.kind)) continue;
    const ha = calmHead(src, a.de, a.len, a.kind, true);
    const hb = calmHead(src, b.de, b.len, b.kind, false);
    errs.push(Math.abs(deg(wrap(P.th1 - (ha + wrap(hb - ha) / 2)))));
  }
  errs.sort((p, q) => p - q);
  const q = (f) => (errs.length ? errs[Math.min(errs.length - 1, Math.floor(f * errs.length))] : NaN);
  return { n: errs.length, mean: errs.reduce((s, v) => s + v, 0) / Math.max(1, errs.length), p95: q(0.95), max: q(1) };
}

/** Wie lange verdeckt eine Kuppe ein Auto (Dach 1,4 m) aus 1,2 m Augenhöhe bei 130 km/h und festem Abstand? */
function crestHide(P) {
  const n = P.n;
  let worst = 0;
  for (const gap of [60, 100, 140, 180]) {
    const m = Math.round(gap / DS);
    let span = 0;
    for (let i = 0; i + m < n; i++) {
      const y0 = P.y[i] + 1.2;
      const y1 = P.y[i + m] + 1.4;
      let hidden = false;
      for (let j = i + 1; j < i + m; j++) {
        if (P.y[j] > y0 + ((y1 - y0) * (j - i)) / m) {
          hidden = true;
          break;
        }
      }
      span = hidden ? span + DS : 0;
      worst = Math.max(worst, span / (130 / 3.6));
    }
  }
  return worst;
}

const table = [];
for (const [name, src] of [[SHAPES, shapes], ['künstlich', synth]]) {
  const ab = edgeProfiles(src, 'ab');
  const land = edgeProfiles(src, 'land');
  const sum = (list) => {
    const t = { km: 0, straight: 0, bends: 0, sweep: 0, tight: 0, a100: 0, a80: 0, sB: 0, crests: 0, sags: 0, ev: 0, longest: 0, longestStraightMap: 0, hide: 0, edges: list.length };
    for (const { P, e } of list) {
      const f = profileFacts(P);
      t.km += P.len / 1000;
      t.straight += f.straight / 1000;
      t.bends += f.bends;
      t.sweep += f.sweep;
      t.tight += f.tight;
      t.a100 += f.advise100;
      t.a80 += f.advise80;
      t.sB += f.sBends;
      t.crests += f.crests;
      t.sags += f.sags;
      // Erlebnisse, die näher als 500 m beieinander liegen, zählen einmal
      const ev = f.events.sort((p, q) => p - q);
      for (let i = 0; i < ev.length; i++) if (i === 0 || ev[i] - ev[i - 1] > 500) t.ev++;
      if (f.longest > t.longest) {
        t.longest = f.longest;
        t.longestStraightMap = Math.abs(deg(P.mapTurn));
        t.longestEdge = e.i;
      }
      t.hide = Math.max(t.hide, crestHide(P));
    }
    return t;
  };
  for (const [kind, list] of [['ab', ab], ['land', land]]) {
    const t = sum(list);
    table.push({ name, kind, ...t });
    const spec = KINDS[kind];
    for (const { P } of list) {
      let mk = 0;
      for (let i = 0; i < P.n; i++) mk = Math.max(mk, Math.abs(P.kappa[i]));
      ok(mk <= spec.kmax + 1e-9, `${name} ${kind}: zu eng`);
    }
    ok(t.hide <= 2.2, `${name} ${kind}: eine Kuppe verdeckt ein Auto ${fix(t.hide)} s lang`);
  }
}
console.log('\nSpaß-Kennzahlen (je Kante für sich entworfen; Ziele: gerade 35–66 %, meist Bögen R 700–3000, alle 3–5 km ein Erlebnis):');
console.log('Verläufe     Art   Kanten     km  gerade  Bögen/100km  davon R700–3000  eng<R700/100km (100/80)  S/100km  Kuppen+Senken/100km  Erlebnis alle  längste Gerade  Kuppe verdeckt');
for (const t of table) {
  const per = (v) => fix((100 * v) / t.km, 1);
  console.log(
    `${t.name.padEnd(12)} ${t.kind.padEnd(5)} ${String(t.edges).padStart(6)} ${fix(t.km, 0).padStart(6)}  ${fix((100 * t.straight) / t.km, 0).padStart(4)} %  ${per(t.bends).padStart(11)}  ${fix((100 * t.sweep) / Math.max(1, t.bends), 0).padStart(13)} %  ${per(t.tight).padStart(12)} (${t.a100}/${t.a80})  ${per(t.sB).padStart(14)}  ${per(t.crests + t.sags).padStart(19)}  ${fix(t.km / Math.max(1, t.ev), 1).padStart(10)} km  ${fix(t.longest / 1000, 1).padStart(10)} km (Karte ${fix(t.longestStraightMap, 0)}°)  ${fix(t.hide, 1)} s`,
  );
}
// Ziel 35–60 % gerade. Die Ruhezonen (2 × 400 m an jedem Knoten) sind schon 22 % des Netzes, bei den vielen
// 1,4-km-Kanten bis 57 % einer Kante. Ziel des Briefs: ein Erlebnis alle 3–5 km. Echte Autobahnen, 1:19 gestaucht,
// wechseln die Richtung öfter (K1: 48 dicht gegensinnige Bögen der Karte je 100 km); der Kurs fährt diese Wechsel
// gedämpft, aber mit (Karten-Treue), so kommt auf echten und ebenso unruhigen künstlichen Verläufen etwa alle
// 2,3–2,5 km etwas, auf den groben Platzhalter-Polygonen (ein Knick an jedem Knoten, mehr Hügel) ähnlich oft: ab 2,2 km.
// Seit den Rasthöfen (tools/map/rasthoefe.mjs: lange Etappen geteilt, damit der Akku bis zum nächsten Ladepark reicht)
// hat das Netz rund 230 Knoten mehr, jeder mit seiner Ruhezone: gemessen 64–65 % gerade und ein Erlebnis alle 2,0–2,1 km
// (jede Hälfte einer geteilten Etappe bekommt ihre eigenen). Darum bis 66 % und ab 2,0 km.
for (const t of table.filter((q) => q.kind === 'ab')) {
  ok(t.edges >= 30, `${t.name}: weniger als 30 Kanten in der Statistik`);
  const share = (100 * t.straight) / t.km;
  ok(share >= 35 && share <= 66, `Autobahn (${t.name}): ${fix(share, 0)} % gerade statt 35–66 %`);
  ok(t.sweep / Math.max(1, t.bends) > 0.5, `Autobahn (${t.name}): die meisten Bögen sollten lange Bögen sein`);
  const every = t.km / Math.max(1, t.ev);
  ok(every >= 2.0 && every <= 5, `Autobahn (${t.name}): ein Erlebnis alle ${fix(every)} km`);
  ok(t.longest <= 2500, `Autobahn (${t.name}): ${fix(t.longest / 1000)} km schnurgerade`);
}

// Karten-Treue, Ziel des Briefs 90 % der Fenster. Grenze: Der Kurs darf an den Knoten nicht abbiegen (Ruhezonen, je
// ±400 m) und nicht enger als R 420 mit 120 m Übergängen; wo die Karte in einem 1,4-km-Abschnitt hin und her biegt,
// passt das nicht in die freien 600 m. Selbst der ideale Kurs, der die Karte außerhalb der Ruhezonen genau abfährt und
// an ihren Rändern sofort abknickt, trifft mit dem Platzhalter 96–98 %, mit echten (K1) oder ebenso unruhigen
// künstlichen Verläufen nur um 90 % der Fenster (die echte Straße biegt oft gerade an den Knoten ab). Geprüft wird
// deshalb gegen ihn: über diese drei und zehn leichte Fahrten mehr (je 60 km, fünf mit jedem Satz Verläufe) zusammen
// mindestens 88 % dessen, was er trifft (gemessen 92 % mit Platzhalter und künstlichen, 90 % mit K1s Verläufen), jede
// Fahrt für sich mindestens 80 %
console.log('\nKarten-Treue und Kursfehler auf den Fahrten:');
let winAll = 0;
let sameAll = 0;
let bestAll = 0;
const truthOk = (mt, label) => {
  if (mt.win >= 10) ok(mt.same >= 0.8 * mt.best, `${label}: Karten-Treue ${fix((100 * mt.same) / mt.win, 0)} %, der ideale Kurs ${fix((100 * mt.best) / mt.win, 0)} %`);
  winAll += mt.win;
  sameAll += mt.same;
  bestAll += mt.best;
};
for (const run of runs) {
  const mt = mapTruth(run.rec);
  const he = headingErrors(run);
  const r = run.rec;
  let abKm = 0;
  let abStraight = 0;
  for (let i = 1; i < r.s.length; i++) {
    if (r.kind[i] !== 'ab') continue;
    abKm += r.s[i] - r.s[i - 1];
    if (Math.abs(r.k[i]) < 1 / 4000) abStraight += r.s[i] - r.s[i - 1];
  }
  console.log(`  ${run.label}: ${mt.win} Fenster (1 km) mit mehr als 10° Kartenbogen, ${fix((100 * mt.same) / Math.max(1, mt.win), 0)} % gleichsinnig gefahren (${fix((100 * mt.weak) / Math.max(1, mt.win), 0)} % um mehr als 2°; ideal ${fix((100 * mt.best) / Math.max(1, mt.win), 0)} %); Kurs an ${he.n} Knoten: ⌀ ${fix(he.mean)}°, 95 % unter ${fix(he.p95)}°, höchstens ${fix(he.max)}°; Autobahn ${fix(abKm / 1000, 0)} km, ${fix((100 * abStraight) / Math.max(1, abKm), 0)} % gerade`);
  truthOk(mt, run.label);
  run.mapU = mt.mapU;
}
const more = { [SHAPES]: [shapes, 0, 0, 0], künstlich: [synth, 0, 0, 0] };
for (const seed of [14, 15, 16, 17, 18]) {
  for (const [name, m] of Object.entries(more)) {
    const mt = mapTruth(drive(m[0], name, 60000, seed, 1, true).rec);
    truthOk(mt, `leichte Fahrt ${seed} (${name})`);
    m[1] += mt.win;
    m[2] += mt.same;
    m[3] += mt.best;
  }
}
const pc = (a, b) => fix((100 * a) / Math.max(1, b), 1);
console.log(`  zehn leichte Fahrten mehr: ${Object.entries(more).map(([name, m]) => `${name} ${pc(m[2], m[1])} % von ${m[1]} (ideal ${pc(m[3], m[1])} %)`).join(', ')} Fenstern`);
console.log(`  zusammen: ${pc(sameAll, winAll)} % von ${winAll} Fenstern (Ziel des Briefs 90 %; der ideale Kurs unter den Ruhezonen ${pc(bestAll, winAll)} %, gefahren ${pc(sameAll, bestAll)} % davon)`);
ok(sameAll >= 0.88 * bestAll, `Karten-Treue über alle Fahrten ${pc(sameAll, winAll)} %: weniger als 88 % dessen, was der ideale Kurs trifft (${pc(bestAll, winAll)} %)`);
// --- 7b. Kurvenschilder stehen an den Bögen des Kurses (dieselben Bögen, die course.eachBend dem Navi gibt) --------
// curvesigns.js ohne Grafik: Der Bildatlas wird auf eine Leinwand gemalt, die hier alles schluckt
globalThis.document ??= { createElement: () => ({ getContext: () => new Proxy({}, { get: () => () => {} }) }) };
const { CurveSigns, gridBusy } = await import('../src/world/kit/curvesigns.js');
const signs = new CurveSigns(new Group());
const SIGNS = { checks: 0, warn: 0, chev: 0, bends: 0, worst: '', kept: 0, withCourse: 0, sheared: 0, prev: null, course: null, ver: -1, s: 0 };
/** Schilder nahe beim Auto (300 m dahinter bis 600 m voraus) als Liste „s x Art Richtung Tempo“. */
function nearSigns(lo, hi) {
  const out = [];
  for (let i = 0; i < signs.n; i++) {
    // gerundet wie der Text: so vergleicht checkSigns die Liste von vorher (eine Tafel genau am Rand zählt sonst
    // einmal mit 18508.00 und einmal mit 18507.996)
    const at = +fix(signs.sAt[i], 2);
    if (signs.st[i] !== 1 || at < lo || at > hi) continue;
    out.push(`${fix(signs.sAt[i], 2)} ${fix(signs.x[i], 2)} ${signs.type[i]} ${signs.flip[i]} ${signs.adv[i]}`);
  }
  return out.sort();
}
/** Schilder an der Stelle s legen und prüfen: jede Tafel an einem engen Bogen, jedes Gefahrzeichen davor. */
function checkSigns(course, s, label, shear = null) {
  signs.update(course, s, shear);
  SIGNS.checks++;
  // XXL: jedes Schild im Rahmen seines Abschnitts geschert (trip.shears()) und versteckt, solange der Abschnitt nicht
  // gezeichnet wird; so, wie es der Bericht dem Einbau vorschlägt
  if (shear) {
    for (let i = 0; i < signs.n; i++) {
      if (signs.sAt[i] < s - 400) continue;
      const sh = shear(signs.sec[i], signs.path[i]);
      SIGNS.sheared++;
      if (!sh ? signs.st[i] !== 2 : signs.st[i] !== 1 || signs.sa[i] !== sh.a || signs.sb[i] !== sh.b) {
        const msg = `Schild bei s=${fix(signs.sAt[i], 0)} ${sh ? `nicht mit a=${fix(sh.a, 2)}, b=${fix(sh.b, 4)} geschert` : 'sichtbar, obwohl sein Abschnitt nicht gezeichnet wird'}`;
        if (!SIGNS.worst) SIGNS.worst = msg;
        ok(false, `${label}: ${msg}`);
      }
    }
  }
  // nichts springt: was nahe beim Auto steht (300 m dahinter bis 600 m voraus), steht nach dem nächsten Neulegen
  // genau so da. Nur wenn der Kurs selbst neu gewählt hat (an einer Gabelung gegen die Vorhersage gefahren), ändern
  // sich Straße und Schilder dahinter gemeinsam; das wird nur gezählt.
  if (SIGNS.course === course && s > SIGNS.s) {
    const lo = s - 300;
    const hi = SIGNS.s + 600;
    const was = SIGNS.prev.filter((k) => +k.split(' ')[0] >= lo && +k.split(' ')[0] <= hi).join(' | ');
    const now = nearSigns(lo, hi).join(' | ');
    if (course.version !== SIGNS.ver) {
      if (was !== now) SIGNS.withCourse++;
    } else if (was !== now) {
      const msg = `Schilder nahe beim Auto springen zwischen s=${fix(SIGNS.s, 0)} und s=${fix(s, 0)}: vorher [${was}], jetzt [${now}]`;
      if (!SIGNS.worst) SIGNS.worst = msg;
      ok(false, `${label}: ${msg}`);
    } else SIGNS.kept++;
  }
  SIGNS.course = course;
  SIGNS.ver = course.version;
  SIGNS.s = s;
  SIGNS.prev = nearSigns(s - 300, s + 600);
  const bends = [];
  course.eachBend((s0, s1, k, t, kind) => bends.push({ s0, s1, k, kind, R: 1 / Math.abs(k) }));
  const tight = (q) => (q.kind === 'ab' ? q.R < SIGN_R : q.R < 260);
  const bad = (msg) => {
    if (!SIGNS.worst) SIGNS.worst = msg;
    ok(false, `${label}: ${msg}`);
  };
  for (let i = 0; i < signs.n; i++) {
    if (signs.st[i] !== 1) continue; // versteckt (weit hinter dem Auto)
    const at = signs.sAt[i];
    const x = signs.x[i];
    if (gridBusy(at)) bad(`Schild bei s=${fix(at, 0)} steht im Möbelraster`);
    if (signs.type[i] === 0) {
      SIGNS.chev++;
      const q = bends.find((b) => tight(b) && at >= b.s0 && at <= b.s1);
      if (!q) bad(`Richtungstafel bei s=${fix(at, 0)} an keinem engen Bogen`);
      else if (q.k > 0 !== x > 0 || signs.flip[i] !== (q.k > 0 ? 1 : 0)) bad(`Richtungstafel bei s=${fix(at, 0)} innen oder falsch herum`);
      continue;
    }
    SIGNS.warn++;
    const j = bends.findIndex((b) => b.kind === 'ab' && b.R < SIGN_R && b.s0 - at >= 130 && b.s0 - at <= 270);
    if (j < 0) {
      bad(`Gefahrzeichen bei s=${fix(at, 0)} vor keiner engen Autobahnkurve`);
      continue;
    }
    const q = bends[j];
    const nx = bends[j + 1];
    const double = !!nx && Math.sign(nx.k) !== Math.sign(q.k) && nx.s0 - q.s1 < 250 && nx.R < 1000;
    const rMin = double ? Math.min(q.R, nx.R) : q.R;
    const adv = rMin < ADVISE_R[80] ? 80 : rMin < ADVISE_R[100] ? 100 : 0;
    if (signs.type[i] !== (double ? 2 : 1) || signs.flip[i] !== (q.k > 0 ? 1 : 0) || signs.adv[i] !== adv) bad(`Gefahrzeichen bei s=${fix(at, 0)} zeigt nicht den Bogen R ${fix(q.R, 0)} (${q.k > 0 ? 'links' : 'rechts'}${double ? ', doppelt' : ''}, ${adv || 'ohne'} km/h)`);
  }
  // jede enge Autobahnkurve bis 2,55 km voraus hat ihr Gefahrzeichen auf beiden Seiten (außer als zweite einer
  // Doppelkurve); weiter vorne, tief im Dunst, kommt es spätestens mit dem nächsten Neulegen nach 400 m
  for (let j = 0; j < bends.length; j++) {
    const q = bends[j];
    if (q.kind !== 'ab' || q.R >= SIGN_R || q.s0 - 270 < s - 380 || q.s0 > s + 2550) continue;
    const p = bends[j - 1];
    if (p && p.kind === 'ab' && p.R < SIGN_R && Math.sign(p.k) !== Math.sign(q.k) && q.s0 - p.s1 < 250 && q.R < 1000) continue;
    SIGNS.bends++;
    let n = 0;
    for (let i = 0; i < signs.n; i++) if (signs.type[i] && q.s0 - signs.sAt[i] >= 130 && q.s0 - signs.sAt[i] <= 270) n++;
    if (n < 2) bad(`enge Kurve R ${fix(q.R, 0)} bei s=${fix(q.s0, 0)} ohne Gefahrzeichen (${n})`);
  }
}

// --- 7b. Navi und Welt: preview() ist genau die Straße, die die Welt zeigt (COMMON.md Abschnitt 9) ---------------
/**
 * Fahrt mit häufigen Zielwechseln (alle retarget Meter ein neues Ziel, also auch in den Sperrzonen vor Gabelungen
 * und Knoten): nach fill() vergleicht sie die Straße voraus aus course.preview() mit der Linie, die src/curve.js aus
 * der Tabelle zeichnet (curvePoint), über 1500 m, für die Linie x = 0 und für die Spur des Autos. Geprüft wird alle
 * 40 m, auf jedem Schritt 300 m vor bis 300 m nach einer Gabelung und 120 m lang nach jedem Zielwechsel und jeder
 * neuen Auswahl des Kurses (dann wird überblendet).
 */
function naviDrive(src, label, metres, seed, retarget, targets = TARGETS) {
  const r = rng(seed);
  const trip = new Trip({ rng: r });
  const course = new Course({ planner: new MapPlanner({ graph: G, shapes: src, water: sectionWater }) });
  let ti = Math.floor(r() * targets.length);
  const nextTarget = () => {
    for (let guard = 0; guard < targets.length; guard++) {
      const pi = G.findPlace(targets[ti++ % targets.length]);
      if (pi >= 0 && pi !== trip.target && trip.distances().toPlace(pi).cost < Infinity) {
        trip.setTarget(pi);
        return;
      }
    }
  };
  nextTarget();
  const step = 4;
  const P = { x: 0, y: 0, z: 0 };
  const res = { worst: 0, worstAt: '', checks: 0, kinds: {}, fork: 0, target: 0, replan: 0, retargets: 0, locked: 0 };
  const choice = new Map();
  let x = J.L0;
  let nextGoal = trip.s + retarget;
  let hot = -Infinity;
  let hotWhy = 'target';
  let ver = -1;
  const end = trip.s + metres;
  while (trip.s < end) {
    const s = trip.s + step;
    const sec = trip.section;
    if (sec.kind === 'ab') {
      const f = sec.fork;
      if (f && !f.taken && f.s - s < J.decel - 20) {
        if (!choice.has(f)) choice.set(f, trip.planFor(f) === 'exit');
        x = choice.get(f) ? J.L0 : 5.625;
      } else if (s - sec.s0 > 300) x = 5.625;
    } else x = J.L0;
    const p0 = trip.profile(s);
    x = Math.min(Math.max(x, p0.xmin), p0.xmax);
    trip.update(s, x);
    if (trip.target < 0 || s >= nextGoal) {
      // neues Ziel (in einer Sperrzone ändert es den nächsten Zweig nicht mehr, aber die Pläne dahinter)
      const f = trip.section.fork;
      if (f && f.s - s < J.lock && f.s > s) res.locked++;
      nextTarget();
      nextGoal = s + retarget;
      res.retargets++;
      hot = s + 120;
      hotWhy = 'target';
    }
    course.fill(trip, s, curveTable, step / 36);
    if (course.version !== ver) {
      if (ver >= 0 && s >= hot) {
        hot = s + 120;
        hotWhy = 'replan';
      }
      ver = course.version;
    }
    const f = trip.section.fork;
    const nearFork = trip.section.kind === 'ab' && f && Math.abs(f.s - s) < 300;
    if (!(nearFork || s < hot || Math.round(s) % 40 === 0)) continue;
    if (nearFork) res.fork++;
    if (s < hot) res[hotWhy]++;
    res.checks++;
    res.kinds[trip.section.kind] = (res.kinds[trip.section.kind] || 0) + 1;
    if (nearFork || s < hot || Math.round(s) % 200 === 0) {
      const sh = trip.shears();
      const view = trip.autobahnView();
      const drawn = (sec, path) => (sec.kind === 'ab' ? !!view && view.frame === sec.frame : trip.visible(sec, path));
      checkSigns(course, s, `${label} s=${fix(s, 0)}`, (sec, path) => (drawn(sec, path) ? sh.get(sec.frame) || null : null));
    }
    for (const lat of [0, x]) {
      const pv = course.preview(trip, s, 1500, 10, lat);
      for (let i = 0; i < pv.n; i++) {
        P.x = lat;
        P.y = 0;
        P.z = -10 * i;
        curvePoint(P);
        const e = Math.hypot(P.x - lat - pv.x[i], -P.z - pv.z[i]);
        if (e > res.worst) {
          res.worst = e;
          res.worstAt = `s=${fix(s, 0)} (${trip.section.kind}), ${10 * i} m voraus, Linie x=${fix(lat, 2)}`;
        }
      }
    }
  }
  console.log(
    `  ${label}: ${fix(metres / 1000, 0)} km, ${res.retargets} Zielwechsel (${res.locked} in der Sperrzone vor einer Gabelung), ${res.checks} Vergleiche (` +
      `${KIND_ORDER.filter((k) => res.kinds[k]).map((k) => `${k} ${res.kinds[k]}`).join(', ')}; an Gabelungen ${res.fork}, bis 120 m nach einem Zielwechsel ${res.target}, nach einer neuen Auswahl des Kurses ${res.replan}), ` +
      `größte Abweichung ${fix(res.worst * 1000, 1)} mm (${res.worstAt})`,
  );
  ok(res.worst <= 0.5, `${label}: preview() weicht ${fix(res.worst, 2)} m von der gezeichneten Straße ab (${res.worstAt})`);
  ok(res.fork > 100 && res.retargets > 5 && res.replan > 0, `${label}: zu wenige Gabelungen, Zielwechsel oder neue Auswahlen geprüft`);
  return res;
}
console.log('\nNavi und Welt: Straße voraus aus course.preview() gegen die gezeichnete Straße (curve.js), 1500 m:');
naviDrive(shapes, `${SHAPES}-Verläufe`, 40000, 31, 2600);
naviDrive(synth, 'Künstliche Verläufe', 40000, 32, 2300);
// Orte an Landstraßen in Osthessen und der Rhön: Landstraßen, Zubringer und Ortsdurchfahrten
naviDrive(synth, 'Künstliche Verläufe, Rhön', 30000, 33, 2000, ['Fulda', 'Birx', 'Bischofsheim in der Rhön', 'Bad Salzschlirf', 'Burghaun', 'Alsfeld', 'Bad Hersfeld']);
{
  // Kurvenprobe und Endlos-Kurs (ohne Fahrt), auch gleich nach dem Umschalten
  const c = new Course();
  const P = { x: 0, y: 0, z: 0 };
  let worst = 0;
  let n = 0;
  for (const mode of ['probe', 'endless']) {
    c.mode = mode;
    c.resetVirtual(mode);
    for (let s = -800; s < 18000; s += 40) {
      c.fill(null, s, curveTable, 1 / 30);
      if (s % 200 === 0) checkSigns(c, s, `${mode} s=${s}`);
      const pv = c.preview(null, s, 1500, 10);
      n++;
      for (let i = 0; i < pv.n; i++) {
        P.x = 0;
        P.y = 0;
        P.z = -10 * i;
        curvePoint(P);
        worst = Math.max(worst, Math.hypot(P.x - pv.x[i], -P.z - pv.z[i]));
      }
    }
  }
  console.log(`  Kurvenprobe und Endlos-Kurs: ${n} Vergleiche, größte Abweichung ${fix(worst * 1000, 1)} mm`);
  ok(worst <= 0.5, `Kurvenprobe/Endlos-Kurs: preview() weicht ${fix(worst, 2)} m ab`);
}
console.log(`Kurvenschilder an denselben Stellen neu gelegt: ${SIGNS.checks}-mal, ${SIGNS.warn} Gefahrzeichen und ${SIGNS.chev} Richtungstafeln geprüft, ${SIGNS.bends} enge Autobahnkurven mit beidseitigem Gefahrzeichen, ${SIGNS.kept}-mal nahe beim Auto unverändert neu gelegt (${SIGNS.withCourse}-mal mit einer neuen Auswahl des Kurses verändert), ${SIGNS.sheared}-mal im Rahmen geschert oder versteckt${SIGNS.worst ? `; erster Fehler: ${SIGNS.worst}` : ''}`);
ok(SIGNS.bends > 50 && SIGNS.chev > 200, 'zu wenige Kurvenschilder geprüft');
console.log(`\nShader-Zwilling: ${TWIN.points} Punkte, größte Abweichung CPU/GPU-Formel bis 1000 m neben der Straße ${fix(TWIN.worst * 1000, 2)} mm (${TWIN.worstAt}), auf dem fernen Boden ${fix(TWIN.worstFar * 1e6, 1)} mm je km Abstand; Faltungs-Gitter: ${TWIN.cells} Punkte bis 2600 m (${fix((100 * TWIN.crushed) / TWIN.cells, 1)} % fast auf den Mittelpunkt gestaucht, ${TWIN.center} jenseits), Zellen bis 600 m: ${TWIN.folds} umgeklappt`);
ok(TWIN.center === 0, 'Punkte jenseits des Kurvenmittelpunkts');

// --- 8. Bilder ----------------------------------------------------------------------------------------------------
if (PLOTS) {
  mkdirSync(PLOTS, { recursive: true });
  const W = 1400;
  const H = 420;
  const M = { l: 70, r: 20, t: 42, b: 46 };
  const plot = (file, title, xs, series, opts = {}) => {
    const x0 = xs[0];
    const x1 = xs[xs.length - 1];
    let y0 = Infinity;
    let y1 = -Infinity;
    for (const sr of series) for (const v of sr.ys) if (Number.isFinite(v)) (y0 = Math.min(y0, v)), (y1 = Math.max(y1, v));
    for (const h of opts.lines || []) (y0 = Math.min(y0, h.y)), (y1 = Math.max(y1, h.y));
    const pad = (y1 - y0) * 0.06 || 1;
    y0 -= pad;
    y1 += pad;
    const X = (v) => M.l + ((v - x0) / (x1 - x0)) * (W - M.l - M.r);
    const Y = (v) => H - M.b - ((v - y0) / (y1 - y0)) * (H - M.t - M.b);
    const out = [`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" font-family="Inter, Arial, sans-serif" font-size="13">`, `<rect width="${W}" height="${H}" fill="#fbfaf7"/>`];
    out.push(`<text x="${M.l}" y="24" font-size="16" font-weight="600" fill="#222">${title}</text>`);
    // Raster
    const ticks = (a, b, n) => {
      const raw = (b - a) / n;
      const mag = Math.pow(10, Math.floor(Math.log10(raw)));
      const st = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((m) => m >= raw);
      const tk = [];
      for (let v = Math.ceil(a / st) * st; v <= b; v += st) tk.push(+v.toFixed(10));
      return tk;
    };
    for (const v of ticks(y0, y1, 6)) out.push(`<line x1="${M.l}" x2="${W - M.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="#e4e0d8"/><text x="${M.l - 8}" y="${Y(v) + 4}" text-anchor="end" fill="#666">${opts.fmt ? opts.fmt(v) : v}</text>`);
    for (const v of ticks(x0, x1, 12)) out.push(`<line x1="${X(v)}" x2="${X(v)}" y1="${M.t}" y2="${H - M.b}" stroke="#eeebe4"/><text x="${X(v)}" y="${H - M.b + 18}" text-anchor="middle" fill="#666">${fix(v / 1000, 0)}</text>`);
    out.push(`<text x="${W - M.r}" y="${H - 8}" text-anchor="end" fill="#666">Spiel-km</text>`);
    for (const h of opts.lines || []) out.push(`<line x1="${M.l}" x2="${W - M.r}" y1="${Y(h.y)}" y2="${Y(h.y)}" stroke="${h.color}" stroke-dasharray="5 4"/><text x="${W - M.r - 4}" y="${Y(h.y) - 4}" text-anchor="end" fill="${h.color}">${h.label}</text>`);
    // Abschnitte abseits der Karte grau hinterlegt
    if (opts.kinds) {
      let a = -1;
      for (let i = 0; i <= xs.length; i++) {
        const off = i < xs.length && !['ab', 'land'].includes(opts.kinds[i]);
        if (off && a < 0) a = i;
        if (!off && a >= 0) {
          out.push(`<rect x="${X(xs[a])}" y="${M.t}" width="${Math.max(0.5, X(xs[i - 1]) - X(xs[a]))}" height="${H - M.t - M.b}" fill="#d9d3c7" opacity="0.35"/>`);
          a = -1;
        }
      }
    }
    let lx = M.l + 360;
    for (const sr of series) {
      let d = '';
      let pen = false;
      for (let i = 0; i < xs.length; i++) {
        const v = sr.ys[i];
        if (!Number.isFinite(v)) {
          pen = false;
          continue;
        }
        d += `${pen ? 'L' : 'M'}${X(xs[i]).toFixed(1)} ${Y(v).toFixed(1)}`;
        pen = true;
      }
      out.push(`<path d="${d}" fill="none" stroke="${sr.color}" stroke-width="${sr.width || 1.6}" ${sr.dash ? `stroke-dasharray="${sr.dash}"` : ''}/>`);
      out.push(`<line x1="${lx}" x2="${lx + 26}" y1="19" y2="19" stroke="${sr.color}" stroke-width="3" ${sr.dash ? `stroke-dasharray="${sr.dash}"` : ''}/><text x="${lx + 32}" y="24" fill="#333">${sr.name}</text>`);
      lx += 46 + sr.name.length * 7.2;
    }
    out.push('</svg>');
    writeFileSync(`${PLOTS}/${file}`, out.join('\n'));
  };
  let no = 1;
  for (const run of runs.slice(0, 2)) {
    const r = run.rec;
    const n = Math.min(r.s.length, Math.round(30000 / (r.s[1] - r.s[0])));
    const xs = r.s.slice(0, n).map((v) => v - r.s[0]);
    const cut = (a) => a.slice(0, n);
    const kinds = cut(r.kind);
    const tag = run.label.split(' ')[0].toLowerCase();
    plot(`${no++}-kurs-${tag}.svg`, `${run.label}: Kurs (Grad, links positiv) – Fahrt gegen Karte`, xs, [
      { name: 'Fahrt', ys: cut(r.psi).map(deg), color: '#1f6feb', width: 2 },
      { name: 'Karte', ys: cut(run.mapU).map(deg), color: '#e8590c', dash: '6 4' },
    ], { kinds, fmt: (v) => `${v}°` });
    plot(`${no++}-kruemmung-${tag}.svg`, `${run.label}: Krümmung (1/km, links positiv) mit den Grenzen`, xs, [{ name: 'Krümmung', ys: cut(r.k).map((v) => v * 1000), color: '#2b8a3e', width: 1.8 }], {
      kinds,
      lines: [
        { y: 1000 / 420, color: '#c92a2a', label: 'Autobahn R 420' },
        { y: -1000 / 420, color: '#c92a2a', label: '' },
        { y: 1000 / 700, color: '#e67700', label: 'Schilder ab R 700' },
        { y: -1000 / 700, color: '#e67700', label: '' },
      ],
    });
    plot(`${no++}-hoehe-${tag}.svg`, `${run.label}: Höhe (m) und Steigung (‰)`, xs, [
      { name: 'Höhe', ys: cut(r.y), color: '#7048e8', width: 2 },
      { name: 'Steigung (‰)', ys: cut(r.g).map((v) => v * 1000), color: '#868e96', width: 1.2 },
    ], { kinds });
  }
  console.log(`\n${no - 1} Bilder nach ${PLOTS}`);
}

console.log(fails ? `\n${fails} FEHLER` : '\nalles in Ordnung');
process.exit(fails ? 1 : 0);
