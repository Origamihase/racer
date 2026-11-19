// Ladeparks an Autobahn-Ausfahrten („Autohof“): An ausgewählten Anschlussstellen liegt hinter einem kurzen Zubringer
// ein Ladepark mit freien Säulen, einem kleinen Rasthaus und Bäumen – dort lädt Mini Adam den Akku (REISE.md A5).
// Rein rechnerisch aus der Karte (graph.js), läuft auch unter Node: dieselbe Liste für die Fahrt (trip.js), das Navi,
// die Schilder, die Welt und die Tests. Ladeparks sind keine Orte: Sie stehen nicht in places, kein Gebot nennt sie,
// und bei „Orte entdeckt“ zählen sie nicht mit.
//
// Die Regel (tools/trip-test.mjs prüft sie): Kandidaten sind Ausfahrten („Ausfahrt …“, kein Kreuz), an denen jede
// ankommende Autobahn weitergeht (straight): Hinter dem Park geht es auf derselben Autobahn in derselben Richtung
// weiter, nie über ein „Bitte wenden“. Je Autobahn in der Reihenfolge ihrer Knoten, gemessen in Kartenkilometern ihrer
// Kanten: Ein Park, den schon eine andere Autobahn an einem gemeinsamen Knoten bekommen hat, zählt auch hier, wenn er
// höchstens PARK.max hinter dem vorigen liegt; sonst liegt der nächste Park am Kandidaten, dessen Abstand zum vorigen
// (beim ersten: zum Anfang der Autobahn) zwischen PARK.min und PARK.max liegt – lieber an einer Ausfahrt ohne Ort
// (dort führt das Abfahren ohne Navi sonst in den Ort), dann so nah wie möglich an PARK.aim; liegt keiner im Fenster,
// am ersten dahinter (dort sind die Kanten länger als das Fenster). Benannt ist er nach dem nächsten Ort der Karte
// (Luftlinie), mit der Kürzung der Ortsschilder.
import { nodes, edges, roads, places, deKind, deRev, straight, distKm, bearing, nodeTitle, stateOfNode, zubLen, routeGoal, COST, PACE } from './graph.js';
import { signName } from '../world/kit/layout.js';

/** Maße in Kartenkilometern (Abstände) und Metern Straße (Abschnitte, wie gefahren). */
export const PARK = {
  min: 40, // Abstand zweier Parks an einer Autobahn: Fenster und Wunschwert
  aim: 55,
  max: 70,
  zub: 470, // Zubringer von der Rampe zum Park, echte Straße (eigener Mindestwert in zubLen): danach endet der Wald der
  // Ausfahrt (J.hide + J.curtainAfter + 60 = 710 m hinter der Gabelung), der Park liegt frei
  len: 250, // Abschnitt 'park': Straße wie im Ort, rechts hinter dem Gehweg der Ladepark
  u: 110, // Mitte des Ladeparks längs des Abschnitts (Meter ab seinem Anfang)
  halt: 111.45, // Wagenmitte beim Halt: auf Höhe der freien Heldenbucht (xxl/charge.js: u − bay[0] + off)
  back: 930, // Zubringer zurück zur Auffahrt hinter einer Ausfahrt: J.ramp + zub + len + back + J.auf = J.hide + J.show
};
/** Der Halt liegt so weit hinter dem Haltepunkt spotS (wie am Brunnen: das Ereignis kommt, ehe der Wagen steht). */
export const PARK_STOP_AFTER = 2;

/** Ausfahrt, an der jede ankommende Autobahn weitergeht? (Kandidat für einen Ladepark) */
export function parkCandidate(nd) {
  if (nd.kind === 'kreuz' || !nodeTitle(nd).startsWith('Ausfahrt ')) return false;
  const ins = nd.edges.map(deRev).filter((de) => deKind(de) === 'ab');
  return ins.length > 0 && ins.every((de) => straight(de) >= 0);
}

/** Kante einer Straße zwischen zwei aufeinanderfolgenden Knoten (oder undefined). */
function edgeOn(road, a, b) {
  for (const de of nodes[a].edges) {
    const e = edges[de >> 1];
    if (e.road === road && (e.a === b || e.b === b)) return e;
  }
  return undefined;
}

function nearestPlace(nd) {
  let best = -1;
  let bd = Infinity;
  for (const p of places) {
    const d = distKm(nd.lat, nd.lon, p.lat, p.lon);
    if (d < bd) {
      bd = d;
      best = p.i;
    }
  }
  return { place: best, km: bd };
}

