// Straßenbaukasten der XXL-Welt: Bänder für Rampe, Auffahrt, Verbindungsfahrbahn, Zubringer, Landstraße,
// Ortsdurchfahrt und Terminal aus den Querschnitten von trip.js (PROFILES), mit weichem Asphalt, runden Markierungen,
// Banketten, Schutzplanken oder Bordsteinen mit Gehweg und weichen Übergängen zwischen den Querschnitten.
//
// Ein Abschnitt wird in Stücke (Pieces, siehe plan.js chunksOf) geteilt. Jedes Stück liegt im Rahmen seines
// Abschnitts. Der Bogen eines Knotenpunkts (die ersten J.cap Meter einer Rampe, die letzten einer Auffahrt) liegt laut
// trip.locate im Rahmen der Autobahn bei x + R(u). Beide Rahmen hängen starr über Trip.offsetLin zusammen; im eigenen
// Rahmen liegt derselbe Punkt also fest bei x + R(u) − offsetLin(u) (curveShift). So sieht der Bogen genau gleich aus,
// bleibt aber stehen, wenn die verlassene Autobahn verschwindet.
// Alle Maße hier sind Abschnittskoordinaten (x wie in trip.js, unsere Spur bei J.L0 = 9).
import * as THREE from 'three';
import { W } from '../../curve.js';
import { J, BETA, R as rampR, taperLen } from '../../game/trip.js';
import { GRASS_RGB, ROAD, asphaltBase, guardrailTexture } from '../../textures.js';
import { mulberry32 } from '../../util.js';
import { ASPHALT, wetAsphalt } from '../road.js';
import { LAYER, meadowTexture } from './ground.js';
import { STREET, profileOf } from '../kit/layout.js';
import { PAVES } from '../kit/steckbrief.js';
import { places } from '../../map/graph.js';
import { PAVEMENT } from '../kit/street.js';
import { squareOf, squareWeight, kitTown } from './plan.js';
import { chargeOf, kerbAt } from './charge.js';
import { bridgeCuts } from './bridgeplan.js';
import { fieldsOf, CROPS } from './fieldplan.js';
import { fieldTexture, FIELD_V } from './fieldtex.js';

export const AB_EDGE = 10.5; // Asphaltrand der Autobahn (ROAD.right)
export const AB_RAIL = 11.05; // Schutzplanke der Autobahn (ROAD.right + 0.55)
export const VERGE = 3.5; // gemähter Grünstreifen neben dem Asphalt (auch an der Autobahn, siehe Road flat)
const EXIT_T = 60; // so lang wird aus dem Standstreifen die Rampe (und am Ende der Auffahrt umgekehrt)

/**
 * Sichtbare Querschnitte. aL/aR: Asphaltränder · eL/eR: Mitte der Randlinien, ewL/ewR ihre Breite · mid: Leit- bzw.
 * Mittellinie (Strich/Periode in m) · rails: Schutzplanken · verge: Grünstreifen · kerb: Bordstein mit Gehweg.
 */
export const VIS = {
  rampe: { aL: 6.5, aR: 11.5, eL: 6.9, eR: 11.1, ewL: 0.25, ewR: 0.25, mid: null, rails: true, verge: VERGE, kerb: 0 },
  verbindung: { aL: 3.25, aR: 11.25, eL: 3.65, eR: 10.85, ewL: 0.25, ewR: 0.25, mid: { x: 7.25, w: 0.15, dash: 6, period: 18 }, rails: true, verge: VERGE, kerb: 0 },
  land: { aL: 3.25, aR: 11.25, eL: 3.5, eR: 11.0, ewL: 0.13, ewR: 0.13, mid: { x: 7.25, w: 0.13, dash: 4, period: 12 }, rails: false, verge: VERGE + 0.5, kerb: 0 },
  // Ortsdurchfahrt: die Bordsteinkanten des Stadtbaukastens (kit/layout.js STREET), dessen Orte an ihr stehen
  stadt: { aL: STREET.curbL, aR: STREET.curbR, eL: STREET.curbL, eR: STREET.curbR, ewL: 0, ewR: 0, mid: { x: 7.375, w: 0.12, dash: 3, period: 9 }, rails: false, verge: 0, kerb: 1 },
};
// der Standstreifen der Autobahn (Verzögerungs- bzw. Beschleunigungsstreifen) als Querschnitt: Linien wie in der
// Autobahntextur (rechte Fahrbahnbegrenzung 7,5–7,8, äußerer Rand 10,15–10,35), Planke bei AB_RAIL
const SHOULDER = { aL: 7.8, aR: AB_EDGE, eL: 7.65, eR: 10.25, ewL: 0.3, ewR: 0.2, mid: null, rails: true, verge: VERGE, kerb: 0, railOutR: AB_RAIL - AB_EDGE };
// Bordstein und Gehweg der Ortsdurchfahrt haben die Maße des Stadtbaukastens (kit/layout.js STREET), dessen Häuser,
// Laternen und Menschen darauf stehen: Bordstein w mit runder Kante (bevel), Pflasterstreifen bis strip, Plattenweg
// bis pave (dort beginnt die Häuserflucht). garden: Vorgärten dahinter, nur wo noch Platzhalterhäuser stehen.
export const KERB = { h: STREET.top, w: STREET.kerb, bevel: 0.035, strip: STREET.strip, pave: STREET.pave, garden: 2.4 };
const RAIL_OUT = 0.45; // Planke so weit neben dem Asphaltrand

// --- Stummel: einmündende kleine Straße links --------------------------------------------------------------------
/** Breite (zwei- bzw. einspurig), Eckausrundung und Länge bis zwischen die Bäume. */
export const STUB = { w2: 6.5, w1: 4.2, R: 6, len: 24 };
const stubCache = new WeakMap();
/**
 * Stummel von sec oder null (ENGINE.md 2.6): wo die zweispurige Straße an eine einspurige Rampe stößt (Rampe →
 * Zubringer, Zubringer → Auffahrt), biegt die Gegenspur in eine kleine zweispurige Straße links ab bzw. kommt aus
 * ihr; an der Verbindungsfahrbahn (Rampe → Verbindung) bringt eine einspurige Straße links die linke Spur.
 * {s: Mitte der Mündung, w, two, at: 'start' | 'end', near/far: linker Asphaltrand unserer Straße vor/hinter der
 * Mündung, R, a/b: Mündung samt Ausrundungen, cut: dort springt unser Rand von near auf far (unter dem Stummel),
 * x0: Anfang unter unserer Straße, x1: Ende zwischen den Bäumen, wait: x der Wartelinie, inA/inB: ihre Spanne}.
 * Abschnittskoordinaten von sec; prev/next dürfen fehlen, wenn die Frage nur die andere Seite betrifft.
 */
export function stubOf(sec, prev, next) {
  let at = null;
  let two = true;
  if (prev && prev.kind === 'ramp' && (sec.profile === 'land' || sec.profile === 'verbindung')) {
    at = 'start';
    two = sec.profile === 'land';
  } else if (next && next.kind === 'auf' && sec.profile === 'land') at = 'end';
  if (!at) return null;
  const c = stubCache.get(sec);
  if (c && c.at === at && c.two === two) return c;
  const w = two ? STUB.w2 : STUB.w1;
  const R = STUB.R;
  const own = VIS[sec.profile].aL;
  const ramp = VIS.rampe.aL;
  const near = at === 'start' ? ramp : own;
  const far = at === 'start' ? own : ramp;
  const s = at === 'start' ? sec.s0 + w / 2 + R : sec.s1 - w / 2 - R;
  const st = {
    s, w, two, at, near, far, R, a: s - w / 2 - R, b: s + w / 2 + R,
    cut: at === 'start' ? s + w / 2 - 0.25 : s - w / 2 + 0.25,
    x0: Math.max(near, far) + 0.3, x1: Math.min(near, far) - STUB.len,
    wait: near - 0.25, inA: s - w / 2, inB: two ? s : s + w / 2,
  };
  stubCache.set(sec, st);
  return st;
}

/** Zahlen klein halten (float32 in der Grafikkarte): Bezug für Texturkoordinaten, ein Vielfaches der Kachel. */
const uvBase = (s, tile) => Math.floor(s / (tile * 1000)) * tile * 1000;
const sstep = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

/**
 * Grenze der Territorien im Keil zwischen Autobahn und Rampe (Winkelhalbierende zwischen den Asphalträndern), als
 * x im Rahmen der Autobahn, u Meter von der Gabelung bzw. vom Einfädelpunkt. Davor (noch kein Keil): AB_EDGE.
 */
