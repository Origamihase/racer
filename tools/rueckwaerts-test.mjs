// Prüft den Rückwärtsgang ohne Grafik: den Wagen allein (Player), das klassische Spiel (Game mit Mitspielern, die
// mitschreiben) und die Reise über die echte Karte (Trip, Arrival, NavModel wie in tools/journey-test.mjs).
// node tools/rueckwaerts-test.mjs
// - R gibt es nur aus den eigenen Eingaben des Spielers: Bremse ganz gehalten, im Stand, etwa 0,5 s – nie für den
//   Autopiloten, die Vorführung, die Haltesteuerung am Fahrtende (Bremse 0,5) oder während die Welt den Wagen anhält.
// - In R: höchstens REVERSE.vmax (≈ 15 km/h), sanft anfahren, kein Tempomat; Strom bremst bis zum Stand und legt D ein
//   (im Stand genügt ein Tipp); ohne Erlaubnis bremst R bis zum Stand und legt D ein.
// - Lenken rückwärts: das Heck geht zur gelenkten Seite, die Nase dreht zur anderen.
// - Die Grenze: höchstens REVERSE.back Meter hinter den weitesten Punkt, nie über limits.back; weich bis zum Stand,
//   eine Meldung.
// - Nichts zählt doppelt oder rückwärts: Strecke, saubere Strecke, Regenstrecke, linke Spur, Blitzer (Blitz, Lob,
//   Foto), Navi-Ankunft; auf der Reise Reisekilometer, Uhr, Abschnitte, Orte und Gabelungen.
// - Wer nie rückwärts fährt, fährt genau wie vorher: derselbe Stream mit und ohne die Erlaubnis stimmt auf den Cent.
import { Player, REVERSE } from '../src/game/player.js';

