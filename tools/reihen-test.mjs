// Reihen von Bäumen, Büschen und Häusern (src/world/rowcull.js) ohne Grafik: node tools/reihen-test.mjs
//
// Die Reihen sollen nur Rechenzeit sparen. Dass ein Durchgang weniger zeichnet, ändert am Bild nichts, solange keine
// Instanz fehlt, von der die Kamera etwas sehen könnte. Das hängt an einer Kette, die hier Glied für Glied nachgerechnet
// wird:
//   1. curveBound (src/curve.js): Was in einem Quader der geraden Welt liegt, liegt nach dem Biegen in der Kugel, die
//      curveBound liefert – auf erdachten Bahnen (enger und steiler als alles im Spiel, mit Stauchung innen in der
//      Kurve und Rückfaltung nach einer Schleife), auf Bahnen, deren Kurs zwischen den Stützstellen anders dreht, als
//      ihre Krümmung sagt (so schreibt course.fill sie), und auf den echten Bahnen von Fahrten über die Karte.
//   2. RowCull: Buchführung der Quader, ein Ergebnis je Durchgang (Kamera und Bild), neuer Stand der Bahn, Haken an
//      den Netzen (cullByRows); die Kugel im Sichtkörper genau so groß und so hoch, wie die Hülle sagt.
//   3. PropSet.fill (Bewuchs der XXL-Welt) und Scenery.pack (Rand der Autobahn): Nichts geht verloren, nichts steht
//      doppelt, jede Instanz liegt in ihrer Reihe, mit allen Eckpunkten in deren Quader und nach dem Biegen in
//      dessen Kugel.
//   4. Kameras wie im Spiel (Sicht, Drohne, Rückspiegel, Seitenfenster, Schattenkarte) und beliebige dazu, auf
//      echten Fahrten: Kein Eckpunkt einer weggelassenen Instanz liegt im Sichtkörper, und die Netze selbst zeichnen
//      über ihre Haken genau bis zur letzten sichtbaren Reihe. Dazu, wie viel die Reihen sparen.
// Den Vergleich der fertigen Bilder (mit und ohne Reihen, Punkt für Punkt) macht der Browser: __MA.rowCull und
// __MA.redraw() mit ?debug. Er zeigt, ob eine Reihe fehlt; die Reihenfolge der Instanzen ist in beiden Bildern die der
// Reihen. Gegenüber dem Stand vor den Reihen ist sie eine andere: Wo zwei Pflanzen ineinander stehen, kann an einzelnen
// Bildpunkten gleicher Tiefe die andere vorn liegen (siehe rowcull.js).
import * as THREE from 'three';
import * as G from '../src/map/graph.js';
import * as shapes from '../src/map/shapes.js';
import { sectionWater } from '../src/map/crossings.js';
import { Trip } from '../src/game/trip.js';
import { Player } from '../src/game/player.js';
import { Course, MapPlanner, PROBE, bendAt } from '../src/game/course.js';
import { curveTable, curveAt, curvePoint, curveBound, CURVE_N as N, CURVE_D0 as D0, CURVE_DS as DS } from '../src/curve.js';
import { limitsFor, autoTarget, autoDrive, AUTO, Arrival } from '../src/world/xxl/plan.js';
import { ROW, RowCull, cullByRows, rowBox, rowStats, setRowCull } from '../src/world/rowcull.js';

let fails = 0;
const check = (ok, text) => {
  if (!ok) fails++;
  console.log((ok ? '  ✓ ' : '  ✗ ') + text);
};
/** Sammelt Verstöße einer Massenprüfung: n zählt alle, die ersten vier bleiben als Text. */
const tally = () => ({ n: 0, first: [] });
const miss = (t, text) => {
  if (t.n++ < 4) t.first.push(text());
};
const told = (t) => (t.n ? `${t.n} Verstöße, z. B. ${t.first.join(' · ')}` : 'kein Verstoß');
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
const f1 = (v) => v.toFixed(1);
const pct = (a, b) => `${((100 * a) / Math.max(1, b)).toFixed(0)} %`;

// --- erdachte Bahnen ------------------------------------------------------------------------------------------------
/** Stücke mit festem Wert (oft 0) und Übergängen dazwischen, höchstens ±max. */
function profile(rnd, max, hold = 60) {
  const out = new Float64Array(N);
  let j = 0;
  let v = 0;
  while (j < N) {
    const target = rnd() < 0.35 ? 0 : (rnd() * 2 - 1) * max;
    const ramp = 1 + Math.floor(rnd() * 14);
    for (let i = 1; i <= ramp && j < N; i++, j++) out[j] = v + ((target - v) * i) / ramp;
    v = target;
    for (let i = Math.floor(rnd() * hold); i > 0 && j < N; i--, j++) out[j] = v;
  }
  return out;
}
/** Bezugslinie: Autobahn (0) oder Mittellinie (7,25) und Wechsel dazwischen von einer Stützstelle zur nächsten. */
function refLine(rnd) {
  const out = new Float64Array(N);
  let j = 0;
  while (j < N) {
    const v = [0, 7.25, 7.25, -7.25, 3.5][Math.floor(rnd() * 5)];
    for (let i = 8 + Math.floor(rnd() * 150); i > 0 && j < N; i--, j++) out[j] = v;
  }
  return out;
}
/**
 * Die Tabelle aus Krümmung K, Steigung GR und Bezugslinie XR, wie course.fill sie schreibt: Kurs und Höhe aufsummiert
 * (am Spieler, d = 0, beide 0), die Lage der Linie x = 0 mit Q' = (1 − xr · kappa) · T (Simpson), am Spieler 0.
 * tilt: Rest, um den der Kurs danach noch gedreht wird, während die Lage stehen bleibt. course.fill zieht am Ende ab,
 * was die Hermite-Form am Spieler vom genauen Kurs abweicht (siehe tableTilt).
 */
function setTable(K, GR, XR, tilt = 0) {
  const TH = new Float64Array(N);
  const Y = new Float64Array(N);
  for (let j = 0; j + 1 < N; j++) {
    TH[j + 1] = TH[j] + (DS * (K[j] + K[j + 1])) / 2;
    Y[j + 1] = Y[j] + (DS * (GR[j] + GR[j + 1])) / 2;
  }
  writeTable(K, TH, Y, GR, XR, tilt);
}
/** Dasselbe mit gegebenem Kurs TH und gegebener Höhe Y an den Stützstellen (sie müssen nicht die Trapezsummen sein). */
function writeTable(K, TH, Y, GR, XR, tilt = 0) {
  const QX = new Float64Array(N);
  const QZ = new Float64Array(N);
  // Kurs am Spieler 0, in der Hermite-Form, die der Shader liest
  const u = -D0 / DS;
  const j0 = Math.floor(u);
  const t = u - j0;
  const t2 = t * t;
  const t3 = t2 * t;
  const th0 = (2 * t3 - 3 * t2 + 1) * TH[j0] + (t3 - 2 * t2 + t) * DS * K[j0] + (3 * t2 - 2 * t3) * TH[j0 + 1] + (t3 - t2) * DS * K[j0 + 1];
  for (let j = 0; j < N; j++) TH[j] -= th0;
  for (let j = 0; j + 1 < N; j++) {
    const tm = 0.5 * (TH[j] + TH[j + 1]) + (DS * (K[j] - K[j + 1])) / 8;
    const fa = 1 - XR[j] * K[j];
    const fb = 1 - XR[j + 1] * K[j + 1];
    const fm = 1 - 0.25 * (XR[j] + XR[j + 1]) * (K[j] + K[j + 1]);
    QX[j + 1] = QX[j] - (DS / 6) * (fa * Math.sin(TH[j]) + 4 * fm * Math.sin(tm) + fb * Math.sin(TH[j + 1]));
    QZ[j + 1] = QZ[j] - (DS / 6) * (fa * Math.cos(TH[j]) + 4 * fm * Math.cos(tm) + fb * Math.cos(TH[j + 1]));
  }
  for (let j = 0; j < N; j++) curveTable.set(j, QX[j], QZ[j], TH[j], Y[j], K[j], XR[j], GR[j]);
  // am Spieler Lage und Höhe 0
  const c = curveAt(0);
  const [qx, qz, y] = [c.x, c.z, c.y];
  for (let j = 0; j < N; j++) curveTable.set(j, QX[j] - qx, QZ[j] - qz, TH[j] - tilt, Y[j] - y, K[j], XR[j], GR[j]);
  curveTable.commit();
}
/**
 * Rest des Kurses in der Tabelle (rad): Um so viel ist die Linie x = 0 gegen den gespeicherten Kurs gedreht. Gemessen
 * am Spieler: Richtung der Sehne zwischen zwei Stützstellen gegen dieselbe Simpson-Summe, mit der course.fill die Lage
 * aufsummiert. curveBound rechnet mit einer Linie, die ihrem Kurs folgt; den Rest muss die Luft der Hülle tragen.
 */
