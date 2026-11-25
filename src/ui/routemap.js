// Die Route des Tages im Abspann der Reise: die Karte des Spiels (derselbe Zeichner wie die große Karte, mapview.js:
// Land, Straßen, Orte und Namen), darauf der Weg, den der Wagen in diesem Stream wirklich gefahren ist (der gefahrene
// Weg des Navis), der Start im Startort des Streams, jede BrunnenTV-Folge mit ihrer Nummer, jeder Ladestopp mit dem Stecker wie im
// Navi und das Auto am Ende. Der Ausschnitt passt sich der Route an, in einer Maßstabsstufe der großen Karte (gleiche
// Punkte, gleiche Namen wie dort).
import { MapPainter, THEMES, bucketScale, project, spotBox, dotRadius, PLACE_BY_INDEX, menuLayoutOf, isCity, placeLabel } from '../map/mapview.js';
import { drawCar, drawTurnIcon, FONT } from '../map/symbols.js';

const PAD = 30; // Rand um die Route (CSS-Bildpunkte): Platz für Marken und Auto
const EDGE = 3; // Namen bleiben so weit vom Rand der Karte …
const CORNER = 14; // … und aus ihren runden Ecken (style.css .route-map-wrap border-radius)
const CAR_R = 12; // halbe Breite des Autos (drawCar mit 20 Bildpunkten) für die Namen, die ihm ausweichen
const MIN_B = 4; // gröbste Stufe (ganz Europa auf einer Handbreit)
const MAX_B = 19; // feinste Stufe: auch eine kurze Route zeigt noch die Gegend
const START = project(50.2276, 8.9576); // Erlensee, falls der Weg leer ist und kein Startort dabei steht
// Farben der Marken: Brunnenblau wie „BrunnenTV XXL“ im Titel, Grün wie der Ladestopp im Navi
const TV_BLUE = '#1f8fd8';
const PARK_GREEN = '#2f8f4e';

let painter = null;

/** Rahmen der Route in Karteneinheiten: [x0, y0, x1, y1] über Weg und Marken (null, wenn nichts da ist). */
function bounds(route) {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  const add = (x, y) => {
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    x0 = Math.min(x0, x);
    y0 = Math.min(y0, y);
    x1 = Math.max(x1, x);
    y1 = Math.max(y1, y);
  };
  const L = route.line || [];
  for (let i = 0; i < L.length; i += 2) add(L[i], L[i + 1]);
  for (const m of route.marks || []) add(m.x, m.y);
  return x0 <= x1 ? [x0, y0, x1, y1] : null;
}

/** Erster und letzter Punkt des Wegs, dazu die Richtung am Ende (für das Auto). */
function ends(L) {
  let first = null;
  let last = null;
  let prev = null;
  for (let i = 0; i < L.length; i += 2) {
    if (!Number.isFinite(L[i])) continue;
    const p = [L[i], L[i + 1]];
    if (!first) first = p;
    if (last && (last[0] !== p[0] || last[1] !== p[1])) prev = last;
    last = p;
  }
  return { first, last, prev };
}

/**
 * Ausschnitt der Karte für eine Route (ohne Leinwand, läuft auch unter Node): w × h CSS-Bildpunkte; route = { line:
 * [x, y, …] Karteneinheiten (NaN: Sprung übers Wasser), marks: [{ type: 'brunnen' | 'laden', n, x, y }], home: Index
 * des Startorts in places }. Ergebnis:
 * Maßstabsstufe b, Maßstab s (CSS-Bildpunkte je Einheit), linke obere Ecke (wx, wy), X/Y (Karte → Bild), die Marken
 * (items: Start, Ladestopps, Folgen mit Lage x, y, ihrer Stelle x0, y0 und Halbmesser r), das Auto (car, Richtung a).
 */
