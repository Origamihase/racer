// BrunnenTV am Navi-Ziel der Reise: Der Wagen steht neben dem Brunnen (plan.js SIDE_VIEW), das Fahrerfenster geht
// herunter, Mini Adam nimmt das Megafon und spricht durchs offene Fenster zum Brunnen, drei Kameras zeigen Wagen,
// Fenster und Brunnen, der Chat jubelt, NOMI sagt etwas dazu – dann geht das Fenster wieder hoch, und die Fahrt geht
// weiter. Hier steht der Fahrplan der Folge (Sekunden ab dem Halt) mit allem, was sich daraus ohne Grafik rechnen
// lässt: Das Spiel (Game.startBrunnenTV) führt die Zeit, die Sätze, den Chat und NOMI, main.js zeigt Fenster,
// Megafon und Kameras. Überspringen geht wie beim Ladestopp ab skip (jede Taste, kurz abblenden); dann endet die Folge
// so, wie sie sonst endet: Fenster zu, Megafon zurück auf dem Beifahrersitz, der Wagen darf weiter.

import { STILL_LOW } from '../kit/layout.js';

/**
 * card: Bauchbinde „BrunnenTV · Folge N“ und Jingle · line: Mini Adam grüßt durchs Megafon · chat: der Chat jubelt ·
 * call: Mini Adams Ruf „Schöner Brunnen!“ – in jeder Folge, in der Einstellung „Brunnen“, solange das Megafon oben
 * ist · nomi: NOMI sagt etwas zum Brunnen · end: die Folge ist vorbei (der Wagen darf weiter; das erste Gebot der
 * nächsten Runde kommt frühestens pause Sekunden später) · skip: ab hier lässt sie sich überspringen.
 * window: Fenster herunter [von, bis] und wieder hoch · lift: Megafon an den Mund und wieder hinunter (ab show ist es
 * in der Hand zu sehen, darunter liegt die Hand unter der Gürtellinie) · look: Kopf zum Fenster · cams: Schnitte auf
 * die Kameras „Fenster“ und „Brunnen“ · back: zurück zur Kamera des Spielers · fade: Abblenden, wo die Kamera ins
 * Cockpit springt.
 */
export const TV = {
  card: 1.0, line: 2.3, chat: 2.6, call: 6.0, nomi: 8.2, end: 10.2, skip: 0.3, pause: 1.5,
  window: { down: [0.4, 1.4], up: [8.8, 9.8] },
  lift: { up: [1.2, 2.0], down: [8.4, 9.0], show: 0.4 },
  look: { on: [1.0, 1.6], off: [8.4, 9.2] },
  cams: { fenster: 2.2, brunnen: 5.6 },
  back: [9.4, 10.2],
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

/** Welche Kamera zur Zeit t das Bild hat: 'totale', 'fenster', 'brunnen' oder 'zurueck' (zur Kamera des Spielers). */
export function shotAt(t) {
  if (t < TV.cams.fenster) return 'totale';
  if (t < TV.cams.brunnen) return 'fenster';
  return t < TV.back[0] ? 'brunnen' : 'zurueck';
}

// Fahrerfenster und Mund von Mini Adam im Rahmen des Wagens (x rechts, y oben, vorn −z; models/tesla.js, Adam sitzt
// bei x −0,3 und dreht den Kopf zum Fenster)
const WINDOW = [-0.86, 1.12, 0.05];
const MOUTH = [-0.39, 1.0, 0.18];

/**
 * Die drei Kameras der Folge im Rahmen des haltenden Wagens: f = Mitte des Brunnens am Boden ({x, z}, links vor dem
 * Wagen), r = Radius seiner Insel. Jede Kamera fährt in ihrer Zeit langsam von a nach b und schaut dabei auf look:
 * „Totale“ schräg von hinten links über die Flanke mit dem Fenster zum Brunnen, „Fenster“ von der Brunnenseite nah
 * ans offene Fenster (Megafon und Gesicht), „Brunnen“ von vorn links aus der Höhe auf Brunnen und Wagen zusammen.
 * dolly: wie weit sie in schmalen Bildern höchstens zurückfahren darf (dollyFor; die nahe Kamera am Fenster zeigt auch
 * hochkant alles und bleibt, wo sie ist – zurückgefahren käme sie kleinen Brunnen zu nah). Die Kameras stehen über
 * Fahrbahn und Insel, nie im Wagen oder im Brunnen, auch zurückgefahren (tools/brunnen-test.mjs prüft das).
 */
export function tvShots(f, r) {
  // Totale: auf einen Punkt zwischen Fenster und Brunnen, näher am Fenster (der Wagen steht groß rechts im Bild)
  const totale = [-2.6 - 0.12 * r, 2.3 + 0.05 * r, 5.6 + 0.25 * r];
  const tLook = [WINDOW[0] + (f.x - WINDOW[0]) * 0.4, 0.95 + 0.03 * r, WINDOW[2] + (f.z - WINDOW[2]) * 0.4];
  // Fenster: 0,1 m höher als zuerst gebaut, damit die Leiste unter dem Fenster den Trichter weiter unten quert. Ganz
  // darunter läuft sie aus keiner Kamerahöhe: Sie liegt nur gut 10 cm vor dem Trichter, dessen Rand unter ihre Höhe
  // reicht; frei wäre er erst bei knapp 2 m, und schon ab 1,4 m schiebt sich die A-Säule vor Mini Adams Auge.
  const fenster = [MOUTH[0] - 1.3, MOUTH[1] + 0.3, MOUTH[2] - 1.0];
  const brunnen = [f.x * 0.4 - 0.6, 3.6 + 0.25 * r, f.z - 7.5 - 0.6 * r];
  return {
    totale: { t: [0, TV.cams.fenster], a: totale, b: [totale[0] + 0.35, totale[1] - 0.12, totale[2] - 0.8], look: tLook, fov: 50, dolly: 1.8 },
    fenster: { t: [TV.cams.fenster, TV.cams.brunnen], a: fenster, b: [fenster[0] + 0.22, fenster[1] + 0.02, fenster[2] + 0.18], look: [MOUTH[0] - 0.28, MOUTH[1] + 0.02, MOUTH[2] - 0.08], fov: 44, dolly: 1 },
    brunnen: { t: [TV.cams.brunnen, TV.back[0]], a: brunnen, b: [brunnen[0] - 0.9, brunnen[1] + 0.3, brunnen[2] + 0.4], look: [f.x * 0.55 + 0.1, 1.0 + 0.06 * r, f.z * 0.5 + 0.3], fov: 46, dolly: 1.8 },
  };
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
