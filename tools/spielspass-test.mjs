// Prüfstand der Spielspaß-Runde vom 27.11.2026 (der Eigentümer wählte aus den Vorschlägen: 1 Haarscharf und Tempo
// spürbar ohne Zischen, 3 Spontan-Wetten, 5 Stammzuschauer mit Gedächtnis samt Gedächtnis des Sprachstudios, 7 neue
// Verkehrsmuster mit der Baustelle als Geschicklichkeitsspiel):
//   1. Haarscharf: Impuls, leiser heller Ton (kein Rauschen), Chat; eine Serie am Rand, HATTRICK, Lob vom Studio
//   2. Stammgäste: wer kommt, was sie zählen und sich merken, Gruß und Wiedersehen, Spielstand
//   3. Gedächtnis des Studios: Gruß mit Nummer des Streams, letzte Folge, Album, Rekorde, Wiedersehen, runde Folgen
//   4. Spontan-Wetten: Angebot am Rand, mit der Hupe annehmen, Einsatz als Spende; ohne Annahme bleibt alles gleich
//   5. Baustelle: Gasse ohne Sprung, Baken, Spuren, Verkehr weicht aus; sauber durch wird gefeiert, Streifen zählt
//   6. Verkehrsmuster: Wohnmobil-Kolonne, Drängler, Schwertransport mit Begleitfahrzeug, Gruß an den reisenden Brunnen
import { readFileSync } from 'node:fs';
import { makeStream, DRIVERS } from './stream-sim.mjs';
import { mainSource } from './lib/main-source.mjs';
import { STUDIO, STAMM, INCOME, WETTEN_LINES, BAUSTELLE_LINES, MUSTER_LINES, CHAT } from '../src/data.js';
import { MANOEUVRE } from '../src/game/game.js';
import { Stammgaeste, cleanStamm, STAMM_CFG } from '../src/game/stamm.js';
import { startMemory, episodeMemory, rekordMemory } from '../src/game/gedaechtnis.js';
import { WETTE } from '../src/game/wetten.js';
import { BAU, BAU_LEN, bauGasse, bauShift, bauLaneClosed, bakenBetween } from '../src/world/baustelle-plan.js';
import { ROAD } from '../src/textures.js';

let fails = 0;
let checks = 0;
const ok = (cond, msg) => {
  checks++;
  if (!cond) {
    fails++;
    console.log('  FEHLER: ' + msg);
  }
};
const src = (f) => readFileSync(new URL(`../src/${f}`, import.meta.url), 'utf8');

// --- 1. Haarscharf --------------------------------------------------------------------------------------------------
{
  const S = makeStream({ driver: DRIVERS.zuegig, seed: 4, endless: true });
  const g = S.game;
  S.step(30);
  const feel = [];
  const clips = [];
  g.onFeel = (k, ms) => feel.push([k, ms]);
  g.audio.clip = (n) => clips.push(n);
  const chat0 = S.log.chat.length;
  for (let i = 0; i < 3; i++) {
    g.onNearMiss({ car: {}, clearance: 0.3, rel: 9 });
    S.step(2);
  }
  const serie = S.log.toast.find((x) => x.key === 'serie');
  ok(serie && /3× haarscharf in Folge/.test(serie.text), `Serie am Rand: ${serie && serie.text}`);
  ok(S.log.chat.slice(chat0).some((c) => /HATTRICK/.test(c.text)), 'HATTRICK im Chat fehlt');
  ok(feel.length === 3 && feel[2][0] > feel[0][0] && clips.join() === '1,2,3', `Impuls und Ton je Manöver: ${JSON.stringify(feel)} · ${clips}`);
  S.step(MANOEUVRE.window);
  const said = S.log.speak.filter((x) => x.who === 'studio' && x.t > 30).map((x) => x.text);
  const lob = STUDIO.praise.serie.map((l) => new RegExp('^' + l.replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace('{n}', '\\S+') + '$'));
  ok(said.some((t) => lob.some((r) => r.test(t))), `Das Studio lobt die Serie nicht (${said.join(' | ')})`);
  // kein Zischen: der Ton ist ein kurzer heller Klang aus Oszillatoren, kein Rauschen
  const audio = src('audio.js');
  const clip = audio.slice(audio.indexOf('  clip(n = 1) {'), audio.indexOf('  chime() {'));
  ok(/triangle/.test(clip) && !/noise|createBuffer|whoosh|zisch/i.test(clip), 'audio.js clip: kein reiner Ton (Rauschen?)');
  ok(/setFov\(58 \+ speedFov\(p\.kmh, dt\)\)/.test(mainSource()) && /tempoFeel/.test(src('ui/drive-settings.js')), 'Tempo-Gefühl: Blickwinkel oder Schalter fehlt');
}