export function wedgeLine(u) {
  return Math.max(AB_EDGE, (AB_EDGE + VIS.rampe.aL + rampR(u)) / 2);
}
/** Spitze der grünen Insel zwischen Autobahn und Rampe (dort endet die Sperrfläche) und Länge ihrer Rundung. */
export const NOSE_U = J.gore;
const NOSE_L = 9;
/** Ab hier (u) stehen Planke der Autobahn und linke Planke der Rampe wieder: hinter der Inselspitze (dort ist im
 * Keil längst Platz für beide, die Winkelhalbierende liegt mehr als 0,5 m neben der Autobahnplanke). */
export const RAIL_U = NOSE_U + 6;
/** Rechter Rand der Insel im Rahmen der Autobahn bei u (vor der Spitze: Rand der Autobahn), rund zur Rampe hin. */
export function noseEdge(u, rampLeft) {
  if (u <= NOSE_U) return AB_EDGE;
  const t = Math.min(1, (u - NOSE_U) / NOSE_L);
  return AB_EDGE + (rampLeft - AB_EDGE) * Math.sqrt(1 - (1 - t) * (1 - t));
}
/** Rahmen der Autobahn → Rahmen des Abschnitts: x_eigen = x_Autobahn − linShift(u) (Trip.offsetLin, u ≥ 0). */
export const linShift = (u) => BETA * (u - J.cap / 2);
/** Versatz eines Abschnittspunkts im eigenen Rahmen: R(u) − offsetLin(u) im Bogen, dahinter 0. */
export const curveShift = (u) => (u < 0 ? 0 : rampR(u) - linShift(u));

// ---------------------------------------------------------------------------------------------------------------
// Querschnitt an einer Stelle

const visOf = (sec) => (sec && sec.kind !== 'ab' ? VIS[sec.profile] : null);

/**
 * Querschnitt von Abschnitt sec bei s (Abschnittskoordinaten), Übergänge eingerechnet. Ergebnis in out.
 * Anfang und Ende haben je ihren eigenen Übergang: zum Standstreifen der Autobahn (Rampe, Auffahrt: EXIT_T), an
 * einem Stummel (der linke Rand springt unter ihm, siehe stubInto) oder zum Querschnitt des Nachbarn: verengt sich
 * der nächste, laufen die Ränder auf den letzten taperLen Metern zusammen (wie die Grenzen in trip.profile); weitet
 * er sich (oder bleibt der Asphalt gleich breit und nur die Randlinien ändern sich, Verbindung → Zubringer), gehen
 * sie auf den ersten J.taper Metern des neuen Abschnitts auseinander. Je Seite gilt der stärkere Übergang
 * (tools/xxl-test.mjs prüft jede Naht: Ränder und Randlinien stoßen ohne Sprung aneinander).
 */
export function crossSection(sec, prev, next, s, out) {
  const P = VIS[sec.profile];
  const Pp = prev && prev.kind === 'ab' && sec.kind === 'ramp' ? SHOULDER : visOf(prev);
  const Pn = next && next.kind === 'ab' && sec.kind === 'auf' ? SHOULDER : visOf(next);
  const st = stubOf(sec, prev, next);
  // Nachbar und Gewicht je Seite
  let NL = null;
  let NR = null;
  let wl = 0;
  let wr = 0;
  const take = (Q, l, r) => {
    if (l > wl) {
      NL = Q;
      wl = l;
    }
    if (r > wr) {
      NR = Q;
      wr = r;
    }
  };
  if (Pp === SHOULDER) {
    const t = 1 - sstep((s - sec.s0) / EXIT_T);
    take(SHOULDER, t, t);
  } else if (Pp) {
    // weiter als der Vorgänger (oder gleich breit mit anderen Randlinien): hier laufen die Ränder auseinander
    const t = 1 - sstep((s - sec.s0) / J.taper);
    const stub = st && st.at === 'start';
    const left = Pp.aL > P.aL || (Pp.aL === P.aL && (Pp.eL !== P.eL || Pp.ewL !== P.ewL));
    const right = Pp.aR < P.aR || (Pp.aR === P.aR && (Pp.eR !== P.eR || Pp.ewR !== P.ewR));
    take(Pp, stub ? (s < st.cut ? 1 : 0) : left ? t : 0, right ? t : 0);
  }
  if (Pn === SHOULDER) {
    const t = 1 - sstep((sec.s1 - s) / EXIT_T);
    take(SHOULDER, t, t);
  } else if (Pn) {
    const tl = taperLen(sec, next);
    const t = sstep((s - (sec.s1 - tl)) / tl);
    const stub = st && st.at === 'end';
    take(Pn, stub ? (s > st.cut ? 1 : 0) : Pn.aL > P.aL ? t : 0, Pn.aR < P.aR ? t : 0);
  }
  const mix = (a, b, w) => a + (b - a) * w;
  out.aL = NL ? mix(P.aL, NL.aL, wl) : P.aL;
  out.aR = NR ? mix(P.aR, NR.aR, wr) : P.aR;
  out.eL = NL ? mix(P.eL, NL.eL, wl) : P.eL;
  out.eR = NR ? mix(P.eR, NR.eR, wr) : P.eR;
  out.ewL = NL ? mix(P.ewL, NL.ewL, wl) : P.ewL;
  out.ewR = NR ? mix(P.ewR, NR.ewR, wr) : P.ewR;
  out.verge = P.verge;
  out.kerb = P.kerb;
  out.rails = P.rails;
  out.railOutR = NR === SHOULDER ? mix(RAIL_OUT, SHOULDER.railOutR, wr) : RAIL_OUT;
  // Mittellinie: endet, wo der Übergang zu einem Querschnitt ohne sie beginnt, und beginnt erst nach dem Übergang
  const m = P.mid;
  out.mid = !!m && !((NL && !NL.mid && wl > 0) || (NR && !NR.mid && wr > 0));
  if (m) {
    const Q = wr > wl ? NR : NL;
    out.midX = Q && Q.mid ? mix(m.x, Q.mid.x, Math.max(wl, wr)) : m.x;
    out.midW = m.w;
    out.midDash = m.dash;
    out.midPeriod = m.period;
  }
  // Stummel: in der Mündung keine linke Randlinie und kein Bankett links, die Mittellinie erst hinter ihr
  out.edgeL = true;
  out.vergeL = true;
  if (st && s > st.a + 1e-6 && s < st.b - 1e-6) out.edgeL = out.vergeL = false;
  if (st && (st.at === 'start' ? s < st.b - 1e-6 : s > st.a + 1e-6)) out.mid = false;
  // Brunnenplatz: links weitet sich die Straße um die Insel, die Mittellinie endet in einer Strichlücke davor
  out.square = 0;
  const sq = squareOf(sec);
  if (sq) {
    const w = squareWeight(sq, s);
    if (w > 0) {
      out.square = w;
      out.aL = Math.min(out.aL, P.aL + (sq.aL - P.aL) * w);
    }
    const c = squareCuts(sec, sq);
    if (s > c.a + 1e-6 && s < c.b - 1e-6) out.mid = false;
  }
  return out;
}

/**
 * Wo die Mittellinie vor dem Brunnenplatz endet und dahinter wieder beginnt: jeweils mitten in einer Strichlücke
 * (Strich und Periode wie VIS.stadt.mid, gezählt ab sec.s0), damit kein Strich abgeschnitten wird.
 */
export function squareCuts(sec, sq) {
  const m = VIS.stadt.mid;
  const g = (m.dash + m.period) / 2; // Mitte der Lücke
  return {
    a: sec.s0 + Math.floor((sq.s0 - g - sec.s0) / m.period) * m.period + g,
    b: sec.s0 + Math.ceil((sq.s1 - g - sec.s0) / m.period) * m.period + g,
  };
}

// ---------------------------------------------------------------------------------------------------------------
// Texturen und Materialien

function asphaltTexture() {
  // der Grund der Autobahntextur ohne Markierungen (textures.js): gleiches Grau, gleiche Körnung je Meter
  const S = 256;
  const c = document.createElement('canvas');
  c.width = S;
  c.height = S;
  asphaltBase(c.getContext('2d'), S, S, (ASPHALT_TILE * ASPHALT_TILE) / (ROAD.width * ROAD.texLength));
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
}
export const ASPHALT_TILE = 9.6; // Meter je Kachel: 26,7 Pixel je Meter wie die Autobahntextur