function tableTilt() {
  const D = curveTable.data;
  const j = Math.floor(-D0 / DS);
  const a = j * 4;
  const b = (N + j) * 4;
  const [ta, tb, ka, kb, xa, xb] = [D[a + 2], D[a + 6], D[b], D[b + 4], D[b + 1], D[b + 5]];
  const tm = 0.5 * (ta + tb) + (DS * (ka - kb)) / 8;
  const fa = 1 - xa * ka;
  const fb = 1 - xb * kb;
  const fm = 1 - 0.25 * (xa + xb) * (ka + kb);
  const sx = -(fa * Math.sin(ta) + 4 * fm * Math.sin(tm) + fb * Math.sin(tb));
  const sz = -(fa * Math.cos(ta) + 4 * fm * Math.cos(tm) + fb * Math.cos(tb));
  const cx = D[a + 4] - D[a];
  const cz = D[a + 5] - D[a + 1];
  return Math.atan2(sx * cz - sz * cx, sx * cx + sz * cz);
}
// So viel Rest steckt in den erdachten Bahnen (±), und so viel dürfen die echten höchstens haben
const TILT = 1e-3;
const tilted = (rnd) => (rnd() * 2 - 1) * TILT;
const zeros = () => new Float64Array(N);
const BAHNEN = {
  // die Grenzen des Spiels (course.js KINDS: Landstraße bis R 110 m und 10 % Steigung)
  'wie im Spiel': (rnd) => setTable(profile(rnd, 1 / 110), profile(rnd, 0.1), refLine(rnd), tilted(rnd)),
  // doppelt so eng und steiler
  'enger und steiler': (rnd) => setTable(profile(rnd, 1 / 55), profile(rnd, 0.16), refLine(rnd), tilted(rnd)),
  // lange Bögen in eine Richtung: Schleifen, die ferne Welt fällt auf die nahe zurück (FOLD in curve.js)
  Schleifen: (rnd) => {
    const K = zeros();
    const k = (rnd() < 0.5 ? -1 : 1) / (110 + rnd() * 500);
    const from = 40 + Math.floor(rnd() * 120);
    for (let j = from; j < N; j++) K[j] = k * Math.min(1, (j - from) / 8);
    setTable(K, profile(rnd, 0.06), refLine(rnd), tilted(rnd));
  },
  gerade: () => {
    curveTable.flat();
    curveTable.commit();
  },
};

// --- 1. curveBound ---------------------------------------------------------------------------------------------------
const _s = new THREE.Sphere();
const _p = new THREE.Vector3();

/** Ein Quader der geraden Welt (Mitte cx, cy, d; halbe Kanten ex, ey, ez): Liegt nach dem Biegen jeder seiner Punkte in der Hülle? */
function boxCheck(rnd, acc, ex, ey, ez, cx, cy, d) {
  _s.center.set(cx, cy, -d);
  _s.radius = ex;
  // (ein Würfel auch in der Kurzform: curveBound(Kugel) nimmt den Würfel um sie)
  if (ex === ey && ex === ez) curveBound(_s);
  else curveBound(_s, ex, ey, ez);
  const R = _s.radius;
  const bx = _s.center.x;
  const by = _s.center.y;
  const bz = _s.center.z;
  let far = 0;
  const one = (x, y, z) => {
    curvePoint(_p.set(cx + x * ex, cy + y * ey, -d + z * ez));
    const dist = Math.hypot(_p.x - bx, _p.y - by, _p.z - bz);
    if (dist > far) far = dist;
  };
  // Mitte, Ecken, Kanten- und Flächenmitten: dort stehen die äußersten Punkte
  for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) one(x, y, z);
  // dazu Punkte irgendwo im Quader und auf seinen Seiten
  for (let k = 0; k < 22; k++) {
    const q = [rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1];
    if (k & 1) q[k % 3] = k & 2 ? 1 : -1;
    one(q[0], q[1], q[2]);
  }
  acc.n++;
  acc.points += 49;
  if (far > R + 1e-6) miss(acc.out, () => `Quader x=${f1(cx)} y=${f1(cy)} d=${f1(d)}, halbe Kanten ${f1(ex)} × ${f1(ey)} × ${f1(ez)}: Punkt ${f1(far)} m vom Mittelpunkt der Hülle, Radius ${f1(R)}`);
  acc.slack = Math.min(acc.slack, R - far);
  acc.ratio += R / Math.max(far, 1e-9);
}
/** Zufällige Quader der geraden Welt: Liegt nach dem Biegen jeder ihrer Punkte in der Hülle von curveBound? */
function hullCheck(rnd, boxes, acc) {
  for (let i = 0; i < boxes; i++) {
    // halbe Kanten quer, hoch, längs: kleine Dinge, Reihen nah an der Straße, Reihen in der Ferne (auch geschert:
    // sehr breit), große Würfel
    const kind = rnd();
    let ex;
    let ey;
    let ez;
    if (kind < 0.2) ex = ey = ez = 0.5 + rnd() * 6;
    else if (kind < 0.5) [ex, ey, ez] = [15 + rnd() * 50, 2 + rnd() * 14, 20 + rnd() * 25];
    else if (kind < 0.8) [ex, ey, ez] = [60 + rnd() * 340, 3 + rnd() * 20, 20 + rnd() * 40];
    else ex = ey = ez = 60 + rnd() * 240;
    const cx = (rnd() * 2 - 1) * (rnd() < 0.6 ? 140 : 900);
    const cy = -8 + rnd() * 50;
    // meist in der Tabelle, manchmal an ihren Enden und darüber hinaus
    const d = rnd() < 0.1 ? (rnd() < 0.5 ? D0 - 60 + rnd() * 120 : D0 + N * DS - 120 + rnd() * 300) : -420 + rnd() * 3900;
    boxCheck(rnd, acc, ex, ey, ez, cx, cy, d);
  }
}
/**
 * Breite, kurze Quader quer über einem Wechsel der Bezugslinie (xr springt dort von einer Stützstelle zur nächsten,
 * und alles, was neben der Straße steht, springt quer mit): Zufallsquader treffen diese Stellen zu selten so, dass es
 * auf den Sprung ankommt.
 */
function jumpCheck(rnd, boxes, acc) {
  const D = curveTable.data;
  const at = [];
  for (let j = 0; j + 1 < N; j++) if (D[(N + j) * 4 + 1] !== D[(N + j + 1) * 4 + 1]) at.push(j);
  for (let i = 0; at.length && i < boxes; i++) {
    const d = D0 + (at[Math.floor(rnd() * at.length)] + rnd()) * DS;
    boxCheck(rnd, acc, 60 + rnd() * 340, 3 + rnd() * 20, 0.5 + rnd() * 8, (rnd() * 2 - 1) * (rnd() < 0.6 ? 140 : 900), -8 + rnd() * 50, d);
  }
}
const newAcc = () => ({ n: 0, points: 0, out: tally(), slack: Infinity, ratio: 0 });
const accText = (a) => `${a.n} Quader, ${a.points} Punkte: ${told(a.out)} (knappster Punkt ${a.slack.toFixed(2)} m innen, Hülle im Mittel ${(a.ratio / a.n).toFixed(2)}-mal so weit wie ihr fernster Punkt)`;

console.log('curveBound: Die Hülle enthält alles, was vor dem Biegen im Quader lag');
{
  const rnd = rng(7);
  const rndJ = rng(41);
  const jumps = newAcc();
  for (const [name, make] of Object.entries(BAHNEN)) {
    const acc = newAcc();
    const tables = name === 'gerade' ? 1 : 40;
    for (let t = 0; t < tables; t++) {
      make(rnd);
      hullCheck(rnd, 250, acc);
      jumpCheck(rndJ, 40, jumps);
    }
    check(acc.out.n === 0 && acc.slack >= 0, `Bahnen „${name}“ (${tables}): ${accText(acc)}`);
  }
  check(jumps.n > 4000 && jumps.out.n === 0 && jumps.slack >= 0, `… und quer über den Wechseln der Bezugslinie: ${accText(jumps)}`);
  // (die Messung des Rests selbst: Was setTable hineindreht, findet tableTilt wieder)
  setTable(profile(rnd, 1 / 110), profile(rnd, 0.1), refLine(rnd), 0.0007);
  const found = Math.abs(tableTilt());
  setTable(profile(rnd, 1 / 110), profile(rnd, 0.1), refLine(rnd));
  check(Math.abs(found - 0.0007) < 2e-5 && Math.abs(tableTilt()) < 2e-5, `die erdachten Bahnen tragen bis ${TILT * 1000} mrad Rest im Kurs (tableTilt misst ihn: ${(found * 1000).toFixed(2)} von 0,70 mrad, ohne Rest ${(Math.abs(tableTilt()) * 1000).toFixed(2)})`);
  // die gerade Welt biegt nichts: Dort darf die Hülle kaum größer sein als die Kugel selbst
  curveTable.flat();
  curveTable.commit();
  _s.center.set(40, 6, -900);
  curveBound(_s, 45, 9, 30);
  const diag = Math.hypot(45, 9, 30);
  check(Math.abs(_s.center.x - 40) < 1e-9 && Math.abs(_s.center.y - 6) < 1e-9 && Math.abs(_s.center.z + 900) < 1e-9 && _s.radius >= diag && _s.radius < diag * 1.03 + 0.3, `gerade Welt: Ein Quader 90 × 18 × 60 m bleibt, wo er ist; Hülle ${_s.radius.toFixed(2)} m bei ${diag.toFixed(2)} m halber Diagonale`);
}