// --- 2. Stammgäste ----------------------------------------------------------------------------------------------------
{
  const queue = [];
  const said = [];
  const g = { t: 0, save: { stamm: {} }, later: (at, fn) => queue.push({ at, fn }), chat: (text, name, o) => said.push({ text, name, badge: o && o.badge }) };
  const st = new Stammgaeste(g);
  const run = (seed, towns) => {
    queue.length = 0;
    said.length = 0;
    st.reset(seed);
    for (const town of towns) st.episode(town);
    for (const q of queue.sort((a, b) => a.at - b.at)) q.fn();
    return st.here.map((s) => s.name);
  };
  const first = run(11, ['Erlensee', 'Hanau']);
  ok(first.length >= STAMM_CFG.come[0] && first.length <= STAMM_CFG.come[1] && first.every((n) => STAMM.some((s) => s.name === n)), `Stammgäste im ersten Stream: ${first}`);
  const e0 = g.save.stamm[first[0]];
  ok(e0 && e0.n === 1 && e0.m === 1 && e0.b === 2 && e0.towns.join() === 'Erlensee,Hanau', `gezählt und gemerkt: ${JSON.stringify(e0)}`);
  ok(said.some((s) => s.name === first[0] && s.badge === '★1'), 'Abzeichen ★ und Monate fehlt im Chat');
  // viele Streams später: Die Treuen kommen wieder, wissen ihre Orte und sehen Erlensee wieder
  let again = null;
  for (let k = 0; k < 12; k++) {
    const who = run(100 + k, ['Erlensee']);
    if (who.includes(first[0])) again = said.slice();
  }
  const e1 = g.save.stamm[first[0]];
  ok(e1.n >= 2 && e1.m === e1.n && e1.towns[e1.towns.length - 1] === 'Erlensee' && new Set(e1.towns).size === e1.towns.length, `nach Streams: ${JSON.stringify(e1)}`);
  ok(again && again.some((s) => /Erlensee/.test(s.text)), 'Wiedersehen in Erlensee: kein Stammgast freut sich');
  const clean = cleanStamm({ [first[0]]: { n: 3.7, m: -1, b: 'x', towns: ['A', 4, '', 'B'] }, Fremder: { n: 9 } });
  ok(JSON.stringify(clean) === JSON.stringify({ [first[0]]: { n: 3, m: 0, b: 0, towns: ['A', 'B'] } }), `cleanStamm: ${JSON.stringify(clean)}`);
  ok(/stamm: cleanStamm\(data\.stamm\)/.test(src('save.js')), 'save.js lädt die Stammgäste nicht');
}

// --- 3. Gedächtnis des Studios ------------------------------------------------------------------------------------------
{
  ok(STUDIO.memory.erster.includes(startMemory({ stats: { runs: 0 } })), 'erster Stream: kein erster Gruß');
  const save = { stats: { runs: 6 }, album: { n: 25, list: [{ p: 'Hamburg', t: 5 }, { p: 'Hamburg', t: 5 }] }, best: { reise: 42500, earned: 812.6 } };
  const m = startMemory(save);
  ok(/\b7\b/.test(m) && m.split(/(?<=[.!?])\s/).length >= 2, `Gruß mit Nummer des Streams: ${m}`);
  const facts = [0, 1, 2, 3].map((r) => startMemory({ ...save, stats: { runs: 6 + r } })).join(' ');
  ok(/Hamburg/.test(facts) && /25/.test(facts) && /42,5|42 km/.test(facts) && /812/.test(facts), `Erinnerungen im Wechsel: ${facts}`);
  ok(startMemory(save) === m, 'Gedächtnis würfelt (soll aus den Zahlen folgen)');
  const list = [{ p: 'Hamburg' }, { p: 'Hamburg' }, { p: 'Hamburg' }];
  ok(/dreimal|zweimal|3/.test(episodeMemory({ album: { list } }, { n: 7, p: 'Hamburg' }, 'Hamburg') || ''), 'Wiedersehen mit einem Brunnen fehlt');
  ok(/50/.test(episodeMemory({ album: { list: [] } }, { n: 50, p: 'X' }, 'X') || ''), 'runde Folge 50 fehlt');
  ok(episodeMemory({ album: { list: [{ p: 'X' }] } }, { n: 8, p: 'X' }, 'X') === null, 'nach jeder Folge redet das Studio');
  ok(STUDIO.memory.streckenrekord.some((l) => rekordMemory(42500) === l.replace('{km}', '42,5 km') || rekordMemory(42500) === l), `Streckenrekord: ${rekordMemory(42500)}`);
}

