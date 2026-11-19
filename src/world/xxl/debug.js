// Prüfhilfen der XXL-Welt (nur mit ?debug): window.__MA.trip und window.__MA.xxl, beschrieben in den NOTES des
// Engine-Pakets. Sie verändern nur die Strecke und den Spieler, nie Geld, Chat oder HUD.
import * as THREE from 'three';
import { places, nodes } from '../../map/graph.js';
import { W } from '../../curve.js';
import { J } from '../../game/trip.js';
import { autoTarget } from './plan.js';

const FRAME_COLORS = [0xff6b6b, 0x4dabf7, 0x51cf66, 0xfcc419, 0xcc5de8, 0xff922b, 0x22b8cf];

/** Nur die Fahrt m Meter vorwärts (wie world.advance, aber ohne die Welt aufzubauen): für Suchen über weite Strecken. */
function tripAdvance(world, p, m, each) {
  const T = world.trip;
  const end = p.s + m;
  while (p.s < end) {
    p.s = Math.min(end, p.s + 5);
    p.x = autoTarget(T, world.choice);
    T.update(p.s, p.x);
    if (each) each(p.s, 5);
  }
}

/**
 * hooks.afterWarp(p): nach einem Sprung (Verkehr, Sammelsachen und Szenerie beginnen neu). hooks.eachStep(s, step):
 * nach jedem Schritt eines Sprungs. Der Kurs der Straße entsteht beim Fahren Stück für Stück (Course.fill); wird er
 * erst am Ende eines Sprungs geplant, liegen die Bögen der Kante anders als bei jeder echten Fahrt – mit eachStep
 * plant main.js ihn unterwegs mit, und die Prüfbilder zeigen die Straße, die ein Spieler dort bekommt.
 */
