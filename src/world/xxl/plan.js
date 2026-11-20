// Planung der XXL-Welt ohne Grafik (läuft auch unter Node, siehe tools/xxl-test.mjs): wie die Straßenstücke heißen
// und geschnitten werden, wo Wald steht, was für den Spieler gilt (Grenzen, Spuren, Tempo, Halt am Ziel) und wohin der
// Autopilot der Prüfhilfen lenkt. Alles hängt nur an trip.js und an stabilen Schlüsseln der Abschnitte.
import { J, PROFILES } from '../../game/trip.js';
import { places } from '../../map/graph.js';
import { islandRadius } from '../kit/layout.js';
import { PARKS, PARK_STOP_AFTER } from '../../map/parks.js';

/** So weit hinter dem Spieler gibt es Welt (Boden, Straßen, Autobahn); dahinter beginnt der Himmel wie bisher. */
export const XXL_BEHIND = 300;
/** So weit voraus werden Straßenstücke gebaut (der Dunst endet bei 1550 m). */
export const AHEAD = 1750;
/** Höchstlänge eines Straßenstücks. */
export const CHUNK = 400;

// --- Schlüssel ---------------------------------------------------------------------------------------------------
/** Stabiler Schlüssel eines Abschnitts ohne Lage auf dem Band: Grundlage für alle Samen (nie IDs oder Reihenfolge). */
export function secSeedKey(sec) {
  return [sec.kind, sec.node, sec.place, sec.de, sec.back ? 'b' : '', sec.inline ? 'i' : '', sec.arrival ? 'a' : '', sec.transitTo ?? ''].join('|');
}
/** Kurzform eines Nachbarn: alles, was die Form des Abschnitts an seinen Enden bestimmt (Übergang, Stummel). */
const nbKey = (q) => (q ? q.kind + ':' + q.profile : '-');

/**
 * Vorgänger, wie ihn ein Abschnitt zuletzt hatte: trip.js räumt Abschnitte J.behind (400 m) hinter ihrem Ende ab,
 * danach steht der Abschnitt vorne im Weg ohne Vorgänger. Seine Form am Anfang (Übergang, Stummel) hängt aber am
 * Vorgänger, und sein Stückschlüssel auch: ohne dieses Gedächtnis würden alle Stücke des Abschnitts in diesem
 * Moment neu gebaut (ein Ruckeln; auf jedem Zubringer zurück zur Autobahn fiele das genau auf das Erscheinen der
 * Autobahn, denn J.back + J.auf − J.show = J.behind).
 */
const PREV = new WeakMap();

/** Nachbarn im Weg; vor einer Rampe liegt die Autobahn ihrer Gabelung. Ein abgeräumter Vorgänger bleibt gültig. */
export function neighbours(path, sec) {
  const L = path.sections;
  const i = L.indexOf(sec);
  let prev = i > 0 ? L[i - 1] : null;
  if (!prev && sec.kind === 'ramp' && path.fork) prev = path.fork.sec;
  if (prev) PREV.set(sec, prev);
  else if (i === 0) prev = PREV.get(sec) || null;
  return { prev, next: i >= 0 && i < L.length - 1 ? L[i + 1] : null };
}

/**
 * So weit wirkt ein Nachbar in einen Abschnitt hinein (roadkit: Fahrstreifen-Ende J.merge2 = 150 m mit Pfeilen bis
 * 138 m davor, Übergänge J.taper/EXIT_T, Stummel, Planken-Enden bis RAIL_U): nur Stücke in dieser Nähe des Anfangs
 * bzw. Endes tragen den Vorgänger bzw. Nachfolger im Schlüssel. Geprüft mit v/tools/nbcheck.mjs (NOTES).
 */
export const NB_REACH = 320;

/**
 * Schlüssel eines gebauten Stücks: Abschnitt (mit Lage), Nachbarn in Reichweite und Wald, der es berührt. Ändert sich
 * einer davon (neu geplanter Zweig mit anderem Folgeabschnitt), entsteht ein neues Stück; sonst bleibt das gebaute
 * stehen, auch wenn der Zweig mit neuen Rahmen neu angelegt wurde. Wird der Folgeabschnitt erst unterwegs geplant
 * (ein langer Zubringer erfährt seine Auffahrt erst nach rund 250 m), baut die Welt so nur das letzte Stück am
 * Horizont neu, nicht das unter dem Wagen.
 */