// --- 4. Spontan-Wetten --------------------------------------------------------------------------------------------------
{
  ok(INCOME.Wetten === 'Wette', 'Abrechnung: Zeile Wetten fehlt');
  const run = (honk, seed = 2) => {
    const S = makeStream({ driver: DRIVERS.zuegig, seed, endless: true });
    const g = S.game;
    const rows = [];
    g.ui.wette = (r) => rows.push(r);
    for (let t = 0; t < 1200 && !g.over; t += 0.5) {
      S.step(0.5);
      if (honk && g.wetten.offer && g.t > g.wetten.offer.until - 9) g.honk();
    }
    return { S, g, rows };
  };
  const yes = run(true);
  const w = yes.g.wetten.stats;
  ok(w.offered >= 3 && w.taken === w.offered && w.won >= 1, `Wetten mit Annahme: ${JSON.stringify(w)}`);
  ok((yes.g.breakdown.Wetten || 0) > 0 && yes.S.log.chat.some((c) => c.name === 'James' && /Wette/.test(c.text)), `Einsatz als Spende: ${yes.g.breakdown.Wetten}`);
  const offers = yes.S.log.toast.filter((x) => x.key === 'wette' && /wettet/.test(x.text));
  ok(offers.length && offers.every((x) => !x.at.tv && !x.at.charging && /Hupen/.test(x.text)), 'Angebot während einer Folge oder ohne Hupen-Hinweis');
  ok(yes.rows.some((r) => r && r.progress >= 0 && /🎲/.test(r.text)) && yes.rows.at(-1) === null || yes.g.wetten.bet, 'Zeile der laufenden Wette unter den Jobs');
  // ohne Annahme: Der Stream verläuft genau wie ohne Wetten (eigener Zufall, keine Kasse)
  const no = run(false, 5);
  const off = (() => {
    const S = makeStream({ driver: DRIVERS.zuegig, seed: 5, endless: true });
    S.game.wetten.next = Infinity;
    S.game.wetten.update = () => {};
    for (let t = 0; t < 1200 && !S.game.over; t += 0.5) S.step(0.5);
    return S.game;
  })();
  ok(no.g.wetten.stats.offered >= 2 && no.g.wetten.stats.taken === 0 && !no.g.breakdown.Wetten, `Wetten ohne Annahme: ${JSON.stringify(no.g.wetten.stats)}`);
  ok(Math.abs(no.g.money - off.money) < 1e-6 && no.g.stats.donations === off.stats.donations, `Wetten verändern den Stream (${no.g.money.toFixed(2)} statt ${off.money.toFixed(2)})`);
  ok(WETTE.offer >= 10 && Object.keys(WETTEN_LINES.text).length === 4, 'Wetten: Angebotszeit oder Arten');
}

