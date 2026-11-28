// Prüfstand Qualität „Auto“ (src/autoquality.js): spart in der alten Reihenfolge (Rückspiegel, Seitenfenster, dann
// Schärfe), kommt aber auch auf einem Bildschirm mit 60 Hz wieder hinauf, auf Probe und ohne zu pendeln. Und eine Probe
// gilt nur für die Art von Bild, in der sie gelaufen ist: Cockpit und Ansichten von außen haben je ihren Stand.
// Ein Gerät ist hier: Bildschirm mit hz, und cost(level, pixelRatio) = Zeit der Grafikkarte für ein Bild in ms. Der
// Bildschirm zeigt ein Bild erst zum nächsten Takt, ein Bild dauert also ein Vielfaches von 1/hz.
import { AutoQuality, AutoViews, AUTO, AUTO_MIRROR } from '../src/autoquality.js';
import { mainSource } from './lib/main-source.mjs';

let fails = 0;
let checks = 0;
const ok = (cond, msg) => {
  checks++;
  if (!cond) {
    fails++;
    console.log('  FEHLER: ' + msg);
  }
};
const near = (a, b) => Math.abs(a - b) < 1e-9;

/**
 * Lässt q auf einem Gerät laufen. cost(level, pr, t) in ms, hitch(t, i) = zusätzliche ms für dieses Bild (Ruckler).
 * Gibt die Schritte zurück ({ t, level, pr }) und den Anteil der Zeit in Bildern, die länger als slowMs dauerten.
 */
function run(q, { hz = 60, seconds, cost, maxPR = q.base, hitch = () => 0, slowMs = 20, t0 = 0 }) {
  const tick = 1000 / hz;
  const steps = [];
  let t = t0;
  let slowT = 0;
  let i = 0;
  while (t < t0 + seconds) {
    const ms = Math.max(1, Math.ceil((cost(q.level, q.pixelRatio, t) + hitch(t, i)) / tick - 1e-9)) * tick;
    // (wie main.js frame: ein Bild zählt höchstens 1/20 s)
    const dt = Math.min(ms / 1000, 1 / 20);
    t += ms / 1000;
    i++;
    if (ms > slowMs) slowT += ms / 1000;
    if (q.tick(dt, maxPR)) steps.push({ t, level: q.level, pr: q.pixelRatio });
  }
  return { steps, slow: slowT / seconds, t };
}

// 1. Ein Gerät, das mitkommt: nichts ändert sich
{
  const q = new AutoQuality(1);
  const r = run(q, { seconds: 300, cost: () => 12 });
  ok(r.steps.length === 0 && q.level === 0 && q.pixelRatio === 1, `flüssig von Anfang an: kein Schritt (${r.steps.length})`);
  console.log(`1. Flüssig von Anfang an: ${r.steps.length} Schritte in 5 Minuten`);
}

// 2. Ein langsames Gerät: erst Rückspiegel und Seitenfenster, dann die Schärfe in Schritten von 0,12 bis 0,55
{
  const q = new AutoQuality(1);
  const r = run(q, { seconds: 60, cost: () => 40 });
  const seq = r.steps.map((s) => `${s.level}/${s.pr.toFixed(2)}`).join(' ');
  ok(seq === '1/1.00 2/1.00 2/0.88 2/0.76 2/0.64 2/0.55', `Reihenfolge beim Sparen: ${seq}`);
  ok(AUTO_MIRROR[q.level] === 3 && near(q.pixelRatio, AUTO.minPR), 'unten: Rückspiegel jedes dritte Bild, Schärfe 0,55');
  ok(r.steps[0].t > AUTO.start && r.steps[0].t < AUTO.start + 3, `der erste Schritt nach dem Start: ${r.steps[0].t.toFixed(1)} s`);
  const gaps = r.steps.slice(1).map((s, i) => s.t - r.steps[i].t);
  ok(Math.max(...gaps) < 3.2 && Math.min(...gaps) > AUTO.settle, `zwischen zwei Schritten: ${Math.min(...gaps).toFixed(1)} bis ${Math.max(...gaps).toFixed(1)} s`);
  const after = run(q, { seconds: 120, cost: () => 40, t0: r.t });
  ok(after.steps.length === 0, 'ganz unten bleibt es ruhig (kein Versuch, solange es langsam ist)');
  console.log(`2. Langsames Gerät: ${seq}`);
}

// 3. Der Kern: Ein Ruckler (1,5 s Nachladen) kostet eine Stufe, und sie kommt auf 60 Hz von selbst zurück
{
  const q = new AutoQuality(1);
  const r = run(q, { seconds: 120, cost: (l, pr, t) => (t > 20 && t < 21.5 ? 45 : 12) });
  const down = r.steps.find((s) => s.level > 0 || s.pr < 1);
  const back = r.steps.filter((s) => s.level === 0 && s.pr === 1).pop();
  ok(!!down && down.t > 20 && down.t < 23, `der Ruckler kostet einen Schritt (${down ? down.t.toFixed(1) : '–'} s)`);
  ok(!!back && q.level === 0 && q.pixelRatio === 1, 'danach wieder volle Qualität');
  ok(!!back && back.t - down.t > AUTO.retry && back.t - down.t < AUTO.retry + 12, `zurück nach ${back ? (back.t - down.t).toFixed(1) : '–'} s`);
  ok(r.steps.length <= 4, `kein Pendeln: ${r.steps.length} Schritte`);
  console.log(`3. Ruckler beim Nachladen: Schritt hinab nach ${down.t.toFixed(1)} s, zurück nach weiteren ${(back.t - down.t).toFixed(1)} s`);
}

// 4. Von ganz unten zurück (der Sparmodus des Browsers endet, das Netzteil steckt wieder): alles kommt wieder
{
  const q = new AutoQuality(1);
  const r = run(q, { seconds: 200, cost: (l, pr, t) => (t < 60 ? 40 : 10) });
  const up = r.steps.filter((s) => s.t > 60);
  const seq = up.map((s) => `${s.level}/${s.pr.toFixed(2)}`).join(' ');
  ok(seq === '2/0.61 2/0.67 2/0.73 2/0.79 2/0.85 2/0.91 2/0.97 2/1.00 1/1.00 0/1.00', `Reihenfolge hinauf: ${seq}`);
  ok(up[up.length - 1].t < 60 + AUTO.retry + 30, `volle Qualität ${(up[up.length - 1].t - 60).toFixed(0)} s nach dem Ende der Last`);
  // (ganz unten ändert ein zu langsames Bild nichts mehr, also beginnt auch die Wartezeit nicht jedes Mal neu)
  ok(up.length > 0 && up[0].t - 60 < 4, `nach einer Minute ganz unten wartet nichts mehr: erster Schritt hinauf ${up.length ? (up[0].t - 60).toFixed(1) : '–'} s nach dem Ende der Last`);
  console.log(`4. Von ganz unten zurück: ${up.length} Schritte, fertig ${(up[up.length - 1].t - 60).toFixed(0)} s nach dem Ende der Last`);
}

// 5. Am Limit: Mit dem Rückspiegel in jedem Bild schafft das Gerät die 60 nicht, mit jedem zweiten schon. Es bleibt
//    auf Stufe 1, versucht es selten, nimmt den Versuch sofort zurück und wartet jedes Mal länger
{
  const q = new AutoQuality(1);
  const cost = (l) => (l === 0 ? 18 : 15);
  const r = run(q, { seconds: 1800, cost });
  const tries = r.steps.filter((s) => s.level === 0);
  const gaps = tries.slice(1).map((s, i) => Math.round(s.t - tries[i].t));
  ok(q.level === 1 && q.pixelRatio === 1, 'bleibt auf Stufe 1 mit voller Schärfe');
  ok(tries.length >= 5 && tries.length <= 9, `Versuche in 30 Minuten: ${tries.length}`);
  // (je Versuch gut 3 s für die Probe und den Weg zurück, dann die Wartezeit: 30 s, nach jedem Fehlschlag doppelt)
  ok(gaps.slice(0, 5).join(', ') === '33, 63, 123, 243, 303' && gaps.slice(5).every((g) => g === 303), `Abstände der Versuche verdoppeln sich bis 5 Minuten: ${gaps.join(', ')} s`);
  // jeder Versuch: ein Schritt hinauf und einer zurück, dazwischen höchstens 3 s
  const pairs = tries.map((s) => r.steps[r.steps.indexOf(s) + 1]).filter(Boolean);
  ok(pairs.every((s, i) => s.level === 1 && s.t - tries[i].t < 3), `jeder Fehlversuch dauert unter 3 s (längster ${Math.max(...pairs.map((s, i) => s.t - tries[i].t)).toFixed(1)} s)`);
  ok(r.slow < 0.02, `Anteil langsamer Bilder: ${(r.slow * 100).toFixed(1)} %`);
  console.log(`5. Am Limit: ${tries.length} Versuche in 30 Minuten (Abstände ${gaps.join(', ')} s), ${(r.slow * 100).toFixed(1)} % der Zeit langsamer`);

  // … und wird die Strecke leichter, klappt der nächste Versuch; hält er, beginnt die Wartezeit wieder bei 30 s
  const r2 = run(q, { seconds: 400, cost: () => 12, t0: r.t });
  ok(q.level === 0 && r2.steps.length === 1 && r2.steps[0].t - r.t <= AUTO.retryMax + 2, `leichtere Strecke: zurück auf Stufe 0 nach ${r2.steps.length ? (r2.steps[0].t - r.t).toFixed(0) : '–'} s`);
  ok(q.retry === AUTO.retry && q.held === -1, 'der Schritt hat gehalten: Wartezeit wieder 30 s');
}