export function pieceKey(sec, chunk, prev, next, forest) {
  let f = '';
  for (const r of forest) if (r.s1 > chunk.a && r.s0 < chunk.b) f += (f ? ',' : '') + Math.round(r.s0) + '-' + Math.round(r.s1);
  const p = chunk.a < sec.s0 + NB_REACH ? nbKey(prev) : '';
  const n = chunk.b > sec.s1 - NB_REACH ? nbKey(next) : '';
  return secSeedKey(sec) + '@' + Math.round(sec.s0 * 10) + '#' + chunk.i + '<' + p + '>' + n + '~' + f;
}

/**
 * Die Straßenstücke, die die Welt bei T.s zeigt (XxlWorld.sync; hier ohne Grafik, damit tools/xxl-test.mjs genau
 * dasselbe prüft): view = T.autobahnView(). Je Stück onPiece(key, path, sec, prev, next, chunk, forest), je
 * gezeichnetem Weg danach onPath(path, drawn) mit seinen sichtbaren Abschnitten (für die Tafeln).
 */
export function eachPiece(T, view, onPiece, onPath = null) {
  const lo = T.s - XXL_BEHIND;
  const hi = T.s + AHEAD;
  for (const e of T.paths()) {
    const { path, role, fork } = e;
    // fremde Wege nur an der gezeichneten Autobahn; die verlassene Autobahn selbst zeichnet die Road
    if (role !== 'cur') {
      if (!view || !fork || fork.sec.frame !== view.frame) continue;
      if (role === 'ghost' && fork.taken === 'exit') continue;
    }
    const forest = forestRanges(path, []);
    const drawn = [];
    for (const sec of path.sections) {
      if (sec.kind === 'ab' || sec.s1 < lo || sec.s0 > hi) continue;
      if (!T.visible(sec, path)) continue;
      drawn.push(sec);
      const { prev, next } = neighbours(path, sec);
      const ch = chunksOf(sec);
      for (let i = 0; i < ch.length; i++) {
        if (ch[i].b < lo || ch[i].a > hi) continue;
        onPiece(pieceKey(sec, ch[i], prev, next, forest), path, sec, prev, next, ch[i], forest);
      }
    }
    if (onPath) onPath(path, drawn);
  }
}

/** Stückgrenzen eines Abschnitts: der Bogen eines Knotenpunkts ist ein eigenes Stück (er liegt anders, siehe roadkit). */
export function chunksOf(sec) {
  const out = [];
  let a = sec.s0;
  let b = sec.s1;
  const l = sec.link;
  let curveA = null;
  let curveB = null;
  if (l && l.type === 'exit' && sec.kind === 'ramp') {
    curveA = [a, Math.min(b, a + J.cap)];
    a = curveA[1];
  }
  if (l && l.type === 'merge' && sec.kind === 'auf') {
    curveB = [Math.max(a, b - J.cap), b];
    b = curveB[0];
  }
  if (curveA) out.push({ a: curveA[0], b: curveA[1], curve: true });
  const n = Math.max(1, Math.ceil((b - a) / CHUNK - 1e-6));
  if (b > a + 0.01) for (let i = 0; i < n; i++) out.push({ a: a + ((b - a) * i) / n, b: a + ((b - a) * (i + 1)) / n, curve: false });
  if (curveB) out.push({ a: curveB[0], b: curveB[1], curve: true });
  out.forEach((c, i) => (c.i = i));
  return out;
}

/**
 * Ortsdurchfahrt eines Orts der Karte oder Abschnitt eines Ladeparks: sie wird vom Stadtbaukasten bebaut (towns.js),
 * nicht mit Platzhaltern.
 */
export const kitTown = (sec) => (sec.kind === 'stadt' && sec.place >= 0) || sec.kind === 'park';

// --- Wald an den Wechseln der Autobahn ----------------------------------------------------------------------------
/** Der Wald beginnt so viel vor dem Vorhang (trip.curtains) und endet so viel dahinter: Waldrand, der dichter wird. */
export const FOREST_IN = 40;
export const FOREST_OUT = 60;
/** Wo auf einem langen Zubringer zurück die nächste Autobahn erscheint, falls danach eine Auffahrt kommt (J.back). */
const BACK_SHOW = J.back + J.auf - J.show;

