// BrunnenTV am Navi-Ziel der Reise: Der Wagen steht neben dem Brunnen (plan.js SIDE_VIEW), das Fahrerfenster geht
// herunter, Mini Adam nimmt das Megafon und spricht durchs offene Fenster zum Brunnen, drei Kameras zeigen Wagen,
// Fenster und Brunnen, der Chat jubelt, OMI sagt etwas dazu – dann geht das Fenster wieder hoch, und die Fahrt geht
// weiter. Hier steht der Fahrplan der Folge (Sekunden ab dem Halt) mit allem, was sich daraus ohne Grafik rechnen
// lässt: Das Spiel (Game.startBrunnenTV) führt die Zeit, die Sätze, den Chat und OMI, main.js zeigt Fenster,
// Megafon und Kameras. Überspringen lässt sie sich nicht (Besitzer, 21.11.2026: „BrunnenTV soll sich nicht skippen
// lassen.“) – weder am Ziel noch unterwegs: keine Taste, kein Tipp aufs Bild, kein Knopf am Gamepad; sie dauert end
// Sekunden und endet immer gleich: Fenster zu, Megafon zurück auf dem Beifahrersitz, der Wagen darf weiter.

import { STILL_LOW } from '../kit/layout.js';

/**
 * card: Bauchbinde „BrunnenTV · Folge N“ und Jingle · line: Mini Adam grüßt durchs Megafon · chat: der Chat jubelt ·
 * call: Mini Adams Ruf „Schöner Brunnen!“ – in jeder Folge, in der Einstellung „Brunnen“, solange das Megafon oben
 * ist · nomi: OMI sagt etwas zum Brunnen · end: die Folge ist vorbei (der Wagen darf weiter; das erste Gebot der
 * nächsten Runde kommt frühestens pause Sekunden später; 12 s, seit sie sich nicht mehr überspringen lässt: die
 * Einstellung „Brunnen“ bleibt nach dem Ruf länger stehen).
 * window: Fenster herunter [von, bis] und wieder hoch · lift: Megafon an den Mund und wieder hinunter (ab show ist es
 * in der Hand zu sehen, darunter liegt die Hand unter der Gürtellinie) · look: Kopf zum Fenster · cams: Schnitte auf
 * die Kameras „Fenster“ und „Brunnen“ · back: zurück zur Kamera des Spielers · fade: Abblenden, wo die Kamera ins
 * Cockpit springt.
 */
export const TV = {
  card: 1.0, line: 2.3, chat: 2.6, call: 6.0, nomi: 10.0, end: 12.0, pause: 1.5,
  window: { down: [0.4, 1.4], up: [10.6, 11.6] },
  lift: { up: [1.2, 2.0], down: [10.2, 10.8], show: 0.4 },
  look: { on: [1.0, 1.6], off: [10.2, 11.0] },
  cams: { fenster: 2.2, brunnen: 5.6, mitte: 8.4 },
  back: [11.2, 12.0],
  fade: 0.25,
};

/** Größter senkrechter Blickwinkel des Spiels (main.js setFov) und die Breite, für die die Einstellungen gebaut sind. */
const VFOV_MAX = 78;
const HFOV = 86;

export function smooth(a, b, x) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/** Wie weit das Fahrerfenster zur Zeit t der Folge offen ist (0 zu … 1 ganz unten). */
export function windowAt(t) {
  return smooth(TV.window.down[0], TV.window.down[1], t) * (1 - smooth(TV.window.up[0], TV.window.up[1], t));
}

/** Wie weit das Megafon zur Zeit t gehoben ist (0 Hand am Lenkrad … 1 am Mund). */
export function megaphoneAt(t) {
  return smooth(TV.lift.up[0], TV.lift.up[1], t) * (1 - smooth(TV.lift.down[0], TV.lift.down[1], t));
}

/** Kopf zum Fenster (0 … 1) zur Zeit t. */
export function lookAt(t) {
  return smooth(TV.look.on[0], TV.look.on[1], t) * (1 - smooth(TV.look.off[0], TV.look.off[1], t));
}

/**
 * Welche Kamera zur Zeit t das Bild hat: der Name einer Einstellung oder 'zurueck' (zur Kamera des Spielers). Ohne S
 * die klassische Folge ('totale', 'fenster', 'brunnen'); mit S (tvShots) die Einstellungen dieser Folge (S.seq).
 */
