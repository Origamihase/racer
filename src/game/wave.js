// Wann Mini Adam winkt (Besitzer, 21.11.2026: „Mini Adam winkt zu viel. Soll nur Menschen in der Stadt am Gehsteig,
// im Intro, wenn der Chat es will und nach einem Unfall winken.“) – genau vier Anlässe, sonst nie:
//   intro    – zu seinem „Partypeople!“ nach „Wir sind live.“ (main.js streamStart): in der Startszene am Supercharger
//              aus dem Fenster (charge.js SCENE.wave), sonst (übersprungen, ohne Ladepark) beim Losfahren in die Facecam
//   gehsteig – Fußgängern auf dem Gehweg eines Orts, an denen der Wagen gleich vorbeifährt (pedestrianAhead), nicht
//              schneller als WAVE.slow und höchstens alle WAVE.cool Sekunden
//   chat     – ein Zuschauer schreibt „Wink mal!“ (data.js CHAT.winkMal), WAVE.chatDelay Sekunden später winkt er
//   unfall   – nach einem Rempler ein kleiner, verlegener Gruß (Stärke WAVE.small: die Hand kommt nur halb hoch)
// Nicht im Titel, nicht am Ladestopp, nicht im Abspann, nicht zur Begrüßung bei jeder Fahrt, nicht bei Spenden (da
// jubelt er). Die Facecam zeigt dieselbe Figur wie das Bild (main.js adamDo), sie winkt also immer mit.
import { STREET } from '../world/kit/layout.js';

export const WAVE = {
  why: ['intro', 'gehsteig', 'chat', 'unfall'],
  // Fußgänger: höchstens ein Gruß in so vielen Sekunden (nach jedem Winken, gleich aus welchem Anlass)
  cool: 25,
  // … wenn einer so weit vor dem Wagen am Gehweg steht oder geht (m): nah genug, dass man ihn sieht, weit genug, dass
  // die Hand oben ist (0,55 s), wenn der Wagen an ihm vorbeifährt
  near: [6, 30],
  // … und der Wagen nicht schneller fährt (m/s): wer durch den Ort rast, hat beide Hände am Lenkrad
  slow: 65 / 3.6,
  // Abstand zwischen zwei „Wink mal!“ im Chat (s; ohne Zufall, chatGap) und wann danach die Hand hochgeht
  chat: [150, 270],
  chatDelay: 1.4,
  // Stärke des verlegenen Grußes nach einem Rempler (1 = ganz hoch neben den Kopf, die Hand pendelt kräftig)
  small: 0.8,
  // so lange nach dem Rempler (s): erst der Schreck, dann der Gruß
  afterCrash: 1.2,
};

/**
 * Wann der n-te Wunsch „Wink mal!“ nach dem vorigen kommt (s): gleichmäßig verteilt in WAVE.chat, ohne Zufall – der
 * Gruß nimmt dem Spiel keine Zufallszahl weg (alles andere im Stream bleibt, wie es ohne ihn wäre).
 */
export const chatGap = (n) => WAVE.chat[0] + (WAVE.chat[1] - WAVE.chat[0]) * ((n * 0.618034 + 0.31) % 1);

/** Menschen aus dem Stadtbaukasten (people.js KINDS) heißen Art_Haltung, z. B. frau_walk, kind_wave, oma_sit. */
const PERSON = /^(mann|frau2?|opa|oma|kind|radler|gassi|markt|musik|polizei|fan2?)_/;

/**
 * Steht oder geht auf dem Gehweg eines Orts jemand gleich vor dem Wagen? items: der Lageplan des Orts (layout.js
 * planTown: x quer wie die Straße, z = −(s − s0)), u: Ort des Wagens im Ort (s − s0). Gehweg: zwischen Bordstein und
 * Häuserflucht (STREET.curbR … curbR + pave rechts, curbL − pave … curbL links), nicht der Platz, nicht der Brunnen.
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
    if (!side) continue;
    bd = d;
    best = { name: it.name, x: it.x, z: it.z, side };
  }
  return best;
}

/**
 * Anlass „gehsteig“: Wem winkt er jetzt zu? rule: die WaveRule des Spiels, t: Spielzeit, v: Tempo (m/s), items und u
 * wie bei pedestrianAhead. Ergebnis: der Mensch (dann winken: rule.ask('gehsteig', t)) oder null – zu schnell, zu
 * kurz nach dem letzten Gruß oder niemand am Gehweg.
 */
export function walkerToWave(rule, t, v, items, u) {
  if (v > WAVE.slow || !rule.may('gehsteig', t)) return null;
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
    this.intro = false;
    this.count = { intro: 0, gehsteig: 0, chat: 0, unfall: 0 };
  }

  /** Dürfte er aus diesem Anlass jetzt (Spielzeit t) winken? Fragt nur, merkt sich nichts. */
  may(why, t) {
    if (!WAVE.why.includes(why)) return false;
    if (why === 'intro') return !this.intro;
    if (why === 'gehsteig') return t - this.last >= WAVE.cool;
    return true;
  }

  /** Winkt er jetzt? Stärke 0 … 1 (0: nein); ein Ja ist vermerkt. Andere Anlässe als WAVE.why gibt es nicht. */
  ask(why, t) {
    if (!this.may(why, t)) return 0;
    if (why === 'intro') this.intro = true;
    this.last = t;
    this.count[why]++;
    return why === 'unfall' ? WAVE.small : 1;
  }
}
