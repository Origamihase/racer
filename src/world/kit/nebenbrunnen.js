// Nebenbrunnen: Trinkbrunnen, Teich und Wasserspiel auf den kleinen Plätzen größerer Orte bekommen je Ort eine eigene
// Spielart (der Besitzer am 27.11.2026: „Mehr Abwechslung ist immer gut.“). Rein rechnerisch (ohne three.js): hier steht,
// welche Spielarten es gibt; gebaut werden sie in fountains.js (Bausteine 'fountainDrink~3' usw., gleiche Grundfläche
// wie die Art, damit der Plan nichts merkt), gewählt in layout.js (extraVariant).

/** Trinkbrunnen: Gusseisensäule in Farbe, Steinpfeiler mit Löwenmaul, Edelstahlpoller, Holzstock mit Zuber. */
export const DRINK_V = [
  { t: 'Trinkbrunnen', shape: 'saeule', col: 0x3f7d55 },
  { t: 'Trinkbrunnen', shape: 'saeule', col: 0x3d6fa8, top: 'fisch' },
  { t: 'Trinkbrunnen', shape: 'saeule', col: 0xb8443a, top: 'hahn' },
  { t: 'Trinkbrunnen', shape: 'saeule', col: 0x2f3438, gold: true, top: 'krone' },
  { t: 'Trinkbrunnen', shape: 'saeule', col: 0xc99a3e, top: 'storch' },
  { t: 'Löwen-Trinkbrunnen', shape: 'stein', stone: 0xe4c78c, mouth: 'loewe' },
  { t: 'Löwen-Trinkbrunnen', shape: 'stein', stone: 0xc27c64, mouth: 'loewe', top: 'gans' },
  { t: 'Trinkbrunnen', shape: 'stein', stone: 0xb9bbbd, mouth: 'rohr', top: 'engel' },
  { t: 'Trinkbrunnen', shape: 'poller', col: 0xc8ced4 },
  { t: 'Trinkbrunnen', shape: 'poller', col: 0xc8ced4, ring: 0x3d6fa8 },
  { t: 'Holz-Trinkbrunnen', shape: 'holz', only: ['alpine', 'schwarzwald', 'japanese', 'nordic'] },
  { t: 'Bären-Trinkbrunnen', shape: 'stein', stone: 0xefeadf, mouth: 'loewe', top: 'baer' },
];

/** Teich: was in der Mitte steht und wer darin schwimmt. */
export const POND_V = [
  { t: 'Fontäne im Teich', centre: 'jet', fauna: 'enten' },
  { t: 'Teich mit drei Fontänen', centre: 'drei', fauna: 'schwaene' },
  { t: 'Seerosenteich', centre: 'kranz', fauna: 'koi', lilies: 2 },
  { t: 'Froschteich', centre: 'insel', fauna: 'froesche' },
  { t: 'Fischteich', centre: 'figur', fig: 'fisch', fauna: 'koi' },
  { t: 'Neptunteich', centre: 'figur', fig: 'neptun', fauna: 'enten' },
  { t: 'Nymphenteich', centre: 'figur', fig: 'nymphe', fauna: 'schwaene' },
  { t: 'Ententeich', centre: 'insel', house: true, fauna: 'enten' },
  { t: 'Schwanenteich', centre: 'jet', h: 4.2, fauna: 'schwaene', lilies: 2 },
  { t: 'Teichfontäne', centre: 'drei', fauna: 'koi' },
];

/** Wasserspiel: Muster der Düsen, Pflaster, Mitte. */
export const JETS_V = [
  { t: 'Wasserspiel', pat: 'ring', pave: 'granit', centre: 'jet' },
  { t: 'Wasserspiel', pat: 'raster', pave: 'sand', centre: 'none' },
  { t: 'Wasserspiel', pat: 'doppel', pave: 'rot', centre: 'jet' },
  { t: 'Wasserspiel', pat: 'spirale', pave: 'blau', centre: 'kugel' },
  { t: 'Kugel-Wasserspiel', pat: 'ring', pave: 'sand', centre: 'kugel' },
  { t: 'Wasserspiel', pat: 'kreuz', pave: 'granit', centre: 'jet' },
  { t: 'Wasserspiel', pat: 'doppel', pave: 'blau', centre: 'none' },
  { t: 'Wasserspiel', pat: 'spirale', pave: 'rot', centre: 'jet' },
];

export const EXTRA_VARIANTS = { fountainDrink: DRINK_V, fountainPond: POND_V, fountainJets: JETS_V };

/** Name des Bausteins einer Spielart (die erste ist die Art selbst). */
export const variantName = (kind, i) => (i ? `${kind}~${i}` : kind);

/** Art eines Bausteins, auch einer Spielart ('fountainDrink~3' → 'fountainDrink'). */
export const baseKind = (name) => name.split('~')[0];

/**
 * Spielart eines Nebenbrunnens kind im Ort (hash: hashKey aus layout.js, looks: Bauweisen des Steckbriefs). Fest je Ort,
 * Art und laufender Nummer n (zwei Trinkbrunnen eines Orts unterscheiden sich).
 */
export function extraVariant(key, kind, looks, hash, n = 0) {
  const list = EXTRA_VARIANTS[kind];
  if (!list) return kind;
  const ok = list.map((v, i) => i).filter((i) => !list[i].only || list[i].only.some((l) => looks.includes(l)));
  return variantName(kind, ok[hash(`Nebenbrunnen ${kind} ${n} ${key}`) % ok.length]);
}
