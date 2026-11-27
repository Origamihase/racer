// Reicht der Akku überall? Das Ladenetz der Karte als Rechnung (ohne Grafik, läuft unter Node; für den Prüfstand
// tools/laden-test.mjs und für tools/map/ladeparks.mjs, nicht für das Spiel selbst).
//
// Gerechnet wird auf denselben Zuständen wie die Routen (graph.js: unterwegs auf einer gerichteten Kante, oder am Knoten
// abseits der Autobahn) in Prozent Akku: Meter Straße je Art (offene Strecke im Zeitraffer, echte Straße 1:1) mal dem
// Verbrauch, den OMI vor der ersten Messung annimmt (REISE_AKKU.perM, gemessen bei gleichmäßiger Fahrt um 140 km/h).
// Ladeplätze zählen nur, wo die Fahrt sie kennt und OMI sie nennen kann (trip.js restsAhead): die Ladeparks (an der
// Ausfahrt, am Rasthof einer Landstraße) und die Ladesäulen der Orte, durch die die Straße selbst führt (Orte an der
// Landstraße, der Ort am Ende einer Autobahn). Die Säule eines Orts hinter einer gewöhnlichen Ausfahrt zählt nicht mit:
// Sie liegt nur am Weg, wenn man dort abfährt.
//
// Je Zustand s: back(s) = so viel Akku braucht es mindestens vom letzten Ladeplatz bis hierher, ahead(s) = so viel
// mindestens von hier bis zum nächsten. gap(s) = back + ahead: Wer hier vorbeikommt, braucht zwischen zwei Ladeplätzen
// mindestens so viel Akku. Liegt gap über 100, verreckt jeder dort. Das Netz bleibt überall unter LADENETZ.max und fast
// überall unter LADENETZ.aim, damit OMIs Warnungen (REISE_AKKU.warn, früh bei REISE_AKKU.early) Luft für schnelleres
// Fahren lassen. Nicht mit gezählt werden Orte, die nur über eine Überfahrt erreichbar sind (Dublin, Kapstadt …): Dorthin
// führt das Navi nur, wenn sie das Ziel sind, und dann hält der Wagen an ihrer Säule.
import { nodes, edges, places, edgeLen, deTo, deFrom, straight, townLen, zubLen, transitions } from './graph.js';
import { PARK, POST, parkAt, parkZub } from './parks.js';
import { REISE_AKKU } from '../data.js';

/** Meter der Knotenpunkte wie trip.js J (journey-test prüft die Werte gegeneinander). */
export const NETZ_M = { ramp: 250, conn: 1650, auf: 250, back: 1850, feed: 350, term: 220, termOut: 150 };
/**
 * So viel Akku (Prozent) darf das Netz zwischen zwei Ladeplätzen höchstens verlangen (gap): max überall (der Prüfstand
 * hält es), aim ist das Ziel von tools/map/ladeparks.mjs (darüber bleiben nur Stellen, an denen keine Ausfahrt einen
 * Park tragen kann, etwa in Den Haag oder Nancy). Gebaut wurde das Netz mit dem vollen Verbrauch; seit der Akku halb
 * so schnell sinkt (data.js AKKU_TEMPO), verlangt es höchstens 43 %.
 */
export const LADENETZ = { aim: 75, max: 90 };

const NE = edges.length * 2;
const N = NE + nodes.length;

/** Der Ort, durch den die Fahrt am Ende einer Autobahn (Ausfahrt ohne Weiterfahrt) fährt, oder null. */
function endTown(de) {
  if (edges[de >> 1].kind !== 'ab' || straight(de) >= 0) return null;
  const nd = nodes[deTo(de)];
  return nd.places.length ? nd.places[0] : null;
}

/**
 * Das Netz mit Verbrauch perM ({ open, real }: Prozent je Meter Straße, Standard REISE_AKKU.perM) und Ladeparks am
 * Knoten parkNode(n) (Standard: parks.js parkAt(n) >= 0). Ergebnis { back, ahead, gap: Float64Array je Zustand
 * (Infinity: kein Ladeplatz erreichbar bzw. keiner davor), N, NE, name(s) }.
 */
