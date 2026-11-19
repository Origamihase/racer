// Spielstand im Browser (localStorage). Alles in try/catch, falls Speicher gesperrt ist.
const KEY = 'mini-adam-tesla-navi-v1';

export const DEFAULT_SAVE = {
  wallet: 0,
  upgrades: {},
  best: { distance: 0, earned: 0, viewers: 0 },
  stats: { runs: 0, totalKm: 0, naviReached: 0, crashes: 0, leftLaneEuro: 0 },
  settings: { sound: true, speech: true, chat: true, quality: 'auto', volume: 0.8 },
  seenIntro: false,
  // besuchte Orte der großen Karte: Wiki-Name → Zahl der Besuche
  visits: {},
};

export function loadSave() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULT_SAVE);
    const data = JSON.parse(raw);
    return {
      ...structuredClone(DEFAULT_SAVE),
      ...data,
      best: { ...DEFAULT_SAVE.best, ...(data.best || {}) },
      stats: { ...DEFAULT_SAVE.stats, ...(data.stats || {}) },
      settings: { ...DEFAULT_SAVE.settings, ...(data.settings || {}) },
      upgrades: { ...(data.upgrades || {}) },
      visits: { ...(data.visits || {}) },
    };
  } catch (e) {
    return structuredClone(DEFAULT_SAVE);
  }
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
