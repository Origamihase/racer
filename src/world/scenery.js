// Landschaft entlang der Autobahn: Wälder, Felder, Dörfer, Windräder, Brücken mit Fan-Bannern,
// Schilderbrücken (ihre Tafeln beschriftet die Welt), Kilometerschilder, Blitzer
// und Wahrzeichen am Rand (Brunnen für BrunnenTV, Elsa).
// Die Welt ist in 100-m-Segmente geteilt, die vor dem Spieler neu gebaut werden.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { W } from '../curve.js';
import {
  ROAD, signTexture, speedSignTexture, roundRect, grassTexture, fitTextCenter, masonryTexture,
} from '../textures.js';
import { colorize } from '../models/loft.js';
import { buildElsa, animateElsa } from '../models/elsa.js';
import { mulberry32, fbm1, smoothstep } from '../util.js';
import { MEDIAN_X, ONCOMING, GRASS_TINT } from './road.js';
import { dropInGeo } from './kit/nature.js';
import { box, rod, ball, lathe, bar, sweep, move, fuse, tone, blend } from './kit/shapes.js';
import { PAL } from './kit/palette.js';
import { bakenBetween } from './baustelle-plan.js';
import { fieldTexture, FIELD_V } from './xxl/fieldtex.js';
import { CROPS } from './xxl/fieldplan.js';
import { LAYER } from './xxl/ground.js';

export const SEG = 100;
// Äcker neben der Autobahn (XXL, wo die Karte Ackerland zeigt): Felder in Zellen längs der Strecke (Länge FC.len mit
// festem Zufall, über Abschnittsgrenzen hinweg), zwei Reihen tief, ab x0 von der Fahrbahnmitte; Raine dazwischen
const FC = { len: 140, jit: 0.4, rain: 3, x0: [37, 19], depth: [55, 130], quads: 900 };
const fhash = (i, j) => {
  let h = Math.imul(i ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(j + 0x632be5ab, 0xc2b2ae35);
  h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d);
  return ((h ^ (h >>> 13)) >>> 0) / 4294967296;
};
/** Grenze der Feldzelle i (Strecke s). */
const fcEdge = (i) => i * FC.len + (fhash(i, 7) - 0.5) * FC.jit * FC.len;
const AHEAD = 17;
const BEHIND = 2;
const NSLOTS = AHEAD + BEHIND + 1;
// leerer Platz im Vorrat der Bäume und Häuser (Größe 0)
const ZERO = new THREE.Matrix4().makeScale(0, 0, 0);

// Elsa-Statue: aus Mini Adams Sicht deckt der Innenspiegel rechts oben etwa 17–41° ab. Nah hinter der
// Leitplanke (der Sockel bleibt gut einen halben Meter hinter den Leitpfosten) und etwas größer als früher
// steht sie beim Heranfahren lange links vom Spiegel im freien Teil der Scheibe und ist dort gut zu erkennen.
export const ELSA_STATUE = { x: ROAD.right + 4.55, scale: 1.4 };
const ELSA_FAR = { x: ROAD.right + 8, scale: 1 }; // wo am Rand kein Platz ist: weiter draußen in alter Größe
const ELSA_ROOM = 12; // so viel Abstand (m) braucht sie am Rand zu Schildern, Blitzern und anderen Orten
// Freier Platz im Abschnitt: hinter Notrufsäule (30 m), Tafeln (40 m) und Brücken (50 m)
const LANDMARK_OFFSET = 75;
// Wo die Bestellungen des Spiels am Rand stehen (x quer zur Fahrbahn; placeRequest): Brunnen, Elsa (nah oder weiter
// draußen), Blitzer, Tempo-Schild (zwei Pfosten: rechts und am Mittelstreifen)
const FOUNTAIN_X = ROAD.right + 9;
const LANDMARK_X = [FOUNTAIN_X, ELSA_STATUE.x, ELSA_FAR.x];
const UEWAGEN_X = ROAD.right + 4.5; // Übertragungswagen (Memes): gleich hinter der Leitplanke
const REQUEST_X = { uewagen: [UEWAGEN_X], brunnen: [FOUNTAIN_X], elsa: [ELSA_STATUE.x, ELSA_FAR.x], blitzer: [ROAD.right + 1.6], speed: [ROAD.right + 1.3, MEDIAN_X], bauSchild: [ROAD.right + 1.3, MEDIAN_X] };
const WAVE_T = 2.6; // so lange winkt Elsa zurück (s)

// Bildseiten von Schildern, Tafeln und Fenstern vor einer Fläche: Die Tiefenauflösung reicht in 450 m
// Entfernung nur noch für ≈ 5 cm (in 1,5 km für ≈ 50 cm). Der Polygon-Offset zieht die Bildseite um ein paar
// Tiefenstufen nach vorne, damit nichts dahinter durchflimmert, egal wie weit weg.
const FRONT = { polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -4 };

// Lärmschutzwand am Dorf: Mitte der 0,3 m dicken Wand. Davor bleibt Platz für den Blitzer (bis +1,95 m) und
// den Fuß der Schilderbrücke (bis +2,05 m), dahinter für die Brückenpfeiler (ab +2,9 m).
const WALL_X = ROAD.right + 2.35;
// Vor Wahrzeichen rechts der Fahrbahn bleibt die Wand offen: ab 140 m davor, damit man sie aus dem Cockpit schon
// aus ≈ 250 m sieht, bis 25 m dahinter. Kürzere Reststücke als 20 m entfallen.
const WALL_GAP = new Set(['brunnen', 'elsa', 'uewagen']);
const GAP_BEFORE = 140;
const GAP_AFTER = 25;
const WALL_MIN = 20;
// Dorf: Grundriss der Kirche (makeChurch: Turm mit Helm bis −9,4 m, Dach bis +13,6 m, 4,8 m zu den Seiten),
// halbe Dachfläche eines Hauses (roofGeo steht 6 % über), Abstand zwischen zwei Häusern, Kronenradius des
// Laubbaums (decidGeo) bei Maßstab 1 und so viel Platz bleibt an den Dorfenden für die Kronen der Bäume draußen
const CHURCH_LOT = { z: 2.1, hx: 4.85, hz: 11.55 };
const ROOF_OVER = 0.56;
const HOUSE_GAP = 1.2;
const DECID_CROWN = 3.35;
const TREE_ROOM = 6;

const BANNERS = [
  'Grüße an Mini Adam!', 'Linke Spur freischalten: jetzt!', 'BrunnenTV Fanclub', 'Walte Walte Walte', 'Elsa ❤',
  'Ehrenmenschen-Brücke', 'Rechts fahren, Adam!', 'Wir streamen in Full HD', 'Live-Eskalationen immer woanders',
  'Ringtennis-Verein grüßt', 'Danke für alles ❤', 'Bimmel hurra!', 'Kanalpunkte-Wette läuft',
];

// ---------------------------------------------------------------------------
// Geometrien für Instanzen: aus dem Natur-Baukasten (gleicher Ursprung, gleiche Maße wie die alten Klötze).
// Exportiert, weil auch andere Teile der Welt (z. B. der Wald der XXL-Welt) mit denselben Bausteinen bauen.
export const coniferGeo = () => dropInGeo('conifer');
export const decidGeo = () => dropInGeo('decid');
export const bushGeo = () => dropInGeo('bush');
export const houseGeo = () => dropInGeo('house');
export const roofGeo = () => dropInGeo('roof');

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

