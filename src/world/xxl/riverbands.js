// Flüsse neben der Straße in der XXL-Welt: wo die Karte einen Fluss ein Stück weit neben der Landstraße oder Autobahn
// zeigt (map/riverside.js), läuft er in der Welt neben ihr her – Wasser und Böschungen wie unter den Brücken
// (bridges.js), an beiden Enden ein Viertelbogen weg von der Straße und ein Arm bis in den Dunst. Die Lage legt
// bandplan.js fest (rein rechnerisch, auch für Bewuchs, Szenerie und das Navi).
//
// Jedes Band hängt in der Spur seines Rahmens (frames.js) bei z = −sm (Mitte des geraden Stücks) und hat nur kleine
// Koordinaten. Liegt eine fremde Straße der Welt (ein Abzweig, die verlassene Autobahn, der weitere Weg) im Weg eines
// Arms, endet er vorher an einer Stützstelle (Stirnwand aus Erde, wie an den Brücken); liegt sie auf dem geraden
// Stück oder zwischen ihm und der Straße, bleibt das Band unsichtbar. Der Boden bekommt drei Löcher je Band.
import * as THREE from 'three';
import { W } from '../../curve.js';
import { BRIDGE } from '../../map/crossings.js';
import { riverWater } from '../kit/river.js';
import { meadowTexture, GROUND_Y } from './ground.js';
import { terrainAt } from './bridgeplan.js';
import { bandsOf, centreline, ARM_STATIONS } from './bandplan.js';

export { bandsOf, inBand } from './bandplan.js';

const MUD = [0.5, 0.45, 0.36];
// so viel Abstand hält das Wasser von einer fremden Straße: ihr Bewuchs reicht bis knapp 40 m neben den Asphalt
// (forest.js fieldSide), dazu Luft – kein Baum der fremden Straße steht im Wasser eines Arms
const CLEAR = 46;
// Querschnitt einer fremden Straße in ihrem Rahmen (Landstraße 3 … 11, Autobahn samt Gegenfahrbahn −29 … 11), mit Luft
const FOREIGN = [-31, 14];
const ARC = 12;

/** Höhe im Querschnitt bei D (wie terrainAt an den Brücken, außen unter dem Boden). */
function yOf(b, D) {
  const a = Math.abs(D);
  if (a < b.half) return -b.drop - 0.3;
  if (a > b.hb) return GROUND_Y - 0.12;
  return terrainAt(b, D);
}

function colOf(b, D) {
  const t = Math.min(1, Math.max(0, (Math.abs(D) - b.half) / b.bank));
  const k = t * t;
  return [MUD[0] + (1 - MUD[0]) * k, MUD[1] + (1 - MUD[1]) * k, MUD[2] + (1 - MUD[2]) * k];
}

/** Dreiecke so drehen, dass ihre Normale nach oben (sgn = 1) zeigt. */
function orient(P, I, sgn) {
  for (let t = 0; t < I.length; t += 3) {
    const a = I[t] * 3;
    const b = I[t + 1] * 3;
    const c = I[t + 2] * 3;
    const ny = (P[c] - P[a]) * (P[b + 2] - P[a + 2]) - (P[b] - P[a]) * (P[c + 2] - P[a + 2]);
    if (ny * sgn < 0) [I[t + 1], I[t + 2]] = [I[t + 2], I[t + 1]];
  }
}
function orientTo(P, I, n) {
  for (let t = 0; t < I.length; t += 3) {
    const a = I[t] * 3;
    const b = I[t + 1] * 3;
    const c = I[t + 2] * 3;
    const ux = P[b] - P[a];
    const uy = P[b + 1] - P[a + 1];
    const uz = P[b + 2] - P[a + 2];
    const vx = P[c] - P[a];
    const vy = P[c + 1] - P[a + 1];
    const vz = P[c + 2] - P[a + 2];
    const d = (uy * vz - uz * vy) * n[0] + (uz * vx - ux * vz) * n[1] + (ux * vy - uy * vx) * n[2];
    if (d < 0) [I[t + 1], I[t + 2]] = [I[t + 2], I[t + 1]];
  }
}
function geo(pos, idx, extra) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  for (const [k, v, n] of extra) g.setAttribute(k, new THREE.Float32BufferAttribute(v, n));
  g.setIndex(idx);
  return g;
}

