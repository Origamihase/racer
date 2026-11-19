// Prüfstand der Wischer-Automatik (Paket B, für npm test): Schauer wie in game.js updateWeather (28–70 s, Ziel
// 0,6–1, +0,12/s, −0,15/s), dazwischen nur 15 s trocken (reicht zum Parken und Abtrocknen; im Spiel sind es
// Minuten), je Firmware-Stufe 0–3 mit festem Zufall. Geprüft wird, was der Auftrag
// zusagt: im Schauer stehen die Wischer und wischen nicht, Stufe 0 wischt nie, höhere Stufen nur ab und zu, nach dem
// Schauer parken sie und die Scheibe trocknet, Ereignisse kommen nie als Salve, trocken nur seltene Fehlalarme.
// Reines Node, ohne Browser.
//
//   node tools/wiper-test.mjs [--verbose] [Sekunden Regen je Stufe, Vorgabe 600]

// DOM-Attrappe: windshield.js legt beim Laden Leinwände an; hier wird nur der Automat gerechnet, nichts gezeichnet
const anyFn = () => new Proxy(function () {}, {
  get: (t, k) => (k === Symbol.toPrimitive ? () => 0 : k === 'data' ? new Uint8ClampedArray(4 * 256 * 160) : anyFn()),
  apply: () => anyFn(),
  set: () => true,
});
const canvas = () => ({ width: 0, height: 0, getContext: () => anyFn(), style: {}, toDataURL: () => '' });
globalThis.document = { createElement: () => canvas(), createElementNS: () => canvas() };
globalThis.window = globalThis;
globalThis.matchMedia = () => ({ matches: false });

const THREE = await import('three');
const { Windshield } = await import('../src/fx/windshield.js');

const VERBOSE = process.argv.includes('--verbose');
const SECONDS = +(process.argv.find((a) => /^\d+$/.test(a)) || 600);
const DT = 1 / 60;
const camera = new THREE.PerspectiveCamera(58, 16 / 9, 0.25, 3000);
const carMatrix = new THREE.Matrix4();
let checks = 0;
let failed = 0;
const check = (ok, text) => {
  checks++;
  if (!ok) failed++;
  if (!ok || VERBOSE) console.log(`${ok ? 'ok  ' : 'FAIL'} ${text}`);
};

// Ereignisse mitzählen: Anzahl je Art und kleinster Abstand zweier gleicher Ereignisse
function listen(ws, clock) {
  const ev = { count: {}, gap: {}, last: {} };
  ws.onEvent = (e) => {
    const t = clock();
    ev.count[e] = (ev.count[e] || 0) + 1;
    if (ev.last[e] !== undefined) ev.gap[e] = Math.min(ev.gap[e] ?? Infinity, t - ev.last[e]);
    ev.last[e] = t;
  };
  return ev;
}

function showers(fw, seed) {
  let rs = seed * 9301 + 49297;
  const rnd = () => ((rs = (rs * 9301 + 49297) % 233280) / 233280);
  const ws = new Windshield();
  ws.debugSeed(1000 + seed * 10 + fw);
  ws.setFirmware(fw);
  ws.setAuto(true);
  let t = 0;
  const ev = listen(ws, () => t);
  const r = { rain: 0, stand: 0, toStand: 0, toPark: 0, toDry: 0, bad: 0, ev };
  let level = 0;
  while (r.rain < SECONDS) {
    const target = 0.6 + 0.4 * rnd();
    let active = 28 + 42 * rnd();
    const start = t;
    let standAt = Infinity;
    let end = null;
    let parkAt = Infinity;
    let dryAt = Infinity;
    for (;;) {
      t += DT;
      active -= DT;
      const goal = active > 0 ? target : 0;
      const rate = goal > level ? 0.12 : 0.15;
      level += Math.max(-rate * DT, Math.min(rate * DT, goal - level));
      ws.setRain(level);
      ws.update(DT, { speed: 30, camera, carMatrix });
      const [a0, a1] = ws.angles;
      if (!Number.isFinite(a0) || !Number.isFinite(a1)) r.bad++;
      if (level > 0) {
        r.rain += DT;
        if (ws.mode === 'stand') r.stand += DT;
      }
      if (standAt === Infinity && ws.mode === 'stand') standAt = t - start;
      if (end === null && active <= 0 && level === 0) end = t;
      if (end !== null && parkAt === Infinity && ws.mode === 'park') parkAt = t - end;
      if (end !== null && dryAt === Infinity && ws.wet === 0 && ws.drops.length === 0) dryAt = t - end;
      if (end !== null && t - end > 15) break;
    }
    r.toStand = Math.max(r.toStand, standAt);
    r.toPark = Math.max(r.toPark, parkAt);
    r.toDry = Math.max(r.toDry, dryAt);
  }
  r.wipes = ws.wipes;
  return r;
}

