// Prüfstand zur Testfahrt des Besitzers vom 25.11.2026 14:01: node tools/testlauf6-test.mjs (Teil von „npm test“).
// 1. Die Popcorn-Maschine kommt von Mini Adam: Sie steht samt Eimer nur in der Ladeszene an der Säule (ab dem Schwarz vor
//    der Nahaufnahme in der Bucht, nicht beim Einparken) – an einem Ladepark der Autobahn und an der Säule eines Orts,
//    im Startort nie; sie ist kein Teil der verschmolzenen Ortsstücke und geht nach der Szene, wo keine Kamera hinsieht.
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

if (fails) {
  console.log(`\n${fails} von ${checks} Prüfungen fehlgeschlagen`);
  process.exit(1);
}
console.log(`\nalles gut (${checks} Prüfungen)`);