export function routeView(route, w, h, { turn = 0 } = {}) {
  const L = route.line || [];
  // ohne gefahrenen Weg: der Startort (route.home, Index in places), wo der Wagen noch steht
  const home = PLACE_BY_INDEX[route.home] || START;
  const box = bounds(route) || [home.x, home.y, home.x, home.y];
  const bw = Math.max(box[2] - box[0], 1e-4);
  const bh = Math.max(box[3] - box[1], 1e-4);
  // die feinste Stufe der großen Karte, in der die Route samt Rand ins Bild passt
  const fit = Math.min((w - 2 * PAD) / bw, (h - 2 * PAD) / bh);
  const b = Math.min(MAX_B, Math.max(MIN_B, Math.floor(Math.log2(Math.max(fit, 1)) * 2)));
  const s = bucketScale(b);
  const wx = (box[0] + box[2]) / 2 - w / 2 / s;
  const wy = (box[1] + box[3]) / 2 - h / 2 / s;
  const X = (x) => (x - wx) * s;
  const Y = (y) => (y - wy) * s;
  // Marken: der Start, dann die Ladestopps, darüber die Folgen. Was sich deckt (auch mit dem Auto am Ende), rückt ein
  // Stück zur Seite und zeigt mit einem dünnen Strich auf seine Stelle.
  const { first, last, prev } = ends(L);
  const car = last ? { x: X(last[0]), y: Y(last[1]), a: prev ? Math.atan2(last[0] - prev[0], -(last[1] - prev[1])) : 0 } : null;
  const placed = car ? [[car.x, car.y]] : [];
  const items = [];
  const put = (type, mx, my, data = {}) => {
    const x = X(mx);
    const y = Y(my);
    let px = x;
    let py = y;
    for (let k = 0; k < 12 && placed.some((q) => Math.hypot(q[0] - px, q[1] - py) < 22); k++) {
      const a = -Math.PI / 4 + (k + turn) * 1.1;
      px = x + Math.cos(a) * 21 * (1 + k * 0.15);
      py = y + Math.sin(a) * 21 * (1 + k * 0.15);
    }
    placed.push([px, py]);
    // Halbmesser samt weißem Rand (Start 9 + 1,5; Marken 11 oder 13 + 1,25)
    const r = type === 'start' ? 10.5 : type === 'brunnen' && String(data.n).length > 2 ? 14.5 : 12.5;
    items.push({ type, ...data, x0: x, y0: y, x: px, y: py, r });
  };
  const st = first || [home.x, home.y];
  put('start', st[0], st[1]);
  const marks = (route.marks || []).filter((m) => Number.isFinite(m.x) && Number.isFinite(m.y));
  for (const m of marks) if (m.type === 'laden') put('laden', m.x, m.y);
  for (const m of marks) if (m.type === 'brunnen') put('brunnen', m.x, m.y, { n: m.n });
  return { w, h, b, s, wx, wy, X, Y, items, car };
}

/**
 * Welche Namen und Schilder der großen Karte (layout = menuLayout der Stufe: labels nach Vorrang, shown = Orte mit
 * Punkt) die Routenkarte zeigt und wo. Sie stehen über dem Weg (mit ihrem hellen Rand lesbar), aber ganz im Bild und
 * in seinen runden Ecken, frei von Marken, Auto, Ortspunkten und einander: Ein verdeckter Ortsname versucht die anderen
 * Seiten seines Punkts, sonst bleibt er weg. Geprüft wird wie in menuLayout: der Kasten selbst gegen Punkte (um 1
 * vergrößert) und gesetzte Kästen (um 2 × 1). Ergebnis: Map Name → [x0, y0] (linke obere Ecke, CSS-Bildpunkte).
 */
