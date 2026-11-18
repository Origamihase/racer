// Touch-Lenkung ohne DOM (für src/ui/touch.js, die Tests und den Fahrer-Bot): Daumen-Zug zu Lenkwert, Wischen zu
// Spurwechsel.

/** Totzone des Daumen-Zugs (Anteil am vollen Weg): ein ruhender Daumen zittert, das Auto soll es nicht. */
export const TOUCH_DEAD = 0.06;

export const TOUCH = {
  radius: 70, // so weit (px) zieht der Daumen für vollen Einschlag (auf kleinen Handys weniger, siehe touch.js)
  gamma: 1.3, // feiner um die Mitte
  swipeMs: 280, // ein Wischer ist kurz …
  swipePx: 36, // … und deutlich zur Seite
  swipeRatio: 1.6, // waagrecht statt schräg
};

/** Lenkwert −1 … 1 aus dem waagrechten Daumenweg dx (px). */
export function dragToAnalog(dx, radius = TOUCH.radius) {
  const a = dx / Math.max(1, radius);
  const m = Math.abs(a);
  if (m <= TOUCH_DEAD) return 0;
  return Math.sign(a) * Math.pow(Math.min(1, (m - TOUCH_DEAD) / (1 - TOUCH_DEAD)), TOUCH.gamma);
}

/**
 * Wischen erkennen: kurz, deutlich zur Seite, eher waagrecht. Gibt −1/1 für einen Spurwechsel zurück, sonst 0.
 * @param {number} dx waagrechter Weg (px) @param {number} dy senkrechter Weg (px) @param {number} ms Dauer
 */
export function swipeDir(dx, dy, ms) {
  if (ms > TOUCH.swipeMs) return 0;
  if (Math.abs(dx) < TOUCH.swipePx) return 0;
  if (Math.abs(dx) < Math.abs(dy) * TOUCH.swipeRatio) return 0;
  return Math.sign(dx);
}
