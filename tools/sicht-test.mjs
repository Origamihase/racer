// Freie Sicht ohne Browser: die Geometrie aus src/ui/sicht.js auf allen Formaten, die gekauften Abdeckungen als
// einzige Ausnahme und die drei Sprachdurchsagen des 19.11. Aufruf: node tools/sicht-test.mjs (Teil von „npm test“).
// Der Browser-Teil (jede Einblendung gegen dasselbe Rechteck gemessen) ist tools/sicht-check.js.
import { freeView, isNarrow, isCompact, chatBottom, chatWidth, infoWidth, stripWidth, cockpitParts, droneCar, overlap, COVERS, HOMES, NARROW_MID } from '../src/ui/sicht.js';
import { BOARD, STUDIO, MEGAFON_WUENSCHE, BRUNNEN_MEGAFON, BRUNNEN_NOMI, DURCHSAGEN, DURCHSAGEN_REGEN, RAHMEN, RAHMEN_GAP } from '../src/data.js';
import { DAMAGE_LINES } from '../src/game/damage.js';
import { readFileSync } from 'node:fs';

let fails = 0;
const check = (ok, text) => {
  if (!ok) fails++;
  console.log((ok ? '  ✓ ' : '  ✗ ') + text);
};
const px = (r) => `${Math.round(r.left)}–${Math.round(r.right)} × ${Math.round(r.top)}–${Math.round(r.bottom)}`;

// Formate aus SICHT.md Abschnitt 4: Name, Breite, Höhe, Touch, Streifen unter den Feldern?
const FORMATS = [
  ['Desktop 16:9', 1280, 720, false, false],
  ['Desktop 16:9', 1920, 1080, false, false],
  ['Desktop 4:3', 1024, 768, false, false],
  ['Desktop 21:9', 2560, 1080, false, false],
  ['Handy quer', 844, 390, true, false],
  ['Handy quer', 667, 375, true, false],
  ['Handy hochkant', 390, 844, true, true],
];

console.log('Freie Sicht: Rechteck, Streifen und Instrumente je Format');
for (const [name, W, H, touch, narrow] of FORMATS) {
  const f = freeView(W, H, { touch });
  const tag = `${name} ${W} × ${H}`;
  console.log(`  ${tag}: frei ${px(f)} (${Math.round((100 * f.top) / H)} % bis ${Math.round((100 * f.bottom) / H)} % der Höhe), Streifen oben ${f.top} px, unten ${H - f.bottom} px`);
  check(isNarrow(W, H) === narrow, `${tag}: Streifen ${narrow ? 'unter' : 'zwischen'} den Feldern`);
  check(f.right - f.left >= 0.3 * W && f.bottom - f.top >= H / 3, `${tag}: die freie Sicht ist mindestens 30 % breit und ein Drittel hoch`);
  if (!touch) check(f.top <= 0.2 * H && f.bottom >= 0.88 * H - 0.5, `${tag}: frei von höchstens 20 % bis mindestens 88 % der Höhe`);
  if (W / H > 1.7 && !touch) check(f.top <= 0.162 * H, `${tag}: auf 16:9 und breiter beginnt die freie Sicht bei höchstens 16 %`);
  if (!narrow) {
    check(f.left >= 14 + infoWidth(W, H) && f.right <= W - 14 - chatWidth(W, H), `${tag}: Info-Feld und Chat liegen neben der freien Sicht`);
    check(stripWidth(W, H) >= NARROW_MID, `${tag}: der Streifen oben ist mindestens ${NARROW_MID} px breit (${Math.round(stripWidth(W, H))} px)`);
  } else check(f.top >= chatBottom(H), `${tag}: die freie Sicht beginnt unter dem Chat`);
  // Drohne: Der eigene Wagen liegt in der freien Sicht. Auf dem Handy ist dafür kein Platz: Quer reicht der Wagen bis
  // 92 % der Höhe, hochkant stehen darunter gleich die Knöpfe – dort liegt sein unterster Rand (Stoßstange, Schatten)
  // im Streifen unten, wenn ein Untertitel drei Zeilen braucht. Mehr als ein Drittel des Wagens darf es nie sein.
  const car = droneCar(W, H);
  const out = Math.max(0, car.bottom - f.bottom);
  if (touch) check(out <= (car.bottom - car.top) / 3 && car.top >= f.top, `${tag}: der Wagen der Drohnenansicht ragt höchstens ein Drittel in den Streifen unten (${Math.round(out)} px von ${Math.round(car.bottom - car.top)})`);
  else check(car.top >= f.top && car.bottom <= f.bottom + 0.5 && car.left >= f.left && car.right <= f.right, `${tag}: der Wagen der Drohnenansicht liegt ganz in der freien Sicht (${px(car)})`);
  // Cockpit: Der Streifen unten liegt unter dem Mittelbildschirm. Der Streifen oben (zwischen den Feldern, von der
  // Oberkante bis zur freien Sicht) bleibt über dem Innenspiegel. Auf dem Handy quer beginnt der Spiegel gleich
  // unter dem Chat: Dort reicht die dritte Reihe, wenn sie die volle Breite braucht, in seine linke obere Ecke –
  // höchstens ein Zehntel der Spiegelfläche.
  const { mirror, screen } = cockpitParts(W, H);
  check(screen.bottom <= f.bottom, `${tag}: der Mittelbildschirm endet über dem Streifen unten (${Math.round(screen.bottom)} ≤ ${f.bottom})`);
  if (!narrow) {
    const strip = { left: f.left, right: f.right, top: 0, bottom: f.top };
    const cut = overlap(strip, mirror) ? ((Math.min(strip.right, mirror.right) - mirror.left) * (strip.bottom - mirror.top)) / ((mirror.right - mirror.left) * (mirror.bottom - mirror.top)) : 0;
    if (isCompact(W, H)) check(cut <= 0.1, `${tag}: der Streifen oben reicht höchstens in ein Zehntel des Innenspiegels (${Math.round(cut * 100)} %)`);
    else check(cut === 0, `${tag}: der Streifen oben bleibt über dem Innenspiegel (Spiegel ab ${Math.round(mirror.left)} × ${Math.round(mirror.top)})`);
  }
}
check(!overlap({ left: 0, top: 0, right: 10, bottom: 10 }, { left: 10, top: 0, right: 20, bottom: 10 }) && overlap({ left: 0, top: 0, right: 10, bottom: 10 }, { left: 9, top: 9, right: 20, bottom: 20 }), 'overlap(): Berührung zählt nicht, Überschneidung schon');
check(Object.keys(HOMES).length >= 10, `jede Einblendung hat einen Platz (${Object.keys(HOMES).length} Plätze)`);

