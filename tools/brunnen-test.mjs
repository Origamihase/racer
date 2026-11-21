// Prüft BrunnenTV am Navi-Ziel der Reise ohne Grafik (src/world/xxl/brunnentv.js, Game.startBrunnenTV):
// - Fahrplan: Bauchbinde, Mini Adams Gruß durchs Megafon (seine tiefe Stimme, eigener Untertitel), Jubel im Chat
//   („BRUNNENTV! 💦“), sein Ruf „Schöner Brunnen!“ (jede Folge: tief und langsam gesprochen, im Untertitel
//   „SCHÖÖÖÖÖÖÖNER BRUNNEN!!!!!“, der Chat ruft es nach – in der Einstellung „Brunnen“, solange das Megafon oben ist,
//   nach dem Gruß), OMI, Ende – jeder Moment genau einmal, zu seiner Zeit; Fenster, Megafon und Kopf laufen in der richtigen Reihenfolge
//   (das Megafon ist erst zu sehen, wenn das Fenster offen ist, und weg, bevor es wieder hochgeht).
// - Überspringen gibt es nicht (Besitzer, 21.11.2026; tools/testlauf3-test.mjs prüft, dass kein Weg dahin führt): Die
//   Folge endet bei TV.end im Endzustand – keine Folge mehr, Bauchbinde weg, der Wagen genau einmal freigegeben – und
//   danach beginnt die nächste Bieterrunde (das erste Gebot frühestens TV.pause Sekunden nach der Freigabe, spätestens
//   zum Ende des Bieterfensters). Den Ruf gibt es genau einmal, mit dem Echo im Chat.
// - Megafon als Ausstattung: kein Shop-Artikel, Taste H und Megafon-Wunsch ohne Upgrade in beiden Spielarten, ein
//   gekauftes gibt es genau einmal zurück (save.js refundMegafon); der Titel sagt es bis zum ersten Besuch im Shop, auch
//   nach dem Neuladen (save.megafonNote). Der Abspann der Reise zählt die Folgen (ABSPANN_REISE).
// - Der Name „Mini Adam – Navi ferngesteuert BrunnenTV XXL“ steht überall gleich: Seitentitel, Ladekarte, README,
//   INSIDER, package.json, Über das Spiel; der Titelbildschirm setzt ihn aus denselben Teilen zusammen.
// - Kameras: Für jeden Ort der Karte (Insel und Haltepunkt wie plan.js squareOf) stehen die drei Kameras außerhalb des
//   Wagens und nie im Brunnen, und Totale und Brunnen-Kamera haben Fenster und Brunnen im Bild. Nichts im Ort (Häuser,
//   Bäume, Laternen; der Plan wie towns.js townPlan) verstellt einer Kamera die Sicht auf Fenster und Brunnen.
import { PerspectiveCamera } from 'three';
import { places, townLen } from '../src/map/graph.js';
import { Trip, J } from '../src/game/trip.js';
import { Game, AUKTION, WAY } from '../src/game/game.js';
import { TV, windowAt, megaphoneAt, lookAt, shotAt, tvShots, shotPose, dollyFor, stillShot, stillKind, STILL } from '../src/world/xxl/brunnentv.js';
import { squareOf, Arrival, autoTarget } from '../src/world/xxl/plan.js';
import { Economy } from '../src/game/economy.js';
import { albumOf } from '../src/game/album.js';
import { FOUNTAIN_R, goalKind, goalName, sightBlockers } from '../src/world/kit/layout.js';
import { MEGA } from '../src/models/miniAdam.js';
import { SHOP, UPGRADE_LIMITS, AKTIONEN, GAME_NAME, GAME_TITLE, GAME_SUBTITLE, GAME_XXL, BOARD, BRUNNEN_NOMI, BRUNNEN_MEGAFON, SCHOENER_BRUNNEN, SCHOENNBRUN, VOICES, ABSPANN_REISE, fillTemplate } from '../src/data.js';
import { estimateSpeech } from '../src/speech.js';
import { readFileSync } from 'node:fs';
import { loadSave, storeSave, refundMegafon, megafonNoteSeen, MEGAFON_PRICE, DEFAULT_SAVE } from '../src/save.js';

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
  ok(TV.card < TV.line && TV.line < TV.chat && TV.chat < TV.nomi && TV.nomi < TV.back[0] && TV.back[1] <= TV.end, 'Reihenfolge der Momente');
  ok(shotAt(0) === 'totale' && shotAt(TV.line) === 'fenster' && shotAt(TV.nomi) === 'brunnen' && shotAt(TV.back[0] + 0.01) === 'zurueck', 'Kameras: Totale, Fenster, Brunnen, zurück');
}
// Kameras für jeden Ort: Brunnen (Mitte, Radius des Hauptbrunnens) im Rahmen des haltenden Wagens
const cams = { places: 0, minFountain: Infinity, maxAngle: 0, maxPortrait: 0, lines: 0 };
// Der Ort wie in der Welt (towns.js townPlan mit dem Baukasten der Stadt; ihre Schilder malen auf Canvas, hier ohne Bild)
const canvas = new Proxy({}, { get: (t, k) => (k === 'measureText' ? (x) => ({ width: String(x).length * 10 }) : k === 'getImageData' ? (x, y, w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }) : k.startsWith?.('create') ? () => ({ addColorStop() {} }) : k in t ? t[k] : noop), set: (t, k, v) => ((t[k] = v), true) });
globalThis.document ??= { createElement: () => ({ width: 0, height: 0, getContext: () => canvas, style: {} }) };
const { W } = await import('../src/curve.js');
const { createCityKit } = await import('../src/world/kit/city.js');
const { townPlan } = await import('../src/world/xxl/towns.js');
const city = createCityKit(W);
/**
 * Was die Sicht von a nach b (Punkte im Plan, [x, y, z]) verstellt: wie am Halt (citykit-test) alles Hohe im Grundriss,
 * Bäume und Laternen dort mit Stamm und Mast – und wo die Linie höher als 2 m ist, auch mit Krone und Arm (ganzer
 * Grundriss). Über das Becken des Zielbrunnens f schaut sie hinweg (over): unter seiner Höhe bleibt sie aus seiner Mitte.
 */
