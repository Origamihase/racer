// Prüft die Menüs ohne Browser. Steuerung (src/ui/controls.js): Jede belegte Taste, jeder belegte Gamepad-Knopf und
// jeder Touch-Knopf steht in der Übersicht bei seiner Aktion, und dort steht nichts, was nirgends belegt ist; die
// Tasten der Tipps der ersten Minuten und von „So steuerst du“ sind echte Belegungen; das Gamepad löst die Aktionen
// seiner Tabelle wirklich aus; die Übersicht ist auch aus der Pause erreichbar. Feedback: ein Link zu GitHub im Titel
// und in der Pause, und das Spiel selbst sendet nichts. Abspann: Jeder, der in einem simulierten Stream gespendet,
// geboten, Abos verschenkt hat, VIP wurde oder geraidet hat, steht unter „Danke an“ mit seiner Summe.
// node tools/menues-test.mjs
import { mainSource } from './lib/main-source.mjs';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ACTIONS, PAD_BUTTONS, PAD_DRIVE, Input } from '../src/input.js';
import { TOUCH_BUTTONS, TOUCH_LABELS } from '../src/ui/touch.js';
import { FULLSCREEN_KEY } from '../src/ui/fullscreen.js';
import { controlRows, keyName, padName, touchOf, touchNowOf, deviceKey } from '../src/ui/controls.js';
import { TIPS, ORDER } from '../src/ui/first-tips.js';
import { hintRows } from '../src/ui/drive-hint.js';
import { FEEDBACK } from '../src/ui/menus.js';
import { thanksGroups } from '../src/ui/abspann.js';
import { fmtBetrag } from '../src/data.js';
import { fmtNum } from '../src/util.js';
import { makeStream, DRIVERS } from './stream-sim.mjs';

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
// Touch: die Knöpfe der Liste, Lenken und Pedale und Dinge, die es im Spiel wirklich gibt (Quelle geprüft)
const realTouch = new Set([...TOUCH_BUTTONS.map((t) => touchOf(t.action)), ...TOUCH_BUTTONS.filter((t) => t.now).map((t) => touchNowOf(t.action)), ...Object.values(TOUCH_LABELS), '⛶ im Menü', '✕ am Tipp', '📻 in der Pause']);
ok(/radioLabel\(\), 'radio'/.test(src('src/ui/menus.js')), 'Radio-Knopf 📻 in der Pause fehlt');
// fullscreenchange schreibt nur die Vollbild-Knöpfe um, nicht das Radio daneben (sonst zweimal „Vollbild beenden“, 27.11.)
ok(/onFullscreenChange\([\s\S]{0,300}querySelectorAll\('\.fs-btn\[data-action="vollbild"\]'\)/.test(src('src/ui/menus.js')), 'Vollbild-Wechsel benennt auch das Radio um');
ok(/⛶/.test(src('src/ui/fullscreen.js')) && /fs-btn/.test(src('src/ui/menus.js')), 'Vollbild-Knopf ⛶ im Menü fehlt');
// auch im Abspann (Akku leer, Stream vorbei): neben „Nochmal fahren“, „Shop“ und „Hauptmenü“
ok(/render_over[\s\S]*?over-menu[\s\S]{0,600}?'vollbild', 'fs-btn'[\s\S]*?this\.routeBlock/.test(src('src/ui/menus.js')), 'Vollbild-Knopf im Abspann fehlt');
ok(/hint-close', card, '✕'/.test(src('src/ui/drive-hint.js')), 'das ✕ am Tipp fehlt');
ok(/renderer\.domElement\.addEventListener\('pointerdown'[\s\S]{0,120}anyKey = true/.test(mainSource()), 'Tipp aufs Bild überspringt keine Szene mehr');
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
ok(TIPS.laden.rows('gamepad')[0][0][0] === padName(4) && padName(4) === 'LB', 'Laden-Tipp am Gamepad: nicht LB');
ok(TIPS.brunnen.rows('gamepad')[0][0][0] === padName(5) && padName(5) === 'RB', 'BrunnenTV-Tipp am Gamepad: nicht RB');
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
  buttons[PAD_DRIVE.gas[0]].value = 0;
  // Steuerkreuz gehalten, dann das Pad getrennt: die Lenkung lässt los (es kommt kein Loslassen mehr vom Pad)
  buttons[PAD_DRIVE.left].pressed = true;
  input.poll((t += 16));
  input.poll((t += 16));
  ok(input.steer === -1, 'Steuerkreuz links lenkt nicht');
  pad.connected = false;
  input.poll((t += 16));
  input.poll((t += 16));
  ok(input.steer === 0 && !Object.keys(input.padSteer).length, `Pad getrennt bei gehaltenem Steuerkreuz: lenkt weiter (${input.steer})`);
  // wieder verbunden, Steuerkreuz noch gehalten: lenkt wieder; releaseAll lässt es los, gehalten lenkt es danach weiter
  pad.connected = true;
  input.poll((t += 16));
  input.poll((t += 16));
  ok(input.steer === -1, 'Pad wieder verbunden: Steuerkreuz lenkt nicht');
  input.releaseAll(t);
  ok(!Object.keys(input.padSteer).length, 'releaseAll: Steuerkreuz bleibt gemerkt');
  buttons[PAD_DRIVE.left].pressed = false;
  input.poll((t += 16));
  input.poll((t += 16));
  ok(input.steer === 0, 'Steuerkreuz losgelassen: lenkt weiter');
  delete globalThis.navigator.getGamepads;
}
// Back schaltet die Tipps der ersten Minuten ab wie Enter (main.js: take('confirm')); die Übersicht, „So steuerst du“
// und der Tipp in der Steuerung nennen den Knopf
ok(deviceKey('confirm', 'gamepad') === 'Back' && rowOf('confirm')[0].pad.includes('Back'), 'Gamepad: kein Knopf schaltet die Tipps ab');
ok(/firstTips\.cur && input\.take\('confirm'\)\) tipsOff\(\)/.test(mainSource()), 'Tipps: confirm schaltet sie nicht ab');
ok(/deviceKey\('confirm', device\)/.test(src('src/ui/drive-hint.js')), 'So steuerst du: nennt die Taste zum Abschalten nicht');
ok(/\(am Gamepad \$\{padOf\('confirm'\)\[0\]\}\) oder ✕ schaltet sie ab/.test(src('src/ui/menus.js')), 'Steuerung: Tipp nennt Back nicht');

// die Übersicht ist im Titel und in der Pause zu erreichen
{
  const m = src('src/ui/menus.js');
  const block = (name) => m.slice(m.indexOf(`  render_${name}(`), m.indexOf('\n  }\n', m.indexOf(`  render_${name}(`)));
  ok(/'controls'\)/.test(block('title')), 'Titel: Knopf Steuerung fehlt');
  ok(/'controls'\)/.test(block('pause')), 'Pause: Knopf Steuerung fehlt');
  ok(/controlRows\(\)/.test(block('controls')), 'Steuerung: Zeilen nicht aus controls.js');
}

