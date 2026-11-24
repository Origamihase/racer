// Prüfstand der Running Gags aus dem Stream des Eigentümers vom 21.11.2026 (src/game/gags.js und was sie zeigt):
// Herr Schönnbrun moderiert BrunnenTV (Bauchbinde, Logo, Hymne, Gruß im Chat, Album, Abspann), die Bezahlschranke, der
// Verein, Code ADAM, Geo-Tracker und Glotzometer, die Paketsuche, Schade Schokolade, der Mitleidskauf und die
// Mysterybox; dazu drei Punkte der Fahrt (das kleine Navi im Kärtchen der Drohnenansicht, Meter auf den letzten 1,5 km
// vor der Ausfahrt, der Tempomat am Blitzer) und die Grundregel aller Gags: Sie würfeln mit eigenem Zufall – ein
// Stream verläuft mit ihnen genauso wie ohne sie.
import { gameSource } from './lib/main-source.mjs';
import { readFileSync } from 'node:fs';
import { fmtNum, fmtCent } from '../src/util.js';
import { makeStream, DRIVERS } from './stream-sim.mjs';
import { SCHOENNBRUN, ABSPANN_REISE, GAGS, SHOP, shopPrice } from '../src/data.js';
import { TV } from '../src/world/xxl/brunnentv.js';
import { drawSchoennbrunLogo } from '../src/ui/schoennbrun.js';
import { StreamGags, GATE, VEREIN, CODE, TRACKER, PAKET, SCHADE, MITLEID, MYSTERY } from '../src/game/gags.js';
import { FACTS } from '../src/game/game.js';
import { thanksGroups } from '../src/ui/abspann.js';
import { UI } from '../src/ui/ui.js';
import { SCHRANKE, schrankeOf, buildSchranke } from '../src/world/xxl/schranke.js';
import { places } from '../src/map/graph.js';
import { STREET } from '../src/world/kit/layout.js';

let fails = 0;
let checks = 0;
const ok = (cond, msg) => {
  checks++;
  if (!cond) {
    fails++;
    console.log('  FEHLER: ' + msg);
  }
};
const read = (f) => readFileSync(new URL('../' + f, import.meta.url), 'utf8');
// der längste Hinweis am Rand, den die Prüfung der freien Sicht im Browser misst (tools/sicht-check.js): Kein Hinweis
// der Gags ist länger (in Zeichen), so bleibt auch er oben am Rand
const LONGEST_NOTICE = /der längste Hinweis des Spiels[^\n]*\n\s*clear\(\);\n\s*ui\.toast\('([^']+)'/.exec(read('tools/sicht-check.js'))[1];
const chars = (t) => [...t].length;

/** Fährt einen Stream, bis n Folgen BrunnenTV vorbei sind (höchstens secs Sekunden); liefert die Folgen [{ t0, t1 }]. */
function episodes(sim, n, secs = 1800) {
  const out = [];
  let tv = null;
  for (let t = 0; t < secs && out.length < n; t += 0.5) {
    sim.step(0.5);
    if (sim.game.tv && !tv) tv = { t0: sim.game.tv.t0, t1: Infinity };
    if (!sim.game.tv && tv) {
      tv.t1 = sim.game.t;
      out.push(tv);
      tv = null;
    }
  }
  return out;
}

// --- 1. Herr Schönnbrun: das Logo ----------------------------------------------------------------------------------
{
  // eine Zeichenfläche zum Mitschreiben: jeder Punkt, jeder Bogen, jede Schrift
  const pts = [];
  const calls = {};
  const ctx = new Proxy({}, {
    get: (t, k) => {
      if (k in t) return t[k];
      if (k === 'createLinearGradient' || k === 'createRadialGradient') return () => ({ addColorStop() {} });
      return (...a) => {
        calls[k] = (calls[k] || 0) + 1;
        if (k === 'arc' || k === 'ellipse') {
          const r = k === 'arc' ? a[2] : Math.max(a[2], a[3]);
          pts.push([a[0] - r, a[1] - r], [a[0] + r, a[1] + r]);
        } else if (k === 'moveTo' || k === 'lineTo') pts.push([a[0], a[1]]);
        else if (k === 'quadraticCurveTo' || k === 'bezierCurveTo') for (let i = 0; i < a.length; i += 2) pts.push([a[i], a[i + 1]]);
      };
    },
    set: (t, k, v) => ((t[k] = v), true),
  });
  const [x, y, s] = [10, 20, 60];
  drawSchoennbrunLogo(ctx, x, y, s);
  ok(!calls.fillText && !calls.strokeText, 'Logo: mit Schrift (die Bauchbinde nennt ihn)');
  ok(calls.save === 1 && calls.restore === 1, 'Logo: save/restore nicht paarweise');
  ok(calls.fill >= 15 && calls.stroke >= 4, `Logo: nur ${calls.fill} Flächen und ${calls.stroke} Striche`);
  const out = pts.filter(([px, py]) => px < x - 0.01 || px > x + s + 0.01 || py < y - 0.01 || py > y + s + 0.01);
  ok(out.length === 0, `Logo: ${out.length} Punkte außerhalb seines Quadrats`);
  // Plakette rund und mittig: der äußerste Bogen sitzt in der Mitte und füllt fast das ganze Quadrat
  const left = Math.min(...pts.map((q) => q[0]));
  const right = Math.max(...pts.map((q) => q[0]));
  ok(Math.abs(left - (x + s * 0.02)) < 0.01 && Math.abs(right - (x + s * 0.98)) < 0.01, `Logo: Plakette ${left.toFixed(2)}…${right.toFixed(2)}`);
  console.log(`  Logo: ${calls.fill} Flächen, ${calls.stroke} Striche, ohne Schrift, im Quadrat`);
}

// --- 1. Herr Schönnbrun: Bauchbinde, Album, Abspann, Hymne (im Quelltext) --------------------------------------------
{
  const ui = read('src/ui/ui.js');
  const css = read('docs/style.css');
  const album = read('src/ui/album.js');
  const audio = read('src/audio.js');
  ok(/schoennbrunBadge\(document, 'brunnentv-badge', \d+\)/.test(ui), 'ui.js: die Bauchbinde zeigt das Logo nicht');
  ok(/'brunnentv-host', logo, SCHOENNBRUN\.host\)/.test(ui), 'ui.js: die Bauchbinde nennt Herrn Schönnbrun nicht');
  ok(SCHOENNBRUN.host === 'mit Herrn Schönnbrun' && SCHOENNBRUN.name === 'Herr Schönnbrun', 'data.js: Schreibweise von Herrn Schönnbrun');
  ok((css.match(/\.brunnentv-badge\s*\{/g) || []).length === 2, 'style.css: das Logo hat nicht für beide Größen eine Regel');
  ok(/schoennbrunBadge\(document, 'album-badge', \d+\)/.test(album) && /SCHOENNBRUN\.host/.test(album), 'album.js: das Album nennt Herrn Schönnbrun nicht');
  ok(/schoennbrunHymne\(\)/.test(audio) && !/speak|lyrics|Text/.test(audio.slice(audio.indexOf('schoennbrunHymne()'), audio.indexOf('schoennbrunHymne()') + 1400)), 'audio.js: keine Hymne (oder eine mit Text)');
  const row = ABSPANN_REISE.find((r) => r[0] === 'BrunnenTV');
  ok(row && row[1].includes('mit Herrn Schönnbrun'), 'Abspann: BrunnenTV nennt Herrn Schönnbrun nicht');
  for (const g of SCHOENNBRUN.gruss) ok(/Schönnbrun|Hymne/.test(g) && g.length <= 48, `Gruß zu lang oder ohne Namen: ${g}`);
  ok(new Set(SCHOENNBRUN.gruss).size === SCHOENNBRUN.gruss.length && SCHOENNBRUN.gruss.length >= 6, 'Grüße: zu wenige oder doppelt');
}