// 6. Kein Tausch von Bildrate gegen Schärfe: Ein Schritt, der das Bild unter 57 je Sekunde drückt, gilt nicht – auch
//    wenn es danach noch über 45 wäre (Bildschirm mit 144 Hz: 13,9 ms flüssig, 20,8 ms nicht mehr)
{
  const q = new AutoQuality(1);
  const cost = (l, pr) => (pr > 0.8 ? 16 : 9); // schärfer als 0,8: 20,8 ms je Bild, darunter 13,9 ms
  run(q, { hz: 144, seconds: 20, cost: () => 30 }); // erst langsam: hinab
  const low = q.pixelRatio;
  const r = run(q, { hz: 144, seconds: 600, cost, t0: 20 });
  ok(low < 0.8 && q.pixelRatio <= 0.8 + 1e-9 && q.pixelRatio > 0.74, `Schärfe pendelt sich unter der Grenze ein: ${q.pixelRatio.toFixed(2)}`);
  const over = r.steps.filter((s) => s.pr > 0.8 + 1e-9);
  const reverted = over.every((s) => {
    const next = r.steps[r.steps.indexOf(s) + 1];
    return next && next.pr < s.pr && next.t - s.t < 3;
  });
  ok(over.length >= 1 && reverted, `Schritte über die Grenze (${over.length}) werden zurückgenommen`);
  // der Stand nach einem Fehlversuch ist genau der davor (kein Schritt von 0,12 hinab)
  const i = r.steps.indexOf(over[0]);
  ok(i > 0 && near(r.steps[i + 1].pr, r.steps[i - 1].pr) && r.steps[i + 1].level === r.steps[i - 1].level, 'zurück genau auf den Stand vor dem Versuch');
  console.log(`6. Kein Tausch Bildrate gegen Schärfe: bleibt bei ${q.pixelRatio.toFixed(2)}, ${over.length} Versuche darüber zurückgenommen`);
}

// 7. Zwischen 45 und 57 Bildern je Sekunde ändert sich nichts (wie bisher zwischen 45 und 75), auch nicht genau an der
//    Grenze (165 Hz: jedes dritte Bild des Bildschirms sind 55 je Sekunde)
{
  const q = new AutoQuality(1);
  const r = run(q, { hz: 144, seconds: 300, cost: () => 20 }); // 20,8 ms je Bild
  ok(r.steps.length === 0, `48 Bilder je Sekunde: kein Schritt (${r.steps.length})`);
  const q165 = new AutoQuality(1);
  run(q165, { hz: 165, seconds: 20, cost: () => 30 });
  const r165 = run(q165, { hz: 165, seconds: 300, cost: () => 17, t0: 20 }); // 18,2 ms je Bild
  ok(r165.steps.length === 0, `55 Bilder je Sekunde auf 165 Hz: kein Schritt (${r165.steps.length})`);
  console.log('7. Zwischen 45 und 57 Bildern je Sekunde: Ruhe');
}

// 8. Bildschirm mit hoher Punktdichte (Start 1,25, möglich 1,5): mehr Schärfe als beim Start nur über 75 je Sekunde
{
  const q = new AutoQuality(1.25);
  let r = run(q, { hz: 60, seconds: 120, cost: () => 5, maxPR: 1.5 });
  ok(r.steps.length === 0 && q.pixelRatio === 1.25, '60 Hz: bleibt beim Startwert 1,25');
  r = run(q, { hz: 120, seconds: 120, cost: () => 5, maxPR: 1.5 });
  const seq = r.steps.map((s) => s.pr.toFixed(2)).join(' ');
  ok(seq === '1.31 1.37 1.43 1.49 1.50' && q.level === 0, `120 Hz mit Luft: ${seq}`);
  // … wird es dort langsam, geht es wie bisher erst an Rückspiegel und Seitenfenster, dann an die Schärfe
  r = run(q, { hz: 120, seconds: 30, cost: () => 40, maxPR: 1.5 });
  ok(r.steps[0].level === 1 && r.steps[1].level === 2 && near(r.steps[2].pr, 1.38), 'hinab in der alten Reihenfolge');
  // und nach 60 Hz zurück nur bis zum Startwert
  const q2 = new AutoQuality(1.25);
  run(q2, { hz: 60, seconds: 30, cost: () => 40, maxPR: 1.5 });
  run(q2, { hz: 60, seconds: 200, cost: () => 5, maxPR: 1.5, t0: 30 });
  ok(q2.level === 0 && q2.pixelRatio === 1.25, `60 Hz nach einer langsamen Phase: zurück auf 1,25 (${q2.pixelRatio})`);
  // „sicher Luft“ zählt alle Bilder der Messung, auch die Ruckler (85 Hz: 11,8 ms je Bild, mit zwei Bildern von 50 ms
  // im Mittel 13,7 ms und damit unter 75 je Sekunde)
  const q3 = new AutoQuality(1.25);
  for (let n = 0; n < 1000 && q3.settle > 0; n++) q3.tick(1 / 85, 1.5);
  let told = false;
  for (const ms of [...Array(38).fill(1000 / 85), 50, 50]) told = q3.tick(ms / 1000, 1.5) || told;
  ok(!told && q3.pixelRatio === 1.25, '85 Hz mit zwei Rucklern in der Messung: keine sichere Luft, nicht schärfer als beim Start');
  for (let n = 0; n < 40; n++) told = q3.tick(1 / 85, 1.5) || told;
  ok(told && near(q3.pixelRatio, 1.31), `85 Hz ohne Ruckler: ein Schritt über den Startwert (${q3.pixelRatio.toFixed(2)})`);
  console.log(`8. Hohe Punktdichte: 60 Hz bleibt bei 1,25, 120 Hz mit Luft ${seq}`);
}

// 9. Einzelne Ruckler (alle paar Sekunden ein Bild von 50 ms) kosten nichts und halten den Weg hinauf nicht auf
{
  const q = new AutoQuality(1);
  let r = run(q, { seconds: 300, cost: () => 12, hitch: (t, i) => (i % 150 === 149 ? 40 : 0) });
  ok(r.steps.length === 0, `mit einzelnen Rucklern: kein Schritt hinab (${r.steps.length})`);
  run(q, { seconds: 30, cost: () => 40, t0: 300 });
  r = run(q, { seconds: 120, cost: () => 12, hitch: (t, i) => (i % 37 === 36 ? 40 : 0), t0: 330 });
  ok(q.level === 0 && q.pixelRatio === 1, `trotz Rucklern (etwa einer je Messung) wieder volle Qualität (${q.level}/${q.pixelRatio.toFixed(2)})`);
  console.log('9. Einzelne Ruckler: kosten nichts, halten den Weg hinauf nicht auf');
}

// 10. Neue Einstellung: von vorn, auch mitten in einer Probe nach einem Fehlschlag
{
  const q = new AutoQuality(1);
  run(q, { seconds: 60, cost: () => 40 });
  // (das Gerät von 5: Stufe 0 schafft es nicht; weiter bis zum nächsten Versuch, der gerade läuft)
  const cost = (l) => (l === 0 ? 18 : 12);
  let r = run(q, { seconds: 400, cost, t0: 60 });
  for (let n = 0; n < 4000 && !q.trial; n++) r = run(q, { seconds: 0.1, cost, t0: r.t });
  ok(q.trial !== null && q.held >= 0 && q.retry > AUTO.retry, `vor reset: eine Probe läuft, nach Fehlschlägen (Wartezeit ${q.retry} s)`);
  q.reset(1.25);
  ok(q.level === 0 && q.pixelRatio === 1.25 && q.base === 1.25 && q.trial === null && q.held === -1 && q.wait === 0 && q.retry === AUTO.retry && q.settle === AUTO.start, 'reset: volle Qualität, nichts wartet, keine Probe offen');
  // … und was vorher lief, wirkt nicht nach: 48 Bilder je Sekunde (nicht flüssig, nicht zu langsam) ändern nichts
  const after = run(q, { hz: 144, seconds: 60, cost: () => 20, t0: r.t });
  ok(after.steps.length === 0 && q.level === 0 && q.pixelRatio === 1.25, `nach reset: kein Schritt aus der alten Probe (${after.steps.length})`);
  console.log('10. reset stellt alles zurück, auch mitten in einer Probe');
}

/** Eine Messung aus genau diesen Bildern (ms), nach Ablauf der Ruhezeit. Gibt zurück, ob ein Schritt folgte. */
function measure(q, list, light = false) {
  for (let n = 0; n < 1000 && q.settle > 0; n++) q.tick(1 / 60, q.base, light);
  let stepped = false;
  for (const ms of list) stepped = q.tick(Math.min(ms / 1000, 1 / 20), q.base, light) || stepped;
  return stepped;
}
/** n Bilder der Dauer ms, die letzten davon ersetzt durch extra (Ruckler). */
const frames = (n, ms, ...extra) => [...Array(n - extra.length).fill(ms), ...extra];
/** Eine Regel auf Stufe 1, deren Wartezeit um ist: Die nächste flüssige Messung holt Stufe 0 auf Probe zurück. */
function waiting() {
  const q = new AutoQuality(1);
  measure(q, frames(AUTO.frames, 30));
  q.wait = 0;
  return q;
}

