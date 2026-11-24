// Prüft ohne Browser das BrunnenTV-Album der Reise und die Route des Abspanns:
// - Album im Spielstand (src/save.js, src/game/album.js): alte Stände ohne Album laden, Folgen zählen über Streams
//   weiter, die Reihenfolge bleibt, das Album übersteht Speichern und Neuladen, kaputte Einträge fallen heraus, die
//   Obergrenze ALBUM_MAX hält, die Zählerei (Folgen, Brunnen, fehlende Brunnen) stimmt.
// - Bilder unter eigenem Schlüssel: Grenze je Bild und für alle zusammen (die ältesten gehen zuerst), voller oder
//   gesperrter Speicher (dann gibt es kein Bild, und das Album zeichnet seine Karte), der Spielstand selbst geht vor.
// - Streitfragen des Wikis, Datum und Uhr wie im HUD.
// - Route (src/game/routelog.js): Abschnitte in der Reihenfolge des Fahrens, Marken mit Zählerstand, Summe gleich
//   Kilometerzähler (die Fahrt im Spiel prüft tools/journey-test.mjs).
// - Karte der Route im Abspann (src/ui/routemap.js): Marken, Namen im Bild und frei von Marken und Auto; echte Fahrten
//   liegen auf gezeichneten Straßen, jeder Ort der Fahrt hat seinen Punkt.
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
  ok(s.wallet === 137.42 && s.best.earned === 96.3 && s.stats.runs === 12 && !('distance' in s.best), `${what}: Guthaben oder Rekorde gingen verloren (oder der klassische Rekord blieb)`);
  const c = albumCounts(albumOf(s));
  ok(c.episodes === 0 && c.fountains === 0 && c.missing === places.length && missingPlaces(s.album).length === places.length, `${what}: Zählung ${JSON.stringify(c)}`);
}
// ein Spielstand, wie ihn die Node-Prüfungen dem Spiel geben (ohne Album): addEpisode legt es an
{
  const s = { upgrades: {}, best: {} };
  const e = addEpisode(s, { place: idx('Würzburg'), t: 0, clock: 18 * 60 + 7, kinds: [] });
  ok(e.n === 1 && s.album.n === 1 && s.album.list.length === 1 && e.p === 'Würzburg' && e.k === goalKind(places[idx('Würzburg')]), `Album ohne Spielstand: ${JSON.stringify(s.album)}`);
}
// eine Folge unterwegs (an einem Brunnen auf dem Weg, nicht am Navi-Ziel) trägt w: 1 – auch nach Speichern und Laden
{
  const s = { ...MAIN };
  const a = addEpisode(s, { place: idx('Hanau'), t: 5, clock: 600, kinds: [], way: true });
  const b = addEpisode(s, { place: idx('Würzburg'), t: 5, clock: 655, kinds: [] });
  box.clear();
  put(s);
  const back = loadSave().album.list;
  ok(a.w === 1 && !('w' in b) && back.length === 2 && back[0].w === 1 && !('w' in back[1]), `Folge unterwegs: ${JSON.stringify(back)}`);
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

// --- Karte der Route im Abspann (src/ui/routemap.js, ohne Leinwand) -------------------------------------------------------
// Marken an ihrer Stelle oder sichtbar daneben, keine zwei übereinander; jeder Name ganz in der Karte (auch in den runden
// Ecken) und frei von Marken, Auto, Ortspunkten und anderen Namen – auf dem Desktop, hochkant und quer auf dem Handy.
{
  const { routeView, routeLabels, routePlan } = await import('../src/ui/routemap.js');
  const { menuLayout, PLACE_BY_INDEX, dotRadius, isCity } = await import('../src/map/mapview.js');
  // Schriftbreite wie in tools/map-test.mjs geschätzt (Node misst keine Schrift)
  const measure = (text, font, spacing = 0) => text.length * (parseFloat(/(\d+)px/.exec(font)[1]) * 0.6 + spacing);
  const at = (key) => PLACE_BY_INDEX[idx(key)];
  // Weg von Ort zu Ort (gerade Stücke, 120 Punkte je Stück); null: Sprung übers Wasser
  const line = (...keys) => {
    const L = [];
    for (let j = 0; j + 1 < keys.length; j++) {
      if (!keys[j] || !keys[j + 1]) {
        L.push(NaN, NaN);
        continue;
      }
      const [a, b] = [at(keys[j]), at(keys[j + 1])];
      for (let i = 0; i <= 120; i++) L.push(a.x + ((b.x - a.x) * i) / 120, a.y + ((b.y - a.y) * i) / 120);
    }
    return L;
  };
  const mark = (type, key, n) => ({ type, ...(n ? { n } : { park: 1 }), x: at(key).x + 0.0004, y: at(key).y - 0.0003 });
  const ROUTES = {
    lang: { line: line('Erlensee', 'Hanau', 'Würzburg', 'Nürnberg', 'Erlangen'), marks: [mark('brunnen', 'Hanau', 8), mark('laden', 'Würzburg'), mark('brunnen', 'Nürnberg', 9), mark('brunnen', 'Erlangen', 10)] },
    kurz: { line: line('Erlensee', 'Hanau'), marks: [mark('brunnen', 'Hanau', 8)] },
    rund: { line: line('Erlensee', 'Hanau', 'Erlensee'), marks: [mark('brunnen', 'Hanau', 8), mark('laden', 'Erlensee')] },
    ausland: { line: line('Erlensee', 'Hamburg', null, 'Danzig'), marks: [mark('brunnen', 'Hamburg', 102), mark('brunnen', 'Danzig', 1003)] },
    ffm: { line: line('Erlensee', 'Frankfurt am Main', 'Mainz', 'Wiesbaden'), marks: [mark('brunnen', 'Frankfurt am Main', 1), mark('brunnen', 'Mainz', 2), mark('laden', 'Wiesbaden')] },
    sued: { line: line('Erlensee', 'Frankfurt am Main', 'Karlsruhe', 'Stuttgart', 'München'), marks: [mark('brunnen', 'Frankfurt am Main', 1), mark('brunnen', 'Stuttgart', 2), mark('laden', 'Karlsruhe'), mark('brunnen', 'München', 3)] },
  };
  // Kartengrößen wie im Abspann gemessen: 1280×720, 1600×900, Handy hochkant 390×844 und quer 844×390
  const SIZES = [[730, 290], [1018, 290], [332, 230], [530, 290]];
  const hit = (a, b) => a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];
  let names = 0;
  for (const [what, route] of Object.entries(ROUTES)) {
    for (const [w, h] of SIZES) {
      const tag = `Routenkarte ${what} ${w}×${h}`;
      // wie drawRouteMap: routePlan wählt die Richtung, in die verschobene Marken ausweichen
      const P = routePlan(route, w, h, (b) => menuLayout(b, measure));
      const v = P.v;
      const layout = menuLayout(v.b, measure);
      const plan = P.names;
      names += plan.size;
      // Großstädte im Bild behalten ihren Namen (Frankfurt am Main lag unter Hanaus verschobener Marke); nur auf der
      // kleinsten Karte (Handy hochkant) darf in dichten Gegenden einer fehlen
      const cities = layout.labels.filter((l) => l.kind === 'place' && isCity(PLACE_BY_INDEX[l.i]) && v.X(l.x) > 0 && v.Y(l.y) > 0 && v.X(l.x) < w && v.Y(l.y) < h);
      const unnamed = cities.filter((l) => !plan.has(l)).map((l) => l.text);
      ok(unnamed.length === P.lost, `${tag}: routePlan zählt ${P.lost} Großstädte ohne Namen, es sind ${unnamed.length}`);
      if (w > 332) ok(!unnamed.length, `${tag}: ${unnamed.join(', ')} ohne Namen`);
      if (what === 'lang' && w > 332) ok(cities.some((l) => l.text === 'Frankfurt am Main') && plan.size > routeLabels(routeView(route, w, h), layout).size - 3, `${tag}: Frankfurt am Main nicht im Bild`);
      ok(P.lost <= cities.filter((l) => !routeLabels(routeView(route, w, h), layout).has(l)).length, `${tag}: routePlan lässt mehr Großstädte ohne Namen als die erste Richtung`);
      ok(plan.size > 0, `${tag}: keine Namen`);
      const start = v.items.find((it) => it.type === 'start');
      ok(start && Math.abs(start.x0 - v.X(route.line[0])) < 1e-9 && Math.abs(start.y0 - v.Y(route.line[1])) < 1e-9, `${tag}: Start nicht am Anfang des Wegs`);
      const want = route.marks.map((m) => (m.type === 'laden' ? 'laden' : m.n)).sort().join();
      ok(v.items.filter((it) => it.type !== 'start').map((it) => (it.type === 'laden' ? 'laden' : it.n)).sort().join() === want, `${tag}: Marken fehlen`);
      const marks = v.items.map((it) => [it.x - it.r, it.y - it.r, it.x + it.r, it.y + it.r]);
      if (v.car) marks.push([v.car.x - 12, v.car.y - 12, v.car.x + 12, v.car.y + 12]);
      for (const it of v.items) ok(it.x - it.r >= 0 && it.y - it.r >= 0 && it.x + it.r <= w && it.y + it.r <= h, `${tag}: Marke ${it.type} ${it.n ?? ''} ragt aus der Karte`);
      for (let i = 0; i < v.items.length; i++) {
        for (let j = i + 1; j < v.items.length; j++) ok(Math.hypot(v.items[i].x - v.items[j].x, v.items[i].y - v.items[j].y) >= 21, `${tag}: Marken ${v.items[i].type} und ${v.items[j].type} decken sich`);
      }
      const dots = [...layout.shown].map((i) => [i, v.X(PLACE_BY_INDEX[i].x), v.Y(PLACE_BY_INDEX[i].y), dotRadius(PLACE_BY_INDEX[i], v.s)]);
      const boxes = [];
      for (const [l, [x0, y0]] of plan) {
        const B = [x0, y0, x0 + l.w, y0 + l.h];
        const inCorner = [[B[0], B[1]], [B[2], B[1]], [B[0], B[3]], [B[2], B[3]]].every(([px, py]) => Math.hypot(px - Math.min(Math.max(px, 14), w - 14), py - Math.min(Math.max(py, 14), h - 14)) <= 11 + 1e-9);
        ok(B[0] >= 3 && B[1] >= 3 && B[2] <= w - 3 && B[3] <= h - 3 && inCorner, `${tag}: „${l.text}“ ragt über den Rand`);
        ok(!marks.some((m) => hit(B, m)), `${tag}: „${l.text}“ liegt unter einer Marke oder dem Auto`);
        ok(!boxes.some((q) => hit(B, q)), `${tag}: „${l.text}“ deckt einen anderen Namen`);
        ok(!dots.some(([i, x, y, r]) => i !== l.i && hit(B, [x - r, y - r, x + r, y + r])), `${tag}: „${l.text}“ deckt einen Ortspunkt`);
        boxes.push(B);
      }
    }
  }
  ok(names > 100, `Routenkarten mit zusammen nur ${names} Namen`);
}

