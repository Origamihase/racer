// Testlauf 5 (die Probefahrt des Besitzers vom 24.11.2026 abends), ohne Grafik: node tools/testlauf5-test.mjs
// 1. „Wenn man in den Gegenverkehr kommt, fährt man einfach durch das entgegenkommende Auto. Hier bräuchten wir eine
//    bessere Lösung mit mehr Schaden.“ Wer frontal in einen Entgegenkommenden fährt (world/xxl/gegenverkehr.js meldet
//    headOn und die Annäherung), steht sofort und federt zurück, der andere ebenso; durchfahren geht nie, auch nicht mit
//    durchgetretenem Strompedal, bei voller, halber oder knapper Überdeckung. Die Werkstatt rechnet nach der Annäherung
//    (data.js frontalCost: teurer als jeder gewöhnliche Rempler, frontal auf der Landstraße der teuerste), ab 100 km/h
//    kostet er zwei Karosserie-Punkte; OMI und der Chat haben eigene Sätze, Mini Adam erschrickt. Seitlich gestreift
//    bleibt ein seitlicher Rempler. Die Entgegenkommenden bleiben in ihrer Spur (nie in der des Spielers).
import { Group } from 'three';
import { Trip, PROFILES } from '../src/game/trip.js';
import { findPlace } from '../src/map/graph.js';
import { Player, RECOIL } from '../src/game/player.js';
import { Gegenverkehr, twoWay, oncomingX } from '../src/world/xxl/gegenverkehr.js';
import { CAR_TYPES } from '../src/models/vehicles.js';
import { autoTarget } from '../src/world/xxl/plan.js';
import { REPARATUR, CHAT, frontalCost, damageCount } from '../src/data.js';
import { DAMAGE_LINES } from '../src/game/damage.js';
import { mulberry32, makeStream, DRIVERS } from './stream-sim.mjs';

let fails = 0;
let checks = 0;
const kinds = new Map();
const ok = (cond, msg) => {
  checks++;
  if (cond) return;
  fails++;
  const k = msg.replace(/[-\d.,]+/g, '#');
  const n = (kinds.get(k) || 0) + 1;
  kinds.set(k, n);
  if (n <= 3) console.log('FEHLER: ' + msg);
};
const DT = 1 / 30;
const KMH = 1 / 3.6;
// Fahrzeuge ohne Bild, mit den Maßen der echten (models/vehicles.js)
const make = (kind) => ({ group: new Group(), length: CAR_TYPES[kind].L, width: CAR_TYPES[kind].half * 2 + 0.12 });

/** Eine Fahrt bis zur ersten Landstraße mit len Metern Gegenspur voraus. */
function landTrip(len = 200) {
  Math.random = mulberry32(21);
  const trip = new Trip({ rng: Math.random });
  trip.setTarget(findPlace('Fulda'));
  const G = new Gegenverkehr(null, { rnd: mulberry32(1), make });
  let s = trip.s;
  for (let i = 0; i < (20 * 60) / DT; i++) {
    const prof = trip.profile();
    s += ((prof.limit > 0 ? prof.limit : 130) / 3.6) * DT;
    trip.update(s, autoTarget(trip));
    if (twoWay(trip.section) === 'land' && G.clearPath(trip.cur, s, s + len)) return { trip, s };
  }
  return null;
}

