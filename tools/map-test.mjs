// Prüft Landkarte, Beschriftung, Navi-Weg und Spielstand ohne Grafik: node tools/map-test.mjs
// (Teil von npm test). Die Schriftbreiten schätzt eine einfache Messfunktion; im Browser misst die Leinwand.
import { readFileSync, statSync, existsSync } from 'node:fs';
import {
  project, unproject, REGIONS, landData, onLand, PLACES, PLACE_BY_INDEX, View, placeLabels, menuLayout, bucketOf,
  bucketMin, bucketScale, visiblePlaces, dotRadius, useEdgeShapes, countryName, kmPerUnit,
} from '../src/map/mapview.js';
import { places, nodes, edges, deRev, deRoad, deTowards } from '../src/map/graph.js';
import { Line, fmtMeters } from '../src/map/navroute.js';
import { MapDemo } from '../src/map/mapdemo.js';
import { Persp, TiltView, ribbon } from '../src/map/persp.js';

let fails = 0;
const ok = (cond, msg) => {
  if (!cond) {
    fails++;
    if (fails < 40) console.log('FEHLER:', msg);
  }
};
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const measure = (text, font, spacing = 0) => text.length * (parseFloat(/(\d+)px/.exec(font)[1]) * 0.6 + spacing);
const overlap = (a, b) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];

// --- Projektion: hin und zurück ----------------------------------------------------------------
{
  const r = rng(1);
  let worst = 0;
  for (let i = 0; i < 2000; i++) {
    const lat = -70 + r() * 150;
    const lon = -180 + r() * 360;
    const p = project(lat, lon);
    const q = unproject(p.x, p.y);
    worst = Math.max(worst, Math.abs(q.lat - lat), Math.abs(q.lon - lon));
  }
  ok(worst < 1e-9, 'Projektion hin und zurück weicht ab: ' + worst);
  for (const p of places) {
    const q = unproject(PLACE_BY_INDEX[p.i].x, PLACE_BY_INDEX[p.i].y);
    ok(Math.abs(q.lat - p.lat) < 1e-9 && Math.abs(q.lon - p.lon) < 1e-9, 'Ort zurückgerechnet: ' + p.name);
  }
}

// --- Schräge Sicht des Navis: Boden ↔ Bild hin und zurück, flach = wie von oben, Bänder auf dem Boden -----------
{
  const r = rng(7);
  for (const tilt of [0, (42 * Math.PI) / 180, (60 * Math.PI) / 180]) {
    const cam = new Persp().set(326, 380, tilt, 540);
    let worst = 0;
    const o = [0, 0, 0];
    const g = [0, 0, 0];
    for (let i = 0; i < 2000; i++) {
      const gx = (r() - 0.5) * 2000;
      const gz = -250 + r() * 900;
      cam.project(gx, gz, o);
      if (!(o[2] > 0)) continue;
      cam.unproject(o[0], o[1], g);
      worst = Math.max(worst, Math.abs(g[0] - gx), Math.abs(g[1] - gz));
      ok(Math.abs(cam.depthAtY(o[1]) - gz) < 1e-6 && Math.abs(cam.scaleAtY(o[1]) - o[2]) < 1e-9, 'Tiefe/Maßstab einer Bildzeile');
      if (tilt === 0) ok(Math.abs(o[0] - 326 - gx) < 1e-9 && Math.abs(380 - o[1] - gz) < 1e-9 && o[2] === 1, 'flach = von oben');
    }
    ok(worst < 1e-7, 'Persp hin und zurück weicht ab: ' + worst + ' bei Neigung ' + tilt);
    // gerade Linie am Boden bleibt im Bild gerade (Perspektive), Maßstab fällt nach hinten
    const a = cam.project(100, 0, [0, 0, 0]);
    const b = cam.project(100, 300, [0, 0, 0]);
    const c = cam.project(100, 150, [0, 0, 0]);
    const cross = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    ok(Math.abs(cross) < 1e-6, 'Bodenlinie im Bild krumm');
    ok(tilt === 0 || (b[2] < c[2] && c[2] < a[2]), 'Maßstab nimmt nach hinten nicht ab');
  }
  // Kartenansicht in der schrägen Sicht: Kartenpunkt → Bild → Kartenpunkt
  const v = new View().set(9.5, -60, 300, 0.7, 652, 576, 326, 380);
  const tv = new TiltView(v, new Persp().set(326, 380, (42 * Math.PI) / 180, 540));
  let worst = 0;
  for (let i = 0; i < 500; i++) {
    const x = 9.5 + (r() - 0.5) * 2;
    const y = -60 + (r() - 0.5) * 2;
    const o = tv.toScreen(x, y, [0, 0, 0]);
    if (!(o[2] > 0)) continue;
    const q = tv.toWorld(o[0], o[1], [0, 0]);
    worst = Math.max(worst, Math.abs(q[0] - x), Math.abs(q[1] - y));
  }
  ok(worst < 1e-9, 'TiltView hin und zurück weicht ab: ' + worst);
  // Band: am Auto so breit wie verlangt, an der Grenze gzMax abgeschnitten, hinten schmaler
  const cam = new Persp().set(326, 380, (42 * Math.PI) / 180, 540);
  const pts = [];
  const rec = { moveTo: (x, y) => pts.push([x, y]), lineTo: (x, y) => pts.push([x, y]), closePath() {} };
  ribbon(cam, [0, -100, 0, 0, 0, 800], 5, -200, 400, rec, false);
  const at0 = pts.filter((p) => Math.abs(p[1] - 380) < 1e-6).map((p) => p[0]).sort((a, b) => a - b);
  ok(at0.length === 2 && Math.abs(at0[0] - 321) < 1e-6 && Math.abs(at0[1] - 331) < 1e-6, 'Band am Auto nicht 10 px breit: ' + at0);
  const yFar = cam.project(0, 400, [0, 0, 0])[1];
  ok(Math.abs(Math.min(...pts.map((p) => p[1])) - yFar) < 1e-6, 'Band nicht bei gzMax abgeschnitten');
  const far = pts.filter((p) => Math.abs(p[1] - yFar) < 1e-6).map((p) => p[0]);
  ok(far.length === 2 && Math.abs(far[0] - far[1]) < 10 * 0.75, 'Band hinten nicht schmaler: ' + far);
}

// --- Landdaten: Größe, jeder Ort in einem Gebiet mit feinen Küsten und an Land -----------------------
{
  const size = statSync(new URL('../src/map/land.js', import.meta.url)).size;
  ok(size <= 70 * 1024, 'land.js größer als 70 kB: ' + size);
  ok(readFileSync(new URL('../src/map/land.js', import.meta.url), 'utf8').includes('Natural Earth'), 'Quelle fehlt in land.js');
  const inRegion = (p) => REGIONS.some(([w, s, e, n]) => p.lon >= w && p.lon <= e && p.lat >= s && p.lat <= n);
  for (const p of places) ok(inRegion(p), 'Ort außerhalb der Gebiete mit feinen Küsten: ' + p.name);
  for (const p of places) ok(onLand(PLACE_BY_INDEX[p.i].x, PLACE_BY_INDEX[p.i].y, 1), 'Ort liegt im Wasser (fein): ' + p.name);
  const L = landData();
  ok(L.lod[0].rings.length > 50 && L.lod[1].rings.length > L.lod[0].rings.length, 'zwei Detailstufen');
  ok(L.lod[1].countries.length === new Set(places.map((p) => p.cc)).size, 'jedes Land des Spiels hat Umrisse');
  for (const p of places) ok(countryName(p.cc) !== p.cc, 'Ländername fehlt: ' + p.cc);
}

