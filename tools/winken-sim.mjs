// Wie oft hebt Mini Adam den Fensterarm? Ein simulierter Stream ohne Grafik (stream-sim.mjs: das echte Spiel auf der
// echten Fahrt, ein braver Fahrer, der dem Navi folgt) mit allem, was main.js dazu tut: alle 0,25 s der Blick auf
// die Menschen am Gehweg der echten Ortspläne (towns.js townPlan, wie waveAtWalkers), das Intro beim Losfahren und
// Rempler nach einem festen Fahrplan. Mitgeschrieben wird jeder Arm, der hochgeht, mit seinem Anlass:
//   intro, gehsteig, chat, unfall – die vier Anlässe der Regel (game/wave.js)
//   spende – eine Spende, bei der er jubelt (RAISES.spende: ab welcher Stärke k = Betrag / 20, sonst nie)
//   ziel   – das Navi-Ziel ist erreicht und er jubelt mit der Faust (RAISES.ziel)
// Welche Stimmung den Arm hebt, steht in main.js adamMood; RAISES bildet das hier nach (winken2-test vergleicht beides
// mit dem Quelltext). Die Flasche am Ladestopp (im Stand) und das Megafon der BrunnenTV-Folgen (im Stand) zählen
// nicht als Arm in der Fahrt: Den Ladestopp zählt stops mit, die Folgen tv.
// Aufruf: node tools/winken-sim.mjs [Minuten] [Saat] – druckt die Tabelle.
import { makeStream, DRIVERS } from './stream-sim.mjs';
import { walkerToWave, WAVE } from '../src/game/wave.js';
import { GESTURES } from '../src/models/adamMimic.js';

/** Ab welcher Spendenstärke er jubelt (null: nie) und ob er am Ziel jubelt – wie main.js adamMood. */
export const RAISES = { spende: 0.75, ziel: true };

let city = null;
let townPlan = null;
/** Der Stadtbaukasten ohne Browser (Leinwände nur als Attrappe, wie in testlauf3-test). */
async function kit() {
  if (city) return;
  if (!globalThis.document) {
    const ctx = new Proxy({}, {
      get(t, k) {
        if (k === 'measureText') return (x) => ({ width: String(x).length * 10 });
        if (k === 'createLinearGradient' || k === 'createRadialGradient') return () => ({ addColorStop() {} });
        if (k === 'getImageData') return (x, y, w, h) => ({ data: new Uint8ClampedArray(w * h * 4) });
        if (k in t) return t[k];
        return () => {};
      },
      set(t, k, v) {
        t[k] = v;
        return true;
      },
    });
    globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => ctx, style: {} }) };
  }
  const { W } = await import('../src/curve.js');
  const { createCityKit } = await import('../src/world/kit/city.js');
  ({ townPlan } = await import('../src/world/xxl/towns.js'));
  city = createCityKit(W);
}

/**
 * Ein Stream über minutes Minuten. bumps: Spielzeiten (s) der Rempler (je einer, wie game.onCrash ihn bekommt; zwei
 * kurz hintereinander, wie es im Verkehr passiert). driver: DRIVERS aus stream-sim (Wunschtempo; Ortstempo hält der Begrenzer).
 * Ergebnis: { raises: [{ t, why, kmh, kind }], count: { Anlass: wie oft der Arm dazu hochging }, asked: { Anlass: wie oft
 * es dazu kam, auch wenn der Arm schon oben war }, towns (Ortsdurchfahrten), slowTowns (davon mit
 * höchstens 30 km/h irgendwo), stops, tv, minutes, over }.
 */