const DT = 1 / 30;
let fails = 0;
let checks = 0;
function ok(cond, msg) {
  checks++;
  if (cond) return;
  fails++;
  console.error('FEHLER: ' + msg);
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function mulberry32(a) {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- 1. Der Wagen allein ---------------------------------------------------------------------------------------------
/** Ein stehender Wagen bei s (klassische Grenzen, Weltgrenze back). */
function car({ s = 1000, speed = 0, back = 0, cruise = false } = {}) {
  const p = new Player();
  p.configure({ cruise });
  p.reset({});
  p.setLimits({ back });
  p.s = s;
  p.sFar = s;
  p.speed = speed;
  return p;
}
/** sec Sekunden mit diesen Eingaben fahren; liefert alle Ereignisse und den Verlauf { t, s, v, gear }. */
function drive(p, sec, ctl, env = { reverse: true }) {
  const ev = [];
  const trace = [];
  const n = Math.round(sec / DT);
  for (let i = 0; i < n; i++) {
    p.update(DT, { steer: 0, throttle: 0, brake: 0, ...ctl }, env);
    for (const e of p.events) ev.push({ ...e, t: i * DT });
    trace.push({ t: (i + 1) * DT, s: p.s, v: p.v, speed: p.speed, gear: p.gear, x: p.x, yaw: p.yaw });
  }
  return { ev, trace };
}
const gears = (r) => r.ev.filter((e) => e.type === 'gear').map((e) => e.gear);

{
  // Bremse im Stand gehalten: nach etwa 0,5 s R, vorher nicht
  const p = car();
  const r = drive(p, 2, { brake: 1 });
  const first = r.trace.findIndex((q) => q.gear === 'R');
  ok(first >= 0, 'Bremse im Stand gehalten: kein R');
  const tR = r.trace[first]?.t ?? Infinity;
  ok(tR >= REVERSE.hold - 1e-6 && tR <= REVERSE.hold + 2 * DT, `R kommt nach ${tR.toFixed(2)} s statt nach ${REVERSE.hold} s`);
  ok(same(gears(r), ['R']), `Gangwechsel beim Halten: ${gears(r)}`);
  ok(p.s < 1000 && p.v < 0, 'In R fährt die gehaltene Bremse nicht rückwärts');
  // nicht ganz durchgetreten (Analogtaste halb, Haltesteuerung 0,5): nie R
  for (const brake of [0.5, 0.85]) {
    const q = car();
    ok(!drive(q, 10, { brake }).trace.some((t) => t.gear === 'R'), `Bremse ${brake} legt R ein`);
  }
  // ohne die Erlaubnis des Spielers (Autopilot, Vorführung, Haltesteuerung, Halt am Brunnen): nie R
  for (const env of [{}, { reverse: false }, { wet: 0 }, { reverse: 1 }]) {
    const q = car();
    ok(!drive(q, 10, { brake: 1 }, env).trace.some((t) => t.gear === 'R'), `Ohne Erlaubnis (${JSON.stringify(env)}) gibt es R`);
  }
  // die Welt hält den Wagen an (vmax 0): nie R
  const h = car();
  h.setLimits({ vmax: 0 });
  ok(!drive(h, 5, { brake: 1 }).trace.some((t) => t.gear === 'R'), 'R, obwohl die Welt den Wagen anhält');
  // in Fahrt: erst bremsen, R erst im Stand
  const m = car({ speed: 20 });
  const rm = drive(m, 6, { brake: 1 });
  const iR = rm.trace.findIndex((q) => q.gear === 'R');
  const iStop = rm.trace.findIndex((q) => q.speed < REVERSE.still);
  ok(iR > iStop && iStop >= 0 && rm.trace[iR].t - rm.trace[iStop].t >= REVERSE.hold - 2 * DT, 'R in Fahrt oder ohne die halbe Sekunde im Stand');
  // kurz loslassen setzt die halbe Sekunde zurück
  const k = car();
  drive(k, 0.4, { brake: 1 });
  drive(k, DT, { brake: 0 });
  const rk = drive(k, 0.4, { brake: 1 });
  ok(!rk.trace.some((q) => q.gear === 'R'), 'Zweimal 0,4 s Bremse mit einer Lücke legen R ein');
}

{
  // Tempo in R, sanft anfahren, kein Tempomat
  const p = car({ cruise: true });
  ok(p.cruiseSet !== null, 'Tempomat (Einstellung) ist nicht an');
  const r = drive(p, 12, { brake: 1 });
  const top = Math.max(...r.trace.map((q) => -q.v));
  ok(top <= REVERSE.vmax + 1e-9 && top > REVERSE.vmax - 0.05, `Höchsttempo rückwärts ${(top * 3.6).toFixed(1)} km/h`);
  ok(p.cruiseSet === null, 'Der Tempomat bleibt in R an');
  ok(r.trace.every((q) => q.speed >= 0), 'speed wird negativ');
  let maxAcc = 0;
  for (let i = 1; i < r.trace.length; i++) maxAcc = Math.max(maxAcc, Math.abs(r.trace[i].v - r.trace[i - 1].v) / DT);
  ok(maxAcc <= REVERSE.acc + 0.01, `Rückwärts ruckt es: ${maxAcc.toFixed(2)} m/s²`);
  // Strom bremst bis zum Stand und legt D ein, dann geht es vorwärts
  const w = drive(p, 3, { throttle: 1 });
  ok(same(gears(w), ['D']), `Strom in R: Gänge ${gears(w)}`);
  const iD = w.trace.findIndex((q) => q.gear === 'D');
  ok(iD > 0 && w.trace.slice(0, iD).every((q) => q.v <= 1e-9), 'Strom in R fährt vorwärts, bevor der Wagen steht');
  ok(p.v > 2, 'Nach D fährt der Wagen mit Strom nicht vorwärts');
  ok(p.cruiseSet !== null, 'Mit D hält der Tempomat (Einstellung an) nicht wieder');
  // im Stand in R: ein Tipp auf Strom genügt für D
  const t = car();
  drive(t, 1, { brake: 1 });
  drive(t, 2, {});
  ok(t.gear === 'R' && t.speed === 0, 'R rollt ohne Pedal nicht aus');
  const tip = drive(t, DT, { throttle: 1 });
  ok(t.gear === 'D' && same(gears(tip), ['D']), 'Ein Tipp auf Strom im Stand legt kein D ein');
  // Erlaubnis weg mitten in der Rückwärtsfahrt (Fahrtende, Autopilot): bremst bis zum Stand, dann D
  const a = car();
  drive(a, 4, { brake: 1 });
  const sA = a.s;
  const ra = drive(a, 3, { brake: 0.5 }, {});
  ok(a.gear === 'D' && ra.trace.every((q) => q.v <= 1e-9 || q.gear === 'D') && a.s <= sA, 'Ohne Erlaubnis fährt R weiter oder springt vorwärts');
  ok(ra.trace.findIndex((q) => q.gear === 'D') <= Math.ceil(1 / DT), 'Ohne Erlaubnis steht R nicht binnen einer Sekunde');
}

{
  // Lenken rückwärts: links gelenkt geht das Heck nach links (x fällt), die Nase dreht nach rechts
  const f = car({ speed: 4.2 });
  f.x = 1.875;
  const fw = drive(f, 1.5, { steer: -1, throttle: 0.1 });
  const r = car();
  r.x = 1.875;
  drive(r, 0.5 + 3, { brake: 1 });
  const x0 = r.x;
  const rw = drive(r, 1.5, { steer: -1, brake: 1 });
  ok(r.x < x0 - 0.05, `Links gelenkt geht das Heck nicht nach links (${(r.x - x0).toFixed(2)} m)`);
  const yF = fw.trace[fw.trace.length - 1].yaw;
  const yR = rw.trace[rw.trace.length - 1].yaw;
  ok(Math.sign(yF) === -Math.sign(yR) && yF !== 0, `Rückwärts dreht die Nase wie vorwärts (${yF.toFixed(3)} / ${yR.toFixed(3)})`);
}

{
  // die Grenze: höchstens REVERSE.back hinter den weitesten Punkt, weich, eine Meldung
  const p = car({ s: 5000 });
  const r = drive(p, 90, { brake: 1 });
  const floor = 5000 - REVERSE.back;
  ok(Math.min(...r.trace.map((q) => q.s)) >= floor - 1e-6, `Der Wagen fährt hinter die Grenze (${Math.min(...r.trace.map((q) => q.s)).toFixed(2)})`);
  ok(Math.abs(p.s - floor) < 0.5 && p.speed === 0, `Er steht nicht an der Grenze (${(p.s - floor).toFixed(2)} m davor)`);
  ok(r.ev.filter((e) => e.type === 'reverseEnd').length === 1, 'Die Grenze wird nicht genau einmal gemeldet');
  let brake = 0;
  for (let i = 1; i < r.trace.length; i++) brake = Math.max(brake, (r.trace[i - 1].speed - r.trace[i].speed) / DT);
  ok(brake <= 2.5, `Vor der Grenze bremst er hart (${brake.toFixed(2)} m/s²)`);
  // vorwärts und wieder zurück: die Grenze bleibt hinter dem weitesten Punkt (nicht je Einlegen neu)
  drive(p, 3, { throttle: 0.4 });
  drive(p, 60, { brake: 1 });
  ok(p.s >= floor - 1e-6, 'Zweimal R hintereinander fährt weiter zurück als die Grenze');
  // die Welt setzt die Grenze (Anfang des Abschnitts der Reise, Start der klassischen Strecke)
  const w = car({ s: 800, back: 760 });
  drive(w, 60, { brake: 1 });
  ok(Math.abs(w.s - 760) < 0.5 && w.s >= 760, `limits.back hält nicht (${w.s.toFixed(2)})`);
  const z = car({ s: 120, back: 0 });
  drive(z, 80, { brake: 1 });
  ok(z.s >= 0, 'Der Wagen fährt hinter den Start der Strecke');
}

if (fails) {
  console.error(`rueckwaerts-test: ${fails} von ${checks} Prüfungen fehlgeschlagen`);
  process.exit(1);
}
console.log(`rueckwaerts-test: ok (${checks} Prüfungen: R nur vom Spieler im Stand, höchstens ${(REVERSE.vmax * 3.6).toFixed(0)} km/h, D mit Strom, Grenze hält)`);
