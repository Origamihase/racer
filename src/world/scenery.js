// Landschaft entlang der Autobahn: Wälder, Felder, Dörfer, Windräder, Brücken mit Fan-Bannern,
// Schilderbrücken mit dem aktuellen Navi-Ziel, Kilometerschilder, braune Touristik-Tafeln
// und besondere Orte (Brunnen für BrunnenTV, Elsa, Burgen, Sparkasse, Skyline …).
// Die Welt ist in 100-m-Segmente geteilt, die vor dem Spieler neu gebaut werden.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { W } from '../curve.js';
import {
  ROAD, signTexture, brownSignTexture, speedSignTexture, roundRect, grassTexture, fitTextCenter,
} from '../textures.js';
import { colorize } from '../models/loft.js';
import { buildElsa, animateElsa } from '../models/elsa.js';
import { mulberry32, fbm1, smoothstep, pick } from '../util.js';
import { MEDIAN_X, ONCOMING, GRASS_TINT } from './road.js';

export const SEG = 100;
const AHEAD = 17;
const BEHIND = 2;
const NSLOTS = AHEAD + BEHIND + 1;

// Elsa-Statue: aus Mini Adams Sicht deckt der Innenspiegel rechts oben etwa 17–41° ab. Nah hinter der
// Leitplanke (der Sockel bleibt gut einen halben Meter hinter den Leitpfosten) und etwas größer als früher
// steht sie beim Heranfahren lange links vom Spiegel im freien Teil der Scheibe und ist dort gut zu erkennen.
export const ELSA_STATUE = { x: ROAD.right + 4.55, scale: 1.4 };
const ELSA_FAR = { x: ROAD.right + 8, scale: 1 }; // wo am Rand kein Platz ist: weiter draußen in alter Größe
const ELSA_ROOM = 12; // so viel Abstand (m) braucht sie am Rand zu Schildern, Blitzern und anderen Orten
// Freier Platz im Abschnitt: hinter Notrufsäule (30 m), Tafeln (40 m) und Brücken (50 m)
const LANDMARK_OFFSET = 75;
const WAVE_T = 2.6; // so lange winkt Elsa zurück (s)

// Bildseiten von Schildern, Tafeln und Fenstern vor einer Fläche: Die Tiefenauflösung reicht in 450 m
// Entfernung nur noch für ≈ 5 cm (in 1,5 km für ≈ 50 cm). Der Polygon-Offset zieht die Bildseite um ein paar
// Tiefenstufen nach vorne, damit nichts dahinter durchflimmert, egal wie weit weg.
const FRONT = { polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -4 };

// Lärmschutzwand am Dorf: Mitte der 0,3 m dicken Wand. Davor bleibt Platz für den Blitzer (bis +1,95 m) und
// den Fuß der Schilderbrücke (bis +2,05 m), dahinter für die Brückenpfeiler (ab +2,9 m).
const WALL_X = ROAD.right + 2.35;
// Vor Navi-Zielen und Wahrzeichen rechts der Fahrbahn bleibt die Wand offen: ab 140 m davor, damit man sie
// aus dem Cockpit schon aus ≈ 250 m sieht, bis 25 m dahinter. Kürzere Reststücke als 20 m entfallen.
const WALL_GAP = new Set(['ziel', 'brunnen', 'elsa', 'sparkasse', 'kiosk', 'charger']);
const GAP_BEFORE = 140;
const GAP_AFTER = 25;
const WALL_MIN = 20;
// Fuß des Burgbergs (Radius in m um die Burg, siehe makeCastle): darin stehen keine Häuser und keine Kirche
const HILL_R = 97;
// Sichtweite: so weit reicht der Nebel bei klarem Wetter (sky.js), dahinter hat alles die Nebelfarbe. Schrift auf
// einer Tafel ist schon ab 150 m nur noch ein paar Pixel hoch.
const VIEW_FAR = 1550;
const READ_FAR = 150;
/** So weit reicht ein Wahrzeichen vor seinen Ort (zum Spieler hin): der Burgberg 37 m, alles andere unter 10 m. */
const reach = (r) => (r.type === 'burg' ? HILL_R - 60 : 10);
/** Stünden zwei Navi-Wahrzeichen ineinander? (alle am rechten Rand, zwei Burgberge, zwei Skylines) */
function clash(a, b) {
  const d = Math.abs(a.s - b.s);
  if (WALL_GAP.has(a.type) && WALL_GAP.has(b.type)) return d < 40;
  if (a.type !== b.type) return false;
  return (a.type === 'burg' && d < 2 * HILL_R + 10) || (a.type === 'skyline' && d < 270);
}
// Dorf: Grundriss der Kirche (makeChurch: Turm mit Helm bis −9,4 m, Dach bis +13,6 m, 4,8 m zu den Seiten),
// halbe Dachfläche eines Hauses (roofGeo steht 6 % über), Abstand zwischen zwei Häusern, Kronenradius des
// Laubbaums (decidGeo) bei Maßstab 1 und so viel Platz bleibt an den Dorfenden für die Kronen der Bäume draußen
const CHURCH_LOT = { z: 2.1, hx: 4.85, hz: 11.55 };
const ROOF_OVER = 0.56;
const HOUSE_GAP = 1.2;
const DECID_CROWN = 3.35;
const TREE_ROOM = 6;

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

/**
 * Flächen aus ebenen, konvexen Vielecken. polys: [{ pts: [[x, y, z], …], out: [x, y, z] }], wobei out grob nach
 * außen zeigt und damit die Umlaufrichtung festlegt. uvFn(p, out) → [u, v]. Flache Normalen.
 */