console.log('Die gekauften Abdeckungen sind die einzige Ausnahme');
const DUR = { haelfte: 3.5, elsa: 6, pappkarton: 8 };
check(COVERS.length === 3 && COVERS.every((id) => id in DUR), `Ausnahmen mit Namen: ${COVERS.join(', ')}`);
for (const id of COVERS) {
  const r = RAHMEN.find((x) => x.id === id);
  check(!!r && r.dur === DUR[id], `${id}: „${r && r.name}“ dauert ${DUR[id]} s`);
}
// Die Ereignis-Uhr läuft mit einem gut gelaunten Publikum bis zu 1,8-mal so schnell (Game.updateEvents)
const longest = Math.max(...RAHMEN.map((r) => r.dur));
check(RAHMEN_GAP.min === 75 && RAHMEN_GAP.max > RAHMEN_GAP.min, `zwischen zwei Rahmen liegen mindestens ${RAHMEN_GAP.min} s der Ereignis-Uhr`);
check(RAHMEN_GAP.min / 1.8 > longest, `nie zwei zugleich: Der längste Rahmen dauert ${longest} s, der nächste kommt frühestens nach ${(RAHMEN_GAP.min / 1.8).toFixed(1)} s`);

console.log('Sprachdurchsagen');
const has = (list, voice, text) => list.filter((d) => d.voice === voice && d.text === text).length === 1;
check(DURCHSAGEN[0].voice === 'kassandra' && DURCHSAGEN[0].text === 'Treffen sich zwei Unterhosen. Fragt die eine: Warst du im Urlaub? Du bist so braun.', 'der Unterhosen-Witz steht wieder vorn, Wort für Wort');
check(has(DURCHSAGEN, 'william', 'Mein Sack ist nass!'), '„Mein Sack ist nass!“ (Brüll-William)');
check(has(DURCHSAGEN, 'kassandra', 'Achtung, Achtung. Das Tralala bitte nicht anfassen.'), '„Achtung, Achtung. Das Tralala bitte nicht anfassen.“ (Fräulein Kassandra)');
check(DURCHSAGEN_REGEN.some((d) => d.text.startsWith('Treffen sich zwei Scheibenwischer.')) && !DURCHSAGEN.some((d) => d.text.includes('Scheibenwischer')), 'der Scheibenwischer-Witz bleibt, in der Regenliste');
const all = [...DURCHSAGEN, ...DURCHSAGEN_REGEN].map((d) => d.text);
check(new Set(all).size === all.length, `keine Durchsage doppelt (${all.length} Zeilen)`);

// Der Browser-Teil misst den Untertitel mit dem längsten Satz jedes Sprechers: In den Daten ist keiner länger
console.log('Die längsten Sätze der Browser-Prüfung');
const browser = readFileSync(new URL('./sicht-check.js', import.meta.url), 'utf8');
const LONG = Function('return ' + browser.match(/const LONG = (\{[\s\S]*?\});/)[1])();
const flat = (x) => (typeof x === 'string' ? [x] : x && typeof x === 'object' ? Object.values(x).flatMap(flat) : []);
const maxLen = (x) => Math.max(...flat(x).map((t) => t.length));
// ({city} in einer Durchsage und {ort} in BrunnenTV werden ein Ortsname: dafür 20 Zeichen Luft; {n} ist die Folge)
const town = (list, key) => list.map((t) => t.replace('{' + key + '}', 'x'.repeat(20)));
const spoken = {
  nomi: [BOARD, DAMAGE_LINES, BRUNNEN_NOMI.map((t) => t.replace('{n}', '9.999'))],
  studio: [STUDIO],
  durchsage: [town(all, 'city')],
  megafon: [MEGAFON_WUENSCHE, town(BRUNNEN_MEGAFON, 'ort')],
};
for (const [who, lists] of Object.entries(spoken)) check(maxLen(lists) <= LONG[who].length, `${who}: längster Satz ${maxLen(lists)} Zeichen, gemessen wird mit ${LONG[who].length}`);
check(all.includes(browser.match(/const BREIT = '([^']+)';/)[1]), 'die Sprachdurchsage mit den meisten Zeilen (BREIT) steht so in den Daten');

if (fails) {
  console.error(`sicht-test: ${fails} FEHLER`);
  process.exit(1);
}
console.log('sicht-test: alles in Ordnung');
