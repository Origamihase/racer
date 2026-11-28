// Prüfstand Licht der Welt (src/world/light.js), Wolkenschatten (src/curve.js) und weite Schattenkarte
// (src/world/farshadow.js): Das kräftige Schönwetterlicht macht das Bild nicht heller oder
// dunkler als das frühere, weiche (eine besonnte Wiese bekommt gleich viel Licht), es macht nur die Schatten tiefer
// und bläulich. Und im Regen ist alles, wie es war: Ab Bewölkung FAIR_END gilt Wert für Wert das frühere Licht.
import { LIGHT, FAIR_END, worldLight, linear } from '../src/world/light.js';
import * as THREE from 'three';
import { CLOUD, SHADOW_FADE, cloudField, cloudSunAt, setCloudShadows, sunUniforms } from '../src/curve.js';
import { FarShadow, FAR, FAR_LAYER } from '../src/world/farshadow.js';
import { readFileSync } from 'node:fs';
import { WIND, windGeo, windSway, setWind, windUniforms, windMaterials, WIND_GLSL } from '../src/world/wind.js';
import { coniferGeo, decidGeo, bushGeo } from '../src/world/scenery.js';

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
  ok(sunUniforms.uCloud.value.z === 0, 'negative Stärke wird 0 (Bewölkung über CLOUD.end)');
  setCloudShadows(777, 9, 3);
  ok(sunUniforms.uCloud.value.z === CLOUD.strength, 'Stärke über 1 wird begrenzt');
  ok(sunUniforms.uCloud.value.x >= 0 && sunUniforms.uCloud.value.x < 1 && sunUniforms.uCloud.value.y >= 0 && sunUniforms.uCloud.value.y < 1, 'Versatz bleibt in der Kachel (auch nach vielen Kilometern genau)');
  ok(CLOUD.end < FAIR_END, `Schatten sind weg (Bewölkung ${CLOUD.end}), bevor das Schönwetterlicht es ist (${FAIR_END})`);
  // der Himmel reicht sie weiter, und wer das Sonnenlicht selbst liest, rechnet den Anteil ein
  ok(/setCloudShadows\(s, this\.cloudT, this\.cloudK \* \(1 - o \/ CLOUD\.end\)\)/.test(sky), 'world/sky.js stellt die Wolkenschatten in jedem Bild');
  const city = readFileSync(new URL('../src/world/kit/citycore.js', import.meta.url), 'utf8');
  const reads = city.split('directionalLights[0].color').length - 1;
  const guarded = city.split('#ifdef CW_SUN').length - 1;
  ok(reads === 2 && guarded === 2, `kit/citycore.js: ${reads} Stellen lesen das Sonnenlicht selbst, ${guarded} rechnen den Wolkenschatten ein`);
}

