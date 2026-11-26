// Testlauf 5 (die Probefahrt des Besitzers vom 24.11.2026 abends), ohne Grafik: node tools/testlauf5-test.mjs
// 1. „Wenn man in den Gegenverkehr kommt, fährt man einfach durch das entgegenkommende Auto. Hier bräuchten wir eine
//    bessere Lösung mit mehr Schaden.“ Wer frontal in einen Entgegenkommenden fährt (world/xxl/gegenverkehr.js meldet
//    headOn und die Annäherung), steht sofort und federt zurück, der andere ebenso; durchfahren geht nie, auch nicht mit
//    durchgetretenem Strompedal, bei voller, halber oder knapper Überdeckung. Die Werkstatt rechnet nach der Annäherung
//    (data.js frontalCost: teurer als jeder gewöhnliche Rempler, frontal auf der Landstraße der teuerste), ab 100 km/h
//    kostet er zwei Karosserie-Punkte; OMI und der Chat haben eigene Sätze, Mini Adam erschrickt. Seitlich gestreift
//    bleibt ein seitlicher Rempler. Die Entgegenkommenden bleiben in ihrer Spur (nie in der des Spielers).
// 2. „Die Kosten sind generell noch ein wenig zu günstig“: Rempler, Kratzer und Bußgelder kosten 33–50 % mehr als vor
//    dem 24.11. (Rempler 150 → 210 €, Kratzer 25 → 35 €, Blitzer 15 → 20 €, Verwarngeld 10 → 15 €).
// 3. „Blitzer sollte es auch in der Stadt und auf der Landstraße geben“: In manchen Orten (Tempo 50) und auf manchen
//    Landstraßen (Tempo 100) steht ein fester Blitzer (world/xxl/blitzer.js) – je Ort bzw. Landstraße immer derselbe an
//    derselben Stelle, im Mittel höchstens etwa einer je 15 km. Die Welt stellt ihn auf (Schilderplan 'blitzer'), der
//    Ortsplan hält seinen Platz frei, und das Spiel misst genau dort: zu schnell blitzt es wie an der Autobahn (Blitz,
//    Bußgeld, Foto, Chat), langsam genug gibt es das Lob. Vorher warnt nur der Radarwarner.
// 4. „Jeder Stream sollte an einem anderen Ort starten“: Der erste Stream beginnt in Erlensee, jeder weitere im nächsten
//    Ort der Liste (game/starts.js, der letzte steht im Spielstand) – nie zweimal hintereinander im selben. Aus jedem
//    Startort beginnt die Fahrt im Ladepark (Startszene), der Ortsplan stellt Park und Brunnenplatz, die Fahrt findet
//    auf die Autobahn, und im Spiel kommt das erste Gebot auf einen Ort in der Nähe (nie den Startort).
// 5. „Gestalte die Orte noch unterschiedlicher, damit sie nicht alle gleich aussehen“: Jeder Ort hat ein Ortsbild
//    (kit/layout.js lookOf: in Deutschland die erste Bauweise seines Steckbriefs, kit/steckbriefe-de.js; im Ausland aus
//    der Gegend – nie je Besuch neu): Fachwerk, Schiefer, Kurort, Gründerzeit, Backstein, Barock, Plattenbau, … oder bunt
//    gemischt. Die Häuser tragen die Kleidung der Bauweisen ihres Orts (town.js name@ortsbild), Laternen und das Grün
//    zwischen ihnen folgen dem Steckbrief.
// 6. „Gib auch die Ladesäule manchmal vor und manchmal hinter dem Brunnen“: Je Ort fest (map/parks.js postAt) steht der
//    Park mit der Säule vor dem Brunnenplatz am Ortsanfang oder dahinter vor dem Ortsende (in Dörfern immer davor). Park,
//    Stele, Tafel („Ladesäule 50 m“ hinter dem Platz), geplanter Halt (postS), Navi und Ortsplan folgen ihm; nichts davon
//    liegt auf dem Brunnenplatz. (Halt erst am Brunnen, dann an der Säule: stopp-test; Laden mit L dort: laden2-test.)
import { Group } from 'three';
import { Trip, PROFILES } from '../src/game/trip.js';
import { findPlace } from '../src/map/graph.js';
import { Player, RECOIL } from '../src/game/player.js';
import { Gegenverkehr, twoWay, oncomingX } from '../src/world/xxl/gegenverkehr.js';
import { CAR_TYPES } from '../src/models/vehicles.js';
import { autoTarget } from '../src/world/xxl/plan.js';
import { REPARATUR, BUSSGELD, BOARD, CHAT, frontalCost, damageCount } from '../src/data.js';
import { camerasOf, camerasAlong, triggerKmh, BLITZER } from '../src/world/xxl/blitzer.js';
import { signsAlong } from '../src/world/xxl/signplan.js';
import { chargeOf, steleOf } from '../src/world/xxl/charge.js';
import { squareOf } from '../src/world/xxl/plan.js';
import { places } from '../src/map/graph.js';
import { DAMAGE_LINES } from '../src/game/damage.js';
import { mulberry32, makeStream, DRIVERS } from './stream-sim.mjs';
import { STARTS, nextStart, startNode, startPlace } from '../src/game/starts.js';
import { ROLL_T, rollPose } from '../src/world/xxl/charge.js';
import { STREET } from '../src/world/kit/layout.js';

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

