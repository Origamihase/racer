// Ortssteckbriefe: wie ein Ort aussieht, damit keiner dem anderen gleicht (der Besitzer am 25.11.2026: „Kannst du jede
// Stadt individualisieren?“, auf die Rückfrage: „Jeder deutsche Ort von Hand“). Rein rechnerisch (ohne three.js), für
// den Ortsplaner (layout.js planTown) und den Straßenbau (xxl/roadkit.js, Gehwegpflaster).
//
// Jeder deutsche Ort der Karte hat seinen eigenen Eintrag in steckbriefe-de.js, geschrieben nach seinem Artikel in der
// deutschsprachigen Wikipedia (Stadtbild, Altstadt, Baugeschichte); tools/steckbrief-test.mjs prüft, dass keiner fehlt
// und jedes Wort bekannt ist. Orte im Ausland bekommen ihr Bild aus ihrer Gegend, Farben und Bäume aus ihrem Namen
// gezogen, damit auch dort Nachbarorte verschieden sind.
//
// Ein Eintrag: { l: Land (Bundesland), s: Bauweisen 'erste zweite dritte' (Anteile 60/25/15, eine allein 100 %),
//   f: Fassadenfarben (Paletten, mit Leerzeichen getrennt), d: Dachfarben (ebenso, die erste überwiegt), b: Straßenbaum,
//   la: Laterne, p: Gehwegpflaster, fa: Stadtfarben für Fahnen an den Laternen ('rot weiss'), c: Anteil der
//   Laternenfelder mit parkenden Autos (sonst nach der Bauweise), x: Zusätze ('tram' Straßenbahn auch unter 300 000
//   Einwohnern, 'keinetram', 'blumen' mehr Blumenkübel), t: was der Ort ist (eine Zeile nach Wikipedia, für Album und Prüfung) }.

// --- Wortschatz -----------------------------------------------------------------------------------------------------
/** Bauweisen (Schlüssel der Hausvarianten name@look in town.js, 'default' = die Grundhäuser). */
export const LOOK_KEYS = ['default', 'fachwerk', 'schiefer', 'kurort', 'gruenderzeit', 'sandstein', 'brick', 'alpine', 'barock', 'platte', 'nachkrieg', 'baeder', 'schwarzwald', 'dutch', 'med', 'nordic', 'british', 'american', 'japanese'];