/**
 * Wasser und Böschungen längs der Stützpunkte pts (centreline), im Raum der Gruppe (z = −(s − sm)). ranges: nach
 * jedem Stützpunkt das Ende der Indizes (für die Arme: so weit zeigen). plugs: Stirnwände je Stützpunkt (nur Arme).
 */
function sweep(b, pts, sm, plugs, inward) {
  const P = (p, D, y) => [p.x + p.nx * D, y, -(p.s + p.ns * D - sm)];
  const wp = [];
  const wuv = [];
  const wi = [];
  const mags = [b.hb + 0.9, ...[1, 0.9, 0.75, 0.6, 0.45, 0.3, 0.15, 0].map((t) => b.half + t * b.bank), b.half - 0.5];
  const bp = [];
  const bn = [];
  const bc = [];
  const buv = [];
  const bi = [];
  const pp = [];
  const pn = [];
  const pc = [];
  const puv = [];
  const pi = [];
  const ranges = { water: [0], bank: [0], plug: [0] };
  const m = mags.length;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const w0 = wp.length / 3;
    for (const D of [-b.half - 0.4, b.half + 0.4]) {
      wp.push(...P(p, D, -b.drop));
      wuv.push(p.u, D);
    }
    if (i > 0) {
      const a = w0 - 2;
      wi.push(a, a + 1, w0 + 1, a, w0 + 1, w0);
    }
    ranges.water.push(wi.length);
    const r0 = bp.length / 3;
    for (const sg of [-1, 1]) {
      for (const mg of mags) {
        const D = sg * mg;
        const q = P(p, D, yOf(b, D));
        bp.push(...q);
        bn.push(0, 1, 0);
        bc.push(...colOf(b, D));
        buv.push(q[0] / 7, -q[2] / 7);
      }
    }
    if (i > 0) {
      const prev = r0 - 2 * m;
      for (let s = 0; s < 2; s++) {
        for (let j = 0; j + 1 < m; j++) {
          const a = prev + s * m + j;
          const q = r0 + s * m + j;
          bi.push(a, q, a + 1, a + 1, q, q + 1);
        }
      }
    }
    ranges.bank.push(bi.length);
    if (plugs) {
      // Stirnwand an diesem Stützpunkt, zur Straße hin (inward: Normale zur Straße hin, x, y, z)
      const p0 = pp.length / 3;
      const inner = mags.filter((v) => v <= b.hb + 1e-6);
      const Ds = [...inner.map((v) => -v), ...inner.slice().reverse()];
      for (const D of Ds) {
        for (const y of [yOf(b, D) - 0.05, GROUND_Y]) {
          pp.push(...P(p, D, y));
          pn.push(...inward);
          const k = y > -0.5 ? 0.85 : 0.62;
          pc.push(MUD[0] * k + 0.25, MUD[1] * k + 0.2, MUD[2] * k + 0.12);
          puv.push(D / 7, y / 7);
        }
      }
      for (let j = 0; j + 1 < Ds.length; j++) {
        const a = p0 + j * 2;
        pi.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
      }
    }
    ranges.plug.push(pi.length);
  }
  orient(wp, wi, 1);
  const water = geo(wp, wi, [['uv', wuv, 2]]);
  water.computeVertexNormals();
  orient(bp, bi, 1);
  const bank = geo(bp, bi, [['normal', bn, 3], ['color', bc, 3], ['uv', buv, 2]]);
  bank.computeVertexNormals();
  let plug = null;
  if (plugs) {
    orientTo(pp, pi, inward);
    plug = geo(pp, pi, [['normal', pn, 3], ['color', pc, 3], ['uv', puv, 2]]);
  }
  return { water, bank, plug, ranges };
}