// --- 1. Herr Schönnbrun: jede Folge im simulierten Stream ------------------------------------------------------------
{
  let all = 0;
  for (const seed of [2, 7]) {
    const sim = makeStream({ driver: DRIVERS.zuegig, seed, endless: true });
    const { game, log } = sim;
    const hymne = [];
    game.audio.schoennbrunHymne = () => hymne.push(game.t);
    const eps = episodes(sim, 2);
    ok(eps.length === 2, `Seed ${seed}: nur ${eps.length} Folgen`);
    for (const e of eps) {
      const inside = (t) => t >= e.t0 && t <= e.t1;
      const h = hymne.filter(inside);
      ok(h.length === 1 && Math.abs(h[0] - e.t0 - TV.card) < 0.1, `Seed ${seed}, Folge um ${e.t0.toFixed(0)} s: Hymne ${h.map((t) => (t - e.t0).toFixed(2)).join(', ') || 'nie'}`);
      const greet = log.chat.filter((m) => inside(m.t) && m.gag && SCHOENNBRUN.gruss.includes(m.text));
      ok(greet.length >= 1 && greet.length <= 2, `Seed ${seed}, Folge um ${e.t0.toFixed(0)} s: ${greet.length} Grüße an Herrn Schönnbrun`);
      ok(greet.every((m) => m.t >= e.t0 + TV.chat && m.t <= e.t0 + TV.chat + 3), `Seed ${seed}: Gruß zur falschen Zeit`);
      ok(new Set(greet.map((m) => m.text)).size === greet.length, `Seed ${seed}: derselbe Gruß zweimal`);
      const mega = log.speak.filter((x) => inside(x.t) && x.who === 'megafon');
      ok(mega.length >= 1 && mega.every((x) => x.label === SCHOENNBRUN.label), `Seed ${seed}: Megafon in der Folge ohne Herrn Schönnbrun`);
      all++;
    }
    ok(log.chat.filter((m) => m.gag && SCHOENNBRUN.gruss.includes(m.text) && !eps.some((e) => m.t >= e.t0 && m.t <= e.t1)).length === 0, `Seed ${seed}: Gruß an Herrn Schönnbrun außerhalb einer Folge`);
  }
  console.log(`  Herr Schönnbrun: ${all} Folgen mit Hymne bei ${TV.card} s, Gruß im Chat, Megafon „${SCHOENNBRUN.label}“`);
}

// --- 2. Bezahlschranke: wo sie steht --------------------------------------------------------------------------------
{
  const towns = places.filter((p) => schrankeOf({ kind: 'stadt', place: p.i, s0: 0, s1: 500 }));
  ok(towns.length > places.length * 0.15 && towns.length < places.length * 0.25, `Schranke in ${towns.length} von ${places.length} Orten`);
  ok(towns.some((p) => p.name === 'Hanau'), 'Hanau (erster Ort vieler Fahrten) ohne Schranke');
  ok(!schrankeOf({ kind: 'stadt', place: 165, s0: 0, s1: 500, start: true }) && !schrankeOf({ kind: 'park', place: 165, s0: 0, s1: 500 }) && !schrankeOf({ kind: 'ab', s0: 0, s1: 500 }), 'Schranke im Startort, im Ladepark oder auf der Autobahn');
  // hinter der Ortstafel (u 6), vor der ersten Laterne (ab u 14); Pfosten auf dem Streifen, Arm über der eigenen Spur
  ok(SCHRANKE.u > 6 + 2 && SCHRANKE.u < 14 - 1, `Schranke bei u ${SCHRANKE.u}`);
  ok(SCHRANKE.x > STREET.curbR + 0.2 && SCHRANKE.x < STREET.curbR + STREET.strip - 0.3, `Pfosten bei x ${SCHRANKE.x}`);
  const tip = SCHRANKE.x - SCHRANKE.arm;
  ok(tip < STREET.lane - 1.2 && tip > (STREET.lane + STREET.other) / 2, `Arm reicht bis x ${tip.toFixed(2)} (eigene Spur ${STREET.lane}, Gegenspur ${STREET.other})`);
  const rig = buildSchranke();
  ok(rig.k === 1, 'Schranke steht nicht offen da');
  const tipY = () => {
    rig.group.updateMatrixWorld(true);
    let y = -Infinity;
    rig.group.traverse((o) => {
      if (!o.isMesh || o.parent === rig.group) return;
      o.geometry.computeBoundingBox();
      const b = o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld);
      y = Math.max(y, b.max.y);
    });
    return y;
  };
  ok(tipY() > SCHRANKE.arm * 0.9, `Offen ragt der Arm nur bis ${tipY().toFixed(2)} m`);
  rig.set(0);
  ok(Math.abs(tipY() - SCHRANKE.h - 0.075) < 0.05, `Zu liegt der Arm nicht waagrecht (${tipY().toFixed(2)} m)`);
  console.log(`  Bezahlschranke: in ${towns.length} Orten (u ${SCHRANKE.u} m, Arm bis x ${tip.toFixed(2)}), offen bis ${(SCHRANKE.h + SCHRANKE.arm).toFixed(1)} m hoch`);
}

/**
 * Ein Spiel zum Prüfen der Gags ohne Welt und Grafik: Spielzeit, Warteschlange, Chat, Spenden, OMI, der Wagen auf
 * einer geraden Fahrt durch die Abschnitte secs (mit Schranke: world.gate merkt sich die Stellung je Abschnitt).
 */
function fakeGame(secs, { gate = true } = {}) {
  const g = {
    t: 0, queue: [], chat: [], donations: [], omi: [], gates: new Map(), tv: null, charging: false, viewers: 500, funkloch: 0,
    player: { s: 0, speed: 0, kmh: 0 },
    fits: () => true,
    world: { trip: () => ({ cur: { sections: secs }, section: { kind: 'ab' } }) },
    ui: { chat: (m) => g.chat.push({ t: g.t, ...m }), toast() {} },
    audio: { pling() {} },
    cockpit: {},
    later: (d, fn) => g.queue.push({ at: g.t + d, fn }),
    donate: (name, amount, what, o) => g.donations.push({ t: g.t, name, amount, what, line: o.line }),
    say: (text, mood, o) => g.omi.push({ t: g.t, text, o }),
  };
  if (gate) g.world.gate = (sec, k) => g.gates.set(sec, Math.min(1, Math.max(0, k)));
  g.gags = new StreamGags(g);
  g.step = (dt, accel = 0) => {
    g.t += dt;
    const due = g.queue.filter((q) => q.at <= g.t);
    g.queue = g.queue.filter((q) => q.at > g.t);
    for (const q of due) q.fn();
    g.player.speed = Math.max(0, Math.min(75, g.player.speed + accel * dt));
    g.player.kmh = g.player.speed * 3.6;
    g.player.s += g.player.speed * dt;
    g.gags.update(dt);
  };
  return g;
}

// --- 2. Bezahlschranke: sie hält niemanden auf, ist selten, und der Chat zahlt -------------------------------------
{
  const town = (s0) => ({ kind: 'stadt', place: 165, s0, s1: s0 + 500 });
  let played = 0;
  let worst = Infinity;
  for (const [v0, acc] of [[3, 0], [8, 0], [14, 0], [25, 0], [40, 0], [75, 0], [4, 6], [10, 9], [0, 4]]) {
    for (let seed = 1; seed <= 12; seed++) {
      const sec = town(3000);
      const g = fakeGame([sec]);
      g.gags.reset(seed);
      g.t = 60;
      g.player.speed = v0;
      g.player.s = sec.s0 + SCHRANKE.u - 2000;
      let kAt = null;
      let tAt = null;
      let paid = null;
      while (g.player.s < sec.s0 + SCHRANKE.u + 50 && g.t < 2000) {
        g.step(1 / 30, acc);
        if (g.player.speed === 0 && acc === 0) g.player.speed = v0;
        if (paid === null && g.donations.length) paid = g.t;
        // die Front des Wagens (gut 2 m vor seiner Mitte) erreicht den Arm
        if (kAt === null && g.player.s + 2.5 >= sec.s0 + SCHRANKE.u) {
          kAt = g.gates.has(sec) ? g.gates.get(sec) : 1;
          tAt = g.t;
        }
      }
      if (!g.gates.has(sec)) continue;
      played++;
      ok(kAt === 1, `Tempo ${v0} m/s (+${acc} m/s²), Saat ${seed}: Schranke bei der Ankunft ${kAt.toFixed(2)} offen`);
      ok(paid !== null && g.donations.length === 1 && g.donations[0].amount >= 0.5 && g.donations[0].amount <= 2, `Saat ${seed}: Spende ${JSON.stringify(g.donations)}`);
      worst = Math.min(worst, tAt - (paid + GATE.open));
      ok(g.gates.get(sec) === 1, 'Schranke nach der Durchfahrt nicht offen');
      const spam = g.chat.filter((m) => GAGS.schranke.spam.includes(m.text));
      ok(spam.length >= 2 && spam.length <= 3 && spam.every((m) => m.gag), `Saat ${seed}: ${spam.length} Rufe „Bezahlschranke“`);
      ok(g.omi.length === 1 && g.omi[0].text === GAGS.schranke.omi && g.omi[0].o.priority === false, 'OMI zur Schranke: nicht genau einmal, oder mit Vorrang');
      ok(/Bezahlschranke – Schranke auf!/.test(g.donations[0].line) && g.donations[0].line.includes(g.donations[0].name), `James: ${g.donations[0].line}`);
    }
  }
  ok(played > 60, `Schranke nur ${played}× gespielt`);
  ok(worst > 2.5, `Schranke ist nur ${worst.toFixed(2)} s vor dem Wagen ganz offen`);
  // selten: höchstens eine je GATE.gap Sekunden, nie in den ersten GATE.first Sekunden; ohne world.gate gibt es keine
  {
    const secs = [];
    for (let i = 0; i < 40; i++) secs.push(town(1000 + i * 700));
    const g = fakeGame(secs);
    g.gags.reset(3);
    g.player.speed = 14;
    const starts = [];
    while (g.player.s < 1000 + 40 * 700 && g.t < 5000) {
      const n = g.donations.length;
      g.step(1 / 10);
      if (g.donations.length > n) starts.push(g.t);
    }
    const gaps = starts.slice(1).map((t, i) => t - starts[i]);
    ok(starts.length >= 4 && starts[0] > GATE.first && gaps.every((d) => d >= GATE.gap - 1), `Schranken um ${starts.map((t) => t.toFixed(0)).join(', ')} s`);
    const off = fakeGame(secs, { gate: false });
    off.player.speed = 14;
    for (let i = 0; i < 20000; i++) off.step(1 / 10);
    ok(off.donations.length === 0 && !off.chat.some((m) => GAGS.schranke.spam.includes(m.text)), 'Ohne Schranken in der Welt spielt der Gag doch');
    console.log(`  Bezahlschranke: ${played} Durchfahrten (3–75 m/s, auch beschleunigend) – offen spätestens ${worst.toFixed(1)} s vor dem Wagen; ${starts.length} in ${(g.t / 60).toFixed(0)} min durch 40 Schranken-Orte`);
  }
}

