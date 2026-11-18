// Der Verlauf der Straße: Kurven, Kuppen und Senken für jeden Abschnitt der Fahrt.
//
// Die Simulation bleibt eine gerade Straße (s längs, x quer). Hier entsteht für jeden Abschnitt ein fester
// Verlauf in Spielmetern, alle DS Meter abgetastet und je Abschnitt zwischengespeichert: Krümmung kappa (1/m,
// positiv = Linkskurve), Kurs theta (rad, links positiv; 0 = Kartennorden), Höhe y und Steigung. Gezeichnet wird
// die Welt entlang dieses Verlaufs (src/curve.js), das Navi zeigt ihn (preview), der Himmel dreht sich mit dem Kurs.
//
// Woher die Kurven kommen:
// - Autobahn und Landstraße folgen der Karte: Der Verlauf der Kante (src/map/shapes.js) wird auf die Spiellänge
//   gestaucht (theta(s) = theta_Karte(c · s)), geglättet und in einzelne Bögen zerlegt. Jeder Bogen behält Winkel
//   und Platz, bekommt aber einen Halbmesser, der Spaß macht (kleine Knicke werden spürbar, große gedeckelt), und
//   weiche Übergänge wie eine Klothoide. Die Knicke an den Knoten teilen sich die Abschnitte davor und danach.
//   Passt nicht alles hinein, werden erst Schlenker hin und her kleiner (die Fahrtrichtung bleibt), zuletzt alle
//   Bögen (der Rest geht in den nächsten Abschnitt).
// - Kennt die Karte keinen echten Verlauf (matched < 2), kommen entworfene Bögen dazu: lange Bögen, S-Kurven, ab und
//   zu eine enge Kurve mit Tempo-Schild – immer in Gruppen ohne Richtungswirkung, so dass die Karte stimmt.
// - Verbindungsfahrbahnen sind entworfene Rampen nach dem Abbiegewinkel des Kreuzes (nach rechts ein Bogen, nach
//   links die Schleife des Kleeblatts), Ortsdurchfahrten fast gerade, Rampen und Auffahrten gerade (ihr Bogen ist
//   der Knotenpunkt selbst).
// - Ruhezonen: Rund um jeden Knotenpunkt (Ausfahrt, Einfädeln, Ortsein- und -ausgang, Szenenwechsel im Wald) ist
//   die Straße auf ±400 m gerade. Sie hängen nur vom Abschnitt und seinem Vorgänger ab, nie davon, wie es danach
//   weitergeht (das kann sich noch ändern, wenn der Abschnitt längst zu sehen ist). Jeder Abschnitt beginnt und
//   endet gerade und eben: nirgends springt die Krümmung, auch nicht an den Grenzen.
//
// Diese Datei kennt keine Grafik und läuft auch unter Node (tools/course-test.mjs). Die Karte bekommt sie von
// außen (new Course({ planner: new MapPlanner({ graph, shapes }) })): so lädt das klassische Spiel ohne Karte nicht
// die ganzen Kartendaten.

/**
 * Maße der Knotenpunkte aus trip.js (J), hier abgeschrieben, weil trip.js die ganze Karte lädt.
 * tools/course-test.mjs prüft, dass sie gleich bleiben.
 */
export const JX = { hide: 450, show: 1700, ramp: 250, auf: 250, back: 1850, decel: 250, laneEdge: 7.5 };
const J = JX;

/** Abtastung der Abschnitte in Metern. */
export const DS = 5;
/** Ruhezone um Knotenpunkte, Ortsein- und -ausgänge und Szenenwechsel. */
export const CALM = 400;
/** Hinter einer Rampe: die verlassene Autobahn verschwindet J.hide hinter der Gabelung, bis CALM danach gerade. */
const CALM_SWAP = J.hide + CALM - J.ramp;
/** Zubringer zurück zur Autobahn: in ihm erscheint womöglich die nächste Autobahn (J.show vor dem Einfädelpunkt). */
const CALM_SHOW = J.back + J.auf - J.show + CALM;
/** Vor einer Auffahrt: gerade bis CALM vor dem Einfädelpunkt am Ende der Auffahrt. */
const CALM_MERGE = CALM - J.auf;
/** Knoten zweier Landstraßen ohne Ort (kein Rahmenwechsel). */
const CALM_NODE = 150;
/** Am Anfang und Ende jedes Abschnitts läuft die Steigung auf dieser Länge weich gegen 0. */
const FLAT = 300;
/** Kuppen nie enger als dieser Halbmesser (m): ein Auto dahinter ist höchstens rund 2 s verdeckt (siehe Test). */
export const R_CREST = 4200;
/** Wannen nie enger als dieser Halbmesser (m). */
export const R_SAG = 1600;
/** Überhöhung der echten Höhen (die Steigung wird E-mal so groß, dann begrenzt). */
export const EXAGGERATE = 2;
/** Gleichsinnige Bögen mit weniger Gerade dazwischen werden ein Bogen. */
const JOIN = 90;
/** So lang (ohne die Abstände zu den Nachbarn) muss ein gerades Stück eines echten Autobahnverlaufs sein, damit es sanfte Schwünge bekommt. */
const GENTLE = 400;

/**
 * Grenzwerte und Stil je Straßenart. kmax: größte Krümmung · t: Übergangslänge · gmax: größte Steigung ·
 * xref: Bezugslinie (Querlage, an der die gezeichnete Welt längentreu ist: Mitte der Autobahn, Mittellinie
 * der zweispurigen Straßen) · sigma: Glättung des Kartenverlaufs (Spielmeter; grobe Polygone stärker) ·
 * gain: wie stark kleine Bögen verstärkt werden · kmin: so sanft wird kein Bogen der Karte · ksoft: so eng wird ein
 * Bogen eines echten Verlaufs höchstens von selbst · share: höchstens dieser Anteil der freien Strecke ist Bogen,
 * sonst werden die Schlenker kleiner, aber höchstens bis auf floor (siehe tame).
 */
export const KINDS = {
  ab: { kmax: 1 / 420, t: 120, gmax: 0.07, xref: 0, sigma: 180, sigmaCoarse: 170, gain: 1.6, kmin: 1 / 3000, ksoft: 1 / 700, share: 0.65, floor: 0.4, amin: 10 },
  land: { kmax: 1 / 110, t: 45, gmax: 0.1, xref: 7.25, sigma: 50, sigmaCoarse: 100, gain: 2.2, kmin: 1 / 1500, ksoft: 1 / 150, share: 0.7, floor: 0.4 },
  zub: { kmax: 1 / 160, t: 60, gmax: 0.08, xref: 7.25 },
  conn: { kmax: 1 / 180, t: 50, gmax: 0.05, xref: 7.25 },
  stadt: { kmax: 1 / 500, t: 90, gmax: 0.04, xref: 7.25 },
  ramp: { kmax: 0, t: 60, gmax: 0, xref: 7.25 },
  auf: { kmax: 0, t: 60, gmax: 0, xref: 7.25 },
  term: { kmax: 0, t: 60, gmax: 0, xref: 7.25 },
};
/** Kurvenschilder auf der Autobahn unter diesem Halbmesser, Tempo-Schild „100“ bzw. „80“ unter diesen. */
export const SIGN_R = 700;
export const ADVISE_R = { 100: 600, 80: 500 };

const PI = Math.PI;
const TAU = 2 * PI;
const RAD = PI / 180;
const wrap = (a) => a - TAU * Math.floor((a + PI) / TAU);
const sstep = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

// --- Zufall: nur aus festen Kennungen (Kante, Knoten, Ort, Art), nie aus der Reihenfolge des Aufbaus -------------
function hash(a, b = 0, c = 0) {
  let h = Math.imul(a | 0, 0x9e3779b1) ^ Math.imul((b | 0) + 0x7f4a7c15, 0x85ebca77) ^ Math.imul((c | 0) + 0x165667b1, 0xc2b2ae3d);
  h = Math.imul(h ^ (h >>> 16), 0x7feb352d);
  h = Math.imul(h ^ (h >>> 15), 0x846ca68b);
  return (h ^ (h >>> 16)) >>> 0;
}
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const between = (r, a, b) => a + (b - a) * r();

// --- Bausteine -------------------------------------------------------------------------------------------------
// Ein Element {a, b, k, t}: Wert k zwischen a und b mit weichem Ein- und Auslauf der Länge t (smoothstep, also auch
// die Änderung stetig). Für die Krümmung ist es ein Bogen mit Übergängen (Winkel = k · (b − a − t)), für die
// Steigung ein Anstieg oder Gefälle (Höhe = k · (b − a − t)).
function shape(s, e) {
  if (s <= e.a || s >= e.b) return 0;
  const u = s - e.a;
  const v = e.b - s;
  return u < e.t ? sstep(u / e.t) : v < e.t ? sstep(v / e.t) : 1;
}
function paint(out, els) {
  out.fill(0);
  const n = out.length;
  for (const e of els) {
    const i0 = Math.max(0, Math.floor(e.a / DS));
    const i1 = Math.min(n - 1, Math.ceil(e.b / DS));
    for (let i = i0; i <= i1; i++) out[i] += e.k * shape(i * DS, e);
  }
  return out;
}
/** Kumulierte Trapezsumme (Kurs aus Krümmung, Höhe aus Steigung). */
function integrate(src, out) {
  out[0] = 0;
  for (let i = 1; i < src.length; i++) out[i] = out[i - 1] + 0.5 * DS * (src[i - 1] + src[i]);
  return out;
}
/** Länge eines Bogens mit Winkel A (Betrag), Krümmung k und Übergang t. */
export function bendLen(A, k, t) {
  return A >= k * t ? A / k + t : 2 * t;
}
/** Element aus Winkel A (mit Vorzeichen) bei Krümmung k (Betrag) und Übergang t, beginnend bei a. */
export function bendAt(a, A, k, t) {
  const m = Math.abs(A);
  if (m >= k * t) return { a, b: a + m / k + t, k: Math.sign(A) * k, t };
  return { a, b: a + 2 * t, k: A / t, t };
}

/** Platz, den die Bögen bei ihrer engsten Krümmung brauchen, wenn die Plus- und Minus-Seite so skaliert werden. */
function needAt(list, fp, fn) {
  let L = 0;
  for (const it of list) {
    const A = Math.abs(it.A) * (it.A > 0 ? fp : fn);
    if (A > 2e-4) L += bendLen(A, it.kmax, it.t);
  }
  return L;
}

/**
 * Zu viele Bögen für den Platz: zuerst enger (bis kmax), dann Schlenker hin und her kleiner – Plus- und Minus-Seite
 * so, dass die Summe der Winkel (die Fahrtrichtung) bleibt –, zuletzt alle Winkel gleichmäßig.
 */