export function installDebug(M, world, getPlayer, hooks = {}) {
  const tint = new Map();
  let colors = false;
  const api = {
    /** Navi-Ziel nach Ortsnamen (Anfang genügt, Groß/klein egal); '' oder null löscht es. Gibt den Ort zurück. */
    target(name) {
      if (!name) {
        world.trip.setTarget(-1);
        return null;
      }
      const q = String(name).toLowerCase();
      let i = places.findIndex((p) => p.name.toLowerCase() === q);
      if (i < 0) i = places.findIndex((p) => p.name.toLowerCase().startsWith(q));
      if (i < 0) throw new Error('Ort nicht gefunden: ' + name);
      world.trip.setTarget(i);
      return places[i].name;
    },
    /** Ohne Bild m Meter der Route folgen (Ausfahrten wie der Autopilot), dann die Welt neu aufbauen. */
    warp(m) {
      const p = getPlayer();
      const evs = world.advance(p, m, 5, hooks.eachStep);
      if (hooks.afterWarp) hooks.afterWarp(p);
      return { s: Math.round(p.s), x: p.x, sec: world.trip.section.kind, events: evs };
    },
    /**
     * Bis kurz vor eine Stelle fahren: warpTo('fork' | 'exit' | 'merge' | 'end' | 'begin' | 'border' | 'spot' (Mitte
     * eines Orts, am Navi-Ziel der Brunnenplatz) | Abschnittsart wie 'stadt', 'land', 'conn', vor = 50).
     */
    warpTo(what, before = 50, maxM = 60000) {
      const T = world.trip;
      const p = getPlayer();
      const find = () => {
        for (const c of T.cur.sections) {
          if (c.s1 <= T.s) continue;
          let at = null;
          if (what === 'fork' && c.fork && !c.fork.taken) at = c.fork.s;
          else if (what === 'exit' && c.fork && !c.fork.taken && (c.fork.forced || T.planFor(c.fork) === 'exit')) at = c.fork.s;
          else if (what === 'merge' && c.kind === 'ab' && c.merge) at = c.merge.s;
          else if (what === 'end' && c.fork && c.fork.forced) at = c.fork.s;
          else if (what === 'begin' && c.kind === 'ab' && c.merge && c.begins) at = c.merge.s;
          else if (what === 'border' && c.borderS !== undefined) at = c.borderS;
          else if (what === 'spot' && c.kind === 'stadt' && c.spotS !== undefined && !c.start) at = c.spotS;
          else if (c.kind === what) at = c.s0;
          if (at !== null && at - before > T.s + 1) return at;
        }
        return null;
      };
      // nächste offene Gabelung: nicht über sie hinweg springen, denn erst danach stehen die Abschnitte des
      // gewählten Zweigs in trip.cur (sonst würde ein kurzer Abschnitt dahinter übersprungen)
      const forkAhead = () => {
        for (const c of T.cur.sections) if (c.fork && !c.fork.taken && c.fork.s > T.s) return c.fork.s;
        return Infinity;
      };
      // gesucht wird nur mit der Fahrt in Schritten von höchstens 200 m (was erst unterwegs geplant wird, z. B. hinter
      // einer Fähre, taucht so rechtzeitig auf); die Welt wird erst am Ziel einmal aufgebaut
      let found = null;
      for (let walked = 0; walked < maxM; ) {
        const at = find();
        if (at !== null && at - before - T.s < 1500 && (at < forkAhead() + 1 || at - before < forkAhead())) {
          tripAdvance(world, p, at - before - T.s, hooks.eachStep);
          found = at;
          break;
        }
        const m = Math.max(1, Math.min(200, forkAhead() + 2 - T.s));
        tripAdvance(world, p, m, hooks.eachStep);
        walked += m;
      }
      api.warp(0);
      return found === null ? null : { at: Math.round(found), ...world.info() };
    },
    /**
     * Nächster Wechsel der gezeichneten Autobahn auf dem eigenen Weg: {at: s, why: 'exit' | 'merge'} (Mitte eines
     * Vorhangs aus trip.curtains, dort verschwindet bzw. erscheint eine Autobahn) oder null.
     */
    nextSwap() {
      const T = world.trip;
      let best = null;
      for (const c of T.curtains()) {
        if (c.path !== T.cur) continue;
        const at = c.s0 + J.curtainBefore;
        if (at > T.s + 0.01 && (!best || at < best.at)) best = { at, why: c.why };
      }
      return best;
    },
    /**
     * Bis `before` Meter vor den nächsten Wechsel der Autobahn fahren (why: 'exit' | 'merge' | null = beliebig) und
     * dort stehen bleiben; gibt {at, why, s} zurück oder null. Springt in kleinen Schritten, damit kein Vorhang
     * übersprungen wird, der erst unterwegs geplant wird.
     */
    warpToSwap(why = null, before = 30, maxM = 60000) {
      const T = world.trip;
      const p = getPlayer();
      for (let m = 0; m < maxM; m += 100) {
        const sw = api.nextSwap();
        if (sw && (!why || sw.why === why) && sw.at - T.s > before + 1) {
          api.standAt(sw.at - before);
          if (hooks.afterWarp) hooks.afterWarp(p);
          return { ...sw, s: +T.s.toFixed(2) };
        }
        tripAdvance(world, p, 100, hooks.eachStep);
      }
      api.warp(0);
      return null;
    },
    /**
     * Ohne Bild genau bis s fahren und dort stehen bleiben (Tempo 0, Spur wie der Autopilot): Vorher-nachher-Bilder.
     * Nach einem Sprung über mehr als 20 m beginnen Verkehr und Szenerie neu (wie bei warp), sonst bleibt alles stehen.
     */
    standAt(s) {
      const p = getPlayer();
      const jump = s - p.s;
      if (jump > 0) world.advance(p, jump, 0.5, hooks.eachStep);
      p.speed = 0;
      p.vx = 0;
      if (jump > 20 && hooks.afterWarp) hooks.afterWarp(p);
      return { s: +p.s.toFixed(3), x: +p.x.toFixed(3), view: world.view ? world.view.frame : null };
    },
    /** Autopilot an/aus (folgt dem Navi, hält die Spur und das Tempolimit). */
    auto: false,
    /**
     * Wie Autopilot und Sprünge an Gabelungen entscheiden: 'exit' (jede Ausfahrt nehmen), 'stay' (immer auf der
     * Autobahn bleiben, außer an ihrem Ende), null (wie das Navi).
     */
    choose(mode = null) {
      world.choice = mode === 'exit' || mode === 'stay' ? mode : null;
      return world.choice;
    },
    /**
     * Wechseltest: true blendet alles aus, was mit der gezeichneten Autobahn erscheint oder verschwindet (siehe
     * XxlWorld.setMask), false zeigt es wieder. Ein Bild mit und eines ohne Maske an derselben Stelle: jede
     * Abweichung ist ein Stück Autobahn, das man sehen könnte.
     */
    mask(on = true) {
      world.maskAutobahn = !!on;
      return world.maskAutobahn;
    },
    /** Abschnitte voraus als Text. */
    dump(n = 14) {
      const T = world.trip;
      const lines = [];
      const name = (c) => (c.place >= 0 ? places[c.place].name : c.node >= 0 ? nodes[c.node].name : '');
      for (const e of T.paths()) {
        lines.push(`[${e.role}] Weg ${e.path.id} Rahmen ${e.path.frame.id}` + (e.fork ? ` Gabel ${Math.round(e.fork.s)} (${e.fork.taken || T.planFor(e.fork) || '-'})` : ''));
        let k = 0;
        for (const c of e.path.sections) {
          if (c.s1 < T.s - 400 || k++ >= n) continue;
          const f = c.fork ? ` Gabel→${c.fork.forced ? 'Ende' : T.planFor(c.fork) || 'frei'}` : '';
          const m = c.merge ? ' (Einfädeln' + (c.begins ? ', Anfang' : '') + ')' : '';
          const b = c.borderS !== undefined ? ` Grenze ${c.borderFrom}→${c.borderTo} bei ${c.borderS}` : '';
          const sp = c.spotS !== undefined ? ` Ziel ${c.spotS}` : '';
          lines.push(`  ${c.kind.padEnd(5)} ${Math.round(c.s0)}…${Math.round(c.s1)} R${c.frame} ${name(c)}${f}${m}${b}${sp}${T.visible(c, e.path) ? '' : ' (unsichtbar)'}`);
        }
      }
      const v = T.autobahnView();
      lines.push('Autobahn: ' + (v ? `${v.role} R${v.frame} ${v.s0}…${v.s1}` : '–'));
      lines.push('Wald: ' + T.curtains().map((c) => `${Math.round(c.s0)}…${Math.round(c.s1)} ${c.why}`).join(', '));
      lines.push('Ziel: ' + (T.target >= 0 ? places[T.target].name : '–') + ' · s ' + Math.round(T.s) + ' x ' + T.x.toFixed(2));
      return lines.join('\n');
    },
    /** Rahmen einfärben (Asphalt und Bankette je Rahmen): Territorien und Nähte sichtbar machen. */
    colors(on = true) {
      colors = on;
      apply();
      return on;
    },
    info: () => world.info(),
    /**
     * Schilder-Log (COMMON.md 9): alle Tafeln im Sichtbereich, aufsteigend nach s: {kind, s, x, side, frame, texts,
     * built}, dazu d = s − Wagen. Arten siehe signplan.js; die Schilderbrücken der Szenerie stehen als 'tafel' mit
     * side 0 darin. ahead: nur bis so weit voraus.
     */
    signs(ahead = Infinity) {
      const s = world.s;
      return world.signsLog().filter((e) => e.s - s <= ahead).map((e) => ({ ...e, s: Math.round(e.s * 10) / 10, d: Math.round(e.s - s) }));
    },
    /**
     * Brunnenplatz des Navi-Ziels bzw. des eben erreichten Orts als einfache Daten (world.square ohne Abschnitt):
     * {ort, s, x, r, heading, stop, world: {x, y, z, yaw}, brunnen: gebaut?} oder null.
     */
    square() {
      const q = world.square(world.trip.target >= 0 ? null : sqSec);
      if (!q) return null;
      return { ort: places[q.place] ? places[q.place].name : q.place, s: q.s, x: q.x, r: q.r, heading: q.heading, stop: q.stop, world: q.world, brunnen: !!q.object };
    },
    /**
     * Orte aus dem Stadtbaukasten im Sichtbereich als einfache Daten (world.towns.list): {ort, groesse, laenge, d
     * (Ortsbeginn − Wagen), fertig (alle Teile gebaut), brunnen: [{art, titel, u, x, ziel}], ziel, plaetze, wahrzeichen}.
     * Den ganzen Lageplan (Häuser, Gehwege, Plätze) trägt world.town().plan.layout.
     */
    towns() {
      return world.towns.list().map((t) => ({
        ort: t.plan.layout.name, groesse: t.plan.size, laenge: t.plan.len, d: Math.round(t.sec.s0 - world.s), fertig: !t.group.pending,
        brunnen: t.plan.fountains.map((f) => ({ art: f.kind, titel: f.title, u: Math.round(f.u), x: Math.round(f.x * 10) / 10, ziel: f.goal })),
        ziel: t.plan.layout.goal, plaetze: t.plan.layout.squares.length,
        wahrzeichen: t.plan.landmarks.filter((l) => l.placed).map((l) => l.name),
      }));
    },
    /** Die letzten Ereignisse der Welt (Art:Ort), z. B. arrive:Hanau, rest:Hanau. */
    events: [],
    /**
     * Kamera am Brunnenplatz des Ziels (Prüfbilder): pos und look in Koordinaten des Brunnens (Ursprung Mitte am
     * Boden der Insel, +z zum haltenden Wagen), fov in Grad; camSquare(null) schaltet sie ab.
     */
    camSquare(pos = [1.3, 1.2, 6], look = [0, 1.05, 0], fov = 50) {
      if (!pos) {
        M.camHook = null;
        return null;
      }
      const at = (q, v) => {
        const w = q.world;
        const c = Math.cos(w.yaw);
        const s = Math.sin(w.yaw);
        return [w.x + v[0] * c + v[2] * s, w.y + v[1] - 0.14, w.z - v[0] * s + v[2] * c];
      };
      M.camHook = (cam) => {
        const q = world.square(sqSec);
        if (!q || !q.world) return;
        const p = at(q, pos);
        const l = at(q, look);
        cam.position.set(p[0], p[1], p[2]);
        cam.fov = fov;
        if (cam.view) cam.view.enabled = false;
        cam.updateProjectionMatrix();
        cam.lookAt(l[0], l[1], l[2]);
        cam.updateMatrixWorld(true);
      };
      return true;
    },
    world,
  };
  // der Brunnenplatz, den camSquare zeigt: der des Ziels, nach der Ankunft der erreichte
  let sqSec = null;
  world.on((e) => {
    if (e.type === 'arrive' || e.type === 'rest') sqSec = e.sec;
    api.events.push(e.type + (e.place >= 0 ? ':' + places[e.place].name : ''));
    if (api.events.length > 24) api.events.shift();
  });
  // Einfärben: Stücke bekommen je Rahmen eigene Materialien (Kopien mit Farbe), die Road ihre Farbe
  function matFor(base, id) {
    const k = base.uuid + id;
    if (!tint.has(k)) {
      const m = W.basic({ color: FRAME_COLORS[id % FRAME_COLORS.length], transparent: true, opacity: 0.55, depthWrite: false });
      tint.set(k, m);
    }
    return tint.get(k);
  }
  function apply() {
    for (const p of world.pieces.values()) {
      p.group.traverse((o) => {
        if (!o.isMesh) return;
        if (!o.userData.mat) o.userData.mat = o.material;
        const base = o.userData.mat;
        const paint = base === world.mats.asphalt || base === world.mats.grass;
        o.material = colors && paint ? matFor(base, p.frame) : base;
      });
    }
    world.road.roadMat.color.setHex(colors ? FRAME_COLORS[(world.view ? world.view.frame : 0) % FRAME_COLORS.length] : 0xffffff);
  }
  world.afterSync = () => {
    if (colors) apply();
  };
  M.trip = world.trip;
  M.xxl = api;
  world.onReset = () => {
    M.trip = world.trip;
  };
  M.THREE = M.THREE || THREE;
  return api;
}
