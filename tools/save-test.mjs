// Prüft ohne Browser, was beim Laden der Seite als Erstes entschieden wird:
// - Spielstand (src/save.js gegen einen Ersatz für localStorage): Alte Stände laden – einer vom Stand „main“ (ohne
//   visits, best.reise), einer dieses Zweigs aus der Zeit mit zwei Modi (klassische Autobahn und Reise, mit Album),
//   einer mit Feldern, die niemand kennt (was sie enthalten, übersteht Laden und Speichern), kaputte und ein
//   gesperrter Speicher. Von der klassischen Autobahn bleibt nichts: Ihre Rekorde und Felder fallen still weg,
//   Guthaben, Käufe, Album, besuchte Orte und Einstellungen bleiben.
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
const { DEFAULT_SAVE, loadSave, storeSave, resetSave, settleStream, settlePending } = await import('../src/save.js');
const put = (v) => box.set(KEY, typeof v === 'string' ? v : JSON.stringify(v));
/** Felder der klassischen Autobahn, die kein geladener Stand mehr trägt (save.js RETIRED). */
const RETIRED = { top: ['mode', 'seenIntro'], best: ['distance'], stats: ['totalKm', 'leftLaneEuro'] };
const retired = (s) => [...RETIRED.top.filter((k) => k in s), ...RETIRED.best.filter((k) => k in s.best).map((k) => 'best.' + k), ...RETIRED.stats.filter((k) => k in s.stats).map((k) => 'stats.' + k)];
/** Hat der Stand alles, was das Spiel ohne Nachfragen liest – und nichts mehr von der klassischen Autobahn? */
function whole(s, what) {
  ok(typeof s.wallet === 'number' && isFinite(s.wallet), `${what}: Guthaben ${s.wallet}`);
  for (const k of ['upgrades', 'best', 'stats', 'settings', 'visits']) ok(s[k] && typeof s[k] === 'object' && !Array.isArray(s[k]), `${what}: ${k} fehlt oder ist kein Objekt`);
  for (const [k, v] of Object.entries(DEFAULT_SAVE.best)) ok(typeof s.best[k] === typeof v, `${what}: best.${k}`);
  for (const [k, v] of Object.entries(DEFAULT_SAVE.stats)) ok(typeof s.stats[k] === typeof v, `${what}: stats.${k}`);
  for (const [k, v] of Object.entries(DEFAULT_SAVE.settings)) ok(typeof s.settings[k] === typeof v, `${what}: settings.${k}`);
  ok(!retired(s).length, `${what}: trägt noch ${retired(s).join(', ')}`);
}