function fit(list, avail) {
  let sum = 0;
  let smin = 0;
  for (const it of list) {
    it.len = bendLen(Math.abs(it.A), it.kd, it.t);
    it.lmin = bendLen(Math.abs(it.A), it.kmax, it.t);
    sum += it.len;
    smin += it.lmin;
  }
  if (sum <= avail) return list;
  if (smin <= avail) {
    // enger, bis es passt: die fehlende Länge über alle Bögen verteilt einsparen
    const lam = (avail - smin) / (sum - smin);
    for (const it of list) {
      const L = it.lmin + lam * (it.len - it.lmin);
      const m = Math.abs(it.A);
      it.kd = L > 2 * it.t + 1e-6 ? Math.min(it.kmax, m / (L - it.t)) : it.kmax;
      it.len = bendLen(m, it.kd, it.t);
    }
    return list;
  }
  let P = 0;
  let N = 0;
  for (const it of list) if (it.A > 0) P += it.A;
  else N -= it.A;
  const net = P - N;
  const side = (T) => [P > 0 ? (T + net) / (2 * P) : 0, N > 0 ? (T - net) / (2 * N) : 0];
  let lo = Math.abs(net);
  let hi = P + N;
  let fp;
  let fn;
  if (needAt(list, ...side(lo)) <= avail) {
    for (let k = 0; k < 40; k++) {
      const T = (lo + hi) / 2;
      if (needAt(list, ...side(T)) > avail) hi = T;
      else lo = T;
    }
    [fp, fn] = side(lo);
  } else {
    // nicht einmal die reine Fahrtrichtung passt: alles gleichmäßig kleiner
    const [sp, sn] = side(Math.abs(net));
    let f0 = 0;
    let f1 = 1;
    for (let k = 0; k < 40; k++) {
      const f = (f0 + f1) / 2;
      if (needAt(list, sp * f, sn * f) > avail) f1 = f;
      else f0 = f;
    }
    fp = sp * f0;
    fn = sn * f0;
  }
  for (const it of list) {
    it.A *= it.A > 0 ? fp : fn;
    it.kd = it.kmax;
    it.len = bendLen(Math.abs(it.A), it.kmax, it.t);
  }
  return list.filter((it) => Math.abs(it.A) > 2e-4);
}

/**
 * Echte Verläufe drehen, auf die Spiellänge gestaucht, viel zu oft hin und her (auf der Autobahn um 60° je km):
 * Brauchen die Bögen (bei ihrer Wunschkrümmung) mehr als budget Meter, werden die Schlenker kleiner – Plus- und
 * Minus-Seite so, dass ihre Summe (die Fahrtrichtung) bleibt, jede höchstens bis auf floor. Lage und Drehsinn jedes
 * Bogens bleiben, so biegt jedes Stück der Fahrt weiter so ab wie die Karte. fixed: Länge, die schon vergeben ist.
 */
function tame(list, budget, floor, fixed = 0) {
  let P = 0;
  let N = 0;
  for (const it of list) if (it.A > 0) P += it.A;
  else N -= it.A;
  const need = (fp, fn) => list.reduce((L, it) => L + bendLen(Math.abs(it.A) * (it.A > 0 ? fp : fn), it.kd, it.t), fixed);
  if (!P || !N || need(1, 1) <= budget) return;
  const net = P - N;
  const side = (T) => [(T + net) / (2 * P), (T - net) / (2 * N)];
  let lo = Math.max(Math.abs(net), net + 2 * N * floor, 2 * P * floor - net);
  let hi = P + N;
  if (lo >= hi) return;
  for (let k = 0; k < 30; k++) {
    const T = (lo + hi) / 2;
    if (need(...side(T)) > budget) hi = T;
    else lo = T;
  }
  const [fp, fn] = side(lo);
  for (const it of list) it.A *= it.A > 0 ? fp : fn;
}

/**
 * Kleine Schlenker eines echten Verlaufs (unter amin) fährt niemand als Kurve: Ihr Winkel geht an die Nachbarn (die
 * Fahrtrichtung bleibt), und was danach gleichsinnig nah beieinander liegt, wird ein Bogen.
 */
function prune(runs, amin) {
  // ein Schlenker: klein und dicht an einem gegensinnigen Nachbarn (allein stehend ist er ein sanfter Bogen)
  const wiggle = (i) => {
    const q = runs[i];
    if (Math.abs(q.A) >= amin) return false;
    const p = runs[i - 1];
    const n = runs[i + 1];
    return (p && p.A * q.A < 0 && q.s - p.e < 300) || (n && n.A * q.A < 0 && n.s - q.e < 300);
  };
  for (;;) {
    let k = -1;
    for (let i = 0; i < runs.length; i++) if (wiggle(i) && (k < 0 || Math.abs(runs[i].A) < Math.abs(runs[k].A))) k = i;
    if (k < 0 || runs.length < 2) return;
    const q = runs[k];
    const p = runs[k - 1];
    const n = runs[k + 1];
    const wp = p && n ? 0.5 : p ? 1 : 0;
    if (p) p.A += q.A * wp;
    if (n) n.A += q.A * (1 - wp);
    runs.splice(k, 1);
    if (p && n && Math.sign(p.A) === Math.sign(n.A) && n.s - p.e < 300) {
      p.c = (p.c * Math.abs(p.A) + n.c * Math.abs(n.A)) / (Math.abs(p.A) + Math.abs(n.A));
      p.A += n.A;
      p.e = n.e;
      runs.splice(k, 1);
    }
  }
}

/** Zwei gleichsinnige Nachbarn zu einem Bogen (Winkel addiert, Mitte gewichtet). */
function join(p, q) {
  const w = Math.abs(p.A) / (Math.abs(p.A) + Math.abs(q.A));
  const at = p.at === q.at ? p.at : p.at && q.at ? 0 : p.at || q.at;
  const m = { A: p.A + q.A, c: q.c + (p.c - q.c) * w, kd: Math.max(p.kd, q.kd), kmax: Math.min(p.kmax, q.kmax), t: Math.max(p.t, q.t), grp: 0, at };
  m.len = bendLen(Math.abs(m.A), m.kd, m.t);
  return m;
}

/**
 * Bögen in [lo, hi] legen. items: {A (Winkel), c (Wunschmitte), kd (Wunschkrümmung), kmax, t, grp, at}; grp > 0
 * heißt „Spaß-Gruppe ohne Richtungswirkung“ (fällt nur als Ganzes weg), at = −1 / 1: der Bogen beginnt bei lo bzw.
 * endet bei hi (der Knick an einem Knoten bleibt dicht an dessen Ruhezone). Gleichsinnige Nachbarn, die sich ins
 * Gehege kommen, werden ein Bogen (der Winkel bleibt), gegensinnige rücken zur S-Kurve zusammen. Gibt die Elemente
 * zurück.
 */
function layout(items, lo, hi) {
  const avail = hi - lo;
  let list = items.filter((it) => Math.abs(it.A) > 2e-4);
  if (avail <= 0 || !list.length) return [];
  // die Knicke an den Knoten zuerst bzw. zuletzt, dazwischen nach Lage
  list.sort((p, q) => (p.at || 0) - (q.at || 0) || p.c - q.c);
  // passt nicht einmal jeder Bogen als reiner Übergang hinein: ganze Spaß-Gruppen weg, dann der kleinste Bogen in
  // seinen Nachbarn (die Summe der Winkel bleibt). Die Knicke an den Knoten zuletzt: Sie gehören an ihre Ruhezone,
  // ein Knick am Ende darf nicht an den Anfang wandern
  while (list.length && list.reduce((a, it) => a + 2 * it.t, 0) > avail) {
    const g = list.find((it) => it.grp > 0);
    if (g) {
      list = list.filter((it) => it.grp !== g.grp);
      continue;
    }
    if (list.length === 1) return [];
    const free = list.some((it) => !it.at);
    let i = -1;
    for (let k = 0; k < list.length; k++) if (!(free && list[k].at) && (i < 0 || Math.abs(list[k].A) < Math.abs(list[i].A))) i = k;
    const nb = i === 0 ? 1 : i === list.length - 1 ? i - 1 : list[i + 1].c - list[i].c < list[i].c - list[i - 1].c ? i + 1 : i - 1;
    list[nb] = join(list[nb], list[i]);
    list.splice(i, 1);
  }
  for (let pass = 0; pass < 8; pass++) {
    for (const it of list) it.len = bendLen(Math.abs(it.A), it.kd, it.t);
    for (let i = 0; i + 1 < list.length; i++) {
      const p = list[i];
      const q = list[i + 1];
      if (Math.sign(p.A) !== Math.sign(q.A) || q.c - q.len / 2 - (p.c + p.len / 2) > JOIN) continue;
      list.splice(i, 2, join(p, q));
      i = Math.max(-1, i - 2);
    }
    list = fit(list, avail);
    if (!list.length) return [];
    // Lage: so nah an der Wunschmitte wie möglich, ohne Überlappung, innerhalb [lo, hi]
    const st = list.map((it) => (it.at < 0 ? lo : it.at > 0 ? hi - it.len : it.c - it.len / 2));
    for (let i = 0; i < list.length; i++) st[i] = Math.max(st[i], i ? st[i - 1] + list[i - 1].len : lo);
    for (let i = list.length - 1; i >= 0; i--) st[i] = Math.min(st[i], i + 1 < list.length ? st[i + 1] - list[i].len : hi - list[i].len);
    for (let i = 0; i < list.length; i++) st[i] = Math.max(st[i], i ? st[i - 1] + list[i - 1].len : lo);
    let touch = false;
    for (let i = 0; i < list.length; i++) list[i].c = st[i] + list[i].len / 2;
    for (let i = 0; i + 1 < list.length; i++) {
      if (Math.sign(list[i].A) === Math.sign(list[i + 1].A) && st[i + 1] - (st[i] + list[i].len) < JOIN) touch = true;
    }
    if (!touch || pass === 7) return list.map((it, i) => bendAt(st[i], it.A, it.kd, it.t));
  }
  return [];
}

/**
 * Wie layout, aber Haufen von Bögen, die einander nicht ins Gehege kommen, für sich: Jeder bekommt den Platz bis zur
 * Mitte der Lücken zu seinen Nachbarn. So macht ein enges Stück nicht alle Schwünge des Abschnitts kleiner. Reicht
 * einem Haufen sein Platz nicht für seinen Winkel, gilt layout über den ganzen Abschnitt.
 */
function layoutLocal(items, lo, hi) {
  const list = items.filter((it) => Math.abs(it.A) > 2e-4).sort((p, q) => (p.at || 0) - (q.at || 0) || p.c - q.c);
  const heaps = [];
  for (const it of list) {
    const l = bendLen(Math.abs(it.A), it.kd, it.t);
    const a = it.at < 0 ? lo : it.at > 0 ? hi - l : it.c - l / 2;
    const h = heaps[heaps.length - 1];
    if (h && (a < h.b + JOIN || (it.grp && h.grps.has(it.grp)))) {
      h.items.push(it);
      h.b = Math.max(h.b, a + l);
    } else heaps.push({ items: [it], a, b: a + l, grps: new Set() });
    if (it.grp) heaps[heaps.length - 1].grps.add(it.grp);
  }
  if (heaps.length < 2) return layout(items, lo, hi);
  const out = [];
  for (let k = 0; k < heaps.length; k++) {
    const h = heaps[k];
    const a = k ? Math.max(lo, (heaps[k - 1].b + h.a) / 2) : lo;
    const b = k + 1 < heaps.length ? Math.min(hi, (h.b + heaps[k + 1].a) / 2) : hi;
    const want = h.items.reduce((v, it) => v + it.A, 0);
    const els = b > a ? layout(h.items.map((it) => ({ ...it })), a, b) : [];
    const got = els.reduce((v, e) => v + e.k * (e.b - e.a - e.t), 0);
    if (Math.abs(got - want) > 1e-4) return layout(items, lo, hi);
    out.push(...els);
  }
  return out;
}

