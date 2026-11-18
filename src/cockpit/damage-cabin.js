// Schaden vom Fahrerplatz aus (Cockpit-Szene, ohne Weltkrümmung). Am letzten Karosserie-Punkt springt die
// Fronthaube (beim Model 3 hinten an der Scheibe angeschlagen) vorn einen Spalt auf: ihre Kuppe hebt sich mit einem
// kleinen Plopp über die gewohnte Linie und zittert leise im Fahrtwind. Hinter der Kuppe steigen ein paar zarte
// Dampfwölkchen auf, flach über der Haube und unterhalb jedes Verkehrs. Ab und zu ruckelt der Wagen ein klein wenig,
// als wäre er müde.
//
// Der Deckel folgt genau der Außenhaut (bodyPoint aus tesla.js) und liegt 4,5 mm darüber: Zeigt das Cockpit selbst
// eine Motorhaube, deckt er sie im Ruhezustand deckungsgleich ab und löst sich erst beim Aufspringen von ihr.
import * as THREE from 'three';
import { SteamWisps, ImpactPuff } from '../models/damage-fx.js';
import { smoothstep } from '../util.js';

// Frunk-Deckel: von knapp hinter der Nase bis unter den Windlauf, quer bis zu den Fugen an den Kotflügeln
const U_FRONT = 0.06;
const U_HINGE = 1.4;
const HALF = 0.456; // halber Winkel des Querschnitts um die Mitte (Fuge ≈ 0,62 m neben der Wagenmitte)
const LIFT = 0.0045;
const SKIRT = 0.014; // Falz an Seiten und Vorderkante
const OPEN = 0.085; // rad: vorn ≈ 11 cm Spalt – vom Fahrerplatz sieht man sonst nur einen Strich über dem Armaturenbrett

