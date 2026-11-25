// Schilder der XXL-Welt als reine Daten (COMMON.md 9, ENGINE.md Nachtrag 11:39 UTC): wo steht welche Tafel mit
// welchen Texten. Die Welt baut genau diese Liste (signs.js; Baken und die Tafeln an Ende und Anfang einer Autobahn
// baut junction.js mit denselben Maßen von hier), __MA.xxl.signs() zeigt, was gerade steht, und der Knoten-Test
// (tools/xxl-test.mjs) prüft sie gegen trip.guidance() und die Kilometer des Navis. Keine Grafik, läuft unter Node.
//
// Ein Eintrag: {key, kind, s, x, side, frame, texts, …}. s: Meter auf dem Band (wie gefahren, wie guidance().dist),
// x: Lage quer im Rahmen frame (Rahmen-ID aus trip.js), side: +1 rechts der Fahrbahn, 0 darüber. texts: die Zeilen,
// die auf der Tafel stehen, in Leserichtung. key: stabil (gleicher Ort, gleiche Tafel → gleicher Schlüssel).
// Arten:
//   vorweg    Vorwegweiser 1000 m und 500 m vor einer Gabelung (fork.s − d): Texte aus trip.signs(fork)
//   ladepark  Tafel „Ladepark …“ mit Stecker 2000 m vor der Ausfahrt eines Ladeparks, wo der Abschnitt Platz hat
//             (src/map/parks.js parkBoard; ab ihr zählt das Navi die Meter, wenn es diese Ausfahrt ansagt)
//   bake      Ankündigungsbaken 300, 200, 100 m vor der Gabelung (drei, zwei, ein Schrägstreifen; ohne Text)
//   ausfahrt  „Ausfahrt“ mit Pfeil an der Inselspitze hinter der Gabelung
//   ende      Ende der Autobahn (vor der Verengung) · anfang: Anfang der Autobahn (hinter dem Einfädelpunkt)
//   tafel     Entfernungstafel (am Rand nach jeder Anschlussstelle, side 1, und auf den Schilderbrücken der Szenerie,
//             side 0): Orte geradeaus mit den Kartenkilometern, die das Navi für sie zeigt (siehe tableAt)
//   auffahrt  Wegweiser zur Autobahn am Beginn der Auffahrt: Straße und Richtung der Autobahn dahinter
//   ort       gelbe Ortstafel am Anfang einer Ortsdurchfahrt · ortsende: am Ende (Name genau wie places[].name)
//   ladesaeule  kleine Tafel „Ladesäule 100 m“ am Rand, POST_SIGN_D vor der Ladesäule des Orts (noch vor der Ortstafel;
//               steht die Säule hinter dem Brunnenplatz, „Ladesäule 50 m“ im Ort, map/parks.js postAt)
//   ladestele   hohe blaue Stele mit Stecker vorn im Streifen kurz vor dem Park der Ladesäule (charge.js CHARGE.stele)
//   ziel      Navi-Ziel: der Brunnenplatz des Zielorts am Zielpunkt spotS (der Wagen hält 2 m dahinter)
import { J, R as rampR } from '../../game/trip.js';
import { nodes, places, deTo, deEdge, deRoad, deTowards, straight, edgeLen, routeFrom, stateOfNode, excursion, COST } from '../../map/graph.js';
import { parkBoard, POST } from '../../map/parks.js';
import { steleOf } from './charge.js';
import { camerasOf } from './blitzer.js';

