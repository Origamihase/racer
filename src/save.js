// Spielstand im Browser (localStorage). Alles in try/catch, falls Speicher gesperrt ist.
const KEY = 'mini-adam-tesla-navi-v1';

export const DEFAULT_SAVE = {
  wallet: 0,
  upgrades: {},
  best: { earned: 0, viewers: 0, reise: 0 }, // reise: Rekord der Strecke eines Streams in Reisemetern
  stats: { runs: 0, naviReached: 0, crashes: 0, reiseKm: 0 },
  settings: { sound: true, speech: true, chat: true, facecam: true, quality: 'auto', volume: 0.8 },
  // besuchte Orte der großen Karte: Wiki-Name → Zahl der Besuche
  visits: {},
  // das gekaufte Megafon ist erstattet (refundMegafon): so viele Euro, einmal; 0: nichts erstattet
  megafonRefund: 0,
  // so viele erstattete Euro sagt der Titel noch an, bis zum ersten Besuch im Shop (megafonNoteSeen); 0: nichts
  megafonNote: 0,
  // BrunnenTV-Album der Reise (src/game/album.js): n = Nummer der letzten Folge, list = die Folgen; die Bilder dazu
  // stehen unter eigenem Schlüssel (storePicture)
  album: { n: 0, list: [] },
  // der laufende Stream, wie die Abrechnung ihn zuletzt gebucht hätte (interimStream, alle paar Sekunden und beim
  // Verlassen der Seite): Endet die Seite mitten im Stream (Tab zu, Absturz, Handy-Akku), bucht ihn der nächste Start
  // (settlePending); null: kein Stream offen
  pending: null,
  // so viel änderte der zuletzt abgebrochene Stream am Guthaben (settlePending), bis zur nächsten Fahrt sagt es der Titel;
  // null: nichts
  streamNote: null,
  // Startort des letzten Streams (Kennung aus game/starts.js STARTS): der nächste beginnt im Ort danach; null: noch keiner
  start: null,
};

/** Ein gespeicherter Teil-Spielstand (best, stats, …) – oder nichts, wenn dort etwas anderes steht als ein Objekt. */
const part = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});

/**
 * Felder aus der Zeit der klassischen Autobahn, die niemand mehr liest: der gewählte Modus, ob der Kameraschwenk
 * zum Start schon lief, Rekord und Kilometer der endlosen Strecke (best.distance, stats.totalKm) und die alten
 * Spur-Euro. Sie fallen beim Laden still weg (beim nächsten Speichern sind sie fort); Guthaben, Käufe, Album,
 * besuchte Orte, Einstellungen und die übrigen Rekorde bleiben.
 */
const RETIRED = { top: ['mode', 'seenIntro'], best: ['distance'], stats: ['totalKm', 'leftLaneEuro'] };

/**
 * Die Einstellungen aus dem Speicher: Jede bekannte Einstellung muss den richtigen Typ und einen erlaubten Wert haben
 * (sonst gilt der Standard, etwa bei volume: "laut" oder quality: 7). Unbekannte bleiben erhalten; die Fahr-Einstellungen
 * prüft driveSettings (src/ui/drive-settings.js) selbst.
 */
const SETTING_OK = {
  sound: (v) => typeof v === 'boolean',
  speech: (v) => typeof v === 'boolean',
  chat: (v) => typeof v === 'boolean',
  facecam: (v) => typeof v === 'boolean',
  quality: (v) => ['auto', 'hoch', 'mittel', 'niedrig'].includes(v),
  volume: (v) => Number.isFinite(v) && v >= 0 && v <= 1,
};
export function cleanSettings(raw) {
  const s = { ...DEFAULT_SAVE.settings, ...part(raw) };
  for (const [k, ok] of Object.entries(SETTING_OK)) if (!ok(s[k])) s[k] = DEFAULT_SAVE.settings[k];
  return s;
}