/** Fassadenfarben je Palette (sRGB). Weich und freundlich wie die ganze Miniaturwelt, nie rein weiß. */
export const WALLS = {
  weiss: [0xfaf7f0, 0xf4efe4, 0xf6f2e8, 0xf2eee6],
  creme: [0xf4e7c8, 0xf2e2bc, 0xefe4cc, 0xf6ecd6],
  ocker: [0xe9c97a, 0xe3b866, 0xf0d590, 0xd9a85a],
  gelb: [0xf6dc7c, 0xf3e29a, 0xf2cf6a, 0xf7e6a8],
  rose: [0xf2c8bc, 0xeeb8b0, 0xf4d6cf, 0xe8b4a4],
  pastell: [0xffe9b8, 0xf7c9b0, 0xd8ecf5, 0xe6f2d5, 0xf4d6e0, 0xf2d9a0],
  bunt: [0xf2b8a0, 0x9ec9e0, 0xf3d37a, 0xb9dca8, 0xe8a8b8, 0xf0c890],
  hanse: [0xe2b05a, 0xc8673f, 0x8fb39a, 0x9cb8d0, 0xe9d7b0, 0xb5503c],
  gruen: [0xd8e8c8, 0xc8dcb8, 0xe0ecd4, 0xbcd6b0],
  blau: [0xd2e2ee, 0xc4d8e8, 0xdce8f0, 0xb8cfe0],
  grau: [0xd6d3cc, 0xcac7c0, 0xe0ddd6, 0xbfbcb6],
  ddr: [0xd9d3c4, 0xc9c6bd, 0xe2d6b4, 0xd4cfc4],
  saniert: [0xe8dcb8, 0xcfdce0, 0xe6cfc0, 0xd7e0c8, 0xf0e0a8],
  sandrot: [0xb4644f, 0xa9574a, 0xbc6f5a, 0x9d5143],
  sandgelb: [0xe6cf9e, 0xdcc08a, 0xead7aa, 0xd8b87e],
  blaustein: [0x9aa0a6, 0xe8e2d6, 0xa9aeb2, 0xf0ebe0],
  backstein: [0xc0613f, 0xb65c42, 0xa95640, 0x9c4f3b],
  klinker: [0x8a4636, 0x7d4436, 0x6f3c30, 0x94503e],
  gelbklinker: [0xe2c98e, 0xd8bb7a, 0xead6a4, 0xcdb070],
  schiefer: [0x474c54, 0x51565f, 0x3f444b, 0x5a5f66],
  holz: [0x9a6a44, 0x8a5c3b, 0xa8774d, 0x7e5536],
  falun: [0xa8443a, 0x9c3e36, 0xb24c40],
  barock: [0xf1d27a, 0xeec27f, 0xf0cdbf, 0xe4ddcf, 0xf3e1a6, 0xe9b98f],
  bad: [0xfbfaf6, 0xf6f2e8, 0xeef2f4, 0xf8f4ea, 0xf4eedf],
  stein: [0xd8cfc0, 0xcfc4b2, 0xe2dacb, 0xc4b8a4],
  terrakotta: [0xd9946a, 0xe8b48a, 0xc87850, 0xe9c49a],
  mittelmeer: [0xe8c48a, 0xd9946a, 0xf2e2c4, 0xe9b9a6, 0xf3d98e, 0xf4efe6],
};
/** Dachfarben (sRGB). */
export const ROOFS = {
  ziegel: 0xc8553a,
  hell: 0xd9683e,
  biber: 0xa8452f,
  dunkelrot: 0x8b3e2c,
  braun: 0x7a4e3c,
  engobe: 0x5a4a44,
  schiefer: 0x4f555c,
  anthrazit: 0x3f444b,
  grau: 0x6f7f8f,
  kupfer: 0x86ac9e,
  holz: 0x6b5a4c,
  reet: 0xb2915e,
  moench: 0xc4673f, // Mönch und Nonne am Mittelmeer
};
/** Straßenbäume: Bausteine in street.js (leer = keine Bäume, die Lücke bleibt Pflaster). */
export const TREES = {
  linde: ['treeLinde', 'treeLinde', 'streetTree'],
  kastanie: ['treeKastanie', 'treeKastanie', 'streetTree2'],
  platane: ['treePlatane', 'treePlatane'],
  ahorn: ['streetTree', 'streetTree2'],
  kugel: ['treeKugel'],
  birke: ['treeBirke', 'treeBirke', 'streetTree'],
  pappel: ['streetTreeTall'],
  kiefer: ['treeKiefer', 'treeKiefer', 'treeBirke'],
  obst: ['treeObst', 'treeObst', 'streetTree'],
  palme: ['treePalme'],
  gemischt: ['streetTree', 'streetTree2', 'streetTreeTall'],
  keine: [],
};
/** Laternen am Bordstein (street.js). */
export const LAMPS = { alt: 'lampOld', modern: 'lampModern', gas: 'lampGas', ddr: 'lampDdr' };
/** Gehwegpflaster: zwei Töne des Plattenwegs und des Kleinpflasterstreifens (xxl/roadkit.js, street.js plaza). */
export const PAVES = {
  platten: { slab: [0xd9d4c8, 0xcfc9bc], cobble: [0xb9a999, 0xab9b8b] },
  kopf: { slab: [0xa8a49c, 0x9c988f], cobble: [0x8f8a82, 0x9a948b] },
  klinker: { slab: [0xb5654a, 0xa85c44], cobble: [0x9a5540, 0x8f4e3b] },
  sand: { slab: [0xe6d6b4, 0xdccaa4], cobble: [0xc9b48e, 0xbfa984] },
  basalt: { slab: [0x8a8c8e, 0x7f8183], cobble: [0x6f7173, 0x77797b] },
  granit: { slab: [0xe0ddd6, 0xd4d1ca], cobble: [0xb8b4ac, 0xaca8a0] },
};
/** Stadtfarben (Fahnen). */
export const FLAG_COLORS = {
  rot: 0xd8332b, weiss: 0xf6f4ee, blau: 0x2f5fae, hellblau: 0x7fb7e6, gelb: 0xf2c230, gold: 0xe0a82a, schwarz: 0x2e3036, gruen: 0x2f8f4e, orange: 0xf08a2c, violett: 0x7a4f9a,
};
/** Bundesländer (Kürzel wie im Kfz-Wesen üblich). */
export const LANDS = ['BW', 'BY', 'BE', 'BB', 'HB', 'HH', 'HE', 'MV', 'NI', 'NW', 'RP', 'SL', 'SN', 'ST', 'SH', 'TH'];
const EXTRAS = new Set(['tram', 'keinetram', 'blumen']);