/** Vorwegweiser: so viele Meter vor der Gabelung (wie guidance().dist). */
export const BOARD_D = [1000, 500];
/** Ankündigungsbaken: so viele Meter vor der Gabelung (3, 2, 1 Schrägstreifen). */
export const BEACON_D = [300, 200, 100];
/** Orte, deren Ausfahrt näher als so viele Meter Straße liegt, stehen auf keiner Entfernungstafel. */
export const NEAR_ROAD = 2000;
/** Entfernungstafel am Rand: so weit hinter dem Anfang des Autobahnabschnitts (nach dem Beschleunigungsstreifen). */
export const TABLE_AFTER = 400;
/** … aber mindestens so weit vor dem ersten Vorwegweiser der nächsten Gabelung. */
const TABLE_GAP = 150;
/** „Ausfahrt“-Tafel an der Inselspitze: u Meter hinter der Gabelung. */
export const EXIT_SIGN_U = J.gore + 5;
/** Tafeln am Rand der Autobahn: Mitte so weit rechts (hinter der Planke bei 11,05). */
export const AB_SIGN_X = 13.4;
/** Baken und die Tafeln an Ende und Anfang der Autobahn: Mitte quer (Planke 11,05 plus 0,75 bzw. 1,6 m). */
export const BEACON_X = 11.8;
export const EDGE_SIGN_X = 12.65;
/** Ende der Autobahn: Tafel so weit vor der Gabelung (vor der Verengung, siehe junction.buildEnd). */
export const END_SIGN_D = J.close + 20 + 40;
/** Anfang der Autobahn: Tafel so weit hinter dem Einfädelpunkt. */
export const BEGIN_SIGN_U = 40;
/** Ortstafeln: so weit hinter dem Anfang bzw. vor dem Ende der Ortsdurchfahrt, quer auf dem Gehweg. */
export const TOWN_SIGN_IN = 6;
export const TOWN_SIGN_X = 12.35;
/**
 * Ladesäule des Orts (map/parks.js POST, Mitte des kleinen Parks POST.u hinter dem Ortsanfang): Ihre Tafel steht so
 * viele Meter davor am Rand – sonst sähe man die Säule erst auf den letzten 30 m.
 */
export const POST_SIGN_D = POST.sign;
/** Wegweiser zur Autobahn: so weit hinter dem Anfang der Auffahrt, quer hinter der Planke der Rampe. */
export const AUF_SIGN_IN = 14;
export const AUF_SIGN_X = 13.2;
/** So weit voraus (Kartenkilometer) sucht eine Entfernungstafel Orte; die Richtung der Autobahn darf so weit weg
 * liegen, alle anderen Orte höchstens FAR_KM. */
const WALK_KM = 900;
const FAR_KM = 450;

// --- Vorwegweiser -------------------------------------------------------------------------------------------------
/**
 * Inhalt eines Vorwegweisers aus trip.signs(fork): Kopf (Name der Ausfahrt bzw. des Kreuzes, „Autobahnende“), Bild
 * ('ausfahrt' | 'kreuz' | 'ende'), no (Nummer der Anschlussstelle im Kästchen neben dem Bild, 0 = keine), bis zu vier
 * Zeilen (Straße und Richtung der abgehenden Straßen, dann die Orte der
 * Ausfahrt; liegt dort ein Ladepark, ist die letzte Zeile seine, mit Stecker: kind 'park') und die Entfernung. texts:
 * dieselben Angaben als Zeilen (für das Schilder-Log und die Prüfung).
 */
export function boardOf(sg, d) {
  const exit = sg.title.startsWith('Ausfahrt ');
  const pict = sg.title === 'Autobahnende' ? 'ende' : exit ? 'ausfahrt' : 'kreuz';
  const head = exit ? sg.title.slice('Ausfahrt '.length) : sg.title;
  const rows = [];
  const seen = new Set([head]);
  if (pict === 'ende' && sg.name) {
    rows.push({ road: null, kind: null, text: sg.name });
    seen.add(sg.name);
  }
  const max = sg.park ? 3 : 4;
  const exits = sg.exits.slice().sort((a, b) => (a.kind === 'ab' ? 0 : 1) - (b.kind === 'ab' ? 0 : 1));
  for (const e of exits) {
    if (rows.length >= max) break;
    rows.push({ road: e.road, kind: e.kind, text: e.towards });
    seen.add(e.towards);
  }
  for (const p of sg.places) {
    if (rows.length >= max) break;
    if (seen.has(p)) continue;
    rows.push({ road: null, kind: null, text: p });
    seen.add(p);
  }
  if (sg.park) rows.push({ road: null, kind: 'park', text: sg.park });
  const dist = d + ' m';
  const texts = [sg.title, ...rows.map((r) => (r.road ? r.road + ' ' : '') + r.text), dist];
  return { head, pict, no: sg.no || 0, rows, dist, title: sg.title, texts };
}