// ---------- Feedback ----------
// ein Link zu einem neuen Issue auf GitHub (neuer Tab, noopener, nichts angehängt) im Titel und in der Pause; das Spiel
// selbst sendet nichts – im ganzen Quelltext gibt es keinen Weg ins Netz
{
  const m = src('src/ui/menus.js');
  ok(FEEDBACK.url === 'https://github.com/Origamihase/racer/issues/new', `Feedback: falsche Adresse ${FEEDBACK.url}`);
  ok(/GitHub/.test(FEEDBACK.hint) && /sendet nichts/.test(FEEDBACK.hint) && FEEDBACK.hint.length <= 50, `Feedback: Hinweis „${FEEDBACK.hint}“`);
  const fn = m.slice(m.indexOf('function feedbackLink('), m.indexOf('\n}\n', m.indexOf('function feedbackLink(')));
  ok(/a\.href = FEEDBACK\.url;/.test(fn) && /a\.target = '_blank';/.test(fn) && /a\.rel = 'noopener';/.test(fn), 'Feedback: kein Link in neuem Tab mit noopener');
  ok(/el\('a', 'btn feedback'/.test(fn), 'Feedback: kein .btn (Tastatur und Gamepad erreichen ihn nicht)');
  const block = (name) => m.slice(m.indexOf(`  render_${name}(`), m.indexOf('\n  }\n', m.indexOf(`  render_${name}(`)));
  ok(/feedbackLink\(/.test(block('title')), 'Titel: Feedback fehlt');
  ok(/feedbackLink\(/.test(block('pause')), 'Pause: Feedback fehlt');
  ok(/e\.code === 'Space' && document\.activeElement\.tagName === 'A'/.test(m), 'Leertaste öffnet den Link nicht');
  const net = /\bfetch\(|sendBeacon|XMLHttpRequest|WebSocket|EventSource|window\.open\(|navigator\.share/;
  const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((f) => (f.isDirectory() ? walk(join(d, f.name)) : f.name.endsWith('.js') ? [join(d, f.name)] : []));
  const files = walk(fileURLToPath(new URL('../src', import.meta.url)));
  const talk = files.filter((f) => net.test(readFileSync(f, 'utf8')));
  ok(files.length > 50 && !talk.length, `das Spiel spricht mit dem Netz: ${talk.join(', ')}`);
}

// ---------- Vollbild und Esc ----------
// Esc im Vollbild gehört dem Browser (er beendet das Vollbild): Im Spiel ist derselbe Druck weder Pause noch „Zurück“,
// auch wenn der Browser die Taste erst kurz danach meldet. Jeder Wechsel kommt einmal (Safari meldet ihn doppelt) und
// sagt, wer ihn auslöste: Knopf und F (own) oder der Browser – dann hält main.js die Fahrt an, einmal.
{
  const fs = await import('../src/ui/fullscreen.js');
  let t = 1000;
  Object.defineProperty(globalThis.performance, 'now', { value: () => t * 1000, configurable: true });
  const on = {};
  const fire = () => ['fullscreenchange', 'webkitfullscreenchange'].forEach((k) => (on[k] || []).forEach((f) => f()));
  const doc = {
    fullscreenEnabled: true,
    fullscreenElement: null,
    documentElement: {
      requestFullscreen: () => ((doc.fullscreenElement = doc.documentElement), fire(), Promise.resolve()),
    },
    exitFullscreen: () => ((doc.fullscreenElement = null), fire(), Promise.resolve()),
    addEventListener: (k, f) => (on[k] = on[k] || []).push(f),
  };
  globalThis.document = doc;
  const seen = [];
  fs.onFullscreenChange((ev) => seen.push(ev));
  const esc = { code: 'Escape', target: null, preventDefault() {} };
  fs.toggleFullscreen();
  ok(seen.length === 1 && seen[0].on && seen[0].own, `Vollbild per Knopf: ${JSON.stringify(seen)}`);
  ok(fs.escapeTaken(esc) && !fs.escapeTaken({ code: 'KeyP' }), 'Esc im Vollbild gehört nicht dem Browser (oder P auch)');
  const input = new Input();
  input.onKey(esc, true);
  ok(!input.take('pause') && !input.anyKey, 'Esc im Vollbild öffnet auch die Pause');
  // der Browser beendet es (Esc): gemeldet als seiner, die Taste zählt kurz danach noch zu ihm
  t += 5;
  doc.fullscreenElement = null;
  fire();
  ok(seen.length === 2 && !seen[1].on && !seen[1].own, `Esc beendet das Vollbild: ${JSON.stringify(seen[1])}`);
  input.onKey(esc, true);
  ok(!input.take('pause'), 'Esc, gleich nachdem der Browser das Vollbild beendet hat, öffnet die Pause');
  input.onKey({ ...esc, type: 'keyup' }, false);
  t += fs.ESC_GRACE + 0.01;
  input.onKey(esc, true);
  ok(input.take('pause'), 'Esc ohne Vollbild ist keine Pause mehr');
  input.onKey(esc, false);
  // Knopf hinein und wieder hinaus: beides vom Spiel, Esc ist gleich wieder die Pause
  fs.toggleFullscreen();
  t += 2;
  fs.toggleFullscreen();
  ok(seen.length === 4 && seen[2].own && seen[3].own && !seen[3].on, `Vollbild per Knopf aus: ${JSON.stringify(seen.slice(2))}`);
  ok(!fs.escapeTaken(esc), 'Esc nach dem Knopf „Vollbild beenden“ gehört noch dem Browser');
  // ein Wechsel, den der Browser verweigert, zählt nicht als eigener
  doc.documentElement.requestFullscreen = () => Promise.reject(new Error('verweigert'));
  fs.toggleFullscreen();
  await new Promise((r) => setTimeout(r, 0));
  doc.fullscreenElement = doc.documentElement;
  fire();
  ok(seen.length === 5 && seen[4].on && !seen[4].own, 'verweigerter Wechsel zählt als eigener');
  delete globalThis.performance.now;
  delete globalThis.document;
  // die Pause beim Verlassen durch den Browser (main.js), die Menüs lassen ihm sein Esc
  ok(/onFullscreenChange\(\(\{ on, own \}\) => \{\n  if \(!on && !own\) pause\(\);\n\}\);/.test(mainSource()), 'main.js hält die Fahrt nicht an, wenn der Browser das Vollbild beendet');
  ok(/onKey\(e\) \{\n    if \(!this\.current\) return;\n[^\n]*\n    if \(escapeTaken\(e\)\) return;/.test(src('src/ui/menus.js')), 'Menüs: Esc im Vollbild drückt „Zurück“');
  ok(/function pause\(\) \{\n  if \(state !== 'drive' \|\| paused\) return;/.test(mainSource()), 'pause() öffnet die Pause zweimal');
}

// ---------- Abspann: „Danke an“ ----------
// Ein simulierter endloser Stream (das echte Spiel, tools/stream-sim.mjs): Mitgeschrieben wird von außen – jede Spende
// beim Aufruf, jedes Gebot an der Kasse, Abos, VIPs und Raids aus den Zeilen von James und den Hinweisen am Rand. Im
// Abspann steht jeder Name genau einmal in seiner Gruppe, mit seiner Summe oder Anzahl, und kein Name, der nichts gab.
let credits = '';
{
  const sim = makeStream({ driver: DRIVERS.mittel, seed: 11, endless: true });
  const g = sim.game;
  const want = { spenden: new Map(), gebote: new Map(), abos: new Map(), vips: new Map(), raids: new Map() };
  const add = (m, name, v, n = 1) => {
    const e = m.get(name) || { sum: 0, n: 0 };
    e.sum = Math.round((e.sum + v) * 100) / 100;
    e.n += n;
    m.set(name, e);
  };
  const donate = g.donate;
  g.donate = function (name, amount, ...rest) {
    add(want.spenden, name, amount);
    return donate.call(this, name, amount, ...rest);
  };
  const earn = g.earn;
  g.earn = function (amount, label, ...rest) {
    if (label === 'Navi-Gebote') add(want.gebote, this.navi.bidder, amount);
    return earn.call(this, amount, label, ...rest);
  };
  for (let i = 0; i < 50 && sim.step(60); i++);
  for (const m of sim.log.chat) {
    if (m.bot !== 'james') continue;
    const gift = /^(.+) verschenkt (?:ein Abo|(\d+) Abos) an den Chat! 🎁$/.exec(m.text);
    if (gift) add(want.abos, gift[1], +(gift[2] || 1));
    const vip = /^Neuer VIP im Live-Bereich: (.+?) (?:– und legt|\()/.exec(m.text);
    if (vip) add(want.vips, vip[1], 0);
  }
  for (const t of sim.log.toast) {
    const raid = /^👑 Raid von (.+): \+([\d.]+) Zuschauer$/.exec(t.text);
    if (raid) add(want.raids, raid[1], +raid[2].replace(/\./g, ''));
  }
  const F = g.supporters();
  const groups = thanksGroups(F);
  const byId = Object.fromEntries(groups.map((x) => [x.id, x]));
  const what = {
    spenden: (e) => fmtBetrag(e.sum),
    gebote: (e) => fmtBetrag(e.sum),
    abos: (e) => fmtNum(e.sum),
    vips: () => '',
    raids: (e) => `${fmtNum(e.n)}\u00a0${e.n === 1 ? 'Raid' : 'Raids'}, ${fmtNum(e.sum)}\u00a0${e.sum === 1 ? 'Gast' : 'Gäste'}`,
  };
  for (const id of Object.keys(want)) {
    const grp = byId[id];
    const m = want[id];
    ok(m.size > 0, `Danke an: im simulierten Stream gab es keine ${id}`);
    ok(grp && grp.names.length === m.size, `Danke an, ${id}: ${grp ? grp.names.length : 0} Namen statt ${m.size}`);
    if (!grp) continue;
    const seen = new Map(grp.names.map((x) => [x.name, x.what]));
    ok(seen.size === grp.names.length, `Danke an, ${id}: ein Name steht zweimal`);
    let miss = 0;
    for (const [name, e] of m) {
      if (!seen.has(name)) ok(++miss > 3, `Danke an, ${id}: ${name} fehlt`);
      else ok(seen.get(name) === what[id](e), `Danke an, ${id}: ${name} mit ${seen.get(name)} statt ${what[id](e)}`);
    }
    ok(!miss, `Danke an, ${id}: ${miss} Namen fehlen`);
    for (const x of grp.names) ok(m.has(x.name), `Danke an, ${id}: ${x.name} hat nichts gegeben`);
    // höchste Summe zuerst
    ok(grp.names.every((x, i) => i === 0 || id === 'vips' || id === 'abos' || m.get(grp.names[i - 1].name).sum >= m.get(x.name).sum), `Danke an, ${id}: nicht nach Summe geordnet`);
  }
  ok(byId.raids?.names.every((x) => x.name === 'König Knolli'), 'Raids: nur König Knolli raidet');
  ok(!('top' in F), 'keine eigene Zeile „Größte Spende“ mehr (Besitzer, 25.11.)');
  const sum = (m) => [...m.values()].reduce((a, e) => a + e.sum, 0);
  ok(byId.spenden.sub.endsWith(fmtBetrag(Math.round(sum(want.spenden) * 100) / 100)), `Spenden: Summe ${byId.spenden.sub}`);
  // der Abspann zeigt jede Gruppe ganz (kein „und N weitere“), danach als Letztes die Zeile des Gedenkens
  const m = src('src/ui/menus.js');
  const over = m.slice(m.indexOf('  render_over('), m.indexOf('\n  }\n', m.indexOf('  render_over(')));
  ok(/for \(const g of groups\)/.test(over) && /for \(const x of g\.names\)/.test(over) && !/weitere/.test(over), 'Abspann: nicht alle Namen');
  ok(/el\('p', 'gedenken', card, GEDENKEN\);\s*$/.test(over), 'Abspann: das Gedenken steht nicht am Ende');
  credits = `Danke an aus ${fmtNum(g.t / 60)} min Stream: ${groups.map((x) => `${x.title} ${x.names.length}`).join(', ')}`;
}

// ---------- Kleinigkeiten der Menüs und der Anzeige ----------
{
  const { Menus } = await import('../src/ui/menus.js');
  const { UI } = await import('../src/ui/ui.js');
  // Tipp der Steuerung: Die Stimmung des Chats steht nirgends (kein Gesicht oben im Chat)
  ok(!/Gesicht oben im Chat/.test(src('src/ui/menus.js')), 'Tipp nennt das Gesicht oben im Chat, das es nicht mehr gibt');
  // M oder C in den Einstellungen: Der Fokus bleibt auf genau dem Knopf einer Auswahl, nicht auf dem ersten der Reihe
  const asked = [];
  const screen = { contains: () => true, querySelector: (q) => (asked.push(q), q === '.card' ? null : { focus() {} }) };
  const keep = globalThis.document;
  globalThis.document = { activeElement: { dataset: { key: 'kurve', value: 'stark' } } };
  Menus.prototype.refresh.call({ current: 'settings', screens: { settings: screen }, data: {}, h: {}, render_settings() {}, watchScroll() {} }, 'settings');
  ok(asked.includes('[data-key="kurve"][data-value="stark"]'), `Fokus nach refresh: ${asked.join(' ')}`);
  globalThis.document = keep;
  // derselbe Bildschirm zweimal beobachtet (Hinweise der Höhendaten auf und zu): ein Zuhörer, nicht zwei
  const RO = globalThis.ResizeObserver;
  globalThis.ResizeObserver = class {
    observe() {}
    disconnect() {}
  };
  const fns = new Set();
  const card = { addEventListener: (k, f) => fns.add(f), removeEventListener: (k, f) => fns.delete(f), classList: { toggle() {} } };
  const about = { querySelector: () => card };
  const m = {};
  for (let i = 0; i < 3; i++) Menus.prototype.watchScroll.call(m, about);
  ok(fns.size === 1, `Über das Spiel: ${fns.size} Scroll-Zuhörer auf derselben Karte`);
  globalThis.ResizeObserver = RO;
  // Blitzerfotos: der Abspann zeigt drei, mehr hebt die Anzeige nicht auf
  const node = () => ({ classList: { add() {}, remove() {} }, appendChild() {}, set textContent(v) {} });
  globalThis.document = { createElement: node };
  const u = { photos: [], photoEl: node() };
  for (let i = 0; i < 8; i++) UI.prototype.photo.call(u, 'data:image/jpeg;base64,' + i, 130 + i, '18:0' + i);
  ok(u.photos.length === 3 && u.photos[2].kmh === 137, `Blitzerfotos aufgehoben: ${u.photos.length}`);
  globalThis.document = keep;
  // die Karte öffnet ohne Schwung, Flug oder Doppeltipp vom letzten Mal
  ok(/mount\(s, d\) \{[^}]*this\.vel = \[0, 0\];\s*this\.fly = null;\s*this\.zoom = null;\s*this\.lastTap = null;/.test(src('src/ui/mapscreen.js')), 'Karte: mount setzt Schwung und Flug nicht zurück');
}

// Rundenbilanz (Besitzer, 25.11.): die Einnahmen nur einmal (groß oben), eine Kachel für BrunnenTV-Folgen statt zwei
{
  const m = src('src/ui/menus.js');
  const route = m.slice(m.indexOf('  routeBlock(card, o) {'), m.indexOf('const draw = () =>', m.indexOf('  routeBlock(card, o) {')));
  ok(!/'eingenommen'/.test(route), 'Rundenbilanz: keine zweite Kachel „eingenommen“');
  ok(!/Brunnen besucht/.test(route), 'Rundenbilanz: keine Kachel „Brunnen besucht“ neben den BrunnenTV-Folgen');
  ok((route.match(/item\(/g) || []).length === 3, 'Rundenbilanz: drei Kacheln (gefahren, Folgen, Ladestopps)');
  ok(/over-money[\s\S]{0,120}signedCent\(o\.money\)/.test(m), 'Rundenbilanz: die Einnahmen stehen groß oben');
}

console.log(fails ? `menues-test: ${fails} von ${checks} Prüfungen FEHLGESCHLAGEN` : `menues-test: alles grün (${checks} Prüfungen: Steuerung aus ${rows.length} Zeilen, jede Belegung genannt; Feedback als Link zu GitHub; ${credits})`);
process.exit(fails ? 1 : 0);
