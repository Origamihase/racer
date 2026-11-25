// Prüfstand „Minus“ (Besitzer, 25.11.2026: „Ich möchte, dass Schäden, Bußgelder etc das Guthaben ins Minus ziehen
// kann. Dann kann man nichts mehr im Shop kaufen, aber trotzdem noch spielen und auch laden.“):
// 1. Schulden sind echt: Bußgeld, Verwarngeld und Schäden werden auch im Minus ganz gebucht (Kasse, Abrechnung,
//    Einblendung), der Stream endet mit Vorzeichen, das Guthaben geht unter null und trägt die Schulden in den nächsten
//    Stream; ein Spielstand im Minus lädt; ein Stream mit Guthaben im Minus startet und läuft; Titel, Shop, Abspann,
//    Pause und HUD zeigen ein Minus mit Minuszeichen in der Farbe der Abzüge, nie als 0.
// 2. Im Minus ist der Shop zu: der Grund steht oben, jeder Kauf-Knopf ist gesperrt, der Kauf in main.js wird abgelehnt –
//    und ist das Guthaben wieder im Plus, geht es wieder; nichts anderes gibt Guthaben aus.
// 3. Laden kostet Geld und geht immer: Bei 5 % Akku, −500 € Guthaben und −300 € in der Kasse beginnt der Ladestopp an
//    der eingeplanten Säule, endet voll und bucht die geladenen kWh × 0,59 € (Rand, James, Runde, Abrechnung, Abspann);
//    übersprungen ebenso; endet der Stream mitten im Laden, zählt der Strom bis dahin – einmal. Nichts im Laden fragt
//    nach Geld.
// node tools/minus-test.mjs
import { readFileSync } from 'node:fs';

let fails = 0;
let checks = 0;
function ok(cond, msg) {
  checks++;
  if (cond) return;
  fails++;
  console.error('FEHLER: ' + msg);
}
const src = (f) => readFileSync(new URL('../' + f, import.meta.url), 'utf8');
const near = (a, b) => Math.abs(a - b) < 1e-6;

// --- Ersatz für localStorage (wie save-test) ----------------------------------------------------------------------
const box = new Map();
globalThis.localStorage = {
  getItem: (k) => (box.has(k) ? box.get(k) : null),
  setItem: (k, v) => box.set(k, String(v)),
  removeItem: (k) => box.delete(k),
};

// --- ein kleines DOM für die Menüs: Knoten mit Klassen, Text und Kindern -------------------------------------------
function node(tag) {
  const n = { tag, kids: [], dataset: {}, style: {}, className: '', disabled: false, own: '' };
  const has = (c) => n.className.split(/\s+/).includes(c);
  n.classList = {
    contains: has,
    add: (c) => !has(c) && (n.className = (n.className + ' ' + c).trim()),
    remove: (c) => (n.className = n.className.split(/\s+/).filter((x) => x !== c).join(' ')),
    toggle: (c, on) => {
      const want = on === undefined ? !has(c) : !!on;
      if (want) n.classList.add(c);
      else n.classList.remove(c);
      return want;
    },
  };
  n.appendChild = (c) => (n.kids.push(c), c);
  n.append = (...cs) => cs.forEach((c) => n.kids.push(typeof c === 'string' ? { tag: '#text', own: c, kids: [] } : c));
  Object.defineProperty(n, 'textContent', {
    get: () => n.own + n.kids.map((c) => (c.tag === '#text' ? c.own : c.textContent)).join(''),
    set: (v) => {
      n.own = String(v);
      n.kids = [];
    },
  });
  n.querySelector = () => null;
  n.querySelectorAll = () => [];
  n.addEventListener = n.removeEventListener = n.setAttribute = () => {};
  return n;
}
const all = (n) => [n, ...n.kids.filter((c) => c.tag !== '#text').flatMap(all)];
globalThis.document = { createElement: node };
globalThis.ResizeObserver = class {
  observe() {}
  disconnect() {}
};

const { DEFAULT_SAVE, loadSave, storeSave, settleStream, settlePending } = await import('../src/save.js');
const { BUSSGELD, REPARATUR, STREAM_GEBUCHT, SHOP, UPGRADE_LIMITS, shopPrice, shopLocked, canBuy, SHOP_LOCK, LADEN, ladeKosten, ladeCount, FINES, INCOME } = await import('../src/data.js');
const { fmtKonto, kontoMinus, fmtKwh, fmtCent } = await import('../src/util.js');
const { Menus } = await import('../src/ui/menus.js');
const { makeStream, DRIVERS } = await import('./stream-sim.mjs');
const NB = ' ';

