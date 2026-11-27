// Steuerungsübersicht (Pause und Titel: menus.js render_controls; dazu die Tasten der Tipps in first-tips.js): jede
// Zeile aus den echten Belegungen – Tastatur und Gamepad aus src/input.js (ACTIONS, PAD_BUTTONS, PAD_DRIVE), Touch aus
// src/ui/touch.js (TOUCH_BUTTONS, TOUCH_LABELS), das Vollbild aus src/ui/fullscreen.js (FULLSCREEN_KEY). Ändert sich
// eine Belegung, ändert sich die Übersicht mit; tools/menues-test.mjs prüft, dass jede belegte Taste und jeder Knopf
// hier steht und nichts, was nirgends belegt ist. Ohne DOM.
import { ACTIONS, PAD_BUTTONS, PAD_DRIVE } from '../input.js';
import { TOUCH_BUTTONS, TOUCH_LABELS } from './touch.js';
import { FULLSCREEN_KEY } from './fullscreen.js';

const KEY_NAMES = { ArrowLeft: '←', ArrowRight: '→', ArrowUp: '↑', ArrowDown: '↓', Space: 'Leertaste', Escape: 'Esc', Enter: 'Enter' };
/** Name einer Taste (e.code): Pfeile als Pfeil, Buchstaben als Buchstabe. */
export const keyName = (code) => KEY_NAMES[code] || code.replace(/^(Key|Digit)/, '');

// Knöpfe der Standard-Belegung, wie sie auf den meisten Pads heißen (Xbox-Schrift), das Steuerkreuz als ✚
const PAD_NAMES = { 0: 'A', 1: 'B', 2: 'X', 3: 'Y', 4: 'LB', 5: 'RB', 6: 'LT', 7: 'RT', 8: 'Back', 9: 'Start', 10: 'L3', 11: 'R3' };
const DPAD = { 12: '↑', 13: '↓', 14: '←', 15: '→' };
/** Name eines Gamepad-Knopfs (Nummer der Standard-Belegung). */
export const padName = (i) => (DPAD[i] ? '✚ ' + DPAD[i] : PAD_NAMES[i] ?? 'Knopf ' + i);

/** Tasten einer Aktion, in der Reihenfolge der Tabelle (['↑', 'W']). */
export const keysOf = (action) => Object.keys(ACTIONS).filter((c) => ACTIONS[c] === action).map(keyName);
/** Gamepad-Knöpfe einer Aktion (['Y']). */
export const padOf = (action) => Object.keys(PAD_BUTTONS).filter((i) => PAD_BUTTONS[i] === action).map((i) => padName(+i));
/** Beschriftung des Touch-Knopfs einer Aktion (mit Symbol) oder null. */
export function touchOf(action) {
  const t = TOUCH_BUTTONS.find((b) => b.action === action);
  return t ? (t.icon ? t.icon + ' ' + t.label : t.label) : null;
}

/** Beschriftung des Touch-Knopfs einer Aktion, solange er gleich hier handelt (TOUCH_BUTTONS now), oder null. */
export function touchNowOf(action) {
  const t = TOUCH_BUTTONS.find((b) => b.action === action && b.now);
  return t ? (t.icon ? t.icon + ' ' + t.now : t.now) : null;
}

/** Was eine Taste der Tipps zeigt (first-tips.js): für das Gerät die erste Belegung der Aktion. */
export function deviceKey(action, device) {
  if (device === 'touch') return touchOf(action);
  return (device === 'gamepad' ? padOf(action) : keysOf(action))[0] ?? null;
}

/**
 * Die Zeilen der Übersicht: { id, text, keys, pad, touch, note } – keys/pad/touch sind Listen gleichwertiger
 * Belegungen (leer: auf diesem Gerät nicht belegt), note eine kurze Erklärung darunter. id ist die Aktion aus den
 * Tabellen (lenken: left/right, die übrigen Zeilen ohne eigene Aktion heißen nach dem, was sie tun).
 */
export function controlRows() {
  const pair = (a, b) => keysOf(a).map((k, i) => k + ' ' + keysOf(b)[i]);
  const one = (action, text, note) => ({ id: action, text, keys: keysOf(action), pad: padOf(action), touch: touchOf(action) ? [touchOf(action)] : [], note });
  const stick = PAD_DRIVE.stick === 0 ? 'Linker Stick' : 'Rechter Stick';
  const brake = { keys: keysOf('brake'), pad: PAD_DRIVE.brake.map(padName), touch: [TOUCH_LABELS.brake] };
  return [
    {
      id: 'left/right', text: 'Lenken', keys: pair('left', 'right'), pad: [stick, '✚ ' + DPAD[PAD_DRIVE.left] + ' ' + DPAD[PAD_DRIVE.right]],
      touch: [TOUCH_LABELS.drag, TOUCH_LABELS.left + ' ' + TOUCH_LABELS.right],
      note: 'Kurz tippen: ein Stück zur Seite, halten: Spur wechseln. Touch: links ziehen (kurz wischen wechselt die Spur) oder die Lenkknöpfe – einstellbar unter Fahren.',
    },
    { id: 'gas', text: 'Strom geben', keys: keysOf('gas'), pad: PAD_DRIVE.gas.map(padName), touch: [TOUCH_LABELS.gas] },
    { id: 'brake', text: 'Bremsen', ...brake },
    { id: 'reverse', text: 'Rückwärtsgang', ...brake, note: 'Im Stand die Bremse halten, dann mit Strom zurück.' },
    one('horn', 'Hupen', 'Brunnen und Elsa grüßen.'),
    one('megafon', 'Megafon', 'Eine Durchsage – wer vor dir fährt, macht Platz.'),
    one('brunnen', 'BrunnenTV unterwegs', 'Neben einem Brunnen auf dem Weg anhalten, dann geht es los.'),
    { ...one('ladestopp', 'Laden', 'Neben einer Ladesäule oder Bucht: gleich hier laden. Sonst den nächsten Ladestopp einplanen – das Navi führt hin, danach weiter zum Ziel.'), touch: [touchOf('ladestopp'), touchNowOf('ladestopp')] },
    one('camera', 'Kamera: Cockpit oder Drohne'),
    one('wiper', 'Scheibenwischer von Hand'),
    one('pause', 'Pause'),
    { id: 'skip', text: 'Szene überspringen', keys: ['jede Taste'], pad: ['jeder Knopf'], touch: ['aufs Bild tippen'], note: 'Startszene und Ladestopp.' },
    { ...one('confirm', 'Tipps der ersten Minuten abschalten'), touch: ['✕ am Tipp'] },
    one('chat', 'Chat ein oder aus', 'Auch unter Einstellungen.'),
    one('mute', 'Ton an oder aus', 'Auch unter Einstellungen.'),
    { ...one('radio', 'Autoradio: aus, JAM FM, Bayern 1', 'Zuerst aus. Auch in der Pause.'), touch: ['📻 in der Pause'] },
    { id: 'fullscreen', text: 'Vollbild an oder aus', keys: [keyName(FULLSCREEN_KEY)], pad: [], touch: ['⛶ im Menü'] },
  ];
}
