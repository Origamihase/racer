// Die Baustelle auf der Autobahn (der Eigentümer, 27.11.2026: „Eine Baustelle könnte ein Geschicklichkeitsspiel
// werden.“): Die beiden linken Spuren sind gesperrt, Leitbaken führen den Verkehr auf zwei schmalen Spuren rechts
// vorbei, und in der Mitte schwenkt die Gasse einmal nach links hinüber und wieder zurück. Wer sauber durchkommt, ohne
// eine Bake zu streifen, freut den Chat.
//
// Nur Geometrie, ohne Zufall: die Gasse an jeder Stelle u (Meter ab dem Beginn der Verengung), wie sie das Spiel
// (Grenzen des Wagens), der Verkehr (gesperrte Spuren, Versatz) und die Szenerie (Baken) gleich sehen.
import { ROAD } from '../textures.js';

/**
 * Abschnitte der Baustelle (Meter): taper Verengung von links, a gerade, shift Verschwenkung nach links, mid
 * verschwenkt, back zurück, b gerade, out Ende der Sperrung. left/right: Ränder der Gasse auf den rechten Spuren
 * (x ohne Verschwenkung), by: so weit schwenkt sie in der Mitte nach links (eine Spurbreite).
 */
export const BAU = {
  taper: 120, a: 130, shift: 70, mid: 150, back: 70, b: 110, out: 100,
  left: 0.4, right: 7.0, edge: -7.5, roadRight: 7.5, by: ROAD.laneWidth,
  // Abstand der Baken: in Verengung und Verschwenkung dichter
  gap: { bend: 9, straight: 16 },
};
const ss = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const U1 = BAU.taper;
const U2 = U1 + BAU.a;
const U3 = U2 + BAU.shift;
const U4 = U3 + BAU.mid;
const U5 = U4 + BAU.back;
const U6 = U5 + BAU.b;
/** Gesamtlänge der Baustelle (Meter). */
export const BAU_LEN = U6 + BAU.out;

/** Verschwenkung bei u (0 oder −by, dazwischen weich). */
export function bauShift(u) {
  if (u < U2 || u > U5) return 0;
  if (u < U3) return -BAU.by * ss((u - U2) / BAU.shift);
  if (u <= U4) return -BAU.by;
  return -BAU.by * (1 - ss((u - U4) / BAU.back));
}

/** Linker Rand der Gasse ohne Verschwenkung (−Infinity: alles offen). */
export function bauLeftLogical(u) {
  if (u < 0 || u > BAU_LEN) return -Infinity;
  if (u < U1) return BAU.edge + (BAU.left - BAU.edge) * ss(u / BAU.taper);
  if (u <= U6) return BAU.left;
  return BAU.left + (BAU.edge - BAU.left) * ss((u - U6) / BAU.out);
}

/** Rechter Rand der Gasse ohne Verschwenkung (Infinity: die Fahrbahn bis zum Rand). */
export function bauRightLogical(u) {
  if (u < 0 || u > BAU_LEN) return Infinity;
  if (u < U1) return BAU.roadRight + (BAU.right - BAU.roadRight) * ss(u / BAU.taper);
  if (u <= U6) return BAU.right;
  return BAU.right + (BAU.roadRight - BAU.right) * ss((u - U6) / BAU.out);
}

/** Die Gasse bei u, wie man sie sieht: { left, right } in x der Fahrbahn (null außerhalb der Baustelle). */
export function bauGasse(u, out = { left: 0, right: 0 }) {
  if (u < 0 || u > BAU_LEN) return null;
  const sh = bauShift(u);
  out.left = bauLeftLogical(u) + sh;
  out.right = bauRightLogical(u) + sh;
  return out;
}

/** Liegt u in einer Biegung der Gasse (Verengung, Verschwenkung, Ende)? Dort stehen die Baken dichter. */
export function bauBend(u) {
  return u < U1 || (u > U2 && u < U3) || (u > U4 && u < U5) || u > U6;
}

/**
 * Wo die Baken stehen (u, x), von u0 bis u1 (Meter ab Beginn): links an der Gasse von Anfang bis Ende, rechts nur,
 * wo die Gasse schmaler ist als die Fahrbahn. Ohne Zufall: dieselbe Baustelle sieht immer gleich aus.
 */
export function bakenBetween(u0, u1) {
  const out = [];
  const g = { left: 0, right: 0 };
  let u = 0;
  while (u <= BAU_LEN) {
    if (u >= u0 && u < u1) {
      bauGasse(u, g);
      out.push({ u, x: g.left - 0.18, side: -1 });
      if (g.right < BAU.roadRight - 0.15) out.push({ u, x: g.right + 0.18, side: 1 });
    }
    u += bauBend(u) ? BAU.gap.bend : BAU.gap.straight;
  }
  return out;
}

/** Ist diese Spur (0 … 3, logisch, ohne Verschwenkung) bei u gesperrt? */
export function bauLaneClosed(lane, u) {
  const c = ROAD.laneCenter(lane);
  return c < bauLeftLogical(u) + 0.6 || c > bauRightLogical(u) - 0.6;
}