/** Wiese in den äußeren Ecken der Quadrate um die Bögen (Höhe des Bodens), als ein Netz. */
function fillers(b, sm) {
  const pos = [];
  const idx = [];
  const { sg, hb, xc, xC, s0, s1 } = b;
  const corner = (Cs, Qs, vOf) => {
    const q0 = pos.length / 3;
    pos.push(xc - sg * hb, GROUND_Y - 0.01, -(Qs - sm));
    for (let k = 0; k <= ARC; k++) {
      const [vs, vx] = vOf((k / ARC) * (Math.PI / 2));
      pos.push(xC + 2 * hb * vx, GROUND_Y - 0.01, -(Cs + 2 * hb * vs - sm));
    }
    for (let k = 0; k < ARC; k++) idx.push(q0, q0 + 1 + k, q0 + 2 + k);
  };
  corner(s0, s0 - 2 * hb, (t) => [-Math.cos(t), -sg * Math.sin(t)]);
  corner(s1, s1 + 2 * hb, (t) => [Math.sin(t), -sg * Math.cos(t)]);
  orient(pos, idx, 1);
  const n = pos.length / 3;
  const g = geo(pos, idx, [
    ['normal', new Array(n).fill(0).flatMap(() => [0, 1, 0]), 3],
    ['color', new Array(n * 3).fill(1), 3],
    ['uv', pos.flatMap((v, i) => (i % 3 === 0 ? [v / 7] : i % 3 === 2 ? [-v / 7] : [])), 2],
  ]);
  return g;
}

export class RiverBands {
  /**
   * @param {{ core: object }} kit Stadtbaukasten (Wasser)
   * @param {THREE.Material} bankMat Material der Böschungen (das der Brücken)
   */
  constructor(kit, bankMat, plugMat) {
    this.kit = kit;
    this.bankMat = bankMat || W.lambert({ map: meadowTexture(undefined, 57), vertexColors: true });
    this.plugMat = plugMat || this.bankMat;
    this.items = new Map(); // Schlüssel → { key, b, sec, frame, group, arms: [A, B], reach, hidden }
    this.want = new Set();
    this.holes = [];
  }

  begin() {
    this.want.clear();
  }

  /** Die Bänder des Abschnitts sec im Rahmen frame behalten bzw. bauen, soweit sie in [lo, hi] liegen. */
  need(sec, lo, hi, frame = sec.frame) {
    for (const b of bandsOf(sec)) {
      if (b.c1 < lo || b.c0 > hi) continue;
      this.want.add(b.key);
      let it = this.items.get(b.key);
      if (!it) {
        it = this.build(b, sec);
        this.items.set(b.key, it);
      }
      it.sec = sec;
      it.frame = frame;
    }
  }

  sweep() {
    for (const [key, it] of this.items) {
      if (this.want.has(key)) continue;
      this.drop(it);
      this.items.delete(key);
    }
  }

  reset() {
    for (const it of this.items.values()) this.drop(it);
    this.items.clear();
  }

  frames() {
    return [...this.items.values()].map((it) => it.frame);
  }