// --- Route des Tages auf den Straßen der Karte (routemap.js routeKeep, mapview.js roadsShown) ------------------------------
// Echte Fahrten (Trip, Navi und RouteLog wie im Spiel, auch über Landstraßen): Jeder Punkt des gefahrenen Wegs liegt auf
// einer Straße, die die Routenkarte zeichnet (höchstens 5 Bildpunkte daneben: Die Route, 7 Bildpunkte breit, deckt die Straße noch; im Ort zählt seine Fläche), und jeder Ort,
// durch den der Wagen fuhr, hat Punkt und Namen (Michaels Testlauf endete in Hammersbach ohne beides; über Landstraßen lief
// der Weg in der Deutschlandansicht neben jeder gezeichneten Straße).
{
  const { routePlan, routeKeep } = await import('../src/ui/routemap.js');
  const { menuLayout, roadsShown, pxPerKm, netData, townKm, kmPerUnit, PLACE_BY_INDEX } = await import('../src/map/mapview.js');
  const { Trip, J } = await import('../src/game/trip.js');
  const { NavModel } = await import('../src/map/navroute.js');
  const { findPlace } = await import('../src/map/graph.js');
  const measure = (text, font, spacing = 0) => text.length * (parseFloat(/(\d+)px/.exec(font)[1]) * 0.6 + spacing);
  const FPS = 10;
  const drive = (...targets) => {
    let seed = 3;
    const trip = new Trip({ rng: () => ((seed = (seed * 16807) % 2147483647) / 2147483647) });
    const nav = new NavModel(trip);
    const log = new RouteLog();
    let ti = 0;
    trip.setTarget(findPlace(targets[0]));
    let x = J.L0;
    for (let f = 0; f < FPS * 3600 * 3; f++) {
      const sec = trip.section;
      const s = trip.s + (sec.kind === 'stadt' ? 13 : sec.kind === 'ab' ? 36 : 24) / FPS;
      if (sec.kind === 'ab') {
        const fk = sec.fork;
        if (fk && !fk.taken && fk.s - s < J.decel - 20) x = trip.planFor(fk) === 'exit' ? J.L0 : 5.625;
        else if (s - sec.s0 > J.accel) x = 5.625;
      } else x = J.L0;
      const p = trip.profile(s);
      const ev = trip.update(s, Math.min(Math.max(x, p.xmin), p.xmax)) || [];
      nav.update(1 / FPS);
      log.add(trip.section, 1);
      if (ev.some((e) => e.type === 'arrive') && ++ti < targets.length) trip.setTarget(findPlace(targets[ti]));
      if (ti >= targets.length) break;
    }
    ok(ti === targets.length, `Fahrt ${targets.join(', ')}: nur ${ti} Ziele erreicht`);
    return { line: nav.trail.slice(), marks: [], secs: log.finish(log.m).secs };
  };
  const N = netData();
  // Abstand (Karteneinheiten) eines Punkts zur nächsten Strecke der Linienzüge
  const near = (P, px, py) => {
    let d = Infinity;
    for (let i = 0; i + 3 < P.length; i += 2) {
      const [ax, ay, dx, dy] = [P[i], P[i + 1], P[i + 2] - P[i], P[i + 3] - P[i + 1]];
      const L = dx * dx + dy * dy;
      const t = L ? Math.min(1, Math.max(0, ((px - ax) * dx + (py - ay) * dy) / L)) : 0;
      d = Math.min(d, Math.hypot(ax + t * dx - px, ay + t * dy - py));
    }
    return d;
  };
  const DRIVES = { hammersbach: ['Aschaffenburg', 'Friedrichsdorf', 'Hammersbach'], landstrassen: ['Marburg', 'Hameln', 'Celle', 'Lörrach'] };
  for (const [what, targets] of Object.entries(DRIVES)) {
    const route = drive(...targets);
    const keep = routeKeep(route);
    for (const t of ['Erlensee', ...targets]) ok(keep.places.has(findPlace(t)), `Route ${what}: ${t} fehlt unter den Orten der Fahrt`);
    if (what === 'landstrassen') ok(keep.edges.size >= 3, `Route ${what}: nur ${keep.edges.size} Landstraßen gefahren`);
    for (const [w, h] of [[730, 290], [332, 230]]) {
      const tag = `Route ${what} ${w}×${h}`;
      const P = routePlan(route, w, h, (b) => menuLayout(b, measure), measure);
      const v = P.v;
      // wie renderStatic: Straßen der Stufe samt keep, Punkte der Stufe samt keep
      const R = roadsShown(pxPerKm(v.s, v.wy + h / v.s / 2), menuLayout(v.b, measure).shown, P.keep);
      const lines = [...N.lines.filter((l) => l.kind === 'ab' || (l.kind === 'land' && R.land && R.land({ edge: l.i }))).map((l) => l.pts), ...N.feeders.filter((f) => R.zub && R.zub(f)).map((f) => f.pts)];
      const towns = [...P.keep.places].map((i) => PLACE_BY_INDEX[i]);
      let off = 0;
      let worst = '';
      const L = route.line;
      for (let i = 0; i < L.length; i += 2) {
        if (!Number.isFinite(L[i])) continue;
        const [px, py] = [L[i], L[i + 1]];
        if (towns.some((p) => Math.hypot(p.x - px, p.y - py) * kmPerUnit(py) < townKm(p.pop) * 1.2 + 0.3)) continue;
        const d = Math.min(...lines.map((Q) => near(Q, px, py))) * v.s;
        if (d > 5) {
          off++;
          worst = `${d.toFixed(1)} Bildpunkte bei Punkt ${i / 2}`;
        }
      }
      ok(!off, `${tag}: ${off} Punkte des Wegs neben den gezeichneten Straßen (${worst})`);
      for (const p of towns) {
        const inside = v.X(p.x) > 0 && v.Y(p.y) > 0 && v.X(p.x) < w && v.Y(p.y) < h;
        ok(!inside || P.layout.shown.has(p.i), `${tag}: ${p.name} ohne Punkt`);
      }
      const named = new Set([...P.names.keys()].filter((l) => l.kind === 'place').map((l) => l.i));
      const end = towns.find((p) => p.name === targets[targets.length - 1]);
      if (w > 332) ok(named.has(end.i), `${tag}: ${end.name} (Ende der Fahrt) ohne Namen`);
    }
  }
}

