// Ladepreis je Ladeplatz (der Besitzer am 25.11.2026: „Verwende für Deutschland 0,46 bis 0,59 €/kWh (mit Ladekarte).
// Im Ausland soll der Preis höher sein“ – und zur leeren Tafel auf der Säule: „Der Preis könnte auf der leeren Tafel,
// die sich auf der Ladesäule befindet, ausgeschrieben werden. x €/kWh (oder eine andere Währung im Ausland)“).
// Jeder Ladepark an der Autobahn und jede Ladesäule eines Orts hat ihren festen Preis, gezogen aus ihrem Namen (nie
// neu gewürfelt): in Deutschland in Cent-Schritten im Band DE, im Ausland teurer (Band AUSLAND, in Euro gerechnet) und
// in der Landeswährung als runder Betrag. Eine Quelle für alles: Die Säulen der Welt zeigen label (towns.js), der Akku
// merkt sich den Preis beim Einstecken, die Rechnung bucht kWh × euro (game/akku.js, parts/ziel.js). Rein rechnerisch
// aus der Karte, läuft auch unter Node.
import { nodes, places } from './graph.js';
import { PARKS } from './parks.js';
import { hashKey } from '../world/kit/layout.js';
import { fmtNum } from '../util.js';

/** Preisbänder in Euro je kWh, Schritt 1 Cent: Deutschland (mit Ladekarte) und das Ausland (umgerechnet). */
export const LADEPREIS = { de: [0.46, 0.59], ausland: [0.65, 0.79] };

/**
 * Währungen der Länder mit Ladeplätzen (alle Orte der Karte sind erreichbar, auch per Fähre und Luftfracht, und jeder
 * Ort auf dem Weg hat seine Säule): kurs = so viel Landeswährung je Euro – feste Kurse im Spiel (gerundet, Stand Ende
 * 2025; der Kap-Verde-Escudo hängt fest am Euro), damit eine Säule immer denselben Preis zeigt; step: ein runder
 * Preisschritt dort, dec: Nachkommastellen, zeichen: wie die Säule die Währung schreibt.
 */
export const WAEHRUNG = {
  EUR: { kurs: 1, step: 0.01, dec: 2, zeichen: '€' },
  CHF: { kurs: 0.93, step: 0.01, dec: 2, zeichen: 'CHF' },
  CZK: { kurs: 24.3, step: 0.1, dec: 2, zeichen: 'Kč' },
  PLN: { kurs: 4.24, step: 0.01, dec: 2, zeichen: 'zł' },
  DKK: { kurs: 7.46, step: 0.05, dec: 2, zeichen: 'kr.' },
  SEK: { kurs: 10.9, step: 0.1, dec: 2, zeichen: 'kr' },
  NOK: { kurs: 11.7, step: 0.1, dec: 2, zeichen: 'kr' },
  GBP: { kurs: 0.87, step: 0.01, dec: 2, zeichen: '£' },
  USD: { kurs: 1.16, step: 0.01, dec: 2, zeichen: '$' },
  CAD: { kurs: 1.62, step: 0.01, dec: 2, zeichen: 'CA$' },
  MXN: { kurs: 21.3, step: 0.1, dec: 2, zeichen: 'MX$' },
  JPY: { kurs: 176, step: 1, dec: 0, zeichen: '¥' },
  ZAR: { kurs: 20.2, step: 0.1, dec: 2, zeichen: 'Rand' },
  JOD: { kurs: 0.82, step: 0.01, dec: 2, zeichen: 'JD' },
  AMD: { kurs: 445, step: 5, dec: 0, zeichen: 'Dram' },
  DOP: { kurs: 74, step: 1, dec: 0, zeichen: 'RD$' },
  CVE: { kurs: 110.265, step: 1, dec: 0, zeichen: 'Esc.' },
};
/** Länder (ISO-Code der Karte) mit eigener Währung; alle anderen Länder der Karte zahlen in Euro. */
export const LANDESWAEHRUNG = {
  CH: 'CHF', LI: 'CHF', CZ: 'CZK', PL: 'PLN', DK: 'DKK', SE: 'SEK', NO: 'NOK', GB: 'GBP', US: 'USD', CA: 'CAD',
  MX: 'MXN', JP: 'JPY', ZA: 'ZAR', JO: 'JOD', AM: 'AMD', DO: 'DOP', CV: 'CVE',
};
/** Länder der Karte, die in Euro zahlen (die Prüfstände halten beide Listen vollständig). */
export const EURO_LAENDER = ['DE', 'AT', 'BE', 'ES', 'FI', 'FR', 'HR', 'IE', 'IT', 'LT', 'LU', 'MC', 'MT', 'NL', 'PT', 'VA'];