  build(b, sec) {
    const sm = (b.s0 + b.s1) / 2;
    const group = new THREE.Group();
    group.name = 'Fluss neben der Straße ' + (b.name || '') + ' ' + b.key;
    group.position.z = -sm;
    const C = centreline(b, BRIDGE.reach, BRIDGE.reach, 10, ARC);
    const [ia, ic, ib] = C.parts;
    const water = riverWater(this.kit.core);
    const add = (g, mat) => {
      const m = new THREE.Mesh(g, mat);
      m.receiveShadow = true;
      m.frustumCulled = false;
      g.userData.merged = true;
      group.add(m);
      return m;
    };
    // die Mitte: Ecke A, gerades Stück, Ecke B (dazu je ein Stützpunkt der Arme, damit die Flächen anschließen)
    const core = sweep(b, C.pts.slice(ic - 1, ib + 1), sm, false);
    add(core.water, water);
    add(core.bank, this.bankMat);
    add(fillers(b, sm), this.bankMat);
    // die Arme von innen (xC) nach außen, je mit Stirnwänden
    const arms = [];
    for (const [pts, inward] of [
      [C.pts.slice(ia, ic).reverse(), [-b.sg, 0, 0]],
      [C.pts.slice(ib), [-b.sg, 0, 0]],
    ]) {
      const G = sweep(b, pts, sm, true, inward);
      const arm = { water: add(G.water, water), bank: add(G.bank, this.bankMat), plug: add(G.plug, this.plugMat), ranges: G.ranges, n: -1 };
      arms.push(arm);
    }
    const it = { key: b.key, b, sec, frame: sec.frame, group, arms, sm, reach: [BRIDGE.reach, BRIDGE.reach], hidden: false, holed: false };
    this.setReach(it, ARM_STATIONS.length - 1, ARM_STATIONS.length - 1);
    return it;
  }

