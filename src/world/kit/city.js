// Stadt-Baukasten als Ganzes: Häuser, Straßenmöbel, Brunnen, Menschen, Wahrzeichen und die Teile der Autobahn-Tanke
// teilen sich Materialien und Atlas. Dazu der Ortsplan (layout.js) und sein Aufbau: buildTown() setzt einen geplanten
// Ort in wenige verschmolzene Stücke, goalFountain() einen Zielbrunnen mit kleinem Platz an eine beliebige Stelle,
// buildRest() eine ganze Rastanlage.
import * as THREE from 'three';
import { cityCore, compose, release, Bau } from './citycore.js';
import { createTownKit } from './town.js';
import { createStreetKit } from './street.js';
import { createFountainKit } from './fountains.js';
import { createPeopleKit } from './people.js';
import { createLandmarkKit, landmarkFor } from './landmarks.js';
import { createRestKit, restGround } from './rest.js';
import { planTown, planGoal, planRest, sizeOf, regionOf, goalKind, islandRadius, STREET, REST } from './layout.js';

// Ein Ort wird in Stücke von 100 m Straße verschmolzen: wenige Draw Calls, und was hinter der Kamera liegt, fällt weg
const CHUNK = 100;
// Ab dieser Entfernung zeigt ein Stück die sparsamen Fernfassungen
const FAR_AT = 260;
// Die Welt wird im Shader gebogen: Hüllkugeln großzügiger, damit nichts am Bildrand zu früh verschwindet
const BEND_PAD = 14;

