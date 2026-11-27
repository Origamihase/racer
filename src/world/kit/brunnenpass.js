// Brunnenpass: jeder Ort seinen eigenen Hauptbrunnen (der Besitzer am 27.11.2026: „Ist es möglich jeder Stadt ihren
// eigenen Brunnen zu geben? Jede Stadt sollte individuell und einzigartig werden.“). Rein rechnerisch (ohne three.js).
//
// Ein Pass: { kind (Brunnenart, layout.js), fig (Brunnenfigur, brunnenfiguren.js, oder null), stone (Stein der Gegend,
// STONES), mat (wie die Figur gefasst ist: Bronze, Gold, Stein, bunt bemalt), crest ([Farbe, Farbe] des Wappenschilds),
// name (so heißt der Brunnen in Navi und Album), extra (Besonderheit wie der Hochstrahl in Genf und Wien), real
// (ein echter, bekannter Brunnen des Orts), form (Bauform innerhalb der Art: achteckig, Säulenhöhe, Röhren) }.
//
// Gewählt wird nach dem Steckbrief (steckbrief.js): Art nach der Bauweise (layout.js fountainChoices), Figur nach dem,
// was der Ort ist (Zeche → Bergmann, Wein → Winzer, Hanse → Kogge, Kloster → Mönch, Residenz → Kaiser …), Stein nach
// Fassaden und Gegend (roter Mainsandstein, Blaustein, Basalt, Backstein …). Damit keiner dem anderen gleicht, werden
// alle Orte der Karte einmal gemeinsam verteilt: kein Paar aus Art, Figur und Stein kommt zweimal vor, und Nachbarorte
// meiden dieselbe Figur. Wo ein Ort einen berühmten Brunnen hat, steht der (REAL).
import { places } from '../../map/graph.js';
import { WALLS } from './steckbrief.js';
import { profileOf, fountainChoices, sizeOf, hashKey, ownKind, SPECIAL } from './layout.js';

/** Steine (sRGB; sand = wie gebaut). Der Brunnen färbt seine Steinflächen danach um (fountains.js). */
export const STONES = {
  sand: { name: 'Sandstein', hex: null },
  rot: { name: 'roter Sandstein', hex: 0xc27c64 },
  gelb: { name: 'gelber Sandstein', hex: 0xe4c78c },
  weiss: { name: 'Muschelkalk', hex: 0xefeadf },
  grau: { name: 'Granit', hex: 0xb9bbbd },
  basalt: { name: 'Basalt', hex: 0x80858d },
  blaustein: { name: 'Blaustein', hex: 0x929ba3 },
  backstein: { name: 'Backstein', hex: 0xbb6a4c },
  travertin: { name: 'Travertin', hex: 0xebdcbc },
  rosa: { name: 'rosa Granit', hex: 0xdcaa9c },
  muschel: { name: 'Kalkstein', hex: 0xe9d6a6 },
};

/** Fassungen der Figur. */
export const MATS = ['bronze', 'gold', 'stein', 'bunt', 'dunkel'];

// Arten, deren Werkstoff fest zu ihnen gehört (Gusseisen, Beton, Holz, Granit, Bambus): kein Umfärben
const NATIVE = new Set(['fountainWallace', 'fountainPilz', 'fountainCube', 'fountainSphere', 'fountainWood', 'fountainBamboo', 'fountainPump', 'fountainJets', 'fountainOrigin', 'fountainBoss']);