// --- 3. Der Verein: gegründet, Beitritte, Zahl nur in der Abrechnung, Namen im Abspann ----------------------------
{
  const G = GAGS.verein;
  let joins = 0;
  for (const seed of [4, 9]) {
    const sim = makeStream({ driver: DRIVERS.mittel, seed, endless: true });
    const { game, log } = sim;
    sim.step(1800);
    const james = log.chat.filter((m) => m.bot === 'james' && m.gag);
    const found = james.filter((m) => m.text === G.gruendung);
    ok(found.length === 1 && found[0].t >= VEREIN.found[0] && found[0].t <= VEREIN.found[1] + 15, `Seed ${seed}: Gründung ${found.map((m) => m.t.toFixed(0)).join(', ')}`);
    // (wer in den letzten Sekunden beitreten will, wird erst danach begrüßt)
    const asks = log.chat.filter((m) => m.gag && G.beitreten.includes(m.text) && m.t < game.t - 2);
    const welcome = G.willkommen.map((w) => new RegExp('^' + w.replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace('{name}', '(.+)') + '$'));
    const hellos = james.filter((m) => welcome.some((re) => re.test(m.text)) && m.t < game.t - 0.1);
    const members = game.gags.report().verein.members;
    ok(asks.length >= 12 && hellos.length === asks.length && members.length >= asks.length && members.length <= asks.length + 1, `Seed ${seed}: ${asks.length} Anträge, ${hellos.length} Begrüßungen, ${members.length} Mitglieder in 30 min`);
    ok(new Set(members).size === members.length, `Seed ${seed}: ein Mitglied doppelt`);
    asks.forEach((a, i) => {
      const h = hellos[i];
      ok(h && h.t - a.t >= 1.1 - 1e-9 && h.t - a.t <= 1.8 + 0.05 && h.text.includes(a.name) && members[i] === a.name, `Seed ${seed}: Antrag von ${a.name} um ${a.t.toFixed(0)} s, Begrüßung ${h && h.text}`);
      ok(!/\d/.test(h ? h.text.replace(a.name, '') : ''), `Seed ${seed}: James nennt eine Zahl: ${h && h.text}`);
      if (i) ok(a.t - asks[i - 1].t >= VEREIN.join[0] * (1 - 0.44) - 0.1, `Seed ${seed}: Beitritte nach ${(a.t - asks[i - 1].t).toFixed(1)} s`);
    });
    ok(asks.every((a) => !a.at.tv && !a.at.charging), `Seed ${seed}: Beitritt mitten in einer Szene`);
    // weder Abrechnung noch Abspann nennen den Verein (Eigentümer, 23./24.11.2026: komplett raus)
    const F = game.supporters();
    ok(!thanksGroups(F).some((x) => x.id === 'verein' || x.title === G.name), `Seed ${seed}: der Verein steht im Abspann`);
    joins += members.length;
  }
  ok(!/Vereinsmitglieder|gags\?\.verein/.test(read('src/ui/menus.js')), 'menus.js: Abrechnung oder Abspann nennen den Verein (Eigentümer, 24.11.2026: komplett raus)');
  ok(/gags: this\.gags\.report\(\)/.test(gameSource()), 'game.js: Game.end gibt den Gags nichts mit');
  ok(thanksGroups({}).length === 0 && !thanksGroups({ verein: null }).some((x) => x.id === 'verein'), 'Abspann: Verein ohne Gründung');
  console.log(`  Verein „${G.name}“: ${joins} Beitritte in 2 × 30 min, James begrüßt jeden ohne Zahl, Abrechnung und Abspann nennen ihn nicht`);
}

