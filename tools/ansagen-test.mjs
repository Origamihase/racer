// Prüft die Ansagen, den Chat und die Auktion der Reise ohne Grafik (die zweite Testfahrt des Eigentümers, 20.11.2026):
// - OMI: Der Boardcomputer heißt überall, wo Spieler ihn lesen oder hören, OMI (Texte, Stimmen, Menüs, README, INSIDER,
//   Ladekarte); intern darf er nomi heißen.
// - Streamstart: Nach „Wir sind live.“ sagt Mini Adam „Partypeople!“ in seiner Stimme, der Chat grüßt zurück, die
//   Stimmung ist gut; wer zügig zum Ziel fährt, hebt sie deutlich, wer trödelt, senkt sie (simulierte Streams,
//   tools/stream-sim.mjs).
// - Auktion: Gebote ändern das Ziel nur bis AUKTION.lock Navi-Kilometer vor dem Brunnen, dann fällt der Zuschlag (am
//   Rand, mit Gewinner und Betrag); jedes Gebot steht im Chat und am Rand, jedes neue Ziel, sobald es steht, sagt OMI
//   mit Brunnen und Ort an.
// - Streamende: Nach jeder Folge öffnet ein Bieterfenster; ob jemand bietet, hängt an der Stimmung, und bietet niemand,
//   ist der Stream vorbei (Abspann 'stream').
// - Zuschauer: Während der Fahrt zeigt das HUD nur die Zahl am 👁 (kein Gesicht, kein Balken, keine Kurve, keine
//   zweite Zahl im Chat-Kopf); der Abspann zeigt die Einschaltquote als Kurve (ui/quotechart.js).
// - Reihenfolge und Stimme: In einer BrunnenTV-Folge spricht OMI genau einmal, Sprachstudio und Durchsagen warten bis
//   danach; was Mini Adam durchs Megafon sagt, sagt er mit seiner Stimme, nie mit OMIs.
// - Trödeladam: Wer lange steht, lange langsam fährt oder eine Runde vertrödelt, den nennt der Chat so – mit Abstand,
//   nur wenn es stimmt, und es kostet ein wenig Stimmung; wer zügig fährt, hört es nie.
// - Ansagen stimmen: Wer im Chat, in einer Durchsage oder im Sprachstudio etwas über den Moment behauptet (Autobahn,
//   Funkloch, Tempo, Regen, Ziel, Gebote), trägt dafür ein Stichwort (game.js FACTS) und kommt nur, wenn es gilt;
//   Funklöcher kommen nie mitten in einer Szene, die linke Spur endet an der Ausfahrt.
// - Running Gags: mindestens 40 neue Chat-Zeilen aus den stärksten Memes des Streams, jede mit ihrem Anlass (Stichwort
//   oder Ereignis), nichts aus der Sperrliste der Recherche.
// - Handy hochkant: Wo der Mittelbildschirm rechts aus dem Bild ragt, steht seine Akku-Karte als kleine Kopie oben in
//   der zweiten Reihe (statt des Spur-Balkens), sonst nirgends.
import { mainSource, gameSource } from './lib/main-source.mjs';
import { readFileSync } from 'node:fs';
import * as DATA from '../src/data.js';
import { ZUFRIEDEN } from '../src/game/satisfaction.js';
import { MOOD_START, Economy } from '../src/game/economy.js';
import { AUKTION, QUOTE_DT, TROEDEL, FACTS, untag, fountainIn } from '../src/game/game.js';
import { drawQuote } from '../src/ui/quotechart.js';
import { Speech } from '../src/speech.js';
import { UI } from '../src/ui/ui.js';
import { cockpitParts, HOMES } from '../src/ui/sicht.js';
import { makeStream, DRIVERS } from './stream-sim.mjs';
import { STUDIO_HOST } from '../src/game/studio.js';
import { checkHost } from './lib/host.mjs';

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
  // der Moderator heißt im Spiel Walte (Crew-Liste des Eigentümers), nirgends Malte (intern darf er 'malte' heißen)
  for (const t of texts) ok(!/Malte/.test(t), `data.js nennt Malte statt Walte: „${t.slice(0, 80)}“`);
  // Zeichenketten im Quelltext von Spiel, Oberfläche und Cockpit (Kommentare dürfen den alten Namen tragen)
  const files = [
    'src/data.js', 'src/game/game.js', 'src/game/akku.js', 'src/game/parts/spur-wetter.js',
    'src/game/parts/ziel.js', 'src/game/parts/ereignisse.js', 'src/game/parts/stream.js', 'src/ui/ui.js',
    'src/game/studio.js', 'src/ui/menus.js', 'src/ui/first-tips.js', 'src/ui/drive-hint.js', 'src/cockpit/screen.js', 'src/main.js',
    'src/scenes/start.js', 'src/scenes/stop.js', 'src/scenes/tv.js', 'src/world/xxl/charge.js', 'src/game/damage.js',
  ];
  for (const f of files) {
    read(f).split('\n').forEach((line, i) => {
      const code = line.replace(/^\s*(\/\/|\*|\/\*).*$/, '').replace(/\/\/.*$/, '');
      const strings = code.match(/'[^']*'|`[^`]*`|"[^"]*"/g) || [];
      for (const s of strings) ok(!/NOMI/.test(s), `${f}:${i + 1} zeigt NOMI: ${s.slice(0, 80)}`);
      for (const s of strings) ok(!/Malte/.test(s), `${f}:${i + 1} zeigt Malte statt Walte: ${s.slice(0, 80)}`);
    });
  }
  for (const f of ['README.md', 'INSIDER.md', 'docs/index.html']) ok(!/NOMI|Malte/.test(read(f)), `${f} nennt NOMI oder Malte`);
  ok(DATA.VOICES.board.label === 'OMI', `Stimme des Boardcomputers heißt ${DATA.VOICES.board.label}`);
}