// --- Spielstand ----------------------------------------------------------------------------------------------------------
// leer: der Standard, und zwar jedes Mal ein eigener (wer ihn ändert, ändert nicht die Vorlage)
{
  const a = loadSave();
  ok(same(a, DEFAULT_SAVE), 'Ohne Spielstand kommt nicht der Standard');
  a.best.reise = 5;
  a.visits.Hanau = 1;
  ok(DEFAULT_SAVE.best.reise === 0 && !('Hanau' in DEFAULT_SAVE.visits) && loadSave().best.reise === 0, 'Der Standard-Spielstand wird geteilt statt kopiert');
}
// Stand „main“ (nur die klassische Autobahn): ohne visits, best.reise, stats.reiseKm, settings.facecam – dafür mit
// Rekord und Kilometern der endlosen Strecke, dem alten stats.leftLaneEuro und seenIntro
const MAIN = {
  wallet: 137.42, upgrades: { starlink: 1, wischer: 2 }, best: { distance: 48211.5, earned: 96.3, viewers: 1804 },
  stats: { runs: 12, totalKm: 301.7, naviReached: 31, crashes: 9, leftLaneEuro: 12.5 },
  settings: { sound: false, speech: true, chat: true, quality: 'mittel', volume: 0.35 }, seenIntro: true,
};
{
  put(MAIN);
  const s = loadSave();
  whole(s, 'Stand von main');
  ok(s.wallet === 137.42 && same(s.upgrades, MAIN.upgrades) && s.best.earned === 96.3 && s.best.viewers === 1804, 'Stand von main: Guthaben, Upgrades oder Rekorde gingen verloren');
  ok(s.stats.runs === 12 && s.stats.naviReached === 31 && s.stats.crashes === 9, 'Stand von main: Statistik ging verloren');
  ok(s.settings.sound === false && s.settings.quality === 'mittel' && s.settings.volume === 0.35 && s.settings.facecam === true, 'Stand von main: Einstellungen gingen verloren');
  ok(s.best.reise === 0 && s.stats.reiseKm === 0 && same(s.visits, {}) && same(s.album, DEFAULT_SAVE.album), 'Stand von main: Die neuen Felder haben nicht ihren Standard');
  ok(storeSave(s) && retired(JSON.parse(box.get(KEY))).length === 0, 'Stand von main: Nach dem Speichern stehen die klassischen Felder noch im Speicher');
}
// Stand dieses Zweigs aus der Zeit mit zwei Modi (zuletzt klassisch gespielt): klassischer Rekord und Kilometer neben
// Reise-Rekord, Reisekilometern, besuchten Orten, Album und dem erstatteten Megafon
const ALBUM = { n: 3, list: [{ n: 1, p: 'Hanau', k: 'fountainBowls', t: 1763650000000, u: 1104 }, { n: 3, p: 'Würzburg', k: 'fountainGrand', t: 1763660000000, u: 1180, d: 'kiliani' }] };
const AUSBAU = {
  ...MAIN, mode: 'klassik', best: { ...MAIN.best, reise: 187400 }, stats: { runs: 14, totalKm: 301.7, naviReached: 35, crashes: 9, reiseKm: 412.6 },
  settings: { ...MAIN.settings, facecam: false }, visits: { Hanau: 3, 'Frankfurt am Main': 1 }, album: ALBUM, megafonRefund: 450,
};
{
  put(AUSBAU);
  const s = loadSave();
  whole(s, 'Stand des Zweigs');
  ok(s.wallet === 137.42 && same(s.upgrades, MAIN.upgrades) && same(s.album, ALBUM) && s.megafonRefund === 450, 'Stand des Zweigs: Guthaben, Käufe, Album oder die Erstattung gingen verloren');
  ok(s.best.reise === 187400 && s.best.earned === 96.3 && s.best.viewers === 1804 && s.stats.reiseKm === 412.6 && s.stats.runs === 14 && same(s.visits, AUSBAU.visits) && s.settings.facecam === false && s.settings.volume === 0.35, 'Stand des Zweigs: Rekorde, Kilometer, Orte oder Einstellungen gingen verloren');
  ok(storeSave(s) && same(loadSave(), s), 'Gespeichert und geladen ist nicht mehr derselbe Stand');
  ok(retired(JSON.parse(box.get(KEY))).length === 0, 'Stand des Zweigs: Nach dem Speichern stehen die klassischen Felder noch im Speicher');
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
  ok(s.wallet === 0 && s.best.earned === MAIN.best.earned, 'Ein Guthaben, das keine Zahl ist, wird nicht zu 0 – oder reißt den Rest mit');
}
// Einstellungen mit falschem Typ oder Wert: nur diese fallen auf den Standard, die übrigen und unbekannte bleiben
{
  const settings = { sound: 'ja', speech: false, chat: 1, facecam: false, quality: 7, volume: 'laut', steerSens: 0.4, hud: 'klein' };
  put(JSON.stringify({ ...MAIN, settings }));
  const s = loadSave().settings;
  const d = DEFAULT_SAVE.settings;
  ok(s.sound === d.sound && s.chat === d.chat && s.quality === d.quality && s.volume === d.volume, `Kaputte Einstellungen bleiben stehen: ${JSON.stringify(s)}`);
  ok(s.speech === false && s.facecam === false && s.steerSens === 0.4 && s.hud === 'klein', `Gültige oder unbekannte Einstellungen gehen verloren: ${JSON.stringify(s)}`);
  for (const [volume, keep] of [[0, true], [1, true], [0.35, true], [-0.1, false], [1.5, false], [null, false], [NaN, false]]) {
    put(JSON.stringify({ ...MAIN, settings: { ...MAIN.settings, volume } }));
    const v = loadSave().settings.volume;
    ok(keep ? v === volume : v === d.volume, `Lautstärke ${volume}: geladen ${v}`);
  }
  for (const quality of ['auto', 'hoch', 'mittel', 'niedrig']) {
    put(JSON.stringify({ ...MAIN, settings: { ...MAIN.settings, quality } }));
    ok(loadSave().settings.quality === quality, `Qualität ${quality} geht verloren`);
  }
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

// --- Zwischenstand eines Streams: Endet die Seite mitten im Stream, bucht ihn der nächste Start ----------------------
{
  box.clear();
  const a = loadSave();
  a.wallet = 100;
  a.best.reise = 5000;
  // ein Stream läuft, der Zwischenstand steht im Speicher; dann geht die Seite zu
  a.pending = { money: 42.5, distance: 12000, peakViewers: 900, naviReached: 2, crashes: 1 };
  storeSave(a);
  const b = loadSave();
  ok(same(b.pending, a.pending), 'Der Zwischenstand übersteht Speichern und Laden nicht');
  const got = settlePending(b);
  ok(got && got.money === 42.5, 'settlePending liefert den gebuchten Stream nicht');
  ok(b.pending === null, 'Nach dem Buchen steht der Zwischenstand noch da');
  ok(b.wallet === 142.5 && b.best.reise === 12000 && b.stats.runs === 1 && b.stats.naviReached === 2 && b.stats.crashes === 1 && b.best.viewers === 900, `Gebucht wird falsch: ${JSON.stringify({ w: b.wallet, best: b.best, stats: b.stats })}`);
  ok(Math.abs(b.stats.reiseKm - 12) < 1e-9, 'Reisekilometer des abgebrochenen Streams fehlen');
  ok(same(b.streamNote, { money: 42.5, distance: 12000 }), 'Der Titel erfährt nicht, was der abgebrochene Stream gebracht hat');
  ok(settlePending(b) === null && b.wallet === 142.5, 'Ein Zwischenstand wird zweimal gebucht');
  storeSave(b);
  const c = loadSave();
  ok(c.pending === null && same(c.streamNote, b.streamNote), 'Hinweis oder erledigter Zwischenstand gehen beim Speichern verloren');
  // ein abgebrochener Stream im Minus: Der Titel nennt, was wirklich vom Guthaben abging – ganz, auch unter null
  const m = loadSave();
  m.wallet = 120;
  m.pending = { money: -325, distance: 23400, peakViewers: 1, naviReached: 0, crashes: 3 };
  settlePending(m);
  ok(m.wallet === -205 && same(m.streamNote, { money: -325, distance: 23400 }), `Abbruch im Minus: Guthaben ${m.wallet}, Hinweis ${JSON.stringify(m.streamNote)}`);
  // ein Stream im Minus (Schäden, Bußgelder): Das Guthaben geht unter null, und die Schulden bleiben stehen
  const d = loadSave();
  d.wallet = 10;
  settleStream(d, { money: -325, distance: 800, peakViewers: 300, naviReached: 0, crashes: 3 });
  ok(d.wallet === -315, `Stream im Minus: Guthaben ${d.wallet} statt −315`);
  // der Rekord zählt erst ab 50 Reisemetern
  const e = loadSave();
  e.best.reise = 0;
  ok(settleStream(e, { money: 0, distance: 40, peakViewers: 0, naviReached: 0, crashes: 0 }).newRecord === false, 'Ein Stream von 40 m ist ein neuer Rekord');
  ok(settleStream(e, { money: 0, distance: 9000, peakViewers: 0, naviReached: 0, crashes: 0 }).newRecord === true, 'Ein Stream von 9 km ist kein neuer Rekord');
  // kaputte Zwischenstände: nichts wird gebucht, nichts wirft
  for (const bad of [{ money: 'viel', distance: 1 }, { money: 5 }, [], 7, 'x', { money: NaN, distance: 3 }]) {
    put({ ...DEFAULT_SAVE, wallet: 7, pending: bad });
    const f = loadSave();
    ok(f.pending === null, `Kaputter Zwischenstand ${JSON.stringify(bad)} wird nicht verworfen`);
    ok(settlePending(f) === null && f.wallet === 7, `Kaputter Zwischenstand ${JSON.stringify(bad)} ändert das Guthaben`);
  }
  put({ ...DEFAULT_SAVE, streamNote: { money: 'x' } });
  ok(loadSave().streamNote === null, 'Kaputter Titel-Hinweis wird nicht verworfen');
  console.log('Zwischenstand: Buchen nach Abbruch, Minus, Rekordgrenze und kaputte Stände geprüft');
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