// --- Kartenverlauf -----------------------------------------------------------------------------------------------
/** Gauß-Glättung mit konstant fortgesetzten Enden (der Gesamtwinkel bleibt erhalten). sigma in Abtastschritten. */
function gauss(src, sigma) {
  const n = src.length;
  const out = new Float64Array(n);
  const r = Math.max(1, Math.ceil(sigma * 3));
  const w = new Float64Array(r + 1);
  let ws = 0;
  for (let k = 0; k <= r; k++) {
    w[k] = Math.exp(-(k * k) / (2 * sigma * sigma));
    ws += k ? 2 * w[k] : w[k];
  }
  // die Enden konstant fortgesetzt in einen Puffer, so braucht die innere Schleife keine Grenzen (gleiche Summen)
  const pad = new Float64Array(n + 2 * r);
  pad.fill(src[0], 0, r);
  pad.set(src, r);
  pad.fill(src[n - 1], r + n);
  for (let i = 0; i < n; i++) {
    const c = i + r;
    let a = pad[c] * w[0];
    for (let k = 1; k <= r; k++) a += (pad[c - k] + pad[c + k]) * w[k];
    out[i] = a / ws;
  }
  return out;
}

/** Wie hügelig ist es hier? 0,12 flaches Land im Norden … 1 Alpen (für die Hügel ohne echte Höhen). */
export function relief(lat, lon, cc) {
  if (cc === 'CH' || cc === 'AT' || cc === 'NO' || cc === 'LI') return 1;
  if (cc === 'NL' || cc === 'DK' || cc === 'BE') return 0.12;
  if (cc === 'DE') {
    if (lat < 47.9 && lon > 9.6 && lon < 13.2) return 0.95; // Alpenrand
    if (lat > 52.6) return 0.12; // norddeutsches Tiefland
    if (lat > 52.0) return 0.3;
    if (lat > 49.4) return 0.55; // Mittelgebirge
    return 0.7;
  }
  if (lat > 55) return 0.35;
  return 0.5;
}

// --- Spaß-Entwürfe: immer Gruppen ohne Richtungswirkung -----------------------------------------------------------
// Eine Gruppe ist eine Folge von Bögen {A (Winkel mit Vorzeichen), R, g (Gerade davor)}, deren Winkel sich zu null
// addieren: Sie ändert die Fahrtrichtung nicht, die Karte bleibt wahr.
let grpId = 1;
const groupLen = (bends, t) => bends.reduce((L, q) => L + q.g + bendLen(Math.abs(q.A), 1 / q.R, t), 0);
/** Gruppe auf den Platz room stauchen (kleinere Winkel, gleiche Halbmesser); null, wenn sie zu klein würde. */
function squeeze(bends, room, t, minDeg) {
  let f = 1;
  for (let k = 0; k < 24 && groupLen(bends.map((q) => ({ ...q, A: q.A * f })), t) > room; k++) f *= 0.9;
  if (Math.abs(bends[0].A * f) < minDeg * RAD) return null;
  return bends.map((q) => ({ ...q, A: q.A * f }));
}
/**
 * Autobahn-Gruppe für höchstens room Meter: lange Bögen, S-Kurven, ab und zu eine enge Kurve mit Tempo-Schild und
 * langem Gegenbogen. odd: 1 = Anfang und Ende drehen gleich (drei Bögen), 0 = gegensinnig, −1 = egal.
 * st.since zählt die Meter seit dem letzten Erlebnis.
 */
function groupAb(r, room, odd, st, t) {
  const sg = r() < 0.5 ? -1 : 1;
  const p = st.gentle ? 1 : r();
  // sanfte Schwünge (st.gentle) mit einer echten Geraden dazwischen: ein Zug der Straße, kein S
  const gap = (a, b) => (st.gentle ? between(r, 260, 420) : between(r, a, b));
  let g = null;
  if (odd === 1 && p >= 0.3) {
    // Anfang und Ende gleichsinnig, ruhig: drei weite Bögen mit Geraden dazwischen
    const A = (st.gentle ? between(r, 3, 6) : between(r, 5, 10)) * RAD * sg;
    const R = between(r, 1200, 2400);
    g = [{ A, R, g: 0 }, { A: -2 * A, R, g: gap(150, 350) }, { A, R, g: gap(150, 350) }];
  } else if (odd === 1 || (odd < 0 && p > 0.62 && p < 0.7)) {
    // Schlangenlinie: links, doppelt rechts, links
    const A = between(r, 6, 11) * RAD * sg;
    const R = between(r, 900, 1500);
    g = [{ A, R, g: 0 }, { A: -2 * A, R, g: between(r, 0, 80) }, { A, R, g: between(r, 0, 80) }];
  } else if ((p < 0.12 || st.since > 4200) && room > 1100) {
    // enge Kurve mit Tempo-Schild, danach ein langer Gegenbogen
    const A = between(r, 24, 40) * RAD * sg;
    g = [{ A, R: between(r, 425, 560), g: 0 }, { A: -A, R: between(r, 1300, 2400), g: between(r, 120, 380) }];
    st.since = 0;
  } else if (p < 0.32) {
    // S-Kurve
    const A = between(r, 10, 20) * RAD * sg;
    const R = between(r, 700, 1200);
    g = [{ A, R, g: 0 }, { A: -A, R: R * between(r, 0.85, 1.15), g: 0 }];
  } else {
    // zwei lange, gegensinnige Bögen mit einer Geraden dazwischen (st.gentle: nur sanfte, wo die Karte gerade ist)
    const A = (st.gentle ? between(r, 4, 8) : between(r, 8, 20)) * RAD * sg;
    const R = st.gentle ? between(r, 1800, 3200) : between(r, 1100, 2800);
    g = [{ A, R, g: 0 }, { A: -A, R: R * between(r, 0.8, 1.25), g: gap(150, 380) }];
  }
  return squeeze(g, room, t, 3);
}
/** Lebhafte Landstraße oder Zubringer für höchstens room Meter, Halbmesser ab rmin (odd wie bei groupAb). */
function groupLand(r, room, odd, t, rmin, rmax) {
  const sg = r() < 0.5 ? -1 : 1;
  const p = r();
  let g;
  if (odd === 1 || (odd < 0 && p >= 0.65)) {
    // Schwünge: links, doppelt rechts, links
    const A = between(r, 12, 26) * RAD * sg;
    const R = between(r, rmin * 1.5, rmax);
    g = [{ A, R, g: 0 }, { A: -2 * A, R, g: between(r, 0, 40) }, { A, R, g: between(r, 0, 40) }];
  } else if (p < 0.4) {
    // S-Kurve
    const A = between(r, 18, 45) * RAD * sg;
    const R = between(r, rmin * 1.3, rmax);
    g = [{ A, R, g: 0 }, { A: -A, R: R * between(r, 0.8, 1.25), g: 0 }];
  } else {
    // enge Kurve, kurze Gerade, Gegenbogen
    const A = between(r, 40, 75) * RAD * sg;
    g = [{ A, R: between(r, rmin, rmin * 1.6), g: 0 }, { A: -A, R: between(r, rmin * 1.8, rmax * 1.3), g: between(r, 40, 200) }];
  }
  return squeeze(g, room, t, 8);
}
/**
 * Spaß-Gruppen in die Lücke [a, b]. sa, sb: Drehsinn der Nachbarn am Anfang und Ende der Lücke (Knick am Knoten
 * oder Kartenbogen; 0 = keiner). Jede Gruppe beginnt im Drehsinn, in dem ihr Vorgänger endet: Ein Fenster um einen
 * Kartenbogen sieht so nie eine Gegenkurve, die stärker ist als er, und zwischen zwei Gruppen entsteht keine
 * zufällige S-Kurve. o: {kind, kmax, t, rmin, rmax, gap: [min, max], st}.
 */
function funFill(r, a, b, sa, sb, out, o) {
  const make = (room, odd) => (o.kind === 'ab' ? groupAb(r, room, odd, o.st, o.t) : groupLand(r, room, odd, o.t, o.rmin, o.rmax));
  const list = [];
  let s = a + between(r, 0, o.gap[0]);
  for (;;) {
    const g = make(b - s, -1);
    if (!g) break;
    const L = groupLen(g, o.t);
    list.push({ s, g, L });
    s += L + between(r, o.gap[0], o.gap[1]);
    if (o.st) o.st.since += L;
  }
  if (!list.length) return;
  const flip = (g) => g.forEach((q) => (q.A = -q.A));
  let prev = sa;
  for (const it of list) {
    if (prev && Math.sign(it.g[0].A) !== prev) flip(it.g);
    prev = Math.sign(it.g[it.g.length - 1].A);
  }
  if (sb && prev !== sb) {
    // die letzte Gruppe soll mit sb enden: eine mit passender Zahl von Bögen
    const last = list[list.length - 1];
    const s0 = Math.sign(last.g[0].A);
    const g = make(b - last.s, s0 === sb ? 1 : 0);
    if (g) {
      if (Math.sign(g[0].A) !== s0) flip(g);
      last.g = g;
    } else list.pop();
  }
  for (const { s: s0, g } of list) {
    const grp = grpId++;
    let x = s0;
    for (const q of g) {
      const l = bendLen(Math.abs(q.A), 1 / q.R, o.t);
      x += q.g;
      out.push({ A: q.A, c: x + l / 2, kd: Math.min(1 / q.R, o.kmax), kmax: o.kmax, t: o.t, grp });
      x += l;
    }
  }
}
/**
 * Hügel und Senken (Steigungs-Elemente) in [a, b] für das Relief f (0…1), höchstens gmax. Die Übergänge sind so
 * lang, dass keine Kuppe enger als rc wird.
 */
function hills(r, a, b, f, gmax, out, rc = R_CREST) {
  let s = a + between(r, 0, 500) * (1.3 - f);
  while (s < b) {
    // die meisten Wellen sanft, gut jede dritte merklich (Kuppe oder Senke mit mehr als 2 % Steigung)
    const g = Math.min(gmax * 0.9, (0.012 + 0.05 * f) * (r() < 0.4 ? between(r, 0.7, 1) : between(r, 0.3, 0.5)));
    const t = Math.max(140, 1.5 * g * rc);
    const hold = between(r, 0, 250 + 1150 * f);
    const le = hold + 2 * t;
    const sg = r() < 0.55 ? 1 : -1; // Kuppe (erst hoch) oder Senke (erst runter)
    if (s + 2 * le > b) {
      // zum Schluss eine kleinere Welle, wenn noch Platz ist
      const g2 = Math.min(g, (b - s) / 6 / rc);
      const t2 = Math.max(140, 1.5 * g2 * rc);
      if (4 * t2 <= b - s && g2 > 0.006) out.push({ a: s, b: s + 2 * t2, k: sg * g2, t: t2 }, { a: s + 2 * t2, b: s + 4 * t2, k: -sg * g2, t: t2 });
      break;
    }
    out.push({ a: s, b: s + le, k: sg * g, t }, { a: s + le, b: s + 2 * le, k: -sg * g, t });
    s += 2 * le + between(r, 150, 1800) * (1.25 - 0.7 * f);
  }
}
/** Hügel in Gegenrichtung derselben Straße: gespiegelt (Lage L − s, Vorzeichen umgekehrt). */
function mirrorEls(els, L) {
  for (const e of els) {
    const a = L - e.b;
    e.b = L - e.a;
    e.a = a;
    e.k = -e.k;
  }
}