/**
 * Waldstücke eines Wegs [{s0, s1, why}], nur aus seinem eigenen Aufbau abgeleitet, also unabhängig davon, wann
 * trip.curtains() einen Vorhang kennt (die Auffahrt hinter einem Zubringer wird oft erst geplant, wenn man schon im
 * Wald steckt; der Wald darf dann nicht neu wachsen):
 * - hinter der Ausfahrt eines Zweigs: dort verschwindet die verlassene Autobahn (fork.s + J.hide),
 * - auf jedem langen Zubringer zurück (J.back): dort erscheint die nächste Autobahn, wenn eine Auffahrt folgt
 *   (sonst ist es einfach ein Waldstück). Auf einer Verbindungsfahrbahn fällt beides zusammen.
 * tools/xxl-test.mjs prüft, dass jeder Vorhang des eigenen Wegs darin liegt.
 */
export function forestRanges(path, out = []) {
  out.length = 0;
  const f = path.fork;
  let exitAt = NaN;
  if (f && f.branch === path) {
    exitAt = f.s + J.hide;
    out.push({ s0: exitAt - J.curtainBefore - FOREST_IN, s1: exitAt + J.curtainAfter + FOREST_OUT, why: 'exit' });
  }
  for (const c of path.sections) {
    if (c.kind !== 'zub' || !c.back || c.len < J.back - 1) continue;
    const at = c.s0 + BACK_SHOW;
    if (Math.abs(at - exitAt) < 1) continue;
    out.push({ s0: at - J.curtainBefore - FOREST_IN, s1: at + J.curtainAfter + FOREST_OUT, why: 'merge' });
  }
  out.sort((a, b) => a.s0 - b.s0);
  return out;
}

// --- Brunnenplatz am Ziel -------------------------------------------------------------------------------------------
/**
 * Jede Ortsdurchfahrt (außer dem Startort) hat am Zielpunkt (spotS) einen kleinen gepflasterten Platz: links weitet
 * sich die Straße, auf einer runden Insel steht der Brunnen, die Gegenrichtung fährt links um ihn herum, unsere Spur
 * (J.L0) bleibt gerade. Ist der Ort das Navi-Ziel, hält der Wagen STOP_AFTER_SPOT hinter dem Zielpunkt an, NEBEN dem
 * Brunnen: vom Fahrersitz aus liegt seine Mitte SIDE_VIEW.angle vor der Querrichtung, mitten im linken Seitenfenster
 * (das reicht etwa von 36° bis 109° gegen die Fahrtrichtung), zwischen Wagen und Insel ist nur Fahrbahn.
 */
export const SQUARE = {
  edge: J.L0 - 1.3, // rechter Rand der Insel (quer): 1,3 m links neben der Mitte unserer Spur
  r: 3.4, // Radius der Insel (Bordstein und Pflaster, darauf der Brunnen), wo kein Ort bekannt ist; siehe FOUNTAIN.radius
  run: 26, // so weit reicht der Platz vor und hinter der Insel
  taper: 20, // auf so vielen Metern weitet sich die Straße (und läuft wieder zusammen)
  loop: 3.4, // Breite der Fahrbahn links um die Insel
  clear: 1.05, // halbe Wagenbreite plus Rand: so nah darf die Wagenmitte der Insel kommen
};
/** Halt am Navi-Ziel: so weit hinter dem Zielpunkt (spotS) steht der Wagen still (das Ziel zählt dann schon). */
export const STOP_AFTER_SPOT = 2;
/**
 * Blick aus dem Seitenfenster am Halt: Auge des Fahrers back m hinter und left m links der Wagenmitte (cockpit.js EYE),
 * die Mitte des Brunnens liegt angle vor der Querrichtung (25°: gut 65° gegen die Fahrtrichtung).
 */
export const SIDE_VIEW = { back: 0.27, left: 0.37, angle: (25 * Math.PI) / 180 };
/** So weit liegt die Mitte einer Insel mit Radius r vor dem Haltepunkt (längs), damit sie im Seitenfenster steht. */
export function squareAhead(r) {
  return Math.tan(SIDE_VIEW.angle) * (J.L0 - SIDE_VIEW.left - (SQUARE.edge - r)) - SIDE_VIEW.back;
}
/**
 * radius(place) gibt den Radius der Insel für den Brunnen dieses Orts (Brunnen-Radius plus Rand), zwischen 2,5 und
 * 8 m: der Stadtbaukasten kennt den Hauptbrunnen jedes Orts (kit/layout.js islandRadius, ohne Grafik). Ein anderer
 * Haken muss vor der ersten Fahrt gesetzt sein (Plätze werden gemerkt).
 */