/** Namen der Brunnen nach ihrer Figur. */
export const FIG_NAMES = {
  bergmann: 'Bergmannsbrunnen', winzer: 'Winzerbrunnen', marktfrau: 'Marktfrauenbrunnen', moench: 'Mönchsbrunnen', kaiser: 'Kaiserbrunnen',
  justitia: 'Gerechtigkeitsbrunnen', neptun: 'Neptunbrunnen', ritter: 'Ritterbrunnen', fischer: 'Fischerbrunnen', bauer: 'Bauernbrunnen',
  nymphe: 'Nymphenbrunnen', narr: 'Narrenbrunnen', rotkaeppchen: 'Rotkäppchenbrunnen', herkules: 'Herkulesbrunnen', heinzel: 'Heinzelmännchenbrunnen',
  engel: 'Engelsbrunnen', madonna: 'Marienbrunnen', gelehrter: 'Gelehrtenbrunnen', schmied: 'Schmiedebrunnen', waescherin: 'Wäscherinnenbrunnen',
  baer: 'Bärenbrunnen', loewe: 'Löwenbrunnen', adler: 'Adlerbrunnen', pferd: 'Rossbrunnen', hirsch: 'Hirschbrunnen', hahn: 'Gockelbrunnen',
  fisch: 'Fischbrunnen', storch: 'Storchenbrunnen', ochse: 'Ochsenbrunnen', gans: 'Gänsebrunnen', anker: 'Ankerbrunnen', kogge: 'Koggenbrunnen',
  krone: 'Kronenbrunnen', globus: 'Weltkugelbrunnen', zahnrad: 'Zahnradbrunnen', zirbel: 'Zirbelbrunnen', manneken: 'Manneken Pis',
};
// Figuren, die nur ein berühmter Brunnen trägt
const ONLY_REAL = new Set(['manneken']);

/**
 * Berühmte Brunnen: Name, Arten (die erste, die auf die Insel passt), Figur, Stein, Fassung, Besonderheit.
 * Vereinfacht wie alles in der Miniaturwelt, aber zu erkennen.
 */
export const REAL = {
  'Frankfurt am Main': { name: 'Gerechtigkeitsbrunnen', kinds: ['fountainMarket'], fig: 'justitia', stone: 'rot', mat: 'bronze' },
  Bern: { name: 'Gerechtigkeitsbrunnen', kinds: ['fountainMarket'], fig: 'justitia', stone: 'grau', mat: 'bunt' },
  'Brüssel': { name: 'Manneken Pis', kinds: ['fountainMarket'], fig: 'manneken', stone: 'grau', mat: 'bronze' },
  Genf: { name: 'Jet d’eau', kinds: ['fountainRing'], fig: null, stone: 'grau', extra: 'hochstrahl' },
  Wien: { name: 'Hochstrahlbrunnen', kinds: ['fountainGrand', 'fountainRing'], fig: null, stone: 'grau', extra: 'hochstrahl' },
  Wiesbaden: { name: 'Kochbrunnen', kinds: ['fountainTempel'], fig: 'nymphe', stone: 'weiss', mat: 'stein' },
  Kassel: { name: 'Herkulesbrunnen', kinds: ['fountainMarket'], fig: 'herkules', stone: 'basalt', mat: 'bronze' },
  Chicago: { name: 'Buckingham-Brunnen', kinds: ['fountainBowls'], fig: null, stone: 'rosa' },
  Aachen: { name: 'Karlsbrunnen', kinds: ['fountainBowls', 'fountainMarket'], fig: 'kaiser', stone: 'blaustein', mat: 'bronze' },
  Bamberg: { name: 'Gabelmann', kinds: ['fountainMarket'], fig: 'neptun', stone: 'gelb', mat: 'bronze' },
  Berlin: { name: 'Neptunbrunnen', kinds: ['fountainGrand'], fig: 'neptun', stone: 'rosa', mat: 'dunkel' },
  Braunschweig: { name: 'Eulenspiegelbrunnen', kinds: ['fountainMarket'], fig: 'narr', stone: 'sand', mat: 'bronze' },
  'Köln': { name: 'Heinzelmännchenbrunnen', kinds: ['fountainMarket', 'fountainBowls'], fig: 'heinzel', stone: 'grau', mat: 'bunt' },
  Mainz: { name: 'Marktbrunnen', kinds: ['fountainGothic', 'fountainMarket'], fig: 'madonna', stone: 'rot', mat: 'bunt' },
  'München': { name: 'Fischbrunnen', kinds: ['fountainMarket', 'fountainBowls'], fig: 'fischer', stone: 'grau', mat: 'dunkel' },
  Stuttgart: { name: 'Galateabrunnen', kinds: ['fountainMarket', 'fountainBowls'], fig: 'nymphe', stone: 'weiss', mat: 'stein' },
  Salzburg: { name: 'Residenzbrunnen', kinds: ['fountainDolphin'], fig: 'pferd', stone: 'weiss', mat: 'stein' },
  Valletta: { name: 'Tritonenbrunnen', kinds: ['fountainBowls', 'fountainDolphin'], fig: 'neptun', stone: 'travertin', mat: 'bronze' },
  Hanau: { name: 'Märchenbrunnen', kinds: ['fountainMarket'], fig: 'rotkaeppchen', stone: 'rot', mat: 'bunt', crest: [0xc8322d, 0xf2c230] }, // Wappen: rote Sparren auf Gold
  Kopenhagen: { name: 'Gefionbrunnen', kinds: ['fountainBowls', 'fountainRing'], fig: 'ochse', stone: 'grau', mat: 'bronze' },
  Rom: { name: 'Trevi-Brunnen', kinds: ['fountainDolphin'], fig: 'neptun', stone: 'travertin', mat: 'stein' },
};