// --- 4. Nur mit Code ADAM: die Plüschbrause im Shop und im Chat -----------------------------------------------------
{
  const coded = SHOP.filter((x) => x.code);
  const it = SHOP.find((x) => x.id === 'brause');
  ok(coded.length === 1 && it && it.code.name === 'ADAM' && it.code.off === 10 && it.cat === 'Spaß', 'Shop: Code ADAM nicht genau an der Plüschbrause-Kiste');
  ok(shopPrice(it, 0) === 171 && it.prices[0] === 190, `Shop: Plüschbrause kostet ${shopPrice(it, 0)} statt 171 €`);
  ok(SHOP.filter((x) => !x.code).every((x) => x.prices.every((p, l) => shopPrice(x, l) === p)), 'Shop: ein Artikel ohne Code kostet anders');
  const menus = read('src/ui/menus.js');
  const main = read('src/main.js');
  ok(/const price = shopPrice\(it, lvl\);/.test(menus) && /'shop-code-tag', code, `Code \$\{it\.code\.name\} −\$\{it\.code\.off\}\\u00a0%`/.test(menus) && /el\('s', '', code, fmtEuro\(it\.prices\[lvl\]\)\)/.test(menus), 'menus.js: der Shop zeigt den Code nicht (oder rechnet anders)');
  ok(/const price = shopPrice\(it, lvl\);/.test(main), 'main.js: der Kauf rechnet ohne Code');
  ok(/\.shop-code \{/.test(read('docs/style.css')), 'style.css: kein Aussehen für den Code');
  // die Wirkung: der Zuckerschub nach dem Ladestopp hält 10 statt 6 s
  for (const [up, want] of [[{}, 6], [{ brause: 1 }, 10]]) {
    const sim = makeStream({ driver: DRIVERS.mittel, seed: 2, upgrades: up });
    sim.step(5);
    sim.game.sugarDue = true;
    sim.game.offAutobahn = false;
    sim.game.update(1 / 30, { steer: 0, throttle: 0, brake: 0 }, null);
    ok(Math.abs(sim.p.sugar - want) < 0.1, `Zuckerschub mit ${JSON.stringify(up)}: ${sim.p.sugar.toFixed(2)} s statt ${want}`);
  }
  // im Chat: erst nach CODE.first, dann alle CODE.every Sekunden (nie in einer Szene), manchmal eine Antwort
  const C = GAGS.code;
  let n = 0;
  for (const seed of [3, 8]) {
    const sim = makeStream({ driver: DRIVERS.zuegig, seed, endless: true });
    sim.step(2400);
    const lines = sim.log.chat.filter((m) => m.gag && C.chat.includes(m.text));
    const replies = sim.log.chat.filter((m) => m.gag && C.antwort.includes(m.text));
    const gaps = lines.slice(1).map((m, i) => m.t - lines[i].t);
    ok(lines.length >= 5 && lines.length <= 14 && lines[0].t >= CODE.first[0] && gaps.every((d) => d >= CODE.every[0] - 0.1), `Seed ${seed}: Code ADAM um ${lines.map((m) => m.t.toFixed(0)).join(', ')} s`);
    ok(lines.every((m) => !m.at.tv && !m.at.charging), `Seed ${seed}: Code ADAM mitten in einer Szene`);
    ok(replies.every((r) => lines.some((m) => r.t - m.t >= 1.2 - 1e-9 && r.t - m.t <= 2.6 + 0.05)) && replies.length <= lines.length, `Seed ${seed}: ${replies.length} Antworten auf ${lines.length} Erinnerungen`);
    n += lines.length;
  }
  ok(C.chat.every((l) => /Code ADAM|CODE ADAM/.test(l)) && C.chat.filter((l) => /10 %/.test(l)).length >= 3, 'Code ADAM: eine Zeile ohne Code');
  console.log(`  Code ADAM: Plüschbrause-Kiste 190 € → ${shopPrice(it, 0)} €, Zuckerschub 10 s; ${n} Erinnerungen in 2 × 40 min`);
}

// --- 5. Geo-Tracker und Glotzometer: was sie sagen, stimmt ----------------------------------------------------------
{
  const T = GAGS.tracker;
  const tags = (l) => (l.startsWith('[') ? l.slice(1, l.indexOf(']')).split(' ') : []);
  // jede Zeile der Gags, die etwas über den Moment behauptet, trägt ihr Stichwort (und nur bekannte)
  const all = Object.entries(GAGS).flatMap(([k, v]) => Object.entries(v).flatMap(([j, x]) => (Array.isArray(x) ? x.filter((l) => typeof l === 'string').map((l) => [k + '.' + j, l]) : typeof x === 'string' ? [[k + '.' + j, x]] : [])));
  for (const [where, l] of all) {
    ok(tags(l).every((k) => k in FACTS), `${where}: unbekanntes Stichwort in „${l}“`);
    if (/Geo-Tracker|gleich in|kommt gleich/.test(l)) ok(tags(l).includes('gleich'), `${where}: „${l}“ ohne Stichwort gleich`);
    if (/Glotzometer.*\{n\}|\{n\}.*(Zuschauer|zu|Leute)/.test(l)) ok(tags(l).includes('glotz'), `${where}: „${l}“ ohne Stichwort glotz`);
  }
  let geo = 0;
  let glotz = 0;
  for (const seed of [1, 6]) {
    const sim = makeStream({ driver: DRIVERS.mittel, seed, endless: true });
    const { game } = sim;
    const said = [];
    const say = game.gags.say.bind(game.gags);
    game.gags.say = (text, name) => {
      said.push({ t: game.t, text, next: game.gags.nextTown(), viewers: fmtNum(Math.round(game.viewers)), gleich: FACTS.gleich(game), glotzOk: FACTS.glotz(game), scene: !!(game.tv || game.charging) });
      say(text, name);
    };
    sim.step(2400);
    const g1 = said.filter((x) => /Geo-Tracker/.test(x.text));
    const g2 = said.filter((x) => /Glotzometer/.test(x.text));
    for (const x of g1) ok(x.gleich && x.next && x.text.includes(x.next.name) && x.next.d <= TRACKER.near, `Seed ${seed}: „${x.text}“ um ${x.t.toFixed(0)} s, voraus ${x.next ? x.next.name + ' in ' + x.next.d.toFixed(0) + ' m' : 'nichts'}`);
    for (const x of g2) ok(x.glotzOk && x.text.includes(x.viewers) && !x.scene, `Seed ${seed}: „${x.text}“ bei ${x.viewers} Zuschauern`);
    ok(g1.length >= 1 && g2.length >= 4, `Seed ${seed}: ${g1.length} Meldungen des Geo-Trackers, ${g2.length} des Glotzometers in 40 min`);
    ok(g1.slice(1).every((x, i) => x.t - g1[i].t >= TRACKER.gap - 0.1), `Seed ${seed}: Geo-Tracker zu oft`);
    ok(said.every((x) => !/\[/.test(x.text)), `Seed ${seed}: ein Stichwort steht im Chat`);
    geo += g1.length;
    glotz += g2.length;
  }
  ok(geo >= 3, `Geo-Tracker nur ${geo}× in 2 × 40 min`);
  ok(/' · Quelle: ' \+ GAGS\.tracker\.seite/.test(read('src/ui/menus.js')), 'menus.js: die Einschaltquote nennt das Glotzometer nicht');
  console.log(`  Tracker: ${geo} Meldungen des Geo-Trackers (immer der nächste Ort voraus), ${glotz} des ${T.seite} (immer die Zuschauerzahl) in 2 × 40 min`);
}

// --- 6. Das Leid mit der Paketsuche: Schritt für Schritt, nie dort, wo er ist; Abholung an der Packstation ---------
{
  const P = GAGS.paket;
  const texts = JSON.stringify(GAGS);
  ok(!/\b(DHL|Hermes|DPD|GLS|UPS|FedEx|Amazon|Deutsche Post|Packstation 24)\b/i.test(texts) && /Schneckenpost/.test(P.schritte[0]), 'Paketsuche: ein echter Zusteller');
  const pattern = (l) => new RegExp('^' + l.replace(/^\[[^\]]*\] /, '').replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace('{stadt}', '(.+)') + '$');
  const steps = P.schritte.map(pattern);
  let chains = 0;
  for (const seed of [2, 5]) {
    const sim = makeStream({ driver: DRIVERS.zuegig, seed, endless: true });
    const { game } = sim;
    const said = [];
    const say = game.gags.say.bind(game.gags);
    game.gags.say = (text, name) => {
      said.push({ t: game.t, text, name, here: sim.trip.section.kind === 'stadt' ? places[sim.trip.section.place].name : null, kmh: game.player.kmh, target: game.navi.target ? game.navi.target.name : null, scene: !!(game.tv || game.charging) });
      say(text, name);
    };
    sim.step(3600);
    const fuchs = said.filter((x) => x.name === P.fuchs);
    let next = 0;
    for (const x of fuchs) {
      if (x.text === P.zurueck) {
        ok(next === 5, `Seed ${seed}: zurück an den Absender nach Schritt ${next}`);
        next = 0;
        continue;
      }
      const k = steps.findIndex((re) => re.test(x.text));
      // nach der Packstation geht es von vorn los, wenn Mini Adam das Paket abgeholt hat (James meldet es)
      const picked = sim.log.chat.filter((m) => m.bot === 'james' && /^📦 Paket aus der Packstation in .+ abgeholt!/.test(m.text) && m.t < x.t && m.t > (said.filter((y) => y.t < x.t && steps[4].test(y.text)).pop()?.t ?? Infinity));
      if (next === 5 && picked.length === 1) next = 0;
      ok(k === next, `Seed ${seed}: „${x.text}“ als Schritt ${k}, erwartet ${next}`);
      const m = steps[k]?.exec(x.text);
      if (k === 1) ok(places.some((p) => p.name === m[1] && p.pop >= 100000), `Seed ${seed}: Paketzentrum in ${m[1]}`);
      if (k === 2 || k === 4) ok(places.some((p) => p.name === m[1]) && m[1] !== x.here, `Seed ${seed}: „${x.text}“ – und der Wagen ist in ${x.here}`);
      if (k === 3) ok(x.kmh >= 3, `Seed ${seed}: Zustellversuch, während der Wagen steht`);
      if (k === 4 && x.target) ok(m[1] === x.target, `Seed ${seed}: Packstation in ${m[1]}, Navi-Ziel ${x.target}`);
      ok(!x.scene, `Seed ${seed}: Paketsuche mitten in einer Szene`);
      next = k + 1;
      if (k === 0) chains++;
    }
    ok(fuchs.length >= 5, `Seed ${seed}: nur ${fuchs.length} Meldungen von ${P.fuchs} in 60 min`);
    ok(fuchs.length && fuchs[0].t >= PAKET.first[0], `Seed ${seed}: Paket zu früh`);
  }
  // Abholung: liegt das Paket in der Packstation am Navi-Ziel und läuft dort eine Folge, holt Mini Adam es danach ab
  const g = fakeGame([]);
  g.navi = { target: { place: 165, name: 'Hanau' } };
  g.player.speed = 20;
  g.player.kmh = 72;
  g.gags.paket.due = 0;
  for (let i = 0; i < 5; i++) {
    g.gags.paket.due = 0;
    g.step(0.1);
  }
  ok(g.chat.some((m) => m.name === P.fuchs && m.text === '📦 Paket liegt jetzt in der Packstation in Hanau'), `Packstation: ${g.chat.filter((m) => m.name === P.fuchs).map((m) => m.text).join(' | ')}`);
  g.tv = { place: 165 };
  for (let i = 0; i < 30; i++) g.step(0.1);
  ok(!g.chat.some((m) => /abgeholt/.test(m.text)), 'Paket schon während der Folge abgeholt');
  g.tv = null;
  for (let i = 0; i < 40; i++) g.step(0.1);
  const got = g.chat.filter((m) => m.bot === 'james' && /^📦 Paket aus der Packstation in Hanau abgeholt! Drin: .+ 🎉$/.test(m.text));
  ok(got.length === 1 && g.chat.some((m) => P.jubel.includes(m.text)) && g.gags.paket.n === 1 && !g.gags.paket.pack, `Abholung: ${got.map((m) => m.text).join(' | ')}`);
  console.log(`  Paketsuche: ${chains} Sendungen in 2 × 60 min, Schritt für Schritt, das Paket nie im Ort des Wagens; Abholung in Hanau: ${got[0] ? got[0].text : '—'}`);
}

// --- 7. Schade Schokolade: wenn etwas schiefgeht, höchstens alle SCHADE.gap Sekunden --------------------------------
{
  const game = gameSource();
  const at = (kind, before) => {
    const i = game.indexOf(`this.gags.fail('${kind}');`);
    return i > 0 && game.slice(Math.max(0, i - 400), i).includes(before);
  };
  ok(at('ausfahrt', "if (e.wrong && e.planned === 'exit') {"), 'game.js: verpasste Ausfahrt ohne Schade Schokolade');
  ok(at('fenster', 'A.warned = true;'), 'game.js: leeres Bieterfenster ohne Schade Schokolade');
  ok(at('rempler', 'if (!p.collide(e)) return;'), 'game.js: Rempler ohne Schade Schokolade');
  ok(at('blitzer', 'this.stats.photos++;'), 'game.js: Blitzer ohne Schade Schokolade');
  const g = fakeGame([]);
  const calls = [];
  for (let i = 0; i < 400; i++) {
    g.step(7.5);
    calls.push(g.t);
    g.gags.fail(['ausfahrt', 'fenster', 'rempler', 'blitzer'][i % 4]);
  }
  for (let i = 0; i < 40; i++) g.step(0.5);
  const lines = g.chat.filter((m) => GAGS.schade.includes(m.text));
  const gaps = lines.slice(1).map((m, i) => m.t - lines[i].t);
  ok(lines.every((m) => m.gag && calls.some((t) => m.t - t >= SCHADE.delay[0] - 7.6 && m.t - t <= SCHADE.delay[1] + 7.6)), 'Schade Schokolade ohne Anlass');
  ok(gaps.every((d) => d >= SCHADE.gap - 7.6), `Schade Schokolade zu oft: ${Math.min(...gaps).toFixed(1)} s`);
  ok(lines.length > 60 && lines.length < 120, `Schade Schokolade ${lines.length}× auf 400 Pannen im Abstand von 7,5 s`);
  g.gags.on = false;
  const before = g.chat.length;
  g.step(60);
  g.gags.fail('rempler');
  g.step(5);
  ok(g.chat.length === before, 'Schade Schokolade bei abgeschalteten Gags');
  // im simulierten Stream: nach leeren Bieterfenstern
  const sim = makeStream({ driver: DRIVERS.troedler, seed: 3, endless: true });
  const fails = [];
  const fail = sim.game.gags.fail.bind(sim.game.gags);
  sim.game.gags.fail = (kind) => (fails.push({ t: sim.game.t, kind }), fail(kind));
  sim.step(2400);
  const said = sim.log.chat.filter((m) => m.gag && GAGS.schade.includes(m.text));
  ok(said.every((m) => fails.some((f) => m.t - f.t >= SCHADE.delay[0] - 1e-6 && m.t - f.t <= SCHADE.delay[1] + 0.05)), 'Stream: Schade Schokolade ohne Panne davor');
  console.log(`  Schade Schokolade: ${lines.length}× auf 400 Pannen (höchstens alle ${SCHADE.gap} s); im Stream des Trödlers ${said.length}× auf ${fails.length} Pannen (${[...new Set(fails.map((f) => f.kind))].join(', ') || '–'})`);
}

// --- 7 Ende

// --- 8. Mitleidskauf: im Ort vor einem kleinen Laden stehen bleiben ---------------------------------------------
{
  // ein Ort mit Plan: rechts eine Bäckerei bei u 200, eine Bank bei u 260 (kein Mitleidskauf), links ein Kiosk bei u 300
  const mk = () => {
    const town = { kind: 'stadt', place: 165, s0: 1000, s1: 1800 };
    const g = fakeGame([town]);
    const items = [{ name: 'shopBakery', x: 16, z: -200 }, { name: 'shopBank', x: 16, z: -260 }, { name: 'shopKiosk', x: -9, z: -300 }, { name: 'shopBooks', x: 16, z: -500 }];
    Object.assign(g, { money: 100, breakdown: {}, halt: null, navi: { stopping: null }, eco: { n: 0, cheer: (k) => k === 'mitleid' && g.eco.n++ }, toasts: [], pops: [] });
    Object.assign(g.world, { town: (sec) => (sec === town ? { plan: { items } } : null), stopping: () => false, trip: () => ({ cur: { sections: [town] }, section: g.player.s >= town.s0 && g.player.s < town.s1 ? town : { kind: 'zub' } }) });
    g.audio.coin = () => {};
    g.ui.money = (v, label) => g.pops.push({ v, label });
    g.ui.toast = (text) => g.toasts.push(text);
    return { g, town };
  };
  const standAt = (g, s, secs) => {
    g.player.s = s;
    g.player.speed = 0;
    g.player.kmh = 0;
    for (let i = 0; i < Math.round(secs * 10); i++) g.step(0.1);
  };
  {
    const { g, town } = mk();
    g.t = 100;
    standAt(g, town.s0 + 207, 1.3);
    ok(g.gags.mitleid.n === 0, 'Mitleidskauf schon nach 1,3 s');
    standAt(g, town.s0 + 207, 0.5);
    ok(g.gags.mitleid.n === 1, 'Kein Mitleidskauf vor der Bäckerei');
    const m = g.gags.mitleid;
    const toast = g.toasts[0] || '';
    const [where, things] = GAGS.mitleid.laeden.shopBakery;
    ok(where === 'in der Bäckerei' && things.some((w) => new RegExp(`^🛍️ Mitleidskauf ${where}: ${w} · −\\d+,\\d0\\s€$`).test(toast)), `Mitleidskauf: ${toast}`);
    ok(m.sum >= 2 && m.sum <= 5 && Math.abs(g.money - (100 - m.sum)) < 1e-9 && Math.abs(g.breakdown['Mitleidskäufe'] + m.sum) < 1e-9 && g.pops[0].v === -m.sum && g.eco.n === 1, `Mitleidskauf: ${m.sum} €, Kasse ${g.money}, Abrechnung ${g.breakdown['Mitleidskäufe']}`);
    standAt(g, town.s0 + 207, 3);
    const chat = g.chat.filter((x) => GAGS.mitleid.chat.includes(x.text));
    ok(chat.length >= 1 && chat.length <= 2 && chat.every((x) => x.gag), `Mitleidskauf: ${chat.length} Zeilen im Chat`);
    // einmal je Ort: auch vor dem Buchladen weiter hinten nicht noch einmal
    g.t += MITLEID.gap;
    standAt(g, town.s0 + 500, 3);
    ok(g.gags.mitleid.n === 1, 'Zwei Mitleidskäufe in einem Ort');
    ok(g.gags.report().mitleid.n === 1 && g.gags.report().mitleid.sum === m.sum, 'Abrechnung: Mitleidskäufe fehlen');
  }
  for (const [u, why] of [[255, 'vor der Bank'], [300, 'vor dem Kiosk links'], [222, '13 m neben der Bäckerei'], [-50, 'vor dem Ort']]) {
    const { g, town } = mk();
    g.t = 100;
    standAt(g, town.s0 + u, 4);
    ok(g.gags.mitleid.n === 0, `Mitleidskauf ${why}`);
  }
  for (const [what, set] of [['in einer Folge', (g) => (g.tv = { place: 165 })], ['beim Laden', (g) => (g.charging = {})], ['am Haltepunkt', (g) => (g.halt = {})], ['ohne Geld', (g) => (g.money = 1)], ['im Rollen', (g) => (g.player.speed = 0.6)]]) {
    const { g, town } = mk();
    g.t = 100;
    g.player.s = town.s0 + 205;
    set(g);
    for (let i = 0; i < 40; i++) g.step(0.1);
    ok(g.gags.mitleid.n === 0, `Mitleidskauf ${what}`);
  }
  ok(/if \(o\.gags\?\.mitleid\.n\) line\('Mitleidskäufe', fmtNum\(o\.gags\.mitleid\.n\) \+ ' · ' \+ fmtCent\(o\.gags\.mitleid\.sum\)\)/.test(read('src/ui/menus.js')), 'menus.js: die Statistik zählt die Mitleidskäufe nicht');
  ok(read('src/data.js').includes("export const FINES = ['Bußgeld', 'Verwarngeld', 'Schäden', 'Mitleidskäufe'];"), 'data.js: Mitleidskäufe nicht bei den Abzügen');
  // ohne Plan des Orts (die Prüfstände) gibt es keine
  const sim = makeStream({ driver: DRIVERS.troedler, seed: 4, endless: true });
  sim.step(600);
  ok(sim.game.gags.mitleid.n === 0 && !('Mitleidskäufe' in sim.game.breakdown), 'Mitleidskauf ohne Ort');
  // kurz wie jeder Hinweis am Rand (jeder Laden, jeder Kauf, der höchste Preis)
  const longest = Object.values(GAGS.mitleid.laeden).flatMap(([where, things, [, hi]]) => things.map((what) => `🛍️ Mitleidskauf ${where}: ${what} · −${fmtCent(hi)}`)).sort((a, b) => chars(b) - chars(a))[0];
  ok(chars(longest) <= chars(LONGEST_NOTICE), `Mitleidskauf: „${longest}“ ist länger als der längste Hinweis „${LONGEST_NOTICE}“`);
  console.log(`  Mitleidskauf: nach ${MITLEID.stand} s Stand vor einem kleinen Laden rechts (±${MITLEID.reach} m), einmal je Ort; nicht vor Bank, links, in Szenen, ohne Geld`);
}

// --- 9. Mysterybox: geschenkt, am Rand oben ausgepackt -------------------------------------------------------------
{
  const M = GAGS.mystery;
  let boxes = 0;
  for (const seed of [1, 7]) {
    const sim = makeStream({ driver: DRIVERS.mittel, seed, endless: true });
    const { game, log } = sim;
    const shown = [];
    const toast = game.ui.toast;
    game.ui.toast = (text, kind, key, parts) => {
      if (key === 'mystery') shown.push({ t: game.t, text, kind, parts, scene: !!(game.tv || game.charging) });
      return toast(text, kind, key, parts);
    };
    sim.step(3600);
    const gaps = shown.slice(1).map((x, i) => x.t - shown[i].t);
    ok(shown.length >= 4 && shown.length <= 8 && shown[0].t >= MYSTERY.first[0] && gaps.every((d) => d >= MYSTERY.every[0] - 0.1), `Seed ${seed}: Mysteryboxen um ${shown.map((x) => x.t.toFixed(0)).join(', ')} s`);
    for (const x of shown) {
      const what = x.parts && x.parts[2] && x.parts[2][0];
      ok(x.kind === 'good' && !x.scene && x.parts.length === 3 && x.parts[0][1] === 'mystery-box' && x.parts[2][1] === 'mystery-what' && M.inhalt.some(([, w]) => w === what), `Seed ${seed}: Mysterybox ${JSON.stringify(x.parts)}`);
      ok(x.text === `🎁 Mysterybox: ${what}`, `Seed ${seed}: Mysterybox-Text ${x.text}`);
      // wer sie schenkt, sagt James im selben Moment im Chat
      const james = log.chat.filter((m) => m.gag && m.bot === 'james' && m.t === x.t && /^🎁 \S+ schenkt Mini Adam eine Mysterybox!$/.test(m.text));
      ok(james.length === 1, `Seed ${seed}: James nennt den Schenker der Mysterybox nicht (${james.length})`);
      const hype = log.chat.filter((m) => m.gag && M.chat.includes(m.text) && m.t >= x.t && m.t <= x.t + 1);
      const after = log.chat.filter((m) => m.gag && M.danach.includes(m.text) && m.t >= x.t + MYSTERY.shake + 1 - 1e-6 && m.t <= x.t + MYSTERY.shake + 2.05);
      ok(hype.length === 1 && after.length === 1, `Seed ${seed}: Chat zur Mysterybox ${hype.length} + ${after.length}`);
    }
    boxes += shown.length;
  }
  // wackeln, aufspringen, zeigen: die Animation am Rand oben (Hinweiszeile), nicht in der Mitte
  const css = read('docs/style.css');
  ok(/\.toast > \.mystery-box \{[^}]*animation: mystery-shake [^}]*mystery-pop [^}]*1\.6s/.test(css) && /\.toast > \.mystery-what \{[^}]*animation: mystery-in [^}]*1\.6s both/.test(css) && /@keyframes mystery-shake/.test(css), 'style.css: die Mysterybox wackelt nicht oder springt zur falschen Zeit auf');
  ok(MYSTERY.shake === 1.6 && MYSTERY.show > MYSTERY.shake + 3, 'Mysterybox: zu kurz zu sehen');
  ok(M.inhalt.length >= 6 && M.inhalt.every(([k]) => ['sticker', 'sound', 'witz', 'konfetti', 'ding'].includes(k)), 'Mysterybox: Inhalt unbekannt');
  // kurz wie jeder Hinweis am Rand
  const longest = M.inhalt.map(([, w]) => `🎁 Mysterybox: ${w}`).sort((a, b) => chars(b) - chars(a))[0];
  ok(chars(longest) <= chars(LONGEST_NOTICE), `Mysterybox: „${longest}“ ist länger als der längste Hinweis „${LONGEST_NOTICE}“`);
  // den Witz erzählt der Schenker im Chat, gleich nach dem Auspacken
  {
    const sim = makeStream({ seed: 2 });
    sim.step(1);
    const gg = sim.game.gags;
    const pick = gg.pick;
    gg.pick = (list) => (list === M.inhalt ? M.inhalt.find(([k]) => k === 'witz') : pick.call(gg, list));
    gg.boxT = sim.game.t;
    sim.step(1 / 30);
    gg.pick = pick;
    const t0 = sim.game.t;
    sim.step(MYSTERY.shake + 2.5);
    const james = sim.log.chat.find((m) => m.bot === 'james' && /^🎁 \S+ schenkt Mini Adam eine Mysterybox!$/.test(m.text));
    const gifter = james && /^🎁 (\S+) schenkt/.exec(james.text)[1];
    const witz = sim.log.chat.find((m) => m.gag && m.text === M.witz);
    ok(gifter && witz && witz.name === gifter && witz.t >= t0 + MYSTERY.shake && witz.t <= t0 + MYSTERY.shake + 1.2, `Mysterybox mit Witz: ${JSON.stringify(witz)} (Schenker ${gifter})`);
  }
  // sie kommt nur an einen freien Rand oben: sofort zu sehen, und das Pling passt zum Aufspringen
  {
    const sim = makeStream({ seed: 3 });
    sim.step(1);
    const { game } = sim;
    const gg = game.gags;
    let busy = true;
    game.ui.noticeBusy = () => busy;
    const n0 = gg.boxes;
    gg.boxT = game.t;
    sim.step(5);
    ok(gg.boxes === n0 && gg.boxT > game.t && gg.boxT <= game.t + MYSTERY.retry + 1e-9, `Mysterybox trotz Hinweis am Rand oben (${gg.boxes - n0}, wieder in ${(gg.boxT - game.t).toFixed(2)} s)`);
    busy = false;
    sim.step(MYSTERY.retry + 0.1);
    ok(gg.boxes === n0 + 1, `Mysterybox kommt nicht an den freien Rand (${gg.boxes - n0})`);
  }
  // ausgepackt mit Pling, dann der Chat – hat Dringendes sie vor dem Aufspringen abgelöst, plingt es nicht, der Chat
  // wartet, und dieselbe Box kommt wieder, sobald der Rand frei ist (ohne neue Ansage, ohne neue Box)
  {
    const run = (mode) => {
      const sim = makeStream({ seed: 4 });
      sim.step(1);
      const { game, log } = sim;
      let plings = 0;
      const shown = [];
      game.audio.pling = () => plings++;
      const toast = game.ui.toast;
      game.ui.toast = (text, kind, key, parts) => {
        if (key !== 'mystery') return toast(text, kind, key, parts);
        shown.push({ text, t: 0, hold: 0, gone: false });
        return shown[shown.length - 1];
      };
      const t0 = game.t;
      if (mode) game.gags.boxT = game.t;
      sim.step(0.5);
      const box = shown[0];
      if (mode) ok(box && box.t === MYSTERY.show && box.hold === MYSTERY.shake + MYSTERY.read, `Mysterybox: steht ${box && box.t} s, hält ${box && box.hold} s`);
      if (mode === 'abgelöst') box.gone = true;
      sim.step(MYSTERY.shake + 1);
      const first = plings;
      const chatFirst = log.chat.filter((m) => m.gag && m.t >= t0 && GAGS.mystery.danach.includes(m.text)).length;
      sim.step(MYSTERY.retry + MYSTERY.shake + 2.5);
      const chat = log.chat.filter((m) => m.gag && m.t >= t0);
      const after = chat.filter((m) => GAGS.mystery.danach.includes(m.text)).length;
      const james = chat.filter((m) => m.bot === 'james' && /schenkt Mini Adam eine Mysterybox/.test(m.text)).length;
      return { first, plings, shown, chatFirst, after, james, gifts: game.gags.boxes };
    };
    const base = run(null);
    const open = run('ausgepackt');
    const cut = run('abgelöst');
    ok(open.first >= base.first + 1 && cut.first === base.first, `Mysterybox: Pling ohne Box ${base.first}, ausgepackt ${open.first}, abgelöst ${cut.first}`);
    ok(open.shown.length === 1 && open.after === 1 && open.james === 1, `Mysterybox ausgepackt: ${open.shown.length} × am Rand, Chat danach ${open.after}, James ${open.james}`);
    const again = cut.shown.length === 2 && cut.shown[1].text === cut.shown[0].text && cut.plings >= base.plings + 1;
    ok(again && cut.chatFirst === 0 && cut.after === 1 && cut.james === 1 && cut.gifts === open.gifts, `Mysterybox abgelöst: ${cut.shown.map((x) => x.text).join(' / ')}, ${cut.plings - base.plings} × Pling, Chat danach ${cut.chatFirst} → ${cut.after}, James ${cut.james}, Boxen ${cut.gifts}`);
  }
  // am Rand oben (ui.js): Was danach kommt, wartet, bis das Ausgepackte zu lesen war – Dringendes nicht
  {
    const strip = () => {
      const f = { notices: [], notice: null, nextNotice: () => (f.notice = f.notices.shift() || null) };
      for (const m of ['toast', 'dropNotice', 'dropKey', 'tickNotices', 'noticeBusy']) f[m] = UI.prototype[m];
      return f;
    };
    const run = (f, secs) => {
      for (let i = 0; i < Math.round(secs * 30); i++) f.tickNotices(1 / 30);
    };
    const give = (f) => Object.assign(f.toast('🎁 Mysterybox: ein Flummi', 'good', 'mystery'), { t: MYSTERY.show, hold: MYSTERY.shake + MYSTERY.read });
    ok(MYSTERY.shake + MYSTERY.read <= MYSTERY.show && MYSTERY.read >= 2, `Mysterybox: das Ausgepackte steht nur ${MYSTERY.read} s`);
    // nichts wartet: show Sekunden
    let f = strip();
    let box = give(f);
    run(f, MYSTERY.show - 0.1);
    ok(f.notice === box && f.noticeBusy(), 'Mysterybox: steht keine show Sekunden');
    run(f, 0.2);
    ok(!f.notice && box.gone && !f.noticeBusy(), 'Mysterybox: steht länger als show Sekunden');
    // ein Gruß wartet: Sie bleibt, bis das Ausgepackte read Sekunden zu lesen war, dann kommt er dran
    f = strip();
    box = give(f);
    run(f, 0.5);
    const tip = f.toast('🤑 Bieter-Chaos im Chat: Jeder legt einen Zehner drauf!', 'good');
    run(f, MYSTERY.shake + MYSTERY.read - 0.6);
    ok(f.notice === box, 'Mysterybox: ein Gruß löst sie ab, bevor das Ausgepackte zu lesen war');
    run(f, 0.2);
    ok(f.notice === tip && box.gone, 'Mysterybox: der wartende Gruß kommt nicht dran');
    // Dringendes wartet nicht auf sie
    f = strip();
    box = give(f);
    run(f, 0.3);
    const warn = f.toast('⚠️ Blitzer voraus', 'warn');
    run(f, MYSTERY.shake - 0.3);
    ok(f.notice === warn && box.gone, 'Mysterybox: Dringendes wartet auf sie');
  }
  console.log(`  Mysterybox: ${boxes} Boxen in 2 × 60 min, am Rand oben (wackelt ${MYSTERY.shake} s, springt auf), Chat fiebert mit`);
}

