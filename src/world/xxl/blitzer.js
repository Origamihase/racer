// Blitzer in Orten und auf Landstraßen (der Besitzer am 24.11.2026: „Blitzer sollte es auch in der Stadt und auf der
// Landstraße geben“). Rein rechnerisch (ohne three.js, auch für die Node-Tests): Ob ein Abschnitt einen Blitzer hat und
// wo er steht, hängt nur am Ort bzw. an der Straße der Karte (Name des Orts, Kante der Landstraße, Knoten des
// Zubringers) – jede Fahrt dort findet ihn an derselben Stelle, nie zufällig je Bild oder je Stream. Die Welt baut ihn
// aus diesem Plan (Eintrag 'blitzer' in signplan.js, gebaut von signs.js; der Ortsplan hält ihm den Platz frei,
// kit/layout.js Regel 8), das Spiel prüft ihn aus demselben Plan (game/parts/ereignisse.js) – eine Wahrheit. Gemessen
// wird das Tempolimit, das dort gilt (im Ort 50, auf der Landstraße 100, wie die Anzeige es zeigt). Eine Warnung vorher
// gibt es nur mit dem Radarwarner aus dem Shop.
import { places } from '../../map/graph.js';
import { PROFILES } from '../../game/trip.js';
import { hashKey } from '../kit/layout.js';
import { squareOf } from './plan.js';
import { chargeOf, steleOf, CHARGE } from './charge.js';
import { schrankeOf } from './schranke.js';

export const BLITZER = {
  town: 0.3, // Anteil der Orte (Ortsdurchfahrten) mit Blitzer
  landPerM: 1 / 25000, // Landstraße und Zubringer: Wahrscheinlichkeit je Meter Länge (höchstens landMax)
  landMax: 0.5,
  landEdge: 300, // so weit bleibt er vom Anfang und Ende einer Landstraße weg (Ortsausgang, Ortseingang, Auffahrt)
  townFrom: 95, // im Ort frühestens hier (hinter Ortstafel und Bezahlschranke) …
  townEnd: 45, // … und spätestens so weit vor dem Ortsende
  keep: 24, // so weit bleibt er von Ladepark, Stele, Schranke und Brunnenplatz weg
  x: { stadt: 12.35, land: 12.55 }, // seitlich: im Streifen am rechten Bordstein bzw. auf dem Bankett
  y: { stadt: 0.12, land: 0 },
  tol: 3, // geblitzt wird über Limit + tol km/h (bis 100 km/h; darüber über Limit + over, wie seit jeher an der Autobahn)
  over: 0.05,
};

/** Ab welchem Tempo (km/h) ein Blitzer mit diesem Limit auslöst (Autobahn 120: über 126). */
export function triggerKmh(limit) {
  return limit <= 100 ? limit + BLITZER.tol : limit * (1 + BLITZER.over);
}

const frac = (h) => (h % 10007) / 10007;

/** Platz eines Blitzers im Ort (u, Meter ab Ortsbeginn) oder null, wenn keiner frei bleibt. */
function townSpot(sec, h) {
  const len = sec.s1 - sec.s0;
  const a = BLITZER.townFrom;
  const b = len - BLITZER.townEnd;
  if (b <= a) return null;
  const keepOut = [];
  const c = chargeOf(sec);
  if (c) keepOut.push([c.u - CHARGE.half - BLITZER.keep, c.u + CHARGE.half + BLITZER.keep]);
  const st = steleOf(sec);
  if (st) keepOut.push([st.u - BLITZER.keep, st.u + BLITZER.keep]);
  const sb = schrankeOf(sec);
  if (sb) keepOut.push([sb.u - BLITZER.keep, sb.u + BLITZER.keep]);
  const q = squareOf(sec);
  if (q) keepOut.push([q.s0 - sec.s0 - BLITZER.keep, q.s1 - sec.s0 + BLITZER.keep]);
  // der Platz, den der Ort ohne Insel rechts hat (am Start), bleibt ohnehin frei: dort steht keiner (kein Start-Blitzer)
  for (let k = 0; k < 12; k++) {
    const u = a + frac(h + k * 7919) * (b - a);
    if (!keepOut.some(([lo, hi]) => u > lo && u < hi)) return Math.round(u * 10) / 10;
  }
  return null;
}

const cache = new WeakMap();
/**
 * Blitzer eines Abschnitts: [] oder [{ key, kind ('stadt' | 'land'), s (Meter der Fahrt), u (ab Abschnittsbeginn), x,
 * y, limit (km/h), frame, place }]. Im Ort (nicht am Start, nicht im Ladepark hinter einer Ausfahrt) für BLITZER.town
 * der Orte, auf einer Landstraße je nach Länge (BLITZER.landPerM). Derselbe Abschnitt bekommt dieselbe Liste.
 */
export function camerasOf(sec) {
  if (!sec) return [];
  let list = cache.get(sec);
  if (list) return list;
  list = [];
  const len = sec.s1 - sec.s0;
  if (sec.kind === 'stadt' && !sec.start && places[sec.place]) {
    const h = hashKey('Blitzer ' + places[sec.place].key);
    if (frac(h) < BLITZER.town) {
      const u = townSpot(sec, hashKey('Blitzerplatz ' + places[sec.place].key));
      if (u !== null) list.push({ kind: 'stadt', u, limit: PROFILES.stadt.limit, place: sec.place });
    }
  } else if ((sec.kind === 'land' || sec.kind === 'zub') && len > 2 * BLITZER.landEdge + 200) {
    // die Straße der Karte: eine Landstraße ist ihre gerichtete Kante, ein Zubringer sein Knoten mit Ort bzw. Park
    // und Richtung
    const road = sec.kind === 'land' ? 'L' + sec.de : ['Z', sec.node, sec.place ?? -1, sec.park ?? -1, sec.back ? 1 : 0, sec.transitTo ?? -1].join('|');
    const h = hashKey('Blitzer Landstraße ' + road);
    if (frac(h) < Math.min(BLITZER.landMax, len * BLITZER.landPerM)) {
      const u = BLITZER.landEdge + frac(hashKey('Blitzerplatz Landstraße ' + road)) * (len - 2 * BLITZER.landEdge);
      list.push({ kind: 'land', u: Math.round(u * 10) / 10, limit: PROFILES.land.limit, place: -1 });
    }
  }
  for (const c of list) {
    c.s = sec.s0 + c.u;
    c.x = BLITZER.x[c.kind];
    c.y = BLITZER.y[c.kind];
    c.frame = sec.frame;
    c.key = 'blitzer|' + sec.id + '|' + Math.round(c.u * 10);
  }
  cache.set(sec, list);
  return list;
}

/** Blitzer auf einem Weg (Abschnitte secs) mit lo ≤ s ≤ hi, nach s geordnet. */
export function camerasAlong(secs, lo, hi) {
  const out = [];
  for (const sec of secs) {
    if (sec.s1 < lo || sec.s0 > hi) continue;
    for (const c of camerasOf(sec)) if (c.s >= lo && c.s <= hi) out.push(c);
  }
  return out.sort((a, b) => a.s - b.s);
}