// Was der Ort ist (Steckbrief-Zeile, Name) → Figuren mit Gewicht
const RULES = [
  [/Zeche|Bergbau|Bergmann|Bergstadt|\bErz|Kohle|Silber|Kupfer|Revier|Schacht|Saline|Salz/, { bergmann: 6, schmied: 1.5, zahnrad: 1 }],
  [/Wein|Winzer|Reben|Riesling|Sekt/, { winzer: 6, engel: 1 }],
  [/Hanse|Kogge/, { kogge: 6, anker: 2 }],
  [/Hafen|Schiff|Werft|Küste|Meer|Ostsee|Nordsee|Insel|Strand|Leuchtturm/, { anker: 3, fischer: 2.5, kogge: 1.5, fisch: 1.5, neptun: 1 }],
  [/Fluss|Ufer|Fähre|\bMain\b|Rhein|Donau|Elbe|Mosel|Lahn|Neckar|Weser|Fulda|Kinzig|Saale|Ruhr|Isar|\bInn\b|Havel|Spree|Oder|\bSee\b/, { fischer: 1.6, waescherin: 1.4, fisch: 1.2, neptun: 0.6 }],
  [/Burg|Ritter|Festung|Stadtmauer|Wehr|Türme|Tore|Zitadelle/, { ritter: 3, loewe: 1, adler: 1 }],
  [/Kloster|Abtei|\bDom\b|Bischof|Stift|Wallfahrt|Mönch|Bonifatius|Kirche|Kathedrale/, { moench: 3, madonna: 2.5, engel: 1.5 }],
  [/Kaiser|König|Pfalz|Residenz|Schloss|Fürst|Herzog|Graf|Krönung/, { kaiser: 3, krone: 2, loewe: 1.5, adler: 1.5, pferd: 1 }],
  [/Reichsstadt|Rathaus|Gericht|Recht/, { justitia: 2.5, adler: 1 }],
  [/Universit|Gelehrt|Hochschule|Studenten/, { gelehrter: 5, globus: 1.5 }],
  [/\bKur|Heilbad|Therm|Quelle|Sole|Bäder|\bBad\b/, { nymphe: 4, engel: 1 }],
  [/Markt|Handel|Messe|Kaufleute|Händler|Krämer/, { marktfrau: 2.5, justitia: 1, globus: 1 }],
  [/Industrie|Fabrik|Stahl|Textil|\bGlas|Porzellan|\bAuto|\bWerke?\b|Hütte|Chemie|Weber/, { zahnrad: 3, schmied: 2.5 }],
  [/Bauern|Dorf|Obst|Felder|Börde|Landwirtschaft|Höfe|Acker|Weiden|Wiesen|\bHof\b/, { bauer: 2, hahn: 2, ochse: 1.2, gans: 1.2, storch: 1 }],
  [/Wald|Spessart|Vogelsberg|Rhön|Harz|Gebirge|Taunus|Odenwald|Eifel|Hunsrück|Schwarzwald|Alpen|Berge|Jagd/, { hirsch: 3, baer: 1.5 }],
  [/Grimm|Märchen|Rotkäppchen|Schwalm|Dornröschen/, { rotkaeppchen: 6 }],
  [/Fasnacht|Fastnacht|Karneval|Narr|Eulenspiegel/, { narr: 5 }],
  [/Storch/, { storch: 5 }],
];
// was jeder Ort bekommen kann, je Größe (wenig Gewicht: die Regeln des Steckbriefs gehen vor)
const POOL = {
  dorf: { hahn: 1, gans: 1, storch: 0.8, bauer: 1, ochse: 0.7, baer: 0.8, fisch: 0.6, marktfrau: 0.4, heinzel: 0.4 },
  klein: { marktfrau: 1, loewe: 1, baer: 1, hahn: 0.6, engel: 0.7, madonna: 0.6, zirbel: 0.6, fisch: 0.5, ritter: 0.5, narr: 0.3, heinzel: 0.3 },
  stadt: { loewe: 1, adler: 0.9, neptun: 0.8, justitia: 0.8, kaiser: 0.6, globus: 0.6, zirbel: 0.8, krone: 0.6, pferd: 0.6, marktfrau: 0.6, engel: 0.5 },
  gross: { loewe: 1, adler: 1, neptun: 1, justitia: 0.9, kaiser: 0.8, globus: 0.8, zirbel: 0.6, krone: 0.8, pferd: 0.8, herkules: 0.5 },
};
// im Ausland: nichts Deutsches wie Bergmann (außer der Steckbrief sagt es), dafür mehr Mittelmeer und Norden
const ABROAD = {
  med: { neptun: 1.5, engel: 1.5, fisch: 1, nymphe: 1, zirbel: 0.8, loewe: 0.8 },
  levante: { globus: 1, loewe: 1, zirbel: 1, fisch: 0.8 },
  nordic: { anker: 1.5, kogge: 1, fischer: 1.2, hirsch: 1 },
  dutch: { anker: 1, fischer: 1, kogge: 0.8, storch: 1, hahn: 0.6 },
  british: { loewe: 1.5, krone: 1, adler: 0.6, pferd: 0.8 },
  american: { adler: 1.5, globus: 1, pferd: 1, baer: 1 },
  japanese: { fisch: 1.5, hahn: 0.7, hirsch: 1.2, globus: 0.5 },
  haussmann: { nymphe: 1, neptun: 1, globus: 0.8, loewe: 0.6 },
  kolonial: { fisch: 1, anker: 1, engel: 1, globus: 0.8 },
  altstadt: { loewe: 1, adler: 1, ritter: 0.8, madonna: 0.8, kaiser: 0.6 },
};
const NOT_ABROAD = new Set(['bergmann', 'heinzel', 'rotkaeppchen', 'narr', 'storch', 'gelehrter']);