// --- 10a. Das kleine Navi im Kärtchen der Drohnenansicht auf dem Handy ----------------------------------------------
{
  const { DroneHud, COMPACT_W, drawCompactNavi } = await import('../src/ui/drone-hud.js');
  const S = await import('../src/ui/sicht.js');
  // ein Kärtchen ohne DOM: Zeichenflächen schreiben mit, was sie zeichnen (Text mit Lage und Breite)
  const record = (c) => {
    const log = { text: [], blits: 0, icons: 0 };
    let font = 10;
    const ctx = new Proxy({}, {
      get: (t, k) => {
        if (k in t) return t[k];
        if (k === 'measureText') return (s) => ({ width: String(s).length * font * 0.56 });
        if (k === 'fillText') return (s, x, y) => log.text.push({ s: String(s), x, y, w: String(s).length * font * 0.56, align: t.textAlign, size: font });
        if (k === 'drawImage') return () => log.blits++;
        return () => {};
      },
      set: (t, k, v) => {
        t[k] = v;
        if (k === 'font') font = +/(\d+)px/.exec(v)[1];
        return true;
      },
    });
    c.getContext = () => ctx;
    return log;
  };
  const elem = () => {
    const e = { style: {}, children: [], width: 0, height: 0, className: '', classList: { toggle() {}, contains: () => false }, appendChild: (c) => (e.children.push(c), c) };
    e.style.setProperty = () => {};
    return e;
  };
  const doc0 = globalThis.document;
  globalThis.document = { createElement: elem };
  const hud = new DroneHud(elem());
  const ins = { turn: 'exit', dist: 800, say: '800 m', calm: false, no: 42, head: 'Ausfahrt Hanau-Nord', short: 'Hanau-Nord', road: 'A 66' };
  let compact = 0;
  for (const [w, h, touch] of [[390, 844, true], [844, 390, true], [360, 740, true], [1280, 720, false], [1920, 1080, false]]) {
    hud.place(S.droneHud(w, h, { touch }), 3);
    const cssW = parseFloat(hud.map.style.width);
    const small = hud.compact;
    ok(small === (w < 1000), `${w} × ${h}: kleines Navi ${small} bei einer Karte von ${cssW} px`);
    hud.show(true);
    const log = record(hud.map);
    record(hud.tacho);
    hud.copy({ id: 'Mittelbildschirm' }, { ins, hop: null });
    if (!small) {
      ok(log.blits === 1 && !log.text.length && cssW >= COMPACT_W, `${w} × ${h}: Karte nicht herübergeholt`);
      continue;
    }
    compact++;
    const W = hud.map.width;
    const H = hud.map.height;
    ok(Math.abs(W - Math.floor(parseFloat(hud.map.style.width)) * 3) <= 3 && H > 60, `${w} × ${h}: kleines Navi ${W} × ${H}`);
    const big = log.text.find((x) => x.s === '800 m');
    const no = log.text.find((x) => x.s === '42');
    const name = log.text.find((x) => /^Hanau-/.test(x.s));
    ok(big && no && (!name || big.size > name.size) && log.text.length === (name ? 3 : 2), `${w} × ${h}: Entfernung, Nummer, Name (${log.text.map((x) => x.s).join(' | ')})`);
    for (const x of log.text) {
      const x0 = x.align === 'center' ? x.x - x.w / 2 : x.align === 'right' ? x.x - x.w : x.x;
      ok(x0 >= -0.5 && x0 + x.w <= W + 0.5 && x.y - x.size / 2 >= -0.5 && x.y + x.size / 2 <= H + 0.5, `${w} × ${h}: „${x.s}“ ragt aus dem kleinen Navi`);
    }
    ok(big && big.size * 3 >= 0.25 * H * 0.9, `${w} × ${h}: Entfernung nur ${big && big.size} px hoch`);
  }
  // ohne Handlung (geradeaus): nur Pfeil und Straße; in der Überfahrt kein Text
  const c = elem();
  c.width = 300;
  c.height = 180;
  const log = record(c);
  drawCompactNavi(c.getContext('2d'), 300, 180, { turn: 'straight', dist: 0, say: '', no: 0, head: '', short: '', road: 'A 66' }, null);
  ok(log.text.length === 1 && log.text[0].s === 'A 66', `geradeaus: ${log.text.map((x) => x.s).join(' | ')}`);
  const log2 = record(c);
  drawCompactNavi(c.getContext('2d'), 300, 180, ins, { kind: 'faehre' });
  ok(log2.text.length === 0, 'Überfahrt: Text im kleinen Navi');
  // eine Ausfahrt ohne kurzen Namen (wie im Spiel: „Ausfahrt Hanau“): neben dem Kästchen nur der Name, Handy quer
  hud.place(S.droneHud(844, 390, { touch: true }), 2);
  const log3 = record(hud.map);
  hud.copy({ id: 'Mittelbildschirm' }, { ins: { ...ins, no: 6, head: 'Ausfahrt Hanau', short: '' }, hop: null });
  ok(log3.text.map((x) => x.s).join(' | ') === '800 m | 6 | Hanau', `Ausfahrt ohne kurzen Namen: ${log3.text.map((x) => x.s).join(' | ')}`);
  // ohne Entfernung ein langer Name (wie im Spiel „Auffahrt A66“): Passt er nicht lesbar hinein, steht die Straße allein da
  for (const [w, h] of [[390, 844], [844, 390], [360, 740]]) {
    hud.place(S.droneHud(w, h, { touch: true }), 2);
    const t = record(hud.map).text;
    hud.copy({ id: 'Mittelbildschirm' }, { ins: { turn: 'merge', dist: 0, say: '', calm: false, no: 0, head: 'Auffahrt A66', short: '', road: 'A66' }, hop: null });
    const legible = t.length === 1 && t[0].size >= 0.14 * hud.map.height - 1 && ['Auffahrt A66', 'A66'].includes(t[0].s);
    ok(legible && (w > 400 || t[0].s === 'A66'), `${w} × ${h} ohne Entfernung: ${t.map((x) => `${x.s} (${x.size} px von ${hud.map.height})`).join(' | ')}`);
  }
  globalThis.document = doc0;
  const main = read('src/main.js');
  ok(main.includes('cockpit.screen.onDraw = (c, navi) => ui.droneHud.copy(c, navi);') && /this\.onDraw\(this\.canvas, this\.navi\)/.test(read('src/cockpit/screen.js')) && /this\.ins = ins;/.test(read('src/map/navview.js')), 'Die Ansage kommt nicht beim kleinen Navi an');
  console.log(`  Drohnen-Kärtchen: auf ${compact} Handygrößen das kleine Navi (Pfeil, „800 m“, Ausfahrt 42, Name), ab ${COMPACT_W} px die Karte`);
}