// --- Profil eines Abschnitts --------------------------------------------------------------------------------------
class Profile {
  constructor(kind, len) {
    this.kind = kind;
    this.len = len;
    this.n = Math.round(len / DS) + 1;
    this.kappa = new Float32Array(this.n);
    this.theta = new Float32Array(this.n); // relativ zum Anfang
    this.grade = new Float32Array(this.n);
    this.y = new Float32Array(this.n); // relativ zum Anfang
    this.th0 = 0; // Kurs am Anfang (Kartenrahmen, fortlaufend über die Abschnitte)
    this.y0 = 0; // Höhe am Anfang (fortlaufend)
    this.xref = KINDS[kind].xref;
    this.bends = []; // {a, b, k, t}: die Bögen (für Schilder, Verkehr und Statistik)
    this.target = 0; // gewünschter Kurs am Ende
    this.mapTurn = 0; // Winkel der Karte im Abschnitt (ohne die Knicke an den Knoten)
    this.matched = -1; // Güte des Kartenverlaufs (−1: Abschnitt ohne Kante)
    this.calm = [0, 0];
    this.guess = null; // {h}: geplant mit einer Vorhersage der Fortsetzung (MapPlanner.nextHead)
  }
  get th1() {
    return this.th0 + this.theta[this.n - 1];
  }
  get y1() {
    return this.y0 + this.y[this.n - 1];
  }
}

/** Wert eines Profil-Arrays bei u Metern (linear, an den Enden gehalten). */
function sample(arr, u) {
  const n = arr.length;
  const x = u / DS;
  if (x <= 0) return arr[0];
  if (x >= n - 1) return arr[n - 1];
  const i = Math.floor(x);
  return arr[i] + (arr[i + 1] - arr[i]) * (x - i);
}
/**
 * Integral (Kurs aus Krümmung, Höhe aus Steigung) bei u Metern, genau passend zur linear interpolierten Ableitung:
 * innerhalb einer Zelle quadratisch statt linear. So stimmen Kurs und Krümmung an jeder Stelle zusammen, egal wo
 * die Tabelle des Shaders gerade abtastet (sonst zittert die Welt in Übergangsbögen um einige Zentimeter).
 */
function sampleInt(F, f, u) {
  const n = F.length;
  const x = u / DS;
  if (x <= 0) return F[0];
  if (x >= n - 1) return F[n - 1];
  let i = Math.floor(x);
  if (i > n - 2) i = n - 2;
  const tau = u - i * DS;
  return F[i] + tau * (f[i] + ((f[i + 1] - f[i]) * tau) / (2 * DS));
}

// Maße der Shader-Tabelle (müssen zu src/curve.js passen; fill prüft sie)
const T_N = 512;
const T_D0 = -400;
const T_DS = 7.5;
const T_END = T_D0 + T_DS * (T_N - 1);
/** Änderungen des Wegs weiter voraus als das liegen im Dunst: sie gelten sofort, näher wird übergeblendet. */
const BLEND_NEAR = 1500;
const BLEND_TIME = 1.2;
/** Schneller als so (m/s) bewegt die Überblendung nichts bis 600 m voraus und 60 m neben der Straße: Große Änderungen (echte Höhen) blenden länger, bis 3 s. */
const BLEND_RATE = 0.3;
const BLEND_J = Math.round((600 - T_D0) / T_DS);
const SEGS = 24;

const seg = () => ({ prof: null, sec: null, path: null, s0: 0, s1: 0 });

export class Course {
  /**
   * @param {{planner?: MapPlanner, seed?: number}} opts planner: Entwurf aus der Karte für die Abschnitte einer
   * XXL-Fahrt (new MapPlanner({ graph, shapes })); ohne ihn gibt es nur den klassischen Endlos-Kurs und die Kurvenprobe
   */
  constructor({ planner = null, seed = 7 } = {}) {
    this.planner = planner;
    this.seed = seed;
    this.cache = new WeakMap();
    this.mode = 'classic'; // ohne Trip: 'classic' (endlos, entworfen) oder 'probe' (die feste Kurvenprobe)
    this.virt = { classic: this.stream('classic'), probe: this.stream('probe') };
    // Zustand nach fill(): am Spieler Krümmung, Steigung, Kurs psi im Kartenrahmen; Lage im Kartenrahmen (Wolken)
    this.state = { kappa: 0, grade: 0, psi: 0, y: 0, xref: 0, mapX: 0, mapZ: 0, s: 0 };
    // zählt hoch, wenn sich die Auswahl der Abschnitte ändert (für Schilder und Verkehr: neu nachsehen)
    this.version = 0;
    // Arbeitsspeicher (keine Allokation pro Bild)
    this.tK = new Float64Array(T_N);
    this.tTh = new Float64Array(T_N);
    this.tY = new Float64Array(T_N);
    this.tG = new Float64Array(T_N);
    this.tX = new Float64Array(T_N);
    this.tQx = new Float64Array(T_N);
    this.tQz = new Float64Array(T_N);
    this.segs = Array.from({ length: SEGS }, seg); // Auswahl dieses Bilds
    this.nSegs = 0;
    this.prev = Array.from({ length: SEGS }, seg); // Auswahl des letzten Bilds
    this.nPrev = 0;
    this.old = Array.from({ length: SEGS }, seg); // eingefrorene Auswahl während einer Überblendung
    this.nOld = 0;
    this.pvSegs = Array.from({ length: SEGS }, seg); // preview() ohne passendes fill()
    this.back = Array.from({ length: 6 }, seg); // Abschnitte hinter dem Spieler (rückwärts gesammelt)
    this.blend = 1;
    this.blendT = BLEND_TIME;
    this.lastS = NaN;
    this.lastTrip = undefined;
    this.tripVer = -1;
    this.tripPol = undefined;
    this.o1 = { k: 0, g: 0, th: 0, y: 0, xr: 0, s0: 0, ds: 0 };
    this.o2 = { k: 0, g: 0, th: 0, y: 0, xr: 0, s0: 0, ds: 0 };
    this.atOut = { kappa: 0, theta: 0, y: 0, grade: 0 };
    this.pv = { n: 0, x: new Float32Array(401), z: new Float32Array(401), psi: 0 };
    this.hq = { x: 0, z: 0, th: 0 };
    this.stats = { builds: 0, buildMs: 0, maxBuildMs: 0 };
  }

  // --- Virtuelle Wege: klassischer Endlos-Kurs und Kurvenprobe -----------------------------------------------
  stream(kind) {
    return { kind, sections: [], s1: -1000, n: 0 };
  }

  /** Virtuellen Weg bis upTo verlängern (Abschnitt k hängt nur von k und seinem Vorgänger ab). */
  extendVirtual(v, upTo) {
    let guard = 0;
    while (v.s1 < upTo && guard++ < 2000) {
      const k = v.n++;
      let sec;
      if (v.kind === 'probe' && k < PROBE.length) {
        const P = PROBE[k];
        sec = { kind: P.kind, len: P.len, s0: v.s1, s1: v.s1 + P.len, de: -1, probe: P, vid: k };
      } else {
        const r = rng(hash(this.seed, k, v.kind === 'probe' ? 77 : 11));
        const len = Math.round(between(r, 2400, 4600) / 10) * 10;
        sec = { kind: 'ab', len, s0: v.s1, s1: v.s1 + len, de: -1, classic: true, vid: k };
      }
      v.sections.push(sec);
      v.s1 = sec.s1;
      // gleich entwerfen: so ist die Kette der Kurse lückenlos, auch nach einem Teleport
      this.profile(sec, v, null);
    }
    while (v.sections.length > 12 && v.sections[2].s1 < upTo - 12000) v.sections.shift();
  }

  /** Klassischen Kurs oder Kurvenprobe von vorn (für einen Teleport oder einen neuen Lauf). */
  resetVirtual(mode = this.mode) {
    this.virt[mode] = this.stream(mode);
    this.lastS = NaN;
  }

  // --- Profile ---------------------------------------------------------------------------------------------------
  /** Profil eines Abschnitts (path: der Weg, auf dem er liegt; trip: für die Vorausschau an offenen Knoten). */
  profile(sec, path = null, trip = null) {
    let p = this.cache.get(sec);
    if (p) return p;
    const pv = this.prevOf(sec, path, trip);
    const pp = pv ? this.cache.get(pv.sec) || this.profile(pv.sec, pv.path, trip) : null;
    const t0 = now();
    p = this.design(sec, path, trip, pp, pv ? pv.sec : null);
    const ms = now() - t0;
    this.stats.buildMs += ms;
    this.stats.maxBuildMs = Math.max(this.stats.maxBuildMs, ms);
    this.stats.builds++;
    this.cache.set(sec, p);
    return p;
  }

  /** Vorgänger auf dem Weg (am Anfang eines Zweigs: der Autobahnabschnitt seiner Gabelung). */
  prevOf(sec, path, trip) {
    if (!path) return null;
    const L = path.sections;
    const i = L.indexOf(sec);
    if (i > 0) return { sec: L[i - 1], path };
    if (i === 0 && path.fork && path.fork.sec) return { sec: path.fork.sec, path: this.pathOf(path.fork.sec, trip) };
    return null;
  }

  pathOf(sec, trip) {
    if (!trip) return null;
    if (trip.cur.sections.includes(sec)) return trip.cur;
    for (const g of trip.ghosts) if (g.path.sections.includes(sec)) return g.path;
    return null;
  }

  /** Den Abschnitt entwerfen: Bögen und Hügel planen, legen, abtasten. */
  design(sec, path, trip, pp, prev) {
    const kind = KINDS[sec.kind] ? sec.kind : 'ab';
    const spec = KINDS[kind];
    const L = sec.len;
    const P = new Profile(kind, L);
    const pl = this.planner;
    P.th0 = pp ? pp.th1 : pl ? pl.startHeading(sec, path) : 0;
    P.y0 = pp ? pp.y1 : 0;
    const gel = [];
    let plan = null;
    if (sec.probe) {
      for (const e of sec.probe.k) P.bends.push({ ...e });
      for (const e of sec.probe.g) gel.push({ ...e });
    } else if (sec.classic) {
      // klassischer Endlos-Kurs: entworfen; der Kurs pendelt um die Ausgangsrichtung (die Sonne bleibt vertraut)
      const r = rng(hash(this.seed, sec.vid, 5));
      const lo = 120;
      const hi = L - 120;
      const net = clamp(-0.4 * wrap(P.th0) + between(r, -0.2, 0.2), -0.5, 0.5);
      const items = [];
      if (Math.abs(net) > 0.01) items.push({ A: net, c: between(r, lo + 600, hi - 600), kd: Math.min(spec.kmax, 1 / between(r, 900, 2200)), kmax: spec.kmax, t: spec.t, grp: 0 });
      funFill(r, lo, hi, 0, 0, items, { kind: 'ab', kmax: spec.kmax, t: spec.t, gap: [250, 1300], st: { since: 1200 + r() * 2400 } });
      hills(r, FLAT, L - FLAT, 0.3 + 0.35 * (0.5 + 0.5 * Math.sin(sec.vid * 0.9 + 1)), spec.gmax, gel);
      plan = { items, net, lo, hi, grade: null };
    } else if (pl) plan = pl.plan(sec, path, trip, P, prev, gel);
    if (plan) {
      const { items, lo, hi } = plan;
      // Sicherheitsnetz: die Summe der geplanten Bögen ist der gewünschte Winkel
      const diff = plan.net - items.reduce((a, it) => a + it.A, 0);
      if (Math.abs(diff) > 1e-4 && spec.kmax > 0) {
        let best = null;
        for (const it of items) if (!it.grp && Math.sign(it.A) === Math.sign(diff) && (!best || Math.abs(it.A) > Math.abs(best.A))) best = it;
        if (best) best.A += diff;
        else items.push({ A: diff, c: (lo + hi) / 2, kd: Math.min(spec.kmax, 1 / 1500), kmax: spec.kmax, t: spec.t, grp: 0 });
      }
      P.bends = spec.kmax > 0 && hi > lo ? layoutLocal(items, lo, hi) : [];
      P.calm = [lo, L - hi];
      P.target = P.th0 + plan.net;
    }
    paint(P.kappa, P.bends);
    integrate(P.kappa, P.theta);
    if (!plan) P.target = P.th1;
    if (plan && plan.grade) P.grade.set(plan.grade);
    else paint(P.grade, gel);
    integrate(P.grade, P.y);
    return P;
  }

