// Verkehr wie im echten Leben (Testlauf des Besitzers): Rücklichter und Bremslichter.
// - Rücklicht immer an, bei Regen und trübem Himmel kräftiger; das Bremslicht deutlich heller (LIGHTS).
// - Bremslicht (brakeLight, BRAKE): an bei spürbarem Verzögern, vor Kurven und im Stand; es flackert nicht im
//   Kolonnenverkehr (Haltezeit, Abstand zwischen An- und Aus-Schwelle) und geht aus, wenn der Wagen wieder Gas gibt.
//   node tools/verkehr-test.mjs
import { LIGHTS } from '../src/models/vehicles.js';
import { BRAKE, brakeLight } from '../src/world/traffic.js';

let fails = 0;
let checks = 0;
function ok(cond, msg) {
  checks++;
  if (!cond) {
    fails++;
    console.error('FEHLER: ' + msg);
  }
}

// --- Rücklichter ----------------------------------------------------------------------------------------------
ok(LIGHTS.tail[0] >= 0.25, `Rücklicht am Tag ${LIGHTS.tail[0]}: zu schwach, um es zu sehen`);
ok(LIGHTS.tail[1] > LIGHTS.tail[0], 'Rücklicht bei Regen nicht kräftiger als am Tag');
ok(LIGHTS.brake >= 1.6 * LIGHTS.tail[1], `Bremslicht ${LIGHTS.brake} kaum heller als das Rücklicht bei Regen ${LIGHTS.tail[1]}`);
ok(LIGHTS.brake <= 1, `Bremslicht ${LIGHTS.brake}: kippt im Tonemapping nach Orange (sähe aus wie ein Blinker)`);

// --- Bremslicht -----------------------------------------------------------------------------------------------
const dt = 1 / 60;
/** Bremslicht über eine Folge von Beschleunigungen (je Bild) bei Tempo v: Anzahl der Wechsel, Anteil an, Verlauf. */
function run(accs, v = 30, curve = () => false) {
  const c = { speed: v, brakeT: 0 };
  let on = false;
  let flips = 0;
  let lit = 0;
  const seq = [];
  accs.forEach((a, i) => {
    const b = brakeLight(c, a, dt, curve(i));
    if (b !== on) flips++;
    on = b;
    if (b) lit++;
    seq.push(b);
  });
  return { flips, lit: lit / accs.length, seq };
}
const frames = (sec, f) => Array.from({ length: Math.round(sec * 60) }, (_, i) => f(i * dt));
// Kolonne: der Abstandsregler zupft um −0,9 m/s² herum (±0,5, sechsmal je Sekunde): früher flackerte es mit jedem Zupfen
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const jitter = frames(20, (t) => -0.9 + 0.5 * Math.sin(t * 6 * Math.PI * 2) + (rnd() - 0.5) * 0.2);
const J = run(jitter);
ok(J.flips <= 2, `Kolonne: Bremslicht wechselt ${J.flips}× in 20 s (flackert)`);
// gleichmäßiges Rollen und Gasgeben: aus
const cruise = run(frames(10, () => 0.3));
ok(cruise.lit === 0, 'Gas geben: Bremslicht an');
// leichtes Lupfen (Fahrtwind, −0,5 m/s²): kein Bremslicht
ok(run(frames(5, () => -0.5)).lit === 0, 'Lupfen mit −0,5 m/s²: Bremslicht an');
// Bremsen: sofort an, bleibt an, solange er bremst; geht nach dem Bremsen höchstens hold + 1 Bild später aus
const brake = run([...frames(1, () => 0.2), ...frames(2, () => -3), ...frames(3, () => 0.5)]);
const firstOn = brake.seq.indexOf(true);
const lastOn = brake.seq.lastIndexOf(true);
ok(firstOn === 60, `Bremsen ab Bild 60, Bremslicht ab Bild ${firstOn}`);
ok(brake.seq.slice(60, 180).every(Boolean), 'Bremslicht geht beim Bremsen aus');
ok(lastOn >= 180 && (lastOn - 179) * dt <= BRAKE.hold + dt + 1e-9, `Bremslicht leuchtet nach dem Bremsen noch ${((lastOn - 179) * dt).toFixed(2)} s (Haltezeit ${BRAKE.hold} s)`);
// im Stand an; vor einer Kurve (sanftes Abbremsen) an
ok(run(frames(2, () => 0), 1).lit === 1, 'im Stand: kein Bremslicht');
ok(run(frames(2, () => -0.4), 30, () => true).lit === 1, 'vor der Kurve: kein Bremslicht');
ok(BRAKE.off > BRAKE.on, 'Bremslicht: Aus-Schwelle muss über der An-Schwelle liegen');

console.log(`Verkehr: Rücklicht ${LIGHTS.tail.join(' … ')}, Bremslicht ${LIGHTS.brake}; Bremslicht in der Kolonne ${J.flips} Wechsel in 20 s (${(J.lit * 100).toFixed(0)} % an)`);
console.log(fails ? `${fails} FEHLER (${checks} Prüfungen)` : `verkehr-test: alles grün (${checks} Prüfungen)`);
process.exit(fails ? 1 : 0);
