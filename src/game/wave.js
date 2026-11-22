// Wann Mini Adam winkt (Besitzer, 21.11.2026: „Mini Adam winkt zu viel. Soll nur Menschen in der Stadt am Gehsteig,
// im Intro, wenn der Chat es will und nach einem Unfall winken.“ – und am 22.11.: „Mini Adam winkt weiterhin viel zu
// oft“) – genau vier Anlässe, und jeder ist selten (in einem gewöhnlichen Stream höchstens etwa zwei Grüße in zehn
// Minuten, das Intro nicht gezählt; tools/winken-sim.mjs zählt nach):
//   intro    – zu seinem „Partypeople!“ nach „Wir sind live.“ (main.js streamStart): in der Startszene am Supercharger
//              aus dem Fenster (charge.js SCENE.wave), sonst (übersprungen, ohne Ladepark) beim Losfahren in die
//              Facecam; einmal je Stream
//   gehsteig – einem Menschen auf dem Gehweg seiner Seite (links, wo sein Fenster ist), der nah am Bordstein steht und
//              zur Straße schaut (pedestrianAhead), nur im Schritttempo (WAVE.slow), höchstens einmal je
//              Ortsdurchfahrt und frühestens WAVE.cool Sekunden nach dem letzten Gruß
//   chat     – ein Zuschauer schreibt „Wink mal!“ (data.js CHAT.winkMal, alle WAVE.chat Sekunden),
//              WAVE.chatDelay Sekunden später winkt er
//   unfall   – nach einem Rempler ein kleiner, verlegener Gruß (Stärke WAVE.small), höchstens alle WAVE.crashCool s
// Sonst geht der Arm in der Fahrt nie hoch: Bei Spenden lächelt und nickt er und schaut aufs Handy, am Ziel hüpft er
// vor Freude mit beiden Händen am Lenkrad (main.js adamMood). Nicht im Titel, nicht am Ladestopp (dort stößt er im
// Stand mit dem Bananensaft an), nicht im Abspann. Die Facecam zeigt dieselbe Figur wie das Bild (main.js adamDo),
// sie winkt also immer mit.
import { STREET } from '../world/kit/layout.js';

export const WAVE = {
  why: ['intro', 'gehsteig', 'chat', 'unfall'],
  // Fußgänger: frühestens so viele Sekunden nach dem letzten Gruß (gleich aus welchem Anlass), einmal je Durchfahrt
  cool: 90,
  // … wenn einer so weit vor dem Wagen am Gehweg steht (m): nah genug, dass man ihn sieht, weit genug, dass die Hand
  // oben ist (0,55 s), wenn der Wagen an ihm vorbeifährt
  near: [6, 30],
  // … auf dieser Seite (−1: links, die Seite des Fahrers und seines Fensters; +1 wäre rechts) …
  side: -1,
  // … höchstens so weit hinter der Bordsteinkante (m; der Gehweg beginnt nach dem 2,2-m-Streifen) …
  kerb: 3.6,
  // … mit dem Gesicht zur Straße (Kosinus zwischen Blick und Richtung zur Fahrbahn) …
  face: 0.7,
  // … und der Wagen rollt im Schritttempo (m/s): wer fährt, hat beide Hände am Lenkrad
  slow: 30 / 3.6,
  // Abstand zwischen zwei „Wink mal!“ im Chat (s; ohne Zufall, chatGap) und wann danach die Hand hochgeht
  chat: [360, 600],
  chatDelay: 1.4,
  // Stärke des verlegenen Grußes nach einem Rempler (1 = ganz hoch neben den Kopf, die Hand pendelt kräftig)
  small: 0.8,
  // so lange nach dem Rempler (s): erst der Schreck, dann der Gruß – und höchstens einer in so vielen Sekunden
  afterCrash: 1.2,
  crashCool: 60,
};

/**
 * Wann der n-te Wunsch „Wink mal!“ nach dem vorigen kommt (s): gleichmäßig verteilt in WAVE.chat, ohne Zufall – der
 * Gruß nimmt dem Spiel keine Zufallszahl weg (alles andere im Stream bleibt, wie es ohne ihn wäre).
 */
export const chatGap = (n) => WAVE.chat[0] + (WAVE.chat[1] - WAVE.chat[0]) * ((n * 0.618034 + 0.31) % 1);

/** Menschen aus dem Stadtbaukasten (people.js KINDS) heißen Art_Haltung, z. B. frau_walk, kind_wave, oma_sit. */
const PERSON = /^(mann|frau2?|opa|oma|kind|radler|gassi|markt|musik|polizei|fan2?)_/;