function sightOf(plan, f, fr, a, b, over = true) {
  const target = { x: b[0], z: b[2], r: 0, id: -1 };
  const out = sightBlockers(plan, target, [[a[0], a[2]]]).filter((i) => plan.items[i].fountain !== f.id).map((i) => plan.items[i].name);
  const dx = b[0] - a[0];
  const dz = b[2] - a[2];
  for (const it of plan.items) {
    const fp = it.fp;
    if (it.fountain === f.id) {
      if (!over) continue;
      const u = Math.max(0, Math.min(1, ((f.x - a[0]) * dx + (f.z - a[2]) * dz) / (dx * dx + dz * dz)));
      const low = a[1] + (b[1] - a[1]) * u < (f.y || 0) + fp.h;
      if (low && Math.hypot(a[0] + dx * u - f.x, a[2] + dz * u - f.z) < 0.8 * fr) out.push(it.name + ' (Mitte)');
      continue;
    }
    if (!fp.thin || fp.h <= 2) continue;
    const c = Math.cos(fp.ang);
    const s = Math.sin(fp.ang);
    for (let q = 0; q <= 1; q += 0.02) {
      const y = a[1] + (b[1] - a[1]) * q;
      const lx = a[0] + dx * q - fp.cx;
      const lz = a[2] + dz * q - fp.cz;
      if (y > 2 && y < fp.h && Math.abs(lx * c - lz * s) < fp.hw && Math.abs(lx * s + lz * c) < fp.hd) {
        out.push(it.name + ' (oben)');
        break;
      }
    }
  }
  return out;
}
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
    const plan = townPlan(city, sec);
    const main = plan.fountains[0];
    // Rahmen des Wagens → Plan: x ab der Spur, z ab dem Anfang des Abschnitts
    const toPlan = (q) => [q[0] + J.L0, q[1], q[2] - (sq.stop - sec.s0)];
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
          for (const [what, q] of [['Fenster', toPlan(WINDOW)], ['Brunnen', [main.x, (main.y || 0) + 0.5, main.z]]]) {
            const hit = sightOf(plan, main, fr, toPlan(pos), q, what === 'Fenster');
            if (what === 'Brunnen') hit.push(...sightBlockers(plan, main, [[toPlan(pos)[0], toPlan(pos)[2]]]).map((i) => plan.items[i].name));
            cams.lines++;
            ok(hit.length === 0, `${p.name}: Kamera ${name} (${fmt}) sieht ${what} nicht (${[...new Set(hit)].join(', ')})`);
          }
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