/** Alle Baukästen für eine Material-Fabrik F (W aus curve.js); bend(v) biegt einen Punkt wie der Shader (curvePoint). */
export function createCityKit(F, { bend = null } = {}) {
  const core = cityCore(F);
  const town = createTownKit(F);
  const street = createStreetKit(F);
  const fountains = createFountainKit(F);
  const people = createPeopleKit(F);
  const landmarks = createLandmarkKit(F);
  const rest = createRestKit(F);
  const owner = new Map();
  for (const k of [town, street, fountains, people, landmarks, rest]) for (const n of k.list()) owner.set(n, k);
  const kitOf = (name) => {
    const k = owner.get(name);
    if (!k) throw new Error('Baustein fehlt: ' + name);
    return k;
  };
  const info = (name) => kitOf(name).info(name);

  /** Stellt ein Einzelstück (eigenes build) oder die Zusatz-Meshes eines Bausteins an die Stelle von it. */
  const placeGroup = (obj, it) => {
    obj.position.set(it.x, it.y, it.z);
    obj.rotation.y = it.ry;
    return obj;
  };
  const extrasOf = (it, opts) => {
    const list = kitOf(it.name).extras(it.name, opts);
    if (!list.length) return null;
    const g = new THREE.Group();
    for (const m of list) g.add(m);
    return placeGroup(g, it);
  };
  const padBounds = (group) => {
    group.traverse((o) => {
      if (!o.isMesh) return;
      o.geometry.computeBoundingSphere();
      o.geometry.boundingSphere.radius += BEND_PAD;
    });
  };

  /**
   * Brunnenliste und Sichtabfrage an eine Group hängen. recs: Brunnen in den Koordinaten der Group.
   * group.fountainsInView(eye, dir, out, { range = 120, cone = 0.75 }) füllt out mit allen Brunnen, die näher als
   * range und innerhalb des Sichtkegels (halber Öffnungswinkel cone in rad) um die Blickrichtung dir liegen (eye, dir
   * in Weltkoordinaten, dir normiert). group.watchFountains(eye, dir, cb, o) ruft cb(f) einmal je Brunnen, sobald er
   * zum ersten Mal in Sicht kommt; group.resetFountains() vergisst das wieder. Beides ohne Speicher je Bild.
   */
  const attachFountains = (group, recs) => {
    const list = recs.map((f) => ({ ...f, world: new THREE.Vector3(), dist: Infinity, seen: false }));
    const p = new THREE.Vector3();
    const tmp = [];
    group.userData.fountains = list;
    group.fountains = list;
    group.fountainsInView = (eye, dir, out, { range = 120, cone = 0.75 } = {}) => {
      out.length = 0;
      group.updateWorldMatrix(true, false);
      const cosA = Math.cos(cone);
      for (const f of list) {
        p.set(f.x, f.y + Math.min(1.5, f.h * 0.5), f.z).applyMatrix4(group.matrixWorld);
        if (bend) bend(p);
        f.world.copy(p);
        const dx = p.x - eye.x;
        const dy = p.y - eye.y;
        const dz = p.z - eye.z;
        const d = Math.hypot(dx, dy, dz);
        f.dist = d;
        if (d > range || d < 1e-3 || (dx * dir.x + dy * dir.y + dz * dir.z) / d < cosA) continue;
        out.push(f);
      }
      return out;
    };
    group.watchFountains = (eye, dir, cb, o) => {
      for (const f of group.fountainsInView(eye, dir, tmp, o)) {
        if (f.seen) continue;
        f.seen = true;
        cb(f);
      }
    };
    group.resetFountains = () => {
      for (const f of list) f.seen = false;
    };
    return list;
  };

  const kit = {
    core,
    town,
    street,
    fountains,
    people,
    landmarks,
    rest,
    /** Name → Baukasten, info eines beliebigen Bausteins. */
    kitOf,
    info,
    sizeOf,
    regionOf,
    STREET,
    REST,
    /** Hauptbrunnen eines Orts (zugleich Zielbrunnen der Fahrt dorthin) und der Radius seiner Insel, siehe layout.js. */
    goalKind,
    islandRadius,
    /** Gesetzte Bausteine verschmelzen: items = [{ g, x, y, z, ry, s, tint }] → Group mit höchstens vier Meshes. */
    compose: (items, opts) => compose(core, items, opts),
    /** Ein gebautes Stück (Ort, Brunnen, Rastanlage) abräumen: gibt nur frei, was eigens dafür verschmolzen wurde. */
    release,
    /** Wasser der Brunnen bewegen: t = Zeit in Sekunden, rain = Regen 0 … 1. */
    setWater: (t, rain) => core.setWater(t, rain),

    /** Wahrzeichen eines Orts: [{ name, slot, far, title }] (siehe landmarks.js). */
    landmarkFor,
    /**
     * Ort planen (rein rechnerisch, siehe layout.js): place = { key, name, cc, pop, n, lat }, opts = { len, seed, goal,
     * landmarks } – ohne landmarks wählt landmarkFor(place) die Wahrzeichen.
     */
    planTown: (place, opts = {}) => planTown(place, { ...opts, infoOf: info, has: (n) => owner.has(n), landmarks: opts.landmarks ?? landmarkFor(place) }),
    /** Zielbrunnen planen: { size | pop, seed, place, kind, people } → Rahmen des Platzes, Brunnen im Ursprung. */
    planGoal: (opts = {}) => planGoal({ ...opts, infoOf: info }),

    /**
     * Geplanten Ort aufbauen. Ergebnis: Group in Ortskoordinaten (x seitlich wie im Straßenprofil, z = −u), vom
     * Straßenbau bei z = −s0 in die Strecke gehängt. Dazu group.fountains (Brunnenliste), fountainsInView,
     * watchFountains, resetFountains (siehe attachFountains), group.update(t) für die Fangruppe am Ziel und
     * group.layout, der Lageplan für das Navi (layout.js townLayout, im selben Rahmen).
     * lazy: die verschmolzenen Stücke und die Wahrzeichen entstehen erst mit group.step() (eines je Aufruf, zuerst
     * alle Fernfassungen, dann die nahen vom Ortsbeginn an; true, solange noch etwas fehlt; group.pending zählt den
     * Rest): eine Großstadt braucht am Stück über 100 ms, in Schritten wenige Millisekunden je Bild.
     */
    buildTown(plan, { farAt = FAR_AT, fans = plan.goal != null, lazy = false } = {}) {
      const root = new THREE.Group();
      root.name = 'Ort ' + plan.place.name;
      const farJobs = [];
      const nearJobs = [];
      const chunks = new Map();
      const solo = [];
      const marks = [];
      for (const it of plan.items) {
        // der Brunnen auf der Insel der Straße gehört dem Straßenbau (layout.js planTown, island)
        if (it.external) continue;
        if (!kitOf(it.name).geo(it.name)) {
          solo.push(it);
          continue;
        }
        if (info(it.name).kind === 'landmark') {
          marks.push(it);
          continue;
        }
        const ci = Math.floor(-it.z / CHUNK);
        if (!chunks.has(ci)) chunks.set(ci, []);
        chunks.get(ci).push(it);
      }
      const cx = (STREET.curbL + STREET.curbR) / 2;
      // eine Stufe (nah bei 0, fern ab farAt) in ihre LOD hängen; mit nur einer Stufe zeigt die LOD diese
      const level = (lod, obj, at) => {
        padBounds(obj);
        lod.addLevel(obj, at);
        return obj;
      };
      for (const [ci, list] of [...chunks].sort((a, b) => a[0] - b[0])) {
        const cz = -(ci + 0.5) * CHUNK;
        const make = (far) => compose(core, list.map((it) => ({ g: kitOf(it.name).geo(it.name, far), x: it.x - cx, y: it.y, z: it.z - cz, ry: it.ry, tint: it.tint })));
        const lod = new THREE.LOD();
        lod.name = 'Ortsstück ' + ci;
        lod.position.set(cx, 0, cz);
        root.add(lod);
        farJobs.push(() => level(lod, make(true), farAt));
        nearJobs.push(() => {
          level(lod, make(false), 0);
          for (const it of list) {
            const ex = extrasOf(it);
            if (ex) root.add(ex);
          }
        });
      }
      for (const it of solo) root.add(placeGroup(kitOf(it.name).build(it.name, { tint: it.tint }), it));
      // Wahrzeichen: eigene Stufen nah/fern, gemessen von ihrem eigenen Ursprung (sie stehen weit hinter der Zeile)
      const anim = [];
      for (const it of marks) {
        const lod = new THREE.LOD();
        lod.name = 'Wahrzeichen ' + it.name;
        root.add(placeGroup(lod, it));
        // Drehende Teile (Mühlenflügel, Riesenrad) laufen in beiden Stufen mit
        const moving = (obj) => {
          if (obj.userData.update) anim.push(obj);
        };
        farJobs.push(() => moving(level(lod, landmarks.build(it.name, { far: true }), farAt)));
        nearJobs.push(() => moving(level(lod, landmarks.build(it.name), 0)));
      }
      const jobs = [...farJobs, ...nearJobs];
      root.pending = jobs.length;
      root.step = () => {
        const job = jobs.shift();
        if (job) job();
        root.pending = jobs.length;
        return jobs.length > 0;
      };
      if (!lazy) while (root.step());
      for (const t of plan.texts) root.add(placeGroup(kitOf(t.name).build(t.name, { name: t.text, next: t.next }), t));
      // Fangruppe am Ziel: neben dem Hauptbrunnen, hinter dem Gehweg, schaut zur Straße
      const main = plan.fountains[0];
      const sq = plan.squares[0];
      if (fans && main && sq) {
        const g = people.build('fanGroup', { n: 10, seed: 7, w: 7, d: 3 });
        g.position.set(STREET.curbR + sq.d0 + 2.2, STREET.top, -(sq.u1 - 4.5));
        g.rotation.y = -Math.PI / 2;
        root.add(g);
        anim.push(g);
      }
      root.update = (t) => {
        for (const g of anim) g.userData.update(t);
      };
      attachFountains(root, plan.fountains);
      root.userData.plan = plan;
      // Lageplan für das Navi (Straße, Gehwege, Plätze, Zielbrunnen, Häuser; siehe layout.js townLayout)
      root.layout = plan.layout;
      return root;
    },

    /**
     * Zielbrunnen mit kleinem Platz an Stelle (x, y, z) mit Drehung heading (rad um die Senkrechte; der Spieler kommt
     * im Rahmen des Platzes von +z). opts wie planGoal. Ergebnis: Group mit kind, title, special und cam = { pos, look }
     * (THREE.Vector3 in den Koordinaten des Elternobjekts) für die Nahaufnahme, dazu Brunnenliste und Sichtabfrage.
     */
    goalFountain({ x = 0, y = 0, z = 0, heading = 0, ...opts } = {}) {
      const g = planGoal({ ...opts, infoOf: info });
      const group = new THREE.Group();
      group.name = 'Zielbrunnen';
      group.position.set(x, y, z);
      group.rotation.y = heading;
      const pieces = g.items.filter((it) => kitOf(it.name).geo(it.name));
      const merged = compose(core, pieces.map((it) => ({ g: kitOf(it.name).geo(it.name), x: it.x, y: it.y, z: it.z, ry: it.ry, tint: it.tint })));
      padBounds(merged);
      group.add(merged);
      for (const it of g.items) {
        if (!kitOf(it.name).geo(it.name)) group.add(placeGroup(kitOf(it.name).build(it.name, { tint: it.tint }), it));
        const ex = extrasOf(it);
        if (ex) group.add(ex);
      }
      group.updateMatrix();
      const fi = info(g.kind);
      const toParent = (v) => new THREE.Vector3(v[0], v[1], v[2]).applyMatrix4(group.matrix);
      Object.assign(group.userData, { kind: g.kind, title: g.title, special: g.special, size: g.S });
      group.kind = g.kind;
      group.title = g.title;
      group.special = g.special;
      group.cam = g.cam ? { pos: toParent(g.cam.pos), look: toParent(g.cam.look) } : null;
      // Lageplan im Rahmen des Platzes (Pflaster, Stecknadel auf dem Brunnen) und dieselbe Stecknadel beim Elternobjekt
      group.layout = { ...g.layout, pin: toParent([0, STREET.top, g.fz]) };
      attachFountains(group, [{ id: 0, kind: g.kind, title: g.title, x: 0, y: STREET.top, z: g.fz, u: 0, ry: 0, r: g.r, h: fi.h, place: opts.place ?? null, special: g.special, goal: true, size: fi.size, cam: g.cam }]);
      return group;
    },

    /** Rastanlage planen (rein rechnerisch, siehe layout.js planRest): opts = { name (Ort), title, seed, people }. */
    planRest: (opts = {}) => planRest({ ...opts, infoOf: info }),

    /**
     * Geplante Rastanlage aufbauen. Ergebnis: Group im Rahmen ihres Abschnitts (wie ein Ort: x seitlich, z = −u; die
     * Zufahrt läuft von (9, 0) bis (9, −len)), vom Straßenbau bei z = −s0 in die Strecke gehängt. Dazu group.layout
     * (Lageplan fürs Navi), group.stop ({ pos, ry }: Haltepunkt in der Heldenbucht, ry für ein Modell mit Front −z),
     * group.post (Ladesäule der Heldenbucht, Oberkante), group.popcorn (Popcorn-Eimer auf ihrem Poller), group.door
     * (Tür der Raststätte), group.cam ({ pos, look } für die Nahaufnahme gut 3 m neben dem Auto in 1,2 m Höhe); alle
     * Punkte als THREE.Vector3 in den Koordinaten der Group.
     */
    buildRest(plan, { farAt = FAR_AT } = {}) {
      const root = new THREE.Group();
      root.name = plan.title;
      // eine Stufe nah, eine fern; gemessen von der Mitte der Anlage
      const [x0, x1, z0, z1] = plan.ground.base;
      const cx = (x0 + x1) / 2;
      const cz = (z0 + z1) / 2;
      const gb = new Bau({ fade: 0.2, low: 1 });
      restGround(gb, plan.ground);
      const ground = gb.done({});
      const make = (far) => compose(core, [{ g: ground, x: -cx, z: -cz }, ...plan.items.map((it) => ({ g: kitOf(it.name).geo(it.name, far), x: it.x - cx, y: it.y, z: it.z - cz, ry: it.ry, tint: it.tint }))]);
      const lod = new THREE.LOD();
      lod.name = 'Rastanlage';
      lod.position.set(cx, 0, cz);
      const near = make(false);
      const far = make(true);
      padBounds(near);
      padBounds(far);
      lod.addLevel(near, 0);
      lod.addLevel(far, farAt);
      root.add(lod);
      // Tafeln mit Text: die Einfahrtstafel trägt den Namen der Anlage
      for (const it of plan.items) {
        const ex = extrasOf(it, it.name === 'autobahn_schild' ? { title: plan.title, icons: ['plug', 'cup', 'food', 'P', 'WC'] } : {});
        if (ex) root.add(ex);
      }
      const v = (p) => new THREE.Vector3(p[0], p[1], p[2]);
      const pk = plan.park;
      root.layout = plan.layout;
      root.stop = { pos: v([pk.stop.x, pk.stop.y, pk.stop.z]), ry: pk.stop.ry };
      root.post = v([pk.post.x, pk.post.y, pk.post.z]);
      root.popcorn = v(pk.popcorn);
      root.door = v([plan.layout.shop.door[0], REST.pave, plan.layout.shop.door[1]]);
      root.cam = { pos: v(pk.cam.pos), look: v(pk.cam.look) };
      root.userData.plan = plan;
      return root;
    },
  };
  return kit;
}
