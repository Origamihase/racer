// Landschaft entlang der Autobahn: Wälder, Felder, Dörfer, Windräder, Brücken mit Fan-Bannern,
// Schilderbrücken mit dem aktuellen Navi-Ziel, Kilometerschilder, braune Touristik-Tafeln
// und besondere Orte (Brunnen für BrunnenTV, Elsa, Burgen, Sparkasse, Skyline …).
// Die Welt ist in 100-m-Segmente geteilt, die vor dem Spieler neu gebaut werden.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { W } from '../curve.js';
import { ROAD, signTexture, brownSignTexture, speedSignTexture, roundRect } from '../textures.js';
import { colorize } from '../models/loft.js';
import { buildElsa, animateElsa } from '../models/elsa.js';
import { mulberry32, fbm1, smoothstep, pick } from '../util.js';
import { MEDIAN_X } from './road.js';

export const SEG = 100;
const AHEAD = 17;
const BEHIND = 2;
const NSLOTS = AHEAD + BEHIND + 1;

const BANNERS = [
  'Grüße an Mini Adam!', 'Linke Spur freischalten: jetzt!', 'BrunnenTV Fanclub', 'Malte Malte Malte', 'Elsa ❤',
  'Ehrenmenschen-Brücke', 'Rechts fahren, Adam!', 'Wir streamen in Full HD', 'Live-Eskalationen immer woanders',
  'Ringtennis-Verein grüßt', 'Danke für alles ❤', 'Bimmel hurra!', 'Kanalpunkte-Wette läuft',
];
const BROWN = [
  ['Burg Hauneck', 'Haunetal'], ['Wartburg', 'Eisenach'], ['Weser-Skywalk', 'Beverungen'], ['Burg Ronneburg', 'Ronneburg'],
  ['Elsa', 'Kassel grüßt'], ['Hochofenwerk Phoenix West', 'Dortmund'], ['BrunnenTV-Studio', 'Herr Schönnbrun'],
  ['Megahub', 'Lehrte'], ['Rhön', 'Starlink-Gebiet'], ['Zissel', 'Kassel'], ['Skyline', 'Frankfurt am Main'],
];
const PLACES = ['Kassel', 'Fulda', 'Frankfurt', 'Gifhorn', 'Hannover', 'Würzburg', 'Göttingen', 'Hamburg', 'Hanau', 'Siegen', 'Erlensee', 'Eisenach', 'Bad Hersfeld', 'Dortmund'];

// ---------------------------------------------------------------------------
// Geometrien für Instanzen
function coniferGeo() {
  const parts = [];
  const trunk = new THREE.CylinderGeometry(0.16, 0.24, 2.4, 6);
  trunk.translate(0, 1.2, 0);
  parts.push(colorize(trunk, 0x4a3324));
  const layers = [[2.5, 4.0, 1.5], [2.05, 3.5, 3.4], [1.55, 3.0, 5.2], [1.0, 2.5, 6.8]];
  for (const [r, h, y] of layers) {
    const c = new THREE.ConeGeometry(r, h, 8);
    c.translate(0, y + h / 2, 0);
    parts.push(colorize(c, 0x2d5530));
  }
  return mergeGeometries(parts);
}
function decidGeo() {
  const parts = [];
  const trunk = new THREE.CylinderGeometry(0.2, 0.3, 3.2, 6).toNonIndexed();
  trunk.translate(0, 1.6, 0);
  parts.push(colorize(trunk, 0x5a4030));
  const blobs = [[0, 5.0, 0, 2.6], [1.3, 4.3, 0.6, 1.9], [-1.2, 4.5, -0.5, 2.0], [0.2, 6.3, 0.3, 1.7]];
  for (const [x, y, z, r] of blobs) {
    const b = new THREE.IcosahedronGeometry(r, 1);
    b.translate(x, y, z);
    parts.push(colorize(b, 0x4c7a34));
  }
  return mergeGeometries(parts);
}
function bushGeo() {
  const parts = [];
  for (const [x, y, z, r] of [[0, 0.7, 0, 1.0], [0.8, 0.55, 0.3, 0.75], [-0.7, 0.5, -0.2, 0.7]]) {
    const b = new THREE.IcosahedronGeometry(r, 1);
    b.translate(x, y, z);
    parts.push(colorize(b, 0x557f37));
  }
  return mergeGeometries(parts);
}
function houseGeo() {
  const g = new THREE.BoxGeometry(1, 1, 1);
  g.translate(0, 0.5, 0);
  // Fenster als dunkle Vertex-Farbe? Einfach: einfarbig, Variation über Instanzfarben
  return colorize(g, 0xffffff);
}
function roofGeo() {
  const p = [];
  const h = 0.62;
  const quad = (a, b, c, d) => p.push(...a, ...b, ...c, ...a, ...c, ...d);
  const tri = (a, b, c) => p.push(...a, ...b, ...c);
  const e = 0.06;
  const A = [-0.5 - e, 1, -0.5 - e];
  const B = [0.5 + e, 1, -0.5 - e];
  const C = [0.5 + e, 1, 0.5 + e];
  const D = [-0.5 - e, 1, 0.5 + e];
  const R1 = [0, 1 + h, -0.5 - e];
  const R2 = [0, 1 + h, 0.5 + e];
  quad(C, B, R1, R2);
  quad(A, D, R2, R1);
  tri(D, C, R2);
  tri(B, A, R1);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  g.computeVertexNormals();
  const n = p.length / 3;
  g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(n * 2), 2));
  return colorize(g, 0xffffff);
}

