// Vollbild: Knopf „Vollbild“ im Hauptmenü und in der Pause, dazu die Taste F (Fullscreen API, für Safari mit
// webkit-Präfix). Ins Vollbild geht die ganze Seite (documentElement): Bild, HUD, Menüs und Touch-Knöpfe kommen mit,
// und die neue Größe kommt wie jede andere über das resize-Ereignis (main.js onResize). Esc beendet das Vollbild, wie
// der Browser es will; fullscreenchange meldet jeden Wechsel, dann heißt der Knopf wieder „Vollbild“. Ein iPhone kennt
// die API für Seiten nicht: Dort fehlt der Knopf, und der Titel sagt in einer Zeile, wie es ohne Leisten geht.

const doc = typeof document !== 'undefined' ? document : null;

/** Kann diese Seite ins Vollbild? */
export function canFullscreen() {
  if (!doc) return false;
  const root = doc.documentElement;
  return !!((doc.fullscreenEnabled || doc.webkitFullscreenEnabled) && (root.requestFullscreen || root.webkitRequestFullscreen));
}

/** Ist sie es gerade? */
function isFullscreen() {
  return !!(doc && (doc.fullscreenElement || doc.webkitFullscreenElement));
}

/** Text des Knopfs, je nach Zustand. */
export const fullscreenLabel = () => (isFullscreen() ? '⛶  Vollbild beenden' : '⛶  Vollbild');

/**
 * Ein- oder ausschalten. Der Browser erlaubt es nur aus einem Klick oder Tastendruck heraus; verweigert er es, bleibt
 * alles, wie es ist (ohne Meldung in der Konsole).
 */
export function toggleFullscreen() {
  if (!canFullscreen()) return;
  const root = doc.documentElement;
  try {
    const p = isFullscreen()
      ? (doc.exitFullscreen || doc.webkitExitFullscreen).call(doc)
      : root.requestFullscreen ? root.requestFullscreen({ navigationUI: 'hide' }) : root.webkitRequestFullscreen();
    if (p && p.catch) p.catch(() => {});
  } catch (e) {
    /* verweigert */
  }
}

/** Jeden Wechsel melden (auch durch Esc oder den Browser selbst). */
export function onFullscreenChange(cb) {
  if (!doc) return;
  doc.addEventListener('fullscreenchange', cb);
  doc.addEventListener('webkitfullscreenchange', cb);
}

/** iPhone ohne Vollbild, nicht vom Home-Bildschirm gestartet: Nur „Zum Home-Bildschirm“ nimmt die Leisten weg. */
export function homeScreenHint() {
  if (!doc || canFullscreen()) return false;
  const standalone = navigator.standalone || (typeof matchMedia === 'function' && matchMedia('(display-mode: standalone)').matches);
  return /iPhone|iPod/.test(navigator.userAgent) && !standalone;
}

/**
 * Taste F (ohne Strg, Alt oder ⌘, nicht in einem Eingabefeld): Vollbild an oder aus – gleich im Tastendruck, denn nur
 * dort lässt der Browser es zu (aus der Spielschleife heraus würde er es verweigern).
 */
export function bindFullscreenKey() {
  if (!canFullscreen()) return;
  window.addEventListener('keydown', (e) => {
    if (e.code !== 'KeyF' || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target && /^(input|textarea|select)$/i.test(e.target.tagName) && e.target.type !== 'range') return;
    e.preventDefault();
    toggleFullscreen();
  });
}