// --- 2. Höhere Kosten ------------------------------------------------------------------------------------------------
console.log('2. Kosten:');
{
  const before = { bump: 150, mark: 25, blitzer: 15, verwarn: 10 };
  const now = { bump: REPARATUR.bump, mark: REPARATUR.mark, blitzer: BUSSGELD.blitzer, verwarn: BUSSGELD.verwarn };
  // 24.11. um 33–50 % teurer, am 25.11. vom Besitzer festgelegt: Rempler 400–500 €, Blitzerfoto 100 € (der Kratzer
  // wächst mit dem Rempler mit), Verwarngeld 50 €
  for (const k of ['mark']) ok(now[k] / before[k] >= 1.3, `${k}: ${before[k]} → ${now[k]} €`);
  ok(now.bump >= 400 && now.bump <= 500, `bump: ${now.bump} € statt 400–500 €`);
  ok(now.blitzer === 100, `blitzer: ${now.blitzer} € statt 100 €`);
  ok(now.verwarn === 50, `verwarn: ${now.verwarn} € statt 50 €`);
  console.log(`  ${Object.keys(before).map((k) => `${k} ${before[k]} → ${now[k]} €`).join(', ')}`);
}

// --- 3. Blitzer im Ort und auf der Landstraße ---------------------------------------------------------------------------
console.log('3. Blitzer im Ort und auf der Landstraße:');
{
  // eine lange Reise über viele Ziele: wie viele Blitzer stehen am Weg, wo, und bleiben sie dieselben?
  Math.random = mulberry32(33);
  const trip = new Trip({ rng: Math.random });
  // (mit Gersfeld, Bischofsheim, Bad Hersfeld, Alsfeld und Eltville: Orte an Landstraßen, damit genug davon gefahren
  // wird – ob dort ein Blitzer steht, entscheidet der Name der Straße)
  const goals = ['Fulda', 'Gersfeld', 'Bischofsheim in der Rhön', 'Bad Hersfeld', 'Alsfeld', 'Kassel', 'Marburg', 'Gießen', 'Limburg an der Lahn', 'Koblenz', 'Eltville am Rhein', 'Wetzlar', 'Aschaffenburg', 'Würzburg', 'Schweinfurt', 'Bamberg'].map(findPlace).filter((i) => i >= 0);
  let gi = 0;
  trip.setTarget(goals[gi]);
  let s = trip.s;
  const km = { all: 0, off: 0 };
  const seen = new Map();
  const bad = [];
  for (let i = 0; i < (240 * 60) / DT; i++) {
    const prof = trip.profile();
    const v = (prof.limit > 0 ? prof.limit : 130) / 3.6;
    s += v * DT;
    trip.update(s, autoTarget(trip));
    if (trip.target < 0) trip.setTarget(goals[(gi = (gi + 1) % goals.length)]);
    km.all += (v * DT) / 1000;
    if (trip.section.kind !== 'ab') km.off += (v * DT) / 1000;
    for (const c of camerasAlong(trip.cur.sections, s - 5, s + 300)) {
      if (seen.has(c.key)) continue;
      const sec = trip.cur.sections.find((q) => q.s0 <= c.s && q.s1 >= c.s);
      seen.set(c.key, { ...c, sec, again: camerasOf(sec) });
      // dieselbe Stelle, wenn eine neue Fahrt denselben Ort bzw. dieselbe Landstraße baut
      const twin = { ...sec, id: -1 };
      const t = camerasOf(twin)[0];
      if (!t || t.u !== c.u || t.limit !== c.limit) bad.push(`${c.kind} ${sec.place}: neu gebaut anders`);
      // die Welt stellt ihn genau dort auf, wo das Spiel misst
      const w = signsAlong(trip, trip.cur, c.s - 1, c.s + 1).filter((e) => e.kind === 'blitzer');
      if (w.length !== 1 || Math.abs(w[0].s - c.s) > 1e-9 || w[0].x !== c.x) bad.push(`${c.kind}: Welt ${w.length} Einträge`);
      // im Ort fern von Ladepark, Stele und Brunnenplatz, im Streifen; auf der Landstraße fern der Enden
      if (c.kind === 'stadt') {
        const ch = chargeOf(sec);
        const st = steleOf(sec);
        const q = squareOf(sec);
        const u = c.s - sec.s0;
        if (ch && Math.abs(u - ch.u) < 12 + BLITZER.keep - 1e-9) bad.push(`Ort ${places[sec.place].name}: am Ladepark (${u} / ${ch.u})`);
        if (st && Math.abs(u - st.u) < BLITZER.keep - 1e-9) bad.push(`Ort ${places[sec.place].name}: an der Stele`);
        if (q && c.s > q.s0 - BLITZER.keep && c.s < q.s1 + BLITZER.keep) bad.push(`Ort ${places[sec.place].name}: am Brunnenplatz`);
        if (c.limit !== 50 || c.x < 11.2 || c.x > 13.1) bad.push(`Ort: Limit ${c.limit}, x ${c.x}`);
      } else if (c.s - sec.s0 < BLITZER.landEdge - 1e-9 || sec.s1 - c.s < BLITZER.landEdge - 1e-9 || c.limit !== 100) bad.push(`Landstraße: ${c.s - sec.s0} m nach dem Anfang, Limit ${c.limit}`);
    }
  }
  const list = [...seen.values()];
  const nT = list.filter((c) => c.kind === 'stadt').length;
  const nL = list.filter((c) => c.kind === 'land').length;
  ok(nT >= 2 && nL >= 2, `zu wenig Blitzer: ${nT} im Ort, ${nL} auf der Landstraße (${km.all.toFixed(0)} km)`);
  ok(list.length <= km.all / 15 + 1, `zu viele Blitzer: ${list.length} auf ${km.all.toFixed(0)} km`);
  ok(list.every((c) => c.again === camerasOf(c.sec)), 'Blitzer je Bild neu gewürfelt');
  ok(bad.length === 0, `Blitzer falsch: ${bad.slice(0, 4).join(' | ')} (${bad.length})`);
  console.log(`  ${km.all.toFixed(0)} km Reise (${km.off.toFixed(0)} km abseits der Autobahn): ${nT} Blitzer im Ort, ${nL} auf der Landstraße – einer je ${(km.all / Math.max(1, list.length)).toFixed(1)} km (abseits der Autobahn je ${(km.off / Math.max(1, list.length)).toFixed(1)} km)`);

  // der Ortsplan hält den Platz frei (Stadtbaukasten ohne Grafik, wie citykit-test)
  {
    const ctx = new Proxy({}, { get: (t, k) => (k === 'measureText' ? (q) => ({ width: String(q).length * 10 }) : k === 'createLinearGradient' || k === 'createRadialGradient' ? () => ({ addColorStop() {} }) : k === 'getImageData' ? (x, y, w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }) : k in t ? t[k] : () => {}), set: (t, k, v) => ((t[k] = v), true) });
    globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => ctx, style: {} }) };
    const { W } = await import('../src/curve.js');
    const { createCityKit } = await import('../src/world/kit/city.js');
    const { townPlan } = await import('../src/world/xxl/towns.js');
    const { poleBlockers, aabb } = await import('../src/world/kit/layout.js');
    const K = createCityKit(W);
    const towns = list.filter((c) => c.kind === 'stadt').slice(0, 4);
    let blocked = 0;
    for (const c of towns) {
      const plan = townPlan(K, c.sec);
      blocked += poleBlockers(plan, { u: c.u, x: c.x }, (n) => K.info(n)).length;
    }
    ok(towns.length && blocked === 0, `Ortsplan: ${blocked} Dinge auf dem Platz eines Blitzers (${towns.length} Orte)`);
    console.log(`  Ortsplan: Platz frei in ${towns.map((c) => places[c.sec.place].name).join(', ')}`);
  }

  // im Spiel: zu schnell und langsam genug, mit und ohne Radarwarner (stream-sim; der brave Fahrer fährt das Tempo, das
  // ihm sein Begrenzer gibt – hier 20 km/h über dem Limit oder genau das Limit)
  for (const [radar, over, kind] of [[false, true, 'stadt'], [false, false, 'stadt'], [true, true, 'stadt'], [false, true, 'land'], [true, false, 'land']]) {
    // (der Stream mit dem ersten Keim, der in einer halben Stunde an einem Blitzer dieser Art vorbeikommt – Blitzer auf
    // der Landstraße sind ab Erlensee selten, und jede Änderung am Ablauf eines Streams mischt die Keime neu: darum
    // hinter den bewährten Keimen weitere der Reihe nach)
    let S = null;
    let cam = null;
    for (const seed of [5, 2, 3, 7, 11, 13, ...Array.from({ length: 50 }, (_, i) => 14 + i)]) {
      S = makeStream({ driver: DRIVERS.zuegig, seed, endless: true, upgrades: radar ? { radar: 1 } : {} });
      for (let i = 0; i < 30 * 60 && !cam && !S.game.over; i++) {
        S.step(1);
        // (der nächste Blitzer überhaupt: davor steht kein anderer, der den Wagen schon blitzt)
        const next = camerasAlong(S.trip.cur.sections, S.p.s - 50, S.p.s + 3000)[0];
        cam = next && next.kind === kind && next.s >= S.p.s + 400 ? next : null;
      }
      if (cam) break;
    }
    const g = S.game;
    const p = g.player;
    const what = `${kind === 'stadt' ? 'Ort' : 'Landstraße'}, ${radar ? 'mit' : 'ohne'} Radarwarner, ${over ? 'zu schnell' : 'langsam genug'}`;
    ok(!!cam, `${what}: kein Blitzer am Weg`);
    if (!cam) continue;
    const set = p.setLimits.bind(p);
    p.setLimits = (L) => {
      if (L.vmax < Infinity && L.posted) L.vmax = (L.posted + (over ? 20 : 0)) / 3.6;
      set(L);
    };
    const said0 = S.log.say.length;
    const toast0 = S.log.toast.length;
    const photos0 = g.stats.photos;
    const fines0 = g.breakdown.Bußgeld || 0;
    let warnS = null;
    const sayOrig = g.say.bind(g);
    g.say = (text, ...a) => {
      if (text === BOARD.blitzer && warnS === null) warnS = p.s;
      return sayOrig(text, ...a);
    };
    // das Blitzerfoto zeigt in seiner Datenzeile das Limit des Blitzers (main.js takePhoto)
    let shot = null;
    g.ui.photo = (kmh, clock, limit) => {
      shot = { kmh, limit };
    };
    let kmhAt = null;
    for (let i = 0; i < 400 * 30 && !g.over && p.s < cam.s + 60; i++) {
      const before = p.s;
      S.step(1 / 30);
      if (before < cam.s && p.s >= cam.s) kmhAt = p.kmh;
    }
    S.step(2);
    const flashed = g.stats.photos - photos0;
    const fine = (g.breakdown.Bußgeld || 0) - fines0;
    const praise = S.log.toast.slice(toast0).some((t) => /Nicht geblitzt/.test(t.text));
    ok(kmhAt !== null, `${what}: nicht am Blitzer vorbeigekommen`);
    if (over) ok(flashed === 1 && fine === -BUSSGELD.blitzer && kmhAt > triggerKmh(cam.limit), `${what}: ${flashed} Fotos, Bußgeld ${fine} € bei ${kmhAt && kmhAt.toFixed(0)} km/h (Limit ${cam.limit})`);
    if (over) ok(shot && shot.limit === cam.limit, `${what}: Foto mit Limit ${shot && shot.limit} statt ${cam.limit}`);
    else ok(flashed === 0 && fine === 0 && praise, `${what}: ${flashed} Fotos, Bußgeld ${fine} €, Lob ${praise}`);
    const warned = S.log.say.slice(said0).some((x) => x.text === BOARD.blitzer);
    if (radar) ok(warned && warnS !== null && cam.s - warnS > 100, `${what}: Warnung ${warned ? Math.round(cam.s - (warnS ?? cam.s)) + ' m vorher' : 'fehlt'}`);
    else ok(!warned, `${what}: OMI warnt ohne Radarwarner`);
    console.log(`  ${what}: Limit ${cam.limit} mit ${kmhAt && kmhAt.toFixed(0)} km/h → ${flashed ? `Blitz, Bußgeld ${-fine} €` : 'Lob'}${radar ? `, Warnung ${Math.round(cam.s - warnS)} m vorher` : ', keine Warnung'}`);
  }
}