  // --- Auskunft ---------------------------------------------------------------------------------------------------
  /**
   * Verlauf an der Stelle sLocal (Meter ab Abschnittsanfang): kappa, theta (Kurs im Kartenrahmen, links positiv),
   * y (Höhe, fortlaufend über die Abschnitte), grade (Steigung). Ohne Allokation (out wird wiederverwendet).
   */
  at(sec, sLocal, out = this.atOut, path = null, trip = null) {
    const p = this.profile(sec, path, trip);
    const u = clamp(sLocal, 0, p.len);
    out.kappa = sample(p.kappa, u);
    out.theta = p.th0 + sampleInt(p.theta, p.kappa, u);
    out.y = p.y0 + sampleInt(p.y, p.grade, u);
    out.grade = sample(p.grade, u);
    return out;
  }

  // --- Weg für die Tabelle ------------------------------------------------------------------------------------
  /** Nimmt der Weg an dieser Gabelung den Zweig? Geplant laut Navi, kurz davor nach der Spur des Spielers. */
  takesBranch(trip, f, s) {
    if (!f.branch || !f.branch.sections.length) return false;
    if (f.forced) return true;
    const d = f.s - s;
    if (d < J.decel && trip.x > J.laneEdge) return true;
    if (d < J.decel * 0.6 && trip.x < J.laneEdge - 2.5) return false;
    return trip.planFor(f) === 'exit';
  }

  /** Gilt der Trip als klassischer Endlos-Modus (eine einzige Autobahn ohne Kante)? */
  isEndless(trip) {
    return !trip || (trip.endless && trip.cur.sections.length === 1 && !(trip.cur.sections[0].de >= 0));
  }

  /** Einen Abschnitt in die Auswahl übernehmen. */
  put(out, n, sec, path, trip) {
    const g = out[n];
    g.sec = sec;
    g.path = path;
    g.prof = this.profile(sec, path, trip);
    g.s0 = sec.s0;
    g.s1 = sec.s1;
  }

  /**
   * Hat sich am Trip etwas geändert (neue Abschnitte, neues Ziel), werden Entwürfe, die mit einer Vorhersage der
   * Fortsetzung gemacht wurden, neu angesehen. Stimmt die Vorhersage nicht mehr und hat der Spieler die Bögen des
   * Abschnitts noch nicht erreicht, wird er neu entworfen, mit allem, was auf ihm aufbaut (fill blendet über).
   */
  refresh(trip, s) {
    if (trip.version === this.tripVer && trip.policy === this.tripPol) return;
    this.tripVer = trip.version;
    this.tripPol = trip.policy;
    const pl = this.planner;
    if (!pl) return;
    for (const { path } of trip.paths()) {
      const L = path.sections;
      for (let i = 0; i < L.length; i++) {
        const p = this.cache.get(L[i]);
        if (!p || !p.guess || s >= L[i].s0 + p.calm[0]) continue;
        const h = pl.nextHead(L[i], trip, path);
        const g = p.guess.h;
        if (h === g || (h !== null && g !== null && Math.abs(wrap(h - g)) < 1e-6)) continue;
        this.forget(path, i);
        break;
      }
    }
  }

  /** Entwürfe ab Abschnitt i eines Wegs verwerfen, samt den Zweigen, die dort abgehen. */
  forget(path, i) {
    const L = path.sections;
    for (let k = i; k < L.length; k++) {
      this.cache.delete(L[k]);
      const f = L[k].fork;
      if (f && f.branch) this.forget(f.branch, 0);
    }
  }

  /** Abschnitte des Wegs von s − 400 bis s + 3432 in die Liste out (ohne Allokation). Gibt ihre Zahl zurück. */
  collect(trip, s, out) {
    let path;
    if (this.isEndless(trip)) {
      path = this.virt[this.mode];
      this.extendVirtual(path, s + T_END + 200);
      trip = null;
    } else {
      path = trip.cur;
      this.refresh(trip, s);
    }
    const L = path.sections;
    let i = L.length - 1;
    while (i > 0 && s < L[i].s0) i--;
    // zurück bis s − 400 (am Anfang eines Zweigs weiter auf der Autobahn seiner Gabelung)
    const back = this.back;
    let bp = path;
    let bi = i;
    let first = L[i];
    let nb = 0;
    while (first && first.s0 > s + T_D0 && nb < back.length) {
      let bs = null;
      if (bi > 0) bs = bp.sections[--bi];
      else if (bp.fork && bp.fork.sec) {
        bs = bp.fork.sec;
        bp = this.pathOf(bs, trip);
        bi = bp ? bp.sections.indexOf(bs) : 0;
      }
      if (!bs) break;
      back[nb].sec = bs;
      back[nb++].path = bp;
      first = bs;
      if (!bp) break;
    }
    let n = 0;
    for (let k = nb - 1; k >= 0; k--) this.put(out, n++, back[k].sec, back[k].path, trip);
    // voraus, an Gabelungen auf den geplanten Zweig
    let cp = path;
    let ci = i;
    let cs = L[i];
    while (cs && n < out.length) {
      this.put(out, n++, cs, cp, trip);
      if (cs.s1 >= s + T_END) break;
      const f = cs.fork;
      if (f && !f.taken && trip && this.takesBranch(trip, f, s)) {
        cp = f.branch;
        ci = 0;
      } else ci++;
      cs = cp.sections[ci];
    }
    return n;
  }

  /**
   * Verlauf an der Weg-Stelle o.s0 + i · o.ds aus einer Abschnittsliste; über die Enden hinaus gerade und eben
   * fortgesetzt. Die Stelle kommt über o und eine ganze Zahl: Eine Kommazahl als Argument müsste die Engine bei jedem
   * der gut 500 Aufrufe je Bild in ein eigenes Objekt packen.
   */
  walk(segs, n, i, o) {
    const s = o.s0 + i * o.ds;
    let g = segs[0];
    for (let k = n - 1; k > 0; k--) {
      if (s >= segs[k].s0) {
        g = segs[k];
        break;
      }
    }
    const p = g.prof;
    const u = s - g.s0;
    o.xr = p.xref;
    if (u <= 0) {
      o.k = 0;
      o.g = 0;
      o.th = p.th0;
      o.y = p.y0;
      return;
    }
    if (u >= p.len) {
      o.k = 0;
      o.g = 0;
      o.th = p.th0 + p.theta[p.n - 1];
      o.y = p.y0 + p.y[p.n - 1];
      return;
    }
    let j = Math.floor(u / DS);
    if (j > p.n - 2) j = p.n - 2;
    const tau = u - j * DS;
    const dk = p.kappa[j + 1] - p.kappa[j];
    const dg = p.grade[j + 1] - p.grade[j];
    o.k = p.kappa[j] + (dk * tau) / DS;
    o.g = p.grade[j] + (dg * tau) / DS;
    // Kurs und Höhe als genaues Integral der linear interpolierten Krümmung bzw. Steigung (siehe sampleInt)
    o.th = p.th0 + p.theta[j] + tau * (p.kappa[j] + (dk * tau) / (2 * DS));
    o.y = p.y0 + p.y[j] + tau * (p.grade[j] + (dg * tau) / (2 * DS));
  }

  /** Weg-Stelle, ab der sich die Auswahl gegenüber dem letzten Bild unterscheidet (Infinity: gleich). */
  changeAt(s) {
    const A = this.segs;
    const B = this.prev;
    let j = 0;
    for (let k = 0; k < this.nSegs; k++) {
      const a = A[k];
      if (a.s1 <= s) continue;
      while (j < this.nPrev && B[j].s1 <= a.s0) j++;
      if (j >= this.nPrev) return a.s0; // neu am Ende
      if (B[j].prof !== a.prof) return Math.max(a.s0, s);
      j++;
    }
    return Infinity;
  }