export async function armStream({ minutes = 20, seed = 3, bumps = [290, 305, 900], driver = DRIVERS.mittel } = {}) {
  await kit();
  const sim = makeStream({ driver, seed, endless: true });
  const { game, trip, p } = sim;
  const raises = [];
  const count = { intro: 0, gehsteig: 0, chat: 0, unfall: 0, spende: 0, ziel: 0 };
  // jeder Anlass, auch wenn der Arm da schon oben war
  const asked = { ...count };
  // ein Arm, der noch oben ist (die Geste läuft noch), geht nicht neu hoch: er bleibt nur länger oben
  let upUntil = -1;
  const add = (why) => {
    asked[why]++;
    const was = game.t < upUntil;
    upUntil = Math.max(upUntil, game.t + (WAVE.why.includes(why) ? GESTURES.wave : GESTURES.cheer));
    if (was) return;
    count[why]++;
    raises.push({ t: +game.t.toFixed(2), why, kmh: Math.round(p.speed * 3.6), kind: trip.section.kind });
  };
  // der Anlass eines Grußes: das, was die Regel eben bejaht hat
  const ask = game.waves.ask.bind(game.waves);
  let why = null;
  game.waves.ask = (w, t, o) => {
    const k = ask(w, t, o);
    if (k > 0) why = w;
    return k;
  };
  const onMood = game.onMood;
  game.onMood = (name, k, o) => {
    if (name === 'wave') add(why);
    else if (name === 'donation' && RAISES.spende !== null && k >= RAISES.spende) add('spende');
    else if (name === 'cheer' && RAISES.ziel) add('ziel');
    return onMood(name, k, o);
  };
  // Losfahren: Intro (ohne Startszene winkt er beim Losfahren in die Facecam, main.js streamStart)
  game.waveAt('intro');
  const plans = new Map();
  const passages = new Set();
  const slow = new Set();
  let walkerT = 0;
  let stops = 0;
  let tv = 0;
  let charging = false;
  let inTv = false;
  const todo = [...bumps].sort((a, b) => a - b);
  const end = minutes * 60;
  while (game.t < end && !game.over) {
    if (!sim.step(sim.DT)) break;
    // Rempler nach Fahrplan (nicht in einer Szene am Brunnen oder an der Ladesäule; einer, der den Stream in die
    // Werkstatt schicken würde, entfällt – das ist kein gewöhnlicher Stream mehr)
    if (todo.length && game.t >= todo[0] && !game.tv && !game.charging) {
      todo.shift();
      if (p.maxHits - p.hits > 1) game.onCrash({ type: 'crash', car: { s: p.s + 4.6, len: 4.4, speed: Math.max(0, p.speed - 4), behavior: 'normal' }, ds: 4.6, lonOverlap: 0.4, latOverlap: 1.5 });
    }
    if (game.charging && !charging) stops++;
    charging = !!game.charging;
    if (game.tv && !inTv) tv++;
    inTv = !!game.tv;
    // wie main.js waveAtWalkers: alle 0,25 s, nur in Ortsdurchfahrten
    walkerT -= sim.DT;
    if (walkerT > 0) continue;
    walkerT = 0.25;
    const sec = trip.section;
    if (sec.kind !== 'stadt') continue;
    passages.add(sec);
    if (p.speed <= 30 / 3.6) slow.add(sec);
    let plan = plans.get(sec);
    if (!plan) plans.set(sec, (plan = townPlan(city, sec)));
    const who = walkerToWave(game.waves, game.t, p.speed, plan.items, p.s - sec.s0, sec);
    if (who) game.waveAt('gehsteig', { look: who.side > 0 ? 'side' : 'window', who });
  }
  return { raises, count, asked, towns: passages.size, slowTowns: slow.size, stops, tv, minutes: game.t / 60, over: game.over ? game.over.reason : null };
}

/** Arme je 10 Minuten ohne das Intro (das Ziel des Besitzers: höchstens etwa 2). */
export const per10 = (r) => ((r.raises.length - r.count.intro) * 10) / r.minutes;

if (import.meta.url === `file://${process.argv[1]}`) {
  const minutes = +(process.argv[2] || 20);
  const seeds = process.argv[3] ? [+process.argv[3]] : [3, 5, 11];
  for (const seed of seeds) {
    const r = await armStream({ minutes, seed });
    const c = r.count;
    console.log(`Saat ${seed}: ${r.minutes.toFixed(1)} min, ${r.towns} Ortsdurchfahrten (${r.slowTowns} mit <= 30 km/h), ${r.tv} Folgen, ${r.stops} Ladestopps${r.over ? ', Ende ' + r.over : ''}`);
    const a = r.asked;
    console.log(`  Arm hoch: ${r.raises.length} (intro ${c.intro}, gehsteig ${c.gehsteig}, chat ${c.chat}, unfall ${c.unfall}, spende ${c.spende}, ziel ${c.ziel}) = ${per10(r).toFixed(1)} je 10 min ohne Intro`);
    console.log(`  Anlässe: intro ${a.intro}, gehsteig ${a.gehsteig}, chat ${a.chat}, unfall ${a.unfall}, spende ${a.spende}, ziel ${a.ziel}`);
    console.log('  ' + r.raises.map((x) => `${x.t.toFixed(0)} s ${x.why} ${x.kmh} km/h ${x.kind}`).join(' · '));
  }
}
