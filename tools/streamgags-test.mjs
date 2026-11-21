// Prüfstand der Running Gags aus dem Stream des Eigentümers vom 21.11.2026 (src/game/gags.js und was sie zeigt):
// Herr Schönnbrun moderiert BrunnenTV (Bauchbinde, Logo, Hymne, Gruß im Chat, Album, Abspann). Dazu die Grundregel
// aller Gags: Sie würfeln mit eigenem Zufall – ein Stream verläuft mit ihnen genauso wie ohne sie.
import { readFileSync } from 'node:fs';
import { makeStream, DRIVERS } from './stream-sim.mjs';
import { SCHOENNBRUN, ABSPANN_REISE } from '../src/data.js';
import { TV } from '../src/world/xxl/brunnentv.js';
import { drawSchoennbrunLogo } from '../src/ui/schoennbrun.js';

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