  /**
   * Die Tabelle des Shaders füllen (src/curve.js: curveTable): relativ zum Spieler, d von −400 bis +3432 m entlang
   * des Wegs, den er fährt (vor einer Gabelung der Zweig, den das Navi nimmt). trip = null: klassischer Kurs oder
   * Kurvenprobe (mode). Ändert sich der Weg im Blickfeld, blendet die Tabelle in gut einer Sekunde über.
   */
  fill(trip, sPlayer, table, dt = 1 / 60) {
    if (table && (table.n !== T_N || table.d0 !== T_D0 || table.ds !== T_DS)) throw new Error('course.fill: Tabelle passt nicht zu curve.js');
    const s = sPlayer;
    const jump = !(Math.abs(s - this.lastS) < 200) || trip !== this.lastTrip;
    this.nSegs = this.collect(trip, s, this.segs);
    const at = jump ? 0 : this.changeAt(s);
    if (jump) this.blend = 1;
    else if (at < s + BLEND_NEAR) {
      // die Auswahl des letzten Bilds einfrieren und von ihr aus überblenden
      const t = this.old;
      this.old = this.prev;
      this.nOld = this.nPrev;
      this.prev = t;
      this.blend = 0;
      this.blendT = 0;
    }
    if (jump || at < Infinity) this.version++;
    if (this.blend < 1) this.blend = Math.min(1, this.blend + dt / (this.blendT || BLEND_TIME));
    for (let k = 0; k < this.nSegs; k++) {
      const a = this.prev[k];
      const b = this.segs[k];
      a.prof = b.prof;
      a.sec = b.sec;
      a.path = b.path;
      a.s0 = b.s0;
      a.s1 = b.s1;
    }
    this.nPrev = this.nSegs;
    this.lastS = s;
    this.lastTrip = trip;

    const segs = this.segs;
    const n = this.nSegs;
    const o = this.o1;
    const q = this.o2;
    o.s0 = s;
    this.walk(segs, n, 0, o);
    const th0 = o.th;
    const y0 = o.y;
    const st = this.state;
    st.kappa = o.k;
    st.grade = o.g;
    st.xref = o.xr;
    if (!jump) {
      const ds = clamp(s - st.s, -60, 60);
      st.mapX -= Math.sin(th0) * ds;
      st.mapZ -= Math.cos(th0) * ds;
    }
    st.s = s;
    st.psi = th0;
    st.y = y0;
    const w = sstep(this.blend);
    let oth0 = 0;
    let oy0 = 0;
    if (w < 1) {
      q.s0 = s;
      this.walk(this.old, this.nOld, 0, q);
      oth0 = q.th;
      oy0 = q.y;
    }
    const K = this.tK;
    const TH = this.tTh;
    const Y = this.tY;
    const GR = this.tG;
    const XR = this.tX;
    o.s0 = s + T_D0;
    o.ds = T_DS;
    q.s0 = o.s0;
    q.ds = T_DS;
    // im ersten Bild einer Überblendung: wie weit liegen alte und neue Welt bis 600 m voraus auseinander?
    const measure = w < 1 && !this.blendT;
    let lat = 0;
    let gap = 0;
    for (let j = 0; j < T_N; j++) {
      this.walk(segs, n, j, o);
      let k = o.k;
      let th = o.th - th0;
      let y = o.y - y0;
      let g = o.g;
      if (w < 1) {
        this.walk(this.old, this.nOld, j, q);
        if (measure && j * T_DS + T_D0 > 0 && j <= BLEND_J) {
          const dth = th - (q.th - oth0);
          lat += Math.abs(dth) * T_DS;
          gap = Math.max(gap, lat + 60 * Math.abs(dth) + Math.abs(y - (q.y - oy0)));
        }
        k = q.k + (k - q.k) * w;
        th = q.th - oth0 + (th - (q.th - oth0)) * w;
        y = q.y - oy0 + (y - (q.y - oy0)) * w;
        g = q.g + (g - q.g) * w;
      }
      K[j] = k;
      TH[j] = th;
      Y[j] = y;
      GR[j] = g;
      XR[j] = o.xr;
    }
    // sstep steigt höchstens mit 1,5/T
    if (measure) this.blendT = clamp((1.5 * gap) / BLEND_RATE, BLEND_TIME, 3);
    // Lage Q der Linie x = 0: Q' = (1 − xref · kappa) · T(theta), Simpson mit dem Kurs der Hermite-Form
    const QX = this.tQx;
    const QZ = this.tQz;
    QX[0] = 0;
    QZ[0] = 0;
    for (let j = 0; j + 1 < T_N; j++) {
      const ta = TH[j];
      const tb = TH[j + 1];
      const tm = 0.5 * (ta + tb) + (T_DS * (K[j] - K[j + 1])) / 8;
      const fa = 1 - XR[j] * K[j];
      const fb = 1 - XR[j + 1] * K[j + 1];
      const fm = 1 - 0.25 * (XR[j] + XR[j + 1]) * (K[j] + K[j + 1]);
      QX[j + 1] = QX[j] - (T_DS / 6) * (fa * Math.sin(ta) + 4 * fm * Math.sin(tm) + fb * Math.sin(tb));
      QZ[j + 1] = QZ[j] - (T_DS / 6) * (fa * Math.cos(ta) + 4 * fm * Math.cos(tm) + fb * Math.cos(tb));
    }
    // so verschieben, dass Lage, Kurs und Höhe am Spieler (d = 0, Hermite-Form wie im Shader) genau 0 sind
    const u = -T_D0 / T_DS;
    const j0 = Math.floor(u);
    const t = u - j0;
    const t2 = t * t;
    const t3 = t2 * t;
    const h00 = 2 * t3 - 3 * t2 + 1;
    const h10 = (t3 - 2 * t2 + t) * T_DS;
    const h01 = 3 * t2 - 2 * t3;
    const h11 = (t3 - t2) * T_DS;
    const ma = 1 - XR[j0] * K[j0];
    const mb = 1 - XR[j0 + 1] * K[j0 + 1];
    const qx = h00 * QX[j0] - h10 * ma * Math.sin(TH[j0]) + h01 * QX[j0 + 1] - h11 * mb * Math.sin(TH[j0 + 1]);
    const qz = h00 * QZ[j0] - h10 * ma * Math.cos(TH[j0]) + h01 * QZ[j0 + 1] - h11 * mb * Math.cos(TH[j0 + 1]);
    const thz = h00 * TH[j0] + h10 * K[j0] + h01 * TH[j0 + 1] + h11 * K[j0 + 1];
    const yz = h00 * Y[j0] + h10 * GR[j0] + h01 * Y[j0 + 1] + h11 * GR[j0 + 1];
    // die Tabelle bleibt so verschoben stehen: preview() liest dieselben Werte wie der Shader
    for (let j = 0; j < T_N; j++) {
      QX[j] -= qx;
      QZ[j] -= qz;
      TH[j] -= thz;
      Y[j] -= yz;
      if (table) table.set(j, QX[j], QZ[j], TH[j], Y[j], K[j], XR[j], GR[j]);
    }
    return st;
  }

  /**
   * Die Straße voraus für das Navi (seine einzige Quelle dafür): die Linie lat der Simulation (Vorgabe 0) alle step
   * Meter bis dMax, in Metern ab dem Spieler (x rechts, z voraus), dazu psi = Kurs des Spielers im Kartenrahmen. Nach
   * fill() an derselben Stelle genau die Linie, die die Welt zeigt: dieselbe Tabelle samt Überblendung, dieselbe
   * Hermite-Form wie src/curve.js. Ohne passendes fill() (etwa vor dem ersten Bild) aus den Profilen der Auswahl.
   */
  preview(trip, sPlayer, dMax = 1500, step = 10, lat = 0) {
    const pv = this.pv;
    const m = Math.min(pv.x.length, Math.floor(dMax / step) + 1);
    pv.n = m;
    if (this.nSegs && sPlayer === this.lastS) {
      const h = this.hq;
      for (let i = 0; i < m; i++) {
        this.tableAt(i * step, h);
        pv.x[i] = h.x + lat * Math.cos(h.th) - lat;
        pv.z[i] = lat * Math.sin(h.th) - h.z;
      }
      pv.psi = this.state.psi;
      return pv;
    }
    const segs = this.pvSegs;
    const n = this.collect(trip, sPlayer, segs);
    const o = this.o2;
    o.s0 = sPlayer;
    o.ds = step;
    this.walk(segs, n, 0, o);
    const th0 = o.th;
    pv.psi = th0;
    let x = 0;
    let z = 0;
    let thp = 0;
    for (let i = 0; i < m; i++) {
      this.walk(segs, n, i, o);
      const th = o.th - th0;
      if (i) {
        const tm = 0.5 * (th + thp);
        x -= Math.sin(tm) * step;
        z += Math.cos(tm) * step;
      }
      thp = th;
      pv.x[i] = x + lat * Math.cos(th) - lat;
      pv.z[i] = z + lat * Math.sin(th);
    }
    return pv;
  }

  /** Lage und Kurs der Linie x = 0 bei d nach fill(): Hermite wie curveAt in src/curve.js, jenseits geradeaus. */
  tableAt(d, out) {
    const QX = this.tQx;
    const QZ = this.tQz;
    const TH = this.tTh;
    const K = this.tK;
    const XR = this.tX;
    const u = (d - T_D0) / T_DS;
    const j = clamp(Math.floor(u), 0, T_N - 2);
    const t = u - j;
    const tc = clamp(t, 0, 1);
    const t2 = tc * tc;
    const t3 = t2 * tc;
    const h00 = 2 * t3 - 3 * t2 + 1;
    const h10 = (t3 - 2 * t2 + tc) * T_DS;
    const h01 = 3 * t2 - 2 * t3;
    const h11 = (t3 - t2) * T_DS;
    const sa = (1 - XR[j] * K[j]) * h10;
    const sb = (1 - XR[j + 1] * K[j + 1]) * h11;
    out.x = h00 * QX[j] - sa * Math.sin(TH[j]) + h01 * QX[j + 1] - sb * Math.sin(TH[j + 1]);
    out.z = h00 * QZ[j] - sa * Math.cos(TH[j]) + h01 * QZ[j + 1] - sb * Math.cos(TH[j + 1]);
    out.th = h00 * TH[j] + h10 * K[j] + h01 * TH[j + 1] + h11 * K[j + 1];
    const e = (t - tc) * T_DS;
    if (e !== 0) {
      const th = TH[t < 0 ? j : j + 1];
      out.x -= e * Math.sin(th);
      out.z -= e * Math.cos(th);
    }
    return out;
  }

  /**
   * Bögen auf dem Weg ab s − 400 (nach fill()): ruft fn(s0, s1, k, t, kind, i, sec, path) für jeden Bogen mit Anfang
   * und Ende in Weg-Metern, Krümmung k (links positiv), Übergang t, Straßenart, laufender Nummer, Abschnitt und Weg
   * (ohne Allokation).
   */
  eachBend(fn) {
    let i = 0;
    for (let k = 0; k < this.nSegs; k++) {
      const g = this.segs[k];
      for (const e of g.prof.bends) fn(g.s0 + e.a, g.s0 + e.b, e.k, e.t, g.prof.kind, i++, g.sec, g.path);
    }
  }
}

/**
 * Entwurf aus der Karte für die Abschnitte einer XXL-Fahrt (trip.js): Autobahn und Landstraße nach dem
 * Kartenverlauf, Rampen an den Kreuzen, Zubringer und Ortsdurchfahrten. Für die XXL-Fahrt:
 * new Course({ planner: new MapPlanner({ graph, shapes }) }) mit graph = src/map/graph.js, shapes = src/map/shapes.js.
 */
export class MapPlanner {
  constructor({ graph, shapes = null, seed = 7 }) {
    this.graph = graph;
    this.shapes = shapes;
    this.seed = seed;
    this.mapCache = new Map();
  }