// --- 1a. Bußgeld, Verwarngeld und Schäden: im Minus ganz gebucht ----------------------------------------------------
{
  const S = makeStream({ driver: DRIVERS.mittel, seed: 3, endless: true });
  const g = S.game;
  const pops = [];
  g.ui.money = (v, label) => pops.push({ v, label });
  S.step(4);
  ok(g.running && Math.abs(g.money) < 1e-9, `Start: Kasse ${g.money} statt 0`);
  // geblitzt gleich am Anfang (Kasse 0): der echte Weg über passCamera, das Foto kostet ganz
  // (in der Sekunde danach darf eine Spende kommen: die Einnahmen werden herausgerechnet)
  const income = () => Object.values(g.breakdown).filter((v) => v > 0).reduce((x, v) => x + v, 0);
  const at0 = g.money - income();
  g.passCamera(true, () => {}, 50);
  S.step(1);
  ok(near(g.money - income(), at0 - BUSSGELD.blitzer), `Blitzer bei 0 €: Kasse ${g.money} € (ohne Einnahmen ${g.money - income()})`);
  ok(near(g.breakdown.Bußgeld, -BUSSGELD.blitzer) && near(g.stats.fines, BUSSGELD.blitzer), `Blitzer bei 0 €: Abrechnung ${g.breakdown.Bußgeld}, Statistik ${g.stats.fines}`);
  ok(pops.some((x) => x.v === -BUSSGELD.blitzer && x.label === 'Bußgeld'), `Blitzer bei 0 €: Einblendung ${JSON.stringify(pops)}`);
  // tief im Minus: Verwarngeld (Standstreifen, echter Weg über update) und ein Blitzer, beide ganz
  g.money = -300;
  const v0 = g.breakdown.Verwarngeld || 0;
  g.player.shoulderTime = 5;
  S.step(0.1);
  ok(near(g.money, -300 - BUSSGELD.verwarn), `Verwarngeld bei −300 €: Kasse ${g.money} statt ${-300 - BUSSGELD.verwarn}`);
  ok(near(g.breakdown.Verwarngeld, v0 - BUSSGELD.verwarn), `Verwarngeld bei −300 €: Abrechnung ${g.breakdown.Verwarngeld}`);
  ok(pops.some((x) => x.v === -BUSSGELD.verwarn && x.label === 'Verwarngeld'), 'Verwarngeld bei −300 €: keine Einblendung des ganzen Betrags');
  g.money = -1000;
  g.fine(BUSSGELD.blitzer, 'Bußgeld');
  ok(near(g.money, -1000 - BUSSGELD.blitzer) && near(g.breakdown.Bußgeld, -2 * BUSSGELD.blitzer) && near(g.stats.fines, 2 * BUSSGELD.blitzer + BUSSGELD.verwarn), `Blitzer bei −1.000 €: Kasse ${g.money}, Abrechnung ${g.breakdown.Bußgeld}, Statistik ${g.stats.fines}`);
  // nie eine Gutschrift aus einem Bußgeld
  const keep = g.money;
  g.fine(0, 'Bußgeld');
  g.fine(-20, 'Bußgeld');
  ok(g.money === keep, 'Ein Bußgeld von 0 oder weniger ändert die Kasse');
  // Schäden im Minus: die ganze Rechnung, mit Einblendung
  g.money = -400;
  const paid = g.chargeDamage(1, 2, 0, 0);
  ok(paid === REPARATUR.bump + 2 * REPARATUR.mark && near(g.money, -400 - paid), `Schäden bei −400 €: ${paid} €, Kasse ${g.money}`);
  ok(pops.some((x) => x.v === -paid && x.label === 'Schäden'), 'Schäden bei −400 €: keine Einblendung des ganzen Betrags');
  // Einnahmen im Minus tragen die Schulden ab wie sonst
  const before = g.money;
  g.earn(250, 'Spenden');
  ok(near(g.money, before + 250), `Spende im Minus: Kasse ${g.money} statt ${before + 250}`);
  // der Stream endet mit Vorzeichen, und so geht er ins Guthaben
  g.end('quit');
  ok(g.over.money < 0 && near(g.over.money, Math.round(g.money * 100) / 100), `Abrechnung im Minus: ${g.over.money}`);
  const save = { ...structuredClone(DEFAULT_SAVE), wallet: 120 };
  settleStream(save, { money: g.over.money, distance: g.over.distance, peakViewers: g.over.peakViewers, naviReached: 0, crashes: 0 });
  ok(near(save.wallet, Math.round((120 + g.over.money) * 100) / 100) && save.wallet < 0, `Guthaben nach dem Stream im Minus: ${save.wallet}`);
}

