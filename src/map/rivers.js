// Flüsse in den Orten der XXL-Welt (der Besitzer am 26.11.2026 zu den Flusswahrzeichen: „Klingt gut :)“): Main in
// Frankfurt, Rhein in Köln, Elbe in Hamburg. Rein rechnerisch (ohne three.js, auch für die Node-Tests) und die eine
// Wahrheit für alle, die den Fluss kennen müssen (COMMON.md §9): der Ortsplan hält sein Band frei und stellt die
// Wahrzeichen hinein (kit/layout.js), der Flussbau baut Wasser, Kaimauern und Straßenbrücke (kit/river.js), der Boden
// bekommt dort sein Loch (xxl/ground.js), der Blitzer bleibt weg (xxl/blitzer.js) – und das Navi zeichnet dasselbe Band
// (Nahansicht: map/roadahead.js; Karte: map/navroute.js riverOnMap, fest für jede Fahrt). Die Ortsdurchfahrt einer Großstadt ist gerade (game/course.js: Ruhezonen an
// Anfang und Ende), das Band also nirgends von einer Kurve gestaucht; tools/fluesse-test.mjs wacht darüber.
//
// Der Fluss ist ein gerades Band quer zur Ortsdurchfahrt. Ortskoordinaten wie im Ortsplan: x seitlich wie im
// Straßenprofil „stadt“ (rechts +), u = Meter ab Ortsbeginn (im Ort liegt alles bei z = −u). Seine Achse kreuzt die
// Straßenmitte (x = RIVER.axis) bei u und ist um ang gegen die Senkrechte zur Straße gedreht (ang > 0: sein rechtes
// Ende liegt weiter voraus). Flusskoordinaten: X längs der Achse (rechts der Straße +), D quer dazu (zum jenseitigen
// Ufer +, also voraus). Wasser ist, wo |D| < half; die Straße bleibt eben und fährt als Brücke darüber, der
// Wasserspiegel liegt drop Meter unter ihr.
import { hashString } from '../util.js';

/**
 * Die Flüsse nach Ortsschlüssel der Karte: name (so beschriftet ihn das Navi), half (halbe Breite des Wassers zwischen
 * den Kaimauern – bei den Brücken die ihres Wahrzeichens, kit/landmark-dims.js river.half), drop (Wasserspiegel unter
 * der Straße: die Uferhöhe des Wahrzeichens plus so viel, dass dessen eigenes Ufer unter dem Uferweg verschwindet; am
 * Hafen so, dass sein Kai knapp über der Straße liegt), rail (Farbe des Brückengeländers, passend zum Wahrzeichen).
 * map: wo er auf der Landkarte liegt – fest, für jede Fahrt gleich (map/navroute.js riverOnMap): die Brücke der
 * Ortsdurchfahrt liegt km Kilometer vom Ortspunkt in Richtung deg (Kompass: 0 = Norden, 90 = Osten), das Wasser reicht
 * von dort reach Kilometer nach beiden Seiten. Die Autobahnen der Karte laufen alle durch den Ortspunkt; der Fluss
 * liegt deshalb in dem Winkel zwischen zweien, in dem keine Straße der Karte ist (Rhein östlich des Doms, Main und
 * Elbe südöstlich der Mitte), und läuft vor ihnen aus: Keine Straße der Karte kreuzt ihn außer der Ortsdurchfahrt auf
 * ihrer Brücke – was die Karte als Brücke zeigt, ist in der Welt eine (COMMON.md §9; tools/fluesse-test.mjs prüft es).
 */
export const RIVERS = {
  'Frankfurt am Main': { name: 'Main', half: 75, drop: 3.4, rail: 0x5f8f74, map: { deg: 152, km: 2.0, reach: 3.0 } },
  'Köln': { name: 'Rhein', half: 112, drop: 3.8, rail: 0x7b8584, map: { deg: 81, km: 3.0, reach: 1.9 } },
  Hamburg: { name: 'Elbe', half: 110, drop: 3.05, rail: 0x5a7694, map: { deg: 126, km: 3.2, reach: 2.1 } },
};