  // --- Karte ---------------------------------------------------------------------------------------------------
  /** Kartenverlauf einer gerichteten Kante in Spielmetern: Bögen, Kurs am Anfang und Ende, Steigung (zwischengesp.). */
  mapCourse(de, len, kind) {
    const key = de * 2 + (kind === 'land' ? 1 : 0);
    let m = this.mapCache.get(key);
    if (m && m.len === len) return m;
    const G = this.graph;
    const e = G.deEdge(de);
    const rev = de & 1;
    let lat;
    let lon;
    let elev = null;
    let matched = 0;
    if (this.shapes) {
      const sh = this.shapes.edgeShape(e.i);
      lat = sh.lat;
      lon = sh.lon;
      matched = sh.matched | 0;
      for (let i = 0; i < sh.n; i++) {
        if (sh.elev[i] !== 0) {
          elev = sh.elev;
          break;
        }
      }
    } else {
      const pts = G.dePoints(de & ~1);
      lat = Float64Array.from(pts, (p) => p[0]);
      lon = Float64Array.from(pts, (p) => p[1]);
    }
    const np = lat.length;
    // lokale Meter (Ost x, Nord y), in Fahrtrichtung
    const lat0 = (lat[0] + lat[np - 1]) / 2;
    const kx = 111320 * Math.cos(lat0 * RAD);
    const px = new Float64Array(np);
    const py = new Float64Array(np);
    const pe = new Float64Array(np);
    for (let i = 0; i < np; i++) {
      const j = rev ? np - 1 - i : i;
      px[i] = (lon[j] - lon[0]) * kx;
      py[i] = (lat[j] - lat[0]) * 110540;
      pe[i] = elev ? elev[j] : 0;
    }
    const cum = new Float64Array(np);
    for (let i = 1; i < np; i++) cum[i] = cum[i - 1] + Math.hypot(px[i] - px[i - 1], py[i] - py[i - 1]);
    const Lm = Math.max(cum[np - 1], 1);
    const c = Lm / len; // Kartenmeter je Spielmeter
    const n = Math.round(len / DS) + 1;
    // Kurs je Polygonseite (theta = −Peilung, stetig fortgesetzt), in Spielmetern abgetastet
    const segTh = new Float64Array(Math.max(1, np - 1));
    let last = 0;
    let first = true;
    for (let i = 0; i + 1 < np; i++) {
      const dx = px[i + 1] - px[i];
      const dy = py[i + 1] - py[i];
      let th = Math.hypot(dx, dy) > 1e-6 ? Math.atan2(-dx, dy) : last;
      if (!first) th = last + wrap(th - last);
      first = false;
      segTh[i] = th;
      last = th;
    }
    const th = new Float64Array(n);
    const ev = new Float64Array(n);
    let k = 0;
    for (let i = 0; i < n; i++) {
      const u = Math.min(i * DS * c, Lm);
      while (k < np - 2 && cum[k + 1] < u) k++;
      th[i] = segTh[k];
      if (elev) {
        const f = cum[k + 1] > cum[k] ? (u - cum[k]) / (cum[k + 1] - cum[k]) : 0;
        ev[i] = pe[k] + (pe[k + 1] - pe[k]) * clamp(f, 0, 1);
      }
    }
    const spec = KINDS[kind];
    // grobe Polygone (Platzhalter, Ersatzverlauf) stärker glätten: ihre Ecken sind keine echten Kurven
    const ths = gauss(th, (matched >= 1 ? spec.sigma : spec.sigmaCoarse) / DS);
    const kap = new Float64Array(n);
    for (let i = 1; i + 1 < n; i++) kap[i] = (ths[i + 1] - ths[i - 1]) / (2 * DS);
    // Bögen: gleichsinnige Stücke merklicher Krümmung, kurze Unterbrechungen überbrückt. Nur zwischen den Ruhezonen
    // an den Knoten (i0 … i1): Was die Karte dort abbiegt, gehört zum Knick am Knoten und wird je zur Hälfte vor und
    // hinter dessen Ruhezone gefahren (sonst käme alles davor, bis zu 400 m zu früh)
    const i0 = Math.min(Math.round((kind === 'ab' ? CALM : CALM_NODE) / DS), (n - 1) >> 2);
    const i1 = n - 1 - i0;
    const thr = 1 / 40000;
    const runs = [];
    for (let i = i0; i <= i1; ) {
      if (Math.abs(kap[i]) < thr) {
        i++;
        continue;
      }
      const sg = Math.sign(kap[i]);
      let j = i;
      let A = 0;
      let w = 0;
      let ws = 0;
      while (j <= i1 && kap[j] * sg > thr * 0.5) {
        A += kap[j] * DS;
        w += Math.abs(kap[j]) * j * DS;
        ws += Math.abs(kap[j]);
        j++;
      }
      const prev = runs[runs.length - 1];
      if (prev && Math.sign(prev.A) === sg && i * DS - prev.e < 120) {
        prev.c = (prev.c * Math.abs(prev.A) + (w / ws) * Math.abs(A)) / (Math.abs(prev.A) + Math.abs(A));
        prev.A += A;
        prev.e = j * DS;
      } else runs.push({ A, c: w / ws, s: i * DS, e: j * DS });
      i = j;
    }
    // der Winkel zwischen den Ruhezonen bleibt (Reste unter der Schwelle gehen zum größten gleichsinnigen Bogen); die
    // Richtungen dort (hs, he) bestimmen die Knicke an den Knoten. Sie kommen aus dem ungeglätteten Kurs (Mittel über
    // ±100 m), damit die Fahrt an jedem Knoten so liegt wie die Karte, auch wenn die Glättung dort ein Hin und Her verwischt
    const head = (i) => {
      let a = 0;
      let m = 0;
      for (let k = Math.max(0, i - 20); k <= Math.min(n - 1, i + 20); k++, m++) a += th[k];
      return a / m;
    };
    const hs = head(i0);
    const he = head(i1);
    const total = he - hs;
    const rest = total - runs.reduce((a, q) => a + q.A, 0);
    if (runs.length && Math.abs(rest) > 1e-5) {
      let best = -1;
      for (let i = 0; i < runs.length; i++) {
        if (Math.sign(runs[i].A) === Math.sign(rest) && (best < 0 || Math.abs(runs[i].A) > Math.abs(runs[best].A))) best = i;
      }
      if (best < 0) best = runs.reduce((b, q, i) => (Math.abs(q.A) > Math.abs(runs[b].A) ? i : b), 0);
      runs[best].A += rest;
    } else if (!runs.length && Math.abs(total) > 1e-4) runs.push({ A: total, c: len / 2, s: 0, e: len });
    if (matched >= 1 && spec.amin) prune(runs, spec.amin * RAD);
    // Steigung aus den Höhen: dy/ds = E · d(Höhe)/d(Kartenweg)
    let grade = null;
    if (elev && matched >= 1) {
      grade = new Float64Array(n);
      for (let i = 1; i + 1 < n; i++) grade[i] = (EXAGGERATE * (ev[i + 1] - ev[i - 1])) / (2 * DS * c);
      grade = gauss(grade, 120 / DS);
    }
    const na = G.nodes[G.deFrom(de)];
    const nb = G.nodes[G.deTo(de)];
    m = {
      len, c, matched, runs, total, grade, hs, he,
      relief: (relief(na.lat, na.lon, na.cc) + relief(nb.lat, nb.lon, nb.cc)) / 2,
    };
    this.mapCache.set(key, m);
    return m;
  }

  /** Kurs (Kartenrahmen) am Anfang einer gerichteten Kante. */
  headStart(de) {
    const G = this.graph;
    if (!G || de < 0) return null;
    const e = G.deEdge(de);
    const L = G.edgeLen(e);
    if (L > 0) return this.mapCourse(de, L, e.kind === 'land' ? 'land' : 'ab').hs;
    const p = G.dePoints(de);
    return wrap(-G.bearing(p[0][0], p[0][1], p[1][0], p[1][1]) * RAD);
  }

  /** Liegt an diesem Knoten ein Ort direkt an der Straße (dann folgt der Landstraße die Ortsdurchfahrt)? */
  townAt(node) {
    return this.graph.nodes[node].places.some((p) => p.zubKm < 1.5);
  }

  /** Kurs vom Knoten zum Ort (für den Zubringer dorthin). */
  placeHead(sec) {
    const G = this.graph;
    const nd = G.nodes[sec.node];
    const p = G.places[sec.place];
    if (!nd || !p) return null;
    return wrap(-G.bearing(nd.lat, nd.lon, p.lat, p.lon) * RAD);
  }

  /** Kurs am Anfang, wenn es keinen Vorgänger gibt: der Kartenkurs der ersten bekannten Kante des Wegs. */
  startHeading(sec, path) {
    if (!this.graph) return 0;
    if (sec.de >= 0) return this.headStart(sec.de) ?? 0;
    if (path) for (const c of path.sections) if (c.de >= 0) return this.headStart(c.de) ?? 0;
    return 0;
  }

  /**
   * Kurs (Kartenrahmen) der Straße, auf die es nach dem Abschnitt weitergeht, oder null. Was schon auf dem Weg liegt,
   * gilt (this.sure = true); sonst so, wie die Fahrt jetzt weiterplanen würde (this.sure = false: der Entwurf merkt
   * sich die Vorhersage und wird neu gemacht, wenn sie sich ändert, siehe Course.refresh). Nur für den Kurs:
   * Ruhezonen hängen nie davon ab.
   */
  nextHead(sec, trip, path) {
    const G = this.graph;
    this.sure = true;
    if (!path || !G) return null;
    const L = path.sections;
    for (let k = L.indexOf(sec) + 1; k < L.length; k++) {
      const c = L[k];
      if (c.de >= 0 && (c.kind === 'auf' || c.kind === 'ab' || c.kind === 'land')) return this.headStart(c.de);
      if (c.kind === 'zub' && !c.back && c.place >= 0) return this.placeHead(c);
      if (c.kind === 'term') return null;
    }
    this.sure = false;
    const f = path.frontier;
    if (trip && f && f.t === 'node') {
      const pick = trip.pickLeave(f.n, f.via);
      if (!pick.goal && pick.t && pick.t.type === 'enter' && G.edgeLen(G.deEdge(pick.t.de)) > 0) return this.headStart(pick.t.de);
    }
    return null;
  }

  /**
   * Ruhezonen (Meter) am Anfang und Ende eines Abschnitts: dort ist die Straße gerade. Sie hängen nur vom Abschnitt
   * und seinem Vorgänger ab (beide stehen fest, sobald der Abschnitt existiert), nie von der Fortsetzung.
   */
  calmOf(sec, prev) {
    const k = sec.kind;
    if (k === 'ab' || k === 'stadt') return [CALM, CALM];
    if (k === 'conn') return [CALM_SWAP, CALM_MERGE];
    if (k === 'land') return [prev && prev.kind === 'land' ? CALM_NODE : CALM, this.townAt(this.graph.deTo(sec.de)) ? CALM : CALM_NODE];
    if (k === 'zub') {
      const pk = prev ? prev.kind : '';
      let c0 = pk === 'ramp' ? CALM_SWAP : pk === 'land' || pk === 'zub' ? CALM_NODE : CALM;
      if (sec.back) c0 = Math.max(c0, CALM_SHOW);
      return [c0, CALM];
    }
    return [sec.len / 2, sec.len / 2];
  }

