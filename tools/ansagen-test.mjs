// Prüft die Ansagen, den Chat und die Auktion der Reise ohne Grafik (die zweite Testfahrt des Eigentümers, 20.11.2026):
// - OMI: Der Boardcomputer heißt überall, wo Spieler ihn lesen oder hören, OMI (Texte, Stimmen, Menüs, README, INSIDER,
//   Ladekarte); intern darf er nomi heißen.
// - Streamstart: Mini Adam sagt „Hallo, Partypeople!“ in seiner Stimme, der Chat grüßt zurück, die Stimmung ist gut;
//   wer zügig zum Ziel fährt, hebt sie deutlich, wer trödelt, senkt sie (simulierte Streams, tools/stream-sim.mjs).
// - Auktion: Gebote ändern das Ziel nur bis AUKTION.lock Navi-Kilometer vor dem Brunnen, dann fällt der Zuschlag (am
//   Rand, mit Gewinner und Betrag); jedes Gebot steht im Chat und am Rand, jedes neue Ziel, sobald es steht, sagt OMI
//   mit Brunnen und Ort an.
// - Streamende: Nach jeder Folge öffnet ein Bieterfenster; ob jemand bietet, hängt an der Stimmung, und bietet niemand,
//   ist der Stream vorbei (Abspann 'stream').
import { readFileSync } from 'node:fs';
import * as DATA from '../src/data.js';
import { ZUFRIEDEN } from '../src/game/satisfaction.js';
import { MOOD_START, Economy } from '../src/game/economy.js';
import { AUKTION, fountainIn } from '../src/game/game.js';
import { makeStream, DRIVERS } from './stream-sim.mjs';