export const RIVER = {
  axis: 7.45, // Straßenmitte zwischen den Bordsteinen (kit/layout.js STREET)
  deck: [-1.1, 16.0], // Außenkanten der Gehwege: so breit ist die Straßenbrücke
  u: 330, // hier kreuzt die Achse die Straße: hinter der Ladesäule am Ortsanfang, vor dem Rasen des Brunnenplatzes
  minLen: 1150, // nur Großstädte (Ortsdurchfahrt 1200 m) haben Platz für Fluss, Ufer und Brunnenplatz
  deg: [5, 8], // Winkel gegen die Senkrechte zur Straße (Betrag in Grad; die Richtung zieht der Ortsname)
  bank: 10, // Uferweg je Seite: so weit hinter der Kaimauer stehen keine Häuser
  wall: 0.25, // die Kaimauer steht so weit vor der Wasserkante (davor liegt die Uferkante der Wahrzeichen)
  reach: 1500, // so weit nach beiden Seiten reichen Wasser und Mauern: bis in den Dunst (Nebel ab 1550 m dicht)
};

const cache = new Map();
/**
 * Fluss des Orts key in einer Ortsdurchfahrt der Länge len oder null: { key, name, half, drop, rail, x, u, ang, sin,
 * cos, bank, wall, reach, map } (unveränderlich; für denselben Ort immer derselbe).
 */
export function riverOf(key, len) {
  const R = RIVERS[key];
  if (!R || !(len >= RIVER.minLen)) return null;
  let rv = cache.get(key);
  if (!rv) {
    const h = hashString('Fluss ' + key);
    const deg = RIVER.deg[0] + ((h % 1000) / 1000) * (RIVER.deg[1] - RIVER.deg[0]);
    const ang = (((h >>> 10) & 1 ? 1 : -1) * deg * Math.PI) / 180;
    rv = Object.freeze({
      key, name: R.name, half: R.half, drop: R.drop, rail: R.rail, x: RIVER.axis, u: RIVER.u, ang, sin: Math.sin(ang), cos: Math.cos(ang),
      bank: RIVER.bank, wall: RIVER.wall, reach: RIVER.reach, map: Object.freeze({ ...R.map }),
    });
    cache.set(key, rv);
  }
  return rv;
}

/**
 * Fluss der Ortsdurchfahrt sec einer Fahrt (places: die Orte der Karte, map/graph.js) oder null. Wo die Fahrt beginnt,
 * fließt keiner: der Startort ist kürzer und anders gebaut (Brunnenplatz rechts neben dem Wagen).
 */
export function riverOfSec(sec, places) {
  return sec && sec.kind === 'stadt' && !sec.start && places[sec.place] ? riverOf(places[sec.place].key, sec.s1 - sec.s0) : null;
}

/** Punkt der Flusskoordinaten (X längs, D quer) in Ortskoordinaten: out = [x, u]. */
export function riverAt(rv, X, D, out = [0, 0]) {
  out[0] = rv.x + X * rv.cos - D * rv.sin;
  out[1] = rv.u + X * rv.sin + D * rv.cos;
  return out;
}
/** Lage quer zum Fluss (D, zum jenseitigen Ufer +) eines Punkts (x, u) des Orts: Wasser ist, wo |D| < half. */
export function riverCross(rv, x, u) {
  return (u - rv.u) * rv.cos - (x - rv.x) * rv.sin;
}
/** Lage längs des Flusses (X, rechts der Straße +) eines Punkts (x, u) des Orts. */
export function riverAlong(rv, x, u) {
  return (x - rv.x) * rv.cos + (u - rv.u) * rv.sin;
}
/** Bereich [u0, u1] längs der Straße, den das Band |D| ≤ half + pad zwischen den seitlichen Lagen x0 und x1 belegt. */
export function riverSpan(rv, x0, x1, pad = 0) {
  const w = (rv.half + pad) / rv.cos;
  const a = rv.u + ((x0 - rv.x) * rv.sin) / rv.cos;
  const b = rv.u + ((x1 - rv.x) * rv.sin) / rv.cos;
  return [Math.min(a, b) - w, Math.max(a, b) + w];
}
/** Liegt das achsparallele Rechteck [x0, x1] × [u0, u1] irgendwo im Band |D| < half + pad? */
export function riverHits(rv, x0, x1, u0, u1, pad = 0) {
  const d = [riverCross(rv, x0, u0), riverCross(rv, x1, u0), riverCross(rv, x0, u1), riverCross(rv, x1, u1)];
  const w = rv.half + pad;
  return Math.min(...d) < w && Math.max(...d) > -w;
}
/**
 * Umriss des Wassers als Viereck in Ortskoordinaten, X von −reach bis reach (Standard: rv.reach):
 * [[x, u], …] im Umlauf diesseits links → diesseits rechts → jenseits rechts → jenseits links.
 */
export function riverPoly(rv, reach = rv.reach) {
  return [riverAt(rv, -reach, -rv.half), riverAt(rv, reach, -rv.half), riverAt(rv, reach, rv.half), riverAt(rv, -reach, rv.half)];
}