// --- Gezeichnete Karte einer Folge ohne Standbild (src/ui/fountaincard.js) und Name ihres Brunnens ---------------------
// Jede Hauptbrunnen-Art hat ihre eigene Gestalt; zwei Karten gleichen sich nur bei gleicher Art, gleichem Ort und
// gleicher Nummer; auf der Karte stehen der Ort (notfalls gekürzt) und die Nummer. Der Name einer Folge ist der ihres
// Brunnens („Gänselieselbrunnen“), solange der Ort ihn noch hat.
{
  const { drawFountainCard, cardShape, CARD } = await import('../src/ui/fountaincard.js');
  const L = await import('../src/world/kit/layout.js');
  const { episodeTitle } = await import('../src/game/album.js');
  const record = () => {
    const log = [];
    const ctx = new Proxy({ font: '10px x' }, {
      get: (t, k) => {
        if (k in t) return t[k];
        if (k === 'measureText') return (x) => ({ width: String(x).length * parseFloat(/([\d.]+)px/.exec(t.font)[1]) * 0.6 });
        if (k === 'createLinearGradient') return (...a) => ({ addColorStop: (o, c) => log.push('stop ' + o + ' ' + c) });
        return (...a) => void log.push(String(k) + ' ' + a.map((v) => (typeof v === 'number' ? v.toFixed(1) : String(v))).join(' '));
      },
      set: (t, k, v) => {
        t[k] = v;
        log.push(String(k) + '=' + v);
        return true;
      },
    });
    const canvas = { width: 0, height: 0, getContext: () => ctx };
    return { canvas, log };
  };
  const card = (o) => {
    const r = record();
    drawFountainCard(r.canvas, o);
    ok(r.canvas.width === CARD.w && r.canvas.height === CARD.h, 'Karte: Größe');
    return r.log;
  };
  const goalKinds = Object.keys(L.FOUNTAIN_R);
  const shapes = new Set(goalKinds.map((k) => cardShape(k)));
  ok(shapes.size === goalKinds.length, `Karte: ${goalKinds.length} Hauptbrunnen-Arten, aber nur ${shapes.size} Gestalten`);
  const seenCards = new Set();
  for (const k of goalKinds) {
    const log = card({ kind: k, place: 'Würzburg', n: 7 });
    const text = log.filter((x) => x.startsWith('fillText '));
    ok(text.some((x) => x.startsWith('fillText Würzburg')) && text.some((x) => x.startsWith('fillText #7')), `Karte ${k}: Ort oder Nummer fehlt`);
    seenCards.add(log.join('|'));
  }
  ok(seenCards.size === goalKinds.length, 'Karte: zwei Arten zeichnen dasselbe Bild');
  const a = card({ kind: 'fountainGoose', place: 'Göttingen', n: 1 }).join('|');
  ok(a !== card({ kind: 'fountainGoose', place: 'Hanau', n: 1 }).join('|') && a === card({ kind: 'fountainGoose', place: 'Göttingen', n: 1 }).join('|'), 'Karte: derselbe Brunnen in zwei Orten sieht gleich aus (oder dieselbe Karte zweimal anders)');
  const long = card({ kind: 'fountainLion', place: 'Krausnick (Tropical Islands) an der langen Straße', n: 12 }).filter((x) => x.startsWith('fillText '));
  ok(long.some((x) => x.startsWith('fillText Krausnick') && x.includes('…')), 'Karte: ein langer Ortsname wird nicht gekürzt');
  // Name der Folge: der Brunnen des Orts, für alte Folgen einer anderen Art der Name der Art
  const pl = places.find((p) => p.name === 'Würzburg');
  ok(episodeTitle({ p: pl.key, k: L.goalKind(pl) }) === L.fountainName(pl) && episodeTitle({ p: pl.key, k: 'fountainGrand' === L.goalKind(pl) ? 'fountainTrough' : 'fountainGrand' }) !== L.fountainName(pl), 'Name der Folge: nicht der Brunnen des Orts');
}