// 7. Weite Schattenkarte (src/world/farshadow.js): Der Kasten liegt vor der Kamera, rastet auf ganze Punkte der Welt
// ein (sonst flimmern Schattenkanten beim Fahren) und rechnet die Welt richtig in die Karte um
{
  const far = new FarShadow();
  ok(!far.on && sunUniforms.uFar.value.x === 0 && sunUniforms.uFarMap.value === far.rt.depthTexture, 'aus: Stärke 0, eine winzige leere Karte hängt am Shader');
  far.setSize(2048);
  ok(far.on && far.rt.width === 2048 && sunUniforms.uFarMap.value === far.rt.depthTexture, 'an: Karte 2048 × 2048 hängt am Shader');
  ok(far.rt.depthTexture.compareFunction === THREE.LessEqualCompare && far.material.side === THREE.BackSide, 'Tiefenvergleich in der Karte, Rückseiten als Schattenwerfer');
  // Sonne und Achsen wie world/sky.js bei Kurs psi
  const axes = (psi) => {
    const sun = new THREE.Vector3(sx, sy, sz).normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), -psi);
    const eU = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 0, -1), sun).normalize();
    const eV = new THREE.Vector3().crossVectors(sun, eU);
    return { sun, eU, eV };
  };
  const cam = new THREE.PerspectiveCamera(60, 16 / 9, 0.25, 3200);
  const at = (x, y, z) => new THREE.Vector3(x, y, z).applyMatrix4(sunUniforms.uFarM.value);
  let worst = 0;
  let depthBad = 0;
  let snapBad = 0;
  let coverBad = 0;
  for (let k = 0; k < 60; k++) {
    const psi = (k - 30) * 0.1;
    const { sun, eU, eV } = axes(psi);
    cam.position.set((k % 7) - 3, 1.3 + (k % 5), 0);
    cam.lookAt(cam.position.x + Math.sin(k * 0.05) * 0.2, 1, -50);
    cam.updateMatrixWorld(true);
    const s = 1000 + k * 333.3;
    far.place(cam, s, sun, eU, eV);
    // Mitte des Kastens am Boden
    const c = far.camera.position.clone().addScaledVector(sun, -FAR.depth / 2);
    const m = at(c.x, 0, c.z);
    worst = Math.max(worst, Math.abs(m.x - 0.5), Math.abs(m.y - 0.5));
    // ein Punkt näher an der Sonne hat die kleinere Tiefe, und der Boden liegt mitten im Tiefenbereich
    const up = at(c.x + sun.x * 30, sun.y * 30, c.z + sun.z * 30);
    if (!(up.z < m.z && m.z > 0.3 && m.z < 0.7 && Math.abs(up.x - m.x) < 1e-6 && Math.abs(up.y - m.y) < 1e-6)) depthBad++;
    // der Boden vom Wagen bis 500 m voraus und 150 m zur Seite liegt in der Karte (bei Kurs der Straße bis ±1,2 rad)
    if (Math.abs(psi) <= 1.2) for (const [x, z] of [[0, 0], [0, -500], [150, -200], [-150, -200], [0, 40]]) {
      const q = at(x, 0, z);
      if (!(q.x > 0.02 && q.x < 0.98 && q.y > 0.02 && q.y < 0.98)) coverBad++;
    }
    // eingerastet: die Lage der Karte gegen die Welt (die mit s nach +z rückt) ist ein ganzes Vielfaches eines Punkts
    const u = eU.x * c.x + eU.z * c.z;
    const v = eV.x * c.x + eV.z * (c.z - s);
    const fu = Math.abs(u / (FAR.u / far.size) - Math.round(u / (FAR.u / far.size)));
    const fv = Math.abs(v / (FAR.v / far.size) - Math.round(v / (FAR.v / far.size)));
    if (fu > 1e-6 || fv > 1e-6) snapBad++;
  }
  ok(worst < 1e-9, `die Mitte des Kastens liegt in der Mitte der Karte (Abweichung ${worst.toExponential(1)})`);
  ok(depthBad === 0, `Tiefe wächst von der Sonne weg, der Boden liegt mitten im Tiefenbereich (${depthBad} Verstöße)`);
  ok(coverBad === 0, `der Boden vom Wagen bis 500 m voraus und 150 m zur Seite liegt in der Karte (${coverBad} Punkte draußen)`);
  ok(snapBad === 0, `der Kasten rastet auf ganze Punkte der Welt ein (${snapBad} Verstöße)`);
  const U = sunUniforms.uFar.value;
  ok(U.x === 1 && U.y > 0 && U.y < 0.001 && U.w === 1 / 2048, `Stärke 1, Luft ${(U.y * (FAR.depth - FAR.near)).toFixed(2)} m, Punktgröße 1/2048`);
  far.setSize(0);
  ok(!far.on && U.x === 0, 'wieder aus: Stärke 0');
  const before = sunUniforms.uFarM.value.clone();
  far.place(cam, 5, ...Object.values(axes(0)));
  ok(before.equals(sunUniforms.uFarM.value) && U.x === 0, 'aus: place stellt nichts');
  // dieselben Ränder wie die feine Karte, und wer Schatten wirft, liegt auf der Ebene der weiten Karte
  const curveSrc = readFileSync(new URL('../src/curve.js', import.meta.url), 'utf8');
  ok(Number(SHADOW_FADE.edge) === 0.04 && Number(SHADOW_FADE.far) === 0.29 && /1\.0 - smoothstep\( 0\.0, \$\{SHADOW_FADE\.edge\}, cwN\.x \)/.test(curveSrc),
    'die weite Karte gilt mit dem Gegenstück des Gewichts der feinen (dieselben Ränder)');
  ok(/if \( ! receiveShadow \) cwW = 0\.0;/.test(curveSrc), 'was keinen Schatten empfängt, bekommt auch keinen weiten');
  for (const f of ['world/xxl/forest.js', 'world/scenery.js', 'world/kit/citycore.js']) {
    ok(/layers\.enable\(FAR_LAYER\)/.test(readFileSync(new URL('../src/' + f, import.meta.url), 'utf8')), `${f}: Schattenwerfer liegen auf der Ebene der weiten Karte`);
  }
  ok(far.camera.layers.mask === 1 << FAR_LAYER, 'die Kamera der weiten Karte sieht nur diese Ebene');
}