export const FOUNTAIN = { radius: (place) => (places[place] ? islandRadius(places[place]) : SQUARE.r) };
const squares = new WeakMap();

/**
 * Brunnenplatz eines Abschnitts oder null: {s, x: Mitte der Insel, r, s0, s1: Platz, aL: linker Asphaltrand neben
 * der Insel, stop: Haltepunkt (s), heading: Drehung des Brunnens um y, so dass seine Vorderseite (+z) zum haltenden
 * Wagen zeigt}. Abschnittskoordinaten; einmal je Abschnitt berechnet.
 */
export function squareOf(sec) {
  if (sec.kind !== 'stadt' || sec.start || sec.spotS === undefined) return null;
  let q = squares.get(sec);
  if (q) return q;
  const r = Math.min(8, Math.max(2.5, +FOUNTAIN.radius(sec.place, sec) || SQUARE.r));
  const stop = sec.spotS + STOP_AFTER_SPOT;
  // neben dem Wagen auf der Fahrerseite: 1,9 m (kleine Insel) bis 4 m (große) vor der Wagenmitte, auf Höhe der Haube
  const s = stop + squareAhead(r);
  const x = SQUARE.edge - r;
  const half = r + SQUARE.run;
  q = { s, x, r, s0: s - half, s1: s + half, aL: x - r - SQUARE.loop, stop, heading: Math.atan2(J.L0 - x, s - stop) };
  squares.set(sec, q);
  return q;
}

/**
 * Anteil (0 … 1), mit dem die Straße bei s für den Brunnenplatz geweitet ist: 0 außerhalb, 1 neben der Insel,
 * dazwischen weiche Übergänge auf SQUARE.taper Metern.
 */
export function squareWeight(sq, s) {
  if (!sq || s <= sq.s0 || s >= sq.s1) return 0;
  const t = Math.min(s - sq.s0, sq.s1 - s) / SQUARE.taper;
  return t >= 1 ? 1 : t * t * (3 - 2 * t);
}

/**
 * Ankunft am Navi-Ziel: kennt den Haltepunkt (vor der Ankunft aus dem Ziel, danach bis zum Stillstand) und meldet,
 * wenn der Wagen dort steht ({type: 'rest', place, sec, square}). Das Spiel kann daran die Brunnen-Szene hängen.
 * Ebenso im Ladepark (geplanter Ladestopp oder rechts hinein, ohne Plan): Halt PARK_STOP_AFTER hinter dem Haltepunkt,
 * neben der freien Heldenbucht, dann {type: 'charge', park, name, sec}. Einen Park hat der eigene Weg erst, wenn der Wagen
 * an seiner Ausfahrt abgefahren ist.
 */
export class Arrival {
  constructor() {
    this.pending = null; // {s, sec, place, park, square} nach dem Ereignis 'arrive' bzw. 'park', bis der Wagen steht
    this.stopOut = { s: 0, sec: null, place: -1, park: -1 };
    this.hold = false; // true: nach dem Halt stehen bleiben, bis release() (z. B. während der Brunnen-Szene)
    this.held = null;
  }
  reset() {
    this.pending = null;
    this.held = null;
  }
  /** Gehaltenen Wagen weiterfahren lassen. */
  release() {
    this.held = null;
  }
  /** Haltepunkt für die nächste Bewegung oder null. */
  stop(trip) {
    if (this.pending) return this.pending;
    if (this.held) return this.held;
    const L = trip.cur.sections;
    for (let i = 0; i < L.length; i++) {
      const c = L[i];
      const park = c.kind === 'park';
      if (!park && (c.kind !== 'stadt' || c.place !== trip.target || trip.target < 0)) continue;
      if (c.spotDone || c.spotS === undefined || c.start) continue;
      const after = park ? PARK_STOP_AFTER : STOP_AFTER_SPOT;
      if (c.spotS + after < trip.s || c.spotS - trip.s > 1500) continue;
      const o = this.stopOut;
      o.s = c.spotS + after;
      o.sec = c;
      o.place = park ? -1 : c.place;
      o.park = park ? c.park : -1;
      return o;
    }
    return null;
  }
  /** Nach trip.update: Ereignisse dieses Bilds und Tempo des Wagens. Gibt das Ereignis 'rest' zurück oder null. */
  update(trip, events, speed) {
    for (let i = 0; i < events.length; i++) {
      const e = events[i];
      if (e.type === 'arrive' && !e.sec.start) this.pending = { s: e.sec.spotS + STOP_AFTER_SPOT, sec: e.sec, place: e.place, park: -1, square: squareOf(e.sec) };
      if (e.type === 'park') this.pending = { s: e.sec.spotS + PARK_STOP_AFTER, sec: e.sec, place: -1, park: e.park, square: null };
    }
    const p = this.pending;
    if (!p) return null;
    if (speed < 0.15 && Math.abs(trip.s - p.s) < 2) {
      this.pending = null;
      if (this.hold) this.held = { s: trip.s + 0.3, sec: p.sec, place: p.place, park: p.park };
      if (p.park >= 0) return { type: 'charge', park: p.park, name: PARKS[p.park].name, sec: p.sec };
      return { type: 'rest', place: p.place, sec: p.sec, square: p.square };
    }
    if (trip.s > p.s + 5 || trip.section !== p.sec) this.pending = null;
    return null;
  }
}