/** Währung eines Lands (Code aus WAEHRUNG). */
export const waehrungOf = (cc) => LANDESWAEHRUNG[cc] ?? 'EUR';

/** Ein Betrag der Währung cur, wie die Säule und die Rechnung ihn schreiben: „18,90 Kč“, „120 ¥“ (geschützt). */
export function fmtWaehrung(v, cur) {
  const W = WAEHRUNG[cur];
  return fmtNum(v, W.dec) + ' ' + W.zeichen;
}

// FNV-1a streut die unteren Bits kaum: einmal nachmischen, dann gleichmäßig über das Band
function streu(key) {
  let h = hashKey('Ladepreis ' + key);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  return (h ^ (h >>> 16)) >>> 0;
}

/**
 * Preis eines Ladeplatzes aus Land und Schlüssel: { cc, cur, local (je kWh in der Landeswährung), euro (je kWh, in
 * Euro umgerechnet, ungerundet), label („0,52 €/kWh“), num („0,52“), unit („€/kWh“) }.
 */
export function preisFuer(cc, key) {
  const h = streu(key);
  if (cc === 'DE') {
    const [a, b] = LADEPREIS.de;
    const n = Math.round((b - a) * 100) + 1;
    return preis(cc, 'EUR', (Math.round(a * 100) + (h % n)) / 100);
  }
  const [a, b] = LADEPREIS.ausland;
  const n = Math.round((b - a) * 100) + 1;
  const ziel = (Math.round(a * 100) + (h % n)) / 100;
  const cur = waehrungOf(cc);
  const W = WAEHRUNG[cur];
  // runder Preis in der Landeswährung; liegt er umgerechnet knapp außerhalb des Bands, einen Schritt nach innen
  let k = Math.round((ziel * W.kurs) / W.step);
  if ((k * W.step) / W.kurs < a - 1e-9) k++;
  if ((k * W.step) / W.kurs > b + 1e-9) k--;
  return preis(cc, cur, +(k * W.step).toFixed(W.dec));
}
function preis(cc, cur, local) {
  const W = WAEHRUNG[cur];
  const num = fmtNum(local, W.dec);
  const unit = W.zeichen + '/kWh';
  return { cc, cur, local, euro: local / W.kurs, label: num + ' ' + unit, num, unit };
}

const memo = new Map();
/**
 * Preis des Ladeplatzes eines Ladestopps oder einer Säule der Welt: park = Index in PARKS (Ladepark an der Autobahn,
 * Land seiner Ausfahrt – „Ladepark Salzburg“ steht noch in Deutschland), sonst post = Index in places (die Säule des
 * Orts, Land des Orts). Alle Säulen eines Parks kosten dasselbe. Ohne Platz: null.
 */
export function ladePreis({ park = -1, post = -1 } = {}) {
  const key = park >= 0 ? 'park:' + park : post >= 0 ? 'post:' + post : '';
  if (!key) return null;
  let p = memo.get(key);
  if (!p) {
    if (park >= 0) {
      const nd = nodes[PARKS[park].node];
      p = preisFuer(nd.cc, 'Park ' + nd.id);
    } else p = preisFuer(places[post].cc, 'Ort ' + places[post].key);
    memo.set(key, p);
  }
  return p;
}
