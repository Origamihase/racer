// Prüfstand der Running Gags aus dem Stream des Eigentümers vom 21.11.2026 (src/game/gags.js und was sie zeigt):
// Herr Schönnbrun moderiert BrunnenTV (Bauchbinde, Logo, Hymne, Gruß im Chat, Album, Abspann). Dazu die Grundregel
// aller Gags: Sie würfeln mit eigenem Zufall – ein Stream verläuft mit ihnen genauso wie ohne sie.
import { readFileSync } from 'node:fs';
import { fmtNum, fmtCent } from '../src/util.js';
import { makeStream, DRIVERS } from './stream-sim.mjs';
import { SCHOENNBRUN, ABSPANN_REISE, GAGS, SHOP, shopPrice } from '../src/data.js';
import { TV } from '../src/world/xxl/brunnentv.js';
import { drawSchoennbrunLogo } from '../src/ui/schoennbrun.js';
import { StreamGags, GATE, VEREIN, CODE, TRACKER, PAKET, SCHADE, MITLEID } from '../src/game/gags.js';
import { FACTS } from '../src/game/game.js';
import { thanksGroups } from '../src/ui/abspann.js';
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
    // die Zahl steht erst in der Abrechnung, die Namen im Abspann
    const F = game.supporters();
    const grp = thanksGroups(F).find((x) => x.id === 'verein');
    ok(grp && grp.title === G.name && grp.names.map((x) => x.name).join() === members.join() && grp.sub === `${members.length}\u00a0Mitglieder`, `Seed ${seed}: Abspann ${grp && JSON.stringify(grp.sub)}`);
    joins += members.length;
  }
  ok(/if \(o\.gags\?\.verein\) line\('Vereinsmitglieder', fmtNum\(o\.gags\.verein\.members\.length\)\)/.test(read('src/ui/menus.js')), 'menus.js: die Abrechnung nennt die Vereinsmitglieder nicht');
  ok(/gags: this\.gags\.report\(\)/.test(read('src/game/game.js')), 'game.js: Game.end gibt den Gags nichts mit');
  ok(thanksGroups({}).length === 0 && !thanksGroups({ verein: null }).some((x) => x.id === 'verein'), 'Abspann: Verein ohne Gründung');
  console.log(`  Verein „${G.name}“: ${joins} Beitritte in 2 × 30 min, James begrüßt jeden ohne Zahl, Abrechnung und Abspann nennen sie`);
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
  const game = read('src/game/game.js');
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
  ok(read('src/data.js').includes("export const FINES = ['Bußgeld', 'Verwarngeld', 'Reparaturen', 'Mitleidskäufe'];"), 'data.js: Mitleidskäufe nicht bei den Abzügen');
  // ohne Plan des Orts (die Prüfstände) gibt es keine
  const sim = makeStream({ driver: DRIVERS.troedler, seed: 4, endless: true });
  sim.step(600);
  ok(sim.game.gags.mitleid.n === 0 && !('Mitleidskäufe' in sim.game.breakdown), 'Mitleidskauf ohne Ort');
  // kurz wie jeder Hinweis am Rand (jeder Laden, jeder Kauf, der höchste Preis)
  const longest = Object.values(GAGS.mitleid.laeden).flatMap(([where, things, [, hi]]) => things.map((what) => `🛍️ Mitleidskauf ${where}: ${what} · −${fmtCent(hi)}`)).sort((a, b) => chars(b) - chars(a))[0];
  ok(chars(longest) <= chars(LONGEST_NOTICE), `Mitleidskauf: „${longest}“ ist länger als der längste Hinweis „${LONGEST_NOTICE}“`);
  console.log(`  Mitleidskauf: nach ${MITLEID.stand} s Stand vor einem kleinen Laden rechts (±${MITLEID.reach} m), einmal je Ort; nicht vor Bank, links, in Szenen, ohne Geld`);
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