  /**
   * Bögen (items für layout), Hügel (in gel) und gewünschten Winkel net eines Abschnitts der Fahrt planen.
   * Gibt {items, net, lo, hi, grade} zurück: lo, hi = Ende und Anfang der Ruhezonen, grade = echte Steigung oder null.
   */
  plan(sec, path, trip, P, prev, gel) {
    const kind = P.kind;
    const spec = KINDS[kind];
    const L = sec.len;
    const G = this.graph;
    const [c0, c1] = this.calmOf(sec, prev);
    const lo = c0;
    const hi = L - c1;
    const t = spec.t;
    const items = [];
    const bend = (A, c, kd, grp = 0, at = 0) => items.push({ A, c, kd: clamp(kd, 1e-6, spec.kmax), kmax: spec.kmax, t, grp, at });
    let gradeArr = null;
    let net = 0;
    if ((kind === 'ab' || kind === 'land') && sec.de >= 0) {
      const m = this.mapCourse(sec.de, L, kind);
      P.matched = m.matched;
      P.mapTurn = m.total;
      // Ziel am Ende: Winkelhalbierende zur Fortsetzung geradeaus (die andere Hälfte biegt der nächste Abschnitt)
      // auf der Autobahn geradeaus weiter (wer abfährt, biegt auf der Rampe ab), auf der Landstraße dorthin, wohin die
      // Fahrt weitergeht
      let hn = null;
      if (kind === 'land' && path) {
        hn = this.nextHead(sec, trip, path);
        if (!this.sure) P.guess = { h: hn };
      } else {
        const st = G.straight(sec.de);
        hn = st >= 0 ? this.headStart(st) : null;
      }
      const endPart = hn === null ? 0 : wrap(hn - m.he) / 2;
      const startPart = wrap(m.hs - P.th0);
      net = startPart + m.total + endPart;
      // ein Bogen, der in maximal lmax Metern an der Ruhezone anliegt (end: am Ende). Ohne echten Verlauf ist der Knick
      // am Knoten nur die Ecke eines groben Polygons: Dann wird er ein langer, weiter Bogen statt einer engen Kurve
      const coarse = m.matched < 2;
      // Spaß: kleine Bögen werden merklich enger, große gedeckelt; der Winkel bleibt. Bögen echter Verläufe bleiben
      // dabei weit (ksoft); enger wird nur, was sonst nicht in den Platz passt (layout)
      const fun = (q) => clamp(spec.kmax * Math.tanh((spec.gain * q) / spec.kmax), spec.kmin, m.matched >= 1 ? spec.ksoft : spec.kmax);
      const edgeBend = (A, end, lmax) => {
        if (Math.abs(A) < 2e-4) return;
        const kd = Math.max(fun(Math.abs(A) / (coarse ? 900 : 600)), kind === 'ab' ? 1 / 2400 : 1 / 600, Math.abs(A) / Math.max(lmax - t, 1));
        const l = bendLen(Math.abs(A), Math.min(kd, spec.kmax), t);
        bend(A, end ? hi - l / 2 : lo + l / 2, kd, 0, end ? 1 : -1);
      };
      for (const run of m.runs) bend(run.A, run.c, fun(Math.abs(run.A) / Math.max(run.e - run.s, 2 * t)));
      // die Knicke an den Knoten gleich hinter bzw. vor der Ruhezone, nicht zu lang: Ein Fenster um den einen Knoten
      // soll nicht auch den Knick des anderen sehen
      const lmax = clamp(0.4 * (hi - lo), 2 * t, coarse ? 1000 : 700);
      const nRuns = items.length;
      edgeBend(startPart, false, lmax);
      edgeBend(endPart, true, lmax);
      if (m.matched >= 1) {
        const knees = items.slice(nRuns).reduce((a, it) => a + bendLen(Math.abs(it.A), it.kd, t), 0);
        tame(items.slice(0, nRuns), spec.share * (hi - lo), spec.floor, knees);
      }
      const odd = sec.de & 1;
      const seedOf = (salt) => hash(this.seed, sec.de >> 1, salt);
      const fl = [];
      if (m.matched < 2) {
        // ohne echten Verlauf: Spaß-Gruppen in alle Lücken zwischen den Knicken und den Bögen der Karte
        const r = rng(seedOf(kind === 'ab' ? 3 : 4));
        const o = kind === 'ab' ? { kind, kmax: spec.kmax, t, gap: [30, 200], st: { since: 1500 + r() * 2000 } } : { kind, kmax: spec.kmax, t, gap: [60, 380], rmin: 110, rmax: 400 };
        for (const [a, b, sa, sb] of this.gaps(items, lo, hi, kind === 'ab' ? 120 : 60)) funFill(r, a, b, sa, sb, fl, o);
      } else if (kind === 'ab') {
        // echter Verlauf: nur wo die Karte lange gerade ist, sanfte Schwünge (die Fahrtrichtung bleibt)
        const r = rng(seedOf(5));
        const o = { kind, kmax: spec.kmax, t, gap: [100, 350], st: { since: 0, gentle: true } };
        for (const [a, b, sa, sb] of this.gaps(items, lo, hi, 170)) if (b - a > GENTLE) funFill(r, a, b, sa, sb, fl, o);
      }
      items.push(...fl);
      if (m.grade) gradeArr = this.realGrade(m.grade, P.n, spec.gmax);
      else {
        hills(rng(seedOf(9)), FLAT, L - FLAT, kind === 'land' ? Math.min(1, m.relief * 1.25) : m.relief, spec.gmax, gel);
        if (odd) mirrorEls(gel, L);
      }
    } else if (kind === 'conn') {
      // Verbindungsfahrbahn im Kreuz: nach rechts ein weiter Bogen, nach links die Schleife des Kleeblatts (270°
      // rechtsherum), fast geradeaus ein Schwung über die Brücke, Kehrtwende als Halbkreis
      const h = this.nextHead(sec, trip, path);
      if (!this.sure) P.guess = { h };
      const phi = h === null ? 0 : wrap(h - P.th0);
      const r = rng(hash(this.seed, sec.node | 0, 21));
      const avail = hi - lo;
      const mid = (lo + hi) / 2;
      const loopR = (A) => (avail - t) / Math.abs(A);
      if (phi > PI * 0.4 && loopR(phi - TAU) >= 180) {
        net = phi - TAU;
        bend(net, mid, 1 / Math.min(300, loopR(net)));
      } else if (Math.abs(phi) >= PI * 0.4) {
        net = phi;
        bend(phi, mid, 1 / clamp(loopR(phi), 180, 300));
      } else {
        // flacher Winkel: erst sacht in die Gegenrichtung, dann der große Schwung
        net = phi;
        const sg = Math.abs(phi) > 0.05 ? Math.sign(phi) : hash(sec.node | 0, 3) & 1 ? 1 : -1;
        const main = sg * clamp(Math.abs(phi) + 0.8, 1.05, PI / 2);
        bend(phi - main, lo + avail * 0.27, 1 / between(r, 380, 520));
        bend(main, lo + avail * 0.72, 1 / between(r, 210, 280));
      }
      // eine kleine Brücke (langsam gefahren: die Kuppe darf enger sein)
      const g = 0.04;
      const tg = 1.5 * g * R_CREST * 0.6;
      if (L - 2 * FLAT > 4 * tg) gel.push({ a: L / 2 - 2 * tg, b: L / 2, k: g, t: tg }, { a: L / 2, b: L / 2 + 2 * tg, k: -g, t: tg });
    } else if (kind === 'zub') {
      const head = !sec.back && sec.place >= 0 ? this.placeHead(sec) : this.nextHead(sec, trip, path);
      if ((sec.back || sec.place < 0) && !this.sure) P.guess = { h: head };
      const phi = head === null ? 0 : wrap(head - P.th0);
      net = phi;
      const r = rng(hash(this.seed, (sec.node | 0) * 8 + (sec.back ? 1 : 0), sec.place | 0));
      if (Math.abs(phi) > 2e-4) bend(phi, (lo + hi) / 2, 1 / clamp((hi - lo - t) / Math.abs(phi), 1 / spec.kmax, 700));
      const fl = [];
      for (const [a, b, sa, sb] of this.gaps(items, lo, hi, 60)) funFill(r, a, b, sa, sb, fl, { kind: 'land', kmax: spec.kmax, t, gap: [60, 380], rmin: 170, rmax: 520 });
      items.push(...fl);
      hills(r, FLAT, L - FLAT, 0.5, spec.gmax, gel);
    } else if (kind === 'stadt') {
      // Ortsdurchfahrt: höchstens ein sanftes S
      if (hi - lo > 420) {
        const r = rng(hash(this.seed, sec.place | 0, 31));
        const A = between(r, 4, 9) * RAD * (r() < 0.5 ? -1 : 1);
        const kd = spec.kmax * 0.8;
        const l = bendLen(Math.abs(A), kd, t);
        const c = (lo + hi) / 2;
        const grp = grpId++;
        if (2 * l <= hi - lo) {
          bend(A, c - l / 2, kd, grp);
          bend(-A, c + l / 2, kd, grp);
        }
      }
    }
    return { items, net, lo, hi, grade: gradeArr };
  }

  /** Freie Stücke [a, b, sa, sb] in [lo, hi] zwischen geplanten Bögen (Abstand margin), sa/sb: Drehsinn der Nachbarn. */
  gaps(items, lo, hi, margin) {
    const spans = items
      .map((it) => {
        const l = bendLen(Math.abs(it.A), it.kd, it.t);
        return [it.c - l / 2 - margin, it.c + l / 2 + margin, Math.sign(it.A)];
      })
      .sort((p, q) => p[0] - q[0]);
    const out = [];
    let s = lo;
    let sa = 0;
    for (const [a, b, sg] of spans) {
      if (a > s) out.push([s, Math.min(a, hi), sa, sg]);
      if (b > s) {
        s = b;
        sa = sg;
      }
    }
    if (hi > s) out.push([s, hi, sa, 0]);
    return out.filter(([a, b]) => b > a);
  }

  /** Echte Steigung: begrenzt, an den Enden eben, Kuppen und Wannen nie zu eng. */
  realGrade(g0, n, gmax) {
    const g = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const w = sstep(Math.min(i * DS, (n - 1 - i) * DS) / FLAT);
      g[i] = gmax * Math.tanh(g0[i] / gmax) * w;
    }
    const dc = DS / R_CREST;
    const dsg = DS / R_SAG;
    // erst in den Bereich, aus dem beide Enden eben erreichbar sind; dann hält jeder Durchgang ihn und die Enden, und
    // schon einer allein lässt keine Kuppe und keine Wanne zu eng (die Enden bleiben genau 0, ohne Sprung)
    g[0] = 0;
    g[n - 1] = 0;
    for (let i = 1; i < n - 1; i++) g[i] = clamp(g[i], Math.max(-i * dc, -(n - 1 - i) * dsg), Math.min(i * dsg, (n - 1 - i) * dc));
    for (let pass = 0; pass < 4; pass++) {
      for (let i = 1; i < n - 1; i++) g[i] = clamp(g[i], g[i - 1] - dc, g[i - 1] + dsg);
      for (let i = n - 2; i > 0; i--) g[i] = clamp(g[i], g[i + 1] - dsg, g[i + 1] + dc);
    }
    return g;
  }
}

// --- Kurvenprobe: fester Kurs für reproduzierbare Bilder und Tests -----------------------------------------------
// Jede Station beginnt und endet gerade; ihre Anfänge stehen in PROBE_MARKS (Weg-Meter).
const pb = (a, A, R, t) => bendAt(a, A * RAD, 1 / R, t);
const hill = (a, half, g, rc = R_CREST) => {
  const t = 1.5 * Math.abs(g) * rc;
  return [{ a, b: a + half, k: g, t }, { a: a + half, b: a + 2 * half, k: -g, t }];
};
const sAfter = (a, A, R, t) => a + bendLen(A * RAD, 1 / R, t);
export const PROBE = [
  { kind: 'ab', len: 1200, k: [], g: [], name: 'Start' },
  // langer Bogen nach rechts (70°): die Sonne wandert von hinten rechts nach vorn rechts, der Schatten des Autos
  // von vorn links nach hinten links
  { kind: 'ab', len: 2400, k: [pb(300, -70, 1300, 220)], g: [], name: 'Langer Bogen' },
  { kind: 'ab', len: 1700, k: [pb(250, 22, 720, 170), pb(sAfter(250, 22, 720, 170), -22, 720, 170)], g: [], name: 'S-Kurve' },
  { kind: 'ab', len: 2800, k: [pb(350, 48, 430, 170), pb(1050, -48, 1400, 200)], g: [], name: 'Enge Kurve' },
  { kind: 'ab', len: 2400, k: [], g: hill(450, 750, 0.055), name: 'Kuppe' },
  { kind: 'ab', len: 2400, k: [pb(200, 12, 1800, 200)], g: hill(450, 750, -0.05), name: 'Senke' },
  // Schleife des Kleeblatts: 270° rechtsherum
  { kind: 'conn', len: 1500, k: [pb(280, -270, 185, 50)], g: [], name: 'Schleife' },
  {
    kind: 'land',
    len: 2200,
    k: [pb(200, 62, 120, 45), pb(560, -40, 160, 45), pb(sAfter(560, 40, 160, 45), 40, 160, 45), pb(1350, -78, 112, 45), pb(1800, 30, 260, 45)],
    g: hill(300, 600, 0.08, R_CREST * 0.5),
    name: 'Landstraße',
  },
  { kind: 'ab', len: 2600, k: [pb(300, 35, 1500, 220)], g: [], name: 'Ausklang' },
];
/** Wo die Stationen der Kurvenprobe beginnen (Weg-Meter). */
export const PROBE_MARKS = (() => {
  const out = {};
  let s = -1000;
  for (const p of PROBE) {
    out[p.name] = s;
    s += p.len;
  }
  return out;
})();