// --- Beschriftung der großen Karte: fünf Maßstäbe ohne Überdeckung ------------------------------------
const SCALES = [4, 19, 80, 500, 4000];
for (const scale of SCALES) {
  const b = bucketOf(scale);
  const s = bucketMin(b);
  const bs = bucketScale(b);
  const { labels, shown } = menuLayout(b, measure);
  const boxes = labels.map((l) => [l.x * s + l.dx, l.y * s + l.dy, l.x * s + l.dx + l.w, l.y * s + l.dy + l.h, l]);
  let bad = 0;
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      if (Math.abs(boxes[i][0] - boxes[j][0]) > 600) continue;
      if (overlap(boxes[i], boxes[j])) bad++;
    }
  }
  ok(bad === 0, `Maßstab ${scale}: ${bad} Namen überdecken sich`);
  let onDot = 0;
  for (const i of shown) {
    const p = PLACE_BY_INDEX[i];
    const r = dotRadius(p, bs);
    const d = [p.x * s - r, p.y * s - r, p.x * s + r, p.y * s + r];
    for (const q of boxes) if (Math.abs(q[0] - d[0]) < 600 && overlap(q, d)) onDot++;
  }
  ok(onDot === 0, `Maßstab ${scale}: ${onDot} Namen liegen auf Ortspunkten`);
  for (const i of shown) ok(labels.some((l) => l.kind === 'place' && l.i === i), `Maßstab ${scale}: Punkt ohne Namen: ${places[i].name}`);
  ok(shown.size > 0 && labels.length >= shown.size, `Maßstab ${scale}: keine Orte`);
}
// Navi (gedrehte Ansicht, Namen je Bild): placeLabels setzt nichts übereinander
{
  const r = rng(7);
  const v = new View();
  for (let k = 0; k < 40; k++) {
    const p = PLACES[Math.floor(r() * PLACES.length)];
    v.set(p.x, p.y, 200 + r() * 4000, r() * Math.PI * 2, 652, 576, 326, 380);
    const cands = [...visiblePlaces(bucketOf(v.scale))].map((i) => {
      const q = PLACE_BY_INDEX[i];
      return { x: q.x, y: q.y, w: measure(q.name, '600 18px x') + 8, h: 24, r: 6, key: i };
    });
    const out = placeLabels(v, cands, { dots: cands.map((c) => ({ x: c.x, y: c.y, r: 6 })) });
    const boxes = out.map((L) => [L.x, L.y, L.x + L.w, L.y + L.h]);
    let bad = 0;
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) if (overlap(boxes[i], boxes[j])) bad++;
    ok(bad === 0, `Navi-Ansicht ${k}: ${bad} Namen überdecken sich`);
    ok(out.every((L) => L.x >= 4 && L.y >= 4 && L.x + L.w <= 648 && L.y + L.h <= 572), `Navi-Ansicht ${k}: Name ragt aus dem Bild`);
  }
}

// --- Jeder Ort ist in irgendeiner Zoomstufe antippbar (Trefferfläche ≥ 40 Bildpunkte) ---------------------
{
  const firstB = bucketOf(2.6);
  const lastB = bucketOf(9000);
  for (const p of places) {
    let tappable = false;
    for (let b = firstB; b <= lastB && !tappable; b++) {
      const { shown } = menuLayout(b, measure);
      if (!shown.has(p.i)) continue;
      const s = bucketMin(b);
      const q = PLACE_BY_INDEX[p.i];
      // die Trefferfläche (Halbmesser 22) gehört dem Ort, wenn kein anderer gezeigter Punkt näher als 40 Bildpunkte liegt
      let near = Infinity;
      for (const j of shown) {
        if (j === p.i) continue;
        const o = PLACE_BY_INDEX[j];
        if (Math.abs(o.x - q.x) * s > 60) continue;
        near = Math.min(near, Math.hypot(o.x - q.x, o.y - q.y) * s);
      }
      tappable = near >= 40;
    }
    ok(tappable, 'Ort in keiner Zoomstufe antippbar: ' + p.name);
  }
}

// --- Kurvige Straße: Kurs ohne Zucken an den Stützpunkten --------------------------------------------------
{
  // Kunststraße: Zickzack mit 40-m-Stützpunkten um eine Sinuswelle (Wellenlänge 1,5 km, Ausschlag 250 m)
  const L = new Line();
  const pts = [];
  const KM = 1 / 111.32;
  for (let i = 0; i <= 600; i++) {
    const x = i * 0.04 * KM;
    pts.push(x, Math.sin((i * 0.04 * 2 * Math.PI) / 1.5) * 0.25 * KM + (i % 2 ? 0.006 : -0.006) * KM);
  }
  L.push(pts, 0, 24000);
  const d = [0, 0];
  let prev = null;
  let worst = 0;
  for (let a = 0.6 * KM; a < L.len - 0.6 * KM; a += 0.01 * KM) {
    L.dirAt(a, 0.3 * KM, d);
    const h = Math.atan2(d[1], d[0]);
    if (prev !== null) worst = Math.max(worst, Math.abs(Math.atan2(Math.sin(h - prev), Math.cos(h - prev))));
    prev = h;
  }
  ok(worst < (3 * Math.PI) / 180, 'Kurs springt auf kurviger Straße um ' + ((worst * 180) / Math.PI).toFixed(2) + '°');

  // ganze Fahrt mit genauen (hier: künstlich kurvigen) Verläufen über den einen Anschluss useEdgeShapes
  useEdgeShapes((i) => {
    const e = edges[i];
    const a = nodes[e.a];
    const b = nodes[e.b];
    const n = 80;
    const lat = new Float64Array(n);
    const lon = new Float64Array(n);
    for (let k = 0; k < n; k++) {
      const t = k / (n - 1);
      const w = Math.sin(t * Math.PI * 6) * 0.02 * Math.sin(t * Math.PI);
      lat[k] = a.lat + (b.lat - a.lat) * t + w;
      lon[k] = a.lon + (b.lon - a.lon) * t - w;
    }
    return { n, lat, lon, elev: new Float32Array(n), matched: 2 };
  });
  const demo = new MapDemo({ start: 'Erlensee', rng: rng(3) });
  demo.target('Würzburg');
  let last = null;
  let jumps = 0;
  let nan = 0;
  for (let k = 0; k < 6000; k++) {
    demo.advance(36 / 15, 1 / 15);
    const P = demo.model.pose;
    if (!Number.isFinite(P.x + P.y + P.dx + P.dy)) nan++;
    const h = Math.atan2(P.dy, P.dx);
    if (last !== null && !demo.model.hop && Math.abs(Math.atan2(Math.sin(h - last), Math.cos(h - last))) > (2.6 / 15) * 1.01) jumps++;
    last = h;
  }
  useEdgeShapes(null);
  ok(nan === 0, 'Navi-Lage nicht endlich: ' + nan);
  ok(jumps === 0, 'Kurs dreht schneller als 150°/s: ' + jumps);
  ok(demo.visits.length > 0 || demo.trip.target !== 0, 'Prüffahrt kommt nicht voran');
}

// --- Verbindungsfahrbahnen: im Bogen auf die nächste Autobahn, nicht erst geradeaus weg und dann zurück ---------
// (die Auffahrt danach legt die Fahrt erst an, wenn das Auto schon auf der Verbindung ist; das Navi nimmt bis dahin
// die Auffahrt, die die Fahrt wählen wird)
{
  let conns = 0;
  let wide = 0;
  for (let r = 0; r < 6; r++) {
    const R = rng(100 + r);
    const demo = new MapDemo({ start: Math.floor(R() * nodes.length), rng: R });
    demo.pickTarget();
    const seen = new Set();
    for (let k = 0; k < 6000; k++) {
      demo.advance(30 / 15, 1 / 15);
      // auf der Rampe: wie das Navi die Verbindung davor zeichnet
      const L = demo.trip.cur.sections;
      const i = L.indexOf(demo.trip.section);
      const sec = L[i + 1];
      if (demo.trip.section.kind !== 'ramp' || !sec || sec.kind !== 'conn' || seen.has(sec.id)) continue;
      const c = demo.model.cache.get(sec.id);
      if (!c) continue;
      seen.add(sec.id);
      const P0 = c.pieces[0].pts;
      let far = 0;
      for (const p of c.pieces) {
        for (let j = 0; j < p.pts.length; j += 2) far = Math.max(far, Math.hypot(p.pts[j] - P0[0], p.pts[j + 1] - P0[1]) * kmPerUnit(P0[1]));
      }
      conns++;
      if (far > 1.2) wide++;
    }
  }
  ok(conns >= 5, 'zu wenige Verbindungsfahrbahnen geprüft: ' + conns);
  ok(wide === 0, `Verbindungsfahrbahn läuft weiter als 1,2 km weg: ${wide} von ${conns}`);
}

