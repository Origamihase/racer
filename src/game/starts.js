// Wo ein Stream beginnt (der Besitzer am 24.11.2026: „Jeder Stream sollte an einem anderen Ort starten.“). Der erste
// Stream beginnt wie seit jeher am Supercharger in Erlensee, jeder weitere im nächsten Ort der Liste STARTS – so nie
// zweimal hintereinander im selben Ort, und erst nach allen anderen wieder im ersten. Welcher zuletzt dran war, steht
// im Spielstand (save.start); der Titel zeigt den Wagen schon im Ladepark des nächsten (main.js), seine Statistik
// nennt ihn. Jeder Ort der Liste ist ein Knoten der Karte mit seinem Ort: Dort steht der Ladepark der Startszene
// (world/xxl/charge.js chargeOf), von dort misst das Navi das erste Gebot, dort beginnt die Route im Abspann. Klein und
// groß, Wetterau, Spessart, Taunus, Rhein, Bergstraße und Lahn – die Orte sehen verschieden aus (kit/layout.js).
// Rein rechnerisch (ohne Grafik, auch für die Node-Tests: tools/testlauf5-test.mjs fährt aus jedem los).
import { nodes, places } from '../map/graph.js';

export const STARTS = [
  'Erlensee', 'Gelnhausen', 'AS Bad Vilbel', 'Idstein', 'Bad Orb', 'Langen', 'Friedrichsdorf', 'Bensheim',
  'Schlüchtern', 'Bingen am Rhein', 'Wetzlar', 'Pfungstadt',
];

/** Knoten (Index in nodes) eines Startorts (Kennung wie in STARTS); −1, wenn es ihn nicht gibt. */
export function startNode(id) {
  return nodes.findIndex((n) => n.id === id);
}

/** Der Startort nach dem Start last (Kennung aus dem Spielstand): der nächste der Liste; ohne (oder unbekannt) Erlensee. */
export function nextStart(last) {
  return STARTS[(STARTS.indexOf(last) + 1) % STARTS.length];
}

/** Der Ort (Index in places), in dem ein Stream ab diesem Startort beginnt, oder −1. */
export function startPlace(id) {
  const n = nodes[startNode(id)];
  return n && n.places.length ? n.places[0].place : -1;
}

/** Name des Orts, in dem ein Stream ab diesem Startort beginnt (wie auf der Ortstafel). */
export function startName(id) {
  const i = startPlace(id);
  return i >= 0 ? places[i].name : String(id);
}
