// Prüfstand Licht der Welt (src/world/light.js) und Wolkenschatten (src/curve.js): Das kräftige Schönwetterlicht macht das Bild nicht heller oder
// dunkler als das frühere, weiche (eine besonnte Wiese bekommt gleich viel Licht), es macht nur die Schatten tiefer
// und bläulich. Und im Regen ist alles, wie es war: Ab Bewölkung FAIR_END gilt Wert für Wert das frühere Licht.
import { LIGHT, FAIR_END, worldLight, linear } from '../src/world/light.js';
import { CLOUD, cloudField, cloudSunAt, setCloudShadows, cloudUniforms } from '../src/curve.js';
import { readFileSync } from 'node:fs';

let fails = 0;
let checks = 0;
const ok = (cond, msg) => {
  checks++;
  if (!cond) {
    fails++;
    console.log('  FEHLER: ' + msg);
  }
};
const lerp = (a, b, t) => a + (b - a) * t;
const Y = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b; // Helligkeit
const pct = (x) => `${(x * 100).toFixed(1)} %`;

// Höhe der Sonne: dieselbe Richtung wie in world/sky.js (dort gelesen, damit beide nicht auseinanderlaufen)
const sky = readFileSync(new URL('../src/world/sky.js', import.meta.url), 'utf8');
const m = /sunDirMap = new THREE\.Vector3\(([\d.]+), ([\d.]+), ([\d.]+)\)\.normalize\(\)/.exec(sky);
ok(!!m, 'world/sky.js: Richtung der Sonne gefunden');
const [sx, sy, sz] = m ? m.slice(1).map(Number) : [0.52, 0.6, 0.6];
const up = sy / Math.hypot(sx, sy, sz);
ok(/worldLight\(o, this\.light\)/.test(sky) && !/SUN_FAIR|HEMI_FAIR/.test(sky), 'world/sky.js nimmt das Licht aus worldLight');

// Licht auf einer waagrechten Fläche (three.js ohne Faktor π): in der Sonne und im Schatten
const lit = (L) => L.sunColor.map((c, i) => L.sun * c * up + L.hemi * L.sky[i]);
const shade = (L) => L.sky.map((c) => L.hemi * c);
// Licht auf einer senkrechten Wand, die von der Sonne weg zeigt: je zur Hälfte Himmel und Boden
const wall = (L) => L.sky.map((c, i) => L.hemi * 0.5 * (c + L.ground[i]));
// das frühere Gesetz: vom weichen Schönwetterlicht geradewegs zum Regen
const old = (o) => {
  const { soft: a, rain: b } = LIGHT;
  return { sun: lerp(a.sun, b.sun, o), hemi: lerp(a.hemi, b.hemi, o), sunColor: a.sunColor, sky: a.sky.map((c, i) => lerp(c, b.sky[i], o)), ground: a.ground };
};
const same = (A, B) => Math.abs(A.sun - B.sun) < 1e-12 && Math.abs(A.hemi - B.hemi) < 1e-12
  && ['sunColor', 'sky', 'ground'].every((k) => A[k].every((c, i) => Math.abs(c - B[k][i]) < 1e-12));

// 1. Das frühere Licht steht hier so, wie es im Spiel war
{
  const { soft, rain } = LIGHT;
  ok(soft.sun === 3.05 && soft.hemi === 2.05 && String(soft.sky) === '0.69,0.79,1' && same({ ...soft, sunColor: linear(0xfff0d9), ground: linear(0xc3cf9c) }, soft),
    'früheres Schönwetterlicht: Sonne 3,05 (fff0d9), Himmel 2,05 (0,69 0,79 1,0), Boden c3cf9c');
  ok(rain.sun === 0.36 && rain.hemi === 1.6 && String(rain.sky) === '0.6,0.66,0.74' && String(rain.sunColor) === String(soft.sunColor) && String(rain.ground) === String(soft.ground),
    'Regen: Sonne 0,36, Himmel 1,6 (0,6 0,66 0,74), Farben von Sonne und Boden wie früher');
}