// Steine nach den Fassadenfarben des Orts (Paletten aus steckbrief.js WALLS) und nach der Bauweise
const WALL_STONE = [
  ['sandrot', 'rot', 4], ['sandgelb', 'gelb', 3], ['blaustein', 'blaustein', 4], ['backstein', 'backstein', 2], ['klinker', 'backstein', 2],
  ['gelbklinker', 'gelb', 1.5], ['kalkstein', 'muschel', 3], ['haussmann', 'weiss', 2.5], ['tuff', 'rosa', 3], ['mittelmeer', 'travertin', 2],
  ['terrakotta', 'travertin', 1.5], ['lehm', 'gelb', 2], ['bad', 'weiss', 2], ['schiefer', 'grau', 1.5], ['ddr', 'grau', 1.5], ['grau', 'grau', 1],
];
const LOOK_STONE = {
  default: { sand: 1.5, gelb: 0.6, grau: 0.5 }, fachwerk: { sand: 1.5, rot: 0.8, gelb: 0.8 }, schiefer: { grau: 1.5, basalt: 0.6, sand: 0.6 },
  kurort: { weiss: 1.5, sand: 1 }, gruenderzeit: { sand: 1, gelb: 0.8, grau: 0.8, weiss: 0.5 }, sandstein: { rot: 2, gelb: 0.8 },
  brick: { backstein: 1.5, grau: 0.8 }, alpine: { grau: 1.5, weiss: 0.6 }, barock: { gelb: 1, sand: 1, weiss: 0.8 },
  platte: { grau: 1.5, weiss: 0.5 }, nachkrieg: { grau: 1.2, sand: 0.8 }, baeder: { weiss: 1.5 }, schwarzwald: { rot: 1.2, grau: 0.8 },
  dutch: { backstein: 1.5, grau: 0.6 }, med: { travertin: 1.5, muschel: 1 }, nordic: { grau: 1.5, backstein: 0.6 },
  british: { grau: 1, gelb: 1, sand: 0.8 }, american: { grau: 1.2, rosa: 0.8 }, japanese: { grau: 1.5 }, haussmann: { weiss: 1.5, sand: 0.8 },
  laube: { grau: 1, sand: 1 }, levante: { muschel: 1.5, gelb: 1 }, kolonial: { weiss: 1, travertin: 1 }, altstadt: { sand: 1, gelb: 1, rot: 0.6 },
};
// Basaltland: Vogelsberg, Rhön und Eifel
const BASALT_BOX = [{ s: 50.35, n: 50.75, w: 8.85, e: 10.15 }, { s: 50.1, n: 50.45, w: 6.4, e: 7.2 }];