// --- Keine Haarnadeln im gefahrenen Weg: Ortsbesuche (meist liegt der Knoten genau in der Ortsmitte, die Rampe
// verlässt die Autobahn also hinter ihr), Wenden an Kreuzen, Start im Ort. Eine Haarnadel: der Kurs dreht sich auf
// höchstens 400 m Weg um mehr als 150 Grad. Gewollte Wenden im Kreisverkehr einer Ortsdurchfahrt zählen nicht.
{
  let pins = 0;
  let km = 0;
  const towns = new Set();
  const where = [];
  for (let r = 0; r < 16; r++) {
    const R = rng(500 + r);
    const demo = new MapDemo({ start: Math.floor(R() * nodes.length), rng: R });
    // nahe Ziele (15–150 km), damit viele Orte angefahren werden
    const near = () => {
      const D = demo.trip.distances();
      const pool = places.filter((p) => D.toPlace(p.i).km > 15 && D.toPlace(p.i).km < 150);
      if (pool.length) demo.target(pool[Math.floor(R() * pool.length)].i);
      else demo.pickTarget();
    };
    near();
    const H = []; // [Kurs, Weg in km]
    let last = null;
    for (let k = 0; k < 6000; k++) {
      if (demo.trip.target < 0) near();
      demo.advance(30 / 15, 1 / 15);
      const P = demo.model.pose;
      if (demo.trip.section.kind === 'stadt') towns.add(demo.trip.section.id + ':' + r);
      if (demo.model.hop) {
        last = null;
        continue;
      }
      if (last) {
        const d = Math.hypot(P.x - last[0], P.y - last[1]) * kmPerUnit(P.y);
        if (d < 0.02) continue;
        if (d > 3) {
          last = null;
          H.length = 0;
          continue;
        }
        km += d;
        const h = Math.atan2(P.y - last[1], P.x - last[0]);
        H.push([h, d]);
        let acc = 0;
        for (let i = H.length - 2; i >= 0 && acc < 0.4; i--) {
          acc += H[i + 1][1];
          if (Math.abs(Math.atan2(Math.sin(h - H[i][0]), Math.cos(h - H[i][0]))) > (150 * Math.PI) / 180) {
            if (demo.trip.section.kind !== 'stadt') {
              pins++;
              where.push(demo.trip.section.kind + ' ' + Math.round(demo.trip.s));
            }
            H.length = 0;
            break;
          }
        }
      }
      last = [P.x, P.y];
    }
  }
  ok(km > 1000 && towns.size >= 16, `Haarnadel-Prüfung fährt zu wenig: ${km.toFixed(0)} km, ${towns.size} Ortsdurchfahrten`);
  ok(pins === 0, `Haarnadeln im Navi-Weg: ${pins} auf ${km.toFixed(0)} km (${where.slice(0, 6).join(', ')})`);
}