// --- 10b. Navi in Metern auf den letzten 1,5 km vor der Ausfahrt (auch auf geraffter Autobahn) ----------------------
{
  const NR = await import('../src/map/navroute.js');
  const src = read('src/map/navroute.js');
  ok(NR.NEAR_M === 1500 && NR.BOARD_M === 1000, `NEAR_M ${NR.NEAR_M}, BOARD_M ${NR.BOARD_M}`);
  ok(src.includes('out.say = g.far || g.dist > Math.max(parkBoard(g.fork), NEAR_M) ? fmtKm(g.toKm) : fmtRoad(g.dist);') && src.includes('nx.say = nx.dist <= Math.max(parkBoard(nx.fork), NEAR_M) ? fmtRoad(nx.dist) : fmtKm(trip.reach(nx.fork.s).km);'), 'navroute.js: Ansage und nächste Ausfahrt nennen die letzten 1,5 km nicht in Metern');
  ok(src.includes('out.calm = g.far || g.dist > (parkBoard(g.fork) || BOARD_M);'), 'navroute.js: Vorschau und Spurpfeile wechseln nicht mehr an der Tafel');
  ok(read('tools/journey-test.mjs').includes('const metres = !g.far && g.dist <= Math.max(parkBoard(g.fork), NEAR_M);'), 'journey-test prüft die Meter vor der Tafel nicht');
  ok(NR.fmtRoad(1500) === '1500 m' && NR.fmtRoad(1449) === '1450 m', 'fmtRoad');
  console.log(`  Navi: Ausfahrt ab ${NR.NEAR_M} m in Metern (Vorschau und Spurpfeile ab der Tafel bei ${NR.BOARD_M} m)`);
}

