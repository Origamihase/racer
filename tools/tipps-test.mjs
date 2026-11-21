// Prüft die Tipps der ersten Minuten ohne Browser (src/ui/first-tips.js): Jeder Tipp kommt einmal je Spieler, wenn er
// gebraucht wird – die Ausfahrt ab dem 1000-m-Schild, das Megafon hinter einem Langsameren (spätestens nach zwei
// Minuten), der Ladestopp, sobald er sich einplanen lässt, die Kamera nach den ersten Sekunden –, nie zwei auf einmal,
// nie während eines Halts oder solange „So steuerst du“ den Platz hat; Enter oder ✕ schaltet alle ab, auch für die
// nächsten Streams. Die Zeilen nennen je Gerät die richtige Taste.
// node tools/tipps-test.mjs
import { FirstTips, TIPS, ORDER, KAMERA_AFTER, MEGAFON, GAP, loadTips, storeTips } from '../src/ui/first-tips.js';

let fails = 0;
let checks = 0;
function ok(cond, msg) {
  checks++;
  if (cond) return;
  fails++;
  console.error('FEHLER: ' + msg);
}
const DT = 1 / 30;
const box = new Map();
globalThis.localStorage = { getItem: (k) => (box.has(k) ? box.get(k) : null), setItem: (k, v) => box.set(k, String(v)), removeItem: (k) => box.delete(k) };

/**
 * Fährt sec Sekunden; world(t) liefert den Anlass (exit, carAhead, stop, free). Ergebnis: die Tipps mit Beginn und Ende.
 */
function drive(tips, sec, world = () => ({}), t0 = 0) {
  const log = [];
  let t = t0;
  for (let i = 0; i < Math.round(sec / DT); i++) {
    t += DT;
    const w = { free: true, ...world(t) };
    const ev = tips.update(DT, { t, ...w });
    if (ev && ev.show) log.push({ id: ev.show, from: t, to: null });
    if (ev && ev.hide) log[log.length - 1].to = t;
  }
  return log;
}