// --- 4. Jeder Stream an einem anderen Ort ------------------------------------------------------------------------------
console.log('4. Startorte:');
{
  // die Reihe: zuerst Erlensee, dann nie zweimal hintereinander derselbe, und jeder kommt dran
  ok(nextStart(null) === 'Erlensee' && nextStart(undefined) === 'Erlensee' && nextStart('Atlantis') === 'Erlensee', 'der erste Stream beginnt nicht in Erlensee');
  let last = null;
  const seen = new Set();
  for (let i = 0; i < 2 * STARTS.length; i++) {
    const n = nextStart(last);
    ok(n !== last, `zweimal hintereinander ${n}`);
    seen.add(n);
    last = n;
  }
  ok(seen.size === STARTS.length && STARTS.length >= 8, `nur ${seen.size} verschiedene Startorte`);
  // der Spielstand merkt sich den letzten (save.js), Unsinn darin fällt auf den Anfang der Reihe zurück
  const { loadSave } = await import('../src/save.js');
  const stored = (v) => {
    globalThis.localStorage = { getItem: () => JSON.stringify(v), setItem() {} };
    return loadSave();
  };
  ok(nextStart(stored({ start: 'Gelnhausen' }).start) === STARTS[STARTS.indexOf('Gelnhausen') + 1], 'Spielstand: Startort nach Gelnhausen');
  ok(stored({ start: 42 }).start === null && nextStart(stored({}).start) === 'Erlensee', 'Spielstand: unbrauchbarer Startort');
  delete globalThis.localStorage;

  // jeder Startort: Ort in Deutschland, Fahrt beginnt im Ladepark (das Ausparken endet am Startpunkt in der Spur), der
  // Ortsplan stellt Park und Brunnenplatz, und der Autopilot findet auf die Autobahn
  const { W } = await import('../src/curve.js');
  const { createCityKit } = await import('../src/world/kit/city.js');
  const { townPlan } = await import('../src/world/xxl/towns.js');
  const K = createCityKit(W);
  const rows = [];
  for (const id of STARTS) {
    const ni = startNode(id);
    ok(ni >= 0 && startPlace(id) >= 0, `Startort ${id}: kein Knoten mit Ort`);
    if (ni < 0) continue;
    const trip = new Trip({ start: ni, rng: mulberry32(3) });
    const sec = trip.section;
    const name = places[sec.place] ? places[sec.place].name : id;
    ok(sec.kind === 'stadt' && sec.start && sec.place === startPlace(id) && trip.home === sec.place && places[sec.place].cc === 'DE', `${name}: Fahrt beginnt nicht im Ort`);
    const c = chargeOf(sec);
    ok(c && c.start && c.u > 40 && c.u < sec.s1 - sec.s0 - 40, `${name}: kein Ladepark am Start`);
    if (!c) continue;
    const pose = rollPose(c.u, ROLL_T);
    ok(Math.abs(pose.u + sec.s0) < 0.05 && Math.abs(pose.x - STREET.lane) < 0.05, `${name}: Ausparken endet bei u ${pose.u.toFixed(2)}, x ${pose.x.toFixed(2)}`);
    const plan = townPlan(K, sec);
    ok(plan.charge && Math.abs(plan.charge.u - c.u) < 1e-6 && plan.goal, `${name}: Ortsplan ohne Park oder Brunnenplatz`);
    let s = trip.s;
    for (let i = 0; i < 1200 && trip.section.kind !== 'ab'; i++) {
      s += 5;
      trip.update(s, autoTarget(trip));
    }
    ok(trip.section.kind === 'ab', `${name}: nach ${(s / 1000).toFixed(1)} km nicht auf der Autobahn`);
    rows.push(`${name} (${places[sec.place].pop} Einw., Park bei ${c.u.toFixed(0)} m, Autobahn nach ${(s / 1000).toFixed(1)} km)`);
  }
  console.log('  ' + rows.join(' · '));

  // im Spiel aus drei Startorten: das erste Gebot gilt einem Ort in der Nähe (nie dem Startort), der erste Brunnen kommt
  for (const id of ['Gelnhausen', 'Idstein', 'Wetzlar']) {
    const S = makeStream({ seed: 4, start: startNode(id), endless: true });
    const g = S.game;
    let first = null;
    for (let i = 0; i < 15 * 60 && !g.over && !S.log.tv.length; i++) {
      S.step(1);
      if (first === null && g.navi.target) first = g.navi.target.place;
    }
    const home = places[startPlace(id)].name;
    ok(first !== null && first !== S.trip.home, `${home}: erstes Gebot ${first === null ? 'fehlt' : 'auf den Startort'}`);
    ok(S.log.tv.length >= 1, `${home}: in 15 Minuten keine BrunnenTV-Folge`);
    console.log(`  Stream ab ${home}: erstes Ziel ${first !== null ? places[first].name : '–'}, Folge nach ${S.log.tv.length ? (S.log.tv[0].t / 60).toFixed(1) + ' min' : '–'}`);
  }
}