export function routeLabels(v, layout) {
  const { w, h, s, X, Y } = v;
  const taken = []; // [x0, y0, x1, y1, Ort des Punkts (sein eigener Name steht daneben)]
  const free = (x0, y0, x1, y1, own) => !taken.some((q) => q[4] !== own && x0 < q[2] && x1 > q[0] && y0 < q[3] && y1 > q[1]);
  for (const i of layout.shown) {
    const p = PLACE_BY_INDEX[i];
    const r = dotRadius(p, s) + 1;
    const x = X(p.x);
    const y = Y(p.y);
    if (x > -r && y > -r && x < w + r && y < h + r) taken.push([x - r, y - r, x + r, y + r, i]);
  }
  for (const it of v.items) {
    taken.push([it.x - it.r, it.y - it.r, it.x + it.r, it.y + it.r]);
    if (it.x !== it.x0 || it.y !== it.y0) taken.push([it.x0 - 5, it.y0 - 5, it.x0 + 5, it.y0 + 5]);
  }
  if (v.car) taken.push([v.car.x - CAR_R, v.car.y - CAR_R, v.car.x + CAR_R, v.car.y + CAR_R]);
  const inside = (x0, y0, x1, y1) => {
    if (x0 < EDGE || y0 < EDGE || x1 > w - EDGE || y1 > h - EDGE) return false;
    // in den runden Ecken muss auch die Ecke des Kastens im Bogen liegen
    for (const [px, py] of [[x0, y0], [x1, y0], [x0, y1], [x1, y1]]) {
      const qx = Math.min(Math.max(px, CORNER), w - CORNER);
      const qy = Math.min(Math.max(py, CORNER), h - CORNER);
      if (Math.hypot(px - qx, py - qy) > CORNER - EDGE) return false;
    }
    return true;
  };
  // Liegt eine Marke oder das Auto auf dem Ortspunkt (die Folge in ihrem Ort), rückt sein Name um sie herum
  const cover = (x, y, r) => {
    let R = r;
    for (const [mx, my, mr] of v.items.map((it) => [it.x, it.y, it.r]).concat(v.car ? [[v.car.x, v.car.y, CAR_R]] : [])) {
      const d = Math.hypot(mx - x, my - y);
      if (d < mr + r) R = Math.max(R, d + mr);
    }
    return R;
  };
  const out = new Map();
  // Großstädte (isCity) zuerst: Ihr Name hält Weg und Gegend lesbar, ein kleinerer Ort nimmt ihm keinen Platz
  const city = (l) => l.kind === 'place' && isCity(PLACE_BY_INDEX[l.i]);
  for (const l of [...layout.labels.filter(city), ...layout.labels.filter((q) => !city(q))]) {
    const x0 = X(l.x) + l.dx;
    const y0 = Y(l.y) + l.dy;
    if (x0 > w || y0 > h || x0 + l.w < 0 || y0 + l.h < 0) continue;
    const own = l.kind === 'place' ? l.i : -1;
    const tries = [[x0, y0]];
    if (own >= 0) {
      const r = dotRadius(PLACE_BY_INDEX[own], s);
      const R = cover(X(l.x), Y(l.y), r);
      for (const rr of R > r ? [r, R] : [r]) for (let k = 0; k < 8; k++) tries.push(spotBox(X(l.x), Y(l.y), rr, 3, l.w, l.h, k));
      // über oder unter dem Punkt auch seitlich verschoben, solange der Punkt über oder unter dem Namen bleibt
      for (const k of [2, 3]) {
        const [cx, cy] = spotBox(X(l.x), Y(l.y), R, 3, l.w, l.h, k);
        for (let d = 6; d <= l.w / 2 - R; d += 6) tries.push([cx - d, cy], [cx + d, cy]);
      }
      // eine Großstadt sucht weiter, bevor sie ohne Namen bleibt: über und unter dem Punkt mit mehr Abstand, ebenso
      // seitlich verschoben (Frankfurt am Main zwischen Startmarke, Hanaus Marke und den Punkten der Nachbarorte)
      if (city(l)) {
        for (const gap of [7, 11]) {
          for (const k of [2, 3]) {
            const [cx, cy] = spotBox(X(l.x), Y(l.y), R, gap, l.w, l.h, k);
            tries.push([cx, cy]);
            for (let d = 6; d <= l.w / 2 - R; d += 6) tries.push([cx - d, cy], [cx + d, cy]);
          }
        }
      }
    }
    for (const [bx, by] of tries) {
      if (!inside(bx, by, bx + l.w, by + l.h) || !free(bx, by, bx + l.w, by + l.h, own)) continue;
      taken.push([bx - 2, by - 1, bx + l.w + 2, by + l.h + 1]);
      out.set(l, [bx, by]);
      break;
    }
  }
  return out;
}

/**
 * Was die Karte zeigen muss, damit der Weg auf Straßen liegt (route.secs, RouteLog): die Orte, durch die der Wagen fuhr
 * (Punkt, Zubringer, Name), und die Landstraßen, auf denen er fuhr – auch wo die Stufe sie sonst weglässt. Ohne sie lief
 * der Weg zu einem kleinen Ort quer übers Land und endete im Nichts (Hammersbach neben Erlensee).
 */