// --- Entfernungstafeln --------------------------------------------------------------------------------------------
const routes = new Map(); // gerichtete Kante → routeFrom (die letzten paar; eine Suche kostet einige Millisekunden)
function routeFromCached(de) {
  let r = routes.get(de);
  if (r) {
    routes.delete(de);
    routes.set(de, r);
    return r;
  }
  r = routeFrom(de);
  routes.set(de, r);
  if (routes.size > 8) routes.delete(routes.keys().next().value);
  return r;
}

/**
 * Orte geradeaus auf der Autobahn ab s (secs: die Abschnitte eines Wegs, s liegt in einem Autobahnabschnitt) mit den
 * Kartenkilometern, die das Navi für sie zeigen würde: genau wie trip.reach(), wäre der Ort das Ziel (Rest der
 * Kante, die Kanten geradeaus, die Abfahrt, der Abstecher bis zum Zielpunkt im Ort). Nur Orte, die das Navi auch über
 * diese Autobahn und genau diese Ausfahrt anfahren würde (sonst zeigte es eine andere Zahl), und keine, deren
 * Ausfahrt näher als NEAR_ROAD Meter Straße liegt (deren Tafeln zeigen Meter).
 * Ergebnis in Fahrtrichtung: [{place, name, km, d (Meter Straße bis zur Gabelung), node, pop}].
 */
export function placesAhead(secs, s) {
  const c0 = secs.find((c) => c.kind === 'ab' && s >= c.s0 && s < c.s1);
  if (!c0) return [];
  const R = routeFromCached(c0.de);
  const out = [];
  let km = (c0.s1 - s) * c0.kmPerM; // Kartenkilometer bis zum Knoten am Ende der Kante
  let d = c0.s1 - s; // Meter Straße bis zu seiner Gabelung
  let cost = 0; // Kosten geradeaus ab dem Zustand c0.de bis zu diesem Knoten (wie in graph.js)
  let de = c0.de;
  // die Rampe der Abfahrt ist echte Straße: ihre Meter zählen als Kilometer mit, wie trip.reach() sie zählt
  const exitKm = J.ramp / 1000;
  for (let guard = 0; guard < 80; guard++) {
    const N = deTo(de);
    if (d >= NEAR_ROAD && Math.abs(R.cost[stateOfNode(N)] - (cost + COST.exit)) < 1e-6) {
      for (const p of nodes[N].places) {
        if (places[p.place].node !== N) continue;
        out.push({ place: p.place, name: places[p.place].name, km: km + exitKm + excursion(p.place).km, d, node: N, pop: places[p.place].pop });
      }
    }
    const st = straight(de);
    if (st < 0 || km > WALK_KM) break;
    const e = deEdge(st);
    km += e.km;
    d += edgeLen(e);
    cost += e.km;
    de = st;
  }
  return out;
}

/**
 * Zeilen einer Entfernungstafel bei s (höchstens max): das Nahziel (der größte Ort unter den nächsten, die weniger als
 * 15 km hinter dem nächsten liegen), die Richtung dieser Autobahn (deTowards wie auf den Vorwegweisern), die größte
 * Stadt ab 50 000 Einwohnern bis FAR_KM, dann die größten übrigen bis FAR_KM. Zwei Zeilen liegen mindestens 15 km
 * auseinander. Aufsteigend nach Kilometern wie auf echten Tafeln, km ganzzahlig.
 */
