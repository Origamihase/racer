// BrunnenTV am Navi-Ziel der Reise: Der Wagen steht neben dem Brunnen (plan.js SIDE_VIEW), das Fahrerfenster geht
// herunter, Mini Adam nimmt das Megafon und spricht durchs offene Fenster zum Brunnen, drei Kameras zeigen Wagen,
// Fenster und Brunnen, der Chat jubelt, NOMI sagt etwas dazu – dann geht das Fenster wieder hoch, und die Fahrt geht
// weiter. Hier steht der Fahrplan der Folge (Sekunden ab dem Halt) mit allem, was sich daraus ohne Grafik rechnen
// lässt: Das Spiel (Game.startBrunnenTV) führt die Zeit, die Sätze, den Chat und NOMI, main.js zeigt Fenster,
// Megafon und Kameras. Überspringen geht wie beim Ladestopp ab skip (jede Taste, kurz abblenden); dann endet die Folge
// so, wie sie sonst endet: Fenster zu, Megafon zurück auf dem Beifahrersitz, der Wagen darf weiter.

/**
 * card: Bauchbinde „BrunnenTV · Folge N“ und Jingle · line: Mini Adam durchs Megafon · chat: der Chat jubelt ·
 * nomi: NOMI sagt etwas zum Brunnen · end: die Folge ist vorbei (der Wagen darf weiter; das erste Gebot der nächsten
 * Runde kommt frühestens pause Sekunden später) · skip: ab hier lässt sie sich überspringen.
 * window: Fenster herunter [von, bis] und wieder hoch · lift: Megafon an den Mund und wieder hinunter (ab show ist es
 * in der Hand zu sehen, darunter liegt die Hand unter der Gürtellinie) · look: Kopf zum Fenster · cams: Schnitte auf
 * die Kameras „Fenster“ und „Brunnen“ · back: zurück zur Kamera des Spielers · fade: Abblenden, wo die Kamera ins
 * Cockpit springt.
 */
export const TV = {
  card: 1.0, line: 2.3, chat: 2.6, nomi: 5.9, end: 10.2, skip: 0.3, pause: 1.5,
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
  const fenster = [MOUTH[0] - 1.3, MOUTH[1] + 0.2, MOUTH[2] - 1.0];
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
