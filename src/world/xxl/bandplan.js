// Bauplan der Flüsse neben der Straße (map/riverside.js sectionShores), rein rechnerisch (auch unter Node): wo sie in
// der Welt liegen, für den Bau (riverbands.js), den Bewuchs und die Szenerie (nichts im Wasser, freie Sicht vom Wagen
// aufs Wasser) und die Nahansicht des Navis (map/roadahead.js zeigt dasselbe Wasser).
//
// Lage im Rahmen des Abschnitts (x seitlich wie die Straße, s Meter der Fahrt): das gerade Stück läuft bei x = xc von
// s0 bis s1, sein inneres Ufer (Oberkante der Böschung) liegt inner Meter hinter dem Asphalt. An beiden Enden biegt
// der Fluss im Viertelkreis (Halbmesser hb = half + bank, um die Ecke C bei x = xC = xc + sg·hb) rechtwinklig von der
// Straße weg und läuft als Arm bei s = s0 − hb bzw. s1 + hb bis in den Dunst (BRIDGE.reach). Im Querschnitt zählt D
// von der Mitte des Wassers zur Innenseite der Bögen (auf dem geraden Stück: weg von der Straße).
//
// Das Loch im Boden (ground.js) sind drei Rechtecke: das gerade Stück samt beiden Ecken (s0 − 2hb … s1 + 2hb, x
// zwischen xc ∓ hb) und die beiden Arme (ab xC nach außen). In den äußeren Ecken der Quadrate, die der Viertelkreis
// nicht erreicht, liegt eine Wiese auf Höhe des Bodens.
import { ROAD } from '../../textures.js';
import { ONCOMING } from '../road.js';
import { BRIDGE } from '../../map/crossings.js';
import { sectionShores } from '../../map/riverside.js';
import { VIS } from './roadkit.js';

/** Stützstellen der Arme nach außen (Meter ab xC): an ihnen endet das Wasser, wenn eine fremde Straße davor liegt. */
export const ARM_STATIONS = [0, 34, 70, 110, 160, 230, 320, 440, 600, 800, 1050, 1300, BRIDGE.reach];
/** Zwischen Ufer und Straße bleibt die Sicht frei: kein Baum näher als so viel hinter dem Asphalt (der Grünstreifen). */
export const OPEN_FROM = 4.5;

/** Asphaltränder des Abschnitts [links, rechts] (Rahmenkoordinaten). */
function edgesOf(sec) {
  if (sec.kind === 'ab') return [ONCOMING(ROAD.right), ROAD.right];
  return [VIS.land.aL, VIS.land.aR];
}

const cache = new WeakMap();
/**
 * Die Flüsse neben dem Abschnitt sec: [{ ...sectionShores, sg (Seite), s0, s1 (gerades Stück, Meter der Fahrt), xc,
 * xC, hb, road (Asphaltrand dieser Seite), c0, c1 (alles samt Armen längs der Straße), key }], nach Lage.
 */
export function bandsOf(sec) {
  let out = cache.get(sec);
  if (out) return out;
  out = [];
  const base = sec.orig || sec;
  const [aL, aR] = edgesOf(base);
  for (const q of sectionShores(base)) {
    const sg = q.side;
    const hb = q.half + q.bank;
    const road = sg > 0 ? aR : aL;
    const xc = road + sg * (q.inner + hb);
    const s0 = base.s0 + q.s0;
    const s1 = base.s0 + q.s1;
    out.push({
      ...q, sg, hb, road, xc, xC: xc + sg * hb, s0, s1, c0: s0 - 2 * hb, c1: s1 + 2 * hb, kind: base.kind,
      key: q.key + '@' + Math.round(s0),
    });
  }
  cache.set(sec, out);
  return out;
}

/**
 * Liegt der Punkt x, s (Rahmen des Abschnitts) mit Radius r im Wasser, in der Böschung oder zwischen Straße und Fluss
 * (freie Sicht) eines Bands aus list? Die Arme zählen bis BRIDGE.reach.
 */
export function inBand(list, x, s, r = 0) {
  for (let i = 0; i < list.length; i++) {
    const b = list[i];
    if (s < b.c0 - r || s > b.c1 + r) continue;
    // Abstand nach außen (weg von der Straße), gemessen vom Asphaltrand dieser Seite
    const o = b.sg * (x - b.road);
    const far = b.sg * (b.xc - b.road) + b.hb;
    // das gerade Stück samt Ecken und der freie Streifen davor
    if (o > OPEN_FROM - r && o < far + r) return true;
    // die Arme
    if (o >= far - r && o < far + BRIDGE.reach + r) {
      if (Math.abs(s - (b.s0 - b.hb)) < b.hb + r || Math.abs(s - (b.s1 + b.hb)) < b.hb + r) return true;
    }
  }
  return false;
}

/**
 * Mittellinie des Wassers als Stützpunkte {s, x, ns, nx (Richtung, in der D wächst), u (Meter längs)}, von außen am
 * Arm A über die Ecke A, das gerade Stück und die Ecke B bis außen am Arm B. reachA, reachB: so weit reichen die Arme
 * (Meter ab xC); step: Abstand auf dem geraden Stück; arc: Stützpunkte je Viertelkreis. parts: Anfang jedes Teils
 * (armA, core, armB) als Index.
 */
export function centreline(b, reachA = BRIDGE.reach, reachB = BRIDGE.reach, step = 10, arc = 12) {
  const pts = [];
  const { sg, hb, xc, xC, s0, s1 } = b;
  const push = (s, x, ns, nx) => {
    const p = pts[pts.length - 1];
    const u = p ? p.u + Math.hypot(s - p.s, x - p.x) : 0;
    pts.push({ s, x, ns, nx, u });
  };
  const stA = ARM_STATIONS.filter((v) => v < reachA).concat([reachA]);
  const stB = ARM_STATIONS.filter((v) => v < reachB).concat([reachB]);
  // Arm A von außen nach innen: D wächst nach +s
  for (let i = stA.length - 1; i >= 0; i--) push(s0 - hb, xC + sg * stA[i], 1, 0);
  const core = pts.length;
  // Ecke A um C_A = (s0, xC): v(θ) = hb·(−cos θ, −sg·sin θ), D zur Ecke hin
  for (let k = 1; k <= arc; k++) {
    const t = (k / arc) * (Math.PI / 2);
    const vs = -Math.cos(t);
    const vx = -sg * Math.sin(t);
    push(s0 + hb * vs, xC + hb * vx, -vs, -vx);
  }
  const n = Math.max(1, Math.ceil((s1 - s0) / step));
  for (let k = 1; k < n; k++) push(s0 + ((s1 - s0) * k) / n, xc, 0, sg);
  // Ecke B um C_B = (s1, xC): v(θ) = hb·(sin θ, −sg·cos θ)
  for (let k = 0; k < arc; k++) {
    const t = (k / arc) * (Math.PI / 2);
    const vs = Math.sin(t);
    const vx = -sg * Math.cos(t);
    push(s1 + hb * vs, xC + hb * vx, -vs, -vx);
  }
  const armB = pts.length;
  // Arm B nach außen: D wächst nach −s
  for (let i = 0; i < stB.length; i++) push(s1 + hb, xC + sg * stB[i], -1, 0);
  return { pts, parts: [0, core, armB] };
}