// 2. Schönes Wetter: gleich hell in der Sonne, deutlich tiefere, blauere Schatten
{
  const neu = worldLight(0);
  const alt = old(0);
  ok(same(neu, LIGHT.fair), 'Bewölkung 0 ist das Schönwetterlicht');
  const k = Y(lit(neu)) / Y(lit(alt));
  ok(Math.abs(k - 1) < 0.02, `besonnte Wiese: ${pct(k)} der früheren Helligkeit (erlaubt ±2 %)`);
  const rNeu = Y(shade(neu)) / Y(lit(neu));
  const rAlt = Y(shade(alt)) / Y(lit(alt));
  ok(rNeu > 0.2 && rNeu < 0.3, `Schatten auf der Wiese: ${pct(rNeu)} des Lichts in der Sonne (früher ${pct(rAlt)}; gewollt 20 bis 30 %)`);
  ok(Math.abs(rAlt - 0.5) < 0.03, `früher war der Schatten halb so hell (${pct(rAlt)})`);
  const blue = (c) => c[2] / c[0];
  ok(blue(shade(neu)) > blue(shade(alt)) * 1.5, `der Schatten ist bläulicher (Blau zu Rot ${blue(shade(neu)).toFixed(2)}, früher ${blue(shade(alt)).toFixed(2)})`);
  ok(neu.sunColor[2] / neu.sunColor[0] < alt.sunColor[2] / alt.sunColor[0], 'die Sonne ist wärmer');
  const w = Y(wall(neu)) / Y(wall(alt));
  ok(w > 0.55 && w < 0.8, `Wand im Schatten: ${pct(w)} der früheren Helligkeit (nicht unter 55 %: Schattenseiten sollen nicht zulaufen)`);
  const mx = Math.max(...lit(neu)) / Math.max(...lit(alt));
  ok(mx < 1.25, `kein Farbkanal in der Sonne über dem 1,25-Fachen von früher (${mx.toFixed(2)}): helle Flächen brennen nicht aus`);
}

// 3. Regen wie früher: ab FAIR_END Wert für Wert das frühere Gesetz
{
  ok(FAIR_END > 0.3 && FAIR_END <= 0.55, `FAIR_END ${FAIR_END}: unter der Bewölkung eines Schauers (ab 0,57)`);
  let bad = 0;
  for (let o = FAIR_END; o <= 1 + 1e-9; o += 0.01) if (!same(worldLight(Math.min(1, o)), old(Math.min(1, o)))) bad++;
  ok(bad === 0, `Bewölkung ${FAIR_END} bis 1: das frühere Licht (${bad} Abweichungen)`);
  ok(same(worldLight(1), { ...LIGHT.rain }), 'Bewölkung 1 ist der Regen');
}

// 4. Dazwischen: stetig, die Sonne nimmt mit jeder Wolke ab, die besonnte Wiese wird nie heller als bei schönem Wetter
{
  let jump = 0;
  let up2 = 0;
  let bright = 0;
  let prev = worldLight(0);
  const y0 = Y(lit(prev));
  for (let i = 1; i <= 1000; i++) {
    const L = worldLight(i / 1000);
    if (Math.abs(L.sun - prev.sun) > 0.02 || Math.abs(L.hemi - prev.hemi) > 0.01 || L.sky.some((c, j) => Math.abs(c - prev.sky[j]) > 0.01)) jump++;
    if (L.sun > prev.sun) up2++;
    if (Y(lit(L)) > y0 + 1e-9) bright++;
    prev = L;
  }
  ok(jump === 0, `kein Sprung zwischen Bewölkung 0 und 1 (${jump})`);
  ok(up2 === 0, `die Sonne wird mit der Bewölkung nie stärker (${up2})`);
  ok(bright === 0, `die besonnte Wiese ist nie heller als bei schönem Wetter (${bright})`);
}

// 5. worldLight schreibt in das mitgegebene Ziel und legt je Aufruf nichts Neues an
{
  const out = worldLight(0);
  const refs = [out.sunColor, out.sky, out.ground];
  const r = worldLight(0.3, out);
  ok(r === out && refs[0] === out.sunColor && refs[1] === out.sky && refs[2] === out.ground, 'worldLight füllt das Ziel, ohne Felder zu ersetzen');
  ok(LIGHT.fair.sun === 4.88 && same(worldLight(0), LIGHT.fair), 'das Ziel eines früheren Aufrufs ändert die Tabelle nicht');
}

