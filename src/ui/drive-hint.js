// „So steuerst du“: Beim ersten Start auf einem Gerät zeigt ein Hinweis die Bedienung – Tasten als kleine Tastenkappen,
// auf dem Handy die Daumen-Bedienung, mit Gamepad dessen Knöpfe. Danach nur noch der kurze Tipp wie bisher. Auf
// derselben Karte stehen danach die Tipps der ersten Minuten (first-tips.js, showTip).
import { TIPS } from './first-tips.js';

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

// Der Hinweis steht am Rand (ui.hintEl: unten links an Stelle der Facecam, auf Touch-Geräten auf dem Chat-Feld) und
// lässt sich lesen, während der Wagen schon rollt. Wer schon gelenkt und Strom gegeben (oder gebremst) hat, braucht ihn
// nicht mehr so lange – er blendet dann nach frühestens 4 s aus, sonst nach 11 s.
let hint = null;

/** Steht „So steuerst du“ gerade? (Dann wartet ein Tipp der ersten Minuten.) */
export const driveHintBusy = () => !!hint;

/** Jedes Bild während der Fahrt (ctl: die Eingaben dieses Bildes). */
export function driveHintTick(dt, ctl) {
  if (!hint) return;
  hint.age += dt;
  hint.t -= dt;
  if (ctl.steerKey || Math.abs(ctl.analog || 0) > 0.3 || ctl.lane) hint.steered = true;
  if (ctl.throttle > 0.3 || ctl.brake > 0.3) hint.pedal = true;
  if (hint.steered && hint.pedal && hint.age >= 4) hint.t = Math.min(hint.t, 1.2);
  if (hint.t <= 0) {
    hint.card.classList.add('hidden');
    hint = null;
  }
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
  const card = ui.hintEl;
  card.textContent = '';
  card.classList.remove('hidden', 'tip');
  hint = { card, t: 11, age: 0, steered: false, pedal: false };
  el('div', 'hint-title', card, '🎮 So steuerst du');
  for (const [k, text, sub, ...more] of hintRows(device, ds)) {
    const r = el('div', 'hint-row', card);
    if (k.length) keys(r, k);
    el('span', 'hint-text', r, text);
    for (const [k2, t2] of more) {
      const g = el('span', 'hint-more', r);
      keys(g, k2);
      el('span', 'hint-text', g, t2);
    }
    if (sub) el('div', 'hint-sub', card, sub);
  }
  return true;
}

/**
 * Ein Tipp der ersten Minuten auf der Karte des Hinweises (id aus TIPS; null räumt die Karte). Mit Tastatur sagt die
 * letzte Zeile, wie man alle abschaltet; das ✕ oben rechts tut es für Maus und Finger (onOff).
 */
export function showTip(ui, id, device, onOff) {
  const card = ui.hintEl;
  if (!id) {
    card.classList.add('hidden');
    card.classList.remove('tip');
    return;
  }
  const tip = TIPS[id];
  card.textContent = '';
  card.classList.remove('hidden');
  card.classList.add('tip');
  // neu einblenden wie ein frischer Hinweis
  card.style.animation = 'none';
  void card.offsetWidth;
  card.style.animation = '';
  el('div', 'hint-title', card, tip.title);
  for (const [k, text] of tip.rows(device)) {
    const r = el('div', 'hint-row', card);
    if (k.length) keys(r, k);
    el('span', 'hint-text', r, text);
  }
  if (device === 'keyboard') el('div', 'hint-sub hint-off', card, 'Enter: keine Tipps mehr');
  const x = el('button', 'hint-close', card, '✕');
  x.type = 'button';
  x.title = 'Keine Tipps mehr';
  x.setAttribute('aria-label', 'Keine Tipps mehr');
  x.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    onOff();
  });
}
