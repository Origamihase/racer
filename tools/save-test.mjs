// Prüft ohne Browser, was beim Laden der Seite als Erstes entschieden wird:
// - Spielstand (src/save.js gegen einen Ersatz für localStorage): Alte Stände laden – einer vom Stand „main“ (ohne
//   visits, best.reise), einer dieses Zweigs vor der Reise als einzigem Spiel, einer mit Feldern, die niemand kennt
//   (was sie enthalten, übersteht Laden und Speichern), kaputte und ein gesperrter Speicher.
// - Kartendaten (src/map/credits.js): Die Hinweise der Höhenquellen passen zu den Ländern, die die Karte berührt.
// node tools/save-test.mjs
let fails = 0;
let checks = 0;
function ok(cond, msg) {
  checks++;
  if (cond) return;
  fails++;
  console.error('FEHLER: ' + msg);
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// --- Ersatz für localStorage -------------------------------------------------------------------------------------------
const KEY = 'mini-adam-tesla-navi-v1';
const box = new Map();
let locked = false;
globalThis.localStorage = {
  getItem: (k) => {
    if (locked) throw new Error('gesperrt');
    return box.has(k) ? box.get(k) : null;
  },
  setItem: (k, v) => {
    if (locked) throw new Error('gesperrt');
    box.set(k, String(v));
  },
  removeItem: (k) => {
    if (locked) throw new Error('gesperrt');
    box.delete(k);
  },
};
const { DEFAULT_SAVE, loadSave, storeSave, resetSave } = await import('../src/save.js');
const put = (v) => box.set(KEY, typeof v === 'string' ? v : JSON.stringify(v));
/** Hat der Stand alles, was das Spiel ohne Nachfragen liest? */
function whole(s, what) {
  ok(typeof s.wallet === 'number' && isFinite(s.wallet), `${what}: Guthaben ${s.wallet}`);
  for (const k of ['upgrades', 'best', 'stats', 'settings', 'visits']) ok(s[k] && typeof s[k] === 'object' && !Array.isArray(s[k]), `${what}: ${k} fehlt oder ist kein Objekt`);
  for (const [k, v] of Object.entries(DEFAULT_SAVE.best)) ok(typeof s.best[k] === typeof v, `${what}: best.${k}`);
  for (const [k, v] of Object.entries(DEFAULT_SAVE.stats)) ok(typeof s.stats[k] === typeof v, `${what}: stats.${k}`);
  for (const [k, v] of Object.entries(DEFAULT_SAVE.settings)) ok(typeof s.settings[k] === typeof v, `${what}: settings.${k}`);
}

// --- Spielstand ----------------------------------------------------------------------------------------------------------
// leer: der Standard, und zwar jedes Mal ein eigener (wer ihn ändert, ändert nicht die Vorlage)
{
  const a = loadSave();
  ok(same(a, DEFAULT_SAVE), 'Ohne Spielstand kommt nicht der Standard');
  a.best.distance = 5;
  a.visits.Hanau = 1;
  ok(DEFAULT_SAVE.best.distance === 0 && !('Hanau' in DEFAULT_SAVE.visits) && loadSave().best.distance === 0, 'Der Standard-Spielstand wird geteilt statt kopiert');
}
// Stand „main“: ohne visits, best.reise, stats.reiseKm, settings.facecam – dafür mit dem alten stats.leftLaneEuro
const MAIN = {
  wallet: 137.42, upgrades: { starlink: 1, wischer: 2 }, best: { distance: 48211.5, earned: 96.3, viewers: 1804 },
  stats: { runs: 12, totalKm: 301.7, naviReached: 31, crashes: 9, leftLaneEuro: 12.5 },
  settings: { sound: false, speech: true, chat: true, quality: 'mittel', volume: 0.35 }, seenIntro: true,
};
{
  put(MAIN);
  const s = loadSave();
  whole(s, 'Stand von main');
  ok(s.wallet === 137.42 && same(s.upgrades, MAIN.upgrades) && s.best.distance === 48211.5 && s.best.earned === 96.3 && s.best.viewers === 1804, 'Stand von main: Guthaben, Upgrades oder Rekorde gingen verloren');
  ok(s.stats.runs === 12 && s.stats.totalKm === 301.7 && s.stats.naviReached === 31 && s.stats.crashes === 9 && s.stats.leftLaneEuro === 12.5, 'Stand von main: Statistik ging verloren');
  ok(s.settings.sound === false && s.settings.quality === 'mittel' && s.settings.volume === 0.35 && s.settings.facecam === true && s.seenIntro === true, 'Stand von main: Einstellungen gingen verloren');
  ok(s.best.reise === 0 && s.stats.reiseKm === 0 && same(s.visits, {}), 'Stand von main: Die neuen Felder haben nicht ihren Standard');
}
// Stand dieses Zweigs mit beiden Modi: mit Reise-Rekord, Reisekilometern und besuchten Orten
const AUSBAU = {
  ...MAIN, best: { ...MAIN.best, reise: 187400 }, stats: { runs: 14, totalKm: 301.7, naviReached: 35, crashes: 9, reiseKm: 412.6 },
  settings: { ...MAIN.settings, facecam: false }, visits: { Hanau: 3, 'Frankfurt am Main': 1 },
};
{
  put(AUSBAU);
  const s = loadSave();
  whole(s, 'Stand des Zweigs');
  ok(s.best.reise === 187400 && s.stats.reiseKm === 412.6 && same(s.visits, AUSBAU.visits) && s.settings.facecam === false, 'Stand des Zweigs: Reise-Rekord, Kilometer, Orte oder Facecam gingen verloren');
  ok(storeSave(s) && same(loadSave(), s), 'Gespeichert und geladen ist nicht mehr derselbe Stand');
}
// Felder, die niemand kennt: oben, in den Teilen und geschachtelt – ihr Inhalt übersteht Laden und Speichern
{
  const future = {
    ...AUSBAU, sammlung: [{ n: 1, ort: 'Hanau', bild: 'data:…' }], akku: { kwh: 75, laden: [1, 2, 3] }, flag: false, zahl: 0, text: '',
    best: { ...AUSBAU.best, etappe: 303.2 }, stats: { ...AUSBAU.stats, tanken: 4 }, settings: { ...AUSBAU.settings, hud: 'klein' },
  };
  put(future);
  const s = loadSave();
  whole(s, 'Stand mit unbekannten Feldern');
  ok(storeSave(s), 'Speichern schlägt fehl');
  const again = JSON.parse(box.get(KEY));
  for (const k of ['sammlung', 'akku', 'flag', 'zahl', 'text']) ok(same(again[k], future[k]), `Unbekanntes Feld „${k}“ übersteht Laden und Speichern nicht`);
  ok(again.best.etappe === 303.2 && again.stats.tanken === 4 && again.settings.hud === 'klein', 'Unbekannte Felder in best, stats oder settings gehen verloren');
  ok(same(loadSave(), s), 'Zweites Laden ergibt einen anderen Stand');
}
// kaputt: kein JSON, kein Objekt, falsche Arten in den Feldern – das Spiel bekommt immer einen ganzen Stand
for (const [what, raw] of [
  ['abgeschnitten', '{"wallet":12,"best":{"dist'], ['leer', ''], ['null', 'null'], ['Zahl', '42'], ['Text', '"hallo"'], ['Liste', '[1,2,3]'],
  ['Teile sind keine Objekte', JSON.stringify({ wallet: '12,5', upgrades: 3, best: 'weit', stats: [1, 2], settings: null, visits: 'Hanau' })],
]) {
  put(raw);
  const s = loadSave();
  whole(s, 'kaputter Stand (' + what + ')');
  ok(storeSave(s) && same(loadSave(), s), `kaputter Stand (${what}): nach dem Speichern lädt etwas anderes`);
}
{
  put(JSON.stringify({ ...MAIN, wallet: 'viel' }));
  const s = loadSave();
  ok(s.wallet === 0 && s.best.distance === MAIN.best.distance, 'Ein Guthaben, das keine Zahl ist, wird nicht zu 0 – oder reißt den Rest mit');
}
// gesperrter Speicher: Standard laden, Speichern meldet false, nichts wirft
{
  locked = true;
  let s = null;
  let stored = true;
  try {
    s = loadSave();
    stored = storeSave(s);
    resetSave();
  } catch (e) {
    ok(false, 'Gesperrter Speicher wirft: ' + e.message);
  }
  ok(s && same(s, DEFAULT_SAVE) && stored === false, 'Gesperrter Speicher: kein Standard-Stand oder Speichern meldet Erfolg');
  locked = false;
  put(AUSBAU);
  ok(same(resetSave(), DEFAULT_SAVE) && !box.has(KEY), 'Zurücksetzen lässt etwas übrig');
}

// --- Kartendaten: die Hinweise der Höhenquellen gegen die Karte ---------------------------------------------------------
const { nodes } = await import('../src/map/graph.js');
const { MAP_SOURCES, TERRAIN_NOTICES } = await import('../src/map/credits.js');
{
  const cc = new Set(nodes.map((n) => n.cc));
  const north = Math.max(...nodes.map((n) => n.lat));
  for (const n of TERRAIN_NOTICES) {
    const w = n.where;
    ok(!w || (w.cc ? cc.has(w.cc) : north > w.north), `Der Hinweis „${n.text.slice(0, 40)}…“ gilt für ein Gebiet, das die Karte nicht (mehr) berührt`);
    ok(n.text.length > 20 && /terrain data/.test(n.text), `Hinweis ohne Wortlaut: ${n.text}`);
  }
  // umgekehrt: Länder mit eigenem Hinweis, die die Karte berührt, stehen in der Liste – bekannt sind alle, für die die
  // Quelle einen eigenen Hinweis führt (die Karte reicht bis Vancouver und Monterrey)
  const KNOWN = { AT: 'Austria', AU: 'Australia', CA: 'Canada', GB: 'United Kingdom', MX: 'Mexico', NO: 'Norway', NZ: 'New Zealand' };
  for (const [c, name] of Object.entries(KNOWN)) ok(!cc.has(c) || TERRAIN_NOTICES.some((n) => n.where && n.where.cc === c && n.text.startsWith(name)), `Die Karte hat Straßen in ${name}, der Hinweis fehlt`);
  ok(north <= 60 || TERRAIN_NOTICES.some((n) => n.where && n.where.north === 60 && n.text.startsWith('ArcticDEM')), `Die Karte reicht bis ${north.toFixed(1)}° Nord, der Hinweis ArcticDEM fehlt`);
  for (const lead of ['Europe', 'Global ETOPO1', 'United States 3DEP']) ok(TERRAIN_NOTICES.some((n) => n.text.startsWith(lead)), `Hinweis „${lead} …“ fehlt`);
  ok(MAP_SOURCES.some((q) => q.name === 'GeoNames' && /geonames\.org/.test(q.url) && q.license === 'CC BY 4.0' && /creativecommons\.org\/licenses\/by\/4\.0/.test(q.licenseUrl) && q.changed), 'GeoNames ohne Link, Lizenz oder Hinweis auf die Anpassung');
  ok(MAP_SOURCES.some((q) => q.name === 'Natural Earth' && /naturalearthdata\.com/.test(q.url)) && MAP_SOURCES.some((q) => q.name === 'Terrain Tiles'), 'Natural Earth oder Terrain Tiles fehlen');
  console.log(`Kartendaten: ${TERRAIN_NOTICES.length} Hinweise der Höhenquellen passen zur Karte (${cc.size} Länder, nördlichster Knoten ${north.toFixed(1)}°)`);
}

console.log(`Spielstand: ${checks} Prüfungen`);
if (fails) {
  console.error(`${fails} Fehler`);
  process.exit(1);
}
console.log('alles in Ordnung');