// Wappenfarben, wo der Steckbrief keine Stadtfarben kennt
const TINCTURES = [[0xd8453a, 0xfaf7f0], [0x3f6fb8, 0xfaf7f0], [0xf2c230, 0x2f2a28], [0x4f9a5a, 0xfaf7f0], [0xd8453a, 0xf2c230], [0x3f6fb8, 0xf2c230], [0x2f2a28, 0xfaf7f0], [0xd8453a, 0x3f6fb8]];

const u01 = (s) => (hashKey(s) + 0.5) / 4294967296;
const bump = (m, k, v) => m.set(k, (m.get(k) ?? 0) + v);

function figureWeights(place) {
  const pr = profileOf(place);
  const size = sizeOf(place.pop ?? 0);
  const home = (place.cc ?? 'DE') === 'DE';
  // die Zeile des Steckbriefs (der Ortsname nur, wenn er „Bad …“ heißt: Fulda heißt nach dem Fluss, ist aber keine Fischerstadt)
  const text = `${pr.note}${/^Bad /.test(place.name) ? ' Bad' : ''}`;
  const w = new Map();
  for (const [re, figs] of RULES) if (re.test(text)) for (const [f, v] of Object.entries(figs)) bump(w, f, v);
  for (const [f, v] of Object.entries(POOL[size])) bump(w, f, v * 0.6);
  if (!home) {
    // Japan: nur, was dort hingehört (Karpfen, die Hirsche von Nara, Hahn, Kugel)
    if (pr.looks[0][0] === 'japanese') return new Map(Object.entries(ABROAD.japanese).map(([f, v]) => [f, v * v]));
    for (const [look, share] of pr.looks) for (const [f, v] of Object.entries(ABROAD[look] ?? {})) bump(w, f, v * share * 2);
    for (const f of NOT_ABROAD) if (!RULES.some(([re, figs]) => figs[f] && re.test(pr.note))) w.delete(f);
  }
  // Hessen und die Schwalm: Grimms Märchen
  if (home && (place.lat ?? 0) > 50.2 && (place.lat ?? 0) < 51.4 && (place.lon ?? 0) > 8.3 && (place.lon ?? 0) < 10 && size !== 'gross') bump(w, 'rotkaeppchen', 0.35);
  for (const f of ONLY_REAL) w.delete(f);
  // quadriert: was der Steckbrief klar sagt (Zeche, Wein, Hanse …), setzt sich deutlich durch
  for (const [f, v] of w) w.set(f, v * v);
  return w;
}