// 11. Was eine Messung „flüssig“ nennt: das Mittel ohne die zwei längsten Bilder, nicht ohne eines, nicht ohne drei.
//     Auf einem Bildschirm mit 59 Hz (16,9 ms je Bild), damit die Grenze von 1/57 s nicht auf der Kippe steht
{
  const B = 1000 / 59;
  let q = waiting();
  ok(q.level === 1 && q.trial === null, 'Ausgangslage: Stufe 1, keine Probe');
  ok(measure(q, frames(40, B, 50, 50)) && q.level === 0 && q.trial !== null, 'zwei Ruckler von 50 ms in der Messung: trotzdem flüssig, Stufe 0 auf Probe');
  // … und die Probe hält, wenn auch die nächste Messung zwei Ruckler hat
  ok(!measure(q, frames(40, B, 50, 50)) && q.level === 0 && q.trial === null, 'die Probe gilt, auch mit zwei Rucklern in ihrer Messung');
  // (58 Hz: Bliebe von den beiden nur der längere draußen, wäre diese Messung nicht mehr flüssig)
  q = waiting();
  ok(measure(q, [...frames(20, 1000 / 58, 2000 / 58), ...frames(20, 1000 / 58, 50)]) && q.level === 0, 'erst der kürzere, dann der längere Ruckler: beide zählen nicht');
  q = waiting();
  ok(!measure(q, frames(40, B, 50, 50, 50)) && q.level === 1 && q.trial === null, 'drei Ruckler in der Messung: nicht flüssig, kein Versuch');
  // eine Probe, nach der jedes Bild einen Takt zu spät kommt, fällt durch
  q = waiting();
  measure(q, frames(40, B));
  ok(q.level === 0 && measure(q, frames(40, 2 * B)) && q.level === 1 && q.trial === null && q.wait === AUTO.retry && q.retry === 2 * AUTO.retry, 'Probe mit halber Bildrate: zurück auf Stufe 1, nächster Versuch in 30 s, danach in 60 s');
  // „zu langsam“ misst alle Bilder: 48 je Sekunde und zwei Ruckler sind im Mittel unter 45
  q = new AutoQuality(1);
  ok(measure(q, frames(40, 1000 / 48, 50, 50)) && q.level === 1, 'zu langsam zählt mit den Rucklern (wie bisher): 48 je Sekunde und zwei von 50 ms kosten einen Schritt');
  q = new AutoQuality(1);
  ok(!measure(q, frames(40, 1000 / 48)), '48 je Sekunde ohne Ruckler: kein Schritt');
  // Bilder über 1/20 s lässt main.js nicht durch. Kämen sie doch, könnte eine Messung flüssig und zu langsam zugleich
  // sein: Dann geht es von der Probe aus hinab, und sie ist damit erledigt (kein späterer Sprung auf ihren alten Stand)
  q = waiting();
  measure(q, frames(40, B));
  for (let n = 0; n < 100 && q.settle > 0; n++) q.tick(1 / 60);
  let stepped = false;
  for (const ms of frames(40, B, 300, 300)) stepped = q.tick(ms / 1000) || stepped;
  ok(stepped && q.level === 1 && q.trial === null, 'flüssig und zu langsam zugleich (zwei Bilder von 300 ms): ein Schritt hinab, die Probe ist erledigt');
  console.log('11. Flüssig heißt: ohne die zwei längsten Bilder über 57 je Sekunde');
}

// 12. Nach jedem Schritt eine Sekunde ohne Messung: Neue Bildpuffer kosten einmal Zeit, das darf kein Urteil sein
{
  const q = new AutoQuality(1);
  run(q, { seconds: 60, cost: () => 40 });
  // ab jetzt reicht es für alles, aber nach jedem Schritt dauern die Bilder eine halbe Sekunde lang 42 ms
  let last = { level: q.level, pr: q.pixelRatio, t: -1 };
  const cost = (l, pr, t) => {
    if (l !== last.level || pr !== last.pr) last = { level: l, pr, t };
    return t - last.t < 0.5 ? 42 : 12;
  };
  const r = run(q, { seconds: 200, cost, t0: 60 });
  const downs = r.steps.filter((st, i) => i > 0 && (st.level > r.steps[i - 1].level || st.pr < r.steps[i - 1].pr));
  ok(q.level === 0 && q.pixelRatio === 1 && downs.length === 0, `Ruckeln nach jedem Schritt: trotzdem zurück zu voller Qualität, kein Schritt zurück (${q.level}/${q.pixelRatio.toFixed(2)}, ${downs.length})`);
  console.log(`12. Eine Sekunde Ruhe nach jedem Schritt: ${r.steps.length} Schritte hinauf, keiner zurück`);
}

// 13. Grenzen: nie schärfer, als der Bildschirm zeigen kann; nach einem Schritt hinab an der Schärfe wartet der Weg hinauf
{
  // Start 1,25, dann wandert das Fenster auf einen Bildschirm mit Punktdichte 1: zurück nur bis 1,0
  const q = new AutoQuality(1.25);
  run(q, { seconds: 30, cost: () => 40, maxPR: 1 });
  run(q, { seconds: 200, cost: () => 5, maxPR: 1, t0: 30 });
  ok(q.level === 0 && q.pixelRatio === 1, `Bildschirm mit Punktdichte 1 nach Start mit 1,25: hinauf nur bis 1,0 (${q.pixelRatio})`);
  // Schärfe 1,0 schafft das Gerät nicht, 0,88 schon: ein Schritt hinab, der nächste Versuch frühestens nach 30 s
  const q2 = new AutoQuality(1);
  const r = run(q2, { seconds: 120, cost: (l, pr) => (pr > 0.9 ? 40 : 12) });
  const down = r.steps.filter((st) => st.pr < 0.9 && st.level === 2)[0];
  const up = r.steps.find((st) => st.t > down.t);
  ok(!!down && !!up && up.pr > down.pr && up.t - down.t > AUTO.retry && up.t - down.t < AUTO.retry + 3, `nach dem Schritt hinab an der Schärfe: nächster Versuch nach ${up ? (up.t - down.t).toFixed(1) : '–'} s`);
  console.log('13. Grenzen: Schärfe höchstens die des Bildschirms, Wartezeit auch nach Schritten an der Schärfe');
}

// --- zwei Arten von Bild (AutoViews) ---------------------------------------------------------------------------------
/**
 * Lässt q wie main.js laufen: Vor jedem Bild bekommt die Regel die Dauer des Bilds davor und was es gezeigt hat (view(t):
 * { inside, light }); dann entsteht das Bild in der Stufe und Schärfe, die danach gelten – das erste Bild nach einem
 * Wechsel der Ansicht also noch in der Schärfe der alten. q: AutoViews oder, zum Vergleich, eine einzige AutoQuality
 * für alles (so war es zuerst gebaut). cost(inside, level, pr, t) in ms. Gibt die Schritte zurück (Änderungen am Stand
 * der gezeigten Ansicht, nicht den Wechsel zwischen den Ansichten) und je Ansicht die Zeit in Bildern über slowMs
 * (in/out: Sekunden gesamt und langsam).
 */
const SHOWN = new WeakMap(); // je Regel das zuletzt gezeigte Bild und die Schärfe, in der gezeichnet wird, auch über mehrere Läufe hinweg
let unreported = 0; // Bilder, die in einer anderen Schärfe entstanden, als die Regel gerade nennt (tick hat sie nicht gemeldet)
function runViews(q, { hz = 60, seconds, cost, view, maxPR = 1, slowMs = 20, t0 = 0 }) {
  const tick = 1000 / hz;
  const steps = [];
  const time = { in: 0, out: 0, slowIn: 0, slowOut: 0 };
  const shared = !(q instanceof AutoViews);
  let t = t0;
  // die Schärfe des Bilds: main.js stellt sie nur um, wenn tick etwas meldet (adaptResolution)
  let drawnPR = SHOWN.has(q) ? SHOWN.get(q).pr : q.pixelRatio;
  while (t < t0 + seconds) {
    const last = SHOWN.get(q);
    if (last) {
      const rule = shared ? q : last.inside ? q.inside : q.outside;
      const [level, pr] = [rule.level, rule.pixelRatio];
      if (shared ? q.tick(last.dt, maxPR) : q.tick(last.dt, maxPR, last.inside, last.light)) drawnPR = q.pixelRatio;
      if (drawnPR !== q.pixelRatio) unreported++;
      if (rule.level !== level || rule.pixelRatio !== pr) steps.push({ t, level: rule.level, pr: rule.pixelRatio, inside: last.inside });
    }
    const v = view(t);
    const ms = Math.max(1, Math.ceil(cost(v.inside, q.level, drawnPR, t) / tick - 1e-9)) * tick;
    SHOWN.set(q, { dt: Math.min(ms / 1000, 1 / 20), inside: v.inside, light: !!v.light, pr: drawnPR });
    time[v.inside ? 'in' : 'out'] += ms / 1000;
    if (ms > slowMs) time[v.inside ? 'slowIn' : 'slowOut'] += ms / 1000;
    t += ms / 1000;
  }
  return { steps, time, t };
}
/** Neue Einstellung wie main.js applySettings: beide Stände von vorn, und das nächste Bild entsteht in dieser Schärfe. */
function resetViews(q, pr) {
  q.reset(pr);
  if (SHOWN.has(q)) SHOWN.get(q).pr = pr;
}
const INSIDE = { inside: true };
const OUTSIDE = { inside: false };

