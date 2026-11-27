// Prüfstand Autoradio (src/radio.js): zuerst aus, Taste R schaltet aus → JAM FM → Bayern 1 → aus, eine Adresse, die
// nicht geht, führt zur nächsten (keine: „kein Empfang“), leiser beim Sprechen, stumm ohne Ton; der Chat hört mit.
import { readFileSync } from 'node:fs';
import { Radio, RADIO } from '../src/radio.js';
import { ACTIONS } from '../src/input.js';
import { RADIO_LINES } from '../src/data.js';
import { makeStream, DRIVERS } from './stream-sim.mjs';
import { mainSource } from './lib/main-source.mjs';

let fails = 0;
let checks = 0;
const ok = (cond, msg) => {
  checks++;
  if (!cond) {
    fails++;
    console.log('  FEHLER: ' + msg);
  }
};

/** Attrappe eines <audio>-Elements: merkt sich die Adressen, play() gelingt oder nicht (fail). */
function fakeAudio(fail = () => false) {
  const el = {
    src: '', volume: 1, paused: true, played: [], on: {},
    addEventListener(k, f) {
      (this.on[k] ||= []).push(f);
    },
    emit(k) {
      for (const f of this.on[k] || []) f();
    },
    play() {
      this.paused = false;
      this.played.push(this.src);
      return fail(this.src) ? Promise.reject(new Error('nein')) : Promise.resolve();
    },
    pause() {
      this.paused = true;
    },
    removeAttribute(k) {
      if (k === 'src') this.src = '';
    },
    load() {},
  };
  return el;
}
const tick = () => new Promise((r) => setTimeout(r, 0));

// Sender: JAM FM zuerst, dann Bayern 1; nur https (die Seite läuft über https)
ok(RADIO.stations.map((s) => s.id).join() === 'jamfm,bayern1', `Sender: ${RADIO.stations.map((s) => s.id)}`);
ok(RADIO.stations.every((s) => s.urls.length >= 2 && s.urls.every((u) => u.startsWith('https://'))), 'Adressen: mindestens zwei je Sender, nur https');
ok(ACTIONS.KeyR === 'radio', 'Taste R schaltet das Radio nicht');

// zuerst aus, dann der Reihe nach
{
  let el = null;
  const r = new Radio(() => (el = fakeAudio()));
  ok(r.index === -1 && r.label === null && r.status === 'aus' && el === null, 'Radio ist am Anfang nicht aus');
  const order = [r.cycle(), r.cycle(), r.cycle()].map((s) => s && s.id);
  ok(order.join() === 'jamfm,bayern1,', `Reihenfolge: ${order}`);
  ok(el.paused && el.src === '' && r.label === null, 'aus: spielt noch');
  r.cycle();
  ok(el.src === RADIO.stations[0].urls[0] && r.status === 'sucht' && /sucht/.test(r.label), `JAM FM: ${el.src} ${r.status}`);
  el.emit('playing');
  ok(r.status === 'an' && r.label === 'JAM FM', `Empfang: ${r.status} ${r.label}`);
  // Lautstärke: weich auf RADIO.vol, beim Sprechen leiser, ohne Ton stumm
  for (let i = 0; i < 60; i++) r.update(1 / 30, { sound: true });
  ok(Math.abs(el.volume - RADIO.vol) < 0.01, `Lautstärke ${el.volume}`);
  for (let i = 0; i < 60; i++) r.update(1 / 30, { sound: true, duck: true });
  ok(Math.abs(el.volume - RADIO.vol * RADIO.duck) < 0.01, `beim Sprechen ${el.volume}`);
  for (let i = 0; i < 60; i++) r.update(1 / 30, { sound: false });
  ok(el.volume < 0.01, `ohne Ton ${el.volume}`);
  // Seite im Hintergrund: anhalten, danach wieder live
  r.hold(true);
  ok(el.paused, 'im Hintergrund spielt es weiter');
  r.hold(false);
  ok(!el.paused && el.src === RADIO.stations[0].urls[0], 'danach nicht wieder an');
  r.off();
  ok(r.index === -1 && el.paused, 'off()');
}

// eine Adresse geht nicht: die nächste; keine geht: „kein Empfang“
{
  let el = null;
  const r = new Radio(() => (el = fakeAudio((u) => u === RADIO.stations[0].urls[0])));
  const changes = [];
  r.onChange = (x) => changes.push(x.status);
  r.cycle();
  await tick();
  ok(el.played.length === 2 && el.src === RADIO.stations[0].urls[1], `nächste Adresse: ${el.played}`);
  const all = new Radio(() => (el = fakeAudio(() => true)));
  all.cycle();
  for (let i = 0; i < 5; i++) await tick();
  ok(all.status === 'kein Empfang' && /kein Empfang/.test(all.label) && el.played.length === RADIO.stations[0].urls.length, `alle aus: ${all.status} ${el.played.length}`);
  // ein Fehler, doppelt gemeldet (Ereignis und play()), überspringt nur eine Adresse
  const twice = new Radio(() => (el = fakeAudio((u) => u === RADIO.stations[0].urls[0])));
  twice.cycle();
  el.emit('error');
  for (let i = 0; i < 3; i++) await tick();
  ok(el.src === RADIO.stations[0].urls[1] && el.played.length === 2, `doppelter Fehler: ${el.played}`);
  // wer zu lange sucht, versucht die nächste Adresse
  const slow = new Radio(() => (el = fakeAudio()));
  slow.cycle();
  slow.update(RADIO.wait + 0.1);
  ok(el.src === RADIO.stations[0].urls[1], 'zu lange gesucht: keine nächste Adresse');
}

// im Stream: der Chat hört mit (nicht bei jedem schnellen Weiterschalten)
{
  const S = makeStream({ driver: DRIVERS.mittel, seed: 2, endless: true });
  const g = S.game;
  S.step(5);
  const n0 = S.log.chat.length;
  g.onRadio('jamfm');
  g.onRadio('bayern1');
  S.step(5);
  const lines = S.log.chat.slice(n0).map((c) => c.text);
  ok(lines.some((t) => RADIO_LINES.jamfm.includes(t)) && !lines.some((t) => RADIO_LINES.bayern1.includes(t)), `Chat zum Radio: ${lines.join(' | ')}`);
  S.step(10);
  g.onRadio(null);
  S.step(5);
  ok(S.log.chat.some((c) => RADIO_LINES.aus.includes(c.text)), 'Chat zum Ausschalten');
}

// main.js: das Radio gehört dem Wagen, ist zuerst aus und wird nicht gespeichert
{
  const m = mainSource();
  ok(/const radio = new Radio\(\)/.test(m) && !/settings\.radio|save\.radio/.test(m), 'Radio wird gespeichert oder fehlt');
  ok(/input\.take\('radio'\)\) radioCycle\(\)/.test(m) && /a === 'radio'/.test(m) && /radio\.update\(dt/.test(m) && /st\.radio = radio\.label/.test(m), 'Radio nicht verdrahtet');
  ok(/st\.radio/.test(readFileSync(new URL('../src/cockpit/screen.js', import.meta.url), 'utf8')), 'Mittelbildschirm zeigt das Radio nicht');
}

console.log(`radio-test: ${fails ? fails + ' Fehler' : 'alles gut'} (${checks} Prüfungen)`);
process.exit(fails ? 1 : 0);
