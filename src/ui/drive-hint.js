// „So steuerst du“: Beim ersten Start auf einem Gerät zeigt ein Hinweis die Bedienung – Tasten als kleine Tastenkappen,
// auf dem Handy die Daumen-Bedienung, mit Gamepad dessen Knöpfe. Danach nur noch der kurze Tipp wie bisher.

const SEEN = 'mini-adam-so-steuerst-du';

const el = (tag, cls, parent, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  if (parent) parent.appendChild(e);
  return e;
};

/** Zeilen des Hinweises: [[Tasten …], Text, Unterzeile?]; Tasten als Gruppen, '/' trennt gleichwertige. */
export function hintRows(device, ds) {
  const lenk = ds.tipLane ? 'kurz tippen: eine Spur weiter · halten: frei lenken' : 'kurz tippen: ein Stück zur Seite · halten: Spur wechseln';
  if (device === 'gamepad') {
    return [
      [['Stick', '/', '✚'], 'lenken', 'Steuerkreuz: ' + lenk],
      [['RT'], 'Strom', null, [['LT'], 'Bremse']],
      [['B'], 'Kamera', null, [['Start'], 'Pause'], [['A'], 'Hupe']],
    ];
  }
  if (device === 'touch') {
    const pedal = ds.cruise ? 'Rechts: Bremse und Strom + · der Tempomat hält dein Tempo' : 'Rechts: Bremse und Strom';
    if (ds.touchMode === 'tasten') return [[['◀', '▶'], 'Links: lenken', lenk], [[], pedal]];
    return [
      [[], '👍 Links aufsetzen und zur Seite ziehen: lenken', 'kurz wischen: Spur wechseln'],
      [[], pedal],
    ];
  }
  return [
    [['←', '→', 'oder', 'A', 'D'], 'lenken', lenk],
    [['↑', '/', 'W'], 'Strom', null, [['↓', '/', 'S'], 'Bremse']],
    [['V'], 'Kamera', null, [['P'], 'Pause'], [['Leertaste'], 'Hupe']],
  ];
}

function keys(parent, list) {
  for (const k of list) {
    if (k === '/' || k === 'oder') el('span', 'hint-or', parent, k === '/' ? '/' : 'oder');
    else el('kbd', 'hint-key' + (k.length > 2 ? ' wide' : ''), parent, k);
  }
}

// Der Hinweis liegt über der Fahrbahn: Wer schon gelenkt und Strom gegeben (oder gebremst) hat, braucht ihn nicht mehr
// so lange – er blendet dann nach frühestens 4 s aus.
let hint = null;

/** Jedes Bild während der Fahrt (ctl: die Eingaben dieses Bildes). */
export function driveHintTick(dt, ctl) {
  if (!hint) return;
  hint.age += dt;
  if (ctl.steerKey || Math.abs(ctl.analog || 0) > 0.3 || ctl.lane) hint.steered = true;
  if (ctl.throttle > 0.3 || ctl.brake > 0.3) hint.pedal = true;
  if (hint.steered && hint.pedal && hint.age >= 4) {
    hint.rec.t = Math.min(hint.rec.t, 1.2);
    hint = null;
  } else if (hint.rec.t <= 0) hint = null;
}

/**
 * Zeigt den Hinweis, wenn er auf diesem Gerät noch nie zu sehen war (sonst false: dann den kurzen Tipp zeigen).
 * @param {import('./ui.js').UI} ui @param {string} device keyboard | touch | gamepad @param {object} ds driveSettings
 */
export function showDriveHint(ui, device, ds) {
  try {
    if (localStorage.getItem(SEEN)) return false;
    localStorage.setItem(SEEN, '1');
  } catch (e) {
    // ohne Speicher (privates Fenster): einmal pro Sitzung
    if (showDriveHint.done) return false;
  }
  showDriveHint.done = true;
  const rec = ui.toast('', 'hint');
  rec.t = 11;
  hint = { rec, age: 0, steered: false, pedal: false };
  el('div', 'hint-title', rec.el, '🎮 So steuerst du');
  for (const [k, text, sub, ...more] of hintRows(device, ds)) {
    const r = el('div', 'hint-row', rec.el);
    if (k.length) keys(r, k);
    el('span', 'hint-text', r, text);
    for (const [k2, t2] of more) {
      const g = el('span', 'hint-more', r);
      keys(g, k2);
      el('span', 'hint-text', g, t2);
    }
    if (sub) el('div', 'hint-sub', rec.el, sub);
  }
  ui.fitStack();
  return true;
}