// --- Bahnen, deren Kurs nicht die Trapezsumme der Krümmung ist ---------------------------------------------------------
// course.fill schreibt den genauen Kurs des Straßenprofils in die Tabelle (course.js walk): Das Profil hat die Krümmung
// alle 5 m und verbindet sie gerade, die Tabelle tastet alle 7,5 m ab. Wo die Krümmung sich biegt (Anfang und Ende
// eines Übergangs, Spitze eines kurzen Bogens), ist der Unterschied der Kurse zweier Stützstellen nicht die Trapezsumme
// ihrer kappa: Dazwischen dreht der Kurs schneller oder langsamer, als kappa sagt, und was weit neben der Straße steht,
// wandert entsprechend weiter (curveBound: v). Die erdachten Bahnen oben kennen das nicht, und Zufallsquader treffen
// die wenigen Stellen kaum: Hier wird gezielt dort geprüft, weit draußen und mit kleinen Quadern.
const sstep = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
/** Schlange aus Bögen wie in course.js (bendAt): meist spitz (nur Übergänge), dicht an dicht, bis Krümmung k. */
function snake(rnd, from, to, k, t) {
  const out = [];
  let a = from;
  let sign = rnd() < 0.5 ? 1 : -1;
  while (a < to) {
    const A = sign * (rnd() < 0.6 ? k * t * (0.9 + 0.0999 * rnd()) : 0.5 + rnd() * 1.5);
    const e = bendAt(a, A, k, t);
    out.push(e);
    a = e.b + (rnd() < 0.7 ? 0 : rnd() * 30);
    if (rnd() < 0.8) sign = -sign;
  }
  return out;
}
/**
 * Tabelle aus einem Profil wie in course.js: Krümmung der Bögen alle 5 m (weiche Übergänge), gerade verbunden; der
 * Kurs ist ihr genaues Integral; abgetastet alle DS Meter ab der Weg-Stelle phase.
 */
function sampledTable(bends, phase, XR) {
  const PDS = 5;
  const n = Math.ceil((phase + N * DS) / PDS) + 2;
  const kp = new Float64Array(n);
  for (const e of bends) {
    for (let i = Math.max(0, Math.floor(e.a / PDS)); i <= Math.min(n - 1, Math.ceil(e.b / PDS)); i++) {
      const s = i * PDS;
      if (s <= e.a || s >= e.b) continue;
      kp[i] += e.k * (s - e.a < e.t ? sstep((s - e.a) / e.t) : e.b - s < e.t ? sstep((e.b - s) / e.t) : 1);
    }
  }
  const tp = new Float64Array(n);
  for (let i = 1; i < n; i++) tp[i] = tp[i - 1] + 0.5 * PDS * (kp[i - 1] + kp[i]);
  const K = zeros();
  const TH = zeros();
  for (let j = 0; j < N; j++) {
    const s = phase + j * DS;
    const i = Math.min(n - 2, Math.floor(s / PDS));
    const tau = s - i * PDS;
    const dk = kp[i + 1] - kp[i];
    K[j] = kp[i] + (dk * tau) / PDS;
    TH[j] = tp[i] + tau * (kp[i] + (dk * tau) / (2 * PDS));
  }
  writeTable(K, TH, zeros(), zeros(), XR);
}
/** Wie weit der Kurs der Tabelle zwischen zwei Stützstellen von der Trapezsumme abweicht: je Stück, in rad. */
function trapezGaps() {
  const D = curveTable.data;
  const out = new Float64Array(N - 1);
  for (let j = 0; j + 1 < N; j++) out[j] = D[(j + 1) * 4 + 2] - D[j * 4 + 2] - (DS * (D[(N + j) * 4] + D[(N + j + 1) * 4])) / 2;
  return out;
}
/**
 * Quader gezielt an den Stücken mit der größten Abweichung: klein bis reihenlang, auf der Straße, nah und sehr weit
 * daneben, innen und außen (xs: ihre Querlagen). Punkte dicht längs (der äußerste liegt zwischen den Stützstellen).
 * (Auf der Straße sind breite, lange Quader am knappsten für den Schrägfaktor: Dort sind Länge und Breite ähnlich.)
 */
const FAR_OUT = [-2000, -900, -400, -150, -40, -12, 0, 12, 40, 150, 400, 900, 2000];
function gapCheck(rnd, acc, xs = FAR_OUT) {
  const gaps = trapezGaps();
  const order = Array.from(gaps.keys()).sort((a, b) => Math.abs(gaps[b]) * (0.5 + rnd()) - Math.abs(gaps[a]) * (0.5 + rnd()));
  for (let c = 0; c < 10; c++) {
    const j = order[c];
    acc.gap = Math.max(acc.gap, Math.abs(gaps[j]));
    for (const frac of [0, 0.25, 0.5, 0.75]) {
      const d = D0 + (j + frac) * DS;
      for (const ez of [0.5, 2, 3.75, 7.5, 15, 25]) {
        for (const cx of xs) {
          const ex = [0, 3, 12][Math.floor(rnd() * 3)];
          const ey = 2;
          _s.center.set(cx, ey, -d);
          curveBound(_s, ex, ey, ez);
          const R = _s.radius;
          const [bx, by, bz] = [_s.center.x, _s.center.y, _s.center.z];
          let far = 0;
          for (let i = 0; i <= 24; i++) {
            for (let x = -1; x <= 1; x++) {
              curvePoint(_p.set(cx + x * ex, i & 1 ? 0 : 2 * ey, -(d - ez + (ez * i) / 12)));
              far = Math.max(far, Math.hypot(_p.x - bx, _p.y - by, _p.z - bz));
            }
          }
          acc.n++;
          acc.points += 75;
          if (far > R + 1e-6) miss(acc.out, () => `Quader x=${f1(cx)} d=${f1(d)}, halbe Kanten ${f1(ex)} × ${f1(ey)} × ${f1(ez)}: Punkt ${far.toFixed(2)} m vom Mittelpunkt der Hülle, Radius ${R.toFixed(2)}`);
          acc.slack = Math.min(acc.slack, R - far);
          // dasselbe ohne die Luft der Hülle (0,25 m + 2 %): wie weit die Rechnung allein trägt. Nur wo der Zuschlag der
          // Rückfaltung fehlt (mit ihm ist die Hülle 30 m weiter, daran ist nichts zu messen)
          if (R < 30) acc.raw = Math.min(acc.raw, (R - 0.25) / 1.02 - far);
          acc.ratio += R / Math.max(far, 1e-9);
        }
      }
    }
  }
}
/** Für gapCheck: dazu der größte Abstand des Kurses von der Trapezsumme und der knappste Punkt ohne die Luft der Hülle. */
const gapAcc = () => ({ ...newAcc(), gap: 0, raw: Infinity });
const rawText = (a) => `ohne die Luft der Hülle ${(a.raw * 1000).toFixed(1)} mm`;