/** Deckel als Fläche mit Falz, Ursprung im Scharnier; Farbe zur Scheibe hin dunkler (Schatten von Windlauf und Wischern). */
function lidGeometry(bodyPoint, hinge) {
  const NU = 22;
  const NP = 16;
  const pos = [];
  const col = [];
  const idx = [];
  const p = new THREE.Vector3();
  const push = (x, y, z) => {
    pos.push(x - hinge.x, y - hinge.y, z - hinge.z);
    const k = 0.6 + 0.4 * smoothstep(-0.9, -1.3, z);
    col.push(k, k, k);
    return pos.length / 3 - 1;
  };
  const grid = [];
  for (let i = 0; i <= NU; i++) {
    // vorn (Kuppe, starke Wölbung) dichter
    const u = U_FRONT + (U_HINGE - U_FRONT) * (i / NU) ** 1.4;
    const row = [];
    for (let j = 0; j <= NP; j++) {
      bodyPoint(u, Math.PI / 2 - HALF + (2 * HALF * j) / NP, p);
      row.push([p.x, p.y + LIFT, p.z]);
    }
    grid.push(row);
  }
  const top = grid.map((row) => row.map(([x, y, z]) => push(x, y, z)));
  for (let i = 0; i < NU; i++) {
    for (let j = 0; j < NP; j++) {
      const a = top[i][j];
      const b = top[i][j + 1];
      const c = top[i + 1][j + 1];
      const d = top[i + 1][j];
      idx.push(a, b, c, a, c, d);
    }
  }
  // Falz: eigene Punkte (harte Kante), nach unten; flip dreht die Fläche nach außen (links und vorn)
  const strip = (edge, flip) => {
    const hi = edge.map(([x, y, z]) => push(x, y, z));
    const lo = edge.map(([x, y, z]) => push(x, y - SKIRT, z));
    for (let k = 0; k < edge.length - 1; k++) {
      if (flip) idx.push(hi[k], lo[k + 1], hi[k + 1], hi[k], lo[k], lo[k + 1]);
      else idx.push(hi[k], hi[k + 1], lo[k + 1], hi[k], lo[k + 1], lo[k]);
    }
  };
  strip(grid.map((row) => row[0]), false);
  strip(grid.map((row) => row[NP]), true);
  strip(grid[0], true);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

export class CabinDamage {
  /**
   * @param {import('./cockpit.js').Cockpit} cockpit
   * @param {{bodyPoint:Function}} hooks Außenhaut des Wagens (tesla.damageHooks)
   */
  constructor(cockpit, hooks) {
    this.cockpit = cockpit;
    const hinge = hooks.bodyPoint(U_HINGE, Math.PI / 2, new THREE.Vector3());
    hinge.y += LIFT;
    this.lid = new THREE.Group();
    this.lid.position.copy(hinge);
    // derselbe schwarze Lack wie die Motorhaube im Cockpit: fast streifend gesehen, spiegelt den Himmel nur gedämpft
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x0a0b0d, vertexColors: true, metalness: 0.3, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 0.42,
    });
    this.lid.add(new THREE.Mesh(lidGeometry(hooks.bodyPoint, hinge), mat));
    this.lid.visible = false;
    cockpit.root.add(this.lid);
    // hinter der Kuppe hervor; der Fahrtwind drückt den Dampf flach, er bleibt unter dem Verkehr
    const front = hooks.bodyPoint(0.16, Math.PI / 2, new THREE.Vector3());
    this.steam = new SteamWisps({
      count: 14, size: 0.26, origin: new THREE.Vector3(0, front.y - 0.02, front.z), spread: 0.9, rise: 0.31, opacity: 0.62, drift: 0.08, curved: false,
    });
    cockpit.root.add(this.steam.points);
    // Rempler vorn oder seitlich: Staubwölkchen vor der Haube bzw. an der vorderen Ecke (hinten sieht man nichts)
    // größer und etwas grauer als draußen: vom Sitz aus steht es vor hellem Himmel und grauer Straße
    this.puff = new ImpactPuff(12, 0.7, false, 0.8, [0.8, 0.79, 0.77]);
    cockpit.root.add(this.puff.points);
    this.nose = hooks.bodyPoint(0.05, Math.PI / 2, new THREE.Vector3());
    this.hitsSeen = 0;
    this.dSeen = null;
    this.open = 0;
    this.vel = 0;
    this.next = 2;
    this.kick = 0;
  }

  /**
   * Jedes Bild. d: Schadens-Zustand des Wagens. Gibt zurück, ob der letzte Punkt erreicht ist.
   * @param {import('../game/damage.js').Damage} d
   */
  update(dt, t, d, speed, inCabin) {
    const last = !!d && d.left === 1 && d.hits > 0;
    if (d) {
      if (d === this.dSeen && d.hits > this.hitsSeen) {
        const z = d.log[d.log.length - 1];
        const n = this.nose;
        if (z === 'front') this.puff.burst([0, n.y + 0.2, n.z - 0.1], [0, 0.6, -1], 0.8);
        else if (z === 'left' || z === 'right') {
          const s = z === 'left' ? -1 : 1;
          this.puff.burst([s * 0.95, n.y + 0.3, n.z + 0.9], [s, 0.9, -0.2], 0.35);
        }
      }
      this.dSeen = d;
      this.hitsSeen = d.hits;
    }
    this.puff.update(dt);
    this.steam.update(dt, t, last ? 1 : 0, speed);
    // Deckel: wenig gedämpfte Feder (springt mit einem Plopp auf); beim Schließen schlägt er sanft ins Schloss
    const h = Math.min(dt, 0.05);
    this.vel += ((last ? OPEN : 0) - this.open) * 90 * h - this.vel * 6.5 * h;
    this.open += this.vel * h;
    if (this.open < 0) {
      this.open = 0;
      this.vel = 0;
    }
    this.kick = Math.max(0, this.kick - dt * 2.5);
    this.lid.visible = last || this.open > 1e-4;
    if (this.lid.visible) {
      // Zittern im Fahrtwind, beim Ruckeln etwas mehr; bleibt immer über der geschlossenen Lage
      const v = Math.min(1, speed / 30);
      const shiver = (Math.sin(t * 41) * 0.6 + Math.sin(t * 27.3) * 0.4) * (0.0012 + 0.0028 * v) + Math.sin(t * 63) * this.kick * 0.006;
      this.lid.rotation.x = this.open + shiver * (this.open / OPEN);
    }
    if (!last || !inCabin) {
      this.next = Math.max(this.next, t + 1.5);
      return last;
    }
    // kleines Ruckeln alle 3 bis 5 Sekunden (gleichmäßig gestreut, ohne Math.random)
    if (t >= this.next) {
      this.cockpit.shake = Math.max(this.cockpit.shake, 0.14);
      this.kick = 1;
      this.next = t + 3 + 2 * (Math.abs(Math.sin(t * 12.9898) * 43758.5453) % 1);
    }
    return last;
  }
}