// --- Navi und Welt passen zusammen (COMMON.md §9) ------------------------------------------------------------
// 50 Fahrten mit dem gedachten Auto: jede Ansage nennt eine Stelle, die die Fahrt wirklich hat, in Metern der Fahrt
// (Ausfahrt: Gabelung, Ziel: Zielpunkt, Überfahrt: Terminal), mit den Texten der Schilder dort; Ausfahrten hinter
// dem Horizont liegen später genau dort, wo die Ansage sie versprach. Die Nahansicht zeichnet jede Fahrbahn dort,
// wo die Welt sie baut (trip.locate und trip.shears, Rampen im Bogen R(u)), und biegt sie sauber längs einer
// gewundenen Linie (Format von course.preview).
ok(fmtMeters(250) === '250 m' && fmtMeters(2400) === '2,4 km', 'Entfernungsangabe: ' + fmtMeters(250) + ' / ' + fmtMeters(2400));
{
  const { roadAhead, setRoadAhead, closeScene, curvePoint, STEP } = await import('../src/map/roadahead.js');
  const { J, R } = await import('../src/game/trip.js');
  const nodeTitleOf = (await import('../src/map/graph.js')).nodeTitle;
  const r = rng(77);
  const starts = nodes.map((n, i) => i).filter((i) => nodes[i].places.length && nodes[i].cc === 'DE');
  const n = { exit: 0, far: 0, farKept: 0, arrive: 0, transit: 0, then: 0, wende: 0, scenes: 0, roads: 0, ramps: 0, forks: 0, pins: 0, trips: 0 };
  const bad = [];
  const fail = (msg) => {
    if (bad.length < 12) bad.push(msg);
  };
  const near = (a, b, tol = 0.01) => Math.abs(a - b) <= tol;
  // X einer Linie der Nahansicht an der Stelle d (linear zwischen den Stützpunkten)
  const xAt = (pts, d) => {
    for (let i = 0; i + 3 < pts.length; i += 2) {
      if (pts[i] <= d && pts[i + 2] >= d) {
        const f = pts[i + 2] > pts[i] ? (d - pts[i]) / (pts[i + 2] - pts[i]) : 0;
        return pts[i + 1] + (pts[i + 3] - pts[i + 1]) * f;
      }
    }
    return NaN;
  };
  for (let t = 0; t < 50; t++) {
    const demo = new MapDemo({ start: starts[Math.floor(r() * starts.length)], rng: rng(900 + t) });
    const trip = demo.trip;
    const D = trip.distances();
    const pool = places.filter((p) => {
      const km = D.toPlace(p.i).km;
      return km > 20 && km < (t % 5 === 0 ? 900 : 160);
    });
    if (!pool.length) continue;
    demo.target(pool[Math.floor(r() * pool.length)].i);
    n.trips++;
    const promised = new Map(); // Knoten → {s, head}: Ausfahrten hinter dem Horizont
    for (let k = 0; k < 2600; k++) {
      demo.advance(16, 0.4);
      if (trip.target < 0) demo.target(pool[Math.floor(r() * pool.length)].i);
      // versprochene Ausfahrten: sobald die Gabelung angelegt ist, muss sie dort liegen
      for (const sec of trip.cur.sections) {
        const f = sec.fork;
        const pr = f && promised.get(f.node);
        if (!pr) continue;
        promised.delete(f.node);
        if (Math.abs(f.s - pr.s) > 1) fail(`Ausfahrt ${pr.head}: versprochen bei ${pr.s.toFixed(0)}, gebaut bei ${f.s.toFixed(0)}`);
        else n.farKept++;
      }
      if (k % 5) continue;
      const ins = demo.model.instruction();
      const g = trip.guidance();
      if (ins.turn === 'exit') {
        if (ins.fork) {
          n.exit++;
          const f = ins.fork;
          if (!near(ins.dist, f.s - trip.s)) fail(`Entfernung ${ins.dist} statt ${f.s - trip.s} zu ${ins.head}`);
          if (!trip.cur.sections.some((c) => c.fork === f) || f.taken) fail('Ansage meint eine Gabelung, die nicht vor uns liegt: ' + ins.head);
          if (!(f.forced || trip.planFor(f) === 'exit')) fail('Ansage zu einer Gabelung, an der die Route bleibt: ' + ins.head);
          const sg = trip.signs(f);
          if (ins.head !== sg.title) fail(`Name „${ins.head}“ ≠ Schild „${sg.title}“`);
          const th = g.then;
          if (th) {
            n.then++;
            // „dann wenden:“ genau dann, wenn die Route hinter der Ausfahrt dieselbe Straße in Gegenrichtung nimmt
            // (die steht auf keinem Schild der Gabelung); sonst steht das „dann …“ auf dem Schild
            if (th.wende) n.wende++;
            const hit =
              th.type === 'ziel' ? sg.places.includes(places[th.place].name) && ins.sub === 'dann zum Ziel ' + places[th.place].name
                : th.type === 'ab' || th.type === 'land'
                  ? th.wende
                    ? ins.sub === 'dann wenden: ' + th.road + ' Richtung ' + th.towards && th.road === deRoad(f.de).label && th.towards === deTowards(deRev(f.de)).name
                    : ins.sub === 'dann ' + th.road + ' Richtung ' + th.towards && sg.exits.some((e) => e.road === th.road && e.towards === th.towards)
                  : sg.exits.some((e) => e.kind === th.type && e.towards === nodes[th.to].name) && ins.sub.endsWith(' nach ' + nodes[th.to].name);
            if (!hit) fail(`„${ins.sub}“ steht nicht auf dem Schild ${sg.title}: ${JSON.stringify(sg.exits)}`);
          }
        } else {
          n.far++;
          if (!g.far || !near(ins.dist, g.dist)) fail('Ausfahrt hinter dem Horizont ohne Entfernung der Fahrt: ' + ins.head);
          if (ins.head !== nodeTitleOf(g.node) && ins.head !== 'Autobahnende') fail('Name hinter dem Horizont: ' + ins.head);
          promised.set(g.node, { s: trip.s + g.dist, head: ins.head });
        }
      } else if (ins.turn === 'arrive') {
        n.arrive++;
        const c = trip.cur.sections.find((q) => q.kind === 'stadt' && q.place === trip.target && !q.spotDone && q.s1 > trip.s);
        if (!c || !near(ins.dist, c.spotS - trip.s)) fail('Ziel-Entfernung ohne Zielpunkt: ' + ins.head);
        if (c && ins.head !== places[c.place].name) fail('Zielname ≠ Ortsschild: ' + ins.head);
      } else if (ins.turn === 'faehre' || ins.turn === 'zug' || ins.turn === 'flug') {
        n.transit++;
        const c = trip.cur.sections.find((q) => q.kind === 'term' && !q.arrival && q.transit === ins.turn && q.s1 > trip.s);
        if (!c || !near(ins.dist, (c.spotS ?? c.s0) - trip.s)) fail('Überfahrt ohne Terminal an der Stelle: ' + ins.head);
      } else if (ins.dist !== 0) fail(`Ansage ${ins.turn} „${ins.head}“ mit Entfernung ${ins.dist}, aber ohne Stelle`);
      // Nahansicht: jede Fahrbahn dort, wo die Welt sie baut
      if (k % 25) continue;
      n.scenes++;
      const sc = closeScene(trip, 2200, 500, ins);
      const sh = trip.shears();
      const world = (sec, so, x) => {
        const l = trip.locate(sec, so, x);
        const f = sh.get(l.frame);
        return f ? l.x + f.a + f.b * (so - trip.s) : NaN;
      };
      for (const rd of sc.roads) {
        if (!rd.sec) continue;
        n.roads++;
        const sec = rd.sec;
        const mid = rd.kind === 'rampe' ? 9 : rd.kind === 'stadt' ? 7.375 : 7.25;
        for (let q = 0; q < 6; q++) {
          const d = rd.pts[0] + ((rd.pts[rd.pts.length - 2] - rd.pts[0]) * q) / 5;
          const want = world(sec, trip.s + d, mid);
          if (Number.isFinite(want) && Math.abs(xAt(rd.pts, d) - want) > 0.05) fail(`${sec.kind} bei d=${d.toFixed(0)}: Nahansicht ${xAt(rd.pts, d).toFixed(2)} m, Welt ${want.toFixed(2)} m`);
        }
        // eine Rampe beginnt im Bogen der Gabelung: um R(u) neben dem Verzögerungsstreifen der Autobahn
        if (sec.kind === 'ramp' && sec.link) {
          const ab = sc.roads.find((q) => q.kind === 'ab');
          const u = 60;
          const d = sec.link.s + u - trip.s;
          if (ab && d > rd.pts[0] && d < rd.pts[rd.pts.length - 2] && d > ab.pts[0] && d < ab.pts[ab.pts.length - 2]) {
            const gap = xAt(rd.pts, d) - xAt(ab.pts, d);
            n.ramps++;
            if (!near(gap, J.L0 + R(u), 0.05)) fail(`Rampe ${u} m hinter der Gabelung ${gap.toFixed(2)} m neben der Autobahn statt ${(J.L0 + R(u)).toFixed(2)}`);
          }
        }
      }
      // die Route folgt an jeder Gabelung im Bild dem geplanten Zweig: Rampe bei „abfahren“, Autobahn bei „bleiben“
      const ab = sc.roads.find((q) => q.kind === 'ab' && q.role === 'cur');
      for (const c of trip.cur.sections) {
        const f = c.fork;
        if (!f || f.taken || !f.branch || !ab) continue;
        const d = f.s + 150 - trip.s;
        if (d < 0 || d > 2100) continue;
        const ramp = sc.roads.find((q) => q.sec === f.branch.sections[0]);
        const want = f.forced || trip.planFor(f) === 'exit' ? (ramp ? xAt(ramp.pts, d) : NaN) : xAt(ab.pts, d);
        const got = xAt(sc.route, d);
        if (!Number.isFinite(want)) continue;
        n.forks++;
        if (!near(got, want, 0.05)) fail(`Route an der Gabelung ${trip.signs(f).title}: ${got.toFixed(2)} m statt ${want.toFixed(2)} m (${trip.planFor(f)})`);
        break;
      }
      const pin = sc.marks.find((mk) => mk.type === 'pin');
      if (pin) {
        n.pins++;
        // Zielpunkt der Welt: der Ortsabschnitt, dessen Ziel noch aussteht (kommt dasselbe Ziel gleich nach der Ankunft
        // wieder, liegt der alte Abschnitt mit erledigtem Zielpunkt noch auf dem Weg)
        const c = trip.cur.sections.concat(...trip.paths().map((p) => p.path.sections)).find((q) => q.kind === 'stadt' && q.place === pin.place && q.spotS !== undefined && !q.spotDone);
        if (!c || !near(pin.d, c.spotS - trip.s)) fail('Zielfahne nicht am Zielpunkt der Fahrt');
      }
    }
  }
  ok(!bad.length, 'Navi und Welt: ' + bad.join(' | '));
  ok(n.trips >= 50 && n.exit > 200 && n.far > 50 && n.farKept > 20 && n.arrive > 50 && n.scenes > 2000 && n.roads > 6000 && n.ramps > 50 && n.forks > 300 && n.pins > 20, 'Navi und Welt: zu wenig geprüft ' + JSON.stringify(n));
  // Die Orte der XXL-Welt in der Nahansicht (towns.js naviLayout über setTownLayout, wie src/main.js es anschließt):
  // die Zielfahne steckt im Zielbrunnen auf der Insel des Straßenbaus (plan.js squareOf) statt am Zielpunkt davor,
  // der Platz liegt in jedem Ort der Nahansicht um seinen Brunnen und reicht bis an den Bordstein der geweiteten
  // Fahrbahn, Nebenstraßen gibt es keine. Die Route endet am Zielpunkt: von dort sind es längs höchstens 25 m bis
  // zur Mitte des Brunnens, der links neben der eigenen Spur steht (der haltende Wagen hat ihn schräg vor sich).
  {
    const { setTownLayout } = await import('../src/map/roadahead.js');
    const { naviLayout } = await import('../src/world/xxl/towns.js');
    const { squareOf } = await import('../src/world/xxl/plan.js');
    const { PROFILES } = await import('../src/game/trip.js');
    setTownLayout((trip, sec) => naviLayout(sec));
    const e = { trips: 0, scenes: 0, squares: 0, pins: 0 };
    const rt = rng(78); // eigener Zufall: die Fahrten der anderen Blöcke bleiben, wie sie sind
    for (let t = 0; t < 16; t++) {
      const demo = new MapDemo({ start: starts[Math.floor(rt() * starts.length)], rng: rng(1700 + t) });
      const trip = demo.trip;
      const D = trip.distances();
      const pool = places.filter((p) => {
        const km = D.toPlace(p.i).km;
        return km > 20 && km < 160;
      });
      if (!pool.length) continue;
      demo.target(pool[Math.floor(rt() * pool.length)].i);
      e.trips++;
      for (let k = 0; k < 2600 && trip.target >= 0; k++) {
        demo.advance(16, 0.4);
        if (k % 5) continue;
        e.scenes++;
        const sc = closeScene(trip, 2200, 500, demo.model.instruction());
        const sh = trip.shears();
        const world = (sec, so, x) => {
          const l = trip.locate(sec, so, x);
          const f = sh.get(l.frame);
          return f ? l.x + f.a + f.b * (so - trip.s) : NaN;
        };
        for (const tw of sc.towns) {
          const sq = squareOf(tw.sec);
          const q = tw.square;
          if (tw.streets.length) fail(`${places[tw.place].name}: Nebenstraßen im Navi, die der Ort nicht hat`);
          if (!sq || !q) {
            // ohne Insel (Startort) kein Platz; mit Insel fehlt er nur, wo die Straße dort noch nicht gezeichnet ist
            if (q || (sq && sq.s - trip.s > tw.pts[0] && sq.s - trip.s < tw.pts[tw.pts.length - 2])) fail(`${places[tw.place].name}: Platz des Navis ohne Insel der Welt oder umgekehrt`);
            continue;
          }
          e.squares++;
          if (!near(q.d, sq.s - trip.s) || !near(q.X, world(tw.sec, sq.s, sq.x)) || !near(q.r, sq.x - sq.aL)) fail(`${places[tw.place].name}: Platz des Navis nicht um die Insel der Welt`);
        }
        const pin = sc.marks.find((mk) => mk.type === 'pin');
        if (!pin) continue;
        e.pins++;
        const c = trip.cur.sections.concat(...trip.paths().map((p) => p.path.sections)).find((q) => q.kind === 'stadt' && q.place === pin.place && q.spotS !== undefined && !q.spotDone);
        const sq = c ? squareOf(c) : null;
        if (!sq || !near(pin.d, sq.s - trip.s) || !near(pin.X, world(c, sq.s, sq.x))) fail('Zielfahne nicht im Zielbrunnen der Welt');
        else if (!(sq.s - c.spotS > sq.r && sq.s - c.spotS <= 25 && sq.x + sq.r < PROFILES.stadt.lanes[0].x)) fail(`Zielbrunnen ${(sq.s - c.spotS).toFixed(1)} m hinter dem Zielpunkt, Mitte bei x ${sq.x.toFixed(1)}`);
        else if (sc.route.length >= 2 && sc.route[sc.route.length - 2] > c.spotS - trip.s + 0.01) fail('Route führt über den Zielpunkt hinaus');
      }
    }
    setTownLayout(null);
    ok(!bad.length, 'Orte im Navi: ' + bad.join(' | '));
    ok(e.trips >= 12 && e.scenes > 1000 && e.squares > 300 && e.pins > 30, 'Orte im Navi: zu wenig geprüft ' + JSON.stringify(e));
    console.log('  Orte im Navi (Platz und Zielbrunnen aus der XXL-Welt):', JSON.stringify(e));
  }
  // Ohne Ziel nennt das Navi nur eine Stelle, die die Straße erzwingt: das Autobahnende auf dem eigenen Weg – an der
  // Gabelung der Fahrt, mit dem Text des Schilds dort, ab 1000 m mit den Pfeilen aller Spuren, und die Nahansicht
  // führt dort die Rampe hinaus. Sonst nennt es keine Stelle, nur wo die Fahrt gerade ist (die erste Fahrt beginnt
  // wie die XXL-Welt in Erlensee).
  {
    const e = { trips: 0, ends: 0, said: 0, lanes: 0, scenes: 0, quiet: 0, onramp: 0 };
    for (let t = 0; t < 40; t++) {
      const demo = new MapDemo({ start: t ? starts[Math.floor(r() * starts.length)] : undefined, rng: rng(300 + t) });
      const trip = demo.trip;
      e.trips++;
      let last = null;
      for (let k = 0; k < 5000; k++) {
        demo.move(trip.s + 4);
        demo.model.update(0.1);
        const ins = demo.model.instruction();
        if (ins.turn === 'faehre' || ins.turn === 'zug' || ins.turn === 'flug') continue;
        const f = trip.cur.sections.map((c) => c.fork).find((q) => q && !q.taken && q.forced && q.s > trip.s);
        if (!f) {
          if (ins.turn !== 'none' || ins.dist !== 0 || ins.fork || ins.lanes) fail(`ohne Ziel und ohne Autobahnende: Ansage ${ins.turn} „${ins.head}“`);
          else e.quiet++;
          // die Auffahrt heißt nach der Autobahn, auf die sie führt (nicht nach der „Ausfahrt“ des Knotens)
          const sec = trip.section;
          if (sec.kind === 'auf') {
            const ab = trip.cur.sections.find((c) => c.s0 >= sec.s1 && c.kind === 'ab');
            e.onramp++;
            if (!ab || ins.head !== 'Auffahrt ' + deRoad(ab.de).label) fail(`Auffahrt ohne Ziel heißt „${ins.head}“`);
          }
          continue;
        }
        if (f !== last) e.ends++;
        last = f;
        e.said++;
        if (ins.turn !== 'exit' || ins.fork !== f || !near(ins.dist, f.s - trip.s)) fail(`Autobahnende ohne Ziel nicht an der Gabelung angesagt: ${ins.turn} „${ins.head}“ ${ins.dist}`);
        if (ins.head !== trip.signs(f).title || !ins.sub) fail(`Autobahnende ohne Ziel: „${ins.head}“ / „${ins.sub}“ statt Schild „${trip.signs(f).title}“`);
        if (trip.section.kind === 'ab' && ins.dist <= 1000) {
          e.lanes++;
          if (!ins.lanes || ins.lanes.use.length !== ins.lanes.n) fail('Autobahnende ohne Ziel: nicht alle Spuren führen hinaus');
        }
        if (k % 25 || ins.dist > 2000 || !f.branch) continue;
        const sc = closeScene(trip, 2200, 500, ins);
        const ramp = sc.roads.find((q) => q.sec === f.branch.sections[0]);
        const d = ins.dist + 150;
        const want = ramp ? xAt(ramp.pts, d) : NaN;
        if (!Number.isFinite(want)) continue;
        e.scenes++;
        if (!near(xAt(sc.route, d), want, 0.05)) fail(`Autobahnende ohne Ziel: Route ${xAt(sc.route, d).toFixed(2)} m statt auf der Rampe ${want.toFixed(2)} m`);
      }
    }
    ok(!bad.length, 'Navi ohne Ziel: ' + bad.join(' | '));
    ok(e.ends >= 5 && e.said > 1000 && e.lanes > 300 && e.scenes > 40 && e.quiet > 20000 && e.onramp > 500, 'Navi ohne Ziel: zu wenig geprüft ' + JSON.stringify(e));
    console.log('  Navi ohne Ziel: ' + JSON.stringify(e));
  }
  // die Linie des Adapters: ohne K2 gerade; eine gewundene Linie (Format von course.preview) biegt die Nahansicht
  // stetig und ohne Zucken, seitliche Lagen stehen senkrecht auf ihr
  const L0 = roadAhead({}, 0, 400);
  ok(L0.n === 41 && L0.x[10] === 0 && L0.z[10] === 100 && Number.isNaN(L0.psi), 'gerade Linie ohne K2');
  const wind = { n: 0, x: new Float64Array(301), z: new Float64Array(301), psi: 0.3 };
  {
    let x = 0;
    let z = 0;
    let th = 0;
    for (let i = 0; i <= 300; i++) {
      wind.x[i] = x;
      wind.z[i] = z;
      th += 0.004 * STEP * Math.sin(i / 23); // links und rechts im Wechsel, bis gut 25° je Bogen
      x -= Math.sin(th) * STEP;
      z += Math.cos(th) * STEP;
    }
    wind.n = 301;
  }
  setRoadAhead(() => wind);
  const W = roadAhead({}, 0, 3000);
  const a = [0, 0];
  const b = [0, 0];
  let worstStep = 0;
  let worstPerp = 0;
  let worstOn = 0;
  for (let d = 0; d < 2980; d += 1) {
    curvePoint(W, d, 0, a);
    curvePoint(W, d + 1, 0, b);
    worstStep = Math.max(worstStep, Math.hypot(b[0] - a[0], b[1] - a[1]));
    if (d % STEP === 0) worstOn = Math.max(worstOn, Math.hypot(a[0] - W.x[d / STEP], a[1] - W.z[d / STEP]));
    curvePoint(W, d, 12, b);
    worstPerp = Math.max(worstPerp, Math.abs(Math.hypot(b[0] - a[0], b[1] - a[1]) - 12));
  }
  setRoadAhead(null);
  ok(worstStep < 1.02 && worstOn < 1e-9 && worstPerp < 1e-6, `gewundene Linie: Schritt ${worstStep.toFixed(3)}, auf der Linie ${worstOn}, senkrecht ${worstPerp}`);
  console.log('  Navi und Welt: ' + JSON.stringify(n));
}