console.log('curveBound, wo der Kurs zwischen den Stützstellen anders dreht als die Krümmung');
{
  const rnd = rng(23);
  // Grenzen der Landstraße (course.js KINDS.land: R 110 m, Übergang 45 m) und doppelt so scharf
  for (const [name, k, t] of [['wie die Landstraße (R 110 m, Übergang 45 m)', 1 / 110, 45], ['schärfer (R 55 m, Übergang 22 m)', 1 / 55, 22]]) {
    const acc = gapAcc();
    const rand = newAcc();
    for (let n = 0; n < 30; n++) {
      sampledTable(snake(rnd, 100 + rnd() * 50, N * DS + 200, k, t), rnd() * 5, refLine(rnd));
      gapCheck(rnd, acc);
      hullCheck(rnd, 120, rand);
    }
    // (die Luft der Hülle, 0,25 m + 2 %, bleibt dabei unberührt: Die Rechnung selbst trägt, auf 5 mm genau – ein
    // Faktor 1,4 statt 1,5 am Term für die Drehung des Kurses fiele hier schon auf)
    check(acc.out.n === 0 && acc.slack >= 0.24 && acc.raw >= -0.005, `Schlangen ${name}, Kurs bis ${(acc.gap * 1000).toFixed(2)} mrad neben der Trapezsumme: ${accText(acc)}, ${rawText(acc)}`);
    check(rand.out.n === 0 && rand.slack >= 0, `… und Zufallsquader dort: ${accText(rand)}`);
  }
  // Dasselbe gilt für den Abstand der Bezugslinie zur Linie x = 0 (xr): Auch er dreht mit dem Kurs. Im Spiel sind es
  // höchstens 7,25 m, das trüge die Luft der Hülle; hier steht die Bezugslinie 300 m daneben und die Quader an ihr
  {
    const rndX = rng(29);
    const acc = gapAcc();
    for (const [k, t] of [[1 / 110, 45], [1 / 55, 22]]) {
      for (let n = 0; n < 12; n++) {
        const xr = n & 1 ? 300 : -300;
        sampledTable(snake(rndX, 100 + rndX() * 50, N * DS + 200, k, t), rndX() * 5, zeros().fill(xr));
        gapCheck(rndX, acc, [xr - 40, xr - 10, xr, xr + 10, xr + 40]);
      }
    }
    check(acc.out.n === 0 && acc.slack >= 0.24 && acc.raw >= -0.005, `Bezugslinie 300 m neben der Linie x = 0, Quader an ihr: ${accText(acc)}, ${rawText(acc)}`);
  }
  // Am knappsten für den Schrägfaktor der Hülle (Länge und Breite stehen nach dem Biegen nicht mehr senkrecht
  // aufeinander) sind gleichmäßig enge Bögen, in denen der Kurs überall neben der Trapezsumme liegt, und breite, lange
  // Quader auf der Straße. Im Spiel gibt es den Rest nur an den Enden der Übergänge; hier liegt er auf jedem zweiten
  // Stück, bis zum Achtfachen (1 mrad je Meter)
  {
    const rndP = rng(31);
    const acc = gapAcc();
    for (let n = 0; n < 24; n++) {
      const K = zeros();
      const TH = zeros();
      for (let j = 0, v = 0; j < N; ) {
        const target = rndP() < 0.35 ? 0 : (rndP() * 2 - 1) / 110;
        const ramp = 1 + Math.floor(rndP() * 14);
        for (let i = 1; i <= ramp && j < N; i++, j++) K[j] = v + ((target - v) * i) / ramp;
        v = target;
        for (let i = Math.floor(rndP() * 60); i > 0 && j < N; i--, j++) K[j] = v;
      }
      for (let j = 0; j + 1 < N; j++) TH[j + 1] = TH[j] + DS * ((K[j] + K[j + 1]) / 2 + (rndP() < 0.5 ? (rndP() * 2 - 1) * 1e-3 : 0));
      writeTable(K, TH, zeros(), zeros(), zeros());
      gapCheck(rndP, acc, [-40, -12, 0, 12, 40]);
    }
    check(acc.out.n === 0 && acc.slack >= 0.24 && acc.raw >= -0.005, `gleichmäßige Bögen (R 110 m), Kurs überall bis ${(acc.gap * 1000).toFixed(2)} mrad neben der Trapezsumme, Quader auf der Straße: ${accText(acc)}, ${rawText(acc)}`);
  }
  // dasselbe mit der Tabelle, die course.fill selbst schreibt: Kurvenprobe aus Schlangen an der Grenze der Landstraße
  const saved = PROBE.splice(0, PROBE.length);
  PROBE.push({ kind: 'ab', len: 800, k: [], g: [], name: 'Start' });
  for (let sec = 0; sec < 4; sec++) PROBE.push({ kind: 'land', len: 4000, k: snake(rnd, 150, 3700, 1 / 110, 45), g: [], name: `Schlange ${sec}` });
  const course = new Course({ seed: 7 });
  course.mode = 'probe';
  const acc = gapAcc();
  for (let n = 0; n < 40; n++) {
    course.fill(null, -600 + rnd() * 12000, curveTable, 1 / 60);
    curveTable.commit();
    gapCheck(rnd, acc);
  }
  PROBE.splice(0, PROBE.length, ...saved);
  check(acc.gap > 5e-4, `course.fill schreibt solche Bahnen: Kurs bis ${(acc.gap * 1000).toFixed(2)} mrad neben der Trapezsumme`);
  check(acc.out.n === 0 && acc.slack >= 0.24 && acc.raw >= -0.005, `Schlangen aus course.fill: ${accText(acc)}, ${rawText(acc)}`);
}

// --- Fahrten über die Karte (wie tools/xxl-test.mjs: Fahrphysik, Autopilot, course.fill je Bild) ------------------------
/** Fährt metres weit und ruft alle step Meter each(s, x) mit der Bahn dieser Stelle in der Tabelle. */
function drive(trip, metres, step, each, dt = 1 / 30) {
  const p = new Player();
  p.s = trip.s;
  p.x = trip.x;
  p.speed = 40 / 3.6;
  p.lawful = true;
  const course = new Course({ planner: new MapPlanner({ graph: G, shapes, water: sectionWater }) });
  const env = { kappa: 0, grade: 0 };
  course.fill(trip, p.s, curveTable, dt);
  const lim = { left: 0, right: 0, shoulder: 0, lanes: null, extraLane: null, vmax: Infinity, decel: 0, slack: 0, closing: 0 };
  const arrival = new Arrival();
  const end = p.s + metres;
  let next = p.s;
  let resting = 0;
  let guard = 0;
  let kmax = 0;
  let tilt = 0;
  while (p.s < end && guard++ < 400000) {
    limitsFor(trip, lim, arrival.stop(trip));
    p.setLimits(lim);
    const ctl = { steer: 0, throttle: 1, brake: 0 };
    let k = 0;
    for (let d = 0; d <= AUTO.ahead; d += 20) k = Math.max(k, Math.abs(curveAt(d).k));
    autoDrive(ctl, p, autoTarget(trip), lim.vmax, k);
    if (resting > 0) {
      ctl.throttle = 0;
      resting -= dt;
    }
    env.kappa = course.state.kappa;
    env.grade = course.state.grade;
    p.update(dt, ctl, env);
    const evs = trip.update(p.s, p.x);
    course.fill(trip, p.s, curveTable, dt);
    tilt = Math.max(tilt, Math.abs(tableTilt()));
    if (arrival.update(trip, evs, p.speed)) resting = 2;
    if (p.s >= next) {
      next = p.s + step;
      curveTable.commit();
      for (let j = 0; j < N; j++) kmax = Math.max(kmax, Math.abs(curveTable.data[(N + j) * 4]));
      each(p.s, p.x);
    }
  }
  return { metres: p.s - (end - metres), kmax, tilt };
}
const FAHRTEN = [
  ['Erlensee → Hanau', 'Hanau', 1, 7000],
  ['Erlensee → Bacharach', 'Bacharach', 3, 14000],
  ['Erlensee → Wiesbaden', 'Wiesbaden', 3, 9000],
];
// Für die Hülle dazu eine Fahrt über die Landstraße (Start am Knoten Stralsund): Dort sind die Bögen am engsten, und
// wo zwei Gegenbögen aufeinandertreffen, ist der Rest im Kurs der Tabelle am größten
const LANDSTRASSE = ['Stralsund → Gelbensande (Landstraße)', 'Gelbensande', 1008, 9000, 'Stralsund'];

console.log('curveBound auf den Bahnen echter Fahrten');
{
  const rnd = rng(11);
  let worstTilt = 0;
  for (const [name, target, seed, metres, from] of [...FAHRTEN, LANDSTRASSE]) {
    const start = from ? G.nodes.findIndex((n) => n.id === from) : undefined;
    const trip = new Trip({ start, rng: rng(seed) });
    trip.setTarget(G.findPlace(target));
    const acc = newAcc();
    const r = drive(trip, metres, 60, () => hullCheck(rnd, 60, acc));
    check(acc.out.n === 0 && acc.slack >= 0, `${name} (${f1(r.metres / 1000)} km, engster Bogen R ${r.kmax ? Math.round(1 / r.kmax) : '∞'} m): ${accText(acc)}`);
    worstTilt = Math.max(worstTilt, r.tilt);
  }
  // womit die Hülle rechnet: Die Tabelle des Spiels folgt ihrem Kurs (die erdachten Bahnen oben tragen mehr Rest)
  check(worstTilt < TILT, `Rest im Kurs der Tabelle auf diesen Fahrten: höchstens ${(worstTilt * 1000).toFixed(3)} mrad (erlaubt ${TILT * 1000})`);
}