const words = (s) => (s ? String(s).trim().split(/\s+/) : []);
const hash = (s) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};

/**
 * Fehler eines Eintrags (leer = in Ordnung): unbekannte Wörter, fehlende Pflichtfelder. Für den Prüfstand und, beim
 * Laden, damit ein Tippfehler nicht still ein Grundhaus ergibt.
 */
export function checkEntry(e) {
  const bad = [];
  if (!e || typeof e !== 'object') return ['kein Eintrag'];
  if (e.l !== undefined && !LANDS.includes(e.l)) bad.push('Land ' + e.l);
  const looks = words(e.s);
  if (!looks.length) bad.push('keine Bauweise');
  for (const w of looks) if (!LOOK_KEYS.includes(w)) bad.push('Bauweise ' + w);
  if (!words(e.f).length) bad.push('keine Fassadenfarbe');
  for (const w of words(e.f)) if (!WALLS[w]) bad.push('Fassade ' + w);
  if (!words(e.d).length) bad.push('keine Dachfarbe');
  for (const w of words(e.d)) if (ROOFS[w] === undefined) bad.push('Dach ' + w);
  if (e.b !== undefined && !TREES[e.b]) bad.push('Baum ' + e.b);
  if (e.la !== undefined && !LAMPS[e.la]) bad.push('Laterne ' + e.la);
  if (e.p !== undefined && !PAVES[e.p]) bad.push('Pflaster ' + e.p);
  for (const w of words(e.fa)) if (FLAG_COLORS[w] === undefined) bad.push('Fahne ' + w);
  if (e.fa !== undefined && words(e.fa).length !== 2) bad.push('Fahne braucht zwei Farben');
  for (const w of words(e.x)) if (!EXTRAS.has(w)) bad.push('Zusatz ' + w);
  if (e.c !== undefined && !(e.c >= 0 && e.c <= 1)) bad.push('Autos ' + e.c);
  return bad;
}

// --- Gegenden im Ausland (und Rückfall, falls ein deutscher Ort fehlt) ----------------------------------------------
const ABROAD = {
  alpine: { s: ['alpine'], f: ['weiss', 'creme', 'pastell'], d: ['holz', 'braun', 'anthrazit'], b: ['ahorn', 'linde', 'obst'], la: 'alt', p: ['kopf', 'platten'] },
  med: { s: ['med'], f: ['mittelmeer', 'terrakotta', 'ocker', 'weiss'], d: ['moench', 'hell'], b: ['platane', 'palme', 'platane'], la: 'alt', p: ['sand', 'granit'] },
  nordic: { s: ['nordic'], f: ['hanse', 'falun', 'gelb'], d: ['anthrazit', 'dunkelrot'], b: ['birke', 'linde'], la: 'modern', p: ['granit', 'platten'] },
  dutch: { s: ['dutch'], f: ['klinker', 'backstein'], d: ['anthrazit', 'engobe'], b: ['linde', 'ahorn'], la: 'alt', p: ['klinker', 'kopf'] },
  british: { s: ['british'], f: ['pastell', 'creme', 'backstein'], d: ['schiefer', 'anthrazit'], b: ['platane', 'ahorn'], la: 'alt', p: ['platten', 'granit'] },
  american: { s: ['american'], f: ['pastell', 'weiss', 'blau'], d: ['grau', 'anthrazit'], b: ['ahorn', 'platane', 'palme'], la: 'modern', p: ['granit', 'platten'] },
  japanese: { s: ['japanese'], f: ['weiss', 'grau'], d: ['anthrazit', 'schiefer'], b: ['kugel', 'ahorn'], la: 'modern', p: ['granit'] },
  brick: { s: ['brick'], f: ['backstein'], d: ['ziegel', 'anthrazit'], b: ['linde', 'ahorn'], la: 'alt', p: ['klinker', 'platten'] },
  default: { s: ['default', 'gruenderzeit'], f: ['pastell', 'creme', 'ocker', 'rose', 'grau'], d: ['ziegel', 'biber', 'schiefer', 'braun'], b: ['linde', 'ahorn', 'kastanie', 'platane'], la: 'alt', p: ['platten', 'kopf', 'granit'] },
};
// Osteuropa und das übrige Ausland ohne eigene Bauweise: Altstadt mit Barock, dazu Platte am Rand
const EAST = new Set(['PL', 'CZ', 'LT', 'AM', 'HR']);
const pickH = (h, arr, k = 0) => arr[(h >>> k) % arr.length];

