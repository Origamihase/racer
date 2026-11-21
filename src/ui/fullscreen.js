// Vollbild: Knopf „Vollbild“ im Hauptmenü und in der Pause, dazu die Taste F (Fullscreen API, für Safari mit
// webkit-Präfix). Ins Vollbild geht die ganze Seite (documentElement): Bild, HUD, Menüs und Touch-Knöpfe kommen mit,
// und die neue Größe kommt wie jede andere über das resize-Ereignis (main.js onResize). Esc beendet das Vollbild, wie
// der Browser es will; fullscreenchange meldet jeden Wechsel, dann heißt der Knopf wieder „Vollbild“. Ein iPhone kennt
// die API für Seiten nicht: Dort fehlt der Knopf, und der Titel sagt in einer Zeile, wie es ohne Leisten geht.
//
// Esc im Vollbild gehört dem Browser: Er beendet damit das Vollbild, und manche Browser reichen die Taste trotzdem an
// die Seite weiter. Damit derselbe Druck nicht auch noch die Pause öffnet oder schließt oder im Menü „Zurück“
// drückt, zählt er im Spiel nicht (escapeTaken: input.js, menus.js). Stattdessen meldet jeder Wechsel, ob
// das Spiel ihn ausgelöst hat (Knopf, F) oder der Browser (Esc, Zurück-Geste, seine Leiste) – endet das Vollbild so
// mitten in der Fahrt, hält main.js an: einmal, in jedem Browser gleich.

// das Dokument erst beim Aufruf (tools/menues-test.mjs setzt ein nachgebautes ein)
const doc = () => (typeof document !== 'undefined' ? document : null);
const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000;
/** So lange (s) nach dem Verlassen durch den Browser gehört Esc noch ihm (falls er die Taste erst danach meldet). */
export const ESC_GRACE = 0.5;
/** So lange (s) nach toggleFullscreen gilt ein Wechsel als vom Spiel ausgelöst. */
const OWN_T = 1.5;
let ownUntil = -Infinity;
let escUntil = -Infinity;
let last = null; // zuletzt gemeldeter Zustand (Safari meldet einen Wechsel mit und ohne Präfix)
const subs = [];

/** Kann diese Seite ins Vollbild? */
export function canFullscreen() {
  const d = doc();
  if (!d) return false;
  const root = d.documentElement;
  return !!((d.fullscreenEnabled || d.webkitFullscreenEnabled) && (root.requestFullscreen || root.webkitRequestFullscreen));
}

/** Ist sie es gerade? */
function isFullscreen() {
  const d = doc();
  return !!(d && (d.fullscreenElement || d.webkitFullscreenElement));
}

/** Text des Knopfs, je nach Zustand. */
export const fullscreenLabel = () => (isFullscreen() ? '⛶  Vollbild beenden' : '⛶  Vollbild');

/**
 * Ein- oder ausschalten. Der Browser erlaubt es nur aus einem Klick oder Tastendruck heraus; verweigert er es, bleibt
 * alles, wie es ist (ohne Meldung in der Konsole).
 */
export function toggleFullscreen() {
  if (!canFullscreen()) return;
  const d = doc();
  const root = d.documentElement;
  ownUntil = now() + OWN_T;
  try {
    const p = isFullscreen()
      ? (d.exitFullscreen || d.webkitExitFullscreen).call(d)
      : root.requestFullscreen ? root.requestFullscreen({ navigationUI: 'hide' }) : root.webkitRequestFullscreen();
    if (p && p.catch) p.catch(() => (ownUntil = -Infinity));
  } catch (e) {
    /* verweigert */
    ownUntil = -Infinity;
  }
}

function changed() {
  const on = isFullscreen();
  if (on === last) return;
  last = on;
  const ev = { on, own: now() < ownUntil };
  ownUntil = -Infinity;
  if (!on && !ev.own) escUntil = now() + ESC_GRACE;
  for (const cb of subs) cb(ev);
}

/**
 * Jeden Wechsel melden (auch durch Esc oder den Browser selbst), jeden einmal: cb({ on, own }) – on: jetzt im
 * Vollbild, own: vom Spiel ausgelöst (Knopf, F), sonst vom Browser.
 */
export function onFullscreenChange(cb) {
  const d = doc();
  if (!d) return;
  if (!subs.length) {
    last = isFullscreen();
    d.addEventListener('fullscreenchange', changed);
    d.addEventListener('webkitfullscreenchange', changed);
  }
  subs.push(cb);
}

/** Gehört dieser Tastendruck dem Browser? Esc im Vollbild und kurz nachdem der Browser es beendet hat. */
export function escapeTaken(e) {
  return e.code === 'Escape' && (isFullscreen() || now() < escUntil);
}

/** iPhone ohne Vollbild, nicht vom Home-Bildschirm gestartet: Nur „Zum Home-Bildschirm“ nimmt die Leisten weg. */
export function homeScreenHint() {
  if (!doc() || canFullscreen()) return false;
  const standalone = navigator.standalone || (typeof matchMedia === 'function' && matchMedia('(display-mode: standalone)').matches);
  return /iPhone|iPod/.test(navigator.userAgent) && !standalone;
}

/** Die Taste fürs Vollbild (e.code; die Steuerungsübersicht in src/ui/controls.js nennt sie von hier). */
export const FULLSCREEN_KEY = 'KeyF';

/**
 * Taste F (ohne Strg, Alt oder ⌘, nicht in einem Eingabefeld): Vollbild an oder aus – gleich im Tastendruck, denn nur
 * dort lässt der Browser es zu (aus der Spielschleife heraus würde er es verweigern).
 */
export function bindFullscreenKey() {
  if (!canFullscreen()) return;
  window.addEventListener('keydown', (e) => {
    if (e.code !== FULLSCREEN_KEY || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target && /^(input|textarea|select)$/i.test(e.target.tagName) && e.target.type !== 'range') return;
    e.preventDefault();
    toggleFullscreen();
  });
}