// --- 2. RowCull --------------------------------------------------------------------------------------------------------
const renderer = { info: { render: { frame: 0 } } };
const newFrame = () => ++renderer.info.render.frame;
function persp(fov, aspect, near, far, pos, look) {
  const c = new THREE.PerspectiveCamera(fov, aspect, near, far);
  c.position.set(...pos);
  c.lookAt(...look);
  c.updateMatrixWorld(true);
  return c;
}
/** Schattenkasten der Sonne wie world/sky.js (96 × 176 m, „oben“ ist die Fahrtrichtung), aus Richtung dir. */
function shadowBox(center, dir) {
  const c = new THREE.OrthographicCamera(-48, 48, 88, -88, 10, 400);
  c.up.set(0, 0, -1);
  c.position.set(center[0] + dir[0] * 200, center[1] + dir[1] * 200, center[2] + dir[2] * 200);
  c.lookAt(...center);
  c.updateMatrixWorld(true);
  return c;
}
// die Kameras von main.js am Wagen bei Querlage x
const SIDE_FOV = (2 * Math.atan(Math.tan((100 * Math.PI) / 360) / (384 / 72)) * 180) / Math.PI;
const CAMS = {
  Sicht: (x) => persp(58, 16 / 9, 0.25, 3200, [x - 0.38, 1.2, 0.3], [x - 0.38, 1.05, -40]),
  Drohne: (x) => persp(58, 16 / 9, 0.25, 3200, [x, 4.2, 9.5], [x, 1.2, -12]),
  Rückspiegel: (x) => persp(21, 0.245 / 0.072, 0.6, 700, [x, 1.32, 0.9], [x, 1.05, 40]),
  Seitenfenster: (x) => persp(SIDE_FOV, 384 / 72, 0.4, 700, [x - 0.38, 1.2, 0.3], [x - 30.38, -0.4, 0.3]),
  Schattenkarte: (x) => shadowBox([x, 0, -48], [0.45, 0.62, 0.64]),
};
const _frustum = new THREE.Frustum();
const _proj = new THREE.Matrix4();
const frustumOf = (cam) => _frustum.setFromProjectionMatrix(_proj.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse));

console.log('RowCull: Quader, Durchgänge, Stand der Bahn');
{
  curveTable.flat();
  curveTable.commit();
  const obj = { matrixWorld: new THREE.Matrix4() };
  const cull = new RowCull();
  // sechs Reihen, hinten zuerst: 400 m hinter dem Wagen, dann 100, 600, 1100, 1600 und 2100 m voraus, je links und rechts
  const dOf = (row) => 500 * row - 400;
  const fillRows = () => {
    cull.reset(6);
    for (let row = 0; row < 6; row++) for (const x of [-30, 30]) cull.add(row, x, 5, -dOf(row), 6);
  };
  fillRows();
  const front = CAMS.Sicht(0);
  const near = persp(58, 16 / 9, 0.25, 700, [0, 1.2, 0], [0, 1.2, -40]);
  const mirror = CAMS.Rückspiegel(0);
  const up = persp(40, 1, 0.3, 3000, [0, 50, 0], [0, 500, -1]);
  const last = (cam) => (newFrame(), cull.last(renderer, cam, obj));
  check(last(front) === 5, 'Blick nach vorn (3200 m weit): bis zur letzten Reihe');
  check(last(near) === 2, 'Blick nach vorn, 700 m weit: bis zur Reihe 600 m voraus');
  check(last(mirror) === 0, 'Rückspiegel: nur die Reihe hinter dem Wagen');
  check(last(up) === -1, 'Blick in den Himmel: keine Reihe');
  // Im Sichtkörper zählt genau die Kugel der Hülle: Ragt sie 3 % ihres Radius in einen schmalen Blick neben ihr, wird
  // die Reihe gezeichnet, steht sie 3 % daneben, nicht
  const [hx, hy, hz, hr] = cull.hull(rowBox(1, 30));
  const beside = (f) => {
    const c = new THREE.OrthographicCamera(0, 10, 20, -20, 0, 400);
    c.position.set(hx + f * hr, hy, hz + 200);
    c.updateMatrixWorld(true);
    return c;
  };
  check(last(beside(0.97)) === 1 && last(beside(1.03)) === -1, `Kugel der Hülle (Radius ${hr.toFixed(2)} m): 3 % im Blick zählt, 3 % daneben nicht`);
  // … und in ihrer Höhe: Was 400 m über der Straße hängt, sieht der Blick in den Himmel, der nach vorn nicht
  const high = new RowCull();
  high.reset(1);
  high.add(0, 30, 400, 0, 6);
  const highSeen = (cam) => (newFrame(), high.last(renderer, cam, obj));
  check(highSeen(up) === 0 && highSeen(front) === -1, 'Höhe der Hülle: 400 m über der Straße sieht nur der Blick in den Himmel');
  // je Seite ein eigener Quader: Ein Hof weit links macht die Reihe für den Blick nach rechts nicht sichtbar
  cull.add(5, -300, 5, 120, 8);
  const right = persp(50, 1.6, 0.3, 700, [0, 1.5, 0], [200, 1.5, 0]);
  const left = persp(50, 1.6, 0.3, 700, [0, 1.5, 0], [-200, 1.5, 0]);
  check(last(right) === -1 && last(left) === 5, 'Quader je Seite und Abstand: weit links steht nichts für den Blick nach rechts');
  check(rowBox(3, -150) === 12 && rowBox(3, -20) === 13 && rowBox(3, 20) === 14 && rowBox(3, 150) === 15, 'vier Quader je Reihe: fern links, nah links, nah rechts, fern rechts');
  // ein Ergebnis je Durchgang: dieselbe Kamera im selben Bild fragt nicht noch einmal
  fillRows();
  rowStats.bounds = 0;
  newFrame();
  const a = cull.last(renderer, mirror, obj);
  const made = rowStats.bounds;
  const b = cull.last(renderer, mirror, obj);
  // (von vorn her: zehn Quader der fünf Reihen voraus, dann der erste sichtbare hinter dem Wagen)
  check(a === b && made === 11 && rowStats.bounds === made, `Rückspiegel: ${made} Hüllen im ersten Durchgang gerechnet, im selben Bild keine weitere`);
  // nächstes Bild, Bahn und Lage unverändert: Die Hüllen gelten weiter, auch für andere Kameras
  newFrame();
  cull.last(renderer, mirror, obj);
  cull.last(renderer, near, obj);
  check(rowStats.bounds === made, 'gleiche Bahn, gleiche Lage: keine Hülle neu gerechnet (auch nicht für die nächste Kamera)');
  // neue Bahn: alles neu
  BAHNEN['wie im Spiel'](rng(3));
  newFrame();
  cull.last(renderer, mirror, obj);
  check(rowStats.bounds > made, 'neuer Stand der Bahn: Hüllen neu gerechnet');
  // andere Lage des Netzes: ebenso
  const before = rowStats.bounds;
  obj.matrixWorld.makeTranslation(0, 0, 25);
  newFrame();
  cull.last(renderer, mirror, obj);
  check(rowStats.bounds > before, 'Netz verschoben: Hüllen neu gerechnet');
  obj.matrixWorld.identity();
  curveTable.flat();
  curveTable.commit();
  // leeren und übernehmen
  cull.clearRow(0);
  check(last(mirror) === -1 && cull.hull(0) === null && cull.hull(2) === null, 'clearRow: Die Reihe hinter dem Wagen ist leer, der Rückspiegel zeichnet nichts');
  const other = new RowCull();
  other.reset(2);
  other.take(1, cull, 1);
  check(other.hull(rowBox(1, -30)) !== null && other.hull(rowBox(1, 30)) !== null && other.hull(rowBox(0, 30)) === null, 'take: Die Quader einer Reihe wandern in eine andere Buchführung');
  check((newFrame(), other.last(renderer, near, obj)) === 1, 'take: Die übernommene Reihe 100 m voraus wird gesehen');
  // ohne Reihen (Prüfbilder im Browser): jeder Durchgang alle
  fillRows();
  setRowCull(false);
  const off = last(mirror);
  setRowCull(true);
  check(off === 5 && last(mirror) === 0, 'setRowCull(false): alle Reihen in jedem Durchgang, danach wieder nur die sichtbaren');

  // Haken am Netz: je Durchgang nur bis zur letzten sichtbaren Reihe, danach wieder alle
  const mesh = cullByRows({ userData: {}, count: 0, matrixWorld: new THREE.Matrix4() }, cull);
  check(mesh.userData.rowTotal === 0 && mesh.userData.rowStart.length === 1, 'cullByRows: ein neues Netz hat keine Instanzen');
  newFrame();
  mesh.onBeforeRender(renderer, null, mirror);
  check(mesh.count === 0, 'leeres Netz: nichts zu zeichnen');
  mesh.onAfterRender();
  mesh.userData.rowStart = Uint32Array.of(0, 3, 7, 7, 12, 20, 21);
  mesh.userData.rowTotal = mesh.count = 21;
  rowStats.drawn = rowStats.total = 0;
  newFrame();
  mesh.onBeforeRender(renderer, null, mirror);
  const inMirror = mesh.count;
  mesh.onAfterRender();
  const afterMirror = mesh.count;
  mesh.onBeforeRender(renderer, null, near);
  const inNear = mesh.count;
  mesh.onAfterRender();
  // (Schattenkarte: die Kamera des Durchgangs ist die der Sonne, nicht die des Bilds)
  mesh.onBeforeShadow(renderer, mesh, front, mirror);
  const inShadow = mesh.count;
  mesh.onAfterShadow();
  mesh.onBeforeRender(renderer, null, up);
  const inSky = mesh.count;
  mesh.onAfterRender();
  check(inMirror === 3 && inNear === 7 && inShadow === 3 && inSky === 0, `Zeichenaufrufe: Rückspiegel ${inMirror}, Sicht 700 m ${inNear}, Schatten ${inShadow}, Himmel ${inSky} von 21 Instanzen`);
  check(afterMirror === 21 && mesh.count === 21, 'nach jedem Durchgang gelten wieder alle Instanzen');
  check(rowStats.drawn === 13 && rowStats.total === 84, `Zähler: ${rowStats.drawn} von ${rowStats.total} gezeichnet`);
}