const TREE_TINTS = [0xffffff, 0xe0f0e0, 0xc8e0c8, 0xf0ffe0, 0xd0e8d8, 0xfff4dc];
const HOUSE_COLORS = [0xf1ece0, 0xe9e2cf, 0xf6f3ea, 0xe5d9b8, 0xd9d4cc, 0xefe0c9, 0xdcd2c0];
const ROOF_COLORS = [0xa3402a, 0x8b3a26, 0x5b3b2e, 0x3a3c40, 0xb5522e, 0x6b2a20];

// ---------------------------------------------------------------------------
export class Scenery {
  constructor(scene) {
    this.track = new THREE.Group();
    this.track.name = 'Scenery';
    scene.add(this.track);
    this.slots = Array.from({ length: NSLOTS }, () => ({ k: -1, items: [] }));
    this.requests = [];
    this.pools = new Map();
    this.animated = new Set();
    this.texCache = new Map();
    this.gantryInfo = () => ({ target: 'Kassel', km: 42 });
    this.time = 0;
    this.mats = {
      concrete: W.std({ color: 0xbdb9ae, roughness: 0.92 }),
      concreteDark: W.std({ color: 0x8f8c84, roughness: 0.95 }),
      steel: W.std({ color: 0x9aa1a8, metalness: 0.7, roughness: 0.4 }),
      dark: W.std({ color: 0x2a2b2e, roughness: 0.7 }),
      white: W.std({ color: 0xf2f2ef, roughness: 0.6 }),
      orange: W.std({ color: 0xe86b12, roughness: 0.6 }),
      grass: W.lambert({ color: 0x5f8a3a }),
      stone: W.std({ color: 0xa79e8e, roughness: 0.95 }),
      water: W.std({ color: 0x9ccfff, roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.55, envMapIntensity: 1.5 }),
      redRoof: W.std({ color: 0xa3402a, roughness: 0.8 }),
      glassBlue: W.std({ color: 0x5f7fa3, metalness: 0.8, roughness: 0.15, envMapIntensity: 1.2 }),
    };
    this.makeInstanced();
  }

  makeInstanced() {
    const mat = W.lambert({ vertexColors: true });
    const defs = {
      conifer: [coniferGeo(), 90],
      decid: [decidGeo(), 60],
      bush: [bushGeo(), 50],
      house: [houseGeo(), 34],
      roof: [roofGeo(), 34],
    };
    this.inst = {};
    const zero = new THREE.Matrix4().makeScale(0, 0, 0);
    for (const [name, [geo, cap]] of Object.entries(defs)) {
      const m = name === 'house' ? W.lambert({ vertexColors: true }) : mat;
      const mesh = new THREE.InstancedMesh(geo, m, cap * NSLOTS);
      mesh.frustumCulled = false;
      mesh.castShadow = true;
      mesh.receiveShadow = name === 'house' || name === 'roof';
      for (let i = 0; i < cap * NSLOTS; i++) {
        mesh.setMatrixAt(i, zero);
        mesh.setColorAt(i, new THREE.Color(1, 1, 1));
      }
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      this.track.add(mesh);
      this.inst[name] = { mesh, cap };
    }
  }

  // --- Pools -------------------------------------------------------------
  acquire(type, factory) {
    if (!this.pools.has(type)) this.pools.set(type, []);
    const pool = this.pools.get(type);
    let obj = pool.find((o) => !o.userData.active);
    if (!obj) {
      obj = factory();
      obj.userData.type = type;
      pool.push(obj);
      this.track.add(obj);
    }
    obj.userData.active = true;
    obj.visible = true;
    return obj;
  }

  release(obj) {
    obj.userData.active = false;
    obj.visible = false;
    this.animated.delete(obj);
    if (obj.userData.onRelease) obj.userData.onRelease();
  }

  /** Besonderen Ort bei Strecke s einplanen. Gibt eine ID zum Abbrechen zurück. */
  request(type, s, data = {}) {
    const id = Math.random().toString(36).slice(2);
    const r = { id, type, s, data, built: false };
    this.requests.push(r);
    // Falls das Segment schon steht: sofort einsetzen
    const k = Math.floor(s / SEG);
    const slot = this.slots[((k % NSLOTS) + NSLOTS) % NSLOTS];
    if (slot.k === k) this.placeRequest(slot, r);
    return id;
  }

  cancel(id) {
    const r = this.requests.find((q) => q.id === id);
    if (r && !r.built) this.requests = this.requests.filter((q) => q !== r);
  }

  /** Alles abbauen (neue Fahrt beginnt wieder bei 0 km). */
  reset() {
    for (const slot of this.slots) {
      for (const it of slot.items) this.release(it);
      slot.items = [];
      slot.k = -1;
    }
    this.requests = [];
  }

  // --- Segment-Aufbau ------------------------------------------------------
  update(s, dt) {
    this.time += dt;
    this.track.position.z = s;
    const kNow = Math.floor(s / SEG);
    for (let k = kNow - BEHIND; k <= kNow + AHEAD; k++) {
      if (k < 0) continue;
      const slotIdx = ((k % NSLOTS) + NSLOTS) % NSLOTS;
      const slot = this.slots[slotIdx];
      if (slot.k !== k) this.buildSlot(slotIdx, k);
    }
    for (const obj of this.animated) {
      const a = obj.userData.animate;
      if (a) a(this.time, dt);
    }
    // alte Anfragen aufräumen
    if (this.requests.length > 40) this.requests = this.requests.filter((r) => r.s > s - 500);
  }