// --- 5. Verschiedene Ortsbilder ----------------------------------------------------------------------------------------
console.log('5. Ortsbilder:');
{
  const { lookOf, LOOKS, goalKind, profileOf } = await import('../src/world/kit/layout.js');
  const { townLen } = await import('../src/map/graph.js');
  const { W } = await import('../src/curve.js');
  const { createCityKit } = await import('../src/world/kit/city.js');
  const K = createCityKit(W);
  // je Ortsbild die Orte der Karte (in Deutschland und überall), immer dasselbe für denselben Ort
  const byLook = new Map();
  for (const p of places) {
    const look = lookOf(p);
    ok(look === lookOf({ ...p }), `${p.name}: Ortsbild nicht fest`);
    if (!byLook.has(look)) byLook.set(look, []);
    byLook.get(look).push(p);
  }
  const de = new Set(places.filter((p) => p.cc === 'DE').map(lookOf));
  ok(de.size >= 6, `nur ${de.size} Ortsbilder in Deutschland: ${[...de].join(', ')}`);
  for (const look of Object.keys(LOOKS)) ok(byLook.has(look), `Ortsbild ${look} kommt nirgends vor`);
  console.log('  ' + Object.keys(LOOKS).map((k) => `${LOOKS[k].title} ${(byLook.get(k) || []).length}`).join(' · ') + ` (Deutschland: ${de.size} Ortsbilder)`);
  // Beispiele: Bad Vilbel ist ein Kurort, Gelnhausen Fachwerk, Siegen Schiefer, Hamburg Backstein, Hanau (im Krieg zu
  // drei Vierteln zerstört) Wiederaufbau, Aschaffenburg und Mainz Sandstein, Potsdam Barock, Binz Bäderarchitektur
  const want = { 'Bad Vilbel': 'kurort', Gelnhausen: 'fachwerk', Siegen: 'schiefer', Hamburg: 'brick', Hanau: 'nachkrieg', Aschaffenburg: 'sandstein', Mainz: 'sandstein', Potsdam: 'barock', Binz: 'baeder' };
  for (const [name, look] of Object.entries(want)) {
    const p = places.find((q) => q.name === name);
    ok(p && lookOf(p) === look, `${name}: Ortsbild ${p && lookOf(p)} statt ${look}`);
  }
  // die Pläne: die Häuser tragen die Kleidung ihres Ortsbilds, ein Ort bleibt bei seinen Häusern
  const isHouse = (it) => ['village', 'shop', 'town', 'city'].includes(K.info(it.name).kind) && !K.info(it.name).centre;
  const rows = [];
  for (const look of Object.keys(LOOKS)) {
    const p = (byLook.get(look) || []).filter((q) => q.cc === 'DE' || look === 'alpine').sort((a, b) => a.pop - b.pop)[Math.floor(((byLook.get(look) || []).length - 1) / 2)] || (byLook.get(look) || [])[0];
    if (!p) continue;
    const plan = K.planTown(p, { len: townLen(p.pop), mainKind: goalKind(p), pavement: false, signs: false });
    const houses = plan.items.filter(isHouse);
    const dressed = houses.filter((it) => it.name.endsWith('@' + look)).length;
    // ein gekleidetes Haus trägt eine Bauweise seines Steckbriefs (Rathaus, Kirche, Gasthof bleiben, wie sie sind)
    const mine = new Set(profileOf(p).looks.map(([l]) => l));
    const fremd = houses.filter((it) => it.name.includes('@') && !mine.has(it.name.split('@')[1]));
    ok(fremd.length === 0, `${p.name}: Häuser fremder Bauweise ${fremd.slice(0, 3).map((it) => it.name).join(', ')}`);
    const share = profileOf(p).looks.find(([l]) => l === look)[1];
    const bad = plan.items.filter((it) => { const i = K.info(it.name); return !(i.w > 0 && i.d > 0 && i.h > 0 && Number.isFinite(i.h)); });
    ok(plan.look === look && bad.length === 0, `${p.name}: Plan ${plan.look}, ${bad.length} Bausteine ohne Maße`);
    if (look === 'default') ok(houses.filter((it) => !it.name.includes('@')).length / houses.length > share * 0.6, `${p.name}: gemischter Ort fast nur in Kleidung`);
    else ok(houses.length > 0 && dressed / houses.length > share * 0.6, `${p.name} (${look}): nur ${dressed} von ${houses.length} Häusern im Ortsbild (Anteil ${share})`);
    const again = K.planTown(p, { len: townLen(p.pop), mainKind: goalKind(p), pavement: false, signs: false });
    ok(again.items.length === plan.items.length && again.items.every((it, i) => it.name === plan.items[i].name && it.x === plan.items[i].x && it.z === plan.items[i].z), `${p.name}: zweiter Plan anders`);
    const trees = plan.items.filter((it) => /^streetTree/.test(it.name)).length;
    const cars = plan.items.filter((it) => /^car/.test(it.name)).length;
    rows.push(`${LOOKS[look].title}: ${p.name} (${dressed}/${houses.length} Häuser, ${trees} Bäume, ${cars} Autos)`);
  }
  console.log('  ' + rows.join(' · '));
}

