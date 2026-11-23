// Orbit-Kamera der Drohne (Abspann): bleibt über der eigenen Fahrbahn – vor Lärmschutzwand, Schildern,
// Schilderbrücken- und Brückenpfeilern und der Mittelleitplanke (auf der Gegenfahrbahn kommen die
// Autos zu schnell). Fahrzeuge, die ihr in den nächsten Sekunden die Sicht auf den Tesla nähmen oder unter ihr
// durchführen (Lkw, Wohnmobil, Transporter, aber auch Autos), umfährt sie: Sie schwenkt rechtzeitig dorthin, wo der
// Blick frei bleibt – hinter oder vor das Auto oder auf die andere Seite – und wartet dort, bis sie vorbei sind.
// Über Fahrzeuge steigt sie nur noch zur Not, statt durch sie hindurchzufliegen.
//
// Hier steht nur die Rechnung (Fahrbahn, Verkehr, Wagen), ohne Szene; main.js (placeDrone) glättet die Bahn und setzt
// die Kamera. Ohne Browser prüfbar: tools/orbit-test.mjs.
import * as THREE from 'three';
import { ROAD } from '../textures.js';
import { clamp, lerp, smoothstep } from '../util.js';

export const ORBIT = {
  r: 8.5, xMin: ROAD.left + 0.25, xMax: ROAD.right + 0.4, yMax: 4.8, clear: 0.9, margin: 0.5, blend: 2.5, lead: 1.4,
  // Sicht: Vorausschau (s) und ihre Schritte; ab „bad“ weicht die Kamera aus, unter „ok“ ist der Blick frei.
  // Ausweichen mit höchstens wEsc (rad/s, die Blickrichtung dreht sich dann gut 30°/s) und Winkelbeschleunigung acc;
  // beim Schwenken schaut sie „ahead“ (rad) voraus
  see: 2.4, seeStep: 0.3, bad: 0.3, ok: 0.12, wEsc: 0.6, acc: 1.4, ahead: 0.21,
  // so lange (s) muss der Blick am Ziel nach der Ankunft frei bleiben (langsame Lkw sind lange im Weg)
  hold: 3.2,
  // so hoch steigt sie, um über Autos zwischen ihr und dem Tesla hinwegzuschauen; Drehrate und Steig-/Sinkrate
  // der Kamera selbst höchstens (rad/s, m/s): der Blick dreht sich nie schneller als etwa 40°/s
  yLow: 3.9, wMax: 0.68, vyMax: 2.2,
};

/**
 * Die Orbit-Kamera um den Wagen im Verkehr traffic.
 *   state          a (Winkel um das Auto), dir, w (Drehrate), esc, plan; phi und dist führt placeDrone (geglättet)
 *   target(p, dt, time, fresh)  Zielpunkt relativ zum Wagen p (game.player); time läuft für das sanfte Auf und Ab,
 *                  fresh = true wählt den Startwinkel neu
 *   lift(pos, p)   Notbremse nach dem Glätten: hebt pos über ein Fahrzeug, in dem sie sonst stünde
 */
