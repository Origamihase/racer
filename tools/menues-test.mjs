// Prüft die Menüs ohne Browser. Steuerung (src/ui/controls.js): Jede belegte Taste, jeder belegte Gamepad-Knopf und
// jeder Touch-Knopf steht in der Übersicht bei seiner Aktion, und dort steht nichts, was nirgends belegt ist; die
// Tasten der Tipps der ersten Minuten und von „So steuerst du“ sind echte Belegungen; das Gamepad löst die Aktionen
// seiner Tabelle wirklich aus; die Übersicht ist auch aus der Pause erreichbar.
// node tools/menues-test.mjs
import { readFileSync } from 'node:fs';
import { ACTIONS, PAD_BUTTONS, PAD_DRIVE, Input } from '../src/input.js';
import { TOUCH_BUTTONS, TOUCH_LABELS } from '../src/ui/touch.js';
import { FULLSCREEN_KEY } from '../src/ui/fullscreen.js';
import { controlRows, keyName, padName, touchOf, deviceKey } from '../src/ui/controls.js';
import { TIPS, ORDER } from '../src/ui/first-tips.js';
import { hintRows } from '../src/ui/drive-hint.js';

let fails = 0;
let checks = 0;
function ok(cond, msg) {
  checks++;
  if (cond) return;
  fails++;
  console.error('FEHLER: ' + msg);
}
const src = (f) => readFileSync(new URL('../' + f, import.meta.url), 'utf8');

// ---------- Steuerung ----------
const rows = controlRows();
const rowOf = (action) => rows.filter((r) => r.id.split('/').includes(action));
// eine Zelle kann ein Paar nennen („← →“, „A D“): einzeln vergleichen
const chips = (list) => list.flatMap((k) => k.split(' '));
const SKIP = { keys: 'jede Taste', pad: 'jeder Knopf', touch: 'aufs Bild tippen' };

// jede Taste der Tastatur bei ihrer Aktion
for (const [code, action] of Object.entries(ACTIONS)) {
  const rs = rowOf(action);
  ok(rs.length > 0, `Taste ${code} (${action}): keine Zeile`);
  for (const r of rs) ok(chips(r.keys).includes(keyName(code)), `Taste ${code}: fehlt in „${r.text}“ (${r.keys.join(' | ')})`);
}
ok(rowOf('fullscreen').some((r) => r.keys.includes(keyName(FULLSCREEN_KEY))), `Vollbild-Taste ${FULLSCREEN_KEY} fehlt`);
// jeder Gamepad-Knopf bei seiner Aktion, dazu Stick, Trigger und Steuerkreuz der Fahrt
for (const [i, action] of Object.entries(PAD_BUTTONS)) {
  const rs = rowOf(action);
  ok(rs.length > 0, `Knopf ${i} (${action}): keine Zeile`);
  for (const r of rs) ok(r.pad.includes(padName(+i)), `Knopf ${i}: ${padName(+i)} fehlt in „${r.text}“ (${r.pad.join(' | ')})`);
}
for (const k of ['gas', 'brake']) {
  for (const i of PAD_DRIVE[k]) ok(rowOf(k)[0].pad.includes(padName(i)), `${k}: Knopf ${padName(i)} fehlt`);
}
ok(chips(rowOf('left')[0].pad).includes(padName(PAD_DRIVE.left).split(' ')[1]) && chips(rowOf('right')[0].pad).includes(padName(PAD_DRIVE.right).split(' ')[1]), 'Lenken: Steuerkreuz fehlt');
ok(rowOf('left')[0].pad.some((p) => /Stick/.test(p)), 'Lenken: Stick fehlt');
ok(padName(PAD_DRIVE.left) === '✚ ←' && padName(PAD_DRIVE.right) === '✚ →' && padName(PAD_DRIVE.gas[0]) === 'RT' && padName(PAD_DRIVE.brake[0]) === 'LT', 'Gamepad-Namen der Fahrt stimmen nicht');
// jeder Touch-Knopf bei seiner Aktion, dazu Lenken und Pedale
for (const t of TOUCH_BUTTONS) {
  const rs = rowOf(t.action);
  ok(rs.length > 0, `Touch ${t.label}: keine Zeile`);
  for (const r of rs) ok(r.touch.includes(touchOf(t.action)), `Touch ${t.label}: fehlt in „${r.text}“`);
}
ok(rowOf('left')[0].touch.includes(TOUCH_LABELS.drag) && chips(rowOf('left')[0].touch).includes(TOUCH_LABELS.left) && chips(rowOf('right')[0].touch).includes(TOUCH_LABELS.right), 'Touch-Lenken fehlt');
ok(rowOf('gas')[0].touch.includes(TOUCH_LABELS.gas) && rowOf('brake')[0].touch.includes(TOUCH_LABELS.brake), 'Touch-Pedale fehlen');

