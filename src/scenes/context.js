// Der Szenen-Kontext: Was die Szenen (start.js, stop.js, tv.js) aus main.js brauchen – Wagen, Kameras, Spielzustand,
// Ton und ein paar Helfer der Kamera-Regie. main.js setzt ihn einmal beim Laden (setSceneContext); die Felder sind
// Getter, die Szenen sehen also immer den aktuellen Stand (etwa state, simT oder den Renderer nach dem Start).
export let m = null;

export function setSceneContext(ctx) {
  m = ctx;
}