const wipes = [];
for (const fw of [0, 1, 2, 3]) {
  const r = showers(fw, 1);
  const share = r.stand / r.rain;
  const c = r.ev.count;
  const g = r.ev.gap;
  wipes.push(r.wipes);
  if (VERBOSE) {
    console.log(`Firmware ${fw}: Regen ${r.rain.toFixed(0)} s, stehen ${(100 * share).toFixed(1)} %, Wische ${r.wipes}, `
      + `Stand nach ${r.toStand.toFixed(2)} s, Park nach ${r.toPark.toFixed(2)} s, trocken nach ${r.toDry.toFixed(2)} s, `
      + `Ereignisse ${JSON.stringify(c)}`);
  }
  check(r.bad === 0, `Firmware ${fw}: Armwinkel immer endlich`);
  check(share >= (fw === 0 ? 0.9 : 0.8), `Firmware ${fw}: im Schauer stehen die Wischer (${(100 * share).toFixed(1)} %)`);
  if (fw === 0) check(r.wipes === 0 && !c.wipe, 'Firmware 0: kein einziger ganzer Wisch');
  else check(r.wipes >= 1 && r.wipes === (c.wipe || 0), `Firmware ${fw}: ab und zu ein ganzer Wisch (${r.wipes})`);
  check(r.toStand <= 5, `Firmware ${fw}: stehen spätestens 5 s nach Regenbeginn (${r.toStand.toFixed(2)} s)`);
  check(r.toPark <= 4.5, `Firmware ${fw}: geparkt spätestens 4,5 s nach Regenende (${r.toPark.toFixed(2)} s)`);
  check(r.toDry <= 8, `Firmware ${fw}: Scheibe spätestens 8 s nach Regenende trocken (${r.toDry.toFixed(2)} s)`);
  check((g.twitch ?? Infinity) >= 2.5, `Firmware ${fw}: 'twitch' höchstens alle 2,5 s (${g.twitch?.toFixed(2)} s)`);
  check((g.jerk ?? Infinity) >= 0.85, `Firmware ${fw}: 'jerk' höchstens alle 0,85 s (${g.jerk?.toFixed(2)} s)`);
}
check(wipes[3] > wipes[1], `höhere Firmware wischt öfter (Stufe 1: ${wipes[1]}, Stufe 3: ${wipes[3]})`);

// Taste E bei Firmware 0: nie ein ganzer Wisch, nur ein Zucken (oder nichts, solange der Wischer schon unterwegs ist)
{
  const ws = new Windshield();
  ws.debugSeed(7);
  ws.setFirmware(0);
  ws.setAuto(true);
  ws.setRain(1);
  const seen = new Set();
  for (let i = 0; i < 60; i++) {
    seen.add(ws.manual());
    for (let k = 0; k < 90; k++) ws.update(DT, { speed: 30, camera, carMatrix });
  }
  check(!seen.has('wipe') && [...seen].every((v) => v === 'twitch' || v === null),
    `Taste E bei Firmware 0: nur 'twitch' oder null (${[...seen].join(', ')})`);
}

// trocken: nur seltene, kurze Fehlalarme (etwa einer je ein bis zwei Minuten)
{
  const ws = new Windshield();
  ws.debugSeed(11);
  ws.setFirmware(0);
  ws.setAuto(true);
  ws.setRain(0);
  let t = 0;
  const ev = listen(ws, () => t);
  let up = 0;
  for (; t < 600; t += DT) {
    ws.update(DT, { speed: 30, camera, carMatrix });
    if (ws.mode !== 'park') up += DT;
  }
  const n = ev.count.phantom || 0;
  check(n >= 2 && n <= 15, `trocken: ${n} Fehlalarme in 600 s`);
  check(up / 600 < 0.1, `trocken: Wischer ${(100 * up / 600).toFixed(1)} % der Zeit unterwegs`);
  check(!ev.count.wipe && !ev.count.twitch, 'trocken: kein Wisch und kein Zucken außer Fehlalarmen');
}

console.log(`wiper-test: ${checks - failed}/${checks} Prüfungen bestanden`);
if (failed) process.exit(1);
