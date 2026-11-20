// Prüft BrunnenTV am Navi-Ziel der Reise ohne Grafik (src/world/xxl/brunnentv.js, Game.startBrunnenTV):
// - Fahrplan: Bauchbinde, Megafon (Stimme der Taste H, eigener Untertitel), Jubel im Chat („BRUNNENTV! 💦“), NOMI,
//   Ende – jeder Moment genau einmal, zu seiner Zeit; Fenster, Megafon und Kopf laufen in der richtigen Reihenfolge
//   (das Megafon ist erst zu sehen, wenn das Fenster offen ist, und weg, bevor es wieder hochgeht).
// - Überspringen früh (gleich nach TV.skip), spät (kurz vor dem Ende) und gar nicht: jedes Mal derselbe Endzustand –
//   keine Folge mehr, Bauchbinde weg, der Wagen genau einmal freigegeben – und danach beginnt die nächste Bieterrunde
//   (das erste Gebot frühestens TV.pause Sekunden nach der Freigabe).
// - Kameras: Für jeden Ort der Karte (Insel und Haltepunkt wie plan.js squareOf) stehen die drei Kameras außerhalb des
//   Wagens und nie im Brunnen, und Totale und Brunnen-Kamera haben Fenster und Brunnen im Bild.
import { PerspectiveCamera } from 'three';
import { places, townLen } from '../src/map/graph.js';
import { Trip, J } from '../src/game/trip.js';
import { Game } from '../src/game/game.js';
import { TV, windowAt, megaphoneAt, lookAt, shotAt, tvShots, shotPose, dollyFor } from '../src/world/xxl/brunnentv.js';
import { squareOf } from '../src/world/xxl/plan.js';
import { FOUNTAIN_R, goalKind, goalName } from '../src/world/kit/layout.js';
import { MEGA } from '../src/models/miniAdam.js';

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
function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const NONE = [];
const noop = () => {};
const loose = (base = {}) => new Proxy(base, { get: (t, k) => (k in t ? t[k] : noop) });