// --- 3. und 4.: Netze mit Reihen ------------------------------------------------------------------------------------
const canvas = new Proxy({}, { get: (t, k) => (k === 'measureText' ? (x) => ({ width: String(x).length * 10 }) : k === 'getImageData' ? (x, y, w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }) : k.startsWith?.('create') ? () => ({ addColorStop() {} }) : k in t ? t[k] : () => {}), set: (t, k, v) => ((t[k] = v), true) });
globalThis.document ??= { createElement: () => ({ width: 0, height: 0, getContext: () => canvas, style: {} }) };
const { Scenery, SEG } = await import('../src/world/scenery.js');
const { PropSet, TYPES, PROP, addProp } = await import('../src/world/xxl/forest.js');

const _m = new THREE.Matrix4();
const _v = new THREE.Vector3();
const _c = new THREE.Vector3();
const keyOf = (M, C, i) => Array.prototype.join.call(M.subarray(i * 16, i * 16 + 16), ',') + '|' + Array.prototype.join.call(C.subarray(i * 3, i * 3 + 3), ',');
/** Reihen eines Netzes: Anfänge aufsteigend, am Ende alle Instanzen; row(i) = Reihe der Instanz i. */
function rowsOf(mesh, cull, t) {
  const st = mesh.userData.rowStart;
  const total = mesh.userData.rowTotal;
  let ok = st.length === cull.n + 1 && st[0] === 0 && st[cull.n] === total && mesh.count === total;
  for (let r = 0; ok && r < cull.n; r++) ok = st[r] <= st[r + 1];
  if (!ok) miss(t, () => `rowStart ${Array.from(st).slice(0, 8)}… (${st.length}) bei ${cull.n} Reihen und ${total} Instanzen, count ${mesh.count}`);
  return ok;
}

/**
 * Ein Satz Netze mit gemeinsamer Buchführung cull, im Stand der Tabelle und ihrer Weltmatrix:
 * - jeder Eckpunkt jeder Instanz liegt im Quader ihrer Reihe (im Raum des Netzes),
 * - gebogen in dessen Hüllkugel,
 * - und für jede Kamera aus cams: kein Eckpunkt einer Instanz hinter der letzten gezeichneten Reihe im Sichtkörper.
 * stride: nur jeder soundsovielte Eckpunkt wird gebogen (phase wandert, so kommen über viele Aufrufe alle dran).
 * Gezeichnet ist dabei, was das Netz selbst nach seinem Haken (onBeforeRender, für die Schattenkarte onBeforeShadow)
 * zeichnen würde: mesh.count, wie three.js es im Durchgang liest; danach müssen wieder alle Instanzen gelten.
 * acc sammelt: boxes, balls, seen, hooks (Verstöße), verts, je Kamera drawn/total/visible.
 */
function checkSet(meshes, cull, cams, acc, stride = 1, phase = 0) {
  const live = meshes.filter((m) => m && m.userData.rowTotal > 0);
  if (!live.length) return;
  // die Hüllen dieses Stands (last() erkennt neue Bahn und neue Lage)
  newFrame();
  const lasts = cams.map(([, cam]) => cull.last(renderer, cam, live[0]));
  /** So viele Instanzen zeichnet das Netz in einem Durchgang mit dieser Kamera. */
  const drawnBy = (mesh, cam) => {
    const shadow = cam.isOrthographicCamera;
    if (shadow) mesh.onBeforeShadow(renderer, mesh, null, cam);
    else mesh.onBeforeRender(renderer, null, cam);
    const n = mesh.count;
    if (shadow) mesh.onAfterShadow();
    else mesh.onAfterRender();
    return n;
  };
  const planes = cams.map(([, cam]) => frustumOf(cam).planes.map((p) => [p.normal.x, p.normal.y, p.normal.z, p.constant]));
  for (let c = 0; c < cams.length; c++) {
    const st = (acc.cams[cams[c][0]] ??= { drawn: 0, total: 0, visible: 0, passes: 0 });
    st.passes++;
  }
  const B = cull.box;
  for (const mesh of live) {
    if (!rowsOf(mesh, cull, acc.rows)) continue;
    const st = mesh.userData.rowStart;
    const pos = mesh.geometry.attributes.position;
    const center = mesh.geometry.boundingSphere.center;
    const W = mesh.matrixWorld;
    const visible = new Uint8Array(cams.length);
    for (let c = 0; c < cams.length; c++) {
      const s = acc.cams[cams[c][0]];
      const want = lasts[c] < 0 ? 0 : st[lasts[c] + 1];
      const drawn = drawnBy(mesh, cams[c][1]);
      if (drawn !== want) miss(acc.hooks, () => `${cams[c][0]}: das Netz zeichnet ${drawn} statt ${want} Instanzen`);
      if (mesh.count !== mesh.userData.rowTotal) miss(acc.hooks, () => `${cams[c][0]}: nach dem Durchgang gelten ${mesh.count} statt ${mesh.userData.rowTotal} Instanzen`);
      s.drawn += drawn;
      s.total += mesh.userData.rowTotal;
    }
    for (let row = 0; row < cull.n; row++) {
      for (let i = st[row]; i < st[row + 1]; i++) {
        mesh.getMatrixAt(i, _m);
        const b = rowBox(row, _c.copy(center).applyMatrix4(_m).x);
        const o = b * 6;
        const hull = cull.hull(b);
        if (!hull) {
          miss(acc.boxes, () => `Instanz ${i} der Reihe ${row}: ihr Quader ${b} ist leer`);
          continue;
        }
        visible.fill(0);
        for (let k = 0; k < pos.count; k++) {
          _v.fromBufferAttribute(pos, k).applyMatrix4(_m);
          // (Quader in float32, Eckpunkte hier doppelt genau: 1 mm Spiel)
          if (_v.x < B[o] - 1e-3 || _v.y < B[o + 1] - 1e-3 || _v.z < B[o + 2] - 1e-3 || _v.x > B[o + 3] + 1e-3 || _v.y > B[o + 4] + 1e-3 || _v.z > B[o + 5] + 1e-3) {
            miss(acc.boxes, () => `Instanz ${i} der Reihe ${row}: Eckpunkt ${_v.toArray().map(f1)} außerhalb des Quaders ${Array.from(B.subarray(o, o + 6)).map(f1)}`);
          }
          if ((k + i + phase) % stride) continue;
          acc.verts++;
          curvePoint(_v.applyMatrix4(W));
          const dist = Math.hypot(_v.x - hull[0], _v.y - hull[1], _v.z - hull[2]);
          if (dist > hull[3] + 1e-6) miss(acc.balls, () => `Instanz ${i} der Reihe ${row}: gebogener Eckpunkt ${f1(dist)} m vom Mittelpunkt der Hülle, Radius ${f1(hull[3])}`);
          for (let c = 0; c < cams.length; c++) {
            if (visible[c]) continue;
            const P = planes[c];
            let inside = true;
            for (let q = 0; inside && q < 6; q++) inside = P[q][0] * _v.x + P[q][1] * _v.y + P[q][2] * _v.z + P[q][3] >= 0;
            if (!inside) continue;
            visible[c] = 1;
            acc.cams[cams[c][0]].visible++;
            if (row > lasts[c]) miss(acc.seen, () => `${cams[c][0]}: Instanz ${i} der Reihe ${row} ist zu sehen, gezeichnet wird nur bis Reihe ${lasts[c]}`);
          }
        }
      }
    }
  }
}
const newSetAcc = () => ({ rows: tally(), boxes: tally(), balls: tally(), seen: tally(), hooks: tally(), verts: 0, cams: {} });
/** Kameras einer Stelle: die des Spiels am Wagen bei x und ein paar beliebige. */
function camsAt(rnd, x, extra = 3) {
  const list = Object.entries(CAMS).map(([name, make]) => [name, make(x)]);
  for (let i = 0; i < extra; i++) {
    const yaw = rnd() * Math.PI * 2;
    const pitch = (rnd() - 0.5) * 0.9;
    const pos = [x + (rnd() - 0.5) * 60, 0.5 + rnd() * rnd() * 70, (rnd() - 0.5) * 80];
    const look = [pos[0] + Math.sin(yaw) * Math.cos(pitch) * 50, pos[1] + Math.sin(pitch) * 50, pos[2] - Math.cos(yaw) * Math.cos(pitch) * 50];
    list.push(['beliebige Kamera', persp(20 + rnd() * 80, 0.5 + rnd() * 3, 0.3, 300 + rnd() * 2900, pos, look)]);
  }
  // die Sonne steht mit dem Kurs der Straße überall
  const a = rnd() * Math.PI * 2;
  const h = 0.35 + rnd() * 0.5;
  list.push(['Schattenkarte, Sonne beliebig', shadowBox([x + (rnd() - 0.5) * 20, 0, -48 + (rnd() - 0.5) * 60], [Math.cos(a) * Math.sqrt(1 - h * h), h, Math.sin(a) * Math.sqrt(1 - h * h)])]);
  return list;
}
const camText = (acc) => Object.entries(acc.cams).map(([name, s]) => `${name} ${pct(s.drawn, s.total)} (zu sehen ${pct(s.visible, s.total)})`).join(', ');