export function tableAt(secs, s, max = 3) {
  const all = placesAhead(secs, s);
  if (!all.length) return [];
  const c0 = secs.find((c) => c.kind === 'ab' && s >= c.s0 && s < c.s1);
  const pick = [];
  const apart = (p) => pick.every((q) => Math.abs(q.km - p.km) >= 15);
  const best = (list) => {
    let b = null;
    for (const p of list) if (!pick.includes(p) && apart(p) && (!b || p.pop > b.pop)) b = p;
    return b;
  };
  const add = (p) => {
    if (p && pick.length < max && !pick.includes(p) && apart(p)) pick.push(p);
  };
  const near = all.filter((p) => p.km - all[0].km < 15);
  add(best(near));
  const tw = deTowards(c0.de).i;
  add(all.find((p) => p.node === tw));
  const inReach = all.filter((p) => p.km <= FAR_KM);
  add(best(inReach.filter((p) => p.pop >= 50000)));
  while (pick.length < max) {
    const b = best(inReach);
    if (!b) break;
    add(b);
  }
  pick.sort((a, b) => a.km - b.km);
  return pick.map((p) => ({ place: p.place, name: p.name, km: Math.round(p.km), node: p.node }));
}
const tableTexts = (rows) => rows.map((r) => r.name + ' ' + r.km + ' km');

/**
 * Stelle der Entfernungstafel eines Autobahnabschnitts: nach der Anschlussstelle (hinter dem Beschleunigungsstreifen
 * bzw. der Gabelung davor), mindestens TABLE_GAP vor dem ersten Vorwegweiser der nächsten Gabelung.
 */
export function tableS(sec) {
  let s = sec.s0 + TABLE_AFTER;
  if (sec.fork) s = Math.min(s, sec.fork.s - BOARD_D[0] - TABLE_GAP);
  return Math.max(s, sec.s0 + J.accel + 30);
}

// --- Alle Schilder eines Abschnitts -------------------------------------------------------------------------------
/**
 * Schilder eines Abschnitts sec auf seinem Weg (secs: alle Abschnitte des Wegs, für die Nachbarn), in out angehängt.
 * opts.target: Navi-Ziel (Index in places) für den Eintrag 'ziel'; opts.tables: false = keine Entfernungstafeln
 * (die braucht der Test nur an ausgewählten Stellen, sie kosten eine Wegsuche).
 */