console.log(`Album und Route: ${checks} Prüfungen`);
// --- Das Album zeichnet die Karten erst, wenn sie ins Bild kommen (bis zu 1.000 Folgen) ------------------------------
{
  let canvases = 0;
  const ctx = new Proxy({}, { get: (t, k) => (k in t ? t[k] : k === 'measureText' ? () => ({ width: 10 }) : k === 'createLinearGradient' ? () => ({ addColorStop() {} }) : () => {}), set: (t, k, v) => ((t[k] = v), true) });
  const node = (tag) => {
    const e = { tag, children: [], dataset: {}, style: {}, setAttribute() {}, appendChild: (c) => (e.children.push(c), c), append: (...c) => e.children.push(...c) };
    if (tag === 'canvas') {
      canvases++;
      Object.assign(e, { width: 0, height: 0, getContext: () => ctx });
    }
    return e;
  };
  let watch = null;
  const doc0 = globalThis.document;
  const io0 = globalThis.IntersectionObserver;
  globalThis.document = { createElement: node };
  globalThis.IntersectionObserver = class {
    constructor(cb) {
      this.cb = cb;
      this.on = new Set();
      watch = this;
    }
    observe(t) {
      this.on.add(t);
    }
    unobserve(t) {
      this.on.delete(t);
    }
    disconnect() {
      this.on.clear();
    }
  };
  const { episodeList } = await import('../src/ui/album.js');
  const big = { list: Array.from({ length: ALBUM_MAX }, (_, i) => ({ n: i + 1, p: 'Hanau', k: 'fountainMarket', t: T1, u: 1100 })) };
  const card = node('div');
  episodeList(card, big, new Map([[ALBUM_MAX, pic(1, 200)]]));
  ok(canvases === 0 && watch && watch.on.size === ALBUM_MAX - 1, `Album: ${canvases} Karten beim Öffnen gezeichnet (${watch ? watch.on.size : 0} warten)`);
  const first = [...watch.on].slice(0, 6);
  watch.cb(first.map((target, i) => ({ target, isIntersecting: i < 5 })));
  ok(canvases === 5 && watch.on.size === ALBUM_MAX - 6 && first.slice(0, 5).every((f) => f.children.length === 1 && f.children[0].width === 288), `Album: im Bild ${canvases} Karten gezeichnet`);
  watch.cb(first.slice(0, 5).map((target) => ({ target, isIntersecting: true })));
  ok(canvases === 5, 'Album: eine Karte doppelt gezeichnet');
  // ein neues Öffnen (oder Reiterwechsel) vergisst die alte Liste
  episodeList(node('div'), { list: big.list.slice(0, 3) }, new Map());
  ok(watch.on.size === 3, `Album: der Beobachter hält noch ${watch.on.size - 3} Plätze der alten Liste`);
  globalThis.document = doc0;
  globalThis.IntersectionObserver = io0;
  console.log(`  Album mit ${ALBUM_MAX} Folgen: beim Öffnen keine Karte gezeichnet, im Bild 5 von 5`);
}

if (fails) {
  console.log(`${fails} Fehler`);
  process.exit(1);
}
console.log('alles in Ordnung');