function polyGeometry(polys, uvFn) {
  const pos = [];
  const uv = [];
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  for (const { pts, out } of polys) {
    a.fromArray(pts[0]);
    b.fromArray(pts[1]).sub(a);
    c.fromArray(pts[2]).sub(a);
    const P = b.cross(c).dot(new THREE.Vector3(...out)) < 0 ? [...pts].reverse() : pts;
    for (let i = 1; i < P.length - 1; i++) {
      for (const p of [P[0], P[i], P[i + 1]]) {
        pos.push(...p);
        uv.push(...uvFn(p, out));
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.computeVertexNormals();
  return g;
}

/**
 * Grundriss als gedrehtes Rechteck in der Ebene (x, z): Mitte, halbe Kantenlängen und Drehung wie rotation.y
 * (die lokale x-Achse zeigt dann nach (cos r, −sin r), die lokale z-Achse nach (sin r, cos r)).
 */
function lot(x, z, hx, hz, r) {
  const c = Math.cos(r);
  const s = Math.sin(r);
  return { x, z, a: [c * hx, -s * hx], b: [s * hz, c * hz] };
}
/** Lücke zwischen zwei Grundrissen entlang der besten ihrer Kantenrichtungen (< 0: sie überlappen). */
function lotGap(P, Q) {
  let gap = -Infinity;
  for (const [ax, az] of [P.a, P.b, Q.a, Q.b]) {
    const L = Math.hypot(ax, az);
    const nx = ax / L;
    const nz = az / L;
    const half = (O) => Math.abs(O.a[0] * nx + O.a[1] * nz) + Math.abs(O.b[0] * nx + O.b[1] * nz);
    gap = Math.max(gap, Math.abs((Q.x - P.x) * nx + (Q.z - P.z) * nz) - half(P) - half(Q));
  }
  return gap;
}
/** Abstand eines Punkts (x, z) vom Grundriss (0, wenn er darin liegt). */
function lotDist(P, x, z) {
  let d2 = 0;
  for (const [ax, az] of [P.a, P.b]) {
    const L = Math.hypot(ax, az);
    const t = Math.abs(((x - P.x) * ax + (z - P.z) * az) / L) - L;
    if (t > 0) d2 += t * t;
  }
  return Math.sqrt(d2);
}

// Skyline (Gruppe bei x = SKYLINE_X): 16 Hochhäuser, immer dieselben, schräg nach hinten links gestaffelt – alles
// weit jenseits der Gegenfahrbahn (die endet bei x ≈ −32). Mitte relativ zur Gruppe, Breite (quadratisch), Höhe.
const SKYLINE_X = -75;
let towers = null;
function skylineTowers() {
  if (!towers) {
    const rnd = mulberry32(69);
    towers = Array.from({ length: 16 }, (_, i) => {
      const h = 60 + rnd() * 190;
      const w = 18 + rnd() * 22;
      return { x: -i * 22 - rnd() * 8, z: -i * 14 - rnd() * 40, w, h };
    });
  }
  return towers;
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
      // Stahl steht oft hinter Schildtafeln (Pfosten, Mast). Schräg gesehene Pfostenflanken stachen aus 50–100 m
      // als feine helle Linie durch die Tafel davor; der Versatz wächst mit der Schräge und hält sie dahinter.
      // Frontal gesehene Flächen verschiebt er praktisch nicht.
      steel: W.std({ color: 0x9aa1a8, metalness: 0.7, roughness: 0.4, polygonOffset: true, polygonOffsetFactor: 2, polygonOffsetUnits: 0 }),
      dark: W.std({ color: 0x2a2b2e, roughness: 0.7 }),
      white: W.std({ color: 0xf2f2ef, roughness: 0.6 }),
      orange: W.std({ color: 0xe86b12, roughness: 0.6 }),
      grass: W.lambert({ map: grassTexture() }), // wie das Bankett an der Fahrbahn (auch bei Regen gleich dunkel)
      stone: W.std({ color: 0xa79e8e, roughness: 0.95 }),
      water: W.std({ color: 0x9ccfff, roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.55, envMapIntensity: 1.5 }),
      redRoof: W.std({ color: 0xa3402a, roughness: 0.8 }),
      glassBlue: W.std({ color: 0x5f7fa3, metalness: 0.8, roughness: 0.15, envMapIntensity: 1.2 }),
    };
    this.mats.grass.color = GRASS_TINT;

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
    // Ein stehen gebliebenes Wahrzeichen eines überbotenen Ziels (siehe cancel), dem das neue in die Quere käme,
    // macht Platz. Neue Navi-Ziele liegen mindestens 1,4 km voraus, es verschwindet also fast ganz im Nebel.
    for (const q of this.requests) if (q.cancelled && clash(q, r)) this.drop(q);
    this.requests.push(r);
    // Falls das Segment schon steht: sofort einsetzen
    const k = Math.floor(s / SEG);
    const slot = this.slots[((k % NSLOTS) + NSLOTS) % NSLOTS];
    if (slot.k === k) this.placeRequest(slot, r);
    if (type !== 'elsa') this.makeRoom(r);
    // und eine schon stehende Lärmschutzwand davor öffnen
    if (WALL_GAP.has(type)) this.refreshWalls(s);
    return id;
  }

  /**
   * Anfrage abbrechen (Ziel überboten). Schon gebaute Ziel-Schilder und Wahrzeichen verschwinden nur, wo man sie
   * nicht mehr sieht: ganz hinten im Nebel. Alles Nähere (auch eine Burg 300 m voraus) bliebe sonst nicht einfach
   * weg, es verschwände mitten im Bild. Es bleibt also stehen, bis sein Abschnitt hinter dem Auto abgebaut wird,
   * und behält so lange seine Lücke in der Lärmschutzwand und seinen freien Platz; auf dem Ziel-Schild steht dann
   * „Überboten:“ (siehe retireZiel). Mit removeBuilt = false (schon angekommen) bleibt ohnehin alles stehen.
   */
  cancel(id, removeBuilt = true) {
    const r = this.requests.find((q) => q.id === id);
    if (!r) return;
    if (removeBuilt && r.built && r.s - reach(r) < this.track.position.z + VIEW_FAR) {
      r.cancelled = true;
      if (r.type === 'ziel') this.retireZiel(r);
      return;
    }
    this.drop(r, removeBuilt);
  }

  /** Anfrage r streichen und (mit removeBuilt) ihre schon gebauten Teile abbauen. */
  drop(r, removeBuilt = true) {
    this.requests = this.requests.filter((q) => q !== r);
    let removed = false;
    if (removeBuilt && r.built) {
      for (const slot of this.slots) {
        const i = slot.items.findIndex((o) => o.userData.requestId === r.id);
        if (i >= 0) {
          this.release(slot.items[i]);
          slot.items.splice(i, 1);
          removed = true;
        }
      }
    }
    // die Lücke in der Lärmschutzwand wieder schließen, aber nur, solange ihr Anfang noch weit voraus liegt
    // (sonst wüchse die Wand vor der Nase aus dem Boden); bleibt das Ziel stehen, bleibt auch die Lücke
    const far = r.s - GAP_BEFORE - WALL_MIN > this.track.position.z + 300;
    if (WALL_GAP.has(r.type) && (removed || !r.built) && far) this.refreshWalls(r.s);
  }

  /**
   * Ziel-Schild eines überbotenen Ziels: „Überboten:“ statt „Ziel erreicht:“ – aber nur, solange es noch zu weit
   * weg ist, um es zu lesen (sonst wechselte die Schrift vor den Augen; dann bleibt sie, man ist gleich vorbei).
   */
  retireZiel(r) {
    if (r.s - this.track.position.z < READ_FAR) return;
    for (const slot of this.slots) {
      for (const o of slot.items) if (o.userData.requestId === r.id) o.userData.setText(r.data.title || 'Ziel', true);
    }
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
      if (obj.userData.waveT > 0) this.waveFins(obj, dt);
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

    // Dorf: erst die Kirche, dann die Häuser, jedes auf einem freien Platz (Grundriss mit Dachüberstand und
    // Abstand zu allem, was schon steht; ein paar Versuche, sonst fällt es weg), zuletzt die Bäume dort, wo Stamm
    // und Krone frei sind. Alles bleibt im eigenen Abschnitt: zum Nachbarabschnitt desselben Dorfs mit 1 m Rand,
    // an den Dorfenden mit Platz für die Kronen der Bäume draußen. Alles kommt aus rnd(), bleibt also bei jedem
    // Neubau des Abschnitts gleich.
    if (village) {
      const side = village;
      const lots = [];
      const edge = (kk) => (this.villageSide(kk) === side ? 1 : TREE_ROOM);
      const zTop = z0 - edge(k - 1); // zum Spieler hin
      const zEnd = z0 - SEG + edge(k + 1);
      if (rnd() < 0.8) {
        const ch = this.acquire('church', () => this.makeChurch());
        ch.position.set(side * (70 + rnd() * 60), 0, z0 - 50);
        ch.rotation.y = rnd() * 0.5;
        slot.items.push(ch);
        const r = ch.rotation.y;
        const cx = ch.position.x + Math.sin(r) * CHURCH_LOT.z;
        const cz = ch.position.z + Math.cos(r) * CHURCH_LOT.z;
        lots.push(lot(cx, cz, CHURCH_LOT.hx, CHURCH_LOT.hz, r));
      }
      const n = 14 + Math.floor(rnd() * 14);
      for (let i = 0; i < n; i++) {
        const w = 8 + rnd() * 5;
        const d = 9 + rnd() * 6;
        const h = 5 + rnd() * 3.5;
        const r = (rnd() < 0.5 ? 0 : Math.PI / 2) + (rnd() - 0.5) * 0.3;
        const wallCol = HOUSE_COLORS[Math.floor(rnd() * HOUSE_COLORS.length)];
        const roofCol = ROOF_COLORS[Math.floor(rnd() * ROOF_COLORS.length)];
        // Dach steht an jeder Seite 6 % über (roofGeo)
        const hx = ROOF_OVER * w;
        const hz = ROOF_OVER * d;
        const ez = Math.abs(Math.cos(r)) * hz + Math.abs(Math.sin(r)) * hx;
        for (let t = 0; t < 8; t++) {
          const x = side * (42 + rnd() * 150);
          const z = zTop - ez - rnd() * (zTop - zEnd - 2 * ez);
          const o = lot(x, z, hx, hz, r);
          if (!lots.every((p) => lotGap(p, o) >= HOUSE_GAP)) continue;
          lots.push(o);
          put('house', x, 0, z, 1, r, wallCol, w, h, d);
          put('roof', x, 0, z, 1, r, roofCol, w, h, d);
          break;
        }
      }
      for (let i = 0; i < 8; i++) {
        const s = 0.7 + rnd() * 0.5;
        const rotY = rnd() * 6;
        const R = DECID_CROWN * s + 0.3;
        for (let t = 0; t < 6; t++) {
          const x = side * (40 + rnd() * 160);
          const z = z0 - R - rnd() * (SEG - 2 * R);
          if (!lots.every((p) => lotDist(p, x, z) >= R)) continue;
          put('decid', x, 0, z, s, rotY, 0xffffff);
          break;
        }
      }
    }
    // Lärmschutzwand am Dorf (mit Lücken vor Navi-Zielen und Wahrzeichen)
    if (this.hasWall(k)) this.buildWall(slot);

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
    const furn = this.furniture(k);
    if (furn === 'gantry') {
      const g = this.acquire('gantry', () => this.makeGantry());
      this.labelGantry(g, rnd, s0 + 50);
      g.position.set(0, 0, z0 - 50);
      slot.items.push(g);
    } else if (furn === 'bridge') {
      const b = this.acquire('bridge', () => this.makeBridge());
      this.labelBridge(b, rnd);
      b.position.set(0, 0, z0 - 50);
      slot.items.push(b);
      // keine Bäume unter der Platte und in den Dämmen, keine Häuser in den Dämmen (bis 14,2 m hinter den
      // Widerlagern, 16,2 m zu den Seiten; Häuser sind bis 15 m groß)
      this.clearPlants((x, z) => x > -70 && x < 52 && Math.abs(z - (z0 - 50)) < 20, slotIdx);
      this.clearPlants((x, z) => x > -74 && x < 56 && Math.abs(z - (z0 - 50)) < 24, slotIdx, ['house', 'roof']);
    } else if (furn === 'brown') {
      // (die breiten Tafeln stünden mitten in der Lärmschutzwand, also gibt es dort keine, siehe furniture)
      const [title, sub] = BROWN[Math.floor(rnd() * BROWN.length)];
      const b = this.acquire('brown', () => this.makeBrownSign());
      b.userData.setText(title, sub);
      b.position.set(ROAD.right + 3.4, 0, z0 - 40);
      slot.items.push(b);
      this.clearPlants((x, z) => x > ROAD.right && x < ROAD.right + 8 && Math.abs(z - (z0 - 40)) < 5, slotIdx);
    } else if (furn === 'blueinfo') {
      const b = this.acquire('blueinfo', () => this.makeBlueInfo());
      b.userData.setText(rnd() < 0.5 ? ['Rastplatz', 'Schäferborn  2 km'] : ['Raststätte', 'Bananensaft  1500 m']);
      b.position.set(ROAD.right + 3.4, 0, z0 - 40);
      slot.items.push(b);
      this.clearPlants((x, z) => x > ROAD.right && x < ROAD.right + 8 && Math.abs(z - (z0 - 40)) < 5, slotIdx);
    }

    // Angefragte Orte; auch der Platz für Orte aus Nachbarsegmenten bleibt frei von Bäumen
    for (const r of this.requests) {
      if (!r.built && r.s >= s0 && r.s < s0 + SEG) this.placeRequest(slot, r);
      // (die Grundflächen reichen höchstens gut 300 m weit, siehe plantFree)
      const near = Math.abs(r.s - s0 - SEG / 2) < 400;
      const free = near && this.plantFree(r);
      if (free) this.clearPlants(free, slotIdx);
      if (near) this.clearHill(r, slotIdx);
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

  /** Was im Abschnitt k steht: Schilderbrücke, Brücke, braune oder blaue Tafel (oder nichts). */
  furniture(k) {
    if (k % 13 === 7) return 'gantry';
    if (k % 23 === 15) return 'bridge';
    // die breiten Tafeln stünden mitten in der Lärmschutzwand, also dort keine
    if (this.hasWall(k)) return null;
    if (k % 17 === 3) return 'brown';
    if (k % 29 === 11) return 'blueinfo';
    return null;
  }

  /** Hat Elsa bei Strecke s nah an der Leitplanke Platz (kein Schild, keine Brücke, keine Wand, kein anderer Ort)? */
  statueFree(s, self = null) {
    const k = Math.floor(s / SEG);
    const o = s - k * SEG;
    const furn = this.furniture(k);
    if (this.hasWall(k)) return false;
    if ((furn === 'gantry' || furn === 'bridge') && Math.abs(o - 50) < 15) return false;
    if ((furn === 'brown' || furn === 'blueinfo') && Math.abs(o - 40) < 6) return false;
    if (k % 20 === 10 && Math.abs(o - 30) < 5) return false; // Notrufsäule
    if ((k % 5 === 0 && o < 4) || ((k + 1) % 5 === 0 && o > SEG - 4)) return false; // Kilometerschild
    return !this.requests.some((q) => q !== self && Math.abs(q.s - s) < ELSA_ROOM);
  }

  /** Kommt nachträglich etwas neben eine nah am Rand stehende Elsa (Blitzer, Schild, Ziel), rückt sie nach draußen. */
  makeRoom(r) {
    for (const q of this.requests) {
      if (q.type !== 'elsa' || q.spot !== ELSA_STATUE || Math.abs(q.s - r.s) >= ELSA_ROOM) continue;
      q.spot = ELSA_FAR;
      for (const slot of this.slots) {
        for (const o of slot.items) {
          if (o.userData.requestId !== q.id) continue;
          o.position.x = ELSA_FAR.x;
          o.scale.setScalar(ELSA_FAR.scale);
        }
      }
      // ihr Platz weiter draußen ist schon frei (plantFree gilt für die ganze Grundfläche am Rand)
    }
  }

  /**
   * Platz für Brunnen oder Elsa ab Strecke s: hinten im Abschnitt, wo am Rand nichts steht, ohne
   * Lärmschutzwand und ohne Brücke, Schilderbrücke oder Tafel davor, die den Blick verdecken.
   */
  landmarkSpot(s) {
    const k0 = Math.ceil((s - LANDMARK_OFFSET) / SEG);
    for (let k = k0; k < k0 + 12; k++) {
      const at = k * SEG + LANDMARK_OFFSET;
      const furn = this.furniture(k);
      // auch keine Tafel 35 m davor: die verdeckt sie beim Heranfahren fast ganz
      if (!furn && this.statueFree(at) && !this.requests.some((q) => Math.abs(q.s - at) < 40)) return at;
    }
    return s;
  }

  /** Lage { x, scale } einer schon aufgestellten Statue (null, solange sie noch nicht steht). */
  placed(id) {
    const r = this.requests.find((q) => q.id === id);
    return (r && r.spot) || null;
  }

  /** Elsa winkt zurück (nach dem Hupen): ein paar Sekunden lang kräftig mit beiden Flossen und hüpft dabei. */
  waveBack(id) {
    for (const slot of this.slots) {
      for (const o of slot.items) if (o.userData.requestId === id && o.userData.type === 'elsaStatue') o.userData.waveT = WAVE_T;
    }
  }

  waveFins(obj, dt) {
    const u = obj.userData;
    const elsa = obj.children.find((c) => c.name === 'Elsa');
    const { finL, finR } = elsa?.userData || {};
    if (!finL || !finR) return;
    if (u.elsaY === undefined) u.elsaY = elsa.position.y;
    u.waveT = Math.max(0, u.waveT - dt);
    // weich hinein und wieder heraus; animateElsa hat die Flossen in diesem Bild schon gesetzt
    const f = Math.min(1, u.waveT / 0.5, (WAVE_T - u.waveT) / 0.25);
    const w = 0.55 + 0.45 * Math.sin(this.time * 12);
    finL.rotation.z += f * w * 0.9;
    finR.rotation.z -= f * w * 0.9;
    elsa.position.y = u.elsaY + f * Math.abs(Math.sin(this.time * 6)) * 0.1;
  }

  /** Steht in Segment k eine Lärmschutzwand? (rechts am Dorf und je ein Segment davor und danach) */
  hasWall(k) {
    if (k <= 2) return false;
    const near = this.villageSide(k - 1) || this.villageSide(k + 1);
    return this.villageSide(k) === 1 || near === 1;
  }

  /**
   * Stücke [s0, s1] der Lärmschutzwand im ganzen Wandabschnitt um Segment k, ohne die Lücken vor Navi-Zielen
   * und Wahrzeichen. Die Enden liegen auf dem 5-m-Raster der Wandfelder.
   */
  wallPieces(k) {
    let a = k;
    while (this.hasWall(a - 1)) a--;
    let b = k;
    while (this.hasWall(b + 1)) b++;
    let pieces = [[a * SEG, (b + 1) * SEG]];
    for (const r of this.requests) {
      if (!WALL_GAP.has(r.type)) continue;
      const g0 = Math.floor((r.s - GAP_BEFORE) / 5) * 5;
      const g1 = Math.ceil((r.s + GAP_AFTER) / 5) * 5;
      pieces = pieces.flatMap(([p0, p1]) => (g1 <= p0 || g0 >= p1 ? [[p0, p1]] : [[p0, Math.min(p1, g0)], [Math.max(p0, g1), p1]]));
    }
    return pieces.filter(([p0, p1]) => p1 - p0 >= WALL_MIN);
  }

  /** Lärmschutzwand eines Segments (neu) aufbauen: nur die Stücke außerhalb der Lücken, mit Endpfosten. */
  buildWall(slot) {
    const old = slot.items.findIndex((o) => o.userData.type === 'noisewall');
    if (old >= 0) {
      this.release(slot.items[old]);
      slot.items.splice(old, 1);
    }
    const s0 = slot.k * SEG;
    const s1 = s0 + SEG;
    const parts = [];
    for (const [p0, p1] of this.wallPieces(slot.k)) {
      const a = Math.max(p0, s0);
      const b = Math.min(p1, s1);
      // [Anfang, Ende, Anfang ist ein Wandende, Ende ist ein Wandende]
      if (b - a > 0.5) parts.push([a, b, a === p0, b === p1]);
    }
    if (!parts.length) return;
    const w = this.acquire('noisewall', () => this.makeNoiseWall());
    w.userData.shape(parts, s0 + SEG / 2);
    w.position.set(WALL_X, 0, -(s0 + SEG / 2));
    slot.items.push(w);
  }

  /** Bäume und Büsche (oder names) entfernen, deren Fußpunkt (x, z) test erfüllt – nur in Segment slotIdx oder überall. */
  clearPlants(test, slotIdx = -1, names = ['conifer', 'decid', 'bush']) {
    const m = new THREE.Matrix4();
    const zero = new THREE.Matrix4().makeScale(0, 0, 0);
    for (const name of names) {
      const { mesh, cap } = this.inst[name];
      const i0 = slotIdx < 0 ? 0 : slotIdx * cap;
      const i1 = slotIdx < 0 ? cap * NSLOTS : i0 + cap;
      let hit = false;
      for (let i = i0; i < i1; i++) {
        mesh.getMatrixAt(i, m);
        const e = m.elements;
        if (e[0] === 0 && e[1] === 0 && e[2] === 0) continue; // leerer Platz
        if (test(e[12], e[14])) {
          mesh.setMatrixAt(i, zero);
          hit = true;
        }
      }
      if (hit) mesh.instanceMatrix.needsUpdate = true;
    }
  }

  /** Grundfläche eines angefragten Orts, auf der keine Bäume stehen dürfen, als Test (x, z), sonst null. */
  plantFree(r) {
    const z = -r.s;
    if (WALL_GAP.has(r.type)) return (x, zz) => x > ROAD.right && x < ROAD.right + 28 && Math.abs(zz - z) < 18;
    if (r.type === 'burg') return (x, zz) => Math.hypot(x - 160, zz - (z - 60)) < 100;
    // unter den Hochhäusern und so weit daneben, wie die größten Kronen reichen
    if (r.type === 'skyline') return (x, zz) => this.underSkyline(r, x, zz, 6);
    return null;
  }

  /** Liegt (x, z) unter einem Hochhaus der Skyline von Anfrage r oder näher als m daran? */
  underSkyline(r, x, z, m) {
    return skylineTowers().some(
      (t) => Math.abs(x - SKYLINE_X - t.x) < t.w / 2 + m && Math.abs(z + r.s - t.z) < t.w / 2 + m,
    );
  }

  /**
   * Steht die Burg oder die Skyline neben einem Dorf: Häuser und Kirche, die im Burgberg oder in einem Hochhaus
   * stecken würden, abräumen (nur in Segment slotIdx oder überall). Häuser sind bis knapp 10 m (mit Dach gut 11 m),
   * die Kirche bis 14 m (gut 14,5 m) um ihren Mittelpunkt groß.
   */
  clearHill(r, slotIdx = -1) {
    let inside;
    if (r.type === 'burg') {
      const cz = -r.s - 60; // wie in placeRequest
      inside = (x, z, m) => Math.hypot(x - 160, z - cz) < HILL_R + m;
    } else if (r.type === 'skyline') inside = (x, z, m) => this.underSkyline(r, x, z, m + 1.5);
    else return;
    this.clearPlants((x, z) => inside(x, z, 10), slotIdx, ['house', 'roof']);
    this.slots.forEach((slot, i) => {
      if (slotIdx >= 0 && i !== slotIdx) return;
      slot.items = slot.items.filter((o) => {
        const buried = o.userData.type === 'church' && inside(o.position.x, o.position.z, 14);
        if (buried) this.release(o);
        return !buried;
      });
    });
  }

  /** Neues Navi-Ziel oder Wahrzeichen bei s: schon stehende Wandsegmente in der Nähe neu zuschneiden. */
  refreshWalls(s) {
    for (const slot of this.slots) {
      if (slot.k < 0 || !this.hasWall(slot.k)) continue;
      if (Math.abs(slot.k * SEG + SEG / 2 - s) < GAP_BEFORE + GAP_AFTER + SEG + WALL_MIN) this.buildWall(slot);
    }
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
      case 'elsa': {
        obj = this.acquire('elsaStatue', () => this.makeElsaStatue());
        // wo am Rand schon etwas steht (Navi-Ziel neben Schild oder Wand), weiter draußen in alter Größe
        r.spot = this.statueFree(r.s, r) ? ELSA_STATUE : ELSA_FAR;
        obj.position.set(r.spot.x, 0, z);
        obj.scale.setScalar(r.spot.scale);
        obj.userData.waveT = 0;
        this.waveFins(obj, 0); // falls sie beim Abbau gerade winkte
        this.animated.add(obj);
        break;
      }
      case 'burg':
        obj = this.acquire('burg', () => this.makeCastle());
        obj.position.set(160, 0, z - 60);
        break;
      case 'skyline':
        obj = this.acquire('skyline', () => this.makeSkyline());
        obj.position.set(SKYLINE_X, 0, z);
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
        obj.userData.flash.material.color.setScalar(1); // falls eine Fahrt mitten im Blitz endete
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
    // Bäume, die schon im Weg stehen (auch in den Nachbarsegmenten), verschwinden
    const free = this.plantFree(r);
    if (free) this.clearPlants(free);
    this.clearHill(r);
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
    // ≥ 5 cm vor dem Pfosten (auch an der schräg gestellten Kante) und mit Polygon-Offset
    const board = new THREE.Mesh(this.kmGeo.board, W.std({ ...FRONT, map: tex, roughness: 0.6 }));
    board.position.set(0, 1.35, 0.1);
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
    if (!this.mats.plate) this.mats.plate = W.std({ ...FRONT, color: 0xf2f2ef, roughness: 0.6 });
    const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.25), this.mats.plate);
    plate.position.set(0, 0.95, 0.152);
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
      // schmal genug, dass der rechte Fuß vor der Lärmschutzwand bleibt
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.5, 1.2), this.mats.concrete);
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
    // Träger hinter den Tafeln (z 0,06 … 0,18). Die Tafeln sind 16 cm tiefe Kästen, die 2 cm in ihm stecken:
    // ihre Bildseite liegt 14 cm vor ihm (statt 2 cm) und hat einen Polygon-Offset, so flimmert aus keiner
    // Entfernung der dunkle Träger durch die Schrift.
    const back = new THREE.Mesh(new THREE.BoxGeometry(15.0, 2.8, 0.12), this.mats.dark);
    back.position.set(0.075, 6.6, 0.12);
    g.add(back);
    const panelGeo = new THREE.BoxGeometry(7.2, 2.7, 0.16);
    const d = this.mats.dark;
    g.userData.panels = [];
    for (const x of [-3.75, 3.9]) {
      const face = W.std({ ...FRONT, roughness: 0.5 });
      const panel = new THREE.Mesh(panelGeo, [d, d, d, d, face, d]);
      panel.position.set(x, 6.6, 0.24);
      g.add(panel);
      g.userData.panels.push(face);
    }
    return g;
  }

  /** Navi-Ziel geändert: die Navi-Tafeln der stehenden Schilderbrücken neu beschriften. */
  relabelGantries() {
    const pool = this.pools.get('gantry');
    if (!pool || !this.gantryInfo) return;
    for (const g of pool) {
      if (g.userData.active && g.userData.sSign !== undefined) this.labelGantry(g, Math.random, g.userData.sSign, true);
    }
  }

  /** sSign: Position der Schilderbrücke (die Entfernung zum Navi-Ziel gilt ab dem Schild). */
  labelGantry(g, rnd, sSign, onlyNavi = false) {
    g.userData.sSign = sSign;
    const info = this.gantryInfo(sSign);
    const [a, b] = g.userData.panels;
    const kmTxt = (km) => km.toLocaleString('de-DE', { maximumFractionDigits: km < 10 ? 1 : 0 }) + ' km';
    // keine Stadt doppelt: weder auf beiden Tafeln noch zusätzlich zum Navi-Ziel
    const pool = PLACES.filter((p) => !info || p !== info.target);
    const p1 = pick(pool);
    let p2 = pick(pool);
    while (p2 === p1) p2 = pick(pool);
    let p0 = pick(pool);
    while (p0 === p1 || p0 === p2) p0 = pick(pool);
    // liegt das Navi-Ziel schon vor dem Schild, zeigt es einfach zwei Orte
    const tA = info
      ? signTexture([{ left: info.target, right: kmTxt(info.km) }, { left: 'Navi-Ziel', right: '↑' }], { w: 768, h: 288, arrows: null })
      : signTexture([{ left: p0, right: kmTxt(3 + Math.floor(rnd() * 20)) }, { left: 'Rastanlage', right: kmTxt(1 + Math.floor(rnd() * 9)) }], { w: 768, h: 288, arrows: null });
    const tB = signTexture([{ left: p1, right: kmTxt(5 + Math.floor(rnd() * 60)) }, { left: p2, right: kmTxt(30 + Math.floor(rnd() * 120)) }], { w: 768, h: 288, arrows: null });
    for (const [m, t] of onlyNavi ? [[a, tA]] : [[a, tA], [b, tB]]) {
      if (m.map) m.map.dispose();
      m.map = t;
      m.needsUpdate = true;
    }
  }

  makeBridge() {
    const g = new THREE.Group();
    const c = this.mats.concrete;
    // Die Platte reicht von Widerlager zu Widerlager (Vorderseiten symmetrisch zur Mittelleitplanke)
    const x1 = 34;
    const x0 = ONCOMING(x1);
    // Unterseite etwas dunkler (liegt im Schatten) – als Material der Unterseite, nicht als zweite Fläche davor
    const deck = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 1.1, 11, 20, 1, 1), [c, c, c, this.mats.concreteDark, c, c]);
    deck.position.set((x0 + x1) / 2, 6.35, 0);
    deck.castShadow = true;
    deck.receiveShadow = true;
    g.add(deck);
    // Pfeiler nur neben den Fahrbahnen: einer im schmalen Mittelstreifen stünde mitten in den Leitplanken.
    // Rechts mit Platz für die Lärmschutzwand davor.
    for (const x of [ROAD.right + 3.5, ONCOMING(ROAD.right + 3.5)]) {
      for (const z of [-3.2, 3.2]) {
        const p = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.6, 5.8, 12), c);
        p.position.set(x, 2.9, z);
        p.castShadow = true;
        g.add(p);
      }
    }
    // Widerlager: Betonwand zur Autobahn, dahinter ein Damm mit Grasböschungen
    for (const dir of [1, -1]) {
      const [wall, bank] = this.makeAbutment(dir > 0 ? x1 : x0, dir);
      g.add(wall, bank);
    }
    for (const z of [-5.4, 5.4]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 0.1, 0.1), this.mats.steel);
      rail.position.set((x0 + x1) / 2, 7.95, z);
      g.add(rail);
      for (let x = x0 + 1.25; x <= x1 - 1.2; x += 2.5) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.0, 0.06), this.mats.steel);
        post.position.set(x, 7.4, z);
        g.add(post);
      }
    }
    // 12 cm vor der Stirnseite der Platte und mit Polygon-Offset (sonst flimmert sie ab ≈ 650 m durch)
    const banner = new THREE.Mesh(new THREE.PlaneGeometry(9, 1.5, 8, 1), W.std({ ...FRONT, side: THREE.DoubleSide, roughness: 0.9 }));
    banner.position.set(-1.5, 6.9, 5.62);
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

  /**
   * Widerlager am Brückenende: Betonwand mit der Vorderseite bei x = xf (zur Autobahn hin), oben so breit wie die
   * Platte, an den Seiten mit der Böschung (1 : 1,5) abgeschrägt; dahinter (Richtung dir) der Damm, oben ein
   * kurzes Plateau knapp unter der Wandkrone, nach hinten und zu den Seiten Grasböschungen bis zum Boden.
   */
  makeAbutment(xf, dir) {
    const T = 0.9; // Wandstärke
    const top = 6.9; // Wandkrone = Oberseite der Platte
    const hw = 5.9; // halbe Kronenbreite (Platte: 5,5)
    const run = 1.5 * top;
    const X = (u) => xf + dir * u;
    const face = (u) => [[X(u), 0, -(hw + run)], [X(u), 0, hw + run], [X(u), top, hw], [X(u), top, -hw]];
    const wallPolys = [
      { pts: face(0), out: [-dir, 0, 0] },
      { pts: face(T), out: [dir, 0, 0] },
      { pts: [[X(0), top, -hw], [X(0), top, hw], [X(T), top, hw], [X(T), top, -hw]], out: [0, 1, 0] },
    ];
    for (const sz of [1, -1]) {
      wallPolys.push({ pts: [[X(0), top, sz * hw], [X(0), 0, sz * (hw + run)], [X(T), 0, sz * (hw + run)], [X(T), top, sz * hw]], out: [0, 1, sz] });
    }
    const wall = new THREE.Mesh(polyGeometry(wallPolys, () => [0, 0]), this.mats.concrete);
    wall.castShadow = true;
    wall.receiveShadow = true;
    // Damm: Plateau 5 cm unter der Wandkrone (keine gleich hohen Flächen), 3 m tief
    const h = top - 0.05;
    const L = 3;
    const r = 1.5 * h;
    const P = (u, y, z) => [X(u), y, z];
    const t1 = P(T, h, -hw);
    const t2 = P(T, h, hw);
    const t3 = P(T + L, h, hw);
    const t4 = P(T + L, h, -hw);
    const b1 = P(T, 0, -(hw + r));
    const b2 = P(T, 0, hw + r);
    const b3 = P(T + L + r, 0, hw + r);
    const b4 = P(T + L + r, 0, -(hw + r));
    const bankPolys = [
      { pts: [t1, t2, t3, t4], out: [0, 1, 0] },
      { pts: [t2, b2, b3, t3], out: [0, 1, 1] },
      { pts: [t4, t3, b3, b4], out: [dir, 1, 0] },
      { pts: [t1, t4, b4, b1], out: [0, 1, -1] },
    ];
    // Gras wie am Bankett (6 m pro Kachel); auf den Böschungen entlang der Falllinie gemessen
    const uvFn = ([x, y, z], out) => (out[0] === 0 && out[2] === 0 ? [x / 6, z / 6] : out[2] !== 0 ? [x / 6, (y * 1.8) / 6] : [z / 6, (y * 1.8) / 6]);
    const bank = new THREE.Mesh(polyGeometry(bankPolys, uvFn), this.mats.grass);
    bank.castShadow = true;
    bank.receiveShadow = true;
    return [wall, bank];
  }

  makeBrownSign() {
    const g = new THREE.Group();
    for (const x of [-1.3, 1.3]) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.8, 0.1), this.mats.steel);
      p.position.set(x, 1.9, 0);
      g.add(p);
    }
    const face = this.signBoard(g, 3.4, 2.1, 2.75);
    g.rotation.y = -0.12;
    g.userData.setText = (title, sub) => {
      face.map = this.canvasTexFrom('brown:' + title, () => brownSignTexture(title, sub));
      face.needsUpdate = true;
    };
    return g;
  }

  /**
   * Schildtafel auf zwei Pfosten (Vorderseite der Pfosten bei z = 0,05): ein 5 cm dicker Kasten, Rückseite 1 cm vor
   * den Pfosten, die Bildseite also 6 cm davor und mit Polygon-Offset. Gibt das Material der Bildseite zurück.
   */
  signBoard(g, w, h, y) {
    if (!this.signEdgeGeo) this.signEdgeGeo = new Map();
    const key = w + 'x' + h;
    if (!this.signEdgeGeo.has(key)) this.signEdgeGeo.set(key, new THREE.BoxGeometry(w, h, 0.05));
    const face = W.std({ ...FRONT, roughness: 0.6 });
    const s = this.mats.steel;
    const board = new THREE.Mesh(this.signEdgeGeo.get(key), [s, s, s, s, face, s]);
    board.position.set(0, y, 0.085);
    g.add(board);
    return face;
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
    const face = this.signBoard(g, 3.4, 1.8, 2.7);
    g.rotation.y = -0.12;
    g.userData.setText = (lines) => {
      face.map = this.canvasTexFrom('blue:' + lines.join('|'), () => signTexture(lines, { w: 512, h: 272 }));
      face.needsUpdate = true;
    };
    return g;
  }

  makeSpeedSign(limit) {
    const g = new THREE.Group();
    const tex = speedSignTexture(limit);
    const mat = W.std({ ...FRONT, map: tex, transparent: true, alphaTest: 0.4, roughness: 0.5 });
    for (const x of [ROAD.right + 1.3, MEDIAN_X]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.6, 6), this.mats.steel);
      post.position.set(x, 1.3, 0);
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.0), mat);
      sign.position.set(x, 2.5, 0.1);
      g.add(post, sign);
    }
    return g;
  }

  makeBlitzer() {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.55, 2.7, 0.55), W.std({ color: 0x9da3a8, metalness: 0.4, roughness: 0.5 }));
    body.position.y = 1.35;
    // Fenster 1,5 cm vor dem Gehäuse (statt 5 mm) und mit Polygon-Offset
    const win = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.5), W.std({ ...FRONT, color: 0x101418, metalness: 0.8, roughness: 0.1 }));
    win.position.set(0, 2.2, 0.29);
    const flash = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.2), W.basic({ ...FRONT, color: 0xffffff }));
    flash.position.set(0, 1.75, 0.29);
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
    // Blätter 45 cm vor der Gondel (die Nabe steckt in ihr), sonst flimmern ihre Wurzeln in der Ferne mit ihr
    const rotor = new THREE.Group();
    rotor.position.set(0, 93, 4.7);
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
    // Walmdach über dem Schiff: die vierseitige Pyramide zuerst drehen (Kanten parallel zu den Wänden) und erst dann
    // längs strecken – andersherum wurde daraus eine schiefe Raute, deren Ecken 5 m neben dem Schiff in der Luft hingen
    const roof = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 6.8, 5, 4, 1).rotateY(Math.PI / 4), this.mats.redRoof);
    roof.scale.set(1, 1, 2.0);
    roof.position.set(0, 10.5, 4);
    const tower = new THREE.Mesh(new THREE.BoxGeometry(4.5, 20, 4.5), wall);
    tower.position.set(0, 10, -7);
    const spire = new THREE.Mesh(new THREE.ConeGeometry(3.4, 10, 4), W.std({ color: 0x3e5e52, roughness: 0.7 }));
    spire.rotation.y = Math.PI / 4;
    spire.position.set(0, 25, -7);
    const clock = new THREE.Mesh(new THREE.CircleGeometry(0.9, 16), W.std({ ...FRONT, color: 0x1a1a1a }));
    clock.position.set(0, 16, -4.69);
    g.add(nave, roof, tower, spire, clock);
    g.traverse((o) => o.isMesh && (o.castShadow = true));
    return g;
  }

  /** Lärmschutzwand eines Segments; die Form kommt erst mit userData.shape (Lücken, Endpfosten). */
  makeNoiseWall() {
    if (!this.mats.noiseWall) {
      // ein Wandfeld (5 m) pro Texturkachel, links der Pfosten-Streifen
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
        t.anisotropy = 4;
        return t;
      });
      this.mats.noiseWall = W.std({ map: tex, roughness: 0.8 });
      this.mats.wallPost = W.std({ color: 0x5b6168, metalness: 0.4, roughness: 0.55 });
      this.wallPostGeo = new THREE.BoxGeometry(0.42, 4.45, 0.24);
      this.wallPostGeo.translate(0, 2.225, 0);
    }
    const g = new THREE.Group();
    const wall = new THREE.Mesh(new THREE.BufferGeometry(), this.mats.noiseWall);
    wall.castShadow = true;
    wall.receiveShadow = true;
    const posts = new THREE.Mesh(new THREE.BufferGeometry(), this.mats.wallPost);
    posts.castShadow = true;
    g.add(wall, posts);
    // parts: [s0, s1, Anfang offen, Ende offen] in Strecken-Metern, mid: Segmentmitte (dort steht die Gruppe)
    g.userData.shape = (parts, mid) => {
      const walls = [];
      const ends = [];
      for (const [a, b, openA, openB] of parts) {
        const len = b - a;
        const c = (a + b) / 2;
        const geo = new THREE.BoxGeometry(0.3, 4.2, len, 1, 1, Math.max(1, Math.round(len / 5)));
        // Textur an der Strecke festgemacht: die Wandfelder laufen über Segmentgrenzen und Lücken hinweg weiter
        const pos = geo.attributes.position;
        const uv = geo.attributes.uv;
        const nrm = geo.attributes.normal;
        for (let i = 0; i < pos.count; i++) {
          uv.setXY(i, (c - pos.getZ(i)) / 5, nrm.getY(i) > 0.5 ? 0.97 : (pos.getY(i) + 2.1) / 4.2);
        }
        geo.translate(0, 2.1, mid - c);
        walls.push(geo);
        // ein Stahlpfosten über jedem Wandende (deckt die Stirnseite ab)
        for (const [open, s] of [[openA, a], [openB, b]]) {
          if (open) ends.push(this.wallPostGeo.clone().translate(0, 0, mid - s));
        }
      }
      wall.geometry.dispose();
      wall.geometry = mergeGeometries(walls);
      posts.geometry.dispose();
      posts.geometry = ends.length ? mergeGeometries(ends) : new THREE.BufferGeometry();
      posts.visible = ends.length > 0;
      for (const x of [...walls, ...ends]) x.dispose();
    };
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
      // ganz füllen (undurchsichtiges Schild: durchsichtige Ecken würden schwarz)
      ctx.fillStyle = '#3a1f63';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#ffd84a';
      // Arial Black ist breiter als Arial: beide Zeilen notfalls etwas kleiner, damit nichts am Rand abreißt
      ctx.font = 'bold 84px Arial Black, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      fitTextCenter(ctx, 'BrunnenTV', w / 2, h * 0.42, w - 40);
      ctx.fillStyle = '#ffffff';
      ctx.font = '34px Arial, sans-serif';
      fitTextCenter(ctx, 'mit Herrn Schönnbrun ⛲', w / 2, h * 0.78, w - 40);
    });
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.25), W.std({ ...FRONT, map: tex, roughness: 0.5 }));
    sign.position.set(-4.2, 2.3, 1.5);
    sign.rotation.y = 0.5;
    // der Pfosten steht ≈ 9 cm hinter dem schräg gestellten Schild (vorher ragte seine Kante bis 7 mm heran)
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.8, 0.12), this.mats.steel);
    post.position.set(-4.2, 0.9, 1.3);
    g.add(basin, rim, water, column, bowl, jet, fall, sign, post);
    g.userData.animate = (t) => {
      jet.scale.y = 1 + Math.sin(t * 7) * 0.08;
      fall.scale.x = fall.scale.z = 1 + Math.sin(t * 5) * 0.03;
    };
    return g;
  }

  makeElsaStatue() {
    const g = new THREE.Group();
    // Sockel: 20-Eck mit einer Ecke bei Winkel 0 (+z), Radius unten 2.1, oben 1.8
    const PED_SEG = 20;
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.1, 1.2, PED_SEG), this.mats.stone);
    ped.position.y = 0.6;
    ped.castShadow = true; // wie Elsa obendrauf, sonst hängt ihr Schatten losgelöst im Gras
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
    // Das Schild schmiegt sich an den Sockel: ein Stück Kegelmantel über vier Sockelflächen, die Ecken
    // auf den Sockelecken, damit es überall gleich weit (≈ 2 cm) vor dem Stein sitzt. Mitte bei
    // -π/5 ≈ -0.6, also unter Elsas Blick zur Straße. Die Textur läuft mit dem Winkel, von außen
    // gelesen also von links nach rechts; die runden Ecken der Textur werden ausgestanzt. Ein
    // Polygon-Offset hält es auch aus der Ferne flimmerfrei vor dem Stein.
    const facet = (Math.PI * 2) / PED_SEG;
    const pedR = (y) => 2.1 - (0.3 * y) / 1.2; // Eckradius des Sockels in Höhe y
    const signH = 0.76; // 4 Flächen ≈ 2.43 m breit, also 3.2 : 1 wie die Textur
    const signY = 0.7;
    const gap = 0.021; // an den Ecken gemessen, senkrecht zur Fläche ≈ 2 cm
    const signGeo = new THREE.CylinderGeometry(pedR(signY + signH / 2) + gap, pedR(signY - signH / 2) + gap, signH, 4, 1, true, -4 * facet, 4 * facet);
    const sign = new THREE.Mesh(signGeo, W.std({ map: tex, alphaTest: 0.5, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -4 }));
    sign.position.y = signY;
    g.add(ped, elsa, sign);
    g.userData.animate = (t) => animateElsa(elsa, t);
    return g;
  }

  makeCastle() {
    const g = new THREE.Group();
    // Burgberg mit rundem Gipfelplateau (r = 24 m, die Türme reichen bis 21,8 m): Bergfried, Türme und Mauern
    // stehen ab y = 42 auf festem Boden und stecken 0,6 m darin (vorher endete der Berg spitz bei y = 42).
    const prof = [[97, 0], [90, 4], [78, 12.5], [62, 24], [46, 34.5], [34, 40.4], [28, 42.2], [24, 42.6], [0, 42.6]];
    const hill = new THREE.Mesh(new THREE.LatheGeometry(prof.map(([r, y]) => new THREE.Vector2(r, y)), 24), W.lambert({ color: 0x5c8640 }));
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
    const mats = [this.mats.glassBlue, W.std({ color: 0xb9c2cc, metalness: 0.5, roughness: 0.3 }), W.std({ color: 0x6f7a86, metalness: 0.6, roughness: 0.25 })];
    skylineTowers().forEach(({ x, z, w, h }, i) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), mats[i % 3]);
      b.position.set(x, h / 2, z);
      g.add(b);
      if (i === 7) {
        const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 1.2, 50, 6), this.mats.steel);
        ant.position.set(x, h + 25, z);
        g.add(ant);
      }
    });
    return g;
  }

  makeSparkasse() {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(14, 7, 10), W.std({ color: 0xe9e6df, roughness: 0.85 }));
    body.position.y = 3.5;
    // Fensterband 2,5 cm vor der Fassade mit Polygon-Offset; Schriftzug als 12 cm tiefer Kasten
    const win = new THREE.Mesh(new THREE.PlaneGeometry(12, 3), W.std({ ...FRONT, color: 0x5f7fa3, metalness: 0.8, roughness: 0.15, envMapIntensity: 1.2 }));
    win.position.set(0, 2.2, 5.025);
    const face = W.std({ ...FRONT, roughness: 0.5 });
    const edge = this.mats.white;
    const panel = new THREE.Mesh(new THREE.BoxGeometry(8, 1.6, 0.12), [edge, edge, edge, edge, face, edge]);
    panel.position.set(0, 6, 5.07);
    g.add(body, win, panel);
    g.rotation.y = -Math.PI / 2 + 0.25;
    g.userData.setColor = (color) => {
      const tex = this.canvasTex('spk:' + color, 512, 100, (ctx, w, h) => {
        // helle Schrift (die Bank ist weiß) steht auf Blaugrau, sonst verschwände sie auf dem weißen Schild
        const light = [1, 3, 5].reduce((a, i) => a + parseInt(color.slice(i, i + 2), 16), 0) > 600;
        ctx.fillStyle = light ? '#5f7fa3' : '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = color;
        ctx.font = 'bold 54px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Bank am Markt', w / 2, h / 2 + 3);
      });
      face.map = tex;
      face.needsUpdate = true;
    };
    return g;
  }

  makeKiosk() {
    const g = new THREE.Group();
    // Versatz wie beim Stahl: das Dach der Bude, flach von der Seite gesehen, stach sonst als heller Punkt durch das
    // Vordach, das ihm aufliegt
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(5, 3, 4),
      W.std({ color: 0xf0e0b0, roughness: 0.8, polygonOffset: true, polygonOffsetFactor: 2, polygonOffsetUnits: 0 }),
    );
    body.position.y = 1.5;
    const awning = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.2, 1.6), W.std({ color: 0xd22020, roughness: 0.7 }));
    awning.position.set(0, 2.8, 2.6);
    awning.rotation.x = 0.25;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 7, 8), this.mats.steel);
    pole.position.set(-3.6, 3.5, 1);
    // Tafel als 6 cm tiefer Kasten direkt vor dem Mast (Bildseite 6 cm vor ihm, mit Polygon-Offset)
    const face = W.std({ ...FRONT, roughness: 0.5 });
    const st = this.mats.steel;
    const panel = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.8, 0.06), [st, st, st, st, face, st]);
    panel.position.set(-3.6, 6.4, 1.15);
    g.add(body, awning, pole, panel);
    g.rotation.y = -0.4;
    g.userData.setText = (title, sub) => {
      const tex = this.canvasTex('kiosk:' + title + sub, 512, 288, (ctx, w, h) => {
        // ganz füllen (undurchsichtige Tafel: durchsichtige Ecken würden schwarz), der rote Rahmen bleibt rund
        ctx.fillStyle = '#fff4d0';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = '#d22020';
        ctx.lineWidth = 12;
        roundRect(ctx, 8, 8, w - 16, h - 16, 20);
        ctx.stroke();
        // beide Zeilen passen mit Abstand in den Rahmen (innen 484 px), notfalls etwas kleiner
        ctx.fillStyle = '#b31515';
        ctx.font = 'bold 72px Arial Black, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        fitTextCenter(ctx, title, w / 2, h * 0.4, w - 60);
        ctx.fillStyle = '#333';
        ctx.font = 'bold 38px Arial, sans-serif';
        fitTextCenter(ctx, sub, w / 2, h * 0.75, w - 60);
      });
      face.map = tex;
      face.needsUpdate = true;
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
      // das rote Band 2 cm über den Seiten der Säule (statt 5 mm) und mit Polygon-Offset
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.39, 0.25, 0.39), W.std({ ...FRONT, color: 0xd01c1c, emissive: 0x500000 }));
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
    // overbid: das Ziel wurde überboten, bevor man ankam (siehe retireZiel)
    g.userData.setText = (title, overbid = false) => {
      const key = (overbid ? 'zielx:' : 'ziel:') + title;
      const head = overbid ? 'Überboten:' : 'Ziel erreicht:';
      panel.material.map = this.canvasTexFrom(key, () => signTexture([head, title], { w: 512, h: 196, bg: '#1d7a3a' }));
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