function stoneWeights(place) {
  const pr = profileOf(place);
  const w = new Map();
  const walls = new Set(pr.walls);
  for (const [pal, stone, v] of WALL_STONE) if (WALLS[pal].some((c) => walls.has(c))) bump(w, stone, v);
  for (const [look, share] of pr.looks) for (const [s, v] of Object.entries(LOOK_STONE[look] ?? { sand: 1 })) bump(w, s, v * share * 1.5);
  if (BASALT_BOX.some((b) => place.lat > b.s && place.lat < b.n && place.lon > b.w && place.lon < b.e)) bump(w, 'basalt', 4);
  if (!w.size) bump(w, 'sand', 1);
  // eine kleine Chance für jeden Stein, damit sich immer eine freie Kombination findet
  for (const s of Object.keys(STONES)) bump(w, s, 0.04);
  return w;
}

function kindWeights(place, size) {
  const w = new Map(fountainChoices(place, size));
  // eine feste Art (Rom, Tokio, Osaka, Baden-Baden) allein
  const own = ownKind(place, size);
  return own ? new Map([[own, 1]]) : w;
}

/** Fassung der Figur nach Figur und Bauweise. */
function matOf(place, fig) {
  const pr = profileOf(place);
  const look = pr.looks[0][0];
  const h = u01('Fassung ' + (place.key ?? place.name));
  if (['krone', 'zirbel', 'globus'].includes(fig)) return h < 0.8 ? 'gold' : 'bronze';
  if (['anker', 'zahnrad'].includes(fig)) return 'dunkel';
  if (['kogge', 'hahn', 'storch', 'gans', 'rotkaeppchen', 'heinzel', 'narr'].includes(fig)) return h < 0.75 ? 'bunt' : 'bronze';
  if ((place.cc === 'CH' || ['fachwerk', 'alpine', 'schwarzwald'].includes(look)) && h < 0.6) return 'bunt';
  if (['barock', 'kurort', 'baeder'].includes(look) && h < 0.5) return 'gold';
  if (['madonna', 'engel', 'nymphe', 'moench'].includes(fig) && h < 0.45) return 'stein';
  if (['platte', 'nachkrieg', 'brick'].includes(look) && h < 0.5) return 'dunkel';
  return h < 0.12 ? 'gold' : h < 0.2 ? 'stein' : 'bronze';
}

function crestOf(place) {
  const pr = profileOf(place);
  if (pr.flag) return pr.flag.slice();
  return TINCTURES[hashKey('Wappen ' + (place.key ?? place.name)) % TINCTURES.length].slice();
}

/**
 * Bauform innerhalb der Art (die Arten mit dem meisten Orten): achteckig oder rund, Säule niedrig bis hoch, wie viele
 * Röhren. Nur Zierde, beim Ausschluss von Doppelten zählt sie nicht mit.
 */
function formOf(key, kind) {
  const u = (s) => u01('Form ' + s + ' ' + key);
  if (kind === 'fountainMarket') return { oct: u('eck') < 0.45, ch: [2.8, 3.1, 3.3, 3.6][Math.floor(u('hoch') * 4)], spouts: [3, 4, 4, 6][Math.floor(u('rohr') * 4)] };
  return null;
}

// --- die Verteilung über alle Orte --------------------------------------------------------------------------------
let TABLE = null;

