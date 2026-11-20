// Prüft den Radarwarner ohne Grafik: das echte Spiel (Game) mit Mitspielern, die mitschreiben; die Fahrt steht dabei
// am Start (die Blitzer stellt das Spiel an die Stelle p.s der Straße).
// Die Regel: Einen Blitzer kündigt niemand an – außer dem Radarwarner aus dem Shop. Blitz, Bußgeld, Foto,
// Statistik und Stream-Kasse sind mit ihm und ohne ihn dieselben.
// node tools/radar-test.mjs
// - Ohne Radarwarner, zu schnell: Bis zum Blitzer fällt nirgends ein Wort über ihn (Sprache, Untertitel, Hinweise,
//   Chat, Navi), kein Piepen, kein Lämpchen – und dann blitzt es wie immer: Foto, 15 € Bußgeld, Statistik, Chat.
// - Ohne Radarwarner, brav: keine Ansage; „Nicht geblitzt“ zählt und wird gelobt.
// - Mit Radarwarner: genau eine Ansage je Blitzer, vor dem Tempo-120-Schild – erst piept das Kästchen, dann kommen
//   NOMIs Gong und ihr Satz; das Lämpchen blinkt vom Piepen bis zum Blitzer; wer zu schnell ist, wird trotzdem
//   geblitzt. Zwei Blitzer: zwei Ansagen.
// - Nach einem Blitz stichelt der Chat in etwa jedem zweiten Stream: ohne Radarwarner mit einem Wink zum Shop, mit
//   ihm erst recht – höchstens eine Zeile je Blitz, nie vor dem Foto, nie nach einer braven Vorbeifahrt.
// - Derselbe Stream mit und ohne Radarwarner: Kasse, Abrechnung und Statistik stimmen auf den Cent überein.
// - Der Artikel: steht im Shop, hat eine Stufe, übersteht Speichern und Laden; alte Spielstände laden unverändert.
import { Game } from '../src/game/game.js';
import { Trip } from '../src/game/trip.js';
import { BOARD, CHAT, SHOP, UPGRADE_LIMITS } from '../src/data.js';
import { loadSave, storeSave } from '../src/save.js';