function abroad(place, region) {
  const key = place.key ?? place.name ?? '';
  const h = hash('Steckbrief ' + key);
  if (EAST.has(place.cc)) {
    return { s: pickH(h, ['barock gruenderzeit platte', 'barock platte', 'gruenderzeit barock']), f: pickH(h, ['barock pastell', 'saniert ocker', 'pastell creme'], 3), d: pickH(h, ['ziegel biber', 'biber kupfer', 'ziegel schiefer'], 5), b: pickH(h, ['linde', 'kastanie', 'ahorn'], 7), la: 'alt', p: pickH(h, ['kopf', 'granit'], 9) };
  }
  const R = ABROAD[region] ?? ABROAD.default;
  // zwei der Fassadenpaletten und Dachfarben der Gegend, je Ort andere
  const f = [pickH(h, R.f), pickH(h, R.f, 4)];
  const d = [pickH(h, R.d, 8), pickH(h, R.d, 12)];
  return { s: R.s.join(' '), f: [...new Set(f)].join(' '), d: [...new Set(d)].join(' '), b: pickH(h, R.b, 16), la: R.la, p: pickH(h, R.p, 20) };
}

// --- Auflösen -------------------------------------------------------------------------------------------------------
const SHARES = [[1], [0.7, 0.3], [0.6, 0.25, 0.15]];

/**
 * Steckbrief eines Orts, aufgelöst zu Farben und Bausteinen: { looks: [[look, Anteil], …], walls: [sRGB, …] (drei bis
 * fünf Töne, je Ort aus seinen Paletten gezogen), roofs: [[sRGB, Anteil], …], trees: [Baustein, …], lamp, pave
 * ({ slab, cobble }), flag: [sRGB, sRGB] | null, cars (Anteil oder null), tram (true/false/null = nach Größe), flowers,
 * note, own (hat einen eigenen Eintrag) }. entries: die deutschen Einträge (steckbriefe-de.js), region: Gegend nach
 * layout.js regionOf, fallbackLook: Bauweise, wenn ein deutscher Ort keinen Eintrag hat.
 */
export function resolveProfile(place, entries, region, fallbackLook = 'default') {
  const key = place.key ?? place.name ?? '';
  const own = place.cc === 'DE' ? entries[key] ?? entries[place.name] : null;
  const e = own ?? (place.cc === 'DE' ? { s: fallbackLook, f: 'pastell', d: 'ziegel' } : abroad(place, region));
  const h = hash('Ortsfarben ' + key);
  const looks = words(e.s).slice(0, 3);
  const sh = SHARES[looks.length - 1];
  // Fassaden: aus jeder Palette des Orts zwei, drei Töne (je Ort andere), zusammen drei bis fünf
  const pals = words(e.f);
  const walls = [];
  pals.forEach((pk, i) => {
    const pal = WALLS[pk];
    const n = pals.length === 1 ? Math.min(pal.length, 4) : i === 0 ? 3 : 2;
    const start = (h >>> (i * 5)) % pal.length;
    for (let k = 0; k < n; k++) walls.push(pal[(start + k) % pal.length]);
  });
  const roofsW = words(e.d);
  const roofs = roofsW.map((r, i) => [ROOFS[r], roofsW.length === 1 ? 1 : i === 0 ? 0.7 : 0.3 / (roofsW.length - 1)]);
  const x = new Set(words(e.x));
  const fa = words(e.fa);
  return {
    own: !!own,
    looks: looks.map((l, i) => [l, sh[i]]),
    walls: [...new Set(walls)],
    roofs,
    trees: TREES[e.b ?? 'gemischt'],
    lamp: e.la ? LAMPS[e.la] : null,
    pave: PAVES[e.p ?? 'platten'],
    paveKey: e.p ?? 'platten',
    flag: fa.length === 2 ? fa.map((c) => FLAG_COLORS[c]) : null,
    cars: e.c ?? null,
    tram: x.has('tram') ? true : x.has('keinetram') ? false : null,
    flowers: x.has('blumen'),
    note: e.t ?? '',
  };
}

/** Gewichtete Wahl aus [[Wert, Anteil], …] mit einer Zahl u in [0, 1). */
export function weighted(list, u) {
  let acc = 0;
  for (const [v, w] of list) {
    acc += w;
    if (u < acc) return v;
  }
  return list[list.length - 1][0];
}