/**
 * Steht auf dem Gehweg eines Orts jemand gleich vor dem Wagen, dem er winken würde? items: der Lageplan des Orts
 * (layout.js planTown: x quer wie die Straße, z = −(s − s0), ry: Blickrichtung), u: Ort des Wagens im Ort (s − s0).
 * Gehweg: zwischen Bordstein und Häuserflucht (STREET.curbR … curbR + pave rechts, curbL − pave … curbL links), nicht
 * der Platz, nicht der Brunnen; nur auf der Seite WAVE.side, höchstens WAVE.kerb hinter der Bordsteinkante und mit
 * dem Gesicht zur Straße (wer den Gehweg entlanggeht, schaut nicht her).
 * Ergebnis: der nächste solche Mensch { name, x, z, side: +1 rechts, −1 links } oder null.
 */
export function pedestrianAhead(items, u, near = WAVE.near) {
  let best = null;
  let bd = Infinity;
  const R0 = STREET.curbR;
  const R1 = STREET.curbR + STREET.pave;
  const L0 = STREET.curbL - STREET.pave;
  const L1 = STREET.curbL;
  for (const it of items) {
    if (!PERSON.test(it.name)) continue;
    const d = -it.z - u;
    if (d < near[0] || d > near[1] || d >= bd) continue;
    const side = it.x >= R0 - 0.3 && it.x <= R1 + 0.3 ? 1 : it.x >= L0 - 0.3 && it.x <= L1 + 0.3 ? -1 : 0;
    if (side !== WAVE.side) continue;
    // Abstand zur Bordsteinkante und Blick zur Fahrbahn (Blickrichtung (sin ry, cos ry); die Straße liegt bei −side)
    if ((side > 0 ? it.x - R0 : L1 - it.x) > WAVE.kerb || -side * Math.sin(it.ry || 0) < WAVE.face) continue;
    bd = d;
    best = { name: it.name, x: it.x, z: it.z, side };
  }
  return best;
}

/**
 * Anlass „gehsteig“: Wem winkt er jetzt zu? rule: die WaveRule des Spiels, t: Spielzeit, v: Tempo (m/s), items und u
 * wie bei pedestrianAhead, passage: die Ortsdurchfahrt (main.js: der Abschnitt der Fahrt). Ergebnis: der Mensch (dann
 * winken: rule.ask('gehsteig', t, passage)) oder null – zu schnell, in dieser Durchfahrt schon gewinkt, zu kurz nach
 * dem letzten Gruß oder niemand, dem er winken würde.
 */
export function walkerToWave(rule, t, v, items, u, passage = null) {
  if (v > WAVE.slow || !rule.may('gehsteig', t, passage)) return null;
  return pedestrianAhead(items, u);
}

/** Die Regel: merkt sich, wann er zuletzt gewinkt hat, und sagt zu jedem Anlass, ob (und wie stark) er jetzt winkt. */
export class WaveRule {
  constructor() {
    this.reset();
  }

  /** Neuer Stream: noch kein Gruß, das Intro steht noch aus. */
  reset() {
    this.last = -Infinity;
    this.lastCrash = -Infinity;
    this.passage = null;
    this.intro = false;
    this.count = { intro: 0, gehsteig: 0, chat: 0, unfall: 0 };
  }

  /**
   * Dürfte er aus diesem Anlass jetzt (Spielzeit t) winken? passage: die Ortsdurchfahrt (nur 'gehsteig': dort winkt
   * er einmal). Fragt nur, merkt sich nichts.
   */
  may(why, t, passage = null) {
    if (!WAVE.why.includes(why)) return false;
    if (why === 'intro') return !this.intro;
    if (why === 'gehsteig') return t - this.last >= WAVE.cool && (passage === null || passage !== this.passage);
    if (why === 'unfall') return t - this.lastCrash >= WAVE.crashCool;
    return true;
  }

  /** Winkt er jetzt? Stärke 0 … 1 (0: nein); ein Ja ist vermerkt. Andere Anlässe als WAVE.why gibt es nicht. */
  ask(why, t, passage = null) {
    if (!this.may(why, t, passage)) return 0;
    if (why === 'intro') this.intro = true;
    if (why === 'gehsteig') this.passage = passage;
    if (why === 'unfall') this.lastCrash = t;
    this.last = t;
    this.count[why]++;
    return why === 'unfall' ? WAVE.small : 1;
  }
}