// --- 6. Ladesäule vor oder hinter dem Brunnen -------------------------------------------------------------------------
console.log('6. Ladesäule vor oder hinter dem Brunnen:');
{
  const { postAt, POST, POST_AFTER } = await import('../src/map/parks.js');
  const { townLen, spotIn } = await import('../src/map/graph.js');
  const { W } = await import('../src/curve.js');
  const { createCityKit } = await import('../src/world/kit/city.js');
  const { townPlan } = await import('../src/world/xxl/towns.js');
  const { poleBlockers } = await import('../src/world/kit/layout.js');
  const { TOWN_SIGN_X } = await import('../src/world/xxl/signplan.js');
  const K = createCityKit(W);
  // je Ort fest; hinter dem Platz nur in Orten ab 500 m, dort etwa die Hälfte
  let after = 0;
  let long = 0;
  const bad = [];
  for (const p of places) {
    const len = townLen(p.pop);
    const spot = spotIn(len);
    const pa = postAt(p.i, len, spot);
    if (JSON.stringify(pa) !== JSON.stringify(postAt(p.i, len, spot))) bad.push(`${p.name}: nicht fest`);
    if (len >= 500) long++;
    if (!pa.after) {
      if (pa.u !== POST.u || pa.sign !== POST.sign) bad.push(`${p.name}: vor dem Brunnen bei ${pa.u}`);
      continue;
    }
    after++;
    if (len < 500) bad.push(`${p.name}: hinter dem Brunnen in einem Dorf`);
    // der Platz (plan.js squareOf) endet vor Tafel und Stele, der Park vor dem Ortsende
    const sec = { kind: 'stadt', place: p.i, s0: 0, s1: len, spotS: spot, postAt: pa };
    const q = squareOf(sec);
    const st = steleOf(sec);
    if (!(pa.u - pa.sign > q.s1 + 2 && st.u > q.s1 + 2 && pa.u + 12 < len - 30 && Math.abs(pa.halt - pa.u - (POST.halt - POST.u)) < 1e-9)) bad.push(`${p.name}: Säule bei ${pa.u}, Tafel ${pa.u - pa.sign}, Platz bis ${q.s1.toFixed(0)}, Ort ${len}`);
  }
  ok(bad.length === 0, `Säulen falsch: ${bad.slice(0, 4).join(' | ')} (${bad.length})`);
  ok(after > 0.3 * long && after < 0.7 * long, `hinter dem Brunnen ${after} von ${long} Orten ab 500 m`);
  console.log(`  hinter dem Brunnen: ${after} von ${long} Orten ab 500 m (Dörfer immer davor)`);

  // auf der Fahrt: Park, Stele, Tafel und Halt folgen der Säule; der Ortsplan stellt den Park dort und hält der Tafel
  // ihren Platz frei
  // (Hammersbach ist ein Dorf: die Säule steht davor; in Würzburg steht sie dahinter)
  for (const target of ['Hammersbach', 'Würzburg']) {
    Math.random = mulberry32(5);
    const trip = new Trip({ rng: Math.random });
    const want = findPlace(target);
    trip.setTarget(want);
    let sAt = trip.s;
    let sec = null;
    for (let i = 0; i < 60000 && !sec; i++) {
      sAt += 5;
      trip.update(sAt, autoTarget(trip));
      sec = trip.cur.sections.find((c) => c.kind === 'stadt' && c.place === want && !c.start) || null;
    }
    ok(!!(sec && sec.postAt), `${target}: Ort nicht erreicht`);
    if (!sec || !sec.postAt) continue;
    const k = sec.postAt.after ? 'hinter' : 'vor';
    ok(k === (target === 'Würzburg' ? 'hinter' : 'vor'), `${target}: Säule ${k} dem Brunnen`);
    const pa = sec.postAt;
    const name = places[sec.place].name;
    const c = chargeOf(sec);
    const st = steleOf(sec);
    ok(c && c.u === pa.u && st.u === pa.u - 14 && Math.abs(sec.postS - (sec.s0 + pa.halt - 2)) < 1e-9, `${name}: Park ${c && c.u}, Stele ${st && st.u}, Halt ${sec.postS - sec.s0} statt bei ${pa.u}`);
    const signs = signsAlong(trip, trip.cur, sec.s0 - 200, sec.s1).filter((e) => e.kind === 'ladesaeule' && e.place === sec.place);
    ok(signs.length === 1 && Math.abs(signs[0].s - (sec.s0 + pa.u - pa.sign)) < 1e-6 && signs[0].texts[1] === pa.sign + ' m', `${name}: Tafel ${JSON.stringify(signs.map((e) => [e.s - sec.s0, e.texts]))}`);
    const plan = townPlan(K, sec);
    ok(plan.charge && plan.charge.u === pa.u, `${name}: Ortsplan ohne Park bei ${pa.u}`);
    if (pa.after) ok(poleBlockers(plan, { u: pa.u - pa.sign, x: TOWN_SIGN_X }, (n) => K.info(n)).length === 0, `${name}: Ortsplan stellt etwas auf die Tafel der Säule`);
    console.log(`  ${name}: Säule ${k} dem Brunnen bei u ${pa.u} (Brunnen bei ${(sec.spotS - sec.s0).toFixed(0)}, Tafel „Ladesäule ${pa.sign} m“ bei ${pa.u - pa.sign}, Halt bei ${(sec.postS - sec.s0).toFixed(2)})`);
  }
}

if (fails) {
  console.log(`testlauf5-test: ${fails} FEHLER (${checks} Prüfungen)`);
  process.exit(1);
}
console.log(`testlauf5-test: alles gut (${checks} Prüfungen)`);