  drop(it) {
    if (it.group.parent) it.group.parent.remove(it.group);
    it.group.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
    });
  }

  /** In die Spuren ihrer Rahmen hängen (nach FramePool.acquire). */
  attach(frames) {
    for (const it of this.items.values()) {
      const fv = frames.get(it.frame);
      if (fv && it.group.parent !== fv.track) fv.track.add(it.group);
    }
  }

  /** Arme bis zur Stützstelle nA bzw. nB zeigen (Index in ARM_STATIONS), dort die Stirnwand. */
  setReach(it, nA, nB) {
    it.arms.forEach((a, k) => {
      const n = k ? nB : nA;
      if (a.n === n) return;
      a.n = n;
      a.water.geometry.setDrawRange(0, a.ranges.water[n + 1]);
      a.bank.geometry.setDrawRange(0, a.ranges.bank[n + 1]);
      const r = a.ranges.plug;
      a.plug.visible = n < ARM_STATIONS.length - 1;
      a.plug.geometry.setDrawRange(r[n], r[n + 1] - r[n]);
    });
    it.reach = [ARM_STATIONS[nA], ARM_STATIONS[nB]];
  }

  /**
   * Einmal je Bild: s Ort des Wagens, shear Scherungen der Rahmen, roads die Straßen der Welt [{ frame, s0, s1 }].
   * Kürzt die Arme vor fremden Straßen, blendet Bänder mit einer fremden Straße am geraden Stück aus und sammelt die
   * Löcher für den Boden (holes: [{ x, z, tx, tz, half, skew, r0, r1, d, it }] im Raum vor der Krümmung).
   */
  update(s, shear, roads) {
    const holes = (this.holes = []);
    for (const it of this.items.values()) {
      const sh = shear.get(it.frame);
      const b = it.b;
      let hide = !sh;
      const lim = [BRIDGE.reach, BRIDGE.reach];
      if (sh) {
        // äußerste Lage (Abstand vom Asphaltrand nach außen) des geraden Stücks
        const farO = b.sg * (b.xc - b.road) + b.hb;
        for (const r of roads) {
          if (r.frame === it.frame) continue;
          const o = shear.get(r.frame);
          if (!o) continue;
          const da = o.a - sh.a;
          const db = o.b - sh.b;
          // Lage der fremden Straße (ihre Achse, Rahmen x = 0 … 12) im eigenen Rahmen: x = xf + da + db·d
          const seg = (sa, sb) => {
            const d0 = Math.max(r.s0, sa) - s;
            const d1 = Math.min(r.s1, sb) - s;
            if (d0 > d1) return null;
            const xa = da + db * d0;
            const xb = da + db * d1;
            // als Abstand vom Asphaltrand nach außen
            const lo = Math.min(xa, xb) + FOREIGN[0] - b.road;
            const hi = Math.max(xa, xb) + FOREIGN[1] - b.road;
            return b.sg > 0 ? [lo, hi] : [-hi, -lo];
          };
          // längs nur das Band selbst (CLEAR gilt quer): eine Ausfahrt hinter dem Ende des Abschnitts stört nicht
          const mid = seg(b.c0, b.c1);
          if (mid && mid[1] > 0 && mid[0] < farO + CLEAR) {
            hide = true;
            break;
          }
          const arms = [
            [b.s0 - 2 * b.hb - CLEAR, b.s0 + CLEAR],
            [b.s1 - CLEAR, b.s1 + 2 * b.hb + CLEAR],
          ];
          arms.forEach(([sa, sb], k) => {
            const q = seg(sa, sb);
            if (q && q[1] > farO) lim[k] = Math.min(lim[k], q[0] - farO - CLEAR);
          });
        }
      }
      const nOf = (m) => {
        let n = 0;
        for (let i = 1; i < ARM_STATIONS.length; i++) if (ARM_STATIONS[i] <= m) n = i;
        return n;
      };
      // eine fremde Straße schon an der Ecke: das Band bleibt unsichtbar; sonst endet der Arm an der Stützstelle davor
      if (lim[0] < 0 || lim[1] < 0) hide = true;
      const nA = nOf(lim[0]);
      const nB = nOf(lim[1]);
      it.hidden = hide;
      it.group.visible = !hide;
      it.holed = false;
      if (hide) continue;
      this.setReach(it, nA, nB);
      // Löcher im Boden: Rechtecke im Raum vor der Krümmung (Rahmen: x + a + b·d, z = −d)
      const cam = (x, so) => {
        const d = so - s;
        return [x + sh.a + sh.b * d, -d];
      };
      const rect = (P0, P1, E, r0, r1) => {
        const [ax, az] = cam(...P0);
        const [px, pz] = cam(...P1);
        const [ex, ez] = cam(...E);
        const tl = Math.hypot(px - ax, pz - az);
        const tx = (px - ax) / tl;
        const tz = (pz - az) / tl;
        const ul = (ex - ax) * tx + (ez - az) * tz;
        const uq = (ex - ax) * -tz + (ez - az) * tx;
        const k = tl / 100;
        return { x: ax, z: az, tx, tz, half: Math.abs(uq), skew: ul / uq, r0: r0 * k, r1: r1 * k };
      };
      const { sg, hb, xc, xC, s0, s1 } = b;
      const sm = it.sm;
      const d = b.c1 < s - 20 ? 1e5 + s - b.c1 : Math.max(b.c0 - s, 0);
      const list = [
        rect([xc, sm], [xc, sm + 100], [xc + hb, sm], -(sm - (s0 - 2 * hb)), s1 + 2 * hb - sm),
        rect([xC, s0 - hb], [xC + sg * 100, s0 - hb], [xC, s0], -hb, it.reach[0]),
        rect([xC, s1 + hb], [xC + sg * 100, s1 + hb], [xC, s1 + 2 * hb], -hb, it.reach[1]),
      ];
      for (const h of list) holes.push({ ...h, d, it });
    }
    holes.sort((p, q) => p.d - q.d);
  }

  /** Nach der Vergabe der Löcher (world.js mergeHoles): zu sehen ist nur ein Band mit allen seinen Löchern. */
  showHoled() {
    for (const it of this.items.values()) if (!it.hidden) it.group.visible = it.holed;
  }

  /** Wie weit die Arme des Bands key gerade reichen ([A, B], Meter ab xC), null = nicht zu sehen. */
  reachOf(key) {
    const it = this.items.get(key);
    return it && !it.hidden && it.holed && it.group.parent ? it.reach : null;
  }

  /** Die Bänder eines Rahmens als Hindernisse für Bewuchs und Szenerie. */
  inFrame(frame) {
    const out = [];
    for (const it of this.items.values()) if (it.frame === frame) out.push(it.b);
    return out;
  }
}
