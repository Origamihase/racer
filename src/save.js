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
  // so viele erstattete Euro sagt der Titel noch an, bis zum ersten Besuch im Shop (megafonNoteSeen); 0: nichts
  megafonNote: 0,
  // BrunnenTV-Album der Reise (src/game/album.js): n = Nummer der letzten Folge, list = die Folgen; die Bilder dazu
  // stehen unter eigenem Schlüssel (storePicture)
  album: { n: 0, list: [] },
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
      album: cleanAlbum(data.album),
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
  save.megafonNote = MEGAFON_PRICE;
  return MEGAFON_PRICE;
}

/** Erster Besuch im Shop: die Zeile zur Erstattung verschwindet vom Titel. Ergebnis die Euro, die sie nannte, sonst 0. */
export function megafonNoteSeen(save) {
  const euro = save.megafonNote || 0;
  save.megafonNote = 0;
  return euro;
}

// --- BrunnenTV-Album --------------------------------------------------------------------------------------------------
/** So viele Folgen behält das Album (rund 90 Zeichen je Folge); darüber gehen die ältesten, gezählt wird weiter. */
export const ALBUM_MAX = 1000;
/** Ein Eintrag, mit dem das Album etwas anfangen kann (alles andere fällt beim Laden heraus). */
const validEntry = (e) => !!e && typeof e === 'object' && Number.isInteger(e.n) && e.n > 0 && typeof e.p === 'string' && e.p.length > 0;

/**
 * Gespeichertes Album aufräumen: nur gültige Einträge, nach Folge geordnet, jede Folge einmal, höchstens ALBUM_MAX;
 * n ist mindestens die höchste Folge der Liste. Felder, die dieser Stand nicht kennt, bleiben erhalten.
 */
export function cleanAlbum(raw) {
  const a = part(raw);
  const seen = new Set();
  const list = (Array.isArray(a.list) ? a.list : [])
    .filter(validEntry)
    .sort((x, y) => x.n - y.n)
    .filter((e) => !seen.has(e.n) && seen.add(e.n))
    .slice(-ALBUM_MAX);
  const top = list.length ? list[list.length - 1].n : 0;
  return { ...a, n: Number.isInteger(a.n) && a.n >= top ? a.n : top, list };
}

// Bilder der Folgen (Standbilder der Brunnen-Kamera als data:-Adresse) unter eigenem Schlüssel: Der Spielstand wird
// bei jedem Besuch, Kauf und jeder Einstellung geschrieben und bleibt so klein; und ist der Speicher voll, scheitert
// nur ein Bild, nie Guthaben und Rekorde. { "<Folge>": "data:image/webp;base64,…" }
export const PIC_KEY = KEY + '-bilder';
/** Höchstens so viele Zeichen je Bild … */
export const PIC_MAX = 40000;
/** … und für alle Bilder zusammen (rund 1,5 MB): Darüber gehen die Bilder der ältesten Folgen. */
export const PIC_BUDGET = 1500000;

/** Alle gespeicherten Bilder: Map Folge → data:-Adresse (leer, wenn nichts da oder der Speicher gesperrt ist). */
export function loadPictures() {
  const out = new Map();
  try {
    const raw = part(JSON.parse(localStorage.getItem(PIC_KEY) || '{}'));
    for (const [k, v] of Object.entries(raw)) if (typeof v === 'string' && v.startsWith('data:image/')) out.set(+k, v);
  } catch (e) {
    /* keine Bilder: das Album zeichnet seine Karten */
  }
  return out;
}

/**
 * Das Bild der Folge n speichern. Was über PIC_BUDGET geht, nimmt die ältesten Bilder mit; wirft der Speicher (voll),
 * gehen weitere alte. Passt nicht einmal das neue allein, bleibt alles, wie es war. Ergebnis: true, wenn das Bild
 * gespeichert ist (sonst zeigt das Album für diese Folge die gezeichnete Karte).
 */
export function storePicture(n, url) {
  if (!Number.isInteger(n) || typeof url !== 'string' || !url.startsWith('data:image/') || url.length > PIC_MAX) return false;
  const pics = loadPictures();
  pics.set(n, url);
  const keys = [...pics.keys()].sort((a, b) => a - b);
  let total = 0;
  for (const k of keys) total += pics.get(k).length;
  while (total > PIC_BUDGET && keys.length) {
    const k = keys.shift();
    total -= pics.get(k).length;
    pics.delete(k);
  }
  for (;;) {
    try {
      localStorage.setItem(PIC_KEY, JSON.stringify(Object.fromEntries(pics)));
      return pics.has(n);
    } catch (e) {
      const old = keys.findIndex((k) => k !== n);
      if (old < 0) return false;
      pics.delete(keys.splice(old, 1)[0]);
    }
  }
}

/** Platz schaffen: die ältere Hälfte der Bilder löschen. Ergebnis: ob es etwas zu löschen gab. */
function trimPictures() {
  const pics = loadPictures();
  if (!pics.size) return false;
  const keys = [...pics.keys()].sort((a, b) => a - b);
  for (const k of keys.slice(0, Math.ceil(keys.length / 2))) pics.delete(k);
  try {
    if (pics.size) localStorage.setItem(PIC_KEY, JSON.stringify(Object.fromEntries(pics)));
    else localStorage.removeItem(PIC_KEY);
  } catch (e) {
    return false;
  }
  return true;
}

export function storeSave(save) {
  const json = JSON.stringify(save);
  // Ist der Speicher voll, weichen erst Bilder des Albums: Guthaben und Rekorde gehen vor
  for (let tries = 0; ; tries++) {
    try {
      localStorage.setItem(KEY, json);
      return true;
    } catch (e) {
      if (tries > 3 || !trimPictures()) return false;
    }
  }
}

export function resetSave() {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(PIC_KEY);
  } catch (e) {
    /* egal */
  }
  return structuredClone(DEFAULT_SAVE);
}