// 6. Wolkenschatten (src/curve.js): Die Kachel ist nahtlos, die Flecken liegen am Boden fest und ziehen nur mit dem
// Wind, und die Rechnung für Innenraum und Facecam (cloudSunAt) ist dieselbe wie im Shader
{
  const n = CLOUD.n;
  const f = cloudField();
  let cover = 0;
  let max = 0;
  let seam = 0;
  let step = 0;
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const v = f[j * n + i];
    if (v > 0) cover++;
    max = Math.max(max, v);
    const right = f[j * n + ((i + 1) % n)];
    const down = f[((j + 1) % n) * n + i];
    const d = Math.max(Math.abs(v - right), Math.abs(v - down));
    step = Math.max(step, d);
    if (i === n - 1 || j === n - 1) seam = Math.max(seam, d);
  }
  ok(f.length === n * n && max === 255, `Kachel ${n} × ${n}, dichteste Stelle 255 (${max})`);
  ok(cover / f.length > 0.3 && cover / f.length < 0.5, `${pct(cover / f.length)} der Fläche liegen unter einem Fleck (gewollt 30 bis 50 %)`);
  ok(step <= 80, `weiche Ränder: von Punkt zu Punkt (${(CLOUD.tile / n).toFixed(1)} m) höchstens ${step} von 255 (erlaubt 80)`);
  ok(seam <= step && seam > 0, `nahtlos: über den Rand der Kachel höchstens ${seam} von 255, nicht mehr als mitten in ihr`);

  // am Boden fest: Ein Punkt, der 300 m voraus liegt, hat nach 120 m Fahrt (dann 180 m voraus) denselben Schatten
  let drift = 0;
  let lo = 1;
  let hi = 0;
  for (let k = 0; k < 400; k++) {
    const x = (k * 37) % 400 - 200;
    const s = 1000 + k * 917.3;
    setCloudShadows(s, 50, 1);
    const a = cloudSunAt(x, -300);
    setCloudShadows(s + 120, 50, 1);
    drift = Math.max(drift, Math.abs(a - cloudSunAt(x, -180)));
    lo = Math.min(lo, a);
    hi = Math.max(hi, a);
  }
  ok(drift < 1e-6, `Flecken liegen am Boden fest (größte Abweichung nach 120 m Fahrt ${drift.toExponential(1)})`);
  ok(Math.abs(lo - (1 - CLOUD.strength)) < 0.01 && hi === 1, `Anteil der Sonne zwischen ${lo.toFixed(2)} und ${hi} (Stärke ${CLOUD.strength})`);
  // mit dem Wind: Nach t Sekunden liegt derselbe Schatten wind · t weiter
  setCloudShadows(5000, 0, 1);
  const before = [];
  for (let k = 0; k < 50; k++) before.push(cloudSunAt(k * 13 - 300, -k * 29));
  setCloudShadows(5000, 40, 1);
  let wind = 0;
  for (let k = 0; k < 50; k++) wind = Math.max(wind, Math.abs(before[k] - cloudSunAt(k * 13 - 300 - CLOUD.wind[0] * 40, -k * 29 - CLOUD.wind[1] * 40)));
  ok(wind < 1e-6, `Flecken ziehen mit dem Wind (${CLOUD.wind} m/s; Abweichung ${wind.toExponential(1)})`);
  // die Kachel liegt schräg: entlang der Straße wiederholt sich der Schatten nicht nach einer Kachellänge
  setCloudShadows(0, 0, 1);
  let rep = 0;
  for (let k = 0; k < 200; k++) rep = Math.max(rep, Math.abs(cloudSunAt(0, -k * 7) - cloudSunAt(0, -k * 7 - CLOUD.tile)));
  ok(rep > 0.2, `schräge Kachel: ${CLOUD.tile} m weiter liegt ein anderer Schatten (Unterschied bis ${rep.toFixed(2)})`);
  // aus: Stärke 0, überall volle Sonne; unter 0 und über 1 wird begrenzt
  setCloudShadows(777, 9, 0);
  let off = 1;
  for (let k = 0; k < 100; k++) off = Math.min(off, cloudSunAt(k * 11, -k * 53));
  ok(off === 1, 'Stärke 0: überall volle Sonne');
  setCloudShadows(777, 9, -0.4);
  ok(cloudUniforms.uCloud.value.z === 0, 'negative Stärke wird 0 (Bewölkung über CLOUD.end)');
  setCloudShadows(777, 9, 3);
  ok(cloudUniforms.uCloud.value.z === CLOUD.strength, 'Stärke über 1 wird begrenzt');
  ok(cloudUniforms.uCloud.value.x >= 0 && cloudUniforms.uCloud.value.x < 1 && cloudUniforms.uCloud.value.y >= 0 && cloudUniforms.uCloud.value.y < 1, 'Versatz bleibt in der Kachel (auch nach vielen Kilometern genau)');
  ok(CLOUD.end < FAIR_END, `Schatten sind weg (Bewölkung ${CLOUD.end}), bevor das Schönwetterlicht es ist (${FAIR_END})`);
  // der Himmel reicht sie weiter, und wer das Sonnenlicht selbst liest, rechnet den Anteil ein
  ok(/setCloudShadows\(s, this\.cloudT, this\.cloudK \* \(1 - o \/ CLOUD\.end\)\)/.test(sky), 'world/sky.js stellt die Wolkenschatten in jedem Bild');
  const city = readFileSync(new URL('../src/world/kit/citycore.js', import.meta.url), 'utf8');
  const reads = city.split('directionalLights[0].color').length - 1;
  const guarded = city.split('#ifdef CW_SUN').length - 1;
  ok(reads === 2 && guarded === 2, `kit/citycore.js: ${reads} Stellen lesen das Sonnenlicht selbst, ${guarded} rechnen den Wolkenschatten ein`);
}

console.log(`${checks} Prüfungen, ${fails} Fehler`);
if (fails) process.exit(1);