export function routeKeep(route) {
  const places = new Set();
  const edges = new Set();
  for (const c of route.secs || []) {
    if ((c.kind === 'stadt' || c.kind === 'zub') && c.place >= 0 && PLACE_BY_INDEX[c.place]) places.add(c.place);
    if (c.kind === 'land' && c.edge >= 0) edges.add(c.edge);
  }
  return { places, edges };
}

/**
 * Beschriftung einer Stufe samt den Namen der Orte aus keep, die sie nicht beschriftet (placeLabel; nach den Großstädten
 * vor den übrigen Namen, routeLabels setzt in dieser Reihenfolge). Ergebnis wie menuLayout, dazu extra: die neuen Namen.
 */
function withKeep(layout, keep, b, measure) {
  const extra = [...keep.places].filter((i) => !layout.shown.has(i)).map((i) => placeLabel(i, b, measure));
  if (!extra.length) return { ...layout, extra };
  return { labels: [...extra, ...layout.labels], shown: new Set([...layout.shown, ...keep.places]), extra };
}

// Richtungen, in die verschobene Marken zuerst ausweichen (routePlan): 0 wie bisher, dann je zwei Schritte weiter
const TURNS = [0, 2, 4, 6, 8, 10];

/**
 * Ausschnitt und Namen zusammen (drawRouteMap): Bleibt eine Großstadt im Bild ohne Namen, weil eine verschobene Marke
 * auf ihren Plätzen liegt (Hanaus Folge unter Frankfurt am Main), weichen die Marken in eine andere Richtung aus.
 * Gewählt wird, was die wenigsten Großstädte ohne Namen lässt, bei Gleichstand das mit den meisten Namen. layoutOf:
 * Stufe → menuLayout (unter Node mit eigener Textmessung, measure dieselbe für die Namen aus routeKeep). Ergebnis:
 * { v, names, lost: Großstädte im Bild ohne Namen, keep: routeKeep, layout: die Beschriftung samt Namen aus keep }.
 */
export function routePlan(route, w, h, layoutOf = menuLayoutOf, measure = undefined) {
  let best = null;
  const keep = routeKeep(route);
  for (const turn of TURNS) {
    const v = routeView(route, w, h, { turn });
    const layout = withKeep(layoutOf(v.b), keep, v.b, measure);
    const names = routeLabels(v, layout);
    const shown = new Set([...names.keys()].filter((l) => l.kind === 'place').map((l) => l.i));
    const seen = (l) => v.X(l.x) > 0 && v.Y(l.y) > 0 && v.X(l.x) < w && v.Y(l.y) < h;
    const lost = layout.labels.filter((l) => l.kind === 'place' && isCity(PLACE_BY_INDEX[l.i]) && seen(l) && !shown.has(l.i)).length;
    if (!best || lost < best.lost || (lost === best.lost && names.size > best.names.size)) best = { v, names, lost, keep, layout };
    // ohne verschobene Marke ändert eine andere Richtung nichts
    if (!lost || v.items.every((it) => it.x === it.x0 && it.y === it.y0)) break;
  }
  return best;
}

/**
 * Die Route auf die Leinwand zeichnen: w × h CSS-Bildpunkte, ps Bildpunkte der Leinwand je CSS-Bildpunkt, route wie
 * bei routeView. Ergebnis: Lage der Marken im Bild (CSS-Bildpunkte) für Prüfungen: [{ type, n, x, y, moved }].
 */