// 14. Der Kern: Das Cockpit schafft Stufe 0 nicht (18 ms), ab Stufe 1 läuft es (15 ms). Von außen kostet das Bild
//     15 ms, was auch immer die Stufe sagt. Fünf Minuten Drohne dürfen dem Cockpit seinen Stand nicht nehmen
{
  const cost = (inside, l) => (inside ? (l === 0 ? 18 : 15) : 15);
  const scene = (q) => {
    const a = runViews(q, { seconds: 330, cost, view: () => INSIDE });
    const state = q instanceof AutoViews ? { level: q.inside.level, retry: q.inside.retry, wait: q.inside.wait } : null;
    const b = runViews(q, { seconds: 330, cost, view: () => OUTSIDE, t0: a.t });
    const c = runViews(q, { seconds: 120, cost, view: () => INSIDE, t0: b.t });
    return { a, b, c, state };
  };
  const v = new AutoViews(1);
  const r = scene(v);
  ok(r.state.level === 1 && r.state.retry > AUTO.retry, `im Cockpit: Stufe 1, Versuche scheitern (Wartezeit ${r.state.retry} s)`);
  ok(r.b.steps.length === 0 && v.outside.level === 0 && v.outside.pixelRatio === 1, `von außen: volle Schärfe, kein Schritt (${r.b.steps.length})`);
  const first = r.c.steps[0];
  ok(v.inside.level === 1 && v.inside.retry >= r.state.retry && (!first || first.t - r.b.t >= Math.min(r.state.wait, 100)), `zurück im Cockpit: Stufe 1 wie zuvor, die Wartezeit läuft weiter (${first ? 'nächster Versuch nach ' + (first.t - r.b.t).toFixed(0) + ' s' : 'kein Versuch in 2 Minuten'})`);
  ok(r.c.time.slowIn <= 2.5, `zurück im Cockpit: ${r.c.time.slowIn.toFixed(1)} s unter 45 Bildern je Sekunde in 2 Minuten (höchstens ein Versuch)`);
  // Gegenprobe: mit einem Stand für alles holt die Drohne Stufe 0 zurück, und das Cockpit zahlt es
  const one = new AutoQuality(1);
  const r1 = scene(one);
  ok(r1.c.time.slowIn > r.c.time.slowIn + 2, `Gegenprobe, ein Stand für beide Ansichten: ${r1.c.time.slowIn.toFixed(1)} s zu langsam nach der Rückkehr`);
  console.log(`14. Fünf Minuten Drohne: Das Cockpit behält Stufe 1 (${r.c.time.slowIn.toFixed(1)} s zu langsam in den 2 Minuten danach; mit einem gemeinsamen Stand ${r1.c.time.slowIn.toFixed(1)} s)`);
}

// 15. Wechsel im Minutentakt, eine halbe Stunde lang: Das Cockpit braucht Stufe 2 und etwas weniger Schärfe, von außen
//     reicht es für alles. Die Wechsel dürfen das Cockpit nichts kosten: so wenig langsame Bilder wie ohne sie
{
  const cost = (inside, l, pr) => 12.5 * pr * pr + (inside ? [8, 6, 4.5][l] : 3);
  const view = (t) => (Math.floor(t / 60) % 2 ? INSIDE : OUTSIDE);
  const v = new AutoViews(1);
  const r = runViews(v, { seconds: 1800, cost, view });
  const one = new AutoQuality(1);
  const r1 = runViews(one, { seconds: 1800, cost, view });
  // dieselben 15 Minuten Cockpit am Stück
  const alone = runViews(new AutoViews(1), { seconds: 900, cost, view: () => INSIDE });
  const share = (x) => x.time.slowIn / x.time.in;
  ok(v.inside.level === 2 && v.inside.pixelRatio < 1 && v.inside.pixelRatio > 0.8, `Cockpit: Stufe 2, Schärfe ${v.inside.pixelRatio.toFixed(2)}`);
  ok(v.outside.pixelRatio === 1 && r.time.slowOut === 0 && r.steps.every((st) => st.inside), 'von außen: volle Schärfe, nie zu langsam, kein Schritt');
  ok(share(r) <= share(alone) + 0.003 && share(r) < 0.035, `Cockpit: ${(share(r) * 100).toFixed(1)} % der Zeit unter 45 Bildern je Sekunde (ohne Wechsel ${(share(alone) * 100).toFixed(1)} %: der Weg hinab am Anfang und die Versuche)`);
  ok(share(r1) > 4 * share(r), `Gegenprobe, ein Stand für beide Ansichten: ${(share(r1) * 100).toFixed(1)} %`);
  console.log(`15. Drohne und Cockpit im Minutentakt: Cockpit ${(share(r) * 100).toFixed(1)} % der Zeit zu langsam, wie ohne Wechsel (${(share(alone) * 100).toFixed(1)} %); mit einem gemeinsamen Stand ${(share(r1) * 100).toFixed(1)} %`);
}

// 16. Die Ansicht von außen spart nur an der Schärfe (eine Sparstufe gibt es dort nicht) und erholt sich selbst
{
  const v = new AutoViews(1);
  const r = runViews(v, { seconds: 120, cost: (inside, l, pr, t) => (t > 20 && t < 21.5 ? 45 : 12), view: () => OUTSIDE });
  const seq = r.steps.map((st) => `${st.level}/${st.pr.toFixed(2)}`).join(' ');
  ok(seq === '0/0.88 0/0.94 0/1.00', `Ruckler von außen: ${seq}`);
  ok(r.steps[1].t - r.steps[0].t > AUTO.retry && v.outside.level === 0 && v.inside.level === 0 && v.inside.pixelRatio === 1, 'zurück nach 30 s; der Stand des Cockpits bleibt unberührt');
  // dauerhaft langsam: von außen geht es sofort an die Schärfe, bis 0,55
  const v2 = new AutoViews(1);
  const r2 = runViews(v2, { seconds: 60, cost: () => 40, view: () => OUTSIDE });
  ok(r2.steps.map((st) => `${st.level}/${st.pr.toFixed(2)}`).join(' ') === '0/0.88 0/0.76 0/0.64 0/0.55' && v2.level === 0, 'langsam von außen: nur die Schärfe, in Schritten bis 0,55');
  console.log(`16. Von außen: ${seq}`);
}

// 17. Wechsel der Ansicht: Keine Messung reicht über ihn hinweg, und die Schärfe ist vom zweiten Bild an die der neuen
//     Ansicht (das erste ist schon gezeichnet, wenn die Regel von ihm erfährt)
{
  const v = new AutoViews(1);
  // Cockpit zu langsam: 0,5 s vor dem Ende der Messung (30 von 40 Bildern) Wechsel nach außen, dort flüssig
  const cost = (inside) => (inside ? 40 : 12);
  let r = runViews(v, { seconds: AUTO.start, cost, view: () => INSIDE });
  for (let n = 0; n < 200 && v.inside.n < 30; n++) r = runViews(v, { seconds: 0.05, cost, view: () => INSIDE, t0: r.t });
  ok(v.inside.level === 0 && v.inside.n === 30, `Cockpit, zu langsam, mitten in der ersten Messung (${v.inside.n} von ${AUTO.frames} Bildern)`);
  r = runViews(v, { seconds: 60, cost, view: () => OUTSIDE, t0: r.t });
  ok(r.steps.length === 0 && v.inside.level === 0 && v.outside.pixelRatio === 1, 'nach außen gewechselt: Die angefangene Messung des Cockpits kostet keinen Schritt');
  // zurück: Die Messung beginnt neu, nach einer Sekunde Ruhe
  const back = r.t;
  r = runViews(v, { seconds: 30, cost, view: () => INSIDE, t0: back });
  ok(r.steps.length > 0 && r.steps[0].t - back > AUTO.settle + 1.5 && r.steps[0].t - back < AUTO.settle + 2.5, `zurück im Cockpit: erster Schritt nach ${r.steps.length ? (r.steps[0].t - back).toFixed(1) : '–'} s (1 s Ruhe, dann 40 Bilder)`);
  ok(v.inside.pixelRatio < 1 && v.pixelRatio === v.inside.pixelRatio && v.level === v.inside.level, 'gezeigt: Schärfe und Stufe des Cockpits');
  // der Wechsel selbst meldet sich (main.js stellt dann die Schärfe um) und misst nicht
  const n = v.outside.n;
  ok(v.tick(1 / 20, 1, false) === true && v.pixelRatio === 1 && v.outside.n === 0 && v.outside.settle >= AUTO.settle && v.level === v.inside.level, `Wechsel nach außen: gemeldet, Schärfe ${v.pixelRatio}, die Stufe bleibt die des Cockpits (${v.level}), Messung von vorn (vorher ${n} Bilder)`);
  ok(v.tick(1 / 60, 1, false) === false, 'danach wieder ruhig');
  // neue Einstellung: beide Stände von vorn
  const w = new AutoViews(1);
  runViews(w, { seconds: 20, cost: () => 40, view: () => INSIDE });
  runViews(w, { seconds: 20, cost: () => 40, view: () => OUTSIDE, t0: 20 });
  const low = w.inside.level > 0 && w.inside.pixelRatio < 1 && w.outside.pixelRatio < 1;
  w.reset(1.25);
  ok(low && [w.inside, w.outside].every((q) => q.level === 0 && q.pixelRatio === 1.25 && q.base === 1.25 && q.settle === AUTO.start && q.wait === 0 && q.fresh && !q.quick) && w.pixelRatio === 1.25 && w.level === 0, 'reset: beide Stände von vorn mit der neuen Schärfe');
  // eine offene Probe im Cockpit übersteht den Wechsel: Sie bleibt offen, nichts an ihr läuft weiter, und nach der
  // Rückkehr entscheiden die Bilder des Cockpits über sie
  const a = new AutoViews(1);
  const feed = (inside, n, ms) => {
    let told = false;
    for (let i = 0; i < n; i++) told = a.tick(ms / 1000, 1, inside) || told;
    return told;
  };
  const B = 1000 / 60;
  feed(true, 1, B);
  for (let n = 0; n < 1000 && a.inside.settle > 0; n++) feed(true, 1, B);
  feed(true, 40, 30); // zu langsam: Stufe 1
  a.inside.wait = 0;
  for (let n = 0; n < 1000 && a.inside.settle > 0; n++) feed(true, 1, B);
  feed(true, 40, B); // flüssig: Stufe 0 auf Probe
  feed(true, 30, B); // eine halbe Sekunde davon ist um
  const snap = () => JSON.stringify([a.inside.level, a.inside.trial, +a.inside.held.toFixed(6), +a.inside.wait.toFixed(6), a.inside.retry]);
  const before = snap();
  ok(a.inside.level === 0 && a.inside.trial !== null && near(a.inside.held, 0.5), `Cockpit: Stufe 0 auf Probe, seit ${a.inside.held.toFixed(1)} s`);
  feed(false, 3600, B); // eine Minute von außen, flüssig
  ok(snap() === before && a.outside.pixelRatio === 1, 'eine Minute von außen: Probe, gehaltene Zeit, Wartezeit des Cockpits stehen');
  ok(feed(true, 1, B) && snap() === before && a.inside.settle === AUTO.settle, 'zurück im Cockpit: Die Probe ist noch offen, erst eine Sekunde Ruhe');
  let frames30 = 0;
  while (a.inside.trial && frames30 < 1000) (feed(true, 1, 1000 / 30), frames30++);
  // (eine Sekunde Ruhe sind hier 30 oder, wenn beim Abziehen ein Rest bleibt, 31 Bilder; dann die Messung)
  ok(frames30 - AUTO.frames >= 30 && frames30 - AUTO.frames <= 31 && a.inside.level === 1 && a.inside.wait === AUTO.retry && a.inside.retry === 2 * AUTO.retry, `das Cockpit ist mit Stufe 0 nicht flüssig: Probe zurück nach ${frames30} Bildern, Wartezeit 30 s, danach 60 s`);
  // maxPR kommt bei beiden Ständen an: mit sicher Luft schärfer als beim Start, je Ansicht für sich
  const hi = new AutoViews(1.25);
  runViews(hi, { hz: 120, seconds: 60, cost: () => 5, view: () => INSIDE, maxPR: 1.5 });
  ok(hi.inside.pixelRatio === 1.5 && hi.pixelRatio === 1.5 && hi.outside.pixelRatio === 1.25, `120 Hz mit Luft im Cockpit: Schärfe ${hi.inside.pixelRatio}, von außen noch ${hi.outside.pixelRatio}`);
  const out = runViews(hi, { hz: 120, seconds: 60, cost: () => 5, view: () => OUTSIDE, maxPR: 1.5, t0: 60 });
  ok(hi.outside.pixelRatio === 1.5 && out.steps.length === 5 && hi.inside.pixelRatio === 1.5, `… und von außen ebenso (${out.steps.length} Schritte)`);
  console.log('17. Wechsel der Ansicht: neue Messung, vom zweiten Bild an die Schärfe der Ansicht');
}

