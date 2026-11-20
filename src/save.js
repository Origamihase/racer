// Spielstand im Browser (localStorage). Alles in try/catch, falls Speicher gesperrt ist.
const KEY = 'mini-adam-tesla-navi-v1';

export const DEFAULT_SAVE = {
  wallet: 0,
  upgrades: {},
  best: { distance: 0, earned: 0, viewers: 0, reise: 0 }, // reise: Rekord der XXL-Welt in Reisemetern
  // (ältere Spielstände tragen noch stats.leftLaneEuro mit sich – das wird einfach nicht mehr benutzt)
  stats: { runs: 0, totalKm: 0, naviReached: 0, crashes: 0, reiseKm: 0 },
  settings: { sound: true, speech: true, chat: true, facecam: true, quality: 'auto', volume: 0.8 },
  seenIntro: false,
  // besuchte Orte der großen Karte: Wiki-Name → Zahl der Besuche
  visits: {},
  // der auf dem Titelbildschirm gewählte Modus ('klassik' | 'xxl', siehe src/mode.js); null: noch nie gewählt
  mode: null,
  // das gekaufte Megafon ist erstattet (refundMegafon): so viele Euro, einmal; 0: nichts erstattet
  megafonRefund: 0,
};

/** Ein gespeicherter Teil-Spielstand (best, stats, …) – oder nichts, wenn dort etwas anderes steht als ein Objekt. */
const part = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});

export function loadSave() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULT_SAVE);
    // Ältere Spielstände kennen manche Felder noch nicht (visits, best.reise, mode): Sie bekommen den Standard. Felder,
    // die dieser Stand nicht kennt (ein neuerer hat sie geschrieben), bleiben erhalten und werden wieder mitgespeichert.
    const data = part(JSON.parse(raw));
    return {
      ...structuredClone(DEFAULT_SAVE),
      ...data,
      // (das Guthaben wird addiert: Steht dort keine Zahl, begänne die Kasse lieber bei null als bei „12,5“ + 3)
      wallet: Number.isFinite(data.wallet) ? data.wallet : DEFAULT_SAVE.wallet,
      best: { ...DEFAULT_SAVE.best, ...part(data.best) },
      stats: { ...DEFAULT_SAVE.stats, ...part(data.stats) },
      settings: { ...DEFAULT_SAVE.settings, ...part(data.settings) },
      upgrades: { ...part(data.upgrades) },
      visits: { ...part(data.visits) },
    };
  } catch (e) {
    return structuredClone(DEFAULT_SAVE);
  }
}

// Das Megafon gehört zur Ausstattung und ist kein Shop-Artikel mehr. Wer es gekauft hat, bekommt den Preis einmal
// zurück; der Artikel verschwindet aus den Upgrades, und megafonRefund merkt sich die Erstattung.
export const MEGAFON_PRICE = 450;

/** Das gekaufte Megafon einmal erstatten (beim Laden): Ergebnis der erstattete Betrag, sonst 0. */
export function refundMegafon(save) {
  if (save.megafonRefund || !save.upgrades.megafon) return 0;
  delete save.upgrades.megafon;
  save.wallet = Math.round((save.wallet + MEGAFON_PRICE) * 100) / 100;
  save.megafonRefund = MEGAFON_PRICE;
  return MEGAFON_PRICE;
}

export function storeSave(save) {
  try {
    localStorage.setItem(KEY, JSON.stringify(save));
    return true;
  } catch (e) {
    return false;
  }
}

export function resetSave() {
  try {
    localStorage.removeItem(KEY);
  } catch (e) {
    /* egal */
  }
  return structuredClone(DEFAULT_SAVE);
}