export function shotAt(t, S = null) {
  if (S && S.seq) {
    if (t >= TV.back[0]) return 'zurueck';
    for (const [, t1, name] of S.seq) if (t < t1) return name;
    return S.seq[S.seq.length - 1][2];
  }
  if (t < TV.cams.fenster) return 'totale';
  if (t < TV.cams.brunnen) return 'fenster';
  return t < TV.back[0] ? 'brunnen' : 'zurueck';
}

/**
 * Kamerafahrten (der Besitzer am 27.11.2026 zum Vorschlag „Neue Kamerafahrten“: „1 und 3 klingen toll“): Statt immer
 * Totale, Fenster, Brunnen wählt jede Folge für jeden ihrer vier Abschnitte eine Einstellung aus einem Vorrat.
 * a: Eröffnung bis zum Gruß (Wagen und Brunnen) · b: der Gruß durchs Fenster · c: der Ruf „Schöner Brunnen!“ (Wagen
 * und Brunnen) · d: OMIs Satz (der Brunnen). Steht in c und d dieselbe Einstellung, ist es eine lange Fahrt wie früher.
 * sees: was die Einstellung im Bild haben muss ('beide': Fenster und Brunnen; 'fenster'; 'brunnen'), so prüft es
 * tools/brunnen-test.mjs an jedem Ort.
 */
export const SLOTS = { a: [0, TV.cams.fenster], b: [TV.cams.fenster, TV.cams.brunnen], c: [TV.cams.brunnen, TV.cams.mitte], d: [TV.cams.mitte, TV.back[0]] };
export const POOL = { a: ['totale', 'kran', 'gegen'], b: ['fenster', 'profil'], c: ['brunnen', 'kreis'], d: ['brunnen', 'frosch', 'figur', 'taube'] };
/** Die klassische Folge (so sah jede bis zum 27.11. aus; auch die erste Folge jedes Spielstands). */
export const CLASSIC = { a: 'totale', b: 'fenster', c: 'brunnen', d: 'brunnen' };
/** Brunnenarten mit nur einer Schauseite (hinten eine schlichte Wand). */
export const ONE_SIDED = new Set(['fountainLion', 'fountainCascade']);