// --- 1. Frontal in den Gegenverkehr ----------------------------------------------------------------------------------
console.log('1. Frontal in den Gegenverkehr:');
{
  const L = landTrip();
  ok(!!L, 'keine Landstraße mit 200 m Gegenspur gefunden');
  const rows = [];
  if (L) {
    const { trip, s: s0 } = L;
    const sec = trip.section;
    const xo = oncomingX(sec);
    // Annäherung (km/h) = eigenes Tempo + das des Entgegenkommenden; Überdeckung quer: ganz, halb, knapp (0,3 m)
    const cases = [];
    for (const [v, vp, vc] of [[30, 15, 15], [70, 35, 35], [100, 50, 50], [185, 100, 85]]) for (const lap of ['ganz', 'halb', 'knapp']) cases.push({ v, vp, vc, lap });
    for (const k of cases) {
      const p = new Player();
      p.reset({});
      p.configure({ laneAssist: 'aus', curveAssist: 'aus' });
      p.lawful = false;
      const P = PROFILES[sec.profile];
      p.setLimits({ left: P.xmin, right: P.xmax, shoulder: 99, lanes: P.lanes.map((q) => q.x), vmax: Infinity, hold: Infinity, back: -1e9 });
      p.s = s0;
      p.sFar = s0;
      const D = new Gegenverkehr(null, { rnd: mulberry32(9), make });
      const c = D.spawn(trip.cur, s0 + 60, sec);
      const wsum = (c.w + p.w) / 2;
      p.x = xo + (k.lap === 'ganz' ? 0 : k.lap === 'halb' ? wsum / 2 : wsum - 0.3);
      const half = (c.len + p.len) / 2;
      // so nah, dass der Entgegenkommende nicht mehr bremsen kann (wer plötzlich hinüberzieht)
      c.s = s0 + half + k.v * KMH * DT * 1.5;
      c.sPrev = c.s;
      c.speed = k.vc * KMH;
      p.speed = k.vp * KMH;
      const r = { ...k, ev: null, through: 0, deep: 0, back: 0, still: 0, carStill: 0, hits: 0, counted: 0 };
      let sHit = null;
      for (let i = 0; i < 4 / DT; i++) {
        // Strom voll bis zum Stoß (wer „einfach durchfahren“ will), danach vom Pedal
        p.update(DT, { throttle: r.ev ? 0 : 1, brake: 0, steer: 0 }, {});
        const evs = D.update(DT, trip, p, trip.shears(), i * DT);
        for (const e of evs) {
          if (e.type !== 'crash') continue;
          if (!r.ev) r.ev = e;
          if (p.collide(e)) r.counted++;
          if (sHit === null) sHit = p.s;
        }
        // nach der Auflösung liegt nichts mehr übereinander, und der andere bleibt vor dem Wagen
        const lon = half - Math.abs(c.s - p.s);
        const lat = wsum - Math.abs(c.x - p.x);
        if (lat > 0.08 && lon > 0.05) r.deep = Math.max(r.deep, lon);
        if (c.s <= p.s) r.through++;
        if (sHit !== null) {
          r.back = Math.max(r.back, sHit - p.s);
          if (p.speed < 0.01) r.still += DT;
          if (c.speed < 0.01) r.carStill += DT;
        }
      }
      r.hits = p.damage.hits;
      r.cost = r.ev ? frontalCost(r.ev.closing * 3.6) : 0;
      rows.push(r);
      const what = `${k.v} km/h, ${k.lap}`;
      ok(r.ev && r.ev.headOn && r.ev.car.oncoming, `${what}: kein Frontal-Rempler gemeldet (${r.ev ? JSON.stringify({ headOn: r.ev.headOn, ds: r.ev.ds }) : '–'})`);
      ok(r.ev && Math.abs(r.ev.closing * 3.6 - k.v) < 2, `${what}: Annäherung ${r.ev && (r.ev.closing * 3.6).toFixed(1)} km/h`);
      ok(r.through === 0 && r.deep === 0, `${what}: durchgefahren (${r.through} Bilder dahinter, ${r.deep.toFixed(2)} m übereinander)`);
      ok(r.counted === 1, `${what}: ${r.counted} zählende Rempler (soll 1)`);
      ok(r.back >= 0.1 && r.back < 1.6, `${what}: zurückgefedert ${r.back.toFixed(2)} m`);
      ok(r.still > 3 && r.carStill > 2.4, `${what}: steht ${r.still.toFixed(1)} s, der andere ${r.carStill.toFixed(1)} s`);
      ok(r.hits === (k.v >= RECOIL.hard ? 2 : 1), `${what}: ${r.hits} Karosserie-Punkte weg`);
    }
    // die Rechnung steigt mit der Annäherung, schon bei 30 km/h deutlich über einem gewöhnlichen Rempler, und frontal
    // auf der Landstraße ist der teuerste Rempler des Spiels
    const by = [30, 70, 100, 185].map((v) => rows.find((r) => r.v === v && r.lap === 'ganz').cost);
    ok(by.every((c, i) => i === 0 || c > by[i - 1]), `Rechnung steigt nicht: ${by.join(' / ')} €`);
    ok(by[0] >= 1.8 * REPARATUR.bump, `frontal mit 30 km/h nur ${by[0]} € (gewöhnlich ${REPARATUR.bump} €)`);
    ok(by[3] >= 5 * REPARATUR.bump && by[3] === Math.max(...rows.map((r) => r.cost)), `frontal auf der Landstraße ${by[3]} €`);
    console.log(`  Annäherung 30 / 70 / 100 / 185 km/h (je ganz, halb, knapp überdeckt): nie durchgefahren, zurückgefedert ${[30, 70, 100, 185].map((v) => rows.find((r) => r.v === v && r.lap === 'ganz').back.toFixed(2)).join(' / ')} m, Rechnung ${by.join(' / ')} € (gewöhnlicher Rempler ${REPARATUR.bump} €), Punkte ${[30, 70, 100, 185].map((v) => rows.find((r) => r.v === v && r.lap === 'ganz').hits).join(' / ')}`);

    // seitlich gestreift: beide schon nebeneinander, der Spieler zieht hinüber – ein seitlicher Rempler, kein frontaler
    {
      const p = new Player();
      p.reset({});
      p.configure({ laneAssist: 'aus', curveAssist: 'aus' });
      const P = PROFILES[sec.profile];
      p.setLimits({ left: P.xmin, right: P.xmax, shoulder: 99, lanes: P.lanes.map((q) => q.x), vmax: Infinity, hold: Infinity, back: -1e9 });
      p.s = s0;
      p.x = 9.0;
      p.speed = 60 * KMH;
      const D = new Gegenverkehr(null, { rnd: mulberry32(9), make });
      const c = D.spawn(trip.cur, s0 + 1, sec);
      c.speed = 0;
      let ev = null;
      for (let i = 0; i < 20 && !ev; i++) {
        p.x -= 0.15;
        for (const e of D.update(DT, trip, { s: p.s, x: p.x, speed: 0, len: p.len, w: p.w }, trip.shears(), i * DT)) ev = ev || e;
      }
      ok(ev && !ev.headOn, `seitlich gestreift: ${ev ? 'frontal gemeldet' : 'kein Rempler'}`);
    }
  }

  // Die Entgegenkommenden bleiben in ihrer Spur: ihr rechter Rand nie über den linken der eigenen Spur (10 min Fahrt)
  {
    Math.random = mulberry32(21);
    const trip = new Trip({ rng: Math.random });
    trip.setTarget(findPlace('Gelnhausen'));
    const G = new Gegenverkehr(null, { rnd: mulberry32(5), make });
    const P = { s: trip.s, x: trip.x, speed: 0, len: 4.7, w: 1.92 };
    let worst = -Infinity;
    let n = 0;
    for (let i = 0; i < (10 * 60) / DT; i++) {
      const prof = trip.profile();
      P.speed = (prof.limit > 0 ? prof.limit : 130) / 3.6;
      P.s += P.speed * DT;
      P.x = autoTarget(trip);
      trip.update(P.s, P.x);
      G.update(DT, trip, P, trip.shears(), i * DT);
      for (const c of G.cars) {
        const own = PROFILES[c.sec.profile].lanes.find((q) => q.dir > 0);
        worst = Math.max(worst, c.x + c.w / 2 - (own.x - own.w / 2));
        n++;
      }
    }
    ok(n > 100 && worst < -0.3, `Gegenverkehr ragt in die eigene Spur: ${worst.toFixed(2)} m (${n} Messungen)`);
    console.log(`  Gegenverkehr in seiner Spur: rechter Rand höchstens ${(-worst).toFixed(2)} m links der eigenen Spur (${n} Messungen)`);
  }

  // Im Spiel: Rechnung, Punkte, OMI, Chat, Mini Adam (der echte Stream von stream-sim)
  {
    const S = makeStream({ driver: DRIVERS.zuegig, seed: 5, endless: true });
    const g = S.game;
    S.step(30);
    const moods = [];
    const onMood = g.onMood.bind(g);
    g.onMood = (m, k) => (moods.push(m), onMood(m, k));
    const p = g.player;
    const before = { hits: p.hits, money: g.money, chat: S.log.chat.length, say: S.log.say.length };
    const closing = 185 * KMH;
    const car = { s: p.s + 4.6, speed: -85 * KMH, len: 4.5, w: 1.8, x: p.x, behavior: 'normal', oncoming: true };
    g.onCrash({ type: 'crash', car, ds: 4.6, dx: 0, latOverlap: 1.8, lonOverlap: 0.2, headOn: true, closing });
    const want = frontalCost(185);
    ok(g.tally.front === 1 && g.tally.hits === 1 && g.tally.extra === want - REPARATUR.bump, `Runde: ${JSON.stringify(g.tally)} (soll ${want} € frontal)`);
    ok(p.hits - before.hits === 2, `frontal mit 185 km/h: ${p.hits - before.hits} Punkte (soll 2)`);
    ok(moods.includes('startled'), `Mini Adam erschrickt nicht: ${moods.join(', ')}`);
    S.step(3);
    const chat = S.log.chat.slice(before.chat).map((m) => m.text);
    ok(chat.some((t) => CHAT.frontal.includes(t)), `Chat ohne Frontal-Sätze: ${chat.join(' | ')}`);
    const said = S.log.say.slice(before.say).map((m) => m.text);
    ok(said.some((t) => DAMAGE_LINES.frontal.some((l) => t.startsWith(l.split('{')[0]))), `OMI ohne Frontal-Satz: ${said.join(' | ')}`);
    const mid = g.money;
    g.end('quit');
    const o = g.over;
    ok(Math.abs(mid - g.money - want) < 1e-9 && o.damage.front === 1 && o.damage.hits === 1, `Ende: ${mid} → ${g.money} €, ${JSON.stringify(o.damage)} (soll −${want} €)`);
    ok(damageCount(o.damage.hits, o.damage.marks, o.damage.front).startsWith('1 Frontal-Rempler'), `Abrechnung: „${damageCount(o.damage.hits, o.damage.marks, o.damage.front)}“`);
    console.log(`  im Spiel: frontal mit 185 km/h → Rechnung ${want} €, 2 Punkte, Mini Adam ${moods[0]}, Chat „${chat.find((t) => CHAT.frontal.includes(t))}“, Abrechnung „${damageCount(o.damage.hits, o.damage.marks, o.damage.front)}“`);
  }
}

if (fails) {
  console.log(`testlauf5-test: ${fails} FEHLER (${checks} Prüfungen)`);
  process.exit(1);
}
console.log(`testlauf5-test: alles gut (${checks} Prüfungen)`);