  buildSlot(slotIdx, k) {
    const slot = this.slots[slotIdx];
    for (const it of slot.items) this.release(it);
    slot.items = [];
    slot.k = k;
    const rnd = mulberry32(k * 7919 + 17);
    const s0 = k * SEG;
    const z0 = -s0;
    const counts = { conifer: 0, decid: 0, bush: 0, house: 0, roof: 0 };
    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const v = new THREE.Vector3();
    const sc = new THREE.Vector3();
    const col = new THREE.Color();
    const up = new THREE.Vector3(0, 1, 0);
    const put = (name, x, y, z, scale, rotY, color, sx, sy, sz) => {
      const def = this.inst[name];
      const n = counts[name];
      if (n >= def.cap) return false;
      counts[name]++;
      q.setFromAxisAngle(up, rotY);
      sc.set(sx ?? scale, sy ?? scale, sz ?? scale);
      m4.compose(v.set(x, y, z), q, sc);
      const i = slotIdx * def.cap + n;
      def.mesh.setMatrixAt(i, m4);
      def.mesh.setColorAt(i, col.setHex(color));
      return true;
    };

    // Charakter des Abschnitts
    const village = this.villageSide(k);
    const nearVillage = this.villageSide(k - 1) || this.villageSide(k + 1);
    for (const side of [1, -1]) {
      const seed = side > 0 ? 11 : 23;
      const forest = smoothstep(0.05, 0.38, fbm1(k / 9, seed));
      const xMin = side > 0 ? 17 : 34;
      if (village === side) continue;
      // Wald
      const nForest = Math.floor(forest * 46);
      for (let i = 0; i < nForest; i++) {
        const x = side * (xMin + 4 + Math.pow(rnd(), 0.7) * 120);
        const z = z0 - rnd() * SEG;
        const s = 0.75 + rnd() * 0.65;
        if (rnd() < 0.62) put('conifer', x, 0, z, s, rnd() * 6, TREE_TINTS[Math.floor(rnd() * TREE_TINTS.length)]);
        else put('decid', x, 0, z, s, rnd() * 6, TREE_TINTS[Math.floor(rnd() * TREE_TINTS.length)]);
      }
      // Straßenbegleitgrün
      const nNear = 3 + Math.floor(rnd() * 6);
      for (let i = 0; i < nNear; i++) {
        const x = side * (xMin - 1 + rnd() * 10);
        const z = z0 - rnd() * SEG;
        if (rnd() < 0.55) put('bush', x, 0, z, 0.7 + rnd() * 0.9, rnd() * 6, 0xffffff);
        else put('decid', x, 0, z, 0.55 + rnd() * 0.5, rnd() * 6, 0xffffff);
      }
      // einzelne Bäume in den Feldern
      if (forest < 0.3) {
        const nF = Math.floor(rnd() * 5);
        for (let i = 0; i < nF; i++) {
          put('decid', side * (60 + rnd() * 380), 0, z0 - rnd() * SEG, 0.9 + rnd() * 0.8, rnd() * 6, 0xffffff);
        }
        if (rnd() < 0.22) {
          const tb = this.acquire('turbine', () => this.makeTurbine());
          tb.position.set(side * (180 + rnd() * 520), 0, z0 - rnd() * SEG);
          tb.rotation.y = (rnd() - 0.5) * 0.6;
          tb.userData.phase = rnd() * 6;
          this.animated.add(tb);
          slot.items.push(tb);
        }
      }
    }

    // Dorf
    if (village) {
      const side = village;
      const n = 14 + Math.floor(rnd() * 14);
      for (let i = 0; i < n; i++) {
        const x = side * (42 + rnd() * 150);
        const z = z0 - rnd() * SEG;
        const w = 8 + rnd() * 5;
        const d = 9 + rnd() * 6;
        const h = 5 + rnd() * 3.5;
        const r = (rnd() < 0.5 ? 0 : Math.PI / 2) + (rnd() - 0.5) * 0.3;
        put('house', x, 0, z, 1, r, pick(HOUSE_COLORS), w, h, d);
        put('roof', x, 0, z, 1, r, pick(ROOF_COLORS), w, h, d);
      }
      if (rnd() < 0.8) {
        const ch = this.acquire('church', () => this.makeChurch());
        ch.position.set(side * (70 + rnd() * 60), 0, z0 - 50);
        ch.rotation.y = rnd() * 0.5;
        slot.items.push(ch);
      }
      for (let i = 0; i < 8; i++) put('decid', side * (40 + rnd() * 160), 0, z0 - rnd() * SEG, 0.7 + rnd() * 0.5, rnd() * 6, 0xffffff);
    }
    // Lärmschutzwand am Dorf
    if ((village === 1 || nearVillage === 1) && k > 2) {
      const wall = this.acquire('noisewall', () => this.makeNoiseWall());
      wall.position.set(ROAD.right + 2.1, 0, z0 - SEG / 2);
      slot.items.push(wall);
    }

    // Kilometerschild (alle 500 m)
    if (k % 5 === 0 && k > 0) {
      const sign = this.makeKmSign((s0 / 1000).toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }));
      sign.position.set(ROAD.right + 1.2, 0, z0);
      slot.items.push(sign);
    }
    // Notrufsäule
    if (k % 20 === 10) {
      const n = this.acquire('notruf', () => this.makeNotruf());
      n.position.set(ROAD.right + 1.4, 0, z0 - 30);
      slot.items.push(n);
    }
    // Schilderbrücke mit Navi-Ziel
    if (k % 13 === 7) {
      const g = this.acquire('gantry', () => this.makeGantry());
      this.labelGantry(g, rnd);
      g.position.set(0, 0, z0 - 50);
      slot.items.push(g);
    } else if (k % 23 === 15) {
      const b = this.acquire('bridge', () => this.makeBridge());
      this.labelBridge(b, rnd);
      b.position.set(0, 0, z0 - 50);
      slot.items.push(b);
    } else if (k % 17 === 3) {
      const [title, sub] = BROWN[Math.floor(rnd() * BROWN.length)];
      const b = this.acquire('brown', () => this.makeBrownSign());
      b.userData.setText(title, sub);
      b.position.set(ROAD.right + 3.4, 0, z0 - 40);
      slot.items.push(b);
    } else if (k % 29 === 11) {
      const b = this.acquire('blueinfo', () => this.makeBlueInfo());
      b.userData.setText(rnd() < 0.5 ? ['Rastplatz', 'Schäferborn  2 km'] : ['Raststätte', 'Bananensaft  1500 m']);
      b.position.set(ROAD.right + 3.4, 0, z0 - 40);
      slot.items.push(b);
    }

    // Angefragte Orte
    for (const r of this.requests) {
      if (!r.built && r.s >= s0 && r.s < s0 + SEG) this.placeRequest(slot, r);
    }

    for (const name of Object.keys(this.inst)) {
      const def = this.inst[name];
      const zero = new THREE.Matrix4().makeScale(0, 0, 0);
      for (let n = counts[name]; n < def.cap; n++) def.mesh.setMatrixAt(slotIdx * def.cap + n, zero);
      def.mesh.instanceMatrix.needsUpdate = true;
      if (def.mesh.instanceColor) def.mesh.instanceColor.needsUpdate = true;
    }
  }

  villageSide(k) {
    if (k < 4) return 0;
    if (k % 37 === 5 || k % 37 === 6) return 1;
    if (k % 53 === 20 || k % 53 === 21) return -1;
    return 0;
  }

  placeRequest(slot, r) {
    r.built = true;
    const z = -r.s;
    let obj = null;
    switch (r.type) {
      case 'brunnen':
        obj = this.acquire('brunnen', () => this.makeFountain());
        obj.position.set(ROAD.right + 9, 0, z);
        this.animated.add(obj);
        break;
      case 'elsa':
        obj = this.acquire('elsaStatue', () => this.makeElsaStatue());
        obj.position.set(ROAD.right + 8, 0, z);
        this.animated.add(obj);
        break;
      case 'burg':
        obj = this.acquire('burg', () => this.makeCastle());
        obj.position.set(160, 0, z - 60);
        break;
      case 'skyline':
        obj = this.acquire('skyline', () => this.makeSkyline());
        obj.position.set(-150, 0, z - 250);
        break;
      case 'sparkasse':
        obj = this.acquire('sparkasse', () => this.makeSparkasse());
        obj.userData.setColor(r.data.color || '#d5121e');
        obj.position.set(ROAD.right + 16, 0, z);
        break;
      case 'kiosk':
        obj = this.acquire('kiosk', () => this.makeKiosk());
        obj.userData.setText(r.data.title || 'Currywurst', r.data.sub || 'die richtige Bude');
        obj.position.set(ROAD.right + 10, 0, z);
        break;
      case 'charger':
        obj = this.acquire('charger', () => this.makeCharger());
        obj.position.set(ROAD.right + 11, 0, z);
        break;
      case 'ziel':
        obj = this.acquire('ziel', () => this.makeZiel());
        obj.userData.setText(r.data.title || 'Ziel');
        obj.position.set(ROAD.right + 3.5, 0, z);
        break;
      case 'blitzer':
        obj = this.acquire('blitzer', () => this.makeBlitzer());
        obj.position.set(ROAD.right + 1.6, 0, z);
        break;
      case 'speed': {
        obj = this.acquire('speed:' + r.data.limit, () => this.makeSpeedSign(r.data.limit));
        obj.position.set(0, 0, z);
        break;
      }
      default:
        return;
    }
    obj.userData.requestId = r.id;
    slot.items.push(obj);
  }

  // --- Bauteile --------------------------------------------------------
  canvasTex(key, w, h, draw) {
    if (this.texCache.has(key)) return this.texCache.get(key);
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    this.texCache.set(key, t);
    if (this.texCache.size > 90) {
      const first = this.texCache.keys().next().value;
      this.texCache.get(first).dispose();
      this.texCache.delete(first);
    }
    return t;
  }

  makeKmSign(text) {
    const g = new THREE.Group();
    if (!this.kmGeo) this.kmGeo = { post: new THREE.BoxGeometry(0.08, 1.4, 0.08), board: new THREE.PlaneGeometry(0.5, 0.38) };
    const post = new THREE.Mesh(this.kmGeo.post, this.mats.steel);
    post.position.y = 0.7;
    const tex = this.canvasTex('km:' + text, 128, 96, (ctx, w, h) => {
      ctx.fillStyle = '#fafaf5';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 5;
      ctx.strokeRect(3, 3, w - 6, h - 6);
      ctx.fillStyle = '#111';
      ctx.font = 'bold 46px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, w / 2, h / 2 + 2);
    });
    const board = new THREE.Mesh(this.kmGeo.board, W.std({ map: tex, roughness: 0.6 }));
    board.position.set(0, 1.35, 0.05);
    board.rotation.y = -0.25;
    g.add(post, board);
    g.userData.active = true;
    g.userData.onRelease = () => {
      board.material.dispose();
      this.track.remove(g);
    };
    this.track.add(g);
    return g;
  }

  makeNotruf() {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.32, 1.25, 0.28), this.mats.orange);
    body.position.y = 0.62;
    const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.25), this.mats.white);
    plate.position.set(0, 0.95, 0.142);
    g.add(body, plate);
    return g;
  }

  makeGantry() {
    const g = new THREE.Group();
    const m = this.mats.steel;
    const xl = MEDIAN_X - 0.4;
    const xr = ROAD.right + 1.6;
    for (const x of [xl, xr]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.5, 7.4, 0.5), m);
      post.position.set(x, 3.7, 0);
      post.castShadow = true;
      g.add(post);
      const foot = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 1.2), this.mats.concrete);
      foot.position.set(x, 0.25, 0);
      g.add(foot);
    }
    const span = xr - xl;
    for (const y of [6.3, 7.2]) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(span, 0.22, 0.22), m);
      beam.position.set((xl + xr) / 2, y, 0);
      beam.castShadow = true;
      g.add(beam);
    }
    for (let i = 0; i <= 12; i++) {
      const x = xl + (span * i) / 12;
      const strut = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, 0.08), m);
      strut.position.set(x, 6.75, 0);
      strut.rotation.z = i % 2 ? 0.7 : -0.7;
      g.add(strut);
    }
    const panelA = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 2.7), W.std({ roughness: 0.5 }));
    panelA.position.set(-3.75, 6.6, 0.2);
    const panelB = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 2.7), W.std({ roughness: 0.5 }));
    panelB.position.set(3.9, 6.6, 0.2);
    const back = new THREE.Mesh(new THREE.BoxGeometry(14.8, 2.8, 0.12), this.mats.dark);
    back.position.set(0.07, 6.6, 0.12);
    g.add(back, panelA, panelB);
    g.userData.panels = [panelA, panelB];
    return g;
  }

  labelGantry(g, rnd) {
    const info = this.gantryInfo();
    const [a, b] = g.userData.panels;
    const kmTxt = (km) => km.toLocaleString('de-DE', { maximumFractionDigits: km < 10 ? 1 : 0 }) + ' km';
    const p1 = pick(PLACES);
    let p2 = pick(PLACES);
    if (p2 === p1) p2 = 'Würzburg';
    const tA = signTexture([{ left: info.target, right: kmTxt(info.km) }, { left: 'Navi-Ziel', right: '↑' }], { w: 768, h: 288, arrows: null });
    const tB = signTexture([{ left: p1, right: kmTxt(5 + Math.floor(rnd() * 60)) }, { left: p2, right: kmTxt(30 + Math.floor(rnd() * 120)) }], { w: 768, h: 288, arrows: null });
    for (const [p, t] of [[a, tA], [b, tB]]) {
      if (p.material.map) p.material.map.dispose();
      p.material.map = t;
      p.material.needsUpdate = true;
    }
  }

  makeBridge() {
    const g = new THREE.Group();
    const c = this.mats.concrete;
    const x0 = -58;
    const x1 = 42;
    const deck = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 1.1, 11, 20, 1, 1), c);
    deck.position.set((x0 + x1) / 2, 6.35, 0);
    deck.castShadow = true;
    deck.receiveShadow = true;
    g.add(deck);
    const under = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, 11), this.mats.concreteDark);
    under.rotation.x = Math.PI / 2;
    under.position.set((x0 + x1) / 2, 5.79, 0);
    g.add(under);
    for (const x of [MEDIAN_X, ROAD.right + 3, -31.5]) {
      for (const z of [-3.2, 3.2]) {
        const p = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.6, 5.8, 12), c);
        p.position.set(x, 2.9, z);
        p.castShadow = true;
        g.add(p);
      }
    }
    for (const x of [x0 + 4, x1 - 4]) {
      const ab = new THREE.Mesh(new THREE.BoxGeometry(8, 6, 13), this.mats.grass);
      ab.position.set(x, 3, 0);
      g.add(ab);
    }
    for (const z of [-5.4, 5.4]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 0.1, 0.1), this.mats.steel);
      rail.position.set((x0 + x1) / 2, 7.95, z);
      g.add(rail);
      for (let x = x0; x <= x1; x += 2.5) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.0, 0.06), this.mats.steel);
        post.position.set(x, 7.4, z);
        g.add(post);
      }
    }
    const banner = new THREE.Mesh(new THREE.PlaneGeometry(9, 1.5, 8, 1), W.std({ side: THREE.DoubleSide, roughness: 0.9 }));
    banner.position.set(-1.5, 6.9, 5.6);
    g.add(banner);
    g.userData.banner = banner;
    // Ein Auto auf der Brücke
    return g;
  }

  labelBridge(b, rnd) {
    const text = BANNERS[Math.floor(rnd() * BANNERS.length)];
    const tex = this.canvasTex('banner:' + text, 1024, 170, (ctx, w, h) => {
      ctx.fillStyle = '#fbfbf6';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = ['#c8102e', '#1d4f9a', '#111111', '#2d7a32'][text.length % 4];
      ctx.font = 'bold 92px "Comic Sans MS", "Marker Felt", "Segoe Print", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      let size = 92;
      while (ctx.measureText(text).width > w - 60 && size > 30) {
        size -= 4;
        ctx.font = `bold ${size}px "Comic Sans MS", "Marker Felt", "Segoe Print", Arial, sans-serif`;
      }
      ctx.fillText(text, w / 2, h / 2 + 4);
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, Math.random() * h);
        ctx.bezierCurveTo(w * 0.3, Math.random() * h, w * 0.7, Math.random() * h, w, Math.random() * h);
        ctx.stroke();
      }
    });
    b.userData.banner.material.map = tex;
    b.userData.banner.material.needsUpdate = true;
    b.userData.banner.position.x = -12 + rnd() * 20;
  }

  makeBrownSign() {
    const g = new THREE.Group();
    for (const x of [-1.3, 1.3]) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.8, 0.1), this.mats.steel);
      p.position.set(x, 1.9, 0);
      g.add(p);
    }
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.1), W.std({ roughness: 0.6 }));
    panel.position.set(0, 2.75, 0.06);
    g.add(panel);
    g.rotation.y = -0.12;
    g.userData.setText = (title, sub) => {
      panel.material.map = this.canvasTexFrom('brown:' + title, () => brownSignTexture(title, sub));
      panel.material.needsUpdate = true;
    };
    return g;
  }

  canvasTexFrom(key, fn) {
    if (!this.texCache.has(key)) this.texCache.set(key, fn());
    return this.texCache.get(key);
  }

  makeBlueInfo() {
    const g = new THREE.Group();
    for (const x of [-1.3, 1.3]) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.6, 0.1), this.mats.steel);
      p.position.set(x, 1.8, 0);
      g.add(p);
    }
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.8), W.std({ roughness: 0.6 }));
    panel.position.set(0, 2.7, 0.06);
    g.add(panel);
    g.rotation.y = -0.12;
    g.userData.setText = (lines) => {
      panel.material.map = this.canvasTexFrom('blue:' + lines.join('|'), () => signTexture(lines, { w: 512, h: 272 }));
      panel.material.needsUpdate = true;
    };
    return g;
  }

  makeSpeedSign(limit) {
    const g = new THREE.Group();
    const tex = speedSignTexture(limit);
    const mat = W.std({ map: tex, transparent: true, alphaTest: 0.4, roughness: 0.5 });
    for (const x of [ROAD.right + 1.3, MEDIAN_X]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.6, 6), this.mats.steel);
      post.position.set(x, 1.3, 0);
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.0), mat);
      sign.position.set(x, 2.5, 0.05);
      g.add(post, sign);
    }
    return g;
  }

  makeBlitzer() {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.55, 2.7, 0.55), W.std({ color: 0x9da3a8, metalness: 0.4, roughness: 0.5 }));
    body.position.y = 1.35;
    const win = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.5), W.std({ color: 0x101418, metalness: 0.8, roughness: 0.1 }));
    win.position.set(0, 2.2, 0.28);
    const flash = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.2), W.basic({ color: 0xffffff }));
    flash.position.set(0, 1.75, 0.28);
    g.add(body, win, flash);
    g.rotation.y = -0.35;
    g.userData.flash = flash;
    return g;
  }

  makeTurbine() {
    const g = new THREE.Group();
    const m = W.std({ color: 0xf3f4f5, roughness: 0.55 });
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 2.4, 92, 12), m);
    tower.position.y = 46;
    const nac = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.8, 10), m);
    nac.position.set(0, 93, -1);
    const rotor = new THREE.Group();
    rotor.position.set(0, 93, 4.4);
    const hub = new THREE.Mesh(new THREE.SphereGeometry(2.0, 12, 10), m);
    hub.scale.set(1, 1, 1.4);
    rotor.add(hub);
    const bladeGeo = new THREE.BoxGeometry(2.4, 46, 0.5);
    bladeGeo.translate(0, 24, 0);
    const pos = bladeGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      pos.setX(i, pos.getX(i) * (1 - (y / 50) * 0.75));
    }
    bladeGeo.computeVertexNormals();
    for (let i = 0; i < 3; i++) {
      const b = new THREE.Mesh(bladeGeo, m);
      b.rotation.z = (i / 3) * Math.PI * 2;
      rotor.add(b);
    }
    g.add(tower, nac, rotor);
    g.userData.animate = (t) => {
      rotor.rotation.z = t * 1.3 + g.userData.phase;
    };
    return g;
  }

  makeChurch() {
    const g = new THREE.Group();
    const wall = W.std({ color: 0xece5d5, roughness: 0.9 });
    const nave = new THREE.Mesh(new THREE.BoxGeometry(9, 8, 18), wall);
    nave.position.set(0, 4, 4);
    const roof = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 6.8, 5, 4, 1), this.mats.redRoof);
    roof.scale.set(1, 1, 2.0);
    roof.rotation.y = Math.PI / 4;
    roof.position.set(0, 10.5, 4);
    const tower = new THREE.Mesh(new THREE.BoxGeometry(4.5, 20, 4.5), wall);
    tower.position.set(0, 10, -7);
    const spire = new THREE.Mesh(new THREE.ConeGeometry(3.4, 10, 4), W.std({ color: 0x3e5e52, roughness: 0.7 }));
    spire.rotation.y = Math.PI / 4;
    spire.position.set(0, 25, -7);
    const clock = new THREE.Mesh(new THREE.CircleGeometry(0.9, 16), W.std({ color: 0x1a1a1a }));
    clock.position.set(0, 16, -4.74);
    g.add(nave, roof, tower, spire, clock);
    g.traverse((o) => o.isMesh && (o.castShadow = true));
    return g;
  }

  makeNoiseWall() {
    const tex = this.canvasTexFrom('noisewall', () => {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 128;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#7f8f84';
      ctx.fillRect(0, 0, 256, 128);
      for (let y = 0; y < 128; y += 8) {
        ctx.fillStyle = y % 16 ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)';
        ctx.fillRect(0, y, 256, 4);
      }
      ctx.fillStyle = '#5b6168';
      ctx.fillRect(0, 0, 10, 128);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(20, 1);
      t.anisotropy = 4;
      return t;
    });
    const m = W.std({ map: tex, roughness: 0.8 });
    const wall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.2, SEG, 1, 1, 25), m);
    wall.position.y = 2.1;
    wall.castShadow = true;
    wall.receiveShadow = true;
    const g = new THREE.Group();
    g.add(wall);
    return g;
  }

  makeFountain() {
    const g = new THREE.Group();
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.6, 0.9, 28, 1, true), this.mats.stone);
    basin.position.y = 0.45;
    const rim = new THREE.Mesh(new THREE.TorusGeometry(3.45, 0.18, 8, 32), this.mats.stone);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.9;
    const water = new THREE.Mesh(new THREE.CircleGeometry(3.35, 28), this.mats.water);
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.75;
    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 2.4, 14), this.mats.stone);
    column.position.y = 1.2;
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 0.35, 0.5, 20), this.mats.stone);
    bowl.position.y = 2.5;
    const jetMat = W.std({ color: 0xdff1ff, transparent: true, opacity: 0.55, roughness: 0.1, emissive: 0x335577, emissiveIntensity: 0.3 });
    const jet = new THREE.Mesh(new THREE.ConeGeometry(0.25, 2.2, 12, 1, true), jetMat);
    jet.position.y = 3.8;
    jet.rotation.x = Math.PI;
    const fall = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 2.4, 1.7, 24, 1, true), jetMat);
    fall.position.y = 1.65;
    // BrunnenTV-Schild
    const tex = this.canvasTex('brunnentv', 512, 200, (ctx, w, h) => {
      ctx.fillStyle = '#3a1f63';
      roundRect(ctx, 0, 0, w, h, 24);
      ctx.fill();
      ctx.fillStyle = '#ffd84a';
      ctx.font = 'bold 84px Arial Black, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('BrunnenTV', w / 2, h * 0.42);
      ctx.fillStyle = '#ffffff';
      ctx.font = '34px Arial, sans-serif';
      ctx.fillText('mit Herrn Schönnbrun ⛲', w / 2, h * 0.78);
    });
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.25), W.std({ map: tex, roughness: 0.5 }));
    sign.position.set(-4.2, 2.3, 1.5);
    sign.rotation.y = 0.5;
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.8, 0.12), this.mats.steel);
    post.position.set(-4.2, 0.9, 1.4);
    g.add(basin, rim, water, column, bowl, jet, fall, sign, post);
    g.userData.animate = (t) => {
      jet.scale.y = 1 + Math.sin(t * 7) * 0.08;
      fall.scale.x = fall.scale.z = 1 + Math.sin(t * 5) * 0.03;
    };
    return g;
  }

  makeElsaStatue() {
    const g = new THREE.Group();
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.1, 1.2, 20), this.mats.stone);
    ped.position.y = 0.6;
    const elsa = buildElsa({ curved: true });
    elsa.scale.setScalar(4.2);
    elsa.position.y = 1.2;
    elsa.rotation.y = -0.6;
    const tex = this.canvasTex('elsaSign', 512, 160, (ctx, w, h) => {
      ctx.fillStyle = '#1d3f9a';
      roundRect(ctx, 0, 0, w, h, 20);
      ctx.fill();
      ctx.fillStyle = '#f2c230';
      ctx.font = 'bold 66px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('👑 Elsa grüßt!', w / 2, h / 2 + 3);
    });
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.8), W.std({ map: tex }));
    sign.position.set(0, 0.7, 2.12);
    g.add(ped, elsa, sign);
    g.userData.animate = (t) => animateElsa(elsa, t);
    return g;
  }

  makeCastle() {
    const g = new THREE.Group();
    const hill = new THREE.Mesh(new THREE.ConeGeometry(95, 42, 24, 1), W.lambert({ color: 0x5c8640 }));
    hill.position.y = 21;
    const wallM = W.std({ color: 0xb7a98f, roughness: 0.95 });
    const keep = new THREE.Mesh(new THREE.BoxGeometry(12, 30, 12), wallM);
    keep.position.y = 42 + 15;
    const keepRoof = new THREE.Mesh(new THREE.ConeGeometry(9.5, 12, 4), this.mats.redRoof);
    keepRoof.rotation.y = Math.PI / 4;
    keepRoof.position.y = 42 + 36;
    g.add(hill, keep, keepRoof);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + 0.4;
      const t = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.8, 20, 12), wallM);
      t.position.set(Math.sin(a) * 18, 42 + 10, Math.cos(a) * 18);
      const r = new THREE.Mesh(new THREE.ConeGeometry(4.4, 8, 12), this.mats.redRoof);
      r.position.set(Math.sin(a) * 18, 42 + 24, Math.cos(a) * 18);
      g.add(t, r);
      const b = (((i + 0.5) / 4) * Math.PI * 2) + 0.4;
      const wall = new THREE.Mesh(new THREE.BoxGeometry(24, 12, 2), wallM);
      wall.position.set(Math.sin(b) * 13.5, 42 + 6, Math.cos(b) * 13.5);
      wall.rotation.y = b;
      g.add(wall);
    }
    return g;
  }

  makeSkyline() {
    const g = new THREE.Group();
    const rnd = mulberry32(69);
    const mats = [this.mats.glassBlue, W.std({ color: 0xb9c2cc, metalness: 0.5, roughness: 0.3 }), W.std({ color: 0x6f7a86, metalness: 0.6, roughness: 0.25 })];
    for (let i = 0; i < 16; i++) {
      const h = 60 + rnd() * 190;
      const w = 18 + rnd() * 22;
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), mats[i % 3]);
      b.position.set(-180 + i * 26 + rnd() * 10, h / 2, -rnd() * 120);
      g.add(b);
      if (i === 7) {
        const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 1.2, 50, 6), this.mats.steel);
        ant.position.set(b.position.x, h + 25, b.position.z);
        g.add(ant);
      }
    }
    return g;
  }

  makeSparkasse() {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(14, 7, 10), W.std({ color: 0xe9e6df, roughness: 0.85 }));
    body.position.y = 3.5;
    const win = new THREE.Mesh(new THREE.PlaneGeometry(12, 3), this.mats.glassBlue);
    win.position.set(0, 2.2, 5.01);
    win.rotation.y = 0;
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(8, 1.6), W.std({ roughness: 0.5 }));
    panel.position.set(0, 6, 5.03);
    g.add(body, win, panel);
    g.rotation.y = -Math.PI / 2 + 0.25;
    g.userData.setColor = (color) => {
      const tex = this.canvasTex('spk:' + color, 512, 100, (ctx, w, h) => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = color;
        ctx.font = 'bold 64px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Sparkasse', w / 2, h / 2 + 3);
      });
      panel.material.map = tex;
      panel.material.needsUpdate = true;
    };
    return g;
  }

  makeKiosk() {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(5, 3, 4), W.std({ color: 0xf0e0b0, roughness: 0.8 }));
    body.position.y = 1.5;
    const awning = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.2, 1.6), W.std({ color: 0xd22020, roughness: 0.7 }));
    awning.position.set(0, 2.8, 2.6);
    awning.rotation.x = 0.25;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 7, 8), this.mats.steel);
    pole.position.set(-3.6, 3.5, 1);
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.8), W.std({ roughness: 0.5 }));
    panel.position.set(-3.6, 6.4, 1.13);
    g.add(body, awning, pole, panel);
    g.rotation.y = -0.4;
    g.userData.setText = (title, sub) => {
      const tex = this.canvasTex('kiosk:' + title + sub, 512, 288, (ctx, w, h) => {
        ctx.fillStyle = '#fff4d0';
        roundRect(ctx, 0, 0, w, h, 26);
        ctx.fill();
        ctx.strokeStyle = '#d22020';
        ctx.lineWidth = 12;
        roundRect(ctx, 8, 8, w - 16, h - 16, 20);
        ctx.stroke();
        ctx.fillStyle = '#b31515';
        ctx.font = 'bold 72px Arial Black, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, w / 2, h * 0.4);
        ctx.fillStyle = '#333';
        ctx.font = 'bold 38px Arial, sans-serif';
        ctx.fillText(sub, w / 2, h * 0.75);
      });
      panel.material.map = tex;
      panel.material.needsUpdate = true;
    };
    return g;
  }

  makeCharger() {
    const g = new THREE.Group();
    const roof = new THREE.Mesh(new THREE.BoxGeometry(14, 0.4, 6), W.std({ color: 0xf4f4f4, roughness: 0.6 }));
    roof.position.y = 4.2;
    g.add(roof);
    for (const x of [-6, 6]) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.2, 0.3), this.mats.steel);
      p.position.set(x, 2.1, 0);
      g.add(p);
    }
    for (let i = 0; i < 5; i++) {
      const st = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.6, 0.35), W.std({ color: 0xf2f2f2, roughness: 0.4 }));
      st.position.set(-5 + i * 2.5, 0.8, -1.5);
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.25, 0.36), W.std({ color: 0xd01c1c, emissive: 0x500000 }));
      stripe.position.set(-5 + i * 2.5, 1.35, -1.5);
      g.add(st, stripe);
    }
    const glow = new THREE.Mesh(new THREE.BoxGeometry(13.6, 0.08, 5.6), W.basic({ color: 0xbfe3ff }));
    glow.position.y = 3.98;
    g.add(glow);
    g.rotation.y = -0.2;
    return g;
  }

  makeZiel() {
    const g = new THREE.Group();
    for (const x of [-2.2, 2.2]) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.6, 8), this.mats.steel);
      p.position.set(x, 2.3, 0);
      g.add(p);
    }
    const flagTex = this.canvasTex('checker', 256, 64, (ctx, w, h) => {
      for (let y = 0; y < 4; y++) for (let x = 0; x < 16; x++) {
        ctx.fillStyle = (x + y) % 2 ? '#111' : '#fff';
        ctx.fillRect(x * 16, y * 16, 16, 16);
      }
    });
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 0.9, 10, 1), W.std({ map: flagTex, side: THREE.DoubleSide }));
    flag.position.y = 4.15;
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 1.6), W.std({ roughness: 0.6 }));
    panel.position.y = 2.9;
    panel.position.z = 0.05;
    g.add(flag, panel);
    g.rotation.y = -0.15;
    g.userData.setText = (title) => {
      panel.material.map = this.canvasTexFrom('ziel:' + title, () => signTexture(['Ziel erreicht:', title], { w: 512, h: 196, bg: '#1d7a3a' }));
      panel.material.needsUpdate = true;
    };
    return g;
  }

  /** Blitzer auslösen (weißer Blitz an der Säule). */
  flashBlitzer(on) {
    const pool = this.pools.get('blitzer') || [];
    for (const b of pool) {
      if (b.userData.active) b.userData.flash.material.color.setScalar(on ? 30 : 1);
    }
  }
}