// 18. Das leichtere Bild (im Cockpit fehlt die Facecam, die sonst dazugehört): sparen ja, zurückholen nein
{
  const B = 1000 / 60;
  // nichts kommt zurück, solange das Bild leichter ist, auch wenn die Wartezeit längst um ist
  let q = waiting();
  for (let n = 0; n < 40; n++) measure(q, frames(40, B), true);
  ok(q.level === 1 && q.trial === null, 'leichteres Bild, flüssig, Wartezeit um: kein Versuch');
  // ein einziges leichteres Bild in der Messung reicht
  q = waiting();
  for (let n = 0; n < 1000 && q.settle > 0; n++) q.tick(1 / 60, 1);
  let seen = 0;
  for (const [i, ms] of frames(40, B).entries()) {
    q.tick(ms / 1000, 1, i === 7);
    seen = Math.max(seen, q.n);
  }
  ok(seen === AUTO.frames - 1 && q.n === 0 && q.level === 1 && q.trial === null, `ein leichteres Bild in der Messung (${seen + 1} Bilder gemessen): kein Versuch`);
  ok(measure(q, frames(40, B)) && q.level === 0 && q.trial !== null, 'die nächste Messung im vollen Bild: Stufe 0 auf Probe');
  // Bilder in der Ruhezeit misst die Regel nicht, also sagen sie auch nichts über die Messung danach: Fehlt die Facecam
  // nur dort (sie blendet nach einem Wechsel der Ansicht erst ein), zählt die erste volle Messung
  const s = waiting();
  for (let n = 0; n < 1000 && s.settle > 0; n++) s.tick(1 / 60, 1, true);
  let told = false;
  for (const ms of frames(40, B)) told = s.tick(ms / 1000, 1, false) || told;
  ok(told && s.level === 0 && s.trial !== null, 'leichtere Bilder nur in der Ruhezeit: Die erste volle Messung holt Stufe 0 auf Probe zurück');
  // eine offene Probe bleibt im leichteren Bild offen, so lange es dauert, und zählt nicht als gehalten
  const held = q.held;
  for (let n = 0; n < 60; n++) measure(q, frames(40, B), true);
  ok(q.level === 0 && q.trial !== null && q.held === held && q.retry === AUTO.retry, `leichteres Bild, 40 s flüssig: Die Probe bleibt offen (gehalten ${q.held.toFixed(1)} s)`);
  // … und fällt durch, sobald das volle Bild zu langsam ist: zurück, mit doppelter Wartezeit
  ok(measure(q, frames(40, 2 * B)) && q.level === 1 && q.trial === null && q.retry === 2 * AUTO.retry, 'volles Bild nicht flüssig: Probe zurück, Wartezeit verdoppelt');
  // ist schon das leichtere Bild nicht flüssig (50 je Sekunde: nicht flüssig, aber auch nicht zu langsam), fällt die
  // Probe gleich durch
  q = waiting();
  measure(q, frames(40, B));
  ok(q.trial !== null && measure(q, frames(40, 20), true) && q.level === 1 && q.trial === null && q.wait === AUTO.retry, 'leichteres Bild nicht flüssig: Probe sofort zurück');
  // die Wartezeit läuft auch im leichteren Bild ab: nach einem Fehlschlag und 40 s ohne Facecam kommt der nächste
  // Versuch mit der ersten vollen Messung
  q = waiting();
  measure(q, frames(40, B));
  measure(q, frames(40, 2 * B));
  for (let n = 0; n < 60; n++) measure(q, frames(40, B), true);
  ok(q.level === 1 && q.trial === null && q.wait < 0, `40 s leichteres Bild nach einem Fehlschlag: kein Versuch, die Wartezeit ist um (${q.wait.toFixed(0)} s)`);
  ok(measure(q, frames(40, B)) && q.level === 0 && q.trial !== null, 'danach: Versuch mit der ersten vollen Messung');
  // gespart wird auch im leichteren Bild
  q = new AutoQuality(1);
  ok(measure(q, frames(40, 30), true) && q.level === 1, 'leichteres Bild zu langsam: ein Schritt hinab');
  // über AutoViews: light kommt bei der Regel des Cockpits an
  const v = new AutoViews(1);
  v.tick(1 / 60, 1, true);
  v.inside.level = 1;
  v.inside.settle = 0;
  for (let n = 0; n < 200; n++) v.tick(B / 1000, 1, true, true);
  const held2 = v.inside.level;
  for (let n = 0; n < 200; n++) v.tick(B / 1000, 1, true, false);
  ok(held2 === 1 && v.inside.level === 0, 'AutoViews reicht light an die Regel des Cockpits weiter');
  console.log('18. Leichteres Bild: Es wird gespart, aber nichts zurückgeholt und keine Probe bestätigt');
}

// 19. Die Zahlen der Regel (Kopf von autoquality.js)
{
  const want = { frames: 40, slow: 1 / 45, smooth: 1 / 57, spare: 1 / 75, minPR: 0.55, down: 0.12, up: 0.06, settle: 1, start: 3, retry: 30, retryMax: 300, held: 20 };
  const diff = Object.keys({ ...want, ...AUTO }).filter((k) => want[k] !== AUTO[k]);
  ok(diff.length === 0 && AUTO_MIRROR.join() === '1,2,3', `AUTO: ${diff.length ? 'anders als beschrieben: ' + diff.join(', ') : '40 Bilder, 45/57/75 je Sekunde, 0,55 bis Start in Schritten 0,12 hinab und 0,06 hinauf, Ruhe 1 s und 3 s, Versuche nach 30 bis 300 s, gehalten nach 20 s'}`);
  // „gehalten“ nach 20 s: Scheitert Stufe 0 erst 25 s nach der Probe, beginnt die Wartezeit wieder bei 30 s
  const q = waiting();
  q.retry = 4 * AUTO.retry;
  measure(q, frames(40, 1000 / 60));
  for (let n = 0; n < 25; n++) measure(q, frames(40, 1000 / 60));
  const mid = { held: q.held, retry: q.retry };
  for (let n = 0; n < 12; n++) measure(q, frames(40, 1000 / 60));
  ok(mid.held > 15 && mid.held < 20 && mid.retry === 4 * AUTO.retry && q.held === -1 && q.retry === AUTO.retry, `ein Schritt gilt nach ${AUTO.held} s als gehalten (nach ${mid.held.toFixed(1)} s noch nicht)`);
  console.log('19. Die Zahlen der Regel stehen, wie der Kopf sie nennt');
}