export function drawRouteMap(canvas, route, w, h, ps) {
  painter = painter || new MapPainter({ theme: 'light', look: 'menu', labels: false });
  const T = THEMES.light;
  const { v, names, keep, layout } = routePlan(route, w, h);
  const { X, Y } = v;
  canvas.width = Math.max(1, Math.round(w * ps));
  canvas.height = Math.max(1, Math.round(h * ps));
  const ctx = canvas.getContext('2d');
  // Land, Straßen und Ortspunkte wie in der großen Karte; die Namen kommen erst über den Weg
  // dazu die gefahrenen Landstraßen und die Orte, durch die der Wagen fuhr (routeKeep), auch wo die Stufe sie weglässt
  painter.keep = keep;
  painter.renderStatic(ctx, v.wx, v.wy, v.s * ps, canvas.width, canvas.height, ps, v.b);
  painter.keep = null;
  ctx.setTransform(ps, 0, 0, ps, 0, 0);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  // der gefahrene Weg in den Farben der Route des Navis
  const L = route.line || [];
  if (L.length >= 4) {
    const p = new Path2D();
    let pen = false;
    for (let i = 0; i < L.length; i += 2) {
      if (!Number.isFinite(L[i])) {
        pen = false;
        continue;
      }
      if (pen) p.lineTo(X(L[i]), Y(L[i + 1]));
      else p.moveTo(X(L[i]), Y(L[i + 1]));
      pen = true;
    }
    for (const [col, lw] of [[T.routeGlow, 12], [T.routeCase, 7], [T.route, 4.5]]) {
      ctx.strokeStyle = col;
      ctx.lineWidth = lw;
      ctx.stroke(p);
    }
  }
  painter.renderLabels(ctx, v.wx, v.wy, v.s * ps, canvas.width, canvas.height, ps, v.b, 0, 0, (l) => {
    const q = names.get(l);
    return q ? [q[0] * ps, q[1] * ps] : null;
  }, layout.extra);
  ctx.setTransform(ps, 0, 0, ps, 0, 0);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  // Striche von verschobenen Marken zu ihrer Stelle, mit einem Punkt dort (unter allen Marken)
  for (const it of v.items) {
    if (it.x === it.x0 && it.y === it.y0) continue;
    ctx.beginPath();
    ctx.moveTo(it.x0, it.y0);
    ctx.lineTo(it.x, it.y);
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#1d1f22';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(it.x0, it.y0, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = '#1d1f22';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
  }
  const disc = (x, y, r, fill) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
  };
  const out = [];
  for (const it of v.items) {
    const { x, y } = it;
    if (it.type === 'start') {
      // Start: Erlensee, ein weißer Punkt mit dunklem Rand und dem roten LIVE-Punkt
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#1d1f22';
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#e8212e';
      ctx.fill();
    } else if (it.type === 'laden') {
      // Ladestopp: grüne Marke mit dem Stecker wie im Navi
      disc(x, y, 11, PARK_GREEN);
      drawTurnIcon(ctx, 'stop', x, y, 15, '#ffffff');
    } else {
      // BrunnenTV-Folge: blaue Marke mit der Nummer der Folge
      const label = String(it.n);
      disc(x, y, label.length > 2 ? 13 : 11, TV_BLUE);
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 ${label.length > 3 ? 9 : label.length > 2 ? 10 : 12}px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x, y + 0.5);
    }
    out.push({ type: it.type, ...(it.n !== undefined ? { n: it.n } : {}), x: Math.round(x), y: Math.round(y), moved: it.x !== it.x0 || it.y !== it.y0 });
  }
  // das Auto am Ende des Wegs, in Fahrtrichtung (über allem; die Marken und Namen sind ihm ausgewichen)
  if (v.car) {
    drawCar(ctx, v.car.x, v.car.y, v.car.a, 20, null);
    out.push({ type: 'auto', x: Math.round(v.car.x), y: Math.round(v.car.y) });
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  return out;
}

/**
 * Den gefahrenen Weg für den Abspann ausdünnen: höchstens max Punkte, Sprünge (NaN) bleiben, Anfang und Ende bleiben.
 * L: [x, y, …] (der gefahrene Weg des Navis, ein Punkt je gut 40 m).
 */
export function thinLine(L, max = 3000) {
  const n = L.length / 2;
  if (n <= max) return L.slice();
  const step = Math.ceil(n / max);
  const out = [];
  for (let i = 0; i < n; i++) {
    const x = L[2 * i];
    const jump = !Number.isFinite(x);
    const edge = i === n - 1 || (i + 1 < n && !Number.isFinite(L[2 * i + 2])) || (i > 0 && !Number.isFinite(L[2 * i - 2]));
    if (jump || edge || i % step === 0) out.push(x, L[2 * i + 1]);
  }
  return out;
}