// --- Schräge Karte im Navi: die Ausschnitte decken den Boden immer, ohne dass ein Bild auf sie wartet ------------
// Fahrten mit dem echten NaviScreen auf einer Leinwand, die nichts malt (WebGL als Attrappe). Schlechtester Fall:
// genau ein Stück je Bild (budget 0). Gezählt wird in jedem Bild der Kartenansicht, ob der vordere Ausschnitt oder die
// Reserve den sichtbaren Boden deckt; nur das erste Bild einer Fahrt darf alles auf einmal rechnen.
{
  const { Trip, J } = await import('../src/game/trip.js');
  const { NavModel } = await import('../src/map/navroute.js');
  const { NaviScreen, FOG_Y } = await import('../src/map/navview.js');
  const { Warp } = await import('../src/map/warp.js');
  const { findPlace } = await import('../src/map/graph.js');
  const keep = { O: globalThis.OffscreenCanvas, P: globalThis.Path2D, create: Warp.create };
  const nop = () => {};
  const ctxOf = (canvas) =>
    new Proxy({ canvas }, {
      get: (t, k) => (k in t ? t[k] : k === 'measureText' ? (s) => ({ width: String(s).length * 9 }) : k === 'createLinearGradient' ? () => ({ addColorStop: nop }) : nop),
      set: (t, k, v) => ((t[k] = v), true),
    });
  globalThis.OffscreenCanvas = class { constructor(w, h) { this.width = w; this.height = h; } getContext() { return ctxOf(this); } };
  globalThis.Path2D = class {};
  for (const k of ['moveTo', 'lineTo', 'closePath', 'quadraticCurveTo', 'bezierCurveTo', 'arc', 'ellipse', 'rect']) globalThis.Path2D.prototype[k] = nop;
  const up = [0, 0];
  // je Bild prüft die Attrappe, was der Shader rechnen würde: Bildpunkt → Boden → Ausschnitt muss dort landen, wo
  // TiltView.toWorld den Kartenpunkt sieht
  let cur = null;
  let worstWarp = 0;
  const probe = (cam, L) => {
    if (!cur || res.frames % 25) return;
    const tv = cur.tv;
    for (const [i, l] of L.entries()) {
      const lv = cur.painter.lv[i];
      if (!l || !lv) continue;
      for (const [x, y] of [[10, 560], [326, 397], [640, 250], [200, 170]]) {
        const u = cam.oy - y;
        const den = cam.c - u * cam.k;
        const gz = u / den;
        const gx = ((x - cam.ox) * cam.c) / den;
        const w = tv.toWorld(x, y, [0, 0]);
        const e = Math.hypot(l.p0[0] + l.a[0] * gx + l.b[0] * gz - (w[0] - lv.x0) * lv.kc, l.p0[1] + l.a[1] * gx + l.b[1] * gz - (w[1] - lv.y0) * lv.kc);
        worstWarp = Math.max(worstWarp, e);
      }
    }
  };
  Warp.create = () => ({ ready: true, resize: nop, upload: (i) => ((up[i] += 1), true), draw: (cam, ps, L) => (probe(cam, L), { width: 1, height: 1 }) });
  const res = { frames: 0, map: 0, reserveOnly: 0, uncovered: 0, blocked: 0, hop: 0 };
  const W = 1024 - 372;
  const H = 640 - 64;
  const drive = (target, seed, frames, before) => {
    let s0 = seed;
    const trip = new Trip({ rng: () => ((s0 = (s0 * 16807) % 2147483647) / 2147483647) });
    const nav = new NavModel(trip);
    trip.setTarget(findPlace(target));
    const navi = new NaviScreen();
    navi.budget = 0;
    cur = navi;
    const P = navi.painter;
    let tiles = 0;
    const rs = P.renderStatic.bind(P);
    P.renderStatic = (...a) => (tiles++, rs(...a));
    const st = { dark: false, nav: { model: nav, bidder: '', bid: '', clockMin: 600, visible: true, visited: {} } };
    let x = J.L0;
    let drawn = 0;
    for (let i = 0; i < 200000 && drawn < frames; i++) {
      const sec = trip.section;
      const sp = sec.kind === 'stadt' ? 13 : sec.kind === 'ab' ? 36 : sec.kind === 'land' ? 24 : 20;
      const s = trip.s + sp / 15;
      if (sec.kind === 'ab') {
        const f = sec.fork;
        if (f && !f.taken && f.s - s < J.decel - 20) x = trip.planFor(f) === 'exit' ? J.L0 : 5.625;
        else if (s - sec.s0 > J.accel) x = 5.625;
      } else x = J.L0;
      const p0 = trip.profile(s);
      x = Math.min(Math.max(x, p0.xmin), p0.xmax);
      trip.update(s, x);
      nav.update(1 / 15);
      if (before && before(nav)) continue;
      before = null;
      const t0 = tiles;
      navi.draw(ctxOf({ width: 1024, height: 640 }), 0, 0, W, H, st, 1 / 15);
      if (drawn++ > 0 && tiles - t0 > 1) res.blocked++;
      res.frames++;
      if (nav.hop) res.hop++;
      if (navi.closeW >= 1 || drawn === 1) continue;
      res.map++;
      const box = navi.tv.bounds(16, FOG_Y[0] + 12);
      const m = Math.max(box[2] - box[0], box[3] - box[1]) * 0.02;
      const covers = (c) => !!c && box[0] >= c.x0 - m && box[1] >= c.y0 - m && box[2] <= c.x1 + m && box[3] <= c.y1 + m;
      if (!covers(P.lv[0]) && !covers(P.lv[1])) res.uncovered++;
      else if (!covers(P.lv[0])) res.reserveOnly++;
    }
  };
  drive('Hamburg', 3, 6000);
  // Fähre Kiel–Oslo: ab 3 km vor dem Terminal mit Bild, über die Überfahrt hinweg (Hinauszoomen auf ihren Maßstab)
  drive('Oslo', 3, 1800, (nav) => !(nav.instruction().turn === 'faehre' && nav.instruction().dist < 3000));
  ok(res.map > 500 && res.hop > 40, 'schräge Karte: zu wenig Kartenbilder/Überfahrt geprüft ' + JSON.stringify(res));
  ok(res.uncovered === 0, 'schräge Karte: Boden ohne Ausschnitt ' + JSON.stringify(res));
  ok(res.blocked === 0, 'schräge Karte: ein Bild rechnete mehr als ein Stück ' + JSON.stringify(res));
  ok(res.reserveOnly > 0 && up[1] > 0, 'schräge Karte: Reserve nie gebraucht ' + JSON.stringify(res));
  ok(worstWarp > 0 && worstWarp < 1e-6, 'schräge Karte: Shader legt den Ausschnitt falsch (' + worstWarp + ' px)');
  console.log('  schräge Karte: ' + JSON.stringify({ ...res, uploads: up, shader: +worstWarp.toExponential(1) }));

  // Adapter auf course.preview (Paket K2), so umgeleitet wie in src/main.js: Format und Länge der Linie, das Navi
  // zeichnet ohne Fehler, und die Übergabe zwischen Karte und Nahansicht stimmt am Auto (die gedrehte Karte führt ihre
  // Straße dort nach vorn, wie die Linie der Welt) – eine Fahrt mit course.fill vor jedem Bild (wie die Welt), eine
  // ohne (preview rechnet dann aus den Profilen)
  if (existsSync(new URL('../src/game/course.js', import.meta.url))) {
    const { Course, MapPlanner } = await import('../src/game/course.js');
    const G = await import('../src/map/graph.js');
    const shapes = await import('../src/map/shapes.js');
    const { roadAhead, setRoadAhead, closeScene, curvePoint, STEP } = await import('../src/map/roadahead.js');
    const course = new Course({ planner: new MapPlanner({ graph: G, shapes }) });
    setRoadAhead((trip, s, dMax) => course.preview(trip, s, dMax));
    cur = null;
    const k2 = { frames: 0, lines: 0, bad: 0, nan: 0, dpsi: [] };
    const P = [0, 0];
    for (const [target, seed, fill] of [['Hamburg', 5, true], ['München', 6, false]]) {
      let s0 = seed;
      const trip = new Trip({ rng: () => ((s0 = (s0 * 16807) % 2147483647) / 2147483647) });
      const nav = new NavModel(trip);
      trip.setTarget(findPlace(target));
      const navi = new NaviScreen();
      const st = { dark: false, nav: { model: nav, bidder: '', bid: '', clockMin: 600, visible: true, visited: {} } };
      let x = J.L0;
      for (let i = 0; i < 2400; i++) {
        const sec = trip.section;
        const s = trip.s + (sec.kind === 'stadt' ? 13 : sec.kind === 'ab' ? 36 : sec.kind === 'land' ? 24 : 20) / 15;
        if (sec.kind === 'ab') {
          const f = sec.fork;
          if (f && !f.taken && f.s - s < J.decel - 20) x = trip.planFor(f) === 'exit' ? J.L0 : 5.625;
          else if (s - sec.s0 > J.accel) x = 5.625;
        } else x = J.L0;
        const p0 = trip.profile(s);
        trip.update(s, Math.min(Math.max(x, p0.xmin), p0.xmax));
        nav.update(1 / 15);
        if (fill) course.fill(trip, trip.s, null, 1 / 15);
        navi.draw(ctxOf({ width: 1024, height: 640 }), 0, 0, W, H, st, 1 / 15);
        k2.frames++;
        if (i % 20) continue;
        const L = roadAhead(trip, trip.s, 3000);
        k2.lines++;
        if (L.n !== 3000 / STEP + 1 || Math.abs(L.x[0]) + Math.abs(L.z[0]) > 0.01 || Math.abs(L.z[1] - STEP) > 1 || !Number.isFinite(L.psi)) k2.bad++;
        for (const r of closeScene(trip, 2200, 500, nav.instruction()).roads) {
          for (let j = 0; j + 1 < r.pts.length; j += 2) if (!curvePoint(L, r.pts[j], r.pts[j + 1], P).every(Number.isFinite)) k2.nan++;
        }
        if (trip.section.kind === 'ab' && !nav.hop) {
          // Richtung der Straße am Auto: auf der Karte (über die Sehne des Navis, gedreht wie gezeichnet) und in der
          // Nahansicht (Linie der Welt); 0 = nach vorn
          const d = nav.cur.dirAt(nav.pose.a, Math.max(nav.chordKm, 0.15) / kmPerUnit(nav.pose.y), [0, 0]);
          const a = Math.atan2(d[1], d[0]) + navi.view.rot + Math.PI / 2 - Math.atan2(L.x[1] - L.x[0], L.z[1] - L.z[0]);
          k2.dpsi.push(Math.abs(Math.atan2(Math.sin(a), Math.cos(a))));
        }
      }
    }
    setRoadAhead(null);
    k2.dpsi.sort((a, b) => a - b);
    const med = k2.dpsi.length ? (k2.dpsi[k2.dpsi.length >> 1] * 180) / Math.PI : NaN;
    ok(k2.lines > 200 && k2.bad === 0 && k2.nan === 0, 'K2-Adapter: Linie von course.preview passt nicht ' + JSON.stringify({ ...k2, dpsi: k2.dpsi.length }));
    ok(k2.dpsi.length > 50 && med < 2, 'K2-Adapter: Karte und Nahansicht zeigen am Auto in verschiedene Richtungen (Median ' + med + '°)');
    console.log('  K2-Adapter (course.preview): ' + JSON.stringify({ frames: k2.frames, lines: k2.lines, headings: k2.dpsi.length, medianDeg: +med.toFixed(2) }));
  } else console.log('  K2-Adapter: übersprungen (src/game/course.js kommt mit ausbau)');
  // --- Ein Name je Ort (COMMON.md §9.4): Navi und Schilder zeigen denselben, unverwechselbaren Namen ---------------
  // Der Name eines Orts ist überall der der Karte (places[].name) mit allem, was Orte auseinanderhält: „Frankfurt
  // (Oder)“ ist nicht „Frankfurt“ (das wäre in diesem Spiel Frankfurt am Main). Kürzen darf nur die Schrift: kleiner
  // setzen, zuletzt Auslassungspunkte am Ende, und davor bleibt stehen, was den Ort von jedem anderen unterscheidet.
  // Für alle Orte der Karte: Ortstafel, Ortsende und Zielschild des Schilderplans nennen den Namen, die Tafel bricht
  // ihn höchstens um; das Navi zeigt ihn im Kärtchen und in der Ansage der Ankunft ungekürzt (neben der breitesten
  // Angabe rechts bzw. der längsten Entfernung), in der Nebenzeile „dann zum Ziel …“ neben fünf Spurpfeilen und im
  // Routenstreifen höchstens hinter dem Stück gekürzt, das ihn eindeutig macht; die große Karte führt denselben Namen.
  // Die Ansage im HUD (Drohnenansicht, schmale Formate) bricht lange Zeilen um und kürzt nie (docs/style.css).
  // Kein Modul der XXL-Welt ruft die Kurznamen des klassischen Spiels (shortName, signName), die Zusätze streichen.
  // Schriftbreiten schätzt eine Tabelle nach oben ab (je Zeichen das breitere aus Arial fett und Inter fett, der
  // Ersatzschrift ohne Helvetica und Arial, dazu 2 %; im Browser misst die Leinwand). Der Ort aus dem Stadtbaukasten
  // heißt ebenso (tools/citykit-test.mjs).
  {
    const { splitName } = await import('../src/world/xxl/signs.js');
    const { sectionSigns } = await import('../src/world/xxl/signplan.js');
    const { fit } = await import('../src/map/symbols.js');
    const names = places.map((p) => p.name);
    ok(new Set(names).size === names.length, 'Ortsnamen: zwei Orte heißen gleich');
    const lcp = (a, b) => {
      let i = 0;
      while (i < a.length && i < b.length && a[i] === b[i]) i++;
      return i;
    };
    // so viele Zeichen vom Anfang machen den Namen eindeutig (mehr als er hat: er darf nie gekürzt werden)
    const keepLen = names.map((a, i) => 1 + Math.max(...names.map((b, j) => (i === j ? 0 : lcp(a, b)))));
    const EM = new Map();
    const put = (chars, w) => {
      for (const c of chars) EM.set(c, w);
    };
    put(' ', 0.28);
    put("ilIî.,:;'!|·", 0.34);
    put('jtfr()', 0.41);
    put('-/', 0.47);
    put('abcdeghknopqsuvxyzàãäèéöüß', 0.66);
    put('w', 0.85);
    put('m', 0.92);
    put('ABCDEFHJKLNPRSTUVXYZÄÈÜ', 0.77);
    put('GOQÖ', 0.78);
    put('M', 0.94);
    put('W', 1.04);
    put('0123456789', 0.68);
    put('–', 0.56);
    put('…', 1.01);
    const emOf = (text) => {
      let w = 0;
      for (const c of text) w += EM.get(c) ?? (c.codePointAt(0) > 0x2000 ? 1.4 : 0.74);
      return w;
    };
    const texts = [];
    const ctx = new Proxy({ font: '10px x' }, {
      get: (t, k) => (k in t ? t[k] : k === 'measureText' ? (s) => ({ width: emOf(String(s)) * parseFloat(/([\d.]+)px/.exec(t.font)[1]) * 1.02 }) : k === 'fillText' ? (s) => void texts.push(String(s)) : k === 'createLinearGradient' ? () => ({ addColorStop: nop }) : nop),
      set: (t, k, v) => ((t[k] = v), true),
    });
    // ganz gezeigt, oder am Ende gekürzt hinter einem Anfang, der den Namen eindeutig macht
    const shown = (text, i) => {
      const name = names[i];
      if (text.includes(name)) return true;
      if (!text.endsWith('…')) return false;
      for (let n = name.length - 1; n >= keepLen[i]; n--) if (text.endsWith(name.slice(0, n) + '…')) return true;
      return false;
    };
    const trip = new Trip({});
    const nav = new NavModel(trip);
    const navi = new NaviScreen();
    const st = { bidder: '', bid: '', clockMin: 23 * 60 };
    const e = { places: 0, card: 0, split: 0, subCut: 0, stripCut: 0, noRoute: 0 };
    const wrong = [];
    for (const p of places) {
      const i = p.i;
      const name = p.name;
      e.places++;
      // Welt: Ortstafel, Ortsende, Zielschild
      const sec = { kind: 'stadt', place: i, s0: 1000, s1: 1500, spotS: 1300, node: 0, frame: 1 };
      const sg = sectionSigns(null, [sec], sec, [], { tables: false, target: i });
      if (!['ort', 'ortsende', 'ziel'].every((kind) => sg.some((q) => q.kind === kind && q.texts.length === 1 && q.texts[0] === name))) wrong.push(`${name}: Schilderplan nennt ihn anders`);
      const lines = splitName(name);
      if (lines.length > 1) e.split++;
      // umbrochen an einem Leerzeichen (es entfällt) oder hinter einem Bindestrich (er bleibt): sonst fehlt kein Zeichen
      if (lines.length > 2 || (lines.join(' ') !== name && lines.join('') !== name) || lines.some((ln) => !ln || ln !== ln.trim())) wrong.push(`${name}: Ortstafel zeigt „${lines.join(' / ')}“`);
      if (PLACE_BY_INDEX[i].name !== name) wrong.push(`${name}: große Karte nennt ihn „${PLACE_BY_INDEX[i].name}“`);
      // Navi: Ansage der Ankunft mit der längsten Entfernung davor
      texts.length = 0;
      navi.drawBanner(ctx, { turn: 'arrive', dist: 1900, head: name, sub: 'Ziel liegt in der Ortsmitte', lanes: null }, W, 'light', null);
      if (!texts.includes(name)) wrong.push(`${name}: Ansage der Ankunft zeigt „${texts.find((q) => q.includes(name.slice(0, 3)))}“`);
      // Nebenzeile vor der Ausfahrt des Ziels, neben fünf Spurpfeilen
      texts.length = 0;
      navi.drawBanner(ctx, { turn: 'exit', dist: 950, head: 'Ausfahrt', sub: 'dann zum Ziel ' + name, lanes: { n: 5, use: [4], exit: true } }, W, 'light', null);
      const sub = texts.find((q) => q.startsWith('dann zum Ziel '));
      if (!sub || !shown(sub, i)) wrong.push(`${name}: Nebenzeile zeigt „${sub}“`);
      else if (!sub.includes(name)) e.subCut++;
      // Routenstreifen (Orte unterwegs, höchstens 150 Bildpunkte)
      ctx.font = '600 16px x';
      const stop = fit(ctx, name, 150);
      if (!shown(stop, i)) wrong.push(`${name}: Routenstreifen zeigt „${stop}“`);
      else if (stop !== name) e.stripCut++;
      // Kärtchen unten: der ganze Name neben der breitesten Angabe rechts
      trip.setTarget(i);
      nav.update(0.1);
      if (!nav.route || trip.target !== i) {
        e.noRoute++;
        continue;
      }
      texts.length = 0;
      navi.drawBottom(ctx, nav, { ...nav.instruction(), turn: 'straight', mapKm: 8888, mins: 59 }, st, W, H, 'light');
      const card = texts.find((q) => q.startsWith('🏁 '));
      if (card !== '🏁 ' + name) wrong.push(`${name}: Kärtchen zeigt „${card}“ neben „${texts.find((q) => q.includes('Ankunft'))}“`);
      else e.card++;
    }
    ok(!wrong.length, 'Ein Name je Ort: ' + wrong.slice(0, 12).join(' | '));
    ok(e.places === 426 && e.card >= 420 && e.noRoute <= 3 && e.split > 20, 'Ein Name je Ort: zu wenig geprüft ' + JSON.stringify(e));
    // die Kurznamen des klassischen Spiels streichen Zusätze („Frankfurt (Oder)“ → „Frankfurt“): Navi, Karte, Schilder
    // und Orte der XXL-Welt rufen sie nicht
    const src = (f) => readFileSync(new URL('../src/' + f, import.meta.url), 'utf8');
    const callers = ['map/navroute.js', 'map/navview.js', 'map/mapview.js', 'map/roadahead.js', 'map/symbols.js', 'ui/mapscreen.js', 'world/xxl/signplan.js', 'world/xxl/signs.js', 'world/xxl/towns.js', 'world/xxl/world.js']
      .filter((f) => /\b(shortName|signName)\(/.test(src(f)));
    ok(!callers.length, 'Ein Name je Ort: Kurznamen des klassischen Spiels in ' + callers.join(', '));
    // die Ansage im HUD steht auf dem Handy in einer Spalte von rund 240 Bildpunkten: dort passt kaum ein Name in eine
    // Zeile. Weder ihre Regel noch die ihres Texts hält ihn deshalb in einer Zeile oder setzt Auslassungspunkte
    const css = readFileSync(new URL('../docs/style.css', import.meta.url), 'utf8');
    const rule = (sel) => (css.match(new RegExp('^' + sel.replace(/\./g, '\\.') + ' \\{([^}]*)\\}', 'm')) || [])[1] || '';
    ok(/overflow-wrap: anywhere/.test(rule('.navi-turn-text')) && !/nowrap|text-overflow|line-clamp/.test(rule('.navi-turn') + rule('.navi-turn-text')), 'Ein Name je Ort: die Ansage im HUD kürzt den Namen (.navi-turn in docs/style.css)');
    console.log('  Ein Name je Ort: ' + JSON.stringify(e));
  }
  globalThis.OffscreenCanvas = keep.O;
  globalThis.Path2D = keep.P;
  Warp.create = keep.create;
}

// --- Spielstand: alte Stände laden mit leeren Besuchen, Besuche zählen -----------------------------------------
{
  const store = new Map();
  globalThis.localStorage = { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k) };
  const { loadSave, storeSave } = await import('../src/save.js');
  store.set('mini-adam-tesla-navi-v1', JSON.stringify({ wallet: 12.5, upgrades: { akku: 1 }, stats: { runs: 3, totalKm: 42 } }));
  const old = loadSave();
  ok(old.wallet === 12.5 && old.stats.totalKm === 42 && old.upgrades.akku === 1, 'alter Spielstand verliert Werte');
  ok(old.visits && Object.keys(old.visits).length === 0, 'alter Spielstand: Besuche nicht leer');
  // recordVisit/visitSummary ohne DOM (mapscreen.js braucht für sie nur den Spielstand)
  globalThis.document = undefined;
  const { recordVisit, visitSummary } = await import('../src/ui/mapscreen.js');
  const ffm = places.findIndex((p) => p.name === 'Frankfurt am Main');
  recordVisit(old, ffm);
  recordVisit(old, ffm);
  recordVisit(old, places.findIndex((p) => p.cc !== 'DE'));
  ok(old.visits['Frankfurt am Main'] === 2, 'Besuche werden gezählt');
  storeSave(old);
  const again = loadSave();
  const sum = visitSummary(again.visits);
  ok(sum.idx.length === 2 && sum.countries === 2, 'Besuche nach dem Laden: ' + JSON.stringify(sum));
}

if (fails) {
  console.log(fails + ' Fehler');
  process.exit(1);
}
console.log('Karte in Ordnung');