/**
 * Gehweg der Orte in den Farben des Stadtbaukastens (kit/street.js PAVEMENT): cols × rows Felder im Wechsel zweier
 * Töne. Der Pflasterstreifen am Bordstein hat Reihen quer zur Straße, der Plattenweg ein Schachbrett aus Platten.
 */
function tilesTexture(colors, cols, rows) {
  const S = 64;
  const c = document.createElement('canvas');
  c.width = cols > 1 ? S : 8;
  c.height = S;
  const ctx = c.getContext('2d');
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      ctx.fillStyle = '#' + colors[(i + j) % 2].toString(16).padStart(6, '0');
      ctx.fillRect((i * c.width) / cols, (j * S) / rows, c.width / cols, S / rows);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
}
const GROUND_Y_FIELD = -0.02; // auf Höhe des Bodens (ground.js GROUND_Y), der Polygon-Versatz hebt die Äcker darüber

/** Meter je Kachel längs: zwei Pflasterreihen von 0,5 m bzw. zwei Platten von 1 m; quer liegen drei Platten. */
const STRIP_TILE = 1;
const WALK_TILE = 2;
const WALK_SLABS = 3;

function cobbleTexture() {
  // Kopfsteinpflaster für den Brunnenplatz: Reihen kleiner Granitsteine (12 × 10 je Kachel), versetzt, dunkle Fugen
  const S = 256;
  const c = document.createElement('canvas');
  c.width = S;
  c.height = S;
  const ctx = c.getContext('2d');
  const rnd = mulberry32(11);
  ctx.fillStyle = '#5d5a55';
  ctx.fillRect(0, 0, S, S);
  const cols = 12;
  const rows = 10;
  const w = S / cols;
  const h = S / rows;
  for (let j = 0; j < rows; j++) {
    const shift = (j % 2) * w * 0.5;
    for (let i = -1; i < cols; i++) {
      const x = i * w + shift;
      const tone = rnd();
      const v = 128 + Math.floor((tone - 0.5) * 44);
      const warm = rnd() < 0.3 ? 10 : 0;
      ctx.fillStyle = `rgb(${v + warm},${v + warm * 0.6},${v - 6})`;
      const r = 4;
      const x0 = x + 1.6;
      const y0 = j * h + 1.6;
      const ww = w - 3.2;
      const hh = h - 3.2;
      ctx.beginPath();
      ctx.moveTo(x0 + r, y0);
      ctx.arcTo(x0 + ww, y0, x0 + ww, y0 + hh, r);
      ctx.arcTo(x0 + ww, y0 + hh, x0, y0 + hh, r);
      ctx.arcTo(x0, y0 + hh, x0, y0, r);
      ctx.arcTo(x0, y0, x0 + ww, y0, r);
      ctx.fill();
      // Licht von oben links auf der gewölbten Oberfläche
      ctx.fillStyle = 'rgba(255,255,255,0.07)';
      ctx.fillRect(x0 + 2, y0 + 2, ww * 0.55, hh * 0.4);
      // Steine am rechten Rand auch links zeigen (kachelbar)
      if (x + w > S) {
        ctx.fillStyle = `rgb(${v + warm},${v + warm * 0.6},${v - 6})`;
        ctx.fillRect(x0 - S, y0, ww, hh);
      }
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
}
export const COBBLE_TILE = 1.2;

// Markierungen: jede Linie ist ein schmales Band; Strich, Lücke und runde Strichenden rechnet der Shader mit
// Kantenglättung aus (scharf in jeder Entfernung). aMark = (längs [m], quer [m], halbe Breite, Art) ·
// aMark2 = (Strich, Periode) für Linien bzw. (Abstand, Breite) für Sperrflächen-Schraffur.
const MARK_GLSL = /* glsl */ `
  float mk;
  {
    float hw = vMark.z;
    float d;
    if (vMark.w < 0.5) {
      float q = mod(vMark.x, vMark2.y);
      float a1 = max(vMark2.x - hw, hw);
      float dx = vMark2.x >= vMark2.y ? 0.0 : min(max(max(hw - q, q - a1), 0.0), max(vMark2.y + hw - q, 0.0));
      d = length(vec2(dx, vMark.y)) - hw;
    } else {
      // Schraffur: Streifen unter 45° (Abstand vMark2.x längs gemessen, Breite vMark2.y)
      float f = (vMark.x + vMark.y) / vMark2.x;
      d = abs(fract(f) - 0.5) * vMark2.x * 0.7071 - vMark2.y * 0.5;
    }
    float aa = max(fwidth(d), 1e-4);
    mk = clamp(0.5 - d / aa, 0.0, 1.0);
  }
  diffuseColor.a *= mk;
`;
function markMaterial(layer) {
  const m = W.std({ color: 0xf2f0e8, roughness: 0.62, transparent: true, depthWrite: false, ...layer });
  const base = m.onBeforeCompile;
  m.onBeforeCompile = (sh) => {
    base(sh);
    sh.vertexShader = 'attribute vec4 aMark;\nattribute vec2 aMark2;\nvarying vec4 vMark;\nvarying vec2 vMark2;\n'
      + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n  vMark = aMark;\n  vMark2 = aMark2;');
    sh.fragmentShader = 'varying vec4 vMark;\nvarying vec2 vMark2;\n'
      + sh.fragmentShader.replace('#include <alphatest_fragment>', MARK_GLSL + '#include <alphatest_fragment>');
  };
  m.customProgramCacheKey = () => 'curved-world-xxl-mark';
  return m;
}

export class RoadMaterials {
  constructor() {
    this.asphaltTex = asphaltTexture();
    this.asphalt = W.std({ map: this.asphaltTex, ...ASPHALT });
    // Asphalt, der unter dem der Autobahn liegen darf (Überlappung am Keil)
    this.asphaltUnder = W.std({ map: this.asphaltTex, ...ASPHALT, ...LAYER.under });
    this.mark = markMaterial(LAYER.mark);
    this.mark2 = markMaterial(LAYER.mark2);
    // Bankette der XXL-Straßen: die Wiese des Bodens, eine Spur dunkler
    this.grassTex = meadowTexture(GRASS_RGB.map((c) => Math.round(c * 0.93)), 9);
    this.grass = W.lambert({ map: this.grassTex, ...LAYER.verge });
    this.railTex = guardrailTexture();
    this.rail = W.std({ map: this.railTex, metalness: 0.75, roughness: 0.38, envMapIntensity: 0.9, side: THREE.DoubleSide });
    // Gehweg der Orte: matt und in den Farben des Stadtbaukastens, wie dessen Plätze (auch im Regen)
    this.strip = W.lambert({ map: tilesTexture(PAVEMENT.cobble, 1, 2) });
    this.walk = W.lambert({ map: tilesTexture(PAVEMENT.slab, 2, 2) });
    // je Pflaster der Steckbriefe (kit/steckbrief.js PAVES) ein Paar, erst wenn ein Ort es braucht
    this.paveMats = new Map([['platten', { strip: this.strip, walk: this.walk }]]);
    this.cobble = W.std({ map: cobbleTexture(), roughness: 0.82, envMapIntensity: 0.6 });
    this.solid = W.std({ vertexColors: true, roughness: 0.6, metalness: 0.1 });
    // Äcker (fieldplan.js): Farbe der Feldfrucht je Ecke, Reihen aus der Textur
    this.field = W.lambert({ map: fieldTexture(), vertexColors: true, side: THREE.DoubleSide, ...LAYER.patch });
    this.wet = 0;
  }

  /** Pflasterstreifen und Plattenweg im Pflaster key (PAVES), z. B. Klinker im Norden, Basalt in der Eifel. */
  pave(key) {
    let m = this.paveMats.get(key);
    if (!m) {
      const P = PAVES[key] ?? PAVES.platten;
      m = { strip: W.lambert({ map: tilesTexture(P.cobble, 1, 2) }), walk: W.lambert({ map: tilesTexture(P.slab, 2, 2) }) };
      this.paveMats.set(key, m);
    }
    return m;
  }

  /** Nässe wie Road.setWet: Asphalt dunkler und spiegelnder, Gras dunkler. */
  setWet(w) {
    if (Math.abs(w - this.wet) < 1e-4) return;
    this.wet = w;
    wetAsphalt(this.asphalt, w);
    wetAsphalt(this.asphaltUnder, w);
    this.cobble.roughness = 0.82 - w * 0.5;
    this.cobble.color.setScalar(1 - w * 0.35);
    this.cobble.envMapIntensity = 0.6 + w * 0.8;
    this.rail.roughness = 0.38 - w * 0.2;
    this.grass.color.setScalar(1 - w * 0.25);
    this.field.color.setScalar(1 - w * 0.3);
    this.mark.roughness = this.mark2.roughness = 0.62 - w * 0.4;
  }
}

// ---------------------------------------------------------------------------------------------------------------
// Geometrie-Puffer

export class GeoBuf {
  constructor(opts = {}) {
    this.pos = [];
    this.nrm = [];
    this.uv = opts.uv === false ? null : [];
    this.col = opts.color ? [] : null;
    this.mark = opts.mark ? [] : null;
    this.mark2 = opts.mark ? [] : null;
    this.idx = [];
  }
  get count() {
    return this.pos.length / 3;
  }
  vert(x, y, z, nx, ny, nz, u = 0, v = 0) {
    this.pos.push(x, y, z);
    this.nrm.push(nx, ny, nz);
    if (this.uv) this.uv.push(u, v);
    return this.pos.length / 3 - 1;
  }
  color(r, g, b) {
    this.col.push(r, g, b);
  }
  markAttr(along, across, hw, kind, p1, p2) {
    this.mark.push(along, across, hw, kind);
    this.mark2.push(p1, p2);
  }
  /** Viereck a-b-c-d (gegen den Uhrzeigersinn von der Vorderseite gesehen). */
  quad(a, b, c, d) {
    this.idx.push(a, b, c, a, c, d);
  }
  tri(a, b, c) {
    this.idx.push(a, b, c);
  }
  build() {
    if (!this.idx.length) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nrm, 3));
    if (this.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    if (this.col) g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    if (this.mark) {
      g.setAttribute('aMark', new THREE.Float32BufferAttribute(this.mark, 4));
      g.setAttribute('aMark2', new THREE.Float32BufferAttribute(this.mark2, 2));
    }
    g.setIndex(this.idx);
    return g;
  }
}

/** Box (vertex-farbig) in einen Puffer: Mitte x, y, z, halbe Maße, Drehung um y. */
export function boxInto(buf, x, y, z, hx, hy, hz, col, rotY = 0) {
  const c = Math.cos(rotY);
  const s = Math.sin(rotY);
  const P = (px, py, pz) => [x + px * c + pz * s, y + py, z - px * s + pz * c];
  const N = (nx, nz) => [nx * c + nz * s, -nx * s + nz * c];
  const faces = [
    [[1, 0, 0], [[hx, -hy, hz], [hx, -hy, -hz], [hx, hy, -hz], [hx, hy, hz]]],
    [[-1, 0, 0], [[-hx, -hy, -hz], [-hx, -hy, hz], [-hx, hy, hz], [-hx, hy, -hz]]],
    [[0, 1, 0], [[-hx, hy, hz], [hx, hy, hz], [hx, hy, -hz], [-hx, hy, -hz]]],
    [[0, 0, 1], [[-hx, -hy, hz], [hx, -hy, hz], [hx, hy, hz], [-hx, hy, hz]]],
    [[0, 0, -1], [[hx, -hy, -hz], [-hx, -hy, -hz], [-hx, hy, -hz], [hx, hy, -hz]]],
  ];
  for (const [n, corners] of faces) {
    const [nx, nz] = N(n[0], n[2]);
    const ids = corners.map(([px, py, pz]) => {
      const p = P(px, py, pz);
      const i = buf.vert(p[0], p[1], p[2], nx, n[1], nz);
      buf.color(col.r, col.g, col.b);
      return i;
    });
    buf.quad(ids[0], ids[1], ids[2], ids[3]);
  }
}

// ---------------------------------------------------------------------------------------------------------------
// Ein Stück Straße bauen

const COL = {
  post: new THREE.Color(0x8e9398),
  white: new THREE.Color(0xf2f2ee),
  black: new THREE.Color(0x1d1d1f),
  orange: new THREE.Color(0xff9a2a),
  kerb: new THREE.Color(PAVEMENT.kerb),
};

/**
 * Baut ein Stück [sa, sb] von Abschnitt sec (Nachbarn prev, next) als Gruppe mit wenigen Meshes im Rahmen von sec.
 * inCurve: das Stück ist der Bogen eines Knotenpunkts (Versatz curveShift, Grenzen zur Autobahn). Es steht bei z = −sa.
 */
export function buildPiece(mats, sec, prev, next, sa, sb, inCurve) {
  const sRef = sa;
  const link = sec.link;
  const uOf = (s) => (link.type === 'exit' ? s - link.s : link.s - s);
  const off = (s) => (inCurve ? curveShift(uOf(s)) : 0);
  // Rand der Autobahn und Winkelhalbierende des Keils, umgerechnet in den eigenen Rahmen
  const abEdge = (s) => AB_EDGE - linShift(uOf(s));
  // Stützstellen: dichter im Bogen, an Übergängen und am Brunnenplatz (dessen Kanten und Linienenden liegen genau
  // auf Stützstellen)
  const sq = squareOf(sec);
  const plaza = (s) => !!sq && s > sq.s0 && s < sq.s1;
  const ss = [];
  const near = (s) => s - sec.s0 < 70 || sec.s1 - s < 160;
  for (let s = sa; s < sb - 1e-6;) {
    ss.push(s);
    s += inCurve ? 3 : plaza(s) ? 2 : near(s) ? 4 : 10;
  }
  ss.push(sb);
  const extra = [];
  if (sq) {
    const c = squareCuts(sec, sq);
    extra.push(sq.s0, sq.s1, c.a, c.b);
  }
  const st = stubOf(sec, prev, next);
  if (st) extra.push(st.a, st.b, st.cut - 0.01, st.cut + 0.01);
  // Einfahrt des Ladeparks (charge.js): der Bordstein rechts ist dort abgesenkt, mit Übergängen davor und dahinter
  const dw = chargeOf(sec)?.drive ?? null;
  if (dw) extra.push(dw.s0 - dw.ramp, dw.s0, dw.s1, dw.s1 + dw.ramp);
  // Brücken (bridgeplan.js): dort liegen statt der Bankette die Kappen
  const cuts = sec.kind === 'stadt' ? [] : bridgeCuts(sec);
  for (const [c0, c1] of cuts) extra.push(c0, c0 + 0.01, c1 - 0.01, c1);
  const onBridge = (s) => cuts.some(([c0, c1]) => s > c0 + 0.005 && s < c1 - 0.005);
  if (extra.length) {
    for (const e of extra) if (e > sa + 0.005 && e < sb - 0.005 && !ss.some((q) => Math.abs(q - e) < 0.005)) ss.push(e);
    ss.sort((a, b) => a - b);
  }
  const n = ss.length;
  const X = ss.map((s) => crossSection(sec, prev, next, s, {}));
  const O = ss.map(off);
  const Z = ss.map((s) => -(s - sRef));
  const asph = new GeoBuf();
  const under = new GeoBuf();
  const grass = new GeoBuf();
  const marks = new GeoBuf({ mark: true, uv: false });
  const rails = new GeoBuf();
  const solid = new GeoBuf({ color: true, uv: false });
  const strip = new GeoBuf();
  const walk = new GeoBuf();
  const cobble = new GeoBuf();
  const aBase = uvBase(sRef, ASPHALT_TILE);
  const gBase = uvBase(sRef, 7);
  const stBase = uvBase(sRef, STRIP_TILE);
  const wBase = uvBase(sRef, WALK_TILE);
  const wedge = inCurve ? (s) => wedgeLine(uOf(s)) - linShift(uOf(s)) : null;

  // --- Asphalt (im Bogen: der Teil über der Autobahn bleibt ihr, die Rampe liegt dort darunter) -------------------
  {
    const rows = [];
    for (let i = 0; i < n; i++) {
      const x = X[i];
      const xl = x.aL + O[i];
      const xr = x.aR + O[i];
      rows.push([xl, xr]);
    }
    // seg(i): das Stück zwischen Stützstelle i − 1 und i gehört in diesen Puffer
    const strip = (buf, l, r, tile, base, seg = null) => {
      let prevPair = null;
      for (let i = 0; i < n; i++) {
        const xl = l(i);
        const xr = r(i);
        const v = (ss[i] - base) / tile;
        const pair = [buf.vert(xl, 0, Z[i], 0, 1, 0, (xl - O[i]) / tile, v), buf.vert(xr, 0, Z[i], 0, 1, 0, (xr - O[i]) / tile, v)];
        if (prevPair && (!seg || seg(i))) buf.quad(prevPair[0], prevPair[1], pair[1], pair[0]);
        prevPair = pair;
      }
    };
    if (inCurve) {
      // über der Autobahn (x < AB_EDGE) liegt deren Asphalt; dort nur ein schmaler Streifen darunter gegen Ritzen
      // bis zur Inselspitze ist der Keil gepflastert (Sperrfläche), dahinter rundet sich die Insel zur Rampe
      const E = ss.map(abEdge);
      const N = ss.map((s, i) => {
        const u = uOf(s);
        const sh = linShift(u);
        return u <= NOSE_U ? E[i] : noseEdge(u, rows[i][0] + sh) - sh;
      });
      strip(asph, (i) => Math.max(rows[i][0], N[i]), (i) => Math.max(rows[i][1], N[i] + 0.001), ASPHALT_TILE, aBase);
      strip(under, (i) => Math.min(rows[i][0], E[i] - 0.08), (i) => (uOf(ss[i]) <= NOSE_U ? Math.min(Math.max(rows[i][0], E[i]) + 0.05, rows[i][1]) : Math.min(rows[i][0], E[i] - 0.08)), ASPHALT_TILE, aBase);
    } else if (sq) {
      // der Brunnenplatz ist über die ganze Breite gepflastert, davor und dahinter Asphalt
      const inPlaza = (i) => plaza((ss[i - 1] + ss[i]) / 2);
      strip(asph, (i) => rows[i][0], (i) => rows[i][1], ASPHALT_TILE, aBase, (i) => !inPlaza(i));
      strip(cobble, (i) => rows[i][0], (i) => rows[i][1], COBBLE_TILE, uvBase(sRef, COBBLE_TILE), inPlaza);
    } else strip(asph, (i) => rows[i][0], (i) => rows[i][1], ASPHALT_TILE, aBase);
  }

  // --- Brunneninsel: runder Bordstein, gepflastert (der Brunnen selbst kommt von world.js) ------------------------
  if (sq && sq.s >= sa && sq.s < sb) islandInto(solid, cobble, sq.x, -(sq.s - sRef), sq.r, ISLAND_H);

  // --- Stummel (einmündende Straße links) ---------------------------------------------------------------------------
  if (st && st.s >= sa && st.s < sb) stubInto(under, marks, grass, st, sRef, prev, sec, next);

  // --- Fahrstreifen-Ende: die linke Spur der Verbindungsfahrbahn endet vor der Auffahrt (taperLen) -------------------
  // drei Verschwenkungspfeile in der endenden Spur zeigen schräg nach rechts, dann läuft der Rand zusammen
  if (sec.profile === 'verbindung' && next && next.profile === 'rampe') {
    const t0 = sec.s1 - taperLen(sec, next);
    const xl = (VIS.verbindung.aL + VIS.verbindung.mid.x) / 2;
    for (const back of [130, 80, 30]) {
      const s0 = t0 - back;
      if (s0 < sa || s0 + 8 > sb) continue;
      const tip = [xl + 1.15, s0 + 6.4];
      markLine(marks, [[xl, s0], [xl, s0 + 3.6], tip], 0.11, 1, 1, sRef);
      const dx = 1.15;
      const ds = 2.8;
      const L = Math.hypot(dx, ds);
      const ux = dx / L;
      const us = ds / L;
      markFill(marks, [[tip[0] + ux * 1.5, tip[1] + us * 1.5], [tip[0] - us * 0.48, tip[1] + ux * 0.48], [tip[0] + us * 0.48, tip[1] - ux * 0.48]], sRef);
    }
  }

  // --- Randlinien und Mittellinie --------------------------------------------------------------------------------
  const line = (xs, ws, on, dash, period, anchor) => {
    // xs(i): Mitte, ws(i): Breite, on(i): vorhanden
    let prevPair = null;
    for (let i = 0; i < n; i++) {
      if (!on(i)) {
        prevPair = null;
        continue;
      }
      const w = ws(i);
      const hw = w / 2;
      const pad = 0.06;
      const xc = xs(i) + O[i];
      const along = ss[i] - anchor;
      const a = marks.vert(xc - hw - pad, 0, Z[i], 0, 1, 0);
      marks.markAttr(along, -hw - pad, hw, 0, dash, period);
      const b = marks.vert(xc + hw + pad, 0, Z[i], 0, 1, 0);
      marks.markAttr(along, hw + pad, hw, 0, dash, period);
      if (prevPair) marks.quad(prevPair[0], prevPair[1], b, a);
      prevPair = [a, b];
    }
  };
  if (!X[0].kerb) {
    line((i) => X[i].eL, (i) => X[i].ewL, (i) => X[i].edgeL, 1, 1, sec.s0);
    line((i) => X[i].eR, (i) => X[i].ewR, () => true, 1, 1, sec.s0);
  }
  if (VIS[sec.profile].mid) {
    const m = VIS[sec.profile].mid;
    line((i) => X[i].midX, () => m.w, (i) => X[i].mid, m.dash, m.period, sec.s0);
  }

  // --- Bankette ----------------------------------------------------------------------------------------------------
  if (X[0].verge > 0) {
    const strip = (l, r, on = null) => {
      let prevPair = null;
      for (let i = 0; i < n; i++) {
        const xl = l(i);
        const xr = r(i);
        if (!(xr > xl + 0.01) || (on && !on(i))) {
          prevPair = null;
          continue;
        }
        const v = (ss[i] - gBase) / 7;
        const pair = [grass.vert(xl, 0, Z[i], 0, 1, 0, (xl - O[i]) / 7, v), grass.vert(xr, 0, Z[i], 0, 1, 0, (xr - O[i]) / 7, v)];
        if (prevPair) grass.quad(prevPair[0], prevPair[1], pair[1], pair[0]);
        prevPair = pair;
      }
    };
    // rechts
    strip((i) => X[i].aR + O[i] - 0.02, (i) => X[i].aR + O[i] + X[i].verge, (i) => !onBridge(ss[i]));
    // links (im Bogen nur bis zur Winkelhalbierenden des Keils)
    strip((i) => (inCurve ? Math.max(X[i].aL + O[i] - X[i].verge, wedge(ss[i])) : X[i].aL - X[i].verge), (i) => X[i].aL + O[i] + 0.02, (i) => X[i].vergeL && !onBridge(ss[i]));
  }

  // --- Gehweg und Bordstein (Ortsdurchfahrt) ---------------------------------------------------------------------
  if (X[0].kerb) {
    // Bordstein und Gehweg steigen an den Ortsenden auf 4 m aus dem Boden (zwischen zwei Ortsstücken nicht)
    const kerbed = (q) => !!q && q.kind !== 'ab' && !!VIS[q.profile].kerb;
    const rise = (s) => KERB.h * Math.max(0, Math.min(1, kerbed(prev) ? 1 : (s - sec.s0) / 4, kerbed(next) ? 1 : (sec.s1 - s) / 4));
    const wide = !!sq && kitTown(sec);
    // Platten quer: gezählt ab dem Rand des Pflasterstreifens der ungeweiteten Straße, so bleiben sie am Brunnenplatz
    // gerade liegen, wo der Bordstein schräg läuft
    const slabU = (side, x) => ((side * (x - (side < 0 ? VIS.stadt.aL : VIS.stadt.aR)) - KERB.strip) * WALK_SLABS) / (2 * (KERB.pave - KERB.strip));
    for (const side of [-1, 1]) {
      let prevRow = null;
      for (let i = 0; i < n; i++) {
        const s = ss[i];
        const hh = dw && side > 0 ? kerbAt(dw, s, rise(s)) : rise(s);
        const edge = side < 0 ? X[i].aL : X[i].aR;
        const bv = Math.min(KERB.bevel, hh); // runde Kante (verschwindet, wo der Bordstein aus dem Boden steigt)
        const x0 = edge; // Bordsteinkante zur Fahrbahn
        const xb = edge + side * bv;
        const x1 = edge + side * KERB.w; // Bordstein oben
        const x2 = edge + side * KERB.strip; // Pflasterstreifen außen
        // Plattenweg außen: die Häuserflucht. Am Brunnenplatz eines Orts aus dem Stadtbaukasten reicht er links über
        // den ganzen Platz bis zur zurückgesetzten Flucht (dort stehen dessen Häuser, kit/layout.js planTown island)
        const x3 = wide && side < 0 && s >= sq.s0 && s <= sq.s1 ? sq.aL - KERB.pave : edge + side * KERB.pave;
        const z = Z[i];
        // Bordstein: Stirn, runde Kante und Oberseite (vertex-farbig), Pflasterstreifen, Plattenweg, Außenkante
        const row = {
          f0: solid.vert(x0, 0, z, -side, 0, 0), f1: solid.vert(x0, hh - bv, z, -side, 0, 0),
          c0: solid.vert(x0, hh - bv, z, -side * Math.SQRT1_2, Math.SQRT1_2, 0), c1: solid.vert(xb, hh, z, -side * Math.SQRT1_2, Math.SQRT1_2, 0),
          t0: solid.vert(xb, hh, z, 0, 1, 0), t1: solid.vert(x1, hh, z, 0, 1, 0),
          o0: solid.vert(x3, hh, z, side, 0, 0), o1: solid.vert(x3, 0, z, side, 0, 0),
          s0: strip.vert(x1, hh, z, 0, 1, 0, 0.5, (s - stBase) / STRIP_TILE),
          s1: strip.vert(x2, hh, z, 0, 1, 0, 0.5, (s - stBase) / STRIP_TILE),
          w0: walk.vert(x2, hh, z, 0, 1, 0, slabU(side, x2), (s - wBase) / WALK_TILE),
          w1: walk.vert(x3, hh, z, 0, 1, 0, slabU(side, x3), (s - wBase) / WALK_TILE),
        };
        for (let k = 0; k < 8; k++) solid.color(COL.kerb.r, COL.kerb.g, COL.kerb.b);
        if (prevRow) {
          const A = prevRow;
          const B = row;
          // rechts liegt die innere Kante bei kleinerem x, links bei größerem: die Vorderseite zeigt so immer nach
          // oben bzw. außen
          const q = (buf, a, b, c, d) => (side > 0 ? buf.quad(a, d, c, b) : buf.quad(a, b, c, d));
          q(solid, A.f0, B.f0, B.f1, A.f1);
          q(solid, A.c0, B.c0, B.c1, A.c1);
          q(solid, A.t0, B.t0, B.t1, A.t1);
          q(solid, A.o0, B.o0, B.o1, A.o1);
          q(strip, A.s0, B.s0, B.s1, A.s1);
          q(walk, A.w0, B.w0, B.w1, A.w1);
        }
        prevRow = row;
      }
    }
    // Grünstreifen hinter dem Gehweg (Vorgärten), wo noch Platzhalterhäuser stehen; die Orte des Stadtbaukastens
    // beginnen gleich am Gehweg
    for (const side of kitTown(sec) ? [] : [-1, 1]) {
      let prevPair = null;
      for (let i = 0; i < n; i++) {
        const edge = side < 0 ? X[i].aL : X[i].aR;
        const xa = edge + side * (KERB.pave - 0.02);
        const xb = edge + side * (KERB.pave + KERB.garden);
        const l = Math.min(xa, xb);
        const r = Math.max(xa, xb);
        const v = (ss[i] - gBase) / 7;
        const pair = [grass.vert(l, 0, Z[i], 0, 1, 0, l / 7, v), grass.vert(r, 0, Z[i], 0, 1, 0, r / 7, v)];
        if (prevPair) grass.quad(prevPair[0], prevPair[1], pair[1], pair[0]);
        prevPair = pair;
      }
    }
  }

  // --- Schutzplanken -------------------------------------------------------------------------------------------
  if (X[0].rails) {
    const railRange = railSpans(sec, prev, next, sa, sb);
    for (const side of [-1, 1]) {
      for (const [r0, r1, endA, endB] of railRange[side < 0 ? 0 : 1]) {
        railStrip(rails, solid, ss, X, O, Z, side, r0, r1, endA, endB, sRef);
      }
    }
  }

  // --- Leitpfosten alle 50 m ---------------------------------------------------------------------------------------
  if (!X[0].kerb) {
    const k0 = Math.ceil(sa / 50);
    for (let k = k0; k * 50 < sb; k++) {
      const s = k * 50;
      if (s - sec.s0 < 8 || sec.s1 - s < 8 || onBridge(s)) continue;
      const x = crossSection(sec, prev, next, s, {});
      const inMouth = st && s > st.a - 3 && s < st.b + 3;
      const o = off(s);
      const z = -(s - sRef);
      for (const side of [-1, 1]) {
        if (side < 0 && inCurve && x.aL + o - 1.0 < wedge(s) + 0.3) continue;
        if (side < 0 && inMouth) continue;
        const xp = side < 0 ? x.aL - (x.rails ? 1.0 : 0.75) : x.aR + (x.rails ? 1.0 : 0.75);
        delineator(solid, xp + o, z, side);
      }
    }
  }

  // --- Äcker neben Landstraße und Zubringer (fieldplan.js) ---------------------------------------------------------
  const fieldBuf = new GeoBuf({ color: true });
  {
    const XF = {};
    const tone = new THREE.Color();
    for (const f of fieldsOf(sec)) {
      const a = Math.max(f.s0, sa);
      const b = Math.min(f.s1, sb);
      if (b - a < 0.25) continue;
      const C = CROPS[f.crop];
      // jedes Feld etwas anders: Helligkeit und Ton aus seiner Lage
      const h = Math.sin(f.s0 * 12.9898 + f.d0 * 78.233) * 43758.5453;
      const jit = h - Math.floor(h);
      tone.setRGB(C.rgb[0] * (0.92 + jit * 0.14), C.rgb[1] * (0.92 + jit * 0.12), C.rgb[2] * (0.94 + jit * 0.1), THREE.SRGBColorSpace);
      const step = inCurve ? 3 : 8;
      let last = -1;
      for (let s = a; ; s = Math.min(b, s + step)) {
        crossSection(sec, prev, next, s, XF);
        const band = XF.kerb ? KERB.pave + KERB.garden : XF.rails ? Math.max(VERGE, 1.6) : XF.verge;
        const edge = (f.side < 0 ? XF.aL - band : XF.aR + band) + off(s);
        const x0 = edge + f.side * f.d0;
        const x1 = edge + f.side * f.d1;
        const z = -(s - sRef);
        const u0 = f.along ? f.d0 / C.row : s / C.row;
        const u1 = f.along ? f.d1 / C.row : s / C.row;
        const v0 = f.along ? s / FIELD_V : f.d0 / FIELD_V;
        const v1 = f.along ? s / FIELD_V : f.d1 / FIELD_V;
        const i0 = fieldBuf.vert(x0, GROUND_Y_FIELD, z, 0, 1, 0, u0, v0);
        const i1 = fieldBuf.vert(x1, GROUND_Y_FIELD, z, 0, 1, 0, u1, v1);
        fieldBuf.color(tone.r, tone.g, tone.b);
        fieldBuf.color(tone.r, tone.g, tone.b);
        if (last >= 0) fieldBuf.quad(last, last + 1, i1, i0);
        last = i0;
        if (s >= b) break;
      }
    }
  }

  const g = new THREE.Group();
  g.position.z = -sRef;
  const add = (buf, mat, shadow = true) => {
    const geo = buf.build();
    if (!geo) return;
    const m = new THREE.Mesh(geo, mat);
    m.receiveShadow = true;
    m.castShadow = false;
    m.frustumCulled = false;
    if (!shadow) m.receiveShadow = false;
    g.add(m);
  };
  add(asph, mats.asphalt);
  add(under, mats.asphaltUnder);
  add(grass, mats.grass);
  // Gehweg im Pflaster des Orts (Steckbrief), sonst den Platten des Stadtbaukastens
  const pm = sec.kind === 'stadt' && sec.place >= 0 && places[sec.place] ? mats.pave(profileOf(places[sec.place]).paveKey) : mats.pave('platten');
  add(strip, pm.strip);
  add(walk, pm.walk);
  add(cobble, mats.cobble);
  add(marks, mats.mark);
  add(rails, mats.rail);
  add(fieldBuf, mats.field);
  const sg = solid.build();
  if (sg) {
    const m = new THREE.Mesh(sg, mats.solid);
    m.castShadow = true;
    m.receiveShadow = true;
    m.frustumCulled = false;
    g.add(m);
  }
  return g;
}

// --- Markierungen als Linienzug und als Fläche (Abschnittskoordinaten [x, s]) --------------------------------------
/** Linienzug pts mit halber Breite hw, Strich/Periode (dash ≥ period: durchgezogen), runde Strichenden. */
export function markLine(marks, pts, hw, dash, period, sRef) {
  const pad = 0.06;
  let along = 0;
  let prev = null;
  for (let i = 0; i < pts.length; i++) {
    const [x, s] = pts[i];
    if (i > 0) along += Math.hypot(x - pts[i - 1][0], s - pts[i - 1][1]);
    // Richtung (gemittelt an Knicken), Querrichtung nach links
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    const dx = b[0] - a[0];
    const ds = b[1] - a[1];
    const L = Math.hypot(dx, ds) || 1;
    const nx = -ds / L;
    const ns = dx / L;
    const w = hw + pad;
    const l = marks.vert(x + nx * w, 0, -(s + ns * w - sRef), 0, 1, 0);
    marks.markAttr(along, w, hw, 0, dash, period);
    const r = marks.vert(x - nx * w, 0, -(s - ns * w - sRef), 0, 1, 0);
    marks.markAttr(along, -w, hw, 0, dash, period);
    if (prev) upQuad(marks, prev[0], prev[1], r, l);
    prev = [l, r];
  }
}
/** Gefüllte konvexe Fläche (Wartelinie, Dreieck): ohne Kantenglättung im Shader (die Kanten glättet MSAA). */
function markFill(marks, pts, sRef) {
  const ids = pts.map(([x, s]) => {
    const i = marks.vert(x, 0, -(s - sRef), 0, 1, 0);
    marks.markAttr(0, 0, 50, 0, 1, 1);
    return i;
  });
  for (let k = 1; k < ids.length - 1; k++) upTri(marks, ids[0], ids[k], ids[k + 1]);
}
/** Dreieck/Viereck mit Vorderseite nach oben (+y), egal in welcher Reihenfolge die Ecken kommen. */
export function upTri(buf, a, b, c) {
  const P = buf.pos;
  const ax = P[a * 3];
  const az = P[a * 3 + 2];
  const cr = (P[b * 3] - ax) * (P[c * 3 + 2] - az) - (P[b * 3 + 2] - az) * (P[c * 3] - ax);
  // cr = −((b − a) × (c − a)).y: die Normale zeigt nach oben, wenn cr < 0
  if (cr < 0) buf.tri(a, b, c);
  else buf.tri(a, c, b);
}
export function upQuad(buf, a, b, c, d) {
  upTri(buf, a, b, c);
  upTri(buf, a, c, d);
}

/**
 * Stummel: Asphalt (unter unserer Straße, Schicht 'under'), Eckausrundungen, Bankette, Rand- und Mittellinien,
 * Wartelinie und Dreieck „Vorfahrt gewähren“ für die Einmündung (Abschnittskoordinaten, Bezug sRef).
 */
function stubInto(asph, marks, grass, st, sRef, prev, sec, next) {
  const tile = ASPHALT_TILE;
  const base = uvBase(sRef, tile);
  const gBase = uvBase(sRef, 7);
  const Va = (x, s) => asph.vert(x, 0, -(s - sRef), 0, 1, 0, x / tile, (s - base) / tile);
  const Vg = (x, s) => grass.vert(x, 0, -(s - sRef), 0, 1, 0, x / 7, (s - gBase) / 7);
  const { w, R } = st;
  const sN = st.s - w / 2; // nahe Kante (kleineres s)
  const sF = st.s + w / 2;
  // Fahrbahn des Stummels
  const xs = [];
  for (let k = 0; k <= 8; k++) xs.push(st.x0 + ((st.x1 - st.x0) * k) / 8);
  for (let k = 1; k < xs.length; k++) upQuad(asph, Va(xs[k - 1], sN), Va(xs[k], sN), Va(xs[k], sF), Va(xs[k - 1], sF));
  // Eckausrundungen (Fächer von der Ecke aus) und Bankett-Viertelkreise außen herum (Breite vw wie das Bankett der
  // Straße, die dort an die Ecke stößt)
  const N = 14;
  const nearQ = st.at === 'start' ? prev : sec;
  const farQ = st.at === 'start' ? sec : next;
  const vwOf = (q) => Math.min(R - 1, q ? VIS[q.profile].verge || VERGE : VERGE);
  const corner = (ex, es, sg, vw) => {
    // Ecke (ex, es); Kreismitte (ex − R, es + sg·R); sg = −1 nahe Ecke (Kreis bei kleinerem s), +1 ferne Ecke
    const cx = ex - R;
    const cs = es + sg * R;
    const P = Va(ex, es);
    let prevA = -1;
    let prevG = null;
    for (let k = 0; k <= N; k++) {
      const t = (k / N) * Math.PI * 0.5;
      const px = cx + R * Math.cos(t);
      const ps = cs - sg * R * Math.sin(t);
      const A = Va(px, ps);
      if (prevA >= 0) upTri(asph, P, prevA, A);
      prevA = A;
      const gx = cx + (R - vw) * Math.cos(t);
      const gs = cs - sg * (R - vw) * Math.sin(t);
      const G = [Vg(px, ps), Vg(gx, gs)];
      if (prevG) upQuad(grass, prevG[0], prevG[1], G[1], G[0]);
      prevG = G;
    }
  };
  corner(st.near, sN, -1, vwOf(nearQ));
  corner(st.far, sF, 1, vwOf(farQ));
  // Bankette entlang des Stummels
  for (const [s0, s1, xe] of [[sN - vwOf(nearQ), sN + 0.02, st.near], [sF - 0.02, sF + vwOf(farQ), st.far]]) {
    upQuad(grass, Vg(xe - R, s0), Vg(st.x1, s0), Vg(st.x1, s1), Vg(xe - R, s1));
  }
  // Randlinien: um die Ecke von unserer Randlinie in die des Stummels
  const eoff = (q) => (q ? VIS[q.profile].eL - VIS[q.profile].aL : 0.25);
  const edge = (ex, es, sg, off) => {
    const cx = ex - R;
    const cs = es + sg * R;
    const pts = [];
    for (let k = 0; k <= N; k++) {
      const t = (k / N) * Math.PI * 0.5;
      pts.push([cx + (R + off) * Math.cos(t), cs - sg * (R + off) * Math.sin(t)]);
    }
    pts.push([st.x1 + 3, es - sg * off]);
    markLine(marks, pts, 0.07, 1, 1, sRef);
  };
  edge(st.near, sN, -1, eoff(nearQ));
  edge(st.far, sF, 1, eoff(farQ));
  // Mittellinie (zweispurig): an der Einmündung durchgezogen, dann gestrichelt
  const xm = Math.min(st.near, st.far) - 1.2;
  if (st.two) {
    markLine(marks, [[xm, st.s], [xm - 8, st.s]], 0.06, 1, 1, sRef);
    markLine(marks, [[xm - 8 - 3, st.s], [st.x1 + 3, st.s]], 0.06, 3, 6, sRef);
  }
  // Wartelinie (Breitstrich 0,5 m, Striche 0,5 m, Lücken 0,25 m) über die einmündende Spur
  const wa = st.inA + 0.25;
  const wb = st.inB - 0.15;
  const nBlk = Math.max(1, Math.floor((wb - wa + 0.25) / 0.75));
  const off0 = wa + (wb - wa - (nBlk * 0.75 - 0.25)) / 2;
  for (let k = 0; k < nBlk; k++) {
    const s0 = off0 + k * 0.75;
    markFill(marks, [[st.wait - 0.25, s0], [st.wait + 0.25, s0], [st.wait + 0.25, s0 + 0.5], [st.wait - 0.25, s0 + 0.5]], sRef);
  }
  // Dreieck „Vorfahrt gewähren“ davor, Spitze zum ankommenden Wagen
  const sc = (st.inA + st.inB) / 2;
  const xt = st.wait - 2.6;
  markFill(marks, [[xt, sc - 0.55], [xt, sc + 0.55], [xt - 2.6, sc]], sRef);
}

/** Höhe der Brunneninsel (Bordstein): darauf steht der Brunnen. */
export const ISLAND_H = 0.14;

/** Runde Insel: Bordstein (Stirn, abgerundete Oberkante) und gepflasterte Fläche, Mitte x, z, Radius r, Höhe h. */
function islandInto(solid, cobble, x, z, r, h) {
  const N = 64;
  const kw = 0.24; // Breite des Bordsteins oben
  const col = COL.kerb;
  const ring = [];
  for (let k = 0; k <= N; k++) {
    const a = (k / N) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    // Stirn (außen, senkrecht), Fase, Oberseite
    const v = [
      solid.vert(x + c * r, 0, z + s * r, c, 0, s),
      solid.vert(x + c * r, h - 0.025, z + s * r, c, 0, s),
      solid.vert(x + c * r, h - 0.025, z + s * r, c * 0.7, 0.7, s * 0.7),
      solid.vert(x + c * (r - 0.025), h, z + s * (r - 0.025), c * 0.7, 0.7, s * 0.7),
      solid.vert(x + c * (r - 0.025), h, z + s * (r - 0.025), 0, 1, 0),
      solid.vert(x + c * (r - kw), h, z + s * (r - kw), 0, 1, 0),
    ];
    for (let i = 0; i < v.length; i++) solid.color(col.r, col.g, col.b);
    if (k > 0) {
      const p = ring[k - 1];
      solid.quad(p[0], p[1], v[1], v[0]);
      solid.quad(p[2], p[3], v[3], v[2]);
      solid.quad(p[4], p[5], v[5], v[4]);
    }
    ring.push(v);
  }
  // Pflaster (Fächer von der Mitte), Texturkoordinaten in Metern wie der Platz
  const ri = r - kw;
  const mid = cobble.vert(x, h, z, 0, 1, 0, x / COBBLE_TILE, -z / COBBLE_TILE);
  let prev = -1;
  for (let k = 0; k <= N; k++) {
    const a = (k / N) * Math.PI * 2;
    const px = x + Math.cos(a) * ri;
    const pz = z + Math.sin(a) * ri;
    const i = cobble.vert(px, h, pz, 0, 1, 0, px / COBBLE_TILE, -pz / COBBLE_TILE);
    if (prev >= 0) cobble.tri(mid, i, prev);
    prev = i;
  }
}

/**
 * Wo stehen Planken (je Seite [[s0, s1, Anfang mit Endstück, Ende mit Endstück], …]) im Stück [sa, sb]?
 * Rechts läuft die Planke der Autobahn in die der Rampe über (kein Endstück); links beginnt sie im Keil erst bei
 * RAIL_U. An Übergängen zu Abschnitten ohne Planken enden sie mit einem abgesenkten Endstück.
 */
function railSpans(sec, prev, next, sa, sb) {
  const P = VIS[sec.profile];
  const has = (q) => !!q && q.kind !== 'ab' && VIS[q.profile].rails;
  let l0 = sec.s0;
  let l1 = sec.s1;
  let r0 = sec.s0;
  let r1 = sec.s1;
  let eL0 = !has(prev);
  let eL1 = !has(next);
  let eR0 = !has(prev);
  let eR1 = !has(next);
  if (sec.kind === 'ramp' && prev && prev.kind === 'ab') {
    l0 = sec.s0 + RAIL_U;
    eL0 = true;
    eR0 = false;
  }
  if (sec.kind === 'auf' && next && next.kind === 'ab') {
    l1 = sec.s1 - RAIL_U;
    eL1 = true;
    eR1 = false;
  }
  // links mündet ein Stummel: dort ist die Planke unterbrochen (sie endet kurz vor und beginnt kurz nach der Mündung)
  const st = stubOf(sec, prev, next);
  if (st && st.at === 'start') {
    l0 = st.b + 2;
    eL0 = true;
  }
  if (st && st.at === 'end') {
    l1 = st.a - 2;
    eL1 = true;
  }
  if (sec.kind === 'ramp' && next && stubOf(next, sec, null)) {
    l1 = sec.s1 - 3;
    eL1 = true;
  }
  if (sec.kind === 'auf' && prev && stubOf(prev, null, sec)) {
    l0 = sec.s0 + 3;
    eL0 = true;
  }
  const clip = (a, b, ea, eb) => {
    const x0 = Math.max(a, sa);
    const x1 = Math.min(b, sb);
    return x1 > x0 + 0.01 ? [[x0, x1, ea && a >= sa - 1e-6, eb && b <= sb + 1e-6]] : [];
  };
  return [clip(l0, l1, eL0, eL1), clip(r0, r1, eR0, eR1)];
}

/** Schutzplanke (W-Profil wie an der Autobahn) mit Pfosten alle 2 m; Endstücke senken sich auf 4 m in den Boden. */
function railStrip(rails, solid, ss, X, O, Z, side, s0, s1, endA, endB, sRef) {
  const y0 = 0.52;
  const y1 = 0.84;
  // eigene Stützstellen im Bereich [s0, s1] (die Endstücke brauchen feine Schritte)
  const pts = [];
  const at = (s) => {
    // lineare Interpolation der vorberechneten Querschnitte
    let i = 0;
    while (i < ss.length - 2 && ss[i + 1] < s) i++;
    const t = Math.min(1, Math.max(0, (s - ss[i]) / Math.max(1e-6, ss[i + 1] - ss[i])));
    const xa = side < 0 ? X[i].aL - RAIL_OUT : X[i].aR + X[i].railOutR;
    const xb = side < 0 ? X[i + 1].aL - RAIL_OUT : X[i + 1].aR + X[i + 1].railOutR;
    return xa + (xb - xa) * t + O[i] + (O[i + 1] - O[i]) * t;
  };
  for (let s = s0; s < s1;) {
    pts.push(s);
    const fine = (endA && s - s0 < 4) || (endB && s1 - s < 4);
    s = Math.min(s1, s + (fine ? 1 : 3));
    if (s >= s1) pts.push(s1);
  }
  const drop = (s) => {
    const a = endA ? Math.min(1, (s - s0) / 4) : 1;
    const b = endB ? Math.min(1, (s1 - s) / 4) : 1;
    return sstep(Math.min(a, b));
  };
  const facing = -side; // Vorderseite zur Fahrbahn
  let prev = null;
  for (const s of pts) {
    const x = at(s);
    const k = drop(s);
    const z = -(s - sRef);
    const ya = y0 * k;
    const yb = 0.12 + (y1 - 0.12) * k;
    // Textur wie an der Autobahn (4 m je Kachel), Bezug ein Vielfaches davon (kleine Zahlen)
    const u = s / 4 - Math.floor(sRef / 4);
    const a = rails.vert(x, ya, z, facing, 0, 0, u, 0);
    const b = rails.vert(x, yb, z, facing, 0, 0, u, 1);
    const c = rails.vert(x - 0.08 * facing, yb, z, 0, 1, 0, u, 0);
    const d = rails.vert(x, yb + 0.01, z, 0, 1, 0, u, 1);
    if (prev) {
      if (side > 0) {
        rails.quad(prev.a, a, b, prev.b);
        rails.quad(prev.c, c, d, prev.d);
      } else {
        rails.quad(prev.a, prev.b, b, a);
        rails.quad(prev.c, prev.d, d, c);
      }
    }
    prev = { a, b, c, d };
  }
  // Pfosten auf geraden Metern (wie an der Autobahn), nicht auf den Endstücken
  for (let s = Math.ceil(s0 / 2) * 2; s <= s1; s += 2) {
    if ((endA && s - s0 < 3) || (endB && s1 - s < 3)) continue;
    // Pfosten 0,17 m hinter der Planke (wie an der Autobahn)
    boxInto(solid, at(s) + side * 0.17, 0.4, -(s - sRef), 0.05, 0.4, 0.035, COL.post);
  }
}

/** Leitpfosten: weiß, schwarzes Band, rechts ein oranger Rückstrahler, links zwei weiße (wie in Deutschland). */
function delineator(buf, x, z, side) {
  boxInto(buf, x, 0.33, z, 0.06, 0.35, 0.06, COL.white);
  boxInto(buf, x, 0.805, z, 0.062, 0.125, 0.062, COL.black);
  boxInto(buf, x, 1.0, z, 0.06, 0.07, 0.06, COL.white);
  // Rückstrahler zur Fahrbahn hin (nach +z, dem Fahrer entgegen)
  if (side > 0) boxInto(buf, x, 0.81, z + 0.07, 0.025, 0.06, 0.012, COL.orange);
  else for (const dy of [-0.04, 0.04]) boxInto(buf, x, 0.81 + dy, z + 0.07, 0.022, 0.022, 0.012, COL.white);
}