const cache = new WeakMap(); // Abschnitt → seine Schilder ohne 'ziel' (die Texte hängen nur an Karte und Abschnitt)
export function sectionSigns(trip, secs, sec, out, opts = {}) {
  let list = cache.get(sec);
  if (!list || (opts.tables !== false && !list.tables)) {
    list = sectionSigns0(trip, secs, sec, [], opts);
    list.tables = opts.tables !== false;
    cache.set(sec, list);
  }
  for (let i = 0; i < list.length; i++) out.push(list[i]);
  if (sec.kind === 'stadt' && opts.target === sec.place && sec.place >= 0 && !sec.start && sec.spotS !== undefined) {
    out.push({ key: 'ziel|o' + sec.place + '@' + sec.node + '|' + Math.round(sec.spotS * 10), kind: 'ziel', s: sec.spotS, x: 0, side: 0, frame: sec.frame, texts: [places[sec.place].name], place: sec.place });
  }
  return out;
}
function sectionSigns0(trip, secs, sec, out, opts) {
  const fr = sec.frame;
  const push = (kind, s, x, side, texts, extra = {}) => {
    out.push({ key: kind + '|' + (extra.keyPart ?? sec.id) + '|' + Math.round(s * 10), kind, s, x, side, frame: fr, texts, ...extra });
  };
  if (sec.kind === 'ab') {
    const f = sec.fork;
    if (f) {
      const sg = trip.signs(f);
      const fk = 'f' + f.de + '@' + Math.round(f.s);
      for (const d of BOARD_D) {
        const b = boardOf(sg, d);
        push('vorweg', f.s - d, AB_SIGN_X, 1, b.texts, { keyPart: fk, fork: f.id, node: f.node, dist: d, title: b.title, no: b.no, board: b });
      }
      const pb = parkBoard(f);
      if (pb) push('ladepark', f.s - pb, AB_SIGN_X, 1, [sg.park, pb + ' m'], { keyPart: fk, fork: f.id, node: f.node, dist: pb, name: sg.park });
      BEACON_D.forEach((d, i) => push('bake', f.s - d, BEACON_X, 1, [], { keyPart: fk, fork: f.id, node: f.node, dist: d, stripes: 3 - i }));
      if (!f.forced) {
        const u = EXIT_SIGN_U;
        push('ausfahrt', f.s + u, (10.5 + rampR(u) + 6.5) / 2, 1, ['Ausfahrt'], { keyPart: fk, fork: f.id, node: f.node });
      } else push('ende', f.s - END_SIGN_D, EDGE_SIGN_X, 1, ['Ende der Autobahn'], { keyPart: fk, fork: f.id, node: f.node });
    }
    if (sec.merge && sec.begins) push('anfang', sec.merge.s + BEGIN_SIGN_U, EDGE_SIGN_X, 1, ['Autobahn'], { keyPart: 'm' + sec.de + '@' + Math.round(sec.merge.s) });
    if (opts.tables !== false) {
      const s = tableS(sec);
      const rows = tableAt(secs, s);
      if (rows.length) push('tafel', s, AB_SIGN_X, 1, tableTexts(rows), { keyPart: 'a' + sec.de + '@' + Math.round(sec.s0), rows });
    }
    return out;
  }
  if (sec.kind === 'auf' && sec.de >= 0) {
    const road = deRoad(sec.de).label;
    const towards = deTowards(sec.de).name;
    push('auffahrt', sec.s0 + AUF_SIGN_IN, AUF_SIGN_X, 1, [road, towards], { keyPart: 'u' + sec.de + '@' + sec.node, road, towards });
  }
  if (sec.kind === 'stadt' && sec.place >= 0) {
    const name = places[sec.place].name;
    const k = 'o' + sec.place + '@' + sec.node;
    if (!sec.start) push('ort', sec.s0 + TOWN_SIGN_IN, TOWN_SIGN_X, 1, [name], { keyPart: k, place: sec.place });
    // die Ladesäule am Ortsanfang (Start: der Supercharger, an dem die Fahrt beginnt, braucht keine Tafel)
    if (!sec.start) {
      // vor der Säule des Orts – vor dem Brunnenplatz noch vor der Ortstafel, hinter ihm 50 m davor (parks.js postAt)
      const pa = sec.postAt || { u: POST.u, sign: POST_SIGN_D };
      push('ladesaeule', sec.s0 + pa.u - pa.sign, TOWN_SIGN_X, 1, ['Ladesäule', pa.sign + ' m'], { keyPart: k, place: sec.place, dist: pa.sign });
    }
    const st = steleOf(sec);
    if (st) push('ladestele', sec.s0 + st.u, st.x, 1, ['Ladesäule', 'Einfahrt'], { keyPart: k, place: sec.place });
    push('ortsende', sec.s1 - TOWN_SIGN_IN, TOWN_SIGN_X, 1, [name], { keyPart: k, place: sec.place });
  }
  // Blitzer im Ort und auf der Landstraße (blitzer.js): fest an seinem Ort, ohne Schild davor
  for (const c of camerasOf(sec)) push('blitzer', c.s, c.x, 1, [], { y: c.y, limit: c.limit });
  return out;
}

/** Alle Schilder eines Wegs mit lo ≤ s ≤ hi (für den Test und für Prüfhilfen). */
export function signsAlong(trip, path, lo, hi, opts = {}) {
  const out = [];
  const secs = path.sections;
  for (const sec of secs) {
    // Vorwegweiser stehen bis 1000 m vor dem Ende des Abschnitts, die Ortsende-Tafel am Ende, die Tafel der Ladesäule
    // eines Orts noch vor seinem Anfang
    if (sec.s1 < lo || sec.s0 - Math.max(10, POST_SIGN_D - POST.u + 10) > hi) continue;
    const mine = [];
    sectionSigns(trip, secs, sec, mine, opts);
    for (const e of mine) if (e.s >= lo && e.s <= hi) out.push(e);
  }
  out.sort((a, b) => a.s - b.s);
  return out;
}