function neighbours() {
  const near = new Map();
  for (const p of places) {
    const d = places.filter((q) => q !== p).map((q) => [q, Math.hypot(q.lat - p.lat, (q.lon - p.lon) * Math.cos((p.lat * Math.PI) / 180))]);
    d.sort((a, b) => a[1] - b[1]);
    near.set(p.key, d.slice(0, 4).map(([q]) => q.key));
  }
  return near;
}

/** Gewichtete Rangfolge (Efraimidis–Spirakis): log(u)/w, je größer, desto eher. */
const rank = (salt, k, w) => (w > 0 ? Math.log(u01(salt + k)) / w : -Infinity);

function build() {
  const table = new Map();
  const used = new Set();
  const near = neighbours();
  // die echten Brunnen zuerst (ihr Paar aus Art, Figur und Stein ist vergeben), dann die großen Orte vor den kleinen
  const first = (p) => (REAL[p.key] ? 0 : 1);
  const order = places.slice().sort((a, b) => first(a) - first(b) || (b.pop ?? 0) - (a.pop ?? 0) || (a.key < b.key ? -1 : 1));
  for (const p of order) table.set(p.key, choose(p, used, near, table));
  return table;
}

function choose(place, used = null, near = null, table = null) {
  const key = place.key ?? place.name;
  const size = sizeOf(place.pop ?? 0);
  const special = SPECIAL[key];
  const crest = crestOf(place);
  if (special) return { kind: special, fig: null, stone: 'sand', mat: 'bronze', crest, name: null, extra: null, real: true, form: null };
  const kinds = kindWeights(place, size);
  const real = REAL[key];
  if (real) {
    const kind = real.kinds.find((k) => kinds.has(k)) ?? [...kinds.entries()].sort((a, b) => b[1] - a[1])[0][0];
    const stone = NATIVE.has(kind) ? 'sand' : real.stone;
    const pass = { kind, fig: real.fig, stone, mat: real.mat ?? 'bronze', crest: real.crest ?? crest, name: real.name, extra: real.extra ?? null, real: true, form: formOf(key, kind) };
    if (used) used.add(`${kind}|${real.fig}|${stone}`);
    return pass;
  }
  const figs = figureWeights(place);
  const stones = stoneWeights(place);
  // Nachbarn (schon verteilt) meiden dieselbe Figur und dieselbe Art
  const nf = new Set();
  const nk = new Set();
  for (const q of near?.get(key) ?? []) {
    const t = table?.get(q);
    if (t) {
      nf.add(t.fig);
      nk.add(t.kind);
    }
  }
  const cand = [];
  for (const [k, wk] of kinds) {
    const rk = rank('Art ' + key, k, wk * wk * (nk.has(k) ? 0.35 : 1));
    for (const [f, wf] of figs) {
      const rf = rank('Figur ' + key, f, wf * (nf.has(f) ? 0.15 : 1));
      const st = NATIVE.has(k) ? [['sand', 1]] : [...stones];
      for (const [s, ws] of st) cand.push([rk + rf + rank('Stein ' + key, s, ws), k, f, s]);
    }
  }
  cand.sort((a, b) => b[0] - a[0]);
  const pick = cand.find(([, k, f, s]) => !used || !used.has(`${k}|${f}|${s}`)) ?? cand[0];
  const [, kind, fig, stone] = pick;
  if (used) used.add(`${kind}|${fig}|${stone}`);
  return { kind, fig, stone, mat: matOf(place, fig), crest, name: FIG_NAMES[fig], extra: null, real: false, form: formOf(key, kind) };
}

/** Pass des Hauptbrunnens eines Orts (für Orte der Karte aus der gemeinsamen Verteilung, sonst für sich gewählt). */
export function passOf(place) {
  if (!TABLE) TABLE = build();
  return TABLE.get(place.key) ?? choose(place);
}

/** Alle Pässe (Ortskennung → Pass), für Tests und das Album. */
export function allPasses() {
  if (!TABLE) TABLE = build();
  return TABLE;
}