/**
 * Die Ladeparks nach der Regel oben, rein aus der Karte: [{ i, node, road (Index in roads, deren Lauf ihn gesetzt hat),
 * at (Kartenkilometer ab ihrem Anfang), gap (zum vorigen Park auf ihr), place (nächster Ort), name }].
 */
export function placeParks() {
  const out = [];
  const byNode = new Map();
  const names = new Set();
  for (const r of roads) {
    if (r.kind !== 'ab') continue;
    const ns = r.nodes;
    let km = 0;
    const cand = [];
    for (let i = 0; i < ns.length; i++) {
      if (i > 0) {
        const e = edgeOn(r.i, ns[i - 1], ns[i]);
        if (!e) break; // die Straße ist hier unterbrochen: weiter nur bis hierher
        km += e.km;
      }
      const nd = nodes[ns[i]];
      if (parkCandidate(nd)) cand.push({ node: nd.i, at: km, town: nd.places.some((p) => p.zubKm < 1.5) });
    }
    let last = 0;
    for (let k = 0; k < cand.length; ) {
      let pick = -1;
      for (let j = k; j < cand.length && cand[j].at - last <= PARK.max; j++) {
        if (byNode.has(cand[j].node)) {
          pick = j;
          break;
        }
      }
      if (pick < 0) {
        let key = Infinity;
        for (let j = k; j < cand.length; j++) {
          const d = cand[j].at - last;
          if (d < PARK.min) continue;
          if (d > PARK.max) {
            if (pick < 0) pick = j;
            break;
          }
          const q = (cand[j].town ? 1000 : 0) + Math.abs(d - PARK.aim);
          if (q < key) {
            key = q;
            pick = j;
          }
        }
      }
      if (pick < 0) break;
      const c = cand[pick];
      if (!byNode.has(c.node)) {
        // Name nach dem nächsten Ort; trägt ihn schon ein anderer Park, nach der Ausfahrt (wie auf ihren Schildern), und
        // ist auch der vergeben, mit der Himmelsrichtung vom Ort aus (wie echte Autohöfe: „Alsfeld-Ost“)
        const nd = nodes[c.node];
        const np = nearestPlace(nd);
        const pl = places[np.place];
        let name = 'Ladepark ' + signName(pl.name);
        if (names.has(name)) name = 'Ladepark ' + signName(nd.name);
        if (names.has(name)) name = 'Ladepark ' + signName(pl.name) + '-' + ['Nord', 'Ost', 'Süd', 'West'][Math.round(bearing(pl.lat, pl.lon, nd.lat, nd.lon) / 90) % 4];
        names.add(name);
        out.push({ i: out.length, node: c.node, road: r.i, at: c.at, gap: c.at - last, place: np.place, name });
        byNode.set(c.node, out.length - 1);
      }
      last = c.at;
      k = pick + 1;
    }
  }
  return out;
}
/** Alle Ladeparks (placeParks, einmal gerechnet). */
export const PARKS = placeParks();
const BY_NODE = new Map(PARKS.map((p) => [p.node, p.i]));

/** Ladepark an diesem Knoten (Index in PARKS) oder −1. */
export const parkAt = (node) => (BY_NODE.has(node) ? BY_NODE.get(node) : -1);

/** Länge des Zubringers zum Park (Meter Straße): der Park liegt gleich an der Ausfahrt, eigener Mindestwert. */
export const parkZub = () => zubLen(0, PARK.zub);

/**
 * Reisekilometer, Fahrzeit und Kosten vom Ende der Rampe bis zum Halt im Park – genau die Abschnitte, die die Fahrt
 * dafür anlegt (Trip.addPark): Zubringer und Park sind echte Straße (1:1).
 */
export function parkExcursion() {
  const zl = parkZub();
  return { cost: ((zl + PARK.halt) / 1000) * COST.land, km: (zl + PARK.halt) / 1000, secs: zl / PACE.land + PARK.halt / PACE.stadt, m: zl + PARK.halt };
}

/**
 * Der beste Weg von überall zum Ladepark i (wie routeTo zu einem Ort, Ziel ist sein Knoten). Ergebnis wie routeTo, dazu
 * park = i und place = −1. road: nur über Straßen.
 */
export function routeToPark(i, road = false) {
  return { ...routeGoal(stateOfNode(PARKS[i].node), parkExcursion(), road), place: -1, park: i };
}