export function ladenetz(perM = REISE_AKKU.perM, parkNode = (n) => parkAt(n) >= 0) {
  const need = (open, real) => open * perM.open + real * perM.real;
  const M = NETZ_M;
  const fwd = Array.from({ length: N }, () => []);
  const rev = Array.from({ length: N }, () => []);
  const link = (a, b, pct) => {
    fwd[a].push({ to: b, pct });
    rev[b].push({ from: a, pct });
  };
  const toCharger = new Float64Array(N).fill(Infinity); // von s bis zum Halt an einem Ladeplatz, ohne Umweg
  const after = new Float64Array(N).fill(Infinity); // nach dem Laden: Bedarf bis zum Zustand s
  const take = (arr, s, v) => {
    if (v < arr[s]) arr[s] = v;
  };
  for (let st = 0; st < N; st++) {
    for (const t of transitions(st)) {
      let pct;
      if (t.type === 'stay') pct = need(edgeLen(edges[t.to >> 1]), 0);
      else if (t.type === 'exit') pct = need(0, M.ramp);
      else if (t.type === 'node') pct = 0; // Ort oder Park am Ende der Landstraße: unten
      else if (t.type === 'enter') pct = edges[t.de >> 1].kind === 'ab' ? need(edgeLen(edges[t.de >> 1]), M.conn + M.auf) : need(edgeLen(edges[t.de >> 1]), 0);
      else pct = need(0, M.feed + M.term + M.termOut + M.back);
      if (t.type === 'node') {
        // Landstraße: am Knoten der Ladepark eines Rasthofs oder der Ort mit seiner Säule (beides gleich an der Straße)
        const h = deTo(st);
        const town = nodes[h].places.find((p) => p.zubKm < 1.5);
        if (parkNode(h)) {
          take(toCharger, st, need(0, PARK.halt));
          take(after, NE + h, need(0, PARK.len - PARK.halt));
          pct = need(0, PARK.len);
        } else if (town) {
          const tl = townLen(places[town.place].pop);
          take(toCharger, st, need(0, POST.halt));
          take(after, NE + h, need(0, tl - POST.halt));
          pct = need(0, tl);
        }
      }
      link(st, t.to, pct);
    }
    if (st < NE && edges[st >> 1].kind === 'ab') {
      const h = deTo(st);
      if (parkNode(h)) {
        // Ladepark hinter der Ausfahrt; danach dieselbe Autobahn in derselben Richtung
        take(toCharger, st, need(0, M.ramp + parkZub() + PARK.halt));
        const sd = straight(st);
        if (sd >= 0) take(after, sd, need(edgeLen(edges[sd >> 1]), PARK.len - PARK.halt + PARK.back + M.auf));
        take(after, NE + h, 0);
      } else {
        const town = endTown(st);
        if (town) {
          // Ende der Autobahn: die Straße führt durch den Ort (trip.js planExit, forced)
          const zl = zubLen(town.zubKm);
          const scaled = town.zubKm * 1000 > zl;
          take(toCharger, st, need(scaled ? zl : 0, M.ramp + (scaled ? 0 : zl) + POST.halt));
          take(after, NE + h, need(0, townLen(places[town.place].pop) - POST.halt + M.back - M.conn));
        }
      }
    }
  }
  // am Knoten eines Parks steht man nur, wenn man durch ihn kam (jedes Abfahren dort führt hinein)
  for (const nd of nodes) if (parkNode(nd.i)) take(toCharger, NE + nd.i, 0);

  const ahead = dijkstra(toCharger, rev, 'from');
  const back = dijkstra(after, fwd, 'to');
  const gap = new Float64Array(N);
  for (let s = 0; s < N; s++) gap[s] = back[s] + ahead[s];
  const name = (s) =>
    s < NE
      ? `${nodes[deFrom(s)].name} → ${nodes[deTo(s)].name}`
      : `am Knoten ${nodes[s - NE].name}`;
  return { back, ahead, gap, N, NE, name };
}

function dijkstra(init, adj, key) {
  const d = Float64Array.from(init);
  const hk = [];
  const hv = [];
  const push = (k, v) => {
    let i = hk.length;
    hk.push(k);
    hv.push(v);
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (hk[p] <= k) break;
      hk[i] = hk[p];
      hv[i] = hv[p];
      i = p;
    }
    hk[i] = k;
    hv[i] = v;
  };
  const pop = () => {
    const k0 = hk[0];
    const v0 = hv[0];
    const k = hk.pop();
    const v = hv.pop();
    const n = hk.length;
    if (n > 0) {
      let i = 0;
      for (;;) {
        let c = 2 * i + 1;
        if (c >= n) break;
        if (c + 1 < n && hk[c + 1] < hk[c]) c++;
        if (hk[c] >= k) break;
        hk[i] = hk[c];
        hv[i] = hv[c];
        i = c;
      }
      hk[i] = k;
      hv[i] = v;
    }
    return [k0, v0];
  };
  for (let s = 0; s < d.length; s++) if (isFinite(d[s])) push(d[s], s);
  while (hk.length) {
    const [k, s] = pop();
    if (k > d[s]) continue;
    for (const t of adj[s]) {
      const o = t[key];
      const nk = k + t.pct;
      if (nk < d[o]) {
        d[o] = nk;
        push(nk, o);
      }
    }
  }
  return d;
}

/** Zählt der Zustand s? Unterwegs auf einer Straße oder an einem Knoten mit Straßen (nicht nur einem Terminal). */
export function onRoad(s) {
  if (s < NE) return edges[s >> 1].kind === 'ab' || edges[s >> 1].kind === 'land';
  return nodes[s - NE].edges.some((de) => edges[de >> 1].kind === 'ab' || edges[de >> 1].kind === 'land');
}
/** Die Zustände über max (Standard LADENETZ.aim), schlimmste zuerst: [{ s, gap, back, ahead, name }]. */
export function ladeluecken(net = ladenetz(), max = LADENETZ.aim) {
  const out = [];
  for (let s = 0; s < net.N; s++) if (onRoad(s) && net.gap[s] > max) out.push({ s, gap: net.gap[s], back: net.back[s], ahead: net.ahead[s], name: net.name(s) });
  return out.sort((a, b) => b.gap - a.gap);
}

