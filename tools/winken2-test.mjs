// Winken 2 (die Probefahrt des Besitzers vom 22.11.2026: „Mini Adam winkt weiterhin viel zu oft und streckt seine
// Finger dabei auch nicht aus“), ohne Grafik: node tools/winken2-test.mjs
// 1. Zählen: Ein Stream von 20 Minuten mit Ortsdurchfahrten (tools/winken-sim.mjs) schreibt jeden Arm mit, der
//    hochgeht, mit seinem Anlass – die vier Anlässe der Regel (game/wave.js) und jedes Jubeln (Spende, Ziel). Die
//    Nachbildung (RAISES) muss zu main.js adamMood passen.
// 2. Seltener: In der Fahrt geht der Arm nur zu den vier Anlässen hoch – bei Spenden lächelt und nickt er und schaut aufs
//    Handy, am Ziel hüpft er vor Freude mit beiden Händen am Lenkrad; im Stream höchstens etwa zwei Arme in zehn
//    Minuten (ohne das Intro). Nur der Bananensaft am Ladestopp (im Stand) hebt die Hand noch zum Prost.
// 3. Finger gespreizt: Die winkende Hand ist offen – fünf Finger, die man einzeln sieht (der Daumen weit zur Seite, vier
//    gefächerte Finger mit Luft dazwischen) –, außen (Figur in Außenansicht und Facecam) wie in der Ich-Perspektive,
//    und oben zeigt die Handfläche dem, den er grüßt: der Kamera (Facecam) oder dem Menschen am Gehweg.
import { mainSource } from './lib/main-source.mjs';
import { readFileSync } from 'node:fs';
import { armStream, per10, RAISES } from './winken-sim.mjs';
import { WAVE } from '../src/game/wave.js';
import { Mimic, MOODS, GAZE } from '../src/models/adamMimic.js';
import * as THREE from 'three';
import { buildAdamGeometry, SHOULDER, UPPER_ARM, FORE_ARM } from '../src/models/adamSculpt.js';
import { handTarget, solveArm } from '../src/models/miniAdam.js';
import { openHandGeometry } from '../src/cockpit/hands.js';

let fails = 0;
let checks = 0;
const ok = (cond, msg) => {
  checks++;
  if (cond) return;
  fails++;
  console.log('FEHLER:', msg);
};
const src = (f) => readFileSync(new URL('../src/' + f, import.meta.url), 'utf8');
const main = mainSource();

// --- 1. Jeder Arm, der hochgeht, mit seinem Anlass ------------------------------------------------------------------
console.log('1. Arme im Stream:');
{
  // die Nachbildung passt zu main.js: Jubeln (gesture('cheer')) bei einer Spende bzw. am Ziel genau dann, wenn RAISES es sagt
  const branch = (name) => {
    const a = main.indexOf(`    case '${name}':`, main.indexOf('function adamMood('));
    return main.slice(a, main.indexOf('break;', a));
  };
  ok(/gesture\('cheer'\)/.test(branch('donation')) === (RAISES.spende !== null), `Spende: main.js jubelt ${/gesture\('cheer'\)/.test(branch('donation'))}, Nachbildung ${RAISES.spende}`);
  ok(/gesture\('cheer'\)/.test(branch('cheer')) === RAISES.ziel, `Ziel: main.js jubelt ${/gesture\('cheer'\)/.test(branch('cheer'))}, Nachbildung ${RAISES.ziel}`);
  const known = [...WAVE.why, 'spende', 'ziel'];
  for (const seed of [3, 5]) {
    const r = await armStream({ seed });
    const c = r.count;
    ok(r.minutes > 19.9 && !r.over, `Saat ${seed}: Stream ${r.minutes.toFixed(1)} min${r.over ? ', Ende ' + r.over : ''}`);
    ok(r.towns >= 2 && r.tv >= 1, `Saat ${seed}: ${r.towns} Ortsdurchfahrten, ${r.tv} Folgen`);
    ok(r.raises.every((x) => known.includes(x.why)), `Saat ${seed}: Arm ohne Anlass`);
    ok(c.intro === 1, `Saat ${seed}: Intro ${c.intro}×`);
    console.log(`  Saat ${seed}: ${r.raises.length} Arme in ${r.minutes.toFixed(0)} min (intro ${c.intro}, gehsteig ${c.gehsteig}, chat ${c.chat}, unfall ${c.unfall}, spende ${c.spende}, ziel ${c.ziel}) = ${per10(r).toFixed(1)} je 10 min ohne Intro; ${r.towns} Orte, ${r.tv} Folgen`);
  }
}