const DT = 1 / 30;
// so viele Meter vor dem Tempo-120-Schild schlägt der Radarwarner an (wie NOMIs Hinweis bisher)
const AHEAD = 180;
let fails = 0;
let checks = 0;
function ok(cond, msg) {
  checks++;
  if (cond) return;
  fails++;
  console.error('FEHLER: ' + msg);
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// Zufall mit festem Startwert, damit jeder Lauf denselben Stream fährt
function mulberry32(a) {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- Mitspieler, die es ohne Grafik nicht gibt: nehmen alles an und schreiben mit ------------------------------------
const NONE = [];
/**
 * Ein Mitspieler namens who: Was das Spiel ihm sagt, landet in log ({ who, call, args, s, t }: Stelle der Straße und
 * Spielzeit des Aufrufs). base: Eigenschaften und Antworten, die das Spiel von ihm braucht.
 */
function witness(who, log, now, base = {}) {
  const note = (call, args) => log.push({ who, call, args, ...now() });
  const answers = {};
  for (const [k, v] of Object.entries(base)) {
    answers[k] = typeof v === 'function' ? (...args) => (note(k, args), v(...args)) : v;
  }
  return new Proxy(answers, {
    get: (t, k) => {
      if (k in t || typeof k !== 'string') return t[k];
      return (...args) => note(k, args);
    },
  });
}

/** Alles, was in einem Aufruf an Text steckt (auch in Objekten wie der Chat-Zeile), als eine Zeile. */
const textOf = (e) => JSON.stringify(e.args) || '';
// Wörter, an denen eine Vorwarnung zu erkennen wäre
const WARNING = /blitz|radar|tempolimit/i;
// Keine Vorwarnung ist der Job des Abends „An einem Blitzer vorbei, ohne geblitzt zu werden“: Die Job-Liste nennt ihn,
// und wer dafür eine Spende versprochen hat, schreibt es kurz nach dem Start in den Chat – wo auch immer ein Blitzer steht
const JOB_CALLS = new Set(['jobs', 'jobDone']);
const jobTalk = (game, e) => JOB_CALLS.has(e.call) || (e.call === 'chat' && game.jobs.some((j) => e.args[0].name === j.pledger && e.args[0].text.includes(j.wenn)));

/**
 * Ein Stream bis hinter die Tempo-120-Zone des letzten Blitzers.
 * radar: Stufe des Artikels im Spielstand · kmh: so schnell fährt der Wagen die ganze Zeit · cameras: so viele Blitzer.
 * Liefert das Spiel, das Protokoll, die Zonen ({ limitS, camS, endS, bornS }) und wann das Lämpchen an war.
 */
function stream({ radar = 0, kmh, cameras = 1, seed = 7 }) {
  Math.random = mulberry32(seed);
  const log = [];
  let game = null;
  const now = () => ({ s: game ? game.player.s : 0, t: game ? game.t : 0 });
  let ids = 0;
  const trip = new Trip({ rng: Math.random });
  game = new Game({
    traffic: witness('traffic', log, now, { cars: NONE, update: () => NONE, nearby: () => NONE, police: () => null, megafon: () => 0 }),
    scenery: witness('scenery', log, now, { request: () => ++ids, landmarkSpot: (s) => s, placed: () => null }),
    road: witness('road', log, now),
    sky: witness('sky', log, now),
    rain: witness('rain', log, now),
    windshield: witness('windshield', log, now, { firmware: 0, manual: () => 'wipe' }),
    cockpit: witness('cockpit', log, now, { nomi: witness('nomi', log, now) }),
    audio: witness('audio', log, now),
    speech: witness('speech', log, now, { say: () => 2.5, busy: false, queue: NONE, current: null }),
    ui: witness('ui', log, now),
    fx: witness('fx', log, now),
    pickups: witness('pickups', log, now, { update: () => NONE }),
    world: { trip: () => trip, stopping: () => false, release: () => {}, square: () => null, town: () => null },
  });
  game.start({ upgrades: radar ? { radar } : {}, best: {} });
  // die Stimmung der Stream-Kasse mitschreiben (cheer), ohne sie zu ändern
  const cheer = game.eco.cheer.bind(game.eco);
  game.eco.cheer = (key, ...rest) => {
    log.push({ who: 'eco', call: 'cheer', args: [key], ...now() });
    return cheer(key, ...rest);
  };
  const p = game.player;
  const ctl = { steer: 0, throttle: 0, brake: 0, kappa: 0, grade: 0, horn: false, wiper: false, megafon: false };
  const zones = [];
  const lamp = [];
  let zone = null;
  let lit = false;
  let limitShown = 0;
  // genug Geld in der Kasse, damit das Bußgeld ganz abgebucht werden kann
  game.money = 100;
  for (let i = 0; i < 40000 && zones.length <= cameras; i++) {
    // der nächste Blitzer kommt gleich (sonst erst nach drei Kilometern)
    if (!game.blitzer && !zone && zones.length < cameras) game.S.blitzer = Math.min(game.S.blitzer, p.s + 50);
    p.speed = kmh / 3.6;
    p.battery = 100;
    game.update(DT, ctl, null);
    if (game.over) break;
    const b = game.blitzer;
    if (b && !zone) {
      zone = { limitS: b.limitS, camS: b.camS, endS: b.endS, bornS: p.s };
      zones.push(zone);
    }
    if (!b && zone) {
      zone = null;
      if (zones.length === cameras) break;
    }
    // die 120 auf dem Bildschirm des Autos: zwischen den beiden Schildern, mit und ohne Radarwarner
    if (b && p.s > b.limitS && p.s < b.endS && game.screenState().limit === 120) limitShown++;
    if (!!game.radarAlarm !== lit) {
      lit = !lit;
      if (lit) lamp.push({ on: p.s, off: null });
      else lamp[lamp.length - 1].off = p.s;
    }
  }
  return { game, log, zones, lamp, limitShown, step: (kmh / 3.6) * DT };
}

const calls = (r, who, call) => r.log.filter((e) => e.who === who && e.call === call);
const spoken = (r) => calls(r, 'speech', 'say').filter((e) => e.args[0] === BOARD.blitzer);
const subtitled = (r) => calls(r, 'ui', 'nomi').filter((e) => e.args[0] === BOARD.blitzer);
const flashes = (r) => calls(r, 'fx', 'flash').length;

/** Der Blitzer steht in der Welt, mit seinen beiden Schildern – mit und ohne Radarwarner. */
function world(r, what) {
  ok(r.game.over === null, `${what}: Der Stream endet von selbst`);
  for (const z of r.zones) {
    const req = calls(r, 'scenery', 'request').filter((e) => e.s === z.bornS);
    ok(req.some((e) => e.args[0] === 'speed' && e.args[1] === z.limitS && e.args[2].limit === 120), `${what}: kein Tempo-120-Schild bei ${z.limitS}`);
    ok(req.some((e) => e.args[0] === 'blitzer' && e.args[1] === z.camS), `${what}: kein Blitzer bei ${z.camS}`);
    ok(req.some((e) => e.args[0] === 'speed' && e.args[1] === z.endS && e.args[2].limit === 'ende'), `${what}: kein Ende-Schild bei ${z.endS}`);
    ok(z.limitS - z.bornS === 520 && z.camS - z.bornS === 1120 && z.endS - z.bornS === 1300, `${what}: Die Zone hat andere Maße`);
  }
  ok(r.limitShown > 0, `${what}: Der Bildschirm des Autos zeigt in der Zone keine 120`);
}

/** Niemand kündigt den Blitzer an: kein Wort, kein Ton, kein Lämpchen – bis er hinter dem Wagen liegt. */
function unannounced(r, what) {
  ok(spoken(r).length === 0 && subtitled(r).length === 0, `${what}: NOMI sagt den Blitzer an`);
  ok(calls(r, 'audio', 'radar').length === 0, `${what}: Es piept`);
  ok(r.lamp.length === 0, `${what}: Das Lämpchen geht an`);
  for (const z of r.zones) {
    for (const e of r.log) {
      if (e.s < z.bornS || e.s >= z.camS || jobTalk(r.game, e)) continue;
      if (e.who !== 'ui' && e.who !== 'speech' && e.who !== 'audio' && e.who !== 'cockpit' && e.who !== 'nomi') continue;
      ok(!WARNING.test(e.call) && !WARNING.test(textOf(e)), `${what}: Vorwarnung ${e.who}.${e.call}(${textOf(e)}) ${(z.camS - e.s).toFixed(0)} m vor dem Blitzer`);
    }
  }
}

/** Geblitzt wie immer: Blitz, Foto, 15 € Bußgeld, Statistik, drei Chat-Zeilen, die Kasse freut sich über das Foto. */
function flashed(r, what, kmh) {
  const g = r.game;
  const n = r.zones.length;
  ok(flashes(r) === n && calls(r, 'audio', 'flash').length === n, `${what}: ${flashes(r)} Blitze statt ${n}`);
  ok(calls(r, 'scenery', 'flashBlitzer').length === 2 * n, `${what}: Der Blitzer am Straßenrand leuchtet nicht auf und wieder ab`);
  ok(g.stats.photos === n && g.stats.blitzerClean === 0, `${what}: Statistik ${g.stats.photos} Fotos, ${g.stats.blitzerClean}-mal brav`);
  ok(g.stats.fines === 15 * n && g.breakdown['Bußgeld'] === -15 * n, `${what}: Bußgeld ${g.stats.fines} € statt ${15 * n} €`);
  const fines = calls(r, 'ui', 'money').filter((e) => e.args[1] === 'Bußgeld');
  ok(fines.length === n && fines.every((e) => e.args[0] === -15), `${what}: Das Bußgeld wird nicht je Blitz einmal mit −15 € gezeigt`);
  const photos = calls(r, 'ui', 'photo');
  ok(photos.length === n && photos.every((e) => Math.abs(e.args[0] - kmh) <= 2 && /^\d\d:\d\d$/.test(e.args[1])), `${what}: Foto fehlt oder trägt falsche Daten (${textOf(photos[0] || { args: [] })})`);
  ok(calls(r, 'eco', 'cheer').filter((e) => e.args[0] === 'blitzerFlash').length === n, `${what}: Der Chat freut sich nicht über das Foto`);
  r.zones.forEach((z, i) => {
    const flash = calls(r, 'fx', 'flash')[i];
    ok(flash && flash.s > z.camS && flash.s <= z.camS + r.step + 1e-6, `${what}: Es blitzt nicht am Blitzer`);
    const lines = calls(r, 'ui', 'chat').filter((e) => e.s > z.camS && e.s < z.endS && CHAT.blitzer.includes(e.args[0].text));
    ok(lines.length === 3, `${what}: ${lines.length} Chat-Zeilen zum Foto statt 3`);
  });
  ok(calls(r, 'ui', 'toast').every((e) => !/Nicht geblitzt/.test(e.args[0])), `${what}: Lob trotz Blitz`);
}

/** Brav vorbei: kein Blitz, kein Bußgeld, dafür zählt es und wird gelobt. */
function clean(r, what) {
  const g = r.game;
  const n = r.zones.length;
  ok(flashes(r) === 0 && calls(r, 'ui', 'photo').length === 0 && g.stats.photos === 0, `${what}: geblitzt`);
  ok(g.stats.fines === 0 && !('Bußgeld' in g.breakdown), `${what}: Bußgeld ohne Blitz`);
  ok(g.stats.blitzerClean === n, `${what}: ${g.stats.blitzerClean}-mal brav gezählt statt ${n}-mal`);
  const praise = calls(r, 'ui', 'toast').filter((e) => e.args[0] === '📸 Nicht geblitzt – vorbildlich!' && e.args[1] === 'good');
  ok(praise.length === n, `${what}: Das Lob kommt ${praise.length}-mal statt ${n}-mal`);
  r.zones.forEach((z, i) => ok(praise[i] && praise[i].s > z.camS && praise[i].s <= z.camS + r.step + 1e-6, `${what}: Das Lob kommt nicht am Blitzer`));
}

/**
 * Der Radarwarner sagt jeden Blitzer genau einmal an, vor dem Schild: Das Kästchen piept, dann kommen NOMIs Gong und
 * ihr Satz; sein Lämpchen blinkt vom Piepen bis zum Blitzer.
 */
function announced(r, what) {
  const n = r.zones.length;
  const said = spoken(r);
  const subs = subtitled(r);
  const beeps = calls(r, 'audio', 'radar');
  const gongs = calls(r, 'audio', 'nomiChime');
  ok(said.length === n && subs.length === n, `${what}: ${said.length} Ansagen, ${subs.length} Untertitel statt je ${n}`);
  ok(beeps.length === n, `${what}: Es piept ${beeps.length}-mal statt ${n}-mal`);
  ok(r.lamp.length === n, `${what}: Das Lämpchen war ${r.lamp.length}-mal an statt ${n}-mal`);
  r.zones.forEach((z, i) => {
    const from = z.limitS - AHEAD;
    const e = said[i];
    ok(e && e.args[1] === 'board' && e.s > from && e.s < z.limitS, `${what}: Ansage ${i + 1} nicht zwischen ${from} und dem Schild bei ${z.limitS} (${e ? e.s.toFixed(1) : 'fehlt'})`);
    const beep = beeps[i];
    ok(beep && beep.s > from && beep.s <= from + r.step + 1e-6, `${what}: Das Piepen kommt nicht ${AHEAD} m vor dem Schild (${beep ? beep.s.toFixed(1) : 'fehlt'} statt ${from})`);
    // die Reihenfolge fürs Ohr: Piepen, dann NOMIs Gong, dann ihr Satz – alles binnen gut einer Sekunde
    const gong = beep && e && gongs.find((x) => x.t > beep.t && x.t < e.t);
    ok(!!gong && gong.t - beep.t >= 0.4 && e.t - beep.t < 1.2, `${what}: Piepen, Gong und Satz kommen nicht in dieser Reihenfolge`);
    const l = r.lamp[i];
    ok(l && beep && l.on === beep.s, `${what}: Das Lämpchen geht nicht mit dem Piepen an (${l ? l.on.toFixed(1) : 'nie'} statt ${from})`);
    ok(l && l.off !== null && l.off > z.camS && l.off <= z.camS + r.step + 1e-6, `${what}: Das Lämpchen geht nicht am Blitzer aus (${l ? l.off : 'nie'})`);
  });
}

// --- 1. Ohne Radarwarner, mit 150 am Blitzer vorbei ---------------------------------------------------------------------
const fastPlain = stream({ kmh: 150 });
world(fastPlain, 'ohne, 150');
unannounced(fastPlain, 'ohne, 150');
flashed(fastPlain, 'ohne, 150', 150);

// --- 2. Ohne Radarwarner, mit 110 -----------------------------------------------------------------------------------------
const slowPlain = stream({ kmh: 110 });
world(slowPlain, 'ohne, 110');
unannounced(slowPlain, 'ohne, 110');
clean(slowPlain, 'ohne, 110');

// --- 3. Mit Radarwarner ---------------------------------------------------------------------------------------------------
const fastRadar = stream({ radar: 1, kmh: 150 });
world(fastRadar, 'mit, 150');
announced(fastRadar, 'mit, 150');
flashed(fastRadar, 'mit, 150', 150);
const slowRadar = stream({ radar: 1, kmh: 110 });
world(slowRadar, 'mit, 110');
announced(slowRadar, 'mit, 110');
clean(slowRadar, 'mit, 110');
// Die Grenze bleibt, wo sie war: 126 km/h gehen durch, darüber blitzt es
ok(flashes(stream({ radar: 1, kmh: 125 })) === 0 && flashes(stream({ kmh: 125 })) === 0, 'Mit 125 km/h wird geblitzt');
ok(flashes(stream({ radar: 1, kmh: 128 })) === 1 && flashes(stream({ kmh: 128 })) === 1, 'Mit 128 km/h wird nicht geblitzt');

// --- 4. Zwei Blitzer in einem Stream ----------------------------------------------------------------------------------------
// (Startwert 10: Wann das Sprachstudio spricht, hängt an NOMIs Sätzen – auch an der Warnung des Radarwarners. Fällt
// ein Satz des Studios genau in die Warnung, würfelt es später und der Zufall läuft auseinander; wer an Stimmung oder
// Ansagen dreht, sucht hier notfalls neu)
const twoRadar = stream({ radar: 1, kmh: 150, cameras: 2, seed: 10 });
ok(twoRadar.zones.length === 2 && twoRadar.zones[1].bornS > twoRadar.zones[0].endS, 'Der zweite Blitzer kommt nicht');
world(twoRadar, 'mit, zwei Blitzer');
announced(twoRadar, 'mit, zwei Blitzer');
flashed(twoRadar, 'mit, zwei Blitzer', 150);
const twoPlain = stream({ kmh: 150, cameras: 2, seed: 10 });
unannounced(twoPlain, 'ohne, zwei Blitzer');
flashed(twoPlain, 'ohne, zwei Blitzer', 150);

// --- 5. Nach einem Blitz stichelt der Chat ab und zu ------------------------------------------------------------------------
{
  const teases = (r) => calls(r, 'ui', 'chat').filter((e) => CHAT.radarFehlt.includes(e.args[0].text) || CHAT.radarTrotz.includes(e.args[0].text));
  const SEEDS = 40;
  let teased = 0;
  for (let seed = 1; seed <= SEEDS; seed++) {
    const plain = stream({ kmh: 150, seed });
    const boxed = stream({ radar: 1, kmh: 150, seed });
    const a = teases(plain);
    const b = teases(boxed);
    ok(a.length <= 1 && b.length === a.length, `Stichelei, Stream ${seed}: ohne Radarwarner ${a.length} Zeilen, mit ihm ${b.length} (höchstens eine, beide Male gleich viele)`);
    ok(a.every((e) => CHAT.radarFehlt.includes(e.args[0].text)), `Stichelei, Stream ${seed}: ohne Radarwarner steht „${a[0]?.args[0].text}“ im Chat`);
    ok(b.every((e) => CHAT.radarTrotz.includes(e.args[0].text)), `Stichelei, Stream ${seed}: mit Radarwarner steht „${b[0]?.args[0].text}“ im Chat`);
    // erst wenn das Foto da ist – vor dem Blitzer wäre sie eine Vorwarnung
    for (const [r, list] of [[plain, a], [boxed, b]]) {
      const photo = calls(r, 'ui', 'photo')[0];
      ok(list.every((e) => photo && e.t > photo.t + 1 && e.s > r.zones[0].camS), `Stichelei, Stream ${seed}: Sie kommt nicht nach dem Foto`);
    }
    ok(plain.game.money === boxed.game.money && same(plain.game.stats, boxed.game.stats), `Stichelei, Stream ${seed}: Kasse oder Statistik weichen mit Radarwarner ab`);
    teased += a.length;
  }
  ok(teased >= SEEDS * 0.3 && teased <= SEEDS * 0.7, `Der Chat stichelt in ${teased} von ${SEEDS} Streams – gedacht ist etwa jeder zweite`);
  // brav vorbei: niemand stichelt
  ok(teases(slowPlain).length === 0 && teases(slowRadar).length === 0, 'Der Chat stichelt, obwohl es nicht geblitzt hat');
}

// --- Derselbe Stream mit und ohne Radarwarner: Kasse, Abrechnung, Statistik, Jobs ------------------------------------------
for (const [a, b, what] of [[fastPlain, fastRadar, '150'], [slowPlain, slowRadar, '110'], [twoPlain, twoRadar, 'zwei Blitzer']]) {
  ok(a.game.money === b.game.money && same(a.game.breakdown, b.game.breakdown), `${what}: Kasse ohne ${a.game.money.toFixed(2)} €, mit ${b.game.money.toFixed(2)} €`);
  ok(same(a.game.stats, b.game.stats), `${what}: Statistik weicht ab`);
  ok(a.game.viewers === b.game.viewers && a.game.t === b.game.t && a.game.player.s === b.game.player.s, `${what}: Zuschauer, Zeit oder Strecke weichen ab`);
  ok(same(a.game.jobs, b.game.jobs), `${what}: Die Jobs weichen ab`);
  ok(same(a.zones, b.zones), `${what}: Die Blitzer stehen woanders`);
}
// Der Job „An einem Blitzer vorbei, ohne geblitzt zu werden“ zählt wie immer (stat blitzerClean)
ok(slowPlain.game.stats.blitzerClean === 1 && slowRadar.game.stats.blitzerClean === 1 && fastRadar.game.stats.blitzerClean === 0, 'Der Blitzer-Job zählt anders');

// --- 6. Der Artikel und der Spielstand ---------------------------------------------------------------------------------------
{
  const i = SHOP.findIndex((x) => x.id === 'radar');
  const it = SHOP[i];
  ok(!!it, 'Der Shop hat keinen Radarwarner');
  // (früher stand er hinter dem Megafon; das gehört jetzt zur Ausstattung, und der Radarwarner führt die Rubrik an)
  ok(it && it.cat === 'Spaß' && SHOP[i - 1].cat !== it.cat, 'Der Radarwarner steht nicht vorn in der Rubrik Spaß');
  ok(it && same(it.prices, [250]) && UPGRADE_LIMITS.radar === 1, 'Der Radarwarner hat nicht genau eine Stufe für 250 €');
  ok(it && it.name === 'Radarwarner' && it.icon && it.desc.length > 20 && typeof it.effect(1) === 'string', 'Dem Artikel fehlen Name, Zeichen, Beschreibung oder Wirkung');
  ok(new Set(SHOP.map((x) => x.id)).size === SHOP.length, 'Zwei Artikel teilen sich eine Kennung');

  // Ersatz für localStorage
  const box = new Map();
  globalThis.localStorage = { getItem: (k) => (box.has(k) ? box.get(k) : null), setItem: (k, v) => box.set(k, String(v)), removeItem: (k) => box.delete(k) };
  const KEY = 'mini-adam-tesla-navi-v1';
  // ein alter Spielstand kennt den Artikel nicht: Er lädt unverändert, und niemand warnt
  const old = { wallet: 300, upgrades: { elsa: 1, vmax: 2 }, best: { distance: 12000, earned: 80, viewers: 900 }, stats: { runs: 4, totalKm: 51, naviReached: 3, crashes: 1 } };
  box.set(KEY, JSON.stringify(old));
  const a = loadSave();
  ok(same(a.upgrades, old.upgrades) && a.wallet === 300 && !('radar' in a.upgrades), 'Ein alter Spielstand lädt nicht unverändert');
  const g0 = stream({ kmh: 150 }).game;
  g0.start(a);
  ok(g0.hasRadar === false, 'Ein alter Spielstand hat plötzlich einen Radarwarner');
  // kaufen (wie buy in main.js: Stufe + 1, Guthaben − Preis), speichern, neu laden
  a.upgrades.radar = (a.upgrades.radar || 0) + 1;
  a.wallet -= it.prices[0];
  ok(storeSave(a), 'Speichern schlägt fehl');
  const b = loadSave();
  ok(b.upgrades.radar === 1 && b.wallet === 50 && b.upgrades.elsa === 1 && b.upgrades.vmax === 2, 'Der gekaufte Radarwarner übersteht das Neuladen nicht');
  g0.start(b);
  ok(g0.hasRadar === true, 'Der gekaufte Radarwarner warnt nach dem Neuladen nicht');
  ok(b.upgrades.radar >= UPGRADE_LIMITS.radar, 'Der Shop böte den gekauften Radarwarner noch einmal an');
  // ein Stand mit einer Stufe, die es nicht gibt: Der Spielstand bleibt, wie er ist, und der Artikel gilt als gekauft
  // (Spiel: warnt genau wie mit Stufe 1 · Shop: „Ausgebaut“, nichts zu kaufen)
  box.set(KEY, JSON.stringify({ ...old, upgrades: { radar: 5 } }));
  const c = loadSave();
  ok(c.upgrades.radar >= UPGRADE_LIMITS.radar, 'Stufe 5 gilt im Shop nicht als ausgebaut');
  const five = stream({ radar: c.upgrades.radar, kmh: 150 });
  ok(five.game.hasRadar === true && spoken(five).length === 1 && same(five.game.stats, fastRadar.game.stats) && five.game.money === fastRadar.game.money, 'Stufe 5 verhält sich anders als Stufe 1');
}

if (fails) {
  console.error(`radar-test: ${fails} von ${checks} Prüfungen fehlgeschlagen`);
  process.exit(1);
}
console.log(`radar-test: ok (${checks} Prüfungen: ohne Radarwarner keine Vorwarnung, mit ihm eine je Blitzer; Blitz, Bußgeld, Foto und Kasse wie immer)`);