// --- 10c. Der Tempomat hält die 120 am Blitzer ------------------------------------------------------------------------
{
  const { Player } = await import('../src/game/player.js');
  const { ZONE_LEAD } = await import('../src/game/game.js');
  // who: 'tempomat' (Tempomat gesetzt, kein Pedal), 'gas' (Strompedal ganz durch), 'brav' (brav wie Autopilot und
  // Prüffahrer, Pedal ganz durch); zone: ob das Spiel die Zone setzt
  const zoneRun = (kmh, who, zone = true) => {
    const p = new Player();
    p.lawful = who === 'brav';
    if (who === 'tempomat') p.configure({ cruise: true });
    p.speed = kmh / 3.6;
    if (who === 'tempomat') p.cruiseSet = kmh / 3.6;
    // die Zone wie im Spiel: erstes Schild bei limitS, Kamera 600 m dahinter, Ende 780 m dahinter
    const b = { limitS: 1500, camS: 2100, endS: 2280 };
    let atCam = null;
    let after = 0;
    const ctl = { steer: 0, throttle: who === 'tempomat' ? 0 : 1, brake: 0 };
    for (let i = 0; i < 30 * 120 && p.s < b.endS + 900; i++) {
      p.setLimits({ zone: zone && p.s > b.limitS - ZONE_LEAD && p.s < b.endS ? 120 / 3.6 : Infinity });
      p.update(1 / 30, ctl, { wet: 0, kappa: 0, grade: 0 });
      if (atCam === null && p.s >= b.camS) atCam = p.kmh;
      if (p.s > b.endS + 700) after = p.kmh;
    }
    return { atCam, after, top: p.vmax * 3.6 };
  };
  for (const kmh of [150, 200, 250]) {
    const t = zoneRun(kmh, 'tempomat');
    ok(t.atCam !== null && t.atCam <= 121, `Tempomat auf ${kmh} km/h: an der Kamera ${t.atCam && t.atCam.toFixed(1)} km/h`);
    // danach wieder das alte Tempo (höchstens so schnell, wie der Wagen kann)
    ok(Math.abs(t.after - Math.min(kmh, t.top)) < 3, `Tempomat auf ${kmh} km/h: nach der Zone ${t.after.toFixed(1)} km/h (Wagen ${t.top.toFixed(0)} km/h)`);
  }
  const slow = zoneRun(100, 'tempomat');
  ok(Math.abs(slow.atCam - 100) < 1, `Tempomat auf 100 km/h in der Zone: ${slow.atCam.toFixed(1)} km/h`);
  const gas = zoneRun(200, 'gas');
  ok(gas.atCam > 150, `Das Strompedal bremst in der Zone (${gas.atCam.toFixed(1)} km/h an der Kamera)`);
  // Autopilot und Prüffahrer (brav) fahren wie bisher: mit und ohne Zone aufs Hundertstel gleich
  const brav = zoneRun(200, 'brav');
  const bravFrei = zoneRun(200, 'brav', false);
  ok(brav.atCam > 150 && brav.atCam === bravFrei.atCam && brav.after === bravFrei.after, `Brave Fahrer merken die Zone (${brav.atCam.toFixed(2)} statt ${bravFrei.atCam.toFixed(2)} km/h)`);
  ok(/p\.setLimits\(\{ zone: zb && p\.s > zb\.limitS - ZONE_LEAD && p\.s < zb\.endS \? 120 \/ 3\.6 : Infinity \}\);/.test(gameSource()), 'game.js gibt dem Tempomaten die Zone am Blitzer nicht');
  // im Spiel: die Zone steht, solange der Wagen in ihr (oder ZONE_LEAD davor) ist
  const sim = makeStream({ seed: 3 });
  // auf der Autobahn (abseits von ihr gibt es keine Blitzer: dropRoadside)
  for (let i = 0; i < 600 && (sim.step(1) && sim.game.offAutobahn); i++);
  const g = sim.game;
  ok(!g.offAutobahn, 'Spiel: Der Wagen erreicht die Autobahn nicht');
  const s0 = g.player.s;
  g.blitzer = { limitS: s0 + 100, camS: s0 + 700, endS: s0 + 880, announced: false, checked: false };
  sim.step(1 / 30);
  ok(Math.abs(g.player.limits.zone - 120 / 3.6) < 1e-9, `Spiel: Zone ${g.player.limits.zone} vor dem Blitzer`);
  g.blitzer = null;
  sim.step(1 / 30);
  ok(g.player.limits.zone === Infinity, 'Spiel: Zone ohne Blitzer');
  console.log(`  Tempomat am Blitzer: ab ${ZONE_LEAD} m vor dem Schild auf 120, an der Kamera höchstens ${Math.max(...[150, 200, 250].map((k) => zoneRun(k, 'tempomat').atCam)).toFixed(1)} km/h; Pedal und brave Prüfstandsfahrer wie bisher`);
}