let fails = 0;
let checks = 0;
const seen = new Map();
function ok(cond, msg) {
  checks++;
  if (cond) return;
  fails++;
  const n = (seen.get(msg.slice(0, 40)) || 0) + 1;
  seen.set(msg.slice(0, 40), n);
  if (n <= 3) console.error('FEHLER: ' + msg);
}
const root = new URL('../', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');

// --- OMI --------------------------------------------------------------------------------------------------------
{
  // jeder Text aus data.js (Chat, Ansagen, Stimmen, Shop, Abspann …), auch in Listen und Objekten
  const texts = [];
  const walk = (v, depth = 0) => {
    if (depth > 6 || v === null) return;
    if (typeof v === 'string') texts.push(v);
    else if (typeof v === 'function' && v.length === 0) {
      try {
        const r = v();
        if (typeof r === 'string') texts.push(r);
      } catch (e) {
        /* Funktionen mit Pflichtangaben prüft der Quelltext unten */
      }
    } else if (Array.isArray(v)) v.forEach((x) => walk(x, depth + 1));
    else if (typeof v === 'object') Object.values(v).forEach((x) => walk(x, depth + 1));
  };
  walk(DATA);
  ok(texts.length > 1000, `nur ${texts.length} Texte in data.js gefunden`);
  for (const t of texts) ok(!/NOMI/.test(t), `data.js nennt NOMI: „${t.slice(0, 80)}“`);
  // Zeichenketten im Quelltext von Spiel, Oberfläche und Cockpit (Kommentare dürfen den alten Namen tragen)
  for (const f of ['src/data.js', 'src/game/game.js', 'src/ui/ui.js', 'src/ui/menus.js', 'src/ui/first-tips.js', 'src/ui/drive-hint.js', 'src/cockpit/screen.js', 'src/main.js', 'src/world/xxl/charge.js', 'src/game/damage.js']) {
    read(f).split('\n').forEach((line, i) => {
      const code = line.replace(/^\s*(\/\/|\*|\/\*).*$/, '').replace(/\/\/.*$/, '');
      const strings = code.match(/'[^']*'|`[^`]*`|"[^"]*"/g) || [];
      for (const s of strings) ok(!/NOMI/.test(s), `${f}:${i + 1} zeigt NOMI: ${s.slice(0, 80)}`);
    });
  }
  for (const f of ['README.md', 'INSIDER.md', 'docs/index.html']) ok(!/NOMI/.test(read(f)), `${f} nennt NOMI`);
  ok(DATA.VOICES.board.label === 'OMI', `Stimme des Boardcomputers heißt ${DATA.VOICES.board.label}`);
}

// --- Streamstart und Stimmung -------------------------------------------------------------------------------------
{
  ok(DATA.PARTYPEOPLE.say === 'Hallo, Partypeople!', `Gruß zum Start: ${DATA.PARTYPEOPLE.say}`);
  ok(DATA.VOICES.adam.pitch < 0.6, 'Mini Adams Stimme ist tief');
  const main = read('src/main.js');
  ok(/speech\.say\(PARTYPEOPLE\.say, 'adam'/.test(main) && /ui\.adam\(PARTYPEOPLE\.say/.test(main), 'main.js: Gruß in Mini Adams Stimme mit Untertitel');
  ok(/if \(!chargeRun\.hello\) streamHello\(\)/.test(main), 'main.js: ohne Startszene grüßt er beim Losfahren');
  const avg = { fast: 0, slow: 0, start: 0 };
  const seeds = [1, 2, 3];
  for (const seed of seeds) {
    const fast = makeStream({ driver: DRIVERS.zuegig, seed });
    const e0 = fast.game.eco.peek();
    ok(e0.mood === MOOD_START && e0.level >= 3, `Seed ${seed}: Stimmung zum Start ${e0.mood} (Stufe ${e0.level}), soll gut sein`);
    ok(fast.game.zufrieden.value >= ZUFRIEDEN.happy, `Seed ${seed}: Zufriedenheit zum Start ${fast.game.zufrieden.value}`);
    fast.step(5);
    const back = fast.log.chat.filter((c) => DATA.PARTYPEOPLE.chat.includes(c.text));
    ok(back.length >= 3 && back.every((c) => c.t < 4), `Seed ${seed}: Der Chat grüßt ${back.length}× zurück`);
    fast.step(115);
    const m = fast.game.eco.peek().mood;
    ok(m > MOOD_START + 0.1, `Seed ${seed}: zügig zum nahen Ziel hebt die Stimmung nicht deutlich (${m.toFixed(2)})`);
    ok(fast.game.zufrieden.value > ZUFRIEDEN.start + 1, `Seed ${seed}: zügig hebt die Zufriedenheit nicht (${fast.game.zufrieden.value.toFixed(1)})`);
    const slow = makeStream({ driver: DRIVERS.troedler, seed });
    slow.step(240);
    const ms = slow.game.eco.peek().mood;
    ok(ms < MOOD_START - 0.15, `Seed ${seed}: Trödeln senkt die Stimmung nicht (${ms.toFixed(2)})`);
    avg.fast += m / seeds.length;
    avg.slow += ms / seeds.length;
  }
  console.log(`  Stimmung: Start ${MOOD_START}, zügig nach 120 s ${avg.fast.toFixed(2)}, Trödler nach 240 s ${avg.slow.toFixed(2)}`);
}

// --- Auktion: 5-km-Regel, Zuschlag, Ansage des neuen Ziels --------------------------------------------------------
{
  ok(fountainIn({ name: 'Würzburg', goal: 'Marktbrunnen, Würzburg' }) === 'Marktbrunnen in Würzburg', 'fountainIn: Brunnen in Ort');
  ok(fountainIn({ name: 'Hanau', goal: 'Brunnen in Hanau' }) === 'Brunnen in Hanau', 'fountainIn: ohne eigenen Namen');
  const sum = { bids: 0, late: 0, zuschlag: 0, cut: 0, arrivals: 0, announced: 0 };
  for (const [drv, seed] of [['zuegig', 1], ['zuegig', 2], ['mittel', 3], ['mittel', 4]]) {
    const sim = makeStream({ driver: DRIVERS[drv], seed, endless: true });
    const { game, log } = sim;
    const nv = game.navi;
    const bids = [];
    const overbid = nv.overbid.bind(nv);
    nv.overbid = (s, bidder, inc, target) => {
      const km = nv.target ? nv.km : Infinity;
      bids.push({ t: game.t, km, phase: game.auction.phase, bidder, target });
      return overbid(s, bidder, inc, target);
    };
    let tv = null;
    const arrivals = [];
    for (let t = 0; t < 900 && sim.step(1); t++) {
      if (game.tv && !tv) arrivals.push({ t: game.t, name: game.tv.name });
      tv = game.tv;
    }
    sum.bids += bids.length;
    for (const b of bids) {
      if (!(b.km > AUKTION.lock) || b.phase !== 'offen') sum.late++;
      ok(b.km > AUKTION.lock && b.phase === 'offen', `${drv} ${seed}: Gebot bei ${b.km.toFixed(1)} km (${b.phase}) um ${b.t.toFixed(0)} s – nach dem Zuschlag`);
    }
    const chips = log.toast.filter((x) => x.key === 'auktion');
    const zs = chips.filter((x) => x.text.startsWith('🔨 Zuschlag: '));
    sum.zuschlag += zs.length;
    ok(chips.length - zs.length === bids.length, `${drv} ${seed}: ${bids.length} Gebote, aber ${chips.length - zs.length} am Rand`);
    const james = log.chat.filter((c) => /bietet .* – neues Ziel: /.test(c.text));
    ok(james.length === bids.length, `${drv} ${seed}: ${bids.length} Gebote, aber ${james.length} im Chat`);
    for (const z of zs) ok(/^🔨 Zuschlag: .+ · [\d.]+\s€ · .+$/.test(z.text) && z.at.target, `${drv} ${seed}: Zuschlag ohne Gewinner, Betrag oder Ziel: ${z.text}`);
    sum.cut += log.chat.filter((c) => c.text.includes('Das Rennen ist entschieden')).length;
    // jede Ankunft: Vorher fiel der Zuschlag, und OMI hat genau dieses Ziel als neues Ziel angesagt
    for (const a of arrivals) {
      sum.arrivals++;
      const z = zs.filter((x) => x.t < a.t).pop();
      ok(z && z.text.endsWith(' · ' + a.name), `${drv} ${seed}: Ankunft in ${a.name} um ${a.t.toFixed(0)} s ohne Zuschlag dafür`);
      const said = log.speak.filter((x) => x.who === 'nomi' && x.t < a.t && x.text.startsWith('Neues Ziel: ')).pop();
      const ok2 = said && said.text.endsWith(' in ' + a.name + '!');
      if (ok2) sum.announced++;
      ok(ok2, `${drv} ${seed}: Ankunft in ${a.name}, aber OMI sagte zuletzt „${said ? said.text : '–'}“`);
    }
  }
  ok(sum.zuschlag >= 6 && sum.arrivals >= 4, `Auktion zu wenig geprüft: ${sum.zuschlag} Zuschläge, ${sum.arrivals} Ankünfte`);
  console.log(`  Auktion: ${sum.bids} Gebote, alle mehr als ${AUKTION.lock} km vor dem Ziel (${sum.late} zu spät) · ${sum.zuschlag} Zuschläge (${sum.cut} beendeten ein Rennen) · ${sum.arrivals} Ankünfte, ${sum.announced} mit OMIs Ansage „Neues Ziel: … in <Ort>!“`);
}

// --- Bieterfenster und Streamende --------------------------------------------------------------------------------
{
  const pct = (x) => (100 * x).toFixed(0) + ' %';
  const eco = new Economy({ seed: 5 });
  const none = (m) => {
    eco.poke(m);
    let n = 0;
    for (let i = 0; i < 2000; i++) {
      let bid = false;
      for (let t = 0; t < AUKTION.window && !bid; t += 1 / 30) bid = eco.windowBid(1 / 30);
      if (!bid) n++;
    }
    return n / 2000;
  };
  const [p8, p5, p3, p1] = [0.8, 0.5, 0.3, 0.1].map(none);
  ok(p8 < 0.03 && p5 < 0.2 && p3 > 0.15 && p1 > p3 && p3 > p5 && p5 > p8, `Bieterfenster: niemand bietet bei 0,8 ${pct(p8)}, 0,5 ${pct(p5)}, 0,3 ${pct(p3)}, 0,1 ${pct(p1)}`);
  ok(/stream: \{ title: 'Keine Gebote mehr'/.test(read('src/ui/menus.js')), 'menus.js: Abspann für das Streamende ohne Gebot fehlt');

  // nach der ersten Folge bietet niemand: Das Fenster läuft ab, James und der Chat verabschieden sich, OMI sagt Gute Nacht
  const sim = makeStream({ driver: DRIVERS.zuegig, seed: 1 });
  const { game, log } = sim;
  game.eco.windowBid = () => false;
  let opened = -1;
  let shown = '';
  let bar = '';
  let bidsAfter = 0;
  const overbid = game.navi.overbid.bind(game.navi);
  game.navi.overbid = (...a) => (opened >= 0 && bidsAfter++, overbid(...a));
  while (game.t < 900 && sim.step(0.5)) {
    if (game.auction.phase === 'fenster' && opened < 0) opened = game.t;
    if (opened >= 0 && !shown && game.t - opened > 6) [shown, bar] = [game.navi.waitLine, game.navi.screen().bar];
  }
  const after = (c) => c.t >= opened - 0.6;
  ok(game.over && game.over.reason === 'stream', `Ohne Gebot endet der Stream nicht (${game.over ? game.over.reason : 'läuft noch'})`);
  ok(opened > 0 && game.t - opened >= AUKTION.window && game.t - opened < AUKTION.window + 5, `Streamende ${(game.t - opened).toFixed(1)} s nach dem Öffnen des Fensters`);
  ok(/Gebote noch \d+ s/.test(shown) && /noch \d+ s für Gebote/.test(bar), `Navi-Zeile und Balken zählen das Fenster nicht: „${shown}“ / „${bar}“`);
  ok(bidsAfter === 0, `${bidsAfter} Gebote im Fenster, obwohl niemand bieten sollte`);
  ok(log.chat.some((c) => after(c) && c.text.startsWith('Neue Runde!')), 'James eröffnet das Bieterfenster nicht');
  ok(log.chat.some((c) => after(c) && (DATA.CHAT.fensterBald.includes(c.text) || DATA.CHAT.fensterStill.includes(c.text))), 'Der Chat meldet sich vor dem Ende des Fensters nicht');
  ok(log.chat.some((c) => after(c) && c.text.startsWith('Keine Gebote mehr')), 'James sagt das Streamende nicht an');
  ok(log.chat.some((c) => after(c) && DATA.CHAT.streamEnde.includes(c.text)), 'Der Chat verabschiedet sich nicht');
  ok(log.speak.some((x) => x.who === 'nomi' && x.text.startsWith('Keine Gebote mehr')), 'OMI sagt zum Streamende nichts');

  // … und wenn jemand nach 7 s bietet, geht die Runde weiter
  const sim2 = makeStream({ driver: DRIVERS.zuegig, seed: 1 });
  sim2.game.eco.windowBid = () => sim2.game.t >= sim2.game.auction.until - AUKTION.window + 7;
  let open2 = -1;
  let bidT = -1;
  const ob2 = sim2.game.navi.overbid.bind(sim2.game.navi);
  sim2.game.navi.overbid = (...a) => (open2 >= 0 && bidT < 0 && (bidT = sim2.game.t), ob2(...a));
  while (sim2.game.t < 900 && sim2.step(0.5) && !(open2 >= 0 && sim2.game.t > open2 + AUKTION.window + 10)) {
    if (sim2.game.auction.phase === 'fenster' && open2 < 0) open2 = sim2.game.t;
  }
  ok(!sim2.game.over && bidT > 0 && Math.abs(bidT - open2 - 7) < 0.6 && sim2.game.navi.target && sim2.game.navi.window === 0, `Gebot im Fenster: nach ${(bidT - open2).toFixed(1)} s, Stream ${sim2.game.over ? 'vorbei' : 'läuft'}`);
  console.log(`  Bieterfenster ${AUKTION.window} s: niemand bietet bei Stimmung 0,8 ${pct(p8)} · 0,5 ${pct(p5)} · 0,3 ${pct(p3)} · 0,1 ${pct(p1)}; ohne Gebot endet der Stream ${(game.t - opened).toFixed(1)} s nach dem Öffnen`);
}

console.log(`ansagen-test: ${checks} Prüfungen, ${fails} Fehler`);
if (fails) process.exit(1);
