// Licht der Welt: die Sonne (Stärke, Farbe) und das Licht des Himmels (Stärke, Farbe von oben, Farbe von unten),
// je nach Bewölkung. Reine Rechnung ohne three.js, damit ein Prüfstand sie festhalten kann (tools/licht-test.mjs).
// Farben als lineare Werte (so rechnet der Renderer), nicht als sRGB wie in einer Hex-Farbe.
import { lerp } from '../util.js';

const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
/** Hex-Farbe (sRGB) als lineare Werte. */
export const linear = (hex) => [lin(((hex >> 16) & 255) / 255), lin(((hex >> 8) & 255) / 255), lin((hex & 255) / 255)];

// Schönes Wetter: eine kräftige, warme Sonne und weniger, blaueres Himmelslicht. Auf einer besonnten Wiese kommt
// zusammen so viel Licht an wie mit dem früheren Licht (SOFT: Sonne 3,05 und Himmel 2,05, dort war der Schatten
// halb so hell wie die Sonne). Jetzt ist er ein Viertel so hell und bläulich: Schatten und Schattenseiten werden
// deutlich, ohne dass das Bild dunkler wird.
const GROUND = linear(0xc3cf9c);
export const LIGHT = {
  fair: { sun: 4.88, sunColor: linear(0xffe9c4), hemi: 1.435, sky: linear(0xa8c4ff), ground: GROUND },
  // das frühere, weiche Schönwetterlicht: Von ihm aus blendet das Wetter wie eh und je zum Regen
  soft: { sun: 3.05, sunColor: linear(0xfff0d9), hemi: 2.05, sky: [0.69, 0.79, 1.0], ground: GROUND },
  rain: { sun: 0.36, sunColor: linear(0xfff0d9), hemi: 1.6, sky: [0.6, 0.66, 0.74], ground: GROUND },
};
// Ab dieser Bewölkung ist vom kräftigen Schönwetterlicht nichts mehr übrig: Ein Schauer (Bewölkung 0,57 bis 0,95)
// sieht damit genau so aus wie vor dem neuen Licht.
export const FAIR_END = 0.5;

const KEYS = ['sunColor', 'sky', 'ground'];
/** Das Licht bei Bewölkung o (0 schön … 1 Regen), in out geschrieben (Form wie LIGHT.fair). */
export function worldLight(o, out = { sun: 0, sunColor: [0, 0, 0], hemi: 0, sky: [0, 0, 0], ground: [0, 0, 0] }) {
  const { fair, soft, rain } = LIGHT;
  const w = Math.max(0, 1 - o / FAIR_END); // Anteil des kräftigen Lichts
  const mix = (a, b, c) => lerp(b, c, o) + (a - b) * w;
  out.sun = mix(fair.sun, soft.sun, rain.sun);
  out.hemi = mix(fair.hemi, soft.hemi, rain.hemi);
  for (const key of KEYS) for (let i = 0; i < 3; i++) out[key][i] = mix(fair[key][i], soft[key][i], rain[key][i]);
  return out;
}