// --- Grundregel: mit und ohne Gags derselbe Stream -----------------------------------------------------------------
{
  const run = (on) => {
    const sim = makeStream({ driver: DRIVERS.mittel, seed: 5, endless: true });
    sim.game.gags.on = on;
    sim.step(900);
    const g = sim.game;
    return { log: sim.log, money: g.money, mood: g.mood, s: g.player.s, tv: sim.log.tv.length };
  };
  const a = run(true);
  const b = run(false);
  const plain = (log) => log.chat.filter((m) => !m.gag).map((m) => `${m.t.toFixed(3)} ${m.name}: ${m.text}`);
  const pa = plain(a.log);
  const pb = plain(b.log);
  const diff = pa.findIndex((x, i) => x !== pb[i]);
  ok(pa.length === pb.length && diff < 0, `Gags verändern den Stream: ${pa.length} gegen ${pb.length} Zeilen, erste Abweichung ${pa[diff]} / ${pb[diff]}`);
  ok(a.money === b.money && a.mood === b.mood && a.s === b.s && a.tv === b.tv, `Gags verändern Geld, Stimmung oder Fahrt: ${a.money}/${b.money} ${a.mood}/${b.mood} ${a.s}/${b.s}`);
  ok(b.log.chat.every((m) => !m.gag), 'Gags abgeschaltet und doch im Chat');
  const gags = a.log.chat.filter((m) => m.gag).length;
  ok(gags > 0, 'In 15 Minuten kein einziger Gag');
  console.log(`  Grundregel: 15 Minuten mit ${gags} Gag-Zeilen, sonst Zeile für Zeile derselbe Stream (${pa.length} Zeilen, ${a.tv} Folgen)`);
}

console.log(fails ? `streamgags-test: ${fails} von ${checks} Prüfungen FEHLGESCHLAGEN` : `streamgags-test: alle ${checks} Prüfungen bestanden`);
process.exit(fails ? 1 : 0);