// nichts, was nirgends belegt ist: jede Kappe ist eine Taste der Tabelle, ein Knopf der Tabelle oder ein Touch-Knopf
const realKeys = new Set([...Object.keys(ACTIONS), FULLSCREEN_KEY].map(keyName));
const realPad = new Set([...Object.keys(PAD_BUTTONS).map((i) => padName(+i)), ...PAD_DRIVE.gas.map(padName), ...PAD_DRIVE.brake.map(padName), '✚', '←', '→']);
if (PAD_DRIVE.stick === 0 || PAD_DRIVE.stick === 2) realPad.add(PAD_DRIVE.stick === 0 ? 'Linker Stick' : 'Rechter Stick');
// Touch: die Knöpfe der Liste, Lenken und Pedale und drei Dinge, die es im Spiel wirklich gibt (Quelle geprüft)
const realTouch = new Set([...TOUCH_BUTTONS.map((t) => touchOf(t.action)), ...Object.values(TOUCH_LABELS), '⛶ im Menü', '✕ am Tipp']);
ok(/⛶/.test(src('src/ui/fullscreen.js')) && /fs-btn/.test(src('src/ui/menus.js')), 'Vollbild-Knopf ⛶ im Menü fehlt');
ok(/hint-close', card, '✕'/.test(src('src/ui/drive-hint.js')), 'das ✕ am Tipp fehlt');
ok(/renderer\.domElement\.addEventListener\('pointerdown'[\s\S]{0,120}anyKey = true/.test(src('src/main.js')), 'Tipp aufs Bild überspringt keine Szene mehr');
for (const r of rows) {
  ok(r.text && r.text.length <= 40, `„${r.text}“: Text fehlt oder ist zu lang`);
  ok(!r.note || r.note.length <= 160, `„${r.text}“: Erklärung zu lang für das Handy`);
  ok(r.keys.length + r.pad.length + r.touch.length > 0, `„${r.text}“: auf keinem Gerät belegt`);
  for (const k of r.keys) ok(k === SKIP.keys ? r.id === 'skip' : chips([k]).every((c) => realKeys.has(c)), `„${r.text}“: Taste ${k} ist nicht belegt`);
  for (const k of r.pad) ok(k === SKIP.pad ? r.id === 'skip' : chips([k]).every((c) => realPad.has(c)) || realPad.has(k), `„${r.text}“: Knopf ${k} ist nicht belegt`);
  for (const k of r.touch) ok(k === SKIP.touch ? r.id === 'skip' : realTouch.has(k) || chips([k]).every((c) => realTouch.has(c)), `„${r.text}“: Touch ${k} gibt es nicht`);
}
ok(new Set(rows.map((r) => r.id)).size === rows.length, 'zwei Zeilen mit derselben id');
// alle Aktionen der Tabellen kommen vor (auch die nur am Gamepad oder nur auf Touch)
for (const a of new Set([...Object.values(ACTIONS), ...Object.values(PAD_BUTTONS), ...TOUCH_BUTTONS.map((t) => t.action)])) ok(rowOf(a).length > 0, `Aktion ${a} fehlt`);

// die Tipps der ersten Minuten und „So steuerst du“ nennen nur echte Belegungen
const DEV = { keyboard: 'keys', gamepad: 'pad', touch: 'touch' };
for (const id of ORDER) {
  const action = TIPS[id].action;
  for (const device of Object.keys(DEV)) {
    for (const [k] of TIPS[id].rows(device)) {
      for (const c of k) ok(action && rowOf(action)[0][DEV[device]].includes(c), `Tipp ${id} (${device}): ${c} ist nicht die Belegung`);
    }
    if (action && device !== 'touch') ok(TIPS[id].rows(device)[0][0][0] === deviceKey(action, device), `Tipp ${id} (${device}): nicht die erste Belegung`);
  }
}
ok(TIPS.ladestopp.rows('gamepad')[0][0][0] === padName(4) && padName(4) === 'LB', 'Ladestopp-Tipp am Gamepad: nicht LB');
for (const device of ['keyboard', 'gamepad']) {
  const real = device === 'keyboard' ? realKeys : new Set([...realPad, 'Stick']);
  for (const ds of [{}, { tipLane: true }]) {
    for (const [k, , , ...more] of hintRows(device, ds)) {
      for (const c of [k, ...more.map((m) => m[0])].flat()) ok(c === '/' || c === 'oder' || real.has(c), `So steuerst du (${device}): ${c} ist nicht belegt`);
    }
  }
}

// das Gamepad löst die Aktionen seiner Tabelle aus (Standard-Belegung, ein Pad, ein Druck je Knopf)
{
  const buttons = Array.from({ length: 17 }, () => ({ pressed: false, value: 0 }));
  const pad = { index: 0, connected: true, timestamp: 0, axes: [0, 0, 0, 0], buttons };
  Object.defineProperty(globalThis.navigator, 'getGamepads', { value: () => [pad], configurable: true });
  const input = new Input();
  let t = 1000;
  for (const [i, action] of Object.entries(PAD_BUTTONS)) {
    buttons[i].pressed = true;
    input.poll((t += 16));
    ok(input.take(action) && input.anyKey, `Knopf ${padName(+i)}: löst ${action} nicht aus`);
    input.anyKey = false;
    input.poll((t += 16));
    ok(!input.take(action), `Knopf ${padName(+i)}: gehalten löst ${action} zweimal aus`);
    buttons[i].pressed = false;
    input.poll((t += 16));
  }
  // ein Knopf ohne Aktion zählt trotzdem als Taste (überspringt eine Szene)
  buttons[10].pressed = true;
  input.poll((t += 16));
  ok(input.anyKey, 'L3: zählt nicht als Taste');
  buttons[10].pressed = false;
  buttons[PAD_DRIVE.gas[0]].value = 1;
  input.poll((t += 16));
  ok(input.throttle === 1, 'RT gibt keinen Strom');
  delete globalThis.navigator.getGamepads;
}

// die Übersicht ist im Titel und in der Pause zu erreichen
{
  const m = src('src/ui/menus.js');
  const block = (name) => m.slice(m.indexOf(`  render_${name}(`), m.indexOf('\n  }\n', m.indexOf(`  render_${name}(`)));
  ok(/'controls'\)/.test(block('title')), 'Titel: Knopf Steuerung fehlt');
  ok(/'controls'\)/.test(block('pause')), 'Pause: Knopf Steuerung fehlt');
  ok(/controlRows\(\)/.test(block('controls')), 'Steuerung: Zeilen nicht aus controls.js');
}

console.log(fails ? `menues-test: ${fails} von ${checks} Prüfungen FEHLGESCHLAGEN` : `menues-test: alles grün (${checks} Prüfungen: Steuerung aus ${rows.length} Zeilen, jede Belegung genannt)`);
process.exit(fails ? 1 : 0);