/**
 * Linke Grenze der Wagenmitte neben der Brunneninsel (base: die Grenze des Profils): auf 20 m vor der Insel schiebt sie
 * sich weich nach rechts bis an die Insel (plus SQUARE.clear) und dahinter wieder zurück.
 */
export function squareXmin(sq, s, base) {
  if (!sq) return base;
  const near = 20;
  const a = sq.s - sq.r - 2;
  const b = sq.s + sq.r + 2;
  if (s <= a - near || s >= b + near) return base;
  const xIsl = Math.max(base, sq.x + sq.r + SQUARE.clear);
  if (s >= a && s <= b) return xIsl;
  const t = s < a ? (s - (a - near)) / near : (b + near - s) / near;
  return base + (xIsl - base) * t * t * (3 - 2 * t);
}

// --- Spieler -------------------------------------------------------------------------------------------------------
/** Bremsverzögerung, mit der das Tempolimit voraus geplant wird (m/s²); der Begrenzer im Player hält sie ein. */
export const BRAKE_PLAN = 2.4;
/** Das Limit eines Abschnitts voraus soll schon so viele Meter vor seinem Anfang erreicht sein (der Begrenzer läuft nach). */
const CAP_EARLY = 15;
/** Bis zu dieser Querbewegung nach außen (m/s) gilt der Wagen als quer ruhend, wie beim Spurhalten (steering.js). */
const LIMIT_SLACK = 0.05;

/**
 * Tempo-Obergrenze out.vmax auf v senken, das in d Metern erreicht sein muss (v0: Tempo dort, m/s): bis dahin fällt
 * sie mit BRAKE_PLAN (out.decel sagt dem Begrenzer, dass er mitbremsen muss), danach steht sie.
 */
function capTo(out, v0, d) {
  const v = d > 0 ? Math.sqrt(v0 * v0 + 2 * BRAKE_PLAN * d) : v0;
  if (v >= out.vmax) return;
  out.vmax = v;
  out.decel = d > 0 ? BRAKE_PLAN : 0;
}

/** Abschnitte, deren Tempolimit der Spieler gerade vorausschauend einhalten muss (eigener Weg, beim Abfahren der Zweig). */
function capOver(sections, s, out) {
  for (let i = 0; i < sections.length; i++) {
    const c = sections[i];
    if (c.s1 <= s || c.s0 <= s || c.s0 > s + 1200) continue;
    const lim = PROFILES[c.profile].limit;
    if (lim > 0) capTo(out, lim / 3.6, c.s0 - CAP_EARLY - s);
  }
}

/**
 * Grenzen, Spuren und Tempo für die nächste Bewegung des Spielers (trip.profile an seiner jetzigen Stelle, also vor der
 * Bewegung, mit Vorausschau). out: {left, right, shoulder, lanes, extraLane, vmax, decel, slack, closing}.
 * - Verzögerungs-/Beschleunigungsstreifen zählen als Spur bei J.L0 (kein Standstreifen).
 * - Tempo: Limit hier und jedes Limit voraus mit BRAKE_PLAN erreichbar; wer auf dem Verzögerungsstreifen ist (oder an
 *   einem Autobahnende), plant schon mit der Rampe. decel: BRAKE_PLAN, solange vmax deshalb gerade fällt, sonst 0.
 * - Halt am Navi-Ziel: stop = {s} (Arrival.stop), dann fällt das Tempo bis dorthin auf 0.
 * - slack: die Grenzen wandern mit der Strecke (Verengung, Brunneninsel) und schieben den quer ruhenden Wagen nur mit.
 */
