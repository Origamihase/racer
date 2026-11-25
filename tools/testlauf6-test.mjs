// Prüfstand zur Testfahrt des Besitzers vom 25.11.2026 14:01: node tools/testlauf6-test.mjs (Teil von „npm test“).
// 1. Die Popcorn-Maschine kommt von Mini Adam: Sie steht samt Eimer nur in der Ladeszene an der Säule (ab dem Schwarz vor
//    der Nahaufnahme in der Bucht, nicht beim Einparken) – an einem Ladepark der Autobahn und an der Säule eines Orts,
//    im Startort nie; sie ist kein Teil der verschmolzenen Ortsstücke und geht nach der Szene, wo keine Kamera hinsieht.
// 2. Mehr Sprachdurchsagen und mehr Abwechslung: mindestens 60 neue, je Stream ein gemischter Stapel, viele zur Lage und
//    zum Moment, sieben Zuschauerstimmen; im Schnitt alle 25 bis 45 s beim Fahren, nur in ruhigen Lücken.
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
const read = (f) => readFileSync(new URL('../' + f, import.meta.url), 'utf8');

// Minimaler DOM-Ersatz: die Baukästen malen ihre Schilder auf Canvas (hier ohne Bild)
const ctx = new Proxy({}, {
  get(t, k) {
    if (k === 'measureText') return (s) => ({ width: String(s).length * 10 });
    if (k === 'createLinearGradient' || k === 'createRadialGradient') return () => ({ addColorStop() {} });
    if (k === 'getImageData') return (x, y, w, h) => ({ data: new Uint8ClampedArray(w * h * 4) });
    if (k in t) return t[k];
    return () => {};
  },
  set(t, k, v) {
    t[k] = v;
    return true;
  },
});
globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => ctx, style: {} }) };