// --- Fahrplan ohne Spiel: Fenster, Megafon, Kopf, Kameras ------------------------------------------------------------
{
  const vis = (t) => megaphoneAt(t) >= MEGA.show;
  let firstVis = -1;
  let lastVis = -1;
  for (let t = 0; t <= TV.end + 0.5; t += 0.01) {
    if (vis(t)) {
      if (firstVis < 0) firstVis = t;
      lastVis = t;
      ok(windowAt(t) > 0.999, `Megafon zu sehen bei ${t.toFixed(2)} s, das Fenster ist erst ${windowAt(t).toFixed(2)} offen`);
    }
  }
  ok(firstVis > TV.window.down[1] - 0.2 && firstVis < TV.cams.fenster && lastVis < TV.window.up[0], `Megafon zu sehen von ${firstVis.toFixed(2)} bis ${lastVis.toFixed(2)} s`);
  ok(megaphoneAt(TV.line) > 0.999 && megaphoneAt(TV.nomi) > 0.999 && lookAt(TV.line) > 0.999, 'Beim Megafon-Satz ist das Megafon nicht am Mund oder der Kopf nicht am Fenster');
  ok(windowAt(0) === 0 && windowAt(TV.end) === 0 && megaphoneAt(TV.end) === 0 && lookAt(TV.end) === 0, 'Am Ende der Folge ist das Fenster offen oder das Megafon oben');
  ok(TV.card < TV.line && TV.line < TV.chat && TV.chat < TV.nomi && TV.nomi < TV.back[0] && TV.back[1] <= TV.end && TV.skip < TV.card, 'Reihenfolge der Momente');
  ok(shotAt(0) === 'totale' && shotAt(TV.line) === 'fenster' && shotAt(TV.nomi) === 'brunnen' && shotAt(TV.back[0] + 0.01) === 'zurueck', 'Kameras: Totale, Fenster, Brunnen, zurück');
}
// Kameras für jeden Ort: Brunnen (Mitte, Radius des Hauptbrunnens) im Rahmen des haltenden Wagens
const cams = { places: 0, minFountain: Infinity, maxAngle: 0, maxPortrait: 0 };
// Handy hochkant (390 × 844): halbe Bildbreite in Grad bei 78° senkrecht, so weit fahren die Kameras zurück (dollyFor)
const PORTRAIT = 390 / 844;
const portraitHalf = (Math.atan(Math.tan((78 * Math.PI) / 360) * PORTRAIT) * 180) / Math.PI;
{
  const CAR = { half: 0.95, front: 2.4, roof: 1.5 };
  const WINDOW = [-0.86, 1.12, 0.05];
  const angle = (pos, look, p) => {
    const a = Math.atan2(look[0] - pos[0], -(look[2] - pos[2]));
    const b = Math.atan2(p[0] - pos[0], -(p[2] - pos[2]));
    let d = b - a;
    d -= Math.round(d / (2 * Math.PI)) * 2 * Math.PI;
    return Math.abs((d * 180) / Math.PI);
  };
  for (const p of places) {
    const len = townLen(p.pop);
    const sec = { kind: 'stadt', place: p.i, s0: 1000, s1: 1000 + len, spotS: 1000 + Math.round(len * 0.6) };
    const sq = squareOf(sec);
    const f = { x: sq.x - J.L0, z: -(sq.s - sq.stop) };
    const fr = FOUNTAIN_R[goalKind(p)];
    const S = tvShots(f, sq.r);
    cams.places++;
    for (const [name, s] of Object.entries(S)) {
      const dolly = dollyFor(PORTRAIT, s.dolly);
      ok(dollyFor(16 / 9, s.dolly) === 1 && dolly >= 1 && dolly <= s.dolly && (s.dolly === 1 || dolly > 1), `${name}: zurückfahren quer ${dollyFor(16 / 9, s.dolly)}, hochkant ${dolly}`);
      for (const t of [s.t[0], (s.t[0] + s.t[1]) / 2, s.t[1]]) {
        // quer wie gebaut, hochkant zurückgefahren: beide Male außerhalb von Wagen und Brunnen, über dem Boden
        for (const k of [1, dolly]) {
          const { pos, look } = shotPose(s, t, undefined, k);
          const fmt = k === 1 ? 'quer' : 'hochkant';
          const inCar = Math.abs(pos[0]) < CAR.half && Math.abs(pos[2]) < CAR.front && pos[1] < CAR.roof;
          ok(!inCar && pos[1] > 0.5, `${p.name}: Kamera ${name} (${fmt}) im Wagen oder am Boden`);
          const dF = Math.hypot(pos[0] - f.x, pos[2] - f.z) - fr;
          cams.minFountain = Math.min(cams.minFountain, dF);
          ok(dF > 0.3, `${p.name}: Kamera ${name} (${fmt}) steht im Brunnen (${dF.toFixed(2)} m vom Becken)`);
          ok(Math.hypot(look[0] - pos[0], look[1] - pos[1], look[2] - pos[2]) > 0.5, `${p.name}: Kamera ${name} ohne Blickrichtung`);
          if (name === 'fenster') continue;
          // Fenster und Mitte des Brunnens im Bild: quer gut 86° breit, hochkant nur so breit wie portraitHalf
          const aw = angle(pos, look, WINDOW);
          const af = angle(pos, look, [f.x, 0.5, f.z]);
          if (k === 1) cams.maxAngle = Math.max(cams.maxAngle, aw, af);
          else cams.maxPortrait = Math.max(cams.maxPortrait, aw, af);
          const lim = k === 1 ? 40 : portraitHalf - 3;
          ok(aw < lim && af < lim, `${p.name}: Kamera ${name} (${fmt}) hat Fenster (${aw.toFixed(0)}°) oder Brunnen (${af.toFixed(0)}°) nicht im Bild`);
        }
      }
    }
  }
}

