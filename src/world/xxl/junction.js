// Knotenpunkte an der gezeichneten Autobahn (im Rahmen der Autobahn): Sperrfläche mit Schraffur zwischen Fahrbahn
// und Rampe, Endstücke der rechten Planke dort, wo sie nach der Lücke (Road-Zonen) wieder beginnt bzw. vor ihr endet,
// Baken 300/200/100 m vor der Ausfahrt (Maße aus signplan.js; die übrigen Tafeln baut signs.js); dazu Ende und Anfang
// einer Autobahn: Verengung mit Leitbaken und Sperrfläche, Absperrschranken quer über beide Fahrbahnen, die blauen
// Tafeln.
// Blockmarkierung, Lücken in Planke/Pfosten/Leitpfosten und Anfang/Ende der Fahrbahn macht die Road selbst (Zonen).
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { W } from '../../curve.js';
import { J, R as rampR } from '../../game/trip.js';
import { colorize } from '../../models/loft.js';
import { ROAD, roundRect } from '../../textures.js';
import { ONCOMING, MEDIAN_X } from '../road.js';
import { GeoBuf, boxInto, crossSection, markLine, upQuad, AB_RAIL, RAIL_U, ASPHALT_TILE, VERGE } from './roadkit.js';
import { BEACON_D, BEACON_X, EDGE_SIGN_X, END_SIGN_D, BEGIN_SIGN_U } from './signplan.js';


/** Schraffur der Sperrfläche einer Ausfahrt oder Einfädelung bis u = uMax hinter der Spitze, Rahmen der Autobahn. */
function goreGeometry(link, rampSec, prev, next, uMax) {
  const buf = new GeoBuf({ mark: true, uv: false });
  const X = {};
  const sOf = (u) => (link.type === 'exit' ? link.s + u : link.s - u);
  const right = (u) => {
    crossSection(rampSec, prev, next, sOf(u), X);
    return X.eL - X.ewL / 2 + rampR(u) - 0.12;
  };
  const left = 7.86;
  // Spitze: dort, wo zwischen den Linien Platz für die Schraffur ist
  let u0 = 0;
  while (u0 < uMax && right(u0) - left < 0.35) u0 += 0.5;
  let prevPair = null;
  for (let u = u0; u <= uMax + 1e-6; u += 1) {
    const s = sOf(u);
    const z = -(s - link.s);
    const xr = Math.max(left + 0.01, right(u));
    const a = buf.vert(left, 0, z, 0, 1, 0);
    buf.markAttr(s, left, 0, 1, 2.4, 0.5);
    const b = buf.vert(xr, 0, z, 0, 1, 0);
    buf.markAttr(s, xr, 0, 1, 2.4, 0.5);
    if (prevPair) {
      if (link.type === 'exit') buf.quad(prevPair[0], prevPair[1], b, a);
      else buf.quad(prevPair[0], a, b, prevPair[1]);
    }
    prevPair = [a, b];
  }
  return buf.build();
}

/** Abgesenktes Endstück der Autobahnplanke: von s0 (am Boden) bis s1 (volle Höhe), x fest. */
function railEnd(rails, solid, x, s0, s1, sRef) {
  const n = 8;
  let prev = null;
  for (let i = 0; i <= n; i++) {
    const s = s0 + ((s1 - s0) * i) / n;
    const t = i / n;
    const k = t * t * (3 - 2 * t);
    const z = -(s - sRef);
    const ya = 0.52 * k;
    const yb = 0.12 + 0.72 * k;
    const u = s / 4 - Math.floor(sRef / 4);
    const a = rails.vert(x, ya, z, -1, 0, 0, u, 0);
    const b = rails.vert(x, yb, z, -1, 0, 0, u, 1);
    const c = rails.vert(x + 0.08, yb, z, 0, 1, 0, u, 0);
    const d = rails.vert(x, yb + 0.01, z, 0, 1, 0, u, 1);
    if (prev) {
      const fwd = s1 > s0;
      if (fwd) {
        rails.quad(prev.a, prev.b, b, a);
        rails.quad(prev.c, prev.d, d, c);
      } else {
        rails.quad(prev.a, a, b, prev.b);
        rails.quad(prev.c, c, d, prev.d);
      }
    }
    prev = { a, b, c, d };
  }
  // ein Pfosten am Übergang zur vollen Höhe
  boxInto(solid, x + 0.17, 0.4, -(s1 - sRef), 0.05, 0.4, 0.035, POST);
}
const POST = new THREE.Color(0x8e9398);