// --- 1. Popcorn-Maschine nur beim Laden --------------------------------------------------------------------------
{
  console.log('1 Popcorn-Maschine nur beim Laden');
  const THREE = await import('three');
  const { W } = await import('../src/curve.js');
  const { createCityKit } = await import('../src/world/kit/city.js');
  const { POPCORN_STAND } = await import('../src/world/kit/rest.js');
  const { places, townLen } = await import('../src/map/graph.js');
  const { PARKS, PARK, postAt } = await import('../src/map/parks.js');
  const { townPlan, parkPlan } = await import('../src/world/xxl/towns.js');
  const { chargeOf } = await import('../src/world/xxl/charge.js');
  const { PopStand, POP_STAND, standSeen } = await import('../src/world/xxl/popstand.js');
  const city = createCityKit(W);
  const byKey = (k) => places.find((q) => q.key === k);
  const hanau = byKey('Hanau');
  const erlensee = byKey('Erlensee');
  const lenH = townLen(hanau.pop);
  const town = { kind: 'stadt', place: hanau.i, node: 1, frame: 1, s0: 1000, s1: 1000 + lenH, spotS: 1000 + Math.round(lenH * 0.6) };
  town.postAt = postAt(hanau.i, lenH, Math.round(lenH * 0.6));
  const park = { kind: 'park', park: 0, node: PARKS[0].node, frame: 1, s0: 2000, s1: 2000 + PARK.len };
  const start = { kind: 'stadt', place: erlensee.i, s0: -300, s1: -300 + Math.max(townLen(erlensee.pop), 500), start: true, spotS: 0 };
  const cases = [
    ['Ladepark ' + PARKS[0].name, park, parkPlan(city, park), true],
    ['Säule in Hanau', town, townPlan(city, town), true],
    ['Startort Erlensee', start, townPlan(city, start), false],
  ];
  // Eckpunkte aller verschmolzenen Ortsstücke (nah und fern): so viele wie ohne Maschine und Eimer im Plan
  const chunkVerts = (g) => {
    let n = 0;
    g.traverse((o) => {
      if (!o.isMesh) return;
      let p = o.parent;
      while (p && !(p.isLOD && p.name.startsWith('Ortsstück'))) p = p.parent;
      if (p) n += o.geometry.attributes.position.count;
    });
    return n;
  };
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(58, 16 / 9, 0.25, 3200);
  const cams = [{ cam, far: 0 }];
  const tmp = new THREE.Vector3();
  // Kamera d Meter vor dem Stand (seitlich zur Straße hin, in Augenhöhe), Blick auf ihn (look) oder von ihm weg
  const aim = (stand, look, d = 12) => {
    stand.getWorldPosition(tmp);
    cam.position.set(tmp.x - d, 1.4, tmp.z);
    cam.lookAt(look ? tmp.x : tmp.x - 2 * d, 1.4, tmp.z);
    cam.updateMatrixWorld();
  };
  for (const [where, sec, plan, charges] of cases) {
    const items = plan.items.filter((it) => POPCORN_STAND.has(it.name));
    const c = chargeOf(sec);
    ok(!!c && !!plan.charge, `${where}: kein Ladepark`);
    ok(items.length === (charges ? 2 : 0), `${where}: ${items.length} Teile des Popcorn-Stands im Plan`);
    const g = city.buildTown(plan);
    const stand = g.popcornStand;
    if (!charges) {
      // am Start: weder im Titel noch in der Startszene eine Maschine (dort wird nie geladen, plan.js chargeSpot)
      ok(stand === undefined && !g.getObjectByName('Popcorn-Stand'), `${where}: ein Popcorn-Stand am Start`);
      city.release(g);
      continue;
    }
    ok(!!stand && stand.isLOD && stand.levels.length === 2 && stand.visible === false, `${where}: kein eigenes, verstecktes Stück für Maschine und Eimer`);
    if (!stand) continue;
    // nicht in den verschmolzenen Ortsstücken (sonst wäre er beim Vorbeifahren da und nur durch Neubau zu entfernen)
    const bare = city.buildTown({ ...plan, items: plan.items.filter((it) => !POPCORN_STAND.has(it.name)) });
    const n0 = chunkVerts(bare);
    const n1 = chunkVerts(g);
    ok(n0 === n1 && n0 > 0, `${where}: Ortsstücke mit ${n1} statt ${n0} Eckpunkten – Maschine oder Eimer stecken darin`);
    city.release(bare);
    // der Stand steht an der Heldensäule: Maschine oben darauf, Eimer auf ihrem Poller (Mitte zwischen beiden)
    const post = items.find((it) => it.name === 'popcorn_post');
    ok(Math.hypot(stand.position.x - post.x, stand.position.z - post.z) < 1, `${where}: Stand ${stand.position.x.toFixed(1)}/${stand.position.z.toFixed(1)} nicht an der Säule`);
    let tris = 0;
    stand.levels[0].object.traverse((o) => o.isMesh && (tris += o.geometry.index ? o.geometry.index.count / 3 : o.geometry.attributes.position.count / 3));
    ok(tris > 500, `${where}: der nahe Stand hat nur ${tris} Dreiecke`);
    scene.add(g);
    g.position.set(0, 0, -sec.s0 + 600);
    g.updateMatrixWorld(true);
    const ps = new PopStand();
    // vorbeifahren (keine Szene): Er bleibt weg, ob die Kamera hinsieht oder nicht
    aim(stand, true);
    ok(standSeen(stand, cams), `${where}: die Kamera sieht den Stand nicht, obwohl sie hinschaut`);
    for (let i = 0; i < 3; i++) ps.tick(cams);
    aim(stand, false);
    ok(!standSeen(stand, cams), `${where}: die Kamera sieht den Stand, obwohl sie wegschaut`);
    for (let i = 0; i < 3; i++) ps.tick(cams);
    ok(!stand.visible, `${where}: beim Vorbeifahren steht die Maschine da`);
    // Einparken (stop.js vor P.d0): Adam ist noch nicht da, also auch keine Maschine; im Schwarz vor der Nahaufnahme
    // steht sie an der Säule, und solange die Szene läuft, bleibt sie, auch wenn die Kamera wegschaut
    ps.show(stand);
    ok(stand.visible, `${where}: in der Ladeszene keine Maschine`);
    ps.tick(cams);
    ps.show(stand);
    ok(stand.visible, `${where}: die Maschine verschwindet mitten in der Szene`);
    // Szene vorbei: solange eine Kamera hinsieht, bleibt sie; ist sie außer Sicht, ist sie weg
    ps.end();
    aim(stand, true);
    ps.tick(cams);
    ok(stand.visible, `${where}: die Maschine verschwindet vor den Augen der Kamera`);
    aim(stand, false);
    ps.tick(cams);
    ok(!stand.visible && ps.obj === null, `${where}: nach der Szene bleibt die Maschine stehen`);
    // übersprungen (Schwarz bei der Übergabe): gleich weg, auch wenn die Kamera danach hinsieht
    ps.show(stand);
    aim(stand, true);
    ps.end(true);
    ok(!stand.visible && ps.obj === null, `${where}: nach einer übersprungenen Szene steht die Maschine noch da`);
    ps.show(stand);
    // Spiegel und Seitenfenster: weiter als POP_STAND.far zählt der Stand als ungesehen (kleiner als ein Bildpunkt)
    stand.getWorldPosition(tmp);
    cam.position.set(tmp.x, 1.4, tmp.z + POP_STAND.far + 30);
    cam.lookAt(tmp.x, 1.4, tmp.z);
    cam.updateMatrixWorld();
    ok(standSeen(stand, [{ cam, far: 0 }]) && !standSeen(stand, [{ cam, far: POP_STAND.far }]), `${where}: Spiegel aus ${POP_STAND.far + 30} m`);
    // der Ort wird mitten in der Szene abgebaut: der Stand geht mit, nichts bleibt hängen oder steht beim Wiederkommen da
    scene.remove(g);
    ps.tick(cams);
    ok(ps.obj === null && !stand.visible, `${where}: der Stand eines abgebauten Orts hängt noch in der Szene`);
    city.release(g);
  }
  // die Szene stellt ihn hin (scenes/stop.js), main.js prüft je Bild die Kameras, ein neuer Stream räumt ihn weg
  const stop = read('src/scenes/stop.js');
  const main = read('src/main.js');
  ok(/if \(t >= P\.d0\) m\.popStand\.show\(r\.town\.group\.popcornStand \|\| null\);/.test(stop), 'stop.js: im Schwarz vor der Nahaufnahme kommt die Maschine nicht');
  ok((stop.match(/popStand\.show\(/g) || []).length === 1, 'stop.js: die Maschine kommt noch an anderer Stelle (beim Einparken?)');
  ok(/m\.popStand\.end\(r\.skipT >= 0\);/.test(stop), 'stop.js: nach der Szene geht die Maschine nicht');
  ok(/popStand\.tick\(standCams\(cockpitOn\)\);/.test(main) && /popStand\.reset\(\);/.test(main), 'main.js: kein Blick der Kameras je Bild oder kein Aufräumen beim neuen Stream');
  ok(/cockpitOn \? rearCam : null/.test(main) && /sideOn\(\) \? sideCam : null/.test(main) && /cockpit\.rear\.cam/.test(main), 'main.js: Spiegel, Seitenfenster oder Rückfahrkamera fehlen in der Prüfung');
}

// --- 2. Mehr Sprachdurchsagen, mehr Abwechslung --------------------------------------------------------------------
{
  console.log('2 Mehr Sprachdurchsagen, mehr Abwechslung');
  const { DURCHSAGEN, DURCHSAGEN_REGEN, VOICES } = await import('../src/data.js');
  const { FACTS } = await import('../src/game/game.js');
  const { Durchsagen, DS, ALL, SLOTS, MOMENTS } = await import('../src/game/durchsagen.js');
  const { makeStream, DRIVERS } = await import('./stream-sim.mjs');
  const VIEWERS = ['kassandra', 'weronika', 'karla', 'william', 'turbo', 'fluester', 'amtlich'];
  // Vorrat: alle alten bleiben (der Unterhosen-Witz vorn, „Mein Sack ist nass!“, das Tralala), mindestens 60 neue
  ok(DURCHSAGEN.length >= 17 + 60 && DURCHSAGEN_REGEN.length >= 4, `nur ${DURCHSAGEN.length - 17} neue Durchsagen`);
  ok(DURCHSAGEN[0].text.startsWith('Treffen sich zwei Unterhosen.') && DURCHSAGEN.some((d) => d.text === 'Mein Sack ist nass!') && DURCHSAGEN.some((d) => d.text === 'Achtung, Achtung. Das Tralala bitte nicht anfassen.'), 'eine der festen Durchsagen fehlt');
  ok(ALL.length === DURCHSAGEN.length + DURCHSAGEN_REGEN.length && ALL.slice(DURCHSAGEN.length).every((d) => d.when.split(' ').includes('regen')), 'der Stapel hat nicht alle Durchsagen (oder Regen ohne Stichwort)');
  // Stimmen: jede Durchsage spricht ein Zuschauer, alle sieben kommen oft vor; die drei neuen klingen anders als alle
  const count = {};
  for (const d of ALL) count[d.voice] = (count[d.voice] || 0) + 1;
  ok(ALL.every((d) => VIEWERS.includes(d.voice) && VOICES[d.voice]), `Durchsage mit fremder Stimme: ${ALL.filter((d) => !VIEWERS.includes(d.voice)).map((d) => d.voice).join(', ')}`);
  ok(VIEWERS.every((v) => count[v] >= 8), `Stimmen zu selten: ${JSON.stringify(count)}`);
  for (const k of ['turbo', 'fluester', 'amtlich']) {
    const v = VOICES[k];
    ok(!!v && /^[A-ZÄÖÜ][\wäöüß -]+$/.test(v.label) && v.label !== k, `${k}: kein deutscher Name`);
    const near = Object.entries(VOICES).filter(([o, w]) => o !== k && Math.abs(w.pitch - v.pitch) < 0.1 && Math.abs(w.rate - v.rate) < 0.1).map(([o]) => o);
    ok(!near.length, `${k} klingt wie ${near.join(', ')}`);
  }
  ok(VOICES.turbo.rate >= 1.35 && VOICES.fluester.rate <= 0.8 && VOICES.fluester.volume < 1 && VOICES.amtlich.pitch < 0.9, 'neue Stimmen: nicht sehr schnell, nicht flüsternd langsam oder nicht förmlich tief');
  const speech = read('src/speech.js');
  ok(['turbo', 'fluester', 'amtlich'].every((k) => new RegExp(`\\n      ${k}: \\[`).test(speech)) && /u\.volume = v\.volume \?\? 1;/.test(speech), 'speech.js: keine Stimmenwahl oder Lautstärke für die neuen Stimmen');
  // Inhalt: Stichworte bekannt, Platzhalter mit ihrem Stichwort, kurz und gut vorzulesen, nichts Verbotenes
  const BANNED = /Jana|Vanessa|\bHoly\b|Tesla|Coca|Pepsi|McDonald|Burger King|Red Bull|Haribo|YouTube|Twitch|TikTok|Instagram|Netflix|Spotify|Amazon|Google|Apple|5 Cent|\p{Extended_Pictographic}|[0-9€%&#@/]|\b(?:z\. ?B|bzw|usw|ca|evtl|inkl|km\/h)\b/u;
  for (const [n, d] of ALL.entries()) {
    const keys = d.when ? d.when.split(' ') : [];
    ok(keys.every((k) => typeof FACTS[k] === 'function'), `unbekanntes Stichwort in „${d.text}“`);
    ok(!BANNED.test(d.text), `Verbotenes in „${d.text}“: ${(d.text.match(BANNED) || [])[0]}`);
    if (n >= 17 && n < DURCHSAGEN.length) ok(!/Verein/.test(d.text), `der Verein gehört in den Chat: „${d.text}“`);
    for (const [, slot] of d.text.matchAll(/\{(\w+)\}/g)) ok(slot in SLOTS && (!SLOTS[slot].length || SLOTS[slot].some((k) => keys.includes(k))), `Platzhalter {${slot}} ohne passendes Stichwort: „${d.text}“`);
    const full = d.text.replace(/\{\w+\}/g, 'x'.repeat(24));
    ok(full.length <= 98, `zu lang für die Karte: „${d.text}“ (${full.length})`);
    if (n >= 17 && n < DURCHSAGEN.length) ok(full.split(/[.!?:] /).every((x) => x.length <= 78), `zu langer Satz zum Vorlesen: „${d.text}“`);
    // Blitzer: nur hinterher – und nie eine Warnung vor einem, der noch kommt (das tut nur OMI mit dem Radarwarner)
    if (/Blitz/.test(d.text)) ok(keys.includes('geblitzt'), `Blitzer ohne Anlass: „${d.text}“`);
    ok(!/Blitzer (voraus|vorne|kommt)|gleich .*[Bb]litz|Fuß vom Gas/.test(d.text), `Durchsage warnt vor einem Blitzer: „${d.text}“`);
  }
  const lage = ALL.filter((d) => d.when).length;
  const tags = new Set(ALL.flatMap((d) => (d.when ? d.when.split(' ') : [])));
  const want = ['ab', 'ort', 'land', 'spaet', 'regen', 'geblitzt', 'rempler', 'folge', 'akku', 'geladen', 'party', 'mau', 'spende', 'ziel', 'nah', 'weit', 'links', 'gleich'];
  ok(want.every((k) => tags.has(k)), `keine Durchsage zu ${want.filter((k) => !tags.has(k)).join(', ')}`);
  ok(ALL.filter((d) => d.when && d.when.split(' ').includes('geladen')).every((d) => /Popcorn/.test(d.text)), 'nach dem Laden ohne Popcorn');
  // der Stapel: jede passende einmal, bevor eine wiederkommt; der Moment zuerst; Platzhalter aus dem Spiel
  const g = { t: 0, world: { trip: () => null }, gags: { nextTown: () => ({ name: 'Langen' }) }, navi: { target: { name: 'Dreieich', goal: 'Bärenbrunnen, Dreieich' } } };
  const D = new Durchsagen(g);
  D.reset(7);
  const general = ALL.filter((d) => !d.when).length;
  const seen = new Set();
  for (let k = 0; k < general; k++) seen.add(D.draw((d) => !d.when));
  ok(seen.size === general && !seen.has(-1), `Stapel: ${seen.size} verschiedene in ${general} Zügen`);
  const last = D.last;
  const again = D.draw((d) => !d.when);
  ok(again >= 0 && again !== last && D.used.size === 1, 'Stapel: der neue Durchgang beginnt nicht oder mit der letzten');
  g.t = 100;
  D.moment('laden');
  const fitsNow = (d) => !d.when || d.when.split(' ').every((k) => k === 'geladen' && D.just(k));
  ok(ALL[D.draw(fitsNow)].when === 'geladen', 'nach dem Laden kommt nicht zuerst eine Durchsage dazu');
  g.t = 100 + DS.moment + 1;
  ok(!D.just('geladen') && Object.values(MOMENTS).every((k) => typeof FACTS[k] === 'function'), 'ein Moment gilt zu lange (oder ohne Stichwort)');
  D.moment('spende', 'Akkuhesse');
  const v = D.vars();
  ok(v.ziel === 'Dreieich' && v.brunnen === 'Bärenbrunnen' && v.gleich === 'Langen' && v.spender === 'Akkuhesse' && !!v.city && v.ort === undefined, `Platzhalter ${JSON.stringify(v)}`);
  // im Stream (20 Minuten, Simulator): öfter als vorher (29 je 20 min), im Schnitt alle 25 bis 45 s beim Fahren, nie
  // in einer Szene, nie Stimme an Stimme, viele Stimmen, keine doppelt
  const dur = (x) => Math.max(1.2, x.text.length / 14);
  const sum = [];
  for (const [drv, seed] of [['mittel', 11], ['gemuetlich', 12], ['zuegig', 14]]) {
    const sim = makeStream({ driver: DRIVERS[drv], seed, endless: true });
    sim.step(1200);
    const ds = sim.log.speak.filter((x) => x.who === 'durchsage');
    const voices = new Set(ds.map((x) => x.voice));
    sum.push(`${drv} ${ds.length}`);
    ok(ds.length >= 33 && ds.length <= 55, `${drv} ${seed}: ${ds.length} Durchsagen in 20 min`);
    ok(new Set(ds.map((x) => x.text)).size === ds.length, `${drv} ${seed}: eine Durchsage kam doppelt`);
    ok(voices.size >= 6, `${drv} ${seed}: nur ${voices.size} Stimmen`);
    ok(ds.every((x) => !x.at.tv && !x.at.charging), `${drv} ${seed}: Durchsage in einer Szene`);
    // Abstände beim Fahren (ohne Folge und Ladestopp dazwischen)
    const scenes = [...sim.log.tv.map((x) => x.t)];
    const gaps = [];
    for (let k = 1; k < ds.length; k++) if (!scenes.some((t) => t > ds[k - 1].t && t < ds[k].t)) gaps.push(ds[k].t - ds[k - 1].t);
    const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    ok(mean >= 25 && mean <= 45 && Math.min(...gaps) >= DS.min - 0.01, `${drv} ${seed}: beim Fahren alle ${mean.toFixed(1)} s, kürzester Abstand ${Math.min(...gaps).toFixed(1)} s`);
    // still davor (jede Stimme) und danach (Studio, Megafon, nächste Durchsage; OMI darf sich vordrängeln)
    // (OMI drängelt sich vor: Wen sie unterbricht – Studio, Durchsage –, der endet mit ihrem Einsatz, studio.js hush)
    const said = sim.log.say;
    const end = (y) => {
      const omi = y.voice === 'board' ? null : said.find((z) => z.voice === 'board' && z.t > y.t);
      return Math.min(y.t + dur(y), omi ? omi.t : Infinity);
    };
    for (const x of ds) {
      const own = said.find((y) => y.t === x.t && y.text === x.text);
      const before = said.filter((y) => y !== own && y.t <= x.t && end(y) + DS.quiet > x.t + 0.05);
      ok(!before.length, `${drv} ${seed}: Durchsage um ${x.t.toFixed(1)} s gleich nach „${before.map((y) => y.text).join(' | ')}“`);
      const after = said.filter((y) => y !== own && y.voice !== 'board' && y.t > x.t && y.t < x.t + dur(x) + DS.quiet - 0.05);
      ok(!after.length, `${drv} ${seed}: gleich nach der Durchsage um ${x.t.toFixed(1)} s: „${after.map((y) => y.text).join(' | ')}“`);
    }
  }
  console.log(`  ${ALL.length} Durchsagen (${DURCHSAGEN.length - 17} neu, ${lage} zur Lage), ${VIEWERS.length} Stimmen; je 20 min: ${sum.join(', ')}`);
  // das Spiel: ruhige Lücke, Vortritt fürs Studio, Ladestopp beendet eine laufende Durchsage, der Megafon-Wunsch wartet,
  // eigener Zufall gesät, die Karte nennt die Stimme
  const ev = read('src/game/parts/ereignisse.js');
  ok(/this\.updateDurchsagen\(\);/.test(ev) && /!this\.studio\.soon\(DS\.studio\)/.test(ev) && /this\.speech\.current\?\.opts\.ds\) this\.speech\.cancelCurrent\(true\)/.test(ev), 'ereignisse.js: keine ruhige Lücke oder der Ladestopp spricht über eine Durchsage');
  ok(/this\.later\(Math\.max\(1, this\.said\.end \+ DS\.quiet - this\.t\), \(\) => \{/.test(ev), 'ereignisse.js: der Megafon-Wunsch wartet nicht, bis eine Durchsage verklungen ist');
  ok(/this\.ui\.durchsage\(VOICES\[d\.voice\]\.label, text/.test(ev) && /\$\{voiceLabel\} · Sprachdurchsage von \$\{buyer\}/.test(read('src/ui/ui.js')), 'die Karte nennt die Stimme nicht');
  ok(/this\.ds\.reset\(Math\.floor\(Math\.random\(\) \* 4294967296\)\);/.test(read('src/game/game.js')), 'game.js: der Stapel wird nicht je Stream gemischt');
}

if (fails) {
  console.log(`\n${fails} von ${checks} Prüfungen fehlgeschlagen`);
  process.exit(1);
}
console.log(`\nalles gut (${checks} Prüfungen)`);