// --- die ersten fünf Minuten eines neuen Spielers ------------------------------------------------------------------
{
  const tips = new FirstTips(loadTips());
  ok(!tips.done && tips.stored === '', 'Ein neuer Spieler hat schon Tipps gesehen');
  // ein Langsamerer voraus bei 45 s, das 1000-m-Schild einer Ausfahrt bei 70 s (zehn Sekunden lang), ab 200 s lässt
  // sich ein Ladestopp einplanen; bis 12 s steht „So steuerst du“
  const log = drive(tips, 300, (t) => ({ free: t > 12, carAhead: t > 45 && t < 47, exit: t > 70 && t < 80, stop: t > 200 }));
  const ids = log.map((x) => x.id);
  ok(JSON.stringify(ids) === JSON.stringify(['kamera', 'megafon', 'ausfahrt', 'ladestopp']), `Reihenfolge ${ids.join(', ')}`);
  const at = Object.fromEntries(log.map((x) => [x.id, x]));
  ok(at.kamera && at.kamera.from >= KAMERA_AFTER && at.kamera.from < KAMERA_AFTER + 0.1, `Kamera bei ${at.kamera && at.kamera.from.toFixed(2)} s`);
  ok(at.megafon && at.megafon.from > 45 && at.megafon.from < 46, `Megafon nicht hinter dem Langsameren (${at.megafon && at.megafon.from.toFixed(2)} s)`);
  ok(at.ausfahrt && at.ausfahrt.from > 70 && at.ausfahrt.from < 71, `Ausfahrt nicht am 1000-m-Schild (${at.ausfahrt && at.ausfahrt.from.toFixed(2)} s)`);
  ok(at.ladestopp && at.ladestopp.from > 200 && at.ladestopp.from < 206, `Ladestopp nicht, sobald er geht (${at.ladestopp && at.ladestopp.from.toFixed(2)} s)`);
  for (const x of log) ok(x.to !== null && Math.abs(x.to - x.from - TIPS[x.id].show) < 0.1, `${x.id} steht ${x.to && (x.to - x.from).toFixed(2)} s statt ${TIPS[x.id].show} s`);
  for (let i = 1; i < log.length; i++) ok(log[i].from >= log[i - 1].to + GAP - 0.05, `${log[i].id} kommt ${(log[i].from - log[i - 1].to).toFixed(2)} s nach ${log[i - 1].id}`);
  ok(tips.done, 'Nach allen Tipps ist noch einer offen');
  storeTips(tips);
  const again = new FirstTips(loadTips());
  ok(again.done && drive(again, 300, () => ({ exit: true, carAhead: true, stop: true })).length === 0, 'Im zweiten Stream kommt ein Tipp noch einmal');
}
// das Megafon ohne Anlass, nach MEGAFON[1] Sekunden; eine Ausfahrt hat Vorrang vor allem, was gerade auch fällig ist
{
  const tips = new FirstTips('kamera');
  const log = drive(tips, MEGAFON[1] + 1);
  ok(log.length === 1 && log[0].id === 'megafon' && log[0].from >= MEGAFON[1], `Megafon ohne Anlass: ${JSON.stringify(log)}`);
  const t2 = new FirstTips('');
  const l2 = drive(t2, 40, (t) => ({ exit: t > 30, carAhead: t > 30, stop: t > 30 }));
  ok(l2.length === 2 && l2[0].id === 'kamera' && l2[1].id === 'ausfahrt', `Vorrang der Ausfahrt: ${l2.map((x) => x.id).join(', ')}`);
}
// nicht während eines Halts: Ein Tipp, der steht, geht, sobald der Wagen zum Halt bremst; der nächste wartet
{
  const tips = new FirstTips('');
  const log = drive(tips, 60, (t) => ({ free: t < 22 || t > 40 }));
  ok(log[0].id === 'kamera' && log[0].to < 22.1, `Kamera bleibt im Halt stehen: ${JSON.stringify(log[0])}`);
  ok(log.length === 1, 'Während des Halts beginnt ein Tipp');
}
// befolgt: Wer die Kamera wechselt, während der Tipp steht, sieht ihn gleich darauf verschwinden
{
  const tips = new FirstTips('');
  drive(tips, KAMERA_AFTER + 1);
  ok(tips.cur === 'kamera', 'Kein Kamera-Tipp');
  tips.did('megafon');
  ok(tips.left > 5, 'Das Megafon beendet den Kamera-Tipp');
  tips.did('camera');
  ok(tips.left <= 1.2, 'Die Kamera beendet ihren Tipp nicht');
}
// Enter oder ✕: kein Tipp mehr, auch nicht im nächsten Stream; der stehende geht im nächsten Bild
{
  box.clear();
  const tips = new FirstTips(loadTips());
  drive(tips, KAMERA_AFTER + 1);
  tips.stop();
  storeTips(tips);
  const ev = tips.update(DT, { free: true, t: 30 });
  ok(ev && ev.hide && tips.done && tips.cur === null, 'Abgeschaltet: Der Tipp bleibt stehen');
  const next = new FirstTips(loadTips());
  ok(next.done && next.stored === 'aus' && drive(next, 300, () => ({ exit: true, stop: true })).length === 0, 'Abgeschaltet: Im nächsten Stream kommen wieder Tipps');
  // ein neuer Stream mitten im Tipp: restart räumt ihn
  const t3 = new FirstTips('');
  drive(t3, KAMERA_AFTER + 1);
  t3.restart();
  ok(t3.cur === null && drive(t3, GAP - 0.5).length === 0, 'Neuer Stream: Ein Tipp steht noch oder kommt ohne Pause');
  // was im Speicher steht und niemand kennt, zählt nicht
  ok(new FirstTips('kamera,quatsch').seen.size === 1, 'Unbekannte Tipps im Speicher zählen');
}
// gesperrter Speicher: nichts wirft, die Tipps gelten für diese Sitzung
{
  const keep = globalThis.localStorage;
  globalThis.localStorage = { getItem: () => { throw new Error('gesperrt'); }, setItem: () => { throw new Error('gesperrt'); } };
  let threw = false;
  try {
    const tips = new FirstTips(loadTips());
    drive(tips, 30);
    storeTips(tips);
  } catch (e) {
    threw = true;
  }
  ok(!threw, 'Gesperrter Speicher wirft');
  globalThis.localStorage = keep;
}
// die Zeilen: je Gerät die richtige Taste, kurz genug für die Karte am Rand
{
  // der Ladestopp liegt am Gamepad auf LB (vorher zeigte der Tipp dort die Taste L, die es am Pad nicht gibt)
  const KEYS = { kamera: { keyboard: 'V', touch: '🎥', gamepad: 'B' }, megafon: { keyboard: 'H', touch: '📢', gamepad: 'Y' }, ladestopp: { keyboard: 'L', gamepad: 'LB' } };
  for (const id of ORDER) {
    for (const device of ['keyboard', 'touch', 'gamepad']) {
      const rows = TIPS[id].rows(device);
      ok(rows.length > 0 && rows.every(([k, text]) => Array.isArray(k) && typeof text === 'string' && text.length > 8), `${id} (${device}): Zeilen fehlen`);
      const want = KEYS[id] && KEYS[id][device];
      if (want) ok(rows[0][0].includes(want), `${id} (${device}): Taste ${want} fehlt (${rows[0][0].join(' ')})`);
      const chars = TIPS[id].title.length + rows.reduce((n, [, text]) => n + text.length, 0);
      ok(chars <= 170, `${id} (${device}): ${chars} Zeichen sind zu viel für die Karte am Rand`);
    }
    ok(TIPS[id].show >= 6 && TIPS[id].show <= 12, `${id}: steht ${TIPS[id].show} s`);
  }
  const touchStop = TIPS.ladestopp.rows('touch')[0][1];
  ok(/Ladestopp einplanen/.test(touchStop), 'Ladestopp (Touch): nennt den Knopf nicht');
  ok(TIPS.ausfahrt.rows('keyboard').some(([, t]) => /rechts/.test(t)) && TIPS.ausfahrt.rows('keyboard').some(([, t]) => /Navi zeigt die Spur/.test(t)), 'Ausfahrt: rechts halten oder die Spur im Navi fehlt');
}

console.log(fails ? `tipps-test: ${fails} von ${checks} Prüfungen FEHLGESCHLAGEN` : `tipps-test: alles grün (${checks} Prüfungen: ${ORDER.length} Tipps je einmal, im richtigen Moment, abschaltbar)`);
process.exit(fails ? 1 : 0);