const TREE_TINTS = [0xffffff, 0xe0f0e0, 0xc8e0c8, 0xf0ffe0, 0xd0e8d8, 0xfff4dc];
const HOUSE_COLORS = PAL.wall;
const ROOF_COLORS = PAL.roof;

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
    this.mats.field = W.lambert({ map: fieldTexture(), vertexColors: true, side: THREE.DoubleSide, ...LAYER.patch });
    // Gebiete anderer Straßen (Keil an Knotenpunkten, vor dem Anfang und hinter dem Ende der Autobahn) bleiben frei
    // (setzt die Welt). keepOut(x, s) → true: dort steht nichts · noCross(s0, s1) → true: keine Brücken,
    // Schilderbrücken und Lärmschutzwände in diesem Stück. null = alles erlaubt.
    this.keepOut = null;
    this.noCross = null;
    // XXL: Landschaft der Karte neben der Autobahn (world/xxl/landcover.js): coverKind(s, side) → 'wald' | 'dorf' |
    // 'feld' | 'wiese' oder null (keine Daten: dann Zufall wie früher), undefined (dort ist noch keine Strecke geplant). Wald und Dörfer stehen so, wie das Navi sie zeigt.
    this.coverKind = null;
    this.kindCache = new Map();
    // die Welt beschriftet die Schilderbrücken (COMMON.md 9: kein Zufallstext auf Schildern): gantryTexts(sSign) →
    // {a, b} (Zeilen {left, right} der beiden Tafeln) oder null (dann steht dort keine Schilderbrücke)
    this.gantryTexts = () => null;

    this.makeInstanced();
  }

  /** XXL: Abschnitte ab Strecke sFrom beim nächsten update neu bauen (neue Knotenpunkte in der Ferne). */
  invalidate(sFrom) {
    for (const slot of this.slots) if (slot.k * SEG >= sFrom) slot.k = -1;
    for (const k of [...this.kindCache.keys()]) if (k * SEG >= sFrom - SEG) this.kindCache.delete(k);
  }

  makeInstanced() {
    const mat = W.lambert({ vertexColors: true });
    const defs = {
      conifer: [coniferGeo(), 150],
      decid: [decidGeo(), 110],
      bush: [bushGeo(), 50],
      house: [houseGeo(), 34],
      roof: [roofGeo(), 34],
    };
    this.inst = {};
    // Jeder Abschnitt hat feste Plätze (cap je Art) in einem Vorrat (mat, col); gezeichnet werden davon nur die besetzten,
    // dicht hintereinander in der Reihenfolge der Plätze (pack). Früher liefen alle Plätze durch die Grafikkarte, die
    // leeren als Punkt ohne Größe: gut 1,2 Mio. Dreiecke je Durchgang (Sicht, Rückspiegel, Schatten), obwohl meist
    // nur ein Viertel bis ein Drittel davon steht.
    for (const [name, [geo, cap]] of Object.entries(defs)) {
      const m = name === 'house' ? W.lambert({ vertexColors: true }) : mat;
      const mesh = new THREE.InstancedMesh(geo, m, cap * NSLOTS);
      mesh.frustumCulled = false;
      mesh.castShadow = true;
      mesh.receiveShadow = name === 'house' || name === 'roof';
      mesh.setColorAt(0, new THREE.Color(1, 1, 1));
      mesh.count = 0;
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      this.track.add(mesh);
      const store = { mat: new Float32Array(cap * NSLOTS * 16), col: new Float32Array(cap * NSLOTS * 3).fill(1) };
      for (let i = 0; i < cap * NSLOTS; i++) ZERO.toArray(store.mat, i * 16);
      this.inst[name] = { mesh, cap, ...store };
    }
    this.instDirty = false;
  }

  /** Die besetzten Plätze aller Arten dicht in die Netze legen (nach jeder Änderung, vor dem nächsten Bild). */
  pack() {
    this.instDirty = false;
    for (const def of Object.values(this.inst)) {
      const { mesh, mat, col } = def;
      const M = mesh.instanceMatrix;
      const C = mesh.instanceColor;
      const total = def.cap * NSLOTS;
      let n = 0;
      for (let i = 0; i < total; i++) {
        const o = i * 16;
        if (mat[o] === 0 && mat[o + 1] === 0 && mat[o + 2] === 0) continue; // leerer Platz
        M.array.set(mat.subarray(o, o + 16), n * 16);
        C.array.set(col.subarray(i * 3, i * 3 + 3), n * 3);
        n++;
      }
      mesh.count = n;
      // hochgeladen wird nur, was gezeichnet wird
      M.clearUpdateRanges();
      M.addUpdateRange(0, Math.max(1, n) * 16);
      M.needsUpdate = true;
      C.clearUpdateRanges();
      C.addUpdateRange(0, Math.max(1, n) * 3);
      C.needsUpdate = true;
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
    if (type !== 'elsa') this.makeRoom(r);
    // und eine schon stehende Lärmschutzwand davor öffnen
    if (WALL_GAP.has(type)) this.refreshWalls(s);
    return id;
  }

  /** Alles abbauen (neue Fahrt beginnt wieder bei 0 km). */
  reset() {
    this.kindCache.clear();
    for (const slot of this.slots) {
      for (const it of slot.items) this.release(it);
      slot.items = [];
      slot.k = -1;
    }
    this.requests = [];
  }

  // --- Segment-Aufbau ------------------------------------------------------
  update(s, dt) {
    this.updating = true;
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
    this.updating = false;
    if (this.instDirty) this.pack();
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
    // Äcker dieses Abschnitts (je Seite, wo die Karte Ackerland zeigt): Rechtecke [x0, x1, s0, s1]
    const fields = this.planFields(k);
    const inFields = (x, z, r) => {
      const ss = -z;
      for (const f of fields) if (x > f[0] - r && x < f[1] + r && ss > f[2] - r && ss < f[3] + r) return true;
      return false;
    };
    const put = (name, x, y, z, scale, rotY, color, sx, sy, sz) => {
      const def = this.inst[name];
      const n = counts[name];
      if (n >= def.cap) return false;
      if (this.keepOut && this.keepOut(x, -z)) return false;
      if (fields.length && name !== 'house' && name !== 'roof' && inFields(x, z, 2.5)) return false;
      counts[name]++;
      q.setFromAxisAngle(up, rotY);
      sc.set(sx ?? scale, sy ?? scale, sz ?? scale);
      m4.compose(v.set(x, y, z), q, sc);
      const i = slotIdx * def.cap + n;
      m4.toArray(def.mat, i * 16);
      col.setHex(color).toArray(def.col, i * 3);
      return true;
    };

    // Charakter des Abschnitts
    const village = this.villageSide(k);
    for (const side of [1, -1]) {
      const seed = side > 0 ? 11 : 23;
      // Landschaft der Karte (XXL) oder, ohne Daten, ein ruhiges Rauschen
      const kind = this.kinds(k)[side > 0 ? 1 : 0];
      const forest = kind ? (kind === 'wald' ? 1 : kind === 'wiese' ? 0.22 : 0.08) : smoothstep(0.05, 0.38, fbm1(k / 9, seed));
      const xMin = side > 0 ? 17 : 34;
      if (village === side) continue;
      // Wald: wo die Karte Wald zeigt ein dichter Bestand bis an den Rand, sonst Baumgruppen in der Flur
      const wood = kind === 'wald';
      const nForest = Math.floor(forest * (wood ? 120 : 46));
      for (let i = 0; i < nForest; i++) {
        const x = side * (xMin + (wood ? 1.5 : 4) + Math.pow(rnd(), wood ? 0.85 : 0.7) * 120);
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
    if (fields.length) this.buildFields(slot, fields);
    // Lärmschutzwand am Dorf (mit Lücken vor Wahrzeichen)
    const cross = !this.noCross || !this.noCross(s0 - 60, s0 + SEG + 60);
    if (this.hasWall(k) && cross) this.buildWall(slot);

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
    // Schilderbrücke mit Entfernungstafeln aus der Fahrt
    // (keine Brücken über die Fahrbahn an Knotenpunkten)
    const furn = this.furniture(k);
    const gTexts = furn === 'gantry' && cross ? this.gantryTexts(s0 + 50) : null;
    if (gTexts) {
      const g = this.acquire('gantry', () => this.makeGantry());
      this.labelGantryWith(g, gTexts, s0 + 50);
      g.position.set(0, 0, z0 - 50);
      slot.items.push(g);
    } else if (furn === 'bridge' && cross) {
      const b = this.acquire('bridge', () => this.makeBridge());
      this.labelBridge(b, rnd);
      b.position.set(0, 0, z0 - 50);
      slot.items.push(b);
      // keine Bäume unter der Platte und in den Dämmen, keine Häuser in den Dämmen (bis 14,2 m hinter den
      // Widerlagern, 16,2 m zu den Seiten; Häuser sind bis 15 m groß)
      this.clearPlants((x, z) => x > -70 && x < 52 && Math.abs(z - (z0 - 50)) < 20, slotIdx);
      this.clearPlants((x, z) => x > -74 && x < 56 && Math.abs(z - (z0 - 50)) < 24, slotIdx, ['house', 'roof']);
    }

    // Angefragte Orte (auch schon einmal gebaute: invalidate baut ihren Abschnitt neu, und der Abbau oben hat sie
    // weggeräumt); auch der Platz für Orte aus Nachbarsegmenten bleibt frei von Bäumen
    for (const r of this.requests) {
      if (r.s >= s0 && r.s < s0 + SEG) this.placeRequest(slot, r);
      // (die Grundflächen reichen keine 30 m weit, siehe plantFree)
      const near = Math.abs(r.s - s0 - SEG / 2) < 400;
      const free = near && this.plantFree(r);
      if (free) this.clearPlants(free, slotIdx);
    }

    // XXL: was auf fremdem Gebiet stünde (Schilder, Windräder, Wahrzeichen …), bleibt unsichtbar
    if (this.keepOut) {
      for (const it of slot.items) {
        if (!this.keepOut(it.position.x, -it.position.z)) continue;
        it.visible = false;
        // eine Bestellung des Spiels: Es soll sie nicht mehr ansagen (blocked)
        const r = it.userData.requestId && this.requests.find((q) => q.id === it.userData.requestId);
        if (r) r.blocked = true;
      }
    }

    for (const name of Object.keys(this.inst)) {
      const def = this.inst[name];
      for (let n = counts[name]; n < def.cap; n++) ZERO.toArray(def.mat, (slotIdx * def.cap + n) * 16);
    }
    this.instDirty = true;
  }

  /**
   * Äcker im Abschnitt k: je Seite mit Ackerland (kinds) die Feldzellen, die ihn berühren, auf ihn zugeschnitten, in
   * zwei Reihen quer zur Straße: [[x0, x1, s0, s1, Feldfrucht, längs]]. Rein aus Zahlen (fester Zufall je Zelle), so
   * passen die Stücke zweier Abschnitte aneinander.
   */
  planFields(k) {
    const out = [];
    const kinds = this.kinds(k);
    const s0 = k * SEG;
    const s1 = s0 + SEG;
    if (this.villageSide(k)) return out;
    for (const side of [-1, 1]) {
      if (kinds[side > 0 ? 1 : 0] !== 'feld') continue;
      const sd = side > 0 ? 1 : 2;
      let i = Math.floor(s0 / FC.len) - 1;
      while (fcEdge(i + 1) <= s0) i++;
      for (; fcEdge(i) < s1; i++) {
        const a = Math.max(s0, fcEdge(i) + FC.rain / 2);
        const b = Math.min(s1, fcEdge(i + 1) - FC.rain / 2);
        if (b - a < 0.5) continue;
        const x0 = FC.x0[side > 0 ? 1 : 0] + fhash(i, sd * 11) * 4;
        const d1 = FC.depth[0] + fhash(i, sd * 13) * (FC.depth[1] - FC.depth[0]);
        const d2 = FC.depth[0] + fhash(i, sd * 17) * (FC.depth[1] - FC.depth[0]);
        const crop = (r) => {
          let w = r * CROPS.reduce((q, c) => q + c.w, 0);
          for (let c = 0; c < CROPS.length; c++) if ((w -= CROPS[c].w) <= 0) return c;
          return 0;
        };
        const rows = [[x0, x0 + d1, crop(fhash(i, sd * 19)), fhash(i, sd * 23) < 0.6]];
        if (fhash(i, sd * 29) < 0.75) rows.push([x0 + d1 + FC.rain, x0 + d1 + FC.rain + d2, crop(fhash(i, sd * 31)), fhash(i, sd * 37) < 0.6]);
        for (const [n0, n1, c, along] of rows) {
          const xa = side * n0;
          const xb = side * n1;
          out.push([Math.min(xa, xb), Math.max(xa, xb), a, b, c, along, i * 2 + (n0 > x0 ? 1 : 0)]);
        }
      }
    }
    return out;
  }

  /** Die Äcker eines Abschnitts als eine Fläche (gebogen wie alles: alle 10 m längs, alle 20 m quer eine Stütze). */
  buildFields(slot, fields) {
    const m = this.acquire('fields', () => {
      const geo = new THREE.BufferGeometry();
      const nv = FC.quads * 4;
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(nv * 3), 3).setUsage(THREE.DynamicDrawUsage));
      geo.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(nv * 3), 3));
      geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(nv * 2), 2).setUsage(THREE.DynamicDrawUsage));
      geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(nv * 3), 3).setUsage(THREE.DynamicDrawUsage));
      const idx = new Uint32Array(FC.quads * 6);
      for (let q = 0; q < FC.quads; q++) idx.set([q * 4, q * 4 + 1, q * 4 + 2, q * 4, q * 4 + 2, q * 4 + 3], q * 6);
      geo.setIndex(new THREE.BufferAttribute(idx, 1));
      const nrm = geo.attributes.normal;
      for (let v = 0; v < nv; v++) nrm.setXYZ(v, 0, 1, 0);
      const mesh = new THREE.Mesh(geo, this.mats.field);
      mesh.frustumCulled = false;
      mesh.receiveShadow = true;
      mesh.name = 'Äcker';
      return mesh;
    });
    const geo = m.geometry;
    const P = geo.attributes.position;
    const U = geo.attributes.uv;
    const C = geo.attributes.color;
    const col = new THREE.Color();
    let q = 0;
    for (const [x0, x1, a, b, c, along, id] of fields) {
      const cr = CROPS[c];
      const j = fhash(id, 41);
      col.setRGB(cr.rgb[0] * (0.92 + j * 0.14), cr.rgb[1] * (0.92 + j * 0.12), cr.rgb[2] * (0.94 + j * 0.1), THREE.SRGBColorSpace);
      const ns = Math.max(1, Math.ceil((b - a) / 10));
      const nx = Math.max(1, Math.ceil((x1 - x0) / 20));
      for (let iz = 0; iz < ns; iz++) {
        for (let ix = 0; ix < nx; ix++) {
          if (q >= FC.quads) break;
          const sA = a + ((b - a) * iz) / ns;
          const sB = a + ((b - a) * (iz + 1)) / ns;
          const xA = x0 + ((x1 - x0) * ix) / nx;
          const xB = x0 + ((x1 - x0) * (ix + 1)) / nx;
          const corners = [[xA, sA], [xB, sA], [xB, sB], [xA, sB]];
          for (let v = 0; v < 4; v++) {
            const [x, ss] = corners[v];
            const vi = q * 4 + v;
            P.setXYZ(vi, x, -0.02, -ss);
            const d = Math.abs(x);
            U.setXY(vi, along ? d / cr.row : ss / cr.row, along ? ss / FIELD_V : d / FIELD_V);
            C.setXYZ(vi, col.r, col.g, col.b);
          }
          q++;
        }
      }
    }
    geo.setDrawRange(0, q * 6);
    P.needsUpdate = true;
    U.needsUpdate = true;
    C.needsUpdate = true;
    slot.items.push(m);
  }

  /** Landschaft der Karte im Abschnitt k: [links, rechts] (Art oder null), zwischengespeichert. */
  kinds(k) {
    let v = this.kindCache.get(k);
    if (!v) {
      const s = k * SEG + SEG / 2;
      v = this.coverKind ? [this.coverKind(s, -1), this.coverKind(s, 1)] : [null, null];
      // undefined: die Strecke dort ist noch nicht geplant – nicht merken, später noch einmal fragen
      if (v[0] === undefined || v[1] === undefined) return [v[0] ?? null, v[1] ?? null];
      this.kindCache.set(k, v);
      if (this.kindCache.size > 400) this.kindCache.delete(this.kindCache.keys().next().value);
    }
    return v;
  }

  villageSide(k) {
    if (k < 4) return 0;
    // XXL mit Landschaft der Karte: Dörfer stehen nur dort, wo die Karte Siedlung zeigt
    const [l, r] = this.kinds(k);
    if (l || r) return r === 'dorf' ? 1 : l === 'dorf' ? -1 : 0;
    if (k % 37 === 5 || k % 37 === 6) return 1;
    if (k % 53 === 20 || k % 53 === 21) return -1;
    return 0;
  }

  /** Was im Abschnitt k über die Fahrbahn reicht: Schilderbrücke, Brücke (oder nichts). */
  furniture(k) {
    if (k % 13 === 7) return 'gantry';
    if (k % 23 === 15) return 'bridge';
    return null;
  }

  /** Hat Elsa bei Strecke s nah an der Leitplanke Platz (kein Schild, keine Brücke, keine Wand, kein anderer Ort)? */
  statueFree(s, self = null) {
    const k = Math.floor(s / SEG);
    const o = s - k * SEG;
    const furn = this.furniture(k);
    if (this.hasWall(k)) return false;
    if ((furn === 'gantry' || furn === 'bridge') && Math.abs(o - 50) < 15) return false;
    if (k % 20 === 10 && Math.abs(o - 30) < 5) return false; // Notrufsäule
    if ((k % 5 === 0 && o < 4) || ((k + 1) % 5 === 0 && o > SEG - 4)) return false; // Kilometerschild
    return !this.requests.some((q) => q !== self && Math.abs(q.s - s) < ELSA_ROOM);
  }

  /** Kommt nachträglich etwas neben eine nah am Rand stehende Elsa (Blitzer, Schild), rückt sie nach draußen. */
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
      if (!furn && this.statueFree(at) && !this.requests.some((q) => Math.abs(q.s - at) < 40) && this.edgeFree(LANDMARK_X, at)) return at;
    }
    return s;
  }

  /** Steht an Strecke s an keiner der Stellen xs fremdes Gebiet (Rampe, hinter dem Ende der Autobahn, Tafel)? */
  edgeFree(xs, s) {
    return !this.keepOut || !xs.some((x) => this.keepOut(x, s));
  }

  /**
   * Konnte die Bestellung id nicht stehen (fremdes Gebiet, siehe keepOut)? Dann weiß das Spiel, dass es sie nicht
   * ansagen und nicht prüfen darf (ein Brunnen, den niemand sieht; ein Blitzer auf einer Rampe).
   */
  blocked(id) {
    const r = this.requests.find((q) => q.id === id);
    return !!(r && r.blocked);
  }

  /** Lage { x, scale } einer schon aufgestellten Statue (null, solange sie noch nicht steht). */
  placed(id) {
    const r = this.requests.find((q) => q.id === id);
    return (r && r.spot) || null;
  }

  /** Elsa winkt zurück (nach dem Hupen): ein paar Sekunden lang kräftig mit beiden Armen und hüpft dabei. */
  waveBack(id) {
    for (const slot of this.slots) {
      for (const o of slot.items) if (o.userData.requestId === id && o.userData.type === 'elsaStatue') o.userData.waveT = WAVE_T;
    }
  }

  waveFins(obj, dt) {
    const u = obj.userData;
    const elsa = obj.children.find((c) => c.name === 'Elsa');
    const { armL, armR } = elsa?.userData || {};
    if (!armL || !armR) return;
    if (u.elsaY === undefined) u.elsaY = elsa.position.y;
    u.waveT = Math.max(0, u.waveT - dt);
    // weich hinein und wieder heraus; animateElsa hat die Arme in diesem Bild schon gesetzt
    const f = Math.min(1, u.waveT / 0.5, (WAVE_T - u.waveT) / 0.25);
    const w = 0.55 + 0.45 * Math.sin(this.time * 12);
    armL.rotation.z += f * w * 0.9;
    armR.rotation.z -= f * w * 0.9;
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
    for (const name of names) {
      const { mat, cap } = this.inst[name];
      const i0 = slotIdx < 0 ? 0 : slotIdx * cap;
      const i1 = slotIdx < 0 ? cap * NSLOTS : i0 + cap;
      let hit = false;
      for (let i = i0; i < i1; i++) {
        const o = i * 16;
        if (mat[o] === 0 && mat[o + 1] === 0 && mat[o + 2] === 0) continue; // leerer Platz
        if (test(mat[o + 12], mat[o + 14])) {
          ZERO.toArray(mat, o);
          hit = true;
        }
      }
      if (hit) this.instDirty = true;
    }
    // außerhalb von update (eine Bestellung mitten im Bild) gleich neu legen, sonst am Ende von update
    if (this.instDirty && !this.updating) this.pack();
  }

  /** Grundfläche eines angefragten Orts, auf der keine Bäume stehen dürfen, als Test (x, z), sonst null. */
  plantFree(r) {
    const z = -r.s;
    if (WALL_GAP.has(r.type)) return (x, zz) => x > ROAD.right && x < ROAD.right + 28 && Math.abs(zz - z) < 18;
    return null;
  }

  /** Neues Wahrzeichen bei s: schon stehende Wandsegmente in der Nähe neu zuschneiden. */
  refreshWalls(s) {
    for (const slot of this.slots) {
      if (slot.k < 0 || !this.hasWall(slot.k)) continue;
      if (Math.abs(slot.k * SEG + SEG / 2 - s) < GAP_BEFORE + GAP_AFTER + SEG + WALL_MIN) this.buildWall(slot);
    }
  }

  placeRequest(slot, r) {
    r.built = true;
    const z = -r.s;
    // auf fremdem Gebiet (Rampe, hinter dem Ende der Autobahn) steht nichts – wie alles andere am Rand (buildSlot)
    if (!this.edgeFree(REQUEST_X[r.type] || [0], r.s)) {
      r.blocked = true;
      return;
    }
    let obj = null;
    switch (r.type) {
      case 'brunnen':
        obj = this.acquire('brunnen', () => this.makeFountain());
        obj.position.set(FOUNTAIN_X, 0, z);
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
      // Übertragungswagen (Memes, memes.js): längs der Straße, die Schrift zur Fahrbahn, die Kamera auf den Wagen
      case 'uewagen':
        obj = this.acquire('uewagen', () => this.makeUeWagen());
        obj.position.set(UEWAGEN_X, 0, z);
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
      // Baustelle (world/baustelle-plan.js): die Leitbaken eines Stücks (data.k: das wievielte 100-m-Stück ab dem
      // Beginn; jedes Stück sieht in jeder Baustelle gleich aus) und das Warnschild davor
      case 'baken':
        obj = this.acquire('baken:' + r.data.k, () => this.makeBaken(r.data.k));
        obj.position.set(0, 0, z);
        break;
      case 'bauSchild':
        obj = this.acquire('bauSchild', () => this.makeBauSchild());
        obj.position.set(0, 0, z);
        break;
      default:
        return;
    }
    obj.userData.requestId = r.id;
    slot.items.push(obj);
    // Bäume, die schon im Weg stehen (auch in den Nachbarsegmenten), verschwinden
    const free = this.plantFree(r);
    if (free) this.clearPlants(free);
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
    if (!this.mats.gantry) {
      // Rahmen, Füße und Rückwand als ein Stück mit Eckfarben; der Versatz wie beim Stahl (siehe mats.steel) hält
      // die Pfosten hinter den Tafeln. Die Tafeln: fünf Seiten im Rahmenton, die Bildseite (+z) zuletzt, so ist
      // jede Tafel zwei Draw-Calls statt sechs.
      this.mats.gantry = W.std({ vertexColors: true, metalness: 0.3, roughness: 0.5, polygonOffset: true, polygonOffsetFactor: 2, polygonOffsetUnits: 0 });
      this.mats.panelEdge = W.std({ color: PAL.darkMetal, roughness: 0.6 });
      this.panelGeo = new THREE.BoxGeometry(7.2, 2.7, 0.16);
      const idx = Array.from(this.panelGeo.index.array);
      this.panelGeo.setIndex([...idx.slice(0, 24), ...idx.slice(30, 36), ...idx.slice(24, 30)]);
      this.panelGeo.clearGroups();
      this.panelGeo.addGroup(0, 30, 0);
      this.panelGeo.addGroup(30, 6, 1);
    }
    const g = new THREE.Group();
    const xl = MEDIAN_X - 0.4;
    const xr = ROAD.right + 1.6;
    const STEEL = PAL.steel;
    const parts = [];
    for (const x of [xl, xr]) {
      // schmal genug, dass der rechte Fuß vor der Lärmschutzwand bleibt; Stütze mit Fußplatte und Kappe
      parts.push(box(0.9, 0.5, 1.2, { round: 0.08, at: [x, 0, 0], col: PAL.concrete, ao: 0.3 }));
      parts.push(box(0.7, 0.06, 0.7, { round: 0.02, at: [x, 0.5, 0], col: tone(STEEL, 0.8), ao: 0 }));
      parts.push(box(0.5, 6.84, 0.5, { round: 0.1, rs: 2, at: [x, 0.56, 0], col: [tone(STEEL, 0.84), tone(STEEL, 1.05)], ao: 0.12 }));
      parts.push(box(0.58, 0.08, 0.58, { round: 0.03, at: [x, 7.4, 0], col: tone(STEEL, 1.08), ao: 0 }));
    }
    // Fachwerkträger: zwei Gurte und dazwischen Streben im Zickzack
    const span = xr - xl;
    for (const y of [6.3, 7.2]) parts.push(bar([xl, y, 0], [xr, y, 0], 0.11, { seg: 8, hs: 6, col: STEEL, ao: 0 }));
    for (let i = 0; i < 12; i++) {
      const a = xl + (span * i) / 12;
      const b = xl + (span * (i + 1)) / 12;
      const [ya, yb] = i % 2 ? [7.2, 6.3] : [6.3, 7.2];
      parts.push(bar([a, ya, 0], [b, yb, 0], 0.045, { seg: 6, col: tone(STEEL, 0.94), ao: 0 }));
    }
    // Träger hinter den Tafeln (z 0,06 … 0,18), freundlich grau statt schwarz. Die Tafeln sind 16 cm tiefe Kästen,
    // die 2 cm in ihm stecken: ihre Bildseite liegt 14 cm vor ihm (statt 2 cm) und hat einen Polygon-Offset, so
    // flimmert aus keiner Entfernung der Träger durch die Schrift.
    parts.push(box(15.0, 2.8, 0.12, { at: [0.075, 5.2, 0.12], col: [0x69727c, 0x8a939d], ao: 0 }));
    const frame = new THREE.Mesh(fuse(parts), this.mats.gantry);
    frame.castShadow = true;
    g.add(frame);
    g.userData.panels = [];
    for (const x of [-3.75, 3.9]) {
      const face = W.std({ ...FRONT, roughness: 0.5 });
      const panel = new THREE.Mesh(this.panelGeo, [this.mats.panelEdge, face]);
      panel.position.set(x, 6.6, 0.24);
      g.add(panel);
      g.userData.panels.push(face);
    }
    return g;
  }

  /** Beide Tafeln mit festen Zeilen beschriften ({a, b} aus gantryTexts). */
  labelGantryWith(g, t, sSign) {
    g.userData.sSign = sSign;
    g.userData.texts = t;
    const [a, b] = g.userData.panels;
    for (const [m, rows] of [[a, t.a], [b, t.b]]) {
      if (m.map) m.map.dispose();
      m.map = signTexture(rows, { w: 768, h: 288, arrows: null });
      m.needsUpdate = true;
    }
  }

  makeBridge() {
    if (!this.mats.bridge) {
      // Platte, Pfeiler, Geländer und Blumenkästen tragen ihre Farben in den Ecken: die ganze Brücke ist so ein
      // Draw-Call (früher einer je Geländerpfosten); dazu die Widerlager aus Sandstein und die Grasdämme
      this.mats.bridge = W.std({ vertexColors: true, roughness: 0.85 });
      this.mats.masonry = W.std({ map: masonryTexture(), roughness: 0.95 });
    }
    const g = new THREE.Group();
    // Die Platte reicht von Widerlager zu Widerlager (Vorderseiten symmetrisch zur Mittelleitplanke)
    const x1 = 34;
    const x0 = ONCOMING(x1);
    const n = 20;
    // Querschnitt der 1,1 m dicken Platte (halb, von der Mitte der Unterseite zur Mitte der Fahrbahn): unten weich
    // gerundete Kanten, oben die helle Kappe mit dem Geländer, 8 cm vorstehend mit einer feinen Schattenkante. Die
    // Unterseite ist bläulich getönt: dorthin kommt nur Licht vom grünen Boden, das sie sonst oliv färbte.
    const UNDER = 0xaea2de;
    const FACE = 0xc4b294;
    const CAP = 0xe2d8c3;
    const half = [[5.8, 0, -1, 0, UNDER]];
    for (let i = 0; i <= 4; i++) {
      const a = (-Math.PI / 2) * (1 - i / 4);
      half.push([6 + 0.2 * Math.sin(a), 5.3 + 0.2 * Math.cos(a), Math.sin(a), Math.cos(a), blend(UNDER, FACE, i / 4)]);
    }
    half.push([6.52, 5.5, 0, 1, FACE], [6.52, 5.5, -1, 0, blend(UNDER, CAP, 0.3)], [6.52, 5.58, -1, 0, blend(UNDER, CAP, 0.3)]);
    half.push([6.52, 5.58, 0, 1, CAP]);
    for (let i = 0; i <= 2; i++) {
      const a = (Math.PI / 2) * (i / 2);
      half.push([6.84 + 0.06 * Math.sin(a), 5.52 + 0.06 * Math.cos(a), Math.sin(a), Math.cos(a), CAP]);
    }
    half.push([6.9, 4.1, 1, 0, CAP], [6.9, 4.1, 1, 0, PAL.asphalt], [6.9, 0, 1, 0, PAL.asphalt]);
    const profile = [...half, ...half.map(([y, z, ny, nz, c]) => [y, -z, ny, -nz, c]).reverse()];
    const parts = [sweep(profile, x0, x1, n)];
    // Pfeiler nur neben den Fahrbahnen: einer im schmalen Mittelstreifen stünde mitten in den Leitplanken.
    // Rechts mit Platz für die Lärmschutzwand davor. Runde Säulen auf einem Sockel, oben ein Kapitell, das die
    // Platte weich aufnimmt (es steckt ein paar Zentimeter in ihr).
    const pillar = [
      lathe([[0.8, 0], [0.8, 0.22], [0.74, 0.32], [0.62, 0.38]], { seg: 16, col: tone(PAL.stone, 0.96), ao: 0.18 }),
      lathe([[0.62, 0.38], [0.58, 0.46], [0.55, 5.05]], { seg: 16, col: [tone(FACE, 0.92), FACE], ao: 0.06 }),
      lathe([[0.55, 5.05], [0.6, 5.22], [0.71, 5.37], [0.79, 5.5], [0.82, 5.62], [0.82, 5.86]], { seg: 16, col: CAP, ao: 0 }),
    ];
    for (const x of [ROAD.right + 3.5, ONCOMING(ROAD.right + 3.5)]) {
      for (const z of [-3.2, 3.2]) parts.push(move(pillar, { at: [x, 0, z] }));
    }
    // Geländer in freundlichem Grün: Handlauf, Knieholm und Pfosten alle 2,5 m, an beiden Enden ein Endpfosten
    const RAIL = 0x5f9f92;
    const shade = { ao: 0.12, y0: 6.9, y1: 8 };
    for (const z of [-5.4, 5.4]) {
      parts.push(bar([x0 + 0.2, 7.95, z], [x1 - 0.2, 7.95, z], 0.06, { seg: 8, hs: n, col: tone(RAIL, 1.1), ...shade }));
      parts.push(bar([x0 + 0.2, 7.45, z], [x1 - 0.2, 7.45, z], 0.035, { seg: 6, hs: n, col: RAIL, ...shade }));
      for (const x of [x0 + 0.2, x1 - 0.2]) parts.push(box(0.12, 1.12, 0.12, { at: [x, 6.9, z], col: RAIL, ...shade }));
      for (let x = x0 + 1.25; x <= x1 - 1.2; x += 2.5) parts.push(box(0.09, 1.05, 0.08, { at: [x, 6.9, z], col: RAIL, ...shade }));
    }
    // Blumenkästen außen am Geländer zur Fahrt hin, je mitten zwischen zwei Pfosten und nicht dort, wo das
    // Transparent hängen kann (x −16,5 … 12,5): Terrakottakasten mit hellem Rand, Blattpolster, rote und rosa
    // Geranien, vorn hängt etwas Grün über
    const BLOOM = [PAL.red, 0xf6a3bd, PAL.red, 0xfdfbf5, 0xf6a3bd, PAL.red, 0xf6a3bd];
    const flowerBox = [
      box(1.4, 0.3, 0.3, { round: 0.04, at: [0, -0.3, 0], col: [tone(PAL.brick, 0.85), PAL.brick], ao: 0 }),
      box(1.46, 0.05, 0.36, { at: [0, -0.04, 0], col: tone(PAL.brick, 1.18), ao: 0 }),
    ];
    for (let i = 0; i < 3; i++) flowerBox.push(ball(0.3, { flat: 0.6, s: [1, 0.55, 0.7], at: [-0.45 + i * 0.45, 0.02, 0], col: [tone(PAL.crown[2], 0.9), PAL.crown[1]], ao: 0 }));
    BLOOM.forEach((col, i) => {
      const u = -0.6 + (i * 1.2) / (BLOOM.length - 1);
      flowerBox.push(ball(0.085, { at: [u, 0.17 + 0.03 * Math.cos(i * 2.1), 0.05 * Math.sin(i * 2.7)], col, ao: 0 }));
    });
    for (const u of [-0.42, 0.05, 0.5]) flowerBox.push(ball(0.1, { s: [1.4, 1, 0.6], at: [u, -0.06, 0.17], col: [tone(PAL.crown[0], 0.8), PAL.crown[0]], ao: 0 }));
    for (const x of [18, 25.5, -37, -44.5]) parts.push(move(flowerBox, { at: [x, 7.55, 5.62] }));
    const body = new THREE.Mesh(fuse(parts), this.mats.bridge);
    body.castShadow = true;
    body.receiveShadow = true;
    g.add(body);
    // Widerlager: Sandsteinwand zur Autobahn, dahinter ein Damm mit Grasböschungen
    const ends = [this.makeAbutment(x1, 1), this.makeAbutment(x0, -1)];
    const wall = new THREE.Mesh(mergeGeometries(ends.map((e) => e[0])), this.mats.masonry);
    const bank = new THREE.Mesh(mergeGeometries(ends.map((e) => e[1])), this.mats.grass);
    for (const m of [wall, bank]) {
      m.castShadow = true;
      m.receiveShadow = true;
      g.add(m);
    }
    // 12 cm vor der Kappe und mit Polygon-Offset (sonst flimmert sie ab ≈ 650 m durch)
    const banner = new THREE.Mesh(new THREE.PlaneGeometry(9, 1.5, 8, 1), W.std({ ...FRONT, side: THREE.DoubleSide, roughness: 0.9 }));
    banner.position.set(-1.5, 6.9, 5.7);
    g.add(banner);
    g.userData.banner = banner;
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
   * Widerlager am Brückenende: Sandsteinwand mit der Vorderseite bei x = xf (zur Autobahn hin), oben so breit wie die
   * Platte, an den Seiten mit der Böschung (1 : 1,5) abgeschrägt; dahinter (Richtung dir) der Damm, oben ein
   * kurzes Plateau knapp unter der Wandkrone, nach hinten und zu den Seiten Grasböschungen bis zum Boden.
   * Gibt die Geometrien [Wand, Damm] zurück (makeBridge fasst beide Enden zusammen).
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
    // Mauerwerk (Kachel 3,6 m): die Lagen laufen waagerecht und die oberste schließt mit der Krone ab; auf den
    // schrägen Kronen liegen die Steine wie Abdeckplatten quer zur Falllinie
    const S = 3.6;
    const wallUv = ([x, y, z], out) => {
      if (out[0] !== 0) return [z / S, (y - top) / S];
      if (out[2] === 0) return [z / S, x / S];
      return [x / S, Math.hypot(top - y, Math.abs(z) - hw) / S];
    };
    const wall = polyGeometry(wallPolys, wallUv);
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
    return [wall, polyGeometry(bankPolys, uvFn)];
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

  /**
   * Die Leitbaken des k-ten 100-m-Stücks einer Baustelle: rot-weiß gestreifte Tafeln auf schwarzem Fuß, oben eine
   * gelbe Warnleuchte – alles in drei Meshes (Tafeln, Füße, Leuchten). Die Streifen fallen zur Fahrbahn hin ab.
   */
  makeBaken(k) {
    if (!this.mats.bake) {
      const tex = this.canvasTex('leitbake', 64, 256, (ctx, w, h) => {
        ctx.fillStyle = '#f4f4f0';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#d0202a';
        for (let i = -2; i < 8; i++) {
          ctx.beginPath();
          ctx.moveTo(0, i * 40);
          ctx.lineTo(w, i * 40 + 34);
          ctx.lineTo(w, i * 40 + 54);
          ctx.lineTo(0, i * 40 + 20);
          ctx.fill();
        }
        ctx.strokeStyle = '#9a9a96';
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, w, h);
      });
      this.mats.bake = W.std({ map: tex, roughness: 0.45, side: THREE.DoubleSide });
      this.mats.bakeFoot = W.std({ vertexColors: true, roughness: 0.85 });
      this.mats.bakeLamp = W.basic({ color: 0xffc21a });
    }
    const plates = [];
    const feet = [];
    const lamps = [];
    const plate = new THREE.PlaneGeometry(0.25, 1.0);
    plate.translate(0, 0.78, 0);
    const foot = box(0.42, 0.1, 0.62, { col: 0x1c1c1e });
    const post = box(0.05, 0.3, 0.05, { col: 0x2a2a2c });
    const lamp = new THREE.CylinderGeometry(0.09, 0.09, 0.07, 10);
    lamp.rotateX(Math.PI / 2);
    for (const b of bakenBetween(k * 100, (k + 1) * 100)) {
      const z = -(b.u - k * 100);
      // (die Streifen fallen nach außen hin ab: links gespiegelt)
      plates.push(move(plate, { at: [b.x, 0, z], s: [b.side < 0 ? -1 : 1, 1, 1] }));
      feet.push(move([foot, post], { at: [b.x, 0, z] }));
      lamps.push(move(lamp, { at: [b.x, 1.38, z] }));
    }
    const g = new THREE.Group();
    if (!plates.length) return g;
    g.add(new THREE.Mesh(mergeGeometries(plates.flat()), this.mats.bake));
    g.add(new THREE.Mesh(fuse(feet), this.mats.bakeFoot));
    g.add(new THREE.Mesh(mergeGeometries(lamps.flat()), this.mats.bakeLamp));
    return g;
  }

  /** Warnschild „Baustelle“ (Zeichen 123) rechts und am Mittelstreifen, mit dem Zusatz „1 km“ darunter. */
  makeBauSchild() {
    const tex = this.canvasTex('bauSchild', 256, 300, (ctx, w) => {
      ctx.clearRect(0, 0, w, 300);
      ctx.fillStyle = '#c8102e';
      ctx.beginPath();
      ctx.moveTo(128, 6);
      ctx.lineTo(250, 220);
      ctx.lineTo(6, 220);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(128, 40);
      ctx.lineTo(220, 202);
      ctx.lineTo(36, 202);
      ctx.closePath();
      ctx.fill();
      // der Arbeiter mit der Schaufel am Haufen
      ctx.fillStyle = '#111';
      ctx.strokeStyle = '#111';
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(112, 108, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 11;
      ctx.beginPath();
      ctx.moveTo(108, 122);
      ctx.lineTo(118, 158);
      ctx.lineTo(104, 190);
      ctx.moveTo(118, 158);
      ctx.lineTo(132, 188);
      ctx.moveTo(110, 128);
      ctx.lineTo(140, 150);
      ctx.stroke();
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(128, 136);
      ctx.lineTo(160, 176);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(150, 194);
      ctx.quadraticCurveTo(176, 160, 200, 194);
      ctx.closePath();
      ctx.fill();
      // Zusatzzeichen
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(58, 232, 140, 60);
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 4;
      ctx.strokeRect(58, 232, 140, 60);
      ctx.fillStyle = '#111';
      ctx.font = 'bold 40px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('1 km', 128, 263);
    });
    const mat = W.std({ ...FRONT, map: tex, transparent: true, alphaTest: 0.4, roughness: 0.5 });
    const g = new THREE.Group();
    for (const x of [ROAD.right + 1.3, MEDIAN_X]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.9, 6), this.mats.steel);
      post.position.set(x, 1.45, 0);
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.4), mat);
      sign.position.set(x, 2.45, 0.1);
      g.add(post, sign);
    }
    return g;
  }

  /**
   * Übertragungswagen eines Lokalsenders (Memes: Adam schlich sich in Quizshow, Bundesliga und Lokalzeit): weißer
   * Kastenwagen (6,2 m, Front in Fahrtrichtung, −z), Sat-Schüssel auf dem Dach, Aufschrift „LOKAL-TV · LIVE“ zur
   * Fahrbahn (−x), davor eine Kamera auf dem Stativ mit rotem Licht, die auf die Straße zielt. Keine echte Marke.
   */
  makeUeWagen() {
    const g = new THREE.Group();
    const white = W.std({ color: 0xf1f1ee, roughness: 0.45, metalness: 0.1 });
    const dark = W.std({ color: 0x24262b, roughness: 0.6 });
    const glass = W.std({ color: 0x1b2430, roughness: 0.15, metalness: 0.6 });
    // Kasten und Fahrerhaus
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.5, 4.4), white);
    body.position.set(0, 1.65, 0.8);
    const cab = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.8, 1.8), white);
    cab.position.set(0, 1.3, -2.3);
    const hood = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.9, 0.6), white);
    hood.position.set(0, 0.85, -3.4);
    const wind = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 0.8), W.std({ ...FRONT, color: 0x1b2430, roughness: 0.15, metalness: 0.6 }));
    wind.position.set(0, 1.75, -3.21);
    wind.rotation.set(-0.35, Math.PI, 0);
    const side = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.7), glass);
    side.position.set(-1.06, 1.75, -2.4);
    side.rotation.y = -Math.PI / 2;
    const wheels = [];
    for (const [x, z] of [[-1.0, -2.7], [1.0, -2.7], [-1.0, 1.9], [1.0, 1.9]]) {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.3, 14), dark);
      w.rotation.z = Math.PI / 2;
      w.position.set(x, 0.42, z);
      wheels.push(w);
    }
    // Aufschrift auf der Seite zur Fahrbahn und hinten
    const tex = this.canvasTex('uewagen', 512, 256, (ctx, w, h) => {
      ctx.fillStyle = '#f1f1ee';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#1f5fbf';
      ctx.fillRect(0, h * 0.68, w, h * 0.14);
      ctx.fillStyle = '#e5483a';
      ctx.fillRect(0, h * 0.84, w, h * 0.05);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#1f5fbf';
      ctx.font = 'bold 92px Arial Black, Arial, sans-serif';
      fitTextCenter(ctx, 'LOKAL-TV', w / 2, h * 0.3, w - 40);
      ctx.fillStyle = '#e5483a';
      ctx.font = 'bold 54px Arial, sans-serif';
      fitTextCenter(ctx, '● LIVE', w / 2, h * 0.56, w - 40);
    });
    const label = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 2.1), W.std({ ...FRONT, map: tex, roughness: 0.5 }));
    label.position.set(-1.105, 1.65, 0.8);
    label.rotation.y = -Math.PI / 2;
    const back = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 1.0), W.std({ ...FRONT, map: tex, roughness: 0.5 }));
    back.position.set(0, 1.9, 3.005);
    // ausgefahrener Teleskopmast mit Sat-Schüssel: ragt weit über das Dach, so sieht man den Wagen schon von fern
    // (auch über Innenspiegel und Bildschirm hinweg)
    const mast = new THREE.Group();
    for (const [r, y0, y1] of [[0.11, 2.9, 5.2], [0.08, 5.2, 7.2], [0.06, 7.2, 8.6]]) {
      const seg = new THREE.Mesh(new THREE.CylinderGeometry(r, r, y1 - y0, 10), this.mats.steel);
      seg.position.y = (y0 + y1) / 2;
      mast.add(seg);
    }
    mast.position.set(0.3, 0, 1.8);
    const dish = new THREE.Mesh(new THREE.SphereGeometry(0.95, 20, 8, 0, Math.PI * 2, 0, 0.75), W.std({ color: 0xe9eaec, roughness: 0.35, side: THREE.DoubleSide }));
    dish.position.set(0.3, 8.75, 1.8);
    dish.rotation.set(0.5, 0, -0.9);
    const feed = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8, 6), this.mats.steel);
    feed.position.set(0.0, 8.9, 2.05);
    feed.rotation.set(0.5, 0, -0.9);
    // rote Warnleuchte oben am Mast
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), W.basic({ color: 0xff3020 }));
    beacon.position.set(0.3, 8.66, 1.8);
    // Kamera auf dem Stativ vor dem Wagen, zielt schräg auf die Fahrbahn
    const cam = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.45, 6), dark);
      leg.position.set(Math.sin(a) * 0.22, 0.7, Math.cos(a) * 0.22);
      leg.rotation.set(Math.cos(a) * 0.3, 0, -Math.sin(a) * 0.3);
      cam.add(leg);
    }
    const camBody = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.32, 0.6), dark);
    camBody.position.set(0, 1.55, 0);
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.3, 12), glass);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(0, 1.55, -0.42);
    const tally = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), W.basic({ color: 0xff3020 }));
    tally.position.set(0, 1.76, -0.18);
    cam.add(camBody, lens, tally);
    cam.position.set(-0.4, 0, -4.7);
    cam.rotation.y = 2.3;
    g.add(body, cab, hood, wind, side, ...wheels, label, back, mast, dish, feed, beacon, cam);
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
    const wall = W.std({ color: 0xf3ecdc, roughness: 0.9 });
    const nave = new THREE.Mesh(new THREE.BoxGeometry(9, 8, 18), wall);
    nave.position.set(0, 4, 4);
    // Walmdach über dem Schiff: die vierseitige Pyramide zuerst drehen (Kanten parallel zu den Wänden) und erst dann
    // längs strecken – andersherum wurde daraus eine schiefe Raute, deren Ecken 5 m neben dem Schiff in der Luft hingen
    const roof = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 6.8, 5, 4, 1).rotateY(Math.PI / 4), this.mats.redRoof);
    roof.scale.set(1, 1, 2.0);
    roof.position.set(0, 10.5, 4);
    const tower = new THREE.Mesh(new THREE.BoxGeometry(4.5, 20, 4.5), wall);
    tower.position.set(0, 10, -7);
    const spire = new THREE.Mesh(new THREE.ConeGeometry(3.4, 10, 4), W.std({ color: 0x4a8576, roughness: 0.7 }));
    spire.rotation.y = Math.PI / 4;
    spire.position.set(0, 25, -7);
    // Zierrat als ein eingefärbtes Stück: Rundbogenfenster, Tür, Schallluken, Turmuhren, Turmkugel. Alles steht
    // ein paar Zentimeter aus der Wand heraus (keine deckungsgleichen Flächen).
    const trim = [];
    const SAND = 0xd9c9a6;
    // Rundbogen auf einer Wand: Fußmitte (x, y, z), turn dreht die Front (0 schaut nach +z), Breite w, Höhe h
    const arch = (x, y, z, turn, w, h, col, deep) => {
      const o = { col, ao: 0, y0: 0, y1: h };
      const frame = { col: SAND, ao: 0 };
      trim.push(move([
        box(w, h - w / 2, deep, o),
        rod(w / 2, w / 2, deep, { seg: 12, caps: true, rot: [Math.PI / 2, 0, 0], at: [0, h - w / 2, -deep / 2], ...o }),
        box(w + 0.36, h - w / 2, deep - 0.16, frame),
        rod(w / 2 + 0.18, w / 2 + 0.18, deep - 0.16, { seg: 12, caps: true, rot: [Math.PI / 2, 0, 0], at: [0, h - w / 2, -deep / 2 + 0.08], ...frame }),
      ], { rot: [0, turn, 0], at: [x, y, z] }));
    };
    const GLASS = [0x3f6f9c, 0x9fd0e8];
    for (const s of [1, -1]) {
      for (const z of [-0.5, 4, 8.5]) arch(s * 4.5, 2.6, z, s * Math.PI / 2, 1.3, 3.5, GLASS, 0.24);
    }
    arch(0, 0, 13, 0, 2.0, 3.3, [0x7a5a3c, 0xa87a4f], 0.24);
    trim.push(box(3.2, 0.22, 0.9, { at: [0, 0, 13.3], col: 0xcfc6b4, ao: 0 }));
    for (let i = 0; i < 4; i++) {
      const turn = (i * Math.PI) / 2;
      const [nx, nz] = [Math.sin(turn), Math.cos(turn)];
      // die Seite zum Schiff hin liegt unter dem Dach: dort keine Schallluke
      if (i !== 0) arch(nx * 2.25, 10.6, -7 + nz * 2.25, turn, 1.1, 2.3, [0x47525e, 0x6d7a86], 0.24);
      trim.push(move([
        rod(1.14, 1.14, 0.07, { seg: 16, caps: true, rot: [Math.PI / 2, 0, 0], at: [0, 0, -0.05], col: 0x9a7a45, ao: 0 }),
        rod(0.95, 0.95, 0.15, { seg: 16, caps: true, rot: [Math.PI / 2, 0, 0], at: [0, 0, -0.05], col: 0xfbf6e6, ao: 0 }),
        box(0.1, 0.72, 0.05, { at: [0, -0.06, 0.135], col: 0x4a4038, ao: 0 }),
        box(0.13, 0.5, 0.05, { rot: [0, 0, -1.15], at: [0, 0, 0.135], col: 0x4a4038, ao: 0 }),
      ], { rot: [0, turn, 0], at: [nx * 2.25, 16, -7 + nz * 2.25] }));
    }
    trim.push(ball(0.42, { d: 1, at: [0, 30.1, -7], col: PAL.gold, ao: 0 }));
    const deco = new THREE.Mesh(fuse(trim), W.lambert({ vertexColors: true }));
    g.add(nave, roof, tower, spire);
    g.traverse((o) => o.isMesh && (o.castShadow = true));
    deco.receiveShadow = true;
    g.add(deco);
    return g;
  }

  /** Lärmschutzwand eines Segments; die Form kommt erst mit userData.shape (Lücken, Endpfosten). */
  makeNoiseWall() {
    if (!this.mats.noiseWall) {
      // ein Wandfeld (5 m) pro Texturkachel, links der Pfosten-Streifen; einmal gemalt, alle Wände teilen das Material
      const tex = (() => {
        const c = document.createElement('canvas');
        c.width = 512;
        c.height = 256;
        const ctx = c.getContext('2d');
        ctx.scale(2, 2);
        // salbeigrüne Lamellen, oben ein heller Abschluss, unten rankt Efeu mit ein paar Blüten
        const wash = ctx.createLinearGradient(0, 0, 0, 128);
        wash.addColorStop(0, '#b4cbb0');
        wash.addColorStop(1, '#98b59b');
        ctx.fillStyle = wash;
        ctx.fillRect(0, 0, 256, 128);
        for (let y = 12; y < 128; y += 8) {
          ctx.fillStyle = y % 16 ? 'rgba(40,70,50,0.07)' : 'rgba(255,255,255,0.09)';
          ctx.fillRect(0, y, 256, 4);
        }
        ctx.fillStyle = '#e6ecdf';
        ctx.fillRect(0, 0, 256, 10);
        ctx.fillStyle = 'rgba(40,70,50,0.16)';
        ctx.fillRect(0, 10, 256, 2);
        // ein Feld ist 5 m breit und 4,2 m hoch: Kreise sind auf der Kachel Ellipsen (0,6 so hoch wie breit)
        const rnd = mulberry32(77);
        const leaves = ['#5f9e4a', '#6fae52', '#4f8f45', '#7ab95a'];
        const blob = (x, y, r) => {
          ctx.beginPath();
          ctx.ellipse(x, y, r, r * 0.6, 0, 0, 7);
          ctx.fill();
        };
        // je Feld eine Ranke: in der Feldmitte am höchsten, zu den Pfosten hin flach – so wirkt die Wiederholung
        // von Feld zu Feld gepflanzt statt gekachelt
        for (let i = 0; i < 76; i++) {
          const x = 14 + rnd() * 236;
          const top = 9 + 36 * Math.sin((Math.PI * (x - 10)) / 246) ** 2;
          const up = rnd() * rnd();
          ctx.fillStyle = leaves[i % 4];
          blob(x, 126 - up * top, 10 - up * 5 + rnd() * 3);
        }
        for (let i = 0; i < 10; i++) {
          ctx.fillStyle = i % 3 ? '#fdfbf5' : '#f7a8c4';
          blob(60 + rnd() * 150, 122 - rnd() * 18, 2.4);
        }
        ctx.fillStyle = '#74838a';
        ctx.fillRect(0, 0, 10, 128);
        ctx.fillStyle = 'rgba(255,255,255,0.22)';
        ctx.fillRect(2, 0, 2.5, 128);
        const t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.anisotropy = 4;
        return t;
      })();
      this.mats.noiseWall = W.std({ map: tex, roughness: 0.8 });
      this.mats.wallPost = W.std({ color: 0x74838a, metalness: 0.4, roughness: 0.55 });
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

  /** Blitzer auslösen (weißer Blitz an der Säule). */
  flashBlitzer(on) {
    const pool = this.pools.get('blitzer') || [];
    for (const b of pool) {
      if (b.userData.active) b.userData.flash.material.color.setScalar(on ? 30 : 1);
    }
  }
}