// --- 5. Baustelle ----------------------------------------------------------------------------------------------------------
{
  // die Gasse: ohne Sprung, nie schmaler als zwei schmale Spuren, in der Mitte um eine Spur nach links
  let jump = 0;
  let narrow = Infinity;
  let prev = bauGasse(0);
  for (let u = 0.5; u <= BAU_LEN; u += 0.5) {
    const G = bauGasse(u);
    jump = Math.max(jump, Math.abs(G.left - prev.left), Math.abs(G.right - prev.right));
    narrow = Math.min(narrow, G.right - G.left);
    prev = { ...G };
  }
  ok(jump < 0.06 && narrow >= 6.4, `Gasse: Sprung ${jump.toFixed(3)} m, schmalste Stelle ${narrow.toFixed(2)} m`);
  ok(Math.abs(bauShift(BAU_LEN / 2) + BAU.by) < 1e-9 && bauShift(5) === 0 && bauShift(BAU_LEN - 5) === 0, 'Verschwenkung in der Mitte');
  ok(bauLaneClosed(0, 300) && bauLaneClosed(1, 300) && !bauLaneClosed(2, 300) && !bauLaneClosed(3, 300) && !bauLaneClosed(0, -5) && !bauLaneClosed(0, BAU_LEN + 5), 'gesperrte Spuren');
  const baken = bakenBetween(0, BAU_LEN + 1);
  ok(baken.length > 100 && baken.every((b, i) => i === 0 || b.u >= baken[i - 1].u) && baken.every((b) => b.x > ROAD.left && b.x < ROAD.right), `Baken: ${baken.length}`);
  const sc = src('world/scenery.js');
  ok(/case 'baken':/.test(sc) && /case 'bauSchild':/.test(sc) && /makeBaken\(k\)/.test(sc), 'Szenerie: Baken oder Schild fehlen');

  // im Stream: angekündigt, mit Schild, Tempo 80 und Baken; der brave Fahrer kommt sauber durch
  const S = makeStream({ driver: DRIVERS.zuegig, seed: 1, endless: true });
  const g = S.game;
  const req = [];
  const reqOrig = g.scenery.request;
  g.scenery.request = (type, s, data) => (req.push({ type, s, data }), reqOrig(type, s, data));
  const lm = [];
  let links = 0;
  for (let t = 0; t < 1400 && !g.over; t += 0.5) {
    S.step(0.5);
    if (g.landmark && g.bau.zone) lm.push({ s: g.landmark.s, s0: g.bau.zone.s0 });
    // (die linken Spuren sind dort gesperrt: keine Freischaltung „Linke Spur frei“, solange eine Baustelle steht)
    if (g.bau.zone && g.left.open && g.player.s > g.bau.zone.s0 - 300) links++;
  }
  const b = g.bau.stats;
  ok(b.built >= 2 && b.clean >= 1 && b.touched === 0, `Baustellen im Stream: ${JSON.stringify(b)}`);
  ok(S.log.speak.some((x) => x.text === BAUSTELLE_LINES.omi), 'OMI kündigt die Baustelle nicht an');
  const s0 = req.find((r) => r.type === 'bauSchild');
  ok(s0 && req.some((r) => r.type === 'speed' && r.data.limit === 80) && req.filter((r) => r.type === 'baken').length === Math.ceil(BAU_LEN / 100) * b.built, `Schild, 80, Baken: ${req.map((r) => r.type).join(',')}`);
  ok(S.log.toast.some((x) => x.key === 'baustelle' && /ohne Kratzer/.test(x.text)), 'sauber durch: kein Hinweis am Rand');
  ok(links === 0, `„Linke Spur frei“ in der Baustelle (${links}×)`);
  ok(lm.every((x) => x.s < x.s0 - 1000 || x.s > x.s0 + BAU_LEN), 'Brunnen oder Elsa mitten in der Baustelle');

  // wer die Gasse nicht beachtet (bleibt rechts, fährt 130), streift Baken: das zählt und kostet Kratzer
  const R = makeStream({ driver: DRIVERS.zuegig, seed: 1, endless: true });
  const h = R.game;
  h.bau.steer = (want) => want;
  for (let t = 0; t < 900 && !h.over && !h.bau.stats.touched; t += 0.5) R.step(0.5);
  ok(h.bau.stats.touched >= 1 && R.log.toast.some((x) => x.key === 'baustelle' && /gestreift/.test(x.text)), `Baken streifen zählt nicht: ${JSON.stringify(h.bau.stats)}`);
  ok(h.player.damage.scraped > 0, 'Bake gestreift ohne Kratzer');
}