console.log('PropSet.fill (Bewuchs der XXL-Welt): Reihen entlang der Straße');
{
  const rnd = rng(21);
  // ein Rahmen wie world/xxl/frames.js: Scherung x' = x + a − b · z, darin die Spur (position.z = s)
  const frame = new THREE.Group();
  frame.matrixAutoUpdate = false;
  const track = new THREE.Group();
  frame.add(track);
  const ps = new PropSet(track);
  const place = (a, b, s) => {
    frame.matrix.set(1, 0, -b, a, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    track.position.z = s;
    frame.updateMatrixWorld(true);
  };
  /** Pläne wie planProps: Wald, Baumreihen, Höfe mit Giebel, Dach und Fenstern, Kleinigkeiten; über gut 3 km. */
  const plan = (s0) => {
    const lists = [[], [], []];
    const n = 1500 + Math.floor(rnd() * 2500);
    for (let i = 0; i < n; i++) {
      const L = lists[Math.floor(rnd() * 3)];
      const s = s0 - 300 + rnd() * 3500;
      const x = (rnd() < 0.5 ? -1 : 1) * (8 + rnd() * (rnd() < 0.8 ? 90 : 440));
      const k = 0.6 + rnd() * 1.3;
      const what = rnd();
      if (what < 0.7) addProp(L, [PROP.conifer, PROP.decid, PROP.bush, PROP.fern][Math.floor(rnd() * 4)], x, s, k, k * (0.9 + rnd() * 0.3), k, rnd() * 6.3, 0xffffff - Math.floor(rnd() * 0x202020));
      else if (what < 0.92) {
        const [d, h, w, rh] = [6 + rnd() * 8, 3 + rnd() * 5, 6 + rnd() * 9, 2 + rnd() * 3];
        const rot = rnd() * 6.3;
        addProp(L, PROP.house, x, s, d, h, w, rot, 0xe8dcc8);
        addProp(L, PROP.gable, x, s, d, rh, w, rot, 0xe8dcc8, h);
        addProp(L, PROP.roof, x, s, d, rh, w, rot, 0x9a4a3a, h);
        addProp(L, PROP['win' + Math.floor(rnd() * 4)], x, s, 1, 1, 1, rot, 0xffffff);
      } else addProp(L, [PROP.deer, PROP.hide, PROP.bench][Math.floor(rnd() * 3)], x, s, 1, 1, 1, rnd() * 6.3, 0xffffff);
    }
    return lists;
  };
  const STRIDE = 9;
  const _q = new THREE.Quaternion();
  const _y = new THREE.Vector3(0, 1, 0);
  const _sc = new THREE.Vector3();
  const _col = new THREE.Color();
  const acc = newSetAcc();
  const own = newSetAcc();
  const lost = tally();
  const order = tally();
  let fills = 0;
  let instances = 0;
  for (const [name, make] of Object.entries(BAHNEN)) {
    for (let t = 0; t < (name === 'gerade' ? 1 : 3); t++) {
      const s0 = Math.floor(rnd() * 400000);
      const sRef = Math.round(s0 + rnd() * 1500);
      const lists = plan(s0);
      ps.fill(lists, sRef);
      fills++;
      // nichts verloren, nichts doppelt: je Art dieselben Instanzen (Matrix und Farbe), in jeder Reihe in der
      // Reihenfolge der Pläne
      const want = TYPES.map(() => []);
      for (const L of lists) {
        for (let i = 0; i < L.length; i += STRIDE) {
          _m.compose(_v.set(L[i + 1], L[i + 2], -(L[i + 3] - sRef)), _q.setFromAxisAngle(_y, L[i + 7]), _sc.set(L[i + 4], L[i + 5], L[i + 6]));
          const M = new Float32Array(16);
          _m.toArray(M);
          const C = new Float32Array(3);
          _col.setHex(L[i + 8]).toArray(C);
          want[L[i]].push({ row: Math.floor(L[i + 3] / ROW), key: keyOf(M, C, 0) });
        }
      }
      for (let ty = 0; ty < TYPES.length; ty++) {
        const m = ps.meshes[ty];
        const total = m ? m.userData.rowTotal : 0;
        instances += total;
        if (total !== want[ty].length) {
          miss(lost, () => `${TYPES[ty]}: ${total} statt ${want[ty].length} Instanzen`);
          continue;
        }
        if (!m) continue;
        const row0 = Math.min(...lists.flatMap((L) => L.filter((_, i) => i % STRIDE === 3)).map((s) => Math.floor(s / ROW)));
        // stabil nach Reihen sortiert: so stehen sie im Netz
        const sorted = want[ty].map((w, i) => ({ ...w, i })).sort((p, q) => p.row - q.row || p.i - q.i);
        for (let i = 0; i < total; i++) {
          if (keyOf(m.instanceMatrix.array, m.instanceColor.array, i) !== sorted[i].key) {
            miss(order, () => `${TYPES[ty]} Instanz ${i}: nicht die erwartete (Reihe ${sorted[i].row - row0})`);
            break;
          }
          const row = sorted[i].row - row0;
          if (!(i >= m.userData.rowStart[row] && i < m.userData.rowStart[row + 1])) miss(order, () => `${TYPES[ty]} Instanz ${i}: steht nicht in ihrer Reihe ${row}`);
        }
      }
      // Lagen: der Wagen am Anfang des Bewuchses wie im Spiel (er reicht von 300 m hinter ihm bis gut 3 km voraus) im
      // Rahmen der eigenen Straße, also ohne Scherung; dann im gescherten Rahmen einer anderen Straße am Knotenpunkt;
      // dann mittendrin und mit einer Scherung jenseits des Spiels
      const lagen = [
        [own, 0, 0, s0 + rnd() * 100],
        [acc, (rnd() - 0.5) * 400, (rnd() - 0.5) * 0.7, s0 + rnd() * 100],
        [acc, (rnd() - 0.5) * 60, (rnd() - 0.5) * 2, s0 + rnd() * 2600],
      ];
      for (const [to, a, b, s] of lagen) {
        make(rnd);
        place(a, b, s);
        checkSet(ps.meshes, ps.cull, camsAt(rnd, (rnd() - 0.5) * 12), to, 5, fills);
      }
    }
  }
  for (const key of ['rows', 'boxes', 'balls', 'seen', 'hooks']) {
    acc[key].n += own[key].n;
    acc[key].first.push(...own[key].first);
  }
  acc.verts += own.verts;
  check(lost.n === 0 && order.n === 0, `${fills} Füllungen, ${instances} Instanzen in ${TYPES.length} Arten: jede genau einmal, in ihrer Reihe, in der Reihenfolge der Pläne (${told(lost.n ? lost : order)})`);
  check(acc.rows.n === 0, `Anfänge der Reihen aufsteigend, am Ende alle Instanzen (${told(acc.rows)})`);
  check(acc.boxes.n === 0, `jeder Eckpunkt liegt im Quader seiner Reihe (${told(acc.boxes)})`);
  check(acc.balls.n === 0, `${acc.verts} gebogene Eckpunkte, auch in gescherten Rahmen: jeder in der Hüllkugel seines Quaders (${told(acc.balls)})`);
  check(acc.seen.n === 0, `keine Kamera sieht etwas, das nicht gezeichnet würde (${told(acc.seen)})`);
  check(acc.hooks.n === 0, `die Netze zeichnen über ihre Haken genau bis zur letzten sichtbaren Reihe, danach gelten wieder alle (${told(acc.hooks)})`);
  console.log(`    gezeichnet im Rahmen der eigenen Straße: ${camText(own)}`);
  // ein geleerter Rahmen
  ps.fill([], 0);
  newFrame();
  const m0 = ps.meshes.find((m) => m);
  m0.onBeforeRender(renderer, null, CAMS.Sicht(0));
  check(ps.meshes.every((m) => !m || (m.userData.rowTotal === 0 && m.count === 0)) && ps.cull.n === 0, 'fill([]): leer, kein Netz zeichnet etwas');
  m0.onAfterRender();
}

console.log('Scenery.pack (Rand der Autobahn) auf echten Fahrten, mit den Kameras des Spiels');
{
  const rnd = rng(31);
  // die Szenerie hängt im Rahmen der Autobahn (world/xxl/world.js): auf ihr ohne Scherung, auf der Rampe geschert
  const frame = new THREE.Group();
  frame.matrixAutoUpdate = false;
  const sc = new Scenery(frame);
  const meshes = Object.values(sc.inst).map((d) => d.mesh);
  const acc = newSetAcc();
  const sheared = newSetAcc();
  const lost = tally();
  let spots = 0;
  let instances = 0;
  let stale = 0;
  /** Was in den Netzen liegt, sind genau die besetzten Plätze der gebauten Abschnitte. */
  const sameSet = (s) => {
    for (const [name, def] of Object.entries(sc.inst)) {
      const want = [];
      for (let slot = 0; slot < sc.slots.length; slot++) {
        for (let i = slot * def.cap; i < (slot + 1) * def.cap; i++) {
          const o = i * 16;
          if (def.mat[o] === 0 && def.mat[o + 1] === 0 && def.mat[o + 2] === 0) continue;
          if (sc.slots[slot].k < 0) stale++;
          else want.push(keyOf(def.mat, def.col, i));
        }
      }
      const have = [];
      for (let i = 0; i < def.mesh.userData.rowTotal; i++) have.push(keyOf(def.mesh.instanceMatrix.array, def.mesh.instanceColor.array, i));
      instances += have.length;
      want.sort();
      have.sort();
      if (want.length !== have.length || want.some((k, i) => k !== have[i])) miss(lost, () => `${name} bei s=${f1(s)}: ${have.length} Instanzen im Netz, ${want.length} Plätze besetzt`);
    }
  };
  /** Reihen laufen mit der Strecke (Abschnitte nach k, je SEG / ROW Reihen): Jede Instanz steht mit ihrem Fußpunkt in den ROW Metern ihrer Reihe. */
  const along = tally();
  const ordered = () => {
    const per = Math.round(SEG / ROW);
    const ks = sc.slots.map((sl) => sl.k).filter((k) => k >= 0).sort((p, q) => p - q);
    if (sc.cull.n !== ks.length * per) miss(along, () => `${sc.cull.n} Reihen bei ${ks.length} Abschnitten`);
    for (const def of Object.values(sc.inst)) {
      const st = def.mesh.userData.rowStart;
      for (let row = 0; row < sc.cull.n && row + 1 < st.length; row++) {
        const lo = ks[(row / per) | 0] * SEG + (row % per) * ROW;
        for (let i = st[row]; i < st[row + 1]; i++) {
          const sAt = -def.mesh.instanceMatrix.array[i * 16 + 14];
          if (sAt < lo - 0.01 || sAt > lo + ROW + 0.01) miss(along, () => `Instanz bei s=${f1(sAt)} in der Reihe ab ${lo}`);
        }
      }
    }
  };
  let n = 0;
  for (const [name, target, seed, metres] of FAHRTEN) {
    const trip = new Trip({ rng: rng(seed) });
    trip.setTarget(G.findPlace(target));
    sc.reset();
    drive(trip, metres, 240, (s, x) => {
      n++;
      spots++;
      // auf der Autobahn ohne Scherung; jede dritte Stelle wie von der Rampe aus gesehen
      const shear = n % 3 === 0;
      const [a, b] = shear ? [(rnd() - 0.5) * 300, (rnd() - 0.5) * 0.7] : [0, 0];
      frame.matrix.set(1, 0, -b, a, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      sc.update(s, 1 / 30);
      frame.updateMatrixWorld(true);
      sameSet(s);
      ordered();
      checkSet(meshes, sc.cull, camsAt(rnd, x, 2), shear ? sheared : acc, 4, n);
    });
  }
  check(lost.n === 0, `${spots} Stellen, im Mittel ${Math.round(instances / spots)} Instanzen: in den Netzen liegen genau die besetzten Plätze (${told(lost)})`);
  check(along.n === 0, `die Reihen laufen mit der Strecke, hinten zuerst, jede Instanz in den ${ROW} m ihrer Reihe (${told(along)})`);
  for (const [label, a] of [['auf der Autobahn', acc], ['im gescherten Rahmen', sheared]]) {
    check(a.rows.n === 0 && a.boxes.n === 0, `${label}: Anfänge der Reihen stimmen, jeder Eckpunkt liegt im Quader seiner Reihe (${told(a.rows.n ? a.rows : a.boxes)})`);
    check(a.balls.n === 0, `${label}: ${a.verts} gebogene Eckpunkte, jeder in der Hüllkugel seines Quaders (${told(a.balls)})`);
    check(a.seen.n === 0, `${label}: keine Kamera sieht etwas, das nicht gezeichnet würde (${told(a.seen)})`);
    check(a.hooks.n === 0, `${label}: die Netze zeichnen über ihre Haken genau bis zur letzten sichtbaren Reihe (${told(a.hooks)})`);
    console.log(`    gezeichnet: ${camText(a)}`);
  }
  // Was die Reihen sparen sollen: Rückspiegel, Seitenfenster und Schattenkarte zeichnen nur einen Bruchteil
  const share = (name) => acc.cams[name].drawn / acc.cams[name].total;
  check(share('Sicht') > 0.9, `Sicht nach vorn: fast alles wie bisher (${pct(acc.cams.Sicht.drawn, acc.cams.Sicht.total)})`);
  check(share('Rückspiegel') < 0.2 && share('Seitenfenster') < 0.45 && share('Schattenkarte') < 0.35, `Rückspiegel, Seitenfenster und Schattenkarte zeichnen nur einen Bruchteil: ${['Rückspiegel', 'Seitenfenster', 'Schattenkarte'].map((k) => pct(acc.cams[k].drawn, acc.cams[k].total)).join(', ')} der Instanzen (höchstens 20, 45 und 35 %)`);
  // neue Fahrt: Was von der alten in ungebauten Abschnitten liegen blieb, wird nicht gezeichnet
  sc.reset();
  frame.matrix.identity();
  sc.update(0, 0);
  stale = 0;
  const t = tally();
  for (const def of Object.values(sc.inst)) {
    const st = def.mesh.userData.rowStart;
    for (let i = 0; i < def.mesh.userData.rowTotal; i++) {
      const sAt = -def.mesh.instanceMatrix.array[i * 16 + 14];
      if (sAt > 18 * SEG + 60) miss(t, () => `Instanz bei s=${f1(sAt)}`);
    }
    if (st[st.length - 1] !== def.mesh.userData.rowTotal) miss(t, () => 'rowStart endet nicht bei allen Instanzen');
  }
  sameSet(0);
  check(t.n === 0 && lost.n === 0 && stale > 0, `neue Fahrt ab 0 km: nur die neu gebauten Abschnitte in den Netzen, ${stale} alte Plätze bleiben draußen (${told(t)})`);
}

console.log(fails ? `${fails} FEHLER` : 'alles in Ordnung');
process.exit(fails ? 1 : 0);