// Standbilder fürs Album (stillShot): reihum vorn, dreiviertel, tief, vom Auto. An jedem Ort jeder Blickwinkel
// außerhalb von Wagen und Becken über dem Boden, die Mitte des Brunnens im Bild (16:9, waagrecht und senkrecht), frei
// zu sehen (wie die Kameras der Folge), vom Auto aus auch das Fenster; der tiefe neben dem Becken, wo der Garten einer
// größeren Insel Platz lässt
const stills = { places: 0, kinds: {}, minFountain: Infinity, maxAngle: 0, lines: 0 };
{
  const CAR = { half: 0.95, front: 2.4, roof: 1.5 };
  const WINDOW = [-0.86, 1.12, 0.05];
  const yaw = (pos, p) => Math.atan2(p[0] - pos[0], -(p[2] - pos[2]));
  const pitch = (pos, p) => Math.atan2(p[1] - pos[1], Math.hypot(p[0] - pos[0], p[2] - pos[2]));
  const deg = (a) => Math.abs((((a + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) - Math.PI) * 180 / Math.PI;
  ok(['vorn', 'dreiviertel', 'tief', 'auto', 'vorn', 'dreiviertel'].every((k, i) => stillKind(i + 1) === k) && STILL.t > TV.call && STILL.t < TV.nomi, 'Standbilder: Blickwinkel nicht reihum oder Zeitpunkt außerhalb des Rufs');
  for (const p of places) {
    const len = townLen(p.pop);
    const sec = { kind: 'stadt', place: p.i, s0: 1000, s1: 1000 + len, spotS: 1000 + Math.round(len * 0.6) };
    const sq = squareOf(sec);
    const f = { x: sq.x - J.L0, z: -(sq.s - sq.stop) };
    const info = city.info(goalKind(p));
    const fr = info.r;
    const plan = townPlan(city, sec);
    const main = plan.fountains[0];
    const toPlan = (q) => [q[0] + J.L0, q[1], q[2] - (sq.stop - sec.s0)];
    stills.places++;
    for (let n = 1; n <= 4; n++) {
      const st = stillShot(f, sq.r, { r: info.r, h: info.h }, n);
      const { pos, look } = st;
      stills.kinds[st.kind] = (stills.kinds[st.kind] ?? 0) + 1;
      const inCar = Math.abs(pos[0]) < CAR.half && Math.abs(pos[2]) < CAR.front && pos[1] < CAR.roof;
      ok(!inCar && pos[1] > 0.3 && st.fov >= 30 && st.fov <= 65, `${p.name}: Standbild ${st.kind} im Wagen, am Boden oder mit ${st.fov}°`);
      const dF = Math.hypot(pos[0] - f.x, pos[2] - f.z) - fr;
      stills.minFountain = Math.min(stills.minFountain, dF);
      ok(dF > 0.3, `${p.name}: Standbild ${st.kind} steht im Brunnen (${dF.toFixed(2)} m vom Becken)`);
      // die Mitte des Brunnens (halbe Höhe, beim hohen Endgegner sein Becken) im Bild: waagrecht und senkrecht mit Rand
      const half = (Math.atan(Math.tan((st.fov * Math.PI) / 360) * (16 / 9)) * 180) / Math.PI;
      const mid = [f.x, Math.min(0.5 * info.h, 1.6), f.z];
      const ah = deg(yaw(pos, mid) - yaw(pos, look));
      const av = deg(pitch(pos, mid) - pitch(pos, look));
      stills.maxAngle = Math.max(stills.maxAngle, ah);
      ok(ah < half - 6 && av < st.fov / 2 - 3, `${p.name}: Standbild ${st.kind} hat den Brunnen nicht im Bild (${ah.toFixed(0)}° quer, ${av.toFixed(0)}° hoch)`);
      if (st.kind === 'auto') ok(deg(yaw(pos, WINDOW) - yaw(pos, look)) < half - 4, `${p.name}: Standbild vom Auto ohne Fenster`);
      const hit = sightOf(plan, main, fr, toPlan(pos), [main.x, (main.y || 0) + 0.5, main.z], false);
      hit.push(...sightBlockers(plan, main, [[toPlan(pos)[0], toPlan(pos)[2]]]).map((i) => plan.items[i].name));
      stills.lines++;
      ok(hit.length === 0, `${p.name}: Standbild ${st.kind} sieht den Brunnen nicht (${[...new Set(hit)].join(', ')})`);
    }
  }
}

// --- Fahrplan im Spiel: Momente, Ende, nächste Runde ------------------------------------------------------------------
const DT = 1 / 30;
function episode(seed, during = null) {
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
    speech: loose({ say: (text, voice) => (log.push({ k: 'say', voice, text, t: at(), g: game.t }), 2.5), busy: false, queue: NONE, current: null }),
    ui: loose({
      brunnenTV: (n, name) => log.push({ k: 'card', n, name, t: at() }),
      megafon: (text, dur, buyer, label) => log.push({ k: 'sub', text, label, t: at() }),
      chat: (m) => log.push({ k: 'chat', text: m.text, t: at(), g: game.t }),
      nomi: (text) => log.push({ k: 'nomi', text, t: at(), tv: !!game.tv }),
    }),
    fx: loose(),
    pickups: loose({ update: () => NONE }),
    world: { trip: () => trip, stopping: () => false, release: () => released++, square: () => null, town: () => null },
  });
  // (der Stream endet hier nie: Bietet im Fenster nach der Folge niemand, bietet an seinem Ende doch noch jemand)
  game.endless = true;
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
    if (during && game.tv && game.brunnenT() >= during.t && !during.done) {
      during.done = true;
      during.fn(game);
    }
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

const runs = { none: null };
for (const [name, skipAt] of [['none', null]]) {
  const r = episode(4711);
  runs[name] = r;
  const card = r.log.filter((e) => e.k === 'card');
  const S = SCHOENER_BRUNNEN;
  const subs = r.log.filter((e) => e.k === 'sub' && e.text !== S.text);
  const adam = r.log.filter((e) => e.k === 'say' && e.voice === 'adam');
  const call = r.log.filter((e) => e.k === 'say' && e.voice === 'brunnen');
  const callSub = r.log.filter((e) => e.k === 'sub' && e.text === S.text);
  const echo = r.log.filter((e) => e.k === 'chat' && e.text === S.chat[0]);
  const cheer = r.log.filter((e) => e.k === 'chat' && e.text === 'BRUNNENTV! 💦');
  const nomi = r.log.filter((e) => e.k === 'nomi' && e.t >= TV.nomi - 0.01);
  const end = skipAt === null ? TV.end : skipAt;
  // Endzustand: keine Folge, Bauchbinde weg, genau einmal freigegeben – danach die nächste Bieterrunde
  ok(!r.game.tv && r.released === 1 && card.length && card[card.length - 1].n === 0, `${name}: Endzustand (Folge ${!!r.game.tv}, ${r.released}× freigegeben, Bauchbinde ${card.length ? card[card.length - 1].n : '–'})`);
  ok(Math.abs(r.endT - end) < 2.5 * DT, `${name}: Folge endet bei ${r.endT.toFixed(2)} s statt ${end.toFixed(2)} s`);
  ok(r.bidT > 0 && r.bidT - r.releaseT >= TV.pause - DT && r.bidT - r.releaseT < AUKTION.window + 1, `${name}: nächstes Gebot ${(r.bidT - r.releaseT).toFixed(1)} s nach der Freigabe`);
  // jeder Moment genau einmal zu seiner Zeit, wenn er vor dem Ende lag – sonst gar nicht
  const once = (list, t0, what) => {
    if (end > t0 || (what === 'OMI' && end > TV.nomi)) ok(list.length === 1 && Math.abs(list[0].t - t0) < 2 * DT, `${name}: ${what} ${list.length}× (${list.map((e) => e.t).join(', ')} s, erwartet ${t0} s)`);
    else ok(list.length === 0, `${name}: ${what} nach dem Überspringen`);
  };
  once(card.filter((e) => e.n > 0), TV.card, 'Bauchbinde');
  once(adam, TV.line, 'Megafon-Gruß');
  once(subs, TV.line, 'Megafon-Untertitel');
  // der Ruf in jeder Folge genau einmal: zu seiner Zeit, übersprungen vorher mit dem Ende der Folge (beim Losfahren)
  const callT = Math.min(TV.call, end);
  for (const [list, what] of [[call, '„Schöner Brunnen!“'], [callSub, 'Untertitel „SCHÖÖÖÖÖÖÖNER BRUNNEN!!!!!“']]) {
    ok(list.length === 1 && Math.abs(list[0].t - callT) < 2.5 * DT, `${name}: ${what} ${list.length}× (${list.map((e) => e.t).join(', ')} s, erwartet ${callT} s)`);
  }
  // (der Chat ruft 0,6 s nach dem Ruf, mit dem nächsten Bild: Game.later – auch nach dem Überspringen, Spielzeit g)
  const gap = echo.length && call.length ? echo[0].g - call[0].g : NaN;
  ok(echo.length === 1 && gap >= 0.6 - 1e-9 && gap <= 0.6 + 3 * DT, `${name}: „${S.chat[0]}“ im Chat ${echo.length}× (${gap.toFixed(3)} s nach dem Ruf)`);
  once(cheer, TV.chat, '„BRUNNENTV! 💦“ im Chat');
  // (OMI gongt erst, ihr Satz kommt 0,35 s danach: Game.say)
  once(nomi, TV.nomi + 0.35, 'OMI');
  if (end > TV.card) ok(card[0].name === 'Würzburg', `${name}: Bauchbinde „${card[0].name}“`);
  if (end > TV.line) {
    ok(subs[0].label === SCHOENNBRUN.label, `${name}: Untertitel des Megafons „${subs[0].label}“`);
    ok(adam[0].text === subs[0].text && !/\{|\}/.test(subs[0].text), `${name}: Megafon-Gruß „${subs[0].text}“`);
    ok(estimateSpeech(adam[0].text, VOICES.adam.rate) <= TV.call - TV.line - 0.3, `${name}: Gruß „${adam[0].text}“ läuft in den Ruf hinein`);
  }
  if (call.length && callSub.length) ok(call[0].text === S.say && callSub[0].label === SCHOENNBRUN.label, `${name}: Ruf „${call[0].text}“ / ${callSub[0].label}`);
  if (end > TV.chat) ok(r.log.filter((e) => e.k === 'chat' && e.t >= TV.chat && e.t < TV.chat + 3.5).length >= 3, `${name}: der Chat jubelt kaum`);
}
// Der Ruf: in der Einstellung „Brunnen“, gesprochen, solange das Megafon am Mund ist, nach dem Gruß; tiefer und
// langsamer als der Gruß; jeder Gruß ohne Ortsnamen passt vor den Ruf (so gibt es immer einen), mit dem längsten
// Ortsnamen der Karte noch mindestens drei
{
  const S = SCHOENER_BRUNNEN;
  const dur = estimateSpeech(S.say, VOICES.brunnen.rate);
  ok(shotAt(TV.call) === 'brunnen' && megaphoneAt(TV.call) === 1 && megaphoneAt(TV.call + dur) === 1 && TV.call > TV.chat && TV.call + dur <= TV.nomi, `Ruf bei ${TV.call} s, ${dur.toFixed(2)} s lang: Einstellung ${shotAt(TV.call)}, Megafon ${megaphoneAt(TV.call + dur).toFixed(2)}`);
  ok(VOICES.brunnen.pitch < VOICES.adam.pitch && VOICES.adam.pitch <= 0.5 && VOICES.brunnen.rate < 0.75, `Stimmen: Gruß ${JSON.stringify(VOICES.adam)}, Ruf ${JSON.stringify(VOICES.brunnen)}`);
  ok(/^SCH(Ö){5,}NER BRUNNEN!{3,}$/.test(S.text) && S.say === 'Schöner Brunnen!' && /^SCH(Ö){3}NER BRUNNEN!$/.test(S.chat[0]), `Ruf: „${S.text}“ / „${S.say}“ / „${S.chat[0]}“`);
  const room = TV.call - TV.line - 0.3;
  const plain = BRUNNEN_MEGAFON.filter((l) => !l.includes('{ort}'));
  ok(plain.length >= 3 && plain.every((l) => estimateSpeech(l, VOICES.adam.rate) <= room), `Grüße ohne Ort passen nicht vor den Ruf: ${plain.filter((l) => estimateSpeech(l, VOICES.adam.rate) > room).join(' | ')}`);
  const longest = places.reduce((a, p) => (p.name && p.name.length > a.length ? p.name : a), '');
  const fit = BRUNNEN_MEGAFON.filter((l) => estimateSpeech(fillTemplate(l, { ort: longest }), VOICES.adam.rate) <= room);
  ok(fit.length >= 3, `mit „${longest}“ passen nur ${fit.length} Grüße vor den Ruf`);
}

// Eine Folge hat genau einen Satz OMIs: Geplauder mittendrin (der Fehlalarm des Wischers) entfällt, Wichtiges kommt
// gleich nach der Folge
{
  const chatter = (g) => {
    g.say(BOARD.wiperPhantom, 'think', { priority: false });
    g.say('Prüfsatz nach der Folge.', 'think');
  };
  const r = episode(4711, { t: 3, fn: chatter });
  const said = r.log.filter((e) => e.k === 'nomi');
  // (beim Halt sagt sie nichts: Die Folge hat genau ihren einen Satz)
  const inTv = said.filter((e) => e.tv);
  ok(inTv.length === 1 && BRUNNEN_NOMI.some((l) => fillTemplate(l, { n: '1' }) === inTv[0].text), `Folge: OMI ${inTv.length}× (${inTv.map((e) => e.text).join(' | ')})`);
  ok(!said.some((e) => e.text === BOARD.wiperPhantom) && said.filter((e) => !e.tv && e.text === 'Prüfsatz nach der Folge.').length === 1, `Folge: zurückgehalten ${said.map((e) => e.text).join(' | ')}`);
}

// --- BrunnenTV unterwegs: neben einem Brunnen auf dem Weg anhalten, Taste B ------------------------------------------
// Eine echte Fahrt: Das erste Gebot steht, an der ersten Ausfahrt fährt der Wagen trotzdem ab – in den Ort dort (nicht
// das Ziel). Nur wo er still neben dessen Insel steht, bietet das Spiel die Folge an; sie ist dieselbe wie am Ziel, die
// Runde läuft danach einfach weiter.
const way = { offers: 0, place: '', gifts: [], arrive: 0, wayMean: 0 };
{
  Math.random = mulberry32(2024);
  const trip = new Trip({ rng: Math.random });
  const arrival = new Arrival();
  arrival.hold = true;
  const log = [];
  let releases = 0;
  let holds = 0;
  const camera = new PerspectiveCamera(60, 16 / 9, 0.1, 3000);
  const at = () => +(game.brunnenT()).toFixed(3);
  const square = (sec) => {
    const q = squareOf(sec);
    return q ? { place: sec.place, sec, s: q.s, x: q.x, r: q.r, heading: q.heading, stop: { s: q.stop, x: J.L0 }, object: null, world: null } : null;
  };
  const game = new Game({
    traffic: loose({ cars: NONE, update: () => NONE, nearby: () => NONE, police: () => null, megafon: () => 0 }),
    scenery: loose({ request: () => 1, landmarkSpot: (s) => s, placed: () => null }),
    road: loose(),
    sky: loose(),
    rain: loose(),
    windshield: loose({ firmware: 0, manual: () => 'wipe' }),
    cockpit: loose({ nomi: loose() }),
    audio: loose(),
    speech: loose({ say: (text, voice) => (log.push({ k: 'say', voice, text, t: at() }), 2.5), busy: false, queue: NONE, current: null }),
    ui: loose({
      toast: (text, kind, key) => log.push({ k: 'toast', text, key, g: game.t }),
      dropKey: (key) => log.push({ k: 'drop', key, g: game.t }),
      brunnenTV: (n, name) => log.push({ k: 'card', n, name, t: at() }),
      chat: (m) => log.push({ k: 'chat', text: m.text, t: at() }),
      money: (v, what) => log.push({ k: 'money', v, what, t: at() }),
    }),
    fx: loose(),
    pickups: loose({ update: () => NONE }),
    world: {
      trip: () => trip, stopping: () => !!arrival.pending, release: () => (releases++, arrival.reset()), square, town: () => null,
      hold: (sec) => (holds++, (arrival.held = { s: trip.s + 0.3, sec, place: sec.place, park: -1 })),
    },
  });
  game.endless = true;
  game.start({ upgrades: {}, best: {} });
  const p = game.player;
  const nv = game.navi;
  const ctl = { steer: 0, throttle: 0, brake: 1, reverse: false, horn: false, wiper: false, megafon: false, ladestopp: false, brunnen: false, device: null, kappa: 0, grade: 0 };
  const place = (sec) => (sec ? places[sec.place].name : '–');
  // das erste Gebot, dann die Fahrt bis in den Ort an der ersten Ausfahrt
  game.changeNavi(false);
  const target = trip.target;
  ok(nv.target && target >= 0 && game.auction.phase === 'offen', `unterwegs: kein Ziel nach dem ersten Gebot (${nv.target ? nv.target.name : '–'}, ${game.auction.phase})`);
  let s = trip.s;
  let guard = 0;
  while (guard++ < 20000 && !(trip.section.kind === 'stadt' && !trip.section.start && trip.section.place !== target)) trip.update((s += 5), autoTarget(trip, 'exit'));
  const sec = trip.section;
  const q = square(sec);
  ok(sec.kind === 'stadt' && q && sec.place !== target, `unterwegs: kein Ort auf dem Weg (${sec.kind} ${place(sec)})`);
  way.place = place(sec);
  // auf dem Weg zum Brunnen: im Ort, aber noch weit davor – oder in Fahrt – gibt es nichts
  const stand = (ds, dx = 0, v = 0) => {
    trip.s = q.stop.s + ds;
    trip.x = p.x = J.L0 + dx;
    p.s = trip.s;
    p.speed = v;
    return game.wayOffer();
  };
  for (const [ds, dx, v, want] of [[-30, 0, 0, false], [-WAY.before - 0.5, 0, 0, false], [-WAY.before + 0.5, 0, 0, true], [0, 0, 0, true], [WAY.after - 0.3, 0, 0, true], [WAY.after + 0.5, 0, 0, false], [-1, WAY.lane + 0.3, 0, false], [-1, -WAY.lane + 0.2, 0, true], [-1, 0, 2, false], [-1, 0, WAY.still - 0.1, true]]) {
    const o = stand(ds, dx, v);
    ok(!!o === want && (!o || (o.sec === sec && o.place === sec.place)), `unterwegs: Halt ${ds} m, quer ${dx} m, ${v} m/s – Angebot ${o ? 'ja' : 'nein'} statt ${want ? 'ja' : 'nein'}`);
  }
  // still neben der Insel (1 m vor dem Haltepunkt): Der Rand sagt Taste B, einmal
  stand(-1);
  for (let i = 0; i < 10; i++) game.update(DT, ctl, camera);
  const hint = log.filter((e) => e.k === 'toast' && e.key === 'brunnenHier');
  way.offers = hint.length;
  ok(game.wayHint && hint.length === 1 && hint[0].text.includes('Taste B'), `unterwegs: Hinweis ${hint.length}× (${hint.map((e) => e.text).join(' | ')}), wayHint ${game.wayHint}`);
  const phase = game.auction.phase;
  const goal = nv.target;
  const n0 = albumOf(game.save).n;
  const i0 = log.length;
  const rep0 = game.breakdown.Schäden || 0;
  // Taste B: die Folge
  ctl.brunnen = true;
  game.update(DT, ctl, camera);
  ctl.brunnen = false;
  const tv = game.tv;
  const last = albumOf(game.save).list.at(-1);
  const mark = game.route.marks.at(-1);
  ok(tv && tv.way && tv.place === sec.place && tv.goal === goalName(places[sec.place]), `unterwegs: Taste B startet keine Folge (${JSON.stringify(tv && { way: tv.way, goal: tv.goal })})`);
  ok(holds === 1 && arrival.held && arrival.stop(trip) === arrival.held && !game.wayHint, `unterwegs: Welt hält ${holds}×, Hinweis ${game.wayHint}`);
  ok(last && last.n === n0 + 1 && last.w === 1 && last.p === places[sec.place].key, `unterwegs: Album ${JSON.stringify(last)}`);
  ok(mark && mark.type === 'brunnen' && mark.way === true && mark.n === n0 + 1, `unterwegs: Routenmarke ${JSON.stringify(mark)}`);
  // die Folge läuft ab wie am Ziel; das Ziel und die Runde bleiben, es kommt kein Gebot
  let end = -1;
  for (let i = 0; i < 14 * 30 && end < 0; i++) {
    game.update(DT, ctl, camera);
    ok(game.auction.phase === phase && nv.target === goal, `unterwegs: Runde ${game.auction.phase} / ${nv.target ? nv.target.name : '–'} während der Folge`);
    if (!game.tv) end = game.t;
  }
  const call = log.filter((e) => e.k === 'say' && e.voice === 'brunnen');
  const card = log.filter((e) => e.k === 'card' && e.n > 0);
  const money = log.slice(i0).filter((e) => e.k === 'money');
  const gifts = money.filter((e) => e.what === 'Brunnenspende');
  way.gifts = gifts.map((e) => e.v);
  ok(end > 0 && releases === 1 && !arrival.held, `unterwegs: Ende ${end.toFixed(2)}, ${releases}× freigegeben`);
  ok(call.length === 1 && Math.abs(call[0].t - TV.call) < 2.5 * DT && card.length === 1 && card[0].name === places[sec.place].name, `unterwegs: Ruf ${call.length}×, Bauchbinde ${card.map((e) => e.name).join(', ')}`);
  ok(gifts.length === WAY.gifts && gifts.every((e) => e.v >= 1 && e.v <= 7.77) && Math.abs(game.breakdown.Brunnenspenden - gifts.reduce((a, e) => a + e.v, 0)) < 1e-6, `unterwegs: Brunnenspenden ${gifts.map((e) => e.v).join(', ')} (Abrechnung ${game.breakdown.Brunnenspenden})`);
  // (Spenden des Chats kommen wie in jeder Folge; Ortsspenden, Gebote und die Werkstatt-Rechnung nicht)
  ok(!money.some((e) => e.what === 'Ortsspende' || e.what === 'Navi-Gebot') && (game.breakdown.Schäden || 0) === rep0 && game.auction.phase === phase && nv.target === goal && !game.roundNew, `unterwegs: abgerechnet oder neue Runde (${money.map((e) => e.what).join(', ')}, ${game.auction.phase})`);
  // danach: weiterfahren; an diesem Brunnen kein zweites Mal
  for (let i = 0; i < 10; i++) game.update(DT, ctl, camera);
  ok(!game.wayOffer() && !game.wayHint && log.filter((e) => e.k === 'toast' && e.key === 'brunnenHier').length === 1, 'unterwegs: zweites Angebot am selben Brunnen');
  ctl.brunnen = true;
  game.update(DT, ctl, camera);
  ok(!game.tv && albumOf(game.save).n === n0 + 1, 'unterwegs: Taste B ohne Angebot startet eine Folge');
  // Brunnenspenden gegen Ortsspenden: im Schnitt weniger als die Hälfte
  const ea = new Economy({ seed: 11 });
  const eb = new Economy({ seed: 11 });
  const sum = (a) => a.reduce((x, y) => x + y, 0);
  for (let i = 0; i < 300; i++) {
    way.arrive += sum(ea.arrive()) / 300;
    way.wayMean += sum(eb.wayGifts()) / 300;
  }
  ok(way.wayMean < 0.5 * way.arrive, `unterwegs: Brunnenspenden ${way.wayMean.toFixed(2)} € gegen Ortsspenden ${way.arrive.toFixed(2)} € je Folge`);
}

// --- Megafon als Ausstattung ----------------------------------------------------------------------------------------
const mega = { says: [], toasts: [] };
{
  ok(!SHOP.some((x) => x.id === 'megafon') && !('megafon' in UPGRADE_LIMITS), 'Das Megafon steht noch im Shop');
  const wish = AKTIONEN.find((x) => x.id === 'megafon');
  ok(wish && !wish.needs, 'Der Megafon-Wunsch braucht noch ein Upgrade');
  // Taste H ohne gekauftes Megafon: Mini Adam durchs Megafon, mit seiner Stimme, kein Hinweis auf den Shop; während es
  // nachlädt, sagt es das
  {
    Math.random = mulberry32(7);
    const says = [];
    const toasts = [];
    const trip = new Trip({ rng: Math.random });
    const game = new Game({
      traffic: loose({ cars: NONE, update: () => NONE, nearby: () => NONE, police: () => null, megafon: () => 2 }),
      scenery: loose({ request: () => 1, landmarkSpot: (s) => s, placed: () => null }),
      road: loose(),
      sky: loose(),
      rain: loose(),
      windshield: loose({ firmware: 0, manual: () => 'wipe' }),
      cockpit: loose({ nomi: loose() }),
      audio: loose(),
      speech: loose({ say: (text, voice) => (says.push({ text, voice }), 2.5), busy: false, queue: NONE, current: null }),
      ui: loose({ toast: (text) => toasts.push(text) }),
      fx: loose(),
      pickups: loose({ update: () => NONE }),
      world: { trip: () => trip, stopping: () => false, release: noop, square: () => null, town: () => null },
    });
    game.start({ upgrades: {}, best: {} });
    game.useMegafon();
    game.useMegafon();
    const where = 'Reise';
    ok(says.length === 1 && says[0].voice === 'adam' && game.megafonCd > 14, `${where}: Taste H ohne Upgrade (${says.length} Durchsagen)`);
    ok(toasts.length === 2 && /Platz/.test(toasts[0]) && /lädt noch/.test(toasts[1]) && !toasts.some((t) => /Shop/.test(t)), `${where}: Hinweise ${toasts.join(' | ')}`);
    mega.says.push(says.length);
    mega.toasts.push(...toasts);
  }

  // Erstattung: einmal 450 €, der Artikel verschwindet aus den Upgrades, die anderen bleiben
  const box = new Map();
  globalThis.localStorage = { getItem: (k) => (box.has(k) ? box.get(k) : null), setItem: (k, v) => box.set(k, String(v)), removeItem: (k) => box.delete(k) };
  box.set('mini-adam-tesla-navi-v1', JSON.stringify({ wallet: 12.5, upgrades: { megafon: 1, radar: 1, boost: 2 } }));
  const a = loadSave();
  ok(a.megafonRefund === 0, 'Ein alter Spielstand trägt schon eine Erstattung');
  const back = refundMegafon(a);
  ok(back === MEGAFON_PRICE && MEGAFON_PRICE === 450 && a.wallet === 462.5 && !('megafon' in a.upgrades) && a.upgrades.radar === 1 && a.upgrades.boost === 2 && a.megafonRefund === 450, `Erstattung: ${back} €, Guthaben ${a.wallet}, ${JSON.stringify(a.upgrades)}`);
  ok(a.megafonNote === 450, 'Der Titel sagt die Erstattung nicht an');
  storeSave(a);
  const b = loadSave();
  ok(refundMegafon(b) === 0 && b.wallet === 462.5 && b.megafonRefund === 450, 'Nach dem Neuladen gibt es das Geld ein zweites Mal');
  // die Zeile auf dem Titel bleibt über das Neuladen, bis der Shop zum ersten Mal offen ist (main.js dataFor('shop'))
  ok(b.megafonNote === 450 && megafonNoteSeen(b) === 450 && b.megafonNote === 0 && megafonNoteSeen(b) === 0, `Zeile zur Erstattung: ${b.megafonNote}`);
  storeSave(b);
  ok(loadSave().megafonNote === 0 && refundMegafon(loadSave()) === 0, 'Nach dem Shop steht die Erstattung wieder auf dem Titel');
  const src = ['src/main.js', 'src/ui/menus.js'].map((f) => readFileSync(new URL('../' + f, import.meta.url), 'utf8')).join('\n');
  ok(src.includes('shopRefund = megafonNoteSeen(save)') && src.includes('if (d.megafonNote)') && src.includes('if (d.refund)'), 'Titel oder Shop lesen die Zeile zur Erstattung nicht aus dem Spielstand');
  // der Abspann der Reise: die letzte Zeile zählt die Folgen (menus.js setzt {folgen} ein; ohne Folge fehlt sie)
  const row = ABSPANN_REISE[ABSPANN_REISE.length - 1];
  ok(row[0] === 'BrunnenTV' && row[2] === 'wide' && fillTemplate(row[1], { folgen: '3 Folgen' }) === '3 Folgen mit Herrn Schönnbrun (Mini Adam am Megafon)' && ABSPANN_REISE.filter((r) => r[1].includes('{folgen}')).length === 1, `Abspann: ${row.join(' | ')}`);
  ok(src.includes("st.brunnenTV === 1 ? '1 Folge'") && src.includes("fillTemplate(v, { folgen })"), 'Der Abspann zählt die Folgen nicht');
  // ein später noch einmal gekauftes Megafon (ein alter Stand in einem anderen Fenster): kein zweites Geld
  b.upgrades.megafon = 1;
  ok(refundMegafon(b) === 0 && b.wallet === 462.5, 'Ein zweites gekauftes Megafon wird noch einmal erstattet');
  // ohne gekauftes Megafon: nichts, und ein neuer Spielstand auch nicht
  const c = { ...structuredClone(DEFAULT_SAVE), wallet: 3, upgrades: { radar: 1 } };
  ok(refundMegafon(c) === 0 && c.wallet === 3 && !c.megafonRefund, 'Ohne gekauftes Megafon gab es Geld');
  ok(refundMegafon(structuredClone(DEFAULT_SAVE)) === 0, 'Ein neuer Spielstand bekam Geld');
}

// --- Der Name des Spiels ----------------------------------------------------------------------------------------------
{
  const NAME = 'Mini Adam – Navi ferngesteuert BrunnenTV XXL';
  const file = (f) => readFileSync(new URL('../' + f, import.meta.url), 'utf8');
  ok(GAME_NAME === NAME && `${GAME_TITLE} – ${GAME_SUBTITLE} ${GAME_XXL}` === NAME, `Name in data.js: ${GAME_NAME}`);
  const html = file('docs/index.html');
  ok(html.includes(`<title>${NAME}</title>`) && html.includes(`<p class="load-sub">${GAME_SUBTITLE} ${GAME_XXL}</p>`), 'Seitentitel oder Ladekarte ohne den Namen');
  ok(file('README.md').startsWith(`# ${NAME}\n`) && file('INSIDER.md').includes(`**${NAME}**`), 'README oder INSIDER ohne den Namen');
  ok(JSON.parse(file('package.json')).description.startsWith(NAME), 'package.json ohne den Namen');
  const menus = file('src/ui/menus.js');
  ok(menus.includes('`„${GAME_NAME}“ ist ein liebevolles') && menus.includes("el('span', 'title-xxl', h2, GAME_XXL)"), 'Über das Spiel oder der Titel ohne den Namen');
  ok(!/Tesla-Navi ferngesteuert/.test(html + file('README.md') + menus + file('src/main.js').split('\n')[0]), 'Der alte Name steht noch da');
}

// --- Ausgabe ---------------------------------------------------------------------------------------------------------
const tl = (r) => `Ende ${r.endT.toFixed(2)} s, nächstes Gebot ${(r.bidT - r.releaseT).toFixed(1)} s danach`;
console.log(`BrunnenTV-Fahrplan: Bauchbinde ${TV.card} s, Gruß ${TV.line} s, Chat ${TV.chat} s, „Schöner Brunnen!“ ${TV.call} s, OMI ${TV.nomi} s, Ende ${TV.end} s; Fenster offen ${TV.window.down.join('–')} s, Megafon in der Hand ab ${MEGA.show * 100} % gehoben`);
console.log(`Folge ohne Überspringen: ${tl(runs.none)}, der Ruf genau einmal`);
console.log(`Standbilder an ${stills.places} Orten: ${Object.entries(stills.kinds).map(([k, v]) => `${k} ${v}`).join(', ')}; mindestens ${stills.minFountain.toFixed(2)} m vom Becken, Brunnen höchstens ${stills.maxAngle.toFixed(0)}° neben der Bildmitte, ${stills.lines} Sichtlinien frei`);
console.log(`Kameras an ${cams.places} Orten: mindestens ${cams.minFountain.toFixed(2)} m vom Becken, Fenster und Brunnen höchstens ${cams.maxAngle.toFixed(0)}° neben der Blickrichtung (hochkant zurückgefahren ${cams.maxPortrait.toFixed(0)}° von ${portraitHalf.toFixed(0)}°), ${cams.lines} Sichtlinien zu Fenster und Brunnen frei von Häusern, Bäumen und Laternen`);
console.log(`Unterwegs: Folge in ${way.place} (nicht das Ziel), angeboten ${WAY.before} m vor bis ${WAY.after} m hinter dem Halt, ${way.offers}× Hinweis „Taste B“; Brunnenspenden ${way.gifts.join(' + ')} € (im Schnitt ${way.wayMean.toFixed(2)} € gegen ${way.arrive.toFixed(2)} € Ortsspenden am Ziel), Runde und Ziel unverändert`);
console.log(`Megafon: kein Shop-Artikel, Taste H ohne Upgrade (${mega.toasts.join(' / ')}), ein gekauftes einmal erstattet (${MEGAFON_PRICE} €, auf dem Titel bis zum ersten Besuch im Shop); Abspann der Reise mit „${ABSPANN_REISE.at(-1)[0]}: ${fillTemplate(ABSPANN_REISE.at(-1)[1], { folgen: '1 Folge' })}“`);
console.log(fails ? `${fails} Fehler (${checks} Prüfungen)` : `brunnen-test: alles grün (${checks} Prüfungen)`);
process.exit(fails ? 1 : 0);