// --- 5b. und 6. Echter Verkehr (ohne Grafik, Leinwand als Attrappe) ---------------------------------------------------------
{
  const canvas = new Proxy({}, { get: (t, k) => (k === 'measureText' ? (x) => ({ width: String(x).length * 10 }) : k === 'getImageData' || k === 'createImageData' ? (...a) => ({ data: new Uint8ClampedArray(a[a.length - 2] * a[a.length - 1] * 4) }) : k.startsWith?.('create') ? () => ({ addColorStop() {} }) : k in t ? t[k] : () => {}), set: (t, k, v) => ((t[k] = v), true) });
  globalThis.document ??= { createElement: () => ({ width: 0, height: 0, getContext: () => canvas, style: {} }) };
  const { Traffic } = await import('../src/world/traffic.js');
  const { Vehicle, SCHWER_W } = await import('../src/models/vehicles.js');
  const env = { difficulty: 0.6, leftOpen: false, rain: 0 };
  const drive = (tr, P, secs, t0, each) => {
    let t = t0;
    for (let i = 0; i < secs * 30; i++) {
      P.s += P.speed / 30;
      const ev = tr.update(1 / 30, (t += 1 / 30), P, env);
      if (each) each(ev, t);
    }
    return t;
  };

  // Baustelle: Der Verkehr verlässt die linken Spuren, bleibt in der Gasse und fährt dort 80
  {
    const tr = new Traffic({ add() {} }, { emit() {} });
    const P = { s: 2000, x: ROAD.laneCenter(2), speed: 22, v: 22, len: 4.7, w: 1.9 };
    tr.update(1 / 30, 1, P, env);
    tr.populate(P.s, P.speed);
    tr.work = { s0: P.s + 900 };
    let wrong = 0;
    let out = 0;
    let fast = 0;
    let n = 0;
    drive(tr, P, 80, 1, () => {
      for (const c of tr.cars) {
        const u = c.s - tr.work.s0;
        if (u < 150 || u > BAU_LEN - 120) continue;
        n++;
        if (c.lane < 2 && !c.change) wrong++;
        const G = bauGasse(u);
        const x = c.x + bauShift(u);
        if (x - c.w / 2 < G.left - 0.05 || x + c.w / 2 > G.right + 0.05) out++;
        if (c.speed > 85 / 3.6) fast++;
      }
      // (der Spieler fährt in der Gasse mit)
      const u = P.s - tr.work.s0;
      P.x = ROAD.laneCenter(2) + (u > 0 && u < BAU_LEN ? bauShift(u) : 0);
    });
    ok(n > 500 && wrong === 0 && out === 0 && fast < n * 0.02, `Verkehr in der Baustelle: ${n} Proben, ${wrong} links, ${out} außerhalb der Gasse, ${fast} zu schnell`);
    ok(tr.draengler(P) === null, 'Drängler mitten in der Baustelle');
  }

  // Wohnmobil-Kolonne: vier hintereinander rechts, ohne Spurwechsel, nach einer Weile wieder wie alle
  {
    const tr = new Traffic({ add() {} }, { emit() {} });
    // (der Spieler fährt so schnell wie sie: Die Kolonne bleibt vor ihm in Sicht)
    const P = { s: 5000, x: ROAD.laneCenter(1), speed: 25.5, v: 25.5, len: 4.7, w: 1.9 };
    tr.update(1 / 30, 1, P, env);
    const k = tr.kolonne(P.s);
    ok(k.length === 4 && k.every((c) => c.kind === 'wohnmobil' && c.lane === 3 && c.behavior === 'kolonne'), `Kolonne: ${k.map((c) => c.kind + c.lane).join(',')}`);
    let t = drive(tr, P, 40, 1);
    ok(k.every((c) => c.lane === 3 && !c.change && c.behavior === 'kolonne'), 'Kolonne wechselt die Spur');
    t = drive(tr, P, 35, t);
    ok(k.every((c) => c.behavior === 'normal'), 'Kolonne endet nicht');
  }

  // Drängler: kommt von hinten auf die linke Spur, klebt und blinkt links; macht Mini Adam Platz, zieht er vorbei
  {
    const tr = new Traffic({ add() {} }, { emit() {} });
    const P = { s: 8000, x: ROAD.laneCenter(0), speed: 36, v: 36, len: 4.7, w: 1.9 };
    tr.update(1 / 30, 1, P, env);
    ok(tr.draengler({ ...P, x: ROAD.laneCenter(3) }) === null, 'Drängler hinter der rechten Spur');
    const d = tr.draengler(P);
    ok(d && d.lane === 0 && d.s < P.s && d.behavior === 'draengler', 'Drängler kommt nicht');
    let close = false;
    let t = drive(tr, P, 12, 1, () => (close = close || (d.close && d.v.blinkDir === -1)));
    ok(close, `Drängler klebt nicht (Abstand ${(P.s - d.s).toFixed(1)} m)`);
    P.x = ROAD.laneCenter(2);
    let passed = false;
    t = drive(tr, P, 15, t, () => (passed = passed || d.s > P.s + 10));
    ok(d.free && passed, `Drängler zieht nicht vorbei (frei ${d.free}, ${(d.s - P.s).toFixed(0)} m)`);
  }

  // Schwertransport: der Brunnen auf dem Tieflader, rechts mit 60, das Begleitfahrzeug mit Warnlicht dahinter
  {
    const tr = new Traffic({ add() {} }, { emit() {} });
    const P = { s: 9000, x: ROAD.laneCenter(1), speed: 33, v: 33, len: 4.7, w: 1.9 };
    tr.update(1 / 30, 1, P, env);
    const [a, b] = tr.schwertransport(P.s);
    ok(a.kind === 'schwer' && a.w === SCHWER_W && a.truck && a.lane === 3 && b.kind === 'begleit' && b.v.blinkDir === 2 && b.s < a.s, 'Schwertransport und Begleitfahrzeug');
    let pass = false;
    drive(tr, P, 60, 1, (ev) => (pass = pass || ev.some((e) => e.type === 'passSchwer')));
    ok(Math.abs(a.speed * 3.6 - 60) < 3 && a.lane === 3 && pass, `Schwertransport: ${(a.speed * 3.6).toFixed(0)} km/h, vorbei ${pass}`);
    const v = new Vehicle('schwer');
    const e = new Vehicle('begleit');
    ok(v.cargo && v.cargo.geometry.attributes.position.count > 200 && e.amber && e.amber.length === 2, 'Modelle: Brunnen auf dem Tieflader, Rundumleuchte');
  }

  // im Spiel: Ansage, Chat, und Hupen grüßt den reisenden Brunnen (einmal)
  {
    const tr = new Traffic({ add() {} }, { emit() {} });
    const S = makeStream({ driver: DRIVERS.mittel, seed: 3, endless: true, traffic: tr });
    const g = S.game;
    for (let i = 0; i < 400 && g.world.trip().section.kind !== 'ab'; i++) S.step(1);
    S.step(5);
    const started = g.muster.start('schwer');
    S.step(8);
    ok(started && S.log.speak.some((x) => x.text === MUSTER_LINES.omiSchwer), 'Schwertransport: keine Ansage');
    g.muster.schwer.car.s = g.player.s + 60;
    g.honk();
    g.honk();
    ok(g.muster.stats.gruss === 1 && S.log.toast.some((x) => x.key === 'schwer'), `Gruß an den reisenden Brunnen: ${g.muster.stats.gruss}`);
    S.step(3);
    ok(S.log.chat.some((c) => MUSTER_LINES.schwer.includes(c.text)) && S.log.chat.some((c) => MUSTER_LINES.gruss.includes(c.text)), 'Chat sieht den reisenden Brunnen nicht');
  }

  // von selbst: Muster kommen, und keines kurz vor einer Ausfahrt, die der Plan nimmt (man sähe es nie)
  {
    const tr = new Traffic({ add() {} }, { emit() {} });
    const S = makeStream({ driver: DRIVERS.zuegig, seed: 5, endless: true, traffic: tr });
    const g = S.game;
    const { MUSTER } = await import('../src/game/muster.js');
    // (der Fahrer der Prüfstände sieht echten Verkehr nicht und rempelt: Die Werkstatt soll die Fahrt hier nicht beenden)
    g.end = () => {};
    const offen = [];
    const start = g.muster.start.bind(g.muster);
    g.muster.start = (k) => {
      const r = start(k);
      if (r) offen.push({ k, s: g.player.s, ab: true });
      return r;
    };
    for (let t = 0; t < 1500 && !g.over; t += 0.5) {
      S.step(0.5);
      for (const o of offen) if (o.ab && g.offAutobahn && g.player.s < o.s + (MUSTER.clear?.[o.k] ?? 1500)) o.ab = false;
    }
    const st = g.muster.stats;
    ok(st.kolonne + st.draengler + st.schwer >= 3, `Muster im Stream: ${JSON.stringify(st)}`);
    const weg = offen.filter((o) => !o.ab);
    ok(weg.length === 0, `Muster kurz vor der Ausfahrt: ${JSON.stringify(weg)}`);
  }
}

ok(CHAT.nearMissSerie && CHAT.nearMissSerie.length >= 4, 'Chat zur Serie');
console.log(`spielspass-test: ${fails ? fails + ' Fehler' : 'alles gut'} (${checks} Prüfungen)`);
process.exit(fails ? 1 : 0);
