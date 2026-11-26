// Bauplan der Brücken der XXL-Welt, rein rechnerisch (auch unter Node): wo map/crossings.js sectionWater eine Brücke
// in einen Abschnitt legt, steht sie in der Welt (xxl/bridges.js baut sie). Hier stehen nur die Maße, die mehrere
// brauchen – der Straßenbau (roadkit.js: kein Bankett auf der Brücke, dort liegen die Kappen), die Autobahn (road.js:
// dasselbe im Shader), der Bewuchs und die Szenerie (nichts im Wasser) und das Navi (map/roadahead.js).
//
// Lage: Der Fluss kreuzt die Straße bei sc (Meter der Fahrt) unter dem Winkel ang gegen die Senkrechte (+ = sein
// rechtes Ende liegt voraus). Flusskoordinaten: X längs des Flusses (bei der Straße 0, + nach rechts), D quer zu ihm
// (+ voraus). Ein Punkt x (seitlich wie die Straße) bei s hat D = (s − sc)·cos − x·sin, X = (x + D·sin) / cos.
//
// Querschnitt quer zum Fluss (D): Wasser bis half, die Böschung steigt bis half + bank auf die Höhe des Bodens. Die
// Brücke liegt auf zwei Widerlagern in der Böschung (D = ±abut), dahinter hält je Seite eine Flügelwand längs der
// Straße die Erde bis wing. Die Kappen (erhöhte Ränder aus Beton mit Geländer) liegen über die ganze Länge [c0, c1],
// senkrecht zur Straße abgeschnitten: so weit, dass sie überall seitlich bis xMax über das Loch im Boden reichen.
import { sectionWater, BRIDGE } from '../../map/crossings.js';

/**
 * Maße (Meter). cap: Breite der Kappe neben dem Asphalt (Landstraße), capAb: an der Autobahn · capH: ihre Höhe über
 * der Fahrbahn · abut: Widerlager bei half + abut · bank · wing: Ende der Flügelwand hinter der Böschung · xMax: so weit
 * reicht der Querschnitt höchstens seitlich (für die Länge der Kappen: Autobahn bis zur Gegenfahrbahn) · deck: Höhe
 * des Überbaus je Klasse · span: Abstand der Pfeiler etwa · pier: Dicke der Pfeiler längs der Straße.
 */
export const DECK = {
  cap: 2.1,
  capAb: 2.7,
  capH: 0.2,
  abut: BRIDGE.bank * 0.42,
  wing: BRIDGE.bank + 1.6,
  xMax: { ab: 34, other: 17 },
  deck: [2.1, 1.65, 1.25],
  span: [52, 40, 30],
  pier: 1.7,
};

const cache = new WeakMap();

/**
 * Die Brücken des Abschnitts sec im Bauplan: [{ w (der Eintrag aus sectionWater), sc, cos, sin, tan, half, drop, bank,
 * abut, wing, c0, c1 (Kappen, Meter der Fahrt), key }], nach Lage geordnet. Ortsdurchfahrten haben keine (die
 * Flussorte bauen ihren Fluss selbst, kit/river.js).
 */
export function bridgesOf(sec) {
  let out = cache.get(sec);
  if (out) return out;
  out = [];
  const base = sec.orig || sec;
  for (const w of sectionWater(base)) {
    const cos = Math.cos(w.ang);
    const sin = Math.sin(w.ang);
    const tan = sin / cos;
    const half = w.half;
    const wing = half + DECK.wing;
    const xMax = sec.kind === 'ab' ? DECK.xMax.ab : DECK.xMax.other;
    const L = wing / cos + xMax * Math.abs(tan);
    const sc = base.s0 + w.s;
    out.push({
      w, sc, cos, sin, tan, half, drop: w.drop, bank: BRIDGE.bank, abut: half + DECK.abut, wing,
      c0: sc - L, c1: sc + L, cls: w.cls, name: w.name, key: w.key, kind: sec.kind,
    });
  }
  cache.set(sec, out);
  return out;
}

/** Die Stücke [c0, c1] (Meter der Fahrt), auf denen der Abschnitt sec über Brücken führt (dort kein Bankett). */
export function bridgeCuts(sec) {
  return bridgesOf(sec).map((b) => [b.c0, b.c1]);
}

/** D (quer zum Fluss) des Punkts x, s an der Brücke b. */
export const acrossOf = (b, x, s) => (s - b.sc) * b.cos - x * b.sin;

/** Liegt der Punkt x, s (Rahmen des Abschnitts) mit Radius r im Wasser oder in der Böschung einer Brücke aus list? */
export function inWater(list, x, s, r = 0) {
  for (let i = 0; i < list.length; i++) {
    const b = list[i];
    if (s < b.c0 - 2500 || s > b.c1 + 2500) continue;
    if (Math.abs(acrossOf(b, x, s)) < b.wing + r) return true;
  }
  return false;
}

/** Höhe des Geländes im Querschnitt an der Stelle D: Wasserspiegel, Böschung, Boden (ohne Brücke). */
export function terrainAt(b, D, ground = -0.02) {
  const a = Math.abs(D);
  if (a <= b.half) return -b.drop;
  if (a >= b.half + b.bank) return ground;
  const t = (a - b.half) / b.bank;
  // leicht gewölbt: unten flacher (Steinschüttung), oben steiler in den Boden
  return -b.drop + (ground + b.drop) * (t * 0.55 + t * t * 0.45);
}
