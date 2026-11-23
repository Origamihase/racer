// Orbit-Kamera der Drohne (src/camera/orbit.js) ohne Browser: Der Tesla steht (Abspann) oder rollt, Autos und Lkw
// überholen auf allen Spuren, einige wechseln die Spur. Geprüft je Saat über 3 Minuten:
// - der Zielpunkt bleibt über der eigenen Fahrbahn (xMin … xMax), nie höher als yMax und nie steiler als 30° auf den Wagen,
// - er steht nie in einem Fahrzeug (nach der Notbremse lift, wie placeDrone sie anwendet),
// - die Kamera dreht nie schneller als beim Ausweichen erlaubt (wEsc) und bleibt nicht ewig stehen,
// - ein Lkw verdeckt den Tesla (Blick von der Kamera auf die Wagenmitte) nur selten: Sie weicht ihnen aus.
// node tools/orbit-test.mjs
import { ROAD } from '../src/textures.js';
import { mulberry32 } from '../src/util.js';
import { ORBIT, createOrbitCam } from '../src/camera/orbit.js';

let fails = 0;
let checks = 0;
function ok(cond, msg) {
  checks++;
  if (cond) return;
  fails++;
  if (fails <= 20) console.error('FEHLER: ' + msg);
}

/** Geht die Strecke a→b durch den Quader [x0,x1]×[0,y1]×[z0,z1]? */
function through(a, b, x0, x1, y1, z0, z1) {
  let t0 = 0;
  let t1 = 1;
  for (const [o, d, mn, mx] of [[a.x, b.x - a.x, x0, x1], [a.y, b.y - a.y, 0, y1], [a.z, b.z - a.z, z0, z1]]) {
    if (Math.abs(d) < 1e-9) {
      if (o < mn || o > mx) return false;
      continue;
    }
    const ta = (mn - o) / d;
    const tb = (mx - o) / d;
    t0 = Math.max(t0, Math.min(ta, tb));
    t1 = Math.min(t1, Math.max(ta, tb));
  }
  return t0 <= t1;
}

const LANES = [0, 1, 2].map((i) => ROAD.laneCenter(i));
const DT = 1 / 30;

function run(seed, standing) {
  const rnd = mulberry32(seed);
  const p = { x: LANES[1 + Math.floor(rnd() * 2)], s: 0, speed: standing ? 0 : 18, len: 4.7, w: 1.9 };
  const cars = [];
  const traffic = { cars };
  const spawn = (s) => {
    const tall = rnd() < 0.3;
    const lane = Math.floor(rnd() * LANES.length);
    cars.push({
      s, x: LANES[lane], lane, w: tall ? 2.5 : 1.85, len: tall ? 12 + rnd() * 4 : 4.3, v: { height: tall ? 3.6 : 1.5 },
      speed: (tall ? 22 : 30) + rnd() * 8, change: null,
    });
  };
  for (let i = 0; i < 6; i++) spawn(p.s - 60 + rnd() * 160);
  const cam = createOrbitCam(traffic);
  let hidden = 0;
  let still = 0;
  let longestStill = 0;
  let prevA = null;
  const what = `Saat ${seed}${standing ? ', stehend' : ''}`;
  for (let i = 0; i < 180 / DT; i++) {
    const t = i * DT;
    const pos = cam.target(p, DT, t, i === 0).clone();
    cam.lift(pos, p);
    const where = `${what}, ${t.toFixed(1)} s`;
    ok(pos.x >= ORBIT.xMin - 1e-6 && pos.x <= ORBIT.xMax + 1e-6, `${where}: neben der Fahrbahn (x ${pos.x.toFixed(2)})`);
    ok(pos.y <= ORBIT.yMax + 1e-6, `${where}: zu hoch (${pos.y.toFixed(2)} m)`);
    ok(pos.y <= 0.9 + Math.hypot(pos.x - p.x, pos.z) * 0.58 + 1e-6, `${where}: steiler als 30° auf den Wagen`);
    const mid = { x: p.x, y: 0.9, z: 0 };
    if (cars.some((c) => c.v.height > 2 && through(pos, mid, c.x - c.w / 2, c.x + c.w / 2, c.v.height, p.s - c.s - c.len / 2, p.s - c.s + c.len / 2))) hidden += DT;
    for (const c of cars) {
      const inside = Math.abs(pos.x - c.x) < c.w / 2 && Math.abs(pos.z - (p.s - c.s)) < c.len / 2 && pos.y < c.v.height;
      ok(!inside, `${where}: Kamera steht in einem Fahrzeug (${c.v.height > 2 ? 'Lkw' : 'Auto'})`);
    }
    if (prevA !== null) {
      let d = cam.state.a - prevA;
      if (Math.abs(d) > Math.PI) d -= Math.sign(d) * 2 * Math.PI;
      ok(Math.abs(d) / DT <= ORBIT.wEsc + 1e-6, `${where}: dreht zu schnell (${(Math.abs(d) / DT).toFixed(2)} rad/s)`);
      still = Math.abs(d) < 1e-6 ? still + DT : 0;
      longestStill = Math.max(longestStill, still);
    }
    prevA = cam.state.a;
    // Verkehr: fahren, gelegentlich die Spur wechseln, hinten neue, vorne weg
    p.s += p.speed * DT;
    for (const c of cars) {
      c.s += c.speed * DT;
      if (c.change) {
        c.change.t += DT;
        const k = Math.min(1, Math.max(0, (c.change.t - c.change.delay) / c.change.dur));
        c.x = LANES[c.change.from] + (LANES[c.change.to] - LANES[c.change.from]) * k * k * (3 - 2 * k);
        if (k >= 1) {
          c.lane = c.change.to;
          c.change = null;
        }
      } else if (rnd() < DT / 20) {
        const to = c.lane + (c.lane === 0 ? 1 : c.lane === LANES.length - 1 ? -1 : rnd() < 0.5 ? -1 : 1);
        c.change = { from: c.lane, to, t: 0, delay: 0, dur: 3 };
      }
    }
    for (let k = cars.length - 1; k >= 0; k--) if (cars[k].s > p.s + 150) cars.splice(k, 1);
    while (cars.length < 6) spawn(p.s - 80 - rnd() * 40);
  }
  hiddenAll.push(hidden / 180);
  ok(longestStill < 60, `${what}: Kamera stand ${longestStill.toFixed(0)} s am Stück still`);
}

// Ohne Ausweichen (nur steigen) wären es im Mittel 7,8 % – mit 5,5 %; die Saaten stehen fest, also auch die Zahl.
const HIDDEN_MAX = 0.065;
const hiddenAll = [];
for (let seed = 1; seed <= 6; seed++) {
  run(seed, true);
  run(seed + 100, false);
}
const hiddenMean = hiddenAll.reduce((a, b) => a + b, 0) / hiddenAll.length;
ok(hiddenMean < HIDDEN_MAX, `Lkw verdecken den Tesla im Mittel ${(hiddenMean * 100).toFixed(1)} % der Zeit (erlaubt ${HIDDEN_MAX * 100} %)`);
console.log(`Orbit-Kamera: ${checks} Prüfungen, verdeckt ${hiddenAll.map((h) => (h * 100).toFixed(1)).join(' / ')} %`);
if (fails) {
  console.error(`${fails} Fehler`);
  process.exit(1);
}
console.log('alles in Ordnung');