// --- Streamstart und Stimmung -------------------------------------------------------------------------------------
{
  ok(DATA.PARTYPEOPLE.say === 'Partypeople!', `Gruß zum Start: ${DATA.PARTYPEOPLE.say}`);
  ok(DATA.VOICES.adam.pitch < 0.6, 'Mini Adams Stimme ist tief');
  const main = mainSource();
  // erst „Wir sind live.“ (Sprachstudio), dann sein Gruß in seiner Stimme mit Untertitel, beides mit Vorrang der Reihe nach
  ok(/function streamStart\(\) \{[\s\S]*?speech\.say\(CHARGE_LINES\.live, game\.studio\.voice\(\), \{ priority: true[\s\S]*?speech\.say\(text, 'adam', \{\s*priority: true[\s\S]*?ui\.adam\(text, /.test(main), 'main.js: „Wir sind live.“ und danach der Gruß in Mini Adams Stimme mit Untertitel');
  ok(/if \(!chargeRun\.hello\) streamStart\(\)/.test(main), 'main.js: ohne Startszene beginnt der Stream beim Losfahren');
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
      const said = log.speak.filter((x) => x.who === 'navi' && x.t < a.t && x.text.includes(' hat das Navi-Ziel geändert. Neues Ziel: ')).pop();
      const ok2 = said && said.text.endsWith(' Neues Ziel: ' + a.name + '.') && said.label === 'Navi-Durchsage';
      if (ok2) sum.announced++;
      ok(ok2, `${drv} ${seed}: Ankunft in ${a.name}, aber OMI sagte zuletzt „${said ? said.text : '–'}“`);
    }
  }
  ok(sum.zuschlag >= 6 && sum.arrivals >= 4, `Auktion zu wenig geprüft: ${sum.zuschlag} Zuschläge, ${sum.arrivals} Ankünfte`);
  console.log(`  Auktion: ${sum.bids} Gebote, alle mehr als ${AUKTION.lock} km vor dem Ziel (${sum.late} zu spät) · ${sum.zuschlag} Zuschläge (${sum.cut} beendeten ein Rennen) · ${sum.arrivals} Ankünfte, ${sum.announced} mit der Navi-Durchsage „… hat das Navi-Ziel geändert. Neues Ziel: <Ort>.“`);
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
  ok(p8 < 0.03 && p5 > 0.05 && p5 < 0.14 && p3 > 0.15 && p1 > p3 && p3 > p5 && p5 > p8, `Bieterfenster: niemand bietet bei 0,8 ${pct(p8)}, 0,5 ${pct(p5)}, 0,3 ${pct(p3)}, 0,1 ${pct(p1)}`);
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

// --- Eine Zuschauerzahl, die Einschaltquote im Abspann --------------------------------------------------------------
{
  const ui = read('src/ui/ui.js');
  ok(/'👁 ' \+ fmtNum\(Math\.round\(g\.viewers\)\)/.test(ui), 'HUD: Zuschauerzahl am 👁 fehlt');
  ok(!/chatCount|chat-count|chatMood|Zuschauer'/.test(ui), 'HUD: eine zweite Zuschauerzahl oder die Stimmung im Chat-Kopf');
  ok(!/chat-count|chat-mood/.test(read('docs/style.css')), 'style.css: Reste von Zuschauerzahl oder Stimmung im Chat-Kopf');
  const sim = makeStream({ driver: DRIVERS.zuegig, seed: 2 });
  sim.step(300);
  const q = sim.game.quote;
  ok(Math.abs(q.v.length - 300 / QUOTE_DT) <= 2 && q.v.every((v) => v > 0), `Einschaltquote: ${q.v.length} Werte in 300 s`);
  ok(q.tv.length === sim.game.stats.brunnenTV && q.tv.every((e) => e.t > 0 && e.n > 0), 'Einschaltquote: Folgen fehlen');
  sim.game.end('quit');
  const o = sim.game.over.quote;
  ok(o && o.v.length === q.v.length + 1 && o.t === sim.game.t, 'Abspann ohne Einschaltquote');
  // gezeichnet mit einer Leinwand zum Mitschreiben (Node hat keine): Kurve, Folgen, Spitze
  const calls = [];
  const ctx = new Proxy({}, { get: (t, k) => (k in t ? t[k] : k === 'measureText' ? () => ({ width: 60 }) : k === 'createLinearGradient' ? () => ({ addColorStop() {} }) : (...a) => calls.push([k, ...a])), set: (t, k, v) => ((t[k] = v), true) });
  globalThis.Path2D = class {
    moveTo() {}
    lineTo() {}
    closePath() {}
  };
  const peak = drawQuote({ getContext: () => ctx }, o, 640, 170, 2);
  ok(peak.v === Math.max(...o.v), `Einschaltquote: Spitze ${peak.v}, höchster Wert ${Math.max(...o.v)}`);
  ok(calls.some((c) => c[0] === 'fillText' && /^Spitze /.test(c[1])) && calls.filter((c) => c[0] === 'arc').length >= o.tv.length + 1, 'Einschaltquote: Spitze oder Folgen nicht gezeichnet');
  // die Zeitachse: kurze Sendungen sekundengenau (sonst „0:00“ an beiden Enden), lange in Minuten und Stunden
  const axis = (t) => {
    calls.length = 0;
    drawQuote({ getContext: () => ctx }, { dt: QUOTE_DT, v: [240, 300, 410, 463], tv: [], t }, 640, 170, 2);
    return calls.filter((c) => c[0] === 'fillText' && /^\d/.test(c[1]) && c[3] === 170 - 8).map((c) => c[1]).join(' ');
  };
  const axes = [28, 83, 300, 1500, 4500].map(axis);
  ok(axes.join(' | ') === '0:00 0:28 | 0:00 1:23 | 0:00 5:00 | 0:00 13 min 25 min | 0:00 38 min 1:15 h', `Einschaltquote: Zeitachse ${axes.join(' | ')}`);
  ok(/quoteBlock\(card, o\.quote\)/.test(read('src/ui/menus.js')), 'menus.js: Abspann zeigt die Einschaltquote nicht');
  console.log(`  Zuschauer: eine Zahl am 👁 · Einschaltquote ${o.v.length} Werte, Spitze ${peak.v}, ${o.tv.length} Folgen markiert · Zeitachse ${axes.join(' | ')}`);
}

// --- Reihenfolge und Stimme rund um BrunnenTV ---------------------------------------------------------------------
{
  const episodes = [];
  for (const seed of [1, 3, 5]) {
    const sim = makeStream({ driver: DRIVERS.mittel, seed, endless: true });
    const { game, log } = sim;
    let tv = null;
    for (let t = 0; t < 1500 && episodes.filter((e) => e.seed === seed).length < 2; t += 0.5) {
      sim.step(0.5);
      if (game.tv && !tv) tv = { seed, t0: game.t, t1: Infinity };
      if (!game.tv && tv) {
        tv.t1 = game.t;
        episodes.push(tv);
        tv = null;
      }
    }
    for (const e of episodes.filter((x) => x.seed === seed)) {
      const inside = (x) => x.t >= e.t0 - 0.05 && x.t <= e.t1;
      const spoken = log.speak.filter(inside);
      const omi = spoken.filter((x) => x.who === 'nomi');
      ok(omi.length === 1, `Seed ${seed}, Folge um ${e.t0.toFixed(0)} s: OMI ${omi.length}× (${omi.map((x) => x.text).join(' | ')})`);
      ok(!spoken.some((x) => x.who === 'studio' || x.who === 'durchsage'), `Seed ${seed}, Folge um ${e.t0.toFixed(0)} s: ${spoken.filter((x) => x.who === 'studio' || x.who === 'durchsage').map((x) => x.who + ': ' + x.text).join(' | ')}`);
      ok(spoken.filter((x) => x.who === 'megafon').every((x) => x.label === DATA.SCHOENNBRUN.label), `Seed ${seed}: ein fremder Megafon-Satz in der Folge`);
      ok(log.say.filter(inside).every((x) => ['adam', 'brunnen', 'board'].includes(x.voice)), `Seed ${seed}: in der Folge spricht ${log.say.filter(inside).map((x) => x.voice).join(', ')}`);
    }
    // was Mini Adam durchs Megafon sagt (Folge, Wunsch, Taste H), spricht er selbst
    const mega = new Set(log.speak.filter((x) => x.who === 'megafon').map((x) => x.text.replace(/^»|«$/g, '')));
    const voices = log.say.filter((x) => mega.has(x.text) || /^Achtung, Achtung! Bitte machen Sie die Spur frei!$/.test(x.text)).map((x) => x.voice);
    ok(voices.every((v) => v === 'adam' || v === 'brunnen'), `Seed ${seed}: Megafon mit den Stimmen ${[...new Set(voices)].join(', ')}`);
    ok(!log.speak.some((x) => x.text === 'Sie haben Ihr Ziel erreicht.'), `Seed ${seed}: OMI sagt beim Halt noch „Sie haben Ihr Ziel erreicht.“`);
  }
  ok(episodes.length >= 4, `Reihenfolge: nur ${episodes.length} Folgen geprüft`);
  // Stimmen: OMI hat ihre, alle anderen eine andere (auch ohne tiefe Männerstimme auf dem Gerät)
  const sp = new Speech();
  sp.voices = [{ name: 'Google Deutsch', lang: 'de-DE' }, { name: 'Anna', lang: 'de-DE' }];
  const omi = sp.pickVoice('board');
  ok(['adam', 'brunnen', 'william', 'sprachstudio', 'kassandra'].every((k) => sp.pickVoice(k) !== omi), 'Mit zwei Stimmen klingt jemand wie OMI');
  sp.voices = [{ name: 'Anna', lang: 'de-DE' }];
  ok(sp.pickVoice('adam') === sp.voices[0], 'Mit einer Stimme bleibt Mini Adam stumm');
  console.log(`  Reihenfolge: ${episodes.length} Folgen, je genau ein Satz von OMI, Studio und Durchsagen danach; Megafon immer mit Mini Adams Stimme`);
}

// --- Trödeladam ------------------------------------------------------------------------------------------------------
{
  const T = DATA.CHAT.troedel;
  const why = new Map();
  for (const k of ['steht', 'langsam', 'runde']) for (const line of T[k]) why.set(line, k);
  ok(Object.values(T).every((pool) => pool.length >= 5) && [...why.keys()].every((l) => /trödel/i.test(l)), 'Trödeladam: zu wenige Sätze, oder einer ohne den Namen');
  const sum = { troedler: 0, zuegig: 0, steht: 0, langsam: 0, runde: 0, echo: 0, mins: 0 };
  // (Startwerte: Wer die Länge der BrunnenTV-Folge oder die Listen ändert, aus denen das Spiel würfelt, verschiebt, wann
  // der Trödler steht und wohin er fährt – mit Folgen von 12 s rief der Chat bei Startwert 3 nur einmal: Ein Funkloch
  // setzte die Standzeit 0,2 s vor dem Ruf zurück, und kein Ziel danach war langsam genug; seitdem Startwert 5)
  for (const seed of [1, 2, 5]) {
    for (const drv of ['troedler', 'zuegig']) {
      const sim = makeStream({ driver: DRIVERS[drv], seed, endless: true });
      const { game, log } = sim;
      const arrivals = [];
      let tv = null;
      for (let t = 0; t < 900 && sim.step(1); t++) {
        if (game.tv && !tv) arrivals.push(game.t);
        tv = game.tv;
      }
      const calls = log.chat.filter((c) => why.has(c.text));
      sum[drv] += calls.length;
      if (drv === 'zuegig') {
        ok(calls.length === 0, `Seed ${seed}: Der zügige Fahrer heißt ${calls.length}× Trödeladam (${calls.map((c) => c.text).join(' | ')})`);
        continue;
      }
      sum.mins += game.t / 60;
      sum.echo += log.chat.filter((c) => T.echo.includes(c.text)).length;
      ok(calls.length >= 2, `Seed ${seed}: Der Trödler hört in ${(game.t / 60).toFixed(0)} min nur ${calls.length}× Trödeladam`);
      ok(calls.length <= 2 + game.t / 150, `Seed ${seed}: ${calls.length}× Trödeladam in ${(game.t / 60).toFixed(0)} min ist zu oft`);
      ok(game.eco.causes.down.troedel > 0 || calls.length === 0, `Seed ${seed}: Trödeladam kostet keine Stimmung`);
      for (let i = 0; i < calls.length; i++) {
        const c = calls[i];
        const k = why.get(c.text);
        sum[k]++;
        if (i) ok(c.t - calls[i - 1].t >= TROEDEL.cool - 0.01, `Seed ${seed}: Trödeladam nach ${(c.t - calls[i - 1].t).toFixed(0)} s schon wieder`);
        // jeder Satz passt zum Moment: steht – der Wagen steht (keine Folge, kein Halt); langsam – er fährt zu einem
        // Ziel; runde – er ist gerade angekommen
        if (k === 'steht') ok(c.at.kmh < 3 && !c.at.tv && !c.at.stopping, `Seed ${seed}: „${c.text}“ bei ${c.at.kmh.toFixed(0)} km/h${c.at.tv ? ' in der Folge' : ''}`);
        if (k === 'langsam') ok(c.at.target && !c.at.tv && !c.at.stopping, `Seed ${seed}: „${c.text}“ ohne Fahrt zum Ziel`);
        if (k === 'runde') ok(arrivals.some((a) => c.t - a > 0 && c.t - a < 8), `Seed ${seed}: „${c.text}“ ohne Ankunft kurz davor (${c.t.toFixed(0)} s)`);
      }
    }
  }
  ok(sum.steht > 0 && sum.langsam > 0, `Trödeladam: zu wenig Anlässe geprüft (steht ${sum.steht}, langsam ${sum.langsam})`);
  // eine vertrödelte Runde (Urteil am Ziel unter TROEDEL.round): Der Chat sagt es kurz nach der Ankunft, in der Folge
  {
    const sim = makeStream({ driver: DRIVERS.mittel, seed: 4, endless: true });
    const { game, log } = sim;
    const Z = game.zufrieden;
    const arrive = Z.arrive.bind(Z);
    Z.arrive = () => {
      const dz = arrive();
      Z.q = TROEDEL.round - 0.1;
      return dz;
    };
    let t0 = -1;
    for (let t = 0; t < 900 && t0 < 0 && sim.step(0.5); t += 0.5) if (game.tv) t0 = game.t;
    sim.step(8);
    const r = log.chat.filter((c) => c.t > t0 && T.runde.includes(c.text));
    ok(t0 > 0 && r.length === 1 && r[0].at.tv && r[0].t - t0 > 2.8 && r[0].t - t0 < 4.2, `Vertrödelte Runde: ${r.length} Sätze nach der Ankunft um ${t0.toFixed(0)} s`);
    sum.runde += r.length;
  }
  console.log(`  Trödeladam: der Trödler ${sum.troedler}× in ${sum.mins.toFixed(0)} min (steht ${sum.steht}, langsam ${sum.langsam}, Runde ${sum.runde}; ${sum.echo} Echos aus dem Chat), der zügige Fahrer ${sum.zuegig}×`);
}

// --- Ansagen stimmen: Stichworte für Behauptungen über den Moment --------------------------------------------------
{
  const { CHAT, STUDIO, DURCHSAGEN } = DATA;
  // die Durchsicht (der Eigentümer: „Wir sind auf der Autobahn und streamen in Full HD“ im Ort, „Chatstimmung mau durch
  // Funkloch“ ohne Funkloch): Wer in den allgemeinen Vorräten so etwas sagt, braucht das Stichwort dazu
  const RULES = [
    [/Autobahn|Rechts fahren|Raststätte|Überhol/, 'ab'],
    [/Full HD|Bild (ist|und)|so scharf|kein Funkloch/, 'netz'],
    [/Regen|regnet/, 'regen'],
    [/langsam|Schnecke|Traktor|Pommes werden kalt|mehr Strom|Laster haben/, 'langsam'],
    [/10 € mehr|Navi-Ziel ändert|stabilisiert/, 'offen'],
    [/Wann sind wir da|bald da|noch an\?|kommt bestimmt ein Brunnen/, 'ziel'],
  ];
  // geprüft und für wahr befunden, obwohl ein Wort passt: Fragen und Witze, die nichts über den Moment behaupten
  const FREE = new Set(['Ist das Bild wirklich Full HD?', 'Die Stimmung im Chat steigt. Es regnet Herzen.', '[kassandra] Fräulein Kassandra, bitte langsamer lesen 😅']);
  const general = { ambient: CHAT.ambient, cheerful: CHAT.cheerful, restless: CHAT.restless, flott: CHAT.flott, schneller: CHAT.schneller, meme: CHAT.meme, levels: STUDIO.levels.flat(), short: STUDIO.short.flat() };
  const tags = (l) => (l.startsWith('[') ? l.slice(1, l.indexOf(']')).split(' ') : []);
  let audited = 0;
  for (const [name, pool] of Object.entries(general)) {
    for (const line of pool) {
      audited++;
      const t = tags(line);
      ok(t.every((k) => k in FACTS), `${name}: unbekanntes Stichwort in „${line}“`);
      for (const [re, key] of RULES) if (re.test(untag(line)) && !FREE.has(line)) ok(t.includes(key), `${name}: „${line}“ behauptet etwas (${key}) ohne Stichwort`);
    }
  }
  for (const d of DURCHSAGEN) {
    audited++;
    const when = d.when ? d.when.split(' ') : [];
    ok(when.every((k) => k in FACTS), `Durchsage mit unbekanntem when: ${d.text}`);
    for (const [re, key] of RULES) if (re.test(d.text)) ok(when.includes(key), `Durchsage „${d.text}“ behauptet etwas (${key}) ohne when`);
    ok(!/Ich biete|Neues Ziel/.test(d.text), `Durchsage gibt ein Gebot vor, das es nicht gibt: ${d.text}`);
  }
  ok(!CHAT.crash.some((l) => /ist unterwegs/.test(l)), 'Nach dem Rempler kündigt der Chat die Polizei an, die nie kommt');
  // Stichworte nur in Vorräten, die über chatLine/fresh laufen (sonst stünde „[ab]“ im Chat)
  const src = gameSource() + mainSource();
  for (const [name, pool] of Object.entries(CHAT)) {
    if (!Array.isArray(pool) || !pool.some((l) => l.startsWith('['))) continue;
    ok(!new RegExp(`pick\\(CHAT\\.${name}\\)`).test(src), `CHAT.${name} hat Stichworte, wird aber mit pick() gezogen`);
  }
  // im Spiel: Jeder Satz mit Stichwort kam, als es galt; keiner zeigt seine Klammern; Funklöcher nie in einer Szene
  const tagOf = new Map();
  const add = (l) => tags(l).length && tagOf.set(untag(l), tags(l));
  Object.values(general).flat().forEach(add);
  for (const d of DURCHSAGEN) if (d.when) tagOf.set(d.text, d.when.split(' '));
  const holds = {
    ab: (at) => at.kind === 'ab',
    ort: (at) => at.kind === 'stadt',
    regen: (at) => at.rain > 0.3,
    langsam: (at) => at.kmh >= 3 && at.kmh < 90,
    offen: (at) => at.phase === 'offen' && !!at.target,
    ziel: (at) => !!at.target,
    stau: (at) => at.stuck,
    netz: (at, t, funk) => !at.funkloch && !funk.some((f) => f.on && f.t <= t && t - f.t <= 60),
    start: (at, t) => t < 150,
    lange: (at, t) => t > 3600,
    weit: (at) => at.secs > 600 && at.secs < Infinity,
    nah: (at) => at.secs < 60,
    steht: (at) => at.kmh < 3 && !at.tv && !at.charging,
    laden: (at) => at.charging,
    tv: (at) => at.tv,
    folge2: (at) => at.tv && at.n >= 2,
  };
  // (was der Simulator nicht selbst sieht – Sprachstudio, Durchsage, Akku, Wochentag –, prüft FACTS im Moment der Zeile)
  const holdsAt = (k, at, t, funk) => (holds[k] ? holds[k](at, t, funk) : at.facts.includes(k));
  const nah = new Set(STUDIO.why.up.nah);
  const stau = new Set(STUDIO.why.down.stau);
  const lane = new Set([...CHAT.leftLaneTease, ...CHAT.leftLaneDonor]);
  const sum = { lines: 0, tagged: 0, keys: {}, funk: 0, durch: 0, studio: 0, meme: 0 };
  for (const [drv, seed] of [['mittel', 11], ['gemuetlich', 12], ['troedler', 13], ['zuegig', 14]]) {
    const sim = makeStream({ driver: DRIVERS[drv], seed, endless: true });
    const { log } = sim;
    sim.step(900);
    const all = [...log.chat, ...log.speak];
    sum.lines += all.length;
    sum.meme += log.chat.filter((c) => CHAT.meme.some((l) => untag(l) === c.text)).length;
    ok(!all.some((x) => x.text.startsWith('[')), `${drv}: ein Satz zeigt seine Stichworte: ${(all.find((x) => x.text.startsWith('[')) || {}).text}`);
    for (const x of all) {
      const text = x.text;
      const t = tagOf.get(text);
      if (!t) continue;
      sum.tagged++;
      if (x.who === 'durchsage') sum.durch++;
      for (const k of t) {
        sum.keys[k] = (sum.keys[k] || 0) + 1;
        ok(holdsAt(k, x.at, x.t, log.funk), `${drv} ${seed}: „${text}“ um ${x.t.toFixed(0)} s, aber ${k} gilt nicht (${x.at.kind}, ${x.at.kmh.toFixed(0)} km/h, ${x.at.phase})`);
      }
    }
    for (const f of log.funk.filter((f) => f.on)) {
      sum.funk++;
      ok(!f.at.tv && !f.at.charging && !f.at.stopping, `${drv} ${seed}: Funkloch um ${f.t.toFixed(0)} s mitten in einer Szene`);
    }
    for (const x of log.speak.filter((s) => s.who === 'studio')) {
      const parts = [...nah].filter((l) => x.text.endsWith(l));
      const jam = [...stau].filter((l) => x.text.endsWith(l));
      if (parts.length || jam.length) sum.studio++;
      ok(!parts.length || x.at.target, `${drv} ${seed}: Sprachstudio „${x.text}“ ohne Ziel im Navi`);
      ok(!jam.length || x.at.stuck, `${drv} ${seed}: Sprachstudio „${x.text}“, aber niemand vor uns`);
    }
    ok(!log.chat.some((c) => lane.has(c.text) && c.at.kind !== 'ab'), `${drv} ${seed}: Der Chat will die linke Spur abseits der Autobahn`);
  }
  ok(sum.tagged >= 20 && Object.keys(sum.keys).length >= 4, `Ansagen: zu wenige Sätze mit Stichwort geprüft (${sum.tagged}: ${JSON.stringify(sum.keys)})`);
  // Running Gags: jede Zeile mit Anlass, mindestens 40 neue (dazu die Ereignis-Zeilen), keine doppelt, nichts Gesperrtes
  const memes = CHAT.meme;
  const events = ['IST DAS LIVE?? 🤨', 'Funkloch vorbei. Tschüss, du Betrüger!', 'Null Balken 📵', 'Wer hat die Polizei Gifhorn gerufen? 😂', 'Wackel mal am Kabel'];
  ok(memes.length >= 40 && memes.every((l) => tags(l).length > 0), `Running Gags: ${memes.length} Zeilen, ${memes.filter((l) => !tags(l).length).length} ohne Anlass`);
  ok(events.every((l) => [CHAT.funklochBack, CHAT.funkloch, CHAT.police, CHAT.frog].some((p) => p.includes(l))), 'Running Gags: Ereignis-Zeilen fehlen');
  const others = Object.entries(CHAT).filter(([k, v]) => k !== 'meme' && Array.isArray(v)).flatMap(([, v]) => v.map(untag));
  ok(memes.every((l) => !others.includes(untag(l))) && new Set(memes).size === memes.length, 'Running Gags: eine Zeile gibt es schon');
  ok(!memes.concat(events).some((l) => /Rettich|Hüttler|Trier|Weil es so geil|Drachen|Emskirchen/i.test(l)), 'Running Gags: etwas aus der Sperrliste');
  ok(memes.concat(events).filter((l) => /Betrüger/.test(l)).every((l) => /Navi|Funkloch/.test(l)), 'Running Gags: „Tschüss du Betrüger“ nur gegen Dinge');
  const shown = new Set(memes.map(untag));
  console.log(`  Running Gags: ${memes.length} Zeilen mit Anlass (${[...new Set(memes.flatMap(tags))].length} Stichworte) und ${events.length} bei Ereignissen · im Spiel ${sum.meme} gezeigt, jede zur rechten Zeit`);
  console.log(`  Ansagen: ${audited} Sätze der allgemeinen Vorräte und Durchsagen durchgesehen · im Spiel ${sum.lines} Sätze, ${sum.tagged} mit Stichwort (${Object.entries(sum.keys).map(([k, n]) => k + ' ' + n).join(', ')}; ${sum.durch} Durchsagen), alle zur rechten Zeit · ${sum.funk} Funklöcher, keins in einer Szene · ${sum.studio} Studio-Anlässe „nah“/„Stau“ geprüft`);
}

// --- Handy hochkant: die Akku-Karte als kleine Kopie am Rand ---------------------------------------------------------
{
  const cut = (W, H) => cockpitParts(W, H).screen.right > W;
  ok(cut(390, 844) && cut(360, 780) && cut(412, 915) && !cut(1280, 720) && !cut(844, 390) && !cut(1920, 1080), 'Mittelbildschirm: Er ragt nicht genau hochkant aus dem Bild');
  const ui = read('src/ui/ui.js');
  const css = read('docs/style.css');
  ok(/toggle\('screen-cut', cockpitParts\(W, window\.innerHeight\)\.screen\.right > W\)/.test(ui) && /this\.showAkkuCard\(g\.akku\.card\(\)\)/.test(ui), 'ui.js: Akku-Kopie nicht an Mittelbildschirm und Akku-Karte gebunden');
  ok(/\.akku-mini \{ display: none;/.test(css) && /\.screen-cut \.akku-mini\.on \{ display: flex; \}/.test(css) && /\.top-row:has\(\.akku-mini\.on\) \.navi-turn \{ display: none; \}/.test(css) && HOMES.akku, 'style.css/sicht.js: Akku-Kopie nicht nur bei abgeschnittenem Mittelbildschirm oder ohne Platz');
  // derselbe Inhalt wie die Karte des Mittelbildschirms (Akku.card): Stufe, Prozent, Ladepark
  const sim = makeStream({ driver: DRIVERS.mittel, seed: 6 });
  sim.step(20);
  const g = sim.game;
  const box = () => ({ on: new Set(), style: {}, textContent: '', classList: { toggle(c, v) { if (v) this.self.on.add(c); else this.self.on.delete(c); } } });
  const f = { akkuEl: box(), akkuFill: box(), akkuTitle: box(), akkuPark: box() };
  f.akkuEl.classList.self = f.akkuEl;
  const seen = [];
  for (const pct of [50, 9.4, 4.2, 0]) {
    g.player.battery = pct;
    g.t += 0.5;
    g.akku.lowBattery();
    const b = g.akku.card();
    UI.prototype.showAkkuCard.call(f, b);
    seen.push(f.akkuEl.on.has('on') ? f.akkuTitle.textContent + ' | ' + f.akkuPark.textContent : '–');
  }
  ok(seen[0] === '–' && /^Akku fast leer · 9 % \| /.test(seen[1]) && /^Akku kritisch · 4 % \| /.test(seen[2]) && seen[3] === 'Akku leer · 0 % | Der Wagen rollt aus', `Akku-Kopie: ${seen.join(' / ')}`);
  console.log(`  Handy hochkant: Akku-Kopie oben, sobald der Mittelbildschirm aus dem Bild ragt (390 × 844: rechts bei ${cockpitParts(390, 844).screen.right.toFixed(0)} px) · ${seen.slice(1).join(' / ')}`);
}

// --- Warteschlange und Pause der Sprachausgabe (src/speech.js) -------------------------------------------------------
{
  const sp = new Speech();
  // Sätze mit Vorrang hinter einem laufenden kommen in ihrer Reihenfolge, wie ihre Untertitel
  for (const t of ['Regen erkannt.', 'Neues Ziel: Hanau.', 'Akku fast leer.']) sp.say(t, 'board', { priority: true });
  ok(sp.current.text === 'Regen erkannt.' && sp.queue.map((q) => q.text).join('|') === 'Neues Ziel: Hanau.|Akku fast leer.', `Vorrang: ${sp.queue.map((q) => q.text).join(' | ')} warten (neuester zuerst?)`);
  // eine Durchsage, die OMI aus der Warteschlange drängt, meldet das; eine, die gar nicht hineinkommt, hat Dauer 0
  sp.stopAll();
  let dropped = 0;
  sp.say('Sprachstudio spricht.', 'sprachstudio');
  ok(sp.say('Eine Durchsage.', 'kassandra', { onDrop: () => dropped++ }) > 0, 'Durchsage kommt nicht in die Warteschlange');
  sp.say('OMI sagt etwas.', 'board', { priority: true });
  ok(dropped === 1 && !sp.queue.some((q) => q.text === 'Eine Durchsage.'), `Verdrängte Durchsage: onDrop ${dropped}×`);
  sp.stopAll();
  for (let i = 0; i < 4; i++) sp.say(`Satz ${i}.`, 'kassandra');
  ok(sp.say('Einer zu viel.', 'kassandra') === 0, 'Ein Satz über der vollen Warteschlange meldet eine Dauer');
  // die Pause hält den laufenden Satz an (auch sein Sicherheitsnetz); Neustart aus der Pause hebt sie auf
  sp.stopAll();
  sp.say('Kurz.', 'board');
  sp.pause(true);
  await new Promise((r) => setTimeout(r, 1600));
  ok(sp.current?.text === 'Kurz.' && sp.busy, 'Während der Pause gilt der Satz als fertig');
  sp.say('Danach.', 'board');
  sp.stopAll();
  ok(!sp.paused && !sp.queue.length && !sp.current, 'stopAll aus der Pause: Sprachausgabe bleibt angehalten');
  sp.say('Neuer Stream.', 'board');
  ok(sp.current?.text === 'Neuer Stream.', 'Nach stopAll aus der Pause spricht niemand');
  sp.stopAll();
  console.log('  Sprachausgabe: Vorrang in Reihenfolge, verdrängte Durchsage gemeldet, Pause hält den Satz an, Neustart hebt sie auf');
}

// Nach dem Stopp, Neustart oder Ende des Streams: geplante Ansagen, Abspann im Ladestopp, Zeiten des neuen Streams
{
  const main = mainSource();
  ok(/if \(!game\.charging \|\| game\.over\) \{/.test(main), 'main.js: Endet der Stream im Ladestopp, bleibt die Szene stehen (stopTick)');
  ok(/function toTitle\(\) \{[^}]*liveOff\(\);/.test(main) && /state = 'ending';\n\s*stateT = 0;\n\s*liveOff\(\);/.test(main), 'main.js: „Wir sind live.“ kommt noch nach dem Ende');
  const sim = makeStream({ driver: DRIVERS.zuegig, seed: 3 });
  const g = sim.game;
  g.understeerSaid = g.reverseSaid = g.reverseChat = 7200;
  Object.assign(g.studio, { voices: 5, last: 7000, until: 7200, mark: 3000, extra: { kind: 'total', until: 7300 } });
  g.start(g.save);
  ok(g.understeerSaid === -99 && g.reverseSaid === -99 && g.reverseChat === -99, 'Game.start: Sperrzeiten der Ansagen aus dem vorigen Stream bleiben');
  const S = g.studio;
  ok(S.voices === 0 && S.last === -99 && S.until === 0 && S.mark === 500 && !S.extra && S.due >= 26 && S.due <= 34 && S.greetIn >= 100 && S.greetIn <= 170 && !('studio' in g.T), 'Game.start: Das Sprachstudio behält den vorigen Stream');
}

// --- Schnittstelle des Sprachstudios ---------------------------------------------------------------------------------
// Die Klasse Studio (src/game/studio.js) liest vom Spiel nur, was STUDIO_HOST nennt – und die Liste nennt nichts Überflüssiges.
{
  const used = checkHost('game/studio.js', STUDIO_HOST, ok);
  console.log(`  Studio-Schnittstelle: ${used.size} Namen des Spiels (${[...used].sort().join(', ')})`);
}

// --- Hängende Sprachausgabe ------------------------------------------------------------------------------------------
// Meldet die Sprachausgabe einen Satz nie fertig (Netzstimmen in Chrome), bricht das Sicherheitsnetz ihn ab: Der nächste
// Satz spricht, statt sich stumm hinter den hängenden zu stellen und später mit allen anderen auf einmal zu kommen.
{
  const saved = { setTimeout: globalThis.setTimeout, clearTimeout: globalThis.clearTimeout, now: Date.now, window: globalThis.window, utt: globalThis.SpeechSynthesisUtterance };
  const clock = { t: 0, timers: [], id: 0 };
  globalThis.setTimeout = (fn, ms = 0) => {
    clock.timers.push({ id: ++clock.id, at: clock.t + ms, fn });
    return clock.id;
  };
  globalThis.clearTimeout = (id) => (clock.timers = clock.timers.filter((x) => x.id !== id));
  Date.now = () => clock.t;
  // Chrome mit hängender Stimme: speak() stellt an, nichts endet; erst cancel() leert die Schlange
  const engine = {
    queue: [],
    spoken: [],
    cancels: 0,
    getVoices: () => [{ name: 'Google Deutsch', lang: 'de-DE' }],
    speak(u) {
      this.queue.push(u);
      if (this.queue.length === 1 && !this.hung) this.spoken.push(u.text);
    },
    cancel() {
      this.cancels++;
      this.queue = [];
      this.hung = false;
    },
    pause() {},
    resume() {},
  };
  engine.hung = true;
  globalThis.window = { speechSynthesis: engine };
  globalThis.SpeechSynthesisUtterance = class {
    constructor(text) {
      this.text = text;
    }
  };
  try {
    const sp = new Speech();
    sp.say('Erster Satz, der hängen bleibt.', 'board');
    sp.say('Zweiter Satz.', 'board');
    for (let ms = 0; ms < 30000; ms += 50) {
      clock.t = ms;
      for (const x of clock.timers.filter((q) => q.at <= ms).sort((a, b) => a.at - b.at)) {
        clock.timers = clock.timers.filter((q) => q !== x);
        x.fn();
      }
    }
    ok(engine.cancels >= 1, 'Hängende Sprachausgabe: Das Sicherheitsnetz bricht den Satz nicht ab');
    ok(engine.spoken.includes('Zweiter Satz.') && engine.queue.length <= 1, `Hängende Sprachausgabe: Der zweite Satz spricht nicht (gesprochen ${JSON.stringify(engine.spoken)}, ${engine.queue.length} in der Schlange)`);
  } finally {
    Object.assign(globalThis, { setTimeout: saved.setTimeout, clearTimeout: saved.clearTimeout, window: saved.window, SpeechSynthesisUtterance: saved.utt });
    Date.now = saved.now;
  }
}

console.log(`ansagen-test: ${checks} Prüfungen, ${fails} Fehler`);
if (fails) process.exit(1);