// --- 1b. Schulden bleiben stehen: über mehrere Streams, beim Abbruch, im Speicher ----------------------------------
{
  const s = structuredClone(DEFAULT_SAVE);
  s.wallet = -300;
  const run = (money) => settleStream(s, { money, distance: 1000, peakViewers: 10, naviReached: 0, crashes: 0 });
  run(250);
  ok(s.wallet === -50, `−300 € + 250 €: ${s.wallet}`);
  run(-75.5);
  ok(s.wallet === -125.5, `−50 € − 75,50 €: ${s.wallet}`);
  run(200);
  ok(s.wallet === 74.5, `−125,50 € + 200 €: ${s.wallet}`);
  ok(s.stats.runs === 3 && s.best.earned === 250, `Statistik: ${s.stats.runs} Streams, bester ${s.best.earned}`);
  // ein abgebrochener Stream im Minus bei Guthaben im Minus: ganz gebucht, der Titel nennt den ganzen Betrag
  const t = structuredClone(DEFAULT_SAVE);
  t.wallet = -40;
  t.pending = { money: -410.25, distance: 5000, peakViewers: 3, naviReached: 0, crashes: 2 };
  settlePending(t);
  ok(t.wallet === -450.25 && t.streamNote.money === -410.25, `Abbruch im Minus: Guthaben ${t.wallet}, Hinweis ${JSON.stringify(t.streamNote)}`);
  const note = STREAM_GEBUCHT('5,0 km', fmtKonto(410.25), true);
  ok(!/Werkstatt/.test(note) && note.includes('−410,25') && note.includes('vom Guthaben'), `Titel-Hinweis im Minus: ${note}`);
  // ein Spielstand im Minus übersteht Speichern und Laden (und eine leere oder kaputte Zahl wird nicht zum Minus)
  box.clear();
  const a = loadSave();
  a.wallet = -512.34;
  storeSave(a);
  const b = loadSave();
  ok(b.wallet === -512.34, `Spielstand im Minus geladen: ${b.wallet}`);
  b.wallet = -0.01;
  storeSave(b);
  ok(loadSave().wallet === -0.01, 'Spielstand mit −0,01 € lädt nicht');
}

