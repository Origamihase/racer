// Fahr-Einstellungen: Voreinstellungen je Gerät, Umsetzung auf Fahrphysik und Eingabe, Zeilen für die
// Einstellungsseite. Gespeichert wird nur, was der Spieler geändert hat – fehlt ein Wert (alte Spielstände, neues
// Gerät), gilt die Voreinstellung des Geräts.

export const IS_TOUCH = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;

/** Voreinstellungen (die Tastatur ist das Hauptgerät: frei lenken, sanfte Hilfen, Tempomat aus). */
export function driveDefaults(touch = IS_TOUCH) {
  return {
    steerSens: 1, // Lenkempfindlichkeit 0 … 1 (1 = wie gemessen und abgestimmt)
    laneAssist: 'sanft', // Spurhalteassistent: an | sanft | aus
    curveAssist: 'sanft', // Kurvenhilfe: aus | sanft | stark
    tipLane: false, // Spurwechsel per Tipp
    cruise: !!touch, // Tempomat: auf Handy und Tablet an
    touchMode: 'wischen', // Touch-Bedienung: wischen | tasten
    vibration: true,
    tempoFeel: true, // Tempo-Gefühl: ab 150 km/h weitet sich der Blick im Cockpit (main.js TEMPO_FOV)
  };
}

/** Gültige Einstellungen aus dem Spielstand (fehlende und kaputte Werte → Voreinstellung). */
export function driveSettings(settings = {}, touch = IS_TOUCH) {
  const d = driveDefaults(touch);
  const ok = {
    steerSens: (v) => typeof v === 'number' && v >= 0 && v <= 1,
    laneAssist: (v) => ['an', 'sanft', 'aus'].includes(v),
    curveAssist: (v) => ['aus', 'sanft', 'stark'].includes(v),
    tipLane: (v) => typeof v === 'boolean',
    cruise: (v) => typeof v === 'boolean',
    touchMode: (v) => ['wischen', 'tasten'].includes(v),
    vibration: (v) => typeof v === 'boolean',
    tempoFeel: (v) => typeof v === 'boolean',
  };
  for (const k of Object.keys(d)) if (ok[k](settings[k])) d[k] = settings[k];
  return d;
}

/** Optionen für Player.configure(). */
export function playerOptions(ds) {
  return { tip: ds.tipLane, laneAssist: ds.laneAssist, curveAssist: ds.curveAssist, sens: ds.steerSens, cruise: ds.cruise };
}

const el = (tag, cls, parent, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  if (parent) parent.appendChild(e);
  return e;
};

/**
 * Zeilen „Fahren“ für die Einstellungsseite. Knöpfe tragen data-action (toggle / choice) wie die übrigen Knöpfe der
 * Seite; die Seite leitet sie an setting(key, value) weiter. Jede Option erklärt sich in einem kurzen Satz.
 * @param {HTMLElement} list @param {object} ds driveSettings @param {(key:string, value:any)=>void} setting
 * @param {(parent:HTMLElement, label:string, action:string, cls?:string)=>HTMLButtonElement} button
 */
export function renderDriveSettings(list, ds, setting, button) {
  el('h3', 'set-head', list, '🚗 Fahren');
  const note = (r, text) => el('div', 'set-note', r, text);
  const row = (label) => {
    const r = el('div', 'set-row set-drive', list);
    el('span', '', r, label);
    return r;
  };
  const choice = (key, label, options, text) => {
    const r = row(label);
    const seg = el('div', 'seg', r);
    for (const [v, l] of options) {
      const b = button(seg, l, 'choice', ds[key] === v ? 'on' : 'off');
      b.dataset.key = key;
      b.dataset.value = v;
    }
    note(list, text);
  };
  const toggle = (key, label, text) => {
    const r = row(label);
    const b = button(r, ds[key] ? 'An' : 'Aus', 'toggle', ds[key] ? 'on' : 'off');
    b.dataset.key = key;
    b.dataset.on = ds[key] ? '1' : '0';
    note(list, text);
  };
  // Lenkempfindlichkeit als Regler (wie die Lautstärke)
  const sr = row('Lenkempfindlichkeit');
  const range = el('input', 'range', sr);
  range.type = 'range';
  range.min = '0';
  range.max = '1';
  range.step = '0.05';
  range.value = String(ds.steerSens);
  range.dataset.key = 'steerSens';
  range.addEventListener('input', () => setting('steerSens', parseFloat(range.value)));
  note(list, 'Wie kräftig ein Tastendruck lenkt. Weiter links: ruhiger und etwas langsamer zur Seite.');
  choice('laneAssist', 'Spurhalteassistent', [['an', 'An'], ['sanft', 'Sanft'], ['aus', 'Aus']],
    'An: Lässt du los, rückt er dich nach einer kurzen Pause in die Spurmitte. Sanft: Du bleibst, wo du hingetippt hast – nur nah an der Linie hilft er. Er zieht nie gegen deine Hand.');
  choice('curveAssist', 'Kurvenhilfe', [['aus', 'Aus'], ['sanft', 'Sanft'], ['stark', 'Stark']],
    'Aus: Du lenkst jede Kurve selbst. Sanft: Der Wagen fährt einen Teil mit, du korrigierst. Stark: entspannt, er folgt fast von allein.');
  toggle('tipLane', 'Spurwechsel per Tipp', 'Kurz tippen wechselt genau eine Spur, Halten lenkt frei. Aus: Tippen ist eine kleine Korrektur.');
  toggle('cruise', 'Tempomat', 'Hält dein Tempo. Strom macht schneller, Bremse langsamer – die Bremse gewinnt immer.');
  if (IS_TOUCH) {
    choice('touchMode', 'Touch-Bedienung', [['wischen', 'Wischen'], ['tasten', 'Tasten']],
      'Wischen: Daumen links aufsetzen und zur Seite ziehen, kurz wischen wechselt die Spur. Tasten: zwei Lenkknöpfe.');
  }
  toggle('vibration', 'Vibration', 'Ein kurzes Rütteln bei Remplern, an der Leitplanke und nach einem haarscharfen Manöver (Handy und Gamepad).');
  toggle('tempoFeel', 'Tempo-Gefühl', 'Ab 150 km/h weitet sich der Blick im Cockpit ein wenig. Aus: Der Blick bleibt immer gleich.');
}