export function loadSave() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULT_SAVE);
    // Ältere Spielstände kennen manche Felder noch nicht (visits, best.reise, album): Sie bekommen den Standard. Felder,
    // die dieser Stand nicht kennt (ein neuerer hat sie geschrieben), bleiben erhalten und werden wieder mitgespeichert
    // – nur die der klassischen Autobahn nicht (RETIRED).
    const data = part(JSON.parse(raw));
    const save = {
      ...structuredClone(DEFAULT_SAVE),
      ...data,
      // (das Guthaben wird addiert, auch eins im Minus: Steht dort keine Zahl, begänne die Kasse lieber bei null als bei
      // „12,5“ + 3)
      wallet: Number.isFinite(data.wallet) ? data.wallet : DEFAULT_SAVE.wallet,
      best: { ...DEFAULT_SAVE.best, ...part(data.best) },
      stats: { ...DEFAULT_SAVE.stats, ...part(data.stats) },
      settings: cleanSettings(data.settings),
      upgrades: { ...part(data.upgrades) },
      visits: { ...part(data.visits) },
      album: cleanAlbum(data.album),
      pending: cleanStream(data.pending),
      streamNote: cleanNote(data.streamNote),
      start: typeof data.start === 'string' ? data.start : null,
    };
    for (const k of RETIRED.top) delete save[k];
    for (const k of RETIRED.best) delete save.best[k];
    for (const k of RETIRED.stats) delete save.stats[k];
    return save;
  } catch (e) {
    return structuredClone(DEFAULT_SAVE);
  }
}

// --- Abrechnung eines Streams -----------------------------------------------------------------------------------------
const num = (v) => (Number.isFinite(v) ? v : 0);

/**
 * Ein Stream für die Abrechnung: { money (Euro, mit Vorzeichen), distance (Reisemeter), peakViewers, naviReached,
 * crashes } – oder null, wenn dort nichts Brauchbares steht (Geld und Strecke müssen Zahlen sein).
 */
export function cleanStream(raw) {
  if (!raw || typeof raw !== 'object' || !Number.isFinite(raw.money) || !Number.isFinite(raw.distance)) return null;
  return {
    money: Math.round(raw.money * 100) / 100,
    distance: Math.max(0, raw.distance),
    peakViewers: Math.max(0, num(raw.peakViewers)),
    naviReached: Math.max(0, Math.round(num(raw.naviReached))),
    crashes: Math.max(0, Math.round(num(raw.crashes))),
  };
}
const cleanNote = (raw) => (raw && typeof raw === 'object' && Number.isFinite(raw.money) && Number.isFinite(raw.distance) ? { money: raw.money, distance: raw.distance } : null);

/**
 * Einen Stream ins Guthaben, die Rekorde und die Statistik buchen (am Ende jedes Streams, und für einen abgebrochenen
 * beim nächsten Start). Ein Stream im Minus (Schäden, Bußgelder) geht ganz vom Guthaben ab, auch unter null
 * (Besitzer, 25.11.2026: „Ich möchte, dass Schäden, Bußgelder etc das Guthaben ins Minus ziehen kann.“): Die Schulden
 * bleiben stehen, bis spätere Streams sie abtragen. Der offene Zwischenstand ist danach erledigt. Ergebnis: { newRecord,
 * best } (Rekord der Strecke in Reisemetern).
 */
export function settleStream(save, r) {
  const s = cleanStream(r);
  save.pending = null;
  if (!s) return { newRecord: false, best: save.best.reise || 0 };
  const best = save.best.reise || 0;
  const newRecord = s.distance > best && s.distance > 50;
  save.wallet = Math.round((save.wallet + s.money) * 100) / 100;
  save.best.reise = Math.max(best, s.distance);
  save.best.earned = Math.max(save.best.earned || 0, s.money);
  save.best.viewers = Math.max(save.best.viewers || 0, s.peakViewers);
  save.stats.runs = (save.stats.runs || 0) + 1;
  save.stats.reiseKm = (save.stats.reiseKm || 0) + s.distance / 1000;
  save.stats.naviReached = (save.stats.naviReached || 0) + s.naviReached;
  save.stats.crashes = (save.stats.crashes || 0) + s.crashes;
  return { newRecord, best: save.best.reise };
}

/**
 * Beim Laden: Steht noch ein Zwischenstand da, endete die Seite mitten im Stream. Er wird jetzt gebucht, und der Titel
 * sagt bis zur nächsten Fahrt, was er gebracht hat (streamNote). Ergebnis: der gebuchte Stream oder null.
 */
export function settlePending(save) {
  const s = save.pending;
  if (!s) return null;
  const before = save.wallet;
  settleStream(save, s);
  // (der Hinweis nennt, was sich am Guthaben getan hat – ein Minus ganz, auch unter null)
  save.streamNote = { money: Math.round((save.wallet - before) * 100) / 100, distance: s.distance };
  return s;
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