function hash32(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Die Einstellungen der Folge n am Ort key: die erste Folge klassisch, danach aus dem Vorrat gezogen – fest für Folge
 * und Ort, aber zwei Folgen hintereinander teilen sich höchstens zwei Abschnitte (prev: der Plan der Folge davor).
 */
export function tvPlan(n, key = '', prev = null) {
  if (!(n > 1)) return { ...CLASSIC };
  const base = hash32(`${key}#${n}`);
  for (let k = 0; k < 8; k++) {
    let h = hash32(`${base}:${k}`);
    const plan = {};
    for (const slot of ['a', 'b', 'c', 'd']) {
      const list = POOL[slot];
      plan[slot] = list[h % list.length];
      h = Math.floor(h / list.length) ^ hash32(slot + h);
      h >>>= 0;
    }
    const same = prev ? ['a', 'b', 'c', 'd'].filter((x) => plan[x] === prev[x]).length : 0;
    // nicht genau die klassische Folge (die bekommt nur die erste) und nicht fast die von eben
    const classic = ['a', 'b', 'c', 'd'].every((x) => plan[x] === CLASSIC[x]);
    if (!classic && same <= 2) return plan;
  }
  return { a: 'kran', b: 'profil', c: 'kreis', d: 'frosch' };
}

// Fahrerfenster und Mund von Mini Adam im Rahmen des Wagens (x rechts, y oben, vorn −z; models/tesla.js, Adam sitzt
// bei x −0,3 und dreht den Kopf zum Fenster)
const WINDOW = [-0.86, 1.12, 0.05];
const MOUTH = [-0.39, 1.0, 0.18];

/**
 * Die Kameras der Folge im Rahmen des haltenden Wagens: f = Mitte des Brunnens am Boden ({x, z}, links vor dem Wagen),
 * r = Radius seiner Insel, fi = Maße des Brunnens ({ r, h } seines Bausteins; ohne sie aus der Insel geschätzt), plan =
 * welche Einstellung in welchem Abschnitt läuft (tvPlan; ohne ihn die klassische Folge). Jede Kamera fährt in ihrer Zeit
 * langsam von a nach b (oder auf einem Bogen um den Brunnen, orbit) und schaut dabei auf look:
 * „Totale“ schräg von hinten links über die Flanke mit dem Fenster zum Brunnen, „Fenster“ von der Brunnenseite nah
 * ans offene Fenster (Megafon und Gesicht), „Brunnen“ von vorn links aus der Höhe auf Brunnen und Wagen zusammen.
 * Dazu die Fahrten der neuen Folgen: „Kran“ senkt sich von hoch hinter dem Wagen, „Gegenüber“ schaut von jenseits des
 * Brunnens über ihn zum Wagen, „Profil“ schaut quer durchs offene Fenster auf Mini Adam mit dem Megafon,
 * „Kreis“ fährt hinter dem Brunnen im Bogen um ihn (der Wagen jenseits), „Frosch“ schaut vom Pflaster am Becken zur
 * Figur hinauf, „Figur“ fährt nah an die Spitze, „Taube“ schaut von hoch oben auf Brunnen und Wagen.
 * dolly: wie weit sie in schmalen Bildern höchstens zurückfahren darf (dollyFor). Die Kameras stehen über Fahrbahn,
 * Platz und Insel, nie im Wagen oder im Brunnen, auch zurückgefahren, und sehen, was sie zeigen (sees; tools/brunnen-
 * test.mjs prüft das an jedem Ort mit jeder Einstellung). Ergebnis: die Einstellungen nach Namen und seq (die
 * Abschnitte der Folge der Reihe nach: [von, bis, Name]).
 */
export function tvShots(f, r, fi = null, plan = CLASSIC) {
  const P = { ...CLASSIC, ...(plan || {}) };
  // Totale: auf einen Punkt zwischen Fenster und Brunnen, näher am Fenster (der Wagen steht groß rechts im Bild)
  const totale = [-2.6 - 0.12 * r, 2.3 + 0.05 * r, 5.6 + 0.25 * r];
  const tLook = [WINDOW[0] + (f.x - WINDOW[0]) * 0.4, 0.95 + 0.03 * r, WINDOW[2] + (f.z - WINDOW[2]) * 0.4];
  // Fenster: 0,1 m höher als zuerst gebaut, damit die Leiste unter dem Fenster den Trichter weiter unten quert. Ganz
  // darunter läuft sie aus keiner Kamerahöhe: Sie liegt nur gut 10 cm vor dem Trichter, dessen Rand unter ihre Höhe
  // reicht; frei wäre er erst bei knapp 2 m, und schon ab 1,4 m schiebt sich die A-Säule vor Mini Adams Auge.
  const fenster = [MOUTH[0] - 1.3, MOUTH[1] + 0.3, MOUTH[2] - 1.0];
  const brunnen = [f.x * 0.4 - 0.6, 3.6 + 0.25 * r, f.z - 7.5 - 0.6 * r];
  // Maße des Brunnens und sein eigener Rahmen (+z: seine Vorderseite, zum Wagen) wie beim Standbild (stillShot)
  const fr = fi && fi.r > 0 ? fi.r : Math.max(1.5, r - 0.8);
  const h = Math.min(4.6, fi && fi.h > 0 ? fi.h : 2.5);
  const d = Math.hypot(f.x, f.z) || 1;
  const sn = -f.x / d;
  const cs = -f.z / d;
  const at = (x, y, z) => [f.x + x * cs + z * sn, y, f.z - x * sn + z * cs];
  const T = (slot) => SLOTS[slot];
  // über die großen Prachtbrunnen (und den Endgegner) hinweg sieht „Gegenüber“ das Fenster nicht: dort der Kran
  if (P.a === 'gegen' && fr > 6) P.a = 'kran';
  // Brunnen mit nur einer Schauseite (Löwenwand, Wassertreppe): „Kreis“ sähe hinter ihnen nur die Rückwand
  if (P.c === 'kreis' && fi && fi.oneSided) P.c = 'brunnen';
  const all = {
    totale: { a: totale, b: [totale[0] + 0.35, totale[1] - 0.12, totale[2] - 0.8], look: tLook, fov: 50, dolly: 1.8, sees: 'beide' },
    fenster: { a: fenster, b: [fenster[0] + 0.22, fenster[1] + 0.02, fenster[2] + 0.18], look: [MOUTH[0] - 0.28, MOUTH[1] + 0.02, MOUTH[2] - 0.08], fov: 44, dolly: 1, sees: 'fenster' },
    brunnen: { a: brunnen, b: [brunnen[0] - 0.9, brunnen[1] + 0.3, brunnen[2] + 0.4], look: [f.x * 0.55 + 0.1, 1.0 + 0.06 * r, f.z * 0.5 + 0.3], fov: 46, dolly: 1.8, sees: 'beide' },
  };
  const need = new Set(Object.values(P));
  if (need.has('kran')) {
    const a = [-2.3 - 0.1 * r, 6.2 + 0.2 * r, 8.6 + 0.3 * r];
    all.kran = { a, b: [a[0] + 0.3, a[1] - 1.9, a[2] - 1.6], look: tLook, fov: 50, dolly: 1.6, sees: 'beide' };
  }
  if (need.has('gegen')) {
    // jenseits des Brunnens, seitlich versetzt (die Säule steht nicht zwischen Kamera und Fenster), über seiner Spitze
    const D = fr + 3.2;
    const y = Math.max(3.6, h + 2.4);
    const look = [WINDOW[0] + (f.x - WINDOW[0]) * 0.58, 1.0, WINDOW[2] + (f.z - WINDOW[2]) * 0.58];
    all.gegen = { a: at(Math.sin(1.4) * D, y, -Math.cos(1.4) * D), b: at(Math.sin(1.2) * (D - 0.5), y - 0.3, -Math.cos(1.2) * (D - 0.5)), look, fov: 50, dolly: 2, sees: 'beide' };
  }
  if (need.has('profil')) {
    // quer vor dem offenen Fenster auf Augenhöhe: Mini Adam dreht sich mit dem Megafon zum Brunnen und damit fast zur
    // Kamera; sie gleitet langsam etwas nach vorn, der Blick bleibt auf seinem Mund
    const a = [-2.45, 1.4, 0.55];
    all.profil = { a, b: [a[0] + 0.25, a[1] + 0.02, a[2] - 0.45], look: [MOUTH[0] - 0.12, MOUTH[1] + 0.03, MOUTH[2] - 0.02], fov: 40, dolly: 1, sees: 'fenster' };
  }
  if (need.has('kreis')) {
    // im Bogen hinter dem Brunnen: von schräg hinten links nach schräg hinten rechts, der Wagen jenseits des Beckens
    const D = fr + 2.6;
    all.kreis = { orbit: { a0: 2.35, a1: 1.55, D, y: Math.max(2.2, 0.55 * h + 1.4), c: [f.x, f.z] }, look: at(0, 0.5 * h, 0.15 * d), fov: 50, dolly: 1.4, sees: 'brunnen' };
  }
  if (need.has('frosch')) {
    // tief neben dem Becken (wo der Garten der Insel frei ist, STILL_LOW), zur Figur hinauf
    const D = fr + STILL_LOW.d;
    all.frosch = { a: at(Math.sin(STILL_LOW.a) * D, STILL_LOW.y + 0.1, Math.cos(STILL_LOW.a) * D), b: at(Math.sin(STILL_LOW.a - 0.12) * D, STILL_LOW.y + 0.35, Math.cos(STILL_LOW.a - 0.12) * D), look: at(0, 0.72 * h, 0), fov: 62, dolly: 1, sees: 'brunnen' };
  }
  if (need.has('figur')) {
    // nah an die Spitze: von vorn rechts, etwas über ihr, langsam heran
    const D = fr + 1.4;
    const y = 0.8 * h + 0.9;
    all.figur = { a: at(Math.sin(-0.45) * D, y, Math.cos(-0.45) * D), b: at(Math.sin(-0.3) * (D - 0.6), y - 0.15, Math.cos(-0.3) * (D - 0.6)), look: at(0, 0.82 * h, 0), fov: 44, dolly: 1, sees: 'brunnen' };
  }
  if (need.has('taube')) {
    // von hoch oben neben dem Becken, steil hinab auf Becken und Figur (der Wagen am Rand des Bilds)
    const y = h + 7.5;
    const D = fr + 2.2;
    all.taube = { a: at(D, y, -0.6), b: at(D - 0.4, y - 1.2, 0), look: at(0, 0.3, 0.78), fov: 55, dolly: 1.8, sees: 'brunnen' };
  }
  // die Abschnitte: gleiche Einstellung in c und d wird eine lange Fahrt
  const seq = [];
  for (const slot of ['a', 'b', 'c', 'd']) {
    const name = P[slot];
    const last = seq[seq.length - 1];
    if (last && last[2] === name) last[1] = T(slot)[1];
    else seq.push([T(slot)[0], T(slot)[1], name]);
  }
  const out = { seq, plan: P };
  for (const [name, s] of Object.entries(all)) out[name] = { ...s, t: [...(seq.find((q) => q[2] === name) ?? [0, 1]).slice(0, 2)] };
  // die klassischen drei behalten ihre Zeiten der klassischen Folge, wenn sie in dieser Folge nicht laufen (Standbild)
  if (!seq.some((q) => q[2] === 'totale')) out.totale.t = [0, TV.cams.fenster];
  if (!seq.some((q) => q[2] === 'fenster')) out.fenster.t = [TV.cams.fenster, TV.cams.brunnen];
  if (!seq.some((q) => q[2] === 'brunnen')) out.brunnen.t = [TV.cams.brunnen, TV.back[0]];
  return out;
}

/**
 * Hochkant (und in schmalen Fenstern) zeigt das Bild weniger Breite als die gut 86° quer, für die die Kameras gebaut
 * sind: Dann fährt jede so weit von ihrem Blickpunkt zurück, dass Wagen und Brunnen trotzdem hineinpassen – höchstens
 * um ihr dolly. aspect: Breite durch Höhe. Ergebnis: Faktor für den Abstand zum Blickpunkt (1 = wie gebaut).
 */
export function dollyFor(aspect, max) {
  const half = Math.atan(Math.tan((VFOV_MAX * Math.PI) / 360) * aspect);
  return Math.min(max, Math.max(1, Math.tan((HFOV * Math.PI) / 360) / Math.tan(half)));
}

/**
 * Lage der Kamera einer Einstellung s zur Zeit t: pos und look (Arrays im Rahmen des Wagens, out wird gefüllt);
 * dolly (dollyFor): so viel weiter steht sie von ihrem Blickpunkt weg.
 */
export function shotPose(s, t, out = { pos: [0, 0, 0], look: [0, 0, 0] }, dolly = 1) {
  const k = smooth(s.t[0], s.t[1], t);
  if (s.orbit) {
    // Bogen um den Brunnen: Winkel von a0 nach a1 um look (im Rahmen des Brunnens wie tvShots at: 0 = zum Wagen)
    const o = s.orbit;
    const a = o.a0 + (o.a1 - o.a0) * k;
    const c = s.look;
    // (um die Mitte des Brunnens o.c; die Kamera schaut auf look)
    const fx = o.c ? o.c[0] : c[0];
    const fz = o.c ? o.c[1] : c[2];
    const d = Math.hypot(fx, fz) || 1;
    const sn = -fx / d;
    const cs = -fz / d;
    const x = Math.sin(a) * o.D;
    const z = Math.cos(a) * o.D;
    const p = [fx + x * cs + z * sn, o.y, fz - x * sn + z * cs];
    for (let i = 0; i < 3; i++) {
      out.look[i] = c[i];
      out.pos[i] = c[i] + (p[i] - c[i]) * dolly;
    }
    return out;
  }
  for (let i = 0; i < 3; i++) {
    const p = s.a[i] + (s.b[i] - s.a[i]) * k;
    out.look[i] = s.look[i];
    out.pos[i] = s.look[i] + (p - s.look[i]) * dolly;
  }
  return out;
}

/**
 * Standbild einer Folge fürs Album und den Abspann (main.js takeAlbumShot, zur Sekunde t der Folge): reihum nach der
 * Nummer der Folge einer von vier Blickwinkeln, damit die Bilder nicht alle gleich aussehen – vorn (auf Augenhöhe
 * gerade vor dem Brunnen), dreiviertel (die Brunnen-Kamera der Folge: Brunnen, Wagen und Mini Adam am Fenster), tief
 * (neben dem Becken zur Figur hinauf) und vom Auto (hinter dem offenen Fenster über die Flanke zum Brunnen).
 */
export const STILL = { t: TV.cams.brunnen + 1, kinds: ['vorn', 'dreiviertel', 'tief', 'auto'] };

/** Blickwinkel des Standbilds der Folge n (1, 2, …): 'vorn', 'dreiviertel', 'tief' oder 'auto'. */
export function stillKind(n) {
  const k = STILL.kinds;
  return k[(((Math.round(n) - 1) % k.length) + k.length) % k.length];
}

/**
 * Kamera des Standbilds der Folge n im Rahmen des haltenden Wagens (wie tvShots): f = Mitte des Brunnens ({x, z}), r =
 * Radius seiner Insel, fi = Maße des Brunnens ({ r, h } seines Bausteins; ohne sie aus der Insel geschätzt). Ergebnis
 * { kind, pos, look, fov } mit fov senkrecht in Grad für ein Bild in 16:9. Die Kameras stehen außerhalb von Wagen und
 * Becken und sehen den Brunnen frei (tools/brunnen-test.mjs prüft das an allen Orten).
 */
export function stillShot(f, r, fi, n) {
  const kind = stillKind(n);
  const fr = fi && fi.r > 0 ? fi.r : Math.max(1.5, r - 0.8);
  // (beim hohen Endgegner zählt, was bis 4,6 m reicht: Becken und Figuren, nicht die Spitze)
  const h = Math.min(4.6, fi && fi.h > 0 ? fi.h : 2.5);
  const d = Math.hypot(f.x, f.z) || 1;
  // Koordinaten des Brunnens (+z: seine Vorderseite, zum Wagen) → Rahmen des Wagens
  const sn = -f.x / d;
  const cs = -f.z / d;
  const at = (x, y, z) => [f.x + x * cs + z * sn, y, f.z - x * sn + z * cs];
  if (kind === 'dreiviertel') {
    const s = tvShots(f, r).brunnen;
    const p = shotPose(s, STILL.t);
    return { kind, pos: p.pos, look: p.look, fov: s.fov };
  }
  if (kind === 'vorn') {
    // so weit vor dem Brunnen, dass er ganz ins Bild passt, aber nie näher als 2,4 m an der Mitte des Wagens
    const D = Math.max(fr + 0.9, Math.min(fr + 2.6, d - 2.4));
    const wide = Math.atan((fr * 1.2) / D / (16 / 9));
    const tall = Math.atan((0.6 * h) / D);
    const fov = Math.min(62, Math.max(34, (2 * Math.max(wide, tall) * 180) / Math.PI));
    return { kind, pos: at(0.35, 1.45, D), look: at(0, 0.42 * h, 0), fov };
  }
  if (kind === 'tief') {
    const D = fr + STILL_LOW.d;
    return { kind, pos: at(Math.sin(STILL_LOW.a) * D, STILL_LOW.y, Math.cos(STILL_LOW.a) * D), look: at(0, 0.7 * h, 0), fov: 62 };
  }
  // vom Auto: links hinter dem Wagen in Augenhöhe, an der Flanke entlang über das offene Fenster (Mini Adam mit dem
  // Megafon) zum Brunnen; die Kamera schaut zwischen beide und ist so weit, dass beide ins Bild passen
  const pos = [-1.55, 1.7, 2.75];
  const aw = Math.atan2(WINDOW[0] - pos[0], pos[2] - WINDOW[2]);
  const af = Math.atan2(f.x - pos[0], pos[2] - f.z);
  const a = (aw + af) / 2;
  const far = Math.hypot(f.x - pos[0], f.z - pos[2]) * 0.7;
  const half = Math.abs(aw - af) / 2 + (9 * Math.PI) / 180;
  const fov = Math.min(62, Math.max(40, (2 * Math.atan(Math.tan(half) / (16 / 9)) * 180) / Math.PI));
  return { kind, pos, look: [pos[0] + Math.sin(a) * far, 0.95 + 0.1 * h, pos[2] - Math.cos(a) * far], fov };
}