// --- 2. Seltener: der Arm nur zum Winken ----------------------------------------------------------------------------
console.log('2. Seltener:');
{
  // kein Jubeln mit dem Arm mehr: weder bei Spenden noch am Ziel (nur raiseBottle am Ladestopp nutzt die Geste)
  const gameSrc = src('game/game.js');
  const mini = src('models/miniAdam.js');
  ok(!/gesture\('cheer'\)/.test(main) && RAISES.spende === null && !RAISES.ziel, 'main.js: kein Jubeln mit dem Arm');
  ok((mini.match(/gesture\('cheer'\)/g) || []).length === 1 && /raiseBottle\(\) \{[^]*?mimic\.gesture\('cheer'\);/.test(mini), 'miniAdam.js: die Faust geht nur mit dem Bananensaft hoch');
  ok(/once\('juice'[^\n]*\n\s*a\.raiseBottle\(\);/.test(main) && (main.match(/raiseBottle\(/g) || []).length === 1, 'main.js: Bananensaft nur im Ladestopp (im Stand)');
  ok(/case 'donation':[^]*?setMood\('nod'/.test(main) && /case 'cheer':[^]*?setMood\('joy'/.test(main) && (gameSrc.match(/onMood\('cheer'/g) || []).length === 1, 'Spende: Nicken, Ziel: Freudenhüpfer');
  // Nicken und Freudenhüpfer: der Kopf nickt (zweimal, nach dem Blick aufs Handy), er hüpft – und die Hand bleibt unten
  const m = new Mimic(7);
  m.update(0);
  m.setMood('nod', undefined, 1, 1.1);
  let nodMax = 0;
  let nodEarly = 0;
  let dips = 0;
  let prev = 0;
  let base = null;
  for (let t = 0; t <= 3; t += 1 / 60) {
    const f = m.update(t);
    const p = f.pitch;
    if (base === null) base = p;
    const d = p - base;
    if (t < 1.1) nodEarly = Math.max(nodEarly, Math.abs(d));
    else nodMax = Math.max(nodMax, d);
    if (d > 0.05 && prev <= 0.05) dips++;
    prev = d;
    ok(f.wave === 0 && f.cheer === 0, `Nicken: Arm bei ${t.toFixed(2)} s`);
  }
  ok(nodMax > 0.07 && nodEarly < 0.03 && dips === 2, `Nicken: ${dips}× um bis zu ${nodMax.toFixed(3)} rad, vorher ${nodEarly.toFixed(3)}`);
  const j = new Mimic(7);
  j.update(0);
  j.setMood('joy', 3, 1);
  let lift = 0;
  for (let t = 0; t <= 3; t += 1 / 60) {
    const f = j.update(t);
    lift = Math.max(lift, f.lift);
    ok(f.wave === 0 && f.cheer === 0, `Freude: Arm bei ${t.toFixed(2)} s`);
  }
  ok(lift > 0.025 && MOODS.joy.bounce > MOODS.happy.bounce, `Freudenhüpfer ${(lift * 100).toFixed(1)} cm (Spende: ${(MOODS.happy.bounce * 1.2).toFixed(1)} cm)`);
  // der Stream: höchstens etwa zwei Arme in zehn Minuten ohne das Intro, nie zum Jubeln; Fußgänger nur im Schritttempo
  for (const seed of [3, 5, 11]) {
    const r = await armStream({ seed });
    const c = r.count;
    ok(per10(r) <= 2.2 && c.spende === 0 && c.ziel === 0 && c.intro === 1, `Saat ${seed}: ${per10(r).toFixed(1)} Arme je 10 min (${JSON.stringify(c)})`);
    // (Fußgänger im Schritttempo in echten Orten, einmal je Durchfahrt: testlauf3-test, Abschnitt 3)
    ok(r.raises.filter((x) => x.why === 'gehsteig').every((x) => x.kmh <= 30 && x.kind === 'stadt'), `Saat ${seed}: Gruß an Fußgänger zu schnell`);
    const un = r.raises.filter((x) => x.why === 'unfall');
    ok(un.every((x, i) => !i || x.t - un[i - 1].t >= WAVE.crashCool) && r.bumps >= 2 && un.length < r.bumps, `Saat ${seed}: ${r.bumps} Rempler, Grüße ${un.map((x) => x.t).join(', ')}`);
    console.log(`  Saat ${seed}: ${r.raises.length} Arme in ${r.minutes.toFixed(0)} min (intro ${c.intro}, gehsteig ${c.gehsteig}, chat ${c.chat}, unfall ${c.unfall} nach ${r.bumps} Remplern, spende ${c.spende}, ziel ${c.ziel}) = ${per10(r).toFixed(1)} je 10 min ohne Intro`);
  }
}

// --- 3. Fünf gespreizte Finger, die Handfläche zu dem, den er grüßt -------------------------------------------------
console.log('3. Finger gespreizt:');
{
  // Finger zählen: der Schnitt des Netzes mit einem Zylinder (Achse quer zum Handteller durch seine Mitte, Radius R)
  // – jeder Finger, der weiter hinausragt als der Handteller, schneidet ihn als eigener Bogen; dazwischen ist Luft.
  // ax/ay: Achsen in der Ebene des Handtellers, (cx, cy) seine Mitte, dir: Richtung des Daumens (Winkel 0).
  const digits = (geo, cx, cy, R, dir, keep) => {
    const p = geo.getAttribute('position');
    const ix = geo.index ? geo.index.array : null;
    const nT = (ix ? ix.length : p.count) / 3;
    const v = (k) => (ix ? ix[k] : k);
    const seg = [];
    for (let t = 0; t < nT; t++) {
      const as = [];
      for (let e = 0; e < 3; e++) {
        const a = v(t * 3 + e);
        const b = v(t * 3 + ((e + 1) % 3));
        const xa = p.getX(a) - cx;
        const ya = p.getY(a) - cy;
        const xb = p.getX(b) - cx;
        const yb = p.getY(b) - cy;
        const ra = Math.hypot(xa, ya) - R;
        const rb = Math.hypot(xb, yb) - R;
        if ((ra < 0) === (rb < 0)) continue;
        const k = ra / (ra - rb);
        as.push(Math.atan2(ya + (yb - ya) * k, (xa + (xb - xa) * k) * dir));
      }
      if (as.length === 2 && keep(as[0]) && keep(as[1]) && Math.abs(as[0] - as[1]) < 1) seg.push([Math.min(...as), Math.max(...as)]);
    }
    seg.sort((a, b) => a[0] - b[0]);
    const runs = [];
    for (const [a, b] of seg) {
      const last = runs[runs.length - 1];
      if (last && a <= last[1] + 1e-4) last[1] = Math.max(last[1], b);
      else runs.push([a, b]);
    }
    const gaps = runs.slice(1).map((r, i) => (r[0] - runs[i][1]) * R);
    return { n: runs.length, gap: gaps.length ? Math.min(...gaps) : 0, width: runs.map((r) => (r[1] - r[0]) * R) };
  };
  const G = buildAdamGeometry();
  const WRIST = -UPPER_ARM - FORE_ARM;
  for (const [o, side] of [['armOpenL', -1], ['armOpenR', 1]]) {
    // Handteller-Mitte bei WRIST − 0,0138 (adamSculpt.js PALM, mal OPEN); Daumen zur Seite side, Finger nach −y, oben
    // der Unterarm (ausgelassen)
    const d = digits(G[o], 0, WRIST - 0.0138, 0.078, side, (a) => a < 0.4);
    ok(d.n === 5 && d.gap >= 0.004 && Math.min(...d.width) >= 0.018, `${o}: ${d.n} Finger, kleinste Lücke ${(d.gap * 1000).toFixed(1)} mm, Finger ${d.width.map((w) => (w * 1000).toFixed(0)).join('/')} mm`);
    G[o].computeBoundingBox();
    const span = G[o].boundingBox.max.x - G[o].boundingBox.min.x;
    console.log(`  Figur ${o}: ${d.n} Finger, kleinste Lücke ${(d.gap * 1000).toFixed(1)} mm, Spanne der Hand ${(span * 100).toFixed(1)} cm`);
  }
  for (const side of [-1, 1]) {
    // Ich-Perspektive: Handteller y −0,006 … 0,064 (Mitte 0,029), Daumen zu −side, Finger nach +y, unten das Handgelenk
    const d = digits(openHandGeometry(side), 0, 0.029, 0.058, -side, (a) => a > -0.4);
    ok(d.n === 5 && d.gap >= 0.004 && Math.min(...d.width) >= 0.016, `Ich-Perspektive ${side}: ${d.n} Finger, kleinste Lücke ${(d.gap * 1000).toFixed(1)} mm, Finger ${d.width.map((w) => (w * 1000).toFixed(0)).join('/')} mm`);
    console.log(`  Ich-Perspektive ${side < 0 ? 'links' : 'rechts'}: ${d.n} Finger, kleinste Lücke ${(d.gap * 1000).toFixed(1)} mm`);
  }
  // die Handfläche oben beim Winken: Arm wie in miniAdam.js (Knochen Schulter → Ellbogen → Hand), Lenkrad wie dort
  const arm = new THREE.Bone();
  arm.position.set(SHOULDER[0], SHOULDER[1], SHOULDER[2]);
  const elbow = new THREE.Bone();
  elbow.position.y = -UPPER_ARM;
  const hand = new THREE.Bone();
  hand.position.y = -FORE_ARM;
  arm.add(elbow);
  elbow.add(hand);
  arm.userData.elbow = elbow;
  const wheel = { m: new THREE.Matrix4().makeRotationX(0.35).setPosition(0, 0.44, 0.22), r: 0.17 };
  const tg = { pos: new THREE.Vector3(), pole: new THREE.Vector3(), palm: new THREE.Vector3() };
  const at = new THREE.Vector3();
  const nrm = new THREE.Vector3();
  for (const [who, to] of [['zur Kamera (Facecam, Intro, Chat, Rempler)', GAZE.camera], ['zum Menschen am Gehweg links', GAZE.window]]) {
    for (const t of [0, 0.2, 0.45]) {
      handTarget(1, wheel, { wave: 1, t, to: new THREE.Vector3(...to) }, tg);
      solveArm(arm, tg.pos, tg.pole, tg.palm);
      arm.updateMatrixWorld(true);
      at.setFromMatrixPosition(hand.matrixWorld);
      nrm.setFromMatrixColumn(hand.matrixWorld, 2).normalize();
      const want = new THREE.Vector3(...to).sub(at).normalize();
      const deg = (Math.acos(Math.min(1, nrm.dot(want))) * 180) / Math.PI;
      ok(deg <= 30, `Handfläche ${who} bei t ${t}: ${deg.toFixed(0)}° daneben`);
      if (t === 0) console.log(`  Handfläche ${who}: ${deg.toFixed(0)}° daneben (Hand bei ${at.toArray().map((x) => x.toFixed(2)).join(', ')})`);
    }
  }
}

console.log(`winken2-test: ${checks - fails}/${checks} Prüfungen bestanden`);
if (fails) process.exit(1);