// Wind in Bäumen und Büschen (src/world/wind.js)
{
  // der Fuß steht, die Spitze schwingt, nichts mehr als 1
  for (const [name, g] of [['Nadelbaum', coniferGeo()], ['Laubbaum', decidGeo()], ['Busch', bushGeo()]]) {
    windGeo(g);
    const p = g.attributes.position;
    const w = g.attributes.cwWind;
    let lo = Infinity, hi = 0, base = 0, h = 0, minY = Infinity;
    for (let i = 0; i < p.count; i++) {
      h = Math.max(h, p.getY(i));
      minY = Math.min(minY, p.getY(i));
    }
    for (let i = 0; i < p.count; i++) {
      lo = Math.min(lo, w.getX(i));
      hi = Math.max(hi, w.getX(i));
      if (p.getY(i) < 0.05 * h) base = Math.max(base, w.getX(i));
    }
    ok(minY >= -0.31, `${name}: Fuß bei y = 0, Stamm höchstens 0,3 m im Boden (tiefster Punkt ${minY.toFixed(2)} m)`);
    ok(lo >= 0 && hi <= 1 && hi > 0.3, `${name}: Gewicht 0 … ${hi.toFixed(2)} (Höhe ${h.toFixed(1)} m)`);
    ok(base < 0.01, `${name}: am Fuß bewegt sich nichts (${base.toFixed(4)})`);
    ok(windGeo(g) === g && g.attributes.cwWind === w, `${name}: zweimal eintragen ändert nichts`);
  }
  // nie weiter als die Luft der Hüllen der Reihen, bei Regen kräftiger, und es bewegt sich wirklich
  let worst = 0;
  for (const o of [0, 0.5, 1]) {
    setWind(0, o);
    for (let t = 0; t < 60; t += 0.37) for (let x = -300; x <= 300; x += 37) worst = Math.max(worst, Math.abs(windSway(x, -x * 1.7, t)));
  }
  ok(worst <= WIND.max && WIND.max < 0.25, `größter Ausschlag ${worst.toFixed(3)} m (Grenze ${WIND.max} m, Luft der Hüllen 0,25 m)`);
  setWind(0, 0);
  const fair = windUniforms.uWind.value.y;
  setWind(0, 1);
  ok(windUniforms.uWind.value.y > fair * 1.3, 'bei Regen weht es kräftiger');
  setWind(0, 0);
  let span = -Infinity;
  let low = Infinity;
  for (let t = 0; t < 20; t += 0.1) {
    span = Math.max(span, windSway(10, 20, t));
    low = Math.min(low, windSway(10, 20, t));
  }
  ok(span - low > 0.08, `die Spitze eines großen Baums wandert ${((span - low) * 100).toFixed(0)} cm hin und her`);
  // Nachbarn schwingen nicht im Gleichtakt
  let differ = 0;
  for (let t = 0; t < 20; t += 0.5) differ = Math.max(differ, Math.abs(windSway(0, 0, t) - windSway(13, 7, t)));
  ok(differ > 0.02, `Nachbarn schwingen gegeneinander versetzt (${(differ * 100).toFixed(0)} cm)`);
  // Shader: dieselbe Rechnung, eigene Programme für Bild und Schatten, Stelle in PROJECT vorhanden
  ok(/sin\( uWind\.x \* 1\.3 - cwPh \) \* 0\.55 \+ sin\( uWind\.x \* 2\.9 - cwPh \* 1\.7 \) \* 0\.25 \+ 0\.45/.test(WIND_GLSL)
    && Math.abs(0.55 + 0.25 + 0.45 - WIND.peak) < 1e-9, 'Shader und windSway rechnen gleich');
  const { mat, depth } = windMaterials();
  ok(mat.customProgramCacheKey() !== 'curved-world' && depth.customProgramCacheKey() !== mat.customProgramCacheKey(), 'eigene Programme für Bild und Schatten');
  ok(depth.depthPacking === THREE.RGBADepthPacking, 'Schatten-Tiefe wie bei three.js gepackt');
  const sh = { uniforms: {}, vertexShader: THREE.ShaderLib.depth.vertexShader, fragmentShader: THREE.ShaderLib.depth.fragmentShader };
  depth.onBeforeCompile(sh);
  ok(sh.vertexShader.includes('cwWind * cwS') && sh.uniforms.uWind === windUniforms.uWind, 'Tiefen-Shader bekommt den Wind');
  const curveSrc = readFileSync(new URL('../src/curve.js', import.meta.url), 'utf8');
  ok(/mvPosition = instanceMatrix \* mvPosition;\n  \/\/ CW_WIND\n#endif\nvec4 cwPos/.test(curveSrc), 'Wind nach dem Legen der Instanz, vor dem Biegen');
  for (const f of ['world/xxl/forest.js', 'world/scenery.js']) {
    const src = readFileSync(new URL('../src/' + f, import.meta.url), 'utf8');
    ok(/customDepthMaterial = /.test(src) && /windGeo\(coniferGeo\(\)\)/.test(src), `${f}: Pflanzen mit Wind, Schatten schwingen mit`);
  }
}

console.log(`${checks} Prüfungen, ${fails} Fehler`);
if (fails) process.exit(1);
