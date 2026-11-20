// Prüft ohne Browser das BrunnenTV-Album der Reise und die Route des Abspanns:
// - Album im Spielstand (src/save.js, src/game/album.js): alte Stände ohne Album laden, Folgen zählen über Streams
//   weiter, die Reihenfolge bleibt, das Album übersteht Speichern und Neuladen, kaputte Einträge fallen heraus, die
//   Obergrenze ALBUM_MAX hält, die Zählerei (Folgen, Brunnen, fehlende Brunnen) stimmt.
// - Bilder unter eigenem Schlüssel: Grenze je Bild und für alle zusammen (die ältesten gehen zuerst), voller oder
//   gesperrter Speicher (dann gibt es kein Bild, und das Album zeichnet seine Karte), der Spielstand selbst geht vor.
// - Streitfragen des Wikis, Datum und Uhr wie im HUD.
// - Route (src/game/routelog.js): Abschnitte in der Reihenfolge des Fahrens, Marken mit Zählerstand, Summe gleich
//   Kilometerzähler (die Fahrt im Spiel prüft tools/journey-test.mjs).
// node tools/album-test.mjs
let fails = 0;
let checks = 0;
function ok(cond, msg) {
  checks++;
  if (cond) return;
  fails++;
  console.error('FEHLER: ' + msg);
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// --- Ersatz für localStorage, mit Platzgrenze in Zeichen (wie der Browser: Schlüssel und Wert zählen) --------------------
const KEY = 'mini-adam-tesla-navi-v1';
const box = new Map();
let locked = false;
let quota = Infinity;
const used = () => [...box].reduce((a, [k, v]) => a + k.length + v.length, 0);
globalThis.localStorage = {
  getItem: (k) => {
    if (locked) throw new Error('gesperrt');
    return box.has(k) ? box.get(k) : null;
  },
  setItem: (k, v) => {
    if (locked) throw new Error('gesperrt');
    const before = box.has(k) ? k.length + box.get(k).length : 0;
    if (used() - before + k.length + String(v).length > quota) throw new Error('QuotaExceededError');
    box.set(k, String(v));
  },
  removeItem: (k) => {
    if (locked) throw new Error('gesperrt');
    box.delete(k);
  },
};
const { DEFAULT_SAVE, loadSave, storeSave, resetSave, cleanAlbum, ALBUM_MAX, PIC_KEY, PIC_MAX, PIC_BUDGET, loadPictures, storePicture } = await import('../src/save.js');
const { addEpisode, albumOf, albumCounts, missingPlaces, missingLine, debateFor, kindTitle, fmtStreamDate, episodesByPlace, placeOf } = await import('../src/game/album.js');
const { places } = await import('../src/map/graph.js');
const { goalKind, FOUNTAIN_TITLE } = await import('../src/world/kit/layout.js');
const { RouteLog } = await import('../src/game/routelog.js');
const { fmtClock } = await import('../src/util.js');
const { BRUNNEN_DEBATTE } = await import('../src/data.js');
const put = (v) => box.set(KEY, typeof v === 'string' ? v : JSON.stringify(v));
const idx = (key) => places.findIndex((p) => p.key === key);

// --- alte Stände ohne Album -------------------------------------------------------------------------------------------
ok(same(DEFAULT_SAVE.album, { n: 0, list: [] }), 'Der Standard-Spielstand hat kein leeres Album');
const MAIN = {
  wallet: 137.42, upgrades: { starlink: 1 }, best: { distance: 48211.5, earned: 96.3, viewers: 1804 },
  stats: { runs: 12, totalKm: 301.7, naviReached: 31, crashes: 9 }, settings: { sound: false }, seenIntro: true,
};
const OLD_XXL = { ...MAIN, best: { ...MAIN.best, reise: 187400 }, visits: { Hanau: 3 }, mode: 'xxl', megafonRefund: 450, megafonNote: 0 };
for (const [what, raw] of [['Stand von main', MAIN], ['Reise vor dem Album', OLD_XXL]]) {
  box.clear();
  put(raw);
  const s = loadSave();
  ok(same(s.album, { n: 0, list: [] }), `${what}: Album ist nicht leer (${JSON.stringify(s.album)})`);
  ok(s.wallet === 137.42 && s.best.distance === 48211.5 && s.stats.runs === 12, `${what}: Guthaben oder Rekorde gingen verloren`);
  const c = albumCounts(albumOf(s));
  ok(c.episodes === 0 && c.fountains === 0 && c.missing === places.length && missingPlaces(s.album).length === places.length, `${what}: Zählung ${JSON.stringify(c)}`);
}
// ein Spielstand, wie ihn die Node-Prüfungen dem Spiel geben (ohne Album): addEpisode legt es an
{
  const s = { upgrades: {}, best: {} };
  const e = addEpisode(s, { place: idx('Würzburg'), t: 0, clock: 18 * 60 + 7, kinds: [] });
  ok(e.n === 1 && s.album.n === 1 && s.album.list.length === 1 && e.p === 'Würzburg' && e.k === goalKind(places[idx('Würzburg')]), `Album ohne Spielstand: ${JSON.stringify(s.album)}`);
}

// --- Folgen über Streams, Reihenfolge, Neuladen ----------------------------------------------------------------------------
box.clear();
let save = loadSave();
const T1 = Date.UTC(2026, 10, 20, 17, 30);
const T2 = T1 + 3 * 3600e3;
const TRIP = [['Würzburg', T1, 1094.4], ['Hanau', T1, 1121], ['Würzburg', T1, 1160.6], ['Hamburg', T2, 1100], ['Ravensburg', T2, 1188]];
const made = TRIP.map(([key, t, clock]) => addEpisode(save, { place: idx(key), t, clock, kinds: ['fountainMarket', 'fountainDrink'], roll: 0.9 }));
ok(made.map((e) => e.n).join() === '1,2,3,4,5' && save.album.n === 5, `Folgen zählen nicht über Streams: ${made.map((e) => e.n)}`);
ok(made.every((e, i) => e.p === TRIP[i][0] && e.t === TRIP[i][1] && e.u === Math.round(TRIP[i][2])), 'Ort, Stream oder Uhr der Folgen stimmen nicht');
ok(made[3].d === 'alster' && made[4].d === 'kanal' && !made[0].d && !made[1].d, `Streitfragen: ${made.map((e) => e.d || '–')}`);
ok(storeSave(save), 'Speichern schlägt fehl');
{
  const again = loadSave();
  ok(same(again.album, save.album), 'Das Album übersteht das Neuladen nicht');
  ok(again.album.list.map((e) => e.n).join() === '1,2,3,4,5', 'Reihenfolge nach dem Neuladen');
  // im nächsten Stream geht es mit Folge 6 weiter
  const e = addEpisode(again, { place: idx('Gifhorn'), t: T2 + 86400e3, clock: 1090, kinds: [] });
  ok(e.n === 6 && again.album.list.at(-1) === e, `Nächste Folge nach dem Neuladen: ${e.n}`);
  save = again;
}
{
  const c = albumCounts(save.album);
  const by = episodesByPlace(save.album);
  ok(c.episodes === 6 && c.fountains === 5 && c.missing === places.length - 5 && by.get('Würzburg') === 2, `Zählung ${JSON.stringify(c)}`);
  const miss = missingPlaces(save.album);
  ok(miss.length === c.missing && !miss.some((p) => by.has(p.key)), 'Fehlende Brunnen enthalten besuchte Orte');
  ok(miss.every((p, i) => !i || miss[i - 1].n > p.n || (miss[i - 1].n === p.n && miss[i - 1].name.localeCompare(p.name, 'de') <= 0)), 'Fehlende Brunnen nicht nach Streams und Namen geordnet');
  ok(missingLine(401) === 'noch 401 Brunnen fehlen' && missingLine(1) === 'noch 1 Brunnen fehlt' && missingLine(0).startsWith('alle Brunnen'), 'Zeile der fehlenden Brunnen');
}
// Datum und Uhr: wie das HUD die Uhr der Reise zeigt (fmtClock + „Uhr“), das Datum des Streams als TT.MM.JJJJ
{
  const e = save.album.list[0];
  ok(fmtStreamDate(new Date(2026, 10, 20, 19, 5).getTime()) === '20.11.2026' && fmtStreamDate(NaN) === '', 'Datum des Streams');
  ok(fmtClock(e.u) === '18:14', `Uhr der Folge ${fmtClock(e.u)}`);
  ok(kindTitle(e.k) === FOUNTAIN_TITLE[e.k] && kindTitle('gibtsnicht') === 'Brunnen', 'Name der Brunnenart');
  ok(placeOf('Würzburg') === places[idx('Würzburg')] && placeOf('Atlantis') === null, 'Ort zum Schlüssel');
}
// kaputte Alben: das Spiel bekommt immer eines, das es lesen kann
for (const [what, raw, want] of [
  ['keins', undefined, { n: 0, len: 0 }],
  ['Liste', [1, 2], { n: 0, len: 0 }],
  ['Einträge kaputt', { n: 4, list: [null, { n: 'x', p: 'Hanau' }, { n: 2, p: '' }, { n: 3, p: 'Hanau', k: 'fountainBowls' }, { n: 3, p: 'Hanau' }, { n: 1, p: 'Gifhorn' }] }, { n: 4, len: 2 }],
  ['n zu klein', { n: 1, list: [{ n: 7, p: 'Hanau' }] }, { n: 7, len: 1 }],
  ['unbekannte Felder', { n: 2, list: [{ n: 2, p: 'Hanau', neu: true }], seite: 3 }, { n: 2, len: 1 }],
]) {
  const a = cleanAlbum(raw);
  ok(a.n === want.n && a.list.length === want.len && a.list.every((e, i) => !i || a.list[i - 1].n < e.n), `Kaputtes Album (${what}): ${JSON.stringify(a)}`);
}
ok(cleanAlbum({ n: 2, list: [{ n: 2, p: 'Hanau', neu: true }], seite: 3 }).seite === 3 && cleanAlbum({ n: 2, list: [{ n: 2, p: 'Hanau', neu: true }] }).list[0].neu === true, 'Unbekannte Felder des Albums gehen verloren');
// Obergrenze: die ältesten gehen, gezählt wird weiter
{
  const s = { upgrades: {} };
  for (let i = 0; i < ALBUM_MAX + 25; i++) addEpisode(s, { place: i % places.length, t: T1, clock: 1100, kinds: [] });
  ok(s.album.list.length === ALBUM_MAX && s.album.n === ALBUM_MAX + 25 && s.album.list[0].n === 26 && s.album.list.at(-1).n === ALBUM_MAX + 25, `Obergrenze: ${s.album.list.length} Folgen, n ${s.album.n}, erste ${s.album.list[0].n}`);
  const len = JSON.stringify(s.album).length;
  ok(len < ALBUM_MAX * 100, `Album mit ${ALBUM_MAX} Folgen braucht ${len} Zeichen`);
  console.log(`Album: ${ALBUM_MAX} Folgen = ${len} Zeichen (${(len / ALBUM_MAX).toFixed(0)} je Folge)`);
}
// Streitfragen: Hamburg und Ravensburg immer, der Trinkbrunnen nur, wo einer steht, und dann nicht jedes Mal
{
  ok(debateFor('Hamburg', [], 0.99) === 'alster' && debateFor('Ravensburg', [], 0.99) === 'kanal', 'Alster oder Kanal fehlen');
  ok(debateFor('Hanau', ['fountainDrink'], 0.1) === 'trink' && debateFor('Hanau', ['fountainDrink'], 0.9) === null && debateFor('Hanau', ['fountainMarket'], 0) === null, 'Trinkbrunnen');
  for (const k of ['trink', 'kanal', 'alster']) ok(Array.isArray(BRUNNEN_DEBATTE[k]) && BRUNNEN_DEBATTE[k].length >= 2, `Keine Chatzeilen für ${k}`);
  ok(/Trinkbrunnenproblematik/.test(BRUNNEN_DEBATTE.trink.join()) && /horizontal geteilter Brunnen/.test(BRUNNEN_DEBATTE.kanal.join()) && /Alsterfontäne/.test(BRUNNEN_DEBATTE.alster.join()), 'Die Streitfragen des Wikis fehlen');
}

// --- Bilder ------------------------------------------------------------------------------------------------------------------
const pic = (n, len) => 'data:image/webp;base64,' + String(n % 10).repeat(len - 23);
{
  box.clear();
  quota = Infinity;
  ok(storePicture(1, pic(1, 12000)) && loadPictures().get(1) === pic(1, 12000), 'Ein Bild wird nicht gespeichert');
  ok(!storePicture(2, pic(2, PIC_MAX + 1)) && !loadPictures().has(2), 'Ein zu großes Bild wird gespeichert');
  ok(!storePicture(3, 'javascript:alert(1)') && !storePicture(3.5, pic(3, 100)), 'Ein Bild, das keins ist, wird gespeichert');
  // Grenze für alle Bilder: die ältesten gehen zuerst, das neue bleibt
  const each = 30000;
  const n = Math.ceil(PIC_BUDGET / each) + 6;
  for (let i = 2; i <= n; i++) ok(storePicture(i, pic(i, each)), `Bild ${i} wird nicht gespeichert`);
  const P = loadPictures();
  const total = [...P.values()].reduce((a, v) => a + v.length, 0);
  const keys = [...P.keys()].sort((a, b) => a - b);
  ok(total <= PIC_BUDGET && P.has(n) && !P.has(1) && keys.every((k, i) => !i || k === keys[i - 1] + 1) && keys.at(-1) === n, `Bildgrenze: ${P.size} Bilder, ${total} Zeichen, ${keys[0]}…${keys.at(-1)}`);
  console.log(`Bilder: höchstens ${PIC_MAX} Zeichen je Bild, ${PIC_BUDGET} für alle – bei ${each} Zeichen bleiben die ${P.size} neuesten`);
}
// voller Speicher: weitere alte Bilder gehen; passt nicht einmal das neue, gibt es keins (gezeichnete Karte)
{
  box.clear();
  quota = Infinity;
  put({ wallet: 5, album: { n: 3, list: [] } });
  for (let i = 1; i <= 3; i++) storePicture(i, pic(i, 20000));
  quota = used() + 5000;
  ok(storePicture(4, pic(4, 20000)) && loadPictures().has(4) && !loadPictures().has(1), `Voller Speicher: Bild 4 ${loadPictures().has(4)}, Bild 1 ${loadPictures().has(1)}`);
  // nicht einmal das neue Bild allein passt: Es gibt keins, und die alten bleiben
  const before = [...loadPictures().keys()].join();
  quota = used() - box.get(PIC_KEY).length + 30000;
  ok(!storePicture(5, pic(5, PIC_MAX)) && !loadPictures().has(5) && [...loadPictures().keys()].join() === before, `Kein Platz: Bild 5 ${loadPictures().has(5)}, vorher ${before}, nachher ${[...loadPictures().keys()]}`);
  ok(JSON.parse(box.get(KEY)).wallet === 5, 'Der volle Speicher hat den Spielstand angefasst');
  // der Spielstand geht vor: passt er nicht mehr, weichen die älteren Bilder
  box.clear();
  quota = Infinity;
  const s = loadSave();
  s.wallet = 77.5;
  ok(storeSave(s), 'Speichern schlägt fehl');
  for (let i = 1; i <= 6; i++) storePicture(i, pic(i, 20000));
  quota = used() + 2;
  s.wallet = 99.25;
  s.visits = { Hanau: 1, Gifhorn: 2, Würzburg: 3, Kassel: 4 };
  ok(storeSave(s) && loadSave().wallet === 99.25 && loadPictures().size < 6 && loadPictures().has(6), `Voller Speicher: Spielstand ${loadSave().wallet}, Bilder ${[...loadPictures().keys()]}`);
  quota = Infinity;
}
// gesperrter Speicher: nichts wirft, kein Bild
{
  locked = true;
  let threw = false;
  try {
    ok(!storePicture(9, pic(9, 1000)) && loadPictures().size === 0, 'Gesperrter Speicher: Bild gespeichert');
  } catch (e) {
    threw = true;
  }
  locked = false;
  ok(!threw, 'Gesperrter Speicher wirft');
}
// Zurücksetzen löscht auch die Bilder
{
  box.clear();
  storePicture(1, pic(1, 500));
  resetSave();
  ok(!box.has(PIC_KEY) && loadPictures().size === 0, 'Zurücksetzen lässt Bilder übrig');
}

// --- Route --------------------------------------------------------------------------------------------------------------------
{
  const R = new RouteLog();
  const A = { kind: 'stadt', place: idx('Erlensee') };
  const B = { kind: 'zub', place: -1 };
  const C = { kind: 'ab' };
  let odo = 0;
  const step = (sec, m) => {
    R.add(sec, m);
    odo += m;
  };
  for (let i = 0; i < 30; i++) step(A, 5);
  step(B, 0);
  for (let i = 0; i < 40; i++) step(B, 12.5);
  const mk = R.mark('laden', { park: 3 });
  for (let i = 0; i < 100; i++) step(C, 19 * 10);
  R.mark('brunnen', { n: 7, place: idx('Hanau') });
  step(C, 0);
  const out = R.finish(odo + 95);
  ok(out.secs.map((c) => c.kind).join() === 'stadt,zub,ab' && out.secs[0].place === idx('Erlensee') && out.secs[2].place === -1, `Abschnitte ${JSON.stringify(out.secs)}`);
  const sum = out.secs.reduce((a, c) => a + c.km, 0);
  ok(Math.abs(sum * 1000 - (odo + 95)) < 1e-6 && Math.abs(out.km * 1000 - (odo + 95)) < 1e-6, `Summe ${sum} km, Zähler ${(odo + 95) / 1000} km`);
  ok(mk.km === 0.65 && out.marks[1].km === 19.65 && out.marks[1].n === 7 && out.marks.length === 2, `Marken ${JSON.stringify(out.marks)}`);
}

console.log(`Album und Route: ${checks} Prüfungen`);
if (fails) {
  console.log(`${fails} Fehler`);
  process.exit(1);
}
console.log('alles in Ordnung');