export function limitsFor(trip, out, stop = null) {
  const P = trip.profile();
  const s = trip.s;
  out.left = P.xmin;
  out.right = P.xmax;
  out.lanes = P.lanes;
  out.extraLane = P.decel || P.accel ? J.L0 : null;
  out.shoulder = P.kind === 'ab' && !P.decel && !P.accel ? 7.9 : Infinity;
  out.vmax = P.limit > 0 ? P.limit / 3.6 : Infinity;
  out.decel = 0;
  out.slack = LIMIT_SLACK;
  // rückwärts höchstens bis an den Anfang des eigenen Abschnitts: Gabelung, Einfädeln, Ortsmitte und Überfahrt dahinter
  // sind entschieden und gezählt (trip.update meldet sie nur vorwärts, und nur einmal)
  out.back = P.sec.s0 + 1;
  capOver(trip.cur.sections, s, out);
  const f = P.sec.fork;
  if (f && !f.taken && f.branch && (f.forced || (P.decel && trip.x > J.laneEdge))) capOver(f.branch.sections, s, out);
  // Halt: geplant 0,3 m vor dem Haltepunkt (der Begrenzer läuft ein wenig nach)
  if (stop) capTo(out, 0, stop.s - 0.3 - s);
  // Brunneninsel: die Gegenspur ist dort gesperrt, unsere Spur bleibt frei
  if (P.kind === 'stadt') out.left = squareXmin(squareOf(P.sec), s, out.left);
  out.closing = P.closing;
  return out;
}

/**
 * Fahrer des Autopiloten (Prüfhilfen in main.js, tools/xxl-test.mjs): lenkt und fährt, wie ein Mensch es täte, mit
 * den Maßen des Fahrer-Bots (tools/steer-bot.mjs). Er lenkt auf die Stelle zu, an der der Wagen in AUTO.look
 * Sekunden wäre (in einer Kurve treibt er nach außen), lässt kleine Abweichungen stehen und nimmt enge Kurven so
 * langsam, dass sie sich gemütlich anfahren (AUTO.lat, nie unter AUTO.slow).
 * ctl: Steuerung dieses Bilds (steer, throttle, brake werden gesetzt), p: Player, want: Ziel-x, vmax: Tempo-
 * Obergrenze der Strecke (m/s), kappa: größte Krümmung der nächsten AUTO.ahead Meter (1/m).
 */
export const AUTO = { look: 0.45, tol: 0.3, gain: 0.6, cruise: 130 / 3.6, lat: 3.2, slow: 70 / 3.6, ahead: 140 };
export function autoDrive(ctl, p, want, vmax, kappa) {
  const dx = want - (p.x + p.vx * AUTO.look);
  ctl.steer = Math.abs(dx) > AUTO.tol ? Math.max(-1, Math.min(1, dx * AUTO.gain)) : 0;
  const v = Math.min(vmax, AUTO.cruise, Math.max(AUTO.slow, Math.sqrt(AUTO.lat / Math.max(Math.abs(kappa), 1e-5))));
  ctl.throttle = p.speed < v - 0.5 ? 0.7 : 0;
  ctl.brake = p.speed > v + 3 ? 0.4 : 0;
  // der Autopilot legt nie den Rückwärtsgang ein
  ctl.reverse = false;
}

/**
 * Ziel-x des Autopiloten (Titel, Prüfhilfen): geplante Ausfahrt nehmen, sonst rechte Spur bzw. unsere Spur.
 * choice: 'exit' | 'stay' entscheidet jede Gabelung, die nicht erzwungen ist, statt des Navis (null = Navi).
 */
export function autoTarget(trip, choice = null) {
  const sec = trip.section;
  if (sec.kind !== 'ab') return J.L0;
  const f = sec.fork;
  if (f && !f.taken && f.s - trip.s < J.decel - 10 && (f.forced || (choice ? choice === 'exit' : trip.planFor(f) === 'exit'))) return J.L0;
  return 5.625;
}