// --- Fahrplan im Spiel: Momente, Überspringen, nächste Runde ---------------------------------------------------------
const DT = 1 / 30;
function episode(skipAt, seed) {
  Math.random = mulberry32(seed);
  const trip = new Trip({ rng: Math.random });
  const log = [];
  let released = 0;
  const camera = new PerspectiveCamera(60, 16 / 9, 0.1, 3000);
  const at = () => +(game.brunnenT()).toFixed(3);
  const game = new Game({
    traffic: loose({ cars: NONE, update: () => NONE, nearby: () => NONE, police: () => null, megafon: () => 0 }),
    scenery: loose({ request: () => 1, landmarkSpot: (s) => s, placed: () => null }),
    road: loose(),
    sky: loose(),
    rain: loose(),
    windshield: loose({ firmware: 0, manual: () => 'wipe' }),
    cockpit: loose({ nomi: loose() }),
    audio: loose({ megafon: () => log.push({ k: 'horn', t: at() }), brunnenJingle: () => log.push({ k: 'jingle', t: at() }) }),
    speech: loose({ say: (text, voice) => (log.push({ k: 'say', voice, text, t: at() }), 2.5), busy: false, queue: NONE, current: null }),
    ui: loose({
      brunnenTV: (n, name) => log.push({ k: 'card', n, name, t: at() }),
      megafon: (text, dur, buyer, label) => log.push({ k: 'sub', text, label, t: at() }),
      chat: (m) => log.push({ k: 'chat', text: m.text, t: at() }),
      nomi: (text) => log.push({ k: 'nomi', text, t: at() }),
    }),
    fx: loose(),
    pickups: loose({ update: () => NONE }),
    world: { trip: () => trip, stopping: () => false, release: () => released++, square: () => null, town: () => null },
  });
  game.start({ upgrades: {}, best: {} });
  const p = game.player;
  p.s = trip.s;
  p.x = trip.x;
  p.speed = 0;
  const nv = game.navi;
  // ein Ziel steht (das erste Gebot), der Wagen hält an seinem Brunnen: Ankunft und Folge wie in der Fahrt
  const target = nv.targets.find((t) => t.name === 'Würzburg');
  nv.stop(target.place);
  const sec = { kind: 'stadt', place: target.place, s0: 0, s1: 800, spotS: 480 };
  game.halt = { sec, still: 0 };
  game.arriveAtFountain();
  ok(game.tv && game.tv.n === 1 && game.tv.goal === goalName(places[target.place]) && game.tv.goal.endsWith(', Würzburg'), 'Ankunft ohne Folge oder ohne den Brunnen als Ziel');
  log.length = 0;
  const ctl = { steer: 0, throttle: 0, brake: 1, reverse: false, horn: false, wiper: false, megafon: false, ladestopp: false, device: null, kappa: 0, grade: 0 };
  let endT = -1;
  let releaseT = -1;
  let bidT = -1;
  for (let i = 0; i < 40 * 30; i++) {
    if (game.tv && skipAt !== null && game.brunnenT() >= skipAt && !game.tv.skip) game.skipBrunnenTV();
    const before = !!game.tv;
    const tb = game.brunnenT();
    game.update(DT, ctl, camera);
    if (before && !game.tv) {
      endT = tb + DT;
      releaseT = game.t;
    }
    if (!game.tv && nv.target && bidT < 0) {
      bidT = game.t;
      break;
    }
  }
  return { log, released, endT, releaseT, bidT, game, nv };
}