// 20. main.js setzt die Regel um
{
  const main = mainSource();
  ok(main.includes('const auto = new AutoViews(quality.pr);') && /auto\.reset\(quality\.pr\);\s*pixelRatio = quality\.pr;/.test(main), 'main.js: Start und neue Einstellung (Stand und Schärfe von vorn)');
  ok(/function adaptResolution\(dt\) \{\s*(\/\/[^\n]*\n\s*)*if \(!quality\.auto \|\| state === 'loading' \|\| paused\) return;/.test(main), 'main.js: gemessen wird nur in „Auto“, nicht beim Laden, nicht in der Pause');
  ok(main.includes("const light = shownInside && (state !== 'drive' || ui.facecamAway);") && main.includes('if (!auto.tick(dt, Math.min(window.devicePixelRatio || 1, 1.5), shownInside, light)) return;'), 'main.js: tick in jedem Bild mit der gezeigten Ansicht; Cockpit ohne Facecam zählt als leichter');
  ok(/if \(auto\.pixelRatio !== pixelRatio\) \{\s*pixelRatio = auto\.pixelRatio;\s*onResize\(\);/.test(main), 'main.js: neue Schärfe über onResize');
  ok(main.includes('const mirrorEvery = () => (quality.auto ? AUTO_MIRROR[auto.level] : quality.mirrorEvery);') && main.includes("const sideOn = () => settings.quality !== 'niedrig' && !(quality.auto && auto.level >= 2);"), 'main.js: Rückspiegel-Takt und Seitenfenster folgen in „Auto“ der Stufe des Cockpits, sonst der Einstellung');
  ok(/if \(render\) renderFrame\(\(shownInside = cockpitOn\)\);/.test(main), 'main.js: shownInside ist das gezeichnete Bild');
  // erst die Regel (sie misst das Bild davor und legt bei neuer Schärfe die Zeichenfläche neu an, die dann leer ist),
  // dann zeichnen: umgekehrt bliebe der Schirm bei jedem Schritt der Schärfe ein Bild lang schwarz
  ok(/if \(drawn && !mapOpen\) adaptResolution\(dt\);\s*step\(dt, \{ render: !mapOpen \}\);\s*drawn = !mapOpen;\s*\}/.test(main) && (main.match(/adaptResolution\(/g) || []).length === 2, 'main.js: die Regel läuft vor dem Zeichnen und misst nur ein gezeichnetes Bild (nie die große Karte)');
  // Die beiden Funktionen wörtlich (ohne Kommentare): Was hier dazukäme – eine weitere Bedingung, eine andere Grenze
  // für dt, ein zweiter Ort für onResize –, änderte die Regel, ohne dass eine der Prüfungen oben es sähe
  const body = (name) => {
    const m = new RegExp(`\\nfunction ${name}\\([^)]*\\) \\{\\n([\\s\\S]*?)\\n\\}\\n`).exec(main);
    return m ? m[1].replace(/\/\/[^\n]*/g, '').replace(/\s+/g, ' ').trim() : '';
  };
  ok(
    body('adaptResolution') ===
      "if (!quality.auto || state === 'loading' || paused) return; const light = shownInside && (state !== 'drive' || ui.facecamAway); if (!auto.tick(dt, Math.min(window.devicePixelRatio || 1, 1.5), shownInside, light)) return; if (auto.pixelRatio !== pixelRatio) { pixelRatio = auto.pixelRatio; onResize(); }",
    'main.js: adaptResolution tut genau das und nichts sonst',
  );
  ok(
    body('frame') ===
      "requestAnimationFrame(frame); let dt = (now - last) / 1000; last = now; if (DEBUG && window.__MA && window.__MA.frozen) return; if (!(dt > 0)) dt = 1 / 60; dt = Math.min(dt, 1 / 20); const mapOpen = menus.current === 'karte'; if (drawn && !mapOpen) adaptResolution(dt); step(dt, { render: !mapOpen }); drawn = !mapOpen;",
    'main.js: frame zählt ein Bild höchstens als 1/20 s und ruft die Regel vor dem Zeichnen',
  );
  // das erste Bild der Sitzung hat keines vor sich, das zu messen wäre
  ok(/\nlet drawn = false;/.test(main), 'main.js: vor dem ersten Bild ist nichts gezeichnet');
  // was die Prüfungen im Browser fragen (?debug): den Stand der gezeigten Ansicht
  ok(
    main.includes('const q = auto.now;\n      return { inside: q === auto.inside, level: auto.level, mirrorEvery: mirrorEvery(), side: sideOn(), pixelRatio, trial: !!q.trial, wait: Math.max(0, q.wait) };'),
    'main.js: __MA.autoQuality nennt den Stand der gezeigten Ansicht',
  );
  console.log('20. main.js setzt Stufe und Schärfe um');
}

// 21. Wann ein Cockpit-Bild als leichter zählt: facecamAway aus dem echten ui.js (placeFacecam, facecamTarget) an einem
//     nachgestellten HUD. main.js macht daraus light (Prüfstand 20)
{
  globalThis.window = { innerWidth: 1920, innerHeight: 1080 };
  globalThis.document = { querySelectorAll: () => [] };
  const { UI } = await import('../src/ui/ui.js');
  // ein HUD-Element auf dem Platz der Facecam (unten links), sichtbar oder nicht
  const part = (shown) => ({ classList: { contains: (c) => c === 'hidden' && !shown }, getBoundingClientRect: () => ({ left: 14, top: 800, right: 380, bottom: 1066, width: 366, height: 266 }) });
  const hud = ({ facecamOn = true, hint = false, half = null, hudHidden = false } = {}) => ({
    fc: { x: 0, y: 0, w: 0, h: 0, alpha: 0, target: null, check: 0 },
    fcBox: null,
    facecamAway: false,
    facecamOn,
    hud: { classList: { contains: (c) => c === 'hidden' && hudHidden }, style: { display: '' } },
    facecamEl: { style: {} },
    rahmenList: half ? [{ el: { querySelector: (sel) => (sel === '.half-' + half ? {} : null), classList: { contains: () => false } } }] : [],
    infoEl: { getBoundingClientRect: () => ({ left: 14, width: 320, bottom: 180 }) },
    hintEl: part(hint),
    photoEl: part(false),
    subEl: { parentNode: { children: [] } },
    rahmenEl: { querySelectorAll: () => [] },
    facecamTarget: UI.prototype.facecamTarget,
  });
  /** Eine Sekunde mit diesem HUD (want: Cockpit in der Fahrt): Wird die Facecam am Ende gezeichnet, und fehlt sie? */
  const after = (u, want = true) => {
    let box = null;
    for (let i = 0; i < 60; i++) box = UI.prototype.placeFacecam.call(u, 1 / 60, want);
    return `${box !== null ? 'gezeichnet' : 'nicht gezeichnet'}, ${u.facecamAway ? 'fehlt' : 'fehlt nicht'}`;
  };
  const cases = [
    ['alles frei', hud(), true, 'gezeichnet, fehlt nicht'],
    ['ein Hinweis liegt auf ihrem Platz', hud({ hint: true }), true, 'nicht gezeichnet, fehlt'],
    ['linke Bildhälfte abgedeckt', hud({ half: 'left' }), true, 'nicht gezeichnet, fehlt'],
    ['rechte Bildhälfte abgedeckt', hud({ half: 'right' }), true, 'gezeichnet, fehlt nicht'],
    ['HUD aus', hud({ hudHidden: true }), true, 'nicht gezeichnet, fehlt'],
    ['Einstellung Facecam aus', hud({ facecamOn: false }), true, 'nicht gezeichnet, fehlt nicht'],
    ['Einstellung aus und HUD aus', hud({ facecamOn: false, hudHidden: true }), true, 'nicht gezeichnet, fehlt nicht'],
    ['andere Ansicht', hud(), false, 'nicht gezeichnet, fehlt nicht'],
    ['andere Ansicht, HUD aus', hud({ hudHidden: true }), false, 'nicht gezeichnet, fehlt nicht'],
  ];
  for (const [name, u, want, expect] of cases) {
    const got = after(u, want);
    ok(got === expect, `Facecam, ${name}: ${got}`);
  }
  // der Rahmen „Bildhälfte abdecken“ kommt mitten in der Fahrt: Sie zählt als fehlend, sobald er bemerkt ist (die Lage
  // wird zehnmal je Sekunde neu bestimmt), und ist danach wieder da
  const u = hud();
  after(u);
  u.rahmenList = hud({ half: 'left' }).rahmenList;
  let away = 0;
  for (let i = 0; i < 210; i++) {
    UI.prototype.placeFacecam.call(u, 1 / 60, true);
    if (u.facecamAway) away++;
  }
  ok(away >= 203 && away <= 210, `linke Bildhälfte 3,5 s abgedeckt: ${away} von 210 Bildern zählen als leichter`);
  u.rahmenList = [];
  ok(after(u) === 'gezeichnet, fehlt nicht', 'danach ist die Facecam wieder da');
  // kein Platz im Fenster (480 × 270): Dann gibt es sie nie, und das Bild ohne sie ist das volle – auch unter der
  // abgedeckten Bildhälfte
  Object.assign(globalThis.window, { innerWidth: 480, innerHeight: 270 });
  for (const [name, v] of [['kleines Fenster', hud()], ['kleines Fenster, linke Bildhälfte abgedeckt', hud({ half: 'left' })]]) {
    const got = after(v);
    ok(got === 'nicht gezeichnet, fehlt nicht', `Facecam, ${name}: ${got}`);
  }
  console.log('21. Facecam fehlt (leichteres Bild): wenn sie Platz hätte und das HUD aus ist oder etwas auf ihrem Platz liegt');
}

// 22. Die erste Fahrt: Das Cockpit hat noch nichts gemessen und beginnt mit dem, was der Titel schon gelernt hat
{
  // 12 s Titel, Startszene (6 s von außen, 1,5 s im Cockpit ohne Facecam), dann die Fahrt
  const T = { cut: 18, drive: 19.5 };
  const view = (t) => (t < T.cut ? OUTSIDE : t < T.drive ? { inside: true, light: true } : INSIDE);
  /** Titel und Startszene, dann zwei Minuten Fahrt: Schritte des Cockpits und seine Zeit unter 45 Bildern je Sekunde. */
  const session = (v, cost) => {
    const a = runViews(v, { seconds: T.drive, cost, view });
    const b = runViews(v, { seconds: 120, cost, view, t0: a.t });
    return { steps: [...a.steps, ...b.steps].filter((st) => st.inside), slow: b.time.slowIn, t: b.t };
  };
  const seq = (steps) => steps.map((st) => `${st.level}/${st.pr.toFixed(2)}`).join(' ');
  // ein langsames Gerät: Von außen reicht es erst mit Schärfe 0,64, mit Cockpit erst auf Stufe 2 mit 0,55
  const slow = (inside, l, pr) => 4 + 22 * pr * pr + (inside ? [8, 6, 5][l] : 1);
  const v = new AutoViews(1);
  const r = session(v, slow);
  ok(near(v.outside.pixelRatio, 0.64) && r.steps[0].level === 2 && near(r.steps[0].pr, 0.64) && r.steps[0].t - T.cut < 0.1, `langsames Gerät: Das Cockpit beginnt mit ${seq(r.steps.slice(0, 1))}, der Schärfe von außen auf der letzten Sparstufe`);
  ok(r.steps[1].level === 2 && near(r.steps[1].pr, 0.55) && r.steps[1].t - T.cut < 3, `der eigene Schritt folgt nach ${(r.steps[1].t - T.cut).toFixed(1)} s (1 s Ruhe, dann 40 Bilder)`);
  // Gegenprobe: ohne die Übernahme findet das Cockpit denselben Stand erst Schritt für Schritt
  const c = new AutoViews(1);
  c.inside.fresh = false;
  const rc = session(c, slow);
  ok(c.inside.level === 2 && near(c.inside.pixelRatio, 0.55) && v.inside.level === 2 && near(v.inside.pixelRatio, 0.55), 'beide enden auf Stufe 2 mit Schärfe 0,55');
  ok(r.slow < 7 && rc.slow > r.slow + 8, `Cockpit unter 45 Bildern je Sekunde in den ersten zwei Minuten: ${r.slow.toFixed(1)} s, ohne Übernahme ${rc.slow.toFixed(1)} s`);
  // von außen reicht es für alles: Dann gibt es nichts zu übernehmen, das Cockpit spart in seiner eigenen Reihenfolge,
  // und zwar gleich (die drei Sekunden Ruhe nach dem Start sind längst um, auch wenn es noch nie gezeigt wurde)
  const fine = (inside, l, pr) => 3 + 12 * pr * pr + (inside ? [9, 7.5, 6][l] : 1);
  const w = new AutoViews(1);
  const rw = session(w, fine);
  ok(w.outside.pixelRatio === 1 && seq(rw.steps.slice(0, 2)) === '1/1.00 2/1.00' && rw.steps[0].t - T.cut < 3, `von außen flüssig: Das Cockpit beginnt voll und spart selbst (${seq(rw.steps.slice(0, 4))}), erster Schritt nach ${(rw.steps[0].t - T.cut).toFixed(1)} s`);
  // zu vorsichtig übernommen (im Titel nur ein Ruckler, das Cockpit schafft alles): Es kommt ohne Wartezeit zurück
  const hitch = (inside, l, pr, t) => (!inside && t > 8 && t < 9.5 ? 45 : 12);
  const x = new AutoViews(1);
  const rx = session(x, hitch);
  ok(seq(rx.steps) === '2/0.88 2/0.94 2/1.00 1/1.00 0/1.00' && rx.steps[4].t - T.drive < 8, `Ruckler im Titel, Cockpit schafft alles: ${seq(rx.steps)}, voll ${(rx.steps[4].t - T.drive).toFixed(1)} s nach Beginn der Fahrt`);
  // später nicht mehr: Das Cockpit kennt seinen Stand, ein Ruckler in der Drohnenansicht ändert ihn nicht
  const late = (inside, l, pr, t) => (!inside && t > 150 && t < 153 ? 45 : 12);
  const y = new AutoViews(1);
  session(y, late);
  const drone = runViews(y, { seconds: 20, cost: late, view: () => OUTSIDE, t0: T.drive + 120 });
  const back = runViews(y, { seconds: 20, cost: late, view: () => INSIDE, t0: drone.t });
  ok(y.outside.pixelRatio < 1 && y.inside.level === 0 && y.inside.pixelRatio === 1 && back.steps.length === 0, `später: Drohne nach einem Ruckler bei ${y.outside.pixelRatio.toFixed(2)}, das Cockpit bleibt bei ${y.inside.level}/${y.inside.pixelRatio.toFixed(2)}`);
  // nur in diese Richtung: Kommt die neue Einstellung mitten in der Fahrt und muss das Cockpit danach an die Schärfe,
  // beginnt die Ansicht von außen trotzdem voll – sie zeichnet weniger, nicht mehr
  const z = new AutoViews(1);
  runViews(z, { seconds: 1, cost: slow, view: () => INSIDE });
  resetViews(z, 1);
  runViews(z, { seconds: 30, cost: slow, view: () => INSIDE, t0: 1 });
  const zin = `${z.inside.level}/${z.inside.pixelRatio.toFixed(2)}`;
  const zout = runViews(z, { seconds: 0.5, cost: slow, view: () => OUTSIDE, t0: 31 });
  ok(zin === '2/0.55' && zout.steps.length === 0 && z.outside.level === 0 && z.outside.pixelRatio === 1, `neue Einstellung in der Fahrt, Cockpit bei ${zin}: von außen beginnt das Bild mit Schärfe ${z.outside.pixelRatio.toFixed(2)}`);
  // und nur hinab: Hat das Bild von außen Luft für mehr Schärfe als beim Start (120 Hz, Punktdichte 1,5), beginnt das
  // Cockpit trotzdem mit dem Startwert und ohne Sparstufe
  const hi = new AutoViews(1.25);
  runViews(hi, { hz: 120, seconds: 60, cost: () => 5, view: () => OUTSIDE, maxPR: 1.5 });
  const first = runViews(hi, { hz: 120, seconds: 0.5, cost: () => 5, view: () => INSIDE, maxPR: 1.5, t0: 60 });
  ok(hi.outside.pixelRatio === 1.5 && first.steps.length === 0 && hi.inside.level === 0 && hi.inside.pixelRatio === 1.25, `von außen schärfer als beim Start (${hi.outside.pixelRatio}): Das Cockpit beginnt mit ${hi.inside.level}/${hi.inside.pixelRatio.toFixed(2)}`);
  // neue Einstellung im Titel: wieder von vorn, also auch wieder mit Übernahme
  runViews(v, { seconds: 1, cost: slow, view: () => OUTSIDE, t0: r.t });
  resetViews(v, 1);
  runViews(v, { seconds: 12, cost: slow, view: () => OUTSIDE, t0: r.t + 1 });
  const again = runViews(v, { seconds: 0.5, cost: slow, view: () => INSIDE, t0: r.t + 13 });
  ok(near(v.outside.pixelRatio, 0.64) && again.steps.length === 1 && v.inside.level === 2 && near(v.inside.pixelRatio, 0.64), `nach einer neuen Einstellung im Titel: Das Cockpit beginnt wieder mit ${seq(again.steps)}`);
  console.log(`22. Erste Fahrt auf einem langsamen Gerät: Das Cockpit beginnt mit ${seq(r.steps.slice(0, 1))} (${r.slow.toFixed(1)} s zu langsam in zwei Minuten, ohne Übernahme ${rc.slow.toFixed(1)} s)`);
}

// 23. Bildschirme über 75 Hz: Nach einem Ruckler kommt alles ohne Wartezeit zurück (wie früher) – bis eine Probe scheitert
{
  const seq = (steps) => steps.map((st) => `${st.level}/${st.pr.toFixed(2)}`).join(' ');
  // eine Minute ruhig, vier Sekunden Nachladen, wieder ruhig; 5 ms je Bild sind auf 144 Hz sicher Luft
  const cost = (l, pr, t) => (t >= 60 && t < 64 ? 45 : 5);
  const q = new AutoQuality(1);
  const r = run(q, { hz: 144, seconds: 120, cost });
  const full = r.steps[r.steps.length - 1];
  ok(seq(r.steps) === '1/1.00 2/1.00 1/1.00 0/1.00' && full.t - 64 < 6, `144 Hz: ${seq(r.steps)}, volle Qualität ${(full.t - 64).toFixed(1)} s nach dem Ruckler`);
  // derselbe Ruckler auf 60 Hz: Dort ist nie sicher Luft, also wartet der Weg hinauf wie gehabt
  const q60 = new AutoQuality(1);
  const r60 = run(q60, { hz: 60, seconds: 120, cost });
  const down = r60.steps.filter((st, i) => i === 0 || st.level > r60.steps[i - 1].level || st.pr < r60.steps[i - 1].pr).pop();
  const up = r60.steps[r60.steps.indexOf(down) + 1];
  ok(!!up && up.t - down.t > AUTO.retry && q60.level === 0 && q60.pixelRatio === 1, `60 Hz: erster Schritt hinauf ${up ? (up.t - down.t).toFixed(1) : '–'} s nach dem letzten hinab`);
  // am Limit: Stufe 0 schafft das Gerät nicht flüssig (20,8 ms je Bild), ab Stufe 1 hat es sicher Luft. Nach dem Ruckler
  // kommt genau ein Versuch ohne Wartezeit; er scheitert, und von da an wird gewartet wie überall
  const limit = (l, pr, t) => (t >= 60 && t < 62.5 ? 45 : l === 0 ? 16 : 5);
  const ql = new AutoQuality(1);
  const rl = run(ql, { hz: 144, seconds: 260, cost: limit });
  const tries = rl.steps.filter((st) => st.level === 0);
  const gaps = tries.slice(1).map((st, i) => Math.round(st.t - tries[i].t));
  ok(tries.length === 3 && tries[0].t - 62.5 < 4 && gaps[0] > AUTO.retry && gaps[0] < AUTO.retry + 5 && gaps[1] > 2 * AUTO.retry && gaps[1] < 2 * AUTO.retry + 5 && ql.level === 1, `am Limit auf 144 Hz: Versuch ${(tries[0].t - 62.5).toFixed(1)} s nach dem Ruckler, die nächsten nach ${gaps.join(' und ')} s`);
  // von außen gibt es keine Sparstufe: Dort kostet der Ruckler gleich Schärfe, und auch die kommt ohne Wartezeit zurück
  const qo = new AutoQuality(1, 1);
  const ro = run(qo, { hz: 144, seconds: 120, cost: (l, pr, t) => (t >= 60 && t < 62.5 ? 45 : 5) });
  const fullOut = ro.steps[ro.steps.length - 1];
  ok(seq(ro.steps) === '0/0.88 0/0.94 0/1.00' && fullOut.t - 62.5 < 5, `144 Hz von außen: ${seq(ro.steps)}, volle Schärfe ${(fullOut.t - 62.5).toFixed(1)} s nach dem Ruckler`);
  // „sicher Luft“ heißt hier wie bei der Schärfe über dem Startwert: im Mittel aller Bilder. 85 Hz mit zwei Rucklern
  // von 50 ms je Messung sind flüssig (ohne die beiden 85 je Sekunde), im Mittel aber nur 73: kein Versuch ohne Wartezeit
  const q85 = new AutoQuality(1);
  measure(q85, frames(AUTO.frames, 30));
  const stepped85 = measure(q85, frames(40, 1000 / 85, 50, 50));
  ok(q85.quick && !stepped85 && q85.level === 1 && q85.trial === null, '85 Hz mit zwei Rucklern je Messung: flüssig, aber nicht sicher Luft, also kein Versuch vor Ablauf der Wartezeit');
  ok(measure(q85, frames(40, 1000 / 85)) && q85.level === 0 && q85.trial !== null, '85 Hz ohne Ruckler: sicher Luft, Stufe 0 gleich auf Probe');
  // reset nimmt beides zurück: den schnellen Weg und „schon gesehen“
  const q3 = new AutoQuality(1);
  measure(q3, frames(AUTO.frames, 30));
  const was = q3.quick && !q3.fresh;
  q3.reset(1);
  ok(was && !q3.quick && q3.fresh, 'reset: kein schneller Weg zurück mehr offen, noch kein Bild gesehen');
  console.log(`23. Über 75 Hz: nach einem Ruckler ${(full.t - 64).toFixed(1)} s bis zur vollen Qualität, auf 60 Hz ${up ? (r60.steps[r60.steps.length - 1].t - 64).toFixed(0) : '–'} s`);
}

// 24. Zufallsläufe über beide Ansichten: Nach jedem Bild stimmen die Bücher, und aus jedem Stand, der dabei entsteht,
//     führen flüssige volle Bilder ganz hinauf und zu langsame ganz hinab (kein Stand, in dem die Regel hängen bleibt)
{
  let seed = 12345;
  const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  const pick = (list) => list[Math.floor(rnd() * list.length)];
  const broken = new Map(); // was verletzt wurde -> wie oft
  const fail = (what) => broken.set(what, (broken.get(what) || 0) + 1);
  let ticks = 0;
  let maxUp = 0;
  let maxDown = 0;
  for (let n = 0; n < 500; n++) {
    const base = pick([1, 1, 1.1, 1.25, 0.8]);
    let maxPR = Math.min(pick([base, base, 1.5, 2, 1]), 1.5);
    const v = new AutoViews(base);
    let inside = false;
    let light = false;
    let mode = 0;
    const frameCount = 200 + Math.floor(rnd() * 6000);
    for (let i = 0; i < frameCount; i++) {
      if (rnd() < 0.004) inside = !inside;
      if (rnd() < 0.01) light = rnd() < 0.5;
      if (rnd() < 0.003) mode = Math.floor(rnd() * 5);
      if (rnd() < 0.0005) maxPR = pick([1, 1.25, 1.5, 0.8]);
      if (rnd() < 0.0003) v.reset(base);
      // Bilddauer: flüssig, 120 Hz, knapp, langsam, wild; ab und zu ein Ruckler; höchstens 1/20 s wie in main.js
      const dt = rnd() < 0.02 ? 0.05 : Math.min([1 / 60, 1 / 120, 1 / 50, 1 / 30, 1 / 60 + rnd() * 0.04][mode], 1 / 20);
      const q = inside ? v.inside : v.outside;
      const o = inside ? v.outside : v.inside;
      const was = { now: v.now, level: q.level, pr: q.pixelRatio, oLevel: o.level, oPr: o.pixelRatio, oTrial: o.trial, oHeld: o.held, oWait: o.wait, oRetry: o.retry };
      const told = v.tick(dt, maxPR, inside, inside && light);
      ticks++;
      if (o.level !== was.oLevel || o.pixelRatio !== was.oPr || o.trial !== was.oTrial || o.held !== was.oHeld || o.wait !== was.oWait || o.retry !== was.oRetry) fail('der Stand der nicht gezeigten Ansicht hat sich geändert');
      if (told !== (was.now !== v.now || q.level !== was.level || q.pixelRatio !== was.pr)) fail('tick meldet etwas anderes, als sich geändert hat');
      if (v.now !== q || v.pixelRatio !== q.pixelRatio || v.level !== v.inside.level) fail('gezeigt wird nicht der Stand der Ansicht');
      for (const s of [v.inside, v.outside]) {
        if (!Number.isInteger(s.level) || s.level < 0 || s.level > s.levels - 1) fail('Stufe außerhalb');
        if (!(s.pixelRatio >= Math.min(AUTO.minPR, base) - 1e-12 && s.pixelRatio <= Math.max(base, 1.5) + 1e-12)) fail('Schärfe außerhalb');
        if (s.trial && !(s.trial.level >= s.level && s.trial.pixelRatio <= s.pixelRatio && (s.trial.level > s.level || s.trial.pixelRatio < s.pixelRatio))) fail('eine Probe merkt sich keinen sparsameren Stand');
        if (!(s.held === -1 || (s.held >= 0 && s.held < AUTO.held))) fail('gehaltene Zeit außerhalb');
        if (s.trial && s.held < 0) fail('offene Probe ohne gehaltene Zeit');
        if (![30, 60, 120, 240, 300].includes(s.retry)) fail('Wartezeit nach dem nächsten Fehlschlag außerhalb');
        if (!(s.wait <= AUTO.retryMax)) fail('Wartezeit außerhalb');
        if (!(s.settle <= AUTO.start)) fail('Ruhezeit außerhalb');
        if (!(s.n >= 0 && s.n < AUTO.frames)) fail('Zahl der Bilder in der Messung außerhalb');
      }
      if (v.outside.level !== 0) fail('von außen gibt es keine Sparstufe');
    }
    // kommt immer an (maxPR = base, damit „oben“ eindeutig ist)
    for (const side of [true, false]) {
      const s = side ? v.inside : v.outside;
      let t = 0;
      for (; t < 400 && !(s.level === 0 && s.pixelRatio >= base && !s.trial); t += 1 / 60) v.tick(1 / 60, base, side, false);
      if (!(s.level === 0 && s.pixelRatio >= base && !s.trial)) fail('nach 400 s flüssiger voller Bilder nicht oben');
      maxUp = Math.max(maxUp, t);
    }
    for (const side of [true, false]) {
      const s = side ? v.inside : v.outside;
      let t = 0;
      for (; t < 60 && !(s.level === s.levels - 1 && s.pixelRatio <= AUTO.minPR + 1e-12); t += 1 / 30) v.tick(1 / 30, base, side, false);
      if (!(s.level === s.levels - 1 && s.pixelRatio <= AUTO.minPR + 1e-12)) fail('nach 60 s zu langsamer Bilder nicht unten');
      maxDown = Math.max(maxDown, t);
    }
  }
  ok(broken.size === 0, `Zufallsläufe: ${broken.size ? [...broken].map(([what, k]) => `${what} (${k}×)`).join('; ') : `${ticks} Bilder, nichts verletzt`}`);
  // (hinauf wartet schlimmstenfalls die längste Wartezeit ab, 5 Minuten, und geht dann die Schritte; hinab sind es
  // höchstens sechs Schritte von je einer Sekunde Ruhe und 40 Bildern)
  ok(maxUp < AUTO.retryMax + 40 && maxDown < 25, `aus jedem Stand: ganz hinauf in höchstens ${maxUp.toFixed(0)} s, ganz hinab in höchstens ${maxDown.toFixed(1)} s`);
  console.log(`24. Zufallsläufe: ${ticks} Bilder in 500 Läufen, kein Stand, in dem die Regel hängen bleibt (hinauf höchstens ${maxUp.toFixed(0)} s, hinab ${maxDown.toFixed(1)} s)`);
}

// Die Läufe über beide Ansichten haben jedes Bild in der Schärfe gezeichnet, die tick gemeldet hat – so erfährt auch
// main.js davon. Bliebe eine Änderung ungemeldet, stünde das Spiel weiter in der alten Schärfe da
ok(unreported === 0, `jede neue Schärfe hat tick gemeldet (${unreported} Bilder in einer anderen als der der Regel)`);

console.log(`${checks} Prüfungen, ${fails} Fehler`);
if (fails) process.exit(1);