export function createOrbitCam(traffic) {
  const orbitPos = new THREE.Vector3();
  // Ist auf einer Seite des Autos zu wenig Platz für den vollen Bogen (rechte Spur, Standstreifen, an der
  // Mittelleitplanke), kehrt die Kamera hinter bzw. vor dem Auto um und schwingt auf der freien Seite hin und
  // her, statt sich dicht neben das Auto zu quetschen (dort wäre es plötzlich anderthalbmal so groß und hochkant
  // angeschnitten). Wechselt das Auto mitten im Bogen auf eine enge Spur, verlässt sie die enge Seite zügig auf dem
  // kürzesten Weg. Sie springt dabei nie quer durchs Bild und dreht den Blick nie schneller als etwa 40°/s.
  const ORBIT_SPEED = 0.16; // rad/s
  // a: Winkel um das Auto (0 = dahinter, π/2 = rechts), w: Drehrate, esc: Ziel beim Ausweichen
  const orbit = { a: 0.9, dir: 1, w: 0, esc: null, plan: 0, phi: 0, dist: ORBIT.r };
  function orbitRoom(p, side) {
    return side > 0 ? ORBIT.xMax - p.x : p.x - ORBIT.xMin;
  }
  function orbitBlocked(p, side, r = ORBIT.r) {
    const room = orbitRoom(p, side);
    return room < r * 0.75 && orbitRoom(p, -side) > room;
  }
  /** Darf die Kamera bei Winkel a stehen? Auf einer engen Seite nur so weit, wie dort Platz ist (schräg hinter/vor dem Auto). */
  function orbitAllowed(p, a, r) {
    const side = Math.sin(a) >= 0 ? 1 : -1;
    return !orbitBlocked(p, side, r) || Math.abs(Math.sin(a)) * r <= orbitRoom(p, side) - 0.3;
  }

  // Prüfpunkte am Tesla (relativ zur Wagenmitte): sieht die Kamera sie, sieht sie den Wagen
  const ORBIT_PTS = [];
  for (const x of [-0.8, 0.8]) for (const y of [0.45, 1.25]) for (const z of [-2.0, 0, 2.0]) ORBIT_PTS.push([x, y, z]);
  /** Schneidet die Strecke a→b den Quader [x0,x1]×[0,y1]×[z0,z1]? */
  function segHitsBox(ax, ay, az, bx, by, bz, x0, x1, y1, z0, z1) {
    const t = [0, 1];
    return slab(t, ax, bx - ax, x0, x1) && slab(t, az, bz - az, z0, z1) && slab(t, ay, by - ay, 0, y1);
  }
  function slab(t, o, d, mn, mx) {
    if (Math.abs(d) < 1e-9) return o >= mn && o <= mx;
    const ta = (mn - o) / d;
    const tb = (mx - o) / d;
    t[0] = Math.max(t[0], Math.min(ta, tb));
    t[1] = Math.min(t[1], Math.max(ta, tb));
    return t[0] <= t[1];
  }
  /**
   * Mindesthöhe der Kamera (cx, cz relativ zum Tesla), damit sie über ein Fahrzeug mit Grundriss [x0,x1]×[z0,z1] und
   * Höhe h hinweg die ihr zugewandte Wagenseite fast ganz sieht (0, wenn es nicht dazwischen ist): Ihr Blick auf diese
   * Seite in 0,5 m Höhe geht 0,15 m über das Dach. u = Weg bis zur hinteren Dachkante, bezogen auf den bis zur Wagenseite.
   */
  function sightLift(cx, cz, x0, x1, z0, z1, h) {
    let t0 = 0;
    let t1 = 1;
    for (const [o, d, mn, mx] of [[cx, -cx, x0, x1], [cz, -cz, z0, z1]]) {
      if (Math.abs(d) < 1e-9) {
        if (o < mn || o > mx) return 0;
        continue;
      }
      const ta = (mn - o) / d;
      const tb = (mx - o) / d;
      t0 = Math.max(t0, Math.min(ta, tb));
      t1 = Math.min(t1, Math.max(ta, tb));
    }
    if (t0 > t1) return 0;
    const tn = 1 - Math.min(0.93 / Math.max(Math.abs(cx), 1e-6), 2.35 / Math.max(Math.abs(cz), 1e-6));
    if (t1 >= tn - 0.03) return Infinity;
    const u = t1 / tn;
    return (h + 0.15 - 0.5 * u) / (1 - u);
  }
  /**
   * Wie sehr Fahrzeuge die Kamera bei Winkel a (Höhe y, Abstand r) in der Zeit tau0 … tau1 (s ab jetzt) stören, 0 … 1:
   * 1 = eines fährt unter oder dicht neben ihr durch (Lkw, Wohnmobil, Transporter; Autos, wenn sie nicht hoch genug
   * darüber ist) oder verdeckt einen großen Teil des Teslas. Über Autos dazwischen schaut sie hinweg, indem sie
   * etwas steigt (bis ORBIT.yLow); Späteres zählt etwas weniger.
   */
  function orbitSight(p, a, y, r, tau0 = 0, tau1 = ORBIT.see) {
    const cx = clamp(p.x + Math.sin(a) * r, ORBIT.xMin, ORBIT.xMax) - p.x;
    const cz = Math.cos(a) * r;
    // nur Fahrzeuge zwischen Kamera und Tesla (seitlich) oder bei der Kamera zählen
    const sx0 = Math.min(cx, -1) - 1.5;
    const sx1 = Math.max(cx, 1) + 1.5;
    let worst = 0;
    for (const c of traffic.cars) {
      const xt = c.change ? ROAD.laneCenter(c.change.to) : c.x;
      const hw = c.w / 2 + 0.15;
      if (Math.max(c.x, xt) - p.x + hw < sx0 || Math.min(c.x, xt) - p.x - hw > sx1) continue;
      const z0 = p.s - c.s;
      const vz = p.speed - c.speed;
      const h = c.v.height;
      const tall = h > 2;
      const zStop = (c.len + p.len) / 2 + 0.4;
      // zwischen zwei Prüfzeitpunkten zurückgelegter Weg zählt mit (schnelle Autos im Abspann, Spurwechsel)
      const hl = c.len / 2 + Math.abs(vz) * ORBIT.seeStep * 0.5;
      const mx = c.change ? 0.5 : 0;
      for (let tau = tau0; tau <= tau1 + 1e-6; tau += ORBIT.seeStep) {
        const wgt = 1 - 0.35 * Math.min(1, tau / ORBIT.see);
        if (wgt <= worst) break;
        const xc = orbitRelX(c, p, tau);
        const xa = xc - mx;
        const xb = xc + mx;
        // wer in der Spur des Teslas fährt, fährt nicht durch ihn hindurch: Er bremst dahinter (oder wechselt die Spur)
        const same = xa - hw < p.w / 2 && xb + hw > -p.w / 2;
        let zc = z0 + vz * tau;
        if (same) zc = z0 >= 0 ? Math.max(zc, zStop) : Math.min(zc, -zStop);
        let za = zc - hl;
        let zb = zc + hl;
        if (same) {
          if (z0 >= 0) za = Math.max(za, zStop - c.len / 2);
          else zb = Math.min(zb, c.len / 2 - zStop);
        }
        if (zb < -r - 2 || za > r + 2) continue;
        let k = 0;
        const ux = Math.max(0, xa - hw - cx, cx - xb - hw);
        const uz = Math.max(0, za - cz, cz - zb);
        if (uz < 1.2) {
          if (ux < (tall ? 1.4 : 0.9)) k = tall || y < h + ORBIT.clear + 0.3 ? 1 : 0.5;
          // auch nicht dicht neben einem Lkw (& Co.): seine Seitenwand füllte das halbe Bild
          else if (tall) k = 1 - smoothstep(1.4, 2.6, ux);
        }
        // über ein Auto dazwischen schaut sie hinweg, indem sie steigt (siehe orbitTarget) – außer es ginge zu hoch
        if (k < 1 && (tall || sightLift(cx, cz, xa - hw, xb + hw, za, zb, h) > ORBIT.yLow)) {
          let n = 0;
          for (const q of ORBIT_PTS) if (segHitsBox(cx, y, cz, q[0], q[1], q[2], xa - hw, xb + hw, h, za, zb)) n++;
          k = Math.max(k, Math.min(1, (n / ORBIT_PTS.length) * 1.6));
        }
        worst = Math.max(worst, k * wgt);
      }
      if (worst >= 1) break;
    }
    return worst;
  }
  /** Wo Fahrzeug c in tau Sekunden quer zum Tesla steht (Spurwechsel der anderen wie geplant) */
  function orbitRelX(c, p, tau) {
    const ch = c.change;
    const x = ch ? lerp(ROAD.laneCenter(ch.from), ROAD.laneCenter(ch.to), smoothstep(0, 1, (ch.t + tau - ch.delay) / ch.dur)) : c.x;
    return x - p.x;
  }
  function orbitCost(p, a, y, r) {
    return orbitAllowed(p, a, r) ? orbitSight(p, a, y, r) : 2;
  }
  /**
   * Nächster Winkel mit freier Sicht, von a aus in beide Richtungen gesucht – ohne über eine enge Seite zu springen.
   * Unterwegs zählt nur, was dort ist, wenn die Kamera vorbeikommt; am Ziel, was ab ihrer Ankunft kommt.
   */
  function orbitEscape(p, a, y, r) {
    const step = 0.08;
    let best = null;
    let bestCost = Infinity;
    let least = a;
    let leastD = Infinity;
    // die eingeschlagene Richtung behält sie, solange die andere nicht deutlich besser ist (sonst pendelt die Wahl
    // hin und her und die Kamera bleibt stehen): Bonus in Sekunden, umso größer, je schneller sie schon schwenkt
    const moving = Math.abs(orbit.w) > 0.05;
    const keepDir = moving ? Math.sign(orbit.w) : orbit.esc !== null ? Math.sign(orbit.esc - a) : 0;
    const keep = 0.4 + 2.5 * Math.abs(orbit.w);
    for (const s of [1, -1]) {
      let path = 0;
      let wasOk = orbitAllowed(p, a, r);
      for (let k = 1; k <= 40; k++) {
        const th = a + s * k * step;
        const ok = orbitAllowed(p, th, r);
        if (!ok && wasOk) break;
        if (ok) wasOk = true;
        const at = orbitArrival(th - a);
        const d = ok ? orbitSight(p, th, y, r, at, at + ORBIT.hold) : 1;
        if (ok && d + at * 0.01 < leastD) {
          leastD = d + at * 0.01;
          least = th;
        }
        if (ok && d <= ORBIT.ok) {
          // etwas Abstand zur Grenze, wenn es dahinter auch noch frei ist
          const th2 = th + s * step;
          const more = orbitAllowed(p, th2, r) && orbitSight(p, th2, y, r, at, at + ORBIT.hold) <= ORBIT.ok;
          // Kosten in Sekunden: Ankunft (Umkehren kostet Bremsweg) und Störung unterwegs
          const c = at + path * 2.5 - (s === keepDir ? keep : 0);
          if (c < bestCost) {
            bestCost = c;
            best = more ? th + s * step * 0.5 : th;
          }
          break;
        }
        path = Math.max(path, ok ? Math.min(1, orbitSight(p, th, y, r, Math.max(0, at - 0.4), at + 0.4)) : 1);
      }
    }
    return best ?? least;
  }
  /** Wann die Kamera um den Winkel d weitergedreht ist (s): erst bremsen, falls sie gerade andersherum dreht */
  function orbitArrival(d) {
    const back = orbit.w * d < 0 ? Math.abs(orbit.w) / ORBIT.acc : 0;
    return back + 0.25 + Math.abs(d) / ORBIT.wEsc;
  }
  /** Startwinkel: hinter dem stehenden Auto (rückt dort gerade einer auf oder fährt einer vorbei, davor oder schräg
   *  daneben) – mit freier Sicht. */
  function orbitStart(p, y, r) {
    const cands = [0, Math.PI, 0.35, -0.35, Math.PI - 0.35, Math.PI + 0.35, 0.9, -0.9, Math.PI - 0.9, Math.PI + 0.9, 1.57, -1.57];
    let best = 0;
    let bestC = Infinity;
    cands.forEach((a, i) => {
      const c = orbitCost(p, a, y, r) + i * 0.004;
      if (c < bestC) {
        bestC = c;
        best = a;
      }
    });
    orbit.a = best;
    orbit.w = 0;
    orbit.esc = null;
    // weiter in Richtung der Seite mit mehr Platz
    const side = orbitRoom(p, 1) >= orbitRoom(p, -1) ? 1 : -1;
    orbit.dir = side * (Math.cos(best) >= 0 ? 1 : -1);
  }
  function orbitTarget(p, dt, time, fresh) {
    const r = ORBIT.r;
    const y0 = 2.4 + Math.sin(time * 0.3) * 0.6;
    if (fresh) orbitStart(p, y0, r);
    else {
      const cost = (a) => orbitCost(p, a, y0, r);
      let want;
      const here = cost(orbit.a);
      if (here > ORBIT.bad || (orbit.esc !== null && here > ORBIT.ok)) {
        // ausweichen: zum nächsten Winkel mit freier Sicht – alle 0,3 s neu geplant (es kommen Fahrzeuge dazu),
        // sofort, wenn es am Ziel bis zur Ankunft selbst eng wird
        orbit.plan -= dt;
        let stale = orbit.esc === null || orbit.plan <= 0;
        if (!stale) {
          const at = orbitArrival(orbit.esc - orbit.a);
          stale = !orbitAllowed(p, orbit.esc, r) || orbitSight(p, orbit.esc, y0, r, at, at + ORBIT.hold) > ORBIT.bad;
        }
        if (stale) {
          orbit.esc = orbitEscape(p, orbit.a, y0, r);
          orbit.plan = 0.3;
        }
        const d = orbit.esc - orbit.a;
        want = Math.sign(d) * Math.min(ORBIT.wEsc, Math.abs(d) * 2.5);
        if (Math.abs(d) > 0.02) orbit.dir = Math.sign(d);
      } else {
        orbit.esc = null;
        want = orbit.dir * ORBIT_SPEED;
        if (cost(orbit.a + orbit.dir * ORBIT.ahead) > ORBIT.bad) {
          // vorne wird es eng (Fahrzeug oder enge Seite): umkehren, wenn es zurück frei ist, sonst hier warten
          if (cost(orbit.a - orbit.dir * ORBIT.ahead) <= ORBIT.ok) {
            orbit.dir = -orbit.dir;
            want = orbit.dir * ORBIT_SPEED;
          } else want = 0;
        }
      }
      orbit.w += clamp(want - orbit.w, -ORBIT.acc * dt, ORBIT.acc * dt);
      orbit.a += orbit.w * dt;
      if (Math.abs(orbit.a) > Math.PI) {
        const turn = Math.sign(orbit.a) * 2 * Math.PI;
        orbit.a -= turn;
        if (orbit.esc !== null) orbit.esc -= turn;
      }
    }
    const a = orbit.a;
    // relativ zur Fahrbahn, nicht zur Fahrzeuglängsachse: beim Spurwechsel dreht sich der Wagen, nicht das ganze Bild
    const t = orbitPos.set(p.x + Math.sin(a) * r, y0, Math.cos(a) * r);
    // seitlich begrenzt (falls das Auto mitten im Bogen die Spur wechselt): dort wird der Bogen flacher und etwas höher
    const over = Math.max(t.x - ORBIT.xMax, ORBIT.xMin - t.x, 0);
    t.x = clamp(t.x, ORBIT.xMin, ORBIT.xMax);
    t.y += over * 0.3;
    const base = t.y;
    for (const c of traffic.cars) {
      const zc = p.s - c.s;
      const h = c.v.height;
      // über Autos zwischen Kamera und Tesla schaut sie hinweg: steigt, bevor sie dazwischen sind
      if (h <= 2) {
        const vz = p.speed - c.speed;
        let lift = 0;
        for (let tau = 0; tau <= 2; tau += 0.4) {
          const z = zc + vz * tau;
          const x = orbitRelX(c, p, tau);
          const need = sightLift(t.x - p.x, t.z, x - c.w / 2 - 0.15, x + c.w / 2 + 0.15, z - c.len / 2, z + c.len / 2, h);
          if (need > 0 && need <= ORBIT.yLow) lift = Math.max(lift, lerp(base, need, 1 - tau / 2.6));
        }
        t.y = Math.max(t.y, lift);
      }
      const need = h + ORBIT.clear;
      if (need <= base) continue;
      // Abstand zum Grundriss (mit Rand) – räumlich und, bei schnellen Autos, zeitlich: Die Kamera steigt
      // etwa 1,4 s bevor eines ankommt und sinkt erst danach wieder, gleich wie schnell es ist (im Abspann
      // steht der Tesla, dann rauscht der Verkehr mit voller Fahrt vorbei)
      const dz = Math.max(0, zc - c.len / 2 - ORBIT.margin - t.z, t.z - (zc + c.len / 2 + ORBIT.margin));
      const dx = Math.max(0, Math.abs(t.x - c.x) - c.w / 2 - ORBIT.margin);
      const near = 1 - smoothstep(0, ORBIT.blend, dx);
      const soon = 1 - smoothstep(0.3, ORBIT.lead, dz / Math.max(1e-3, Math.abs(p.speed - c.speed)));
      const k = Math.max(1 - smoothstep(0, ORBIT.blend, Math.hypot(dx, dz)), near * soon);
      if (k > 0) t.y = Math.max(t.y, lerp(base, need, k));
    }
    // nie steiler als 30° auf den Wagen hinunter (auch nicht, wenn sie seitlich begrenzt näher heranrückt)
    t.y = Math.min(t.y, ORBIT.yMax, 0.9 + Math.hypot(t.x - p.x, t.z) * 0.58);
    return t;
  }

  /** Notbremse nach dem Glätten: nie in einem Fahrzeug (falls die Vorausschau einmal nicht reicht). */
  function liftOverVehicles(pos, p) {
    for (const c of traffic.cars) {
      if (Math.abs(pos.x - c.x) < c.w / 2 + 0.35 && Math.abs(pos.z - (p.s - c.s)) < c.len / 2 + 0.35) {
        pos.y = Math.max(pos.y, Math.min(c.v.height + 0.35, ORBIT.yMax));
      }
    }
  }

  return { state: orbit, target: orbitTarget, lift: liftOverVehicles };
}