const runs = { none: null, early: null, late: null };
for (const [name, skipAt] of [['none', null], ['early', TV.skip + 0.05], ['late', TV.nomi + 1.5]]) {
  const r = episode(skipAt, 4711);
  runs[name] = r;
  const card = r.log.filter((e) => e.k === 'card');
  const subs = r.log.filter((e) => e.k === 'sub');
  const william = r.log.filter((e) => e.k === 'say' && e.voice === 'william');
  const cheer = r.log.filter((e) => e.k === 'chat' && e.text === 'BRUNNENTV! 💦');
  const nomi = r.log.filter((e) => e.k === 'nomi' && e.t >= TV.nomi - 0.01);
  const end = skipAt === null ? TV.end : skipAt;
  // Endzustand: keine Folge, Bauchbinde weg, genau einmal freigegeben – danach die nächste Bieterrunde
  ok(!r.game.tv && r.released === 1 && card.length && card[card.length - 1].n === 0, `${name}: Endzustand (Folge ${!!r.game.tv}, ${r.released}× freigegeben, Bauchbinde ${card.length ? card[card.length - 1].n : '–'})`);
  ok(Math.abs(r.endT - end) < 2.5 * DT, `${name}: Folge endet bei ${r.endT.toFixed(2)} s statt ${end.toFixed(2)} s`);
  ok(r.bidT > 0 && r.bidT - r.releaseT >= TV.pause - DT && r.bidT - r.releaseT < 12, `${name}: nächstes Gebot ${(r.bidT - r.releaseT).toFixed(1)} s nach der Freigabe`);
  // jeder Moment genau einmal zu seiner Zeit, wenn er vor dem Ende lag – sonst gar nicht
  const once = (list, t0, what) => {
    if (end > t0 || (what === 'NOMI' && end > TV.nomi)) ok(list.length === 1 && Math.abs(list[0].t - t0) < 2 * DT, `${name}: ${what} ${list.length}× (${list.map((e) => e.t).join(', ')} s, erwartet ${t0} s)`);
    else ok(list.length === 0, `${name}: ${what} nach dem Überspringen`);
  };
  once(card.filter((e) => e.n > 0), TV.card, 'Bauchbinde');
  once(william, TV.line, 'Megafon-Satz');
  once(subs, TV.line, 'Megafon-Untertitel');
  once(cheer, TV.chat, '„BRUNNENTV! 💦“ im Chat');
  // (NOMI gongt erst, ihr Satz kommt 0,35 s danach: Game.say)
  once(nomi, TV.nomi + 0.35, 'NOMI');
  if (end > TV.card) ok(card[0].name === 'Würzburg', `${name}: Bauchbinde „${card[0].name}“`);
  if (end > TV.line) {
    ok(/BrunnenTV/.test(subs[0].label) && /Folge 1/.test(subs[0].label) && !/Megafon-Wunsch/.test(subs[0].label), `${name}: Untertitel des Megafons „${subs[0].label}“`);
    ok(william[0].text === subs[0].text && !/\{|\}/.test(subs[0].text), `${name}: Megafon-Satz „${subs[0].text}“`);
  }
  if (end > TV.chat) ok(r.log.filter((e) => e.k === 'chat' && e.t >= TV.chat && e.t < TV.chat + 3.5).length >= 3, `${name}: der Chat jubelt kaum`);
}

// --- Ausgabe ---------------------------------------------------------------------------------------------------------
const tl = (r) => `Ende ${r.endT.toFixed(2)} s, nächstes Gebot ${(r.bidT - r.releaseT).toFixed(1)} s danach`;
console.log(`BrunnenTV-Fahrplan: Bauchbinde ${TV.card} s, Megafon ${TV.line} s, Chat ${TV.chat} s, NOMI ${TV.nomi} s, Ende ${TV.end} s; Fenster offen ${TV.window.down.join('–')} s, Megafon in der Hand ab ${MEGA.show}`);
console.log(`Überspringen: ohne (${tl(runs.none)}) · früh bei ${(TV.skip + 0.05).toFixed(2)} s (${tl(runs.early)}) · spät bei ${(TV.nomi + 1.5).toFixed(1)} s (${tl(runs.late)}) – derselbe Endzustand`);
console.log(`Kameras an ${cams.places} Orten: mindestens ${cams.minFountain.toFixed(2)} m vom Becken, Fenster und Brunnen höchstens ${cams.maxAngle.toFixed(0)}° neben der Blickrichtung (hochkant zurückgefahren ${cams.maxPortrait.toFixed(0)}° von ${portraitHalf.toFixed(0)}°)`);
console.log(fails ? `${fails} Fehler (${checks} Prüfungen)` : `brunnen-test: alles grün (${checks} Prüfungen)`);
process.exit(fails ? 1 : 0);