// --- 1c. Ein Stream mit Guthaben im Minus startet und läuft (kein Spielende, keine Sperre) ---------------------------
{
  const S = makeStream({ driver: DRIVERS.zuegig, seed: 5, endless: true, wallet: -500 });
  const g = S.game;
  ok(g.running && !g.over && g.save.wallet === -500, `Start im Minus: läuft ${g.running}, vorbei ${!!g.over}, Guthaben ${g.save.wallet}`);
  S.step(90);
  ok(g.running && !g.over && g.odometer > 500, `Stream im Minus nach 90 s: läuft ${g.running}, ${Math.round(g.odometer)} m`);
  ok(g.save.wallet === -500, 'Der Stream ändert das gespeicherte Guthaben vor seinem Ende');
  // nirgends prüft der Start das Guthaben: main.js liest es nur für Shop, Kauf und Abspann
  const main = src('src/main.js');
  const reads = main.split('\n').filter((l) => /save\.wallet/.test(l)).map((l) => l.trim());
  ok(reads.every((l) => /name === 'shop'|name === 'over'|wallet: save\.wallet|save\.wallet = Math\.round\(\(save\.wallet - price\)|save\.wallet < price|canBuy\(save\.wallet/.test(l)), `main.js liest das Guthaben außerhalb von Shop und Abspann: ${reads.join(' | ')}`);
}

// --- 1d. Anzeige: Minuszeichen, Farbe der Abzüge, nie 0 ---------------------------------------------------------------
{
  ok(fmtKonto(-500) === `−500,00${NB}€` && fmtKonto(1234.5) === `1.234,50${NB}€`, `fmtKonto: ${fmtKonto(-500)} / ${fmtKonto(1234.5)}`);
  ok(fmtKonto(-0.001) === `0,00${NB}€` && !kontoMinus(-0.001) && kontoMinus(-0.01) && fmtKonto(-0.01) === `−0,01${NB}€`, `fmtKonto um null: ${fmtKonto(-0.001)} / ${fmtKonto(-0.01)}`);
  const menus = Object.create(Menus.prototype);
  // Titel
  const title = node('div');
  menus.render_title(title, { ...structuredClone(DEFAULT_SAVE), wallet: -512.34 });
  const tw = all(title).find((n) => /Guthaben$/.test(n.textContent) && n.tag === 'span');
  ok(tw && tw.textContent === `💶 −512,34${NB}€ Guthaben` && tw.classList.contains('minus'), `Titel: ${tw && tw.textContent} (${tw && tw.className})`);
  const title2 = node('div');
  menus.render_title(title2, { ...structuredClone(DEFAULT_SAVE), wallet: 80 });
  const tw2 = all(title2).find((n) => /Guthaben$/.test(n.textContent) && n.tag === 'span');
  ok(tw2 && tw2.textContent === `💶 80,00${NB}€ Guthaben` && !tw2.classList.contains('minus'), `Titel im Plus: ${tw2 && tw2.textContent}`);
  // Shop: das Guthaben oben
  const shop = node('div');
  menus.render_shop(shop, { wallet: -512.34, upgrades: {}, refund: 0 });
  const sw = all(shop).find((n) => n.classList.contains('wallet'));
  ok(sw && sw.textContent === `💶 −512,34${NB}€` && sw.classList.contains('minus'), `Shop: ${sw && sw.textContent} (${sw && sw.className})`);
  // Abspann: „Guthaben · jetzt −512,34 €“ in der Farbe der Abzüge, das Ergebnis des Streams mit Vorzeichen
  const S = makeStream({ seed: 2 });
  S.step(20);
  S.game.money = -230.5;
  S.game.end('quit');
  const over = node('div');
  menus.render_over(over, { ...S.game.over, route: null, quote: null, wallet: -512.34, best: 0, newRecord: false, photos: [] });
  const mon = all(over).find((n) => n.classList.contains('over-money'));
  const konto = mon && all(mon).find((n) => n.classList.contains('konto'));
  ok(mon && mon.classList.contains('minus') && /^−230,50/.test(all(mon).find((n) => n.classList.contains('num')).textContent), `Abspann: Ergebnis ${mon && mon.textContent}`);
  ok(konto && konto.textContent === `−512,34${NB}€` && konto.classList.contains('minus') && /Guthaben · jetzt −512,34/.test(mon.textContent), `Abspann: Guthaben ${mon && mon.textContent}`);
  // Pause: „Einnahmen dieser Fahrt“ im Minus mit Minuszeichen und der Klasse minus, im Plus ohne
  const P = makeStream({ seed: 4 });
  P.step(10);
  const sumOf = (money) => {
    P.game.money = money;
    const pause = node('div');
    menus.render_pause(pause, P.game);
    const it = all(pause).find((n) => n.classList.contains('sum') && /^Einnahmen dieser Fahrt/.test(n.textContent));
    return it && all(it).find((n) => n.classList.contains('v'));
  };
  const pv = sumOf(-90);
  ok(pv && pv.textContent === `−90,00${NB}€` && pv.classList.contains('minus'), `Pause im Minus: ${pv && pv.textContent} (${pv && pv.className})`);
  const pv2 = sumOf(42.5);
  ok(pv2 && pv2.textContent === `42,50${NB}€` && !pv2.classList.contains('minus'), `Pause im Plus: ${pv2 && pv2.textContent} (${pv2 && pv2.className})`);
  const pv3 = sumOf(-0.001);
  ok(pv3 && pv3.textContent === `0,00${NB}€` && !pv3.classList.contains('minus'), `Pause um null: ${pv3 && pv3.textContent}`);
  // HUD: die Stream-Kasse mit fmtKonto und der Klasse minus; die Regeln dazu stehen im Stylesheet
  const ui = src('src/ui/ui.js');
  ok(/const money = fmtKonto\(g\.money\);[\s\S]{0,200}this\.moneyRow\.classList\.toggle\('minus', kontoMinus\(g\.money\)\)/.test(ui), 'HUD: Kasse ohne fmtKonto oder ohne Klasse minus');
  const css = src('docs/style.css');
  for (const rule of ['.stat-val.minus', '.title-stats .minus', '.wallet.minus', '.over-money .konto.minus', '.sum .v.minus']) ok(css.includes(rule), `style.css: Regel ${rule} fehlt`);
}

// --- 1e. Die alten Kappungen sind fort -----------------------------------------------------------------------------
{
  const game = src('src/game/game.js');
  ok(!/nichts zu holen/.test(game + src('src/game/parts/ziel.js') + src('src/save.js')), 'Der Satz „im Minus gibt es nichts zu holen“ steht noch im Code');
  ok(!/Math\.max\(this\.money, 0\)/.test(game), 'Game.fine kappt noch am Kassenstand');
  ok(!/Math\.max\(0, Math\.round\(\(save\.wallet/.test(src('src/save.js')), 'settleStream kappt das Guthaben noch bei null');
}

// --- 2. Im Minus ist der Shop zu ----------------------------------------------------------------------------------
{
  ok(shopLocked(-0.01) && shopLocked(-500) && !shopLocked(0) && !shopLocked(12), 'shopLocked: falsche Grenze');
  ok(!canBuy(-0.01, 0) && !canBuy(-500, 90) && !canBuy(89.99, 90) && canBuy(90, 90) && canBuy(5000, 1900), 'canBuy: falsche Grenze');
  // der Kauf aus main.js, so wie er dort steht (mit Ersatz für Ton, Speicher und Kosmetik)
  const main = src('src/main.js');
  const at = main.indexOf('  buy: (id) => {');
  const body = main.slice(at + '  buy: '.length, main.indexOf('\n  },\n', at) + 4);
  ok(at > 0 && /if \(!canBuy\(save\.wallet, price\)\)/.test(body), 'main.js: der Kauf fragt nicht canBuy');
  const sounds = [];
  const save = { wallet: -500, upgrades: {} };
  let stored = 0;
  const buy = new Function('SHOP', 'UPGRADE_LIMITS', 'shopPrice', 'canBuy', 'save', 'audio', 'storeSave', 'applyCosmetics', 'return ' + body)(
    SHOP, UPGRADE_LIMITS, shopPrice, canBuy, save, { bad: () => sounds.push('bad'), coin: () => sounds.push('coin') }, () => stored++, () => {});
  const cheap = SHOP.reduce((a, b) => (shopPrice(b, 0) < shopPrice(a, 0) ? b : a));
  ok(buy(cheap.id) === false && save.wallet === -500 && !save.upgrades[cheap.id] && stored === 0 && sounds.pop() === 'bad', `Kauf bei −500 €: ${JSON.stringify(save)}`);
  save.wallet = -0.01;
  ok(buy('weste') === false && save.wallet === -0.01 && !save.upgrades.weste, 'Kauf bei −0,01 €: nicht abgelehnt');
  // spätere Streams bringen das Guthaben ins Plus: Dann geht der Kauf wieder
  settleStream(Object.assign(save, { best: {}, stats: {} }), { money: 600.01, distance: 9000 });
  const price = shopPrice(cheap, 0);
  ok(save.wallet === 600 && buy(cheap.id) === true && save.wallet === 600 - price && save.upgrades[cheap.id] === 1 && stored === 1 && sounds.pop() === 'coin', `Kauf im Plus: ${JSON.stringify({ w: save.wallet, u: save.upgrades })}`);
  // der Shop zeigt es: im Minus der Grund oben und alle Knöpfe gesperrt; im Plus wie immer
  const menus = Object.create(Menus.prototype);
  const shopAt = (wallet) => {
    const s = node('div');
    menus.render_shop(s, { wallet, upgrades: {}, refund: 0 });
    const nodes = all(s);
    return { lock: nodes.find((n) => n.classList.contains('shop-lock')), buys: nodes.filter((n) => n.tag === 'button' && n.dataset.action === 'buy') };
  };
  const minus = shopAt(-512.34);
  ok(minus.lock && minus.lock.textContent === SHOP_LOCK && /Guthaben im Minus/.test(SHOP_LOCK) && /ins Plus/.test(SHOP_LOCK), `Shop im Minus: Grund ${minus.lock && minus.lock.textContent}`);
  ok(minus.buys.length === SHOP.length && minus.buys.every((b) => b.disabled && b.classList.contains('poor') && /^🔒 Gesperrt · \d/.test(b.textContent)), `Shop im Minus: Knöpfe ${minus.buys.map((b) => b.textContent + (b.disabled ? '' : ' (frei)')).join(' | ')}`);
  const plus = shopAt(5000);
  ok(!plus.lock && plus.buys.every((b) => !b.disabled && /^Kaufen · /.test(b.textContent)), 'Shop mit 5.000 €: gesperrt');
  const some = shopAt(150);
  ok(!some.lock && some.buys.some((b) => !b.disabled) && some.buys.some((b) => b.disabled && / · fehlt noch /.test(b.textContent)), 'Shop mit 150 €: „fehlt noch“ fehlt oder alles gesperrt');
  // Titel, Pause und Abspann führen in denselben Shop: Nur Titel und Abspann haben den Knopf, die Pause keinen
  const m = src('src/ui/menus.js');
  const pause = m.slice(m.indexOf('  render_pause('), m.indexOf('  render_over('));
  ok(!/'shop'/.test(pause) && (m.match(/button\(menu, '🛒 {1,2}Shop', 'shop'\)/g) || []).length === 2, 'Shop-Knöpfe: Titel und Abspann, nicht die Pause');
  ok(/if \(name === 'shop'\) return \{ wallet: save\.wallet/.test(main), 'main.js: der Shop bekommt nicht das gespeicherte Guthaben');
  // nichts anderes gibt Guthaben aus: save.wallet wird nur beim Kauf, beim Buchen eines Streams und der Erstattung geändert
  const writes = [...main.matchAll(/save\.wallet\s*=(?!=)/g)].length;
  const saveJs = src('src/save.js');
  ok(writes === 1 && [...saveJs.matchAll(/save\.wallet\s*=(?!=)/g)].length === 2, `Guthaben wird außerhalb von Kauf, Abrechnung und Erstattung geändert (main.js ${writes}×)`);
}

// --- 3. Laden kostet Geld und geht immer ----------------------------------------------------------------------------
let laden = '';
{
  ok(LADEN.euroPerKwh === 0.59 && /Das Laden des Autos soll auch auf die Rechnung/.test(src('src/data.js')), 'LADEN: 0,59 € je kWh mit dem Wunsch des Besitzers');
  const k95 = ladeKosten(95, 75);
  ok(near(k95.kwh, 71.25) && k95.euro === 42.04 && ladeKosten(0, 75).euro === 0 && ladeKosten(-3, 75).euro === 0 && ladeKosten(50, 79).euro === 23.31, `ladeKosten: ${JSON.stringify(k95)}`);
  ok(FINES.includes('Ladestrom') && FINES.indexOf('Ladestrom') === FINES.indexOf('Schäden') + 1 && !('Ladestrom' in INCOME), `FINES: ${FINES.join(', ')}`);
  ok(ladeCount(1, 71.25) === `1 Ladestopp · 71,3${NB}kWh` && ladeCount(2, 142.5) === `2 Ladestopps · 142,5${NB}kWh`, `ladeCount: ${ladeCount(2, 142.5)}`);
  /**
   * Ein Stream mit Guthaben im Minus und echtem Akku: Nach der ersten Runde plant der Fahrer den nächsten Ladeplatz ein;
   * ist der Wagen dort im Ort bzw. im Park, steht der Akku auf 5 % (bis der Stopp beginnt) und die Kasse bei −300 €.
   * mid: so viele Sekunden nach Beginn des Ladens endet der Stream (Pause → Stream beenden); skip: so viele überspringt
   * der Spieler; after: so lange geht es nach dem Laden weiter (bis zur Rundenzeile am nächsten Ziel).
   */
  const charge = ({ seed, mid = -1, skip = -1, after = 0 }) => {
    const S = makeStream({ driver: DRIVERS.zuegig, seed, endless: true, wallet: -500, charge: true });
    const g = S.game;
    const p = g.player;
    const toasts = [];
    const pops = [];
    g.ui.toast = (text, kind, key, parts) => toasts.push({ text, kind, key, parts, t: g.t, tally: g.tally.laden });
    g.ui.money = (v, label) => pops.push({ v, label, t: g.t });
    const out = { S, g, toasts, pops, c: null, t0: -1, t1: -1, battery: null, money: null };
    // (vor dem ersten Gebot eingeplant, stürzt das erste Gebot ab – ein Fehler der Navi-Auktion von vorher, siehe NOTES)
    for (let i = 0; i < 30 * 900 && g.navi.opening; i++) S.step(1 / 30);
    g.akku.planStop();
    out.post = S.trip.post;
    out.park = S.trip.stop;
    for (let i = 0; i < 30 * 600 && !g.over; i++) {
      const sec = S.trip.section;
      const near = out.post >= 0 ? sec.kind === 'stadt' && sec.place === out.post : sec.kind === 'park';
      if (!out.c && near) {
        p.battery = 5;
        g.money = -300;
      }
      S.step(1 / 30);
      if (!out.c && g.charging) {
        out.c = { ...g.charging };
        out.t0 = g.t;
      }
      if (out.c && out.t1 < 0 && skip >= 0 && g.t - out.t0 >= skip && g.charging) g.akku.skip();
      if (out.c && out.t1 < 0 && mid >= 0 && g.t - out.t0 >= mid) {
        out.battery = p.battery;
        out.money = g.money;
        g.end('quit');
        break;
      }
      if (out.c && out.t1 < 0 && !g.charging) {
        out.t1 = g.t;
        out.battery = p.battery;
      }
      if (out.t1 >= 0 && g.t - out.t1 >= after) break;
    }
    return out;
  };
  // a) eingeplante Säule, voll geladen, tief im Minus
  const a = charge({ seed: 3, after: 600 });
  const g = a.g;
  const want = ladeKosten(100 - (a.c ? a.c.from : 0), g.player.capacity);
  ok(a.c && a.c.from <= 5.01 && a.c.from > 4.9 && g.save.wallet === -500, `a: Ladestopp beginnt nicht bei 5 % und −500 € (${JSON.stringify(a.c && { from: a.c.from, name: a.c.name })})`);
  ok(a.t1 > a.t0 && a.battery === 100 && g.stats.parkCharges >= 1, `a: Ladestopp endet nicht voll (Akku ${a.battery}, ${a.t0.toFixed(1)} → ${a.t1.toFixed(1)} s)`);
  ok(Math.abs(want.kwh - 0.95 * 75) < 0.01 && want.euro === 42.04, `a: Rechnung ${JSON.stringify(want)} statt 71,25 kWh / 42,04 €`);
  const first = g.ladeBill.n >= 1 ? g.ladeBill : null;
  const strom = Math.round((g.breakdown.Ladestrom || 0) * 100) / 100;
  ok(first && g.ladeBill.n === g.stats.parkCharges && strom <= -want.euro && Math.abs(strom + g.ladeBill.amount) < 0.005, `a: Abrechnung Ladestrom ${strom} €, ${JSON.stringify(g.ladeBill)}`);
  const pop = a.pops.find((x) => x.label === 'Ladestrom');
  ok(pop && pop.v === -want.euro && near(pop.t, a.t1, 0.05), `a: am Guthaben ${JSON.stringify(pop)}`);
  const voll = a.toasts.find((x) => x.key === 'ladestrom');
  ok(voll && voll.text === `🔋 Akku voll${NB}· 71,3${NB}kWh Ladestrom −42,04${NB}€` && voll.kind === 'good' && voll.parts.at(-1)[1] === 'minus' && near(voll.t, a.t1, 0.05), `a: Rand ${JSON.stringify(voll)}`);
  const james = a.S.log.chat.find((m) => m.bot === 'james' && /^Ladestrom/.test(m.text));
  // (die Kasse stand bei −300 €; während des Ladens kamen Spenden dazu)
  ok(james && new RegExp(`^Ladestrom \\(${a.c.name}\\): 71,3${NB}kWh × 0,59${NB}€ = 42,04${NB}€ – die Stream-Kasse steht jetzt bei −[\\d.]+,\\d\\d${NB}€\\.$`).test(james.text), `a: James ${james && james.text}`);
  // die Runde am nächsten Ziel nennt den Ladestrom in einer eigenen Zeile
  const card = a.toasts.find((x) => x.key === 'rechnung' && x.t > a.t1);
  const line = card && card.parts.find((x) => /^Ladestrom/.test(x[0]));
  ok(card && line && line[0] === `Ladestrom −42,04${NB}€ (71,3${NB}kWh)` && line[1] === 'minus schaden', `a: Runde ${card ? card.text : '(keine Ankunft)'}`);
  // nach der Runde zählt die nächste ohne diesen Strom
  ok(card && card.tally === 0, `a: der Ladestrom bleibt in der nächsten Runde stehen (${card && card.tally})`);
  // Abspann: eine eigene Zeile mit Zahl der Stopps und kWh, in der Farbe der Abzüge
  g.end('quit');
  const menus = Object.create(Menus.prototype);
  const over = node('div');
  menus.render_over(over, { ...g.over, route: null, quote: null, wallet: -500 + g.over.money, best: 0, newRecord: false, photos: [] });
  const row = all(over).find((n) => n.classList.contains('bd') && /^Ladestrom/.test(n.kids[0]?.textContent || ''));
  ok(row && row.classList.contains('minus') && row.kids[0].textContent === `Ladestrom (${ladeCount(g.over.laden.n, g.over.laden.kwh)})` && row.kids[1].textContent === '−' + fmtCent(g.over.laden.amount), `a: Abspann ${row && row.textContent}`);
  laden = `Ladestopp bei ${a.c.from.toFixed(2)} %, Guthaben −500 €, Kasse −300 €: ${fmtKwh(want.kwh)} für ${fmtCent(want.euro)} (${a.c.name}, ${(a.t1 - a.t0).toFixed(1)} s)`;
  // b) übersprungen nach 2 s: dieselbe Rechnung, voll geladen
  const b = charge({ seed: 3, skip: 2 });
  ok(b.c && b.battery === 100 && b.t1 - b.t0 < 3 && b.g.ladeBill.n === 1 && b.g.ladeBill.amount === ladeKosten(100 - b.c.from, 75).euro, `b: übersprungen ${JSON.stringify(b.g.ladeBill)}, Akku ${b.battery}`);
  // c) der Stream endet mitten im Laden: der Strom bis dahin, einmal, ohne Chat
  const c = charge({ seed: 3, mid: 9 });
  const cg = c.g;
  const part = ladeKosten(c.battery - c.c.from, 75);
  ok(c.c && cg.over && c.battery > 5.5 && c.battery < 99 && cg.ladeBill.n === 1 && cg.ladeBill.amount === part.euro && near(cg.over.money, Math.round((c.money - part.euro) * 100) / 100), `c: Ende mitten im Laden bei ${c.battery && c.battery.toFixed(1)} %: ${JSON.stringify(cg.ladeBill)}, Kasse ${c.money} → ${cg.over && cg.over.money}`);
  ok(cg.over.laden.n === 1 && !c.S.log.chat.some((m) => m.bot === 'james' && /^Ladestrom/.test(m.text)), 'c: Ende mitten im Laden: doppelt gebucht oder James spricht nach dem Ende');
  cg.akku.cutShort();
  cg.akku.finishCharge();
  ok(cg.ladeBill.n === 1 && cg.ladeBill.amount === part.euro, `c: ein zweites Buchen desselben Stopps (${JSON.stringify(cg.ladeBill)})`);
  // nichts im Laden fragt nach Geld: weder der Akku noch der Halt der Welt noch die Szene
  for (const f of ['src/game/akku.js', 'src/world/xxl/plan.js', 'src/world/xxl/charge.js', 'src/scenes/stop.js']) {
    ok(!/\.money\b|wallet|canBuy|shopLocked/.test(src(f)), `${f} fragt nach dem Kontostand`);
  }
  // und der Zwischenstand rechnet den laufenden Stopp mit (wie end)
  ok(/open \+= this\.akku\.openCharge\(\);/.test(src('src/game/game.js')), 'interim: der Strom eines laufenden Stopps fehlt');
}

console.log(fails ? `minus-test: ${fails} von ${checks} Prüfungen FEHLGESCHLAGEN` : `minus-test: alles grün (${checks} Prüfungen: Schulden ganz gebucht und getragen, Spielstand im Minus, Start im Minus, Anzeige mit Minus, Shop im Minus zu, Laden immer und auf der Rechnung)\n  ${laden}`);
process.exit(fails ? 1 : 0);