let beaconGeos = null;
/**
 * Baken: weiße Tafel mit 3, 2 oder 1 roten Schrägstreifen auf einem Pfosten (Textur je Anzahl), 0,48 × 1,4 m – groß
 * genug, dass man sie aus dem Cockpit bei Tempo herunterzählt (Besitzer, 21.11.: „Ausfahrten besser ausschildern.“).
 */
function beaconGeo(n) {
  if (!beaconGeos) beaconGeos = {};
  if (beaconGeos[n]) return beaconGeos[n];
  const post = new THREE.BoxGeometry(0.09, 1.6, 0.07).toNonIndexed();
  post.translate(0, 0.8, -0.055);
  const board = new THREE.BoxGeometry(0.48, 1.4, 0.04).toNonIndexed();
  board.translate(0, 1.55, 0);
  // der Pfosten nimmt ein weißes Stück der Textur (oben), die Tafel die ganze
  const n0 = post.attributes.position.count;
  post.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(n0 * 2).map((v, i) => (i % 2 ? 0.99 : 0.5)), 2));
  const g = mergeGeometries([colorize(post, 0x8e9398), colorize(board, 0xffffff)]);
  beaconGeos[n] = g;
  return g;
}
function beaconTexture(n) {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 192;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#f4f2ec';
  ctx.fillRect(0, 0, 64, 192);
  ctx.fillStyle = '#d8342c';
  for (let i = 0; i < n; i++) {
    const y = 192 * ((i + 0.5) / n) - 24;
    ctx.beginPath();
    ctx.moveTo(0, y + 30);
    ctx.lineTo(64, y - 6);
    ctx.lineTo(64, y + 22);
    ctx.lineTo(0, y + 58);
    ctx.closePath();
    ctx.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// --- Ende und Anfang einer Autobahn -----------------------------------------------------------------------------
// Am Ende (erzwungene Ausfahrt bei fs) werden die Spuren auf J.close nach rechts verengt (trip.profile().closing):
// Leitbaken auf der Linie, links davon eine Sperrfläche; J.endCap hinter der Gabelung stehen Absperrschranken quer
// über beide Fahrbahnen, davor die Tafel „Ende der Autobahn“. Am Anfang (J.beginCap vor dem Einfädelpunkt) stehen
// die Schranken am Beginn der Fahrbahn und hinter dem Einfädeln die Tafel „Autobahn“.
const CLOSE_X = 6.45; // linke Kante der Sperrung am Ende der Verengung (das Auto bleibt mit xmin 7,6 rechts davon)
const BAR_BACK = 0.7; // so weit vor dem Ende bzw. hinter dem Anfang der Fahrbahn stehen die Schranken

/** Linke Kante des offenen Teils der Fahrbahn bei s vor einer erzwungenen Ausfahrt bei fs (Rahmen der Autobahn). */
export function closeLine(fs, s) {
  const k = 1 - Math.min(Math.max((fs - s - 20) / J.close, 0), 1);
  return ROAD.left + (CLOSE_X - ROAD.left) * k;
}

function stripeTexture() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 32;
  const g = c.getContext('2d');
  g.fillStyle = '#f4f2ec';
  g.fillRect(0, 0, 128, 32);
  g.fillStyle = '#d8342c';
  for (let i = -1; i < 3; i++) {
    g.beginPath();
    g.moveTo(i * 64, 32);
    g.lineTo(i * 64 + 32, 0);
    g.lineTo(i * 64 + 64, 0);
    g.lineTo(i * 64 + 32, 32);
    g.closePath();
    g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** Blaue Tafel mit dem Autobahn-Sinnbild (Brücke über zwei Fahrbahnen), bei end mit rotem Querbalken. */
function autobahnSignTexture(end) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#f4f2ec';
  g.fillRect(0, 0, 256, 256);
  roundRect(g, 12, 12, 232, 232, 22);
  g.fillStyle = '#1f5fae';
  g.fill();
  g.fillStyle = '#f4f2ec';
  roundRect(g, 46, 66, 164, 24, 8);
  g.fill();
  for (const sgn of [-1, 1]) {
    g.beginPath();
    g.moveTo(128 + sgn * 10, 96);
    g.lineTo(128 + sgn * 22, 96);
    g.lineTo(128 + sgn * 84, 222);
    g.lineTo(128 + sgn * 34, 222);
    g.closePath();
    g.fill();
  }
  if (end) {
    g.strokeStyle = '#d8342c';
    g.lineWidth = 26;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(52, 52);
    g.lineTo(204, 204);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

const FOOT = new THREE.Color(0x2c2e31);
const LAMP_BOX = new THREE.Color(0x3a3c40);

/** Leitbake (weiße Tafel mit roten Schrägstreifen auf schwarzem Fuß) bei x, z; Tafel in boards, Fuß in solid. */
function bakeInto(boards, solid, x, z) {
  const w = 0.13;
  const y0 = 0.16;
  const y1 = 1.16;
  for (const f of [1, -1]) {
    const zz = z + f * 0.02;
    const a = boards.vert(x - w * f, y0, zz, 0, 0, f, 0, 0);
    const b = boards.vert(x + w * f, y0, zz, 0, 0, f, 1, 0);
    const c = boards.vert(x + w * f, y1, zz, 0, 0, f, 1, 1);
    const d = boards.vert(x - w * f, y1, zz, 0, 0, f, 0, 1);
    boards.quad(a, b, c, d);
  }
  boxInto(solid, x, 0.06, z, 0.24, 0.06, 0.2, FOOT);
  boxInto(solid, x, 0.13, z, 0.04, 0.05, 0.03, FOOT);
}

/** Absperrschranke von xa bis xb bei z: rot-weiße Latte auf Füßen, gelbe Warnleuchten obenauf. */
function barrierInto(bars, solid, lamps, xa, xb, z) {
  const y0 = 0.86;
  const y1 = 1.11;
  for (const f of [1, -1]) {
    const zz = z + f * 0.02;
    const a = bars.vert(f > 0 ? xa : xb, y0, zz, 0, 0, f, (f > 0 ? xa : xb) / 1.2, 0);
    const b = bars.vert(f > 0 ? xb : xa, y0, zz, 0, 0, f, (f > 0 ? xb : xa) / 1.2, 0);
    const c = bars.vert(f > 0 ? xb : xa, y1, zz, 0, 0, f, (f > 0 ? xb : xa) / 1.2, 1);
    const d = bars.vert(f > 0 ? xa : xb, y1, zz, 0, 0, f, (f > 0 ? xa : xb) / 1.2, 1);
    bars.quad(a, b, c, d);
  }
  const n = Math.max(2, Math.round((xb - xa) / 2.4) + 1);
  for (let i = 0; i < n; i++) {
    const x = xa + 0.3 + ((xb - xa - 0.6) * i) / (n - 1);
    boxInto(solid, x, 0.43, z, 0.035, 0.43, 0.035, FOOT);
    boxInto(solid, x, 0.04, z, 0.08, 0.04, 0.32, FOOT);
    if (i % 2 === 0) {
      boxInto(solid, x, 1.16, z, 0.05, 0.05, 0.04, LAMP_BOX);
      boxInto(lamps, x, 1.26, z, 0.09, 0.09, 0.05, LAMP_BOX);
    }
  }
}

/**
 * Wendeschleife hinter dem Ende (dir = +1) bzw. vor dem Anfang (dir = −1) der Fahrbahn bei sEdge: ein halber
 * Asphaltring um die Mitte des Mittelstreifens, der beide Fahrbahnen verbindet, innen eine runde Rasenfläche, außen
 * das Bankett, Randlinien. Der Ring beginnt 0,4 m unter der Fahrbahn (Schicht 'under', keine Ritze am Schnitt).
 */
function turnLoopInto(asph, grass, marks, sEdge, dir, sRef) {
  const xc = MEDIAN_X;
  const ro = ROAD.right - MEDIAN_X;
  const ri = 7.5;
  const N = 48;
  const z = (s) => -(s - sRef);
  const A = (x, s) => asph.vert(x, 0, z(s), 0, 1, 0, x / ASPHALT_TILE, (s - sRef) / ASPHALT_TILE);
  const G = (x, s) => grass.vert(x, 0, z(s), 0, 1, 0, x / 7, (s - sRef) / 7);
  const at = (r, k) => [xc + r * Math.cos((Math.PI * k) / N), sEdge + dir * r * Math.sin((Math.PI * k) / N)];
  for (let k = 0; k < N; k++) {
    const [a, b, c, d] = [at(ri, k), at(ro, k), at(ro, k + 1), at(ri, k + 1)];
    upQuad(asph, A(...a), A(...b), A(...c), A(...d));
    const [e, f, g, h] = [at(ro - 0.02, k), at(ro + VERGE, k), at(ro + VERGE, k + 1), at(ro - 0.02, k + 1)];
    upQuad(grass, G(...e), G(...f), G(...g), G(...h));
    const m = G(xc, sEdge);
    const p = at(ri + 0.02, k);
    const q = at(ri + 0.02, k + 1);
    upQuad(grass, m, G(...p), G(...q), m);
  }
  for (const sg of [1, -1]) {
    const x0 = xc + sg * ri;
    const x1 = xc + sg * ro;
    upQuad(asph, A(x0, sEdge - dir * 0.4), A(x1, sEdge - dir * 0.4), A(x1, sEdge), A(x0, sEdge));
  }
  // Randlinien außen und innen
  const ring = (r) => {
    const pts = [];
    for (let k = 0; k <= N; k++) pts.push(at(r, k));
    markLine(marks, pts, 0.1, 1, 1, sRef);
  };
  ring(ro - 0.25);
  ring(ri + 0.35);
}

/** Tafel (Textur in mat) auf zwei Pfosten bei x, z: Vorderseite nach +z. */
function signPanel(g, solid, mat, x, z, size) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat);
  m.position.set(x, 1.5 + size / 2, z + 0.03);
  m.castShadow = true;
  m.frustumCulled = false;
  g.add(m);
  boxInto(solid, x, 1.5 + size / 2, z, size / 2, size / 2, 0.025, new THREE.Color(0x9aa0a6));
  for (const dx of [-size * 0.3, size * 0.3]) boxInto(solid, x + dx, 0.75 + size / 2, z - 0.06, 0.04, 0.75 + size / 2, 0.04, new THREE.Color(0x9aa0a6));
}

export class Junctions {
  constructor(world) {
    this.world = world;
    this.items = new Map(); // Schlüssel → {frame, group}
    this.beaconMats = [1, 2, 3].map((n) => W.std({ map: beaconTexture(n), roughness: 0.6 }));
    this.bakeMat = W.std({ map: beaconTexture(5), roughness: 0.6 });
    this.barMat = W.std({ map: stripeTexture(), roughness: 0.55 });
    this.lampMat = W.std({ color: 0xffd23f, emissive: 0xffb000, emissiveIntensity: 0.9, roughness: 0.4 });
    // Bildseite mit Polygon-Offset vor der Rückwand (die Tiefenauflösung reicht in der Ferne nicht für 5 mm)
    this.signMats = [false, true].map((end) => W.std({ map: autobahnSignTexture(end), roughness: 0.5, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -4 }));
  }

  reset() {
    for (const it of this.items.values()) this.drop(it);
    this.items.clear();
  }

  drop(it) {
    if (it.group.parent) it.group.parent.remove(it.group);
    it.group.traverse((o) => {
      if (o.geometry && !o.userData.shared) o.geometry.dispose();
    });
  }

  /** Rahmen, deren Ansicht für Knotenpunkte gebraucht wird. */
  frames() {
    const out = [];
    for (const it of this.items.values()) out.push(it.frame);
    return out;
  }

  /** Knotenpunkte, Ende und Anfang der gezeichneten Autobahn bauen bzw. verwerfen. */
  sync(view, trip) {
    const want = new Set();
    const need = (key, make) => {
      want.add(key);
      const it = this.items.get(key);
      if (!it) {
        const made = make();
        if (made) this.items.set(key, made);
      } else if (view && it.frame !== view.frame) it.frame = view.frame; // neu angelegt, gleiche Stelle: neuer Rahmen
    };
    if (view) {
      const s = trip.s;
      for (const c of view.secs) {
        const f = c.fork;
        if (f && f.link && f.branch && f.s > s - 400 && f.s < s + 1900) {
          need('x' + f.de + '@' + Math.round(f.s), () => this.build(view.frame, f.link, f.branch.sections[0], f.sec, f.branch.sections[1] || null, 'exit', f.forced));
        }
        // Ende: Verengung ab J.close + 20 m vor der Gabelung, Schranken bei view.s1
        if (f && f.forced && isFinite(view.s1) && view.s1 > s - 400 && f.s - J.close - 60 < s + 1750) {
          need('e' + f.de + '@' + Math.round(view.s1), () => this.buildEnd(view.frame, f.s, view.s1));
        }
        if (c.merge && c.merge.s > s - 400 && c.merge.s < s + 1900) {
          need('m' + c.de + '@' + Math.round(c.merge.s), () => {
            const path = trip.paths().find((e) => e.path.sections.includes(c));
            const L = path ? path.path.sections : [];
            const auf = L[L.indexOf(c) - 1];
            return auf && auf.kind === 'auf' ? this.build(view.frame, c.merge, auf, L[L.indexOf(auf) - 1] || null, c, 'merge', false) : null;
          });
        }
        if (c.merge && c.begins && isFinite(view.s0) && view.s0 > s - 400 && view.s0 < s + 1900) {
          need('b' + c.de + '@' + Math.round(view.s0), () => this.buildBegin(view.frame, view.s0, c.merge.s));
        }
      }
    }
    for (const [key, it] of this.items) {
      if (want.has(key)) continue;
      this.drop(it);
      this.items.delete(key);
    }
  }

  /** Gruppen in die Spur ihrer Rahmenansicht hängen (nach dem Abgleich der Ansichten). */
  attach() {
    for (const it of this.items.values()) {
      const fv = this.world.frames.get(it.frame);
      if (fv && it.group.parent !== fv.track) fv.track.add(it.group);
    }
  }

  update() {}

  /** Meshes aus den Puffern in die Gruppe hängen (leere Puffer entfallen). */
  addMesh(g, buf, mat, shadow) {
    const geo = buf.build();
    if (!geo) return;
    const m = new THREE.Mesh(geo, mat);
    m.frustumCulled = false;
    m.castShadow = shadow;
    m.receiveShadow = true;
    g.add(m);
  }

  /**
   * Knotenpunkt einer Ausfahrt (prev = Autobahn, next = Abschnitt nach der Rampe) oder Einfädelung (prev = Abschnitt
   * vor der Auffahrt, next = Autobahn). forced: die Autobahn endet hier, Schraffur und Planke enden mit ihr.
   */
  build(frame, link, rampSec, prev, next, type, forced) {
    const mats = this.world.mats;
    const g = new THREE.Group();
    g.name = 'XXL-Knoten';
    g.position.z = -link.s;
    const gore = goreGeometry(link, rampSec, prev, next, forced ? J.endCap - BAR_BACK - 0.5 : J.gore);
    if (gore) {
      const m = new THREE.Mesh(gore, mats.mark);
      m.frustumCulled = false;
      m.receiveShadow = true;
      g.add(m);
    }
    // Planke der Autobahn: Endstück am Ende der Lücke (an einem Ende der Autobahn gibt es dort keine Planke mehr)
    const rails = new GeoBuf();
    const solid = new GeoBuf({ color: true, uv: false });
    if (type === 'exit' && !forced) railEnd(rails, solid, AB_RAIL, link.s + RAIL_U - 4, link.s + RAIL_U, link.s);
    else if (type === 'merge') railEnd(rails, solid, AB_RAIL, link.s - RAIL_U + 4, link.s - RAIL_U, link.s);
    this.addMesh(g, rails, mats.rail, false);
    this.addMesh(g, solid, mats.solid, true);
    // Baken vor der Ausfahrt
    if (type === 'exit') {
      BEACON_D.forEach((d, i) => {
        const n = 3 - i;
        const m = new THREE.Mesh(beaconGeo(n), this.beaconMats[n - 1]);
        m.userData.shared = true;
        m.position.set(BEACON_X, 0, d);
        m.frustumCulled = false;
        m.castShadow = true;
        g.add(m);
      });
    }
    return { frame, group: g, link, type };
  }

  /** Ende der Autobahn: Verengung vor der erzwungenen Ausfahrt bei fs, Schranken vor dem Ende der Fahrbahn bei s1. */
  buildEnd(frame, fs, s1) {
    const mats = this.world.mats;
    const g = new THREE.Group();
    g.name = 'XXL-Autobahnende';
    g.position.z = -s1;
    const z = (s) => -(s - s1);
    const boards = new GeoBuf();
    const solid = new GeoBuf({ color: true, uv: false });
    const bars = new GeoBuf();
    const lamps = new GeoBuf({ color: true, uv: false });
    const marks = new GeoBuf({ mark: true, uv: false });
    const sA = fs - J.close - 20;
    const sEnd = s1 - BAR_BACK - 0.4;
    // Sperrfläche links der Linie (Schraffur und Randlinie, ab gut einem halben Meter Breite), Leitbaken auf der Linie
    const left = ROAD.left + 0.35;
    const sM = fs - 20 - J.close * (1 - (left + 0.6 - ROAD.left) / (CLOSE_X - ROAD.left));
    const n = Math.ceil((sEnd - sM) / 4);
    let prev = null;
    for (let i = 0; i <= n; i++) {
      const s = sM + ((sEnd - sM) * i) / n;
      const xc = closeLine(fs, s);
      const row = [
        marks.vert(left, 0, z(s), 0, 1, 0),
        marks.vert(xc - 0.3, 0, z(s), 0, 1, 0),
        marks.vert(xc - 0.3, 0, z(s), 0, 1, 0),
        marks.vert(xc, 0, z(s), 0, 1, 0),
      ];
      marks.markAttr(s, left, 0, 1, 2.4, 0.5);
      marks.markAttr(s, xc - 0.3, 0, 1, 2.4, 0.5);
      marks.markAttr(s, -0.15, 0.12, 0, 10, 10);
      marks.markAttr(s, 0.15, 0.12, 0, 10, 10);
      if (prev) {
        marks.quad(prev[0], prev[1], row[1], row[0]);
        marks.quad(prev[2], prev[3], row[3], row[2]);
      }
      prev = row;
    }
    for (let s = sA + 6; s < sEnd - 4; s += 12) bakeInto(boards, solid, closeLine(fs, s) + 0.15, z(s));
    // Schranken quer über beide Fahrbahnen (rechts bis vor die Rampe, die hier schon abbiegt)
    const zb = z(s1 - BAR_BACK);
    barrierInto(bars, solid, lamps, ROAD.left + 0.2, AB_RAIL - 1.9, zb);
    barrierInto(bars, solid, lamps, ONCOMING(ROAD.right) + 0.2, ONCOMING(ROAD.left) - 0.2, zb);
    signPanel(g, solid, this.signMats[1], EDGE_SIGN_X, z(fs - END_SIGN_D), 1.5);
    // dahinter die Wendeschleife zur Gegenfahrbahn
    const asph = new GeoBuf();
    const grass = new GeoBuf();
    turnLoopInto(asph, grass, marks, s1, 1, s1);
    this.addMesh(g, asph, mats.asphaltUnder, false);
    this.addMesh(g, grass, mats.grass, false);
    this.addMesh(g, marks, mats.mark, false);
    this.addMesh(g, boards, this.bakeMat, true);
    this.addMesh(g, bars, this.barMat, true);
    this.addMesh(g, lamps, this.lampMat, false);
    this.addMesh(g, solid, mats.solid, true);
    return { frame, group: g, type: 'end' };
  }

  /** Anfang der Autobahn bei s0 (Einfädelpunkt ms): Schranken am Beginn der Fahrbahn, die Tafel hinter dem Einfädeln. */
  buildBegin(frame, s0, ms) {
    const mats = this.world.mats;
    const g = new THREE.Group();
    g.name = 'XXL-Autobahnanfang';
    g.position.z = -s0;
    const solid = new GeoBuf({ color: true, uv: false });
    const bars = new GeoBuf();
    const lamps = new GeoBuf({ color: true, uv: false });
    const zb = -BAR_BACK;
    barrierInto(bars, solid, lamps, ROAD.left + 0.2, ROAD.right - 0.2, zb);
    barrierInto(bars, solid, lamps, ONCOMING(ROAD.right) + 0.2, ONCOMING(ROAD.left) - 0.2, zb);
    signPanel(g, solid, this.signMats[0], EDGE_SIGN_X, -(ms + BEGIN_SIGN_U - s0), 1.5);
    // davor die Wendeschleife von der Gegenfahrbahn
    const asph = new GeoBuf();
    const grass = new GeoBuf();
    const marks = new GeoBuf({ mark: true, uv: false });
    turnLoopInto(asph, grass, marks, s0, -1, s0);
    this.addMesh(g, asph, mats.asphaltUnder, false);
    this.addMesh(g, grass, mats.grass, false);
    this.addMesh(g, marks, mats.mark, false);
    this.addMesh(g, bars, this.barMat, true);
    this.addMesh(g, lamps, this.lampMat, false);
    this.addMesh(g, solid, mats.solid, true);
    return { frame, group: g, type: 'begin' };
  }
}
